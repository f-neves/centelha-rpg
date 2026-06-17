// add-folego.mjs — grava o custo BRUTO de Fôlego por golpe de cada arma em armas.json.
// Modelo: você recupera +Vigor de Fôlego por Tick (contínuo); o golpe gasta este bruto,
// então o LÍQUIDO = bruto − Vigor×Speed (golpe leve se paga / regenera; pesado drena).
//   leve 15 · média/haste 24 · distância 20 · pesada 38 · arremesso 12 (dado<2) ou 20 · tag "pesada" +8.
// uso: node scripts/add-folego.mjs
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const P = path.join(ROOT, 'src/data/armas.json');
const armas = JSON.parse(fs.readFileSync(P, 'utf8'));

const gross = (w) => {
  let g;
  if (w.classe === 'leve') g = 15;
  else if (w.classe === 'media') g = 24;
  else if (w.classe === 'haste') g = 24;
  else if (w.classe === 'distancia') g = 20;
  else if (w.classe === 'pesada') g = 38;
  else g = w.dado >= 2 ? 20 : 12; // arremesso
  if (w.tags.includes('pesada')) g += 8;
  return g;
};

for (const w of armas) w.folego = gross(w);

fs.writeFileSync(P, JSON.stringify(armas, null, 2) + '\n', 'utf8');
for (const w of armas) console.log(`  ${w.nome}: Fôlego ${w.folego}`);
console.log(`✓ add-folego: ${armas.length} armas.`);
