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
 *
 * `raioAlvoHex` é o raio do ALVO, em hexágonos, medido de borda a borda
 * (Pendencias.md L67, 10/09/2026); `raioAtacanteHex` é o quanto o porte do
 * próprio ATACANTE estende o alcance do centro dele (Pendencias.md L77,
 * decidido em 11/09/2026 · `alcanceDoCentro = raio + braço`, e os `HEX_*` de
 * hoje já embutem os 0,5 m de um atacante Médio, então este parâmetro é só o
 * que PASSA disso). Quem chama já converteu porte e escala da arena para os
 * dois, porque este módulo é puro e não sabe o que é uma mesa. Sem os dois
 * parâmetros, o alcance é o de sempre (centro a centro, atacante Médio), para
 * quem chama sem saber o porte de nenhum dos dois lados. Nenhum dos dois
 * ENCURTA o alcance (um alvo ou atacante menor que Médio dá raio negativo):
 * "perto demais" não existe nesta regra, então o `Math.max(0, …)` mora aqui,
 * na função que decide, e não em cada chamador.
 */
export function alcancaNoCorpoACorpo(
  hexagonos: number, haste: boolean, raioAlvoHex = 0, raioAtacanteHex = 0,
): boolean {
  return hexagonos <= (haste ? HEX_HASTE : HEX_CORPO_A_CORPO)
    + Math.max(0, raioAlvoHex) + Math.max(0, raioAtacanteHex);
}

/**
 * O TETO DE ALCANCE PARA SE INTERPOR entre um golpe e um aliado.
 *
 * Decidido em 07/09/2026 (Pendencias.md, L34 §6): não inventa número novo, reusa
 * a régua de alcance que já existe, medida do AGRESSOR (e não do aliado
 * original). No corpo a corpo isso é só "já estar adjacente a ele" — a régua
 * dizendo a verdade sobre o que interpor contra uma espada exige, e a reta é
 * redundante ali (o alcance curto já colapsa em adjacência). À distância, além
 * de caber no alcance da arma ORIGINAL, o interpositor precisa terminar numa
 * casa que a reta entre o agressor e a posição original do aliado cruza —
 * `naLinha` já vem calculado por quem chama (o traçado é geometria de
 * hexágono, `linhaHex`/`naLinhaHex` em `./hex`, este módulo não sabe de tabuleiro).
 *
 * Sem arma no catálogo (`fx` nulo), não há como afirmar um teto: segue a mesma
 * regra do resto deste arquivo, "avisa e não impede".
 *
 * **A pergunta, no corpo a corpo, é se o AGRESSOR alcança a casa onde o
 * interpositor terminaria** (Pendencias.md L76, resolvido pela fórmula do L77
 * em 11/09/2026): `alcanceDoCentro(agressor) + raio(interpositor)`, os dois
 * termos de `alcancaNoCorpoACorpo`. `raioInterpositorHex` é o raio do
 * INTERPOSITOR (o lado "alvo" desta conta, borda a borda, L67);
 * `raioAgressorHex` é o quanto o próprio porte do AGRESSOR estende o alcance
 * dele (o lado "atacante", L77). O caso Médio contra Médio não muda: os dois
 * ficam de fora e a régua cai no que já era (adjacência).
 */
export function alcanceInterpor(opts: {
  corpoACorpo: boolean;
  haste?: boolean;
  /** Distância do AGRESSOR até a casa em que o interpositor terminaria, em hexágonos. */
  hexagonosDoAgressor: number;
  /** A arma ORIGINAL (do agressor), para o teto à distância. */
  idOuNomeArma?: string | null;
  /** A mesma distância, em metros. */
  metrosDoAgressor: number;
  /** Já calculado no tabuleiro: a casa cruza a reta agressor→posição original do aliado? */
  naLinha: boolean;
  /** O raio do INTERPOSITOR, em hexágonos, borda a borda (L67). */
  raioInterpositorHex?: number;
  /** O quanto o porte do AGRESSOR estende o alcance do centro dele (L77). */
  raioAgressorHex?: number;
}): { pode: boolean; porque: string } {
  if (opts.corpoACorpo) {
    return alcancaNoCorpoACorpo(
      opts.hexagonosDoAgressor, !!opts.haste, opts.raioInterpositorHex ?? 0, opts.raioAgressorHex ?? 0,
    )
      ? { pode: true, porque: '' }
      : {
        pode: false,
        porque: 'Fora do alcance do agressor: no corpo a corpo, só quem já está'
          + ' adjacente a ele pode se interpor.',
      };
  }
  const fx = faixaDeDistancia(opts.idOuNomeArma, opts.metrosDoAgressor);
  if (!fx) return { pode: true, porque: '' };
  if (fx.alem) {
    return {
      pode: false,
      porque: `Além do alcance da arma original (${fx.max} m, medido do agressor): não dá para se interpor daqui.`,
    };
  }
  if (!opts.naLinha) {
    return {
      pode: false,
      porque: 'Fora da linha reta entre o agressor e a posição do aliado: à distância,'
        + ' o interpositor precisa terminar numa casa que essa reta cruza.',
    };
  }
  return { pode: true, porque: '' };
}
