"""Etapa 11 · rasterização de área pintada com ruído de borda (noite 2, 2026-09-23).

A área pintada é vetor (`dados/areas-pintadas.geojson`, lon/lat) e cada feature
guarda um `semente_ruido` inteiro (`ESPEC-dados.md`). Aqui ela vira máscara raster
numa JANELA do mundo, com a borda irregular e idêntica a cada renderização.

**Como a borda fica irregular**, sem scipy (não instalado, e nada se instala):

1. O polígono é rasterizado reto (PIL, contorno externo cheio e buracos vazios).
2. A máscara é borrada (gaussiana do PIL) na largura da irregularidade: vira uma
   rampa de 1 (dentro) a 0 (fora), com o meio em cima da borda original.
3. Soma-se um RUÍDO DE VALOR de duas oitavas, e o corte é em 0,5. Onde o ruído é
   positivo a borda avança, onde é negativo ela recua.

**O ruído é ancorado no MUNDO, e não na janela**: cada nó da grade do ruído tem
coordenada em quilômetros a partir da origem da projeção, e o seu valor é um hash
inteiro de (semente, i, j, oitava). Duas janelas que se sobrepõem desenham a mesma
borda no pedaço comum, e um recorte de região bate com o mapa inteiro. Um gerador
aleatório por janela daria outra borda a cada enquadramento.

**Determinismo**: nada aqui usa relógio, `random` global nem ordem de dicionário; a
mesma área, a mesma semente e a mesma janela dão os mesmos bytes, e é isso que o teste
confere.

Parâmetros (recomendação do Cartógrafo, a derrubar se ficar feio):
`AMPLITUDE_KM = 12` (o quanto a borda pode avançar ou recuar, uns 10 px na resolução
nativa de 1,25 km/px), e as oitavas de ruído com grade de 40 km e 12 km.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from shapely.geometry import shape

AMPLITUDE_KM = 12.0
OITAVAS = ((40.0, 0.65), (12.0, 0.35))   # (espaço da grade em km, peso)


@dataclass(frozen=True)
class Janela:
    """Retângulo do mundo em lon/lat, desenhado com `px_por_grau` pixels por grau.

    A projeção é equirretangular sem correção por cos(latitude) (`coordenadas.json`):
    1 grau vale os mesmos pixels nos dois eixos. `px_por_grau` na resolução oficial é
    111,19; a resolução de trabalho é um múltiplo disso.
    """
    oeste: float
    sul: float
    leste: float
    norte: float
    px_por_grau: float

    @property
    def largura(self) -> int:
        return int(round((self.leste - self.oeste) * self.px_por_grau))

    @property
    def altura(self) -> int:
        return int(round((self.norte - self.sul) * self.px_por_grau))

    def para_pixel(self, lon: float, lat: float) -> tuple[float, float]:
        return ((lon - self.oeste) * self.px_por_grau, (self.norte - lat) * self.px_por_grau)

    def km_por_px(self, km_por_grau: float) -> float:
        return km_por_grau / self.px_por_grau


def rasterizar_reto(geometria: dict, janela: Janela,
                    recorte: tuple[int, int, int, int] | None = None) -> np.ndarray:
    """Máscara 0/255 do polígono sem ruído nenhum (Polygon ou MultiPolygon, com
    buracos). `recorte` = (x0, y0, x1, y1) em pixels da janela devolve só esse pedaço."""
    forma = shape(geometria)
    poligonos = list(forma.geoms) if forma.geom_type == "MultiPolygon" else [forma]
    x0, y0, x1, y1 = recorte or (0, 0, janela.largura, janela.altura)
    img = Image.new("L", (x1 - x0, y1 - y0), 0)
    desenho = ImageDraw.Draw(img)

    def pixels(coords):
        return [(px - x0, py - y0) for px, py in (janela.para_pixel(x, y) for x, y in coords)]

    for p in poligonos:
        desenho.polygon(pixels(p.exterior.coords), fill=255)
        for buraco in p.interiors:
            desenho.polygon(pixels(buraco.coords), fill=0)
    return np.asarray(img)


# --- ruído de valor ancorado no mundo -------------------------------------------

def _hash_uniforme(semente: int, i: np.ndarray, j: np.ndarray, oitava: int) -> np.ndarray:
    """Valor em [0, 1) por nó da grade, só função de (semente, i, j, oitava). Mistura
    de inteiros no estilo do splitmix64, em uint64 (o transbordo é proposital)."""
    with np.errstate(over="ignore"):
        x = (np.uint64(semente & 0xFFFFFFFF) * np.uint64(0x9E3779B97F4A7C15)
             ^ (i.astype(np.int64).astype(np.uint64) * np.uint64(0xBF58476D1CE4E5B9))
             ^ (j.astype(np.int64).astype(np.uint64) * np.uint64(0x94D049BB133111EB))
             ^ np.uint64(oitava * 0x2545F4914F6CDD1D & 0xFFFFFFFFFFFFFFFF))
        x = (x ^ (x >> np.uint64(30))) * np.uint64(0xBF58476D1CE4E5B9)
        x = (x ^ (x >> np.uint64(27))) * np.uint64(0x94D049BB133111EB)
        x = x ^ (x >> np.uint64(31))
    return (x >> np.uint64(11)).astype(np.float64) / float(1 << 53)


def ruido(janela: Janela, semente: int, km_por_grau: float, oitavas=OITAVAS,
          recorte: tuple[int, int, int, int] | None = None) -> np.ndarray:
    """Ruído em [-0,5, 0,5] (aproximadamente), por pixel da janela, ancorado no mundo.
    `recorte` = (x0, y0, x1, y1) em pixels da janela devolve só esse pedaço, com os
    mesmos valores que ele teria na janela inteira.

    O hash é calculado uma vez por NÓ da grade do ruído, e não por pixel (a primeira
    versão fazia quatro hashes por pixel por oitava, e era 90% dos 3 minutos de um
    recorte de Mére). O valor de cada nó é o mesmo; só se deixou de recalculá-lo."""
    km_px = janela.km_por_px(km_por_grau)
    x0, y0, x1, y1 = recorte or (0, 0, janela.largura, janela.altura)
    # coordenada do CENTRO de cada pixel, em km a partir da origem da projeção
    xs_km = (janela.oeste * km_por_grau) + (np.arange(x0, x1) + 0.5) * km_px
    ys_km = (-janela.norte * km_por_grau) + (np.arange(y0, y1) + 0.5) * km_px
    total = np.zeros((y1 - y0, x1 - x0), dtype=np.float64)
    for oitava, (passo, peso) in enumerate(oitavas):
        gx, gy = xs_km / passo, ys_km / passo
        i0, j0 = np.floor(gx).astype(np.int64), np.floor(gy).astype(np.int64)
        fx, fy = gx - i0, gy - j0
        sx, sy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)   # suavização
        nos_i = np.arange(i0.min(), i0.max() + 2)
        nos_j = np.arange(j0.min(), j0.max() + 2)
        NI, NJ = np.meshgrid(nos_i, nos_j)
        valor = _hash_uniforme(semente, NI, NJ, oitava)          # [nó j, nó i]
        a, b = i0 - nos_i[0], j0 - nos_j[0]
        v00, v10 = valor[np.ix_(b, a)], valor[np.ix_(b, a + 1)]
        v01, v11 = valor[np.ix_(b + 1, a)], valor[np.ix_(b + 1, a + 1)]
        SX, SY = sx[None, :], sy[:, None]
        v = (v00 * (1 - SX) + v10 * SX) * (1 - SY) + (v01 * (1 - SX) + v11 * SX) * SY
        total += peso * (v - 0.5)
    return total


def _caixa_em_pixels(geometria: dict, janela: Janela, folga_px: int):
    """(x0, y0, x1, y1) em pixels da janela: a caixa do polígono com `folga_px` em volta,
    cortada pela janela. None se não sobra nada."""
    oeste, sul, leste, norte = shape(geometria).bounds
    ax, ay = janela.para_pixel(oeste, norte)
    bx, by = janela.para_pixel(leste, sul)
    x0 = max(0, int(np.floor(ax)) - folga_px)
    y0 = max(0, int(np.floor(ay)) - folga_px)
    x1 = min(janela.largura, int(np.ceil(bx)) + folga_px + 1)
    y1 = min(janela.altura, int(np.ceil(by)) + folga_px + 1)
    if x1 <= x0 or y1 <= y0:
        return None
    return x0, y0, x1, y1


def rasterizar(geometria: dict, semente: int, janela: Janela, km_por_grau: float,
               amplitude_km: float = AMPLITUDE_KM, terra: np.ndarray | None = None,
               oitavas=OITAVAS) -> np.ndarray:
    """Máscara 0/255 da área com a borda irregular. `terra` (opcional, mesma forma da
    janela, verdadeiro = terra) recorta pela costa oficial: correção 11, o dado é cru
    e quem some é só a imagem."""
    if amplitude_km <= 0:
        saida = rasterizar_reto(geometria, janela)
    else:
        raio_px = amplitude_km / janela.km_por_px(km_por_grau)
        # Janela com folga de 3 raios em volta: o borrão perto da beira da janela não
        # pode enxergar "vazio" onde o polígono continua do lado de fora, senão a
        # borda mudaria conforme o enquadramento.
        folga_px = int(np.ceil(3 * raio_px)) + 2
        folga = folga_px / janela.px_por_grau
        larga = Janela(janela.oeste - folga, janela.sul - folga, janela.leste + folga,
                       janela.norte + folga, janela.px_por_grau)
        # Só se calcula o pedaço da janela larga em volta do polígono (a caixa dele mais
        # a folga): longe dele a rampa é zero e o ruído (no máximo 0,45) não passa do
        # corte, então fora da caixa a máscara é vazia de qualquer jeito. Antes se
        # calculava a janela inteira para cada área, o que num recorte de região
        # grande era a maior parte do tempo.
        cheia = np.zeros((larga.altura, larga.largura), dtype=bool)
        caixa = _caixa_em_pixels(geometria, larga, folga_px)
        if caixa is not None:
            x0, y0, x1, y1 = caixa
            reta = rasterizar_reto(geometria, larga, caixa)
            # A rampa: um borrão de meia amplitude dá uma transição de ~1 amplitude inteira.
            rampa = np.asarray(Image.fromarray(reta).filter(ImageFilter.GaussianBlur(raio_px / 2)),
                               dtype=np.float64) / 255.0
            cheia[y0:y1, x0:x1] = (rampa + 0.9 * ruido(larga, semente, km_por_grau, oitavas, caixa)) > 0.5
        saida = cheia[folga_px: folga_px + janela.altura, folga_px: folga_px + janela.largura]
        saida = saida.astype(np.uint8) * 255
    if terra is not None:
        saida = np.where(terra, saida, 0).astype(np.uint8)
    return saida
