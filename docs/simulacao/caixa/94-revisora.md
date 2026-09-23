# Rodada 94 · veredito

Pino: `526d197` (aviso, no `main` LOCAL, não empurrado), faixa `818b8b6..541258b`, um commit, os três
do Cartógrafo (`c37e34f`, `a7e2b6c`, `eb0ef43`) fora. Passo 0 conferido: toplevel é a worktree da
Revisora, HEAD `526d1972b88a`.

**Veredito geral: PROCEDE, com um CORRIGE pequeno (não bloqueia) no gerador e três notas.** Nenhum
BLOQUEIA. Veredito commitado e **não empurrado**, como o aviso pede.

## 1 · O gerador sabe dizer "não sei"? Só em parte: CORRIGE

Montei uma cópia de `Pendencias.md` e de `docs/pendencias/` no scratchpad, plantei onze casos no fim
do tema A e rodei `node scripts/gen-pendencias.mjs --raiz <cópia>`. Antes de plantar, o `--check`
estava verde. Depois de plantar ficou vermelho, e regerei:

| caso plantado | o que o gerador fez |
|---|---|
| `  - [ ] **A90 · ...**` (caixa aninhada, dois espaços) | **sumiu da contagem, sem acusar** |
| caixa aninhada com tab (`A89`) | **sumiu, sem acusar** |
| `  - [~] **A93 · ...**` (parcial dentro de subitem) | **sumiu, sem acusar** (e o texto dele foi parar no título do item de cima, ver abaixo) |
| `* [ ] **A94 · ...**` (marcador asterisco) | **sumiu, sem acusar** |
| `- [ ]**A95 · ...**` (sem espaço depois da caixa) | **sumiu, sem acusar** |
| `- [?] **A96 · ...**` (estado desconhecido) | **sumiu, sem acusar** |
| `- [X] **A91 · ...**` (x maiúsculo) | contado como fechado. Certo |
| `- [ ] A92 · ...` (sigla sem negrito) | contado, com a sigla certa. Mas o título engoliu a linha seguinte (o `[~] A93`), porque a junção de linhas espera fechar um `**` que não existe |
| `- [ ] **B97 · ...**` no arquivo A | contado no tema A, **sem acusar** a sigla de outro tema |
| item dentro de cerca de código | **contado como item real** |
| `- [ ] **a99 · ...**` (sigla minúscula) | acusado como "item sem sigla". Certo |

A contagem subiu exatamente 4 abertos e 1 fechado (A91, A92, B97, A98, a99). Os seis casos da primeira
metade da tabela não entraram na conta nem na lista de anomalias.

**Por que é CORRIGE, e não observação (`§8` do meu contrato):** o próprio `Pendencias.md:11-14`
promete que "o `npm run validate` fica vermelho se elas divergirem dos arquivos de tema", e o rodapé
gerado diz "Contado pelas caixas de cada arquivo de tema". Uma caixa aninhada é uma caixa do tema que
a contagem não reflete, e o `validate` continua verde. É o zero ambíguo (`§5`) na forma "omite em
silêncio".

**O tamanho do problema hoje, medido:** varri os doze temas atrás de toda linha com cara de caixa
(`^\s*([-*+]|\d+[.)])\s*\[.?\]`) que o `ITEM` do gerador não casa, e atrás de item dentro de cerca
de código. **Zero dos dois.** A afirmação da Executora ("nenhuma caixa aninhada") está certa para
hoje. O defeito é de amanhã, quando o formato derivar.

**Conserto, pequeno:** acusar, na lista de anomalias, toda linha com cara de caixa que o `ITEM` não
casa, e ignorar (ou acusar) o que estiver dentro de cerca de código. De quebra dá para acusar a sigla
cuja letra não é a do arquivo, e parar a junção de título quando a linha seguinte for outra caixa,
mesmo indentada.

## 2 · O ensaio dos três sentidos, refeito

Numa cópia recém-feita, com `--check`:

| passo | exit |
|---|:--:|
| base | 0 |
| troquei uma caixa `[ ]` por `[x]` no tema B, sem regerar | **1**, "fora de sincronia" |
| regerei | **0** |
| editei à mão, entre os marcadores da lista de itens, um "aberto" para "fechado" | **1** |
| regerei, e editei um título de seção FORA dos marcadores | **0**, certo: a direção é escrita à mão |
| apaguei o marcador de fim `<!-- /gen:pendencias-itens -->` | **1**, com `marcador ... não encontrado` |

Os dois vermelhos que o aviso pediu acontecem, e o terceiro sentido também (regerar volta ao verde
sem tocar no gerador). No repositório, `--check` está verde: 249 itens, 162 abertos, 4 parciais, 83
fechados, 8 anomalias. O gerador está no `validate` (posição 9 das 56 partes), e as 56 têm a forma
`node scripts/<nome>.mjs [--check]`. O espaço que faltava depois do `test-reapontar` (defeito da 93,
`5134d6c`) está consertado.

## 3 · As sete caixas fechadas: todas provam o item, e não algo parecido

Li o bloco inteiro de cada item e conferi a prova contra o que o item pede:

- **A22 (a de antes):** a outra A22, "AS DUAS, em 2026-08-19", está `[x]` no mesmo arquivo e responde
  à mesma pergunta. Fechar a duplicata é o certo.
- **B13:** o item pede o `+2` fixo dobrado no pool `0d6`. O `888a196` põe em
  `test-rolada-manual.mjs` exatamente o caso `roladaManual('6', '0d6 +3', 3)` com total 6, e o caso
  vizinho com `extraDados` (6c). Rodei o teste: 18 asserções verdes.
- **D1:** o item pede matar a `banda` (campo e schema) e mostrar o modificador ao lado da Técnica.
  `grep '"banda"' tecnicas.json` dá 0, e `content.config.ts` não a tem. `ArvoreTecnicas.astro:133`
  mostra o `badge mod` do `modOf`. O que sobrou é a classe CSS `badge banda` no rótulo de nível, só
  nome de estilo.
- **E9:** o item pede a cláusula saindo de `aparencia.nota`. Lida hoje, a nota diz que os
  Antecedentes "não somam a jogada nenhuma: eles descontam passos do Neutro". `b903a26` toca
  `regras.json`.
- **E10:** o item pede marcar no registro da M-09 o que caiu. O `fb9310c` acrescenta à seção da M-09
  o bloco "O MECANISMO DESTA ENTRADA FOI SUBSTITUÍDO", citando o E10.
- **K12:** o item pede escolher entre pool e soma única. A §14 escolheu o pool, e a régua veio na
  §16. É `[DECIDIR]`, e a decisão existe.
- **K13:** o item pede a Pressão cobrada uma vez. O item entrou em `7911d1c` e o conserto em
  `b6af150`, os dois de 19/08. O `lib-tempo.mjs` de hoje incrementa a guarda por `incP`, que vale
  `R.pressao` só com `pressaoDupla: true` e 1 no padrão. O cabeçalho cita o K13.

## 4 · As afirmações de estado das seções 1, 2, 3 e 5, contra o disco

- **M-05 (`7db14f1`):** a mensagem do commit traz "C-34/C-35: o capítulo I ganha a linha que faltava
  (soma 1 = total fixo 2, sem dado, e por quê)". O diff põe em `coracao-do-sistema.md` a nota de que a
  soma 1 nunca supera 5, e a saída que a M-05 decidiu. **Confere.** O cabeçalho da seção M-05 no
  registro não diz FEITO, e é por isso que o `CONTEXTO.md` a dava como esperando.
- **M-42 (`2520b5d`, veredito `21304e2`):** o cabeçalho da seção diz "FEITO em 18/09/2026
  (`2520b5d`)", e o `21304e2` é o PROCEDE dela. **Confere.**
- **Item 9 de Relações Sociais (`6509801`, `a6e7e41`):** "Põe a Régua de Relação e o cortejo no
  `regras.json`" e o PROCEDE da 86. `acoes.longevidadeFirula.intervaloBaseDias` é 8. **Confere.**
- **C-22, C-39, C-61, "marcados como feitos e o defeito continua":** os três confirmados.
  `relacoes-sociais.md:134` ainda diz "começa no Tick 0". `artes/regras.astro:274` ainda tem
  `{MOLDES.aura}`, e `arcano.moldes.aura` ainda é objeto. **No HTML gerado**, o
  `dist/artes/regras/index.html` do meu build da 91 (a página e esse campo não mudaram desde então)
  contém `object Object`. `qual-sistema.md` usa "Esp." duas vezes, e a palavra "Especialidade" não
  aparece no arquivo. O C-39, que a Executora não conferiu no HTML, fica conferido.
- **47 M e 104 C:** no registro há ids M-1 a M-47, 47 distintos (44 com cabeçalho próprio; M-25, 26 e
  37 só mencionados). Nos três arquivos de conserto há C-1 a C-104, sem buraco. **Confere.** As
  subdivisões (32 feitas, 90 fechados etc.) não recontei.
- **O dossiê:** está escrito como leitura datada ("lido em 23/09/2026 às 20:22: nenhuma marca
  gravada"), e não como fato permanente. Certo.
- **Migrações 1 a 39 e a 33 rodada em 13-14/09:** o `CONTEXTO.md` diz isso com a mesma data
  ("Lido direto no banco em 14/09/2026"). Confere contra a fonte citada. Contra o banco, não se
  confere daqui.
- **J4 "com o defeito já consertado pelo B12":** o J4 é o mesmo defeito (fraqueza e resistência
  lidas no topo em vez de em `combate`), e o `20daeea` é "Conserta B12: fraqueza/resistência lida do
  lugar errado no Grid". Confere. A seção 5 mantém o J4 aberto porque ele é `[DECIDIR]`, e é coerente.

**Nota 1 · uma causa escrita como fato e não testada.** A seção 2 (`Pendencias.md:79-80`) diz que "a
marca de 17/09 veio de um `grep` que este ambiente encolhe". **Testei hoje:** o `grep` deste ambiente,
pelo caminho normal, acha tanto o `{MOLDES.aura}` quanto o "Tick 0". Então a explicação não se
reproduz. Não investiguei de onde veio o "= 0" de 17/09, e não ofereço outra causa. A frase devia
dizer "não se sabe por quê", ou sair.

**Nota 2 · as rodadas 90 a 93 como rodadas do Frenesi.** A seção 1 ("Regras decididas e no livro
(rodadas 90 a 93, as quatro com PROCEDE)") e a seção 2 ("O livro entrou nas rodadas 90 a 93") contam
a 93 na frente do Frenesi. A 93 foi o `reapontar.mjs`, e não tocou o livro. As quatro têm PROCEDE, e
isso está certo. O que não está é o livro ter entrado nelas: entrou na 90 a 92.

## 5 · A contagem velha contra a nova

Contei as caixas dos temas nos dois shas, direto do `git show`:

| | `[ ]` | `[~]` | `[x]` | abertos + parciais |
|---|:--:|:--:|:--:|:--:|
| `818b8b6` | 169 | 4 | 76 | **173**, o "173 abertos" do índice velho, que contava o `[~]` como aberto |
| `541258b` | 162 | 4 | 83 | **166** |

173 − 7 = 166, e 76 + 7 = 83. **Fecha com as sete caixas e as quatro `[~]`**, sem sobra.

## 6 · Travessão, e a seção 6

Travessão, lido nos arquivos por Python, e não pelo diff: zero no `Pendencias.md`, no
`gen-pendencias.mjs`, nos cinco temas tocados e no relato. Zero também nas linhas acrescentadas ao
diff dos temas.

**A seção 6 (a ordem proposta)** não afirma nada falso sobre o estado. O K4 está destravado pelo K13.
A ordem de agosto de fato apontava a C1 como "a decisão que destrava mais coisa (A11, C2, C3, F3)",
e a nova cita A11, C2 e F3: deixar o C3 de fora é coerente com a seção 5, que o dá como esvaziado
pela M-10. Os três C e as quatro M batem com a seção 2. **Nota 3:** o item 1 diz que a §17 "fecha a
frente do Frenesi e do teste de Virtude". Isso é verdade para o texto, mas a própria seção 2 lembra
que o motor não tem o teste de Frenesi. "Fecha" vale para o livro.

## Limpeza

Tudo foi feito em cópias no scratchpad. Na worktree não mexi em arquivo versionado nenhum.
`git status --short` ao fechar: só os meus dois arquivos da caixa.
