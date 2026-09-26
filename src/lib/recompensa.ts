// A conta da recompensa de caça (rodada 115), separada da página: recebe o objeto de entrada e os
// parâmetros de src/data/recompensas.json, e devolve a bolsa com cada passo da conta. Nenhum número
// da regra mora aqui: base, fator, degraus, multiplicadores e a régua de arredondamento vêm do JSON,
// que sai do modelo em lore/economia/v2.

export interface ParamRecompensa {
  base: number; fator: number;
  degraus: { degrau: number; preco: { pc: number } }[];
  centelha_passo: number; fracas_contam: number; dias_semana: number; grupo: number;
  tarefas: { id: string; nome: string; mult: number }[];
  riscos: { id: string; nome: string; mult: number }[];
  tons: { id: string; nome: string; mult: number }[];
  arredondamento: { abaixo_de: number | null; passo: number }[];
}

export interface EntradaRecompensa {
  desafio: number; centelha: number; fortes: number; fracas: number;
  cacadaSemanas: number; viagemDias: number;
  tarefa: string; risco: string; tom: string; outro?: number; grupo: number;
}

/** A mesma régua do `arred` do modelo: meio para cima, no passo da faixa (mínimo 1 na primeira). */
export function arred(pc: number, regua: ParamRecompensa['arredondamento']): number {
  for (const { abaixo_de, passo } of regua) {
    if (abaixo_de == null || pc < abaixo_de) {
      const v = Math.floor(pc / passo + 0.5) * passo;
      return passo === 1 ? Math.max(1, v) : v;
    }
  }
  throw new Error('régua de arredondamento sem faixa final');
}

/** Valor do degrau: a tabela até onde ela vai; acima dela, base × fator^(degrau − 1), arredondado. */
export function valorDoDegrau(degrau: number, P: ParamRecompensa): number {
  const linha = P.degraus.find((d) => d.degrau === degrau);
  if (linha) return linha.preco.pc;
  return arred(P.base * P.fator ** (degrau - 1), P.arredondamento);
}

export function calcularRecompensa(e: EntradaRecompensa, P: ParamRecompensa) {
  const acha = <T extends { id: string }>(lista: T[], id: string, o: string): T => {
    const x = lista.find((i) => i.id === id); if (!x) throw new Error(`${o} desconhecido: ${id}`); return x;
  };
  const tarefa = acha(P.tarefas, e.tarefa, 'tipo de tarefa');
  const risco = acha(P.riscos, e.risco, 'risco');
  const tom = acha(P.tons, e.tom, 'tom');
  const outro = e.outro ?? 1;
  const quantidadeEfetiva = Math.max(0, e.fortes) + Math.max(0, e.fracas) * P.fracas_contam;
  const passoQuantidade = quantidadeEfetiva >= 1 ? Math.floor(Math.log2(quantidadeEfetiva)) : 0;
  const passoCentelha = Math.floor(Math.max(0, e.centelha) / P.centelha_passo);
  const degrau = Math.max(1, e.desafio + passoQuantidade + passoCentelha);
  const valor = valorDoDegrau(degrau, P);
  // a semana tem 8 dias, e conta metade da viagem de ida e volta
  const semanas = Math.max(1, e.cacadaSemanas) + Math.max(0, e.viagemDias) / 2 / P.dias_semana;
  const exata = valor * tom.mult * semanas * tarefa.mult * risco.mult * outro * P.grupo;
  const bolsa = arred(exata, P.arredondamento);
  // a Parte por caçador arredonda para baixo, e o que sobra fica explícito (rodada 118): as partes
  // nunca somam mais que a bolsa
  const porCacador = Math.floor(bolsa / Math.max(1, e.grupo));
  const sobra = bolsa - porCacador * Math.max(1, e.grupo);
  return { quantidadeEfetiva, passoQuantidade, passoCentelha, degrau, valor, semanas, tarefa, risco, tom, outro, exata, bolsa, porCacador, sobra, grupoReferencia: P.grupo };
}
