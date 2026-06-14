// test-kael.mjs — regressão: garante que as fórmulas de regras.json produzem o
// personagem-referência Kael. Roda no build (falha = build aborta).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));
const D = r.derivados, fl = Math.floor;

// Kael, o Batedor (Centelha 2, ~1000 XP — exemplo iniciante)
const at = { forca: 3, vigor: 4, destreza: 4, raciocinio: 3 };
const esquiva = 3, espEsq = 0, prontidao = 3, cent = 2, vont = 7, integridade = 0, atletismo = 3;
const V = { compaixao: 2, conviccao: 3, temperanca: 2, valor: 4 };

const pv = D.pv.base + at.vigor * D.pv.vigorMult;
const defesa = (at.destreza + esquiva) * D.defesa.mult + espEsq + cent * (D.defesa.centelhaMult ?? 1);
const defM = integridade * D.defesaMental.mult + (D.defesaMental.maisVontade ? vont : 0) + (D.defesaMental.maisCentelha ? cent * (D.defesaMental.centelhaMult ?? 1) : 0);
const energia = cent * D.energia.centelhaMult + (V.compaixao + V.conviccao + V.temperanca + V.valor) + vont;
const mana = cent * D.mana.centelhaMult + vont;
const resistencia = 0;
const fo = D.folego, folego = fo.base + at.vigor * fo.vigorMult + resistencia * fo.resistenciaMult + vont * fo.vontadeMult;
const ini = at.raciocinio + prontidao;
const dz = D.deslocamento, traits = { forca: at.forca, destreza: at.destreza, atletismo, centelha: cent };
const dc = (c) => Math.round(Object.entries(c).reduce((s, [k, v]) => s + (traits[k] || 0) * v, 0));
const desl = { arr: dc(dz.arranque), cor: dc(dz.corrida), nor: dc(dz.normal), sv: dc(dz.saltoVertical), shp: dc(dz.saltoHorizontalParado), shc: dc(dz.saltoHorizontalCorrendo) };

const esperado = { pv: 37, defesa: 18, defM: 11, energia: 24, mana: 11, folego: 44, ini: 6, deslArr: 7, deslCor: 9, deslNor: 4, saltoV: 206, saltoHP: 4, saltoHC: 13 };
const got = { pv, defesa, defM, energia, mana, folego, ini, deslArr: desl.arr, deslCor: desl.cor, deslNor: desl.nor, saltoV: desl.sv, saltoHP: desl.shp, saltoHC: desl.shc };
const erros = Object.keys(esperado).filter((k) => got[k] !== esperado[k]);
if (erros.length) {
  console.error('✘ Regressão Kael FALHOU:');
  for (const k of erros) console.error(`  ${k}: esperado ${esperado[k]}, obtido ${got[k]}`);
  process.exit(1);
}
console.log('✓ Regressão Kael OK — PV 37 · Defesa 18 · Def. Mental 11 · Energia 24 · Mana 11 · Fôlego 44 · Iniciativa 1d6+6 · Arranque 7/Corrida 9 m·s · Livre 4 m · Salto V206/HP4/HC13.');
