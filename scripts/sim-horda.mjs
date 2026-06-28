// sim-horda.mjs — valida a Regra de Horda (modelo "esquadrão único" / Magnitude)
// Decisões travadas pelo usuário:
//  - Ofensiva exponencial: Magnitude M = floor(log2(membros)). O esquadrão faz UM ataque por
//    inimigo engajado, até M+1 (contra alvo solo = 1 ataque concentrado, +M d6 no acerto e no dano).
//    NB: este Monte Carlo é SOLO (1 herói) → 1 ataque/rodada = exatamente o caso validado.
//    O bloco "CALIBRAÇÃO v2" mostra por que "M+1 ataques SEMPRE (mesmo no solo)" é inbalanceável.
//  - Baixas: PV do esquadrão = N × PV_membro; dano acumula; membro cai quando o dano passa o PV dele.
//    (membros restantes = ceil(hordaHP / PV_membro)) — dano grande transborda e derruba vários.
//  - Defesa: −2 (aglomerado, alvo fácil).
//  - Pressão: nenhuma extra (a ameaça é o pool maior).
// Roda: node scripts/sim-horda.mjs   (determinístico via Monte Carlo grande)

const TRIALS = 4000;

// PRNG simples (sem Math.random p/ ser reprodutível entre execuções)
let _s = 1234567;
function rnd() { _s = (_s * 1103515245 + 12345) & 0x7fffffff; return _s / 0x7fffffff; }
function d6() { return 1 + Math.floor(rnd() * 6); }
function rollPool(nd) { let t = 0; for (let i = 0; i < nd; i++) t += d6(); return t; }

// Magnitude exponencial: cada degrau ~dobra o nº de membros.
function magnitude(n) { return n <= 1 ? 0 : Math.floor(Math.log2(n)); }

// Um ataque: rola pool de dados (+flat) vs alvo. Retorna {hit, soma, margemDados}.
function ataque(nd, flat, alvoDef) {
  const soma = rollPool(nd) + flat;
  if (soma <= alvoDef) return { hit: false, soma, margem: 0 };
  return { hit: true, soma, margem: Math.floor((soma - alvoDef) / 6) };
}
// Dano: (dados de dano + margem) d6 + bônus plano − absorção, mín 0.
function dano(ddDano, bonusPlano, margemDados, absorcao) {
  return Math.max(0, rollPool(ddDano + margemDados) + bonusPlano - absorcao);
}

function umaLuta(hero, membro, N0, opts) {
  const { pvMembro } = opts;
  let heroPV = hero.pv;
  let hordaHP = N0 * pvMembro;
  let N = N0;
  let kills1 = null; // baixas no 1º turno do herói
  for (let round = 1; round <= 60; round++) {
    // ---- Turno do herói: heroAtaques golpes ----
    let killsEsteTurno = 0;
    for (let k = 0; k < hero.ataques && N > 0; k++) {
      const a = ataque(hero.nd, hero.flat, membro.def - 2); // −2 aglomerado
      if (a.hit) {
        const dmg = dano(hero.dDano, hero.bDano, a.margem, membro.absorcao);
        hordaHP -= dmg;
        const Nnovo = Math.max(0, Math.ceil(hordaHP / pvMembro));
        killsEsteTurno += (N - Nnovo);
        N = Nnovo;
      }
    }
    if (kills1 === null) kills1 = killsEsteTurno;
    if (N <= 0) return { heroVenceu: true, round, kills1 };
    // ---- Turno da horda ----
    const M = magnitude(N);
    // nº de ataques e bônus de dano por ataque são parametrizáveis (calibração):
    const nAtk = opts.nAtkFn ? opts.nAtkFn(M) : 1;                       // padrão: 1 ataque
    const danoB = opts.danoBonusFn ? opts.danoBonusFn(M) : (opts.magNoDano ? M : 0);
    for (let i = 0; i < nAtk; i++) {
      const a = ataque(membro.nd + M, membro.flat, hero.def); // +M d6 no acerto (conectar)
      if (a.hit) {
        heroPV -= dano(membro.dDano, membro.bDano, a.margem + danoB, hero.absorcao);
        if (heroPV <= 0) return { heroVenceu: false, round, kills1 };
      }
    }
  }
  return { heroVenceu: false, round: 60, kills1, empate: true };
}

function cenario(nome, hero, membro, tamanhos, opts) {
  console.log(`\n=== ${nome}  (PV/capanga = ${opts.pvMembro}) ===`);
  console.log('  N  | Mag | dados horda | vit%  | rounds | baixas 1º turno');
  for (const N of tamanhos) {
    let vit = 0, somaR = 0, somaK = 0, n = 0;
    for (let t = 0; t < TRIALS; t++) {
      const r = umaLuta(hero, membro, N, opts);
      if (r.heroVenceu) vit++;
      somaR += r.round; somaK += r.kills1; n++;
    }
    const M = magnitude(N);
    console.log(
      `  ${String(N).padStart(2)} |  ${M}  |  ${membro.nd}+${M}d6     | ${String((100*vit/n).toFixed(0)).padStart(3)}%  | ${(somaR/n).toFixed(1).padStart(5)}  | ${(somaK/n).toFixed(1)}`
    );
  }
}

// ---- Herói competente (lutador Centelha 2, espada/montante) ----
// Ataque: pool 4d6 + flat 6 (acerto+Centelha×2). Dano: montante 3d6 + 8 (Força 4 × 2 mãos).
const hero = { nd: 4, flat: 6, dDano: 3, bDano: 8, def: 16, pv: 37, absorcao: 8, ataques: 1 };
// ---- Capanga comum (Camponês/Soldado raso): pool 1d6 + flat 3, faca 1d6+2 corte ----
const membro = { nd: 1, flat: 3, dDano: 1, bDano: 2, def: 6, absorcao: 1 };

const tamanhos = [3, 5, 8, 12, 20, 40];

console.log('############ COMPARAÇÃO: PV-por-capanga ############');
cenario('A) PV de capanga = PV cheio do bestiário (piso heroico 25)', hero, membro, tamanhos, { pvMembro: 31 });
cenario('B) PV de capanga = fodder, SEM piso heroico (Vigor×3 ~ 5)', hero, membro, tamanhos, { pvMembro: 5 });
cenario('C) PV de capanga = fodder médio (10)', hero, membro, tamanhos, { pvMembro: 10 });

console.log('\n############ HERÓI COM 2 GOLPES/RODADA (Ticks) — PV fodder 8 ############');
cenario('D) herói 2 ataques, PV capanga 8', { ...hero, ataques: 2 }, membro, tamanhos, { pvMembro: 8 });

console.log('\n############ MODELO FINAL — Magnitude no acerto E no dano, PV fixo por tier ############');
const heroFraco = { ...hero, pv: 31, absorcao: 2 };
console.log('\n--- HERÓI TANQUE (PV37/soak8/Def16) ---');
cenario('Capanga Comum (PV 5)',    hero, membro, tamanhos, { pvMembro: 5,  magNoDano: true });
cenario('Capanga Treinado (PV 10)', hero, { ...membro, def: 9, absorcao: 5, nd: 2, flat: 4 }, tamanhos, { pvMembro: 10, magNoDano: true });
cenario('Capanga Elite (PV 15)',    hero, { ...membro, def: 12, absorcao: 9, nd: 2, flat: 5, dDano: 2 }, tamanhos, { pvMembro: 15, magNoDano: true });
console.log('\n--- HERÓI LEVE (PV31/soak2/Def16) ---');
cenario('Capanga Comum (PV 5)',    heroFraco, membro, tamanhos, { pvMembro: 5,  magNoDano: true });
cenario('Capanga Treinado (PV 10)', heroFraco, { ...membro, def: 9, absorcao: 5, nd: 2, flat: 4 }, tamanhos, { pvMembro: 10, magNoDano: true });

console.log('\n\n############ CALIBRAÇÃO v2 — Magnitude+1 ATAQUES (modelo do usuário) ############');
console.log('Benchmark a preservar (solo): tanque aguenta ~20 Comuns, morre ~30-40; ~8 Treinados.');
const ceilM2 = (M) => Math.ceil(M / 2);
const Mp1 = (M) => M + 1;
const tank = hero;                          // PV37/soak8/Def16
const leve = { ...hero, pv: 31, absorcao: 2 };
const comum = membro;                        // 1d6+3 atk, dano 1d6+2, def6, soak1
const trein = { ...membro, def: 9, absorcao: 5, nd: 2, flat: 4, dDano: 1, bDano: 3 };
const modelos = [
  ['BASE validado (1 atq, +M dano)', { nAtkFn: () => 1, danoBonusFn: (M) => M }],
  ['v2: M+1 atq, dano +ceil(M/2)',   { nAtkFn: Mp1,     danoBonusFn: ceilM2 }],
  ['v2: M+1 atq, dano +0 (só margem)',{ nAtkFn: Mp1,     danoBonusFn: () => 0 }],
];
for (const [nome, op] of modelos) {
  console.log(`\n--- ${nome} ---`);
  for (const [hn, h] of [['Tanque', tank], ['Leve', leve]]) {
    for (const [mn, m, pv] of [['Comum', comum, 5], ['Treinado', trein, 10]]) {
      const row = [12, 20, 30, 40].map(N => {
        let vit = 0; for (let t = 0; t < TRIALS; t++) if (umaLuta(h, m, N, { pvMembro: pv, ...op }).heroVenceu) vit++;
        return `${String(N).padStart(2)}:${String(Math.round(100*vit/TRIALS)).padStart(3)}%`;
      }).join('  ');
      console.log(`  ${hn.padEnd(6)} vs ${mn.padEnd(9)} | ${row}`);
    }
  }
}
