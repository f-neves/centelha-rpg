// test-combate-tempo.mjs — a régua dos dois sistemas, travada.
//
// `src/lib/combate-tempo.ts` é o que a mesa usa para desenhar o tempo: em que
// Tick o golpe sai, em que fase alguém está, quanto de Defesa a fase custa. O
// motor da bancada (`scripts/lib-tempo.mjs`) mede a MESMA régua, mas por outro
// caminho e para outro fim, e nada obrigava os dois a concordarem.
//
// Aqui obriga. O teste confere três coisas:
//
//   1. a anatomia (P/G/R) bate com a tabela do catálogo da bancada, arma a arma;
//   2. a escada devolve os números da §14.11 em cada fase;
//   3. o sistema normal degenera como prometido: Preparo 0, Golpe no Tick da
//      declaração, o resto Recuperação, e a dupla no mesmo ciclo em toda classe.
//
// Entra no `npm run validate`: é barato e trava o contrato.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const tmp = [];
async function carregar(rel) {
  const saida = path.join(os.tmpdir(), `${path.basename(rel, '.ts')}-${process.pid}.mjs`);
  await build({
    entryPoints: [path.join(ROOT, rel)],
    outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error',
  });
  tmp.push(saida);
  return import(pathToFileURL(saida).href);
}

const T = await carregar('src/lib/combate-tempo.ts');
const regras = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const armas = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/armas.json'), 'utf8'));

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m} — esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);

// ------------------------------------------------- 0. o bloco existe e fecha
ok(regras.combate, 'regras.json não tem o bloco `combate`');
eq(regras.combate.sistemas.map((s) => s.id), ['normal', 'pgr'], 'os dois sistemas');
eq(regras.combate.marcacao.modos.map((m) => m.id), ['fita', 'numeros'], 'os dois modos de marcação');
for (const c of ['leve', 'media', 'haste', 'pesada', 'distancia', 'arremesso']) {
  ok(regras.combate.pgr.preparo[c], `a régua P/G/R não cobre a classe ${c}`);
  ok(regras.combate.rajada.teto[c] != null || c === 'distancia' || c === 'arremesso',
    `o teto da rajada não cobre a classe ${c}`);
}

// ------------------------------------------------------------ 1. a anatomia
// P/G/R por classe, com a Velocidade que o catálogo dá. É a tabela da §14.3.
const ESPERADO = {
  'adaga':             [0, 1, 4],  // leve, 5t
  'espada-curta':      [0, 1, 4],
  'desarmado':         [0, 1, 4],
  'espada-longa':      [1, 1, 4],  // média, 6t
  'machado':           [1, 1, 4],
  'lanca':             [2, 1, 3],  // haste, 6t
  'alabarda':          [2, 1, 3],
  'montante':          [2, 1, 4],  // pesada, 7t
  'martelo-de-guerra': [2, 1, 4],
  'arco-longo':        [5, 1, 0],  // distância: P = Velocidade − 1
  'besta-grande':      [6, 1, 0],
  'azagaia':           [3, 1, 1],  // arremesso: P = Velocidade − 2
  'dardos':            [2, 1, 1],
};
for (const [id, esp] of Object.entries(ESPERADO)) {
  const w = armas.find((x) => x.id === id);
  ok(w, `arma ${id} sumiu do catálogo`);
  if (!w) continue;
  const a = T.anatomia({ classe: w.classe, velocidade: w.ticks, sistema: 'pgr' });
  eq([a.preparo, a.golpes, a.recuperacao], esp, `P/G/R de ${id}`);
  eq(a.ciclo, w.ticks, `o ciclo de ${id} tem que ser a Velocidade dela`);
  eq(a.preparo + a.golpes + a.recuperacao, a.ciclo, `P+G+R de ${id} não fecha o ciclo`);
}

// toda arma do catálogo fecha o ciclo, não só as listadas acima
for (const w of armas) {
  const a = T.anatomia({ classe: w.classe, velocidade: w.ticks, sistema: 'pgr' });
  eq(a.preparo + a.golpes + a.recuperacao, w.ticks, `P+G+R de ${w.id} não fecha o ciclo`);
  ok(a.preparo < w.ticks, `o Preparo de ${w.id} come o ciclo inteiro`);
}

// ------------------------------------------------- 2. a rajada e a dupla
// §14.12: a rajada é +2 de Velocidade e −1d6 acumulativo por golpe extra.
const raj = T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr', manobra: 'rajada', golpes: 3 });
eq([raj.preparo, raj.golpes, raj.recuperacao, raj.ciclo], [0, 3, 6, 9], 'rajada de 3 com arma leve');
eq(raj.penDados, [0, -1, -2], 'os dados da rajada de 3');
eq(raj.offs, [0, 1, 2], 'a agenda da rajada: Golpes em Ticks seguidos');
const rajTeto = T.anatomia({ classe: 'pesada', velocidade: 7, sistema: 'pgr', manobra: 'rajada', golpes: 3 });
eq(rajTeto.golpes, 2, 'a arma pesada para em 2 golpes');
ok(rajTeto.aviso, 'estourar o teto tem que avisar');
const rajArco = T.anatomia({ classe: 'distancia', velocidade: 6, sistema: 'pgr', manobra: 'rajada', golpes: 2 });
eq(rajArco.golpes, 1, 'a rajada é só corpo a corpo');

// §14.13: a dupla dá um Tick de Golpe por mão, −1d6 nas duas.
const dupLeve = T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr', manobra: 'dupla' });
eq([dupLeve.preparo, dupLeve.golpes, dupLeve.recuperacao, dupLeve.ciclo], [0, 2, 3, 5], 'dupla de leves: o ciclo não muda');
eq(dupLeve.penDados, [-1, -1], 'os dados da dupla');
const dupMedia = T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr', manobra: 'dupla' });
eq(dupMedia.ciclo, 7, 'dupla com média no P/G/R: ciclo +1');
eq(T.anatomia({ classe: 'media', velocidade: 6, sistema: 'normal', manobra: 'dupla' }).ciclo, 6,
  'dupla com média no normal: mesma Velocidade (§15.2, a única regra que calibra por sistema)');

// ------------------------------------------------------------ 3. a escada
// §14.11: Preparo −2 · Golpe −4 · Recuperação −2 por golpe dado, mais a Pressão.
{
  const a = T.declarar(10, T.anatomia({ classe: 'media', velocidade: 6, sistema: 'pgr' }));
  eq([a.golpes, a.livre], [[11], 16], 'a agenda da espada longa declarada no Tick 10');
  eq(T.faseEm(a, 10), 'preparo', 'Tick 10 é Preparo');
  eq(T.faseEm(a, 11), 'golpe', 'Tick 11 é Golpe');
  eq(T.faseEm(a, 12), 'recuperacao', 'Tick 12 é Recuperação');
  eq(T.faseEm(a, 16), 'livre', 'Tick 16 já é livre');
  eq(T.defesaPerdida(a, 10).total, -2, 'a escada no Preparo');
  eq(T.defesaPerdida(a, 11).total, -4, 'a escada no Golpe');
  eq(T.defesaPerdida(a, 12).total, -2, 'a escada na Recuperação de um golpe');
  eq(T.defesaPerdida(a, 16).total, 0, 'livre não custa nada');
  eq(T.defesaPerdida(a, 11, { segura: true }).total, -2, 'segurar a segunda arma sem golpear alivia o Golpe');
  eq(T.defesaPerdida({ ...a, pressao: 3 }, 12).total, -8, 'a Pressão soma: −2 na Recuperação, −6 de três ataques');
  eq(T.podeSerInterrompido(a, 10), true, 'o Preparo é interrompível');
  eq(T.podeSerInterrompido(a, 11), false, 'o Golpe não é');
  eq(T.podeAgirForaDeHora(a, 11).pode, false, 'no Golpe não se reage');
  eq(T.podeAgirForaDeHora(a, 12).pode, true, 'na Recuperação se reage, pagando');
  eq(T.custoDeReagir(a, 12, 5), { resta: 4, total: 9 }, 'o custo de reagir na Recuperação');
}
// a Recuperação da dupla conta os DOIS golpes
{
  const a = T.declarar(0, T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr', manobra: 'dupla' }));
  eq(a.golpes, [0, 1], 'a dupla golpeia em dois Ticks seguidos');
  eq(T.defesaPerdida(a, 0).total, -4, 'o primeiro Golpe da dupla');
  eq(T.defesaPerdida(a, 1).total, -4, 'o segundo Golpe da dupla');
  eq(T.defesaPerdida(a, 2).total, -4, 'a Recuperação da dupla conta os dois golpes');
}
// a rajada não vira Recuperação no meio dela
{
  const a = T.declarar(0, T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr', manobra: 'rajada', golpes: 3 }));
  eq([0, 1, 2, 3].map((t) => T.faseEm(a, t)), ['golpe', 'golpe', 'golpe', 'recuperacao'], 'as fases da rajada de 3');
  eq(T.defesaPerdida(a, 3).total, -6, 'a Recuperação da rajada de 3: −2 por golpe dado');
}

// ------------------------------------------------------------ 3b. o abortar
// §14.6: só no Preparo, perdendo os Ticks investidos, e só para mover, desviar
// ou se interpor. 1 Tick por metro, o preço do desvio de emergência da §5.5.
{
  // martelo (pesada, 7t): declara no 10, Preparo 10-11, Golpe 12, Recuperação 13-16
  const a = T.declarar(10, T.anatomia({ classe: 'pesada', velocidade: 7, sistema: 'pgr' }));
  eq([a.desde, a.golpes, a.livre], [10, [12], 17], 'a agenda do martelo declarado no Tick 10');

  const noAto = T.abortar(a, 10, 0);
  eq([noAto.pode, noAto.perdidos, noAto.custo, noAto.novoTick], [true, 0, 0, 10],
    'abortar no mesmo Tick da declaração não perde nada');

  const tarde = T.abortar(a, 11, 0);
  eq([tarde.pode, tarde.perdidos, tarde.novoTick, tarde.devolvidos], [true, 1, 11, 6],
    'abortar no segundo Tick de Preparo perde 1 Tick e devolve 6 do ciclo');

  const fugindo = T.abortar(a, 11, 3);
  eq([fugindo.custo, fugindo.novoTick], [3, 14], 'recuar 3 m ao abortar custa 3 Ticks (1 por metro)');

  eq(T.abortar(a, 12, 0).pode, false, 'no Golpe não se aborta');
  ok(/braço/.test(T.abortar(a, 12, 0).porque), 'e o motivo é dito');
  eq(T.abortar(a, 13, 0).pode, false, 'na Recuperação não há o que abortar');
  ok(/2 Ticks por metro/.test(T.abortar(a, 13, 0).porque), 'e a Recuperação aponta o que cabe nela');
  eq(T.abortar(a, 17, 0).pode, false, 'quem está livre não tem gesto para abortar');
  eq(T.abortar(null, 3, 0).pode, false, 'sem ação nenhuma, não há abortar');

  // Quem tem Preparo 0 nunca pode abortar, e é o preço de ser rápido: a leve
  // já está golpeando no Tick em que declara.
  const leve = T.declarar(4, T.anatomia({ classe: 'leve', velocidade: 5, sistema: 'pgr' }));
  eq(T.abortar(leve, 4, 0).pode, false, 'a arma leve não tem Preparo para abortar');

  // O arqueiro é o caso que a regra existe para socorrer: Recuperação 0, e
  // portanto cinco Ticks de Preparo em que a única saída é desistir.
  const arco = T.declarar(0, T.anatomia({ classe: 'distancia', velocidade: 6, sistema: 'pgr' }));
  eq([0, 1, 2, 3, 4].every((t) => T.abortar(arco, t, 0).pode), true,
    'o arqueiro pode abortar em qualquer Tick da mira');
  eq(T.abortar(arco, 4, 0).perdidos, 4, 'e perde os quatro Ticks que já investiu');
}
// no sistema normal ninguém aborta: não existe Preparo para desistir
for (const w of armas) {
  const a = T.declarar(3, T.anatomia({ classe: w.classe, velocidade: w.ticks, sistema: 'normal' }));
  eq(T.abortar(a, 3, 0).pode, false, `no sistema normal ${w.id} não tem o que abortar`);
}

// -------------------------------------- 4. o sistema normal degenera direito
for (const w of armas) {
  eq(T.preparoDe(w.classe, w.ticks, 'normal'), 0, `no sistema normal ${w.id} não tem Preparo`);
  const a = T.declarar(7, T.anatomia({ classe: w.classe, velocidade: w.ticks, sistema: 'normal' }));
  eq(a.golpes, [7], `no normal o golpe de ${w.id} cai no Tick da declaração`);
  eq(T.faseEm(a, 7), 'golpe', `no normal ${w.id} está em Golpe no Tick da declaração`);
  eq(T.faseEm(a, 8), 'recuperacao', `no normal o resto do ciclo de ${w.id} é Recuperação`);
}
eq(T.faseEm(null, 3), 'livre', 'sem ação declarada, todo mundo está livre');
eq(T.defesaPerdida(null, 3).total, 0, 'sem ação declarada não se perde Defesa');
eq(T.fita(null, 4, 3).map((c) => c.fase), ['livre', 'livre', 'livre'], 'a fita de quem está livre');

// ---------------------------------------------------- 5. a Arte, e a mesa
{
  const g6 = T.reguaDaArte(6, 'pgr');
  eq([g6.preparo, g6.ciclo], [8, 9], 'Arte de grau 6: Preparo 8, ciclo 9 (§5.3 do Arcano)');
  eq(T.reguaDaArte(6, 'normal').preparo, 0, 'no sistema normal a Arte também resolve no primeiro Tick');
}
eq(T.combateDaMesa(null), { sistema: 'normal', marcacao: 'fita' }, 'a mesa sem escolha usa o padrão');
eq(T.combateDaMesa({ combate: { sistema: 'pgr' } }), { sistema: 'pgr', marcacao: 'fita' },
  'a escolha da mesa se sobrepõe ao padrão, campo a campo');
eq(T.classeDaArma('espada-longa'), 'media', 'a classe sai do id');
eq(T.classeDaArma('Espada Longa'), 'media', 'e também do nome, que é o que a mesa guarda');
eq(T.classeDaArma(null), 'leve', 'sem arma, o punho é rápido');
eq(T.velocidadeDaArma('martelo-de-guerra'), 7, 'a Velocidade sai do catálogo');

for (const f of tmp) { try { fs.unlinkSync(f); } catch {} }
if (falhas.length) {
  console.error(`\n✘ combate-tempo: ${falhas.length} falha(s)\n` + falhas.map((f) => '  · ' + f).join('\n'));
  process.exit(1);
}
console.log('✓ combate-tempo: a régua dos dois sistemas bate com o catálogo e com a §14.11');
