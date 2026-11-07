// test-regeneracao.mjs · a Regeneração N no motor de criaturas (D-362, B2 do autor, 07/11/2026).
//
// O livro (Os Poderes das Criaturas, Regeneração): "A criatura recupera N PV por minuto, até o PV máximo, sempre
// ativa: na luta, isso vale N/10 PV a cada 6 Ticks, contados a partir do Tick em que ela sofreu o primeiro dano."
// Aqui se prova, em `regeneracaoInicial`, `danoNaRegeneracao` e `regenerarAte` (src/lib/motor.ts):
//   - N 5 em 6, 12 e 60 Ticks depois do primeiro dano, com a fração guardada (0,5 por pulso);
//   - nada antes do primeiro dano, e a contagem começa no Tick dele (X + 6, X + 12, ...);
//   - o teto do PV máximo (N 40 não passa do máximo, e a fração some quando enche);
//   - N 9: dez pulsos dão 9 PV exatos (a fração em décimos não acumula erro);
//   - a fraqueza (R47) nas duas formas, que quem chama informa: 'naoRegenera' (o dano da fraqueza fica fora) e
//     'interrompe' (nenhum pulso durante a parada; depois tudo volta a fechar).
//   node scripts/test-regeneracao.mjs
import { carregarTS } from './lib-ts.mjs';
const M = await carregarTS('src/lib/motor.ts');

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const pv = (e) => `${e.pv} PV e ${e.decimos} décimo(s)`;

for (const k of ['regeneracaoInicial', 'danoNaRegeneracao', 'regenerarAte']) ok(typeof M[k] === 'function', `motor.ts exporta ${k}`);
if (falhas.length) { console.error(`✘ test-regeneracao: ${falhas.length} falha(s)`); process.exit(1); }

// N 5, PV máximo 50; o primeiro dano (30) no Tick 10
const X = 10;
let e = M.regeneracaoInicial(5, 50);
ok(M.regenerarAte(e, 100).pv === 50 && M.regenerarAte(e, 100).proximoPulso === null, 'sem dano, nada pulsa (a contagem não começou)');
e = M.danoNaRegeneracao(e, X, 30);
ok(e.pv === 20 && e.proximoPulso === X + 6, `primeiro dano no Tick ${X}: 20 PV, primeiro pulso no Tick ${X + 6}`);
ok(M.regenerarAte(e, X + 5).pv === 20 && M.regenerarAte(e, X + 5).decimos === 0, `no Tick ${X + 5}, ainda nada: ${pv(M.regenerarAte(e, X + 5))}`);
const a6 = M.regenerarAte(e, X + 6), a12 = M.regenerarAte(e, X + 12), a60 = M.regenerarAte(e, X + 60);
ok(a6.pv === 20 && a6.decimos === 5, `6 Ticks depois: 0,5 guardado, ${pv(a6)}`);
ok(a12.pv === 21 && a12.decimos === 0, `12 Ticks depois: 1 PV, ${pv(a12)}`);
ok(a60.pv === 25 && a60.decimos === 0, `60 Ticks depois (um minuto): N = 5 PV, ${pv(a60)}`);
ok(M.regenerarAte(a6, X + 12).pv === a12.pv && M.regenerarAte(a6, X + 12).decimos === a12.decimos, 'avançar em dois passos dá o mesmo que em um (a fração fica guardada no estado)');

// o segundo dano não reabre a contagem
const d2 = M.danoNaRegeneracao(a6, X + 9, 4);
ok(d2.proximoPulso === X + 12 && d2.decimos === 5, 'um segundo dano no meio não muda o relógio nem a fração');

// N 9: dez pulsos, 9 PV exatos
let n9 = M.danoNaRegeneracao(M.regeneracaoInicial(9, 100), 0, 50);
n9 = M.regenerarAte(n9, 60);
ok(n9.pv === 59 && n9.decimos === 0, `N 9 em 60 Ticks: +9 exatos, ${pv(n9)}`);

// o teto: N 40, PV máximo 50, dano 1
let t = M.regenerarAte(M.danoNaRegeneracao(M.regeneracaoInicial(40, 50), 0, 1), 6);
ok(t.pv === 50 && t.decimos === 0, `N 40 com 1 de dano: volta a 50, e não a 53 (${pv(t)})`);
t = M.regenerarAte(t, 600);
ok(t.pv === 50, 'cheio, fica cheio');

// fraqueza 'naoRegenera': 10 de dano comum e 10 da fraqueza, PV máximo 50
let f = M.regeneracaoInicial(5, 50, { forma: 'naoRegenera' });
f = M.danoNaRegeneracao(f, 0, 10);
f = M.danoNaRegeneracao(f, 1, 10, true);
f = M.regenerarAte(f, 600);
ok(f.pv === 40 && f.travado === 10, `naoRegenera: o dano comum fecha e o da fraqueza não (${f.pv} de 50)`);

// fraqueza 'interrompe': a parada de 60 Ticks começa no dano da fraqueza (Tick 10)
let g = M.regeneracaoInicial(5, 50, { forma: 'interrompe', duracaoTicks: 60 });
g = M.danoNaRegeneracao(g, 0, 20);
g = M.danoNaRegeneracao(g, 10, 10, true);
const g69 = M.regenerarAte(g, 69), g72 = M.regenerarAte(g, 72);
ok(g69.pv === 20 && g69.decimos === 5, `interrompe: até o Tick 69 só conta o pulso do Tick 6, de antes da fraqueza; os dos Ticks 12 a 66 não (${pv(g69)})`);
ok(g72.pv === 21 && g72.decimos === 0, `interrompe: no Tick 72 volta a pulsar, com a fração guardada de antes (${pv(g72)})`);
ok(M.regenerarAte(g, 2000).pv === 50, 'interrompe: depois da parada, tudo volta a fechar, até o máximo');

if (falhas.length) { console.error(`✘ test-regeneracao: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-regeneracao · N/10 PV a cada 6 Ticks desde o primeiro dano, com a fração, o teto e as duas formas da fraqueza (D-362)');
