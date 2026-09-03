// dano-por-tipo.mjs · quanto a troca do modo principal mexe no dano por golpe.
//
// POR QUE ELE EXISTE. Em 03/09 o `resumoCombatePC` passou a ler o `principal`
// do catálogo em vez do primeiro modo da ordem de exibição. O conserto parece de
// vitrine (a sigla da expressão) e não é: a sigla escolhe a CATEGORIA DE
// ABSORÇÃO do alvo, e as três categorias não valem a mesma coisa.
//
//   Impacto    · Absorção natural = Vigor, mais Centelha, mais a armadura;
//   Corte      · Absorção natural = zero. Só Centelha e armadura;
//   Perfurante · idem, e mais o gate de Perfuração (que hoje nenhum caminho de
//                produção chama, ver o fim da saída).
//
// Ou seja: uma arma que saía como Impacto e passa a sair como Corte bate contra
// uma Absorção MENOR, e o dano sobe na mesa em que o jogo é jogado. Isto não é
// conserto de exibição, é mudança de equilíbrio, e mudança de equilíbrio que
// ninguém mediu é mudança de equilíbrio que ninguém sabe o tamanho.
//
// O QUE ELE MEDE. Dano líquido MÉDIO POR GOLPE QUE ACERTA, exato e não
// simulado: a distribuição de `Nd6 + fixo` é enumerada, e a média sai de
// E[max(0, D − Absorção)]. O acerto não entra na conta porque a troca de modo
// não mexe no acerto (a expressão de ataque é a mesma).
//
//   node scripts/dano-por-tipo.mjs
import { carregarLib, ligar, RAIZ } from './sim/lib-ponte.mjs';
import { FICHAS } from './sim/elenco.mjs';
import ARMAS from '../src/data/armas.json' with { type: 'json' };
import REGRAS from '../src/data/regras.json' with { type: 'json' };
import BASE from './fixtures/kael.json' with { type: 'json' };

const L = await carregarLib();
ligar(L);

const MODO_ORDEM = { impacto: 0, corte: 1, perfurante: 2 };
const CAT = { corte: 'corte', perfurante: 'perfuracao', impacto: 'impacto' };
const NOME = { corte: 'Corte', perfurante: 'Perfuração', impacto: 'Impacto' };

const CATALOGO = Array.isArray(ARMAS) ? ARMAS : (ARMAS.armas || Object.values(ARMAS).find(Array.isArray));

/** A distribuição de `Nd6 + fixo`, enumerada. Devolve [valor, probabilidade]. */
function distribuicao(nDados, fixo) {
  let d = new Map([[fixo, 1]]);
  for (let i = 0; i < nDados; i += 1) {
    const n = new Map();
    for (const [v, p] of d) for (let f = 1; f <= 6; f += 1) n.set(v + f, (n.get(v + f) || 0) + p / 6);
    d = n;
  }
  return [...d];
}

/** O dano líquido médio de um golpe que acerta, contra uma Absorção. */
const medioLiquido = (dist, soak) =>
  dist.reduce((s, [v, p]) => s + p * Math.max(0, Math.max(0, v) - soak), 0);

/** Lê `3d6 +2 (C)` e devolve os dados e o fixo. */
function lerExpr(e) {
  const m = /(\d+)d6\s*([+−-]\s*\d+)?/.exec(e || '');
  if (!m) return null;
  const fixo = m[2] ? parseInt(m[2].replace(/\s/g, '').replace('−', '-'), 10) : 0;
  return { dados: parseInt(m[1], 10), fixo };
}

// ------------------------------------------------------------- OS ALVOS
//
// Os dois arquétipos do elenco da bateria, que são as âncoras contra as quais
// tudo nesta frente foi medido, mais o alvo NU: sem armadura, a diferença entre
// as categorias é só a Absorção natural, e é ali que a troca de modo aparece
// limpa.
function alvoDe(nome, ficha) {
  const r = L.resumoCombatePC(ficha);
  return { nome, soak: r.soak, vigor: ficha.attrs?.vigor ?? 0 };
}
const NU = { ...BASE, equip: { armaduras: [] }, conjuntos: [{ ativo: true, habil: { ref: 'nada' }, inabil: { ref: 'nada' } }] };
const ALVOS = [
  alvoDe('nu (sem armadura)', NU),
  alvoDe('Escudeiro (malha)', FICHAS.escudeiro.ficha),
  alvoDe('Montanteiro (placa)', FICHAS.montanteiro.ficha),
];

console.log('\n══ A TROCA DE MODO PRINCIPAL, em dano líquido médio por golpe que ACERTA ══\n');
console.log('  Absorções dos alvos (impacto / corte / perfuração):');
for (const a of ALVOS) {
  console.log(`    ${a.nome.padEnd(22)} ${a.soak.impacto} / ${a.soak.corte} / ${a.soak.perfuracao}`
    + `   (Vigor ${a.vigor})`);
}

// -------------------------------------------------- AS ARMAS QUE MUDARAM
//
// Uma arma mudou de lado quando o `principal` do catálogo não é o primeiro modo
// da ordem de exibição, que era o que o código lia antes.
const mudaram = [];
for (const w of CATALOGO) {
  const modos = (w.modos || []).slice().sort((a, b) => (MODO_ORDEM[a.tipo] ?? 9) - (MODO_ORDEM[b.tipo] ?? 9));
  if (modos.length < 2) continue;
  const antes = modos[0].tipo;
  const depois = (modos.find((m) => m.principal) || modos[0]).tipo;
  if (antes === depois) continue;
  const nPrin = modos.filter((m) => m.principal).length;
  mudaram.push({ w, antes, depois, nPrin });
}

console.log(`\n  ${mudaram.length} armas trocaram de categoria de Absorção:\n`);
const linhas = [];
for (const { w, antes, depois, nPrin } of mudaram) {
  const ficha = {
    ...BASE,
    attrs: { ...BASE.attrs, forca: 5, vigor: 5 },
    conjuntos: [{ ativo: true, habil: { ref: `a:${w.id}` }, inabil: { ref: 'nada' } }],
    equip: { armaduras: [] },
  };
  const r = L.resumoCombatePC(ficha);
  const e = lerExpr(r.dano);
  if (!e) { console.log(`  ${w.nome}: expressão ilegível (${r.dano})`); continue; }
  const dist = distribuicao(e.dados, e.fixo);
  console.log(`  ${(w.nome || w.id)} · ${r.dano}  ·  ${NOME[antes]} → ${NOME[depois]}`
    + (nPrin > 1 ? `   ⚑ ${nPrin} modos marcados principal` : ''));
  console.log('    alvo'.padEnd(28) + 'antes   depois     Δ      Δ%');
  for (const a of ALVOS) {
    const mAntes = medioLiquido(dist, a.soak[CAT[antes]]);
    const mDep = medioLiquido(dist, a.soak[CAT[depois]]);
    const d = mDep - mAntes;
    const pc = mAntes > 0 ? (d / mAntes) * 100 : null;
    linhas.push({ arma: w.nome || w.id, alvo: a.nome, antes: mAntes, depois: mDep, d });
    console.log(`      ${a.nome}`.padEnd(28) + mAntes.toFixed(2).padStart(6)
      + mDep.toFixed(2).padStart(8) + ((d >= 0 ? '+' : '') + d.toFixed(2)).padStart(7)
      + (pc == null ? '     ·' : ((pc >= 0 ? '+' : '') + pc.toFixed(0) + '%').padStart(8)));
  }
  console.log('');
}

// ------------------------------------------------------------- O SALDO
const sobe = linhas.filter((l) => l.d > 0.005);
const desce = linhas.filter((l) => l.d < -0.005);
const igual = linhas.length - sobe.length - desce.length;
const medio = (a) => (a.length ? a.reduce((s, l) => s + l.d, 0) / a.length : 0);
console.log('── O SALDO ──');
console.log(`  ${sobe.length} pares arma×alvo em que o dano SOBE (média +${medio(sobe).toFixed(2)} por golpe)`);
console.log(`  ${desce.length} em que DESCE (média ${medio(desce).toFixed(2)})`);
console.log(`  ${igual} sem diferença (as duas categorias têm a mesma Absorção neste alvo)`);

// ----------------------------------------------------- O GATE DE PERFURAÇÃO
//
// A segunda metade da pergunta: a Adaga vira Perfurante e entra no gate, que
// zera o dano quando o Nível de Perfuração da arma é menor que a Resistência à
// Perfuração do alvo. Só que o gate é REGRA ESCRITA E CÓDIGO NÃO CHAMADO.
console.log('\n── O GATE DE PERFURAÇÃO ──');
console.log(`  A régua tem o gate (regras.dano.gatePerfuracao, modos: ${
  (REGRAS.dano.gatePerfuracao?.modos || []).join(', ')}).`);
console.log('  `gatePerfuracaoAbre` existe em src/lib/calc.ts e NENHUM caminho de produção');
console.log('  a chama: nem `resolverGolpe`, nem a folha do Grid, nem o harness. Hoje o');
console.log('  Perfurante não resvala em ninguém, e a Adaga virando Perfurante NÃO zera');
console.log('  dano nenhum. O risco é real na régua e nulo no motor, e vira real no dia');
console.log('  em que alguém ligar o gate: aí a Adaga passa a resvalar em tudo que tiver');
console.log('  Resistência à Perfuração acima do Nível dela.');
const adaga = CATALOGO.find((w) => w.id === 'adaga');
const perfAdaga = (adaga?.modos || []).find((m) => m.tipo === 'perfurante')?.perf ?? adaga?.pen ?? null;
console.log(`  Nível de Perfuração da Adaga: ${perfAdaga ?? '(não declarado)'}.`);
const porte = REGRAS.dano.couracaPorte || {};
const resvala = Object.entries(porte)
  .filter(([, v]) => v && typeof v === 'object' && (v.resistPerf ?? 0) > (perfAdaga ?? 0))
  .map(([k, v]) => `${k} (R.Perf ${v.resistPerf})`);
console.log(`  Portes em que ela resvalaria com o gate ligado: ${resvala.length ? resvala.join(', ') : 'nenhum'}.`);
console.log(`\n  (régua de ${RAIZ.split(/[\\/]/).slice(-1)[0]})`);
