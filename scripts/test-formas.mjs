// test-formas.mjs · o campo `transforma` de quem muda de forma (D-201; manual §5.2, item 1).
//
// O QUE ISTO GUARDA. A ficha diz as formas numa linha da Identidade ("forma híbrida (esta
// ficha) · forma humana · forma de lobo"), e o conversor grava na fonte o objeto que o site
// vai usar para alternar entre elas. A leitura mora em `formasDaFicha` (lib-ficha-v3.mjs),
// e este teste a cobra com textos escritos aqui: nenhuma ficha de criatura que muda de forma
// está em fichas-v3 ainda. Cobra também o esquema, que recusa `principal` diferente da
// primeira forma e lista com uma forma só.
//
//   node scripts/test-formas.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { carregarTS } from './lib-ts.mjs';
import { formasDaFicha, idDaForma } from './lib-ficha-v3.mjs';
import { criaturaSchema } from './criatura-schema.mjs';

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const erro = (fn) => { try { fn(); return null; } catch (e) { return e.message; } };
const VARIANTES = ['forma humana', 'forma de lobo', 'Adulto'];

console.log('· o caso certo');
const certo = formasDaFicha('**forma híbrida (esta ficha) · forma humana · forma de lobo**', VARIANTES);
const esperado = {
  principal: 'hibrida',
  formas: [
    { id: 'hibrida', nome: 'forma híbrida' },
    { id: 'humana', nome: 'forma humana' },
    { id: 'lobo', nome: 'forma de lobo' },
  ],
};
ok(JSON.stringify(certo) === JSON.stringify(esperado), `o objeto, campo a campo: ${JSON.stringify(certo)}`);
ok(formasDaFicha('forma híbrida (esta ficha) · forma humana', VARIANTES).formas.length === 2, 'sem `**` em volta, e com duas formas');

console.log('· o id');
ok(idDaForma('forma de névoa') === 'nevoa', `"forma de névoa" dá "${idDaForma('forma de névoa')}"`);
ok(idDaForma('forma de lobo atroz') === 'lobo-atroz', `"forma de lobo atroz" dá "${idDaForma('forma de lobo atroz')}"`);
ok(idDaForma('Forma Dos Ratos') === 'ratos', `"Forma Dos Ratos" dá "${idDaForma('Forma Dos Ratos')}" (palavra inteira, sem caixa)`);
ok(idDaForma('forma dama') === 'dama', `"forma dama" dá "${idDaForma('forma dama')}" ("da" só como palavra inteira)`);

console.log('· os quatro erros');
const e1 = erro(() => formasDaFicha('forma híbrida (esta ficha)', VARIANTES));
ok(/uma forma só/.test(e1 || ''), `uma forma só: ${e1}`);
const e2 = erro(() => formasDaFicha('forma híbrida · forma humana', VARIANTES));
ok(/primeira forma não termina em "\(esta ficha\)"/.test(e2 || ''), `a primeira sem "(esta ficha)": ${e2}`);
const e2b = erro(() => formasDaFicha('forma híbrida (esta ficha) · forma humana (esta ficha)', VARIANTES));
ok(/só a primeira forma leva/.test(e2b || ''), `outra com "(esta ficha)": ${e2b}`);
const e3 = erro(() => formasDaFicha('forma híbrida (esta ficha) · forma de rato', VARIANTES));
ok(/"forma de rato" não tem a linha de mesmo nome em Variantes/.test(e3 || ''), `forma sem linha em Variantes: ${e3}`);
const e3b = erro(() => formasDaFicha('forma híbrida (esta ficha) · Forma humana', VARIANTES));
ok(/não tem a linha de mesmo nome/.test(e3b || ''), `o nome tem de ser igual letra por letra ("Forma humana" contra "forma humana"): ${e3b}`);
const e4 = erro(() => formasDaFicha('forma de lobo (esta ficha) · forma do lobo', ['forma do lobo']));
ok(/dois ids iguais \("lobo"\)/.test(e4 || ''), `dois ids iguais: ${e4}`);

console.log('· o esquema');
const campo = (t) => criaturaSchema.shape.transforma.safeParse(t).success;
ok(campo(esperado), 'aceita o objeto certo');
ok(!campo({ ...esperado, principal: 'humana' }), 'recusa `principal` que não é o id da primeira forma');
ok(!campo({ principal: 'hibrida', formas: [esperado.formas[0]] }), 'recusa uma forma só');
ok(!campo({ ...esperado, formas: [...esperado.formas.slice(0, 2), { id: '', nome: 'x' }] }), 'recusa id vazio');
ok(criaturaSchema.shape.transforma.safeParse(undefined).success, 'ausente é aceito (quem não muda de forma não leva o campo)');

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

// A9: fonte exportada pelo editor é a mesma entrada do motor, sem derivados gravados.
const editor = await carregarTS('src/lib/bestia-editor.ts');
const nova = editor.novaCriatura();
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
console.log('\n✓ formas: o campo transforma sai da linha Formas, com os quatro erros e o esquema conferidos');
