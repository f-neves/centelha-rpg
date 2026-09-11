// test-l67-corpoacorpo-mesa.mjs · o corpo a corpo de borda, medido no tabuleiro.
//
// Pendencias.md L67 (decidido em 10/09/2026): o alcance corpo a corpo passa a
// somar o raio do alvo (borda a borda, não centro a centro), e o critério de
// aceitação é uma PROIBIÇÃO: não remover a segunda passada de `caminharHex`
// que afrouxa o veto, porque ela serve outro caso (o Enorme parado ao lado
// prendendo os seis vizinhos de quem encosta nele). Quem implementa prova as
// duas, não uma — e é isso que este arquivo faz, na cena `?cena=corpoacorpo`
// (`mesa-mock.mjs`), lendo só `window.__ESPELHO.posDe`, a posição CRUA da
// peça no tabuleiro depois de rodar o motor de verdade (`avancarTickSimultaneo`
// por `E.avancar()`) — nunca recalculando por dentro a condição que o próprio
// código decide (o cuidado do L74).
//
//   node scripts/test-l67-corpoacorpo-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('L67 · corpo a corpo de borda, na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=corpoacorpo`
    + `&espelho=1&nevoa=0`, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => window.__ESPELHO, { timeout: 20000 });
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  const enorme = await p.evaluate(() => window.__ESPELHO.posDe('en'));
  ok(!!enorme, `o Aboleth está no tabuleiro (${JSON.stringify(enorme)})`);

  // Dez Ticks bastam de sobra: a conta à mão (docs/simulacao/caixa/
  // progresso-l71-l67.md) prevê os dois resolvidos no primeiro Tick, contra os
  // 12 hexágonos de passo por Tick que a cena dá aos dois.
  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    await p.evaluate(() => window.__ESPELHO.avancar());
  }
  const posAt = await p.evaluate(() => window.__ESPELHO.posDe('at'));
  const posVz = await p.evaluate(() => window.__ESPELHO.posDe('vz'));
  const dAt = posAt && enorme
    ? await p.evaluate((a, b) => window.__ESPELHO.distHex(a, b), posAt, enorme)
    : null;

  console.log(`\n· at (perseguição contra o Aboleth): pos ${JSON.stringify(posAt)}, distância ${dAt}`);
  // Distância 3, e não 2: 1 (braço) + 2 (o raio do Aboleth arredondado PARA
  // CIMA, `grid.astro`, `raioExtraHex`) — em 2 os círculos ainda se cruzam
  // (2 m de centro a centro contra 2,5 m de raios somados), achado ao vivo
  // nesta própria rodada, com a agenda prometendo um Tick que a caminhada não
  // cumpria.
  ok(dAt === 3,
    `a perseguição para na BORDA do Aboleth, sem sobrepor os círculos (distância 3), não dentro do corpo dele (distância ${dAt})`);

  console.log(`\n· vz (deslocamento puro, nascido vizinho do Aboleth): pos ${JSON.stringify(posVz)}`);
  ok(!!posVz && posVz.q === 9 && posVz.r === 4,
    `vz NÃO fica preso ao lado do Aboleth: chega ao destino declarado, q:9,r:4 (${JSON.stringify(posVz)})`);
  ok(!(posVz?.q === 5 && posVz?.r === 4),
    'e, em particular, não fica parado na casa de nascença (a segunda passada de caminharHex segue viva)');

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ L67 · corpo a corpo na mesa: ${falhas.length} falha(s)`
  : '\n✓ L67 · corpo a corpo na mesa OK · a perseguição para na borda de um alvo Enorme,'
    + ' e o Enorme parado ao lado continua sem prender quem só passa perto');
if (!falhas.length) carimbar('test-l67-corpoacorpo-mesa');
process.exit(falhas.length ? 1 : 0);
