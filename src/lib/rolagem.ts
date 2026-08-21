// Os dados, num lugar só.
//
// O rastreador de combate sabia rolar `4d6 +2` desde sempre, e o Grid não: era
// a mesma conta escrita numa página só, e o tabuleiro pedia o número à mão
// mesmo tendo o bolo de dados na tela, a dois centímetros do campo vazio.
//
// Este arquivo é PURO: não toca no DOM e não sabe o que é uma mesa. Quem decide
// SE rola é a mesa (`combate.rolagem`, em `combate-tempo.ts`); aqui só se rola.

/** Um dado. Existe aqui porque é a única fonte de acaso do combate. */
export const d6 = () => 1 + Math.floor(Math.random() * 6);

export interface Rolada {
  /** Quantos dados entraram, depois dos ajustes. */
  dados: number;
  /** O fixo somado, depois dos ajustes. */
  flat: number;
  /** Cada dado, na ordem em que caiu. A mesa quer ver, e não só o total. */
  rolls: number[];
  total: number;
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
  const limpo = String(expr || '').replace(/[−–—]/g, '-').replace(/\([^)]*\)/g, ' ');
  let dados = 0;
  const semDados = limpo.replace(/(\d*)d6/gi, (_m, n) => { dados += n === '' ? 1 : parseInt(n, 10); return ' '; });
  let flat = 0;
  for (const m of semDados.matchAll(/[+-]\s*\d+/g)) flat += parseInt(m[0].replace(/\s+/g, ''), 10);
  dados = Math.max(0, dados + extraDados); flat += extraFlat;
  const rolls = Array.from({ length: dados }, d6);
  return { dados, flat, rolls, total: rolls.reduce((a, b) => a + b, 0) + flat };
}

/** `[3, 5, 1] +2 = 11`, que é como a mesa lê uma rolagem. */
export const descreverRolada = (r: Rolada) =>
  `[${r.rolls.join(', ')}]${r.flat ? ` ${r.flat > 0 ? '+' : '−'}${Math.abs(r.flat)}` : ''} = ${r.total}`;

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
