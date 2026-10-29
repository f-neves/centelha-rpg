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
cases.set('3', async () => {
const r=conv(variant('Escavação: Batalha 2'));assert.equal(r.criatura.formas.find(f=>f.id==='humana').deslocamento?.escavacao?.batalha,2); assert.ok(!r.paradas.some(x=>/Escavação/.test(x)));
});
cases.set('4', async () => {
for(const [rot,id] of [['Voo','voo'],['Nado','nado'],['Escalada','escalada'],['Escavação','escavacao']]){const r=conv(variant(rot+': Batalha 2, Arranque 4, Corrida 6'));assert.deepEqual(r.criatura.formas.find(f=>f.id==='humana').deslocamento[id],{batalha:2,arranque:4,corrida:6});}
});
cases.set('6', async () => {
const c=fresh(); c.formas[0].bolsas=[{nome:'sacola',itens:[{item:'corda',peso:1,preco:2}]}]; assert.equal(schema.safeParse(c).success,true);const f=M.comForma(c,c.formas[0]);assert.deepEqual(f.bolsas,c.formas[0].bolsas);c.formas[0].bolsas[0].itens[0].peso='um';assert.equal(schema.safeParse(c).success,false);
});
cases.set('8', async () => {
for(const attrs of [{froca:3},{forca:-1}]){const c=fresh();c.formas[0].atributos=attrs;assert.equal(schema.safeParse(c).success,false);}const c=fresh();c.formas[0].atributos={forca:0};assert.equal(schema.safeParse(c).success,true);
});
cases.set('9', async () => {
for(const k of ['couraca','aparencia']){const c=fresh();c.formas[0][k]=13;assert.equal(schema.safeParse(c).success,false);c.formas[0][k]=12;assert.equal(schema.safeParse(c).success,true);}
});
cases.set('10', async () => {
for(const form of [false,true])for(const arts of [{'arte-inventada':2},{fogo:-1}]){const c=fresh();(form?c.formas[0]:c).artes=arts;assert.equal(schema.safeParse(c).success,false);}const c=fresh();c.formas[0].artes={fogo:0};assert.equal(schema.safeParse(c).success,true);
});
cases.set('12', async () => {
for(const change of [{semMassa:true},{volume:1}]){const c=fresh();if(change.semMassa)delete c.corpo.massa;Object.assign(c.corpo,change);assert.equal(schema.safeParse(c).success,false);}const c=fresh();delete c.corpo.massa;Object.assign(c.corpo,{semMassa:true,volume:1});assert.equal(schema.safeParse(c).success,true);
});
cases.set('14', async () => {
const c=fresh();c.corpo.segundoTamanho={area:2,posturaDoTamanho:''};assert.equal(schema.safeParse(c).success,false);c.corpo.segundoTamanho.posturaDoTamanho='   ';assert.equal(schema.safeParse(c).success,false);c.corpo.segundoTamanho.posturaDoTamanho='de lado';assert.equal(schema.safeParse(c).success,true);const r=conv(raw.replace(/(\| Segundo Tamanho \| )[^|]+/,'$1**Grande** (2 m²) '));assert.ok(r.paradas.some(x=>/postura|posturaDoTamanho/i.test(x)));
});
cases.set('15', async () => {
for(const k of ['respiracao','mente','tracos']){const c=fresh();delete c.fisiologia[k];assert.equal(schema.safeParse(c).success,false);c.fisiologia[k]='';assert.equal(schema.safeParse(c).success,false);}const c=fresh();c.formas[0].fisiologia={mente:'humana'};assert.equal(schema.safeParse(c).success,true);for(const rot of ['Respiração','Mente','Traços']){const md=raw.split('\n').filter(l=>!l.startsWith('- '+rot+':')).join('\n');assert.ok(conv(md).paradas.some(x=>/fisiologia/.test(x)));}
});
cases.set('16', async () => {
for(const k of ['social','atividade','dieta','caca','dianteDeGente']){const c=fresh();c.comportamento[k]=' ';assert.equal(schema.safeParse(c).success,false);}const c=fresh();c.descricao='';assert.equal(schema.safeParse(c).success,false);const r=conv(raw.split('\n').filter(l=>!l.startsWith('| Texto curto |')).join('\n'));assert.ok(r.paradas.some(x=>/descricao/.test(x)));assert.equal(r.criatura.descricao,undefined);
});
cases.set('17', async () => {
for(const k of ['arranque','corrida']){const c=fresh();delete c.deslocamento.terra[k];assert.equal(schema.safeParse(c).success,false);}const c=fresh();c.deslocamento={voo:{batalha:2}};assert.equal(schema.safeParse(c).success,true);
});
cases.set('21', async () => {
for(const v of ['sim','sim (-2)']){const md=raw.replace(/^(\| Garras \|[^\n]+)/m,l=>{const a=l.split('|');a[10]=' '+v+' ';return a.join('|');});const r=conv(md);if(v==='sim')assert.ok(r.paradas.some(x=>/Bloqueia como arma/.test(x)));else assert.equal(r.criatura.ataques.find(x=>x.nome==='Garras').bloqueiaComoArma,-2);}
});
cases.set('22', async () => {
const r=conv(variant('Postura: indescritível'));assert.ok(r.paradas.some(x=>/apoio/.test(x)));const q=conv(variant('Postura: serpente sem pernas'));assert.equal(q.criatura.formas.find(f=>f.id==='humana').corpo.apoio,'outro');
});
cases.set('18', async () => {
const c=fresh();c.habilidadesEspeciais=[{nome:'teste',formas:'todas',classe:'regra da ficha',efeito:'algo'}];assert.equal(schema.safeParse(c).success,false);c.habilidadesEspeciais=[{nome:'teste',formas:'todas',classe:'sem regra ainda',efeito:'algo',tecnica:{id:'teste',nivel:1}}];assert.equal(schema.safeParse(c).success,false);c.habilidadesEspeciais=[{nome:'teste',formas:'todas',classe:'livro',regra:'agarrar',dano:'1d6'}];assert.equal(schema.safeParse(c).success,false);c.habilidadesEspeciais=[{nome:'teste',formas:'todas',classe:'sem regra ainda',efeito:'sem número'}];assert.equal(schema.safeParse(c).success,true);
});
// CASES
let failures=0;
for(const [id,test] of cases) {
 if(process.argv[2] && process.argv[2]!==id)continue;
 try { await test(); console.log('OK F5-'+id); }
 catch(e) { failures++;console.error('FALHA F5-'+id+': '+e.stack); }
}
if(failures)process.exitCode=1;
