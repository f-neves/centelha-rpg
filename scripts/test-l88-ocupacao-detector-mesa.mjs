// test-l88-ocupacao-detector-mesa.mjs · o mestre confere o RESULTADO, não só a escrita.
//
// Pendencias.md L88 (rodada 52): `conferirOcupacao` (`grid.astro`), a
// resposta a três caminhos que produzem o mesmo estado ilegal (dois corpos
// que não podem dividir, dividindo) sem precisar conhecer nenhum deles: a
// corrida entre clientes do L70, o retorno PASSIVO do L84 (curar alguém
// debaixo de uma peça de pé) e os dois caminhos que ainda escrevem em
// `combatentes` por fora do `gravarPeca` do L87.
//
// A CENA `?cena=ocupacaodetector` (`mesa-mock.mjs`) monta dois casos:
//
//   `pa` (PV 0, sem condição) + `pb` (de pé): dividem um hexágono, LEGAL
//     hoje porque `podeDividir` perdoa por `pa` estar no chão pela Vida.
//     Curar `pa` fecha a desculpa sem deslocar ninguém: o POSITIVO.
//   `mv` (só na lista) arrastada para cima de `bq`: `gravarToken` recusa
//     (L70), mas passa por um instante otimista em que `TOKENS` tem os dois
//     no mesmo lugar antes do desfazer. O NEGATIVO do "caso que treme".
//
//   node scripts/test-l88-ocupacao-detector-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('L88 · detector de ocupação, na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** As linhas cruas do registro. */
const linhasDoLog = (p) => p.evaluate(() => (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).map((l) => l.txt));

/** Abre "Recuperar Vida" pelo menu de contexto do token `cid`, digita `quanto` e confirma. */
async function curarPeloMenu(p, cid, quanto) {
  return p.evaluate(async ({ cid, quanto }) => {
    const tk = document.querySelector(`#gr-tokens .gr-token[data-c="${cid}"]`);
    if (!tk) return { abriu: false };
    const r = tk.getBoundingClientRect();
    tk.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }));
    await new Promise((res) => setTimeout(res, 300));
    const b = document.querySelector('#tok-menu button[data-a="curar"]');
    if (!b) return { abriu: false };
    b.click();
    await new Promise((res) => setTimeout(res, 300));
    const dlg = document.querySelector('dialog.ui-dlg[open]');
    if (!dlg) return { abriu: false };
    const campo = dlg.querySelector('[name="q"]');
    if (!campo) return { abriu: true, achouCampo: false };
    campo.value = String(quanto);
    dlg.querySelector('.ui-dlg-ok')?.click();
    await new Promise((res) => setTimeout(res, 300));
    return { abriu: true, achouCampo: true };
  }, { cid, quanto });
}

/** Abre "◈ Condições" pelo menu de contexto do token `cid`. Devolve `false` se não abriu. */
async function abrirCondicoesPeloMenu(p, cid) {
  return p.evaluate(async (cid) => {
    const tk = document.querySelector(`#gr-tokens .gr-token[data-c="${cid}"]`);
    if (!tk) return false;
    const r = tk.getBoundingClientRect();
    tk.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }));
    await new Promise((res) => setTimeout(res, 300));
    const b = document.querySelector('#tok-menu button[data-a="condicoes"]');
    if (!b) return false;
    b.click();
    await new Promise((res) => setTimeout(res, 300));
    return document.getElementById('cond-dlg')?.open === true;
  }, cid);
}

/** Com o diálogo de condições já aberto, filtra pelo nome e clica o chip do catálogo. */
async function porCondicaoNoDialogoAberto(p, nomeCond) {
  return p.evaluate(async (nomeCond) => {
    const busca = document.getElementById('cond-busca');
    if (!busca) return false;
    busca.value = nomeCond;
    busca.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((res) => setTimeout(res, 200));
    const chip = [...document.querySelectorAll('#cond-catalogo .cond')]
      .find((x) => (x.querySelector('.cond-n')?.textContent || '') === nomeCond);
    if (!chip) return false;
    chip.click();
    await new Promise((res) => setTimeout(res, 300));
    return true;
  }, nomeCond);
}

/** Com o diálogo de condições já aberto, tira `id` (o `data-cond` do ✕) das ativas. */
async function tirarCondicaoNoDialogoAberto(p, id) {
  return p.evaluate(async (id) => {
    const btn = document.querySelector(`#cond-ativas .cond-x[data-cond="${id}"]`);
    if (!btn) return false;
    btn.click();
    await new Promise((res) => setTimeout(res, 300));
    return true;
  }, id);
}

/** Fecha o diálogo de condições já aberto ("Pronto"). */
async function fecharDialogoCondicoes(p) {
  await p.evaluate(() => document.getElementById('cond-fechar')?.click());
}

/** Arrasta a FICHA `cid` (da lista lateral) até o CENTRO do hexágono `(q, r)`. */
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
  }, { cid, q, r });
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=ocupacaodetector&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(500);
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  // -------------------------------- 1: dividir por estar no chão é legal
  console.log('\n· pa (PV 0) e pb dividem o hexágono: legal hoje, sem grito');
  await espera(300);   // sobra para o await de gravarPeca/gravarToken assentar
  const antesDeCurar = await linhasDoLog(p);
  ok(!antesDeCurar.some((t) => /Ocupação inválida/.test(t)),
    'nenhuma linha de ocupação inválida enquanto pa está no chão (dividir é legal)');

  // -------------------------------------- 2: o positivo, curar fecha a desculpa
  console.log('\n· curar pa: fecha a desculpa do chão, e ninguém desloca nada (L84 passivo)');
  const curou = await curarPeloMenu(p, 'pa', 15);
  ok(curou.abriu && curou.achouCampo, `o menu "Recuperar Vida" abriu e aceitou o número (${JSON.stringify(curou)})`);
  await espera(300);   // sobra para o await de gravarPeca/gravarToken assentar, para o detector confirmar
  const depoisDeCurar = await linhasDoLog(p);
  const linhaGrito = depoisDeCurar.find((t) => /Ocupação inválida/.test(t));
  ok(!!linhaGrito, `o detector gritou depois de curar (${JSON.stringify(linhaGrito || null)})`);
  ok(!!linhaGrito && /pa/.test(linhaGrito) && /pb/.test(linhaGrito),
    `e a linha nomeia os dois lados (${JSON.stringify(linhaGrito)})`);
  const gritosAteAqui = depoisDeCurar.filter((t) => /Ocupação inválida/.test(t)).length;
  ok(gritosAteAqui === 1, `uma linha só, não uma por repintura (achou ${gritosAteAqui})`);

  // ------ 2.5: CORRIGE da rodada 52 · tirar condição à mão avisa NA HORA
  //
  // O caminho que a Revisora testou ao vivo: dar "Caído" (fecha a desculpa
  // de novo, sem grito novo), curar não muda nada aqui (a Vida já subiu no
  // passo 2), e TIRAR "Caído" pela caixa reabre a mesma sobreposição. Antes
  // do `pintarIniciativa()` no `repintar` de `abrirCondicoes`, essa escrita
  // nunca chamava `conferirOcupacao`, e o detector ficava cego para
  // exatamente um dos cinco caminhos passivos que o L88 nomeia.
  console.log('\n· dar Caído fecha de novo; TIRAR Caído pela caixa reabre, e o grito é NA HORA');
  const abriu1 = await abrirCondicoesPeloMenu(p, 'pa');
  ok(abriu1, 'o diálogo de condições abriu em pa');
  const deuCaido = await porCondicaoNoDialogoAberto(p, 'Caído');
  ok(deuCaido, 'o chip "Caído" foi encontrado e clicado');
  await fecharDialogoCondicoes(p);
  await espera(200);
  const semNovoGrito = await linhasDoLog(p);
  ok(semNovoGrito.filter((t) => /Ocupação inválida/.test(t)).length === gritosAteAqui,
    'dar Caído FECHA a sobreposição de novo: nenhum grito novo');

  const abriu2 = await abrirCondicoesPeloMenu(p, 'pa');
  ok(abriu2, 'o diálogo de condições abriu em pa de novo');
  const tirouCaido = await tirarCondicaoNoDialogoAberto(p, 'caido');
  ok(tirouCaido, 'o ✕ de "Caído" foi encontrado e clicado');
  await fecharDialogoCondicoes(p);
  // SEM espera extra além da que os próprios helpers já fizeram: o ponto é
  // provar que o grito sai do MESMO gesto, não de uma repintura seguinte
  // sem relação.
  const depoisDeTirar = await linhasDoLog(p);
  const gritosNovos25 = depoisDeTirar.filter((t) => /Ocupação inválida/.test(t)).length - gritosAteAqui;
  ok(gritosNovos25 === 1,
    `tirar Caído pela caixa reabre a sobreposição e o detector grita NA HORA (achou ${gritosNovos25} nova(s))`);

  // ------------------------------------- 3: o negativo, o caso que treme
  console.log('\n· mv arrastada para cima de bq: recusada, e o instante otimista não grita');
  const antesDoArrasto = await linhasDoLog(p);
  await arrastarDaListaParaHex(p, 'mv', 6, 5);
  await p.waitForFunction(
    () => document.querySelector('dialog.ui-dlg.perigo')?.open === true, { timeout: 5000 },
  ).catch(() => {});
  await p.evaluate(() => document.querySelector('dialog.ui-dlg.perigo .ui-dlg-ok')?.click());
  await espera(300);   // sobra para o await de gravarPeca/gravarToken assentar
  const depoisDoArrasto = await linhasDoLog(p);
  const gritosNovos = depoisDoArrasto.filter((t) => /Ocupação inválida/.test(t)).length
    - antesDoArrasto.filter((t) => /Ocupação inválida/.test(t)).length;
  ok(gritosNovos === 0,
    `o instante otimista (recusado logo depois) não vira linha no registro (${gritosNovos} nova(s))`);

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ L88 · detector de ocupação, na mesa: ${falhas.length} falha(s)`
  : '\n✓ L88 · detector de ocupação OK · o retorno passivo grita depois de confirmado, e a posição pendente do instante otimista recusado não vira linha no registro');
if (!falhas.length) carimbar('test-l88-ocupacao-detector-mesa');
process.exit(falhas.length ? 1 : 0);
