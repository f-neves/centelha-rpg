// Roda as provas e guarda as fotos em _shots/.
//
//   node provas/roda.mjs           # todas
//   node provas/roda.mjs camadas   # só a que casar com o nome
//
// Cada prova é uma página autocontida: abre no navegador sem servidor, sem
// build e sem depender do site. Ver provas/README.md para o porquê disto existir.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const AQUI = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const ROOT = path.join(AQUI, '..');
const SHOTS = path.join(ROOT, '_shots');
const filtro = process.argv[2] || '';

const NAVEGADORES = [
  process.env.EDGE, process.env.CHROME,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].filter(Boolean);
const NAV = NAVEGADORES.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
if (!NAV) { console.error('✘ nenhum navegador encontrado; defina EDGE ou CHROME'); process.exit(2); }

/**
 * As provas. `pronto` é o que se espera para saber que a página terminou, e
 * `cenas` são variações da mesma prova (viram fotos separadas).
 */
const PROVAS = [
  {
    nome: 'camadas',
    arquivo: 'camadas.html',
    pergunta: 'repintar uma camada por innerHTML custa quanto, e quanto se ganha mexendo só no que mudou?',
    pronto: 'window.__PRONTO',
    cenas: [
      { rotulo: 'pequena', busca: 'cols=24&rows=16&tok=12' },
      { rotulo: 'grande', busca: 'cols=40&rows=30&tok=30' },
    ],
    texto: () => 'window.__PRONTO',
  },
];

fs.mkdirSync(SHOTS, { recursive: true });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
for (const pr of PROVAS) {
  if (filtro && !pr.nome.includes(filtro)) continue;
  console.log(`\n== ${pr.nome} ==\n   ${pr.pergunta}`);
  for (const c of pr.cenas) {
    const p = await br.newPage();
    await p.setViewport({ width: 1500, height: 1000 });
    await p.goto(`file:///${path.join(AQUI, pr.arquivo).replace(/\\/g, '/')}?${c.busca}`);
    await p.waitForFunction(pr.pronto, { timeout: 180000 });
    if (pr.texto) console.log('\n' + (await p.evaluate(pr.texto())));
    const foto = path.join(SHOTS, `prova-${pr.nome}-${c.rotulo}.png`);
    await p.screenshot({ path: foto, fullPage: true });
    console.log(`\n   foto → _shots/${path.basename(foto)}`);
    await p.close();
  }
}
await br.close();
