// Lê src/data/mercadorias.json e src/data/pacotes-equipamento.json (preços em cobre) e imprime:
//  - a tabela de mercadorias (markdown, com preço convertido)
//  - os totais de cada Pacote (em po/pp/pc)
// Uso: node scripts/precos.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ler = (f) => JSON.parse(readFileSync(join(root, 'src/data', f), 'utf8'));
const mercadorias = ler('mercadorias.json').itens;
const pacotes = Object.entries(ler('pacotes-equipamento.json').pacotes).map(([nome, p]) => ({ nome, ...p }));

const byId = Object.fromEntries(mercadorias.map((e) => [e.id, e]));

// Converte cobre → string legível na maior unidade exata (po/pp/pc), com frações de pc.
const FRAC = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
function fmt(pc) {
  if (pc === 0) return '0';
  if (pc < 1) return `${FRAC[pc] ?? pc} pc`;
  if (pc % 100 === 0) return `${pc / 100} po`;
  if (pc % 10 === 0) return `${pc / 10} pp`;
  const f = pc - Math.floor(pc);
  return `${f ? Math.floor(pc) + (FRAC[f] ?? '') : pc} pc`;
}

// Converte cobre → forma mista "X po Y pp Z pc" (omitindo zeros), para os totais.
function fmtMix(pc) {
  const po = Math.floor(pc / 100);
  const pp = Math.floor((pc % 100) / 10);
  const c = +(pc % 10).toFixed(2);
  const parts = [];
  if (po) parts.push(`${po} po`);
  if (pp) parts.push(`${pp} pp`);
  if (c) parts.push(`${c} pc`);
  return parts.join(' ') || '0 pc';
}

// --- Tabela de mercadorias ---
console.log('### Tabela de Mercadorias (markdown)\n');
console.log('| Item | Preço |');
console.log('|---|:---:|');
for (const e of mercadorias) console.log(`| ${e.nome} | ${fmt(e.preco.pc)} |`);

// --- Totais dos pacotes ---
console.log('\n### Totais dos Pacotes\n');
for (const p of pacotes) {
  let total = 0;
  const det = p.itens.map(([id, q]) => {
    const it = byId[id];
    if (!it) throw new Error(`Item desconhecido no pacote ${p.nome}: ${id}`);
    total += it.preco.pc * q;
    return `${q}× ${it.nome}`;
  });
  console.log(`- **${p.nome}** · ${fmtMix(total)}  (${total} pc)`);
  console.log(`    · ${det.join(', ')}`);
}
