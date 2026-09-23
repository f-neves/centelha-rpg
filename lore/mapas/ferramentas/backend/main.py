"""Servidor da ferramenta de pintura do mapa de Uldun. Etapa 1: serve a página com o
Leaflet e a costa/mar em tiles. Etapa 2: camadas de referência (as 4 imagens do
ChatGPT e os rótulos, servidas inteiras — sem tile, sem processamento) e a Ocean
Deep (tiles em /tiles/ocean-deep, gerados por scripts/extrair_ocean_deep.py — mesmo
mount genérico de /tiles usado pela costa, nenhuma rota nova precisou entrar aqui).

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

from . import (areas, cobertura_automatica, coordenadas, estradas, lugares,
               medicoes, operacoes, referencias, relevo_automatico, rios, travas)

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


class NovoLugar(BaseModel):
    id: str
    lon: float
    lat: float
    propriedades: dict


class MovimentoLugar(BaseModel):
    lon: float
    lat: float


class EdicaoLugar(BaseModel):
    propriedades: dict


class MudancaTrava(BaseModel):
    travado: bool


class MudancaTravaCamada(BaseModel):
    travada: bool


class NovaArea(BaseModel):
    id: str
    camada: str
    valor: str
    geometria: dict
    semente_ruido: int | None = None


class NovoRio(BaseModel):
    id: str
    geometria: dict
    termina_em: dict
    nome: str | None = None
    ramo_de: str | None = None


class NovaEstrada(BaseModel):
    id: str
    geometria: dict
    tipo: str = "estrada"
    nome: str | None = None


class PontoMedicao(BaseModel):
    lat: float
    lon: float


class NovaMedicao(BaseModel):
    pontos: list[PontoMedicao]
    trechos_km: list[float]
    distancia_total_km: float
    nome: str | None = None


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
    html = html.replace(
        "/*__LUGARES__*/",
        json.dumps(lugares.carregar(), ensure_ascii=False),
    )
    html = html.replace(
        "/*__TRAVAS__*/",
        json.dumps(travas.carregar(), ensure_ascii=False),
    )
    html = html.replace(
        "/*__AREAS__*/",
        json.dumps(areas.carregar(), ensure_ascii=False),
    )
    html = html.replace(
        "/*__ESTRADAS__*/",
        json.dumps(estradas.carregar(), ensure_ascii=False),
    )
    html = html.replace(
        "/*__RIOS__*/",
        json.dumps(rios.carregar(), ensure_ascii=False),
    )
    # Calculada, nunca lida de arquivo: ver backend/cobertura_automatica.py.
    html = html.replace(
        "/*__COBERTURA_AUTOMATICA__*/",
        json.dumps(cobertura_automatica.colecao(), ensure_ascii=False),
    )
    return html


def _camadas_referencia_com_url() -> dict:
    """Mesmo documento de dados/camadas_referencia.json, com uma `url` calculada
    somada a cada camada — o frontend não precisa saber de onde cada arquivo vem.
    Camada 'imagem' aponta pra /referencias/... ou /fonte/...; camada 'tile' aponta
    pro template XYZ da sua própria pirâmide (/tiles/<id>/{z}/{x}/{y}.png — a pasta
    em render/tiles/ tem o mesmo nome do id, por convenção: rotulos, ocean-deep)."""
    dados = referencias.carregar()
    for camada in dados["camadas"]:
        if camada.get("tipo") == "tile":
            camada["url"] = f"/tiles/{camada['id']}/{{z}}/{{x}}/{{y}}.png"
            continue
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


# Posição (2026-09-23): "reset" encaixa nos limites do mundo, "automático" volta
# pro resultado do alinhamento automático -- as duas passam pelo desfazer (B1),
# como qualquer outra mudança de bounds (ver backend/referencias.py).

@app.post("/api/camadas-referencia/{id_camada}/resetar")
def resetar_posicao_camada(id_camada: str) -> JSONResponse:
    try:
        referencias.resetar_posicao(id_camada)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(_camadas_referencia_com_url())


@app.post("/api/camadas-referencia/{id_camada}/automatico")
def usar_alinhamento_automatico_camada(id_camada: str) -> JSONResponse:
    try:
        referencias.usar_alinhamento_automatico(id_camada)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(_camadas_referencia_com_url())


# --- Ferramenta de Lugar (B2, rodada noturna de 2026-09-22) ------------------------
# Toda gravação passa por backend/operacoes.py (B1): cada criar/mover/editar/apagar
# vira uma operação desfazível, e /api/desfazer e /api/refazer são genéricos (não
# são "desfazer de lugar" -- vão servir sem mudança pras ferramentas seguintes, que
# também vão gravar por operacoes.registrar_operacao).

@app.get("/api/lugares")
def obter_lugares() -> JSONResponse:
    return JSONResponse(lugares.carregar())


# 409 é a RECUSA POR TRAVA, e é um código diferente de propósito (pedido de
# 2026-09-23, item 1b): o frontend precisa distinguir "está travado" (aviso
# discreto) de "dado inválido" (erro de gravação, faixa vermelha que não some)
# sem ler a mensagem. 422 continua sendo dado inválido, 404 continua sendo
# objeto inexistente.

@app.post("/api/lugares")
def criar_lugar(novo: NovoLugar) -> JSONResponse:
    try:
        lugares.criar_lugar(novo.id, novo.lon, novo.lat, novo.propriedades)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(lugares.carregar())


@app.put("/api/lugares/{id_lugar}/posicao")
def mover_lugar(id_lugar: str, movimento: MovimentoLugar) -> JSONResponse:
    try:
        lugares.mover_lugar(id_lugar, movimento.lon, movimento.lat)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(lugares.carregar())


@app.put("/api/lugares/{id_lugar}")
def editar_lugar(id_lugar: str, edicao: EdicaoLugar) -> JSONResponse:
    try:
        lugares.editar_lugar(id_lugar, edicao.propriedades)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(lugares.carregar())


@app.delete("/api/lugares/{id_lugar}")
def apagar_lugar(id_lugar: str) -> JSONResponse:
    try:
        lugares.apagar_lugar(id_lugar)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    return JSONResponse(lugares.carregar())


@app.post("/api/lugares/{id_lugar}/trava")
def travar_lugar(id_lugar: str, mudanca: MudancaTrava) -> JSONResponse:
    try:
        lugares.definir_trava(id_lugar, mudanca.travado)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(lugares.carregar())


# --- Cadeado geral por camada (item 1d) --------------------------------------

@app.get("/api/travas")
def obter_travas() -> JSONResponse:
    return JSONResponse(travas.carregar())


@app.post("/api/travas/{id_camada}")
def travar_camada(id_camada: str, mudanca: MudancaTravaCamada) -> JSONResponse:
    try:
        travas.definir_trava_camada(id_camada, mudanca.travada)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(travas.carregar())


# --- Desfazer/refazer genérico (B1) -------------------------------------------------

@app.get("/api/pilha")
def obter_estado_pilha() -> JSONResponse:
    return JSONResponse(operacoes.estado_pilha())


@app.post("/api/desfazer")
def desfazer() -> JSONResponse:
    operacao = operacoes.desfazer()
    if operacao is None:
        raise HTTPException(status_code=409, detail="nada para desfazer")
    return JSONResponse({"operacao": operacao, "pilha": operacoes.estado_pilha()})


@app.post("/api/refazer")
def refazer() -> JSONResponse:
    operacao = operacoes.refazer()
    if operacao is None:
        raise HTTPException(status_code=409, detail="nada para refazer")
    return JSONResponse({"operacao": operacao, "pilha": operacoes.estado_pilha()})


# --- Ferramenta de Área (etapa B4, 2026-09-23) --------------------------------

@app.get("/api/areas")
def obter_areas() -> JSONResponse:
    return JSONResponse(areas.carregar())


# --- Ferramenta de Estrada (etapa 9, 2026-09-22) ------------------------------
# A atração automática de 5 km acontece AQUI DENTRO, ao salvar (backend/estradas.py):
# o traçado devolvido pode ser diferente do enviado, e é o devolvido que vale.

@app.get("/api/estradas")
def obter_estradas() -> JSONResponse:
    return JSONResponse(estradas.carregar())


@app.post("/api/estradas")
def criar_estrada(nova: NovaEstrada) -> JSONResponse:
    # Única rota da estrada que NÃO devolve a coleção pura: devolve
    # {"estradas": coleção, "atracao": relatório}, porque o relatório de quem grudou
    # em quê só existe no momento da criação (não é gravado). GET, DELETE e trava
    # continuam devolvendo a coleção, que é o que o recarregar do desfazer espera.
    try:
        _, relatorio = estradas.criar_estrada_relatando(nova.id, nova.geometria, nova.tipo, nova.nome)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse({"estradas": estradas.carregar(), "atracao": relatorio})


@app.delete("/api/estradas/{id_estrada}")
def apagar_estrada(id_estrada: str) -> JSONResponse:
    try:
        estradas.apagar_estrada(id_estrada)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(estradas.carregar())


@app.post("/api/estradas/{id_estrada}/trava")
def travar_estrada(id_estrada: str, mudanca: MudancaTrava) -> JSONResponse:
    try:
        estradas.definir_trava(id_estrada, mudanca.travado)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(estradas.carregar())


# --- Ferramenta de Rio (etapa 8, 2026-09-22) ----------------------------------

@app.get("/api/rios")
def obter_rios() -> JSONResponse:
    return JSONResponse(rios.carregar())


@app.post("/api/rios")
def criar_rio(novo: NovoRio) -> JSONResponse:
    try:
        rios.criar_rio(novo.id, novo.geometria, novo.termina_em, novo.nome, novo.ramo_de)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(rios.carregar())


@app.delete("/api/rios/{id_rio}")
def apagar_rio(id_rio: str) -> JSONResponse:
    try:
        rios.apagar_rio(id_rio)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(rios.carregar())


@app.post("/api/rios/{id_rio}/trava")
def travar_rio(id_rio: str, mudanca: MudancaTrava) -> JSONResponse:
    try:
        rios.definir_trava(id_rio, mudanca.travado)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(rios.carregar())


@app.get("/api/relevo-automatico")
def obter_relevo_automatico() -> JSONResponse:
    """Relevo `planicie` onde não há relevo pintado. Mesmo contrato do automático de
    cobertura: calculado a cada pedido, nunca gravado."""
    return JSONResponse(relevo_automatico.colecao())


@app.get("/api/cobertura-automatica")
def obter_cobertura_automatica() -> JSONResponse:
    """Faixas de latitude já descontadas do que o usuário pintou. CALCULADO: este
    endpoint não lê nem escreve nenhum arquivo de área, e nada aqui vira feature."""
    return JSONResponse(cobertura_automatica.colecao())


@app.post("/api/areas")
def criar_area(nova: NovaArea) -> JSONResponse:
    try:
        areas.criar_area(nova.id, nova.camada, nova.valor, nova.geometria, nova.semente_ruido)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(areas.carregar())


@app.delete("/api/areas/{id_area}")
def apagar_area(id_area: str) -> JSONResponse:
    try:
        areas.apagar_area(id_area)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    return JSONResponse(areas.carregar())


@app.post("/api/areas/{id_area}/trava")
def travar_area(id_area: str, mudanca: MudancaTrava) -> JSONResponse:
    try:
        areas.definir_trava(id_area, mudanca.travado)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(areas.carregar())


# --- Medições salvas pela régua (item 3e, 2026-09-23) -------------------------

@app.post("/api/medicoes")
def salvar_medicao(nova: NovaMedicao) -> JSONResponse:
    try:
        medicao = medicoes.criar_medicao(
            [p.model_dump() for p in nova.pontos], nova.trechos_km, nova.distancia_total_km, nova.nome,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(medicao)
