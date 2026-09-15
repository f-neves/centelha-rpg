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
