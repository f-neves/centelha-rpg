// sim-absorcao.mjs — analisa quanto dano MÉDIO passa de cada arma contra cada armadura,
// para calibrar se as absorções estão altas demais. Determinístico (usa média dos dados).
// uso: node scripts/sim-absorcao.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const rd = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8'));
const armas = rd('armas.json'), armaduras = rd('armaduras.json'), regras = rd('regras.json');
const fl = Math.floor;
const cNoSoak = regras.dano.centelhaNoSoak ?? 0;
const danoForca = regras.derivados.danoForca; // {umaMao, duasMaos}
const MODO_SOAK = { corte: 'corte', projetil: 'perfuracao', perfConc: 'perfuracao', impacto: 'impacto' };
const soakNat = (vig, cat) => (cat === 'impacto' ? vig : fl(vig / 2));
const SCALE = +(process.argv[2] || 1); // fator aplicado aos Soaks de armadura (1 = atual)
const ARM = Object.fromEntries(armaduras.map((a) => {
  const s = a.soak;
  return [a.id, { ...a, soak: { impacto: Math.round((s.impacto ?? 0) * SCALE), corte: Math.round((s.corte ?? 0) * SCALE), perfuracao: Math.round((s.perfuracao ?? 0) * SCALE) } }];
}));
if (SCALE !== 1) console.log(`\n>>> SCALE = ${SCALE} aplicado aos Soaks de armadura <<<`);

// cenário do alvo
const VIGOR = 3, CENT = 0;
// armaduras a comparar (representativas)
const COLS = ['nenhuma', 'couro', 'malha', 'brigandina', 'placa-completa'];

function danoMedioArma(w, forca) {
  const dadoAvg = w.dado * 3.5;
  const dist = (w.tags || []).includes('distância') || w.classe === 'distancia' || w.classe === 'arremesso';
  const forcaAp = dist ? 0 : forca * (w.maos === 2 ? danoForca.duasMaos : danoForca.umaMao);
  return dadoAvg + forcaAp;
}

function passa(w, armId, forca) {
  const dano = danoMedioArma(w, forca);
  const modo = w.tipoDano; // modo principal
  const cat = MODO_SOAK[modo];
  const arm = ARM[armId];
  // gate de perfuração
  if ((modo === 'projetil' || modo === 'perfConc') && (w.pen ?? 0) < (arm.resistPerf ?? 0)) return { dano, soak: '—', through: 0, resvala: true };
  const soak = soakNat(VIGOR, cat) + CENT * cNoSoak + (arm.soak[cat] ?? 0);
  return { dano, soak, through: Math.max(0, +(dano - soak).toFixed(1)), resvala: false };
}

function tabela(forca) {
  console.log(`\n### Dano MÉDIO que passa — Força ${forca}, Vigor ${VIGOR}, Centelha ${CENT}, margem 0`);
  const head = ['Arma (modo)', 'dano', ...COLS.map((c) => ARM[c].nome.split(' ')[0])];
  const rows = armas.map((w) => {
    const d = danoMedioArma(w, forca);
    const cells = COLS.map((c) => { const r = passa(w, c, forca); return r.resvala ? 'resvala' : String(r.through); });
    return [`${w.nome} (${w.tipoDano}${w.pen ? ' N' + w.pen : ''})`, d.toFixed(1), ...cells];
  });
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const fmt = (arr) => arr.map((c, i) => String(c).padEnd(widths[i])).join(' | ');
  console.log(fmt(head));
  console.log(widths.map((w) => '-'.repeat(w)).join('-|-'));
  for (const r of rows) console.log(fmt(r));
}

console.log('Soak total por modo = Soak natural (Vigor no Impacto, [Vigor/2] em Corte/Perf) + Centelha + armadura.');
console.log('Gate: Projétil/Perf. com Nível de Perfuração < Resistência da armadura RESVALAM (dano 0).');
tabela(3);
tabela(5);

// resumo: quantas armas zeram contra cada armadura (Força 3)
console.log('\n### Armas que ZERAM (0 ou resvala) — Força 3:');
for (const c of COLS) {
  const zeram = armas.filter((w) => { const r = passa(w, c, 3); return r.resvala || r.through === 0; }).map((w) => w.nome);
  console.log(`  ${ARM[c].nome}: ${zeram.length}/${armas.length} — ${zeram.join(', ') || 'nenhuma'}`);
}
