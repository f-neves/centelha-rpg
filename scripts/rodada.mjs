// rodada.mjs · abre e envia o aviso da executora à revisora.
//
// A caixa (`docs/simulacao/caixa/`) é o único canal entre as duas instâncias, e
// este script existe para que o aviso não dependa de eu lembrar do formato nem
// do número da vez. Ver o README de lá.
//
//   npm run rodada             · cria o NN-executora.md, com o sha do HEAD dentro
//   npm run rodada -- --enviar · commita o aviso preenchido e diz o sha final
//
// A ÁRVORE TEM DE ESTAR LIMPA quando a rodada abre, e o motivo é o mesmo do
// resto: o aviso aponta um sha e a revisora dá checkout NELE. O que não estiver
// commitado não existe para ela, e a defasagem nasceria na primeira linha.
//
// O COMMIT DO AVISO E O COMMIT DO CÓDIGO SÃO DOIS, E ISSO É DE PROPÓSITO. Um
// commit não pode conter o próprio sha, então o aviso escrito ANTES de ser
// commitado só sabe o sha do código. O que a revisora precisa é dos dois: o
// aviso (para saber o que revisar) e o código (para revisar). A saída resolve
// mandando ela para o commit DO AVISO, que é o código mais um arquivo de texto:
// a árvore de código nos dois é byte a byte igual, e ela vê as duas coisas com
// um checkout só.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAIXA = path.join(RAIZ, 'docs', 'simulacao', 'caixa');
const MODELO = path.join(CAIXA, 'MODELO-executora.md');
const ENVIAR = process.argv.includes('--enviar');

const git = (c) => execSync(c, { cwd: RAIZ, encoding: 'utf8' }).trim();
const morrer = (m) => { console.error(`\n✘ ${m}\n`); process.exit(1); };

/** Os NN dos avisos que já existem, em ordem. */
const avisos = () => fs.readdirSync(CAIXA)
  .map((f) => /^(\d{2})-executora\.md$/.exec(f))
  .filter(Boolean).map((m) => m[1]).sort();

if (!fs.existsSync(MODELO)) morrer(`sem modelo em ${path.relative(RAIZ, MODELO)}`);

// ----------------------------------------------------------------- --enviar
if (ENVIAR) {
  const nn = avisos().pop();
  if (!nn) morrer('não há aviso nenhum na caixa. Rode `npm run rodada` primeiro.');
  const arq = path.join(CAIXA, `${nn}-executora.md`);
  const txt = fs.readFileSync(arq, 'utf8');
  // O AVISO NÃO PODE SAIR COM O MODELO DENTRO. Um aviso por preencher é pior que
  // aviso nenhum: a revisora dá checkout, lê a tabela de exemplo e revisa um
  // commit sem saber o que ele afirma.
  const restos = ['| `valor` | o que ele mede |', '| `caminho/do/arquivo` |', '| Dnn | | |'];
  const achado = restos.find((r) => txt.includes(r));
  if (achado) morrer(`o ${nn}-executora.md ainda tem linha do modelo:\n    ${achado}\n  Preencha antes de enviar.`);

  const rel = `docs/simulacao/caixa/${nn}-executora.md`;
  const sujo = git('git status --porcelain');
  const fora = sujo.split('\n').filter(Boolean).filter((l) => !l.includes(rel));
  if (fora.length) {
    console.error('\n✘ há mudança fora do aviso na árvore:\n');
    console.error(fora.join('\n'));
    morrer('commite o resto primeiro. O aviso é o ÚLTIMO commit da rodada.');
  }
  git(`git add "${rel}"`);
  git(`git commit -q -m "rodada ${nn} · aviso à revisora" -- "${rel}"`);
  const sha = git('git rev-parse HEAD');
  console.log(`\n✓ rodada ${nn} enviada`);
  console.log(`\n  código revisado: ${git('git rev-parse HEAD~1')}`);
  console.log(`  commit do aviso: ${sha}   ← é ESTE que a revisora checa out`);
  console.log('\n  (os dois têm a MESMA árvore de código: o commit do aviso só');
  console.log(`   acrescenta ${rel})`);
  console.log(`\n  passe para a revisora:\n\n    git -C <worktree> fetch && git -C <worktree> checkout ${sha}\n`);
  process.exit(0);
}

// ------------------------------------------------------------------- abrir
const sujo = git('git status --porcelain');
if (sujo) {
  console.error('\n✘ a árvore está suja:\n');
  console.error(sujo);
  morrer('commite tudo antes de abrir a rodada. O aviso aponta um sha, e a revisora'
    + '\n  dá checkout NELE: o que não estiver commitado não existe para ela.');
}

const anteriores = avisos();
const nn = String((anteriores.length ? parseInt(anteriores[anteriores.length - 1], 10) : 0) + 1)
  .padStart(2, '0');
const arq = path.join(CAIXA, `${nn}-executora.md`);
if (fs.existsSync(arq)) morrer(`${nn}-executora.md já existe`);

const sha = git('git rev-parse HEAD');
const txt = fs.readFileSync(MODELO, 'utf8')
  .replace(/^# Rodada NN · aviso à revisora$/m, `# Rodada ${nn} · aviso à revisora`)
  .replace(/<SHA>/g, sha);
fs.writeFileSync(arq, txt);

console.log(`\n✓ rodada ${nn} aberta · docs/simulacao/caixa/${nn}-executora.md`);
console.log(`  código a revisar: ${sha}`);
console.log('\n  Preencha as seis seções e depois:  npm run rodada -- --enviar');
