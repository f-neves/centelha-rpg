// rodar.mjs · um processo, uma faixa de batalhas.
//
// Recebe a faixa por argumento, calcula as próprias sementes, roda, acumula em
// memória e grava UMA vez por batalha no `.jsonl` da faixa. Nada é
// compartilhado e nada precisa de trava, porque cada batalha é independente de
// todas as outras por construção: a semente é derivada, e não sorteada.
//
//   node scripts/sim/rodar.mjs --faixa 0 --de 0 --ate 500 --saida .sim/x/
import fs from 'node:fs';
import path from 'node:path';
import { carregarLib, ligar, RAIZ } from './lib-ponte.mjs';
import { plano, montarCena } from './cena.mjs';
import { novoLog, resumo } from './log.mjs';
import { batalha } from './motor.mjs';
import { conferir } from './invariantes.mjs';

const arg = (n, p) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : p; };
const DE = parseInt(arg('--de', '0'), 10);
const ATE = parseInt(arg('--ate', '10'), 10);
const FAIXA = arg('--faixa', '0');
const SAIDA = path.resolve(RAIZ, arg('--saida', '.sim/ultima'));
const SEM_MESTRE = parseInt(arg('--semente', '20260902'), 10);
const N = parseInt(arg('--n', '500'), 10);
const AMOSTRA = parseInt(arg('--amostra', '0'), 10);

/**
 * A SEMENTE DE UMA BATALHA, derivada e não sorteada.
 *
 * `hash32(semente_mestre, celula, repeticao)` (P §2.4). Assim a batalha 743 é
 * reproduzível sem depender de nenhuma anterior, e acrescentar uma no fim não
 * muda nenhuma das outras. São 32 bits porque é o que o Mulberry32 do
 * `acaso.ts` consome, e a colisão dentro de uma célula de 500 é da ordem de 3
 * em 100.000.
 */
function hash32(...xs) {
  let h = 0x811c9dc5;
  for (const x of xs) {
    const s = String(x);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
  }
  return h >>> 0;
}

const L = await carregarLib();
ligar(L);
const PLANO = plano(N, parseInt(arg('--unissono', '50'), 10));
fs.mkdirSync(SAIDA, { recursive: true });
const arq = path.join(SAIDA, `faixa-${FAIXA}.jsonl`);
const linhas = [];
const evs = [];

for (let idx = DE; idx < ATE; idx++) {
  const item = PLANO[idx];
  if (!item) break;
  const { cel, rep } = item;
  const semente = hash32(SEM_MESTRE, cel.id, rep);

  // UMA BATALHA, UM PROCESSO, UMA SEMENTE. Semear é trocar o estado de um
  // módulo; duas batalhas ao mesmo tempo no mesmo processo dividiriam a
  // sequência em silêncio.
  L.semear(L.semeadoDe(semente));
  const cena = montarCena(cel, semente);
  const completo = AMOSTRA > 0 && rep < AMOSTRA && cel.id === PLANO[0].cel.id;
  const log = novoLog({ completo });
  const res = batalha(L, cena, log);
  const falhas = conferir(cena, log, res);
  const linha = { ...resumo(log, cena, idx, semente), invariantes: falhas };
  linhas.push(JSON.stringify(linha));
  if (completo && log.eventos) evs.push(JSON.stringify({ b: idx, eventos: log.eventos }));
}

fs.writeFileSync(arq, linhas.join('\n') + (linhas.length ? '\n' : ''), 'utf8');
if (evs.length) fs.writeFileSync(path.join(SAIDA, `eventos-${FAIXA}.jsonl`), evs.join('\n') + '\n', 'utf8');
process.stdout.write(`faixa ${FAIXA}: ${linhas.length} batalhas\n`);
