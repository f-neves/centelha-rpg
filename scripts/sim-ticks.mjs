// sim-ticks.mjs — banco de provas da REVISÃO DA LINHA DO TEMPO.
//
// Testa a proposta de trocar a Velocidade única por um par Preparo/Recuperação
// (P/R, com P+R = a Velocidade de hoje), mais os dois mecanismos que ela abre:
// o empurrão (bater em quem está em Preparo atrasa o golpe dele) e a dívida de
// Ticks (reagir fora da vez tomando emprestado do próprio futuro).
//
// O motor de combate é o do `sim-duelo.mjs` (mesmo acerto, Margem, Quase-Acerto,
// Absorção, gate de Perfuração e guarda sob pressão), para que a comparação seja
// contra a linha de base já calibrada e não contra um modelo novo inteiro.
//
// Uso: node scripts/sim-ticks.mjs            (baterias A–H)
//      node scripts/sim-ticks.mjs --seed 7   (outra semente)
//      node scripts/sim-ticks.mjs --n 30000  (mais tentativas por célula)
//
// O gerador é semeado de propósito: um teste de balanceamento que muda de
// resposta a cada rodada não serve para decidir nada.

// ---------------------------------------------------------------- infra
const ARG = Object.fromEntries(
  process.argv.slice(2).join(' ').split('--').filter(Boolean)
    .map((s) => s.trim().split(/\s+/)).map(([k, v]) => [k, v ?? 'true']),
);
const N = Number(ARG.n || 12000);
const SEED = Number(ARG.seed || 20260818);

let _s = SEED >>> 0 || 1;
function reseed(n) { _s = (n >>> 0) || 1; }
function rnd() {
  _s ^= _s << 13; _s >>>= 0;
  _s ^= _s >>> 17;
  _s ^= _s << 5; _s >>>= 0;
  return _s / 4294967296;
}
const d6 = () => 1 + Math.floor(rnd() * 6);
const floor = Math.floor;
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const sgn = (x, casas = 1) => `${x >= 0 ? '+' : '−'}${Math.abs(x).toFixed(casas)}`;

// ---------------------------------------------------------------- regras fixas
const P_GUARDA = 2;                                   // guarda sob pressão, por ataque
const QA_W = { 1: { b: 3, d: 2 }, 2: { b: 2, d: 4 }, 3: { b: 1, d: 6 } };
const QA_A = { nenhuma: { b: 0, r: 0 }, leve: { b: 1, r: 0 }, media: { b: 2, r: 2 }, pesada: { b: 3, r: 4 } };
const MODE_CAT = { corte: 'corte', impacto: 'impacto', perfurante: 'perfuracao' };
const GATE = { perfurante: 1 };

// Preparo por classe: a proposta que está em discussão. P + R = a Velocidade de hoje,
// então a cadência não muda; o que muda é ONDE dentro da janela o golpe cai.
const PREPARO = { leve: 0, media: 1, haste: 0, pesada: 2, arte: 7 };

const ARMAS = {
  Adaga:    { cl: 'leve',   spd: 5, die: 1, acc: 2, hands: 1, mode: 'perfurante', perf: 0 },
  EspCurta: { cl: 'leve',   spd: 5, die: 1, acc: 2, hands: 1, mode: 'corte',      perf: 0 },
  EspLonga: { cl: 'media',  spd: 6, die: 2, acc: 1, hands: 1, mode: 'corte',      perf: 0 },
  Machado:  { cl: 'media',  spd: 6, die: 2, acc: 1, hands: 1, mode: 'corte',      perf: 0 },
  Maca:     { cl: 'media',  spd: 6, die: 2, acc: 1, hands: 1, mode: 'impacto',    perf: 0 },
  Picareta: { cl: 'media',  spd: 6, die: 2, acc: 1, hands: 1, mode: 'perfurante', perf: 2 },
  Lanca:    { cl: 'haste',  spd: 6, die: 2, acc: 1, hands: 2, mode: 'perfurante', perf: 1 },
  Montante: { cl: 'pesada', spd: 7, die: 3, acc: 0, hands: 2, mode: 'corte',      perf: 1 },
  Martelo:  { cl: 'pesada', spd: 7, die: 3, acc: 0, hands: 2, mode: 'impacto',    perf: 2 },
  // O feiticeiro de grau 6: Preparo 7, Recuperação 0, e um golpe que vale por três.
  Arte:     { cl: 'arte',   spd: 7, die: 6, acc: 1, hands: 1, mode: 'impacto',    perf: 3 },
};
const ARMAD = {
  Nenhuma: { classe: 'nenhuma', i: 0, c: 0,  p: 0, rp: 0, pen: 0 },
  Couro:   { classe: 'leve',    i: 2, c: 4,  p: 1, rp: 1, pen: 1 },
  Malha:   { classe: 'media',   i: 1, c: 8,  p: 1, rp: 1, pen: 2 },
  Lamelar: { classe: 'media',   i: 3, c: 8,  p: 3, rp: 1, pen: 2 },
  Placa:   { classe: 'pesada',  i: 6, c: 11, p: 4, rp: 3, pen: 3 },
};

// ---------------------------------------------------------------- modelos
// Cada modelo é um conjunto de chaves. `preparo: false` é a regra de hoje.
const APARO_PADRAO = { custo: 2, bonus: 6, limiar: .45, teto: 12, umaPorJanela: false };
const MODELOS = {
  hoje:       { preparo: false, guardaEm: 'resolve', empurrao: 0, aparo: null, comp: null },
  PR:         { preparo: true,  guardaEm: 'resolve', empurrao: 0, aparo: null, comp: null },
  PRdecl:     { preparo: true,  guardaEm: 'declara', empurrao: 0, aparo: null, comp: null },
  PRcomp:     { preparo: true,  guardaEm: 'resolve', empurrao: 0, aparo: null, comp: 'margem' },
  PRempurra1: { preparo: true,  guardaEm: 'resolve', empurrao: 1, aparo: null, comp: null },
  PRempurra2: { preparo: true,  guardaEm: 'resolve', empurrao: 2, aparo: null, comp: null },
  PRdivida:   { preparo: true,  guardaEm: 'resolve', empurrao: 0, aparo: APARO_PADRAO, comp: null },
  completo:   { preparo: true,  guardaEm: 'resolve', empurrao: 1, redirecionar: true, comp: null,
                aparo: { custo: 3, bonus: 6, limiar: .20, teto: 12, umaPorJanela: true } },
};

function lutador({ ah = 10, centelha = 1, vigor = 4, dmgAttr = 4, pv = 37, arma = 'EspLonga', armadura = 'Nenhuma', carga = null } = {}) {
  const w = ARMAS[arma], a = ARMAD[armadura];
  return {
    nome: arma, ah, centelha, vigor, dmgAttr, pvMax: pv, pv,
    die: w.die, acc: w.acc, hands: w.hands, mode: w.mode, perf: w.perf,
    // Carga voluntária: N Ticks a mais de Preparo (a Recuperação não muda, então o ciclo
    // inteiro cresce N) em troca de um bônus na rolagem. É o "Mirar" generalizado.
    carga,
    spd: w.spd + (carga?.n || 0), cl: w.cl, prep: (PREPARO[w.cl] ?? 0) + (carga?.n || 0),
    arm: a, armClasse: a.classe, pen: a.pen,
    guard: 0, guardaTravada: false, proxDecl: 0, pend: null, divida: 0, dividaMax: 0, aparosNaJanela: 0,
    // contadores de diagnóstico
    golpesFeitos: 0, golpesPerdidos: 0, redirecionados: 0, acoesDeclaradas: 0, acoesConcluidas: 0, foraDeHora: 0, foraNaJanela: 0, ticksDevidos: 0, empurroesSofridos: 0, aparosGastos: 0, aparosFeitos: 0,
    janelasVistas: 0, janelasAproveitadas: 0, declaracoes: 0,
  };
}

const baseDef = (c) => c.ah * 2 + c.centelha * 2 - c.pen;
const poolDice = (c) => floor(c.ah / 2);
function rolarAtaque(c) {
  let s = 0; for (let i = 0; i < poolDice(c); i++) s += d6();
  return s + (c.ah % 2 ? 2 : 0) + c.acc + c.centelha * 2 - c.pen;
}

// Resolve um golpe já declarado. `M` é o modelo em vigor.
function atacar(A, D, M, forcado = 0) {
  A.golpesFeitos++;
  let efDef = baseDef(D) - P_GUARDA * D.guard;

  // Dívida de Ticks: aparo desesperado. O defensor compra +bonus de Defesa contra
  // ESTE golpe pagando Ticks que empurram a própria linha do tempo para frente.
  if (M.aparo && D.pv > 0 && D.pv / D.pvMax < M.aparo.limiar
      && D.divida + M.aparo.custo <= M.aparo.teto
      && !(M.aparo.umaPorJanela && D.aparosNaJanela > 0)
      && !(M.aparo.umaPorCena && D.aparosFeitos > 0)) {
    efDef += M.aparo.bonus;
    D.divida += M.aparo.custo; D.dividaMax = Math.max(D.dividaMax, D.divida);
    D.aparosGastos += M.aparo.custo; D.aparosFeitos++; D.aparosNaJanela++;
    D.proxDecl += M.aparo.custo;
    if (D.pend) D.pend.resolveEm += M.aparo.custo;
  }

  const total = rolarAtaque(A) - forcado + (A.carga?.bonus || 0);
  const qa = QA_W[A.die] || QA_W[3];   // a Arte usa um dado fora da escada das armas
  const qaMargem = qa.b + QA_A[D.armClasse].b;
  let dano = 0, acertou = false;
  if (total > efDef) {
    acertou = true;
    let m = floor((total - efDef) / 6);
    // Compensação do Preparo: quem se compromete antes bate mais fundo (+1 Margem).
    if (M.comp === 'margem' && A.prep > 0) m += 1;
    const cat = MODE_CAT[A.mode];
    const armSoak = cat === 'impacto' ? D.arm.i : cat === 'corte' ? D.arm.c : D.arm.p;
    const soakNat = A.mode === 'impacto' ? D.vigor : floor(D.vigor / 2);
    const soak = soakNat + D.centelha + armSoak;
    const fechado = GATE[A.mode] && A.perf < D.arm.rp;
    if (!fechado) {
      let dmg = A.dmgAttr * (A.hands === 2 ? 2 : 1) - soak;
      for (let i = 0; i < A.die + m; i++) dmg += d6();
      dano = Math.max(0, dmg);
    }
  } else if (total >= efDef - qaMargem) {
    dano = Math.max(0, qa.d - QA_A[D.armClasse].r);
  }

  // Empurrão: o golpe que conecta em quem está montando o próprio atrasa o dele.
  // Um golpe desferido FORA DA HORA (forcado > 0 sinaliza a interrupção) pode valer mais:
  // atrasar por um K maior, ou cancelar a ação montada de vez.
  let K = A.interrompendo ? (M.interrupcao ?? M.empurrao) : M.empurrao;
  // 'espelho': o alvo perde exatamente o tempo que o interruptor pagou. Simétrico e
  // auto-calibrante (uma arma pesada interrompe por 7, uma leve por 5).
  if (K === 'espelho') K = A.spd;
  if (acertou && D.pend && K) {
    if (K === 'cancela') { D.pend = null; D.abortados = (D.abortados || 0) + 1; }
    else if (K) {
      let k = K;
      if (M.tetoAtraso) {                       // o atraso total de uma ação não passa do teto
        const jaAtrasado = D.pend.atraso || 0;
        k = Math.max(0, Math.min(k, Math.round(D.spd * M.tetoAtraso) - jaAtrasado));
        D.pend.atraso = jaAtrasado + k;
      }
      D.pend.resolveEm += k; D.proxDecl += k;
    }
    D.empurroesSofridos++;
    A.janelasAproveitadas++;
  }

  D.pv -= dano;
  A.guard += P_GUARDA; D.guard += P_GUARDA;
  return dano;
}

// ---------------------------------------------------------------- motor de cena
// Uma cena genérica: dois times, cada um com uma lista de lutadores. Retorna o
// vencedor ('A' | 'B' | 'empate'), o tick em que acabou e os contadores.
function cena(timeA, timeB, M, tetoTicks = 4000) {
  const todos = [...timeA, ...timeB];
  const timeDe = (c) => (timeA.includes(c) ? timeA : timeB);
  const inimigosDe = (c) => (timeA.includes(c) ? timeB : timeA).filter((x) => x.pv > 0);

  for (const c of todos) c.proxDecl = 1 + Math.floor(rnd() * c.spd);

  for (let t = 1; t <= tetoTicks; t++) {
    // 1) declarações: quem está livre e chegou a hora escolhe alvo e começa a ação.
    for (const c of todos) {
      if (c.pv <= 0 || c.pend || c.proxDecl !== t) continue;
      const alvos = inimigosDe(c);
      if (!alvos.length) continue;
      // Foco de fogo: mira em quem tem menos PV (é o que uma mesa faz).
      const alvo = alvos.reduce((a, b) => (b.pv < a.pv ? b : a));
      // Contador da janela tática: o alvo já estava em Preparo quando declarei?
      c.declaracoes++; c.acoesDeclaradas++;
      if (M.preparo && alvo.pend && alvo.pend.resolveEm > t) c.janelasVistas++;
      const prep = M.preparo ? c.prep : 0;
      c.pend = { resolveEm: t + prep, alvo, atraso: 0 };
      c.proxDecl = t + c.spd;
      if (M.guardaEm === 'declara') c.guard = 0;
      // A dívida foi paga: a ação que ela empurrou acabou de sair. A janela reabre.
      c.divida = 0; c.aparosNaJanela = 0; c.ticksDevidos = 0; c.foraNaJanela = 0;
    }
    // 1b) AÇÃO FORA DE HORA: quem está em recuperação pode agir agora comprando Ticks
    //     do próprio futuro. Custa a Velocidade da ação somada ao que ainda se devia,
    //     rola com penalidade e NÃO refaz a guarda (não houve tempo de recompor).
    if (M.fora) {
      for (const c of todos) {
        if (c.pv <= 0 || c.pend || c.proxDecl <= t) continue;          // já pode agir na hora
        if (c.ticksDevidos + (M.fora.meio ? Math.ceil(c.spd / 2) : c.spd) > M.fora.teto) continue;            // teto da dívida
        if (M.fora.umaPorJanela && c.foraNaJanela > 0) continue;        // uma por ação, sem encadear
        const alvos = inimigosDe(c);
        if (!alvos.length) continue;
        // Gatilho: o que faz um jogador de verdade pagar Ticks do próprio futuro.
        //  'janela'    = interromper quem está montando um golpe;
        //  'finalizar' = matar quem está quase caindo antes que ele aja;
        //  'sempre'    = teste de estresse (a política gananciosa, para achar o teto).
        const naJanela = alvos.filter((x) => x.pend && x.pend.resolveEm > t);
        const quaseMortos = alvos.filter((x) => x.pv / x.pvMax < 0.25);
        let pool = alvos;
        if (M.fora.gatilho === 'janela') { if (!naJanela.length) continue; pool = naJanela; }
        else if (M.fora.gatilho === 'finalizar') { if (!quaseMortos.length) continue; pool = quaseMortos; }
        else if (M.fora.gatilho === 'ambos') {
          const u = [...new Set([...naJanela, ...quaseMortos])];
          if (!u.length) continue; pool = u;
        }
        const alvo = pool.reduce((a, b) => (b.pv < a.pv ? b : a));
        const custo = M.fora.meio ? Math.ceil(c.spd / 2) : c.spd;
        c.proxDecl += custo;
        c.ticksDevidos += custo;
        c.foraDeHora++; c.foraNaJanela++;
        if (M.fora.guardaCongela) c.guardaTravada = true;               // a guarda não se refaz
        c.interrompendo = !!(alvo.pend && alvo.pend.resolveEm > t);
        atacar(c, alvo, M, M.fora.pen);
        c.interrompendo = false;
      }
    }

    // 2) resoluções: os golpes que caem neste tick, em ordem sorteada (sem viés de lado).
    const prontos = todos.filter((c) => c.pend && c.pend.resolveEm === t);
    for (let i = prontos.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1)); [prontos[i], prontos[j]] = [prontos[j], prontos[i]];
    }
    for (const c of prontos) {
      if (!c.pend || c.pend.resolveEm !== t) continue; // pode ter sido empurrado agora
      const alvo = c.pend.alvo;
      c.pend = null;
      if (c.pv <= 0) { c.golpesPerdidos++; continue; }     // morreu montando o golpe
      c.acoesConcluidas++;
      let vitima = alvo;
      if (vitima.pv <= 0) {                                 // o alvo caiu antes de o golpe chegar
        const outros = inimigosDe(c);
        // Sem a regra de redirecionar, o golpe montado se perde no vazio.
        if (!M.redirecionar || !outros.length) { c.golpesPerdidos++; continue; }
        vitima = outros.reduce((a, b) => (b.pv < a.pv ? b : a));
        c.redirecionados++;
      }
      if (M.guardaEm === 'resolve') { if (c.guardaTravada) c.guardaTravada = false; else c.guard = 0; }
      atacar(c, vitima, M);
    }
    const vivosA = timeA.some((c) => c.pv > 0), vivosB = timeB.some((c) => c.pv > 0);
    if (!vivosA && !vivosB) return { r: 'empate', t };
    if (!vivosB) return { r: 'A', t };
    if (!vivosA) return { r: 'B', t };
  }
  return { r: 'empate', t: tetoTicks };
}

// duelo 1v1: devolve estatística agregada
function bateria(specA, specB, M, n = N, semente = SEED) {
  reseed(semente);
  let a = 0, b = 0, emp = 0, somaT = 0, perdidos = 0, feitos = 0;
  let janelasV = 0, janelasA = 0, empurroes = 0, aparo = 0, dividaMax = 0, decls = 0, aparosN = 0, fora = 0;
  let artesDecl = 0, artesSai = 0;
  for (let i = 0; i < n; i++) {
    const A = lutador(specA), B = lutador(specB);
    const { r, t } = cena([A], [B], M);
    if (r === 'A') a++; else if (r === 'B') b++; else emp++;
    somaT += t;
    for (const c of [A, B]) {
      perdidos += c.golpesPerdidos; feitos += c.golpesFeitos;
      janelasV += c.janelasVistas; janelasA += c.janelasAproveitadas;
      empurroes += c.empurroesSofridos; aparo += c.aparosGastos;
      decls += c.declaracoes; aparosN += c.aparosFeitos; fora += c.foraDeHora;
      if (c.nome === 'Arte') { artesDecl += c.acoesDeclaradas; artesSai += c.acoesConcluidas; }
      dividaMax = Math.max(dividaMax, c.dividaMax);
    }
  }
  return {
    win: a / n, perda: b / n, empate: emp / n, ticks: somaT / n,
    perdidosPct: feitos ? perdidos / (feitos + perdidos) : 0,
    janelasV: janelasV / n, janelasA: janelasA / n,
    janelaTaxa: decls ? janelasV / decls : 0, aparosN: aparosN / n, fora: fora / n,
    arteSai: artesDecl ? artesSai / artesDecl : 0, artesDecl: artesDecl / n,
    empurroes: empurroes / n, aparo: aparo / n, dividaMax,
  };
}

// ---------------------------------------------------------------- relatório
const linha = (s = '') => console.log(s);
const titulo = (s) => { linha(); linha(s); linha('─'.repeat(Math.min(78, s.length + 2))); };

linha('╔══════════════════════════════════════════════════════════════════════════╗');
linha('║  BANCO DE PROVAS — Preparo/Recuperação, empurrão e dívida de Ticks       ║');
linha('╚══════════════════════════════════════════════════════════════════════════╝');
linha(`Semente ${SEED} · ${N} cenas por célula · A+H 10, Centelha 1, Vigor 4, dano-attr 4, PV 37.`);
linha(`Preparo por classe: leve ${PREPARO.leve} · média ${PREPARO.media} · haste ${PREPARO.haste} · pesada ${PREPARO.pesada}  (P + R = Velocidade de hoje)`);

// ---- A) sanidade: espelho ------------------------------------------------
titulo('A) Sanidade — espelho (a mesma arma dos dois lados). Win% tem de ficar em 50%.');
linha('  arma        modelo hoje        modelo P/R         Δ ticks de duração');
for (const arma of Object.keys(ARMAS).filter((k) => ARMAS[k].cl !== 'arte')) {
  const h = bateria({ arma }, { arma }, MODELOS.hoje);
  const p = bateria({ arma }, { arma }, MODELOS.PR);
  linha(`  ${arma.padEnd(10)}  ${pct(h.win)} · ${h.ticks.toFixed(1)}t     ${pct(p.win)} · ${p.ticks.toFixed(1)}t      ${sgn(p.ticks - h.ticks)}t`);
}

// ---- B) round-robin: quem ganha e quem perde com o Preparo ---------------
titulo('B) Round-robin 1v1 — win% de cada arma contra todas as outras (sem armadura).');
const nomes = Object.keys(ARMAS).filter((k) => ARMAS[k].cl !== 'arte');
function roundRobin(M) {
  const acc = {};
  for (const a of nomes) { acc[a] = { soma: 0, n: 0 }; }
  for (const a of nomes) for (const b of nomes) {
    if (a === b) continue;
    const r = bateria({ arma: a }, { arma: b }, M, Math.max(4000, floor(N / 3)));
    acc[a].soma += r.win; acc[a].n++;
  }
  return Object.fromEntries(nomes.map((a) => [a, acc[a].soma / acc[a].n]));
}
const rrHoje = roundRobin(MODELOS.hoje);
const rrPR = roundRobin(MODELOS.PR);
const rrPRd = roundRobin(MODELOS.PRdecl);
const rrComp = roundRobin(MODELOS.PRcomp);
linha('  arma       classe   P    hoje    P/R(guarda no resolve)  P/R(guarda na declaração)  P/R+compensação');
for (const a of nomes) {
  const w = ARMAS[a];
  linha(`  ${a.padEnd(10)} ${w.cl.padEnd(7)} ${String(PREPARO[w.cl]).padEnd(3)} ${pct(rrHoje[a]).padStart(6)}  `
    + `${pct(rrPR[a]).padStart(6)} (${sgn((rrPR[a] - rrHoje[a]) * 100)})      `
    + `${pct(rrPRd[a]).padStart(6)} (${sgn((rrPRd[a] - rrHoje[a]) * 100)})         `
    + `${pct(rrComp[a]).padStart(6)} (${sgn((rrComp[a] - rrHoje[a]) * 100)})`);
}
const porClasse = (rr) => {
  const g = {};
  for (const a of nomes) { const c = ARMAS[a].cl; (g[c] ||= []).push(rr[a]); }
  return Object.fromEntries(Object.entries(g).map(([c, v]) => [c, v.reduce((x, y) => x + y, 0) / v.length]));
};
linha();
linha('  média por classe:');
const cHoje = porClasse(rrHoje), cPR = porClasse(rrPR), cPRd = porClasse(rrPRd), cComp = porClasse(rrComp);
for (const c of ['leve', 'media', 'haste', 'pesada']) {
  linha(`    ${c.padEnd(7)} hoje ${pct(cHoje[c])} → resolve ${pct(cPR[c])} (${sgn((cPR[c] - cHoje[c]) * 100)}) `
    + `· declaração ${pct(cPRd[c])} (${sgn((cPRd[c] - cHoje[c]) * 100)}) · +compensação ${pct(cComp[c])} (${sgn((cComp[c] - cHoje[c]) * 100)})`);
}

// ---- C) sensibilidade do Preparo da arma pesada --------------------------
titulo('C) Sensibilidade — quanto Preparo a arma pesada aguenta (guarda no resolve).');
linha('  P pesada   Martelo vs EspCurta   Montante vs Adaga   golpe perdido no ar   duração');
const salvo = PREPARO.pesada;
for (const p of [0, 1, 2, 3, 4]) {
  PREPARO.pesada = p;
  const r = bateria({ arma: 'Martelo' }, { arma: 'EspCurta' }, MODELOS.PR);
  const r2 = bateria({ arma: 'Montante' }, { arma: 'Adaga' }, MODELOS.PR);
  const m = melee('Martelo', 'EspCurta', MODELOS.PR);
  linha(`  ${String(p).padEnd(10)} ${pct(r.win).padStart(6)}                ${pct(r2.win).padStart(6)}              ${pct(m.perdidosPct).padStart(6)} (3v3)        ${r.ticks.toFixed(1)}t`);
}
PREPARO.pesada = salvo;

// ---- D) a janela existe? -------------------------------------------------
titulo('D) A janela tática aparece? (quantas vezes por duelo alguém declara contra um alvo em Preparo)');
linha('  matchup                por duelo   % das declarações   aproveitadas (empurrão K=1)');
for (const [a, b] of [['EspCurta', 'Martelo'], ['Adaga', 'Montante'], ['EspLonga', 'Martelo'], ['Lanca', 'Montante'], ['Martelo', 'Martelo'], ['EspLonga', 'EspLonga'], ['EspCurta', 'EspCurta']]) {
  const r = bateria({ arma: a }, { arma: b }, MODELOS.PRempurra1);
  linha(`  ${(a + ' vs ' + b).padEnd(22)} ${r.janelasV.toFixed(2).padStart(5)}       ${pct(r.janelaTaxa).padStart(6)}              ${r.janelasA.toFixed(2)}`);
}
linha('  (uma "janela" é declarar uma ação contra um alvo que está em Preparo: é o instante em que o empurrão e a leitura valem)');

// ---- E) empurrão ---------------------------------------------------------
titulo('E) Empurrão — bater em quem está em Preparo atrasa o golpe dele em K Ticks.');
linha('  K    leve     média    haste    pesada     (win% médio por classe no round-robin)');
for (const [k, M] of [[0, MODELOS.PR], [1, MODELOS.PRempurra1], [2, MODELOS.PRempurra2]]) {
  const c = porClasse(roundRobin(M));
  linha(`  ${String(k).padEnd(4)} ${pct(c.leve).padStart(6)}  ${pct(c.media).padStart(6)}  ${pct(c.haste).padStart(6)}  ${pct(c.pesada).padStart(6)}`);
}

// ---- F) dívida de Ticks --------------------------------------------------
titulo('F) Dívida de Ticks — aparo desesperado (custa 2 Ticks, dá +6 de Defesa, só abaixo de 45% da Vida).');
linha('  variante                          duração   aparos/duelo   Ticks de dívida   pior dívida na janela');
const semDiv = bateria({ arma: 'EspLonga' }, { arma: 'EspLonga' }, MODELOS.PR);
linha(`  ${'sem dívida (referência)'.padEnd(33)} ${semDiv.ticks.toFixed(1).padStart(6)}t        —              —                 —`);
const VAR = [
  ['+6 Def por 2 Ticks, à vontade',   { custo: 2, bonus: 6, limiar: .45, teto: 12, umaPorJanela: false }],
  ['+6 Def por 2 Ticks, 1 por ação',  { custo: 2, bonus: 6, limiar: .45, teto: 12, umaPorJanela: true }],
  ['+6 Def por 3 Ticks, 1 por ação',  { custo: 3, bonus: 6, limiar: .45, teto: 12, umaPorJanela: true }],
  ['+4 Def por 2 Ticks, 1 por ação',  { custo: 2, bonus: 4, limiar: .45, teto: 12, umaPorJanela: true }],
  ['+6 Def por 4 Ticks, 1 por ação',  { custo: 4, bonus: 6, limiar: .45, teto: 12, umaPorJanela: true }],
  ['+6 Def por 3 Ticks, só abaixo de 20%', { custo: 3, bonus: 6, limiar: .20, teto: 12, umaPorJanela: true }],
  ['+6 Def por 3 Ticks, UMA por cena', { custo: 3, bonus: 6, limiar: .45, teto: 12, umaPorJanela: true, umaPorCena: true }],
];
for (const [lbl, ap] of VAR) {
  const M = { preparo: true, guardaEm: 'resolve', empurrao: 0, aparo: ap, comp: null };
  const d = bateria({ arma: 'EspLonga' }, { arma: 'EspLonga' }, M);
  linha(`  ${lbl.padEnd(33)} ${d.ticks.toFixed(1).padStart(6)}t     ${d.aparosN.toFixed(2).padStart(5)}         ${d.aparo.toFixed(1).padStart(5)}             ${d.dividaMax}`);
}
linha();
linha('  efeito no equilíbrio entre classes (round-robin, média por classe):');
{
  const c0 = porClasse(roundRobin(MODELOS.PR));
  const c1 = porClasse(roundRobin(MODELOS.PRdivida));
  const M23 = (lim) => ({ preparo: true, guardaEm: 'resolve', empurrao: 0, comp: null, aparo: { custo: 3, bonus: 6, limiar: lim, teto: 12, umaPorJanela: true } });
  const c2 = porClasse(roundRobin(M23(.45)));
  const c3 = porClasse(roundRobin(M23(.20)));
  for (const c of ['leve', 'media', 'haste', 'pesada']) {
    linha(`    ${c.padEnd(7)} sem ${pct(c0[c])} → à vontade ${pct(c1[c])} (${sgn((c1[c] - c0[c]) * 100)})`
      + ` → 3 Ticks, 1 por ação ${pct(c2[c])} (${sgn((c2[c] - c0[c]) * 100)})`
      + ` → o mesmo, só abaixo de 20% ${pct(c3[c])} (${sgn((c3[c] - c0[c]) * 100)})`);
  }
}

// ---- G) melee 3v3: o golpe que se perde no vazio -------------------------
titulo('G) Refrega 3v3 com foco de fogo — o Preparo faz o golpe pesado morrer no ar?');
linha('  time                              regra              vitórias   perdidos   duração');
function melee(armaA, armaB, M, n = Math.max(3000, floor(N / 4))) {
  reseed(SEED);
  let a = 0, somaT = 0, perdidos = 0, feitos = 0;
  for (let i = 0; i < n; i++) {
    const A = [0, 1, 2].map(() => lutador({ arma: armaA }));
    const B = [0, 1, 2].map(() => lutador({ arma: armaB }));
    const { r, t } = cena(A, B, M);
    if (r === 'A') a++;
    somaT += t;
    for (const c of [...A, ...B]) { perdidos += c.golpesPerdidos; feitos += c.golpesFeitos; }
  }
  return { win: a / n, ticks: somaT / n, perdidosPct: perdidos / (feitos + perdidos) };
}
for (const [ta, tb, lbl] of [
  ['Martelo', 'EspCurta', '3 Martelos vs 3 Espadas Curtas'],
  ['Montante', 'Adaga', '3 Montantes vs 3 Adagas'],
  ['EspLonga', 'EspLonga', '3 Espadas Longas (espelho)'],
]) {
  const h = melee(ta, tb, MODELOS.hoje), p = melee(ta, tb, MODELOS.PR);
  const r = melee(ta, tb, { ...MODELOS.PR, redirecionar: true });
  linha(`  ${lbl.padEnd(33)} hoje          ${pct(h.win).padStart(6)}   ${pct(h.perdidosPct).padStart(6)}          ${h.ticks.toFixed(1)}t`);
  linha(`  ${''.padEnd(33)} P/R           ${pct(p.win).padStart(6)}   ${pct(p.perdidosPct).padStart(6)}          ${p.ticks.toFixed(1)}t`);
  linha(`  ${''.padEnd(33)} P/R + redirecionar ${pct(r.win).padStart(6)}   ${pct(r.perdidosPct).padStart(6)}          ${r.ticks.toFixed(1)}t`);
}

// ---- H) contra armadura --------------------------------------------------
titulo('H) Contra armadura — o Preparo muda a relação arma×armadura? (win% do atacante)');
linha('  arma        alvo         hoje     P/R      Δ');
for (const arma of ['EspCurta', 'EspLonga', 'Martelo', 'Lanca']) {
  for (const armadura of ['Nenhuma', 'Malha', 'Placa']) {
    const h = bateria({ arma }, { arma: 'EspLonga', armadura }, MODELOS.hoje);
    const p = bateria({ arma }, { arma: 'EspLonga', armadura }, MODELOS.PR);
    linha(`  ${arma.padEnd(11)} ${armadura.padEnd(12)} ${pct(h.win).padStart(6)}  ${pct(p.win).padStart(6)}   ${sgn((p.win - h.win) * 100)}`);
  }
}

// ---- I) modelo completo --------------------------------------------------
titulo('I) O pacote recomendado (P/R guarda-no-resolve + redirecionar + empurrão K=1 + aparo de 3 Ticks, 1 por ação, só abaixo de 20%).');
{
  const c0 = porClasse(rrHoje), c1 = porClasse(roundRobin(MODELOS.completo));
  linha('  classe    hoje     completo    Δ');
  for (const c of ['leve', 'media', 'haste', 'pesada']) {
    linha(`  ${c.padEnd(9)} ${pct(c0[c]).padStart(6)}   ${pct(c1[c]).padStart(6)}    ${sgn((c1[c] - c0[c]) * 100)}`);
  }
  const dur0 = bateria({ arma: 'EspLonga' }, { arma: 'EspLonga' }, MODELOS.hoje);
  const dur1 = bateria({ arma: 'EspLonga' }, { arma: 'EspLonga' }, MODELOS.completo);
  linha();
  linha(`  duração do duelo espelho: hoje ${dur0.ticks.toFixed(1)}t → completo ${dur1.ticks.toFixed(1)}t (${sgn(dur1.ticks - dur0.ticks)}t)`);
}
linha();

// ---- J) ação fora de hora: quanto custa para não virar dominante ----------
titulo('J) Ação fora de hora — atacar comprando Ticks do próprio futuro.');
linha('  Regra sob teste: você age agora; sua próxima ação anda a Velocidade INTEIRA para frente');
linha('  (somada ao que já devia), a rolagem leva uma penalidade, a guarda NÃO se refaz e não dá');
linha('  para encadear duas (uma por ação sua). O gatilho é o que um jogador faria de verdade.');
linha();
const PRb = MODELOS.PR;
const baseCls = porClasse(roundRobin(PRb));
const baseDur = bateria({ arma: 'EspLonga' }, { arma: 'EspLonga' }, PRb).ticks;
function economia(gatilho, pen, umaPorJanela = true, teto = 14) {
  const M = { ...PRb, fora: { gatilho, pen, guardaCongela: true, umaPorJanela, teto } };
  const cls = porClasse(roundRobin(M));
  const dz = bateria({ arma: 'EspLonga' }, { arma: 'EspCurta' }, M);
  const desvio = Math.max(...['leve', 'media', 'haste', 'pesada'].map((c) => Math.abs(cls[c] - baseCls[c])));
  return { cls, dz, desvio };
}
linha('  gatilho     pen.   leve    média   haste   pesada   pior desvio   ações/duelo   duração');
linha(`  ${'(referência)'.padEnd(11)} ${'—'.padEnd(6)} ${pct(baseCls.leve).padStart(6)}  ${pct(baseCls.media).padStart(6)}  ${pct(baseCls.haste).padStart(6)}  ${pct(baseCls.pesada).padStart(6)}      —            —          ${baseDur.toFixed(1)}t`);
for (const gat of ['janela', 'finalizar', 'ambos', 'sempre']) {
  for (const pen of [0, 2, 4, 6]) {
    const r = economia(gat, pen);
    linha(`  ${gat.padEnd(11)} ${('−' + pen).padEnd(6)} ${pct(r.cls.leve).padStart(6)}  ${pct(r.cls.media).padStart(6)}  ${pct(r.cls.haste).padStart(6)}  ${pct(r.cls.pesada).padStart(6)}   `
      + `${sgn(r.desvio * 100).padStart(7)}       ${r.dz.fora.toFixed(2).padStart(5)}        ${r.dz.ticks.toFixed(1)}t`);
  }
  linha();
}
linha('  sem a trava de "uma por ação" (encadeando enquanto o teto da dívida deixar):');
for (const gat of ['janela', 'ambos']) {
  const r = economia(gat, 4, false);
  linha(`  ${gat.padEnd(11)} ${'−4'.padEnd(6)} ${pct(r.cls.leve).padStart(6)}  ${pct(r.cls.media).padStart(6)}  ${pct(r.cls.haste).padStart(6)}  ${pct(r.cls.pesada).padStart(6)}   `
    + `${sgn(r.desvio * 100).padStart(7)}       ${r.dz.fora.toFixed(2).padStart(5)}        ${r.dz.ticks.toFixed(1)}t`);
}
linha();

// ---- K) o que a interrupção COMPRA -------------------------------------
titulo('K) O que interromper compra — o golpe fora de hora que conecta em quem está montando.');
linha('  Em J) a interrupção não comprava nada, e por isso era um péssimo negócio. Aqui ela atrasa');
linha('  o golpe montado em K Ticks, ou o cancela de vez (a ação se perde, a Velocidade não volta).');
linha();
linha('  o que compra        pen.   leve    média   haste   pesada   pior desvio   ações/duelo   duração');
linha(`  ${'(referência)'.padEnd(19)} ${'—'.padEnd(6)} ${pct(baseCls.leve).padStart(6)}  ${pct(baseCls.media).padStart(6)}  ${pct(baseCls.haste).padStart(6)}  ${pct(baseCls.pesada).padStart(6)}      —            —          ${baseDur.toFixed(1)}t`);
function interromper(compra, pen) {
  const M = { ...MODELOS.PR, interrupcao: compra, fora: { gatilho: 'janela', pen, guardaCongela: true, umaPorJanela: true, teto: 14 } };
  const cls = porClasse(roundRobin(M));
  const dz = bateria({ arma: 'EspCurta' }, { arma: 'Martelo' }, M);
  const desvio = Math.max(...['leve', 'media', 'haste', 'pesada'].map((c) => Math.abs(cls[c] - baseCls[c])));
  return { cls, dz, desvio };
}
for (const [compra, lbl] of [[1, 'atrasa 1 Tick'], [2, 'atrasa 2 Ticks'], [3, 'atrasa 3 Ticks'], [5, 'atrasa 5 Ticks'], ['espelho', 'atrasa o que paguei'], ['cancela', 'cancela a ação']]) {
  for (const pen of [0, 2, 4]) {
    const r = interromper(compra, pen);
    linha(`  ${lbl.padEnd(19)} ${('−' + pen).padEnd(6)} ${pct(r.cls.leve).padStart(6)}  ${pct(r.cls.media).padStart(6)}  ${pct(r.cls.haste).padStart(6)}  ${pct(r.cls.pesada).padStart(6)}   `
      + `${sgn(r.desvio * 100).padStart(7)}       ${r.dz.fora.toFixed(2).padStart(5)}        ${r.dz.ticks.toFixed(1)}t`);
  }
  linha();
}

// ---- L) isolando cada trava do preço --------------------------------------
titulo('L) Qual trava está segurando o preço — tirando uma de cada vez (interrupção espelho, sem penalidade).');
linha('  variante                                   leve    média   haste   pesada   pior desvio   ações/duelo  duração');
linha(`  ${'(referência, sem ação fora de hora)'.padEnd(42)} ${pct(baseCls.leve).padStart(6)}  ${pct(baseCls.media).padStart(6)}  ${pct(baseCls.haste).padStart(6)}  ${pct(baseCls.pesada).padStart(6)}      —           —         ${baseDur.toFixed(1)}t`);
function trava(lbl, fora, extra = {}) {
  const M = { ...MODELOS.PR, interrupcao: 'espelho', fora: { gatilho: 'janela', pen: 0, guardaCongela: true, umaPorJanela: true, teto: 14, ...fora }, ...extra };
  const cls = porClasse(roundRobin(M));
  const dz = bateria({ arma: 'EspCurta' }, { arma: 'Martelo' }, M);
  const desvio = Math.max(...['leve', 'media', 'haste', 'pesada'].map((c) => Math.abs(cls[c] - baseCls[c])));
  linha(`  ${lbl.padEnd(42)} ${pct(cls.leve).padStart(6)}  ${pct(cls.media).padStart(6)}  ${pct(cls.haste).padStart(6)}  ${pct(cls.pesada).padStart(6)}   ${sgn(desvio * 100).padStart(7)}      ${dz.fora.toFixed(2).padStart(5)}       ${dz.ticks.toFixed(1)}t`);
}
trava('preço cheio (as três travas)', {});
trava('sem a trava da guarda (ela se refaz)', { guardaCongela: false });
trava('sem a trava de uma por ação', { umaPorJanela: false });
trava('custo meia Velocidade em vez da inteira', { meio: true });
trava('sem trava nenhuma (guarda, encadeia, meio custo)', { guardaCongela: false, umaPorJanela: false, meio: true });
linha();

// ---- M) carga voluntária: comprar Preparo por um bônus ---------------------
titulo('M) Carga voluntária — pagar N Ticks a mais de Preparo em troca de bônus na rolagem.');
linha('  O "Mirar" de hoje (−2 na Defesa do alvo por uma ação gasta) generalizado: o ciclo inteiro');
linha('  cresce N Ticks e o golpe sai N Ticks mais tarde, mais exposto. Qual bônus paga isso?');
linha('  Duelo espelho: A carrega, B joga normal. 50% = troca neutra.');
linha();
for (const arma of ['EspCurta', 'EspLonga', 'Martelo']) {
  linha(`  ${arma} (Velocidade ${ARMAS[arma].spd}, Preparo ${PREPARO[ARMAS[arma].cl]})`);
  linha('    N      +2      +4      +6      +8     +10     +12');
  for (const n of [1, 2, 3]) {
    const cels = [2, 4, 6, 8, 10, 12].map((b) => {
      const r = bateria({ arma, carga: { n, bonus: b } }, { arma }, MODELOS.PR, Math.max(6000, floor(N / 2)));
      return pct(r.win).padStart(6);
    });
    linha(`    ${n}   ${cels.join('  ')}`);
  }
  linha();
}
linha('  (o bônus que cruza 50% é o preço justo de 1 Tick de Preparo comprado)');
linha();

// ---- N) o feiticeiro sob pressão ------------------------------------------
titulo('N) O feiticeiro sob pressão — a Arte é 7/0, o extremo do eixo, e o alvo mais fácil de interromper.');
linha('  A regra do espelho foi calibrada em duelos de 1 a 2 Ticks de Preparo. Contra 7, ela pode');
linha('  virar tranca: cada golpe que conecta adia a Arte pela Velocidade de quem bateu.');
linha();
linha('  regra da interrupção                     Artes que saem            win% do   duração');
linha('                                           nu       de Placa    feiticeiro de Placa');
function feiticeiro(lbl, M) {
  // Dois cenários: o feiticeiro nu (que morre de qualquer jeito, e serve só para medir
  // quantas Artes saem) e o feiticeiro protegido por Placa, que é o caso de mesa.
  const nu = bateria({ arma: 'Arte' }, { arma: 'EspLonga' }, M, Math.max(4000, floor(N / 2)));
  const pr = bateria({ arma: 'Arte', armadura: 'Placa' }, { arma: 'EspLonga' }, M, Math.max(4000, floor(N / 2)));
  linha(`  ${lbl.padEnd(40)} ${pct(nu.arteSai).padStart(6)}        ${pct(pr.arteSai).padStart(6)}        ${pct(pr.win).padStart(6)}        ${pr.ticks.toFixed(1)}t`);
}
const FORA = { gatilho: 'janela', pen: 0, guardaCongela: true, umaPorJanela: true, teto: 99 };
feiticeiro('sem interrupção nenhuma (referência)', MODELOS.PR);
feiticeiro('só o empurrão passivo de 1 Tick', { ...MODELOS.PR, empurrao: 1 });
feiticeiro('espelho, sem teto', { ...MODELOS.PR, interrupcao: 'espelho', fora: FORA });
feiticeiro('espelho, teto = metade da Velocidade', { ...MODELOS.PR, interrupcao: 'espelho', tetoAtraso: 0.5, fora: FORA });
feiticeiro('espelho, teto = a Velocidade inteira', { ...MODELOS.PR, interrupcao: 'espelho', tetoAtraso: 1, fora: FORA });
feiticeiro('atraso fixo de 2 Ticks, sem teto', { ...MODELOS.PR, interrupcao: 2, fora: FORA });
linha();
