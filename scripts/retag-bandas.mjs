// retag-bandas.mjs — re-etiqueta as Técnicas do modelo de 5 bandas (=tier) para 15 bandas
// (3 sub-bandas por tier de Centelha). Regras aprovadas tier a tier com o usuário.
// Reproduzível: edita src/data/tecnicas.json no lugar. Roda: node scripts/retag-bandas.mjs
import fs from 'node:fs';

const P = './src/data/tecnicas.json';
const arr = JSON.parse(fs.readFileSync(P, 'utf8'));
const byId = Object.fromEntries(arr.map((t) => [t.id, t]));
const depth = (t) => {
  const ps = (t.prereq || []).map((p) => byId[p]).filter(Boolean);
  return ps.length ? 1 + Math.max(...ps.map(depth)) : 0;
};

// Bandas explícitas: trocas de tier + redistribuição das 2 árvores sociais novas.
const OVERRIDES = {
  // sobem de tier
  'salto-do-grilo': 4, 'levantamento-poderoso': 5,      // Tocado -> Herói
  'corrida-vertical': 7, 'inquebrantavel': 8,           // Herói -> Grande herói
  // árvore leitor-de-almas (concentra Tocado..Grande herói)
  'olhar-perspicaz': 1, 'farejar-a-mentira': 2, 'ler-a-sala': 4,
  'brecha-emocional': 5, 'antecipar-o-gesto': 6, 'coracao-aberto': 8,
  // árvore porte-inabalavel (idem)
  'semblante-fechado': 1, 'voz-calma': 2, 'mascara-sustentada': 4,
  'aguas-profundas': 5, 'inabalavel': 6, 'enigma-vivo': 8,
};

// Tocado (tier 1): raiz(d0)->1, ápice->3, demais galhos->2.
const APEX1 = new Set([
  'projecao', 'improvisar', 'irradiar-temor', 'seducao', 'inflamar', 'ler-o-rastro', 'mudar-de-cara',
  'cerrar-os-dentes', 'segundo-folego', 'ordem-curta', 'sentir-o-veu', 'segundo-vento', 'aparar', 'poliglota',
  'coordenar', 'plano', 'escalada-veloz', 'virar-a-mesa', 'conectar', 'ler-tells', 'inspirar', 'desarme-rapido',
  'empurrao-sutil', 'disfarce-rapido', 'mentira-de-olhos', 'deducao', 'foco', 'tocar-a-alma', 'visao-na-penumbra',
  'ver-atraves', 'olho-de-alcance', 'tensionar', 'instinto-de-sobrevivencia', 'mao-de-ferro', 'pancada-destrutiva',
  'reacao', 'brado-de-guerra', 'aclimatacao', 'imponencia', 'sentir-perigo', 'torcer', 'esgueirar',
  'semear-duvida', 'plantar-ideia', 'chamado', 'charme',
]);
// Grande herói (tier 3): ápices definidores -> banda 9.
const BAND9 = new Set(['carisma-heroico', 'grande-estrategista', 'titereiro', 'comando-irresistivel', 'regeneracao', 'borrao']);

// menor profundidade por tier original (ignorando os overrides, p/ não enviesar)
const minDepth = {};
for (const t of arr) {
  if (OVERRIDES[t.id] != null) continue;
  const d = depth(t);
  if (minDepth[t.banda] == null || d < minDepth[t.banda]) minDepth[t.banda] = d;
}

function novaBanda(t) {
  if (OVERRIDES[t.id] != null) return OVERRIDES[t.id];
  const tier = t.banda, d = depth(t);
  if (tier === 1) return d === 0 ? 1 : (APEX1.has(t.id) ? 3 : 2);
  const sub = Math.max(1, Math.min(3, d - minDepth[tier] + 1));
  let b = (tier - 1) * 3 + sub;
  if (tier === 3 && BAND9.has(t.id)) b = 9;
  return b;
}

const antes = Object.fromEntries(arr.map((t) => [t.id, t.banda]));
for (const t of arr) t.banda = novaBanda(t);

// validação: nenhuma Técnica pode ter banda < a de um pré-requisito
let inv = 0;
for (const t of arr) for (const p of (t.prereq || [])) {
  const pr = byId[p];
  if (pr && pr.banda > t.banda) { console.log(`INVERSÃO: ${t.id}(b${t.banda}) < prereq ${p}(b${pr.banda})`); inv++; }
}
const dist = {};
for (const t of arr) dist[t.banda] = (dist[t.banda] || 0) + 1;
console.log('Distribuição nova (banda 1-15):');
for (let b = 1; b <= 15; b++) console.log(`  banda ${String(b).padStart(2)} (Centelha ${Math.ceil(b / 3)}): ${dist[b] || 0}`);
console.log('Inversões de pré-requisito:', inv);

if (inv === 0) {
  fs.writeFileSync(P, JSON.stringify(arr, null, 2) + '\n');
  console.log('OK: tecnicas.json reescrito.');
} else {
  console.log('ABORTADO: corrigir inversões antes de gravar.');
}
