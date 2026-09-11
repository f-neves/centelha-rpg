// test-l68-foradavez-mesa.mjs · arrastar peça fora da vez, nas quatro fases.
//
// Pendencias.md L68 (decidido em 10/09/2026): arrastar uma peça que não está
// na vez dela para de gravar `mover` em silêncio e pergunta qual das duas é,
// CORRIGIR POSIÇÃO (sem custo, verbo "corrigiu") ou AGIR FORA DO TURNO (roteia
// para `foraDeHora`, que já sabe responder nas quatro fases). O gatilho é a
// VEZ (`grupoDaVez`), não a fase; a fase só decide como AGIR FORA DO TURNO se
// comporta uma vez que a caixa já abriu.
//
// A cena `?cena=foradavez` (`mesa-mock.mjs`) fixa `encontros.tick_atual` em
// 10 e monta cinco peças, uma por resposta esperada: `ok` está na vez (a
// regressão: arrasto continua silencioso); `lv`/`pp`/`gp`/`rc` não estão,
// cada uma numa fase (livre/preparo/golpe/recuperação).
//
//   node scripts/test-l68-foradavez-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('L68 · fora da vez, na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Arrasta o token `cid` até o CENTRO do hexágono `(q, r)`, pelo `data-h`. */
async function arrastarParaHex(p, cid, q, r) {
  await p.evaluate(async ({ cid, q, r }) => {
    const de = document.querySelector(`.gr-token[data-c="${cid}"]`);
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

/** A última linha do registro, crua. */
const ultimaLinha = (p) => p.evaluate(() =>
  (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).slice(-1)[0]?.txt || '');

/**
 * As últimas `n` linhas juntas: `cobrarDeslocamento` pode logar DEPOIS do
 * próprio `porNoMapa` (a peça em Recuperação também paga o deslocamento), e
 * aí a linha do MOVIMENTO deixa de ser a última.
 */
const ultimasLinhas = (p, n = 3) => p.evaluate((n) =>
  (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).slice(-n).map((l) => l.txt || '').join(' | '), n);

/**
 * A posição CRUA da peça, pela leitura ao vivo do frontend
 * (`window.__ESPELHO.posDe`), e não pela tabela `arena_tokens` do mock: ela é
 * só cauda de eventos (`guardar` empilha, nunca substitui), então `.find()`
 * nela acha a linha de NASCENÇA, não a mais recente.
 */
const posDe = (p, id) => p.evaluate((id) => window.__ESPELHO?.posDe(id), id);

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=foradavez&espelho=1&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(500);
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  // -------------------------------------------------------- 1: ok, na vez
  console.log('\n· ok (na vez): o arrasto continua silencioso, como sempre');
  await arrastarParaHex(p, 'ok', 3, 5);
  const abriuOk = await p.evaluate(() => document.getElementById('fdv-dlg')?.open === true);
  ok(!abriuOk, 'a caixa NÃO abre para quem está na vez');
  const posOk = await posDe(p, 'ok');
  ok(posOk?.q === 3 && posOk?.r === 5, `ok chegou no destino sem pergunta (${JSON.stringify(posOk)})`);
  const linhasOk = await ultimasLinhas(p);
  ok(/foi de .* para/.test(linhasOk) && !/corrigiu|fora do turno/.test(linhasOk),
    `o registro continua no verbo de sempre, "foi de ... para ..." ("${linhasOk}")`);

  // -------------------------------------------------------- 2: lv, livre
  console.log('\n· lv (fora da vez, livre): as duas opções aparecem, e nenhuma cobra');
  await arrastarParaHex(p, 'lv', 7, 5);
  const abriuLv = await p.waitForFunction(
    () => document.getElementById('fdv-dlg')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  ok(abriuLv, 'a caixa abre para quem não está na vez');
  if (abriuLv) {
    const estado = await p.evaluate(() => ({
      foraEscondido: document.getElementById('fdv-forahora')?.hidden,
      nota: document.getElementById('fdv-nota')?.textContent || '',
    }));
    ok(!estado.foraEscondido, 'AGIR FORA DO TURNO aparece em livre (as duas opções, decisão do Arquiteto)');
    ok(/não paga nada/.test(estado.nota),
      `e a nota é a frase do PRÓPRIO foraDeHora, não escrita à mão ("${estado.nota}")`);
    await p.evaluate(() => document.getElementById('fdv-corrigir')?.click());
    await espera(300);
    const linhaCorrigir = await ultimaLinha(p);
    ok(/corrigiu a posição.*sem custo/.test(linhaCorrigir),
      `CORRIGIR POSIÇÃO grava "corrigiu ... (sem custo)" ("${linhaCorrigir}")`);
  }
  // Arrasta de novo (ainda fora da vez: `lv` continua livre, tick 12 > 10),
  // desta vez escolhendo AGIR FORA DO TURNO.
  await arrastarParaHex(p, 'lv', 7, 6);
  const abriuLv2 = await p.waitForFunction(
    () => document.getElementById('fdv-dlg')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  if (abriuLv2) {
    await p.evaluate(() => document.getElementById('fdv-forahora')?.click());
    await espera(300);
    const linhaForaHora = await ultimaLinha(p);
    ok(/agiu fora do turno e foi de/.test(linhaForaHora),
      `AGIR FORA DO TURNO em livre grava o verbo próprio, sem custo ("${linhaForaHora}")`);
  }

  // -------------------------------------------------------- 3: pp, preparo
  console.log('\n· pp (fora da vez, preparo): só CORRIGIR POSIÇÃO, o motor manda abortar');
  await arrastarParaHex(p, 'pp', 11, 5);
  const abriuPp = await p.waitForFunction(
    () => document.getElementById('fdv-dlg')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  ok(abriuPp, 'a caixa abriu para pp');
  if (abriuPp) {
    const estado = await p.evaluate(() => ({
      foraEscondido: document.getElementById('fdv-forahora')?.hidden,
      nota: document.getElementById('fdv-nota')?.textContent || '',
    }));
    ok(!!estado.foraEscondido, 'AGIR FORA DO TURNO some em preparo');
    ok(/abortar/.test(estado.nota), `e a nota explica com a frase do motor ("${estado.nota}")`);
    await p.evaluate(() => document.getElementById('fdv-corrigir')?.click());
    await espera(300);
    ok(/corrigiu a posição/.test(await ultimaLinha(p)), 'CORRIGIR POSIÇÃO continua valendo em preparo');
  }

  // -------------------------------------------------------- 4: gp, golpe
  console.log('\n· gp (fora da vez, golpe): só CORRIGIR POSIÇÃO, "não se interrompe"');
  await arrastarParaHex(p, 'gp', 3, 9);
  const abriuGp = await p.waitForFunction(
    () => document.getElementById('fdv-dlg')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  ok(abriuGp, 'a caixa abriu para gp');
  if (abriuGp) {
    const estado = await p.evaluate(() => ({
      foraEscondido: document.getElementById('fdv-forahora')?.hidden,
      nota: document.getElementById('fdv-nota')?.textContent || '',
    }));
    ok(!!estado.foraEscondido, 'AGIR FORA DO TURNO some no golpe');
    ok(/não se interrompe/.test(estado.nota), `e a nota diz "não se interrompe" ("${estado.nota}")`);
    await p.evaluate(() => document.getElementById('fdv-corrigir')?.click());
    await espera(300);
    ok(/corrigiu a posição/.test(await ultimaLinha(p)), 'CORRIGIR POSIÇÃO continua valendo no golpe');
  }

  // ----------------------------------------------------- 5: rc, recuperação
  console.log('\n· rc (fora da vez, recuperação): AGIR FORA DO TURNO cobra de verdade');
  const acaoAntes = await p.evaluate(() =>
    JSON.parse(JSON.stringify((window.__SB?.tabelas?.combatentes || []).find((c) => c.id === 'rc')?.acao)));
  await arrastarParaHex(p, 'rc', 7, 9);
  const abriuRc = await p.waitForFunction(
    () => document.getElementById('fdv-dlg')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  ok(abriuRc, 'a caixa abriu para rc');
  if (abriuRc) {
    const foraEscondido = await p.evaluate(() => document.getElementById('fdv-forahora')?.hidden);
    ok(!foraEscondido, 'AGIR FORA DO TURNO aparece na recuperação');
    await p.evaluate(() => document.getElementById('fdv-forahora')?.click());
    // Roteou para o mecanismo que já existe: a caixa da dívida de verdade
    // (`abrirForaDeHora`, `#fh-ok`), não um atalho novo.
    const abriuDivida = await p.waitForFunction(
      () => document.getElementById('fh-ok'), { timeout: 5000 },
    ).then(() => true).catch(() => false);
    ok(abriuDivida, 'AGIR FORA DO TURNO abre a caixa da dívida de verdade (#fh-ok), não um atalho');
    if (abriuDivida) {
      await p.evaluate(() => document.getElementById('fh-ok')?.click());
      await espera(900);
      const acaoDepois = await p.evaluate(() =>
        JSON.parse(JSON.stringify((window.__SB?.tabelas?.combatentes || []).find((c) => c.id === 'rc')?.acao)));
      ok((acaoDepois?.divida || 0) > 0,
        `a dívida foi gravada de verdade (${acaoAntes?.divida || 0} → ${acaoDepois?.divida || 0})`);
      const posRc = await posDe(p, 'rc');
      ok(posRc?.q === 7 && posRc?.r === 9, `e o token TAMBÉM pousou no destino (${JSON.stringify(posRc)})`);
    }
  }

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ L68 · fora da vez na mesa: ${falhas.length} falha(s)`
  : '\n✓ L68 · fora da vez na mesa OK · quem está na vez continua silencioso, e quem não está'
    + ' pergunta CORRIGIR ou AGIR FORA DO TURNO, com a resposta certa nas quatro fases');
if (!falhas.length) carimbar('test-l68-foradavez-mesa');
process.exit(falhas.length ? 1 : 0);
