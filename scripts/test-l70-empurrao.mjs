// test-l70-empurrao.mjs · o empurrão das Artes grava pela regra de ocupação de verdade.
//
// Pendencias.md L70 (rodada 50, o segundo estrangulamento): `deslocar`
// (`src/lib/artes-grid-mesa.ts`), a Arte que empurra/arrasta/teleporta, escrevia
// posição direto em `arena_tokens`, sem conferir ocupação nenhuma, cliente ou
// servidor. Agora ela chama `ctx.gravarToken` (o mesmo estrangulamento que a
// rodada 49 pôs em `grid.astro`) por `empurrarAteLivre`, que tenta do passo mais
// longe até o mais curto e para na primeira casa livre: a decisão do humano
// para o destino ocupado (`Pendencias.md` L83, `PARA_NA_ULTIMA_CASA_LIVRE`).
//
// Este teste é de Node puro (sem navegador): `empurrarAteLivre` só depende de
// `ctx.gravarToken`, e o resto do módulo (diálogos, DOM) não entra no caminho
// dela. O que se prova aqui é a LÓGICA NOVA; a orquestração ao redor
// (`deslocar` escolhendo o alvo, abrindo a caixa de ajuste) não mudou e já era
// coberta por uso manual, não por este arquivo.
//
//   node scripts/test-l70-empurrao.mjs
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

// O mesmo mínimo de casca de DOM que `test-arte-na-mesa.mjs` usa: o módulo
// importa `ui-dialog.ts`/`mesa-core.ts` no topo, e eles tocam `document` na
// hora de carregar, não só na hora de abrir uma caixa.
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
const elementoFalso = () => ({
  innerHTML: '', hidden: false, style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
  querySelectorAll: () => [], querySelector: () => null, appendChild() {}, append() {}, remove() {},
  setAttribute() {}, getAttribute: () => null, addEventListener() {}, getBoundingClientRect: () => ({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 }),
});
globalThis.document = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: elementoFalso,
  createElementNS: elementoFalso,
  body: elementoFalso(),
  addEventListener() {},
};
globalThis.window = globalThis;

const saida = path.join(os.tmpdir(), `l70-empurrao-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { empurrarAteLivre, PARA_NA_ULTIMA_CASA_LIVRE } from './src/lib/artes-grid-mesa';
    `,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
const { empurrarAteLivre, PARA_NA_ULTIMA_CASA_LIVRE } = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

/** Um `ctx.gravarToken` de mentira: `ocupadas` é o conjunto de "q,r" bloqueados. */
function gravarTokenFalso(ocupadas, { erroGenerico } = {}) {
  const chamadas = [];
  const gravarToken = async (cid, q, r) => {
    chamadas.push({ cid, q, r });
    if (erroGenerico && chamadas.length === erroGenerico.naChamada) {
      return { data: null, error: { message: erroGenerico.message } };
    }
    if (ocupadas.has(`${q},${r}`)) {
      return { data: null, error: { message: `${q},${r} já está ocupada.`, ocupada: true } };
    }
    return { data: { q, r }, error: null };
  };
  return { ctx: { gravarToken }, chamadas };
}

console.log('· empurrarAteLivre: caminho livre, chega ao passo pedido');
{
  const { ctx, chamadas } = gravarTokenFalso(new Set());
  const r = await empurrarAteLivre(ctx, 'alvo', { q: 0, r: 0 }, { q: 5, r: 0 }, 3, 20, 20);
  ok(!r.error, `sem erro (${JSON.stringify(r.error)})`);
  ok(r.passosReais === 3, `passosReais = 3, o pedido inteiro (achou ${r.passosReais})`);
  ok(chamadas.length === 1, `uma chamada só a gravarToken, sem tentativa extra (achou ${chamadas.length})`);
}

console.log('\n· empurrarAteLivre: caminho parcialmente ocupado, para na última casa livre');
{
  // afastar(de={q:0,r:0}, ate={q:5,r:0}, passos, cols, rows) anda na reta de
  // (0,0) para (5,0): a 3 passos cai em q=8 (5 + 1*3), a 2 em q=7, a 1 em q=6.
  const destino3 = { q: 8, r: 0 };
  const { ctx, chamadas } = gravarTokenFalso(new Set([`${destino3.q},${destino3.r}`]));
  const r = await empurrarAteLivre(ctx, 'alvo', { q: 0, r: 0 }, { q: 5, r: 0 }, 3, 20, 20);
  ok(!r.error, `sem erro depois de encurtar (${JSON.stringify(r.error)})`);
  ok(r.passosReais === 2, `passosReais = 2, um a menos que o pedido (achou ${r.passosReais})`);
  ok(chamadas.length === 2, `tentou 3 passos (recusado) e depois 2 (aceito): 2 chamadas (achou ${chamadas.length})`);
}

console.log('\n· empurrarAteLivre: erro de verdade (não ocupação) não tenta encurtar');
{
  const { ctx, chamadas } = gravarTokenFalso(new Set(), { erroGenerico: { naChamada: 1, message: 'falha de rede' } });
  const r = await empurrarAteLivre(ctx, 'alvo', { q: 0, r: 0 }, { q: 5, r: 0 }, 3, 20, 20);
  ok(!!r.error, 'devolveu erro');
  ok(r.error?.message === 'falha de rede', `propagou a mensagem de verdade ("${r.error?.message}")`);
  ok(chamadas.length === 1, `UMA chamada só, não tentou encurtar (achou ${chamadas.length})`);
}

console.log('\n· PARA_NA_ULTIMA_CASA_LIVRE é a decisão do humano (Pendencias.md L83): true');
ok(PARA_NA_ULTIMA_CASA_LIVRE === true, `constante exportada é true (achou ${PARA_NA_ULTIMA_CASA_LIVRE})`);

console.log(FALHAS.length
  ? `\n✗ L70 · empurrão das Artes: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`
  : `\n✓ L70 · empurrão das Artes OK · ${PASSOU} asserções: caminho livre, para na última casa livre, erro de verdade não retenta`);
process.exit(FALHAS.length ? 1 : 0);
