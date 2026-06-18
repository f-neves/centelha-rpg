// migrate-to-json.mjs — ONE-TIME: TECH/ARTE_*/.md → src/data/*.json canônico
// Reaproveita o parser de build_livro.mjs. Depois disso, os JSON são a fonte editável.
// uso: node migrate-to-json.mjs
import fs from 'node:fs';
import path from 'node:path';
import {
  TECH, CAMINFO, TRILHAS, ARTE_DESC, ARTE_FX, ARTE_ELEM, ARTE_UNIV, extract,
} from './build_livro.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/,'$1'));
const PROJ = path.join(ROOT,'..'); // raiz do projeto (legacy/ fica um nível abaixo)
const OUT = path.join(PROJ,'src','data');
fs.mkdirSync(OUT,{recursive:true});
const write = (f,obj)=>fs.writeFileSync(path.join(OUT,f), JSON.stringify(obj,null,2)+'\n','utf8');

const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
  .replace(/[()'.]/g,'').replace(/&/g,' e ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const stripTec = s => s.replace(/\s*\(téc\.\)\s*$/,'');

const revisar = []; // linhas para REVISAR.md
const warns = [];

/* ---------- ATRIBUTOS ---------- */
const ATTR_DESC = {
  'Força':['fisico','Poder físico bruto — erguer, golpear, quebrar, dobrar o ferro.'],
  'Destreza':['fisico','Agilidade, precisão e coordenação fina do corpo.'],
  'Vigor':['fisico','Resistência, fôlego e saúde; o quanto o corpo aguenta.'],
  'Carisma':['social','A presença que inspira, cativa e arrasta multidões.'],
  'Manipulação':['social','A arte de torcer vontades, conduzir e enganar.'],
  'Aparência':['social','O impacto imediato da presença física sobre os outros.'],
  'Percepção':['mental','O quanto você nota do mundo à sua volta.'],
  'Inteligência':['mental','Saber, raciocínio estruturado, memória e criação.'],
  'Raciocínio':['mental','Rapidez mental: reagir, improvisar e pensar sob pressão.'],
};
const atributos = Object.entries(ATTR_DESC).map(([nome,[grupo,descricao]])=>({
  id:slug(nome), nome, grupo, descricao,
}));
const ATTR_ID = Object.fromEntries(atributos.map(a=>[a.nome,a.id]));
write('atributos.json', atributos);

/* ---------- HABILIDADES ---------- */
const HAB = {
  combate:[['Briga','Combate corpo-a-corpo desarmado: socos, agarrões, projeções.'],
    ['Armas de Corte','Espadas, machados, adagas — lâminas que retalham ou perfuram.'],
    ['Armas de Impacto','Maças, martelos, bastões — golpes contundentes.'],
    ['Armas de Haste','Lanças, alabardas — alcance e controle de distância.'],
    ['Armas à Distância','Arcos, bestas e armas de arremesso.'],
    ['Esquiva','Desviar-se de golpes e perigos pela mobilidade.'],
    ['Escudos','Bloquear com escudo e usá-lo ofensivamente.']],
  fisica:[['Atletismo','Correr, saltar, escalar, nadar — proeza física geral.'],
    ['Resistência','Suportar fadiga, dor, privação e esforço prolongado.'],
    ['Furtividade','Mover-se sem ser visto nem ouvido.'],
    ['Prontidão','Estar alerta; notar perigo e reagir a tempo.'],
    ['Sobrevivência','Caçar, rastrear, orientar-se e durar no ermo.']],
  social:[['Lábia','Persuadir, charmar e negociar com palavras.'],
    ['Oratória','Discursar e mover plateias.'],
    ['Etiqueta','Conduzir-se conforme costumes e protocolos.'],
    ['Empatia','Ler emoções e intenções alheias.'],
    ['Intimidação','Dobrar pela ameaça, pela força ou pelo medo.'],
    ['Manha','Esperteza de rua, blefe e malandragem.']],
  saber:[['Investigação','Achar pistas, conectar fatos, reconstituir o que houve.'],
    ['Conhecimentos','Saber acadêmico amplo: história, geografia, lore.'],
    ['Ocultismo','O sobrenatural, a feitiçaria e seus símbolos.'],
    ['Medicina','Tratar feridas, doenças e venenos.'],
    ['Ciências','Lógica, matemática e o estudo do mundo natural.']],
  tecnica:[['Craft','Construir e consertar — o ofício das mãos.'],
    ['Ladinagem','Fechaduras, armadilhas, prestidigitação e furto.'],
    ['Cavalgar','Conduzir montarias e veículos.'],
    ['Performance','Música, atuação e artes que encantam.'],
    ['Tática','Ler o campo de batalha e comandar movimentos.'],
    ['Política','Intriga, burocracia e jogo de poder.'],
    ['Comércio','Avaliar, barganhar e mover bens e dinheiro.']],
};
const habilidades = [];
for(const [grupo,arr] of Object.entries(HAB)) for(const [nome,descricao] of arr)
  habilidades.push({ id:slug(nome), nome, grupo, descricao });
write('habilidades.json', habilidades);

/* ---------- VIRTUDES ---------- */
const virtudes = [
  ['Compaixão','a crueldade','Empatia e misericórdia; o impulso de poupar e cuidar.'],
  ['Convicção','a dor, a tortura e o desânimo','Determinação inabalável diante do sofrimento.'],
  ['Temperança','a tentação e a provocação','Disciplina e clareza; autocontrole sob pressão.'],
  ['Valor','o medo e a intimidação','Bravura para encarar o perigo.'],
].map(([nome,resiste,descricao])=>({ id:slug(nome), nome, resiste, descricao }));
write('virtudes.json', virtudes);

/* ---------- CAMINHOS ---------- */
// TRILHAS: [trilhaNome, sub, [[Atributo,[caminhos...]]...]]
const caminhos = [];
const CAM_TRILHA = {}, CAM_ATTR = {};
for(const [trilhaNome,,atributosArr] of TRILHAS){
  const trilha = slug(trilhaNome); // corpo|voz|mente
  for(const [attrNome,lista] of atributosArr){
    for(const nome of lista){
      const info = CAMINFO[nome]||'';
      // "Atributo · âncora X — tagline"
      const mAnc = /âncora\s+([^—]+?)\s*—/.exec(info);
      const mDesc = /—\s*(.+)$/.exec(info);
      caminhos.push({
        id:slug(nome), nome, trilha, atributo:ATTR_ID[attrNome],
        habilidade_ancora: mAnc ? mAnc[1].trim() : undefined,
        descricao: mDesc ? mDesc[1].trim() : info,
      });
      CAM_TRILHA[nome]=trilha; CAM_ATTR[nome]=ATTR_ID[attrNome];
    }
  }
}
write('caminhos.json', caminhos);
const CAM_ID = Object.fromEntries(caminhos.map(c=>[c.nome,c.id]));

/* ---------- TÉCNICAS ---------- */
// 1ª passada: extrair tudo e achar a raiz de cada caminho
const rawTechs = Object.entries(TECH).map(([nome,[caminho,banda]])=>{
  const { meta, tags, effect } = extract(nome);
  return { nome, caminho, banda, meta, tags, effect };
});
const ROOTS = {}; // caminhoNome -> nome da técnica raiz
for(const t of rawTechs) if(/\braiz\b/i.test(t.meta) && !ROOTS[t.caminho]) ROOTS[t.caminho]=t.nome;

const idOf = nome => slug(stripTec(nome));
const ALL_IDS = new Set(rawTechs.map(t=>idOf(t.nome)));

function parsePrereq(meta, caminhoNome){
  const m = /pré:\s*(.+)$/i.exec(meta);
  if(!m) return [];
  let s = m[1];
  // corta tokens de custo/tipo que vêm depois (formato compacto "X, 1 En")
  s = s.replace(/,?\s*\d+\s*En\b.*$/i,'')
       .replace(/,?\s*\+\d+\s*Vontade.*$/i,'')
       .replace(/,?\s*\b(reflexiva|passiva|ativa|dura a cena|cena)\b.*$/i,'');
  return s.split('+').map(tok=>{
    tok = tok.replace(/\[[^\]]*\]/g,'').trim();          // remove [Atributo]
    if(tok.includes('→')){
      const [camPart, techPart] = tok.split('→').map(x=>x.trim());
      if(/^raiz$/i.test(techPart)){
        const root = ROOTS[camPart] || ROOTS[camPart.replace(/^Caminho d[oa]s?\s+/i,'')];
        return root ? idOf(root) : null;
      }
      return idOf(techPart);
    }
    return idOf(tok);
  }).filter(Boolean);
}

const tecnicas = rawTechs.map(t=>{
  const nome = stripTec(t.nome);
  const id = idOf(t.nome);
  const tagsLow = (t.tags||'').toLowerCase();
  const metaLow = (t.meta||'').toLowerCase();
  const blob = tagsLow+' '+metaLow;
  const tipo = /reflexiv/.test(blob) ? 'reflexiva' : /passiv/.test(blob) ? 'passiva' : 'ativa';
  const custo = {};
  const en = /(\d+)\s*en\b/i.exec(t.tags) || /(\d+)\s*en\b/i.exec(t.meta);
  const vo = /\+(\d+)\s*vontade/i.exec(blob);
  if(tipo!=='passiva') custo.energia = en ? +en[1] : t.banda;
  if(vo) custo.vontade = +vo[1];
  const prereq = parsePrereq(t.meta, t.caminho);
  for(const p of prereq) if(!ALL_IDS.has(p)) warns.push(`prereq órfão em "${nome}": ${p} (meta: ${t.meta})`);
  const texto = (t.effect||'').replace(/<\/?strong>/g,'**').trim();
  return {
    id, nome, caminho: CAM_ID[t.caminho], atributo: CAM_ATTR[t.caminho],
    banda: t.banda, tipo, custo, prereq, aliases:[], texto, pendente:false,
  };
});
write('tecnicas.json', tecnicas);

/* ---------- ARTES ---------- */
const CONJ = { 'Fascinação':'Manipulação' }; // demais: Inteligência
const ordem = [...ARTE_ELEM.map(n=>['elemental',n]), ...ARTE_UNIV.map(n=>['universal',n])];
const artes = ordem.map(([categoria,nome])=>{
  const niveis = (ARTE_FX[nome]||[]).map((linha,i)=>{
    const [head,...rest] = linha.split(' — ');
    return { nivel:i+1, nome:head.trim(), efeito:(rest.join(' — ')||head).trim(), custo:{mana:i+1} };
  });
  return {
    id:slug(nome), nome, categoria,
    atributo_conjuracao: ATTR_ID[CONJ[nome]||'Inteligência'],
    niveis, aliases:[], pendente:false,
  };
});
write('artes.json', artes);

/* ---------- GLOSSÁRIO ---------- */
const glossario = [
  ['Ticks','Unidade de tempo do combate. Cada ação custa um número de Ticks (a Speed); depois de agir, você só joga de novo quando eles passam.',['speed','tempo de ação','linha do tempo']],
  ['Iniciativa','1d6 + Raciocínio + Prontidão no início do combate; define a ordem e a distância em Ticks até cada um agir.',['ordem de ação']],
  ['Pool','O punhado de d6 que você rola: ⌊(Atributo + Habilidade) ÷ 2⌋ dados, +2 fixo se a soma for ímpar.',['dados','pool de dados']],
  ['Margem','Cada 6 pontos acima do alvo é uma Margem — em combate vira +1d6 de dano; fora dele, um efeito melhor.',['graus de sucesso']],
  ['Dificuldade','O alvo de uma tarefa, na mesma régua de Atributo + Habilidade (5 fácil, 10 média, 20 limite humano).',['dif','alvo']],
  ['Soak','Absorção de dano: Vigor contra Impacto, metade do Vigor contra letal; a armadura soma mais.',['absorção','redução de dano']],
  ['Penetração','Atributo de armas perfurantes; se não vencer a Proteção da armadura, o dano perfurante é anulado.',['pen','perfuração']],
  ['Ruptura','Tag (Crush) que ignora todo o Soak de impacto da armadura — a resposta às placas.',['crush']],
  ['Defesa','Valor fixo e passivo que o atacante precisa superar: (Destreza + Habilidade) × 2 − ⌊soma÷4⌋ + Especialidade + ⌈Centelha÷2⌉.',['esquiva','bloqueio']],
  ['Defesa Mental','Muro passivo contra manipulação e poderes mentais: ⌊(Integridade + Vontade) ÷ 2⌋ + Centelha.',['resistência mental']],
  ['Centelha','O nível de poder pessoal (0–5), do mortal ao semideus. Destrava as bandas dos Caminhos e dimensiona Energia e Mana.',['essência','spark','poder']],
  ['Vontade','Força de Vontade — reserva (piso 5) gasta para melhorar ações, resistir a efeitos mentais, ignorar penalidades e conjurar.',['willpower','força de vontade']],
  ['Energia','Combustível dos Caminhos mundanos: (Centelha × 3) + soma das Virtudes + Vontade.',['reserva de técnicas']],
  ['Mana','Combustível do Arcano: (Centelha × 2) + Vontade. Conjurar custa Mana = nível do efeito.',['reserva mágica']],
  ['Integridade','Compaixão + Temperança — bússola moral e compostura; sustenta a Defesa Mental.',['compostura']],
  ['Especialidade','Treino focado: por ponto, role +1d6 e descarte o menor (até o nível na Habilidade). Em valores fixos, +1 por ponto.',['especialização']],
  ['Banda','Faixa de poder de uma Técnica (1–5). A banda N exige Centelha ≥ ⌈N ÷ 3⌉.',['faixa de poder']],
  ['Caminho','Árvore temática de Técnicas ancorada num atributo, do mundano ao divino.',['subcaminho','trilha de técnicas']],
  ['Técnica','Cada nó de um Caminho: uma manobra, dom ou poder, com banda, tipo, custo e pré-requisitos.',['poder','manobra','charm']],
  ['Arte','Linha de feitiçaria do Arcano, comprada e evoluída em separado, em 5 níveis.',['feitiçaria','magia','path']],
  ['Virtude','Compaixão, Convicção, Temperança, Valor (1–5): movem a alma e alimentam resistências e façanhas.',['virtudes']],
  ['Stunt','Bônus por descrever a ação com criatividade e uso do cenário (+2 fixo, +1d6 ou +2d6).',['manobra criativa']],
  ['Valor Passivo','Quando só um lado rola: (Atributo + Habilidade) × 2 do outro serve de alvo.',['passiva','percepção passiva']],
];
write('glossario.json', glossario.map(([termo,definicao,aliases])=>({id:slug(termo),termo,aliases,definicao})));

/* ---------- REGRAS (números/fórmulas — fonte das calculadoras) ---------- */
const regras = {
  pisos:{ atributo:2, habilidade:0, virtude:1, vontade:5, centelha:0, caminho:0 },
  limitesCriacao:{ atributo:4, habilidade:3, centelha:2 },
  orcamentoPadrao:400, orcamentoCru:300, orcamentoHeroico:500,
  progressaoPorSessao:[8,15],
  xp:{
    atributo:{ tipo:'mult', valor:10 },
    habilidadePrimaria:{ tipo:'mult', valor:5 },
    habilidadeSecundaria:{ tipo:'mult', valor:2 },
    especialidadePrimaria:{ tipo:'flat', valor:10 },
    especialidadeSecundaria:{ tipo:'flat', valor:5 },
    virtude:{ tipo:'mult', valor:5 },
    vontade:{ tipo:'mult', valor:2 },
    centelha:{ tipo:'mult', valor:15 },
    tecnica:{ tipo:'porBanda', valor:5 },
    arte:{ tipo:'porNivel', valor:10 },
  },
  dadoArmaPorPeso:{ leve:1, media:2, pesada:3 },
  dificuldade:[
    {dif:5,desafio:'Fácil',aaltura:'3 — competente'},
    {dif:10,desafio:'Média',aaltura:'6 — bom no ofício'},
    {dif:15,desafio:'Difícil',aaltura:'8 — perito'},
    {dif:20,desafio:'Limite humano',aaltura:'10 — mestre'},
    {dif:25,desafio:'Excepcional',aaltura:'raros humanos'},
    {dif:30,desafio:'Sobre-humano',aaltura:'requer Centelha / Caminhos'},
  ],
  bandas:[
    {centelha:1,bandas:'1–3',estatura:'Mortal+'},
    {centelha:2,bandas:'4–6',estatura:'Herói'},
    {centelha:3,bandas:'7–9',estatura:'Semideus'},
    {centelha:4,bandas:'10–12',estatura:'Semideus'},
    {centelha:5,bandas:'13–15',estatura:'Quase-deus'},
  ],
  ferimentos:[
    {minPct:76,maxPct:100,estado:'Saudável',penAcao:0,penDefesa:0},
    {minPct:51,maxPct:75,estado:'Machucado',penAcao:-1,penDefesa:0},
    {minPct:26,maxPct:50,estado:'Ferido',penAcao:-2,penDefesa:-1},
    {minPct:11,maxPct:25,estado:'Grave',penAcao:-3,penDefesa:-2},
    {minPct:1,maxPct:10,estado:'Crítico',penAcao:-4,penDefesa:-3},
    {minPct:0,maxPct:0,estado:'Caído',penAcao:null,penDefesa:null},
  ],
  derivados:{
    pv:{ base:25, vigorMult:3 },
    defesa:{ atributo:'destreza', mult:2, somaDiv:4, especialidade:true, centelhaCeilDiv:2 },
    defesaMental:{ integridade:['compaixao','temperanca'], div:2, maisCentelha:true },
    energia:{ centelhaMult:3, maisSomaVirtudes:true, maisVontade:true },
    mana:{ centelhaMult:2, maisVontade:true },
    iniciativa:{ dado:6, soma:['raciocinio','prontidao'] },
  },
};
write('regras.json', regras);

/* ---------- REVISAR.md ---------- */
const pendentes = tecnicas.filter(t=>t.pendente);
const lines = [];
lines.push('# REVISAR — pontos a conferir do Centelha (site V1)\n');
lines.push('> Gerado por `migrate-to-json.mjs`. Cada item aqui ou foi redigido provisoriamente, ou diverge da fonte e precisa de decisão humana.\n');
lines.push('## Divergências de mecânica\n');
lines.push('- **Iniciativa do Kael.** A fórmula é `1d6 + Raciocínio + Prontidão`. Com os atributos do exemplo (Raciocínio 3, Prontidão 2) o resultado é **1d6+5**. O texto antigo do doc dizia "1d6+6" — mantivemos a fórmula (→ **+5**), conforme decisão do autor. PV 34 · Defesa 10 · Energia 16 · Mana 7 conferem.\n');
lines.push(`## Técnicas com prosa provisória (pendente:true) — ${pendentes.length}\n`);
if(pendentes.length) for(const t of pendentes) lines.push(`- **${t.nome}** (${t.caminho}, banda ${t.banda}) — revisar texto.`);
else lines.push('Nenhuma: todas as Técnicas têm prosa vinda do catálogo `.md`.\n');
if(warns.length){ lines.push('\n## ⚠ Avisos da migração (resolver)\n'); for(const w of warns) lines.push('- '+w); }
fs.writeFileSync(path.join(PROJ,'REVISAR.md'), lines.join('\n')+'\n','utf8');

console.log(`OK — ${atributos.length} atributos, ${habilidades.length} habilidades, ${virtudes.length} virtudes, ${caminhos.length} caminhos, ${tecnicas.length} técnicas, ${artes.length} artes, ${glossario.length} termos.`);
console.log(`prereq órfãos: ${warns.length}${warns.length?' (ver REVISAR.md)':''}`);
