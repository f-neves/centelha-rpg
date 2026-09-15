# Progresso · rodada 71 · o `+1` racial vira piso 2, e continua sendo teto 7

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `cb557a7`. Mudança de desenho, não conserto de inconsistência, e ela toca DADO VIVO:
ficha de Elfo salva com Destreza 1 existe hoje e é legítima. O que a ficha faz ao abrir uma dessas
é decisão minha, e vai dita no commit.

O que ele quer do seam é **dois caminhos separados** para piso e teto, alimentados hoje pelo mesmo
campo. **Campo novo NÃO se inventa** (foi o que o `porte` foi até ontem).

Conferir por mim mesma, antes de aceitar: que o `de` de `custoPontos` cobra certo.

- **14:01** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **14:04** · CONFERI o `custoPontos` por mim mesma antes de aceitar, e ele esta certo: passar
  `de = 2` tira exatamente 15 XP em TODO nivel de 2 a 7 (o acumulado de 1 ate 4 e 60, o de 2 ate
  4 e 45). No nivel 1 a diferenca e 0, e isso nao importa porque depois desta mudanca ninguem
  com `+1` racial fica em 1: o piso o sobe.
- **14:04** · e a medicao do RADAR bate com a dele, numero por numero: `15 x (quantos +1 a raca
  tem)`. Orc e Meio-Orc tem dois (Forca e Vigor) e ganham 30; Anao, Elfo, Gnomo e Halfling tem
  um e ganham 15; Humano e Meio-Elfo nao tem e ganham 0. Nao ajustei custo nenhum (`M-46`).
- **14:04** · e um cuidado que a decisao exige e o despacho nao repete: o campo `atributos` da
  raca guarda os DOIS sinais no mesmo lugar (o Elfo tem `destreza: 1` e `vigor: -1`). O caminho
  do PISO tem de ler so o positivo, senao o Elfo abriria com Vigor 0, abaixo do piso de todo
  mundo. O caminho do TETO le com sinal, como ja lia.
- **14:06** · O SEAM escrito: `pisoRacialAttr` e `tetoRacialAttr`, duas funcoes separadas lendo
  hoje o MESMO campo. O do teto le com sinal (como ja lia); o do piso clampa em zero. Separar
  no futuro (`o Gnomo ganha o ponto mas mantem o maximo em 6`) vira trocar de onde UMA delas le.
  Campo novo NAO foi inventado.
- **14:06** · o `floorOf` virou `pisoDe(kind, key)`, e os TRES leitores passaram a usa-lo
  (`refreshDots`, o clamp do `applyVal`, o `setDot`). O XP passou a cobrar
  `custoPontos('atributo', pisoAttr(id), valor)`, sem tocar em `calc.ts`. E a troca de raca
  passou a mexer nos DOIS lados: desce o que passou do teto novo e SOBE o que ficou abaixo do
  piso novo.
- **14:06** · DADO VIVO, e a minha decisao: a ficha salva abaixo do piso **sobe, e sobe
  AVISANDO**, por um painel na abertura que lista o que subiu e de quanto. Deixar abaixo do piso
  seria pior de tres maneiras (a bolinha de brinde ficaria apagada, o XP cobraria um ponto que a
  raca da de graca, e o primeiro clique em qualquer bolinha subiria o valor sozinho pelo clamp,
  sem ninguem entender por que). Subir calada tambem nao serve: e um numero que o jogador
  escolheu. A subida mora no `normalize`, que e o lugar das migracoes de ficha salva, e roda
  DEPOIS de `S.raca` estar garantido, senao o piso nao existe.
- **14:07** · o capitulo mudou em DOZE trechos e nao dois: o cabecalho da tabela resumo, o
  callout `Como ler um traco racial` (que e onde a regra nova cabe inteira), as seis linhas de
  `+1` e as seis de `-1`. As de `-1` ganharam `piso normal` entre parenteses, porque agora que o
  `+1` mexe nos dois lados o leitor precisa saber que o `-1` nao mexe.
- **14:09** · ENSAIO DOS TRES SENTIDOS: (1) guardando o `ficha-engine.ts`, nove falhas, todas as
  certas; (2) verde; (3) plantei a regressao mais provavel de todas, tirar o `Math.max(0, ...)`
  do caminho do piso, e caiu a assercao dela sozinha. Essa regressao nao e hipotetica: e o que
  acontece se alguem `simplificar` as duas funcoes de volta numa so.
- **14:09** · e a resposta a pergunta dele sobre o portao da rodada 69: ele NAO alcanca isto. Ele
  prende custo (capitulo contra dado, nos dois lugares do capitulo) e rotulo de porte, e nao tem
  nada sobre teto nem sobre piso. Amplia-lo custaria pouco e eu ampliei, porque a redacao nova e
  trabalho DESTA rodada e nao da 69: entraram nove assercoes no mesmo arquivo, sem arquivo novo,
  sem entrada nova no `package.json` e nos mesmos milissegundos. O que elas guardam e o SEAM (as
  duas funcoes separadas, o clamp do piso, os tres leitores do `pisoDe`, o aviso do dado vivo) e
  o preco do brinde medido nivel a nivel, que e o numero que a `M-46` vai usar.
- **14:12** · fim. Publicado em `4ed3ba4`, `git rev-list --count origin/main..HEAD` = 0.
  `validate` e `build` verdes, `test-kael`, `test-contrato` e `test-exemplos-criacao` exit 0.
  Zero coautoria, zero travessao nas linhas que eu escrevi (conferido lendo os ARQUIVOS).
