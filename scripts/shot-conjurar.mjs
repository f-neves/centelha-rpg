// Abre a caixa de conjuração no Grid, com o banco de mentira da bancada, e tira
// uma foto dela. Serve para conferir com o olho o que o teste não alcança: os
// controles novos da manifestação (fatias e abertura) e a lista de moldes.
//
//   node scripts/shot-conjurar.mjs [pasta]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { subirDev } from './dev-server.mjs';

const MESA = '00000000-0000-4000-8000-0000000000aa';
const OUT = process.argv[2] || '_shots';
const NAV = [
  process.env.EDGE, process.env.CHROME,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
].filter(Boolean).find((p) => { try { return fs.existsSync(p); } catch { return false; } });
if (!NAV) { console.log('· sem navegador'); process.exit(0); }

fs.mkdirSync(OUT, { recursive: true });
const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
const p = await br.newPage();
await p.setViewport({ width: 1400, height: 1000 });
const erros = [];
p.on('pageerror', (e) => erros.push(String(e)));
await p.goto(`${dev.url}/mesa/grid?id=${MESA}&bench=12&cols=20&rows=15&nevoa=0`,
  { waitUntil: 'networkidle0', timeout: 90000 });
await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
await new Promise((r) => setTimeout(r, 800));

// Nem toda peça tem Arte: tenta uma a uma até a caixa de conjuração abrir.
const EFS = JSON.parse(fs.readFileSync('src/data/efeitos.json', 'utf8'));
const ZONAS = EFS.filter((e) => e.grid && e.grid.forma === 'zona').map((e) => e.id);
// Efeitos que compram matéria em m³: a coluna vira a lista de sólidos.
const VOLUMES = EFS.filter((e) => (e.parametros || []).some(
  (x) => x.nome === 'Volume' && x.tipo !== 'fixo' && !/de raio/i.test(x.unidade || ''))).map((e) => e.id);
// Efeito sem chão nenhum a escolher: a coluna da forma tem de sumir.
const SEM_CHAO = EFS.filter((e) => e.grid
  && ['alvo', 'nenhuma', 'token', 'movimento'].includes(e.grid.forma)).map((e) => e.id);

const ELEM = JSON.parse(fs.readFileSync('src/data/artes.json','utf8'))
  .filter((a) => a.grid && a.grid.elemento).map((a) => a.id);

const abriu = await p.evaluate(async (ELEM) => {
  const tokens = [...document.querySelectorAll('#gr-tokens .gr-token')];
  if (!tokens.length) return 'sem peça no tabuleiro';
  for (const t of tokens) {
    t.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 400, clientY: 300 }));
    const it = document.querySelector('#tok-menu button[data-a="arte"]');
    if (!it) continue;
    it.click();
    await new Promise((r) => setTimeout(r, 600));
    const cx = document.querySelector('.ui-dlg-conj');
    if (cx && [...cx.querySelectorAll('[data-arte]')].some((a) => ELEM.includes(a.dataset.arte))) {
      [...cx.querySelectorAll('[data-arte]')].find((a) => ELEM.includes(a.dataset.arte)).click();
      await new Promise((r) => setTimeout(r, 300));
      return 'ok';
    }
    document.querySelector('dialog[open]')?.close();
    await new Promise((r) => setTimeout(r, 150));
  }
  return 'nenhuma peça abriu a caixa com Arte elemental';
}, ELEM);
console.log('abrir:', abriu);

if (abriu === 'ok') {
  const figura = () => p.evaluate(() =>
    [...document.querySelectorAll('.ag-cst-fig')].map((e) => e.textContent.trim()).join(' | '));
  const altura = () => p.evaluate(() => document.querySelector('.ag-alt')?.textContent?.replace(/\s+/g, ' ').trim());
  const fatiasDisponiveis = () => p.evaluate(() =>
    [...document.querySelectorAll('[data-fatias]')].map((b) => b.textContent.trim()).join(','));
  const sobe = async (par, quantas) => p.evaluate(([nome, n]) => {
    const mais = [...document.querySelectorAll('[data-par]')]
      .filter((b) => b.dataset.par === nome && b.dataset.d === '1');
    for (let i = 0; i < n; i++) mais[0]?.click();
  }, [par, quantas]);
  const clicar = (sel) => p.evaluate((x) => document.querySelector(x)?.click(), sel);

  // O improviso já abre cobrando a ALTURA, e o teto de fatias anda com o Volume.
  for (const vol of [1, 2, 3]) {
    await sobe('Volume', vol === 1 ? 1 : 1);
    await new Promise((r) => setTimeout(r, 250));
    console.log(`Volume ${vol} · fatias [${await fatiasDisponiveis()}] · ${await altura()}`);
  }
  await sobe('Volume', 3);
  await new Promise((r) => setTimeout(r, 300));
  console.log('Volume 6 · fatias [' + await fatiasDisponiveis() + '] ·', await altura());
  await p.screenshot({ path: `${OUT}/conj-improviso.png` });

  // abre no máximo e confere que a base parou no piso
  await p.evaluate(() => {
    const bs = [...document.querySelectorAll('[data-fatias]')];
    bs[bs.length - 1]?.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  console.log('aberto ao máximo:', await altura(), '·', await figura());

  // trocando para a distância, o teto volta a ser só o nível
  await clicar('[data-abrir="distancia"]');
  await new Promise((r) => setTimeout(r, 300));
  console.log('cobrando distância: fatias [' + await fatiasDisponiveis() + '] ·', await altura());
  await p.screenshot({ path: `${OUT}/conj-roda.png` });
  // a manifestação de perto: as fatias saindo da mão de quem conjura
  const v3mani = await p.$('#ag-3d');
  if (v3mani) await v3mani.screenshot({ path: `${OUT}/3d-manifestacao.png` });

  // o balão do Efeito, ao apontar o cartão
  const pop = await p.evaluate(async () => {
    const cards = [...document.querySelectorAll('[data-ef]')];
    const alvo = cards.find((c) => c.dataset.ef) || cards[0];
    alvo.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));
    const b = document.querySelector('.ag-pop');
    return {
      cartao: alvo.textContent.replace(/\s+/g, ' ').trim(),
      aberto: !!b && !b.hidden,
      texto: (b?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 110),
    };
  });
  console.log('cartão:', JSON.stringify(pop, null, 1));
  await p.screenshot({ path: `${OUT}/conj-balao.png` });

  // um Efeito de ZONA, que é onde a coluna da forma vira lista de moldes
  const zona = await p.evaluate(async (zonas) => {
    const b = [...document.querySelectorAll('[data-ef]')].find((x) => zonas.includes(x.dataset.ef));
    if (!b) return null;
    b.click();
    await new Promise((r) => setTimeout(r, 300));
    const mais = [...document.querySelectorAll('[data-par]')]
      .filter((x) => (x.dataset.par === 'Área' || x.dataset.par === 'Volume') && x.dataset.d === '1');
    for (let i = 0; i < 4; i++) mais[0]?.click();
    await new Promise((r) => setTimeout(r, 300));
    return {
      efeito: b.textContent.replace(/\s+/g, ' ').trim(),
      marcas: document.querySelector('.ag-marcas')?.textContent?.trim(),
      moldes: [...document.querySelectorAll('[data-molde]')].map((m) => m.textContent.replace(/\s+/g, ' ').trim()),
      figura: document.querySelector('.ag-cst-fig')?.textContent?.trim(),
    };
  }, ZONAS);
  console.log('zona:', JSON.stringify(zona, null, 1));
  await p.screenshot({ path: `${OUT}/conj-molde.png` });

  // um Efeito de VOLUME, que é onde a coluna vira lista de sólidos
  const volume = await p.evaluate(async (vols) => {
    const b = [...document.querySelectorAll('[data-ef]')].find((x) => vols.includes(x.dataset.ef));
    if (!b) return 'nenhum Efeito de volume nesta Arte';
    b.click();
    await new Promise((r) => setTimeout(r, 300));
    const mais = [...document.querySelectorAll('[data-par]')]
      .filter((x) => x.dataset.par === 'Volume' && x.dataset.d === '1');
    for (let i = 0; i < 4; i++) mais[0]?.click();
    await new Promise((r) => setTimeout(r, 300));
    const leitura = () => ({
      medidas: document.querySelector('.ag-alt')?.textContent?.replace(/\s+/g, ' ').trim(),
      figura: document.querySelector('.ag-cst-fig')?.textContent?.replace(/\s+/g, ' ').trim(),
    });
    const antes = leitura();
    document.querySelector('[data-solido="cilindro"]')?.click();
    await new Promise((r) => setTimeout(r, 250));
    // A coluna tem de caber sem rolar: um molde escondido atrás de rolagem é um
    // molde que ninguém escolhe.
    const col = document.querySelector('.ag-col-forma');
    // e a vista em 3D gira: arrastar por cima dela tem de mudar o desenho sem
    // repintar a caixa (o cartão marcado continua marcado depois do gesto).
    const v3 = document.querySelector('#ag-3d');
    let giro = 'sem vista 3D';
    if (v3) {
      const antes = v3.innerHTML.length ? v3.innerHTML.slice(0, 400) : '';
      const r = v3.getBoundingClientRect();
      const ev = (t, x, y) => v3.dispatchEvent(new PointerEvent(t, {
        bubbles: true, pointerId: 1, clientX: x, clientY: y,
      }));
      ev('pointerdown', r.left + r.width / 2, r.top + r.height / 2);
      ev('pointermove', r.left + r.width / 2 + 60, r.top + r.height / 2 - 20);
      ev('pointerup', r.left + r.width / 2 + 60, r.top + r.height / 2 - 20);
      await new Promise((r2) => setTimeout(r2, 120));
      giro = `${v3.innerHTML.slice(0, 400) !== antes ? 'girou' : 'NÃO girou'}`
        + ` · ${v3.querySelectorAll('polygon').length} faces`
        + ` · marcado ${document.querySelector('.ag-ef.on')?.textContent?.trim().split(/\s+/)[1] || '?'}`;
    }
    return {
      efeito: b.textContent.replace(/\s+/g, ' ').trim(),
      solidos: [...document.querySelectorAll('[data-solido]')].map((m) => m.textContent.replace(/\s+/g, ' ').trim()),
      cabe: `${col.scrollHeight} de conteúdo em ${col.clientHeight} de coluna`,
      giro,
      cubo: antes, coluna: leitura(),
    };
  }, VOLUMES);
  console.log('volume:', JSON.stringify(volume, null, 1));
  await p.screenshot({ path: `${OUT}/conj-volume.png` });
  // e a coluna sozinha, de perto: é onde mora a vista em 3D, e ela é pequena
  // demais para se conferir na foto da tela inteira.
  const colForma = await p.$('.ag-col-forma');
  if (colForma) await colForma.screenshot({ path: `${OUT}/conj-3d.png` });
  // os oito sólidos, um retrato de cada: é a única conferência possível de
  // normal virada para dentro e de face que sumiu no corte de face oculta.
  for (const id of ['cubo', 'cuboide', 'esfera', 'semiesfera', 'cilindro', 'cone', 'piramide', 'torus']) {
    await p.evaluate((x) => document.querySelector(`[data-solido="${x}"]`)?.click(), id);
    await new Promise((r) => setTimeout(r, 150));
    const v = await p.$('#ag-3d');
    if (v) await v.screenshot({ path: `${OUT}/3d-${id}.png` });
  }

  // e um Efeito SEM forma nenhuma: a terceira coluna some
  const semForma = await p.evaluate(async (semChao) => {
    const b = [...document.querySelectorAll('[data-ef]')].find((x) => semChao.includes(x.dataset.ef));
    if (!b) return null;
    b.click();
    await new Promise((r) => setTimeout(r, 300));
    return {
      efeito: b.textContent.replace(/\s+/g, ' ').trim(),
      colunas: getComputedStyle(document.querySelector('.ag-grade')).gridTemplateColumns,
      temForma: !!document.querySelector('.ag-col-forma'),
    };
  }, SEM_CHAO);
  console.log('sem forma:', JSON.stringify(semForma));
  await p.screenshot({ path: `${OUT}/conj-sem-forma.png` });

  // o filtro da lista: digita, e a lista encolhe sem repintar a caixa
  const filtrado = await p.evaluate(async () => {
    const inp = document.querySelector('#ag-busca');
    if (!inp) return 'sem filtro (lista curta)';
    const antes = [...document.querySelectorAll('.ag-ef')].filter((b) => !b.hidden).length;
    inp.value = 'zon';
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 150));
    const depois = [...document.querySelectorAll('.ag-ef')].filter((b) => !b.hidden).length;
    inp.value = '';
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    return `${antes} → ${depois} com "zon" → ${
      [...document.querySelectorAll('.ag-ef')].filter((b) => !b.hidden).length} de volta`;
  });
  console.log('filtro:', filtrado);

  // e o arrasto pela cabeça
  const moveu = await p.evaluate(async () => {
    const dlg = document.querySelector('.ui-dlg-conj');
    const pega = dlg.querySelector('.ui-dlg-pega');
    const antes = dlg.getBoundingClientRect();
    const r = pega.getBoundingClientRect();
    pega.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: r.left + 40, clientY: r.top + 10 }));
    document.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: r.left - 160, clientY: r.top + 90 }));
    document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await new Promise((x) => setTimeout(x, 150));
    const dep = dlg.getBoundingClientRect();
    return { dx: Math.round(dep.left - antes.left), dy: Math.round(dep.top - antes.top), classe: dlg.className.includes('arrastado') };
  });
  console.log('arrasto:', JSON.stringify(moveu));
  await p.screenshot({ path: `${OUT}/conj-arrastado.png` });
}
console.log('erros de página:', erros.length ? erros.slice(0, 3) : 'nenhum');
await br.close();
dev.parar();
