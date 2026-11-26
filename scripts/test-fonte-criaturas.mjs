// test-fonte-criaturas.mjs · a FONTE ÚNICA das criaturas (src/data/bestiario, B3) contra o fixture do motor (Etapa 2.2 do PLANO-25-26).
//
//   node scripts/test-fonte-criaturas.mjs
//
// Antes, o test-motor.mjs comparava o fixture com a própria entrada: nenhum teste olhava o site, e um número mudado num JSON passava
// verde. Agora, dois passos:
//  1. a entrada do fixture (o que o motor lê) tem de ser IGUAL, em profundidade, ao que o JSON do site diz, criatura por criatura, e
//     toda criatura do site tem de ter entrada no fixture (e vice-versa);
//  2. o motor roda sobre a entrada do SITE (o test-motor.mjs, com BESTIARIO_FIXTURE apontando um fixture com a entrada trocada) e tem
//     de dar o `esperado` do fixture, que é a conferência independente (a Bestiarista, depois a Revisora): ele só muda com a
//     conferência dela (scripts/mostra-esperado-fonte.mjs mostra a diferença; o commit diz "esperado conferido por <quem>").
// Controles negativos, numa cópia em os.tmpdir(): um número mudado num JSON deixa o passo 1 e o passo 2 vermelhos, apontando a
// criatura e o campo; uma criatura nova sem esperado e um JSON que sumiu também.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { RAIZ, lerFixture, lerSite, compararComFixture, fixtureComSite, PASTA_SITE } from './lib-fonte-criaturas.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fonte-criaturas-'));
let n = 0;
const ok = (c, m) => { n++; assert.ok(c, m); };
const fix = lerFixture();
const motorSobre = (fixture, nome) => {
  const arq = path.join(tmp, nome + '.json');
  fs.writeFileSync(arq, JSON.stringify(fixture));
  return spawnSync('node', ['scripts/test-motor.mjs'], { cwd: RAIZ, encoding: 'utf8', env: { ...process.env, BESTIARIO_FIXTURE: arq } });
};

// ---- o site de verdade
const site = lerSite();
const cmp = compararComFixture(site, fix);
ok(cmp.semEsperado.length === 0, 'toda criatura do site tem entrada no fixture: ' + cmp.semEsperado.join(', '));
ok(cmp.semSite.length === 0, 'toda criatura do fixture tem JSON no site: ' + cmp.semSite.join(', '));
ok(Object.keys(site).length === Object.keys(fix.criaturas).length, `o site e o fixture têm as mesmas criaturas (${Object.keys(site).length})`);
ok(cmp.diferencas.length === 0, 'a entrada do fixture é a do site em toda criatura; diferem: ' + cmp.diferencas.slice(0, 5).map((d) => `${d.id} ${d.caminho}`).join('; ') + ' (rode node scripts/mostra-esperado-fonte.mjs)');
const real = motorSobre(fixtureComSite(site, fix), 'real');
ok(real.status === 0, 'o motor, sobre a entrada do SITE, dá o esperado do fixture em toda criatura:\n' + (real.stdout + real.stderr).slice(-600));

// ---- controles negativos, numa cópia do site
const copia = (nome, muda) => {
  const p = path.join(tmp, nome); fs.mkdirSync(p);
  for (const f of fs.readdirSync(PASTA_SITE)) fs.copyFileSync(path.join(PASTA_SITE, f), path.join(p, f));
  muda(p);
  return lerSite(p);
};
const edita = (p, id, f) => { const a = path.join(p, id + '.json'); const c = JSON.parse(fs.readFileSync(a, 'utf8')); f(c); fs.writeFileSync(a, JSON.stringify(c, null, 2) + '\n'); };

// 1. um número mudado: o Vigor do lobo
const s1 = copia('numero', (p) => edita(p, 'lobo', (c) => { c.atributos.vigor += 1; }));
const c1 = compararComFixture(s1, fix);
ok(c1.diferencas.length === 1 && c1.diferencas[0].id === 'lobo' && c1.diferencas[0].caminho === 'atributos.vigor', 'controle: o Vigor mudado no lobo acusa lobo e atributos.vigor (passo 1): ' + JSON.stringify(c1.diferencas));
const m1 = motorSobre(fixtureComSite(s1, fix), 'numero');
ok(m1.status !== 0 && /lobo/.test(m1.stdout + m1.stderr), 'controle: o motor sobre o lobo mudado diverge do esperado e nomeia o lobo (passo 2)');

// 2. um número de ataque mudado: o dado de uma Mordida
const s2 = copia('dado', (p) => edita(p, 'lobo', (c) => { c.ataques[0].dado = c.ataques[0].dado === '1d6' ? '2d6' : '1d6'; }));
const c2 = compararComFixture(s2, fix);
ok(c2.diferencas.some((d) => d.id === 'lobo' && /^ataques\.0\.dado$/.test(d.caminho)), 'controle: o dado do ataque mudado acusa lobo e ataques.0.dado');

// 3. criatura nova sem esperado, e JSON que some
const s3 = copia('nova', (p) => { fs.copyFileSync(path.join(p, 'lobo.json'), path.join(p, 'lobo-novo.json')); edita(p, 'lobo-novo', (c) => { c.id = 'lobo-novo'; }); });
ok(compararComFixture(s3, fix).semEsperado.join() === 'lobo-novo', 'controle: criatura nova sem entrada no fixture falha (semEsperado)');
const s4 = copia('some', (p) => fs.rmSync(path.join(p, 'lobo.json')));
ok(compararComFixture(s4, fix).semSite.join() === 'lobo', 'controle: JSON que sumiu do site falha (semSite)');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`✓ test-fonte-criaturas: ${Object.keys(site).length} criaturas, a entrada do fixture é a do site, o motor dá o esperado, e os controles negativos pegam número mudado, criatura nova e JSON sumido (${n} conferências)`);
