"""Camada de NOMES (B1 da empreitada, 2026-09-23 noite).

**De onde vem cada nome** (para não guardar a mesma coisa em dois lugares, a regra
da correção 7):

- **lugar**: o `nome` de `lugares.geojson`; a posição do TEXTO é a do lugar
  deslocada para o lado, a menos que um ajuste aqui diga outra.
- **região** (inclui mar, golfo, baía e estreito): `nome` e `rotulo` de
  `regioes.json`. A posição continua morando no `rotulo` (o painel de regiões já a
  arrasta); aqui só moram nível, ângulo e curva.
- **rio** e **rota**: o `nome` deles, no meio do traçado, acompanhando a linha.
- **livre**: nome que não tem objeto com nome próprio. É o caso da CORDILHEIRA: uma
  área de relevo não tem nome no esquema, então o nome livre aponta para ela
  (`alvo: {"tipo": "area", "id": ...}`) e acompanha a espinha dela.

**`dados/nomes.json`** guarda só AJUSTES (um por alvo) e NOMES LIVRES:

    {"id": "nome-0001", "alvo": {"tipo": "lugar"|"regiao"|"rio"|"rota"|"area"|"livre",
     "id": str|null}, "texto": str|null, "nivel": 1..5|null, "posicao": Point|null,
     "angulo": graus|null, "curva": LineString|null, "reto": bool,
     "visivel_jogador": bool, "travado": bool}

`texto` só vale para alvo `area` e `livre` (os outros têm nome no próprio objeto).
`nivel` (1 = menor, 5 = maior) substitui o nível que sai da importância. `curva`
desenhada à mão manda; sem ela, região e cordilheira alongadas ganham curva
automática, a menos que `reto`.

Recomendação do Cartógrafo (os números de nível por tipo estão em `nivel_padrao`).
"""

import json
import re
from pathlib import Path

from . import coordenadas, operacoes

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO = RAIZ_MAPAS / "dados" / "nomes.json"
RELATIVO = "dados/nomes.json"
TIPOS_DE_ALVO = ("lugar", "regiao", "rio", "rota", "area", "livre")
CAMPOS = ("alvo", "texto", "nivel", "posicao", "angulo", "curva", "reto", "visivel_jogador", "travado")


def carregar() -> dict:
    if not CAMINHO.exists():
        return {"versao_esquema": 1, "nomes": []}
    with open(CAMINHO, encoding="utf-8") as f:
        return json.load(f)


def _garantir_arquivo() -> None:
    if not CAMINHO.exists():
        CAMINHO.parent.mkdir(parents=True, exist_ok=True)
        CAMINHO.write_text(json.dumps({
            "_comentario": "Camada de nomes (B1, 2026-09-23). Só AJUSTES de nomes que já moram nos objetos "
                           "(lugar, região, rio, rota) e NOMES LIVRES (cordilheira, e o que não tiver objeto). "
                           "Esquema em backend/nomes.py.",
            "versao_esquema": 1, "nomes": []}, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8", newline="\n")


def nivel_padrao(tipo_alvo: str, objeto: dict | None) -> int:
    """Nível (tamanho) que sai do próprio dado, quando o ajuste não diz outro."""
    p = (objeto or {}).get("properties", objeto or {})
    if tipo_alvo == "lugar":
        base = {"grande": 4, "media": 3, "pequena": 2}.get(p.get("importancia"), 2)
        return min(5, base + (1 if p.get("capital") else 0))
    if tipo_alvo == "regiao":
        return {"arquipelago": 5, "reino": 4, "ilha": 4, "mar": 4, "provincia": 3,
                "golfo": 3, "baia": 2, "estreito": 2}.get(p.get("tipo"), 3)
    if tipo_alvo in ("rio", "rota"):
        return 2
    return 3   # área (cordilheira) e livre


def _ponto(valor, campo: str):
    if valor is None:
        return None
    if not (isinstance(valor, dict) and valor.get("type") == "Point"
            and isinstance(valor.get("coordinates"), list) and len(valor["coordinates"]) == 2):
        raise ValueError(f"'{campo}' tem que ser um Point GeoJSON")
    lon, lat = valor["coordinates"]
    lim = coordenadas.carregar_coordenadas()["limites_da_tela"]
    if not (lim["longitude_esquerda"] <= lon <= lim["longitude_direita"]
            and lim["latitude_base"] <= lat <= lim["latitude_topo"]):
        raise ValueError(f"'{campo}' cai fora da tela do mapa")
    return {"type": "Point", "coordinates": [round(float(lon), 4), round(float(lat), 4)]}


def _linha(valor):
    if valor is None:
        return None
    if not (isinstance(valor, dict) and valor.get("type") == "LineString"
            and isinstance(valor.get("coordinates"), list) and len(valor["coordinates"]) >= 2):
        raise ValueError("'curva' tem que ser uma LineString com pelo menos dois pontos")
    return {"type": "LineString", "coordinates": [[round(float(a), 4), round(float(b), 4)]
                                                  for a, b in valor["coordinates"]]}


def _existe_alvo(tipo: str, id_alvo) -> None:
    if tipo == "livre":
        if id_alvo is not None:
            raise ValueError("nome livre não tem id de alvo")
        return
    if not id_alvo:
        raise ValueError(f"alvo do tipo {tipo} precisa de id")
    from . import areas, lugares, regioes, rios
    if tipo == "lugar":
        colecao = lugares.carregar()["features"]
        ids = {f["properties"]["id"] for f in colecao}
    elif tipo == "regiao":
        ids = {r["id"] for r in regioes.carregar_regioes()["regioes"]}
    elif tipo == "rio":
        ids = {f["properties"]["id"] for f in rios.carregar()["features"]}
    elif tipo == "area":
        ids = {f["properties"]["id"] for f in areas.carregar()["features"]}
    else:  # rota
        from . import rotas
        ids = {f["properties"]["id"] for f in rotas.carregar()["features"]}
    if id_alvo not in ids:
        raise ValueError(f"{tipo} desconhecido: {id_alvo}")


def validar(n: dict) -> dict:
    alvo = n.get("alvo")
    if not isinstance(alvo, dict) or alvo.get("tipo") not in TIPOS_DE_ALVO:
        raise ValueError(f"'alvo.tipo' tem que ser um de {list(TIPOS_DE_ALVO)}")
    _existe_alvo(alvo["tipo"], alvo.get("id"))
    texto = n.get("texto")
    if alvo["tipo"] in ("area", "livre"):
        if not isinstance(texto, str) or not texto.strip():
            raise ValueError("nome de área ou livre precisa de 'texto'")
        texto = texto.strip()
    elif texto is not None:
        raise ValueError(f"o texto de {alvo['tipo']} mora no próprio objeto, não aqui")
    nivel = n.get("nivel")
    if nivel is not None and (isinstance(nivel, bool) or not isinstance(nivel, int) or not 1 <= nivel <= 5):
        raise ValueError("'nivel' tem que ser inteiro de 1 a 5, ou null")
    angulo = n.get("angulo")
    if angulo is not None and (isinstance(angulo, bool) or not isinstance(angulo, (int, float))
                               or not -180 <= angulo <= 180):
        raise ValueError("'angulo' tem que ser um número de -180 a 180, ou null")
    posicao = _ponto(n.get("posicao"), "posicao")
    if alvo["tipo"] == "regiao" and posicao is not None:
        raise ValueError("a posição do nome de região mora no 'rotulo' da região (painel REGIÕES)")
    if alvo["tipo"] == "livre" and posicao is None and n.get("curva") is None:
        raise ValueError("nome livre precisa de 'posicao' ou de 'curva'")
    for campo in ("reto", "visivel_jogador", "travado"):
        if campo in n and not isinstance(n[campo], bool):
            raise ValueError(f"'{campo}' tem que ser booleano")
    return {"alvo": {"tipo": alvo["tipo"], "id": alvo.get("id")}, "texto": texto, "nivel": nivel,
            "posicao": posicao, "angulo": angulo, "curva": _linha(n.get("curva")),
            "reto": n.get("reto", False), "visivel_jogador": n.get("visivel_jogador", True),
            "travado": n.get("travado", False)}


def _achar(dados: dict, id_nome: str) -> dict:
    for n in dados["nomes"]:
        if n["id"] == id_nome:
            return n
    raise KeyError(f"nome desconhecido: {id_nome}")


def criar(n: dict) -> dict:
    limpo = validar(n)
    dados = carregar()
    if limpo["alvo"]["tipo"] not in ("livre", "area"):
        # Um ajuste por alvo: dois ajustes do mesmo lugar brigariam pela posição.
        for outro in dados["nomes"]:
            if outro["alvo"] == limpo["alvo"]:
                raise ValueError(f"esse {limpo['alvo']['tipo']} já tem ajuste: {outro['id']}")
    maior = max([int(m.group(1)) for x in dados["nomes"] if (m := re.match(r"^nome-(\d+)$", x["id"]))] + [0])
    novo = {"id": f"nome-{maior + 1:04d}", **limpo}
    _garantir_arquivo()
    operacoes.registrar_operacao("criar_nome", RELATIVO, {novo["id"]: {"antes": None, "depois": novo}},
                                 chave_lista="nomes")
    return novo


def editar(id_nome: str, mudancas: dict) -> dict:
    dados = carregar()
    antes = _achar(dados, id_nome)
    if antes.get("travado") and mudancas.get("travado") is not False:
        from .travas import Travado
        raise Travado("este nome está travado · não dá para editar")
    desconhecidos = set(mudancas) - set(CAMPOS)
    if desconhecidos:
        raise ValueError(f"campos desconhecidos: {sorted(desconhecidos)}")
    if "alvo" in mudancas and mudancas["alvo"] != antes["alvo"]:
        raise ValueError("o alvo de um nome não muda: apague e crie outro")
    depois = {"id": id_nome, **validar({**antes, **mudancas})}
    operacoes.registrar_operacao("editar_nome", RELATIVO, {id_nome: {"antes": antes, "depois": depois}},
                                 chave_lista="nomes")
    return depois


def apagar(id_nome: str) -> None:
    dados = carregar()
    antes = _achar(dados, id_nome)
    if antes.get("travado"):
        from .travas import Travado
        raise Travado("este nome está travado · não dá para apagar")
    operacoes.registrar_operacao("apagar_nome", RELATIVO, {id_nome: {"antes": antes, "depois": None}},
                                 chave_lista="nomes")


def efetivos() -> list[dict]:
    """Todos os nomes que o mapa desenha, já resolvidos: texto, tipo, nível, posição
    (ou None, quando sai da linha), ângulo, curva manual, reto e visibilidade. É o
    que o renderizador e a tela usam; nada disto é gravado."""
    from . import lugares, regioes, rios
    ajustes = {}
    livres = []
    for n in carregar()["nomes"]:
        if n["alvo"]["tipo"] in ("livre", "area"):
            livres.append(n)
        else:
            ajustes[(n["alvo"]["tipo"], n["alvo"]["id"])] = n
    saida = []

    def juntar(tipo, id_alvo, texto, objeto, posicao, visivel, extra=None):
        aj = ajustes.get((tipo, id_alvo), {})
        saida.append({
            "id": aj.get("id"), "alvo": {"tipo": tipo, "id": id_alvo}, "texto": texto,
            "nivel": aj.get("nivel") or nivel_padrao(tipo, objeto),
            "posicao": aj.get("posicao") or posicao, "angulo": aj.get("angulo"),
            "curva": aj.get("curva"), "reto": aj.get("reto", False),
            "visivel_jogador": bool(visivel) and aj.get("visivel_jogador", True),
            "travado": bool(aj.get("travado", False)),
            **(extra or {}),
        })

    for f in lugares.carregar()["features"]:
        p = f["properties"]
        if p.get("nome"):
            juntar("lugar", p["id"], p["nome"], f, None, p.get("visivel_jogador", True),
                   {"ponto": f["geometry"]})
    for r in regioes.carregar_regioes()["regioes"]:
        if r.get("rotulo"):
            juntar("regiao", r["id"], r["nome"], r, r["rotulo"], r.get("visivel_jogador", True),
                   {"subtipo": r["tipo"]})
    for f in rios.carregar()["features"]:
        p = f["properties"]
        if p.get("nome"):
            juntar("rio", p["id"], p["nome"], f, None, p.get("visivel_jogador", True), {"linha": f["geometry"]})
    try:
        from . import rotas
        for f in rotas.carregar()["features"]:
            p = f["properties"]
            if p.get("nome"):
                juntar("rota", p["id"], p["nome"], f, None, p.get("visivel_jogador", True),
                       {"linha": f["geometry"], "subtipo": p.get("tipo")})
    except ImportError:
        pass
    for n in livres:
        saida.append({**n, "nivel": n.get("nivel") or nivel_padrao(n["alvo"]["tipo"], None)})
    return saida
