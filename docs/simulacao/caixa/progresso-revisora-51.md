# Progresso · revisão da rodada 51

Sinal de vida, hora lida de `date +%H:%M`.

- 03:45: checkout em `ee937b5` (aviso), HEAD/toplevel conferidos. BASE
  `529e21c` é ancestral de SHA `c91c89c`; SHA é ancestral do commit do
  aviso; `git log c91c89c..origin/main` só mostra o próprio `ee937b5`,
  então TOPO = SHA procede. Lido `51-executora.md` e `progresso-51-l87.md`
  inteiros. Foco pedido pelo Arquiteto: os 7 chamadores que perderam
  `avisarAgora` explícito, um a um, perguntando se algum tocava por um
  SEGUNDO motivo (outro assunto, outra escrita, um caminho de erro).
- 03:46: `npm run validate` rodado por mim, verde. Saída confere "279
  citação(ões)... 39 marcada(s) (citação histórica)", exato com o aviso.
- 03:47: `test-arte-na-mesa.mjs` rodado, 33 asserções verdes (bate).
  `test-l70-empurrao.mjs` rodado de novo, 15 verdes (bate, sem regressão).
- 03:48: os 7 chamadores lidos um a um contra o código atual. `levantarDoChao`
  (dois pontos, `:7422`/`:7442`), `curar` (`:11123`), `gastarMana`
  (`:11270`), `devolverVida` (`:11474`), `abrirCondicoes`/`repintar`
  (`:11107`): em todos os sete, o único `avisarAgora('combatentes')` que
  existia foi removido e nada mais mudou na função ao redor; nenhum tinha um
  segundo assunto (`'tokens'`/`'efeitos'`), segunda escrita ou caminho de
  erro que dependesse daquela chamada específica. Os dois que ficaram
  (`aplicarDano`/`tirarVida` em `:11073`/`:11160`, `ajustarMana` em
  `:11206`) conferidos contra o comentário: a razão declarada bate com o
  código (o ramo jogador de `baixarVida` usa `jogador_dano` direto; o ramo
  mestre de `ajustarMana` escreve `mana_max`+`mana_atual` juntos direto em
  `SB`), e o ramo que JÁ usa `gravarPeca` (mestre em `aplicarDano`/
  `tirarVida`; jogador em `ajustarMana`) agora dobra o aviso, exatamente como
  o próprio comentário admite, sem esconder.
- 03:48: `gravarCondicao` conferido nas duas pontas: `CtxGrid`
  (`artes-grid-mesa.ts:104`, campo obrigatório) e `ctxArtes()`
  (`grid.astro:2807`, `(cid, condicoes) => gravarPeca(cid, {condicoes})`).
  `porCondicao`/`tirarCondicao`/`varrerCondicoesVencidas`
  (`artes-grid-mesa.ts:1474/1484/1868`) todos chamando `ctx.gravarCondicao`
  agora: fecha de verdade o buraco do `varrerCondicoesVencidas` que eu
  mesma tinha achado numa investigação fora de rodada (o `if
  (!ATIVOS.length) return` que fazia a condição vencida nunca avisar sem
  Arte ativa). `marcarInvestida` (`grid.astro:6335`) confirmado chamando
  `gravarPeca` também, fechando o buraco do `declararAtaqueSimultaneo`.
- 03:49: achado incidental, fora do pedido e fora desta rodada: lendo ao
  redor de `devolverVida`/`curar`, achei `alternarAuto` (`:6098`) e
  `devolverAuto` (`:11486`) escrevendo `combatentes.dados` direto por `SB`,
  sem NUNCA chamar `avisarAgora`, nem antes nem depois desta rodada (os dois
  nunca passaram por `gravarPeca`, então nunca estiveram no conjunto
  auditado dos 9). Simétrico (o gesto de ida e o desfazer têm o mesmo
  silêncio), então não é uma regressão desta rodada nem um buraco novo:
  é um terceiro exemplo de "o estrangulamento não é único", ao lado dos
  dois já divulgados. Baixa gravidade (o campo `auto` é cosmético, não
  ocupação nem Vida). Registrando como observação, não como CORRIGE.
- 03:49: varredura de travessão pelo diff inteiro da rodada (`529e21c..
  c91c89c`, via `rtk proxy git diff`, 1576 linhas batendo com o `--stat`):
  zero linhas adicionadas com "—". Meu próprio arquivo novo varrido: limpo.
  Escrevendo o veredito.
