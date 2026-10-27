// test-bloqueio-arma.mjs · a arma que bloqueia soma UMA vez na Defesa do card (D-190, D-195).
//
// O QUE ISTO GUARDA. Desde a D-190 o Bloqueio da ficha v3 vem sem a arma, e o card soma o
// bônus da coluna "Bloqueia como arma" (`lib-ficha-v3.mjs`, `bonusDaArma`). Duas leituras
// erradas dão número plausível, e por isso são as que este teste cobra:
//   · somar os ataques em vez de pegar o maior: o tricerátops bloqueia com o MESMO chifre
//     nos dois ataques, e a Defesa dele iria de 7 para 8;
//   · "sim" sem número valer +1 por padrão: o enxame-de-caranguejos não apara (decisão 10
//     de 19/10), e a Defesa dele ficaria acima de 4.
// As fichas v3 moram fora do repositório, então o teste lê as fontes gravadas e chama a
// conta pura com as células escritas aqui.
//
//   node scripts/test-bloqueio-arma.mjs
import fs from 'node:fs';
import { vistaCriatura } from './lib-criatura-motor.mjs';
import path from 'node:path';
import { bonusDaArma, defesaComArma } from './lib-ficha-v3.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const v3 = (id) => vistaCriatura(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/bestiario', `${id}.json`), 'utf8'))).v3;
const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };

console.log('· as fontes gravadas');
const tri = v3('triceratops');
ok(tri.defesa === 7 && tri.bloqueioArma === 1, `tricerátops ("sim, +1" na Chifrada; "o mesmo chifre (+1)" na Investida): Defesa ${tri.defesa}, arma +${tri.bloqueioArma}`);
const enx = v3('enxame-de-caranguejos');
ok(enx.defesa === 4 && enx.bloqueioArma === undefined, `enxame-de-caranguejos ("sim (carapaça e pinça, D-100)", sem número): Defesa ${enx.defesa}, arma ${enx.bloqueioArma ?? 'nenhuma'}`);

console.log('· a conta, com as células escritas aqui');
const dois = bonusDaArma(['sim, +1', 'sim, +1']);
ok(dois === 1 && defesaComArma(tri, dois) === 7, `o tricerátops com DOIS "sim, +1": arma +${dois}, Defesa ${defesaComArma(tri, dois)} (a soma daria 8)`);
ok(bonusDaArma(['sim, +1', 'o mesmo chifre (+1)']) === 1, 'célula que não começa com "sim" não conta');
ok(bonusDaArma(['sim (carapaça e pinça, D-100)']) === 0, '"sim" sem número vale 0');
ok(bonusDaArma(['sim, Defesa +2']) === 2 && bonusDaArma(['sim (+1; a galhada, D-100)']) === 1, 'as formas "sim, Defesa +2" e "sim (+1; ...)"');

if (falhas.length) { console.error(`\n✘ bloqueio-arma: ${falhas.length} falha(s)`); process.exit(1); }
console.log('\n✓ bloqueio-arma: a arma soma uma vez (o maior), e "sim" sem número soma 0');
