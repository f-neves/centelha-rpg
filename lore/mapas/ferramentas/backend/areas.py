"""Ferramenta de Área (etapa B4, 2026-09-23): relevo, cobertura e lago.

Esquema em `ESPEC-dados.md` (`dados/areas-pintadas.geojson`). O que esta etapa
cobre: desenhar polígono, salvar, **área nova recorta a antiga da mesma camada**
(shapely `difference`), `MultiPolygon` quando o recorte partir uma área em dois,
apagar, travar, e tudo passando pela infraestrutura de gravação de B1
(`operacoes.py`), então desfazer e refazer funcionam sem código próprio.

**Fora desta etapa, de propósito**: recorte pela costa (é a etapa seguinte) e
edição de vértice de área já salva.

Duas decisões que o pedido não fixava e o código precisou:

1. **Área travada não é recortada. Quem cede é a área NOVA.** O recorte é uma
   escrita na área antiga, e "travado não muda" tem que valer contra qualquer
   escrita, senão a trava protegeria menos do que anuncia. Então uma antiga
   travada sobrevive inteira e o polígono novo é que perde o pedaço sobreposto.
   Se sobrar nada do novo, a criação é recusada (e nada é gravado).
2. **O recorte gera UMA operação só**, com a área nova e todas as antigas
   afetadas dentro das mesmas `mudancas`. Um desfazer devolve o estado inteiro de
   antes do traço, não meio recorte.
"""

import json
import random
from pathlib import Path

from shapely.geometry import mapping, shape
from shapely.geometry.base import BaseGeometry

from . import operacoes, travas

RAIZ_MAPAS = Path(__file__).resolve().parents[2]
CAMINHO_DADOS = RAIZ_MAPAS / "dados" / "areas-pintadas.geojson"
CAMINHO_RELATIVO = "dados/areas-pintadas.geojson"

# Vocabulário fechado, copiado de CARTOGRAFO.md ("Técnica") em forma de slug, do
# mesmo jeito que ESPEC-dados.md mostra ("floresta-boreal").
VALORES_POR_CAMADA = {
    "relevo": {"planicie", "colina", "montanha", "alta-montanha"},
    "cobertura": {
        "floresta-temperada", "floresta-tropical", "floresta-boreal", "selva",
        "campo", "deserto", "pantano", "tundra", "geleira",
    },
    # Lago é uma camada de um valor só: o que distingue um lago de outro é a
    # geometria, não um vocabulário.
    "lago": {"lago"},
}


def carregar() -> dict:
    with open(CAMINHO_DADOS, encoding="utf-8") as f:
        return json.load(f)


def _achar(dados: dict, id_area: str) -> dict:
    for f in dados["features"]:
        if f["properties"]["id"] == id_area:
            return f
    raise KeyError(f"área desconhecida: {id_area}")


def _so_poligono(geometria: BaseGeometry) -> BaseGeometry:
    """`difference` entre polígonos que se tocam pode devolver uma
    GeometryCollection com linhas/pontos de borda junto. Área pintada é
    Polygon/MultiPolygon e nada mais, então o resto é descartado aqui."""
    if geometria.is_empty:
        return geometria
    if geometria.geom_type in ("Polygon", "MultiPolygon"):
        return geometria
    from shapely.geometry import MultiPolygon
    pedacos = [g for g in geometria.geoms if g.geom_type in ("Polygon", "MultiPolygon")]
    if not pedacos:
        return MultiPolygon()
    return MultiPolygon([p for g in pedacos for p in (g.geoms if g.geom_type == "MultiPolygon" else [g])])


def _validar(camada: str, valor: str, geometria: dict) -> BaseGeometry:
    if camada not in VALORES_POR_CAMADA:
        raise ValueError(f"'camada' tem que ser um de {sorted(VALORES_POR_CAMADA)}, recebi {camada!r}")
    if valor not in VALORES_POR_CAMADA[camada]:
        raise ValueError(
            f"'valor' {valor!r} não pertence à camada {camada!r} "
            f"(válidos: {sorted(VALORES_POR_CAMADA[camada])})"
        )
    if not isinstance(geometria, dict) or geometria.get("type") not in ("Polygon", "MultiPolygon"):
        raise ValueError("a geometria tem que ser um Polygon ou MultiPolygon")
    forma = shape(geometria)
    if not forma.is_valid:
        # Auto-interseção (um traço que se cruza) é o caso comum; buffer(0) é o
        # conserto padrão do shapely e não muda um polígono já válido.
        forma = forma.buffer(0)
    forma = _so_poligono(forma)
    if forma.is_empty or forma.area <= 0:
        raise ValueError("o polígono é vazio ou não tem área (pelo menos 3 pontos distintos)")
    return forma


def criar_area(id_area: str, camada: str, valor: str, geometria: dict, semente_ruido: int | None = None,
               exemplo: bool = False) -> dict:
    """`exemplo=True` grava `"exemplo": true` nas propriedades, como já se faz nos
    lugares de exemplo: área pintada pela IA para teste, para o usuário substituir.
    Falso não grava o campo."""
    if not isinstance(exemplo, bool):
        raise ValueError("'exemplo' tem que ser booleano")
    # Validar ANTES de checar a trava: camada inventada é dado inválido (422), e
    # `exigir_camada_livre` só sabe procurar camada que existe.
    forma_nova = _validar(camada, valor, geometria)
    travas.exigir_camada_livre(camada, "criar uma área")

    dados = carregar()
    if any(f["properties"]["id"] == id_area for f in dados["features"]):
        raise ValueError(f"id já existe: {id_area}")

    mudancas: dict = {}
    for antiga in dados["features"]:
        propriedades = antiga["properties"]
        if propriedades["camada"] != camada:
            continue  # recorte NUNCA atravessa camada (ESPEC-dados, "Princípios gerais")
        forma_antiga = shape(antiga["geometry"])
        if not forma_antiga.intersects(forma_nova):
            continue
        if propriedades.get("travado"):
            forma_nova = _so_poligono(forma_nova.difference(forma_antiga))
            continue
        resto = _so_poligono(forma_antiga.difference(forma_nova))
        if resto.is_empty or resto.area <= 0:
            mudancas[propriedades["id"]] = {"antes": antiga, "depois": None}
        else:
            depois = json.loads(json.dumps(antiga))
            depois["geometry"] = mapping(resto)  # vira MultiPolygon sozinho se o corte partiu em dois
            mudancas[propriedades["id"]] = {"antes": antiga, "depois": depois}

    if forma_nova.is_empty or forma_nova.area <= 0:
        raise ValueError("a área nova ficou sem nada depois de ceder às áreas travadas embaixo dela")

    feature = {
        "type": "Feature",
        "geometry": mapping(forma_nova),
        "properties": {
            "id": id_area,
            "camada": camada,
            "valor": valor,
            "semente_ruido": random.randint(1, 99999) if semente_ruido is None else int(semente_ruido),
            "travado": False,
        },
    }
    if exemplo:
        feature["properties"]["exemplo"] = True
    mudancas[id_area] = {"antes": None, "depois": feature}
    operacoes.registrar_operacao("criar_area", CAMINHO_RELATIVO, mudancas)
    return feature


def apagar_area(id_area: str) -> None:
    dados = carregar()
    antiga = _achar(dados, id_area)
    travas.exigir_objeto_livre(antiga["properties"]["camada"], antiga["properties"], "apagar esta área")
    operacoes.registrar_operacao(
        "apagar_area", CAMINHO_RELATIVO, {id_area: {"antes": antiga, "depois": None}},
    )


def definir_trava(id_area: str, travado: bool) -> dict:
    if not isinstance(travado, bool):
        raise ValueError("'travado' tem que ser booleano")
    dados = carregar()
    antiga = _achar(dados, id_area)
    travas.exigir_camada_livre(antiga["properties"]["camada"], "mudar a trava desta área")
    depois = json.loads(json.dumps(antiga))
    depois["properties"]["travado"] = travado
    operacoes.registrar_operacao(
        "travar_area" if travado else "destravar_area", CAMINHO_RELATIVO,
        {id_area: {"antes": antiga, "depois": depois}},
    )
    return depois
