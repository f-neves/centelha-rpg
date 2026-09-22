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

O mecanismo (subtrair o pintado, montar os retângulos, marcar como automático) mora em
`backend/automatico.py`, compartilhado com o relevo automático. Aqui fica só o que é
próprio da cobertura: a tabela de faixas e o porquê de cada uma.
"""

from . import automatico

CAMADA = "cobertura"

COMENTARIO = (
    "Cobertura automática por latitude, CALCULADA a cada pedido e nunca gravada. "
    "Ver backend/cobertura_automatica.py."
)

# Faixas do norte para o sul, em latitude. Só os CORTES internos moram aqui: as bordas
# de cima e de baixo vêm de `dados/coordenadas.json`, dentro de
# `automatico.faixas_entre`. Os cortes saem do guia de clima do CARTOGRAFO:
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
    return automatico.faixas_entre(CORTES, VALORES)


def colecao() -> dict:
    """FeatureCollection das faixas, já descontadas do que o usuário pintou."""
    return automatico.colecao_de_faixas(CAMADA, faixas(), COMENTARIO)
