"""Primeiro renderizador (noite 2, 2026-09-23): Poisson-disc, nada no mar, ordem de
desenho de cima para baixo e determinismo. Tudo com mundo e biblioteca SINTÉTICOS,
pequenos, para o teste ser rápido e para cada regra ter um caso que precisa falhar.
"""

import io
import json
import math

import numpy as np
import pytest
from PIL import Image

from cartografia import raster, renderizador

KM_POR_GRAU = 138.993658
PPG = 111.194927


def _biblioteca(tmp_path, cores=None):
    """Dois símbolos do tipo 'montanha': quadrados opacos (modo branco-opaco), um
    vermelho e um azul, com a âncora no meio da base."""
    cores = cores or {"montanha-01": (200, 0, 0), "montanha-02": (0, 0, 200)}
    simbolos = []
    for sid, cor in cores.items():
        im = Image.new("RGBA", (40, 40), cor + (255,))
        rel = f"{sid}.png"
        im.save(tmp_path / rel)
        simbolos.append({"id": sid, "tipo": "montanha", "arquivo": rel,
                         "arquivos": {"so-traco": rel, "branco-opaco": rel},
                         "modo_padrao": "branco-opaco", "largura": 40, "altura": 40,
                         "ancora": {"x": 20, "y": 39}, "espelhavel": False})
    (tmp_path / "m.json").write_text(json.dumps({"simbolos": simbolos}), encoding="utf-8")
    return renderizador.Biblioteca.carregar(tmp_path / "m.json", raiz=tmp_path)


def _area(anel, valor="montanha", semente=7):
    return {"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [anel + [anel[0]]]},
            "properties": {"id": "a", "camada": "relevo", "valor": valor, "semente_ruido": semente}}


JANELA = raster.Janela(0, 0, 6, 6, PPG)          # 667 x 667 px
AREA = _area([[1, 1], [5, 1], [5, 5], [1, 5]])


# --- Poisson-disc -------------------------------------------------------------

def test_poisson_respeita_a_distancia_e_a_mascara():
    mascara = np.zeros((300, 300), dtype=bool)
    mascara[50:250, 50:250] = True
    pontos = renderizador.poisson_disc(mascara, 20.0, np.random.default_rng(1))
    assert len(pontos) > 40
    for x, y in pontos:
        assert mascara[int(y), int(x)]
    arr = np.array(pontos)
    d = np.sqrt(((arr[:, None, :] - arr[None, :, :]) ** 2).sum(-1))
    np.fill_diagonal(d, np.inf)
    assert d.min() >= 20.0


def test_poisson_em_mascara_vazia_nao_poe_nada():
    assert renderizador.poisson_disc(np.zeros((100, 100), dtype=bool), 10.0,
                                     np.random.default_rng(1)) == []


def test_poisson_cobre_manchas_separadas():
    mascara = np.zeros((200, 400), dtype=bool)
    mascara[50:150, 20:120] = True
    mascara[50:150, 280:380] = True
    pontos = renderizador.poisson_disc(mascara, 15.0, np.random.default_rng(3))
    assert any(x < 200 for x, _ in pontos) and any(x > 200 for x, _ in pontos)


# --- nada no mar --------------------------------------------------------------

def test_area_toda_no_mar_nao_ganha_simbolo(tmp_path):
    """Controle negativo: a mesma área, sem terra embaixo, não pode ter símbolo."""
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    _, com_terra = renderizador.renderizar([AREA], JANELA, terra, bib, KM_POR_GRAU)
    _, sem_terra = renderizador.renderizar([AREA], JANELA, ~terra, bib, KM_POR_GRAU)
    assert len(com_terra) > 5
    assert sem_terra == []


def test_nenhuma_ancora_cai_no_mar(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.zeros((JANELA.altura, JANELA.largura), dtype=bool)
    terra[:, : JANELA.largura // 2] = True        # só a metade oeste é terra
    _, colocacoes = renderizador.renderizar([AREA], JANELA, terra, bib, KM_POR_GRAU)
    assert colocacoes
    for c in colocacoes:
        assert terra[int(c.y), int(c.x)]
        meia = 0.35 * c.maior_lado
        assert terra[int(c.y), int(c.x + meia)] and terra[int(c.y), int(c.x - meia)]


def test_base_com_a_ponta_no_mar_e_recusada():
    terra = np.zeros((50, 100), dtype=bool)
    terra[:, :60] = True
    assert renderizador.base_em_terra(terra, 40, 20, 10)
    assert not renderizador.base_em_terra(terra, 55, 20, 10)   # a ponta leste cai no mar


# --- ordem de desenho ---------------------------------------------------------

def test_o_que_esta_ao_sul_fica_na_frente(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.ones((200, 200), dtype=bool)
    norte = renderizador.Colocacao("montanha-01", 100, 100, 40, False, 0.0)   # vermelho
    sul = renderizador.Colocacao("montanha-02", 110, 115, 40, False, 0.0)     # azul, mais embaixo
    for ordem in ([norte, sul], [sul, norte]):    # a ordem da lista não pode importar
        img = np.asarray(renderizador.desenhar(terra, ordem, bib))
        # pixel na sobreposição dos dois quadrados
        assert tuple(img[100, 105]) == (0, 0, 200)


# --- determinismo -------------------------------------------------------------

def test_mesmo_dado_da_a_mesma_imagem(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    def png():
        img, _ = renderizador.renderizar([AREA], JANELA, terra, bib, KM_POR_GRAU)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()
    assert png() == png()


def test_semente_diferente_espalha_diferente(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    _, a = renderizador.renderizar([AREA], JANELA, terra, bib, KM_POR_GRAU)
    _, b = renderizador.renderizar([_area([[1, 1], [5, 1], [5, 5], [1, 5]], semente=8)],
                                   JANELA, terra, bib, KM_POR_GRAU)
    assert [(c.x, c.y) for c in a] != [(c.x, c.y) for c in b]


def test_valor_sem_mistura_nao_desenha_nada(tmp_path):
    """`campo` e `planicie` não têm símbolo: a área existe e não põe nada."""
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    _, c = renderizador.renderizar([_area([[1, 1], [5, 1], [5, 5], [1, 5]], valor="planicie")],
                                   JANELA, terra, bib, KM_POR_GRAU)
    assert c == []


def test_todo_tipo_usado_tem_piso_legivel_e_mistura_valida():
    """O piso de tamanho é aplicado na colocação; aqui se confere que nenhum tipo das
    misturas ficou sem piso, sem configuração ou com peso zero."""
    for tipo in renderizador.TIPOS:
        assert tipo in renderizador.pisos()
    for pares in renderizador.MISTURAS.values():
        for tipo, peso in pares:
            assert tipo in renderizador.TIPOS and peso > 0
    assert math.isclose(sum(p for _, p in renderizador.MISTURAS[("cobertura", "deserto")]), 1.0)


# --- etapa 12: lago no mapa desenhado -----------------------------------------

def _lago(anel, semente=9):
    return {"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [anel + [anel[0]]]},
            "properties": {"id": "lago-1", "camada": "lago", "valor": "lago", "semente_ruido": semente}}


LAGO = _lago([[2.5, 2.5], [3.5, 2.5], [3.5, 3.5], [2.5, 3.5]])


def test_lago_vira_agua_e_nao_recebe_simbolo(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    _, colocacoes = renderizador.renderizar([AREA, LAGO], JANELA, terra, bib, KM_POR_GRAU)
    cx, cy = JANELA.para_pixel(3, 3)
    lagos = renderizador.mascara_de_lagos([LAGO], JANELA, terra, KM_POR_GRAU)
    assert lagos[int(cy), int(cx)]
    for c in colocacoes:
        assert not lagos[int(c.y), int(c.x)], "âncora dentro do lago"


def test_sem_o_lago_o_miolo_tem_simbolo(tmp_path):
    """Controle negativo do teste de cima: sem o lago, o mesmo miolo recebe âncora.
    Senão 'nenhuma âncora no lago' poderia ser só uma área vazia ali."""
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    lagos = renderizador.mascara_de_lagos([LAGO], JANELA, terra, KM_POR_GRAU)
    _, colocacoes = renderizador.renderizar([AREA], JANELA, terra, bib, KM_POR_GRAU)
    assert any(lagos[int(c.y), int(c.x)] for c in colocacoes)


def test_lago_sem_simbolo_por_cima_fica_da_cor_da_agua(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    img, _ = renderizador.renderizar([LAGO], JANELA, terra, bib, KM_POR_GRAU)
    cx, cy = JANELA.para_pixel(3, 3)
    assert tuple(np.asarray(img)[int(cy), int(cx)]) == renderizador.COR_LAGO
    fora_x, fora_y = JANELA.para_pixel(0.5, 0.5)
    assert tuple(np.asarray(img)[int(fora_y), int(fora_x)]) == renderizador.COR_TERRA


def test_lago_no_mar_nao_muda_nada():
    terra = np.zeros((JANELA.altura, JANELA.largura), dtype=bool)
    assert not renderizador.mascara_de_lagos([LAGO], JANELA, terra, KM_POR_GRAU).any()


def test_no_estilo_da_noite_2_o_lago_fica_da_cor_do_mar(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    img, _ = renderizador.renderizar([LAGO], JANELA, terra, bib, KM_POR_GRAU, renderizador.ESTILO_NOITE2)
    cx, cy = JANELA.para_pixel(3, 3)
    assert tuple(np.asarray(img)[int(cy), int(cx)]) == renderizador.COR_MAR


# --- cor de fundo por cobertura (manhã de 2026-09-23) ------------------------------

def _cobertura(valor, anel=None, semente=5, id_="c"):
    anel = anel or [[1, 1], [5, 1], [5, 5], [1, 5]]
    return {"type": "Feature", "geometry": {"type": "Polygon", "coordinates": [anel + [anel[0]]]},
            "properties": {"id": id_, "camada": "cobertura", "valor": valor, "semente_ruido": semente}}


def _pixel(img, lon, lat):
    x, y = JANELA.para_pixel(lon, lat)
    return tuple(int(v) for v in np.asarray(img)[int(y), int(x)])


def test_cobertura_pinta_a_propria_cor_so_na_terra(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.zeros((JANELA.altura, JANELA.largura), dtype=bool)
    terra[:, : JANELA.largura // 2] = True           # oeste terra, leste mar
    sem = renderizador.Estilo(renderizador.TIPOS, {}, renderizador.CORES_COBERTURA)
    img, _ = renderizador.renderizar([_cobertura("deserto")], JANELA, terra, bib, KM_POR_GRAU, sem)
    assert _pixel(img, 2, 3) == renderizador.CORES_COBERTURA["deserto"]
    assert _pixel(img, 4.5, 3) == renderizador.COR_MAR      # a mesma área, no mar: mar
    assert _pixel(img, 0.3, 3) == renderizador.COR_TERRA    # fora da área: papel


def test_campo_e_relevo_nao_pintam_fundo(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    sem = renderizador.Estilo(renderizador.TIPOS, {}, renderizador.CORES_COBERTURA)
    for area in (_cobertura("campo"), AREA):
        img, _ = renderizador.renderizar([area], JANELA, terra, bib, KM_POR_GRAU, sem)
        assert _pixel(img, 3, 3) == renderizador.COR_TERRA


def test_sem_paleta_a_cobertura_fica_no_papel(tmp_path):
    """Controle negativo do primeiro: o estilo da noite 2 não pinta nada."""
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    img, _ = renderizador.renderizar([_cobertura("deserto")], JANELA, terra, bib, KM_POR_GRAU,
                                     renderizador.ESTILO_NOITE2)
    assert _pixel(img, 3, 3) == renderizador.COR_TERRA


def _biblioteca_so_traco(tmp_path):
    """Um símbolo 'só traço': moldura preta de 2 px, miolo transparente; a silhueta
    (branco-opaco) é o quadrado cheio."""
    traco = np.zeros((40, 40, 4), dtype=np.uint8)
    traco[:2, :, 3] = traco[-2:, :, 3] = traco[:, :2, 3] = traco[:, -2:, 3] = 255
    cheio = np.full((40, 40, 4), 255, dtype=np.uint8)
    cheio[..., :3] = 255
    Image.fromarray(traco, "RGBA").save(tmp_path / "t.png")
    Image.fromarray(cheio, "RGBA").save(tmp_path / "o.png")
    s = {"id": "montanha-01", "tipo": "montanha", "arquivo": "t.png",
         "arquivos": {"so-traco": "t.png", "branco-opaco": "o.png"}, "modo_padrao": "so-traco",
         "largura": 40, "altura": 40, "ancora": {"x": 20, "y": 39}, "espelhavel": False}
    (tmp_path / "m.json").write_text(json.dumps({"simbolos": [s]}), encoding="utf-8")
    return renderizador.Biblioteca.carregar(tmp_path / "m.json", raiz=tmp_path)


def test_o_recheio_do_simbolo_e_a_cor_do_chao(tmp_path):
    bib = _biblioteca_so_traco(tmp_path)
    terra = np.ones((200, 200), dtype=bool)
    chao = np.zeros((200, 200, 3), dtype=np.float32)
    chao[:] = (10, 120, 30)
    c = renderizador.Colocacao("montanha-01", 100, 150, 40, False, 0.0, (10, 120, 30))
    img = np.asarray(renderizador.desenhar(terra, [c], bib, chao))
    assert tuple(img[130, 100]) == (10, 120, 30)       # miolo do símbolo
    # Controle negativo: o recheio padrão (papel) sobre o mesmo chão verde aparece.
    c2 = renderizador.Colocacao("montanha-01", 100, 150, 40, False, 0.0)
    img2 = np.asarray(renderizador.desenhar(terra, [c2], bib, chao))
    assert tuple(img2[130, 100]) == renderizador.COR_TERRA


def test_simbolo_da_floresta_nao_sai_da_mancha_de_cor(tmp_path):
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    area = _cobertura("selva")
    mistura = {("cobertura", "selva"): [("montanha", 1.0)]}
    com_cor = renderizador.Estilo(renderizador.TIPOS_NOITE2, mistura, renderizador.CORES_COBERTURA)
    sem_cor = renderizador.Estilo(renderizador.TIPOS_NOITE2, mistura, {})
    mancha = raster.rasterizar(area["geometry"], 5, JANELA, KM_POR_GRAU, terra=terra) > 0
    _, dentro = renderizador.renderizar([area], JANELA, terra, bib, KM_POR_GRAU, com_cor)
    _, solto = renderizador.renderizar([area], JANELA, terra, bib, KM_POR_GRAU, sem_cor)
    assert dentro and all(mancha[int(c.y), int(c.x)] for c in dentro)
    # Controle negativo: sem o recorte pela cor, a borda de 90 km põe âncora fora dela.
    assert any(not mancha[int(c.y), int(c.x)] for c in solto)


# --- modo rápido e densidade nova ---------------------------------------------------

def test_no_modo_rapido_o_piso_legivel_escala_junto(tmp_path):
    """Numa janela 4 vezes menor, nenhuma montanha pode ficar no piso (uns 35 px) da
    resolução oficial: com o piso sem escala, a prévia seria um tapete de símbolos
    gigantes."""
    bib = _biblioteca(tmp_path)
    janela = raster.Janela(0, 0, 6, 6, PPG / 4)
    terra = np.ones((janela.altura, janela.largura), dtype=bool)
    _, cs = renderizador.renderizar([AREA], janela, terra, bib, KM_POR_GRAU)
    assert cs
    assert max(c.maior_lado for c in cs) < 35
    assert min(c.maior_lado for c in cs) >= int(renderizador.pisos()["montanha"] / 4)


def _tamanho_por_profundidade(tmp_path, estilo):
    bib = _biblioteca(tmp_path)
    janela = raster.Janela(0, 0, 12, 12, PPG / 2)
    terra = np.ones((janela.altura, janela.largura), dtype=bool)
    grande = _area([[1, 1], [11, 1], [11, 11], [1, 11]])
    _, cs = renderizador.renderizar([grande], janela, terra, bib, KM_POR_GRAU, estilo)
    cx, cy = janela.largura / 2, janela.altura / 2
    centro = [c.maior_lado for c in cs if abs(c.x - cx) < janela.largura / 6 and abs(c.y - cy) < janela.altura / 6]
    beira = [c.maior_lado for c in cs if abs(c.x - cx) > janela.largura * 0.38 or abs(c.y - cy) > janela.altura * 0.38]
    return np.mean(centro), np.mean(beira), len(beira)


def test_a_cordilheira_tem_espinha(tmp_path):
    centro, beira, _ = _tamanho_por_profundidade(tmp_path, renderizador.ESTILO)
    assert centro > 1.5 * beira


def test_sem_espinha_no_estilo_da_noite_2(tmp_path):
    """Controle negativo: sem borda/miolo, centro e beira têm o mesmo tamanho médio."""
    centro, beira, _ = _tamanho_por_profundidade(tmp_path, renderizador.ESTILO_NOITE2)
    assert abs(centro / beira - 1) < 0.1


def test_o_renderizador_respeita_o_piso(tmp_path, monkeypatch):
    bib = _biblioteca(tmp_path)
    terra = np.ones((JANELA.altura, JANELA.largura), dtype=bool)
    monkeypatch.setattr(renderizador, "_PISOS", {"montanha": 150})
    _, alto = renderizador.renderizar([AREA], JANELA, terra, bib, KM_POR_GRAU)
    assert alto and min(c.maior_lado for c in alto) >= 150
    # Controle negativo: sem piso, as mesmas montanhas ficam abaixo de 150.
    monkeypatch.setattr(renderizador, "_PISOS", {"montanha": 1})
    _, livre = renderizador.renderizar([AREA], JANELA, terra, bib, KM_POR_GRAU)
    assert max(c.maior_lado for c in livre) < 150


def test_o_corpo_do_simbolo_pode_avancar_sobre_a_agua(tmp_path):
    """Decisão 8 do usuário (2026-09-23): só a âncora e as duas pontas da base precisam
    de terra. Com a costa ao norte da área, alguma montanha da beira tem de ter o topo
    sobre o mar; exigir a caixa inteira em terra deixaria essa faixa vazia."""
    bib = _biblioteca(tmp_path)
    terra = np.zeros((JANELA.altura, JANELA.largura), dtype=bool)
    terra[JANELA.altura // 2:, :] = True                 # mar ao norte, terra ao sul
    _, cs = renderizador.renderizar([AREA], JANELA, terra, bib, KM_POR_GRAU)
    assert all(terra[int(c.y), int(c.x)] for c in cs)
    assert any(not terra[int(c.y - 0.8 * c.maior_lado), int(c.x)] for c in cs)
