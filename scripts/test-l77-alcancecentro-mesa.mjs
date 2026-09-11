// test-l77-alcancecentro-mesa.mjs · o raio do PRÓPRIO ATACANTE, na mesa.
//
// Pendencias.md L77 (decidido em 11/09/2026): o L67 só somava o raio do
// ALVO ao alcance corpo a corpo; o raio do próprio ATACANTE nunca entrava,
// então um Enorme atacando não alcançava mais longe por ser Enorme. A regra
// (`alcanceDoCentro = raio + braço`, `braço = max(0, raio - 0,5)`) e a
// invariante ("Médio contra Médio não muda") estão provadas no nível puro em
// `test-combate-tempo.mjs` (`src/lib/alcance.ts`); este arquivo prova a
// FIAÇÃO no tabuleiro de verdade, na cena `?cena=corpoacorpo`
// (`mesa-mock.mjs`), lendo `window.__ESPELHO` e a folha do golpe, nunca
// recalculando por dentro a conta que o próprio código decide (o cuidado do
// L74), o mesmo risco de "conta copiada à mão" que escapou em dois lugares
// na rodada 40 (L67) e que a rodada 43 pediu para varrer por constante crua,
// não por nome de função.
//
//   node scripts/test-l77-alcancecentro-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const NAV = navegadorOuSair('L77 · o raio do atacante, na mesa');

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

  const en = await p.evaluate(() => window.__ESPELHO.posDe('en'));
  const md = await p.evaluate(() => window.__ESPELHO.posDe('md'));
  const dist = en && md ? await p.evaluate((a, b) => window.__ESPELHO.distHex(a, b), en, md) : null;
  ok(dist === 5, `en (Aboleth) e md (Médio) estão a 5 hexágonos, como a cena declara (achou ${dist})`);

  // O golpe de `en` contra `md` já está agendado (`aResolver: [2]`): abrir a
  // folha lê os mesmos dois lugares que o L67 (rodada 40) achou incompletos,
  // `valoresDoLance` ("Alcance da arma") e `avisoAlcance` (o texto da
  // recusa), agora do lado do ATACANTE.
  await p.evaluate(() => window.__ESPELHO.abrir('en', 2));
  const abriuFolha = await p.waitForFunction(
    () => document.getElementById('alvo-dlg')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  ok(abriuFolha, 'a folha abre para en, com o golpe agendado contra md');
  if (abriuFolha) {
    const alc = await p.evaluate(() =>
      document.querySelector('#al-ficha-c .al-f.lido[data-l="alc"] .al-f-v')?.textContent || '');
    // 4 = HEX_CORPO_A_CORPO(1) + alcanceCentroExtraHex(en, Enorme)(3) +
    // raioExtraHex(md, Médio)(0). SEM o L77 este número seria "1 hex", porque
    // nada no braço do Aboleth entrava na conta.
    ok(alc.trim() === '4 hex',
      `"Alcance da arma" já soma o raio do PRÓPRIO Aboleth: mostra "4 hex", não "1 hex" ("${alc}")`);
    const aviso = await p.evaluate(() => document.getElementById('al-aviso')?.textContent || '');
    ok(/alcança 4 hexágono/.test(aviso),
      `e o aviso de fora-de-alcance também diz "alcança 4", não "alcança 1" ("${aviso}")`);
    ok(/Corpo a corpo a 5 m/.test(aviso),
      `e continua recusando a 5 m: o termo novo SOMA e tem teto, não vira alcance infinito ("${aviso}")`);
    await p.evaluate(() => { document.getElementById('al-nao')?.click(); });
    await p.evaluate(() => window.__ESPELHO.esperar());
  }

  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ L77 · o raio do atacante, na mesa: ${falhas.length} falha(s)`
  : '\n✓ L77 · o raio do atacante, na mesa OK · o Aboleth atacando alcança pelo próprio'
    + ' porte, e o número novo (4, não 1) aparece nos dois lugares que o mostram');
if (!falhas.length) carimbar('test-l77-alcancecentro-mesa');
process.exit(falhas.length ? 1 : 0);
