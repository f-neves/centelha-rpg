// Gera D&D/armas&armaduras/prompts-ia.md a partir de scripts/folhas-ia.json.
//
// Um prompt por folha, em inglês (é onde os geradores erram menos), com o estilo,
// o fundo chapado e a grade. O que o prompt precisa arrancar do gerador não é a
// célula perfeita, e sim uma folha COM AS PEÇAS SEPARADAS: quem acerta o pixel
// depois é scripts/retificar_folha.py. Por isso as instruções de separação e de
// fundo liso são as mais insistentes do texto.
//
//   node scripts/gen-prompts-folhas.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plano = JSON.parse(readFileSync(resolve(raiz, 'scripts/folhas-ia.json'), 'utf8'));
const PASTA = resolve(raiz, 'D&D/armas&armaduras');

const ordinal = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth',
  'tenth', 'eleventh', 'twelfth'];

const out = [];
out.push('# Prompts para gerar a arte por IA');
out.push('');
out.push('Gerado por `scripts/gen-prompts-folhas.mjs` a partir de `scripts/folhas-ia.json`.');
out.push('Não editar à mão: mexer no plano e rodar de novo.');
out.push('');
out.push('## Como usar');
out.push('');
out.push('1. Cole o prompt de uma folha no gerador de imagem, **na resolução mais alta**');
out.push('   que ele oferecer, respeitando a proporção pedida.');
out.push('2. Confira só duas coisas na imagem que voltar: as peças estão **separadas**');
out.push('   (nenhuma encostando na outra) e o fundo é **magenta chapado**. Escala torta,');
out.push('   peça descentralizada e grade desalinhada não são problema.');
out.push('3. Passe a folha pelo retificador, que corta cada peça, tira o fundo, normaliza');
out.push('   e monta o atlas com a célula no pixel exato:');
out.push('');
out.push('   ```');
out.push('   python scripts/retificar_folha.py <folha> caminho/da/imagem-gerada.png');
out.push('   ```');
out.push('');
out.push('Se ele reclamar que achou um número de peças diferente do esperado, é sinal de');
out.push('que duas se encostaram ou uma sumiu: gere a folha de novo, é mais barato que');
out.push('remendar.');
out.push('');
out.push('## Por que o fundo é magenta');
out.push('');
out.push('Gerador de imagem quase nunca entrega PNG com transparência. Magenta puro');
out.push('(`#FF00FF`) não aparece em gravura sépia nenhuma, então o recorte por cor sai');
out.push('sem ambiguidade. Fundo branco seria confundido com o papel da própria gravura.');
out.push('');

const totalPecas = plano.folhas.reduce((s, f) => s + f.pecas.length, 0);
out.push(`## As ${plano.folhas.length} folhas (${totalPecas} peças)`);
out.push('');
out.push('| Folha | Peças | Grade | Célula final | Atlas | Proporção a pedir |');
out.push('| --- | --- | --- | --- | --- | --- |');
for (const f of plano.folhas) {
  const [cw, ch] = f.celula;
  out.push(`| **${f.titulo}** (\`${f.id}\`) | ${f.pecas.length} | ${f.colunas}×${f.linhas} `
    + `| ${cw}×${ch}px | ${cw * f.colunas}×${ch * f.linhas}px | ${f.proporcao} |`);
}
out.push('');
out.push('A célula sai no dobro do tamanho de tela: a ficha mostra arma e escudo num quadro');
out.push('de 20rem (320px) e armadura num de 30rem (480px), e o dobro cobre tela retina.');
out.push('');

for (const f of plano.folhas) {
  const [cw, ch] = f.celula;
  const cels = f.colunas * f.linhas;
  const vazias = cels - f.pecas.length;

  out.push('---');
  out.push('');
  out.push(`## Folha \`${f.id}\` · ${f.titulo}`);
  out.push('');
  out.push(`${f.pecas.length} peças · grade ${f.colunas}×${f.linhas} · proporção ${f.proporcao}`
    + (vazias ? ` · ${vazias} célula${vazias > 1 ? 's' : ''} vazia${vazias > 1 ? 's' : ''} no fim` : ''));
  out.push('');
  out.push('```text');
  out.push(`A sheet of ${f.pecas.length} separate objects arranged in a strict grid of `
    + `${f.colunas} columns and ${f.linhas} rows, reading left to right, top to bottom.`);
  out.push('');
  out.push(`STYLE: ${plano.estilo.prompt}.`);
  out.push('');
  out.push(`BACKGROUND: ${plano.fundo.prompt}.`);
  out.push('');
  out.push('LAYOUT RULES, these matter more than beauty:');
  out.push(`- Exactly ${f.pecas.length} objects, one per cell, nothing else in the image.`);
  out.push('- Wide empty magenta margin around every object. No object may touch, overlap or');
  out.push('  cross into another object or into the edge of the image.');
  out.push('- Each object drawn whole and uncropped, filling most of the height of its own cell.');
  out.push(`- ${f.orientacao}`);
  out.push('- Objects are drawn on their own: no hands holding them, no stands, no racks, no');
  out.push('  ground line, no cast shadow, no scale bar.');
  if (vazias) {
    out.push(`- The last ${vazias} cell${vazias > 1 ? 's' : ''} of the grid `
      + `${vazias > 1 ? 'stay' : 'stays'} empty: plain magenta, nothing drawn there.`);
  }
  out.push('');
  out.push('THE OBJECTS, in reading order:');
  f.pecas.forEach((p, i) => {
    out.push(`${i + 1}. (${ordinal[i]} cell) ${p.desc}.`);
  });
  out.push('');
  out.push(`AVOID: ${plano.estilo.negativo}.`);
  out.push('```');
  out.push('');
  out.push('Peças desta folha, na ordem de leitura:');
  out.push('');
  out.push(f.pecas.map((p, i) => `${i + 1}. **${p.nome}** → \`${p.id}.png\``).join('  \n'));
  out.push('');
}

mkdirSync(PASTA, { recursive: true });
writeFileSync(resolve(PASTA, 'prompts-ia.md'), out.join('\n'), 'utf8');
console.log(`prompts-ia.md gerado: ${plano.folhas.length} folhas, ${totalPecas} peças.`);
