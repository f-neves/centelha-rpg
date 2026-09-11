# Progresso · rodada 39 (item 1: o prazo do L71 exercitado por teste; item 2: L67 alcance corpo a corpo de borda a borda)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 05:35 · reancorada em `e0326a9537e34c516347437479e73aeda5dd88ce` (passo 0 do §0 confirmado, worktree ressincronizada antes sem nada pendente). Lendo o aviso agora.
- 05:35 · `cenaVozPrazo` lida por completo (`test-grid.mjs:3032-3106`). Toda asserção lê o DOM de
  verdade (título/corpo do diálogo de erro, `title` do botão) · nenhuma lê variável interna. O
  ceticismo do L74 confere: observa a tela, não recalcula. Vou falsificar o achado do IndexedDB
  por origem eu mesma: reverter `br.createBrowserContext()` para `br.newPage()` comum e rodar o
  smoke inteiro, para ver se o falso-verde volta (a prova de que a causa é essa, não outra).
- 05:37 · achado próprio, procurando o "nono lugar" que o Arquiteto sugeriu que podia existir:
  `grid.astro:10072`, dentro de `valoresDoLance()` (a terceira coluna da ficha do lance,
  "Alcance da arma"), usa `HEX_HASTE`/`HEX_CORPO_A_CORPO` cru, SEM somar `raioExtraHex` · o
  mesmo padrão de cópia manual do oitavo lugar, não achado por busca de nome. A diferença: este
  é um valor de EXIBIÇÃO ("só leitura de propósito", comentário do próprio código), ao lado de
  "Distância" na mesma tabela · se o mestre ler os dois e concluir à mão se alcança, o número
  mostrado aqui diverge do que o motor decide de verdade nos outros oito lugares. Registrando
  para o veredito, não corrigindo. Rodei `test-l67-corpoacorpo-mesa.mjs` eu mesma: exit 0, as
  duas metades do critério confirmadas ao vivo. Verifiquei a geometria do `Math.ceil` (Enorme =
  4m no `PORTE_M`, `(4-1)/2=1,5`, `Math.ceil=2`) contra a conta do comentário · bate. Aguardando
  a falsificação do IndexedDB terminar em segundo plano.
- 05:42 · a falsificação terminou: `EXIT=1`, `TimeoutError` esperando
  `dialog.ui-dlg.perigo[open]` em `cenaVozPrazo` (`test-grid.mjs:3076`), logo
  depois das cenas de voz anteriores rodarem na MESMA página. É exatamente a
  forma prevista: com `br.newPage()` comum (armazenamento compartilhado) o
  modelo real já estava em cache no IndexedDB de uma cena anterior, então a
  interceptação do modelo corrompido nunca chegou a ser exercitada pelo
  navegador, o diálogo de prazo vencido nunca apareceu, e o teste travou em vez
  de passar. Confirma, por reprodução própria (não por aceitar a palavra da
  Executora), a causa por origem e a necessidade do `br.createBrowserContext()`.
  Revertido o código de volta ao original (`git diff --stat` vazio, `git
  status --short` só mostra este arquivo de progresso, não rastreado) antes de
  qualquer outra coisa, conforme CONTRATO §2. Indo agora para a conferência
  independente do L75 (0d1c300) pela API do GitHub.
- 05:47 · L75 (0d1c300) CONFIRMADO pela API real do GitHub, não pela conta do
  Arquiteto: puxei os jobs "Smoke · test-grid" de 28 runs (17 antes de
  `4ab1a58`, 11 a partir dele) pela API (`gh api .../actions/runs/<id>/jobs`),
  medi `completed_at - started_at` eu mesma. Descartando os 2 runs mais antigos
  do lado "antes" e o run de `0d1c300` (08:27, depois do corte de 07:10Z) do
  lado "depois", os quatro números batem exatamente: mediana antes 684s, média
  661s, mínimo 459s, máximo 832s (15 runs); mediana depois 781s, média 732s,
  mínimo 564s, máximo 845s (10 runs). L75 fecha limpo, terceira conta e agora
  sim certa.
  ACHADO PRÓPRIO, não pedido no aviso: o workflow run do PRÓPRIO `0d1c300`
  (id 34579254256) terminou com `conclusion: failure` · o job "Smoke ·
  test-grid" passou, mas "Dados e regras" (o portão rápido, `test-procedencia.
  mjs`) quebrou, acusando 28 citações de código ENVELHECIDAS, não as "5... do
  L72, item fechado" que a mensagem do commit `0d1c300` declara. Conferi duas
  a mão, na própria árvore de `0d1c300` (grid.astro não muda nesse commit, é
  o mesmo conteúdo do pai `d691d97`): `ESTADO.md:418` aponta para
  `grid.astro:5856` ("avancarAteParar"), mas a função mora em `5819` nessa
  árvore (o reaponte errou por ~37 linhas); `Pendencias.md:2799` aponta para
  `grid.astro:10966` ("SB.rpc"), mas as chamadas reais ficam em 2630/2635/2639
  (erro de mais de 8000 linhas). Não é deriva por commit seguinte: o erro já
  nasce errado no próprio commit do reaponte. O CI de `e0326a9` (o SHA desta
  rodada) está verde porque o commit seguinte (`5b18466`) mexeu em
  `grid.astro`/`alcance.ts` (72+15 linhas) por outro motivo (L67/L71) e por
  coincidência aproximou `avancarAteParar` de volta para perto de 5856 (ficou
  em 5857, dentro da tolerância do checador) · sorte, não conserto. O script
  do reaponte tem um defeito real que vai aparecer de novo. Vai para o
  veredito como CORRIGE (o script, não o estado atual, que está verde por
  acidente).
- 05:50 · travessão: não confiei na varredura do Arquiteto (aviso explícito
  nesta rodada de que `git diff` cego a arquivo não rastreado já falhou uma
  vez). Rodei a minha própria, sobre o diff INTEIRO da rodada (`93b6be7..
  e0326a9`, os quatro commits, todo arquivo, não só o de remoção de
  travessão): nenhuma linha adicionada em nenhum arquivo do intervalo carrega
  `·`. Limpo, e desta vez conferido por mim, não herdado. Indo para `npm run
  validate`.
- 05:53 · `npm run validate`: `EXIT=0`, limpo. `node scripts/test-grid.mjs` (bateria inteira,
  sem modificação nenhuma) rodando em segundo plano para confirmar o estado real da rodada;
  não vou aceitar "verde" sem ver o log com meus olhos. Escrevi o rascunho de
  `39-revisora.md` enquanto esperava, com os dois achados próprios (o nono lugar em
  `valoresDoLance` e o reaponte errado de `0d1c300`) e a conferência do L75. Falta só colar
  o resultado real do `test-grid.mjs` e commitar os dois arquivos juntos.
- 06:16 · `test-grid.mjs` terminou: `EXIT=0`, todas as cenas verdes, checkout limpo (sem a
  falsificação). O Arquiteto respondeu com correção a dois dos meus três achados sobre o
  `0d1c300`, ANTES de eu commitar (o `39-revisora.md` ainda era rascunho): o nono lugar em
  `valoresDoLance` procede como escrito. O achado do reaponte de `0d1c300` tinha DOIS erros
  meus: eu tinha comparado a âncora `Pendencias.md:2799` contra o prefixo "SB.rpc" (que casa
  com três chamadas diferentes) em vez da citação inteira (`jogador_registra`), o que me deu
  um erro de "mais de 8000 linhas" quando o certo é 50; e eu tinha chamado de "defeito de
  cálculo do script" o que é ordem de commit (documento commitado antes do código que ele
  descreve, mesma forma do `cd31b74`/`f4df8f7` da rodada 38). Não aceitei a correção de
  palavra: reconferi as duas coisas eu mesma contra as árvores (`git show 0d1c300:...` para a
  âncora certa em 10916 vs citada 10966 = 50; `git show e0326a9:...` para confirmar que
  `jogador_registra` está EXATAMENTE em 10966 no HEAD atual, batendo dígito a dígito com a
  citação, não "perto por sorte" como eu tinha escrito) antes de reescrever o veredito. As duas
  correções procedem. `alcanceInterpor` virou ESCALA (item próprio do Arquiteto), não CORRIGE
  nem PERGUNTA, por instrução explícita dele. `39-revisora.md` reescrito nos três pontos, indo
  commitar agora.
