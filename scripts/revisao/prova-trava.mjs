// prova-trava.mjs · o controle negativo da trava (rev-textos, fase 0; Executora, 12/11/2026). FORA do validate.
// Cada caso escreve UMA mudança num arquivo do src/ da árvore, roda a trava só nele (com um contradicoes.md de teste,
// vazio ou com a entrada do caso) e devolve o arquivo byte a byte ao que era; no fim confere que a árvore ficou limpa.
// Precisa da árvore limpa nesses arquivos. Saída em Markdown, para colar no PROVA.md:
//   node scripts/revisao/prova-trava.mjs > scripts/revisao/PROVA.md
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const TRAVA = path.join(REPO, 'scripts/revisao/trava.mjs');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'trava-'));
const git = (...a) => execFileSync('git', a, { cwd: REPO, encoding: 'utf8' });

const CAP = 'src/content/chapters/combate.md';
const GEN = 'src/content/chapters/acoes-corpo-e-movimento.md';
const PAGINA = 'src/pages/index.astro';
const DADO = 'src/data/armas.json';

function caso(nome, arq, trocas, entradas, esperado) {
  const p = path.join(REPO, arq), original = fs.readFileSync(p);
  let txt = original.toString('utf8');
  for (const [a, b] of trocas) {
    if (a instanceof RegExp) { if (!a.test(txt)) throw new Error(`${nome}: ${a} não casa em ${arq}`); txt = txt.replace(a, b); continue; }
    if (!txt.includes(a)) throw new Error(`${nome}: o trecho não está em ${arq}: ${a}`);
    txt = txt.split(a).join(b);
  }
  const md = path.join(tmp, 'contradicoes.md');
  fs.writeFileSync(md, ['# teste', '', '## RT-900 · caso de teste', ...entradas.map((e) => (typeof e === 'string' ? e : `- Trava: \`${arq}\`: "${e[0]}" → "${e[1]}"`)), ''].join('\n'));
  fs.writeFileSync(p, txt);
  let r;
  try { r = spawnSync('node', [TRAVA, '--contradicoes', md, arq], { cwd: REPO, encoding: 'utf8' }); }
  finally { fs.writeFileSync(p, original); }
  const ok = (r.status === 0) === (esperado === 'passa');
  console.log(`### ${ok ? '✓' : '✘ INESPERADO'} ${nome} (esperado: ${esperado}; exit ${r.status})\n`);
  console.log('Troca: ' + trocas.map(([a, b]) => `"${a}" → "${b}"`).join('; ') + (entradas.length ? `\nEntrada: ${entradas.map((e) => (typeof e === 'string' ? e : `"${e[0]}" → "${e[1]}"`)).join('; ')}` : '\nEntrada: nenhuma') + '\n');
  console.log('```\n' + (r.stdout + r.stderr).trim().split('\n').filter((l) => !l.startsWith('trava · base')).join('\n') + '\n```\n');
  return ok;
}

// o JSON: a primeira descrição com número, em qualquer profundidade
const DADOS = JSON.parse(fs.readFileSync(path.join(REPO, DADO), 'utf8'));
const acha = (o) => { if (Array.isArray(o)) { for (const x of o) { const r = acha(x); if (r) return r; } } else if (o && typeof o === 'object') { if (typeof o.descricao === 'string' && /\d/.test(o.descricao)) return o; for (const v of Object.values(o)) { const r = acha(v); if (r) return r; } } return null; };
const comNumero = acha(DADOS);
const jd = JSON.stringify(comNumero.descricao).slice(1, -1);
const num = jd.match(/\d+/)[0];
const jdNum = jd.replace(num, String(Number(num) + 1));

// a página: o primeiro <h2>
const pag = fs.readFileSync(path.join(REPO, PAGINA), 'utf8');
const h2 = pag.match(/<h2\b[^>]*>([^<]+)<\/h2>/);

// o bloco gerado: o primeiro número de dentro dele
const gen = fs.readFileSync(path.join(REPO, GEN), 'utf8');
const bloco = gen.match(/<!-- gen:peso-erguido -->[\s\S]*?<!-- \/gen:peso-erguido -->/)[0];
const linhaGen = bloco.split('\n').find((l) => /\d/.test(l) && l.startsWith('|'));
const linhaGen2 = linhaGen.replace(/\d+/, (n) => String(Number(n) + 1));

const R1 = 'Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role.';
const R1b = 'Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role.';
const N1 = '(Força 5 e Destreza 2? use a Força)', N1b = '(Força 6 e Destreza 2? use a Força)';
const D1 = 'Ataque = [(Atributo + Habilidade) ÷ 2]d6', D1b = 'Ataque = [(Atributo + Habilidade) ÷ 2]d8';
const T1 = 'aplique Firulas e Técnicas, e role.', T1b = 'aplique Firulas, Técnicas e Halterofilismo, e role.';
const H1 = '## O ataque: acertar e a Margem', H1b = '## O ataque: como acertar e a Margem';
const E1 = 'Halterofilismo';

console.log(`# Prova da trava (controle negativo)\n\nGerada por \`node scripts/revisao/prova-trava.mjs\` em ${new Date().toISOString().slice(0, 10)}, base d760ef96, na árvore`);
console.log(`\`centelha-executora\` (ramo revisao-textos, HEAD ${git('rev-parse', '--short', 'HEAD').trim()}). Cada caso muda UM arquivo, roda a trava só nele com um`);
console.log('contradicoes.md de teste e devolve o arquivo ao que era. Os avisos (linhas com ·) não derrubam a trava.\n');
const r = [];
console.log('## A reescrita só de redação passa\n');
r.push(caso('redação, sem número, dado, termo nem título', CAP, [[R1, R1b]], [], 'passa'));
r.push(caso('uma frase do JSON reescrita, só no campo de prosa', DADO, [[jd, jd.replace(/^(\S+)/, (w) => w.toUpperCase())]], [], 'passa'));
r.push(caso('número mudado dentro de um bloco gerado (fica fora da comparação)', GEN, [[linhaGen, linhaGen2]], [], 'passa'));
console.log('## Sem entrada, falha\n');
r.push(caso('número', CAP, [[N1, N1b]], [], 'falha'));
r.push(caso('dado', CAP, [[D1, D1b]], [], 'falha'));
r.push(caso('termo protegido aparece novo', CAP, [[T1, T1b]], [], 'falha'));
r.push(caso('termo protegido some do arquivo (as três Plumbata, sem diferenciar maiúsculas)', CAP, [[/plumbata/giu, 'pedra de mão']], [], 'falha'));
r.push(caso('título de seção', CAP, [[H1, H1b]], [], 'falha'));
r.push(caso('título de página .astro (<h2>)', PAGINA, [[h2[0], h2[0].replace(h2[1], h2[1] + ' de novo')]], [], 'falha'));
r.push(caso('número na prosa do JSON', DADO, [[jd, jdNum]], [], 'falha'));
r.push(caso('campo fora da prosa no JSON', DADO, [['"id": "', '"id": "x-']], [], 'falha'));
console.log('## Com a entrada, passa\n');
r.push(caso('número, com entrada', CAP, [[N1, N1b]], [[N1, N1b]], 'passa'));
r.push(caso('dado, com entrada', CAP, [[D1, D1b]], [[D1, D1b]], 'passa'));
r.push(caso('termo novo, com entrada', CAP, [[T1, T1b]], [[T1, T1b]], 'passa'));
r.push(caso('título, com entrada', CAP, [[H1, H1b]], [[H1, H1b]], 'passa'));
r.push(caso('número na prosa do JSON, com entrada', DADO, [[jd, jdNum]], [[jd, jdNum]], 'passa'));
console.log('## Os termos comuns só avisam, e a linha de trava com vários trechos e (N×)\n');
r.push(caso('termo comum aparece novo (milagre, da lista _comuns, ausente do arquivo na base): só aviso', CAP, [[T1, 'aplique Firulas e Técnicas, e role, sem esperar milagre.']], [], 'passa'));
const RT1 = '- Trava: `src/content/chapters/combate.md`: "Preparação" → "Preparo" (2×); `src/data/armas-extras.json`: "Preparação" → "Preparo" (1×)';
r.push(caso('a linha de trava da RT-001, no formato dela (dois trechos, com 2× e 1×)', CAP, [[/Preparação/gu, 'Preparo']], [RT1], 'passa'));
r.push(caso('a linha de trava da RT-001, sem a troca feita no arquivo: aviso de entrada não aplicada', CAP, [], [RT1], 'passa'));
console.log('## A entrada que não casa falha\n');
r.push(caso('entrada que pede (3×) num trecho que está 2 vezes', CAP, [[/Preparação/gu, 'Preparo']], ['- Trava: `src/content/chapters/combate.md`: "Preparação" → "Preparo" (3×)'], 'falha'));
r.push(caso('entrada com "antes" que não está na base', CAP, [[N1, N1b]], [['(Força 7 e Destreza 2? use a Força)', N1b]], 'falha'));
r.push(caso('entrada certa, mas com outra mudança fora dela', CAP, [[N1, N1b], [D1, D1b]], [[N1, N1b]], 'falha'));
const sujo = git('status', '--porcelain', '--', 'src').trim();
console.log(`## Resultado\n\n${r.filter(Boolean).length} de ${r.length} casos deram o esperado. Árvore depois da prova: ${sujo ? 'SUJA: ' + sujo : 'limpa em src/ (git status --porcelain -- src vazio)'}.`);
fs.rmSync(tmp, { recursive: true, force: true });
if (r.some((x) => !x) || sujo) process.exit(1);
