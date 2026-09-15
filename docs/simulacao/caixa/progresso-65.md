# Progresso · rodada 65 · a palavra "turno" sai do livro

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `812edbd`. Dois itens: a `M-04b` (tudo vira Tick, a 6 Ticks por turno) e a `M-04`
(o Sangramento no relógio de cada um, contado da ferida). O segundo é o arriscado, porque mexe em
estado de mesa e em dano aplicado: se ele crescer, fecho o primeiro e trago o segundo como plano.

- **05:13** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **05:15** · armadilha 1 RESPONDIDA, e a resposta e NAO: `unidade` e `escala` do `efeitos.json`
  moram em `parametros`, que e campo de TOPO, e o `gen-grid-artes.mjs` escreve `{...e, grid: ...}`,
  ou seja ele espalha o registro e so sobrescreve o bloco `grid`. Conferi as chaves do `grid`
  (`alvo, ancora, arenaInteira, condicao, condicaoAparente, cura, dissipa, fere, forma, gatilho,
  materia, pegaItem, persiste, teste`): nenhuma e `unidade` nem `escala`. Editar `parametros`
  direto e seguro, e vou provar rodando o `--check` depois.
- **05:15** · e um achado antes de escrever: existem DOIS `porRodada` diferentes. O da decisao e
  o campo de condicao (`condicoes.json`, 5 condicoes). O outro e uma BANDEIRA do simulador de
  batalha (`bandeiras.ts:14`, `regras.json:2561`, `scripts/fixtures/lances.meta.json:16` e a
  lista `publicadas` do `test-bandeiras.mjs:53`). Nome publicado em relatorio de bateria, com
  fixture gravada. Nao encosto nele nesta rodada, e vai escrito.
- **05:15** · e o campo de condicao tem CINCO leitores, nao tres: alem de `mesa-core.ts`,
  `mesa-condicoes.ts` e `combate.astro`, tambem `referencia.astro:77` e `validate-data.mjs:299`.
- **05:24** · ITEM 1 (`M-04b`) feito. 51 trocas por TABELA explicita, uma por caso e com assercao
  em cada uma, nunca sed cego: `condicoes.json` 7, `regras.json` 14 (as duas escadas, o
  `notaTurno` virando ponte e os exemplos do Arcano), `artes.json` 3, `tecnicas.json` 14,
  `habilidades.json` 2, `racas.json` 1, e 9 nos capitulos e na pagina das Artes. Mais 22 no
  `efeitos.json` e 15 no rename do `porRodada`.
- **05:24** · a armadilha 3 estava mesmo no caminho, e duas vezes: o `metal-incandescente` tem
  escala `[1 tick, 1 turno, ... 6 turnos]` e o `paralisia` tem `[-, -, 1 turno, ...]`. O `1 tick`
  do primeiro FICOU 1 tick; o resto virou 6/12/18/24/30/36. Multiplicar por seis o que ja estava
  em Ticks era o erro que ele mandou nao cometer, e as duas escadas foram escritas a mao,
  inteiras, em vez de passarem por regex.
- **05:24** · e a prova de que o `--check` era o teste certo: rodei `gen-grid-artes.mjs --check`
  DEPOIS de reescrever o `efeitos.json` inteiro pelo Python e ele deu `blocos grid em dia`. A
  reserializacao preservou o bloco gerado byte a byte.
- **05:24** · o `porRodada` virou `porSeisTicks`, e NAO `ciclo`, pelo motivo que ele deu. Mas ha
  uma consequencia que o despacho nao menciona e que eu nao podia deixar passar: o campo VAI
  PERSISTIDO. A condicao de catalogo e gravada como `{id}`, mas a CASEIRA e gravada inteira em
  `combatentes.condicoes`, no Supabase (`mesa-condicoes.ts`). Renomear seco faria toda condicao
  caseira ja salva parar de cobrar dano, em silencio, e nao ha migracao que alcance JSON dentro
  de uma coluna. Entao a LEITURA aceita os dois nomes (`c.porSeisTicks ?? c.porRodada ?? 0`) e a
  escrita usa so o novo.
- **05:24** · oito citacoes envelheceram (o `mesa-core.ts` e o `combate.astro` estao na lista dos
  doze) e o `validate` pegou as oito. Re-apontadas pela ancora: `mesa-core.ts` 186->198, 192->204,
  457->471; `combate.astro` 1764->1768, 1810->1814, 2128->2132. `validate` e `build` verdes.
- **05:28** · ITEM 2 medido e trazido como PLANO, sem executar, que era a instrucao se ele
  crescesse. Cresceu: mexe em dano aplicado e em estado gravado de mesa viva. Escrito em
  `docs/simulacao/caixa/m04-sangramento-plano.md`.
- **05:28** · e a medicao desarmou a parte que eu achava mais dificil: NAO ha relogio novo a
  inventar. As duas telas ja concordam sobre o agora (`tick_atual` no Simultaneo, o Tick de quem
  esta na vez no resto), e ja existe uma varredura por Tick sobre `c.condicoes`
  (`varrerCondicoesVencidas`, `artes-grid-mesa.ts:2047`), com campo so-de-instancia (`ate`),
  escrita por `gravarCondicao` e guarda de mestre. O Sangramento pede o campo gemeo (`desde`) e
  uma varredura irma. E os dois contadores desalinhados que a mesa aceitou saem DE GRACA: o
  array de condicoes nao deduplica.
- **05:28** · quatro riscos levantados, nenhum hipotetico: o relogio PULA (`avancarTick` anda
  `quanto` Ticks de uma vez, entao a conta e por INTERVALO e nao por instante); o que ja esta
  salvo nao tem `desde` e nenhuma migracao alcanca JSON em coluna; so o mestre escreve, pela RLS;
  e duas abas abertas podem cobrar duas vezes. Esse ultimo tem uma decisao de desenho que e dele,
  e eu recomendo com o preco escrito.
- **05:29** · fim. Item 1 publicado em `b6a71b7`, o plano do item 2 em `3abb159`, os dois com
  `git rev-list --count origin/main..HEAD` = 0. `validate` e `build` verdes, mais seis portoes de
  navegador que enxergam o que eu toquei (`test-artes-grid`, `test-arte-na-mesa`, `test-l86a-cura`,
  `test-bandeiras-mesa`, `test-grid-simultaneo`, `test-golpe-caido`): exit 0 nos seis. Zero
  coautoria. A arvore tem so arquivos do Arquiteto, e eu nao encostei em nenhum.
