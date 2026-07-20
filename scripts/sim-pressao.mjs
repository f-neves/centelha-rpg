// sim-pressao.mjs — testa a penalidade de guarda por ataque FEITO ou RECEBIDO.
// Regra testada: cada ataque que um personagem faz OU recebe aplica −P à sua Defesa
// (Esquiva/Bloqueio), ACUMULA, e ZERA quando ele toma a própria ação. Sem teto.
// Modelo de tempo: rodadas simplificadas (todos agem 1×/rodada, em ordem de iniciativa).
// Compara P = 0 (sem regra), 1 e 2. Herói (A+H 10) vs grupo (1 capitão Centelha X + soldados X−1).
//
// Uso: node scripts/sim-pressao.mjs

const TRIALS = 20000;
const d6 = () => 1 + Math.floor(Math.random() * 6);
const floor = Math.floor;

// ---------- Quase-Acerto por classe ----------
const QA_W = { 1: { b: 3, d: 2 }, 2: { b: 2, d: 4 }, 3: { b: 1, d: 6 } };
const QA_A = { nenhuma: { b: 0, r: 0 }, leve: { b: 1, r: 0 }, media: { b: 2, r: 2 }, pesada: { b: 3, r: 4 } };
const MODE_CAT = { corte: 'corte', impacto: 'impacto', perfurante: 'perfuracao' };
const GATE = { perfurante: 1 };

// ---------- perfis (ajuste aqui) ----------
function heroi(centelha) {
  return {
    nome: 'Herói', ah: 10, centelha, vigor: 4, forca: 4, pv: 37, pvMax: 37,
    die: 2, acc: 1, hands: 1, mode: 'corte', perf: 0,            // Espada Longa
    armadura: { classe: 'leve', i: 2, c: 4, p: 1, rp: 1, pen: 1 }, // Couro endurecido
    initBonus: 5, guard: 0, alvoHeroi: false,
  };
}
function inimigo(ah, centelha, capitao) {
  return {
    nome: capitao ? 'Capitão' : 'Soldado', ah, centelha, vigor: 3, forca: 3, pv: 34, pvMax: 34,
    die: 1, acc: 2, hands: 1, mode: 'corte', perf: 0,            // Espada Curta
    armadura: { classe: 'leve', i: 2, c: 4, p: 1, rp: 1, pen: 1 }, // Couro
    initBonus: 2, guard: 0, alvoHeroi: true,
  };
}

const baseDef = (c) => c.ah * 2 + c.centelha * 2 - c.armadura.pen; // Esp 0
const attackFlat = (c) => (c.ah % 2 ? 2 : 0) + c.acc + c.centelha * 2;
const poolDice = (c) => floor(c.ah / 2);

function rollAttackTotal(c) {
  let s = 0;
  for (let i = 0; i < poolDice(c); i++) s += d6();
  return s + attackFlat(c);
}

// um ataque de A contra D, com penalidade de guarda P. Retorna dano aplicado.
function atacar(A, D, P) {
  const effDef = baseDef(D) - P * D.guard;
  const total = rollAttackTotal(A);
  const qaMargin = QA_W[A.die].b + QA_A[D.armadura.classe].b;
  let dano = 0;
  if (total > effDef) {
    const margin = floor((total - effDef) / 6);
    const cat = MODE_CAT[A.mode];
    const armSoak = cat === 'impacto' ? D.armadura.i : cat === 'corte' ? D.armadura.c : D.armadura.p;
    const soakNat = A.mode === 'impacto' ? D.vigor : floor(D.vigor / 2);
    const soakTotal = soakNat + D.centelha + armSoak;
    const gateClosed = GATE[A.mode] && A.perf < D.armadura.rp;
    if (!gateClosed) {
      let dmg = A.forca * (A.hands === 2 ? 2 : 1) - soakTotal;
      for (let i = 0; i < A.die + margin; i++) dmg += d6();
      dano = Math.max(0, dmg);
    }
  } else if (total >= effDef - qaMargin) {
    dano = Math.max(0, QA_W[A.die].d - QA_A[D.armadura.classe].r); // raspão, ignora Soak
  }
  D.pv -= dano;
  A.guard += P;   // ataque FEITO baixa a própria guarda
  D.guard += P;   // ataque RECEBIDO baixa a guarda do alvo
  return dano;
}

// uma refrega: herói vs grupo. Retorna {heroiVenceu, rodadas, pvHeroi}.
function refrega(H, grupo, P) {
  H.pv = H.pvMax; H.guard = 0;
  grupo.forEach((e) => { e.pv = e.pvMax; e.guard = 0; });
  let vivos = grupo.slice();
  for (let rodada = 1; rodada <= 200; rodada++) {
    // iniciativa: 1d6 + bônus, ordenada desc
    const atores = [H, ...vivos].filter((c) => c.pv > 0);
    atores.forEach((c) => { c._init = d6() + c.initBonus; });
    atores.sort((a, b) => b._init - a._init);
    for (const C of atores) {
      if (C.pv <= 0) continue;
      C.guard = 0; // tomar a ação reseta a própria guarda
      if (C.alvoHeroi) {
        if (H.pv > 0) atacar(C, H, P);
      } else {
        // herói foca o inimigo vivo com menor PV (mata mais rápido)
        const alvo = vivos.filter((e) => e.pv > 0).sort((a, b) => a.pv - b.pv)[0];
        if (alvo) atacar(C, alvo, P);
      }
    }
    vivos = vivos.filter((e) => e.pv > 0);
    if (H.pv <= 0) return { heroiVenceu: false, rodadas: rodada, pvHeroi: 0 };
    if (vivos.length === 0) return { heroiVenceu: true, rodadas: rodada, pvHeroi: H.pv };
  }
  return { heroiVenceu: H.pv > 0, rodadas: 200, pvHeroi: Math.max(0, H.pv) };
}

function montarGrupo(M, ahIni, X) {
  const g = [inimigo(ahIni, X, true)]; // capitão Centelha X
  for (let i = 1; i < M; i++) g.push(inimigo(ahIni, X - 1, false)); // soldados X−1
  return g;
}

function simular(M, ahIni, X, P) {
  let vit = 0, somaRod = 0, somaPv = 0;
  const H = heroi(X);
  for (let t = 0; t < TRIALS; t++) {
    const g = montarGrupo(M, ahIni, X);
    const r = refrega(H, g, P);
    if (r.heroiVenceu) { vit++; somaPv += r.pvHeroi; }
    somaRod += r.rodadas;
  }
  return { win: vit / TRIALS, rod: somaRod / TRIALS, pv: vit ? somaPv / vit : 0 };
}

// ---------- A) escalada do enxame (exato, herói que acabou de resetar) ----------
function topkPMF(rolled, keep) {
  const N = rolled; if (N <= 0) return { 0: 1 };
  if (keep >= N) { let p = { 0: 1 }; for (let i = 0; i < N; i++) { const np = {}; for (const s in p) for (let f = 1; f <= 6; f++) np[+s + f] = (np[+s + f] || 0) + p[s] / 6; p = np; } return p; }
  return {};
}
function hitChance(attacker, def) {
  const pmf = topkPMF(poolDice(attacker), poolDice(attacker));
  const flat = attackFlat(attacker); let h = 0;
  for (const s in pmf) if (+s + flat > def) h += pmf[s];
  return h;
}

console.log('=== Penalidade de guarda por ataque FEITO ou RECEBIDO — P=1 vs P=2 ===');
console.log(`Herói: A+H 10, Centelha X, Couro (Def base = 19+2X). Inimigo: Espada Curta, A+H variável, Centelha X/X−1.`);
console.log(`Modelo: rodadas, iniciativa por rodada. ${TRIALS} refregas por célula.\n`);

console.log('--- A) Escalada do enxame: chance de acerto do k-ésimo soldado (A+H 6, Cent X−1) contra um herói (Cent X=2) que resetou a guarda ---');
{
  const X = 2; const H = heroi(X); const sold = inimigo(6, X - 1, false);
  const def0 = baseDef(H);
  for (const P of [1, 2]) {
    const linha = [];
    for (let k = 0; k < 6; k++) linha.push(`${(hitChance(sold, def0 - P * k) * 100).toFixed(0)}%`);
    console.log(`  P=${P}: 1º..6º golpe na sequência → ${linha.join('  ')}  (Def ${def0} caindo −${P}/golpe)`);
  }
}

// ---------- B) win% do herói vs tamanho do grupo ----------
for (const ahIni of [6, 7]) {
  for (const X of [1, 2, 3]) {
    console.log(`\n--- B) Herói Centelha ${X} (A+H10) vs grupo (A+H ${ahIni}; capitão C${X} + soldados C${X - 1}) ---`);
    console.log('  M  | P=0 win (rod)        | P=1 win (rod, pv)        | P=2 win (rod, pv)');
    for (let M = 2; M <= 6; M++) {
      const r0 = simular(M, ahIni, X, 0);
      const r1 = simular(M, ahIni, X, 1);
      const r2 = simular(M, ahIni, X, 2);
      const fmt = (r) => `${(r.win * 100).toFixed(0).padStart(3)}% (${r.rod.toFixed(1)}r, pv${r.pv.toFixed(0)})`;
      console.log(`  ${M}  | ${(r0.win * 100).toFixed(0).padStart(3)}% (${r0.rod.toFixed(1)}r)        | ${fmt(r1)}   | ${fmt(r2)}`);
    }
  }
}
console.log('\n(win = % de vitórias do herói; rod = rodadas médias; pv = PV médio restante quando vence)');
