"""Relevo automático `planicie` (etapa de 2026-09-23, décima rodada).

A outra metade da decisão que a cobertura automática já cumpria: terra que o usuário
não pintou tem relevo `planicie`. Aqui não há tabela de latitude nenhuma, porque a
decisão registrada em `CARTOGRAFO.md` ("Técnica") diz um valor só para o mundo
inteiro: **uma faixa, do topo à base da tela**.

Vale o mesmo de sempre: calculado a cada pedido, descontado do que está pintado de
RELEVO (e só de relevo, porque as camadas são independentes), e nunca gravado.

**Por que na tela ele não aparece junto com a cobertura automática**: `planicie` é um
valor único sobre toda a terra sem pintura, então desenhá-lo por cima das faixas de
cobertura só apagaria as faixas atrás de uma cor chapada, sem dizer nada que a
ausência de pintura já não diga. A ferramenta traz um interruptor ("relevo
automático", desligado por padrão) em vez de empilhar os dois: ligado, ele mostra
exatamente onde ainda não há relevo pintado. Decisão de IA, registrada no
`ESPEC-ferramenta.md` para o usuário poder derrubar.
"""

from . import automatico

CAMADA = "relevo"
VALOR = "planicie"

COMENTARIO = (
    "Relevo automático (planície), CALCULADO a cada pedido e nunca gravado. "
    "Ver backend/relevo_automatico.py."
)


def faixas() -> list[dict]:
    """Uma faixa só, cobrindo a tela inteira."""
    return automatico.faixas_entre((), (VALOR,))


def colecao() -> dict:
    return automatico.colecao_de_faixas(CAMADA, faixas(), COMENTARIO)
