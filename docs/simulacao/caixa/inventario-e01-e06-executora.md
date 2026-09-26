# Inventário externo E01/E03/E04/E06 · relato da Executora

Despacho: `docs/simulacao/caixa/inventario-e01-e06-despacho.md` (commit `db31b7c`). Fonte:
`docs/export/proezas/chatgpt/06-especificacao-dados.md`, seção B2.

## E01: `ArvoreTecnicas.astro` lia `xp.tecnica.valor` (chave inexistente)

**Antes**: `perNivel = (regras as any).xp.tecnica.valor` (`regras.json` só tem `tipo`/`base`/`mult`/
`piso`/`nota`, sem `valor`); `perNivel` ficava `undefined`, e `nivel * perNivel` (linha do
planejador de XP) virava `NaN`.

**Depois**: importei `custoTecnica` de `../lib/calc` (a mesma função que a ficha usa) e troquei
`(byId[cid]?.nivel ?? 0) * perNivel` por `custoTecnica(byId[cid]?.nivel ?? 0)`.

**Prova**: subi `astro build` + `astro preview` e abri `/caminhos/vento` num Chrome real. Cliquei
em "Cavalgar o Vento" (nível 6): o planejador mostrou **"a cadeia completa de pré-requisitos
custa 170 XP em Técnicas (8 no total)"**. Conferi a soma à mão: a cadeia é Passo Veloz(1) +
Reflexos de Vento(1) + Salto do Grilo(3) + Esquiva Impossível(3) + Mil Passos(4) + Corrida
Vertical(4) + Borrão(4) + Cavalgar o Vento(6); `custoTecnica` desses níveis é 10+10+20+20+25+25+
25+35 = **170**, bate exato. Não vi `NaN` em nenhum nó testado.

## E03: tooltip de Efeito usava `nivel * 2`, o dado real é `mult: 4`

**Antes**: `src/pages/artes/efeitos.astro:61`, tooltip com `${e.nivel * 2} de XP`; a prosa da
linha 31 já dizia "4 × o nível dele" corretamente, então prosa e tooltip discordavam entre si.

**Depois**: importei `custoEfeito` de `../../lib/calc` e troquei `e.nivel * 2` por
`custoEfeito(e.nivel)`.

**Prova**: em `/artes/efeitos`, `evaluate_script` no primeiro `.ef-nivel` da página (Fogo, Efeito
de nível 1) devolveu `title="exige Fogo 1 · custa 4 de XP"` (era 2). Conferi mais 5 tooltips
seguidos (níveis 1/2/2/2/3/3): **4/8/8/8/12/12**, todos `nivel × 4` exato.

**Se alguma ficha ou calculadora usava o ×2**: **não.** `src/lib/ficha-engine.ts` (a ficha de
personagem de verdade) já chamava `custoEfeito(e.nivel)` nos quatro lugares onde soma XP de
Efeito (linhas 678, 708, 753, 2141), desde antes desta rodada. O `×2` estava isolado nesta página
de referência (`artes/efeitos.astro`), que é só exibição, não gasta XP de ninguém. Nenhuma ficha
salva foi calculada com o número errado.

## E04: `caminhos/[id].astro` montava níveis com `length: 5` fixo

**Antes**: `Array.from({ length: 5 }, ...)`; Técnicas de nível 6 nunca apareciam na seção da
página (a Árvore de Técnicas, que lê os dados direto, já mostrava a linha N6 corretamente: só a
lista detalhada abaixo dela sumia com o nível 6).

**Depois**: `Array.from({ length: TIER_NOME.length }, ...)` (`TIER_NOME` já vinha importado de
`../../lib/data`, 6 tiers: Tocado…Semideus).

**Prova**: 49 Técnicas de nível 6 existem no catálogo (`ex.: cavalgar-o-vento`, `punho-do-
cataclismo`, `palavra-de-lei`, `chuva-de-mil-flechas`...). Abri `/caminhos/vento` no navegador:
a seção **"Nível 6 · Semideus"** aparece com "Cavalgar o Vento" (35 XP) e "Velocidade Divina"
(35 XP), com texto, custo e pré-requisitos completos: antes do conserto essa seção inteira não
existia na página.

## E06: campo `grid` ausente do schema de `artes`/`efeitos` em `content.config.ts`

**Fato (a) confirmado**: o schema descartava o campo. Provei isolando o comportamento do zod:
parseando a mesma Arte (Fogo) com o schema de ANTES (sem `grid`) o resultado não tem `grid`
nenhum; com o schema de AGORA (`grid` declarado, `.optional()`), o campo sai inteiro
(`{elemento, cor, dadoPorNivel, danoBruto}`). Confirma que `getCollection('artes')`/
`getCollection('efeitos')` (usado por `loadData()`, `src/lib/data.ts`) descartava `grid` em
silêncio até este commit.

**Fato (b) confirmado**: o Grid publicado JÁ recebia o campo, por outro caminho.
`src/lib/artes-grid.ts:10-11` importa `artes.json`/`efeitos.json` **direto**
(`import ARTES_D from '../data/artes.json'`), sem passar por `getCollection`, então nunca sofreu
o corte do schema. Prova: `grep dadoPorNivel dist/_astro/*.js` acha a string em dois arquivos, um
deles `grid.astro_astro_type_script_index_0_lang.*.js`, o bundle do próprio Grid da mesa, que
carrega o valor de `dadoPorNivel` de verdade.

**Os dois fatos são independentes**: (a) era um bug real, silencioso, que afetava qualquer código
futuro que viesse a ler Artes/Efeitos via `getCollection` em vez de importar o JSON direto; (b) o
Grid de hoje nunca foi afetado, porque nunca usou esse caminho. Corrigi (a) mesmo assim, incluindo
`grid` nos dois schemas (`.optional()`, para não travar nada que hoje não declare o campo), por
consistência, como o despacho sugeriu.

## Verificação

`npm run validate`, `npx tsc --noEmit` e `npm run build` verdes. Travessão: zero nas linhas
novas. Os três caminhos sujos conhecidos continuam intactos.

## Arquivos tocados

`src/components/ArvoreTecnicas.astro` (E01), `src/pages/artes/efeitos.astro` (E03),
`src/pages/caminhos/[id].astro` (E04), `src/content.config.ts` (E06). Nenhum dado
(`regras.json`, `tecnicas.json`, `efeitos.json`, `artes.json`) foi tocado: os quatro itens eram
todos de leitura/exibição, como o despacho pediu.
