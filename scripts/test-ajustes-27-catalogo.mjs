// Decisão 36.1, 27/10/2026, e I2 do autor, 12/11/2026: a Glaive Serrilhada do catálogo virou a Glaive lisa, com os
// números da Alabarda (a classe Haste de Guerra) e sem a tag Sangramento. A glaive serrilhada do diabo barbado passa a
// ataque da própria ficha, com os mesmos números de antes e o Sangramento escrito nela.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const itens = JSON.parse(fs.readFileSync(process.env.CENTELHA_ARMAS_TESTE || new URL('../src/data/armas.json', import.meta.url), 'utf8'));
const alabarda = itens.find(x => x.id === 'alabarda');
const glaive = itens.find(x => x.id === 'glaive');
assert.ok(glaive, 'falta a Glaive no catálogo');
assert.ok(!itens.some(x => x.id === 'glaive-serrilhada'), 'o id glaive-serrilhada voltou ao catálogo (I2: agora é glaive)');
assert.equal(itens.filter(x => x.id === glaive.id).length, 1);
assert.equal(glaive.nome, 'Glaive');
assert.deepEqual(glaive.arma, alabarda.arma, 'a Glaive tem os números da Alabarda (Haste de Guerra)');
assert.deepEqual(glaive.tags, alabarda.tags);
assert.ok(!glaive.tags.includes('sangramento'), 'a Glaive perdeu a tag Sangramento (I2)');
assert.ok(!/serrilh|sangr/i.test(glaive.descricao), 'a descrição da Glaive não fala mais em serrilha nem em sangue');
assert.deepEqual(glaive.preco, alabarda.preco);
assert.equal(glaive.preco.pc, 280);
assert.equal(glaive.peso, alabarda.peso);
assert.equal(alabarda.arma.acerto, 0);
assert.ok(!alabarda.tags.includes('sangramento'));
const regras = JSON.parse(fs.readFileSync(new URL('../src/data/regras.json', import.meta.url), 'utf8'));
const classes = regras.combate.pgr.reforma.corpoACorpo;
assert.deepEqual(classes.filter(x => x.armas.includes(glaive.id)), classes.filter(x => x.armas.includes(alabarda.id)));
assert.ok(!classes.some(x => x.armas.includes('glaive-serrilhada')));
// a ficha salva com o id velho troca para o novo ao carregar
const migra = fs.readFileSync(new URL('../src/lib/ficha-migra.ts', import.meta.url), 'utf8');
assert.ok(migra.includes("['glaive-serrilhada', 'glaive']"), 'falta glaive-serrilhada → glaive em RENOMES_ARMA');
// o diabo barbado: ataque da própria ficha, números de antes, Sangramento escrito na ficha
const diabo = JSON.parse(fs.readFileSync(new URL('../src/data/bestiario/diabo-barbado.json', import.meta.url), 'utf8'));
const atq = diabo.ataques.find(a => a.nome === 'Glaive serrilhada');
assert.ok(atq && !atq.arma, 'a glaive do diabo barbado não aponta mais para o catálogo');
assert.deepEqual([atq.classe, atq.pgr, atq.dado, atq.multiplicadorForca, atq.tipoDano, atq.acerto], ['haste', [3, 1, 3], '1d6+2', 2, 'corte', -1]);
assert.ok(diabo.habilidadesEspeciais.some(h => h.ataque === 'Glaive serrilhada' && /Sangramento/.test(h.texto || '')), 'o Sangramento da glaive do diabo está escrito na ficha');
console.log('I2: a Glaive do catálogo, o id novo, a migração da ficha salva e a glaive serrilhada do diabo OK');
