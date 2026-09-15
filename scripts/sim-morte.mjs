// sim-morte.mjs · quanto tempo um caído tem antes de morrer, por limite.
//
// A `M-21` decidiu que o personagem CAI a PV zero e só MORRE ao perder vida ALÉM
// do zero, até um limite, e deixou o limite em aberto entre **metade** e **um
// quarto** do PV máximo. Este arquivo não escolhe: ele mede os dois, e o número
// volta para a mesa.
//
// POR QUE O GRUPO E NÃO O DUELO: a pergunta é sobre alguém ser SOCORRIDO ou
// REMATADO, e isso precisa de mais de dois no tabuleiro. O laço de combate é o
// do `sim-grupo.mjs`, IMPORTADO e não recopiado: ali o `limiteMorte` é 0 por
// padrão, que é o comportamento de antes desta medição (quem chega a 0 sai da
// briga e nada mais lhe acontece).
//
// A RESTRIÇÃO QUE A MEDIÇÃO ATACA. O capítulo promete que "um aliado Caído que
// ainda sangra continua acumulando dano rumo à morte: alguém precisa chegar até
// ele". Um limite que não deixa ninguém chegar a tempo APAGA essa cena do jogo,
// e é por isso que a última seção compara a margem medida com o custo, em Ticks,
// de atravessar a distância e estabilizar.
//
//   node scripts/sim-morte.mjs
import { combate, maxDuelista, pvMax, golpe } from './sim-grupo.mjs';

const fl = Math.floor;
const CFG = { defTerm: (c) => c, qaC: false };   // a config `baseline` do sim-grupo
const N = 6000;

/** Roda N batalhas e devolve o diário acumulado. */
function medir(clo, chi, opts) {
  const grp = maxDuelista(clo), chefe = maxDuelista(chi);
  const d = { caidos: 0, mortos: 0, sobreviveram: 0, margem: [], batalhas: 0, pv: 0 };
  for (let i = 0; i < N; i++) combate(grp, chefe, CFG, { ...opts, diario: d });
  return d;
}

const pct = (a, b) => (b ? `${((a / b) * 100).toFixed(0)}%` : '  ·');
const mediana = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[fl(s.length / 2)];
};
const media = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

// ===================================================================== o cenário
const CLO = 2, CHI = 3;
const proto = maxDuelista(CLO);
const PV = pvMax(proto);
const LIMITES = [
  ['0 (hoje: cair é morrer)', 0],
  [`PV ÷ 4 = ${fl(PV / 4)}`, fl(PV / 4)],
  [`PV ÷ 2 = ${fl(PV / 2)}`, fl(PV / 2)],
];

console.log('='.repeat(84));
console.log(`A MORTE ABAIXO DE ZERO · 3 × C${CLO} contra 1 × C${CHI}, ${N} batalhas por célula`);
console.log(`PV do combatente do grupo: ${PV} · golpe do chefe medido abaixo`);
console.log('='.repeat(84));

// Quanto o chefe tira por golpe, para a margem em Ticks ter escala em GOLPES.
// Medido pelo mesmo caminho do combate, e não estimado: a margem só se lê junto
// com o tamanho do golpe que a consome.
{
  const grp = maxDuelista(CLO), chefe = maxDuelista(CHI);
  for (const cb of [0, 2, 3]) {
    const xs = [];
    for (let i = 0; i < 40000; i++) {
      xs.push(golpe(chefe, grp, CFG, { flank: 0, extraDice: cb, atkHP: pvMax(chefe), defHP: pvMax(grp) }));
    }
    const acertos = xs.filter((x) => x > 0);
    const m = mediana(acertos);
    console.log(`  chefe combo+${cb}: acerta ${pct(acertos.length, xs.length)} dos golpes,`
      + ` e o golpe que acerta tira ${m} (mediana) / ${media(acertos).toFixed(1)} (média).`);
  }
  console.log('');
}

// O chefe de `combo+0` NÃO derruba ninguém: o grupo ganha 100% das vezes e sai
// inteiro (é o que o `sim-grupo` já mostrava). Medir só ali daria zero caídos e
// zero informação. O `combo` é o multiplicador de poder do chefe que aquele
// relatório já varria, e é ele que decide se alguém cai: por isso a medição
// corre nos quatro, e a primeira coluna de cada bloco diz quantos caem.
const COMBOS = [0, 1, 2, 3];
for (const [rot, remata] of [['O CHEFE REMATA quem caiu', true], ['O CHEFE IGNORA quem caiu', false]]) {
  console.log(`\n### ${rot}`);
  console.log('  limite                 combo   caem/batalha   morrem   Ticks de margem (mediana / média)');
  for (const [nome, lim] of LIMITES) {
    for (const cb of COMBOS) {
      const d = medir(CLO, CHI, { limiteMorte: lim, chefeRemata: remata, bossTargets: 1, bossCombo: cb });
      const med = mediana(d.margem), mea = media(d.margem);
      console.log(`  ${nome.padEnd(21)} +${cb}   ${(d.caidos / d.batalhas).toFixed(2).padStart(11)}`
        + `   ${pct(d.mortos, d.caidos).padStart(6)}`
        + `   ${(med == null ? '·' : String(med)).padStart(11)} / ${mea == null ? '·' : mea.toFixed(1)}`);
    }
  }
}

// ============================================== a janela de socorro, em Ticks
console.log('\n' + '='.repeat(84));
console.log('A JANELA DE SOCORRO · a margem medida contra o custo de chegar e estabilizar');
console.log('='.repeat(84));

// O custo de socorrer, em Ticks, pelas réguas publicadas:
//   · Deslocamento de Batalha = 2 + (Destreza + Atletismo) ÷ 4, e o PRIMEIRO
//     Tick de movimento é de graça durante outra ação (`combate.md`);
//   · estabilizar é uma ação utilitária, e a tabela de Velocidade do capítulo dá
//     4 Ticks a essa faixa. Este 4 é a ÚNICA suposição desta seção, e por isso a
//     tabela mostra 3 e 5 ao lado.
const desloc = Math.round(2 + (proto.des + 0) / 4);
console.log(`\nDeslocamento de Batalha do socorrista: ${desloc} m por Tick (Destreza ${proto.des}, Atletismo 0).`);
console.log('O primeiro Tick de movimento é de graça durante a ação, então a distância só custa');
console.log(`Ticks a partir de ${desloc} m.\n`);
console.log('  distância   Ticks de deslocamento   + ação 3 / 4 / 5 = custo total do socorro');
for (const m of [0, desloc, desloc * 2, desloc * 3]) {
  const passos = Math.max(0, Math.ceil(m / desloc) - 1);   // o primeiro é grátis
  console.log(`  ${String(m + ' m').padEnd(11)} ${String(passos).padStart(19)}   `
    + [3, 4, 5].map((a) => String(passos + a)).join(' / '));
}

console.log('\n  E a margem que cada limite dá, do golpe que derruba até a morte:');
for (const [nome, lim] of LIMITES) {
  if (!lim) { console.log(`  ${nome.padEnd(21)}      margem nenhuma: cair É morrer`); continue; }
  for (const cb of [2, 3]) {
    const d = medir(CLO, CHI, { limiteMorte: lim, chefeRemata: true, bossTargets: 1, bossCombo: cb });
    const di = medir(CLO, CHI, { limiteMorte: lim, chefeRemata: false, bossTargets: 1, bossCombo: cb });
    const m1 = mediana(d.margem), m2 = mediana(di.margem);
    console.log(`  ${nome.padEnd(21)} +${cb}  rematado: ${(m1 == null ? 'ninguém morreu' : m1 + ' Ticks').padEnd(15)}`
      + ` ignorado: ${(m2 == null ? 'ninguém morreu' : m2 + ' Ticks').padEnd(15)}`
      + ` morrem ${pct(d.mortos, d.caidos)} contra ${pct(di.mortos, di.caidos)}`);
  }
}
console.log('');
