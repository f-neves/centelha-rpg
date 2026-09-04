// test-editor-bestiario.mjs — dirige o editor de criaturas do /bestiario num Edge
// headless e confere que ele não mente: os derivados do modal têm de bater com o
// bloco impresso no card, campo a campo.
//
// Foi este teste que pegou os três erros da primeira versão: o porte vindo como
// rótulo ("Enorme") onde o calc.ts espera slug, a Integridade e a Prontidão que
// não sobrevivem no monsters.json (são entrada do gerador, não saída) e o botão
// de editar abrindo o infobox junto por compartilhar a classe .besta-info.
//
// uso: node scripts/test-editor-bestiario.mjs
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { subirDev } from './dev-server.mjs';
import { navegadorOuSair } from './navegador.mjs';
import { carimbar } from './carimbo.mjs';
// Cravado no Edge do Windows ate 04/09/2026: em outro sistema estourava dentro
// do puppeteer, sem dizer o que faltava. Ver `scripts/navegador.mjs`.
const EDGE = navegadorOuSair('editor do bestiario');
const dev=await subirDev();
const url=dev.url;
const browser=await puppeteer.launch({executablePath:EDGE,headless:'new',args:['--no-sandbox']});
let falhas=0; const ok=(c,m)=>{console.log(`  ${c?'✓':'✘'} ${m}`); if(!c)falhas++;};
try{
  const page=await browser.newPage();
  await page.setViewport({width:1400,height:1000});
  const erros=[]; page.on('pageerror',(e)=>erros.push(String(e)));
  // NAO E `networkidle0`, E NAO E LENTIDAO.
  //
  // Este teste rodou pela primeira vez fora do Windows em 04/09/2026 e estourou
  // os 30 s padrao do puppeteer. Subir o teto para 120 s nao adiantou: estourou
  // igual, e foi isso que disse o que era. `networkidle0` espera MEIO SEGUNDO
  // SEM NENHUMA CONEXAO ABERTA, e o /bestiario e a pagina mais pesada do site
  // (309 criaturas e o acervo de arte) servida pelo `astro dev`, que ainda
  // mantem o canal do recarregamento aberto. Esse silencio pode nunca vir, e
  // quando nao vem o teste nao falha: ele PENDURA ate o teto, que e a pior das
  // duas saidas.
  //
  // Esperar o que o teste PRECISA e a resposta certa, e ela e mais rapida: os
  // cartoes das criaturas no DOM. O `domcontentloaded` deixa a arte carregar
  // sozinha, e nenhuma asserçao daqui olha para imagem.
  await page.goto(`${url}/bestiario`,{waitUntil:'domcontentloaded',timeout:120000});
  //
  // E A ESPERA E PELOS 300 CARTOES, e nao pelo primeiro. O bestiario pinta
  // progressivamente: com `.besta` como condiçao, a pagina passava com 40 de 309
  // e a asserçao seguinte caia dizendo "40 de 40", que se le como acerto. Era o
  // `networkidle0` que segurava esse tempo por acidente, e trocar a espera sem
  // trocar a condiçao teria transformado um teste pendurado num teste errado.
  try {
    await page.waitForFunction(() => document.querySelectorAll('.besta').length > 300,
      {timeout: 60000, polling: 250});
  } catch (e) {
    // E SE NAO VIER, DIGA O QUE VEIO. Um `TimeoutError` cru custou duas
    // execuçoes de CI aqui e quatro no `test-grid`: ele diz que a espera acabou
    // e nao diz o que a pagina estava mostrando.
    const d = await page.evaluate(() => ({
      titulo: document.title,
      cards: document.querySelectorAll('.besta').length,
      corpo: (document.body.innerText || '').trim().slice(0, 200),
    })).catch(() => ({titulo: '(sem pagina)', cards: 0, corpo: ''}));
    console.error(`  ✘ o bestiario nao chegou a 300 cartoes em 60 s`);
    console.error(`    titulo: ${d.titulo}
    cards: ${d.cards}
    corpo: ${d.corpo}`);
    throw e;
  }

  // O PORTAO: sem administrador, os botoes nao aparecem.
  const visivelDeslogado = await page.evaluate(()=>{
    const b=document.querySelector('.besta-editar');
    return !!b && getComputedStyle(b).display!=='none';
  });
  ok(!visivelDeslogado,'deslogado NAO ve o botao Editar');
  // dali em diante o teste finge ser admin, que e o caso que interessa exercitar
  await page.evaluate(()=>document.body.classList.add('pode-editar'));

  const nCards=(await page.$$('.besta')).length, nEdit=(await page.$$('.besta-editar')).length;
  ok(nCards>300&&nEdit===nCards,`botao Editar em todas as criaturas (${nEdit} de ${nCards})`);
  ok(!!(await page.$('#mon-exemplo-espantalho')),'criatura do inimigos-custom.json aparece no bestiario');
  const esp=await page.$eval('#mon-exemplo-espantalho',(e)=>{
    const dd=[...e.querySelectorAll('.besta-stats dd')].map(x=>x.textContent.trim());
    const el=[...e.querySelectorAll('.besta-elem .el')].map(x=>x.textContent.trim());
    return {pv:dd[0],elem:el};
  });
  ok(esp.pv==='34',`criatura sua tem PV calculado pela formula (${esp.pv})`);
  ok(esp.elem.join(',')==='Fogo,Perfuração',`material madeira virou fraqueza e resistencia (${esp.elem.join(', ')})`);
  ok(!!(await page.$('#besta-nova')),'botao Nova criatura na barra');
  ok(await page.$eval('#editbox',(e)=>e.hidden),'modal comeca fechado');

  // abre o do Treant
  await page.evaluate(()=>{ document.querySelector('#mon-treant .besta-editar').click(); });
  await new Promise(s=>setTimeout(s,300));
  ok(!(await page.$eval('#editbox',(e)=>e.hidden)),'modal abre no clique');
  const nome=await page.$eval('[data-ed="nome"]',(e)=>e.value);
  ok(nome==='Treant',`nome veio preenchido (${nome})`);
  const vig=await page.$eval('[data-ed="atributos.vigor"]',(e)=>e.value);
  ok(vig==='8',`Vigor veio preenchido (${vig})`);
  const fogo=await page.$eval('.ed-el[data-el="fogo"]',(e)=>e.dataset.estado);
  ok(fogo==='1',`fraqueza a fogo marcada (estado ${fogo})`);
  const perf=await page.$eval('.ed-el[data-el="perfuracao"]',(e)=>e.dataset.estado);
  ok(perf==='2',`resistencia a perfuracao marcada (estado ${perf})`);
  const pv0=await page.$eval('#ed-der dd',(e)=>e.textContent);
  ok(pv0==='75',`PV derivado bate com o card, respeitando o porte Enorme (${pv0})`);

  // os derivados do modal tem de bater com o bloco impresso no card, sem excecao
  // Casa por RÓTULO, nunca por posição: o painel de derivados cresceu e um índice
  // fixo passou a comparar Iniciativa com outra coisa.
  const bate=await page.evaluate(()=>{
    const card=document.getElementById('mon-treant');
    const doCard={}; card.querySelectorAll('.besta-stats div').forEach(d=>{
      doCard[d.querySelector('dt').textContent.trim()]=d.querySelector('dd').textContent.trim();
    });
    const doModal={}; document.querySelectorAll('#ed-der div').forEach(d=>{
      doModal[d.querySelector('dt').textContent.trim()]=d.querySelector('dd').textContent.trim();
    });
    const par={};
    for (const k of ['PV','Defesa','Def. Social','Def. Mental','Iniciativa']) par[k]=[doCard[k],doModal[k]];
    return par;
  });
  for (const [k,[a,b]] of Object.entries(bate)) ok(a!=null&&a===b, `${k}: card ${a} = modal ${b}`);

  // muda o Vigor e ve o PV recalcular
  await page.$eval('[data-ed="atributos.vigor"]',(e)=>{e.value='10';e.dispatchEvent(new Event('input',{bubbles:true}));});
  await new Promise(s=>setTimeout(s,150));
  const pv1=await page.$eval('#ed-der dd',(e)=>e.textContent);
  ok(Number(pv1)>75,`PV recalcula ao vivo com Vigor 10 (75 -> ${pv1})`);

  // alterna um elemento
  await page.evaluate(()=>document.querySelector('.ed-el[data-el="raio"]').click());
  ok(await page.$eval('.ed-el[data-el="raio"]',(e)=>e.dataset.estado)==='1','clique marca fraqueza');
  await page.evaluate(()=>document.querySelector('.ed-el[data-el="raio"]').click());
  ok(await page.$eval('.ed-el[data-el="raio"]',(e)=>e.dataset.estado)==='2','segundo clique marca resistencia');

  ok(await page.$eval('#infobox',(e)=>e.hidden),'o infobox de Informacoes NAO abre junto');
  // A PASTA PRIMEIRO. `_shots/` e ignorada pelo git, entao existe nesta maquina
  // (alguem ja rodou isto aqui) e NAO existe num clone limpo: o teste passava
  // todas as asserçoes no CI e morria na ultima linha com ENOENT. E o terceiro
  // "passa aqui por causa de estado da maquina" do mesmo dia, junto com o
  // `.astro/types.d.ts` do `tsc` e o `.env` da bancada.
  fs.mkdirSync('_shots', {recursive: true});
  await page.screenshot({path:'_shots/editor-modal.png'});

  // salvar e conferir que persiste
  await page.evaluate(()=>document.getElementById('ed-salvar').click());
  await new Promise(s=>setTimeout(s,200));
  const salvo=await page.evaluate(()=>JSON.parse(localStorage.getItem('centelha:bestiario:edicoes')||'{}'));
  ok(!!salvo['mon-treant'],'edicao gravada no localStorage');
  ok(salvo['mon-treant']?.atributos?.vigor===10,`Vigor gravado (${salvo['mon-treant']?.atributos?.vigor})`);
  ok(await page.$eval('#mon-treant',(e)=>e.classList.contains('editada')),'card marcado como editado');

  // reverter
  await page.evaluate(()=>document.getElementById('ed-reverter').click());
  await new Promise(s=>setTimeout(s,200));
  const depois=await page.evaluate(()=>JSON.parse(localStorage.getItem('centelha:bestiario:edicoes')||'{}'));
  ok(!depois['mon-treant'],'reverter apaga a edicao');

  // criatura nova
  await page.evaluate(()=>document.querySelector('.ed-fechar').click());
  await page.evaluate(()=>document.getElementById('besta-nova').click());
  await new Promise(s=>setTimeout(s,250));
  ok(await page.$eval('#ed-titulo',(e)=>e.textContent)==='Nova criatura','botao Nova abre em branco');
  ok(await page.$eval('[data-ed="nome"]',(e)=>e.value)==='','nome vazio na criatura nova');

  ok(erros.length===0,`sem erro de JS na pagina${erros.length?': '+erros[0]:''}`);
}finally{
  await browser.close();
  await dev.parar();
}
console.log(falhas?`\n✘ ${falhas} falha(s)`:'\n✓ editor OK');
process.exit(falhas?1:0);

// O carimbo: quando este portao passou nesta maquina. Ver `carimbo.mjs`.
// Aqui embaixo porque o codigo so chega ate aqui quando nao houve falha: quem
// falha sai por `process.exit(1)` antes.
carimbar('test-editor-bestiario');
