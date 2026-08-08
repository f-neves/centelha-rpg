// shot-forca.mjs — recorta só o bloco "Força & Arremesso" da ficha, com o
// personagem levado a valores altos para a tabela ter linhas de sobra.
// Uso: node .claude/skills/run-centelha-rpg/shot-forca.mjs [arquivo.png]
import puppeteer from 'puppeteer-core';
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';

const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = process.env.BASE_PATH || '/centelha-rpg';
const SHOTS = '_shots';
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
fs.mkdirSync(SHOTS, { recursive: true });

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
    child.on('exit', (c) => { clearTimeout(t); reject(new Error('dev server exited early (' + c + ')\n' + out)); });
  });
}
function kill(child) {
  if (!child || child.killed) return;
  try { if (process.platform === 'win32') execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' }); else process.kill(-child.pid); }
  catch { try { child.kill('SIGKILL'); } catch {} }
}

const file = `${SHOTS}/${process.argv[2] || 'forca-arremesso.png'}`;
const { child, url } = await startServer();
console.log('• server up at ' + url);
const br = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1280, height: 1100, deviceScaleFactor: 2 });
  await p.goto(url + '/ficha', { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#forca-arremesso .fa-tbl', { timeout: 20000 });

  // sobe Força, Atletismo, Halterofilismo e Arremesso clicando na 4ª bolinha
  for (const chave of ['forca', 'atletismo', 'halterofilismo', 'arremesso']) {
    const dot = await p.$(`.dots[data-key="${chave}"] .dot[data-d="4"]`);
    if (dot) await dot.click(); else console.log('  ! não achei as bolinhas de ' + chave);
  }
  await new Promise((r) => setTimeout(r, 600));

  const box = await p.$('#forca-arremesso');
  await box.screenshot({ path: file });
  const txt = await p.$eval('#forca-arremesso .fa-tbl', (t) => t.innerText);
  console.log('--- tabela ---\n' + txt);
  console.log('• screenshot → ' + file);
} finally { await br.close(); kill(child); }
