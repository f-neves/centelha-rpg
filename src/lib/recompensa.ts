// A conta da bolsa de um trabalho pontual (rodada 115; desde o fechamento da economia, Adendo 5 de
// 02/10/2026, a recompensa é o preço de UM TRABALHO, e não de cabeças; desde o item 5, vale para
// qualquer trabalho pontual, como guia para o Mestre), separada da página: recebe o objeto de
// entrada e os parâmetros de src/data/recompensas.json, e devolve a bolsa com cada passo da conta.
// Nenhum número da regra mora aqui: a tabela de desafio, a de perícia, os multiplicadores e a régua
// de arredondamento vêm do JSON, que sai do modelo em lore/economia/v2.

// TOLERÂNCIA: a tabela de desafio do 4 em diante vale até existir onde gastar o topo dela.
// LEVANTA QUANDO: a G73 decidir os preços do sobre-humano, e o autor confirmar ou trocar o topo da tabela.

export interface ParamRecompensa {
  desafios: { desafio: number; preco: { pc: number } }[];
  meios: { desafio: number; preco: { pc: number } }[];
  provisorio_desde: number;
  pericia: { dif_de: number; dif_ate: number; desafio: number | null; preco: { pc: number } }[];
  divisor_por_desafio: number; desafio_por_dobra: number;
  dias_semana: number; pessoas_padrao: number;
  trabalhos: { id: string; nome: string; tarefas: { id: string; nome: string; mult: number }[] }[];
  riscos: { id: string; nome: string; mult: number }[];
  tons: { id: string; nome: string; mult: number }[];
  arredondamento: { abaixo_de: number | null; passo: number }[];
}

/** Uma linha de confronto, digitada pelo Mestre na ajuda de estimar: quantas criaturas de um desafio. */
export interface LinhaEncontro { desafio: number; quantidade: number }

export interface EntradaRecompensa {
  /** Caminho do confronto: o desafio do trabalho, o do pior confronto que o grupo precisa vencer
   *  para cumpri-lo. Inteiro ou meio degrau, de 0 a 9. Sem confronto, null. */
  desafio?: number | null;
  /** Caminho da perícia: a Dificuldade dos testes decisivos. Sem perícia, null. Com os dois
   *  caminhos, vale o maior. */
  dificuldade?: number | null;
  trabalho: string; tarefa: string;
  semanas: number; viagemDias: number;
  risco: string; tom: string; outro?: number;
  /** Quantas o contratante decide pagar (padrão: `pessoas_padrao`). */
  pessoas?: number;
  /** Quantas vão de fato: só divide a bolsa na Parte por pessoa. */
  grupo: number;
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

/** Valor (por pessoa, por semana) num desafio inteiro ou de meio degrau, pela tabela; fora dela
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

/** O valor (por pessoa, por semana) de uma Dificuldade pela tabela de perícia (correção A do item 5
 *  e respostas do autor de 02/10/2026): no degrau, o valor dele (acima de 20, a faixa em que
 *  (Dif − 19) ÷ 2, para cima, dá o mesmo desafio); entre dois degraus, a interpolação geométrica dos
 *  vizinhos, como o meio degrau, arredondada pela régua; abaixo do primeiro degrau, o piso; acima do
 *  último (o desafio 9), erro, sem extrapolar. */
export function valorDaPericia(dificuldade: number, P: ParamRecompensa) {
  const L = P.pericia;
  if (!Number.isFinite(dificuldade) || dificuldade < 0) throw new Error(`Dificuldade ${dificuldade} não tem valor`);
  if (dificuldade < L[0].dif_de) return { pc: L[0].preco.pc, desafio: L[0].desafio, como: 'piso' as const, de: L[0], ate: L[0] };
  const dentro = L.find((l) => dificuldade >= l.dif_de && dificuldade <= l.dif_ate);
  if (dentro) return { pc: dentro.preco.pc, desafio: dentro.desafio, como: 'degrau' as const, de: dentro, ate: dentro };
  const i = L.findIndex((l) => l.dif_de > dificuldade);
  if (i < 0) throw new Error(`a tabela de perícia vai até a Dificuldade ${L[L.length - 1].dif_ate} (desafio ${L[L.length - 1].desafio}): ${dificuldade} não tem valor`);
  const a = L[i - 1], b = L[i];
  const t = (dificuldade - a.dif_ate) / (b.dif_de - a.dif_ate);
  return { pc: arred(a.preco.pc * (b.preco.pc / a.preco.pc) ** t, P.arredondamento), desafio: null, como: 'entre' as const, de: a, ate: b };
}

export function calcularRecompensa(e: EntradaRecompensa, P: ParamRecompensa) {
  const acha = <T extends { id: string }>(lista: T[], id: string, o: string): T => {
    const x = lista.find((i) => i.id === id); if (!x) throw new Error(`${o} desconhecido: ${id}`); return x;
  };
  const trabalho = acha(P.trabalhos, e.trabalho, 'tipo de trabalho');
  const tarefa = acha(trabalho.tarefas, e.tarefa, `tarefa de ${trabalho.nome}`);
  const risco = acha(P.riscos, e.risco, 'risco');
  const tom = acha(P.tons, e.tom, 'tom');
  const outro = e.outro ?? 1;
  const temConfronto = e.desafio != null, temPericia = e.dificuldade != null;
  if (!temConfronto && !temPericia) throw new Error('o trabalho precisa de um desafio, de uma Dificuldade, ou dos dois');
  // o confronto vale o da tabela no desafio (meio degrau pela média geométrica dos vizinhos); a
  // perícia, o do degrau da Dificuldade; com os dois, vale o maior
  const valorConfronto = temConfronto ? valorDoDesafio(e.desafio!, P) : null;
  const pericia = temPericia ? valorDaPericia(e.dificuldade!, P) : null;
  const valorPericia = pericia ? pericia.pc : null;
  const caminho: 'confronto' | 'pericia' = valorPericia != null && (valorConfronto == null || valorPericia > valorConfronto) ? 'pericia' : 'confronto';
  const valor = caminho === 'pericia' ? valorPericia! : valorConfronto!;
  // o desafio que conta para as frases de pagamento (terra a partir do 5, favor acima do 3, o aviso do topo da tabela)
  const desafioUsado = caminho === 'pericia' ? pericia!.desafio : e.desafio!;
  // a semana tem 8 dias, e conta metade da viagem de ida e volta
  const semanas = Math.max(1, e.semanas) + Math.max(0, e.viagemDias) / 2 / P.dias_semana;
  const pessoas = e.pessoas ?? P.pessoas_padrao;
  const exata = valor * tom.mult * semanas * tarefa.mult * risco.mult * outro * pessoas;
  const bolsa = arred(exata, P.arredondamento);
  // a Parte por pessoa arredonda para baixo, e o que sobra fica explícito (rodada 118): as partes
  // nunca somam mais que a bolsa
  const porPessoa = Math.floor(bolsa / Math.max(1, e.grupo));
  const sobra = bolsa - porPessoa * Math.max(1, e.grupo);
  // TOLERÂNCIA: do desafio 4 em diante o valor vale até existir onde gastar.
  // LEVANTA QUANDO: a G73 decidir os preços do sobre-humano, e o autor confirmar ou trocar o topo da tabela.
  const provisorio = desafioUsado != null && desafioUsado >= P.provisorio_desde;
  return { desafio: e.desafio ?? null, dificuldade: e.dificuldade ?? null, pericia, valorConfronto, valorPericia, caminho, valor, desafioUsado, provisorio,
    semanas, trabalho, tarefa, risco, tom, outro, pessoas, exata, bolsa, porPessoa, sobra };
}
