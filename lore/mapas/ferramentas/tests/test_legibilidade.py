"""Tamanho mínimo legível medido (2026-09-23, decisão 7). Silhuetas sintéticas com
resposta conhecida: um quadrado e um disco se confundem pequenos e se separam
grandes; duas silhuetas iguais com nomes de tipo diferentes nunca se separam. Se a
medida não achasse essa confusão, todo piso sairia no mínimo da grade."""

import json

from PIL import Image, ImageDraw

from cartografia import legibilidade


def _simbolo(tmp_path, nome, tipo, desenho):
    im = Image.new("RGBA", (200, 200), (0, 0, 0, 0))
    desenho(ImageDraw.Draw(im))
    im.save(tmp_path / f"{nome}.png")
    return {"id": nome, "tipo": tipo, "arquivos": {"branco-opaco": f"{nome}.png"},
            "largura": 200, "altura": 200, "ancora": {"x": 100, "y": 199}, "espelhavel": False}


def quadrado(d):
    d.rectangle((10, 10, 190, 199), fill=(255, 255, 255, 255))


def disco(d):
    d.ellipse((10, 19, 190, 199), fill=(255, 255, 255, 255))


def triangulo(d):
    d.polygon([(100, 5), (195, 199), (5, 199)], fill=(255, 255, 255, 255))


def test_quadrado_e_disco_se_separam_num_tamanho_intermediario(tmp_path):
    simbolos = [_simbolo(tmp_path, "q", "quadrado", quadrado), _simbolo(tmp_path, "d", "disco", disco)]
    t = legibilidade.medir(simbolos, tmp_path, tamanhos=tuple(range(4, 61, 2)))["tipos"]
    assert t["quadrado"]["confunde_com"] == "disco"
    assert 4 < t["quadrado"]["piso"] < 60
    assert not t["quadrado"]["nunca_separa"]


def test_silhuetas_iguais_nunca_se_separam(tmp_path):
    """Controle negativo: o mesmo desenho com dois nomes de tipo."""
    simbolos = [_simbolo(tmp_path, "a", "um", triangulo), _simbolo(tmp_path, "b", "outro", triangulo)]
    t = legibilidade.medir(simbolos, tmp_path, tamanhos=(8, 20, 40))["tipos"]
    assert t["um"]["nunca_separa"] and t["um"]["piso"] == 40


def test_formas_bem_diferentes_se_separam_cedo(tmp_path):
    simbolos = [_simbolo(tmp_path, "q", "quadrado", quadrado), _simbolo(tmp_path, "t", "tri", triangulo)]
    q = legibilidade.medir(simbolos, tmp_path, tamanhos=tuple(range(4, 61, 2)))["tipos"]["quadrado"]
    d = legibilidade.medir([_simbolo(tmp_path, "q", "quadrado", quadrado), _simbolo(tmp_path, "d", "disco", disco)],
                           tmp_path, tamanhos=tuple(range(4, 61, 2)))["tipos"]["quadrado"]
    assert q["piso"] < d["piso"]      # triângulo difere mais do quadrado que o disco


def test_o_ruido_de_meio_pixel_cresce_quando_o_simbolo_encolhe(tmp_path):
    s = _simbolo(tmp_path, "t", "tri", triangulo)
    ruido = legibilidade.medir([s, _simbolo(tmp_path, "q", "q", quadrado)], tmp_path,
                               tamanhos=(8, 100))["ruido_por_tamanho"]
    assert ruido["8"] < ruido["100"] < 1.0


def test_a_tabela_gravada_cobre_todo_tipo_do_manifesto():
    manifesto = json.loads((legibilidade.RAIZ_MAPAS / "dados" / "simbolos.json").read_text(encoding="utf-8"))
    tabela = legibilidade.carregar()
    assert {s["tipo"] for s in manifesto["simbolos"]} <= set(tabela)
    assert all(isinstance(v, int) and v >= 8 for v in tabela.values())

