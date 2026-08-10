// De que a criatura é feita, e o que isso faz com o dano.
//
// Mora aqui, e não dentro de um gerador, porque DOIS precisam da tabela: o
// gen-elementos.mjs (que semeia as 308 do livro) e o gen-monsters.mjs (que
// resolve o `material` declarado numa criatura sua, do inimigos-custom.json,
// sem exigir uma segunda passada).
//
// Nem todo material tem fraqueza, e isso é o ponto: se carne tivesse uma, todo
// mundo teria e a regra deixaria de significar alguma coisa.

export const POR_MATERIAL = {
  // não queima, a lâmina lasca e a ponta não entra. O que quebra pedra é a
  // marreta, e é por isso que Impacto fica fora da lista.
  pedra: { resistencias: ['fogo', 'corte', 'perfuracao'] },
  // igual à pedra no físico, mas CONDUZ: é o raio que o pega.
  metal: { fraquezas: ['raio'], resistencias: ['fogo', 'corte', 'perfuracao'] },
  // queima. A ponta atravessa e não encontra nada vital.
  madeira: { fraquezas: ['fogo'], resistencias: ['perfuracao'] },
  // verde queima mais devagar que madeira seca, mas queima.
  planta: { fraquezas: ['fogo'], resistencias: ['perfuracao'] },
  // nada, dos dois lados. É a linha de base do sistema.
  carne: {},
  // sem órgão que importe: a ponta entra e não acha o que furar. É daqui que sai
  // a resistência a Perfuração do morto-vivo, e não de uma regra própria dele.
  'carne animada': { resistencias: ['perfuracao'] },
  // não tem órgão para furar nem estrutura para cortar; o impacto espalha e ela
  // se junta de novo.
  gosma: { resistencias: ['corte', 'perfuracao'] },
  gelo: { fraquezas: ['fogo'], resistencias: ['gelo', 'perfuracao'] },
  agua: { fraquezas: ['raio'], resistencias: ['fogo'] },
  fogo: { fraquezas: ['agua'], resistencias: ['fogo'] },
  terra: { fraquezas: ['agua'], resistencias: ['fogo'] },
  // não há o que queimar nem o que cortar.
  ar: { resistencias: ['corte', 'perfuracao'] },
};

/** Fraquezas e resistências de um material, ou null se o material não existir. */
export function elementosDoMaterial(mat) {
  if (!mat) return null;
  const m = POR_MATERIAL[String(mat).toLowerCase()];
  if (!m) throw new Error(`material desconhecido: "${mat}". Conhecidos: ${Object.keys(POR_MATERIAL).join(', ')}`);
  return { fraquezas: m.fraquezas || [], resistencias: m.resistencias || [] };
}
