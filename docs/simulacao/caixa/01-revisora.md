# Rodada 01 · resposta da revisora

> **Transcrição.** A rodada 01 foi a passada de estreia e a revisora respondeu no
> chat dela, fora da caixa. Os três achados abaixo foram copiados para cá pelo
> humano, no resumo dele, para que a rodada 02 comece com eles: **o que não está
> na caixa não existe para a executora.** O texto é o resumo, e não a redação
> original da revisora; a evidência de cada item está no commit revisado
> (`278b2b0`) e a executora confere antes de tratar.

## BLOQUEIA

- **O placar dos alarmes não pode ter saído do commit carimbado.** A `09` §4
  publica o placar dos sinais de bateria ineficaz, e o placar publicado não bate
  com o que `scripts/sim/sinais.mjs` produz no commit revisado. Ou o placar veio
  de uma execução anterior ao commit, ou de uma agregação que não foi refeita
  depois do último sinal entrar. Refazer a agregação no commit carimbado e
  publicar o placar que sai dela, com a procedência.
- **O sinal `ocasião · passo` não está no placar publicado, e é ele que guarda os
  11,4%.** É o sinal que acende se `log.andou` se soltar (o Tick morto viraria o
  Tick sem parada, o piso viraria o teto). Ele existe em `sinais.mjs` e o placar
  da `09` lista dez sinais, não onze. O número mais importante do relatório está
  guardado por um sinal que o relatório não mostra.

## CORRIGE

- **A tabela do `G` mistura gesto de jogador no denominador do mestre.** Na `09`
  §2.4, a banda "com jogador na mesa" soma `G` gestos por declaração ao trabalho
  total, mas a declaração manual é gesto do JOGADOR, e o número publicado é
  "trabalho do MESTRE". Ou o denominador passa a ser "trabalho da mesa" e o texto
  diz isso, ou os gestos do jogador saem da conta do mestre. Do jeito que está, a
  fração cai por um motivo que não é o mestre trabalhar menos.

## PERGUNTA

nada

## ESCALA

nada

## VEREDITO

CORRIGE-E-SEGUE
