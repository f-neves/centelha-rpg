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
//      node scripts/sim-ticks.mjs --legado    reproduz as tabelas de antes de 19/08/2026,
//                                             com a Guarda sob pressão cobrada em dobro (K13)
//
// O robô é GANANCIOSO: usa toda regra nova sempre que ela é legal. Os desvios medidos são o
// teto do abuso, não a jogada esperada.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  REGRAS_PADRAO, REGRAS_PGR, REGRAS_HOJE, REGRAS_NORMAL, comRegras, montarArma, montarArmadura,
  bateria, refrega, roundRobin, porClasse, bateriaDistancia, criarRng, lutador, cena, atacar,
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
// A Pressão em dobro era um bug do motor (K13). O padrão agora é o correto, −2 por ataque;
// `--legado` volta ao regime antigo, que é o das tabelas publicadas no `Combate_Tempo.md`.
const LEGADO = ARG.legado ? { pressaoDupla: true, centelhaMult: 2 } : {};
const M = (r) => comRegras(r, LEGADO);

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
const HOJE = M(comRegras(REGRAS_PADRAO, {
  usarPreparo: false, redirecionar: false,
  fora: { ...REGRAS_PADRAO.fora, ligada: false }, interrupcao: 0,
}));
const PR = M(comRegras(REGRAS_PADRAO, {
  fora: { ...REGRAS_PADRAO.fora, ligada: false }, interrupcao: 0,
}));
const PR_DECL = comRegras(PR, { guardaEm: 'declara' });
const PR_SEM_RED = comRegras(PR, { redirecionar: false });
const COMPLETO = M(REGRAS_PADRAO);
const PGR = M(REGRAS_PGR);

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
L(ARG.legado
  ? 'MODO LEGADO: Pressão em DOBRO (−4/ataque) e Centelha ×2, como nas tabelas de antes de 20/08.'
  : 'Pressão −2 por ataque (K13) e Centelha ×1 no ataque e nas defesas (K23), como o site.');

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

// ==========================================================================
// As baterias da régua P/G/R, decidida em 19/08/2026 (§14 do Combate_Tempo.md).
// Elas rodam no regime correto da Pressão (−2 por ataque); `--legado` também as afeta,
// e aí os números não são os do documento.
// ==========================================================================

const LIMPO = ['adaga', 'espada-curta', 'espada-longa', 'machado', 'picareta-de-guerra',
  'lanca', 'montante', 'martelo-de-guerra'];
/** win% por classe e amplitude entre classes, no conjunto sem os fora-de-curva do K11. */
function perfil(R, armas = LIMPO, n = N) {
  const w = roundRobin(armas, R, CAT, { n, semente: SEMENTE });
  const c = porClasse(w, CAT);
  const v = CLASSES.map((k) => c[k]).filter((x) => x != null);
  return { c, win: w, amp: (Math.max(...v) - Math.min(...v)) * 100 };
}
const linhaPerfil = (lbl, p, extra = '') =>
  L(`  ${lbl.padEnd(30)} ${CLASSES.map((k) => pct(p.c[k]).padStart(6)).join(' ')}   ${p.amp.toFixed(1).padStart(4)}   ${extra}`);

// ---- Q) a régua P/G/R contra o que existe --------------------------------
if (quer('Q')) {
  T('Q) A régua P/G/R contra o sistema de hoje e contra o K1 (8 armas, sem Alabarda e Maça).');
  L('  A amplitude é a distância entre a melhor e a pior classe. Menor é melhor.');
  L();
  L(`  ${'modelo'.padEnd(30)} ${CLASSES.map((k) => k.padStart(6)).join(' ')}   amp    duelo espelho de espada longa`);
  for (const [lbl, R] of [['hoje (capítulo IX)', HOJE], ['K1 (a régua de 18/08)', COMPLETO], ['P/G/R (19/08)', PGR]]) {
    const d = bateria({ arma: 'espada-longa' }, { arma: 'espada-longa' }, R, CAT, op);
    linhaPerfil(lbl, perfil(R),
      `${d.ticks.toFixed(1)}t · ${(d.declsPorLado + d.foraPorDuelo / 2).toFixed(2)} decisões/lado · DV ${d.defMedia.toFixed(1)}`);
  }
  L();
  L('  A régua P/G/R por classe (P + G + R = a Velocidade de hoje):');
  for (const k of CLASSES) {
    const arma = CORPO.find((a) => CAT.armas[a].classe === k);
    const c = lutador({ arma, regras: PGR }, CAT);
    L(`    ${k.padEnd(8)} P${c.prep} · G1 · R${c.spd - c.prep - 1} = ${c.spd}`);
  }
}

// ---- R) o par (Defesa no ciclo) × (Defesa no Tick do Golpe) --------------
if (quer('R')) {
  T('R) O par: quanto a ação declarada custa de Defesa, e quanto custa o Tick do Golpe.');
  L('  Penalizar o Preparo é um imposto que a arma leve não paga, porque ela não tem Preparo.');
  L('  Por isso a coluna de baixo (P e R sem custo próprio) é a que mede melhor.');
  L();
  const par = (p, r, g) => comRegras(PGR, { preparoDV: p, recupDV: r, golpeDV: g });
  L(`  ${'P / R / Golpe'.padEnd(30)} ${CLASSES.map((k) => k.padStart(6)).join(' ')}   amp`);
  for (const [p, r, g] of [[2, 2, 4], [2, 2, 6], [3, 3, 6], [4, 4, 6], [2, 0, 4], [0, 2, 4],
    [0, 0, 4], [0, 0, 6], [0, 0, 8], [0, 0, 10]]) {
    linhaPerfil(`−${p} / −${r} / −${g}${p === 0 && r === 0 && g === 6 ? '  ← decidido' : ''}`, perfil(par(p, r, g)));
  }
}

// ---- S) empunhadura dupla ------------------------------------------------
if (quer('S')) {
  T('S) Empunhadura dupla — G de 2 Ticks, tirados da Recuperação.');
  const campo = (spec, R) => {
    let s = 0, k = 0;
    for (const b of LIMPO) { if (b === spec.arma) continue; s += bateria(spec, { arma: b }, R, CAT, op).win; k++; }
    return s / k;
  };
  const solo = campo({ arma: 'espada-curta' }, PGR);
  L(`  Referência: espada curta sozinha contra as outras 7 = ${pct(solo)}. O alvo é chegar perto disso.`);
  L();
  L(`  ${'dados perdidos'.padEnd(22)} ${'mesmo Tick'.padStart(16)} ${'G de 2 Ticks'.padStart(16)}`);
  for (const pen of [[1, 2], [1, 1], [0, 1], [2, 2]]) {
    const R = comRegras(PGR, { penDadosDupla: pen });
    const a = campo({ arma: 'espada-curta', dupla: true, juntos: true }, R);
    const b = campo({ arma: 'espada-curta', dupla: true }, R);
    const f = (x) => `${pct(x)} (${sgn((x - solo) * 100)})`.padStart(16);
    L(`  ${`−${pen[0]}d6 / −${pen[1]}d6${pen[0] === 1 && pen[1] === 1 ? '  ← decidido' : ''}`.padEnd(22)} ${f(a)} ${f(b)}`);
  }
  L();
  L('  (nos Ticks de Golpe da dupla vale a penalidade de P e R: a outra lâmina ainda apara)');
}

// ---- T) a cadeia de ataques ---------------------------------------------
if (quer('T')) {
  T('T) A cadeia: N repetições de (Preparo + Golpe) e UMA Recuperação, declaradas de uma vez.');
  L('  O freio é perder um dado a mais por golpe. Ele distingue pelo ALVO: o fraco tem Defesa');
  L('  baixa e apanha até do quarto golpe; o igual tem Defesa alta e o terceiro já não encosta.');
  const LACAIO = { ah: 6, pv: 18, forca: 3, vigor: 3, centelha: 0, arma: 'adaga' };
  const SOLDADO = { ah: 8, pv: 26, forca: 4, vigor: 3, centelha: 0, arma: 'espada-curta' };
  const contra = (spec, alvo, quantos, R) => {
    const rnd = criarRng(SEMENTE);
    let v = 0, t = 0;
    const reps = Math.max(1000, Math.floor(N / 2));
    for (let i = 0; i < reps; i++) {
      const H = lutador({ ...spec, regras: R }, CAT);
      const inim = Array.from({ length: quantos }, () => lutador({ ...alvo, regras: R }, CAT));
      const r = cena([H], inim, R, rnd);
      if (r.vencedor === 'A') v++;
      t += r.ticks;
    }
    return { win: v / reps, ticks: t / reps };
  };
  for (const freio of [[0, 0, 0, 0], [0, 1, 2, 3], [0, 2, 3, 4]]) {
    const R = comRegras(PGR, { penDadosCadeia: freio });
    L();
    L(`  freio ${freio.map((x) => (x ? `−${x}d6` : '0')).join(' / ')}${freio[1] === 1 ? '   ← decidido' : ''}`);
    L('    N  ciclo   duelo igual   1 soldado          2 lacaios');
    for (const cad = { n: 1 }; cad.n <= 4; cad.n++) {
      const spec = { arma: 'espada-curta', cadeia: cad.n, extraDaR: false };
      const c = lutador({ ...spec, regras: R }, CAT);
      const s = contra(spec, SOLDADO, 1, R), l = contra(spec, LACAIO, 2, R);
      L(`    ${cad.n}  ${String(c.spd).padEnd(7)} ${pct(bateria(spec, { arma: 'espada-curta' }, R, CAT, op).win).padStart(11)}   `
        + `${`${pct(s.win)} em ${s.ticks.toFixed(1)}t`.padEnd(18)} ${pct(l.win)} em ${l.ticks.toFixed(1)}t`);
    }
  }
}


// ---- U) os dois sistemas, com o mesmo conjunto de regras -----------------
// A §15 do Combate_Tempo.md decidiu que o jogo terá o sistema normal e o P/G/R, com UMA
// regra só. Esta bateria é o teste dessa promessa: a mesma regra medida nos dois lados.
if (quer('U')) {
  T('U) Os dois sistemas · as regras de 20/08 valem no normal e no P/G/R?');
  L('  O sistema normal resolve tudo no primeiro Tick; o P/G/R parte a Velocidade em três fases.');
  L('  As regras (escada, rajada, dupla, dívida) são as mesmas, escritas em Ticks e dados.');
  L();
  L(`  ${'preset'.padEnd(26)} ${CLASSES.map((k) => k.padStart(6)).join(' ')}   amp    duelo espelho de espada longa`);
  for (const [lbl, R] of [['hoje, sem regra nova', REGRAS_HOJE], ['normal + regras de 20/08', REGRAS_NORMAL], ['P/G/R + regras de 20/08', REGRAS_PGR]]) {
    const d = bateria({ arma: 'espada-longa' }, { arma: 'espada-longa' }, M(R), CAT, op);
    linhaPerfil(lbl, perfil(M(R)),
      `${d.ticks.toFixed(1)}t · ${(d.declsPorLado + d.foraPorDuelo / 2).toFixed(2)} decisões/lado`);
  }
  L();
  L('  As manobras, nos dois sistemas (win% contra a mesma arma golpeando normal):');
  L();
  L(`  ${'manobra'.padEnd(34)} ${'normal'.padStart(9)} ${'P/G/R'.padStart(9)}   ciclo (normal / P/G/R)`);
  const manobras = [
    ['leve · rajada de 2', 'espada-curta', { golpes: 2, rajada: true, extraDaR: false, rExtra: 1 }],
    ['leve · rajada de 3', 'espada-curta', { golpes: 3, rajada: true, extraDaR: false, rExtra: 2 }],
    ['leve · dupla', 'espada-curta', { dupla: true }],
    ['média · rajada de 2', 'espada-longa', { golpes: 2, rajada: true, extraDaR: false, rExtra: 1 }],
    ['média · dupla (ciclo +1)', 'espada-longa', { dupla: true, extraDaR: false }],
  ];
  for (const [lbl, arma, spec] of manobras) {
    const cels = [REGRAS_NORMAL, REGRAS_PGR].map((R) => pct(bateria({ arma, ...spec }, { arma }, M(R), CAT, op).win).padStart(9));
    const ciclos = [REGRAS_NORMAL, REGRAS_PGR].map((R) => lutador({ arma, ...spec, regras: M(R) }, CAT).spd);
    L(`  ${lbl.padEnd(34)} ${cels.join(' ')}   ${ciclos[0]}t / ${ciclos[1]}t`);
  }
  L();
  L('  (a dupla de arma média é a ÚNICA regra com calibragem diferente por sistema: mesma');
  L('   Velocidade no normal, ciclo +1 no P/G/R. Ver §15.2.)');
}

// ---- V) a escada de penalidades, Tick a Tick ----------------------------
if (quer('V')) {
  T('V) A escada · quanto de Defesa cada fase custa, Tick a Tick.');
  L('  Preparo −2 · Golpe −4 (o dobro) · Recuperação −2 POR GOLPE DADO. Mais −2 por ataque');
  L('  recebido, que acumula sem teto e só zera quando o ciclo fecha.');
  L();
  const rnd = criarRng(SEMENTE);
  for (const [lbl, arma, spec] of [
    ['um golpe (leve)', 'espada-curta', {}],
    ['um golpe (média)', 'espada-longa', {}],
    ['dupla de leves', 'espada-curta', { dupla: true }],
    ['rajada de 3 (leve)', 'espada-curta', { golpes: 3, rajada: true, extraDaR: false, rExtra: 2 }],
    ['Arte de grau 6', 'arte', {}],
  ]) {
    const D = lutador({ arma, regras: PGR, ...spec }, CAT);
    const A = lutador({ arma: 'adaga', regras: PGR }, CAT);
    D.emAcao = true; D.nUltimo = D.nGolpes;
    D.pend = { offs: D.offs.map((o) => o + 1), alvo: A, atraso: 0, idx: 0 };
    const linha = [];
    for (let t = 1; t <= Math.min(D.spd, 14); t++) {
      D.tickAgora = t;
      D.emGolpe = D.pend ? D.pend.offs.includes(t) : false;
      if (D.pend && t > D.pend.offs[D.pend.offs.length - 1]) D.pend = null;
      D.guard = 0; D.pv = 999;
      const r = atacar(A, D, PGR, rnd, null);
      const fase = D.pend ? (D.emGolpe ? 'G' : 'P') : 'R';
      linha.push(`${fase}${-(22 - 1 - r.defesa)}`);
    }
    L(`  ${lbl.padEnd(20)} ${linha.join(' · ')}`);
  }
  L();
  L('  (Defesa nua 21: A+H 10 ×2 mais Centelha 1. A leitura é a Defesa PERDIDA em cada Tick.)');
}
