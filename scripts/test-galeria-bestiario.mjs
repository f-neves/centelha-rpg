// test-galeria-bestiario.mjs · prova no navegador (Edge headless, sem banco) do carrossel de imagens do bestiário (prompt 056-imagens).
//
//   node scripts/test-galeria-bestiario.mjs
//
// Copia a fixture (scripts/fixtures/bestiario-galeria: aasimar com 3 imagens, ninfa com 10) pelo próprio
// sync-bestiario-imagens.mjs para uma pasta e um índice DE TESTE (`public/bestiario-galeria-teste/` e um arquivo em
// os.tmpdir()), que o site lê pelos ganchos BESTIARIO_GALERIA_DIR e BESTIARIO_GALERIA_INDICE (src/lib/bestiario-galeria.ts).
// Assim o teste roda igual com o conjunto real presente em `public/bestiario-galeria/`, que ele nunca toca. Sobe o site,
// confere o carrossel no computador (1280 px) e no celular (375 px) e APAGA o que criou (mesmo se falhar). Recusa rodar só
// se a própria pasta de teste já existir. Obs.: se já houver um dev server do Astro de outra sessão, subirDev o reaproveita
// sem estes ganchos; pare-o antes.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { subirDev } from './dev-server.mjs';
import { navegadorOuSair, abrirNavegador } from './navegador.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
// Acha o navegador pela política de `scripts/navegador.mjs`: sem navegador, pula com código 0 (no CI, `SMOKE_EXIGE_NAVEGADOR=1` o torna falha).
const EDGE = navegadorOuSair('carrossel de imagens do bestiário');
const SHOTS = path.join(RAIZ, '_shots');
const NOME_TESTE = 'bestiario-galeria-teste';
const DEST_WEBP = path.join(RAIZ, 'public', NOME_TESTE);
const DEST_INDICE = path.join(os.tmpdir(), `test-galeria-bestiario-indice-${process.pid}.json`);
process.env.BESTIARIO_GALERIA_DIR = NOME_TESTE;
process.env.BESTIARIO_GALERIA_INDICE = DEST_INDICE;
const MANIFESTO = path.join(os.tmpdir(), `test-galeria-bestiario-${process.pid}.json`);
if (fs.existsSync(DEST_WEBP)) {
  console.error('✘ public/bestiario-galeria-teste já existe (sobra de um teste interrompido): apague-a e rode de novo.');
  process.exit(2);
}
fs.mkdirSync(SHOTS, { recursive: true });
const fail = [];
const check = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✘ ') + msg); if (!cond) fail.push(msg); };
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let dev = null, br = null;

function limpar() {
  fs.rmSync(DEST_WEBP, { recursive: true, force: true });
  fs.rmSync(DEST_INDICE, { force: true });
  fs.rmSync(MANIFESTO, { force: true });
}
process.on('exit', limpar);

try {
  const s = spawnSync('node', ['scripts/sync-bestiario-imagens.mjs', '--origem', 'scripts/fixtures/bestiario-galeria', '--webp', DEST_WEBP, '--indice', DEST_INDICE, '--manifesto', MANIFESTO, '--gravar'], { cwd: RAIZ, encoding: 'utf8' });
  if (s.status !== 0) { console.error(s.stdout + s.stderr); throw new Error('o sync da fixture falhou'); }
  console.log('• fixture copiada pelo sync; subindo o site…');
  dev = await subirDev();
  br = await abrirNavegador(puppeteer, { executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });

  for (const [rotulo, largura, altura, celular] of [['desktop', 1280, 1000, false], ['celular', 375, 800, true]]) {
    console.log(`\n== ${rotulo} (${largura} px) ==`);
    const p = await br.newPage();
    await p.setViewport({ width: largura, height: altura, isMobile: celular, hasTouch: celular });
    const pedidos = [];
    p.on('pageerror', (e) => { console.log('  ! erro na página: ' + e.message); });
    p.on('response', (r) => { if (r.status() >= 400) console.log('  ! ' + r.status() + ' ' + r.url()); });
    p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) console.log('  ! console.error: ' + m.text().slice(0, 200)); });
    p.on('request', (r) => { if (/bestiario-galeria-teste\//.test(r.url())) pedidos.push(r.url().split('/').pop()); });
    await p.goto(dev.url + '/bestiario', { waitUntil: 'networkidle0', timeout: 90000 });

    // a lista: a imagem principal de hoje, o selo e a lupa; a criatura fora do índice segue sem carrossel
    const lista = await p.evaluate(() => {
      const c = document.getElementById('aasimar');
      const im = c?.querySelector('.arte img');
      return { temGaleria: !!im?.dataset.galeria, src: im?.getAttribute('src') || '', selo: c?.querySelector('.arte-selo')?.textContent, lupa: !!c?.querySelector('.arte-lupa'),
        abolethGaleria: !!document.querySelector('#aboleth .arte img[data-galeria]'), abolethLupa: !!document.querySelector('#aboleth .arte-lupa') };
    });
    check(lista.temGaleria && /bestiario\/aasimar_criatura\.webp$/.test(lista.src), 'a lista mostra a imagem principal de sempre (bestiario/aasimar_criatura.webp), com os dados da galeria no card');
    check(lista.selo === '3 imagens' && lista.lupa, 'o card tem o selo "3 imagens" e a lupa');
    check(!lista.abolethGaleria && !lista.abolethLupa, 'criatura fora do índice (aboleth) fica como era: sem carrossel nem lupa');
    check(!pedidos.some((f) => /^aasimar_|^ninfa_/.test(f)), 'ao carregar a lista, nenhuma imagem do carrossel é pedida');

    // abrir o carrossel pelo clique na arte
    await p.evaluate(() => document.getElementById('aasimar').scrollIntoView({ block: 'center' }));
    // o card sobe um pouco no :hover; espera a transição acabar para o clique cair na imagem, como com a mão parada
    await p.hover('#aasimar .arte img'); await esperar(600);
    await p.click('#aasimar .arte img');
    try { await p.waitForSelector('#galeria:not([hidden])', { timeout: 5000 }); } catch (e) {
      console.log('  ! diagnóstico:', JSON.stringify(await p.evaluate(() => ({ existe: !!document.getElementById('galeria'), topo: (() => { const im = document.querySelector('#aasimar .arte img'); const r = im.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e ? e.tagName + '.' + e.className : null; })(), caixa: (() => { const im = document.querySelector('#aasimar .arte img'); const r = im.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), im.complete, im.naturalWidth]; })(), hidden: document.getElementById('galeria')?.hidden, ds: document.querySelector('#aasimar .arte img')?.dataset.galeria?.slice(0, 80), tag: document.querySelector('#aasimar .arte img')?.outerHTML.slice(0, 200) }))));
      throw e;
    }
    await esperar(400);
    const abre = await p.evaluate(() => {
      const q = document.getElementById('gal-quadro').getBoundingClientRect();
      const m = document.getElementById('gal-minis').getBoundingClientRect();
      const minis = [...document.querySelectorAll('#gal-minis .gal-mini')];
      return { src: document.getElementById('gal-img').getAttribute('src'), alt: document.getElementById('gal-img').alt, nome: document.getElementById('gal-nome').textContent,
        proporcao: q.width / q.height, minis: minis.length, atual: minis.findIndex((b) => b.classList.contains('atual')), leg: document.getElementById('gal-leg').textContent, cont: document.getElementById('gal-cont').textContent,
        minisAoLado: m.left >= q.right - 1, minisEmbaixo: m.top >= q.bottom - 1, rolagemLateral: document.getElementById('gal-minis').scrollWidth > document.getElementById('gal-minis').clientWidth,
        todasVisivel: !document.getElementById('gal-todas').hidden, overflowBody: document.body.style.overflow };
    });
    check(/aasimar_01\.webp$/.test(abre.src) && abre.alt === 'Aasimar, mulher' && abre.leg === 'Aasimar, mulher' && abre.nome === 'Aasimar', 'abre na primeira imagem, com o alt e a legenda do índice');
    check(Math.abs(abre.proporcao - 1.5) < 0.03, `o quadro é 3:2 (${abre.proporcao.toFixed(3)})`);
    check(abre.minis === 3 && abre.atual === 0 && abre.cont === '1 de 3', 'três miniaturas, a atual destacada, contador "1 de 3"');
    check(celular ? abre.minisEmbaixo : abre.minisAoLado, celular ? 'no celular as miniaturas ficam embaixo do quadro' : 'no computador as miniaturas ficam ao lado do quadro');
    check(!abre.todasVisivel, 'com 3 imagens não há "Ver todas"');
    check(abre.overflowBody === 'hidden', 'a página atrás trava a rolagem');
    check(pedidos.includes('aasimar_01.webp') && pedidos.includes('aasimar_03_mini.webp') && !pedidos.includes('aasimar_02.webp') && !pedidos.includes('aasimar_03.webp'),
      'ao abrir: só a grande atual e as miniaturas foram pedidas (as outras grandes, não)');

    // navegar: seta da tela, teclado, miniatura
    await p.click('#gal-prox'); await esperar(150);
    let st = await p.evaluate(() => ({ src: document.getElementById('gal-img').getAttribute('src'), cont: document.getElementById('gal-cont').textContent, leg: document.getElementById('gal-leg').textContent }));
    check(/aasimar_02\.webp$/.test(st.src) && st.cont === '2 de 3' && st.leg === 'Aasimar, homem', 'a seta "próxima" vai para a 2 (legenda e contador mudam)');
    check(pedidos.includes('aasimar_02.webp') && !pedidos.includes('aasimar_03.webp'), 'a 2 só foi pedida agora; a 3 ainda não');
    await p.keyboard.press('ArrowRight'); await esperar(150);
    st = await p.evaluate(() => document.getElementById('gal-img').getAttribute('src'));
    check(/aasimar_03\.webp$/.test(st), 'a tecla direita vai para a 3');
    await p.keyboard.press('ArrowRight'); await esperar(150);
    st = await p.evaluate(() => document.getElementById('gal-img').getAttribute('src'));
    check(/aasimar_01\.webp$/.test(st), 'a tecla direita na última volta à primeira');
    await p.keyboard.press('ArrowLeft'); await esperar(150);
    st = await p.evaluate(() => document.getElementById('gal-img').getAttribute('src'));
    check(/aasimar_03\.webp$/.test(st), 'a tecla esquerda na primeira vai à última');
    await p.click('#gal-minis .gal-mini:nth-child(2)'); await esperar(150);
    st = await p.evaluate(() => ({ src: document.getElementById('gal-img').getAttribute('src'), atual: [...document.querySelectorAll('#gal-minis .gal-mini')].findIndex((b) => b.classList.contains('atual')) }));
    check(/aasimar_02\.webp$/.test(st.src) && st.atual === 1, 'clicar na miniatura 2 leva à imagem 2 e a destaca');

    if (celular) {
      // arrastar o dedo no quadro (eventos de toque), como no aparelho
      const troca = async (dx) => p.evaluate((dx) => {
        const q = document.getElementById('gal-quadro');
        const r = q.getBoundingClientRect(); const y = r.top + r.height / 2; const x0 = r.left + r.width / 2;
        const t = (x) => new Touch({ identifier: 1, target: q, clientX: x, clientY: y });
        q.dispatchEvent(new TouchEvent('touchstart', { touches: [t(x0)], changedTouches: [t(x0)], bubbles: true }));
        q.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [t(x0 + dx)], bubbles: true }));
        return document.getElementById('gal-img').getAttribute('src');
      }, dx);
      let s2 = await troca(-120); check(/aasimar_03\.webp$/.test(s2), 'arrastar o dedo para a esquerda traz a próxima (2 para 3)');
      s2 = await troca(120); check(/aasimar_02\.webp$/.test(s2), 'arrastar para a direita volta (3 para 2)');
    }

    // tela cheia pelo clique na imagem grande (o #lightbox que já existia), e o Esc
    await esperar(500); // passada a janela em que o clique logo após um arrasto é ignorado
    await p.click('#gal-img'); await esperar(200);
    const tc = await p.evaluate(() => ({ lb: !document.getElementById('lightbox').hidden, src: document.getElementById('lb-img').getAttribute('src') }));
    check(tc.lb && /aasimar_02\.webp$/.test(tc.src), 'clicar na imagem grande abre a tela cheia (#lightbox) com a imagem atual');
    await p.keyboard.press('Escape'); await esperar(150);
    const aposEsc = await p.evaluate(() => ({ lb: !document.getElementById('lightbox').hidden, gal: !document.getElementById('galeria').hidden, ov: document.body.style.overflow }));
    check(!aposEsc.lb && aposEsc.gal && aposEsc.ov === 'hidden', 'o primeiro Esc fecha só a tela cheia: o carrossel continua aberto e a página, travada');
    await p.screenshot({ path: path.join(SHOTS, `galeria-${rotulo}-carrossel.png`) });
    await p.keyboard.press('Escape'); await esperar(150);
    const fim = await p.evaluate(() => ({ gal: !document.getElementById('galeria').hidden, ov: document.body.style.overflow }));
    check(!fim.gal && fim.ov === '', 'o segundo Esc fecha o carrossel e destrava a página');

    // a série grande: 10 imagens, só 8 no carrossel, "Ver todas as 10 imagens" e a grade
    let achou = false;
    for (let k = 0; k < 25 && !achou; k++) { achou = await p.evaluate(() => !!document.getElementById('ninfa')); if (!achou) { await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await esperar(300); } }
    check(achou, 'a ninfa (10 imagens) está na página');
    await p.evaluate(() => document.getElementById('ninfa').scrollIntoView({ block: 'center' })); await esperar(300);
    await p.evaluate(() => document.querySelector('#ninfa .arte .arte-lupa').click()); // a lupa da ninfa await p.waitForSelector('#galeria:not([hidden])', { timeout: 5000 }); await esperar(300);
    const serie = await p.evaluate(() => ({ minis: document.querySelectorAll('#gal-minis .gal-mini').length, cont: document.getElementById('gal-cont').textContent,
      todas: document.getElementById('gal-todas').hidden ? '' : document.getElementById('gal-todas').textContent, rolagem: document.getElementById('gal-minis').scrollWidth > document.getElementById('gal-minis').clientWidth || document.getElementById('gal-minis').scrollHeight > document.getElementById('gal-minis').clientHeight }));
    check(serie.minis === 8 && serie.cont === '1 de 8', 'a ninfa mostra só as 8 primeiras no carrossel');
    check(serie.todas === 'Ver todas as 10 imagens', 'o botão diz "Ver todas as 10 imagens"');
    if (celular) check(serie.rolagem, 'no celular a fileira de miniaturas rola para o lado');
    await p.click('#gal-todas'); await esperar(300);
    const grade = await p.evaluate(() => ({ celulas: document.querySelectorAll('#gal-grade .gal-celula').length, gradeVisivel: !document.getElementById('gal-grade').hidden, carrosselOculto: document.getElementById('gal-corpo').hidden, voltar: !document.getElementById('gal-voltar').hidden }));
    check(grade.celulas === 10 && grade.gradeVisivel && grade.carrosselOculto && grade.voltar, 'a galeria mostra as 10 miniaturas em grade, com "Voltar ao carrossel"');
    await p.screenshot({ path: path.join(SHOTS, `galeria-${rotulo}-grade.png`) });
    await p.click('#gal-grade .gal-celula:nth-child(10)'); await esperar(200);
    const g10 = await p.evaluate(() => ({ lb: !document.getElementById('lightbox').hidden, src: document.getElementById('lb-img').getAttribute('src') }));
    check(g10.lb && /ninfa_10\.webp$/.test(g10.src), 'clicar numa miniatura da grade abre a tela cheia daquela imagem (a 10)');
    await p.keyboard.press('Escape'); await esperar(150);
    await p.click('#gal-voltar'); await esperar(150);
    const volta = await p.evaluate(() => ({ corpo: !document.getElementById('gal-corpo').hidden, grade: document.getElementById('gal-grade').hidden }));
    check(volta.corpo && volta.grade, '"Voltar ao carrossel" volta ao carrossel');
    await p.close();
  }
} catch (e) {
  console.error('✘ ' + (e?.stack || e));
  fail.push('erro: ' + (e?.message || e));
} finally {
  try { await br?.close(); } catch { /* o navegador já fechou */ }
  try { await dev?.parar?.(); } catch { /* idem */ }
  limpar();
}
console.log('\nScreenshots em _shots/galeria-*.png · ' + (fail.length ? `✘ ${fail.length} falha(s)` : '✓ all checks passed'));
process.exit(fail.length ? 1 : 0);
