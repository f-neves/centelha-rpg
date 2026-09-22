"""Servidor da ferramenta de pintura do mapa de Uldun. Etapa 1: serve a página com o
Leaflet e a costa/mar em tiles. Etapa 2 (em andamento): camadas de referência (as 4
imagens do ChatGPT e os rótulos, servidas inteiras — sem tile, sem processamento;
Ocean Deep ainda não, é tile e processamento pesado — ver scripts/extrair_ocean_deep.py).

Rodar (de dentro de lore/mapas/ferramentas/, com o venv ativado):
    .venv/Scripts/python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8420
"""

import json
from pathlib import Path
from urllib.parse import quote

from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from . import coordenadas, referencias

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
RAIZ_MAPAS = RAIZ_FERRAMENTA.parent
STATIC_DIR = RAIZ_FERRAMENTA / "static"
TEMPLATES_DIR = RAIZ_FERRAMENTA / "templates"
TILES_DIR = RAIZ_MAPAS / "render" / "tiles"
REFERENCIAS_DIR = RAIZ_MAPAS / "referencias"
FONTE_DIR = RAIZ_MAPAS / "fonte"

app = FastAPI(title="Uldun - editor do mapa")

# Servidor só em 127.0.0.1 (ESPEC-ferramenta.md, "Segurança") — reforçado no comando
# de execução acima, não aqui (FastAPI não decide a interface de rede, o uvicorn sim).

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
# check_dir=False: pasta pode não existir ainda (tiles da costa/mar, etapa 1; Ocean
# Deep, etapa 2) sem quebrar a montagem.
app.mount("/tiles", StaticFiles(directory=str(TILES_DIR), check_dir=False), name="tiles")
# Servidas cruas, sem nenhum processamento — leitura de arquivo, não "processamento
# pesado" da regra do CARTOGRAFO (essa regra é sobre o SERVIDOR decompor/varrer a
# imagem; aqui o navegador só recebe os bytes e decodifica como decodificaria
# qualquer <img>).
app.mount("/referencias", StaticFiles(directory=str(REFERENCIAS_DIR), check_dir=False), name="referencias")
app.mount("/fonte", StaticFiles(directory=str(FONTE_DIR), check_dir=False), name="fonte")


class MudancaCamadaReferencia(BaseModel):
    visivel: bool | None = None
    opacidade: float | None = None
    bounds: dict[str, float] | None = None


@app.get("/", response_class=HTMLResponse)
def pagina_inicial() -> str:
    html = (TEMPLATES_DIR / "index.html").read_text(encoding="utf-8")
    parametros = coordenadas.parametros_leaflet()
    camadas_ref = _camadas_referencia_com_url()
    html = html.replace(
        "/*__PARAMETROS_LEAFLET__*/",
        json.dumps(parametros, ensure_ascii=False),
    )
    html = html.replace(
        "/*__CAMADAS_REFERENCIA__*/",
        json.dumps(camadas_ref, ensure_ascii=False),
    )
    return html


def _camadas_referencia_com_url() -> dict:
    """Mesmo documento de dados/camadas_referencia.json, com uma `url` calculada
    (para /referencias/... ou /fonte/...) somada a cada camada — o frontend não
    precisa saber de onde cada arquivo vem."""
    dados = referencias.carregar()
    for camada in dados["camadas"]:
        arquivo = camada["arquivo"]
        if arquivo.startswith("referencias/"):
            resto = arquivo[len("referencias/"):]
            camada["url"] = "/referencias/" + quote(resto)
        elif arquivo.startswith("fonte/"):
            resto = arquivo[len("fonte/"):]
            camada["url"] = "/fonte/" + quote(resto)
        else:
            raise ValueError(f"caminho de referência não reconhecido: {arquivo}")
    return dados


@app.get("/api/camadas-referencia")
def obter_camadas_referencia() -> JSONResponse:
    return JSONResponse(_camadas_referencia_com_url())


@app.post("/api/camadas-referencia/{id_camada}")
def salvar_camada_referencia(id_camada: str, mudanca: MudancaCamadaReferencia) -> JSONResponse:
    corpo = {k: v for k, v in mudanca.model_dump().items() if v is not None}
    try:
        referencias.atualizar_camada(id_camada, corpo)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(_camadas_referencia_com_url())
