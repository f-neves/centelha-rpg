// test-comando-voz.mjs · o parser de números do caminho quente, de "outra
// coisa" e da magia, provado sem navegador e sem microfone (VOZ.md §10,
// rodadas 34, 35 e 38).
//
// O QUE ESTA BANCADA PRENDE, e cada caso é um jeito de a fala virar campo
// errado ou palpite:
//   · números por extenso e compostos ("vinte e três"), nas duas listas
//     (faces de d6, e a faixa livre 0 a 60 dos outros campos);
//   · face fora de 1 a 6, que tem de recusar (é o detector de graça do §9.4);
//   · uma fala enchendo DOIS campos, cortando na palavra de cada um;
//   · número solto (antes de qualquer campo, ou depois do que um campo
//     `inteiro` já consumiu) é RECUSA, nunca palpite;
//   · toda recusa devolve a frase ouvida, para a mesa digitar por cima;
//   · um campo `escolha` (rodada 35, `ou-quando`) casa só contra as
//     palavras de `opcoes`, nunca número, e recusa fora delas;
//   · uma opção `escolha` de MAIS DE UMA PALAVRA (rodada 38, nome de Arte
//     ou Efeito) casa a frase inteira, sempre a MAIS LONGA quando duas
//     competem, e RECUSA em vez de escolher se ficar ambíguo de verdade;
//   · a centena nova (`cento`) compõe com dezena e unidade, só até onde o
//     arcano exige (ABERTURAS/CURVATURAS), e um campo `inteiro` com
//     `permitido` recusa qualquer valor fora da lista fechada.
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

const ticks = CAMPOS.find((c) => c.id === 'ticks');
const quando = CAMPOS.find((c) => c.id === 'quando');
const total = CAMPOS.find((c) => c.id === 'total');
const dificuldade = CAMPOS.find((c) => c.id === 'dificuldade');
ok(!!ticks && !!quando && !!total && !!dificuldade,
  'os quatro campos de "outra coisa" estão no catálogo (ticks/quando/total/dificuldade)');
ok(ticks.tela === 'outra' && acerto.tela === 'ataque',
  `cada campo carrega de qual tela é (ticks: "${ticks.tela}", acerto: "${acerto.tela}")`);
ok(quando.tipo === 'escolha' && Array.isArray(quando.opcoes) && quando.opcoes.length === 2,
  `"quando" é do tipo escolha, com duas opções (${quando.opcoes?.map((o) => o.valor).join('/')})`);

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

console.log('\n· "outra coisa" (rodada 35): número, e um campo `escolha` fechado');

// ---- 9: uma fala enchendo os quatro campos de "outra coisa" ----
r = M.interpretarNumeros('ticks cinco quando fim total dezoito dificuldade doze', CAMPOS);
ok(r.ok === true, `os quatro campos numa fala só: reconhece (motivo: ${r.ok ? '' : r.motivo})`);
ok(r.ok && r.preenchimentos.length === 4, `e enche os quatro (${r.ok ? r.preenchimentos.length : '?'})`);
ok(r.ok && r.preenchimentos[0].valor === 5 && r.preenchimentos[1].valor === 'fim'
  && r.preenchimentos[2].valor === 18 && r.preenchimentos[3].valor === 12,
  `nos valores certos (${r.ok ? JSON.stringify(r.preenchimentos.map((p) => p.valor)) : '?'})`);

// ---- 10: campo `escolha` casa a palavra, nunca número ----
r = M.interpretarNumeros('quando agora', CAMPOS);
ok(r.ok === true && r.preenchimentos[0].valor === 'agora',
  `"quando agora" preenche com o valor "agora" (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

r = M.interpretarNumeros('quando cinco', CAMPOS);
ok(r.ok === false, `"quando cinco" recusa: cinco não é opção de "quando" (${r.ok})`);

r = M.interpretarNumeros('quando depois', CAMPOS);
ok(r.ok === false, `"depois" não é "agora" nem "fim": recusa, nunca palpite (${r.ok})`);

// ---- 11: só o catálogo da tela certa entra quando filtrado (a mesma
// filtragem que `camposAtivos()` faz em grid.astro, por `tela`) ----
const soAtaque = CAMPOS.filter((c) => c.tela === 'ataque');
r = M.interpretarNumeros('ticks cinco', soAtaque);
ok(r.ok === false, '"ticks" fora do catálogo filtrado (só ataque) recusa, como se a palavra não existisse');

console.log('\n· a magia (rodada 38): centena composta, `permitido` fechado, e escolha de mais de uma palavra');

// ---- 12: a centena nova compõe com dezena e unidade ----
const curvatura = {
  id: 'curvatura', palavras: ['curvatura'], destino: 'magia:curvatura', tipo: 'inteiro',
  permitido: [0, 30, 45, 60, 90, 120, 180], tela: 'magia',
};
r = M.interpretarNumeros('curvatura cento e oitenta', [curvatura]);
ok(r.ok === true && r.preenchimentos[0].valor === 180,
  `"cento e oitenta" compõe 180 (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

r = M.interpretarNumeros('curvatura noventa', [curvatura]);
ok(r.ok === true && r.preenchimentos[0].valor === 90,
  `"noventa" (dezena nova) compõe 90 (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

// ---- 13: `permitido` recusa fora da lista fechada, mesmo um número válido
// em qualquer outro campo ----
r = M.interpretarNumeros('curvatura cinquenta', [curvatura]);
ok(r.ok === false, '"cinquenta" não está em `permitido`: recusa, mesmo sendo um número válido em geral');

r = M.interpretarNumeros('curvatura cem', [curvatura]);
ok(r.ok === false, '"cem" sozinho não compõe (só "cento" entrou, cresceu até onde o dado exige): recusa');

// ---- 14: escolha de MAIS DE UMA PALAVRA, casando o catálogo de verdade ----
const efeito = {
  id: 'efeito', palavras: ['efeito'], destino: 'magia:efeito', tipo: 'escolha', tela: 'magia',
  opcoes: [
    { valor: 'arma-elemental', palavras: ['Arma Elemental'] },
    { valor: 'arma-flamejante', palavras: ['Arma Flamejante'] },
  ],
};
r = M.interpretarNumeros('efeito arma elemental', [efeito]);
ok(r.ok === true && r.preenchimentos[0].valor === 'arma-elemental',
  `"arma elemental" casa a opção de duas palavras (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

// ---- 15: entre duas opções em que uma começa como a outra, casa A MAIS
// LONGA — nunca a mais curta por vir primeiro na lista ----
const arte = {
  id: 'arte', palavras: ['arte'], destino: 'magia:arte', tipo: 'escolha', tela: 'magia',
  opcoes: [
    { valor: 'arma', palavras: ['arma'] },
    { valor: 'arma-elemental', palavras: ['arma elemental'] },
  ],
};
r = M.interpretarNumeros('arte arma elemental', [arte]);
ok(r.ok === true && r.preenchimentos[0].valor === 'arma-elemental',
  `"arma elemental" casa a opção LONGA, não "arma" sozinha por vir primeiro (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);
r = M.interpretarNumeros('arte arma', [arte]);
ok(r.ok === true && r.preenchimentos[0].valor === 'arma',
  `mas "arte arma" sozinho (sem "elemental" depois) casa a opção curta (${r.ok ? r.preenchimentos[0].valor : r.motivo})`);

// ---- 16: ambiguidade DE VERDADE (duas opções, mesma frase, valores
// diferentes) é RECUSA, nunca escolha por ordem ou por acaso ----
const ambiguo = {
  id: 'y', palavras: ['y'], destino: 'magia:y', tipo: 'escolha', tela: 'magia',
  opcoes: [
    { valor: 'a', palavras: ['flecha rara'] },
    { valor: 'b', palavras: ['flecha rara'] }, // mesma frase, valor DIFERENTE — ambiguidade de propósito
  ],
};
r = M.interpretarNumeros('y flecha rara', [ambiguo]);
ok(r.ok === false, 'duas opções com a MESMA frase e valores diferentes: ambíguo de verdade, recusa (não escolhe a primeira)');

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
ok(comCaixa.includes('quando') && comCaixa.includes('agora') && comCaixa.includes('fim'),
  'e as palavras de OPÇÃO de um campo `escolha` também entram, não só a palavra do campo');

console.log('');
if (FALHAS.length) {
  console.error(`✗ Comando de voz (parser numérico): ${FALHAS.length} falha(s) de ${PASSOU + FALHAS.length}`);
  process.exit(1);
}
console.log(`✓ Comando de voz (parser numérico) OK · ${PASSOU} asserções · sem navegador, sem microfone`);
