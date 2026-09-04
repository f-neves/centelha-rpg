// bateria.mjs · reparte as batalhas em processos e junta o resultado.
//
// PROCESSOS, E NUNCA LINHAS DE EXECUÇÃO. Não é preferência: o `acaso.ts` guarda
// a fonte num `let` de módulo, e com `worker_threads` ou `Promise.all` duas
// batalhas dividiriam a mesma sequência, consumindo-a intercalada. O
// determinismo por batalha morreria EM SILÊNCIO, sem erro e sem teste vermelho,
// e a bateria inteira sairia irreprodutível sem que nada avisasse.
//
//   node scripts/sim/bateria.mjs --sanidade      · a de sanidade, que existe para FALHAR
//   node scripts/sim/bateria.mjs                 · a grande
//   node scripts/sim/bateria.mjs --n 20 --procs 2  · uma prova rápida
//
// A RÉGUA É FIXA E NADA SE CORRIGE NO MEIO. O manifesto carimba o commit, o
// `dados_hash` e a árvore suja ANTES de a primeira batalha rodar; se um conserto
// for preciso, a bateria inteira roda de novo. Batalha de commits diferentes não
// entra na mesma leitura, e o agregador recusa uma pasta com dois manifestos.
import { fork } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { celulas, plano, EIXOS, PASSO_ASSIMETRICO } from './cena.mjs';
import { RAIZ } from './lib-ponte.mjs';

const arg = (n, p) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : p; };

/**
 * A BATERIA DE SANIDADE, e o propósito dela é FALHAR.
 *
 * Cinquenta voltas por célula, invariantes ligados, e o que ela mede não
 * interessa: interessa se algum invariante morde, se alguma célula estoura
 * inteira, se algum processo trava. Passou, a grande roda inteira sem
 * interrupção; falhou, conserta e a grande roda **do zero**, porque uma bateria
 * com meia régua não é uma bateria.
 */
const SANIDADE = process.argv.includes('--sanidade');
const N = parseInt(arg('--n', SANIDADE ? '50' : '400'), 10);
const PROCS = parseInt(arg('--procs', '4'), 10);
const SEMENTE = parseInt(arg('--semente', '20260903'), 10);
const AMOSTRA = parseInt(arg('--amostra', '50'), 10);
const SAIDA = path.resolve(RAIZ, arg('--saida',
  `.sim/${SANIDADE ? 'sanidade' : new Date().toISOString().slice(0, 10)}`));
/**
 * O TETO DE TEMPO DE UM PROCESSO, em segundos.
 *
 * O teto de 2.000 Ticks não pega processo travado, porque ele vive DENTRO do
 * laço que travou: um `while` que não anda nunca chega a contar o Tick 2.000.
 * Este relógio é de fora, mata o processo e marca a faixa como perdida, e a
 * bateria termina dizendo qual faixa morreu em vez de ficar pendurada.
 */
const TETO_S = parseInt(arg('--teto-proc', '900'), 10);

const UNI = parseInt(arg('--unissono', '50'), 10);
const CEL = celulas();
// O TOTAL SAI DO PLANO, e não de `células × N`: as uníssonas rodam menos voltas
// (D23), e supor uniformidade aqui daria faixas apontando para batalha nenhuma.
const PLANO = plano(N, UNI);
const TOTAL = PLANO.length;
fs.mkdirSync(SAIDA, { recursive: true });

// O MANIFESTO, antes de rodar. Ele é o que torna a bateria reproduzível e o que
// diz com qual régua ela rodou: sem ele, um resultado é um número sem procedência.
const hashDe = (dirs) => {
  const h = crypto.createHash('sha256');
  const andar = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name))) {
      const c = path.join(d, e.name);
      if (e.isDirectory()) andar(c);
      else if (/\.(ts|json)$/.test(e.name)) { h.update(e.name); h.update(fs.readFileSync(c)); }
    }
  };
  for (const d of dirs) andar(path.join(RAIZ, d));
  return h.digest('hex').slice(0, 16);
};
const git = (c, p) => { try { return execSync(c, { cwd: RAIZ, encoding: 'utf8' }).trim(); } catch { return p; } };
const manifesto = {
  run_id: `b${Date.now().toString(36)}`,
  tipo: SANIDADE ? 'sanidade' : 'grande',
  commit: git('git rev-parse HEAD', '?'), sujo: git('git status --porcelain', '') !== '',
  iso: new Date().toISOString(), semente_mestre: SEMENTE,
  dados_hash: hashDe(['src/data', 'src/lib']),
  eixos: { ...EIXOS, passoAssimetrico: PASSO_ASSIMETRICO },
  celulas: CEL.map((c) => ({ id: c.id, ...c })), n: N, unissono: UNI, total: TOTAL,
  teto_processo_s: TETO_S,
  // COMO REEXECUTAR UMA BATALHA SOZINHA, pelo índice. A semente é
  // `hash32(semente_mestre, celula, repeticao)`, derivada e não sorteada.
  reexecutar: `node scripts/sim/rodar.mjs --de <idx> --ate <idx+1> --imprime`
    + ` --n ${N} --unissono ${UNI} --semente ${SEMENTE} --saida .sim/avulsa`,
  // O QUE FOI INVENTADO, e a regra dura da P §2.7: métrica que depende só de
  // entrada inventada não é achado sobre o sistema, é sensibilidade.
  // AS QUINZE BANDEIRAS ESTÃO TODAS DESLIGADAS, e não é escolha desta bateria:
  // NENHUMA delas é lida por caminho de produção nenhum (varredura de 03/09, o
  // L25). O perfil viaja no encontro, é gravado dentro da entrada do lance e
  // nunca consultado. Esta bateria mede a CARGA, que não depende de bandeira; a
  // bateria de COMPARAÇÃO DE REGRAS, que dependeria, ainda não pode existir.
  bandeirasLidasPeloMotor: false,
  inventado: [
    'a POLÍTICA é a `decisaoAutomatica` da mesa, e não uma das cinco da §0.4 P4.'
    + ' É invenção do PRODUTO e não minha, mas define o alcance de tudo:'
    + ' ela ataca o mais perto e foge com a Vida baixa, e não faz mais nada',
    'a MANOBRA é sempre `simples`, porque a política não escolhe manobra.'
    + ' NENHUMA batalha desta bateria exercita rajada nem empunhadura dupla,'
    + ' e portanto o conserto do L11 (a penalidade por golpe) não é testado aqui',
    'os TRAÇOS dos dois arquétipos (atributos e perícias), da ficha de referência'
    + ' do contrato. Os números de combate NÃO são inventados: saem de resumoCombatePC',
    'o mapa: faixa de largura dist+8 e altura n+2, escala 1 m por hexágono',
    `o multiplicador de passo do eixo E4 (${PASSO_ASSIMETRICO}×), posto pelo ajuste`
    + ' por instância `combatentes.dados.passo`, que é o caminho da mesa. A régua não'
    + ' tem dois arquétipos com passo dobrado e mesma Defesa.'
    + ' ⚠ E4 SAIU DA GRADE em 03/09 por ser inerte (D31): `passoMult` vale 1 em'
    + ' todas as 96 células, e NADA nesta bateria anda com passo dobrado. Esta'
    + ' premissa descreve o caminho de código, que continua em `montarCena` para o'
    + ' dia em que o eixo voltar, e não algo que esteja acontecendo',
    'a DECLARAÇÃO É SEMPRE AUTOMÁTICA, e por isso vale zero gesto. Não é mais um'
    + ' número inventado (o caminho manual foi contado em 03/09: 2 gestos pelo'
    + ' arrasto, 4 pelo menu), mas continua sendo um limite do que a bateria MEDE:'
    + ' nenhuma batalha aqui tem jogador declarando. O relatório publica o efeito'
    + ' como cenário, em vez de escondê-lo (ver 09 §2.4 e scripts/sim/custo-tela.mjs)',
    'o custo de tela do REDIRECIONAMENTO do golpe no caído. A regra manda a peça'
    + ' em modo automático redirecionar sozinha, sem caixa, e a bateria roda SÓ'
    + ' peça automática: nenhuma das batalhas tem peça de jogador. Numa mesa de'
    + ' verdade esse redirecionamento é uma caixa de escolha, e portanto uma'
    + ' parada de classe i com gesto. Esta bateria NÃO ENXERGA esse custo, e o'
    + ' número publicado apaga uma parada de classe i que a mesa real tem',
    'o critério "o inimigo de pé MAIS PRÓXIMO" para onde o golpe redirecionado'
    + ' desce. É escolha de política escrita dentro do MOTOR (grid.astro e'
    + ' motor.mjs), não da régua: `regras.json` diz que redireciona ao alcance da'
    + ' arma e não diz para qual. Número pequeno, mas inventado, e no lugar exato'
    + ' que o D13 vigia',
  ],
};
fs.writeFileSync(path.join(SAIDA, 'bateria.json'), JSON.stringify(manifesto, null, 2) + '\n');

const aqui = path.dirname(fileURLToPath(import.meta.url));
const porFaixa = Math.ceil(TOTAL / PROCS);
console.log(`· ${SANIDADE ? 'SANIDADE · ' : ''}${CEL.length} células, ${N} voltas`
  + ` (${UNI} nas uníssonas) = ${TOTAL} batalhas, em ${PROCS} processos`);
console.log(`  saída: ${path.relative(RAIZ, SAIDA)} · commit ${manifesto.commit.slice(0, 7)}`
  + `${manifesto.sujo ? ' (ÁRVORE SUJA)' : ''}`);

const t0 = Date.now();
const perdidas = [];
await Promise.all(Array.from({ length: PROCS }, (_, i) => new Promise((ok) => {
  const de = i * porFaixa;
  const ate = Math.min(TOTAL, de + porFaixa);
  if (de >= ate) return ok();
  const p = fork(path.join(aqui, 'rodar.mjs'), [
    '--faixa', String(i), '--de', String(de), '--ate', String(ate),
    '--saida', SAIDA, '--semente', String(SEMENTE), '--n', String(N),
    '--amostra', String(AMOSTRA), '--unissono', String(UNI),
  ], { stdio: 'inherit' });
  // O RELÓGIO DE FORA. Sem ele, um laço que não anda pendura a bateria inteira
  // e ninguém sabe qual faixa travou.
  const relogio = setTimeout(() => {
    perdidas.push({ faixa: i, de, ate, motivo: `estourou ${TETO_S}s de processo` });
    p.kill('SIGKILL');
  }, TETO_S * 1000);
  p.on('exit', (c, sinal) => {
    clearTimeout(relogio);
    if (c !== 0 && !perdidas.some((x) => x.faixa === i)) {
      perdidas.push({ faixa: i, de, ate, motivo: `saiu com ${c}${sinal ? ` (${sinal})` : ''}` });
    }
    ok();
  });
})));
const ms = Date.now() - t0;

if (perdidas.length) {
  console.log(`\n✘✘✘ ${perdidas.length} FAIXA(S) PERDIDA(S) · a leitura está incompleta`);
  for (const f of perdidas) console.log(`     faixa ${f.faixa} (${f.de}..${f.ate}): ${f.motivo}`);
  fs.writeFileSync(path.join(SAIDA, 'perdidas.json'), JSON.stringify(perdidas, null, 2) + '\n');
}
console.log(`\n${perdidas.length ? '⚠' : '✓'} ${TOTAL} batalhas em ${(ms / 1000).toFixed(1)} s`);
console.log(`  agregue com: node scripts/sim/agregar.mjs --saida ${path.relative(RAIZ, SAIDA)}`);
if (SANIDADE) {
  console.log('\n  A SANIDADE EXISTE PARA FALHAR. Agregue e leia os alarmes: se algum');
  console.log('  morder, conserte e rode a grande DO ZERO, com o commit novo.');
}
process.exit(perdidas.length ? 1 : 0);
