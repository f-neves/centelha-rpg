// trava.mjs · a trava da revisão de textos (rev-textos, fase 0; Executora, 12/11/2026). FORA do validate e do build.
//
// O pedido do autor: "um script de trava (fora do build, em scripts\revisao\) que, para cada arquivo, compara antes e
// depois: números, expressões de dado (1d6+2, 2 × Centelha etc.), termos protegidos e títulos de seção. Toda diferença
// de número, dado ou termo tem de corresponder a uma entrada do contradicoes.md; senão, o script falha."
// E a ordem seguinte do autor (12/11/2026): "Feche o buraco da posição [...] compare por seção: a. O conjunto de números,
// dados e fórmulas de cada seção, antes e depois, tem de ser igual, salvo entrada no contradicoes.md. b. Pares termo e
// número: em cada frase do original, registre os termos protegidos e os números da mesma frase. No texto novo, cada par
// tem de continuar na mesma seção, com o mesmo termo e o mesmo número próximos. Uma frase pode virar duas; o par não pode
// se separar de seção nem trocar de termo. c. Se a reescrita juntar ou mover trechos entre seções, isso exige entrada no
// estado.md, e a Revisora confere à mão."
//
// Uso:
//   node scripts/revisao/trava.mjs [--base <ref>] [--contradicoes <md>] [--estado <md>] [--glossario <json>]
//                                  [--classes [<saida.md>]] [arquivos...]
// A base padrão é d760ef96 (o main de 12/11/2026, de onde saiu o ramo revisao-textos). Sem arquivos, a trava pega os que
// mudaram desde a base (`git diff --name-only <base>`, o que já foi commitado no ramo e o que está só no disco), com texto:
// src/content/**, src/pages/**, src/components/** e src/data/*.json. `--classes` imprime as classes de termo e, com um
// caminho, grava a lista dos ambíguos em Markdown (a do ../tmp/revisao-textos/ambiguos-minuscula.md).
//
// COMO A COMPARAÇÃO FUNCIONA
// 1. O ANTES é o arquivo na base (`git show <base>:<arquivo>`); o DEPOIS é o arquivo no disco. O arquivo igual à base
//    passa direto, com aviso das entradas dele ainda não aplicadas.
// 2. As entradas de trava do contradicoes.md para aquele arquivo (`arquivo`: "antes" → "depois", com "(N×)" opcional)
//    são APLICADAS no antes: cada "antes" tem de existir no antes (N vezes), e cada "depois" tem de existir no depois,
//    senão a entrada não casa e a trava falha. Exceção: a entrada ainda não aplicada (o "depois" ausente e o "antes"
//    intacto) só avisa, para a página que aplica uma entrada não ficar barrada pelas outras do mesmo arquivo. Depois, os MOVIMENTOS DE SEÇÃO do estado.md (seção "## Movimentos de
//    seção": `arquivo`: "trecho" · de "Título A" → "Título B") tiram o trecho da seção A do antes e o põem no fim da
//    seção B. O antes corrigido é o que se compara com o depois.
//    As linhas "Trava JSON" (`arquivo` @caminho: <antes> → <depois>, valores em JSON) fazem o mesmo num campo de fora
//    da prosa de um src/data/*.json: o valor da base tem de ser o "antes", o de agora o "depois".
//    As entradas cujo Status COMEÇA por "PENDENTE AUTOR" são puladas (não se aplicam nesta revisão), e a saída lista quais.
// 3. Os blocos gerados (<!-- gen:x --> ... <!-- /gen:x -->) saem dos dois lados: eles mudam pela fonte.
// 4. No src/data/*.json, só os campos de prosa (descricao, texto, definicao, efeito, nota, tracos, e o texto de niveis[])
//    são comparados como texto, e cada campo é uma seção; o resto do JSON tem de ficar IGUAL, campo por campo.
// 5. SEÇÃO: em .md, o trecho entre dois títulos de qualquer nível (# a ######), o mais fino; em .astro, o trecho entre
//    dois <h1> a <h6>; no JSON, cada campo de prosa. Como os títulos são protegidos, a seção N do antes é a seção N do
//    depois. Se os títulos mudaram, a trava já falha por isso, e compara números e dados no arquivo inteiro.
// 6. O que se compara:
//    - NÚMEROS, POR SEÇÃO (FALHA): multiconjunto por valor (a ordem dentro da seção não importa), os escritos com
//      algarismos (1, 12, 1,5, 3.000, também os colados em letra, como o N0 da perfuração e os de 1d6) e os por extenso
//      de dois a doze. O SINAL colado na frente faz parte do valor: "−4", "+4" e "4" diferem (+, −, – e - normalizados);
//      o "-" de "D-362" e de "1-3" e o "+" de "1d6+2" não são sinal. "um" e "uma" só AVISAM (são artigo).
//    - DADO E FÓRMULA, POR SEÇÃO (FALHA): NdM±K, "N × Palavra" e "Palavra × N", frações, porcentagens e "÷ N", sem espaço.
//    - PARES TERMO E NÚMERO, POR SEÇÃO (FALHA). A definição testável de "próximo": cada número da seção se liga a UM
//      termo protegido, o mais perto dele na mesma frase, medido em caracteres entre os dois (empate: o que vem antes).
//      Se a frase não tem termo, o número se liga ao último termo da frase anterior, na mesma seção (é a frase que
//      virou duas). Sem termo nas duas, o par é (nenhum, número). O multiconjunto de pares (termo, número) de cada seção
//      tem de ser igual no antes e no depois. É isso que pega a troca do Cego ("Esquiva −4 e Bloqueio −8" virando
//      "Esquiva −8 e Bloqueio −4"): os números e os termos da seção são os mesmos, e os pares não. Frase: termina em
//      . ! ? ; seguidos de espaço, em linha em branco, e antes de linha de lista, de tabela, de título ou de tag; a
//      quebra de linha simples (o parágrafo quebrado no arquivo) não termina frase. Termo dentro de termo mais longo
//      ("Defesa" em "Defesa Física") conta só o mais longo.
//    - LINHAS DE TABELA, POR SEÇÃO (FALHA; CORRIGE da Revisora, 12/11/2026: "| Pesada | 7 | 2d6 | +0 | −2 | 2 |" com o
//      Acerto e a Defesa trocados passava, porque todo número da linha se ligava ao rótulo). Em .md, a linha que começa
//      com |; em .astro, cada <tr> com as suas <td>/<th>. A ASSINATURA de uma linha de dados é a sequência ORDENADA das
//      células que têm número ou dado, cada célula reduzida aos números (com o sinal) e dados dela; a do cabeçalho (a
//      linha seguida de |---|, ou a <tr> com <th>) é o texto inteiro das células. O multiconjunto de assinaturas da seção
//      tem de ficar igual: reescrever a palavra de uma célula passa; trocar colunas, mudar número de célula ou reescrever
//      o cabeçalho exige linha Trava.
//    - TERMOS PROTEGIDOS, NO ARQUIVO: contagem por termo, com fronteira de palavra. FALHA quando o termo SOME de vez
//      do arquivo ou APARECE novo nele; quando só a contagem muda, AVISA. Regra dos AMBÍGUOS: o termo do glossário com
//      maiúscula que, nos capítulos da base, aparece em minúscula em metade ou mais das vezes é contado só na forma do
//      glossário, diferenciando maiúsculas; a contagem da forma minúscula que muda só AVISA ("ambíguo em minúscula").
//      Os outros termos contam sem diferenciar maiúsculas. Os termos COMUNS (a seção do glossário que começa por
//      "_comuns", regra do autor) só AVISAM, também quando somem ou aparecem.
//    - TÍTULOS DE SEÇÃO (FALHA): em .md, as linhas # a ###### fora de bloco de código; em .astro, os <h1> a <h6> e os
//      id="...". A lista tem de ficar igual, na ordem. Título só muda com entrada.
//    - FRONTMATTER (FALHA): o cabeçalho --- ... --- do capítulo fica igual, salvo entrada.
//    - TERMO ACRESCENTADO: o termo protegido novo passa quando há linha dele, com o arquivo, em "## Termos acrescentados"
//      do estado.md. O endereço de link não conta como texto ao contar termo.
//    - ENTRADA NÃO APLICADA numa página reescrita (src/content/chapters, src/pages) FALHA, salvo linha em "## Entradas
//      adiadas" do estado.md (com motivo; a lista sai no topo); no src/data, aviso. "\n" no trecho de uma linha Trava é
//      quebra de linha. O endereço de link não conta em nada (termo, número, par).
//    - PAR PELA FRASE ANTERIOR: a diferença que só troca "(nenhum)" pelo termo achado na frase anterior é aviso.
// 7. Sai com código 1 se qualquer arquivo falha; 0 se tudo casa. Os avisos não derrubam. Cada aviso de termo sai numa
//    linha pronta para colar no estado.md: - `arquivo` · "termo" · antes → depois · motivo · resolução:
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MISSAO = path.resolve(REPO, '../tmp/revisao-textos');

// ---------------------------------------------------------------- argumentos
const args = process.argv.slice(2);
const opt = (nome, padrao) => { const i = args.indexOf(nome); if (i < 0) return padrao; const v = args[i + 1]; args.splice(i, 2); return v; };
const BASE = opt('--base', 'd760ef96');
const CONTRADICOES = opt('--contradicoes', path.join(MISSAO, 'contradicoes.md'));
const ESTADO_FLAG = opt('--estado', null);
const ESTADO = ESTADO_FLAG || path.join(MISSAO, 'estado.md');
// Sem a flag, "Termos acrescentados" e "Movimentos de seção" são lidos no estado.md E no estado-historico.md (a divisão
// do estado.md moveu essas seções para o histórico); com a flag, só o arquivo dado, como antes. Falta de um não falha.
const ESTADOS_SECOES = ESTADO_FLAG ? [ESTADO] : [ESTADO, path.join(MISSAO, 'estado-historico.md')];
const lerEstados = () => ESTADOS_SECOES.filter((f) => fs.existsSync(f)).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const GLOSSARIO = opt('--glossario', path.join(MISSAO, 'glossario-protegido.json'));
let MOSTRAR_CLASSES = false, SAIDA_CLASSES = null;
{ const i = args.indexOf('--classes'); if (i >= 0) { MOSTRAR_CLASSES = true; if (args[i + 1] && args[i + 1].endsWith('.md')) { SAIDA_CLASSES = args[i + 1]; args.splice(i, 2); } else args.splice(i, 1); } }

const git = (...a) => execFileSync('git', a, { cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 28 });
const naBase = (arq) => { try { return git('show', `${BASE}:${arq}`); } catch { return null; } };
const noDisco = (arq) => { const p = path.join(REPO, arq); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; };
const lf = (s) => (s == null ? s : s.replace(/\r\n?/g, '\n'));

// ---------------------------------------------------------------- quais arquivos
const TEM_TEXTO = (a) => /^src\/(content|pages|components)\//.test(a) || /^src\/data\/[^/]+\.json$/.test(a);
let arquivos = args.map((a) => path.relative(REPO, path.resolve(a)).replace(/\\/g, '/'));
if (!arquivos.length && !SAIDA_CLASSES) arquivos = git('diff', '--name-only', BASE).split('\n').filter(Boolean).filter(TEM_TEXTO);

// ---------------------------------------------------------------- as entradas de trava e os movimentos de seção
// Na linha "- Trava:" (e nos itens logo abaixo dela), cada trecho `arquivo`: "antes" → "depois", com "(N×)" opcional
// quando o mesmo trecho muda N vezes no arquivo; vários trechos na mesma linha, separados por ponto e vírgula. As
// linhas de "Versões escritas" não têm a seta e não contam; o bloco de código do formato, no topo, também não.
// O arquivo pode vir só pelo nome (`combate.md`, `condicoes.json`): ele vale quando há um só arquivo com esse nome em
// src/ na base. Com mais de um, ou nenhum, fica como está, e o aviso do topo da saída diz qual.
let PORNOME = null;
function resolveArquivo(a) {
  if (a.includes('/')) return a;
  if (!PORNOME) { PORNOME = new Map(); for (const f of git('ls-tree', '-r', '--name-only', BASE, 'src').split('\n').filter(Boolean)) { const b = f.split('/').pop(); PORNOME.set(b, [...(PORNOME.get(b) || []), f]); } }
  const c = PORNOME.get(a) || [];
  return c.length === 1 ? c[0] : a;
}
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
    // a anotação entre o arquivo e os dois-pontos é aceita e ignorada: `condicoes.json` (doente.nota): "..." → "..."
    for (const m of linha.matchAll(/`([^`]+)`(?:\s*\([^)]*\))?:\s*"(.*?)"\s*→\s*"(.*?)"(?:\s*\((\d+)×\))?(?=\s*(?:;|$|\())/g))
      // "\n" escrito no trecho é quebra de linha (a linha Trava fica numa linha só: a RT-034 traz linhas de tabela)
      out.push({ rt, arquivo: resolveArquivo(m[1].replace(/\\/g, '/').replace(/:\d+$/, '')), antes: m[2].replace(/\\n/g, '\n'), depois: m[3].replace(/\\n/g, '\n'), vezes: Number(m[4] || 1) });
  }
  return out;
}
// As entradas com Status "PENDENTE AUTOR" (D-053, congelado, decisão contra decisão) não se aplicam nesta revisão
// (ordem do Arquiteto, 12/11/2026): a trava as pula, lendo o Status da própria entrada, e lista as puladas no topo.
function pendentesDoAutor(md) {
  const out = new Set(); let emCodigo = false, rt = null;
  for (const linha of lf(md).split('\n')) {
    if (/^\s*```/.test(linha)) { emCodigo = !emCodigo; continue; }
    if (emCodigo) continue;
    const h = linha.match(/^##\s+(RT-\d+)/); if (h) { rt = h[1]; continue; }
    // só quando o Status COMEÇA por PENDENTE AUTOR (CORRIGE da Revisora): "registrada (era PENDENTE AUTOR; ...)" se aplica
    if (rt && /^-\s*Status:\s*\**\s*PENDENTE AUTOR/i.test(linha)) out.add(rt);
  }
  return out;
}
const TEXTO_CONTRADICOES = fs.existsSync(CONTRADICOES) ? fs.readFileSync(CONTRADICOES, 'utf8') : '';
const PENDENTES = pendentesDoAutor(TEXTO_CONTRADICOES);
const PULADAS = new Set();
const semPendentes = (lista) => lista.filter((e) => { if (PENDENTES.has(e.rt)) { PULADAS.add(e.rt); return false; } return true; });
const ENTRADAS = semPendentes(lerEntradas(TEXTO_CONTRADICOES));
// A TRAVA JSON (decisão do Arquiteto, 12/11/2026), para a mudança de um campo FORA da prosa de um src/data/*.json:
//   - Trava JSON: `src/data/regras.json` @caminho.do.campo: <valor antes, em JSON> → <valor depois, em JSON>
// O caminho em pontos, com o índice de lista entre colchetes (@acoes.salto.saltoHorizontalCorrendo, @pacotes[3].itens[0].item,
// @[0].peso). A trava aceita a mudança só naquele caminho, só se o valor da base for o "antes" e o de agora for o
// "depois"; o resto fora da prosa continua tendo de ficar igual. Valor que não é JSON válido é erro da linha.
const ERROS_ENTRADA = [];
function lerEntradasJson(md) {
  const out = []; let emCodigo = false, rt = null;
  for (const linha of lf(md).split('\n')) {
    if (/^\s*```/.test(linha)) { emCodigo = !emCodigo; continue; }
    if (emCodigo) continue;
    const h = linha.match(/^##\s+(RT-\d+)/); if (h) { rt = h[1]; continue; }
    const m = linha.match(/^\s*-\s*Trava JSON:\s*`([^`]+)`\s*@(\S+?):\s*(.+?)\s*→\s*(.+?)\s*$/);
    if (!m) continue;
    try { out.push({ rt, arquivo: resolveArquivo(m[1].replace(/\\/g, '/')), caminho: m[2].replace(/^\$\.?/, ''), antes: JSON.parse(m[3]), depois: JSON.parse(m[4]) }); }
    catch (e) { ERROS_ENTRADA.push(`${rt}: a linha Trava JSON não tem valor JSON válido (${e.message}): ${linha.trim()}`); }
  }
  return out;
}
const ENTRADAS_JSON = semPendentes(lerEntradasJson(TEXTO_CONTRADICOES));
const passos = (cam) => [...cam.matchAll(/([^.[\]]+)|\[(\d+)\]/g)].map((m) => (m[2] != null ? Number(m[2]) : m[1]));
function valorEm(o, cam) { let v = o; for (const k of passos(cam)) { if (v == null || typeof v !== 'object' || !(k in v)) return { existe: false }; v = v[k]; } return { existe: true, v }; }
function poeEm(o, cam, valor) { const ps = passos(cam); let v = o; for (const k of ps.slice(0, -1)) v = v[k]; v[ps[ps.length - 1]] = valor; }
const igualJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// No estado.md, a seção "## Movimentos de seção", uma linha por trecho movido:
//   - `arquivo`: "trecho" · de "Título A" → "Título B"
// O título sem os # (o JSON usa o caminho do campo, como a trava o imprime).
function lerMovimentos(md) {
  const out = []; let dentro = false;
  for (const linha of lf(md).split('\n')) {
    if (/^##\s/.test(linha)) { dentro = /^##\s+Movimentos de seção/i.test(linha); continue; }
    if (!dentro) continue;
    const m = linha.match(/^\s*-\s*`([^`]+)`:\s*"(.*?)"\s*·\s*de\s*"(.*?)"\s*→\s*"(.*?)"/);
    if (m) out.push({ arquivo: m[1].replace(/\\/g, '/'), trecho: m[2], de: m[3], para: m[4] });
  }
  return out;
}
const MOVIMENTOS = lerMovimentos(lerEstados());
// No estado.md, a seção "## Termos acrescentados" (aprovada pelo coordenador das regras, 15/11/2026): o termo protegido
// novo numa página passa só com a linha dele, uma por termo:
//   - `arquivo` · "termo" · original: "..." · novo: "..." · definido em: `arquivo` (seção)
// e a seção "## Entradas adiadas": a entrada que, de propósito, fica adiada numa página já reescrita, uma por linha:
//   - `arquivo` · RT-000 · motivo
function lerSecaoEstado(md, titulo, re) {
  const out = []; let dentro = false;
  for (const linha of lf(md).split('\n')) {
    if (/^##\s/.test(linha)) { dentro = new RegExp('^##\\s+' + titulo, 'i').test(linha); continue; }
    if (!dentro) continue;
    const m = linha.match(re);
    if (m) out.push(m);
  }
  return out;
}
const TEXTO_ESTADO = fs.existsSync(ESTADO) ? fs.readFileSync(ESTADO, 'utf8') : '';
// A linha sem "definido em" (Termos acrescentados) ou sem motivo (Entradas adiadas) não vale, e derruba a rodada
// (CORRIGE da Revisora no f003b69b): a exceção sem a razão escrita é a porta que a trava existe para fechar.
const ACRESCENTADOS = lerSecaoEstado(lerEstados(), 'Termos acrescentados', /^\s*-\s*`([^`]+)`\s*·\s*"([^"]+)"(.*)$/)
  .filter((m) => /definido em:\s*\S/.test(m[3]) || !ERROS_ENTRADA.push(`estado.md, Termos acrescentados: a linha do termo "${m[2]}" em \`${m[1]}\` não diz onde ele é definido ("definido em:"); ela não vale`))
  .map((m) => ({ arquivo: resolveArquivo(m[1].replace(/\\/g, '/')), termo: m[2].toLowerCase() }));
const ADIADAS = lerSecaoEstado(TEXTO_ESTADO, 'Entradas adiadas', /^\s*-\s*`([^`]+)`\s*·\s*(RT-\d+)\s*(?:·\s*(.*?))?\s*$/)
  .filter((m) => (m[3] || '').trim() || !ERROS_ENTRADA.push(`estado.md, Entradas adiadas: a linha da ${m[2]} em \`${m[1]}\` não tem motivo; ela não vale`))
  .map((m) => ({ arquivo: resolveArquivo(m[1].replace(/\\/g, '/')), rt: m[2], motivo: m[3].trim() }));

// ---------------------------------------------------------------- o texto que se compara
const semGerados = (s) => s.replace(/<!--\s*gen:([\w-]+)\s*-->[\s\S]*?<!--\s*\/gen:\1\s*-->/g, '');
// Os campos de prosa: os que o site mostra como texto corrido. Ampliada em 15/11/2026 (decisão do Arquiteto) com amarra,
// justificativa, limiteDeUso, conduta, serve, exemplo e os do mesmo tipo (notas, _nota, porque, resumo, detalhe, excecao,
// centelhaNota). Ficam fora: id, nome, rótulos curtos que funcionam como nome (os de nível), chaves, todo campo cujo
// valor é número ou enumeração, e o "valor", que é misto. Dentro da prosa, números, dados e termos continuam travados.
const CAMPOS_PROSA = new Set(['descricao', 'texto', 'definicao', 'efeito', 'nota', 'tracos', 'amarra', 'justificativa', 'limiteDeUso',
  'conduta', 'serve', 'exemplo', 'notas', '_nota', 'porque', 'resumo', 'detalhe', 'excecao', 'centelhaNota']);
// O campo que, num arquivo, não é prosa, embora tenha o nome de um campo de prosa: o "exemplo" do comando-barra.json é a
// sintaxe literal da barra do Grid (comando-barra.ts lê e mostra o texto como comando), e não texto corrido.
const PROSA_FORA = { 'src/data/comando-barra.json': new Set(['exemplo']) };
const SEP_JSON = '\n␞\n'; // separa os campos de prosa no texto do JSON (o caractere não aparece em prosa)
function prosaDoJson(txt, arq = '') {
  const ehProsa = (k) => CAMPOS_PROSA.has(k) && !PROSA_FORA[arq]?.has(k);
  const campos = [];
  const obj = typeof txt === 'string' ? JSON.parse(txt) : txt;
  const pega = (v, cam) => { if (typeof v === 'string') campos.push({ titulo: cam, texto: v }); else if (Array.isArray(v)) v.forEach((x, i) => pega(x, `${cam}[${i}]`)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) pega(x, `${cam}.${k}`); };
  const esqueleto = (o, cam) => {
    if (Array.isArray(o)) return o.map((x, i) => esqueleto(x, `${cam}[${i}]`));
    if (!o || typeof o !== 'object') return o;
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      // o `texto` de niveis[] cai aqui também: a recursão desce no array e acha a chave
      if (ehProsa(k)) { pega(v, `${cam}.${k}`); r[k] = '·prosa·'; }
      else r[k] = esqueleto(v, `${cam}.${k}`);
    }
    return r;
  };
  const sk = esqueleto(obj, '$');
  return { campos, texto: campos.map((c) => c.texto).join(SEP_JSON), esqueleto: JSON.stringify(sk) };
}
// as seções de um texto (ver item 5 do cabeçalho); `titulo` sem os #
function secoes(t, ext, titulosJson) {
  if (ext === '.json') return t.split(SEP_JSON).map((texto, i) => ({ titulo: titulosJson?.[i] ?? `campo ${i + 1}`, texto }));
  const out = [{ titulo: '(antes do primeiro título)', texto: '' }];
  if (ext === '.astro') {
    let ult = 0;
    for (const m of t.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g)) {
      out[out.length - 1].texto += t.slice(ult, m.index);
      out.push({ titulo: m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(), texto: '' }); ult = m.index + m[0].length;
    }
    out[out.length - 1].texto += t.slice(ult);
    return out;
  }
  let emCodigo = false;
  for (const linha of t.split('\n')) {
    if (/^\s*(```|~~~)/.test(linha)) emCodigo = !emCodigo;
    if (!emCodigo && /^#{1,6}\s/.test(linha)) out.push({ titulo: linha.replace(/^#+\s*/, '').trim(), texto: '' });
    else out[out.length - 1].texto += linha + '\n';
  }
  return out;
}

// ---------------------------------------------------------------- o que se conta
const EXTENSO = { dois: '2', duas: '2', 'três': '3', quatro: '4', cinco: '5', seis: '6', sete: '7', oito: '8', nove: '9', dez: '10', onze: '11', doze: '12' };
const L = '\\p{L}\\p{N}';
const conta = (lista) => { const m = new Map(); for (const x of lista) m.set(x, (m.get(x) || 0) + 1); return m; };
const RE_NUM = /(?:(?<![\p{L}\p{N}])([+−–-]))?(?<![\p{N}])(?<![\p{N}][.,])\d+(?:[.,]\d+)*(?![\p{N}])/gu;
const RE_EXTENSO = new RegExp(`(?<![${L}])(${Object.keys(EXTENSO).join('|')})(?![${L}])`, 'giu');
// os números com a posição: o sinal colado na frente faz parte do valor (CORRIGE da Revisora)
function numerosPos(t) {
  const out = [];
  for (const m of t.matchAll(RE_NUM)) out.push({ i: m.index, f: m.index + m[0].length, valor: m[1] ? (m[1] === '+' ? '+' : '-') + m[0].slice(1) : m[0] });
  for (const m of t.matchAll(RE_EXTENSO)) { const w = m[1].toLowerCase(); out.push({ i: m.index, f: m.index + m[0].length, valor: `${w} (${EXTENSO[w]})` }); }
  return out.sort((a, b) => a.i - b.i);
}
function numeros(t) {
  const fracos = [...t.matchAll(new RegExp(`(?<![${L}])(um|uma)(?![${L}])`, 'giu'))].map((m) => m[1].toLowerCase());
  return { fortes: conta(numerosPos(t).map((n) => n.valor)), fracos: conta(fracos) };
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
  let ambiguo = false, nMin = 0, nMai = 0;
  const comum = COMUNS.has(k);
  if (maiuscula && !comum) {
    const todas = [...corpoBase.matchAll(new RegExp(`(?<![${L}])${esc(k)}(?![${L}])`, 'giu'))];
    nMin = todas.filter((m) => m[0] === m[0].toLowerCase()).length; nMai = todas.length - nMin;
    ambiguo = todas.length > 0 && nMin * 2 >= todas.length;
  }
  TERMOS.push({ termo: ambiguo ? maiuscula : k, ambiguo, comum, nMin, nMai, re: new RegExp(`(?<![${L}])${esc(ambiguo ? maiuscula : k)}(?![${L}])`, ambiguo ? 'gu' : 'giu'),
    // a forma minúscula do ambíguo, só para o aviso (pedido da Revisora): ela não derruba a trava
    ...(ambiguo ? { reMinuscula: new RegExp(`(?<![${L}])${esc(k)}(?![${L}])`, 'gu') } : {}) });
}
if (MOSTRAR_CLASSES) {
  const amb = TERMOS.filter((t) => t.ambiguo);
  console.log(`${TERMOS.length} termos (grafias iguais em minúscula juntas), ${amb.length} ambíguos (contados só na forma do glossário):\n${amb.map((t) => t.termo).join(', ')}`);
  console.log(`${COMUNS.size} comuns (só aviso): ${[...COMUNS].join(', ')}`);
  if (SAIDA_CLASSES) {
    const linhas = amb.sort((a, b) => b.nMin - a.nMin || a.termo.localeCompare(b.termo, 'pt')).map((t) => `| ${t.termo} | ${t.nMin} | ${t.nMai} |`);
    fs.writeFileSync(SAIDA_CLASSES, [
      '# Os termos ambíguos: a trava vigia só a forma com maiúscula',
      '',
      `Gerado por \`node scripts/revisao/trava.mjs --classes ../tmp/revisao-textos/${path.basename(SAIDA_CLASSES)}\` (base ${BASE}; glossário com ${Object.values(GLOS).flat().length} entradas em ${Object.keys(GLOS).length} seções, ${porChave.size} grafias distintas sem diferenciar maiúsculas).`,
      'Regenerar quando o glossário mudar. Cada termo abaixo é do glossário com maiúscula e aparece em minúscula em metade ou',
      'mais das vezes nos capítulos da base (sem os blocos gerados). A trava conta só a forma com maiúscula; o uso em',
      'minúscula só gera aviso quando a contagem muda. **A Revisora lê com atenção o uso em minúscula destes termos.**',
      '',
      `${amb.length} termos, do mais usado em minúscula para o menos.`,
      '',
      '| Termo | Em minúscula | Com maiúscula |',
      '|---|---|---|',
      ...linhas, ''].join('\n'));
    console.log(`gravado: ${SAIDA_CLASSES}`);
  }
}
// O endereço de um link (o "virtudes" de /regras/aparencia-virtudes-vontade) não é texto: as letras dele viram espaço,
// do mesmo tamanho, antes de contar termo (a posição dos números fica a mesma)
// RT-032 (T11, 24/11/2026): "Força de Vontade" é o nome do livro e "Vontade" a forma curta, o MESMO termo. Para a trava, os dois
// valem "Vontade" (nos dois lados da comparação), senão cada troca de nome mudaria o par termo-número e o termo "Força".
const semEnderecos = (t) => t.replace(/Força de Vontade/gi, 'Vontade').replace(/(\]\()([^)]*)(\))/g, (m, a, u, b) => a + ' '.repeat(u.length) + b)
  .replace(/((?:href|src)=")([^"]*)(")/g, (m, a, u, b) => a + ' '.repeat(u.length) + b);
const termos = (t) => { t = semEnderecos(t); const m = new Map(); for (const x of TERMOS) { const n = (t.match(x.re) || []).length; if (n) m.set(x.termo, n); } return m; };
const minusculasAmbiguas = (t) => { t = semEnderecos(t); const m = new Map(); for (const x of TERMOS) if (x.reMinuscula) { const n = (t.match(x.reMinuscula) || []).length; if (n) m.set(x.termo.toLowerCase(), n); } return m; };

// ---------------------------------------------------------------- os pares termo e número (item 6 do cabeçalho)
const RE_FIM_FRASE = /[.!?;](?=\s)|\n[ \t]*\n|\n(?=[ \t]*(?:[-*+]\s|\d+\.\s|\||#|<))/g;
function pares(t) {
  // os termos com posição; o contido num mais longo sai
  const brutos = [];
  t = semEnderecos(t); // (a troca Força de Vontade → Vontade muda o tamanho: termos e números medem sobre o mesmo texto)
  const tSemEnd = t;
  for (const x of TERMOS) for (const m of tSemEnd.matchAll(x.re)) brutos.push({ i: m.index, f: m.index + m[0].length, termo: x.termo });
  brutos.sort((a, b) => a.i - b.i || b.f - a.f);
  const ts = [];
  for (const b of brutos) { const u = ts[ts.length - 1]; if (u && b.i < u.f) continue; ts.push(b); }
  const fins = [...t.matchAll(RE_FIM_FRASE)].map((m) => m.index);
  const frase = (p) => { let lo = 0, hi = fins.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (fins[mid] < p) lo = mid + 1; else hi = mid; } return lo; };
  for (const x of ts) x.frase = frase(x.i);
  const out = [], recurso = [];
  for (const n of numerosPos(t)) {
    const fr = frase(n.i);
    let pelaAnterior = false;
    let melhor = null, dist = Infinity;
    for (const x of ts) {
      if (x.frase !== fr) continue;
      const d = x.f <= n.i ? n.i - x.f : x.i - n.f;
      if (d < dist || (d === dist && x.f <= n.i)) { melhor = x; dist = d; }
    }
    // a frase que virou duas: o último termo da frase anterior que tem texto (a linha em branco entre parágrafos é uma
    // fronteira a mais, e a frase vazia entre as duas fronteiras é pulada)
    if (!melhor) {
      for (let k = fr - 1; k >= 0; k--) {
        const ini = k === 0 ? 0 : fins[k - 1] + 1, fim = fins[k] ?? t.length;
        if (!/[\p{L}\p{N}]/u.test(t.slice(ini, fim))) continue;
        melhor = ts.filter((x) => x.frase === k).pop() || null;
        pelaAnterior = !!melhor;
        break;
      }
    }
    out.push(`${melhor ? melhor.termo : '(nenhum)'} ↔ ${n.valor}`);
    if (pelaAnterior) recurso.push(out[out.length - 1]);
  }
  const r = conta(out);
  r.recurso = conta(recurso);
  return r;
}
// O par que só muda entre "(nenhum)" e um termo achado pelo recurso da frase anterior não é par desfeito: é a heurística
// que leu a frase partida (ou juntada) de outro jeito (CORRIGE da Revisora no f003b69b; racas.md e vida-ferimentos-cura.md
// tinham PROCEDE). Cancela um "(nenhum) ↔ v" que entra contra um "T ↔ v" que sai e era da frase anterior, e o contrário;
// sobra alguma diferença, é falha. O número trocado entre termos da mesma frase (a burla 4) e o par que passa do termo A
// para o termo B não se cancelam.
function sobraPares(pa, pd) {
  const d = new Map();
  for (const k of new Set([...pa.keys(), ...pd.keys()])) d.set(k, (pd.get(k) || 0) - (pa.get(k) || 0));
  const valor = (k) => k.slice(k.indexOf(' ↔ ') + 3);
  for (const [k, x] of d) {
    if (!k.startsWith('(nenhum) ↔ ') || x === 0) continue;
    let resto = x;
    for (const [k2, x2] of d) {
      if (!resto) break;
      if (k2 === k || valor(k2) !== valor(k)) continue;
      if (resto > 0 && x2 < 0) { const c = Math.min(resto, -x2, pa.recurso.get(k2) || 0); d.set(k2, x2 + c); resto -= c; }
      else if (resto < 0 && x2 > 0) { const c = Math.min(-resto, x2, pd.recurso.get(k2) || 0); d.set(k2, x2 - c); resto += c; }
    }
    d.set(k, resto);
  }
  return [...d.values()].some((x) => x !== 0);
}

// ---------------------------------------------------------------- as linhas de tabela (item 6 do cabeçalho)
const limpaCelula = (c) => c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
function assinaturaDados(celulas) {
  const comNumero = celulas.map((c) => [...numerosPos(c).map((n) => n.valor), ...[...dados(c).keys()]].join(' ')).filter(Boolean);
  return comNumero.length ? `linha: ${comNumero.join(' | ')}` : null;
}
function linhasTabela(t, ext) {
  const out = [];
  if (ext === '.astro') {
    for (const m of t.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)) {
      const celulas = [...m[1].matchAll(/<t([dh])\b[^>]*>([\s\S]*?)<\/t[dh]>/g)];
      if (!celulas.length) continue;
      if (celulas.some((c) => c[1] === 'h')) out.push(`cabeçalho: ${celulas.map((c) => limpaCelula(c[2])).join(' | ')}`);
      else { const a = assinaturaDados(celulas.map((c) => limpaCelula(c[2]))); if (a) out.push(a); }
    }
    return conta(out);
  }
  if (ext === '.json') return conta(out);
  const linhas = t.split('\n');
  const separador = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
  linhas.forEach((l, i) => {
    if (!/^\s*\|/.test(l) || separador(l)) return;
    const celulas = l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/);
    if (linhas[i + 1] !== undefined && separador(linhas[i + 1])) out.push(`cabeçalho: ${celulas.map(limpaCelula).join(' | ')}`);
    else { const a = assinaturaDados(celulas); if (a) out.push(a); }
  });
  return conta(out);
}

// ---------------------------------------------------------------- a comparação
function difMulti(a, b) { // o que sobra de cada lado
  const sai = [], entra = [];
  for (const k of new Set([...a.keys(), ...b.keys()])) { const d = (b.get(k) || 0) - (a.get(k) || 0); if (d < 0) sai.push(`${k} (−${-d})`); if (d > 0) entra.push(`${k} (+${d})`); }
  return { sai, entra };
}
const temDif = (d) => d.sai.length || d.entra.length;
const mostra = (d) => `saem ${d.sai.join(', ') || 'nenhum'}; entram ${d.entra.join(', ') || 'nenhum'}`;
function comparar(arq) {
  const falhas = [], avisos = [];
  const ext = path.extname(arq);
  let antes = lf(naBase(arq)), depois = lf(noDisco(arq));
  if (antes == null) return { falhas: ['arquivo novo desde a base: a trava não tem com o que comparar'], avisos };
  if (depois == null) return { falhas: ['arquivo removido desde a base'], avisos };
  if (antes === depois) {
    const pendentes = [...ENTRADAS, ...ENTRADAS_JSON].filter((x) => x.arquivo === arq).map((e) => e.rt);
    if (pendentes.length) avisos.push(`igual à base; entrada(s) ainda não aplicada(s): ${[...new Set(pendentes)].join(', ')}`);
    return { falhas, avisos };
  }
  const ehPagina = /^src\/(content\/chapters|pages)\//.test(arq) && ext !== '.json';
  let titJsonA = null, titJsonD = null;
  if (ext === '.json') {
    // as linhas Trava JSON: o campo de fora da prosa muda no antes, se a base tiver o valor de antes e o arquivo de agora
    // tiver o de depois
    const oA = JSON.parse(antes), oD = JSON.parse(depois);
    for (const e of ENTRADAS_JSON.filter((x) => x.arquivo === arq)) {
      const vA = valorEm(oA, e.caminho), vD = valorEm(oD, e.caminho);
      // a linha que não casa com a base e não foi aplicada só avisa: num arquivo de muitas entradas (o regras.json), uma
      // entrada não aplicada ainda não pode travar a página que aplica outra; o valor mudado sem casar continua falhando
      const naBaseOk = vA.existe && igualJson(vA.v, e.antes), aplicada = vD.existe && igualJson(vD.v, e.depois);
      const intacta = vD.existe && vA.existe && igualJson(vD.v, vA.v);
      if (aplicada && naBaseOk) { poeEm(oA, e.caminho, e.depois); continue; }
      if (intacta) { avisos.push(`${e.rt}: Trava JSON @${e.caminho} ainda não aplicada${naBaseOk ? '' : ` (e a linha não casa com a base: ela diz ${JSON.stringify(e.antes)}, a base tem ${JSON.stringify(vA.v)})`}`); continue; }
      falhas.push(`${e.rt}: Trava JSON @${e.caminho}: a base tem ${vA.existe ? JSON.stringify(vA.v) : '(o caminho não existe)'}, agora há ${vD.existe ? JSON.stringify(vD.v) : '(o caminho não existe)'}, e a linha diz ${JSON.stringify(e.antes)} → ${JSON.stringify(e.depois)}`);
    }
    const a = prosaDoJson(oA, arq), d = prosaDoJson(oD, arq);
    if (a.esqueleto !== d.esqueleto) falhas.push('o JSON mudou fora dos campos de prosa (a lista CAMPOS_PROSA, no cabeçalho)');
    antes = a.texto; depois = d.texto; titJsonA = a.campos.map((c) => c.titulo); titJsonD = d.campos.map((c) => c.titulo);
  } else { antes = semGerados(antes); depois = semGerados(depois); }
  // as entradas do contradicoes.md, aplicadas no antes
  for (const e of ENTRADAS.filter((x) => x.arquivo === arq)) {
    // A entrada se aplica quando o "depois" está no arquivo de agora. Quando não está e o "antes" segue no arquivo tantas
    // vezes quanto na base, ela só ainda não foi aplicada (aviso): num arquivo de muitas entradas, a página que aplica
    // uma não fica barrada pelas outras. O "antes" que saiu sem o "depois" entrar falha. A entrada cujo "antes" não está na
    // base só avisa enquanto não estiver aplicada; se o "depois" dela apareceu, falha.
    // "Aplicada" (CORRIGE da Revisora no ca8040e4): o "antes" saiu as vezes pedidas e o "depois" está no arquivo; quando o
    // "antes" está dentro do "depois" (o trecho que cresce), a contagem do "depois" subiu as vezes pedidas; a entrada que
    // apaga ("depois" vazio) basta o "antes" ter saído. Não aplicada, com o "antes" intacto: numa PÁGINA reescrita
    // (src/content/chapters, src/pages) FALHA, a não ser que esteja em "Entradas adiadas" no estado.md; no src/data
    // continua aviso, porque um JSON de muitas entradas é tocado por várias páginas. O "antes" que saiu sem o "depois"
    // entrar falha em todo arquivo.
    const n = antes.split(e.antes).length - 1, nAgora = depois.split(e.antes).length - 1;
    const dBase = e.depois === '' ? 0 : antes.split(e.depois).length - 1, dAgora = e.depois === '' ? 0 : depois.split(e.depois).length - 1;
    const aplicada = e.depois === '' ? nAgora <= n - e.vezes
      : e.depois.includes(e.antes) ? dAgora >= dBase + e.vezes
      : nAgora <= n - e.vezes && dAgora >= dBase + e.vezes * (1 - (e.antes.split(e.depois).length - 1));
    const adiada = ADIADAS.some((x) => x.arquivo === arq && x.rt === e.rt);
    const naoAplicada = (msg) => { if (ehPagina && !adiada) falhas.push(msg + ' (página reescrita: toda entrada do arquivo entra no commit dela)'); else avisos.push(msg); };
    if (n < e.vezes) {
      if (dAgora > dBase && e.depois !== '') falhas.push(`${e.rt}: o "antes" da entrada está ${n} vez(es) no arquivo da base, e a entrada pede ${e.vezes}: "${e.antes}" (e o "depois" já está no arquivo)`);
      else naoAplicada(`${e.rt}: entrada que não casa com a base (o "antes" está ${n} vez(es), a entrada pede ${e.vezes}: "${e.antes}"), ainda não aplicada`);
      continue;
    }
    if (!aplicada) {
      if (nAgora >= n) naoAplicada(`${e.rt}: a entrada ainda não está aplicada neste arquivo ("${e.antes}" segue ${nAgora} vez(es))`);
      else falhas.push(`${e.rt}: o "antes" saiu do arquivo (${n} → ${nAgora} vez(es)), mas o "depois" da entrada não está nele: "${e.depois}"`);
      continue;
    }
    if (adiada) avisos.push(`${e.rt}: está em "Entradas adiadas" do estado.md, e a entrada já está aplicada neste arquivo (tire a linha)`);
    for (let i = 0; i < e.vezes; i++) antes = antes.replace(e.antes, e.depois);
  }
  for (const x of ADIADAS.filter((y) => y.arquivo === arq && !ENTRADAS.some((e) => e.arquivo === arq && e.rt === y.rt)))
    avisos.push(`${x.rt}: está em "Entradas adiadas" do estado.md para este arquivo, mas não tem entrada nele`);
  // o frontmatter (--- ... ---) fica igual, salvo entrada (decisão do Arquiteto, 15/11/2026)
  const fm = (t) => (t.match(/^---\n[\s\S]*?\n---\n/) || [''])[0];
  if (fm(antes) !== fm(depois)) falhas.push(`o frontmatter mudou: antes ${JSON.stringify(fm(antes).slice(0, 160))}, agora ${JSON.stringify(fm(depois).slice(0, 160))}`);
  // o endereço de link (o "3" da âncora #salto-velocidade-3) não é texto: sai de toda contagem daqui em diante (decisão do
  // Arquiteto, 15/11/2026)
  if (ext !== '.json') { antes = semEnderecos(antes); depois = semEnderecos(depois); }
  // os movimentos de seção do estado.md, aplicados nas seções do antes
  const sA = secoes(antes, ext, titJsonA), sD = secoes(depois, ext, titJsonD);
  for (const mv of MOVIMENTOS.filter((x) => x.arquivo === arq)) {
    const de = sA.find((s) => s.titulo === mv.de && s.texto.includes(mv.trecho)), para = sA.find((s) => s.titulo === mv.para);
    if (!de || !para) { falhas.push(`movimento de seção do estado.md não casa: "${mv.trecho}" de "${mv.de}" → "${mv.para}"`); continue; }
    de.texto = de.texto.replace(mv.trecho, ''); para.texto += '\n' + mv.trecho + '\n';
  }
  // no arquivo inteiro vale o antes com as entradas (o movimento não muda contagem, e as seções não levam os títulos)
  const antesMovido = antes;
  // no arquivo: o artigo, os termos e os títulos
  const nA = numeros(antesMovido), nD = numeros(depois);
  const df = difMulti(nA.fracos, nD.fracos);
  if (temDif(df)) avisos.push(`"um"/"uma" mudaram de contagem (artigo, só aviso): ${[...df.sai, ...df.entra].join(', ')}`);
  const tA = termos(antesMovido), tD = termos(depois);
  const sumiu = [...tA.keys()].filter((k) => !tD.has(k)), novo = [...tD.keys()].filter((k) => !tA.has(k));
  const ehComum = (k) => COMUNS.has(k.toLowerCase());
  if (sumiu.some((k) => !ehComum(k))) falhas.push(`termo protegido some do arquivo: ${sumiu.filter((k) => !ehComum(k)).join(', ')}`);
  const acrescentado = (k) => ACRESCENTADOS.some((x) => x.arquivo === arq && x.termo === k.toLowerCase());
  if (novo.some((k) => !ehComum(k) && !acrescentado(k))) falhas.push(`termo protegido aparece novo no arquivo: ${novo.filter((k) => !ehComum(k) && !acrescentado(k)).join(', ')}`);
  for (const k of novo.filter((x) => !ehComum(x) && acrescentado(x))) avisos.push(`termo acrescentado (linha em "Termos acrescentados" do estado.md): ${k}`);
  // cada aviso de termo numa linha pronta para o estado.md (regra do autor: todo aviso se resolve lá, como "termo do
  // jogo, intacto" ou "palavra comum"): arquivo, termo, contagem antes → depois, e o lugar da resolução
  const avisoTermo = (k, motivo) => avisos.push(`- \`${arq}\` · "${k}" · ${tA.get(k) || 0} → ${tD.get(k) || 0} · ${motivo} · resolução: `);
  for (const k of [...sumiu, ...novo].filter(ehComum)) avisoTermo(k, 'termo comum ' + (tA.has(k) ? 'some' : 'aparece'));
  for (const k of [...tA.keys()].filter((x) => tD.has(x) && tD.get(x) !== tA.get(x))) avisoTermo(k, (ehComum(k) ? 'termo comum' : 'termo') + ', outra contagem');
  const mA = minusculasAmbiguas(antesMovido), mD = minusculasAmbiguas(depois);
  for (const k of new Set([...mA.keys(), ...mD.keys()])) if ((mA.get(k) || 0) !== (mD.get(k) || 0))
    avisos.push(`- \`${arq}\` · "${k}" · ${mA.get(k) || 0} → ${mD.get(k) || 0} · ambíguo em minúscula · resolução: `);
  const hA = titulos(antes, ext), hD = titulos(depois, ext);
  const titulosIguais = JSON.stringify(hA) === JSON.stringify(hD) && sA.length === sD.length;
  if (JSON.stringify(hA) !== JSON.stringify(hD)) {
    const i = hA.findIndex((h, j) => h !== hD[j]);
    falhas.push(`títulos de seção mudaram (a partir do ${i < 0 ? hA.length + 1 : i + 1}º): antes ${JSON.stringify(hA.slice(Math.max(0, i), Math.max(0, i) + 3))}, agora ${JSON.stringify(hD.slice(Math.max(0, i), Math.max(0, i) + 3))}`);
  }
  // por seção: números, dados e pares termo-número (sem os títulos alinhados, os números e os dados no arquivo inteiro)
  if (!titulosIguais) {
    const dn = difMulti(nA.fortes, nD.fortes); if (temDif(dn)) falhas.push(`números sem entrada (arquivo inteiro): ${mostra(dn)}`);
    const dd = difMulti(dados(antesMovido), dados(depois)); if (temDif(dd)) falhas.push(`dado ou fórmula sem entrada (arquivo inteiro): ${mostra(dd)}`);
  } else {
    sA.forEach((sec, i) => {
      const a = sec.texto, d = sD[i].texto;
      if (a === d) return;
      const onde = `seção "${sec.titulo}"`;
      const dn = difMulti(numeros(a).fortes, numeros(d).fortes); if (temDif(dn)) falhas.push(`números sem entrada, ${onde}: ${mostra(dn)}`);
      const dd = difMulti(dados(a), dados(d)); if (temDif(dd)) falhas.push(`dado ou fórmula sem entrada, ${onde}: ${mostra(dd)}`);
      if (!temDif(dn)) {
        const pa = pares(a), pd = pares(d), dp = difMulti(pa, pd);
        if (temDif(dp)) (sobraPares(pa, pd) ? falhas : avisos).push(`par termo e número desfeito, ${onde}: ${mostra(dp)}${sobraPares(pa, pd) ? '' : ' (só entre "(nenhum)" e o termo da frase anterior: a leitura da frase partida, e não par desfeito)'}`);
      }
      const dl = difMulti(linhasTabela(a, ext), linhasTabela(d, ext)); if (temDif(dl)) falhas.push(`linha de tabela mudou (colunas trocadas, número de célula ou cabeçalho), ${onde}: ${mostra(dl)}`);
    });
  }
  return { falhas, avisos };
}

// ---------------------------------------------------------------- saída
let caiu = 0;
if (arquivos.length || !SAIDA_CLASSES) {
  console.log(`trava · base ${BASE} · ${arquivos.length} arquivo(s) · ${ENTRADAS.length} entrada(s) de trava e ${ENTRADAS_JSON.length} Trava JSON em ${path.relative(REPO, CONTRADICOES) || CONTRADICOES} · ${MOVIMENTOS.length} movimento(s) de seção em ${path.relative(REPO, ESTADO) || ESTADO}`);
  // as entradas cujo arquivo não existe na base nunca se aplicam: aviso no topo, para quem escreveu o contradicoes.md
  if (PENDENTES.size) console.log(`    · entrada(s) PENDENTE AUTOR (não se aplicam nesta revisão): ${[...PENDENTES].sort().join(', ')}; com linha Trava, puladas: ${[...PULADAS].sort().join(', ') || 'nenhuma'}`);
  if (ADIADAS.length) console.log(`    · entrada(s) adiada(s) no estado.md: ${ADIADAS.map((x) => `${x.rt} (\`${x.arquivo}\`: ${x.motivo})`).join('; ')}`);
  for (const e of ERROS_ENTRADA) console.log(`    ✘ ${e}`);
  if (ERROS_ENTRADA.length) caiu++;
  const orfas = [...new Set([...ENTRADAS, ...ENTRADAS_JSON].filter((e) => naBase(e.arquivo) == null).map((e) => `${e.rt} (\`${e.arquivo}\`)`))];
  if (orfas.length) console.log(`    · entrada(s) com arquivo que não existe na base (nome ambíguo ou caminho errado): ${orfas.join(', ')}`);
  for (const arq of arquivos) {
    const { falhas, avisos } = comparar(arq);
    if (falhas.length) caiu++;
    console.log(`${falhas.length ? '✘' : '✓'} ${arq}`);
    for (const f of falhas) console.log(`    ✘ ${f}`);
    for (const a of avisos) console.log(a.startsWith('- `') ? `    ${a}` : `    · ${a}`);
  }
  if (caiu) { console.error(`✘ trava: ${caiu} arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada`); process.exit(1); }
  console.log('✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada');
}
