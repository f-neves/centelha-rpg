// sim-folego.mjs — teste de calibragem do FÔLEGO v2 (Centelha D6).
//
// Mecânica testada (regras.json `derivados.folego` + combate.md "## Fôlego"):
//   pool      = 10 (base humana) + Vigor×5 + Resistência×4 + Vontade×2
//   recupera  = +Vigor de Fôlego POR TICK, o tempo todo (inclusive lutando)
//   golpe     = gasta o Fôlego BRUTO da arma (15 leve / 24 médio / 35 pesado …)
//   LÍQUIDO   = bruto − Vigor×Speed  ← "o que pesa de fato" (def. do próprio livro)
//   Tomar Fôlego = ação Speed 5 (só defende) → recupera METADE do máximo de uma vez
//   defender  = não custa Fôlego
//   < 25% pool = −1d6 em toda ação física
//   0 (exausto) = só pode defender / Tomar Fôlego
//   Esforço   = cada +1d6 DOBRA o bruto e +1 Speed (×2/×4/×8…, Speed +1/+2/+3) — sem teto
//
// MODELO DE CONTABILIDADE (decisão de modelagem, alinhada ao livro):
//   cada golpe aplica o LÍQUIDO como um delta único, limitado a [0, máx].
//   - líquido negativo (regenera) → sobe, sem ultrapassar o máx (não se "banca" descanso);
//   - líquido positivo (drena)   → desce; se zerar, fica exausto.
//   É o que o jogador calcula na mesa ("−bruto, +Vigor×Speed durante o golpe").
//   O Fôlego é determinístico (não há dado), então os blocos são EXATOS, não Monte Carlo.
//
//   node scripts/sim-folego.mjs
import regras from '../src/data/regras.json' with { type: 'json' };

const F = regras.derivados.folego;

const pool = (vig, res, vont) =>
  F.base + vig * F.vigorMult + res * F.resistenciaMult + vont * F.vontadeMult;

// líquido drenado por um golpe (negativo = regenera)
const liquido = (bruto, speed, vig) => bruto - vig * speed;
// aplica um golpe ao Fôlego atual (delta = −líquido), limitado a [0, máx]
const aplica = (f, max, bruto, speed, vig) =>
  Math.max(0, Math.min(max, f - liquido(bruto, speed, vig)));

// ---------- builds-referência ----------
const BUILDS = [
  { nome: 'Frágil  (V2 R1 Vo3)', vig: 2, res: 1, vont: 3 },
  { nome: 'Médio   (V3 R2 Vo5)', vig: 3, res: 2, vont: 5 },
  { nome: 'Kael    (V4 R0 Vo7)', vig: 4, res: 0, vont: 7 },
  { nome: 'Herói   (V4 R3 Vo7)', vig: 4, res: 3, vont: 7 },
  { nome: 'Tanque  (V5 R5 Vo7)', vig: 5, res: 5, vont: 7 },
];

// classes de arma (bruto, speed) — do armas.json
const CLASSES = [
  ['leve     (15/S5)', 15, 5],
  ['média    (24/S6)', 24, 6],
  ['distância(20/S6)', 20, 6],
  ['alabarda (32/S6)', 32, 6],
  ['pesada   (38/S7)', 38, 7],
];

const pad = (s, n) => String(s).padEnd(n);
const padc = (s, n) => { s = String(s); const t = Math.max(0, n - s.length); const l = t >> 1; return ' '.repeat(l) + s + ' '.repeat(t - l); };
const sign = (n) => (n > 0 ? '+' + n : '' + n);

// ============================ A — POOLS ============================
console.log('='.repeat(74));
console.log('A) POOL DE FÔLEGO  =  10 + Vigor×5 + Resistência×4 + Vontade×2');
console.log('='.repeat(74));
for (const b of BUILDS) {
  const p = pool(b.vig, b.res, b.vont);
  console.log(`${pad(b.nome, 22)} = ${String(p).padStart(3)}   (25% = ${(p * 0.25).toFixed(0)}, metade = ${(p / 2).toFixed(0)})`);
}

// ============================ B — LÍQUIDO POR GOLPE ============================
console.log('\n' + '='.repeat(74));
console.log('B) LÍQUIDO POR GOLPE = bruto − Vigor×Speed   (negativo = REGENERA lutando)');
console.log('='.repeat(74));
const vigs = [2, 3, 4, 5];
console.log(pad('classe', 18) + vigs.map((v) => padc('Vig' + v, 8)).join(''));
for (const [nome, bruto, speed] of CLASSES) {
  console.log(pad(nome, 18) + vigs.map((v) => padc(sign(liquido(bruto, speed, v)), 8)).join(''));
}
console.log('\n(confere a tabela do livro: leve V3/V4/V5 = 0/−5/−10; médio +6/0/−6; pesado +14/+7/0)');

// ============================ C — CAPACIDADE DE RAJADA ============================
console.log('\n' + '='.repeat(74));
console.log('C) RAJADA: golpes seguidos do CHEIO até <25% e até EXAUSTO (0)  — só atacando');
console.log('='.repeat(74));
function rajada(b, bruto, speed) {
  const max = pool(b.vig, b.res, b.vont);
  let f = max, golpes = 0, ate25 = null;
  const lim25 = max * 0.25;
  for (let k = 0; k < 300 && f > 0; k++) {
    f = aplica(f, max, bruto, speed, b.vig);
    golpes++;
    if (ate25 === null && f < lim25) ate25 = golpes;
    if (liquido(bruto, speed, b.vig) <= 0) { golpes = 300; break; } // regenera → infinito
  }
  return { golpes, ate25: ate25 ?? golpes };
}
console.log(pad('build', 22) + CLASSES.map(([n]) => padc(n.split(' ')[0], 12)).join(''));
for (const b of BUILDS) {
  const cells = CLASSES.map(([, bruto, speed]) => {
    const r = rajada(b, bruto, speed);
    return padc(r.golpes >= 300 ? '∞ sust.' : `${r.ate25}→${r.golpes}`, 12);
  });
  console.log(pad(b.nome, 22) + cells.join(''));
}
console.log('\n(célula = golpes até <25% → golpes até exausto;  "∞" = líquido ≤0, sustenta sempre)');

// ============================ D — RECUPERAÇÃO ============================
console.log('\n' + '='.repeat(74));
console.log('D) RECUPERAÇÃO do zero — Ticks de defesa passiva (+Vigor/Tick) e Tomar Fôlego');
console.log('='.repeat(74));
for (const b of BUILDS) {
  const max = pool(b.vig, b.res, b.vont);
  const tPass = (alvo) => Math.ceil((max * alvo) / b.vig);
  const tomarSo = Math.min(max, max / 2);                    // só a metade do máx
  const tomarMais = Math.min(max, max / 2 + b.vig * 5);      // metade + 5 ticks de +Vigor
  console.log(
    `${pad(b.nome, 22)} passivo →25%: ${String(tPass(0.25)).padStart(2)}t  →50%: ${String(tPass(0.5)).padStart(2)}t  →cheio: ${String(tPass(1)).padStart(2)}t` +
    `   | Tomar Fôlego: +${(tomarSo).toFixed(0)} (${(tomarSo / max * 100).toFixed(0)}%) | +c/ tick: +${tomarMais.toFixed(0)} (${(tomarMais / max * 100).toFixed(0)}%)`
  );
}

// ============================ E — ESFORÇO ============================
console.log('\n' + '='.repeat(74));
console.log('E) ESFORÇO (Vigor 4): cada +1d6 dobra o bruto e +1 Speed. bruto / LÍQUIDO / cabe?');
const heroi = BUILDS.find((b) => b.nome.startsWith('Herói'));
const ph = pool(heroi.vig, heroi.res, heroi.vont);
console.log(`   pool de referência = Herói V4 R3 Vo7 = ${ph}.  "cabe?" = líquido ≤ pool cheio`);
console.log('='.repeat(74));
for (const [nome, bruto, speed] of CLASSES) {
  const parts = [0, 1, 2, 3].map((k) => {
    const gb = bruto * 2 ** k, sp = speed + k, liq = liquido(gb, sp, heroi.vig);
    const mark = liq <= 0 ? '∞' : liq > ph ? '✗' : '';
    return `${k === 0 ? 'base' : '+' + k + 'd6'} ${String(gb).padStart(3)}/${(sign(liq) + mark).padStart(5)}`;
  });
  console.log(pad(nome, 18) + parts.join('  '));
}
console.log('\n(✗ = líquido > pool cheio → nem do cheio dá pra fazer;  ∞ = ainda regenera)');
console.log(' líquido ≈ pool → "1 por vez" (faz, fica perto de exausto).');

// ============================ F — RITMO DE COMBATE ============================
console.log('\n' + '='.repeat(74));
console.log('F) RITMO — política "rajada → respiro": ataca enquanto não exausta; senão Tomar Fôlego');
console.log('   janela 300 ticks; rajada média (golpes por respiro) e % do tempo atacando');
console.log('   Tomar Fôlego modelado como +metade do máx (variante conservadora, sem o +tick)');
console.log('='.repeat(74));
function ritmo(b, bruto, speed, janela = 300) {
  const max = pool(b.vig, b.res, b.vont);
  let f = max, t = 0, golpes = 0, ticksAtk = 0, respiros = 0, rajAtual = 0;
  const rajadas = [];
  while (t < janela) {
    const fApos = aplica(f, max, bruto, speed, b.vig);
    if (fApos > 0) { f = fApos; t += speed; golpes++; ticksAtk += speed; rajAtual++; }
    else {
      if (rajAtual > 0) { rajadas.push(rajAtual); rajAtual = 0; }
      f = Math.min(max, f + max / 2); t += 5; respiros++;
    }
  }
  if (rajAtual > 0) rajadas.push(rajAtual);
  const rajMed = rajadas.length ? rajadas.reduce((a, c) => a + c, 0) / rajadas.length : golpes;
  return { golpes, rajMed, respiros, dutyAtk: ticksAtk / janela };
}
for (const cls of [['leve (15/S5)', 15, 5], ['média (24/S6)', 24, 6], ['pesada (38/S7)', 38, 7]]) {
  console.log(`\n-- arma ${cls[0]} --`);
  console.log(pad('build', 22) + 'rajada méd.   respiros   % atacando');
  for (const b of BUILDS) {
    const r = ritmo(b, cls[1], cls[2]);
    const raj = r.respiros === 0 ? 'sustenta ∞' : r.rajMed.toFixed(1) + ' golpes';
    console.log(`${pad(b.nome, 22)}${padc(raj, 12)}  ${padc(r.respiros, 8)} ${(r.dutyAtk * 100).toFixed(0)}%`);
  }
}
console.log('\nAlvo do design: leve sustenta; pesado ~6 do cheio; Esforço-pesado ~1 por vez.');

// ============================ G — MODELO A vs MODELO B ============================
// A (atual): recupera +Vigor/Tick O TEMPO TODO (inclusive durante o golpe) → custa o LÍQUIDO.
// B (novo) : recupera +Vigor/Tick SÓ quando NÃO ataca               → o golpe custa o BRUTO.
// Em ambos: Tomar Fôlego (Speed 5) = +50% do máx. Defender/parado recupera +Vigor/Tick (igual).
// A ÚNICA diferença: os Ticks DO PRÓPRIO GOLPE recuperam (A) ou não (B).
const COMP = [['leve', 15, 5], ['média', 24, 6], ['pesada', 38, 7]];

// custo de um golpe em cada modelo
const strikeA = (f, max, g, s, v) => Math.max(0, Math.min(max, f - (g - v * s)));
const strikeB = (f, max, g, s, v) => Math.max(0, Math.min(max, f - g)); // sem recup. durante

// rajada contínua (do cheio, sem descanso) → golpes até <25% e até exausto
function rajadaM(model, b, g, s) {
  const max = pool(b.vig, b.res, b.vont), lim = max * 0.25;
  const step = model === 'A' ? strikeA : strikeB;
  let f = max, n = 0, ate25 = null;
  const liqA = g - b.vig * s;
  if (model === 'A' && liqA <= 0) return { n: Infinity, ate25: Infinity };
  for (let k = 0; k < 999 && f > 0; k++) {
    f = step(f, max, g, s, b.vig); n++;
    if (ate25 === null && f < lim) ate25 = n;
  }
  return { n, ate25: ate25 ?? n };
}

// uptime SUSTENTÁVEL (descanso passivo +Vigor/Tick entre golpes): % do tempo atacando
// A: falta por golpe = max(0, líquido);  B: falta = bruto (não recupera durante o golpe)
function uptimeSust(model, b, g, s) {
  const falta = model === 'A' ? Math.max(0, g - b.vig * s) : g;
  if (falta <= 0) return 1;                     // sustenta atacando direto
  const kRest = falta / b.vig;                  // ticks de descanso por golpe
  return s / (s + kRest);
}

// ritmo com a política "ataca / Tomar Fôlego (Speed 5, +50%)"
function ritmoM(model, b, g, s, janela = 300) {
  const max = pool(b.vig, b.res, b.vont);
  const step = model === 'A' ? strikeA : strikeB;
  let f = max, t = 0, ticksAtk = 0, raj = 0; const rajadas = [];
  while (t < janela) {
    const fApos = step(f, max, g, s, b.vig);
    if (fApos > 0) { f = fApos; t += s; ticksAtk += s; raj++; }
    else { if (raj > 0) { rajadas.push(raj); raj = 0; } f = Math.min(max, f + max / 2); t += 5; }
  }
  if (raj > 0) rajadas.push(raj);
  const rm = rajadas.length ? rajadas.reduce((a, c) => a + c, 0) / rajadas.length : Infinity;
  return { rajMed: rm, dutyAtk: ticksAtk / janela };
}

console.log('\n' + '='.repeat(74));
console.log('G) MODELO A (recupera sempre) vs MODELO B (recupera só fora do golpe)');
console.log('='.repeat(74));

console.log('\n— G1. RAJADA do cheio (atacando direto, sem descanso): golpes até <25% → exausto —');
for (const [cn, g, s] of COMP) {
  console.log(`\n  arma ${cn} (bruto ${g}/Speed ${s})`);
  console.log('  ' + pad('build', 22) + padc('Modelo A', 16) + padc('Modelo B', 16));
  for (const b of BUILDS) {
    const a = rajadaM('A', b, g, s), bb = rajadaM('B', b, g, s);
    const fmt = (r) => r.n === Infinity ? '∞ sustenta' : `${r.ate25}→${r.n}`;
    console.log('  ' + pad(b.nome, 22) + padc(fmt(a), 16) + padc(fmt(bb), 16));
  }
}

console.log('\n— G2. UPTIME SUSTENTÁVEL (% do tempo atacando, descansando o mínimo entre golpes) —');
for (const [cn, g, s] of COMP) {
  console.log(`\n  arma ${cn} (bruto ${g}/Speed ${s})`);
  console.log('  ' + pad('build', 22) + padc('Modelo A', 12) + padc('Modelo B', 12));
  for (const b of BUILDS) {
    const ua = uptimeSust('A', b, g, s), ub = uptimeSust('B', b, g, s);
    console.log('  ' + pad(b.nome, 22) + padc((ua * 100).toFixed(0) + '%', 12) + padc((ub * 100).toFixed(0) + '%', 12));
  }
}

console.log('\n— G3. RITMO real (política atacar / Tomar Fôlego +50%): rajada média e % atacando —');
for (const [cn, g, s] of COMP) {
  console.log(`\n  arma ${cn} (bruto ${g}/Speed ${s})`);
  console.log('  ' + pad('build', 22) + padc('A: rajada/uptime', 20) + padc('B: rajada/uptime', 20));
  for (const b of BUILDS) {
    const ra = ritmoM('A', b, g, s), rb = ritmoM('B', b, g, s);
    const fmt = (r) => (r.rajMed === Infinity ? '∞' : r.rajMed.toFixed(1)) + ` / ${(r.dutyAtk * 100).toFixed(0)}%`;
    console.log('  ' + pad(b.nome, 22) + padc(fmt(ra), 20) + padc(fmt(rb), 20));
  }
}

// ============================ H — B PURO vs B SUAVIZADO ============================
// Decidido: adotar o Modelo B (recupera só fora do golpe → golpe custa o número cheio).
// Resta escolher os CUSTOS. Duas variantes (+ A como referência):
//   B-puro      = custos atuais  leve 15 / médio 24 / pesada 38
//   B-suavizado = custos menores leve 8 / médio 16 / pesada 28  (leve menos punitivo)
const VARIANTES = {
  'A (ref.)':   { model: 'A', custo: { leve: 15, média: 24, pesada: 38 } },
  'B-puro':     { model: 'B', custo: { leve: 15, média: 24, pesada: 38 } },
  'B-suaviz.':  { model: 'B', custo: { leve: 8,  média: 16, pesada: 28 } },
};
const SPEED = { leve: 5, média: 6, pesada: 7 };

console.log('\n' + '='.repeat(74));
console.log('H) B PURO vs B SUAVIZADO (uptime sustentável e rajada do cheio)');
console.log('='.repeat(74));

console.log('\n— H1. UPTIME SUSTENTÁVEL por arma e build —');
for (const arma of ['leve', 'média', 'pesada']) {
  console.log(`\n  arma ${arma} (Speed ${SPEED[arma]}; custo A/Bpuro=${VARIANTES['A (ref.)'].custo[arma]}, Bsuav=${VARIANTES['B-suaviz.'].custo[arma]})`);
  console.log('  ' + pad('build', 22) + Object.keys(VARIANTES).map((v) => padc(v, 12)).join(''));
  for (const b of BUILDS) {
    const cells = Object.values(VARIANTES).map((V) => padc((uptimeSust(V.model, b, V.custo[arma], SPEED[arma]) * 100).toFixed(0) + '%', 12));
    console.log('  ' + pad(b.nome, 22) + cells.join(''));
  }
}

console.log('\n— H2. RAJADA do cheio (golpes até <25% → exausto), Herói V4 e Frágil V2 —');
for (const arma of ['leve', 'média', 'pesada']) {
  console.log(`\n  arma ${arma}`);
  console.log('  ' + pad('build', 22) + Object.keys(VARIANTES).map((v) => padc(v, 12)).join(''));
  for (const b of [BUILDS.find((x) => x.nome.startsWith('Herói')), BUILDS.find((x) => x.nome.startsWith('Frágil'))]) {
    const cells = Object.values(VARIANTES).map((V) => {
      const r = rajadaM(V.model, b, V.custo[arma], SPEED[arma]);
      return padc(r.n === Infinity ? '∞ sust.' : `${r.ate25}→${r.n}`, 12);
    });
    console.log('  ' + pad(b.nome, 22) + cells.join(''));
  }
}
