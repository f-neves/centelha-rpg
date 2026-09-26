# Inventário externo E01/E03/E04/E06 (05f3082) · veredito da Revisora

**PROCEDE.**

- **Árvore:** branch `revisora`, reancorada em `05f3082`, depois de
  `git merge-base --is-ancestor HEAD origin/main` confirmar que o veredito anterior (o do módulo
  Fôlego, `41e9261`) já estava em `main`.
- **Despacho:** `inventario-e01-e06-despacho.md` (`db31b7c`). **Relato:**
  `inventario-e01-e06-executora.md`.

## Os 4 itens, conferidos

- **E01**: `ArvoreTecnicas.astro:120` agora chama `custoTecnica(...)`, importada de `../lib/calc`.
  Recomputei a cadeia de 8 Técnicas até "Cavalgar o Vento" (N6) pela `nota` do próprio
  `regras.json.xp.tecnica` ("10·15·20·25·30·35" para os níveis 1-6), sem depender da prova do
  navegador: 10+10+20+20+25+25+25+35 = **170**, bate com o que o relato diz que o site mostrou.
- **E03**: `efeitos.astro:62` chama `custoEfeito(e.nivel)`. `regras.json.xp.efeito` tem `mult: 4`,
  então o tooltip agora é `nivel × 4`, consistente com a prosa da própria página ("4 × o nível
  dele"), que já estava certa antes. Conferi a alegação de que nenhuma ficha salva foi afetada:
  `ficha-engine.ts` já chama `custoEfeito` (a mesma função de `calc.ts`, não uma cópia) nos quatro
  lugares que somam XP de Efeito — o `×2` estava mesmo isolado na página de referência.
- **E04**: `TIER_NOME` (`src/lib/data.ts`) tem 6 entradas (`Tocado`…`Semideus`), e o catálogo tem
  **49** Técnicas de nível 6 (contei eu mesma). Rodei o build e confirmei no `dist/caminhos/vento/
  index.html`: a seção "Semideus" e "Cavalgar o Vento" aparecem, o que o despacho pedia para
  provar.
- **E06**: os dois schemas de `content.config.ts` agora declaram `grid` (`.optional()`), com o
  comentário certo distinguindo os dois fatos. Confirmei o fato (b) sozinha:
  `src/lib/artes-grid.ts:10-11` importa `artes.json`/`efeitos.json` direto (`import ARTES_D from
  '../data/artes.json'`), sem passar por `getCollection`, então o Grid nunca dependeu do schema. O
  fato (a) (o schema descartava o campo antes) é consistente com o formato do `grid` que vi na
  fase 2 desta mesma revisão (`efeitos.json`, bloco com `forma`/`ancora`/`gatilho`/`persiste`/
  etc.) — o schema novo aceita esse formato sem `.strict()`, e `npx tsc --noEmit`/`npm run build`
  não acusaram nada.

## O que não achei

Nenhum dos quatro itens toca `regras.json`, `tecnicas.json`, `efeitos.json` ou `artes.json` (só os
`.astro`/`.ts` de exibição e o `content.config.ts`), como o despacho exigia ("corrigido sem mudar
nenhum poder"). Nenhum outro item da tabela B2 do inventário foi tocado. Travessão zero nas linhas
novas (Node, não `grep`). Os três caminhos sujos conhecidos continuam intactos. `npm run validate`,
`npx tsc --noEmit` e `npm run build` verdes.

## CI

`db31b7c` (despacho, sem código): `Validar dados e regras` **success**. `05f3082` ainda em
andamento no momento deste veredito; não esperei o fim (a orientação do Arquiteto na rodada
anterior foi não segurar o veredito pelo CI). Se terminar vermelho, aviso.
