// REAPONTA citações `arquivo.ext:NNN` pelo MAPA DE LINHAS DO DIFF, nunca por busca de âncora.
//
//   node scripts/reapontar.mjs          · reaponta e imprime o que mudou
//   node scripts/reapontar.mjs --check  · não escreve nada, só confere a cobertura
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
const PORTAO = 'scripts/test-procedencia.mjs';

// Os documentos cujas citações este script mantém. Superconjunto do `ALVOS` do portão.
const DOCS = [
  'Pendencias.md',
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
  const diff = execSync(`git diff -U0 -- "${arq}"`, { encoding: 'utf8', maxBuffer: 1 << 28 });
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
      if (!mapas[base]) { nova += todo; continue; }
      const proximaEm = todas.map((o) => o.index).filter((em) => em > m.index)
        .sort((x, y) => x - y)[0] ?? l.length;
      if (MARCA_HISTORICA.test(l.slice(cursor, proximaEm))) { historicas += 1; nova += todo; continue; }
      const na = mapear(base, +a);
      if (na == null) { caidas.push(`${doc}:${i + 1} → ${base}:${a}`); nova += todo; continue; }
      const nb = b ? mapear(base, +b) : null;
      if (na === +a && (!b || nb === +b)) { nova += todo; continue; }
      mudou += 1;
      movidas.push({ doc, i, base, alvo: porNome[base], de: +a, para: na });
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
const JANELA = 3;
const ehCitacaoTxt = (t) => /^[\w./-]+\.(?:ts|astro|mjs):\d+(?:-\d+)?$/.test(t.trim());
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
  + (historicas ? `, ${historicas} pulada(s) por \`(citação histórica)\`` : '') + '.');
console.log('AGORA RODE O PORTÃO (`npm run validate`). O número acima fala só dos arquivos');
console.log('mudados na árvore; o portão fala de todas as citações que existem.');
