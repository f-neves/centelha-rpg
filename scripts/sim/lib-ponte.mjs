// lib-ponte.mjs · a ponte entre `src/lib` (TypeScript, com JSON dentro) e o
// harness (Node cru).
//
// O `esbuild` empacota uma vez, num arquivo temporário, e todo mundo importa de
// lá. Isso importa por um motivo que não é performance: se cada módulo do
// harness empacotasse por conta, cada pacote levaria a SUA cópia do estado do
// `acaso.ts`, e semear um não afetaria o outro. Um pacote só, um estado só.
//
// E é aqui que a restrição de paralelismo aparece: a fonte de acaso é um `let`
// de módulo. Duas batalhas no mesmo processo dividiriam a mesma sequência em
// silêncio, sem erro e sem teste vermelho. Por isso `bateria.mjs` reparte em
// PROCESSOS (`child_process.fork`), e nunca em `worker_threads` nem em
// `Promise.all` sobre batalhas.
import { build } from 'esbuild';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', '..');

/** Empacota `src/lib` e devolve o módulo. Um por processo. */
export async function carregarLib() {
  const saida = path.join(os.tmpdir(), `sim-lib-${process.pid}.mjs`);
  await build({
    stdin: {
      contents: `
        export {
          anatomia, declarar, agendaSimultanea, reprojetarAgenda, faseEm,
          defesaPerdida, ordemDaFila, golpesNoAr, golpeResolvido,
          decisaoAutomatica, ticksDeViagem, golpeDaAgenda, penDadosDaRegua,
          passoDoGolpe, decideEmValeDepois, faseDeQuemVaiAgir, preparoDe,
          agendar, contrapeDe, temGesto,
        } from './src/lib/combate-tempo';
        export { distanciaHex, caminharHex, vizinhos, alemDe } from './src/lib/hex';
        export { HEX_HASTE, HEX_CORPO_A_CORPO } from './src/lib/alcance';
        export { resolverGolpe, fonteRolada, defesaEfetiva } from './src/lib/lance';
        export { qaDaPeca, errouPor, saidaDoAtaque } from './src/lib/quase-acerto';
        export { resumoCombatePC } from './src/lib/combate-resumo';
        export { velocidadeDaArma, classeDeTempo, armaDoCatalogo } from './src/lib/combate-tempo';
        export { tierDe, somarCondicoes } from './src/lib/mesa-core';
        export { deslocamento } from './src/lib/calc';
        export { semear, semeadoDe, semeado } from './src/lib/acaso';
        export { rolarExpr } from './src/lib/rolagem';
        export { PERFIL_CORRENTE } from './src/lib/bandeiras';
      `,
      resolveDir: RAIZ, loader: 'ts',
    },
    outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error',
    define: { 'import.meta.env': 'globalThis.__ENV__' },
  });
  globalThis.__ENV__ = { BASE_URL: '/', MODE: 'sim' };
  const M = await import(pathToFileURL(saida).href);
  fs.rmSync(saida, { force: true });
  return M;
}

/**
 * O pacote, guardado para o gerador de cena não empacotar por conta.
 *
 * Dois pacotes teriam duas cópias do estado do `acaso.ts`, e semear um não
 * afetaria o outro.
 */
export let LIB = null;
export function ligar(M) { LIB = M; }

export { RAIZ };
