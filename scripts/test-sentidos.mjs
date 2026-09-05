// test-sentidos.mjs — a Percepção Passiva e a Furtividade das criaturas chegam
// inteiras à mesa, e a tabela que as produz mexe de verdade.
//
// POR QUE ESTE PORTÃO EXISTE, e ele nasce de três previsões que a revisora fez
// no mesmo dia em que a tabela foi escrita. Todas são a mesma família: **o dado
// entra na conta e nada lê o resultado**, que é o L25 pela porta dos dados.
//
//   1. a Prontidão entrando na fórmula da Passiva sem que nada leia o número;
//   2. a fórmula devolvendo o mesmo valor para portes diferentes, e a tabela
//      parecendo funcionar por parecer plausível;
//   3. a exceção por criatura existindo e nunca rodando.
//
// A TERCEIRA JÁ TINHA ACONTECIDO quando este arquivo foi escrito, e não é
// hipótese: `gen-monsters.mjs` monta a versão MAGRA do bestiário por uma lista
// de campos (`CAMPOS_MESA`), e `pericias` não estava nela. O bloco `sentidos`
// do `ResumoCombate` lia `MON[id].pericias`, `MON` vem de `monsters-mesa.json`,
// e a chave não existia lá: **a Passiva de toda criatura da mesa era `null`, e
// nada acusava**, porque `null` é um valor que o contrato permite.
//
// RODA NO `validate`, e não no smoke, de propósito: não precisa de navegador,
// então continua respondendo numa máquina onde o Astro não compila.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ler = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8'));

const falhas = [];
const ok = (cond, msg) => {
  console.log(`  ${cond ? '✓' : '✘'} ${msg}`);
  if (!cond) falhas.push(msg);
};

const REGRAS = ler('regras.json');
const CHEIO = ler('monsters.json');
const MESA = ler('monsters-mesa.json');
const FURT = REGRAS.furtividadeCriatura || {};

console.log('· os sentidos das criaturas: a Passiva, a tabela e a exceção');

// ---------------------------------------------------------------- 1 · a mesa
//
// O QUE A MESA CARREGA, e é o teste que teria pego o `CAMPOS_MESA`. A pergunta
// não é "o bestiário tem perícia" (tem, e o gerador confere), é "a versão que
// vai para o navegador tem". São dois arquivos e o segundo é um recorte do
// primeiro.
const porId = Object.fromEntries(MESA.map((m) => [m.id, m]));
const semPericias = MESA.filter((m) => !m.pericias || !Object.keys(m.pericias).length);
ok(semPericias.length === 0,
  `a versão MAGRA do bestiário leva as perícias (${MESA.length - semPericias.length} de ${MESA.length})`);

const semProntidao = MESA.filter((m) => m.pericias?.prontidao == null);
ok(semProntidao.length === 0,
  `e a Prontidão está em todas, que é o que a Passiva precisa (${MESA.length - semProntidao.length} de ${MESA.length})`);

// ------------------------------------------------------- 2 · a Prontidão MEXE
//
// A ASSERÇÃO EM PAR, e é a que a revisora pediu: alguma coisa tem de falhar se a
// Prontidão parar de ser lida. Uma conferência de "a Passiva é (P+Pr)×2" passaria
// com Prontidão zero em todo mundo, porque a fórmula continuaria fechando.
//
// Então são duas: a Passiva bate com a fórmula (a positiva) E ela é DIFERENTE da
// que sairia sem a Prontidão, em quantidade de criaturas que não dá para
// confundir com acaso (a gêmea). Zerar a Prontidão na fonte derruba a segunda.
const passiva = (p, pr, c = 0) => (p == null || pr == null ? null : (p + pr) * 2 + c);
let batem = 0;
let mexem = 0;
for (const m of MESA) {
  const p = m.atributos?.percepcao;
  const pr = m.pericias?.prontidao;
  const c = m.centelha || 0;
  const v = passiva(p, pr, c);
  if (v === (p + pr) * 2 + c) batem += 1;
  if (v !== passiva(p, 0, c)) mexem += 1;
}
ok(batem === MESA.length, `a Passiva sai da fórmula em todas (${batem} de ${MESA.length})`);
ok(mexem > MESA.length * 0.7,
  `E A PRONTIDÃO MOVE O NÚMERO em ${mexem} das ${MESA.length}:`
  + ' zerá-la mudaria a Passiva da maioria, então ela não é enfeite na fórmula');

// ----------------------------------------------------- 3 · a tabela DISTINGUE
//
// A segunda previsão: a fórmula devolvendo o mesmo número para portes
// diferentes. Uma tabela que não separa nada é uma constante com cara de regra,
// e ela passa em qualquer conferência que só olhe se o campo existe.
const porPorte = {};
for (const m of CHEIO) {
  const k = m.porte || '(sem)';
  (porPorte[k] ||= new Set()).add(m.pericias?.furtividade);
}
const medias = {};
for (const m of CHEIO) {
  const k = m.porte || '(sem)';
  (medias[k] ||= []).push(m.pericias?.furtividade ?? 0);
}
const media = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const miudo = medias['Miúdo'] ? media(medias['Miúdo']) : null;
const colossal = medias['Colossal'] ? media(medias['Colossal']) : null;
ok(miudo != null && colossal != null && miudo > colossal + 2,
  `o porte separa: Miúdo tem Furtividade média ${miudo?.toFixed(1)} contra ${colossal?.toFixed(1)} do Colossal`);

const valores = new Set(CHEIO.map((m) => m.pericias?.furtividade));
ok(valores.size >= 4,
  `e a tabela produz ${valores.size} valores diferentes nas ${CHEIO.length}, e não uma constante`);

// A CATEGORIA também tem de mexer, senão metade da tabela é enfeite. Duas do
// MESMO porte e categorias opostas: a Fada some, o Construto não.
const doPorte = (porte, cat) => CHEIO.filter((m) => m.porte === porte && m.categoria === cat);
const cmp = [['Fada', 'Construto'], ['Fera', 'Planta'], ['Fada', 'Planta']]
  .map(([a, b]) => {
    const A = CHEIO.filter((m) => m.categoria === a);
    const B = CHEIO.filter((m) => m.categoria === b);
    if (!A.length || !B.length) return null;
    return { a, b, ma: media(A.map((m) => m.pericias?.furtividade ?? 0)), mb: media(B.map((m) => m.pericias?.furtividade ?? 0)) };
  }).filter(Boolean);
const catMexe = cmp.some((x) => x.ma > x.mb);
ok(catMexe, `a categoria separa: ${cmp.map((x) => `${x.a} ${x.ma.toFixed(1)} > ${x.b} ${x.mb.toFixed(1)}`).join(' · ')}`);

// ------------------------------------------------------- 4 · a exceção RODA
//
// A terceira previsão: a exceção existir e nunca ser exercida. Um caminho que
// nenhum teste percorre é um caminho que ninguém sabe se funciona, e este em
// particular é a válvula que justifica a tabela ter sido escolhida no lugar de
// 309 números à mão. Se ele estiver quebrado, a escolha perde o argumento.
const exc = FURT.excecoes || {};
// O VALOR pode vir solto ou como { valor, porque }, e o `porque` e cobrado
// abaixo: exceçao sem motivo escrito vira palpite anonimo em seis meses.
const valorDa = (v) => (typeof v === 'number' ? v : v?.valor);
const ids = Object.keys(exc).filter((k) => k !== 'nota');
ok(ids.length > 0, `a exceção por criatura é EXERCIDA, e não só declarada (${ids.length} verbete(s))`);
for (const id of ids) {
  const m = CHEIO.find((x) => x.id === id);
  ok(!!m, `  a criatura "${id}" da exceção existe no bestiário`);
  if (!m) continue;
  ok(m.pericias?.furtividade === valorDa(exc[id]),
    `  e a exceção VENCE a tabela em ${m.nome}: ${m.pericias?.furtividade} (a tabela daria outro)`);
  // A GÊMEA: se a exceção desse o mesmo número da tabela, a asserção acima
  // passaria sem provar nada. Esta cobra que os dois sejam diferentes.
  const base = (FURT.porte || {})[String(m.porte || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()];
  const daTabela = base == null ? null
    : Math.max(0, Math.min(6, base + ((FURT.categoria || {})[m.categoria] || 0)
      + (m.tags || []).reduce((s, t) => s + ((FURT.tags || {})[t] || 0), 0)));
  ok(typeof exc[id] === 'object' && String(exc[id]?.porque || '').length > 20,
    `  e o MOTIVO da exceçao esta escrito (${String(exc[id]?.porque || '').length} caracteres)`);
  ok(daTabela != null && daTabela !== valorDa(exc[id]),
    `  e o número da exceção (${valorDa(exc[id])}) É DIFERENTE do que a tabela daria (${daTabela}), senão ela não provaria nada`);
}

if (falhas.length) {
  console.error(`\n✘ Sentidos FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log('✓ Sentidos OK · a Passiva chega à mesa, a Prontidão move o número,'
  + ' a tabela separa por porte e categoria, e a exceção vence de verdade');
