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
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const VER = process.argv.includes('--ver');
const MESA = MESA_BANCADA;
// A lista de caminhos e a politica de pular moram em `navegador.mjs`, uma vez
// so: eram oito copias, e tres delas tinham envelhecido cravadas no Edge do
// Windows.
const NAV = navegadorOuSair('Grid');

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
  const consola = [];
  p.on('pageerror', (e) => erros.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') consola.push(m.text().slice(0, 200)); });
  p.on('response', (r) => { if (r.status() >= 400) consola.push(`HTTP ${r.status()} ${r.url().slice(-60)}`); });
  // O GLOSSARIO NAO PODE VIR SOZINHO NUMA TELA DE INSTRUMENTO. O
  // `ref-index.json` custa 68,4 KB gzipados, e no Grid nao ha prosa para linkar.
  // Isto conta os pedidos dele, e o teste cobra dois lados: nenhum na abertura,
  // e UM quando alguem aponta para um link, que e o caminho sob demanda.
  const refReqs = [];
  p.on('request', (r) => { if (r.url().includes('ref-index')) refReqs.push(r.url()); });
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=${pecas}&cols=${cols}&rows=${rows}&nevoa=${nevoa ? 1 : 0}`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  // A ESPERA QUE CONTA O QUE VIU, e nao so que desistiu.
  //
  // Este `waitForSelector` estourava com um `TimeoutError` cru, e foi assim que
  // o smoke falhou no CI de 27/08 a 04/09 sem que ninguem soubesse por que: a
  // pilha diz que o seletor nao apareceu e nao diz o que a pagina fez. Os erros
  // de pagina, os de console e as respostas 4xx/5xx ja estavam sendo coletados
  // logo acima; faltava alguem imprimi-los.
  try {
    await p.waitForSelector('#gr-tokens .gr-token', { timeout: 45000 });
  } catch (e) {
    const estado = await p.evaluate(() => ({
      titulo: document.title,
      temPalco: !!document.getElementById('gr-palco'),
      temCamada: !!document.getElementById('gr-tokens'),
      corpo: (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 300),
    })).catch(() => ({ titulo: '(a pagina nem respondeu)' }));
    console.log('  ✘ o tabuleiro nao desenhou peca nenhuma. O que a pagina disse:');
    console.log(`      titulo=${estado.titulo} palco=${estado.temPalco} camada=${estado.temCamada}`);
    console.log(`      corpo: ${estado.corpo}`);
    for (const x of erros.slice(0, 5)) console.log(`      pageerror: ${x.slice(0, 200)}`);
    for (const x of consola.slice(0, 8)) console.log(`      console: ${x}`);
    if (!erros.length && !consola.length) console.log('      (nenhum erro de pagina nem de console)');
    throw e;
  }

  // ------------------------------------------- o glossario NAO veio sozinho
  {
    // O `requestIdleCallback` do componente roda depois do `networkidle0`, entao
    // esperar um pouco e o que da a chance de ele errar. Sem esta espera o teste
    // passaria mesmo com o defeito de volta.
    await espera(700);
    const off = await p.evaluate(() => document.body.dataset.refs === 'off');
    ok(off, 'o Grid se declara tela de instrumento (data-refs="off")');
    ok(refReqs.length === 0,
      `e o ref-index.json (68,4 KB) nao e baixado na abertura (${refReqs.length} pedido(s))`);
    // E o cartao de referencia continua existindo: apontar para um link do
    // conteudo carrega o indice na hora. Se este lado quebrar, a economia acima
    // virou perda de funcionalidade em silencio.
    const temLink = await p.evaluate(() => !!document.querySelector('main a[href]'));
    if (temLink) {
      await p.evaluate(() => {
        const a = document.querySelector('main a[href]');
        a.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      });
      await espera(600);
      ok(refReqs.length === 1,
        `e apontar para um link carrega o indice sob demanda (${refReqs.length} pedido(s))`);
    }
  }

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
        return it.length > 1 && it[1].getBoundingClientRect().left > it[0].getBoundingClientRect().left; })(),
      // Empilhada de verdade, e não só "não deitada": duas peças no mesmo
      // ponto passariam pelo `!deitada` sem a fila estar em pé.
      empilhada: (() => { const it = document.querySelectorAll('#gr-ini .ini-item');
        return it.length > 1 && it[1].getBoundingClientRect().top > it[0].getBoundingClientRect().top; })() };
  });
  // ESTA CERCA MUDOU DE LADO, e de propósito. Até 26/08 ela cobrava o
  // contrário: a fila DEITADA em cima do tabuleiro, na largura dele. O
  // argumento de então continua valendo (a ordem de combate é de todos, e não
  // um apêndice do painel do mestre) e é por isso que ela não voltou para a
  // coluna da direita: ela está à ESQUERDA, encostada na cena.
  // O que mudou foi a conta. Deitada, ela cobrava 118px de ALTURA, e a altura é
  // o que decide o tamanho do mapa num tabuleiro quase quadrado · sobrava
  // metade da largura sem uso. De pé ela cobra 8% de uma largura que sobrava, e
  // o mapa cresce ~35% em 1440. Ver Grid_melhorias.md, 27/08.
  ok(lug.ini.l < lug.palco.l && Math.abs(lug.ini.t - lug.palco.t) < 2,
    'a iniciativa fica à esquerda do tabuleiro, na altura dele');
  ok(lug.ini.w < lug.palco.w / 3,
    `e é um trilho estreito, não uma tira larga (${Math.round(lug.ini.w)}px)`);
  ok(lug.empilhada && !lug.deitada, 'as peças da fila correm para baixo, e não para o lado');
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
    // A FOLHA SEM CONTA NENHUMA, e este e o instante que interessa: o total
    // ainda nao foi digitado, entao a regua nao tem o que dizer. Antes do
    // conserto de 04/09 a caixa esvaziava e o "Acertou" acendia como principal,
    // ou seja, a tela recomendava acertar justamente quando nao sabia de nada.
    folha.semConta = {
      vered: (document.getElementById('al-vered')?.textContent || '').trim(),
      prim: ['al-sim', 'al-qa', 'al-nao']
        .filter((id) => document.getElementById(id)?.classList.contains('primary')),
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
    // Quatro faixas desde 24/08: o Quase-Acerto entrou entre o acerto e o
    // ajuste, porque ele se lê logo depois de saber quanto faltou.
    ok(f.secoes === 4,
      `a folha da acao tem as quatro faixas: acerto, Quase-Acerto, ajuste e dano (${f.secoes})`);
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
    // SEM CONTA, NENHUM BOTAO E O PRINCIPAL. As duas asserçoes sao uma coisa so:
    // a ausencia de resposta precisa de cara propria, e nunca da cara de uma das
    // tres respostas. A segunda e a que teria pego o defeito.
    const sc = f.semConta || {};
    ok((sc.vered || '').length > 0,
      `sem total digitado a caixa diz o que falta ("${sc.vered}")`);
    ok((sc.prim || []).length === 0,
      `e nenhum dos tres botoes acende como principal (acesos: ${(sc.prim || []).join(', ') || 'nenhum'})`);
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

  // ------------------------------------------- e o segundo alvo: so o mapa
  //
  // Sao dois botoes, e a diferenca entre eles e a ordem de combate. Aqui se
  // ENTRA na tela cheia de verdade (o clique do Puppeteer vale como gesto do
  // usuario, e o headless novo aceita a Fullscreen API), porque o que precisa
  // ser provado e qual elemento o navegador projetou.
  const doisAlvos = await (async () => {
    const ler = () => p.evaluate(() => {
      const fe = document.fullscreenElement;
      const r = document.getElementById('gr-palco').getBoundingClientRect();
      return { alvo: fe ? (fe.id || fe.className.split(' ')[0]) : null,
        classe: document.body.className, palco: Math.round(r.height),
        rot: [document.getElementById('gr-cheia').textContent,
          document.getElementById('gr-cheia-mapa').textContent] };
    });
    const shiftF = async () => { await p.keyboard.down('Shift'); await p.keyboard.press('KeyF'); await p.keyboard.up('Shift'); };
    try {
      const fora = await ler();
      await p.click('#gr-cheia'); await espera(900);
      const grade = await ler();
      // A troca de alvo e pela tecla, e nao pelo botao: em tela cheia a barra da
      // arena esta escondida (o modo TV entra junto), entao o botao nao esta la
      // para ser clicado. E de proposito: quem projetou nao quer a barra.
      await shiftF(); await espera(900);
      const mapa = await ler();
      await p.keyboard.press('KeyF'); await espera(900);
      const volta = await ler();
      await p.evaluate(() => document.getElementById('gr-sair-cheia').click());
      await espera(700);
      return { fora, grade, mapa, volta, saiu: await ler() };
    } catch (e) {
      try { await p.evaluate(() => document.exitFullscreen?.()); } catch {}
      return null;
    }
  })();
  if (doisAlvos && doisAlvos.grade.alvo) {
    const { fora, grade, mapa, volta, saiu } = doisAlvos;
    ok(grade.alvo === 'gr-grade', `o ⛶ projeta a GRADE, com a ordem de combate junto (${grade.alvo})`);
    ok(mapa.alvo === 'gr-palco', `e o ▣ projeta so o MAPA (${mapa.alvo})`);
    ok(mapa.palco > grade.palco,
      `sem a tira, o tabuleiro fica com a altura dela (${grade.palco} -> ${mapa.palco}px)`);
    ok(/cheia-mapa/.test(mapa.classe) && !/cheia-mapa/.test(grade.classe),
      'e a marca no corpo diz qual das duas redes de seguranca vale');
    ok(mapa.rot[1] === '⤡' && mapa.rot[0] === '⛶',
      'so o botao que esta de pe vira "sair", e o outro continua oferecendo o alcance dele');
    ok(volta.alvo === 'gr-grade', 'o F devolve a ordem de combate sem sair e entrar de novo');
    ok(!saiu.alvo && !/tela-cheia|cheia-mapa/.test(saiu.classe) && saiu.palco === fora.palco,
      'e o X do canto sai, de qualquer um dos dois');
  }

  // ------------------------------------ toda caixa nasce no centro da janela
  //
  // A de conjurar ja morou encostada na direita, para sobrar a faixa esquerda
  // do tabuleiro. O preco era ela ser a UNICA caixa do sistema que nao nascia
  // onde o olho a procura. Quem precisar do que esta debaixo arrasta pela
  // cabeca, que e alca. A conta e do centro dela contra o centro da janela.
  const centradas = await p.evaluate(async () => {
    const desvio = () => {
      const d = document.querySelector('dialog[open]');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      return { nome: d.className.replace('ui-dlg ', '').trim(),
        dx: Math.round(r.left + r.width / 2 - innerWidth / 2),
        dy: Math.round(r.top + r.height / 2 - innerHeight / 2) };
    };
    const espera = (ms) => new Promise((r) => setTimeout(r, ms));
    const fecha = async () => { document.querySelector('dialog[open]')?.close(); await espera(300); };
    const fora = [];
    for (const btn of ['#gr-nova', '#gr-fundo-btn', '#gr-registro', '#gr-npc']) {
      document.querySelector(btn)?.click();
      await espera(600);
      const d = desvio(); if (d && (Math.abs(d.dx) > 2 || Math.abs(d.dy) > 2)) fora.push(d);
      await fecha();
    }
    // E a de conjurar, que e a que estava fora do centro. Ela so existe para
    // quem manda na peca: na cadeira do jogador, um token que nao e dele nao
    // oferece a Arte, e ai nao ha o que medir.
    let conj = null;
    const t = document.querySelector('#gr-tokens .gr-token');
    const r = t.getBoundingClientRect();
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }));
    await espera(450);
    const arte = document.querySelector('#tok-menu button[data-a="arte"]');
    if (arte) {
      arte.click();
      await espera(900);
      conj = desvio();
      await fecha();
    } else {
      document.getElementById('tok-menu')?.setAttribute('hidden', '');
    }
    return { fora, conj };
  });
  if (centradas) {
    ok(!centradas.fora.length,
      `as caixas da arena nascem no centro da janela (${centradas.fora.length ? JSON.stringify(centradas.fora) : 'as quatro'})`);
    if (centradas.conj && /ui-dlg-conj/.test(centradas.conj.nome)) {
      ok(Math.abs(centradas.conj.dx) <= 2 && Math.abs(centradas.conj.dy) <= 2,
        `e a de conjurar tambem, que era a unica encostada na direita (desvio ${centradas.conj.dx},${centradas.conj.dy})`);
    }
  }

  // -------------------------------- a caixa se estica pelo canto, como janela
  //
  // A cabeca diz ONDE ela fica, o canto diz DE QUE TAMANHO ela e. As duas
  // existem pelo mesmo motivo: a caixa tapa o tabuleiro que ela manda olhar.
  // Aqui se arrasta de verdade, com o mouse, porque o que precisa ser provado e
  // a conta que segue o ponteiro e os limites que a seguram.
  const canto = await (async () => {
    const abrir = async () => {
      await p.evaluate(() => {
        const t = document.querySelector('#gr-tokens .gr-token');
        const r = t.getBoundingClientRect();
        t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }));
      });
      await espera(450);
      const tem = await p.evaluate(() => !!document.querySelector('#tok-menu button[data-a="arte"]'));
      if (!tem) { await p.evaluate(() => document.getElementById('tok-menu')?.setAttribute('hidden', '')); return false; }
      await p.evaluate(() => document.querySelector('#tok-menu button[data-a="arte"]').click());
      await espera(900);
      // A peca pode ter o item e mesmo assim nao abrir a caixa (sem Centelha, o
      // caminho e outro). Quem responde e a caixa estar la, e nao o menu.
      return p.evaluate(() => !!document.querySelector('dialog[open].ui-dlg-conj'));
    };
    if (!await abrir()) {
      await p.evaluate(() => document.querySelector('dialog[open]')?.close());
      return null;
    }
    const med = () => p.evaluate(() => {
      const d = document.querySelector('dialog[open].ui-dlg-conj');
      if (!d) return null;
      const r = d.getBoundingClientRect();
      const ok = d.querySelector('#ag-ok')?.getBoundingClientRect();
      return { l: Math.round(r.width), a: Math.round(r.height),
        x: Math.round(r.left), y: Math.round(r.top),
        // A decisao tem de continuar DENTRO da caixa em todo tamanho: um
        // formulario sem como enviar e pior que um formulario apertado.
        decisaoDentro: !!ok && ok.bottom <= r.bottom + 1 && ok.right <= r.right + 1,
        naTela: r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1 };
    });
    const puxar = async (sel, dx, dy) => {
      const c = await p.evaluate((s) => {
        const e = document.querySelector(s);
        if (!e) return null;
        const r = e.getBoundingClientRect();
        return { x: s === '.ui-dlg-canto' ? r.left + r.width / 2 : r.left + 40, y: r.top + r.height / 2 };
      }, sel);
      if (!c) return false;
      await p.mouse.move(c.x, c.y); await p.mouse.down();
      for (let i = 1; i <= 8; i++) { await p.mouse.move(c.x + dx * i / 8, c.y + dy * i / 8); await espera(25); }
      await p.mouse.up(); await espera(300);
      return true;
    };
    const temAlca = await p.evaluate(() => {
      const c = document.querySelector('dialog[open].ui-dlg-conj .ui-dlg-canto');
      if (!c) return null;
      const r = c.getBoundingClientRect();
      return { l: Math.round(r.width), a: Math.round(r.height), display: getComputedStyle(c).display };
    });
    const antes = await med();
    await puxar('.ui-dlg-canto', 240, 120);
    const maior = await med();
    await puxar('.ui-dlg-canto', -2000, -2000);
    const chao = await med();
    await puxar('.ui-dlg-canto', 4000, 4000);
    const teto = await med();
    // Mover pela cabeca e esticar pelo canto tem de conviver: depois de mover,
    // a caixa cresce PARA ONDE a mao puxa e nao volta para o centro.
    await puxar('.ui-dlg-pega', -260, -90);
    const movida = await med();
    await puxar('.ui-dlg-canto', 120, 60);
    const depois = await med();
    await p.evaluate(() => document.querySelector('dialog[open].ui-dlg-conj .ui-dlg-x')?.click());
    await espera(400);
    await abrir();
    const nova = await med();
    await p.evaluate(() => document.querySelector('dialog[open]')?.close());
    await espera(300);
    return { temAlca, antes, maior, chao, teto, movida, depois, nova };
  })();
  if (canto) {
    const { temAlca, antes, maior, chao, teto, movida, depois, nova } = canto;
    ok(temAlca && temAlca.display !== 'none' && temAlca.l >= 16 && temAlca.a >= 16,
      `a caixa de conjurar tem alca no canto (${temAlca ? `${temAlca.l}x${temAlca.a}` : 'nenhuma'})`);
    ok(maior.l > antes.l + 200 && maior.a > antes.a + 100,
      `puxar o canto estica a caixa (${antes.l}x${antes.a} -> ${maior.l}x${maior.a})`);
    ok(chao.l < maior.l && chao.a < maior.a && chao.decisaoDentro,
      `e empurrar de volta encolhe, ate um chao que ainda cabe a decisao (${chao.l}x${chao.a})`);
    ok(teto.naTela && teto.l > chao.l,
      `o teto e a borda da janela, para a alca nunca sair da tela (${teto.l}x${teto.a} em ${teto.x},${teto.y})`);
    ok(movida.x < teto.x && movida.l === teto.l,
      `mover pela cabeca nao mexe no tamanho (${movida.x},${movida.y})`);
    ok(depois.x === movida.x && depois.y === movida.y && depois.l > movida.l,
      'e esticar depois de mover cresce para onde a mao puxa, sem recentrar');
    ok(nova.l === antes.l && nova.a === antes.a,
      `fechar e reabrir devolve o tamanho de fabrica (${nova.l}x${nova.a})`);
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
    // Eram dois até 27/08, quando o Combate Simultâneo entrou como o terceiro
    // (`a3bc286`, frente do combate). A lista fica escrita aqui inteira de
    // propósito: é o contrato do painel, e um sistema que entra ou sai sem
    // passar por esta linha entra sem ninguém decidir.
    ok(tempo.sis.join(',') === 'normal,pgr,simultaneo',
      `o painel oferece os três sistemas (${tempo.sis.join(', ')})`);
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
 * A VISTA DO JOGADOR COM A NEVOA LIGADA, e ela e o unico lugar onde uma
 * afirmacao sobre o que ele ve pode ser falsificada.
 *
 * Ate 04/09/2026 nao dava. O `token_visao` do mock era a MESMA lista da escrita,
 * entao o jogador recebia as doze pecas mesmo com a nevoa ligada, e a unica cena
 * de jogador do smoke rodava com `nevoa=0`. Nenhuma frase sobre a vista dele era
 * checavel, e foi por esse buraco que um vazamento de informacao chegou a
 * producao: uma Arte AINDA EM MONTAGEM acendia doze casas de escuro, cinco Ticks
 * antes de existir, e a mesma conta decide que pecas o jogador recebe.
 *
 * As duas asserçoes que importam sao a terceira e a quarta: o fogo agendado NAO
 * acende, e o fogo que caiu acende. Elas sao o par, e so o par prova a regra:
 * uma sozinha passaria com a luz quebrada.
 */
async function cenaJogadorNevoa(br, url) {
  console.log('\n· a cadeira do jogador, com a nevoa ligada');
  const erros = [];
  /** Abre a cena do jogador com nevoa e devolve o que a tela desenhou. */
  const abrir = async (brasa, papel = 'jogador', extra = '') => {
    const p = await br.newPage();
    await p.setViewport({ width: 1400, height: 950 });
    p.on('pageerror', (e) => erros.push(e.message));
    const q = (brasa === null ? '' : `&brasa=${brasa}`) + extra;
    await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=1&papel=${papel}${q}`,
      { waitUntil: 'networkidle0', timeout: 60000 });
    await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
    await espera(700);
    const d = await p.evaluate(() => ({
      tokens: document.querySelectorAll('#gr-tokens .gr-token').length,
      claras: document.querySelectorAll('#gr-nevoa .nv-clara').length,
      escuras: document.querySelectorAll('#gr-nevoa .nv-pesada, #gr-nevoa .nv-leve').length,
      jogador: document.body.classList.contains('sou-jogador'),
      // O painel lateral dos efeitos: o texto que ele mostra a quem está olhando.
      lista: (document.getElementById('gr-ef-lista')?.innerText || '').trim(),
      // Quantas linhas de efeito chegaram ao navegador. Zero com a Arte em
      // montagem é a PAREDE (a view cortou); mais que zero com ela escondida da
      // tela seria só a cortina.
      recebidos: (window.__SB?.tabelas?.efeito_visao || []).length,
      // OS EFEITOS INTEIROS, e nao so a contagem: o corte da migracao 32 e
      // DENTRO do jsonb (os hexagonos escuros saem da mancha), entao contar
      // linhas nao veria a metade do conserto.
      efeitos: (window.__SB?.tabelas?.efeito_visao || []).map((e) => ({
        id: e.id, hexes: (e.hexes || []).length,
        conj: e.conjurador_id, alvos: (e.alvos || []).length, centro: !!e.centro,
      })),
      // O relógio como ESTA cadeira o recebe. `undefined` quer dizer que a
      // coluna não veio na view, que é o estado anterior à migração 31.
      relogio: (window.__SB?.tabelas?.encontro_visao || [])[0]?.tick_atual,
      // O aviso do chão da cena, que é a degradação quando o relógio não chega.
      aviso: (document.getElementById('gr-carimbo')?.hidden === false
        ? document.getElementById('gr-carimbo').textContent : ''),
    }));
    await p.close();
    return d;
  };

  const sem = await abrir(null);
  ok(sem.jogador, 'a pagina abre como jogador');
  ok(sem.escuras > 0, `a nevoa cobre casas de verdade (${sem.escuras} escuras, ${sem.claras} claras)`);
  // A PROVA DE QUE A VISTA E CORTADA. Antes de 04/09 o `token_visao` do mock era
  // a mesma lista da escrita e o jogador recebia as doze pecas: nenhuma frase
  // sobre o que ele ve era falsificavel, e foi por esse buraco que o vazamento
  // chegou a producao.
  ok(sem.tokens > 0 && sem.tokens < 12,
    `com nevoa o jogador recebe menos pecas do que a cena tem (${sem.tokens} de 12)`);

  // ---- O PAR QUE PROVA A REGRA. Uma asserçao sozinha passaria com a luz
  // quebrada; sao as duas juntas que dizem que o corte e pelo ESTADO.
  // ---- O CASO E: A ARTE NO ESCURO, e o corte e DENTRO da mancha ----
  //
  // A migracao 31 cortou a `efeito_visao` por ESTADO e deixou de pe o que nem
  // existia: corte de CASA nenhum. Uma Arte inteira no escuro chegava ao
  // navegador do jogador com nome, hexes, condicao, alvos e conjurador.
  //
  // A BRASA NAO SERVE PARA MEDIR ISTO, e essa e a armadilha desta cena: ela e
  // de fogo, e fogo abre o escuro em volta de si pela `casa_clara`. Uma zona
  // que se ilumina sozinha NUNCA esta no escuro, e um teste feito com ela
  // mediria a luz do fogo achando que mediu a parede. Por isso o `?sombra=1`,
  // que poe duas zonas de `sombra`, que nao acendem nada.
  //
  // O PAR, e ele esta dentro de um objeto so:
  //   · `ef-sombra-meia` tem DOIS hexagonos, um em cima do PC e um longe. Ela
  //     TEM de chegar (a asserçao positiva) e chegar com UM (a negativa).
  //   · `ef-sombra-toda` tem os dois longe, e nao pode chegar.
  // Sem a primeira, "a escura nao chegou" passaria com a cena nao montada.
  {
    const mestre = await abrir(null, 'mestre', '&sombra=1');
    const jog = await abrir(null, 'jogador', '&sombra=1');
    const acha = (d, id) => (d.efeitos || []).find((e) => e.id === id);
    const mMeia = acha(mestre, 'ef-sombra-meia');
    const mToda = acha(mestre, 'ef-sombra-toda');
    ok(!!mMeia && mMeia.hexes === 2 && !!mToda && mToda.hexes === 2,
      `o mestre recebe as duas zonas inteiras (${mMeia?.hexes} e ${mToda?.hexes} hexagonos)`);
    ok(!!mMeia?.conj, 'e com o conjurador, que esta no escuro dele tambem');

    const jMeia = acha(jog, 'ef-sombra-meia');
    const jToda = acha(jog, 'ef-sombra-toda');
    ok(!!jMeia, 'A ZONA COM UM PE NA LUZ CHEGA ao jogador (a gemea que faz o par valer)');
    ok(jMeia?.hexes === 1,
      `e chega APARADA, so com o hexagono que ele enxerga (${mMeia?.hexes} -> ${jMeia?.hexes})`);
    ok(!jToda, 'A ZONA INTEIRA NO ESCURO NAO CHEGA ao navegador dele');
    ok(jMeia && jMeia.conj == null,
      `e o conjurador no escuro nao viaja junto (${jMeia?.conj ?? 'nulo'})`);
    ok(jMeia && jMeia.alvos === 0,
      `nem os alvos que estao no escuro (${mMeia?.alvos} -> ${jMeia?.alvos})`);
  }

  const montando = await abrir(5);
  const caiu = await abrir(0);
  ok(montando.claras === sem.claras,
    `a Arte em montagem NAO abre o escuro (${sem.claras} -> ${montando.claras} casas claras)`);
  ok(caiu.claras > sem.claras,
    `e a mesma Arte, caida, abre (${sem.claras} -> ${caiu.claras})`);
  ok(montando.tokens === sem.tokens,
    `e nenhuma peca a mais chega ao jogador pelo gesto (${sem.tokens} -> ${montando.tokens})`);
  // O painel lateral e a segunda tela do mesmo dado, e ela vazava em texto o que
  // o desenho ja escondia.
  ok(!/Brasa/.test(montando.lista),
    `a lista de efeitos nao conta ao jogador a Arte em montagem ("${montando.lista.slice(0, 40)}")`);
  ok(/Brasa/.test(caiu.lista), 'e conta a que ja caiu');
  // A PAREDE, e nao a cortina. As duas asserçoes acima passam so com o guarda do
  // CLIENTE: a tela esconde e o dado continua no navegador, onde qualquer um le.
  // Esta olha o que de fato CHEGOU, e e a unica que cai se a `efeito_visao`
  // parar de cortar. Conferido nos dois sentidos.
  ok(montando.recebidos === 0,
    `e a linha nem chega ao navegador dele: a view cortou (${montando.recebidos} efeitos recebidos)`);
  ok(caiu.recebidos === 1, `a que caiu chega (${caiu.recebidos})`);

  // ---- O RELOGIO DO JOGADOR, e o par que o falsifica ----
  //
  // As quatro asserçoes acima rodam com a cena no Tick 0, e nesse ponto "a Arte
  // caiu" e "o relogio nao chegou" dao a MESMA resposta: `desde_tick` 0 nao esta
  // no futuro de tick nenhum. O zero era certo por acaso.
  //
  // Com a cena no Tick 5 os dois se separam. A Arte que caiu no 3 tem de abrir o
  // escuro: se `encontro_visao` nao mandar `tick_atual`, o jogador le zero, acha
  // que ela ainda esta sendo montada, e a nevoa fica fechada. Conferido tirando
  // a coluna da projeçao do mock: esta cai, a gemea abaixo continua passando.
  // No SIMULTANEO, e nao no P/G/R: so ali o relogio da cena e `tick_atual`. No
  // P/G/R ele sai da fila (`tickDaVez`), que na bancada esta toda no Tick 0, e a
  // cena responderia zero com a coluna chegando ou nao. Descoberto por esta
  // asserçao falhando com o relogio correto na mao: a cena tem de ser a do
  // sistema que le o relogio, ou o par nao separa nada.
  const SIM5 = '&tick=5&tempo=simultaneo';
  const base5 = await abrir(null, 'jogador', SIM5);
  const tarde = await abrir(3, 'jogador', SIM5);
  const aindaMont = await abrir(7, 'jogador', SIM5);
  ok(tarde.relogio === 5, `o relogio da cena chega ao jogador (tick_atual = ${tarde.relogio})`);
  ok(tarde.claras > base5.claras,
    `a Arte caida ha dois Ticks abre o escuro dele (${base5.claras} -> ${tarde.claras})`);
  ok(aindaMont.claras === base5.claras,
    `e a que ainda falta cair, no mesmo Tick, nao abre (${base5.claras} -> ${aindaMont.claras})`);
  ok(!tarde.aviso, `sem aviso de migraçao quando o relogio chega ("${tarde.aviso}")`);

  // E O BANCO DE HOJE, que e o que esta no ar ate alguem rodar a 31: a view sem
  // `tick_atual`. A pagina nao pode quebrar, tem de errar para o lado seguro (a
  // Arte caida NAO abre, em vez de a montada abrir) e tem de dizer o que falta.
  const velho = await abrir(3, 'jogador', SIM5 + '&semrelogio=1');
  ok(velho.relogio === undefined, 'sem a migraçao 31 o relogio nao chega ao jogador');
  ok(velho.tokens > 0, `e a pagina desenha assim mesmo (${velho.tokens} pecas)`);
  ok(velho.claras === base5.claras,
    `errando para o lado seguro: o escuro fica fechado (${base5.claras} -> ${velho.claras})`);
  ok(/rel[oó]gio/i.test(velho.aviso), `e o chao da cena diz o que falta ("${velho.aviso}")`);

  // ---- O MESTRE, do outro lado da mesma regra ----
  //
  // Ele LE `arena_efeitos` inteiro, entao a linha em montagem chega ao navegador
  // dele de proposito: ele precisa ver a mancha tracejada. O que nao pode e a
  // nevoa acender por ela. Esta e a prova do guarda no CLIENTE (`casasClaras`),
  // que o caminho do jogador nao exercita porque la a view ja cortou antes.
  const mSem = await abrir(null, 'mestre');
  const mMont = await abrir(5, 'mestre');
  const mCaiu = await abrir(0, 'mestre');
  ok(mMont.claras === mSem.claras,
    `no mestre tambem: a Arte em montagem nao abre o escuro (${mSem.claras} -> ${mMont.claras})`);
  ok(mCaiu.claras > mSem.claras,
    `e a caida abre (${mSem.claras} -> ${mCaiu.claras})`);
  ok(/Brasa/.test(mMont.lista),
    'e o mestre CONTINUA vendo a Arte em montagem na lista, que e o que ele precisa');

  ok(erros.length === 0, `nenhum erro de pagina (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
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
      // MEIO PIXEL DE FOLGA, e a mensagem com o numero DE VERDADE.
      //
      // No runner de CI (Chrome/Linux) tres alvos mediam 43,99 e caiam; a
      // mensagem os imprimia arredondados, entao ela dizia `gr-dobrar(44×44)`
      // ao lado de "abaixo de 44px", que se le como contradiçao e custa uma
      // hora. Meio pixel nao e falha de desenho: e sub-pixel de renderizaçao,
      // e ele muda de navegador para navegador.
      if (r.height < 43.5 || r.width < 43.5) {
        const n = (v) => (Math.abs(v - Math.round(v)) < 0.01 ? String(Math.round(v)) : v.toFixed(2));
        curtos.push(`${b.id || b.className}(${n(r.width)}×${n(r.height)})`);
      }
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
      /*
       * ESPERA A ANIMAÇÃO ACABAR, e não um relógio.
       *
       * Eram 420 ms cravados contra uma transição de 220 ms, e em 04/09/2026 o
       * CI mediu a folha da arena **3,2 px abaixo** do pé da tela: topo 172,0 em
       * vez de 168,8, a caixa inteira deslocada e a altura certa. Não é layout,
       * é o rabo do `ease`: `translateY(101%)` de 675 px parado a 0,5% do fim,
       * porque o runner engasgou entre o clique e o quadro seguinte.
       *
       * Dobrar o tempo de espera só empurra o problema, e afrouxar os 2 px de
       * folga apagaria o defeito que esta asserção existe para pegar (uma folha
       * que NÃO sobe erra por centenas de pixels, não por três). Então
       * espera-se a coisa: dois quadros para a transição nascer, e o
       * `finished` de cada animação da caixa. O teto de 2 s é rede, e não
       * medida: se ele for atingido, a asserção mede o que houver e falha
       * dizendo por quanto.
       */
      const el = document.querySelector(caixa);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await Promise.race([
        Promise.all(el.getAnimations().map((a) => a.finished.catch(() => {}))),
        new Promise((r) => setTimeout(r, 2000)),
      ]);
      await new Promise((r) => requestAnimationFrame(r));
      const q = el.getBoundingClientRect();
      const barra = document.querySelector('.gr-app').getBoundingClientRect();
      return { dentro: q.top >= -2 && q.bottom <= innerHeight + 2,
        // A MEDIDA SAI NA MENSAGEM, sempre. No Chrome/Linux esta caixa caiu por
        // sub-pixel e a frase não dizia por quanto: "não sobe inteira" pode ser
        // meio pixel ou meia tela, e as duas pedem consertos opostos.
        medida: `topo ${q.top.toFixed(1)}, fundo ${q.bottom.toFixed(1)} de ${innerHeight}`,
        acimaDaBarra: q.bottom <= barra.top + 2 || q.bottom - barra.top < 60,
        escurece: document.body.classList.contains('com-folha') };
    }, botao, caixa);
    ok(r.dentro && r.escurece,
      `a folha "${nome}" sobe inteira, com o tabuleiro escurecido atrás (${r.medida})`);
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
          // DOIS PIXELS DE FOLGA, e as medidas saem na mensagem. Com um pixel a
          // folha caiu no Chrome/Linux e passava no Edge/Windows, e a mensagem
          // nao dizia por quanto: um teto de tela cheia que erra por sub-pixel
          // nao e defeito de desenho, e sem o numero nao da para saber se e.
          medida: `${Math.round(folha.height)} de ${innerHeight}px, topo ${Math.round(folha.top)}`,
          inteira: Math.round(folha.height) >= innerHeight - 2 && Math.round(folha.top) <= 2,
          fecha: vis('#gr-campo-x'),
          lista: vis('#gr-lista'), dobrou: !depoisDeDobrar, voltou: vis('#gr-lista') };
      });
      ok(!caixas.log, 'o registro não mora mais no Campo: ele é da Arena');
      ok(caixas.inteira && caixas.fecha,
        `a folha toma a tela inteira, e diz por onde se sai (${caixas.medida})`);
      ok(caixas.lista && caixas.dobrou && caixas.voltou,
        'e a caixa de quem está em campo recolhe e volta');
      ok(!(await p.evaluate(() => {
        const e = document.querySelector('.gr-lado #gr-ef-lista');
        return !!e && getComputedStyle(e).display !== 'none';
      })), 'e os efeitos também saíram: a folha do Campo é de "Em campo", e de mais nada');

      // PARA CIMA ROLA, PARA O LADO ARRASTA.
      // O retrato pedia `touch-action: none` desde que o arrasto existe, e no
      // telefone isso queria dizer que o dedo em cima de um nome não rolava
      // nada: a lista cortava no fim da tela e não havia como ver o resto.
      // Toque de verdade, pelo CDP: o que se prova aqui é a decisão do
      // navegador sobre o gesto, e evento sintético não passa por ela.
      const onde = await p.evaluate(() => {
        const cx = document.getElementById('gr-lista').getBoundingClientRect();
        const f = [...document.querySelectorAll('#gr-lista .gr-ficha')]
          .find((z) => { const r = z.getBoundingClientRect(); return r.top > cx.top + 20 && r.bottom < cx.bottom - 30; });
        if (!f) return null;
        const r = f.getBoundingClientRect();
        return { x: Math.round(r.left + 40), y: Math.round(r.top + r.height / 2),
          rolavel: document.getElementById('gr-lista').scrollHeight
            > document.getElementById('gr-lista').clientHeight + 2 };
      });
      if (onde) {
        await p.touchscreen.touchStart(onde.x, onde.y);
        for (let i = 1; i <= 6; i++) await p.touchscreen.touchMove(onde.x, onde.y - i * 22);
        await p.touchscreen.touchEnd();
        await espera(500);
        const subiu = await p.evaluate(() => ({
          rolou: document.getElementById('gr-lista').scrollTop,
          folha: document.body.classList.contains('folha-campo'),
          fantasma: document.querySelectorAll('.gr-ghost').length }));
        ok(subiu.folha && subiu.fantasma === 0 && (!onde.rolavel || subiu.rolou > 0),
          `o dedo para cima rola a lista, sem levar a peça (${subiu.rolou}px, folha aberta)`);

        // E a barra de rolar, que é o alvo de quem prefere arrastar a rolagem.
        const barra = await p.evaluate(() => {
          const b = document.getElementById('gr-rolar');
          if (b.hidden) return null;
          const r = b.getBoundingClientRect();
          return { x: Math.round(r.left + r.width / 2), topo: Math.round(r.top + 12),
            base: Math.round(r.bottom - 12), largura: Math.round(r.width) };
        });
        if (barra) {
          await p.touchscreen.touchStart(barra.x, barra.topo);
          await p.touchscreen.touchMove(barra.x, barra.base);
          await p.touchscreen.touchEnd();
          await espera(400);
          const fim = await p.evaluate(() => {
            const l = document.getElementById('gr-lista');
            return { no: l.scrollTop, max: l.scrollHeight - l.clientHeight };
          });
          ok(fim.no >= fim.max - 4 && barra.largura >= 20,
            `e a barra lateral leva ao fim da lista (${fim.no} de ${fim.max})`);
        }

        // Para o lado, o gesto é outro: a folha sai da frente e o retrato vira
        // fantasma. Solta em cima da barra do polegar, que não é hexágono, para
        // a prova não mexer no tabuleiro.
        const daVez = await p.evaluate(() => {
          const cx = document.getElementById('gr-lista').getBoundingClientRect();
          const f = [...document.querySelectorAll('#gr-lista .gr-ficha')]
            .find((z) => { const q = z.getBoundingClientRect(); return q.top > cx.top + 20 && q.bottom < cx.bottom - 30; });
          const q = f.getBoundingClientRect();
          return { x: Math.round(q.left + 40), y: Math.round(q.top + q.height / 2) };
        });
        await p.touchscreen.touchStart(daVez.x, daVez.y);
        for (let i = 1; i <= 6; i++) await p.touchscreen.touchMove(daVez.x + i * 30, daVez.y + 2);
        await espera(250);
        const saiu = await p.evaluate(() => ({
          folha: document.body.classList.contains('folha-campo'),
          fantasma: document.querySelectorAll('.gr-ghost').length }));
        await p.touchscreen.touchEnd();
        await espera(400);
        ok(!saiu.folha && saiu.fantasma === 1,
          'e para o lado a folha sai da frente, com o retrato no dedo');
        ok(await p.evaluate(() => document.querySelectorAll('.gr-ghost').length === 0),
          'o fantasma não fica pendurado depois de soltar');
        // A folha saiu da frente para o arrasto: reabre, para o laço lá fora
        // fechar como fecha as outras.
        await p.evaluate(() => {
          if (!document.body.classList.contains('folha-campo')) document.getElementById('ga-campo').click();
        });
        await espera(400);
      }
    }
    const c = await pisoDeToque();
    ok(c.length === 0, `e nada dentro dela fica abaixo de 44px (${c.slice(0, 3).join(', ') || 'nenhum'})`);
    await p.evaluate((b) => document.getElementById(b).click(), botao);
    await espera(350);
  }
  const fechou = await p.evaluate(() => document.body.classList.contains('com-folha'));
  ok(!fechou, 'e o mesmo botão que abriu fecha');

  // ------------------------------------------------- o painel de conjurar
  // Ele é a caixa mais cheia do Grid (Arte, Efeito, parâmetros, molde, ângulos
  // e a conta), e a que mais tinha a perder numa tela de 390px: as colunas
  // nasceram com `min-height: 0` para rolarem por dentro no notebook, e numa
  // fileira só isso fazia os parâmetros serem desenhados POR CIMA da
  // manifestação. Uma varredura pelas 5 Artes e pelos 37 Efeitos da bancada não
  // cabe no smoke; um estado com molde e ângulos cabe, e é o que quebrava.
  const conj = await p.evaluate(async () => {
    document.getElementById('ga-agir').click();
    await new Promise((r) => setTimeout(r, 400));
    document.querySelector('#tok-menu button[data-a="arte"]')?.click();
    await new Promise((r) => setTimeout(r, 900));
    const muro = [...document.querySelectorAll('.ag-efs .ag-ef')].find((b) => /Muro/.test(b.textContent));
    muro?.click();
    await new Promise((r) => setTimeout(r, 400));
    const d = document.querySelector('dialog[open].ui-dlg-conj');
    if (!d) return { abriu: false };
    const rd = d.getBoundingClientRect();
    const fora = [...d.querySelectorAll('*')].filter((e) => {
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height || e.closest('svg')) return false;
      if (getComputedStyle(e).position === 'fixed') return false;
      return r.right > rd.right + 1 || r.left < rd.left - 1;
    }).length;
    const blocos = ['.ag-col-ef', '.ag-col-par', '.ag-col-forma']
      .map((s) => d.querySelector(s)).filter(Boolean).map((e) => e.getBoundingClientRect());
    let cruza = 0;
    for (let i = 0; i < blocos.length; i++) for (let j = i + 1; j < blocos.length; j++) {
      const a = blocos[i], b = blocos[j];
      if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) cruza++;
    }
    const ok = d.querySelector('#ag-ok').getBoundingClientRect();
    const mais = d.querySelector('.ag-p-ctr .ag-p-b:last-child').getBoundingClientRect();
    return { abriu: true, fora, cruza,
      folha: Math.abs(rd.bottom - innerHeight) < 2 && Math.abs(rd.left) < 2,
      conjurar: ok.top >= 0 && ok.bottom <= innerHeight + 1,
      passo: Math.round(Math.min(mais.width, mais.height)) };
  });
  ok(conj.abriu && conj.folha, 'o painel de conjurar sobe do pé, na largura da tela');
  ok(conj.fora === 0 && conj.cruza === 0,
    `e nada sai pelos lados nem é desenhado por cima do vizinho (${conj.fora} fora, ${conj.cruza} cruzando)`);
  ok(conj.conjurar && conj.passo >= 40,
    `o Conjurar fica na tela e o ± dá para o dedo (${conj.passo}px)`);
  await p.evaluate(() => document.querySelector('dialog[open].ui-dlg-conj')?.close());
  await espera(400);

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



// ------------------------------------------------------- a regua das caixas
/**
 * TRANSBORDO MEDIDO, e nao olhado.
 *
 * Uma caixa quebrada quase nunca aparece no teste funcional: os cliques
 * continuam funcionando com a palavra vazando pela borda, e o defeito so
 * aparece quando alguem abre a tela. Esta regua transforma isso em numero, e
 * conta tres coisas diferentes:
 *
 *   1. filho cujo retangulo sai do retangulo da caixa;
 *   2. elemento que rola sem ter pedido (`scrollWidth > clientWidth` sem
 *      `overflow-x` declarado), que e o desenho estourando por dentro;
 *   3. texto cortado por `overflow: hidden` ou reticencias.
 *
 * Quem mora dentro de um rolador esta fora por desenho, e nao por defeito: a
 * fila de iniciativa e uma tira que desliza, e contar os cartoes que sobram
 * dela seria medir a rolagem. Por isso a busca sobe a arvore antes de acusar.
 */
const REGUA_CAIXA = `(function (sel) {
  const cx = document.querySelector(sel);
  if (!cx) return null;
  const r = cx.getBoundingClientRect();
  const fora = [], rolando = [], cortado = [];
  for (const e of cx.querySelectorAll('*')) {
    const s = getComputedStyle(e);
    if (s.display === 'none' || s.visibility === 'hidden' || !e.getClientRects().length) continue;
    const q = e.getBoundingClientRect();
    if (!q.width && !q.height) continue;
    const id = (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim()
      ? '.' + e.className.trim().split(/\\s+/).slice(0, 2).join('.') : '');
    let rolaX = false, rolaY = false;
    for (let a = e.parentElement; a; a = a.parentElement) {
      const os = getComputedStyle(a);
      if (os.overflowX === 'auto' || os.overflowX === 'scroll') rolaX = true;
      if (os.overflowY === 'auto' || os.overflowY === 'scroll') rolaY = true;
      if (a === cx) break;
    }
    if ((!rolaX && (q.left < r.left - 2 || q.right > r.right + 2)) || (!rolaY && q.bottom > r.bottom + 2)) {
      fora.push(id + '(' + Math.round(Math.max(r.left - q.left, q.right - r.right, q.bottom - r.bottom)) + 'px)');
    }
    if (e.scrollWidth - e.clientWidth > 1 && s.overflowX !== 'auto' && s.overflowX !== 'scroll') {
      rolando.push(id + '(+' + (e.scrollWidth - e.clientWidth) + 'px)');
    }
    const proprio = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (proprio && (s.overflow === 'hidden' || s.textOverflow === 'ellipsis')
      && e.scrollWidth - e.clientWidth > 1) {
      cortado.push(id + '(+' + (e.scrollWidth - e.clientWidth) + 'px)');
    }
  }
  return {
    w: Math.round(r.width), h: Math.round(r.height),
    saiDaJanela: r.right > innerWidth + 2 || r.left < -2 || r.bottom > innerHeight + 2 || r.top < -2,
    fora, rolando, cortado,
  };
})`;

/** Vistoria uma caixa aberta e reclama do que transborda. */
async function vistoriarCaixa(p, sel, nome) {
  const m = await p.evaluate(`${REGUA_CAIXA}(${JSON.stringify(sel)})`);
  if (!m) { ok(false, `${nome}: a caixa nem existe (${sel})`); return; }
  ok(!m.saiDaJanela, `${nome} cabe na janela (${m.w}x${m.h})`);
  ok(m.fora.length === 0, `${nome}: nada sai das bordas (${m.fora.slice(0, 3).join(' ') || 'nada'})`);
  ok(m.rolando.length === 0,
    `${nome}: nada estoura por dentro (${m.rolando.slice(0, 3).join(' ') || 'nada'})`);
  ok(m.cortado.length === 0,
    `${nome}: nenhum texto cortado (${m.cortado.slice(0, 3).join(' ') || 'nenhum'})`);
}

/**
 * O GOLPE QUE SAI DEPOIS, do começo ao fim.
 *
 * Esta é a única cena que abre a mesa com a chave ligada (`?adiado=1`), e por
 * isso ela também é a prova de que a chave EXISTE: nas outras cinco cenas o
 * caminho novo tem de continuar invisível, e é o que elas medem sem saber.
 *
 * O que ela persegue é a ida e a volta inteiras:
 *
 *   1. arrastar uma peça em cima de outra abre a CAIXA DA DECLARAÇÃO, e não a
 *      folha da ação: no Tick em que se declara não há Defesa a mostrar;
 *   2. declarar não tira Vida de ninguém e põe o gesto NO AR;
 *   3. a faixa dos golpes no ar aparece, com quem, contra quem e em que Tick;
 *   4. clicar no cartão abre a FOLHA DA AÇÃO, agora com a guarda do instante;
 *   5. e resolver tira o golpe da faixa.
 */
async function cenaGolpeAdiado(br, url) {
  console.log('\n· o golpe adiado: declarar, esperar, resolver');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0&adiado=1`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(600);

  // ---- 1 e 2: arrastar declara, e declarar não resolve ----
  const dec = await p.evaluate(async () => {
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela);
    // O ATACANTE TEM DE TER PREPARO. `c002` é quem leva espada longa na
    // bancada (média, Preparo 1); o resto da cena cai no punho, que é leve e
    // resolve na hora mesmo com a chave ligada, e o teste mediria o caminho
    // antigo achando que mediu o novo.
    const a = toks.find((t) => t.dataset.c === 'c002');
    const b = toks.find((t) => t !== a);
    if (!a || !b) return null;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(a, 'pointerdown', ra.left + ra.width / 2, ra.top + ra.height / 2);
    em(document, 'pointermove', rb.left + rb.width / 2, rb.top + rb.height / 2);
    em(document, 'pointerup', rb.left + rb.width / 2, rb.top + rb.height / 2);
    await new Promise((r) => setTimeout(r, 1300));
    const decl = document.getElementById('decl-dlg');
    const folha = document.getElementById('alvo-dlg');
    const r = {
      abriuDeclaracao: !!decl?.open,
      abriuFolha: !!folha?.open,
      titulo: document.getElementById('dc-titulo')?.textContent || '',
      tempo: document.getElementById('dc-tempo')?.textContent || '',
      // A caixa da declaração não pode carregar número de acerto nem de dano:
      // a regra é que no Tick da declaração eles não existem.
      temDefesa: !!decl?.querySelector('#al-defesas'),
      cego: !!decl?.querySelector('.dc-cego'),
    };
    return r;
  });
  // MEDIDA ANTES DE CONFIRMAR: a caixa ainda está aberta, e é agora ou nunca.
  if (dec?.abriuDeclaracao) await vistoriarCaixa(p, '#decl-dlg', 'a caixa da declaração');
  await p.evaluate(async () => {
    const d = document.getElementById('decl-dlg');
    if (d?.open) { document.getElementById('dc-ok').click(); await new Promise((x) => setTimeout(x, 900)); }
  });
  if (dec) {
    ok(dec.abriuDeclaracao && !dec.abriuFolha,
      'arrastar em cima do alvo abre a caixa da DECLARAÇÃO, e não a folha do acerto');
    ok(!dec.temDefesa && dec.cego,
      'e ela não mostra Defesa nem dano: no Tick da declaração esses números não existem');
    ok(/Preparo/.test(dec.tempo) && /cai no Tick/.test(dec.tempo),
      `a caixa diz em que Tick o golpe cai (${(dec.tempo || '').replace(/\s+/g, ' ').slice(0, 70)})`);
  }

  // ---- 3: a faixa dos golpes no ar ----
  const faixa = await p.evaluate(() => {
    const cx = document.getElementById('gr-ar');
    const itens = [...document.querySelectorAll('#gr-ar .ar-item')];
    return {
      existe: !!cx,
      n: itens.length,
      texto: (cx?.textContent || '').replace(/\s+/g, ' ').trim(),
      // Cada cartão tem de dizer o Tick em que aquele golpe cai: é o número que
      // a mesa lê para saber o que vem primeiro.
      ticks: itens.map((i) => i.dataset.t),
      // Antes de o Tick chegar, o cartão não pode estar aceso como "resolva".
      vencidos: itens.filter((i) => i.classList.contains('vencido')).length,
    };
  });
  ok(faixa.existe && faixa.n > 0,
    `o gesto declarado aparece na faixa dos golpes no ar (${faixa.n} no ar)`);
  ok(faixa.ticks.every((t) => t != null && t !== ''),
    `e cada cartão carrega o Tick em que ele cai (${faixa.ticks.join(', ')})`);

  // O TRILHO INTEIRO, com a faixa dentro.
  // Aqui é onde a fila de pé mais quebrou, e o defeito não aparecia em nenhuma
  // medida de geometria: o trilho tinha o tamanho certo e o conteúdo dentro
  // dele é que estava errado. A faixa dos golpes é `flex: 1 0 100%`, que numa
  // fileira quer dizer "quebre a linha" e numa COLUNA quer dizer "tome a altura
  // toda" · ela engolia a fila inteira no instante em que alguém entrava em
  // rota de ataque. Por isso a régua vem junto de um teste que conta cartões:
  // "nada transborda" e "a fila continua lá" são duas perguntas diferentes.
  await vistoriarCaixa(p, '.gr-ini', 'o trilho da iniciativa com golpe no ar');
  const filaViva = await p.evaluate(() => {
    const l = document.querySelector('.fila-lista');
    if (!l) return null;
    return { h: Math.round(l.getBoundingClientRect().height),
      itens: l.querySelectorAll('.ini-item').length };
  });
  ok(filaViva && filaViva.itens > 0 && filaViva.h > 120,
    `e a fila continua de pé debaixo dela (${filaViva?.h}px, ${filaViva?.itens} cartões)`);

  // ---- 4 e 5: o cartão abre a folha, e resolver tira o golpe do ar ----
  const res = await p.evaluate(async () => {
    const antes = document.querySelectorAll('#gr-ar .ar-item').length;
    const cartao = document.querySelector('#gr-ar .ar-item');
    if (!cartao) return null;
    cartao.click();
    await new Promise((r) => setTimeout(r, 1200));
    const folha = document.getElementById('alvo-dlg');
    const r = {
      antes,
      abriu: !!folha?.open,
      titulo: document.getElementById('al-titulo')?.textContent || '',
      // A folha adiada mostra a guarda DAQUELE instante, e diz de onde ela veio.
      tempo: (document.getElementById('al-tempo')?.textContent || '').replace(/\s+/g, ' '),
      // A manobra já foi escolhida na declaração: remontá-la agora seria mexer
      // na agenda depois de o tempo ter passado por cima dela.
      travada: !!document.getElementById('al-manobra')?.disabled,
      temDefesa: !!document.getElementById('al-defesas')?.textContent.trim(),
    };
    return r;
  });
  if (res?.abriu) await vistoriarCaixa(p, '#alvo-dlg', 'a folha do golpe que cai');
  // "Errou" é o caminho mais curto que ainda resolve o golpe: não mexe em Vida
  // de ninguém e ainda assim tira o gesto do ar.
  if (res) {
    res.depois = await p.evaluate(async () => {
      const folha = document.getElementById('alvo-dlg');
      if (folha?.open) {
        document.getElementById('al-nao').click();
        await new Promise((x) => setTimeout(x, 1400));
      }
      return document.querySelectorAll('#gr-ar .ar-item').length;
    });
  }
  if (res) {
    ok(res.abriu, 'clicar no cartão da faixa abre a folha da ação');
    ok(/O golpe de .* cai em /.test(res.titulo),
      `e ela abre no tempo verbal certo: o golpe está caindo (${res.titulo})`);
    ok(res.temDefesa, 'com a Defesa do alvo, que na declaração não estava lá');
    ok(res.travada, 'e com a manobra travada, porque ela foi escolhida três Ticks atrás');
    ok(/declarado no Tick/.test(res.tempo),
      `a linha do tempo lembra quando o gesto começou (${(res.tempo || '').slice(0, 60)})`);
    ok(res.depois < res.antes,
      `resolver tira o golpe do ar (${res.antes} → ${res.depois})`);
  }

  // ---- 6: O RELÓGIO PARA NO TICK DO GOLPE ----
  //
  // É o defeito que o estudo previu e que só aparece andando com a cena: o
  // atacante vai direto para o `livre`, e o Tick em que o braço cai não é a vez
  // de ninguém, então nada obrigaria a mesa a parar nele. Aqui a cena é
  // empurrada no "⏭ próximo" até alcançar o golpe agendado, e o que se prova é
  // que ela para EXATAMENTE ali, nunca depois.
  await p.evaluate(async () => {
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')];
    const a = toks.find((t) => t.dataset.c === 'c001');   // a besta, Preparo longo
    const b = toks.find((t) => t !== a && t.dataset.c !== 'c002');
    if (!a || !b) return;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(a, 'pointerdown', ra.left + ra.width / 2, ra.top + ra.height / 2);
    em(document, 'pointermove', rb.left + rb.width / 2, rb.top + rb.height / 2);
    em(document, 'pointerup', rb.left + rb.width / 2, rb.top + rb.height / 2);
    await new Promise((x) => setTimeout(x, 1300));
    if (document.getElementById('decl-dlg')?.open) {
      document.getElementById('dc-ok').click();
      await new Promise((x) => setTimeout(x, 900));
    }
  });
  const andar = await p.evaluate(async () => {
    const passos = [];
    // O teto e generoso porque a besta tem Preparo 5 e a cena precisa andar uma
    // duzia de Ticks para alcancar o golpe. Cada volta e um clique no "proximo",
    // e varias delas nao movem o relogio (elas encerram a vez de quem divide o
    // mesmo Tick com outro).
    for (let i = 0; i < 34; i++) {
      const btn = document.getElementById('ini-prox');
      const tk = parseInt(document.getElementById('ini-tk')?.textContent || '0', 10);
      const item = document.querySelector('#gr-ar .ar-item');
      const alvo = item ? parseInt(item.dataset.t, 10) : null;
      passos.push({ tk, alvo, ligado: !btn.disabled,
        vencido: !!item?.classList.contains('vencido'), dica: btn.title });
      if (alvo == null || tk >= alvo) break;
      if (btn.disabled) break;
      btn.click();
      await new Promise((r) => setTimeout(r, 450));
    }
    return passos;
  });
  const fim = andar[andar.length - 1];
  if (fim && fim.alvo != null) {
    ok(fim.tk === fim.alvo,
      `a cena para exatamente no Tick do golpe (parou em ${fim.tk}, agendado ${fim.alvo})`);
    ok(!andar.some((x) => x.alvo != null && x.tk > x.alvo),
      `e nunca passa por cima dele (${andar.map((x) => x.tk).join(' → ')})`);
    ok(fim.vencido, 'o cartão da faixa acende como "resolva isto"');
    // O "próximo" aceso que não faz nada é a pior das combinações: parece que a
    // mesa travou. Ele desliga, e o título diz por quê.
    ok(!fim.ligado, 'e o "próximo" desliga: enquanto o golpe cai, não é a vez de ninguém');
    ok(/golpe caindo/i.test(fim.dica || ''), `com o motivo escrito ("${fim.dica}")`);
  }

  // ---- 7: o painel do tempo, que ganhou a chave e ficou o mais alto da mesa ----
  //
  // Ele é o caso em que "cabe na janela" deixou de ser de graça: com sistema,
  // amostra, marcação, dados e agora a chave, o diálogo passava da tela e o
  // rodapé de botões ficava abaixo da borda. Dava para ler tudo e não dava para
  // salvar.
  await p.evaluate(() => document.getElementById('gr-tempo').click());
  await espera(700);
  await vistoriarCaixa(p, '.tempo-dlg', 'o painel do tempo');
  const chave = await p.evaluate(() => {
    const c = document.getElementById('tp-adiado');
    const d = document.getElementById('tp-adiado-d');
    const r = { existe: !!c, marcado: !!c?.checked, ligada: d?.textContent?.trim() };
    // A linha de estado tem de responder ao rádio do sistema: descobrir que a
    // chave não faz nada DEPOIS de ligá-la seria tarde.
    const acha = (v) => [...document.querySelectorAll('input[name="tp-sis"]')].find((i) => i.value === v);
    const n = acha('normal'); n.checked = true; n.dispatchEvent(new Event('change', { bubbles: true }));
    r.noNormal = d?.textContent?.trim();
    const g = acha('pgr'); g.checked = true; g.dispatchEvent(new Event('change', { bubbles: true }));
    c.checked = false; c.dispatchEvent(new Event('change', { bubbles: true }));
    r.desligada = d?.textContent?.trim();
    // E o rodapé de botões tem de estar ALCANÇÁVEL, que é o defeito de verdade
    // por trás da altura: um painel que rola mas cujo "Salvar" some não salva.
    const b = document.getElementById('tp-salvar')?.getBoundingClientRect();
    r.salvarNaTela = !!b && b.bottom <= innerHeight + 2 && b.top >= -2;
    document.getElementById('tp-cancelar').click();
    return r;
  });
  await espera(400);
  ok(chave.existe && chave.marcado, 'o painel do tempo tem a chave, marcada quando a mesa a ligou');
  ok(/sem efeito no sistema normal/i.test(chave.noNormal || ''),
    `e a linha de estado avisa que no sistema normal ela não faz nada ("${chave.noNormal}")`);
  ok(/desligada/i.test(chave.desligada || ''), `e muda ao desmarcar ("${chave.desligada}")`);
  ok(chave.salvarNaTela, 'o "Salvar" do painel continua alcançável, com o painel inteiro');

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}


/**
 * O QUASE-ACERTO NA FOLHA DA AÇÃO.
 *
 * O capítulo XII existe desde sempre e o Grid nunca o calculou: a mesa fazia a
 * conta de cabeça, ou simplesmente não usava a válvula que impede duelo de
 * guarda alta de virar uma fila de zeros. Esta cena persegue as quatro coisas
 * que a implementação precisa acertar:
 *
 *   1. os dois números (Margem e raspão) chegam PRONTOS e continuam editáveis;
 *   2. o veredito tem TRÊS estados, e não dois;
 *   3. mexer na Margem à mão muda o veredito na hora, porque é o mestre quem
 *      conserta o cavaleiro de placa que o bestiário guardou sem armadura;
 *   4. o botão do raspão aplica DANO FIXO e o registro diz que ignorou a
 *      Absorção.
 */
async function cenaQuaseAcerto(br, url) {
  console.log('\n· o Quase-Acerto: errar por pouco ainda raspa');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(600);

  const v = await p.evaluate(async () => {
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')];
    // `c002` leva espada longa na bancada: dano médio 3,5, arma média, +2 de
    // Margem e 4 de raspão. Com o punho (leve) os números seriam outros, e o
    // teste mediria a arma errada sem dizer.
    const a = toks.find((t) => t.dataset.c === 'c002');
    const b = toks.find((t) => t !== a && t.dataset.c !== 'c001');
    if (!a || !b) return null;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(a, 'pointerdown', ra.left + ra.width / 2, ra.top + ra.height / 2);
    em(document, 'pointermove', rb.left + rb.width / 2, rb.top + rb.height / 2);
    em(document, 'pointerup', rb.left + rb.width / 2, rb.top + rb.height / 2);
    await new Promise((x) => setTimeout(x, 1300));
    if (!document.getElementById('alvo-dlg')?.open) return { abriu: false };

    const margem = document.getElementById('al-qa-margem');
    const dano = document.getElementById('al-qa-dano');
    const total = document.getElementById('al-total');
    const vered = document.getElementById('al-vered');
    const botao = document.getElementById('al-qa');
    // A Defesa que a folha calculou, para o teste mirar os três casos sem
    // adivinhar número: ele lê o que está na tela, como a mesa leria.
    const def = parseInt((document.querySelector('#al-defesas .d-v')?.textContent || '0').trim(), 10);
    const r = {
      abriu: true, def,
      margem: margem?.value, dano: dano?.value,
      conta: (document.getElementById('al-qa-conta')?.textContent || '').replace(/\s+/g, ' ').trim(),
      temBotao: !!botao && !botao.hidden,
    };
    const digitar = (v) => { total.value = String(v); total.dispatchEvent(new Event('input', { bubbles: true })); };
    const m = parseInt(margem.value, 10);
    // Acerto: passar da Defesa.
    digitar(def + 1); r.acerto = vered.textContent.trim();
    r.acertoPrimario = document.getElementById('al-sim').classList.contains('primary');
    // Raspão: errar por exatamente a Margem. "Errou por" é (Defesa + 1) − total,
    // então o total que erra por `m` é `def + 1 − m`.
    digitar(def + 1 - m); r.raspao = vered.textContent.trim();
    r.raspaoPrimario = botao.classList.contains('primary');
    // Erro seco: um a mais que a Margem.
    digitar(def - m); r.erro = vered.textContent.trim();
    r.erroPrimario = document.getElementById('al-nao').classList.contains('primary');
    // E o mestre mandando: alargar a Margem à mão volta o mesmo total a raspar.
    margem.value = String(m + 1); margem.dispatchEvent(new Event('input', { bubbles: true }));
    r.depoisDaMao = vered.textContent.trim();
    return r;
  });

  if (v && v.abriu) {
    ok(/^\d+$/.test(v.margem || '') && Number(v.margem) > 0,
      `a Margem chega pronta na folha (${v.margem})`);
    ok(/^\d+$/.test(v.dano || ''), `e o dano do raspão também (${v.dano})`);
    ok(/arma \w+.*margem/.test(v.conta), `com a conta escrita de onde ela saiu (${v.conta})`);
    ok(v.temBotao, 'e o botão "Raspou" está na caixa');
    ok(/acerta/.test(v.acerto) && v.acertoPrimario,
      `passar da Defesa acerta, e "Acertou" vira o principal (${v.acerto})`);
    ok(/raspa/.test(v.raspao) && v.raspaoPrimario,
      `errar por exatamente a Margem raspa, e "Raspou" vira o principal (${v.raspao})`);
    ok(/erra por/.test(v.erro) && !/raspa/.test(v.erro) && v.erroPrimario,
      `um a mais que a Margem é erro seco (${v.erro})`);
    ok(/raspa/.test(v.depoisDaMao),
      `e alargar a Margem à mão volta o mesmo total a raspar (${v.depoisDaMao})`);
  }

  // ---- o raspão aplicado: dano FIXO, sem passar pela Absorção ----
  const bateu = await p.evaluate(async () => {
    const dano = parseInt(document.getElementById('al-qa-dano').value, 10);
    // O campo do dano normal fica com outro número de propósito: se o botão do
    // raspão usasse ELE, o teste não veria a diferença.
    const dn = document.getElementById('al-dn');
    dn.value = '99'; dn.dispatchEvent(new Event('input', { bubbles: true }));
    document.getElementById('al-qa').click();
    await new Promise((r) => setTimeout(r, 1600));
    const linhas = [...document.querySelectorAll('#gr-log .lg')].map((l) => l.textContent);
    return { dano, linha: linhas.find((l) => /raspou/i.test(l)) || linhas[0] || '' };
  });
  ok(/raspou/i.test(bateu.linha), `o registro diz que raspou (${(bateu.linha || '').slice(0, 70)})`);
  ok(new RegExp(`: ${bateu.dano} de dano`).test(bateu.linha),
    `e o dano é o FIXO do Quase-Acerto (${bateu.dano}), e não o que estava no campo do dano cheio`);
  ok(/ignora Absor/i.test(bateu.linha), 'com a nota de que ignorou a Absorção');
  ok(!/abs\]/.test(bateu.linha), 'e sem desconto de Absorção na conta');

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * A BARRA FUNDIDA e a ordem de combate de pé.
 *
 * Duas mudanças que só existem em pixels, e por isso só um navegador prova.
 * A primeira: no notebook a barra da arena muda de casa e entra na barra da
 * mesa, ao lado das abas · três fileiras antes do tabuleiro viram duas. O que
 * pode quebrar sem ninguém ver é a fileira dobrar em duas linhas (aí a fusão
 * não economizou nada) ou a barra não voltar para casa no telefone, onde ela é
 * folha de baixo e a barra da mesa é a folha vizinha.
 * A segunda: em tela cheia a ordem de combate deixa de ser faixa no topo e vira
 * coluna de 5vw à esquerda, o que devolve a altura inteira ao mapa.
 */
async function cenaFusao(br, url) {
  console.log('\n· a barra fundida, e a ordem de combate de pé em tela cheia');
  const p = await br.newPage();
  await p.setViewport({ width: 1440, height: 900 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });

  const estado = () => p.evaluate(() => {
    const R = (s) => { const e = document.querySelector(s); if (!e) return null;
      const r = e.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) }; };
    const barra = document.querySelector('.gr-barra');
    const arena = document.querySelector('.gb-n');
    const abaOutra = document.querySelector('.mesa-abas a:not(.atual) .ab-n');
    const abaEsta = document.querySelector('.mesa-abas a.atual .ab-n');
    const larg = (n) => (n ? Math.round(n.getBoundingClientRect().width) : null);
    return {
      fundida: document.body.classList.contains('barra-fundida'),
      pai: barra?.parentElement?.className || null,
      barraEscondida: !!barra?.hidden,
      fileira: R('.mb-baixo'), palco: R('#gr-palco'), ini: R('.gr-ini'),
      areas: getComputedStyle(document.querySelector('.gr-grade')).gridTemplateAreas,
      arenaLarg: larg(arena), arenaTexto: arena?.textContent || '',
      abaOutraLarg: larg(abaOutra), abaEstaLarg: larg(abaEsta),
      abasRolando: (() => { const a = document.querySelector('.mesa-abas');
        return a.scrollWidth > a.clientWidth + 2; })(),
    };
  });

  const d = await estado();
  ok(d.fundida && d.pai === 'mb-baixo',
    `no notebook a barra da arena mora na barra da mesa (pai: ${d.pai})`);
  ok(!d.barraEscondida, 'e está visível, com a arena aberta');
  // Duas fileiras de comandos dariam ~64px. A fusão só vale se for UMA linha.
  ok(d.fileira.h > 0 && d.fileira.h < 46,
    `a fileira fundida cabe numa linha só (${d.fileira.h}px)`);
  ok(!/barra/.test(d.areas), `e a fileira da barra saiu da grade (${d.areas})`);

  // A escada dos ícones: em 1440 as duas palavras já saíram, mas a aba aberta
  // continua escrita e o rótulo continua na árvore (só saiu da vista).
  // 1px e não 0: o rótulo é recortado, e não removido · é essa caixa de 1px que
  // o mantém na árvore de acessibilidade.
  ok(d.arenaLarg <= 1, `em 1440 o comando da arena é só ícone (rótulo ${d.arenaLarg}px)`);
  ok(d.arenaTexto.trim().length > 0,
    `mas o nome dele continua legível para o leitor de tela ("${d.arenaTexto.trim()}")`);
  ok(d.abaOutraLarg <= 1, `as outras abas também são só ícone (${d.abaOutraLarg}px)`);
  ok(d.abaEstaLarg > 0, `menos a aba aberta, que continua dizendo onde a gente está (${d.abaEstaLarg}px)`);
  ok(!d.abasRolando, 'e nada precisa rolar para caber');

  // O A/B na mesma página: desfazer as DUAS mudanças de moldura devolve o
  // layout de antes por inteiro (a barra volta para o topo da grade e a fila
  // volta a deitar), e a diferença é o que elas compraram.
  const antes = await p.evaluate(() => {
    const grade = document.querySelector('.gr-grade');
    grade.insertBefore(document.querySelector('.gr-barra'), grade.firstElementChild);
    document.body.classList.remove('barra-fundida', 'fila-empe');
    const r = document.querySelector('#gr-palco').getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height) };
  });
  // Num mapa quadrado quem manda é o lado mais curto: é ele que diz o ganho.
  const mapa = (b) => Math.min(b.w, b.h);
  const ganho = mapa(d.palco) / mapa(antes) - 1;
  ok(ganho > 0.15,
    `as duas juntas dão ao mapa ${(ganho * 100).toFixed(1)}% a mais ` +
    `(${antes.w}×${antes.h} → ${d.palco.w}×${d.palco.h})`);
  await p.evaluate(() => {
    document.querySelector('.mb-baixo').appendChild(document.querySelector('.gr-barra'));
    document.body.classList.add('barra-fundida', 'fila-empe');
  });

  // -------------------------------------- em tela cheia, a fila fica de pé
  await p.evaluate(() => document.getElementById('gr-cheia').click());
  await p.waitForFunction(() => document.body.classList.contains('tela-cheia'), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  const c = await p.evaluate(() => {
    const R = (s) => { const e = document.querySelector(s);
      const r = e.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x) }; };
    const av = document.querySelector('.ini-item .ini-av');
    const nome = document.querySelector('.ini-item .ini-nome');
    const lista = document.querySelector('.fila-lista');
    return { ini: R('.gr-ini'), palco: R('#gr-palco'), vw: window.innerWidth,
      empilhado: Math.round(nome.getBoundingClientRect().y) > Math.round(av.getBoundingClientRect().y),
      rolaDeLado: lista.scrollWidth > lista.clientWidth + 2 };
  });
  const sete = Math.round(c.vw * 0.07);
  ok(Math.abs(c.ini.w - sete) <= 2,
    `em tela cheia a ordem de combate ocupa 7% da largura (${c.ini.w}px de ${c.vw})`);
  ok(c.ini.x < c.palco.x, 'à esquerda do tabuleiro');
  ok(c.ini.h > c.palco.h * 0.9, 'e da altura dele, e não uma faixa no topo');
  ok(c.empilhado, 'o cartão empilha retrato e nome, para caber na coluna estreita');
  ok(!c.rolaDeLado, 'e a fila rola de cima para baixo, nunca de lado');
  await p.evaluate(() => document.getElementById('gr-cheia').click());
  await p.waitForFunction(() => !document.body.classList.contains('tela-cheia'), { timeout: 10000 });

  // ------------------------------- a coluna lateral recolhe para a direita
  //
  // A terceira dobra do painel: as duas de dentro trocam altura entre si, esta
  // devolve a largura da coluna ao tabuleiro. O que ela não pode fazer é sumir
  // sem deixar por onde voltar.
  const larguraDoPalco = () => p.evaluate(() =>
    Math.round(document.querySelector('#gr-palco').getBoundingClientRect().width));
  // Sair da tela cheia não é instantâneo: medir antes de a grade voltar às duas
  // colunas normais lê a largura do layout que está saindo, e não a da linha de
  // base. Esperar o tabuleiro voltar a ser largo é a mesma cerca de sempre.
  await p.waitForFunction(() =>
    document.querySelector('#gr-palco').getBoundingClientRect().width > 900, { timeout: 10000 });
  const aberta = await larguraDoPalco();
  await p.evaluate(() => document.getElementById('gr-recolher').click());
  await new Promise((r) => setTimeout(r, 450));
  // A fila também recolhe, para o outro lado, e as duas se compõem.
  await p.evaluate(() => document.getElementById('ini-recolher').click());
  await new Promise((r) => setTimeout(r, 450));
  const semFila = await p.evaluate(() => ({
    trilho: Math.round(document.querySelector('.gr-ini').getBoundingClientRect().width),
    palco: Math.round(document.querySelector('#gr-palco').getBoundingClientRect().width),
    guardado: localStorage.getItem('centelha:grid:fila-recolhida'),
  }));
  ok(semFila.trilho < 40, `a fila também recolhe, e vira trilho (${semFila.trilho}px)`);
  ok(semFila.palco > aberta, `dando a largura dela ao tabuleiro (${aberta} → ${semFila.palco}px)`);
  ok(semFila.guardado === '1', 'e a escolha fica guardada, como a da coluna');
  await p.evaluate(() => document.getElementById('ini-recolher').click());
  await new Promise((r) => setTimeout(r, 450));

  const rec = await p.evaluate(() => {
    const R = (s) => { const e = document.querySelector(s);
      const r = e.getBoundingClientRect(); return { w: Math.round(r.width), x: Math.round(r.x) }; };
    const btn = document.getElementById('gr-recolher');
    // Há DOIS rótulos de trilho agora, um por dobra: o da fila vem antes no
    // documento, e um `querySelector` solto pegaria o dela.
    const rot = document.querySelector('#gr-lado .gr-trilho-rot');
    return { lado: R('#gr-lado'), palco: R('#gr-palco'),
      classe: document.getElementById('gr-lado').classList.contains('recolhida'),
      botaoVisivel: btn.getBoundingClientRect().width > 0,
      expandido: btn.getAttribute('aria-expanded'),
      rotuloVisivel: rot ? rot.getBoundingClientRect().height > 10 : false,
      listaVisivel: document.getElementById('gr-lista').getBoundingClientRect().width > 0,
      guardado: localStorage.getItem('centelha:grid:lado-recolhido') };
  });
  const recolhida = await larguraDoPalco();
  ok(rec.classe && rec.lado.w < 40, `recolhida, a coluna vira um trilho (${rec.lado.w}px)`);
  ok(recolhida - aberta > 150,
    `e a largura dela vai para o tabuleiro (${aberta} → ${recolhida}px)`);
  ok(rec.lado.x > rec.palco.x, 'o trilho fica à direita, onde a coluna estava');
  ok(!rec.listaVisivel, 'o conteúdo some');
  ok(rec.botaoVisivel && rec.expandido === 'false',
    'menos o botão de voltar, que é o único que não pode sumir junto');
  ok(rec.rotuloVisivel, 'e o trilho continua dizendo o que guarda, com o nome de pé');
  ok(rec.guardado === '1', 'a escolha fica guardada no aparelho, como as outras dobras');

  await p.evaluate(() => document.getElementById('gr-recolher').click());
  await new Promise((r) => setTimeout(r, 450));
  const devolta = await p.evaluate(() => ({
    largura: Math.round(document.querySelector('#gr-palco').getBoundingClientRect().width),
    lista: document.getElementById('gr-lista').getBoundingClientRect().width > 0,
  }));
  ok(devolta.largura === aberta && devolta.lista,
    `e clicar de novo devolve a coluna inteira (${devolta.largura}px)`);

  // ---------------------------------------- no telefone ela volta para casa
  await p.setViewport({ width: 390, height: 844 });
  await p.waitForFunction(() => document.body.classList.contains('grid-mob'), { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 400));
  const mob = await p.evaluate(() => ({
    fundida: document.body.classList.contains('barra-fundida'),
    pai: document.querySelector('.gr-barra')?.parentElement?.className || null,
  }));
  ok(!mob.fundida && /gr-grade/.test(mob.pai || ''),
    `no telefone a barra volta para a grade, para ser folha de baixo (pai: ${mob.pai})`);

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * AGIR FORA DA VEZ E A DIVIDA DE TICKS, no tabuleiro (fase 2, 05/09/2026).
 *
 * O L25 EM ESTADO PURO, e por dois lados de uma vez. `podeAgirForaDeHora` e
 * `custoDeReagir` estavam escritas, exportadas e testadas em `combate-tempo.ts`
 * desde que o P/G/R nasceu, e os UNICOS chamadores eram os testes. E o campo
 * `Acao.divida`, com o comentario "Ticks que ja foram empurrados para o futuro",
 * era zerado pelo `declarar` e nunca escrito com valor nenhum.
 *
 * A CENA COMECA NO TICK 3, e nao no zero, porque no zero NAO HA PECA EM
 * RECUPERACAO na bancada: com o relogio parado a regra nao teria onde acontecer,
 * e um teste montado assim mediria a ausencia da cena e chamaria de ausencia do
 * defeito. No 3, a `c002` esta se recompondo (golpe no 2, livre no 6) e a `c007`
 * esta montando o gesto (golpe no 5), que sao os dois lados que a regra precisa.
 *
 * AS ASSERCOES EM PAR, e sao tres pares:
 *
 *   1. o item ⏱ ESTA no menu de quem se recompoe e NAO ESTA no de quem esta
 *      livre nem no de quem monta o gesto (esse tem o ✋). Sozinha, "o item
 *      aparece" passaria com um menu que mostra tudo para todo mundo;
 *   2. a DIVIDA nao existe na tela antes e existe depois, na linha daquela peca.
 *      Sozinha, "tem `.ini-divida`" passaria com a bancada nascendo devendo;
 *   3. o ESPELHO: o gesto do alvo esta num Tick antes e noutro depois, e o
 *      deslocamento e exatamente o que o interruptor pagou.
 *
 * E o que se le e o ESTADO da peca na bancada, e nao a linha do registro: e a
 * diferenca entre "o log disse que pagou" e "a peca esta devendo".
 */
async function cenaForaDeHora(br, url) {
  console.log('\n· agir fora da vez: o menu, a conta, a divida e o espelho');
  const p = await br.newPage();
  await p.setViewport({ width: 1500, height: 1000 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0&tempo=simultaneo&tick=3`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);

  // O ESTADO, lido da bancada. `divida` sai junto de proposito: e o campo que
  // esta cena existe para ver deixar de ser zero.
  const estado = (cid) => p.evaluate((cid) => {
    const c = (window.__SB?.tabelas?.combatentes || []).find((z) => z.id === cid);
    return { tick: c?.tick ?? null, livre: c?.acao?.livre ?? null,
      golpes: (c?.acao?.golpes || []).slice(), divida: c?.acao?.divida ?? null };
  }, cid);

  // Os itens do menu daquela peca, pelo `data-a`: e a lista do que a tela
  // oferece, que e o que "a regra se ensina pelo menu" quer dizer.
  const itens = (cid) => p.evaluate(async (cid) => {
    const t = [...document.querySelectorAll('#gr-tokens .gr-token')].find((x) => x.dataset.c === cid);
    if (!t) return { erro: `a peca ${cid} nao esta no mapa` };
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 600, clientY: 400 }));
    await new Promise((r) => setTimeout(r, 300));
    const as = [...document.querySelectorAll('#tok-menu button')].map((b) => b.dataset.a);
    document.getElementById('tok-menu').hidden = true;
    return { as };
  }, cid);

  const divididas = () => p.evaluate(() =>
    [...document.querySelectorAll('.ini-divida')].map((x) => x.textContent.trim()));

  const cRec = 'c002';   // se recompondo no Tick 3: golpe no 2, livre no 6
  const cPrep = 'c007';  // montando o gesto: golpe no 5, livre no 9
  const cLivre = 'c000'; // sem acao nenhuma

  // ---- 1: o par do menu ----
  const e0 = await estado(cRec);
  const p0 = await estado(cPrep);
  ok(e0.livre === 6 && e0.golpes.join() === '2',
    `a cena comeca com a peca em Recuperacao (golpe no ${e0.golpes.join()}, livre no ${e0.livre})`);
  ok(p0.golpes.join() === '5', `e com outra montando o gesto (golpe no ${p0.golpes.join()})`);

  const mRec = await itens(cRec);
  const mPrep = await itens(cPrep);
  const mLivre = await itens(cLivre);
  ok(!mRec.erro && mRec.as.includes('forahora'),
    `quem se recompoe TEM o item de agir fora da vez (${mRec.erro || mRec.as.join(',')})`);
  ok(!mPrep.erro && !mPrep.as.includes('forahora') && mPrep.as.includes('abortar'),
    'quem monta o gesto NAO tem: no Preparo o que cabe e desistir, e o ✋ esta la');
  ok(!mLivre.erro && !mLivre.as.includes('forahora'),
    'e quem esta livre NAO tem: age na hora, e nao paga nada por isso');

  // ---- 2: a divida nao existe antes ----
  const antes = await divididas();
  ok(antes.length === 0, `nenhuma peca deve Ticks antes (${antes.length})`);

  // ---- a caixa, a conta e o espelho ----
  const caixa = await p.evaluate(async (cid, alvoId) => {
    const t = [...document.querySelectorAll('#gr-tokens .gr-token')].find((x) => x.dataset.c === cid);
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 600, clientY: 400 }));
    await new Promise((r) => setTimeout(r, 300));
    const item = document.querySelector('#tok-menu button[data-a="forahora"]');
    if (!item) return { erro: 'o menu nao tem o item' };
    item.click();
    await new Promise((r) => setTimeout(r, 350));
    const vel = document.getElementById('fh-vel');
    if (!vel) return { erro: 'a caixa de agir fora da vez nao abriu' };
    // A VELOCIDADE ENTRA A MAO, e nao pelo padrao: o padrao vem do resumo da
    // peca e mudaria com o catalogo de armas. O que se prova aqui e a CONTA,
    // e ela precisa de um numero que o teste conheca.
    vel.value = '5';
    vel.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 150));
    const semAlvo = document.getElementById('fh-res').textContent.replace(/\s+/g, ' ').trim();
    const radio = document.querySelector(`input[name="fh-alvo"][value="${alvoId}"]`);
    const tinha = !!radio;
    if (radio) { radio.checked = true; radio.click(); }
    await new Promise((r) => setTimeout(r, 150));
    const comAlvo = document.getElementById('fh-res').textContent.replace(/\s+/g, ' ').trim();
    document.getElementById('fh-ok').click();
    await new Promise((r) => setTimeout(r, 700));
    return { semAlvo, comAlvo, tinha };
  }, cRec, cPrep);

  ok(!caixa.erro, `a caixa abre pelo menu da peca (${caixa.erro || 'abriu'})`);
  if (!caixa.erro) {
    // 3 do ciclo que sobrava (livre 6 menos Tick 3) e 5 da acao nova.
    ok(/3 Tick\(s\) do ciclo/.test(caixa.semAlvo) && /5 Tick\(s\) da acao nova/.test(
      caixa.semAlvo.normalize('NFD').replace(/[\u0300-\u036f]/g, '')),
    `a caixa parte a conta em duas: o que vira divida e o preco da acao nova (${caixa.semAlvo.slice(0, 70)})`);
    ok(/Tick 11/.test(caixa.semAlvo), 'e diz o Tick em que ele fica livre (3 + 8)');
    ok(caixa.tinha, 'quem esta montando o gesto aparece como interrompivel');
    ok(/8 Tick\(s\) para a frente/.test(caixa.comAlvo),
      `e escolher o alvo mostra o espelho antes de confirmar (${caixa.comAlvo.slice(-80)})`);
  }

  // ---- o estado, que e o que importa ----
  const e1 = await estado(cRec);
  ok(e1.divida === 3, `A DIVIDA CHEGOU AO ESTADO da peca: ${e1.divida} Tick(s) empurrados para o futuro`);
  ok(e1.livre === 11 && e1.tick === 11, `e o ciclo dela vai ate o Tick ${e1.livre}, esticado pela divida`);
  ok(e1.golpes.join() === '3', `e a acao nova resolve AGORA, no Tick ${e1.golpes.join()}`);

  // ---- 2 (a outra metade): a divida existe depois, e na linha certa ----
  const depois = await divididas();
  ok(depois.length === 1 && /deve 3/.test(depois[0]),
    `e a tela passa a dizer isso, sem pedir gesto nenhum ("${depois.join('", "')}")`);

  // ---- 3: o espelho ----
  const p1 = await estado(cPrep);
  ok(p1.golpes.join() === '13' && p1.livre === 17,
    `o gesto do interrompido andou os 8 Ticks pagos (golpe ${p0.golpes.join()} -> ${p1.golpes.join()},`
    + ` livre ${p0.livre} -> ${p1.livre})`);

  ok(erros.length === 0, `nenhum erro de pagina (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * A CONDICAO POSTA A MAO, no tabuleiro (fase 2, 04/09/2026).
 *
 * O mecanismo existia inteiro e nao tinha tela aqui: catalogo, soma, coluna,
 * mascara e RPC de pe desde a migracao 22, e o dialogo so na aba Combate. Esta
 * cena e a prova de que a tela nova mexe no ESTADO, e nao so no registro.
 *
 * A ASSERCAO EM PAR, e ela e a razao de a cena ter quatro tempos em vez de um:
 * "a Defesa caiu 4" nao prova nada sozinho, porque passaria com a Defesa
 * nascendo baixa por outro motivo. O par e o antes: a MESMA folha, aberta pelo
 * MESMO caminho, com a condicao ausente. E o fecho e a retirada, senao o teste
 * aceitaria uma tela que aplica e nunca desaplica.
 *
 *   1. sem condicao   -> estado sem `correndo`,  folha com Defesa D
 *   2. aplicando      -> estado com `correndo`,  folha com Defesa D-4
 *   3. e a tela conta -> o selo aparece na lista lateral
 *   4. tirando        -> estado vazio de novo,   folha com Defesa D
 */
async function cenaCondicaoAMao(br, url) {
  console.log('\n· a condicao posta a mao: catalogo, estado e Defesa');
  const p = await br.newPage();
  await p.setViewport({ width: 1500, height: 1000 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(600);

  // A folha do golpe, aberta pelo caminho da mesa (menu, mira, alvo), e a
  // Defesa que ela mostra. E uma funcao porque ela e chamada TRES vezes: sem a
  // condicao, com ela e depois de tirada. Abrir de jeitos diferentes seria
  // comparar duas medidas que nao sao a mesma.
  const defesaNaFolha = () => p.evaluate(async () => {
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela);
    const a = toks.find((t) => t.dataset.c === 'c002');
    const b = toks.find((t) => t !== a);
    if (!a || !b) return { erro: 'sem par de pecas na tela' };
    a.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 500, clientY: 400 }));
    await new Promise((r) => setTimeout(r, 250));
    document.querySelector('#tok-menu button[data-a="ataque"]')?.click();
    await new Promise((r) => setTimeout(r, 250));
    const rb = b.getBoundingClientRect();
    b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true,
      clientX: rb.left + rb.width / 2, clientY: rb.top + rb.height / 2 }));
    await new Promise((r) => setTimeout(r, 700));
    const dlg = document.getElementById('alvo-dlg');
    if (!dlg?.open) return { erro: 'a folha do golpe nao abriu' };
    const cel = document.querySelector('#al-defesas .d');
    const valor = cel?.querySelector('.d-v')?.textContent.trim();
    const nota = cel?.querySelector('.d-n')?.textContent.trim() || '';
    dlg.close();
    await new Promise((r) => setTimeout(r, 200));
    return { alvo: b.dataset.c, defesa: Number(valor), nota };
  });

  // O dialogo, aberto pelo menu da PECA ALVO, e uma condicao do catalogo posta
  // pelo nome desenhado (que e como a aba Combate ja a achava).
  const aplicar = (cid, nome) => p.evaluate(async (cid, nome) => {
    const t = [...document.querySelectorAll('#gr-tokens .gr-token')].find((x) => x.dataset.c === cid);
    if (!t) return { erro: 'a peca alvo sumiu do mapa' };
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 600, clientY: 400 }));
    await new Promise((r) => setTimeout(r, 250));
    const item = document.querySelector('#tok-menu button[data-a="condicoes"]');
    if (!item) return { erro: 'o menu da peca nao tem "Condicoes"' };
    item.click();
    await new Promise((r) => setTimeout(r, 300));
    const dlg = document.getElementById('cond-dlg');
    if (!dlg?.open) return { erro: 'o dialogo de condicoes nao abriu' };
    const grupos = document.querySelectorAll('#cond-catalogo .cond-grupo').length;
    const chips = [...document.querySelectorAll('#cond-catalogo .cond')];
    const alvo = chips.find((c) => c.querySelector('.cond-n')?.textContent.trim() === nome);
    if (!alvo) return { erro: `o catalogo nao tem "${nome}" (${chips.length} chips)` };
    alvo.click();
    await new Promise((r) => setTimeout(r, 400));
    const ativas = [...document.querySelectorAll('#cond-ativas .cond-n')].map((x) => x.textContent.trim());
    dlg.close();
    await new Promise((r) => setTimeout(r, 200));
    return { grupos, chips: chips.length, ativas };
  }, cid, nome);

  const tirar = (cid) => p.evaluate(async (cid) => {
    const t = [...document.querySelectorAll('#gr-tokens .gr-token')].find((x) => x.dataset.c === cid);
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 600, clientY: 400 }));
    await new Promise((r) => setTimeout(r, 250));
    document.querySelector('#tok-menu button[data-a="condicoes"]')?.click();
    await new Promise((r) => setTimeout(r, 300));
    // PELO `data-cond`, e nao pelo primeiro ✕ da fila: a peca da bancada ja
    // nasce com `cego`, e tirar a primeira tiraria a condicao errada. O teste
    // passaria assim mesmo (o estado mudaria), provando outra coisa.
    const x = document.querySelector('#cond-ativas .cond-x[data-cond="correndo"]');
    if (!x) return { erro: 'a condicao aplicada nao aparece entre as ativas' };
    x.click();
    await new Promise((r) => setTimeout(r, 400));
    document.getElementById('cond-dlg')?.close();
    await new Promise((r) => setTimeout(r, 200));
    return { ok: true };
  }, cid);

  // O ESTADO, lido da bancada e nao da tela: e a diferenca entre "o registro
  // disse que aplicou" e "a peca esta com a condicao".
  const estado = (cid) => p.evaluate((cid) => {
    const c = (window.__SB?.tabelas?.combatentes || []).find((z) => z.id === cid);
    return { ids: (c?.condicoes || []).map((k) => k.id) };
  }, cid);

  const selo = (cid) => p.evaluate((cid) => {
    const f = document.querySelector(`.gr-ficha[data-c="${cid}"] .gr-fcond`);
    return { tem: !!f, txt: f?.textContent.trim() || '', dica: f?.getAttribute('title') || '' };
  }, cid);

  // ---- 1: o antes, que e a metade do par ----
  const antes = await defesaNaFolha();
  ok(!antes.erro && Number.isFinite(antes.defesa),
    `a folha do golpe abre e mostra a Defesa do alvo (${antes.erro || antes.defesa})`);
  const cid = antes.alvo;
  const e0 = await estado(cid);
  // O PAR E RELATIVO, e nao "vazio": a peca da bancada ja nasce com `cego`, e
  // exigir estado limpo aqui seria medir a bancada em vez de medir a tela. O
  // que tem de ser verdade antes e so isto: `correndo` nao esta la.
  const base = e0.ids.slice().sort().join(',');
  ok(!e0.ids.includes('correndo'),
    `e o alvo comeca SEM "correndo" no estado (tem: ${base || 'nada'})`);
  const s0 = await selo(cid);
  ok(!/Correndo/.test(s0.dica),
    `e o selo da lista nao anuncia o que nao esta aplicado ("${s0.dica || 'sem selo'}")`);

  // ---- 2: aplicar pelo tabuleiro ----
  const ap = await aplicar(cid, 'Correndo');
  ok(!ap.erro, `o menu da peca abre o catalogo de condicoes (${ap.erro || `${ap.chips} chips em ${ap.grupos} grupos`})`);
  ok(!ap.erro && ap.grupos >= 5, `e o catalogo vem com os grupos todos (${ap.grupos})`);
  ok(!ap.erro && (ap.ativas || []).includes('Correndo'),
    `e a condicao aparece entre as ativas do dialogo (${(ap.ativas || []).join(',') || 'nenhuma'})`);

  const e1 = await estado(cid);
  ok(e1.ids.includes('correndo'),
    `E ELA CHEGOU AO ESTADO da peca, e nao so ao registro (${e1.ids.join(',') || 'nada'})`);

  // ---- 3: a tela conta, sem que ninguem abra nada ----
  const s1 = await selo(cid);
  ok(s1.tem && /Correndo/.test(s1.dica),
    `e a lista lateral passa a desenhar o selo ("${s1.txt}" · "${s1.dica}")`);

  // ---- 4: e o motor consumiu, que e o que a tela promete ----
  const depois = await defesaNaFolha();
  ok(!depois.erro && depois.defesa === antes.defesa - 4,
    `a Defesa na folha cai os 4 de "Correndo" (${antes.defesa} -> ${depois.defesa})`);
  ok(!depois.erro && /condi/i.test(depois.nota),
    `e a folha escreve de onde veio o desconto ("${depois.nota}")`);

  // ---- 5: tirar desfaz, senao a tela so sabe somar ----
  const tr = await tirar(cid);
  ok(!tr.erro, `o ✕ do dialogo tira a condicao (${tr.erro || 'ok'})`);
  const e2 = await estado(cid);
  ok(e2.ids.slice().sort().join(',') === base,
    `e o estado volta EXATAMENTE ao que era, sem levar as outras junto (${
      e2.ids.join(',') || 'vazio'} vs ${base || 'vazio'})`);
  const s2 = await selo(cid);
  ok(!/Correndo/.test(s2.dica), `e o selo para de anuncia-la ("${s2.dica || 'sem selo'}")`);
  const volta = await defesaNaFolha();
  ok(!volta.erro && volta.defesa === antes.defesa,
    `e a Defesa volta ao que era (${antes.defesa} -> ${volta.defesa})`);

  ok(erros.length === 0, `nenhum erro de pagina (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  await cena(br, dev.url, { pecas: 12, cols: 24, rows: 16, nevoa: false });
  await cena(br, dev.url, { pecas: 30, cols: 40, rows: 30, nevoa: true });
  await cenaJogador(br, dev.url);
  await cenaJogadorNevoa(br, dev.url);
await cenaRastreador(br, dev.url);
  await cenaMapas(br, dev.url);
  await cenaCelular(br, dev.url);
  await cenaCelular(br, dev.url, { papel: 'jogador' });
  await cenaGolpeAdiado(br, dev.url);
  await cenaQuaseAcerto(br, dev.url);
  await cenaFusao(br, dev.url);
  await cenaCondicaoAMao(br, dev.url);
await cenaForaDeHora(br, dev.url);
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
  + ' a caixa de fundo girando e excluindo arte, o telefone nas duas cadeiras,'
  + ' a barra fundida com a escada de ícones e a ordem de combate de pé em tela cheia,'
  + ' o golpe adiado da declaração à queda, o Quase-Acerto na folha,'
  + ' e a condição posta à mão indo do menu ao estado e daí à Defesa da folha');
// O carimbo: quando este portao passou nesta maquina. Ver `carimbo.mjs`.
carimbar('test-grid');

