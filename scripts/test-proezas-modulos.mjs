// O módulo Fôlego saiu (D-016, 03/10/2026), mas as nove Técnicas da Coração Incansável que
// dependiam dele ficam no dado, ocultas e inertes: este teste garante que continuam fora, que
// nenhuma outra Técnica some junto e que nenhuma Técnica visível depende de uma oculta.
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
  assert.equal(tecnicaDisponivel(t), !ocultas.has(t.id), t.id);
  if (!ocultas.has(t.id)) assert.ok(!t.prereq.some((p) => ocultas.has(p)), `pré-requisito oculto: ${t.id}`);
}
for (const id of ['segundo-folego', 'corpo-inospito', 'aclimatacao', 'caca-implacavel']) {
  const t = tecnicas.find((t) => t.id === id);
  assert.ok(t, id);
  assert.equal(tecnicaDisponivel(t), true, `atividade física preservada: ${id}`);
}
// Controle de semântica: o nome ou a prosa não substituem a marca no dado.
assert.equal(tecnicaDisponivel({ nome: 'Fôlego físico', texto: 'Prende a respiração.' }), true);
assert.equal(tecnicaDisponivel({ modulo: 'folego', nome: 'Sem Limites' }), false);
console.log('Proezas: as nove Técnicas da Coração Incansável seguem ocultas, as demais preservadas e sem dependentes órfãos.');
