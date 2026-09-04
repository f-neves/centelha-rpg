# Resumo do ciclo · até a rodada 04

## MOTIVO DA PARADA

a resposta da revisora não dá para ler:
    a seção VEREDITO não traz SEGUE, CORRIGE-E-SEGUE nem PARA

## O QUE FOI RESOLVIDO

  ✓ executora · US$ 1.24
  ✓ custo · esta execução US$ 1.24 · o assunto US$ 1.24 de US$ 25.00
  ✓ revisora alinhada em b0926b5, e o papel sobreviveu
  ✓ revisora · US$ 0.08 · rodada US$ 1.32
  ✓ custo · esta execução US$ 1.32 · o assunto US$ 1.32 de US$ 25.00
  ✓ resposta commitada · docs/simulacao/caixa/04-revisora.md

## O QUE FICOU ABERTO

ver a última resposta da revisora na caixa, seções BLOQUEIA e PERGUNTA

## CUSTO

Esta execução: **US$ 1.32**.
Por rodada: 1ª US$ 1.32

**O ASSUNTO, que é contra o que o teto vale:** US$ 1.32 de um teto
de US$ 25.00.
Assunto: "a assimetria dos lados: qual das duas ela e", zerado em 2026-09-04 porque: assunto novo, declarado pelo humano ao dar o alvo da rodada 04. O gasto anterior (rodada 02, US$ 12,89, mais a rodada 03, que morreu sem dizer o custo) era do assunto anterior, a tabela do G, e nao e carregado: um numero incompleto carregado e pior que um zero declarado na fronteira do assunto.


## O ALVO PEDIDO, E SE ELE SAIU

Pedido: ALVO UNICO: descobrir qual das duas assimetrias e a do 1,178. Nada mais entra nesta rodada, nem os itens de CORRIGE que ficaram esperando. Se o item se resolver antes do fim, PARE e devolva o orcamento em vez de virar instrumento.

O ACHADO: nas celulas unissono, em que os dois lados sao o MESMO arquetipo (escudeiro contra escudeiro), com passo identico (passoMult vale 1 em TODAS as 96 celulas, conferido no codigo e no manifesto .sim/r03/bateria.json), o lado b declara 1,178 vez o que o lado a declara. Com pecas identicas a assimetria continua. A explicacao publicada na 09 §2.4 (passo dobrado) esta REFUTADA, e nao foi corrigida.

SAO DUAS POSSIBILIDADES, muito diferentes:
(1) assimetria do HARNESS: alguma coisa no laco trata os dois lados de forma diferente (ordem de iteracao, quem entra primeiro na fila, quem e alvo de quem, desempate, ordem de montagem da cena). Se for isso, e DEFEITO, e contamina toda metrica que dependa de lado.
(2) assimetria da REGUA: o simultaneo da vantagem estrutural a quem ocupa uma posicao. Se for isso, e achado de JOGO.

O QUE FAZER:
- o caminho mais barato pode ser o ESPELHO (npm run espelho), que compara mesa e laco Tick a Tick: se a assimetria existir TAMBEM na mesa, ela e da regua; se so no laco, e do harness. Tente isto primeiro, e diga se serviu;
- o outro caminho e trocar os lados na montagem da cena, com a MESMA semente, e ver se a assimetria acompanha o LADO ou o ARQUETIPO. Se acompanhar o lado, e o laco. Se acompanhar o arquetipo, no unissono ela nao deveria existir, e ai e a montagem;
- se der HARNESS: conserte, e diga o que muda em cada numero ja publicado;
- se der REGUA: PARE. NAO decida nada. Escreva no aviso, em O QUE FICOU EM ABERTO, marcado como PRECISA DO HUMANO, e nao mexa na regra.

E CONFIRA, porque a frase refutada circulou inteira e esta em quatro lugares que eu ja levantei e NAO corrigi: docs/simulacao/09-bateria-grande.md linhas 454 e 455; Pendencias.md linha 1344; scripts/sim/agregar.mjs linha 496 (comentario). Alem disso, scripts/sim/bateria.mjs linhas 108 a 110 descreve o eixo E4 como se ele rodasse, e ele saiu da grade em 03/09. E a propria 09 se contradiz: a D31 (por volta da linha 925) diz que o eixo e inerte e foi cortado, no mesmo documento em que a §2.4 diz que o lado b anda com passo dobrado. Corrija os quatro lugares SO depois de saber qual e a causa verdadeira, e escreva a causa certa no lugar da errada.

Julgue o ciclo contra isto, e não contra o que ele fez.

## O QUE PRECISA DO HUMANO

Nada foi escalado. Se o ciclo parou por teto, a decisão é só continuar ou não.

## O DIÁRIO

```

· ALVO (do humano): ALVO UNICO: descobrir qual das duas assimetrias e a do 1,178. Nada mais entra nesta rodada, nem os itens de CORRIGE que ficaram esperando. Se o item se resolver antes do fim, PARE e devolva o orcamento em vez de virar instrumento.

O ACHADO: nas celulas unissono, em que os dois lados sao o MESMO arquetipo (escudeiro contra escudeiro), com passo identico (passoMult vale 1 em TODAS as 96 celulas, conferido no codigo e no manifesto .sim/r03/bateria.json), o lado b declara 1,178 vez o que o lado a declara. Com pecas identicas a assimetria continua. A explicacao publicada na 09 §2.4 (passo dobrado) esta REFUTADA, e nao foi corrigida.

SAO DUAS POSSIBILIDADES, muito diferentes:
(1) assimetria do HARNESS: alguma coisa no laco trata os dois lados de forma diferente (ordem de iteracao, quem entra primeiro na fila, quem e alvo de quem, desempate, ordem de montagem da cena). Se for isso, e DEFEITO, e contamina toda metrica que dependa de lado.
(2) assimetria da REGUA: o simultaneo da vantagem estrutural a quem ocupa uma posicao. Se for isso, e achado de JOGO.

O QUE FAZER:
- o caminho mais barato pode ser o ESPELHO (npm run espelho), que compara mesa e laco Tick a Tick: se a assimetria existir TAMBEM na mesa, ela e da regua; se so no laco, e do harness. Tente isto primeiro, e diga se serviu;
- o outro caminho e trocar os lados na montagem da cena, com a MESMA semente, e ver se a assimetria acompanha o LADO ou o ARQUETIPO. Se acompanhar o lado, e o laco. Se acompanhar o arquetipo, no unissono ela nao deveria existir, e ai e a montagem;
- se der HARNESS: conserte, e diga o que muda em cada numero ja publicado;
- se der REGUA: PARE. NAO decida nada. Escreva no aviso, em O QUE FICOU EM ABERTO, marcado como PRECISA DO HUMANO, e nao mexa na regra.

E CONFIRA, porque a frase refutada circulou inteira e esta em quatro lugares que eu ja levantei e NAO corrigi: docs/simulacao/09-bateria-grande.md linhas 454 e 455; Pendencias.md linha 1344; scripts/sim/agregar.mjs linha 496 (comentario). Alem disso, scripts/sim/bateria.mjs linhas 108 a 110 descreve o eixo E4 como se ele rodasse, e ele saiu da grade em 03/09. E a propria 09 se contradiz: a D31 (por volta da linha 925) diz que o eixo e inerte e foi cortado, no mesmo documento em que a §2.4 diz que o lado b anda com passo dobrado. Corrija os quatro lugares SO depois de saber qual e a causa verdadeira, e escreva a causa certa no lugar da errada.

· gasto do assunto até aqui: US$ 0.00 em 0 execução(ões), assunto "a assimetria dos lados: qual das duas ela e"

══ rodada 04 ══
  ✓ executora · US$ 1.24
  ✓ custo · esta execução US$ 1.24 · o assunto US$ 1.24 de US$ 25.00
  trava · o aviso existe? ✓
  trava · árvore da executora limpa? ✓
  → commit do aviso: b0926b5 (é o topo)
  trava · o papel da revisora existe em .claude/CLAUDE.local.md? ✓
  trava · árvore da revisora limpa? ✓
  ✓ revisora alinhada em b0926b5, e o papel sobreviveu
  ✓ revisora · US$ 0.08 · rodada US$ 1.32
  ✓ custo · esta execução US$ 1.32 · o assunto US$ 1.32 de US$ 25.00
  ✓ resposta commitada · docs/simulacao/caixa/04-revisora.md
  trava · a resposta é legível (cinco seções, "nada" escrito onde vazio)? ■

■ PARA · a resposta da revisora não dá para ler:
    a seção VEREDITO não traz SEGUE, CORRIGE-E-SEGUE nem PARA
```
