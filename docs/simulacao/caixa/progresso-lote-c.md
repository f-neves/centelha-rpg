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
