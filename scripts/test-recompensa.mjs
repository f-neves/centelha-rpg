// TOLERÂNCIA: a tabela de desafio do autor e o desafio que o Mestre digita valem só até a bancada medir.
// LEVANTA QUANDO: a B14 medir o desafio das criaturas, gravá-lo nas fichas e confirmar ou trocar a tabela.
// test-recompensa.mjs · a conta da recompensa de caça, pela mesma função que a calculadora usa
// (src/lib/recompensa.ts), com os parâmetros de src/data/recompensas.json. Desde o fechamento da
// economia (01/10/2026) a regra é a da SOMA: Valor do encontro = a soma dos valores de todas as
// criaturas, pela tabela de desafio do autor (0 a 9, provisória até a bancada), e Bolsa = Valor do
// encontro × Semanas × Tarefa × Risco × 4. Saíram o Degrau, o termo de Centelha e a regra de
// quantidade. Os três exemplos são os do despacho (lobo = 0, worg = 1 PROVISÓRIO, que contradiz a
// bancada; Semanas 1, matar, risco normal, tom padrão). Desde a rodada 118 a Parte por caçador é a
// bolsa ÷ o grupo PARA BAIXO, e a sobra é o que as partes não cobrem.
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

console.log('\n· a tabela de desafio é a do autor (01/10/2026), de 0 a 9');
const TABELA = [40, 95, 270, 910, 3600, 14500, 57900, 231700, 926800, 3707300];
ok(R.P.desafios.length === TABELA.length && R.P.desafios.every((d, i) => d.desafio === i && d.preco.pc === TABELA[i]),
  `os ${R.P.desafios.length} desafios da tabela = ${TABELA.join(', ')}`);

console.log('\n· os três exemplos do despacho');
const base = { cacadaSemanas: 1, viagemDias: 0, tarefa: 'matar', risco: 'normal', tom: 'padrao', outro: 1, grupo: 4 };
const conta = (criaturas, extra = {}) => R.calcularRecompensa({ ...base, ...extra, criaturas }, R.P);
const lobo = conta([{ desafio: 0, quantidade: 1 }]);
ok(lobo.valorEncontro === 40 && lobo.bolsa === 160 && lobo.solitaria && lobo.porCacador === 40,
  `1 lobo (desafio 0): encontro ${lobo.valorEncontro}, bolsa ${lobo.bolsa} pc (160), solitária, parte por caçador ${lobo.porCacador} (40)`);
const worgs = conta([{ desafio: 1, quantidade: 4 }]);
ok(worgs.valorEncontro === 380 && worgs.exata === 1520 && worgs.bolsa === 1500 && !worgs.solitaria && worgs.partes[0].parte === 375 && worgs.porCacador === 375,
  `4 worgs (desafio 1): encontro ${worgs.valorEncontro} (380), exata ${worgs.exata} (1520), bolsa ${worgs.bolsa} (1500), ${worgs.partes[0].parte} pc por worg (375)`);
const chefe = conta([{ desafio: 3, quantidade: 1 }, { desafio: 0, quantidade: 4 }]);
const [pChefe, pMenor] = chefe.partes;
ok(chefe.valorEncontro === 1070 && chefe.exata === 4280 && chefe.bolsa === 4300 && chefe.porCacador === 1075 && chefe.sobra === 0,
  `chefe 3 + 4 de desafio 0: encontro ${chefe.valorEncontro} (1070), exata ${chefe.exata} (4280), bolsa ${chefe.bolsa} (4300), parte por caçador ${chefe.porCacador} (1075)`);
ok(Math.abs(pChefe.parte + 4 * pMenor.parte - chefe.bolsa) < 1e-9 && Math.abs(pChefe.parte / pMenor.parte - 910 / 40) < 1e-9,
  `partes por criatura somam a bolsa e seguem o valor: chefe ${pChefe.parte.toFixed(2)}, cada menor ${pMenor.parte.toFixed(2)}`);

console.log('\n· a Parte por caçador arredonda para baixo, e a sobra fecha a bolsa (rodada 118)');
const tres = conta([{ desafio: 1, quantidade: 4 }], { grupo: 3 });
ok(tres.porCacador === 500 && tres.sobra === 0, `1500 ÷ 3: parte ${tres.porCacador} (500), sobra ${tres.sobra}`);
const sete = conta([{ desafio: 0, quantidade: 1 }], { grupo: 7 });
ok(sete.porCacador === 22 && sete.sobra === 6 && sete.porCacador * 7 + sete.sobra === sete.bolsa, `160 ÷ 7: parte ${sete.porCacador} (22), sobra ${sete.sobra} (6)`);

console.log('\n· Semanas, Tarefa e Risco seguem como estavam');
const longa = conta([{ desafio: 2, quantidade: 1 }], { cacadaSemanas: 2, viagemDias: 8, tarefa: 'capturar-intacto', risco: 'alto' });
ok(longa.semanas === 2.5 && longa.exata === 270 * 2.5 * 2 * 1.5 * 4 && longa.bolsa === 8100, `desafio 2, 2 semanas + 8 dias, intacto, alto: semanas ${longa.semanas}, bolsa ${longa.bolsa} (8100)`);

console.log('\n· acima do desafio 9 a conta recusa, sem extrapolar');
let recusou = false; try { conta([{ desafio: 10, quantidade: 1 }]); } catch { recusou = true; }
ok(recusou, 'desafio 10: erro, e não um valor inventado');

console.log(falhas.length ? `\n✘ recompensa: ${falhas.length} falha(s)` : `\n✓ recompensa de caça OK · ${passou} asserções`);
process.exit(falhas.length ? 1 : 0);
