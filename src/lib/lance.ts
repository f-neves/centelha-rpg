// A resolução de um golpe, fora do modal.
//
// Este é o único módulo que os dois lados usam: a mesa resolve golpe dentro de
// `folhaDaAcao`, e o harness precisa resolver o mesmo golpe sem DOM, sem
// Supabase e sem `await`. O que se compartilha é a CONTA; o laço do Tick
// continua sendo cópia (Q6), e é a cena-espelho que impede as duas de andarem
// para lados diferentes.
//
// A costura é o que faltava. Cada peça já existia e era pura:
//
//   `quase-acerto.ts`   a classificação em acerto / raspão / erro
//   `calc.ts`           Defesa e Absorção
//   `combate-resumo.ts` o resumo do PC
//   `equip.ts`          os catálogos
//   `rolagem.ts`        a expressão de dados
//   `acaso.ts`          a fonte
//
// O que morava dentro do modal era a ORDEM em que elas se chamam, e é essa
// ordem que decide dano, que decide duração, que multiplica toda a carga que a
// bateria vai medir. Uma divergência aqui não aparece como erro: aparece como
// um número plausível.
//
// Por isso o `test-lance.mjs` não confere esta função contra a minha leitura do
// código: confere contra 396 golpes de verdade, gravados da mesa
// (`scripts/fixtures/lances.jsonl`). A lição do `lib-tempo.mjs` é que cinco
// divergências passaram nos testes unitários dos dois lados e nenhuma foi pega
// por teste; todas foram pegas por comparação contra o comportamento real.
import { rolarExpr } from './rolagem';
import { acaso } from './acaso';
import { errouPor, saidaDoAtaque, type Saida } from './quase-acerto';

/** A fonte de dados de um lance: ou o acaso, ou os dados que já caíram. */
export interface FonteDeDados {
  /** Rola uma expressão, com os ajustes da situação. Devolve o mesmo que `rolarExpr`. */
  rolar(expr: string, extraDados?: number, extraFlat?: number): { total: number; rolls: number[] };
}

/**
 * A fonte normal: rola de verdade, pelo `acaso` semeado (ou pelo `Math.random`).
 *
 * Não recebe o `acaso` como parâmetro porque o `rolagem.ts` já o usa por
 * dentro: semear é trocar a fonte do módulo, e não passar argumento.
 */
export const fonteRolada: FonteDeDados = {
  rolar: (expr, extraDados = 0, extraFlat = 0) => rolarExpr(expr, extraDados, extraFlat),
};

/**
 * A fonte FIXA: devolve dados que já caíram, na ordem em que caíram.
 *
 * É o que torna a conferência possível. Os dados da mesa vieram de um ponto
 * arbitrário da sequência de acaso, e não há como reproduzi-lo; com os dados
 * dados, a comparação passa a ser sobre a **conta**, que é o que se quer
 * conferir. Se a cópia rolar uma quantidade diferente de dados, ou somar o
 * ajuste no lugar errado, o `total` sai diferente e o teste pega.
 */
export function fonteFixa(dados: { acerto: number[]; dano: number[] }): FonteDeDados {
  const fila = [dados.acerto, dados.dano];
  let i = 0;
  return {
    rolar: (expr, extraDados = 0, extraFlat = 0) => {
      const rolls = (fila[i++] || []).slice();
      // O `flat` da expressão sai da mesma leitura que o `rolarExpr` faz, para
      // a soma ser a mesma soma. Só os DADOS vêm de fora.
      const limpo = String(expr || '').replace(/[−–—]/g, '-').replace(/\([^)]*\)/g, ' ');
      let flat = 0;
      for (const m of limpo.replace(/(\d*)d6/gi, ' ').matchAll(/[+-]\s*\d+/g)) {
        flat += parseInt(m[0].replace(/\s+/g, ''), 10);
      }
      flat += extraFlat;
      return { total: rolls.reduce((a, b) => a + b, 0) + flat, rolls };
    },
  };
}

/** O que decide um golpe. Tudo o que a folha lê, com nome. */
export interface EntradaLance {
  /** O identificador da ação (D2). Nasce na declaração e sobrevive à re-projeção. */
  aid: string;
  atacante: {
    id?: string; nome?: string;
    /** A expressão do bolo de ataque, como `resumoCombatePC` a escreve. */
    ataque: string;
    /** A expressão do dano. */
    dano: string;
    /** O que a situação cobra DELE: ferimento e condições. */
    ajusteFlat: number; ajusteDados: number;
    /** A penalidade de dados por golpe, uma entrada por golpe da agenda. */
    penDados: number[];
    /** As duas metades do Quase-Acerto que vêm da arma. */
    qaArmaBonus: number; qaArmaDano: number;
  };
  alvo: {
    id?: string; nome?: string;
    /** A Defesa do resumo, antes dos modificadores da situação. */
    defesaBase: number | null;
    ferimento: number;
    condicoesDefesa: number;
    /** A escada do P/G/R mais a Pressão, já somada (`defesaPerdida().total`). */
    defesaPerdida: number;
    /** A Absorção NO MODO deste golpe, já resolvida. */
    soak: number;
    pv: number | null; pvMax: number | null;
    qaArmaduraBonus: number; qaArmaduraReducao: number;
  };
  manobra: string;
  golpeIndice: number;
  distanciaHex: number | null;
  tipoDano: string;
  /** O que o mestre escreveu à mão. No harness é zero. */
  modManual: number;
  /** A margem e o dano do raspão, que a mesa deixa corrigir. */
  margemQA: number; danoQA: number;
  /** O perfil de bandeiras com que a cena roda. */
  perfil?: Record<string, boolean>;
}

/** O que sai de um golpe resolvido. */
export interface SaidaLance {
  defesa: number | null;
  total: number | null;
  soma: number | null;
  errouPor: number | null;
  veredito: Saida | null;
  danoBruto: number;
  tipo: string;
  absorcao: number;
  danoLiquido: number;
  pvAntes: number | null;
  pvDepois: number | null;
  /** Os dados de cada rolagem, para o espelho comparar dado a dado. */
  rolls: { acerto: number[]; dano: number[] };
}

/**
 * A DEFESA EFETIVA: a do resumo, mais tudo o que a situação abriu.
 *
 * Separada porque ela é lida sozinha em dois lugares (a tela mostra a conta, o
 * golpe usa o total) e porque é a soma em que um sinal trocado passa
 * despercebido: `condicoesDefesa` costuma ser negativo, e `ferimento` também.
 */
export function defesaEfetiva(alvo: EntradaLance['alvo']): number | null {
  if (alvo.defesaBase == null) return null;
  return alvo.defesaBase + alvo.ferimento + alvo.condicoesDefesa + alvo.defesaPerdida;
}

/**
 * RESOLVE UM GOLPE, do bolo ao dano.
 *
 * Pura: não toca no DOM, não sabe o que é uma mesa, não grava nada e não
 * espera nada. Toda a variação entra por `entrada` e por `fonte`.
 *
 * A ordem importa e é esta:
 *   1. a Defesa efetiva do alvo;
 *   2. o bolo do atacante, com a penalidade do golpe deste índice;
 *   3. a soma, com o ajuste que o mestre tenha escrito;
 *   4. a classificação, pelo `quase-acerto.ts`;
 *   5. o dano, que depende do veredito: o raspão é fixo e **ignora a
 *      Absorção** (capítulo XII), o acerto rola e desconta, o erro não faz nada.
 */
export function resolverGolpe(entrada: EntradaLance, fonte: FonteDeDados = fonteRolada): SaidaLance {
  const def = defesaEfetiva(entrada.alvo);

  // O bolo. A penalidade é a do GOLPE deste índice: a rajada e a empunhadura
  // dupla cobram por golpe, e somá-las numa jogada só mentiria na primeira e na
  // última ao mesmo tempo.
  const pen = entrada.atacante.penDados[entrada.golpeIndice] ?? 0;
  const jogada = fonte.rolar(
    entrada.atacante.ataque,
    entrada.atacante.ajusteDados + pen,
    entrada.atacante.ajusteFlat,
  );
  const total = jogada.total;
  const soma = total + entrada.modManual;

  const falta = def != null ? errouPor(soma, def) : null;
  const veredito = def != null ? saidaDoAtaque(soma, def, entrada.margemQA) : null;

  // O dano. Três caminhos, e o do raspão é o que mais escapa de quem lê o
  // código depressa: ele é fixo, não rola dado nenhum e não leva Absorção.
  let bruto = 0;
  let rollsDano: number[] = [];
  let absorcao = 0;
  let liquido = 0;
  if (veredito === 'acerto') {
    const d = fonte.rolar(entrada.atacante.dano);
    bruto = Math.max(0, d.total);
    rollsDano = d.rolls;
    absorcao = Math.min(bruto, entrada.alvo.soak);
    liquido = Math.max(0, bruto - entrada.alvo.soak);
  } else if (veredito === 'raspao') {
    bruto = Math.max(0, entrada.danoQA);
    liquido = bruto;
  }

  return {
    defesa: def,
    total, soma,
    errouPor: falta,
    veredito,
    danoBruto: bruto,
    tipo: entrada.tipoDano,
    absorcao,
    danoLiquido: liquido,
    pvAntes: entrada.alvo.pv,
    pvDepois: entrada.alvo.pv != null ? Math.max(0, entrada.alvo.pv - liquido) : null,
    rolls: { acerto: jogada.rolls, dano: rollsDano },
  };
}

/** A base da Margem e do raspão, que sai do encontro e não de um dos dois lados. */
export function quaseAcertoDoEncontro(entrada: EntradaLance): { margem: number; dano: number } {
  return {
    margem: entrada.atacante.qaArmaBonus + entrada.alvo.qaArmaduraBonus,
    dano: Math.max(0, entrada.atacante.qaArmaDano - entrada.alvo.qaArmaduraReducao),
  };
}

/** A fonte de acaso do módulo, reexportada para quem semeia o harness. */
export { acaso };
