// As formas da fonte unificada chegam ao card e à mesa, e o editor usa o mesmo contrato.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { carregarTS } from './lib-ts.mjs';
import { criaturaNovaSchema } from './criatura-schema.mjs';

const falhas=[];const ok=(c,m)=>{if(!c)falhas.push(m);console.log((c?'  ✓ ':'  ✘ ')+m)};
const erro=fn=>{try{fn();return null}catch(e){return e.message}};
const lobFonte=JSON.parse(fs.readFileSync(new URL('../src/data/bestiario/lobisomem.json',import.meta.url),'utf8'));
ok(criaturaNovaSchema.safeParse(lobFonte).success,'Lobisomem: formas no esquema unificado');
ok(!criaturaNovaSchema.safeParse({...lobFonte,formas:[{id:'human',nome:'humana',bloqueio:0}]}).success,'forma recusa Bloqueio fixo');
ok(!criaturaNovaSchema.safeParse({...lobFonte,formas:[{id:'human',nome:'humana',musculatura:0}]}).success,'forma recusa Musculatura fixa');

// A7: cada forma pública recebe os PV de referência da ficha e os itens da sua marca.
const ref = JSON.parse(fs.readFileSync(new URL('./fixtures/criaturas-esperado.json',import.meta.url),'utf8'));
const monstros = JSON.parse(fs.readFileSync(new URL('../src/data/monsters.json',import.meta.url),'utf8'));
let formasConferidas = 0;
for (const m of monstros) {
  ok(!('notas' in m) && !('pendente' in m), m.id + ': notas de trabalho fora do público');
  for (const f of m.formas || []) {
    formasConferidas++;
    const esperado = ref.criaturas[m.id]?.formas?.[f.id]?.esperado;
    if (esperado?.pv !== undefined) ok(f.criatura.combate.pv === esperado.pv, m.id + '/' + f.id + ': PV da ficha');
    ok(f.criatura.formaPrincipal.id === f.id, m.id + '/' + f.id + ': identidade da forma');
    ok(!f.criatura.formas.length, m.id + '/' + f.id + ': sem recursão de formas');
  }
}
const lobisomem = monstros.find(m=>m.id==='lobisomem');
const humana = lobisomem.formas.find(f=>f.id==='humana').criatura;
ok(humana.atributos.forca === 4 && humana.combate.pv === 37, 'forma humana: Força 4 e PV 37, escritos na ficha');
ok(!humana.habilidadesEspeciais.some(h=>h.nome==='Mordida que derruba e amaldiçoa'), 'Mordida fora da forma humana');
ok(lobisomem.habilidadesEspeciais.some(h=>h.nome==='Mordida que derruba e amaldiçoa'), 'Mordida presente na forma híbrida');
ok(formasConferidas > 0, formasConferidas + ' formas geradas conferidas');

// A8: duas instâncias da mesma espécie mantêm escolhas independentes e os ajustes vencem.
const mesa = await carregarTS('src/lib/mesa-bestiario.ts');
const a={id:'__a8_a',tipo:'criatura',monstro_id:'lobisomem',dados:{}}, b={...a,id:'__a8_b'};
const antes = JSON.stringify(mesa.MON.lobisomem), dadosAntes = JSON.stringify(a);
const principal = mesa.resumoDe(b);
mesa.escolherFormaDaPeca(a,'humana');
ok(mesa.resumoDe(a).atributos.forca===4 && mesa.resumoDe(a).pv===37, 'instância humana recebe Força 4 e PV 37 do motor');
ok(mesa.resumoDe(b).pv===principal.pv && mesa.formaEscolhidaDaPeca(b)===null, 'outra instância continua na principal');
ok(JSON.stringify(mesa.MON.lobisomem)===antes && JSON.stringify(a)===dadosAntes, 'nem a espécie nem os dados da peça são regravados');
const ajustada={...a,dados:{pv:99,defesa:77,velocidade:2,ataque:'6d6',dano:'3d6',soak:{corte:13}}};
const ajuste=mesa.resumoDe(ajustada);
ok(ajuste.pv===99 && ajuste.defesa===77 && ajuste.velocidade===2 && ajuste.ataque==='6d6' && ajuste.dano==='3d6' && ajuste.soak.corte===13, 'todos os ajustes do Mestre vencem a forma');
ok(erro(()=>mesa.escolherFormaDaPeca(a,'forma-inexistente'))!==null, 'recusa forma de outra criatura');
mesa.escolherFormaDaPeca(a,'hibrida');
ok(mesa.resumoDe(a).pv===principal.pv, 'retorna à forma principal');

// Pontas, 2(b) (30/10/2026): a forma do dragão dourado mudou de id no lote fase5-18 ("humana-ou-de-animal-pequeno"
// para "humana"); a peça guardada neste aparelho com o id antigo vai à forma nova (RENOMES_FORMA), e não à principal.
{
  const guardado = { __ren_dd: 'humana-ou-de-animal-pequeno' };
  const ls0 = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => JSON.stringify(guardado), setItem() {} } });
  try {
    const velha = { id: '__ren_dd', tipo: 'criatura', monstro_id: 'dragao-dourado-adulto', dados: {} };
    const nova = { ...velha, id: '__ren_dd_nova' };
    mesa.escolherFormaDaPeca(nova, 'humana');
    const dd = mesa.MON['dragao-dourado-adulto'];
    ok(mesa.formaEscolhidaDaPeca(velha) === 'humana', 'peça com o id antigo da forma: lê "humana"');
    ok(mesa.modeloDaPeca(velha)?.formaPrincipal?.id === 'humana', 'peça com o id antigo da forma: o modelo é o da forma humana');
    ok(JSON.stringify(mesa.resumoDe(velha)) === JSON.stringify(mesa.resumoDe(nova)), 'peça com o id antigo: o mesmo resumo da forma nova');
    ok(JSON.stringify(mesa.resumoDe(velha)) !== JSON.stringify(mesa.resumoDe({ ...velha, id: '__ren_dd_principal' })), 'e não o da principal');
    ok(mesa.modeloNaForma(dd, 'humana-ou-de-animal-pequeno')?.formaPrincipal?.id === 'humana', 'card aberto com o id antigo: a forma humana');
    for (const [mid, mapa] of Object.entries(mesa.RENOMES_FORMA)) for (const [de, para] of Object.entries(mapa)) {
      ok(!mesa.MON[mid]?.formas?.some((f) => f.id === de), `RENOMES_FORMA ${mid}: o id antigo ${de} não existe mais`);
      ok(mesa.MON[mid]?.formas?.some((f) => f.id === para), `RENOMES_FORMA ${mid}: o id novo ${para} existe`);
    }
  } finally {
    if (ls0) Object.defineProperty(globalThis, 'localStorage', ls0); else delete globalThis.localStorage;
  }
}

// A9: fonte exportada pelo editor é a mesma entrada do motor, sem derivados gravados.
const editor = await carregarTS('src/lib/bestia-editor.ts');
const nova = editor.novaCriatura();
// O editor abre rascunho sem texto inventado. A conta começa depois de quem edita preencher os obrigatórios.
nova.fisiologia={respiracao:'respira ar',mente:'raciocina',tracos:'corpo de teste'};
nova.comportamento={social:'sozinho',atividade:'diurna',dieta:'onívora',caca:'não caça',dianteDeGente:'cauteloso'};
nova.descricao='Criatura de teste.';
ok(editor.derivados(nova).pv===31, 'editor: corpo humano de 80 kg e Vigor 2 tem 31 PV');
nova.atributos.vigor=4;
ok(editor.derivados(nova).pv===37, 'editor: Vigor 4 recalcula 37 PV pelo motor');
ok(erro(()=>editor.paraJson({...nova,pv:999}))!==null, 'editor recusa PV calculado no JSON-fonte');
for (const m of monstros) {
  const fonte={...m.edicao,revisao:[]};
  const exportada=JSON.parse(editor.paraJson(fonte));
  ok(editor.derivados(exportada).pv===m.combate.pv, m.id+': editor e card têm o mesmo PV');
  ok(!Object.hasOwn(m.edicao,'revisao'), m.id+': fonte pública sem revisão');
}

// A10: a CLI confere o número da ficha e recusa uma divergência plantada.
const caso=path.resolve('scripts/fixtures/conversor/ghaele-azata.md');
const cli=(arquivo)=>spawnSync(process.execPath,['scripts/motor-criatura.mjs','--ficha',arquivo],{encoding:'utf8'});
const bom=cli(caso);
ok(bom.status===0 && JSON.parse(bom.stdout).numeros.pv===40,'conferidor: ficha correta e PV 40');
const pastaCaso=fs.mkdtempSync(path.join(os.tmpdir(),'centelha-a10-'));
const arquivoMutado=path.join(pastaCaso,'ghaele-azata.md');
try {
  const alterada=fs.readFileSync(caso,'utf8').replace('"pv":40','"pv":41');
  ok(alterada!==fs.readFileSync(caso,'utf8'),'controle negativo alterou o PV declarado');
  fs.writeFileSync(arquivoMutado,alterada);
  const ruim=cli(arquivoMutado);
  ok(ruim.status===1 && ruim.stderr.includes('motor 40, ficha 41'),'conferidor acusa PV divergente');
} finally { if(fs.existsSync(arquivoMutado))fs.unlinkSync(arquivoMutado); fs.rmdirSync(pastaCaso); }

if (falhas.length) { console.error(`\n✘ formas: ${falhas.length} falha(s)`); process.exit(1); }
console.log('\n✓ formas: fonte, card, mesa e editor conferidos');
