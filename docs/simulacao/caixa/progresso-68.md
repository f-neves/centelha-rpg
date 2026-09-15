# Progresso · rodada 68 · o Gnomo também é Pequeno

Sinal de vida, não resumo. Uma linha por etapa pequena, no instante em que ela fecha, hora lida
da máquina. Etapa sem hora é honesta; hora inventada não é.

Ancorada em `9ac6f74`. Uma palavra no `racas.json`, mais as duas conferências que ele pediu: se
o portão da rodada 67 acompanha sozinho, e se a ficha do Gnomo imprime a conta certa na própria
linha. O custo de XP das raças NÃO se ajusta (`M-46`); se eu achar algo que mexa nele, anoto.

- **13:35** · começo. Árvore limpa fora o `jogador-novo-prompt-executor.md`, que não é meu.
- **13:36** · a palavra trocada: `gnomo` de `medio` para `pequeno`, e as oito ficam
  `humano/anao/elfo/meio-elfo/orc/meio-orc` medios e `gnomo/halfling` pequenos.
- **13:36** · CONFERENCIA 1, e a resposta e AS DUAS COISAS. O portao da rodada 67 prendia o
  mecanismo (o porte vem do dado, chega ao `pv()`, a explicacao le a mesma linha) E o ROL
  (`Halfling e a unica pequena`). O mecanismo passou inteiro sem eu tocar em nada; o rol ficou
  vermelho na hora, com uma falha so. Nao acho que o rol estivesse errado: ele obrigou a
  mudanca a ser DELIBERADA. O que estava errado era a REDACAO dele, que dizia `Gnomo e Anao
  seguem Medios ate a mesa decidir` como se fosse regra, quando era status quo. Reescrito como
  ROL de decisoes, com `M-29` e `M-29b` nomeadas ao lado.
- **13:36** · CONFERENCIA 2: a frase da ficha agora tem DOIS casos no portao, montados pelo
  mesmo molde do `ficha-engine`. Halfling de Vigor 3 da `20 + Vigor 3x2 = 26` e Gnomo de Vigor 4
  da `20 + Vigor 4x2 = 28`. Dois casos e nao um de proposito: com um so, um numero escrito a mao
  que por acaso batesse passaria.
- **13:36** · e a regua da `M-29b` foi morar onde a tabela de porte ja e explicada, a
  `derivados.pv.nota` do `regras.json`. Sem secao nova, como ele pediu: e o lugar que quem for
  criar raca nova le antes de escolher o porte.
- **13:40** · um achado pequeno de VOCABULARIO, anotado e nao consertado: o capitulo das racas
  usa `miudo` como prosa em duas linhas (`racas.md:71`, o Gnomo, e `:84`, o Halfling, que diz
  `porte miudo`). `Miudo` e o ROTULO do porte `minusculo` no vocabulario do proprio jogo
  (`PORTE_M` do `grid.astro:3406`), e as duas racas sao `pequeno` e nao `minusculo`. Nao muda
  numero nenhum, e agora que `porte` e campo de verdade a palavra passou a colidir.
- **13:40** · e nada que eu tenha achado mexe no CUSTO de uma raca, entao nao ha o que anotar
  para a `M-46` alem do que a propria decisao ja registra (o Gnomo custa 40 e e o que mais perde).
- **13:40** · fim. Publicado em `c45e068`, `git rev-list --count origin/main..HEAD` = 0.
  `validate` e `build` verdes, `test-kael`, `test-contrato` e `test-porte-raca` exit 0.
  Zero coautoria, zero travessao nas linhas que eu escrevi (conferido lendo os ARQUIVOS).
