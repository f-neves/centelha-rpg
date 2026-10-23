// test-defesa-vestida.mjs · a Defesa com e sem o equipamento da criatura (D-206, 23/10/2026).
//
// O texto do autor: "mostra as duas, mas normalmente se escolhe a maior. Essa é uma escolha do
// mestre, não nossa. Mas as Defesas são influenciadas pelos equipamentos da criatura." E no
// mesmo adendo: a escolha do Mestre não vai ao banco.
//
// O que isto guarda, em quatro partes:
//   1. a conta do livro (`vestidaDoLivro`) e a leitura da frase da ficha (`vestidaDaFicha`);
//   2. o que saiu publicado: o campeão esquelético e o soldado veterano com as duas Defesas,
//      na fonte, no monsters.json e no monsters-mesa.json;
//   3. a mesa: sem escolha vale a maior Defesa; a troca do Mestre vira o conjunto inteiro
//      (Defesa, Absorção, nível); o ajuste por instância (`dados.defesa`) vence por cima; e a
//      escolha não entra nos `dados` do combatente, que são o que vai ao Supabase;
//   4. a escolha mora no `localStorage`, numa chave só, e sem armazenamento a troca ainda vale.
//
//   node scripts/test-defesa-vestida.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { vestidaDoLivro, vestidaDaFicha } from './lib-ficha-v3.mjs';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const J = (x) => JSON.stringify(x);

const ARM = Object.fromEntries(ler('src/data/armaduras.json').map((a) => [a.id, a.armadura]));
const ESC = Object.fromEntries(ler('src/data/escudos.json').map((e) => [e.id, e.escudo]));

console.log('· 1. a conta do livro e a frase da ficha');
// o campeão esquelético: Esquiva 10, Bloqueio 14 (sem a arma), Absorção 5/2/2, peitoral e heater, espada +1
const camp = vestidaDoLivro({ esquiva: 10, bloqueio: 14, absorcao: { impacto: 5, corte: 2, perfuracao: 2 }, couracaNivel: 0 }, ARM.peitoral, ESC.heater, 1);
ok(J(camp) === J({ esquiva: 7, bloqueio: 16, defesa: 17, contraTiro: 16, absorcao: { impacto: 8, corte: 5, perfuracao: 3 }, nivel: 1, penalidade: 1 }),
  `campeão: a Penalidade do peitoral (1) e a do heater (2) saem da Esquiva, o heater soma 3 no Bloqueio, a espada +1 na Defesa: ${J(camp)}`);
// o soldado veterano: Esquiva 14, Bloqueio 12, Absorção 3/0/0, cota de malha, espada +1
const sold = vestidaDoLivro({ esquiva: 14, bloqueio: 12, absorcao: { impacto: 3, corte: 0, perfuracao: 0 }, couracaNivel: 0 }, ARM.malha, null, 1);
ok(sold.defesa === 12 && sold.esquiva === 12 && sold.bloqueio === 10 && sold.contraTiro === 12 && J(sold.absorcao) === J({ impacto: 4, corte: 6, perfuracao: 1 }),
  `soldado: a malha tira 2 da Esquiva e do Bloqueio; sem escudo, contra tiro é a Esquiva: ${J(sold)}`);
const frase = '| Absorção | Impacto **5** (Vigor 3 + Centelha 2); Corte **2** e Perfuração **2** (só a Centelha); Couraça **nível 0**. Com o peitoral e o escudo heater: Esquiva **7**, Bloqueio **16**; Impacto **8**, Corte **5**, Perfuração **3** (Nível N1); Penalidade −1; contra tiro **16** | x |';
const lida = vestidaDaFicha(frase);
ok(J(lida) === J({ esquiva: 7, bloqueio: 16, absorcao: { impacto: 8, corte: 5, perfuracao: 3 }, nivel: 1, penalidade: 1, contraTiro: 16 }), `a frase do campeão: ${J(lida)}`);
ok(vestidaDaFicha('| Absorção | Impacto **3**; Corte **0** e Perfuração **0**; Couraça **nível 0** |') === null, 'sem a frase, null');
let erro = null; try { vestidaDaFicha('Com a cota de malha: Esquiva **12**, Bloqueio 10 e mais nada'); } catch (e) { erro = e.message; }
ok(/fora do formato/.test(erro || ''), `a frase que começa e não fecha o formato para: ${erro}`);

console.log('· 2. o que saiu publicado');
for (const [id, sem, com] of [['campeao-esqueletico', 15, 17], ['soldado-veterano', 14, 12]]) {
  const f = ler(`src/data/bestiario/${id}.json`);
  ok(f.v3?.defesa === sem && f.v3?.vestida?.defesa === com, `${id}: a fonte traz as duas (sem ${f.v3?.defesa}, com ${f.v3?.vestida?.defesa})`);
  const m = ler('src/data/monsters.json').find((x) => x.id === id);
  ok(m?.combate?.defesa === sem && m?.combate?.vestida?.defesa === com, `${id}: o monsters.json (card) traz as duas`);
  const mm = ler('src/data/monsters-mesa.json').find((x) => x.id === id);
  ok(mm?.combate?.defesa === sem && mm?.combate?.vestida?.defesa === com, `${id}: o monsters-mesa.json (mesa) traz as duas`);
}
const vestidas = ler('src/data/monsters.json').filter((m) => m.combate?.vestida).map((m) => m.id).sort();
ok(J(vestidas) === J(['campeao-esqueletico', 'soldado-veterano']), `só quem veste armadura ou escudo tem a vestida: ${vestidas.join(', ')}`);

// O pacote da mesa: o `mesa-bestiario` arrasta o cliente do Supabase, que lê `import.meta.env`
// no topo; fora do Astro ele aponta para um objeto vazio, e nada aqui chama o banco (o mesmo
// arranjo do test-acaso.mjs).
const saida = path.join(os.tmpdir(), `defesa-vestida-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { resumoDe, MON, cardCriaturaHTML } from './src/lib/mesa-bestiario';
      export { escolhaDe, escolhaPadrao, combateNaEscolha, alternarVestida } from './src/lib/defesa-vestida';
    `,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
// um localStorage de mentira, para ver o que se grava e onde
const GUARDADO = new Map();
globalThis.localStorage = { getItem: (k) => (GUARDADO.has(k) ? GUARDADO.get(k) : null), setItem: (k, v) => GUARDADO.set(k, String(v)), removeItem: (k) => GUARDADO.delete(k) };
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

console.log('· 3. a mesa');
const peca = (monstro_id, dados = {}) => ({ id: 'c-' + monstro_id, tipo: 'criatura', monstro_id, dados });
const resumo = (c) => { const r = M.resumoDe(c); return `${r.defesa} ${r.soak.impacto}/${r.soak.corte}/${r.soak.perfuracao} N${r.resistPerf}`; };
ok(resumo(peca('campeao-esqueletico')) === '17 8/5/3 N1', `campeão, sem escolha: a maior Defesa, e o conjunto vestido inteiro (${resumo(peca('campeao-esqueletico'))})`);
ok(resumo(peca('soldado-veterano')) === '14 3/0/0 N0', `soldado, sem escolha: a maior Defesa é a sem a malha (${resumo(peca('soldado-veterano'))})`);
const dadosAntes = { arma: 'Espada longa' };
const c1 = peca('campeao-esqueletico', dadosAntes);
const antesJ = J(c1);
M.alternarVestida('campeao-esqueletico', M.MON['campeao-esqueletico'].combate);
ok(resumo(c1) === '15 5/2/2 N0', `o Mestre troca: o campeão sem o equipamento (${resumo(c1)})`);
ok(J(c1) === antesJ, 'a troca não entra nos `dados` do combatente (o que vai ao Supabase)');
ok(resumo(peca('campeao-esqueletico', { defesa: 20 })).startsWith('20 '), 'o ajuste por instância (`dados.defesa`) vence por cima da escolha');
ok(resumo(peca('soldado-veterano')) === '14 3/0/0 N0', 'a troca de uma criatura não mexe na outra');
M.alternarVestida('soldado-veterano', M.MON['soldado-veterano'].combate);
ok(resumo(peca('soldado-veterano')) === '12 4/6/1 N1', `o soldado com a malha (${resumo(peca('soldado-veterano'))})`);
ok(resumo(peca('lobo')) === resumo(peca('lobo')) && M.escolhaDe('lobo', M.MON.lobo?.combate) === null && M.alternarVestida('lobo', M.MON.lobo?.combate) === null, 'criatura sem equipamento: sem escolha, e a troca não faz nada');
const html = M.cardCriaturaHTML(M.MON['campeao-esqueletico']);
ok(/<b>15<\/b> · 17 <small>c\/ equip\.<\/small>/.test(html) && /data-vestida="campeao-esqueletico"/.test(html) && /A mesa usa: sem o equipamento/.test(html), 'o card da mesa mostra as duas, a da mesa em negrito, e o botão de trocar');

console.log('· 4. onde a escolha mora');
ok(J([...GUARDADO.keys()]) === J(['centelha:mesa:vestida']), `uma chave só no localStorage: ${[...GUARDADO.keys()].join(', ')}`);
ok(GUARDADO.get('centelha:mesa:vestida') === J({ 'campeao-esqueletico': 'sem', 'soldado-veterano': 'com' }), `com o que difere do padrão: ${GUARDADO.get('centelha:mesa:vestida')}`);
M.alternarVestida('campeao-esqueletico', M.MON['campeao-esqueletico'].combate);
ok(GUARDADO.get('centelha:mesa:vestida') === J({ 'soldado-veterano': 'com' }), 'voltar ao padrão apaga a entrada');
globalThis.localStorage = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('bloqueado'); } };
M.alternarVestida('campeao-esqueletico', M.MON['campeao-esqueletico'].combate);
ok(resumo(peca('campeao-esqueletico')) === '15 5/2/2 N0', 'sem armazenamento (aba anônima), a troca vale até recarregar, e nada quebra');

if (falhas.length) { console.error(`\n✘ defesa-vestida: ${falhas.length} falha(s)`); process.exit(1); }
console.log('\n✓ defesa-vestida: a conta do livro bate com a ficha, card e mesa trazem as duas, sem escolha vale a maior, e a escolha do Mestre fica no aparelho');
