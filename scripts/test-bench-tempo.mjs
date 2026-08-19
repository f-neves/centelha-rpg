// test-bench-tempo.mjs — o smoke da bancada da linha do tempo.
//
// A bancada e uma pagina solta (`combate-tempo-bench.html`, duplo clique, sem servidor) com o
// motor inlinado dentro. `gen-bench-tempo.mjs --check` garante que ela nao ficou velha, mas nao
// garante que ela RODA: um erro de JavaScript so aparece no navegador. Este script abre o arquivo
// no Edge headless, pinta o painel, narra um duelo, roda cada bateria e falha alto em qualquer
// erro de console.
//
// Uso: node scripts/test-bench-tempo.mjs
//      EDGE=<caminho do msedge/chrome> node scripts/test-bench-tempo.mjs
//
// Nao entra no `npm run validate`: precisa de navegador e leva uns 20 segundos.
//
// Cuidado ao mexer: os cliques sao `element.click()` pelo DOM, e nao `page.click()`. A barra de
// abas e `position: sticky`, entao o clique por coordenada do puppeteer bate nela e nao no botao.
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL = 'file:///' + join(RAIZ, 'combate-tempo-bench.html').split('\\').join('/');

const erros = [];
const clicar = (pg, sel) => pg.$eval(sel, (e) => e.click());
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--allow-file-access-from-files'] });
const page = await browser.newPage();
page.on('pageerror', (e) => erros.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') erros.push('console: ' + m.text()); });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });

// painel pintado?
const painel = await page.$eval('#painel', (e) => e.textContent.length);
console.log('painel:', painel, 'chars');
const cartoes = await page.$$eval('#regras .cartao', (n) => n.length);
console.log('cartões de regra:', cartoes);

// as abas
for (const aba of ['provas', 'duelo', 'catalogo']) {
  await clicar(page, `nav.abas button[data-aba="${aba}"]`);
  await new Promise((r) => setTimeout(r, 120));
}
const catLinhas = await page.$$eval('#catalogo table tbody tr', (n) => n.length).catch(() => 0);
console.log('linhas do catálogo:', catLinhas);
const catCab = await page.$$eval('#catalogo table th', (n) => n.map((x) => x.textContent)).catch(() => []);
console.log('cabeçalho:', catCab.slice(0, 12).join(' | '));

// duelo narrado
await clicar(page, 'nav.abas button[data-aba="duelo"]');
await clicar(page, '#narrar');
await page.waitForFunction(() => document.getElementById('trilho').textContent.length > 10, { timeout: 60000, polling: 200 }).catch(() => erros.push('trilho vazio'));
const trilho = await page.$eval('#trilho', (e) => e.textContent.length);
const marcas = await page.$eval('#trilho', (e) => ({
  prep: (e.innerHTML.match(/class="prep"/g) || []).length,
  sai: (e.innerHTML.match(/class="sai"/g) || []).length,
}));
console.log('trilho:', trilho, 'chars ·', JSON.stringify(marcas));

// as baterias, uma a uma (com n baixo para ir rápido)
await clicar(page, 'nav.abas button[data-aba="provas"]');
await page.evaluate(() => { S.n = 400; });
for (const bat of ['regua', 'par', 'duasarmas', 'cadeia', 'roundrobin', 'classes']) {
  const t0 = Date.now();
  await clicar(page, `button[data-bat="${bat}"]`);
  await page.waitForFunction(() => /ms$/.test(document.getElementById('status').textContent), { timeout: 180000, polling: 200 }).catch((e) => erros.push('timeout em ' + bat));
  const n = await page.$$eval('#saida .resultado', (x) => x.length);
  console.log(`bateria ${bat}: ${n} bloco(s) em ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

// os presets
await clicar(page, '#preset-k1');
await new Promise((r) => setTimeout(r, 200));
const k1 = await page.evaluate(() => S.regras.golpeDV);
await clicar(page, '#preset-pgr');
await new Promise((r) => setTimeout(r, 200));
const pgr = await page.evaluate(() => S.regras.golpeDV);
console.log('preset K1 golpeDV =', k1, '· preset P/G/R golpeDV =', pgr);

await browser.close();
if (erros.length) { console.error('\n✘ ERROS:\n' + erros.join('\n')); process.exit(1); }
console.log('\n✓ bancada sem erros de console');
