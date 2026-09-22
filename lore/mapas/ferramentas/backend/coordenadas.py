"""Leitura de dados/coordenadas.json e derivação dos parâmetros que o Leaflet precisa
para tratar Uldun como um mapa próprio (CRS.Simple), não a Terra real.

O mundo inteiro (10240px nativos) vira o zoom MAIS ALTO do Leaflet (MAX_ZOOM); zoom 0
mostra o mundo comprimido no menor tile. Isso é o oposto do "zoom 0 = mundo inteiro
em 256px" das CRS de Terra real (EPSG3857) — não existe aqui porque não usamos essas
CRS, usamos CRS.Simple com uma transformação própria (ver ESPEC-ferramenta.md,
"Arquitetura").
"""

import json
from pathlib import Path

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_COORDENADAS = RAIZ_MAPAS / "dados" / "coordenadas.json"

TILE_SIZE = 256
MAX_ZOOM = 6  # 2**MAX_ZOOM * TILE_SIZE = 16384 >= 10240 (resolucao_tela_px) — resolução
              # NATIVA; não existe tile gerado além disso (scripts/gerar_tiles.py).
SOBRE_ZOOM = 3  # zoom a mais que o Leaflet permite além do nativo, esticando o tile
                # de MAX_ZOOM no navegador (maxNativeZoom) — nenhum bloco ampliado é
                # gerado pelo script pra isso.


def carregar_coordenadas() -> dict:
    with open(CAMINHO_COORDENADAS, encoding="utf-8") as f:
        return json.load(f)


def parametros_leaflet() -> dict:
    """Devolve o que o frontend precisa para montar a CRS.Simple customizada e os
    limites do mundo, tudo derivado de coordenadas.json (nenhum número duplicado)."""
    dados = carregar_coordenadas()
    projecao = dados["projecao"]
    referencia = dados["referencia"]
    limites = dados["limites_da_tela"]

    px_por_grau = projecao["px_por_grau"]
    escala_max_zoom = 2 ** MAX_ZOOM

    return {
        "tile_size": TILE_SIZE,
        "max_zoom": MAX_ZOOM,
        "max_zoom_mapa": MAX_ZOOM + SOBRE_ZOOM,
        "resolucao_tela_px": projecao["resolucao_tela_px"],
        # Transformation(a, b, c, d) do Leaflet: point = scale(zoom) * (a*lng+b, c*lat+d).
        # Em zoom=MAX_ZOOM, scale=2**MAX_ZOOM, e o resultado tem que bater com as
        # fórmulas de coordenadas.json (x_de_longitude / y_de_latitude) em pixel
        # nativo — por isso a e c são pré-divididos por 2**MAX_ZOOM aqui.
        "transformacao": {
            "a": px_por_grau / escala_max_zoom,
            "b": referencia["x_meridiano_zero_px"] / escala_max_zoom,
            "c": -px_por_grau / escala_max_zoom,
            "d": referencia["y_equador_px"] / escala_max_zoom,
        },
        "limites": {
            "sul": limites["latitude_base"],
            "norte": limites["latitude_topo"],
            "oeste": limites["longitude_esquerda"],
            "leste": limites["longitude_direita"],
        },
    }
