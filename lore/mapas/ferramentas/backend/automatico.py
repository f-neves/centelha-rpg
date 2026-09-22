"""A máquina comum dos valores AUTOMÁTICOS (cobertura por latitude, relevo planície).

Decisão registrada em `CARTOGRAFO.md` ("Técnica"): terra que o usuário não pintou tem
cobertura automática por latitude **e** relevo automático `planicie`. As duas metades
funcionam igual, e a parte que decide a arquitetura é a mesma: **automático nunca é
gravado como feature**. Nada aqui escreve em disco, e é por isso que não existe uma só
chamada a `operacoes.registrar_operacao` neste módulo nem nos dois que o usam.

Cada faixa vira um retângulo que cobre a tela de lado a lado, do qual se subtrai a
união do que já está pintado NAQUELA camada (shapely `difference`, a mesma chamada do
recorte entre áreas). Subtrair, em vez de empilhar o pintado por cima, é o que faz
"pintar sobrescreve" ser literal: área pintada é desenhada com `fillOpacity` 0,35, e
por cima de uma faixa a cor do automático continuaria aparecendo por baixo.

O recorte pela costa não acontece aqui: as faixas vão para a tela inteiras, e quem
esconde a parte que cai na água é a camada do mar (`render/tiles/mar`) desenhada por
cima, exatamente como já acontece com a área pintada.
"""

from shapely.geometry import box, mapping, shape
from shapely.ops import unary_union

from . import areas, coordenadas


def limites() -> dict:
    return coordenadas.carregar_coordenadas()["limites_da_tela"]


def faixas_entre(cortes: tuple[float, ...], valores: tuple[str, ...]) -> list[dict]:
    """Faixas cruas (valor, lat_min, lat_max), do norte para o sul.

    As bordas de cima e de baixo NÃO são números escritos à mão: vêm de
    `dados/coordenadas.json`, senão a tabela envelheceria calada se a tela mudasse.
    """
    lim = limites()
    bordas = [lim["latitude_topo"], *cortes, lim["latitude_base"]]
    return [
        {"valor": valor, "lat_max": bordas[i], "lat_min": bordas[i + 1]}
        for i, valor in enumerate(valores)
    ]


def _pintado(camada: str):
    """União do que já está pintado NAQUELA camada, ou None se não há nada."""
    formas = [
        shape(f["geometry"])
        for f in areas.carregar()["features"]
        if f["properties"]["camada"] == camada
    ]
    return unary_union(formas) if formas else None


def colecao_de_faixas(camada: str, faixas: list[dict], comentario: str) -> dict:
    """FeatureCollection das faixas, já descontadas do que o usuário pintou.

    Nada disto é gravado: o chamador desenha e esquece. Uma faixa que suma inteira
    debaixo da pintura simplesmente não entra na coleção.
    """
    lim = limites()
    oeste, leste = lim["longitude_esquerda"], lim["longitude_direita"]
    pintado = _pintado(camada)

    features = []
    for faixa in faixas:
        forma = box(oeste, faixa["lat_min"], leste, faixa["lat_max"])
        if pintado is not None:
            forma = forma.difference(pintado)
        if forma.is_empty:
            continue
        features.append({
            "type": "Feature",
            "geometry": mapping(forma),
            "properties": {
                "valor": faixa["valor"],
                "camada": camada,
                # Marca explícita para a tela e para quem for depurar: esta feature
                # não existe em arquivo nenhum e não tem id.
                "automatico": True,
            },
        })
    return {
        "type": "FeatureCollection",
        "properties": {"_comentario": comentario},
        "features": features,
    }
