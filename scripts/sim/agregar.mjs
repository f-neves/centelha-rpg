// agregar.mjs · dos `.jsonl` para as três tabelas do relatório.
//
// A ordem das tabelas é a régua do D8b (`04-prontidao.md` §D8b): as métricas
// POR ETAPA são as que reprovam uma regra, as POR BATALHA são contexto, e a
// duração não é critério, é multiplicador. Uma regra que dobre a duração e
// mantenha a carga por Tick é neutra; uma que encurte a batalha e dobre os
// cliques por etapa é ruim.
//
//   node scripts/sim/agregar.mjs --saida .sim/2026-09-02
import fs from 'node:fs';
import path from 'node:path';
import { RAIZ } from './lib-ponte.mjs';

const arg = (n, p) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : p; };
const DIR = path.resolve(RAIZ, arg('--saida', '.sim/ultima'));

const linhas = [];
for (const f of fs.readdirSync(DIR)) {
  if (!/^faixa-\d+\.jsonl$/.test(f)) continue;
  for (const l of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')) {
    if (l.trim()) linhas.push(JSON.parse(l));
  }
}
const manifesto = JSON.parse(fs.readFileSync(path.join(DIR, 'bateria.json'), 'utf8'));

// A BATALHA INVÁLIDA VAI PARA O BALDE PRÓPRIO e não entra em média nenhuma:
// uma batalha que viola invariante na média é pior que uma batalha a menos.
const invalidas = linhas.filter((l) => l.invariantes?.length);
const boas = linhas.filter((l) => !l.invariantes?.length);

const med = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const num = (x, c = 2) => (x == null ? '·' : x.toFixed(c));
const porCelula = new Map();
for (const l of boas) {
  if (!porCelula.has(l.celula)) porCelula.set(l.celula, []);
  porCelula.get(l.celula).push(l);
}

console.log(`\n· bateria ${manifesto.run_id} · commit ${manifesto.commit.slice(0, 7)}`
  + `${manifesto.sujo ? ' (árvore suja)' : ''} · dados ${manifesto.dados_hash}`);
console.log(`  ${linhas.length} batalhas · ${invalidas.length} inválidas (fora de toda média)`);
if (invalidas.length) {
  const porq = {};
  for (const l of invalidas) for (const f of l.invariantes) porq[f.slice(0, 40)] = (porq[f.slice(0, 40)] || 0) + 1;
  for (const [k, v] of Object.entries(porq)) console.log(`    ✗ ${v}× ${k}`);
}
const estourou = boas.filter((l) => l.fim === 'estourou').length;
if (estourou) {
  console.log(`  ⚠ ${estourou} batalhas ESTOURARAM o teto: tudo o que é por batalha está enviesado`);
}

// ---------------------------------------------------------------- tabela A
console.log('\n── A · A CARGA, por célula (as PRINCIPAIS, por etapa) ──');
console.log('célula'.padEnd(22) + 'par/Tick  p90  pico  gestos/golpe  Tk vazios  t.morto');
for (const [id, ls] of porCelula) {
  const pt = med(ls.map((l) => l.paradasPorTick.media));
  const p90 = med(ls.map((l) => l.paradasPorTick.p90));
  const pico = Math.max(...ls.map((l) => l.paradasPorTick.pico));
  const gg = med(ls.map((l) => l.gestosPorGolpe).filter((x) => x != null));
  const tv = med(ls.map((l) => l.fracaoTicksVazios));
  const tm = med(ls.map((l) => l.tempoMorto.media).filter((x) => x != null));
  console.log(id.padEnd(22) + num(pt).padStart(8) + num(p90).padStart(5)
    + String(pico).padStart(6) + num(gg).padStart(14) + num(tv).padStart(11) + num(tm).padStart(9));
}

// ---------------------------------------------------------------- tabela B
console.log('\n── B · A COMPOSIÇÃO, por classe. É A TABELA QUE RESPONDE A PERGUNTA ──');
console.log('célula'.padEnd(22) + '  i(dec)  ii(julg)  iii(arit)   %iii');
for (const [id, ls] of porCelula) {
  const i = med(ls.map((l) => l.paradas.i));
  const ii = med(ls.map((l) => l.paradas.ii));
  const iii = med(ls.map((l) => l.paradas.iii));
  const pct = (i + ii + iii) ? (iii / (i + ii + iii)) * 100 : 0;
  console.log(id.padEnd(22) + num(i, 1).padStart(8) + num(ii, 1).padStart(10)
    + num(iii, 1).padStart(11) + num(pct, 1).padStart(7) + '%');
}
const ti = boas.reduce((s, l) => s + l.paradas.i, 0);
const tii = boas.reduce((s, l) => s + l.paradas.ii, 0);
const tiii = boas.reduce((s, l) => s + l.paradas.iii, 0);
console.log(`\n  NO CONJUNTO: ${((tiii / (ti + tii + tiii)) * 100).toFixed(1)}% das paradas são classe iii,`
  + ' que é o tamanho do que a automação pode tirar.');
console.log('  (a diferença entre os dois perfis do D1 é ESTE número: com a classe iii resolvida');
console.log('   pelo motor, essas paradas somem e as outras duas ficam. Ver a decisão D12.)');

// ---------------------------------------------------------------- tabela C
console.log('\n── C · O CONTEXTO, por batalha (descrevem, e não reprovam) ──');
console.log('célula'.padEnd(22) + '  Ticks  paradas  golpes   fim dominante');
for (const [id, ls] of porCelula) {
  const t = med(ls.map((l) => l.ticks));
  const p = med(ls.map((l) => l.paradas.i + l.paradas.ii + l.paradas.iii));
  const g = med(ls.map((l) => l.golpesAplicados));
  const fins = {};
  for (const l of ls) fins[l.fim] = (fins[l.fim] || 0) + 1;
  const dom = Object.entries(fins).sort((a, b) => b[1] - a[1])[0];
  console.log(id.padEnd(22) + num(t, 1).padStart(7) + num(p, 1).padStart(9)
    + num(g, 1).padStart(8) + `   ${dom[0]} (${((dom[1] / ls.length) * 100).toFixed(0)}%)`);
}

console.log('\n── O QUE FOI INVENTADO ──');
for (const x of manifesto.inventado) console.log(`  ⚑ ${x}`);
console.log('\n  Métrica que depende só de entrada inventada não é achado sobre o sistema:');
console.log('  é sensibilidade, e o relatório a marca assim (P §2.7).\n');
