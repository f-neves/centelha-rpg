// TOLERÂNCIA: a tabela de desafio do autor, o +1/2 por dobra e o desafio digitado valem até a bancada medir.
// LEVANTA QUANDO: a B14 medir o desafio das criaturas, gravá-lo nas fichas e confirmar ou trocar a tabela.
// test-recompensa.mjs · a conta da recompensa de caça, pela mesma função que a calculadora usa
// (src/lib/recompensa.ts), com os parâmetros de src/data/recompensas.json. Desde o fechamento da
// economia (Adendo 5, 02/10/2026) a recompensa é o preço de UM TRABALHO: Bolsa = Valor(desafio do
// trabalho) × Semanas × Tarefa × Risco × 4, com o Valor da tabela do autor (0 a 9, meio degrau pela
// média geométrica dos vizinhos). Saíram a divisão por criatura, a parte fixada, o parcial por
// partes e o empate. A conta por equivalentes (Adendo 2) ficou só como ajuda de estimar o desafio de
// um confronto, sem mexer em pagamento. Os exemplos são trabalhos: a matilha de 4 worgs (desafio 3,
// medido na Fase 5b), a infestação de ratazanas (o Mestre fixa desafio e Semanas) e o chefe de
// desafio 3. Desde a rodada 118 a Parte por caçador é a bolsa ÷ o grupo PARA BAIXO, e a sobra é o
// que as partes não cobrem.
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

console.log('\n· os exemplos de trabalho (Adendo 5 e Complemento)');
const base = { cacadaSemanas: 1, viagemDias: 0, tarefa: 'matar', risco: 'normal', tom: 'padrao', outro: 1, grupo: 4 };
const conta = (desafio, extra = {}) => R.calcularRecompensa({ ...base, ...extra, desafio }, R.P);
const worgs = conta(3);
ok(worgs.valor === 910 && worgs.exata === 3640 && worgs.bolsa === 3600 && worgs.porCacador === 900,
  `livrar a estrada da matilha de 4 worgs, desafio 3 (medido na Fase 5b, ainda sem Horda): valor ${worgs.valor} (910), bolsa ${worgs.bolsa} (3600), ${worgs.porCacador} por caçador`);
const chefe = conta(3);
ok(chefe.bolsa === worgs.bolsa, `matar o chefe de desafio 3 com o bando dele: o mesmo desafio 3, bolsa ${chefe.bolsa}`);
const ratos = conta(1, { cacadaSemanas: 3 });
ok(ratos.valor === 95 && ratos.semanas === 3 && ratos.exata === 1140 && ratos.bolsa === 1100,
  `infestação de ratazanas, o Mestre fixa desafio 1 e 3 semanas (números de ilustração): ${ratos.valor} × ${ratos.semanas} × 4 = ${ratos.exata}, arred ${ratos.bolsa}`);
ok(Object.keys(worgs).every((k) => !/parte|equival|solit|empate/i.test(k) || k === 'porCacador'),
  'o resultado não traz divisão por criatura, parte fixada nem empate (saíram no Adendo 5)');

console.log('\n· o desafio do trabalho aceita inteiro ou meio degrau, de 0 a 9');
ok(conta(3.5).valor === 1800 && conta(0).valor === 40 && conta(9).valor === 3707300 && conta(8.5).valor === 1853600, '3,5 = 1800; 0 = 40; 9 = 3.707.300; 8,5 = 1.853.600');
const recusa = (d) => { try { conta(d); return false; } catch { return true; } };
ok(recusa(10) && recusa(9.5) && recusa(-1) && recusa(3.3) && recusa(NaN), 'recusa 10, 9,5 (meio degrau sem vizinho), −1, 3,3 e vazio, sem extrapolar');

console.log('\n· a ajuda de estimar o desafio de um confronto (vale até a bancada; não mexe em pagamento)');
const est = (cr) => R.desafioDoEncontro(cr, R.P);
ok(est([{ desafio: 0, quantidade: 1 }]).desafio === 0 && est([{ desafio: 0, quantidade: 4 }]).desafio === 1,
  '1 criatura de desafio 0: 0; 4 de desafio 0 (a matilha de worgs, pela estimativa): 1, contra o 3 medido');
ok(est([{ desafio: 0, quantidade: 100 }]).desafio === 3 && est([{ desafio: 0, quantidade: 130 }]).desafio === 3.5,
  '100 de desafio 0: 3 (Magnitude 6); 130: 3,5 (Magnitude 7)');
const ch = est([{ desafio: 3, quantidade: 1 }, { desafio: 0, quantidade: 4 }]);
ok(ch.equivalentes === 1.0625 && ch.desafio === 3, `chefe 3 + 4 de desafio 0: ${ch.equivalentes} equivalentes, desafio ${ch.desafio}`);
ok(est([{ desafio: 2, quantidade: 8 }]).desafio === 3.5 && est([{ desafio: 2, quantidade: 15 }]).desafio === 3.5 && est([{ desafio: 2, quantidade: 16 }]).desafio === 4,
  '8 e 15 de desafio 2: 3,5; 16: 4 (para baixo, nos degraus da Magnitude)');
ok(Math.abs(est([{ desafio: 0, quantidade: 100 }]).exato - Math.log(100) / Math.log(4)) < 1e-12, 'o exato é D + log4(equivalentes)');

console.log('\n· a Parte por caçador arredonda para baixo, e a sobra fecha a bolsa (rodada 118)');
const tres = conta(4, { grupo: 3 });
ok(tres.bolsa === 14400 && tres.porCacador === 4800 && tres.sobra === 0, `14400 ÷ 3: parte ${tres.porCacador} (4800), sobra ${tres.sobra}`);
const g7 = conta(0, { grupo: 7 });
ok(g7.porCacador === 22 && g7.sobra === 6 && g7.porCacador * 7 + g7.sobra === g7.bolsa, `160 ÷ 7: parte ${g7.porCacador} (22), sobra ${g7.sobra} (6)`);

console.log('\n· Semanas, Tarefa e Risco seguem como estavam');
const longa = conta(2, { cacadaSemanas: 2, viagemDias: 8, tarefa: 'capturar-intacto', risco: 'alto' });
ok(longa.semanas === 2.5 && longa.exata === 270 * 2.5 * 2 * 1.5 * 4 && longa.bolsa === 8100, `desafio 2, 2 semanas + 8 dias, intacto, alto: semanas ${longa.semanas}, bolsa ${longa.bolsa} (8100)`);

console.log(falhas.length ? `\n✘ recompensa: ${falhas.length} falha(s)` : `\n✓ recompensa de caça OK · ${passou} asserções`);
process.exit(falhas.length ? 1 : 0);
