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

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  await cena(br, dev.url, { pecas: 12, cols: 24, rows: 16, nevoa: false });
  await cena(br, dev.url, { pecas: 30, cols: 40, rows: 30, nevoa: true });
  await cenaJogador(br, dev.url);
  await cenaRastreador(br, dev.url);
  await cenaMapas(br, dev.url);
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
  + ' e a caixa de fundo girando e excluindo arte');
