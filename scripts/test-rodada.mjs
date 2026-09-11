// test-rodada.mjs · o L73: --enviar chamado duas vezes seguidas.
//
// `scripts/rodada.mjs` calcula a própria raiz a partir de `import.meta.url`
// (o caminho do ARQUIVO, não o cwd do processo), então a única forma de
// testá-lo sem tocar na caixa real é montar uma árvore de mentira e copiar o
// script para dentro dela: rodando de lá, ele acha a raiz certa por conta
// própria, exatamente como acharia no clone de verdade.
//
// O que se prova: a PRIMEIRA chamada de `--enviar` continua funcionando (a
// metade positiva, sem a qual "a segunda é recusada" não provaria nada); a
// SEGUNDA chamada, seguida, sem trabalho novo no meio, é recusada com a
// mensagem certa, dizendo o sha do aviso já enviado, e esse sha bate com o
// HEAD real da árvore de mentira, não é um número inventado na mensagem.
//
//   node scripts/test-rodada.mjs
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { carimbar } from './carimbo.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

console.log('\n· L73: `--enviar` chamado duas vezes seguidas, numa árvore de mentira');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'test-rodada-'));

// O ACHADO QUE QUASE FEZ ESTE TESTE CORROMPER O REPOSITÓRIO REAL: rodando
// dentro do gancho de `pre-commit` (que é um `git commit` em andamento), o
// processo já nasce com `GIT_DIR`/`GIT_INDEX_FILE`/`GIT_WORK_TREE` apontando
// para o `.git` REAL, e esses valores VENCEM o `cwd` na hora de o `git`
// escolher onde escrever: `cwd` diz onde o comando RODA, essas variáveis
// dizem para ONDE o `git` escreve, e a segunda vence a primeira. Sem limpar
// isto, o `git init` "dentro" da árvore de mentira era um passo em falso: o
// `git` seguia gravando no `.git/objects` do projeto de verdade, com um
// caminho de árvore (`docs/simulacao/caixa/01-executora.md`) que só existe na
// árvore de mentira. O sintoma na hora saiu no COMMIT DESTA MESMA RODADA, não
// no teste: "invalid object ... for docs/simulacao/caixa/01-executora.md",
// porque o índice real tinha ganhado uma entrada órfã. Os objetos soltos
// resultantes (`git fsck` os lista como "dangling", inalcançáveis por
// nenhuma ref, portanto inertes) foram registrados no aviso desta rodada
// para o Arquiteto decidir se limpa com `git gc`; não são meus para apagar
// sozinha.
//
// A LIMPEZA: cada comando git do teste roda com um AMBIENTE PRÓPRIO, sem essas
// variáveis, para que só o `cwd` decida: exatamente como um clone comum,
// fora de qualquer gancho, sempre se comportou.
const ENV_LIMPO = { ...process.env };
for (const k of [
  'GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_PREFIX', 'GIT_COMMON_DIR',
]) delete ENV_LIMPO[k];

// `stdio` com stderr ignorado: os avisos de CRLF do git (a árvore de mentira
// nasce sem `.gitattributes`) e o "ambiguous argument 'origin/main'" de
// `calcularTopo` tentando um fetch que não tem para onde ir são ruído
// esperado desta árvore isolada, não sinal de defeito.
const g = (cmd, cwd = tmp) => execSync(cmd, {
  cwd, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'ignore'],
}).trim();
// Roda o script e devolve { codigo, saida }, sem deixar um exit != 0 derrubar
// o teste (é exatamente o que se quer medir na segunda chamada). O ambiente
// limpo aqui importa tanto quanto no `g()`: é este processo `node` que chama
// os `git` internos do próprio `rodada.mjs`, e eles herdariam a poluição se
// só o `g()` fosse limpo.
const rodar = (args, cwd = tmp) => {
  try {
    const saida = execSync(`node scripts/rodada.mjs ${args}`, {
      cwd, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { codigo: 0, saida };
  } catch (e) {
    return { codigo: e.status ?? 1, saida: (e.stdout || '') + (e.stderr || '') };
  }
};

try {
  // ---- a árvore de mentira: só o que rodada.mjs precisa para achar a raiz
  // e o modelo, e um commit de "trabalho" para abrir a rodada em cima dele.
  fs.mkdirSync(path.join(tmp, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(tmp, 'docs', 'simulacao', 'caixa'), { recursive: true });
  fs.copyFileSync(
    path.join(RAIZ, 'scripts', 'rodada.mjs'),
    path.join(tmp, 'scripts', 'rodada.mjs'),
  );
  fs.copyFileSync(
    path.join(RAIZ, 'docs', 'simulacao', 'caixa', 'MODELO-executora.md'),
    path.join(tmp, 'docs', 'simulacao', 'caixa', 'MODELO-executora.md'),
  );
  fs.writeFileSync(path.join(tmp, 'trabalho.txt'), 'o trabalho desta rodada de mentira\n');

  g('git init -q');
  g('git config user.email "teste@local"');
  g('git config user.name "Teste"');
  g('git config commit.gpgsign false');
  g('git add -A');
  g('git commit -q -m "trabalho da rodada de mentira"');

  // ---- abrir: cria o 01-executora.md com BASE em prosa (sem worktree da
  // revisora nesta árvore de mentira) e SHA/TOPO já preenchidos.
  const abriu = rodar('');
  ok(abriu.codigo === 0, `\`npm run rodada\` (abrir) funciona na árvore de mentira (código ${abriu.codigo})`);
  const aviso = path.join(tmp, 'docs', 'simulacao', 'caixa', '01-executora.md');
  ok(fs.existsSync(aviso), 'o 01-executora.md nasceu');

  // Preenche os placeholders que `abrir` deixou em prosa (sem BASE de
  // verdade, as tabelas também não são preenchidas pelo script): o suficiente
  // para o `--enviar` não recusar por "modelo ainda tem linha do modelo".
  let txt = fs.readFileSync(aviso, 'utf8');
  txt = txt
    .replace('BASE  <sha do último commit que a revisora já viu>', 'BASE  0000000000000000000000000000000000000000')
    .replace('| `caminho/do/arquivo` | uma frase |', '| `trabalho.txt` | criado |')
    .replace('| `valor` | o que ele mede |', '| 1 | número de mentira | `trabalho.txt:1` |')
    .replace('| Dnn | | |', '| D01 | decisão de mentira | nenhum |');
  fs.writeFileSync(aviso, txt);

  // ---- a PRIMEIRA chamada de --enviar: tem de funcionar, e é a metade
  // positiva sem a qual a segunda (recusada) não prova nada por si só.
  const primeira = rodar('-- --enviar');
  ok(primeira.codigo === 0, `a PRIMEIRA chamada de --enviar funciona (código ${primeira.codigo})`);
  ok(/rodada 01 enviada/.test(primeira.saida), 'e imprime a confirmação de envio');
  const shaImpresso = (primeira.saida.match(/sha do aviso:\s+([0-9a-f]{40})/) || [])[1];
  ok(!!shaImpresso, `e imprime o sha do aviso (${shaImpresso || 'nenhum'})`);

  const shaHead = g('git rev-parse HEAD');
  ok(shaHead === shaImpresso, `e esse sha É o HEAD real da árvore depois do commit (${shaHead === shaImpresso})`);
  const msgHead = g('git log -1 --format=%s');
  ok(msgHead === 'rodada 01 · aviso à revisora', `e o commit tem a mensagem fixa ("${msgHead}")`);

  // ---- a SEGUNDA chamada, seguida, sem trabalho novo: tem de ser recusada,
  // e a mensagem tem de dizer QUAL é o sha certo (o L66 deste projeto), não
  // só que não pode.
  const segunda = rodar('-- --enviar');
  ok(segunda.codigo !== 0, `a SEGUNDA chamada de --enviar, seguida, É RECUSADA (código ${segunda.codigo})`);
  ok(/já foi enviado/.test(segunda.saida), 'a mensagem diz que o aviso já foi enviado');
  ok(segunda.saida.includes(shaHead),
    `e a mensagem cita O SHA CERTO, o mesmo HEAD de antes (${segunda.saida.includes(shaHead)})`);

  // A árvore não pode ter ganho um SEGUNDO commit de aviso (o defeito
  // original, se a recusa não tivesse entrado): o HEAD continua sendo o
  // mesmo de depois da primeira chamada.
  const shaHeadDepois = g('git rev-parse HEAD');
  ok(shaHeadDepois === shaHead,
    `e a árvore NÃO ganhou um segundo commit de aviso (HEAD continua ${shaHeadDepois === shaHead ? 'o mesmo' : 'diferente'})`);
  const total = parseInt(g('git rev-list --count HEAD'), 10);
  ok(total === 2, `só dois commits no total (trabalho + um aviso só), não três (achou ${total})`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(falhas.length
  ? `\n✘ L73 (rodada.mjs, --enviar duas vezes): ${falhas.length} falha(s)`
  : '\n✓ L73 (rodada.mjs) OK · a primeira chamada de --enviar funciona, e a segunda,'
    + ' seguida, é recusada dizendo o sha certo, sem criar um segundo commit de aviso');
if (!falhas.length) carimbar('test-rodada');
process.exit(falhas.length ? 1 : 0);
