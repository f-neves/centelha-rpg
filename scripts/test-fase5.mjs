// Regressões da Fase 5: fonte inválida deve parar, e dado válido deve sobreviver.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { criaturaNovaSchema as schema } from './criatura-schema.mjs';
import { converterFicha } from './conversor-criatura.mjs';
import { carregarTS } from './lib-ts.mjs';
const M = await carregarTS('src/lib/motor.ts');
const raw = fs.readFileSync('scripts/fixtures/conversor/lobisomem.md','utf8');
const site = JSON.parse(fs.readFileSync('scripts/fixtures/conversor/lobisomem-site.json','utf8'));
const fresh = () => JSON.parse(fs.readFileSync('src/data/bestiario/lobisomem.json','utf8'));
const conv = (t) => converterFicha(t,{site});
const variant = (fields) => raw.replace(/^(\| forma humana \| )/m, '$1'+fields+'; ');
const cases = new Map();
cases.set('11', async () => {
const c=fresh(); delete c.corpo.massa; delete c.corpo.semMassa; assert.equal(schema.safeParse(c).success,false); assert.equal(schema.safeParse(fresh()).success,true);
});
cases.set('5', async () => {
const r=conv(variant('Mente: raciocina como humano; Respiração: respira na água')); const f=r.criatura.formas.find(f=>f.id==='humana'); assert.equal(f.fisiologia.mente,'raciocina como humano'); assert.equal(f.fisiologia.respiracao,'respira na água'); assert.ok(!r.paradas.some(x=>/Mente|Respiração/.test(x)));
});
cases.set('7', async () => {
for(const second of [false,true]){const c=fresh(); if(second)c.corpo.segundoTamanho={area:1,posturaDoTamanho:'de frente',tamanhoEscolhido:'medium'};else c.corpo.tamanhoEscolhido='medium'; assert.equal(schema.safeParse(c).success,false);}const c=fresh();c.corpo.tamanhoEscolhido='medio';assert.equal(schema.safeParse(c).success,true);
});
// CASES
let failures=0;
for(const [id,test] of cases) {
 if(process.argv[2] && process.argv[2]!==id)continue;
 try { await test(); console.log('OK F5-'+id); }
 catch(e) { failures++;console.error('FALHA F5-'+id+': '+e.stack); }
}
if(failures)process.exitCode=1;
