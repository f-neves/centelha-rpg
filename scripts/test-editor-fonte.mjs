// test-editor-fonte.mjs · prova no navegador (Edge headless, sem rede, sem banco) do editor de criaturas da fonte única
// (scripts/bestiario-editor/gera-editor.mjs, corte 1: números ao vivo, card de hoje e exportar).
//
//   node scripts/test-editor-fonte.mjs
//
// Gera o HTML numa pasta de os.tmpdir(), abre por file://, edita o Vigor do lobo, confere os números ao vivo e o arquivo de alterações
// que o "Exportar" produz, e passa esse arquivo pelo aplicador (dry-run, no site de verdade, sem gravar): o editor e o aplicador
// têm de se entender.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { pathToFileURL } from 'node:url';
import { navegadorOuSair, abrirNavegador } from './navegador.mjs';
import { montarHtml } from './bestiario-editor/gera-editor.mjs';
import { planejar } from './bestiario-editor/aplica-alteracoes.mjs';

const EDGE = navegadorOuSair('editor de criaturas da fonte única');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'editor-fonte-'));
const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const { html, criaturas, cartoes } = await montarHtml();
const arq = path.join(tmp, 'editor.html');
fs.writeFileSync(arq, html);
console.log(`• editor gerado: ${criaturas} criaturas, ${cartoes} cards de hoje, ${(html.length / 1048576).toFixed(1)} MB`);
ok(!html.includes(String.fromCharCode(0x2028)) && !html.includes(String.fromCharCode(0x2029)), 'o HTML não traz separador de linha do Unicode (quebraria o JSON embutido)');

const br = await abrirNavegador(puppeteer, { executablePath: EDGE, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(String(e)));
  p.on('dialog', (d) => (d.type() === 'prompt' ? d.accept('lobo-teste') : d.accept()));
  await p.setViewport({ width: 1500, height: 900 });
  await p.goto(pathToFileURL(arq).href, { waitUntil: 'load', timeout: 60000 });
  ok(await p.$$eval('#itens li', (l) => l.length) === criaturas, `a lista mostra as ${criaturas} criaturas`);
  ok(/A ficha final é a do site/.test(await p.$eval('#aviso', (e) => e.textContent)), 'o aviso do topo diz que a ficha final é a do site');

  await p.type('#busca', 'lobo');
  const achados = await p.$$eval('#itens li', (l) => l.map((x) => x.dataset.id));
  ok(achados.includes('lobo') && achados.length < 20, 'a busca "lobo" filtra a lista: ' + achados.slice(0, 5).join(', '));
  await p.click('#itens li[data-id="lobo"]');
  ok(/^Lobo/.test(await p.$eval('#tit', (e) => e.textContent)), 'abrir o lobo mostra o título dele');
  ok(await p.$$eval('#campos .campo', (c) => c.length) > 10, 'o formulário mostra os campos da criatura');
  const numsAntes = await p.$$eval('#nums tr', (r) => Object.fromEntries(r.map((x) => [x.children[0].textContent, [x.children[1].textContent, x.children[2].textContent]])));
  ok(numsAntes.pv && numsAntes.pv[0] === numsAntes.pv[1] && numsAntes.pv[0] !== '', 'os números ao vivo mostram o PV do motor, igual antes e depois (sem edição): ' + JSON.stringify(numsAntes.pv));
  if (cartoes) ok(await p.$('#cartao article.besta') !== null, 'o card de hoje do lobo aparece (extraído do dist)');

  // edita o Vigor
  const vigor = await p.evaluateHandle(() => [...document.querySelectorAll('#campos .campo label')].find((l) => l.title === 'atributos.vigor').parentElement.querySelector('input'));
  const vigorAntes = Number(await vigor.evaluate((e) => e.value));
  await vigor.evaluate((e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, vigorAntes + 1);
  const depois = await p.$$eval('#nums tr', (r) => Object.fromEntries(r.map((x) => [x.children[0].textContent, [x.children[1].textContent, x.children[2].textContent, x.className]])));
  ok(depois.pv[0] !== depois.pv[1], 'com o Vigor mudado, o PV do motor muda ao vivo: ' + JSON.stringify(depois.pv));
  ok(depois.pv[2] === 'muda', 'a linha que mudou fica marcada');
  ok(/1 campo\(s\) alterado\(s\) em 1 criatura/.test(await p.$eval('#resumo', (e) => e.textContent)), 'o resumo conta 1 campo em 1 criatura');
  ok(await p.$eval('#itens li[data-id="lobo"]', (e) => e.classList.contains('mud')), 'a criatura alterada fica marcada na lista');

  // exporta
  await p.click('#bExportar');
  const exp = await p.evaluate(() => window.__ULTIMA_EXPORTACAO);
  ok(exp && exp.formato === 'fichas-editor-alteracoes' && exp.versao === 2 && exp.alteracoes.length === 1, 'o Exportar produz o arquivo de alterações, versão 2, com 1 alteração');
  const a = exp.alteracoes[0];
  ok(a.id === 'lobo' && JSON.stringify(a.caminho) === '["atributos","vigor"]' && a.antes === vigorAntes && a.depois === vigorAntes + 1, 'a alteração traz id, caminho, antes e depois: ' + JSON.stringify(a));

  // o aplicador entende o que o editor exporta (dry-run no site de verdade: nada é gravado)
  const plano = await planejar(exp);
  ok(plano.erros.length === 0 && plano.conflitos.length === 0 && plano.criaturas.length === 1 && plano.criaturas[0].id === 'lobo', 'o aplicador aceita o arquivo exportado: 1 criatura, sem conflito nem erro ' + JSON.stringify(plano.erros));
  ok(plano.numeros.some((n) => n.id === 'lobo' && n.caminho === 'atributos.vigor') && plano.numeros.some((n) => n.derivado && /pv/.test(n.derivado)), 'e lista o Vigor e o PV do motor como mudança de número');

  // voltar ao valor de antes tira a alteração
  await vigor.evaluate((e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, vigorAntes);
  ok(/0 campo\(s\) alterado\(s\)/.test(await p.$eval('#resumo', (e) => e.textContent)), 'voltar ao valor de antes desfaz a alteração');

  // a memória do navegador e o descartar
  await vigor.evaluate((e, v) => { e.value = String(v); e.dispatchEvent(new Event('input', { bubbles: true })); }, vigorAntes + 2);
  await p.reload({ waitUntil: 'load' });
  const lembra = /1 campo\(s\) alterado\(s\)/.test(await p.$eval('#resumo', (e) => e.textContent));
  console.log('  ' + (lembra ? '✓' : '·') + ' a alteração sobrevive ao recarregar (localStorage' + (lembra ? '' : ' indisponível neste navegador/arquivo: não é falha') + ')');
  if (lembra) { await p.click('#bLimpar'); ok(/0 campo\(s\) alterado\(s\)/.test(await p.$eval('#resumo', (e) => e.textContent)), 'descartar tudo zera as alterações'); }
  // corte 2: a LINHA NOVA ("+ item"): duplica o último item da lista como modelo; editar o item novo muda o "depois" dele
  await p.click('#bLimpar'); await p.click('#itens li[data-id="lobo"]');
  const botao = await p.evaluateHandle(() => { const d = [...document.querySelectorAll('#campos details')].find((x) => x.querySelector(':scope > summary').textContent.startsWith('ataques [')); d.open = true; return d.querySelector(':scope > button.peq'); });
  const totalAntes = await p.evaluate(() => Number([...document.querySelectorAll('#campos details > summary')].find((s) => s.textContent.startsWith('ataques [')).textContent.match(/\[(\d+)\]/)[1]));
  await botao.click();
  const totalDepois = await p.evaluate(() => Number([...document.querySelectorAll('#campos details > summary')].find((s) => s.textContent.startsWith('ataques [')).textContent.match(/\[(\d+)\]/)[1]));
  ok(totalDepois === totalAntes + 1 && await p.$$eval('#campos summary', (s) => s.some((x) => /\(item novo\)/.test(x.textContent))), `"+ item" acrescenta um ataque (de ${totalAntes} para ${totalDepois}) marcado "item novo"`);
  const campoNome = await p.evaluateHandle((n) => [...document.querySelectorAll('#campos .campo label')].find((l) => l.title === `ataques.${n}.nome`).parentElement.querySelector('input'), totalAntes);
  await campoNome.evaluate((e) => { e.value = 'Mordida de teste'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.click('#bExportar');
  const exp2 = await p.evaluate(() => window.__ULTIMA_EXPORTACAO);
  const nova = exp2.alteracoes.find((x) => x.caminho.length === 2 && x.caminho[0] === 'ataques');
  ok(exp2.alteracoes.length === 1 && nova && nova.caminho[1] === totalAntes && !('antes' in nova) && nova.depois.nome === 'Mordida de teste', 'o Exportar traz UMA alteração de item novo (caminho ["ataques", ' + totalAntes + '], sem "antes", com o nome editado): ' + JSON.stringify(exp2.alteracoes).slice(0, 160));
  const plano2 = await planejar(exp2);
  ok(plano2.erros.length === 0 && plano2.criaturas.length === 1 && plano2.criaturas[0].depois.ataques.length === totalAntes + 1, 'o aplicador aceita o ataque novo (dry-run no site de verdade): ' + JSON.stringify(plano2.erros).slice(0, 200));
  ok(plano2.numeros.some((n) => n.id === 'lobo' && n.caminho === `ataques.${totalAntes}`), 'e o ataque novo entra na lista de mudanças de número');
  await p.evaluate(() => [...document.querySelectorAll('#campos button.peq')].find((b) => /tirar este item novo/.test(b.textContent)).click());
  ok(/0 campo\(s\) alterado\(s\)/.test(await p.$eval('#resumo', (e) => e.textContent)), '"tirar este item novo" desfaz a linha nova');
  // corte 2: CRIATURA NOVA a partir da aberta
  await p.click('#itens li[data-id="lobo"]');
  await p.click('#bNova');
  ok(/Lobo teste \(nova\)/.test(await p.$eval('#tit', (e) => e.textContent)) && await p.$('#itens li[data-id="lobo-teste"].mud') !== null, '"Nova criatura a partir desta" abre a criatura nova (id lobo-teste, nome "Lobo teste") e a marca na lista');
  ok(/1 criatura\(s\) nova\(s\)/.test(await p.$eval('#resumo', (e) => e.textContent)), 'o resumo conta a criatura nova');
  const vigorN = await p.evaluateHandle(() => [...document.querySelectorAll('#campos .campo label')].find((l) => l.title === 'atributos.vigor').parentElement.querySelector('input'));
  await vigorN.evaluate((e) => { e.value = '5'; e.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.click('#bExportar');
  const exp3 = await p.evaluate(() => window.__ULTIMA_EXPORTACAO);
  ok(exp3.alteracoes.length === 0 && exp3.novas.length === 1 && exp3.novas[0].id === 'lobo-teste' && exp3.novas[0].base === 'lobo' && exp3.novas[0].criatura.id === 'lobo-teste' && exp3.novas[0].criatura.atributos.vigor === 5, 'o Exportar traz a criatura nova inteira em `novas` (id, base, JSON com o Vigor editado), e nenhuma alteração solta');
  const plano3 = await planejar(exp3);
  ok(plano3.erros.length === 0 && plano3.criaturas.length === 1 && plano3.criaturas[0].nova && plano3.numeros.some((n) => n.id === 'lobo-teste' && /criatura nova\) pv/.test(n.derivado || '')), 'o aplicador aceita a criatura nova (dry-run no site de verdade) e lista os números do motor dela: ' + JSON.stringify(plano3.erros).slice(0, 200));
  await p.reload({ waitUntil: 'load' });
  ok(await p.$('#itens li[data-id="lobo-teste"]') !== null, 'a criatura nova sobrevive ao recarregar (memória do navegador)');
  await p.click('#bLimpar');
  ok(await p.$('#itens li[data-id="lobo-teste"]') === null && /0 campo\(s\) alterado\(s\) em 0 criatura\(s\)$/.test(await p.$eval('#resumo', (e) => e.textContent)), 'descartar tudo tira a criatura nova da lista e zera o resumo');
  ok(erros.length === 0, 'nenhum erro de página: ' + erros.join('; ').slice(0, 300));
} finally { await br.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
if (falhas.length) { console.error(`✘ ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ editor da fonte única: números ao vivo, card de hoje, exportar e o aplicador se entendem');
