// test-porte-raca.mjs · o porte da raça chega ao PV, e a explicação sai da tabela.
//
// A `M-29` decidiu que o Halfling é `pequeno`. O defeito que ela conserta não era
// um número errado: era uma tabela que NINGUÉM ALCANÇAVA. `derivados.pv.porte`
// tem sete linhas calibradas em `regras.json`, e os dois únicos chamadores vivos
// de `pv()` chamavam `pv(vig)` sem o segundo argumento, então todo personagem
// jogável caía no default de Médio e um Halfling tinha exatamente o PV de um Orc
// de mesmo Vigor.
//
// Este portão guarda quatro coisas, e três delas são armadilhas de silêncio:
//
//   1. O CAMPO EXISTE NAS OITO RAÇAS. Ausente e decidido-Médio são
//      indistinguíveis, porque `d.porte?.[porte] ?? {base, vigorMult}` cai em
//      Médio para qualquer erro de digitação, calado.
//   2. A EXPLICAÇÃO DA FICHA NÃO TEM NÚMERO À MÃO. Ela trazia `25 + Vigor 3×3`
//      escrito na string, e com o Halfling em `pequeno` isso imprimiria
//      "25 + Vigor 3×3 = 26", uma conta que não fecha dentro da própria frase.
//      Esta é a asserção que o Arquiteto pediu, e ela vale mais que o conserto:
//      o conserto morre na próxima vez que alguém reescrever a linha à mão.
//   3. OS DOIS CHAMADORES PASSAM O PORTE. Se um voltar a chamar `pv(vig)` seco,
//      a tabela deixa de ser alcançada de novo, e nenhum número fica vermelho.
//   4. A NOTA DO FÔLEGO NÃO PROMETE O QUE O DADO NÃO TEM (`M-26`): ela dizia
//      "Base por raça (humano = 10)" e o dado entrega um número só para as oito.
//
// Entra no `npm run validate`: é puro e custa milissegundos.
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const saida = path.join(os.tmpdir(), `calc-porte-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/calc.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
const C = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const RACAS = JSON.parse(ler('src/data/racas.json'));
const regras = JSON.parse(ler('src/data/regras.json'));

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m} · esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`);

// ---------------------------------------- 1. o campo existe nas OITO, e é válido
const PORTES = ['minusculo', 'pequeno', 'medio', 'grande', 'enorme', 'imenso', 'colossal'];
eq(RACAS.length, 8, 'as oito raças jogáveis');
for (const r of RACAS) {
  ok(r.porte != null, `a raça ${r.id} não declara porte, e ausente é indistinguível de Médio decidido`);
  ok(PORTES.includes(r.porte), `o porte de ${r.id} (${r.porte}) não está na tabela de portes`);
}
eq(RACAS.filter((r) => r.porte === 'pequeno').map((r) => r.id), ['halfling'],
  'o Halfling é a única raça Pequena decidida (`M-29`); Gnomo e Anão seguem Médios até a mesa decidir');

// ------------------------------------------------- 2. a tabela alcança de verdade
// A ponte tolera `pvPorte` AUSENTE de propósito: sem isso o teste estoura na
// primeira linha quando a função ainda não existe, e o vermelho fica cego para
// tudo que vem depois. O ensaio dos três sentidos precisa ver a lista inteira.
ok(typeof C.pvPorte === 'function', '`calc.ts` não exporta `pvPorte`: quem explica a conta volta a guardar cópia à mão');
const pvPorte = typeof C.pvPorte === 'function' ? C.pvPorte : () => ({ base: null, vigorMult: null });
eq(pvPorte('pequeno'), { base: 20, vigorMult: 2 }, 'a linha de Pequeno em `derivados.pv.porte`');
eq(pvPorte('medio'), { base: 25, vigorMult: 3 }, 'a linha de Médio');
eq(C.pv(3, 'pequeno'), 26, 'Halfling de Vigor 3: 20 + 3×2');
eq(C.pv(3, 'medio'), 34, 'e o mesmo Vigor num Médio: 25 + 3×3');
ok(C.pv(3, 'pequeno') !== C.pv(3, 'medio'), 'os dois portes têm de dar números DIFERENTES, senão a tabela não está sendo lida');
// o controle negativo: porte que não existe cai no default, e isso é de propósito
eq(C.pv(3, 'Pequeno'), 34, 'porte escrito errado cai em Médio, calado: é por isso que o esquema do portão o valida');

// --------------------------- 3. a ficha não guarda cópia à mão dos dois números
{
  const eng = ler('src/lib/ficha-engine.ts');
  const linha = eng.split('\n').find((l) => l.includes("r('Pontos de Vida'"));
  ok(linha, 'a linha de Pontos de Vida sumiu da ficha');
  if (linha) {
    ok(!/25 \+ Vigor/.test(linha),
      'a explicação do PV voltou a trazer o `25` escrito à mão: com o Halfling em Pequeno ela imprime uma conta que não fecha');
    ok(/×\$\{/.test(linha) || /linhaPV/.test(linha),
      'a explicação do PV tem de sair da linha de `porte` em uso, e não de outra cópia à mão');
  }
  ok(!/\bpv\(vig\)/.test(eng), 'a ficha voltou a chamar `pv(vig)` sem porte: a tabela deixa de ser alcançada');
  const mesa = ler('src/lib/mesa-ficha.ts');
  ok(!/\bpv\(vig\)(?!,)/.test(mesa), 'a ficha da mesa voltou a chamar `pv(vig)` sem porte');
  ok(/porteDaRaca/.test(mesa), 'a ficha da mesa tem de resolver o porte da raça antes de chamar `pv()`');
}

// ------------------------------------------- 4. o Fôlego não promete base por raça
{
  const nota = regras.derivados.folego?.nota || '';
  ok(!/base por ra[cç]a/i.test(nota),
    'a nota do Fôlego voltou a prometer base por raça, e o dado entrega um número só para as oito (`M-26`)');
  eq(regras.derivados.folego.base, 10, 'a base do Fôlego continua sendo 10, e igual para todos');
  const cap = ler('src/content/chapters/folego.md');
  ok(!/base racial/i.test(cap), 'o capítulo do Fôlego voltou a chamar a base de racial');
}

if (falhas.length) {
  console.error(`\n✘ porte-raca: ${falhas.length} falha(s)\n` + falhas.map((f) => '  · ' + f).join('\n'));
  process.exit(1);
}
console.log('✓ porte-raca: as oito raças declaram porte, o Halfling é Pequeno e chega ao `pv()`,'
  + ' a explicação da ficha sai da tabela em vez de guardar cópia à mão,'
  + ' e o Fôlego parou de prometer base por raça');
