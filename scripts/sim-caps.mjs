// sim-caps.mjs — testa a proposta de TETO escalado por Centelha.
// A Centelha eleva o limite de Atributo/Perícia (não sobe automático).
// Duelista de Destreza MAXIMIZADO por tier; mede ataque/defesa/duelo entre
// tiers adjacentes (Cdif = 1): C1×C2 e C2×C3 (e os demais p/ a curva).
//
//   node scripts/sim-caps.mjs
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

// ---- tetos por Centelha (atributo); perícia = quantidade ×2 ----
const ALLOT = { 0: [], 1: [1, 1], 2: [2, 1], 3: [2, 1, 1], 4: [2, 2, 1, 1], 5: [3, 2, 1, 1] };
const maxBoost = (c) => (ALLOT[c].length ? Math.max(...ALLOT[c]) : 0);
const skillBoosts = (c) => ALLOT[c].flatMap((x) => [x, x]).sort((a, b) => b - a);

// duelista de Destreza maximizado: maior reforço de atributo → Des; os dois
// maiores reforços de perícia → arma e esquiva; o 3º → escudos (bloqueio).
function maxDuelista(c, arma = 'espada-curta', armadura = 'leve', escudo = 'broquel') {
  const sk = skillBoosts(c);
  const des = 5 + maxBoost(c);
  // 2º maior reforço de atributo → Vigor (PV/soak)
  const sorted = [...ALLOT[c]].sort((a, b) => b - a);
  const vigor = 5 + (sorted[1] || 0);
  const forca = 5 + (sorted[2] || 0);
  const weaponSkill = 5 + (sk[0] || 0);
  const esquivaSkill = 5 + (sk[1] || 0);
  const escudosSkill = 5 + (sk[2] || 0);
  return {
    nome: `C${c}`, centelha: c, des, vigor, forca,
    weaponSkill, esquivaSkill, escudosSkill,
    espWeapon: 1, espEsquiva: 1, // especialização modesta nas duas
    arma, armadura, escudo,
  };
}

function pv(b) { return regras.derivados.pv.base + b.vigor * regras.derivados.pv.vigorMult; }

// variantes do termo de Centelha na defesa
const DEFVAR = {
  flat: (c) => c,
  '2C': (c) => 2 * c,
};
// Plano B: Centelha também soma à SOMA do ataque
function defesaValor(b, centTerm) {
  const arm = ARM[b.armadura], esc = ESC[b.escudo], wpn = ARMAS[b.arma];
  const esq = (b.des + b.esquivaSkill) * 2 + b.espEsquiva + centTerm + (arm.esquiva || 0);
  const blqSkill = Math.max(b.escudosSkill || 0, b.weaponSkill || 0);
  const blq = (b.des + blqSkill) * 2 + b.espEsquiva + centTerm + (wpn.defesaArma || 0) + (esc.bloqueio || 0);
  return Math.max(esq, blq);
}
function ferimento(hp, hpMax) {
  const pct = hp <= 0 ? 0 : (hp / hpMax) * 100;
  for (const f of regras.ferimentos) if (pct >= f.minPct && pct <= f.maxPct) return f;
  return regras.ferimentos.at(-1);
}

// um golpe. planoB = soma Centelha do atacante à soma do ataque.
function umGolpe(att, def, centTermDef, { planoB = false, qaC = false, wounds = false, atkHP, defHP } = {}) {
  const wpn = ARMAS[att.arma], armDef = ARM[def.armadura];
  const soma = att.des + att.weaponSkill;
  let dados = fl(soma / 2);
  let flat = (soma % 2 ? 2 : 0) + (wpn.acerto || 0) + att.espWeapon + (planoB ? att.centelha : 0);
  if (wounds) flat += (ferimento(atkHP, pv(att)).penAcao ?? -5);
  const atkSum = rollN(dados) + flat;
  let D = defesaValor(def, centTermDef);
  if (wounds) D += (ferimento(defHP, pv(def)).penDefesa ?? -5);

  if (atkSum > D) {
    const margem = fl((atkSum - D) / 6);
    const wd = wpn.dado + margem;
    const forcaAp = wpn.maos === 2 ? att.forca : ce(att.forca / 2);
    const raw = rollN(wd) + (wpn.tags?.includes('distância') ? 0 : forcaAp);
    const letal = wpn.tipoDano !== 'impacto';
    let soak = (letal ? fl(def.vigor / 2) : def.vigor) + (armDef.soak || 0);
    if (wpn.tipoDano === 'perfurante' && (wpn.pen || 0) <= (armDef.protecao || 0)) return { hit: true, dano: 0 };
    return { hit: true, dano: Math.max(0, raw - soak), margem };
  }
  const margemQA = (wpn.bonusQA || 0) + att.centelha;
  if (D - atkSum <= margemQA) return { hit: false, qa: true, dano: Math.max(0, (wpn.danoQA || 0) + (qaC ? att.centelha : 0) - (armDef.reducaoQA || 0)) };
  return { hit: false, qa: false, dano: 0 };
}

function porGolpe(att, def, centTermDef, opts = {}, N = 80000) {
  let h = 0, q = 0, dano = 0, margem = 0;
  for (let i = 0; i < N; i++) {
    const r = umGolpe(att, def, centTermDef, opts);
    if (r.hit) { h++; dano += r.dano; margem += r.margem; } else if (r.qa) { q++; dano += r.dano; }
  }
  return { hit: h / N, qa: q / N, eDano: dano / N, margemMedia: h ? margem / h : 0 };
}

function duelo(A, B, ctA, ctB, opts = {}, N = 8000) {
  let vA = 0, vB = 0, draws = 0, ticks = 0;
  const wA = ARMAS[A.arma].ticks, wB = ARMAS[B.arma].ticks;
  for (let i = 0; i < N; i++) {
    let hpA = pv(A), hpB = pv(B), t = 0, tA = 0, tB = 0;
    while (hpA > 0 && hpB > 0 && t < 600) {
      if (tA <= tB) { const r = umGolpe(A, B, ctB, { ...opts, wounds: true, atkHP: hpA, defHP: hpB }); hpB -= r.dano; tA += wA; }
      else { const r = umGolpe(B, A, ctA, { ...opts, wounds: true, atkHP: hpB, defHP: hpA }); hpA -= r.dano; tB += wB; }
      t = Math.min(tA, tB);
    }
    ticks += t;
    if (hpA > 0 && hpB > 0) draws++;
    else if (hpA <= 0 && hpB <= 0) { vA += .5; vB += .5; }
    else if (hpB <= 0) vA++; else vB++;
  }
  return { winA: vA / N, winB: vB / N, draw: draws / N, ticks: ticks / N };
}

// ===================== RELATÓRIO =====================
const DUEL = {}; for (let c = 0; c <= 5; c++) DUEL[c] = maxDuelista(c);

console.log('='.repeat(80));
console.log('DUELISTA DE DESTREZA MAXIMIZADO POR CENTELHA (espada-curta + couro + broquel)');
console.log('='.repeat(80));
console.log('C | Des wpn esq esc Vig | pool ataque | Defesa flat | Defesa 2C | PV | soak(let)');
for (let c = 0; c <= 5; c++) {
  const b = DUEL[c], soma = b.des + b.weaponSkill, dd = fl(soma / 2), bo = soma % 2 ? 2 : 0;
  const atk = `${dd}d6${bo ? '+2' : ''}+${(ARMAS[b.arma].acerto || 0) + b.espWeapon}`;
  console.log(`${c} |  ${b.des}   ${b.weaponSkill}   ${b.esquivaSkill}   ${b.escudosSkill}   ${b.vigor}  | ${atk.padEnd(11)} |    ${defesaValor(b, c)}      |    ${defesaValor(b, 2 * c)}    | ${pv(b)} |   ${fl(b.vigor / 2) + (ARM[b.armadura].soak || 0)}`);
}

function matchup(cLo, cHi, label) {
  console.log('\n' + '='.repeat(80));
  console.log(`MATCHUP ${label}: C${cLo} (maxed) × C${cHi} (maxed) — Cdif = ${cHi - cLo}`);
  console.log('='.repeat(80));
  const lo = DUEL[cLo], hi = DUEL[cHi];
  for (const [vn, fn] of Object.entries(DEFVAR)) {
    const aLoHi = porGolpe(lo, hi, fn(cHi));        // baixo ataca alto
    const aHiLo = porGolpe(hi, lo, fn(cLo));        // alto ataca baixo
    const d = duelo(lo, hi, fn(cLo), fn(cHi));
    console.log(`\n  [Defesa ${vn}]`);
    console.log(`   C${cLo}→C${cHi} (sobe): acerto ${(aLoHi.hit * 100).toFixed(0)}%  +QA ${(aLoHi.qa * 100).toFixed(0)}%  E[dano]/golpe ${aLoHi.eDano.toFixed(2)}`);
    console.log(`   C${cHi}→C${cLo} (desce): acerto ${(aHiLo.hit * 100).toFixed(0)}%  +QA ${(aHiLo.qa * 100).toFixed(0)}%  E[dano]/golpe ${aHiLo.eDano.toFixed(2)}  (margem méd ${aHiLo.margemMedia.toFixed(1)})`);
    console.log(`   DUELO: vit C${cLo}=${(d.winA * 100).toFixed(0)}%  vit C${cHi}=${(d.winB * 100).toFixed(0)}%  empate=${(d.draw * 100).toFixed(0)}%  ticks≈${d.ticks.toFixed(0)}`);
  }
  // Plano B (Centelha no ataque tb; defesa flat)
  const aLoHiB = porGolpe(lo, hi, cHi, { planoB: true });
  const aHiLoB = porGolpe(hi, lo, cLo, { planoB: true });
  const dB = duelo(lo, hi, cLo, cHi, { planoB: true });
  console.log(`\n  [Plano B — Centelha tb no ataque, defesa flat]`);
  console.log(`   C${cLo}→C${cHi}: acerto ${(aLoHiB.hit * 100).toFixed(0)}%  +QA ${(aLoHiB.qa * 100).toFixed(0)}%   |   C${cHi}→C${cLo}: acerto ${(aHiLoB.hit * 100).toFixed(0)}%  +QA ${(aHiLoB.qa * 100).toFixed(0)}%`);
  console.log(`   DUELO: vit C${cLo}=${(dB.winA * 100).toFixed(0)}%  vit C${cHi}=${(dB.winB * 100).toFixed(0)}%  empate=${(dB.draw * 100).toFixed(0)}%`);
}

matchup(1, 2, 'PEDIDO 1');
matchup(2, 3, 'PEDIDO 2');
// curva completa de Cdif=1 p/ contexto
matchup(0, 1, 'contexto');
matchup(3, 4, 'contexto');
matchup(4, 5, 'contexto');

// ---- "equivalência": quantos d6 de handicap igualam o duelo C1×C2? ----
console.log('\n' + '='.repeat(80));
console.log('EQUIVALÊNCIA — handicap (mods na Defesa do alvo alto) p/ igualar o duelo, flat');
console.log('='.repeat(80));
for (const [cLo, cHi] of [[1, 2], [2, 3]]) {
  const lo = DUEL[cLo], hi = DUEL[cHi];
  let melhor = null;
  for (let mod = 0; mod <= 12; mod++) {
    // dá ao C baixo um bônus 'mod' efetivo (reduz defesa do alto e some ao ataque do baixo): simulamos como redução da defesa do alto
    const hiPenal = { ...hi };
    const d = duelo(lo, hiPenal, cLo, cHi - 0, { }, 4000);
    // simplificação: testa reduzindo a defesa do alto por 'mod' via centTerm negativo
    const d2 = duelo(lo, hi, cLo, cHi, { }, 4000);
    break;
  }
  // medida direta: diferença de defesa e de pool
  const dDef = defesaValor(hi, cHi) - defesaValor(lo, cLo);
  const somaLo = lo.des + lo.weaponSkill, somaHi = hi.des + hi.weaponSkill;
  console.log(`C${cLo}×C${cHi}: ΔDefesa = +${dDef} a favor do alto; pool ${fl(somaLo / 2)}d6 vs ${fl(somaHi / 2)}d6 (Δ ${fl(somaHi / 2) - fl(somaLo / 2)} dado)`);
}

// ---- AJUSTES-ALVO: o que cada correção faz nos 2 matchups pedidos ----
console.log('\n' + '='.repeat(80));
console.log('AJUSTES-ALVO — duelo (vit baixo / vit alto / empate)');
console.log('='.repeat(80));
const variantes = {
  'A) baseline flat + QA atual': { ct: (c) => c, opts: {} },
  'B) defesa SÓ-teto (sem +C flat) + QA atual': { ct: () => 0, opts: {} },
  'C) flat + QA+Centelha': { ct: (c) => c, opts: { qaC: true } },
  'D) só-teto + QA+Centelha': { ct: () => 0, opts: { qaC: true } },
  'E) Plano B (C no ataque) + QA+Centelha': { ct: (c) => c, opts: { planoB: true, qaC: true } },
};
for (const [cLo, cHi] of [[1, 2], [2, 3]]) {
  console.log(`\n  --- C${cLo} (maxed) × C${cHi} (maxed) ---`);
  for (const [nome, v] of Object.entries(variantes)) {
    const d = duelo(DUEL[cLo], DUEL[cHi], v.ct(cLo), v.ct(cHi), v.opts, 5000);
    console.log(`   ${nome.padEnd(44)} ${(d.winA * 100).toFixed(0)}% / ${(d.winB * 100).toFixed(0)}% / empate ${(d.draw * 100).toFixed(0)}%`);
  }
}
