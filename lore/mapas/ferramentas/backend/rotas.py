"""ROTAS DE COMÉRCIO (B4 da empreitada, 2026-09-23 noite): tipo próprio de objeto, que
não é estrada.

`dados/rotas.json` é um FeatureCollection. A `geometry` (LineString) é o traçado JÁ
INTERPOLADO, recalculado a cada gravação, para quem só quer desenhar; quem manda é o
`controle` nas propriedades:

    "controle": {"pontos": [[lon, lat], ...], "trechos": ["reto"|"curvo", ...]}

um tipo de interpolação por trecho (n pontos, n-1 trechos). Trecho curvo é uma curva
de Catmull-Rom que passa pelos pontos de controle (usa o ponto de antes e o de depois
para a tangente); trecho reto é a linha entre os dois. Dá para editar depois: mover um
ponto de controle ou trocar um trecho de reto para curvo refaz o traçado.

Propriedades de uso econômico (todas opcionais, para o uso futuro): `nome`, `tipo`
(`terrestre`, `maritima`, `fluvial`), `mercadorias` (lista), `sentido` (`ida`,
`volta`, `ambos`), `risco` (`baixo`, `medio`, `alto`), `sazonalidade`,
`controlada_por`, `observacoes`, `visivel_jogador`, `travado`, e `lugares` (as pontas
que grudaram num lugar, derivado, como nas estradas).

**Regras** (recomendação do Cartógrafo onde o pedido não fixava):
- **terrestre** segue a regra da estrada: o traçado interpolado inteiro em terra,
  amostrado por segmento;
- **fluvial** também não atravessa mar (rio corre em terra); não se exige que siga um
  rio desenhado, porque rio ainda é raro no dado;
- **marítima** é a exceção: pode cruzar água à vontade;
- **as pontas** (primeiro e último ponto de controle) grudam num lugar a menos de
  5 km, como a estrada; o meio não gruda (rota não passa "por dentro" das cidades).

**Distância e tempo** são calculados e NÃO gravados (`medidas`): distância no globo
(haversine sobre o traçado interpolado) e dias por meio de transporte, com as
velocidades de `VELOCIDADES_KM_DIA` (as de terra vêm da tabela do CARTOGRAFO; navio e
barco são recomendação).
"""

import json
import math
import re
from pathlib import Path

from . import estradas, geo, operacoes, rios, travas

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "rotas.json"
CAMINHO_RELATIVO = "dados/rotas.json"
TIPOS = ("terrestre", "maritima", "fluvial")
TRECHOS = ("reto", "curvo")
SENTIDOS = ("ida", "volta", "ambos")
RISCOS = ("baixo", "medio", "alto")
AMOSTRAS_POR_CURVA = 16
ATRACAO_KM = estradas.ATRACAO_KM
VELOCIDADES_KM_DIA = {
    "terrestre": {"a pé": 25, "caravana": 30, "a cavalo": 50},
    "fluvial": {"barco rio abaixo": 60, "barco rio acima": 25},
    "maritima": {"navio mercante": 120, "galera": 80},
}
CAMPOS_TEXTO = ("nome", "sazonalidade", "controlada_por", "observacoes")


def carregar() -> dict:
    if not CAMINHO_DADOS.exists():
        return {"type": "FeatureCollection", "properties": {"versao_esquema": 1}, "features": []}
    with open(CAMINHO_DADOS, encoding="utf-8") as f:
        return json.load(f)


def _garantir_arquivo() -> None:
    if not CAMINHO_DADOS.exists():
        CAMINHO_DADOS.parent.mkdir(parents=True, exist_ok=True)
        CAMINHO_DADOS.write_text(json.dumps({
            "type": "FeatureCollection",
            "properties": {"versao_esquema": 1, "_comentario": "Rotas de comércio (B4, 2026-09-23). Esquema em "
                           "backend/rotas.py: 'controle' (pontos e tipo de cada trecho) manda; a geometry é o "
                           "traçado interpolado, recalculado a cada gravação."},
            "features": []}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


# --- interpolação -----------------------------------------------------------------

def _catmull_rom(p0, p1, p2, p3, n: int) -> list[list[float]]:
    """Os pontos da curva entre p1 e p2 (sem p1, com p2), Catmull-Rom uniforme."""
    saida = []
    for i in range(1, n + 1):
        t = i / n
        t2, t3 = t * t, t * t * t
        saida.append([
            0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
                   + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
            for k in (0, 1)])
    return saida


def interpolar(pontos: list, trechos: list) -> list[list[float]]:
    """O traçado final: trecho reto é a linha, trecho curvo passa por Catmull-Rom."""
    saida = [list(pontos[0])]
    n = len(pontos)
    for i, tipo in enumerate(trechos):
        p1, p2 = pontos[i], pontos[i + 1]
        if tipo == "reto":
            saida.append(list(p2))
            continue
        p0 = pontos[i - 1] if i > 0 else [2 * p1[0] - p2[0], 2 * p1[1] - p2[1]]
        p3 = pontos[i + 2] if i + 2 < n else [2 * p2[0] - p1[0], 2 * p2[1] - p1[1]]
        saida.extend(_catmull_rom(p0, p1, p2, p3, AMOSTRAS_POR_CURVA))
    return [[round(a, 5), round(b, 5)] for a, b in saida]


def medidas(tracado: list, tipo: str) -> dict:
    km = sum(geo.haversine_km(a[1], a[0], b[1], b[0]) for a, b in zip(tracado[:-1], tracado[1:]))
    return {"km": round(km, 1),
            "dias": {meio: round(km / v, 1) for meio, v in VELOCIDADES_KM_DIA.get(tipo, {}).items()}}


# --- validação ---------------------------------------------------------------------

def _atrair_pontas(pontos: list) -> tuple[list, list]:
    marcados = estradas._lugares_marcados()
    pontos = [list(p) for p in pontos]
    lugares = [None, None]
    for k, i in ((0, 0), (1, len(pontos) - 1)):
        lon, lat = pontos[i]
        melhor, alvo = ATRACAO_KM, None
        for id_lugar, lon_l, lat_l in marcados:
            d = geo.haversine_km(lat, lon, lat_l, lon_l)
            if d < melhor:
                melhor, alvo = d, (id_lugar, lon_l, lat_l)
        if alvo:
            pontos[i] = [alvo[1], alvo[2]]
            lugares[k] = alvo[0]
    return pontos, lugares


def _validar_propriedades(p: dict) -> dict:
    tipo = p.get("tipo", "terrestre")
    if tipo not in TIPOS:
        raise ValueError(f"'tipo' tem que ser um de {list(TIPOS)}")
    mercadorias = p.get("mercadorias", [])
    if not isinstance(mercadorias, list) or not all(isinstance(m, str) and m.strip() for m in mercadorias):
        raise ValueError("'mercadorias' é uma lista de textos")
    sentido = p.get("sentido", "ambos")
    if sentido not in SENTIDOS:
        raise ValueError(f"'sentido' tem que ser um de {list(SENTIDOS)}")
    risco = p.get("risco")
    if risco is not None and risco not in RISCOS:
        raise ValueError(f"'risco' tem que ser null ou um de {list(RISCOS)}")
    for campo in CAMPOS_TEXTO:
        v = p.get(campo)
        if v is not None and not isinstance(v, str):
            raise ValueError(f"'{campo}' tem que ser texto")
    for campo in ("visivel_jogador", "travado"):
        if not isinstance(p.get(campo, campo == "visivel_jogador"), bool):
            raise ValueError(f"'{campo}' tem que ser booleano")
    return {"tipo": tipo, "mercadorias": [m.strip() for m in mercadorias], "sentido": sentido, "risco": risco,
            **{c: (p.get(c) or None) for c in CAMPOS_TEXTO},
            "visivel_jogador": p.get("visivel_jogador", True), "travado": p.get("travado", False)}


def _validar_controle(controle: dict, tipo: str) -> tuple[dict, list, list]:
    if not isinstance(controle, dict):
        raise ValueError("'controle' é {pontos, trechos}")
    pontos = controle.get("pontos")
    if not isinstance(pontos, list) or len(pontos) < 2:
        raise ValueError("a rota precisa de pelo menos dois pontos de controle")
    for p in pontos:
        if not (isinstance(p, (list, tuple)) and len(p) == 2
                and all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in p)):
            raise ValueError("cada ponto de controle é um par [longitude, latitude]")
    trechos = controle.get("trechos") or ["curvo"] * (len(pontos) - 1)
    if len(trechos) != len(pontos) - 1 or any(t not in TRECHOS for t in trechos):
        raise ValueError(f"'trechos' tem de ter {len(pontos) - 1} valores, cada um 'reto' ou 'curvo'")
    pontos, lugares = _atrair_pontas(pontos)
    tracado = interpolar(pontos, trechos)
    if tipo in ("terrestre", "fluvial"):
        for i, (a, b) in enumerate(zip(tracado[:-1], tracado[1:])):
            if not rios.segmento_em_terra(a, b):
                raise ValueError(f"rota {tipo} passa por cima do mar (perto do ponto {i + 1} do traçado)"
                                 " · só a marítima cruza água")
    return {"pontos": [[round(a, 5), round(b, 5)] for a, b in pontos], "trechos": list(trechos)}, tracado, lugares


def _achar(dados: dict, id_rota: str) -> dict:
    for f in dados["features"]:
        if f["properties"]["id"] == id_rota:
            return f
    raise KeyError(f"rota desconhecida: {id_rota}")


def _feature(id_rota: str, props: dict, controle: dict, tracado: list, lugares: list) -> dict:
    return {"type": "Feature", "geometry": {"type": "LineString", "coordinates": tracado},
            "properties": {"id": id_rota, **props, "controle": controle, "lugares": lugares}}


CAMADA = "rotas"   # cadeado geral (travas.py), rodada das pendências de 2026-09-23


def criar(propriedades: dict, controle: dict) -> dict:
    travas.exigir_camada_livre(CAMADA, "criar uma rota")
    props = _validar_propriedades(propriedades)
    controle, tracado, lugares = _validar_controle(controle, props["tipo"])
    dados = carregar()
    maior = max([int(m.group(1)) for f in dados["features"]
                 if (m := re.match(r"^rota-(\d+)$", f["properties"]["id"]))] + [0])
    id_rota = f"rota-{maior + 1:04d}"
    feature = _feature(id_rota, props, controle, tracado, lugares)
    _garantir_arquivo()
    operacoes.registrar_operacao("criar_rota", CAMINHO_RELATIVO, {id_rota: {"antes": None, "depois": feature}})
    return feature


def editar(id_rota: str, propriedades: dict | None = None, controle: dict | None = None) -> dict:
    travas.exigir_camada_livre(CAMADA, "editar esta rota")
    dados = carregar()
    antes = _achar(dados, id_rota)
    atual = antes["properties"]
    mudando_trava_so = propriedades is not None and set(propriedades) == {"travado"} and controle is None
    if atual.get("travado") and not (mudando_trava_so and propriedades["travado"] is False):
        raise travas.Travado("esta rota está travada · não dá para editar")
    base = {k: v for k, v in atual.items() if k not in ("id", "controle", "lugares")}
    props = _validar_propriedades({**base, **(propriedades or {})})
    novo_controle = controle if controle is not None else atual["controle"]
    if controle is not None and "trechos" not in controle:
        # Ponto movido sem dizer os trechos: mantém os antigos se o número bate.
        velhos = atual["controle"]["trechos"]
        novo_controle = {**controle, "trechos": velhos if len(velhos) == len(controle["pontos"]) - 1 else None}
    novo_controle, tracado, lugares = _validar_controle(novo_controle, props["tipo"])
    depois = _feature(id_rota, props, novo_controle, tracado, lugares)
    operacoes.registrar_operacao("editar_rota", CAMINHO_RELATIVO, {id_rota: {"antes": antes, "depois": depois}})
    return depois


def apagar(id_rota: str) -> None:
    travas.exigir_camada_livre(CAMADA, "apagar esta rota")
    dados = carregar()
    antes = _achar(dados, id_rota)
    if antes["properties"].get("travado"):
        raise travas.Travado("esta rota está travada · não dá para apagar")
    operacoes.registrar_operacao("apagar_rota", CAMINHO_RELATIVO, {id_rota: {"antes": antes, "depois": None}})


def com_medidas() -> dict:
    dados = carregar()
    return {"rotas": dados,
            "medidas": {f["properties"]["id"]: medidas(f["geometry"]["coordinates"], f["properties"]["tipo"])
                        for f in dados["features"]}}
