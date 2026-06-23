// sim-defesa-armas.mjs — testa o conserto do desbalanceamento das armas pesadas/2-mãos
// adicionando a DEFESA-DA-ARMA ao duelo (que o sim-duelo não modelava).
// Regra nova: leve/média +1 · haste +2 · PESADA −2 (era −1) · distância 0.
// 1 mão pode somar defesa da mão inábil: nada, arma-de-parada (+1) ou escudo (+3).
// 2 mãos (haste/pesada) não têm mão livre. Linha de Ticks, guarda P=2, sem armadura.
// Uso: node scripts/sim-defesa-armas.mjs
const TRIALS = 8000;
const P = 2;
const d6 = () => 1 + Math.floor(Math.random() * 6);
const floor = Math.floor;
const QA_W = { 1: { b: 3, d: 2 }, 2: { b: 2, d: 4 }, 3: { b: 1, d: 6 } };

// arma: classe, speed, dado, acerto, mãos, modo, perf, defArma(NOVO)
const ARMAS = {
  Adaga:    { cl:'leve',  spd:5, die:1, acc:2, hands:1, mode:'perfConc', perf:0, wdef:1 },
  EspCurta: { cl:'leve',  spd:5, die:1, acc:2, hands:1, mode:'corte',    perf:0, wdef:1 },
  EspLonga: { cl:'media', spd:6, die:2, acc:1, hands:1, mode:'corte',    perf:0, wdef:1 },
  Machado:  { cl:'media', spd:6, die:2, acc:1, hands:1, mode:'corte',    perf:0, wdef:1 },
  Maca:     { cl:'media', spd:6, die:2, acc:1, hands:1, mode:'impacto',  perf:0, wdef:1 },
  Picareta: { cl:'media', spd:6, die:2, acc:1, hands:1, mode:'perfConc', perf:2, wdef:1 },
  Lanca:    { cl:'haste', spd:6, die:2, acc:1, hands:2, mode:'perfConc', perf:1, wdef:2 },
  Montante: { cl:'pesada',spd:7, die:3, acc:0, hands:2, mode:'corte',    perf:1, wdef:-2 },
  Martelo:  { cl:'pesada',spd:7, die:3, acc:0, hands:2, mode:'impacto',  perf:2, wdef:-2 },
};
const lista = Object.keys(ARMAS);

// offhand: bônus de defesa extra para armas de 1 mão (0=nada, 1=arma de parada, 3=escudo)
function lutador(arma, offhand) {
  const w = ARMAS[arma];
  const extra = w.hands === 1 ? offhand : 0;
  return {
    ah:10, centelha:1, vigor:4, dmgAttr:4, pvMax:37, pv:37, guard:0, nextTick:0,
    die:w.die, acc:w.acc, hands:w.hands, mode:w.mode, perf:w.perf, spd:w.spd,
    wdef:w.wdef + extra,
  };
}
const baseDef = (c) => c.ah*2 + c.centelha*2 + c.wdef;          // sem armadura
const rollTotal = (c) => { let s=0; for(let i=0;i<floor(c.ah/2);i++) s+=d6(); return s + (c.ah%2?2:0) + c.acc + c.centelha*2; };

function atacar(A, D) {
  const effDef = baseDef(D) - P*D.guard;
  const total = rollTotal(A);
  const qaMargin = QA_W[A.die].b + 0; // sem armadura → QA armadura 0
  let dano = 0;
  if (total > effDef) {
    const m = floor((total - effDef)/6);
    const soakNat = A.mode==='impacto' ? D.vigor : floor(D.vigor/2);
    const soak = soakNat + D.centelha;
    let dmg = A.dmgAttr*(A.hands===2?2:1) - soak;
    for (let i=0;i<A.die+m;i++) dmg += d6();
    dano = Math.max(0, dmg);
  } else if (total >= effDef - qaMargin) {
    dano = QA_W[A.die].d; // raspão (armadura 0 → sem redução)
  }
  D.pv -= dano; A.guard += P; D.guard += P;
}
function duelo(armaA, armaB, offhand) {
  const A=lutador(armaA,offhand), B=lutador(armaB,offhand);
  A.nextTick=1+Math.floor(Math.random()*A.spd); B.nextTick=1+Math.floor(Math.random()*B.spd);
  for(let t=1;t<=4000;t++){
    for(const [C,O] of [[A,B],[B,A]]) if(C.nextTick===t && C.pv>0 && O.pv>0){ C.guard=0; atacar(C,O); C.nextTick=t+C.spd; }
    if(B.pv<=0&&A.pv<=0)return 0.5; if(B.pv<=0)return 1; if(A.pv<=0)return 0;
  }
  return 0.5;
}
function winRate(a,b,offhand){ if(a===b)return 0.5; let s=0; for(let i=0;i<TRIALS;i++) s+=duelo(a,b,offhand); return s/TRIALS; }

function rodar(titulo, offhand, oldRule) {
  // oldRule: ignora wdef (todos 0) — baseline antigo
  const wdefSnap = {};
  if (oldRule) for (const k of lista){ wdefSnap[k]=ARMAS[k].wdef; ARMAS[k].wdef=0; }
  console.log(`\n--- ${titulo} ---`);
  const med = {};
  for (const a of lista){ let s=0; for(const b of lista) s += a===b?0.5:winRate(a,b,offhand); med[a]=s/lista.length; }
  const ord = lista.slice().sort((x,y)=>med[y]-med[x]);
  for (const a of ord) console.log(`  ${a.padEnd(9)} ${(med[a]*100).toFixed(0).padStart(3)}%  ${'█'.repeat(Math.round(med[a]*40))}`);
  if (oldRule) for (const k of lista) ARMAS[k].wdef=wdefSnap[k];
}

console.log('=== Conserto das armas pesadas: Defesa-da-Arma + escudo/mão inábil ===');
console.log('win% médio de cada arma contra o campo (50% = parelho). A+H10 C1, Vigor4, sem armadura.');
rodar('BASELINE antigo: SEM Defesa-da-Arma (como no sim-duelo)', 0, true);
rodar('NOVA regra · 1 mão SÓ a arma (def +1) · haste +2 · pesada −2', 0, false);
rodar('NOVA regra · 1 mão + ARMA na mão inábil (+1 → def +2)', 1, false);
rodar('NOVA regra · 1 mão + ESCUDO (+3 → def +4)', 3, false);
