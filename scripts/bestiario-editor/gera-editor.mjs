// gera-editor.mjs · monta o HTML do editor de criaturas (fora do git, gerado) a partir da FONTE ÚNICA (src/data/bestiario) (Etapa 2.1).
//
//   node scripts/bestiario-editor/gera-editor.mjs                 grava tmp/arquiteto/bestiario/editor/fichas-editor-fonte.html
//   node scripts/bestiario-editor/gera-editor.mjs --saida <arq>   grava em outro arquivo (os testes usam)
//   node scripts/bestiario-editor/gera-editor.mjs --sem-cards     não lê o dist (o card de hoje fica de fora)
//
// O que entra no HTML (um arquivo só, sem rede):
//  - os dados: a lista do gera-dados.mjs (id, titulo, a criatura inteira);
//  - o MOTOR do site (src/lib/motor.ts) empacotado para o navegador: os números ao vivo saem do mesmo código do site, e o editor não é um
//    segundo desenhista dos números;
//  - o CARD DE HOJE de cada criatura, extraído do dist/bestiario/index.html (o último build do site) com o CSS dele: estático, e o aviso do
//    topo diz que a ficha final é a do site. Sem o dist, o editor abre sem os cards e avisa.
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { gerarLista, caminhoPadrao } from './gera-dados.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const escJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

export async function motorParaNavegador() {
  const r = await build({
    entryPoints: [path.join(RAIZ, 'src/lib/motor.ts')], bundle: true, format: 'iife', globalName: 'MotorSite', platform: 'browser',
    write: false, minify: true, loader: { '.json': 'json' }, define: { 'import.meta.env': '{}' }, logLevel: 'error',
  });
  return r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
}

/** { cartoes: { id: html }, css } lidos do dist, ou null se não há build. */
export function cartoesDoDist(dist = path.join(RAIZ, 'dist')) {
  const pagina = path.join(dist, 'bestiario', 'index.html');
  if (!fs.existsSync(pagina)) return null;
  const html = fs.readFileSync(pagina, 'utf8');
  const cartoes = {};
  for (const m of html.matchAll(/<article class="besta"[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/article>/g)) cartoes[m[1]] = m[0];
  let css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  for (const m of html.matchAll(/<link rel="stylesheet" href="[^"]*?(\/_astro\/[^"]+\.css)"/g)) {
    const f = path.join(dist, m[1]);
    if (fs.existsSync(f)) css += '\n' + fs.readFileSync(f, 'utf8');
  }
  return { cartoes, css: css.replace(/<\/style/gi, '<\\/style') };
}

export async function montarHtml({ semCards = false } = {}) {
  const modelo = fs.readFileSync(path.join(RAIZ, 'scripts', 'bestiario-editor', 'editor-modelo.html'), 'utf8');
  const lista = gerarLista().map(({ id, titulo, criatura }) => ({ id, titulo, criatura }));
  const c = semCards ? null : cartoesDoDist();
  const motor = await motorParaNavegador();
  const trocas = { '/*@CSS_SITE@*/': c?.css || '', '/*@MOTOR@*/': motor, '/*@DADOS@*/': escJson(lista), '/*@CARTOES@*/': escJson(c?.cartoes || {}) };
  // function como substituto: o texto trocado pode ter "$&" e parecidos (o motor minificado tem), que o replace de texto leria como padrão
  let html = modelo;
  for (const [k, v] of Object.entries(trocas)) html = html.replace(k, () => v);
  return { html, criaturas: lista.length, cartoes: Object.keys(c?.cartoes || {}).length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const i = args.indexOf('--saida');
  const saida = path.resolve(i >= 0 ? args[i + 1] : path.join(path.dirname(caminhoPadrao()), 'fichas-editor-fonte.html'));
  const { html, criaturas, cartoes } = await montarHtml({ semCards: args.includes('--sem-cards') });
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  fs.writeFileSync(saida, html, 'utf8');
  console.log(`✓ ${saida}: ${criaturas} criaturas, ${cartoes} cards de hoje, ${(html.length / 1048576).toFixed(1)} MB`);
  if (!args.includes('--sem-cards') && cartoes < criaturas) console.log(`  ⚠ só ${cartoes} cards: gere o dist antes (npx astro build) para o editor mostrar o card de hoje de todas`);
}
