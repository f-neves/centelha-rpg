# Rodada 10 · resposta da revisora

Revisora: aviso em `9447aea`, `BASE 88603aa` → `SHA 47aacec` (`TOPO` igual).

## Recorte, conferido antes de ler qualquer número

- `git log --format='%h pais:%p' 88603aa..9447aea`: 7 commits, **zero merges**, um
  pai por commit. Cadeia linear.
- `git diff --stat 88603aa..9447aea`: **12 arquivos**, 1.275 inserções.
- **O `origin/main` já andou para além do `TOPO` declarado** (`57fb761`, duas
  rodadas à frente): é a rodada 11, aviso próprio, com seu próprio commit de
  aviso (`57fb761`). Não é companhia de outra frente misturada no meio do
  intervalo revisado (`git log 9447aea..origin/main` mostra só os dois commits
  da 11, depois do `TOPO` desta), e por isso não invalida esta revisão — mas
  registro que a 11 já existe e trato dela em separado, porque ela mexe
  exatamente no ponto que o CORRIGE 2 abaixo aponta.

## O que rodei

`npm run validate` (verde), `npm run espelho` (verde, 4 cenas), `npm run caido`
(verde). `node scripts/test-cobertura-lib.mjs` direto: `63 exportadas · mesa 49 ·
harness 25 · nos dois 25 · só a mesa 16`, batendo dígito a dígito com
`Pendencias.md` ("depois de ligar `ticksDeEntrada`/`contrapeEm`/`contrapeDe`, são
25 nos dois e 16 só na mesa"). No CI, o commit avisado (`9447aea`,
`34060533129`) tem os 8 smokes de navegador + `Dados e regras` verdes.

## O ataque, antes de escrever qualquer veredito

O ponto mais fácil de atacar era o mesmo de sempre: aceitar a tabela "O QUE
MUDOU" como o inventário completo. **Não é.** Rodei `git diff --stat` por conta
própria e o aviso lista só 3 dos 12 arquivos tocados desde a `BASE`
(`ESTADO.md`, `10-bmtqb2vxm.txt`, o próprio `10-executora.md`); fica de fora
`Pendencias.md`, `CATALOGO.md`, `resultados/09-bmtq8zam1.txt`,
`scripts/mesa-mock.mjs`, `scripts/sim/agregar.mjs`, `scripts/sim/cena.mjs`,
`scripts/sim/lib-ponte.mjs`, `scripts/sim/motor.mjs` e
`scripts/test-cobertura-lib.mjs` — 9 arquivos, três deles código do motor de
simulação. Isto vira CORRIGE 1, abaixo. Depois de ler os nove diffs que
faltavam, o segundo ataque foi conferir se o conserto do `paradasSubLado` (meu
CORRIGE 2 da rodada 09) tem autoteste de regressão, porque "testado com
diretório sintético" numa sessão não é a mesma coisa que um teste que sobrevive
ao próximo refactor — não tem, e isso é CORRIGE 3.

## CORRIGE

1. **"O QUE MUDOU" descreve só a cauda da rodada, não a rodada inteira.** A
   tabela diz "dois parágrafos novos" em `ESTADO.md`; o diff real é **152
   linhas** nesse arquivo (`git diff --stat`), e o intervalo `BASE..SHA` inclui
   três commits inteiros de trabalho de motor que a tabela não menciona:
   `ticksDeEntrada`/`contrapeEm`/`contrapeDe` ligados no harness (`cena.mjs`,
   `motor.mjs:247-291`, `lib-ponte.mjs:33`), a medição da entrada escalonada
   (o parágrafo "O QUE A ENTRADA ESCALONADA MUDOU" em `ESTADO.md`, com a
   bateria nova `bmtq8zam1`), o conserto do `mesa-mock.mjs` (não escalonava a
   entrada, "mais generoso que a mesa outra vez") e o conserto do próprio
   detector do L48 (`test-cobertura-lib.mjs`, o furo do `...L.contrapeDe`
   descrito no segundo item do "portão que casa por literal" em
   `CATALOGO.md`). Todos esses commits **existiam e passavam pelos portões
   antes desta rodada abrir** (não são trabalho não commitado), mas a regra do
   próprio formato ("uma frase por arquivo tocado") não distingue "arquivo
   tocado numa rodada anterior não anunciada" de "arquivo tocado agora": o
   critério é o intervalo `BASE..SHA`, e três desses commits (`744d17b`,
   `f1e0b79`, `3d1b50c`, `47765ce`) estão dentro dele. **Não bloqueia** porque
   conferi cada um dos nove arquivos a mão e nenhum contradiz o que o aviso
   afirma (ao contrário: o `mesa-mock.mjs` e o `agregar.mjs` implementam
   exatamente os dois CORRIGE que eu tinha aberto na rodada 09). Mas é o tipo
   de lacuna que só não custou nada porque eu não confiei na tabela — um
   inventário que omite 9 de 12 arquivos, três deles no motor, é o que faria
   uma revisão que confiasse na tabela (em vez de rodar `git diff --stat` por
   conta própria) fechar SEGUE sem ter lido o `contrapeDe` sendo ligado.

2. **O `56,58`/`n=25.100` já está sabidamente errado, e a própria executora
   já escreveu a correção numa rodada seguinte (11, `86724f7`, "o `n` de
   1/4/100 usava um Delta ~50x maior que 1").** Não escalo isto como pendência
   desta rodada porque o próprio aviso já marca as duas ressalvas certas
   (`ESTADO.md:97-103`, gesto total ≠ gesto por Tick) e não apresenta
   `n=25.100` como número final — a tabela por Tick (`n≈1/4/100`) é que fecha o
   parágrafo. Registro aqui só para a leitura em sequência: o Δ de 1 gesto/Tick
   não é o mesmo efeito físico que Δ de 1 gesto/batalha (a taxa média de
   3,72 gestos/Tick os separa por essa ordem de grandeza), e é exatamente isto
   que a rodada 11 corrige. Trato o número por completo quando chegar lá.

3. **O conserto do corpus misto (`agregar.mjs:118-146`, `:201-217`) não tem
   autoteste versionado.** `CATALOGO.md` e o commit dizem "testado com
   diretório sintético de verdade", mas não achei esse teste em
   `scripts/test-*.mjs` nem chamada nova em `test-portoes.mjs`
   (`grep -rn "CORPUS MISTO" scripts/` só acha a própria `agregar.mjs`). É
   exatamente o padrão "o portão nunca visto vermelho" do próprio catálogo: o
   conserto foi provado uma vez, à mão, na sessão que o escreveu, e nada no
   `validate` planta um diretório com `comLado>0` e `semLado>0` para provar que
   a rejeição ainda dispara depois do próximo refactor de `rastroLado`. Não
   bloqueia (o `validate` de hoje está verde e a lógica lida linha a linha bate
   com a descrição), mas é dívida que o L48 já pagou duas vezes neste mesmo
   arquivo (o `...L.nome` primeiro na mesa, depois no harness) por confiar em
   teste manual não repetido.

## PERGUNTA

Nenhuma. O único fato que só a executora sabia (se `bmtqb2vxm` fica
documentada em algum outro lugar) já está em "O QUE FICOU EM ABERTO" do
próprio aviso, nomeado.

## ESCALA

Nada. Nenhuma decisão de regra de jogo nesta rodada — é medição e conserto de
instrumento (harness, agregador, gate). A pergunta "o mestre vira espectador"
que `ESTADO.md` reabre no bloco anterior à rodada 10 já está marcada lá como
decisão do humano, e esta rodada não toca nela.

## VEREDITO

CORRIGE-E-SEGUE
