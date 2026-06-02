// rasterize.mjs — rasteriza páginas do PDF em PNG para inspeção
// uso: node rasterize.mjs [pag1 pag2 ...]   (1-based; default: algumas amostras)
import { pdf } from 'pdf-to-img';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const PDF = path.join(ROOT,'New_RPG_System_D6_Livro.pdf');
const DIR = path.join(ROOT,'_pages');
fs.mkdirSync(DIR,{recursive:true});

const want = process.argv.slice(2).map(Number).filter(Boolean);
const doc = await pdf(PDF, { scale: 2.1 });
console.log('total de páginas:', doc.length);
let i=0; const saved=[];
for await (const img of doc){
  i++;
  if(want.length && !want.includes(i)) continue;
  if(!want.length && ![1,2,3,6,12,20,28,34].includes(i)) continue;
  const f = path.join(DIR, `p${String(i).padStart(2,'0')}.png`);
  fs.writeFileSync(f, img);
  saved.push(path.basename(f));
}
console.log('salvos:', saved.join(', '));
