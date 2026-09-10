# Progresso · levantamento do desfazer para encerrarVez/alternarAuto/esperarUmTick

Sinal de vida (ARQUITETO.md §1.2). Hora lida da máquina (`date +%H:%M`), nunca estimada.

- 18:51 (sha 2f05905, pós `git pull --rebase`) — começando. Só levantamento, nada de código
  ainda. Lendo `desfazer()` (grid.astro:10326-10347) e as três funções por completo antes de
  escrever qualquer resposta.
- 18:58 — `alternarAuto` (grid.astro:5857): lido por completo. Toggle simples de
  `combatentes.dados.auto`, sem chamada a `verificarEfeitos`, sem efeito colateral fora do
  repaint/log. Reversível, pequeno.
- 19:04 — `esperarUmTick` (grid.astro:8474): lido por completo. Muda `tick` E `acao` (via
  `gravarRelogio`) da PRÓPRIA peça só; não chama `verificarEfeitos`. Reversível, precisa
  guardar o objeto `acao` anterior inteiro (não só um escalar), do mesmo tamanho do padrão
  `mover` que já existe (guarda `{q,r}`).
- 19:11 — `encerrarVez` (grid.astro:5214): lido por completo, junto com `verificarEfeitos`
  (artes-grid-mesa.ts:1759). Achada a armadilha que o Arquiteto avisou: em modo Normal/PGR
  (não no Simultâneo), mudar o tick da peça da vez PODE mover `relogio()`, e
  `verificarEfeitos` então expira condições/Artes e aplica dano de Artes que terminaram — sem
  isso ficar registrado de um jeito que o `desfazer()` consiga desfazer. NÃO é reversível por
  natureza no caso geral. Escrevendo a resposta completa agora, sem construir nada.
