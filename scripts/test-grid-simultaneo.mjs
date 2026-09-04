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
//   3. o relógio anda UM Tick por clique, nunca pula, e a peça declarada ANDA
//      pelo mapa a cada avanço (movimento gradual, não teleporte);
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
  let posMudou = false;
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
    const agora = await rectDe(p, '#gr-tokens .gr-token[data-c="c002"]');
    if (agora && (Math.abs(agora.x - antes.x) > 2 || Math.abs(agora.y - antes.y) > 2)) posMudou = true;
  }
  const saltos = ticks.slice(1).map((t, i) => t - ticks[i]);
  ok(saltos.every((s) => s === 1),
    `o relógio anda um Tick por clique, nunca pula (${ticks.join(' → ')})`);
  ok(posMudou, 'a peça declarada ANDA pelo mapa a cada avanço: movimento gradual, não teleporte');
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

  await p.evaluate(() => { const d = document.getElementById('alvo-dlg'); if (d?.open) d.close(); });
  await espera(600);
  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
  await p.close();
}

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

  /**
   * Um HEXÁGONO LIVRE, escolhido pelos hexágonos de verdade (`.hx`).
   *
   * Não serve uma rede de pixels: o palco tem fundo em volta do tabuleiro, e
   * soltar ali não é soltar em casa nenhuma (o gesto morre em silêncio). E a
   * folga tem de ser generosa, porque o tabuleiro recusa quem pousa dentro do
   * círculo de outra peça, e uma criatura Enorme ocupa muito mais que a casa
   * dela.
   */
  const hexLivre = (ref, modo, faixa = [0, 1e9]) => p.evaluate(({ ref, modo, faixa }) => {
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
  const soltarEm = (cid, ponto) => p.evaluate(async ({ cid, ponto }) => {
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

  // ---- 4: três avanços, e o cartão do golpe anda para a frente ----
  const cartao = () => p.evaluate(() => {
    const it = document.querySelector('#gr-ar .ar-item[data-golpe]');
    return {
      tick: it ? parseInt(it.dataset.t, 10) : null,
      relogio: parseInt(document.getElementById('ini-tk')?.textContent || '0', 10),
      travado: !!document.getElementById('ini-prox')?.disabled,
    };
  });
  const antes = await cartao();
  let travouCedo = false;
  for (let i = 0; i < 3; i++) {
    const st = await cartao();
    if (st.travado) { travouCedo = true; break; }
    await p.click('#ini-prox');
    await espera(750);
  }
  const depois = await cartao();
  ok(depois.tick != null && antes.tick != null && depois.tick > antes.tick,
    `o Tick do golpe anda para a frente enquanto o alvo foge (${antes.tick} → ${depois.tick})`);
  ok(depois.tick > depois.relogio,
    `e o golpe nunca vence com o alvo longe (relógio ${depois.relogio}, golpe ${depois.tick})`);
  ok(!travouCedo, 'o "⏭" não trava a cena num golpe que não alcança nada');
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

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  await cena(br, dev.url);
  await cenaAlvoQueFoge(br, dev.url);
  await cenaFichaDoLance(br, dev.url);
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
