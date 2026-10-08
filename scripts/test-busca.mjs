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
const TEXTO = 'Kael luta contra o Uldun. O exemploKael aparece. Defesa contra projéteis: +3. A absorção do alvo. '
  + 'A armadura pesada e as armaduras leves. Lutando, ele luta.';
const casa = (digitado, modo, texto = TEXTO) => M.contem(texto, M.padroes(M.tokensDe(digitado), modo), true);
const solto = (digitado, modo, texto = TEXTO) => // o mesmo padrão com a caixa afrouxada: o controle negativo
  M.padroes(M.tokensDe(digitado), modo).some((re) => new RegExp(re.source, 'giu').test(M.norm(texto).s));

// só com inicial maiúscula: kael e uldun
ok(casa('Kael', 'palavras'), '"Kael" casa com o texto que traz "Kael"');
ok(!casa('kael', 'palavras'), '"kael" NÃO casa com Aa (o texto só tem "Kael")');
ok(solto('kael', 'palavras'), 'controle negativo: "kael" casaria sem a caixa exata');
ok(!casa('KAEL', 'palavras'), '"KAEL" NÃO casa com Aa');
ok(casa('Uldun', 'palavras') && !casa('uldun', 'palavras') && solto('uldun', 'palavras'), '"Uldun" casa, "uldun" não, e casaria sem a caixa');
// a emenda de camelCase (o pagefind separa "exemploKael")
ok(casa('Kael', 'palavras', 'veja exemploKael abaixo'), 'camelCase: "Kael" casa dentro de "exemploKael"');
ok(!casa('kael', 'palavras', 'veja exemploKael abaixo'), 'camelCase: "kael" continua não casando');
// início de palavra
ok(!casa('rmadura', 'palavras'), 'meio de palavra NÃO casa ("rmadura")');
ok(casa('armad', 'palavras'), 'o começo de uma palavra casa ("armad" acha "armadura")');
// acento ignorado, caixa não
ok(casa('absorcao', 'palavras'), '"absorcao" casa com "absorção" (acento ignorado)');
ok(casa('absorção', 'palavras'), '"absorção" casa com "absorção"');
ok(!casa('Absorcao', 'palavras'), '"Absorcao" NÃO casa: o texto tem "absorção" minúsculo');
ok(solto('Absorcao', 'palavras'), 'controle negativo: "Absorcao" casaria sem a caixa exata');
// plural digitado acha o singular
ok(casa('armaduras', 'palavras', 'A armadura pesada.'), 'plural digitado casa com o singular do texto');
ok(casa('armadura', 'palavras', 'As armaduras leves.'), 'singular digitado casa com o plural do texto (início de palavra)');
// várias palavras: todas têm de aparecer
ok(casa('Kael Uldun', 'palavras'), 'duas palavras presentes casam');
ok(!casa('Kael Balkor', 'palavras'), 'uma das duas ausente NÃO casa');
// frase exata
ok(casa('Defesa contra projéteis', 'frase'), 'frase na ordem do texto casa');
ok(casa('Defesa contra projeteis', 'frase'), 'frase sem acento casa');
ok(!casa('projéteis contra Defesa', 'frase'), 'frase em ordem trocada NÃO casa');
ok(!casa('defesa contra projéteis', 'frase'), 'frase com a caixa trocada NÃO casa com Aa');
ok(solto('defesa contra projéteis', 'frase'), 'controle negativo: a frase em minúsculas casaria sem a caixa exata');
ok(casa('contra o Uldun', 'frase'), 'frase com palavra de ligação casa');
ok(!casa('Kael Uldun', 'frase'), 'duas palavras que existem mas não em sequência NÃO casam como frase');
ok(casa('Kael Uldun', 'palavras'), 'e as mesmas duas palavras casam no modo Palavras');
ok(casa('A absorção do alvo', 'frase'), 'frase atravessa a pontuação do texto');
ok(casa('Defesa contra', 'frase', 'Defesa, contra tudo'), 'a pontuação entre as palavras da frase não a quebra');

// ------------------------------------------------------------- o destaque
const marcado = M.realcar('Kael e kael e <b>Kael</b>', M.padroes(['Kael'], 'palavras'), false);
ok(marcado === '<mark>Kael</mark> e kael e &lt;b&gt;<mark>Kael</mark>&lt;/b&gt;', `destaque só na caixa exata e com o HTML escapado (veio ${marcado})`);
const longo = 'palavra '.repeat(60) + 'Kael ' + 'palavra '.repeat(60);
const janela = M.realcar(longo, M.padroes(['Kael'], 'palavras'), true);
ok(janela.startsWith('… ') && janela.endsWith(' …') && janela.includes('<mark>Kael</mark>') && janela.length < 400, 'a janela recorta ao redor do achado, com reticências');
ok(M.realcar('sem nada', M.padroes(['Kael'], 'palavras'), true) === 'sem nada', 'sem achado, o texto sai como está');

if (falhas.length) {
  console.error(`✘ test-busca: ${falhas.length} falha(s)`);
  for (const f of falhas) console.error('  · ' + f);
  process.exit(1);
}
console.log('✓ test-busca · a regra de casamento da busca (palavras, frase exata, Aa, acento, camelCase, termo vazio, só aspas, destaque)');
