// test-reapontar.mjs · o `reapontar.mjs` grava a linha onde a âncora ESTÁ, dentro da janela.
//
// Roda o script de verdade, num repositório de mentira montado numa pasta descartável: um
// arquivo de código, um documento com citações, e o `test-procedencia.mjs` reduzido ao `ALVOS`
// que a conferência de cobertura lê. Nada do repositório real é lido nem escrito.
//
// Os três sentidos (rodada 93), sobre uma citação que nasceu UMA LINHA FORA:
//   1. com o diff deslocando o arquivo, ela sai na linha da âncora, e não torta como entrou;
//   2. no `--tudo`, sem diff nenhum, ela é endireitada do mesmo jeito;
//   3. a citação que já estava certa não sai do lugar, nos dois modos.
// E um quarto, que é o `L65`: âncora repetida na janela não é escolhida por proximidade.
//
//   node scripts/test-reapontar.mjs                     · contra o scripts/reapontar.mjs
//   node scripts/test-reapontar.mjs --script <arquivo>  · contra outra versão (controle negativo)
//
// Roda no `npm run validate`.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const iScript = process.argv.indexOf('--script');
const SCRIPT = path.resolve(iScript > 0 ? process.argv[iScript + 1] : path.join(RAIZ, 'scripts/reapontar.mjs'));

let falhas = 0;
const eq = (veio, esperado, rotulo) => {
  if (veio === esperado) console.log(`  ✓ ${rotulo}`);
  else { falhas += 1; console.log(`  ✗ ${rotulo}\n      esperado ${esperado}\n      veio     ${veio}`); }
};

// O código citado. A âncora `pegarAlvo` está na linha 6; `outraCoisa` na 9; `repetida` em 12 e 14.
const CODIGO = [
  '// cabeçalho', '', 'const a = 1;', 'const b = 2;', '',
  'function pegarAlvo() {', '  return a;', '}',
  'function outraCoisa() {', '  return b;', '}',
  'const repetida = 1;', '// entre as duas', 'const repetida2 = repetida;', '',
].join('\n');
// A citação torta aponta 7 (a âncora está em 6); a certa aponta 9; a ambígua aponta 13, e a
// âncora `repetida` está em 12 e em 14, nenhuma na 13.
const DOC = [
  '# Estado',
  '',
  'O alvo está em `src/lib/alvo.ts:7` (`pegarAlvo`).',
  'A outra está em `src/lib/alvo.ts:9` (`outraCoisa`).',
  'A repetida está em `src/lib/alvo.ts:13` (`repetida`).',
  '',
].join('\n');

// O AMBIENTE LIMPO, e ele não é enfeite: dentro do `pre-commit` o processo nasce com `GIT_DIR` e
// `GIT_WORK_TREE` apontando para o repositório REAL, e eles vencem o `cwd`. Na rodada 93, a primeira
// versão deste teste rodou no gancho sem isto, e o `git init` + `git config` "da árvore de mentira"
// gravaram `core.worktree` (uma pasta que logo sumiu) e `core.autocrlf` na `.git/config` real, e
// todo `git` do projeto passou a olhar para uma árvore que não existia. Mesma armadilha que o
// `test-rodada.mjs` já documenta (L73). O script testado também roda `git`, e recebe o mesmo
// ambiente.
const ENV_LIMPO = { ...process.env };
for (const k of Object.keys(ENV_LIMPO)) if (/^GIT_/.test(k) && k !== 'GIT_EDITOR') delete ENV_LIMPO[k];

// A configuração do repositório onde o teste foi CHAMADO, lida pelo ambiente de quem chamou (dentro
// do gancho, é a `.git/config` real). Tirada antes e comparada no fim.
const configDeFora = () => {
  try { return execFileSync('git', ['config', '--local', '--list'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }); }
  catch { return '(fora de um repositório)'; }
};
const CONFIG_ANTES = configDeFora();

function montar() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reapontar-'));
  const git = (...a) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'core.autocrlf=false', ...a],
    { cwd: dir, encoding: 'utf8', env: ENV_LIMPO });
  git('init', '-q');
  git('config', 'core.autocrlf', 'false');   // o `git diff` do próprio script também roda aqui
  fs.mkdirSync(path.join(dir, 'src/lib'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'docs/simulacao'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'src/lib/alvo.ts'), CODIGO);
  fs.writeFileSync(path.join(dir, 'docs/simulacao/ESTADO.md'), DOC);
  fs.writeFileSync(path.join(dir, 'scripts/test-procedencia.mjs'), "const ALVOS = [\n  'ESTADO.md',\n];\n");
  git('add', '-A');
  git('commit', '-q', '-m', 'base');
  return dir;
}
const rodar = (dir, ...args) => execFileSync(process.execPath, [SCRIPT, ...args], { cwd: dir, encoding: 'utf8', env: ENV_LIMPO });
const citacoes = (dir) => [...fs.readFileSync(path.join(dir, 'docs/simulacao/ESTADO.md'), 'utf8')
  .matchAll(/alvo\.ts:(\d+)/g)].map((m) => m[1]).join(' ');

// ---- com diff: duas linhas entram no topo, e tudo desce 2
{
  console.log('com diff (duas linhas novas no topo do arquivo citado):');
  const dir = montar();
  fs.writeFileSync(path.join(dir, 'src/lib/alvo.ts'), `// nova 1\n// nova 2\n${CODIGO}`);
  rodar(dir);
  const [torta, certa, ambigua] = citacoes(dir).split(' ');
  eq(torta, '8', 'a citação torta (7, âncora em 6) sai na linha da âncora (6 + 2 = 8), e não em 9');
  eq(certa, '11', 'a citação certa só anda o deslocamento (9 + 2 = 11)');
  eq(ambigua, '15', 'a ambígua anda o deslocamento e não é endireitada por proximidade (13 + 2 = 15)');
  fs.rmSync(dir, { recursive: true, force: true });
}

// ---- sem diff, no --tudo: só o que está torto muda
{
  console.log('sem diff, com --tudo:');
  const dir = montar();
  rodar(dir, '--tudo');
  eq(citacoes(dir), '6 9 13', 'a torta vai de 7 para 6; a certa (9) e a ambígua (13) ficam');
  // E rodar de novo não mexe em nada: o que está certo continua certo.
  rodar(dir, '--tudo');
  eq(citacoes(dir), '6 9 13', 'uma segunda passada não move nada');
  fs.rmSync(dir, { recursive: true, force: true });
}

// ---- sem diff e sem --tudo: o modo de sempre não toca em arquivo que não mudou
{
  console.log('sem diff, sem --tudo:');
  const dir = montar();
  rodar(dir);
  eq(citacoes(dir), '7 9 13', 'sem diff e sem --tudo, nada muda');
  fs.rmSync(dir, { recursive: true, force: true });
}

// ---- e o repositório de quem roda o teste não pode ter mudado de configuração
{
  console.log('o repositório de verdade:');
  eq(configDeFora(), CONFIG_ANTES, 'a .git/config de quem rodou o teste está como estava');
}

if (falhas) {
  console.log(`\n✘ reapontar FALHOU (${falhas})`);
  process.exit(1);
}
console.log('\n✓ reapontar OK · a citação torta vai para a linha da âncora, a certa fica, a ambígua não é escolhida');
