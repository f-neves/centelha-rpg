// test-luas.mjs — dirige a bancada das luas (luas-bench.html) no Edge headless.
// Confere as duas metades: a aritmética das órbitas e a interface.
//
//   node scripts/test-luas.mjs           # roda tudo
//   node scripts/test-luas.mjs --ver     # abre com janela, para olhar
//
// Não entra no `npm run build`: é bancada, não regra.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { navegadorOuSair } from './navegador.mjs';

// O caminho vinha cravado no Edge do Windows, e o teste saia com codigo 2 em
// qualquer outro sistema. Ver `scripts/navegador.mjs`.
const EDGE = navegadorOuSair('bancada das luas');
const ARQ = path.resolve('luas-bench.html');
const SHOTS = '_shots';
const VER = process.argv.includes('--ver');

if (!fs.existsSync(ARQ)) { console.error(`✘ ${ARQ} não existe.`); process.exit(2); }
fs.mkdirSync(SHOTS, { recursive: true });

const falhas = [];
let grupo = '';
const secao = t => { grupo = t; console.log('\n' + t); };
const ok = (cond, msg, extra) => {
  console.log((cond ? '  \u2713 ' : '  \u2718 ') + msg + (extra ? '  ' + extra : ''));
  if (!cond) falhas.push(`${grupo} · ${msg}${extra ? ' ' + extra : ''}`);
};
const perto = (a, b, tol) => Math.abs(a-b) <= tol;

async function main() {
  const br = await puppeteer.launch({ executablePath: EDGE, headless: VER ? false : 'new', args: ['--no-sandbox'] });
  const p = await br.newPage();
  const erros = [];
  p.on('pageerror', e => erros.push(String(e)));
  p.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto(pathToFileURL(ARQ).href, { waitUntil: 'load', timeout: 30000 });
  await p.waitForFunction(() => window.__bancada && document.querySelectorAll('.lua-hud').length === 3, { timeout: 15000 });

  // pausa o relógio para os testes serem determinísticos
  await p.click('#bPlay');

  /* ---------------- 1. o palco pinta ---------------- */
  secao('1 · o palco');
  const pintou = await p.evaluate(() => {
    const c = document.getElementById('c');
    const g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height).data;
    let distintas = new Set();
    for (let i = 0; i < d.length; i += 4*997) distintas.add(`${d[i]},${d[i+1]},${d[i+2]}`);
    return { cores: distintas.size, w: c.width, h: c.height };
  });
  ok(pintou.w > 300 && pintou.h > 200, 'canvas dimensionado', `${pintou.w}×${pintou.h}`);
  ok(pintou.cores > 6, 'canvas tem conteúdo desenhado', `${pintou.cores} cores amostradas`);

  /* ---------------- 2. os alinhamentos do cânone ---------------- */
  secao('2 · os alinhamentos (§9.16)');
  const medir = d => p.evaluate(dd => {
    const m = window.__bancada.medirTudo(dd);
    const o = {};
    for (const x of m) o[x.id] = { lit: x.iluminada, elong: x.elong, ecl: x.eclipse, total: x.total,
                                   angLua: x.angLua, angSol: x.angSol, dist: x.dist, mare: x.mare };
    return o;
  }, d);

  const d0 = await medir(0);
  ok(['pequena','grande','estrangeira'].every(k => d0[k].lit < 0.08), 'dia 0 · as três novas',
     Object.entries(d0).map(([k,v]) => `${k} ${(v.lit*100).toFixed(1)}%`).join(' · '));

  const d96 = await medir(96);
  ok(['pequena','grande','estrangeira'].every(k => d96[k].lit < 0.08), 'dia 96 · céu apagado',
     Object.entries(d96).map(([k,v]) => `${k} ${(v.lit*100).toFixed(1)}%`).join(' · '));
  ok(d96.grande.ecl && d96.grande.total, 'dia 96 · a Grande faz eclipse TOTAL',
     `sep ${d96.grande.elong.toFixed(2)}° · lua ${d96.grande.angLua.toFixed(3)}° > sol ${d96.grande.angSol.toFixed(3)}°`);
  ok(d96.pequena.ecl && !d96.pequena.total, 'dia 96 · a Pequena faz eclipse ANULAR',
     `sep ${d96.pequena.elong.toFixed(2)}° · lua ${d96.pequena.angLua.toFixed(3)}° < sol ${d96.pequena.angSol.toFixed(3)}°`);
  ok(!d96.estrangeira.ecl, 'dia 96 · a Estrangeira NÃO cruza o sol', `sep ${d96.estrangeira.elong.toFixed(1)}°`);

  const d192 = await medir(192);
  ok(d192.estrangeira.ecl && !d192.estrangeira.total, 'dia 192 · a Estrangeira transita o sol',
     `sep ${d192.estrangeira.elong.toFixed(3)}° · cobre ${(100*Math.pow(d192.estrangeira.angLua/d192.estrangeira.angSol,2)).toFixed(1)}% do disco`);
  ok(!d192.grande.ecl && !d192.pequena.ecl, 'dia 192 · as duas de dentro NÃO eclipsam',
     `Grande ${d192.grande.elong.toFixed(1)}° · Pequena ${d192.pequena.elong.toFixed(1)}°`);

  const d384 = await medir(384);
  ok(d384.estrangeira.ecl, 'dia 384 · a Estrangeira transita de novo (solstício de inverno)');
  ok(['pequena','grande','estrangeira'].every(k => d384[k].lit < 0.08), 'dia 384 · céu apagado');

  const d48 = await medir(48);
  ok(d48.grande.lit > 0.92 && d48.pequena.lit < 0.08 && d48.estrangeira.lit < 0.08,
     'dia 48 · a Grande cheia sozinha',
     `Grande ${(d48.grande.lit*100).toFixed(1)}% · outras ${(d48.pequena.lit*100).toFixed(1)}% e ${(d48.estrangeira.lit*100).toFixed(1)}%`);

  // nunca as três cheias, varrendo o ano inteiro
  const varredura = await p.evaluate(() => {
    let maxMin = 0, quando = -1, contraExemplos = 0;
    for (let t = 0; t < 384; t += 0.05) {
      const m = window.__bancada.medirTudo(t);
      const menor = Math.min(...m.map(x => x.iluminada));
      if (menor > maxMin) { maxMin = menor; quando = t; }
      if (m.every(x => x.iluminada > 0.92)) contraExemplos++;
    }
    return { maxMin, quando, contraExemplos };
  });
  ok(varredura.contraExemplos === 0, 'nunca as três cheias no ano inteiro',
     `melhor tentativa: dia ${varredura.quando.toFixed(1)}, a mais escura das três a ${(varredura.maxMin*100).toFixed(0)}%`);

  // as quatro noites de escuro total e as quatro da Grande sozinha
  const oito = await p.evaluate(() => {
    const escuras = [], sozinha = [];
    for (let t = 1; t < 385; t += 0.25) {
      const m = window.__bancada.medirTudo(t);
      const g = m.find(x => x.id === 'grande'), o = m.filter(x => x.id !== 'grande');
      if (m.every(x => x.iluminada < 0.08)) escuras.push(t);
      if (g.iluminada > 0.92 && o.every(x => x.iluminada < 0.08)) sozinha.push(t);
    }
    const juntar = arr => { const g = []; for (const t of arr) { if (!g.length || t - g[g.length-1][1] > 2) g.push([t,t]); else g[g.length-1][1] = t; } return g.map(x => (x[0]+x[1])/2); };
    return { escuras: juntar(escuras), sozinha: juntar(sozinha) };
  });
  ok(oito.escuras.length === 4, 'quatro janelas de céu apagado por ano',
     'centros nos dias ' + oito.escuras.map(x => x.toFixed(0)).join(', '));
  ok(oito.sozinha.length === 4, 'quatro janelas da Grande cheia sozinha',
     'centros nos dias ' + oito.sozinha.map(x => x.toFixed(0)).join(', '));

  // o ritmo da maré (§9.16, corrigido pela bancada em 25/08/2026)
  const marés = await p.evaluate(() => {
    const amp = t => window.__bancada.mareEm(t).amplitude;
    const v = []; for (let t = 0; t < 384; t += 0.1) v.push(amp(t));
    const sizigias = [], mortas = [], beat = [];
    for (let d = 0; d < 384; d += 16) sizigias.push(amp(d));
    for (let d = 8; d < 384; d += 16) mortas.push(amp(d));
    for (let d = 48; d <= 384; d += 48) beat.push(amp(d === 384 ? 383.99 : d));
    return { max: Math.max(...v), min: Math.min(...v),
             sizMin: Math.min(...sizigias), sizMax: Math.max(...sizigias),
             morMin: Math.min(...mortas), morMax: Math.max(...mortas),
             beatMin: Math.min(...beat) };
  });
  ok(marés.sizMin > 1.5, 'todo dia 16 e todo dia 32 do mês é maré de sizígia',
     `a mais fraca delas dá ${marés.sizMin.toFixed(2)}× a lunar da Terra`);
  ok(marés.morMax < 0.9, 'todo dia 8 e todo dia 24 do mês o mar quase para',
     `a mais forte delas dá só ${marés.morMax.toFixed(2)}×`);
  ok(marés.max/marés.min > 10, 'a razão entre a maior e a menor maré do ano é enorme',
     `${marés.min.toFixed(2)}× a ${marés.max.toFixed(2)}× · razão ${(marés.max/marés.min).toFixed(0)}:1 (na Terra é 2:1)`);
  ok(marés.beatMin > 1.9, 'as oito noites do compasso de 48 dias caem todas em sizígia',
     `a mais fraca delas dá ${marés.beatMin.toFixed(2)}×`);

  /* ---------------- 3. o calendário ---------------- */
  secao('3 · o calendário (§9.4 e §9.5)');
  const cal = d => p.evaluate(dd => window.__bancada.calendario(dd), d);
  const c96 = await cal(96);
  ok(c96.dia === 96 && c96.mes === 3 && c96.diaMes === 32 && c96.semana === 4,
     'dia 96 = mês 3, dia 32, semana 4', JSON.stringify({m:c96.mes,d:c96.diaMes,s:c96.semana}));
  ok(c96.soleira === 'equinócio da luz que cresce', 'dia 96 é a soleira do equinócio ascendente', c96.soleira);
  const c192 = await cal(192);
  ok(c192.mes === 6 && c192.soleira === 'solstício de verão', 'dia 192 é o solstício de verão', c192.soleira);
  const c288 = await cal(288);
  ok(c288.mes === 9 && c288.soleira === 'equinócio da luz que mingua', 'dia 288 é o equinócio descendente');
  const c384 = await cal(384);
  ok(c384.dia === 384 && c384.mes === 12 && c384.soleira === 'solstício de inverno', 'dia 384 é o solstício de inverno');
  const c48 = await cal(48);
  ok(c48.tipo === 'estação' && c48.estacao === 'inverno' && c48.diaMes === 16,
     'dia 48 é dia 16 do mês (lua cheia) e cai no inverno');

  /* ---------------- 4. o HUD reflete o estado ---------------- */
  secao('4 · o painel de leitura');
  await p.evaluate(() => window.__bancada.irPara(96));
  const hud = await p.evaluate(() => ({
    data: document.getElementById('hudData').textContent,
    sub: document.getElementById('hudSub').textContent,
    selos: [...document.querySelectorAll('#hudSelos .selo')].map(e => e.textContent),
    fases: [...document.querySelectorAll('.lua-hud span')].map(e => e.textContent),
    info: document.getElementById('painelInfo').textContent,
  }));
  ok(/dia 96/.test(hud.data), 'HUD mostra o dia certo', hud.data);
  ok(/equinócio/.test(hud.sub), 'HUD mostra a soleira', hud.sub);
  ok(hud.selos.some(s => /céu apagado/.test(s)), 'selo de céu apagado aparece', hud.selos.join(' | '));
  ok(hud.selos.some(s => /total/.test(s)), 'selo de eclipse total aparece');
  ok(hud.fases.every(f => /nova/.test(f)), 'as três fases lidas como nova', hud.fases.join(' · '));
  ok(/maré agora/.test(hud.info), 'painel de leitura preenchido');
  const mare = await p.evaluate(() => {
    const l = [...document.querySelectorAll('.linhainfo')].find(e => /maré agora/.test(e.textContent));
    return parseFloat(l.querySelector('b').textContent);
  });
  ok(mare > 1.8 && mare < 2.6, 'no dia 96 a maré está no pico de sizígia', mare.toFixed(2) + '× a lunar da Terra');

  // as bolinhas de fase do HUD realmente desenham
  const faseDesenhada = await p.evaluate(() => {
    window.__bancada.irPara(48);
    const cs = [...document.querySelectorAll('.lua-hud canvas')];
    return cs.map(c => {
      const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data;
      let claros = 0;
      for (let i=0;i<d.length;i+=4) if (d[i]+d[i+1]+d[i+2] > 300) claros++;
      return claros;
    });
  });
  ok(faseDesenhada[1] > faseDesenhada[0]*4, 'no dia 48 a bolinha da Grande está muito mais cheia que a da Pequena',
     `Pequena ${faseDesenhada[0]}px · Grande ${faseDesenhada[1]}px`);

  /* ---------------- 5. os controles ---------------- */
  secao('5 · os controles');
  // tocar/pausar
  const rot1 = await p.$eval('#bPlay', e => e.textContent);
  await p.click('#bPlay');
  const rot2 = await p.$eval('#bPlay', e => e.textContent);
  await p.click('#bPlay');
  ok(rot1 !== rot2, 'botão de tocar/pausar troca de rótulo', `${rot1} → ${rot2}`);

  // passo de tempo
  const antes = await p.evaluate(() => { window.__bancada.irPara(10); return window.__bancada.cena.t; });
  await p.click('[data-passo="32"]');
  const depois = await p.evaluate(() => window.__bancada.cena.t);
  ok(perto(depois - antes, 32, 1e-6), 'botão +1 mês anda 32 dias', `${antes} → ${depois}`);

  // atalhos de marco
  await p.evaluate(() => [...document.querySelectorAll('#atalhos button')].find(b => b.dataset.dia === '288').click());
  const tMarco = await p.evaluate(() => window.__bancada.cena.t);
  ok(tMarco === 288, 'atalho do equinócio descendente pula para o dia 288', String(tMarco));

  // alvo da câmera
  await p.click('[data-alvo="uldun"]');
  const camU = await p.evaluate(() => ({ alvo: window.__bancada.cam.alvo, dist: window.__bancada.cam.dist }));
  ok(camU.alvo === 'uldun' && camU.dist < 3000, 'câmera troca o alvo para Uldun e aproxima', JSON.stringify(camU));
  const marcado = await p.$eval('[data-alvo="uldun"]', e => e.classList.contains('on'));
  ok(marcado, 'o botão do alvo fica marcado');

  // arrastar gira
  const azAntes = await p.evaluate(() => window.__bancada.cam.az);
  await p.mouse.move(500, 400); await p.mouse.down();
  await p.mouse.move(640, 430, { steps: 8 }); await p.mouse.up();
  const azDepois = await p.evaluate(() => ({ az: window.__bancada.cam.az, el: window.__bancada.cam.el }));
  ok(Math.abs(azDepois.az - azAntes) > 20, 'arrastar gira a câmera em azimute', `${azAntes.toFixed(0)}° → ${azDepois.az.toFixed(0)}°`);
  ok(azDepois.el !== 26, 'arrastar também muda a elevação', `${azDepois.el.toFixed(0)}°`);

  // roda aproxima
  const dAntes = await p.evaluate(() => window.__bancada.cam.dist);
  await p.mouse.move(500, 400);
  try { await p.mouse.wheel({ deltaY: -400 }); } catch { await p.evaluate(() => document.getElementById('c').dispatchEvent(new WheelEvent('wheel', { deltaY: -400, bubbles: true, cancelable: true }))); }
  const dDepois = await p.evaluate(() => window.__bancada.cam.dist);
  ok(dDepois < dAntes, 'roda do mouse aproxima a câmera', `${dAntes.toFixed(0)} → ${dDepois.toFixed(0)} Mm`);

  await p.click('#bCam');
  const camReset = await p.evaluate(() => window.__bancada.cam.az);
  ok(camReset === -60, 'recentrar volta a câmera');

  // um controle deslizante de cada família
  const mexer = (campo, valor) => p.evaluate((c, v) => {
    const num = document.querySelector(`[data-campo="${c}"]`);
    const rng = num.previousElementSibling;
    rng.value = v; rng.dispatchEvent(new Event('input', { bubbles: true }));
    return num.value;
  }, campo, valor);

  const antesA = await p.evaluate(() => window.__bancada.S.luas[1].orb.a);
  await mexer('grande:orb.a', 700);
  const depoisA = await p.evaluate(() => window.__bancada.S.luas[1].orb.a);
  ok(depoisA === 700 && antesA !== 700, 'distância da Grande a Uldun responde ao controle', `${antesA} → ${depoisA} Mm`);

  await mexer('grande:orb.e', 0.5);
  const ecc = await p.evaluate(() => window.__bancada.S.luas[1].orb.e);
  ok(ecc === 0.5, 'excentricidade responde (órbita fica elíptica)', String(ecc));
  const raioVaria = await p.evaluate(() => {
    const T = window.__bancada.S.luas[1].orb.T;
    let min = Infinity, max = 0;
    for (let t = 0; t < T; t += T/240) {
      const r = window.__bancada.estado(t).luas[1].rel;
      const d = Math.hypot(r[0],r[1],r[2]);
      if (d < min) min = d; if (d > max) max = d;
    }
    return { min, max };
  });
  ok(raioVaria.max/raioVaria.min > 2.5, 'com e=0,5 a distância da lua varia ao longo da órbita',
     `${raioVaria.min.toFixed(0)} a ${raioVaria.max.toFixed(0)} Mm (perigeu a apogeu)`);

  await mexer('grande:orb.i', 60);
  const inc = await p.evaluate(() => window.__bancada.S.luas[1].orb.i);
  ok(inc === 60, 'inclinação da órbita responde', String(inc) + '°');
  const saiuDoPlano = await p.evaluate(() => {
    const T = window.__bancada.S.luas[1].orb.T;
    let max = 0;
    for (let t = 0; t < T; t += T/240) max = Math.max(max, Math.abs(window.__bancada.estado(t).luas[1].rel[2]));
    return max;
  });
  ok(saiuDoPlano > 200, 'com inclinação de 60° a lua sai muito do plano de referência', saiuDoPlano.toFixed(0) + ' Mm em z');

  await mexer('grande:rot.obl', 90);
  const obl = await p.evaluate(() => window.__bancada.S.luas[1].rot.obl);
  ok(obl === 90, 'eixo de rotação responde', String(obl) + '°');

  // campo numérico digitado
  await p.evaluate(() => {
    const num = document.querySelector('[data-campo="grande:orb.T"]');
    num.value = '40'; num.dispatchEvent(new Event('change', { bubbles: true }));
  });
  const tOrb = await p.evaluate(() => window.__bancada.S.luas[1].orb.T);
  ok(tOrb === 40, 'período de translação aceita valor digitado', String(tOrb) + ' dias');

  // travada por maré sincroniza a rotação
  await p.evaluate(() => { window.__bancada.sincronizar(); });
  const rotTravada = await p.evaluate(() => ({ travada: window.__bancada.S.luas[1].rot.travada, rotT: window.__bancada.S.luas[1].rot.T, orbT: window.__bancada.S.luas[1].orb.T }));
  ok(rotTravada.travada && perto(rotTravada.rotT, rotTravada.orbT*24, 1e-6),
     'rotação travada por maré acompanha a órbita', `${rotTravada.rotT} h = ${rotTravada.orbT} d`);
  await p.evaluate(() => document.querySelector('[data-travada="grande"]').click());
  const destravou = await p.evaluate(() => window.__bancada.S.luas[1].rot.travada);
  ok(destravou === false, 'a trava de maré pode ser desligada');

  // retrógrada
  const sentido = await p.evaluate(() => {
    const cx = document.querySelector('[data-retro="grande"]');
    const antes = window.__bancada.S.luas[1].orb.retro;
    cx.click();
    return { antes, depois: window.__bancada.S.luas[1].orb.retro };
  });
  ok(sentido.antes !== sentido.depois, 'sentido da órbita pode ser invertido', `${sentido.antes} → ${sentido.depois}`);

  // caixas da cena
  for (const [id, chave] of [['opOrbitas','orbitas'],['opEixos','eixos'],['opRastro','rastro'],['opPlano','plano'],['opNomes','nomes']]) {
    const r = await p.evaluate((i, k) => {
      const el = document.getElementById(i); const antes = window.__bancada.cena[k];
      el.click(); return { antes, depois: window.__bancada.cena[k] };
    }, id, chave);
    ok(r.antes !== r.depois, `caixa "${chave}" liga e desliga`);
    await p.evaluate(i => document.getElementById(i).click(), id);
  }

  // compressão e exagero
  await mexer('compressao', 120);
  const comp = await p.evaluate(() => window.__bancada.cena.compressao);
  ok(comp === 120, 'compressão da órbita solar responde', String(comp) + '×');
  await mexer('exagCorpo', 20);
  ok(await p.evaluate(() => window.__bancada.cena.exagCorpo) === 20, 'exagero dos corpos responde');

  /* ---------------- 6. voltar ao cânone ---------------- */
  secao('6 · reset');
  await p.click('#bReset');
  const voltou = await p.evaluate(() => {
    const S = window.__bancada.S, c = window.__bancada.cena;
    return { a: S.luas[1].orb.a, e: S.luas[1].orb.e, i: S.luas[1].orb.i, T: S.luas[1].orb.T,
             retro: S.luas[1].orb.retro, travada: S.luas[1].rot.travada,
             comp: c.compressao, t: c.t, luasHud: document.querySelectorAll('.lua-hud').length };
  });
  ok(voltou.a === 404.9 && voltou.e === 0.03 && voltou.i === 5 && perto(voltou.T, 29.538, 1e-9),
     'reset devolve a Grande aos valores do cânone', JSON.stringify(voltou));
  ok(voltou.retro === false && voltou.travada === true, 'reset devolve sentido e trava de maré');
  ok(voltou.comp === 50 && voltou.t === 0, 'reset devolve a cena');
  ok(voltou.luasHud === 3, 'o HUD é remontado com as três luas');

  // depois do reset os alinhamentos voltam a bater
  const pos = await medir(96);
  ok(pos.grande.total, 'depois do reset o eclipse do dia 96 volta a acontecer');

  // realinhar
  await p.evaluate(() => { window.__bancada.S.luas[1].orb.om = 200; window.__bancada.sincronizar(); });
  await p.click('#bRealinhar');
  const realinhado = await p.evaluate(() => ({ M0: window.__bancada.S.luas[1].orb.M0, t: window.__bancada.cena.t,
    lit: window.__bancada.medirTudo(0).map(x => x.iluminada) }));
  ok(perto(realinhado.M0, 340, 1e-6) && realinhado.t === 0, 'realinhar recalcula a anomalia de época', 'M0 = ' + realinhado.M0);
  ok(realinhado.lit.every(v => v < 0.15), 'depois de realinhar as três voltam a estar novas no dia 0',
     realinhado.lit.map(v => (v*100).toFixed(0)+'%').join(' · '));
  await p.click('#bReset');

  /* ---------------- 7. foco da câmera ---------------- */
  secao('7 · foco em cada corpo');
  await p.evaluate(() => window.__bancada.irPara(20));
  const alvos = await p.$$eval('#alvos button', bs => bs.map(b => b.dataset.alvo));
  ok(JSON.stringify(alvos) === JSON.stringify(['sol','uldun','pequena','grande','estrangeira']),
     'há um botão de foco para o Sol, o planeta e cada lua', alvos.join(', '));
  for (const id of alvos) {
    const r = await p.evaluate(i => {
      document.querySelector(`[data-alvo="${i}"]`).click();
      const t = window.__bancada.posTela(i);
      return { alvo: window.__bancada.cam.alvo, dist: window.__bancada.cam.dist,
               desvio: Math.hypot(t.x - t.W/2, t.y - t.H/2), diag: Math.hypot(t.W, t.H),
               marcado: document.querySelector(`[data-alvo="${i}"]`).classList.contains('on') };
    }, id);
    ok(r.alvo === id && r.desvio < r.diag*0.01 && r.marcado,
       `foco em ${id} centraliza o corpo`, `${r.desvio.toFixed(1)}px do centro · câmera a ${r.dist.toFixed(0)} Mm`);
  }
  const vizinho = await p.evaluate(() => {
    const r = [];
    for (const id of ['pequena','grande','estrangeira']) {
      document.querySelector(`[data-alvo="${id}"]`).click();
      const u = window.__bancada.posTela('uldun');
      r.push({ id, dentro: !!u && u.x > 0 && u.x < u.W && u.y > 0 && u.y < u.H });
    }
    return r;
  });
  ok(vizinho.every(x => x.dentro), 'focar uma lua deixa Uldun no enquadramento, atrás dela',
     vizinho.map(x => x.id + (x.dentro ? ' ok' : ' FORA')).join(' · '));

  /* ---------------- 8. caça aos alinhamentos ---------------- */
  secao('8 · alinhamentos calculados dos parâmetros');
  const lerAlinha = () => p.evaluate(() => {
    const o = {};
    for (const a of window.__bancada.alinhamentos)
      o[a.conjunto + '|' + a.tipo] = { prox: a.achados[0] ? +a.achados[0].t.toFixed(1) : null,
                                       erro: a.achados[0] ? +a.achados[0].desvio.toFixed(1) : null,
                                       cad: a.cadencia ? +a.cadencia.toFixed(1) : null };
    return o;
  });
  await p.evaluate(() => { const b = window.__bancada; b.cena.t = 0; b.cfgAlinha.tol = 20;
                           b.sincronizar(); b.recalcularAlinhamentos(); });
  let al = await lerAlinha();
  ok(al['as três juntas|nova'].prox === 192 && Math.abs(al['as três juntas|nova'].cad - 192) < 1,
     'com tolerância estrita, as três só ficam novas de verdade nos solstícios',
     `próxima no dia ${al['as três juntas|nova'].prox}, a cada ${al['as três juntas|nova'].cad} d`);
  ok(al['as três juntas|cheia'].prox === null, 'as três nunca ficam cheias juntas');
  ok(al['Pequena e Grande|cheia'].prox === null, 'a Pequena e a Grande nunca ficam cheias juntas');
  ok(al['Grande e Estrangeira|cheia'].prox === null, 'a Grande e a Estrangeira nunca ficam cheias juntas');
  ok(Math.abs(al['Pequena e Grande|nova'].cad - 32) < 0.5, 'a Pequena e a Grande ficam novas juntas todo mês',
     `a cada ${al['Pequena e Grande|nova'].cad} d`);

  await p.evaluate(() => { document.querySelector('[data-tol="33"]').click(); });
  al = await lerAlinha();
  ok(Math.abs(al['as três juntas|nova'].cad - 96) < 2,
     'afrouxando para o critério de céu apagado, o encontro vira as quatro soleiras',
     `a cada ${al['as três juntas|nova'].cad} d`);
  const notaTol = await p.evaluate(() => document.getElementById('painelAlinha').textContent);
  ok(/8[.,]\d\s*%/.test(notaTol), 'a nota traduz a tolerância em fração iluminada');

  // mudar a velocidade de uma lua muda o alinhamento: é o pedido central
  const antesCad = al['as três juntas|nova'].cad, antesProx = al['as três juntas|nova'].prox;
  await p.evaluate(() => {
    const num = document.querySelector('[data-campo="grande:orb.T"]');
    num.value = '24'; num.dispatchEvent(new Event('change', { bubbles: true }));
    window.__bancada.recalcularAlinhamentos();
  });
  const al2 = await lerAlinha();
  ok(al2['as três juntas|nova'].cad !== antesCad || al2['as três juntas|nova'].prox !== antesProx,
     'trocar o período da Grande muda quando o alinhamento acontece',
     `antes a cada ${antesCad} d, agora ${al2['as três juntas|nova'].cad} d`);
  ok(Math.abs(al2['Pequena e Grande|nova'].cad - 32) > 0.5, 'e muda também o encontro do par que a envolve',
     `agora ${al2['Pequena e Grande|nova'].cad} d`);

  const horizonte = await p.evaluate(() => {
    const b = window.__bancada;
    b.cfgAlinha.horizonte = 384; b.sincronizar(); b.recalcularAlinhamentos();
    const n = b.alinhamentos.find(a => a.conjunto === 'Pequena e Grande' && a.tipo === 'nova').achados.length;
    b.cfgAlinha.horizonte = 3840; b.sincronizar();
    return n;
  });
  ok(horizonte > 0 && horizonte < 20, 'encurtar o horizonte encurta a lista', horizonte + ' encontros em 1 ano');

  await p.click('#bReset');
  const painelDOM = await p.evaluate(() => ({
    blocos: document.querySelectorAll('#painelAlinha .alinha').length,
    pares: document.querySelectorAll('#painelAlinha .alinha-par').length,
    txt: document.querySelector('#painelAlinha .alinha').textContent,
  }));
  ok(painelDOM.blocos === 4 && painelDOM.pares === 8, 'o painel mostra os quatro conjuntos, nova e cheia',
     `${painelDOM.blocos} blocos, ${painelDOM.pares} linhas`);
  ok(/as três juntas/.test(painelDOM.txt), 'o primeiro bloco é o das três juntas');

  /* ---------------- 9. JSON dos parâmetros ---------------- */
  secao('9 · copiar e aplicar os parâmetros');
  await p.evaluate(() => document.getElementById('bCopiar').click());
  const txtJSON = await p.$eval('#jsonParams', e => e.value);
  let obj = null;
  try { obj = JSON.parse(txtJSON); } catch {}
  ok(obj !== null, 'o botão de copiar produz JSON válido', `${txtJSON.length} caracteres`);
  ok(obj && obj.luas && obj.luas.length === 3 && obj.uldun && obj.camera && obj.cena,
     'o JSON traz cena, câmera, o planeta e as três luas');
  ok(obj && obj.luas[1].orb.a === 404.9 && obj.luas[2].orb.retro === true && obj.luas[0].rot.travada === true,
     'o JSON traz os valores certos, inclusive retrógrada e trava de maré');

  const aplicou = await p.evaluate(() => {
    const o = JSON.parse(document.getElementById('jsonParams').value);
    o.luas[1].orb.a = 500; o.luas[1].orb.e = 0.2; o.luas[1].rot.travada = false;
    o.cena.compressao = 77; o.camera.alvo = 'estrangeira';
    document.getElementById('jsonParams').value = JSON.stringify(o);
    document.getElementById('bAplicar').click();
    const S = window.__bancada.S;
    return { a: S.luas[1].orb.a, e: S.luas[1].orb.e, travada: S.luas[1].rot.travada,
             comp: window.__bancada.cena.compressao, alvo: window.__bancada.cam.alvo,
             aviso: document.getElementById('jsonAviso').textContent,
             campo: parseFloat(document.querySelector('[data-campo="grande:orb.a"]').value) };
  });
  ok(aplicou.a === 500 && aplicou.e === 0.2 && aplicou.travada === false,
     'aplicar o JSON muda os parâmetros da lua', `a=${aplicou.a} e=${aplicou.e}`);
  ok(aplicou.comp === 77 && aplicou.alvo === 'estrangeira', 'aplicar o JSON muda cena e câmera');
  ok(aplicou.campo === 500, 'os controles refletem o JSON aplicado', String(aplicou.campo));
  ok(/aplicados/i.test(aplicou.aviso), 'o aviso confirma', aplicou.aviso);

  const ruim = await p.evaluate(() => {
    document.getElementById('jsonParams').value = '{ isso nao e json';
    document.getElementById('bAplicar').click();
    return { aviso: document.getElementById('jsonAviso').textContent, a: window.__bancada.S.luas[1].orb.a };
  });
  ok(/inválido/i.test(ruim.aviso) && ruim.a === 500, 'JSON quebrado avisa e não estraga o estado', ruim.aviso.slice(0,44));

  await p.click('#bReset');
  const depoisReset = await p.evaluate(() => ({ a: window.__bancada.S.luas[1].orb.a,
    comp: window.__bancada.cena.compressao, alvo: window.__bancada.cam.alvo }));
  ok(depoisReset.a === 404.9 && depoisReset.comp === 50 && depoisReset.alvo === 'sol',
     'restaurar padrões desfaz o JSON aplicado', JSON.stringify(depoisReset));

  /* ---------------- 7. layout estreito ---------------- */
  secao('10 · tela estreita');
  await p.setViewport({ width: 430, height: 860 });
  await p.evaluate(() => { window.dispatchEvent(new Event('resize')); });
  const estreito = await p.evaluate(() => {
    const c = document.getElementById('c').getBoundingClientRect();
    return { larg: Math.round(c.width), alt: Math.round(c.height), rolagemH: document.documentElement.scrollWidth > window.innerWidth + 2 };
  });
  ok(estreito.larg > 300 && estreito.alt > 200, 'o palco continua utilizável em 430px', `${estreito.larg}×${estreito.alt}`);
  ok(!estreito.rolagemH, 'não há rolagem horizontal');
  await p.setViewport({ width: 1440, height: 900 });
  await p.evaluate(() => { window.dispatchEvent(new Event('resize')); });

  /* ---------------- 8. retratos ---------------- */
  secao('11 · retratos');
  await p.evaluate(() => { window.__bancada.cam.alvo='sol'; window.__bancada.cam.dist=7200; window.__bancada.irPara(96); });
  await p.screenshot({ path: `${SHOTS}/luas-sistema.png` });
  await p.evaluate(() => {
    const b = window.__bancada;
    b.cam.alvo='uldun'; b.cam.dist=1500; b.cam.el=12; b.cam.az=-102; b.cena.exagCorpo=10; b.irPara(96);
  });
  await p.screenshot({ path: `${SHOTS}/luas-uldun.png` });
  await p.evaluate(() => { const b = window.__bancada; b.cam.dist=900; b.irPara(48); });
  await p.screenshot({ path: `${SHOTS}/luas-cheia.png` });
  await p.evaluate(() => {
    const b = window.__bancada;
    b.irPara(96); document.querySelector('[data-alvo="grande"]').click();
    document.querySelector('[data-tol="33"]').click();
  });
  await p.screenshot({ path: `${SHOTS}/luas-foco.png` });
  ok(fs.existsSync(`${SHOTS}/luas-sistema.png`), 'retrato do sistema salvo');
  ok(fs.existsSync(`${SHOTS}/luas-uldun.png`), 'retrato de perto de Uldun salvo');

  secao('12 · console limpo');
  ok(erros.length === 0, 'nenhum erro de página', erros.slice(0,3).join(' | '));

  if (!VER) await br.close();

  console.log('\n' + '─'.repeat(52));
  if (falhas.length) {
    console.log(`✘ ${falhas.length} falha(s):`);
    for (const f of falhas) console.log('   · ' + f);
    process.exit(1);
  }
  console.log('✓ bancada das luas: tudo passou.');
}

main().catch(e => { console.error(e); process.exit(1); });
