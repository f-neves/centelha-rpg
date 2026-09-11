# Progresso · rodada 38 (a voz na caixa de conjurar, VOZ.md §10 decisões 9/10/11)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 03:46 — reancorada em `bc7a64f415bba8b0e43dab486c058bd265e7a39e` (passo 0 do §0 confirmado). Lendo o aviso agora.
- 03:47 — D38b conferido setter por setter, comparando o corpo de dentro do `onclick` antigo
  com a função nova, um a um (diff `f4df8f7` em `artes-grid-ui.ts`). Achado: a afirmação "sem
  mudar comportamento, mesma lógica, só movida" não é exata para OITO dos nove — `trocarEfeito`,
  `setMolde`, `setSolido`, `setFatias`, `setAbrir`, `setAngulo`, `setCurvatura` e `ajustarPar`
  ganharam uma checagem de validade que o `onclick` original não tinha (o clique nunca precisou,
  porque só apertava botão já renderizado a partir da lista válida; a voz precisa, porque a
  fala pode nomear qualquer coisa). `trocarArte` já tinha a validação (`if (!d) return`).
  `setPar` não tem equivalente de clique nenhum — é capacidade nova (valor absoluto, não
  incremento), não extração. Isto não é regressão (as validações só recusam entrada invalida,
  nunca mudam o caminho do clique, que sempre passa por valores já válidos) — é a afirmação do
  aviso que exagera a uniformidade. Rodando `test-arte-na-mesa.mjs`/`test-artes-grid.mjs` e o
  `test-grid.mjs` completo eu mesma para confirmar que nada quebrou de verdade.
- 03:48 — `test-arte-na-mesa.mjs` (33 asserções) e `test-artes-grid.mjs`: os dois exit 0,
  rodados por mim, confirmando o que o aviso já dizia. Amostra de 9 citações do reaponte
  (`cd31b74`) conferida contra o `HEAD` atual: todas batem. Decisões 9/10/11 conferidas em
  `camposDaMagia`/`aplicarNaMagia` (`grid.astro`): a decisão 13 ("nunca lista fixa") é
  respeitada de verdade — `camposDaMagia` consulta `dlg.querySelector('[data-molde]')` etc.
  para cada grupo, e não assume nada fixo; `aplicarNaMagia` só chama setters, nunca aperta
  Conjurar (decisão 9) nem simula clique (decisão 10). O D38a (longest-match/ambiguidade) e o
  `permitido` conferidos linha a linha em `comando-barra.ts:256-293` — batem exatamente com o
  que o aviso descreve. `__vozConjurar` (`artes-grid-ui.ts:489-502`) fecha sobre as variáveis
  certas do escopo de fora (`arteSel`/`efeitoSel`/`nivelArte`/`disponiveis`), nada preso a
  closure removida.
- 03:52 — rodei `test-grid.mjs` completo eu mesma (fui atrás do arquivo o tempo todo, nunca
  esperei notificação — confirmei liveness várias vezes por linhas crescendo no log). Exit 0,
  e acompanhei ao vivo as quatro cenas de voz passando: `cenaVozQuente` (o caminho quente),
  `cenaVozDitadoEOutra`, `cenaVozConsentimento` (as 13 originais reconstruídas, D38c) e
  `cenaVozMagia` (as 5 novas: Arte, Efeito composto, parâmetro, "efeito improviso" desmarca).
  `npm run validate`: exit 0. Escrevendo o veredito agora.
- 03:53 — veredito escrito (`38-revisora.md`): SEGUE, sem CORRIGE. D38b: não é regressão,
  mas a frase do aviso ("sem mudar comportamento nenhum") simplifica demais — oito dos nove
  setters ganharam validação nova que o clique não tinha. D38c: o teste NÃO detectaria de
  novo sozinho de forma confiável (o achado original só apareceu por acaso, tocando algo já
  destruído); sugeri uma checagem barata (`br.pages().length`) sem implementar. Commitando
  os dois arquivos juntos e empurrando agora. Terminado.
