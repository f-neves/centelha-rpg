// add-folego.mjs — calcula o custo de Fôlego por golpe de cada arma e grava em armas.json.
// Modelo (Esquema B): custo = sobrecarga da classe × Speed (ticks).
//   leve 0 · média/haste/distância 1 · pesada 2 · arremesso 1 se dado≥2 senão 0 · tag "pesada" +1.
// Resultado: leve/desarmado 0 (sustentável), média/haste/arco 6, alabarda 12, montante/martelo 14.
// uso: node scripts/add-folego.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const P = path.join(ROOT, 'src/data/armas.json');
const armas = JSON.parse(fs.readFileSync(P, 'utf8'));

const sobrecarga = (w) => {
  let s;
  if (w.classe === 'leve') s = 0;
  else if (w.classe === 'pesada') s = 2;
  else if (w.classe === 'arremesso') s = w.dado >= 2 ? 1 : 0;
  else s = 1; // media, haste, distancia
  if (w.tags.includes('pesada')) s += 1;
  return s;
};

for (const w of armas) w.folego = sobrecarga(w) * w.ticks;

fs.writeFileSync(P, JSON.stringify(armas, null, 2) + '\n', 'utf8');
for (const w of armas) console.log(`  ${w.nome}: Fôlego ${w.folego}`);
console.log(`✓ add-folego: ${armas.length} armas.`);
