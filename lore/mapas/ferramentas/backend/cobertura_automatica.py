"""Cobertura automática por latitude (etapa de 2026-09-23, nona rodada).

Decisão antiga, registrada em `CARTOGRAFO.md` ("Técnica"): terra que o usuário não
pintou recebe cobertura automática por latitude, seguindo o guia de clima; pintar por
cima sobrescreve, apagar devolve o automático. E a parte que decide a arquitetura
deste arquivo: **o automático NUNCA é gravado como feature**. Ele é calculado a cada
pedido e devolvido pronto para desenhar; nada aqui escreve em disco, e é por isso que
não existe nenhuma chamada a `operacoes.registrar_operacao` neste módulo.

Duas coisas que o código precisou e o pedido não fixava:

1. **As faixas já saem descontadas das áreas pintadas de cobertura.** A alternativa
   era empilhar o pintado por cima do automático e confiar na ordem de desenho, mas as
   áreas são desenhadas com `fillOpacity` 0,35: por cima de uma faixa, a cor do
   automático continuaria aparecendo por baixo, e "pintar sobrescreve" seria mentira na
   tela, mesmo com o empilhamento certo. Descontar (shapely `difference`, a mesma
   chamada do recorte) faz o sobrescrever ser literal.
2. **O automático só usa valor que serve para uma faixa inteira.** O guia de clima não
   é puramente latitudinal: deserto e selva, nele, são exceções de REGIÃO ("interior e
   lado oeste do sul de Mére", "florestas equatoriais"), e a faixa de 15°N a 25°N que
   receberia deserto contém Syl, "a parte mais verdejante do mapa". Pintar a faixa
   inteira de deserto erraria mais do que acertaria. Decisão do usuário na décima
   rodada: **deserto e selva saem do automático e passam a ser pintados à mão**; a
   faixa quente fica `campo` e a equatorial `floresta-tropical`. O que sobra na tabela
   é o que vale para a latitude toda.

O recorte pela costa não acontece aqui: as faixas vão para a tela como retângulos
inteiros, e quem esconde a parte que cai na água é a camada do mar (`render/tiles/mar`)
por cima delas, exatamente como já acontece com a área pintada.
"""

from shapely.geometry import box, mapping, shape
from shapely.ops import unary_union

from . import areas, coordenadas

CAMADA = "cobertura"

# Faixas do norte para o sul, em latitude. Os limites de cima e de baixo NÃO são
# números escritos aqui: vêm de `dados/coordenadas.json` (`limites_da_tela`), senão a
# tabela envelheceria calada se a tela mudasse. Os cortes internos saem do guia de
# clima do CARTOGRAFO ("Clima e bioma"):
#
#   gelo no extremo norte (The White Wall)               -> geleira
#   frio habitável, tundra e coníferas esparsas (Neck)   -> tundra
#   norte temperado frio                                 -> floresta-boreal
#   temperado (Calin)                                    -> floresta-temperada
#   quente, e nem árido nem fechado por padrão           -> campo
#   trópico e equador                                    -> floresta-tropical
#
# **Correção do usuário, 2026-09-23 (décima rodada), e o motivo importa**: a tabela
# anterior punha `deserto` de 15°N a 25°N e `selva` do equador até 5°N, copiando o
# guia ao pé da letra. Só que nessa mesma faixa de 15°N a 25°N está SYL, que o guia
# descreve como "a parte mais verdejante do mapa": o automático a pintaria de deserto
# inteira. **Deserto e selva são exceções REGIONAIS, não regra de latitude**, e
# passam a ser pintados à mão nos lugares que o guia indica. O padrão da faixa quente
# virou `campo` (aberto, sem afirmar aridez) e o da faixa equatorial virou
# `floresta-tropical` (que, com isso, encosta na faixa de baixo e as duas viraram uma
# só, de 15°N até a base da tela).
CORTES = (55.0, 45.0, 35.0, 25.0, 15.0)
VALORES = (
    "geleira",
    "tundra",
    "floresta-boreal",
    "floresta-temperada",
    "campo",
    "floresta-tropical",
)


def faixas() -> list[dict]:
    """As faixas cruas: valor, latitude de baixo e de cima. Sem geometria."""
    limites = coordenadas.carregar_coordenadas()["limites_da_tela"]
    bordas = [limites["latitude_topo"], *CORTES, limites["latitude_base"]]
    return [
        {"valor": valor, "lat_max": bordas[i], "lat_min": bordas[i + 1]}
        for i, valor in enumerate(VALORES)
    ]


def _sobrescrito() -> object | None:
    """União do que já está pintado na camada de cobertura, ou None se não há nada."""
    formas = [
        shape(f["geometry"])
        for f in areas.carregar()["features"]
        if f["properties"]["camada"] == CAMADA
    ]
    return unary_union(formas) if formas else None


def colecao() -> dict:
    """FeatureCollection das faixas, já descontadas do que o usuário pintou.

    Nada disto é gravado: o chamador desenha e esquece. Uma faixa que suma inteira
    debaixo da pintura simplesmente não entra na coleção.
    """
    limites = coordenadas.carregar_coordenadas()["limites_da_tela"]
    oeste, leste = limites["longitude_esquerda"], limites["longitude_direita"]
    pintado = _sobrescrito()

    features = []
    for faixa in faixas():
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
                # Marca explícita para a tela e para quem for depurar: esta feature
                # não existe em arquivo nenhum e não tem id.
                "automatico": True,
            },
        })
    return {
        "type": "FeatureCollection",
        "properties": {
            "_comentario": (
                "Cobertura automática por latitude, CALCULADA a cada pedido e nunca "
                "gravada. Ver backend/cobertura_automatica.py."
            ),
        },
        "features": features,
    }
