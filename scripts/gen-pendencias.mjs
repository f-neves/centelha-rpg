// Regera as duas tabelas do `Pendencias.md` (a contagem por tema e a lista de itens) a partir
// dos arquivos de tema em `docs/pendencias/`.
//
// POR QUE. O `Pendencias.md` era uma tabela de contagem escrita à mão, e ela já tinha divergido
// das caixas (rodada 94, 23/09/2026): o índice contava `- [~]` como aberto, quem conferia por
// `- [ ]`/`- [x]` achava menos, e a prosa ao lado ainda somava "mais os cinco E4 a E8" que a
// tabela já contava. São as "duas listas que precisam concordar" do `CATALOGO.md`. Os arquivos
// de tema são a fonte; o índice só reflete, e a parte escrita à mão do `Pendencias.md` fica
// sendo a camada de direção (quem decide, o que trava o quê), fora dos marcadores.
//
// O QUE ELE LÊ, e é o formato de todos os doze arquivos: um item é uma linha da coluna 0 que
// começa com `- [ ]` (aberto), `- [~]` (parcial) ou `- [x]` (fechado), seguida de
// `**SIGLA · ...**`, às vezes dentro de `~~ ~~`. A sigla é `[A-L]\d+[a-z]?`. A marcação é o
// começo em maiúsculas do primeiro `[...]` depois da sigla (`DECIDIR`, `FAZER`, `AUTOR`...).
//
// O QUE ELE ACUSA, sem consertar (a caixa só muda com prova, e isso é de quem edita o tema):
// sigla repetida no mesmo arquivo, item aberto com o título riscado, item sem sigla, sigla com a
// letra de outro tema. Isso vai para a lista de anomalias, e o `--check` continua verde.
//
// O QUE ELE RECUSA, e aqui o `--check` fica VERMELHO (rodada 95, CORRIGE da 94): toda linha com
// cara de caixa que o formato de item não casa. A Revisora plantou onze casos numa cópia e seis
// sumiam da contagem sem aviso (caixa aninhada com espaço ou tab, `[~]` em subitem, `* [ ]`,
// `- [ ]**` colado, `- [?]`). Uma caixa que o gerador não lê é uma caixa do tema que o índice não
// conta, e o índice promete que o `validate` acusa a divergência. Então ele não adivinha: recusa, e
// diz a linha. O que está dentro de cerca de código (``` ou ~~~) é exemplo, e é pulado.
// Os casos estão em `scripts/test-gen-pendencias.mjs`.
//
// O script reescreve só o miolo entre os marcadores
//   <!-- gen:pendencias-contagem --> … <!-- /gen:pendencias-contagem -->
//   <!-- gen:pendencias-itens --> … <!-- /gen:pendencias-itens -->
// e não toca em mais nada do arquivo.
//
//   node scripts/gen-pendencias.mjs                 · regera
//   node scripts/gen-pendencias.mjs --check         · só confere (entra no `validate`)
//   node scripts/gen-pendencias.mjs --raiz <pasta>  · roda sobre outra cópia (o ensaio do portão)
import fs from 'node:fs';
import path from 'node:path';

const iRaiz = process.argv.indexOf('--raiz');
const raiz = iRaiz > 0
  ? path.resolve(process.argv[iRaiz + 1])
  : path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DIR = path.join(raiz, 'docs/pendencias');
const INDICE = path.join(raiz, 'Pendencias.md');

const ESTADO = { ' ': 'aberto', '~': 'parcial', x: 'fechado', X: 'fechado' };
const ITEM = /^- \[( |~|x|X)\] (.*)$/;
const SIGLA = /^([A-L]\d+[a-z]?)\b/;
// Qualquer marcador de lista (`-`, `*`, `+`, `1.`, `1)`), com ou sem recuo, seguido de uma caixa de
// no máximo um caractere. É a régua com que a Revisora varreu os temas na 94.
const CARA_DE_CAIXA = /^\s*([-*+]|\d+[.)])\s*\[.?\]/;
const CERCA = /^\s*(```|~~~)/;

/** O começo em maiúsculas de um `[...]`: `[FAZER/DECIDIR]` → `FAZER/DECIDIR`, `[ANOTADO em 10/09]` → `ANOTADO`. */
function marcacaoDe(txt) {
  // Só o colchete que vem logo depois da sigla (e de um parêntese, como o do B13), e não um link
  // `[texto](...)` do meio do parágrafo.
  const m = txt.replace(/^\s*(\([^)]*\))?\s*·?\s*/, '').match(/^\[([^\]]*)\]?/);
  if (!m) return '';
  const fichas = [];
  for (const f of m[1].split(/\s+/)) {
    const limpa = f.replace(/[,·]$/, '');
    if (!limpa || /\p{Ll}/u.test(limpa)) break;
    fichas.push(f);
  }
  const marca = fichas.join(' ').replace(/[,·]$/, '');
  return /\p{Lu}/u.test(marca) ? marca : '';
}

/** O título: o negrito da primeira linha, sem sigla, sem marcação, sem risco, cortado em 110. */
function tituloDe(resto, sigla) {
  let t = resto.replace(/~~/g, '');
  const negrito = t.match(/^\*\*(.*?)(\*\*|$)/);
  t = negrito ? negrito[1] : t;
  if (sigla) t = t.replace(new RegExp(`^${sigla}\\b[^·]*?·\\s*`), '').replace(new RegExp(`^${sigla}\\b\\s*`), '');
  // Quando o negrito é só a etiqueta (o L62), o título é o que está dentro dela.
  const soEtiqueta = t.match(/^\[([^\]]*)\]\s*$/);
  t = soEtiqueta ? soEtiqueta[1].trim() : t.replace(/^\[[^\]]*\]\s*/, '').trim();
  if (t.length > 110) t = `${t.slice(0, 110).replace(/\s+\S*$/, '')} …`;
  return t.replace(/\|/g, '\\|');
}

const naoLidas = [];
const temas = fs.readdirSync(DIR).filter((f) => /^[A-L]-.*\.md$/.test(f)).sort();
const dados = temas.map((arq) => {
  const linhas = fs.readFileSync(path.join(DIR, arq), 'utf8').split(/\r?\n/);
  const tema = (linhas.find((l) => /^# /.test(l)) || '').replace(/^#\s*[A-L]\.\s*/, '').trim();
  const itens = [];
  let naCerca = false;
  for (let i = 0; i < linhas.length; i += 1) {
    if (CERCA.test(linhas[i])) { naCerca = !naCerca; continue; }
    if (naCerca) continue;
    const m = linhas[i].match(ITEM);
    if (!m) {
      if (CARA_DE_CAIXA.test(linhas[i])) naoLidas.push(`${arq}:${i + 1}  ${linhas[i].trim()}`);
      continue;
    }
    // O negrito do título às vezes quebra de linha (o L29, o K28): junta as seguintes até ele
    // fechar, no máximo quatro. SÓ quando o negrito foi aberto na primeira linha, e parando em
    // linha em branco, cabeçalho ou qualquer coisa com cara de caixa (mesmo recuada): sem isso, um
    // item de sigla sem negrito engolia a linha seguinte no título (caso da Revisora na 94).
    let resto = m[2];
    const abriuNegrito = /^(~~)?\*\*/.test(resto);
    for (let k = 1; abriuNegrito && k <= 4 && (resto.match(/\*\*/g) || []).length < 2 && linhas[i + k]
      && linhas[i + k].trim() !== '' && !CARA_DE_CAIXA.test(linhas[i + k]) && !/^#/.test(linhas[i + k])
      && !CERCA.test(linhas[i + k]); k += 1) {
      resto += ` ${linhas[i + k].trim()}`;
    }
    const riscado = /^~~/.test(resto);
    const semRisco = resto.replace(/^~~/, '').replace(/^\*\*(~~)?/, '');
    const s = semRisco.match(SIGLA);
    const sigla = s ? s[1] : null;
    itens.push({
      sigla, estado: ESTADO[m[1]], riscado,
      marcacao: marcacaoDe(semRisco.slice(sigla ? sigla.length : 0)),
      titulo: tituloDe(resto, sigla),
    });
  }
  return { letra: arq[0], arq, tema, itens };
});

// ---- as anomalias, que o gerador ACUSA e não conserta
const anomalias = [];
for (const t of dados) {
  const vistas = {};
  for (const it of t.itens) {
    if (!it.sigla) anomalias.push(`\`${t.arq}\`: item sem sigla, "${it.titulo}" (${it.estado})`);
    else (vistas[it.sigla] ??= []).push(it.estado + (it.riscado ? ', riscado' : ''));
    if (it.sigla && it.sigla[0] !== t.letra) {
      anomalias.push(`\`${t.arq}\`: a sigla **${it.sigla}** é de outro tema (${it.sigla[0]}), e está contada no tema ${t.letra}`);
    }
    if (it.estado !== 'fechado' && it.riscado) {
      anomalias.push(`\`${t.arq}\`: **${it.sigla}** tem a caixa aberta e o título riscado (a contagem o conta como aberto)`);
    }
  }
  for (const [s, est] of Object.entries(vistas)) {
    if (est.length > 1) anomalias.push(`\`${t.arq}\`: a sigla **${s}** aparece ${est.length} vezes (${est.join(' · ')})`);
  }
}

const conta = (its, e) => its.filter((i) => i.estado === e).length;
const total = { itens: 0, aberto: 0, parcial: 0, fechado: 0 };
const linhasContagem = dados.map((t) => {
  const c = { itens: t.itens.length, aberto: conta(t.itens, 'aberto'), parcial: conta(t.itens, 'parcial'), fechado: conta(t.itens, 'fechado') };
  for (const k of Object.keys(total)) total[k] += c[k];
  return `| ${t.letra} | ${t.tema} | [\`${t.arq}\`](docs/pendencias/${t.arq}) | ${c.itens} | ${c.aberto} | ${c.parcial} | ${c.fechado} |`;
});

const contagem = [
  '| Letra | Tema | Arquivo | Itens | Abertos | Parciais | Fechados |',
  '|---|---|---|---:|---:|---:|---:|',
  ...linhasContagem,
  `| | **Total** | | **${total.itens}** | **${total.aberto}** | **${total.parcial}** | **${total.fechado}** |`,
  '',
  '*Contado pelas caixas de cada arquivo de tema: `- [ ]` aberto, `- [~]` parcial, `- [x]` fechado.'
    + ' Gerado por `scripts/gen-pendencias.mjs`; não edite à mão.*',
  ...(anomalias.length ? ['', '**O que a contagem esconde, e o gerador acusa sem consertar:**', '', ...anomalias.map((a) => `- ${a}`)] : []),
].join('\n');

const itensMd = dados.map((t) => {
  const abertos = t.itens.filter((i) => i.estado !== 'fechado');
  const fechados = t.itens.filter((i) => i.estado === 'fechado');
  const partes = [`### ${t.letra} · ${t.tema}`, ''];
  if (abertos.length) {
    partes.push('| Sigla | Estado | Marcação | Título |', '|---|---|---|---|');
    for (const i of abertos) {
      partes.push(`| ${i.sigla ?? '(sem sigla)'} | ${i.estado}${i.riscado ? ', riscado' : ''} | ${i.marcacao} | ${i.titulo} |`);
    }
  } else partes.push('Nenhum aberto.');
  partes.push('', `Fechados (${fechados.length}): ${fechados.map((i) => i.sigla ?? `"${i.titulo}"`).join(', ') || 'nenhum'}.`);
  return partes.join('\n');
}).join('\n\n');

function montar() {
  let md = fs.readFileSync(INDICE, 'utf8');
  for (const [marca, corpo] of [['pendencias-contagem', contagem], ['pendencias-itens', itensMd]]) {
    const re = new RegExp(`(<!-- gen:${marca} -->)[\\s\\S]*?(<!-- /gen:${marca} -->)`);
    if (!re.test(md)) throw new Error(`marcador gen:${marca} não encontrado em ${INDICE}`);
    md = md.replace(re, () => `<!-- gen:${marca} -->\n\n${corpo}\n\n<!-- /gen:${marca} -->`);
  }
  return md;
}

const resumo = `${total.itens} itens (${total.aberto} abertos, ${total.parcial} parciais, ${total.fechado} fechados)`
  + ` em ${dados.length} temas, ${anomalias.length} anomalia(s) acusada(s)`;

// Linha com cara de caixa que o formato não lê: recusa nos dois modos, e não escreve nada.
if (naoLidas.length) {
  console.error(`✘ ${naoLidas.length} linha(s) com cara de caixa que o gerador NÃO LÊ, e que por isso ficariam fora da contagem:`);
  for (const n of naoLidas) console.error(`    docs/pendencias/${n}`);
  console.error('  Um item é `- [ ] `, `- [~] ` ou `- [x] ` na coluna 0, com espaço depois da caixa.'
    + ' Subitem com caixa não conta: vire item, ou tire a caixa.');
  process.exit(1);
}

if (process.argv.includes('--check')) {
  const atual = fs.readFileSync(INDICE, 'utf8');
  if (atual !== montar()) {
    console.error(`✘ ${path.relative(raiz, INDICE)} está fora de sincronia com docs/pendencias/.\n`
      + '  Rode: node scripts/gen-pendencias.mjs');
    process.exit(1);
  }
  console.log(`✓ Pendencias.md em dia com os temas: ${resumo}`);
  process.exit(0);
}

fs.writeFileSync(INDICE, montar());
console.log(`Pendencias.md regerado: ${resumo}`);
