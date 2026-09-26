// O módulo desativado não deve esconder respiração, resistência física ou cura.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { transform } from 'esbuild';

const codigo = fs.readFileSync(new URL('../src/lib/modulos.ts', import.meta.url), 'utf8');
const { code } = await transform(codigo, { loader: 'ts', format: 'esm' });
const { tecnicaDisponivel } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const tecnicas = JSON.parse(fs.readFileSync(new URL('../src/data/tecnicas.json', import.meta.url), 'utf8'));
const ocultas = new Set([
  'folego-profundo', 'segundo-vento', 'marcha-forcada', 'folego-de-sobra',
  'incansavel', 'pulmoes-de-ferro', 'sem-limites', 'vigor-inesgotavel', 'coracao-eterno',
]);
assert.deepEqual(new Set(tecnicas.filter((t) => t.modulo === 'folego').map((t) => t.id)), ocultas);
for (const t of tecnicas) {
  assert.equal(tecnicaDisponivel(t, { folego: false }), !ocultas.has(t.id), t.id);
  assert.equal(tecnicaDisponivel(t, { folego: true }), true, `reativação: ${t.id}`);
  if (!ocultas.has(t.id)) assert.ok(!t.prereq.some((p) => ocultas.has(p)), `pré-requisito oculto: ${t.id}`);
}
for (const id of ['segundo-folego', 'corpo-inospito', 'aclimatacao', 'caca-implacavel']) {
  const t = tecnicas.find((t) => t.id === id);
  assert.ok(t, id);
  assert.equal(tecnicaDisponivel(t, { folego: false }), true, `atividade física preservada: ${id}`);
}
// Controle de semântica: o nome ou a prosa não substituem a marca no dado.
assert.equal(tecnicaDisponivel({ nome: 'Fôlego físico', texto: 'Prende a respiração.' }, { folego: false }), true);
assert.equal(tecnicaDisponivel({ modulo: 'folego', nome: 'Sem Limites' }, { folego: false }), false);
console.log('Proezas: nove dependências ocultas, demais Técnicas preservadas, módulo reversível e sem dependentes órfãos.');
