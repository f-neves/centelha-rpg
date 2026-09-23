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

from shapely.geometry import LineString, Point, mapping, shape
from shapely.ops import unary_union
from shapely.geometry.base import BaseGeometry

from . import coordenadas, operacoes, travas

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


def _recortar_vizinhas(dados: dict, camada: str, forma_nova: BaseGeometry,
                       ignorar: str | None) -> tuple[BaseGeometry, dict]:
    """A regra do recorte (decisão 3), comum a criar e a editar: a forma nova recorta
    as áreas da MESMA camada, e cede às travadas. Devolve a forma que sobrou e as
    `mudancas` das vizinhas. `ignorar` é a própria área, quando é uma edição."""
    mudancas: dict = {}
    for antiga in dados["features"]:
        propriedades = antiga["properties"]
        if propriedades["camada"] != camada or propriedades["id"] == ignorar:
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
    return forma_nova, mudancas


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

    forma_nova, mudancas = _recortar_vizinhas(dados, camada, forma_nova, ignorar=None)
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


def editar_geometria(id_area: str, geometria: dict) -> dict:
    """Edição de vértice de área já salva (2026-09-23, noite): a geometria inteira
    nova no lugar da antiga, com a MESMA regra da criação: valida, recorta as vizinhas
    da mesma camada, cede às travadas, e uma operação só no log. Área travada (ou
    camada travada) não se edita. Camada, valor, semente e marca de exemplo ficam."""
    dados = carregar()
    antiga = _achar(dados, id_area)
    props = antiga["properties"]
    forma_nova = _validar(props["camada"], props["valor"], geometria)
    travas.exigir_objeto_livre(props["camada"], props, "editar esta área")
    forma_nova, mudancas = _recortar_vizinhas(dados, props["camada"], forma_nova, ignorar=id_area)
    if forma_nova.is_empty or forma_nova.area <= 0:
        raise ValueError("a área editada ficou sem nada depois de ceder às áreas travadas vizinhas")
    depois = json.loads(json.dumps(antiga))
    depois["geometry"] = mapping(forma_nova)
    mudancas[id_area] = {"antes": antiga, "depois": depois}
    operacoes.registrar_operacao("editar_area", CAMINHO_RELATIVO, mudancas)
    return depois


# --- Pincel (2026-09-23, noite) ----------------------------------------------------
#
# Pintar e apagar à mão livre: o traço do mouse (uma linha de pontos) engordado pelo
# raio do pincel vira um polígono, e esse polígono entra pelas mesmas regras de
# sempre. Decisões do Cartógrafo (recomendação):
#
# 1. **Pintar FUNDE com a área do mesmo valor que o traço toca.** Sem isso cada
#    pincelada seria uma área nova, e uma floresta pintada em vinte traços viraria
#    vinte áreas com vinte sementes de ruído e vinte bordas entre elas. A área que
#    sobrevive é a de menor id entre as tocadas, com a semente dela (a identidade da
#    borda não muda); as outras tocadas são absorvidas (apagadas na mesma operação).
#    Sem nenhuma do mesmo valor tocada, nasce uma área nova, `area-NNNN`.
# 2. Área de OUTRO valor da mesma camada é recortada, e a travada não se toca (o
#    traço cede), exatamente como na criação.
# 3. **Apagar** tira o traço de toda área livre da mesma camada; travada fica.
# 4. O traço é simplificado com tolerância de 15% do raio antes de tudo: pincelada
#    repetida não pode inflar o número de vértices sem limite (cada operação do log
#    custa umas duas vezes a geometria que toca).
# 5. Uma pincelada é UMA operação: um desfazer volta a pincelada inteira.
RAIO_PINCEL_KM = (2.0, 400.0)


def _forma_do_traco(linha, raio_km: float):
    if not isinstance(raio_km, (int, float)) or isinstance(raio_km, bool):
        raise ValueError("'raio_km' tem que ser um número")
    if not RAIO_PINCEL_KM[0] <= raio_km <= RAIO_PINCEL_KM[1]:
        raise ValueError(f"'raio_km' tem que ficar entre {RAIO_PINCEL_KM[0]:g} e {RAIO_PINCEL_KM[1]:g}")
    if not isinstance(linha, list) or not linha:
        raise ValueError("o traço precisa de pelo menos um ponto")
    for p in linha:
        if not (isinstance(p, (list, tuple)) and len(p) == 2
                and all(isinstance(v, (int, float)) and not isinstance(v, bool) for v in p)):
            raise ValueError("cada ponto do traço é um par [longitude, latitude]")
    raio = raio_km / coordenadas.carregar_coordenadas()["projecao"]["km_por_grau"]
    base = Point(linha[0]) if len(linha) == 1 else LineString(linha)
    return base.buffer(raio, quad_segs=8).simplify(raio * 0.15), raio


def _id_novo(dados: dict) -> str:
    maior = 0
    for f in dados["features"]:
        pedaco = f["properties"]["id"]
        if pedaco.startswith("area-") and pedaco[5:].isdigit():
            maior = max(maior, int(pedaco[5:]))
    return f"area-{maior + 1:04d}"


def pincelar(camada: str, valor: str | None, linha, raio_km: float, modo: str) -> dict:
    """Devolve `{"id": área resultante ou None, "mudou": bool}`."""
    if modo not in ("pintar", "apagar"):
        raise ValueError("'modo' tem que ser 'pintar' ou 'apagar'")
    if camada not in VALORES_POR_CAMADA:
        raise ValueError(f"'camada' tem que ser um de {sorted(VALORES_POR_CAMADA)}, recebi {camada!r}")
    if modo == "pintar" and valor not in VALORES_POR_CAMADA[camada]:
        raise ValueError(f"'valor' {valor!r} não pertence à camada {camada!r}")
    traco, raio = _forma_do_traco(linha, raio_km)
    travas.exigir_camada_livre(camada, "pintar com o pincel" if modo == "pintar" else "apagar com o pincel")
    dados = carregar()

    if modo == "apagar":
        mudancas = {}
        for f in dados["features"]:
            p = f["properties"]
            if p["camada"] != camada or p.get("travado"):
                continue
            forma = shape(f["geometry"])
            if not forma.intersects(traco):
                continue
            resto = _so_poligono(forma.difference(traco))
            depois = None
            if not resto.is_empty and resto.area > 0:
                depois = json.loads(json.dumps(f))
                depois["geometry"] = mapping(resto)
            mudancas[p["id"]] = {"antes": f, "depois": depois}
        if not mudancas:
            return {"id": None, "mudou": False}
        operacoes.registrar_operacao("pincel_apagar", CAMINHO_RELATIVO, mudancas)
        return {"id": None, "mudou": True}

    # Pintar: as do mesmo valor, livres, que o traço toca, são fundidas nele.
    irmas = sorted((f for f in dados["features"]
                    if f["properties"]["camada"] == camada and f["properties"]["valor"] == valor
                    and not f["properties"].get("travado") and shape(f["geometry"]).intersects(traco)),
                   key=lambda f: f["properties"]["id"])
    ids_irmas = {f["properties"]["id"] for f in irmas}
    outras = {**dados, "features": [f for f in dados["features"] if f["properties"]["id"] not in ids_irmas]}
    traco, mudancas = _recortar_vizinhas(outras, camada, traco, ignorar=None)
    traco = _so_poligono(traco)
    if traco.is_empty or traco.area <= 0:
        return {"id": None, "mudou": False}   # o traço inteiro caiu em área travada
    if irmas:
        alvo = irmas[0]
        uniao = _so_poligono(unary_union([shape(f["geometry"]) for f in irmas] + [traco]))
        depois = json.loads(json.dumps(alvo))
        depois["geometry"] = mapping(uniao)
        mudancas[alvo["properties"]["id"]] = {"antes": alvo, "depois": depois}
        for f in irmas[1:]:
            mudancas[f["properties"]["id"]] = {"antes": f, "depois": None}
        id_final = alvo["properties"]["id"]
    else:
        id_final = _id_novo(dados)
        mudancas[id_final] = {"antes": None, "depois": {
            "type": "Feature", "geometry": mapping(traco),
            "properties": {"id": id_final, "camada": camada, "valor": valor,
                           "semente_ruido": random.randint(1, 99999), "travado": False}}}
    operacoes.registrar_operacao("pincel_pintar", CAMINHO_RELATIVO, mudancas)
    return {"id": id_final, "mudou": True}
