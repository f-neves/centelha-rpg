# Piso condicional de `rolarExpr`: a fixture de `test-lance.mjs` ficou velha, decisão pendente

Achado ao fechar o item 6 de `leitura-de-novato-decisoes.md` §4f (o piso de `rolarExpr`,
`src/lib/rolagem.ts`, que era incondicional em zero e passou a ser condicional à parada base:
parada com 1+ dado nunca cai abaixo de 1, parada "+2" sem d6 nenhum continua sem inventar dado).

**`npm run validate` fica com UMA falha, esperada**: `test-lance.mjs` (o `resolverGolpe` contra
`scripts/fixtures/lances.jsonl`) acusa 11 divergências, todas do mesmo formato,
`nº de dados 1 × 0` (a cópia calcula 1 dado, o registro gravado tem 0). Conferido: as 11 batem
exatamente com o efeito pretendido do piso novo (uma parada de 1 dado com penalidade suficiente
para zerar, que antes ia a 0 e agora fica em 1), nenhuma diverge em `flat`, `defesa` ou
`errouPor` (o que indicaria bug, não fixture velha). O resto do `validate` está verde, inclusive
`test-kael.mjs` e `npx tsc --noEmit`.

**Por que não recoletei sozinho.** `test-lance.mjs` já avisa na própria saída: a fixture é do
commit `64bcdce` e o HEAD já tinha andado até `0934136` antes desta rodada, e o teste já dizia
"recoletar é decisão, não conserto". Recoletar agora (`node scripts/coletar-lances.mjs`, que abre
o navegador e resolve golpes de verdade na bancada) absorveria nessa mesma tacada qualquer outra
deriva que tenha acontecido entre `64bcdce` e `0934136` sem relação com este conserto, e um commit
só de fixture teria de vir junto do commit de `rolagem.ts` para não descrever um comportamento que
o código commitado ainda não tinha.

**Pedido:** recoletar (`node scripts/coletar-lances.mjs`, roda no navegador, ~1315 lances) ou
segurar a fixture desatualizada por enquanto, registrando a falha esperada até a próxima rodada
que mexer em `resolverGolpe`/`rolarExpr` de qualquer forma?

## Atualização de 22/09/2026: recoletei, e achei um defeito bem maior. Revertido, não commitado.

Rodei `node scripts/coletar-lances.mjs` (exit 0, 1315 lances, as 16 metas de cobertura bateram).
`npm run test-lance.mjs` contra a fixture nova: **590 divergências**, não 11. Muito além do que o
piso condicional explica sozinho.

**Isolei a causa, e ela NÃO é o item 6.** Toda a distância mora em golpes cujo `ataque` é uma
expressão SEM dado nenhum (`"0d6 +N"`, arma/situação com o bolo inteiro em zero d6, só flat): a
mesa grava `saida.total` exatamente **o DOBRO** do que `resolverGolpe(entrada, fonteFixa)` calcula
a partir da mesma `entrada` (ex.: `ataque: "0d6 +3"`, `ajusteFlat: 3` → conta correta 6, mesa grava
12; `ajusteFlat: 0` → conta correta 3, mesa grava 6). Confirmado que o item 6 não participa: com
`baseDados === 0` o piso novo cai no MESMO ramo do piso velho (`Math.max(0, extraDados)`), o código
não muda de comportamento nesse caso. O padrão aparece tanto em golpes que passam pelo `ajAtq` real
do Grid (prefixos `ac000-t0`, `ac003-t3`) quanto nos que a própria coleta gera sem gesto declarado
(prefixo `*-avulso`, `grid.astro:10294`), e não toquei em nenhum dos dois caminhos além do que já
estava commitado nos itens 1-5 (e a fórmula do `flat` do `ajAtq` ficou byte a byte igual à de antes,
só extraí uma variável local).

**Não investiguei mais fundo** (é fora do escopo desta rodada: nada em §4f pede mexer em golpe
`0d6` puro) **mas é grave**: se o mesmo defeito existir fora da bancada sintética, qualquer PC ou
criatura com o bolo de acerto reduzido a zero dado por penalidade (Grave/Crítico empilhado, por
exemplo, é exatamente o caso que este despacho criou) pode estar acertando com o dobro do bônus
fixo que devia na mesa de verdade, não só na fixture.

**Revertido**: `scripts/fixtures/lances.jsonl` voltou para o commit `HEAD` (`git checkout --`), não
ficou nada da recoleta no working tree. `src/lib/rolagem.ts` (item 6) continua só no working tree,
não commitado. Não fiz mais nenhuma tentativa de recoleta.
