// test-seta.mjs — regressão da geometria da seta do tabuleiro.
//
// A seta deixou de ser uma linha com `marker-end` e virou uma FIGURA
// preenchida, porque só assim ela engrossa da base para a ponta e curva sem a
// cabeça sair torta. O que se mede aqui é o desenho: se afunila, se arqueia
// para o lado pedido, se o tracejado vira vários pedaços e se a cabeça termina
// exatamente no alvo.
//
// Empacota com o esbuild pelo mesmo motivo do test-artes-grid: o módulo é TS, e
// depender de como esta versão do Node trata TS é depender do ambiente.
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `seta-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/seta.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node', logLevel: 'error',
});
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };

const A = { x: 0, y: 0 }, B = { x: 200, y: 0 };
/** Os pares de coordenadas, um grupo por subcaminho. */
const pares = (d) => d.split(/\s+/).filter(Boolean).map((sub) =>
  sub.split(/[MLZ,]+/).filter((s) => s !== '').map(Number));
const todos = (d) => pares(d).flat();
const ys = (d) => todos(d).filter((_, i) => i % 2 === 1);
const fechados = (d) => (d.match(/Z/g) || []).length;
/** A altura da figura em volta de um x, que é a espessura da seta ali. */
const espessuraEm = (d, xAlvo) => {
  const v = [];
  for (const sub of pares(d)) {
    for (let i = 0; i < sub.length; i += 2) if (Math.abs(sub[i] - xAlvo) < 5) v.push(sub[i + 1]);
  }
  return v.length > 1 ? Math.max(...v) - Math.min(...v) : 0;
};

// ------------------------------------------------------------- a figura
const reta = M.caminhoSeta(A, B, { arco: 0, tipo: 'continua' });
ok(reta.startsWith('M') && reta.endsWith('Z'), 'a seta sai como figura fechada');
ok(fechados(reta) === 2, `contínua = corpo + cabeça (veio ${fechados(reta)})`);

// ------------------------------------------------------------ o afunilamento
const base = espessuraEm(reta, 3), ponta = espessuraEm(reta, 170);
ok(ponta > base * 2, `a ponta é bem mais grossa que a base (${base.toFixed(1)} → ${ponta.toFixed(1)})`);
// A comparação é no MEIO do corpo e com as duas retas: perto da ponta entra a
// cabeça, que tem geometria própria, e com arco a altura medida num x seria a
// curvatura somada à espessura, e não a espessura.
const grossa = M.caminhoSeta(A, B, { base: 1, ponta: 20, arco: 0 });
ok(espessuraEm(grossa, 100) > espessuraEm(reta, 100) * 1.5,
  `aumentar a ponta engrossa a seta (${espessuraEm(reta, 100).toFixed(1)} → ${espessuraEm(grossa, 100).toFixed(1)})`);

// ------------------------------------------------------------------ o arco
ok(Math.max(...ys(M.caminhoSeta(A, B, { arco: 0 }))) < 12, 'com arco 0 a seta é reta');
ok(Math.max(...ys(M.caminhoSeta(A, B, { arco: 40 }))) > 20, 'com arco 40° ela sai da corda');
ok(Math.min(...ys(M.caminhoSeta(A, B, { arco: -40 }))) < -20, 'o sinal do arco inverte o lado');

// ------------------------------------------------------------- os tracejados
for (const tipo of ['tracejada', 'pontilhada', 'segmentada']) {
  ok(fechados(M.caminhoSeta(A, B, { tipo })) > 3, `${tipo} vira vários pedaços`);
}
ok(fechados(M.caminhoSeta(A, B, { tipo: 'pontilhada' }))
  > fechados(M.caminhoSeta(A, B, { tipo: 'segmentada' })), 'pontilhada é mais picada que segmentada');

// ----------------------------------------------------------------- a cabeça
const fim = pares(M.caminhoSeta(A, B)).at(-1);
ok(Math.abs(fim[2] - B.x) < 0.6 && Math.abs(fim[3] - B.y) < 0.6,
  `a cabeça termina no alvo (veio ${fim[2]},${fim[3]})`);

// ------------------------------------------------------------- os extremos
ok(M.caminhoSeta(A, { x: 0, y: 0 }) === '', 'dois pontos iguais não desenham nada');
ok(!/NaN/.test(M.caminhoSeta(A, B, { ponta: 30, base: 0, arco: 60, tipo: 'pontilhada' })),
  'ponta grossa, base zero e arco no limite não geram NaN');
ok(!/NaN/.test(M.caminhoSeta(A, { x: 1, y: 1 }, { ponta: 26 })), 'seta curtíssima com ponta grossa também não');
ok(M.SETA_PADRAO.ponta > M.SETA_PADRAO.base, 'o padrão já nasce afunilado');

if (falhas.length) {
  console.error(`\n✘ Geometria da seta FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log(`✓ Geometria da seta OK · afunila ${base.toFixed(1)}→${ponta.toFixed(1)}px · `
  + `4 traços · cabeça no alvo`);
