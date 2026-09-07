// test-bandeiras-mesa.mjs · porte e gate, medidos na Vida, e não só no log.
//
// O QUE ISTO GUARDA. As duas bandeiras ligadas em 06/09/2026 (`porte`, `gate`)
// tinham prova da MATEMÁTICA pura (`modificadorPorte`/`gatePerfuracaoAbre`,
// `test-bandeiras.mjs`), e zero prova de que a fiação dentro de `folhaDaAcao`
// (`grid.astro`) está certa: nenhum teste automatizado deste repositório
// criava um combatente `tipo: 'criatura'`, e é dele que o porte lê
// (`MON[monstro_id].porte`). Este é o primeiro.
//
// A METADE QUE MAIS IMPORTA (achada na rodada anterior): o gate tem DOIS
// lugares que decidem dano dentro de `folhaDaAcao` — `contaDoLance` (o
// oráculo/tela) e `fim()` (o que `aplicarDano` de fato usa para descer a
// Vida). Um teste que só olhasse o registro (`al-pool`, o log) provaria a
// metade errada. Por isso a asserção do gate lê `window.__ESPELHO.pvDe`, que
// é a Vida crua da peça, e não o texto da tela.
//
// A CENA (`mesa-mock.mjs`, `?cena=bandeiras`): um PC com Adaga (Perfuração 0,
// modo principal) contra três criaturas REAIS do bestiário, cada uma com o
// golpe já agendado pro Tick 2 (como a cena `caido` já faz):
//
//   a0 → b0 · mon-aguia-gigante, Grande,  resistPerf 0 · porte BÔNUS (+3) · gate ABRE
//   a1 → b1 · mon-dog,           Pequeno, resistPerf 0 · porte PENALIDADE (−3)
//   a2 → b2 · guarda-da-cidade,  Médio,   resistPerf 1, Absorção Perf. só 2 ·
//            gate RESVALA (Perf. 0 < 1) — NÃO usa mon-aboleth (Absorção 13):
//            contra ele a Vida também não desceria com o gate desligado, e o
//            teste provaria a Absorção, não o gate (achado no ensaio desta
//            rodada, ver o comentário da cena em mesa-mock.mjs)
//
//   node scripts/test-bandeiras-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';
import { carimbar } from './carimbo.mjs';

const MESA = MESA_BANCADA;
const SEMENTE = 20260906;
const NAV = navegadorOuSair('Bandeiras (porte/gate) na mesa');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

/**
 * Abre a folha de um golpe já agendado, rola os dois dados (acerto e dano) e
 * lê o que a tela mostra ANTES de fechar. Não clica em nada ainda: quem chama
 * decide sim/qa/não, porque é essa escolha que o teste do gate precisa
 * controlar (o gate zera o dano mesmo quando o mestre confirma acerto).
 */
async function abrirEFolhear(p, id, tick) {
  const abriu = await p.evaluate((i, t) => window.__ESPELHO.abrir(i, t), id, tick);
  if (!abriu) return null;
  const achou = await p.waitForFunction(
    () => document.getElementById('alvo-dlg')?.open === true, { timeout: 5000 },
  ).then(() => true).catch(() => false);
  if (!achou) return null;
  const titulo = await p.evaluate(() => document.getElementById('al-titulo')?.textContent || '');
  // O POOL, ANTES DE ROLAR: é aqui que `pintarPoolAcerto` mostra o modificador
  // de porte ISOLADO (`sinalTxt(ajAtq.flat)`, um token só). Depois de rolar o
  // texto vira a descrição das faces ("[2,2,3] +10 = 17"), com o porte já
  // somado dentro de um total — prova o mesmo fato, mas não dá para ler o
  // sinal sozinho nele.
  const pool = await p.evaluate(() => document.getElementById('al-pool')?.textContent || '');
  await p.evaluate(() => {
    document.getElementById('al-rolar')?.click();
    document.getElementById('al-dn-rolar')?.click();
  });
  return { titulo, pool };
}

/** Clica um dos três botões e espera a folha fechar. */
async function decidir(p, botao) {
  await p.evaluate((b) => document.getElementById(b)?.click(), botao);
  await p.evaluate(() => window.__ESPELHO.esperar());
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA}&tempo=simultaneo&cena=bandeiras`
    + `&semente=${SEMENTE}&espelho=1&nevoa=0`, { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => window.__ESPELHO, { timeout: 20000 });
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);

  // -------------------------------------------------- 1 · porte, alvo MAIOR
  console.log('\n· a0 ataca b0 (mon-aguia-gigante, Grande) — porte tem de somar');
  {
    const f = await abrirEFolhear(p, 'a0', 2);
    ok(!!f, 'a folha abriu contra o alvo agendado');
    ok(/b0/.test(f?.titulo || ''), `a folha é contra b0: "${f?.titulo}"`);
    // O modificador é o ÚLTIMO token do pool (nem ferimento nem condição
    // entram nestas fichas novas, e `ajAtq.dados` é zero: nada mais some
    // depois dele). "+3" e não "3": o sinal É o que se está conferindo.
    ok(/\s\+3$/.test((f?.pool || '').trim()), `o pool termina em " +3" (bônus de alvo maior): "${f?.pool}"`);
    const antes = await p.evaluate(() => window.__ESPELHO.pvDe('b0'));
    await decidir(p, 'al-sim');
    const depois = await p.evaluate(() => window.__ESPELHO.pvDe('b0'));
    ok(antes === 999 && typeof depois === 'number' && depois < antes,
      `a Vida de b0 DESCEU (gate abre, Perf. 0 ≥ resistPerf 0): ${antes} → ${depois}`);
  }

  // -------------------------------------------------- 2 · porte, alvo MENOR
  console.log('\n· a1 ataca b1 (mon-dog, Pequeno) — porte tem de subtrair');
  {
    const f = await abrirEFolhear(p, 'a1', 2);
    ok(!!f, 'a folha abriu contra o alvo agendado');
    ok(/b1/.test(f?.titulo || ''), `a folha é contra b1: "${f?.titulo}"`);
    ok(/\s−3$/.test((f?.pool || '').trim()), `o pool termina em " −3" (penalidade de alvo menor): "${f?.pool}"`);
    await decidir(p, 'al-nao'); // não importa pra este par: só o sinal do pool
  }

  // -------------------------------------------------- 3 · gate resvala
  console.log('\n· a2 ataca b2 (guarda-da-cidade, resistPerf 1, Absorção Perf. 2) — o gate tem de resvalar');
  {
    const f = await abrirEFolhear(p, 'a2', 2);
    ok(!!f, 'a folha abriu contra o alvo agendado');
    ok(/b2/.test(f?.titulo || ''), `a folha é contra b2: "${f?.titulo}"`);
    const antes = await p.evaluate(() => window.__ESPELHO.pvDe('b2'));
    // O MESTRE CONFIRMA ACERTO (`al-sim`), de propósito: o gate tem de zerar
    // o dano MESMO QUANDO o golpe é dado como certo. Se a asserção só
    // funcionasse com "não", ela estaria testando o veredito, não o gate.
    await decidir(p, 'al-sim');
    const depois = await p.evaluate(() => window.__ESPELHO.pvDe('b2'));
    ok(antes === 999 && depois === 999,
      `a Vida de b2 NÃO desceu (Perf. 0 < resistPerf 1, o golpe resvala): ${antes} → ${depois}`);
  }
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length
  ? `\n✘ bandeiras na mesa: ${falhas.length} falha(s)`
  : '\n✓ Bandeiras na mesa OK · porte soma no alvo maior e subtrai no menor, e o gate zera a Vida, não só o registro');
if (!falhas.length) carimbar('test-bandeiras-mesa');
process.exit(falhas.length ? 1 : 0);
