// trava.mjs · a trava da revisão de textos (rev-textos, fase 0; Executora, 12/11/2026). FORA do validate e do build.
//
// O pedido do autor: "um script de trava (fora do build, em scripts\revisao\) que, para cada arquivo, compara antes e
// depois: números, expressões de dado (1d6+2, 2 × Centelha etc.), termos protegidos e títulos de seção. Toda diferença
// de número, dado ou termo tem de corresponder a uma entrada do contradicoes.md; senão, o script falha."
//
// Uso:
//   node scripts/revisao/trava.mjs [--base <ref>] [--contradicoes <md>] [--glossario <json>] [--classes] [arquivos...]
// A base padrão é d760ef96 (o main de 12/11/2026, de onde saiu o ramo revisao-textos). Sem arquivos, a trava pega os que
// mudaram desde a base (`git diff --name-only <base>`, o que já foi commitado no ramo e o que está só no disco), com texto:
// src/content/**, src/pages/**, src/components/** e src/data/*.json.
//
// COMO A COMPARAÇÃO FUNCIONA
// 1. O ANTES é o arquivo na base (`git show <base>:<arquivo>`); o DEPOIS é o arquivo no disco.
// 2. As entradas de trava do contradicoes.md para aquele arquivo (as linhas `arquivo`: "antes" → "depois") são APLICADAS
//    no antes: cada "antes" tem de existir no antes, e cada "depois" tem de existir no depois, senão a entrada não casa e a
//    trava falha. O antes corrigido pelas entradas é o que se compara com o depois. Assim a entrada cobre exatamente o
//    trecho que ela diz, e uma diferença fora de entrada sobra.
// 3. Os blocos gerados (<!-- gen:x --> ... <!-- /gen:x -->) saem dos dois lados: eles mudam pela fonte.
// 4. No src/data/*.json, só os campos de prosa (descricao, texto, definicao, efeito, nota, tracos, e o texto de niveis[])
//    são comparados como texto; o resto do JSON tem de ficar IGUAL, campo por campo (senão falha: a revisão é de texto).
// 5. O que se compara, nos dois lados:
//    - NÚMEROS: contagem por valor (multiconjunto, não posição: a reescrita reordena frases), os escritos com algarismos
//      (1, 12, 1,5, 3.000, e também os colados em letra, como o N0 da perfuração e os de 1d6) e os por extenso de dois
//      a doze. "um" e "uma" só AVISAM: são o artigo indefinido, e uma reescrita troca artigo o tempo todo.
//    - DADO E FÓRMULA: NdM±K (1d6+2, 6d6+2 +8, d6), "N × Palavra" e "Palavra × N", frações (1/2), porcentagens (30%) e
//      "÷ N", por multiconjunto, sem espaço.
//    - TERMOS PROTEGIDOS (glossario-protegido.json): contagem por termo, com fronteira de palavra. FALHA quando o termo
//      SOME de vez do arquivo ou APARECE novo nele; quando só a contagem muda, AVISA (a reescrita junta e separa frases).
//      Regra dos termos AMBÍGUOS (a que fecha o falso positivo de "Média", "Golpe", "Nível", "Tempo"...): o termo do
//      glossário com maiúscula que, no corpo dos capítulos na base, aparece em minúscula em metade ou mais das vezes é
//      palavra comum ali ("média" de conta, "nível" de escada); para ele a contagem DIFERENCIA maiúsculas e conta só a
//      forma do glossário. Os outros termos contam sem diferenciar maiúsculas. Termos com a mesma grafia em minúscula
//      são um só. `--classes` imprime a lista dos ambíguos.
//      Os termos COMUNS (a seção do glossário que começa por "_comuns", regra do autor de 12/11/2026): só AVISAM, também
//      quando somem ou aparecem; cada aviso se resolve no estado.md ("termo do jogo, intacto" ou "palavra comum").
//    - TÍTULOS DE SEÇÃO: em .md, as linhas #, ##, ### (até ######) fora de bloco de código; em .astro, os <h1> a <h6> e os
//      id="...". A lista tem de ficar igual, na ordem. Título só muda com entrada.
// 6. Sai com código 1 se qualquer arquivo falha, e mostra o que sobrou; 0 se tudo casa. Os avisos não derrubam.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MISSAO = path.resolve(REPO, '../tmp/revisao-textos');

// ---------------------------------------------------------------- argumentos
const args = process.argv.slice(2);
const opt = (nome, padrao) => { const i = args.indexOf(nome); if (i < 0) return padrao; const v = args[i + 1]; args.splice(i, 2); return v; };
const flag = (nome) => { const i = args.indexOf(nome); if (i < 0) return false; args.splice(i, 1); return true; };
const BASE = opt('--base', 'd760ef96');
const CONTRADICOES = opt('--contradicoes', path.join(MISSAO, 'contradicoes.md'));
const GLOSSARIO = opt('--glossario', path.join(MISSAO, 'glossario-protegido.json'));
const MOSTRAR_CLASSES = flag('--classes');

const git = (...a) => execFileSync('git', a, { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 28 });
const naBase = (arq) => { try { return git('show', `${BASE}:${arq}`); } catch { return null; } };
const noDisco = (arq) => { const p = path.join(REPO, arq); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
const lf = (s) => (s == null ? s : s.replace(/\r\n?/g, '\n'));

// ---------------------------------------------------------------- quais arquivos
const TEM_TEXTO = (a) => /^src\/(content|pages|components)\//.test(a) || /^src\/data\/[^/]+\.json$/.test(a);
let arquivos = args.map((a) => path.relative(REPO, path.resolve(a)).replace(/\\/g, '/'));
if (!arquivos.length) arquivos = git('diff', '--name-only', BASE).split('\n').filter(Boolean).filter(TEM_TEXTO);

// ---------------------------------------------------------------- as entradas de trava
// Na linha "- Trava:" (e nos itens logo abaixo dela), cada trecho `arquivo`: "antes" → "depois", com "(N×)" opcional
// quando o mesmo trecho muda N vezes no arquivo; vários trechos na mesma linha, separados por ponto e vírgula. As
// linhas de "Versões escritas" não têm a seta e não contam; o bloco de código do formato, no topo, também não.
function lerEntradas(md) {
  const out = [];
  let emCodigo = false, rt = null, naTrava = false;
  for (const linha of lf(md).split('\n')) {
    if (/^\s*```/.test(linha)) { emCodigo = !emCodigo; continue; }
    if (emCodigo) continue;
    const h = linha.match(/^##\s+(RT-\d+)/); if (h) { rt = h[1]; naTrava = false; continue; }
    if (/^-\s*Trava:/.test(linha)) naTrava = true;
    else if (/^-\s/.test(linha) || !linha.trim()) naTrava = false;
    if (!naTrava) continue;
    for (const m of linha.matchAll(/`([^`]+)`:\s*"(.*?)"\s*→\s*"(.*?)"(?:\s*\((\d+)×\))?(?=\s*(?:;|$|\())/g))
      out.push({ rt, arquivo: m[1].replace(/\\/g, '/').replace(/:\d+$/, ''), antes: m[2], depois: m[3], vezes: Number(m[4] || 1) });
  }
  return out;
}
const ENTRADAS = fs.existsSync(CONTRADICOES) ? lerEntradas(fs.readFileSync(CONTRADICOES, 'utf8')) : [];

// ---------------------------------------------------------------- o texto que se compara
const semGerados = (s) => s.replace(/<!--\s*gen:([\w-]+)\s*-->[\s\S]*?<!--\s*\/gen:\1\s*-->/g, '');
const CAMPOS_PROSA = new Set(['descricao', 'texto', 'definicao', 'efeito', 'nota', 'tracos']);
function prosaDoJson(txt) {
  const prosa = [];
  const pega = (v) => { if (typeof v === 'string') prosa.push(v); else if (Array.isArray(v)) v.forEach(pega); else if (v && typeof v === 'object') Object.values(v).forEach(pega); };
  const esqueleto = (o) => {
    if (Array.isArray(o)) return o.map(esqueleto);
    if (!o || typeof o !== 'object') return o;
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      // o `texto` de niveis[] cai aqui também: a recursão desce no array e acha a chave
      if (CAMPOS_PROSA.has(k)) { pega(v); r[k] = '·prosa·'; }
      else r[k] = esqueleto(v);
    }
    return r;
  };
  const sk = esqueleto(JSON.parse(txt));
  return { texto: prosa.join('\n'), esqueleto: JSON.stringify(sk) };
}

// ---------------------------------------------------------------- o que se conta
const EXTENSO = { dois: '2', duas: '2', 'três': '3', quatro: '4', cinco: '5', seis: '6', sete: '7', oito: '8', nove: '9', dez: '10', onze: '11', doze: '12' };
const ARTIGO = { um: '1', uma: '1' };
const L = '\\p{L}\\p{N}';
const conta = (lista) => { const m = new Map(); for (const x of lista) m.set(x, (m.get(x) || 0) + 1); return m; };
function numeros(t) {
  // colado em letra também conta (o N0 da perfuração, o 1d6): só não parte um número ao meio
  const fortes = [...t.matchAll(/(?<![\p{N}])(?<![\p{N}][.,])\d+(?:[.,]\d+)*(?![\p{N}])/gu)].map((m) => m[0]);
  for (const m of t.matchAll(new RegExp(`(?<![${L}])(${Object.keys(EXTENSO).join('|')})(?![${L}])`, 'giu'))) fortes.push(`${m[1].toLowerCase()} (${EXTENSO[m[1].toLowerCase()]})`);
  const fracos = [...t.matchAll(new RegExp(`(?<![${L}])(um|uma)(?![${L}])`, 'giu'))].map((m) => m[1].toLowerCase());
  return { fortes: conta(fortes), fracos: conta(fracos) };
}
const tira = (s) => s.replace(/\s+/g, '').replace(/[−–]/g, '-');
function dados(t) {
  const out = [];
  for (const m of t.matchAll(/(?<![\p{L}])\d*d\d+(?:\s*[+−–-]\s*\d+)*(?![\p{L}])/gu)) out.push(tira(m[0]));
  for (const m of t.matchAll(/\d+(?:[.,]\d+)?\s*×\s*\p{L}[\p{L}-]*/gu)) out.push(tira(m[0]));
  for (const m of t.matchAll(/\p{L}[\p{L}-]*\s*×\s*\d+(?:[.,]\d+)?/gu)) out.push(tira(m[0]));
  for (const m of t.matchAll(/(?<![\p{N}/])\d+\/\d+(?![\p{N}/])/gu)) out.push(m[0]);
  for (const m of t.matchAll(/\d+(?:[.,]\d+)?\s*%/gu)) out.push(tira(m[0]));
  for (const m of t.matchAll(/÷\s*\d+(?:[.,]\d+)?/gu)) out.push(tira(m[0]));
  return conta(out);
}
function titulos(t, ext) {
  if (ext === '.md' || ext === '.mdx') {
    const out = []; let emCodigo = false;
    for (const linha of t.split('\n')) {
      if (/^\s*(```|~~~)/.test(linha)) { emCodigo = !emCodigo; continue; }
      if (!emCodigo && /^#{1,6}\s/.test(linha)) out.push(linha.trim());
    }
    return out;
  }
  if (ext === '.astro') return [...t.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>|\bid="([^"]+)"/g)].map((m) => (m[3] ? `id="${m[3]}"` : `h${m[1]}: ${m[2].replace(/\s+/g, ' ').trim()}`));
  return [];
}

// ---------------------------------------------------------------- os termos e a regra dos ambíguos
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const GLOS = JSON.parse(fs.readFileSync(GLOSSARIO, 'utf8'));
const COMUNS = new Set(Object.entries(GLOS).filter(([sec]) => sec.startsWith('_comuns')).flatMap(([, ts]) => ts.map((t) => t.toLowerCase())));
const porChave = new Map();
for (const t of Object.values(GLOS).flat()) { const k = t.toLowerCase(); if (!porChave.has(k)) porChave.set(k, new Set()); porChave.get(k).add(t); }
// o corpo dos capítulos NA BASE (fixo enquanto a base for a mesma), para decidir quem é ambíguo
const capitulosBase = git('ls-tree', '-r', '--name-only', BASE, 'src/content').split('\n').filter((a) => /\.mdx?$/.test(a));
const corpoBase = capitulosBase.map((a) => semGerados(lf(naBase(a) || ''))).join('\n');
const TERMOS = [];
for (const [k, formas] of porChave) {
  const maiuscula = [...formas].find((f) => f !== f.toLowerCase());
  let ambiguo = false;
  const comum = COMUNS.has(k);
  if (maiuscula && !comum) {
    const todas = [...corpoBase.matchAll(new RegExp(`(?<![${L}])${esc(k)}(?![${L}])`, 'giu'))];
    const minusc = todas.filter((m) => m[0] === m[0].toLowerCase()).length;
    ambiguo = todas.length > 0 && minusc * 2 >= todas.length;
  }
  TERMOS.push({ termo: ambiguo ? maiuscula : k, ambiguo, comum, re: new RegExp(`(?<![${L}])${esc(ambiguo ? maiuscula : k)}(?![${L}])`, ambiguo ? 'gu' : 'giu') });
}
if (MOSTRAR_CLASSES) {
  const amb = TERMOS.filter((t) => t.ambiguo).map((t) => t.termo);
  console.log(`${TERMOS.length} termos (grafias iguais em minúscula juntas), ${amb.length} ambíguos (contados só na forma do glossário):\n${amb.join(', ')}`);
  console.log(`${COMUNS.size} comuns (só aviso): ${[...COMUNS].join(', ')}`);
}
const termos = (t) => { const m = new Map(); for (const x of TERMOS) { const n = (t.match(x.re) || []).length; if (n) m.set(x.termo, n); } return m; };

// ---------------------------------------------------------------- a comparação
function difMulti(a, b) { // o que sobra de cada lado
  const sai = [], entra = [];
  for (const k of new Set([...a.keys(), ...b.keys()])) { const d = (b.get(k) || 0) - (a.get(k) || 0); if (d < 0) sai.push(`${k} (−${-d})`); if (d > 0) entra.push(`${k} (+${d})`); }
  return { sai, entra };
}
function comparar(arq) {
  const falhas = [], avisos = [];
  const ext = path.extname(arq);
  let antes = lf(naBase(arq)), depois = lf(noDisco(arq));
  if (antes == null) return { falhas: ['arquivo novo desde a base: a trava não tem com o que comparar'], avisos };
  if (depois == null) return { falhas: ['arquivo removido desde a base'], avisos };
  if (ext === '.json') {
    const a = prosaDoJson(antes), d = prosaDoJson(depois);
    if (a.esqueleto !== d.esqueleto) falhas.push('o JSON mudou fora dos campos de prosa (descricao, texto, definicao, efeito, nota, tracos, niveis[].texto)');
    antes = a.texto; depois = d.texto;
  } else { antes = semGerados(antes); depois = semGerados(depois); }
  // as entradas do contradicoes.md, aplicadas no antes
  for (const e of ENTRADAS.filter((x) => x.arquivo === arq)) {
    const n = antes.split(e.antes).length - 1;
    if (n < e.vezes) { falhas.push(`${e.rt}: o "antes" da entrada está ${n} vez(es) no arquivo da base, e a entrada pede ${e.vezes}: "${e.antes}"`); continue; }
    if (!depois.includes(e.depois)) { falhas.push(`${e.rt}: o "depois" da entrada não está no arquivo de agora: "${e.depois}"`); continue; }
    if (depois.split(e.antes).length - 1 > n - e.vezes) avisos.push(`${e.rt}: a entrada ainda não está aplicada neste arquivo ("${e.antes}" segue ${depois.split(e.antes).length - 1} vez(es))`);
    for (let i = 0; i < e.vezes; i++) antes = antes.replace(e.antes, e.depois);
  }
  const nA = numeros(antes), nD = numeros(depois);
  const dn = difMulti(nA.fortes, nD.fortes);
  if (dn.sai.length || dn.entra.length) falhas.push(`números sem entrada: saem ${dn.sai.join(', ') || 'nenhum'}; entram ${dn.entra.join(', ') || 'nenhum'}`);
  const df = difMulti(nA.fracos, nD.fracos);
  if (df.sai.length || df.entra.length) avisos.push(`"um"/"uma" mudaram de contagem (artigo, só aviso): ${[...df.sai, ...df.entra].join(', ')}`);
  const dd = difMulti(dados(antes), dados(depois));
  if (dd.sai.length || dd.entra.length) falhas.push(`dado ou fórmula sem entrada: saem ${dd.sai.join(', ') || 'nenhum'}; entram ${dd.entra.join(', ') || 'nenhum'}`);
  const tA = termos(antes), tD = termos(depois);
  const sumiu = [...tA.keys()].filter((k) => !tD.has(k)), novo = [...tD.keys()].filter((k) => !tA.has(k));
  const ehComum = (k) => COMUNS.has(k.toLowerCase());
  if (sumiu.some((k) => !ehComum(k))) falhas.push(`termo protegido some do arquivo: ${sumiu.filter((k) => !ehComum(k)).join(', ')}`);
  if (novo.some((k) => !ehComum(k))) falhas.push(`termo protegido aparece novo no arquivo: ${novo.filter((k) => !ehComum(k)).join(', ')}`);
  if (sumiu.some(ehComum) || novo.some(ehComum)) avisos.push(`termo comum (só aviso; resolver no estado.md): some ${sumiu.filter(ehComum).join(', ') || 'nenhum'}; aparece ${novo.filter(ehComum).join(', ') || 'nenhum'}`);
  const mudou = [...tA.keys()].filter((k) => tD.has(k) && tD.get(k) !== tA.get(k)).map((k) => `${k} ${tA.get(k)}→${tD.get(k)}`);
  if (mudou.length) avisos.push(`termos com outra contagem (só aviso): ${mudou.join(', ')}`);
  const hA = titulos(antes, ext), hD = titulos(depois, ext);
  if (JSON.stringify(hA) !== JSON.stringify(hD)) {
    const i = hA.findIndex((h, j) => h !== hD[j]);
    falhas.push(`títulos de seção mudaram (a partir do ${i < 0 ? hA.length + 1 : i + 1}º): antes ${JSON.stringify(hA.slice(Math.max(0, i), Math.max(0, i) + 3))}, agora ${JSON.stringify(hD.slice(Math.max(0, i), Math.max(0, i) + 3))}`);
  }
  return { falhas, avisos };
}

// ---------------------------------------------------------------- saída
let caiu = 0;
console.log(`trava · base ${BASE} · ${arquivos.length} arquivo(s) · ${ENTRADAS.length} entrada(s) de trava em ${path.relative(REPO, CONTRADICOES) || CONTRADICOES}`);
for (const arq of arquivos) {
  const { falhas, avisos } = comparar(arq);
  if (falhas.length) caiu++;
  console.log(`${falhas.length ? '✘' : '✓'} ${arq}`);
  for (const f of falhas) console.log(`    ✘ ${f}`);
  for (const a of avisos) console.log(`    · ${a}`);
}
if (caiu) { console.error(`✘ trava: ${caiu} arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md`); process.exit(1); }
console.log('✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md');
