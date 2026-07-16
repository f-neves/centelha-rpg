// Unifica os 5 arquivos de dados do bestiário num único src/data/monsters.json.
// Fonte: inimigos.json (stat block, GERADO por gen-bestiario.mjs) + os satélites
// habilidades / dimensoes / lore / imagens (editáveis à mão), todos por id.
// Rodar: node scripts/gen-monsters.mjs   (rode gen-bestiario.mjs antes se mexeu nas builds)
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const data = join(dir, '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(data, f), 'utf8'));

const inim = read('inimigos.json');
const HAB = read('habilidades-bestiario.json');
const DIM = read('dimensoes-bestiario.json');
const LORE = read('lore-bestiario.json');
const IMG = read('imagens-bestiario.json');
const ECO = read('ecologia-bestiario.json'); // tipo (PF2e) + terreno + clima, por id

// Categoria = tipo de criatura no molde do Bestiary 1 (Pathfinder 1e, pág. 318 "Monsters by Type"),
// derivada do ecologia.tipo + ajustes por criatura. Vai para o badge de Categoria.
const CAT_LABEL = {
  Aberration: 'Aberração', Animal: 'Animal', Beast: 'Besta mágica', Celestial: 'Celestial',
  Construct: 'Construto', Dragon: 'Dragão', Elemental: 'Elemental', Fey: 'Fada', Fiend: 'Corruptor',
  Giant: 'Gigante', Humanoid: 'Humanoide', Ooze: 'Limo', Plant: 'Planta', Undead: 'Morto-vivo',
  Monitor: 'Outsider', Spirit: 'Espírito',
};
const CAT_OVERRIDE = {
  // Humanoide monstruoso (PF1e Monstrous Humanoid)
  'mon-bruxa-verde-hag': 'Humanoide monstruoso', 'mon-gargula': 'Humanoide monstruoso',
  'mon-harpia': 'Humanoide monstruoso', 'mon-lamia': 'Humanoide monstruoso',
  'mon-medusa': 'Humanoide monstruoso', 'mon-minotauro': 'Humanoide monstruoso',
  // Outsider nativo (PF1e Outsider native)
  'mon-couatl': 'Outsider', 'mon-rakshasa': 'Outsider',
  // Oni é do tipo gigante
  'mon-ogro-mago-oni': 'Gigante',
  // ajustes pontuais
  'mon-doppelganger': 'Aberração', 'mon-unicornio': 'Besta mágica',
};
// criaturas importadas do Bestiary 1: categoria calculada do tipo PF (categoria-extra.json)
try { Object.assign(CAT_OVERRIDE, read('categoria-extra.json')); } catch { /* sem extras */ }
const catDe = (id, tipo) => CAT_OVERRIDE[id] || CAT_LABEL[tipo] || tipo || null;

// Aparência (traço próprio 1–10 do sistema; para criaturas liberamos extremos <0 ou >10)
// e Virtudes (Compaixão · Convicção · Temperança · Valor), derivadas da NATUREZA (ecologia.tipo
// + categoria). É um ponto de partida por categoria — o Mestre afina caso a caso pela descrição.
// A Aparência é INDEPENDENTE da Compostura: um corruptor pode ter Aparência baixa (feio) e
// Compostura alta (postura que intimida e amedronta).
const AP_BASE = {
  Celestial: 10, Positive: 9, Fey: 8, Dragon: 8, Astral: 6, Monitor: 6, Dream: 6, Spirit: 5,
  Elemental: 5, Beast: 5, Time: 5, Animal: 4, Construct: 4, Ethereal: 4, Humanoid: 4, Petitioner: 4,
  Plant: 3, Shadow: 3, Undead: 2, Fungus: 2, Fiend: 1, Aberration: 1, Ooze: 1, Negative: 1,
};
// exceções notáveis (belezas fora da curva do tipo, e feiuras extremas)
const AP_OVER = {
  'mon-solar': 12, 'mon-planetar': 11, 'mon-deva-astral': 10, 'mon-couatl': 9, 'mon-unicornio': 10,
  'mon-sucubo': 9, 'mon-medusa': 7, 'mon-balor': -2, 'mon-vrock': 0, 'mon-nalfeshnee': -1,
};
function aparenciaDe(id, tipo, ameaca) {
  if (AP_OVER[id] !== undefined) return AP_OVER[id];
  let ap = AP_BASE[tipo] ?? 4;
  if (tipo === 'Fiend') ap = 1 - Math.max(0, ameaca - 4);   // corruptores maiores, mais horrendos (até negativo)
  else if (tipo === 'Celestial') ap += ameaca >= 5 ? 2 : 0; // alto escalão celestial, deslumbrante
  else if (tipo === 'Dragon') ap += ameaca >= 5 ? 1 : 0;    // dragões anciãos, mais imponentes
  return ap;
}
// Virtudes por tipo: [Compaixão, Convicção, Temperança, Valor]. Animais e seres animalescos ficam
// baixos nas virtudes "de ser pensante" (Compaixão/Temperança), coerente com Perspicácia/Int baixas.
const V_BASE = {
  Celestial: [5, 5, 4, 4], Positive: [5, 4, 3, 3], Fey: [3, 3, 2, 3], Dragon: [2, 5, 3, 5],
  Monitor: [2, 4, 3, 4], Humanoid: [2, 3, 2, 3], Giant: [1, 3, 2, 4], Spirit: [1, 3, 2, 3],
  Elemental: [1, 3, 2, 3], Beast: [1, 3, 2, 3], Animal: [1, 2, 2, 2], Construct: [0, 3, 3, 3],
  Fiend: [0, 5, 2, 4], Undead: [0, 4, 2, 3], Aberration: [0, 3, 2, 3], Plant: [0, 2, 1, 2],
  Fungus: [0, 1, 1, 2], Ooze: [0, 1, 1, 2], Negative: [0, 4, 2, 3],
};
function virtudesDe(tipo, categoria, ameaca, en) {
  let [co, cv, te, va] = V_BASE[tipo] || [2, 2, 2, 2];
  const devil = categoria === 'Diabo' || /devil/i.test(en || '');
  const demon = !devil && (categoria === 'Demônio' || tipo === 'Fiend');
  if (devil) { co = 1; cv = 5; te = 5; va = Math.max(va, 3); }   // diabos: lei fria e implacável
  else if (demon) { co = 0; cv = 5; te = 1; va = 5; }            // demônios: fúria caótica
  va = Math.min(6, va + (ameaca >= 5 ? 1 : 0));                  // mais temível → mais Valor
  return { compaixao: co, conviccao: cv, temperanca: te, valor: va };
}

function build(c) {
  const h = HAB[c.id] || {}, d = DIM[c.id] || {}, l = LORE[c.id] || {}, e = ECO[c.id] || {};
  const categoria = catDe(c.id, e.tipo) || c.categoria || null;
  return {
    id: c.id,
    nome: c.nome,
    nomeIngles: h.en || null,
    categoria,
    tipo: c.tipo,
    conceito: c.conceito,
    descricao: c.descricao || '',
    tags: c.tags || [],
    ameaca: c.ameaca,
    centelha: c.centelha,
    pendente: !!c.pendente,
    porte: d.porte || null,
    dimensoes: { medida: d.medida || null, peso: d.peso || null },
    ecologia: { tipo: e.tipo || null, terreno: e.terreno || [], clima: e.clima || [] },
    imagem: IMG[c.id] || null,
    semImagem: !IMG[c.id],
    atributos: c.atributos,
    vontade: c.vontade ?? 5,
    aparencia: aparenciaDe(c.id, e.tipo, c.ameaca),
    virtudes: virtudesDe(e.tipo, categoria, c.ameaca, h.en),
    combate: {
      pv: c.pv,
      defesa: c.defesa,
      defesaMental: c.defesaMental,
      absorcao: { impacto: c.soak.impacto, corte: c.soak.corte, perfuracao: c.soak.perfuracao },
      resistenciaPerfuracao: c.resistPerf || 0,
      iniciativa: c.iniciativa,
      ataques: (c.ataques || []).map((a) => ({ nome: a.nome, pool: a.pool, dano: a.dano, speed: a.ticks, ...(a.notas ? { notas: a.notas } : {}) })),
    },
    habilidades: (h.hab || []).map((x) => ({ nome: x.n, descricao: x.d })),
    poderes: (c.poderes || []).map((p) => ({ efeito: p.efeito, tipo: p.tipo, alvo: p.alvo, ...(p.caminho ? { caminho: p.caminho } : {}), ...(p.arte ? { arte: p.arte } : {}) })),
    tecnicas: c.tecnicas || [],
    artes: (c.artes || []).map((a) => ({ id: a.id && a.id.id ? a.id.id : a.id, nivel: a.nivel })),
    notas: c.notas || '',
    lore: (l.secoes || []).map((s) => ({ titulo: s.t, texto: s.d })),
  };
}

const monsters = inim.map(build).sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));

// checagem de integridade: todas as fontes presentes por criatura
const problemas = [];
for (const m of monsters) {
  if (!m.atributos) problemas.push(`${m.id}: sem atributos`);
  if (m.combate.pv == null) problemas.push(`${m.id}: sem combate.pv`);
  if (!m.habilidades.length) problemas.push(`${m.id}: sem habilidades`);
  if (!m.lore.length) problemas.push(`${m.id}: sem lore`);
  if (!m.dimensoes.medida) problemas.push(`${m.id}: sem dimensoes`);
  if (!m.ecologia.tipo) problemas.push(`${m.id}: sem ecologia.tipo`);
  // imagem opcional: criaturas sem arte ganham semImagem:true e o badge "Sem imagem"
}
if (problemas.length) {
  console.error('FALHA na unificação:\n' + problemas.join('\n'));
  process.exit(1);
}

const out = join(data, 'monsters.json');
writeFileSync(out, JSON.stringify(monsters, null, 1));
console.log(`monsters.json: ${monsters.length} criaturas, ${(statSync(out).size / 1024).toFixed(0)} KB.`);
