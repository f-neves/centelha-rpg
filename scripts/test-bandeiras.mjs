// test-bandeiras.mjs · o perfil de regras e o carimbo do encontro.
//
// Item 1.0 da Etapa 1. O que se trava aqui é o CONTRATO, porque três coisas
// dependem dele e nenhuma delas está escrita no mesmo lugar: a mesa lê o perfil
// para saber que regras a cena roda, o harness lê o mesmo objeto para montar os
// 17 perfis de E5, e o manifesto da bateria hasheia `src/data` para registrar
// com qual deles cada batalha rodou.
//
// A asserção que mais vale é a da bandeira que FALTA no carimbo: ela vale
// false, e não o valor de hoje. Herdar o valor corrente seria deixar o chão
// mudar, que é exatamente o que o carimbo existe para impedir.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `bandeiras-${process.pid}.mjs`);
// `modificadorPorte`/`porteDeRotulo` moram em `calc.ts`, não em `bandeiras.ts`:
// o perfil (o carimbo) e a régua de porte são módulos diferentes, e este
// arquivo confere os dois juntos porque a régua é a metade nova da mesma
// bandeira que o carimbo protege.
await build({
  stdin: {
    contents: `
      export * from './src/lib/bandeiras';
      export { modificadorPorte, porteDeRotulo } from './src/lib/calc';
    `,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
});
const B = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });
const regras = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/regras.json'), 'utf8'));

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

console.log('\n· o perfil de regras, e o carimbo do encontro');

// ---- 1: as quinze, e as mesmas dos dois lados ----
ok(B.BANDEIRAS.length === 15, `são quinze bandeiras (${B.BANDEIRAS.length})`);
const noJson = Object.keys(regras.bandeiras || {}).filter((k) => typeof regras.bandeiras[k] === 'boolean');
ok(noJson.length === 15, `e quinze booleanos no regras.json (${noJson.length})`);
ok(B.BANDEIRAS.every((b) => noJson.includes(b)), 'os nomes do módulo e do JSON são os mesmos');
ok(!B.BANDEIRAS.includes('couraca'),
  'a couraca NÃO está na lista: já é aplicada em tempo de geração, e uma bandeira a somaria duas vezes');

// ---- 2: o estado inicial é o que a §0.7 decidiu ----
const publicadas = ['margem', 'gate', 'porte', 'bloqueio', 'modo2', 'teto6', 'curaSemArea', 'curaDivide', 'porRodada'];
const nucleo = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'];
// A ASSERÇÃO É SOBRE O INVARIANTE, não sobre a lista: nenhuma bandeira pode
// estar `true` sem que o motor a aplique. Quem ligar uma vem aqui e move o
// nome para `LIGADAS_NO_MOTOR`, o que obriga a decisão a ser explícita em vez
// de silenciosa. `porte` é a primeira (06/09/2026): `modificadorPorte` em
// `calc.ts`, aplicado em `ajAtq.flat` de `folhaDaAcao` (`grid.astro`). Só na
// MESA — o harness (`scripts/sim/motor.mjs`) continua sem lê-la, porque a
// segunda bateria não acontece (`Pendencias.md` L25).
const LIGADAS_NO_MOTOR = ['porte'];
ok([...publicadas, ...nucleo].every((b) => B.PERFIL_CORRENTE[b] === LIGADAS_NO_MOTOR.includes(b)),
  `só as bandeiras que o motor aplica estão ligadas (${LIGADAS_NO_MOTOR.length} de 15)`);
ok(publicadas.filter((b) => !LIGADAS_NO_MOTOR.includes(b)).every((b) => B.PERFIL_CORRENTE[b] === false),
  'as oito de regra publicada que restam nascem DESLIGADAS: nenhuma está ligada no motor ainda');
ok(nucleo.every((b) => B.PERFIL_CORRENTE[b] === false),
  'e as seis do núcleo também: as regras que elas ligam ainda não existem');

// ---- 2b: o modificador de porte, com sinal e teto conferidos ----
//
// O sinal é o que um teste unitário comum não pega: o número sai plausível
// nos dois sentidos, e só a direção errada. Médio atacando Colossal tem de
// somar (o alvo é maior); Colossal atacando Médio tem de subtrair o MESMO
// valor (é o mesmo par, invertido).
ok(B.modificadorPorte('medio', 'colossal') === 12,
  `médio ataca colossal: +12 (${B.modificadorPorte('medio', 'colossal')})`);
ok(B.modificadorPorte('colossal', 'medio') === -12,
  `colossal ataca médio: −12, não +12 (${B.modificadorPorte('colossal', 'medio')})`);
ok(B.modificadorPorte('medio', 'medio') === 0, 'mesmo porte: zero');
ok(B.modificadorPorte('minusculo', 'colossal') === 12,
  'a diferença tem teto de capCategorias (4): minúsculo × colossal (6 categorias de distância) satura em +12, não em +18');
ok(B.porteDeRotulo('Miúdo') === 'minusculo' && B.porteDeRotulo('Médio') === 'medio'
  && B.porteDeRotulo(null) === 'medio' && B.porteDeRotulo('lixo') === 'medio',
  'o rótulo do bestiário normaliza certo, e o que não bate cai em medio, não quebra');
ok(regras.combate?.simultaneo?.decideEmValeDepois === 1 && B.PERFIL_CORRENTE.n1 === false,
  'e o n1 concorda com o decideEmValeDepois: os dois dizem que a ação começa em T+1');

// ---- 3: a normalização, que é onde o carimbo protege ----
const parcial = B.perfilDe({ margem: true });
ok(parcial.margem === true, 'o que está no carimbo vale o que está escrito');
ok(parcial.gate === false && parcial.bloqueio === false,
  'e o que FALTA no carimbo vale false, e não o valor de hoje: herdar o corrente seria deixar o chão mudar');
ok(Object.keys(parcial).length === 15, 'o perfil normalizado tem sempre as quinze chaves');
ok(B.perfilDe(null).margem === false && B.perfilDe('lixo').margem === false,
  'carimbo nulo ou corrompido não explode: vira tudo false');

// ---- 4: sem carimbo, roda o do pacote ----
ok(B.perfilDoEncontro(null).margem === B.PERFIL_CORRENTE.margem,
  'encontro sem carimbo roda o perfil do pacote (é todo encontro anterior à migração 29)');
ok(B.perfilDoEncontro({ perfil: { margem: false } }).margem === false,
  'e encontro COM carimbo roda o carimbo, mesmo contrariando o site');

// ---- 5: a diferença, que é o que a tela mostra ----
// Um carimbo que DIFERE do site: as duas trocadas em relação ao corrente, seja
// ele qual for. Fixar `false` aqui deixaria o teste passar por coincidência no
// dia em que o corrente também fosse `false`, que é o dia de hoje.
const congelado = {
  perfil: { ...B.PERFIL_CORRENTE, margem: !B.PERFIL_CORRENTE.margem, bloqueio: !B.PERFIL_CORRENTE.bloqueio },
};
const e = B.estadoDoCarimbo(congelado);
ok(e.temCarimbo && e.difere.join(',') === 'margem,bloqueio',
  `a diferença sai na ordem da lista (${e.difere.join(',')})`);
ok(/DIFERENTE do site em 2/.test(e.frase), `e a frase diz quantas e quais (${e.frase})`);
ok(B.estadoDoCarimbo({ perfil: { ...B.PERFIL_CORRENTE } }).difere.length === 0,
  'carimbo igual ao site não tem diferença nenhuma, e a linha da tela não aparece');
ok(B.estadoDoCarimbo(null).temCarimbo === false && /sem carimbo/.test(B.estadoDoCarimbo(null).frase),
  'e sem encontro a frase diz que a cena não tem carimbo');

console.log(`\n${FALHAS.length ? '✗' : '✓'} Perfil de regras OK · ${PASSOU} asserções · 15 bandeiras`
  + ` (${LIGADAS_NO_MOTOR.length} ligada na mesa: ${LIGADAS_NO_MOTOR.join(', ')}), e o carimbo protege o chão da cena`);
if (FALHAS.length) { FALHAS.forEach((f) => console.log('  · ' + f)); process.exit(1); }
