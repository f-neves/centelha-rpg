// TOLERÂNCIA: a tabela de desafio do autor e o desafio que o Mestre digita valem só até a bancada medir.
// LEVANTA QUANDO: a B14 medir o desafio das criaturas, gravá-lo nas fichas e confirmar ou trocar a tabela.
// test-recompensa.mjs · a conta da recompensa de caça, pela mesma função que a calculadora usa
// (src/lib/recompensa.ts), com os parâmetros de src/data/recompensas.json. Desde o fechamento da
// economia (01/10/2026, Adendo 2) o encontro vale por EQUIVALENTES: a criatura no desafio da mais
// forte conta 1, cada desafio abaixo divide por 4; o desafio do encontro é o da mais forte + 1/2 a
// cada dobra dos equivalentes, para baixo (os degraus da Magnitude); o Valor do encontro é o da
// tabela do autor nesse desafio (0 a 9, meio degrau pela média geométrica dos vizinhos); e Bolsa =
// Valor do encontro × Semanas × Tarefa × Risco × 4. Os seis exemplos são os do Adendo 2 (lobo = 0;
// worg = 1 PROVISÓRIO, que contradiz a bancada). Desde a rodada 118 a Parte por caçador é a bolsa ÷
// o grupo PARA BAIXO, e a sobra é o que as partes não cobrem.
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

console.log('\n· os seis exemplos do Adendo 2 (Valor do encontro, antes do × 4)');
const base = { cacadaSemanas: 1, viagemDias: 0, tarefa: 'matar', risco: 'normal', tom: 'padrao', outro: 1, grupo: 4 };
const conta = (criaturas, extra = {}) => R.calcularRecompensa({ ...base, ...extra, criaturas }, R.P);
const EXEMPLOS = [
  ['1 lobo', [{ desafio: 0, quantidade: 1 }], 1, 0, 40],
  ['4 lobos', [{ desafio: 0, quantidade: 4 }], 4, 1, 95],
  ['4 worgs (worg = 1, contra a bancada)', [{ desafio: 1, quantidade: 4 }], 4, 2, 270],
  ['100 ratazanas de desafio 0', [{ desafio: 0, quantidade: 100 }], 100, 3, 910],
  ['chefe 3 + 4 de desafio 0', [{ desafio: 3, quantidade: 1 }, { desafio: 0, quantidade: 4 }], 1.0625, 3, 910],
  ['4 de desafio 3', [{ desafio: 3, quantidade: 4 }], 4, 4, 3600],
];
for (const [nome, cr, eq, des, valor] of EXEMPLOS) {
  const r = conta(cr);
  ok(r.encontro.equivalentes === eq && r.encontro.desafio === des && r.valorEncontro === valor && r.bolsa === R.arred(valor * 4, R.P.arredondamento),
    `${nome}: equivalentes ${r.encontro.equivalentes} (${eq}), desafio ${r.encontro.desafio} (${des}), valor ${r.valorEncontro} (${valor}), bolsa ${r.bolsa}`);
}
const chefe = conta(EXEMPLOS[4][1]);
ok(Math.abs(chefe.partes[0].fracao - 1 / 1.0625) < 1e-12 && Math.round(100 * chefe.partes[0].fracao) === 94,
  `o chefe responde por ${(100 * chefe.partes[0].fracao).toFixed(2)}% da bolsa (94%)`);
ok(Math.abs(chefe.partes[0].parte + 4 * chefe.partes[1].parte - chefe.bolsa) < 1e-9,
  `as partes por cabeça somam a bolsa: ${chefe.partes[0].parte.toFixed(2)} + 4 × ${chefe.partes[1].parte.toFixed(2)} = ${chefe.bolsa}`);
ok(conta(EXEMPLOS[0][1]).solitaria && !conta(EXEMPLOS[1][1]).solitaria, 'a criatura solitária é tudo ou nada; o bando paga por cabeça');

console.log('\n· o meio degrau: dobrar os equivalentes = +1/2 desafio, para baixo');
const v = (cr) => conta(cr).encontro;
ok(v([{ desafio: 0, quantidade: 2 }]).desafio === 0.5 && v([{ desafio: 0, quantidade: 3 }]).desafio === 0.5 && conta([{ desafio: 0, quantidade: 2 }]).valorEncontro === 60,
  '2 e 3 de desafio 0: desafio 0,5, valor 60 (o meio degrau de baixo)');
ok(v([{ desafio: 2, quantidade: 8 }]).desafio === 3.5 && v([{ desafio: 2, quantidade: 15 }]).desafio === 3.5 && v([{ desafio: 2, quantidade: 16 }]).desafio === 4,
  '8 e 15 de desafio 2: desafio 3,5; 16: desafio 4');
ok(Math.abs(v([{ desafio: 0, quantidade: 100 }]).exato - Math.log(100) / Math.log(4)) < 1e-12, `o desafio exato é D + log4(equivalentes): 100 ratazanas = ${v([{ desafio: 0, quantidade: 100 }]).exato.toFixed(2)}`);

console.log('\n· a Parte por caçador arredonda para baixo, e a sobra fecha a bolsa (rodada 118)');
const tres = conta([{ desafio: 3, quantidade: 4 }], { grupo: 3 });
ok(tres.bolsa === 14400 && tres.porCacador === 4800 && tres.sobra === 0, `14400 ÷ 3: parte ${tres.porCacador} (4800), sobra ${tres.sobra}`);
const sete = conta([{ desafio: 0, quantidade: 1 }], { grupo: 7 });
ok(sete.porCacador === 22 && sete.sobra === 6 && sete.porCacador * 7 + sete.sobra === sete.bolsa, `160 ÷ 7: parte ${sete.porCacador} (22), sobra ${sete.sobra} (6)`);

console.log('\n· Semanas, Tarefa e Risco seguem como estavam');
const longa = conta([{ desafio: 2, quantidade: 1 }], { cacadaSemanas: 2, viagemDias: 8, tarefa: 'capturar-intacto', risco: 'alto' });
ok(longa.semanas === 2.5 && longa.exata === 270 * 2.5 * 2 * 1.5 * 4 && longa.bolsa === 8100, `desafio 2, 2 semanas + 8 dias, intacto, alto: semanas ${longa.semanas}, bolsa ${longa.bolsa} (8100)`);

console.log('\n· acima do desafio 9 a conta recusa, sem extrapolar');
const recusa = (cr) => { try { conta(cr); return false; } catch { return true; } };
ok(recusa([{ desafio: 10, quantidade: 1 }]), 'uma criatura de desafio 10: erro, e não um valor inventado');
ok(recusa([{ desafio: 9, quantidade: 2 }]) && recusa([{ desafio: 8, quantidade: 16 }]) && !recusa([{ desafio: 8, quantidade: 4 }]),
  'encontro acima de 9 recusa (2 de desafio 9 = 9,5; 16 de desafio 8 = 10); 4 de desafio 8 = 9 passa');

console.log(falhas.length ? `\n✘ recompensa: ${falhas.length} falha(s)` : `\n✓ recompensa de caça OK · ${passou} asserções`);
process.exit(falhas.length ? 1 : 0);
