// Leva a arte das folhas para dentro do site.
//
// Copia os atlas para src/assets/equipamento/ e escreve src/styles/arte-equip.css,
// onde cada peça vira uma classe `.arte-<id>` que recorta o seu quadro do atlas.
//
// Os atlas vão para src/assets/ e NÃO para public/ de propósito: o site é servido
// sob /centelha-rpg/, e um `url('/equipamento/x.webp')` escrito à mão no CSS não
// recebe esse prefixo — a imagem dá 404 em produção. Em src/assets/, referenciada
// por caminho relativo, quem resolve a URL é o Vite, que aplica a base sozinho.
//
// O recorte é todo em porcentagem, e não em pixels, porque o quadro da arte na
// ficha tem largura fluida (o card estica). Em porcentagem o mesmo CSS serve a
// um card de 240px e a um de 400px sem recortar a peça vizinha.
//
// O tamanho é resolvido por `width: min(100%, <largura da célula>)` com
// `aspect-ratio`: quando o card é largo, a peça enche a altura do quadro; quando
// é estreito, encolhe inteira em vez de esticar ou ser cortada. É o `contain`
// que o background sozinho não sabe fazer.
//
//   node scripts/gen-arte-equip.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plano = JSON.parse(readFileSync(resolve(raiz, 'scripts/folhas-ia.json'), 'utf8'));
const FOLHAS = resolve(raiz, 'D&D/armas&armaduras/folhas');
const DESTINO_IMG = resolve(raiz, 'src/assets/equipamento');
const DESTINO_CSS = resolve(raiz, 'src/styles/arte-equip.css');

// FALHA ALTA, como o irmão `gen-creditos-equip.mjs`: sem a pasta fonte (fora do
// git, `.gitignore:25`) não há o que gerar, e um clone limpo não pode escrever
// por cima do CSS commitado com um arquivo quase vazio. L50.
if (!existsSync(FOLHAS)) {
  console.error(`Sem D&D/armas&armaduras/folhas/. Rode antes: node scripts/retificar_folha.py`
    + ` (ou baixe/gere as folhas retificadas).`);
  process.exit(1);
}

// A MESMA FALHA ALTA VALE PARA UMA FOLHA SÓ FALTANDO, não só para todas: um
// arte-equip.css com menos classes do que o plano descreve é pior do que não
// escrever nada, porque a queda parcial passa despercebida do mesmo jeito que a
// queda total, sem nem o consolo de o build quebrar visível. Por isso a
// conferência é um passo À PARTE, ANTES de copiar ou escrever qualquer coisa.
const faltandoAntes = [];
for (const folha of plano.folhas) {
  const mapaArq = resolve(FOLHAS, folha.id, `${folha.id}.json`);
  const webp = resolve(FOLHAS, folha.id, `${folha.id}.webp`);
  if (!existsSync(mapaArq) || !existsSync(webp)) faltandoAntes.push(folha.id);
}
if (faltandoAntes.length) {
  console.error(`Sem folha retificada (rode retificar_folha.py): ${faltandoAntes.join(', ')}`);
  console.error(`${faltandoAntes.length} de ${plano.folhas.length} folhas do plano faltando — `
    + 'nada foi escrito nem copiado.');
  process.exit(1);
}

// altura, em px, do quadro da arte em cada lugar da ficha. Vem do FichaSkeleton:
// .eq-img.arma/.escudo/.armadura = 20rem (um quadro só para todas as peças), e o
// espelho pequeno do conjunto de mãos (.conj-peca .eq-img) = 5.5rem.
const ALTURA_PEQUENA = 88;

const pct = (n) => `${+n.toFixed(4)}%`;
const posicao = (i, total) => (total > 1 ? pct((i / (total - 1)) * 100) : '0%');

mkdirSync(DESTINO_IMG, { recursive: true });
mkdirSync(dirname(DESTINO_CSS), { recursive: true });

const css = [];
css.push('/* Arte de armas, armaduras e escudos. GERADO por scripts/gen-arte-equip.mjs');
css.push('   a partir de scripts/folhas-ia.json e das folhas retificadas. Não editar:');
css.push('   mexer no plano, rodar o retificador e gerar de novo. */');
css.push('');
css.push('/* O quadro se vira sozinho com a largura que o card der. */');
css.push('.eq-arte { display: block; width: min(100%, var(--arte-w));');
css.push('  aspect-ratio: var(--arte-ar); background-repeat: no-repeat; }');
css.push('');

const porClasse = new Map();
let nPecas = 0;

// A conferência já rodou (acima, antes de qualquer escrita): chegar aqui
// significa que toda folha do plano tem mapa e atlas. Nenhum `if` de
// "faltando" sobra neste laço de propósito — é o mesmo laço de antes, sem o
// desvio que permitia a queda silenciosa.
for (const folha of plano.folhas) {
  const mapaArq = resolve(FOLHAS, folha.id, `${folha.id}.json`);
  const webp = resolve(FOLHAS, folha.id, `${folha.id}.webp`);
  copyFileSync(webp, resolve(DESTINO_IMG, `${folha.id}.webp`));
  const mapa = JSON.parse(readFileSync(mapaArq, 'utf8'));
  const [cw, ch] = mapa.celula;
  const { colunas: cols, linhas: lins } = mapa;

  // as folhas que dividem a mesma classe têm de ter a mesma célula, senão uma
  // sobrescreveria a régua da outra e a peça sairia esticada
  const anterior = porClasse.get(folha.classe);
  if (anterior && (anterior.cw !== cw || anterior.ch !== ch)) {
    throw new Error(`As folhas da classe "${folha.classe}" têm células diferentes `
      + `(${anterior.folha}: ${anterior.cw}×${anterior.ch}, ${folha.id}: ${cw}×${ch}). `
      + 'Uma classe, uma célula.');
  }
  porClasse.set(folha.classe, { cw, ch, folha: folha.id, altura: folha.altura_tela });

  css.push(`/* ${folha.titulo}: ${mapa.pecas.length} peças, grade ${cols}×${lins}, `
    + `célula ${cw}×${ch}px */`);
  for (const p of mapa.pecas) {
    css.push(`.arte-${p.id} { background-image: url('../assets/equipamento/${folha.id}.webp');`
      + ` background-size: ${pct(cols * 100)} ${pct(lins * 100)};`
      + ` background-position: ${posicao(p.coluna, cols)} ${posicao(p.linha, lins)}; }`);
    nPecas++;
  }
  css.push('');
}

// A régua de cada lugar: a largura máxima é a que faz a peça encher a altura do
// quadro sem passar dela.
const reguas = [];
reguas.push('/* Quanto a peça pode ocupar em cada lugar da ficha. */');
for (const [classe, v] of porClasse) {
  const larg = Math.round(v.altura * (v.cw / v.ch));
  reguas.push(`.eq-img.${classe} { --arte-ar: ${v.cw} / ${v.ch}; --arte-w: ${larg}px; }`);
}
reguas.push('/* espelho pequeno do conjunto de mãos */');
for (const [classe, v] of porClasse) {
  if (classe === 'armadura') continue;   // armadura não aparece no conjunto de mãos
  const larg = Math.round(ALTURA_PEQUENA * (v.cw / v.ch));
  reguas.push(`.conj-peca .eq-img.${classe} { --arte-w: ${larg}px; }`);
}
reguas.push('');

// as réguas entram logo depois da regra base, antes das peças
css.splice(8, 0, ...reguas);

writeFileSync(DESTINO_CSS, css.join('\n'), 'utf8');

console.log(`arte-equip.css: ${nPecas} peças de ${porClasse.size} classes.`);
console.log(`atlas copiados para src/assets/equipamento/: ${plano.folhas.length} de ${plano.folhas.length}.`);
