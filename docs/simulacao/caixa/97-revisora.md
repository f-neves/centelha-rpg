# Rodada 97 · veredito

Pino: `172894d` (aviso), faixa `cdf2658..e2d4ab6`, `lore/` e o `11a4cff` (o §11 do meu contrato)
fora. Passo 0 conferido: toplevel é a worktree da Revisora, HEAD `172894d4f4a7`.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE. **A causa é uma só**, e **o erro estava
no laço, e não na mesa**. Há uma correção que devo ao meu veredito da 94, e o estado do CI vem
abaixo, pelo `§11`.

## CI (§11)

Workflow `Validar dados e regras`:

- **`457915e` (o trabalho):** run `35938769088`, **`completed / success`**, os 19 jobs verdes,
  inclusive **`Smoke · test-espelho`**. É o que o aviso diz.
- **`e2d4ab6` (o progresso, fim da faixa):** run `35939505278`, **ainda `in_progress` às 21:50**
  (hora da máquina). Os jobs que terminaram estão todos `success`, e o `Smoke · test-espelho` está entre
  eles. Faltava o `Smoke · test-grid`. O commit só toca `progresso-97.md`, então não há como ele
  mudar o resultado dos testes. A hora em que conferi de novo, antes de commitar, está no fim.
- **`cdf2658` (a base):** run `35937615737`, **`failure`, só no `Smoke · test-espelho`**. É o
  vermelho herdado de `6e8651e`, e é exatamente o que esta rodada consertou.

**Nenhum vermelho causado pela rodada, e nenhum herdado que continue.**

## 1 · A causa é uma só: a bissecção, refeita num clone

Montei um clone descartável da minha worktree no scratchpad (`node_modules` por junção, desfeita
antes de apagar o clone) e rodei o `test-espelho` de verdade, com o servidor e o Edge headless, em
quatro pontos:

| ponto | `test-espelho` | cenas com divergência |
|---|:--:|---|
| `6e8651e`, cru | **exit 1**, "7 falha(s)" | 1v1-encostado (20260903); 1v1-cacada, 4x4-media e 4x4-aberto (20260903 e 771107) |
| `6e8651e` + **uma linha** (`ajusteDados: 0` → `ajusteDados: (L.tierDe(c.pv, c.pvMax).penAcaoDados ?? 0)` em `motor.mjs`) | **exit 0**, "os dois laços concordam" | nenhuma |
| `cdf2658` (o topo, sem o conserto) | **exit 1**, as **mesmas 7** (comparadas com `cmp`) | as mesmas |
| `e2d4ab6` (com o conserto) | **exit 0** | nenhuma |

**As sete somem juntas com uma linha só, no próprio commit que as criou**, e voltam iguais no topo
sem o conserto. O primeiro sintoma é literalmente o dado a menos: no 1v1-encostado, lance 10,
`dados.acerto: mesa 3,4 · laço 3,4,6`. O resto (Vida, caído, Tick, Defesa perdida) é a batalha
seguindo por outro caminho depois disso. Escrevi a minha linha, que não é a da Executora, e chegou
ao mesmo verde.

## 2 · De que lado está o erro: no laço

**A §4f** (`leitura-de-novato-decisoes.md:372-410`) manda:

- item 1: `penAcaoDados` 0, 0, −1, −2, `null`;
- item 5: `ajAtq` e `ataqueAtual` somam esse campo ao `dados`, junto do Desgaste;
- item 6: o piso é condicional à base (com pelo menos 1 dado, nunca abaixo de 1; com 0 dado, não
  inventa um).

**A mesa faz as três:**

- `grid.astro:10243` devolve `dados: (c2.dados || 0) + (tf.penAcaoDados ?? 0)`;
- `combate.astro:884` faz o mesmo com `cd.dados`;
- os dois vão para `rolarExpr` por `ajusteDados`, via `resolverGolpe` (`lance.ts:182-187`, somado à
  penalidade do golpe do índice);
- `rolarExpr` aplica `dadosAjustados` (`rolagem.ts:79-81`), que é **exatamente** a fórmula do item 6.

**O piso e a soma com o Desgaste estão certos em produção.** O laço passava `ajusteDados: 0` e agora
passa o `penAcaoDados`, que é o lado que estava errado. **Nada a escalar na mesa.**

**Uma observação de alcance, e não defeito da rodada:** o laço passa só o ferimento. Ele não passa o
`c2.dados`/`c2.acao`/`c2.ataque` das condições nem o porte, que a mesa soma no mesmo `ajAtq`. O espelho
concorda porque as cenas dele não têm condição nem porte ligado. Se um dia tiverem, é a mesma forma
deste defeito, por outra coluna.

## 3 · O conserto mexe em número publicado? Não

- **Nenhum resultado do harness foi publicado depois de 22/09.** O último arquivo de
  `docs/simulacao/resultados/` é de `47aacec` (06/09), e `git log --since=2026-09-21` nessa pasta é
  vazio.
- Os dois commits entre `6e8651e` e a base que tocam o `ESTADO.md` (`888a196`, `5134d6c`) só
  reapontam citação de linha. Nenhum número medido entrou.
- **Nenhuma fixture ou teste do harness foi regravado:** em `scripts/`, a faixa só muda
  `sim/motor.mjs` (o laço), `gen-pendencias.mjs` e o teste dele. O `Dados e regras` do CI, que roda
  os testes do harness do `validate`, está verde em `457915e`.

## 4 · O `&&node`: o arquivo inteiro está limpo, e eu também fui cego a ele na 94

A conferência da Executora olhou o `validate`, o `smoke` e o `build`. **Eu olhei o `package.json`
inteiro**, as 20 entradas de `scripts`, procurando `&&` com qualquer coisa que não seja espaço colada
de um dos lados: **zero em todas**. Na base `cdf2658`, o mesmo teste acha exatamente um,
`gen-pendencias.mjs --check &&node`, no `validate`. As outras 17 entradas são de um comando só e não
têm `&&`.

**O que devo ao meu veredito da 94 (`§9` do contrato):** eu escrevi lá que "as 56 [partes do
`validate`] têm a forma `node scripts/<nome>.mjs [--check]`", e conferi quebrando no `&&` e aparando
os pedaços. É **a mesma cegueira** que a Executora descreve na conferência dela da 94. O `&&node`
colado passou pela minha conferência também. A conferência certa é a de agora: procurar o separador
colado, e não validar os pedaços depois de aparados.

## 5 · O item 0 e o resto

- **G12:** a raiz 4 agora é "o teto 4 da soma de Desgaste e ferimento", cita
  `vida-ferimentos-cura.md` e `2b08d7a`, e diz que o aberto é só o teto. O tema G ganhou a linha de
  estado, sem reescrever o item, e o título gerado continua sendo o do tema, que é o certo. **É o que
  o CORRIGE pedia.**
- **F7:** "libera dois itens de autoria". Certo.
- **`[ADIADO]` em qualquer ordem:** o gerador agora lê todos os colchetes seguidos. **Controle
  negativo:** o gerador da 96 (`cdf2658`) contra o teste novo dá **1 falha**, exatamente o caso
  `[DECIDIR] [ADIADO]`. O de hoje passa tudo, e o `--check` do índice real continua verde.

**Travessão**, lido nos arquivos: zero no `Pendencias.md`, no tema G, nos três scripts, no relato e
no progresso. Zero nas linhas acrescentadas pelo diff da faixa.

**Reconferência antes de commitar (21:50):** o run `35939505278` continuava `in_progress`, só com o
`Smoke · test-grid` rodando. O resultado final vai na mensagem ao Arquiteto.

## Limpeza

A bissecção rodou num clone no scratchpad. A junção do `node_modules` foi desfeita antes de apagar o
clone, e o `node_modules` da minha worktree continua lá. Na worktree não mexi em arquivo versionado
nenhum. `git status --short` ao fechar: só os meus dois arquivos da caixa.
