"""Teste de redução: cada tipo de símbolo desenhado em 200, 100, 60 e 35 px, lado a
lado, para decidir a olho em que tamanho ele deixa de ser legível.

O tamanho é o do MAIOR lado do símbolo (a barra de escala é deitada, a conífera é
em pé). A redução é LANCZOS a partir do PNG recortado, no modo padrão de cada tipo,
sobre a cor de papel provisória. Cada tira é uma imagem por tipo, com uma linha por
símbolo do tipo e uma coluna por tamanho, em pixel real: é assim que ele vai aparecer
no mapa, sem ampliação nenhuma.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
TAMANHOS = (200, 100, 60, 35)
COR_PAPEL = (236, 226, 200)


def _fonte(tamanho: int):
    try:
        return ImageFont.truetype("C:/Windows/Fonts/arial.ttf", tamanho)
    except OSError:
        return ImageFont.load_default(size=tamanho)


def reduzir(imagem: Image.Image, maior_lado: int) -> Image.Image:
    escala = maior_lado / max(imagem.width, imagem.height)
    return imagem.resize((max(1, round(imagem.width * escala)), max(1, round(imagem.height * escala))),
                         Image.LANCZOS)


def tira_do_tipo(tipo: str, simbolos: list[dict], raiz_mapas: Path = RAIZ_MAPAS) -> Image.Image:
    margem, rotulo_esq, topo = 10, 150, 26
    larguras = [t + margem for t in TAMANHOS]
    largura = rotulo_esq + sum(larguras) + margem
    altura = topo + len(simbolos) * (TAMANHOS[0] + margem) + margem
    tira = Image.new("RGBA", (largura, altura), COR_PAPEL + (255,))
    desenho = ImageDraw.Draw(tira)
    fonte = _fonte(13)
    x = rotulo_esq
    for t, l in zip(TAMANHOS, larguras):
        desenho.text((x, 6), f"{t} px", fill=(40, 40, 40), font=fonte)
        x += l
    for i, s in enumerate(simbolos):
        y = topo + i * (TAMANHOS[0] + margem)
        desenho.text((8, y + TAMANHOS[0] // 2 - 8), s["id"], fill=(40, 40, 40), font=fonte)
        with Image.open(raiz_mapas / s["arquivo"]) as im:
            original = im.convert("RGBA")
        x = rotulo_esq
        for t, l in zip(TAMANHOS, larguras):
            menor = reduzir(original, t)
            # apoiado pela base, como vai ficar no mapa
            tira.alpha_composite(menor, (x, y + TAMANHOS[0] - menor.height))
            x += l
    return tira.convert("RGB")


def gerar_tiras(caminho_manifesto: Path, pasta_saida: Path, raiz_mapas: Path = RAIZ_MAPAS) -> list[Path]:
    manifesto = json.loads(caminho_manifesto.read_text(encoding="utf-8"))
    por_tipo: dict[str, list[dict]] = {}
    for s in manifesto["simbolos"]:
        por_tipo.setdefault(s["tipo"], []).append(s)
    pasta_saida.mkdir(parents=True, exist_ok=True)
    saidas = []
    for tipo, simbolos in por_tipo.items():
        destino = pasta_saida / f"reducao-{tipo}.png"
        tira_do_tipo(tipo, simbolos, raiz_mapas).save(destino)
        saidas.append(destino)
    return saidas


# Menor tamanho (maior lado, em px) em que cada tipo ainda se reconhece, julgado a olho
# pelo Cartógrafo em 2026-09-23 nas tiras de 200/100/60/35 px. É RECOMENDAÇÃO, e é o
# piso que o renderizador usa. Onde está 35, o tipo ainda se lê em 35; onde está 60,
# em 35 ele vira mancha; onde está 100 ou 200, é peça de moldura e não de terreno.
TAMANHO_MINIMO_LEGIVEL = {
    "arvore-folhosa": 35, "arvore-conifera": 35, "palmeira": 35, "arvore-tropical": 35,
    "selva": 35, "montanha": 35, "montanha-nevada": 35, "colina": 35, "duna": 35,
    "rochedo": 35, "marco": 35, "fortaleza": 35, "cidade": 35,
    "vila": 60, "porto": 60, "ruina": 60, "geleira": 60, "pantano": 60,
    "vegetacao-seca": 60, "monstro-marinho": 60,
    "tundra": 100,
    "rosa-dos-ventos": 100, "barra-de-escala": 200, "cartela": 200,
}
