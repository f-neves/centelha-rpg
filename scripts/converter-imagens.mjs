// As artes do bestiário em WebP.
//
// POR QUE
// `public/bestiario/` tinha 15,1 MB em 284 JPG e 24 PNG, e era metade do peso do
// site publicado. Os 24 PNG sozinhos eram 5,5 MB: arte de 600 px guardada sem
// perda, com transparência, pesando 230 KB cada. Em WebP a pasta inteira cai
// para 7,3 MB, e a prova de olho (original ao lado do convertido, na mesma tela)
// não distingue os dois: o guepardo de 406 KB vira 30 KB e continua o mesmo
// desenho.
//
// AVIF sairia menor ainda (5,5 MB), e não foi escolhido: ganha 1,8 MB e custa
// três vezes o tempo de codificação, e o WebP já é entendido por tudo que abre
// um site desde 2020.
//
// COMO
//   node scripts/converter-imagens.mjs           # mostra o que faria
//   node scripts/converter-imagens.mjs --gravar  # converte e apaga o original
//
// Depois de gravar, `imagens-bestiario.json` precisa apontar para .webp e o
// `gen-monsters.mjs` precisa rodar para levar isso ao monsters.json. As duas
// coisas o `--gravar` já faz.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DIR = path.join(ROOT, 'public/bestiario');
const MAPA = path.join(ROOT, 'src/data/imagens-bestiario.json');
const GRAVAR = process.argv.includes('--gravar');

// O PNG vem de fonte sem perda e aguenta 82 sem aparecer. O JPG já perdeu uma
// vez; dois pontos a mais evitam somar artefato sobre artefato.
const Q = { '.png': 82, '.jpg': 84, '.jpeg': 84 };

const arqs = fs.readdirSync(DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));
let antes = 0, depois = 0;
const feitos = [];

for (const f of arqs) {
  const de = path.join(DIR, f);
  const ext = path.extname(f).toLowerCase();
  const para = path.join(DIR, path.basename(f, path.extname(f)) + '.webp');
  const orig = fs.readFileSync(de);
  const novo = await sharp(orig).webp({ quality: Q[ext] ?? 82, effort: 5 }).toBuffer();
  antes += orig.length; depois += novo.length;
  feitos.push({ f, de: orig.length, para: novo.length });
  if (!GRAVAR) continue;
  fs.writeFileSync(para, novo);
  fs.rmSync(de);
}

const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';
const piores = feitos.slice().sort((a, b) => (b.para / b.de) - (a.para / a.de)).slice(0, 3);
console.log(`${arqs.length} artes · ${mb(antes)} → ${mb(depois)} (−${(100 * (1 - depois / antes)).toFixed(0)}%)`);
console.log('as que menos encolheram: ' + piores.map((p) => `${p.f} ${(100 * (1 - p.para / p.de)).toFixed(0)}%`).join(' · '));

if (!GRAVAR) {
  console.log('\n(ensaio: nada foi gravado. Use --gravar para valer.)');
  process.exit(0);
}

// O mapa de imagens é a fonte: `gen-monsters.mjs` lê dele para preencher o campo
// `imagem` de cada criatura.
const mapa = JSON.parse(fs.readFileSync(MAPA, 'utf8'));
for (const k of Object.keys(mapa)) mapa[k] = String(mapa[k]).replace(/\.(jpe?g|png)$/i, '.webp');
fs.writeFileSync(MAPA, JSON.stringify(mapa, null, 2) + '\n');
console.log(`\n✓ ${Object.keys(mapa).length} caminhos atualizados em src/data/imagens-bestiario.json`);
console.log('  falta rodar: node scripts/gen-monsters.mjs');
