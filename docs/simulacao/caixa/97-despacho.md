# Rodada 97 · despacho · o espelho de motor vermelho há dois dias, e o CORRIGE da 96

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 24/09/2026
>
> A 96 fechou com **PROCEDE e um CORRIGE** (`96-revisora.md`, no `main` como `dd9e2d5`). Progresso
> em `progresso-97.md`, relato em `97-executora.md`. A §17, que era a 97, passou para a
> `98-despacho.md`: ela mexe no motor, e o instrumento que confere o motor está vermelho.

## 0 · O CORRIGE da 96, e a nota

- **Seção 6, raiz 4 (G12):** "Desgaste e ferimento não se conhecem, o mestre arbitra hoje" é falso
  contra `vida-ferimentos-cura.md`, que desde `2b08d7a` (22/09) diz "mesmo pool, somando direto, piso
  1d6", e a própria seção 5 já diz isso. Aberto de verdade está só o **teto 4 da soma**. Corrija a
  frase no `Pendencias.md` e, se ela vier do próprio tema G, lá também.
- **Nota da F7:** ela libera **dois** itens de autoria (F5 e F6), e não três.
- **Nota da ordem das marcas:** `[DECIDIR] [ADIADO]`, com a ordem trocada, perde o adiamento calado.
  Faça o gerador recusar (ou ler) a ordem trocada, com o caso no teste.

## 1 · O espelho de motor está vermelho no CI desde 22/09/2026, e ninguém leu

**O fato, medido pelo `gh run list`:** o job `Smoke · test-espelho` do workflow `Validar dados e
regras` falha em **todas** as execuções desde `6e8651e` (22/09, 03:59, "Migra Limiares de Ferimento
na mesa para os 5 estados"). A última verde é `0934136`, catorze minutos antes. São cerca de 65
pushes vermelhos, incluindo as rodadas 88 a 96. **Só esse job falha**; os outros da matriz estão
verdes. O deploy é outro workflow, e está verde.

**O que a primeira falha mostra** (log de `6e8651e`): a mesa e o laço divergem em `total`,
`errouPor`, `danoBruto`, `dados.acerto` (mesa `3,4`, laço `3,4,6`), `chao` e `pv`. A leitura provável,
**não testada**: a mesa passou a somar `penAcaoDados` e os cinco estados de ferimento, e o laço (o
harness) continuou no modelo de seis estados em ponto. Os commits seguintes do mesmo dia (`888a196`,
`4450055`, o piso condicional de `rolarExpr`) mexeram no mesmo caminho.

**O que eu quero:**

1. **A causa, medida.** Rode o `test-espelho` localmente (é smoke, precisa de navegador) em
   `0934136`, `6e8651e` e no topo, e diga qual divergência nasce em qual commit. Se a causa for mais
   de uma, separe.
2. **De que lado está o erro.** O espelho compara duas implementações da mesma regra. A decisão que
   manda é a §4b e a §4f de `leitura-de-novato-decisoes.md`. **Se a mesa estiver certa pela
   decisão**, o laço se alinha a ela. **Se o laço estiver certo**, é defeito de mesa em produção, e
   aí você PARA e me diz antes de consertar, com o tamanho (o que muda para quem joga hoje).
3. **O conserto, e a prova:** o `test-espelho` verde no CI, conferido na execução, e não por
   suposição. Se o conserto tocar o harness, rode a bateria de regressão que o harness já tem.
4. **Por que ninguém viu.** O `test-portoes.mjs` avisa "test-espelho nunca rodou aqui" e o gancho não
   roda smoke. Diga, numa linha, o que teria feito este vermelho aparecer para alguém em horas e não
   em dois dias. **Não construa** esse instrumento nesta rodada: ele passa pelo `CATALOGO.md` antes.

**Não abra outros consertos** que aparecerem no caminho: linha no `Pendencias.md` e segue.

## O relato

`97-executora.md`, as quatro seções da casa, com a linha do tempo da causa (commit por commit) e o
que muda para quem joga. Commit com pathspec, `pull --rebase` antes, push depois.
