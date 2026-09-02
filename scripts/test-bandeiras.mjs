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
await build({
  entryPoints: [path.join(ROOT, 'src/lib/bandeiras.ts')],
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
ok(publicadas.every((b) => B.PERFIL_CORRENTE[b] === true),
  'as nove de regra publicada nascem LIGADAS, que é o padrão de produção da §0.6');
ok(nucleo.every((b) => B.PERFIL_CORRENTE[b] === false),
  'as seis do núcleo do Tick nascem DESLIGADAS: as regras que elas ligam ainda não existem');
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
const congelado = { perfil: { ...B.PERFIL_CORRENTE, margem: false, bloqueio: false } };
const e = B.estadoDoCarimbo(congelado);
ok(e.temCarimbo && e.difere.join(',') === 'margem,bloqueio',
  `a diferença sai na ordem da lista (${e.difere.join(',')})`);
ok(/DIFERENTE do site em 2/.test(e.frase), `e a frase diz quantas e quais (${e.frase})`);
ok(B.estadoDoCarimbo({ perfil: { ...B.PERFIL_CORRENTE } }).difere.length === 0,
  'carimbo igual ao site não tem diferença nenhuma, e a linha da tela não aparece');
ok(B.estadoDoCarimbo(null).temCarimbo === false && /sem carimbo/.test(B.estadoDoCarimbo(null).frase),
  'e sem encontro a frase diz que a cena não tem carimbo');

console.log(`\n${FALHAS.length ? '✗' : '✓'} Perfil de regras OK · ${PASSOU} asserções · 15 bandeiras, 9 ligadas e 6 esperando a regra, e o carimbo protege o chão da cena`);
if (FALHAS.length) { FALHAS.forEach((f) => console.log('  · ' + f)); process.exit(1); }
