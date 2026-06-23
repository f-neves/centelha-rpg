// sim-duelo.mjs — balanceamento 1v1 numa LINHA DE TICKS (a Speed da arma importa:
// arma leve age mais vezes que pesada). Penalidade de guarda P=2 por ataque feito/recebido,
// zera na própria ação. Sem Fôlego. Mede win% e tempo (ticks) até a morte.
// Baterias: (A) degraus de nível, (B) round-robin de armas, (C) arma×armadura (TTK),
//           (D) troca da armadura (proteção vs penalidade).
// Uso: node scripts/sim-duelo.mjs

const TRIALS = 12000;
const P = 2;
const d6 = () => 1 + Math.floor(Math.random() * 6);
const floor = Math.floor;
const QA_W = { 1: { b: 3, d: 2 }, 2: { b: 2, d: 4 }, 3: { b: 1, d: 6 } };
const QA_A = { nenhuma: { b: 0, r: 0 }, leve: { b: 1, r: 0 }, media: { b: 2, r: 2 }, pesada: { b: 3, r: 4 } };
const MODE_CAT = { corte: 'corte', impacto: 'impacto', projetil: 'perfuracao', perfConc: 'perfuracao' };
const GATE = { projetil: 1, perfConc: 1 };

// ---- armas (damageAttr uniforme p/ isolar o desenho da arma) ----
const ARMAS = {
  Adaga:       { cl: 'leve',   spd: 5, die: 1, acc: 2, hands: 1, mode: 'perfConc', perf: 0 },
  EspCurta:    { cl: 'leve',   spd: 5, die: 1, acc: 2, hands: 1, mode: 'corte',    perf: 0 },
  EspLonga:    { cl: 'media',  spd: 6, die: 2, acc: 1, hands: 1, mode: 'corte',    perf: 0 },
  Machado:     { cl: 'media',  spd: 6, die: 2, acc: 1, hands: 1, mode: 'corte',    perf: 0 },
  Maca:        { cl: 'media',  spd: 6, die: 2, acc: 1, hands: 1, mode: 'impacto',  perf: 0 },
  Picareta:    { cl: 'media',  spd: 6, die: 2, acc: 1, hands: 1, mode: 'perfConc', perf: 2 },
  Lanca:       { cl: 'haste',  spd: 6, die: 2, acc: 1, hands: 2, mode: 'perfConc', perf: 1 },
  Montante:    { cl: 'pesada', spd: 7, die: 3, acc: 0, hands: 2, mode: 'corte',    perf: 1 },
  Martelo:     { cl: 'pesada', spd: 7, die: 3, acc: 0, hands: 2, mode: 'impacto',  perf: 2 },
};
const ARMAD = {
  Nenhuma:  { classe: 'nenhuma', i: 0, c: 0,  p: 0, rp: 0, pen: 0 },
  Couro:    { classe: 'leve',    i: 2, c: 4,  p: 1, rp: 1, pen: 1 },
  Malha:    { classe: 'media',   i: 1, c: 8,  p: 1, rp: 1, pen: 2 },
  Lamelar:  { classe: 'media',   i: 3, c: 8,  p: 3, rp: 1, pen: 2 },
  Placa:    { classe: 'pesada',  i: 6, c: 11, p: 4, rp: 3, pen: 3 },
};

function lutador({ ah = 10, centelha = 1, vigor = 4, dmgAttr = 4, pv = 37, arma = 'EspLonga', armadura = 'Nenhuma' }) {
  const w = ARMAS[arma], a = ARMAD[armadura];
  return {
    ah, centelha, vigor, dmgAttr, pvMax: pv, pv, guard: 0, nextTick: 0,
    die: w.die, acc: w.acc, hands: w.hands, mode: w.mode, perf: w.perf, spd: w.spd,
    arm: a, armClasse: a.classe, pen: a.pen,
  };
}
const baseDef = (c) => c.ah * 2 + c.centelha * 2 - c.pen;
const attackFlat = (c) => (c.ah % 2 ? 2 : 0) + c.acc + c.centelha * 2 - 0; // pen da armadura já entra na Defesa; no ataque some à parte:
const poolDice = (c) => floor(c.ah / 2);
function rollTotal(c) { let s = 0; for (let i = 0; i < poolDice(c); i++) s += d6(); return s + (c.ah % 2 ? 2 : 0) + c.acc + c.centelha * 2 - c.pen; }

function atacar(A, D) {
  const effDef = baseDef(D) - P * D.guard;
  const total = rollTotal(A);
  const qaMargin = QA_W[A.die].b + QA_A[D.armClasse].b;
  let dano = 0;
  if (total > effDef) {
    const m = floor((total - effDef) / 6);
    const cat = MODE_CAT[A.mode];
    const armSoak = cat === 'impacto' ? D.arm.i : cat === 'corte' ? D.arm.c : D.arm.p;
    const soakNat = A.mode === 'impacto' ? D.vigor : floor(D.vigor / 2);
    const soak = soakNat + D.centelha + armSoak;
    const gateClosed = GATE[A.mode] && A.perf < D.arm.rp;
    if (!gateClosed) {
      let dmg = A.dmgAttr * (A.hands === 2 ? 2 : 1) - soak;
      for (let i = 0; i < A.die + m; i++) dmg += d6();
      dano = Math.max(0, dmg);
    }
  } else if (total >= effDef - qaMargin) {
    dano = Math.max(0, QA_W[A.die].d - QA_A[D.armClasse].r);
  }
  D.pv -= dano; A.guard += P; D.guard += P;
}

// duelo em ticks; retorna 'A' | 'B' | 'draw'
function duelo(specA, specB) {
  const A = lutador(specA), B = lutador(specB);
  A.nextTick = 1 + Math.floor(Math.random() * A.spd);
  B.nextTick = 1 + Math.floor(Math.random() * B.spd);
  for (let t = 1; t <= 4000; t++) {
    for (const [C, O] of [[A, B], [B, A]]) {
      if (C.nextTick === t && C.pv > 0 && O.pv > 0) {
        C.guard = 0; atacar(C, O); C.nextTick = t + C.spd;
      }
    }
    if (A.pv <= 0 && B.pv <= 0) return 'draw';
    if (B.pv <= 0) return 'A';
    if (A.pv <= 0) return 'B';
  }
  return 'draw';
}
function winRate(specA, specB, n = TRIALS) {
  let a = 0, b = 0; for (let i = 0; i < n; i++) { const r = duelo(specA, specB); if (r === 'A') a++; else if (r === 'B') b++; }
  return a / n;
}
// TTK: ticks médios p/ matar um alvo que NÃO revida (isola ofensiva da arma vs armadura)
function ttk(armaA, armaduraD, n = 8000) {
  let soma = 0, mortes = 0;
  for (let i = 0; i < n; i++) {
    const A = lutador({ arma: armaA }); const D = lutador({ armadura: armaduraD });
    A.nextTick = 1 + Math.floor(Math.random() * A.spd);
    let t; for (t = 1; t <= 4000; t++) { if (A.nextTick === t) { A.guard = 0; atacar(A, D); A.nextTick = t + A.spd; D.guard = 0; /* alvo "age" e reseta: passivo */ } if (D.pv <= 0) break; }
    if (D.pv <= 0) { soma += t; mortes++; }
  }
  return mortes ? soma / mortes : Infinity;
}

console.log('=== Balanceamento 1v1 — linha de Ticks, guarda P=2 ===');
console.log(`Base: A+H 10, Centelha 1, Vigor 4, dano-attr 4, PV 37. ${TRIALS} duelos/célula.\n`);

// A) degraus de nível (mesma arma EspLonga, sem armadura)
console.log('--- A) Degraus de nível: win% do A+H10/C1 vs oponente variando A+H e Centelha (EspLonga, sem armadura) ---');
console.log('  oponente         win% do herói   ticks médios');
for (const [lbl, opp] of [
  ['A+H10 C1 (espelho)', {}],
  ['A+H8  C1', { ah: 8 }],
  ['A+H6  C1', { ah: 6 }],
  ['A+H10 C0 (herói C1)', { centelha: 0 }],
  ['A+H10 C0, herói C2', { centelha: 0, _heroC: 2 }],
  ['A+H8  C0, herói C2', { ah: 8, centelha: 0, _heroC: 2 }],
]) {
  const hero = { centelha: opp._heroC ?? 1 };
  const w = winRate(hero, { ah: opp.ah ?? 10, centelha: opp.centelha ?? 1 });
  console.log(`  ${lbl.padEnd(20)}  ${(w * 100).toFixed(0).padStart(4)}%`);
}

// B) round-robin de armas (sem armadura, mesmo tier)
const lista = Object.keys(ARMAS);
console.log('\n--- B) Round-robin de armas: win% da LINHA contra a COLUNA (sem armadura, mesmo tier). 50% = parelho ---');
process.stdout.write('         ' + lista.map((k) => k.slice(0, 6).padStart(7)).join('') + '   média\n');
const medias = {};
for (const a of lista) {
  let soma = 0; const cels = [];
  for (const b of lista) {
    const w = a === b ? 0.5 : winRate({ arma: a }, { arma: b }, 6000);
    cels.push((w * 100).toFixed(0).padStart(7)); soma += w;
  }
  medias[a] = soma / lista.length;
  console.log(a.padEnd(9) + cels.join('') + '   ' + (medias[a] * 100).toFixed(0) + '%');
}

// C) arma × armadura (TTK contra alvo passivo PV37; menor = arma fura melhor aquela armadura)
console.log('\n--- C) Ofensiva: ticks p/ matar (alvo passivo PV37) — arma (linha) × armadura (coluna). ∞ = não fura ---');
const armads = Object.keys(ARMAD);
process.stdout.write('         ' + armads.map((k) => k.padStart(9)).join('') + '\n');
for (const a of lista) {
  const cels = armads.map((ar) => { const v = ttk(a, ar); return (isFinite(v) ? v.toFixed(0) : '∞').padStart(9); });
  console.log(a.padEnd(9) + cels.join(''));
}

// D) armadura: dois EspLonga idênticos, um com armadura X vs um sem — proteção vence a penalidade?
console.log('\n--- D) Troca da armadura: win% de quem VESTE a armadura (vs idêntico SEM armadura, ambos EspLonga) ---');
for (const ar of armads) {
  const w = winRate({ armadura: ar }, { armadura: 'Nenhuma' });
  console.log(`  ${ar.padEnd(9)} win ${(w * 100).toFixed(0).padStart(3)}%  (pen −${ARMAD[ar].pen})`);
}
console.log('\n(>50% em D = a proteção compensa a penalidade; <50% = a penalidade pesa mais)');
