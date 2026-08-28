// test-deslocamento.mjs — prova do deslocamento do bestiário.
//
// O satélite (gen-deslocamento.mjs) traduz a velocidade da criatura ORIGINAL,
// em pés por round, para as três velocidades da mesa em metros por Tick. Duas
// coisas podem quebrar sem fazer barulho: o fator de conversão sair do lugar, e
// o arredondamento inverter a ordem das três em números baixos. As duas doem só
// na mesa, quando alguém tenta mover uma peça e o Grid pede um número que não
// existe. Então elas se medem aqui, e falhar aqui aborta o build.
//
// A calibração é o coração: 30 ft tem de dar 3 m/Tick, porque 3 é o passo do
// soldado pela régua de regras.json, e 20 ft tem de dar 2, porque 2 é o que
// racas.json cobra por baixa estatura. Se um dia o fator mudar, é aqui que a
// conta avisa.
//
// Roda no `npm run validate`.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ler = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data', f), 'utf8'));
const DESL = ler('deslocamento-bestiario.json');
const MON = ler('monsters.json');
const REGRAS = ler('regras.json');
const RACAS = ler('racas.json');

const falhas = [];
const ok = (cond, msg) => { if (!cond) falhas.push(msg); };

// ---------------------------------------------------- cobertura: ninguém fica sem
const semBloco = MON.filter((m) => !m.combate?.deslocamento);
ok(semBloco.length === 0,
  `${semBloco.length} criaturas sem combate.deslocamento (${semBloco.slice(0, 5).map((m) => m.id).join(', ')})`);
const semSatelite = MON.filter((m) => !DESL[m.id]);
ok(semSatelite.length === 0,
  `${semSatelite.length} criaturas fora do satélite (${semSatelite.slice(0, 5).map((m) => m.id).join(', ')})`);

// ------------------------------------------------- as três, e na ordem certa
// A ordem não é estética: a média dos três primeiros segundos não pode passar da
// velocidade de topo, e o passo com a guarda de pé não pode passar do arranque.
for (const m of MON) {
  const d = m.combate?.deslocamento;
  if (!d) continue;
  const tres = [d.batalha, d.arranque, d.corrida];
  if (!tres.every((n) => Number.isInteger(n))) { falhas.push(`${m.id}: velocidade não inteira (${tres.join('/')})`); continue; }
  if (!(d.batalha <= d.arranque && d.arranque <= d.corrida)) falhas.push(`${m.id}: fora de ordem (${tres.join(' ≤ ')})`);
  if (d.batalha < 1 || d.batalha > 20) falhas.push(`${m.id}: batalha absurda (${d.batalha} m/Tick)`);
  if (d.corrida > 40) falhas.push(`${m.id}: corrida absurda (${d.corrida} m/Tick)`);
}

// ------------------------------------------------ o satélite e o embutido batem
// O gen-monsters.mjs copia batalha/arranque/corrida e larga `ft` e `origem`, que
// são metadados da semeadura. Se um dia ele passar a copiar o objeto inteiro, a
// mesa começa a receber campos que ela não sabe ler.
for (const m of MON) {
  const d = m.combate?.deslocamento, s = DESL[m.id];
  if (!d || !s) continue;
  if (d.batalha !== s.batalha || d.arranque !== s.arranque || d.corrida !== s.corrida) {
    falhas.push(`${m.id}: o embutido não bate com o satélite`);
  }
  const sobra = Object.keys(d).filter((k) => !['batalha', 'arranque', 'corrida'].includes(k));
  if (sobra.length) falhas.push(`${m.id}: campo a mais no embutido (${sobra.join(', ')})`);
}

// ------------------------------------------------------------- a calibração
// A régua humana, do outro lado do sistema: o soldado de Destreza 2 e Atletismo 2
// anda 3 m no passo de batalha, e a raça de baixa estatura anda dois terços disso.
const d6 = REGRAS.derivados.deslocamento;
const passoDoSoldado = Math.round(d6.normal.base + (2 * d6.normal.destreza) + (2 * d6.normal.atletismo));
ok(passoDoSoldado === 3, `o passo do soldado pela régua deu ${passoDoSoldado}, e a calibração assume 3`);
const frac = RACAS.find((r) => r.deslocamentoFrac)?.deslocamentoFrac;
ok(Math.round(3 * frac) === 2, `baixa estatura sobre 3 deu ${Math.round(3 * frac)}, e a calibração assume 2`);

// E o bestiário do outro: uma criatura de 30 ft tem de sair com batalha 3, uma de
// 20 ft com 2. Procuramos um exemplar real de cada, para a prova não virar
// aritmética sobre si mesma.
const de = (ft) => Object.entries(DESL).find(([, v]) => v.ft === ft);
const trinta = de(30), vinte = de(20);
ok(trinta && trinta[1].batalha === 3, `30 ft deveria dar batalha 3, veio ${trinta?.[1].batalha}`);
ok(trinta && trinta[1].arranque === 5 && trinta[1].corrida === 7,
  `30 ft deveria dar 3 · 5 · 7 (o soldado), veio ${trinta && [trinta[1].batalha, trinta[1].arranque, trinta[1].corrida].join(' · ')}`);
ok(vinte && vinte[1].batalha === 2, `20 ft deveria dar batalha 2, veio ${vinte?.[1].batalha}`);

// -------------------------------------------------- o número em pés é plausível
for (const [id, v] of Object.entries(DESL)) {
  if (!Number.isFinite(v.ft) || v.ft < 0 || v.ft > 300) falhas.push(`${id}: ft fora da faixa (${v.ft})`);
  if (!['fonte', 'tabela'].includes(v.origem)) falhas.push(`${id}: origem desconhecida (${v.origem})`);
}

// ------------------------------------------------- o bestiário ainda tem relevo
// A razão de não derivar dos atributos era não achatar a diferença entre o lobo,
// o gigante e o caramujo. Se um dia alguém trocar a semeadura por uma fórmula,
// a variedade some, e é isso que esta asserção pega.
const batalhas = Object.values(DESL).map((v) => v.batalha);
ok(new Set(batalhas).size >= 5, `só ${new Set(batalhas).size} valores distintos de batalha: o bestiário achatou`);
ok(Math.max(...batalhas) >= 2 * Math.min(...batalhas),
  `a criatura mais rápida (${Math.max(...batalhas)}) não chega ao dobro da mais lenta (${Math.min(...batalhas)})`);

const nFonte = Object.values(DESL).filter((v) => v.origem === 'fonte').length;
if (falhas.length) {
  console.error(`\n✘ Deslocamento do bestiário FALHOU (${falhas.length}):`);
  for (const f of falhas.slice(0, 30)) console.error('  • ' + f);
  if (falhas.length > 30) console.error(`  … e mais ${falhas.length - 30}`);
  process.exit(1);
}
console.log(`✓ Deslocamento OK · ${MON.length} criaturas · ${nFonte} da fonte · `
  + `batalha de ${Math.min(...batalhas)} a ${Math.max(...batalhas)} m/Tick · calibração 30 ft = 3 m/Tick`);
