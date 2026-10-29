// A5: relatório por criatura e chave, contra uma revisão explícita do Git.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const [base, saida] = process.argv.slice(2);
if (!base || !saida) throw Error('uso: node scripts/comparar-criaturas.mjs <revisão anterior> <relatório.json>');
const arquivos = ['inimigos.json','monsters.json','monsters-mesa.json'];
const rel = {base, arquivos:{}};
function dif(a,b,caminho,out) {
  if(JSON.stringify(a)===JSON.stringify(b)) return;
  if(a && b && typeof a==='object' && typeof b==='object' && !Array.isArray(a) && !Array.isArray(b)) {
    for(const k of new Set([...Object.keys(a),...Object.keys(b)])) dif(a[k],b[k],caminho?caminho+'.'+k:k,out);
  } else out.push({chave:caminho,presenteAntes:a !== undefined,presenteDepois:b !== undefined,antes:a ?? null,depois:b ?? null});
}
for(const nome of arquivos) {
  const antes=JSON.parse(execFileSync('git',['show',base+':src/data/'+nome],{encoding:'utf8',maxBuffer:16*1024*1024}));
  const depois=JSON.parse(fs.readFileSync('src/data/'+nome,'utf8'));
  const a=new Map(antes.map(c=>[c.id,c])),b=new Map(depois.map(c=>[c.id,c]));
  const criaturas={};
  for(const id of new Set([...a.keys(),...b.keys()])) {const d=[];dif(a.get(id),b.get(id),'',d);if(d.length)criaturas[id]=d;}
  rel.arquivos[nome]={antes:antes.length,depois:depois.length,alteradas:Object.keys(criaturas).length,criaturas};
}
fs.writeFileSync(saida,JSON.stringify(rel,null,2)+'\n');
console.log(Object.entries(rel.arquivos).map(([k,v])=>k+': '+v.alteradas+' criaturas alteradas').join('\n'));
