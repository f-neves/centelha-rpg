// one-off: screenshot the ficha equipment area with armor stacked, to verify per-mode Soak.
import puppeteer from 'puppeteer-core';
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';

const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = '/centelha-rpg';
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
fs.mkdirSync('_shots', { recursive: true });

function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn('npm run dev', { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    const onData = (b) => { out += stripAnsi(b.toString()); const m = out.match(/http:\/\/localhost:(\d+)\/centelha-rpg/); if (m) { clearTimeout(t); resolve({ child, url: `http://localhost:${m[1]}${BASE}` }); } };
    child.stdout.on('data', onData); child.stderr.on('data', onData);
    const t = setTimeout(() => { reject(new Error('no server\n' + out)); }, 45000);
  });
}
function kill(child) { try { execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' }); } catch {} }

const { child, url } = await startServer();
console.log('server', url);
const br = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1100, height: 900, deviceScaleFactor: 2 });
  await p.goto(url + '/ficha', { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#eq-armaduras input[data-arm]', { timeout: 15000 });
  await p.evaluate(() => {
    const clk = (el) => el && el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // Vigor 4, Destreza 4, Atletismo 3, Centelha 2
    clk(document.querySelector('.dots[data-kind="attr"][data-key="vigor"] .dot[data-d="4"]'));
    clk(document.querySelector('.dots[data-kind="attr"][data-key="destreza"] .dot[data-d="4"]'));
    clk(document.querySelector('.dots[data-kind="skill"][data-key="atletismo"] .dot[data-d="3"]'));
    clk(document.querySelector('.dots[data-kind="centelha"] .dot[data-d="2"]'));
    // weapon = espada-longa
    const w = document.querySelector('#eq-arma'); if (w) { w.value = 'espada-longa'; w.dispatchEvent(new Event('change', { bubbles: true })); }
    const s = document.querySelector('#eq-escudo'); if (s) { s.value = 'redondo'; s.dispatchEvent(new Event('change', { bubbles: true })); }
    // stack gambeson + malha
    for (const id of ['gambeson', 'malha']) { const cb = document.querySelector(`#eq-armaduras input[data-arm="${id}"]`); if (cb && !cb.checked) cb.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
    // expand derived
    const dt = document.querySelector('#deriv-toggle'); if (dt && /Expandir/.test(dt.textContent)) clk(dt);
  });
  await new Promise((r) => setTimeout(r, 400));
  await (await p.$('#derived')).screenshot({ path: '_shots/eq-derived.png' });
  await (await p.$('#eq-armaduras')).screenshot({ path: '_shots/eq-checklist.png' });
  await (await p.$('#combate')).screenshot({ path: '_shots/eq-combate.png' });
  console.log('done');
} finally { await br.close(); kill(child); }
process.exit(0);
