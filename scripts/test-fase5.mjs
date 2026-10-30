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
cases.set('2', async () => {
const simples=conv(raw.replace('| Nado | o de um humano | |','| Natação | **3** m por Tick | deslocamento antigo |'));assert.equal(simples.criatura.deslocamento.nado.batalha,3);assert.ok(!simples.paradas.some(x=>/Nado|Natação/.test(x)));const pelaRegra=conv(raw.replace('| Nado | o de um humano | |','| Nado | pela regra do personagem, com Natação 3 | |'));assert.equal(pelaRegra.criatura.deslocamento.nado,undefined);assert.ok(!pelaRegra.paradas.some(x=>/Nado|Natação/.test(x)));const declarada=conv(raw.replace('| Nado |','| Escalada | sobe parede, é Batalha 5 | |\n| Nado |'));assert.equal(declarada.criatura.deslocamento.escalada.batalha,5);const catalogo=conv(raw.replace('| Nado |','| Escalada | sobe parede (`locomocao.escalada` 2) | |\n| Nado |'));assert.equal(catalogo.criatura.deslocamento.escalada.batalha,2);const ruim=conv(raw.replace('| Nado | o de um humano | |','| Natação | rápida 3 | deslocamento antigo |'));assert.ok(ruim.paradas.some(x=>/Nado/.test(x)));
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
cases.set('19', async () => {
for(const mutate of [c=>delete c.formas,c=>delete c.formaPrincipal,c=>c.formas=[],c=>c.formas[0].id=c.formaPrincipal.id,c=>c.sentidos.push({nome:'sentido',descricao:'ouve',formas:['nao-existe']})]){const c=fresh();mutate(c);assert.equal(schema.safeParse(c).success,false);}const c=fresh();assert.equal(schema.safeParse(c).success,true);delete c.formas;delete c.formaPrincipal;for(const k of ['habilidadesEspeciais','comoLuta','sentidos'])c[k]=c[k].map(x=>({...x,formas:'todas'}));for(const k of ['fraquezas','resistencias','imunidades'])c.elementos[k]=c.elementos[k].map(x=>({...x,formas:'todas'}));assert.equal(schema.safeParse(c).success,true);
});
cases.set('1', async () => {
const r=conv(raw.replace(/(\| Deslocamento em terra \| )[^|]+/,'$1**[sem dado]** '));assert.ok(r.paradas.some(x=>/sem dado/.test(x)));const q=conv(raw.replace(/(\| Deslocamento em terra \| )[^|]+/,'$1não anda ').replace('| Nado |','| Voo | Batalha **5** | |\n| Nado |'));assert.ok(!q.paradas.some(x=>/Deslocamento em terra/.test(x)));
});
cases.set('13', async () => {
const c=fresh();delete c.corpo.posturaDoTamanho;assert.equal(schema.safeParse(c).success,false);c.corpo.posturaDoTamanho=' ';assert.equal(schema.safeParse(c).success,false);const r=conv(raw.replace(/(\| Tamanho \| )[^|]+/,'$1**Médio** (0,98 m²) '));assert.equal(r.criatura.corpo.posturaDoTamanho,'silhueta de frente, de pé','sem a postura no Tamanho, vale a da linha Área');
// C2 (revisão de af3697c7): a postura da medição com a área por extenso (a rã venenosa) vai para posturaDoTamanho, e não
// a linha Postura; sem postura da medição em lugar nenhum, a ficha para (formato-x-codigo.md, item 13), sem completar.
const ra=conv(raw.replace(/(\| Tamanho \| )[^|]+/,'$1**Médio** (área 0, vista de cima, agachada) '));assert.equal(ra.criatura.corpo.posturaDoTamanho,'vista de cima, agachada');
const sem=conv(raw.replace(/(\| Tamanho \| )[^|]+/,'$1**Médio** (0,98 m²) ').replace(/(\| Área \| )[^|]+/,'$1**0,98 m²** '));assert.ok(sem.paradas.some(x=>/postura de medição/.test(x)),'parada: '+JSON.stringify(sem.paradas));assert.notEqual(sem.criatura.corpo.posturaDoTamanho,'bípede, de pé, um pouco curvado','a linha Postura não completa');
const rv=JSON.parse(fs.readFileSync('src/data/bestiario/ra-venenosa.json','utf8'));assert.equal(rv.corpo.posturaDoTamanho,'vista de cima, agachada');
});
cases.set('20', async () => {
const a=conv(raw.replace(/Jogada:/g,'Conta:'));assert.ok(!a.paradas.some(x=>/Jogada|habilidade/i.test(x)));const b=conv(raw.replace('| Mordida | boca | Média |','| Mordida | boca | Distância |').replace(/Jogada:/g,'Conta:'));assert.ok(b.paradas.some(x=>/Jogada|habilidade/i.test(x)));const c=conv(raw.replace(/^(\| Garras \|[^\n]+)/m,l=>{const a=l.split('|');a[9]=' ';return a.join('|');}));assert.ok(c.paradas.some(x=>/Acerto/.test(x)));
});
cases.set('23', async () => {
for(const regra of ['agarrar','investida','furtividade','derrubar','empurrar','empunhadura-dupla','horda']){const c=fresh();c.habilidadesEspeciais=[{nome:'teste',classe:'livro',formas:'todas',regra,texto:'somente neste gesto'}];const h=M.vistaPublicaCriatura(c).habilidades[0];assert.ok(h.descricao.length>50,regra);assert.ok(h.descricao.includes('somente neste gesto'));assert.ok(!h.descricao.startsWith(regra+'.'));}
});
cases.set('M2', async () => {
const c=fresh();c.habilidades.esquiva=0;c.habilidades.bloqueio=10;
const modelo=c.ataques.find(a=>!a.arma);c.ataques=[{...modelo,nome:'primeira',bloqueiaComoArma:2},{...modelo,nome:'segunda',bloqueiaComoArma:5}];
assert.equal(M.vistaPublicaCriatura(c).motor.stat.defesa,M.criatura(c).bloqueio+5,'a maior arma conta uma vez');
const B=await carregarTS('scripts/fixtures/fase5-mesa.ts');const store=new Map();
globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v))};
assert.equal(B.escolhaPadrao({defesa:20,vestida:{defesa:10}}),'sem');assert.equal(B.escolhaPadrao({defesa:20,vestida:{defesa:20}}),'com');
const cb=B.MON['campeao-esqueletico'].combate;const peca=dados=>({id:'f5',tipo:'criatura',monstro_id:'campeao-esqueletico',dados:dados||{}});
const inicial=B.escolhaDe('campeao-esqueletico',cb);const original=peca();const antes=JSON.stringify(original);
const troca=B.alternarVestida('campeao-esqueletico',cb);assert.notEqual(troca,inicial);assert.equal(B.escolhaDe('campeao-esqueletico',cb),troca);
assert.equal(B.resumoDe(original).defesa,troca==='com'?cb.vestida.defesa:cb.defesa);assert.equal(B.resumoDe(peca({defesa:99})).defesa,99);assert.equal(JSON.stringify(original),antes);
assert.deepEqual([...store.keys()],['centelha:mesa:vestida']);assert.equal(JSON.parse(store.get('centelha:mesa:vestida'))['campeao-esqueletico'],troca);
const vazios={ataque:'',defesa:'',absI:'',absC:'',absP:'',rperf:''};const gravado=B.dadosSemOsVaziosDaEscolha({defesa:0,ataque:'',soak:{impacto:0,corte:0,perfuracao:0},resistPerf:0,dano:'1d6'},vazios);
assert.deepEqual(gravado,{dano:'1d6'});const digitado=B.dadosSemOsVaziosDaEscolha({defesa:99,soak:{impacto:9,corte:0,perfuracao:0}}, {...vazios,defesa:'99',absI:'9'});assert.equal(B.resumoDe(peca(digitado)).defesa,99);assert.equal(B.resumoDe(peca(digitado)).soak.impacto,9);
B.alternarVestida('campeao-esqueletico',cb);assert.ok(!('campeao-esqueletico' in JSON.parse(store.get('centelha:mesa:vestida'))));
for(const mutate of [x=>x.elementos.fraquezas.push({tipo:'fogo',formas:'todas'})&&x.elementos.imunidades.push({tipo:'fogo',formas:'todas'}),x=>x.elementos.resistencias.push({tipo:'fogo',formas:'todas'},{tipo:'fogo',formas:'todas'})]){const x=fresh();mutate(x);assert.equal(schema.safeParse(x).success,false,'choque ou repetição de elemento');}
const disjuntas=fresh();disjuntas.elementos.fraquezas.push({tipo:'fogo',formas:[disjuntas.formaPrincipal.id]});disjuntas.elementos.imunidades.push({tipo:'fogo',formas:[disjuntas.formas[0].id]});assert.equal(schema.safeParse(disjuntas).success,true,'formas distintas não colidem');
assert.equal(conv(raw).paradas.length,0,'fonte base do controle deve passar');
const semDadoSocial=conv(raw.replace(/^(\| Social \| )[^|]+/m,'$1**[sem dado]** '));assert.ok(!('social' in semDadoSocial.criatura.comportamento),'marcador explícito não é valor');assert.equal(schema.safeParse(semDadoSocial.criatura).success,true,'campo ausente passa no esquema');
for(const tipo of ['prata','sol']){const x=fresh();const a=x.ataques.find(a=>!a.arma);a.tipoDano=tipo;assert.equal(schema.safeParse(x).success,true,'vocabulário aprovado: '+tipo);}
const mutants=[];
for(const rot of ['Força','Destreza','Vigor','Percepção','Inteligência','Raciocínio','Influência','Perspicácia','Compostura']){
 mutants.push([rot+' ausente',raw.split('\n').filter(l=>!l.startsWith('| '+rot+' |')).join('\n')]);
 mutants.push([rot+' negativo',raw.replace(new RegExp('^(\\| '+rot+' \\| )[^|]+','m'),'$1-1 ')]);
}
for(const [i,value] of [[3,'Classe Inventada'],[4,'2/2/3'],[5,'rápida'],[6,'dano indefinido'],[7,'dano inventado'],[9,'bom'],[10,'talvez']])mutants.push(['ataque coluna '+i,raw.replace(/^(\| Garras \|[^\n]+)/m,l=>{const a=l.split('|');a[i]=' '+value+' ';return a.join('|');})]);
for(const campo of ['Ativação','Duração','Alcance','Área','Efeito','Dano','Resistência','Limite de uso'])mutants.push(['poder sem '+campo,raw.replace(campo+':','Campo retirado:')]);
mutants.push(['seção nova',raw+'\n## Secao desconhecida\ntexto'],['Atributo desconhecido',raw.replace('| Compostura |','| Sorte |')],['Habilidade desconhecida',raw.replace('| Briga |','| Habilidade inexistente |')],['Arte desconhecida',raw.replace(/^(\| Artes \| )[^|]+/m,'$1arte-inventada 2 ')],['Mana sem número',raw.replace(/^(\| Mana \| )[^|]+/m,'$1indefinida ')],['coluna nova',raw.replace('| Dano médio | Justificativa |','| Dano extra | Justificativa |')]);
for(const meio of ['Voo','Nado','Escavação','Escalada'])mutants.push([meio+' ilegível',raw.replace('| Deslocamento em terra |','| '+meio+' | rápida 3 | |\n| Deslocamento em terra |')]);
for(const [label,md] of mutants){assert.notEqual(md,raw,'controle não plantado: '+label);assert.ok(conv(md).paradas.length>0,label);}
console.log('M2: '+mutants.length+' entradas inválidas recusadas, defesa e mesa conferidas');
});
cases.set('M3', async () => {
const page=fs.readFileSync('src/pages/mesa/grupo.astro','utf8');const ini=page.indexOf('  function cardDeFora('),fim=page.indexOf('\n  // =============================================== criar',ini);assert.ok(ini>0&&fim>ini);const {transform}=await import('esbuild');const js=(await transform(page.slice(ini,fim),{loader:'ts'})).code;const G=fs.existsSync('src/lib/grupo-visivel.ts')?await carregarTS('src/lib/grupo-visivel.ts'):{avisoDosFisicosCompartilhados:()=>null};const draw=new Function('esc','avatarHTML','avisoDosFisicosCompartilhados',js+';return cardDeFora;')(x=>String(x??''),()=>'',G.avisoDosFisicosCompartilhados);assert.match(draw({nivel:'fisico',dados:{forca:0,destreza:0,vigor:0}}, {}, {}),/supabase\/migracao-41.sql/);assert.equal(G.avisoDosFisicosCompartilhados('fisico',{forca:3,destreza:2,vigor:4}),null);assert.equal(G.avisoDosFisicosCompartilhados('nada',{}),null);
});
cases.set('baixo-sql', async () => {
const sql=fs.readFileSync('supabase/migracao-41.sql','utf8');const ante=sql.split('function public.ficha41_ante')[1].split('$$;')[0];assert.ok(ante.includes("coalesce(e->'u', e->'uid')"));assert.ok(ante.includes("coalesce(e->'n', e->'nome')"));assert.ok(ante.includes("coalesce(e->'v', e->'valor')"));const spec=sql.split('function public.ficha41_especialidades')[1].split('$$;')[0];assert.ok(!spec.includes("(e - 's' - 'v') ||"));assert.ok(sql.includes("case when f ? 'budget' then jsonb_build_object('xpTotal'"));const F=await carregarTS('src/lib/ficha-formato.ts');const old=JSON.parse(fs.readFileSync('scripts/fixtures/kael.json','utf8'));delete old.budget;old.anteNom={contatos:[{uid:'um',nome:'Ana',valor:2}]};old.spec={briga:[{s:'garra',v:1,extra:'ignorar'}]};const got=JSON.parse(JSON.stringify(F.fichaParaGravar(old)));assert.ok(!('xpTotal'in got));assert.deepEqual(got.antecedentesNomeados.contatos,[{uid:'um',nome:'Ana',valor:2}]);assert.deepEqual(got.especialidades.briga,[{foco:'garra',valor:1}]);
});
cases.set('baixo-volta', async () => {
const sql=fs.readFileSync('supabase/migracao-41.sql','utf8');const marker=sql.indexOf('-- >>> carimbo');assert.ok(marker>0);assert.ok(!/^commit;/m.test(sql.slice(0,marker)),'o commit não pode preceder o carimbo');assert.ok(sql.slice(marker).trimEnd().endsWith('commit;'));const volta=fs.readFileSync('supabase/migracao-41-volta.sql','utf8');assert.match(volta,/delete from public\.migracoes where numero = 41;/i);assert.ok(volta.indexOf('delete from public.migracoes')<volta.lastIndexOf('commit;'));
});
// Migração 42 (D-259, D-260, P19): a forma do arquivo. A prova de que o SQL dá a conta do
// site mora no teste local do Postgres (tmp/executora/teste-sql42/), e não aqui.
cases.set('migracao-42', async () => {
const sql=fs.readFileSync('supabase/migracao-42.sql','utf8');const marker=sql.indexOf('-- >>> carimbo');assert.ok(marker>0,'sem carimbo');const corpo=sql.slice(0,marker);
assert.ok(!/^commit;/m.test(corpo),'o commit não pode preceder o carimbo');assert.ok(sql.slice(marker).trimEnd().endsWith('commit;'));
const bk=corpo.indexOf('insert into public.personagens_ficha_backup_42'),up=corpo.indexOf('update public.personagens p set ficha');assert.ok(bk>0&&up>bk,'o backup vem antes da escrita');
assert.match(corpo.slice(bk,up),/on conflict \(id\) do nothing/,'rodar de novo não regrava o backup');
assert.match(corpo.slice(up),/is distinct from p\.ficha/,'só escreve ficha que muda');
const executavel=corpo.split('\n').filter((l)=>!l.trimStart().startsWith('--')).join('\n');
assert.ok(!/resumo/i.test(executavel),'a 42 não toca no resumo (P19)');assert.ok(!/grupo_visivel|combate_visao/i.test(executavel),'a 42 não toca nas views (P19)');
assert.match(corpo,/floor\(v \+ 0\.5\)/,'arredonda como o Math.round do site');
const cat=JSON.parse(corpo.split('$c42$')[1]);const chaves=Object.keys(cat);assert.ok(chaves.length>0);
for(const k of chaves){const [tipo,id]=k.split(':');const it=cat[k];assert.equal(it.origem,id,k);assert.equal(it.tipo,tipo,k);assert.ok(!('id' in it),k);
 for(const b of ['arma','escudo','armadura','municao'])assert.ok(it[b]!==null,k+' com bloco nulo');assert.ok(!(it.arma&&'folego' in it.arma),k+' com Fôlego');}
const volta=fs.readFileSync('supabase/migracao-42-volta.sql','utf8');assert.match(volta,/personagens_ficha_backup_42/);assert.match(volta,/delete from public\.migracoes where numero = 42;/);
for(const f of ['migracao-42.sql','migracao-42-confere.sql','migracao-42-volta.sql'])assert.ok(!/[–—]/.test(fs.readFileSync('supabase/'+f,'utf8')),f+' com travessão');
const confere=fs.readFileSync('supabase/migracao-42-confere.sql','utf8');assert.ok(!/\b(update|insert|delete|create|drop|alter)\b/i.test(confere.split('\n').filter((l)=>!l.trimStart().startsWith('--')).join('\n')),'a conferência é só leitura');
});
// P18 (D-271): a armadura órfã (a `cota-de-malha` das 4 fichas de teste) sai da lista, sem item; o site já a descartava.
cases.set('P18', async () => {
const sql=fs.readFileSync('supabase/migracao-42.sql','utf8');const corpo=sql.slice(0,sql.indexOf('-- >>> carimbo'));
const cat=JSON.parse(corpo.split('$c42$')[1]);assert.ok(!('armadura:cota-de-malha' in cat),'a 42 não cria item para a órfã');
const arm=corpo.split('create or replace function public.ficha42_armaduras')[1].split('$$;')[0];assert.match(arm,/where not public\.ficha42_orfa\(p\)/,'a lista de armaduras tira a órfã');
const orfa=corpo.split('create or replace function public.ficha42_orfa')[1].split('$$;')[0];assert.match(orfa,/public\.ficha42_item\(p\) is null/);assert.match(orfa,/'base'\) = 'string'/);
assert.match(corpo,/D-271/);assert.ok(!/fica como está, sem item/.test(corpo),'sobrou a frase de antes da D-271');
const confere=fs.readFileSync('supabase/migracao-42-confere.sql','utf8');assert.match(confere,/-- 4\. As armaduras órfãs que a 42 descartou/);assert.match(confere,/where public\.ficha42_orfa\(x\)/);
const E=await carregarTS('src/lib/equip.ts');const f={atributos:{},equipamento:{armaduras:[{uid:'a1',base:'cota-de-malha',vestida:true}]}};assert.deepEqual(E.armadurasDe(f),[],'o site já descartava a órfã na leitura');
});
cases.set('baixo-excecao', async () => {
const md=raw.replace(/^(\| Tamanho \| )[^|]*\|[^|]*\|/m,'$1**Pequeno** (0,98 m², de frente) | decisão 7: quadrúpedes de 50 a 75 kg |');assert.ok(conv(md).paradas.some(x=>x.startsWith('Tamanho:')));const q=conv(md.replace(/^(\| Postura \| )[^|]+/m,'$1quadrúpede ').replace(/^(\| Massa \| )[^|]+/m,'$1**70 kg** '));assert.equal(q.criatura.corpo.tamanhoEscolhido,'pequeno');assert.ok(!q.paradas.some(x=>x.startsWith('Tamanho:')));
});
cases.set('baixo-comando', async () => {
const t=fs.readFileSync('.claude/commands/arquiteto.md','utf8');const description=t.match(/^description: (.+)$/m)[1];assert.ok(!/Executora|Revisora/.test(description));assert.ok(description.includes('Leitora-novata'));assert.ok(t.includes('papel: "Arquiteto (RPG)"'));
});
cases.set('favicon', async () => {
const page=fs.readFileSync('src/pages/artes/index.astro','utf8');assert.ok(page.includes("url('favicon.ico')"));assert.ok(page.includes("url('artes/regras')"));assert.ok(page.includes('http-equiv="refresh"'));assert.ok(!fs.readFileSync('astro.config.mjs','utf8').includes("redirects: { '/artes':"));assert.ok(fs.statSync('public/favicon.ico').size>0);
});
// Parecer da Veterana (F4), V1 (D-266): a Força em dobro é da ação de Investida, e não do golpe comum; a cauda que
// varre com o corpo inteiro fica com Força × 2 (complemento da D-266). O livro, o regras.json, o card e o cabeçalho.
cases.set('parecer-V1', async () => {
// Com a P20 (D-269), a Força em dobro da V1 virou "a Força mais uma vez": × 1 para × 2, × 2 para × 3.
const card=M.textoDaRegraDaCriatura('investida');assert.ok(!/d6/.test(card),'P20-b: o +1d6 saiu');assert.match(card,/sem dado a mais/);assert.match(card,/Força mais uma vez/);assert.match(card,/de × 1 para × 2/);assert.match(card,/de × 2 para × 3/);assert.match(card,/golpe comum[^.]*a Força como sempre/);assert.ok(!/Força em dobro/.test(card),'sobrou a Força em dobro');
const comb=fs.readFileSync('src/content/chapters/combate.md','utf8');const inv=comb.split('### Investida')[1].split('\n### ')[0];
assert.match(inv,/\| \*\*Preparo investindo\*\* \|[^\n]*\| a Força \*\*mais uma vez\*\*, sem dado a mais \|/,'a tabela da Investida dá a Força mais uma vez, sem o +1d6 (P20-b)');
assert.match(inv,/A Força a mais é da ação de Investida, e não do golpe/);assert.match(inv,/de \*\*× 1 para × 2\*\*/);assert.match(inv,/de \*\*× 2 para × 3\*\*/);assert.match(inv,/o personagem e para a criatura/);assert.ok(!/Força em dobro|Força \*\*× 2\*\* \|/.test(inv),'sobrou a regra da V1 sem a P20');
const R=JSON.parse(fs.readFileSync('src/data/regras.json','utf8'));assert.match(R.combate.movimento.investida.texto,/Força mais uma vez/);assert.equal(R.combate.movimento.investida.forcaExtra,1);
const best=fs.readFileSync('src/pages/bestiario.astro','utf8');const dano=best.split('<span class="lbl">Dano</span>')[1].split('</div>')[0];
assert.match(dano,/ação de <a [^>]*#investida'\}>Investida<\/a>/);assert.match(dano,/de × 2 para × 3 com a arma de duas mãos/);assert.match(dano,/cauda que varre com o giro do corpo inteiro/);assert.ok(!/usam sempre <strong>uma vez a Força/.test(dano),'sobrou a frase de antes');
});
// P20 (D-269): a Investida soma a Força mais uma vez no dano, com o +1d6, para o personagem e para a criatura; o
// golpe de longe e o golpe de Força × 0 não ganham Força. O resumo da mesa leva o número, e o card diz o dano investindo.
cases.set('P20', async () => {
const S=(ref,inabil='nada')=>({attrs:{forca:4,destreza:2},skills:{armas:2},skills2:{},centelha:0,conjuntos:[{ativo:true,habil:{ref},inabil:{ref:inabil}}]});
for(const [ref,inab,fi] of [['a:montante','nada',4],['a:espada-longa','nada',4],['a:espada-longa','e:broquel',4],['a:desarmado','a:desarmado',4],['a:arco-longo','nada',0]]) assert.equal(M.combatePersonagem(S(ref,inab)).forcaInvestida,fi,ref+' '+inab);
assert.equal(M.forcaDaInvestida(7,1,false),7);assert.equal(M.forcaDaInvestida(7,2,false),7);assert.equal(M.forcaDaInvestida(7,0,false),0);assert.equal(M.forcaDaInvestida(7,1,true),0);
const mesa=JSON.parse(fs.readFileSync('src/data/monsters-mesa.json','utf8'));const mi=mesa.find(m=>m.id==='minotauro');
assert.deepEqual(mi.combate.ataques.map(a=>[a.nome,a.forcaInvestida]),[['Machado pesado',7],['Chifrada',7]]);
const naoInveste=mesa.filter(m=>m.combate.ataques.some(a=>['distancia','arremesso'].includes(a.classe)&&a.forcaInvestida!==0));assert.equal(naoInveste.length,0,'golpe de longe com Força a mais: '+naoInveste.map(m=>m.id));
const best=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8'));const au=best.find(m=>m.id==='auroque').habilidadesEspeciais.find(h=>h.regra==='investida');
assert.match(au.texto||au.descricao,/Nesta criatura, Investida \(marrada\) investindo: 2d6 \+21 \(I\) \(a Força 7 mais uma vez\)/);
const semLiga=best.find(m=>m.id==='besouro-veado-gigante').habilidadesEspeciais.find(h=>h.regra==='investida');assert.match(semLiga.texto||semLiga.descricao,/Nesta criatura: a Força 4 mais uma vez no dano do golpe/);
const todas=best.flatMap(m=>m.habilidadesEspeciais.filter(h=>h.regra==='investida'));assert.equal(todas.length,37);assert.ok(todas.every(h=>/Nesta criatura/.test(h.texto||h.descricao)),'Investida sem o dano desta criatura');
});
// V2 (D-267): o peso erguido do livro é o da D-184 (a R15, pela massa), em tabela gerada do motor; a tabela por FAH sai.
cases.set('parecer-V2', async () => {
const cap=fs.readFileSync('src/content/chapters/acoes-corpo-e-movimento.md','utf8');const lp=cap.split('## Levantar Peso')[1].split('\n## ')[0];
assert.ok(!/\| FAH \|/.test(lp),'sobrou a tabela por FAH');assert.ok(!/FAH = Força × 3 \+ Halterofilismo/.test(lp),'sobrou a reserva FAH');assert.ok(!/tabela do FAH/.test(cap),'sobrou o ponteiro para a tabela do FAH');
assert.match(lp,/R15 é o nome desta regra/);assert.match(lp,/massa padrão da raça/);assert.match(lp,/<!-- gen:peso-erguido -->/);
const cel=(raca,f)=>{const l=lp.split('\n').find(x=>x.startsWith('| **'+raca+'** |'));assert.ok(l,raca);return Number(l.split('|')[3+f].replace(/[^\d]/g,''));};
for(const [raca,id] of [['Humano','humano'],['Gnomo','gnomo'],['Orc','orc']])for(const f of [1,3,4]){
 const ficha=Math.round(M.numerosPersonagem({raca:id,attrs:{forca:f},skills:{},skills2:{}}).pesoErguido);assert.equal(cel(raca,f),ficha,raca+' Força '+f+': livro e ficha');}
assert.equal(cel('Humano',1),83,'o Humano de 70 kg e Força 1 do parecer');
});
// V3 (D-268): o sopro segue a regra do livro de desviar de área (combate.md, "Contra área, a saída é sair"); o livro e o
// cabeçalho do bestiário citam a regra. As 24 fichas de sopro são da Bestiarista.
cases.set('parecer-V3', async () => {
const comb=fs.readFileSync('src/content/chapters/combate.md','utf8');assert.match(comb,/<span id="contra-area"><\/span>\*\*Contra área, a saída é sair\.\*\*/);
const area=comb.split('<span id="contra-area">')[1].split('\n## ')[0];assert.match(area,/\*\*O sopro das criaturas é área, e segue esta regra\.\*\*/);assert.match(area,/Destreza \+ Esquiva/);
assert.match(fs.readFileSync('src/data/regras.json','utf8'),/"jogada": "Destreza \+ Esquiva",\s*"jogadaParado"/,'a jogada do livro é a do regras.json (área, desvio)');
const best=fs.readFileSync('src/pages/bestiario.astro','utf8');const s=best.split('<span class="lbl">Sopro e área</span>')[1]?.split('</div>')[0];assert.ok(s,'falta o callout do sopro no cabeçalho');
assert.match(s,/#contra-area'\}>Contra área, a saída é sair<\/a>/);assert.match(s,/5 \+ 5 × os metros/);assert.ok(!/contra a jogada do sopro/.test(s));
});
// V4 (decisão 80 do autor, D-234): a Vida da criatura vem da massa; a do personagem, do Tamanho da raça; a massa padrão
// de cada raça cai na mesma linha da tabela da massa (Vigor 0 a 12, sem a Vitalidade).
cases.set('parecer-V4', async () => {
const R=JSON.parse(fs.readFileSync('src/data/racas.json','utf8'));const racas=(Array.isArray(R)?R:Object.values(R)).filter(r=>r&&r.massaKg);assert.equal(racas.length,8);
for(const r of racas){const m=M.massaDoJogador({raca:r.id});const l=M.pvPorte(r.porte);for(let v=0;v<=12;v++)assert.equal(M.pvDaMassa(m,v),l.base+v*l.vigorMult,r.id+' '+m+' kg, Vigor '+v);}
const vida=fs.readFileSync('src/content/chapters/vida-ferimentos-cura.md','utf8');assert.ok(!/ainda dão a Vida pelo tamanho/.test(vida),'sobrou a frase velha');assert.match(vida,/A Vida da \*\*criatura\*\* vem da \*\*massa\*\*/);assert.match(vida,/\*\*O personagem é a exceção: a Vida dele sai do Tamanho da raça\*\*/);
const rac=fs.readFileSync('src/content/chapters/racas.md','utf8');assert.match(rac,/<strong>massa padrão<\/strong> de cada raça, o meio da faixa normal dela, cai na mesma linha/);
});
// M11 (combate.md, O ataque: "para atirar (arco ou besta), sempre Percepção"): o texto do Atirador e o da Destreza
// deixam de oferecer a Destreza ao tiro, e dizem por quê; o motor já jogava pela Percepção.
cases.set('parecer-M11', async () => {
const H=JSON.parse(fs.readFileSync('src/data/habilidades.json','utf8'));const at=H.find(h=>h.id==='atirador');assert.deepEqual(at.atributos,['percepcao']);assert.match(at.descricao,/vai sempre pela Percepção, e não pela Destreza/);
const cap=fs.readFileSync('src/content/chapters/habilidades.md','utf8');const l=cap.split('\n').find(x=>x.startsWith('- **Atirador** ·'));assert.ok(l.endsWith('*(Percepção)*'),'o capítulo gerado dá só a Percepção');
const atr=fs.readFileSync('src/content/chapters/atributos.md','utf8');const des=atr.split('**Destreza** ·')[1].split('\n\n')[0];assert.ok(!/Principais Habilidades:\*[^\n]*Atirador/.test(des),'a Destreza ainda lista o Atirador');assert.match(des,/sim pela Percepção/);
assert.match(fs.readFileSync('src/content/chapters/combate.md','utf8'),/para <strong>atirar<\/strong> \(arco ou besta\), sempre Percepção/);
assert.equal(M.atributoDaJogada('atirador',{percepcao:1,destreza:5}),1,'o motor joga o tiro pela Percepção');
});
// G4: a ficha do jogador aplica o −2 de Bloqueio das armas pesadas de duas mãos (armas.json, defesaArma); sem mão
// livre não há corpo a escolher. Destreza 3 e Bloqueio 2 dão 10 sem bônus de arma (o exemplo do parecer).
cases.set('parecer-G4', async () => {
const blq=(habil,inabil='nada')=>M.numerosPersonagem({raca:'humano',attrs:{destreza:3},skills:{bloqueio:2},skills2:{},conjuntos:[{ativo:true,habil:{ref:'a:'+habil},inabil:{ref:inabil}}]}).bloqueio;
for(const [a,n] of [['montante',8],['martelo-de-guerra',8],['machado-pesado',8],['alabarda',10],['lanca',12],['espada-longa',11]])assert.equal(blq(a),n,a);
assert.equal(M.numerosPersonagem({raca:'humano',attrs:{destreza:3},skills:{bloqueio:0},skills2:{},conjuntos:[{ativo:true,habil:{ref:'a:montante'},inabil:{ref:'nada'}}]}).bloqueio,4,'Bloqueio 0 com Montante: 4, como o livro');
});
// Card, item 7 (parecer m1, m2 e M2): nenhuma nota de trabalho que o código do card escreva: código de decisão no
// texto do componente, o id cru da Técnica ou da Arte sem texto, o sentido sem dado ("faro:" vazio). A nota que vem
// do texto da ficha é da Bestiarista (ajustes-parecer-f4.md), e a entrada das fichas a recusa.
cases.set('parecer-7', async () => {
const semComentario=(s)=>s.replace(/\{\/\*[\s\S]*?\*\/\}/g,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'').replace(/<!--[\s\S]*?-->/g,'');
for(const f of ['src/components/BestaCard.astro','src/components/FormaCriatura.astro']){const cod=semComentario(fs.readFileSync(f,'utf8'));assert.ok(!/\b[CD]-\d{2,4}\b/.test(cod),f+': código de decisão no texto do card');}
const MON=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8'));const NT=Object.fromEntries(JSON.parse(fs.readFileSync('src/data/tecnicas.json','utf8')).map(t=>[t.id,t]));
const vistas=MON.flatMap(m=>[m,...(m.formas||[]).map(f=>f.criatura)]);let refs=0;
for(const c of vistas){for(const h of c.habilidadesEspeciais||[]){assert.ok(h.descricao,c.id+' · '+h.nome+': habilidade sem texto');assert.ok(!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(h.descricao)&&!NT[h.descricao],c.id+' · '+h.nome+': id cru "'+h.descricao+'"');if(/ do livro, nível \d$/.test(h.descricao))refs++;}
 for(const s of c.sentidos||[])assert.ok(s.descricao,c.id+' · sentido '+s.nome+' sem texto');
 for(const t of [c.descricao,...(c.habilidadesEspeciais||[]).map(h=>h.descricao),...(c.sentidos||[]).map(s=>s.descricao),...(c.lore||[]).map(l=>l.texto)])assert.ok(!/\b[CD]-\d{3}\b/.test(t||''),c.id+': código de decisão no card: '+t);}
assert.ok(refs>=50,'as Técnicas e Artes do livro sem texto ganham o nome do catálogo ('+refs+')');
const mesa=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8')).find(m=>m.id==='babau').habilidadesEspeciais.find(h=>h.nome==='Ver o invisível');assert.equal(mesa.descricao,'Técnica Visão Verdadeira do livro, nível 4');
});
// Card, item 8 (parecer M9, M8, M2, M6): os campos da habilidade com rótulo de leitura, um por linha; a Rajada com o
// teto do golpe ligado; o agarrão e a derrubada com a jogada da criatura; as formas 2 e 3 com o desenho da principal;
// o nível de Couraça à vista.
cases.set('parecer-8', async () => {
const MON=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8'));const vistas=MON.flatMap(m=>[m,...(m.formas||[]).map(f=>f.criatura)]);let campos=0,teto=0,manobra=0;
for(const c of vistas)for(const h of c.habilidadesEspeciais||[]){assert.ok(!/\b(?:ativacao|duracao|limiteDeUso|resistencia|area|alcance|dano): /.test(h.descricao),c.id+' · '+h.nome+': campo cru');
 if(h.campos){campos++;for(const x of h.campos)assert.ok(['Ativação','Duração','Alcance','Área','Dano','Resistência','Limite de uso'].includes(x.rotulo),x.rotulo);}
 if(h.regra==='rajada'){assert.ok(!/O limite depende da classe/.test(h.descricao),c.id+' · '+h.nome+': Rajada sem teto');teto++;}
 if(h.regra==='agarrar'||h.regra==='derrubar'){assert.match(h.descricao,/Nesta criatura: \d+d6( \+\d+)? \((Força|Destreza) \d+ \+ Briga \d+\)/);manobra++;}}
assert.ok(campos>=500&&teto>=50&&manobra>=100,`campos ${campos}, rajadas ${teto}, manobras ${manobra}`);
const dv=MON.find(m=>m.id==='dragao-vermelho-adulto');assert.match(dv.habilidadesEspeciais.find(h=>h.nome==='garras em sequência').descricao,/Até 3 golpes por ação/);assert.match(dv.habilidadesEspeciais.find(h=>h.nome==='cauda em sequência').descricao,/Até 2 golpes por ação/);
const gf=MON.find(m=>m.id==='golem-de-ferro').habilidadesEspeciais.find(h=>h.nome==='agarrar');assert.match(gf.descricao,/Nesta criatura: \d+d6/);
assert.equal(MON.find(m=>m.id==='anquilossauro').combate.couraca,8);
const card=fs.readFileSync('src/components/BestaCard.astro','utf8'),forma=fs.readFileSync('src/components/FormaCriatura.astro','utf8');
for(const [n,s] of [['BestaCard',card],['FormaCriatura',forma]]){assert.match(s,/from '\.\.\/lib\/besta-card'/,n);assert.match(s,/class="hab-campos"/,n);assert.match(s,/<dt>Couraça<\/dt>/,n);}
assert.ok(!/k\+': '\+i\.combate\[k\]\.join/.test(forma)&&!/nomes\[k\]\+': '\+v/.test(forma),'a forma ainda escreve em linha corrida');assert.match(forma,/ELEM\[x\] \?\? x/);assert.match(forma,/class="atr-grid"/);
const L=await carregarTS('src/lib/besta-card.ts');assert.equal(L.ELEM.perfuracao,'Perfuração');assert.equal(L.locoTxt({nome:'Natação',k:'natacao',v:4}),'Natação 4 m/Tick');
});
// P21 (do coordenador, 29/10/2026: "arremesso pela Destreza (combate.md:156)"): o texto do Arremesso e o da Força
// deixam de oferecer a Força à jogada, como o M11 fez com o Atirador; o motor já jogava pela Destreza.
cases.set('P21', async () => {
const H=JSON.parse(fs.readFileSync('src/data/habilidades.json','utf8'));const ar=H.find(h=>h.id==='arremesso');assert.deepEqual(ar.atributos,['destreza']);assert.match(ar.descricao,/vai sempre pela Destreza, e não pela Força/);
const cap=fs.readFileSync('src/content/chapters/habilidades.md','utf8');const l=cap.split('\n').find(x=>x.startsWith('- **Arremesso** ·'));assert.ok(l.endsWith('*(Destreza)*'),'o capítulo gerado dá só a Destreza');
const atr=fs.readFileSync('src/content/chapters/atributos.md','utf8');const fo=atr.split('**Força** ·')[1].split('\n\n')[0];const de=atr.split('**Destreza** ·')[1].split('\n\n')[0];
assert.ok(!/Principais Habilidades:\*[^.\n]*Arremesso/.test(fo),'a Força ainda lista o Arremesso');assert.match(fo,/não a jogada, que vai pela Destreza/);assert.match(de,/Principais Habilidades:\*[^\n]*Arremesso/);
assert.match(fs.readFileSync('src/content/chapters/combate.md','utf8'),/Para <strong>arremessos<\/strong>, sempre Destreza/);
assert.equal(M.atributoDaJogada('arremesso',{forca:5,destreza:1}),1,'o motor joga o arremesso pela Destreza');
});
// L1 (D-270): o card separa "Poderes" (os poderes da criatura, o que se chamava "Habilidades") de "Habilidades" (as de
// treino, com o nome do livro): no /bestiario, nas outras formas e no card da mesa.
cases.set('L1', async () => {
const B=await carregarTS('src/lib/besta-card.ts');const H=JSON.parse(fs.readFileSync('src/data/habilidades.json','utf8')),S=JSON.parse(fs.readFileSync('src/data/habilidades-secundarias.json','utf8'));
const nomes=Object.fromEntries([...H,...S].map(h=>[h.id,h.nome]));const mon=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8'));
const ban=mon.find(m=>m.id==='bandido-de-estrada');const t=B.habilidadesDeTreino(ban,nomes);
assert.equal(t.primarias.length,Object.keys(ban.habilidades).length);assert.ok(t.primarias.some(h=>h.nome==='Furtividade'&&h.valor===ban.habilidades.furtividade),'a Furtividade do bandido');
const semNome=mon.flatMap(m=>[m,...(m.formas||[]).map(f=>f.criatura)]).flatMap(x=>{const r=B.habilidadesDeTreino(x,nomes);return [...r.primarias,...r.secundarias].filter(h=>h.nome===h.id)});assert.deepEqual(semNome,[],'Habilidade sem o nome do livro');
const card=fs.readFileSync('src/components/BestaCard.astro','utf8');assert.match(card,/besta-mech[^>]*>.*✦<\/span> Poderes<\/button>/);assert.match(card,/besta-treino[^>]*>.*☰<\/span> Habilidades<\/button>/);
assert.ok(!/<h4>Habilidades<\/h4>\s*<ul class="ib-hab">/.test(card),'os poderes ainda sob "Habilidades"');assert.match(card,/<h4>Poderes<\/h4>\s*(\{[^\n]*BASE_NOTA[^\n]*\}\s*)?<ul class="ib-hab">/);assert.match(card,/<template class="treino-tpl">/);
assert.match(fs.readFileSync('src/pages/bestiario.astro','utf8'),/besta-treino'\) \? '\.treino-tpl'/);
const forma=fs.readFileSync('src/components/FormaCriatura.astro','utf8');assert.ok(!/Habilidades especiais/.test(forma));assert.match(forma,/<h4>Habilidades<\/h4>/);
const MB=await carregarTS('src/lib/mesa-bestiario.ts');const html=MB.cardCriaturaHTML({...ban,treino:t});
assert.match(html,/<h4 class="cc-h">Habilidades<\/h4><p class="ib-ref"><b>Habilidades:<\/b> [^<]*Furtividade \d/);assert.match(html,/<h4 class="cc-h">Poderes<\/h4><ul class="ib-hab">/);assert.ok(!/<h4 class="cc-h">Habilidades<\/h4><ul/.test(html));
const EP=await carregarTS('src/pages/dados/criatura/[id].json.ts');const lob=mon.find(m=>m.id==='lobisomem');const r=await EP.GET({props:{m:lob}}).json();
assert.ok(r.treino.primarias.length>0);assert.ok(r.formas.every(f=>f.criatura.treino&&f.criatura.treino.primarias.length>0),'a forma sem o treino');
});
// Parecer da Leitora-novata (sem decisão nova), o card: achado 6 (o "base <Arte> <nível>" por extenso, com o que ele
// quer dizer pela C-037), achado 9 (por que a linha de PV na zona de transição) e achado 14 (quantos tentáculos).
cases.set('leitora-card', async () => {
const B=await carregarTS('src/lib/besta-card.ts');const mon=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8'));
assert.equal(B.baseTxt({arte:'fascinacao',nivel:4},{fascinacao:'Fascinação'}),' · base: Fascinação 4');assert.match(B.BASE_NOTA,/não gasta Mana nem pede Centelha mínima/);assert.ok(!/depende da Centelha/.test(B.BASE_NOTA),'a nota diz mais que a C-037');
const ar=mon.find(m=>m.id==='aguia-real');const z=M.linhaPVNaZona(ar.corpo.massa,ar.atributos.vigor,ar.corpo.linhaPV);
assert.equal(B.linhaPVTxt(z,ar.combate.pv),'PV pela linha de baixo da zona de transição (3 kg a 5 kg): a ficha escolheu pelo corpo, frágil, que desce; a linha de cima daria 12.');
assert.equal(ar.combate.pv,6);assert.equal(M.linhaPVNaZona(70,3,'acima'),null,'fora da zona não há nota');assert.equal(M.linhaPVNaZona(4.6,2,undefined),null);
const comZona=mon.filter(m=>!m.enxame&&M.linhaPVNaZona(M.massaDaConta(m.corpo),m.atributos.vigor,m.corpo.linhaPV));assert.equal(comZona.length,20,'as fichas que escolhem a linha: '+comZona.length);
const ab=mon.find(m=>m.id==='aboleth').habilidadesEspeciais.find(h=>h.regra==='rajada');assert.match(ab.descricao,/Até 2 golpes por ação \(Tentáculo\)$/);
const card=fs.readFileSync('src/components/BestaCard.astro','utf8');assert.match(card,/\{baseTxt\(h\.base, arteNome\)\}/);assert.match(card,/\{BASE_NOTA\}/);assert.match(card,/besta-linhapv/);assert.ok(!/· base \$\{h\.base\.arte\}/.test(card));
const forma=fs.readFileSync('src/components/FormaCriatura.astro','utf8');assert.match(forma,/baseTxt\(x\.base, arteNome\)/);assert.match(forma,/besta-linhapv/);
const MB=await carregarTS('src/lib/mesa-bestiario.ts');const abo=mon.find(m=>m.id==='aboleth');const h1=MB.cardCriaturaHTML(abo);assert.match(h1,/Domínio psíquico<\/b>[^<]* · base: Fascinação 4<\/li>/);assert.match(h1,/não gasta Mana/);
assert.match(MB.cardCriaturaHTML(ar),/PV pela linha de baixo da zona de transição/);
});
// G4 nas criaturas (consequência direta da D-262, a criatura acompanha o catálogo): a arma de duas mãos de corpo a corpo
// ocupa as mãos e o −2 de Bloqueio do Montante, do Martelo de Guerra e do Machado Pesado entra, como na ficha (90429be9).
cases.set('G4-criaturas', async () => {
const esperado={'arconte-trombeta':[20,18],'bruto':[6,5],'cavaleiro-de-elite':[14,11],'minotauro':[7,null],'planetar':[20,null],'solar':[22,null]};
const bloq={'arconte-trombeta':20,'bruto':4,'cavaleiro-de-elite':12,'minotauro':7,'planetar':20,'solar':22};
for(const [id,[def,vest]] of Object.entries(esperado)){const c=JSON.parse(fs.readFileSync(`src/data/bestiario/${id}.json`,'utf8'));const r=M.criatura(c),st=M.vistaPublicaCriatura(c).motor.stat;
 assert.equal(st.defesa,def,id+' Defesa');assert.equal(st.vestida?.defesa??null,vest,id+' Defesa com o equipamento');assert.equal(Math.max(r.esquiva,bloq[id]),def,id+' Bloqueio com a arma');}
const mesa=JSON.parse(fs.readFileSync('src/data/monsters-mesa.json','utf8'));for(const [id,[def]] of Object.entries(esperado))assert.equal(mesa.find(m=>m.id===id).combate.defesa,def,id+' na mesa');
// O chifre do minotauro bloqueia como arma (+1), e desde a P23 (30/10/2026) soma mesmo com o machado nas duas mãos.
const mino=JSON.parse(fs.readFileSync('src/data/bestiario/minotauro.json','utf8'));assert.equal(mino.ataques.find(a=>a.nome==='Chifrada').bloqueiaComoArma,1);
// E só as seis: nenhuma outra criatura empunha arma de duas mãos de corpo a corpo com Defesa da arma negativa.
const A=JSON.parse(fs.readFileSync('src/data/armas.json','utf8'));const W=Object.fromEntries(A.map(w=>[w.id,w.arma]));
const com=fs.readdirSync('src/data/bestiario').map(f=>JSON.parse(fs.readFileSync('src/data/bestiario/'+f,'utf8'))).filter(c=>[c.ataques,...(c.formas||[]).map(f=>f.ataques||[])].some(l=>l.some(a=>a.arma&&W[a.arma]?.maos===2&&W[a.arma]?.classe!=='distancia'&&W[a.arma].defesaArma<0))).map(c=>c.id).sort();
assert.deepEqual(com,Object.keys(esperado).sort());
// O Bloqueio da linha "Com o equipamento" leva a arma das mãos, como a Defesa ao lado: o arconte não diz mais
// "Bloqueio 20" ao lado de "Defesa 18"; e em todo card com equipamento a Defesa é o maior dos dois números à vista.
const vest=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8')).filter(m=>m.combate.vestida);assert.equal(vest.length,14);
for(const m of vest){const v=m.combate.vestida;assert.equal(v.defesa,Math.max(v.esquiva,v.bloqueio),m.id+': a Defesa com o equipamento não é o maior entre Esquiva e Bloqueio');}
const arc=vest.find(m=>m.id==='arconte-trombeta').combate.vestida;assert.deepEqual([arc.esquiva,arc.bloqueio,arc.defesa],[12,18,18]);
});
// P20-b (decisão do autor de 30/10/2026, substitui a parte "O +1d6 da Investida continua" da D-269): a Investida não
// soma dado nenhum; soma só a Força mais uma vez. Motor, card, Grid (a folha e o lance) e o livro.
cases.set('P20-b', async () => {
const R=JSON.parse(fs.readFileSync('src/data/regras.json','utf8')).combate.movimento.investida;assert.ok(!('danoDados' in R),'regras.json ainda tem o danoDados da Investida');assert.equal(R.forcaExtra,1);assert.ok(!/d6/.test(R.texto),R.texto);
const C=JSON.parse(fs.readFileSync('src/data/condicoes.json','utf8')).lista.find(c=>c.id==='investindo');assert.ok(!/d6/.test(C.nota),C.nota);
const comb=fs.readFileSync('src/content/chapters/combate.md','utf8');const inv=comb.split('### Investida')[1].split('\n### ')[0];assert.ok(!/d6/.test(inv),'o livro ainda diz dado na Investida');assert.match(inv,/martelo[^<]*cai com a Força <strong>× 3<\/strong> em vez de × 2/);
const best=fs.readFileSync('src/pages/bestiario.astro','utf8').split('<span class="lbl">Dano</span>')[1].split('</div>')[0];assert.ok(!/d6/.test(best),'callout Dano do bestiário');
const T=await carregarTS('src/lib/combate-tempo.ts');const mi=T.MODOS_MOV.find(m=>m.id==='investida');assert.ok(!/d6/.test(mi.nota),mi.nota);assert.match(mi.nota,/Força mais uma vez/);
const grid=fs.readFileSync('src/pages/mesa/grid.astro','utf8');assert.ok(!/INVESTIDA\.danoDados/.test(grid),'o Grid ainda lê o danoDados da Investida');assert.match(grid,/\? \{ dados: 0, flat: ra\?\.forcaInvestida \?\? 0 \}/);
const mon=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8'));const todas=mon.flatMap(m=>m.habilidadesEspeciais.filter(h=>h.regra==='investida').map(h=>[m.id,h.descricao]));assert.equal(todas.length,37);
// O dado a mais, e não a palavra: a ficha pode dizer "sem +1d6" (o lote da Bestiarista de 30/10 já escreve assim na
// justificativa), e isso não é o card prometendo dado.
const DADO_A_MAIS=/(?<!sem )\+\d*d6/;assert.ok(DADO_A_MAIS.test('investindo: 3d6 +19 (C) (o +1d6 e a Força 6 mais uma vez)'));assert.ok(DADO_A_MAIS.test('Nesta criatura: +1d6 e a Força 4'));assert.ok(!DADO_A_MAIS.test('soma mais uma Força, sem +1d6 (P20-b)'));assert.ok(!DADO_A_MAIS.test('investindo: 2d6 +19 (C)'));
const comDado=todas.filter(([,d])=>DADO_A_MAIS.test(d));assert.deepEqual(comDado,[],'card com o +1d6');
const txt=(id)=>todas.find(([i])=>i===id)[1];assert.match(txt('aguia-gigante'),/Garras em mergulho investindo: 2d6 \+19 \(C\) \(a Força 6 mais uma vez\)/);assert.match(txt('minotauro'),/Nesta criatura: a Força 7 mais uma vez no dano do golpe/);
});
// P23 (decisão do autor de 30/10/2026): (a) o chifre do minotauro soma com as duas mãos ocupadas (−2 do machado e +1
// do chifre); (b) o solar só leva o −2 com o montante em uso, e não de arco: o card mostra as duas Defesas.
cases.set('P23', async () => {
const vista=(id)=>{const c=JSON.parse(fs.readFileSync(`src/data/bestiario/${id}.json`,'utf8'));return [M.criatura(c),M.vistaPublicaCriatura(c).motor.stat];};
const [rm,mi]=vista('minotauro');assert.equal(rm.bloqueio,8);assert.equal(mi.defesa,rm.bloqueio-2+1,'minotauro: Bloqueio 8, −2 do machado, +1 do chifre');assert.equal(mi.defesa,7);assert.equal(mi.defesaOutraArma,undefined,'o minotauro não tem outra arma do catálogo');
const [rs,so]=vista('solar');assert.equal(rs.bloqueio,24);assert.equal(so.defesa,22,'solar com o montante');assert.deepEqual(so.defesaOutraArma,{arma:'Arco longo',armaPrincipal:'Montante',bloqueio:24,defesa:24},'solar de arco, sem o −2');
for(const id of ['arconte-trombeta','planetar','cavaleiro-de-elite','bruto'])assert.equal(vista(id)[1].defesaOutraArma,undefined,id);
const mon=JSON.parse(fs.readFileSync('src/data/monsters.json','utf8'));const outras=mon.filter(m=>m.combate.defesaOutraArma).map(m=>m.id).sort();assert.deepEqual(outras,['merfolk','solar'],'as criaturas com duas Defesas por arma');
const mesa=JSON.parse(fs.readFileSync('src/data/monsters-mesa.json','utf8'));assert.equal(mesa.find(m=>m.id==='solar').combate.defesa,22,'a mesa usa a do primeiro ataque, o montante');assert.equal(mesa.find(m=>m.id==='minotauro').combate.defesa,7);
for(const f of ['src/components/BestaCard.astro','src/components/FormaCriatura.astro'])assert.match(fs.readFileSync(f,'utf8'),/\{i\.combate\.defesaOutraArma && <><small> c\/ \{i\.combate\.defesaOutraArma\.armaPrincipal\}<\/small> · \{i\.combate\.defesaOutraArma\.defesa\}<small> c\/ \{i\.combate\.defesaOutraArma\.arma\}<\/small><\/>\}/,f);
const MB=await carregarTS('src/lib/mesa-bestiario.ts');const h=MB.cardCriaturaHTML(mon.find(m=>m.id==='solar'));assert.match(h,/<dt>Defesa<\/dt><dd>22 <small>\(c\/ Montante; c\/ Arco longo: 24\)<\/small><\/dd>/);
});
// C1 (revisão de af3697c7): "sem dado" na linha "Prende a respiração" não chega ao JSON, na principal e na forma, com a
// marca ou sem ela; e nenhum valor de texto dos 324 JSON nem dos três gerados é só "sem dado", em campo nenhum.
cases.set('C1-sem-dado', async () => {
for(const cel of ['sem dado.','sem dado','**[sem dado]**.']){const r=conv(raw.replace('- Prende a respiração: a de um humano.','- Prende a respiração: '+cel));assert.ok(!('prendeRespiracao' in r.criatura.fisiologia),'principal, "'+cel+'": '+JSON.stringify(r.criatura.fisiologia.prendeRespiracao));}
const v=conv(variant('Prende a respiração: sem dado.'));const fh=v.criatura.formas.find(f=>f.id==='humana');assert.ok(fh,'a forma humana existe');assert.ok(!('prendeRespiracao' in (fh.fisiologia||{})),'forma: '+JSON.stringify(fh.fisiologia?.prendeRespiracao));
const ok=conv(raw.replace('- Prende a respiração: a de um humano.','- Prende a respiração: 2 minutos.'));assert.equal(ok.criatura.fisiologia.prendeRespiracao,'2 minutos','o valor de verdade continua');
const SD=/^\s*(\*\*\[)?sem dado(\]\*\*)?\.?\s*$/i;const achados=[];
const anda=(x,p,f)=>{if(typeof x==='string'){if(SD.test(x))achados.push(f+':'+p);}else if(Array.isArray(x))x.forEach((y,i)=>anda(y,p+'['+i+']',f));else if(x&&typeof x==='object')for(const [k,y] of Object.entries(x))anda(y,p+'.'+k,f);};
const arqs=fs.readdirSync('src/data/bestiario').filter(f=>f.endsWith('.json'));assert.equal(arqs.length,324);
for(const f of arqs)anda(JSON.parse(fs.readFileSync('src/data/bestiario/'+f,'utf8')),'',f);
for(const f of ['monsters.json','monsters-mesa.json','inimigos.json'])anda(JSON.parse(fs.readFileSync('src/data/'+f,'utf8')),'',f);
assert.deepEqual(achados,[],'valores "sem dado" gravados: '+achados.length+' '+achados.slice(0,5).join(' '));
});
// Reconversão 5d (30/10/2026): o card diz o porquê da linha de PV com as palavras da ficha (`corpo.linhaPVMotivo`), e não
// só o critério do livro; a forma não herda o porquê da principal quando escolhe a própria linha ou tem massa própria.
cases.set('linhaPV-motivo', async () => {
const B=await carregarTS('src/lib/besta-card.ts');const z={zonaKg:[70/1000,130/1000],linha:'acima',pvAcima:2,pvAbaixo:1};
assert.equal(B.linhaPVTxt(z,2,'inseto de casca'),'PV pela linha de cima da zona de transição (70 g a 130 g): a ficha escolheu pelo corpo, inseto de casca (o robusto sobe); a linha de baixo daria 1.');
assert.equal(B.linhaPVTxt(z,2),'PV pela linha de cima da zona de transição (70 g a 130 g): a ficha escolheu pelo corpo, robusto, que sobe; a linha de baixo daria 1.','sem o porquê, o critério do livro');
const p={corpo:{massa:0.1,linhaPV:'acima',linhaPVMotivo:'da principal'}};
assert.equal(M.comForma(p,{corpo:{massa:36}}).corpo.linhaPVMotivo,undefined,'a forma de massa própria herdou o porquê');
assert.equal(M.comForma(p,{corpo:{massa:36,linhaPV:'abaixo'}}).corpo.linhaPVMotivo,undefined,'a forma de linha própria herdou o porquê');
assert.equal(M.comForma(p,{corpo:{massa:36,linhaPV:'acima',linhaPVMotivo:'da forma'}}).corpo.linhaPVMotivo,'da forma');
assert.equal(M.comForma(p,{corpo:{area:1}}).corpo.linhaPVMotivo,'da principal','a forma que não muda a massa fica com a linha e o porquê');
for(const f of ['src/components/BestaCard.astro','src/components/FormaCriatura.astro'])assert.match(fs.readFileSync(f,'utf8'),/linhaPVTxt\([^;]*i\.corpo\.linhaPVMotivo\)/,f);
assert.match(fs.readFileSync('src/lib/mesa-bestiario.ts','utf8'),/linhaPVTxt\([^;]*m\.corpo\.linhaPVMotivo\)/);
});
// CASES
let failures=0;
for(const [id,test] of cases) {
 if(process.argv[2] && process.argv[2]!==id)continue;
 try { await test(); console.log('OK F5-'+id); }
 catch(e) { failures++;console.error('FALHA F5-'+id+': '+e.stack); }
}
if(failures)process.exitCode=1;
