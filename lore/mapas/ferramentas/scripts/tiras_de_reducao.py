"""Gera uma tira de redução por tipo de símbolo (200, 100, 60 e 35 px) em
`lore/mapas/render/analise/reducao/`.

    cd lore/mapas/ferramentas
    .venv/Scripts/python.exe scripts/tiras_de_reducao.py

Precisa do recorte feito antes (`scripts/recortar_simbolos.py`).
"""

import sys
from pathlib import Path

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(RAIZ_FERRAMENTA))

from cartografia import reducao  # noqa: E402

RAIZ_MAPAS = RAIZ_FERRAMENTA.parent


def main() -> int:
    saidas = reducao.gerar_tiras(RAIZ_MAPAS / "dados" / "simbolos.json",
                                 RAIZ_MAPAS / "render" / "analise" / "reducao")
    for s in saidas:
        print(s)
    return 0


if __name__ == "__main__":
    sys.exit(main())
