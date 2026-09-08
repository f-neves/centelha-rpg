// test-elementos-combate.mjs — trava o achado B12 do Pendencias.md.
//
// `elementosCombate()` (src/lib/mesa-core.ts) é o único lugar que sabe onde
// fraqueza/resistência do bestiário moram (`combate.fraquezas`/`combate.resistencias`,
// nunca no topo do objeto). Os quatro lugares que liam do topo devolviam `[]`
// sempre, e o `|| []` nunca lançava, então o defeito ficou 26 dias sem sintoma
// visível: nenhum dano de Arte no Grid era agravado por fraqueza nenhuma.
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `elementos-combate-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/mesa-core.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'sim' };
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const bruto = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/monsters-mesa.json'), 'utf8'));
const MON = Array.isArray(bruto) ? bruto : (bruto.lista || Object.values(bruto).find(Array.isArray) || []);
const porId = (id) => MON.find((m) => m.id === id);

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };

// -------------------------------------------------- o caso que o B12 quebrava
//
// mon-archon-cao TEM fraqueza (`combate.fraquezas: ['profano']`). Se isto vier
// vazio, o defeito voltou: alguém trocou `elementosCombate` de volta para ler
// do topo, ou um quinto lugar nasceu lendo `m.fraquezas` direto de novo.
const cao = porId('mon-archon-cao');
ok(!!cao, 'fixture mon-archon-cao existe em monsters-mesa.json');
const elCao = M.elementosCombate(cao);
ok(elCao.fraquezas.length > 0, 'mon-archon-cao tem fraqueza em combate.fraquezas, e elementosCombate() devolveu vazio');
ok(elCao.fraquezas.includes('profano'), `mon-archon-cao deveria ter fraqueza "profano", veio [${elCao.fraquezas}]`);

const cubo = porId('mon-cubo-gelatinoso');
const elCubo = M.elementosCombate(cubo);
ok(elCubo.resistencias.length > 0, 'mon-cubo-gelatinoso tem resistência em combate.resistencias, e elementosCombate() devolveu vazio');
ok(elCubo.fraquezas.length === 0, 'mon-cubo-gelatinoso não tem fraqueza nenhuma, e elementosCombate() achou uma');

// Criatura sem fraqueza nem resistência: as duas listas têm de vir vazias, não
// `undefined` (os quatro pontos de leitura fazem `.length`/`.map` sem checar).
const semNada = porId('mon-aasimar');
const elSemNada = M.elementosCombate(semNada);
ok(Array.isArray(elSemNada.fraquezas) && elSemNada.fraquezas.length === 0, 'mon-aasimar deveria ter fraquezas: []');
ok(Array.isArray(elSemNada.resistencias) && elSemNada.resistencias.length === 0, 'mon-aasimar deveria ter resistencias: []');

// -------------------------------------------------- a forma exata do defeito
//
// Reproduz o objeto do jeito ERRADO que uma criatura NUNCA tem hoje (fraqueza
// solta no topo, sem nada em combate) e exige que elementosCombate() IGNORE o
// topo. Isso é o que teria pego o B12 antes de ele nascer: provar que a leitura
// é por `combate`, não que por acaso bate com o fixture de hoje.
const formaErrada = { id: 'fixture-forma-errada', fraquezas: ['fogo'], resistencias: ['gelo'], combate: {} };
const elErrado = M.elementosCombate(formaErrada);
ok(elErrado.fraquezas.length === 0, 'elementosCombate() leu fraqueza do TOPO do objeto — o B12 voltou');
ok(elErrado.resistencias.length === 0, 'elementosCombate() leu resistência do TOPO do objeto — o B12 voltou');

if (falhas.length) {
  console.error(`✗ elementosCombate (B12) · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`✓ elementosCombate lê fraqueza/resistência de combate.*, não do topo (B12 travado) · ${MON.length} criaturas na fixture`);
