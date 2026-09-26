// test-recompensa.mjs · a conta da recompensa de caça (rodada 115), pela mesma função que a
// calculadora usa (src/lib/recompensa.ts), com os parâmetros de src/data/recompensas.json.
// Os cinco casos são os do despacho da rodada 115 (tom padrão, outro ×1, grupo de 3), com o degrau,
// as semanas e a bolsa de cada um. O caso 2 espera 2.300 (2.250 exato, pelo arred), como o autor
// decidiu depois do despacho: a bolsa segue sempre a régua do arred.
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

console.log('\n· os cinco casos do despacho da rodada 115');
const base = { fracas: 0, tom: 'padrao', outro: 1, grupo: 3 };
const CASOS = [
  [{ desafio: 5, centelha: 5, fortes: 1, cacadaSemanas: 1, viagemDias: 16, tarefa: 'matar', risco: 'normal' }, 6, 2, 1500],
  [{ desafio: 5, centelha: 5, fortes: 1, cacadaSemanas: 1, viagemDias: 16, tarefa: 'capturar-vivo', risco: 'normal' }, 6, 2, 2300],
  [{ desafio: 2, centelha: 0, fortes: 8, cacadaSemanas: 1, viagemDias: 0, tarefa: 'matar', risco: 'alto' }, 5, 1, 630],
  [{ desafio: 3, centelha: 0, fortes: 1, cacadaSemanas: 2, viagemDias: 8, tarefa: 'capturar-intacto', risco: 'normal' }, 3, 2.5, 680],
  [{ desafio: 2, centelha: 0, fortes: 1, cacadaSemanas: 1, viagemDias: 0, tarefa: 'trazer-parte', risco: 'normal' }, 2, 1, 75],
];
CASOS.forEach(([e, degrau, semanas, bolsa], i) => {
  const r = R.calcularRecompensa({ ...base, ...e }, R.P);
  ok(r.degrau === degrau && r.semanas === semanas && r.bolsa === bolsa,
    `caso ${i + 1}: degrau ${r.degrau} (esperado ${degrau}), semanas ${r.semanas} (${semanas}), bolsa ${r.bolsa} pc (${bolsa}), exata ${r.exata}`);
});

console.log('\n· a tabela de degraus é a fórmula arredondada, e acima dela a fórmula continua');
ok(R.P.degraus.every((d) => d.preco.pc === R.arred(R.P.base * R.P.fator ** (d.degrau - 1), R.P.arredondamento)),
  `os ${R.P.degraus.length} degraus da tabela = arred(base × fator^(degrau − 1))`);
ok(R.valorDoDegrau(13, R.P) === R.arred(15 * 1.75 ** 12, R.P.arredondamento), `degrau 13 = ${R.valorDoDegrau(13, R.P)} pc, pela fórmula`);

console.log('\n· a quantidade: dobra = +1, e as fracas contam metade');
const q = (fortes, fracas) => R.calcularRecompensa({ ...base, desafio: 1, centelha: 0, fortes, fracas, cacadaSemanas: 1, viagemDias: 0, tarefa: 'matar', risco: 'normal' }, R.P).passoQuantidade;
ok(q(1, 0) === 0 && q(2, 0) === 1 && q(3, 0) === 1 && q(4, 0) === 2 && q(16, 0) === 4, '1 → +0, 2 e 3 → +1, 4 → +2, 16 → +4');
ok(q(1, 2) === 1 && q(2, 4) === 2, '1 forte e 2 fracas contam 2 (+1); 2 fortes e 4 fracas contam 4 (+2)');

console.log(falhas.length ? `\n✘ recompensa: ${falhas.length} falha(s)` : `\n✓ recompensa de caça OK · ${passou} asserções`);
process.exit(falhas.length ? 1 : 0);
