// sim-passo-golpe.mjs — dá para andar no Tick do Golpe?
//
// A PERGUNTA
// A §14.6 diz que no Golpe não se faz nada, e o motor da mesa passou a plantar
// o pé ali em 28/08. A mesa quer reabrir: e se pudesse andar?
//
// POR QUE UMA BANCADA NOVA
// O simulador que calibrou a régua inteira (`lib-tempo.mjs`) NÃO TEM GEOMETRIA:
// os dois lutadores estão sempre ao alcance um do outro, e por isso movimento
// não custa nem compra nada lá dentro. A pergunta do Tick do Golpe é
// inteiramente geométrica (ela é sobre fechar e abrir distância), então ela
// precisa de um chão. Este arquivo põe os dois numa reta, com passo, alcance e
// as três fases, e reusa o motor de acerto e dano de `lib-tempo.mjs` para o
// golpe em si: a régua medida continua sendo a mesma, e o que se acrescenta é
// só o espaço.
//
// O MODELO, e os seus limites (leia antes de citar qualquer número)
//   · reta, e não hexágonos: distância é um escalar. Perde o flanqueamento e o
//     terreno, e é honesto para a pergunta "quem fecha e quem escapa";
//   · sem aliados: é duelo. A refrega muda tudo e não está aqui;
//   · o passo é o da régua (2 a 5 m/Tick), o alcance é 1 m (2 na haste);
//   · duas estratégias, e é nelas que a resposta mora:
//       BRUTO   fecha a distância e bate sempre que pode;
//       KITER   bate quando alcança e RECUA sempre que o movimento é grátis.
//     O kiter é o abuso que a regra precisa aguentar: se andar no Golpe for de
//     graça, é ele quem lucra.
//   · movimento na Recuperação custa 1 Tick por metro (a regra), o que na
//     prática significa que ninguém anda ali; no Preparo é grátis (é o "Preparo
//     andando" da §15); livre é grátis.
//
// Rodar: node scripts/sim-passo-golpe.mjs
import {
  criarRng, montarArma, montarArmadura, lutador, atacar, REGRAS_PGR,
} from './lib-tempo.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const data = join(dir, '..', 'src', 'data');
const read = (f) => JSON.parse(readFileSync(join(data, f), 'utf8'));
const ARMAS = read('armas.json');
const ARMADURAS = read('armaduras.json');

const cat = {
  armas: Object.fromEntries(ARMAS.map((w) => [w.id, montarArma(w)])),
  armaduras: {
    nenhuma: montarArmadura({ id: 'nenhuma', nome: 'nenhuma', soak: {}, penalidade: 0 }),
    ...Object.fromEntries(ARMADURAS.map((a) => [a.id, montarArmadura(a)])),
  },
};

/** O passo de cada classe, pela régua de `derivados.deslocamento` num lutador padrão. */
// Mutável para a bateria 5, que varre o passo: o ganho do passo de aproximação
// depende de quanto chão a peça já cobre por Tick.
const PASSO_REF = { v: 4 };   // aventureiro: 2 + (Des 3 + Atl 4) ÷ 4 = 3,75 → 4 m/Tick
const ALCANCE = { haste: 2 };
const alcanceDe = (classe) => ALCANCE[classe] ?? 1;

/**
 * Um duelo com espaço. Devolve quem venceu e quantos golpes cada um encostou.
 *
 * `andarNoGolpe` é o botão em teste. Todo o resto é a régua de hoje.
 */
function duelo(specA, specB, { andarNoGolpe, distInicial, estrategiaB }, rnd, R) {
  const A = lutador({ ...specA, regras: R }, cat);
  const B = lutador({ ...specB, regras: R }, cat);
  A.nome = 'A'; B.nome = 'B';
  for (const c of [A, B]) { c.golpesFeitos = 0; c.acertos = 0; c.perdidos = 0; }
  let dist = distInicial;
  let t = 0;
  const estados = { [A.nome]: null, [B.nome]: null };   // { offs, total, desde }
  let somaDist = 0, nMed = 0;

  const fase = (c, e) => {
    if (!e) return 'livre';
    const rel = t - e.desde;
    if (rel >= e.total) return 'livre';
    if (e.offs.includes(rel)) return 'golpe';
    if (rel < Math.max(...e.offs)) return 'preparo';
    return 'recuperacao';
  };
  /**
   * O movimento é grátis nesta fase, e em que direção?
   *
   * `andarNoGolpe` tem três valores, e a diferença entre os dois últimos é a
   * decisão que a mesa está tomando:
   *   'nao'       o pé planta (a regra de 28/08);
   *   'livre'     anda para onde quiser, inclusive para trás (o bate-e-corre);
   *   'aproximar' anda SÓ na direção do alvo, para cobrir os últimos metros.
   *
   * Devolve 'nenhum' | 'qualquer' | 'so-frente'.
   */
  const podeAndar = (f) => {
    if (f === 'livre' || f === 'preparo') return 'qualquer';
    if (f !== 'golpe') return 'nenhum';
    return andarNoGolpe === 'livre' ? 'qualquer'
      : andarNoGolpe === 'aproximar' ? 'so-frente' : 'nenhum';
  };

  while (t < 400 && A.pv > 0 && B.pv > 0) {
    somaDist += dist; nMed++;
    for (const [eu, ele] of [[A, B], [B, A]]) {
      if (eu.pv <= 0 || ele.pv <= 0) continue;
      const e = estados[eu.nome];
      const f = fase(eu, e);
      const alc = alcanceDe(eu.arma.classe);
      const kita = (eu === B && estrategiaB === 'kiter');

      // 1. DECLARAR, quando livre. O bruto declara sempre; o kiter só ao
      //    alcance. Vem ANTES de resolver o golpe porque a arma leve tem
      //    Preparo 0: o golpe dela cai no MESMO Tick da declaração, e checar o
      //    golpe primeiro faria a adaga nunca bater (foi o que aconteceu na
      //    primeira rodada desta bancada: 0 golpes e o duelo no teto de Ticks).
      if (f === 'livre') {
        // QUANDO SE DECLARA, e isto é o coração da fidelidade do modelo. O robô
        // não declara de qualquer distância: no sistema simultâneo a declaração
        // embute a viagem, e o golpe cai quando a peça chega. Aqui isso vira
        // "declaro se consigo chegar ao alcance dentro do meu Preparo" (os
        // Ticks em que eu ando de graça enquanto o gesto sobe). O kiter é mais
        // exigente: ele só declara com o alvo já ao alcance, porque a intenção
        // dele é bater e sair, não fechar distância.
        //
        // Sem esta linha a arma leve (Preparo 0) declarava a 12 metros, ficava
        // presa em Golpe e Recuperação para sempre e NUNCA andava: o duelo
        // batia no teto de Ticks com zero golpes, medindo o robô e não a regra.
        const alcanceUtil = alc + PASSO_REF.v * (eu.prep || 0);
        const querBater = kita ? dist <= alc : dist <= alcanceUtil;
        if (querBater) {
          // `offs` é a agenda relativa e `spd` é o ciclo inteiro, do jeito que
          // `lutador()` os devolve.
          estados[eu.nome] = { offs: eu.offs, total: eu.spd, desde: t };
        }
      }
      // 2. O GOLPE CAI, se este é o Tick dele e o alvo está ao alcance.
      const eAgora = estados[eu.nome];
      // O GOLPE QUE NÃO CAI POR FALTAR CHÃO: o gesto venceu, o alvo está a um
      // passo do alcance, e o Tick vai para o lixo. É exatamente este caso que
      // o passo de aproximação existe para resolver, e por isso ele é contado.
      if (fase(eu, eAgora) === 'golpe' && dist > alc) eu.perdidos++;
      if (fase(eu, eAgora) === 'golpe' && dist <= alc) {
        eu.emAcao = true; eu.emGolpe = true; eu.pend = eAgora; eu.tickAgora = t - eAgora.desde;
        eu.porRep = 1; eu.nUltimo = 1; eu.tipo = 'simples'; eu.off = false;
        const antes = ele.pv;
        atacar(eu, ele, R, rnd);
        if (ele.pv < antes) eu.acertos++;
      }
      // 3. ANDAR, se a fase deixa e na direção que ela permite.
      const modo = podeAndar(fase(eu, estados[eu.nome]));
      if (modo !== 'nenhum') {
        // No Tick do Golpe com passo de aproximação, recuar não é opção: o
        // kiter fica onde está, e é justamente isso que tira dele o lucro que
        // a versão livre lhe dava.
        if (kita) { if (modo === 'qualquer') dist += PASSO_REF.v; }
        else if (dist > alc) dist = Math.max(alc, dist - PASSO_REF.v);
      }
    }
    dist = Math.max(0, Math.min(60, dist));
    t++;
  }
  return {
    venceuA: B.pv <= 0 && A.pv > 0, venceuB: A.pv <= 0 && B.pv > 0,
    acertosA: A.acertos, acertosB: B.acertos, perdidosA: A.perdidos, ticks: t, distMedia: somaDist / Math.max(1, nMed),
  };
}

function bateria(armaA, armaB, opts, n = 3000) {
  const R = REGRAS_PGR;
  let vA = 0, vB = 0, aA = 0, aB = 0, dm = 0, tt = 0, pA = 0;
  for (let i = 0; i < n; i++) {
    const rnd = criarRng(20260828 + i);
    const r = duelo(
      { arma: armaA, armadura: 'nenhuma' }, { arma: armaB, armadura: 'nenhuma' },
      opts, rnd, R,
    );
    if (r.venceuA) vA++; if (r.venceuB) vB++;
    aA += r.acertosA; aB += r.acertosB; dm += r.distMedia; tt += r.ticks; pA += r.perdidosA;
  }
  return {
    winA: (100 * vA / n), winB: (100 * vB / n),
    acA: aA / n, acB: aB / n, dist: dm / n, ticks: tt / n, perd: pA / n,
  };
}

const CLASSES = [
  ['adaga', 'leve'], ['espada-longa', 'média'], ['lanca', 'haste'], ['martelo-de-guerra', 'pesada'],
];
const pct = (x) => `${x.toFixed(1)}%`;
const nu = (x) => x.toFixed(2);

console.log('\n=== ANDAR NO TICK DO GOLPE: o que muda ===');
console.log('Duelo com espaço, 3000 sementes por célula. Passo variável (4 m/Tick nas baterias 1 a 4), alcance 1 m (2 na haste).');
console.log('O modelo é uma RETA e um duelo: sem aliados, sem terreno, sem flanqueamento.\n');

// --------------------------------------------- 1. espelho, os dois agressivos
console.log('1) ESPELHO, os dois fechando distância (começando a 12 m).');
console.log('   Se andar no Golpe fosse neutro, nada mudaria aqui.\n');
console.log('   classe   | pé plantado | livre  | aproximar');
console.log('   ---------|-------------|--------|----------');
for (const [id, nome] of CLASSES) {
  const sem = bateria(id, id, { andarNoGolpe: 'nao', distInicial: 12, estrategiaB: 'bruto' });
  const com = bateria(id, id, { andarNoGolpe: 'livre', distInicial: 12, estrategiaB: 'bruto' });
  const apr = bateria(id, id, { andarNoGolpe: 'aproximar', distInicial: 12, estrategiaB: 'bruto' });
  console.log(`   ${nome.padEnd(8)} | ${nu(sem.acA).padStart(9)} | ${nu(com.acA).padStart(6)} | ${nu(apr.acA).padStart(10)}`);
}

// ------------------------------------------------- 2. o bate-e-corre (o abuso)
console.log('\n2) O BATE-E-CORRE: A fecha e bate, B bate e recua (o kiter).');
console.log('   É o abuso que a regra tem de aguentar. "A alcança" = quanto A consegue bater.\n');
console.log('   arma de A     | golpes que A encosta       ||  distância média');
console.log('                 | plantado | livre | aproxim. ||  plant | livre | aprox');
console.log('   --------------|----------|-------|----------||--------|-------|------');
for (const [id, nome] of CLASSES) {
  const sem = bateria(id, 'adaga', { andarNoGolpe: 'nao', distInicial: 4, estrategiaB: 'kiter' });
  const com = bateria(id, 'adaga', { andarNoGolpe: 'livre', distInicial: 4, estrategiaB: 'kiter' });
  const apr = bateria(id, 'adaga', { andarNoGolpe: 'aproximar', distInicial: 4, estrategiaB: 'kiter' });
  console.log(`   ${nome.padEnd(13)} | ${nu(sem.acA).padStart(11)} | ${nu(com.acA).padStart(6)} | ${nu(apr.acA).padStart(10)}`
    + `  ||  ${nu(sem.dist).padStart(5)} | ${nu(com.dist).padStart(5)} | ${nu(apr.dist).padStart(5)}`);
}

// ------------------------------------- 3. classe contra classe, o equilíbrio
console.log('\n3) O EQUILÍBRIO ENTRE CLASSES (todos contra a espada longa, a 12 m).');
console.log('   A pergunta: permitir o passo no Golpe favorece quem?\n');
console.log('   classe   | pé plantado | aproximar | Δ');
console.log('   ---------|----------|----------|------');
let maxD = 0;
for (const [id, nome] of CLASSES) {
  const sem = bateria(id, 'espada-longa', { andarNoGolpe: 'nao', distInicial: 12, estrategiaB: 'bruto' });
  const com = bateria(id, 'espada-longa', { andarNoGolpe: 'aproximar', distInicial: 12, estrategiaB: 'bruto' });
  const d = com.winA - sem.winA;
  maxD = Math.max(maxD, Math.abs(d));
  console.log(`   ${nome.padEnd(8)} | ${pct(sem.winA).padStart(8)} | ${pct(com.winA).padStart(8)} `
    + `| ${(d >= 0 ? '+' : '') + d.toFixed(1)}`);
}
console.log(`\n   Maior desvio de equilíbrio: ${maxD.toFixed(1)} pontos.`);

// ------------------------------- 4. quanto movimento cada classe ganha, em %
console.log('\n4) A ARITMÉTICA, que não precisa de simulação: quanto do ciclo é o Tick do Golpe.');
console.log('   Andar no Golpe devolve 1 Tick de movimento por ciclo, e ele vale mais para quem\n'
  + '   tem ciclo curto.\n');
console.log('   classe   | ciclo | Ticks que já andam (P + livre) | +1 do Golpe é');
console.log('   ---------|-------|-------------------------------|---------------');
for (const [id, nome] of CLASSES) {
  const w = cat.armas[id];
  const P = REGRAS_PGR.preparo[w.classe];
  const p = typeof P === 'function' ? P(w) : P;
  const ciclo = w.ticks;
  console.log(`   ${nome.padEnd(8)} | ${String(ciclo).padStart(5)} | ${String(p).padStart(29)} `
    + `| +${(100 / ciclo).toFixed(0)}% do ciclo`);
}
console.log('\n   (a coluna do meio é o Preparo: os Ticks em que a peça JÁ anda de graça hoje)');

// ------------------- 5. o que o passo de aproximação REALMENTE compra
//
// As baterias 1 a 3 mostram que ele não custa nada. Esta mostra o que ele
// ganha, e é outro número: o GOLPE QUE VAI PARA O LIXO porque o gesto venceu e
// o alvo estava a um passo do alcance. Ele cresce quanto MENOR o passo de quem
// persegue, e é por isso que a bancada varre o passo em vez de fixá-lo: com 4
// m/Tick quase todo mundo já chega, e o caso some.
console.log('\n5) O GOLPE QUE VAI PARA O LIXO por faltar chão (o alvo a um passo do alcance).');
console.log('   É este caso que o passo de aproximação resolve.\n');
console.log('   passo | classe   | perdidos, pé plantado | com aproximação');
console.log('   ------|----------|-----------------------|----------------');
for (const passo of [2, 3, 4, 5]) {
  PASSO_REF.v = passo;
  for (const [id, nome] of [['adaga', 'leve'], ['martelo-de-guerra', 'pesada']]) {
    const sem = bateria(id, 'adaga', { andarNoGolpe: 'nao', distInicial: 9, estrategiaB: 'kiter' });
    const apr = bateria(id, 'adaga', { andarNoGolpe: 'aproximar', distInicial: 9, estrategiaB: 'kiter' });
    console.log(`   ${String(passo).padStart(5)} | ${nome.padEnd(8)} | ${nu(sem.perd).padStart(21)} `
      + `| ${nu(apr.perd).padStart(15)}`);
  }
}
PASSO_REF.v = 4;
console.log(`
LEITURA
  · Com os dois querendo bater (baterias 1 e 3), a regra é NEUTRA: zero de desvio.
    Quem quer fechar distância já fechou, e o Tick do Golpe não é usado para andar.
  · Contra o BATE-E-CORRE (bateria 2) ela não é neutra: permitir o passo no Golpe
    dá o Tick extra a quem está fugindo, e quem precisa colar perde golpes. A arma
    pesada é a que mais perde (-24% dos golpes que encosta), a leve a que menos (-12%).
  · E o combate muda de CARA: a distância média quase triplica (1,1 m para 2,6-3,2 m).
    Deixa de ser dois corpos colados e vira dança. Isso é escolha de ficção, não erro.

LIMITES DESTE MODELO (não cite a haste desta bancada)
  · A haste zera na bateria 2 por artefato do modelo 1D: alcance 2 contra um kiter
    que recua exatamente o mesmo passo dá perseguição infinita, sem os flancos e o
    terreno que um tabuleiro real tem.
  · Reta, duelo, sem aliados, sem obstáculo, sem Investida e sem Corrida (que custa
    guarda e mudaria a conta do kiter). Robô ganancioso dos dois lados.
  · Leia a direção e o tamanho do efeito, nunca a casa decimal.
`);
