# Progresso · revisão da rodada 54

Sinal de vida, hora lida de `date +%H:%M`.

- 12:18: checkout em `86e88dd` (aviso), HEAD/toplevel conferidos. BASE
  `fcf778e` é ancestral de SHA `8c63698`; SHA é ancestral do commit do
  aviso; `git log 8c63698..origin/main` só mostra o próprio `86e88dd`,
  TOPO = SHA procede. Conferido `git log fcf778e..8c63698`: os três
  primeiros commits (`bed2ec4`, `971300c`, `a7bafae`) são mesmo a cauda da
  rodada 53 (CATALOGO, o CORRIGE dos travessões, o fechamento), como o
  Arquiteto avisou; os quatro seguintes (`6e65660`, `4b2d875`, `eb8de4e`,
  `8c63698`) são a rodada 54 de verdade. Não vou atribuir os três
  primeiros a esta rodada. Lido `54-executora.md` e `progresso-54-l85.md`
  inteiros. Ordem de ceticismo pedida: (1) o segundo teto ("pesaDemais")
  é distinto de verdade no código e no teste, não só no comentário; (2)
  a implementação é mesmo única (grep varrendo o lugar certo em
  ficha-engine.ts); (3) falsificar o ×4 do FAA, ver se a simetria com o
  FAH se sustenta; (4) o L95 (peso do bestiário) foi corretamente adiado,
  não é achado escondido.
- 12:19: `npm run validate` verde, "281 citação(ões)... 45 marcada(s)
  (citação histórica)", exato com a mensagem do Arquiteto.
  `test-l85-forca-empurrao.mjs`: 27 asserções verdes (bate). `npx tsc
  --noEmit`: limpo.
- 12:20: Ponto 1, lido `resultadoDoEmpurrao` (`artes-grid-mesa.ts:1227
  -1232`) e o chamador `deslocar` (`:1281-1286`). O código distingue de
  verdade: `if (peso > maxKg) return {metros:0, pesaDemais:true}` ANTES
  de chamar `alcanceArremesso`; o caso "derruba" (`metros:0,
  pesaDemais:false`) só acontece quando `peso <= maxKg` mas acima do
  teto de arremesso (`alcanceArremesso` devolve 0 nesse caso). Em
  `deslocar`, quando `pesaDemais` é true o laço faz `continue` ANTES de
  chegar em `condicoesDoEmpurrao`, então nada é aplicado; quando é
  false (mesmo com metros=0), o fluxo chega em `condicoesDoEmpurrao`,
  que aplica a condição própria da Arte (`caido`) independente de
  `parouAntes`. Os dois estados são distintos em código, não só em
  comentário, confirmado lendo os dois lados (produtor e consumidor).
- 12:21: Ponto 2, o grep de "uma implementação só". A lista checada
  (`cadeia`) tem 5 nomes, não 7 como a Executora escreveu no progresso
  ("as sete constantes... sumiram"): faltam `arremessoApice` e
  `arremessoTeto`. Fui ver por quê: `ficha-engine.ts:1573-1575` ainda lê
  `F.arremessoTeto`/`F.arremessoApice` DIRETO, de propósito, para
  mostrar ao usuário os sub-tetos da própria ficha (chão/cabeça/
  arremesso), não para recalcular a distância. `dist(w)` (linha 1576)
  já delega para `alcanceArremesso`. A omissão das duas constantes no
  grep é CORRETA (incluí-las daria falso positivo), mas a frase "as
  sete... sumiram" no progresso está imprecisa: só 5 desaparecem, 2
  ficam por razão legítima. Achado de prosa, não de código.
- 12:22: Ponto 3, falsifiquei a simetria ×4 calculando a tabela inteira
  (script ad hoc, apagado depois, `git status` limpo conferido) com a
  função real `alcanceArremesso`/`pesoMaximoErguido`. Nível 1→6: FAH
  5..40 (maxKg 60..1000, razão 16,67×), FAA 4..24 (distância a 3 kg:
  11,9m..41,7m, razão 3,51×, batendo com 6^0,7 esperado pelo expoente
  da fórmula). A 70 kg: 0m nos níveis 1-2 (teto de arremesso abaixo de
  70 kg, só derruba), 7,3m a 11,8m nos níveis 3-6. Progressão monotônica,
  sem explosão nem achatamento, e o "25,7 m" do aviso bate exato com o
  nível 3 a 3 kg da minha tabela. A simetria produz saída sensata; não
  achei fragilidade.
- 12:22: varredura de travessão pelo diff inteiro da rodada (`fcf778e..
  8c63698`, via `rtk proxy git diff`, 1084 linhas batendo com o `--stat`
  de 610+69): zero linhas adicionadas com "—". Meu próprio arquivo novo
  varrido: limpo. Escrevendo o veredito.
