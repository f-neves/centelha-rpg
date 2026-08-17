// Regera o catálogo do capítulo de Antecedentes a partir de src/data/antecedentes.json.
//
// Mesma razão do gen-cap-pericias: são 14 verbetes com 6 níveis cada, 84 linhas de tabela,
// e manter isso copiado entre o .md e o .json é drift garantido. O script reescreve só o
// miolo entre os marcadores
//   <!-- gen:antecedentes --> … <!-- /gen:antecedentes -->
// em src/content/chapters/antecedentes.md, e não toca em mais nada da página.
//
//   node scripts/gen-cap-antecedentes.mjs           # regera
//   node scripts/gen-cap-antecedentes.mjs --check   # falha se estiver fora de dia
import fs from 'node:fs';
import path from 'node:path';

const raiz = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ANT = JSON.parse(fs.readFileSync(path.join(raiz, 'src/data/antecedentes.json'), 'utf8'));
const CAP = path.join(raiz, 'src/content/chapters/antecedentes.md');

const rotuloFormato = (a) => {
  if (a.notaFormato) return a.notaFormato;
  return a.formato === 'unico' ? 'Único' : 'Nomeado';
};

// O callout é HTML puro, e markdown dentro de bloco HTML não é processado: o **negrito**
// sairia com os asteriscos na tela. Então o exemplo vai convertido na mão.
const emHtml = (s) => s
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*([^*]+?)\*/g, '$1<em>$2</em>');

const bloco = ANT.slice().sort((a, b) => a.ordem - b.ordem).map((a) => {
  const linhas = [];
  linhas.push(`### ${a.nome}`);
  linhas.push('');
  linhas.push(`*${rotuloFormato(a)}.* ${a.descricao}`);
  linhas.push('');
  linhas.push('| Nível | O que significa |');
  linhas.push('|:---:|---|');
  for (const n of a.niveis) {
    const txt = n.rotulo ? `**${n.rotulo}.** ${n.texto}` : n.texto;
    linhas.push(`| **${n.nivel}** | ${txt} |`);
  }
  if (a.exemplo) {
    linhas.push('');
    linhas.push(`<div class="callout exemplo"><span class="lbl">Exemplo</span>${emHtml(a.exemplo)}</div>`);
  }
  if (a.amarra) {
    linhas.push('');
    linhas.push(`**Amarra com:** ${a.amarra}`);
  }
  return linhas.join('\n');
}).join('\n\n');

const ABRE = '<!-- gen:antecedentes -->';
const FECHA = '<!-- /gen:antecedentes -->';
const atual = fs.readFileSync(CAP, 'utf8');
const i = atual.indexOf(ABRE), f = atual.indexOf(FECHA);
if (i < 0 || f < 0) {
  console.error(`✘ marcadores ${ABRE} … ${FECHA} não achados em antecedentes.md`);
  process.exit(1);
}
const novo = atual.slice(0, i + ABRE.length) + '\n\n' + bloco + '\n\n' + atual.slice(f);

if (process.argv.includes('--check')) {
  if (novo !== atual) {
    console.error('✘ o catálogo do capítulo de Antecedentes está fora de dia com antecedentes.json.\n'
      + '  Rode: node scripts/gen-cap-antecedentes.mjs');
    process.exit(1);
  }
  console.log(`✓ catálogo de Antecedentes em dia (${ANT.length} verbetes)`);
  process.exit(0);
}

fs.writeFileSync(CAP, novo);
const niveis = ANT.reduce((s, a) => s + a.niveis.length, 0);
const unicos = ANT.filter((a) => a.formato === 'unico').length;
console.log(`antecedentes.md: ${ANT.length} verbetes (${unicos} Únicos, ${ANT.length - unicos} Nomeados), ${niveis} níveis.`);
