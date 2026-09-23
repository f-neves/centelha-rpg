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


# --- a aceleração não muda um pixel (2026-09-23, rodada da manhã) -----------------
# A versão da noite 2 fazia o hash por pixel e calculava a janela inteira para cada
# área. Ela fica aqui, copiada, como REFERÊNCIA: a versão rápida tem de dar os mesmos
# bytes que ela.

from PIL import ImageFilter  # noqa: E402


def _ruido_referencia(janela, semente, km_por_grau, oitavas, deslocar_no=0):
    km_px = janela.km_por_px(km_por_grau)
    xs_km = (janela.oeste * km_por_grau) + (np.arange(janela.largura) + 0.5) * km_px
    ys_km = (-janela.norte * km_por_grau) + (np.arange(janela.altura) + 0.5) * km_px
    total = np.zeros((janela.altura, janela.largura), dtype=np.float64)
    for oitava, (passo, peso) in enumerate(oitavas):
        gx, gy = xs_km / passo, ys_km / passo
        i0, j0 = np.floor(gx).astype(np.int64), np.floor(gy).astype(np.int64)
        fx, fy = gx - i0, gy - j0
        sx, sy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
        I0, J0 = np.meshgrid(i0 + deslocar_no, j0)
        SX, SY = np.meshgrid(sx, sy)
        v00 = raster._hash_uniforme(semente, I0, J0, oitava)
        v10 = raster._hash_uniforme(semente, I0 + 1, J0, oitava)
        v01 = raster._hash_uniforme(semente, I0, J0 + 1, oitava)
        v11 = raster._hash_uniforme(semente, I0 + 1, J0 + 1, oitava)
        v = (v00 * (1 - SX) + v10 * SX) * (1 - SY) + (v01 * (1 - SX) + v11 * SX) * SY
        total += peso * (v - 0.5)
    return total


def _rasterizar_referencia(geometria, semente, janela, amplitude_km, oitavas, deslocar_no=0):
    raio_px = amplitude_km / janela.km_por_px(KM_POR_GRAU)
    folga_px = int(np.ceil(3 * raio_px)) + 2
    folga = folga_px / janela.px_por_grau
    larga = raster.Janela(janela.oeste - folga, janela.sul - folga, janela.leste + folga,
                          janela.norte + folga, janela.px_por_grau)
    reta = raster.rasterizar_reto(geometria, larga)
    rampa = np.asarray(Image.fromarray(reta).filter(ImageFilter.GaussianBlur(raio_px / 2)),
                       dtype=np.float64) / 255.0
    cheia = (rampa + 0.9 * _ruido_referencia(larga, semente, KM_POR_GRAU, oitavas, deslocar_no)) > 0.5
    return cheia[folga_px: folga_px + janela.altura, folga_px: folga_px + janela.largura].astype(np.uint8) * 255


# Um polígono pequeno longe do meio de uma janela grande (é o caso que a caixa
# acelera) e um que sai da janela pela borda (é o caso que a caixa corta).
PEQUENO = {"type": "Polygon", "coordinates": [[[3, 3], [5.5, 2.6], [6, 5], [3.4, 5.8], [3, 3]]]}
VAZANDO = {"type": "Polygon", "coordinates": [[[-2, 7], [4, 6.5], [4.5, 11], [-1, 12], [-2, 7]]]}
JANELA_GRANDE = raster.Janela(0, 0, 12, 10, PX_POR_GRAU / 2)
OITAVAS_LONGAS = ((220.0, 0.5), (70.0, 0.3), (20.0, 0.2))


def test_a_versao_rapida_da_os_mesmos_bytes_da_referencia():
    for geo in (PEQUENO, VAZANDO, QUADRADO):
        for amplitude, oitavas in ((raster.AMPLITUDE_KM, raster.OITAVAS), (90.0, OITAVAS_LONGAS)):
            rapida = raster.rasterizar(geo, 4242, JANELA_GRANDE, KM_POR_GRAU,
                                       amplitude_km=amplitude, oitavas=oitavas)
            referencia = _rasterizar_referencia(geo, 4242, JANELA_GRANDE, amplitude, oitavas)
            assert rapida.any()
            assert _png(rapida) == _png(referencia)


def test_a_comparacao_com_a_referencia_pega_um_no_trocado():
    """Controle negativo: a mesma referência com o nó do ruído deslocado de um tem de
    dar bytes diferentes, senão o teste de cima não enxergaria erro de indexação."""
    rapida = raster.rasterizar(PEQUENO, 4242, JANELA_GRANDE, KM_POR_GRAU)
    errada = _rasterizar_referencia(PEQUENO, 4242, JANELA_GRANDE, raster.AMPLITUDE_KM,
                                    raster.OITAVAS, deslocar_no=1)
    assert _png(rapida) != _png(errada)


def test_poligono_fora_da_janela_da_mascara_vazia():
    longe = {"type": "Polygon", "coordinates": [[[40, 40], [41, 40], [41, 41], [40, 40]]]}
    assert not raster.rasterizar(longe, 1, JANELA_GRANDE, KM_POR_GRAU).any()
