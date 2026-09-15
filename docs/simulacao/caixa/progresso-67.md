# Progresso · rodada 67 · o Halfling é Pequeno, e o Fôlego não tem base por raça

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `45bdc96`. Dois itens: o porte do Halfling (`M-29`) e a frase mentirosa da nota do
Fôlego (`M-26`). O `grid.astro:10216` NÃO se toca, por instrução; se aparecer um terceiro lugar
que decida porte de PC, eu relato e não conserto.

- **13:16** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **13:22** · ITEM 1 escrito. `porte` explicito nas OITO racas (Halfling `pequeno`, as outras
  sete `medio`), o esquema do `validate-data` ganhou `porte: z.enum([...os sete])` e o
  `deslocamentoFrac` opcional que faltava desde a `M-30`, e os dois chamadores vivos passam o
  porte ao `pv()`.
- **13:22** · o ponto 4 (o que morre calado) foi resolvido com uma funcao e nao com outra copia:
  `pvPorte(porte)` em `calc.ts` devolve a LINHA da tabela, e quem calcula e quem EXPLICA leem a
  mesma. A explicacao da ficha passou de `25 + Vigor ${vig}x3` para
  `${linhaPV.base} + Vigor ${vig}x${linhaPV.vigorMult}`, entao nao ha mais numero escrito a mao
  dentro da frase.
- **13:22** · ENSAIO DOS TRES SENTIDOS do portao novo (`scripts/test-porte-raca.mjs`, no
  `validate`): (1) VERMELHO sem o conserto, com as 20 assercoes certas, e tive de deixar o teste
  TOLERAR o `pvPorte` ausente, senao ele estourava na primeira linha e o vermelho ficava cego
  para o resto; (2) VERDE com o conserto; (3) VERMELHO com regressao plantada, devolvendo SO a
  explicacao a mao e deixando todo o resto certo, e cairam exatamente as duas assercoes dela.
  Mais um controle negativo que passa nos dois estados: porte escrito errado (`Pequeno` com
  maiuscula) cai em Medio calado, que e por que o esquema do portao existe.
- **13:22** · ITEM 2 (`M-26`) feito, e eram DOIS lugares: a frase `Base por raca (humano = 10)`
  saiu da nota do `regras.json`, e o capitulo `folego.md:12` repetia a mesma promessa na FORMULA
  que o jogador le (`10 (base racial)`), mais um `Um humano comum parte de 10` logo abaixo. Os
  dois sairam, e o portao novo guarda os dois.
- **13:24** · e os TERCEIRO e QUARTO lugares que decidem porte de PC, que eu NAO consertei, como
  ele mandou. Alem do `grid.astro:10211` que ele nomeou (o rotulo que vira o mais/menos 3 de
  acerto), ha `grid.astro:3412`, o `diametroM(c)`, que da 1 metro a todo PC e alimenta a medida
  de alcance de BORDA A BORDA (`L67`): um Halfling de meio metro mudaria geometria de alcance, e
  isso e outra consequencia, nao a mesma. E ha `artes-grid-mesa.ts:1367`, o `pesoDoPorte`, que
  devolve 0 para PC (o bloco nao declara quilos e o porte nao chega). Os tres leem
  `MON[c.monstro_id]?.porte`, ou seja, so criatura tem porte no tabuleiro.
- **13:27** · fim. Publicado em `b753e68`, `git rev-list --count origin/main..HEAD` = 0.
  `validate` e `build` verdes, mais quatro portoes de dado que enxergam o que toquei
  (`test-kael`, `test-contrato`, `test-cobertura-lib`, `test-deslocamento`): exit 0 nos quatro.
  Zero coautoria, zero travessao nas linhas que eu escrevi (conferido lendo os ARQUIVOS, e
  achei um no cabecalho do meu proprio teste, corrigido antes do commit).
