// sim-grupo.mjs — pilar dos números: um GRUPO de 3 (Centelha C) enfrenta 1
// "chefe" de Centelha C+1, ambos maximizados (teto escalado por Centelha).
// Alvo de design: 3×C2 vs C3 e 3×C3 vs C4 devem ser LUTAS de verdade.
// Varre os botões: fórmula de defesa, válvula QA, flanco e o multiplicador
// de poder do chefe (combos/AoE da Centelha alta).
//
//   node scripts/sim-grupo.mjs
import regras from '../src/data/regras.json' with { type: 'json' };
import armasJ from '../src/data/armas.json' with { type: 'json' };
import armadurasJ from '../src/data/armaduras.json' with { type: 'json' };
import escudosJ from '../src/data/escudos.json' with { type: 'json' };
const ARMAS = Object.fromEntries(armasJ.map((a) => [a.id, a]));
const ARM = Object.fromEntries(armadurasJ.map((a) => [a.id, a]));
const ESC = Object.fromEntries(escudosJ.map((a) => [a.id, a]));
const fl = Math.floor, ce = Math.ceil;
const d6 = () => (Math.random() * 6 | 0) + 1;
const rollN = (n) => { let s = 0; for (let i = 0; i < n; i++) s += d6(); return s; };

const ALLOT = { 0: [], 1: [1, 1], 2: [2, 1], 3: [2, 1, 1], 4: [2, 2, 1, 1], 5: [3, 2, 1, 1] };
const maxBoost = (c) => (ALLOT[c].length ? Math.max(...ALLOT[c]) : 0);
const skillBoosts = (c) => ALLOT[c].flatMap((x) => [x, x]).sort((a, b) => b - a);

function maxDuelista(c, arma = 'espada-curta', armadura = 'leve', escudo = 'broquel') {
  const sk = skillBoosts(c), sorted = [...ALLOT[c]].sort((a, b) => b - a);
  return {
    centelha: c, des: 5 + maxBoost(c), vigor: 5 + (sorted[1] || 0), forca: 5 + (sorted[2] || 0),
    weaponSkill: 5 + (sk[0] || 0), esquivaSkill: 5 + (sk[1] || 0), escudosSkill: 5 + (sk[2] || 0),
    espWeapon: 1, espEsquiva: 1, arma, armadura, escudo,
  };
}
const pvMax = (b) => regras.derivados.pv.base + b.vigor * regras.derivados.pv.vigorMult;

function defesaValor(b, centTerm) {
  const arm = ARM[b.armadura], esc = ESC[b.escudo], wpn = ARMAS[b.arma];
  const esq = (b.des + b.esquivaSkill) * 2 + b.espEsquiva + centTerm + (arm.esquiva || 0);
  const blqSkill = Math.max(b.escudosSkill || 0, b.weaponSkill || 0);
  const blq = (b.des + blqSkill) * 2 + b.espEsquiva + centTerm + (wpn.defesaArma || 0) + (esc.bloqueio || 0);
  return Math.max(esq, blq);
}
function ferimento(hp, hpM) { const p = hp <= 0 ? 0 : hp / hpM * 100; for (const f of regras.ferimentos) if (p >= f.minPct && p <= f.maxPct) return f; return regras.ferimentos.at(-1); }

// um golpe de att em def. cfg = { defTerm:fn, qaC, planoB }. extraDice = combo do chefe.
function golpe(att, def, cfg, { flank = 0, extraDice = 0, atkHP, defHP } = {}) {
  const wpn = ARMAS[att.arma], armDef = ARM[def.armadura];
  const soma = att.des + att.weaponSkill;
  let dados = fl(soma / 2) + extraDice;
  let flat = (soma % 2 ? 2 : 0) + (wpn.acerto || 0) + att.espWeapon + (cfg.planoB ? att.centelha : 0);
  flat += (ferimento(atkHP, pvMax(att)).penAcao ?? -5);
  const atkSum = rollN(dados) + flat;
  let D = defesaValor(def, cfg.defTerm(def.centelha)) - flank;
  D += (ferimento(defHP, pvMax(def)).penDefesa ?? -5);
  if (atkSum > D) {
    const margem = fl((atkSum - D) / 6);
    const forcaAp = wpn.maos === 2 ? att.forca : ce(att.forca / 2);
    const raw = rollN(wpn.dado + margem + extraDice) + forcaAp;
    const letal = wpn.tipoDano !== 'impacto';
    let soak = (letal ? fl(def.vigor / 2) : def.vigor) + (armDef.soak || 0);
    if (wpn.tipoDano === 'perfurante' && (wpn.pen || 0) <= (armDef.protecao || 0)) return 0;
    return Math.max(0, raw - soak);
  }
  const margemQA = (wpn.bonusQA || 0) + att.centelha;
  if (D - atkSum <= margemQA) return Math.max(0, (wpn.danoQA || 0) + (cfg.qaC ? att.centelha : 0) - (armDef.reducaoQA || 0));
  return 0;
}

// um combate grupo(nGrp × Clo) × 1 chefe(Chi). retorna true se o GRUPO vence.
function combate(grpProto, chefeProto, cfg, { nGrp = 3, flankOn = true, bossCombo = 0, bossTargets = 1, bossSpeedMult = 1 } = {}) {
  const grp = Array.from({ length: nGrp }, () => ({ b: grpProto, hp: pvMax(grpProto), next: 0 }));
  const chefe = { b: chefeProto, hp: pvMax(chefeProto), next: 0 };
  const wGrp = ARMAS[grpProto.arma].ticks;
  const wChefe = Math.max(2, ce(ARMAS[chefeProto.arma].ticks / bossSpeedMult));
  let t = 0;
  while (chefe.hp > 0 && grp.some((g) => g.hp > 0) && t < 800) {
    // próximo a agir
    const vivos = grp.filter((g) => g.hp > 0);
    const cands = [...vivos, chefe].filter((x) => x.hp > 0);
    const ator = cands.reduce((a, b) => (a.next <= b.next ? a : b));
    t = ator.next;
    if (ator === chefe) {
      // chefe foca os bossTargets de menor HP
      const alvos = [...vivos].sort((a, b) => a.hp - b.hp).slice(0, bossTargets);
      for (const al of alvos) {
        al.hp -= golpe(chefeProto, grpProto, cfg, { flank: 0, extraDice: bossCombo, atkHP: chefe.hp, defHP: al.hp });
      }
      chefe.next += wChefe;
    } else {
      const flank = flankOn && vivos.length >= 2 ? 2 : 0; // grupo cerca → flanco
      chefe.hp -= golpe(grpProto, chefeProto, cfg, { flank, extraDice: 0, atkHP: ator.hp, defHP: chefe.hp });
      ator.next += wGrp;
    }
  }
  return chefe.hp <= 0 && grp.some((g) => g.hp > 0) ? 'grupo' : (grp.every((g) => g.hp <= 0) ? 'chefe' : 'empate');
}

function winGrupo(clo, chi, cfg, opts, N = 4000) {
  const grp = maxDuelista(clo), chefe = maxDuelista(chi);
  let g = 0, c = 0, e = 0;
  for (let i = 0; i < N; i++) { const r = combate(grp, chefe, cfg, opts); if (r === 'grupo') g++; else if (r === 'chefe') c++; else e++; }
  return { g: g / N, c: c / N, e: e / N };
}

// ===================== RELATÓRIO =====================
const CFG = {
  'baseline (flat + QA atual)': { defTerm: (c) => c, qaC: false },
  'só-teto + QA+C': { defTerm: () => 0, qaC: true },
};

console.log('='.repeat(84));
console.log('3 × C(baixo) vs 1 × C(alto), maximizados. (grupo% / chefe% / empate%)');
console.log('flanco −2 ligado. Varre config × multiplicador do chefe (combo dados / nº alvos).');
console.log('='.repeat(84));

for (const [cfgNome, cfg] of Object.entries(CFG)) {
  console.log(`\n### CONFIG: ${cfgNome}`);
  for (const [clo, chi] of [[2, 3], [3, 4]]) {
    console.log(`\n  3×C${clo} vs C${chi}:`);
    console.log('             combo+0      combo+1      combo+2      combo+3');
    for (const tg of [1, 2, 3]) {
      const cells = [0, 1, 2, 3].map((cb) => {
        const r = winGrupo(clo, chi, cfg, { bossCombo: cb, bossTargets: tg });
        return `${(r.g * 100).toFixed(0)}/${(r.c * 100).toFixed(0)}/${(r.e * 100).toFixed(0)}`.padEnd(13);
      });
      console.log(`   ${tg} alvo(s)  ${cells.join('')}`);
    }
  }
}

// foco fino: melhor config, achar combo do chefe que dá ~50-65% grupo
console.log('\n' + '='.repeat(84));
console.log('FOCO — só-teto + QA+C, flanco −2, chefe single-target: combo do chefe vs equilíbrio');
console.log('='.repeat(84));
const cfg = CFG['só-teto + QA+C'];
for (const [clo, chi] of [[2, 3], [3, 4]]) {
  console.log(`\n  3×C${clo} vs C${chi} (grupo%):`);
  for (let cb = 0; cb <= 4; cb++) {
    const r = winGrupo(clo, chi, cfg, { bossCombo: cb, bossTargets: 1 }, 6000);
    const r2 = winGrupo(clo, chi, cfg, { bossCombo: cb, bossTargets: 2 }, 6000);
    console.log(`   combo+${cb}: 1alvo=${(r.g * 100).toFixed(0)}%  2alvos=${(r2.g * 100).toFixed(0)}%`);
  }
}
