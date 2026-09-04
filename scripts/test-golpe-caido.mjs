// test-golpe-caido.mjs · a regra do golpe no caído, pelo caminho do MESTRE.
//
// O QUE ELE GUARDA. A regra de 03/09 (`regras.json`,
// `combate.simultaneo.golpeNoCaido`), cuja fonte da verdade é o RETRATO DA
// ABERTURA do Tick: quem estava de pé quando o Tick abriu está de pé para todos
// os golpes daquele Tick. Duas linhas, simétricas:
//
//   caiu num Tick ANTERIOR · o atacante viu cair, o gesto não evapora, e ele
//     pode cancelar ou redirecionar para outro corpo ao alcance da arma;
//   caiu NESTE Tick · ninguém sabia, e o golpe resolve como foi declarado, no
//     corpo que estava de pé quando o gesto saiu.
//
// O QUE O RETRATO CONSERTA. Sem ele a regra lia a Vida do instante, e aí o
// resultado dependia de quem a mesa resolveu primeiro dentro do Tick: de duas
// peças que se derrubam no mesmo Tick, o atacante de quem caiu primeiro
// redirecionava e o outro não. Ordem de laço vazando para dentro de um sistema
// que se chama simultâneo.
//
// POR QUE ELE EXISTE. O lado do ROBÔ tem oráculo: o espelho de motor compara a
// mesa com o laço headless na cena de multidão, onde a peça automática
// redireciona sozinha. O lado do MESTRE não tinha nenhum, e ele é uma caixa de
// escolha nova que foi para produção junto com a regra. Caminho de tela sem
// clique de teste é caminho que ninguém sabe se abre.
//
// A CENA é montada como DADO, e não jogada: `?cena=caido` no Supabase de
// mentira põe três peças e uma agenda exata, porque o que se testa não é uma
// batalha, é o estado no instante em que o golpe vence.
//
//   a0 · quem golpeia, PC e NÃO automático, golpe agendado para o Tick 2
//   b0 · o alvo declarado, com Vida zero desde antes do Tick
//   b1 · o outro inimigo, de pé, ao alcance (ou longe, com `?longe=1`)
//
//   node scripts/test-golpe-caido.mjs
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { subirDev } from './dev-server.mjs';

const MESA = '00000000-0000-4000-8000-0000000000aa';
const SEMENTE = 20260903;

const NAVEGADORES = [
  process.env.EDGE, process.env.CHROME, process.env.PUPPETEER_EXECUTABLE_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].filter(Boolean);
const NAV = NAVEGADORES.find((p) => { try { return fs.existsSync(p); } catch { return false; } });
if (!NAV) {
  // PULAR É PERMITIDO NA MÁQUINA DE ALGUÉM, E NUNCA NO PORTÃO. Sem navegador
  // este teste não tem o que provar, e pintar de vermelho a máquina de quem só
  // não tem Edge instalado seria ruído. Mas um portão que passa PULANDO é pior
  // do que não ter portão: ele diz verde sem ter olhado. `SMOKE_EXIGE_NAVEGADOR`
  // é ligado no CI, e ali a falta de navegador é falha de configuração.
  const exige = process.env.SMOKE_EXIGE_NAVEGADOR === '1';
  console.log(`· Golpe no caído: ${exige ? "SEM NAVEGADOR" : "PULADO"} (nenhum navegador encontrado; defina EDGE ou CHROME)`);
  process.exit(exige ? 1 : 0);
}

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

/**
 * Abre a cena e, por padrão, avança UM Tick.
 *
 * O AVANÇO É O QUE CARIMBA O CAÍDO. `CAIDOS_AO_ABRIR` é preenchido na abertura
 * do Tick, e é ele que separa "caiu antes" de "caiu agora". Com `avanca: false`
 * o retrato fica vazio, que é exatamente o caso do corpo que cai DENTRO do Tick
 * do golpe: ninguém o viu cair, e o golpe desce como foi declarado.
 */
async function cena(br, url, { longe = false, avanca = true } = {}) {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=caido${longe ? '&longe=1' : ''}`
    + `&semente=${SEMENTE}&espelho=1&nevoa=0`, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => window.__ESPELHO, { timeout: 20000 });
  const t = avanca ? await p.evaluate(() => window.__ESPELHO.avancar()) : null;
  return { p, erros, t };
}

/** A caixa de escolha do `uiEscolher`, se ela abriu. */
const CAIXA = () => {
  const d = [...document.querySelectorAll('dialog.ui-dlg')].find((x) => x.open);
  if (!d) return null;
  return {
    titulo: d.querySelector('.ui-dlg-tit')?.textContent || '',
    msg: d.querySelector('.ui-dlg-msg')?.textContent || '',
    ops: [...d.querySelectorAll('.ui-dlg-op')].map((b) => ({
      v: b.dataset.v || '', txt: (b.textContent || '').trim(),
    })),
  };
};

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  // ---------------------------------------------------------------- 1 · a caixa
  console.log('\n· o alvo caiu ANTES do Tick, e há inimigo ao alcance');
  {
    const { p, erros, t } = await cena(br, dev.url);
    ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);
    ok(t === 2, `o relógio avançou para o Tick 2 (deu ${t})`);
    const devido = await p.evaluate(() => window.__ESPELHO.devido());
    ok(devido && devido.id === 'a0' && devido.tick === 2,
      `o golpe de a0 está vencido no Tick 2 (${JSON.stringify(devido)})`);

    await p.evaluate(() => window.__ESPELHO.abrir('a0', 2));
    const abriu = await p.waitForFunction(
      () => [...document.querySelectorAll('dialog.ui-dlg')].some((x) => x.open),
      { timeout: 5000 },
    ).then(() => true).catch(() => false);
    ok(abriu, 'a caixa de escolha do destino ABRIU (o mestre é quem escolhe)');

    const caixa = abriu ? await p.evaluate(CAIXA) : null;
    ok(!!caixa && /caiu/i.test(caixa.titulo), `o título diz que o alvo caiu: "${caixa?.titulo}"`);
    const vs = (caixa?.ops || []).map((o) => o.v);
    ok(vs.includes('b1'), `b1 está entre as opções (${JSON.stringify(vs)})`);
    ok(!vs.includes('b0'), 'o próprio caído NÃO é opção');
    // O CANCELAR só existe porque ele caiu num Tick anterior.
    ok(vs.includes(''), 'o "cancelar" é oferecido, porque deu para ver o corpo cair');
    ok(/anterior/i.test(caixa?.msg || ''), `a mensagem explica o caso: "${caixa?.msg}"`);

    // Redireciona para b1: a folha do golpe tem de abrir contra ele.
    await p.evaluate(() => {
      const d = [...document.querySelectorAll('dialog.ui-dlg')].find((x) => x.open);
      d.querySelector('.ui-dlg-op[data-v="b1"]').click();
    });
    const folha = await p.waitForFunction(
      () => document.getElementById('alvo-dlg')?.open === true, { timeout: 5000 },
    ).then(() => true).catch(() => false);
    ok(folha, 'a folha do golpe abriu depois da escolha');
    const tit = await p.evaluate(() => document.getElementById('al-titulo')?.textContent || '');
    ok(/b1/.test(tit), `a folha é contra b1, e não contra o caído: "${tit}"`);
    // Fecha a folha e confere que o golpe saiu da agenda de a0.
    await p.evaluate(() => {
      (document.querySelector('#al-sim.primary, #al-qa.primary, #al-nao.primary')
        || document.getElementById('al-nao'))?.click();
    });
    await p.evaluate(() => window.__ESPELHO.esperar());
    const depois = await p.evaluate(() => window.__ESPELHO.acaoDe('a0'));
    ok(!(depois?.acao?.aResolver || []).length, 'o golpe saiu da agenda de a0');
    await p.close();
  }

  // -------------------------------------------------------------- 2 · cancelar
  console.log('\n· o mestre cancela o golpe');
  {
    const { p } = await cena(br, dev.url);
    await p.evaluate(() => window.__ESPELHO.abrir('a0', 2));
    await p.waitForFunction(
      () => [...document.querySelectorAll('dialog.ui-dlg')].some((x) => x.open), { timeout: 5000 },
    ).catch(() => {});
    await p.evaluate(() => {
      const d = [...document.querySelectorAll('dialog.ui-dlg')].find((x) => x.open);
      d.querySelector('.ui-dlg-op[data-v=""]').click();
    });
    await p.evaluate(() => window.__ESPELHO.esperar());
    const folha = await p.evaluate(() => document.getElementById('alvo-dlg')?.open === true);
    ok(!folha, 'cancelar NÃO abre folha nenhuma');
    const depois = await p.evaluate(() => window.__ESPELHO.acaoDe('a0'));
    ok(!(depois?.acao?.aResolver || []).length, 'e o golpe sai da agenda mesmo assim');
    await p.close();
  }

  // ------------------------------------------------- 3 · sem ninguém ao alcance
  console.log('\n· o alvo caiu e não há mais ninguém ao alcance');
  {
    const { p } = await cena(br, dev.url, { longe: true });
    await p.evaluate(() => window.__ESPELHO.abrir('a0', 2));
    // NÃO DEVE ABRIR CAIXA: uma caixa com uma opção só é uma caixa a menos que
    // a mesa precisa, e a regra diz que aí o gesto simplesmente se perde.
    const abriu = await p.waitForFunction(
      () => [...document.querySelectorAll('dialog.ui-dlg')].some((x) => x.open), { timeout: 2500 },
    ).then(() => true).catch(() => false);
    ok(!abriu, 'nenhuma caixa abre: sem destino, não há o que perguntar');
    await p.evaluate(() => window.__ESPELHO.esperar());
    const depois = await p.evaluate(() => window.__ESPELHO.acaoDe('a0'));
    ok(!(depois?.acao?.aResolver || []).length, 'o gesto se perdeu e o golpe saiu da agenda');
    const log = await p.evaluate(() =>
      [...document.querySelectorAll('#gr-log *')].map((e) => e.textContent || '').join(' | '));
    ok(/se perdeu|no ch[ãa]o/i.test(log), 'o registro diz o que aconteceu com o gesto');
    await p.close();
  }

  // ------------------------------------------- 4 · o alvo caiu NESTE mesmo Tick
  //
  // A CENA É A MESMA, e a única diferença é que o Tick não abriu: sem avanço, o
  // retrato está vazio, e b0 está no chão sem que ninguém tenha visto cair. É
  // assim que a mesa enxerga o corpo que desaba DENTRO do Tick do golpe.
  //
  // Este é o caso que o conserto de 03/09 criou. Antes dele a mesa olhava a Vida
  // do instante e abria caixa aqui também, e aí quem redirecionava e quem não
  // dependia de qual peça o laço processou primeiro.
  console.log('\n· o alvo caiu NESTE Tick (o retrato da abertura está vazio)');
  {
    const { p, erros } = await cena(br, dev.url, { avanca: false });
    ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);
    await p.evaluate(() => window.__ESPELHO.abrir('a0', 2));
    const caixa = await p.waitForFunction(
      () => [...document.querySelectorAll('dialog.ui-dlg')].some((x) => x.open), { timeout: 2500 },
    ).then(() => true).catch(() => false);
    ok(!caixa, 'nenhuma caixa de destino abre: ninguém sabia que ele ia cair');
    const folha = await p.waitForFunction(
      () => document.getElementById('alvo-dlg')?.open === true, { timeout: 5000 },
    ).then(() => true).catch(() => false);
    ok(folha, 'a folha do golpe abre direto, como o golpe foi declarado');
    const tit = await p.evaluate(() => document.getElementById('al-titulo')?.textContent || '');
    ok(/b0/.test(tit), `a folha é contra o alvo declarado, e não contra b1: "${tit}"`);
    await p.evaluate(() => {
      (document.querySelector('#al-sim.primary, #al-qa.primary, #al-nao.primary')
        || document.getElementById('al-nao'))?.click();
    });
    await p.evaluate(() => window.__ESPELHO.esperar());
    const depois = await p.evaluate(() => window.__ESPELHO.acaoDe('a0'));
    ok(!(depois?.acao?.aResolver || []).length, 'o golpe saiu da agenda de a0');
    await p.close();
  }
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ golpe no caído: ${falhas.length} falha(s)`
  : '\n✓ Golpe no caído OK · a caixa do mestre abre, redireciona, cancela, e cala quando não há destino');
process.exit(falhas.length ? 1 : 0);
