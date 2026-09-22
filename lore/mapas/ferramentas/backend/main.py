"""Servidor da ferramenta de pintura do mapa de Uldun. Etapa 1: serve a página com o
Leaflet, a costa em tiles (uma vez gerada — ver scripts/gerar_tiles.py) e os
parâmetros de coordenadas. Nada de ferramenta de desenho ainda.

Rodar (de dentro de lore/mapas/ferramentas/, com o venv ativado):
    .venv/Scripts/python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8420
"""

import json
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from . import coordenadas

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
RAIZ_MAPAS = RAIZ_FERRAMENTA.parent
STATIC_DIR = RAIZ_FERRAMENTA / "static"
TEMPLATES_DIR = RAIZ_FERRAMENTA / "templates"
TILES_DIR = RAIZ_MAPAS / "render" / "tiles"

app = FastAPI(title="Uldun - editor do mapa")

# Servidor só em 127.0.0.1 (ESPEC-ferramenta.md, "Segurança") — reforçado no comando
# de execução acima, não aqui (FastAPI não decide a interface de rede, o uvicorn sim).

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
# check_dir=False: os tiles ainda não foram gerados nesta sessão (parada obrigatória
# da etapa 1); a pasta pode não existir ainda, e a montagem não pode falhar por isso.
app.mount("/tiles", StaticFiles(directory=str(TILES_DIR), check_dir=False), name="tiles")


@app.get("/", response_class=HTMLResponse)
def pagina_inicial() -> str:
    html = (TEMPLATES_DIR / "index.html").read_text(encoding="utf-8")
    parametros = coordenadas.parametros_leaflet()
    return html.replace(
        "/*__PARAMETROS_LEAFLET__*/",
        json.dumps(parametros, ensure_ascii=False),
    )
