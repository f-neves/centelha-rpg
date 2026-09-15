# Progresso da revisora · rodada 59 dela, rodada 75 do projeto

Reancorada em `0b8148431b1bc3774d85c76c7a5883b3af5184df` (o sha do aviso), conferido por
`git rev-parse HEAD` na worktree `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`.
Árvore limpa antes e depois do checkout. Hora lida da máquina.

- 17:31 · reancoragem terminada em `0b81484`, vinda de `d181d8b`. Passo 0 do contrato fechado:
  toplevel confere, sha confere com o aviso.
- 17:32 · lido o aviso `75-aviso.md` inteiro, e o relatório da rodada (`progresso-75.md`).
  Faixa `206fcef..8d2787b`, três commits, seis arquivos.
- 17:32 · lidos os diffs pelo caminho que não encolhe (`rtk proxy git diff`): `regras.json` +
  `condicoes.json`, os dois capítulos, e o bloco novo do `validate-data.mjs`.
- 17:35 · Q4 MEDIDA e a afirmação dela confere: `ctx.gravarVida` é `curarPv`
  (`grid.astro:2828` · `gravarVida: curarPv`), e `curarPv` (`:2686`) só tem teto
  (`Math.min`), nunca piso. `varrerDanoContinuo` (`artes-grid-mesa.ts:2104`) chama com delta
  negativo. Esquema não prende (`pv_atual integer` sem check, `migracao-2.sql:135`).
- 17:36 · Q3: falsificação feita e DESFEITA no mesmo fôlego (contrato §2). Troquei o −17 do
  callout do Bram por −99 e o portão ficou VERDE, `EXIT=0`. O extrator acha 2 pares dos 3
  "morre em" do capítulo. Arquivo restaurado, `diff` vazio conferido.
- 17:38 · Q1 varrida por mim, insensível a caixa (`letal|letais|letalidade`), em `src/`,
  `scripts/`, `supabase/` e nos `.md` fora de `docs/simulacao`. SOBROU UM TERCEIRO:
  `src/pages/mesa/referencia.astro:170` publica "Letal a cada 6 Ticks" na prosa fixa, cinco
  linhas acima de `{SANG.nota}` (`:175`), que ela corrigiu para "dano". A mesma seção da tela
  da mesa mostra as duas regras.
- 17:42 · Q3 fechada: refiz DOIS dos cinco vermelhos (`limiteArredonda` alto, 1 erro no PV 37;
  `limiteDivisor` 4, 3 erros), mensagens conferem. Os dois desfeitos, `diff` vazio.
- 17:42 · Q2 conferida contra o DADO (`dano.soakNatural` + `centelhaNoSoak: 1` + `dano.nota`),
  e li `combate.md:96-140` inteiro, não o hunk. O conserto está certo.
- 17:42 · Q5: `git diff --name-only` da faixa não toca `src/pages`, `src/lib` nem `supabase/`.
  Refiz a varredura de `pv_atual`: sobram `criaturas.astro:350` (cria cheio) e `mesa.astro`
  (só lê), nenhum baixa Vida. A conta dela de oito pontos fica de pé.
- 17:42 · li os dois commits FORA da faixa. `19afbbc` decide sobre as duas regras que ela
  listou, e herda a citação errada do `caido`. Achado.
- 17:45 · veredito escrito e commitado (`7039045`), e o PUSH FOI RECUSADO: `origin/main`
  andou dois commits (`2ac58ef`, `19afbbc`) depois do sha do aviso, então `HEAD:main` não é
  fast-forward. Não forcei (contrato §7.2). Para o commit não ficar sem referência em detached
  HEAD, criei o ramo LOCAL `revisora-59` apontando para ele. `HEAD` continua onde o aviso
  mandou, e eu não reancoro por conta própria.
