// test-kael.mjs — regressão: garante que as fórmulas de regras.json produzem o
// personagem-referência Kael. Roda no build (falha = build aborta).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const D = r.derivados, fl = Math.floor, ce = Math.ceil;

// Kael, o Batedor (Centelha 2, ~1000 XP — exemplo iniciante)
const at = { vigor: 4, destreza: 4, raciocinio: 3 };
const esquiva = 3, espEsq = 0, prontidao = 3, cent = 2, vont = 7;
const V = { compaixao: 2, conviccao: 3, temperanca: 2, valor: 4 };

const pv = D.pv.base + at.vigor * D.pv.vigorMult;
const soma = at.destreza + esquiva;
const defesa = soma * D.defesa.mult - fl(soma / D.defesa.somaDiv) + espEsq + ce(cent / D.defesa.centelhaCeilDiv);
const integ = V.compaixao + V.temperanca;
const defM = fl((integ + vont) / D.defesaMental.div) + cent;
const energia = cent * D.energia.centelhaMult + (V.compaixao + V.conviccao + V.temperanca + V.valor) + vont;
const mana = cent * D.mana.centelhaMult + vont;
const ini = at.raciocinio + prontidao;

const esperado = { pv: 37, defesa: 14, defM: 7, energia: 24, mana: 11, ini: 6 };
const got = { pv, defesa, defM, energia, mana, ini };
const erros = Object.keys(esperado).filter((k) => got[k] !== esperado[k]);
if (erros.length) {
  console.error('✘ Regressão Kael FALHOU:');
  for (const k of erros) console.error(`  ${k}: esperado ${esperado[k]}, obtido ${got[k]}`);
  process.exit(1);
}
console.log('✓ Regressão Kael OK — PV 37 · Defesa 14 · Def. Mental 7 · Energia 24 · Mana 11 · Iniciativa 1d6+6.');
