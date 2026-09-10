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
- 18:57 — autorizado a construir (alternarAuto, esperarUmTick; encerrarVez confirma para
  sempre, por decisão registrada). Começando a construção agora.
- 18:59 — código escrito: `alternarAuto`/`esperarUmTick` logam `de`/`para` e ganharam ramo em
  `desfazer()` (restaura valor exato, não "faz o oposto"); `encerrarVez` ganhou o comentário
  explicando por que não é reversível e o que mudaria a resposta; `comando-barra.json` marca
  os dois com `desfaz: true` (param de confirmar na barra). Testando ao vivo agora, antes de
  rodar validate/commitar.
- 19:07 — testado ao vivo, tudo verde (exit 0). "esperar" pela barra: não confirma, escreve 1
  linha, desfazer perde a linha. "auto" pelo menu de uma criatura (mesma função `alternarAuto`
  que a barra chama — o desfazer não sabe nem se importa por onde entrou; a barra não achou
  daVez() como criatura em 6 tentativas nesta bancada específica, achado de instrumento, não do
  código): escreve "Criatura 6 entra em modo automático", desfazer perde a linha. Par negativo:
  "encerrar" continua abrindo confirmação de verdade (com Cancelar), não erro de permissão.
  Indo para validate/commit/rodada.
- 19:08 — `npm run validate` FALHOU (exit 1, lido antes de reportar): 22 citações envelheceram
  em `ESTADO.md`/`Pendencias.md` (meu comentário novo em `encerrarVez` é longo, ~30 linhas, e
  deslocou bastante coisa). Árvore de `ESTADO.md`/`Pendencias.md` está limpa (sem diff do
  Arquiteto agora) — parado para avisar antes de decidir sozinha se reaponto ou espero.
