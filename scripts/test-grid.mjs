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

  // ------------------------------------------- o lugar de cada coisa na tela
  // A ordem de combate deitou e subiu para cima do tabuleiro, porque é a única
  // informação do painel que interessa à mesa inteira. A linha do tempo é a
  // leitura EXTRA, e nasce desligada: quem a quiser liga no ▤ da barra.
  const lug = await p.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null;
      const b = e.getBoundingClientRect(); return { t: b.top, l: b.left, w: b.width, h: b.height }; };
    return { ini: r('.gr-ini'), palco: r('.gr-palco'), lado: r('.gr-lado'),
      linha: document.getElementById('gr-linha').hidden,
      deitada: (() => { const it = document.querySelectorAll('#gr-ini .ini-item');
        return it.length > 1 && it[1].getBoundingClientRect().left > it[0].getBoundingClientRect().left; })() };
  });
  ok(lug.ini.t < lug.palco.t && Math.abs(lug.ini.l - lug.palco.l) < 2,
    'a iniciativa fica em cima do tabuleiro, na largura dele');
  ok(lug.ini.w > lug.lado.w * 2, `e é uma tira larga, não uma coluna (${Math.round(lug.ini.w)}px)`);
  ok(lug.deitada, 'as peças da fila correm para o lado, e não para baixo');
  ok(lug.linha, 'a linha do tempo nasce desligada');
  const lt = await p.evaluate(async () => {
    document.getElementById('gr-linha-btn').click();
    await new Promise((r) => setTimeout(r, 350));
    const ligada = !document.getElementById('gr-linha').hidden;
    const celas = document.querySelectorAll('#lt-corpo .lt-c').length;
    document.getElementById('lt-fechar').click();
    await new Promise((r) => setTimeout(r, 350));
    return { ligada, celas, fechou: document.getElementById('gr-linha').hidden };
  });
  ok(lt.ligada && lt.celas > 0, `o ▤ da barra acende a régua de Ticks (${lt.celas} células)`);
  ok(lt.fechou, 'e o ✕ dela some com a faixa inteira');

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
    // A FOLHA DA ACAO: acerto, ajuste e dano na mesma caixa, e o modo do dano
    // vindo da arma em vez de nascer sempre em Impacto.
    const folha = {
      secoes: dlg.querySelectorAll('.al-sec').length,
      pool: document.getElementById('al-pool')?.textContent.trim(),
      dnTipo: document.getElementById('al-dn-tipo')?.value,
      danoDaArma: (document.getElementById('al-dn-pool')?.textContent || '').trim(),
      temMotivo: !!document.getElementById('al-motivo'),
      // O modo padrao e "na mesa": nada rola sozinho, os campos abrem vazios.
      totalVazio: document.getElementById('al-total')?.value === '',
      danoVazio: document.getElementById('al-dn')?.value === '',
    };
    // O botao de rolar avulso continua ali mesmo na mesa que rola tudo na mao.
    document.getElementById('al-rolar').click();
    document.getElementById('al-dn-rolar').click();
    await new Promise((r) => setTimeout(r, 200));
    folha.rolouAcerto = document.getElementById('al-total')?.value !== '';
    folha.rolouDano = document.getElementById('al-dn')?.value !== '';
    folha.vered = document.getElementById('al-vered')?.textContent.trim();
    document.getElementById('al-nao').click();   // errou: nada de dano
    // A LEITURA E IMEDIATA, e nao depois de esperar. O Supabase de mentira da
    // bancada aceita o `update` e nao guarda nada, entao o primeiro recarregamento
    // devolve a peca sem acao e apaga a marca. O que se mede aqui e o que a tela
    // desenhou com o que acabou de acontecer, que e o que importa.
    await new Promise((r) => setTimeout(r, 450));
    const linha = [...document.querySelectorAll('#gr-ini .ini-item')].find((x) => x.dataset.c === antes.t);
    return { abriu: true, tempo, manobras, folha, antes: antes.tick, depois: linha?.dataset.t,
      fita: !!linha?.querySelector('.ini-fita')
        || !!document.querySelector(`.gr-token[data-c="${antes.t}"]`)?.className.match(/montando|golpe/) };
  });
  if (atq) {
    ok(atq.abriu, 'o menu da peca abre a caixa de alvo');
    ok(/Ticks/.test(atq.tempo || ''), `a caixa mostra o P/G/R de quem ataca (${atq.tempo})`);
    ok((atq.manobras || []).includes('simples'), 'com a lista de manobras filtrada');
    ok(atq.antes !== atq.depois, `atacar empurrou o relogio (t${atq.antes} -> t${atq.depois})`);
    ok(atq.fita, 'e a peca ficou marcada com o gesto no ar');
    const f = atq.folha || {};
    ok(f.secoes === 3, `a folha da acao tem as tres faixas: acerto, ajuste e dano (${f.secoes})`);
    ok(/d6|—/.test(f.pool || ''), `o bolo de dados de quem ataca vem escrito (${f.pool})`);
    ok(f.temMotivo, 'e o ajuste avulso pede o motivo, que vai para o registro');
    // A letra entre parenteses na linha de dano decide o modo: `1d6 +2 (C)`
    // abre em Cortante. Antes a caixa abria em Impacto sempre, e o mestre
    // aplicava couro contra espada sem perceber.
    const LETRA = { I: 'impacto', C: 'corte', P: 'perfurante' };
    const esperado = LETRA[(/\(([ICP])\)/.exec(f.danoDaArma || '') || [])[1]] || null;
    ok(esperado ? f.dnTipo === esperado : true,
      `o modo do dano vem da arma (${f.danoDaArma} -> ${f.dnTipo})`);
    ok(f.totalVazio && f.danoVazio, 'no modo padrao (dados na mesa) nada rola sozinho');
    ok(f.rolouAcerto && f.rolouDano, 'e o botao de rolar avulso rola quando alguem pede');
    ok(/acerta|erra/.test(f.vered || ''), `com o veredito escrito ao lado (${f.vered})`);
  }

  // ------------------------------- o arrasto que ataca e o atalho do teclado
  //
  // Soltar uma peca em cima de outra abre a folha da acao: a casa ocupada
  // recusava o movimento, e o gesto terminava em nada. E a tecla A faz o mesmo
  // pela peca da vez, sem a mao sair do teclado.
  const gesto = await p.evaluate(async () => {
    // Só peças dentro da JANELA DO TABULEIRO: o palco rola, e a peça que saiu
    // dele está atrás da coluna lateral ou fora da tela. `elementFromPoint`, que
    // é como o arrasto descobre em quem se soltou, enxerga o que um dedo de
    // verdade alcançaria, e não o que o `getBoundingClientRect` calcula.
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela);
    const a = toks[0], b = toks.find((t) => t !== a);
    if (!a || !b) return null;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const em = (el, tipo, x, y) => el.dispatchEvent(new PointerEvent(tipo, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(a, 'pointerdown', ra.left + ra.width / 2, ra.top + ra.height / 2);
    em(document, 'pointermove', rb.left + rb.width / 2, rb.top + rb.height / 2);
    em(document, 'pointerup', rb.left + rb.width / 2, rb.top + rb.height / 2);
    await new Promise((r) => setTimeout(r, 1300));
    const dlg = document.getElementById('alvo-dlg');
    const abriu = !!dlg?.open;
    // O título só vale se a caixa estiver aberta AGORA: ele fica no DOM depois
    // de fechar, e a prova anterior já tinha atacado com a mesma peça. Sem isto,
    // um arrasto que não fez nada passava lendo a sobra do teste de cima.
    const titulo = abriu ? (document.getElementById('al-titulo')?.textContent || '') : '';
    if (abriu) { dlg.close(); await new Promise((r) => setTimeout(r, 250)); }
    // E a tecla: sem caixa aberta, "a" comeca a mira de quem age.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    await new Promise((r) => setTimeout(r, 250));
    const mirando = !!document.getElementById('mira-aviso');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return { abriu, titulo, mirando };
  });
  if (gesto) {
    ok(gesto.abriu, 'arrastar uma peca em cima de outra abre a folha da acao');
    ok(/ataca/.test(gesto.titulo), `e a caixa diz quem ataca quem (${gesto.titulo})`);
    ok(gesto.mirando, 'a tecla A comeca a mira de quem age');
  }

  // ------------------------------------------- a acao "outra coisa"
  //
  // A valvula do improviso. O que ela guarda: que o item existe no menu, que a
  // frase e OBRIGATORIA (sem ela o registro guardaria "alguem gastou 5 Ticks"),
  // que o tempo e cobrado com a mesma regua do resto, e que a linha do registro
  // sai com a frase que o mestre escreveu.
  const outra = await p.evaluate(async () => {
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const a = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela)[0];
    if (!a) return null;
    const cid = a.dataset.c;
    a.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 400, clientY: 300 }));
    await new Promise((r) => setTimeout(r, 350));
    const item = document.querySelector('#tok-menu button[data-a="outra"]');
    const temItem = !!item;
    item?.click();
    await new Promise((r) => setTimeout(r, 450));
    const dlg = document.getElementById('outra-dlg');
    if (!dlg?.open) return { temItem, abriu: false };
    // Sem a frase, "Fazer" nao faz: a caixa continua aberta.
    document.getElementById('ou-ok').click();
    await new Promise((r) => setTimeout(r, 250));
    const travou = dlg.open;
    const oque = document.getElementById('ou-oque');
    oque.value = 'derruba a estante em cima do goblin';
    const tk = document.getElementById('ou-ticks');
    tk.value = '7'; tk.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 120));
    const tempo = document.getElementById('ou-tempo').textContent.replace(/\s+/g, ' ').trim();
    document.getElementById('ou-pool').value = '3d6 +1';
    document.getElementById('ou-rolar').click();
    await new Promise((r) => setTimeout(r, 150));
    const total = document.getElementById('ou-total').value;
    const dif = document.getElementById('ou-dif');
    dif.value = '3'; dif.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 120));
    const vered = document.getElementById('ou-vered').textContent.trim();
    const linhaDe = () => [...document.querySelectorAll('#gr-ini .ini-item')]
      .find((x) => x.dataset.c === cid)?.dataset.t;
    const antes = linhaDe();
    const logAntes = document.querySelectorAll('#gr-log .lg').length;
    document.getElementById('ou-ok').click();
    await new Promise((r) => setTimeout(r, 900));
    const registro = [...document.querySelectorAll('#gr-log .lg')]
      .map((l) => l.textContent).join(' | ');
    return { temItem, abriu: true, travou, tempo, total, vered,
      antes, depois: linhaDe(), logAntes, logDepois: document.querySelectorAll('#gr-log .lg').length,
      escreveu: /derruba a estante/.test(registro),
      contou: /7 Ticks/.test(registro) };
  });
  if (outra) {
    ok(outra.temItem, 'a peca tem "Outra coisa" no menu');
    ok(outra.abriu, 'e o item abre a caixa do improviso');
    ok(outra.travou, 'sem a frase, "Fazer" nao faz: o registro nao guarda acao muda');
    ok(/7/.test(outra.tempo || ''), `o tempo e cobrado com a mesma regua (${outra.tempo})`);
    ok(Number(outra.total) >= 4, `a rolagem avulsa rola o bolo que a mesa digitou (3d6+1 = ${outra.total})`);
    ok(/passa|falha/.test(outra.vered || ''), `com veredito contra a Dificuldade (${outra.vered})`);
    ok(outra.antes !== outra.depois, `e o relogio anda (t${outra.antes} -> t${outra.depois})`);
    ok(outra.escreveu, 'a frase do mestre vai inteira para o registro');
    ok(outra.contou, 'e o custo em Ticks vai junto');
  }

  // ------------------------------- a iniciativa distribui os Ticks de entrada
  //
  // O defeito que isto guarda: todos entravam no Tick 0, e a primeira rodada
  // inteira acontecia no mesmo instante. A regra (`derivados.iniciativa`) diz
  // que o maior entra no Tick 0, os demais no 1, e mais um Tick a cada seis
  // pontos de atraso, com -1d6 na primeira acao de quem foi pego no contrape.
  const ini = await p.evaluate(async () => {
    const btn = document.getElementById('ini-rolar');
    if (!btn || btn.hidden) return null;
    btn.click();
    await new Promise((r) => setTimeout(r, 400));
    // A confirmacao e um dialogo do site, e o "Rolar" e o botao principal dele.
    const dlg = [...document.querySelectorAll('dialog[open]')].pop();
    const ok2 = dlg && [...dlg.querySelectorAll('button')].find((b) => /rolar/i.test(b.textContent));
    if (!ok2) return { pediu: false };
    ok2.click();
    await new Promise((r) => setTimeout(r, 1600));
    const itens = [...document.querySelectorAll('#gr-ini .ini-item')];
    const linhas = itens.map((i) => ({
      t: Number(i.dataset.t),
      ini: Number((i.querySelector('.ini-num b')?.textContent || '0').trim()),
      contrape: /contrapé/.test(i.querySelector('.ini-num')?.textContent || ''),
      dados: Number((/contrapé (-?\d+)d6/.exec(i.querySelector('.ini-num')?.textContent || '') || [])[1] || 0),
    }));
    return { pediu: true, linhas,
      degraus: [...document.querySelectorAll('#gr-ini .ini-grupo')].length,
      registro: [...document.querySelectorAll('#gr-log .lg')].map((l) => l.textContent).join(' | ') };
  });
  if (ini && ini.pediu) {
    const ts = ini.linhas.map((l) => l.t);
    const maior = Math.max(...ini.linhas.map((l) => l.ini));
    // A regua: o maior entra SOZINHO no Tick 1, e os demais um Tick depois por
    // degrau de 6, arredondando para cima.
    const degrau = (v) => Math.ceil((maior - v) / 6);
    ok(new Set(ts).size > 1, `a cena nao comeca toda no mesmo Tick (ticks: ${[...new Set(ts)].join(', ')})`);
    ok(ini.linhas.filter((l) => l.ini === maior).every((l) => l.t === 1),
      'quem tirou o maior entra sozinho no Tick 1');
    ok(ini.linhas.filter((l) => l.ini !== maior).every((l) => l.t >= 2),
      'e todos os demais entram pelo menos um Tick depois dele');
    ok(ini.linhas.every((l) => l.t === 1 + degrau(l.ini)),
      'o atraso segue a regua: um Tick por degrau de seis pontos, para cima');
    // O contrape mostrado e o do proprio Tick de entrada, ou seja, o cheio.
    ok(ini.linhas.every((l) => l.contrape === (degrau(l.ini) > 0)),
      'e o contrape aparece escrito na fila de quem foi pego atrasado');
    ok(ini.linhas.every((l) => !l.contrape || l.dados === -degrau(l.ini)),
      `com um dado por degrau (${ini.linhas.filter((l) => l.contrape).map((l) => l.dados).join(', ')})`);
    ok(ini.degraus > 1, `a escada tem mais de um degrau (${ini.degraus})`);
    ok(/Iniciativa rolada/.test(ini.registro || ''), 'o registro guarda a rolagem com os Ticks');
  }

  // --------------------------- as tres pontas soltas da iniciativa
  //
  // 1) o desempate por Raciocinio, que a regra manda e a fila ignorava;
  // 2) os caidos fora da conta da entrada, porque quem nao age nao da o passo;
  // 3) quem chega no meio da luta entra no RELOGIO DA CENA, e nao no Tick 0
  //    (com Tick 0 o recem-chegado age antes de todos e puxa o relogio de volta).
  const pontas = await p.evaluate(async () => {
    const itens = () => [...document.querySelectorAll('#gr-ini .ini-item')];
    // O desempate: dois no mesmo Tick e com a MESMA iniciativa tem de sair na
    // ordem do Raciocinio. A bancada tem iniciativas distintas, entao o que da
    // para provar aqui e que a fila nao quebra e que a ordem e estavel.
    const antes = itens().map((i) => i.dataset.c).join(',');
    // Os caidos: se houver alguem no chao, ele nao pode estar na fila.
    const noChao = [...document.querySelectorAll('#ini-chao .ini-caido')].map((x) => x.dataset.c);
    const naFila = itens().map((i) => i.dataset.c);
    return { antes, vazou: noChao.filter((id) => naFila.includes(id)).length,
      relogio: document.getElementById('ini-tk')?.textContent };
  });
  if (pontas) {
    ok(pontas.vazou === 0, 'quem esta no chao nao aparece na fila de quem vai agir');
    ok(Number(pontas.relogio) >= 1,
      `o relogio da cena comeca no Tick do primeiro, e nao no zero (tick ${pontas.relogio})`);
  }

  // ------------------------- golpes no mesmo instante: os dois estao abertos
  //
  // O defeito que isto guarda: o mestre resolve um ataque de cada vez, e quem
  // ainda nao declarou lia como LIVRE, com a guarda inteira. Num duelo de
  // adagas no mesmo Tick, quem fosse resolvido por ultimo vencia 97% das vezes.
  // Agora a escada se le pela REGRA: quem age neste instante esta comprometido.
  const juntos = await p.evaluate(async () => {
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela);
    const tickDe = (id) => [...document.querySelectorAll('#gr-ini .ini-item')]
      .find((i) => i.dataset.c === id)?.dataset.t;
    // Dois que agem no MESMO Tick e ainda nao declararam nada.
    let a = null, b = null;
    for (const x of toks) { for (const y of toks) {
      if (x === y) continue;
      if (tickDe(x.dataset.c) && tickDe(x.dataset.c) === tickDe(y.dataset.c)) { a = x; b = y; break; }
    } if (a) break; }
    if (!a || !b) return null;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(a, 'pointerdown', ra.left + ra.width / 2, ra.top + ra.height / 2);
    em(document, 'pointermove', rb.left + rb.width / 2, rb.top + rb.height / 2);
    em(document, 'pointerup', rb.left + rb.width / 2, rb.top + rb.height / 2);
    await new Promise((r) => setTimeout(r, 1300));
    const dlg = document.getElementById('alvo-dlg');
    if (!dlg?.open) return { abriu: false };
    const cx = document.getElementById('al-defesas');
    const r = { abriu: true, tick: tickDe(a.dataset.c),
      texto: (cx?.textContent || '').replace(/\s+/g, ' ').trim() };
    dlg.close();
    await new Promise((x) => setTimeout(x, 200));
    return r;
  });
  if (juntos && juntos.abriu) {
    ok(/age neste instante/.test(juntos.texto),
      `quem age no mesmo instante entra comprometido (${juntos.texto.slice(0, 70)})`);
    ok(/Golpe|Preparo/.test(juntos.texto), 'e a fase presumida aparece escrita, com a conta ao lado');
  }

  // ------------------------------------- o contrape desce com o relogio
  //
  // A regra que a mesa fechou: cada Tick de espera devolve 1d6. E ela e do
  // RELOGIO e nao da acao, entao nao ha como comprar a limpeza gastando um Tick
  // em qualquer bobagem: o botao de esperar custa exatamente o Tick que a regra
  // manda custar, e o rotulo dele ja diz o que se compra.
  const cp = await p.evaluate(async () => {
    const linha = (nome) => [...document.querySelectorAll('#gr-ini .ini-item')]
      .find((i) => (i.querySelector('.ini-nome')?.textContent || '').includes(nome));
    // Alguem com contrape na fila.
    const alvo = [...document.querySelectorAll('#gr-ini .ini-item')]
      .find((i) => /contrapé/.test(i.querySelector('.ini-num')?.textContent || ''));
    if (!alvo) return null;
    const nome = alvo.querySelector('.ini-nome')?.textContent.trim();
    const leia = () => {
      const l = linha(nome);
      return { t: Number(l?.dataset.t),
        dados: Number((/contrapé (-?\d+)d6/.exec(l?.querySelector('.ini-num')?.textContent || '') || [])[1] || 0) };
    };
    const antes = leia();
    // O menu da peca tem o item de esperar, e o rotulo diz o antes e o depois.
    const tok = document.querySelector(`.gr-token[data-c="${CSS.escape(alvo.dataset.c)}"]`);
    if (!tok) return { semToken: true, antes };
    tok.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 400, clientY: 300 }));
    await new Promise((r) => setTimeout(r, 350));
    const it = document.querySelector('#tok-menu button[data-a="esperar"]');
    const rotulo = it?.textContent.trim();
    if (!it) return { semItem: true, antes };
    it.click();
    await new Promise((r) => setTimeout(r, 900));
    const depois = leia();
    const registro = [...document.querySelectorAll('#gr-log .lg')].map((l) => l.textContent).join(' | ');
    return { antes, depois, rotulo, nome,
      escreveu: /recompor a guarda/.test(registro) };
  });
  if (cp && cp.antes) {
    ok(!!cp.rotulo, `o menu de quem tem contrape oferece esperar (${cp.rotulo || 'nao ofereceu'})`);
    ok(cp.depois && cp.depois.t === cp.antes.t + 1,
      `esperar custa exatamente um Tick (t${cp.antes?.t} -> t${cp.depois?.t})`);
    ok(cp.depois && cp.depois.dados === Math.min(0, cp.antes.dados + 1),
      `e devolve exatamente um dado (${cp.antes.dados}d6 -> ${cp.depois?.dados}d6)`);
    ok(cp.escreveu, 'e a espera entra no registro, com o antes e o depois');
  }

  // ----------------------------------------- a distancia, mostrada e nao aplicada
  //
  // O Grid e o unico que sabe quantos metros separam duas pecas. A folha diz em
  // que faixa o alvo esta e o que ela custa, e NAO desconta nada: quem poe o
  // valor final do ataque e o mestre, conforme o que o jogador rolou.
  const dist = await p.evaluate(async () => {
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela);
    const a = toks[0], b = toks.find((t) => t !== a);
    if (!a || !b) return null;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(a, 'pointerdown', ra.left + ra.width / 2, ra.top + ra.height / 2);
    em(document, 'pointermove', rb.left + rb.width / 2, rb.top + rb.height / 2);
    em(document, 'pointerup', rb.left + rb.width / 2, rb.top + rb.height / 2);
    await new Promise((r) => setTimeout(r, 1300));
    const dlg = document.getElementById('alvo-dlg');
    if (!dlg?.open) return { abriu: false };
    const aviso = document.getElementById('al-aviso');
    // O bolo mostrado tem de ser o da ficha, sem a distancia embutida: mostrar
    // e aplicar sao coisas diferentes, e a caixa faz so a primeira.
    const pool = document.getElementById('al-pool')?.textContent.trim();
    const r = { abriu: true, linha: document.getElementById('al-linha')?.textContent.trim(),
      aviso: aviso?.hidden ? '' : aviso?.textContent.trim(), pool };
    dlg.close();
    await new Promise((x) => setTimeout(x, 200));
    return r;
  });
  // O MESMO, com uma arma que tem alcance: a bancada dá um arco longo ao
  // Herói 2, e é ele que faz a folha desenhar as quatro faixas.
  const arco = await p.evaluate(async () => {
    const nome = (t) => t.querySelector('.gr-tn')?.textContent.trim() || '';
    // O mapa inteiro na tela antes de escolher: com o zoom de trabalho, as
    // peças visíveis estão todas perto, e nenhuma sairia do alcance livre.
    document.getElementById('gr-caber')?.click();
    await new Promise((r) => setTimeout(r, 400));
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela);
    const a = toks.find((t) => /Her[oó]i 2/i.test(nome(t)));
    if (!a) return null;
    // As peças da bancada nascem agrupadas nas primeiras fileiras, e a maior
    // distância entre duas delas não sai do alcance livre. O arqueiro vai para
    // o canto de baixo primeiro: é o mesmo gesto de um mestre posicionando o
    // atirador, e é o que faz a faixa existir.
    {
      const r0 = a.getBoundingClientRect();
      const em0 = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
        bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
      em0(a, 'pointerdown', r0.left + r0.width / 2, r0.top + r0.height / 2);
      em0(document, 'pointermove', pal.right - 60, pal.bottom - 60);
      em0(document, 'pointerup', pal.right - 60, pal.bottom - 60);
      await new Promise((r) => setTimeout(r, 900));
    }
    // O alvo MAIS LONGE que ainda está na tela: é o único que pode sair do
    // alcance livre num tabuleiro deste tamanho.
    const arq = [...document.querySelectorAll('#gr-tokens .gr-token')]
      .find((t) => /Her[oó]i 2/i.test(nome(t))) || a;
    const ra0 = arq.getBoundingClientRect();
    const b = toks.filter((t) => t !== arq && nome(t) !== nome(arq))
      .sort((x, y) => {
        const rx = x.getBoundingClientRect(), ry = y.getBoundingClientRect();
        return Math.hypot(ry.left - ra0.left, ry.top - ra0.top)
          - Math.hypot(rx.left - ra0.left, rx.top - ra0.top);
      })[0];
    if (!b) return null;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(a, 'pointerdown', ra.left + ra.width / 2, ra.top + ra.height / 2);
    em(document, 'pointermove', rb.left + rb.width / 2, rb.top + rb.height / 2);
    em(document, 'pointerup', rb.left + rb.width / 2, rb.top + rb.height / 2);
    await new Promise((r) => setTimeout(r, 1300));
    const dlg = document.getElementById('alvo-dlg');
    if (!dlg?.open) return { abriu: false };
    const av = document.getElementById('al-aviso');
    const r = { abriu: true, pool: document.getElementById('al-pool')?.textContent.trim(),
      linha: document.getElementById('al-linha')?.textContent.trim(),
      aviso: av?.hidden ? '(calada)' : av?.textContent.trim(),
      conta: !!av?.classList.contains('al-aviso-conta'),
      tempo: document.getElementById('al-tempo')?.textContent.replace(/\s+/g, ' ').trim() };
    dlg.close();
    await new Promise((x) => setTimeout(x, 200));
    return r;
  });
  if (arco && arco.abriu) {
    // A CONTA CONFERIDA CONTRA A REGRA, e não contra o que a tela escreveu:
    // besta pequena tem livre 40 m e máximo 100 m, então sobram 60 em quatro
    // faixas de 15 (−3, −6, −9, −12). Dentro do livre a linha CALA, porque
    // "sem penalidade" é o caso comum e escrevê-lo a cada tiro ensinaria a
    // mesa a não ler esta linha nas vezes em que ela tem algo a dizer.
    const met = parseFloat(((arco.linha || '').match(/([0-9]+(?:[.,][0-9]+)?)\s*m/) || [])[1]?.replace(',', '.') || '0');
    const faixa = met <= 40 ? 0 : Math.min(4, Math.ceil((met - 40) / 15));
    ok(faixa === 0 ? arco.aviso === '(calada)' : new RegExp(`${faixa}ª faixa`).test(arco.aviso),
      `a ${met} m a folha diz a faixa certa (faixa ${faixa}: ${arco.aviso})`);
    ok(faixa === 0 || new RegExp(`${-3 * faixa} no acerto`).test(arco.aviso),
      `e o preço dela (${arco.aviso})`);
    // NOTA: no tabuleiro da bancada (40 hexágonos de largura) a maior distância
    // possível fica dentro do alcance livre da besta pequena, então o caso que
    // esta prova costuma exercitar é o da linha CALADA. As quatro faixas em si
    // estão travadas no `test-combate-tempo.mjs`, contra a régua do
    // `Arremesso.md`, oito casos incluindo as bordas.
    ok(!/hex[áa]gono/.test(arco.aviso), 'a régua do corpo a corpo não vale para quem atira');
    ok(/3d6/.test(arco.pool || ''), `e o bolo é o da arma dele (${arco.pool})`);
    // A arma de distância tem Preparo próprio: o arco encaixa a flecha e solta.
    ok(/Preparo/.test(arco.tempo || '') || /Ticks/.test(arco.tempo || ''),
      `com o tempo da arma de distância (${arco.tempo})`);
  }

  if (dist && dist.abriu) {
    ok(/Dist[âa]ncia/.test(dist.linha || ''), `a folha diz a distancia (${dist.linha})`);
    // No corpo a corpo longe demais, a linha e de impedimento; a arma de
    // distancia diz a faixa e o preco. Uma das duas, nunca as duas.
    ok(!dist.aviso || /alcan[çc]a|faixa|n[ãa]o chega/.test(dist.aviso),
      `e a linha do alcance fala a lingua da regra (${dist.aviso || 'dentro do alcance, calada'})`);
    ok(!/−\d+ no acerto/.test(dist.pool || '') || /somar/.test(dist.aviso || ''),
      'a penalidade da distancia nao entra no bolo sozinha');
  }

  // ------------------------------------------ a tela cheia leva a ordem junto
  //
  // Era o PALCO que ia a tela cheia, e a ordem de combate sumia justamente
  // quando a mesa mais precisava dela: projetada na TV, a cena virava um mapa
  // sem relogio. Agora vai a GRADE, com o modo TV ligado por cima.
  const cheia = await p.evaluate(() => {
    const grade = document.querySelector('.gr-grade');
    const pal = document.getElementById('gr-palco');
    return {
      // O alvo do pedido de tela cheia: sem navegador de verdade nao da para
      // ENTRAR nela num teste, entao o que se prova e que o alvo mudou e que a
      // regra de reserva (a que vale quando o navegador recusa) cobre a grade.
      temGrade: !!grade,
      reservaNaGrade: [...document.styleSheets].some((f) => {
        try { return [...f.cssRules].some((r) => /tela-cheia.*gr-grade/.test(r.cssText)); } catch { return false; }
      }),
      // E que o par que a mesa le (tira + tabuleiro) esta dentro do alvo.
      tiraNaGrade: !!grade?.contains(document.getElementById('gr-ini-col')),
      palcoNaGrade: !!grade?.contains(pal),
    };
  });
  if (cheia) {
    ok(cheia.tiraNaGrade && cheia.palcoNaGrade,
      'a ordem de combate e o tabuleiro estao no mesmo alvo de tela cheia');
    ok(cheia.reservaNaGrade, 'e a rede de seguranca da tela cheia cobre a grade, e nao so o palco');
  }

  // --------------------------------------------------------- o modo TV
  //
  // A tela dos jogadores sem a mobilia do mestre: some a barra da mesa, a barra
  // da arena e a coluna lateral; ficam o tabuleiro e a ordem de combate. E tem
  // porta de saida visivel, porque um modo sem saida e uma armadilha.
  const tv = await p.evaluate(async () => {
    const larg = () => Math.round(document.getElementById('gr-palco').getBoundingClientRect().width);
    const vis = (s) => { const e = document.querySelector(s);
      return !!e && getComputedStyle(e).display !== 'none'; };
    const antes = { palco: larg(), barra: vis('.gr-barra'), lado: vis('.gr-lado') };
    document.getElementById('gr-tv').click();
    await new Promise((r) => setTimeout(r, 500));
    const dentro = { palco: larg(), barra: vis('.gr-barra'), lado: vis('.gr-lado'),
      mesa: vis('.mesa-barra'), tira: vis('.gr-ini'), sai: vis('#gr-tv-sai'),
      guardado: (() => { try { return localStorage.getItem('centelha:grid:tv'); } catch { return null; } })() };
    // A tecla T tambem, e ela devolve tudo.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 't', bubbles: true }));
    await new Promise((r) => setTimeout(r, 500));
    const depois = { palco: larg(), barra: vis('.gr-barra'), lado: vis('.gr-lado') };
    return { antes, dentro, depois };
  });
  if (tv) {
    ok(!tv.dentro.barra && !tv.dentro.lado && !tv.dentro.mesa,
      'no modo TV somem a barra da mesa, a da arena e a coluna lateral');
    ok(tv.dentro.tira, 'e a ordem de combate FICA, que e o que a mesa precisa ver');
    ok(tv.dentro.palco > tv.antes.palco,
      `o tabuleiro toma a largura que sobrou (${tv.antes.palco} -> ${tv.dentro.palco}px)`);
    ok(tv.dentro.sai, 'com porta de saida visivel: modo sem saida e armadilha');
    ok(tv.dentro.guardado === '1', 'a escolha fica no aparelho');
    ok(tv.depois.barra && tv.depois.lado && tv.depois.palco === tv.antes.palco,
      'e a tecla T devolve tudo como estava');
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
      // O teto subiu de 5 para 7 em 21/08, e de propósito: quem anda durante a
      // Recuperação passou a PAGAR o deslocamento (2 Ticks por metro, K20), e
      // isso são duas escritas a mais (o relógio da peça e a linha do registro).
      ok(r.consultas >= 2 && r.consultas <= 7,
        `mover custa de 2 a 7 idas ao banco (foram ${r.consultas})`);
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

/**
 * A MESMA TIRA, NO RASTREADOR.
 *
 * O desenho da fila e o gerador dos cartões passaram a morar em lugar
 * compartilhado (`MesaCab.astro` e `mesa-tempo-ui.ts`), e as duas telas leem de
 * lá. Sem uma prova do lado do rastreador, quebrar a fila dele com um conserto
 * no Grid não faria barulho nenhum até alguém abrir a aba no meio de uma sessão.
 */
async function cenaRastreador(br, url) {
  console.log('\n· a mesma tira, na aba de Combate');
  const p = await br.newPage();
  await p.setViewport({ width: 1600, height: 1000 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/combate?id=${MESA}&bench=12`, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#cmb-fila .ini-item', { timeout: 30000 });
  const d = await p.evaluate(() => ({
    cartoes: document.querySelectorAll('#cmb-fila .ini-item').length,
    cards: document.querySelectorAll('.cbt').length,
    degraus: document.querySelectorAll('#cmb-fila .ini-grupo').length,
    tick: document.getElementById('enc-tick')?.textContent,
    fases: document.querySelectorAll('#cmb-fila .ini-fase').length,
    // O desenho vem do MesaCab: se o CSS compartilhado não chegar, a tira
    // existe no DOM e desaba em coluna, que é o defeito que isto guarda.
    deitada: (() => { const it = document.querySelectorAll('#cmb-fila .ini-item');
      return it.length > 1 && it[1].getBoundingClientRect().left > it[0].getBoundingClientRect().left; })(),
    acima: (() => { const t = document.getElementById('cmb-tira');
      const l = document.getElementById('cmb-lista');
      return !!t && !!l && t.getBoundingClientRect().top < l.getBoundingClientRect().top; })(),
  }));
  ok(d.cartoes === d.cards && d.cartoes > 0, `um cartão por combatente (${d.cartoes} para ${d.cards} cards)`);
  ok(d.degraus > 0, `a escada tem degraus (${d.degraus})`);
  ok(d.fases === d.cartoes, `e todo cartão diz a fase por extenso (${d.fases})`);
  ok(d.deitada, 'a tira é deitada aqui também, e não uma coluna');
  ok(d.acima, 'e fica acima da grade de cards');
  ok(/^\d+$/.test(d.tick || ''), `o relógio mostra só o número (${d.tick})`);
  const clique = await p.evaluate(async () => {
    document.querySelectorAll('#cmb-fila .ini-item')[3]?.click();
    await new Promise((r) => setTimeout(r, 500));
    return document.querySelectorAll('.cbt.achei').length;
  });
  ok(clique === 1, `clicar num cartão acende o card cheio dele (${clique})`);
  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * A CAIXA DE FUNDO, ONDE A ARTE SE ARRUMA.
 *
 * Uma arte que subiu em pé fica em pé no arquivo, e por isso está torta na aba
 * Mapas, na miniatura da escolha e em toda arena que a use. O giro aqui é nos
 * pixels, e é o tipo de conserto que ninguém confere de olho depois: se a conta
 * do canvas errar a troca de largura por altura, a arte volta pior do que
 * estava e o mestre só descobre com a mesa montada.
 *
 * Os dois mapas da bancada têm dez por seis e seis por dez pixels, então a
 * medida escrita embaixo da miniatura é a prova direta do que aconteceu.
 */
async function cenaMapas(br, url) {
  console.log('\n· a caixa de fundo: girar e excluir a arte');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=6&cols=24&rows=16&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });

  await p.evaluate(() => document.getElementById('gr-fundo-btn').click());
  await p.waitForSelector('#fundo-dlg[open] .fd-item', { timeout: 15000 });
  const medidas = () => p.evaluate(() => [...document.querySelectorAll('.fd-item')].map((i) => ({
    nome: i.querySelector('.fd-nome')?.textContent || '',
    med: i.querySelector('.fd-med')?.textContent || '',
    empe: i.classList.contains('fd-empe'),
  })));
  // A medida só existe depois que a miniatura carrega.
  await p.waitForFunction(() => [...document.querySelectorAll('.fd-med')].every((m) => m.textContent),
    { timeout: 15000 });
  const antes = await medidas();
  ok(antes.length === 2, `as duas artes da mesa aparecem na caixa (${antes.length})`);
  ok(antes.some((m) => m.med === '10×6 · paisagem'), 'a deitada se diz deitada');
  const empe = antes.find((m) => m.empe);
  ok(empe?.med === '6×10 · retrato', `a que subiu em pé se denuncia (${empe?.med || 'nenhuma'})`);

  // -------------------------------- a arte em pé entra DEITADA no tabuleiro
  //
  // O mestre escolhe o mapa e ele tem de cair usável. Uma arte em pé num
  // tabuleiro deitado, sem giro, entra como uma tira estreita entre dois
  // vazios, e a conta que evita isso é a mesma do "caber": vale o giro em que a
  // arte inteira ocupa mais tabuleiro.
  const giroDaArte = () => p.evaluate(() => {
    const t = document.getElementById('gr-fundo')?.style.transform || '';
    const m = /rotate\(([-\d.]+)deg\)/.exec(t);
    return { giro: m ? Math.round(parseFloat(m[1])) : null, arte: !!document.querySelector('.gr-mundo.com-arte') };
  });
  await p.evaluate(() => {
    [...document.querySelectorAll('.fd-item')].find((i) => i.classList.contains('fd-empe')).click();
  });
  await p.waitForFunction(() => !!document.querySelector('.gr-mundo.com-arte')
    && /rotate/.test(document.getElementById('gr-fundo')?.style.transform || ''), { timeout: 20000 });
  const posta = await giroDaArte();
  ok(posta.arte && posta.giro === 90,
    `a arte em pé entrou deitada no tabuleiro (giro ${posta.giro}°)`);

  await p.evaluate(() => document.getElementById('gr-fundo-btn').click());
  await p.waitForSelector('#fundo-dlg[open] .fd-item', { timeout: 15000 });
  await p.waitForFunction(() => [...document.querySelectorAll('.fd-med')].every((m) => m.textContent),
    { timeout: 15000 });

  // ---------------------------------- girar não é escolher, e gira de verdade
  await p.evaluate(() => {
    const it = [...document.querySelectorAll('.fd-item')].find((i) => i.classList.contains('fd-empe'));
    it.querySelector('[data-g="90"]').click();
  });
  await p.waitForFunction(
    () => [...document.querySelectorAll('.fd-item')].every((i) => !i.classList.contains('fd-empe'))
      && [...document.querySelectorAll('.fd-med')].every((m) => m.textContent),
    { timeout: 20000 });
  const depois = await medidas();
  const virada = depois.find((m) => m.nome === empe.nome);
  ok(virada?.med === '10×6 · paisagem', `a arte em pé deitou (${empe?.med} → ${virada?.med})`);
  const aberto = await p.evaluate(() => !!document.getElementById('fundo-dlg')?.open);
  ok(aberto, 'a caixa continua aberta: girar não escolheu a arte nem fechou tudo');
  // O arquivo virou deitado, e o giro da ARENA tinha de sair junto: sem isso a
  // mesma arte apareceria girada duas vezes, e o conserto pioraria a imagem.
  await p.waitForFunction(() => /rotate\(0/.test(document.getElementById('gr-fundo')?.style.transform || ''),
    { timeout: 20000 }).catch(() => {});
  const depoisDoGiro = await giroDaArte();
  ok(depoisDoGiro.giro === 0,
    `girar o arquivo desfez o giro da arena, e não girou duas vezes (giro ${depoisDoGiro.giro}°)`);

  const subiu = await p.evaluate(() => ({
    up: (window.__SB.log || []).filter((x) => x.tipo === 'upload').length,
    rm: (window.__SB.log || []).filter((x) => x.tipo === 'remove').length,
  }));
  ok(subiu.up === 1 && subiu.rm === 1,
    `o arquivo novo subiu e o velho saiu do balde (${subiu.up} sobe, ${subiu.rm} sai)`);

  // ------------------------------------------- excluir pergunta antes de tirar
  await p.evaluate(() => {
    const it = [...document.querySelectorAll('.fd-item')].find((i) => /torre/i.test(i.textContent));
    it.querySelector('[data-rm]').click();
  });
  await p.waitForSelector('dialog.ui-dlg[open] .ui-dlg-ok', { timeout: 15000 });
  const pergunta = await p.evaluate(() =>
    document.querySelector('dialog.ui-dlg[open] .ui-dlg-msg')?.textContent || '');
  ok(/excluir/i.test(pergunta), 'excluir pergunta antes, e não some com a arte no clique');
  await p.evaluate(() => document.querySelector('dialog.ui-dlg[open] .ui-dlg-ok').click());
  await p.waitForFunction(() => document.querySelectorAll('.fd-item').length === 1, { timeout: 15000 });
  const sobrou = await medidas();
  ok(sobrou.length === 1 && !/torre/i.test(sobrou[0].nome),
    `sobrou só a outra arte na caixa (${sobrou.map((m) => m.nome).join(', ')})`);

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * O GRID NUM TELEFONE.
 *
 * O tabuleiro cresceu inteiro numa tela de notebook, e em 21/08 uma medição num
 * viewport de 390×844 achou o estrago: 456px de mobília antes do mapa (54% da
 * tela), a página com 1953px de rolagem, 44 controles abaixo do piso de toque de
 * 44px, e três defeitos de verdade (os botões da folha da ação nascendo fora da
 * tela, os do registro invisíveis sem hover, e o menu da peça sem caber em
 * paisagem). O conserto está no `Grid_Mobile.md`; esta cena é a cerca dele.
 *
 * Ela cobra o que se pode medir sozinho: quanto de tela sobra para o mapa, se a
 * página rola, se todo alvo alcança 44px, se cada folha cabe na janela, e se a
 * DECISÃO da folha da ação está visível sem rolar, que é o defeito que mais
 * custava. Os gestos entram por evento sintético: o que se prova aqui é a nossa
 * conta, e não o dedo do navegador.
 */
const TETO_MOBILIA = 150;

async function cenaCelular(br, url, { papel = 'mestre' } = {}) {
  console.log(`\n· o Grid num telefone de 390×844, na cadeira do ${papel}`);
  const p = await br.newPage();
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0`
    + (papel === 'jogador' ? '&papel=jogador' : ''), { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(1200);

  // Todo alvo que o dedo alcança, e o que sobrou de tela para o mapa.
  const pisoDeToque = () => p.evaluate(() => {
    const curtos = [];
    for (const b of document.querySelectorAll('button, select, input, a')) {
      const r = b.getBoundingClientRect();
      if (!r.height || !r.width) continue;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
      if (b.matches('a.ref, .prose a')) continue;   // link em texto corrido: o WCAG 2.5.8 isenta
      if (getComputedStyle(b).visibility === 'hidden') continue;
      if (r.height < 44 || r.width < 44) curtos.push(`${b.id || b.className}(${Math.round(r.width)}×${Math.round(r.height)})`);
    }
    return curtos;
  });

  const chao = await p.evaluate(() => ({
    mobilia: Math.round(document.querySelector('.gr-palco').getBoundingClientRect().top),
    rola: document.documentElement.scrollHeight > innerHeight + 1,
    barra: !document.querySelector('.gr-app').hidden
      && getComputedStyle(document.querySelector('.gr-app')).display !== 'none',
    zoom: parseInt(document.getElementById('gr-zval').textContent, 10),
    arena: !document.getElementById('ga-arena').hidden,
  }));
  ok(chao.mobilia <= TETO_MOBILIA,
    `a mobília antes do tabuleiro cabe em ${TETO_MOBILIA}px (são ${chao.mobilia})`);
  ok(!chao.rola, 'a página não rola: o que não cabe virou folha, e não pilha');
  ok(chao.barra, 'a barra do polegar está no ar');
  // Caber numa arena de 24 colunas daria 30%, que é um hexágono de 17px.
  ok(chao.zoom >= 35 && chao.zoom <= 100,
    `o tabuleiro abre enquadrado, e não menor do que o piso do dedo (${chao.zoom}%)`);
  ok(chao.arena === (papel === 'mestre'),
    `a barra é montada pelo papel (⧉ arena ${chao.arena ? 'presente' : 'ausente'})`);
  const curtos = await pisoDeToque();
  ok(curtos.length === 0, `todo alvo na tela chega a 44px (${curtos.slice(0, 3).join(', ') || 'nenhum abaixo'})`);

  // O botão de zoom é o ajuste fino no dedo, e a pinça é que salta: um degrau
  // de 15% passa direto pelo enquadramento que se queria.
  const degrau = papel !== 'mestre' ? null : await p.evaluate(async () => {
    const z = () => parseInt(document.getElementById('gr-zval').textContent, 10);
    document.getElementById('ga-arena')?.click();
    await new Promise((r) => setTimeout(r, 400));
    const antes = z();
    document.getElementById('gr-mais').click();
    const depois = z();
    document.getElementById('ga-arena')?.click();
    await new Promise((r) => setTimeout(r, 350));
    return depois - antes;
  });
  if (degrau !== null) ok(degrau === 5, `o botão de zoom anda de 5 em 5 no dedo (andou ${degrau})`);

  // ------------------------------------------------------------- as folhas
  const folhas = [['ga-campo', '.gr-lado', 'em campo'], ['ga-mais', '.mesa-barra', 'mais']];
  if (papel === 'mestre') folhas.splice(1, 0, ['ga-arena', '.gr-barra', 'arena']);
  for (const [botao, caixa, nome] of folhas) {
    const r = await p.evaluate(async (botao, caixa) => {
      document.getElementById(botao).click();
      await new Promise((r) => setTimeout(r, 420));
      const q = document.querySelector(caixa).getBoundingClientRect();
      const barra = document.querySelector('.gr-app').getBoundingClientRect();
      return { dentro: q.top >= 0 && q.bottom <= innerHeight + 1,
        acimaDaBarra: q.bottom <= barra.top + 2 || q.bottom - barra.top < 60,
        escurece: document.body.classList.contains('com-folha') };
    }, botao, caixa);
    ok(r.dentro && r.escurece, `a folha "${nome}" sobe inteira, com o tabuleiro escurecido atrás`);
    if (nome === 'em campo') {
      // Eram três caixas espremidas numa folha. O registro saiu de vez (ele mora
      // na Arena) e ficaram duas, numa folha que toma a tela inteira.
      const caixas = await p.evaluate(() => {
        const vis = (sel) => {
          const e = document.querySelector(sel);
          if (!e) return false;
          const r = e.getBoundingClientRect();
          return !!r.height && getComputedStyle(e).display !== 'none';
        };
        const dobrar = document.getElementById('gr-dobrar');
        dobrar.click();
        const depoisDeDobrar = vis('#gr-lista');
        dobrar.click();
        const folha = document.querySelector('.gr-lado').getBoundingClientRect();
        return { log: vis('#gr-log') || vis('.gr-reg-log'),
          inteira: Math.round(folha.height) >= innerHeight - 1 && Math.round(folha.top) <= 1,
          fecha: vis('#gr-campo-x'),
          lista: vis('#gr-lista'), dobrou: !depoisDeDobrar, voltou: vis('#gr-lista') };
      });
      ok(!caixas.log, 'o registro não mora mais no Campo: ele é da Arena');
      ok(caixas.inteira && caixas.fecha,
        'a folha toma a tela inteira, e diz por onde se sai');
      ok(caixas.lista && caixas.dobrou && caixas.voltou,
        'e a caixa de quem está em campo recolhe e volta');
      ok(!(await p.evaluate(() => {
        const e = document.querySelector('.gr-lado #gr-ef-lista');
        return !!e && getComputedStyle(e).display !== 'none';
      })), 'e os efeitos também saíram: a folha do Campo é de "Em campo", e de mais nada');
    }
    const c = await pisoDeToque();
    ok(c.length === 0, `e nada dentro dela fica abaixo de 44px (${c.slice(0, 3).join(', ') || 'nenhum'})`);
    await p.evaluate((b) => document.getElementById(b).click(), botao);
    await espera(350);
  }
  const fechou = await p.evaluate(() => document.body.classList.contains('com-folha'));
  ok(!fechou, 'e o mesmo botão que abriu fecha');

  // -------------------------------------------- a folha do ✦, e o slot dela
  // As duas linhas de efeito são de mentira: a bancada não tem Arte no ar, e o
  // que se prova aqui é o encanamento (o slot que acende com a conta, a folha
  // que abre, e o painel que é o MESMO da coluna, e não uma segunda lista).
  if (papel === 'mestre') {
    const noAr = await p.evaluate(async () => {
      const box = document.getElementById('gr-ef-lista');
      box.innerHTML = '<div class="gr-efl">a</div><div class="gr-efl">b</div>';
      box.hidden = false;
      document.getElementById('gr-ef-cab').hidden = false;
      // O ⏭ repinta a fila, e é a fila que sincroniza a barra do polegar.
      document.getElementById('ini-prox').click();
      await new Promise((r) => setTimeout(r, 700));
      const slot = document.getElementById('ga-efeitos');
      const antes = { aceso: !slot.hidden, conta: document.getElementById('ga-ef-n').textContent };
      slot.click();
      await new Promise((r) => setTimeout(r, 450));
      const f = document.getElementById('gr-ef-folha');
      const r = f.getBoundingClientRect();
      return { ...antes, alt: Math.round(r.height),
        colada: Math.abs(r.bottom - innerHeight) < 2 && Math.abs(r.left) < 2,
        painel: !!f.querySelector('#gr-ef-lista'),
        linhas: f.querySelectorAll('.gr-efl').length };
    });
    ok(noAr.aceso && noAr.conta === '2',
      `o ✦ acende na barra quando há Arte no ar, com a conta (${noAr.conta || 'vazia'})`);
    ok(noAr.colada && noAr.linhas === 2,
      `e abre a folha dos efeitos, do tamanho do que tem (${noAr.alt}px)`);
    ok(noAr.painel, 'a folha usa o MESMO painel da coluna, e não uma segunda lista');
    await p.evaluate(() => document.getElementById('gr-ef-x').click());
    await espera(350);
  }

  // ------------------------------------------------------ a tira da ordem
  // O cartão inteiro tem 11,5rem e diz cinco coisas: numa janela de 390px cabem
  // três, e a mesa pergunta "quem agora e quem em seguida", que são pelo menos
  // cinco. O daqui diz três (quem é, o nome, e o Tick que importa).
  const tira = await p.evaluate(() => {
    const lista = document.getElementById('gr-ini');
    const um = lista.querySelector('.ini-item');
    if (!um) return { vazia: true };
    const r = um.getBoundingClientRect();
    const av = um.querySelector('.av');
    const escondido = (sel) => {
      const e = um.querySelector(sel);
      return !e || getComputedStyle(e).display === 'none';
    };
    return {
      largura: Math.round(r.width),
      cabem: Math.floor(lista.clientWidth / r.width),
      quando: (um.querySelector('.ini-quando')?.textContent || '').replace(/\s+/g, ' ').trim(),
      quadrado: !!av && getComputedStyle(av).borderRadius !== '50%',
      resumido: escondido('.ini-fase') && escondido('.ini-num'),
      rola: lista.scrollWidth - lista.clientWidth,
    };
  });
  ok(tira.cabem >= 4, `cabem ${tira.cabem} cartões na tira (o cartão tem ${tira.largura}px)`);
  ok(tira.quadrado && tira.resumido,
    'o cartão é resumido, com o retrato quadrado: retrato, nome e o Tick');
  ok(/^(age|golpe|livre)\s*\d+$/i.test(tira.quando),
    `e o Tick que importa vem escrito no cartão ("${tira.quando}")`);

  const desliza = await p.evaluate(async () => {
    const lista = document.getElementById('gr-ini');
    const antes = lista.scrollLeft;
    const esqAntes = document.getElementById('ini-esq').disabled;
    document.getElementById('ini-dir').click();
    await new Promise((r) => setTimeout(r, 700));
    return { andou: lista.scrollLeft > antes + 20, esqAntes,
      esqDepois: document.getElementById('ini-esq').disabled,
      nevoa: lista.classList.contains('mais-esq') };
  });
  ok(desliza.andou, 'a seta desliza a tira');
  ok(desliza.esqAntes && !desliza.esqDepois && desliza.nevoa,
    'e a seta de voltar acende junto com a névoa da borda');

  const ordem = await p.evaluate(async () => {
    document.getElementById('ini-tudo').click();
    await new Promise((r) => setTimeout(r, 450));
    const dlg = document.getElementById('ordem-dlg');
    if (!dlg?.open) return { abriu: false };
    const box = document.getElementById('ord-lista');
    const r = dlg.getBoundingClientRect();
    return { abriu: true, pecas: box.querySelectorAll('.ini-item').length,
      degraus: box.querySelectorAll('.ini-grupo').length,
      folha: Math.abs(r.bottom - innerHeight) < 2,
      conta: (document.getElementById('ord-conta').textContent || '').slice(0, 30) };
  });
  ok(ordem.abriu && ordem.folha, 'o ⤢ abre a ordem inteira, como folha');
  ok(ordem.pecas === 12 && ordem.degraus > 1,
    `com todas as peças e os degraus (${ordem.pecas} peças, ${ordem.degraus} degraus)`);
  const pelaOrdem = await p.evaluate(async () => {
    document.querySelector('#ord-lista .ini-item').click();
    await new Promise((r) => setTimeout(r, 400));
    return { fechou: !document.getElementById('ordem-dlg').open,
      menu: !document.getElementById('tok-menu').hidden };
  });
  ok(pelaOrdem.fechou && pelaOrdem.menu, 'e tocar numa peça de lá abre o menu dela');
  await p.evaluate(() => document.getElementById('tok-menu').hidden = true);
  await espera(200);

  // ------------------------------------------------- os gestos de dois dedos
  const gestos = await p.evaluate(async () => {
    const palco = document.getElementById('gr-palco');
    const r = palco.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const zoom = () => parseInt(document.getElementById('gr-zval').textContent, 10);
    const pe = (t, id, x, y) => palco.dispatchEvent(new PointerEvent(t, { bubbles: true,
      pointerId: id, pointerType: 'touch', clientX: x, clientY: y, isPrimary: id === 1 }));
    const pausa = () => new Promise((r) => setTimeout(r, 40));
    const antes = zoom();
    pe('pointerdown', 1, cx - 40, cy); pe('pointerdown', 2, cx + 40, cy); await pausa();
    pe('pointermove', 1, cx - 100, cy); pe('pointermove', 2, cx + 100, cy); await pausa();
    const pincou = zoom();
    pe('pointerup', 1, cx - 100, cy); pe('pointerup', 2, cx + 100, cy); await pausa();
    const sx = palco.scrollLeft;
    pe('pointerdown', 3, cx, cy); await pausa();
    pe('pointermove', 3, cx - 90, cy); await pausa();
    const empurrou = palco.scrollLeft !== sx;
    pe('pointerup', 3, cx - 90, cy); await pausa();
    pe('pointerdown', 4, cx, cy); pe('pointerup', 4, cx, cy); await pausa();
    pe('pointerdown', 5, cx, cy); pe('pointerup', 5, cx, cy); await pausa();
    return { antes, pincou, empurrou, duploToque: zoom() };
  });
  ok(gestos.pincou > gestos.antes * 1.5,
    `a pinça amplia o tabuleiro, e não a página (${gestos.antes}% → ${gestos.pincou}%)`);
  ok(gestos.empurrou, 'um dedo no vazio empurra o mapa');
  // Contra o zoom de ABERTURA, e não contra o de antes da pinça: o toque duplo
  // promete o enquadramento com que a cena abriu, e não o último que a mão deixou.
  ok(gestos.duploToque === chao.zoom,
    `e o toque duplo devolve o enquadramento de abertura (${gestos.duploToque}% de ${chao.zoom}%)`);

  // -------------------------------------------- o menu da peça vira folha
  const menu = await p.evaluate(async () => {
    document.getElementById('ga-agir').click();
    await new Promise((r) => setTimeout(r, 450));
    const m = document.getElementById('tok-menu');
    if (!m || m.hidden) return { abriu: false };
    const r = m.getBoundingClientRect();
    const itens = [...m.querySelectorAll('button')].map((z) => z.getBoundingClientRect().height);
    return { abriu: true, dentro: r.top >= 0 && r.bottom <= innerHeight + 1,
      colado: Math.abs(r.left) < 2 && Math.abs(r.right - innerWidth) < 2,
      menor: Math.round(Math.min(...itens)), n: itens.length };
  });
  ok(menu.abriu && menu.colado, 'o ⚔ da barra abre o menu da peça, e ele nasce colado no pé');
  ok(menu.dentro, 'o menu inteiro cabe na tela');
  ok(menu.menor >= 44, `e cada linha dele alcança 44px (a menor tem ${menu.menor})`);

  // ---------------------------------------- a folha da ação decide sem rolar
  const acao = await p.evaluate(async () => {
    const at = document.querySelector('#tok-menu button[data-a="ataque"]');
    if (!at) return { semAtaque: true };
    at.click();
    await new Promise((r) => setTimeout(r, 350));
    const alvo = [...document.querySelectorAll('#gr-tokens .gr-token')]
      .find((z) => !z.classList.contains('atacante'));
    const rb = alvo.getBoundingClientRect();
    alvo.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
      clientX: rb.left + rb.width / 2, clientY: rb.top + rb.height / 2 }));
    await new Promise((r) => setTimeout(r, 900));
    const dlg = document.getElementById('alvo-dlg');
    if (!dlg?.open) return { abriu: false };
    const r = dlg.getBoundingClientRect();
    const btns = dlg.querySelector('.dlg-btns').getBoundingClientRect();
    return { abriu: true,
      folha: Math.abs(r.left) < 2 && Math.abs(r.bottom - innerHeight) < 2,
      decideSemRolar: btns.top >= 0 && btns.bottom <= innerHeight + 1,
      rolaPorDentro: dlg.querySelector('form').scrollHeight > r.height + 2 };
  });
  ok(acao.abriu && acao.folha, 'a folha da ação sobe do pé, na largura da tela');
  // O defeito medido em 21/08: 813px de conteúdo em 743 visíveis, e o que ficava
  // embaixo da dobra era justamente o par "Errou / Acertou · aplicar".
  ok(acao.decideSemRolar, 'e a decisão fica na tela sem rolar nada');
  await p.evaluate(() => document.getElementById('alvo-dlg').close());
  await espera(250);

  // -------------------------------------------------------- de lado, na mão
  await p.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await espera(600);
  const deitado = await p.evaluate(async () => {
    document.getElementById('ga-agir').click();
    await new Promise((r) => setTimeout(r, 450));
    const m = document.getElementById('tok-menu');
    const r = m.getBoundingClientRect();
    return { dentro: r.top >= 0 && r.bottom <= innerHeight + 1, alt: Math.round(r.height),
      rola: m.scrollHeight > m.clientHeight };
  });
  // Em pé o menu tinha 439px de altura, e o encaixe da borda devolvia topo
  // negativo numa tela de 390: ele saía por cima, sem nada que rolasse.
  ok(deitado.dentro, `de lado o menu continua dentro da tela (${deitado.alt}px numa janela de 390)`);
  await p.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await espera(400);

  // ------------------------------------------------------- a faixa da vez
  if (papel === 'jogador') {
    const vez = await p.evaluate(() => {
      const f = document.getElementById('gr-vez');
      const barra = document.querySelector('.gr-app').getBoundingClientRect();
      if (!f || f.hidden) return { visivel: false };
      const r = f.getBoundingClientRect();
      return { visivel: true, texto: f.textContent.replace(/\s+/g, ' ').trim(),
        acimaDaBarra: Math.abs(r.bottom - barra.top) < 3, titulo: document.title };
    });
    ok(vez.visivel && vez.acimaDaBarra, 'a faixa da vez aparece acima da barra do polegar');
    ok(/a sua vez/i.test(vez.texto || ''), `e diz de quem é (${(vez.texto || '').slice(0, 40)})`);
    ok(/sua vez/i.test(vez.titulo || ''),
      `o título da aba avisa quem está com o telefone noutra coisa (${vez.titulo})`);
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
  await cenaRastreador(br, dev.url);
  await cenaMapas(br, dev.url);
  await cenaCelular(br, dev.url);
  await cenaCelular(br, dev.url, { papel: 'jogador' });
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
  + ' de repintura, a mesma mesa vista pelo jogador, a tira da ordem no rastreador,'
  + ' a caixa de fundo girando e excluindo arte, e o telefone nas duas cadeiras');
