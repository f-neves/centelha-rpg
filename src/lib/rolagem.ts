// Os dados, num lugar só.
//
// O rastreador de combate sabia rolar `4d6 +2` desde sempre, e o Grid não: era
// a mesma conta escrita numa página só, e o tabuleiro pedia o número à mão
// mesmo tendo o bolo de dados na tela, a dois centímetros do campo vazio.
//
// Este arquivo é PURO: não toca no DOM e não sabe o que é uma mesa. Quem decide
// SE rola é a mesa (`combate.rolagem`, em `combate-tempo.ts`); aqui só se rola.

import { acaso } from './acaso';

/**
 * Um dado. Existe aqui porque é a única fonte de acaso do combate.
 *
 * O `acaso` é `Math.random` em uso normal; quem semeia é a página, e só quando
 * a URL pede. Ver `acaso.ts`.
 */
export const d6 = () => 1 + Math.floor(acaso() * 6);

export interface Rolada {
  /** Quantos dados entraram, depois dos ajustes. */
  dados: number;
  /** O fixo somado, depois dos ajustes. */
  flat: number;
  /** Cada dado, na ordem em que caiu. A mesa quer ver, e não só o total. */
  rolls: number[];
  total: number;
  /**
   * `rolls.length` bate com o número de dados que a EXPRESSÃO pede. Só
   * `roladaManual` checa isto (quem chama `rolarExpr` sempre rola o número
   * certo); existe para marcar o campo quando o hábito antigo de digitar o
   * TOTAL pronto (e não as faces) volta sem avisar ninguém.
   */
  bateContagem?: boolean;
}

/**
 * O fixo de uma expressão de dados, sem os `NdN`.
 *
 * Separado de `rolarExpr` porque a rolagem MANUAL (`roladaManual`, abaixo)
 * precisa do mesmo fixo sem rolar dado nenhum: quem já rolou na mão só tem as
 * faces para somar, e refazer esta conta duas vezes (aqui e ali) é o convite
 * pronto para as duas um dia divergirem.
 */
function flatDeExpr(expr: string): number {
  const limpo = String(expr || '').replace(/[−–—]/g, '-').replace(/\([^)]*\)/g, ' ');
  const semDados = limpo.replace(/(\d*)d6/gi, ' ');
  let flat = 0;
  for (const m of semDados.matchAll(/[+-]\s*\d+/g)) flat += parseInt(m[0].replace(/\s+/g, ''), 10);
  return flat;
}

/**
 * Quantos d6 a EXPRESSÃO pede, sem ajuste nenhum: soma cada `NdN`, tratando
 * `Nd6` sem número (`d6`) como 1, e `0d6` como exatamente ZERO — não como "sem
 * número", que `parseInt("0d6") || 1` já confundiu uma vez (a marca de
 * `bateContagem` contava 1 dado para uma arma de "0d6", o oposto do que a
 * arma tem).
 *
 * Separado de `rolarExpr` porque `roladaManual` (abaixo) precisa da MESMA
 * contagem sem rolar: as duas formas de "quantos dados este bolo tem" têm de
 * concordar, ou a guarda de "isto é um total, não uma face" acende no lugar
 * errado.
 */
function baseDadosDeExpr(expr: string): number {
  const limpo = String(expr || '').replace(/[−–—]/g, '-').replace(/\([^)]*\)/g, ' ');
  let baseDados = 0;
  limpo.replace(/(\d*)d6/gi, (_m, n) => { baseDados += n === '' ? 1 : parseInt(n, 10); return ' '; });
  return baseDados;
}

/**
 * O piso do pool: nunca menos que zero dado.
 */
function dadosAjustados(baseDados: number, extraDados: number): number {
  return Math.max(0, baseDados + extraDados);
}

/**
 * Rola uma expressão do tipo `4d6+2`, `3d6 +5 (C)` ou `1d6 −2`.
 *
 * Aceita o que o bestiário e a ficha escrevem, incluindo o menos tipográfico
 * (−) que o projeto usa no lugar do hífen, e ignora o que estiver entre
 * parênteses, que é o tipo do dano e não faz parte da conta.
 *
 * `extraDados` e `extraFlat` são os ajustes da situação: ferimento, condição,
 * a escada do P/G/R, a penalidade da rajada. Vêm de fora porque quem sabe deles
 * é a tela, e não a expressão.
 */
export function rolarExpr(expr: string, extraDados = 0, extraFlat = 0): Rolada {
  const dados = dadosAjustados(baseDadosDeExpr(expr), extraDados);
  const flat = flatDeExpr(expr) + extraFlat;
  const rolls = Array.from({ length: dados }, d6);
  return { dados, flat, rolls, total: rolls.reduce((a, b) => a + b, 0) + flat };
}

/**
 * O DADO JÁ ROLADO NA MÃO, e não pelo código: a mesa digita as faces que
 * caíram, separadas por vírgula ou espaço, e esta função soma com o fixo da
 * expressão, sem rolar nada. Existe para a folha do lance aceitar o dado em
 * vez do total já somado (decidido em 06/09/2026): a mesa que fazia a conta de
 * cabeça e digitava só o resultado passa a digitar o que os olhos viram, e a
 * soma sai daqui, visível, e não da cabeça de quem jogou.
 *
 * `null` quando o texto não tem nenhum número: é o estado "ninguém digitou
 * nada ainda", e ele tem de ser distinto de "digitou zero", que é uma face
 * impossível num d6 mas um total válido (um erro que não machucou nada).
 *
 * UM NÚMERO SÓ, E O POOL AJUSTADO NÃO TEM DADO NENHUM: só pode ser o TOTAL de
 * uma arma sem dado (dano fixo) ou de um bolo que o ferimento/condição zerou,
 * e não a face de um dado que não foi rolado. Tratar como face somaria o
 * fixo em cima de um número que já É o total, dobrando a conta. É o único
 * caso em que esta função aceita um total pronto, e só porque não há dado
 * nenhum para digitar em seu lugar.
 *
 * ACHADO EM 22/09/2026, bug de produção desde 06/09/2026 (`045f491`): a
 * guarda testava `!/\d*d6/i.test(expr)`, "a expressão não tem a substring
 * `d6`" — e uma arma que já nasce `0d6` (comum: `combate-resumo.ts` escreve
 * `${Math.floor(soma/2)}d6`, que é `0d6` sempre que Atributo+Perícia ≤ 1)
 * TEM a substring, então a guarda nunca disparava para ela. `rolarAcerto`
 * escreve o TOTAL no campo quando o pool rola zero dado (`grid.astro:10868`),
 * e sem a guarda essa mesma função lia aquele total como se fosse UMA face e
 * somava o fixo de novo por cima — a jogada saía com o dobro do bônus fixo.
 * A guarda agora testa o POOL AJUSTADO (`dadosAjustados`, a mesma conta que
 * `rolarAcerto` usa para decidir quantos dados rolar), não o texto da arma.
 */
export function roladaManual(texto: string, expr: string, extraFlat = 0, extraDados = 0): Rolada | null {
  const rolls = (String(texto || '').match(/-?\d+/g) || []).map(Number);
  if (!rolls.length) return null;
  const dadosExpr = dadosAjustados(baseDadosDeExpr(expr), extraDados);
  if (rolls.length === 1 && dadosExpr === 0) {
    return { dados: 0, flat: 0, rolls: [], total: rolls[0], bateContagem: true };
  }
  const flat = flatDeExpr(expr) + extraFlat;
  // QUANTOS DADOS O POOL PEDE, para marcar o campo quando o número de
  // faces digitadas não bate: é o sinal do hábito antigo (digitar o TOTAL já
  // somado) voltando, e ele soma como se fosse UMA face sem avisar ninguém.
  //
  // `extraDados` ENTRA NA CONTA (achado da revisão de 06/09/2026): a mesa
  // digita as faces do POOL AJUSTADO (ferimento, condição, a escada do
  // P/G/R, o segundo golpe de uma rajada), e não da expressão crua da arma.
  // Sem somar `extraDados` aqui, qualquer ajuste de dados marcava vermelho
  // uma digitação certa — o mesmo risco que a rede do avanço existe para
  // não correr: um sinal que acende no caso errado apaga o sinal, em vez de
  // mostrá-lo.
  return {
    dados: rolls.length, flat, rolls, total: rolls.reduce((a, b) => a + b, 0) + flat,
    bateContagem: rolls.length === dadosExpr,
  };
}

/**
 * `[3, 5, 1] +2 = 11`, que é como a mesa lê uma rolagem.
 *
 * Sem dado nenhum não se escreve `[]`: o colchete vazio parece defeito, e o
 * caso é real (uma criatura com bônus fixo e nenhum dado, um ataque que a
 * penalidade zerou).
 */
export const descreverRolada = (r: Rolada) => {
  const fixo = r.flat ? ` ${r.flat > 0 ? '+' : '−'}${Math.abs(r.flat)}` : '';
  return r.rolls.length ? `[${r.rolls.join(', ')}]${fixo} = ${r.total}` : `sem dados${fixo} = ${r.total}`;
};

export type TipoDano = 'impacto' | 'corte' | 'perfurante';

/**
 * O modo do dano, lido da própria expressão.
 *
 * O bestiário e a ficha escrevem `1d6 +2 (C)`, e a caixa de dano do Grid abria
 * em Impacto sempre, mesmo quando quem bateu levava uma espada. Perguntar o que
 * está escrito na linha de cima é a definição do atrito que este projeto está
 * tirando da frente.
 *
 * Devolve `null` quando a expressão não diz: aí quem chama decide o padrão, e
 * não se inventa um tipo que ninguém escreveu.
 */
export function tipoDeDano(expr: string): TipoDano | null {
  const m = /\(([^)]*)\)/.exec(String(expr || ''));
  if (!m) return null;
  const t = m[1].trim().toLowerCase();
  if (/^(c|corte|cortante)$/.test(t)) return 'corte';
  if (/^(p|perf|perfurante|perfura[çc][ãa]o)$/.test(t)) return 'perfurante';
  if (/^(i|imp|impacto)$/.test(t)) return 'impacto';
  return null;
}
