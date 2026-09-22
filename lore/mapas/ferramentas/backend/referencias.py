"""Camadas de referência (etapa 2, ESPEC-ferramenta.md correção 10). Dois tipos
(campo 'tipo'): 'imagem' (as 4 do ChatGPT — posição/escala em bounds, lat/lon,
opacidade e visibilidade ajustáveis) e 'tile' (Rótulos e Ocean Deep — pirâmide de
tiles pré-gerada, já alinhada ao mundo inteiro pela CRS, sem bounds próprio).
Gravadas em dados/camadas_referencia.json.

**Posição passa pelo desfazer desde 2026-09-23** (pedido do usuário, junto com a
troca do alinhamento manual por 2 pontos pelos botões "reset"/"automático"):
`visivel`/`opacidade` continuam gravação direta (não são undo-áveis, como já
eram); `bounds` agora sempre passa por `operacoes.registrar_operacao` (B1), com
`chave_lista="camadas"` (o documento usa `camadas`, não `features` como um
FeatureCollection -- `operacoes.py` foi generalizado para os dois formatos).
"""

import json
from pathlib import Path

from . import coordenadas, operacoes

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "camadas_referencia.json"
CAMINHO_RELATIVO = "dados/camadas_referencia.json"

CAMPOS_BOUNDS = ("sul", "norte", "oeste", "leste")


def carregar() -> dict:
    with open(CAMINHO_DADOS, encoding="utf-8") as f:
        return json.load(f)


def _achar(dados: dict, id_camada: str) -> dict:
    for camada in dados["camadas"]:
        if camada["id"] == id_camada:
            return camada
    raise KeyError(f"camada de referência desconhecida: {id_camada}")


def _validar_camada(camada: dict) -> None:
    if not isinstance(camada.get("visivel"), bool):
        raise ValueError("'visivel' tem que ser booleano")
    op = camada.get("opacidade")
    if not isinstance(op, (int, float)) or not (0 <= op <= 1):
        raise ValueError("'opacidade' tem que ser um número entre 0 e 1")
    # Camada 'tile' (Rótulos, Ocean Deep) não tem bounds próprio: a pirâmide de
    # tiles já cobre o mundo inteiro pela mesma CRS da costa, sem posição
    # ajustável. Só 'imagem' (as 4 do ChatGPT) precisa de bounds válido.
    if camada.get("tipo") == "tile":
        return
    bounds = camada.get("bounds", {})
    for campo in CAMPOS_BOUNDS:
        if not isinstance(bounds.get(campo), (int, float)):
            raise ValueError(f"bounds.{campo} tem que ser um número")
    if bounds["sul"] >= bounds["norte"]:
        raise ValueError("bounds.sul tem que ser menor que bounds.norte")
    if bounds["oeste"] >= bounds["leste"]:
        raise ValueError("bounds.oeste tem que ser menor que bounds.leste")


def atualizar_camada(id_camada: str, mudanca: dict) -> dict:
    """Aplica `visivel`/`opacidade` (gravação direta, não desfazível -- sem
    mudança de comportamento) e/ou `bounds` (agora vai por `mudar_posicao`,
    desfazível). Devolve o documento inteiro já atualizado."""
    if "bounds" in mudanca:
        resto = {k: v for k, v in mudanca.items() if k != "bounds"}
        if resto:
            _gravar_direto(id_camada, resto)
        return mudar_posicao(id_camada, mudanca["bounds"])
    return _gravar_direto(id_camada, mudanca)


def _gravar_direto(id_camada: str, mudanca: dict) -> dict:
    dados = carregar()
    achada = _achar(dados, id_camada)
    if "visivel" in mudanca:
        achada["visivel"] = mudanca["visivel"]
    if "opacidade" in mudanca:
        achada["opacidade"] = mudanca["opacidade"]
    _validar_camada(achada)

    import os
    tmp = CAMINHO_DADOS.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    os.replace(tmp, CAMINHO_DADOS)
    return dados


def mudar_posicao(id_camada: str, bounds_parcial: dict) -> dict:
    """Muda só `bounds` (posição/escala) de uma camada `imagem`, como uma
    operação desfazível (B1). `bounds_parcial` pode ter só alguns dos 4 campos
    (ajuste fino pelos campos numéricos) -- os que faltarem mantêm o valor
    atual."""
    dados = carregar()
    camada_antes = _achar(dados, id_camada)
    if camada_antes.get("tipo") == "tile":
        raise ValueError(f"camada '{id_camada}' é tipo 'tile' -- não tem posição ajustável")

    camada_depois = json.loads(json.dumps(camada_antes))
    camada_depois["bounds"] = {**camada_antes["bounds"], **bounds_parcial}
    _validar_camada(camada_depois)

    operacoes.registrar_operacao(
        "mover_camada_referencia", CAMINHO_RELATIVO,
        {id_camada: {"antes": camada_antes, "depois": camada_depois}},
        chave_lista="camadas",
    )
    return carregar()


def resetar_posicao(id_camada: str) -> dict:
    """"reset": encaixa a imagem canto a canto nos limites do mundo inteiro."""
    limites = coordenadas.carregar_coordenadas()["limites_da_tela"]
    bounds_mundo = {
        "sul": limites["latitude_base"],
        "norte": limites["latitude_topo"],
        "oeste": limites["longitude_esquerda"],
        "leste": limites["longitude_direita"],
    }
    return mudar_posicao(id_camada, bounds_mundo)


def usar_alinhamento_automatico(id_camada: str) -> dict:
    """"automático": volta para os limites calculados pelo alinhamento automático
    (scripts/alinhar_chatgpt_auto.py), guardados em `bounds_automatico` -- campo
    próprio, nunca sobrescrito por ajuste manual, para o resultado do
    alinhamento nunca se perder (pedido do usuário, 2026-09-23)."""
    dados = carregar()
    camada = _achar(dados, id_camada)
    bounds_automatico = camada.get("bounds_automatico")
    if bounds_automatico is None:
        raise ValueError(f"camada '{id_camada}' não tem alinhamento automático gravado")
    return mudar_posicao(id_camada, bounds_automatico)
