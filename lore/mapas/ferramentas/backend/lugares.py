"""Ferramenta de Lugar (ponto) -- B2 da rodada noturna de 2026-09-22, esquema de
`importancia` corrigido em 2026-09-23.

Vocabulário fechado de `tipo` e as validações "capital só em cidade" / "ponto cai em
terra" vêm de `ESPEC-dados.md`. Toda gravação passa por `operacoes.registrar_operacao`
(B1) -- cada criar/mover/editar/apagar vira uma operação desfazível, gravando só a
feature afetada (correção de 2026-09-23, ver docstring de `operacoes.py`).

**Esquema de `importancia`**: `"pequena"`, `"media"`, `"grande"`, ou `null`. `null`
tem o mesmo tratamento VISUAL de `"pequena"` na ferramenta (tamanho do marcador)
-- mas o valor gravado pode ficar `null` (lugar ainda não classificado) sem que
isso force um valor no dado. Decidido na segunda rodada (2026-09-21); perdido numa
reescrita de `ESPEC-dados.md` antes do commit `96e4188` (achado em 2026-09-22,
corrigido em 2026-09-23 com o documento original recuperado pelo usuário -- ver
`ESPEC-dados.md`, "Nota de recuperação"). `capital` continua validado como
booleano (é o que faz "capital só em cidade"
funcionar).
"""

import json
from pathlib import Path

import numpy as np
from PIL import Image

from . import coordenadas, operacoes, travas

CAMADA = "lugares"  # a camada deste tipo de objeto no cadeado geral (travas.py)

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_LUGARES = RAIZ_MAPAS / "dados" / "lugares.geojson"
CAMINHO_COSTA = RAIZ_MAPAS / "mascaras" / "costa_10240.png"

TIPOS_VALIDOS = {"cidade", "vila", "fortaleza", "porto", "ruina", "marco"}
IMPORTANCIAS_VALIDAS = {"pequena", "media", "grande"}

_costa_array = None  # cache em memória -- uma imagem de 10240px só é aberta UMA
                      # vez por processo, nunca a cada checagem de ponto (evitaria
                      # decodificar ~104 MB repetidamente a cada lugar criado).


def _costa() -> np.ndarray:
    global _costa_array
    if _costa_array is None:
        with Image.open(CAMINHO_COSTA) as im:
            _costa_array = np.asarray(im)
    return _costa_array


def ponto_em_terra(lon: float, lat: float) -> bool:
    """255 = terra, 0 = mar (achado registrado em CARTOGRAFO.md, "Achados técnicos
    registrados") -- ponto fora da tela de 10240px também conta como 'não é terra'."""
    dados = coordenadas.carregar_coordenadas()
    projecao = dados["projecao"]
    referencia = dados["referencia"]
    px_por_grau = projecao["px_por_grau"]
    x = round(referencia["x_meridiano_zero_px"] + lon * px_por_grau)
    y = round(referencia["y_equador_px"] - lat * px_por_grau)
    arr = _costa()
    if not (0 <= y < arr.shape[0] and 0 <= x < arr.shape[1]):
        return False
    return bool(arr[y, x] >= 128)


def carregar() -> dict:
    with open(CAMINHO_LUGARES, encoding="utf-8") as f:
        return json.load(f)


def validar_propriedades(propriedades: dict) -> None:
    tipo = propriedades.get("tipo")
    if tipo not in TIPOS_VALIDOS:
        raise ValueError(f"'tipo' tem que ser um de {sorted(TIPOS_VALIDOS)}, recebi {tipo!r}")
    capital = propriedades.get("capital", False)
    if not isinstance(capital, bool):
        raise ValueError("'capital' tem que ser booleano")
    if capital and tipo != "cidade":
        raise ValueError("'capital' só pode ser True quando 'tipo' é 'cidade'")
    importancia = propriedades.get("importancia")
    if importancia is not None and importancia not in IMPORTANCIAS_VALIDAS:
        raise ValueError(
            f"'importancia' tem que ser null ou um de {sorted(IMPORTANCIAS_VALIDAS)}, recebi {importancia!r}"
        )
    travado = propriedades.get("travado", False)
    if not isinstance(travado, bool):
        raise ValueError("'travado' tem que ser booleano")
    # Visibilidade para o jogador (B3, 2026-09-23 noite): ausente vale true. False
    # tira o lugar (e o nome dele) da versão do jogador de toda exportação.
    if not isinstance(propriedades.get("visivel_jogador", True), bool):
        raise ValueError("'visivel_jogador' tem que ser booleano")


def criar_lugar(id_lugar: str, lon: float, lat: float, propriedades: dict) -> dict:
    # Camada travada é INERTE: não recebe objeto novo também. Decisão da IA (o
    # pedido fala de mover e apagar); é o que um cadeado de camada significa em
    # qualquer editor, e destravar desfaz a restrição sem deixar rastro.
    travas.exigir_camada_livre(CAMADA, "criar um lugar")
    validar_propriedades(propriedades)
    if not ponto_em_terra(lon, lat):
        raise ValueError("o ponto cai fora de terra (mar, ou fora da tela) -- lugar tem que ficar em terra")

    dados = carregar()
    if any(f["properties"]["id"] == id_lugar for f in dados["features"]):
        raise ValueError(f"id já existe: {id_lugar}")

    feature = {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [lon, lat]},
        # `travado` sempre presente no dado (padrão false, ESPEC-dados.md): um
        # campo ausente e um `false` valem o mesmo na leitura, mas gravar
        # explícito deixa o arquivo legível sem consultar o padrão.
        "properties": {"id": id_lugar, **propriedades, "travado": bool(propriedades.get("travado", False))},
    }
    operacoes.registrar_operacao(
        "criar_lugar", "dados/lugares.geojson",
        {id_lugar: {"antes": None, "depois": feature}},
    )
    return feature


def _achar(dados: dict, id_lugar: str) -> dict:
    for f in dados["features"]:
        if f["properties"]["id"] == id_lugar:
            return f
    raise KeyError(f"lugar desconhecido: {id_lugar}")


def mover_lugar(id_lugar: str, lon: float, lat: float) -> dict:
    dados = carregar()
    feature_antes = _achar(dados, id_lugar)
    # A trava é checada ANTES da validação de terra: um lugar travado nem chega a
    # ser avaliado, e o aviso que o usuário recebe é "está travado", não "caiu no
    # mar" (seriam dois motivos diferentes para a mesma recusa).
    travas.exigir_objeto_livre(CAMADA, feature_antes["properties"], "mover este lugar")
    if not ponto_em_terra(lon, lat):
        raise ValueError("o ponto cai fora de terra (mar, ou fora da tela) -- lugar tem que ficar em terra")
    feature_depois = json.loads(json.dumps(feature_antes))
    feature_depois["geometry"]["coordinates"] = [lon, lat]
    operacoes.registrar_operacao(
        "mover_lugar", "dados/lugares.geojson",
        {id_lugar: {"antes": feature_antes, "depois": feature_depois}},
    )
    return feature_depois


def editar_lugar(id_lugar: str, propriedades: dict) -> dict:
    dados = carregar()
    feature_antes = _achar(dados, id_lugar)
    travas.exigir_objeto_livre(CAMADA, feature_antes["properties"], "editar este lugar")
    novas_propriedades = {**feature_antes["properties"], **propriedades, "id": id_lugar}
    validar_propriedades(novas_propriedades)
    feature_depois = json.loads(json.dumps(feature_antes))
    feature_depois["properties"] = novas_propriedades
    operacoes.registrar_operacao(
        "editar_lugar", "dados/lugares.geojson",
        {id_lugar: {"antes": feature_antes, "depois": feature_depois}},
    )
    return feature_depois


def apagar_lugar(id_lugar: str) -> None:
    dados = carregar()
    feature_antes = _achar(dados, id_lugar)  # KeyError se não existir
    travas.exigir_objeto_livre(CAMADA, feature_antes["properties"], "apagar este lugar")
    operacoes.registrar_operacao(
        "apagar_lugar", "dados/lugares.geojson",
        {id_lugar: {"antes": feature_antes, "depois": None}},
    )


def definir_trava(id_lugar: str, travado: bool) -> dict:
    """Trava/destrava UM lugar. Caminho próprio, e não `editar_lugar`, por dois
    motivos: `editar_lugar` recusa objeto travado (senão nada travado poderia ser
    destravado), e a operação no log precisa se chamar "travar_lugar" pra ficar
    legível. A trava DE CAMADA continua mandando: com a camada travada, nem o
    estado individual muda (seria uma mudança sem efeito nenhum, e confusa)."""
    if not isinstance(travado, bool):
        raise ValueError("'travado' tem que ser booleano")
    travas.exigir_camada_livre(CAMADA, "mudar a trava deste lugar")
    dados = carregar()
    feature_antes = _achar(dados, id_lugar)
    feature_depois = json.loads(json.dumps(feature_antes))
    feature_depois["properties"]["travado"] = travado
    operacoes.registrar_operacao(
        "travar_lugar" if travado else "destravar_lugar", "dados/lugares.geojson",
        {id_lugar: {"antes": feature_antes, "depois": feature_depois}},
    )
    return feature_depois
