// Regera a tabela de "Catálogo de Equipamento" do capítulo `custo-de-servico-e-itens.md`
// a partir de armas.json / armaduras.json / escudos.json / municao.json.
//
// POR QUE. A tabela era escrita à mão, com nomes genéricos por tamanho/material (Espada
// Média, Machado G, Madeira P...) que não existem no catálogo jogável e preços que não
// batiam com ele (leitura-de-novato-decisoes.md §5, `CORRIGE 1`/`8`/`9`/`11`). O JSON
// (armas.json etc.) é a fonte da verdade desde a migração pro envelope aninhado: o
// capítulo só reflete, não decide.
//
// O script reescreve só o miolo entre os marcadores
//   <!-- gen:catalogo-equipamento --> … <!-- /gen:catalogo-equipamento -->
// em custo-de-servico-e-itens.md, e não toca em mais nada da página. Item sem `preco`
// decidido (ver §3/§12: adiado pro balanceamento final) some da tabela em vez de
// mostrar "a definir" — a fonte não tem número, a tabela gerada não inventa um.
//
// Rodar depois de mexer em armas.json / armaduras.json / escudos.json / municao.json:
//   node scripts/gen-cap-itens.mjs
import fs from 'node:fs';
import path from 'node:path';
import { achataCatalogo } from './lib-equip.mjs';

const raiz = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (p) => JSON.parse(fs.readFileSync(path.join(raiz, 'src/data', p), 'utf8'));
const CAP = path.join(raiz, 'src/content/chapters/custo-de-servico-e-itens.md');

const ARMAS = achataCatalogo(ler('armas.json'));
const ARMADURAS = achataCatalogo(ler('armaduras.json'));
const ESCUDOS = achataCatalogo(ler('escudos.json'));
const MUNICAO = achataCatalogo(ler('municao.json'));

// cobre → string legível na maior moeda exata (po/pp/pc). Mesma conta de scripts/precos.mjs.
function fmt(pc) {
  if (pc == null) return null;
  if (pc === 0) return '0';
  if (pc % 100 === 0) return `${pc / 100} po`;
  if (pc % 10 === 0) return `${pc / 10} pp`;
  return `${pc} pc`;
}

const CLASSE_ARMA = { leve: 'leve', media: 'media', pesada: 'pesada', haste: 'haste', distancia: 'distancia', arremesso: 'arremesso' };
const ORDEM_CLASSE_ARMA = ['leve', 'media', 'pesada', 'haste', 'distancia', 'arremesso'];
const CLASSE_ARMADURA_LBL = { nenhuma: 'Nenhuma', leve: 'Leve', media: 'Média', pesada: 'Pesada' };
const ORDEM_CLASSE_ARMADURA = ['nenhuma', 'leve', 'media', 'pesada'];

const alfa = (a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' });

const armasComPreco = ARMAS.filter((w) => w.preco?.pc != null)
  .sort((a, b) => (ORDEM_CLASSE_ARMA.indexOf(a.classe) - ORDEM_CLASSE_ARMA.indexOf(b.classe)) || alfa(a, b));
const municaoComPreco = MUNICAO.filter((m) => m.preco?.pc != null).sort(alfa);
const armadurasComPreco = ARMADURAS.filter((a) => a.preco?.pc != null)
  .sort((a, b) => (ORDEM_CLASSE_ARMADURA.indexOf(a.classe) - ORDEM_CLASSE_ARMADURA.indexOf(b.classe)) || alfa(a, b));
const escudosComPreco = ESCUDOS.filter((s) => s.preco?.pc != null).sort(alfa);

const tabelaArmas = [
  '| Arma | Preço |',
  '|---|:---:|',
  ...armasComPreco.map((w) => `| ${w.nome} | ${fmt(w.preco.pc)} |`),
  ...municaoComPreco.map((m) => `| ${m.nome} | ${fmt(m.preco.pc)} |`),
].join('\n');

const tabelaArmaduras = [
  '| Armadura | Classe | Preço |',
  '|---|:---:|:---:|',
  ...armadurasComPreco.map((a) => `| ${a.nome} | ${CLASSE_ARMADURA_LBL[a.classe] ?? a.classe} | ${fmt(a.preco.pc)} |`),
].join('\n');

const tabelaEscudos = [
  '| Escudo | Preço |',
  '|---|:---:|',
  ...escudosComPreco.map((s) => `| ${s.nome} | ${fmt(s.preco.pc)} |`),
].join('\n');

const corpo = `<div class="cat-grid">

<div>

<p class="cat-cap">Armas</p>

<div class="table-wrap">

${tabelaArmas}

</div>

</div>

<div>

<p class="cat-cap">Armaduras</p>

<div class="table-wrap">

${tabelaArmaduras}

</div>

<p class="cat-cap">Escudos</p>

<div class="table-wrap">

${tabelaEscudos}

</div>

</div>

</div>`;

const marca = 'catalogo-equipamento';
const montar = () => {
  const md = fs.readFileSync(CAP, 'utf8');
  const re = new RegExp(`(<!-- gen:${marca} -->)[\\s\\S]*?(<!-- /gen:${marca} -->)`);
  if (!re.test(md)) throw new Error(`marcador gen:${marca} não encontrado em ${CAP}`);
  return md.replace(re, `$1\n\n${corpo}\n\n$2`);
};

const N = armasComPreco.length + municaoComPreco.length + armadurasComPreco.length + escudosComPreco.length;

if (process.argv.includes('--check')) {
  const atual = fs.readFileSync(CAP, 'utf8');
  const esperado = montar();
  if (atual !== esperado) {
    console.error(`✘ ${path.relative(raiz, CAP)} está fora de sincronia com a fonte (marcador gen:${marca}).\n`
      + '  Rode: node scripts/gen-cap-itens.mjs');
    process.exit(1);
  }
  console.log(`✓ catálogo de equipamento em dia com a fonte (${N} itens com preço)`);
  process.exit(0);
}

fs.writeFileSync(CAP, montar());
console.log(`catálogo de equipamento regerado: ${N} itens com preço (${armasComPreco.length} armas, ${municaoComPreco.length} munição, ${armadurasComPreco.length} armaduras, ${escudosComPreco.length} escudos)`);
