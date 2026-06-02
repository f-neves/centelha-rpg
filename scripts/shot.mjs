import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const B = 'http://localhost:4321/centelha-rpg';
fs.mkdirSync('_shots', { recursive: true });
const br = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });

async function shot(name, path, { w = 1280, h = 900, theme, action } = {}) {
  const p = await br.newPage();
  await p.setViewport({ width: w, height: h });
  await p.goto(B + path, { waitUntil: 'networkidle0', timeout: 60000 });
  if (theme) { await p.evaluate((t) => { localStorage.setItem('tema', t); }, theme); await p.reload({ waitUntil: 'networkidle0' }); }
  if (action) await p.evaluate(action);
  await new Promise((r) => setTimeout(r, 400));
  await p.screenshot({ path: `_shots/${name}.png` });
  await p.close();
  console.log('shot', name);
}

await shot('home', '/');
await shot('cap-combate', '/regras/combate');
await shot('caminho-vento', '/caminhos/vento');
await shot('ficha-kael', '/ficha', { action: () => document.getElementById('f-kael')?.click() });
await shot('escuro', '/caminhos/punho-de-ferro', { theme: 'escuro' });
await shot('mobile', '/', { w: 390, h: 780 });
await br.close();
console.log('done');
