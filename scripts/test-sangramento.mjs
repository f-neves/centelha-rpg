// test-sangramento.mjs — o relógio do dano contínuo, travado.
//
// A `M-04` decidiu que o Sangramento corre no relógio de CADA UM, a cada 6
// Ticks contados DA FERIDA, e não no início da rodada de quem age. O que antes
// disparava quando o combatente agia deixava quem está imobilizado, inconsciente
// ou apenas esperando atravessar a cena inteira sem perder um ponto, que é o
// oposto do que o Sangramento existe para fazer.
//
// A parte disto que é conta pura é `tiquesDevidos`, e ela é a única que dá para
// travar barato. Os casos que ela guarda não são decorativos: cada um é uma
// forma de errar que já estava no caminho.
//
//   1. O RELÓGIO PULA. `avancarTick` (`combate.astro`) anda `quanto` Ticks de
//      uma vez, não um. Ferida no Tick 3, relógio indo de 2 para 15: dois tiques
//      (os Ticks 9 e 15), nunca um (perder tique) nem treze (cobrar por Tick).
//   2. PAGO É PAGO. Duas telas abertas varrem o mesmo Tick, e a segunda tem de
//      devolver zero. Idempotência que depende de quem chama não é idempotência.
//   3. A INSTÂNCIA SEM `desde` (salva antes desta rodada) é carimbada com o Tick
//      corrente, e não tratada como zero: tratada como zero, uma ferida antiga
//      numa cena no Tick 60 cobraria dez pontos de uma vez no primeiro Tick
//      depois do deploy.
//   4. DOIS SANGRAMENTOS SÃO DOIS RELÓGIOS, desalinhados de propósito.
//
// Entra no `npm run validate`: é puro, não sobe navegador e custa milissegundos.
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `mesa-core-sangue-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/mesa-core.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  // A lib arrasta o cliente do Supabase, que lê `import.meta.env` no topo do
  // módulo; fora do Astro esse objeto não existe.
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m} · esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);

// ------------------------------------------------------- 1. a conta pura
const T = M.tiquesDevidos;
eq(M.TICKS_DO_CONTINUO, 6, 'o ciclo do dano contínuo é de 6 Ticks');

// o primeiro tique cai SEIS Ticks depois da ferida, não no Tick dela
eq(T(3, 3, 3), 0, 'no Tick da própria ferida ainda não se cobra nada');
eq(T(3, 3, 8), 0, 'cinco Ticks depois da ferida ainda não fecharam o ciclo');
eq(T(3, 3, 9), 1, 'seis Ticks depois da ferida cai o primeiro tique');
eq(T(3, 8, 9), 1, 'e ele cai mesmo que a varredura anterior tenha parado no Tick 8');

// O PULO, que é o caso 1 e o motivo de a função receber intervalo
eq(T(3, 2, 15), 2, 'um pulo de 2 para 15 sobre ferida no Tick 3 cobra DOIS tiques (9 e 15)');
ok(T(3, 2, 15) !== 1, 'e não um: perder tique no pulo é o defeito que esta asserção existe para pegar');
ok(T(3, 2, 15) !== 13, 'e não treze: o ciclo é de 6 Ticks, não de 1');
eq(T(0, 0, 60), 10, 'ferida no Tick 0 e relógio no 60: dez tiques');

// PAGO É PAGO, que é o caso 2
eq(T(3, 15, 15), 0, 'varrer de novo o mesmo Tick não cobra nada');
eq(T(3, 15, 14), 0, 'e um relógio que voltou atrás também não');
eq(T(3, 9, 15), 1, 'do tique já pago até o próximo vai um só');

// ------------------------------------------ 2. quanto cada condição cobra
const C = M.continuoDe;
eq(C({ id: 'sangrando' }), 1, 'a condição de catálogo é gravada só como {id}: o número sai da lista');
eq(C({ id: 'em-chamas' }), 3, 'e em-chamas cobra 3');
eq(C({ id: 'x-caseira', porSeisTicks: 4 }), 4, 'a condição caseira carrega o próprio número');
eq(C({ id: 'x-velha', porRodada: 2 }), 2, 'e a salva ANTES desta rodada carrega o nome velho, que ainda é lido');
eq(C({ id: 'atordoado' }), 0, 'condição sem dano contínuo cobra zero');
eq(C(null), 0, 'e nada nenhum cobra zero');

// ------------------------------------------------ 3. a proposta por combatente
const D = M.danoContinuoDevido;

// o carimbo retroativo, que é o caso 3
{
  const combs = [{ id: 'a', nome: 'Kael', condicoes: [{ id: 'sangrando' }] }];
  const prop = D(combs, 60);
  eq(prop.length, 1, 'a instância sem `desde` aparece na proposta, para ser carimbada');
  eq(prop[0].total, 0, 'e NÃO cobra nada agora: carimbar não é cobrar');
  eq(prop[0].condicoes[0].desde, 60, 'o carimbo é o Tick corrente');
  eq(prop[0].condicoes[0].pago, 60, 'e o pago nasce junto, para o próximo tique cair no 66');
  // o controle negativo do carimbo: depois de carimbada, ela não cobra de novo no mesmo Tick
  eq(D([{ id: 'a', nome: 'Kael', condicoes: prop[0].condicoes }], 60).length, 0,
    'e varrer de novo no mesmo Tick não propõe nada');
}

// DOIS SANGRAMENTOS, DOIS RELÓGIOS, que é o caso 4
{
  const combs = [{ id: 'a', nome: 'Kael', condicoes: [
    { id: 'sangrando', desde: 0, pago: 0 },
    { id: 'sangrando', desde: 3, pago: 3 },
  ] }];
  eq(D(combs, 6)[0].total, 1, 'no Tick 6 só a ferida do Tick 0 fechou o ciclo');
  eq(D(combs, 9)[0].total, 2, 'no Tick 9 as duas já fecharam, uma cada: dois pontos');
  const dois = D(combs, 9)[0].condicoes;
  eq([dois[0].pago, dois[1].pago], [9, 9], 'e as duas ficam quitadas até o Tick corrente');
}

// o total soma o que cada condição cobra, e não conta condição sem dano
{
  const combs = [{ id: 'a', nome: 'Sora', condicoes: [
    { id: 'em-chamas', desde: 0, pago: 0 },
    { id: 'atordoado', desde: 0, pago: 0 },
  ] }];
  eq(D(combs, 12)[0].total, 6, 'em-chamas 3 por tique, dois tiques: 6');
  eq(D(combs, 12)[0].condicoes[1].pago, 0, 'e a condição sem dano contínuo não é tocada');
}

// OS CONTROLES NEGATIVOS: o que NÃO pode virar proposta
ok(!D([{ id: 'a', nome: 'x', condicoes: [] }], 30).length, 'combatente sem condição não entra na proposta');
ok(!D([{ id: 'a', nome: 'x', condicoes: [{ id: 'atordoado', desde: 0, pago: 0 }] }], 30).length,
  'nem combatente cuja única condição não cobra dano contínuo');
ok(!D(null, 30).length, 'nem uma lista que não existe');
ok(!D([{ id: 'a', nome: 'x', condicoes: [{ id: 'sangrando', desde: 10, pago: 10 }] }], 12).length,
  'nem a ferida nova cujo primeiro ciclo ainda não fechou');

if (falhas.length) {
  console.error(`\n✘ sangramento: ${falhas.length} falha(s)\n` + falhas.map((f) => '  · ' + f).join('\n'));
  process.exit(1);
}
console.log('✓ sangramento: o dano contínuo cobra a cada 6 Ticks contados da ferida, sobrevive ao'
  + ' pulo do relógio, não cobra duas vezes no mesmo Tick, carimba sem cobrar o que foi salvo antes'
  + ' da regra, e dá dois relógios a duas feridas');
