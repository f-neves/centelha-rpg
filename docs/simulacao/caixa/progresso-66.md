# Progresso · rodada 66 · o relógio do Sangramento, o "Rodada N" da tela, e quatro decisões

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `8ac9617`. Ordem de corte dada por ele: **1 (o Sangramento) primeiro**, porque mexe em
mesa viva; depois o **3** (tirar o "Rodada N" do Grid); depois o **2** (as quatro decisões, que são
texto e esperam bem).

- **05:33** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **05:36** · uma bifurcacao que o plano nao cobria, achada antes de escrever: a aba Combate NAO
  roda varredura nenhuma. Varri o `combate.astro` inteiro: zero `verificarEfeitos`, zero
  `varrerCondicoes`, zero import de `artes-grid-mesa`. Ou seja, hoje a condicao com prazo (`ate`)
  nao vence naquela tela, e o unico dano continuo dela e justamente o disparo ao agir que a
  `M-04` manda tirar. Se eu so tirasse, a aba Combate PERDIA o Sangramento inteiro.
  Entao a varredura nasce COMPARTILHADA, no `mesa-core.ts`, e as duas telas a chamam.
- **05:36** · e o `pago` simplifica mais do que eu tinha escrito no plano: com ele na instancia,
  a varredura NAO precisa do intervalo de quem chama (`verificarEfeitos` so passa o Tick
  corrente). A conta sai de `desde` e `pago` contra o agora, e a idempotencia deixa de depender
  da chamadora, que era exatamente a objecao dele.
- **05:46** · ITEM 1 escrito. `tiquesDevidos` e `danoContinuoDevido` puros no `mesa-core.ts`,
  os campos `desde`/`pago` so na instancia (como o `ate` ja era), o carimbo nos QUATRO pontos de
  aplicacao, a varredura irma no Grid (dentro do `verificarEfeitos`, DEPOIS do vencimento) e uma
  varredura nova na aba Combate, que nao tinha nenhuma. O disparo ao agir saiu.
- **05:46** · ENSAIO DOS TRES SENTIDOS do portao novo (`scripts/test-sangramento.mjs`, no
  `validate`): (1) VERMELHO sem o conserto, com o `mesa-core.ts` guardado por pathspec; (2) VERDE
  com ele; (3) VERMELHO com regressao plantada, trocando o intervalo por instante
  (`marcos(a) > marcos(p) ? 1 : 0`), e cairam QUATRO assercoes, entre elas a do pulo de 2 para 15.
  Mais quatro controles negativos que passam nos dois estados.
- **05:46** · duas coisas que a escrita achou e que o plano nao previa. A primeira: `AGORA` so e
  recalculado dentro do `pintar()` (`combate.astro:939`), entao varrer antes do `carregar()`
  cobraria contra o relogio de ANTES do Tick que acabou de andar, e o tique sairia sempre uma
  passada atrasado. A varredura foi para depois. A segunda: o desfazer. O `registrarDesfazer`
  ficava ANTES da varredura e so sabia do Tick; agora ele e registrado DEPOIS, com as voltas do
  sangue junto, porque desfazer o relogio deixando a Vida tirada seria pior que nao desfazer.
- **05:46** · o `gatilho: por-turno` virou `por-seis-ticks` nos 9 Efeitos, e o conserto foi no
  GERADOR: mexi em `gen-grid-artes.mjs`, no tipo `Gatilho`, no `G_GATILHOS` do `validate-data` e
  em tres testes, e rodei o gerador. O `--check` fica verde e os tres testes de cura passam.
- **05:46** · e uma armadilha do `reapontar.mjs` que esta escrita no cabecalho dele e eu cai
  nela: rodei o script mais de uma vez sobre o MESMO diff nao commitado, e o mapa e HEAD->arvore,
  entao a segunda passada desloca de novo o que a primeira acertou. Sintoma exato do que ele
  descreve: 19 citacoes quebradas em documentos variados, sem relacao com o que eu mexi.
  Consertado do jeito que ele manda: `git checkout --` nos cinco documentos de citacao, UMA
  passada, e sobrou 1 citacao, que e caso (a) de verdade (eu reescrevi a linha citada).
- **05:53** · ITEM 3 feito: o `Rodada N` saiu da tela. Mas sao TRES lugares e nao dois. Os dois
  do despacho sao `grid.astro:5003` (o relogio grande) e `:12099` (a barra do telefone, que
  copiava o texto do primeiro e ainda trazia `rodada 1` escrito a mao no HTML). O terceiro e o
  MESMO rotulo na aba Combate (`combate.astro:940`, id `enc-rodada`), e eu tirei tambem: deixar
  um so faria as duas telas discordarem sobre a existencia da unidade. Tirei o elemento, a
  escrita e as duas regras de CSS que passaram a nao selecionar nada.
- **05:53** · nao inventei palavra substituta, como ele mandou. O Tick continua onde estava, em
  corpo grande, e nao mexi no `.ini-tk-n` (que ainda diz `grid-row: 1 / span 2`): a linha 2 do
  grid so fica vazia, e a posicao do numero nao muda um pixel. `build` verde e tres portoes de
  navegador que desenham esse cabecalho passam.
- **06:01** · ITEM 2, primeira metade (`M-03`/`M-25`/`M-37`): os seis consertos feitos. O
  comentario do `calc.ts` reescrito pelo motivo certo (a ficha GUARDA especialidade por
  habilidade, `ficha-engine.ts:235`; quem nao guarda e o bestiario, e o que sustenta a exclusao e
  que valor passivo se calcula sem saber quem ataca); o `acoes-e-sistema.md` ganhou a Centelha e
  a nota do portao; o glossario teve as QUATRO formulas alinhadas (Valor Passivo, Defesa, Defesa
  Mental e Defesa Social), e a Mental era a unica das tres que nao mencionava a Especialidade; o
  ataque social passou a nomea-la; o `combate.md` parou de escrever `+ Especialidade` como
  parcela somada; e o `especialidade: true` do `derivados` ganhou a nota dizendo `pode somar
  quando o escopo se aplicar`.
- **06:01** · ITEM 2, `M-47`: DUAS premissas da medicao cairam, e a segunda custaria o item.
  (a) `os capitulos tem ZERO ocorrencias` esta errado: eles tem 37, das quais a maioria vem dos
  blocos gerados (certo) mas nove sao prosa A MAO (`habilidades.md` fora do bloco,
  `qual-sistema.md`), e havia mais 26 em paginas, componentes e outros capitulos que a tabela
  contou como `~10 rotulos de tela`.
- **06:01** · (b) e a mais cara: `as 118 de inimigos.json sao geradas, entao o conserto e na
  fonte (monsters.json)` esta INVERTIDO. O `gen-monsters.mjs` diz na primeira linha que a fonte
  dele e o `inimigos.json`, que por sua vez e gerado pelo `gen-bestiario.mjs`. Eu tinha acabado
  de trocar as 118 do `monsters.json` quando rodei o gerador e elas voltaram todas. A fonte de
  verdade e uma linha so: `gen-bestiario.mjs:407`, que monta a frase `Pericias notaveis: ...`.
  Consertada la, os dois derivados saem limpos no regen.
- **06:01** · a troca foi de TEXTO e nao de JSON, por uma medida: as CHAVES sao `pericias` e
  `pericia` SEM acento e todo texto visivel usa a forma ACENTUADA. Os dois conjuntos sao
  disjuntos, entao trocar so as acentuadas nao encosta em chave nenhuma e nao reserializa o
  `monsters.json` de 958 KB por nada. 199 na primeira passada, 26 na segunda, mais a linha do
  gerador do bestiario. Sobraram 29 ocorrencias, TODAS em comentario de codigo, e elas ficam: o
  escopo da decisao e `onde o leitor le`, e ninguem que jogue le comentario.
- **06:04** · fim. As tres frentes publicadas: `88a6ce1` (o relogio do Sangramento), `dcacb68`
  (o `Rodada N` fora da tela) e `c407b0e` (as quatro decisoes). `validate` e `build` verdes nas
  tres, `git rev-list --count origin/main..HEAD` = 0, zero coautoria. Rodei tambem oito portoes
  de navegador e quatro de dado que enxergam o que toquei: exit 0 em todos.
