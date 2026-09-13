# Progresso · revisão da rodada 57

Sinal de vida, hora lida de `date +%H:%M`. Worktree já reancorada pelo
Arquiteto em `5f30fea` antes desta sessão começar.

- 21:19: HEAD/toplevel conferidos em `5f30fea`, tree limpa. BASE `b82ae80`
  é ancestral de SHA `972d11b`; `git log 972d11b..origin/main` só mostra
  o próprio `5f30fea`, TOPO = SHA procede. `git log b82ae80..972d11b` tem
  cinco commits: `3eeb8fd` (meu CORRIGE da rodada 56, já avisado por
  mensagem, mas agora dentro da janela formal, vou reconferir) +
  `9e28abe`/`bfcc519`/`6d8935f` (Arquiteto, só documento, §8 novo do
  contrato) + `972d11b` (L64 desta rodada). Lido `57-executora.md`,
  `progresso-57-l64.md` e `progresso-56b-gravarefeito.md` inteiros.
  Orçamento liberado pelo humano: revisão completa, sem cortar. Quatro
  pontos pedidos, na ordem do desconforto: (1) campo removido
  (`velocidade` em `fora-do-tempo`), caçar aritmética sem guarda que
  produziria NaN; (2) a varredura pode ter parado cedo, procurar um
  TERCEIRO leitor em mesa-mock.mjs/ficha/bestiário/grid.astro; (3) ler
  o código de verdade nos dois pontos de "conferência fraca" (modEfeito,
  avancarTick) e confirmar que fazem o que a asserção textual afirma;
  (4) reproduzir o teto6 à mão e confirmar que fica vermelho de verdade,
  desfazendo antes de reportar.
- 21:21: `npm run validate` verde, 287 citações, bate. `test-l64-
  velocidade.mjs`: contei manualmente 23 chamadas de ok/eq no código-
  fonte (incluindo o laço ×3), bate exato com o aviso; rodei, EXIT:0.
  `test-artes-grid.mjs`: verde, a asserção reescrita
  (`foraDoTempo.naoAge === true`/`velocidade == null`) confirmada contra
  o catálogo atual. `test-l86b-acelerar-cura.mjs`: 27/27 (agora em
  escopo, inclui a cena 4 do CORRIGE 3eeb8fd).
- 21:22: Ponto 1. `Grep` por `.velocidade\b` em todo `src/`: a maioria
  é velocidade de ARMA (`RESUMO/ra/FX.velocidade`, outro conceito,
  confirmado pelo contexto de cada ocorrência). Os únicos leitores de
  `Condicao.velocidade` são `somarCondicoes` (`mesa-core.ts:192`,
  `c.velocidade || 0`, guardado), `condChipHTML` (`:225`, truthy-check,
  sem aritmética), `modEfeito` (`referencia.astro:75`, truthy-check) e
  `avancarTick` (`combate.astro:1411`, `cd.velocidade || 0`, duplamente
  guardado pela marca `naoAge` antes). `Grep` por "-99" em `src/`: zero
  ocorrências em código vivo, só em comentários explicando a história.
  Sem NaN, sem comparação morta contra a sentinela antiga.
- 21:23: Ponto 2. Checado `scripts/mesa-mock.mjs`: todas as ocorrências
  de "velocidade" são velocidade de arma (`classe: 'haste'/'leve'`),
  zero leitura de `naoAge`/condição. `ficha-engine.ts`: zero ocorrência
  de `condChipHTML`/`modEfeito`/`naoAge`. Conferido que `condChipHTML`
  tem MAIS chamadores do que os dois que o levantamento nomeou
  (`mesa.astro:360`, `combate.astro:1128`): `mesa-condicoes.ts:78,93`
  também chama, e por isso o diálogo de condições do PRÓPRIO Grid (que
  importa `mesa-condicoes.ts`) já mostra "não age" corretamente, sem
  precisar de código novo ali, porque é a MESMA função testada de
  verdade. Não é um terceiro leitor perdido, é o mesmo leitor com mais
  um chamador, que herda o conserto de graça.
- 21:24: Ponto 3. Lido `modEfeito` inteiro (`referencia.astro:62-80`):
  `if (c.naoAge) p.push('não age'); else if (c.velocidade) ...` bate
  exatamente com o que o regex do teste cobra, confirmado por leitura
  direta, não só pelo match de texto. Lido `avancarTick` inteiro
  (`combate.astro:1399-1419`): `cd = somarCondicoes(...)` na linha 1403,
  `const novo = cd.naoAge ? antes : Math.max(0, antes + Math.max(0,
  quanto + (cd.velocidade || 0)));` na 1411, bate exato. As duas
  conferências fracas descrevem código real, não um comentário morto.
- 21:25: Ponto 4. Inseri à mão `t.velocidade = Math.max(-6, Math.min(6,
  t.velocidade));` no fim do laço de `somarCondicoes` (antes do
  `return`). Rodei `test-l64-velocidade.mjs`: 1 falha, exatamente a
  asserção do teto6 (esperado 10, achou 6), as outras 22 continuaram
  verdes. Desfiz a régua na hora, `git diff --stat` confirmado limpo,
  rodei de novo: 0 falhas. Também falsifiquei o CORRIGE 3eeb8fd por
  conta própria: troquei `enviada` por `linha` na linha do `ATIVOS.push`
  de `gravarEfeito`; `test-l86b-acelerar-cura.mjs` quebrou com exceção
  não tratada ("uiEscolher chamado sem resposta preparada"), a mesma
  forma que o progresso da Executora descreve. Desfeito na hora,
  `git diff --stat` limpo, 27/27 de novo.
- 21:25: D03 (as 4 citações marcadas à mão como históricas) conferidas
  por leitura direta em `Pendencias.md` (as duas âncoras citadas, linhas
  ~3924 e ~3951): o texto antigo que elas citam (`const novo = Math.max`,
  `foraDoTempo.velocidade <= -50`) genuinamente não existe mais no
  código corrente, e a gramática ao redor foi ajustada para passado
  ("era", "afirmava"). Marca histórica correta aqui, ao contrário do meu
  próprio achado na rodada 56 (onde a marca teria sido errada): a
  diferença é que ali o fato citado continuava vivo, aqui genuinamente
  não está mais.
- 21:25: varredura de travessão pelo diff inteiro (`b82ae80..972d11b`,
  via `rtk proxy git diff`, 1164 linhas batendo com `--stat` de
  660+88): zero linhas adicionadas com "—". Meu arquivo novo varrido:
  limpo. Escrevendo o veredito.
