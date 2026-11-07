// test-escala-tamanho.mjs · D-360 (06/11/2026), a estrutura da arma de gigante, com o passo ainda vazio.
//
// O autor: "A arma de gigante não muda o multiplicador da Força; muda o dado de dano base da arma (o 1d6−2, o 1d6, o
// 2d6). A Força continua ×1 com uma mão e ×2 com duas, como no livro." O passo por categoria de Tamanho está com ele:
// "Não fixe a escala; prepare a entrada para receber um passo por categoria". Aqui se prova que:
//   - `regras.json` `combate.escalaPorTamanho.passo` existe e está em null (nenhum número inventado);
//   - a arma com `tamanho` acima do Médio dá o MESMO dado, a mesma Força e o mesmo multiplicador da arma comum, e só
//     ganha a marca `escalaPorTamanho: 'a definir'`; a do Médio e a sem tamanho não ganham marca;
//   - a marca chega à vista do bestiário (o card escreve "escala por Tamanho: a definir") sem mudar o dano;
//   - o esquema aceita o `tamanho` no ataque com arma e recusa um Tamanho que não existe.
//   node scripts/test-escala-tamanho.mjs
import fs from 'node:fs';
import { carregarTS } from './lib-ts.mjs';
import { criaturaParaLeituraSchema } from './criatura-schema.mjs';
const M = await carregarTS('src/lib/motor.ts');
const REGRAS = JSON.parse(fs.readFileSync('src/data/regras.json', 'utf8'));

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const J = JSON.stringify;

ok(REGRAS.combate?.escalaPorTamanho && REGRAS.combate.escalaPorTamanho.passo === null, 'regras.json: combate.escalaPorTamanho.passo existe e está em null');

for (const [arma, forca, duas] of [['maca', 6, false], ['montante', 8, true], ['machado-pesado', 10, true]]) {
  const comum = M.ataqueDaArma(arma, forca, duas), grande = M.ataqueDaArma(arma, forca, duas, 'grande'), medio = M.ataqueDaArma(arma, forca, duas, 'medio');
  const { escalaPorTamanho, ...semMarca } = grande;
  ok(J(semMarca) === J(comum), `${arma}: a arma Grande dá o dado, a Força e o multiplicador da comum (${comum.dado}, Força ${comum.forca} × ${comum.multiplicadorForca})`);
  ok(escalaPorTamanho === 'a definir', `${arma}: a arma Grande marca a escala "a definir"`);
  ok(!('escalaPorTamanho' in comum) && !('escalaPorTamanho' in medio), `${arma}: a comum e a do Médio não levam marca`);
}

// a vista do bestiário: uma criatura publicada, com o ataque de arma trocado para uma arma de gigante
const base = JSON.parse(fs.readFileSync('src/data/bestiario/arconte-trombeta.json', 'utf8'));
const i = base.ataques.findIndex((a) => a.arma);
ok(i >= 0, 'arconte-trombeta tem ataque com arma do catálogo');
const gigante = structuredClone(base);
gigante.ataques[i] = { ...gigante.ataques[i], tamanho: 'grande' };
ok(criaturaParaLeituraSchema.safeParse(gigante).success, 'o esquema aceita o tamanho no ataque com arma');
const errado = structuredClone(base);
errado.ataques[i] = { ...errado.ataques[i], tamanho: 'gigante' };
ok(!criaturaParaLeituraSchema.safeParse(errado).success, 'o esquema recusa um Tamanho que não existe');
const va = M.vistaPublicaCriatura(base).motor.stat.ataques[i], vg = M.vistaPublicaCriatura(gigante).motor.stat.ataques[i];
const { escalaPorTamanho: marca, ...vgSem } = vg;
ok(J(vgSem) === J(va), `vista: o ataque de gigante tem o mesmo dano e a mesma jogada (${va.dano}, ${va.pool})`);
ok(marca === 'a definir' && !('escalaPorTamanho' in va), 'vista: só o ataque de gigante leva a marca até o card');

// nenhuma criatura publicada usa o campo ainda: o bestiário de hoje não muda
const usam = fs.readdirSync('src/data/bestiario').filter((f) => JSON.parse(fs.readFileSync('src/data/bestiario/' + f, 'utf8')).ataques.some((a) => a.tamanho));
ok(usam.length === 0, `nenhuma ficha publicada usa o tamanho da arma (${usam.length})`);

if (falhas.length) { console.error(`✘ test-escala-tamanho: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-escala-tamanho · a arma de gigante tem o campo e a leitura, com o passo em null e o dado da arma comum (D-360)');
