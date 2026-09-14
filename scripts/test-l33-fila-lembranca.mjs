// test-l33-fila-lembranca.mjs · a lembrança não entra na fila da aba Combate.
//
// O PRÉ-REQUISITO DA MIGRAÇÃO 33, decidido pelo humano em 13/09/2026. A 33 faz
// a `combate_visao` mandar ao jogador o que ele já viu e agora está no escuro,
// com `tick` e `iniciativa` NULOS de propósito (o que é do instante cala na
// memória). A aba Combate não conhecia a coluna, e o estrago não era cosmético:
//
//   `ordemDaFila` (src/lib/combate-tempo.ts) ordena por `(a.tick ?? 0)`, então a
//   linha de lembrança ia para a FRENTE da fila e virava o `atual` de `pintar`.
//   Daí saía tudo de uma vez: o relógio exibido congelava em Tick 0
//   (`atual?.tick ?? 0`), a tira a marcava com `vez`/`age`, e o painel do turno
//   era montado em cima de uma memória.
//
// O conserto segue o precedente que o GRID já tinha (`naFila`, em grid.astro):
// peça de memória não tem vez. Ela sai da fila e ganha seção própria, porque
// nesta aba não há mapa onde ficar, e tirá-la inteira devolveria ao jogador a
// amnésia que a 33 existe para não causar.
//
// ESTE ARQUIVO TEM DUAS METADES, E ELAS NÃO VALEM O MESMO:
//
//   1. PROVA DE COMPORTAMENTO (seção 1). `ordemDaFila` é importável, então o
//      PERIGO é provado de verdade: linha de tick nulo vai para a frente. Esta
//      asserção é o motivo de o filtro existir, e ela fica vermelha se alguém
//      "consertar" o comparador em vez da tela, que é conserto no lugar errado
//      (o comparador é compartilhado com o Grid, que já trata o caso fora dele).
//
//   2. CONFERÊNCIA FRACA, POR TEXTO (seções 2 e 3), dita explicitamente aqui e
//      em cada mensagem: `pintar` e `cardCombatente` moram no front-matter de
//      `combate.astro`, que o esbuild não importa como módulo de Node. O que se
//      confere é o TEXTO do arquivo, não comportamento chamado: prova que o
//      código está escrito do jeito certo, não que ele RODA certo. A busca é
//      sempre por CÓDIGO e nunca por menção em comentário, senão um comentário
//      sobrevivente faria a conferência passar sem nada por trás.
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `l33-fila-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/combate-tempo.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'sim' };
const T = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };

// ------------------------------------------- 1 · O PERIGO, provado de verdade
//
// Não se prova aqui que a tela está certa: prova-se que o comparador promove
// quem tem tick nulo. É o fato que obriga o filtro a existir, e mantê-lo
// asseverado impede que alguém mude `ordemDaFila` achando que conserta a tela.
const lembranca = { tick: null, iniciativa: null, nome: 'goblin lembrado', chegada: 'a' };
const naCena = { tick: 3, iniciativa: 7, nome: 'goblin de verdade', chegada: 'b' };
ok(T.ordemDaFila(lembranca, naCena) < 0,
  '`ordemDaFila` PROMOVE quem tem tick nulo (é o `?? 0`): por isso a lembrança não pode chegar até ele');
ok(T.ordemDaFila(naCena, lembranca) > 0, 'e a direção contrária concorda, que é o par da asserção acima');

// E o caso que separa "tick nulo" de "tick zero de verdade": quem está mesmo no
// Tick 0 continua na frente, e tem de continuar. O filtro da tela é sobre
// LEMBRANÇA, não sobre o número zero, e confundir os dois tiraria da fila quem
// tem direito a estar nela.
const tickZero = { tick: 0, iniciativa: 2, nome: 'quem age agora', chegada: 'c' };
ok(T.ordemDaFila(tickZero, naCena) < 0,
  'quem está no Tick 0 DE VERDADE continua na frente: o corte da tela é por `lembranca`, nunca pelo número');

// ------------------------------- 2 · [conferência fraca, por texto] o filtro
const txt = fs.readFileSync(path.join(ROOT, 'src/pages/mesa/combate.astro'), 'utf8');

ok(/const lembradas = visiveis\(\)\.filter\(\(c\) => c\.lembranca\);/.test(txt),
  '[conferência fraca, por texto] `pintar` separa as lembranças num balde próprio (no CÓDIGO)');
ok(/const naCena = visiveis\(\)\.filter\(\(c\) => !c\.lembranca\);/.test(txt),
  '[conferência fraca, por texto] e separa o que está na cena de verdade (no CÓDIGO)');
ok(/const emCampo = naCena\.filter\(/.test(txt),
  '[conferência fraca, por texto] `emCampo` sai de `naCena`, e não de `visiveis()`: é o que impede a lembrança de virar o `atual`');
ok(/const fora = naCena\.filter\(/.test(txt),
  '[conferência fraca, por texto] `fora` também sai de `naCena`');
ok(!/const emCampo = visiveis\(\)\.filter\(/.test(txt),
  '[conferência fraca, por texto] e NÃO sobrou nenhum `emCampo` saindo direto de `visiveis()` (a forma de antes)');

// A memória não pode simplesmente sumir: a 33 existe para o jogador NÃO perder
// o resultado da própria ação. Se alguém tirar a seção, esta asserção cai.
ok(/cmb-lembr-wrap/.test(txt) && /el\('cmb-lembr'\)\.innerHTML = lembradas\.map/.test(txt),
  '[conferência fraca, por texto] as lembranças continuam DESENHADAS, em seção própria (não foram só apagadas)');

// ---------------------- 3 · [conferência fraca, por texto] o card não mente
//
// `${c.tick}` com tick nulo desenha a palavra "null", e `ini ${c.iniciativa ?? 0}`
// desenha "ini 0": um número inventado sobre uma peça que o jogador não vê. Os
// dois têm de estar atrás da guarda de `lembr`.
ok(/: `<span class="cbt-tick">\$\{c\.tick\}/.test(txt),
  '[conferência fraca, por texto] o Tick do card virou o ELSE de um ternário (não desenha mais "null" na lembrança)');
ok(/`ini \$\{c\.iniciativa \?\? 0\}`/.test(txt),
  '[conferência fraca, por texto] e o "ini N" também está dentro do ternário, não solto na linha do meta');
ok(/const lembr = !!c\.lembranca;/.test(txt),
  '[conferência fraca, por texto] `cardCombatente` lê a coluna (no CÓDIGO, não só no comentário)');

if (falhas.length) {
  console.error(`✗ L33 · a lembrança na fila da aba Combate · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('✓ L33 · a lembrança não entra na fila da aba Combate, continua desenhada em seção própria, '
  + 'e o card não inventa Tick nem iniciativa (1 prova de comportamento, 9 conferências por texto)');
