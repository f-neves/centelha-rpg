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
// A primeira versão inventava esses números, e o resultado foi imediato: uma
// batalha 1v1 levava 568 Ticks porque a Absorção inventada (7) era maior que o
// dano médio inventado (6,5), e quase nenhum golpe passava. **Número inventado
// não é só uma etiqueta no relatório: ele produz um jogo que não existe.**
import fs from 'node:fs';
import path from 'node:path';
import { LIB, RAIZ } from './lib-ponte.mjs';

export const chaveHex = (q, r) => `${q},${r}`;

/** A ficha de referência, a mesma do contrato ficha↔mesa. */
const BASE = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/fixtures/kael.json'), 'utf8'));

/**
 * OS DOIS ARQUÉTIPOS, como FICHAS, e não como números.
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

/** O arquétipo resolvido pela régua. Uma vez por processo, e não por batalha. */
const CACHE = new Map();
export function arquetipo(id) {
  if (CACHE.has(id)) return CACHE.get(id);
  const { nome, ficha } = FICHAS[id];
  const r = LIB.resumoCombatePC(ficha);
  const arma = LIB.armaDoCatalogo(r.arma);
  const classe = LIB.classeDeTempo(r.arma, null, null);
  const vel = LIB.velocidadeDaArma(r.arma, 5);
  const D = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/regras.json'), 'utf8'));
  const pvMax = D.derivados.pv.base + (ficha.attrs.vigor || 0) * D.derivados.pv.vigorMult;
  const a = {
    id, nome, arma: r.arma, classe, velocidade: vel,
    ataque: r.ataque, dano: r.dano,
    tipoDano: (arma?.modos || []).find((m) => m.principal)?.tipo || 'impacto',
    defesa: r.defesa, pvMax,
    soak: { impacto: r.soak.impacto, corte: r.soak.corte, perfuracao: r.soak.perfuracao },
    passo: r.passo || { batalha: 3, arranque: 5, corrida: 7 },
    // O alcance: a haste alcança dois hexágonos, o resto alcança um.
    alcanceHex: classe === 'haste' ? 2 : 1,
    // ⚑ a iniciativa e o Raciocínio entram só como critério de ordem da fila.
    iniciativa: 6 + (ficha.attrs.raciocinio || 0), raciocinio: ficha.attrs.raciocinio || 0,
    qa: r.qa,
  };
  CACHE.set(id, a);
  return a;
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
        ordinal: ordinal++,
      });
    }
  }
  return { pecas, escala, mapa: { cols, rows }, celula, semente };
}
