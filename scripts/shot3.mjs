import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const B = 'http://localhost:4321/centelha-rpg';
fs.mkdirSync('_shots', { recursive: true });
const br = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });

// hovercard num link de pré-requisito na página do Vento
{
  const p = await br.newPage(); await p.setViewport({ width: 1180, height: 850 });
  await p.goto(B + '/caminhos/vento', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200)); // espera idle + ref-index + autolink
  // encontra um link de prereq (Requer: ...) e passa o mouse
  const sel = await p.evaluate(() => {
    const a = [...document.querySelectorAll('main .tec-meta a')].find((x) => x.textContent.trim());
    if (a) { a.id = 'hovertarget'; return '#hovertarget'; }
    return null;
  });
  if (sel) { await p.hover(sel); await new Promise((r) => setTimeout(r, 350)); }
  await p.screenshot({ path: '_shots/hovercard.png' });
  await p.close(); console.log('hovercard', sel);
}
// auto-link na prosa do capítulo de combate (hover num termo auto-linkado)
{
  const p = await br.newPage(); await p.setViewport({ width: 1180, height: 850 });
  await p.goto(B + '/regras/combate', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));
  const info = await p.evaluate(() => {
    const refs = [...document.querySelectorAll('main .ref')];
    const first = refs[0]; if (first) first.id = 'reftarget';
    return { count: refs.length, sample: refs.slice(0, 8).map((r) => r.textContent) };
  });
  if (info.count) { await p.hover('#reftarget'); await new Promise((r) => setTimeout(r, 350)); }
  await p.screenshot({ path: '_shots/autolink.png' });
  await p.close(); console.log('autolink refs:', info.count, info.sample);
}
await br.close(); console.log('done');
