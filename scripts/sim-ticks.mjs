// sim-ticks.mjs — banco de provas da REVISÃO DA LINHA DO TEMPO, em lote, no terminal.
//
// O motor mora em `lib-tempo.mjs` e é o MESMO que roda dentro da bancada interativa
// (`combate-tempo-bench.html`, gerada por `gen-bench-tempo.mjs`). Aqui só ficam as baterias
// e a formatação. O catálogo é o de verdade: `src/data/armas.json` e `armaduras.json`.
//
// Uso: node scripts/sim-ticks.mjs             relatório completo
//      node scripts/sim-ticks.mjs --n 20000   mais tentativas por célula
//      node scripts/sim-ticks.mjs --seed 777  outra semente
//      node scripts/sim-ticks.mjs --so B,L    só algumas baterias
//
// O robô é GANANCIOSO: usa toda regra nova sempre que ela é legal. Os desvios medidos são o
// teto do abuso, não a jogada esperada.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  REGRAS_PADRAO, comRegras, montarArma, montarArmadura,
  bateria, refrega, roundRobin, porClasse, bateriaDistancia, criarRng, lutador, cena,
} from './lib-tempo.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const lerJson = (p) => JSON.parse(readFileSync(join(RAIZ, p), 'utf8'));

const ARG = Object.fromEntries(
  process.argv.slice(2).join(' ').split('--').filter(Boolean)
    .map((s) => s.trim().split(/\s+/)).map(([k, v]) => [k, v ?? 'true']),
);
const N = Number(ARG.n || 8000);
const SEMENTE = Number(ARG.seed || 20260818);
const SO = ARG.so ? new Set(ARG.so.split(',').map((s) => s.trim().toUpperCase())) : null;
const quer = (letra) => !SO || SO.has(letra);

// ---------------------------------------------------------------- catálogo
const armasJson = lerJson('src/data/armas.json');
const armadurasJson = lerJson('src/data/armaduras.json');
const CAT = {
  armas: Object.fromEntries(armasJson.map((w) => [w.id, montarArma(w)])),
  armaduras: Object.fromEntries(armadurasJson.map((a) => [a.id, montarArmadura(a)])),
};
// A Arte não é arma de catálogo: é o extremo do eixo (Preparo 7, Recuperação 0) e entra
// como boneco de prova, para medir quantas conjurações sobrevivem à pressão.
CAT.armas.arte = montarArma({
  id: 'arte', nome: 'Arte de grau 6', classe: 'arte', dado: 6, danoBonus: 0, acerto: 1,
  maos: 1, ticks: 7, forcaMult: 0, tipoDano: 'impacto',
  modos: [{ tipo: 'impacto', principal: true }], tags: [],
});

const CORPO = ['adaga', 'espada-curta', 'espada-longa', 'machado', 'maca', 'picareta-de-guerra',
  'lanca', 'alabarda', 'montante', 'martelo-de-guerra'];
const CLASSES = ['leve', 'media', 'haste', 'pesada'];

// ---------------------------------------------------------------- modelos
const HOJE = comRegras(REGRAS_PADRAO, {
  usarPreparo: false, redirecionar: false,
  fora: { ...REGRAS_PADRAO.fora, ligada: false }, interrupcao: 0,
});
const PR = comRegras(REGRAS_PADRAO, {
  fora: { ...REGRAS_PADRAO.fora, ligada: false }, interrupcao: 0,
});
const PR_DECL = comRegras(PR, { guardaEm: 'declara' });
const PR_SEM_RED = comRegras(PR, { redirecionar: false });
const COMPLETO = REGRAS_PADRAO;

// ---------------------------------------------------------------- formatação
const pct = (x) => `${(x * 100).toFixed(1)}%`;
const sgn = (x, c = 1) => `${x >= 0 ? '+' : '−'}${Math.abs(x).toFixed(c)}`;
const L = (s = '') => console.log(s);
const T = (s) => { L(); L(s); L('─'.repeat(Math.min(92, s.length + 2))); };
const nome = (id) => CAT.armas[id].nome;
const op = { n: N, semente: SEMENTE };

L('╔════════════════════════════════════════════════════════════════════════════════════════╗');
L('║  BANCO DE PROVAS DA LINHA DO TEMPO — Preparo/Recuperação, interrupção e dívida de Ticks ║');
L('╚════════════════════════════════════════════════════════════════════════════════════════╝');
L(`Semente ${SEMENTE} · ${N} cenas por célula · catálogo real (armas.json, armaduras.json).`);
L('Lutador padrão: Atributo+Habilidade 10, Centelha 1, Vigor 4, Força 4, PV 37.');
L(`Preparo por classe: ${CLASSES.map((c) => `${c} ${REGRAS_PADRAO.preparo[c]}`).join(' · ')}  (P + R = a Velocidade de hoje)`);
L('O robô é ganancioso: usa toda regra nova sempre que ela é legal.');

// ---- A) sanidade ---------------------------------------------------------
if (quer('A')) {
  T('A) Sanidade — espelho (a mesma arma dos dois lados). Win% tem de ficar em 50%.');
  L('  arma                    hoje              com P/R           Δ duração');
  for (const a of CORPO) {
    const h = bateria({ arma: a }, { arma: a }, HOJE, CAT, op);
    const p = bateria({ arma: a }, { arma: a }, PR, CAT, op);
    L(`  ${nome(a).padEnd(22)} ${pct(h.win)} · ${h.ticks.toFixed(1).padStart(5)}t   ${pct(p.win)} · ${p.ticks.toFixed(1).padStart(5)}t   ${sgn(p.ticks - h.ticks)}t`);
  }
}

// ---- B) round-robin ------------------------------------------------------
let rrHoje, rrPR, clHoje, clPR;
if (quer('B') || quer('E') || quer('F') || quer('K') || quer('L')) {
  rrHoje = roundRobin(CORPO, HOJE, CAT, op);
  rrPR = roundRobin(CORPO, PR, CAT, op);
  clHoje = porClasse(rrHoje, CAT); clPR = porClasse(rrPR, CAT);
}
if (quer('B')) {
  T('B) Round-robin — win% de cada arma contra todas as outras (sem armadura).');
  const rrDecl = roundRobin(CORPO, PR_DECL, CAT, op);
  L('  arma                   classe   P    hoje     P/R (guarda no golpe)   P/R (guarda na declaração)');
  for (const a of CORPO) {
    const cl = CAT.armas[a].classe;
    L(`  ${nome(a).padEnd(22)} ${cl.padEnd(7)} ${String(REGRAS_PADRAO.preparo[cl]).padEnd(3)} ${pct(rrHoje[a]).padStart(6)}   `
      + `${pct(rrPR[a]).padStart(6)} (${sgn((rrPR[a] - rrHoje[a]) * 100)})          ${pct(rrDecl[a]).padStart(6)} (${sgn((rrDecl[a] - rrHoje[a]) * 100)})`);
  }
  const clDecl = porClasse(rrDecl, CAT);
  L();
  L('  média por classe:');
  for (const c of CLASSES) {
    L(`    ${c.padEnd(7)} hoje ${pct(clHoje[c])} → guarda no golpe ${pct(clPR[c])} (${sgn((clPR[c] - clHoje[c]) * 100)})`
      + ` · guarda na declaração ${pct(clDecl[c])} (${sgn((clDecl[c] - clHoje[c]) * 100)})`);
  }
}

// ---- C) sensibilidade ----------------------------------------------------
if (quer('C')) {
  T('C) Sensibilidade — quanto Preparo a arma pesada aguenta.');
  L('  P pesada   Martelo vs Espada Curta   Montante vs Adaga   golpe perdido no ar (3v3)   duração');
  for (const p of [0, 1, 2, 3, 4]) {
    const R = comRegras(PR, { preparo: { ...PR.preparo, pesada: p } });
    const r1 = bateria({ arma: 'martelo-de-guerra' }, { arma: 'espada-curta' }, R, CAT, op);
    const r2 = bateria({ arma: 'montante' }, { arma: 'adaga' }, R, CAT, op);
    const m = refrega('martelo-de-guerra', 'espada-curta', comRegras(R, { redirecionar: false }), CAT, { n: Math.max(2000, Math.floor(N / 4)), semente: SEMENTE });
    L(`  ${String(p).padEnd(10)} ${pct(r1.win).padStart(6)}                    ${pct(r2.win).padStart(6)}              ${pct(m.perdidosPct).padStart(6)}                      ${r1.ticks.toFixed(1)}t`);
  }
}

// ---- D) a janela ---------------------------------------------------------
if (quer('D')) {
  T('D) A janela tática — declarar uma ação contra um alvo que está em Preparo.');
  L('  matchup                                        por duelo   % das declarações');
  for (const [a, b] of [['espada-curta', 'martelo-de-guerra'], ['adaga', 'montante'],
    ['espada-longa', 'martelo-de-guerra'], ['lanca', 'montante'],
    ['martelo-de-guerra', 'martelo-de-guerra'], ['espada-longa', 'espada-longa'],
    ['espada-curta', 'espada-curta']]) {
    const r = bateria({ arma: a }, { arma: b }, PR, CAT, op);
    L(`  ${`${nome(a)} vs ${nome(b)}`.padEnd(46)} ${r.janelasPorDuelo.toFixed(2).padStart(5)}       ${pct(r.janelaTaxa).padStart(6)}`);
  }
}

// ---- E) o que interromper compra ----------------------------------------
if (quer('E')) {
  T('E) O que interromper compra — o golpe fora de hora que conecta em quem está montando.');
  L('  o que compra          pen.   ' + CLASSES.map((c) => c.padStart(7)).join(' ') + '   pior desvio   ações/duelo   duração');
  L(`  ${'(referência, sem ação fora de hora)'.padEnd(28)} ` + CLASSES.map((c) => pct(clPR[c]).padStart(7)).join(' ') + '        —            —          '
    + bateria({ arma: 'espada-longa' }, { arma: 'espada-longa' }, PR, CAT, op).ticks.toFixed(1) + 't');
  for (const [compra, lbl] of [[1, 'atrasa 1 Tick'], [3, 'atrasa 3 Ticks'], ['espelho', 'atrasa o que paguei'], ['cancela', 'cancela a ação']]) {
    for (const pen of [0, 2, 4]) {
      const R = comRegras(COMPLETO, { interrupcao: compra, fora: { ...COMPLETO.fora, pen } });
      const cl = porClasse(roundRobin(CORPO, R, CAT, op), CAT);
      const dz = bateria({ arma: 'espada-curta' }, { arma: 'martelo-de-guerra' }, R, CAT, op);
      const desvio = Math.max(...CLASSES.map((c) => Math.abs(cl[c] - clPR[c])));
      L(`  ${lbl.padEnd(21)} ${('−' + pen).padEnd(6)} ` + CLASSES.map((c) => pct(cl[c]).padStart(7)).join(' ')
        + `   ${sgn(desvio * 100).padStart(7)}       ${dz.foraPorDuelo.toFixed(2).padStart(5)}        ${dz.ticks.toFixed(1)}t`);
    }
    L();
  }
}

// ---- L) as travas do preço ----------------------------------------------
if (quer('L')) {
  T('L) As travas do preço — tirando uma de cada vez (interrupção espelho, sem penalidade).');
  L('  variante                                    ' + CLASSES.map((c) => c.padStart(7)).join(' ') + '   pior desvio   ações/duelo  duração');
  const mostra = (lbl, R) => {
    const cl = porClasse(roundRobin(CORPO, R, CAT, op), CAT);
    const dz = bateria({ arma: 'espada-curta' }, { arma: 'martelo-de-guerra' }, R, CAT, op);
    const desvio = Math.max(...CLASSES.map((c) => Math.abs(cl[c] - clPR[c])));
    L(`  ${lbl.padEnd(43)} ` + CLASSES.map((c) => pct(cl[c]).padStart(7)).join(' ')
      + `   ${sgn(desvio * 100).padStart(7)}       ${dz.foraPorDuelo.toFixed(2).padStart(5)}       ${dz.ticks.toFixed(1)}t`);
  };
  const dzRef = bateria({ arma: 'espada-curta' }, { arma: 'martelo-de-guerra' }, PR, CAT, op);
  L(`  ${'(referência, sem ação fora de hora)'.padEnd(43)} ` + CLASSES.map((c) => pct(clPR[c]).padStart(7)).join(' ') + `        —           —         ${dzRef.ticks.toFixed(1)}t`);
  mostra('preço cheio (as três travas)', COMPLETO);
  mostra('sem a trava da guarda (ela se refaz)', comRegras(COMPLETO, { fora: { ...COMPLETO.fora, guardaCongela: false } }));
  mostra('sem a trava de uma por ação', comRegras(COMPLETO, { fora: { ...COMPLETO.fora, umaPorJanela: false } }));
  mostra('custo meia Velocidade', comRegras(COMPLETO, { fora: { ...COMPLETO.fora, custo: 0.5 } }));
  mostra('quem está em Preparo também reage', comRegras(COMPLETO, { fora: { ...COMPLETO.fora, emPreparoPodeReagir: true } }));
  mostra('gatilho livre (reage sempre que pode)', comRegras(COMPLETO, { fora: { ...COMPLETO.fora, gatilho: 'sempre' } }));
  mostra('sem trava nenhuma', comRegras(COMPLETO, { fora: { ...COMPLETO.fora, guardaCongela: false, umaPorJanela: false, custo: 0.5, gatilho: 'sempre' } }));
}

// ---- F) a dívida comprando Defesa (reprovado) ---------------------------
if (quer('F')) {
  T('F) A variante reprovada — a dívida comprando Defesa (aparo desesperado).');
  L('  variante                              duração   aparos/duelo   ' + CLASSES.map((c) => c.padStart(7)).join(' '));
  const dzRef = bateria({ arma: 'espada-longa' }, { arma: 'espada-longa' }, PR, CAT, op);
  L(`  ${'sem aparo (referência)'.padEnd(37)} ${dzRef.ticks.toFixed(1).padStart(6)}t        —         ` + CLASSES.map((c) => pct(clPR[c]).padStart(7)).join(' '));
  for (const [lbl, ap] of [
    ['+6 Def por 2 Ticks, à vontade', { custo: 2, bonus: 6, limiar: .45, umaPorJanela: false }],
    ['+6 Def por 3 Ticks, 1 por ação', { custo: 3, bonus: 6, limiar: .45, umaPorJanela: true }],
    ['+6 Def por 3 Ticks, só abaixo de 20%', { custo: 3, bonus: 6, limiar: .20, umaPorJanela: true }],
    ['+6 Def por 3 Ticks, uma por cena', { custo: 3, bonus: 6, limiar: .45, umaPorJanela: true, umaPorCena: true }],
  ]) {
    const R = comRegras(PR, { aparo: ap });
    const dz = bateria({ arma: 'espada-longa' }, { arma: 'espada-longa' }, R, CAT, op);
    const cl = porClasse(roundRobin(CORPO, R, CAT, op), CAT);
    L(`  ${lbl.padEnd(37)} ${dz.ticks.toFixed(1).padStart(6)}t     ${dz.aparosPorDuelo.toFixed(2).padStart(5)}       ` + CLASSES.map((c) => pct(cl[c]).padStart(7)).join(' '));
  }
}

// ---- G) refrega ----------------------------------------------------------
if (quer('G')) {
  T('G) Refrega 3v3 com foco de fogo — o Preparo faz o golpe pesado morrer no ar?');
  L('  time                                       regra                 vitórias   perdidos   duração');
  for (const [ta, tb] of [['martelo-de-guerra', 'espada-curta'], ['montante', 'adaga'], ['espada-longa', 'espada-longa']]) {
    const lbl = `3 ${nome(ta)} vs 3 ${nome(tb)}`;
    const opr = { n: Math.max(2000, Math.floor(N / 3)), semente: SEMENTE };
    const h = refrega(ta, tb, HOJE, CAT, opr);
    const s = refrega(ta, tb, PR_SEM_RED, CAT, opr);
    const r = refrega(ta, tb, PR, CAT, opr);
    L(`  ${lbl.padEnd(42)} hoje                  ${pct(h.win).padStart(6)}    ${pct(h.perdidosPct).padStart(6)}     ${h.ticks.toFixed(1)}t`);
    L(`  ${''.padEnd(42)} P/R sem redirecionar  ${pct(s.win).padStart(6)}    ${pct(s.perdidosPct).padStart(6)}     ${s.ticks.toFixed(1)}t`);
    L(`  ${''.padEnd(42)} P/R + redirecionar    ${pct(r.win).padStart(6)}    ${pct(r.perdidosPct).padStart(6)}     ${r.ticks.toFixed(1)}t`);
  }
}

// ---- H) contra armadura --------------------------------------------------
if (quer('H')) {
  T('H) Contra armadura — o Preparo muda a relação arma × armadura? (win% do atacante)');
  L('  arma                  alvo veste          hoje     P/R      Δ');
  for (const a of ['espada-curta', 'espada-longa', 'martelo-de-guerra', 'lanca']) {
    for (const ar of ['nenhuma', 'malha', 'placa-completa']) {
      const h = bateria({ arma: a }, { arma: 'espada-longa', armadura: ar }, HOJE, CAT, op);
      const p = bateria({ arma: a }, { arma: 'espada-longa', armadura: ar }, PR, CAT, op);
      L(`  ${nome(a).padEnd(21)} ${CAT.armaduras[ar].nome.padEnd(19)} ${pct(h.win).padStart(6)}  ${pct(p.win).padStart(6)}   ${sgn((p.win - h.win) * 100)}`);
    }
  }
}

// ---- M) carga voluntária -------------------------------------------------
if (quer('M')) {
  T('M) Carga voluntária — pagar N Ticks a mais de Preparo por um bônus na rolagem.');
  L('  Duelo espelho: A carrega, B joga normal. 50% é a troca neutra.');
  for (const a of ['espada-curta', 'espada-longa', 'martelo-de-guerra']) {
    L();
    L(`  ${nome(a)} (Velocidade ${CAT.armas[a].ticks}, Preparo ${REGRAS_PADRAO.preparo[CAT.armas[a].classe]})`);
    L('    N       +2      +4      +6      +8     +10');
    for (const n of [1, 2, 3]) {
      const cels = [2, 4, 6, 8, 10].map((b) => {
        const R = comRegras(PR, { carga: { bonusPorTick: b, teto: 6 } });
        return pct(bateria({ arma: a, carga: { n } }, { arma: a }, R, CAT, { n: Math.max(4000, Math.floor(N / 2)), semente: SEMENTE }).win).padStart(6);
      });
      L(`    ${n}   ${cels.join('  ')}`);
    }
  }
  L();
  L('  (o bônus que cruza 50% é o preço justo de UM Tick de Preparo comprado)');
}

// ---- N) o feiticeiro sob pressão ----------------------------------------
if (quer('N')) {
  T('N) O feiticeiro sob pressão — a Arte é 7/0, o extremo do eixo e o alvo mais interrompível.');
  L('  regra da interrupção                     Artes que saem, nu   de Placa Completa');
  const feit = (lbl, R) => {
    const opf = { n: Math.max(3000, Math.floor(N / 2)), semente: SEMENTE };
    const nu = bateria({ arma: 'arte' }, { arma: 'espada-longa' }, R, CAT, opf);
    const pl = bateria({ arma: 'arte', armadura: 'placa-completa' }, { arma: 'espada-longa' }, R, CAT, opf);
    L(`  ${lbl.padEnd(40)} ${pct(nu.arteSai).padStart(6)}              ${pct(pl.arteSai).padStart(6)}`);
  };
  feit('sem interrupção nenhuma', PR);
  feit('espelho, sem teto', COMPLETO);
  feit('espelho, teto = a Velocidade da ação', comRegras(COMPLETO, { tetoAtraso: 1 }));
  feit('atraso fixo de 2 Ticks', comRegras(COMPLETO, { interrupcao: 2 }));
  feit('cancela a ação', comRegras(COMPLETO, { interrupcao: 'cancela' }));
  L();
  L('  (a coluna de vitórias não entra: o boneco de Arte tem a Vida e a Defesa de um espadachim,');
  L('   sem aliados e sem alcance, e por isso morre quase sempre com ou sem a regra)');
}

// ---- O) distância --------------------------------------------------------
if (quer('O')) {
  T('O) O arqueiro e quem fecha a distância — o Preparo do arco custa alguma coisa?');
  L('  O guerreiro corre 7 m por Tick; o arqueiro atira parado. Contato a 2 m.');
  L();
  L('  arco                  distância   P do arco   tiros antes   tiros depois   Tick do contato   win% do arqueiro');
  for (const arco of ['arco-longo', 'besta-media']) {
    for (const dist of [30, 60, 100]) {
      for (const p of [0, 2, 3]) {
        const R = comRegras(COMPLETO, { preparo: { ...COMPLETO.preparo, distancia: p } });
        const r = bateriaDistancia({ arma: arco }, { arma: 'espada-longa' }, R, CAT,
          { n: Math.max(3000, Math.floor(N / 2)), semente: SEMENTE, dist });
        L(`  ${nome(arco).padEnd(21)} ${String(dist + ' m').padEnd(11)} ${String(p).padEnd(11)} ${r.tirosAntes.toFixed(2).padStart(6)}        ${r.tirosDepois.toFixed(2).padStart(6)}         ${String(r.tickDoContato ?? '—').padStart(5)}             ${pct(r.winArqueiro)}`);
      }
    }
    L();
  }
}

// ---- P) duelo narrado ----------------------------------------------------
if (quer('P')) {
  T('P) Um duelo narrado, Tick a Tick — para ver a regra funcionando.');
  const rnd = criarRng(SEMENTE);
  const A = lutador({ arma: 'espada-longa', rotulo: 'Kael', regras: COMPLETO }, CAT);
  const B = lutador({ arma: 'martelo-de-guerra', rotulo: 'Brontes', regras: COMPLETO }, CAT);
  const r = cena([A], [B], COMPLETO, rnd, { narrar: true });
  for (const linha of r.log) L('  ' + linha);
  L(`  → vencedor: ${r.vencedor === 'A' ? A.nome : r.vencedor === 'B' ? B.nome : 'empate'}, no Tick ${r.ticks}.`);
}
L();
