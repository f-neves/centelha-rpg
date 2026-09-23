"""Tamanho mínimo medido (2026-09-23): silhueta distinguível (decisão 7) e detalhe
interno (correção do usuário no mesmo dia). Símbolos sintéticos com resposta
conhecida: um quadrado e um disco se confundem pequenos e se separam grandes; duas
silhuetas iguais com nomes de tipo diferentes nunca se separam; um quadrado hachurado
perde a hachura num tamanho que depende do período dela, e um quadrado liso não tem
hachura a perder. Se a medida não achasse essas respostas, todo mínimo sairia no
extremo da grade."""

import json

import numpy as np
from PIL import Image, ImageDraw

from cartografia import legibilidade


def _simbolo(tmp_path, nome, tipo, desenho):
    im = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
    desenho(ImageDraw.Draw(im))
    im.save(tmp_path / f"{nome}.png")
    return {"id": nome, "tipo": tipo, "arquivo": f"{nome}.png", "arquivos": {"branco-opaco": f"{nome}.png"},
            "largura": 200, "altura": 200, "ancora": {"x": 100, "y": 199}, "espelhavel": False}


def quadrado(d):
    d.rectangle((10, 10, 190, 199), fill=(255, 255, 255, 255))


def disco(d):
    d.ellipse((10, 19, 190, 199), fill=(255, 255, 255, 255))


def triangulo(d):
    d.polygon([(100, 5), (195, 199), (5, 199)], fill=(255, 255, 255, 255))


# --- silhueta distinguível ----------------------------------------------------------

def test_quadrado_e_disco_se_separam_num_tamanho_intermediario(tmp_path):
    simbolos = [_simbolo(tmp_path, "q", "quadrado", quadrado), _simbolo(tmp_path, "d", "disco", disco)]
    t = legibilidade.medir_silhueta(simbolos, tmp_path, tamanhos=tuple(range(4, 61, 2)))["tipos"]
    assert t["quadrado"]["confunde_com"] == "disco"
    assert 4 < t["quadrado"]["tamanho_minimo_silhueta"] < 60
    assert not t["quadrado"]["nunca_separa"]


def test_silhuetas_iguais_nunca_se_separam(tmp_path):
    """Controle negativo: o mesmo desenho com dois nomes de tipo."""
    simbolos = [_simbolo(tmp_path, "a", "um", triangulo), _simbolo(tmp_path, "b", "outro", triangulo)]
    t = legibilidade.medir_silhueta(simbolos, tmp_path, tamanhos=(8, 20, 40))["tipos"]
    assert t["um"]["nunca_separa"] and t["um"]["tamanho_minimo_silhueta"] == 40


def test_formas_bem_diferentes_se_separam_cedo(tmp_path):
    grade = tuple(range(4, 61, 2))
    q = legibilidade.medir_silhueta([_simbolo(tmp_path, "q", "quadrado", quadrado),
                                     _simbolo(tmp_path, "t", "tri", triangulo)], tmp_path, grade)
    d = legibilidade.medir_silhueta([_simbolo(tmp_path, "q", "quadrado", quadrado),
                                     _simbolo(tmp_path, "d", "disco", disco)], tmp_path, grade)
    # o triângulo difere mais do quadrado que o disco
    assert (q["tipos"]["quadrado"]["tamanho_minimo_silhueta"]
            < d["tipos"]["quadrado"]["tamanho_minimo_silhueta"])


def test_o_ruido_de_meio_pixel_cresce_quando_o_simbolo_encolhe(tmp_path):
    s = _simbolo(tmp_path, "t", "tri", triangulo)
    ruido = legibilidade.medir_silhueta([s, _simbolo(tmp_path, "q", "q", quadrado)], tmp_path,
                                        tamanhos=(8, 100))["ruido_por_tamanho"]
    assert ruido["8"] < ruido["100"] < 1.0


# --- detalhe interno ----------------------------------------------------------------

def _hachurado(tmp_path, nome, periodo):
    """Quadrado de 200 px: silhueta cheia (branco-opaco) e, no modo padrão, traços
    verticais pretos de largura periodo/2, a cada `periodo` px."""
    cheio = Image.new("RGBA", (200, 200), (255, 255, 255, 255))
    cheio.save(tmp_path / f"{nome}-o.png")
    traco = np.zeros((200, 200, 4), dtype=np.uint8)
    if periodo:
        for x in range(0, 200, periodo):
            traco[:, x: x + periodo // 2, 3] = 255
    Image.fromarray(traco, "RGBA").save(tmp_path / f"{nome}-t.png")
    return {"id": nome, "tipo": nome, "arquivo": f"{nome}-t.png",
            "arquivos": {"branco-opaco": f"{nome}-o.png"}, "largura": 200, "altura": 200,
            "ancora": {"x": 100, "y": 199}, "espelhavel": False}


def test_o_periodo_da_hachura_e_medido(tmp_path):
    s = _hachurado(tmp_path, "h", 10)
    periodo, _ = legibilidade.diferenca_de_detalhe(s, tmp_path, (100,))
    assert periodo == 10


def test_hachura_fina_some_num_tamanho_maior_que_a_grossa(tmp_path):
    grade = tuple(range(8, 201, 2))
    t = legibilidade.medir_detalhe([_hachurado(tmp_path, "fina", 6), _hachurado(tmp_path, "grossa", 20)],
                                   tmp_path, grade)["tipos"]
    fina, grossa = t["fina"]["tamanho_minimo_detalhe"], t["grossa"]["tamanho_minimo_detalhe"]
    assert 8 < grossa < fina < 200


def test_quadrado_liso_nao_tem_hachura_a_perder(tmp_path):
    """Controle negativo: sem traço dentro, reduzido e borrado são o mesmo em todo
    tamanho, e a medida tem de dizer isso em vez de inventar um mínimo."""
    t = legibilidade.medir_detalhe([_hachurado(tmp_path, "liso", 0)], tmp_path, (20, 100, 200))["tipos"]
    assert t["liso"]["hachura_some_sempre"]


# --- as tabelas gravadas e o piso -----------------------------------------------------

def test_as_tabelas_gravadas_cobrem_todo_tipo_do_manifesto():
    manifesto = json.loads((legibilidade.RAIZ_MAPAS / "dados" / "simbolos.json").read_text(encoding="utf-8"))
    pisos = legibilidade.carregar_pisos()
    assert {s["tipo"] for s in manifesto["simbolos"]} <= set(pisos)
    assert all(isinstance(v, int) and v >= 8 for v in pisos.values())


def test_o_piso_e_o_maior_dos_dois(tmp_path):
    (tmp_path / "s.json").write_text(json.dumps({"tipos": {
        "a": {"tamanho_minimo_silhueta": 40}, "b": {"tamanho_minimo_silhueta": 10}}}), encoding="utf-8")
    (tmp_path / "d.json").write_text(json.dumps({"tipos": {
        "a": {"tamanho_minimo_detalhe": 20}, "b": {"tamanho_minimo_detalhe": 30}}}), encoding="utf-8")
    assert legibilidade.carregar_pisos(tmp_path / "s.json", tmp_path / "d.json") == {"a": 40, "b": 30}
