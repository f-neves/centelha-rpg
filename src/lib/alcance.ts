// A distância, virada número.
//
// O tabuleiro é o único lugar do jogo que sabe quantos metros separam duas
// peças, e até agora esse número não entrava em nada. Aqui ele vira as duas
// coisas que a regra tem a dizer sobre distância:
//
//   · no CORPO A CORPO, se o braço alcança (um hexágono; dois na haste);
//   · à DISTÂNCIA, em que faixa o alvo está e quanto isso custa no acerto.
//
// A régua das faixas é a do `Arremesso.md`, e ela é sutil: o que se corta em
// quatro não é o alcance total, é o que SOBRA entre o alcance livre e o
// máximo. É por isso que a mesma regra serve ao dardo empenado (vão minúsculo,
// quase todo o alcance é bom) e ao machado (vão enorme, ele chega muito além de
// onde ainda acerta).
//
// Este arquivo é PURO: não toca no DOM e não sabe o que é uma mesa. E ele só
// CALCULA: quem decide se a penalidade entra na jogada é quem está mestrando.
import regras from '../data/regras.json';
import { armaDoCatalogo } from './combate-tempo';

const A = (regras as any)?.combate?.alcance;

export const HEX_CORPO_A_CORPO: number = A?.corpoACorpo?.hexagonos ?? 1;
export const HEX_HASTE: number = A?.corpoACorpo?.hasteHexagonos ?? 2;
export const FAIXAS: number = A?.faixas?.partes ?? 4;
export const PEN_POR_FAIXA: number = A?.faixas?.penPorParte ?? -3;

/**
 * Os dois números de distância de uma arma que sai da mão.
 *
 * `livre` é onde ela ainda vai aonde você mandou; `max` é até onde ela chega.
 * A arma diz a FRAÇÃO do livre, e não o número: quem joga mais longe também
 * acerta mais longe, então o livre acompanha o máximo.
 *
 * Devolve `null` para quem não tem alcance no catálogo, que é o caso de tudo
 * que se arremessa: ali o máximo sai da Força de Arremesso de quem joga, e não
 * da arma. Enquanto a mesa não tiver esse número na mão, é melhor não mostrar
 * faixa nenhuma do que mostrar uma inventada.
 */
export function alcanceDaArma(idOuNome?: string | null): { livre: number; max: number } | null {
  const w = armaDoCatalogo(idOuNome);
  const max = Number(w?.distMax);
  if (!w || !Number.isFinite(max) || max <= 0) return null;
  const frac = Number(w.alcanceLivreFrac);
  const livre = Number.isFinite(frac) && frac > 0 ? Math.round(max * frac) : 0;
  return { livre: Math.min(livre, max), max };
}

export interface Faixa {
  /** 0 = dentro do alcance livre. 1 a 4 = os quartos do que sobra. */
  faixa: number;
  /** O que ela custa no acerto. Zero dentro do livre. */
  pen: number;
  /** Passou do alcance máximo: não chega, e não há jogada a fazer. */
  alem: boolean;
  livre: number;
  max: number;
}

/** Em que faixa de distância o alvo está, e quanto ela custa. */
export function faixaDeDistancia(idOuNome: string | null | undefined, metros: number): Faixa | null {
  const a = alcanceDaArma(idOuNome);
  if (!a) return null;
  const m = Math.max(0, metros);
  if (m > a.max) return { faixa: FAIXAS + 1, pen: 0, alem: true, ...a };
  if (m <= a.livre) return { faixa: 0, pen: 0, alem: false, ...a };
  // O vão pode ser zero (arma sem fração declarada): aí tudo que passa do livre
  // cai na primeira faixa, em vez de dividir por zero.
  const vao = a.max - a.livre;
  const parte = vao / FAIXAS;
  const n = parte > 0 ? Math.min(FAIXAS, Math.ceil((m - a.livre) / parte)) : 1;
  return { faixa: n, pen: PEN_POR_FAIXA * n, alem: false, ...a };
}

/**
 * O braço alcança?
 *
 * Só responde "não" quando é longe demais. Perto demais não existe nesta regra:
 * não há penalidade por estar colado, e inventar uma aqui seria escrever regra
 * na tela.
 */
export function alcancaNoCorpoACorpo(hexagonos: number, haste: boolean): boolean {
  return hexagonos <= (haste ? HEX_HASTE : HEX_CORPO_A_CORPO);
}
