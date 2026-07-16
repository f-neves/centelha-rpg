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

function build(c) {
  const h = HAB[c.id] || {}, d = DIM[c.id] || {}, l = LORE[c.id] || {}, e = ECO[c.id] || {};
  return {
    id: c.id,
    nome: c.nome,
    nomeIngles: h.en || null,
    categoria: c.categoria || null,
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
    atributos: c.atributos,
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
  if (!m.imagem) problemas.push(`${m.id}: sem imagem`);
}
if (problemas.length) {
  console.error('FALHA na unificação:\n' + problemas.join('\n'));
  process.exit(1);
}

const out = join(data, 'monsters.json');
writeFileSync(out, JSON.stringify(monsters, null, 1));
console.log(`monsters.json: ${monsters.length} criaturas, ${(statSync(out).size / 1024).toFixed(0)} KB.`);
