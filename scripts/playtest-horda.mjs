// playtest-horda.mjs — joga encontros CONCRETOS com a Regra de Horda, rodada a rodada,
// com dados reais e narração. Complementa o Monte Carlo de sim-horda.mjs (que dá só %).
// Objetivo: sentir o ritmo e caçar casos de borda. Determinístico (PRNG semeado).
// Roda: node scripts/playtest-horda.mjs

let _s = 20260628;
function seed(x) { _s = x >>> 0; }
function rnd() { _s = (_s * 1103515245 + 12345) & 0x7fffffff; return _s / 0x7fffffff; }
function d6() { return 1 + Math.floor(rnd() * 6); }
function pool(nd) { const r = []; for (let i = 0; i < nd; i++) r.push(d6()); return r; }
const soma = (a) => a.reduce((x, y) => x + y, 0);
const mag = (n) => (n <= 1 ? 0 : Math.floor(Math.log2(n)));

function linha(s) { console.log(s); }
function hr(t) { console.log('\n' + '─'.repeat(64) + '\n' + t + '\n' + '─'.repeat(64)); }

// PC ataca o esquadrão. Retorna baixas.
function pcAtaca(pc, sq) {
  const def = sq.membroDef - 2; // aglomerado
  const dadosAc = pool(pc.acertoDados);
  const acerto = soma(dadosAc) + pc.acertoFlat;
  if (acerto <= def) { linha(`   ${pc.nome} ataca: ${soma(dadosAc)}+${pc.acertoFlat}=${acerto} vs Def ${def} → ERRA.`); return 0; }
  const margem = Math.floor((acerto - def) / 6);
  const dadosDn = pool(pc.danoDados + margem);
  const dano = Math.max(0, soma(dadosDn) + pc.danoFlat - sq.membroSoak);
  const antes = sq.membros;
  sq.hp -= dano;
  sq.membros = Math.max(0, Math.ceil(sq.hp / sq.pvMembro));
  const baixas = antes - sq.membros;
  linha(`   ${pc.nome} ataca: ${acerto} vs Def ${def} (margem ${margem}) → ${dano} de dano. ` +
        `Baixas: ${baixas}. [esquadrão ${antes}→${sq.membros}, PV ${Math.max(0, Math.round(sq.hp))}]`);
  return baixas;
}

// Esquadrão ataca um PC. M soma no acerto E no dano.
function hordaAtaca(sq, alvo) {
  const M = mag(sq.membros);
  const dadosAc = pool(sq.membroAtkDados + M);
  const acerto = soma(dadosAc) + sq.membroAtkFlat;
  if (acerto <= alvo.def) { linha(`   Esquadrão (Mag ${M}) ataca ${alvo.nome}: ${acerto} vs Def ${alvo.def} → não passa.`); return; }
  const margem = Math.floor((acerto - alvo.def) / 6);
  const dadosDn = pool(sq.membroDanoDados + M + margem);
  const dano = Math.max(0, soma(dadosDn) + sq.membroDanoFlat - alvo.soak);
  alvo.pv -= dano;
  linha(`   Esquadrão (Mag ${M}) ataca ${alvo.nome}: ${acerto} vs Def ${alvo.def} → ${dano} de dano. [${alvo.nome} PV ${Math.max(0, alvo.pv)}/${alvo.pvMax}]`);
}

function esquadrao(nome, n, tier) {
  const T = {
    comum:    { pvMembro: 5,  membroDef: 6,  membroSoak: 1, membroAtkDados: 1, membroAtkFlat: 3, membroDanoDados: 1, membroDanoFlat: 2 },
    treinado: { pvMembro: 10, membroDef: 9,  membroSoak: 5, membroAtkDados: 2, membroAtkFlat: 4, membroDanoDados: 1, membroDanoFlat: 3 },
    elite:    { pvMembro: 15, membroDef: 12, membroSoak: 9, membroAtkDados: 2, membroAtkFlat: 5, membroDanoDados: 2, membroDanoFlat: 3 },
  }[tier];
  return { nome, membros: n, pvMembro: T.pvMembro, hp: n * T.pvMembro, ...T };
}

function encontro(titulo, pcs, sq, { maxRodadas = 30, foco = 0 } = {}) {
  hr(titulo);
  linha(`Esquadrão: ${sq.membros} × ${sq.nome} (PV/membro ${sq.pvMembro}) → PV total ${sq.hp}, Magnitude ${mag(sq.membros)}.`);
  pcs.forEach(p => linha(`PC: ${p.nome} — PV ${p.pv}, Defesa ${p.def}, Absorção ${p.soak}.`));
  for (let r = 1; r <= maxRodadas; r++) {
    linha(`\n• Rodada ${r}`);
    // PCs agem
    for (const pc of pcs.filter(p => p.pv > 0)) {
      const golpes = pc.golpes || 1;
      for (let g = 0; g < golpes && sq.membros > 0; g++) pcAtaca(pc, sq);
    }
    if (sq.membros <= 0) { linha(`\n>>> Esquadrão ANIQUILADO na rodada ${r}. ${pcs.filter(p=>p.pv>0).map(p=>p.nome).join(' e ')} de pé.`); return; }
    if (mag(sq.membros) === 0) linha(`   (Magnitude 0 — resta 1 ${sq.nome}: vira um NPC comum normal a partir daqui.)`);
    // Horda age — foca o alvo de menor PV vivo
    const vivos = pcs.filter(p => p.pv > 0);
    if (!vivos.length) { linha(`\n>>> Todos os PCs caíram na rodada ${r}. A multidão venceu.`); return; }
    const alvo = vivos.reduce((a, b) => (b.pv < a.pv ? b : a));
    hordaAtaca(sq, alvo);
    if (alvo.pv <= 0) linha(`   !! ${alvo.nome} CAIU.`);
  }
  linha(`\n>>> ${maxRodadas} rodadas sem desfecho.`);
}

function pc(nome, o) { return { nome, pvMax: o.pv, ...o }; }

// ---- Personagens (números explícitos, estilo capitã Cent2) ----
const sora = () => pc('Sora', { pv: 37, def: 18, soak: 8, acertoDados: 5, acertoFlat: 8, danoDados: 3, danoFlat: 8 }); // montante 3d6+8
const bram = () => pc('Bram', { pv: 34, def: 12, soak: 2, acertoDados: 3, acertoFlat: 5, danoDados: 2, danoFlat: 3 });
const arq  = () => pc('Tula (arqueira)', { pv: 31, def: 14, soak: 2, acertoDados: 4, acertoFlat: 6, danoDados: 2, danoFlat: 4 });

seed(20260628);
encontro('CENÁRIO 1 — Sora sozinha vs 12 Guardas da Cidade (Treinado)', [sora()], esquadrao('Guarda', 12, 'treinado'));
encontro('CENÁRIO 2 — Sora sozinha vs 30 Bandidos (Comum): morte pela multidão', [sora()], esquadrao('Bandido', 30, 'comum'));
encontro('CENÁRIO 3 — Trio (Sora+Bram+Tula) vs 24 Bandidos (Comum)', [sora(), bram(), arq()], esquadrao('Bandido', 24, 'comum'));
encontro('CENÁRIO 4 — borda: Sora vs 3 Comuns (Magnitude 1 → 0)', [sora()], esquadrao('Recruta', 3, 'comum'));

// CENÁRIO 5 — golpe em ÁREA (Proeza/feitiço) bate direto no PV do esquadrão
hr('CENÁRIO 5 — Veil solta um feitiço em ÁREA num esquadrão de 16 Comuns');
const sq5 = esquadrao('Saqueador', 16, 'comum');
linha(`Esquadrão: 16 × Saqueador → PV ${sq5.hp}, Magnitude ${mag(sq5.membros)}.`);
const aoe = soma(pool(8)) + 6; // ex.: 8d6 + 6 de potência, ignora aglomeração (acerta a área)
const antes = sq5.membros; sq5.hp -= aoe; sq5.membros = Math.max(0, Math.ceil(sq5.hp / sq5.pvMembro));
linha(`Feitiço em área: ${aoe} de dano direto no PV → baixas ${antes - sq5.membros} [16→${sq5.membros}, Magnitude ${mag(sq5.membros)}].`);
linha(`(Um único efeito de área cortou ${antes - sq5.membros} de uma vez e derrubou a Magnitude de ${mag(antes)} para ${mag(sq5.membros)}.)`);
