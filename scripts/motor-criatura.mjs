// Linha de comando comum ao conferidor e às ferramentas locais do autor. Só lê as fichas.
import fs from 'node:fs';
import path from 'node:path';
import { carregarTS } from './lib-ts.mjs';
import { converterFicha } from './conversor-criatura.mjs';
import { lerEsperado } from './gen-criaturas-esperado.mjs';
import { lerFichaMd, slug } from './lib-ficha-md.mjs';
import { criaturaNovaSchema } from './criatura-schema.mjs';
const M=await carregarTS('src/lib/motor.ts');
const args=process.argv.slice(2), valor=k=>{const i=args.indexOf(k);return i<0?null:args[i+1];};
const erros=[]; let contas=0, avisos=0;
function confere(id,k,real,esperado) {
  if (esperado===undefined) return;
  contas++;
  const tolerancia=k.includes('pesoErguido')&&typeof esperado==='number' ? Math.max(.02,Math.abs(esperado)*.01) : 1e-8;
  const igual=typeof real==='number'&&typeof esperado==='number' ? Math.abs(real-esperado)<=tolerancia : real===esperado;
  if(!igual)erros.push(id+': '+k+', motor '+JSON.stringify(real)+', ficha '+JSON.stringify(esperado));
}
function compara(id,r,x) {
  for(const k of ['pv','faixa','pesoErguido','esquiva','bloqueio','defesaMental','defesaSocial','iniciativa','energia','mana'])confere(id,k,r[k],x[k]);
  for(const k of ['tamanho','segundoTamanho'])if(x[k])confere(id,k,r[k],slug(x[k]));
  for(const [k,v] of Object.entries(x.absorcao||{}))confere(id,'absorcao.'+k,r.absorcao?.[k],v);
  for(const [k,v] of Object.entries(x.comEquipamento||{}))confere(id,'comEquipamento.'+k,r.comEquipamento?.[k],v);
  for(const a of x.ataques||[]) {
    const n=r.ataques.find(b=>b.nome===a.nome);if(!n){erros.push(id+': ataque ausente '+a.nome);continue;}
    confere(id,a.nome+'.velocidade',n.velocidade,a.velocidade);confere(id,a.nome+'.danoMedio',n.danoMedio,a.danoMedio);
    if(a.jogada!==undefined)confere(id,a.nome+'.jogada',n.jogada-(n.acerto||0),a.jogada);
  }
}
function ficha(arquivo) {
  const texto=fs.readFileSync(arquivo,'utf8');const id=path.basename(arquivo,'.md');
  const sitePath=new URL('../src/data/bestiario/'+id+'.json',import.meta.url);
  const site=fs.existsSync(sitePath)?JSON.parse(fs.readFileSync(sitePath,'utf8')):null;
  const c=converterFicha(texto,{site});
  avisos+=c.avisos.length;
  if(c.paradas.length){erros.push(...c.paradas.map(p=>id+': '+p));return null;}
  const esperado=lerEsperado(texto);
  erros.push(...esperado.nao.map(p=>id+': número não lido: '+p));
  const r=M.criatura(c.criatura);compara(id,r,esperado.esperado);
  const formas={};
  for(const [fid,fo] of Object.entries(esperado.formas)) {
    const muda=c.criatura.formas?.find(f=>f.id===fid);if(!muda){erros.push(id+': forma ausente '+fid);continue;}
    const n=M.criatura(M.comForma(c.criatura,muda));compara(id+'/'+fid,n,fo);formas[fid]=n;
  }
  return {id,numeros:r,formas};
}
const pasta=valor('--conferir'), arquivo=valor('--ficha'), entrada=valor('--entrada');
if(pasta) {
  let fichas=0;const antes=valor('--antes');
  for(const nome of fs.readdirSync(pasta).filter(n=>n.endsWith('.md')).sort()) {
    fichas++;const atual=path.join(pasta,nome);ficha(atual);
    if(antes&&fs.existsSync(path.join(antes,nome))) {
      const de=lerFichaMd(fs.readFileSync(path.join(antes,nome),'utf8')),para=lerFichaMd(fs.readFileSync(atual,'utf8'));
      for(const sec of Object.keys(de.secoes))if(!(sec in para.secoes))erros.push(nome+': seção retirada '+sec);
    }
  }
  for(const e of erros)console.error(e);
  console.log(fichas+' fichas · '+contas+' contas pelo motor · '+erros.length+' erros · '+avisos+' avisos de leitura');
} else if(arquivo) {
  const r=ficha(arquivo);if(r)console.log(JSON.stringify(r,null,2));
  for(const e of erros)console.error(e);
} else if(entrada) {
  const c=criaturaNovaSchema.parse(JSON.parse(fs.readFileSync(entrada,'utf8')));
  const fid=valor('--forma'),fo=fid?c.formas?.find(f=>f.id===fid):null;
  if(fid&&!fo)throw Error('Forma inexistente: '+fid);
  console.log(JSON.stringify(M.criatura(fo?M.comForma(c,fo):c),null,2));
} else { console.error('uso: node scripts/motor-criatura.mjs --conferir pasta [--antes pasta] | --ficha arquivo.md | --entrada arquivo.json [--forma id]');process.exitCode=2; }
if(erros.length)process.exitCode=1;
