// sim-soak.mjs — compara a regra ATUAL de Soak natural com a PROPOSTA.
// ATUAL:  impacto = Vigor + Centelha ; corte/perf = ⌊Vigor/2⌋ + Centelha
// NOVA:   impacto = Vigor           ; corte/perf = Centelha
// (armadura soma por cima em ambas). Mede dano médio por ACERTO LIMPO (Margem 0),
// isolando o efeito do Soak. Uso: node scripts/sim-soak.mjs
const floor = Math.floor;
function nd6(n){let p={0:1};for(let i=0;i<n;i++){const np={};for(const s in p)for(let f=1;f<=6;f++)np[+s+f]=(np[+s+f]||0)+p[s]/6;p=np;}return p;}
function eHit(die, add){const p=nd6(die);let e=0;for(const s in p)e+=Math.max(0,(+s)+add)*p[s];return e;} // E[max(0, die·d6 + add)]

const soakOld = (V,C,mode)=> (mode==='impacto'? V : floor(V/2)) + C;
const soakNew = (V,C,mode)=> (mode==='impacto'? V : C);

// armaduras (soak por categoria)
const ARM = {
  Nenhuma:{i:0,c:0,p:0,rp:0}, Malha:{i:1,c:8,p:1,rp:1}, Placa:{i:6,c:11,p:4,rp:3},
};
const catOf = {corte:'c', impacto:'i', perfConc:'p'};

// armas de exemplo (dano-attr 4; 2 mãos dobra)
const WP = {
  'Esp.Longa (corte 2d6,1m)': {die:2, mode:'corte',    add:4, perf:0},
  'Maça (impacto 2d6,1m)':    {die:2, mode:'impacto',  add:4, perf:0},
  'Martelo (impacto 3d6,2m)': {die:3, mode:'impacto',  add:8, perf:2},
  'Lança (perf 2d6,2m)':      {die:2, mode:'perfConc', add:8, perf:1},
};

const ALVOS = [
  ['V4 C0 (mortal)',4,0],['V4 C1',4,1],['V4 C2',4,2],['V4 C3',4,3],
  ['V5 C0 (mortal)',5,0],['V6 C5 (semideus)',6,5],
];

function dano(wp, V, C, arm, regra){
  const a=ARM[arm]; const cat=catOf[wp.mode]; const armS = cat==='i'?a.i:cat==='c'?a.c:a.p;
  // gate de perfuração
  if((wp.mode==='perfConc')&& wp.perf < a.rp) return 0;
  const nat = regra==='old'? soakOld(V,C,wp.mode) : soakNew(V,C,wp.mode);
  return eHit(wp.die, wp.add - (nat+armS));
}

console.log('=== Soak natural: ATUAL vs NOVA ===');
console.log('ATUAL: impacto=Vigor+Centelha · corte/perf=⌊Vigor/2⌋+Centelha');
console.log('NOVA : impacto=Vigor          · corte/perf=Centelha\n');

console.log('--- Soak natural (sem armadura) ---');
console.log('alvo               I(old→new)   C(old→new)   P(old→new)');
for(const [lbl,V,C] of ALVOS){
  const io=soakOld(V,C,'impacto'),inn=soakNew(V,C,'impacto');
  const co=soakOld(V,C,'corte'),cn=soakNew(V,C,'corte');
  console.log(`  ${lbl.padEnd(18)} ${String(io).padStart(2)}→${String(inn).padEnd(2)}      ${String(co).padStart(2)}→${String(cn).padEnd(2)}      ${String(co).padStart(2)}→${String(cn).padEnd(2)}`);
}

for(const arm of Object.keys(ARM)){
  console.log(`\n--- Dano médio por ACERTO LIMPO (Margem 0) — armadura: ${arm} ---`);
  let head='alvo'.padEnd(18); for(const w of Object.keys(WP)) head+=w.split(' ')[0].padStart(11); console.log(head+'   (old → new)');
  for(const [lbl,V,C] of ALVOS){
    let row=lbl.padEnd(18);
    for(const w of Object.keys(WP)){
      const o=dano(WP[w],V,C,arm,'old'), n=dano(WP[w],V,C,arm,'new');
      row += `${o.toFixed(1)}→${n.toFixed(1)}`.padStart(11);
    }
    console.log(row);
  }
}
console.log('\n(dano por acerto limpo; Margem extra só aumenta proporcional. Hit-chance NÃO muda — Soak não afeta acerto.)');
