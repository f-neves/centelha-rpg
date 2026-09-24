# Rodada 97 · Executora · o espelho de motor vermelho desde 22/09, e o CORRIGE da 96

Despacho: `docs/simulacao/caixa/97-despacho.md` (`cdf2658`). Progresso com as horas lidas da máquina
em `progresso-97.md`.

## ENTROU

| arquivo | o que mudou nele |
|---|---|
| `scripts/sim/motor.mjs` | o laço passa o `penAcaoDados` do ferimento do atacante (−1d6 em Grave, −2d6 em Crítico) como `ajusteDados` do acerto, como a mesa |
| `scripts/gen-pendencias.mjs` | `[ADIADO]` lido em qualquer ordem entre os colchetes |
| `scripts/test-gen-pendencias.mjs` | o caso `[DECIDIR] [ADIADO]` |
| `package.json` | o espaço que faltava depois do `gen-pendencias.mjs --check` (defeito meu, da 94) |
| `Pendencias.md` | a raiz 4 (G12) e a nota da F7 corrigidas; `[ADIADO]` "em qualquer ordem" |
| `docs/pendencias/G-acoes-sistema.md` | uma linha de estado no G12 |
| `docs/simulacao/caixa/progresso-97.md`, `97-executora.md` | progresso e relato |

### 1 · O espelho: a causa, commit a commit

Rodei o `test-espelho` localmente em três pontos, e mais um controle. Os dois commits antigos rodaram
numa worktree destacada no scratchpad, com o `node_modules` por junção. A worktree foi removida
depois, com a junção desfeita antes, e o `node_modules` real ficou intacto.

| commit | resultado |
|---|---|
| `0934136` (a última verde do CI) | **exit 0**, 14 de 14 cenas sem divergência |
| `6e8651e` | **exit 1**, 7 falhas: 1v1-encostado numa semente, 1v1-cacada, 4x4-media e 4x4-aberto nas duas |
| `6e8651e` + só a linha do `ajusteDados` trocada | **exit 0** |
| topo (`cdf2658`), sem conserto | **exit 1**, as mesmas 7 |
| topo, com o conserto | **exit 0**, 14 de 14 |

**Uma causa só, nascida em `6e8651e`.** Esse commit fez a mesa somar o `tierDe(...).penAcaoDados` do
atacante ao `dados` do acerto: no `ajAtq` do `grid.astro` e no `ataqueAtual` do `combate.astro`. O
laço do harness (`resolverContra`, em `scripts/sim/motor.mjs`) continuou passando
`ajusteDados: 0`. Resultado: em todo golpe de quem estava Grave ou Crítico, a mesa rolava um ou dois
dados a menos que o laço.

**O resto das divergências é consequência:** Vida, caído, Pressão e Defesa perdida. Depois do primeiro
golpe diferente, as duas batalhas seguem por caminhos diferentes. Por campo, em `6e8651e`: `pv` 31,
`chao` 11, `total`, `errouPor`, `danoBruto` e `defesaPerdida` 5 cada, `acao.pressao` 4, `veredito`
e `absorcao` 3, `dados.acerto` e `dados.dano` 2, `danoLiquido` e `tick` 1.

**Os commits seguintes do mesmo dia não abriram segunda divergência:** `888a196`, `4450055` e o piso
condicional de `rolarExpr`. O topo com o conserto fica verde. O piso mora em `rolarExpr`, que os dois
lados chamam.

### 2 · De que lado está o erro: no LAÇO

A §4f de `leitura-de-novato-decisoes.md` manda duas coisas:

- item 1: o `Tier` ganha `penAcaoDados`, com 0, 0, −1, −2, `null`;
- item 5: o `ajAtq` e o `ataqueAtual` somam esse campo ao `dados`, junto do Desgaste.

A mesa faz exatamente isso. **A mesa está certa**, e o laço se alinhou. **Para quem joga hoje, nada
muda:** a mesa já rola o dado a menos em Grave e Crítico desde 22/09, e é a regra.

### 3 · A prova

- `test-espelho` local: exit 0, 14 de 14, no topo com o conserto.
- `npm run validate`: exit 0. Inclui os testes do harness que moram nele (`test-bandeiras`,
  `test-cobertura-lib`), e o `test-lance`, que é o oráculo da conta compartilhada.
- **No CI:** o resultado do job `Smoke · test-espelho` no push deste commit vai para a mensagem ao
  Arquiteto, lido no `gh run`. Um commit não pode conter o próprio resultado de CI.

### 4 · Por que ninguém viu, numa linha

O vermelho só existia no CI, e ninguém lia o CI. Teria aparecido em horas se **o gancho, ou a
abertura de toda rodada, lesse o estado do último `gh run` do `main` e recusasse seguir com job
vermelho**. Não construí: passa pelo `CATALOGO.md` antes. Também não é o que o `test-portoes` já faz:
ele avisa que o teste "nunca rodou aqui", e não que está vermelho lá.

### 0 · O CORRIGE da 96, e as notas

- **G12:** a raiz 4 da seção 6 dizia "não se conhecem, o mestre arbitra hoje". Isso é falso desde
  `2b08d7a` (22/09): `vida-ferimentos-cura.md` diz mesmo pool, somando direto, com piso 1d6. Agora a
  raiz diz que o aberto é só o teto 4 da soma. **A frase vinha do próprio tema G** ("Enquanto não
  sair, o Mestre está arbitrando"). Lá entrou uma linha de estado, sem reescrever o item.
- **F7:** libera **dois** itens de autoria, e não três.
- **A ordem das marcas:** o gerador lia `[ADIADO]` só antes da outra etiqueta. Com `[DECIDIR]
  [ADIADO]` ele parava no primeiro colchete e perdia o adiamento calado. Agora lê todos os colchetes
  seguidos. O caso entrou no teste: **o gerador da 96 falha nele, o novo passa.** O índice real sai
  idêntico (`--check` verde).

## PRECISA DE MIM

Nada.

## QUEBROU

Nada nesta rodada. **Um defeito meu, anterior, achado agora:** o `package.json` tinha
"`gen-pendencias.mjs --check &&node`", colado desde a rodada 94. É o mesmo tropeço do espaço aparado
que a 94 registrou. Funcionava no `cmd`, e **a minha conferência de então ("as partes têm a forma
`node scripts/<nome>.mjs`") era cega a ele**: ela quebrava a linha no `&&` e aparava os pedaços.
Consertado. A conferência nova conta `&&` colado dos dois lados, e deu zero no `validate`, no `smoke`
e no `build`.

## BLOQUEADO

Nada.
