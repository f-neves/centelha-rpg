// test-comando-voz.mjs · o parser de números do caminho quente, provado sem
// navegador e sem microfone (VOZ.md §10, rodada 34).
//
// O QUE ESTA BANCADA PRENDE, e cada caso é um jeito de a fala virar campo
// errado ou palpite:
//   · números por extenso e compostos ("vinte e três"), nas duas listas
//     (faces de d6, e a faixa livre 0 a 60 dos outros campos);
//   · face fora de 1 a 6, que tem de recusar (é o detector de graça do §9.4);
//   · uma fala enchendo DOIS campos, cortando na palavra de cada um;
//   · número solto (antes de qualquer campo, ou depois do que um campo
//     `inteiro` já consumiu) é RECUSA, nunca palpite;
//   · toda recusa devolve a frase ouvida, para a mesa digitar por cima.
//
// NÃO TESTA voz de verdade: `interpretarNumeros` é puro, recebe texto já
// reconhecido. Taxa de reconhecimento é bancada do humano (VOZ.md §10.4).
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `comando-voz-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `export { interpretarNumeros, comecaComPalavraDeCampo, gramaticaDeVoz, CAMPOS } from './src/lib/comando-barra';`,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node', logLevel: 'error',
});
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

const CAMPOS = M.CAMPOS;
const acerto = CAMPOS.find((c) => c.id === 'acerto');
const dano = CAMPOS.find((c) => c.id === 'dano');
const ajuste = CAMPOS.find((c) => c.id === 'ajuste');
const margem = CAMPOS.find((c) => c.id === 'margem');
const raspao = CAMPOS.find((c) => c.id === 'raspao');
ok(!!acerto && !!dano && !!ajuste && !!margem && !!raspao,
  'os cinco campos do caminho quente estão no catálogo (acerto/dano/ajuste/margem/raspao)');

console.log('\n· interpretarNumeros: uma fala vira preenchimento, ou recusa com a frase ouvida');

// ---- 1: o caso do §9.4, dois campos numa fala só ----
let r = M.interpretarNumeros('acerto quatro dois seis dano quatro dois', CAMPOS);
ok(r.ok === true, `duas faces por extenso em dois campos: reconhece (motivo: ${r.ok ? '' : r.motivo})`);
ok(r.ok && r.preenchimentos.length === 2, `e enche EXATAMENTE dois campos (${r.ok ? r.preenchimentos.length : '?'})`);
ok(r.ok && r.preenchimentos[0].campoId === 'acerto' && r.preenchimentos[0].valor === '4,2,6',
  `acerto vira "4,2,6" (${r.ok ? JSON.stringify(r.preenchimentos[0]) : '?'})`);
ok(r.ok && r.preenchimentos[1].campoId === 'dano' && r.preenchimentos[1].valor === '4,2',
  `dano vira "4,2" (${r.ok ? JSON.stringify(r.preenchimentos[1]) : '?'})`);

// ---- 2: face fora de 1 a 6 recusa (o detector de graça do §9.4) ----
r = M.interpretarNumeros('acerto sete', CAMPOS);
ok(r.ok === false, `"sete" não é face de d6: recusa (${r.ok})`);
ok(r.ok === false && r.ouvido === 'acerto sete', `e a recusa mostra a frase ouvida ("${r.ouvido}")`);

r = M.interpretarNumeros('dano dezoito', CAMPOS);
ok(r.ok === false, `"dezoito" também não é face (1 a 6): recusa (${r.ok})`);

// ---- 3: número antes de qualquer campo é recusa, nunca palpite ----
r = M.interpretarNumeros('quatro dois seis', CAMPOS);
ok(r.ok === false, 'números sem dizer o campo antes: recusa, não há onde pendurar (VOZ.md §9.5)');

// ---- 4: os números livres, com composição de dezena+unidade ----
r = M.interpretarNumeros('margem vinte e tres', CAMPOS);
ok(r.ok === true && r.preenchimentos[0].valor === 23,
  `"vinte e tres" compõe 23 (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

r = M.interpretarNumeros('raspao sessenta', CAMPOS);
ok(r.ok === true && r.preenchimentos[0].valor === 60, `dezena sozinha, sem "e": 60 (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

r = M.interpretarNumeros('ajuste menos cinco', CAMPOS);
ok(r.ok === true && r.preenchimentos[0].valor === -5,
  `"menos" nega o ajuste avulso (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

r = M.interpretarNumeros('ajuste treze', CAMPOS);
ok(r.ok === true && r.preenchimentos[0].valor === 13,
  `a família do "-ze" também compõe direto, sem dezena (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

// ---- 5: min/max dos campos livres (margem e raspão não vão a negativo) ----
r = M.interpretarNumeros('margem menos um', CAMPOS);
ok(r.ok === false, `margem tem mínimo 0: "menos um" recusa (${r.ok})`);

// ---- 6: número solto DEPOIS de um campo inteiro já preenchido é recusa ----
r = M.interpretarNumeros('ajuste cinco sete', CAMPOS);
ok(r.ok === false, `"ajuste cinco" já fechou o número; "sete" solto depois recusa (${r.ok})`);

// ---- 7: campo sem número nenhum atrás recusa (não preenche com nada) ----
r = M.interpretarNumeros('acerto dano quatro', CAMPOS);
ok(r.ok === false, `"acerto" sem nenhuma face antes do próximo campo recusa (${r.ok})`);

// ---- 8: palavra fora da gramática recusa, com a frase ouvida ----
r = M.interpretarNumeros('acerto banana', CAMPOS);
ok(r.ok === false && r.ouvido === 'acerto banana', `palavra que não é número nem campo: recusa (${r.ok ? '' : r.motivo})`);

console.log('\n· comecaComPalavraDeCampo: decide o roteamento sem duplicar a gramática');
ok(M.comecaComPalavraDeCampo('acerto quatro', CAMPOS) === true, '"acerto..." começa no domínio dos campos');
ok(M.comecaComPalavraDeCampo('mover h7', CAMPOS) === false, '"mover..." não começa no domínio dos campos (cai para o verbo)');
ok(M.comecaComPalavraDeCampo('acerto quatro', []) === false, 'sem campos ativos, nada começa no domínio dos campos');

console.log('\n· gramaticaDeVoz: números são núcleo, campos são camada da caixa aberta');
const nucleo = JSON.parse(M.gramaticaDeVoz());
ok(nucleo.includes('seis') && nucleo.includes('sessenta') && nucleo.includes('menos') && nucleo.includes('e'),
  'sem campos, os números do núcleo já estão na gramática (VOZ.md §10 decisão 2)');
ok(!nucleo.includes('acerto') && !nucleo.includes('raspao'),
  'mas as palavras de campo NÃO entram sem a caixa aberta (cada palavra a mais piora o resto, §10.1)');
const comCaixa = JSON.parse(M.gramaticaDeVoz(CAMPOS));
ok(comCaixa.includes('acerto') && comCaixa.includes('raspao'),
  'com a caixa aberta publicada, as palavras de campo entram na gramática');

console.log('');
if (FALHAS.length) {
  console.error(`✗ Comando de voz (parser numérico): ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  process.exit(1);
}
console.log(`✓ Comando de voz (parser numérico) OK · ${PASSOU} asserções · sem navegador, sem microfone`);
