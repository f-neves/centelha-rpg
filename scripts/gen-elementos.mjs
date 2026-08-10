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
// Duas camadas, e é de propósito: a REGRA cobre o grosso e é reprodutível, as
// EXCECOES são escritas à mão e vencem a regra. As duas moram NESTE arquivo:
// o JSON de saída é descartável e não deve ser editado à mão, porque rodar o
// script de novo o reescreve inteiro. Exceção nova entra na tabela EXCECOES.
//
// Ordem, quando as fontes do bestiário mudarem:
//   node scripts/gen-monsters.mjs   (para o categoria/tags ficarem em dia)
//   node scripts/gen-elementos.mjs  (semeia daqui)
//   node scripts/gen-monsters.mjs   (embute o satélite no monsters.json)
//
// uso: node scripts/gen-elementos.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const p = (f) => path.join(ROOT, 'src/data', f);
const M = JSON.parse(fs.readFileSync(p('monsters.json'), 'utf8'));

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

// --- camada 2: as exceções, à mão -----------------------------------------
// Cada linha tem um porquê. Onde o material manda, vale a régua da §9: folha,
// madeira, palha e gelo têm fraqueza a fogo; fogo e terra têm fraqueza a água;
// água, terra, metal e pedra resistem a fogo.
const EXCECOES = {
  // Natureza sobrenatural, os casos nomeados no doc
  'mon-vampiro': { fraquezas: ['luz', 'sagrado', 'sol', 'prata', 'fogo'], resistencias: ['perfuracao'] },
  'mon-werewolf': { fraquezas: ['prata'] },
  'mon-mumia': { fraquezas: ['luz', 'sagrado', 'fogo'], resistencias: ['perfuracao'] },
  // Osso solto: a ponta e o fio passam entre as costelas, a maça não
  'mon-esqueleto-humano': { fraquezas: ['luz', 'sagrado'], resistencias: ['perfuracao', 'corte'] },
  'mon-skeletal-champion': { fraquezas: ['luz', 'sagrado'], resistencias: ['perfuracao', 'corte'] },

  // Elementais, pelo elemento
  'mon-small-fire-elemental': { fraquezas: ['agua'], resistencias: ['fogo'] },
  'mon-salamandra': { fraquezas: ['agua'], resistencias: ['fogo'] },
  'mon-efreeti': { fraquezas: ['agua'], resistencias: ['fogo'] },
  // Água conduz: o raio atravessa o corpo inteiro em vez de tocar a superfície
  'mon-small-water-elemental': { fraquezas: ['raio'], resistencias: ['fogo'] },
  'mon-marid': { fraquezas: ['raio'], resistencias: ['fogo'] },
  'mon-small-earth-elemental': { fraquezas: ['agua'], resistencias: ['fogo'] },
  'mon-elemental-da-terra-grande': { fraquezas: ['agua'], resistencias: ['fogo'] },
  'mon-shaitan': { fraquezas: ['agua'], resistencias: ['fogo'] },
  'mon-xorn': { fraquezas: ['agua'], resistencias: ['fogo'] },
  // Ar não tem nada: não há material que o fogo queime nem que a água apague

  // Construtos, pelo material. Metal conduz o raio pela mesma razão que a água.
  'mon-iron-golem': { fraquezas: ['raio'], resistencias: ['fogo', 'perfuracao'] },
  'mon-iron-cobra': { fraquezas: ['raio'], resistencias: ['fogo', 'perfuracao'] },
  'mon-retriever': { fraquezas: ['raio'], resistencias: ['fogo', 'perfuracao'] },
  'mon-stone-golem': { resistencias: ['fogo', 'perfuracao'] },
  'mon-clay-golem': { resistencias: ['fogo', 'perfuracao'] },
  'mon-ice-golem': { fraquezas: ['fogo'], resistencias: ['gelo', 'perfuracao'] },

  // Pedra viva, mesmo não sendo Construto na ficha
  'mon-gargula': { resistencias: ['fogo', 'perfuracao'] },

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
let porRegra = 0, porExcecao = 0;

for (const m of M) {
  let f = [], r = [];
  const cat = POR_CATEGORIA[m.categoria];
  if (cat) { f = [...(cat.fraquezas || [])]; r = [...(cat.resistencias || [])]; }
  for (const t of m.tags || []) {
    const tg = POR_TAG[t];
    if (tg) { f.push(...(tg.fraquezas || [])); r.push(...(tg.resistencias || [])); }
  }
  const veioDaRegra = f.length || r.length;

  const ex = EXCECOES[m.id];
  if (ex) { f = [...(ex.fraquezas || [])]; r = [...(ex.resistencias || [])]; porExcecao++; }
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
const orfaos = Object.keys(EXCECOES).filter((id) => !idsBons.has(id));
if (orfaos.length) throw new Error(`exceção para id inexistente: ${orfaos.join(', ')}`);

const out = p('elementos-bestiario.json');
fs.writeFileSync(out, JSON.stringify(saida, null, 1) + '\n');
const n = Object.keys(saida).length;
console.log(`elementos-bestiario.json: ${n} de ${M.length} criaturas com fraqueza ou resistência (${(100 * n / M.length).toFixed(0)}%).`);
console.log(`  ${porRegra} por regra de categoria ou tag · ${porExcecao} por exceção escrita à mão.`);
