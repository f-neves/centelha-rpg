// render_pdf.mjs — dirige o Edge (puppeteer-core) + Paged.js → New_RPG_System_D6_Livro.pdf
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const SRC = pathToFileURL(path.join(ROOT,'livro.html')).href;
const OUT = path.join(ROOT,'New_RPG_System_D6_Livro.pdf');

const browser = await puppeteer.launch({
  executablePath: EDGE, headless: 'new',
  args:['--no-sandbox','--disable-gpu','--font-render-hinting=none'],
});
const page = await browser.newPage();
const errs=[];
page.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
page.on('pageerror', e=>errs.push('PAGEERROR: '+e.message));

await page.goto(SRC, { waitUntil:'networkidle0', timeout:120000 });
// espera o Paged.js terminar a paginação
await page.waitForFunction('window.__pagedDone === true', { timeout:120000 });
const pages = await page.$$eval('.pagedjs_page', els=>els.length);
await new Promise(r=>setTimeout(r,400)); // assenta fontes/layout

await page.pdf({
  path: OUT, printBackground:true, preferCSSPageSize:true,
  margin:{top:0,right:0,bottom:0,left:0},
});
await browser.close();
console.log(`PDF gerado: ${pages} páginas → ${path.basename(OUT)}`);
if(errs.length) console.log('Erros de página:\n'+errs.slice(0,20).join('\n'));
