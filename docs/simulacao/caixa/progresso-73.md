# Progresso · rodada 73 · a lista arma × armadura mostra só a armadura

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `2eadf6e`. A lista soma o corpo na linha em que ele não existe (Corte) e o esquece na
linha em que ele é o maior pedaço (Impacto). As cinco passam a mostrar só a armadura, com uma
frase acima lembrando a Absorção natural, e um portão prende os números a `armaduras.json`.

A frase "o malho passa" eu POSSO ajustar, e é consequência e não decisão nova; digo o que escrevi.
NÃO mexer em número de `armaduras.json` nem em `centelhaNoSoak`. E o travessão de
`regras.json → dano.nota` sai junto (ele é um dos 42 do `J0`).

- **14:50** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **14:52** · antes de reescrever a frase do malho, MEDI, para nao trocar uma promessa sem apoio
  por outra. Cavaleiro de placa completa, Vigor 3 e Centelha 2, atacante de Forca 4, dano medio
  por golpe ja descontada a Absorcao inteira: Martelo de Guerra (2d6, duas maos) atravessa 6;
  Montante (2d6, e CORTE) atravessa 5; Alabarda 3,5; e a Maca de uma mao (1d6) atravessa ZERO.
- **14:52** · ou seja, a lista prometia mais do que entrega em DOIS pontos, e nao um. A diferenca
  entre Corte e Impacto e de UM ponto de Absorcao (10 contra 9) e nao de quatro, e a frase `a
  maca e o abre-lata de uma mao` e FALSA contra placa completa: a maca nao passa. O martelo de
  duas maos passa, e por um ponto a mais que o montante, que e uma arma de Corte.
- **14:53** · reescrito: a lista mostra so a armadura (8 / 4 / 4), uma frase acima diz que a
  Absorcao natural soma por cima E qual modo recebe o que, e um `callout exemplo` novo mostra a
  conta com os dois numeros somados e os tres danos medidos. A frase do malho deixou de dizer
  `o malho passa` e passou a dizer que o Impacto e a via mais confiavel MAS precisa de peso de
  verdade. O callout `Como derrotar cada armadura` acompanhou, pelo mesmo motivo, e ganhou o
  numero de atacantes, que era a outra metade que ele ja dizia.
- **14:54** · o travessao do `dano.nota` saiu (virou virgula mais `e`), e atualizei a conta do
  `J0` no `docs/pendencias/J-infraestrutura.md`: 42 viraram 41, com o porque escrito ao lado.
- **14:55** · PORTAO no `test-contrato`, mesmo molde do custo de raca: os tres numeros da lista
  saem de `armaduras.json`, e ha uma assercao separada dizendo que o CORPO nao entra na lista
  (`com o corpo` ou `no cavaleiro` em qualquer das tres linhas fica vermelho). Essa segunda e a
  que pega a VOLTA do defeito, e nao so o numero errado.
- **14:55** · ENSAIO DOS TRES SENTIDOS: (1) guardando o capitulo, quatro falhas, e duas delas
  sao exatamente o defeito antigo (`veio null` porque a linha trazia dois numeros, e `voltou a
  somar o corpo`); (2) verde; (3) plantei o Impacto voltando a `9 (no cavaleiro, com o corpo)` e
  cairam as duas assercoes dele, a do numero e a da mistura.
- **14:58** · fim. Publicado em `b123bbb`, `git rev-list --count origin/main..HEAD` = 0.
  `validate` e `build` verdes, mais `test-contrato`, `test-kael`, `test-travessao-capitulos` e
  `test-porte-raca`: exit 0. Zero coautoria, zero travessao nas linhas que eu escrevi (os tres
  que restam no capitulo sao marcadores de celula vazia em tabela, pre-existentes).
