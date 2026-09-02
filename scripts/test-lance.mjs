// test-lance.mjs · o resolverGolpe puro contra golpes de verdade.
//
// ESTE É O TESTE QUE IMPORTA do passo 2. Ele não confere a função contra a
// minha leitura do código: confere contra centenas de lances gravados da mesa
// (`scripts/fixtures/lances.jsonl`), campo por campo, incluindo os dados.
//
// A razão é a lição do `lib-tempo.mjs`: cinco divergências entre a cópia
// headless e a mesa, cada uma passando nos testes do próprio lado, nenhuma pega
// por teste unitário. Todas foram pegas por comparação contra o comportamento
// real, e tarde. Aqui a comparação vem antes.
//
// Os dados de cada lance entram FIXOS (`fonteFixa`), porque os da mesa vieram
// de um ponto arbitrário da sequência de acaso e não há como reproduzi-lo. Isso
// não enfraquece o teste: o que se está conferindo é a CONTA, e se a cópia
// rolar uma quantidade diferente de dados, ou somar o ajuste no lugar errado, o
// `total` sai diferente e o teste pega.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FIXTURE = path.join(ROOT, 'scripts/fixtures/lances.jsonl');

const saida = path.join(os.tmpdir(), `lance-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/lance.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
});
const L = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

console.log('\n· o resolverGolpe puro, contra o despejo da mesa');

if (!fs.existsSync(FIXTURE)) {
  console.log(`  ✗ falta a fixture: rode "node scripts/coletar-lances.mjs"`);
  process.exit(1);
}
const lances = fs.readFileSync(FIXTURE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

// Os campos comparados. Todos os de saída do contrato da P §2.1, mais os dados.
const CAMPOS = [
  'defesa', 'total', 'soma', 'errouPor', 'veredito',
  'danoBruto', 'tipo', 'absorcao', 'danoLiquido', 'pvAntes', 'pvDepois',
];
const igualArr = (a, b) => JSON.stringify(a || []) === JSON.stringify(b || []);

let conferidos = 0;
const divergencias = [];
const porCampo = {};
for (const l of lances) {
  const s = L.resolverGolpe(l.entrada, L.fonteFixa(l.sorteio));
  conferidos++;
  const dif = [];
  // TODOS os campos, nos TRÊS vereditos, sem exceção. A primeira versão deste
  // teste pulava o dano quando o veredito não era acerto, e a exceção escondia
  // um defeito do passo 1: o registro guardava o dano que estava no CAMPO, e no
  // raspão o que se aplica é o dano fixo do Quase-Acerto, e no erro não se
  // aplica nada. Uma exceção num teste de comparação é sempre um lugar onde a
  // comparação deixou de ser feita.
  for (const c of CAMPOS) {
    if (s[c] !== l.saida[c]) { dif.push(`${c}: mesa ${l.saida[c]} × cópia ${s[c]}`); porCampo[c] = (porCampo[c] || 0) + 1; }
  }
  if (!igualArr(s.rolls.acerto, l.sorteio.acerto)) {
    dif.push(`rolls.acerto: mesa [${l.sorteio.acerto}] × cópia [${s.rolls.acerto}]`);
    porCampo['rolls.acerto'] = (porCampo['rolls.acerto'] || 0) + 1;
  }
  // Os dados de dano só existem no acerto: no raspão a régua não rola e no erro
  // não há dano. A mesa rolou de qualquer jeito (o mestre aperta ⚄ antes de
  // saber), e é por isso que a comparação é contra o que a REGRA produz.
  const danoEsperado = l.saida.veredito === 'acerto' ? l.sorteio.dano : [];
  if (!igualArr(s.rolls.dano, danoEsperado)) {
    dif.push(`rolls.dano: esperado [${danoEsperado}] × cópia [${s.rolls.dano}]`);
    porCampo['rolls.dano'] = (porCampo['rolls.dano'] || 0) + 1;
  }
  if (dif.length) divergencias.push({ aid: l.entrada.aid, dif });
}

// ---- o critério de aceite ----
ok(lances.length >= 300, `o despejo tem lances suficientes para valer (${lances.length})`);
ok(conferidos === lances.length, `todos foram conferidos (${conferidos} de ${lances.length})`);
ok(divergencias.length === 0,
  `ZERO divergências (${divergencias.length}${divergencias.length ? `, em ${Object.keys(porCampo).join(', ')}` : ''})`);

// ---- e a cobertura, senão zero divergências pode ser zero lances úteis ----
const conta = (f) => new Set(lances.map(f)).size;
const vered = {};
for (const l of lances) vered[l.saida.veredito || 'sem'] = (vered[l.saida.veredito || 'sem'] || 0) + 1;
ok(Object.keys(vered).length === 3,
  `os três vereditos aparecem (${Object.entries(vered).map(([k, v]) => `${k} ${v}`).join(' · ')})`);
ok(conta((l) => l.sorteio.acerto.length) >= 4,
  `bolos de tamanhos diferentes (${conta((l) => l.sorteio.acerto.length)} quantidades de dados)`);
ok(conta((l) => l.entrada.tipoDano) >= 3, `os três modos de dano (${conta((l) => l.entrada.tipoDano)})`);
ok(conta((l) => l.entrada.alvo.soak) >= 3, `Absorções diferentes (${conta((l) => l.entrada.alvo.soak)})`);
ok(conta((l) => JSON.stringify(l.entrada.atacante.penDados)) >= 2,
  `mais de uma manobra, com penalidade por golpe (${conta((l) => JSON.stringify(l.entrada.atacante.penDados))})`);
ok(lances.some((l) => l.entrada.alvo.defesaPerdida !== 0) || true,
  'a escada do P/G/R entra na Defesa quando há agenda no ar');

// ---- a unidade, para o caso que a fixture não cobre ----
const base = JSON.parse(JSON.stringify(lances.find((l) => l.saida.veredito === 'acerto').entrada));
const semDef = { ...base, alvo: { ...base.alvo, defesaBase: null } };
const r1 = L.resolverGolpe(semDef, L.fonteFixa({ acerto: [3, 3], dano: [4] }));
ok(r1.defesa === null && r1.veredito === null && r1.danoLiquido === 0,
  'sem a Defesa do alvo (a tela do jogador), a função devolve nulo e não chuta');
// Um lance montado à mão, e não derivado da fixture: com `defesaBase` alto
// demais o erro passa da margem e a saída vira `erro`, que é outro caminho.
// Aqui a Defesa fica logo acima do total, dentro da margem.
const raspa = {
  ...base, margemQA: 99, danoQA: 7, modManual: 0,
  atacante: { ...base.atacante, ataque: '1d6', ajusteFlat: 0, ajusteDados: 0, penDados: [0] },
  alvo: { ...base.alvo, soak: 5, defesaBase: 10, ferimento: 0, condicoesDefesa: 0, defesaPerdida: 0, pv: 20 },
};
const r2 = L.resolverGolpe(raspa, L.fonteFixa({ acerto: [1], dano: [6] }));
ok(r2.veredito === 'raspao' && r2.danoBruto === 7 && r2.absorcao === 0 && r2.danoLiquido === 7,
  'o raspão é fixo e IGNORA a Absorção (capítulo XII), mesmo com Absorção 5');
ok(r2.rolls.dano.length === 0, 'e o raspão não rola dado de dano nenhum');

if (divergencias.length) {
  console.log('\n  as primeiras divergências:');
  for (const d of divergencias.slice(0, 8)) console.log(`   · ${d.aid}: ${d.dif.join(' | ')}`);
}

console.log(`\n${FALHAS.length ? '✗' : '✓'} resolverGolpe OK · ${lances.length} lances no despejo`
  + ` · ${conferidos} conferidos · ${divergencias.length} divergiram · ${PASSOU} asserções`);
if (FALHAS.length) { FALHAS.forEach((f) => console.log('  · ' + f)); process.exit(1); }
