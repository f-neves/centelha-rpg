// Abre a caixa de conjuração no Grid, com o banco de mentira da bancada, e tira
// uma foto dela. Serve para conferir com o olho o que o teste não alcança: os
// controles novos da manifestação (fatias e abertura) e a lista de moldes.
//
//   node scripts/shot-conjurar.mjs [pasta]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { subirDev } from './dev-server.mjs';

const MESA = '00000000-0000-4000-8000-0000000000aa';
const OUT = process.argv[2] || '_shots';
const NAV = [
  process.env.EDGE, process.env.CHROME,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
].filter(Boolean).find((p) => { try { return fs.existsSync(p); } catch { return false; } });
if (!NAV) { console.log('· sem navegador'); process.exit(0); }

fs.mkdirSync(OUT, { recursive: true });
const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
const p = await br.newPage();
await p.setViewport({ width: 1400, height: 1000 });
const erros = [];
p.on('pageerror', (e) => erros.push(String(e)));
await p.goto(`${dev.url}/mesa/grid?id=${MESA}&bench=12&cols=20&rows=15&nevoa=0`,
  { waitUntil: 'networkidle0', timeout: 90000 });
await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
await new Promise((r) => setTimeout(r, 800));

// Nem toda peça tem Arte: tenta uma a uma até a caixa de conjuração abrir.
const ZONAS = JSON.parse(fs.readFileSync('src/data/efeitos.json','utf8'))
  .filter((e) => e.grid && e.grid.forma === 'zona').map((e) => e.id);

const ELEM = JSON.parse(fs.readFileSync('src/data/artes.json','utf8'))
  .filter((a) => a.grid && a.grid.elemento).map((a) => a.id);

const abriu = await p.evaluate(async (ELEM) => {
  const tokens = [...document.querySelectorAll('#gr-tokens .gr-token')];
  if (!tokens.length) return 'sem peça no tabuleiro';
  for (const t of tokens) {
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 400, clientY: 300 }));
    const it = document.querySelector('#tok-menu button[data-a="arte"]');
    if (!it) continue;
    it.click();
    await new Promise((r) => setTimeout(r, 600));
    const cx = document.querySelector('.ui-dlg-conj');
    if (cx && [...cx.querySelectorAll('[data-arte]')].some((a) => ELEM.includes(a.dataset.arte))) {
      [...cx.querySelectorAll('[data-arte]')].find((a) => ELEM.includes(a.dataset.arte)).click();
      await new Promise((r) => setTimeout(r, 300));
      return 'ok';
    }
    document.querySelector('dialog[open]')?.close();
    await new Promise((r) => setTimeout(r, 150));
  }
  return 'nenhuma peça abriu a caixa com Arte elemental';
}, ELEM);
console.log('abrir:', abriu);

if (abriu === 'ok') {
  // 1. improviso: sobe o Volume e mostra as fatias
  await p.evaluate(() => {
    const mais = [...document.querySelectorAll('[data-par]')]
      .filter((b) => b.dataset.par === 'Volume' && b.dataset.d === '1');
    for (let i = 0; i < 6; i++) mais[0]?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await p.screenshot({ path: `${OUT}/conj-improviso.png` });
  console.log('figura do improviso:',
    await p.evaluate(() => document.querySelector('.ag-figura')?.textContent?.trim()));

  // 2. um Efeito de ZONA, que é onde a lista de moldes aparece
  const trocou = await p.evaluate(async (zonas) => {
    const b = [...document.querySelectorAll('[data-ef]')].find((x) => zonas.includes(x.dataset.ef))
      || [...document.querySelectorAll('[data-ef]')].find((x) => x.dataset.ef);
    if (!b) return null;
    b.click();
    await new Promise((r) => setTimeout(r, 300));
    const mais = [...document.querySelectorAll('[data-par]')]
      .filter((x) => (x.dataset.par === 'Área' || x.dataset.par === 'Volume') && x.dataset.d === '1');
    for (let i = 0; i < 4; i++) mais[0]?.click();
    await new Promise((r) => setTimeout(r, 300));
    return {
      efeito: b.textContent.trim().slice(0, 40),
      figura: document.querySelector('.ag-figura')?.textContent?.trim(),
      moldes: [...document.querySelectorAll('[data-molde]')].map((m) => m.textContent.trim().replace(/\s+/g, ' ')),
    };
  }, ZONAS);
  console.log('efeito:', JSON.stringify(trocou, null, 1));
  await p.screenshot({ path: `${OUT}/conj-efeito.png` });
}
console.log('erros de página:', erros.length ? erros.slice(0, 3) : 'nenhum');
await br.close();
dev.parar();
