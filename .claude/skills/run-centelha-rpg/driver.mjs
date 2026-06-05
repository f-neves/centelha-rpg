// driver.mjs — launches the Centelha RPG Astro site and drives it headless.
// Self-contained: spawns `npm run dev`, detects the port, drives Edge via
// puppeteer-core, screenshots to _shots/, and runs an interactivity smoke
// on the character sheet (/ficha). No prior build needed (dev server).
//
//   node .claude/skills/run-centelha-rpg/driver.mjs            # full smoke (default)
//   node .claude/skills/run-centelha-rpg/driver.mjs shot /ficha ficha.png
//
// Env overrides: EDGE=<path to msedge/chrome>  BASE_PATH=/centelha-rpg
import puppeteer from 'puppeteer-core';
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';

const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = process.env.BASE_PATH || '/centelha-rpg';
const SHOTS = '_shots';
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

if (!fs.existsSync(EDGE)) { console.error(`✘ Browser not found at ${EDGE}. Set EDGE=<path to msedge.exe or chrome>.`); process.exit(2); }
fs.mkdirSync(SHOTS, { recursive: true });

// --- launch the dev server and detect its URL -------------------------------
function startServer() {
  return new Promise((resolve, reject) => {
    const child = spawn('npm run dev', { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    const onData = (b) => {
      out += stripAnsi(b.toString());
      const m = out.match(/http:\/\/localhost:(\d+)\/centelha-rpg/);
      if (m) { clearTimeout(t); resolve({ child, url: `http://localhost:${m[1]}${BASE}` }); }
    };
    child.stdout.on('data', onData); child.stderr.on('data', onData);
    const t = setTimeout(() => { kill(child); reject(new Error('dev server did not start in 45s\n' + out)); }, 45000);
    child.on('exit', (c) => { clearTimeout(t); reject(new Error('dev server exited early (code ' + c + ')\n' + out)); });
  });
}
function kill(child) {
  if (!child || child.killed) return;
  try { if (process.platform === 'win32') execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' }); else process.kill(-child.pid); }
  catch { try { child.kill('SIGKILL'); } catch {} }
}

const fail = [];
const check = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✘ ') + msg); if (!cond) fail.push(msg); };

async function main() {
  const mode = process.argv[2] || 'smoke';
  console.log('• starting dev server (npm run dev)…');
  const { child, url } = await startServer();
  console.log('• server up at ' + url);
  const br = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  try {
    const p = await br.newPage();
    await p.setViewport({ width: 1280, height: 1100 });

    if (mode === 'shot') {
      const route = process.argv[3] || '/';
      const file = `${SHOTS}/${process.argv[4] || 'shot.png'}`;
      await p.goto(url + route, { waitUntil: 'networkidle0', timeout: 60000 });
      await p.screenshot({ path: file, fullPage: true });
      console.log('• screenshot → ' + file);
      return;
    }

    // 1) home loads
    await p.goto(url + '/', { waitUntil: 'networkidle0', timeout: 60000 });
    check((await p.$('h1')) !== null, 'home has an <h1>');
    await p.screenshot({ path: `${SHOTS}/home.png` });

    // 2) a content chapter renders
    await p.goto(url + '/regras/combate', { waitUntil: 'networkidle0', timeout: 60000 });
    check(/Combate/i.test(await p.title()), 'chapter /regras/combate loads');

    // 3) the interactive character sheet
    await p.goto(url + '/ficha', { waitUntil: 'networkidle0', timeout: 60000 });
    await p.waitForSelector('#tecnicas > div', { timeout: 15000 });
    // set Centelha 2 and expand the first Caminho
    await p.evaluate(() => {
      document.querySelector('.dots[data-kind="centelha"] .dot[data-d="2"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      document.querySelector('#tecnicas .cam-head[data-camtog]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await new Promise((r) => setTimeout(r, 300));
    const cols = await p.evaluate(() => document.querySelectorAll('#tecnicas > div').length);
    const colsArtes = await p.evaluate(() => document.querySelectorAll('#artes > div').length);
    const descs = await p.evaluate(() => document.querySelectorAll('#tecnicas .cam-body[style*="block"] .tdesc').length);
    check(cols === 3, `Caminhos render in 3 columns (got ${cols})`);
    check(colsArtes === 3, `Artes render in 3 columns (got ${colsArtes})`);
    check(descs > 0, `expanded Caminho shows technique descriptions (got ${descs})`);
    await p.screenshot({ path: `${SHOTS}/ficha.png` });

    // 4) ref-modal opens centered without scrolling the page
    await p.evaluate(() => { const n = document.querySelectorAll('.trow .nm'); n[Math.min(n.length - 1, 40)]?.scrollIntoView({ block: 'center' }); });
    await new Promise((r) => setTimeout(r, 150));
    const yBefore = await p.evaluate(() => window.scrollY);
    await p.evaluate(() => { const n = document.querySelectorAll('.trow .nm'); n[Math.min(n.length - 1, 40)]?.dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    await new Promise((r) => setTimeout(r, 250));
    const modal = await p.evaluate(() => ({ open: !!document.querySelector('.ref-modal[open]'), y: window.scrollY, pos: document.querySelector('.ref-modal') && getComputedStyle(document.querySelector('.ref-modal')).position }));
    check(modal.open, 'ref-modal opens on trait click');
    check(modal.pos === 'fixed', `ref-modal is position:fixed (got ${modal.pos})`);
    check(Math.abs(yBefore - modal.y) < 5, `opening the modal does not scroll the page (${yBefore}→${modal.y})`);
    await p.screenshot({ path: `${SHOTS}/ficha-modal.png` });
  } finally {
    await br.close();
    kill(child);
  }
  console.log(`\nScreenshots in ${SHOTS}/  ·  ${fail.length ? '✘ ' + fail.length + ' FAILED' : '✓ all checks passed'}`);
  process.exit(fail.length ? 1 : 0);
}
main().catch((e) => { console.error('✘ driver error:', e.message); process.exit(1); });
