"""Ferramenta de Estrada (etapa 9 da lista do ESPEC, 2026-09-22).

Esquema em `ESPEC-dados.md` (`dados/estradas.json`): `LineString`, `tipo` fechado
(`"estrada"` ou `"trilha"`) e `lugares`, a **lista completa de ids de lugares por
onde a via passa, na ordem**.

**A atração automática de 5 km é NOSSA, no servidor, ao salvar** (decisão do
Direcionamento, registrada em `ESPEC-ferramenta.md`): um ponto do traçado a menos de
5 km de um lugar já marcado **assume a coordenada exata dele**. A atração do Geoman
não serve para isso porque mede em pixels de tela, e a regra é em quilômetros.
Consequência que vale saber: o traçado gravado pode ser diferente do desenhado, e a
tela redesenha do que o servidor devolveu, nunca do que o navegador desenhou.

Depois da atração, `lugares` é **derivado**, não recebido: um ponto que ficou com a
coordenada exata de um lugar É um ponto que passa por ele. Receber a lista do
navegador abriria a porta para ela discordar da geometria, e o ESPEC diz que ela é a
lista dos lugares por onde a via passa, não uma anotação à parte.

As três decisões abaixo nasceram como recomendação do Cartógrafo e foram **decididas
pelo Direcionamento em 2026-09-23** (registro em `ESPEC-ferramenta.md`, etapa 9):

1. **Validação de terra por segmento, como no rio.** Aprovada **por enquanto, como
   limitação conhecida e não como regra definitiva**: ponte, vau e balsa vão fazer
   falta (travessia de rio e rota marítima entre as ilhas de Waning) e entram numa
   etapa futura. Mesma amostragem pixel a pixel da costa, sem a exceção da foz.
2. **`lugares` derivado da atração**, e não informado à mão: aprovado.
3. **A atração roda ANTES da checagem de terra**: aprovado, e é a ordem certa por um
   motivo do dado, não só do código · um lugar na costa pode ter a coordenada sobre a
   borda da água por antialiasing da máscara, e a atração corrige o ponto antes de a
   checagem reprovar.

Decisão de código, sem pedido que a fixasse: **pontos que a atração junta no mesmo
lugar são fundidos** (dois cliques dentro do raio do mesmo lugar dariam um segmento
de comprimento zero).

**O relatório da atração** (`atrair_detalhado`) diz, ponto a ponto, quem grudou em
quê e a quantos km estava. Ele não é gravado: volta só na resposta da criação, para a
tela mostrar que a atração agiu. O que fica no dado é o traçado atraído e `lugares`.
"""

import json
from pathlib import Path

from . import geo, lugares as mod_lugares, operacoes, rios, travas

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "estradas.json"
CAMINHO_RELATIVO = "dados/estradas.json"
CAMADA = "estradas"

TIPOS_VALIDOS = ("estrada", "trilha")
ATRACAO_KM = 5.0  # ESPEC-dados.md, correção 3


def carregar() -> dict:
    with open(CAMINHO_DADOS, encoding="utf-8") as f:
        return json.load(f)


def _achar(dados: dict, id_estrada: str) -> dict:
    for f in dados["features"]:
        if f["properties"]["id"] == id_estrada:
            return f
    raise KeyError(f"estrada desconhecida: {id_estrada}")


# --- atração ------------------------------------------------------------------

def _lugares_marcados() -> list[tuple[str, float, float]]:
    saida = []
    for f in mod_lugares.carregar()["features"]:
        lon, lat = f["geometry"]["coordinates"]
        saida.append((f["properties"]["id"], lon, lat))
    return saida


def atrair_detalhado(pontos: list, raio_km: float = ATRACAO_KM) -> tuple[list, list, list]:
    """Devolve (pontos atraídos, ids dos lugares na ordem, relatório).

    Um ponto a menos de `raio_km` de um lugar assume a coordenada EXATA dele. Quando
    mais de um lugar está dentro do raio, vence o mais próximo. Pontos consecutivos
    que caíram no mesmo lugar são fundidos num só.

    O relatório tem uma entrada por ponto ENVIADO que grudou (ponto fora do raio não
    aparece): `indice` (posição no traçado enviado), `de` (onde o clique estava),
    `para` (a coordenada do lugar), `lugar` (id), `km` (a distância do clique ao
    lugar) e `fundido` (true quando o ponto sumiu por cair no mesmo lugar do
    anterior).
    """
    marcados = _lugares_marcados()
    atraidos = []
    ids = []
    relatorio = []
    for indice, (lon, lat) in enumerate(pontos):
        alvo = None
        melhor = raio_km
        for id_lugar, lon_l, lat_l in marcados:
            d = geo.haversine_km(lat, lon, lat_l, lon_l)
            if d < melhor:
                melhor, alvo = d, (id_lugar, lon_l, lat_l)
        if alvo is None:
            atraidos.append([lon, lat])
            continue
        id_lugar, lon_l, lat_l = alvo
        fundido = bool(ids and ids[-1] == id_lugar and atraidos and atraidos[-1] == [lon_l, lat_l])
        relatorio.append({
            "indice": indice, "de": [lon, lat], "para": [lon_l, lat_l],
            "lugar": id_lugar, "km": round(melhor, 3), "fundido": fundido,
        })
        if fundido:
            continue  # ponto consecutivo no mesmo lugar: funde
        atraidos.append([lon_l, lat_l])
        ids.append(id_lugar)
    return atraidos, ids, relatorio


def atrair(pontos: list, raio_km: float = ATRACAO_KM) -> tuple[list, list]:
    """(pontos atraídos, ids dos lugares na ordem), sem o relatório."""
    atraidos, ids, _ = atrair_detalhado(pontos, raio_km)
    return atraidos, ids


# --- validação ----------------------------------------------------------------

def _validar(geometria: dict, tipo: str) -> list:
    if tipo not in TIPOS_VALIDOS:
        raise ValueError(f"'tipo' tem que ser um de {TIPOS_VALIDOS}")
    if geometria.get("type") != "LineString":
        raise ValueError("uma estrada é uma LineString")
    pontos = geometria.get("coordinates") or []
    if len(pontos) < 2:
        raise ValueError("uma estrada precisa de pelo menos dois pontos")
    for p in pontos:
        if not (isinstance(p, (list, tuple)) and len(p) == 2):
            raise ValueError("cada ponto é um par [longitude, latitude]")
    return pontos


def _exigir_em_terra(pontos: list) -> None:
    for i in range(len(pontos) - 1):
        # `rios.segmento_em_terra` é a mesma amostragem pixel a pixel da costa; a
        # estrada não tem a exceção do último trecho, porque não deságua em nada.
        if not rios.segmento_em_terra(pontos[i], pontos[i + 1]):
            raise ValueError(
                f"o trecho {i + 1} passa por cima da água · a via tem que ficar em terra"
            )


# --- operações ----------------------------------------------------------------

def criar_estrada_relatando(id_estrada: str, geometria: dict, tipo: str = "estrada",
                            nome=None, travado: bool = False) -> tuple[dict, list]:
    """Cria a via e devolve (feature gravada, relatório da atração)."""
    dados = carregar()
    for f in dados["features"]:
        if f["properties"]["id"] == id_estrada:
            raise ValueError(f"já existe uma via com o id {id_estrada}")

    pontos = _validar(geometria, tipo)
    # A atração vem ANTES da validação de terra: o que vale é o traçado que vai ser
    # gravado, não o que o navegador desenhou (decisão 3 do docstring).
    pontos, ids_lugares, relatorio = atrair_detalhado(pontos)
    if len(pontos) < 2:
        raise ValueError("depois da atração sobrou um ponto só · a via ficou sem traçado")
    _exigir_em_terra(pontos)
    travas.exigir_camada_livre(CAMADA, "criar uma via")

    feature = {
        "type": "Feature",
        "geometry": {"type": "LineString", "coordinates": pontos},
        "properties": {
            "id": id_estrada,
            "nome": nome or None,
            "tipo": tipo,
            "lugares": ids_lugares,
            "travado": bool(travado),
        },
    }
    operacoes.registrar_operacao(
        "criar_estrada", CAMINHO_RELATIVO, {id_estrada: {"antes": None, "depois": feature}}
    )
    return feature, relatorio


def criar_estrada(id_estrada: str, geometria: dict, tipo: str = "estrada",
                  nome=None, travado: bool = False) -> dict:
    feature, _ = criar_estrada_relatando(id_estrada, geometria, tipo, nome, travado)
    return feature


def desalinhados(feature: dict, lugares_por_id: dict | None = None) -> list[str]:
    """Os lugares da lista `lugares` da via que não estão mais em NENHUM vértice dela
    (movidos ou apagados depois do desenho). É a mesma conta da tela (estradas.js)."""
    if lugares_por_id is None:
        lugares_por_id = {i: [lon, lat] for i, lon, lat in _lugares_marcados()}
    coords = [list(c) for c in feature["geometry"]["coordinates"]]
    return [i for i in feature["properties"].get("lugares") or []
            if lugares_por_id.get(i) is None or list(lugares_por_id[i]) not in coords]


def ajustar_ate_lugar(id_estrada: str, id_lugar: str) -> tuple[dict, dict]:
    """"Ajustar o traçado até o lugar" da via desalinhada (rodada das pendências,
    2026-09-23, item e; recomendação do Cartógrafo). Move UM vértice para a
    coordenada atual do lugar: o mais perto dele entre os vértices que não estão
    grudados em outro lugar da lista. O traçado novo passa pela checagem de terra; se
    algum trecho cair na água, recusa sem gravar. Devolve (via gravada, relatório
    `{vertice, de, para, km}`)."""
    dados = carregar()
    antes = _achar(dados, id_estrada)
    props = antes["properties"]
    travas.exigir_objeto_livre(CAMADA, props, "ajustar esta via")
    if id_lugar not in (props.get("lugares") or []):
        raise ValueError(f"a via {id_estrada} não passa por '{id_lugar}'")
    marcados = {i: [lon, lat] for i, lon, lat in _lugares_marcados()}
    if id_lugar not in marcados:
        raise ValueError(f"o lugar '{id_lugar}' não existe mais: não há para onde ajustar")
    if id_lugar not in desalinhados(antes, marcados):
        raise ValueError(f"a via {id_estrada} já passa por '{id_lugar}': não está desalinhada")
    alvo = marcados[id_lugar]
    pontos = [list(c) for c in antes["geometry"]["coordinates"]]
    presos = [marcados[i] for i in props["lugares"] if i != id_lugar and i in marcados]
    livres = [k for k, c in enumerate(pontos) if c not in presos]
    if not livres:
        raise ValueError("todos os vértices da via estão grudados em outros lugares")
    k = min(livres, key=lambda k: geo.haversine_km(pontos[k][1], pontos[k][0], alvo[1], alvo[0]))
    de = pontos[k]
    km = geo.haversine_km(de[1], de[0], alvo[1], alvo[0])
    pontos[k] = list(alvo)
    # Vizinho que já estava exatamente no lugar: funde, como na atração.
    fundidos = [c for j, c in enumerate(pontos) if j == 0 or c != pontos[j - 1]]
    if len(fundidos) < 2:
        raise ValueError("depois do ajuste sobrou um ponto só · a via ficaria sem traçado")
    _exigir_em_terra(fundidos)
    depois = json.loads(json.dumps(antes))
    depois["geometry"]["coordinates"] = fundidos
    operacoes.registrar_operacao("ajustar_estrada", CAMINHO_RELATIVO,
                                 {id_estrada: {"antes": antes, "depois": depois}})
    return depois, {"vertice": k, "de": de, "para": list(alvo), "km": round(km, 3)}


def apagar_estrada(id_estrada: str) -> None:
    dados = carregar()
    antes = _achar(dados, id_estrada)
    travas.exigir_objeto_livre(CAMADA, antes["properties"], "apagar esta via")
    operacoes.registrar_operacao(
        "apagar_estrada", CAMINHO_RELATIVO, {id_estrada: {"antes": antes, "depois": None}}
    )


def definir_trava(id_estrada: str, travado: bool) -> dict:
    if not isinstance(travado, bool):
        raise ValueError("'travado' tem que ser booleano")
    dados = carregar()
    antes = _achar(dados, id_estrada)
    travas.exigir_camada_livre(CAMADA, "mudar a trava desta via")
    depois = json.loads(json.dumps(antes))
    depois["properties"]["travado"] = travado
    operacoes.registrar_operacao(
        "travar_estrada" if travado else "destravar_estrada",
        CAMINHO_RELATIVO, {id_estrada: {"antes": antes, "depois": depois}},
    )
    return depois
