// test-l64-velocidade.mjs · separa sentinela e magnitude no campo `velocidade`.
//
// Pendencias.md L64 (rodada 57): `Condicao.velocidade` carregava duas coisas
// com o mesmo número. Três condições usam grandeza de verdade (`acelerado`
// −2, `retardado` +2, `terreno-dificil` +1); uma, `fora-do-tempo`, usava a
// SENTINELA `-99` para dizer "não age", funcionando hoje por saturação
// aritmética: o −99 afunda a soma e o `Math.max(0, ...)` do consumidor
// (`combate.astro:1404`) corta em zero. Nada no formato distinguia as duas.
//
// Este arquivo prova QUATRO coisas, nesta ordem:
//   1. o catálogo: `fora-do-tempo` carrega a marca, não mais o número;
//      as três condições de grandeza continuam só com número, sem a marca;
//   2. `somarCondicoes` (o ponto de soma): devolve as duas coisas separadas;
//   3. `condChipHTML` (um dos dois leitores de TELA achados nesta rodada,
//      achado que não estava no levantamento de 10/09 porque ele falava do
//      valor SOMADO, e este lê o campo CRU): a exibição troca o número pela
//      palavra, sem resenhar o chip;
//   4. A ASSERÇÃO QUE É O MOTIVO DESTA RODADA EXISTIR: sem `teto6` (que
//      continua desligado, fora do escopo), a soma de `velocidade` não corta
//      em lugar nenhum. Um teto ingênuo de ±6 aplicado à mão no ponto de soma
//      (`somarCondicoes`) TEM de deixar esta asserção vermelha: é o ensaio
//      que o Arquiteto pediu, documentado em
//      `docs/simulacao/caixa/progresso-57-l64.md`.
//
// O segundo leitor de tela achado nesta rodada, `modEfeito`
// (`src/pages/mesa/referencia.astro`), só existe dentro do `.astro`: não dá
// para importar no Node, então a seção 5 confere por TEXTO, não por
// comportamento, e isso é dito explicitamente (conferência fraca).
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `l64-velocidade-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/mesa-core.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'sim' };
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };
const eq = (a, b, msg) => ok(a === b, `${msg} (esperado ${JSON.stringify(b)}, achou ${JSON.stringify(a)})`);

// ---------------------------------------------------------- 1 · o catálogo
const foraDoTempo = M.COND['fora-do-tempo'];
ok(!!foraDoTempo, 'o catálogo tem `fora-do-tempo` (senão o resto deste arquivo testa o quê)');
ok(foraDoTempo.naoAge === true, '`fora-do-tempo` carrega a marca `naoAge`');
ok(foraDoTempo.velocidade == null,
  '`fora-do-tempo` NÃO carrega mais grandeza nenhuma em `velocidade` (nem -99, nem 0)');

for (const id of ['acelerado', 'retardado', 'terreno-dificil']) {
  const c = M.COND[id];
  ok(typeof c.velocidade === 'number', `\`${id}\` continua com grandeza numérica em \`velocidade\``);
  ok(!c.naoAge, `\`${id}\` não carrega a marca \`naoAge\` (é grandeza, não sentinela)`);
}

// ------------------------------------------------- 2 · o ponto de soma
const somaFora = M.somarCondicoes([foraDoTempo]);
ok(somaFora.naoAge === true, 'somarCondicoes([fora-do-tempo]) devolve naoAge true');
eq(somaFora.velocidade, 0, 'e velocidade some no total 0, não -99: a sentinela não entra mais na conta');

const somaGrandeza = M.somarCondicoes([M.COND['acelerado'], M.COND['terreno-dificil']]);
eq(somaGrandeza.velocidade, -1, 'acelerado (-2) + terreno-dificil (+1) soma -1, sem a marca por perto');
ok(!somaGrandeza.naoAge, 'e naoAge fica falso: nenhuma das duas é sentinela');

// Caso misto: fora-do-tempo junto com uma condição de grandeza de verdade. A
// marca tem de sobreviver à soma mesmo quando há número no mesmo lote (é o
// consumidor, em combate.astro, quem decide dar precedência à marca; aqui só
// se prova que a soma não perde a marca nem o número).
const somaMista = M.somarCondicoes([foraDoTempo, M.COND['retardado']]);
ok(somaMista.naoAge === true, 'fora-do-tempo + retardado: a marca continua true');
eq(somaMista.velocidade, 2, 'e o número de retardado (+2) continua aparecendo, separado da marca');

// ----------------------------------------- 3 · a tela (condChipHTML, real)
const chipFora = M.condChipHTML(foraDoTempo);
ok(/não age/.test(chipFora), 'o chip de Fora do tempo mostra a palavra "não age"');
ok(!/-99|−99/.test(chipFora), 'e não mostra mais o número da sentinela em lugar nenhum do chip');
ok(!/vel [+\-−]/.test(chipFora), 'e não mostra um badge "vel ±N" nenhum para esta condição');

const chipAcelerado = M.condChipHTML(M.COND['acelerado']);
ok(/vel −2/.test(chipAcelerado) || /vel -2/.test(chipAcelerado),
  'o chip de Acelerado continua mostrando o número, sem redesenho: "vel -2"');

// ------------------------ 4 · A ASSERÇÃO QUE É O MOTIVO DESTA RODADA EXISTIR
//
// `teto6` continua desligado (fora do escopo desta rodada). Esta asserção
// não existe para provar que o teto funciona: existe para que, se alguém
// aplicar um teto ingênuo de ±6 em `somarCondicoes` sem decidir isso em
// rodada própria, ALGUM teste fique vermelho. Condições SINTÉTICAS (não do
// catálogo, que hoje não passa de ±2) para garantir que o número supera ±6
// sem depender de nenhuma Arte ou condição real existir.
const semTeto = M.somarCondicoes([
  { id: 'sintetico-l64-a', velocidade: 5 }, { id: 'sintetico-l64-b', velocidade: 5 },
]);
eq(semTeto.velocidade, 10,
  'sem teto6, duas condições sintéticas de +5 somam 10, sem cortar em ±6 (prova exigida pela rodada 57)');

// ------------------------------------------ 5 · a tela (modEfeito, por texto)
//
// CONFERÊNCIA FRACA, dita explicitamente: `modEfeito` só existe dentro do
// front-matter de `referencia.astro`, que o esbuild não importa como módulo
// de Node (é markup Astro, não um `.ts`). O que se confere aqui é TEXTO do
// arquivo, não comportamento chamado: prova que o código está escrito do
// jeito certo, não que ele RODA certo. Não testado por chamada.
const refTxt = fs.readFileSync(path.join(ROOT, 'src/pages/mesa/referencia.astro'), 'utf8');
const modEfeitoTrecho = refTxt.slice(refTxt.indexOf('const modEfeito'), refTxt.indexOf('const modEfeito') + 1100);
ok(/c\.naoAge/.test(modEfeitoTrecho), '[conferência fraca, por texto] `modEfeito` lê `c.naoAge`');
ok(/não age/.test(modEfeitoTrecho), '[conferência fraca, por texto] e escreve a palavra "não age"');

// `avancarTick` (combate.astro): o consumidor real do `velocidade` somado.
// Mesma conferência fraca: texto, não chamada (é markup Astro).
const combateTxt = fs.readFileSync(path.join(ROOT, 'src/pages/mesa/combate.astro'), 'utf8');
const avancarTickTrecho = combateTxt.slice(
  combateTxt.indexOf('async function avancarTick'),
  combateTxt.indexOf('async function avancarTick') + 1000,
);
// A busca é pelo CÓDIGO (`const novo = cd.naoAge ? ...`), não por menção em
// comentário: um comentário que sobrevivesse à remoção do código faria esta
// conferência passar sem nada de verdade por trás, o oposto do que ela
// promete provar.
ok(/const novo = cd\.naoAge \? antes :/.test(avancarTickTrecho),
  '[conferência fraca, por texto] `avancarTick` lê `cd.naoAge` antes da conta do Tick (no CÓDIGO, não só no comentário)');

if (falhas.length) {
  console.error(`✗ L64 · sentinela e magnitude em \`velocidade\` · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('✓ L64 · `velocidade` separa sentinela (`naoAge`) de grandeza (número), '
  + 'e a soma crua continua sem teto (`teto6` decidido em rodada própria)');
