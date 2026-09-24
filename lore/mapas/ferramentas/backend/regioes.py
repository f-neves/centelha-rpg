"""Etapa 10 SEM o cache de identidade de ilha (2026-09-23, noite): o painel de regiões.

O que esta etapa cobre, e por quê só isso:

- **Regiões** (`dados/regioes.json`): criar, editar nome/tipo/pai, mover o rótulo e
  apagar. Esquema em `ESPEC-dados.md` sem mudança: `tipo` fechado, `pai` opcional,
  `geometria` continua `null` (região menor que uma ilha fica para depois).
- **Pertencimento de ilha** (`dados/massas.geojson`, correção 7: só lá): atribuir uma
  massa a uma região, ou tirá-la (`sem_regiao`), escolhendo a massa **pela lista**,
  pelo id. `status` segue o `regiao`: `atribuida` com região, `sem_regiao` sem.

**Fora, de propósito**, porque dependem da geometria da ilha, e o cache que a daria
continua proibido pelo usuário: clicar numa ilha para saber qual é, a regra dos
100 km (atribuição automática perto da ilha principal) e criar massa nova. Massa
nova hoje só por edição do arquivo.

Decisões que o código precisou e o pedido não fixava (recomendação do Cartógrafo):

1. **Apagar região em uso é recusado** (409, como a trava): se alguma região a tem
   como `pai`, ou alguma massa a tem como `regiao`. Apagar em cascata mexeria em
   dado de outro arquivo sem o usuário ver.
2. **Cadeado de camada para regiões** (rodada das pendências, 2026-09-23, item c):
   com a camada `regioes` travada nada deste módulo grava, nem a região de uma massa
   (atribuir e registrar ilha). Região continua sem trava por objeto.
3. **Id de região**: slug minúsculo com hífen (`ESPEC-dados.md`, correção 9), e
   não muda depois de criado (é o que `massas.geojson` e `pai` referenciam).
4. **`pai` não pode formar ciclo** (região que seria avó de si mesma).

Toda escrita passa por `operacoes.registrar_operacao`, então desfazer e refazer
funcionam sem código próprio: `regioes.json` é uma lista de itens com `id`
(`chave_lista="regioes"`) e `massas.geojson` é um FeatureCollection.
"""

import json
import re
from pathlib import Path

from . import coordenadas, operacoes, travas

CAMADA = "regioes"   # cadeado geral (travas.py), rodada das pendências de 2026-09-23

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_REGIOES = RAIZ_MAPAS / "dados" / "regioes.json"
CAMINHO_MASSAS = RAIZ_MAPAS / "dados" / "massas.geojson"
RELATIVO_REGIOES = "dados/regioes.json"
RELATIVO_MASSAS = "dados/massas.geojson"

# Vocabulário fechado, copiado de ESPEC-dados.md (`dados/regioes.json`).
TIPOS = ("arquipelago", "ilha", "provincia", "reino", "mar", "golfo", "baia", "estreito")
_SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


class EmUso(Exception):
    """Recusa por dependência (região com filhas ou com massas), não por dado
    inválido: vira 409 em main.py, como a trava."""


def carregar_regioes() -> dict:
    with open(CAMINHO_REGIOES, encoding="utf-8") as f:
        return json.load(f)


def carregar_massas() -> dict:
    with open(CAMINHO_MASSAS, encoding="utf-8") as f:
        return json.load(f)


def _achar(dados: dict, id_regiao: str) -> dict:
    for r in dados["regioes"]:
        if r["id"] == id_regiao:
            return r
    raise KeyError(f"região desconhecida: {id_regiao}")


def _validar_rotulo(rotulo) -> dict | None:
    if rotulo is None:
        return None
    if not isinstance(rotulo, dict) or set(rotulo) != {"lon", "lat"}:
        raise ValueError("'rotulo' tem que ser {lon, lat} ou null")
    lon, lat = rotulo["lon"], rotulo["lat"]
    if not all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in (lon, lat)):
        raise ValueError("'rotulo' tem que ter lon e lat numéricos")
    lim = coordenadas.carregar_coordenadas()["limites_da_tela"]
    if not (lim["longitude_esquerda"] <= lon <= lim["longitude_direita"]
            and lim["latitude_base"] <= lat <= lim["latitude_topo"]):
        raise ValueError("o rótulo cai fora da tela do mapa")
    return {"type": "Point", "coordinates": [round(float(lon), 4), round(float(lat), 4)]}


def _validar_campos(dados: dict, id_regiao: str, nome, tipo, pai) -> None:
    if not isinstance(nome, str) or not nome.strip():
        raise ValueError("'nome' não pode ser vazio")
    if tipo not in TIPOS:
        raise ValueError(f"'tipo' tem que ser um de {list(TIPOS)}, recebi {tipo!r}")
    if pai is None:
        return
    if pai == id_regiao:
        raise ValueError("uma região não pode ser pai de si mesma")
    _achar(dados, pai)  # KeyError vira 422 em quem chama: pai inexistente é dado inválido
    # Subindo pela cadeia de pais a partir do pai novo, não se pode chegar em id_regiao.
    visto, atual = set(), pai
    while atual is not None:
        if atual == id_regiao:
            raise ValueError(f"'{pai}' como pai formaria um ciclo")
        if atual in visto:
            break
        visto.add(atual)
        atual = _achar(dados, atual).get("pai")


def criar_regiao(id_regiao: str, nome: str, tipo: str, pai: str | None = None, rotulo=None) -> dict:
    if not isinstance(id_regiao, str) or not _SLUG.match(id_regiao):
        raise ValueError("'id' tem que ser slug minúsculo com hífen (ex.: 'mar-de-syl')")
    travas.exigir_camada_livre(CAMADA, "criar uma região")
    dados = carregar_regioes()
    if any(r["id"] == id_regiao for r in dados["regioes"]):
        raise ValueError(f"id já existe: {id_regiao}")
    try:
        _validar_campos(dados, id_regiao, nome, tipo, pai)
    except KeyError as e:
        raise ValueError(e.args[0])
    nova = {"id": id_regiao, "nome": nome.strip(), "tipo": tipo, "pai": pai, "geometria": None,
            "rotulo": _validar_rotulo(rotulo)}
    operacoes.registrar_operacao("criar_regiao", RELATIVO_REGIOES, {id_regiao: {"antes": None, "depois": nova}},
                                 chave_lista="regioes")
    return nova


def editar_regiao(id_regiao: str, nome: str, tipo: str, pai: str | None,
                  visivel_jogador: bool | None = None) -> dict:
    """`visivel_jogador` (B3): None mantém o que está; False tira a região (nome e
    rótulo) da versão do jogador das exportações. Ausente no dado vale true."""
    travas.exigir_camada_livre(CAMADA, "editar esta região")
    dados = carregar_regioes()
    antes = _achar(dados, id_regiao)
    try:
        _validar_campos(dados, id_regiao, nome, tipo, pai)
    except KeyError as e:
        raise ValueError(e.args[0])
    if visivel_jogador is not None and not isinstance(visivel_jogador, bool):
        raise ValueError("'visivel_jogador' tem que ser booleano")
    depois = {**antes, "nome": nome.strip(), "tipo": tipo, "pai": pai}
    if visivel_jogador is not None:
        depois["visivel_jogador"] = visivel_jogador
    operacoes.registrar_operacao("editar_regiao", RELATIVO_REGIOES, {id_regiao: {"antes": antes, "depois": depois}},
                                 chave_lista="regioes")
    return depois


def mover_rotulo(id_regiao: str, rotulo) -> dict:
    travas.exigir_camada_livre(CAMADA, "mover o nome desta região")
    dados = carregar_regioes()
    antes = _achar(dados, id_regiao)
    depois = {**antes, "rotulo": _validar_rotulo(rotulo)}
    operacoes.registrar_operacao("mover_rotulo_regiao", RELATIVO_REGIOES,
                                 {id_regiao: {"antes": antes, "depois": depois}}, chave_lista="regioes")
    return depois


def apagar_regiao(id_regiao: str) -> None:
    travas.exigir_camada_livre(CAMADA, "apagar esta região")
    dados = carregar_regioes()
    antes = _achar(dados, id_regiao)
    filhas = [r["id"] for r in dados["regioes"] if r.get("pai") == id_regiao]
    massas = [f["properties"]["id"] for f in carregar_massas()["features"]
              if f["properties"].get("regiao") == id_regiao]
    if filhas or massas:
        partes = []
        if filhas:
            partes.append(f"é pai de {', '.join(filhas)}")
        if massas:
            partes.append(f"tem as massas {', '.join(massas)}")
        raise EmUso(f"a região '{id_regiao}' {' e '.join(partes)} · tire essas ligações antes de apagar")
    operacoes.registrar_operacao("apagar_regiao", RELATIVO_REGIOES, {id_regiao: {"antes": antes, "depois": None}},
                                 chave_lista="regioes")


def atribuir_massa(id_massa: str, id_regiao: str | None) -> dict:
    travas.exigir_camada_livre(CAMADA, "mudar a região desta ilha")
    massas = carregar_massas()
    antes = next((f for f in massas["features"] if f["properties"]["id"] == id_massa), None)
    if antes is None:
        raise KeyError(f"massa desconhecida: {id_massa}")
    if id_regiao is not None:
        try:
            _achar(carregar_regioes(), id_regiao)
        except KeyError as e:
            raise ValueError(e.args[0])
    depois = json.loads(json.dumps(antes))
    depois["properties"]["regiao"] = id_regiao
    depois["properties"]["status"] = "atribuida" if id_regiao else "sem_regiao"
    operacoes.registrar_operacao("atribuir_massa", RELATIVO_MASSAS, {id_massa: {"antes": antes, "depois": depois}})
    return depois


# --- Massa nova pelo cache de ilha (2026-09-23 noite, cache autorizado) ------------

def criar_massa(lon: float, lat: float, id_regiao: str | None = None, usar_regra: bool = True) -> dict:
    """Registra a ilha que está em (lon, lat) em `massas.geojson`, com o ponto
    clicado como referência. Sem região explícita e com `usar_regra`, vale a regra
    dos 100 km: atribuída só se UMA região tiver a ilha principal a menos de 100 km;
    senão `sem_regiao`, e quem decide é o usuário. Recusa ponto no mar, cache
    ausente e ilha que já tem massa registrada (a identidade é uma por ilha)."""
    from . import ilhas
    travas.exigir_camada_livre(CAMADA, "registrar esta ilha")
    if not ilhas.existe():
        raise ValueError("o cache de ilha não foi gerado (scripts/gerar_cache_ilhas.py)")
    info = ilhas.descrever(lon, lat)
    if not info["terra"]:
        raise ValueError("o ponto cai no mar")
    if info["massas"]:
        raise ValueError(f"esta ilha já tem massa registrada: {', '.join(info['massas'])}")
    if id_regiao is not None:
        try:
            _achar(carregar_regioes(), id_regiao)
        except KeyError as e:
            raise ValueError(e.args[0])
    elif usar_regra:
        id_regiao = info["regiao_sugerida"]
    massas = carregar_massas()
    maior = 0
    for f in massas["features"]:
        m = re.match(r"^ilha-(\d+)$", f["properties"]["id"])
        if m:
            maior = max(maior, int(m.group(1)))
    novo_id = f"ilha-{maior + 1:03d}"
    area_px = ilhas.componentes()["componentes"][str(info["componente"])]["area_px"]
    feature = {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [round(float(lon), 4), round(float(lat), 4)]},
        "properties": {
            "id": novo_id, "regiao": id_regiao,
            "status": "atribuida" if id_regiao else "sem_regiao",
            # Mesmo campo das massas antigas: área na escala 2048 (10240 / 5).
            "area_px_2048": round(area_px / 25),
            "nota": ("regra dos 100 km" if id_regiao and id_regiao == info["regiao_sugerida"] and usar_regra
                     else "registrada pela ferramenta"),
        },
    }
    operacoes.registrar_operacao("criar_massa", RELATIVO_MASSAS, {novo_id: {"antes": None, "depois": feature}})
    return feature
