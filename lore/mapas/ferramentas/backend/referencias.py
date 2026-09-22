"""Camadas de referência (etapa 2, ESPEC-ferramenta.md correção 10). Dois tipos
(campo 'tipo'): 'imagem' (as 4 do ChatGPT — posição/escala em bounds, lat/lon,
opacidade e visibilidade ajustáveis) e 'tile' (Rótulos e Ocean Deep — pirâmide de
tiles pré-gerada, já alinhada ao mundo inteiro pela CRS, sem bounds próprio).
Gravadas em dados/camadas_referencia.json.
"""

import json
import os
from pathlib import Path

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "camadas_referencia.json"

CAMPOS_BOUNDS = ("sul", "norte", "oeste", "leste")


def carregar() -> dict:
    with open(CAMINHO_DADOS, encoding="utf-8") as f:
        return json.load(f)


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
    """Aplica `mudanca` (visivel/opacidade/bounds, parcial) na camada de id
    `id_camada`, valida e grava atomicamente (tmp + os.replace). Devolve o
    documento inteiro já atualizado."""
    dados = carregar()
    achada = None
    for camada in dados["camadas"]:
        if camada["id"] == id_camada:
            achada = camada
            break
    if achada is None:
        raise KeyError(f"camada de referência desconhecida: {id_camada}")

    if "visivel" in mudanca:
        achada["visivel"] = mudanca["visivel"]
    if "opacidade" in mudanca:
        achada["opacidade"] = mudanca["opacidade"]
    if "bounds" in mudanca:
        achada["bounds"] = {**achada["bounds"], **mudanca["bounds"]}

    _validar_camada(achada)

    tmp = CAMINHO_DADOS.with_suffix(".tmp")
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    os.replace(tmp, CAMINHO_DADOS)

    return dados
