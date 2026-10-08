// test-busca.mjs · a regra de casamento da busca do site, sem navegador e sem índice.
//
// O que está sob teste é `src/lib/busca.ts`: o MESMO módulo que o `Busca.astro` importa. O que
// depende do índice do pagefind (a busca em si e o `result.data()`) não está aqui, porque o
// índice só existe depois do build; essa parte foi provada no navegador, sobre o build, e a prova
// está na mensagem dos commits da Busca.
//
// Cada afirmação "não casa" tem o seu par: o controle negativo mostra que a mesma entrada CASA
// quando a regra é afrouxada (sem a caixa exata, sem o início de palavra), para que um teste que
// passasse por a função devolver sempre falso não passe aqui.
//
// Empacota com o esbuild pelo mesmo motivo do test-seta: o módulo é TS, e depender de como esta
// versão do Node trata TS é depender do ambiente.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const saida = path.join(os.tmpdir(), `busca-${process.pid}.mjs`);
await build({
  entryPoints: [path.join(ROOT, 'src/lib/busca.ts')],
  outfile: saida, bundle: true, format: 'esm', platform: 'node', logLevel: 'error',
});
const M = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };
const igual = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), `${msg} (veio ${JSON.stringify(a)}, esperava ${JSON.stringify(b)})`);

// ------------------------------------------------------------ o que se digita
igual(M.tokensDe('  armadura  '), ['armadura'], 'espaços em volta saem');
igual(M.tokensDe('arma armadura'), ['arma', 'armadura'], 'duas palavras');
igual(M.tokensDe('"'), [], 'só uma aspa: nenhuma palavra');
igual(M.tokensDe('"" ""'), [], 'só aspas: nenhuma palavra');
igual(M.tokensDe('!!! ???'), [], 'só pontuação: nenhuma palavra');
igual(M.tokensDe(''), [], 'termo vazio: nenhuma palavra');
igual(M.tokensDe('   '), [], 'só espaços: nenhuma palavra');
igual(M.tokensDe('"defesa contra projéteis"'), ['defesa', 'contra', 'projéteis'], 'as aspas digitadas saem');
igual(M.tokensDe('pedra-papel'), ['pedra', 'papel'], 'hífen separa');

// ------------------------------------------------------- o termo que vai ao pagefind
igual(M.termoPagefind(['arma', 'armadura'], 'palavras'), 'arma armadura', 'Palavras: o termo sem aspas');
igual(M.termoPagefind(['arma', 'armadura'], 'frase'), '"arma armadura"', 'Frase exata: o termo entre aspas');
igual(M.termoPagefind(M.tokensDe('"arma armadura"'), 'frase'), '"arma armadura"', 'aspas digitadas não duplicam');

// ------------------------------------------------------------------ o Aa
// O Aa não busca: ele confere a CAIXA das palavras que o pagefind já casou (por radical). Os
// vetores abaixo têm a forma do que `result.data()` devolve de verdade: `palavras` é o texto em
// `content.split(' ')` e `locais` são os `locations` (posições nelas). As palavras casadas são
// as que o pagefind mostrou na sonda de 08/10/2026 ("luta", "lutando.", "lutador;", "mágicos"...).
const v = (palavras, locais, digitado, modo = 'palavras') => M.filtrarCaixa(palavras, locais, M.tokensDe(digitado), modo);
// o controle negativo: a MESMA entrada com a caixa desligada à força (tudo em minúsculas)
const frouxo = (palavras, locais, digitado, modo = 'palavras') =>
  M.filtrarCaixa(palavras.map((x) => x.toLowerCase()), locais, M.tokensDe(digitado.toLowerCase()), modo);

// kael e uldun: o livro só os tem com inicial maiúscula
const k = ['O', 'Kael', 'luta', 'contra', 'o', 'Uldun.'];
ok(v(k, [1], 'Kael').ok, '"Kael" fica: a palavra casada é "Kael"');
ok(!v(k, [1], 'kael').ok, '"kael" SAI com Aa: a palavra casada tem outra caixa');
ok(frouxo(k, [1], 'kael').ok, 'controle negativo: "kael" ficaria sem a caixa exata');
ok(!v(k, [1], 'KAEL').ok, '"KAEL" SAI com Aa');
ok(v(k, [5], 'Uldun').ok && !v(k, [5], 'uldun').ok && frouxo(k, [5], 'uldun').ok, '"Uldun" fica, "uldun" sai, e ficaria sem a caixa');
igual(v(k, [1], 'Kael').aceitos, [1], 'a palavra de caixa certa é a que se destaca');
igual(v(k, [1], 'kael').aceitos, [], 'e nenhuma se destaca quando a caixa não bate');
// camelCase: o pagefind separa "exemploKael" e casa "Kael" nele
ok(v(['veja', 'exemploKael', 'abaixo'], [1], 'Kael').ok, 'camelCase: "Kael" casa dentro de "exemploKael"');
ok(!v(['veja', 'exemploKael', 'abaixo'], [1], 'kael').ok, 'camelCase: "kael" continua saindo');
// acento ignorado, caixa não
ok(v(['A', 'absorção', 'do', 'alvo'], [1], 'absorcao').ok, '"absorcao" casa com "absorção" (acento ignorado)');
ok(v(['A', 'absorção', 'do', 'alvo'], [1], 'absorção').ok, '"absorção" casa com "absorção"');
ok(!v(['A', 'Absorção', 'do', 'alvo'], [1], 'absorcao').ok, '"absorcao" SAI quando o texto só tem "Absorção"');
ok(v(['A', 'Absorção', 'do', 'alvo'], [1], 'Absorcao').ok, '"Absorcao" fica quando o texto tem "Absorção"');
ok(frouxo(['A', 'Absorção'], [1], 'absorcao').ok, 'controle negativo: "absorcao" ficaria sem a caixa exata');

// O ponto do veredito 143: o Aa NÃO pode derrubar o que o pagefind acha por radical.
// "lutando" acha "luta", "lutar", "lutador" e a caixa bate: tem de ficar (a regra antiga dava 22 -> 4).
const lut = ['A', 'luta', 'luta.', 'lutar', 'lutador;', 'lutando.', 'fim'];
const rl = v(lut, [1, 2, 3, 4, 5], 'lutando');
ok(rl.ok, '"lutando" fica quando o texto traz "luta", "lutar", "lutador" e "lutando" em minúsculas');
igual(rl.aceitos, [1, 2, 3, 4, 5], 'e todas as variações casadas se destacam');
ok(!v(['A', 'Luta', 'Luta', 'fim'], [1, 2], 'lutando').ok, '"lutando" sai quando as palavras casadas só têm inicial maiúscula');
ok(v(['A', 'Luta', 'Luta', 'fim'], [1, 2], 'Lutando').ok, '"Lutando" fica nesse mesmo texto');
ok(v(['A', 'Luta', 'e', 'luta', 'fim'], [1, 3], 'lutando').ok, 'basta UMA variação de caixa certa ("luta" depois de "Luta")');
ok(v(['ele', 'ataca', 'com', 'ataque', 'e', 'atacar'], [1, 3, 5], 'atacar').ok, '"atacar" acha "ataca", "ataque", "atacar"');
ok(v(['um', 'animal', 'e', 'dois', 'animais'], [1, 4], 'animais').ok, '"animais" acha "animal" e "animais"');
ok(v(['a', 'mágica,', 'os', 'mágicos', 'e', 'a', 'magia'], [1, 3, 6], 'magia').ok, '"magia" acha "mágica", "mágicos", "magia" (acento e radical)');
ok(!v(['a', 'Magia', 'e', 'Magnitude'], [1, 3], 'magia').ok, '"magia" sai quando só há "Magia" e "Magnitude"');
ok(v(['a', 'Magia', 'e', 'Magnitude'], [1, 3], 'Magia').ok, '"Magia" fica nesse texto');
// plural digitado e flexão: a caixa só se compara onde as duas palavras começam iguais
ok(v(['A', 'armadura', 'pesada'], [1], 'armaduras').ok, 'plural digitado acha o singular do texto');
ok(!v(['A', 'Armadura', 'pesada'], [1], 'armaduras').ok, 'plural digitado em minúsculas sai se o texto tem "Armadura"');
// várias palavras: cada uma precisa da sua
ok(v(k, [1, 5], 'Kael Uldun').ok, 'duas palavras de caixa certa ficam');
ok(!v(k, [1, 5], 'Kael uldun').ok, 'uma das duas com a caixa errada derruba o resultado');
// o que não dá para conferir passa (a regra é só "menos os de outra caixa")
const nv = v(['xyz', 'abc'], [0], 'kael');
ok(nv.ok && nv.neutros === 1 && nv.aceitos.length === 0, 'palavra casada sem parentesco com o digitado: não há o que conferir, passa e é contada');
ok(v(k, [], 'kael').ok, 'sem posições nenhuma, passa');
ok(v(k, [99, -1], 'kael').ok, 'posições fora do texto são ignoradas');
ok(v(k, [1], '').ok && v(k, [1], '"').ok, 'sem palavras digitadas (vazio, só aspas), o filtro não derruba nada');

// frase exata: sequência de palavras consecutivas, cada uma com a caixa certa
const fr = ['+3', 'na', 'Defesa', 'contra', 'projéteis.', 'A', 'Interação'];
ok(v(fr, [2, 3, 4], 'Defesa contra projéteis', 'frase').ok, 'frase com a caixa do texto fica');
ok(v(fr, [2, 3, 4], 'Defesa contra projeteis', 'frase').ok, 'frase sem acento fica');
ok(!v(fr, [2, 3, 4], 'defesa contra projéteis', 'frase').ok, 'frase com a caixa trocada SAI com Aa');
ok(frouxo(fr, [2, 3, 4], 'defesa contra projéteis', 'frase').ok, 'controle negativo: ficaria sem a caixa exata');
igual(v(fr, [2, 3, 4], 'Defesa contra projéteis', 'frase').aceitos, [2, 3, 4], 'a frase inteira se destaca');
ok(v(['x', 'Defesa', 'a', 'Defesa', 'contra', 'projéteis'], [1, 3, 4, 5], 'defesa contra projéteis', 'frase').ok === false, 'frase: a sequência é que conta, e uma "Defesa" solta antes não salva a de caixa errada');
ok(v(['x', 'Defesa', 'a', 'defesa', 'contra', 'projéteis'], [1, 3, 4, 5], 'defesa contra projéteis', 'frase').ok, 'frase: uma das ocorrências com a caixa certa basta');
ok(v(fr, [2, 4], 'Defesa contra projéteis', 'frase').ok, 'frase sem sequência completa nas posições: não há o que conferir, passa');

// ------------------------------------------------------------- o destaque
const pal = ['A', 'luta <b>', 'do', 'Kael', '&', 'fim'];
igual(M.trechoDe(pal, [3], 3, 10, 10), 'A luta &lt;b&gt; do <mark>Kael</mark> &amp; fim', 'destaque só nas palavras marcadas, com o HTML escapado');
const longa = Array.from({ length: 100 }, (_, i) => (i === 50 ? 'Kael' : 'p' + i));
const jan = M.trechoDe(longa, [50], 50, 5, 5);
ok(jan.startsWith('… ') && jan.endsWith(' …') && jan.includes('<mark>Kael</mark>') && jan.split(' ').length < 20, 'a janela recorta ao redor do achado, com reticências');
ok(M.trechoDe(['só', 'isto'], [], 0, 5, 5) === 'só isto', 'sem marcação nem corte, o texto sai como está');

if (falhas.length) {
  console.error(`✘ test-busca: ${falhas.length} falha(s)`);
  for (const f of falhas) console.error('  · ' + f);
  process.exit(1);
}
console.log('✓ test-busca · a regra da busca (palavras, frase exata, Aa por caixa sobre o que o pagefind casou, radical, acento, camelCase, termo vazio, só aspas, destaque)');
