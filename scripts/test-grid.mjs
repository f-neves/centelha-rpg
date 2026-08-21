// test-grid.mjs — o smoke do tabuleiro.
//
// O QUE ISTO GUARDA
// O Grid é a tela mais complexa do projeto e era a única sem teste nenhum: o que
// existia provava a MATEMÁTICA dos módulos (hex, seta, artes, golpe), não a tela.
// Aqui a aba é aberta de verdade, com um banco de mentira (scripts/mesa-mock.mjs
// pela configuração astro.bancada.mjs), e o teste confere o que a mesa faz:
// desenhar o tabuleiro, mover uma peça, escrever no registro, cobrir e descobrir
// com a névoa, e abrir o card de uma criatura.
//
// E GUARDA UMA COISA A MAIS: o CUSTO. A auditoria de agosto de 2026 mediu que
// mover uma peça reescrevia 581 KB de HTML e recriava 3.496 nós, dos quais 99%
// eram idênticos aos que já estavam na página. Depois de três etapas de conserto
// são 23 KB e 26 nós. Sem um teto escrito, essa conta volta a subir sozinha na
// primeira repintura a mais que alguém acrescentar sem perceber. Os tetos estão
// em TETOS, abaixo, com folga de mais ou menos o dobro do medido.
//
//   node scripts/test-grid.mjs            # cena de 12 peças e uma de 30
//   node scripts/test-grid.mjs --ver      # mostra os números sem cobrar os tetos
//
// Precisa de um navegador. Sem ele o teste AVISA e sai com zero, para não pintar
// de vermelho uma máquina que só não tem Edge nem Chrome instalado.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { subirDev } from './dev-server.mjs';

const VER = process.argv.includes('--ver');
const MESA = '00000000-0000-4000-8000-0000000000aa';

const NAVEGADORES = [
  process.env.EDGE, process.env.CHROME, process.env.PUPPETEER_EXECUTABLE_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const NAV = NAVEGADORES.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
if (!NAV) {
  console.log('· Grid: PULADO (nenhum navegador encontrado; defina EDGE ou CHROME)');
  process.exit(0);
}

/**
 * Os tetos por AÇÃO. Não são metas de desempenho: são cercas contra a repintura
 * total voltar sem ninguém notar. Passar deles não quer dizer "ficou lento",
 * quer dizer "alguma camada voltou a ser refeita inteira, confira se é de
 * propósito" — e aí o número aqui muda junto, num commit que diz isso.
 */
// Medido em agosto de 2026, nas duas cenas: 16 escritas, 24 KB, 26 nós. Nove das
// dezesseis são a seta do arrasto, uma por passo do ponteiro, e respondem por
// quase todos os KB; o resto do movimento custa ~2 KB.
const TETOS = {
  '12': { repinturas: 26, kb: 60, nos: 80 },
  '30': { repinturas: 26, kb: 60, nos: 80 },
};

// A sonda: conta toda escrita de innerHTML e quanto do resultado já estava lá.
const SONDA = () => {
  const D = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  const W = { on: false, reg: [] };
  window.__PINT = W;
  Object.defineProperty(Element.prototype, 'innerHTML', {
    configurable: true,
    get: D.get,
    set(v) {
      if (W.on) {
        const antes = Array.from(this.children).map((c) => c.outerHTML);
        D.set.call(this, v);
        const depois = Array.from(this.children).map((c) => c.outerHTML);
        const usados = new Set();
        let iguais = 0;
        for (const n of depois) {
          const i = antes.findIndex((a, k) => a === n && !usados.has(k));
          if (i >= 0) { usados.add(i); iguais++; }
        }
        W.reg.push({
          alvo: this.id || '.' + String(this.className || '').split(' ')[0],
          bytes: String(v).length, nos: depois.length, iguais,
        });
        return;
      }
      D.set.call(this, v);
    },
  });
};

const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

/** Peça visível para pegar, e a casa livre mais longe de todas, dentro do palco. */
const pontos = (p) => p.evaluate(() => {
  const pal = document.getElementById('gr-palco').getBoundingClientRect();
  const dentro = (b) => b.left > pal.left + 10 && b.right < pal.right - 10
    && b.top > pal.top + 10 && b.bottom < pal.bottom - 10;
  const t = [...document.querySelectorAll('#gr-tokens .gr-token')].find((z) => dentro(z.getBoundingClientRect()));
  if (!t) return null;
  const b = t.getBoundingClientRect();
  const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].map((z) => {
    const r = z.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  // O ponto tem de cair DENTRO do palco: o retângulo dos hexágonos passa por
  // baixo da coluna lateral, e soltar ali é "tirar do mapa", não "mover".
  let melhor = null;
  for (const h of document.querySelectorAll('#gr-hexes .hx')) {
    const r = h.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < pal.left + 20 || x > pal.right - 20 || y < pal.top + 20 || y > pal.bottom - 20) continue;
    if (!document.elementFromPoint(x, y)?.closest('#gr-palco')) continue;
    const d = Math.min(...toks.map((z) => Math.hypot(z.x - x, z.y - y)));
    if (!melhor || d > melhor.d) melhor = { x, y, d };
  }
  return { nome: t.title.split(' · ')[0], de: { x: b.left + b.width / 2, y: b.top + b.height / 2 }, para: melhor };
});

async function cena(br, url, { pecas, cols, rows, nevoa }) {
  const chave = String(pecas);
  console.log(`\n· cena de ${pecas} peças, ${cols}×${rows}, névoa ${nevoa ? 'ligada' : 'desligada'}`);
  const p = await br.newPage();
  await p.setViewport({ width: 1600, height: 1000 });
  await p.evaluateOnNewDocument(SONDA);
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=${pecas}&cols=${cols}&rows=${rows}&nevoa=${nevoa ? 1 : 0}`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });

  // ---------------------------------------------------------- o desenho
  const d = await p.evaluate(() => ({
    tokens: document.querySelectorAll('#gr-tokens .gr-token').length,
    hexes: document.querySelectorAll('#gr-hexes .hx').length,
    fila: document.querySelectorAll('#gr-ini .ini-item').length,
    fichas: document.querySelectorAll('#gr-lista .gr-ficha').length,
    log: document.querySelectorAll('#gr-log .lg').length,
    nevoaPoli: document.querySelectorAll('#gr-nevoa polygon').length,
    nevoaOff: document.getElementById('gr-nevoa').classList.contains('off'),
    cobertas: document.querySelectorAll('#gr-nevoa .nv-pesada, #gr-nevoa .nv-leve').length,
    // O tempo do combate (migração 27): a fita na coluna de iniciativa, e o
    // anel de Golpe nas peças que golpeiam NESTE Tick.
    fitas: document.querySelectorAll('#gr-ini .ini-fita .fita-c').length,
    golpes: document.querySelectorAll('#gr-tokens .gr-token.golpe').length,
    montando: document.querySelectorAll('#gr-tokens .gr-token.montando').length,
  }));
  ok(d.tokens === pecas, `${pecas} peças no tabuleiro (vieram ${d.tokens})`);
  ok(d.hexes === cols * rows, `${cols * rows} hexágonos desenhados (vieram ${d.hexes})`);
  ok(d.fila === pecas, `${pecas} lugares na fila de iniciativa (vieram ${d.fila})`);
  ok(d.fichas === pecas, `${pecas} retratos em "Em campo" (vieram ${d.fichas})`);
  ok(d.log > 0, `o registro tem linhas (${d.log})`);
  // A camada da névoa é FIXA: nasce com um polígono por casa e nunca é refeita.
  ok(d.nevoaPoli === cols * rows, `a névoa tem um polígono por casa (${d.nevoaPoli})`);
  ok(nevoa ? !d.nevoaOff && d.cobertas > 0 : d.nevoaOff && d.cobertas === 0,
    nevoa ? `névoa ligada cobre ${d.cobertas} casas` : 'névoa desligada não cobre nada');
  // A bancada monta a cena com uma ação no ar a cada três peças, e as três
  // fases representadas. Se a fita sumir, ou o anel deixar de acender no Tick
  // do Golpe, é aqui que aparece.
  ok(d.fitas > 0, `a fita de Ticks desenha na fila (${d.fitas} células)`);
  ok(d.golpes + d.montando > 0,
    `as peças com gesto no ar estão marcadas (${d.golpes} golpeando, ${d.montando} montando)`);

  // -------------------------------------------------- abortar o Preparo
  // O item so aparece para quem esta em Preparo: no Golpe e na Recuperacao a
  // regra se ensina pela ausencia do botao. E o clique tem de mexer no relogio.
  const abort = await p.evaluate(async () => {
    const emPreparo = [...document.querySelectorAll('#gr-tokens .gr-token.montando')];
    const noGolpe = [...document.querySelectorAll('#gr-tokens .gr-token.golpe')];
    const menu = (t) => {
      t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 400, clientY: 300 }));
      const tem = !!document.querySelector('#tok-menu button[data-a="abortar"]');
      return tem;
    };
    if (!emPreparo.length) return null;
    const temNoPreparo = menu(emPreparo[0]);
    const temNoGolpe = noGolpe.length ? menu(noGolpe[0]) : false;
    // volta ao de Preparo e aborta de verdade
    menu(emPreparo[0]);
    const cid = emPreparo[0].dataset.c;
    const tAntes = [...document.querySelectorAll('#gr-ini .ini-item')]
      .find((x) => x.dataset.c === cid)?.dataset.t;
    document.querySelector('#tok-menu button[data-a="abortar"]').click();
    await new Promise((r) => setTimeout(r, 300));
    const dlg = document.querySelector('dialog.tempo-dlg');
    if (!dlg) return { temNoPreparo, temNoGolpe, abriu: false };
    const conta = dlg.querySelector('.ab-conta')?.textContent.replace(/\s+/g, ' ').trim();
    dlg.querySelector('#ab-ok').click();
    await new Promise((r) => setTimeout(r, 600));
    const tDepois = [...document.querySelectorAll('#gr-ini .ini-item')]
      .find((x) => x.dataset.c === cid)?.dataset.t;
    return { temNoPreparo, temNoGolpe, abriu: true, conta, tAntes, tDepois,
      aindaMontando: !!document.querySelector(`.gr-token[data-c="${cid}"].montando`) };
  });
  if (abort) {
    ok(abort.temNoPreparo, 'quem esta em Preparo tem "abortar" no menu da peca');
    ok(!abort.temNoGolpe, 'quem esta no Golpe nao tem (no Golpe nao se aborta)');
    ok(abort.abriu, 'o item abre a caixa de abortar');
    ok(/perdidos/.test(abort.conta || ''), `a caixa mostra a conta (${abort.conta})`);
    ok(abort.tAntes !== abort.tDepois, `abortar mexeu no relogio dele (t${abort.tAntes} -> t${abort.tDepois})`);
    ok(!abort.aindaMontando, 'e a peca deixou de estar montando o gesto');
  }

  // ------------------------------------------ o painel "como o tempo passa"
  const tempo = await p.evaluate(async () => {
    document.getElementById('gr-tempo')?.click();
    await new Promise((r) => setTimeout(r, 250));
    const dlg = document.querySelector('dialog.tempo-dlg');
    if (!dlg) return null;
    const sis = [...dlg.querySelectorAll('input[name="tp-sis"]')].map((i) => i.value);
    const marc = [...dlg.querySelectorAll('input[name="tp-marc"]')].map((i) => i.value);
    const amostra = dlg.querySelectorAll('.tempo-am .fita-c').length;
    // Trocar para o sistema normal tem de redesenhar a amostra: no normal todo
    // Preparo vira zero, e nenhuma célula da amostra fica dourada fosca.
    const normal = dlg.querySelector('input[name="tp-sis"][value="normal"]');
    normal.checked = true; normal.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 120));
    const prepDepois = dlg.querySelectorAll('.tempo-am .fita-c.f-prep').length;
    dlg.querySelector('#tp-cancelar').click();
    // `close()` e sincrono, mas quem TIRA o no do documento e o ouvinte do
    // evento `close`, que roda na tarefa seguinte. Perguntar sem esperar acha o
    // dialogo ainda no lugar, fechado.
    await new Promise((r) => setTimeout(r, 120));
    return { sis, marc, amostra, prepDepois, fechou: !document.querySelector('dialog.tempo-dlg') };
  });
  if (tempo) {
    ok(tempo.sis.join(',') === 'normal,pgr', `o painel oferece os dois sistemas (${tempo.sis.join(', ')})`);
    ok(tempo.marc.join(',') === 'fita,numeros', `e as duas marcações (${tempo.marc.join(', ')})`);
    ok(tempo.amostra > 0, `a amostra desenha a régua de verdade (${tempo.amostra} células)`);
    ok(tempo.prepDepois === 0, `no sistema normal a amostra não tem Preparo (${tempo.prepDepois} células)`);
    ok(tempo.fechou, 'cancelar fecha o painel sem gravar');
  } else {
    ok(false, 'o painel "como o tempo passa" não abriu');
  }

  // ------------------------------------------------ mover uma peça, e o custo
  const pt = await pontos(p);
  ok(!!pt && !!pt.para, 'há peça para arrastar e casa livre para soltar');
  if (pt && pt.para) {
    // Uma volta de aquecimento antes de medir: a primeira ação de uma página
    // paga o que só acontece uma vez (compilação, filtros do SVG).
    for (const volta of ['aquece', 'mede']) {
      const q = await pontos(p);
      if (!q?.para) break;
      await p.evaluate(() => { window.__PINT.reg.length = 0; window.__PINT.on = true; window.__SB.log.length = 0; });
      await p.mouse.move(q.de.x, q.de.y);
      await p.mouse.down();
      await p.mouse.move((q.de.x + q.para.x) / 2, (q.de.y + q.para.y) / 2, { steps: 4 });
      await p.mouse.move(q.para.x, q.para.y, { steps: 4 });
      // ARRASTAR NÃO SELECIONA. Com o botão apertado em cima da peça, o
      // navegador tem dois caminhos possíveis, e sem trava ele escolhe o
      // errado: em vez de levar a peça, pinta de azul o nome dela, a fila
      // inteira e o que mais o ponteiro varrer. A leitura vem AQUI, com o botão
      // ainda em baixo, porque soltar limpa a seleção e o defeito sumiria.
      const selecao = await p.evaluate(() => (getSelection()?.toString() || '').trim());
      await p.mouse.up();
      await espera(700);
      const r = await p.evaluate(() => {
        window.__PINT.on = false;
        const reg = window.__PINT.reg;
        const por = {};
        for (const x of reg) (por[x.alvo] ||= { n: 0, kb: 0 }), por[x.alvo].n++, por[x.alvo].kb += x.bytes / 1024;
        return {
          repinturas: reg.length,
          kb: +(reg.reduce((s, x) => s + x.bytes, 0) / 1024).toFixed(1),
          nos: reg.reduce((s, x) => s + x.nos, 0),
          iguais: reg.reduce((s, x) => s + x.iguais, 0),
          consultas: (window.__SB.log || []).length,
          por: Object.entries(por).sort((a, b) => b[1].kb - a[1].kb).slice(0, 4)
            .map(([k, v]) => `${k} ${v.n}× ${v.kb.toFixed(1)}KB`).join(', '),
        };
      });
      const andou = await p.evaluate((x0, y0) => {
        const t = document.querySelector('#gr-tokens .gr-token');
        const b = t.getBoundingClientRect();
        return Math.hypot(b.left + b.width / 2 - x0, b.top + b.height / 2 - y0) > 8;
      }, q.de.x, q.de.y);
      if (volta !== 'mede') continue;
      ok(andou, 'a peça saiu do lugar');
      ok(selecao === '', `arrastar não seleciona texto (veio "${selecao.slice(0, 40)}")`);
      ok(r.consultas >= 2 && r.consultas <= 5,
        `mover custa de 2 a 5 idas ao banco (foram ${r.consultas})`);
      const t = TETOS[chave];
      if (VER || !t) {
        console.log(`    ${r.repinturas} repinturas · ${r.kb} KB · ${r.nos} nós (${r.iguais} idênticos) · ${r.por}`);
      } else {
        ok(r.repinturas <= t.repinturas, `no máximo ${t.repinturas} repinturas por movimento (foram ${r.repinturas}: ${r.por})`);
        ok(r.kb <= t.kb, `no máximo ${t.kb} KB de HTML por movimento (foram ${r.kb} KB)`);
        ok(r.nos <= t.nos, `no máximo ${t.nos} nós recriados por movimento (foram ${r.nos}, ${r.iguais} idênticos)`);
      }
    }
    // O movimento tem de virar linha no registro.
    const logDepois = await p.evaluate(() => document.querySelectorAll('#gr-log .lg').length);
    ok(logDepois > d.log, `o movimento escreveu no registro (${d.log} → ${logDepois} linhas)`);
  }

  // --------------------------------------------- o card completo da criatura
  const card = await p.evaluate(async () => {
    const t = [...document.querySelectorAll('#gr-tokens .gr-token')].find((x) => /Criatura/.test(x.title));
    if (!t) return null;
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 400, clientY: 300 }));
    const cab = document.querySelector('#tok-menu .tm-cab.tem-card');
    if (!cab) return { porta: false };
    cab.click();
    const corpo = document.getElementById('card-modal-body');
    const antes = corpo.querySelectorAll('.ib-hab li').length;
    await new Promise((r) => setTimeout(r, 1500));
    return {
      porta: true, antes,
      stats: corpo.querySelectorAll('.besta-stats > div').length,
      habs: corpo.querySelectorAll('.ib-hab li').length,
    };
  });
  if (card) {
    ok(card.porta, 'o menu da criatura abre o card');
    ok(card.stats === 6, `o card abre na hora com as 6 linhas de combate (vieram ${card.stats})`);
    ok(card.habs > 0, `a prosa da criatura chega depois, por busca (${card.antes} → ${card.habs} habilidades)`);
  }

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  await cena(br, dev.url, { pecas: 12, cols: 24, rows: 16, nevoa: false });
  await cena(br, dev.url, { pecas: 30, cols: 40, rows: 30, nevoa: true });
} finally {
  await br.close();
  await dev.parar();
}

if (falhas.length) {
  console.error(`\n✘ Grid FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log('\n✓ Grid OK · desenho, movimento, registro, névoa e card, nas duas cenas, dentro dos tetos de repintura');
