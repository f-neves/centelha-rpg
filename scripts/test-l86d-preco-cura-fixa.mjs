// test-l86d-preco-cura-fixa.mjs · o preço que a nota promete passa a ser cobrado.
//
// O DEFEITO, registrado no L86b e medido em 13/09/2026: três parâmetros do
// catálogo carregam na prosa "2 de Mana por nível, como toda cura", e o motor
// não cobrava nada em nenhum dos três. A causa é a forma do `fixo`:
// `parametrosAjustaveis` filtra `p.tipo !== 'fixo'`, e o `custoDe` nunca vê o
// parâmetro. Um preço escrito só em prosa é um preço que não existe.
//
// A DECISÃO DO HUMANO, depois de ver a medida e NÃO antes dela: cobrar onde a
// nota promete, e só ali. A opção "fixo passa a custar" caiu quando o número
// apareceu · 114 dos 140 Efeitos têm algum parâmetro fixo, e os mais comuns são
// `Alcance` (58), `Dificuldade` (46) e `Jogada` (26), que ninguém compra. Não há
// resposta para "quanto custa uma Dificuldade", e inventá-la para 114 Efeitos
// seria desenho de regra novo disfarçado de conserto.
//
// O CAMPO É UM NÚMERO, não um booleano, e isso é o miolo do desenho: o "2" da
// frase passa a morar no DADO. Com um booleano, o preço continuaria escrito só
// na prosa, e as duas especificações se separariam na primeira mudança · o
// mesmo formato que `pontos` e `porNivel` já fecharam para o VALOR da cura.
//
// ESTE ARQUIVO É TODO PROVA DE COMPORTAMENTO: `custoDe` mora no `artes-grid.ts`
// e é importável. A forma das asserções é por DELTA (o mesmo Efeito com e sem o
// campo), que isola a mudança sem depender do custo base de nenhuma Arte.
//
// Roda no `npm run validate`: falhar aqui aborta o build.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `l86d-preco-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/artes-grid.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'sim' };
const A = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };
const eq = (a, b, msg) => ok(a === b, `${msg} (esperado ${JSON.stringify(b)}, achou ${JSON.stringify(a)})`);

const EF = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/efeitos.json'), 'utf8'));
const lista = Array.isArray(EF) ? EF : (EF.efeitos || Object.values(EF).find(Array.isArray));
const pega = (id) => lista.find((x) => x.id === id);
const ARTE = { id: 'x', nome: 'Arte de teste' };
// O mesmo Efeito SEM o campo: é o contra-exemplo de cada asserção de delta.
const semCampo = (ef) => ({
  ...ef,
  parametros: (ef.parametros || []).map((p) => { const q = { ...p }; delete q.custaMana; return q; }),
});
const custo = (ef, nivel) => A.custoDe(ef, ARTE, nivel, {}, 0).total;
const delta = (ef, nivel) => custo(ef, nivel) - custo(semCampo(ef), nivel);

// ------------------------------------------- 1 · o preço passou a ser cobrado
for (const id of ['acelerar-a-cura', 'maos-sobre-a-multidao', 'dreno']) {
  const ef = pega(id);
  ok(!!ef, `o catálogo tem \`${id}\``);
  eq(delta(ef, 3), 6, `\`${id}\` com Arte de nível 3 passa a custar 6 de Mana a mais (2 por nível, o que a nota promete)`);
  eq(delta(ef, 1), 2, `\`${id}\` com Arte de nível 1 custa 2 a mais, e a conta é linear no nível`);
}

// ---------------------------------- 2 · e NÃO vazou para os outros 111 Efeitos
//
// A asserção que separa esta rodada da que o humano recusou. `Alcance` fixo é o
// parâmetro mais comum do catálogo (58 Efeitos): se ele começasse a custar, a
// conta de metade das Artes mudaria sem ninguém ter decidido isso.
const comAlcanceFixo = lista.filter((x) => (x.parametros || [])
  .some((p) => p.tipo === 'fixo' && p.nome === 'Alcance' && !p.custaMana));
ok(comAlcanceFixo.length > 20,
  `há muitos Efeitos com Alcance fixo sem preço (achei ${comAlcanceFixo.length}): é a população que esta rodada NÃO pode tocar`);
for (const ef of comAlcanceFixo.slice(0, 12)) {
  eq(delta(ef, 3), 0, `\`${ef.id}\` (Alcance fixo, sem \`custaMana\`) continua custando exatamente o mesmo`);
}

// --------------------------------------------- 3 · o dado, e o teto do campo
const comCampo = [];
for (const x of lista) {
  for (const p of (x.parametros || [])) if (p.custaMana != null) comCampo.push({ id: x.id, p });
}
eq(comCampo.length, 3, 'exatamente 3 parâmetros no catálogo inteiro cobram Mana por este campo');
ok(comCampo.every((c) => c.p.nome === 'Cura'), 'e os três são `Cura` (é onde a nota prometia)');
ok(comCampo.every((c) => c.p.custaMana === 2), 'e os três cobram 2, que é o número que a prosa já dizia');
// A GUARDA QUE IMPEDE COBRANÇA DOBRADA: um parâmetro AJUSTÁVEL com `custaMana`
// seria cobrado pelos dois laços (o das escolhas e o dos fixos).
ok(comCampo.every((c) => c.p.tipo === 'fixo'),
  'e todos são `fixo`: um ajustável com este campo seria cobrado DUAS vezes, pelos dois laços');

// --------------------------------------------------- 4 · os cantos da conta
const acelerar = pega('acelerar-a-cura');
eq(delta(acelerar, 0), 0, 'Arte de nível 0 não cobra nada: a conta não inventa preço onde não há nível');
ok(custo(acelerar, 2) > custo(acelerar, 1),
  'e o custo cresce com o nível, que é a direção certa: conjurar mais forte custa mais');

// A cura em si NÃO mudou: esta rodada mexeu no preço, e nada mais. O par que
// impede a asserção de passar pelo motivo errado.
eq(A.curaDoEfeito(acelerar, 3), 3, 'e o VALOR da cura continua o mesmo (esta rodada mexeu no preço, não no efeito)');

if (falhas.length) {
  console.error(`✗ L86d · o preço da cura fixa · ${falhas.length} falha(s):`);
  for (const f of falhas) console.error(`  - ${f}`);
  process.exit(1);
}
console.log('✓ L86d · os 3 parâmetros cuja nota promete Mana passaram a cobrar (2 por nível da Arte), '
  + 'e os outros 111 Efeitos com parâmetro fixo não mudaram de preço');
