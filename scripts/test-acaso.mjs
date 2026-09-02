// test-acaso.mjs · a fonte de acaso do combate, provada sem navegador.
//
// O `test-etapa0.mjs` dirige o Edge e prova a semente pelo caminho da
// INICIATIVA. Isso cobre o `d6` do `rolagem.ts`, mas deixava dois lugares
// provados só por leitura de código: o `rolarExpr` (que é por onde sai todo
// dano e todo bolo de ataque) e o `rolar` das Artes, que era uma segunda fonte
// de acaso com `Math.random` próprio.
//
// Aqui os quatro são exercitados de verdade, em Node, em segundos, dentro do
// `npm run validate`. E há uma quinta asserção que é a mais importante das
// cinco: uma VARREDURA que falha se aparecer um `Math.random` novo no caminho
// do combate. É ela que impede a próxima fonte de acaso de entrar em silêncio,
// que foi exatamente o que aconteceu com o `rolar` das Artes.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

// UM pacote só, e isto não é detalhe: bundles separados levariam cada um a sua
// cópia do estado do `acaso.ts`, e semear um não afetaria o outro. O teste
// passaria medindo quatro módulos que não conversam.
const saida = path.join(os.tmpdir(), `acaso-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export { semear, semeadoDe, semeado } from './src/lib/acaso';
      export { d6, rolarExpr } from './src/lib/rolagem';
      export { rolar } from './src/lib/artes-grid';
      export { iniDeMonstro } from './src/lib/mesa-bestiario';
    `,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
  // O `mesa-bestiario` arrasta o cliente do Supabase, que lê `import.meta.env`
  // no topo do módulo. Fora do Astro isso não existe, e o pacote quebra ao
  // carregar, antes de qualquer asserção.
  define: { 'import.meta.env': 'globalThis.__ENV__' },
});
// O `import.meta.env` é do Astro e não existe em Node. Apontá-lo para um objeto
// vazio no global é o suficiente: nada aqui usa Supabase, só é arrastado pelo
// `mesa-bestiario`, que importa o cliente no topo.
globalThis.__ENV__ = { BASE_URL: '/', MODE: 'test' };
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

/** Uma passada por TODAS as fontes de acaso do combate, na mesma ordem. */
const bicho = { combate: { iniciativa: '1d6 + 4' } };
const passada = () => [
  M.d6(), M.d6(),
  M.rolarExpr('4d6 +2').rolls.join(','),
  M.rolarExpr('3d6 −1').total,
  M.rolar(5).dados.join(','),
  M.rolar(3, 6).total,
  M.iniDeMonstro(bicho),
].join('|');

console.log('\n· o acaso do combate: um ponto de injeção, quatro caminhos');

// ---- 1: a mesma semente repete, nos quatro caminhos ----
M.semear(M.semeadoDe(1234));
ok(M.semeado(), 'semear troca a fonte, e o módulo sabe disso');
const a = passada();
M.semear(M.semeadoDe(1234));
const b = passada();
ok(a === b, `a mesma semente repete a passada inteira (${a.slice(0, 40)}…)`);

// ---- 2: cada caminho de fato rola ----
M.semear(M.semeadoDe(1234));
const partes = a.split('|');
ok(partes[0] !== partes[1] || Number(partes[0]) >= 1, `o d6 devolve dado (${partes[0]}, ${partes[1]})`);
ok(partes[2].split(',').length === 4, `o rolarExpr rola os 4 dados de "4d6 +2" (${partes[2]})`);
ok(partes[4].split(',').length === 5, `o rolar das Artes rola os 5 pedidos (${partes[4]})`);
ok(Number(partes[6]) >= 5 && Number(partes[6]) <= 10, `o iniDeMonstro soma 1d6 ao fixo 4 (${partes[6]})`);

// ---- 3: semente diferente, passada diferente ----
M.semear(M.semeadoDe(99));
ok(passada() !== a, 'uma semente diferente dá outra passada: os quatro caminhos rolam de verdade');

// ---- 4: cada caminho individualmente atrelado à semente ----
// Sem isto, bastaria UM dos quatro estar plugado para o item 3 passar.
// Cada um roda DEZ vezes: um dado só tem seis faces, e comparar uma rolagem de
// duas sementes falha por coincidência uma vez em seis. Dez em sequência tornam
// o encontro por acaso desprezível sem tornar o teste lento.
const dez = (f) => Array.from({ length: 10 }, f).join(',');
for (const [nome, f] of [
  ['d6', () => M.d6()],
  ['rolarExpr', () => M.rolarExpr('6d6').rolls.join('')],
  ['rolar (Artes)', () => M.rolar(6).dados.join('')],
  ['iniDeMonstro', () => M.iniDeMonstro(bicho)],
]) {
  M.semear(M.semeadoDe(7)); const x = dez(f);
  M.semear(M.semeadoDe(7)); const y = dez(f);
  M.semear(M.semeadoDe(8)); const z = dez(f);
  ok(x === y && x !== z, `${nome} passa pelo ponto de injeção (mesma semente ${x.slice(0, 22)}…, outra ${z.slice(0, 22)}…)`);
}

// ---- 5: sem semente, volta a ser aleatório ----
M.semear(null);
ok(!M.semeado(), 'semear(null) devolve o Math.random');
const l1 = passada(), l2 = passada();
ok(l1 !== l2, 'e sem semente duas passadas diferem: a mesa de verdade segue aleatória');

// ---- 6: A VARREDURA. Nenhuma fonte de acaso nova no caminho do combate ----
// O `rolar` das Artes era uma segunda fonte com `Math.random` próprio, e ficou
// anos sem ninguém notar. Esta lista é a autorização explícita: quem acrescentar
// um `Math.random` em `src/lib` tem de vir aqui dizer por que ele não é combate.
const PERMITIDOS = {
  'src/lib/acaso.ts': 3,                        // o ponto de injeção: o padrão, a volta e a comparação
  'src/lib/ficha-engine.ts': 1,                 // id de peça na ficha
  'src/lib/mesa-core.ts': 1,                    // id, quando não há crypto.randomUUID
  'src/lib/mesa-tempo-real.ts': 1,              // chave de presença do canal
  // O rolador de mão, que o jogador aperta. Não é motor: o Grid não o usa
  // (`/mesa/grid` não o importa), e o harness nunca vai passar por ele. Se um
  // dia ele for ligado à resolução, esta linha é o lugar de descobrir.
  'src/components/RoladorDados.astro': 1,
};
// A VARREDURA OLHA `src/lib`, `src/pages` E `src/components`, e não só o
// primeiro. A segunda fonte de acaso que passou despercebida estava em
// `src/lib`, que é a parte arrumada; a resolução do combate mora em
// `grid.astro`, que é `src/pages`. Varrer só a parte arrumada era procurar a
// chave debaixo do poste.
const arquivos = [];
for (const raiz of ['src/lib', 'src/pages', 'src/components']) {
  const pilha = [path.join(ROOT, raiz)];
  while (pilha.length) {
    const dir = pilha.pop();
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const cheio = path.join(dir, e.name);
      if (e.isDirectory()) pilha.push(cheio);
      else if (/\.(ts|astro)$/.test(e.name)) arquivos.push(cheio);
    }
  }
}
const intrusos = [];
for (const cheio of arquivos) {
  const f = path.relative(ROOT, cheio).split(path.sep).join('/');
  // Sem comentários: a palavra aparece em prosa em quase todo arquivo que fala
  // do assunto, e contar prosa faria a varredura gritar por nada. E conta a
  // MENÇÃO, não a chamada: `Math.random` passado como valor (que é como o
  // `acaso.ts` guarda o padrão) é uma fonte tanto quanto `Math.random()`.
  const txt = fs.readFileSync(cheio, 'utf8')
    // O `\r` sai antes de tudo: o repositório é CRLF, e `.` não casa com ele,
    // então `//.*$` parava antes do fim da linha e o comentário sobrevivia.
    .replace(/\r/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n').map((l) => l.replace(/(^|\s)\/\/.*$/, '')).join('\n');
  const n = (txt.match(/Math\.random/g) || []).length;
  if (n !== (PERMITIDOS[f] || 0)) intrusos.push(`${f}: ${n} (esperado ${PERMITIDOS[f] || 0})`);
}
ok(intrusos.length === 0, `nenhuma fonte de acaso nova em ${arquivos.length} arquivos de src/lib, src/pages e src/components (${intrusos.join(' · ') || 'nenhuma'})`);

console.log(`\n${FALHAS.length ? '✗' : '✓'} Acaso do combate OK · ${PASSOU} asserções · o d6, o rolarExpr, o rolar das Artes e a iniciativa de criatura saem todos do mesmo ponto de injeção`);
if (FALHAS.length) { FALHAS.forEach((f) => console.log('  · ' + f)); process.exit(1); }
