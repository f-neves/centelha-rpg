# Progresso · rodada 69 · o Gnomo custa 30 por enquanto, e "miúdo" sai das raças

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `31e6463`. Dois itens: o custo do Gnomo (40 para 30, **provisório** e escrito como
provisório) e as duas linhas de `racas.md` onde "miúdo" colide com o rótulo de `minusculo`.
Ele preferiu o PORTÃO à correção da linha nos dois casos, e concordo: cinco dos oito custos estão
em dois lugares e nada os prende juntos hoje.

O custo e a idade das raças NÃO se recalculam (`M-46`); o 30 de hoje entra nessa conta como
qualquer outro. Se eu achar algo que mexa em valor ou idade, anoto.

- **13:41** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **13:43** · ITEM 1 feito, e o custo estava em TRES lugares e nao dois: `racas.json`, a SECAO
  do Gnomo no capitulo, e a TABELA resumo do mesmo capitulo (`racas.md:34`), que o despacho nao
  cita. Os tres dizem 30. O `por enquanto` foi para dois lugares onde alguem le: um `<small>` na
  propria linha do custo do Gnomo e uma frase no callout `Provisorio` que ja abria o capitulo,
  dizendo que os custos E as idades das oito serao refeitos de uma vez (`M-46`).
- **13:43** · ITEM 2 feito: as duas linhas de `miudo` sairam, e so elas. A pior era mesmo a do
  Halfling (`porte miudo`), que colava o termo mecanico no rotulo errado. Zero ocorrencias de
  `miud*` sobraram no `racas.md`, e nao toquei nas outras 92 do `src/`.
- **13:44** · PORTAO, e ele guarda as duas coisas que nada prendia. (a) o custo do capitulo bate
  com o do dado nos DOIS lugares do capitulo, para as oito; (b) nenhuma secao de raca usa um
  rotulo de porte que nao seja o porte dela no dado. Entrou no `test-porte-raca.mjs`, que ja
  estava no `validate`.
- **13:44** · a lista de palavras do (b) e CURTA por MEDICAO e nao por preguica: sondei as sete
  com os sete rotulos antes de escrever, e `pequenos demais para grande forca bruta` (Gnomo)
  casava `grande`, que ali e adjetivo comum. Portao com falso positivo e portao que alguem
  desliga, entao ficaram so `miudo` e `minusculo`, que nao sao adjetivo comum descrevendo raca.
- **13:44** · e a tabela do capitulo que o portao le e a que tem `Custo XP` no cabecalho, de
  proposito: ha uma SEGUNDA tabela com coluna numerica logo depois do nome (a das IDADES,
  `racas.md:129`), e pegar a errada faria o portao comparar custo com idade de maturidade.
- **13:44** · ENSAIO DOS TRES SENTIDOS, com DOIS vermelhos diferentes porque sao duas asserções
  novas: (1) guardando `racas.json` e `racas.md`, cairam as duas linhas de `miudo`; (3) plantando
  DISCORDANCIA (o dado em 25 e o capitulo em 30), cairam as duas do custo, a da tabela e a da
  secao. O custo nao cai no sentido (1) de proposito: ele cobra DESACORDO, nao um valor.
- **13:45** · ITEM 3, para o radar da `M-46`, medido e NAO ajustado. A idade nao mora em um
  lugar, mora em TRES, e dois ja discordam hoje:
  (1) a tabela `racas.md:129`, com Adulto / Maturidade / Velho / Veneravel por raca;
  (2) a prosa de abertura de cada secao, que diz `maturidade aos N anos`;
  (3) o `descricao` do `racas.json`, que diz o tempo de vida (`400+ anos` no Gnomo).
  A palavra `maturidade` da PROSA corresponde a coluna `Adulto` da TABELA, e duas nao batem:
  Gnomo prosa 20 contra tabela 18, e Halfling prosa 18 contra tabela 16. As outras quatro batem
  (Anao 18, Elfo 20, Orc 14, Meio-Orc 14). Nao consertei nenhuma, como ele mandou: quando a
  `M-46` refizer as idades, sao tres copias a acertar e nao uma, e duas ja nascem divergentes.
- **13:45** · e nada mais que eu tenha achado mexe no VALOR de uma raca alem do 30 do Gnomo que
  ele proprio decidiu.
