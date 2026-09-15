# Progresso · rodada 74 · MEDIR o limite da morte abaixo de zero

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `6978781`. **Rodada de MEDIÇÃO: nenhum capítulo se toca.** O que se entrega são
números, não recomendação de regra, e a escolha entre metade e um quarto volta para a mesa.

A pergunta que ele quer atacada: um limite que não deixa ninguém chegar a tempo APAGA do jogo a
cena que o capítulo promete (o aliado caído que alguém precisa socorrer).

Mais um conserto que independe: `referencia.astro:170`, que escapou da varredura da rodada 66.

- **15:23** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **15:25** · o conserto que independe: `referencia.astro:170` passou a dizer `a cada 6 Ticks
  desde o ferimento, no relogio de cada um`. E varri `inicio da rodada` em `src/` e `scripts/`:
  sobrou uma so ocorrencia, num comentario do MEU `test-sangramento.mjs` que descreve a regra
  VELHA de proposito. Nao ha terceiro lugar.
- **15:26** · instrumentei o `sim-grupo.mjs` (`limiteMorte` 0 por padrao, `chefeRemata`, `diario`)
  e o CONTROLE NEGATIVO fechou: escrevi um involucro que semeia o `Math.random` ANTES de importar
  o alvo, sem tocar no arquivo, e rodei o `sim-grupo` com a mesma semente antes de qualquer
  mudanca e depois de todas. Saida IDENTICA byte a byte. O relatorio de balanco nao mudou.
- **15:28** · a primeira medicao deu ZERO caidos e quase me fez concluir errado. A causa nao era
  o codigo: no `combo+0` o grupo ganha 100% das vezes e sai inteiro, entao nao ha quem caia. O
  `combo` do chefe e o que decide se alguem cai, e a medicao passou a varrer os quatro.
- **15:29** · e um achado que eu nao esperava: com o chefe IGNORANDO os caidos, quem morre morre
  no MESMO golpe que o derrubou (margem 0), porque uma pancada grande atravessa o zero e o limite
  de uma vez. Nao e morte que alguem pudesse evitar correndo: nao houve intervalo nenhum.
- **15:31** · a resposta ao socorro, que era a pergunta dele: socorrer custa 4 Ticks (ate 4 m, com
  a acao utilitaria de 4). Com limite 0 a cena nao existe. Com PV/4 a margem mediana e 5 Ticks:
  UM Tick de folga, e so a curta distancia. Com PV/2 sao 10 Ticks no `combo+2`, mas caem para 5
  no `combo+3`, porque o golpe de 13 come o dobro da margem por vez.
- **15:31** · e o que a medicao NAO diz esta escrito no documento, com tres itens. O mais pesado:
  ela NAO modela o Sangramento, que come a margem por fora, e com PV/4 um unico tique de sangue
  consome quase toda ela. Isso puxa a conta para o limite maior, e eu nao medi porque o
  `sim-grupo` nao tem condicao continua.
