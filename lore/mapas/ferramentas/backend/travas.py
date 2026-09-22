"""Travar objeto e cadeado geral por camada (pedido de 2026-09-23, item 1).

Duas travas independentes, e é de propósito:

- **por objeto**: o campo `travado` (booleano, padrão `false`) nas `properties` de
  cada objeto editável -- lugar hoje; rio, estrada e área quando existirem. Mora no
  próprio dado (`ESPEC-dados.md`, seção "Travamento").
- **por camada**: este arquivo (`dados/camadas_travadas.json`), uma linha por
  camada. **Não escreve nada nos objetos** -- item 1d do pedido: "ao destravar a
  camada, cada objeto volta ao que era". Isso só é verdade se destravar a camada não
  precisar RESTAURAR nada, e só não precisa restaurar se travar a camada nunca tiver
  escrito no objeto.

A trava efetiva é a OU das duas: `esta_travado(objeto) == objeto.travado or
camada.travada`. Um objeto com `travado: false` numa camada travada está travado.

As duas passam pelo desfazer (item 1f): a do objeto pelo mesmo caminho de qualquer
edição de lugar, a da camada por `operacoes.registrar_operacao(...,
chave_lista="camadas")` -- o documento daqui é uma lista de itens com `id`, formato
que `operacoes.py` já sabia tratar desde que as camadas de referência entraram no
desfazer. Nenhuma máquina nova.
"""

import json
from pathlib import Path

from . import operacoes

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "camadas_travadas.json"
CAMINHO_RELATIVO = "dados/camadas_travadas.json"

# Vocabulário fechado, espelha ESPEC-dados.md ("Travamento"). Uma camada por tipo de
# objeto editável; areas-pintadas.geojson tem três (o campo `camada` da feature).
CAMADAS_VALIDAS = ("lugares", "rios", "estradas", "relevo", "cobertura", "lago")


class Travado(Exception):
    """Recusa por TRAVA, não por dado inválido. Separada de ValueError de propósito:
    o pedido (item 1b) diz que a tentativa em objeto travado dá "um aviso discreto
    dizendo que está travado, não um erro" -- quem chama precisa conseguir distinguir
    as duas coisas sem ler a mensagem. Vira HTTP 409 em main.py; ValueError vira 422.
    """


def carregar() -> dict:
    with open(CAMINHO_DADOS, encoding="utf-8") as f:
        return json.load(f)


def _achar(dados: dict, id_camada: str) -> dict:
    for camada in dados["camadas"]:
        if camada["id"] == id_camada:
            return camada
    raise KeyError(f"camada desconhecida: {id_camada}")


def camada_travada(id_camada: str) -> bool:
    return bool(_achar(carregar(), id_camada)["travada"])


def definir_trava_camada(id_camada: str, travada: bool) -> dict:
    if not isinstance(travada, bool):
        raise ValueError("'travada' tem que ser booleano")
    if id_camada not in CAMADAS_VALIDAS:
        raise KeyError(f"camada desconhecida: {id_camada}")
    dados = carregar()
    antes = _achar(dados, id_camada)
    depois = {**antes, "travada": travada}
    operacoes.registrar_operacao(
        "travar_camada" if travada else "destravar_camada",
        CAMINHO_RELATIVO,
        {id_camada: {"antes": antes, "depois": depois}},
        chave_lista="camadas",
    )
    return depois


def exigir_camada_livre(id_camada: str, acao: str) -> None:
    """Controle de entrada das operações que mexem em objeto. `acao` só entra na
    mensagem (é o que o aviso discreto mostra)."""
    if camada_travada(id_camada):
        raise Travado(f"a camada '{id_camada}' está travada · não dá para {acao}")


def exigir_objeto_livre(id_camada: str, propriedades: dict, acao: str) -> None:
    exigir_camada_livre(id_camada, acao)
    if propriedades.get("travado"):
        raise Travado(f"este objeto está travado · não dá para {acao}")
