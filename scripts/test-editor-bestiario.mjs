// O editor importa e exporta a fonte unificada e mostra contas do motor, sem gravar derivados na fonte.
import puppeteer from 'puppeteer-core';
import { subirDev } from './dev-server.mjs';
import { navegadorOuSair } from './navegador.mjs';
import { carimbar } from './carimbo.mjs';
const dev=await subirDev();
const browser=await puppeteer.launch({executablePath:navegadorOuSair('editor de criatura'),headless:true,args:['--no-sandbox']});
const falhas=[];const ok=(c,m)=>{console.log((c?'✓ ':'✘ ')+m);if(!c)falhas.push(m);};
try {
  const p=await browser.newPage();const erros=[];p.on('pageerror',e=>erros.push(String(e)));
  await p.setRequestInterception(true);
  p.on('request',r=>/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(r.url())||r.url().startsWith('data:')?r.continue():r.abort());
  await p.goto(dev.url+'/bestiario',{waitUntil:'domcontentloaded',timeout:120000});
  await p.waitForSelector('#besta-nova',{timeout:60000});
  await p.evaluate(()=>{document.body.classList.add('pode-editar');document.querySelectorAll('template.besta-adiada').forEach(t=>t.replaceWith(t.content.cloneNode(true)));});
  await p.click('#besta-nova');
  await p.waitForFunction(()=>!document.getElementById('editbox').hidden&&document.getElementById('ed-json').value.length>0);
  ok(await p.$eval('#ed-der',e=>JSON.parse(e.textContent).pv===31),'nova criatura: 31 PV pelo motor');
  await p.$eval('#ed-fonte',e=>{const c=JSON.parse(e.value);c.atributos.vigor=4;e.value=JSON.stringify(c);e.dispatchEvent(new Event('input',{bubbles:true}));});
  ok(await p.$eval('#ed-der',e=>JSON.parse(e.textContent).pv===37),'editar Vigor recalcula 37 PV');
  const fonte=await p.$eval('#ed-json',e=>JSON.parse(e.value));
  ok(fonte.atributos.vigor===4&&fonte.virtudes.bravura===1&&!('pv'in fonte)&&!('attrs'in fonte),'exportação usa nomes unificados e não grava PV');
  await p.click('#ed-salvar');
  ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('centelha:bestiario:edicoes-v3'))['criatura-nova'].atributos.vigor===4),'rascunho salvo no formato novo');
  await p.$eval('#ed-fonte',e=>{const c=JSON.parse(e.value);c.pv=999;e.value=JSON.stringify(c);e.dispatchEvent(new Event('input',{bubbles:true}));});
  ok(await p.$eval('#ed-json',e=>e.value===''),'campo calculado é recusado pelo esquema');
  await p.click('#ed-fechar');await p.$eval('#solar .besta-editar',e=>e.click());
  try { await p.waitForFunction(()=>!document.getElementById('editbox').hidden&&document.getElementById('ed-fonte').value.includes('solar'),{timeout:30000}); } catch(e) { console.log(await p.evaluate(()=>({status:document.getElementById('ed-status').textContent,fonte:document.getElementById('ed-fonte').value.slice(0,100)})),erros);throw e; }
  const solar=await p.$eval('#ed-der',e=>JSON.parse(e.textContent));
  ok(solar.ataques.find(a=>a.nome==='Arco longo')?.danoMedio===20.5,'Solar no editor respeita o teto do arco, 20,5');
  ok(await p.$eval('#ed-fonte',e=>JSON.parse(e.value).revisao.length===0),'fonte pública não traz a revisão privada');
  ok(erros.length===0,'nenhum erro de página: '+erros.join('; '));
} finally {await browser.close();await dev.parar();}
if(falhas.length)process.exitCode=1;else{carimbar('test-editor-bestiario');console.log('✓ editor unificado OK');}
