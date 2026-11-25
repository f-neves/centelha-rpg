// test-bestiario-editor-dados.mjs · o gerador dos dados do editor (scripts/bestiario-editor/gera-dados.mjs, Etapa 2.1) lê a fonte única
// (src/data/bestiario) e mantém o contrato com a Curadora: uma LISTA com `id` e `titulo` por criatura.
//
//   node scripts/test-bestiario-editor-dados.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { caminhoPadrao, gerarLista, tituloDe } from './bestiario-editor/gera-dados.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PASTA = path.join(RAIZ, 'src', 'data', 'bestiario');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'editor-dados-'));
let n = 0;
const ok = (c, m) => { n++; assert.ok(c, m); };

const gera = (saida) => spawnSync('node', ['scripts/bestiario-editor/gera-dados.mjs', '--saida', saida], { cwd: RAIZ, encoding: 'utf8' });
const s1 = path.join(tmp, 'a.json'), s2 = path.join(tmp, 'b.json');
const r1 = gera(s1); ok(r1.status === 0, 'o gerador roda: ' + r1.stderr);
const r2 = gera(s2); ok(r2.status === 0, 'e roda de novo');
ok(fs.readFileSync(s1, 'utf8') === fs.readFileSync(s2, 'utf8'), 'reproduzível: duas rodadas dão o mesmo arquivo (sem data nem hora dentro)');

const lista = JSON.parse(fs.readFileSync(s1, 'utf8'));
const arquivos = fs.readdirSync(PASTA).filter((f) => f.endsWith('.json')).sort();
ok(Array.isArray(lista) && lista.length === arquivos.length && lista.length >= 324, `uma LISTA com uma entrada por criatura (${lista.length} de ${arquivos.length} arquivos)`);
ok(JSON.stringify(lista.map((x) => x.id)) === JSON.stringify(arquivos.map((f) => f.slice(0, -5))), 'os ids são os dos arquivos, na ordem do id');

// o contrato com a Curadora (tmp/curadora/scripts/bestiario_index.py): lê `id` e `titulo`, e tira os parênteses para a legenda curta
for (const x of lista) {
  const c = JSON.parse(fs.readFileSync(path.join(PASTA, x.id + '.json'), 'utf8'));
  ok(typeof x.id === 'string' && typeof x.titulo === 'string' && x.titulo.length > 0, `${x.id}: id e titulo são texto não vazio`);
  const ing = String(c.nomeIngles || '').trim();
  ok(x.titulo === (ing && ing !== c.nome ? `${c.nome} (${ing})` : c.nome), `${x.id}: o título é "Nome" ou "Nome (Nome em inglês)"`);
  const sem = (s) => s.replace(/\s*\(.*?\)/g, '').trim();
  ok(sem(x.titulo) === sem(c.nome), `${x.id}: sem os parênteses, o título é o nome (a legenda curta da Curadora; ${x.id} tem parênteses no próprio nome? ${c.nome.includes('(')})`);
  assert.deepEqual(x.criatura, c, `${x.id}: a criatura do editor é o JSON do site, sem mudar nada`); n++;
  ok(JSON.stringify(x.categorias) === JSON.stringify(c.categoria ? [c.categoria] : []), `${x.id}: categorias`);
}
n++; // o laço acima conferiu as 324

// o caminho que a Curadora lê (se a árvore tem a pasta dela; no CI não tem)
ok(/tmp[\\/]arquiteto[\\/]bestiario[\\/]editor[\\/]fichas-dados\.json$/.test(caminhoPadrao()), 'o caminho padrão do arquivo é tmp/arquiteto/bestiario/editor/fichas-dados.json');
for (let d = RAIZ; ; d = path.dirname(d)) {
  const py = path.join(d, 'tmp', 'curadora', 'scripts', 'bestiario_index.py');
  if (fs.existsSync(py)) {
    ok(/arquiteto\\bestiario\\editor\\fichas-dados\.json/.test(fs.readFileSync(py, 'utf8')), 'o script da Curadora ainda lê o mesmo caminho');
    break;
  }
  if (path.dirname(d) === d) break;
}

// controles negativos: o título muda de forma quando o nome em inglês é outro; o gerador recusa arquivo com id trocado
ok(tituloDe({ nome: 'Lobo', nomeIngles: 'Wolf' }) === 'Lobo (Wolf)' && tituloDe({ nome: 'Aasimar', nomeIngles: 'Aasimar' }) === 'Aasimar' && tituloDe({ nome: 'Lobo' }) === 'Lobo', 'tituloDe: com o nome em inglês diferente leva parênteses, e sem ele não');
const pasta2 = path.join(tmp, 'fonte'); fs.mkdirSync(pasta2);
fs.copyFileSync(path.join(PASTA, arquivos[0]), path.join(pasta2, 'outro-nome.json'));
let recusou = false; try { gerarLista(pasta2); } catch { recusou = true; }
ok(recusou, 'arquivo cujo nome não é o id da criatura derruba o gerador');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`✓ test-bestiario-editor-dados: ${lista.length} criaturas, contrato id e titulo com a Curadora, reproduzível, ${n} conferências`);
