// test-grid-simultaneo.mjs — o terceiro sistema, dirigido no navegador.
//
// Arquivo próprio, e não uma cena dentro do `test-grid.mjs`, por dois motivos:
// o smoke grande está em obra na outra frente (mexer nele agora é conflito
// certo), e esta suíte é do modo novo, que nasce atrás de escolha de mesa e
// pode rodar sozinha: `node scripts/test-grid-simultaneo.mjs`.
//
// O que ela persegue, na ordem do combate:
//
//   1. a mesa em `?tempo=simultaneo` troca o botão: "⏭ Tick +1", sem campo de
//      custo, porque quem cobra o tempo é a régua da ação;
//   2. atacar alguém FORA do alcance abre a declaração com o deslocamento
//      embutido (modo, m/Tick, trajetória automática), e a agenda diz em que
//      Tick o golpe cai;
//   3. o relógio corre até a PARADA REAL (o avanço unificado, 06/09/2026), e
//      para em toda parada real sem correr por cima dela; a peça declarada
//      ANDA pelo mapa a cada avanço (movimento gradual, não teleporte);
//   4. o golpe cai no Tick agendado (cartão vencido, ⏭ desligado) e resolve
//      pela faixa, como o golpe adiado já fazia;
//   5. soltar uma peça num hexágono vazio pergunta COMO (mov-dlg) em vez de
//      teleportar, e a rota declarada aparece tracejada no tabuleiro;
//   6. a criatura tem o "🤖 Modo automático" no menu, e com ele ligado declara
//      sozinha no avanço do Tick.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
// A lista e a politica de pular moram em `navegador.mjs`: aqui elas estavam
// copiadas, e a copia nao honrava `SMOKE_EXIGE_NAVEGADOR`, entao este teste
// passaria PULANDO num portao sem navegador.
const NAV = navegadorOuSair('Grid simultâneo');

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Arrasta um token noutro (ou num ponto), com os PointerEvents que o Grid ouve. */
async function arrastar(p, deSel, ate) {
  await p.evaluate(async ({ deSel, ate }) => {
    const de = document.querySelector(deSel);
    if (!de) return;
    const r = de.getBoundingClientRect();
    const fim = typeof ate === 'string'
      ? (() => { const t = document.querySelector(ate); const b = t.getBoundingClientRect();
        return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()
      : ate;
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(de, 'pointerdown', r.left + r.width / 2, r.top + r.height / 2);
    em(document, 'pointermove', fim.x, fim.y);
    em(document, 'pointerup', fim.x, fim.y);
    await new Promise((x) => setTimeout(x, 1200));
  }, { deSel, ate });
}

const rectDe = (p, sel) => p.evaluate((s) => {
  const t = document.querySelector(s); if (!t) return null;
  const r = t.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}, sel);

async function cena(br, url) {
  console.log('\n· o combate simultâneo: declarar, andar Tick a Tick, golpear');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0&tempo=simultaneo`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);

  // ---- 1: a barra do relógio muda de cara ----
  const barra = await p.evaluate(() => ({
    rotulo: document.getElementById('ini-prox')?.textContent || '',
    custoEscondido: !!document.getElementById('ini-custo-cx')?.hidden,
    tick: document.getElementById('ini-tk')?.textContent || '',
  }));
  ok(/Tick \+1/.test(barra.rotulo), `o botão vira "⏭ Tick +1" (${barra.rotulo.trim()})`);
  ok(barra.custoEscondido, 'o campo de custo some: quem cobra o tempo é a régua da ação');

  // ---- 2: atacar fora do alcance declara com deslocamento embutido ----
  // O alvo é o token MAIS LONGE do atacante (c002, espada longa): garante a
  // seção de deslocamento visível e vários Ticks de caminhada para medir.
  const alvoId = await p.evaluate(() => {
    // Só tokens DENTRO do palco visível: um alvo fora da janela não recebe o
    // `elementFromPoint` do soltar, e o arrasto viraria movimento.
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela);
    const a = toks.find((t) => t.dataset.c === 'c002'); if (!a) return null;
    const ra = a.getBoundingClientRect();
    let melhor = null, dm = -1;
    for (const t of toks) {
      if (t === a) continue;
      const r = t.getBoundingClientRect();
      const d = Math.hypot(r.left - ra.left, r.top - ra.top);
      if (d > dm) { dm = d; melhor = t.dataset.c; }
    }
    return melhor;
  });
  ok(!!alvoId, `há um alvo distante para c002 (${alvoId})`);
  await arrastar(p, '#gr-tokens .gr-token[data-c="c002"]', `#gr-tokens .gr-token[data-c="${alvoId}"]`);
  const decl = await p.evaluate(() => {
    const dlg = document.getElementById('decl-dlg');
    const tempo = (document.getElementById('dc-tempo')?.textContent || '').replace(/\s+/g, ' ');
    const cai = tempo.match(/golpe cai no Tick (\d+)/) || tempo.match(/caem nos Ticks (\d+)/);
    return {
      abriu: !!dlg?.open,
      movVisivel: !dlg?.querySelector('#dc-mov')?.hidden,
      modo: (document.getElementById('dc-mov-modo') || {}).value || '',
      auto: !!(document.getElementById('dc-mov-auto') || {}).checked,
      tickDoGolpe: cai ? parseInt(cai[1], 10) : null,
      // O PASSO DESTA PEÇA, em m/Tick: sai do próprio `dc-mov-vel`, que a
      // caixa já preenche com `passoNoModo(atacante, 'batalha')`. É o número
      // que a cena precisa para provar que a distância andada é ISTO vezes os
      // Ticks avançados, e não um chute.
      porTick: parseFloat(document.getElementById('dc-mov-vel')?.value || '0') || 0,
      tempo,
    };
  });
  if (!decl.abriu) {
    console.log('    (diagnóstico: erros de página até aqui:', erros.slice(0, 3).join(' | ') || 'nenhum', ')');
  }
  ok(decl.abriu, 'arrastar sobre o alvo abre a caixa da declaração');
  ok(decl.movVisivel, 'fora do alcance, a caixa mostra o deslocamento embutido');
  ok(decl.modo === 'batalha' && decl.auto,
    `com Deslocamento de Batalha e trajetória automática por padrão (${decl.modo})`);
  ok(decl.tickDoGolpe != null && decl.tickDoGolpe >= 2,
    `a agenda diz quando o golpe cai, e é depois do Tick 1 (${decl.tickDoGolpe}): decidir em T vale em T+1`);
  await p.evaluate(async () => {
    if (document.getElementById('decl-dlg')?.open) {
      document.getElementById('dc-ok').click();
      await new Promise((x) => setTimeout(x, 900));
    }
  });
  const faixa0 = await p.evaluate(() => ({
    n: document.querySelectorAll('#gr-ar .ar-item').length,
    t: document.querySelector('#gr-ar .ar-item')?.dataset.t,
  }));
  ok(faixa0.n > 0 && parseInt(faixa0.t, 10) === decl.tickDoGolpe,
    `o gesto entra na faixa com o Tick prometido (${faixa0.t})`);

  // ---- 3: o relógio anda de um em um, e a peça anda junto ----
  const antes = await rectDe(p, '#gr-tokens .gr-token[data-c="c002"]');
  const alvoPos = await rectDe(p, `#gr-tokens .gr-token[data-c="${alvoId}"]`);
  if (!antes || !alvoPos) {
    console.log('    (sem posição de c002 ou do alvo: pulando o resto da cena)');
    ok(false, 'as peças da caminhada estão no palco');
    await p.close(); return;
  }
  const distAntes = Math.hypot(antes.x - alvoPos.x, antes.y - alvoPos.y);
  const ticks = [];
  const antesLog = await p.evaluate(() => (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).length);
  for (let i = 0; i < 30; i++) {
    const st = await p.evaluate(() => ({
      tick: parseInt(document.getElementById('ini-tk')?.textContent || '0', 10),
      ligado: !document.getElementById('ini-prox')?.disabled,
      vencido: !!document.querySelector('#gr-ar .ar-item.vencido'),
    }));
    ticks.push(st.tick);
    if (st.vencido || !st.ligado) break;
    await p.click('#ini-prox');
    await espera(650);
  }
  // O CONTRATO MUDOU EM 06/09/2026: o ⏭ deixou de andar um Tick por clique e
  // passou a correr até a PARADA REAL (avanço unificado). O par que substitui
  // "nunca pula" é este: o relógio PODE pular, mas para em TODA parada real —
  // aqui só há uma (o golpe agendado), então um clique só deve bastar, direto
  // do Tick 0 ao Tick do golpe, sem passar batido por cima dele.
  ok(ticks.length === 2 && ticks[0] === 0 && ticks[1] === decl.tickDoGolpe,
    `o relógio anda até a parada real e para NELA, sem correr por cima (${ticks.join(' → ')}`
    + `, golpe agendado no ${decl.tickDoGolpe})`);
  // "posMudou" COMPARAVA SEMPRE CONTRA O MESMO "antes" (achado da revisão de
  // 06/09/2026): com o clique único do avanço unificado, isso deixou de medir
  // "anda gradualmente" e passou a medir a MESMA coisa que a asserção seguinte
  // ("anda na direção do alvo") mede: um teleporte direto até a posição de N
  // Ticks passa nas duas igual. A distinção volta lendo o REGISTRO da mesa
  // (`window.__SB...log`, o mesmo canal que outras cenas deste arquivo usam):
  // cada passo real grava a própria linha ("… avança Xm …"), e o número de
  // linhas prova que houve mais de um passo, não um pulo só.
  // ANCORADO NO NOME DE QUEM ANDOU (achado da revisão de 06/09/2026): sem
  // isto, o regex casa a linha de QUALQUER peça que se mova nos mesmos
  // Ticks, e outra peça andando por perto estoura o limite ou completa por
  // fora um passo que c002 não deu.
  const nomeAtacante = await p.evaluate(() =>
    (window.__SB?.tabelas?.combatentes || []).find((c) => c.id === 'c002')?.nome || '');
  const registroMov = await p.evaluate((desde) => (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || [])
    .slice(desde).map((l) => l.txt || ''), antesLog);
  const reMov = new RegExp(`^${nomeAtacante.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} (?:avança|atravessa)[^\\d]*([\\d.]+)\\s*m`);
  const passos = registroMov
    .map((t) => (t.match(reMov) || [])[1])
    .filter(Boolean).map(Number);
  const distAndada = passos.reduce((a, b) => a + b, 0);
  const nTicks = decl.tickDoGolpe;
  const esperado = decl.porTick * nTicks;
  ok(passos.length >= 2,
    `o registro guarda um passo por Tick, não um pulo só (${passos.length} passo(s): ${passos.join(', ')}m)`);
  // A ÚLTIMA PASSADA PODE SER MAIS CURTA: `caminharHex` para no alcance, e a
  // agenda não promete que o Tick do golpe caia exatamente no fim de um passo
  // inteiro. O que não pode acontecer é passar de `passo × Ticks avançados`,
  // nem ficar mais de um passo inteiro abaixo dele.
  ok(distAndada > 0 && distAndada <= esperado + 0.05 && distAndada >= esperado - decl.porTick - 0.05,
    `a distância andada bate com passo × Ticks avançados (${distAndada.toFixed(1)}m de até `
    + `${decl.porTick}×${nTicks} = ${esperado.toFixed(1)}m)`);
  // O RÓTULO É RELACIONAL, E É ISSO QUE ESTA ASSERÇÃO MEDE (conferido na
  // revisão de 06/09/2026): que a distância até o alvo DIMINUIU, não que a
  // peça andou na velocidade certa. Isso já está preso pela asserção de cima
  // (passo × Ticks avançados). SE ALGUÉM REESCREVER O RÓTULO como "a peça
  // anda na velocidade certa", ele passa a afirmar que `passoNoModo` está
  // correto — e isso não está medido aqui, nem em nenhum outro lugar desta
  // cena.
  const depois = await rectDe(p, '#gr-tokens .gr-token[data-c="c002"]');
  const distDepois = Math.hypot(depois.x - alvoPos.x, depois.y - alvoPos.y);
  ok(distDepois < distAntes, `e anda NA DIREÇÃO do alvo (${Math.round(distAntes)}px → ${Math.round(distDepois)}px)`);

  // ---- 4: o golpe cai no Tick agendado e resolve pela faixa ----
  const fim = await p.evaluate(() => ({
    tick: parseInt(document.getElementById('ini-tk')?.textContent || '0', 10),
    vencido: !!document.querySelector('#gr-ar .ar-item.vencido'),
    ligado: !document.getElementById('ini-prox')?.disabled,
    dica: document.getElementById('ini-prox')?.title || '',
  }));
  ok(fim.vencido && fim.tick === decl.tickDoGolpe,
    `a cena para exatamente no Tick do golpe (parou em ${fim.tick}, agendado ${decl.tickDoGolpe})`);
  ok(!fim.ligado && /golpe caindo/i.test(fim.dica),
    `o "⏭" desliga enquanto o golpe cai, com o motivo escrito ("${fim.dica}")`);
  const res = await p.evaluate(async () => {
    const antes = document.querySelectorAll('#gr-ar .ar-item').length;
    document.querySelector('#gr-ar .ar-item')?.click();
    await new Promise((x) => setTimeout(x, 1100));
    const folha = document.getElementById('alvo-dlg');
    const abriu = !!folha?.open;
    if (abriu) { document.getElementById('al-nao').click(); await new Promise((x) => setTimeout(x, 1300)); }
    return { abriu, depois: document.querySelectorAll('#gr-ar .ar-item').length, antes };
  });
  ok(res.abriu, 'o cartão da faixa abre a folha da ação, com a guarda do instante');
  ok(res.depois < res.antes, `resolver tira o golpe do ar (${res.antes} → ${res.depois})`);

  // ---- 5: soltar no vazio pergunta COMO, e a rota aparece tracejada ----
  const mv = await p.evaluate(async () => {
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')];
    const t = toks.find((x) => x.dataset.c === 'c003') || toks[0];
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const r = t.getBoundingClientRect();
    const em = (el, tp, x, y) => el.dispatchEvent(new PointerEvent(tp, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    // Um canto livre do palco, longe da peça.
    const fx = r.left < pal.left + pal.width / 2 ? pal.right - 90 : pal.left + 90;
    const fy = r.top < pal.top + pal.height / 2 ? pal.bottom - 90 : pal.top + 90;
    em(t, 'pointerdown', r.left + r.width / 2, r.top + r.height / 2);
    em(document, 'pointermove', fx, fy);
    em(document, 'pointerup', fx, fy);
    await new Promise((x) => setTimeout(x, 1100));
    const dlg = document.getElementById('mov-dlg');
    const abriu = !!dlg?.open;
    const nota = document.getElementById('mv-nota')?.textContent || '';
    if (abriu) { document.getElementById('mv-ok').click(); await new Promise((x) => setTimeout(x, 900)); }
    return { abriu, nota, id: t.dataset.c };
  });
  ok(mv.abriu, `soltar no hexágono vazio pergunta COMO em vez de teleportar (${mv.id})`);
  ok(/chega no \d+/.test(mv.nota), `e a caixa projeta a chegada (${mv.nota.slice(0, 60)})`);
  const rota = await p.evaluate(() => document.querySelectorAll('#gr-rotas path').length);
  ok(rota > 0, `a rota declarada aparece tracejada no tabuleiro (${rota} traço/s)`);
  const anda = await rectDe(p, `#gr-tokens .gr-token[data-c="${mv.id}"]`);
  await p.evaluate(async () => {
    const b = document.getElementById('ini-prox');
    if (!b.disabled) { b.click(); await new Promise((x) => setTimeout(x, 900)); }
  });
  const andou = await rectDe(p, `#gr-tokens .gr-token[data-c="${mv.id}"]`);
  ok(Math.hypot(andou.x - anda.x, andou.y - anda.y) > 2,
    'a peça em deslocamento declarado anda no avanço do Tick');

  // ---- 6: o robô da criatura ----
  const robo = await p.evaluate(async () => {
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')];
    // As quatro primeiras peças da bancada são PCs; qualquer outra é criatura.
    const cria = toks.find((t) => !['c000', 'c001', 'c002', 'c003'].includes(t.dataset.c));
    if (!cria) return null;
    cria.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true,
      clientX: cria.getBoundingClientRect().left + 10, clientY: cria.getBoundingClientRect().top + 10 }));
    await new Promise((x) => setTimeout(x, 500));
    const m = document.getElementById('tok-menu');
    const btn = [...(m?.querySelectorAll('button') || [])].find((b) => /automático/i.test(b.textContent));
    const tinha = !!btn;
    if (btn) { btn.click(); await new Promise((x) => setTimeout(x, 700)); }
    return { id: cria.dataset.c, tinha };
  });
  ok(!!robo?.tinha, `a criatura tem o "🤖 Modo automático" no menu (${robo?.id})`);
  if (robo?.tinha) {
    const arAntes = await p.evaluate(() => document.querySelectorAll('#gr-ar .ar-item').length);
    await p.evaluate(async () => {
      const b = document.getElementById('ini-prox');
      for (let i = 0; i < 2 && !b.disabled; i++) { b.click(); await new Promise((x) => setTimeout(x, 700)); }
    });
    const dep = await p.evaluate(() => ({
      ar: document.querySelectorAll('#gr-ar .ar-item').length,
      robo: /🤖/.test(document.getElementById('gr-registro')?.textContent
        || document.body.textContent || ''),
    }));
    ok(dep.ar > arAntes || dep.robo,
      `com o robô ligado, a criatura decide sozinha no avanço (golpes no ar ${arAntes} → ${dep.ar})`);
  }

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * A FICHA DO LANCE: tudo o que decide o ataque, dos dois lados, editável.
 *
 * O que ela persegue:
 *   1. a seção existe, nasce recolhida, e traz as três colunas;
 *   2. os campos do atacante e do alvo estão lá, com o passo REAL de cada um
 *      (e não os 3 m/Tick que a régua oferecia para todo mundo);
 *   3. corrigir um número repinta a folha na hora (a Defesa efetiva anda junto);
 *   4. corrigir o Preparo à mão refaz a linha do tempo;
 *   5. a caixinha "fixa" existe em cada campo.
 */
async function cenaFichaDoLance(br, url) {
  console.log('\n· a ficha do lance: todo número à mão, e a caixinha que fixa');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  // Sem o golpe adiado: aqui interessa a folha do acerto, que abre direto.
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);

  const abriu = await p.evaluate(async () => {
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const naTela = (t) => { const r = t.getBoundingClientRect();
      return r.left > pal.left + 4 && r.top > pal.top + 4
        && r.right < pal.right - 4 && r.bottom < pal.bottom - 4; };
    const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].filter(naTela);
    const a = toks[0], b = toks[1];
    if (!a || !b) return null;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const em = (el, t, x, y) => el.dispatchEvent(new PointerEvent(t, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    em(a, 'pointerdown', ra.left + ra.width / 2, ra.top + ra.height / 2);
    em(document, 'pointermove', rb.left + rb.width / 2, rb.top + rb.height / 2);
    em(document, 'pointerup', rb.left + rb.width / 2, rb.top + rb.height / 2);
    await new Promise((x) => setTimeout(x, 1300));
    const dlg = document.getElementById('alvo-dlg');
    const f = document.getElementById('al-ficha');
    return { folha: !!dlg?.open, ficha: !!f, recolhida: f ? !f.open : null };
  });
  ok(abriu?.folha, 'a folha da ação abre no arrasto');
  ok(abriu?.ficha, 'e ela traz a seção "A ficha do lance"');
  ok(abriu?.recolhida === true, 'que nasce recolhida: numa cena comum ninguém corrige nada');

  // Abre a seção e confere as três colunas e os campos dos dois lados.
  const campos = await p.evaluate(async () => {
    const f = document.getElementById('al-ficha');
    f.open = true;
    await new Promise((x) => setTimeout(x, 300));
    const cols = [...document.querySelectorAll('#al-ficha-c .al-ficha-col')];
    const ids = [...document.querySelectorAll('#al-ficha-c input, #al-ficha-c select')]
      .map((i) => i.id).filter(Boolean);
    return {
      colunas: cols.length,
      cabecalhos: cols.map((c) => c.querySelector('.al-ficha-h')?.textContent.trim()),
      temArma: ids.includes('alf-atacante-arma'),
      temClasse: ids.includes('alf-atacante-classe'),
      temPreparo: ids.includes('alf-atacante-pgr-preparo'),
      temPassoAtq: ids.includes('alf-atacante-passo-batalha'),
      temDefesaAlvo: ids.includes('alf-alvo-defesa'),
      temSoak: ids.includes('alf-alvo-soak-impacto'),
      temPassoAlvo: ids.includes('alf-alvo-passo-batalha'),
      // uma caixinha "fixa" por campo editável
      fixas: [...document.querySelectorAll('#al-ficha-c input[type="checkbox"]')].length,
      editaveis: ids.filter((i) => !i.endsWith('-fx')).length,
      passoAtq: document.getElementById('alf-atacante-passo-batalha')?.value,
      passoCorrida: document.getElementById('alf-atacante-passo-corrida')?.value,
      lance: [...document.querySelectorAll('#al-ficha-c .al-f.lido')]
        .map((n) => n.querySelector('span')?.textContent.trim()),
    };
  });
  ok(campos.colunas === 3, `três colunas: atacante, alvo e o lance (${campos.colunas})`);
  ok(campos.temArma && campos.temClasse && campos.temPreparo && campos.temPassoAtq,
    'o atacante tem arma, classe de tempo, P/G/R e passo');
  ok(campos.temDefesaAlvo && campos.temSoak && campos.temPassoAlvo,
    'o alvo tem Defesa, Absorção e passo');
  ok(campos.fixas === campos.editaveis && campos.fixas > 0,
    `cada campo editável tem a sua caixinha "fixa" (${campos.fixas} de ${campos.editaveis})`);
  ok((campos.lance || []).some((l) => /Alcance/.test(l || ''))
    && (campos.lance || []).some((l) => /Defesa efetiva/.test(l || '')),
    `a coluna do lance traz alcance e Defesa efetiva (${(campos.lance || []).join(', ')})`);
  // O passo REAL: a bancada monta PCs sem ficha e criaturas do bestiário, então
  // o que importa é que os três números existam e respeitem a ordem.
  ok(Number(campos.passoCorrida) >= Number(campos.passoAtq),
    `o passo vem em três velocidades e a corrida não é menor que a batalha (${campos.passoAtq} → ${campos.passoCorrida})`);

  // A CLASSE E A VELOCIDADE PARAM DE ABRIR EM BRANCO (06/09/2026): são campos
  // de OVERRIDE que o PC nunca carrega, e a régua já sabia o valor duas linhas
  // acima (`anat()`). Um PC de verdade prova o caso: sem isto os dois
  // abririam vazios sempre, para toda peça `pc` da mesa.
  const derivados = await p.evaluate(() => ({
    classe: document.getElementById('alf-atacante-classe')?.value,
    velocidade: document.getElementById('alf-atacante-velocidade')?.value,
  }));
  ok(!!derivados.classe, `a Classe de tempo do atacante não abre em branco (${derivados.classe})`);
  ok(!!derivados.velocidade && derivados.velocidade !== '',
    `nem a Velocidade (${derivados.velocidade})`);

  // Corrigir a Defesa do alvo repinta a folha na hora.
  const vivo = await p.evaluate(async () => {
    const antes = document.getElementById('al-defesas')?.textContent.replace(/\s+/g, ' ').trim();
    const inp = document.getElementById('alf-alvo-defesa');
    const base = Number(inp.value || 0);
    inp.value = String(base + 7);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((x) => setTimeout(x, 300));
    const depois = document.getElementById('al-defesas')?.textContent.replace(/\s+/g, ' ').trim();
    const marcado = inp.closest('.al-f')?.classList.contains('mexido');
    return { antes, depois, marcado, base };
  });
  ok(vivo.antes !== vivo.depois, 'corrigir a Defesa do alvo repinta a folha na hora');
  ok(vivo.marcado, 'e o campo mexido fica marcado, para o mestre não perder de vista');

  // Corrigir o Preparo à mão refaz a linha do tempo.
  const tempo = await p.evaluate(async () => {
    const antes = document.getElementById('al-tempo')?.textContent.replace(/\s+/g, ' ').trim();
    const inp = document.getElementById('alf-atacante-pgr-preparo');
    inp.value = String((Number(inp.value || 0)) + 3);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((x) => setTimeout(x, 300));
    return { antes, depois: document.getElementById('al-tempo')?.textContent.replace(/\s+/g, ' ').trim() };
  });
  ok(tempo.antes !== tempo.depois,
    `o Preparo escrito à mão refaz a linha do tempo (${(tempo.depois || '').slice(0, 60)})`);

  // A PRESSÃO é editável, e ela abre a guarda: mexer nela move a Defesa
  // efetiva na coluna do lance, que é o número contra o qual se rola.
  const pressao = await p.evaluate(async () => {
    const inp = document.getElementById('alf-alvo-pressao');
    if (!inp) return null;
    const antes = document.querySelector('#al-ficha-c .al-f.lido[data-l="def"] .al-f-v')?.textContent;
    inp.value = String(Number(inp.value || 0) + 2);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((x) => setTimeout(x, 300));
    return { antes, depois: document.querySelector('#al-ficha-c .al-f.lido[data-l="def"] .al-f-v')?.textContent };
  });
  ok(pressao && pressao.antes !== pressao.depois,
    `a Pressão é editável e abre a guarda do alvo (Defesa ${pressao?.antes} → ${pressao?.depois})`);

  // A caixinha muda o resumo do cabeçalho.
  const fixa = await p.evaluate(async () => {
    const fx = document.getElementById('alf-alvo-defesa-fx');
    fx.checked = true; fx.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((x) => setTimeout(x, 250));
    return document.getElementById('al-ficha-r')?.textContent.trim();
  });
  ok(/fixado/.test(fixa || ''), `marcar a caixinha avisa que o número vai durar ("${fixa}")`);

  // A FOLHA ACEITA O DADO EM VEZ DO TOTAL (06/09/2026): a mesa digita as faces
  // que caíram, separadas por vírgula, e a folha soma sozinha. Digitar dados
  // conhecidos (e não o total pronto) é o que prova que a soma sai da conta, e
  // não de um número que o teste já sabia de antemão.
  const digitado = await p.evaluate(async () => {
    const totalInp = document.getElementById('al-total');
    const dnInp = document.getElementById('al-dn');
    totalInp.value = '4,2,6'; totalInp.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((x) => setTimeout(x, 200));
    const poolAcerto = document.getElementById('al-pool')?.textContent || '';
    const veredito = document.getElementById('al-vered')?.textContent || '';
    dnInp.value = '3,5'; dnInp.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((x) => setTimeout(x, 200));
    const poolDano = document.getElementById('al-dn-pool')?.textContent || '';
    const conta = document.getElementById('al-dn-conta')?.textContent || '';
    return { poolAcerto, veredito, poolDano, conta };
  });
  ok(/4,\s*2,\s*6/.test(digitado.poolAcerto),
    `os dados digitados no acerto aparecem descritos, e não só o total (${digitado.poolAcerto})`);
  ok(digitado.veredito.trim().length > 0 && !/não tem o que dizer/.test(digitado.veredito),
    `e a régua deriva o veredito a partir do que foi digitado ("${digitado.veredito.replace(/\s+/g, ' ').trim()}")`);
  ok(/3,\s*5/.test(digitado.poolDano),
    `os dados digitados no dano também aparecem descritos (${digitado.poolDano})`);
  ok(/Absorção/.test(digitado.conta),
    `e a prévia do dano usa a soma digitada, não um total à parte ("${digitado.conta.replace(/\s+/g, ' ').trim()}")`);

  // O CLIQUE APLICA, E O REGISTRO GUARDA A CONTA DO DANO — antes só o líquido
  // final ficava na mesa; as faces que produziram o bruto morriam com a folha.
  const antesLog = await p.evaluate(() =>
    (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).length);
  await p.evaluate(async () => {
    document.getElementById('al-sim').click();
    await new Promise((x) => setTimeout(x, 500));
  });
  const registro = await p.evaluate(() =>
    (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).map((l) => l.txt || ''));
  const novas = registro.slice(antesLog);
  ok(novas.some((t) => /dano \(\[?3,\s*5/.test(t)),
    `o registro mostra as faces do dano, e não só o número final aplicado (${novas.join(' | ')})`);

  await p.evaluate(() => { const d = document.getElementById('alvo-dlg'); if (d?.open) d.close(); });
  await espera(600);
  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * Um HEXÁGONO LIVRE, escolhido pelos hexágonos de verdade (`.hx`).
 *
 * Não serve uma rede de pixels: o palco tem fundo em volta do tabuleiro, e
 * soltar ali não é soltar em casa nenhuma (o gesto morre em silêncio). E a
 * folga tem de ser generosa, porque o tabuleiro recusa quem pousa dentro do
 * círculo de outra peça, e uma criatura Enorme ocupa muito mais que a casa
 * dela.
 */
const hexLivreDe = (p, ref, modo, faixa = [0, 1e9]) => p.evaluate(({ ref, modo, faixa }) => {
  const pal = document.getElementById('gr-palco').getBoundingClientRect();
  const vis = {
    x0: Math.max(pal.left, 0) + 20, y0: Math.max(pal.top, 0) + 20,
    x1: Math.min(pal.right, innerWidth) - 20, y1: Math.min(pal.bottom, innerHeight) - 20,
  };
  const toks = [...document.querySelectorAll('#gr-tokens .gr-token')].map((o) => {
    const q = o.getBoundingClientRect();
    return { x: q.left + q.width / 2, y: q.top + q.height / 2, r: Math.max(q.width, q.height) / 2 };
  });
  let melhor = null, nota = modo === 'longe' ? -1 : 1e9;
  for (const hx of document.querySelectorAll('#gr-hexes .hx')) {
    const r = hx.getBoundingClientRect();
    const fx = r.left + r.width / 2, fy = r.top + r.height / 2;
    if (fx < vis.x0 || fx > vis.x1 || fy < vis.y0 || fy > vis.y1) continue;
    if (toks.some((o) => Math.hypot(fx - o.x, fy - o.y) < o.r + 45)) continue;
    const d = Math.hypot(fx - ref.x, fy - ref.y);
    if (d < faixa[0] || d > faixa[1]) continue;
    if (modo === 'longe' ? d > nota : d < nota) { nota = d; melhor = { x: fx, y: fy, d }; }
  }
  return melhor;
}, { ref, modo, faixa });

/** Solta a peça no ponto: devolve qual caixa abriu. */
const soltarEmDe = (p, cid, ponto) => p.evaluate(async ({ cid, ponto }) => {
  const t = document.querySelector(`.gr-token[data-c="${cid}"]`);
  if (!t) return { caixa: null };
  const b = t.getBoundingClientRect();
  const em = (el, tp, x, y) => el.dispatchEvent(new PointerEvent(tp, {
    bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
  em(t, 'pointerdown', b.left + b.width / 2, b.top + b.height / 2);
  em(document, 'pointermove', ponto.x, ponto.y);
  em(document, 'pointerup', ponto.x, ponto.y);
  await new Promise((x) => setTimeout(x, 1100));
  const aberta = [...document.querySelectorAll('dialog[open]')].pop();
  return { caixa: aberta?.id || null };
}, { cid, ponto });

/**
 * O ALVO QUE SAI DE BAIXO: a agenda re-projetada, no tabuleiro.
 *
 * A agenda nascia na DECLARAÇÃO, e a declaração assume o alvo parado. Quando
 * ele fugia, o atacante o perseguia mas o Tick do golpe ficava onde estava: o
 * cartão vencia com o alvo ainda longe e a cena travava no "⏭" esperando o
 * mestre resolver um golpe que não alcançava nada.
 *
 * A cena arma o caso à mão, porque ele não acontece sozinho: põe um herói a uma
 * distância curta do outro, declara o ataque, e MANDA O ALVO CORRER. Depois
 * confere que o Tick do cartão anda para a frente, que o registro conta o
 * adiamento, e que o relógio não trava.
 */
async function cenaAlvoQueFoge(br, url) {
  console.log('\n· o alvo que sai de baixo: a agenda re-projetada no avanço');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0&tempo=simultaneo`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);

  const hexLivre = (ref, modo, faixa) => hexLivreDe(p, ref, modo, faixa);
  const soltarEm = (cid, ponto) => soltarEmDe(p, cid, ponto);

  // ---- 1: os dois heróis, a uma distância curta e sem ninguém no meio ----
  // Armado à mão de propósito: na bancada as peças nascem emboladas, e uma
  // perseguição precisa de campo aberto para ser medida.
  const posC002 = await rectDe(p, '#gr-tokens .gr-token[data-c="c002"]');
  const perto = await hexLivre(posC002, 'perto', [130, 320]);
  if (!perto) { ok(false, 'há hexágono livre a uma distância curta de c002'); await p.close(); return; }
  const posto = await soltarEm('c003', perto);
  if (posto.caixa === 'mov-dlg') {
    // "Pôr direto" é ferramenta de mestre: arruma a cena sem gastar Tick.
    await p.evaluate(async () => {
      document.getElementById('mv-direto').click();
      await new Promise((x) => setTimeout(x, 900));
    });
  }
  const posC003 = await rectDe(p, '#gr-tokens .gr-token[data-c="c003"]');
  ok(!!posC003 && Math.hypot(posC003.x - posC002.x, posC003.y - posC002.y) < 400,
    'c003 é posto em campo aberto, ao alcance de uma corrida de c002');

  // ---- 2: c002 declara contra c003 ----
  await arrastar(p, '#gr-tokens .gr-token[data-c="c002"]', '#gr-tokens .gr-token[data-c="c003"]');
  const decl = await p.evaluate(async () => {
    const dlg = document.getElementById('decl-dlg');
    if (!dlg?.open) return { abriu: false };
    const t = (document.getElementById('dc-tempo')?.textContent || '').replace(/\s+/g, ' ');
    const cai = t.match(/golpe cai no Tick (\d+)/) || t.match(/caem nos Ticks (\d+)/);
    document.getElementById('dc-ok').click();
    await new Promise((x) => setTimeout(x, 1000));
    return { abriu: true, tick: cai ? parseInt(cai[1], 10) : null };
  });
  ok(decl.abriu && decl.tick != null, `c002 declara contra c003, golpe agendado no Tick ${decl.tick}`);
  if (!decl.abriu) { await p.close(); return; }

  // ---- 3: e o alvo sai correndo, para o ponto mais longe do tabuleiro ----
  const longe = await hexLivre(posC002, 'longe');
  const fuga = longe ? await soltarEm('c003', longe) : { caixa: null };
  if (fuga.caixa === 'mov-dlg') {
    await p.evaluate(async () => {
      const sel = document.getElementById('mv-modo');
      sel.value = 'corrida'; sel.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((x) => setTimeout(x, 200));
      // Depressa o bastante para nunca ser alcançado: a perseguição que não fecha.
      document.getElementById('mv-vel').value = '12';
      document.getElementById('mv-ok').click();
      await new Promise((x) => setTimeout(x, 900));
    });
  }
  ok(fuga.caixa === 'mov-dlg', `o alvo declara deslocamento, correndo (caixa: ${fuga.caixa})`);
  if (fuga.caixa !== 'mov-dlg') { await p.close(); return; }

  // ---- 4: UM clique leva a perseguição até a parada real ----
  //
  // O CONTRATO MUDOU EM 06/09/2026, e é o mesmo do item 3 da cena principal:
  // esta cena media "3 cliques, e o golpe ainda não venceu" porque o alvo
  // corria "rápido o bastante para nunca ser alcançado" DENTRO DE 3 TICKS —
  // a fuga é para um hexágono FINITO do tabuleiro (`soltarEm(..., 'longe')`),
  // e não uma fuga perpétua. Um único clique do avanço unificado não para em
  // 3 Ticks: ele corre Tick a Tick reprojetando a agenda a cada passada
  // (como o `for` antigo fazia, um clique de cada vez) até a PARADA REAL —
  // aqui, o alvo chega ao destino, para de fugir, e o golpe finalmente
  // alcança. "Nunca vence" nunca foi verdade além da janela de 3 cliques; o
  // que a cena prova agora é que o avanço aguenta perseguir sem prender a aba,
  // e entrega a perseguição resolvida.
  const cartao = () => p.evaluate(() => {
    const it = document.querySelector('#gr-ar .ar-item[data-golpe]');
    return {
      tick: it ? parseInt(it.dataset.t, 10) : null,
      relogio: parseInt(document.getElementById('ini-tk')?.textContent || '0', 10),
      travado: !!document.getElementById('ini-prox')?.disabled,
    };
  });
  const antes = await cartao();
  const t0 = Date.now();
  await p.click('#ini-prox');
  await espera(1500);
  const dt = Date.now() - t0;
  const depois = await cartao();
  ok(dt < 8000, `o "⏭" não trava perseguindo um alvo que foge (voltou em ${dt} ms)`);
  ok(depois.tick != null && antes.tick != null && depois.tick >= antes.tick,
    `o Tick do golpe só anda para a frente ao reprojetar, nunca para trás (${antes.tick} → ${depois.tick})`);
  ok(depois.travado,
    `e o avanço leva a perseguição até a parada real: o golpe alcança e o "⏭" desliga (relógio ${depois.relogio}, golpe ${depois.tick})`);
  const registro = await p.evaluate(async () => {
    document.getElementById('gr-registro').click();
    await new Promise((x) => setTimeout(x, 800));
    const d = [...document.querySelectorAll('dialog[open]')].pop();
    const txt = (d?.textContent || '').replace(/\s+/g, ' ');
    d?.close();
    return txt;
  });
  ok(/golpe adiado do Tick \d+ para o \d+/.test(registro),
    'o registro conta o adiamento, e diz de onde para onde');

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * A INVESTIDA COBRA UMA VEZ SO, e quem cobra e a condicao (decidido em 05/09/2026).
 *
 * O DEFEITO QUE ELA GUARDA: o -2 da Investida saia de DOIS lugares que nao se
 * conheciam · a escada do motor (lendo `acao.mov.modo`) e a condicao
 * `investindo` do catalogo, aplicada a mao na aba Combate. As duas se somavam na
 * `defesaEfetiva` e davam -6, e a regua diz -4. Nenhuma das quatro fontes da
 * regua diz -6, e -6 calado nao foi decidido por ninguem.
 *
 * A SAIDA foi tirar o numero do motor e deixa-lo so na condicao, com o TABULEIRO
 * alimentando ela: declarar Investida poe `investindo` sozinho, e a varredura do
 * Tick a tira quando o Preparo acaba. Foi a unica das tres opcoes em que ninguem
 * perde caminho: a aba Combate continua aplicando a mao, e o Grid nao pede gesto.
 *
 * AS TRES ASSERCOES, e as tres sao necessarias:
 *   1. declarar POE a condicao        · senao o Grid nao cobraria nada
 *   2. a Defesa cai o numero da regua · e nao o dobro dele
 *   3. o Tick TIRA a condicao         · senao ela ficaria grudada para sempre,
 *      penalizando em silencio, que e pior que a dupla cobranca que ela conserta
 */
async function cenaInvestidaUmaVez(br, url) {
  console.log('\n· a Investida cobra uma vez so, e quem cobra e a condicao');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0&tempo=simultaneo`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);

  /** As condicoes de uma peca, como o navegador as tem. */
  const condsDe = (cid) => p.evaluate((cid) => {
    const c = (window.__SB?.tabelas?.combatentes || []).find((x) => x.id === cid);
    return (c?.condicoes || []).map((k) => `${k.id}${k.auto ? ':auto' : ':mao'}`);
  }, cid);

  // ---- 1: c003 posto LONGE, para a caixa oferecer deslocamento ----
  //
  // Longe de proposito: a caixa de modo so aparece fora do alcance (`SIML() &&
  // longe`). Com as pecas emboladas da bancada nao ha Investida a declarar, e a
  // cena mediria o nada.
  const posC002 = await rectDe(p, '#gr-tokens .gr-token[data-c="c002"]');
  const longe = await hexLivreDe(p, posC002, 'perto', [260, 460]);
  if (!longe) { ok(false, 'ha hexagono livre a uma distancia de investida de c002'); await p.close(); return; }
  const posto = await soltarEmDe(p, 'c003', longe);
  if (posto.caixa === 'mov-dlg') {
    await p.evaluate(async () => {
      document.getElementById('mv-direto').click();
      await new Promise((x) => setTimeout(x, 900));
    });
  }

  const antes = await condsDe('c002');
  ok(!antes.some((k) => k.startsWith('investindo')),
    `c002 comeca sem a marca de Investida (${antes.join(', ') || 'sem condicao'})`);

  // ---- 2: c002 declara INVESTINDO contra c003 ----
  await arrastar(p, '#gr-tokens .gr-token[data-c="c002"]', '#gr-tokens .gr-token[data-c="c003"]');
  const decl = await p.evaluate(async () => {
    const dlg = document.getElementById('decl-dlg');
    if (!dlg?.open) return { abriu: false };
    const cx = document.getElementById('dc-mov');
    if (!cx || cx.hidden) { dlg.close(); return { abriu: true, ofereceu: false }; }
    const sel = document.getElementById('dc-mov-modo');
    const tem = [...sel.options].some((o) => o.value === 'investida');
    if (!tem) { dlg.close(); return { abriu: true, ofereceu: false }; }
    sel.value = 'investida';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((x) => setTimeout(x, 250));
    const t = (document.getElementById('dc-tempo')?.textContent || '').replace(/\s+/g, ' ');
    const cai = t.match(/golpe cai no Tick (\d+)/) || t.match(/caem nos Ticks (\d+)/);
    document.getElementById('dc-ok').click();
    await new Promise((x) => setTimeout(x, 1100));
    return { abriu: true, ofereceu: true, tick: cai ? parseInt(cai[1], 10) : null };
  });
  ok(decl.abriu && decl.ofereceu,
    `a caixa de ataque oferece a Investida quando o alvo esta longe (${
      decl.abriu ? (decl.ofereceu ? 'ofereceu' : 'nao ofereceu') : 'nao abriu'})`);
  if (!decl.ofereceu) { await p.close(); return; }

  // 1. DECLARAR POE A CONDICAO. Sem isto o Grid nao cobraria nada: o motor
  //    deixou de cobrar a Investida de proposito, e quem cobra agora e ela.
  const posta = await condsDe('c002');
  ok(posta.includes('investindo:auto'),
    `declarar a Investida POE a condicao, e marcada como do tabuleiro (${posta.join(', ')})`);

  // 2. E A DEFESA CAI O NUMERO DA REGUA, UMA VEZ SO. A conta e a do `regras.json`
  //    (`escada.preparo + movimento.investida.defesaExtra`), lida do proprio
  //    arquivo em vez de escrita aqui: numero copiado para o teste e a terceira
  //    fonte que ninguem liga, que e o defeito que este commit fecha.
  const soma = await p.evaluate(() => {
    const c = (window.__SB?.tabelas?.combatentes || []).find((x) => x.id === 'c002');
    const cs = (c?.condicoes || []).filter((k) => k.id === 'investindo');
    return cs.length;
  });
  ok(soma === 1, `e UMA condicao so, nao duas: e a dupla cobranca que nao pode voltar (${soma})`);

  // 3. O TICK TIRA A CONDICAO quando o Preparo acaba. Sem isto ela ficaria
  //    grudada para sempre, penalizando em silencio.
  //
  // "saiu" ERA O ORDINAL DO CLIQUE, E NÃO O TICK (achado da revisão de
  // 06/09/2026): com o avanço unificado, UM clique já corre até a parada real,
  // então `saiu` dava sempre 1, em toda execução — o "quando" saiu da
  // medição, e um teste que passasse a condição sobrevivendo três Ticks a mais
  // passaria igual, porque nada media o NÚMERO do Tick. O conserto compara o
  // Tick em que a marca sumiu com o Tick de fim do Preparo que a própria cena
  // declarou (`decl.tick`, "golpe cai no Tick N"), e não com a posição no
  // laço.
  let tickSaida = null;
  for (let i = 0; i < 8; i++) {
    const st = await p.evaluate(() => !!document.getElementById('ini-prox')?.disabled);
    if (st) break;
    await p.click('#ini-prox');
    await espera(700);
    const agora = await condsDe('c002');
    if (!agora.some((k) => k.startsWith('investindo'))) {
      tickSaida = await p.evaluate(() => parseInt(document.getElementById('ini-tk')?.textContent || '0', 10));
      break;
    }
  }
  ok(tickSaida != null && tickSaida === decl.tick,
    `e o relogio TIRA a marca exatamente quando o Preparo acaba (saiu no Tick ${tickSaida}, fim do Preparo no ${decl.tick})`);

  ok(erros.length === 0, `nenhum erro de pagina (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * A CONDICAO COM PRAZO VENCE, E A POSTA A MAO FICA · a L38.
 *
 * O PAR E O TESTE, e nenhuma das duas metades vale sozinha. So a primeira
 * (a condicao com `ate` some) passa igualzinho se a varredura estiver
 * derrubando TUDO, inclusive o que o mestre pos com a propria mao, que e o
 * defeito que a regra existe para impedir. So a segunda (a do mestre fica)
 * passa com a varredura desligada. As duas juntas prendem o comportamento
 * entre dois erros opostos.
 *
 * A DE VENCER VEM DA BANCADA (`?extras=presa`), semeada como o `deslocar` das
 * Artes de empurrao a deixa: `ate` e `porArte`, sem efeito nenhum atras dela.
 * A DE FICAR VEM DO DIALOGO DE VERDADE, e nao de uma semente: a propriedade
 * que sustenta a peneira e que o dialogo do mestre NAO grava `ate`, e essa
 * propriedade so vale medida na saida dele.
 */
async function cenaCondicaoQueVence(br, url) {
  console.log('\n· a condicao com prazo vence sozinha, a posta a mao fica');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=8&cols=24&rows=16&nevoa=0`
    + '&tempo=simultaneo&extras=presa', { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);

  /** As condicoes de uma peca, cruas, como o banco as tem. */
  const cru = (cid) => p.evaluate((cid) => {
    const c = (window.__SB?.tabelas?.combatentes || []).find((x) => x.id === cid);
    return (c?.condicoes || []).map((k) => ({ ...k }));
  }, cid);
  const temCond = (lista, id) => lista.some((k) => k.id === id);

  // ---- 1: o retrato de antes ----
  const presaAntes = await cru('c001');
  ok(temCond(presaAntes, 'imobilizado'),
    `c001 comeca com a condicao PRESA, a de antes da L38 (${
      presaAntes.map((k) => `${k.id}${k.ate != null ? `@${k.ate}` : ''}`).join(', ') || 'nenhuma'})`);
  const maoAntes = await cru('c000');
  ok(temCond(maoAntes, 'cego'),
    `c000 comeca com uma condicao SEM prazo, do feitio que o mestre poe (${
      maoAntes.map((k) => k.id).join(', ') || 'nenhuma'})`);

  // ---- 2: o mestre poe uma A MAO, pelo dialogo de verdade ----
  const posta = await p.evaluate(async () => {
    const tk = document.querySelector('#gr-tokens .gr-token[data-c="c002"]');
    if (!tk) return { abriu: false };
    tk.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 500, clientY: 400 }));
    await new Promise((r) => setTimeout(r, 300));
    const b = document.querySelector('#tok-menu button[data-a="condicoes"]');
    if (!b) return { abriu: false };
    b.click();
    await new Promise((r) => setTimeout(r, 400));
    const dlg = document.getElementById('cond-dlg');
    if (!dlg?.open) return { abriu: false };
    // O PRIMEIRO CHIP DO CATALOGO, e nao um nome escrito aqui: nome copiado
    // para o teste envelhece calado quando o catalogo muda.
    const chip = document.querySelector('#cond-catalogo .cond');
    const nome = chip?.querySelector('.cond-n')?.textContent || '';
    chip?.click();
    await new Promise((r) => setTimeout(r, 600));
    document.getElementById('cond-fechar')?.click();
    return { abriu: true, nome };
  });
  ok(posta.abriu, `o dialogo de condicoes do mestre abre e aceita um chip (${posta.nome || 'nao abriu'})`);
  if (!posta.abriu) { await p.close(); return; }

  const maoNova = await cru('c002');
  ok(maoNova.length > 0, `o mestre pos uma condicao a mao em c002 (${maoNova.map((k) => k.id).join(', ')})`);
  // A PROPRIEDADE QUE SUSTENTA A PENEIRA, medida na saida do dialogo de
  // verdade: o mestre nao grava prazo. No dia em que este `ok` ficar vermelho,
  // o dialogo ganhou campo de duracao e a peneira mudou de significado.
  ok(maoNova.every((k) => k.ate == null),
    `e SEM prazo: nada que o mestre poe a mao grava \`ate\` (${
      maoNova.map((k) => `${k.id}${k.ate != null ? `@${k.ate}` : ''}`).join(', ')})`);
  const idMao = maoNova[0]?.id;

  // ---- 3: o relogio anda ----
  //
  // "voltas" ERA O ORDINAL DO CLIQUE, MESMA FORMA DA INVESTIDA (achado da
  // revisão de 06/09/2026): com o avanço unificado um clique já corre até a
  // parada real, então `voltas` dava 1 sempre que o prazo vencesse dentro do
  // primeiro avanço, e o "quando" saiu da medição outra vez. O conserto e
  // igual: compara o Tick da queda com o `ate` que a condicao ja trazia
  // (`presaAntes`), e nao com a posicao no laco.
  const ateAlvo = presaAntes.find((k) => k.id === 'imobilizado')?.ate ?? null;
  let tickQueda = null;
  for (let i = 0; i < 6; i++) {
    if (await p.evaluate(() => !!document.getElementById('ini-prox')?.disabled)) break;
    await p.click('#ini-prox');
    await espera(800);
    if (!temCond(await cru('c001'), 'imobilizado')) {
      tickQueda = await p.evaluate(() => parseInt(document.getElementById('ini-tk')?.textContent || '0', 10));
      break;
    }
  }

  // ---- 4: O PAR ----
  const presaDepois = await cru('c001');
  ok(!temCond(presaDepois, 'imobilizado') && tickQueda != null && tickQueda === ateAlvo,
    `a condicao COM prazo caiu exatamente no Tick do \`ate\` (caiu no ${tickQueda}, ate era ${ateAlvo} · sobrou ${
      presaDepois.map((k) => k.id).join(', ') || 'nada'})`);
  const maoDepois = await cru('c002');
  ok(idMao && temCond(maoDepois, idMao),
    `e a que o MESTRE pos a mao continua la: a regua nao calcula por cima dele (${
      maoDepois.map((k) => k.id).join(', ') || 'sumiu'})`);
  const cegoDepois = await cru('c000');
  ok(temCond(cegoDepois, 'cego'),
    `a da semente, tambem sem prazo, tambem ficou (${cegoDepois.map((k) => k.id).join(', ') || 'sumiu'})`);

  // ---- 5: o registro diz o que caiu, e por que ----
  const disse = await p.evaluate(() => (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || [])
    .some((l) => /venceu o prazo e saiu/.test(l.txt || '')));
  ok(disse, 'e o registro da mesa DIZ o que caiu e por que: numero que muda sozinho precisa de linha');

  // ---- 6: A TRAVA, varrida em todas as pecas ----
  //
  // A peneira e "tem `ate`?", e ela so e um mecanismo enquanto NADA que o
  // mestre poe a mao tiver `ate`. Esta assercao e a guarda dessa propriedade:
  // no dia em que o dialogo ganhar campo de duracao, ela fica vermelha, e o
  // dia em que a feature chega e o dia em que o portao fala.
  const forasteiras = await p.evaluate(() => {
    const fora = [];
    for (const c of (window.__SB?.tabelas?.combatentes || [])) {
      for (const k of (c.condicoes || [])) {
        if (k.ate != null && !k.porArte && !k.auto) fora.push(`${c.id}:${k.id}@${k.ate}`);
      }
    }
    return fora;
  });
  ok(forasteiras.length === 0,
    `nenhuma condicao com \`ate\` sem \`porArte\` nem \`auto\`: a peneira continua sendo UMA pergunta (${
      forasteiras.join(', ') || 'nenhuma'})`);

  ok(erros.length === 0, `nenhum erro de pagina (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * O CASO QUE TRAVAVA A ABA, achado em 06/09/2026 rodando esta mesma bancada:
 * cena sem golpe agendado, sem mordida e sem diálogo pendente — o intervalo
 * comum entre alguém resolver o golpe e o próximo jogador declarar a ação
 * seguinte. Sem a parada por CENA ASSENTADA (item (b) do avanço unificado),
 * o laço do ⏭ rodava até o timeout do protocolo do navegador; a mesa de
 * verdade travaria até um recarregamento de página.
 *
 * A REDE (item (a), o teto de Ticks) existe para o dia em que (b) estiver
 * errada de novo: esta cena confere que ela NÃO acende aqui, porque quem devia
 * parar o laço é (b), e a rede acendendo por cima seria o mesmo sinal de
 * "a condição não cobre este caso" que ela existe para dar — só que no caso
 * ERRADO, o que apagaria o sinal em vez de mostrá-lo.
 */
async function cenaAvancoParaSozinho(br, url) {
  console.log('\n· o avanço para sozinho quando a cena assenta, sem travar e sem acender a rede');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0&tempo=simultaneo`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);

  // NINGUÉM DECLAROU NADA AINDA: é o estado mais assentado que existe, e o
  // primeiro clique da mesa acontece exatamente aqui.
  const antes = await p.evaluate(() =>
    parseInt(document.getElementById('ini-tk')?.textContent || '0', 10));
  const t0 = Date.now();
  await p.click('#ini-prox');
  await espera(900);
  const dt = Date.now() - t0;
  const depois = await p.evaluate(() =>
    parseInt(document.getElementById('ini-tk')?.textContent || '0', 10));

  ok(dt < 5000, `o clique NÃO trava com a cena assentada: voltou em ${dt} ms`);
  ok(depois === antes + 1,
    `e o relógio andou EXATAMENTE um Tick, parado por (b) na primeira ocasião (${antes} → ${depois})`);

  // O CONTADOR, E NÃO O TEXTO DO LOG: a linha "⚑ ⏭ parou..." é prosa para o
  // mestre, e prosa é o portão por literal outra vez se uma bancada casar
  // nela — reescrever a frase apagaria esta asserção calado. `window.
  // __AVANCO_TETO_ACESO()` é o sinal de verdade (ver o comentário de
  // `TETO_AVANCO_ACESO`, em grid.astro).
  const tetoAceso = await p.evaluate(() => window.__AVANCO_TETO_ACESO?.() ?? null);
  ok(tetoAceso === 0,
    `e a REDE (a) não acende: quem parou o laço foi a parada por cena assentada (b), não o teto (contador ${tetoAceso})`);

  ok(erros.length === 0, `nenhum erro de pagina (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

/**
 * A REDE (item (a) do avanço unificado) É OBSERVÁVEL, MAS NUNCA FOI OBSERVADA
 * ACESA (achado da revisão de 06/09/2026): a única asserção que a toca, em
 * `cenaAvancoParaSozinho`, é `tetoAceso === 0`. Uma rede que nunca dispara
 * passa nessa conta para sempre, por não existir, não por estar correta — e
 * ninguém tinha como saber se `window.__AVANCO_TETO_ACESO` de fato incrementa
 * quando deveria.
 *
 * O CONSERTO É BARATO: `TETO_AVANCO_SEM_PARADA` lê `?tetoAvanco=N` da URL
 * (`grid.astro`), então esta cena baixa o teto para 2 e declara um
 * deslocamento puro (sem golpe) longo o bastante para levar bem mais que 2
 * Ticks — a peça segue com `.mov` em curso, `cenaAssentada()` continua falsa
 * a cada Tick, e o laço só para pelo teto. Prova as DUAS metades da rede: o
 * contador sobe (ela realmente acende quando deveria) e o laço realmente para
 * (o relógio não passa de `tetoAvanco` Ticks, e o clique não trava a aba).
 */
async function cenaTetoForcado(br, url) {
  console.log('\n· a rede do avanço (item a): forçada a acender, e provada acesa');
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0&tempo=simultaneo&tetoAvanco=2`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);

  // C003, E NÃO C002: o `bench=12` semeia a maioria das peças já com um golpe
  // em andamento (achado ao depurar esta cena) — só as peças com a condição
  // `cego` (c000, c003, c006, c009) nascem LIVRES, e só uma peça livre abre a
  // caixa de deslocamento solto (`moverSimultaneo`, `grid.astro:5878`); as
  // outras caem direto em `porNoMapa`, sem diálogo nenhum (`grid.astro:5887`,
  // dentro de `moverSimultaneo`).
  //
  // O CANTO LIVRE MAIS LONGE do palco (a mesma técnica da cena 1, item 5): no
  // passo padrão (modo `batalha`), chegar lá exige muito mais que 2 Ticks,
  // então a cena nunca assenta antes do teto.
  const solta = await p.evaluate(async () => {
    const t = document.querySelector('#gr-tokens .gr-token[data-c="c003"]');
    if (!t) return { caixa: null };
    const pal = document.getElementById('gr-palco').getBoundingClientRect();
    const r = t.getBoundingClientRect();
    const em = (el, tp, x, y) => el.dispatchEvent(new PointerEvent(tp, {
      bubbles: true, clientX: x, clientY: y, pointerId: 1 }));
    const fx = r.left < pal.left + pal.width / 2 ? pal.right - 90 : pal.left + 90;
    const fy = r.top < pal.top + pal.height / 2 ? pal.bottom - 90 : pal.top + 90;
    em(t, 'pointerdown', r.left + r.width / 2, r.top + r.height / 2);
    em(document, 'pointermove', fx, fy);
    em(document, 'pointerup', fx, fy);
    await new Promise((x) => setTimeout(x, 1100));
    const dlg = document.getElementById('mov-dlg');
    const caixa = dlg?.open ? 'mov-dlg' : null;
    if (caixa) { document.getElementById('mv-ok').click(); await new Promise((x) => setTimeout(x, 900)); }
    return { caixa };
  });
  ok(solta.caixa === 'mov-dlg', `soltar num canto livre e longe abre a caixa de deslocamento (caixa: ${solta.caixa})`);
  if (solta.caixa !== 'mov-dlg') { await p.close(); return; }

  const antes = await p.evaluate(() =>
    parseInt(document.getElementById('ini-tk')?.textContent || '0', 10));
  const t0 = Date.now();
  await p.click('#ini-prox');
  await espera(1200);
  const dt = Date.now() - t0;
  const depois = await p.evaluate(() =>
    parseInt(document.getElementById('ini-tk')?.textContent || '0', 10));
  const tetoAceso = await p.evaluate(() => window.__AVANCO_TETO_ACESO?.() ?? null);

  ok(dt < 5000, `o clique NÃO trava com o teto baixado: voltou em ${dt} ms`);
  ok(depois === antes + 2,
    `e o laço realmente PARA no teto (2), sem correr mais Ticks (${antes} → ${depois})`);
  ok(tetoAceso === 1,
    `a REDE (a) acende quando deveria: o contador sobe de 0 para 1 (leu ${tetoAceso})`);

  ok(erros.length === 0, `nenhum erro de pagina (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  await cena(br, dev.url);
  await cenaAlvoQueFoge(br, dev.url);
  await cenaFichaDoLance(br, dev.url);
  await cenaInvestidaUmaVez(br, dev.url);
  await cenaCondicaoQueVence(br, dev.url);
  await cenaAvancoParaSozinho(br, dev.url);
  await cenaTetoForcado(br, dev.url);
} finally {
  await br.close();
  await dev.parar();
}
if (FALHAS.length) {
  console.error(`\n✗ Grid simultâneo: ${FALHAS.length} falha(s) em ${PASSOU + FALHAS.length}`);
  process.exit(1);
}
console.log(`\n✓ Grid simultâneo: ${PASSOU} asserções passaram`);

// O carimbo: quando este portao passou nesta maquina. Ver `carimbo.mjs`.
// Aqui embaixo porque o codigo so chega ate aqui quando nao houve falha: quem
// falha sai por `process.exit(1)` antes.
carimbar('test-grid-simultaneo');
