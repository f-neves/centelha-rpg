// mapa-cobertura.mjs · que módulos de `src/lib` estão dentro de algum teste, e
// quais estão fora e mesmo assim rodam na mesa.
//
// POR QUE ELE EXISTE
//
// Em 04/09 um conserto foi commitado desligado e nada acusou. O motivo não era
// falta de teste: era o teste empacotar o arquivo ERRADO. O
// `test-artes-grid.mjs` empacota `artes-grid.ts`, o conserto morava em
// `artes-grid-mesa.ts`, e reverter o segundo inteiro deixava o `npm run
// validate` verde.
//
// A pergunta que aquilo abriu não é "faltou um teste", é **quais outros arquivos
// estão na mesma situação**. Este script responde, e responde de forma que não
// envelhece: em vez de uma lista escrita à mão, ele PERGUNTA AO EMPACOTADOR quais
// arquivos entram em cada teste, pelo `metafile` do esbuild, que é o mesmo
// mecanismo que resolve os imports de verdade.
//
// O QUE ELE NÃO DIZ, e a distinção decide como se lê a saída:
//
//   · estar DENTRO de um pacote não quer dizer estar testado. Quer dizer que ele
//     foi compilado junto e que uma asserção PODE alcançá-lo. É condição
//     necessária, não suficiente;
//   · estar FORA não quer dizer intocado: o smoke do navegador (`test-grid`,
//     `test-espelho`, `test-golpe-caido`) carrega o Grid de verdade e passa por
//     um monte de coisa que nenhum pacote de Node vê. Por isso a saída separa as
//     três situações em vez de duas.
//
//   node scripts/mapa-cobertura.mjs          # o mapa
//   node scripts/mapa-cobertura.mjs --lista  # só os nomes dos descobertos
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const LIB = path.join(ROOT, 'src/lib');
const rel = (p) => p.replace(/\\/g, '/').replace(/^.*?src\//, 'src/');

/**
 * Os pacotes de teste, lidos como o Node os monta.
 *
 * A lista é escrita à mão de propósito, e é a única parte que envelhece: um teste
 * novo com pacote novo tem de entrar aqui. Deduzi-la dos arquivos exigiria
 * interpretar JavaScript, e um mapa que erra em silêncio é pior que um que pede
 * uma linha.
 */
const PACOTES = [
  ['test-acaso', ['acaso', 'rolagem', 'artes-grid', 'mesa-bestiario']],
  ['test-artes-grid', ['artes-grid', 'artes-3d']],
  ['test-arte-na-mesa', ['artes-grid-mesa', 'artes-grid']],
  ['test-bandeiras', ['bandeiras']],
  ['test-combate-tempo', ['alcance', 'combate-tempo']],
  ['test-contrato', ['combate-resumo', 'equip', 'mesa-ficha']],
  ['test-quase-acerto', ['quase-acerto']],
  ['test-simultaneo', ['combate-tempo', 'hex']],
  ['test-golpe', ['grid-golpe-fx', 'equip']],
  ['test-lance', ['lance', 'acaso', 'combate-tempo']],
  ['test-peca-cena', ['mesa-bestiario']],
  ['test-seta', ['seta']],
  ['sim/lib-ponte', ['combate-tempo', 'hex', 'alcance', 'lance', 'quase-acerto',
    'combate-resumo', 'mesa-core', 'calc', 'acaso', 'rolagem', 'bandeiras']],
];

/**
 * O que o smoke do navegador carrega de verdade.
 *
 * Não sai de empacotamento: sai de o Astro montar a página e o Edge executá-la.
 * A lista é o que a aba `/mesa/grid` importa, direta ou transitivamente, e ela é
 * conferida abaixo contra o pacote da própria página.
 */
const PAGINAS_DO_SMOKE = ['src/pages/mesa/grid.astro'];

const alcancados = new Map();   // arquivo → [testes que o empacotam]
for (const [nome, mods] of PACOTES) {
  const saida = path.join(os.tmpdir(), `mapa-${process.pid}-${nome.replace(/\W/g, '_')}.mjs`);
  const r = await build({
    stdin: {
      contents: mods.map((m) => `export * from './src/lib/${m}';`).join('\n'),
      resolveDir: ROOT, loader: 'ts',
    },
    outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'silent', metafile: true,
    define: { 'import.meta.env': 'globalThis.__ENV__' },
  });
  fs.rmSync(saida, { force: true });
  for (const entrada of Object.keys(r.metafile.inputs)) {
    if (!/src[\\/]lib[\\/].*\.ts$/.test(entrada)) continue;
    const k = rel(path.resolve(ROOT, entrada));
    if (!alcancados.has(k)) alcancados.set(k, []);
    alcancados.get(k).push(nome);
  }
}

// O que a PÁGINA do Grid arrasta, que é o que o smoke do navegador exercita.
const doSmoke = new Set();
for (const pag of PAGINAS_DO_SMOKE) {
  const fonte = fs.readFileSync(path.join(ROOT, pag), 'utf8');
  // Os imports do bloco `<script>` da página, que é o que vira JavaScript do
  // cliente. Basta o primeiro nível: o esbuild resolve o resto abaixo.
  const diretos = [...fonte.matchAll(/from '\.\.\/\.\.\/lib\/([\w-]+)'/g)].map((m) => m[1]);
  if (!diretos.length) continue;
  const saida = path.join(os.tmpdir(), `mapa-pag-${process.pid}.mjs`);
  const r = await build({
    stdin: {
      contents: diretos.map((m) => `export * from './src/lib/${m}';`).join('\n'),
      resolveDir: ROOT, loader: 'ts',
    },
    outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'silent', metafile: true,
    define: { 'import.meta.env': 'globalThis.__ENV__' },
  });
  fs.rmSync(saida, { force: true });
  for (const entrada of Object.keys(r.metafile.inputs)) {
    if (/src[\\/]lib[\\/].*\.ts$/.test(entrada)) doSmoke.add(rel(path.resolve(ROOT, entrada)));
  }
}

const todos = fs.readdirSync(LIB).filter((f) => f.endsWith('.ts')).map((f) => `src/lib/${f}`).sort();
const kb = (f) => (fs.statSync(path.join(ROOT, f)).size / 1024).toFixed(0);

const dentro = todos.filter((f) => alcancados.has(f));
const soSmoke = todos.filter((f) => !alcancados.has(f) && doSmoke.has(f));
const fora = todos.filter((f) => !alcancados.has(f) && !doSmoke.has(f));

if (process.argv.includes('--lista')) {
  for (const f of [...soSmoke, ...fora]) console.log(f);
  process.exit(0);
}

console.log(`\n${todos.length} módulos em src/lib\n`);
console.log(`■ ${dentro.length} DENTRO de algum pacote de teste`);
for (const f of dentro) console.log(`   ${kb(f).padStart(4)} KB  ${f.padEnd(30)} ${alcancados.get(f).join(', ')}`);
console.log(`\n■ ${soSmoke.length} FORA dos pacotes, exercitados só pelo smoke do navegador`);
for (const f of soSmoke) console.log(`   ${kb(f).padStart(4)} KB  ${f}`);
console.log(`\n■ ${fora.length} FORA de tudo, e alcançáveis em produção`);
for (const f of fora) console.log(`   ${kb(f).padStart(4)} KB  ${f}`);
console.log(`\nDentro de um pacote NÃO quer dizer testado: quer dizer que uma asserção pode alcançá-lo.`);
