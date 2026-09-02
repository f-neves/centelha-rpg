// coletar-lances.mjs · junta o oráculo do `resolverGolpe`.
//
// Abre a bancada com `?lances=1`, resolve centenas de golpes de verdade, e grava
// cada um como uma linha de `.jsonl`. Cada linha traz as ENTRADAS do lance, os
// DADOS que caíram e as SAÍDAS que a mesa calculou.
//
// Para que serve: o `test-lance.mjs` roda o `resolverGolpe` puro contra este
// arquivo, lance a lance, e compara todos os campos. A lição do `lib-tempo.mjs`
// é que cinco divergências passaram nos testes unitários dos dois lados e
// nenhuma foi pega por teste; todas foram pegas por comparação contra o
// comportamento real. Este arquivo É esse comportamento real.
//
// COBERTURA POR CONSTRUÇÃO, e não por acaso. A primeira versão deste coletor
// dava três passadas apertando #al-sim, #al-qa e #al-nao, e o comentário dizia
// que as três serviam para cobrir as três saídas do Quase-Acerto. **Não
// serviam.** O botão é a decisão da mesa; o veredito é a conta da régua, e as
// duas são independentes por desenho (o passo 1 as separou de propósito). Os 32
// raspões da primeira fixture vieram do acaso, e com outra semente poderiam ser
// cinco. Agora cada veredito é forçado mexendo na DEFESA do alvo, que é campo
// editável da ficha do lance, de modo que a soma caia acima dela, dentro da
// margem, ou além dela.
//
// O botão continua variando, porque é ele que enche o campo `decisao`, que é o
// que vai permitir medir quantas vezes a mesa contrariou a régua.
//
// Desligado por padrão dos dois lados: a página só acumula com `?lances=1`, e
// este script só roda quando alguém o chama. Não entra no `validate` nem no
// `build`, porque precisa do navegador.
//
//   node scripts/coletar-lances.mjs
//   node scripts/coletar-lances.mjs --saida outro.jsonl --semente 7
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

/**
 * UMA CENA, e o que ela produz.
 *
 * `papel=mestre` é a coleta principal. `papel=jogador` existe por um motivo só:
 * do lado do jogador a view da migração 27 não manda o bloco do inimigo, então
 * `defesaBase` chega **nula** e a folha percorre o caminho em que a régua não
 * tem número. Esse caminho existe no jogo e não tinha um único lance na fixture.
 */
async function coletar(br, url, { papel, pares, veredito, modManual, manobra, botao }) {
  const p = await br.newPage();
  await p.setViewport({ width: 1400, height: 950 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(`${url}/mesa/grid?id=${MESA}&bench=12&cols=24&rows=16&nevoa=0`
    + `&tempo=simultaneo&lances=1&extras=1&semente=${SEMENTE}&papel=${papel}`,
    { waitUntil: 'networkidle0', timeout: 60000 });
  await p.waitForSelector('#gr-tokens .gr-token', { timeout: 30000 });
  await p.waitForFunction(() => typeof (window).__ABRIR_FOLHA === 'function', { timeout: 15000 });

  const ids = await p.evaluate(() =>
    [...document.querySelectorAll('#gr-tokens .gr-token')].map((t) => t.dataset.c));

  let n = 0;
  for (const [a, b] of pares(ids)) {
    const ok = await p.evaluate(async (op) => {
      const num = (sel) => {
        const e = document.querySelector(sel);
        return e ? parseInt(e.value ?? e.textContent ?? '0', 10) || 0 : 0;
      };
      const escrever = (sel, v) => {
        const e = document.querySelector(sel);
        if (!e) return false;
        e.value = String(v);
        e.dispatchEvent(new Event('input', { bubbles: true }));
        e.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      };
      const pr = (window).__ABRIR_FOLHA(op.a, op.b);
      await new Promise((r) => setTimeout(r, 0));
      const dlg = document.getElementById('alvo-dlg');
      if (!dlg?.open) return false;

      // A manobra primeiro: ela muda `penDados`, e com ela o bolo de cada golpe.
      if (op.manobra) {
        const man = document.getElementById('al-manobra');
        const cabe = man && [...man.options].some((o) => o.value === op.manobra && !o.disabled && !o.hidden);
        if (cabe) { man.value = op.manobra; man.dispatchEvent(new Event('change', { bubbles: true })); }
      }
      document.getElementById('al-rolar')?.click();
      document.getElementById('al-dn-rolar')?.click();
      if (op.modManual) escrever('#al-mod', op.modManual);

      // O VEREDITO, FORÇADO PELA DEFESA. `errouPor = defesa − total + 1`, então
      // acerta com `defesa < soma`, raspa com `soma <= defesa <= soma+margem−1`
      // e erra daí para cima. O campo editável é a Defesa BASE, e a efetiva
      // soma ferimento, condições e a escada do P/G/R por cima: o desvio entre
      // as duas é lido da própria tela, em vez de recalculado aqui, senão esta
      // função viraria uma terceira implementação da mesma conta.
      const campoDef = document.getElementById('alf-alvo-defesa');
      if (op.veredito && campoDef) {
        const base = num('#alf-alvo-defesa');
        const efetiva = num('.al-f.lido[data-l="def"] .al-f-v');
        const desvio = efetiva - base;
        const soma = num('#al-total') + (op.modManual || 0);
        const margem = num('#al-qa-margem');
        const alvoDef = op.veredito === 'acerto' ? soma - 2
          : op.veredito === 'raspao' ? soma
            : soma + Math.max(1, margem) + 3;
        escrever('#alf-alvo-defesa', alvoDef - desvio);
      }
      document.querySelector(op.botao)?.click();
      await pr;
      return true;
    }, { a, b, veredito, modManual, manobra, botao });
    if (ok) n++;
  }
  const lances = await p.evaluate(() => (window).__LANCES || []);
  await p.close();
  return { lances, erros, folhas: n };
}

const dev = await subirDev({ config: 'astro.bancada.mjs' });
const br = await puppeteer.launch({ executablePath: NAV, headless: 'new', args: ['--no-sandbox'] });
const todos = [];
const errosTodos = [];
try {
  // OS PARES. `todos` é o produto cartesiano; `alguns` é uma fatia, para as
  // passadas que só precisam de volume suficiente para bater a meta.
  const todosPares = (ids) => ids.flatMap((a) => ids.filter((b) => b !== a).map((b) => [a, b]));
  const alguns = (k) => (ids) => todosPares(ids).filter((_, i) => i % k === 0);

  // O plano de passadas. Cada linha existe para cobrir uma coisa que a bancada
  // padrão não produz, e a coluna `cobre` diz qual, para ninguém apagar uma
  // passada sem saber o que perde.
  const PLANO = [
    { nome: 'acerto · simples', papel: 'mestre', pares: todosPares, veredito: 'acerto', botao: '#al-sim', cobre: 'acertos, ferimento, armadura, ajusteDados' },
    { nome: 'raspão · simples', papel: 'mestre', pares: todosPares, veredito: 'raspao', botao: '#al-qa', cobre: 'raspões por construção' },
    { nome: 'erro · simples', papel: 'mestre', pares: todosPares, veredito: 'erro', botao: '#al-nao', cobre: 'erros por construção' },
    { nome: 'dupla · acerto', papel: 'mestre', pares: alguns(2), veredito: 'acerto', manobra: 'dupla', botao: '#al-sim', cobre: 'golpeIndice > 0' },
    { nome: 'dupla · raspão', papel: 'mestre', pares: alguns(3), veredito: 'raspao', manobra: 'dupla', botao: '#al-qa', cobre: 'golpeIndice > 0 fora do acerto' },
    { nome: 'mod +3', papel: 'mestre', pares: alguns(4), veredito: 'acerto', modManual: 3, botao: '#al-sim', cobre: 'modManual positivo' },
    { nome: 'mod −4', papel: 'mestre', pares: alguns(4), veredito: 'erro', modManual: -4, botao: '#al-nao', cobre: 'modManual negativo' },
    { nome: 'jogador', papel: 'jogador', pares: alguns(8), botao: '#al-sim', cobre: 'defesaBase nula' },
  ];

  for (const passo of PLANO) {
    const r = await coletar(br, dev.url, passo);
    todos.push(...r.lances);
    errosTodos.push(...r.erros);
    console.log(`  · ${passo.nome.padEnd(18)} ${String(r.folhas).padStart(4)} folhas`
      + ` · ${String(r.lances.length).padStart(4)} lances · cobre ${passo.cobre}`);
  }
} finally {
  await br.close();
  await dev.parar();
}

if (errosTodos.length) console.log(`  ! ${errosTodos.length} erro(s) de página: ${errosTodos[0]}`);
fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
fs.writeFileSync(SAIDA, todos.map((l) => JSON.stringify(l)).join('\n') + '\n', 'utf8');

// A COBERTURA, contada aqui e conferida de novo no teste. Contar nos dois
// lugares é de propósito: aqui serve para o coletor falhar cedo quando uma
// passada deixa de produzir o que ela existe para produzir.
const conta = (f) => todos.filter(f).length;
const METAS = [
  ['golpeIndice > 0, com penDados >= 2', conta((l) => l.entrada.golpeIndice > 0 && l.entrada.atacante.penDados.length >= 2), 60],
  ['modManual != 0', conta((l) => l.entrada.modManual !== 0), 40],
  ['modManual positivo', conta((l) => l.entrada.modManual > 0), 1],
  ['modManual negativo', conta((l) => l.entrada.modManual < 0), 1],
  ['ferimento != 0', conta((l) => l.entrada.alvo.ferimento !== 0), 60],
  ['ajusteDados != 0', conta((l) => l.entrada.atacante.ajusteDados !== 0), 40],
  ['qaArmaduraBonus != 0', conta((l) => l.entrada.alvo.qaArmaduraBonus !== 0), 40],
  ['qaArmaduraReducao != 0', conta((l) => l.entrada.alvo.qaArmaduraReducao !== 0), 40],
  ['defesaBase nula', conta((l) => l.entrada.alvo.defesaBase == null), 5],
  ['veredito acerto', conta((l) => l.saida.veredito === 'acerto'), 60],
  ['veredito raspao', conta((l) => l.saida.veredito === 'raspao'), 60],
  ['veredito erro', conta((l) => l.saida.veredito === 'erro'), 60],
];
const kb = (fs.statSync(SAIDA).size / 1024).toFixed(0);
console.log(`\n✓ ${todos.length} lances em ${path.relative(RAIZ, SAIDA)} (${kb} KB)\n`);
let faltou = 0;
for (const [nome, tem, meta] of METAS) {
  const bom = tem >= meta;
  if (!bom) faltou++;
  console.log(`  ${bom ? '✓' : '✗'} ${nome.padEnd(36)} ${String(tem).padStart(4)} (meta ${meta})`);
}
if (faltou) { console.log(`\n✗ ${faltou} meta(s) de cobertura não batidas`); process.exit(1); }
console.log('\n✓ todas as metas de cobertura batidas');
