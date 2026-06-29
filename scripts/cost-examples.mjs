// cost-examples.mjs — recusteia os 4 builds-exemplo pela tabela REAL (regras.json),
// com os pisos novos (Atributo/Vontade 1) e a trilha Aparência. Imprime XP por categoria,
// total vs orçamento e os derivados. uso: node scripts/cost-examples.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const P = r.pisos, X = r.xp, D = r.derivados;
const sum = (a) => a.reduce((s, x) => s + x, 0);

// custo p/ subir um traço-de-pontos do piso `de` até `ate` (mult/porNivel)
const pts = (chave, de, ate) => { const s = X[chave]; let c = 0; for (let v = de + 1; v <= ate; v++) c += v * s.valor; return c; };
const arte = (n) => { let c = 0; for (let l = 1; l <= n; l++) c += l * X.arte.valor; return c; };

function cost(b) {
  const xa = sum(Object.values(b.attrs).map((v) => pts('atributo', P.atributo, v)));
  const xap = pts('aparencia', P.aparencia, b.aparencia);
  const xs = sum(Object.entries(b.skills).flatMap(([v, n]) => Array(n).fill(pts('habilidadePrimaria', P.habilidade, +v))));
  const xsec = sum(Object.entries(b.sec || {}).flatMap(([v, n]) => Array(n).fill(pts('habilidadeSecundaria', 0, +v))));
  const xesp = (b.espP || 0) * X.especialidadePrimaria.valor + (b.espS || 0) * X.especialidadeSecundaria.valor;
  const xv = sum(Object.values(b.virt).map((v) => pts('virtude', P.virtude, v)));
  const xw = pts('vontade', P.vontade, b.vont);
  const xc = pts('centelha', P.centelha, b.cent);
  const xt = (b.bandpts || 0) * X.tecnica.valor;
  const xar = sum((b.artes || []).map(arte));
  const total = xa + xap + xs + xsec + xesp + xv + xw + xc + xt + xar;
  // derivados
  const integ = b.skillsById?.integridade ?? 0;
  const pv = D.pv.base + (b.attrs.vigor || 0) * D.pv.vigorMult;
  const defM = integ * D.defesaMental.mult + b.vont + b.cent * D.defesaMental.centelhaMult;
  const defS = ((b.attrs.compostura || 0) + (b.virt.temperanca || 0) + b.cent) * D.defesaSocial.mult;
  const energia = b.cent * D.energia.centelhaMult + sum(Object.values(b.virt)) + b.vont;
  const mana = b.cent * D.mana.centelhaMult + b.vont;
  return { ...{ xa, xap, xs, xsec, xesp, xv, xw, xc, xt, xar }, total, pv, defM, defS, energia, mana };
}

const BUILDS = {
  'Kael (1400)': { budget: 1400, aparencia: 4, vont: 7, cent: 2,
    attrs: { percepcao: 5, destreza: 4, vigor: 4, forca: 3, raciocinio: 3, inteligencia: 2, influencia: 2, perspicacia: 2, compostura: 2 },
    skills: { 4: 1, 3: 5, 2: 2, 1: 1 }, skillsById: { integridade: 0 }, sec: { 2: 3 }, espP: 3,
    virt: { valor: 4, conviccao: 3, temperanca: 2, compaixao: 2 }, bandpts: 81 },
  'Sora (1800)': { budget: 1800, aparencia: 5, vont: 8, cent: 2,
    attrs: { destreza: 5, forca: 4, vigor: 4, influencia: 4, percepcao: 3, raciocinio: 3, inteligencia: 2, perspicacia: 3, compostura: 3 },
    skills: { 4: 1, 3: 8, 2: 2, 1: 1 }, skillsById: { integridade: 3 }, sec: { 3: 2, 2: 4 }, espP: 5,
    virt: { valor: 4, conviccao: 4, temperanca: 3, compaixao: 3 }, bandpts: 92 },
  'Veil (2400)': { budget: 2400, aparencia: 5, vont: 9, cent: 3,
    attrs: { inteligencia: 5, forca: 4, destreza: 4, vigor: 4, percepcao: 3, raciocinio: 3, influencia: 3, perspicacia: 3, compostura: 3 },
    skills: { 4: 1, 3: 8, 2: 3 }, skillsById: { integridade: 3 }, sec: { 3: 3, 2: 3 }, espP: 6, espS: 2,
    virt: { conviccao: 4, valor: 4, temperanca: 4, compaixao: 3 }, bandpts: 134, artes: [3, 3, 3, 3] },
  'Bram (1800)': { budget: 1800, aparencia: 4, vont: 9, cent: 1,
    attrs: { inteligencia: 5, influencia: 4, percepcao: 4, raciocinio: 3, vigor: 3, destreza: 3, perspicacia: 3, forca: 2, compostura: 2 },
    skills: { 4: 1, 3: 4, 2: 5, 1: 1 }, skillsById: { integridade: 0 }, sec: { 3: 3, 2: 5 }, espP: 6,
    virt: { conviccao: 4, temperanca: 3, compaixao: 3, valor: 2 }, bandpts: 12, artes: [4, 4, 4, 4, 4, 3] },
};

for (const [nome, b] of Object.entries(BUILDS)) {
  const c = cost(b);
  console.log(`\n${nome}`);
  console.log(`  Atrib ${c.xa} · Aparência ${c.xap} · Perícias ${c.xs} · Secund. ${c.xsec} · Esp. ${c.xesp} · Virtudes ${c.xv} · Vontade ${c.xw} · Centelha ${c.xc} · Técnicas ${c.xt} · Artes ${c.xar}`);
  console.log(`  TOTAL ${c.total} / ${b.budget}  (sobra ${b.budget - c.total})`);
  console.log(`  Derivados: PV ${c.pv} · Def.Mental ${c.defM} · Def.Social ${c.defS} · Energia ${c.energia} · Mana ${c.mana}`);
}
