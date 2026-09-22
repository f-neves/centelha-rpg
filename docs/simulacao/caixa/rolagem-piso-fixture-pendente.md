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
