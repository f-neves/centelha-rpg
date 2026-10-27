// A5: a vista de compatibilidade é calculada pelo motor, sem gravar contas na fonte.
import { carregarTS } from './lib-ts.mjs';
const M = await carregarTS('src/lib/motor.ts');
export const unificada = M.unificada;
export const vistaCriatura = M.vistaPublicaCriatura;

export const pvJogador = (vigor, raca='humano') => M.personagem({raca,atributos:{vigor,forca:0},corpo:{massa:70}}).pv;
