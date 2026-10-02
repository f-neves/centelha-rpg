// TOLERÂNCIA: a tabela de desafio do 4 em diante e o +1/2 por dobra valem até a G73 e a bancada medirem.
// LEVANTA QUANDO: a G73 decidir onde se gasta o topo da tabela, e a B14 medir o desafio das criaturas e o bando com a Regra de Horda.
// test-recompensa.mjs · a conta da bolsa de um trabalho pontual, pela mesma função que a calculadora
// usa (src/lib/recompensa.ts), com os parâmetros de src/data/recompensas.json. Desde o Adendo 5
// (02/10/2026) a recompensa é o preço de UM TRABALHO, e não de cabeças. Desde o item 5 do fechamento
// da economia (02/10/2026) ela vale para qualquer trabalho pontual, como guia para o Mestre:
// Bolsa = Valor por pessoa × Semanas × Tarefa × Risco × Pessoas (padrão 4), com o Valor por dois
// caminhos, o confronto (tabela de desafio, 0 a 9, meio degrau pela média geométrica) e a perícia
// (pela Dificuldade: Dif 5 = 13, 10 = 20, 15 = desafio 0, 20 = 65; acima de 20, desafio =
// (Dif − 19) ÷ 2, para cima; entre degraus, interpolação geométrica); com os dois, vale o maior. Os oito exemplos são os do item 5, com a
// bolsa pela régua (worgs 3.600 e torre 7.300, por decisão do autor). A conta por equivalentes
// (Adendo 2) segue só como ajuda de estimar o desafio de um confronto, sem mexer em pagamento. Desde
// a rodada 118 a Parte por pessoa é a bolsa ÷ quem vai, PARA BAIXO, e a sobra é o que as partes não
// cobrem.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `recompensa-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `export * from './src/lib/recompensa'; export { default as P } from './src/data/recompensas.json';`,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node', loader: { '.json': 'json' }, logLevel: 'error',
});
const R = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let passou = 0; const falhas = [];
const ok = (c, m) => { if (c) { passou++; console.log('  ✓ ' + m); } else { falhas.push(m); console.log('  ✗ ' + m); } };

console.log('\n· a tabela de desafio é a do autor (01/10/2026), de 0 a 9, e o meio degrau é a média geométrica');
const TABELA = [40, 95, 270, 910, 3600, 14500, 57900, 231700, 926800, 3707300];
ok(R.P.desafios.length === TABELA.length && R.P.desafios.every((d, i) => d.desafio === i && d.preco.pc === TABELA[i]),
  `os ${R.P.desafios.length} desafios da tabela = ${TABELA.join(', ')}`);
ok(R.P.meios.length === TABELA.length - 1 && R.P.meios.every((m, i) => m.desafio === i + 0.5 && m.preco.pc === R.arred(Math.sqrt(TABELA[i] * TABELA[i + 1]), R.P.arredondamento)),
  `os ${R.P.meios.length} meios degraus = arred(√(vizinho de baixo × vizinho de cima)): ${R.P.meios.map((m) => m.preco.pc).join(', ')}`);
// TOLERÂNCIA: do desafio 4 em diante a tabela vale até existir onde gastar o topo dela.
// LEVANTA QUANDO: a G73 decidir os preços do sobre-humano, e o autor confirmar ou trocar o topo da tabela.
ok(R.P.provisorio_desde === 4, 'os desafios 0 a 3 deixam de ser provisórios; do 4 em diante seguem provisórios (correção D)');

console.log('\n· a tabela de perícia é a da correção A');
const PERICIA = [[5, 5, null, 13], [10, 10, null, 20], [15, 15, 0, 40], [20, 20, null, 65], [21, 21, 1, 95], [22, 23, 2, 270], [24, 25, 3, 910], [26, 27, 4, 3600], [28, 29, 5, 14500], [30, 31, 6, 57900], [32, 33, 7, 231700], [34, 35, 8, 926800], [36, 37, 9, 3707300]];
ok(R.P.pericia.length === PERICIA.length && PERICIA.every(([de, ate, d, v], i) => { const l = R.P.pericia[i]; return l.dif_de === de && l.dif_ate === ate && l.desafio === d && l.preco.pc === v; }),
  'Dif 5 = 13; 10 = 20; 15 = desafio 0 (40); 20 = 65 (sem desafio, item 5b); 21 = 1 (95); 22-23 = 2; 24-25 = 3; 26-27 = 4; 28-29 = 5; 30-31 = 6; e a fórmula segue até 36-37 = 9');
ok(R.P.pericia.filter((l) => l.dif_de > 20).every((l) => [l.dif_de, l.dif_ate].every((d) => Math.ceil((d - 19) / 2) === l.desafio)),
  'acima de 20, cada faixa é desafio = (Dif − 19) ÷ 2, para cima');
const vp = (d) => R.valorDaPericia(d, R.P);
const geo = (a, b, t) => R.arred(a * (b / a) ** t, R.P.arredondamento);
ok(vp(12).pc === geo(20, 40, 2 / 5) && vp(12).pc === 25 && vp(17).pc === geo(40, 65, 2 / 5) && vp(17).pc === 50 && vp(7).pc === geo(13, 20, 2 / 5) && vp(7).pc === 15 && vp(7).como === 'entre',
  `entre degraus, interpolação geométrica pela régua: Dif 7 = ${vp(7).pc}, Dif 12 = ${vp(12).pc}, Dif 17 = ${vp(17).pc}`);
ok(vp(2).pc === 13 && vp(0).pc === 13 && vp(2).como === 'piso', 'abaixo de Dif 5, paga 13 (o piso)');
ok([[5, 4], [10, 6], [20, 12]].every(([d, s]) => vp(d).pc === R.arred(({ 4: 7, 6: 12, 12: 35 })[s] * 1.8, R.P.arredondamento)) && vp(20).desafio === null,
  'Dif 5, 10 e 20 = arred(Livre de Braçal 7, Oficial 12, Mestre 35 × 1,8) = 13, 20, 65; Dif 20 sem desafio (item 5b)');
ok(vp(23).pc === 270 && vp(37).pc === 3707300 && (() => { try { vp(38); return false; } catch { return true; } })(), 'Dif 23 = 270 (faixa 22-23); 37 = desafio 9; 38 recusa, sem extrapolar');

console.log('\n· os oito exemplos do item 5 (a bolsa pela régua)');
const base = { semanas: 1, viagemDias: 0, risco: 'normal', tom: 'padrao', outro: 1, grupo: 4 };
const conta = (e) => R.calcularRecompensa({ ...base, ...e }, R.P);
const EXEMPLOS = [
  ['seguir em segredo quem não quer ser achado e descobrir onde mora', { dificuldade: 15, trabalho: 'investigar', tarefa: 'fato', pessoas: 1 }, 40, 40],
  ['seguir um espião treinado, com prova', { dificuldade: 20, semanas: 2, trabalho: 'investigar', tarefa: 'prova', pessoas: 1 }, 195, 200],
  ['roubar de um nobre sem que note', { dificuldade: 20, trabalho: 'roubar', tarefa: 'sem-notar', risco: 'alto', pessoas: 2 }, 390, 390],
  ['entregar uma carta que ninguém pode saber que existe', { dificuldade: 15, semanas: 2, trabalho: 'entregar', tarefa: 'prazo-sigilo', pessoas: 1 }, 120, 120],
  ['recuperar uma criança levada por goblins', { desafio: 1, trabalho: 'recuperar', tarefa: 'trazer-de-volta', pessoas: 4 }, 380, 380],
  ['escoltar um mercador por estrada com bandidos', { desafio: 1, semanas: 2, trabalho: 'escoltar', tarefa: 'levar', pessoas: 4 }, 760, 760],
  ['proteger a aldeia de uma matilha de worgs', { desafio: 3, trabalho: 'proteger', tarefa: 'conhecida', pessoas: 4 }, 3640, 3600],
  ['invadir a torre de um mago', { dificuldade: 25, trabalho: 'invadir', tarefa: 'entrar-sair', risco: 'muito-alto', pessoas: 4 }, 7280, 7300],
];
for (const [nome, e, exata, bolsa] of EXEMPLOS) {
  const r = conta(e);
  ok(Math.abs(r.exata - exata) < 1e-9 && r.bolsa === bolsa, `${nome}: ${r.valor} × ${r.semanas} × ${r.tarefa.mult} × ${r.risco.mult} × ${r.pessoas} = ${r.exata} (${exata}), bolsa ${r.bolsa} (${bolsa})`);
}

console.log('\n· com os dois caminhos, vale o maior');
const ambos = conta({ desafio: 1, dificuldade: 25, trabalho: 'invadir', tarefa: 'entrar-sair' });
ok(ambos.caminho === 'pericia' && ambos.valor === 910 && ambos.valorConfronto === 95, `desafio 1 (95) com Dif 25 (910): vale ${ambos.valor}, pela ${ambos.caminho}`);
const ambos2 = conta({ desafio: 3, dificuldade: 15, trabalho: 'proteger', tarefa: 'conhecida' });
ok(ambos2.caminho === 'confronto' && ambos2.valor === 910, `desafio 3 (910) com Dif 15 (40): vale ${ambos2.valor}, pelo ${ambos2.caminho}`);
ok((() => { try { conta({ trabalho: 'cacar', tarefa: 'matar' }); return false; } catch { return true; } })(), 'sem desafio e sem Dificuldade: erro');

console.log('\n· Pessoas é o que o contrato paga; quem vai só divide');
const p4 = conta({ desafio: 3, trabalho: 'cacar', tarefa: 'matar' });
ok(p4.pessoas === 4 && p4.bolsa === 3600, `Pessoas no padrão: ${p4.pessoas}, bolsa ${p4.bolsa}`);
const vaoSeis = conta({ desafio: 3, trabalho: 'cacar', tarefa: 'matar', grupo: 6 });
ok(vaoSeis.bolsa === p4.bolsa && vaoSeis.porPessoa === 600 && vaoSeis.sobra === 0, `o grupo vai com 6: a mesma bolsa ${vaoSeis.bolsa}, ${vaoSeis.porPessoa} para cada`);

console.log('\n· a Tarefa por tipo de trabalho (item 4)');
const T = Object.fromEntries(R.P.trabalhos.map((t) => [t.id, t.tarefas.map((x) => x.mult)]));
ok(JSON.stringify(T) === JSON.stringify({ cacar: [0.75, 1, 1, 1.5, 2], escoltar: [1, 1.5], proteger: [1, 1.5], invadir: [1, 1.5], roubar: [1, 2], investigar: [1, 1.5], entregar: [1, 1.5], recuperar: [1] }),
  'Caçar 0,75/1/1/1,5/2 · Escoltar, Proteger, Invadir, Investigar e Entregar 1/1,5 · Roubar 1/2 · Recuperar 1');

console.log('\n· o desafio do trabalho aceita inteiro ou meio degrau, de 0 a 9');
const des = (d) => conta({ desafio: d, trabalho: 'cacar', tarefa: 'matar' });
ok(des(3.5).valor === 1800 && des(0).valor === 40 && des(9).valor === 3707300 && des(8.5).valor === 1853600, '3,5 = 1800; 0 = 40; 9 = 3.707.300; 8,5 = 1.853.600');
const recusa = (d) => { try { des(d); return false; } catch { return true; } };
ok(recusa(10) && recusa(9.5) && recusa(-1) && recusa(3.3) && recusa(NaN), 'recusa 10, 9,5 (meio degrau sem vizinho), −1, 3,3 e vazio, sem extrapolar');
// TOLERÂNCIA: do desafio 4 em diante a tabela vale até existir onde gastar o topo dela.
// LEVANTA QUANDO: a G73 decidir os preços do sobre-humano, e o autor confirmar ou trocar o topo da tabela.
ok(!des(3).provisorio && des(4).provisorio && conta({ dificuldade: 26, trabalho: 'invadir', tarefa: 'entrar-sair' }).provisorio,
  'o desafio 3 não é provisório; o 4 é, e a Dif 26 (desafio 4) também');

console.log('\n· a ajuda de estimar o desafio de um confronto (vale até a bancada; não mexe em pagamento)');
const est = (cr) => R.desafioDoEncontro(cr, R.P);
ok(est([{ desafio: 0, quantidade: 1 }]).desafio === 0 && est([{ desafio: 0, quantidade: 4 }]).desafio === 1,
  '1 criatura de desafio 0: 0; 4 de desafio 0 (a matilha de worgs, pela estimativa): 1, contra o 3 medido');
ok(est([{ desafio: 0, quantidade: 100 }]).desafio === 3 && est([{ desafio: 0, quantidade: 130 }]).desafio === 3.5,
  '100 de desafio 0: 3 (Magnitude 6); 130: 3,5 (Magnitude 7)');
const ch = est([{ desafio: 3, quantidade: 1 }, { desafio: 0, quantidade: 4 }]);
ok(ch.equivalentes === 1.0625 && ch.desafio === 3, `chefe 3 + 4 de desafio 0: ${ch.equivalentes} equivalentes, desafio ${ch.desafio}`);
ok(Math.abs(est([{ desafio: 0, quantidade: 100 }]).exato - Math.log(100) / Math.log(4)) < 1e-12, 'o exato é D + log4(equivalentes)');

console.log('\n· a Parte por pessoa arredonda para baixo, e a sobra fecha a bolsa (rodada 118)');
const tres = des(4); const tresR = conta({ desafio: 4, trabalho: 'cacar', tarefa: 'matar', grupo: 3 });
ok(tres.bolsa === 14400 && tresR.porPessoa === 4800 && tresR.sobra === 0, `14400 ÷ 3: parte ${tresR.porPessoa} (4800), sobra ${tresR.sobra}`);
const g7 = conta({ desafio: 0, trabalho: 'cacar', tarefa: 'matar', grupo: 7 });
ok(g7.porPessoa === 22 && g7.sobra === 6 && g7.porPessoa * 7 + g7.sobra === g7.bolsa, `160 ÷ 7: parte ${g7.porPessoa} (22), sobra ${g7.sobra} (6)`);

console.log('\n· Semanas e a viagem seguem como estavam');
const longa = conta({ desafio: 2, semanas: 2, viagemDias: 8, trabalho: 'cacar', tarefa: 'capturar-intacto', risco: 'alto' });
ok(longa.semanas === 2.5 && longa.exata === 270 * 2.5 * 2 * 1.5 * 4 && longa.bolsa === 8100, `desafio 2, 2 semanas + 8 dias, intacto, alto: semanas ${longa.semanas}, bolsa ${longa.bolsa} (8100)`);

console.log(falhas.length ? `\n✘ recompensa: ${falhas.length} falha(s)` : `\n✓ recompensa de trabalho OK · ${passou} asserções`);
process.exit(falhas.length ? 1 : 0);
