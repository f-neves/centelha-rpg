# Progresso · rodada 70 · a raça vira o passo 3 da criação

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `b732d79`. Um arquivo (`criacao-de-personagem.md`) mais o portão. Três itens: o passo
novo, a linha `Raça | Humano | 0` nos quatro exemplos, e o portão que soma a coluna de XP contra
o Total declarado.

A `M-22` (teto 5/6 contra o 7 da raça) NÃO se harmoniza: se o texto do passo 3 me obrigar a
encostar nela, escrevo a frase mais neutra que der e digo qual foi. O `xan` (Antecedentes) fica no
radar, sem medição.

- **13:51** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **13:53** · ITENS 1 e 2 feitos: a Raca virou o passo 3 com a frase que diz POR QUE a posicao
  importa (ela move os tetos, e escolher depois seria escolher com a regua do passo seguinte ja
  usada), os passos 3 a 9 viraram 4 a 10, e a linha `Raca | Humano | 0` entrou nos quatro
  exemplos. Nenhum total mudou, que era o ponto.
- **13:53** · a `M-22` NAO foi harmonizada, e a frase que escolhi para nao encostar nela e:
  `um +1 de teto deixa aquele Atributo chegar mais alto do que chegaria, e um -1 o trava mais
  baixo`. Sem 5, sem 6 e sem 7. E o passo dos Atributos ganhou so `respeitados os tetos que a sua
  raca moveu`, que aponta para a tensao sem resolve-la.
- **13:54** · varri `passo N` em `src/`, `scripts/` e `docs/` e a resposta confirma a dele para
  `src/`: so o `grid.astro:10833`, outro assunto. MAS em `docs/simulacao/caixa/` ha seis
  citacoes por numero ao passo a passo deste capitulo (`jogador-novo-fase1.md:136, 138, 142,
  145, 174, 177`), e todas envelheceram em um. Nao mexi: aquele documento e o RELATO do jogador
  novo, e renumerar dentro dele falsificaria o que o leitor viu.
- **13:54** · PORTAO novo, `scripts/test-exemplos-criacao.mjs`, no `validate`. Ele soma a coluna
  de XP dos quatro e compara com o Total, confere que a linha de Raca existe e que o custo dela
  bate com o `racas.json`, e que a Raca e passo numerado ANTES dos Atributos, sem buraco na
  sequencia. O cabecalho dele diz em tres linhas o que ele NAO cobre, e o `A-03` e a primeira.
- **13:55** · e o ensaio dos tres sentidos PEGOU UM DEFEITO NO MEU PROPRIO PORTAO, que e para o
  que ele serve. (1) VERMELHO sem a mudanca: sete falhas, as quatro linhas de Raca ausentes, o
  passo faltando, a ordem e a sequencia numerica. (3) plantei o Kael virando Anao e pagando 0,
  e o portao passou VERDE. A causa: meu parser descartava a coluna do MEIO, entao a conferencia
  da raca procurava a primeira linha `| Raca |` do ARQUIVO em vez da deste exemplo. Consertado
  (o detalhe passou a ser guardado), e com a regressao replantada ele fica vermelho com a frase
  certa: `a tabela diz Anao custando 0, e o racas.json diz 30`. Sem o terceiro sentido eu teria
  entregue um teste que parece cobrir e nao cobre, que e exatamente o que ele avisou.
- **13:55** · para o radar, sem medicao, como ele pediu: nenhum dos quatro exemplos tem linha de
  ANTECEDENTES, e o `xan` entra no mesmo total da ficha. Mesmo molde do defeito desta rodada, e
  o portao novo NAO o pega, porque somar a coluna nao sente falta de uma linha que nunca existiu
  (ao contrario da Raca, que agora e cobrada por asserção propria).
