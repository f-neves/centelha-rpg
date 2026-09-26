// test-recompensa.mjs · a conta da recompensa de caça (rodada 115), pela mesma função que a
// calculadora usa (src/lib/recompensa.ts), com os parâmetros de src/data/recompensas.json.
// Os cinco casos são os do despacho da rodada 115 (tom padrão, outro ×1, grupo real de 3 caçadores),
// com o degrau, as semanas e a bolsa de cada um. Desde o B14 fase 2 (item D.14, 26/09/2026) o grupo
// de REFERÊNCIA da fórmula (P.grupo, em recompensas.json) é 4, não 3: a bolsa de cada caso subiu na
// mesma proporção (×4/3), pela régua do arred. O grupo real que recebe a bolsa (o `grupo` de cada
// caso, usado só em porCacador/sobra) não mudou. Desde a rodada 118 a Parte por caçador é a bolsa ÷
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

console.log('\n· os cinco casos do despacho da rodada 115');
const base = { fracas: 0, tom: 'padrao', outro: 1, grupo: 3 };
const CASOS = [
  [{ desafio: 5, centelha: 5, fortes: 1, cacadaSemanas: 1, viagemDias: 16, tarefa: 'matar', risco: 'normal' }, 6, 2, 2000, 666, 2],
  [{ desafio: 5, centelha: 5, fortes: 1, cacadaSemanas: 1, viagemDias: 16, tarefa: 'capturar-vivo', risco: 'normal' }, 6, 2, 3000, 1000, 0],
  [{ desafio: 2, centelha: 0, fortes: 8, cacadaSemanas: 1, viagemDias: 0, tarefa: 'matar', risco: 'alto' }, 5, 1, 840, 280, 0],
  [{ desafio: 3, centelha: 0, fortes: 1, cacadaSemanas: 2, viagemDias: 8, tarefa: 'capturar-intacto', risco: 'normal' }, 3, 2.5, 900, 300, 0],
  [{ desafio: 2, centelha: 0, fortes: 1, cacadaSemanas: 1, viagemDias: 0, tarefa: 'trazer-parte', risco: 'normal' }, 2, 1, 100, 33, 1],
];
CASOS.forEach(([e, degrau, semanas, bolsa, parte, sobra], i) => {
  const r = R.calcularRecompensa({ ...base, ...e }, R.P);
  ok(r.degrau === degrau && r.semanas === semanas && r.bolsa === bolsa,
    `caso ${i + 1}: degrau ${r.degrau} (esperado ${degrau}), semanas ${r.semanas} (${semanas}), bolsa ${r.bolsa} pc (${bolsa}), exata ${r.exata}`);
  ok(r.porCacador === parte && r.sobra === sobra,
    `caso ${i + 1}: parte por caçador ${r.porCacador} pc (esperado ${parte}), sobra ${r.sobra} (${sobra})`);
});

console.log('\n· a Parte por caçador arredonda para baixo, e a sobra fecha a bolsa (rodada 118)');
const caso5 = CASOS[4][0];
[[CASOS[1][0], 3, 3000, 1000, 0], [caso5, 4, 100, 25, 0], [CASOS[0][0], 3, 2000, 666, 2]].forEach(([e, grupo, bolsa, parte, sobra]) => {
  const r = R.calcularRecompensa({ ...base, ...e, grupo }, R.P);
  ok(r.bolsa === bolsa && r.porCacador === parte && r.sobra === sobra && r.porCacador * grupo + r.sobra === r.bolsa,
    `${bolsa} ÷ ${grupo}: parte ${r.porCacador} pc (esperado ${parte}), sobra ${r.sobra} (${sobra}), bolsa ${r.bolsa}`);
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
