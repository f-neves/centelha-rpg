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

const usam = fs.readdirSync('src/data/bestiario').filter((f) => JSON.parse(fs.readFileSync('src/data/bestiario/' + f, 'utf8')).ataques.some((a) => a.tamanho));
ok(usam.length === 0, `nenhuma ficha publicada usa o tamanho da arma (${usam.length})`);

if (falhas.length) { console.error(`✘ test-escala-tamanho: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-escala-tamanho · a arma de outro tamanho muda só o dado base, +1d6 acima e −2 abaixo do Médio (G1, D-363)');
