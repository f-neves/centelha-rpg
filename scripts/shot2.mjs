import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const B = 'http://localhost:4321/centelha-rpg';
fs.mkdirSync('_shots', { recursive: true });
const br = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });

// rolador: preenche bônus +2d6, alvo 10, rola
{
  const p = await br.newPage(); await p.setViewport({ width: 1100, height: 800 });
  await p.goto(B + '/rolador', { waitUntil: 'networkidle0' });
  await p.type('[data-rd="bonus"]', '+2d6');
  await p.type('[data-rd="alvo"]', '10');
  await p.click('[data-rd="roll"]');
  await new Promise((r) => setTimeout(r, 300));
  await p.screenshot({ path: '_shots/rolador.png' });
  await p.close(); console.log('rolador');
}
// sidebar recolhido na home
{
  const p = await br.newPage(); await p.setViewport({ width: 1280, height: 800 });
  await p.goto(B + '/', { waitUntil: 'networkidle0' });
  await p.click('#sidebar-collapse');
  await new Promise((r) => setTimeout(r, 250));
  await p.screenshot({ path: '_shots/sidebar-collapsed.png' });
  await p.close(); console.log('sidebar-collapsed');
}
// ficha: rola a página pra ver que o painel NÃO é sticky
{
  const p = await br.newPage(); await p.setViewport({ width: 1280, height: 800 });
  await p.goto(B + '/ficha', { waitUntil: 'networkidle0' });
  await p.click('#f-kael');
  await new Promise((r) => setTimeout(r, 200));
  await p.evaluate(() => window.scrollBy(0, 520));
  await new Promise((r) => setTimeout(r, 250));
  await p.screenshot({ path: '_shots/ficha-scroll.png' });
  await p.close(); console.log('ficha-scroll');
}
await br.close(); console.log('done');
