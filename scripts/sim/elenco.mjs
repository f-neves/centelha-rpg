// elenco.mjs · os arquétipos, num lugar só, para os DOIS lados lerem.
//
// POR QUE ELE EXISTE, e não é organização: o espelho de motor compara a mesa
// com o laço headless, e comparar duas cenas montadas de dois lugares não prova
// nada sobre o laço, prova que eu montei duas cenas diferentes. As peças
// precisam sair da MESMA linha de código dos dois lados.
//
// O `cena.mjs` (Node) chega aqui pelo pacote do `lib-ponte`; o `mesa-mock.mjs`
// (navegador) chega pelos imports do Astro. Por isso as funções da régua entram
// por PARÂMETRO: este arquivo não escolhe como `src/lib` é carregado, e é o que
// permite que os dois carreguem do jeito de cada um sem duplicar o elenco.
//
// OS NÚMEROS DE COMBATE NÃO SÃO INVENTADOS: saem de `resumoCombatePC`, pelo
// mesmo caminho que a ficha usa. O que é ⚑ são os TRAÇOS (atributos e
// perícias), porque um gerador de personagem não existe.
import BASE from '../fixtures/kael.json' with { type: 'json' };
import REGRAS from '../../src/data/regras.json' with { type: 'json' };

/**
 * OS DOIS ARQUÉTIPOS, como FICHAS e não como números.
 *
 * A diferença entre eles é o que a bateria precisa: ciclo 6 contra 7, escudo
 * contra duas mãos, malha contra placa completa, e passo diferente por causa da
 * penalidade da armadura.
 */
export const FICHAS = {
  escudeiro: {
    nome: 'Escudeiro',
    ficha: {
      ...BASE,
      // ⚑ os traços são os da ficha de referência, com Força suficiente para a
      // espada longa não cobrar o mínimo.
      conjuntos: [{ ativo: true, habil: { ref: 'a:espada-longa' }, inabil: { ref: 'e:heater' } }],
      equip: { armaduras: [{ base: 'malha', vestida: true }] },
    },
  },
  montanteiro: {
    nome: 'Montanteiro',
    ficha: {
      ...BASE,
      attrs: { ...BASE.attrs, forca: 5, vigor: 5, destreza: 3 },   // ⚑ o orc
      conjuntos: [{ ativo: true, habil: { ref: 'a:montante' }, inabil: { ref: 'nada' } }],
      equip: { armaduras: [{ base: 'placa-completa', vestida: true }] },
    },
  },
};

/**
 * UM ARQUÉTIPO RESOLVIDO PELA RÉGUA.
 *
 * `L` traz as quatro funções de `src/lib` de que isto depende. Recebê-las em
 * vez de importá-las é o que deixa o mesmo arquivo rodar no Node (pacote do
 * esbuild) e no navegador (pacote do Astro).
 */
export function montarArquetipo(id, L) {
  const { nome, ficha } = FICHAS[id];
  const r = L.resumoCombatePC(ficha);
  const arma = L.armaDoCatalogo(r.arma);
  const classe = L.classeDeTempo(r.arma, null, null);
  const vel = L.velocidadeDaArma(r.arma, 5);
  const pvMax = REGRAS.derivados.pv.base + (ficha.attrs.vigor || 0) * REGRAS.derivados.pv.vigorMult;
  return {
    id, nome, arma: r.arma, classe, velocidade: vel,
    ataque: r.ataque, dano: r.dano,
    // O TIPO DE DANO SAI DA EXPRESSÃO, e não do catálogo de modos, porque é
    // assim que a mesa o lê (`tipoDeDano(ra.dano)` na folha). Ler do catálogo
    // dava a mesma resposta nestes dois arquétipos e daria outra na primeira
    // arma cujo modo principal não fosse o que a expressão carrega.
    tipoDano: tipoDaExpressao(r.dano) || (arma?.modos || []).find((m) => m.principal)?.tipo || 'impacto',
    defesa: r.defesa, pvMax,
    soak: { impacto: r.soak.impacto, corte: r.soak.corte, perfuracao: r.soak.perfuracao },
    passo: r.passo || { batalha: 3, arranque: 5, corrida: 7 },
    // O alcance: a haste alcança dois hexágonos, o resto alcança um.
    alcanceHex: classe === 'haste' ? 2 : 1,
    // ⚑ o bônus de iniciativa e o Raciocínio entram só como critério de ordem
    // da fila. A iniciativa de cada PEÇA sai de `iniciativaDaPeca`, porque ela
    // é rolada por peça e não por arquétipo.
    iniciativaBase: 6 + (ficha.attrs.raciocinio || 0), raciocinio: ficha.attrs.raciocinio || 0,
    qa: r.qa,
  };
}

/**
 * A INICIATIVA DE UMA PEÇA, rolada.
 *
 * A mesa rola iniciativa por peça (`d6() + bônus`, e o ⚄ da barra rerrola a
 * cena inteira), e é ela que desempata a fila. Aqui a rolagem é DERIVADA do
 * índice da peça em vez de sorteada, por um motivo só: os dois lados do espelho
 * precisam da mesma iniciativa sem compartilhar a sequência de acaso, e o mock
 * é dado estático enquanto o harness roda um gerador semeado.
 *
 * Não é regra nova: é a mesma cena chegando pronta dos dois lados, como
 * chegaria do banco depois de o mestre ter rolado.
 */
export function iniciativaDaPeca(arq, ordinal) {
  // Um `d6` determinístico: mistura o ordinal e devolve 1 a 6.
  let h = (ordinal + 1) * 2654435761 >>> 0;
  h ^= h >>> 15;
  return (arq.iniciativaBase || 0) + 1 + (h % 6);
}

/**
 * O tipo de dano escrito na expressão: `1d6 +2 (C)`.
 *
 * A mesa usa `tipoDeDano` do `equip.ts` e mapeia `perfurante` para a chave
 * `perfuracao` da Absorção (`CAT_SOAK`). Aqui a saída já é a CHAVE, porque é
 * ela que indexa `soak` dos dois lados.
 */
export function tipoDaExpressao(expr) {
  const m = String(expr || '').match(/\(([CIP])\)/i);
  if (!m) return null;
  return { c: 'corte', i: 'impacto', p: 'perfuracao' }[m[1].toLowerCase()];
}
