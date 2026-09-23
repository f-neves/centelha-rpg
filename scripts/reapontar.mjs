// REAPONTA citações `arquivo.ext:NNN` pelo MAPA DE LINHAS DO DIFF, nunca por busca de âncora.
//
//   node scripts/reapontar.mjs          · reaponta e imprime o que mudou
//   node scripts/reapontar.mjs --tudo   · passa também pelas citações de arquivo SEM diff, e
//                                         endireita as que estão tortas dentro da janela
//   node scripts/reapontar.mjs --check  · não escreve nada, só confere a cobertura
//
// DEPOIS DO MAPA, A ÂNCORA DECIDE A LINHA, DENTRO DA JANELA (rodada 93). O mapa diz para onde a
// linha citada ANDOU; se a citação já nasceu torta (a âncora uma linha abaixo, digamos), o mapa a
// leva adiante torta, e o portão, com a mesma folga de ±3, fica verde para sempre. Foi o caso do
// `const condId` de `L-simulacao-simultaneo.md`, uma linha fora de 84228f3 até a rodada 92. Agora,
// com a linha mapeada em mãos, o script procura a âncora na janela dela: se a própria linha a
// tem, fica; se UMA só linha da janela a tem, grava essa; se duas ou mais têm, NÃO ESCOLHE e avisa.
// Isto não é a busca que o `L65` proíbe: a busca é presa à janela da linha que o mapa deu, e
// âncora repetida na janela não é resolvida por proximidade.
//
// POR QUE O MAPA E NÃO A BUSCA (`L65`): âncoras como `await SB.from` ou `LOG.splice` repetem
// dezenas de vezes num arquivo vivo, então procurar a âncora pode casar na linha errada e o
// portão da procedência fica VERDE sobre uma citação FALSA, que é estritamente pior que
// vermelho. O deslocamento, esse, é determinístico: sai dos cabeçalhos `@@` do próprio diff.
//
// POR QUE ELE ESTÁ NO REPOSITÓRIO, desde 11/09/2026 (rodada 46): porque não estava. Ele viveu
// por dezenas de rodadas no scratchpad do Arquiteto da vez, e a Executora descobriu isso ao
// receber a instrução "as duas listas mudam no mesmo commit" e não achar a segunda lista em
// lugar nenhum. Uma ferramenta de que a disciplina inteira depende, morando fora do
// versionamento, some junto com a sessão · e quem viesse depois cairia de volta na busca por
// âncora, que é justamente o que o `L65` proíbe.
//
// A LISTA DAQUI NUNCA PODE SER MAIS ESTREITA QUE O `ALVOS` DO PORTÃO, e a direção importa:
//   · portão vê 12 documentos e o reapontador vê 3 → citação envelhece nos outros 9, o portão
//     trava o commit, e quem estiver commitando caça dívida que não criou. PERIGOSO.
//   · reapontador vê 12 e o portão vê 2 → ele conserta citação que ninguém confere. INÓCUO.
// Por isso a conferência abaixo é de um lado só, e por isso ampliar o reapontador PRIMEIRO e o
// portão DEPOIS é sempre seguro.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHECK = process.argv.includes('--check');
const TUDO = process.argv.includes('--tudo');
const PORTAO = 'scripts/test-procedencia.mjs';
// A MESMA do portão (`test-procedencia.mjs`, `JANELA = 3`). Serve às duas coisas: endireitar a
// citação e conferir o próprio trabalho no fim.
const JANELA = 3;
const ehCitacaoTxt = (t) => /^[\w./-]+\.(?:ts|astro|mjs):\d+(?:-\d+)?$/.test(t.trim());

// Os documentos cujas citações este script mantém. Superconjunto do `ALVOS` do portão.
const DOCS = [
  'docs/pendencias/B-bestiario.md',
  'docs/pendencias/I-mesa-tempo-real.md',
  'docs/pendencias/K-combate-linha-do-tempo.md',
  'docs/pendencias/L-simulacao-simultaneo.md',
  'docs/simulacao/ESTADO.md',
  'docs/simulacao/VOZ.md',
  'docs/simulacao/REVISORA.md',
  'docs/simulacao/CONJURACAO.md',
  'docs/simulacao/CONTEXTO.md',
  'docs/simulacao/CATALOGO.md',
  'Grid_Mobile.md',
  'Migracao_Dominio.md',
  'Auditoria_Tecnica.md',
  'Dominio.md',
  'Regua_Relacao.md',
];

// ---- 0. a conferência de cobertura: o portão não pode ver documento que este script não vê
{
  // O BLOCO INTEIRO DA ATRIBUIÇÃO, e não a primeira linha dela. A versão que lia uma linha só
  // imprimiu `✓ os 0 documento(s) do portão estão entre os 12 daqui` no dia em que nasceu,
  // porque o `ALVOS` de lá passou a ocupar nove linhas: o verde era sobre NADA MEDIDO, que é o
  // zero ambíguo do CATALOGO dentro da própria conferência escrita para evitá-lo. Achado pelo
  // controle negativo (tirar um documento do DOCS daqui e exigir vermelho), que continuou verde.
  const fonte = fs.readFileSync(PORTAO, 'utf8');
  const bloco = fonte.match(/const ALVOS\s*=\s*\[([\s\S]*?)\]/);
  if (!bloco) {
    console.log(`\n✘ não achei a atribuição de \`ALVOS\` em ${PORTAO}.`);
    console.log('  Sem ela esta conferência não mede nada, e verde aqui não valeria nada.');
    process.exit(1);
  }
  const doPortao = [...bloco[1].matchAll(/'([^']+\.md)'/g)].map((m) => m[1]);
  if (!doPortao.length) {
    console.log(`\n✘ a atribuição de \`ALVOS\` em ${PORTAO} não nomeou documento nenhum.`);
    process.exit(1);
  }
  const meus = new Set(DOCS.map((d) => path.basename(d)));
  const fora = doPortao.filter((d) => !meus.has(path.basename(d)));
  if (fora.length) {
    console.log(`\n✘ o portão confere ${fora.length} documento(s) que este script não reaponta:`);
    for (const f of fora) console.log(`    ${f}`);
    console.log('  Acrescente-os ao DOCS daqui ANTES de ampliar o ALVOS de lá.');
    process.exit(1);
  }
  console.log(`✓ cobertura: os ${doPortao.length} documento(s) do portão estão entre os ${DOCS.length} daqui`);
  if (CHECK) process.exit(0);
}

// ---- 1. os alvos: o que mudou na árvore e é citável
const mudados = execSync('git diff --name-only', { encoding: 'utf8' })
  .split(/\r?\n/).filter((f) => /\.(ts|astro|mjs)$/.test(f));

const porNome = {};
for (const f of mudados) {
  const base = path.basename(f);
  if (base in porNome) {
    console.log(`  ! dois arquivos mudados com o mesmo nome (${base}). PULANDO os dois: o nome não`);
    console.log('    identifica o arquivo, e citação aqui é por nome de base. Reaponte à mão.');
    porNome[base] = null;
    continue;
  }
  porNome[base] = f;
}

// ---- 2. um mapa velho→novo por alvo, construído dos hunks
const mapas = {};
for (const [base, arq] of Object.entries(porNome)) {
  if (!arq) continue;
  // CONTRA HEAD, NÃO CONTRA O ÍNDICE. `git diff` sem argumento é índice→árvore,
  // e um arquivo `git add`-ado e editado de novo (`MM` no `status`) tem duas
  // metades: o que já está no índice e o que ainda não foi. `-U0` sem `HEAD`
  // só via a segunda metade, e desloca pelo mapa errado: medido em
  // 13/09/2026, `src/lib/artes-grid.ts` deu 31+/24− sem `HEAD` e 51+/7− com.
  // As citações existem contra o que a ÁRVORE tem agora, não contra o índice.
  const diff = execSync(`git diff HEAD -U0 -- "${arq}"`, { encoding: 'utf8', maxBuffer: 1 << 28 });
  const hunks = [];
  for (const m of diff.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/gm)) {
    hunks.push({
      velhoIni: +m[1], velhoN: m[2] === undefined ? 1 : +m[2],
      novoIni: +m[3], novoN: m[4] === undefined ? 1 : +m[4],
    });
  }
  hunks.sort((a, b) => a.velhoIni - b.velhoIni);
  mapas[base] = hunks;
  console.log(`alvo ${arq}: ${hunks.length} hunk(s)`);
}

// ---- 2b. no `--tudo`, todo arquivo citável do `src/` e do `scripts/`, pelo nome, como o portão
// acha os dele. Nome repetido em dois lugares fica de fora: o nome não identifica o arquivo.
const todos = {};
if (TUDO) {
  const varrer = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      const p = path.join(dir, e.name).replace(/\\/g, '/');
      if (e.isDirectory()) varrer(p);
      else if (/\.(ts|astro|mjs)$/.test(e.name)) todos[e.name] = e.name in todos ? null : p;
    }
  };
  for (const d of ['src', 'scripts']) if (fs.existsSync(d)) varrer(d);
}
/** O arquivo de uma citação: o do diff primeiro, depois (no `--tudo`) o da varredura. */
const arquivoDe = (base) => porNome[base] || (TUDO ? todos[base] : null) || null;

const cacheFonte = {};
const fonteDe = (arq) => (cacheFonte[arq] ??= fs.readFileSync(arq, 'utf8').split(/\r?\n/));

/**
 * A âncora de uma citação: o trecho entre crases MAIS PRÓXIMO na linha que não seja outra
 * citação nem só pontuação e número. É a mesma regra do portão, e devolve o miolo antes do
 * primeiro parêntese, que é o que o portão compara.
 */
function ancoraDe(linhaDoc, emCit) {
  const anc = [...linhaDoc.matchAll(/`([^`]+)`/g)].map((m) => ({ em: m.index, txt: m[1] }))
    .filter((c) => !ehCitacaoTxt(c.txt) && !/^[\d\s.,:;()-]+$/.test(c.txt))
    .sort((a, b) => Math.abs(a.em - emCit) - Math.abs(b.em - emCit))[0];
  return anc ? anc.txt.split('(')[0].trim() : null;
}

/**
 * A linha onde a âncora ESTÁ, procurada só na janela da linha `n` que o mapa deu.
 * `{ linha, ambigua }`: a própria `n` se ela tem a âncora; a única da janela que a tem; ou `n`
 * de volta, com `ambigua`, quando duas ou mais têm. Sem âncora na janela, `n` de volta: aí quem
 * reclama é o portão, e com razão.
 */
function ancorar(fonte, n, chave) {
  if (!chave || (fonte[n - 1] ?? '').includes(chave)) return { linha: n, ambigua: false };
  const achadas = [];
  for (let k = Math.max(1, n - JANELA); k <= Math.min(fonte.length, n + JANELA); k += 1) {
    if (fonte[k - 1].includes(chave)) achadas.push(k);
  }
  if (achadas.length === 1) return { linha: achadas[0], ambigua: false };
  return { linha: n, ambigua: achadas.length > 1 };
}

/** Onde a linha VELHA `L` de `base` foi parar. `null` se ela foi apagada. */
function mapear(base, L) {
  let desloc = 0;
  for (const h of mapas[base]) {
    const fimVelho = h.velhoIni + h.velhoN - 1;
    if (h.velhoN === 0) {                 // inserção pura, depois de velhoIni
      if (L > h.velhoIni) desloc += h.novoN;
      continue;
    }
    if (L > fimVelho) { desloc += h.novoN - h.velhoN; continue; }
    if (L >= h.velhoIni) {
      // dentro de um bloco alterado: a linha citada vira a PRIMEIRA do bloco novo
      return h.novoN === 0 ? null : h.novoIni + (L - h.velhoIni <= h.novoN - 1 ? L - h.velhoIni : 0);
    }
  }
  return L + desloc;
}

// ---- 3. reescreve, respeitando a marca histórica com o MESMO território do portão
//
// A marca guarda o que um documento alheio disse num dia passado. Reapontá-la apagaria o
// próprio achado que a linha existe para registrar, e desfaria o trabalho do `L72`.
const CITACAO = /`?(?:[\w.-]+\/)*([A-Za-z0-9_.-]+\.(?:ts|astro|mjs)):(\d+)(?:-(\d+))?`?/g;
const MARCA_HISTORICA = /\(citaç[aã]o histórica\)/;
let total = 0;
let historicas = 0;
let endireitadas = 0;
const ambiguas = [];
const caidas = [];
/** Cada citação que este script moveu, para ele conferir o próprio trabalho no fim. */
const movidas = [];
for (const doc of DOCS) {
  if (!fs.existsSync(doc)) { console.log(`  ! ${doc} não existe, pulando`); continue; }
  const linhas = fs.readFileSync(doc, 'utf8').split(/\r?\n/);
  let mudou = 0;
  for (let i = 0; i < linhas.length; i += 1) {
    const l = linhas[i];
    const todas = [...l.matchAll(CITACAO)];
    if (!todas.length) continue;
    let nova = '';
    let cursor = 0;
    for (const m of todas) {
      const [todo, base, a, b] = m;
      nova += l.slice(cursor, m.index);
      cursor = m.index + todo.length;
      const alvo = arquivoDe(base);
      if (!mapas[base] && !alvo) { nova += todo; continue; }
      const proximaEm = todas.map((o) => o.index).filter((em) => em > m.index)
        .sort((x, y) => x - y)[0] ?? l.length;
      if (MARCA_HISTORICA.test(l.slice(cursor, proximaEm))) { historicas += 1; nova += todo; continue; }
      const mapeada = mapas[base] ? mapear(base, +a) : +a;
      if (mapeada == null) { caidas.push(`${doc}:${i + 1} → ${base}:${a}`); nova += todo; continue; }
      let na = mapeada;
      if (alvo && fs.existsSync(alvo)) {
        const r = ancorar(fonteDe(alvo), mapeada, ancoraDe(l, m.index));
        if (r.ambigua) ambiguas.push(`${doc}:${i + 1} → ${base}:${mapeada}`);
        na = r.linha;
      }
      if (na !== mapeada) endireitadas += 1;
      const nbMapeada = b ? (mapas[base] ? mapear(base, +b) : +b) : null;
      const nb = nbMapeada == null ? null : nbMapeada + (na - mapeada);
      if (na === +a && (!b || nb === +b)) { nova += todo; continue; }
      mudou += 1;
      movidas.push({ doc, i, base, alvo, de: +a, para: na });
      nova += todo.replace(`${base}:${a}${b ? `-${b}` : ''}`, `${base}:${na}${b ? `-${nb ?? b}` : ''}`);
    }
    nova += l.slice(cursor);
    linhas[i] = nova;
  }
  if (mudou) fs.writeFileSync(doc, linhas.join('\n'));
  total += mudou;
  if (mudou) console.log(`${doc}: ${mudou} citação(ões) reapontadas`);
}
for (const c of caidas) console.log(`  ! ${c} caiu dentro do diff, deixada como está`);
for (const c of ambiguas) {
  console.log(`  ! ${c}: a âncora aparece mais de uma vez na janela e a linha mapeada não a tem.`);
  console.log('    Não escolhi por proximidade (`L65`). Reaponte à mão, olhando o que a citação afirma.');
}

// ---- 4. A CONFERÊNCIA DO PRÓPRIO TRABALHO, e ela existe por um estrago de verdade.
//
// Em 12/09/2026 o Arquiteto rodou este script DUAS VEZES contra o mesmo diff não commitado
// (a Executora tinha um eixo pronto e começou o seguinte antes de commitar). O mapa é
// HEAD→árvore, então o deslocamento foi aplicado uma segunda vez sobre citações que já
// estavam certas: 39 quebraram de uma vez, e `async function curar` foi parar 80 linhas
// adiante. O script não tinha como notar, porque ele MOVIA EM SILÊNCIO: quem descobria era
// o portão, três passos depois, sem dizer qual das duas passadas causou.
//
// A conferência abaixo é a MESMA do portão (âncora entre crases mais próxima na linha,
// janela de ±3, comparação pelo miolo antes do primeiro parêntese). Rodar duas vezes
// continua sendo possível; o que muda é que agora ele GRITA na segunda.
const quebradas = [];
for (const mv of movidas) {
  if (!mv.alvo || !fs.existsSync(mv.alvo)) continue;
  const linhaDoc = fs.readFileSync(mv.doc, 'utf8').split(/\r?\n/)[mv.i] ?? '';
  const emCit = linhaDoc.indexOf(`${mv.base}:${mv.para}`);
  if (emCit < 0) continue;
  const crases = [...linhaDoc.matchAll(/`([^`]+)`/g)].map((m) => ({ em: m.index, txt: m[1] }));
  const anc = crases
    .filter((c) => !ehCitacaoTxt(c.txt) && !/^[\d\s.,:;()-]+$/.test(c.txt))
    .sort((a, b) => Math.abs(a.em - emCit) - Math.abs(b.em - emCit))[0];
  if (!anc) continue;                       // sem âncora o portão já reclama por conta dele
  const fonte = fs.readFileSync(mv.alvo, 'utf8').split(/\r?\n/);
  const janela = fonte.slice(Math.max(0, mv.para - 1 - JANELA), mv.para + JANELA).join('\n');
  const chave = anc.txt.split('(')[0].trim();
  if (!janela.includes(chave)) {
    quebradas.push(`${mv.doc}:${mv.i + 1}  ${mv.base}:${mv.de} → ${mv.para}, mas \`${chave}\` não está lá`);
  }
}
if (quebradas.length) {
  console.log(`\n✘ EU MOVI E QUEBREI ${quebradas.length} citação(ões). NÃO COMMITE ASSIM.`);
  for (const q of quebradas) console.log(`    ${q}`);
  console.log('\n  SÃO DUAS CAUSAS POSSÍVEIS, e elas pedem consertos opostos:');
  console.log('\n  (a) A LINHA CITADA FOI REESCRITA, e não só deslocada. O mapa do diff sabe para');
  console.log('      onde uma linha ANDOU, e não tem o que dizer sobre uma que virou outra coisa.');
  console.log('      Confira a âncora no arquivo: se aquele trecho não existe mais, a citação não');
  console.log('      é para reapontar, é para ATUALIZAR (o texto também mudou de assunto) ou para');
  console.log('      marcar `(citação histórica)`, quando ela existe para guardar o que o código');
  console.log('      dizia no dia do achado. Esta é a causa mais comum quando a rodada MUDOU');
  console.log('      justamente o código que o documento descrevia, que é o caso de um conserto.');
  console.log('\n  (b) ESTE SCRIPT RODOU DUAS VEZES sobre o mesmo diff não commitado: o mapa é');
  console.log('      HEAD→árvore, e a segunda passada desloca de novo o que a primeira acertou.');
  console.log('      Sintoma: MUITAS citações quebradas de uma vez, em documentos variados, e');
  console.log('      nenhuma relação entre elas e o que a rodada mexeu. O conserto é commitar o');
  console.log('      código e reapontar do commit, ou refazer as citações do último commit verde.');
  console.log('\n  Em nenhum dos dois o conserto é BUSCAR A ÂNCORA no arquivo: o `L65` proíbe, e');
  console.log('  a medida de 12/09/2026 mostra por quê (âncoras como `if` aparecem 884 vezes).');
}

console.log(`\n${total} citação(ões) movidas pelo mapa do diff`
  + (endireitadas ? ` (${endireitadas} delas endireitada(s) para a linha da âncora)` : '')
  + (historicas ? `, ${historicas} pulada(s) por \`(citação histórica)\`` : '') + '.');
console.log('AGORA RODE O PORTÃO (`npm run validate`). O número acima fala só dos arquivos');
console.log('mudados na árvore; o portão fala de todas as citações que existem.');
