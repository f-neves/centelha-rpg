// O Quase-Acerto, virado número.
//
// A regra é o capítulo XII: errar por pouco ainda raspa. Ela existe escrita
// desde sempre e o Grid nunca a calculou, então a mesa fazia a conta de cabeça
// ou simplesmente não usava a válvula que impede duelo de guarda alta de virar
// uma fila de zeros.
//
// São duas contas, e as duas têm um lado de cada:
//
//   Margem  = Bônus QA da ARMA + Bônus QA da ARMADURA do alvo
//   Raspão  = Dano QA da ARMA − Redução QA da ARMADURA do alvo (mínimo 0)
//
// E uma consequência que não é conta: o raspão IGNORA A ABSORÇÃO normal. Já é o
// que sobrou de um golpe que quase não conectou.
//
// Este arquivo é PURO: não toca no DOM, não sabe o que é uma mesa, e só calcula.
// Quem decide se o golpe raspou é quem está mestrando, como em todo o resto.
import regras from '../data/regras.json';
import { armaDoCatalogo } from './combate-tempo';

const Q = (regras as any)?.quaseAcerto || {};

export type ClasseQA = 'leve' | 'media' | 'pesada';
export type ClasseArmadura = 'nenhuma' | 'leve' | 'media' | 'pesada';

const POR_ARMA = Q.porClasseArma || {};
const POR_ARMADURA = Q.porClasseArmadura || {};
const LIMIAR = Q.classePorDanoMedio || {};
const LEVE_ATE: number = LIMIAR.leveAte ?? 2;
const MEDIA_ATE: number = LIMIAR.mediaAte ?? 5.5;

/** A média de um d6. Sai daqui e não de um literal solto para poder mudar junto. */
const FACE_MEDIA = 3.5;

/**
 * O dano médio de uma expressão de dano ("2d6 +3", "1d6", "4").
 *
 * É o caminho de quem não está no catálogo: a criatura do bestiário e o item
 * que o mestre digitou na hora. Ali a expressão É a arma, e contar os dados e o
 * fixo dela é a única leitura honesta disponível.
 */
export function danoMedioDaExpr(expr?: string | null): number | null {
  if (!expr) return null;
  const t = String(expr).toLowerCase();
  let total = 0;
  let achou = false;
  for (const m of t.matchAll(/([+-]?\s*\d*)\s*d\s*(\d+)/g)) {
    const n = parseInt((m[1] || '1').replace(/\s+/g, ''), 10);
    const faces = parseInt(m[2], 10) || 6;
    const q = Number.isFinite(n) && n !== 0 ? n : 1;
    total += q * ((faces + 1) / 2);
    achou = true;
  }
  // O fixo é o que sobra depois de tirar os grupos de dado: sem isso o "+3" de
  // "2d6 +3" seria lido como um dado de três faces por engano.
  const sobra = t.replace(/[+-]?\s*\d*\s*d\s*\d+/g, ' ');
  for (const m of sobra.matchAll(/([+-]\s*\d+)/g)) {
    total += parseInt(m[1].replace(/\s+/g, ''), 10) || 0;
    achou = true;
  }
  return achou ? total : null;
}

/**
 * O dano médio de uma arma, pelo catálogo quando ela está nele.
 *
 * O catálogo vence a expressão porque a expressão de um personagem já leva a
 * Força dele somada, e a classe de QA é da ARMA: se o bruto de Força 6 fizesse
 * a espada longa virar pesada, o mesmo aço raspava diferente em duas mãos.
 */
export function danoMedioDaArma(idOuNome?: string | null, expr?: string | null): number | null {
  const w = armaDoCatalogo(idOuNome);
  if (w) {
    const dado = Number(w.dado);
    const bonus = Number(w.danoBonus) || 0;
    if (Number.isFinite(dado) && dado > 0) return dado * FACE_MEDIA + bonus;
  }
  return danoMedioDaExpr(expr);
}

/**
 * Em que classe de Quase-Acerto uma arma cai.
 *
 * A régua é o dano médio, e não o número de dados. O capítulo dizia "1d6 leve,
 * 2d6 média, 3d6 pesada", e o catálogo mudou por baixo dele: hoje 24 das 26
 * armas têm um dado só e nenhuma tem três. Ao pé da letra a espada longa virava
 * leve e a categoria pesada deixava de existir. O dano médio é a mesma ideia
 * (quanto a arma pesa no golpe) medida por um número que ainda varia.
 *
 * `null` quando não há de onde tirar: sem arma e sem expressão, não há classe, e
 * inventar uma seria escrever regra no lugar de ler.
 */
export function classeQADaArma(idOuNome?: string | null, expr?: string | null): ClasseQA | null {
  const m = danoMedioDaArma(idOuNome, expr);
  if (m == null) return null;
  if (m <= LEVE_ATE) return 'leve';
  if (m <= MEDIA_ATE) return 'media';
  return 'pesada';
}

export interface QAArma { classe: ClasseQA | null; bonus: number; dano: number }

/** O que a arma põe na conta: quanto ela amplia a Margem e quanto o raspão dói. */
export function qaDaArma(idOuNome?: string | null, expr?: string | null): QAArma {
  const classe = classeQADaArma(idOuNome, expr);
  const t = classe ? POR_ARMA[classe] : null;
  return { classe, bonus: Number(t?.bonus) || 0, dano: Number(t?.dano) || 0 };
}

export interface QAArmadura { bonus: number; reducao: number; classes: ClasseArmadura[] }

/**
 * O que a armadura do alvo põe na conta.
 *
 * A contramão é de propósito, e está no capítulo: quanto MAIS pesada a
 * armadura, MAIOR a Margem do atacante, porque um alvo encouraçado é maior e
 * mais lento, e portanto mais fácil de roçar. Em troca a Redução come o dano do
 * raspão. O cavaleiro de placa é nicado quase toda rodada, e a maioria desses
 * nicks bate em zero.
 *
 * Empilhar segue a regra do capítulo, e as duas metades empilham DIFERENTE:
 * os Bônus SOMAM, a Redução é a MAIOR entre as peças. Somar as duas seria
 * blindar duas vezes contra a mesma coisa.
 */
export function qaDeArmaduras(pecas: { classe?: string | null }[] | null | undefined): QAArmadura {
  const classes: ClasseArmadura[] = [];
  let bonus = 0;
  let reducao = 0;
  for (const p of pecas || []) {
    const c = (p?.classe || 'nenhuma') as ClasseArmadura;
    const t = POR_ARMADURA[c];
    if (!t) continue;
    classes.push(c);
    bonus += Number(t.bonus) || 0;
    reducao = Math.max(reducao, Number(t.reducao) || 0);
  }
  return { bonus, reducao, classes };
}


/**
 * Os quatro números do Quase-Acerto que uma peça carrega.
 *
 * Duas metades de lados opostos: `arma*` vale quando esta peça ATACA, e
 * `armadura*` vale quando ela APANHA. Ficam juntas porque toda peça é as duas
 * coisas ao longo da luta, e separá-las obrigaria a tela a montar dois resumos.
 *
 * A criatura do bestiário nasce com a armadura zerada, e é de propósito: o
 * bestiário modela couro grosso como ABSORÇÃO, e não como armadura vestida. O
 * cavaleiro de placa construído como criatura se conserta pelo ajuste por
 * instância (`combatentes.dados.qa`) ou na própria folha da ação, que mostra
 * Margem e raspão em campo editável.
 */
export interface QACombate {
  armaBonus: number; armaDano: number;
  armaduraBonus: number; armaduraReducao: number;
  /** Só para a tela explicar a conta: "média", ou "placa + escudo". */
  armaClasse?: string | null;
  armaduraClasses?: string[];
}

/** Os quatro números do Quase-Acerto de uma peça, montados de onde houver. */
export function qaDaPeca(
  arma?: string | null, dano?: string | null,
  armaduras?: { classe?: string | null }[] | null,
): QACombate {
  const w = qaDaArma(arma, dano);
  const a = qaDeArmaduras(armaduras);
  return {
    armaBonus: w.bonus, armaDano: w.dano, armaClasse: w.classe,
    armaduraBonus: a.bonus, armaduraReducao: a.reducao, armaduraClasses: a.classes,
  };
}

export interface Raspao {
  /** Errar por até isto ainda raspa. */
  margem: number;
  /** O dano fixo do raspão, já descontada a Redução. Não rola dados. */
  dano: number;
  /** O raspão ignora a Absorção normal? (Sempre sim; o campo existe para a tela dizer.) */
  ignoraSoak: boolean;
  arma: QAArma;
  armadura: QAArmadura;
}

/** As duas contas do Quase-Acerto, juntas: quem ataca com quê, contra que couro. */
export function quaseAcerto(
  atacante: { arma?: string | null; dano?: string | null },
  alvo: { armaduras?: { classe?: string | null }[] | null },
): Raspao {
  const arma = qaDaArma(atacante?.arma, atacante?.dano);
  const armadura = qaDeArmaduras(alvo?.armaduras);
  return {
    margem: arma.bonus + armadura.bonus,
    dano: Math.max(0, arma.dano - armadura.reducao),
    ignoraSoak: Q.ignoraSoak !== false,
    arma, armadura,
  };
}

/**
 * Errou por quanto?
 *
 * A regra do acerto é `total > Defesa`, e não `>=`: empate não passa. Então
 * quem empata errou por 1, e é essa a distância que se compara com a Margem.
 * Devolve 0 ou menos quando o golpe acertou.
 */
export const errouPor = (total: number, defesa: number): number => defesa - total + 1;

/** Errar por esta distância ainda raspa? */
export const raspa = (faltou: number, margem: number): boolean => faltou > 0 && faltou <= margem;

/** As três saídas de um ataque, pela conta. É proposta: quem decide é a mesa. */
export type Saida = 'acerto' | 'raspao' | 'erro';
export function saidaDoAtaque(total: number, defesa: number, margem: number): Saida {
  const falta = errouPor(total, defesa);
  if (falta <= 0) return 'acerto';
  return raspa(falta, margem) ? 'raspao' : 'erro';
}
