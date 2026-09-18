# Progresso · lote C (consertos do jogador novo)

Origem: `docs/simulacao/caixa/jogador-novo-prompt-executor.md` (commit `7dd1af3`), lista em
`docs/simulacao/caixa/jogador-novo-consertos.md`. Ordem: seção "Por onde começar".

- 2026-09-17 11:44 · início. Lido o prompt de entrega e o documento de consertos inteiro
  (1595 linhas).
- 2026-09-17 12:20 · C-31/C-32/C-33 escritos em combate.md (Preparo/Golpe/Recuperação, os dois
  sistemas de tempo, Rajada e o conserto da empunhadura dupla).
- 2026-09-17 12:25 · BLOQUEADO: árvore com 143 arquivos de outra frente (reorganização do
  Pendencias.md), validate vermelho por motivo alheio (combate-tempo-bench.html vs
  gen-bench-tempo.mjs dirty). Avisado o Arquiteto, sem mexer no que não é meu.
- 2026-09-17 12:44 · destravado (a outra frente commitou, 9afb21f..6cc6ea1). pull --rebase,
  validate verde, commit `77516b7`, push. FEITO marcado em jogador-novo-consertos.md
  (C-31, C-32, C-33).
- 2026-09-17 12:46 · conferido que C-01, C-03, C-04, C-05, C-06, C-49 e C-13 (metade) já estavam
  FEITO de rodadas anteriores; M-29 é item M (não meu). A ordem "Por onde começar" está esgotada
  exceto a metade de C-13 que é decisão do Arquiteto.
- 2026-09-17 12:52 · Lote 5 (glossário, C-42 a C-45) feito, commit `b03f4ab`.
- 2026-09-17 12:59 · Lote 8 (varredura de palavra) feito, mais C-20 achado no caminho (mesma
  string "Soak" da armadura Nenhuma). Achado: a fonte real do bestiário é `gen-bestiario.mjs`
  (não só `inimigos.json`), e há um segundo gerador a jusante (`gen-monsters.mjs` ->
  monsters.json/monsters-mesa.json). Os três regenerados. commit `dc4cd49`.
- 2026-09-17 13:00 · seguindo para o resto do Lote 2 (C-07 a C-30, exceto os já feitos) e o
  Lote 3 (C-34 a C-37), que não dependem de decisão de mesa nova.
- 2026-09-17 13:18 · fechado o resto do Lote 2 (C-07, C-08, C-09, C-11, C-14, C-15, C-16, C-17,
  C-18, C-19, C-20 já marcado, C-21, C-25, C-27, C-28, C-30) e o Lote 3 (C-34, C-35, C-36, C-37),
  mais C-97/C-98 do adendo. commit `7db14f1`, push feito, validate+typecheck verdes em cada
  passo. C-10, C-22, C-24, C-26, C-29, C-96 já estavam resolvidos de rodadas anteriores
  (marcado "JÁ RESOLVIDO" na origem, sem sha meu; achado depois que essa marcação do C-10
  estava errada, ver 14:31). C-99 parcialmente (a ambiguidade de nome não se confirma; o M-09
  continua aberto, não é meu). C-06 e C-04 e C-01/03/05/49 já vinham feitos. Achado no caminho:
  C-17 (Miúdo/Minúsculo) tinha convergido na direção OPOSTA à do item: quase todo o sistema já
  usa "Miúdo", só combate.md e o glossário atrasados; corrigidos. Resíduo não fechado: ~20
  "conceito" no bestiário (fonte de conversão D&D) ainda dizem "Minúsculo", registrado no item,
  fora de escopo de uma varredura de palavra.
- 2026-09-17 13:22 · humano tirou o teto de orçamento. Retomado a partir do fechamento
  (docs/simulacao/caixa/fechamento-lote-c-17set.md).
- 2026-09-17 14:04 · Lote 4 (C-38, C-40, C-41; C-39 já resolvido) fechado, commit `7e0cddf`.
- 2026-09-17 14:11 · Lote 6 (C-46, parte do C-47, C-48) fechado, commit `4496e4a` + `8ae6632`
  (sha nos marcadores). Os três itens de M-07 (Furtividade/Esquiva/Firula) ficam para trabalho
  próprio: são mecânica nova, não texto.
- 2026-09-17 14:31 · Lote 9 inteiro conferido (C-59 a C-95). ~20 já estavam resolvidos de
  rodadas anteriores (marcados JÁ RESOLVIDO/RESOLVIDO); ~18 fechados agora, commit `82313f5`.
  Achado importante no caminho: C-10 (o "2d6+3" da espada longa) NÃO estava fechado como eu
  tinha marcado às 13:18: uma segunda ocorrência sobrevivia no exemplo do Verme
  Púrpura/Tarrasque (mesmo parágrafo do C-91), e um `grep` deste ambiente relatou o número de
  linha errado, mascarando o achado na minha primeira conferência. Corrigido junto com o C-91,
  e a marcação do C-10 foi reescrita para não afirmar algo que eu não tinha, de fato, conferido
  direito. C-72 e C-87 ficaram NÃO FEITOS por decisão consciente (baixo retorno / risco de
  quebrar formatação gerada), registrado no próprio item.
- 2026-09-17 14:33 · lote C encerrado. Restam da lista original: C-12 e metade do C-13
  (decisão do Arquiteto), os três itens de M-07 dentro do C-47 (mecânica nova).
