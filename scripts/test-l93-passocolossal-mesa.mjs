// test-l93-passocolossal-mesa.mjs · a gravação recusa, e o registro não mente.
//
// Pendencias.md L93 (rodada 53): o passo automático do Tick
// (`avancarTickSimultaneo`, `grid.astro`) tinha os mesmos três problemas do
// achado do L88, na mesma passagem: (1) a posição otimista entrava em
// `TOKENS` sem marcar `POSICAO_PENDENTE`; (2) o `await gravarToken` não
// guardava o `error`, então uma recusa deixava o cache local com a posição
// ILEGAL para sempre; (3) o registro narrava "avança"/"atravessa"
// incondicionalmente, mesmo quando a gravação recusou.
//
// A RAIZ: o traçado usa `casaExata`, uma conta de ocupação copiada à mão
// (só compara hexágono exato, sem raio, sem `podeDividir`) que serve o caso
// "cercado não é preso" (test-l67-corpoacorpo-mesa.mjs prova que ela não
// pode sumir). Contra um Colossal (raio 8 m), `casaExata` só veta a casa
// exata dele, então "acha" livre um destino que `ocupadoPor` (a régua de
// verdade, dentro de `gravarToken`) ainda recusa. É aí que os três se
// encontram: o traçado PERMITE o que a gravação RECUSA.
//
// A CENA `?cena=passocolossal` (`mesa-mock.mjs`): `md` (Médio) nasce colado
// num Colossal (`mon-tarrasque`) e declara um deslocamento puro de 1
// hexágono. O passo estrito (`ocupadoPor`) não avança nada (tudo ao redor
// está no raio do Colossal), cai na segunda passada (`casaExata`), que acha
// um destino ainda dentro do raio de verdade, e `gravarToken` recusa.
//
//   node scripts/test-l93-passocolossal-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('L93 · passo cercado por um Colossal, na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

/** As linhas cruas do registro. */
const linhasDoLog = (p) => p.evaluate(() => (window.__SB?.tabelas?.mesa_arenas?.[0]?.log || []).map((l) => l.txt));

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=passocolossal&espelho=1&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => window.__ESPELHO, { timeout: 20000 });
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  const posAntes = await p.evaluate(() => window.__ESPELHO.posDe('md'));
  ok(!!posAntes, `md nasce no tabuleiro (${JSON.stringify(posAntes)})`);

  // Três Ticks: a mesma tentativa recusada não deve corromper nada nem
  // parar de tentar (o conflito geométrico não se resolve sozinho).
  for (let i = 0; i < 3; i++) {
    // eslint-disable-next-line no-await-in-loop
    await p.evaluate(() => window.__ESPELHO.avancar());
  }

  const posDepois = await p.evaluate(() => window.__ESPELHO.posDe('md'));
  ok(JSON.stringify(posDepois) === JSON.stringify(posAntes),
    `md NÃO se move: a gravação recusou e o cache foi desfeito, não corrompido (${JSON.stringify(posAntes)} → ${JSON.stringify(posDepois)})`);

  const log = await linhasDoLog(p);
  const linhaFalsa = log.find((t) => /(avança|atravessa)/.test(t) && /md/i.test(t));
  ok(!linhaFalsa, `nenhuma linha de "avança"/"atravessa" para md: o registro não afirma um movimento que não aconteceu (${JSON.stringify(linhaFalsa || null)})`);

  ok(erros.length === 0, `nenhum erro de página, mesmo com a escrita recusada repetidas vezes (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ L93 · passo cercado, na mesa: ${falhas.length} falha(s)`
  : '\n✓ L93 · passo cercado OK · a gravação recusa a casa que o traçado achou, e o cache/registro não mentem sobre isso');
if (!falhas.length) carimbar('test-l93-passocolossal-mesa');
process.exit(falhas.length ? 1 : 0);
