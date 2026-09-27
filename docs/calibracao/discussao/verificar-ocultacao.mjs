// Verificação do site gerado em navegador isolado, sem usar fichas do usuário.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const dist = path.join(root, 'dist');
const tecnicas = JSON.parse(fs.readFileSync(path.join(root, 'src/data/tecnicas.json'), 'utf8'));
const ocultas = tecnicas.filter((t) => t.modulo === 'folego').map((t) => t.id);
const indice = JSON.parse(fs.readFileSync(path.join(dist, 'ref-index.json'), 'utf8'));
assert.equal(indice.filter((r) => r.tipo === 'técnica').length, tecnicas.length - ocultas.length);
for (const id of ocultas) assert.ok(!indice.some((r) => r.tipo === 'técnica' && r.id === id), id);
assert.ok(indice.some((r) => r.tipo === 'técnica' && r.id === 'segundo-folego'));
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.html': 'text/html', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/centelha-rpg\/?/, '');
  let file = path.resolve(dist, rel);
  if (!file.startsWith(dist + path.sep) && file !== dist) { res.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  res.end(fs.readFileSync(file));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  const base = `http://127.0.0.1:${server.address().port}/centelha-rpg`;
  browser = await puppeteer.launch({ executablePath: process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const p = await browser.newPage();
  for (const route of ['/tecnicas', '/caminhos', '/arvore']) {
    const response = await p.goto(base + route, { waitUntil: 'networkidle0' });
    assert.equal(response.status(), 200, route);
    assert.ok(!(await p.$eval('body', (el) => el.innerText)).includes('Coração Incansável'), route);
  }
  await p.goto(base + '/ficha', { waitUntil: 'networkidle0' });
  await p.waitForSelector('#tecnicas .camgrupo');
  for (const id of ocultas) assert.equal(await p.$(`[data-tech="${id}"]`), null, id);
  assert.ok(await p.$('[data-tech="segundo-folego"]'));
  assert.ok(await p.$('[data-tech="corpo-inospito"]'));
  await p.evaluate(() => {
    document.querySelector('.dots[data-kind="centelha"] .dot[data-d="6"]').click();
    const s = JSON.parse(localStorage.getItem('centelha:ficha'));
    s.tech['folego-profundo'] = true;
    s.tech['segundo-folego'] = true;
    localStorage.setItem('centelha:ficha', JSON.stringify(s));
    localStorage.setItem('centelha:marcadores', JSON.stringify(['tecnica:folego-profundo', 'tecnica:segundo-folego']));
  });
  await p.reload({ waitUntil: 'networkidle0' });
  await p.waitForSelector('#tecnicas .camgrupo');
  assert.equal(await p.$('[data-tech="folego-profundo"]'), null);
  await p.evaluate(() => document.querySelector('.dots[data-kind="centelha"] .dot[data-d="5"]').click());
  assert.equal(await p.evaluate(() => JSON.parse(localStorage.getItem('centelha:ficha')).tech['folego-profundo']), true);
  await p.goto(base + '/marcadores', { waitUntil: 'networkidle0' });
  assert.ok(!(await p.$eval('#mk-out', (el) => el.innerText)).includes('Fôlego Profundo'));
  assert.ok((await p.$eval('#mk-out', (el) => el.innerText)).includes('Segundo Fôlego'));
  console.log('Site gerado: índice, catálogo, caminhos, árvores, ficha e marcadores conferidos. Compra antiga preservada ao salvar.');
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
