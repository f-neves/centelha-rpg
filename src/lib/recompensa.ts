// A conta da recompensa de caça (rodada 115; regra da soma desde o fechamento da economia, 01/10/2026),
// separada da página: recebe o objeto de entrada e os parâmetros de src/data/recompensas.json, e
// devolve a bolsa com cada passo da conta. Nenhum número da regra mora aqui: a tabela de desafio, os
// multiplicadores e a régua de arredondamento vêm do JSON, que sai do modelo em lore/economia/v2.

// TOLERÂNCIA: a tabela de desafio do autor e o desafio que o Mestre digita valem só até a bancada medir.
// LEVANTA QUANDO: a B14 medir o desafio das criaturas, gravá-lo nas fichas e confirmar ou trocar a tabela.

export interface ParamRecompensa {
  desafios: { desafio: number; preco: { pc: number } }[];
  dias_semana: number; grupo: number;
  tarefas: { id: string; nome: string; mult: number }[];
  riscos: { id: string; nome: string; mult: number }[];
  tons: { id: string; nome: string; mult: number }[];
  arredondamento: { abaixo_de: number | null; passo: number }[];
}

/** Uma linha do encontro, digitada pelo Mestre: quantas criaturas de um desafio. O desafio gravado
 *  nas fichas do bestiário ainda não existe, e é provisório até a bancada medir. */
export interface LinhaEncontro { desafio: number; quantidade: number }

export interface EntradaRecompensa {
  criaturas: LinhaEncontro[];
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

/** O maior desafio da tabela. Acima dele não há valor: a conta recusa, sem extrapolar. */
export const desafioMaximo = (P: ParamRecompensa) => Math.max(...P.desafios.map((d) => d.desafio));

/** Valor de uma criatura (por caçador, por semana), pela tabela; fora dela, erro. */
export function valorDoDesafio(desafio: number, P: ParamRecompensa): number {
  const linha = P.desafios.find((d) => d.desafio === desafio);
  if (!linha) throw new Error(`a tabela de desafio vai de 0 a ${desafioMaximo(P)}: desafio ${desafio} não tem valor`);
  return linha.preco.pc;
}

export function calcularRecompensa(e: EntradaRecompensa, P: ParamRecompensa) {
  const acha = <T extends { id: string }>(lista: T[], id: string, o: string): T => {
    const x = lista.find((i) => i.id === id); if (!x) throw new Error(`${o} desconhecido: ${id}`); return x;
  };
  const tarefa = acha(P.tarefas, e.tarefa, 'tipo de tarefa');
  const risco = acha(P.riscos, e.risco, 'risco');
  const tom = acha(P.tons, e.tom, 'tom');
  const outro = e.outro ?? 1;
  const linhas = e.criaturas.filter((l) => l.quantidade > 0)
    .map((l) => ({ ...l, valor: valorDoDesafio(l.desafio, P) }));
  if (!linhas.length) throw new Error('o encontro não tem criatura nenhuma');
  const totalCriaturas = linhas.reduce((s, l) => s + l.quantidade, 0);
  // Valor do encontro = a soma dos valores de todas as criaturas
  const valorEncontro = linhas.reduce((s, l) => s + l.valor * l.quantidade, 0);
  // a semana tem 8 dias, e conta metade da viagem de ida e volta
  const semanas = Math.max(1, e.cacadaSemanas) + Math.max(0, e.viagemDias) / 2 / P.dias_semana;
  const exata = valorEncontro * tom.mult * semanas * tarefa.mult * risco.mult * outro * P.grupo;
  const bolsa = arred(exata, P.arredondamento);
  // num bando, a bolsa se divide pelo valor de cada criatura, e cada uma morta ou capturada paga a
  // sua parte; a criatura solitária é tudo ou nada. A parte sai exata: o arredondamento dela não
  // foi decidido.
  const solitaria = totalCriaturas === 1;
  const partes = linhas.map((l) => ({ desafio: l.desafio, quantidade: l.quantidade, valor: l.valor, parte: bolsa * l.valor / valorEncontro }));
  // a Parte por caçador arredonda para baixo, e o que sobra fica explícito (rodada 118): as partes
  // nunca somam mais que a bolsa
  const porCacador = Math.floor(bolsa / Math.max(1, e.grupo));
  const sobra = bolsa - porCacador * Math.max(1, e.grupo);
  const maiorDesafio = Math.max(...linhas.map((l) => l.desafio));
  return { linhas, totalCriaturas, valorEncontro, semanas, tarefa, risco, tom, outro, exata, bolsa, solitaria, partes, porCacador, sobra, maiorDesafio, grupoReferencia: P.grupo };
}
