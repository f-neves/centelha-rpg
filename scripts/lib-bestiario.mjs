// Leitura das fontes unificadas. Toda conta vem de src/lib/motor.ts.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { vistaCriatura } from './lib-criatura-motor.mjs';
import { criaturaParaLeituraSchema } from './criatura-schema.mjs';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const PASTA=path.join(ROOT,'src/data/bestiario');
export function lerCriaturas(){
  const fontes=fs.readdirSync(PASTA).filter(f=>f.endsWith('.json')).map(f=>{
    const c=JSON.parse(fs.readFileSync(path.join(PASTA,f),'utf8'));criaturaParaLeituraSchema.parse(c);
    if(f!==c.id+'.json')throw Error('id diferente do arquivo: '+f);
    return vistaCriatura(c);
  });
  const customPath=path.join(ROOT,'src/data/inimigos-custom.json');
  const custom=fs.existsSync(customPath)?JSON.parse(fs.readFileSync(customPath,'utf8')).map(c=>{criaturaParaLeituraSchema.parse(c);return vistaCriatura(c)}):[];
  const todos=[...fontes,...custom];
  const ids=new Set();for(const c of todos){if(ids.has(c.id))throw Error('id repetido: '+c.id);ids.add(c.id)}
  return todos.sort((a,b)=>(a.ordem??Infinity)-(b.ordem??Infinity)||a.id.localeCompare(b.id));
}
