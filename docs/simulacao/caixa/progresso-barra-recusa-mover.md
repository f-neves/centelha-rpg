# Progresso · barra recusa "mover" quando não dá (ARQUITETO.md §1.2)

- 14:05 — começando. Escopo: `executarComando` (grid.astro) passa a checar, antes de chamar
  `porNoMapa`, três coisas para o verbo "mover" — casa ocupada, mesma casa, casa fora do
  tabuleiro — e recusa com `uiErro`, sem tocar em `porNoMapa`. Lendo `ocupadoPor`/`dentro`/
  `TOKENS`/ARENA cols/rows antes de escrever.
- 14:12 — escrito. Três checagens em `executarComando` (antes do confirma/despacha): fora do
  tabuleiro (`dentro`), mesma casa (`TOKENS[cid]`), ocupada (`ocupadoPor`) — nenhuma toca em
  `porNoMapa`. Escrevendo o teste (3 casos novos) antes de comitar.
- 14:20 — os 3 casos pedidos passaram, com a mensagem exata: "mover B2" de novo (mesma casa)
  → "Herói 1 já está em B2"; "mover Z99" (fora do tabuleiro) → "Z99 está fora do tabuleiro
  (24×16)"; "mover B2" ocupado por outra peça → "B2 já está ocupada". Achado à parte no MEU
  teste (não no app): o caso antigo de "auto" estava com falso positivo (a bancada não tinha
  `tempo=simultaneo`, então "auto" recusava por PERMISSÃO, não por confirmação — a mensagem de
  recusa por acaso também cita "auto"). Corrigido o teste, rodando de novo agora para fechar
  limpo antes de comitar.
- 14:24 — rodada limpa, exit 0, todos os 9 casos passaram (incluindo os 3 pedidos, com a
  mensagem certa). Indo para `npm run validate` e depois `npm run rodada`.
- 14:27 — `npm run validate` FALHOU (exit 1, lido antes de reportar): 10 citações de código em
  `ESTADO.md`/`Pendencias.md` envelheceram porque minhas edições em `grid.astro` deslocaram as
  âncoras (mesma classe do que o Arquiteto já corrigiu uma vez nesta sessão). Parado aqui,
  avisando antes de tocar em arquivo que não é meu.
- 14:33 — o Arquiteto já tinha reapontado as duas citações (`Pendencias.md:2819/2820`) antes de
  eu chegar lá para conferir. `npm run validate` verde agora (exit 0, reconferido). Commitando
  e abrindo a rodada.
- 14:36 — commit `9fb409f` feito (só meus 2 arquivos, `git status` confere). `npm run rodada`
  recusa abrir: árvore suja com os documentos do Arquiteto (Pendencias.md, ARQUITETO.md,
  CONTEXTO.md, ESTADO.md, PASSAGEM.md, README.md) ainda não commitados, mais o `.7z` de antes
  que voltou. Não é meu, não vou tocar — avisando e esperando.
- 14:42 — meu commit (`9fb409f`) já tinha entrado antes das duas últimas mensagens do Arquiteto
  chegarem. Não toco em `grid.astro` de novo, como pedido. Comitando só este arquivo de
  progresso e seguindo para `npm run rodada`.
