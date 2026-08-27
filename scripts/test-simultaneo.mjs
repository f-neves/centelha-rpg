// test-simultaneo.mjs — o motor do terceiro sistema, travado.
//
// O sistema simultâneo (Combate_Simultaneo.md) é a física do P/G/R com outro
// relógio: um Tick por vez, decisão a cada Tick, deslocamento no mapa. Este
// teste trava as três contas que o sustentam:
//
//   1. a FÍSICA É A MESMA: anatomia sob 'simultaneo' devolve os números do 'pgr',
//      arma a arma, e o golpe adiado é constitutivo (adiaGolpe sempre true);
//   2. a AGENDA: decidir em T vale em T+1, o deslocamento cabe no Preparo e só
//      o excedente atrasa o golpe — os quatro números do exemplo que abriu a
//      revisão saem daqui;
//   3. o PASSO NO MAPA: `caminharHex` anda pelo caminho mínimo, para no alcance,
//      e dois que avançam um no outro se ENCONTRAM ANTES do que qualquer um
//      faria sozinho, sem regra nenhuma escrita para isso.
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
  const saida = path.join(os.tmpdir(), `${path.basename(rel, '.ts')}-sim-${process.pid}.mjs`);
  await build({
    entryPoints: [path.join(ROOT, rel)],
    outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error',
  });
  tmp.push(saida);
  return import(pathToFileURL(saida).href);
}

const T = await carregar('src/lib/combate-tempo.ts');
const H = await carregar('src/lib/hex.ts');
const regras = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m} — esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);

// ------------------------------------------------- 1. o sistema existe e herda
eq(regras.combate.sistemas.map((s) => s.id), ['normal', 'pgr', 'simultaneo'],
  'o terceiro sistema está no regras.json');
ok(regras.combate.simultaneo, 'o bloco combate.simultaneo existe');
eq(T.fisicaDe('simultaneo'), 'pgr', 'a física do simultâneo é a do P/G/R');
eq(T.fisicaDe('normal'), 'normal', 'a do normal segue normal');

// A anatomia é a MESMA do pgr, arma a arma.
for (const [classe, vel] of [['leve', 5], ['media', 6], ['haste', 6], ['pesada', 7], ['distancia', 6]]) {
  const a = T.anatomia({ classe, velocidade: vel, sistema: 'pgr' });
  const b = T.anatomia({ classe, velocidade: vel, sistema: 'simultaneo' });
  eq([b.preparo, b.golpes, b.recuperacao, b.ciclo], [a.preparo, a.golpes, a.recuperacao, a.ciclo],
    `anatomia de ${classe} igual nos dois sistemas`);
}

// O golpe adiado é constitutivo: a chave é ignorada.
ok(T.adiaGolpe({ sistema: 'simultaneo', golpeAdiado: false }), 'simultâneo adia mesmo com a chave desligada');
ok(!T.adiaGolpe({ sistema: 'pgr', golpeAdiado: false }), 'pgr sem chave não adia');
ok(!T.adiaGolpe({ sistema: 'normal', golpeAdiado: true }), 'normal nunca adia');

// ------------------------------------------------- 2. a agenda do exemplo
// Os quatro números da conversa que abriu a revisão (Combate_Simultaneo.md §2):
// tudo declarado no Tick 0, valendo do 1.
const an = (classe, vel, extra = {}) => T.anatomia({ classe, velocidade: vel, sistema: 'simultaneo', ...extra });

// martelo (pesada, P2) com 2 Ticks de viagem: anda nos Ticks 1 e 2 (dentro do
// Preparo) e golpeia no 3.
eq(T.agendaSimultanea(0, an('pesada', 7), 2).golpes, [3], 'martelo com 2 Ticks de viagem golpeia no 3');
// adaga (leve, P0) com 1 Tick de viagem: anda no 1, golpeia no 2.
eq(T.agendaSimultanea(0, an('leve', 5), 1).golpes, [2], 'adaga com 1 Tick de viagem golpeia no 2');
// adaga já no alcance: golpeia no 1 (o Tick 0 é só preparação).
eq(T.agendaSimultanea(0, an('leve', 5), 0).golpes, [1], 'adaga no alcance golpeia no 1');
// arco (distância, P5) parado: a flecha sai no 6.
eq(T.agendaSimultanea(0, an('distancia', 6), 0).golpes, [6], 'a flecha do arco sai no Tick 6');
// e se a viagem couber no Preparo do arco, nada muda: 3 Ticks andando ainda dá flecha no 6.
eq(T.agendaSimultanea(0, an('distancia', 6), 3).golpes, [6], 'viagem dentro do Preparo não atrasa a flecha');
// só o EXCEDENTE atrasa: martelo com 4 de viagem atrasa 2 (golpe no 5), e o
// ciclo estica junto.
{
  const ag = T.agendaSimultanea(0, an('pesada', 7), 4);
  eq(ag.golpes, [5], 'viagem além do Preparo atrasa o golpe pelo excedente');
  eq(ag.livre, 1 + 7 + 2, 'e o ciclo estica pelo mesmo excedente');
}
// declarar mais tarde desloca tudo junto.
eq(T.agendaSimultanea(10, an('media', 6), 0).golpes, [12], 'espada longa declarada no 10 golpeia no 12');
// a rajada mantém os golpes seguidos depois da viagem.
{
  const ag = T.agendaSimultanea(0, an('leve', 5, { manobra: 'rajada', golpes: 3 }), 2);
  eq(ag.golpes, [3, 4, 5], 'a rajada viaja uma vez e golpeia em Ticks seguidos');
}

// ------------------------------------------------- 3. o passo no mapa
// A viagem em Ticks.
eq(T.ticksDeViagem(6, 3), 2, '6 m a 3 m/Tick são 2 Ticks');
eq(T.ticksDeViagem(7, 3), 3, '7 m arredondam para cima');
eq(T.ticksDeViagem(0, 3), 0, 'no alcance não há viagem');

// `caminharHex` anda o caminho mínimo e para no alcance.
{
  const fim = H.caminharHex({ q: 0, r: 0 }, { q: 6, r: 0 }, 10, 1);
  eq(H.distanciaHex(fim, { q: 6, r: 0 }), 1, 'a peça para a 1 hexágono do alvo, nunca em cima');
  const passo = H.caminharHex({ q: 0, r: 0 }, { q: 6, r: 0 }, 1, 1);
  eq(passo, { q: 1, r: 0 }, 'um passo por vez, na direção certa');
}

// O ENCONTRO ANTECIPADO, emergente: A e B a 6 hexágonos, 1 hexágono por Tick
// cada, alcance 1. Sozinho, A levaria 5 Ticks até o alcance; um vindo ao
// encontro do outro, o contato sai no Tick 3.
{
  let a = { q: 0, r: 0 }, b = { q: 6, r: 0 };
  let contato = null;
  for (let t = 1; t <= 6 && contato == null; t++) {
    a = H.caminharHex(a, b, 1, 1);
    b = H.caminharHex(b, a, 1, 1);
    if (H.distanciaHex(a, b) <= 1) contato = t;
  }
  eq(contato, 3, 'dois que avançam um no outro se encontram no Tick 3, não no 5');
}
// A fuga: mesmo passo, nunca alcança; a projeção avisa antes.
eq(T.previsaoDeEncontro(6, 3, 3, 1), null, 'fugindo no mesmo passo, nunca alcança');
eq(T.previsaoDeEncontro(6, 3, -3, 1), 1, 'vindo ao encontro, a distância fecha em dobro');
eq(T.previsaoDeEncontro(6, 4, 2, 1), 3, 'perseguindo mais rápido, alcança no Tick previsto');
eq(T.previsaoDeEncontro(1, 3, 0, 1), 0, 'já no alcance: zero Ticks');

// O desvio de obstáculo: a casa ocupada não é atravessada, e a peça CONTORNA
// pelo passo lateral em vez de ficar presa atrás de um aliado parado.
{
  const bloqueia = (h) => h.q === 1 && h.r === 0;
  const umPasso = H.caminharHex({ q: 0, r: 0 }, { q: 2, r: 0 }, 1, 0, bloqueia);
  ok(!(umPasso.q === 1 && umPasso.r === 0), 'a casa ocupada não é atravessada');
  ok(!(umPasso.q === 0 && umPasso.r === 0), 'e a peça não fica presa: dá o passo lateral');
  const tresPassos = H.caminharHex({ q: 0, r: 0 }, { q: 2, r: 0 }, 3, 0, bloqueia);
  eq(tresPassos, { q: 2, r: 0 }, 'em três passos, contorna o bloqueio e chega');
}

// ------------------------------------- 3.1. a classe de tempo do bestiário
// O `gen-monsters.mjs` estima como cada criatura ataca (leve · media · pesada ·
// haste · distancia · arremesso · arte) e carimba `classe` no ataque. Aqui
// trava-se o vocabulário, os cinco casos que a estimativa CORRIGE sobre o
// atalho antigo da Velocidade, e a precedência do `classeDeTempo`.
{
  const M = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/monsters.json'), 'utf8'));
  const VOCAB = ['leve', 'media', 'pesada', 'haste', 'distancia', 'arremesso', 'arte'];
  const fora = M.filter((c) => !VOCAB.includes(c.combate?.ataques?.[0]?.classe));
  eq(fora.map((c) => c.id), [], 'toda criatura tem classe de ataque no vocabulário');
  const de = (nome) => M.find((c) => c.nome === nome)?.combate.ataques[0].classe;
  eq(de('Arqueiro'), 'distancia', 'o Arqueiro atira');
  eq(de('Camponês Assustado'), 'haste', 'o forcado do camponês alcança dois hexágonos');
  eq(de('Mago de Batalha'), 'arte', 'a Bola de fogo é conjuração');
  eq(de('Feiticeiro Menor'), 'arte', 'o Dardo flamejante é conjuração');
  eq(de('Cultista Sombrio'), 'arte', 'o Toque mórbido é conjuração');

  // A precedência: catálogo > classe explícita > velocidade.
  eq(T.classeDeTempo('espada-longa', 5, 'pesada'), 'media', 'a arma do catálogo vence a estimativa');
  eq(T.classeDeTempo('Garras', 6, 'haste'), 'haste', 'a estimativa vence o atalho da velocidade');
  eq(T.classeDeTempo('Garras', 6, null), 'media', 'sem estimativa, o atalho de sempre');
  // E a régua da arte-como-ataque: sai no último Tick, como distância.
  const aa = T.anatomia({ classe: 'arte', velocidade: 6, sistema: 'pgr' });
  eq([aa.preparo, aa.golpes, aa.recuperacao], [5, 1, 0], 'ataque-conjuração: P=Vel−1, R=0');
}

// ------------------------------------------------- 4. o robô mínimo
{
  const perto = { id: 'perto', pos: { q: 1, r: 0 } };
  const longe = { id: 'longe', pos: { q: 5, r: 0 } };
  const d = T.decisaoAutomatica({ id: 'eu', pvPct: 80, pos: { q: 0, r: 0 } }, [longe, perto], H.distanciaHex);
  eq([d.tipo, d.alvo], ['atacar', 'perto'], 'o robô ataca o inimigo mais próximo');
  const f = T.decisaoAutomatica({ id: 'eu', pvPct: 10, pos: { q: 0, r: 0 } }, [perto], H.distanciaHex);
  eq(f.tipo, 'fugir', 'com a Vida abaixo do limiar, o robô foge');
  const n = T.decisaoAutomatica({ id: 'eu', pvPct: 80, pos: { q: 0, r: 0 } }, [], H.distanciaHex);
  eq(n.tipo, 'nada', 'sem inimigo em cena, nada a decidir');
}

// ------------------------------------------------------------------ veredito
for (const f of tmp) { try { fs.unlinkSync(f); } catch {} }
if (falhas.length) {
  console.error(`✗ combate simultâneo: ${falhas.length} falha(s)`);
  for (const f of falhas) console.error('  · ' + f);
  process.exit(1);
}
console.log('✓ combate simultâneo: física herdada, agenda do exemplo, passo no mapa e robô conferem');
