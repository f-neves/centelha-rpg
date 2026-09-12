# Progresso · revisão da rodada 50

Sinal de vida, hora lida de `date +%H:%M`.

- 02:42: checkout em `3c13075` (aviso), HEAD/toplevel conferidos. BASE
  `d9ed457` é ancestral de SHA `4bebdce`; SHA é ancestral do commit do aviso;
  `origin/main` = `3c13075`, uma linha à frente do SHA (o próprio aviso),
  então TOPO = SHA está correto: nada de outra frente entrou na janela. Lido
  `50-executora.md` e `progresso-50-l70.md` inteiros. Indo rodar a bateria de
  testes individuais desta rodada e conferir os números publicados.
- 02:44: `npm run validate` rodado por mim, verde (exit 0). Conferido na
  saída: "276 citação(ões) de código conferidas... 36 marcada(s) (citação
  histórica)" bate exatamente com o número do aviso e com a correção do L89
  do Arquiteto.
- 02:45: rodei os três testes novos individualmente. `test-l70-empurrao.mjs`:
  15 asserções verdes (bate). `test-l84-caidofila-mesa.mjs`: 12 verdes
  (bate). `test-l84-levantar-mesa.mjs`: 17 verdes (bate). Total 44, como
  publicado.
- 02:46: contei `noChao(` de verdade em `grid.astro` (excluindo menções em
  comentário): 7 linhas / 8 ocorrências / 6 pontos lógicos (`4747`, `5713`,
  `6828`, `7158`+`7172`×2, `8670`, `8730`), batendo exatamente com a tabela
  do aviso. Conferida a divisão estrutural `noChaoAgora`/`foraDaFilaAgora`
  (`:4747`/`:4756`): existe, alimenta `CAIDOS_AO_ABRIR` (físico) e
  `conferirFila` (fila) separadamente, como prometido.
- 02:47: ceticismo pedido nos dois julgamentos do Arquiteto. `moverSimultaneo`
  em Q1 (`:6828`): confirmei que a rota direta (`porNoMapa`, `:6831`) AINDA
  cobra `cobrarDeslocamento` pela distância real (`:7316-7318`), então não é
  "de graça"; é imediata em vez de declarada, e a razão dada ("rastejar não
  está decidido") se sustenta. `destinoDoGolpe` em Q1 (`:8670`): a razão
  física (corpo caído fora do arco de um golpe mirado em pé) é coerente com o
  resto da função, sem contradição interna. Sustento os dois.
- 02:48: conferido `levantarDoChao` (`:7375-7424`) linha a linha contra a
  correção do Arquiteto: memória (`c.condicoes`) muda ANTES da busca de
  vizinho e ANTES de `porNoMapa`, e só é GRAVADA depois que a posição
  confirma; falha de posição desfaz a memória; falha de condição DEPOIS da
  posição não desfaz o movimento (documentado, evita segunda corrida). Achado
  lateral, não é defeito: se a gravação da condição falhar depois do
  movimento confirmado, a memória local fica com `caido` removido mas o
  banco ainda tem `caido` até o mestre resolver o erro mostrado; é a mesma
  divergência que o próprio comentário já assume, não uma surpresa nova.
  Conferidos os 10 chamadores de `porNoMapa` (`:6137,6183,6244,6252,6546,
  6831,7411,9016,11454,11455`): todos os 10 presentes, só `:6137`/`:6183`
  convertidos de `return porNoMapa(...)` para `await ...; return;`, como
  descrito. `porNoMapa` ainda chama `uiErro` internamente E devolve
  `{error}` agora.
- 02:49: varredura de travessão no diff da rodada (BASE `d9ed457` a SHA
  `4bebdce`, via `rtk proxy git diff` para não perder linhas na filtragem).
  DOIS achados reais: `docs/simulacao/caixa/progresso-50-l70.md` (o "—" antes
  de "e `c` ainda estava `caido`") e `src/pages/mesa/grid.astro`, comentário
  novo de `pintarIniciativa` ("não está em pé de verdade — caído conta..").
  Nenhum dos dois é código de `src/content/**`, então o portão automático não
  cobre nenhum. Conferido também os três arquivos de teste novos (estão
  inteiros no diff, `+++ b/...` presente nos três): limpos. Meu próprio
  arquivo novo (`progresso-revisora-50.md`) varrido: limpo.
- 02:49: veredito escrito (`50-revisora.md`), CORRIGE nos dois travessões
  achados, sem bloqueio. Varri o próprio veredito por travessão: achei 5 usos
  meus por hábito (não os das citações, esses ficam de propósito) e corrigi
  todos antes de commitar. Indo commitar com pathspec e dar push.
