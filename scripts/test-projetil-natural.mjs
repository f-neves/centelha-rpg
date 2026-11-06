// test-projetil-natural.mjs · D-315 (R36, 06/11/2026) no motor: "o projétil natural com alvo rola o maior entre Vigor,
// Destreza e Percepção + Atirador". O arqueiro, com arma, segue a Percepção.
//   node scripts/test-projetil-natural.mjs
import fs from 'node:fs';
import { carregarTS } from './lib-ts.mjs';
const M = await carregarTS('src/lib/motor.ts');

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const fonte = (id) => JSON.parse(fs.readFileSync(`src/data/bestiario/${id}.json`, 'utf8'));
const jogada = (c, nome) => M.criatura(c).ataques.find((a) => a.nome === nome).jogada;
const esperado = (c, atributo) => atributo + c.habilidades.atirador + M.centelhaNaJogada(c.centelha, c.habilidades.atirador) + (c.ataques.find((a) => a.habilidade === 'atirador').acerto ?? 0);

// O mephit: Destreza 4 contra Vigor 3 e Percepção 2. Pela Percepção, a jogada saía 2 abaixo.
const mephit = fonte('mephit');
// Desde a etapa c2 (06/11/2026) o Sopro elemental do mephit é cone e não tem jogada de ataque (R36: "Se o jato cobre uma
// área, não há jogada de ataque"), e o JSON não guarda a Habilidade dele. O teste devolve o Atirador ao sopro para
// medir a regra do projétil com alvo nos Atributos do mephit, como antes.
const sopro = mephit.ataques.find((a) => a.nome === 'Sopro elemental');
ok(sopro && sopro.habilidade === undefined, 'mephit: o Sopro elemental é de área, sem a Habilidade no JSON');
sopro.habilidade = 'atirador';
ok(jogada(mephit, 'Sopro elemental') === esperado(mephit, 4), `mephit, Sopro elemental: Destreza 4 (jogada ${jogada(mephit, 'Sopro elemental')}, esperado ${esperado(mephit, 4)})`);
ok(jogada(mephit, 'Sopro elemental') - esperado(mephit, 2) === 2, 'mephit: 2 a mais do que pela Percepção');

// O grande wyrm vermelho: Vigor 14, Destreza 2, Percepção 8 (os Atributos do lote r35-r54) sobre o mesmo ataque.
const wyrm = structuredClone(mephit);
wyrm.atributos = { ...wyrm.atributos, vigor: 14, destreza: 2, percepcao: 8 };
ok(jogada(wyrm, 'Sopro elemental') === esperado(wyrm, 14), 'Vigor 14 maior que Percepção 8: vale o Vigor');
ok(M.atributoDoProjetilNatural(wyrm.atributos) === 'vigor', 'o nome do Atributo que o card escreve é o Vigor');
ok(M.atributoDoProjetilNatural({ vigor: 1, destreza: 2, percepcao: 5 }) === 'percepcao', 'Percepção maior: vale a Percepção');

// Com arma, o tiro continua pela Percepção (o arqueiro segue o Atributo de sempre).
ok(M.atributoDaJogada('atirador', { percepcao: 1, destreza: 5, vigor: 6 }) === 1, 'com arma: Percepção 1, mesmo com Destreza 5 e Vigor 6');
ok(M.atributoDaJogada('atirador', { percepcao: 1, destreza: 5, vigor: 6 }, true) === 6, 'natural: o maior dos três, 6');
const arqueiro = fonte('arqueiro');
const comArco = arqueiro.ataques.find((a) => a.arma && M.ataqueDaArma(a.arma, arqueiro.atributos.forca ?? 0).habilidade === 'atirador');
if (comArco) {
  const r = M.criatura(arqueiro).ataques.find((a) => a.nome === comArco.nome);
  const hv = arqueiro.habilidades.atirador ?? 0;
  ok(r.jogada === arqueiro.atributos.percepcao + hv + M.centelhaNaJogada(arqueiro.centelha, hv) + r.acerto, `arqueiro, ${comArco.nome}: pela Percepção`);
} else ok(false, 'arqueiro sem ataque de arma pelo Atirador para conferir');

if (falhas.length) { console.error(`\n✘ projétil natural: ${falhas.length} falha(s)`); process.exit(1); }
console.log('\n✓ projétil natural: o maior entre Vigor, Destreza e Percepção; com arma, a Percepção');
