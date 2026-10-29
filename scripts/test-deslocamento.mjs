// As três velocidades publicadas vêm do modo de deslocamento declarado na fonte.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {criaturaNovaSchema} from './criatura-schema.mjs';
const raiz=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pasta=path.join(raiz,'src/data/bestiario');
const mon=JSON.parse(fs.readFileSync(path.join(raiz,'src/data/monsters.json'),'utf8'));
const porId=Object.fromEntries(mon.map(m=>[m.id,m]));
const falhas=[];let conferidas=0;const valores=new Set();
for(const nome of fs.readdirSync(pasta).filter(n=>n.endsWith('.json'))){
  const c=JSON.parse(fs.readFileSync(path.join(pasta,nome),'utf8'));
  const d=c.deslocamento.terra??Object.values(c.deslocamento)[0];
  const esperado={batalha:d.batalha,arranque:d.arranque??d.batalha,corrida:d.corrida??d.batalha};
  const visto=porId[c.id]?.combate.deslocamento;
  if(JSON.stringify(visto)!==JSON.stringify(esperado))falhas.push(c.id+': deslocamento diverge da ficha');
  if(!(visto?.batalha<=visto?.arranque&&visto?.arranque<=visto?.corrida))falhas.push(c.id+': velocidades fora de ordem');
  valores.add(visto?.batalha);conferidas++;
}
const exemplo=JSON.parse(fs.readFileSync(path.join(pasta,'lobisomem.json'),'utf8'));
for(const ruim of [-.5,Infinity,NaN]){const teste={...exemplo,deslocamento:{terra:{batalha:ruim}}};if(criaturaNovaSchema.safeParse(teste).success)falhas.push('aceitou velocidade inválida '+ruim)}
if(conferidas!==324||valores.size<5)falhas.push('cobertura ou variedade insuficiente: '+conferidas+' / '+valores.size);
if(falhas.length){console.error(falhas.slice(0,15).join('\n'));process.exit(1)}
console.log('✓ Deslocamento: '+conferidas+' fontes, três velocidades declaradas, '+valores.size+' passos distintos');
