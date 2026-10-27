// 36.2, 27/10/2026: deslocamento é número, sem exigir inteiro.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
const url = (env, rel) => process.env[env] ? pathToFileURL(process.env[env]).href : new URL(rel, import.meta.url).href;
const {converterFicha} = await import(url('CENTELHA_CONVERSOR_TESTE', './conversor-criatura.mjs'));
const {criaturaNovaSchema} = await import(url('CENTELHA_SCHEMA_TESTE', './criatura-schema.mjs'));
const original = fs.readFileSync(new URL('fixtures/conversor/lobisomem.md', import.meta.url), 'utf8');
function campo(t, nome, valor) {
  const re = new RegExp('^(\\| '+nome+' \\| )[^|]*\\|', 'm');
  if (re.test(t)) return t.replace(re, (_, inicio) => inicio+valor+' |');
  return t.replace(/(## Corpo e movimento\n[\s\S]*?)(?=\n## )/, '$1\n| '+nome+' | '+valor+' | |\n');
}
let texto = campo(original, 'Deslocamento em terra', 'Batalha **0,5** · Arranque **1.25** · Corrida **2,5** (m por Tick)');
for (const nome of ['Voo', 'Nado', 'Escavação', 'Escalada']) texto = campo(texto, nome, 'Batalha **0.5** · Arranque **1,25** · Corrida **2.5** (m por Tick)');
texto = texto.replace(/^(\| forma de lobo \| )([^|]*)(\|)/m, (_, a, b, c) => a+b.replace(/Deslocamento: [^;]*\(\d+ · \d+ · \d+\)/, 'Deslocamento: o da forma (0,75 · 1.5 · 2,75)')+'; Voo: Batalha 0,5; Nado: 1.25 '+c);
const r = converterFicha(texto);
assert.deepEqual(r.paradas, [], 'decimais devem ser lidos sem parada');
for (const modo of ['terra', 'voo', 'nado', 'escavacao', 'escalada']) assert.deepEqual(r.criatura.deslocamento[modo], {batalha:0.5, arranque:1.25, corrida:2.5});
const forma = r.criatura.formas.find(f => f.id === 'lobo');
assert.deepEqual(forma.deslocamento, {terra:{batalha:0.75, arranque:1.5, corrida:2.75}, voo:{batalha:0.5}, nado:{batalha:1.25}});
assert.ok(criaturaNovaSchema.safeParse(r.criatura).success);
for (const ruim of [-0.5, Infinity, NaN, '0,5']) {
  const copia = structuredClone(r.criatura); copia.deslocamento.terra.batalha = ruim;
  assert.equal(criaturaNovaSchema.safeParse(copia).success, false, 'recusar deslocamento inválido');
}
const copia = structuredClone(r.criatura); copia.atributos.forca = 1.5;
assert.equal(criaturaNovaSchema.safeParse(copia).success, false, 'atributos continuam inteiros');
const curto = converterFicha(campo(original, 'Nado', '**0,5** m por Tick'));
assert.equal(curto.criatura.deslocamento.nado.batalha, 0.5);
console.log('36.2: decimais na principal e nas Variantes; inválidos recusados');
