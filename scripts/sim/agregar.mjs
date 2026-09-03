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
// AS DUAS COLUNAS DE TICK, e elas são coisas diferentes: `s/parada` é o clique
// que não consultou ninguém, e `s/resol` é o clique em que nada caiu mas houve
// declaração e escrituração. Ler o segundo como se fosse o primeiro inverte a
// conclusão sobre onde está o gargalo.
console.log('célula'.padEnd(22) + 'par/Tick  p90  pico  gestos/golpe  s/parada  s/resol  t.morto');
for (const [id, ls] of porCelula) {
  const pt = med(ls.map((l) => l.paradasPorTick.media));
  const p90 = med(ls.map((l) => l.paradasPorTick.p90));
  const pico = Math.max(...ls.map((l) => l.paradasPorTick.pico));
  const gg = med(ls.map((l) => l.gestosPorGolpe).filter((x) => x != null));
  const sp = med(ls.map((l) => l.fracaoSemParada));
  const sr = med(ls.map((l) => l.fracaoSemResolucao));
  const tm = med(ls.map((l) => l.tempoMorto.media).filter((x) => x != null));
  console.log(id.padEnd(22) + num(pt).padStart(8) + num(p90).padStart(5)
    + String(pico).padStart(6) + num(gg).padStart(14) + num(sp).padStart(10)
    + num(sr).padStart(9) + num(tm).padStart(9));
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
// A FRAÇÃO SE PUBLICA SEPARADA POR TÉRMINO, e o número principal é o das que
// TERMINAM. A composição de paradas de um impasse de 2.000 Ticks é dominada pela
// fase de impasse, que não é jogo: pôr as duas fatias na mesma média é deixar o
// número do topo do relatório ser metade impasse.
const fatia = (ls) => {
  const i = ls.reduce((x, l) => x + l.paradas.i, 0);
  const ii = ls.reduce((x, l) => x + l.paradas.ii, 0);
  const iii = ls.reduce((x, l) => x + l.paradas.iii, 0);
  const rp = ls.reduce((x, l) => x + (l.paradasSub?.reprojetar || 0), 0);
  const t = i + ii + iii;
  return {
    n: ls.length, i, ii, iii, t,
    pct: t ? (iii / t) * 100 : 0,
    // O PISO CONSERVADOR: tudo o que é duvidoso conta como ii. Duvidoso é a
    // re-projeção, que a R2 §B registra como um ponto em que o mestre REORDENA A
    // FILA À MÃO, e reordenar não é aritmética. Se a fração sobreviver ao piso, a
    // conclusão vale independentemente do carimbo.
    pctPiso: t ? ((iii - rp) / t) * 100 : 0,
  };
};
const term = boas.filter((l) => l.fim !== 'estourou');
const impasse = boas.filter((l) => l.fim === 'estourou');
const fT = fatia(term), fE = fatia(impasse), fTudo = fatia(boas);
console.log('\n  A FRAÇÃO DE CLASSE iii, separada por término, e em BANDA:');
console.log(`    batalhas que TERMINAM (${fT.n}): ${fT.pctPiso.toFixed(0)}% a ${fT.pct.toFixed(0)}%   ← É ESTE O NÚMERO`);
if (fE.n) console.log(`    batalhas que ESTOURAM (${fE.n}): ${fE.pctPiso.toFixed(0)}% a ${fE.pct.toFixed(0)}%   (impasse, não é jogo)`);
console.log(`    as duas juntas (${fTudo.n}): ${fTudo.pctPiso.toFixed(0)}% a ${fTudo.pct.toFixed(0)}%   (não usar: metade é impasse)`);
console.log('    a banda é: piso com a re-projeção contada como ii, teto com ela como iii.');
if (fE.n) {
  const d = Math.abs(fT.pct - fE.pct);
  console.log(d < 5
    ? `    As duas fatias dão frações parecidas (${d.toFixed(1)} pontos): o número é robusto.`
    : `    As duas fatias DIFEREM em ${d.toFixed(1)} pontos: só o das que terminam vale.`);
}
console.log('\n  (a diferença entre os dois perfis do D1 é ESTE número: com a classe iii resolvida');
console.log('   pelo motor, essas paradas somem e as outras duas ficam. Ver a decisão D12.)');

// -------------------------------------------------- a conta do Tick sem golpe
//
// Antes de suspeitar do laço: quantos golpes por Tick as peças DEVERIAM produzir
// em regime? Um golpe por ação, uma ação a cada `ciclo` Ticks. Com ciclo 6, duas
// peças dão um golpe a cada três Ticks, ou seja dois terços dos Ticks sem golpe,
// SEM DEFEITO NENHUM. O que a conta não explicar é o que sobra para investigar.
console.log('\n── A CONTA DO TICK SEM RESOLUÇÃO, antes de suspeitar do laço ──');
console.log('célula'.padEnd(22) + '  s/resol  cadência  sobra');
for (const [id, ls] of porCelula) {
  const sr = med(ls.map((l) => l.fracaoSemResolucao));
  const g = med(ls.map((l) => l.golpesAplicados));
  const t = med(ls.map((l) => l.ticks));
  // A cadência sai do MEDIDO: `1 − golpes/Tick` é o teto de Ticks sem golpe se
  // nunca caíssem dois no mesmo Tick.
  const prev = Math.max(0, 1 - (g / t));
  console.log(id.padEnd(22) + num(sr).padStart(9) + num(prev).padStart(10) + num(sr - prev).padStart(7));
}
console.log('  `cadência` = 1 − golpes por Tick. A SOBRA é o que a cadência não explica:');
console.log('  positiva quer dizer Ticks sem golpe além dos que o ciclo já obriga.');


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
