// test-antecedente-gratis.mjs · Antecedente não custa XP (T24, 26/11/2026: "Não custa XP"; alcance: "Nenhum custa XP",
// os 14 Antecedentes, o Artefato inclusive; o Mestre concede e ajusta o nível pela história e pela ficha).
//
// Antes, `regras.json` `xp.antecedente` era `acum` a ×3 por ponto (3·6·9·12·15·18, acumulado 63 no nível 6). Agora é `gratis`,
// como a Centelha, e o motor devolve 0 (`custoPontos`, `precoNivel`, src/lib/motor.ts). A ficha (`recompute`,
// ficha-engine.ts) soma `custoPontos('antecedente', ...)` para os Únicos e os Nomeados; com 0, o gasto da ficha é o da ficha
// sem eles. Prova aqui, sem DOM: o tipo, o custo 0 em todo nível, o custo de quem continua pagando (controle), a conta
// do custo antigo (controle negativo: o teste vê a diferença) e que o texto do livro e da ficha não promete mais o ×3 nem o
// crédito de XP.
//   node scripts/test-antecedente-gratis.mjs
import fs from 'node:fs';
import { carregarTS } from './lib-ts.mjs';
const M = await carregarTS('src/lib/motor.ts');
const regras = JSON.parse(fs.readFileSync('src/data/regras.json', 'utf8'));
const lê = (p) => fs.readFileSync(p, 'utf8');

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };

const a = regras.xp.antecedente;
ok(a && a.tipo === 'gratis' && a.mult === 0 && a.base === 0 && a.piso === 0, `regras.json xp.antecedente é gratis (${JSON.stringify({ tipo: a?.tipo, base: a?.base, mult: a?.mult, piso: a?.piso })})`);
ok(regras.xp.centelha.tipo === 'gratis', 'a Centelha continua gratis (o molde que o Antecedente copiou)');

// custo 0 em qualquer nível, de qualquer ponto de partida
const custos = [];
for (let n = 0; n <= 6; n++) custos.push(M.custoPontos('antecedente', undefined, n), M.precoNivel('antecedente', n));
ok(custos.every((c) => c === 0), `custoPontos e precoNivel do Antecedente são 0 do nível 0 ao 6 (${custos.join(' ')})`);
ok(M.custoPontos('antecedente', 2, 6) === 0 && M.custoPontos('antecedente', 0, 6) === 0, 'de 2 a 6 e de 0 a 6, nenhum custo');

// CONTROLE: o motor cobra de quem continua pagando (o teste não passa por "tudo é 0")
ok(M.custoPontos('atributo', 1, 2) > 0 && M.custoPontos('habilidadeSecundaria', 0, 1) > 0, 'controle: Atributo e Habilidade secundária continuam custando XP');

// CONTROLE NEGATIVO: a conta do custo antigo (acum, ×3) daria 63 no nível 6 e 9 de 2 a 3; este teste enxergaria a diferença
const antigo = (de, ate) => { let c = 0; for (let v = de + 1; v <= ate; v++) c += 3 * v; return c; };
ok(antigo(0, 6) === 63 && antigo(2, 3) === 9 && antigo(0, 6) !== M.custoPontos('antecedente', 0, 6), 'controle negativo: o ×3 antigo daria 63 no nível 6 (e 9 de 2 a 3), e o motor dá 0');

// o gasto de uma ficha com Antecedentes é o da ficha sem eles (a mesma soma que o recompute faz)
const fichaSem = { ante: {}, anteNom: {} };
const fichaCom = { ante: { recursos: 6, mentor: 4 }, anteNom: { aliados: [{ v: 6 }, { v: 3 }], reputacao: [{ v: 5 }] } };
const gasto = (S) => {
  let xan = 0;
  for (const v of Object.values(S.ante)) xan += M.custoPontos('antecedente', undefined, v || 0);
  for (const l of Object.values(S.anteNom)) for (const i of l) xan += M.custoPontos('antecedente', undefined, i.v || 0);
  return xan;
};
ok(gasto(fichaCom) === 0 && gasto(fichaCom) === gasto(fichaSem), `uma ficha com Antecedentes 6, 4, 6, 3 e 5 gasta ${gasto(fichaCom)} XP neles, igual à ficha sem eles (antes: ${antigo(0, 6) + antigo(0, 4) + antigo(0, 6) + antigo(0, 3) + antigo(0, 5)})`);

// o texto: nem o livro, nem a ficha, prometem o ×3 por ponto ou o XP que volta como crédito
const textos = {
  'antecedentes.md': lê('src/content/chapters/antecedentes.md'),
  'criacao-de-personagem.md': lê('src/content/chapters/criacao-de-personagem.md'),
  'FichaSkeleton.astro': lê('src/components/FichaSkeleton.astro'),
  'antecedentes.json': lê('src/data/antecedentes.json'),
};
for (const [nome, t] of Object.entries(textos)) {
  ok(!/volta como crédito/i.test(t) && !/×\s*3 por ponto/.test(t) && !/tudo por XP/i.test(t), `${nome}: sem "×3 por ponto", sem "tudo por XP" e sem "volta como crédito"`);
}
ok(/Antecedente \| \*\*grátis\*\*/.test(textos['criacao-de-personagem.md']), 'a tabela de custos de XP do capítulo de criação diz "Antecedente | grátis"');
ok(/não custa XP/i.test(textos['antecedentes.md']), 'o capítulo de Antecedentes diz que não custa XP');

if (falhas.length) { console.error(`✘ test-antecedente-gratis: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-antecedente-gratis · Antecedente não custa XP: o tipo é gratis, o custo é 0 do nível 0 ao 6, a ficha com Antecedentes gasta o mesmo que sem eles, e o texto não promete o ×3 nem o crédito');
