// D-259 na /ficha de verdade: a ficha antiga (ref + ajuste) abre, vira item inteiro, o
// "ajustar" edita o item (inclusive os campos que eram fixos) e a ficha salva sem ajuste.
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
import { subirDev } from './dev-server.mjs';
import { navegadorOuSair } from './navegador.mjs';
import { carimbar } from './carimbo.mjs';

const kael = JSON.parse(fs.readFileSync('scripts/fixtures/kael.json', 'utf8'));
kael.conjuntos[0].habil.mod = { acerto: 3 };
const dev = await subirDev();
const browser = await puppeteer.launch({ executablePath: navegadorOuSair('ficha, item inteiro'), headless: true, args: ['--no-sandbox'] });
const falhas = []; const ok = (c, m) => { console.log((c ? '✓ ' : '✘ ') + m); if (!c) falhas.push(m); };
try {
  const p = await browser.newPage(); const erros = []; p.on('pageerror', (e) => erros.push(String(e)));
  await p.setRequestInterception(true);
  p.on('request', (r) => /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(r.url()) || r.url().startsWith('data:') ? r.continue() : r.abort());
  await p.goto(dev.url + '/ficha', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await p.evaluate((f) => localStorage.setItem('centelha:ficha', JSON.stringify(f)), kael);
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForSelector('#eq-arsenal .eq-peca', { timeout: 60000 });
  const uid = await p.$eval('#eq-arsenal .eq-peca', (e) => e.dataset.ars);
  ok(await p.$eval(`[data-eqm="ars:${uid}:acerto"]`, (e) => e.value === '3'), 'ficha antiga com ajuste: o Acerto 3 aparece no item da espada');
  ok(await p.$(`select[data-eqm="ars:${uid}:tipoDano"]`) !== null && await p.$(`select[data-eqm="ars:${uid}:pericia"]`) !== null
    && await p.$(`[data-eqm="ars:${uid}:maos"]`) !== null && await p.$(`[data-eqm="ars:${uid}:tags"]`) !== null
    && await p.$(`[data-eqm="ars:${uid}:forcaMult"]`) !== null && await p.$(`select[data-eqm="ars:${uid}:alcance"]`) !== null,
    'o ajustar abre Mãos, Tipo de dano, Habilidade, Força ×, Alcance e Tags');
  await p.$eval(`[data-eq-pan="ars:${uid}"]`, (e) => { e.hidden = false; });
  await p.$eval(`[data-eqm="ars:${uid}:acerto"]`, (e) => { e.value = '4'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.$eval(`select[data-eqm="ars:${uid}:tipoDano"]`, (e) => { e.value = 'impacto'; e.dispatchEvent(new Event('change', { bubbles: true })); });
  await p.$eval(`[data-eqm="ars:${uid}:tags"]`, (e) => { e.value = 'versátil, polida'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  const salva = await p.evaluate(() => JSON.parse(localStorage.getItem('centelha:ficha')));
  const habil = salva.equipamento?.conjuntos?.find((c) => c.ativo)?.maoHabil;
  ok(habil?.item?.origem === 'espada-longa' && habil.item.arma.acerto === 4, 'salva: a mão hábil guarda a espada inteira com Acerto 4');
  ok(habil?.item?.arma?.tipoDano === 'impacto' && habil.item.arma.modos.find((m) => m.principal).tipo === 'impacto', 'salva: o tipo de dano trocado no item e no modo principal');
  ok(JSON.stringify(habil?.item?.tags) === JSON.stringify(['versátil', 'polida']), 'salva: as tags editadas');
  ok(!JSON.stringify(salva.equipamento).includes('"ajuste"') && !JSON.stringify(salva.equipamento).includes('"mod"'), 'salva: nenhum ajuste nem mod na ficha');
  ok((salva.equipamento.armaduras || []).every((a) => a.item?.armadura?.soak), 'salva: as armaduras com o item inteiro');
  ok(salva.equipamento.conjuntos.find((c) => c.ativo).maoInabil.item?.origem === 'broquel', 'salva: o broquel inteiro na mão inábil');
  ok(erros.length === 0, 'nenhum erro de página: ' + erros.join('; '));
} finally { await browser.close(); await dev.parar(); }
if (falhas.length) process.exitCode = 1; else { carimbar('test-ficha-item-inteiro'); console.log('✓ ficha: item inteiro OK'); }
