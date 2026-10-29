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
// CASES
let failures=0;
for(const [id,test] of cases) {
 if(process.argv[2] && process.argv[2]!==id)continue;
 try { await test(); console.log('OK F5-'+id); }
 catch(e) { failures++;console.error('FALHA F5-'+id+': '+e.stack); }
}
if(failures)process.exitCode=1;
