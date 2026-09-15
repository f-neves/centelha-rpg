# Progresso · rodada 64 · a fita que diz que cortou, a `M-14` e a `M-11b`

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `f6323b0`. Três frentes, nesta ordem: a fita (as duas metades que eu recomendei e ele
aprovou), a `M-14` (o par Atributo + Habilidade sai da descrição da ação) e a `M-11b` (a Firula
vira Stunt). Se a rodada ficar longa, fecho no que estiver pronto e digo o que sobrou.

- **03:38** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **03:43** · FRENTE 1 (a fita) pronta, as duas metades. `fitaHTML` ganhou uma condicao: quando
  `acao.livre > tickAgora + largura`, a ULTIMA celula leva a classe `continua` e um title que diz
  que a acao segue alem da fita; o CSS e uma mascara que desvanece para a direita, em
  `MesaCab.astro`, sem engordar a celula (mesmo motivo do `agora` usar sombra e nao borda).
  E `resumoDaAcao` passou a dizer `Golpe no t14` enquanto o Golpe esta por vir.
- **03:43** · ENSAIO DOS TRES SENTIDOS do portao novo, dentro do `test-combate-tempo.mjs`, que ja
  esta no `validate`. (1) VERMELHO hoje: guardei os tres arquivos de `src/` com pathspec e o
  portao deu 8 falhas, todas as certas. (2) VERDE com o conserto, sem tocar no arquivo do portao.
  (3) VERMELHO com regressao plantada: troquei `>` por `>=` na condicao do corte e a assercao de
  BORDA pegou (ciclo 12 na fita de 12 cabe exato e nao pode ser marcado). Restaurado do backup.
- **03:43** · e os TRES lugares conferidos, nao so o card: o token do Grid (9), a tira da fila
  (10) e o card do rastreador (12). Com ciclo 15 os tres marcam o corte, nos tres a celula do
  Golpe fica mesmo fora, e os tres dizem `Golpe no t14`. Com ciclo 6 nenhum marca e a celula do
  Golpe aparece nos tres. O portao trava os seis casos.
- **03:43** · quatro citacoes envelheceram porque eu inseri linhas no meio de dois arquivos, e o
  `validate` pegou (este par de arquivos ESTA na lista dos doze). Re-apontadas pela ancora:
  `mesa-tempo-ui.ts` 287->298 (`const SAIDAS`), 418->429 (`const verbo`), 556->567
  (`custoInterporRecuperacao`) no `Pendencias.md`, e `test-combate-tempo.mjs` 309->316
  (`T.temGesto`) no `REVISORA.md`. `validate` verde.
