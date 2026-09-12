// test-l84-levantar-mesa.mjs · caído levanta: sozinho no lugar, dividindo vai
// para o lado, sem hexágono livre recusa com o motivo.
//
// Pendencias.md L84 (rodada 50, decisão do humano em 12/09/2026): a peça
// `caido` que decide ficar de pé, dividindo o hexágono com outra peça, se
// desloca para um hexágono ADJACENTE LIVRE (`levantarDoChao`, `grid.astro`,
// logo depois de `porNoMapa`). SEM hexágono livre, ela recusa com o motivo,
// SEM inventar rolagem nenhuma: a metade que falta, ficar de pé NO MESMO
// hexágono por disputa de (Força ou Destreza) + Briga, é `Pendencias.md` L83,
// ainda sem decisão.
//
// A CENA `?cena=levantar` (`mesa-mock.mjs`) monta três casos, cada um com o
// vizinho contado por `vizinhos()` (a mesma função que `levantarDoChao` usa,
// não um hexágono escrito à mão):
//
//   `pe`         · caído SOZINHO: levanta no lugar.
//   `pa` + `pb`  · dividem, com UM vizinho livre: levanta indo para ele.
//   `pc` + `pd`  · dividem, com os SEIS vizinhos tomados: levanta recusa.
//
//   node scripts/test-l84-levantar-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('L84 · levantar, na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Abre o menu de contexto do token `cid` e clica o botão `acao` (`data-a`). */
async function clicarMenu(p, cid, acao) {
  return p.evaluate(async ({ cid, acao }) => {
    const tk = document.querySelector(`#gr-tokens .gr-token[data-c="${cid}"]`);
    if (!tk) return { abriu: false };
    const r = tk.getBoundingClientRect();
    tk.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }));
    await new Promise((res) => setTimeout(res, 300));
    const b = document.querySelector(`#tok-menu button[data-a="${acao}"]`);
    if (!b) return { abriu: true, achou: false };
    b.click();
    await new Promise((res) => setTimeout(res, 400));
    return { abriu: true, achou: true };
  }, { cid, acao });
}

/** As condições cruas de uma peça. */
const condicoesDe = (p, cid) => p.evaluate((cid) => {
  const c = (window.__SB?.tabelas?.combatentes || []).find((x) => x.id === cid);
  return (c?.condicoes || []).map((k) => k.id);
}, cid);

const posDe = (p, id) => p.evaluate((id) => window.__ESPELHO?.posDe(id), id);
const tickDe = (p, id) => p.evaluate((id) => window.__ESPELHO?.acaoDe(id)?.tick, id);
const distHex = (p, a, b) => p.evaluate(({ a, b }) => window.__ESPELHO?.distHex(a, b), { a, b });
const ultimaLinha = (p) => p.evaluate(() =>
  (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).slice(-1)[0]?.txt || '');

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=levantar&espelho=1&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(500);
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  // ---------------------------------------------- 1: sozinho, levanta no lugar
  console.log('\n· pe (sozinho): levanta sem se deslocar');
  const posPeAntes = await posDe(p, 'pe');
  const tickPeAntes = await tickDe(p, 'pe');
  const cliquePe = await clicarMenu(p, 'pe', 'levantar');
  ok(cliquePe.abriu && cliquePe.achou, `o menu abriu e achou "Levantar" em pe (${JSON.stringify(cliquePe)})`);
  const condPeDepois = await condicoesDe(p, 'pe');
  ok(!condPeDepois.includes('caido'), `pe perdeu a condição caido (${condPeDepois.join(', ') || 'nenhuma'})`);
  const posPeDepois = await posDe(p, 'pe');
  ok(JSON.stringify(posPeDepois) === JSON.stringify(posPeAntes),
    `e NÃO se deslocou: mesma casa (${JSON.stringify(posPeAntes)} → ${JSON.stringify(posPeDepois)})`);
  const tickPeDepois = await tickDe(p, 'pe');
  ok(tickPeDepois === tickPeAntes, `sem custo de Tick (${tickPeAntes} → ${tickPeDepois})`);

  // ---------------------------------------- 2: dividindo, um vizinho livre
  console.log('\n· pa (divide com pb, um vizinho livre): levanta indo para o lado');
  const posPaAntes = await posDe(p, 'pa');
  const cliquePa = await clicarMenu(p, 'pa', 'levantar');
  ok(cliquePa.abriu && cliquePa.achou, `o menu abriu e achou "Levantar" em pa (${JSON.stringify(cliquePa)})`);
  const condPaDepois = await condicoesDe(p, 'pa');
  ok(!condPaDepois.includes('caido'), `pa perdeu a condição caido (${condPaDepois.join(', ') || 'nenhuma'})`);
  const posPaDepois = await posDe(p, 'pa');
  ok(JSON.stringify(posPaDepois) !== JSON.stringify(posPaAntes),
    `e SE DESLOCOU (${JSON.stringify(posPaAntes)} → ${JSON.stringify(posPaDepois)})`);
  const dist = await distHex(p, posPaAntes, posPaDepois);
  ok(dist === 1, `para uma casa ADJACENTE, e não qualquer uma (distância ${dist})`);
  const linhaPa = await ultimaLinha(p);
  ok(/pa foi de .* para/.test(linhaPa),
    `pelo mesmo verbo do movimento comum, porque é a mesma porNoMapa ("${linhaPa}")`);

  // ------------------------------------- 3: dividindo, sem vizinho livre
  console.log('\n· pc (divide com pd, os seis vizinhos tomados): levanta RECUSA');
  const posPcAntes = await posDe(p, 'pc');
  const condPcAntes = await condicoesDe(p, 'pc');
  const cliquePc = await clicarMenu(p, 'pc', 'levantar');
  ok(cliquePc.abriu && cliquePc.achou, `o menu abriu e achou "Levantar" em pc (${JSON.stringify(cliquePc)})`);
  const abriuErro = await p.waitForFunction(
    () => document.querySelector('dialog.ui-dlg.perigo')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  ok(abriuErro, 'a caixa de erro abriu, com o motivo (não recusou calada)');
  if (abriuErro) {
    const msg = await p.evaluate(() => document.querySelector('dialog.ui-dlg.perigo .ui-dlg-msg')?.textContent || '');
    ok(/hex.{0,10}gono livre/.test(msg) || /n[aã]o tem hex/i.test(msg),
      `a mensagem diz que não há hexágono livre ("${msg}")`);
    await p.evaluate(() => document.querySelector('dialog.ui-dlg.perigo .ui-dlg-ok')?.click());
    await espera(200);
  }
  const condPcDepois = await condicoesDe(p, 'pc');
  ok(condPcDepois.includes('caido'), `e pc CONTINUA caído: a recusa não tira a condição (${condPcDepois.join(', ')})`);
  const posPcDepois = await posDe(p, 'pc');
  ok(JSON.stringify(posPcDepois) === JSON.stringify(posPcAntes),
    `e não se deslocou (${JSON.stringify(posPcAntes)} → ${JSON.stringify(posPcDepois)})`);
  ok(JSON.stringify(condPcAntes) === JSON.stringify(condPcDepois), 'condições de pc inalteradas ponta a ponta');

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ L84 · levantar, na mesa: ${falhas.length} falha(s)`
  : '\n✓ L84 · levantar OK · sozinho no lugar, dividindo vai para o lado, sem hexágono livre recusa com o motivo');
if (!falhas.length) carimbar('test-l84-levantar-mesa');
process.exit(falhas.length ? 1 : 0);
