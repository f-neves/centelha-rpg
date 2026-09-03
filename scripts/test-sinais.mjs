// test-sinais.mjs · cada alarme da bateria acende de propósito, uma vez.
//
// POR QUE ELE EXISTE. Dos onze sinais de bateria ineficaz, DEZ nunca tinham
// acendido em nenhuma das quatro voltas de 03/09. Só o `fuga-consumada` disparou
// alguma vez. Um alarme que nunca disparou é um alarme não testado, e um alarme
// não testado imprime o mesmo ✓ nos dois casos que ele existe para separar:
//
//   "não houve problema"                      ← o que a gente lê
//   "o predicado está errado e nunca acende"   ← o que pode estar acontecendo
//
// É o ZERO DE DUAS CARAS outra vez (`02-projeto-harness.md`, o princípio do zero
// ambíguo), agora dentro do instrumento que existe justamente para pegá-lo. A
// forma de erro já apareceu três vezes nesta frente: os seis Ticks sem rolar
// dado, as sete comparações de E5 que não podiam morder, e as quinze bandeiras
// que ninguém lê. Aqui ela é fechada por construção.
//
// CADA SINAL LEVA DOIS CASOS: o mínimo que TEM de acendê-lo, e o mínimo que NÃO
// pode. Sem o segundo, um predicado que devolvesse `true` sempre passaria.
//
//   node scripts/test-sinais.mjs
import { SINAIS, conferirSinais } from './sim/sinais.mjs';

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

/**
 * Uma batalha de mentira, com só o que os predicados leem.
 *
 * Ela não passa pelo motor de propósito: o que se testa aqui é o PREDICADO, e
 * fabricar a batalha no motor exigiria uma cena que produzisse o defeito, que é
 * justamente o que não se consegue fazer de encomenda.
 */
const batalha = (o = {}) => ({
  celula: o.celula || 'c-l25',
  fim: o.fim || 'morte',
  paradasSub: { reprojetar: 5, fugir: 2, redirecionar: 1, ...(o.paradasSub || {}) },
  vereditos: { acerto: 10, raspao: 3, erro: 4, ...(o.vereditos || {}) },
  quadro: { nada: 10, soResolveu: 2, soParou: 3, ambos: 5, ...(o.quadro || {}) },
  ticksMortos: o.ticksMortos ?? 4,
  fases: { combate: { paradasPorTick: { media: o.media ?? 1, p10: o.p10 ?? 0, p90: o.p90 ?? 3 } } },
});

/** O contexto que `conferirSinais` recebe, montado de uma lista de batalhas. */
function ctxDe(boas, { invalidas = [], dist = 18 } = {}) {
  const porCelula = new Map();
  for (const l of boas) {
    if (!porCelula.has(l.celula)) porCelula.set(l.celula, []);
    porCelula.get(l.celula).push(l);
  }
  return { boas, invalidas, porCelula, infoDe: () => ({ dist }) };
}

/** Confere um sinal pelo nome, num contexto. */
const acendeu = (nome, ctx) => conferirSinais(ctx).find((v) => v.nome === nome)?.aceso;

/**
 * Duas células com médias diferentes e repetições iguais: é o contexto "são" de
 * base, em que nenhum sinal deve acender. Cada caso de acender parte dele e
 * quebra UMA coisa.
 */
const SAO = () => [
  batalha({ celula: 'a-l25', media: 1 }), batalha({ celula: 'a-l25', media: 1.1 }),
  batalha({ celula: 'b-l25', media: 5 }), batalha({ celula: 'b-l25', media: 5.1 }),
];

console.log('\n· o contexto são não acende nada');
{
  const v = conferirSinais(ctxDe(SAO()));
  ok(v.length === SINAIS.length, `os ${SINAIS.length} sinais foram conferidos (deu ${v.length})`);
  const acesos = v.filter((x) => x.aceso).map((x) => x.nome);
  ok(!acesos.length, `nenhum acende numa bateria sadia${acesos.length ? `: ${acesos.join(', ')}` : ''}`);
  ok(v.every((x) => x.texto && x.nota), 'todos trazem texto de aceso E nota de apagado');
}

console.log('\n· cada sinal acende quando deve');

// 1 · invariantes
ok(acendeu('invariantes', ctxDe(SAO(), { invalidas: [batalha()] })),
  'invariantes: acende com uma batalha inválida');
ok(!acendeu('invariantes', ctxDe(SAO())), 'e não acende sem nenhuma');

// 2 · reprojetar
ok(acendeu('ocasião · reprojetar',
  ctxDe(SAO().map((l) => ({ ...l, paradasSub: { ...l.paradasSub, reprojetar: 0 } })))),
  'reprojetar: acende com zero re-projeções nas células com distância');
ok(!acendeu('ocasião · reprojetar',
  ctxDe(SAO().map((l) => ({ ...l, paradasSub: { ...l.paradasSub, reprojetar: 0 } })), { dist: 1 })),
  'e NÃO acende se nenhuma célula tem distância (ali o zero é legítimo)');

// 3 · fugir
ok(acendeu('ocasião · fugir',
  ctxDe(SAO().map((l) => ({ ...l, paradasSub: { ...l.paradasSub, fugir: 0 } })))),
  'fugir: acende com zero declarações de fuga');

// 4 · redirecionar
ok(acendeu('ocasião · redirecionar',
  ctxDe(SAO().map((l) => ({ ...l, paradasSub: { ...l.paradasSub, redirecionar: 0 } })))),
  'redirecionar: acende com zero golpes redirecionados');

// 5 · raspão
ok(acendeu('ocasião · raspão',
  ctxDe(SAO().map((l) => ({ ...l, vereditos: { ...l.vereditos, raspao: 0 } })))),
  'raspão: acende sem nenhum raspão na bateria');

// 6 · a quarta célula do quadro
ok(acendeu('ocasião · quarta célula do quadro',
  ctxDe(SAO().map((l) => ({ ...l, quadro: { ...l.quadro, soResolveu: 0 } })))),
  'quarta célula: acende quando `só resolveu` nunca acontece');

// 7 · o passo, que guarda o piso da §2.4
{
  // `log.andou` desconectado: o Tick morto vira igual ao Tick sem parada.
  const mudo = SAO().map((l) => ({ ...l, ticksMortos: l.quadro.nada + l.quadro.soResolveu }));
  ok(acendeu('ocasião · passo', ctxDe(mudo)),
    'passo: acende quando o Tick morto é igual ao Tick sem parada em TODA batalha');
  ok(!acendeu('ocasião · passo', ctxDe(SAO())),
    'e não acende quando o Tick morto é menor (alguém andou)');
  // E o zero legítimo: na cena encostada ninguém anda, e os dois são iguais por
  // direito. O filtro de distância é o que separa os dois zeros.
  ok(!acendeu('ocasião · passo', ctxDe(mudo, { dist: 1 })),
    'e NÃO acende na cena encostada, onde os dois são iguais por direito');
}

// 8 · variância
{
  // Repetições espalhadas e células idênticas: o acaso explica mais que os eixos.
  const ruido = [
    batalha({ celula: 'a-l25', media: 0 }), batalha({ celula: 'a-l25', media: 10 }),
    batalha({ celula: 'b-l25', media: 0 }), batalha({ celula: 'b-l25', media: 10 }),
  ];
  ok(acendeu('variância', ctxDe(ruido)),
    'variância: acende quando a variância dentro da célula ≥ a de entre células');
  ok(!acendeu('variância', ctxDe(SAO())), 'e não acende quando os eixos separam');
}

// 9 · teto
ok(acendeu('teto', ctxDe(SAO().map((l) => ({ ...l, fim: 'estourou' })))),
  'teto: acende quando TODAS as células estouram');
ok(!acendeu('teto', ctxDe([...SAO().map((l) => ({ ...l, fim: 'estourou' })), batalha({ celula: 'c-l25' })])),
  'e não acende se uma célula termina');

// 10 · distribuição
ok(acendeu('distribuição', ctxDe([
  batalha({ celula: 'a-l25', media: 1, p10: 2, p90: 2 }),
  batalha({ celula: 'a-l25', media: 1.1, p10: 2, p90: 2 }),
  batalha({ celula: 'b-l25', media: 5 }), batalha({ celula: 'b-l25', media: 5.1 }),
])), 'distribuição: acende com p10 = p90 numa célula');
ok(!acendeu('distribuição', ctxDe(SAO())), 'e não acende com p10 ≠ p90');

// 11 · fuga-consumada
ok(acendeu('fuga-consumada', ctxDe(SAO().map((l) => ({ ...l, fim: 'fuga-consumada' })))),
  'fuga-consumada: acende acima de 90% numa célula');
{
  // 50% não é acima de 90%: a fronteira precisa valer.
  const meio = SAO().map((l, i) => ({ ...l, fim: i % 2 ? 'fuga-consumada' : 'morte' }));
  ok(!acendeu('fuga-consumada', ctxDe(meio)), 'e não acende com metade das voltas');
}

console.log(falhas.length
  ? `\n✘ sinais: ${falhas.length} falha(s)`
  : `\n✓ Sinais OK · os ${SINAIS.length} alarmes acendem quando devem e calam quando não devem`);
process.exit(falhas.length ? 1 : 0);
