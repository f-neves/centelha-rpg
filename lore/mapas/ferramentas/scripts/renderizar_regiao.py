"""Renderiza o recorte de uma região com mar, costa, cor base da terra e os símbolos
espalhados nas áreas pintadas (noite 2, 2026-09-23).

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/renderizar_regiao.py mere
    .venv/Scripts/python.exe scripts/renderizar_regiao.py --todas

Resolução de trabalho = a oficial (1,25 km/px, 111,19 px/grau). Saída em
`lore/mapas/render/recorte-<região>.png` e uma prévia com metade do tamanho em
`recorte-<região>-metade.png`. Lê `mascaras/costa_10240.png` inteira uma vez (uns
100 MB na memória): é processamento pesado, autorizado para a noite 2.
"""

import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from backend import areas as mod_areas, coordenadas  # noqa: E402
from cartografia import raster, renderizador  # noqa: E402

RAIZ_MAPAS = RAIZ_FERRAMENTA.parent

# Recortes em lon/lat (oeste, sul, leste, norte), pelas faixas do CARTOGRAFO.
REGIOES = {
    "mere": (7.0, -1.5, 31.5, 41.5),
    "calin": (-3.0, 24.0, 17.0, 44.0),
    "the-neck": (-34.0, 46.0, -18.0, 57.0),
    "white-wall": (-42.0, 57.0, -10.0, 68.7),
}


def janela_alinhada(oeste, sul, leste, norte, ref, px_por_grau):
    """Encosta a janela na grade de pixels da máscara oficial."""
    x0 = int(round(ref["x_meridiano_zero_px"] + oeste * px_por_grau))
    x1 = int(round(ref["x_meridiano_zero_px"] + leste * px_por_grau))
    y0 = int(round(ref["y_equador_px"] - norte * px_por_grau))
    y1 = int(round(ref["y_equador_px"] - sul * px_por_grau))
    x0, y0 = max(0, x0), max(0, y0)
    x1, y1 = min(10240, x1), min(10240, y1)
    janela = raster.Janela(
        (x0 - ref["x_meridiano_zero_px"]) / px_por_grau,
        (ref["y_equador_px"] - y1) / px_por_grau,
        (x1 - ref["x_meridiano_zero_px"]) / px_por_grau,
        (ref["y_equador_px"] - y0) / px_por_grau,
        px_por_grau,
    )
    return janela, (x0, y0, x1, y1)


def main(argv) -> int:
    nomes = list(REGIOES) if "--todas" in argv else [a for a in argv if not a.startswith("-")] or ["mere"]
    coords = coordenadas.carregar_coordenadas()
    ref, proj = coords["referencia"], coords["projecao"]
    Image.MAX_IMAGE_PIXELS = None
    with Image.open(RAIZ_MAPAS / "mascaras" / "costa_10240.png") as im:
        costa = np.asarray(im.convert("L"))
    bib = renderizador.Biblioteca.carregar(RAIZ_MAPAS / "dados" / "simbolos.json")
    todas = mod_areas.carregar()["features"]
    for nome in nomes:
        t = time.perf_counter()
        janela, (x0, y0, x1, y1) = janela_alinhada(*REGIOES[nome], ref, proj["px_por_grau"])
        terra = costa[y0:y1, x0:x1] >= 128
        assert terra.shape == (janela.altura, janela.largura), (terra.shape, janela)
        imagem, colocacoes = renderizador.renderizar(todas, janela, terra, bib, proj["km_por_grau"])
        destino = RAIZ_MAPAS / "render" / f"recorte-{nome}.png"
        imagem.save(destino)
        imagem.resize((imagem.width // 2, imagem.height // 2), Image.LANCZOS).save(
            RAIZ_MAPAS / "render" / f"recorte-{nome}-metade.png")
        por_tipo = {}
        for c in colocacoes:
            tipo = c.simbolo.rsplit("-", 1)[0]
            por_tipo[tipo] = por_tipo.get(tipo, 0) + 1
        print(f"{nome}: {imagem.width}x{imagem.height} px, {len(colocacoes)} símbolos {por_tipo}, "
              f"{time.perf_counter() - t:.1f} s -> {destino}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
