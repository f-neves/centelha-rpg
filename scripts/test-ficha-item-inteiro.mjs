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
  // Item 10 (D-260, A2): a massa só fica guardada quando o jogador a escreve.
  const semMassa = JSON.parse(fs.readFileSync('scripts/fixtures/kael.json', 'utf8'));
  await p.evaluate((f) => localStorage.setItem('centelha:ficha', JSON.stringify(f)), semMassa);
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForSelector('#corpo-massa', { timeout: 60000 });
  await p.waitForFunction(() => document.getElementById('corpo-massa').placeholder.length > 0 || document.getElementById('corpo-massa').value !== '', { timeout: 30000 });
  ok(await p.$eval('#corpo-massa', (e) => e.value === '' && e.placeholder.startsWith('70')), 'massa vazia: o campo mostra o padrão do humano (70) só como sugestão');
  // Parecer da Leitora-novata, achado 12: a ficha avisa por escrito que a massa vazia é a padrão da raça.
  const nota = () => p.$eval('#corpo-massa-nota', (e) => e.textContent || '');
  ok(/Campo vazio: as contas usam a massa padrão da raça \(Humano\), 70 kg/.test(await nota()), 'massa vazia: o aviso diz que é a padrão da raça (' + (await nota()) + ')');
  await p.$eval('#raca-sel', (e) => { e.value = 'anao'; e.dispatchEvent(new Event('change', { bubbles: true })); });
  ok(await p.$eval('#corpo-massa', (e) => e.value === '' && e.placeholder.startsWith('85')), 'trocar a raça para anão refaz o padrão (85)');
  const lida = () => p.evaluate(() => JSON.parse(localStorage.getItem('centelha:ficha')));
  ok(!('massa' in ((await lida()).corpo || {})), 'salva: sem massa escrita, nenhuma massa na ficha');
  await p.$eval('#corpo-massa', (e) => { e.value = '95'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  ok((await lida()).corpo?.massa === 95, 'salva: a massa escrita (95) fica');
  ok(/^Massa escrita por você/.test(await nota()), 'com a massa escrita, o aviso diz que é a do jogador (' + (await nota()) + ')');
  await p.$eval('#corpo-massa', (e) => { e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true })); });
  const apagada = await lida();
  ok(!('massa' in (apagada.corpo || {})), 'salva: apagar o campo tira a massa e devolve o padrão');
  ok(/massa padrão da raça \(Anão\), 85 kg/.test(await nota()), 'apagar devolve o aviso do padrão (' + (await nota()) + ')');
  // Achado 12, o "0d6": a ficha vazia ataca de Punhos com Força 1 e Briga 0, soma 1, e o Cap. I chama isso de
  // "nenhum dado, total fixo 2".
  await p.evaluate(() => localStorage.removeItem('centelha:ficha'));
  await p.reload({ waitUntil: 'domcontentloaded' });
  await p.waitForFunction(() => /Ataque/.test(document.getElementById('combate')?.textContent || ''), { timeout: 60000 });
  const cmb = await p.$eval('#combate', (e) => e.textContent.replace(/\s+/g, ' '));
  ok(/Ataque: Punhos, nenhum dado, total fixo 2 \+1/.test(cmb) && !/0d6/.test(cmb), 'ficha vazia: o ataque sem dado diz "nenhum dado, total fixo 2" (' + (cmb.match(/Ataque:[^·]*/) || [''])[0] + ')');
  ok(erros.length === 0, 'nenhum erro de página: ' + erros.join('; '));
} finally { await browser.close(); await dev.parar(); }
if (falhas.length) process.exitCode = 1; else { carimbar('test-ficha-item-inteiro'); console.log('✓ ficha: item inteiro OK'); }
