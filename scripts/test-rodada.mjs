// test-rodada.mjs · o L73 (--enviar duas vezes) e o L81 (o portão do BASE).
//
// `scripts/rodada.mjs` calcula a própria raiz a partir de `import.meta.url`
// (o caminho do ARQUIVO, não o cwd do processo), então a única forma de
// testá-lo sem tocar na caixa real é montar uma árvore de mentira e copiar o
// script para dentro dela: rodando de lá, ele acha a raiz certa por conta
// própria, exatamente como acharia no clone de verdade.
//
// L73 · o que se prova: a PRIMEIRA chamada de `--enviar` continua funcionando
// (a metade positiva, sem a qual "a segunda é recusada" não provaria nada); a
// SEGUNDA chamada, seguida, sem trabalho novo no meio, é recusada com a
// mensagem certa, dizendo o sha do aviso já enviado, e esse sha bate com o
// HEAD real da árvore de mentira, não é um número inventado na mensagem.
//
// L81 · o que se prova (rodada 44): o `BASE` (o `HEAD` do worktree da
// revisora) tem de ser ANCESTRAL do `HEAD` de trabalho para a rodada abrir.
// Três árvores de mentira, cada uma com o "repositório" e a "worktree da
// revisora" como PASTAS SEPARADAS, sem parentesco de git nenhum entre si (o
// jeito mais simples de fabricar um `BASE` órfão de verdade, sem tocar em
// objeto nenhum do repositório real e sem depender de `git gc` para nunca
// aparecer de novo): (a) `BASE` que É ancestral (a worktree é um clone real
// do repositório, num commit anterior) → abre normal; (b) `BASE` órfão SEM
// gêmeo de mesma mensagem no `main` → recusa, e a mensagem NÃO inventa um
// gêmeo que não existe; (c) `BASE` órfão COM gêmeo de mesma mensagem (duas
// pastas com um commit de texto idêntico, sem relação de git) → recusa, e a
// mensagem cita o SHA do gêmeo, não só "não é ancestral".
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
const falhasAntesDoL81 = falhas.length;

console.log('\n· L81: o portão do `BASE`, com a worktree da revisora como pasta separada');

/** `git add -A && git commit -m msg` na pasta `dir`, e devolve o sha do HEAD. */
function commitarTudo(dir, msg) {
  const gd = (cmd) => execSync(cmd, {
    cwd: dir, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'ignore'],
  }).trim();
  gd('git add -A');
  gd(`git commit -q -m "${msg}"`);
  return gd('git rev-parse HEAD');
}

/** Um git novo, numa pasta própria, com um commit de mensagem `msg`. */
function repoDeMentira(dir, msg) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'arquivo.txt'), `${msg}\n`);
  const gd = (cmd) => execSync(cmd, {
    cwd: dir, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'ignore'],
  }).trim();
  gd('git init -q');
  gd('git config user.email "teste@local"');
  gd('git config user.name "Teste"');
  gd('git config commit.gpgsign false');
  return commitarTudo(dir, msg);
}

/**
 * Fabrica um commit ÓRFÃO dentro do MESMO repositório `dir` (não numa pasta
 * separada): o objeto tem de existir no banco de objetos de `dir` para
 * `acharGemeo` conseguir ler a mensagem dele por sha, exatamente como o
 * `b8b78ae2` real (órfão, mas presente, porque a worktree da revisora
 * COMPARTILHA o `.git` do repositório principal).
 *
 * O gesto: destaca o `HEAD` (não move a branch), commita `msg` ali, e volta
 * para a branch: o commit fica pendurado no ar, alcançável por sha, mas por
 * ref nenhuma. Devolve o sha do órfão.
 */
function commitOrfao(dir, msg) {
  const gd = (cmd) => execSync(cmd, {
    cwd: dir, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'ignore'],
  }).trim();
  const branch = gd('git symbolic-ref --short HEAD');
  gd('git checkout -q --detach');
  fs.writeFileSync(path.join(dir, `orfao-${Date.now()}.txt`), `${msg}\n`);
  gd('git add -A');
  gd(`git commit -q -m "${msg}"`);
  const orfaoSha = gd('git rev-parse HEAD');
  gd(`git checkout -q ${branch}`);
  return orfaoSha;
}

/**
 * Copia `rodada.mjs`/`MODELO-executora.md` para dentro de um repositório de
 * mentira, E COMMITA (num commit próprio, por cima do que já existia): sem
 * isto, os arquivos ficam NÃO RASTREADOS, e o próprio `rodada.mjs` recusaria
 * abrir por "árvore suja" antes de chegar ao portão do L81 que este teste
 * quer exercitar, achado escrevendo este teste, positivo idêntico ao efeito
 * negativo que ele mede: o passo de instalar o script tem de deixar a árvore
 * do jeito que `rodada.mjs` exige encontrar.
 */
function instalarScript(dir) {
  fs.mkdirSync(path.join(dir, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'docs', 'simulacao', 'caixa'), { recursive: true });
  fs.copyFileSync(path.join(RAIZ, 'scripts', 'rodada.mjs'), path.join(dir, 'scripts', 'rodada.mjs'));
  fs.copyFileSync(
    path.join(RAIZ, 'docs', 'simulacao', 'caixa', 'MODELO-executora.md'),
    path.join(dir, 'docs', 'simulacao', 'caixa', 'MODELO-executora.md'),
  );
  commitarTudo(dir, 'instala o script de mentira');
}

// ---- (a) BASE ancestral de verdade: a "worktree" é um CLONE real do
// repositório, parado num commit anterior. Tem de abrir normal.
{
  const tmpA = fs.mkdtempSync(path.join(os.tmpdir(), 'test-rodada-l81a-'));
  try {
    const repoA = path.join(tmpA, 'repo');
    const revA = path.join(tmpA, 'centelha-techlead-revisora');
    repoDeMentira(repoA, 'trabalho antigo, que a revisora ja viu');
    execSync(`git clone -q "${repoA}" "${revA}"`, {
      encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'ignore'],
    });
    instalarScript(repoA);
    const gA = (cmd) => execSync(cmd, {
      cwd: repoA, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    fs.writeFileSync(path.join(repoA, 'arquivo2.txt'), 'trabalho novo, depois do que ela viu\n');
    gA('git add -A');
    gA('git commit -q -m "trabalho novo desta rodada"');
    const abriuA = execSync('node scripts/rodada.mjs', {
      cwd: repoA, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'pipe'],
    });
    ok(/rodada 01 aberta/.test(abriuA), 'BASE ancestral: a rodada abre normal, sem recusa');
  } catch (e) {
    ok(false, `BASE ancestral: a rodada NÃO deveria recusar, e recusou (${(e.stdout || '') + (e.stderr || '')})`);
  } finally {
    fs.rmSync(tmpA, { recursive: true, force: true });
  }
}

// ---- (b) BASE órfão SEM gêmeo: uma worktree DESTACADA do PRÓPRIO repoB, no
// sha de um commit órfão (fabricado com `commitOrfao`, dentro do mesmo
// banco de objetos, o mesmo jeito que o `b8b78ae2` real existe). Tem de
// recusar, e a mensagem não pode inventar um gêmeo que não existe.
{
  const tmpB = fs.mkdtempSync(path.join(os.tmpdir(), 'test-rodada-l81b-'));
  try {
    const repoB = path.join(tmpB, 'repo');
    const revB = path.join(tmpB, 'centelha-techlead-revisora');
    repoDeMentira(repoB, 'trabalho desta rodada');
    const orfaoB = commitOrfao(repoB, 'commit orfao sem gemeo nenhum, mensagem unica 9f3c1');
    execSync(`git worktree add -q --detach "${revB}" ${orfaoB}`, {
      cwd: repoB, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'ignore'],
    });
    instalarScript(repoB);
    const rodouB = execSync('node scripts/rodada.mjs', {
      cwd: repoB, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    ok(false, `BASE órfão sem gêmeo: deveria recusar e não recusou (saída: ${rodouB})`);
  } catch (e) {
    const saida = (e.stdout || '') + (e.stderr || '');
    ok(e.status !== 0, 'BASE órfão sem gêmeo: a rodada RECUSA abrir');
    ok(/não é ancestral/.test(saida), 'e a mensagem diz que o BASE não é ancestral');
    ok(/[Nn]ão achei nenhum commit de MESMA MENSAGEM/.test(saida),
      'e não inventa um gêmeo que não existe');
  } finally {
    fs.rmSync(tmpB, { recursive: true, force: true });
  }
}

// ---- (c) BASE órfão COM gêmeo: o mesmo commit órfão de (b), só que agora
// repoC TAMBÉM tem, na própria branch, um commit de MESMO TEXTO (o "replante
// por rebase" do achado real). Tem de recusar E nomear o sha do gêmeo que
// está de fato alcançável a partir do `HEAD` de repoC.
{
  const tmpC = fs.mkdtempSync(path.join(os.tmpdir(), 'test-rodada-l81c-'));
  let shaGemeoReal;
  try {
    const repoC = path.join(tmpC, 'repo');
    const revC = path.join(tmpC, 'centelha-techlead-revisora');
    const MSG_GEMEA = 'Rodada de mentira: veredito e sinal de vida da revisora';
    repoDeMentira(repoC, 'trabalho desta rodada');
    // O órfão nasce ANTES do gêmeo entrar na branch, exatamente como no
    // achado real (o commit original vira órfão, e SÓ DEPOIS o replante
    // chega ao main por outra mão).
    const orfaoC = commitOrfao(repoC, MSG_GEMEA);
    execSync(`git worktree add -q --detach "${revC}" ${orfaoC}`, {
      cwd: repoC, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'ignore'],
    });
    // O gêmeo entra como um commit de VERDADE na branch de repoC (o
    // "replante"), com a MESMA mensagem do órfão e sha diferente. Captura o
    // sha dele, que é o que a mensagem de recusa tem de citar.
    fs.writeFileSync(path.join(repoC, 'gemeo.txt'), 'o commit replantado\n');
    shaGemeoReal = commitarTudo(repoC, MSG_GEMEA);
    instalarScript(repoC);
    const rodouC = execSync('node scripts/rodada.mjs', {
      cwd: repoC, encoding: 'utf8', env: ENV_LIMPO, stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    ok(false, `BASE órfão com gêmeo: deveria recusar e não recusou (saída: ${rodouC})`);
  } catch (e) {
    const saida = (e.stdout || '') + (e.stderr || '');
    ok(e.status !== 0, 'BASE órfão com gêmeo: a rodada RECUSA abrir');
    ok(saida.includes(shaGemeoReal),
      `e a mensagem CITA O SHA do gêmeo dentro do main (${(shaGemeoReal || '').slice(0, 7)})`);
  } finally {
    fs.rmSync(tmpC, { recursive: true, force: true });
  }
}

console.log(falhas.length - falhasAntesDoL81
  ? `\n✘ L81 (rodada.mjs, o portão do BASE): ${falhas.length - falhasAntesDoL81} falha(s)`
  : '\n✓ L81 (rodada.mjs) OK · BASE ancestral abre normal, BASE órfão recusa, e o gêmeo'
    + ' de mesma mensagem dentro do main é citado pelo sha quando existe');
if (!falhas.length) carimbar('test-rodada');
process.exit(falhas.length ? 1 : 0);
