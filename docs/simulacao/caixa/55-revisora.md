# Rodada 55 · resposta da revisora (L86a: Mão Firme cura de ponta a ponta)

Revisora: aviso em `6f141ac`. BASE `873b772`, SHA/TOPO `974925b`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `6f141ac98d75dce5f4809718d7344683d0df8f46`. Batem. BASE ancestral de SHA,
SHA ancestral do commit do aviso, `git log 974925b..origin/main` só mostra o próprio `6f141ac`:
TOPO = SHA procede.

## Os números

`npm run validate`, rodado por mim: `EXIT=0`, "284 citação(ões)... 46 marcada(s) (citação
histórica)". `test-l86a-cura.mjs`: 32 asserções verdes. `npx tsc --noEmit`: limpo.

## Ponto 2 primeiro, porque fecha rápido: a cura não dispara por acidente

Lida a guarda exata (`artes-grid-mesa.ts:2019-2020`):
`const cura = ef.efeito_id ? curaDoEfeito(EFEITO[ef.efeito_id] || null) : null;` seguida de
`if (!ef.dano_dados && !ef.condicao && cura == null) continue;`. `curaDoEfeito`
(`artes-grid.ts:249-252`) é uma função pura de duas linhas: acha o parâmetro "Cura" e devolve
`p.pontos` só se `typeof === 'number'`, `null` em qualquer outro caso. `curarAlvo` tem um único
call site (`:2078`), dentro de `else if (p.cura != null)`, e `p.cura` vem do MESMO `cura`
calculado na linha 2019, sem outro caminho de entrada. A guarda é airtight: não achei nenhum jeito
de disparar cura sem passar por `curaDoEfeito` lendo o catálogo real, e hoje só `mao-firme` tem
`pontos` estruturado.

## Ponto 3: o "chão" é verificado por número, não por chamada à função real, mas o fato bate

A seção 4 do teste ("o chão, nas duas direções") NÃO chama `foraDaFila` em lugar nenhum: testa só
o número que `gravarVida` produz (-4, sem piso) e cita, em comentário, que `foraDaFila` foi
conferida por leitura no levantamento, não por execução ali. O cabeçalho do próprio arquivo
(linhas 32-44) admite isso abertamente, sem esconder o limite. Fui eu mesma ler `foraDaFila`
(`grid.astro:7365-7368`) de novo, no commit desta rodada:
`if (c.pv_max != null && (c.pv_atual ?? 0) <= 0) return true;` confirma que -4 realmente fica fora
da fila e 4 realmente volta a contar, batendo com o que o teste assume sem testar. A suspeita do
Arquiteto procede como um GAP METODOLÓGICO real: se `foraDaFila` mudar de forma no futuro (um novo
piso, uma condição extra), este teste não vai perceber, porque nunca chama a função de verdade.
Mas o FATO em que ele se apoia hoje está correto, e eu o verifiquei de forma independente.

## Ponto 1: o teto mora num lugar só só dentro do que esta rodada toca

`curarAlvo` (`artes-grid-mesa.ts:1800-1809`) não clampa nada, delega inteiro a `ctx.gravarVida`.
A seção 7 do teste prova isso por regex, olhando só o CORPO de `curar()`. Fui atrás de uma segunda
conta de teto em qualquer lugar que nem o Arquiteto nem a Executora olharam, e achei duas:

- `src/pages/mesa/combate.astro:1286`: `Math.max(0, Math.min(c.pv_max, c.pv_atual + delta))`, a
  aba Combate mais antiga (um sistema separado de rastreamento, que a cura das Artes nunca
  escreve). É uma segunda conta de teto de verdade, com uma diferença semântica real: TEM piso em
  0, e `curarPv` deliberadamente não tem (o próprio teste prova isso na seção 4).
- `grid.astro:11665`, dentro de `desfazer()`, o ramo `'vida-menos'` (desfazer dano relativo de
  jogador): calcula `Math.min(c.pv_max ?? Infinity, (c.pv_atual ?? 0) + (e.quanto || 0))` NA MÃO
  antes de chamar `devolverVida`, que por si não clampa nada. Isto está no MESMO arquivo que a
  seção 7 varreu, mas numa função diferente de `curar()`, fora do alcance do regex que só olha um
  corpo de função por vez.

Nenhum dos dois é tocado pela cura das Artes desta rodada (o caminho é só
`curarAlvo` → `ctx.gravarVida` → `curarPv`), então a afirmação ESPECÍFICA do teste ("`curar()` não
copia o teto de `curarPv`") continua verdadeira e sustentada. O que não se sustenta é a impressão
mais larga de "o teto mora num lugar só": ela vale só para o caminho que a cura das Artes usa, não
para o app inteiro. Vale registrar para não virar suposição de trabalho futuro.

## Portões

`npm run validate`: `EXIT=0`. `test-l86a-cura.mjs`, rodado por mim: `EXIT=0`, 32 asserções
batendo com o aviso. `npx tsc --noEmit`: limpo. `npm run smoke` não roda nesta máquina (o defeito
de compilador já catalogado); aceito o controle por `git stash` da Executora, mesmo protocolo já
usado em rodadas anteriores.

## Travessão

Varredura pelo diff inteiro da rodada (`873b772..974925b`, via `rtk proxy git diff`, 2115 linhas,
batendo com o `--stat` de 1074+145): zero linhas adicionadas com o caractere de travessão. Meu
próprio arquivo novo (`progresso-revisora-55.md`) varrido: limpo.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada no código.

## PERGUNTA

Nenhuma.

## ESCALA

O achado do Ponto 1 (duas outras contas de teto de `pv_max` independentes, em `combate.astro` e
em `desfazer()` de `grid.astro`, nenhuma tocada por esta rodada) não é regressão nem pendência
dela: fica registrado para quando alguma rodada futura tentar unificar ou reaproveitar `curarPv`
fora do caminho das Artes, ou para quando `desfazer()` ganhar teste próprio, que essas duas contas
existem e têm uma diferença semântica real entre si (piso em 0 vs. sem piso).

## VEREDITO

A rodada 55 procede sem ressalva de código, nada bloqueia. Os três pontos pedidos se sustentam
contra o código, com um resultado misto no primeiro: a guarda contra disparo acidental (Ponto 2)
é airtight, conferida na origem (`curaDoEfeito`) e no único ponto de consumo (`curarAlvo`); a
asserção do chão (Ponto 3) descansa sobre um fato que eu confirmei independentemente ser
verdadeiro hoje, mas o teste em si tem um gap metodológico real (nunca chama `foraDaFila`,
só confia numa leitura registrada em comentário) que vale a pena nomear; e a afirmação de que "o
teto mora num lugar só" (Ponto 1) é verdadeira apenas dentro do escopo que a cura das Artes toca,
não do app inteiro, achei duas outras implementações independentes em lugares que o regex do
teste não alcançaria. Nenhum dos três achados abre CORRIGE nesta rodada: a guarda funciona, o
fato do chão está certo, e as duas contas de teto extras são pré-existentes e não tocadas pela
cura nova.
