// test-etapa0.mjs · a instrumentação da bancada, e só ela.
//
// A Etapa 0 do harness (`docs/simulacao/06-etapa-0.md`) não muda regra nenhuma:
// ela entrega uma cena REPETÍVEL e um DESPEJO do que o motor decidiu. Este
// arquivo prova as duas coisas, que são a base de tudo o que vem depois:
//
//   1. o despejo existe, tem um registro por Tick e diz quem é cada peça;
//   2. a mesma semente, duas cargas da mesma cena, dá a MESMA sequência de
//      dados. É isto que torna o teste-espelho possível: sem ele, comparar dano
//      entre duas execuções é comparar ruído;
//   3. sementes diferentes dão sequências diferentes, senão o item 2 estaria
//      provando só que a página é determinística por não rolar nada;
//   4. sem `?semente=`, a cena volta a ser aleatória, que é o comportamento de
//      produção. A instrumentação não pode mudar a mesa de quem joga.
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
const NAV = navegadorOuSair('Etapa 0');

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Abre a cena, clica "⏭" `cliques` vezes e devolve o despejo.
 *
 * O PARÂMETRO SE CHAMAVA `ticks` E CONTAVA CLIQUES (achado da revisão de
 * 06/09/2026): "um clique, um Tick" era verdade antes do avanço unificado.
 * Hoje, em `?tempo=simultaneo`, cada clique de "⏭" pode rodar VÁRIOS Ticks
 * internamente até achar uma parada real — então `cliques` continua sendo o
 * número de vezes que se aperta o botão, mas não é mais o número de Ticks que
 * a cena percorre, e o nome antigo mentia isso.
 */
async function correr(br, url, query, cliques = 6) {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0&tempo=simultaneo&${query}`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await espera(700);
  // ROLAR A INICIATIVA é o que faz a cena tocar em dado. Sem isto o avanço de
  // Tick é pura aritmética de agenda, e uma semente que não pegasse passaria
  // despercebida: os Ticks sairiam idênticos de qualquer jeito.
  await p.evaluate(() => document.getElementById('ini-rolar')?.click());
  await p.waitForSelector('dialog.ui-dlg[open] .ui-dlg-ok', { timeout: 15000 });
  await p.evaluate(() => document.querySelector('dialog.ui-dlg[open] .ui-dlg-ok').click());
  await espera(600);
  // ESPERAR O RELÓGIO MUDAR, e não um número de milissegundos. A dormida fixa é
  // o erro que a `03-respostas.md` §5.1 já tinha diagnosticado na suíte antiga
  // (`await espera(650)`, lido depois como se fosse o custo do avanço): ela tem
  // folga nesta máquina e não terá numa mais lenta nem numa cena maior, e o dia
  // em que um clique cair antes de o avanço anterior terminar o teste falha
  // parecendo não determinismo. Aí alguém culpa a semente.
  const tickInicial = parseInt((await p.$eval('#ini-tk', (e) => e.textContent)) || '0', 10);
  for (let i = 0; i < cliques; i++) {
    const antes = await p.$eval('#ini-tk', (e) => e.textContent);
    await p.evaluate(() => document.getElementById('ini-prox')?.click());
    await p.waitForFunction(
      (v) => document.getElementById('ini-tk')?.textContent !== v,
      { timeout: 15000, polling: 16 }, antes,
    );
  }
  const tickFinal = parseInt((await p.$eval('#ini-tk', (e) => e.textContent)) || '0', 10);
  const d = await p.evaluate(() => (window).__DESPEJO || null);
  await p.close();
  return { despejo: d, erros, deltaTicks: tickFinal - tickInicial };
}

/** A assinatura de acaso de uma corrida: as iniciativas, que são os primeiros dados da cena. */
const assinatura = (d) => {
  const t = d?.ticks?.[0];
  if (!t) return null;
  return t.pecas.map((p) => `${p.id}:${p.ini}`).join('|');
};

const { url, parar } = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  console.log('\n· Etapa 0: a semente e o despejo');

  // ---- 1: o despejo existe e tem forma ----
  const a = await correr(br, url, 'semente=1234&despejo=1');
  ok(a.erros.length === 0, `a página carrega sem erro (${a.erros[0] || 'nenhum'})`);
  ok(!!a.despejo, 'window.__DESPEJO existe quando a URL pede');
  ok(a.despejo?.semente === 1234, `o despejo registra a semente usada (${a.despejo?.semente})`);
  ok(a.despejo?.semeado === true, 'e registra que a fonte de acaso está semeada');
  // CONTAGEM DE TICKS, E NÃO DE CLIQUES (achado da revisão de 06/09/2026):
  // `>= 5` sobre `ticks.length` só media "pelo menos alguns" quando um clique
  // valia um Tick. Hoje um clique pode valer muitos, e `ticks.length` cresce
  // sozinho por isso: o `>= 5` passava mesmo que metade dos Ticks reais não
  // tivesse virado registro, porque os Ticks extras enchiam a conta por cima
  // do buraco. A igualdade com `deltaTicks` (o relógio antes e depois, lido de
  // `#ini-tk`) fecha o buraco: exige um registro por Tick de verdade, nem mais
  // nem menos.
  ok((a.despejo?.ticks || []).length === a.deltaTicks,
    `um registro por Tick, nem mais nem menos (${a.despejo?.ticks?.length} para ${a.deltaTicks} Tick(s) em 6 cliques)`);
  const t0 = a.despejo?.ticks?.[0];
  ok((t0?.pecas || []).length > 1, `o Tick traz as peças da cena (${t0?.pecas?.length})`);
  ok(t0?.pecas?.every((p) => p.id && 'fase' in p && 'defesaPerdida' in p && 'q' in p),
    'e cada peça traz id, fase, Defesa perdida e posição');
  ok(t0?.fila?.length === t0?.pecas?.length, 'a fila do Tick tem o mesmo tamanho da lista de peças');
  ok(a.despejo?.erros === 0, `nenhum Tick falhou no despejo (${a.despejo?.erros})`);
  ok(a.despejo?.descartados === 0, `e nada foi descartado pelo teto em ${a.deltaTicks} Tick(s) (${a.despejo?.descartados})`);

  // ---- 2: a mesma semente repete ----
  const b = await correr(br, url, 'semente=1234&despejo=1');
  const sa = assinatura(a.despejo), sb = assinatura(b.despejo);
  ok(!!sa, `a assinatura de acaso sai da cena (${(sa || '').slice(0, 46)}…)`);
  ok(sa === sb, 'a MESMA semente dá a mesma sequência de dados em duas cargas');
  ok(JSON.stringify(a.despejo?.ticks) === JSON.stringify(b.despejo?.ticks),
    `e o despejo inteiro dos ${a.deltaTicks} Tick(s) é idêntico, campo por campo`);

  // ---- 3: semente diferente, cena diferente ----
  const c = await correr(br, url, 'semente=99&despejo=1');
  ok(assinatura(c.despejo) !== sa, 'uma semente DIFERENTE dá outra sequência (a cena rola de verdade)');

  // ---- 4: sem semente, a mesa de produção não muda ----
  const d1 = await correr(br, url, 'despejo=1', 2);
  const d2 = await correr(br, url, 'despejo=1', 2);
  ok(d1.despejo?.semeado === false, 'sem ?semente= a fonte continua sendo Math.random');
  ok(d1.despejo?.semente === null, 'e o despejo registra que não houve semente');
  ok(assinatura(d1.despejo) !== assinatura(d2.despejo),
    'e duas cargas sem semente dão sequências diferentes: a mesa de verdade segue aleatória');
} finally {
  await br.close();
  await parar();
}

console.log(`\n${FALHAS.length ? '✗' : '✓'} Etapa 0: ${PASSOU} passaram, ${FALHAS.length} falharam`);
if (FALHAS.length) { FALHAS.forEach((f) => console.log('  · ' + f)); process.exit(1); }

// O carimbo: quando este portao passou nesta maquina. Ver `carimbo.mjs`.
// Aqui embaixo porque o codigo so chega ate aqui quando nao houve falha: quem
// falha sai por `process.exit(1)` antes.
carimbar('test-etapa0');
