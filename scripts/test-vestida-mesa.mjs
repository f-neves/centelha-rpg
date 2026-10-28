// test-vestida-mesa.mjs · a D-206 na mesa de verdade (com o Supabase de mentira).
//
// O teste do motor de Defesa vestida prova o `resumoDe` empacotado. Isto prova o resto, no
// navegador: o card do Grid abre com as duas Defesas e o botão; o clique troca a
// escolha e redesenha o card; o Grid refaz o resumo da peça (o ouvinte do
// `centelha:vestida`); e a folha do golpe contra o campeão mostra a Defesa e a
// Absorção da escolha. Nada vai ao banco: o teste confere que os `dados` do
// combatente, no mock, ficam como estavam, e que a escolha mora no localStorage.
//
// A CENA `?cena=vestida` (`mesa-mock.mjs`, no fim): `v1` (PC) golpeia `v2` (o campeão
// esquelético, peitoral e heater) no Tick 2; `v3` (o soldado veterano) fica ao lado.
//
//   node scripts/test-vestida-mesa.mjs
import puppeteer from 'puppeteer-core';
import { navegadorOuSair } from './navegador.mjs';
import { subirDev } from './dev-server.mjs';
import { MESA_BANCADA } from './bancada.mjs';

const NAV = navegadorOuSair('D-206 · a Defesa vestida na mesa');
const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Abre o card da peça pelo menu de contexto do token (o cabeçalho do menu). */
async function abrirCard(p, cid) {
  const abriu = await p.evaluate(async (cid) => {
    const tk = document.querySelector(`#gr-tokens .gr-token[data-c="${cid}"]`);
    if (!tk) return 'sem token';
    const r = tk.getBoundingClientRect();
    tk.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }));
    await new Promise((res) => setTimeout(res, 300));
    const cab = document.querySelector('#tok-menu .tm-cab.tem-card');
    if (!cab) return 'sem cabeçalho de card no menu';
    cab.click();
    return 'ok';
  }, cid);
  if (abriu !== 'ok') return abriu;
  return p.waitForFunction(() => document.getElementById('card-modal')?.hidden === false
    && /data-vestida/.test(document.getElementById('card-modal-body')?.innerHTML || ''), { timeout: 10000 })
    .then(() => 'ok').catch(() => 'o card não abriu com o botão');
}
const cardTexto = (p) => p.evaluate(() => document.getElementById('card-modal-body')?.innerText || '');

/** Abre a folha do golpe agendado de `id` no Tick `t` e lê a Defesa e a Absorção do alvo. */
async function folha(p, id, t) {
  const abriu = await p.evaluate((i, tt) => window.__ESPELHO.abrir(i, tt), id, t);
  if (!abriu) return null;
  const achou = await p.waitForFunction(() => document.getElementById('alvo-dlg')?.open === true, { timeout: 5000 })
    .then(() => true).catch(() => false);
  if (!achou) return null;
  const txt = await p.evaluate(() => document.getElementById('al-defesas')?.innerText || '');
  await p.evaluate(() => { document.getElementById('al-nao')?.click(); document.getElementById('alvo-dlg')?.close?.(); });
  return txt.replace(/\s+/g, ' ');
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
try {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${dev.url}/mesa/grid?id=${MESA_BANCADA}&tempo=simultaneo&cena=vestida&espelho=1&nevoa=0`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForFunction(() => window.__ESPELHO && document.querySelector('#gr-tokens .gr-token[data-c="v2"]'), { timeout: 30000 });
  await p.evaluate(() => { try { localStorage.removeItem('centelha:mesa:vestida'); } catch {} });
  ok(!erros.length, `a mesa rodou sem erro de página${erros.length ? `: ${erros[0]}` : ''}`);
  const dadosAntes = await p.evaluate(() => JSON.stringify((window.__SB?.tabelas?.combatentes || []).filter((c) => c.id.startsWith('v')).map((c) => c.dados)));

  console.log('\n· sem escolha: a maior Defesa');
  const r0 = await p.evaluate(() => window.__ESPELHO.resumoDe('v2'));
  ok(r0?.defesa === 17 && r0?.soak?.impacto === 8 && r0?.ataque === '3d6+2 +4', `o campeão entra vestido: Defesa ${r0?.defesa}, Absorção ${r0?.soak?.impacto}/${r0?.soak?.corte}/${r0?.soak?.perfuracao}, ataque ${r0?.ataque}`);
  const s0 = await p.evaluate(() => window.__ESPELHO.resumoDe('v3'));
  ok(s0?.defesa === 14 && s0?.ataque === '4d6 +1', `o soldado entra sem a malha: Defesa ${s0?.defesa}, ataque ${s0?.ataque}`);
  // a folha do golpe só se abre uma vez (fechá-la resolve o golpe): ela é lida depois da troca, abaixo

  console.log('\n· o card e o clique');
  const ab = await abrirCard(p, 'v2');
  ok(ab === 'ok', `o card do campeão abre no Grid com o botão (${ab})`);
  const t1 = await cardTexto(p);
  ok(/15 · 17 c\/ equip\./.test(t1) && /A mesa usa: com o equipamento/.test(t1), `o card mostra as duas e diz qual a mesa usa (${(t1.match(/A mesa usa:[^\n]*/) || [''])[0]})`);
  await p.evaluate(() => document.querySelector('#card-modal-body [data-vestida]')?.click());
  const redesenhou = await p.waitForFunction(() => /A mesa usa: sem o equipamento/.test(document.getElementById('card-modal-body')?.innerText || ''), { timeout: 8000 })
    .then(() => true).catch(() => false);
  ok(redesenhou, 'o clique troca e o card se redesenha: "A mesa usa: sem o equipamento"');
  await espera(300);
  const r1 = await p.evaluate(() => window.__ESPELHO.resumoDe('v2'));
  ok(r1?.defesa === 15 && r1?.soak?.impacto === 5 && r1?.ataque === '3d6+2 +5', `o Grid refez o resumo do campeão: Defesa ${r1?.defesa}, Absorção ${r1?.soak?.impacto}/${r1?.soak?.corte}/${r1?.soak?.perfuracao}, ataque ${r1?.ataque}`);
  const s1 = await p.evaluate(() => window.__ESPELHO.resumoDe('v3'));
  ok(s1?.defesa === 14, `o soldado não mudou (${s1?.defesa})`);
  await p.evaluate(() => { const m = document.getElementById('card-modal'); if (m) m.hidden = true; document.body.style.overflow = ''; });

  console.log('\n· o golpe com a escolha');
  const f1 = await folha(p, 'v1', 2);
  ok(/Defesa\s*15/i.test(f1 || '') && /5\/2\/2/.test(f1 || ''), `a folha do golpe contra o campeão, depois da troca, usa a escolha: ${f1}`);

  console.log('\n· nada no banco');
  const dadosDepois = await p.evaluate(() => JSON.stringify((window.__SB?.tabelas?.combatentes || []).filter((c) => c.id.startsWith('v')).map((c) => c.dados)));
  ok(dadosDepois === dadosAntes, 'os `dados` dos combatentes no mock ficaram como estavam');
  const ls = await p.evaluate(() => { try { return localStorage.getItem('centelha:mesa:vestida'); } catch { return 'erro'; } });
  ok(ls === '{"campeao-esqueletico":"sem"}', `a escolha mora no localStorage: ${ls}`);
  const escritas = await p.evaluate(() => (window.__SB?.log || []).filter((l) => /update|insert|upsert|delete/i.test(JSON.stringify(l)) && /vestida/i.test(JSON.stringify(l))).length);
  ok(escritas === 0, `nenhuma escrita no banco fala da escolha (${escritas})`);
  ok(erros.length === 0, `nenhum erro de página (${erros.slice(0, 2).join(' | ') || 'nenhum'})`);

  console.log('\n· o Editar da aba Combate ("Gravar menos")');
  const p2 = await br.newPage();
  await p2.setViewport({ width: 1400, height: 950 });
  const erros2 = [];
  p2.on('pageerror', (e) => erros2.push(e.message));
  await p2.goto(`${dev.url}/mesa/combate?id=${MESA_BANCADA}&cena=vestida`, { waitUntil: 'networkidle0', timeout: 60000 });
  const temBotao = await p2.waitForFunction(() => document.querySelector('.editc[data-c="v2"]'), { timeout: 30000 }).then(() => true).catch(() => false);
  ok(temBotao, 'a aba Combate mostra o campeão com o botão de editar');
  if (temBotao) {
    const campos = await p2.evaluate(async () => {
      document.querySelector('.editc[data-c="v2"]').click();
      await new Promise((r) => setTimeout(r, 400));
      const g = (i) => document.getElementById(i);
      return { aberto: g('edit-dlg')?.open, def: g('edit-def').value, defPh: g('edit-def').placeholder, absI: g('edit-abs-i').value, absIPh: g('edit-abs-i').placeholder, atq: g('edit-atq').value, atqPh: g('edit-atq').placeholder, defs: g('edit-defs').value };
    });
    ok(campos.aberto && campos.def === '' && campos.absI === '' && campos.atq === '' && campos.defs !== '',
      `os campos da escolha vêm vazios, e o resto vem preenchido: ${JSON.stringify(campos)}`);
    ok(campos.defPh === '15' || campos.defPh === '17', `o número da escolha em cinza (marcador ${campos.defPh})`);
    await p2.evaluate(async () => { document.getElementById('edit-salvar').click(); await new Promise((r) => setTimeout(r, 800)); });
    const dados = await p2.evaluate(() => (window.__SB?.tabelas?.combatentes || []).find((c) => c.id === 'v2')?.dados);
    ok(dados && !('defesa' in dados) && !('soak' in dados) && !('ataque' in dados) && !('resistPerf' in dados),
      `o Salvar não gravou as chaves da escolha: ${JSON.stringify(dados)}`);
  }
  ok(erros2.length === 0, `nenhum erro de página na aba Combate (${erros2.slice(0, 2).join(' | ') || 'nenhum'})`);
} finally {
  await br.close();
  await dev.parar?.();
}

console.log(falhas.length ? `\n✘ D-206 na mesa: ${falhas.length} falha(s)` : '\n✓ D-206 na mesa: o card mostra as duas, o clique troca, o Grid refaz o resumo, a folha usa a escolha, e nada vai ao banco');
process.exit(falhas.length ? 1 : 0);
