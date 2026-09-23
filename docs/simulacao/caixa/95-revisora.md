# Rodada 95 · veredito

Pino: `038e787` (aviso, `main` local, não empurrado), faixa `a74793d..0ecb0d3`, um commit. Passo 0
conferido: toplevel é a worktree da Revisora, HEAD `038e7877b6dc`.

**Veredito geral: PROCEDE, com um CORRIGE (pequeno, não bloqueia) e duas notas.** Nenhum BLOQUEIA.
Commitado e **não empurrado**.

## 1 · Os onze casos, refeitos por mim, sobre os temas de verdade

Não usei o tema de mentira do teste. Copiei o `Pendencias.md` e os doze temas reais para o
scratchpad e, **para cada caso**, fiz o mesmo roteiro: regerar o índice em dia, plantar a linha no fim
do tema A, rodar `--check` e depois regerar.

| caso | `--check` | regerar | a linha impressa | total depois |
|---|:--:|:--:|---|---|
| A90, aninhada com espaços | 1 | **1, recusa** | `A-arcano-artes.md:225  - [ ] **A90 · x**` | 249 162 4 83, índice não escrito |
| A89, aninhada com tab | 1 | **1, recusa** | `:225`, a linha | inalterado |
| A93, `[~]` em subitem | 1 | **1, recusa** | `:225`, a linha | inalterado |
| A94, `* [ ]` | 1 | **1, recusa** | `:225`, a linha | inalterado |
| A95, `- [ ]**` colado | 1 | **1, recusa** | `:225`, a linha | inalterado |
| A96, `- [?]` | 1 | **1, recusa** | `:225`, a linha | inalterado |
| A91, `- [X]` | 1 | 0 | | 250, +1 fechado |
| A92, sigla sem negrito + uma linha de parágrafo | 1 | 0 | | título "sem negrito", **sem** a linha seguinte |
| B97, sigla de outro tema | 1 | 0 | | acusada: "a sigla **B97** é de outro tema (B), e está contada no tema A" |
| A98, dentro de cerca | **0** | 0 | | inalterado: a cerca é pulada |
| a99, sigla minúscula | 1 | 0 | | acusada como "item sem sigla" |

**Os seis são recusados nos dois modos, com a linha impressa.** Os cinco lidos vão para o lugar certo.
No repositório, `--check` está verde, com **249, 162, 4 e 83** (8 anomalias). O `test-gen-pendencias`
passa 18 de 18.

## 2 · O teste tem ocasião, e o controle negativo falha pelo motivo certo

Li o `rodar()`: com `--check`, o índice é gerado a partir do tema **sem** a linha, e só depois a linha
entra. Isso vale para os seis casos de recusa, porque é o único lugar em que o teste passa `--check`.
Os seis também rodam sem `--check`, sobre índice vazio, e ali a asserção é a outra: o índice **não
pode** ter sido escrito (`!/Total/`). O gerador que ignora em silêncio escreveria o `Total`. Então as
duas metades têm ocasião.

**O controle negativo, refeito:** o gerador de `a74793d` (`git show a74793d:scripts/gen-pendencias.mjs`)
contra o teste novo dá **15 falhas**: as 12 dos seis casos (regerar e `--check`) e mais três (o título
da A92, a B97 não acusada, a A98 contada). O `--check` falha pelo motivo certo: com o índice gerado
antes, o gerador antigo acha o índice em dia e sai 0, e a asserção quer 1. As três que passam com o
antigo (base, `[X]`, `a99`) são as que o antigo já fazia certo.

## 3 · CORRIGE · uma cerca de código aberta e nunca fechada some com o resto do tema, calada

A cerca nova (`CERCA`, alternada a cada linha que começa com três crases ou três tis) é pulada, e isso
está certo quando ela fecha. **Quando não fecha, tudo o que vem depois dela no arquivo é pulado, sem
aviso.** Medi, na cópia dos temas reais:

- três crases numa linha sozinha **logo antes do A1** do tema A, e regerei: **exit 0**, "221 itens
  (144 abertos, 3 parciais, 74 fechados)", e a linha do tema A na contagem ficou **`| A | ... | 0 | 0 |
  0 | 0 |`**. Os 28 itens do A sumiram, e nada acusou;
- a mesma cerca no fim do arquivo, com dois itens depois: `--check` **0** e regerar **0**, os dois
  itens fora da conta.

É exatamente a forma que a rodada veio consertar ("uma caixa que o gerador não lê é uma caixa do tema
que o índice não conta", no próprio cabeçalho do gerador), só que por um caminho que ela mesma abriu.
Por isso é CORRIGE (`§8`). **Hoje nenhum tema está nesse estado:** o único com cerca é o `L`, com 6
linhas de cerca, número par, e a contagem não mudou de 249.

**Conserto:** se o arquivo termina com a cerca aberta, recusar como as outras, dizendo a linha em que
ela abriu. Mais uma asserção no teste, com a cerca aberta antes de um item.

## 4 · A junção do negrito

Um negrito que nunca fecha, seguido de cinco linhas de parágrafo e de um item: o título engoliu
**quatro linhas e parou** ("negrito aberto linha2 UM linha3 DOIS linha4 TRES linha5 QUATRO"), e o
item seguinte saiu inteiro e no lugar. O limite de quatro e as paradas (linha em branco, cabeçalho,
cara de caixa, cerca) seguram o estrago no título de um item só. A junção que ficou (só quando o
negrito foi aberto na primeira linha) não engole nada no caso da sigla sem negrito, que era o
problema. **Concordo com o desvio da letra do despacho.** Sem a junção, o L29 sai com o título "Sete".

## 5 · O teste novo nas listas

Está no `validate`, logo depois do gerador, e o `test-portoes` o conta ("os 63 testes estão no
`validate` ou no `smoke`"). **Controle:** tirei o teste do `validate` numa cópia do `package.json` e
rodei o `test-portoes`: vermelho, "1 teste(s) fora de todo portão e sem motivo escrito:
test-gen-pendencias.mjs". Restaurei (`git diff --quiet`). A matriz do CI é só do `smoke`, e o teste
não é de navegador, então não entra lá, e está certo.

## 6 · As três notas

- **Nota 1 (a causa não testada):** saiu "a marca de 17/09 veio de um grep que este ambiente encolhe",
  e entrou "Não se sabe por que foram marcados como feitos", com os três conferidos no fonte e o C-39
  no HTML, atribuído ao meu veredito. É o que a nota pedia.
- **Nota 2 (90 a 93):** as seções 1 e 2 agora dizem livro na 90, ajustes na 91 e na 92, o "ficar
  parado" na 91 e na 92, e a 93 como o `reapontar.mjs`. Certo. A seção 1 ganhou também "O teste de
  Frenesi não existe no motor", que é verdade (conferência 8 da 90).
- **Nota 3 (a seção 6):** "fecha a frente ... **no livro**", com o motor sem o teste. Certo.

Travessão, lido nos arquivos: zero no `Pendencias.md`, nos dois scripts, no relato e no progresso da
Executora.

## Notas novas

- **Nota A · falso positivo alto:** um item de lista que começa por um link de um caractere
  (`- [x](https://...)`) casa a `CARA_DE_CAIXA` e é recusado. Hoje não há nenhum nos temas. Falha
  para o lado barulhento, que é o lado certo, e a mensagem diz a linha. Registro só para quem um dia
  tropeçar nele.
- **Nota B:** a numerada `1. [ ]` também é recusada, com a linha. Certo, e o teste não a cobre (os
  onze casos não tinham numerada).

## Limpeza

Todos os casos rodaram em cópias no scratchpad, apagadas no fim. Na worktree, o único arquivo
versionado que mexi foi o `package.json`, no controle da seção 5, restaurado da cópia e conferido por
`git diff --quiet`. `git status --short` ao fechar: só os meus dois arquivos da caixa.
