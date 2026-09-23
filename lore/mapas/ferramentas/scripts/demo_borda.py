"""Mostra o ruído de borda da etapa 11 lado a lado: o polígono reto, a mesma área com
a semente A e com a semente B. Saída em `lore/mapas/render/analise/borda-ruido.png`.

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/demo_borda.py
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from backend import coordenadas  # noqa: E402
from cartografia import raster  # noqa: E402

RAIZ_MAPAS = RAIZ_FERRAMENTA.parent


def main() -> int:
    proj = coordenadas.carregar_coordenadas()["projecao"]
    km_por_grau, px_por_grau = proj["km_por_grau"], proj["px_por_grau"]
    # Um polígono irregular de uns 450 km, desenhado à mão, na resolução oficial x 2.
    area = {"type": "Polygon", "coordinates": [[
        [10, 10], [12.2, 9.6], [13.8, 10.8], [13.5, 12.9], [11.9, 13.8], [10.2, 12.6], [10, 10],
    ]]}
    janela = raster.Janela(9.3, 9.0, 14.5, 14.4, px_por_grau * 2)
    paineis = [
        ("reto (sem ruído)", raster.rasterizar(area, 0, janela, km_por_grau, amplitude_km=0)),
        ("semente 8821", raster.rasterizar(area, 8821, janela, km_por_grau)),
        ("semente 4242", raster.rasterizar(area, 4242, janela, km_por_grau)),
    ]
    w, h = janela.largura, janela.altura
    folha = Image.new("RGB", (3 * w + 40, h + 30), (250, 248, 242))
    d = ImageDraw.Draw(folha)
    try:
        fonte = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 16)
    except OSError:
        fonte = ImageFont.load_default(size=16)
    for i, (titulo, m) in enumerate(paineis):
        cor = np.zeros((h, w, 3), dtype=np.uint8)
        cor[:] = (236, 226, 200)
        cor[m > 0] = (120, 140, 90)
        folha.paste(Image.fromarray(cor), (10 + i * (w + 10), 25))
        d.text((10 + i * (w + 10), 4), titulo, fill=(0, 0, 0), font=fonte)
    destino = RAIZ_MAPAS / "render" / "analise" / "borda-ruido.png"
    destino.parent.mkdir(parents=True, exist_ok=True)
    folha.save(destino)
    print(destino)
    return 0


if __name__ == "__main__":
    sys.exit(main())
