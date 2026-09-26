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
// Depois de gravar, o campo `imagem` de cada ficha (src/data/bestiario/<id>.json)
// precisa apontar para .webp, e o `gen-monsters.mjs` precisa rodar para levar isso
// ao monsters.json. O `--gravar` faz a primeira; a segunda ele pede. Até o B14
// (26/09/2026) o caminho morava no imagens-bestiario.json, que foi apagado.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DIR = path.join(ROOT, 'public/bestiario');
const FICHAS = path.join(ROOT, 'src/data/bestiario');
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

// A ficha de cada criatura é a fonte: `gen-monsters.mjs` lê dela o campo `imagem`.
let n = 0;
for (const f of fs.readdirSync(FICHAS).filter((x) => x.endsWith('.json'))) {
  const arq = path.join(FICHAS, f);
  const c = JSON.parse(fs.readFileSync(arq, 'utf8'));
  if (!c.imagem || !/\.(jpe?g|png)$/i.test(c.imagem)) continue;
  c.imagem = c.imagem.replace(/\.(jpe?g|png)$/i, '.webp');
  fs.writeFileSync(arq, JSON.stringify(c, null, 2) + '\n');
  n++;
}
console.log(`\n✓ ${n} fichas apontadas para .webp em src/data/bestiario/`);
console.log('  falta rodar: node scripts/gen-monsters.mjs');
