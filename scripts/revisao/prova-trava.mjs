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

const BASE_TXT = (arq) => git('show', `d760ef96:${arq}`).replace(/\r/g, '');
function caso(nome, arq, trocas, entradas, esperado, movimentos = [], estadoExtra = []) {
  // o caso parte do arquivo NA BASE: o ramo já reescreveu páginas, e o caso mede só a troca dele
  const p = path.join(REPO, arq), original = fs.readFileSync(p);
  let txt = BASE_TXT(arq);
  for (const [a, b] of trocas) {
    if (a instanceof RegExp) { if (!a.test(txt)) throw new Error(`${nome}: ${a} não casa em ${arq}`); txt = txt.replace(a, b); continue; }
    if (!txt.includes(a)) throw new Error(`${nome}: o trecho não está em ${arq}: ${a}`);
    txt = txt.split(a).join(b);
  }
  const md = path.join(tmp, 'contradicoes.md');
  fs.writeFileSync(md, ['# teste', '', '## RT-900 · caso de teste', ...entradas.map((e) => (typeof e === 'string' ? e : `- Trava: \`${arq}\`: "${e[0]}" → "${e[1]}"`)), ''].join('\n'));
  const est = path.join(tmp, 'estado.md');
  fs.writeFileSync(est, ['# estado de teste', '', '## Movimentos de seção', '', ...movimentos, '', ...estadoExtra, ''].join('\n'));
  fs.writeFileSync(p, txt);
  let r;
  try { r = spawnSync('node', [TRAVA, '--contradicoes', md, '--estado', est, arq], { cwd: REPO, encoding: 'utf8' }); }
  finally { fs.writeFileSync(p, original); }
  const ok = (r.status === 0) === (esperado === 'passa');
  console.log(`### ${ok ? '✓' : '✘ INESPERADO'} ${nome} (esperado: ${esperado}; exit ${r.status})\n`);
  console.log('Troca: ' + trocas.map(([a, b]) => `"${a}" → "${b}"`).join('; ') + (entradas.length ? `\nEntrada: ${entradas.map((e) => (typeof e === 'string' ? e : `"${e[0]}" → "${e[1]}"`)).join('; ')}` : '\nEntrada: nenhuma') + (movimentos.length ? `\nMovimento no estado.md: ${movimentos.join(' ')}` : '') + (estadoExtra.length ? `\nNo estado.md: ${estadoExtra.filter((l) => l.startsWith('-')).join(' ')}` : '') + '\n');
  console.log('```\n' + (r.stdout + r.stderr).trim().split('\n').filter((l) => !l.startsWith('trava · base')).join('\n') + '\n```\n');
  return ok;
}

// o JSON: a primeira descrição com número, em qualquer profundidade
const DADOS = JSON.parse(BASE_TXT(DADO));
const acha = (o) => { if (Array.isArray(o)) { for (const x of o) { const r = acha(x); if (r) return r; } } else if (o && typeof o === 'object') { if (typeof o.descricao === 'string' && /\d/.test(o.descricao)) return o; for (const v of Object.values(o)) { const r = acha(v); if (r) return r; } } return null; };
const comNumero = acha(DADOS);
const jd = JSON.stringify(comNumero.descricao).slice(1, -1);
const num = jd.match(/\d+/)[0];
const jdNum = jd.replace(num, String(Number(num) + 1));

// a página: o primeiro <h2>
const pag = BASE_TXT(PAGINA);
const h2 = pag.match(/<h2\b[^>]*>([^<]+)<\/h2>/);

// o bloco gerado: o primeiro número de dentro dele
const gen = BASE_TXT(GEN);
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
console.log('contradicoes.md e um estado.md de teste e devolve o arquivo ao que era. Os avisos (linhas com · ou com "resolução:") não derrubam a trava.\n');
console.log('**"Próximo", a definição testável dos pares termo e número:** cada número da seção se liga a um termo protegido, o mais perto');
console.log('dele na mesma frase, medido em caracteres entre os dois (empate: o que vem antes). Se a frase não tem termo, ele se liga ao');
console.log('último termo da frase anterior, na mesma seção (a frase que virou duas). O multiconjunto dos pares de cada seção tem de ser');
console.log('igual antes e depois. Frase termina em . ! ? ; seguidos de espaço, em linha em branco e antes de linha de lista, tabela,');
console.log('título ou tag; a quebra de linha simples do parágrafo não termina frase. Seção é o trecho entre dois títulos de qualquer');
console.log('nível (no JSON, cada campo de prosa).\n');
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
// a linha Trava da RT-001 lida do contradicoes.md da missão, como está lá (três trechos, dois arquivos)
const CONTR = fs.readFileSync(path.resolve(REPO, '../tmp/revisao-textos/contradicoes.md'), 'utf8').replace(/\r/g, '');
const RT1 = CONTR.slice(CONTR.indexOf('## RT-001')).split('\n').find((l) => l.startsWith('- Trava:'));
const RT1trocas = [['Ticks de Preparação', 'Ticks de Preparo'], ['penalidades da Preparação', 'penalidades do Preparo']];
r.push(caso('a linha de trava da RT-001, como está no contradicoes.md, com as duas trocas do combate.md feitas', CAP, RT1trocas, [RT1], 'passa'));
r.push(caso('a linha de trava da RT-001 com o arquivo igual à base: passa, com aviso de entrada não aplicada', CAP, [], [RT1], 'passa'));
r.push(caso('a linha de trava da RT-001 com o arquivo reescrito em outro ponto e sem a troca: falha (página reescrita, entrada não aplicada; regra de 15/11/2026)', CAP, [[R1, R1b]], [RT1], 'falha'));
r.push(caso('a linha de trava da RT-001 com só uma das duas trocas do combate.md: falha (a outra não aplicada, numa página reescrita)', CAP, [RT1trocas[0]], [RT1], 'falha'));
const ESPERA = [['Ticks de Preparação', 'Ticks de Espera']];
r.push(caso('o "antes" da entrada saiu do arquivo sem o "depois" entrar ("Ticks de Preparação" vira "Ticks de Espera"): falha', CAP, ESPERA, [RT1], 'falha'));
const APAGA = `- Trava: \`${CAP}\`: "${R1} " → ""`;
r.push(caso('a entrada que apaga um trecho ("depois" vazio), com o trecho apagado: passa', CAP, [[R1 + ' ', '']], [APAGA], 'passa'));
r.push(caso('a mesma entrada que apaga, ainda não aplicada, com outra mudança coberta no arquivo: falha (página reescrita)', CAP, [[N1, N1b]], [APAGA, `- Trava: \`${CAP}\`: "${N1}" → "${N1b}"`], 'falha'));
r.push(caso('a linha de trava da RT-001 no JSON das armas extras', 'src/data/armas-extras.json', [['aceito pelo +2 na Preparação', 'aceito pelo +2 no Preparo']], [RT1], 'passa'));
console.log('## O sinal do número, os ambíguos em minúscula, a posição por seção e os pares termo e número\n');
const S1 = 'penalidades da Preparação (Defesa −2', S1b = 'penalidades da Preparação (Defesa +2';
r.push(caso('sinal trocado (Defesa −2 vira Defesa +2), sem entrada', CAP, [[S1, S1b]], [], 'falha'));
r.push(caso('sinal trocado, com entrada', CAP, [[S1, S1b]], [[S1, S1b]], 'passa'));
r.push(caso('ambíguo em minúscula muda de contagem (o primeiro "tempo" fora de "linha do tempo" vira "momento"): só aviso', CAP, [[/(?<![\p{L}])(?<!do )tempo(?![\p{L}])/u, 'momento']], [], 'passa'));
const capTxt = BASE_TXT(CAP);
const outroTitulo = capTxt.split('\n').find((l) => /^## /.test(l) && l !== H1);
const mover = [[N1, '(use a maior)'], [outroTitulo, `${outroTitulo}\n\nExemplo: Força 5 e Destreza 2.`]];
r.push(caso(`trecho muda de seção sem linha no estado.md (o exemplo "Força 5 e Destreza 2" sai de "${H1.slice(3)}" e vai para "${outroTitulo.slice(3)}")`, CAP, mover, [], 'falha'));
r.push(caso('o mesmo trecho movido, com a linha em "Movimentos de seção" do estado.md', CAP, mover, [], 'passa',
  [`- \`${CAP}\`: "${N1}" · de "${H1.slice(3)}" → "${outroTitulo.slice(3)}"`]));
r.push(caso('a frase reordenada dentro dela mesma (no Cego, "Bloqueio −8 e Esquiva −4"): os pares ficam', 'src/content/chapters/condicoes.md',
  [['(Esquiva −4 e Bloqueio −8 sabendo do ataque', '(Bloqueio −8 e Esquiva −4 sabendo do ataque']], [], 'passa'));
r.push(caso('a frase que vira duas (Força 5. E Destreza 2): os pares ficam', CAP, [[N1, '(Força 5. E Destreza 2? use a Força)']], [], 'passa'));
console.log('## Os casos de burla: todos têm de falhar\n');
r.push(caso('burla 1: número por extenso ("Força 5" vira "Força cinco")', CAP, [[N1, '(Força cinco e Destreza 2? use a Força)']], [], 'falha'));
r.push(caso('burla 2: "2 × menor(Centelha, Habilidade)" vira "menor(Centelha, Habilidade) × 2" (a primeira das duas)', CAP, [[/2 × menor\(Centelha, Habilidade\)/u, 'menor(Centelha, Habilidade) × 2']], [], 'falha'));
r.push(caso('burla 3: números trocados entre duas regras da mesma frase ("Defesa −2, e −4 no Tick do Golpe" vira "Defesa −4, e −2 no Tick do Golpe")', CAP,
  [['(Defesa −2, e −4 no Tick do Golpe)', '(Defesa −4, e −2 no Tick do Golpe)']], [], 'falha'));
r.push(caso('burla 4: a troca do Cego na mesma frase ("Esquiva −4 e Bloqueio −8" vira "Esquiva −8 e Bloqueio −4")', 'src/content/chapters/condicoes.md',
  [['(Esquiva −4 e Bloqueio −8 sabendo do ataque', '(Esquiva −8 e Bloqueio −4 sabendo do ataque']], [], 'falha'));
r.push(caso('burla 4 no JSON: a mesma troca na nota do Cego em condicoes.json', 'src/data/condicoes.json',
  [['Esquiva −4 e Bloqueio −8 sabendo', 'Esquiva −8 e Bloqueio −4 sabendo']], [], 'falha'));
console.log('## As linhas de tabela\n');
const ARM = 'src/content/chapters/armas-e-armaduras.md';
const PES = '| Pesada | 7 | 2d6 | +0 | −2 | 2 |', PESb = '| Pesada | 7 | 2d6 | −2 | +0 | 2 |';
r.push(caso('burla 5: duas colunas trocadas na mesma linha de tabela (Acerto e Defesa da Pesada, Cap. XIII)', ARM, [[PES, PESb]], [], 'falha'));
r.push(caso('as mesmas colunas trocadas, com entrada', ARM, [[PES, PESb]], [[PES, PESb]], 'passa'));
r.push(caso('a palavra de uma célula reescrita, sem número (a última célula da Pesada)', ARM, [['dano que vence armadura, mas lenta e te expõe, com guarda baixa', 'dano que vence armadura; lenta, te expõe e baixa a guarda']], [], 'passa'));
const capArm = BASE_TXT(ARM);
const cab = capArm.split('\n')[capArm.split('\n').indexOf('|---|:---:|:---:|:---:|:---:|:---:|---|') - 1];
r.push(caso('o cabeçalho da tabela reescrito, sem entrada', ARM, [[cab, cab.replace(/\| ([^|]+?) \|/, (m, c) => `| ${c} (classe) |`)]], [], 'falha'));
// no .astro: a primeira <tr> escrita à mão com duas <td> de número (das 38 páginas e dos componentes, só a
// configuracoes.astro tem; o resto das tabelas das páginas sai de JavaScript)
const PAG2 = 'src/pages/configuracoes.astro';
const pag2 = BASE_TXT(PAG2);
const tr = [...pag2.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/g)].find((m) => (m[0].match(/<td\b[^>]*>[^<{]*\d[^<{]*<\/td>/g) || []).length >= 2);
if (tr) {
  const tds = [...tr[0].matchAll(/<td\b[^>]*>([^<{]*\d[^<{]*)<\/td>/g)];
  const trocado = tr[0].replace(tds[0][0], '\u0000').replace(tds[1][0], tds[0][0]).replace('\u0000', tds[1][0]);
  r.push(caso(`burla 5 no .astro: duas <td> com número trocadas numa <tr> de ${PAG2}`, PAG2, [[tr[0], trocado]], [], 'falha'));
} else console.log(`(sem <tr> com duas <td> de número escritas à mão em ${PAG2}: o caso .astro fica de fora)\n`);
console.log('## A Trava JSON (campo fora da prosa)\n');
const PESO = /"peso": 0\.3,/u, PESOb = '"peso": 0.4,';
r.push(caso('campo fora da prosa mudado (o peso da adaga, 0.3 → 0.4), sem entrada', DADO, [[PESO, PESOb]], [], 'falha'));
r.push(caso('o mesmo campo, com a linha Trava JSON @[0].peso: 0.3 → 0.4', DADO, [[PESO, PESOb]], ['- Trava JSON: `src/data/armas.json` @[0].peso: 0.3 → 0.4'], 'passa'));
r.push(caso('a linha Trava JSON com o valor de antes errado (0.5)', DADO, [[PESO, PESOb]], ['- Trava JSON: `armas.json` @[0].peso: 0.5 → 0.4'], 'falha'));
r.push(caso('a linha Trava JSON certa, e outro campo fora da prosa mudado junto (o id)', DADO, [[PESO, PESOb], ['"id": "adaga"', '"id": "adaga-x"']], ['- Trava JSON: `armas.json` @[0].peso: 0.3 → 0.4'], 'falha'));
r.push(caso('a linha Trava JSON com valor que não é JSON', DADO, [[PESO, PESOb]], ['- Trava JSON: `armas.json` @[0].peso: 0,3 → 0.4'], 'falha'));
r.push(caso('a linha Trava JSON ainda não aplicada (o peso intacto), com o arquivo mudado só na prosa: passa, com aviso', DADO, [[jd, jd.replace(/^(\S+)/, (w) => w.toUpperCase())]], ['- Trava JSON: `armas.json` @[0].peso: 0.3 → 0.4'], 'passa'));
console.log('## As entradas PENDENTE AUTOR são puladas\n');
const PEND = '- Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"';
r.push(caso('entrada registrada cujo "antes" sai sem o "depois" entrar (controle: falha)', CAP, ESPERA, [PEND, '- Status: registrada'], 'falha'));
r.push(caso('a mesma mudança, com a entrada em Status "PENDENTE AUTOR, D-053": pulada, nada é cobrado dela', CAP, ESPERA, [PEND, '- Status: PENDENTE AUTOR, D-053'], 'passa'));
r.push(caso('a pendente pulada não cobre mudança: o número muda com a linha dela, e falha', CAP, [[N1, N1b]], ['- Trava: `src/content/chapters/combate.md`: "' + N1 + '" → "' + N1b + '"', '- Status: PENDENTE AUTOR (decisão contra decisão)'], 'falha'));
r.push(caso('Status "registrada (era PENDENTE AUTOR; resolvida pela T1)": a entrada NÃO é pulada, e o "antes" que sai sem o "depois" falha', CAP, ESPERA, [PEND, '- Status: registrada (era PENDENTE AUTOR; resolvida pela T1, 15/11/2026), a aplicar na fase 2'], 'falha'));
r.push(caso('o mesmo Status, com a troca feita: passa', CAP, [['Ticks de Preparação', 'Ticks de Preparo']], [PEND, '- Status: registrada (era PENDENTE AUTOR; resolvida pela T1, 15/11/2026), a aplicar na fase 2'], 'passa'));
r.push(caso('Status "**PENDENTE AUTOR**, D-053" (em negrito): pulada', CAP, [[R1, R1b]], [PEND, '- Status: **PENDENTE AUTOR**, D-053'], 'passa'));
console.log('## O pacote de 15/11/2026: página reescrita, trecho que encolhe, termos acrescentados, frase vazia, frontmatter, campos de prosa, quebra de linha no trecho e endereço de link\n');
// (a) página reescrita com entrada não aplicada falha; no JSON, aviso; com "Entradas adiadas", passa
const PRONO = '- Trava: `src/content/chapters/combate.md`: "**Caído** (prono)" → "**Caído**"';
r.push(caso('(a) página reescrita em outro ponto, com a entrada da RT-035 ainda não aplicada: falha', CAP, [[R1, R1b]], [PRONO], 'falha'));
r.push(caso('(a) a mesma, com linha em "Entradas adiadas" do estado.md: passa, com aviso', CAP, [[R1, R1b]], [PRONO], 'passa', [], ['## Entradas adiadas', '', `- \`${CAP}\` · RT-900 · caso de teste`]));
r.push(caso('(a) no src/data, a entrada não aplicada continua aviso (a prosa do JSON mudou em outro campo)', DADO, [[jd, jd.replace(/^(\S+)/, (w) => w.toUpperCase())]], ['- Trava: `src/data/armas.json`: "couro duro" → "couro mole"'], 'passa'));
// (b) o "depois" que é pedaço do "antes": a RT-035 só conta como aplicada quando o "(prono)" saiu
r.push(caso('(b) RT-035 aplicada ("**Caído** (prono)" vira "**Caído**"): passa', CAP, [['**Caído** (prono)', '**Caído**']], [PRONO], 'passa'));
r.push(caso('(b) RT-035 com o "(prono)" ainda no arquivo, e a página reescrita: falha (antes passava, porque o "depois" está dentro do "antes")', CAP, [[R1, R1b]], [PRONO], 'falha'));
// (c) termo acrescentado: com a linha, passa; sem a linha, falha (o caso "termo protegido aparece novo", acima)
r.push(caso('(c) termo protegido novo (Halterofilismo) com a linha em "Termos acrescentados": passa', CAP, [[T1, T1b]], [], 'passa', [],
  ['## Termos acrescentados', '', `- \`${CAP}\` · "Halterofilismo" · original: "${T1}" · novo: "${T1b}" · definido em: \`src/content/chapters/habilidades-secundarias.md\` (Corpo)`]));
r.push(caso('(c) a linha com outro arquivo não vale: falha', CAP, [[T1, T1b]], [], 'falha', [],
  ['## Termos acrescentados', '', '- `src/content/chapters/atributos.md` · "Halterofilismo" · original: "x" · novo: "y" · definido em: `x`']));
// (d) a frase vazia: o parágrafo partido depois de uma frase cujo número depende da anterior passa
const APAR = 'src/content/chapters/aparencia-virtudes-vontade.md';
r.push(caso('(d) a frase partida em parágrafos ("O terceiro é ... : 1 ponto"), que antes desfazia o par: passa', APAR,
  [['entre as três reservas. O terceiro é', 'entre as três reservas.\n\nO terceiro é']], [], 'passa'));
r.push(caso('(d) e o par trocado continua falhando (burla 4, de novo, depois do conserto)', 'src/content/chapters/condicoes.md',
  [['(Esquiva −4 e Bloqueio −8 sabendo do ataque', '(Esquiva −8 e Bloqueio −4 sabendo do ataque']], [], 'falha'));
// (e) o frontmatter
r.push(caso('(e) frontmatter mudado (o resumo), sem entrada: falha', CAP, [['resumo: "Como uma luta funciona:', 'resumo: "Como funciona uma luta:']], [], 'falha'));
r.push(caso('(e) o mesmo, com entrada: passa', CAP, [['resumo: "Como uma luta funciona:', 'resumo: "Como funciona uma luta:']], [['resumo: "Como uma luta funciona:', 'resumo: "Como funciona uma luta:']], 'passa'));
// (f) os campos de prosa: o "amarra" do antecedentes.json agora é prosa
const ANT = 'src/data/antecedentes.json';
const amarra = JSON.parse(BASE_TXT(ANT)).find((x) => x.id === 'reputacao').amarra;
const amJ = JSON.stringify(amarra).slice(1, 41);
r.push(caso('(f) o campo amarra reescrito sem número nem termo novo: passa (antes era estrutural e falhava)', ANT, [[amJ, amJ.replace('um ', 'Um ')]], [], 'passa'));
r.push(caso('(f) e um número mudado dentro dele continua falhando', ANT, [[/(Neutro\*\* na Régua de Relação, no contexto em que a fama pesa \(ver \\"Onde a régua já começa\\"\): a metade do nível do traço \(para baixo\))/u, '$1 +1']], [], 'falha'));
// (g) "\n" no trecho da linha Trava
const REG = 'src/content/chapters/acoes-e-sistema.md';
const L30 = '| 30 | Sobre-humano | 18 | Semideus |', L35 = '| 35 | Lendário | 21 | além do teto do jogador |';
r.push(caso('(g) duas linhas de tabela com "\\n" no trecho da entrada: passa', REG, [[L30, L30 + '\n' + L35]], ['- Trava: `' + REG + '`: "' + L30 + '" → "' + L30 + '\\n' + L35 + '"'], 'passa'));
r.push(caso('(g) as mesmas linhas sem entrada: falha', REG, [[L30, L30 + '\n' + L35]], [], 'falha'));
// (h) termo dentro de endereço de link
const REL = 'src/content/chapters/relacoes-sociais.md';
r.push(caso('(h) link novo para /regras/aparencia-virtudes-vontade (o "virtudes" do endereço não conta como termo): passa', REL,
  [['Comece pela régua; as outras duas são escaladas dela.', 'Comece pela régua; as outras duas são escaladas dela ([Cap. III](/regras/aparencia-virtudes-vontade)).']], [], 'passa'));
r.push(caso('(h) e o mesmo termo no texto do link falha', REL,
  [['Comece pela régua; as outras duas são escaladas dela.', 'Comece pela régua; as outras duas são escaladas dela ([as Virtudes](/regras/x)).']], [], 'falha'));
console.log('## O CORRIGE da Revisora no f003b69b: comando-barra, o trecho que cresce, as exceções, o par pela frase anterior e o número do endereço\n');
// o comando-barra.json: o "exemplo" é sintaxe da barra, e não prosa
r.push(caso('o "exemplo" do comando-barra.json mudado sem número ("tirar" vira "retirar"): falha (é sintaxe da barra do Grid, fora da prosa)', 'src/data/comando-barra.json', [['"exemplo": "tirar"', '"exemplo": "retirar"']], [], 'falha'));
// (b) o trecho que cresce (o "antes" dentro do "depois"), numa página reescrita: a RT-101 do condicoes.md
const CND = 'src/content/chapters/condicoes.md';
const F_A = 'O Frenesi do orc e do meio-orc segue a regra própria.', F_D = 'O Frenesi do orc e do meio-orc e a Técnica Fúria do Caminho Sangue Fervente seguem a regra própria de cada um.';
const RT101 = `- Trava: \`${CND}\`: "${F_A}" → "${F_D}"`;
const CND_OUTRA = ['diz o que a faz entrar', 'diz o que a faz começar'];
r.push(caso('(b) RT-101 no condicoes.md, o trecho que cresce, aplicada: passa', CND, [[F_A, F_D]], [RT101], 'passa'));
r.push(caso('(b) RT-101 não aplicada, com a página reescrita em outro ponto: falha', CND, [CND_OUTRA], [RT101], 'falha'));
// as exceções do estado.md
r.push(caso('Entradas adiadas: a linha sem motivo não vale (a entrada segue não aplicada e a rodada cai)', CAP, [[R1, R1b]], [PRONO], 'falha', [], ['## Entradas adiadas', '', `- \`${CAP}\` · RT-900`]));
r.push(caso('Entradas adiadas: a adiada cuja entrada já está aplicada passa, com aviso para tirar a linha', CAP, [['**Caído** (prono)', '**Caído**']], [PRONO], 'passa', [], ['## Entradas adiadas', '', `- \`${CAP}\` · RT-900 · caso de teste`]));
r.push(caso('Entradas adiadas: a adiada sem entrada no arquivo passa, com aviso', CAP, [[R1, R1b]], [], 'passa', [], ['## Entradas adiadas', '', `- \`${CAP}\` · RT-901 · caso de teste`]));
r.push(caso('Termos acrescentados: a linha sem "definido em" não vale (falha)', CAP, [[T1, T1b]], [], 'falha', [],
  ['## Termos acrescentados', '', `- \`${CAP}\` · "Halterofilismo" · original: "${T1}" · novo: "${T1b}"`]));
// o par pela frase anterior: "(nenhum)" contra o termo da frase anterior é aviso; termo A para termo B continua falha
const VIDA = 'src/content/chapters/vida-ferimentos-cura.md';
r.push(caso('par que só troca "(nenhum)" pelo termo da frase anterior ("Ele é lento" vira "O Sangramento é lento", em parágrafo próprio): passa, com aviso', VIDA,
  [['desalinhados. Ele é lento de propósito:', 'desalinhados.\n\nO Sangramento é lento de propósito:']], [], 'passa'));
const RAC = 'src/content/chapters/racas.md';
r.push(caso('par achado pela frase anterior que passa do termo A ao termo B (o +1 do quadro sai do Humano e vai ao Elfo): falha', RAC,
  [['o **Humano** é a régua contra a qual todos os outros são descritos.', 'o **Elfo** é a régua contra a qual todos os outros são descritos.']], [], 'falha'));
// o número dentro do endereço de link
r.push(caso('link novo com número no endereço (âncora "#parte-3"): passa (o endereço sai de toda contagem)', REL,
  [['Comece pela régua; as outras duas são escaladas dela.', 'Comece pela régua; as outras duas são escaladas dela ([Cap. III](/regras/aparencia-virtudes-vontade#parte-3)).']], [], 'passa'));
r.push(caso('e o mesmo número no texto do link falha', REL,
  [['Comece pela régua; as outras duas são escaladas dela.', 'Comece pela régua; as outras duas são escaladas dela ([parte 3](/regras/x)).']], [], 'falha'));
console.log('## A entrada que não casa falha\n');
r.push(caso('entrada que pede (3×) num trecho que está 2 vezes', CAP, [[/Preparação/gu, 'Preparo']], ['- Trava: `src/content/chapters/combate.md`: "Preparação" → "Preparo" (3×)'], 'falha'));
r.push(caso('entrada com "antes" que não está na base', CAP, [[N1, N1b]], [['(Força 7 e Destreza 2? use a Força)', N1b]], 'falha'));
r.push(caso('entrada certa, mas com outra mudança fora dela', CAP, [[N1, N1b], [D1, D1b]], [[N1, N1b]], 'falha'));
const sujo = git('status', '--porcelain', '--', 'src').trim();
console.log(`## Resultado\n\n${r.filter(Boolean).length} de ${r.length} casos deram o esperado. Árvore depois da prova: ${sujo ? 'SUJA: ' + sujo : 'limpa em src/ (git status --porcelain -- src vazio)'}.`);
fs.rmSync(tmp, { recursive: true, force: true });
if (r.some((x) => !x) || sujo) process.exit(1);
