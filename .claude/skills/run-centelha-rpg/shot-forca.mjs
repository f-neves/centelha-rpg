// shot-forca.mjs — recorta só o bloco "Força & Arremesso" da ficha, com o
// personagem levado a valores altos para a tabela ter linhas de sobra.
// Uso: node .claude/skills/run-centelha-rpg/shot-forca.mjs [arquivo.png]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
// Subir e parar o dev server mora num lugar só (ver o cabeçalho de lá).
import { subirDev } from '../../../scripts/dev-server.mjs';

const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const SHOTS = '_shots';
fs.mkdirSync(SHOTS, { recursive: true });

const file = `${SHOTS}/${process.argv[2] || 'forca-arremesso.png'}`;
const dev = await subirDev();
const url = dev.url;
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
} finally { await br.close(); await dev.parar(); }
