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
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, StrictBool

from . import (areas, cobertura_automatica, coordenadas, estradas, lugares,
               elementos, ilhas, medicoes, nomes, operacoes, rotas, referencias, regioes, relevo_automatico, rios, travas)

RAIZ_FERRAMENTA = Path(__file__).resolve().parents[1]
RAIZ_MAPAS = RAIZ_FERRAMENTA.parent
STATIC_DIR = RAIZ_FERRAMENTA / "static"
TEMPLATES_DIR = RAIZ_FERRAMENTA / "templates"
TILES_DIR = RAIZ_MAPAS / "render" / "tiles"
REFERENCIAS_DIR = RAIZ_MAPAS / "referencias"
FONTE_DIR = RAIZ_MAPAS / "fonte"

app = FastAPI(title="Uldun - editor do mapa")


@app.exception_handler(travas.Travado)
def _travado_vira_409(_pedido, erro: travas.Travado) -> JSONResponse:
    """Rede de segurança (rodada das pendências, 2026-09-23, item c): toda recusa por
    trava vira 409, mesmo nas rotas que não a pegam uma a uma (criar região, nome,
    elemento, rota; atribuir e registrar ilha). Sem isto, o cadeado de camada nessas
    rotas sairia como erro 500."""
    return JSONResponse({"detail": str(erro)}, status_code=409)

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
    exemplo: StrictBool = False


class NovaRegiao(BaseModel):
    id: str
    nome: str
    tipo: str
    pai: str | None = None
    rotulo: dict | None = None


class EdicaoRegiao(BaseModel):
    nome: str
    tipo: str
    pai: str | None = None
    visivel_jogador: StrictBool | None = None


class RotuloRegiao(BaseModel):
    rotulo: dict | None = None


class AtribuicaoMassa(BaseModel):
    regiao: str | None = None


class NomeDoMapa(BaseModel):
    alvo: dict | None = None
    texto: str | None = None
    nivel: int | None = None
    posicao: dict | None = None
    angulo: float | None = None
    curva: dict | None = None
    reto: StrictBool | None = None
    visivel_jogador: StrictBool | None = None
    travado: StrictBool | None = None


class ElementoDoMapa(BaseModel):
    tipo: str | None = None
    posicao: dict | None = None
    tamanho: float | None = None
    texto: str | None = None
    latitude_escala: float | None = None
    visivel_jogador: StrictBool | None = None
    travado: StrictBool | None = None


class PedidoDeExportacao(BaseModel):
    regiao: str | None = None
    retangulo: list[float] | None = None
    camadas: list[str] | None = None
    versao: str = "mestre"
    formato: str = "png"
    largura_px: int = 2400
    papel: str = "A4"
    dpi: int = 300
    destinatario: str | None = None
    titulo: str | None = None
    distorcao: dict | None = None
    nome: str | None = None


class RotaDeComercio(BaseModel):
    propriedades: dict | None = None
    controle: dict | None = None


class NovaMassa(BaseModel):
    lon: float
    lat: float
    regiao: str | None = None


class Pincelada(BaseModel):
    camada: str
    valor: str | None = None
    linha: list
    raio_km: float
    modo: str = "pintar"


class NovaGeometria(BaseModel):
    geometria: dict


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
        json.dumps(travas.estado(), ensure_ascii=False),
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
    return JSONResponse(travas.estado())


@app.post("/api/travas/{id_camada}")
def travar_camada(id_camada: str, mudanca: MudancaTravaCamada) -> JSONResponse:
    try:
        travas.definir_trava_camada(id_camada, mudanca.travada)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(travas.estado())


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


class AjusteDeVia(BaseModel):
    lugar: str


@app.post("/api/estradas/{id_estrada}/ajustar")
def ajustar_estrada(id_estrada: str, ajuste: AjusteDeVia) -> JSONResponse:
    """Via desalinhada: move o vértice mais perto até o lugar (rodada das pendências,
    2026-09-23, item e). Devolve {"estradas": coleção, "ajuste": relatório}."""
    try:
        _, relatorio = estradas.ajustar_ate_lugar(id_estrada, ajuste.lugar)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse({"estradas": estradas.carregar(), "ajuste": relatorio})


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


@app.put("/api/rios/{id_rio}/geometria")
def editar_rio(id_rio: str, nova: NovaGeometria) -> JSONResponse:
    """Devolve `{"rios": coleção, "dependentes": [...]}`: os afluentes e braços de
    delta que apontam para este rio, para a tela avisar."""
    try:
        _, dependentes = rios.editar_geometria(id_rio, nova.geometria)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse({"rios": rios.carregar(), "dependentes": dependentes})


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
        areas.criar_area(nova.id, nova.camada, nova.valor, nova.geometria, nova.semente_ruido, nova.exemplo)
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


@app.post("/api/areas/pincel")
def pincelar(p: Pincelada) -> JSONResponse:
    """Devolve `{"areas": coleção, "id": área resultante ou null, "mudou": bool}`."""
    try:
        r = areas.pincelar(p.camada, p.valor, p.linha, p.raio_km, p.modo)
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse({"areas": areas.carregar(), **r})


@app.put("/api/areas/{id_area}/geometria")
def editar_area(id_area: str, nova: NovaGeometria) -> JSONResponse:
    try:
        areas.editar_geometria(id_area, nova.geometria)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
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


# --- Regiões e pertencimento de ilha (etapa 10 sem o cache, 2026-09-23 noite) ------

def _regioes_e_massas() -> JSONResponse:
    return JSONResponse({"regioes": regioes.carregar_regioes(), "massas": regioes.carregar_massas()})


@app.get("/api/regioes")
def obter_regioes() -> JSONResponse:
    return _regioes_e_massas()


@app.post("/api/regioes")
def criar_regiao(nova: NovaRegiao) -> JSONResponse:
    try:
        regioes.criar_regiao(nova.id, nova.nome, nova.tipo, nova.pai, nova.rotulo)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _regioes_e_massas()


@app.put("/api/regioes/{id_regiao}")
def editar_regiao(id_regiao: str, edicao: EdicaoRegiao) -> JSONResponse:
    try:
        regioes.editar_regiao(id_regiao, edicao.nome, edicao.tipo, edicao.pai, edicao.visivel_jogador)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _regioes_e_massas()


@app.put("/api/regioes/{id_regiao}/rotulo")
def mover_rotulo_regiao(id_regiao: str, mudanca: RotuloRegiao) -> JSONResponse:
    try:
        regioes.mover_rotulo(id_regiao, mudanca.rotulo)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _regioes_e_massas()


@app.delete("/api/regioes/{id_regiao}")
def apagar_regiao(id_regiao: str) -> JSONResponse:
    try:
        regioes.apagar_regiao(id_regiao)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except regioes.EmUso as e:
        raise HTTPException(status_code=409, detail=str(e))
    return _regioes_e_massas()


@app.put("/api/massas/{id_massa}/regiao")
def atribuir_massa(id_massa: str, atribuicao: AtribuicaoMassa) -> JSONResponse:
    try:
        regioes.atribuir_massa(id_massa, atribuicao.regiao)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _regioes_e_massas()


# --- Cache de identidade de ilha (etapa 10 completa, 2026-09-23 noite) -------------

@app.get("/api/ilha")
def identificar_ilha(lon: float, lat: float) -> JSONResponse:
    """Que ilha está neste ponto, que massa a representa e que região a regra dos
    100 km sugere. 409 se o cache não foi gerado (não é erro do pedido)."""
    if not ilhas.existe():
        raise HTTPException(status_code=409, detail="o cache de ilha não foi gerado (scripts/gerar_cache_ilhas.py)")
    return JSONResponse(ilhas.descrever(lon, lat))


@app.post("/api/massas")
def criar_massa(nova: NovaMassa) -> JSONResponse:
    try:
        regioes.criar_massa(nova.lon, nova.lat, nova.regiao)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _regioes_e_massas()


# --- Camada de nomes (B1, 2026-09-23 noite) ------------------------------------------

def _nomes() -> JSONResponse:
    return JSONResponse({"nomes": nomes.carregar(), "efetivos": nomes.efetivos()})


@app.get("/api/nomes")
def obter_nomes() -> JSONResponse:
    """`nomes`: o arquivo (ajustes e nomes livres). `efetivos`: todo nome que o mapa
    desenha, já resolvido a partir dos objetos (calculado, nunca gravado)."""
    return _nomes()


@app.post("/api/nomes")
def criar_nome(n: NomeDoMapa) -> JSONResponse:
    try:
        nomes.criar({k: v for k, v in n.model_dump().items() if v is not None})
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _nomes()


@app.put("/api/nomes/{id_nome}")
def editar_nome(id_nome: str, n: NomeDoMapa) -> JSONResponse:
    """Só os campos enviados mudam. Um campo enviado como null volta ao padrão (a
    posição volta a sair do objeto, a curva volta a ser automática)."""
    try:
        nomes.editar(id_nome, n.model_dump(exclude_unset=True))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return _nomes()


@app.delete("/api/nomes/{id_nome}")
def apagar_nome(id_nome: str) -> JSONResponse:
    try:
        nomes.apagar(id_nome)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    return _nomes()


# --- Elementos de cartografia (B2, 2026-09-23 noite) -----------------------------------

@app.get("/api/elementos")
def obter_elementos() -> JSONResponse:
    return JSONResponse(elementos.carregar())


@app.post("/api/elementos")
def criar_elemento(e: ElementoDoMapa) -> JSONResponse:
    try:
        elementos.criar({k: v for k, v in e.model_dump().items() if v is not None})
    except ValueError as erro:
        raise HTTPException(status_code=422, detail=str(erro))
    return JSONResponse(elementos.carregar())


@app.post("/api/elementos/padrao")
def criar_elementos_padrao() -> JSONResponse:
    """Cria os tipos que faltam (rosa, escala, cartela, monstro) nas posições padrão."""
    elementos.criar_padroes()
    return JSONResponse(elementos.carregar())


@app.put("/api/elementos/{id_elemento}")
def editar_elemento(id_elemento: str, e: ElementoDoMapa) -> JSONResponse:
    mudancas = e.model_dump(exclude_unset=True)
    mudancas.pop("tipo", None)
    try:
        elementos.editar(id_elemento, mudancas)
    except KeyError as erro:
        raise HTTPException(status_code=404, detail=str(erro))
    except travas.Travado as erro:
        raise HTTPException(status_code=409, detail=str(erro))
    except ValueError as erro:
        raise HTTPException(status_code=422, detail=str(erro))
    return JSONResponse(elementos.carregar())


@app.delete("/api/elementos/{id_elemento}")
def apagar_elemento(id_elemento: str) -> JSONResponse:
    try:
        elementos.apagar(id_elemento)
    except KeyError as erro:
        raise HTTPException(status_code=404, detail=str(erro))
    except travas.Travado as erro:
        raise HTTPException(status_code=409, detail=str(erro))
    return JSONResponse(elementos.carregar())


# --- Exportação parcial (B3, 2026-09-23 noite) ---------------------------------------
# A exportação roda num PROCESSO SEPARADO (scripts/exportar.py --json): a memória que
# ela usa (a costa inteira, as máscaras do recorte) volta ao sistema quando ela acaba,
# e o servidor não cresce a cada mapa. Recorte acima do limite de pixels é recusado
# aqui e fica para o script, fora do servidor (pedido do usuário: nada de renderização
# pesada com o servidor no ar).

@app.post("/api/exportar")
def exportar_recorte(p: PedidoDeExportacao) -> JSONResponse:
    import subprocess
    import sys as _sys
    from cartografia import exportar as _exp
    opcoes = {k: v for k, v in p.model_dump().items() if v is not None}
    try:
        _exp.validar(_exp.Opcoes(**opcoes))
    except (ValueError, TypeError) as e:
        raise HTTPException(status_code=422, detail=str(e))
    script = RAIZ_FERRAMENTA / "scripts" / "exportar.py"
    r = subprocess.run([_sys.executable, str(script), "--json", json.dumps(opcoes, ensure_ascii=False)],
                       capture_output=True, text=True, encoding="utf-8", timeout=900)
    linhas = [l for l in r.stdout.splitlines() if l.strip().startswith("{")]
    if not linhas:
        raise HTTPException(status_code=500, detail=f"a exportação falhou: {r.stderr[-500:]}")
    saida = json.loads(linhas[-1])
    if "erro" in saida:
        raise HTTPException(status_code=422, detail=saida["erro"])
    return JSONResponse(saida)


@app.get("/api/exportacoes")
def listar_exportacoes() -> JSONResponse:
    caminho = RAIZ_MAPAS / "dados" / "exportacoes.jsonl"
    if not caminho.exists():
        return JSONResponse([])
    linhas = caminho.read_text(encoding="utf-8").splitlines()
    return JSONResponse([json.loads(l) for l in linhas[-200:] if l.strip()])


@app.get("/api/exportacoes/arquivo")
def baixar_exportacao(caminho: str):
    """Só serve arquivo de render/exportacoes/ (nada de sair da pasta)."""
    pasta = (RAIZ_MAPAS / "render" / "exportacoes").resolve()
    alvo = (RAIZ_MAPAS / caminho).resolve()
    if pasta not in alvo.parents or not alvo.is_file():
        raise HTTPException(status_code=404, detail="arquivo de exportação não encontrado")
    return FileResponse(alvo)


# --- Rotas de comércio (B4, 2026-09-23 noite) ---------------------------------------

@app.get("/api/rotas")
def obter_rotas() -> JSONResponse:
    """`rotas`: o arquivo. `medidas`: distância no globo e dias por meio de transporte,
    CALCULADAS a cada pedido e nunca gravadas."""
    return JSONResponse(rotas.com_medidas())


@app.post("/api/rotas")
def criar_rota(r: RotaDeComercio) -> JSONResponse:
    if r.controle is None:
        raise HTTPException(status_code=422, detail="a rota precisa de 'controle' (pontos e trechos)")
    try:
        rotas.criar(r.propriedades or {}, r.controle)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(rotas.com_medidas())


@app.put("/api/rotas/{id_rota}")
def editar_rota(id_rota: str, r: RotaDeComercio) -> JSONResponse:
    try:
        rotas.editar(id_rota, r.propriedades, r.controle)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    return JSONResponse(rotas.com_medidas())


@app.delete("/api/rotas/{id_rota}")
def apagar_rota(id_rota: str) -> JSONResponse:
    try:
        rotas.apagar(id_rota)
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except travas.Travado as e:
        raise HTTPException(status_code=409, detail=str(e))
    return JSONResponse(rotas.com_medidas())
