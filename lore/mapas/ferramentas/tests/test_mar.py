"""A pirâmide /tiles/mar contra a costa oficial (etapa de recorte na renderização).

O recorte pela costa não acontece no dado: o polígono é gravado cru, e quem esconde
a parte que caiu na água é uma imagem por cima (os tiles de `render/tiles/mar`, onde
água é sólida e terra é transparente). Não há nada gravado para testar, então o que
estes testes provam é a PREMISSA da imagem: que ela concorda, pixel a pixel, com a
mesma máscara `costa_10240.png` que o servidor usa para recusar lugar no mar.

Se a premissa valer, "desenhar atravessando o mar pinta só a parte de terra" na tela
depende só do empilhamento (pane z 450, em app.js), que é o que o teste no navegador
exercita.
"""

from pathlib import Path

import pytest
from PIL import Image

from backend import coordenadas, lugares

TILES_MAR = Path(__file__).resolve().parents[2] / "render" / "tiles" / "mar"

# Terra e mar conhecidos, os mesmos pontos que já servem de referência no CARTOGRAFO:
# a ilha principal de Mere (massas.geojson) e o ponto de oceano aberto usado como
# controle negativo da validação de terra em 2026-09-21.
TERRA_CONHECIDA = (17.3389, 17.7768)  # lon, lat
MAR_CONHECIDO = (-37.052, 23.832)     # lon, lat


def _pixel_nativo(lon: float, lat: float) -> tuple[int, int]:
    dados = coordenadas.carregar_coordenadas()
    px_por_grau = dados["projecao"]["px_por_grau"]
    ref = dados["referencia"]
    # round(), e não int(): é o que `lugares.ponto_em_terra` faz para escolher o pixel
    # da máscara, e um pixel de diferença muda a resposta em cima da linha da costa
    # (foi assim que a primeira versão deste teste "achou" uma divergência que não
    # existia: ela comparava dois pixels VIZINHOS, um de cada lado da praia).
    x = round(lon * px_por_grau + ref["x_meridiano_zero_px"])
    y = round(-lat * px_por_grau + ref["y_equador_px"])
    return x, y


def _caminho_do_tile(lon: float, lat: float) -> Path:
    x, y = _pixel_nativo(lon, lat)
    tx, ty = x // coordenadas.TILE_SIZE, y // coordenadas.TILE_SIZE
    return TILES_MAR / str(coordenadas.MAX_ZOOM) / str(tx) / f"{ty}.png"


def _alfa_no_tile_do_mar(lon: float, lat: float) -> int:
    """Alfa do pixel correspondente, no zoom NATIVO (MAX_ZOOM), lido do arquivo."""
    x, y = _pixel_nativo(lon, lat)
    caminho = _caminho_do_tile(lon, lat)
    if not caminho.exists():
        # Bloco ausente = o gerador não grava tile totalmente transparente, e o
        # navegador trata a falta como "nada por cima", isto é, tudo terra.
        return 0
    with Image.open(caminho) as im:
        im = im.convert("RGBA")
        return im.getpixel((x % coordenadas.TILE_SIZE, y % coordenadas.TILE_SIZE))[3]


@pytest.mark.skipif(not TILES_MAR.exists(), reason="pirâmide do mar ainda não gerada")
def test_terra_conhecida_fica_visivel():
    """Em terra o tile do mar é transparente: a área pintada aparece."""
    lon, lat = TERRA_CONHECIDA
    assert lugares.ponto_em_terra(lon, lat) is True  # a premissa, pela máscara
    assert _alfa_no_tile_do_mar(lon, lat) == 0


@pytest.mark.skipif(not TILES_MAR.exists(), reason="pirâmide do mar ainda não gerada")
def test_mar_conhecido_fica_coberto():
    """CONTROLE NEGATIVO: no oceano aberto o tile é sólido, e cobre o que estiver
    embaixo. Sem esta metade, "o teste passa" não distinguiria a imagem certa de uma
    imagem inteiramente transparente, que nunca esconderia nada."""
    lon, lat = MAR_CONHECIDO
    assert lugares.ponto_em_terra(lon, lat) is False
    assert _alfa_no_tile_do_mar(lon, lat) == 255


@pytest.mark.skipif(not TILES_MAR.exists(), reason="pirâmide do mar ainda não gerada")
def test_a_imagem_concorda_com_a_mascara_numa_faixa_que_cruza_a_costa():
    """A prova de que não é coincidência de dois pontos: uma faixa de 200 amostras
    atravessando a costa de Mere, cada uma conferida contra a máscara oficial. A
    faixa PRECISA conter os dois valores, senão ela não cruzou costa nenhuma e o
    teste estaria se aprovando sozinho."""
    lat = 17.7768
    vistos = set()
    for i in range(200):
        lon = 10.0 + i * 0.12  # 10° a 34° de longitude, cruzando a ilha e o mar
        em_terra = lugares.ponto_em_terra(lon, lat)
        alfa = _alfa_no_tile_do_mar(lon, lat)
        assert (alfa == 0) == em_terra, f"lon={lon:.2f}: máscara={em_terra}, alfa={alfa}"
        if not em_terra:
            # No mar o tile TEM que existir em arquivo: o gerador só deixa de gravar
            # o bloco inteiramente transparente, que é o bloco 100% terra. Sem esta
            # asserção, uma pirâmide gerada pela metade passaria no teste pelo
            # caminho do "bloco ausente = terra" em vez de pela imagem (52 das 200
            # amostras desta faixa caem em bloco ausente, todas em terra).
            assert _caminho_do_tile(lon, lat).exists(), (
                f"lon={lon:.2f} é mar e o bloco do mar não existe: pirâmide incompleta"
            )
        vistos.add(em_terra)
    assert vistos == {True, False}, "a faixa não cruzou a costa: o teste não testou nada"
