"""Ferramenta de Rio (etapa 8 da lista do ESPEC, 2026-09-22).

Esquema em `ESPEC-dados.md` (`dados/rios.json`): `LineString`, `coordinates[0]` é a
nascente e `coordinates[-1]` é a foz, `termina_em` diz onde o rio acaba (`"mar"`,
`"lago"` ou `"rio"`) e `ramo_de` é o id do rio-mãe quando a feature é braço de delta.

O que esta etapa implementa da correção 2 do ESPEC-dados:

- **validação por SEGMENTO, não por vértice**: o trecho reto entre dois vértices é
  amostrado pixel a pixel contra `costa_10240.png`, então um clique que "pula" um
  istmo por cima da água é recusado mesmo com os dois vértices em terra;
- **exceção do último segmento** quando o rio termina no mar: é o trecho que vai de
  terra até a água, e sem a exceção nenhum rio conseguiria chegar ao mar;
- **tolerância de foz de 2 km**: o último ponto vale se estiver na água OU a até 2 km
  da costa. Na resolução oficial isso é pouco mais de um pixel e meio (1,25 km por
  pixel), e o número vem do ESPEC, não daqui.

Tudo grava por `operacoes.registrar_operacao` (B1), então desfazer e refazer valem
sem código próprio, e toda escrita passa antes por `travas` (camada `rios`).

**Fora desta etapa, de propósito**: a atração automática de 5 km (ela é da etapa das
estradas, e a decisão registrada diz que é NOSSA, no servidor, ao salvar), a largura
por afluentes acumulados (é da rasterização) e a edição de vértice de rio já salvo.

**Atração do braço de delta** (rodada das pendências, 2026-09-23, item d): ao salvar
um rio com `ramo_de`, a nascente gruda no ponto mais perto do traçado do rio-mãe se
estiver a até `ATRACAO_DELTA_KM`; mais longe, o rio é recusado. Roda antes da checagem
de terra, como a atração das vias. Ver `atrair_nascente_do_braco`.
"""

import json
import math
from pathlib import Path

from . import areas, coordenadas, historico, lugares, operacoes, travas

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "rios.json"
CAMINHO_RELATIVO = "dados/rios.json"
CAMADA = "rios"

TIPOS_DE_FIM = ("mar", "lago", "rio")
TOLERANCIA_FOZ_KM = 2.0  # ESPEC-dados.md, correção 2
# Suposição registrada no ESPEC-dados (correção 3): a mesma distância da atração dos
# lugares. A confirmar pelo usuário.
ATRACAO_DELTA_KM = 5.0
PASSO_AMOSTRA_PX = 1.0   # "a cada pixel", para não pular canal fino


def carregar() -> dict:
    with open(CAMINHO_DADOS, encoding="utf-8") as f:
        return json.load(f)


def _achar(dados: dict, id_rio: str) -> dict:
    for f in dados["features"]:
        if f["properties"]["id"] == id_rio:
            return f
    raise KeyError(f"rio desconhecido: {id_rio}")


# --- geometria contra a costa -------------------------------------------------

def _px(lon: float, lat: float) -> tuple[float, float]:
    d = coordenadas.carregar_coordenadas()
    p = d["projecao"]["px_por_grau"]
    r = d["referencia"]
    return lon * p + r["x_meridiano_zero_px"], -lat * p + r["y_equador_px"]


def _km_por_px() -> float:
    return coordenadas.carregar_coordenadas()["projecao"]["km_por_px_latitude"]


def segmento_em_terra(a: list[float], b: list[float]) -> bool:
    """Amostra o segmento inteiro, e não só os dois extremos.

    É o coração da correção 2: dois vértices em terra não garantem que a reta entre
    eles fique em terra. A amostragem é de um pixel por passo, medida em pixels da
    resolução oficial, para não pular a espessura de um canal estreito.
    """
    (x0, y0), (x1, y1) = _px(*a), _px(*b)
    passos = max(1, int(math.hypot(x1 - x0, y1 - y0) / PASSO_AMOSTRA_PX))
    for i in range(passos + 1):
        t = i / passos
        lon = a[0] + (b[0] - a[0]) * t
        lat = a[1] + (b[1] - a[1]) * t
        if not lugares.ponto_em_terra(lon, lat):
            return False
    return True


def distancia_ate_agua_km(lon: float, lat: float, teto_km: float = TOLERANCIA_FOZ_KM) -> float:
    """Distância até o pixel de água mais próximo, parando no teto.

    Devolve 0.0 se o próprio ponto já é água. Acima do teto devolve `inf`: a busca
    não precisa saber a distância exata de um ponto que já está longe demais.
    """
    if not lugares.ponto_em_terra(lon, lat):
        return 0.0
    km_px = _km_por_px()
    raio_px = int(math.ceil(teto_km / km_px))
    d = coordenadas.carregar_coordenadas()
    grau_por_px = 1.0 / d["projecao"]["px_por_grau"]
    melhor = math.inf
    for dy in range(-raio_px, raio_px + 1):
        for dx in range(-raio_px, raio_px + 1):
            dist_px = math.hypot(dx, dy)
            if dist_px > raio_px or dist_px * km_px >= melhor:
                continue
            if not lugares.ponto_em_terra(lon + dx * grau_por_px, lat - dy * grau_por_px):
                melhor = dist_px * km_px
    return melhor


# --- validação ----------------------------------------------------------------

def ponto_mais_perto_da_linha(lon: float, lat: float, coords: list) -> tuple[list, float, int]:
    """O ponto do traçado `coords` mais perto de (lon, lat), em qualquer trecho (não só
    nos vértices), a distância dele em km no globo e o índice do trecho. A projeção no
    trecho é feita no plano local, com a longitude encolhida por cos(latitude): em
    trechos de poucos km o erro disso é desprezível, e a distância final é haversine."""
    from . import geo
    k = math.cos(math.radians(lat))
    melhor = (None, math.inf, 0)
    for i in range(len(coords) - 1):
        (ax, ay), (bx, by) = coords[i], coords[i + 1]
        ux, uy = (bx - ax) * k, by - ay
        vx, vy = (lon - ax) * k, lat - ay
        n = ux * ux + uy * uy
        t = 0.0 if n == 0 else max(0.0, min(1.0, (vx * ux + vy * uy) / n))
        px, py = ax + (bx - ax) * t, ay + (by - ay) * t
        d = geo.haversine_km(lat, lon, py, px)
        if d < melhor[1]:
            melhor = ([px, py], d, i)
    return melhor


def atrair_nascente_do_braco(pontos: list, id_mae: str, dados: dict,
                             raio_km: float = ATRACAO_DELTA_KM) -> tuple[list, dict]:
    """A nascente do braço de delta assume o ponto mais perto do traçado do rio-mãe.
    Devolve (pontos, relatório `{de, para, km, trecho}`). Recusa (ValueError) se a
    nascente estiver a mais de `raio_km` do rio-mãe."""
    mae = _achar(dados, id_mae)["geometry"]["coordinates"]
    lon, lat = pontos[0]
    para, km, trecho = ponto_mais_perto_da_linha(lon, lat, mae)
    if para is None or km > raio_km:
        raise ValueError(
            f"o braço de delta tem que sair do rio-mãe '{id_mae}': a nascente está a "
            f"{km:.1f} km dele, e a atração só alcança {raio_km:g} km")
    return [para] + [list(p) for p in pontos[1:]], {
        "de": [lon, lat], "para": para, "km": round(km, 3), "trecho": trecho}


def _validar(geometria: dict, termina_em: dict, ramo_de, dados: dict) -> list:
    if geometria.get("type") != "LineString":
        raise ValueError("um rio é uma LineString")
    pontos = geometria.get("coordinates") or []
    if len(pontos) < 2:
        raise ValueError("um rio precisa de pelo menos dois pontos")
    for p in pontos:
        if not (isinstance(p, (list, tuple)) and len(p) == 2):
            raise ValueError("cada ponto é um par [longitude, latitude]")

    tipo = (termina_em or {}).get("tipo")
    if tipo not in TIPOS_DE_FIM:
        raise ValueError(f"'termina_em.tipo' tem que ser um de {TIPOS_DE_FIM}")
    id_destino = (termina_em or {}).get("id")
    if tipo == "mar":
        if id_destino is not None:
            raise ValueError("rio que termina no mar não tem id de destino")
    else:
        if not id_destino:
            raise ValueError(f"rio que termina em {tipo} precisa do id do destino")
        _exigir_destino(tipo, id_destino, dados)

    if ramo_de is not None:
        _achar(dados, ramo_de)  # KeyError vira 404 lá em cima
        # A atração vem ANTES da checagem de terra (a nascente grudada é que tem de
        # estar em terra, e ela está no traçado de um rio que já passou por isso).
        pontos, _ = atrair_nascente_do_braco(pontos, ramo_de, dados)

    # Nascente em terra, sempre. Um rio que nasce na água não é rio.
    if not lugares.ponto_em_terra(*pontos[0]):
        raise ValueError("a nascente cai fora de terra")

    ultimo = len(pontos) - 2
    for i in range(len(pontos) - 1):
        ultimo_segmento = i == ultimo
        if ultimo_segmento and tipo == "mar":
            # Exceção do ESPEC: o trecho até a foz vai de terra até a água.
            continue
        if not segmento_em_terra(pontos[i], pontos[i + 1]):
            raise ValueError(
                f"o trecho {i + 1} passa por cima da água · o traçado tem que ficar em terra"
            )

    if tipo == "mar":
        distancia = distancia_ate_agua_km(*pontos[-1])
        if distancia > TOLERANCIA_FOZ_KM:
            raise ValueError(
                f"a foz não chegou ao mar · está a mais de {TOLERANCIA_FOZ_KM:g} km da água"
            )
    else:
        if not lugares.ponto_em_terra(*pontos[-1]):
            raise ValueError(f"um rio que termina em {tipo} não pode acabar no mar aberto")
    return pontos


def _exigir_destino(tipo: str, id_destino: str, dados: dict) -> None:
    if tipo == "rio":
        _achar(dados, id_destino)
        return
    # lago: o destino é uma área pintada da camada 'lago'
    for f in areas.carregar()["features"]:
        if f["properties"]["id"] == id_destino and f["properties"]["camada"] == "lago":
            return
    raise KeyError(f"lago desconhecido: {id_destino}")


# --- operações ----------------------------------------------------------------

def criar_rio(id_rio: str, geometria: dict, termina_em: dict, nome=None, ramo_de=None,
              travado: bool = False) -> dict:
    dados = carregar()
    for f in dados["features"]:
        if f["properties"]["id"] == id_rio:
            raise ValueError(f"já existe um rio com o id {id_rio}")
    # Validar ANTES de checar a trava, como nas áreas: dado inválido é 422, recusa por
    # trava é 409, e os dois não podem se confundir.
    pontos = _validar(geometria, termina_em, ramo_de, dados)
    travas.exigir_camada_livre(CAMADA, "criar um rio")

    feature = {
        "type": "Feature",
        "geometry": {"type": "LineString", "coordinates": pontos},
        "properties": {
            "id": id_rio,
            "nome": nome or None,
            "termina_em": {"tipo": termina_em["tipo"], "id": termina_em.get("id")},
            "ramo_de": ramo_de,
            "travado": bool(travado),
        },
    }
    operacoes.registrar_operacao(
        "criar_rio", CAMINHO_RELATIVO, {id_rio: {"antes": None, "depois": feature}}
    )
    return feature


def apagar_rio(id_rio: str) -> None:
    dados = carregar()
    antes = _achar(dados, id_rio)
    travas.exigir_objeto_livre(CAMADA, antes["properties"], "apagar este rio")
    operacoes.registrar_operacao(
        "apagar_rio", CAMINHO_RELATIVO, {id_rio: {"antes": antes, "depois": None}}
    )


def definir_trava(id_rio: str, travado: bool) -> dict:
    if not isinstance(travado, bool):
        raise ValueError("'travado' tem que ser booleano")
    dados = carregar()
    antes = _achar(dados, id_rio)
    # A trava da CAMADA continua valendo: com ela fechada, nada nesta camada muda.
    travas.exigir_camada_livre(CAMADA, "mudar a trava deste rio")
    depois = json.loads(json.dumps(antes))
    depois["properties"]["travado"] = travado
    operacoes.registrar_operacao(
        "travar_rio" if travado else "destravar_rio",
        CAMINHO_RELATIVO, {id_rio: {"antes": antes, "depois": depois}},
    )
    return depois


def dependentes(id_rio: str, dados: dict | None = None) -> list[dict]:
    """Os rios que apontam para este: afluentes (`termina_em` rio = este) e braços de
    delta (`ramo_de` = este). A validação deles não olha a geometria do rio-mãe, então
    editar o traçado não os invalida; mas a foz de um afluente pode deixar de encostar
    no rio, e quem tem de saber disso é o usuário."""
    dados = dados or carregar()
    saida = []
    for f in dados["features"]:
        p = f["properties"]
        if p["id"] == id_rio:
            continue
        fim = p.get("termina_em") or {}
        if fim.get("tipo") == "rio" and fim.get("id") == id_rio:
            saida.append({"id": p["id"], "ligacao": "afluente"})
        if p.get("ramo_de") == id_rio:
            saida.append({"id": p["id"], "ligacao": "braco-de-delta"})
    return saida


def editar_geometria(id_rio: str, geometria: dict) -> tuple[dict, list[dict]]:
    """Edição de vértice de rio já salvo (2026-09-23, noite): o traçado novo passa
    pela validação INTEIRA da criação (segmento, nascente, foz, destino), com o
    `termina_em` e o `ramo_de` que o rio já tem. Rio travado (ou camada travada) não
    se edita. Devolve o rio e os dependentes (ver `dependentes`)."""
    dados = carregar()
    antes = _achar(dados, id_rio)
    props = antes["properties"]
    pontos = _validar(geometria, props["termina_em"], props.get("ramo_de"), dados)
    travas.exigir_objeto_livre(CAMADA, props, "editar este rio")
    depois = json.loads(json.dumps(antes))
    depois["geometry"] = {"type": "LineString", "coordinates": pontos}
    operacoes.registrar_operacao("editar_rio", CAMINHO_RELATIVO, {id_rio: {"antes": antes, "depois": depois}})
    return depois, dependentes(id_rio, dados)
