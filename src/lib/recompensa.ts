// A conta da recompensa de caça (rodada 115; desde o fechamento da economia, Adendo 5 de 02/10/2026,
// a recompensa é o preço de UM TRABALHO, e não de cabeças), separada da página: recebe o objeto de
// entrada e os parâmetros de src/data/recompensas.json, e devolve a bolsa com cada passo da conta.
// Nenhum número da regra mora aqui: a tabela de desafio, os multiplicadores e a régua de
// arredondamento vêm do JSON, que sai do modelo em lore/economia/v2.

// TOLERÂNCIA: a tabela de desafio do autor, o +1/2 por dobra e o desafio digitado valem até a bancada medir.
// LEVANTA QUANDO: a B14 medir o desafio das criaturas, gravá-lo nas fichas e confirmar ou trocar a tabela.

export interface ParamRecompensa {
  desafios: { desafio: number; preco: { pc: number } }[];
  meios: { desafio: number; preco: { pc: number } }[];
  divisor_por_desafio: number; desafio_por_dobra: number;
  dias_semana: number; grupo: number;
  tarefas: { id: string; nome: string; mult: number }[];
  riscos: { id: string; nome: string; mult: number }[];
  tons: { id: string; nome: string; mult: number }[];
  arredondamento: { abaixo_de: number | null; passo: number }[];
}

/** Uma linha de confronto, digitada pelo Mestre na ajuda de estimar: quantas criaturas de um desafio. */
export interface LinhaEncontro { desafio: number; quantidade: number }

export interface EntradaRecompensa {
  /** O desafio do trabalho: o do pior confronto que o grupo precisa vencer para cumpri-lo. Inteiro
   *  ou meio degrau, de 0 a 9. */
  desafio: number;
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

/** Valor (por caçador, por semana) num desafio inteiro ou de meio degrau, pela tabela; fora dela
 *  (acima de 9, meio degrau sem vizinho, negativo ou outra fração), erro. */
export function valorDoDesafio(desafio: number, P: ParamRecompensa): number {
  const linha = [...P.desafios, ...P.meios].find((d) => d.desafio === desafio);
  if (!linha) throw new Error(`a tabela de desafio vai de 0 a ${desafioMaximo(P)}: desafio ${desafio} não tem valor`);
  return linha.preco.pc;
}

// TOLERÂNCIA: a conta por equivalentes (+1/2 por dobra) vale até a bancada medir o bando com a Regra de Horda.
// LEVANTA QUANDO: a B18 (fila da B14) medir o desafio por N e o autor confirmar ou trocar a regra.
/** Ajuda opcional, provisória: estimar o desafio de UM confronto com várias criaturas (Adendo 2, que
 *  no Adendo 5 deixou de mexer em pagamento). A criatura no desafio da mais forte conta 1
 *  equivalente, e cada desafio abaixo divide por 4, sem piso. O confronto sobe 1/2 desafio a cada
 *  dobra dos equivalentes, para baixo, nos mesmos degraus da Magnitude da Regra de Horda (1: +0;
 *  2 a 3: +1/2; 4 a 7: +1; ...): é o + Magnitude ÷ 2. */
export function desafioDoEncontro(criaturas: LinhaEncontro[], P: ParamRecompensa) {
  const linhas = criaturas.filter((l) => l.quantidade > 0);
  if (!linhas.length) throw new Error('o confronto não tem criatura nenhuma');
  const maisForte = Math.max(...linhas.map((l) => l.desafio));
  const comEq = linhas.map((l) => {
    const cada = P.divisor_por_desafio ** -(maisForte - l.desafio);
    return { ...l, eqCada: cada, eq: cada * l.quantidade };
  });
  const equivalentes = comEq.reduce((s, l) => s + l.eq, 0);
  // os equivalentes são somas de potências de 1/4, exatas em ponto flutuante; a folga só protege o log
  const magnitude = Math.floor(Math.log2(equivalentes) + 1e-9);
  const desafio = maisForte + magnitude * P.desafio_por_dobra;
  const exato = maisForte + Math.log2(equivalentes) * P.desafio_por_dobra;
  return { linhas: comEq, maisForte, equivalentes, magnitude, desafio, exato };
}

export function calcularRecompensa(e: EntradaRecompensa, P: ParamRecompensa) {
  const acha = <T extends { id: string }>(lista: T[], id: string, o: string): T => {
    const x = lista.find((i) => i.id === id); if (!x) throw new Error(`${o} desconhecido: ${id}`); return x;
  };
  const tarefa = acha(P.tarefas, e.tarefa, 'tipo de tarefa');
  const risco = acha(P.riscos, e.risco, 'risco');
  const tom = acha(P.tons, e.tom, 'tom');
  const outro = e.outro ?? 1;
  // o Valor é o da tabela no desafio do trabalho (meio degrau pela média geométrica dos vizinhos)
  const valor = valorDoDesafio(e.desafio, P);
  // a semana tem 8 dias, e conta metade da viagem de ida e volta
  const semanas = Math.max(1, e.cacadaSemanas) + Math.max(0, e.viagemDias) / 2 / P.dias_semana;
  const exata = valor * tom.mult * semanas * tarefa.mult * risco.mult * outro * P.grupo;
  const bolsa = arred(exata, P.arredondamento);
  // a Parte por caçador arredonda para baixo, e o que sobra fica explícito (rodada 118): as partes
  // nunca somam mais que a bolsa
  const porCacador = Math.floor(bolsa / Math.max(1, e.grupo));
  const sobra = bolsa - porCacador * Math.max(1, e.grupo);
  return { desafio: e.desafio, valor, semanas, tarefa, risco, tom, outro, exata, bolsa, porCacador, sobra, grupoReferencia: P.grupo };
}
