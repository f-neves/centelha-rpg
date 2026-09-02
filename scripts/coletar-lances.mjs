// coletar-lances.mjs · junta o oráculo do `resolverGolpe`.
//
// Abre a bancada com `?lances=1`, resolve algumas centenas de golpes de
// verdade, e grava cada um como uma linha de `.jsonl`. Cada linha traz as
// ENTRADAS do lance, os DADOS que caíram e as SAÍDAS que a mesa calculou.
//
// Para que serve: o `test-lance.mjs` roda o `resolverGolpe` puro contra este
// arquivo, lance a lance, e compara todos os campos. A lição do `lib-tempo.mjs`
// é que cinco divergências passaram nos testes unitários dos dois lados e
// nenhuma foi pega por teste; todas foram pegas por comparação contra o
// comportamento real. Este arquivo É esse comportamento real.
//
// Desligado por padrão dos dois lados: a página só acumula com `?lances=1`, e
// este script só roda quando alguém o chama. Ele não entra no `validate` nem no
// `build`, porque precisa do navegador.
//
//   node scripts/coletar-lances.mjs                     · grava a fixture padrão
//   node scripts/coletar-lances.mjs --saida outro.jsonl  · grava noutro lugar
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { subirDev } from './dev-server.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const arg = (n, padrao) => {
  const i = process.argv.indexOf(n);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : padrao;
};
const SAIDA = path.resolve(RAIZ, arg('--saida', 'scripts/fixtures/lances.jsonl'));
const SEMENTE = arg('--semente', '20260902');
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
if (!NAV) { console.log('· coletar-lances: PULADO (nenhum navegador; defina EDGE ou CHROME)'); process.exit(0); }

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0`
    + `&tempo=simultaneo&lances=1&semente=${SEMENTE}`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await p.waitForFunction(() => typeof (window).__ABRIR_FOLHA === 'function', { timeout: 15000 });

  const ids = await p.evaluate(() =>
    [...document.querySelectorAll('#gr-tokens .gr-token')].map((t) => t.dataset.c));
  console.log(`· ${ids.length} peças na cena, ${ids.length * (ids.length - 1)} pares possíveis`);

  // TRÊS PASSADAS pelos pares, e em cada uma o coletor aperta um botão
  // diferente: acertou, raspou, errou. As três saídas do Quase-Acerto têm
  // contas diferentes (o raspão ignora a Absorção, o erro não aplica dano), e
  // um oráculo que só tivesse acertos não conferiria duas delas.
  const BOTOES = ['#al-sim', '#al-qa', '#al-nao'];
  let n = 0;
  for (let passada = 0; passada < BOTOES.length; passada++) {
    for (const a of ids) {
      for (const b of ids) {
        if (a === b) continue;
        const ok = await p.evaluate(async ({ a, b, botao, passada }) => {
          const pr = (window).__ABRIR_FOLHA(a, b);
          await new Promise((r) => setTimeout(r, 0));
          const dlg = document.getElementById('alvo-dlg');
          if (!dlg?.open) return false;
          // Varia a manobra na segunda e na terceira passada, quando a arma
          // deixa: a penalidade por golpe muda o bolo, e com ela o total.
          const man = document.getElementById('al-manobra');
          if (passada > 0 && man) {
            const cabe = [...man.options].filter((o) => !o.disabled && !o.hidden);
            if (cabe.length > 1) { man.value = cabe[passada % cabe.length].value; man.dispatchEvent(new Event('change')); }
          }
          document.getElementById('al-rolar')?.click();
          document.getElementById('al-dn-rolar')?.click();
          document.querySelector(botao)?.click();
          await pr;
          return true;
        }, { a, b, botao: BOTOES[passada], passada });
        if (ok) n++;
      }
    }
    console.log(`  · passada ${passada + 1} (${BOTOES[passada]}): ${n} lances até aqui`);
  }

  const lances = await p.evaluate(() => (window).__LANCES || []);
  if (erros.length) console.log(`  ! ${erros.length} erro(s) de página: ${erros[0]}`);
  fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
  fs.writeFileSync(SAIDA, lances.map((l) => JSON.stringify(l)).join('\n') + '\n', 'utf8');
  const kb = (fs.statSync(SAIDA).size / 1024).toFixed(0);
  console.log(`\n✓ ${lances.length} lances gravados em ${path.relative(RAIZ, SAIDA)} (${kb} KB)`);
  const vered = {};
  for (const l of lances) vered[l.saida.veredito || 'sem'] = (vered[l.saida.veredito || 'sem'] || 0) + 1;
  console.log(`  vereditos: ${Object.entries(vered).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
} finally {
  await br.close();
  await dev.parar();
}
