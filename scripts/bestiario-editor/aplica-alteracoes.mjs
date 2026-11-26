// aplica-alteracoes.mjs · aplica nos JSON do site (src/data/bestiario/*.json, a FONTE ÚNICA, B3) o arquivo de mudanças que o editor de
// fichas exporta (Etapa 2.1 do PLANO-25-26). Em Node, de propósito: o formato dos arquivos é o do JSON.stringify(indent 2) mais
// "\n", e os 324 já estão exatos nele, então o diff do git mostra só o campo mudado.
//
//   node scripts/bestiario-editor/aplica-alteracoes.mjs <alteracoes.json>             DRY-RUN: mostra o que faria, não grava nada
//   node scripts/bestiario-editor/aplica-alteracoes.mjs <alteracoes.json> --aplicar   grava, roda os geradores e lista os arquivos para o commit
//   opções: --site <pasta>   outra pasta de JSON (os testes usam)      --sem-geradores   não roda gen-bestiario, gen-monsters nem o validate
//           --backup <pasta> onde guardar os JSON de antes (padrão: tmp/arquiteto/bestiario/editor/site-antes-<data>/)
//
// O ARQUIVO (versão 2; a versão 1, de fichas .md, é recusada): { formato: "fichas-editor-alteracoes", versao: 2, exportado,
//   alteracoes: [{ id, caminho, antes, depois }] }. `caminho` é uma lista ["ataques", 2, "dano"] ou o texto "ataques.2.dano".
//   `antes` ausente = o campo não existe; `depois` ausente = remove o campo; índice igual ao tamanho da lista = acrescenta.
//
// REGRAS (herdadas do aplicador antigo e do 068/070 do coordenador):
//  - cada alteração traz o "antes"; se o JSON no disco tem outro valor, a criatura INTEIRA fica de fora (conflito) e nada nela é gravado;
//  - depois de aplicado, cada criatura é validada pelo criaturaParaLeituraSchema e o motor tem de aceitá-la; se UMA falha, o LOTE INTEIRO
//    é recusado e nada é gravado;
//  - o `id` não muda (renomear criatura quebra ficha salva e mesa);
//  - o dry-run LISTA À PARTE toda mudança de número (atributos, Habilidades, Vontade, Centelha, corpo, couraça, ataques) e o que o motor
//    calcula antes e depois (PV, Esquiva, Bloqueio, Defesa Mental e Social, Absorção, Iniciativa, Energia, Mana, velocidade e dano dos
//    ataques): mudança de número vinda de quem não é o autor vira consulta, e o commit de aplicação repete essa lista;
//  - formato e ordem de chaves preservados; uma cópia de cada JSON de antes vai para fora do git; o script NÃO commita.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { carregarTS } from '../lib-ts.mjs';
import { criaturaParaLeituraSchema } from '../criatura-schema.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const PASTA_PADRAO = path.join(RAIZ, 'src', 'data', 'bestiario');

const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const curto = (v) => (v === undefined ? '(ausente)' : JSON.stringify(v).slice(0, 120));
export const textoJson = (c) => JSON.stringify(c, null, 2) + '\n';

export function caminhoDe(c) {
  const l = Array.isArray(c) ? c : String(c).split('.');
  return l.map((k) => (typeof k === 'string' && /^\d+$/.test(k) ? Number(k) : k));
}
const rotulo = (cam) => cam.join('.');

/** O valor em `cam` dentro de `obj` (undefined se não existe). */
export function pegar(obj, cam) {
  let v = obj;
  for (const k of cam) { if (v === null || typeof v !== 'object' || !(k in Object(v))) return undefined; v = v[k]; }
  return v;
}
/** Grava `valor` em `cam` (valor undefined remove). Devolve null se deu, ou o motivo. */
export function por(obj, cam, valor) {
  let v = obj;
  for (const k of cam.slice(0, -1)) { if (v === null || typeof v !== 'object' || !(k in v)) return `o caminho ${rotulo(cam)} não existe no JSON`; v = v[k]; }
  const ult = cam[cam.length - 1];
  if (v === null || typeof v !== 'object') return `o caminho ${rotulo(cam)} não existe no JSON`;
  if (Array.isArray(v)) {
    if (typeof ult !== 'number') return `${rotulo(cam)}: o índice de uma lista é um número`;
    if (valor === undefined) return `${rotulo(cam)}: tirar item de lista não é suportado (troque a lista inteira)`;
    if (ult > v.length) return `${rotulo(cam)}: índice fora da lista (${v.length} itens)`;
    v[ult] = valor; return null;
  }
  if (valor === undefined) delete v[ult]; else v[ult] = valor;
  return null;
}

// MUDANÇA DE NÚMERO = qualquer campo que não seja narrativo. Lista PRETA (e não branca): uma chave nova com número entra sozinha na lista à
// parte, e o que fica de fora é só o que é texto da criatura. Narrativas de topo: a identidade e os textos; narrativas em qualquer
// profundidade: o nome, a descrição e parecidos. EXCEÇÃO (consequência da regra "número dentro de texto continua sendo número"): dentro de
// habilidadesEspeciais, formas, artes e ataques a prosa de regra (efeito, texto, ativacao, duracao, nome) carrega número ("devolve 1d6 PV",
// "Velocidade 5", "6 Ticks", "Regeneração 5"), então ali NÃO é narrativa: mas só conta se o NÚMERO mudou. O que se compara são os números
// extraídos do texto, antes e depois (em multiconjunto), e não a string: reescrever a prosa mantendo os mesmos números não abre a seção.
const NARRATIVAS_TOPO = new Set(['id', 'idAntigo', 'nome', 'nomeIngles', 'categoria', 'papel', 'comoLuta', 'sentidos', 'fisiologia', 'aptidoes', 'comportamento', 'ecologia', 'descricao', 'lore', 'imagens', 'elementos', 'revisao', 'fonte', 'formaPrincipal']);
const NARRATIVAS_FOLHA = new Set(['nome', 'descricao', 'texto', 'justificativa', 'motivo', 'legenda', 'foco', 'origem', 'ativacao', 'duracao', 'categoria', 'efeito', 'classe', 'tracos', 'camuflagem', 'postura', 'posturaDoTamanho', 'apoio', 'id', 'forma', 'formas', 'parte', 'tipoDano', 'arma']);
const ESTRUTURAS_DE_REGRA = new Set(['habilidadesEspeciais', 'formas', 'artes', 'ataques']);
const PROSA_DE_REGRA = new Set(['efeito', 'texto', 'ativacao', 'duracao', 'nome']);
/** Os números de um texto, em ordem canônica ("1d6" dá 1 e 6; "1,5" e "1.5" valem o mesmo). */
export const numerosDe = (s) => (String(s).match(/\d+(?:[.,]\d+)?/g) || []).map((x) => x.replace(',', '.')).sort().join('|');
export function ehNumero(a) {
  const topo = String(a.cam[0]), folha = String(a.cam[a.cam.length - 1]);
  if (NARRATIVAS_TOPO.has(topo)) return false;
  const temNumero = (x) => typeof x === 'number' || (typeof x === 'string' && /\d/.test(x)) || (x !== null && typeof x === 'object' && /\d/.test(JSON.stringify(x)));
  if (ESTRUTURAS_DE_REGRA.has(topo) && PROSA_DE_REGRA.has(folha)) {
    if (typeof a.antes === 'string' && typeof a.depois === 'string') return numerosDe(a.antes) !== numerosDe(a.depois);
    return temNumero(a.antes) || temNumero(a.depois);
  }
  if (NARRATIVAS_FOLHA.has(folha)) return false;
  return temNumero(a.antes) || temNumero(a.depois);
}

const DERIVADOS = ['pv', 'pesoErguido', 'faixa', 'tamanho', 'esquiva', 'bloqueio', 'defesaMental', 'defesaSocial', 'iniciativa', 'energia', 'mana'];
function derivados(M, c) {
  const r = M.criatura(c);
  const d = {};
  for (const k of DERIVADOS) d[k] = r[k];
  d.absorcao = r.absorcao;
  d.ataques = Object.fromEntries((r.ataques || []).map((a) => [a.nome, { velocidade: a.velocidade, danoMedio: a.danoMedio, jogada: a.jogada }]));
  return d;
}
function diferencasDerivadas(a, b, p = '') {
  if (igual(a, b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object') return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap((k) => diferencasDerivadas(a[k], b[k], p ? `${p}.${k}` : k));
  return [`${p}: ${curto(a)} -> ${curto(b)}`];
}

/**
 * Planeja a aplicação (puro: lê a pasta, não grava). Devolve { criaturas: [{ id, antes, depois, alteracoes }], conflitos, erros, numeros }.
 *   `erros` não vazio = o lote inteiro é recusado.
 */
export async function planejar(arquivo, pasta = PASTA_PADRAO) {
  const erros = [], conflitos = [], criaturas = [], numeros = [];
  if (!arquivo || arquivo.formato !== 'fichas-editor-alteracoes') return { erros: ['o arquivo não é do formato "fichas-editor-alteracoes"'], conflitos, criaturas, numeros };
  if (arquivo.versao !== 2) return { erros: [`versão ${arquivo.versao} do arquivo de mudanças: este aplicador só lê a versão 2 (por caminho do JSON); a versão 1 era das fichas .md, que não vão mais para o site`], conflitos, criaturas, numeros };
  const M = await carregarTS('src/lib/motor.ts');
  const porId = new Map();
  for (const a of arquivo.alteracoes || []) {
    if (!a || typeof a.id !== 'string' || a.caminho === undefined) { erros.push('alteração sem id ou sem caminho: ' + curto(a)); continue; }
    if (!porId.has(a.id)) porId.set(a.id, []);
    porId.get(a.id).push({ ...a, cam: caminhoDe(a.caminho), temAntes: 'antes' in a, temDepois: 'depois' in a });
  }
  for (const [id, alts] of porId) {
    const arq = path.join(pasta, id + '.json');
    if (!fs.existsSync(arq)) { erros.push(`${id}: não há JSON dessa criatura em ${pasta} (criatura nova ainda não é suportada por este aplicador)`); continue; }
    const antes = JSON.parse(fs.readFileSync(arq, 'utf8'));
    const depois = structuredClone(antes);
    let falhou = false;
    for (const a of alts) {
      if (a.cam.length === 0) { erros.push(`${id}: caminho vazio`); falhou = true; continue; }
      if (a.cam[0] === 'id') { erros.push(`${id}: o id não muda (renomear criatura quebra ficha salva e mesa)`); falhou = true; continue; }
      const atual = pegar(depois, a.cam);
      const esperado = a.temAntes ? a.antes : undefined;
      if (!igual(atual, esperado)) { conflitos.push({ id, caminho: rotulo(a.cam), esperado, atual }); falhou = true; continue; }
      const motivo = por(depois, a.cam, a.temDepois ? a.depois : undefined);
      if (motivo) { erros.push(`${id}: ${motivo}`); falhou = true; }
    }
    if (falhou) continue; // a criatura inteira fica de fora; erro de caminho derruba o lote, conflito só tira a criatura
    try {
      criaturaParaLeituraSchema.parse(depois);
      if (depois.id !== id) throw new Error('o id mudou');
      M.vistaPublicaCriatura(depois);
    } catch (e) {
      erros.push(`${id}: a criatura depois da mudança não passa (${String(e.errors ? JSON.stringify(e.errors.slice(0, 3).map((x) => `${x.path.join('.')}: ${x.message}`)) : e.message).slice(0, 400)})`);
      continue;
    }
    criaturas.push({ id, arq, antes, depois, alteracoes: alts });
    for (const a of alts) if (ehNumero(a)) numeros.push({ id, caminho: rotulo(a.cam), antes: a.antes, depois: a.depois });
    const dif = diferencasDerivadas(derivados(M, antes), derivados(M, depois));
    for (const d of dif) numeros.push({ id, derivado: d });
  }
  if (erros.length) criaturas.length = 0;
  return { criaturas, conflitos, erros, numeros };
}

export function relatorio(plano, aplicar) {
  const L = [];
  if (plano.erros.length) { L.push(`✘ LOTE RECUSADO (${plano.erros.length}); nada é gravado:`); for (const e of plano.erros) L.push('  · ' + e); }
  if (plano.conflitos.length) {
    L.push(`⚠ CONFLITOS (${plano.conflitos.length}): o JSON no disco já não tem o "antes"; a criatura inteira fica de fora:`);
    for (const c of plano.conflitos) L.push(`  · ${c.id} ${c.caminho}: o editor esperava ${curto(c.esperado)}, o disco tem ${curto(c.atual)}`);
  }
  if (!plano.erros.length) {
    L.push(`${aplicar ? 'APLICADO' : 'DRY-RUN'}: ${plano.criaturas.length} criatura(s) com mudança`);
    for (const c of plano.criaturas) for (const a of c.alteracoes) L.push(`  ${c.id} ${rotulo(a.cam)}: ${curto(a.temAntes ? a.antes : undefined)} -> ${curto(a.temDepois ? a.depois : undefined)}`);
  }
  if (plano.numeros.length) {
    L.push('', '== MUDANÇAS DE NÚMERO (à parte; vindas de quem não é o autor, viram consulta; o commit de aplicação repete esta lista) ==');
    for (const n of plano.numeros) L.push(n.derivado ? `  ${n.id} (motor) ${n.derivado}` : `  ${n.id} ${n.caminho}: ${curto(n.antes)} -> ${curto(n.depois)}`);
  }
  return L.join('\n');
}

function ancestralTmp() {
  for (let d = RAIZ; ; d = path.dirname(d)) {
    const c = path.join(d, 'tmp', 'arquiteto', 'bestiario', 'editor');
    if (fs.existsSync(c)) return c;
    if (path.dirname(d) === d) return path.join(RAIZ, '..', 'tmp', 'arquiteto', 'bestiario', 'editor');
  }
}

/** Grava (com a cópia de antes), e devolve a lista de arquivos. */
export function gravar(plano, backup) {
  fs.mkdirSync(backup, { recursive: true });
  const arquivos = [];
  for (const c of plano.criaturas) {
    fs.copyFileSync(c.arq, path.join(backup, path.basename(c.arq)));
    fs.writeFileSync(c.arq, textoJson(c.depois), 'utf8');
    arquivos.push(c.arq);
  }
  return arquivos;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const val = (nome) => { const i = args.indexOf(nome); return i >= 0 ? args[i + 1] : undefined; };
  const entrada = args.find((a, i) => !a.startsWith('--') && !['--site', '--backup'].includes(args[i - 1]));
  if (!entrada) { console.error('uso: node scripts/bestiario-editor/aplica-alteracoes.mjs <alteracoes.json> [--aplicar] [--site <pasta>] [--sem-geradores] [--backup <pasta>]'); process.exit(2); }
  const pasta = path.resolve(val('--site') || PASTA_PADRAO);
  const aplicar = args.includes('--aplicar');
  const plano = await planejar(JSON.parse(fs.readFileSync(entrada, 'utf8')), pasta);
  console.log(relatorio(plano, aplicar));
  if (plano.erros.length) process.exit(1);
  if (!aplicar) { console.log('\nDRY-RUN: nada foi escrito. Rode com --aplicar para gravar.'); process.exit(0); }
  const carimbo = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
  const backup = path.resolve(val('--backup') || path.join(ancestralTmp(), `site-antes-${carimbo}`));
  const arquivos = gravar(plano, backup);
  console.log(`\n✓ ${arquivos.length} JSON gravado(s); os de antes em ${backup}`);
  if (!args.includes('--sem-geradores') && arquivos.length) {
    const roda = (cmd, ...a) => { const r = spawnSync(cmd, a, { cwd: RAIZ, encoding: 'utf8', shell: process.platform === 'win32' && cmd === 'npm' }); console.log(`  $ ${cmd} ${a.join(' ')} -> ${r.status === 0 ? 'ok' : 'FALHOU'}`); if (r.status !== 0) { console.log((r.stdout + r.stderr).slice(-800)); process.exit(1); } };
    roda('node', 'scripts/gen-bestiario.mjs');
    roda('node', 'scripts/gen-monsters.mjs');
    if (plano.criaturas.some((c) => c.alteracoes.some((a) => String(a.cam[0]) === 'fonte'))) roda('node', 'scripts/gen-fontes-criaturas.mjs');
    roda('npm', 'run', 'validate');
  }
  console.log('\nArquivos para o commit (por pathspec): ' + arquivos.map((f) => path.relative(RAIZ, f).replaceAll(path.sep, '/')).join(' '));
  console.log('Os gerados (src/data/inimigos.json, src/data/monsters*.json, ...) entram no mesmo commit se mudaram: git status --short.');
}
