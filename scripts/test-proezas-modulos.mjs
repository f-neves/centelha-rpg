// O Fôlego saiu do sistema (D-016, 03/10/2026) e, em 25/11/2026 (D16, consulta 014), saíram também do dado as nove
// Técnicas da Coração Incansável que dependiam dele e o campo `folego` das armas. Este teste garante que continuam
// fora, que nenhuma outra Técnica sumiu junto, que nenhuma Técnica pede uma id que não existe e que nenhum campo
// `modulo` sobrou. A ficha salva que ainda guarda uma dessas ids é provada no navegador, em test-ficha-item-inteiro.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const tecnicas = JSON.parse(fs.readFileSync(new URL('../src/data/tecnicas.json', import.meta.url), 'utf8'));
const armas = JSON.parse(fs.readFileSync(new URL('../src/data/armas.json', import.meta.url), 'utf8'));
const removidas = [
  'folego-profundo', 'segundo-vento', 'marcha-forcada', 'folego-de-sobra',
  'incansavel', 'pulmoes-de-ferro', 'sem-limites', 'vigor-inesgotavel', 'coracao-eterno',
];
const ids = new Set(tecnicas.map((t) => t.id));
for (const id of removidas) assert.ok(!ids.has(id), `a Técnica ${id} devia ter saído do dado`);
assert.equal(tecnicas.length, 452, 'eram 461 Técnicas; saíram as nove e mais nenhuma');
assert.ok(!tecnicas.some((t) => 'modulo' in t), 'nenhuma Técnica traz o campo modulo');
assert.ok(!tecnicas.some((t) => t.caminho === 'coracao-incansavel'), 'o Caminho Coração Incansável ficou sem Técnica');
for (const t of tecnicas) for (const p of t.prereq || []) assert.ok(ids.has(p), `pré-requisito que não existe: ${t.id} pede ${p}`);
for (const id of ['segundo-folego', 'corpo-inospito', 'aclimatacao', 'caca-implacavel']) assert.ok(ids.has(id), `atividade física preservada: ${id}`);
assert.ok(!/"folego"\s*:/.test(JSON.stringify(armas)), 'nenhuma arma traz o campo folego');
console.log('Proezas: as nove Técnicas da Coração Incansável e o campo folego das armas saíram; as demais Técnicas estão intactas e sem pré-requisito órfão.');
