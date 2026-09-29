// desafio-personas.mjs · os quatro personagens de referência da Fase 5 (B14), como o
// despacho descreve (`docs/simulacao/caixa/b14-cr-desafio-fase4-5-despacho.md`).
//
// Isto é dado puro (nenhuma regra de jogo nova): as somas de ataque, a armadura por
// personagem e a fórmula de Proezas-como-bônus são texto do despacho, copiadas aqui em
// forma de tabela para o roteiro da bancada ler. A divisão Atributo/Habilidade é a regra
// que o despacho manda ("metade da soma, arredondando para baixo, é Habilidade; o resto é
// Atributo"), não uma invenção da bancada.

// soma de ataque por Centelha 0..6, igual para Pers. 1 e Pers. 2 (despacho, Fase 5).
export const SOMA_ATAQUE_1_2 = [9, 10, 11, 12, 12, 12, 12];
// soma de ataque por Centelha 0..6, Pers. 4 (não combatente que ameaça).
export const SOMA_ATAQUE_4 = [5, 6, 6, 8, 8, 9, 10];

/** Habilidade = floor(soma/2); o resto vira Atributo. */
export function dividirSoma(soma) {
  const habilidade = Math.floor(soma / 2);
  return { atributo: soma - habilidade, habilidade };
}

/**
 * Proezas como bônus matemático (só para a comparação, sem dano no conjunto): um
 * conjunto vale 3 × Centelha em pontos, repartidos conforme o despacho.
 * Devolve { ataque, defesa }, os pontos extras de cada persona nesta Centelha.
 */
export function bonusProezas(persona, centelha) {
  const pontos = 3 * centelha;
  switch (persona) {
    case 'pers1': // metade no ataque, metade na Defesa
      return { ataque: Math.floor(pontos / 2), defesa: pontos - Math.floor(pontos / 2) };
    case 'pers2': // dois terços no ataque, um terço na Defesa
      { const ataque = Math.round((2 * pontos) / 3);
        return { ataque, defesa: pontos - ataque }; }
    case 'pers3': // nenhum
      return { ataque: 0, defesa: 0 };
    case 'pers4': // 1,5 × Centelha no ataque, a partir da Centelha 2; nada de Defesa
      return { ataque: centelha >= 2 ? Math.round(1.5 * centelha) : 0, defesa: 0 };
    default:
      throw new Error(`persona desconhecida: ${persona}`);
  }
}

/**
 * O bloco de UM personagem de referência numa Centelha dada.
 *
 * `armaduraId`/`escudoId` correspondem a `src/data/armaduras.json`/`escudos.json`, para
 * passar em `empilharArmaduras` (via `L`, o pacote de `src/lib`). Pers. 3 não ataca (soma
 * de ataque não existe para ela: usa Artes/Estabilizar/Auxiliar/cobrir, ver política 3 do
 * despacho da Fase 5).
 */
export function blocoPersona(persona, centelha) {
  if (centelha < 0 || centelha > 6) throw new Error(`Centelha fora de 0..6: ${centelha}`);
  const prz = bonusProezas(persona, centelha);
  switch (persona) {
    case 'pers1': {
      const { atributo, habilidade } = dividirSoma(SOMA_ATAQUE_1_2[centelha]);
      return { persona, centelha, atributo, habilidade, armaduraId: 'malha', escudoId: 'broquel', proezas: prz };
    }
    case 'pers2': {
      const { atributo, habilidade } = dividirSoma(SOMA_ATAQUE_1_2[centelha]);
      return { persona, centelha, atributo, habilidade, armaduraId: 'couro', escudoId: 'nenhum', proezas: prz };
    }
    case 'pers3':
      // Sem soma de ataque no despacho ("não precisa atacar"). TOLERÂNCIA: nível de
      // Arte fixado em Centelha + 2 só dentro desta bancada (escalaCentelha e o
      // portão de nível ≥ Centelha dizem outra coisa fora daqui, e o próprio
      // despacho da Fase 5 pede para registrar isto como pendência).
      // LEVANTA QUANDO: o autor decidir o nível de Arte real do Pers. 3 na bancada.
      return { persona, centelha, nivelArtePers3: centelha + 2, armaduraId: 'gambeson', escudoId: 'nenhum', proezas: prz };
    case 'pers4': {
      const { atributo, habilidade } = dividirSoma(SOMA_ATAQUE_4[centelha]);
      return { persona, centelha, atributo, habilidade, armaduraId: 'gambeson', escudoId: 'nenhum', proezas: prz };
    }
    default:
      throw new Error(`persona desconhecida: ${persona}`);
  }
}

/** Os quatro personagens de referência, numa Centelha dada. */
export function grupoDeReferencia(centelha) {
  return ['pers1', 'pers2', 'pers3', 'pers4'].map((p) => blocoPersona(p, centelha));
}

/**
 * Vontade: +1d6 numa jogada ativa, ou +4 numa Defesa (passiva); 1 ponto por ação ou
 * jogada (`regras.json`, `gastoVontade`). TOLERÂNCIA: o TAMANHO da reserva de cada
 * persona não está no despacho, e esta bancada usa um valor fixo por Centelha (proposta
 * enviada ao Arquiteto: Centelha + 2) até a decisão chegar.
 * LEVANTA QUANDO: o autor decidir o tamanho real da reserva de Vontade por persona.
 */
export const GASTO_VONTADE = { porPonto: '+1d6 numa jogada ativa, ou +4 numa Defesa (passiva)', teto: '1 ponto por ação ou jogada' };
