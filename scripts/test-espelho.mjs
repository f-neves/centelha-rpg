// test-espelho.mjs · O ESPELHO DE MOTOR.
//
// O QUE ELE GUARDA, e é a única coisa que ele guarda: que o laço do Tick do
// harness (`scripts/sim/motor.mjs`) faz as MESMAS operações, na MESMA ordem,
// que o laço da mesa (`avancarTickSimultaneo`, em `src/pages/mesa/grid.astro`).
//
// POR QUE ELE EXISTE. A decisão Q6 foi copiar o laço e compartilhar a conta. A
// conta já tem oráculo (`test-lance.mjs`, contra golpes de verdade gravados da
// mesa); o LAÇO não tinha nenhum. E laço sem oráculo não falha em vermelho:
// falha produzindo um número plausível. Duas vezes seguidas um número de
// aparência sólida saiu errado desta bateria (arquétipos inventados dando um
// 1v1 de 568 Ticks; uma coluna de "Tick vazio" que media outra coisa e inverteu
// uma conclusão inteira). Enquanto este teste não passar, nenhum número da
// bateria vale como afirmação sobre o Grid.
//
// COMO ELE FUNCIONA. A mesma célula dos dois lados, com a MESMA semente:
//
//   · a mesa roda em `/mesa/grid` com o Supabase de mentira montando a cena da
//     célula (`?cena=espelho`), o dado semeado (`?semente=`), o retrato por
//     Tick ligado (`?despejo=1`) e o registro de lances (`?lances=1`);
//   · o harness roda a mesma célula por `scripts/sim/espelho.mjs`;
//   · a comparação é a da `03-respostas.md` §1.1.1: agenda, tempo, posição,
//     re-projeção, resolução e fila, Tick a Tick, sem tolerância.
//
// O DRIVER NÃO DECIDE NADA. Ele clica no botão que a régua já marcou como
// principal (`.primary`, posto por `pintarVeredito`) e avança o relógio. Se ele
// escolhesse o veredito, o teste compararia o harness com o driver.
//
// O QUE ELE NÃO PROVA, escrito aqui para ninguém citar de menos:
//   · o filtro de elegibilidade do robô. A mesa só roda sozinha as criaturas, e
//     o espelho estende isso a qualquer peça em modo automático (`?espelho=1`),
//     porque sem os dois lados declarando não há colisão de agenda para
//     comparar. A decisão e a declaração continuam sendo as da mesa;
//   · o fim da cena. O harness tem três motivos de fim (D4) e a mesa não tem
//     nenhum: lá quem decide que acabou é o mestre;
//   · a mão do mestre. Modificador escrito, Defesa corrigida na ficha do lance,
//     abortar, botão contrariando a régua: nada disso entra.
//
//   node scripts/test-espelho.mjs             · as três cenas
//   node scripts/test-espelho.mjs --ver       · imprime os dois retratos do
//                                               primeiro Tick que divergir
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { subirDev } from './dev-server.mjs';
import { carregarLib, ligar } from './sim/lib-ponte.mjs';
import { rodarEspelho, celulaEspelho } from './sim/espelho.mjs';

const VER = process.argv.includes('--ver');
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
  console.log('· Espelho de motor: PULADO (nenhum navegador; defina EDGE ou CHROME)');
  process.exit(0);
}

/**
 * AS TRÊS CENAS, e cada uma existe por um caminho de código.
 *
 * `1v1` é o laço mínimo: agenda, escada, resolução. `3x3` acrescenta a FILA
 * (quem declara antes, quem resolve antes) e a ocupação do tabuleiro. `caçada`
 * acrescenta a viagem e a re-projeção, que é onde a ordem das operações mais
 * pode divergir: lá o passo e a agenda se corrigem um ao outro a cada Tick.
 */
const CENAS = [
  { ...celulaEspelho('1v1-encostado', ['escudeiro', 'montanteiro'], 1, 1), teto: 40 },
  { ...celulaEspelho('3x3-encostado', ['escudeiro', 'montanteiro'], 3, 1), teto: 30 },
  { ...celulaEspelho('1v1-cacada', ['escudeiro', 'montanteiro'], 1, 18), teto: 40 },
  // O UNÍSSONO: dois ciclos iguais, que é o caso em que os golpes CAEM NO MESMO
  // TICK. É a única cena em que a ordem de resolução dentro do Tick tem
  // consequência, e portanto a única em que copiar a fila errado apareceria.
  { ...celulaEspelho('1v1-unissono', ['escudeiro', 'escudeiro'], 1, 1), teto: 40 },
  // A PERSEGUIÇÃO LONGA com duas peças por lado: viagem, re-projeção repetida e
  // o re-carimbo da fila a cada passo, tudo ao mesmo tempo.
  { ...celulaEspelho('2x2-longa', ['escudeiro', 'montanteiro'], 2, 42), teto: 30 },
];

/**
 * DUAS SEMENTES, e não uma. Uma semente só prova que os dois lados concordam
 * naquela sequência de dados; a segunda é o que separa "concordam" de
 * "concordam por sorte" quando um caminho de código só abre com certo veredito.
 */
const SEMENTES = [SEMENTE, 771107];

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

/** Dirige a mesa por uma cena inteira e devolve os dois despejos dela. */
async function daMesa(br, url, cena, semente) {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  const qs = `id=${MESA}&tempo=simultaneo&cena=espelho`
    + `&arqa=${cena.arq[0]}&arqb=${cena.arq[1]}&n=${cena.n}&dist=${cena.dist}`
    + `&semente=${semente}&despejo=1&lances=1&espelho=1&nevoa=0`;
  await p.goto(`${url}/mesa/grid?${qs}`, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => typeof window.__ESPELHO === 'object' && window.__ESPELHO,
    { timeout: 20000 });

  let tick = 0;
  let voltas = 0;
  while (tick < cena.teto && voltas++ < cena.teto * 12) {
    const d = await p.evaluate(() => window.__ESPELHO.devido());
    if (d) {
      // UM GOLPE VENCIDO: a folha abre, a régua marca o botão, o driver aperta
      // o que ela marcou. `resolverGolpeNoAr` pode não abrir caixa nenhuma
      // (alvo que já saiu de cena), e por isso a espera é uma corrida e não uma
      // asserção: quem não abriu já resolveu.
      await p.evaluate((x) => window.__ESPELHO.abrir(x.id, x.tick), d);
      const abriu = await p.waitForFunction(
        () => document.getElementById('alvo-dlg')?.open === true, { timeout: 4000 },
      ).then(() => true).catch(() => false);
      if (abriu) {
        await p.evaluate(() => {
          const b = document.querySelector('#al-sim.primary, #al-qa.primary, #al-nao.primary')
            || document.getElementById('al-nao');
          b?.click();
        });
      }
      await p.evaluate(() => window.__ESPELHO.esperar());
    } else {
      tick = await p.evaluate(() => window.__ESPELHO.avancar());
    }
  }
  // O ÚLTIMO TICK TAMBÉM RESOLVE. O laço resolve os golpes vencidos dentro do
  // Tick em que estão; o driver saía assim que o relógio chegava ao teto e
  // deixava os do teto por resolver. A contagem de lances saía menor de um lado
  // sem que nada tivesse divergido, e o comparador, que só olhava os pares,
  // dizia que estava tudo bem.
  for (let i = 0; i < 40; i++) {
    const d = await p.evaluate(() => window.__ESPELHO.devido());
    if (!d) break;
    await p.evaluate((x) => window.__ESPELHO.abrir(x.id, x.tick), d);
    const abriu = await p.waitForFunction(
      () => document.getElementById('alvo-dlg')?.open === true, { timeout: 4000 },
    ).then(() => true).catch(() => false);
    if (abriu) {
      await p.evaluate(() => {
        const b = document.querySelector('#al-sim.primary, #al-qa.primary, #al-nao.primary')
          || document.getElementById('al-nao');
        b?.click();
      });
    }
    await p.evaluate(() => window.__ESPELHO.esperar());
  }
  const out = await p.evaluate(() => ({
    despejo: window.__DESPEJO, lances: window.__LANCES || [],
  }));
  await p.close();
  return { ...out, erros };
}

// ------------------------------------------------------ a comparação
const chaves = (o, pre = '') => Object.entries(o || {}).flatMap(([k, v]) => (
  v && typeof v === 'object' && !Array.isArray(v)
    ? chaves(v, `${pre}${k}.`)
    : [[`${pre}${k}`, Array.isArray(v) ? v.join(',') : v]]
));

/** Os campos de uma peça que o espelho compara, no Tick. É a tabela da §1.1.1. */
const DA_PECA = (p) => ({
  q: p.q, r: p.r, chao: !!p.chao, pv: p.pv, tick: p.tick,
  fase: p.fase, defesaPerdida: p.defesaPerdida,
  'acao.tipo': p.acao?.tipo ?? null,
  'acao.desde': p.acao?.desde ?? null,
  'acao.livre': p.acao?.livre ?? null,
  'acao.golpes': (p.acao?.golpes || []).join(','),
  'acao.pressao': p.acao?.pressao ?? null,
  'acao.mov': p.acao?.mov ? (p.acao.mov.alvo ?? 'destino') : null,
});

/** Os campos de um lance. `entrada` é o que a régua leu; `saida` é o que ela deu. */
const DO_LANCE = (l, daMesaLado) => ({
  de: daMesaLado ? l.entrada.atacante.id : l.entrada.atacante.id,
  para: l.entrada.alvo.id,
  golpeIndice: l.entrada.golpeIndice,
  'alvo.ferimento': l.entrada.alvo.ferimento,
  'alvo.defesaPerdida': l.entrada.alvo.defesaPerdida,
  'alvo.soak': l.entrada.alvo.soak,
  'atacante.ajusteFlat': l.entrada.atacante.ajusteFlat,
  'atacante.penDados': (l.entrada.atacante.penDados || []).join(','),
  margemQA: l.entrada.margemQA,
  danoQA: l.entrada.danoQA,
  defesa: l.saida.defesa,
  total: l.saida.total,
  errouPor: l.saida.errouPor,
  veredito: l.saida.veredito,
  danoBruto: l.saida.danoBruto,
  absorcao: l.saida.absorcao,
  danoLiquido: l.saida.danoLiquido,
  // OS DADOS QUE CAÍRAM, e não os que a saída guardou: os dois lados rolam
  // acerto e dano na abertura, mesmo quando o golpe erra.
  'dados.acerto': (daMesaLado ? l.sorteio.acerto : l.rolados.acerto).join(','),
  'dados.dano': (daMesaLado ? l.sorteio.dano : l.rolados.dano).join(','),
});

function comparar(cena, mesa, laco) {
  const divs = [];
  const tm = mesa.despejo?.ticks || [];
  const tl = laco.ticks;
  if (mesa.despejo?.descartados) {
    divs.push({ o: 'despejo', txt: `a mesa descartou ${mesa.despejo.descartados} Ticks do começo` });
  }
  // CONTAGEM DIFERENTE É DIVERGÊNCIA, e não um detalhe da leitura: comparar só
  // os pares deixava passar um lado que resolveu golpes a mais.
  if (tm.length !== tl.length) {
    divs.push({ o: 'ticks', txt: `Ticks despejados: mesa ${tm.length} · laço ${tl.length}` });
  }
  const n = Math.min(tm.length, tl.length);
  for (let i = 0; i < n; i++) {
    const a = tm[i], b = tl[i];
    if (a.t !== b.t) { divs.push({ t: a.t, campo: 'numero do Tick', mesa: a.t, laco: b.t }); break; }
    if (a.fila.join(',') !== b.fila.join(',')) {
      // A FILA divergindo quase nunca é a fila: é um dos critérios dela. O
      // texto traz os dois primeiros (`tick` e o carimbo de chegada) já
      // ordenados, senão a mensagem diz que divergiu e não diz por quê.
      const porq = a.pecas.map((p) => `${p.id}(t${p.tick},${String(p.chegada || '').slice(11, 23)})`).join(' ');
      divs.push({ t: a.t, campo: 'fila', mesa: a.fila.join(','), laco: b.fila.join(','), porq });
    }
    const porId = new Map(b.pecas.map((p) => [p.id, p]));
    for (const pm of a.pecas) {
      const pl = porId.get(pm.id);
      if (!pl) { divs.push({ t: a.t, campo: `peça ${pm.id}`, mesa: 'existe', laco: 'ausente' }); continue; }
      const ca = DA_PECA(pm), cb = DA_PECA(pl);
      for (const k of Object.keys(ca)) {
        if (String(ca[k]) !== String(cb[k])) {
          divs.push({ t: a.t, peca: pm.id, campo: k, mesa: ca[k], laco: cb[k] });
        }
      }
    }
    if (divs.length > 40) break;
  }
  // OS LANCES, na ordem em que caíram. Comparar por índice é o certo: se a
  // ordem de resolução divergir, a divergência aparece aqui e não some numa
  // busca por `aid`.
  const lm = mesa.lances, ll = laco.lances;
  if (lm.length !== ll.length) {
    divs.push({ o: 'lances', txt: `lances resolvidos: mesa ${lm.length} · laço ${ll.length}` });
  }
  const nl = Math.min(lm.length, ll.length);
  for (let i = 0; i < nl; i++) {
    const ca = DO_LANCE(lm[i], true), cb = DO_LANCE(ll[i], false);
    for (const k of Object.keys(ca)) {
      if (String(ca[k]) !== String(cb[k])) {
        divs.push({ lance: i, campo: k, mesa: ca[k], laco: cb[k] });
      }
    }
    if (divs.length > 60) break;
  }
  return {
    divs,
    ticksMesa: tm.length, ticksLaco: tl.length,
    lancesMesa: lm.length, lancesLaco: ll.length,
  };
}

// ------------------------------------------------------------ a corrida
const L = await carregarLib();
ligar(L);
const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  for (const cena of CENAS) {
   for (const sem of SEMENTES) {
    console.log(`\n· ${cena.id} (${cena.n}v${cena.n}, ${cena.dist} hex, teto ${cena.teto}) · semente ${sem}`);
    const mesa = await daMesa(br, dev.url, cena, sem);
    ok(!mesa.erros.length, `a mesa rodou sem erro de página${mesa.erros.length ? `: ${mesa.erros[0]}` : ''}`);
    const laco = rodarEspelho(L, cena, sem, cena.teto);
    const r = comparar(cena, mesa, laco);
    console.log(`    mesa: ${r.ticksMesa} Ticks, ${r.lancesMesa} lances`
      + ` · laço: ${r.ticksLaco} Ticks, ${r.lancesLaco} lances (${laco.res.fim})`);
    ok(r.ticksMesa > 0, 'a mesa despejou algum Tick');
    ok(r.lancesMesa > 0, 'a mesa resolveu algum golpe');
    ok(r.divs.length === 0, `sem divergência em ${cena.id} · semente ${sem}`);
    for (const d of r.divs.slice(0, VER ? 40 : 12)) {
      console.log('      ✗ ' + (d.txt || (d.lance != null
        ? `lance ${d.lance} · ${d.campo}: mesa ${d.mesa} · laço ${d.laco}`
        : `Tick ${d.t}${d.peca ? ` · ${d.peca}` : ''} · ${d.campo}: mesa ${d.mesa} · laço ${d.laco}`
          + (d.porq ? `
           mesa: ${d.porq}` : ''))));
    }
    if (r.divs.length > 12 && !VER) console.log(`      … e mais ${r.divs.length - 12}`);
    if (VER && r.divs.length) {
      // OS DOIS DIÁRIOS LADO A LADO. Uma divergência de Vida quase nunca é da
      // Vida: é de quem bateu em quem, e em que ordem.
      console.log('      -- lances, mesa | laço --');
      const n = Math.max(r.lancesMesa, r.lancesLaco);
      for (let i = 0; i < n; i++) {
        const a = mesa.lances[i], b = laco.lances[i];
        const f = (x, m) => (x ? `${m ? x.entrada.tickDoGolpe : x.t}:${x.entrada.atacante.id}>${x.entrada.alvo.id}`
          + ` ${x.saida.veredito} d${x.saida.danoLiquido} pv${x.saida.pvAntes}->${x.saida.pvDepois}` : '—');
        console.log(`      ${String(i).padStart(2)} ${f(a, true).padEnd(42)} | ${f(b, false)}`);
      }
    }
   }
  }
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length ? `\n✘ espelho de motor: ${falhas.length} falha(s)` : '\n✓ espelho de motor: os dois laços concordam');
process.exit(falhas.length ? 1 : 0);
