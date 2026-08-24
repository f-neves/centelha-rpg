// test-quase-acerto.mjs — a válvula do capítulo XII, travada.
//
// O Quase-Acerto existia escrito e o motor nunca o calculava: a mesa fazia a
// conta de cabeça ou simplesmente não usava a regra que impede duelo de guarda
// alta de virar uma fila de zeros. Ao implementá-lo no Grid, três coisas
// apareceram, e as três estão travadas aqui:
//
//   1. a régua da classe da arma MUDOU. Era o número de dados (1d6 leve, 2d6
//      média, 3d6 pesada) e o catálogo andou por baixo dela: hoje 24 das 26
//      armas têm um dado só e nenhuma tem três. Ao pé da letra a espada longa
//      virava leve e a categoria pesada deixava de existir. Passou a ser o dano
//      médio (`dado × 3,5 + danoBonus`);
//   2. a tabela de armaduras do capítulo estava atrasada em relação ao
//      `regras.json` (média reduzia 2, e reduz 4; pesada reduzia 4, e reduz 6);
//   3. "errou por" é `(Defesa + 1) − total`, e não a diferença crua, porque
//      empate não passa.
//
// Se qualquer uma das três voltar a divergir, é aqui que se descobre.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';

async function carregar(rel) {
  const saida = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'qa-')), 'm.mjs');
  await build({
    entryPoints: [path.resolve(rel)], outfile: saida, bundle: true, format: 'esm',
    platform: 'node', loader: { '.json': 'json' }, logLevel: 'silent',
  });
  return import(pathToFileURL(saida).href);
}

const falhas = [];
const ok = (c, t) => { console.log(`  ${c ? '✓' : '✘'} ${t}`); if (!c) falhas.push(t); };
const eq = (a, b, t) => ok(JSON.stringify(a) === JSON.stringify(b),
  `${t}${JSON.stringify(a) === JSON.stringify(b) ? '' : ` — esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`}`);

const QA = await carregar('src/lib/quase-acerto.ts');
const regras = JSON.parse(fs.readFileSync('src/data/regras.json', 'utf8'));
const armas = JSON.parse(fs.readFileSync('src/data/armas.json', 'utf8'));
const armaduras = JSON.parse(fs.readFileSync('src/data/armaduras.json', 'utf8'));

console.log('\n· a classe da arma sai do dano médio');
{
  // A tabela que a decisão de 24/08 fixou, arma por arma. Não é redundante com
  // a fórmula: é a lista do que a mesa vai ver, e ela é o que se olha quando
  // alguém mexer nos `danoBonus` do catálogo sem perceber que mexeu no QA.
  const esperado = {
    'adaga': 'leve', 'espada-curta': 'leve', 'desarmado': 'leve',
    'espada-longa': 'media', 'machado': 'media', 'maca': 'media',
    'lanca': 'media', 'alabarda': 'media', 'arco-longo': 'media',
    'besta-pequena': 'media', 'pilum': 'media',
    'montante': 'pesada', 'martelo-de-guerra': 'pesada',
    'besta-media': 'pesada', 'besta-grande': 'pesada',
  };
  for (const [id, classe] of Object.entries(esperado)) {
    const w = armas.find((a) => a.id === id);
    if (!w) { ok(false, `a arma ${id} existe no catálogo`); continue; }
    eq(QA.classeQADaArma(id), classe, `${w.nome} (média ${QA.danoMedioDaArma(id)}) é ${classe}`);
  }
  // O CATÁLOGO INTEIRO tem classe: uma arma sem classe de QA não raspa nunca, e
  // isso passaria calado na mesa como "a regra não pegou nessa aí".
  const sem = armas.filter((a) => QA.classeQADaArma(a.id) == null).map((a) => a.nome);
  eq(sem, [], 'toda arma do catálogo cai numa das três classes');
}

console.log('\n· a régua velha morreu de propósito');
{
  // A prova de que a mudança foi consciente: pela régua antiga (dados), a
  // espada longa seria LEVE e nada seria pesada. Se alguém restaurar o
  // `pesoPorDado`, este bloco cai.
  ok(regras.quaseAcerto.pesoPorDado === undefined,
    'o `pesoPorDado` (a régua dos dados) saiu do regras.json');
  ok(regras.quaseAcerto.classePorDanoMedio != null,
    'e no lugar dele está o `classePorDanoMedio`');
  const umDado = armas.filter((a) => a.dado === 1).length;
  ok(umDado >= 20 && !armas.some((a) => a.dado >= 3),
    `o catálogo é o motivo: ${umDado} de ${armas.length} armas com um dado só, nenhuma com três`);
}

console.log('\n· fora do catálogo, o dano médio sai da expressão');
{
  eq(QA.danoMedioDaExpr('2d6 +3'), 10, '"2d6 +3" tem média 10');
  eq(QA.danoMedioDaExpr('1d6'), 3.5, '"1d6" tem média 3,5');
  eq(QA.danoMedioDaExpr('1d6 −2'), 3.5, 'o menos tipográfico não é sinal: "1d6 −2" ignora o que não sabe ler');
  eq(QA.danoMedioDaExpr('1d6 -2'), 1.5, 'mas o menos comum conta: "1d6 -2" dá 1,5');
  eq(QA.danoMedioDaExpr('3d6 +2 (C)'), 12.5, 'a sigla do modo não atrapalha');
  eq(QA.danoMedioDaExpr(''), null, 'expressão vazia não inventa média');
  eq(QA.danoMedioDaExpr('sem dado'), null, 'e texto sem número também não');
  // A criatura: sem catálogo, a expressão É a arma.
  eq(QA.classeQADaArma('Garra do Ogro', '3d6 +2'), 'pesada',
    'a garra do ogro (3d6 +2 = 12,5) é pesada');
  eq(QA.classeQADaArma('Mordida de rato', '1d6 -3'), 'leve',
    'a mordida do rato (0,5) é leve');
}

console.log('\n· o catálogo vence a expressão');
{
  // A Força de quem empunha entra na expressão do personagem, e NÃO pode mudar
  // a classe: senão o mesmo aço raspava diferente em duas mãos.
  eq(QA.classeQADaArma('espada-longa', '1d6 +9'), 'media',
    'a espada longa continua média mesmo na mão de um brutamontes');
  eq(QA.danoMedioDaArma('espada-longa', '1d6 +9'), 3.5,
    'porque o dano médio lido é o da ARMA, e não o da ficha');
}

console.log('\n· a armadura empilha por duas regras diferentes');
{
  const cl = (c) => ({ classe: c });
  eq(QA.qaDeArmaduras([]), { bonus: 0, reducao: 0, classes: [] }, 'sem armadura, nada');
  eq(QA.qaDeArmaduras(null), { bonus: 0, reducao: 0, classes: [] }, 'e sem lista também não quebra');
  eq(QA.qaDeArmaduras([cl('pesada')]).bonus, 3, 'a placa dá +3 de Margem ao atacante');
  eq(QA.qaDeArmaduras([cl('pesada')]).reducao, 6, 'e abate 6 do raspão');
  // A regra do capítulo: bônus SOMAM, redução é a MAIOR. Somar as duas seria
  // blindar duas vezes contra a mesma coisa.
  const duas = QA.qaDeArmaduras([cl('pesada'), cl('media')]);
  eq(duas.bonus, 5, 'duas peças SOMAM os bônus (3 + 2)');
  eq(duas.reducao, 6, 'mas a redução é a MAIOR entre elas, e não a soma');
  // E as classes do catálogo de armaduras são exatamente as quatro da tabela.
  const usadas = [...new Set(armaduras.map((a) => a.classe))].sort();
  eq(usadas, ['leve', 'media', 'nenhuma', 'pesada'],
    'o catálogo de armaduras só usa as quatro classes da tabela');
}

console.log('\n· a tabela do regras.json é a que vale');
{
  // A do capítulo estava atrasada (média reduzia 2, pesada 4). O JSON venceu, e
  // o capítulo se corrigiu — que é a regra da casa.
  eq(regras.quaseAcerto.porClasseArmadura.media.reducao, 4, 'média reduz 4');
  eq(regras.quaseAcerto.porClasseArmadura.pesada.reducao, 6, 'pesada reduz 6');
  const cap = fs.readFileSync('src/content/chapters/quase-acerto.md', 'utf8');
  ok(/\| Média \| \+2 \| 4 \|/.test(cap), 'e o capítulo escreve o mesmo para a média');
  ok(/\| Pesada \| \+3 \| 6 \|/.test(cap), 'e para a pesada');
}

console.log('\n· errar por quanto, e quando isso raspa');
{
  // A regra do acerto é `total > Defesa`: empate NÃO passa, então quem tira
  // exatamente a Defesa errou por 1.
  eq(QA.errouPor(17, 16), 0, 'passar da Defesa não é errar');
  eq(QA.errouPor(16, 16), 1, 'empatar com a Defesa é errar por 1');
  eq(QA.errouPor(13, 16), 4, 'e 13 contra 16 é errar por 4, porque precisava de 17');

  eq(QA.raspa(0, 5), false, 'quem acertou não raspa: acertou');
  eq(QA.raspa(4, 5), true, 'errar por 4 com margem 5 raspa');
  eq(QA.raspa(5, 5), true, 'e o limite da margem ainda raspa');
  eq(QA.raspa(6, 5), false, 'um a mais que a margem já é erro seco');
  eq(QA.raspa(1, 0), false, 'sem margem nenhuma, nada raspa');

  eq(QA.saidaDoAtaque(17, 16, 5), 'acerto', '17 contra 16 acerta');
  eq(QA.saidaDoAtaque(13, 16, 5), 'raspao', '13 contra 16 com margem 5 raspa');
  eq(QA.saidaDoAtaque(10, 16, 5), 'erro', 'e 10 contra 16 erra de tudo');
}

console.log('\n· o exemplo do capítulo, refeito pelo motor');
{
  // Kael, espada longa, contra um cavaleiro de placa. É o exemplo escrito no
  // capítulo XII, e ele passa a valer como teste: se a régua mudar de novo, a
  // prosa e o motor caem juntos, e não um sem o outro.
  const placa = QA.quaseAcerto({ arma: 'espada-longa' }, { armaduras: [{ classe: 'pesada' }] });
  eq(placa.margem, 5, 'contra placa a Margem é 5 (2 da arma + 3 do couro)');
  eq(placa.dano, 0, 'e o raspão bate em 0: faíscas no aço (4 − 6)');
  eq(QA.saidaDoAtaque(13, 16, placa.margem), 'raspao', '13 contra Defesa 16 raspa nele');

  const couro = QA.quaseAcerto({ arma: 'espada-longa' }, { armaduras: [{ classe: 'leve' }] });
  eq(couro.margem, 3, 'contra couro a Margem é só 3');
  eq(couro.dano, 4, 'mas o raspão passa inteiro: 4');
  eq(QA.saidaDoAtaque(13, 16, couro.margem), 'erro',
    'e o mesmo 13 contra 16 NÃO raspa no couro: errou por 4, e a margem é 3');

  eq(placa.ignoraSoak, true, 'o raspão ignora a Absorção normal, nos dois casos');

  // A identidade tátil que o capítulo promete: a leve nica o tempo todo e raso,
  // a pesada nica pouco e fundo. Isso é uma afirmação de DESIGN, e ela tem de
  // continuar verdadeira depois de qualquer mexida nos números.
  const nu = { armaduras: [] };
  const leve = QA.quaseAcerto({ arma: 'adaga' }, nu);
  const pesada = QA.quaseAcerto({ arma: 'martelo-de-guerra' }, nu);
  ok(leve.margem > pesada.margem, `a leve raspa mais vezes (${leve.margem} contra ${pesada.margem})`);
  ok(leve.dano < pesada.dano, `e a pesada raspa mais fundo (${pesada.dano} contra ${leve.dano})`);
}

if (falhas.length) {
  console.error(`\n✘ Quase-Acerto FALHOU (${falhas.length}):`);
  for (const f of falhas) console.error('  • ' + f);
  process.exit(1);
}
console.log('\n✓ Quase-Acerto OK · a classe sai do dano médio, a armadura empilha por duas regras,'
  + ' e o exemplo do capítulo XII bate com o motor');
