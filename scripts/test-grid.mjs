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

  // ------------------------------------- o ataque entra na linha do tempo
  // Desde a migracao 28 atacar pelo tabuleiro declara a acao, empurra o relogio
  // e cobra a Guarda sob pressao no alvo. Este passo confere as tres coisas, e
  // que a caixa mostra o P/G/R de quem esta batendo.
  const atq = await p.evaluate(async () => {
    const nome = (el) => el?.querySelector('.gr-tn')?.textContent.trim();
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')];
    const a = toks.find((t) => /Her/.test(nome(t)));
    const b = toks.find((t) => /Criatura/.test(nome(t)));
    if (!a || !b) return null;
    const antes = { t: a.dataset.c, tick: [...document.querySelectorAll('#gr-ini .ini-item')]
      .find((x) => x.dataset.c === a.dataset.c)?.dataset.t };
    a.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 500, clientY: 400 }));
    await new Promise((r) => setTimeout(r, 300));
    document.querySelector('#tok-menu button[data-a="ataque"]')?.click();
    await new Promise((r) => setTimeout(r, 300));
    const rb = b.getBoundingClientRect();
    b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
      clientX: rb.left + rb.width / 2, clientY: rb.top + rb.height / 2 }));
    await new Promise((r) => setTimeout(r, 700));
    const dlg = document.getElementById('alvo-dlg');
    if (!dlg?.open) return { abriu: false };
    const tempo = document.getElementById('al-tempo')?.textContent.replace(/\s+/g, ' ').trim();
    const manobras = [...document.getElementById('al-manobra').options]
      .filter((o) => !o.hidden).map((o) => o.value);
    document.getElementById('al-nao').click();   // errou: nao abre a caixa de dano
    // A LEITURA E IMEDIATA, e nao depois de esperar. O Supabase de mentira da
    // bancada aceita o `update` e nao guarda nada, entao o primeiro recarregamento
    // devolve a peca sem acao e apaga a marca. O que se mede aqui e o que a tela
    // desenhou com o que acabou de acontecer, que e o que importa.
    await new Promise((r) => setTimeout(r, 450));
    const linha = [...document.querySelectorAll('#gr-ini .ini-item')].find((x) => x.dataset.c === antes.t);
    return { abriu: true, tempo, manobras, antes: antes.tick, depois: linha?.dataset.t,
      fita: !!linha?.querySelector('.ini-fita')
        || !!document.querySelector(`.gr-token[data-c="${antes.t}"]`)?.className.match(/montando|golpe/) };
  });
  if (atq) {
    ok(atq.abriu, 'o menu da peca abre a caixa de alvo');
    ok(/Ticks/.test(atq.tempo || ''), `a caixa mostra o P/G/R de quem ataca (${atq.tempo})`);
    ok((atq.manobras || []).includes('simples'), 'com a lista de manobras filtrada');
    ok(atq.antes !== atq.depois, `atacar empurrou o relogio (t${atq.antes} -> t${atq.depois})`);
    ok(atq.fita, 'e a peca ficou marcada com o gesto no ar');
  }

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

/**
 * A MESMA MESA, DA CADEIRA DO JOGADOR.
 *
 * Tudo o que este arquivo prova até aqui é a tela do mestre, e metade do
 * desenho do tempo é justamente o que o jogador vê: ele não tem o rastreador
 * para consultar, então o que não estiver no tabuleiro não existe para ele. E
 * desde a migração 28 ele também ESCREVE (o ataque dele empurra o próprio
 * relógio), o que é o caminho mais fácil de quebrar sem ninguém notar: a
 * bancada respondia a qualquer `rpc` com lista vazia e sem erro, então um
 * relógio parado passava por sucesso.
 */
async function cenaJogador(br, url) {
  console.log('\n· a mesma cena, da cadeira do jogador');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=8&cols=14&rows=10&nevoa=0&papel=jogador`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(600);

  const v = await p.evaluate(() => ({
    jogador: document.body.classList.contains('sou-jogador'),
    // `offsetParent` nulo é a leitura honesta: o botão pode não estar `hidden`
    // e o contêiner dele estar.
    barra: !!document.getElementById('gr-btns')?.offsetParent,
    rolar: !!document.getElementById('ini-rolar')?.offsetParent,
    fitas: document.querySelectorAll('#gr-ini .ini-fita .fita-c').length,
    // A FASE ESCRITA MUDOU DE CASA, e nao de existencia. Era um selo ao lado da
    // fita e passou a ser a linha `.ini-fase`, que diz a fase POR EXTENSO em
    // toda linha e nas duas marcacoes ("Preparo - golpe no 9", "livre"). O que
    // esta prova guarda continua sendo o mesmo: a fase nao pode existir so em
    // cor, porque no tablet nao ha `title` para consultar.
    selos: document.querySelectorAll('#gr-ini .ini-fase').length,
    montando: document.querySelectorAll('.gr-token.montando').length,
    // A intenção não vaza: a view corta arma e alvo de quem não é dono, e a
    // tela não tem por onde escrevê-los.
    vazou: /Espada Longa|Adaga/.test(document.body.innerText),
  }));
  ok(v.jogador, 'a página abre como jogador');
  ok(!v.barra && !v.rolar, 'sem os botões do mestre (arena, tempo, rolar iniciativa)');
  ok(v.fitas > 0, `a fita do tempo chega ao jogador (${v.fitas} células)`);
  ok(v.selos > 0, `e a fase vem ESCRITA, não só em cor (${v.selos} selos)`);
  ok(v.montando > 0, `as peças com gesto no ar estão marcadas (${v.montando} montando)`);
  ok(!v.vazou, 'a arma de quem declarou não aparece na tela do jogador');

  // ---- o ataque dele empurra o próprio relógio, pela `jogador_declara` ----
  const tickDe = (nome) => p.evaluate((n) => {
    const it = [...document.querySelectorAll('#gr-ini .ini-item')]
      .find((x) => (x.textContent || '').includes(n));
    // `data-t` e nao `.ini-num b`: a linha da fila passou a mostrar "em N ticks"
    // no cabecalho do degrau em vez do Tick absoluto em cada linha, e o numero
    // que sobrou em `.ini-num` e a iniciativa. O atributo e o campo estavel.
    return it ? parseInt(it.dataset.t || '-1', 10) : -1;
  }, nome);
  const antes = await tickDe('Herói 1');
  const abriu = await p.evaluate(async () => {
    const meu = [...document.querySelectorAll('#gr-tokens .gr-token')]
      .find((t) => /Herói 1/.test(t.getAttribute('title') || ''));
    if (!meu) return 'sem peça minha no mapa';
    meu.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 500, clientY: 400 }));
    await new Promise((r) => setTimeout(r, 350));
    const it = [...document.querySelectorAll('#tok-menu button')].find((b) => /Ataque/.test(b.textContent));
    if (!it) return 'o jogador não tem o item de ataque na peça dele';
    it.click();
    await new Promise((r) => setTimeout(r, 350));
    const alvo = [...document.querySelectorAll('#gr-tokens .gr-token')]
      .find((t) => /Criatura/.test(t.getAttribute('title') || ''));
    const r0 = alvo.getBoundingClientRect();
    alvo.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true, pointerId: 7, button: 0,
      clientX: r0.left + r0.width / 2, clientY: r0.top + r0.height / 2,
    }));
    await new Promise((r) => setTimeout(r, 500));
    const d = document.querySelector('#alvo-dlg');
    if (!d?.open) return 'a caixa de ataque não abriu';
    return {
      // Sem o bloco do inimigo do lado dele, o número não existe e os
      // descontos não podem sair sozinhos.
      defesa: (document.querySelector('#al-defesas')?.innerText || '').replace(/\s+/g, ' ').trim(),
      tempo: (document.querySelector('#al-tempo')?.innerText || '').replace(/\s+/g, ' ').trim(),
    };
  });
  if (typeof abriu === 'string') {
    ok(false, `o ataque do jogador: ${abriu}`);
  } else {
    ok(/Preparo|Resolve agora/.test(abriu.tempo),
      `a caixa mostra o tempo em palavras (${abriu.tempo.slice(0, 44)})`);
    ok(!/condições|ferimento|pressão/.test(abriu.defesa),
      `sem número, os modificadores calam (${abriu.defesa.slice(0, 44)})`);
    // ERRAR GASTA O MESMO: o braço que passou perto custou o mesmo tempo.
    await p.evaluate(() => document.getElementById('al-nao').click());
    await espera(1400);
    const depois = await tickDe('Herói 1');
    const chamou = await p.evaluate(() =>
      (window.__SB.log || []).some((x) => x.alvo === 'rpc:jogador_declara'));
    ok(chamou, 'o relógio dele passa pela `jogador_declara`, e não por um update direto');
    ok(depois > antes, `errar gasta o mesmo: o tick dele andou (${antes} → ${depois})`);
    const fita = await p.evaluate(() => {
      const it = [...document.querySelectorAll('#gr-ini .ini-item')]
        .find((x) => (x.textContent || '').includes('Herói 1'));
      const f = it?.querySelector('.ini-fase');
      const tok = [...document.querySelectorAll('#gr-tokens .gr-token')]
        .find((t) => /Her.i 1/.test(t.getAttribute('title') || ''));
      return { txt: (f?.textContent || '(sem linha de fase)').replace(/\s+/g, ' ').trim(),
        marcado: /montando|golpe/.test(tok?.className || '') };
    });
    // O Supabase de mentira da bancada aceita a escrita e nao guarda nada, entao
    // o primeiro recarregamento devolve a peca sem acao. O que se mede e o que a
    // tela desenhou com o que acabou de acontecer: a linha da fila OU a marca no
    // token, que saem da mesma leitura.
    // "livre" SOZINHO e o estado sem gesto; "Recuperacao - livre no 5" e um
    // gesto, e contem a mesma palavra. A comparacao e com o texto inteiro.
    ok(fita.txt.trim().toLowerCase() !== 'livre' || fita.marcado,
      `e o gesto dele passa a aparecer na fila, com a fase escrita (${fita.txt})`);
  }

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  await cena(br, dev.url, { pecas: 12, cols: 24, rows: 16, nevoa: false });
  await cena(br, dev.url, { pecas: 30, cols: 40, rows: 30, nevoa: true });
  await cenaJogador(br, dev.url);
} finally {
  await br.close();
  await dev.parar();
}

if (falhas.length) {
  console.error(`\n✘ Grid FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log('\n✓ Grid OK · desenho, movimento, registro, névoa e card, nas duas cenas, dentro dos tetos'
  + ' de repintura, e a mesma mesa vista pelo jogador');
