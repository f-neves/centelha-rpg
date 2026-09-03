// bateria.mjs · reparte as batalhas em processos e junta o resultado.
//
// PROCESSOS, E NUNCA LINHAS DE EXECUÇÃO. Não é preferência: o `acaso.ts` guarda
// a fonte num `let` de módulo, e com `worker_threads` ou `Promise.all` duas
// batalhas dividiriam a mesma sequência, consumindo-a intercalada. O
// determinismo por batalha morreria EM SILÊNCIO, sem erro e sem teste vermelho,
// e a bateria inteira sairia irreprodutível sem que nada avisasse.
//
//   node scripts/sim/bateria.mjs                    · a bateria mínima inteira
//   node scripts/sim/bateria.mjs --n 20 --procs 2   · uma prova rápida
import { fork } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { celulas } from './cena.mjs';
import { RAIZ } from './lib-ponte.mjs';

const arg = (n, p) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : p; };
const N = parseInt(arg('--n', '500'), 10);
const PROCS = parseInt(arg('--procs', '4'), 10);
const SEMENTE = parseInt(arg('--semente', '20260902'), 10);
const AMOSTRA = parseInt(arg('--amostra', '50'), 10);
const SAIDA = path.resolve(RAIZ, arg('--saida', `.sim/${new Date().toISOString().slice(0, 10)}`));

const CEL = celulas();
const TOTAL = CEL.length * N;
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
  commit: git('git rev-parse HEAD', '?'), sujo: git('git status --porcelain', '') !== '',
  iso: new Date().toISOString(), semente_mestre: SEMENTE,
  dados_hash: hashDe(['src/data', 'src/lib']),
  celulas: CEL.map((c) => ({ id: c.id, ...c })), n: N, total: TOTAL,
  // O QUE FOI INVENTADO, e a regra dura da P §2.7: métrica que depende só de
  // entrada inventada não é achado sobre o sistema, é sensibilidade.
  inventado: [
    'os TRAÇOS dos dois arquétipos (atributos e perícias), da ficha de referência do contrato.'
    + ' Os números de combate NÃO são inventados: saem de resumoCombatePC',
    'o mapa: faixa de largura dist+8 e altura n+2, escala 1 m por hexágono',
    'a política é a `decisaoAutomatica` da mesa, e não uma das cinco da §0.4 P4.'
    + ' É invenção do PRODUTO, e não minha, que é uma posição melhor',
    'um gesto por parada, até a tabela de custo de tela existir (P §4)',
    'a manobra é sempre `simples`: a política da mesa não escolhe manobra',
  ],
};
fs.writeFileSync(path.join(SAIDA, 'bateria.json'), JSON.stringify(manifesto, null, 2) + '\n');

const aqui = path.dirname(fileURLToPath(import.meta.url));
const porFaixa = Math.ceil(TOTAL / PROCS);
console.log(`· ${CEL.length} células × ${N} = ${TOTAL} batalhas, em ${PROCS} processos`);
console.log(`  saída: ${path.relative(RAIZ, SAIDA)}`);

const t0 = Date.now();
await Promise.all(Array.from({ length: PROCS }, (_, i) => new Promise((ok, erro) => {
  const de = i * porFaixa;
  const ate = Math.min(TOTAL, de + porFaixa);
  if (de >= ate) return ok();
  const p = fork(path.join(aqui, 'rodar.mjs'), [
    '--faixa', String(i), '--de', String(de), '--ate', String(ate),
    '--saida', SAIDA, '--semente', String(SEMENTE), '--n', String(N),
    '--amostra', String(AMOSTRA),
  ], { stdio: 'inherit' });
  p.on('exit', (c) => (c === 0 ? ok() : erro(new Error(`faixa ${i} saiu com ${c}`))));
})));
const ms = Date.now() - t0;
console.log(`\n✓ ${TOTAL} batalhas em ${(ms / 1000).toFixed(1)} s`);
console.log(`  agregue com: node scripts/sim/agregar.mjs --saida ${path.relative(RAIZ, SAIDA)}`);
