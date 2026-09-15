# Progresso · rodada 75 · a escala de Centelha vai a 12, e o jogador para em 6

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `d5948f5`. Quatro coisas: os degraus 7 a 12, o portão derivando o topo em vez de
repetir o número, o teto do jogador ESCRITO no capítulo, e os três renderizadores conferidos na
tela (uma lista que quase dobra costuma estourar caixa).

NOMEAR os seis degraus é worldbuilding e fica ABERTO: o rótulo que eu usar tem de se ler como
provisório, e eu digo qual foi. **Nenhum número de criatura muda.** Não encostar no `capFor`.
Se a rodada me levar à frase dos Atributos sobre-humanos (`M-22`), relato e não conserto.

- **15:34** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **15:42** · item 3 fechado: `centelha.md` ganhou o teto do jogador em tres lugares (a frase de abertura, um callout depois da tabela, e a linha do Semideus que chamava o 6 de "teto da escala"). A razao mecanica esta escrita: acima de 6 nao destrava Proeza nenhuma.
- **15:50** · item 4 fechado, medido na tela (Edge headless, 1280x1100 e 390x844), nao conferido de olho.
  Os tres renderizadores com 13 degraus: popup da ficha (13 linhas, `max-height: 85vh` + `overflow: auto`,
  rola e cabe na tela), tabela da `referencia.astro` (13 linhas, 831px no notebook e 1285px no telefone,
  nao corta em baixo nem de lado; a `.ref-duas` e `align-items: start`, entao a coluna so cresce),
  e o `ref-index.json` (13 niveis, topo 12, `provisorio: true`).
- **15:50** · a primeira medicao da tabela deu altura ZERO, e era zero ambiguo: o conteudo da referencia
  nasce com o atributo `hidden` (portao de sessao), e `[hidden] { display: none !important }` do
  `global.css` derruba ate estilo inline. Medido de novo tirando o atributo.
- **15:50** · `validate` verde, `build` verde, `test-procedencia` verde (288 citacoes). Zero travessao
  nas minhas linhas (conferido lendo os ARQUIVOS, nao `git diff`), zero byte de controle.
