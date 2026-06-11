// sim-defesas.mjs — Monte Carlo do combate do Centelha D6 para analisar a
// influência do termo de Centelha na DEFESA (flat +C vs +⌈1.5C⌉ vs +2C),
// sob ofensiva "as-is" (conteúdo atual, banda ≤5) e "projetada" (banda 7–15).
//
// Roda 6 combatentes (2 por tier: 1 ofensivo, 1 defensivo) em duelos
// espelhados e assimétricos, e depois um SWEEP paramétrico
// (ofensiva-por-tier × inclinação-da-defesa) para achar a calibragem.
//
//   node scripts/sim-defesas.mjs
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

// ---------- custo de XP (espelha calc.ts) ----------
const xp = regras.xp, pisos = regras.pisos;
const sumStep = (mult, de, ate) => { let c = 0; for (let v = de + 1; v <= ate; v++) c += v * mult; return c; };
function custoAtributo(v) { return sumStep(xp.atributo.valor, pisos.atributo, v); }
function custoHabPrim(v) { return sumStep(xp.habilidadePrimaria.valor, pisos.habilidade, v); }
function custoHabSec(v) { return sumStep(xp.habilidadeSecundaria.valor, pisos.habilidade, v); }
function custoVirtude(v) { return sumStep(xp.virtude.valor, pisos.virtude, v); }
function custoVontade(v) { return sumStep(xp.vontade.valor, pisos.vontade, v); }
function custoCentelha(v) { return sumStep(xp.centelha.valor, pisos.centelha, v); }
const custoTecnica = (banda) => banda * xp.tecnica.valor;
function custoArte(nivel) { let c = 0; for (let n = 1; n <= nivel; n++) c += n * xp.arte.valor; return c; }

// soma o XP "núcleo" (traços que importam no duelo) de uma build
function xpCore(b) {
  let c = custoCentelha(b.centelha) + custoVontade(b.vontade);
  // atributos relevantes (resto fica no piso 2, custo 0)
  for (const v of [b.des, b.vigor, b.forca, b.raciocinio, b.percepcao, b.inteligencia]) c += custoAtributo(v || pisos.atributo);
  // perícias primárias relevantes
  for (const v of [b.weaponSkill, b.esquivaSkill, b.escudosSkill, b.prontidao, b.ocultismo, b.atletismo, b.resistencia]) c += custoHabPrim(v || 0);
  c += (b.espWeapon || 0) * xp.especialidadePrimaria.valor + (b.espEsquiva || 0) * xp.especialidadePrimaria.valor;
  // virtudes (assume Valor/Convicção relevantes; resto piso 1)
  for (const v of [b.valor || 1, b.conviccao || 1, b.temperanca || 1, b.compaixao || 1]) c += custoVirtude(v);
  for (const t of b.tecnicas || []) c += custoTecnica(t);
  for (const a of b.artes || []) c += custoArte(a);
  return c;
}

// ---------- builds: 2 por tier (ofensivo / defensivo) ----------
// stats de combate SATURAM no teto evoluído; o orçamento extra vira largura
// (perícias/Técnicas/Arcano), modelada como "breadth" para fechar o XP-alvo.
const BUILDS = {
  // ===== TIER 1 — Centelha 1, alvo 1000 XP =====
  t1off: {
    nome: 'T1 Ofensivo — Lâmina', tier: 1, centelha: 1, alvoXP: 1000,
    des: 5, vigor: 4, forca: 4, raciocinio: 3, percepcao: 3,
    weaponSkill: 5, esquivaSkill: 4, prontidao: 4, atletismo: 3, resistencia: 2,
    espWeapon: 2, espEsquiva: 1, valor: 4, conviccao: 3, temperanca: 2, vontade: 7,
    arma: 'espada-curta', armadura: 'leve', escudo: 'nenhum',
    tecnicas: [1, 1, 1, 1, 1, 2, 2, 3], // Fúria, Postura Fluida, Bote, Golpe do Titã etc.
  },
  t1def: {
    nome: 'T1 Defensivo — Muralha', tier: 1, centelha: 1, alvoXP: 1000,
    des: 4, vigor: 5, forca: 4, raciocinio: 2, percepcao: 2,
    weaponSkill: 4, esquivaSkill: 4, escudosSkill: 4, prontidao: 3, resistencia: 4,
    espWeapon: 1, espEsquiva: 2, valor: 3, conviccao: 3, temperanca: 3, vontade: 7,
    arma: 'espada-longa', armadura: 'media', escudo: 'escudo',
    tecnicas: [1, 1, 1, 1, 2, 2], // Aparar, Reflexos de Vento, Pele Curtida etc.
  },
  // ===== TIER 2 — Centelha 3, alguns Caminhos, alvo 1500 XP =====
  t2off: {
    nome: 'T2 Ofensivo — Lâmina', tier: 2, centelha: 3, alvoXP: 1500,
    des: 5, vigor: 4, forca: 5, raciocinio: 4, percepcao: 3,
    weaponSkill: 5, esquivaSkill: 5, prontidao: 4, atletismo: 4, resistencia: 3,
    espWeapon: 3, espEsquiva: 2, valor: 4, conviccao: 4, temperanca: 3, vontade: 8,
    arma: 'espada-curta', armadura: 'leve', escudo: 'nenhum',
    tecnicas: [1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5], // toolbox de herói
  },
  t2def: {
    nome: 'T2 Defensivo — Muralha', tier: 2, centelha: 3, alvoXP: 1500,
    des: 4, vigor: 5, forca: 5, raciocinio: 3, percepcao: 3,
    weaponSkill: 5, esquivaSkill: 5, escudosSkill: 5, prontidao: 4, resistencia: 5,
    espWeapon: 2, espEsquiva: 3, valor: 4, conviccao: 4, temperanca: 4, vontade: 8,
    arma: 'espada-longa', armadura: 'media', escudo: 'escudo',
    tecnicas: [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5],
  },
  // ===== TIER 3 — Centelha 5, Caminhos + Arcano, alvo 1800 XP =====
  t3off: {
    nome: 'T3 Ofensivo — Lâmina/Mago', tier: 3, centelha: 5, alvoXP: 1800,
    des: 5, vigor: 4, forca: 5, raciocinio: 4, percepcao: 3, inteligencia: 5,
    weaponSkill: 5, esquivaSkill: 5, prontidao: 4, atletismo: 4, ocultismo: 5,
    espWeapon: 3, espEsquiva: 2, valor: 4, conviccao: 4, temperanca: 3, vontade: 9,
    arma: 'espada-curta', armadura: 'leve', escudo: 'nenhum',
    tecnicas: [1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5],
    artes: [5, 3], // Fogo 5, Forças 3
  },
  t3def: {
    nome: 'T3 Defensivo — Muralha/Mago', tier: 3, centelha: 5, alvoXP: 1800,
    des: 4, vigor: 5, forca: 5, raciocinio: 3, percepcao: 3, inteligencia: 4,
    weaponSkill: 5, esquivaSkill: 5, escudosSkill: 5, prontidao: 4, resistencia: 5, ocultismo: 4,
    espWeapon: 2, espEsquiva: 3, valor: 4, conviccao: 5, temperanca: 4, vontade: 9,
    arma: 'espada-longa', armadura: 'media', escudo: 'escudo',
    tecnicas: [1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 5],
    artes: [4, 2], // Proteção 4, Cura 2
  },
};

function pv(b) { return regras.derivados.pv.base + b.vigor * regras.derivados.pv.vigorMult; }

// termo de Centelha na defesa por VARIANTE
const DEFVAR = {
  'flat (+C)': (c) => c,
  'meio (+⌈1.5C⌉)': (c) => ce(1.5 * c),
  'dobro (+2C)': (c) => 2 * c,
};

// valor PASSIVO de Defesa (melhor entre Esquiva e Bloqueio)
function defesaValor(b, centTerm, mod = 0) {
  const arm = ARM[b.armadura], esc = ESC[b.escudo], wpn = ARMAS[b.arma];
  const esq = (b.des + b.esquivaSkill) * 2 + (b.espEsquiva || 0) + centTerm + (arm.esquiva || 0);
  // bloqueio: usa a maior perícia de bloqueio; armadura NÃO penaliza bloqueio
  const blqSkill = Math.max(b.escudosSkill || 0, b.weaponSkill || 0);
  const blq = (b.des + blqSkill) * 2 + (b.espEsquiva || 0) + centTerm + (wpn.defesaArma || 0) + (esc.bloqueio || 0);
  return Math.max(esq, blq) + mod;
}

// penalidade de ferimento pelo % de PV
function ferimento(pvAtual, pvMax) {
  const pct = pvAtual <= 0 ? 0 : (pvAtual / pvMax) * 100;
  for (const f of regras.ferimentos) if (pct >= f.minPct && pct <= f.maxPct) return f;
  return regras.ferimentos[regras.ferimentos.length - 1];
}

// ---------- perfil ofensivo por REGIME ----------
// retorna dados extras no ATAQUE (rolagem, mexe hit% e margem), dados extras
// no DANO, e quanto da Defesa do alvo é ignorada (flat).
function ofensiva(b, regime, atkBonus) {
  // "as-is": num duelo aberto, os reforços de ATAQUE-rolagem são ~nulos
  //  (Bote/furtivo não vale em duelo). Há reforço de DANO modesto sustentável
  //  (ex.: Fúria +1d6 dano) e combos rasos. Não escala com Centelha no to-hit.
  let atkDice = 0, dmgDice = 0, defIgnore = 0;
  if (b.tier >= 1) dmgDice += 1;             // Fúria/golpe carregado sustentável
  if (regime === 'proj') {
    // projeção banda 7–15: Caminhos de tier alto que turbinam o TO-HIT e furam
    // a guarda, escalando com a banda acessível (≈ por tier de Centelha > 2).
    const tierAcima = Math.max(0, b.centelha - 2); // Cent3→1, Cent5→3
    atkDice += (atkBonus?.dicePerTier ?? 1) * tierAcima;
    defIgnore += (atkBonus?.ignorePerTier ?? 2) * tierAcima;
    dmgDice += tierAcima; // golpes maiores também
  }
  return { atkDice, dmgDice, defIgnore };
}

// ---------- uma troca de golpes (1 ataque) ----------
function umGolpe(att, def, centTermDef, regime, atkBonus, woundsOn, atkPV, defPV) {
  const wpn = ARMAS[att.arma], armDef = ARM[def.armadura];
  const of = ofensiva(att, regime, atkBonus);
  // pool de ataque
  const soma = att.des + att.weaponSkill;
  let dados = fl(soma / 2) + of.atkDice;
  let flat = (soma % 2 === 1 ? 2 : 0) + (wpn.acerto || 0) + (att.espWeapon || 0);
  if (woundsOn) { const f = ferimento(atkPV, pv(att)); flat += (f.penAcao ?? -5); } // pena de ação = flat à soma
  const atkSum = rollN(dados) + flat;
  // defesa do alvo (com pena de ferimento)
  let defMod = 0;
  if (woundsOn) { const f = ferimento(defPV, pv(def)); defMod += (f.penDefesa ?? -5); }
  const D = defesaValor(def, centTermDef, defMod) - of.defIgnore;

  if (atkSum > D) {
    // ACERTO: margem = +1d6/6 acima
    const margem = fl((atkSum - D) / 6);
    const wd = wpn.dado + margem + of.dmgDice;
    const forcaAp = wpn.maos === 2 ? att.forca : ce(att.forca / 2); // prosa = arredonda p/ cima
    const raw = rollN(wd) + (wpn.tags?.includes('distância') ? 0 : forcaAp);
    // soak
    const letal = wpn.tipoDano !== 'impacto';
    let soak = letal ? fl(def.vigor / 2) : def.vigor;
    const ruptura = wpn.tags?.includes('ruptura');
    soak += ruptura && !letal ? 0 : (armDef.soak || 0); // ruptura ignora soak de armadura (impacto)
    // penetração (perfurante): Pen ≤ Proteção anula
    if (wpn.tipoDano === 'perfurante' && (wpn.pen || 0) <= (armDef.protecao || 0)) return { hit: true, dano: 0, qa: false };
    return { hit: true, dano: Math.max(0, raw - soak) };
  }
  // ERRO: quase-acerto?
  const margemQA = (wpn.bonusQA || 0) + att.centelha;
  if (D - atkSum <= margemQA) {
    const dano = Math.max(0, (wpn.danoQA || 0) - (armDef.reducaoQA || 0));
    return { hit: false, qa: true, dano };
  }
  return { hit: false, qa: false, dano: 0 };
}

// ---------- métricas por golpe (alvo cheio de vida) ----------
function porGolpe(att, def, centTermDef, regime, atkBonus, N = 60000) {
  let hits = 0, qas = 0, dano = 0;
  for (let i = 0; i < N; i++) {
    const r = umGolpe(att, def, centTermDef, regime, atkBonus, false, pv(att), pv(def));
    if (r.hit) hits++; else if (r.qa) qas++;
    dano += r.dano;
  }
  return { hitPct: hits / N, qaPct: qas / N, danoMedio: dano / N };
}

// ---------- duelo completo (ticks + ferimentos + QA) ----------
const TICK_CAP = 600;
function duelo(A, B, centTermA, centTermB, regime, atkBonus, N = 8000) {
  let vitA = 0, vitB = 0, somaTicks = 0, draws = 0;
  const wA = ARMAS[A.arma].ticks, wB = ARMAS[B.arma].ticks;
  for (let i = 0; i < N; i++) {
    let hpA = pv(A), hpB = pv(B), tick = 0, tA = 0, tB = 0;
    while (hpA > 0 && hpB > 0 && tick < TICK_CAP) {
      if (tA <= tB) { const r = umGolpe(A, B, centTermB, regime, atkBonus, true, hpA, hpB); hpB -= r.dano; tA += wA; tick = Math.min(tA, tB); }
      else { const r = umGolpe(B, A, centTermA, regime, atkBonus, true, hpB, hpA); hpA -= r.dano; tB += wB; tick = Math.min(tA, tB); }
    }
    somaTicks += tick;
    if (hpA > 0 && hpB > 0) draws++;            // ninguém caiu no teto = impasse
    else if (hpA <= 0 && hpB <= 0) { vitA += .5; vitB += .5; }
    else if (hpB <= 0) vitA++; else if (hpA <= 0) vitB++;
  }
  return { winA: vitA / N, winB: vitB / N, ticksMedio: somaTicks / N, drawPct: draws / N };
}

// ============================ RELATÓRIO ============================
console.log('='.repeat(78));
console.log('VALIDAÇÃO DE XP (núcleo de combate + largura p/ fechar o alvo)');
console.log('='.repeat(78));
for (const k of Object.keys(BUILDS)) {
  const b = BUILDS[k];
  const core = xpCore(b);
  const larg = b.alvoXP - core;
  console.log(`${b.nome.padEnd(30)} Cent${b.centelha} | núcleo ${String(core).padStart(4)} XP | +largura ${String(larg).padStart(4)} → alvo ${b.alvoXP} | PV ${pv(b)}`);
}

console.log('\n' + '='.repeat(78));
console.log('DEFESAS POR VARIANTE (valor passivo; sem ferimento)');
console.log('='.repeat(78));
for (const k of Object.keys(BUILDS)) {
  const b = BUILDS[k];
  const ds = Object.entries(DEFVAR).map(([n, fn]) => `${n}=${defesaValor(b, fn(b.centelha))}`).join('  ');
  console.log(`${b.nome.padEnd(30)} Cent${b.centelha} | ${ds}`);
}

// helper de impressão de um cruzamento
function linhaGolpe(att, def, regime, atkBonus) {
  const out = [];
  for (const [vn, fn] of Object.entries(DEFVAR)) {
    const g = porGolpe(att, def, fn(def.centelha), regime, atkBonus);
    out.push(`${vn}: acerto ${(g.hitPct * 100).toFixed(0)}% +QA ${(g.qaPct * 100).toFixed(0)}% (E[dano] ${g.danoMedio.toFixed(1)})`);
  }
  return out;
}

for (const regime of ['as-is', 'proj']) {
  console.log('\n' + '='.repeat(78));
  console.log(`POR GOLPE — regime ${regime.toUpperCase()} (alvo cheio; 3 variantes de Defesa)`);
  console.log('='.repeat(78));
  const pares = [
    // ESPELHADO (iguais vs iguais)
    ['ESPELHADO off', 't1off', 't1off'], ['ESPELHADO off', 't2off', 't2off'], ['ESPELHADO off', 't3off', 't3off'],
    ['ESPELHADO def', 't1def', 't1def'], ['ESPELHADO def', 't2def', 't2def'], ['ESPELHADO def', 't3def', 't3def'],
    // ASSIMÉTRICO (ofensivo bate no defensivo, mesmo tier)
    ['ASSIM off→def', 't1off', 't1def'], ['ASSIM off→def', 't2off', 't2def'], ['ASSIM off→def', 't3off', 't3def'],
  ];
  for (const [rot, ak, dk] of pares) {
    const att = BUILDS[ak], def = BUILDS[dk];
    console.log(`\n[${rot}] T${att.tier}  ${att.nome.split('—')[1].trim()} → ${def.nome.split('—')[1].trim()} (Def Cent${def.centelha})`);
    for (const l of linhaGolpe(att, def, regime, { dicePerTier: 1, ignorePerTier: 2 })) console.log('   ' + l);
  }
}

for (const regime of ['as-is', 'proj']) {
  console.log('\n' + '='.repeat(78));
  console.log(`DUELO COMPLETO — regime ${regime.toUpperCase()} (win% do 1º; impasse = ninguém cai em ${TICK_CAP} ticks)`);
  console.log('='.repeat(78));
  const pares = [['ESPELHADO off', 'off', 'off'], ['ESPELHADO def', 'def', 'def'], ['ASSIM off→def', 'off', 'def']];
  for (const [rot, ak, dk] of pares) {
    for (const t of [1, 2, 3]) {
      const A = BUILDS['t' + t + ak], B = BUILDS['t' + t + dk];
      const cols = Object.entries(DEFVAR).map(([vn, fn]) => {
        const d = duelo(A, B, fn(A.centelha), fn(B.centelha), regime, { dicePerTier: 1, ignorePerTier: 2 }, 4000);
        return `${vn.split(' ')[0]}:win${(d.winA * 100).toFixed(0)}/draw${(d.drawPct * 100).toFixed(0)}/t${d.ticksMedio.toFixed(0)}`;
      });
      console.log(`[${rot}] T${t}  ${cols.join('  ')}`);
    }
  }
}

// ============================ SWEEP ============================
// Pergunta central: qual inclinação de Centelha na defesa mantém o % de acerto
// ESPELHADO ~constante entre tiers, dado X de ofensiva-por-tier?
console.log('\n' + '='.repeat(78));
console.log('SWEEP — acerto ESPELHADO (off vs off) por tier × inclinação de defesa');
console.log('  varia a OFENSIVA projetada por tier (dados de to-hit ganhos por Centelha>2)');
console.log('='.repeat(78));
const slopes = { '+C (flat)': (c) => c, '+1.5C': (c) => ce(1.5 * c), '+2C': (c) => 2 * c };
for (const dpt of [0, 1, 2, 3]) {
  console.log(`\n--- ofensiva projetada: +${dpt}d6 to-hit por tier de Centelha (e +${dpt * 2} ignora-Defesa) ---`);
  console.log('          tier1(C1)   tier2(C3)   tier3(C5)');
  for (const [sn, sf] of Object.entries(slopes)) {
    const cells = [1, 2, 3].map((t) => {
      const off = BUILDS['t' + t + 'off'];
      const g = porGolpe(off, off, sf(off.centelha), 'proj', { dicePerTier: dpt, ignorePerTier: dpt * 2 }, 40000);
      return `${(g.hitPct * 100).toFixed(0)}%+${(g.qaPct * 100).toFixed(0)}`.padEnd(11);
    });
    console.log(`${sn.padEnd(10)}${cells.join(' ')}`);
  }
}

// Plano B: Centelha no ATAQUE, defesa flat
console.log('\n' + '='.repeat(78));
console.log('PLANO B — Centelha tb no ATAQUE (+C à soma), defesa FLAT (+C). Acerto espelhado.');
console.log('='.repeat(78));
function porGolpeAtkC(att, def, regime, atkBonus, N = 40000) {
  let hits = 0, qas = 0;
  for (let i = 0; i < N; i++) {
    const r = umGolpe({ ...att, espWeapon: (att.espWeapon || 0) + att.centelha }, def, def.centelha, regime, atkBonus, false, pv(att), pv(def));
    if (r.hit) hits++; else if (r.qa) qas++;
  }
  return { hitPct: hits / N, qaPct: qas / N };
}
console.log('          tier1(C1)   tier2(C3)   tier3(C5)');
for (const dpt of [0, 2]) {
  const cells = [1, 2, 3].map((t) => {
    const off = BUILDS['t' + t + 'off'];
    const g = porGolpeAtkC(off, off, 'proj', { dicePerTier: dpt, ignorePerTier: dpt * 2 });
    return `${(g.hitPct * 100).toFixed(0)}%+${(g.qaPct * 100).toFixed(0)}`.padEnd(11);
  });
  console.log(`proj+${dpt}d6  ${cells.join(' ')}`);
}

// ---------- VÁLVULA QA: dano de raspão escala com Centelha? ----------
// Hoje QA dano = danoQA(arma) − reducaoQA(armadura) → arma leve (1) vs qualquer
// armadura (≥1) = 0. A válvula entope no high-end. Testa QA dano + Centelha.
console.log('\n' + '='.repeat(78));
console.log('VÁLVULA QA — E[dano]/golpe no ESPELHADO (defesa FLAT, as-is). Atual vs +Centelha');
console.log('='.repeat(78));
function eDanoQA(att, def, valvula, N = 60000) {
  const wpn = ARMAS[att.arma], armDef = ARM[def.armadura];
  let dano = 0, qas = 0;
  for (let i = 0; i < N; i++) {
    const r = umGolpe(att, def, def.centelha, 'as-is', null, false, pv(att), pv(def));
    if (r.hit) { dano += r.dano; }
    else if (r.qa) {
      qas++;
      const base = valvula === 'atual' ? Math.max(0, (wpn.danoQA || 0) - (armDef.reducaoQA || 0))
        : Math.max(0, (wpn.danoQA || 0) + att.centelha - (armDef.reducaoQA || 0));
      dano += base;
    }
  }
  return { eDano: dano / N, qaPct: qas / N };
}
for (const ak of ['off', 'def']) {
  for (const t of [1, 2, 3]) {
    const b = BUILDS['t' + t + ak];
    const a = eDanoQA(b, b, 'atual'), c = eDanoQA(b, b, 'maisC');
    console.log(`T${t} ${ak}  QA ${(a.qaPct * 100).toFixed(0)}% | E[dano] atual=${a.eDano.toFixed(2)}  +Centelha=${c.eDano.toFixed(2)}`);
  }
}
