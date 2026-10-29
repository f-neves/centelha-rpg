// Regressão Kael: números esperados do livro, calculados pelo motor (A5j, D-237).
import { carregarTS } from './lib-ts.mjs';
const M = await carregarTS('src/lib/motor.ts');
const S = {raca:'humano',attrs:{forca:3,vigor:4,destreza:4,raciocinio:3,compostura:2},skills:{esquiva:3,prontidao:3,integridade:0,atletismo:3},skills2:{},centelha:3,willpower:7,arte:{},corpo:{massa:70},equip:{}};
const n=M.numerosPersonagem(S);
const pv=n.pv,defesa=n.esquiva,defM=n.defesaMental,energia=n.energia,mana=n.mana,ini=n.iniciativa.bonus;
const dz=M.deslocamento({forca:3,destreza:4,atletismo:3,centelha:3});
const desl={arr:dz.arranque,cor:dz.corrida,nor:dz.normal,sv:dz.saltoVertical,shp:dz.saltoHorizontalParado,shc:dz.saltoHorizontalCorrendo};
const esperado = { pv: 37, defesa: 20, defM: 10, energia: 14, mana: 13, ini: 6, deslArr: 6, deslCor: 9, deslNor: 4, saltoV: 256, saltoHP: 5, saltoHC: 14 };
const got = { pv, defesa, defM, energia, mana, ini, deslArr: desl.arr, deslCor: desl.cor, deslNor: desl.nor, saltoV: desl.sv, saltoHP: desl.shp, saltoHC: desl.shc };
const erros = Object.keys(esperado).filter((k) => got[k] !== esperado[k]);
if (erros.length) {
  console.error('✘ Regressão Kael FALHOU:');
  for (const k of erros) console.error(`  ${k}: esperado ${esperado[k]}, obtido ${got[k]}`);
  process.exit(1);
}
// A frase de sucesso sai do PRÓPRIO esperado: escrita à mão, ela envelhece e passa
// a mentir na tela mesmo com o teste verde, que foi o que aconteceu com o Arranque.
console.log(`✓ Regressão Kael OK · PV ${esperado.pv} · Defesa ${esperado.defesa} · Def. Mental ${esperado.defM}`
  + ` · Energia ${esperado.energia} · Mana ${esperado.mana}`
  + ` · Iniciativa 1d6+${esperado.ini} · Arranque ${esperado.deslArr}/Corrida ${esperado.deslCor} m·s`
  + ` · Livre ${esperado.deslNor} m · Salto V${esperado.saltoV}/HP${esperado.saltoHP}/HC${esperado.saltoHC}.`);
