// test-formas.mjs · o campo `transforma` de quem muda de forma (D-201; manual §5.2, item 1).
//
// O QUE ISTO GUARDA. A ficha diz as formas numa linha da Identidade ("forma híbrida (esta
// ficha) · forma humana · forma de lobo"), e o conversor grava na fonte o objeto que o site
// vai usar para alternar entre elas. A leitura mora em `formasDaFicha` (lib-ficha-v3.mjs),
// e este teste a cobra com textos escritos aqui: nenhuma ficha de criatura que muda de forma
// está em fichas-v3 ainda. Cobra também o esquema, que recusa `principal` diferente da
// primeira forma e lista com uma forma só.
//
//   node scripts/test-formas.mjs
import { formasDaFicha, idDaForma } from './lib-ficha-v3.mjs';
import { criaturaSchema } from './criatura-schema.mjs';

const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const erro = (fn) => { try { fn(); return null; } catch (e) { return e.message; } };
const VARIANTES = ['forma humana', 'forma de lobo', 'Adulto'];

console.log('· o caso certo');
const certo = formasDaFicha('**forma híbrida (esta ficha) · forma humana · forma de lobo**', VARIANTES);
const esperado = {
  principal: 'hibrida',
  formas: [
    { id: 'hibrida', nome: 'forma híbrida' },
    { id: 'humana', nome: 'forma humana' },
    { id: 'lobo', nome: 'forma de lobo' },
  ],
};
ok(JSON.stringify(certo) === JSON.stringify(esperado), `o objeto, campo a campo: ${JSON.stringify(certo)}`);
ok(formasDaFicha('forma híbrida (esta ficha) · forma humana', VARIANTES).formas.length === 2, 'sem `**` em volta, e com duas formas');

console.log('· o id');
ok(idDaForma('forma de névoa') === 'nevoa', `"forma de névoa" dá "${idDaForma('forma de névoa')}"`);
ok(idDaForma('forma de lobo atroz') === 'lobo-atroz', `"forma de lobo atroz" dá "${idDaForma('forma de lobo atroz')}"`);
ok(idDaForma('Forma Dos Ratos') === 'ratos', `"Forma Dos Ratos" dá "${idDaForma('Forma Dos Ratos')}" (palavra inteira, sem caixa)`);
ok(idDaForma('forma dama') === 'dama', `"forma dama" dá "${idDaForma('forma dama')}" ("da" só como palavra inteira)`);

console.log('· os quatro erros');
const e1 = erro(() => formasDaFicha('forma híbrida (esta ficha)', VARIANTES));
ok(/uma forma só/.test(e1 || ''), `uma forma só: ${e1}`);
const e2 = erro(() => formasDaFicha('forma híbrida · forma humana', VARIANTES));
ok(/primeira forma não termina em "\(esta ficha\)"/.test(e2 || ''), `a primeira sem "(esta ficha)": ${e2}`);
const e2b = erro(() => formasDaFicha('forma híbrida (esta ficha) · forma humana (esta ficha)', VARIANTES));
ok(/só a primeira forma leva/.test(e2b || ''), `outra com "(esta ficha)": ${e2b}`);
const e3 = erro(() => formasDaFicha('forma híbrida (esta ficha) · forma de rato', VARIANTES));
ok(/"forma de rato" não tem a linha de mesmo nome em Variantes/.test(e3 || ''), `forma sem linha em Variantes: ${e3}`);
const e3b = erro(() => formasDaFicha('forma híbrida (esta ficha) · Forma humana', VARIANTES));
ok(/não tem a linha de mesmo nome/.test(e3b || ''), `o nome tem de ser igual letra por letra ("Forma humana" contra "forma humana"): ${e3b}`);
const e4 = erro(() => formasDaFicha('forma de lobo (esta ficha) · forma do lobo', ['forma do lobo']));
ok(/dois ids iguais \("lobo"\)/.test(e4 || ''), `dois ids iguais: ${e4}`);

console.log('· o esquema');
const campo = (t) => criaturaSchema.shape.transforma.safeParse(t).success;
ok(campo(esperado), 'aceita o objeto certo');
ok(!campo({ ...esperado, principal: 'humana' }), 'recusa `principal` que não é o id da primeira forma');
ok(!campo({ principal: 'hibrida', formas: [esperado.formas[0]] }), 'recusa uma forma só');
ok(!campo({ ...esperado, formas: [...esperado.formas.slice(0, 2), { id: '', nome: 'x' }] }), 'recusa id vazio');
ok(criaturaSchema.shape.transforma.safeParse(undefined).success, 'ausente é aceito (quem não muda de forma não leva o campo)');

if (falhas.length) { console.error(`\n✘ formas: ${falhas.length} falha(s)`); process.exit(1); }
console.log('\n✓ formas: o campo transforma sai da linha Formas, com os quatro erros e o esquema conferidos');
