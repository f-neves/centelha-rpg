// test-bestiario-mesa-botao.mjs · o botão "Adicionar à mesa" funciona em TODOS os cards do /bestiario, e não só nos 40 primeiros (090).
//
//   node scripts/test-bestiario-mesa-botao.mjs
//
// A página nasce com 40 fichas; as outras vêm dentro de <template> e entram no DOM aos poucos (montarFatia). O clique do botão
// era ligado uma vez só, em cada `.besta-mesa` que existia na hora, e os cards montados depois ficavam sem ele. A correção é um
// ouvinte só na lista (delegação), como os outros cliques da página. Aqui: espera a página montar todas as fichas, pega um card
// que NÃO estava entre os 40 iniciais, clica no botão dele e confere que abre um diálogo (sem conta e sem banco, é o aviso
// "Sem mesas" ou "Precisa entrar"). A rede do Supabase é recusada, e nada é gravado em lugar nenhum.
// Sem navegador: pula (no CI, SMOKE_EXIGE_NAVEGADOR=1 faz da falta uma falha).
import puppeteer from 'puppeteer-core';
import { subirDev } from './dev-server.mjs';
import { navegadorOuSair, abrirNavegador } from './navegador.mjs';

const EDGE = navegadorOuSair('botão Adicionar à mesa do bestiário');
const fail = [];
const check = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✘ ') + msg); if (!cond) fail.push(msg); };
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
let dev = null, br = null;
try {
  dev = await subirDev();
  br = await abrirNavegador(puppeteer, { executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
  const p = await br.newPage();
  await p.setViewport({ width: 1280, height: 1000 });
  await p.setRequestInterception(true);
  p.on('request', (r) => { if (/supabase\.co/.test(r.url())) r.abort(); else r.continue(); });
  p.on('pageerror', (e) => console.log('  ! erro na página: ' + e.message));
  await p.goto(dev.url + '/bestiario', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await p.waitForSelector('.besta', { timeout: 90000 });
  // os cards ADIADOS, pelo HTML que o servidor manda (os que nascem dentro de <template class="besta-adiada">), e os iniciais (os outros)
  const html = await (await fetch(dev.url + '/bestiario')).text();
  const adiadas = [...html.matchAll(/<template[^>]*besta-adiada[^>]*>\s*<article[^>]*?\bid="([^"]+)"/g)].map((m) => m[1]);
  const todasIds = [...html.matchAll(/<article[^>]*?class="besta"[^>]*?\bid="([^"]+)"/g)].map((m) => m[1]);
  const iniciais = todasIds.filter((i) => !adiadas.includes(i));
  console.log(`• no HTML: ${iniciais.length} cards iniciais e ${adiadas.length} adiados`);
  check(iniciais.length === 40 && adiadas.length > 200, `a página nasce com 40 cards e o resto vem adiado (${iniciais.length} e ${adiadas.length})`);
  // espera todos os <template> virarem card
  let restam = -1;
  for (let i = 0; i < 240; i++) {
    restam = await p.evaluate(() => document.querySelectorAll('template.besta-adiada').length);
    if (restam === 0) break;
    await esperar(500);
  }
  const total = await p.evaluate(() => new Set([...document.querySelectorAll('.besta')].map((c) => c.id)).size);
  check(restam === 0 && total > 300, `a página montou todas as fichas (${total} cards, ${restam} adiadas sobrando)`);
  const alvo = await p.evaluate((ad) => ad.slice().reverse().find((i) => document.getElementById(i)?.querySelector('.besta-mesa')) || null, adiadas);
  check(!!alvo, `há um card adiado, montado depois, com o botão "Adicionar à mesa" (${alvo}, o último da lista)`);
  const abre = async (id) => {
    await p.evaluate(() => document.querySelectorAll('dialog[open]').forEach((d) => d.close()));
    const antes = await p.evaluate(() => document.querySelectorAll('dialog[open]').length);
    await p.evaluate((i) => document.getElementById(i).querySelector('.besta-mesa').click(), id);
    for (let k = 0; k < 40; k++) {
      await esperar(250);
      if ((await p.evaluate(() => document.querySelectorAll('dialog[open]').length)) > antes) return true;
    }
    return false;
  };
  // um dos 40 iniciais (sempre funcionou) e um dos montados depois (o defeito)
  const inicial = iniciais[0];
  check(await abre(inicial), `o botão de um dos 40 primeiros (${inicial}) abre o diálogo`);
  check(await abre(alvo), `o botão de um card montado depois (${alvo}) também abre o diálogo`);
} catch (e) {
  console.error('✘ ' + (e?.stack || e));
  fail.push('erro: ' + (e?.message || e));
} finally {
  try { await br?.close(); } catch { /* o navegador já fechou */ }
  try { await dev?.parar?.(); } catch { /* idem */ }
}
console.log(fail.length ? `✘ test-bestiario-mesa-botao: ${fail.length} falha(s)` : '✓ test-bestiario-mesa-botao · o Adicionar à mesa abre o diálogo nos 40 primeiros cards e nos montados depois');
process.exit(fail.length ? 1 : 0);
