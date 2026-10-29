// 27/10/2026: a Variante registra a linha de PV escolhida pelo PV explícito.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {carregarTS} from './lib-ts.mjs';
const modulo = process.env.CENTELHA_CONVERSOR_TESTE ? pathToFileURL(process.env.CENTELHA_CONVERSOR_TESTE).href : new URL('./conversor-criatura.mjs', import.meta.url).href;
const {converterFicha} = await import(modulo);
const M = await carregarTS('src/lib/motor.ts');
const original = fs.readFileSync(new URL('fixtures/conversor/lobisomem.md', import.meta.url), 'utf8').replaceAll('forma de lobo', 'forma de rato');
function ficha(pv, massa='12,38', vigor=5, doisPontos=false) {
  const campos = ['Postura: quadrúpede', 'Altura: 0,28 m', 'Largura: 0,21 m', 'Comprimento total: 1,4 m', 'Área: 0,1475 m²', 'Tamanho: Pequeno (0,1475 m², de lado)', 'Massa: '+massa+' kg'];
  if (vigor !== null) campos.push('Vigor '+vigor);
  if (pv !== undefined) campos.push('PV'+(doisPontos?': ':' ')+pv);
  return original.replace(/^\| forma de rato \|[^\n]*/m, '| forma de rato | '+campos.join('; ')+' | Corpo de rato usado no teste de PV |');
}
function ler(texto) {
  const r = converterFicha(texto); assert.deepEqual(r.paradas, []);
  return {c:r.criatura, f:r.criatura.formas.find(x=>x.id==='rato'), avisos:r.avisos};
}
const superior = ler(ficha(30));
assert.equal(superior.f.corpo.linhaPV, 'acima', 'PV 30 do homem-rato precisa da linha superior');
assert.equal(M.pvDaMassa(12.38, 5, superior.f.corpo.linhaPV), 30);
assert.equal(M.pvDaMassa(12.38, 5), 20, 'controle da linha padrão');
assert.equal(ler(ficha(20,'15,5')).f.corpo.linhaPV, 'abaixo');
assert.equal(ler(ficha(30,'12,38',null)).f.corpo.linhaPV, 'acima', 'Vigor herdado');
assert.equal(ler(ficha(30,'12,38',5,true)).f.corpo.linhaPV, 'acima', 'sintaxe PV: também aceita');
assert.equal(ler(ficha(undefined)).f.corpo.linhaPV, undefined, 'sem PV não se inventa escolha');
assert.equal(ler(ficha(37,'80',4)).f.corpo.linhaPV, undefined, 'fora da transição não precisa de escolha');
const incoerente = ler(ficha(31));
assert.equal(incoerente.f.corpo.linhaPV, undefined);
assert.ok(incoerente.avisos.some(x=>x.includes('PV 31 não coincide')));
let herdada = ficha(30).replace(/^(\| Massa \| )[^|]*/m, '$1**12 kg** ')
  .replace(/^(\| PV base \| )[^|]*/m, '$1Faixa de PV de 15 a 35 kg: **30** ');
const r = ler(herdada);
assert.equal(r.c.corpo.linhaPV, 'acima');
assert.equal(r.f.corpo.linhaPV, 'acima', 'massa diferente conserva a escolha, mesmo igual à principal');
console.log('Variantes: PV 30 e linha acima, linha abaixo, herança e PV incoerente conferidos');
