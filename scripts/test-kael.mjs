// test-kael.mjs — regressão: garante que as fórmulas de regras.json produzem o
// personagem-referência Kael. Roda no build (falha = build aborta).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const D = r.derivados, fl = Math.floor;

// Kael, o Batedor (Centelha 2, ~1000 XP — exemplo iniciante)
const at = { vigor: 4, destreza: 4, raciocinio: 3 };
const esquiva = 3, espEsq = 0, prontidao = 3, cent = 2, vont = 7, integridade = 2;
const V = { compaixao: 2, conviccao: 3, temperanca: 2, valor: 4 };

const pv = D.pv.base + at.vigor * D.pv.vigorMult;
const defesa = (at.destreza + esquiva) * D.defesa.mult + espEsq + cent;
const defM = integridade * D.defesaMental.mult + (D.defesaMental.maisVontade ? vont : 0) + (D.defesaMental.maisCentelha ? cent : 0);
const energia = cent * D.energia.centelhaMult + (V.compaixao + V.conviccao + V.temperanca + V.valor) + vont;
const mana = cent * D.mana.centelhaMult + vont;
const ini = at.raciocinio + prontidao;

const esperado = { pv: 37, defesa: 16, defM: 13, energia: 24, mana: 11, ini: 6 };
const got = { pv, defesa, defM, energia, mana, ini };
const erros = Object.keys(esperado).filter((k) => got[k] !== esperado[k]);
if (erros.length) {
  console.error('✘ Regressão Kael FALHOU:');
  for (const k of erros) console.error(`  ${k}: esperado ${esperado[k]}, obtido ${got[k]}`);
  process.exit(1);
}
console.log('✓ Regressão Kael OK — PV 37 · Defesa 16 · Def. Mental 13 · Energia 24 · Mana 11 · Iniciativa 1d6+6.');
