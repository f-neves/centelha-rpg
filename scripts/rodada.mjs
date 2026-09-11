// rodada.mjs · abre e envia o aviso da executora à revisora.
//
// A caixa (`docs/simulacao/caixa/`) é o único canal entre as duas instâncias, e
// este script existe para que o aviso não dependa de eu lembrar do formato nem
// do número da vez. Ver o README de lá.
//
//   npm run rodada             · cria o NN-executora.md, com BASE/SHA/TOPO preenchidos
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
//
// QUATRO CAMPOS, E NÃO TRÊS, DESDE 06/09/2026. O modelo já pedia BASE/SHA/TOPO
// desde 04/09, e este script nunca foi atualizado para preenchê-los: ele só
// sabia substituir um `<SHA>` que o modelo novo nem tem mais, então toda rodada
// desde então nascia com as TRÊS linhas em prosa ("<sha do último commit que a
// revisora já viu>" etc.), esperando alguém preencher à mão. Ninguém preencheu,
// e os avisos pararam de ser escritos: não sumiram, não ficaram por commitar,
// simplesmente deixaram de nascer, porque a ferramenta que os gera estava
// desalinhada com o próprio formato que ela mesma escreve. O quarto campo, o
// SHA DO AVISO, não entra no arquivo (um commit não contém o próprio sha, é
// por isso que são dois desde sempre): ele só existe depois do `--enviar`, e
// o `--enviar` já o imprimia; a mudança aqui é chamá-lo pelo nome certo.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CAIXA = path.join(RAIZ, 'docs', 'simulacao', 'caixa');
const MODELO = path.join(CAIXA, 'MODELO-executora.md');
const ENVIAR = process.argv.includes('--enviar');
// O worktree da revisora DESTA equipe (Agent Team, 07/09/2026): `centelha-techlead-revisora`,
// não `centelha-revisora`. O nome antigo continua existindo no disco (era o da
// equipe anterior, parada na rodada 14) e o `tenta()` abaixo não falha ao
// achar um worktree de verdade lá dentro: ele só devolve um BASE errado, e
// silencioso, sem avisar que é o worktree errado. Achado ao abrir a rodada 19,
// que computou BASE = 53c18c0 (rodada 14) em vez de 8dd27d4 (o pin real,
// conferido em `CONTRATO-REVISORA.md`). `duo.mjs` tem o mesmo nome antigo,
// hardcoded, e não foi tocado aqui: fora do escopo desta frente, registrado
// para o TechLead decidir.
const REV = path.resolve(RAIZ, '..', 'centelha-techlead-revisora');

const git = (c, cwd = RAIZ) => execSync(c, { cwd, encoding: 'utf8' }).trim();
const tenta = (f, p = null) => { try { return f(); } catch { return p; } };
const morrer = (m) => { console.error(`\n✘ ${m}\n`); process.exit(1); };
const ehAncestral = (a, b) => tenta(() => { git(`git merge-base --is-ancestor ${a} ${b}`); return true; }, false);

/**
 * O TOPO, por ANCESTRALIDADE, e não por diferença.
 *
 * O defeito original (`origemMain === sha ? sha : origemMain`) tratava toda
 * diferença como "origin foi na frente" — e quando `origin/main` está PARADO
 * (ninguém empurrou, só se acumulou commit local), `origemMain` é um
 * ANCESTRAL do HEAD real, não um topo mais novo: o aviso herdava um TOPO
 * velho, e `git log SHA..TOPO` saía vazio prometendo "nada de fora entrou"
 * quando o oposto podia ser verdade. Achado na revisão da rodada 27
 * (`Pendencias.md` L61, item 2).
 *
 * As quatro leituras possíveis de `origemMain` contra `sha`:
 *   sem origin, ou iguais         → TOPO = SHA (nada para comparar)
 *   sha É ANCESTRAL de origemMain → origin empurrou depois: TOPO = origemMain
 *   origemMain É ANCESTRAL de sha → origin ficou para trás: TOPO = SHA (o caso do bug)
 *   nenhum é ancestral do outro   → histórico foi reescrito nalgum lado; TOPO cai
 *                                    em SHA por segurança, com aviso alto — não dá
 *                                    para saber "o que é de fora" sem olhar à mão
 */
function calcularTopo(sha) {
  tenta(() => git('git fetch --quiet'));
  const origemMain = tenta(() => git('git rev-parse origin/main'));
  if (!origemMain || origemMain === sha) return { topo: sha, origemMain, divergiu: false };
  if (ehAncestral(sha, origemMain)) return { topo: origemMain, origemMain, divergiu: false };
  if (ehAncestral(origemMain, sha)) return { topo: sha, origemMain, divergiu: false };
  return { topo: sha, origemMain, divergiu: true };
}

/** Os NN de um papel que já existem na caixa. */
const nnsDe = (papel) => fs.readdirSync(CAIXA)
  .map((f) => new RegExp(`^(\\d{2})-${papel}\\.md$`).exec(f))
  .filter(Boolean).map((m) => m[1]).sort();
/** Só os avisos da executora, para o `--enviar` achar o mais recente. */
const avisos = () => nnsDe('executora');
/**
 * O PRÓXIMO NÚMERO, contando os dois papéis juntos.
 *
 * O README manda `NN de 01 em diante, sempre em par: um aviso, uma resposta`.
 * Contar só `-executora.md` quebrou isso na prática: quando a revisora
 * respondeu direto (rodadas 05 a 08, sem aviso, ver o cabeçalho delas), o
 * PRÓXIMO `npm run rodada` teria proposto `05-executora.md` de novo, ao lado
 * de um `05-revisora.md` de dois dias antes, e os dois pareceriam a mesma
 * rodada sem nunca terem sido.
 */
const proximoNumero = () => {
  const todos = [...nnsDe('executora'), ...nnsDe('revisora')].map((n) => parseInt(n, 10));
  return String((todos.length ? Math.max(...todos) : 0) + 1).padStart(2, '0');
};

if (!fs.existsSync(MODELO)) morrer(`sem modelo em ${path.relative(RAIZ, MODELO)}`);

// ----------------------------------------------------------------- --enviar
if (ENVIAR) {
  // L73 (achado na rodada 34, 10/09/2026): `--enviar` chamado DUAS VEZES
  // seguidas. Na segunda vez a árvore já está limpa (o aviso da primeira
  // chamada já foi commitado), então os dois guardas de baixo (modelo por
  // preencher, sujeira fora do aviso) passam batido. Sem esta checagem, o
  // `HEAD` relido logo abaixo (de propósito, porque a árvore pode ter andado
  // entre abrir e enviar) já É o commit do primeiro aviso, e o script
  // gravaria `SHA`/`TOPO` apontando para ele mesmo: o campo passaria a
  // nomear o mensageiro, e não o trabalho. A releitura de `HEAD` continua
  // certa para o caso normal (alguém commitou trabalho de verdade entre
  // abrir e enviar); o que se distingue aqui é só o caso em que quem andou
  // foi o PRÓPRIO `--enviar` anterior.
  //
  // A mensagem do commit do aviso é fixa (linha do `git commit` mais abaixo),
  // e é o sinal mais simples de "isto já é um aviso, não é trabalho": um
  // commit de trabalho nunca nasce com este texto exato.
  const msgHead = tenta(() => git('git log -1 --format=%s'), '');
  if (/^rodada \d+ · aviso à revisora$/.test(msgHead)) {
    const shaHead = git('git rev-parse HEAD');
    morrer(`o aviso desta rodada já foi enviado: HEAD já é o commit dele (sha ${shaHead}).\n`
      + '  Não rode --enviar duas vezes seguidas: a segunda chamada gravaria SHA/TOPO'
      + '\n  apontando para o próprio aviso, em vez do trabalho (L73). Se há trabalho novo'
      + '\n  para avisar, comece uma rodada nova (`npm run rodada`, sem --enviar) antes de'
      + '\n  enviar de novo.');
  }

  const nn = avisos().pop();
  if (!nn) morrer('não há aviso nenhum na caixa. Rode `npm run rodada` primeiro.');
  const arq = path.join(CAIXA, `${nn}-executora.md`);
  let txt = fs.readFileSync(arq, 'utf8');
  // O AVISO NÃO PODE SAIR COM O MODELO DENTRO. Um aviso por preencher é pior que
  // aviso nenhum: a revisora dá checkout, lê a tabela de exemplo e revisa um
  // commit sem saber o que ele afirma.
  const restos = [
    '| `valor` | o que ele mede |', '| `caminho/do/arquivo` |', '| Dnn | | |',
    '<sha do último commit que a revisora já viu>',
    '<sha do fim deste trecho>', '<sha do topo do main quando este aviso foi escrito>',
  ];
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

  // SHA E TOPO RELIDOS AGORA, NÃO OS QUE O `abrir` ESCREVEU. Entre abrir e
  // enviar a árvore pode andar — a rodada 28 emendou o commit de trabalho no
  // meio do caminho (`Pendencias.md` L61, item 2 · sugestão da Revisora) — e um
  // SHA congelado cedo demais aponta para um commit que já não existe mais,
  // mesmo com a árvore idêntica. `HEAD` aqui É o sha de trabalho: o aviso ainda
  // não foi commitado, então o topo do branch é exatamente o commit que se está
  // avisando.
  const shaFresco = git('git rev-parse HEAD');
  const { topo: topoFresco, origemMain, divergiu } = calcularTopo(shaFresco);
  if (divergiu) {
    console.log(`\n⚑ origin/main (${(origemMain || '').slice(0, 7)}) e este commit (${shaFresco.slice(0, 7)})`
      + ' DIVERGIRAM — nem um é ancestral do outro. TOPO ficou em SHA por segurança;'
      + ' confira à mão antes de mandar a Revisora.');
  } else if (topoFresco !== shaFresco) {
    console.log(`\n⚑ origin/main (${origemMain.slice(0, 7)}) está à frente deste commit `
      + `(${shaFresco.slice(0, 7)}): git log ${shaFresco.slice(0, 7)}..${origemMain.slice(0, 7)} diz o quê e de quem.`);
  }
  const txtAntes = txt;
  txt = txt.replace(/^SHA {3}.+$/m, `SHA   ${shaFresco}`).replace(/^TOPO {2}.+$/m, `TOPO  ${topoFresco}`);
  if (txt !== txtAntes) {
    fs.writeFileSync(arq, txt, 'utf8');
    console.log(`\n⚑ SHA/TOPO reescritos na hora de enviar (eram de quando a rodada abriu, `
      + 'podem ter ficado velhos entretanto).');
  }

  git(`git add "${rel}"`);
  git(`git commit -q -m "rodada ${nn} · aviso à revisora" -- "${rel}"`);
  const shaDoAviso = git('git rev-parse HEAD');
  console.log(`\n✓ rodada ${nn} enviada · os quatro campos:`);
  console.log(`\n  sha de trabalho (SHA): ${shaFresco}`);
  console.log(`  sha do aviso:          ${shaDoAviso}   ← é ESTE que a revisora checa out`);
  console.log('\n  (os dois têm a MESMA árvore de código: o commit do aviso só');
  console.log(`   acrescenta ${rel})`);
  console.log(`\n  passe para a revisora:\n\n    git -C <worktree> fetch && git -C <worktree> checkout ${shaDoAviso}\n`);
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

const nn = proximoNumero();
const arq = path.join(CAIXA, `${nn}-executora.md`);
if (fs.existsSync(arq)) morrer(`${nn}-executora.md já existe`);

const sha = git('git rev-parse HEAD');

// BASE: o HEAD do worktree da revisora É o último commit que ela já viu, POR
// CONSTRUÇÃO — é o commit em que o `checkout` do aviso anterior a deixou, e
// ela só lê o que está congelado ali. Se o worktree não existe (clone sem a
// frente de revisão do lado), a linha fica em prosa para alguém preencher.
const base = tenta(() => git('git rev-parse HEAD', REV));
if (!base) console.log(`\n⚑ sem worktree da revisora em ${path.relative(RAIZ, REV)}: preencha BASE à mão.`);

// TOPO: por ancestralidade (`calcularTopo`, acima). Só informativo aqui — o
// valor que vale de verdade é o que o `--enviar` relê na hora de commitar,
// porque a árvore pode andar entre abrir e enviar.
const { topo, origemMain, divergiu } = calcularTopo(sha);
if (divergiu) {
  console.log(`\n⚑ origin/main (${(origemMain || '').slice(0, 7)}) e este commit (${sha.slice(0, 7)})`
    + ' DIVERGIRAM — nem um é ancestral do outro, histórico foi reescrito nalgum lado.'
    + ' TOPO ficou em SHA por segurança; confira à mão antes de avisar a Revisora.');
} else if (topo !== sha) {
  console.log(`\n⚑ origin/main (${origemMain.slice(0, 7)}) está à frente deste commit (${sha.slice(0, 7)}):`);
  console.log(`   git log ${sha.slice(0, 7)}..${origemMain.slice(0, 7)}   diz o quê e de quem.`);
}

// O QUE MUDOU: a LISTA DE ARQUIVOS sai do diff, e não da memória de quem
// escreve. A rodada 10 tinha 12 arquivos tocados entre BASE e SHA e a tabela
// escrita à mão listava 3: a revisora conferiu os outros 9 à mão porque a
// tabela mentia por omissão, não por erro. O diff não esquece; quem escreve à
// mão, esquece. A FRASE de cada linha continua manual (o diff não sabe dizer
// POR QUE um arquivo mudou), só a lista de QUAIS mudaram deixa de ser.
const arquivosTocados = base
  ? tenta(() => git(`git diff --name-only ${base}..${sha} -- . ":!docs/simulacao/caixa"`))
  : null;
const tabelaOQueMudou = arquivosTocados
  ? (arquivosTocados.split('\n').filter(Boolean).map((f) => `| \`${f}\` |  |`).join('\n')
     || '| *(nenhum arquivo fora de `docs/simulacao/caixa/` entre BASE e SHA)* | |')
  : '| `caminho/do/arquivo` | uma frase |';

const txt = fs.readFileSync(MODELO, 'utf8')
  .replace(/^# Rodada NN · aviso à revisora$/m, `# Rodada ${nn} · aviso à revisora`)
  .replace('BASE  <sha do último commit que a revisora já viu>', `BASE  ${base || '<sha do último commit que a revisora já viu>'}`)
  .replace('SHA   <sha do fim deste trecho>', `SHA   ${sha}`)
  .replace('TOPO  <sha do topo do main quando este aviso foi escrito>', `TOPO  ${topo}`)
  .replace('| `caminho/do/arquivo` | uma frase |', tabelaOQueMudou);
fs.writeFileSync(arq, txt);
if (!arquivosTocados) {
  console.log('\n⚑ sem BASE (worktree da revisora ausente): a tabela "O QUE MUDOU" nasceu'
    + '\n  com o placeholder do modelo. Preencha a lista de arquivos à mão, com cuidado:'
    + `\n  é exatamente essa lista que a rodada 10 errou.\n  (dá para conferir com: git diff --name-only <BASE>..${sha})`);
}

console.log(`\n✓ rodada ${nn} aberta · docs/simulacao/caixa/${nn}-executora.md`);
console.log(`  BASE ${base || '(preencher à mão)'} · SHA ${sha} · TOPO ${topo}`);
console.log('\n  Preencha as seis seções (BASE/SHA/TOPO já vieram prontos) e depois:');
console.log('  npm run rodada -- --enviar');
