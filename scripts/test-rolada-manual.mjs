// test-rolada-manual.mjs · a folha aceita o dado em vez do total, provado sem
// navegador.
//
// DECIDIDO EM 06/09/2026: a ficha do lance parou de pedir a SOMA já pronta
// (a mesa fazia a conta na cabeça e digitava só o resultado) e passou a pedir
// as FACES que caíram, somando sozinha. `roladaManual` (`rolagem.ts`) é o
// motor dessa troca, puro e sem DOM, então cabe aqui e não precisa do Grid
// nem de um navegador para ser provado — o mesmo raciocínio de
// `test-acaso.mjs` para as outras funções deste arquivo.
//
// O QUE ESTA BANCADA PRENDE, e cada caso é um jeito de a conta dar errado:
//   · dobrar o fixo (somar o `+2` da arma duas vezes, uma pelo parser e outra
//     por engano de quem chama);
//   · confundir "ninguém digitou nada" com "digitou zero", que é a mesma
//     forma do zero ambíguo, aqui num campo de dado físico;
//   · o caso do dano fixo (arma sem `d6`), em que o único número digitável É
//     o total, e tratá-lo como face dobraria o fixo por cima dele.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `rolada-manual-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `export { roladaManual, descreverRolada } from './src/lib/rolagem';`,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node', logLevel: 'error',
});
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

console.log('\n· roladaManual: o dado físico digitado, e não o total já somado');

// ---- 1: o caso comum, arma com d6 e fixo na expressão ----
let r = M.roladaManual('3,5,1,2', '4d6+2 +1', 0);
ok(!!r && r.total === 14, `dados normais somam com o fixo da expressão (${r?.total}, esperado 14)`);
ok(!!r && r.rolls.join(',') === '3,5,1,2', `e guarda as faces na ordem digitada, para o registro (${r?.rolls.join(',')})`);
ok(!!r && r.bateContagem === true, `e a contagem bate: 4 faces para uma arma de 4d6 (${r?.bateContagem})`);

// ---- 1b: O HÁBITO ANTIGO (achado da revisão de 06/09/2026) — a mesa digita
// o TOTAL já somado, como fazia antes desta troca, num campo que agora pede
// as faces. A conta ainda "funciona" (soma como se o total fosse uma face
// só), e é exatamente por isso que precisa de uma marca: nada mais denuncia
// o engano.
r = M.roladaManual('14', '4d6+2 +1', 0);
ok(!!r && r.bateContagem === false,
  `mas UM número só para uma arma de 4d6 não bate, e a marca acende (${r?.bateContagem})`);

// ---- 2: o ajuste da SITUAÇÃO (ferimento, condição, P/G/R) soma por fora ----
r = M.roladaManual('3,5', '2d6+1', 2);
ok(!!r && r.total === 3 + 5 + 1 + 2, `o extraFlat da situação soma junto ao fixo da arma (${r?.total})`);

// ---- 2b: O `extraDados` TAMBÉM MUDA A CONTAGEM ESPERADA (achado da revisão
// de 06/09/2026) — sem isto, a guarda marcava vermelho toda digitação de um
// pool ajustado por ferimento, condição, a escada do P/G/R ou a rajada.
r = M.roladaManual('3,5,1', '2d6+1', 0, 1);
ok(!!r && r.bateContagem === true,
  `3 faces para um pool de 2d6 + 1 dado extra bate (esperado true, achou ${r?.bateContagem})`);
r = M.roladaManual('3,5', '2d6+1', 0, 1);
ok(!!r && r.bateContagem === false,
  `e 2 faces para o mesmo pool (esqueceu o dado extra) acende a marca (esperado false, achou ${r?.bateContagem})`);

// ---- 3: a mesa digita como digita, com espaço ou vírgula ----
r = M.roladaManual(' 4 , 2  6', '3d6', 0);
ok(!!r && r.rolls.length === 3 && r.total === 12,
  `aceita espaço e vírgula misturados, do jeito que a mão digita (${JSON.stringify(r?.rolls)})`);

// ---- 4: campo vazio é "nada digitado", e não "rolou zero" ----
ok(M.roladaManual('', '4d6+2', 0) === null, 'campo vazio não é zero: é "nada digitado ainda" (null)');
ok(M.roladaManual('   ', '4d6+2', 0) === null, 'só espaço também é nada, pelo mesmo motivo');

// ---- 5: A ARMA SEM d6 (dano fixo). Um número só É o total, não uma face ----
// Sem este caso, uma arma "+7" (dano fixo, sem dado nenhum) dobraria o fixo:
// o mestre digitaria "7" achando que é o total, e a função somaria +7 de novo.
r = M.roladaManual('7', '+7', 0);
ok(!!r && r.total === 7 && r.rolls.length === 0,
  `um número só, sem d6 na expressão, é o TOTAL pronto — não soma o fixo por cima (${r?.total})`);
ok(!!r && r.bateContagem === true, `e não é hábito antigo: aqui um número só É o total certo (${r?.bateContagem})`);

// ---- 6: mas se a expressão TEM d6, um número só é uma face, e soma o fixo ----
r = M.roladaManual('5', '1d6+2', 0);
ok(!!r && r.total === 7, `um número só COM d6 na expressão é uma face, e o fixo soma normal (${r?.total}, esperado 7)`);
ok(!!r && r.bateContagem === true, `e a contagem bate: 1 face para uma arma de 1d6 (${r?.bateContagem})`);

// ---- 7: o que sobe para o registro é a MESMA descrição que um auto-rolado usaria ----
const desc = M.descreverRolada({ dados: 3, flat: 3, rolls: [3, 5, 1], total: 12 });
ok(desc === '[3, 5, 1] +3 = 12', `descreverRolada lê a rolada manual com o mesmo formato do registro ("${desc}")`);

console.log('');
if (FALHAS.length) {
  console.error(`✗ Rolada manual: ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  process.exit(1);
}
console.log(`✓ Rolada manual OK · ${PASSOU} asserções · o dado digitado soma certo, sem navegador`);
