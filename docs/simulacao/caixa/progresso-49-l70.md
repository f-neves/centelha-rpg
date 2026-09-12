# Progresso · rodada 49 (L70: a conferência de ocupação migra para quem GRAVA posição)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por CAMINHO levantado, não por item,
no instante em que ele é encontrado e classificado, hora lida da máquina
(`date +%H:%M`).

- 22:05 (sha fb410f4, 0 à frente/atrás de `origin/main`): começando. A primeira
  entrega NÃO é código, é uma lista: todo caminho que grava posição (q/r, token de
  hex, movimentação de peça, `update` que carrega posição), varrendo o GESTO e não
  o nome de função (lição da rodada 40: dois lugares escaparam por terem a conta
  copiada à mão em vez de chamar a função). Depois de trazer a lista, PARAR e
  esperar antes de escrever qualquer linha de código. Duas exigências de desenho
  para quando o código vier: (1) a função que grava devolve POR QUÊ recusou, sem
  texto de recusa escrito à mão em nenhum chamador (mesmo desenho do L68); (2) todo
  caminho existente exercitado antes e depois da mudança.

- 22:12 · CAMINHO 1: `gravarToken(cid, q, r, em)`, `grid.astro:2660`. A função de
  MAIS BAIXO NÍVEL que grava em `arena_tokens`: mestre escreve direto
  (`SB.from('arena_tokens').upsert(...)`), jogador cai na RPC `jogador_mover`. Ela
  mesma NÃO confere ocupação, confia em quem chama. 2 chamadores diretos:
  movimento automático do Tick (`:5775`) e `porNoMapa` (`:7201`).

- 22:12 · CAMINHO 2: o movimento automático do relógio de Tick, `grid.astro:5715
  a 5780` (sem função nomeada, é um trecho dentro do avanço do combate
  simultâneo). Usa `caminharHex(pos, mira, passos, paraEm, (h) =>
  ocupadoPor(h.q, h.r, c.id))` para computar o destino já sem ocupação, com um
  SEGUNDO crivo próprio (`casaExata`, `:5766`) para o caso de cerco. Confere
  ocupação, mas com lógica PRÓPRIA, sem passar por `porNoMapa`.

- 22:13 · CAMINHO 3: `porNoMapa(cid, q, r, registrar, motivo)`, `grid.astro:7188`.
  A função "põe a peça no mapa": confere `ocupadoPor(q, r, cid)` (`:7192`) e
  MESMA-CASA (`:7194`), mas RECUSA EM SILÊNCIO nos dois casos (só `return`, sem
  motivo nenhum devolvido) · é o padrão L66 que a regra 1 do desenho existe para
  acabar. 9 chamadores, todos em `grid.astro`: arrasto-e-solta base (`:6776`),
  `moverSimultaneo` (`:6088` fase comprometida, `:6134` escolha "direto"),
  `perguntarForaDaVez` (`:6195` corrigir, `:6203` fora de hora),
  `agirForaDeHora` (`:6497`), `despacharComando` (voz/texto, `:8812`), e
  `desfazer` (`:11243` desfazer "mover", `:11244` desfazer "tirar").

- 22:13 · CAMINHO 3a, DENTRO do caminho 3: `prosseguirComComando` (voz/texto),
  `grid.astro:8826`, DUPLICA a checagem antes de chamar `despacharComando` →
  `porNoMapa`, porque o silêncio do caminho 3 não basta para quem não tem o sinal
  visual do arrasto. Três checagens próprias, com mensagem: fora do tabuleiro
  (`dentro()`, `:8837`), já está nessa casa (`:8841`), já está ocupada
  (`ocupadoPor`, `:8844`). O PRÓPRIO CÓDIGO JÁ NOMEIA O DEFEITO no comentário de
  `:8830-8835`: "`porNoMapa` cala mudo... checa ANTES de chamar, em vez de mexer
  em `porNoMapa`". Achado sem precisar de ferramenta: o comentário confessa.

- 22:14 · CAMINHO 4, O ESCAPADO: `deslocar(ctx, c, plano, palco)`, em
  `src/lib/artes-grid-mesa.ts:1114` (Artes: empurrar, arrastar, teleportar).
  Escreve DIRETO em `arena_tokens` (`:1139`, `ctx.SB.from('arena_tokens').upsert`)
  e no `ctx.tokens` compartilhado (`:1143`, é o MESMO objeto que `TOKENS` de
  `grid.astro`, passado por referência em `ctxArtes()`, `grid.astro:2738`). NÃO
  chama `gravarToken`, `porNoMapa` nem `ocupadoPor` · nenhuma conferência de
  ocupação, nem para mestre nem para jogador (o jogador cai na mesma RPC
  `jogador_mover` via `sbDoJogador()`, que também nada confere). É a mesma
  classe de achado da rodada 40: escapa de busca por nome porque a conta do
  destino (`afastar()`, `:1164`) é calculada à mão, sem tocar em nenhuma das
  funções que uma busca por nome acharia.

- 22:15 · CAMINHO 5 (servidor): RPC `public.jogador_mover(p_arena, p_comb, p_q,
  p_r)`, `supabase/migracao-22.sql:77`. É o ÚNICO caminho de escrita do lado do
  banco para o papel jogador (chamado tanto pelo Caminho 1 quanto pelo Caminho 4,
  via `sbDoJogador()`). Confere mesa, dono e permissão, NÃO confere ocupação
  nenhuma. Confiar inteiramente no cliente aqui é o mesmo risco que a migração 35
  já ensinou noutro contexto (ver `CATALOGO.md`, "a garantia certa sobre o eixo
  errado"): quem chamar a RPC direto (ou um cliente futuro) grava em cima de
  qualquer peça.

- 22:15 · CAMINHO 6 (banco, mestre): a escrita direta `SB.from('arena_tokens')
  .upsert(...)` usada pelo mestre em DOIS lugares (dentro do Caminho 1,
  `grid.astro:2661`, e dentro do Caminho 4, `artes-grid-mesa.ts:1139`). A policy
  de RLS (`supabase/migracao-15.sql:104-107`) confere só QUEM (é mestre da mesa),
  nunca O QUÊ: não existe constraint nem trigger no banco que impeça duas linhas
  de `arena_tokens` com o mesmo `(arena_id, q, r)`. A ocupação é INTEIRAMENTE
  convenção do cliente, nunca garantida pelo banco, para nenhum dos dois papéis.

  LEVANTAMENTO FEITO. Seis caminhos (quatro no cliente, dois no banco), sendo o
  Caminho 4 o único que hoje não confere ocupação NENHUMA e o Caminho 3 o único
  com recusa em silêncio (padrão L66). Trazendo a lista ao Arquiteto e parando
  aqui, sem escrever código nenhum, como pedido.

- 22:22 · Arquiteto respondeu: os itens 6 e 7 do levantamento não são caminhos
  separados, são os DOIS BACKENDS de `gravarToken`; conserto num só
  estrangulamento (`gravarToken`) cobre os sete lugares, sem tocar nos nove
  chamadores de `porNoMapa`. Também trouxe o achado que meu levantamento não
  cobriu: DIVIDIR HEXÁGONO É LEGAL (`podeDividir`, miúdo com miúdo ou alguém no
  chão), então a checagem certa é `ocupadoPor` inteiro, não "hexágono livre?".
  Trava no banco fica para depois (dado do cliente: PV, condições, porte),
  decisão do humano, não desta rodada. Escopo fechado: só `gravarToken`.

- 22:30 · CÓDIGO ESCRITO. `gravarToken` (`grid.astro:2660`) agora confere
  `ocupadoPor(q, r, cid)` primeiro e devolve `{ data: null, error: { message:
  \`${nomeHex(q, r)} já está ocupada.\` } }` sem tocar em nenhum backend quando
  ocupado. `porNoMapa` (`:7205`) perdeu a própria checagem de `ocupadoPor`
  (comentário no lugar explicando por quê): o bloco de `error` que já existia
  (desfaz o otimista, mostra `uiErro`) passou a ser o MESMO caminho para a
  recusa por ocupação. Não toquei nos nove chamadores nem no `prosseguirComComando`
  (a checagem duplicada dele continua, redundante mas inofensiva; fica para
  quem decidir simplificá-la, fora do escopo desta rodada).

- 22:35 · CENA E TESTE NOVOS. `?cena=ocupacao` em `scripts/mesa-mock.mjs`: `bq`
  parada em `q:6,r:5` (Médio, de pé) e `mv` só na LISTA (fora do mapa), de
  propósito: soltar um token que JÁ ESTÁ no mapa em cima de outro é lido como
  ATAQUE (`grid.astro:6761`, achado ao vivo: minha primeira tentativa arrastando
  `mv` já posicionada abriu `decl-dlg`, não a recusa), e só uma peça ENTRANDO
  pela lista cai direto em `porNoMapa`. `scripts/test-l70-ocupacao-mesa.mjs`:
  solta `mv` em cima de `bq` (recusa, com `.ui-dlg.perigo` e mensagem "I6 já
  está ocupada", posição continua fora do mapa, nada logado) e depois numa casa
  vazia (entra normalmente, log "entrou em"). Registrado em `smoke`
  (`package.json`) e na matriz do CI (`.github/workflows/validate.yml`).

  QUATRO CONTROLES: (1) o teste passa com o fix, verde; (2) `test-l67`,
  `test-l68`, `test-l77` e `test-grid-simultaneo` (79 asserções) continuam
  verdes, os nove chamadores de `porNoMapa` e o movimento automático do Tick
  sem regressão; (3) NEGATIVO: `git stash` só de `grid.astro` (o código, não a
  cena) e rodei o teste novo contra o código VELHO: a posição não mudou e nada
  foi logado (a recusa aconteceu), mas a caixa de erro NÃO abriu: o teste falhou
  exatamente nessa asserção, provando que ele pega recusa muda e não passaria
  se o L70 virasse L66; `git stash pop` devolveu o fix. (4) reconferido o teste
  novo verde de novo depois do pop.

- 22:39 · BLOQUEIO, PARANDO ANTES DE COMMITAR. `npm run validate` (e portanto o
  gancho de pre-commit) está VERMELHO: meu `gravarToken` cresceu +25 linhas
  líquidas perto do topo do script de `grid.astro` (comentário + refatoração), e
  isso desloca TODA citação de linha abaixo dele. `test-procedencia.mjs` achou
  66 âncoras envelhecidas: 65 apontando para `grid.astro` (`ESTADO.md` 6,
  `Pendencias.md` 34, `CONJURACAO.md` 4, `Grid_Mobile.md` 5, `CATALOGO.md` 2,
  `VOZ.md` 8, `CONTEXTO.md` 2, `Auditoria_Tecnica.md` 1) e 1 para
  `mesa-mock.mjs` (`Pendencias.md:3783`, da minha própria cena nova). NÃO toquei
  em nenhum desses documentos: não são meu território, e a escala (66, contra 1
  ou 2 nas rodadas anteriores) é grande demais para eu decidir sozinha o que
  fazer. Todo o código está no disco, testado e funcionando; só falta poder
  commitar. Trazendo ao Arquiteto antes de qualquer coisa.
- 22:45 · Arquiteto reapontou (72 citações, não 66: o reapontador move pelo
  mapa de hunks, e achou 6 a mais que o portão não tinha acusado, todas
  apontando para a linha errada com âncora fraca demais para notar, três delas
  a palavra `if`). Não commitou os documentos de propósito: pediu para eu
  commitar o código primeiro. `npm run validate` confirmado verde (saída 0)
  antes de commitar. COMMIT FEITO: `5a6bb93`, pathspec em `grid.astro`,
  `mesa-mock.mjs`, `test-l70-ocupacao-mesa.mjs`, `package.json`,
  `.github/workflows/validate.yml` e este arquivo, nada dos documentos do
  Arquiteto (continuam modificados e não commitados na árvore, como estavam).
  Push confirmado (`89f6e00..5a6bb93`), `git rev-list --count
  origin/main..HEAD` = 0. Avisando o Arquiteto para ele commitar os
  documentos. Preparando o aviso, com os dois achados que ele pediu para
  registrar: o contorno do arrasto (achado, não solução) e a taxa 6/71 do
  reaponte.
- 22:50 · CORREÇÃO: escrevi "72 citações, não 66" acima, e misturei dois
  números do Arquiteto que medem coisas diferentes. O certo, como ele
  corrigiu: 71 citações ao `grid.astro` se moveram de lugar; o portão acusou
  65; 6 passaram verdes apontando para a linha errada (71 − 65, a taxa de
  âncora fraca do `L65`); o reapontador contou 72 porque uma faixa `NNN-MMM`
  entra como uma citação só para ele e foi contada diferente na minha medida.
  O par que importa é 71 contra 65; o 72 é detalhe de instrumento. Corrigido
  na tabela de procedência do aviso antes de enviar. Documentos do Arquiteto
  commitados e empurrados: `e468182`. Árvore limpa fora do meu rascunho de
  aviso. Enviando.
