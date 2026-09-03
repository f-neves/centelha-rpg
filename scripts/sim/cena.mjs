// cena.mjs · o elenco e o tabuleiro de uma batalha.
//
// O elenco mínimo da §4.2 do plano: DOIS arquétipos, e não os sete. Eles cobrem
// ciclo 6 e 7, escudo e armadura pesada, e passo diferente, que é o que os três
// eixos da bateria mínima pedem. Sem Conjurador (corta Artes, Mana e Cura do
// caminho crítico) e sem criatura (corta o bestiário).
//
// OS NÚMEROS DE COMBATE NÃO SÃO INVENTADOS, e essa é a diferença em relação à
// primeira versão deste arquivo. Eles saem de `resumoCombatePC`, pelo mesmo
// caminho que a ficha usa: o bolo de ataque, o dano, a Defesa, a Absorção, o
// passo e as duas metades do Quase-Acerto. O que é ⚑ são os TRAÇOS do
// personagem (Destreza, Vigor, perícias), porque um gerador de personagem não
// existe, e a ficha de referência do `test-contrato` é a base dos dois.
//
// O ELENCO MORA NO `elenco.mjs`, e não aqui, desde o espelho de motor: a
// bancada do navegador monta as mesmas peças, e duas listas de arquétipos
// seriam duas cenas diferentes com o mesmo nome.
//
// A primeira versão inventava esses números, e o resultado foi imediato: uma
// batalha 1v1 levava 568 Ticks porque a Absorção inventada (7) era maior que o
// dano médio inventado (6,5), e quase nenhum golpe passava. **Número inventado
// não é só uma etiqueta no relatório: ele produz um jogo que não existe.**
import { LIB } from './lib-ponte.mjs';
import { FICHAS, montarArquetipo } from './elenco.mjs';

export const chaveHex = (q, r) => `${q},${r}`;
export { FICHAS };

/** O arquétipo resolvido pela régua. Uma vez por processo, e não por batalha. */
const CACHE = new Map();
export function arquetipo(id) {
  if (!CACHE.has(id)) CACHE.set(id, montarArquetipo(id, LIB));
  return CACHE.get(id);
}

/**
 * OS TRÊS EIXOS DA BATERIA MÍNIMA, e só eles.
 *
 * Não é a grade de 112, que existe para comparar regras. São os três que a R2
 * previu que dominam a CARGA, que é a pergunta de agora.
 */
export const EIXOS = {
  // domina o total de paradas, e o pico junto com o ciclo
  pecas: { '1v1': 1, '3x3': 3, '2x8': 8 },
  // é quem cria viagem, re-projeção, Tick vazio e tempo morto
  distancia: { encostado: 1, longa: 42 },
  // é quem decide se os golpes COLIDEM no mesmo Tick
  ciclo: { unissono: ['escudeiro', 'escudeiro'], coprimo: ['escudeiro', 'montanteiro'] },
};

/** As doze células, na ordem em que o relatório as lê. */
export function celulas() {
  const out = [];
  for (const [nc, cic] of Object.entries(EIXOS.ciclo)) {
    for (const [nd, dist] of Object.entries(EIXOS.distancia)) {
      for (const [np, n] of Object.entries(EIXOS.pecas)) {
        out.push({ id: `${nc}-${nd}-${np}`, ciclo: nc, distancia: nd, pecas: np, n, dist, arq: cic });
      }
    }
  }
  return out;
}

/**
 * O PLANO DA BATERIA: a lista das batalhas, uma a uma, na ordem.
 *
 * Existe porque as células não têm todas o mesmo número de repetições. As
 * uníssonas ESTOURAM O TETO em 100% das voltas (a decisão D14: Escudeiro contra
 * Escudeiro empata com as bandeiras desligadas, e isso é o achado, não o
 * defeito). Rodar quinhentas voltas de uma resposta que não muda é gastar o
 * orçamento inteiro medindo o mesmo impasse; cinquenta bastam para as métricas
 * por Tick, que são as que sobrevivem à batalha que não termina.
 *
 * Com o plano explícito, `rodar.mjs` não precisa mais supor que a batalha `idx`
 * é a `idx / N`: ela é `plano[idx]`, e acrescentar ou tirar repetição de uma
 * célula não mexe na semente de nenhuma outra (a semente é
 * `hash32(mestre, id, rep)`, derivada e não sorteada).
 */
export function plano(n, nUnissono = 50) {
  const out = [];
  for (const cel of celulas()) {
    const quantas = cel.ciclo === 'unissono' ? Math.min(n, nUnissono) : n;
    for (let rep = 0; rep < quantas; rep++) out.push({ cel, rep });
  }
  return out;
}

/**
 * UMA CENA, montada da célula.
 *
 * O mapa é uma faixa: largura suficiente para a distância inicial mais folga, e
 * altura para as peças de cada lado caberem lado a lado. ⚑ tamanho e forma são
 * invenção, e a P §2.7 já os registrava assim.
 */
export function montarCena(celula, semente) {
  const escala = 1;                                  // ⚑ um metro por hexágono
  const cols = celula.dist + 8;
  const rows = Math.max(4, celula.n + 2);
  const pecas = [];
  let ordinal = 0;
  for (const [i, lado] of ['a', 'b'].entries()) {
    const arq = arquetipo(celula.arq[i]);
    for (let k = 0; k < celula.n; k++) {
      pecas.push({
        ...arq,
        id: `${lado}${k}`, lado, nome: `${arq.nome} ${lado}${k}`,
        pv: arq.pvMax,
        pos: { q: lado === 'a' ? 1 : 1 + celula.dist, r: 1 + k },
        mapa: { cols, rows },
        acao: null, fase: 'livre', pressao: 0, deslizes: 0,
        manobra: 'simples',                          // ⚑ a política não troca de manobra
        // O RELÓGIO DA PEÇA, que é `combatentes.tick` na mesa: ele é o primeiro
        // critério da fila e é atualizado junto com a ação (a mesa grava os
        // dois no mesmo `gravarRelogio`). O laço lia `acao.livre` no lugar
        // dele, o que dá o mesmo número com ação no ar e outro sem ela.
        tick: 0,
        // O CRITÉRIO DE ESTABILIDADE da fila, e ele é comparado como TEXTO
        // (`localeCompare`, em `ordemDaFila`). Na mesa ele é `movido_em`, o
        // carimbo do token, e por isso é uma data: o mesmo esquema aqui, com a
        // mesma base da bancada, para as duas filas ordenarem igual. Com o
        // ordinal cru, "10" vinha antes de "2".
        chegada: new Date(1700000000000 + ordinal * 1000).toISOString(),
        ordinal: ordinal++,
      });
    }
  }
  return { pecas, escala, mapa: { cols, rows }, celula, semente };
}
