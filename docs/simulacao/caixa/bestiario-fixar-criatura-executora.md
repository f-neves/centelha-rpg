# Bestiário, fixar criatura para comparação · relato

28/09/2026. Despacho: `docs/simulacao/caixa/bestiario-fixar-criatura-despacho.md`.

## O que foi feito

Botão de fixar (estrela ☆/★) no canto superior direito da imagem de cada card do
bestiário, ao lado das âncoras de Ameaça e Centelha já existentes. Estado guardado em
`localStorage`, chave `centelha:bestiario:fixadas` (array de `id`s de criatura), seguindo a
convenção `centelha:bestiario:*` já usada em `BestiaEditor.astro`/`bestia-editor.ts`. Teto
de 6 fixadas ao mesmo tempo; a sétima é recusada com um aviso (`uiAviso`, importado
dinamicamente).

Fixada aparece primeiro na lista (na ordem em que foi fixada), mesmo com filtro ativo, e
ganha uma marca visual no próprio card (borda e sombra douradas), não só no botão.
Criatura fixada numa visita anterior que esteja fora das 40 fichas iniciais (dentro de
`<template class="besta-adiada">`) é montada sozinha, antes de qualquer filtro/ordenação
rodar pela primeira vez, para aparecer fixada e no topo já na abertura da página, sem
esperar rolagem.

## Arquivos tocados

- `src/components/BestaCard.astro`: o botão `.besta-pin` dentro de `figure.arte`.
- `src/pages/bestiario.astro`: leitura/escrita do `localStorage` (`lerFixadas`/
  `salvarFixadas`), a montagem antecipada da fixada fora das 40 iniciais, `apply()`
  ajustada (fixada aparece mesmo sem passar no filtro, e marca a UI do botão/card a cada
  passada), `sortCards()` ajustada (fixadas primeiro, por ordem de fixação), o clique
  delegado no botão (fixa/desfixa, teto, aviso), CSS de `.besta-pin`/`.besta.fixada`.

## Achado no caminho (consertado, não só relatado)

Testando o item 4 do despacho (criatura fixada fora das 40 iniciais tem de aparecer no
topo sem rolar), a montagem incremental das 268 fichas adiadas (`montarAosPoucos`) só
reordenava a lista (`sortCards()`) no FIM da montagem inteira, não a cada fatia. Como
`montarFatia` reinsere cada ficha na posição em que nasceu no HTML (alfabética), a fixada
saltava para fora do topo por 1-3 segundos (o tempo de montar as 268) antes de o
`sortCards` final trazê-la de volta. Corrigido chamando `sortCards()` a cada fatia
(24 cards), não só ao terminar.

## Verificação

- `npm run validate`, `npx tsc --noEmit`, `npm run build` (via `astro build --force`):
  verdes.
- Teste manual real, Edge headless via Puppeteer (script descartável, apagado depois,
  seguindo o padrão de `scripts/test-editor-bestiario.mjs`): fixou `mon-aasimar` (uma das
  40 iniciais) e `mon-crag-linnorm` (um dragão, índice 60, fora das 40); confirmou as duas
  gravadas no `localStorage`, visíveis com um filtro de tipo que as excluiria, no topo da
  lista. Recarregou a página e confirmou que as duas sobrevivem, inclusive a de fora das
  40, já fixada e no topo antes de qualquer rolagem, e que o topo fica estável durante a
  montagem incremental (não só no fim, depois do conserto acima). Fixou mais 4 (total 6,
  o teto) e confirmou que a sétima é recusada. Desfixou uma e confirmou que sai do
  `localStorage` e da marca visual.
- Travessão: zero nas linhas novas (conferido contando o caractere nos dois arquivos e por
  `git diff` filtrado, não `git diff` puro).

## CI do GitHub

Commit `815e0e6d`, verde: https://github.com/f-neves/centelha-rpg/actions/runs/36463731711
(job "Dados e regras" e toda a matriz de Smoke, conferido por `gh run view --json
status,conclusion,jobs`, todos `success`).

## Fora do escopo (confirmado, não tocado)

Nenhuma mudança em `src/data/*.json`, Supabase, conta, RLS, `mesa-*.ts` nem
`criaturas.astro`.

## Seguro dar `/clear`?

Sim. Commitado, empurrado e CI verde confirmado.
