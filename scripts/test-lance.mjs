// test-lance.mjs · o resolverGolpe puro contra golpes de verdade.
//
// ESTE É O TESTE QUE IMPORTA do passo 2. Ele não confere a função contra a
// minha leitura do código: confere contra centenas de lances gravados da mesa
// (`scripts/fixtures/lances.jsonl`), campo por campo, incluindo os dados.
//
// A razão é a lição do `lib-tempo.mjs`: cinco divergências entre a cópia
// headless e a mesa, cada uma passando nos testes do próprio lado, nenhuma pega
// por teste unitário. Todas foram pegas por comparação contra o comportamento
// real, e tarde. Aqui a comparação vem antes.
//
// TRÊS COISAS QUE ESTE ARQUIVO NÃO PODE TER, e que a primeira versão tinha:
//
//   · exceção. Ela pulava a comparação do dano quando o veredito não era
//     acerto, e a exceção escondia um defeito do registro. Uma exceção num
//     teste de comparação é sempre um lugar onde a comparação deixou de existir;
//   · tautologia. Uma asserção de cobertura tinha `|| true` no fim, o que a
//     fazia passar sempre. O sentido de uma asserção de cobertura é poder falhar;
//   · uma só fonte de dados. Os lances rodavam apenas com `fonteFixa`, que é a
//     que o harness NÃO usa. Agora rodam também com a `fonteRolada`, que é a de
//     verdade, no que não depende de qual dado caiu.
import { build } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import { execSync } from 'node:child_process';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const FIXTURE = path.join(ROOT, 'scripts/fixtures/lances.jsonl');

// UM pacote com o `lance.ts` E o `acaso.ts`: semear é trocar o estado de um
// módulo, e dois pacotes separados teriam cada um a sua cópia desse estado.
const saida = path.join(os.tmpdir(), `lance-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `
      export * from './src/lib/lance';
      export { semear, semeadoDe } from './src/lib/acaso';
    `,
    resolveDir: ROOT, loader: 'ts',
  },
  outfile: saida, bundle: true, format: 'esm', platform: 'node',
  loader: { '.json': 'json' }, logLevel: 'error',
});
const L = await import(pathToFileURL(saida).href);
fs.rmSync(saida, { force: true });

let PASSOU = 0; const FALHAS = [];
const ok = (c, m) => { if (c) { PASSOU++; console.log('  ✓ ' + m); } else { FALHAS.push(m); console.log('  ✗ ' + m); } };

console.log('\n· o resolverGolpe puro, contra o despejo da mesa');

if (!fs.existsSync(FIXTURE)) {
  console.log('  ✗ falta a fixture: rode "node scripts/coletar-lances.mjs"');
  process.exit(1);
}
const lances = fs.readFileSync(FIXTURE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

// ============================================================ 0 · o carimbo
//
// A fixture é o registro do comportamento da mesa NUM COMMIT. Se a mesa mudar,
// ela é a única evidência do que a mesa fazia antes, e regenerar apaga essa
// evidência.
//
// O aviso é AVISO, e não falha, de propósito: o objetivo é impedir que uma
// divergência futura seja "consertada" por uma recoleta reflexa. Recoletar tem
// de ser ato deliberado, nunca reação a teste vermelho. Falhar aqui empurraria
// na direção contrária, porque a saída mais fácil de um teste vermelho é rodar
// o coletor de novo.
const META_ARQ = FIXTURE.replace(/\.jsonl$/, '.meta.json');
if (!fs.existsSync(META_ARQ)) {
  console.log('  ⚠ a fixture não tem carimbo (lances.meta.json): não dá para saber de que commit ela é');
} else {
  const M = JSON.parse(fs.readFileSync(META_ARQ, 'utf8'));
  let head = null;
  try { head = execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { /* sem git */ }
  const curto = (h) => (h || '').slice(0, 7);
  console.log(`  · fixture de ${curto(M.commit)}${M.sujo ? ' (árvore suja)' : ''}`
    + ` · ${M.lances} lances · semente ${M.semente} · dados_hash ${M.dados_hash}`);
  if (head && M.commit !== head) {
    console.log(`  ⚠ a fixture é de ${curto(M.commit)} e o HEAD é ${curto(head)}.`);
    console.log('    Divergência daqui em diante pode ser mudança da mesa, e não erro da cópia.');
    console.log('    Recoletar é decisão, não conserto: veja o que mudou antes de rodar o coletor.');
  }
  if (M.perfil && Object.values(M.perfil).some(Boolean)) {
    console.log('  ⚠ a fixture foi colhida com bandeira ligada, e o motor não aplica bandeira nenhuma');
  }
}


// ============================================================ 1 · a fonte fixa
//
// Todos os campos de saída do contrato da P §2.1, mais `danoNoCampo`, mais os
// dados. Sem exceção e sem ressalva.
// O `cobre` de cada lance diz até onde a mesa calculou: `completo` é o golpe de
// índice 0, com acerto e dano; `acerto` são os seguintes de uma rajada ou de uma
// empunhadura dupla, para os quais a tela produz veredito e não produz dano,
// porque ela rola o dano uma vez só. Isso não é exceção escondida: é o registro
// dizendo o que ele tem, e cada grupo é conferido inteiro no que ele tem.
const CAMPOS_ACERTO = ['defesa', 'total', 'soma', 'errouPor', 'veredito', 'tipo', 'pvAntes'];
const CAMPOS_DANO = ['danoBruto', 'absorcao', 'danoLiquido', 'pvDepois'];
const igualArr = (a, b) => JSON.stringify(a || []) === JSON.stringify(b || []);

let conferidos = 0;
const divergencias = [];
const porCampo = {};
for (const l of lances) {
  const s = L.resolverGolpe(l.entrada, L.fonteFixa(l.sorteio));
  conferidos++;
  const dif = [];
  // `danoNoCampo` fica fora da comparação com a cópia porque a função pura não
  // o produz: ela não tem caixa de texto. Ele é conferido logo abaixo, contra o
  // que a régua aplica, que é a pergunta que ele responde.
  const campos = l.cobre === 'completo' ? [...CAMPOS_ACERTO, ...CAMPOS_DANO] : CAMPOS_ACERTO;
  for (const c of campos) {
    if (s[c] !== l.saida[c]) {
      dif.push(`${c}: mesa ${l.saida[c]} × cópia ${s[c]}`);
      porCampo[c] = (porCampo[c] || 0) + 1;
    }
  }
  // A TRAVA DO `cobre`, e ela é o ponto desta parte.
  //
  // `golpeIndice === 0` OBRIGA `cobre === 'completo'`. Sem isso, o dia em que o
  // coletor escrever 'acerto' numa linha que podia ser 'completo', a cobertura
  // encolhe em silêncio e o teste continua verde: é a mesma forma da exceção
  // que a rodada anterior tirou daqui, só que deslocada para o produtor.
  if (l.entrada.golpeIndice === 0 && l.cobre !== 'completo') {
    dif.push(`golpeIndice 0 com cobre '${l.cobre}': uma folha de índice 0 calcula o dano`);
    porCampo['trava do cobre'] = (porCampo['trava do cobre'] || 0) + 1;
  }
  // E o que o registro NÃO cobre tem de estar nulo, e não zero: um número que
  // ninguém calculou é a forma mais barata de um oráculo mentir.
  if (l.cobre !== 'completo' && CAMPOS_DANO.some((c) => l.saida[c] !== null)) {
    dif.push('campos de dano preenchidos num lance que não os cobre');
    porCampo['cobre'] = (porCampo['cobre'] || 0) + 1;
  }
  if (!igualArr(s.rolls.acerto, l.sorteio.acerto)) {
    dif.push(`rolls.acerto: mesa [${l.sorteio.acerto}] × cópia [${s.rolls.acerto}]`);
    porCampo['rolls.acerto'] = (porCampo['rolls.acerto'] || 0) + 1;
  }
  // Os dados de dano só existem no acerto: no raspão a régua não rola (o dano é
  // fixo) e no erro não há dano. A mesa rolou de qualquer jeito, porque o mestre
  // aperta o ⚄ antes de saber o veredito, e é por isso que a comparação é
  // contra o que a REGRA produz e não contra o que a tela guardou.
  const danoEsperado = (l.cobre === 'completo' && l.saida.veredito === 'acerto') ? l.sorteio.dano : [];
  if (!igualArr(s.rolls.dano, danoEsperado)) {
    dif.push(`rolls.dano: esperado [${danoEsperado}] × cópia [${s.rolls.dano}]`);
    porCampo['rolls.dano'] = (porCampo['rolls.dano'] || 0) + 1;
  }
  if (dif.length) divergencias.push({ aid: l.entrada.aid, dif });
}

ok(lances.length >= 600, `o despejo tem lances suficientes para valer (${lances.length})`);
ok(conferidos === lances.length, `todos foram conferidos (${conferidos} de ${lances.length})`);
ok(divergencias.length === 0,
  `ZERO divergências com a fonte fixa (${divergencias.length}`
  + `${divergencias.length ? `, em ${Object.entries(porCampo).map(([k, v]) => `${k} ${v}`).join(', ')}` : ''})`);

// ---- danoNoCampo e danoBruto são coisas diferentes, e o teste tem de saber ----
const completos = lances.filter((l) => l.cobre === 'completo');
const acertos = completos.filter((l) => l.saida.veredito === 'acerto');
const naoAcertos = completos.filter((l) => l.saida.veredito !== 'acerto');
ok(acertos.length > 0 && acertos.every((l) => l.saida.danoNoCampo === l.saida.danoBruto),
  `no acerto, o que está no campo é o que a régua aplica (${acertos.length} lances)`);
ok(naoAcertos.some((l) => l.saida.danoNoCampo !== l.saida.danoBruto),
  'e fora do acerto os dois DIVERGEM: no raspão vale o dano fixo do Quase-Acerto,'
  + ' no erro não vale nada, e o campo continua com o que foi rolado');
ok(completos.filter((l) => l.saida.veredito === 'raspao')
  .every((l) => l.saida.danoBruto === l.entrada.danoQA && l.saida.absorcao === 0),
  'todo raspão aplica o dano fixo e nenhuma Absorção');
ok(completos.filter((l) => l.saida.veredito === 'erro')
  .every((l) => l.saida.danoBruto === 0 && l.saida.pvDepois === l.saida.pvAntes),
  'e todo erro não tira Vida nenhuma');

// ============================================================ 2 · a fonte real
//
// A `fonteFixa` não é passa-adiante: ela reimplementa a extração do fixo da
// expressão. O que a parte 1 confere é o `resolverGolpe` MAIS essa segunda
// implementação, contra a mesa. Se a `fonteFixa` e o `rolarExpr` divergirem no
// tratamento de alguma expressão, a parte 1 não vê e o harness roda com a que
// nunca foi conferida, porque a fonte do harness é a rolada.
//
// Aqui cada lance roda de novo com a `fonteRolada`, semeada, e se confere o que
// NÃO depende de qual dado caiu.
L.semear(L.semeadoDe(20260902));
let rodados = 0;
const difRolada = [];
for (const l of lances) {
  const s = L.resolverGolpe(l.entrada, L.fonteRolada);
  rodados++;
  const e = [];
  // a Defesa efetiva não vê dado nenhum
  if (s.defesa !== l.saida.defesa) e.push(`defesa ${s.defesa} × ${l.saida.defesa}`);
  // a QUANTIDADE de dados é do bolo, e não da sorte
  if (s.rolls.acerto.length !== l.sorteio.acerto.length) {
    e.push(`nº de dados ${s.rolls.acerto.length} × ${l.sorteio.acerto.length}`);
  }
  // o FIXO somado: o total menos a soma dos dados tem de ser o mesmo dos dois
  const flatRolado = s.total - s.rolls.acerto.reduce((a, b) => a + b, 0);
  const flatMesa = l.saida.total - l.sorteio.acerto.reduce((a, b) => a + b, 0);
  if (l.saida.total != null && flatRolado !== flatMesa) e.push(`flat ${flatRolado} × ${flatMesa}`);
  // e o `errouPor` tem de ser coerente com a Defesa e a soma DESTA execução
  if (s.defesa != null && s.errouPor !== s.defesa - s.soma + 1) {
    e.push(`errouPor ${s.errouPor} incoerente com defesa ${s.defesa} e soma ${s.soma}`);
  }
  if (e.length) difRolada.push({ aid: l.entrada.aid, e });
}
ok(rodados === lances.length, `todos rodaram também com a fonte REAL, semeada (${rodados})`);
ok(difRolada.length === 0,
  `e o que não depende do dado bate nas duas fontes (${difRolada.length} divergências)`);

// ---- 5.1 · A MAIS IMPORTANTE: a passagem rolada, duas vezes, idêntica ----
//
// Isto não compara com a mesa: compara a cópia com ela mesma, e é a única coisa
// que prova que semear funciona ATRAVESSANDO uma resolução de verdade. A Etapa 0
// provou o `acaso.ts` isolado, e a R6 §3 registrou que nenhuma cena de teste
// resolvia golpe. O teste de dados fixos não fecha essa ressalva, porque com
// dados fixos o acaso nem é tocado. Esta passagem fecha.
const passagem = (semente) => {
  L.semear(L.semeadoDe(semente));
  return lances.map((l) => L.resolverGolpe(l.entrada, L.fonteRolada));
};
const p1 = passagem(20260903);
const p2 = passagem(20260903);
const p3 = passagem(20260904);
const iguais = (a, b) => a.length === b.length
  && a.every((x, i) => JSON.stringify(x) === JSON.stringify(b[i]));
ok(iguais(p1, p2),
  `a passagem rolada inteira repete com a mesma semente (${p1.length} lances, campo a campo e dado a dado)`);
ok(!iguais(p1, p3), 'e muda com outra semente: a passagem rola de verdade');
// E a prova de que ela ROLOU, e não de que devolveu tudo vazio.
ok(p1.some((x) => x.rolls.acerto.length > 0) && p1.some((x) => x.rolls.dano.length > 0),
  `a passagem rolou dados de acerto e de dano (${p1.filter((x) => x.rolls.acerto.length).length}`
  + ` acertos com dado, ${p1.filter((x) => x.rolls.dano.length).length} danos com dado)`);

// ---- 5.2 · Limites, checáveis sem oráculo nenhum ----
const foraDoLimite = [];
for (const x of p1) {
  if (x.absorcao > x.danoBruto) foraDoLimite.push(`absorcao ${x.absorcao} > danoBruto ${x.danoBruto}`);
  if (x.veredito === 'acerto' && x.danoLiquido !== x.danoBruto - x.absorcao) {
    foraDoLimite.push(`liquido ${x.danoLiquido} != bruto ${x.danoBruto} - absorcao ${x.absorcao}`);
  }
  if (x.pvAntes != null && x.pvDepois !== Math.max(0, x.pvAntes - x.danoLiquido)) {
    foraDoLimite.push(`pvDepois ${x.pvDepois} != max(0, ${x.pvAntes} - ${x.danoLiquido})`);
  }
}
ok(foraDoLimite.length === 0,
  `os limites do dano valem em todos (${foraDoLimite.length} fora: ${foraDoLimite.slice(0, 2).join(' · ') || 'nenhum'})`);

// ---- 5.3 · Os ramos por veredito, o mais especial primeiro ----
const ramoRuim = [];
for (let i = 0; i < p1.length; i++) {
  const x = p1[i]; const e = lances[i].entrada;
  if (x.veredito === 'raspao'
    && !(x.danoBruto === Math.max(0, e.danoQA) && x.absorcao === 0 && x.rolls.dano.length === 0)) {
    ramoRuim.push(`raspão: bruto ${x.danoBruto} (danoQA ${e.danoQA}), absorção ${x.absorcao}, dados ${x.rolls.dano.length}`);
  }
  if (x.veredito === 'erro' && !(x.danoBruto === 0 && x.danoLiquido === 0)) {
    ramoRuim.push(`erro: bruto ${x.danoBruto}, líquido ${x.danoLiquido}`);
  }
}
ok(ramoRuim.length === 0,
  `o raspão é fixo e sem Absorção, e o erro não tira nada (${ramoRuim.length} fora)`);
ok(p1.filter((x) => x.veredito === 'raspao').length > 0 && p1.filter((x) => x.veredito === 'erro').length > 0,
  `e os dois ramos foram exercitados na passagem rolada`
  + ` (${p1.filter((x) => x.veredito === 'raspao').length} raspões,`
  + ` ${p1.filter((x) => x.veredito === 'erro').length} erros)`);
L.semear(null);

// A prova de que a fonte real é a que rola: com sementes diferentes, os dados
// mudam. Sem isto, "zero divergências na rolada" poderia ser zero rolagens.
// COM DADOS: o primeiro acerto da fixture pode ser de um bolo `0d6 +3`, e aí a
// prova de que a fonte rola compararia duas listas vazias.
const umAcerto = (lances.find((l) => l.sorteio.acerto.length >= 2) || acertos[0]).entrada;
L.semear(L.semeadoDe(1));
const rA = L.resolverGolpe(umAcerto, L.fonteRolada);
L.semear(L.semeadoDe(1));
const rB = L.resolverGolpe(umAcerto, L.fonteRolada);
L.semear(L.semeadoDe(2));
const rC = L.resolverGolpe(umAcerto, L.fonteRolada);
ok(igualArr(rA.rolls.acerto, rB.rolls.acerto) && !igualArr(rA.rolls.acerto, rC.rolls.acerto),
  `a fonte real rola de verdade e obedece a semente ([${rA.rolls.acerto}] × [${rC.rolls.acerto}])`);
L.semear(null);

// ============================================================ 3 · a cobertura
//
// Uma asserção por meta, todas capazes de falhar. Zero divergências sobre
// lances que nunca exercitam um caminho é zero evidência sobre ele.
const conta = (f) => lances.filter(f).length;
// Os EIXOS ISOLADOS são o que a separação do `?extras=` comprou: sem eles, três
// dimensões variavam juntas, e a `defesaEfetiva` soma quatro termos, três deles
// tipicamente negativos. Dois termos que sempre entram juntos escondem uma troca
// de sinal entre eles, porque ela se cancela.
const semCond = (l) => l.entrada.atacante.ajusteDados === 0;
const semFer = (l) => l.entrada.alvo.ferimento === 0;
const semArm = (l) => l.entrada.alvo.qaArmaduraBonus === 0 && l.entrada.alvo.qaArmaduraReducao === 0;
const METAS = [
  ['armadura SOZINHA (sem condição, sem ferimento)', (l) => !semArm(l) && semCond(l) && semFer(l), 30],
  ['condições SOZINHAS', (l) => !semCond(l) && semFer(l) && semArm(l), 30],
  ['ferimento SOZINHO', (l) => !semFer(l) && semCond(l) && semArm(l), 30],
  ['os três juntos', (l) => !semFer(l) && !semCond(l) && !semArm(l), 30],
  ['nenhum dos três (a linha de base)', (l) => semFer(l) && semCond(l) && semArm(l), 30],
  ['modManual != 0', (l) => l.entrada.modManual !== 0, 40],
  ['penDados com dois elementos', (l) => l.entrada.atacante.penDados.length >= 2, 60],
  ['folha do golpe ADIADO', (l) => l.adiada === true, 30],
  ['defesaBase nula (a tela do jogador)', (l) => l.entrada.alvo.defesaBase == null, 5],
  ['veredito acerto', (l) => l.saida.veredito === 'acerto', 60],
  ['veredito raspão', (l) => l.saida.veredito === 'raspao', 60],
  ['veredito erro', (l) => l.saida.veredito === 'erro', 60],
];
for (const [nome, f, meta] of METAS) {
  const n = conta(f);
  ok(n >= meta, `${nome}: ${n} lances (meta ${meta})`);
}
ok(conta((l) => l.entrada.modManual > 0) > 0 && conta((l) => l.entrada.modManual < 0) > 0,
  `o modManual aparece nos dois sinais (+${conta((l) => l.entrada.modManual > 0)}`
  + ` / −${conta((l) => l.entrada.modManual < 0)})`);
ok(conta((l) => l.entrada.alvo.defesaPerdida !== 0) > 0,
  `a escada do P/G/R entra na Defesa (${conta((l) => l.entrada.alvo.defesaPerdida !== 0)} lances)`);
ok(new Set(lances.map((l) => l.sorteio.acerto.length)).size >= 4,
  `bolos de tamanhos diferentes (${new Set(lances.map((l) => l.sorteio.acerto.length)).size} quantidades de dados)`);
ok(new Set(lances.map((l) => l.entrada.tipoDano)).size >= 3,
  `os três modos de dano (${new Set(lances.map((l) => l.entrada.tipoDano)).size})`);
ok(completos.length === lances.length,
  `todo lance é 'completo' hoje (${completos.length} de ${lances.length}): cada folha da mesa`
  + ' calcula acerto E dano, porque cada golpe da agenda tem a sua folha');
// O QUE NÃO TEM COBERTURA, DITO EM ASSERÇÃO e não em comentário.
ok(conta((l) => l.entrada.golpeIndice > 0) === 0,
  'golpeIndice > 0 continua SEM oráculo, e não por falta de coleta: `rolarAcerto`'
  + ' sempre usa `linhas[0]`, então nem a folha do segundo golpe aplica `penDados[1]`');

// ============================================================ 4 · a unidade
//
// Só o que a fixture não alcança: caminhos que a mesa não percorre.
const base = JSON.parse(JSON.stringify(acertos[0].entrada));
const semDef = { ...base, alvo: { ...base.alvo, defesaBase: null } };
const r1 = L.resolverGolpe(semDef, L.fonteFixa({ acerto: [3, 3], dano: [4] }));
ok(r1.defesa === null && r1.veredito === null && r1.danoLiquido === 0,
  'sem a Defesa do alvo, a função devolve nulo e não chuta');
const raspa = {
  ...base, margemQA: 99, danoQA: 7, modManual: 0,
  atacante: { ...base.atacante, ataque: '1d6', ajusteFlat: 0, ajusteDados: 0, penDados: [0] },
  alvo: { ...base.alvo, soak: 5, defesaBase: 10, ferimento: 0, condicoesDefesa: 0, defesaPerdida: 0, pv: 20 },
};
const r2 = L.resolverGolpe(raspa, L.fonteFixa({ acerto: [1], dano: [6] }));
ok(r2.veredito === 'raspao' && r2.danoBruto === 7 && r2.absorcao === 0 && r2.danoLiquido === 7,
  'o raspão é fixo e IGNORA a Absorção (capítulo XII), mesmo com Absorção 5');
ok(r2.rolls.dano.length === 0, 'e o raspão não rola dado de dano nenhum');
// O `?? 0` de `penDados[golpeIndice]`: um índice além da lista não explode.
const alem = { ...base, golpeIndice: 9 };
const r3 = L.resolverGolpe(alem, L.fonteFixa({ acerto: [4, 4], dano: [3] }));
ok(Number.isFinite(r3.total), 'um golpeIndice além do fim de penDados cai no zero e não quebra');

// quaseAcertoDoEncontro, que é função exportada e precisa de execução.
const comCouro = lances.find((l) => l.entrada.alvo.qaArmaduraBonus !== 0
  && l.entrada.alvo.qaArmaduraReducao !== 0);
ok(!!comCouro, 'a fixture tem lance com armadura vestida, com os dois números');
const qa = L.quaseAcertoDoEncontro(comCouro.entrada);
ok(qa.margem === comCouro.entrada.atacante.qaArmaBonus + comCouro.entrada.alvo.qaArmaduraBonus
  && qa.dano === Math.max(0, comCouro.entrada.atacante.qaArmaDano - comCouro.entrada.alvo.qaArmaduraReducao),
  `o Quase-Acerto do ENCONTRO soma arma e armadura (margem ${qa.margem}, raspão ${qa.dano})`);
ok(L.quaseAcertoDoEncontro({
  atacante: { qaArmaBonus: 1, qaArmaDano: 2 }, alvo: { qaArmaduraBonus: 0, qaArmaduraReducao: 9 },
}).dano === 0, 'e a Redução não faz o raspão ficar negativo');

if (divergencias.length) {
  console.log('\n  as primeiras divergências (fonte fixa):');
  for (const d of divergencias.slice(0, 8)) console.log(`   · ${d.aid}: ${d.dif.join(' | ')}`);
}
if (difRolada.length) {
  console.log('\n  as primeiras divergências (fonte rolada):');
  for (const d of difRolada.slice(0, 8)) console.log(`   · ${d.aid}: ${d.e.join(' | ')}`);
}

console.log(`\n${FALHAS.length ? '✗' : '✓'} resolverGolpe OK · ${lances.length} lances no despejo`
  + ` · ${conferidos} conferidos com a fonte fixa e ${rodados} com a rolada`
  + ` · ${divergencias.length + difRolada.length} divergiram · ${PASSOU} asserções`);
if (FALHAS.length) { FALHAS.forEach((f) => console.log('  · ' + f)); process.exit(1); }
