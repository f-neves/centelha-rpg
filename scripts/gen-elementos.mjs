// gen-elementos.mjs — gera src/data/elementos-bestiario.json: `fraquezas` e
// `resistencias` por criatura, como listas de palavras-chave.
//
// Sétimo satélite do bestiário, no mesmo molde de habilidades / dimensoes / lore /
// imagens / ecologia: `inimigos.json` é GERADO e não pode guardar isto, então mora
// aqui e o gen-monsters.mjs junta por id.
//
// A regra está em Arcano_revisao.md §9 e nas pendências 4 e 4c:
//   RESISTÊNCIA corta o dano daquele tipo pela metade (arredondando para cima) e
//   nunca deixa ele agravado. A ordem é armadura, resistência, Absorção natural.
//   FRAQUEZA passa por cima de TUDO: não é absorvida por nada, nem armadura nem
//   Absorção natural, e o dano é agravado (não fecha com descanso nem com Cura).
// Fraqueza e resistência ao mesmo tipo se anulam.
//
// Três camadas, da mais geral para a mais específica, cada uma sobrescrevendo a
// anterior: CATEGORIA → MATERIAL → EXCEÇÃO. As três moram NESTE arquivo, e o JSON
// de saída é descartável: rodar o script o reescreve inteiro.
//
// Ordem, quando as fontes do bestiário mudarem:
//   node scripts/gen-monsters.mjs   (para o categoria/tags ficarem em dia)
//   node scripts/gen-elementos.mjs  (semeia daqui)
//   node scripts/gen-monsters.mjs   (embute o satélite no monsters.json)
//
// uso: node scripts/gen-elementos.mjs
import fs from 'node:fs';
import path from 'node:path';
import { POR_MATERIAL } from './lib-materiais.mjs';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const p = (f) => path.join(ROOT, 'src/data', f);
const TODAS = JSON.parse(fs.readFileSync(p('monsters.json'), 'utf8'));
// Criatura sua se descreve sozinha, no próprio objeto do inimigos-custom.json
// (por `material` ou por `fraquezas`/`resistencias`). Este satélite é só do livro.
const CUSTOM_IDS = new Set((() => {
  const f = p('inimigos-custom.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).filter((c) => c && c.id).map((c) => c.id) : [];
})());
const M = TODAS.filter((m) => !CUSTOM_IDS.has(m.id));

// Vocabulário fechado. Mistura três eixos de propósito, porque as três coisas
// machucam: elemento das Artes, tipo de dano físico, e natureza ou material.
const VOCAB = new Set([
  'fogo', 'agua', 'gelo', 'raio', 'vento', 'terra', 'luz', 'sombra',
  'corte', 'perfuracao', 'impacto',
  'sagrado', 'profano', 'prata', 'sol',
]);

// --- camada 1: a regra, por categoria -------------------------------------
// "Não é coisa comum: a maioria das criaturas não tem nenhuma." Só estas famílias
// recebem por regra; Animal, Humanoide, Fera e companhia saem vazias.
//
// Morto-vivo, Planta, Limo e Construto poderiam sair só do material, e saem para
// quem tem material declarado. A categoria fica como rede para o resto.
const POR_CATEGORIA = {
  'Morto-vivo': { fraquezas: ['luz', 'sagrado'], resistencias: ['perfuracao'] },
  'Corruptor': { fraquezas: ['luz', 'sagrado'] },
  'Celestial': { fraquezas: ['profano'] },
  'Planta': { fraquezas: ['fogo'], resistencias: ['perfuracao'] },
  'Limo': { resistencias: ['perfuracao', 'corte'] },
  'Construto': { resistencias: ['perfuracao'] },
};

// Corpo sem carne: a arma comum atravessa e não encontra o que rasgar.
const POR_TAG = {
  'incorpóreo': { resistencias: ['corte', 'perfuracao', 'impacto'] },
};

// --- camada 2: o material de que a criatura é feita ------------------------
// A tabela mora em ./lib-materiais.mjs, porque o gen-monsters.mjs também precisa
// dela para resolver o `material` de uma criatura sua sem uma segunda passada.

// De que a criatura é feita. Só quem não é de carne precisa aparecer aqui.
const MATERIAL_DE = {
  'mon-stone-golem': 'pedra', 'mon-gargula': 'pedra', 'mon-clay-golem': 'pedra',
  'mon-iron-golem': 'metal', 'mon-iron-cobra': 'metal', 'mon-retriever': 'metal',
  'mon-treant': 'madeira',
  'mon-ice-golem': 'gelo',
  'mon-flesh-golem': 'carne animada', 'mon-homunculus': 'carne animada',
  'mon-small-fire-elemental': 'fogo', 'mon-salamandra': 'fogo', 'mon-efreeti': 'fogo',
  'mon-small-water-elemental': 'agua', 'mon-marid': 'agua',
  'mon-small-earth-elemental': 'terra', 'mon-elemental-da-terra-grande': 'terra',
  'mon-shaitan': 'terra', 'mon-xorn': 'terra',
  'mon-small-air-elemental': 'ar', 'mon-djinn': 'ar', 'mon-invisible-stalker': 'ar',
};

// --- camada 3: as exceções, à mão -----------------------------------------
// Só o que não sai nem da categoria nem do material: natureza sobrenatural e o
// sopro do dragão. Cada linha tem um porquê.
const EXCECOES = {
  'mon-vampiro': { fraquezas: ['luz', 'sagrado', 'sol', 'prata', 'fogo'], resistencias: ['perfuracao'] },
  'mon-werewolf': { fraquezas: ['prata'] },
  // Bandagem e pele secas: a múmia queima como estopa
  'mon-mumia': { fraquezas: ['luz', 'sagrado', 'fogo'], resistencias: ['perfuracao'] },
  // Osso solto: a ponta e o fio passam entre as costelas, a maça não
  'mon-esqueleto-humano': { fraquezas: ['luz', 'sagrado'], resistencias: ['perfuracao', 'corte'] },
  'mon-skeletal-champion': { fraquezas: ['luz', 'sagrado'], resistencias: ['perfuracao', 'corte'] },

  // Dragões: o bicho resiste ao que ele mesmo cospe
  'mon-dragao-vermelho-adulto': { resistencias: ['fogo'] },
  'mon-dragao-vermelho-anciao': { resistencias: ['fogo'] },
  'mon-dragao-vermelho-jovem': { resistencias: ['fogo'] },
  'mon-filhote-de-dragao-vermelho': { resistencias: ['fogo'] },
  'mon-grande-wyrm-vermelho': { resistencias: ['fogo'] },
  'mon-dragao-dourado-adulto': { resistencias: ['fogo'] },
  'mon-dragao-azul-adulto': { resistencias: ['raio'] },
  'mon-dragao-branco-jovem': { fraquezas: ['fogo'], resistencias: ['gelo'] },
  'mon-ice-linnorm': { fraquezas: ['fogo'], resistencias: ['gelo'] },
};

// --- montagem --------------------------------------------------------------
const uniq = (a) => [...new Set(a)];
const saida = {};
let porRegra = 0, porMaterial = 0, porExcecao = 0;

for (const m of M) {
  let f = [], r = [];
  const cat = POR_CATEGORIA[m.categoria];
  if (cat) { f = [...(cat.fraquezas || [])]; r = [...(cat.resistencias || [])]; }
  for (const t of m.tags || []) {
    const tg = POR_TAG[t];
    if (tg) { f.push(...(tg.fraquezas || [])); r.push(...(tg.resistencias || [])); }
  }
  const veioDaRegra = f.length || r.length;

  // O material MANDA sobre a categoria: saber do que a criatura é feita é mais
  // específico do que saber a família dela.
  const mat = MATERIAL_DE[m.id];
  if (mat) {
    const pm = POR_MATERIAL[mat];
    if (!pm) throw new Error(`material desconhecido em ${m.id}: ${mat}`);
    f = [...(pm.fraquezas || [])]; r = [...(pm.resistencias || [])];
  }

  const ex = EXCECOES[m.id];
  if (ex) { f = [...(ex.fraquezas || [])]; r = [...(ex.resistencias || [])]; porExcecao++; }
  else if (mat) porMaterial++;
  else if (veioDaRegra) porRegra++;

  f = uniq(f); r = uniq(r);
  // "Resistência e fraqueza se anulam quando a mesma criatura tem as duas."
  const choque = f.filter((x) => r.includes(x));
  if (choque.length) { f = f.filter((x) => !choque.includes(x)); r = r.filter((x) => !choque.includes(x)); }

  for (const k of [...f, ...r]) if (!VOCAB.has(k)) throw new Error(`palavra fora do vocabulário em ${m.id}: ${k}`);
  if (f.length || r.length) {
    saida[m.id] = {};
    if (f.length) saida[m.id].fraquezas = f.sort();
    if (r.length) saida[m.id].resistencias = r.sort();
  }
}

const idsBons = new Set(M.map((m) => m.id));
for (const [rotulo, tabela] of [['exceção', EXCECOES], ['material', MATERIAL_DE]]) {
  const orfaos = Object.keys(tabela).filter((id) => !idsBons.has(id));
  if (orfaos.length) throw new Error(`${rotulo} para id inexistente: ${orfaos.join(', ')}`);
}

const out = p('elementos-bestiario.json');
fs.writeFileSync(out, JSON.stringify(saida, null, 1) + '\n');
const n = Object.keys(saida).length;
console.log(`elementos-bestiario.json: ${n} de ${M.length} criaturas com fraqueza ou resistência (${(100 * n / M.length).toFixed(0)}%).`);
console.log(`  ${porRegra} por categoria ou tag · ${porMaterial} pelo material · ${porExcecao} por exceção à mão.`);
