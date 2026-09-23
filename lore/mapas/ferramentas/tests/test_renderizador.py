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
    from cartografia import reducao
    for tipo in renderizador.TIPOS:
        assert tipo in reducao.TAMANHO_MINIMO_LEGIVEL
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
    assert tuple(np.asarray(img)[int(cy), int(cx)]) == renderizador.COR_MAR
    fora_x, fora_y = JANELA.para_pixel(0.5, 0.5)
    assert tuple(np.asarray(img)[int(fora_y), int(fora_x)]) == renderizador.COR_TERRA


def test_lago_no_mar_nao_muda_nada():
    terra = np.zeros((JANELA.altura, JANELA.largura), dtype=bool)
    assert not renderizador.mascara_de_lagos([LAGO], JANELA, terra, KM_POR_GRAU).any()
