// test-l84-caidofila-mesa.mjs · caído fica na fila, e não leva o atraso de acordar.
//
// Pendencias.md L84 (rodada 50): `caido` sai do balde `FORA_DA_FILA` (a peça
// está prona mas continua lutando). O achado do Arquiteto que este arquivo
// prova: cinco Artes de `grid.forma: movimento` (`src/data/efeitos.json`,
// Empurrão entre elas) aplicam `caido` ao alvo, sem depender de colisão
// nenhuma. Antes desta rodada, `caido` estava dentro do balde que tirava a
// peça da fila e cobrava `DELAY_AO_LEVANTAR` (5 Ticks) quando ela "voltava":
// ou seja, as cinco Artes eram, sem ninguém desenhar isso, um atordoamento de
// 5 Ticks disfarçado de empurrão. Depois desta rodada, não são mais.
//
// A CENA `?cena=caidofila` (`mesa-mock.mjs`) monta duas peças de pé, sem
// condição: `x0` (o positivo, leva `caido`) e `x1` (o controle negativo, leva
// `inconsciente` (essa SIM tem de sair da fila, para provar que a peneira
// ainda discrimina).
//
//   node scripts/test-l84-caidofila-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('L84 · caído na fila, na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Abre o diálogo de condições de `cid` pelo menu de contexto do token, e clica o chip `nomeCond`. */
async function porCondicao(p, cid, nomeCond) {
  return p.evaluate(async ({ cid, nomeCond }) => {
    const tk = document.querySelector(`#gr-tokens .gr-token[data-c="${cid}"]`);
    if (!tk) return { abriu: false };
    const r = tk.getBoundingClientRect();
    tk.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }));
    await new Promise((res) => setTimeout(res, 300));
    const b = document.querySelector('#tok-menu button[data-a="condicoes"]');
    if (!b) return { abriu: false };
    b.click();
    await new Promise((res) => setTimeout(res, 400));
    const dlg = document.getElementById('cond-dlg');
    if (!dlg?.open) return { abriu: false };
    const busca = document.getElementById('cond-busca');
    busca.value = nomeCond;
    busca.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((res) => setTimeout(res, 200));
    const chip = [...document.querySelectorAll('#cond-catalogo .cond')]
      .find((x) => (x.querySelector('.cond-n')?.textContent || '') === nomeCond);
    if (!chip) return { abriu: true, achou: false };
    chip.click();
    await new Promise((res) => setTimeout(res, 400));
    document.getElementById('cond-fechar')?.click();
    return { abriu: true, achou: true };
  }, { cid, nomeCond });
}

/** As condições cruas de uma peça, como o banco as tem. */
const condicoesDe = (p, cid) => p.evaluate((cid) => {
  const c = (window.__SB?.tabelas?.combatentes || []).find((x) => x.id === cid);
  return (c?.condicoes || []).map((k) => k.id);
}, cid);

/**
 * Quem o espelho de motor diz que está na luta (não saiu da fila).
 *
 * O `?? dePe` é só para o CONTROLE NEGATIVO deste arquivo (rodar contra o
 * código de ANTES do L84, por `git stash`): a função se chamava `dePe` até
 * esta rodada renomear. Contra o código de hoje, `naLuta` sempre existe e o
 * `dePe` nunca é chamado.
 */
const naLuta = (p) => p.evaluate(() => window.__ESPELHO?.naLuta?.() ?? window.__ESPELHO?.dePe?.());

/** O tick cru de uma peça, pelo diagnóstico do espelho. */
const tickDe = (p, cid) => p.evaluate((cid) => window.__ESPELHO?.acaoDe(cid)?.tick, cid);

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=caidofila&espelho=1&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(500);
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  const antes = await naLuta(p);
  ok(antes?.includes('x0') && antes?.includes('x1'), `as duas começam na luta (${JSON.stringify(antes)})`);
  const tickX0Antes = await tickDe(p, 'x0');

  // ------------------------------------- 1: o positivo, caído continua na fila
  console.log('\n· x0 leva Caído: continua na luta, sem o atraso de acordar');
  const postoCaido = await porCondicao(p, 'x0', 'Caído');
  ok(postoCaido.abriu && postoCaido.achou, `o diálogo abriu e achou o chip Caído (${JSON.stringify(postoCaido)})`);
  const condX0 = await condicoesDe(p, 'x0');
  ok(condX0.includes('caido'), `x0 ficou com a condição caido (${condX0.join(', ') || 'nenhuma'})`);
  const naLutaComCaido = await naLuta(p);
  ok(naLutaComCaido.includes('x0'), `x0 CONTINUA na luta depois de Caído (${JSON.stringify(naLutaComCaido)})`);
  const tickX0Depois = await tickDe(p, 'x0');
  ok(tickX0Depois === tickX0Antes,
    `e o tick de x0 não mudou: sem atraso de acordar cobrado (${tickX0Antes} → ${tickX0Depois})`);
  const linhaAcordou = await p.evaluate(() => (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || [])
    .some((l) => /x0.*volta a agir/.test(l.txt || '')));
  ok(!linhaAcordou, 'e nenhuma linha de "volta a agir" foi escrita para x0');

  // ---------------------------------- 2: o controle negativo, inconsciente sai
  console.log('\n· x1 leva Inconsciente: SAI da luta (a peneira ainda discrimina)');
  const postoIncons = await porCondicao(p, 'x1', 'Inconsciente');
  ok(postoIncons.abriu && postoIncons.achou,
    `o diálogo abriu e achou o chip Inconsciente (${JSON.stringify(postoIncons)})`);
  const condX1 = await condicoesDe(p, 'x1');
  ok(condX1.includes('inconsciente'), `x1 ficou com a condição inconsciente (${condX1.join(', ') || 'nenhuma'})`);
  const naLutaComInconsciente = await naLuta(p);
  ok(!naLutaComInconsciente.includes('x1'),
    `x1 SAIU da luta (${JSON.stringify(naLutaComInconsciente)})`);
  ok(naLutaComInconsciente.includes('x0'),
    'e x0 (caído) continua lá, sem ser arrastado pela conferência de x1');

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ L84 · caído na fila, na mesa: ${falhas.length} falha(s)`
  : '\n✓ L84 · caído na fila OK · Caído fica na luta sem atraso de acordar, e Inconsciente ainda sai como antes');
if (!falhas.length) carimbar('test-l84-caidofila-mesa');
process.exit(falhas.length ? 1 : 0);
