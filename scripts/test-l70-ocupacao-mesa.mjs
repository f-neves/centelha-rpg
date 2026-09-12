// test-l70-ocupacao-mesa.mjs · pôr uma peça em cima de outra recusa, e diz o porquê.
//
// Pendencias.md L70 (rodada 49): a conferência de ocupação passa a morar em
// `gravarToken` (`grid.astro:2660`), o estrangulamento por onde os dois
// backends (upsert direto do mestre, RPC `jogador_mover` do jogador) gravam
// posição. Antes, `porNoMapa` conferia `ocupadoPor` e recusava CALADA (só
// `return`, sem `error`). Agora a recusa vem com `error.message`, pelo MESMO
// caminho que um erro de rede já usava, e `porNoMapa` mostra esse texto.
//
// A CENA `?cena=ocupacao` (`mesa-mock.mjs`) monta duas peças: `bq`, parada em
// `q:6,r:5` (Médio, de pé); e `mv`, que nasce só na LISTA (fora do mapa), de
// propósito: soltar um token que JÁ ESTÁ no mapa em cima de outro é lido como
// ATAQUE (`grid.astro:6761`), e esse drop nunca chegaria a `porNoMapa`. Uma
// peça que ENTRA no mapa pela lista cai direto nele.
//
//   node scripts/test-l70-ocupacao-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('L70 · ocupação, na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Arrasta a FICHA `cid` (da lista lateral, fora do mapa) até o CENTRO do hexágono `(q, r)`. */
async function arrastarDaListaParaHex(p, cid, q, r) {
  await p.evaluate(async ({ cid, q, r }) => {
    const de = document.querySelector(`.gr-ficha[data-c="${cid}"]`);
    const hex = document.querySelector(`#gr-hexes .hx[data-h="${q},${r}"]`);
    if (!de || !hex) return;
    const rd = de.getBoundingClientRect();
    const rh = hex.getBoundingClientRect();
    const fim = { x: rh.left + rh.width / 2, y: rh.top + rh.height / 2 };
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(de, 'pointerdown', rd.left + rd.width / 2, rd.top + rd.height / 2);
    em(document, 'pointermove', fim.x, fim.y);
    em(document, 'pointerup', fim.x, fim.y);
    await new Promise((x) => setTimeout(x, 300));
  }, { cid, q, r });
}

/** A posição CRUA da peça, pela leitura ao vivo do frontend (null se fora do mapa). */
const posDe = (p, id) => p.evaluate((id) => window.__ESPELHO?.posDe(id), id);

/** A última linha do registro, crua. */
const ultimaLinha = (p) => p.evaluate(() =>
  (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).slice(-1)[0]?.txt || '');

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=ocupacao&espelho=1&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await p.waitForSelector('.gr-ficha[data-c="mv"]', { timeout: 30000 });
  await espera(500);
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  const antes = await posDe(p, 'mv');
  ok(antes === null, `mv começa FORA do mapa, só na lista (${JSON.stringify(antes)})`);

  // ---------------------------------------------- 1: recusa, e diz o porquê
  console.log('\n· mv solta em cima de bq (q:6,r:5): recusa, com mensagem');
  await arrastarDaListaParaHex(p, 'mv', 6, 5);
  const abriuErro = await p.waitForFunction(
    () => document.querySelector('dialog.ui-dlg.perigo')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  ok(abriuErro, 'a caixa de erro abriu (não ficou muda)');
  let msg = '';
  if (abriuErro) {
    msg = await p.evaluate(() => document.querySelector('dialog.ui-dlg.perigo .ui-dlg-msg')?.textContent || '');
    ok(/já está ocupada/.test(msg), `a mensagem diz O PORQUÊ, não só que falhou ("${msg}")`);
    ok(/[A-Z]\d+/.test(msg), `e nomeia a casa pelo nome que a mesa fala, não por q/r crus ("${msg}")`);
    await p.evaluate(() => document.querySelector('dialog.ui-dlg.perigo .ui-dlg-ok')?.click());
    await espera(200);
  }
  const depoisDaRecusa = await posDe(p, 'mv');
  ok(depoisDaRecusa === null, `mv continua FORA do mapa (${JSON.stringify(depoisDaRecusa)})`);
  const linhaRecusa = await ultimaLinha(p);
  ok(!/mv entrou em|mv foi de/.test(linhaRecusa), `e nada foi registrado no log da recusa ("${linhaRecusa}")`);

  // -------------------------------------------- 2: controle positivo, ainda funciona
  console.log('\n· mv solta numa casa vazia (q:9,r:5): continua funcionando');
  await arrastarDaListaParaHex(p, 'mv', 9, 5);
  await espera(400);
  const depoisDoMovimento = await posDe(p, 'mv');
  ok(depoisDoMovimento?.q === 9 && depoisDoMovimento?.r === 5,
    `mv chegou no destino livre (${JSON.stringify(depoisDoMovimento)})`);
  const linhaMovimento = await ultimaLinha(p);
  ok(/mv entrou em/.test(linhaMovimento), `e o registro grava a entrada de sempre ("${linhaMovimento}")`);

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ L70 · ocupação na mesa: ${falhas.length} falha(s)`
  : '\n✓ L70 · ocupação na mesa OK · a recusa acontece, diz o porquê, e uma casa livre continua funcionando');
if (!falhas.length) carimbar('test-l70-ocupacao-mesa');
process.exit(falhas.length ? 1 : 0);
