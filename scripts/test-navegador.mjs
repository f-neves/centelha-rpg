// test-navegador.mjs · a abertura do navegador dos smokes espera mais e tenta de novo (scripts/navegador.mjs).
// Não abre navegador nenhum: um puppeteer falso conta as chamadas e falha nas primeiras.
//   node scripts/test-navegador.mjs
import { abrirNavegador } from './navegador.mjs';

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const falso = (falhar) => {
  const chamadas = [];
  return { chamadas, launch: async (o) => { chamadas.push(o); if (chamadas.length <= falhar) throw new Error('Timed out after 30000 ms while waiting for the WS endpoint URL to appear in stdout!'); return { aberto: true }; } };
};
const rapido = { pausa: 1 };

let p = falso(0);
let br = await abrirNavegador(p, { headless: 'new', args: ['--no-sandbox'] }, rapido);
ok(br.aberto && p.chamadas.length === 1, 'abre na primeira quando o navegador sobe');
ok(p.chamadas[0].timeout === 90000, 'espera 90 s, e não os 30 s do puppeteer');
ok(p.chamadas[0].headless === 'new' && p.chamadas[0].args[0] === '--no-sandbox', 'repassa as opções do teste');

p = falso(2);
br = await abrirNavegador(p, { headless: 'new' }, rapido).catch(() => null);
ok(br?.aberto && p.chamadas.length === 3, 'duas aberturas que estouram o tempo e a terceira abre');

p = falso(3);
let erro = null;
try { await abrirNavegador(p, {}, rapido); } catch (e) { erro = e; }
ok(erro && /WS endpoint/.test(erro.message) && p.chamadas.length === 3, 'três falhas: desiste e devolve o erro da última');

p = falso(0);
await abrirNavegador(p, { timeout: 5000 }, rapido);
ok(p.chamadas[0].timeout === 5000, 'o teste que já pede uma espera fica com a dele');

if (falhas.length) { console.error(`\n✘ navegador: ${falhas.length} falha(s)`); process.exit(1); }
console.log('\n✓ navegador: a abertura espera 90 s e tenta até 3 vezes');
