// test-escala-tamanho.mjs · G1 (D-363, 07/11/2026; completa a D-360), a arma de outro tamanho no motor.
//
// O autor: "Uma arma feita para um corpo maior ou menor muda só o dado de dano base: +1d6 por categoria de Tamanho
// acima de Médio, e −2 por categoria abaixo. A espada pesada (2d6) feita para um Grande dá 3d6; para um Enorme, 4d6.
// A Força segue a regra de sempre: ×1 com uma mão, ×2 com duas." Aqui se prova que:
//   - `regras.json` `combate.escalaPorTamanho` traz os dois números (+1 dado acima, −2 abaixo);
//   - o Montante (2d6, a espada pesada do livro): Grande 3d6, Enorme 4d6, Colossal 6d6;
//   - abaixo do Médio: a Adaga (1d6−2) Pequena dá 1d6−4, Miúda 1d6−6; a Maça (1d6) Pequena dá 1d6−2;
//   - a Força e o multiplicador não mudam (×1 numa mão, ×2 nas duas), nem o Acerto e a Velocidade;
//   - a vista do bestiário leva o dado novo ao ataque; o esquema aceita o `tamanho` e recusa um que não existe;
//   - nenhuma ficha publicada usa o campo ainda.
//   node scripts/test-escala-tamanho.mjs
import fs from 'node:fs';
import { carregarTS } from './lib-ts.mjs';
import { criaturaParaLeituraSchema } from './criatura-schema.mjs';
const M = await carregarTS('src/lib/motor.ts');
const REGRAS = JSON.parse(fs.readFileSync('src/data/regras.json', 'utf8'));

const falhas = [];
const J = JSON.stringify;
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const E = REGRAS.combate?.escalaPorTamanho;
ok(E?.dadosPorCategoriaAcima === 1 && E?.bonusPorCategoriaAbaixo === -2, 'regras.json: +1d6 por categoria acima e −2 por categoria abaixo do Médio');

const casos = [
  ['montante', 8, true, 'grande', '3d6'], ['montante', 8, true, 'enorme', '4d6'], ['montante', 8, true, 'colossal', '6d6'],
  ['montante', 8, true, 'medio', '2d6'], ['montante', 8, true, undefined, '2d6'],
  ['adaga', 4, false, 'pequeno', '1d6-4'], ['adaga', 4, false, 'miudo', '1d6-6'], ['maca', 5, false, 'pequeno', '1d6-2'],
  ['maca', 5, false, 'grande', '2d6'],
];
for (const [arma, forca, duas, tam, esperado] of casos) {
  const comum = M.ataqueDaArma(arma, forca, duas), t = M.ataqueDaArma(arma, forca, duas, tam);
  ok(t.dado === esperado, `${arma} ${tam ?? 'sem tamanho'}: ${t.dado} (esperado ${esperado})`);
  ok(t.forca === comum.forca && t.multiplicadorForca === comum.multiplicadorForca && t.acerto === comum.acerto && t.velocidade === comum.velocidade,
    `${arma} ${tam ?? 'sem tamanho'}: Força ${t.forca} × ${t.multiplicadorForca}, Acerto e Velocidade os da arma comum`);
}
ok(M.ataqueDaArma('montante', 8, true, 'grande').multiplicadorForca === 2 && M.ataqueDaArma('maca', 5, false, 'grande').multiplicadorForca === 1, 'a Força segue ×2 nas duas mãos e ×1 numa');
let errou = false; try { M.ataqueDaArma('maca', 5, false, 'gigante'); } catch { errou = true; }
ok(errou, 'um Tamanho fora da régua para alto');

// a rocha arremessada (G1, D-363; opção a do Arquiteto): o Tamanho é o da própria rocha. "A pedra de mão dá 1d6−4, a que
// um humano arremessa, 1d6, e cada categoria acima soma +1d6": a de mão é a Miúda, a do humano é a Média.
for (const [tam, esperado] of [['miudo', '1d6-4'], ['medio', '1d6'], [undefined, '1d6'], ['grande', '2d6'], ['enorme', '3d6']]) {
  const r = M.ataqueDaArma('rocha', 9, false, tam);
  ok(r && r.dado === esperado && r.habilidade === 'arremesso' && r.velocidade === 6 && r.acerto === 0, `rocha ${tam ?? 'sem tamanho'}: ${r?.dado} (esperado ${esperado}), Arremesso, V6, Acerto +0`);
}
const ROCHA = JSON.parse(fs.readFileSync('src/data/armas.json', 'utf8')).find((x) => x.id === 'rocha');
ok(ROCHA?.soCriatura === true && ROCHA.peso === undefined && ROCHA.arma.alcancePelaMassa === true && ROCHA.arma.efetiva === undefined && ROCHA.arma.distMax === undefined, 'a rocha é arma de criatura, sem peso, sem Efetiva e sem distância fixa (a massa vem do ataque)');
const EQ = await carregarTS('src/lib/equip.ts');
ok(!EQ.ARMAS.some((w) => w.id === 'rocha') && EQ.ARMAS.some((w) => w.id === 'azagaia'), 'a rocha fica fora da lista de armas da ficha do jogador');

// a vista do bestiário: uma criatura publicada, com o ataque de arma trocado para Grande
const base = JSON.parse(fs.readFileSync('src/data/bestiario/arconte-trombeta.json', 'utf8'));
const i = base.ataques.findIndex((a) => a.arma);
ok(i >= 0 && base.ataques[i].arma === 'montante', 'arconte-trombeta ataca com o Montante');
const grande = structuredClone(base);
grande.ataques[i] = { ...grande.ataques[i], tamanho: 'grande' };
ok(criaturaParaLeituraSchema.safeParse(grande).success, 'o esquema aceita o tamanho no ataque com arma');
const errado = structuredClone(base);
errado.ataques[i] = { ...errado.ataques[i], tamanho: 'gigante' };
ok(!criaturaParaLeituraSchema.safeParse(errado).success, 'o esquema recusa um Tamanho que não existe');
const va = M.vistaPublicaCriatura(base).motor.stat.ataques[i], vg = M.vistaPublicaCriatura(grande).motor.stat.ataques[i];
ok(/^2d6/.test(va.dano) && /^3d6/.test(vg.dano) && va.pool === vg.pool, `vista: o Montante Grande dá ${vg.dano} contra ${va.dano}, com a mesma jogada (${va.pool})`);

// Desde o lote r-listas-07-11, oito fichas usam o tamanho da arma, em 13 ataques (as Variantes de gigante e as rochas).
const comTam = fs.readdirSync('src/data/bestiario').map((f) => JSON.parse(fs.readFileSync('src/data/bestiario/' + f, 'utf8'))).filter((c) => c.ataques.some((a) => a.tamanho));
const nTam = comTam.reduce((n, c) => n + c.ataques.filter((a) => a.tamanho).length, 0);
ok(J(comTam.map((c) => c.id).sort()) === J(['ciclope', 'ettin', 'gigante-da-colina', 'gigante-da-pedra', 'gigante-das-nuvens', 'gigante-do-fogo', 'gigante-do-gelo', 'ogro']) && nTam === 13, `as oito fichas do lote usam o tamanho da arma, em ${nTam} ataques`);

// O conversor lê o Tamanho da arma na coluna Parte ("arma Grande", "rocha Enorme, 60 kg"); o Médio não grava nada.
// A ficha de exemplo é a do ogro do lote r-listas-07-11 (scripts/fixtures/conversor/ogro-g1.md).
{
  const { converterFicha } = await import('./conversor-criatura.mjs');
  const OGRO = fs.readFileSync('scripts/fixtures/conversor/ogro-g1.md', 'utf8');
  const SITE = JSON.parse(fs.readFileSync('src/data/bestiario/ogro.json', 'utf8'));
  const tam = (md) => converterFicha(md, { site: SITE }).criatura.ataques.filter((x) => x.arma).map((x) => x.tamanho ?? 'sem');
  if (!/\| arma Grande \|/.test(OGRO)) throw new Error('a ficha de exemplo não tem mais "arma Grande" na Parte');
  ok(J(tam(OGRO)) === J(['grande', 'grande']), `o conversor lê "arma Grande": ${J(tam(OGRO))}`);
  for (const [w, esp] of [['Média', 'sem'], ['Pequena', 'pequeno'], ['Enorme', 'enorme'], ['Miúda', 'miudo']]) {
    const v = tam(OGRO.replaceAll('| arma Grande |', `| arma ${w} |`));
    ok(J(v) === J([esp, esp]), `"arma ${w}" dá ${J(v)} (esperado ${esp})`);
  }
  ok(J(tam(OGRO.replaceAll('| arma Grande |', '| arma |'))) === J(['sem', 'sem']), 'sem Tamanho na Parte, a arma é a comum');
}

if (falhas.length) { console.error(`✘ test-escala-tamanho: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-escala-tamanho · a arma de outro tamanho muda só o dado base, +1d6 acima e −2 abaixo do Médio (G1, D-363)');
