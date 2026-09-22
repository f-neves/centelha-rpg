# P0: `roladaManual` dobrava o bônus fixo de qualquer golpe com o bolo em zero dado

Achado em 22/09/2026, ao recoletar `scripts/fixtures/lances.jsonl` para fechar o item 6 de §4f
(`docs/simulacao/caixa/leitura-de-novato-decisoes.md`, o piso condicional de `rolarExpr`). A
recoleta acusou 590 divergências contra `resolverGolpe`, muito além das ~11 que o item 6 sozinho
explicaria. Isolado e corrigido nesta rodada, separado do item 6.

## O bug

**Onde**: `src/lib/rolagem.ts`, função `roladaManual`. **Desde quando**: em produção desde
06/09/2026, commit `045f491` (a troca de "digite o total" para "digite as faces").

A guarda que decide "este número digitado é o TOTAL pronto de uma arma sem dado, ou é UMA FACE"
testava `!/\d*d6/i.test(expr)` — "a expressão não tem a substring `d6`". Uma arma cujo bolo já
nasce **zero dado** ainda é escrita como `"0d6 +N"` (`src/lib/combate-resumo.ts:86,89`:
`${Math.floor(soma/2)}d6`, que vira literalmente `0d6` sempre que Atributo+Perícia ≤ 1 — comum,
não é caso raro). Essa string TEM a substring `d6`, então a guarda nunca disparava para ela.

O efeito: `rolarAcerto` (`src/pages/mesa/grid.astro:10868`) escreve o TOTAL PRONTO no campo quando
o pool rola zero dado (não há face para mostrar). Quando `contaDoLance` lê esse campo de volta
via `roladaManual` para decidir o veredito (`grid.astro:10420`, antes do conserto), a guarda
falhava, o número era tratado como se fosse UMA FACE, e o fixo da arma era somado **de novo** por
cima. Resultado: qualquer combatente com o bolo de acerto (ou de dano) em zero dado acertava ou
causava dano com o **dobro** do bônus fixo que devia.

Confirmado que não é causado por este item de §4f nem pelos itens 1-5 do mesmo despacho (a
fórmula do `ajAtq.flat` em `grid.astro` ficou byte a byte igual à de antes da rodada). É bug
independente, pré-existente — esta rodada só o tornou mais alcançável, porque o `penAcaoDados`
novo de Grave/Crítico cria mais combatentes com o bolo reduzido a zero por penalidade, além do
caso já comum de arma/perícia fraca que zera o bolo desde o início.

## O segundo bug, menor, achado na mesma função

`dadosExpr` (usado só para a marca cosmética `bateContagem`, nunca para o `total`) contava
`parseInt(m, 10) || 1` sobre cada match `Nd6`: para `"0d6"`, `parseInt("0d6", 10)` dá `0`, e
`0 || 1` vira `1` — a mesma armadilha do zero que é falso (contava 1 dado para uma arma de zero).
Consertado junto, extraindo a contagem correta (`baseDadosDeExpr`, que já trata `0d6` como zero)
para as duas funções.

## O conserto

1. `src/lib/rolagem.ts`: extraídos dois helpers compartilhados entre `rolarExpr` e
   `roladaManual` — `baseDadosDeExpr(expr)` (conta os d6 da expressão, tratando `0d6` como
   zero de verdade) e `dadosAjustados(baseDados, extraDados)` (o piso do pool). A guarda de
   `roladaManual` passa a testar `dadosAjustados(...) === 0` (o POOL AJUSTADO de verdade, a
   mesma conta que `rolarAcerto` usa para decidir quantos dados rolar) em vez do texto da arma.
2. `src/pages/mesa/grid.astro`, `contaDoLance`: achado ao testar o conserto acima — essa função
   chamava `roladaManual(totalInp.value, e.atacante.ataque, e.atacante.ajusteFlat)` **sem** o
   quarto argumento (`extraDados`). Antes do conserto da guarda isso não tinha efeito no `total`
   (a guarda era só textual); depois, sem ele a guarda não sabia que um bolo `"0d6"` tinha
   ganhado dado de algum ajuste (`ajusteDados` + a penalidade do golpe em `penDados[idx]`), e
   descartava o fixo por inteiro num caso estreito mas real. Corrigido passando
   `e.atacante.ajusteDados + (e.atacante.penDados[idx] ?? 0)`, a mesma soma que `rolarAcerto` usa
   para decidir quantos dados rolar de fato.
3. `scripts/test-rolada-manual.mjs`: três asserções novas cobrindo exatamente `"0d6 +N"` (o caso
   do bug) e a borda em que `extraDados` traz o pool de volta a 1+ dado (o caso que o conserto do
   item 2 fecha).

**Este commit NÃO inclui o piso condicional do item 6** (`baseDados > 0 ? Math.max(1, ...) : ...`),
de propósito: `dadosAjustados` aqui ainda usa o piso incondicional antigo (`Math.max(0, ...)`),
para este conserto valer sozinho, sem misturar com a mudança de regra do item 6. O piso condicional
entra num commit separado, junto da fixture recoletada (ver
`docs/simulacao/caixa/rolagem-piso-fixture-pendente.md`).

## Testado

`npx tsc --noEmit` limpo. `node scripts/test-rolada-manual.mjs`: 18 asserções verdes (15 antigas +
3 novas). `npm run validate` verde (a fixture de `test-lance.mjs` não muda de comportamento com
este commit sozinho — o piso continua incondicional).
