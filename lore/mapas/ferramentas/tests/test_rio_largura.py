"""Largura do rio pela rede a montante (item b da rodada das pendências, 2026-09-23).
Rios sintéticos em memória: nada é lido nem gravado em `dados/`."""

import math

import numpy as np
from PIL import Image

from cartografia import composicao as C


def _rio(i, coords, termina=None, ramo=None):
    return {"type": "Feature", "geometry": {"type": "LineString", "coordinates": coords},
            "properties": {"id": i, "termina_em": termina or {"tipo": "mar", "id": None}, "ramo_de": ramo}}


MAE = _rio("mae", [[0.0, 10.0], [1.0, 10.0], [2.0, 10.0], [3.0, 10.0]])
# Afluente de 1 grau de comprimento que deságua no meio do 2º trecho da mãe.
AFLUENTE = _rio("af", [[1.5, 11.0], [1.5, 10.0]], {"tipo": "rio", "id": "mae"})


def test_o_afluente_soma_depois_do_encontro():
    km = C.km_a_montante([MAE, AFLUENTE])
    so = C.km_a_montante([MAE])["mae"]
    af = km["af"][-1]
    assert af > 100
    # Antes do encontro (vértices 0 e 1) nada muda; depois (2 e 3), soma o afluente.
    assert km["mae"][:2] == so[:2]
    assert all(math.isclose(a, b + af) for a, b in zip(km["mae"][2:], so[2:]))


def test_controle_negativo_rio_que_vai_ao_mar_nao_soma():
    solto = _rio("af", AFLUENTE["geometry"]["coordinates"])       # mesma linha, termina no mar
    assert C.km_a_montante([MAE, solto])["mae"] == C.km_a_montante([MAE])["mae"]


def test_afluente_de_afluente_chega_na_mae():
    neto = _rio("neto", [[1.0, 12.0], [1.5, 11.0]], {"tipo": "rio", "id": "af"})
    km = C.km_a_montante([MAE, AFLUENTE, neto])
    so = C.km_a_montante([MAE, AFLUENTE])
    assert km["mae"][-1] > so["mae"][-1] + 100


def test_braco_de_delta_leva_a_metade_do_que_chega():
    braco = _rio("braco", [[3.0, 10.0], [3.5, 9.5]], ramo="mae")
    km = C.km_a_montante([MAE, braco])
    assert math.isclose(km["braco"][0], C.FRACAO_DO_BRACO * km["mae"][-1])


def test_ciclo_nao_trava():
    a = _rio("a", [[0, 0], [1, 0]], {"tipo": "rio", "id": "b"})
    b = _rio("b", [[1, 0], [0, 0]], {"tipo": "rio", "id": "a"})
    km = C.km_a_montante([a, b])
    assert set(km) == {"a", "b"}


def test_largura_cresce_e_tem_teto():
    assert C.largura_do_rio_px(0) == C.LARGURA_RIO_BASE
    assert C.largura_do_rio_px(500) < C.largura_do_rio_px(2000)
    assert C.largura_do_rio_px(10 ** 9) == C.LARGURA_RIO_TETO


def _espessura_na_coluna(rios, lon):
    ppg = C.PPG_OFICIAL
    janela = C.alinhar(-0.5, 9.5, 3.5, 11.5, ppg)
    tela = Image.new("RGBA", (janela.largura, janela.altura), (0, 0, 0, 0))
    ctx = C.Contexto(janela, 1.0, None, frozenset(C.CAMADAS))
    C.desenhar_rios(tela, ctx, [MAE] if rios == 1 else rios)
    x, _ = janela.para_pixel(lon, 10.0)
    coluna = np.asarray(tela)[:, int(x), :]
    return int(((coluna[:, 3] > 0) & (coluna[:, 2] == C.COR_RIO[2])).sum())


def test_em_pixel_o_rio_engrossa_depois_do_afluente():
    """Na tela: a jusante do encontro, a mãe com afluente é mais grossa do que sozinha;
    a montante, igual (controle)."""
    assert _espessura_na_coluna([MAE, AFLUENTE], 2.5) > _espessura_na_coluna([MAE], 2.5)
    assert _espessura_na_coluna([MAE, AFLUENTE], 0.5) == _espessura_na_coluna([MAE], 0.5)
