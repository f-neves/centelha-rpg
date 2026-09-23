"""Etapa 11 · rasterização com ruído de borda (noite 2, 2026-09-23).

O pedido fixou os dois controles: a mesma área renderizada duas vezes dá arquivos
idênticos byte a byte, e sementes diferentes dão bordas diferentes. Os outros testes
fecham o que esses dois deixariam passar: um ruído que não faz nada (igual ao
polígono reto), um ruído que invade o miolo, e uma borda que muda com o enquadramento.
"""

import io

import numpy as np
from PIL import Image

from cartografia import raster

KM_POR_GRAU = 138.993658
PX_POR_GRAU = 111.194927          # a resolução oficial
QUADRADO = {"type": "Polygon", "coordinates": [[[10, 10], [14, 10], [14, 14], [10, 14], [10, 10]]]}
JANELA = raster.Janela(9, 9, 15, 15, PX_POR_GRAU)


def _png(mascara: np.ndarray) -> bytes:
    buf = io.BytesIO()
    Image.fromarray(mascara).save(buf, format="PNG")
    return buf.getvalue()


def test_mesma_area_duas_vezes_da_os_mesmos_bytes():
    a = raster.rasterizar(QUADRADO, 8821, JANELA, KM_POR_GRAU)
    b = raster.rasterizar(QUADRADO, 8821, JANELA, KM_POR_GRAU)
    assert _png(a) == _png(b)


def test_sementes_diferentes_dao_bordas_diferentes():
    a = raster.rasterizar(QUADRADO, 8821, JANELA, KM_POR_GRAU)
    b = raster.rasterizar(QUADRADO, 8822, JANELA, KM_POR_GRAU)
    diferentes = int((a != b).sum())
    assert _png(a) != _png(b)
    # e não é um pixel ou dois: a borda inteira mudou de desenho
    assert diferentes > 500, diferentes


def test_o_ruido_mexe_na_borda():
    """Controle negativo do ruído: com amplitude, a borda NÃO pode ser a reta."""
    reto = raster.rasterizar(QUADRADO, 1, JANELA, KM_POR_GRAU, amplitude_km=0)
    com_ruido = raster.rasterizar(QUADRADO, 1, JANELA, KM_POR_GRAU)
    assert (reto != com_ruido).sum() > 500
    # e a área total fica perto da original (o ruído avança e recua, não engorda)
    razao = (com_ruido > 0).sum() / (reto > 0).sum()
    assert 0.95 < razao < 1.05, razao


def test_o_ruido_nao_invade_o_miolo_nem_o_longe():
    """Longe da borda (mais que 2 amplitudes), dentro é sempre área e fora nunca é."""
    m = raster.rasterizar(QUADRADO, 77, JANELA, KM_POR_GRAU)
    folga_graus = 2 * raster.AMPLITUDE_KM / KM_POR_GRAU
    def px(lon, lat):
        x, y = JANELA.para_pixel(lon, lat)
        return m[int(y), int(x)]
    assert px(12, 12) == 255
    assert px(10 + folga_graus, 12) == 255
    assert px(10 - folga_graus, 12) == 0
    assert px(9.05, 9.05) == 0


def test_a_borda_nao_depende_do_enquadramento():
    """Duas janelas alinhadas na mesma grade de pixels, sobrepostas: o pedaço comum é
    idêntico. Sem o ruído ancorado no mundo e a folga do borrão, não seria."""
    passo = 1 / PX_POR_GRAU
    a = raster.Janela(9, 9, 15, 15, PX_POR_GRAU)
    b = raster.Janela(9 + 200 * passo, 9 + 150 * passo, 15 + 200 * passo, 15 + 150 * passo, PX_POR_GRAU)
    ma = raster.rasterizar(QUADRADO, 5, a, KM_POR_GRAU)
    mb = raster.rasterizar(QUADRADO, 5, b, KM_POR_GRAU)
    # b começa 200 px à direita e 150 px acima (norte maior, y menor) de a
    comum_a = ma[0: ma.shape[0] - 150, 200:]
    comum_b = mb[150: 150 + comum_a.shape[0], 0: comum_a.shape[1]]
    assert comum_a.shape == comum_b.shape
    assert (comum_a != comum_b).sum() == 0


def test_buraco_fica_vazio():
    com_buraco = {"type": "Polygon", "coordinates": [
        [[10, 10], [14, 10], [14, 14], [10, 14], [10, 10]],
        [[11, 11], [13, 11], [13, 13], [11, 13], [11, 11]],
    ]}
    m = raster.rasterizar(com_buraco, 3, JANELA, KM_POR_GRAU)
    x, y = JANELA.para_pixel(12, 12)
    assert m[int(y), int(x)] == 0
    x, y = JANELA.para_pixel(10.5, 12)
    assert m[int(y), int(x)] == 255


def test_a_costa_recorta():
    terra = np.zeros((JANELA.altura, JANELA.largura), dtype=bool)
    terra[:, : JANELA.largura // 2] = True     # só a metade oeste é terra
    m = raster.rasterizar(QUADRADO, 3, JANELA, KM_POR_GRAU, terra=terra)
    assert m[:, JANELA.largura // 2:].max() == 0
    assert m[:, : JANELA.largura // 2].max() == 255
