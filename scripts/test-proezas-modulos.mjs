// O Fôlego saiu do sistema (D-016, 03/10/2026). Em 25/11/2026 (D16, consulta 014) saíram do dado as nove Técnicas da Coração
// Incansável que dependiam dele e o campo `folego` das armas; no mesmo dia (T18, 075 do coordenador) o Caminho ganhou nove
// Técnicas novas, sobre o Desgaste, com os MESMOS nove ids (a ficha salva que tinha um deles volta a ter a Técnica). Este teste
// garante a escada nova, a conta de XP, que nenhuma outra Técnica sumiu, que nenhuma Técnica pede uma id que não existe, que nenhum
// campo `modulo` sobrou e que nenhuma arma volta a trazer `folego`. A ficha salva com id removida é provada no navegador, em
// test-ficha-item-inteiro.mjs.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const tecnicas = JSON.parse(fs.readFileSync(new URL('../src/data/tecnicas.json', import.meta.url), 'utf8'));
const armas = JSON.parse(fs.readFileSync(new URL('../src/data/armas.json', import.meta.url), 'utf8'));
const caminhos = JSON.parse(fs.readFileSync(new URL('../src/data/caminhos.json', import.meta.url), 'utf8'));
const ids = new Set(tecnicas.map((t) => t.id));
assert.equal(tecnicas.length, 461, '452 Técnicas depois do D16 mais as nove novas da Coração Incansável');
assert.ok(!tecnicas.some((t) => 'modulo' in t), 'nenhuma Técnica traz o campo modulo');
for (const t of tecnicas) for (const p of t.prereq || []) assert.ok(ids.has(p), `pré-requisito que não existe: ${t.id} pede ${p}`);
for (const id of ['segundo-folego', 'corpo-inospito', 'aclimatacao', 'caca-implacavel']) assert.ok(ids.has(id), `atividade física preservada: ${id}`);
assert.ok(!/"folego"\s*:/.test(JSON.stringify(armas)), 'nenhuma arma traz o campo folego');

// A escada da Coração Incansável (T18): o molde é a Carne Teimosa (3, 1, 2, 1, 1, 1 por nível; 2 passivas, 3 reflexivas, 4 ativas)
const CI = tecnicas.filter((t) => t.caminho === 'coracao-incansavel');
const porId = Object.fromEntries(CI.map((t) => [t.id, t]));
assert.equal(CI.length, 9, 'nove Técnicas na Coração Incansável');
const ESCADA = [
  ['folego-profundo', 1, 'passiva', {}, []], ['marcha-forcada', 1, 'reflexiva', { energia: 1 }, ['folego-profundo']], ['segundo-vento', 1, 'ativa', { energia: 1 }, ['folego-profundo']],
  ['folego-de-sobra', 2, 'reflexiva', { energia: 2 }, ['folego-profundo']],
  ['incansavel', 3, 'passiva', {}, ['folego-profundo']], ['pulmoes-de-ferro', 3, 'reflexiva', { energia: 3 }, ['marcha-forcada']],
  ['sem-limites', 4, 'ativa', { energia: 4 }, ['incansavel', 'pulmoes-de-ferro']], ['vigor-inesgotavel', 5, 'ativa', { energia: 5, vontade: 1 }, ['sem-limites']],
  ['coracao-eterno', 6, 'ativa', { energia: 6, vontade: 2 }, ['vigor-inesgotavel']],
];
for (const [id, nivel, tipo, custo, prereq] of ESCADA) {
  const t = porId[id];
  assert.ok(t, `falta ${id}`);
  assert.equal(t.nivel, nivel, `${id}: nível`); assert.equal(t.tipo, tipo, `${id}: tipo`);
  assert.deepEqual(t.custo, custo, `${id}: custo (Energia = nível nas ativas e reflexivas; +1 e +2 de Vontade nos níveis 5 e 6)`);
  assert.deepEqual(t.prereq, prereq, `${id}: pré-requisitos`);
  assert.ok(!t.pendente, `${id}: não é rascunho`);
}
const porNivel = [1, 2, 3, 4, 5, 6].map((n) => CI.filter((t) => t.nivel === n).length);
assert.deepEqual(porNivel, [3, 1, 2, 1, 1, 1], 'a mesma distribuição por nível da Carne Teimosa');
const xp = CI.reduce((s, t) => s + [10, 15, 20, 25, 30, 35][t.nivel - 1], 0);
assert.equal(xp, 175, 'o Caminho inteiro custa 175 XP (C15a: 10, 15, 20, 25, 30, 35 por nível)');
assert.equal(porId['folego-de-sobra'].texto, 'Quando um degrau de Desgaste ia entrar (ambiente, marcha ou sono), ele não entra até o fim da cena.', 'o texto aprovado do Fôlego de Sobra');
assert.ok(/a noite sem dormir desse período/.test(porId['vigor-inesgotavel'].texto), 'Vigor Inesgotável, "a noite sem dormir desse período", no singular');
// regra 1 do autor: as que ignoram degraus não somam, vale a maior (na de nível maior, no formato da D20)
assert.ok(/Substitui a Técnica Segundo Vento enquanto ativa: vale o maior número de degraus/.test(porId.incansavel.texto), 'Incansável substitui a Segundo Vento');
assert.ok(/Substitui as Técnicas Segundo Vento e Incansável enquanto ativas: vale o maior número de degraus/.test(porId['sem-limites'].texto), 'Sem Limites substitui as duas');
assert.ok(/Substitui as Técnicas Segundo Vento, Incansável e Sem Limites enquanto ativas: vale o maior número de degraus/.test(porId['vigor-inesgotavel'].texto), 'Vigor Inesgotável substitui as três');
// regra 2: "ignorar um degrau" é só a penalidade, e fica dito uma vez na nota do Caminho e na Segundo Vento
const cam = caminhos.find((c) => c.id === 'coracao-incansavel');
assert.ok(cam && /Ignorar um degrau/.test(cam.nota) && /teto de 4/.test(cam.nota) && /vale a maior/.test(cam.nota), 'a nota do Caminho diz o que é ignorar um degrau e que não somam');
assert.ok(/continua contando no teto de 4/.test(porId['segundo-vento'].texto), 'a Segundo Vento repete a regra na primeira Técnica que usa o verbo');
assert.ok(!cam.emRevisao, 'o Caminho não está marcado "em revisão" (o autor aprovou as nove)');
console.log('Proezas: a Coração Incansável tem as nove Técnicas novas sobre o Desgaste (175 XP); o D16 segue: nenhum módulo, nenhum folego nas armas, nenhum pré-requisito órfão.');
