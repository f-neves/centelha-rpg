# Rodada 96 · veredito

Pino: `b910219` (aviso, `main` local, não empurrado), faixa `d980856..0de13b8`, um commit. Passo 0
conferido: toplevel é a worktree da Revisora, HEAD `b910219ce98c`.

**Veredito geral: PROCEDE, com um CORRIGE de uma frase (seção 6, o G12) e três notas.** Nenhum
BLOQUEIA. Commitado e **não empurrado**.

## 1 · 52 contra 61: a conta FECHA, item por item

**Primeiro reproduzi a medida do humano.** Emulei o `grep` dele, que conta toda linha com a etiqueta
exata, em qualquer estado de caixa, nos temas A a K, e rodei em `818b8b6` (o estado do dia em que ele
mediu: a tabela dele ainda tem E com 9 abertos, antes do E9 e do E10 fecharem na 94). **A emulação
bate célula por célula com a tabela do despacho**: A 19/13/5/4/0, B 10/4/6/0/0, e assim até K
18/13/3/0/1. Então sei o que a medida dele contou, e não só o total.

**O AUTOR bate: 7 e 7** (A7, A13, A24, A15 e três do F). A diferença é toda do DECIDIR, 54 contra 45.
Casei cada linha do `grep` com o item em que ela cai e com o que o gerador diz dele hoje:

| | itens | DECIDIR |
|---|---|---:|
| a medida do humano | | **54** |
| já fechados no dia, e o `grep` pega a caixa `[x]` | A21, a A22 da decisão ("AS DUAS") | −2 |
| abertos no dia, fechados com prova depois | A22 (a entrada de antes, na 94), K12 (94), J4 (96) | −3 |
| adiados nesta rodada, fora das somas | D3, D6, H4, I8, J10 | −5 |
| sem sigla, cai em "outra marca" | a linha de fechamento do `test-grid` (tema J) | −1 |
| etiqueta composta, que o `grep` exato não pega | C1, C2 ("[DECIDIR, BLOQUEADO ...]") | +2 |
| **o gerador** | | **45** |

54 − 2 − 3 − 5 − 1 + 2 = 45. Com os 7 de AUTOR, **52**. Não sobra nada: é a mesma lista de itens
vista por duas regras, e cada item tem a sua causa.

**Um reparo na atribuição do relato, e não no total.** O relato diz que "o A dele dá 13 DECIDIR,
porque conta a A21 e as duas A22, que estão fechadas". No dia da medida, **uma das duas A22 estava
aberta**, e só fechou na revisão da 94. Então ela é da causa 3 do relato (fechou desde a medida), e
não da causa 1 (o `grep` contou fechado). A conta final não muda. Mas o humano vai ler essa
explicação primeiro, e a tabela acima é a versão que fecha sem ressalva. **Ela está só no relato**: o
`Pendencias.md` não traz nem o 52 nem o 61, e a seção 0 diz a coisa sem número à mão, o que está
certo.

**A leitura dele continua de pé:** nos temas A a K há 95 abertos e parciais, 88 fora dos adiados, e
52 são DECIDIR ou AUTOR. É mais da metade das duas formas de contar.

## 2 · O ADIADO

**Sai das somas e continua visível.** Na tabela gerada, os sete adiados estão na coluna Adiados e em
nenhuma coluna de tipo. Na lista, aparecem como "aberto, ADIADO", com a etiqueta de verdade ao lado.
**Um `[ADIADO] [DECIDIR]` conta só em Adiados**, e não em DECIDIR (D3, D6, H4, I8, J10 são
exatamente isso). Nenhuma das cinco decisões-raiz está adiada. A C3 está, e a seção 6 a cita como
consequência da Tradição, o que é coerente.

**Plantei variações numa cópia dos temas reais** (tema A, uma de cada vez):

| linha plantada | o que o gerador fez |
|---|---|
| `[ADIADO] [DECIDIR]` | Adiados +1, DECIDIR igual. Certo |
| `[ADIADO em 23/09] [DECIDIR]` | igual ao de cima. Certo |
| `[ADIADO]` sozinho | Adiados +1, sem marca. Certo |
| `- [x]` com `[ADIADO]` | fechado, fora de Adiados. Certo |
| **`[DECIDIR] [ADIADO]`** (ordem trocada) | **DECIDIR +1, Adiados igual, e o `[ADIADO]` some da lista**: o título tira os colchetes e a coluna mostra só "DECIDIR" |
| `[Adiado]` (minúsculo) | "outra marca", e a palavra também some do título |

**Nota 1:** na ordem trocada, o adiamento se perde calado. O erro vai para o lado conservador (o item
continua contado como trabalho), então não é a omissão das rodadas 94 e 95, e não o cobro. Mas a
marca some da lista, e quem escreveu não fica sabendo. Uma anomalia na lista ("`[ADIADO]` depois de
outra etiqueta não é lido") resolveria.

## 3 · O J4, pelo código e ponto por ponto da §8.2

A `Auditoria_Tecnica.md` §8.2(a) nomeia três leitores no topo da criatura: `artes-grid-mesa.ts`
(linhas 971 e 1006, na época) e `cardCriaturaHTML`. Hoje:

- os dois `danoNoAlvo` de `artes-grid-mesa.ts` (`:1862` e `:1896`) recebem
  `...elementosCombate(m)` (`:1865`, `:1899`);
- o card da mesa, em `mesa-bestiario.ts:330`, lê `elementosCombate(m)`;
- `elementosCombate` (`mesa-core.ts:115-116`) lê `m?.combate?.fraquezas` e `resistencias`.

Busquei `fraquezas|resistencias` em todo `.ts`/`.astro`/`.js`/`.mjs` de `src/`. **Nenhum leitor no
topo da criatura.** Os outros acertos são o `BestaCard` (já lê `i.combate`), o editor (escreve),
`criaturas.astro:279` (passa por `elementosCombate`) e o `danoNoAlvo`, que recebe por parâmetro.
**Fechado pelo código, e não por semelhança.** O J4 é `[DECIDIR]`, e o que ele pedia era a decisão de
mexer no número de mesa. O `20daeea` a tomou ao consertar o B12, e a linha de prova diz isso.

## 4 · O I14

`git grep` por `\bI5\b` e `\bI14\b` no repositório inteiro, menos `lore/` (código, documentos e
caixa): toda menção a I5 fora das caixas da 94 a 96 é do **editor de cenário**
(`02-projeto-harness.md:1427` e `:1742`) ou de **outra lista** (`05-fechamento.md`, o instrumento da
simulação). **Ninguém cita o anel de Vida como I5.** Só o tema, o índice gerado e a caixa citam o I14.

## 5 · O L52

**A data:** o próprio L52 diz "em 08/09/2026 às ~19h55 (commit `05c4a92`)". O despacho dizia 10/09, e
a Executora está certa. **A régua:** recontei `05c4a92:Pendencias.md` pelas duas regras, o `grep` da
primeira medida (`^- \[ \]`, `^- \[x\]`, `^- \[~\]`) e o `ITEM` do gerador de hoje. **As duas dão 120,
63 e 4**, 187 no total. A segunda medida (249, 161, 4, 84, com 7 dos abertos adiados) é a da tabela
gerada, que conferi verde pelo `--check`. É a mesma régua, aplicada agora aos doze arquivos. Sem
percentual, como pedido.

## 6 · O teste da cerca

**Tem ocasião:** o índice é gerado a partir do tema com o A1 limpo, e só depois a cerca entra antes
do A1. A asserção do `--check` exige o exit 1, a mensagem "cerca de código aberta" e a linha 3. A de
regerar exige o exit 1.

**Controle negativo, refeito:** com o gerador da 95 (`d980856:scripts/gen-pendencias.mjs`), o teste
dá **4 falhas**, as duas da cerca e as duas do ADIADO. Na cerca, o `--check` do gerador antigo também
sai 1: o A1 some e o índice fica fora de sincronia. Então o exit sozinho não discriminaria. **O que
discrimina é a mensagem e a linha, que a asserção exige**, e o "regerar recusa", em que o antigo sai
0. Falha pelo motivo certo. Com o gerador de hoje, o teste fica verde e o `--check` do repositório
também (249, 161, 4, 84; 7 anomalias). O `1. [ ]` entrou como caso.

## 7 · A seção 6: CORRIGE numa frase, e uma nota

**CORRIGE · o G12.** A seção 6, decisão-raiz 4: "**G12 · Desgaste e ferimento não se conhecem.** A
única que já produz dívida em mesa: o mestre arbitra hoje." **O livro diz outra coisa desde 22/09**
(`2b08d7a`). Em `vida-ferimentos-cura.md:50`: "Um personagem Grave ou Crítico **e** com Desgaste ao
mesmo tempo [...] tem as duas fontes cortando do **mesmo** pool, somando direto, com o piso comum em
1d6". A própria seção 5 do `Pendencias.md` (linha 199) lista o G12 como suspeito por isso mesmo. O que
continua aberto é mais estreito: se o **teto 4** do Desgaste vale para a soma. Então "não se conhecem"
e "o mestre arbitra" afirmam sobre o estado uma coisa que o capítulo publicado contradiz, e isso é o
que o aviso pediu que eu medisse. **Conserto:** reescrever a linha da raiz como "o teto 4 vale para a
soma do Desgaste com o ferimento?", apontando o capítulo. A frase vem do título do tema e do despacho,
e não da Executora. O mérito de ser raiz continua sendo seu.

**Nota 2 · "uma decisão libera três itens de autoria".** A F7 trava a F5 e a F6, pelo próprio texto
da F7, e a F7 é `[DECIDIR]`. São **dois** itens de autoria liberados. "Três" só fecha contando a
própria F7, que não é de autoria. A frase vem do despacho.

**O 47:** 47 das 309 criaturas de `monsters.json` têm "sagrado" em `combate.fraquezas`, e 47 das 100
entradas de `elementos-bestiario.json`. **Confere nos dois lugares.** O dente do E8 (15 pontos em 3
intervalos, 14 em 6) está no texto do item, como a seção diz.

## 8 · Travessão

Lido nos arquivos: zero no `Pendencias.md`, nos dois scripts, no relato, no progresso e em C, D, H, I
e J. **Nota 3:** o `L-simulacao-simultaneo.md` tem 10 linhas com travessão (4251, 4277, 4323, 4324,
4328...), **todas antigas**: nenhuma linha acrescentada pelo diff da faixa tem travessão. Fica
registrado para quem varrer o tema L.

## Limpeza

Todas as plantas rodaram em cópias no scratchpad, apagadas no fim. Na worktree não mexi em arquivo
versionado nenhum. `git status --short` ao fechar: só os meus dois arquivos da caixa.
