// test-fraqueza-regeneracao.mjs · G5 (D-367, 07/11/2026): o campo da fraqueza da Regeneração, preparado para o lote da
// Bestiarista, e a lista fechada do vocabulário.
//
// O autor: "O 'atrasar' do tarrasque é a primeira forma da R47 (interrompe a regeneração por um tempo), com o tempo
// escrito na ficha (curto). O vocabulário das fraquezas vira lista fechada: prata, ferro frio, arma abençoada, fogo,
// ácido, luz do sol, e o que mais o Mestre quiser acrescentar." Hoje nenhuma ficha traz o campo (a fraqueza está só na
// prosa, e o conversor não lê prosa). Aqui, numa cópia do lobisomem com linhas plantadas, se prova que:
//   - "fraqueza: não se regenera; prata" vira { forma: 'naoRegenera', tipos: ['prata'] }, sem aviso;
//   - "fraqueza: interrompe; fogo, ácido; 6 Ticks" vira a primeira forma, com a duração;
//   - um nome fora da lista ("osso de santo") vira AVISO, e não parada (o Mestre pode acrescentar);
//   - interrompe sem tempo, e não se regenera com tempo, param o conversor;
//   - o esquema aceita o campo e recusa a forma sem a duração certa;
//   - a lista de regras.json é a do autor, e nenhuma ficha publicada usa o campo ainda.
//   node scripts/test-fraqueza-regeneracao.mjs
import fs from 'node:fs';
import { converterFichaAnteriorR03 as converterFicha } from './conversor-criatura.mjs';
// a ficha de exemplo é de antes da categoria dos poderes (R1): o esquema dela é o da conversão de antes, como no test-conversor
import { criaturaAnteriorR03Schema } from './criatura-schema.mjs';

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const J = JSON.stringify;
const LOBO = fs.readFileSync('scripts/fixtures/conversor/lobisomem.md', 'utf8');
const SITE = JSON.parse(fs.readFileSync('scripts/fixtures/conversor/lobisomem-site.json', 'utf8'));
const REGRAS = JSON.parse(fs.readFileSync('src/data/regras.json', 'utf8'));
const ANCORA = '## Sentidos';
if (!LOBO.includes(ANCORA)) throw new Error('a âncora das linhas plantadas não está na ficha');
const planta = (...linhas) => converterFicha(LOBO.replace(ANCORA, linhas.join('\n') + '\n\n' + ANCORA), { site: SITE });
const poder = (r, nome) => r.criatura.habilidadesEspeciais.find((h) => h.nome === nome);
const L = (nome, fr) => `- ${nome} · categoria: inato · fraqueza: ${fr} · sem regra ainda: fecha as feridas sozinho. **[formas: todas]**`;

ok(J(REGRAS.criatura?.fraquezasDaRegeneracao?.lista) === J(['prata', 'ferro frio', 'arma abençoada', 'fogo', 'ácido', 'luz do sol']), 'regras.json: a lista fechada do autor, na ordem');

const base = converterFicha(LOBO, { site: SITE });
ok(base.paradas.length === 0 && base.criatura.habilidadesEspeciais.every((h) => !h.fraqueza), 'a ficha sem as linhas plantadas não tem fraqueza (controle)');

const a = planta(L('Regeneração 3', 'não se regenera; prata'));
ok(a.paradas.length === 0 && J(poder(a, 'Regeneração 3')?.fraqueza) === J({ forma: 'naoRegenera', tipos: ['prata'] }), `não se regenera: ${J(poder(a, 'Regeneração 3')?.fraqueza)}`);
ok(!a.avisos.some((x) => /fora da lista fechada/.test(x)), 'prata está na lista: sem aviso');

const b = planta(L('Regeneração 4', 'interrompe; fogo, ácido; 6 Ticks'));
ok(b.paradas.length === 0 && J(poder(b, 'Regeneração 4')?.fraqueza) === J({ forma: 'interrompe', tipos: ['fogo', 'ácido'], duracao: '6 Ticks' }), `interrompe (o "atrasa" do tarrasque): ${J(poder(b, 'Regeneração 4')?.fraqueza)}`);

const c = planta(L('Regeneração 5', 'não se regenera; prata, osso de santo'));
ok(c.paradas.length === 0, 'nome fora da lista não para o conversor');
ok(c.avisos.some((x) => /"osso de santo" está fora da lista fechada/.test(x)) && !c.avisos.some((x) => /"prata" está fora/.test(x)), 'nome fora da lista vira aviso, só para ele');

const d = planta(L('Regeneração 6', 'interrompe; fogo'));
ok(d.paradas.some((x) => /interrompe pede o tempo/.test(x)), 'interrompe sem tempo para o conversor');
const e = planta(L('Regeneração 7', 'não se regenera; fogo; 1 hora'));
ok(e.paradas.some((x) => /não se regenera não tem tempo/.test(x)), 'não se regenera com tempo para o conversor');

const sem = structuredClone(b.criatura);
poder({ criatura: sem }, 'Regeneração 4').fraqueza = { forma: 'interrompe', tipos: ['fogo'] };
ok(criaturaAnteriorR03Schema.safeParse(b.criatura).success && !criaturaAnteriorR03Schema.safeParse(sem).success, 'o esquema aceita o campo e recusa interrompe sem duração');

// Desde o lote r-listas-07-11 da Bestiarista, 16 fichas trazem o campo, e todos os nomes estão na lista fechada (sem
// aviso). A fênix, o planetar e o solar ficam de fora até a resposta da Bestiarista ao autor.
const LISTA = new Set(REGRAS.criatura.fraquezasDaRegeneracao.lista);
const usam = fs.readdirSync('src/data/bestiario').map((f) => JSON.parse(fs.readFileSync('src/data/bestiario/' + f, 'utf8'))).filter((c) => c.habilidadesEspeciais.some((h) => h.fraqueza));
const ESPERADAS = ['diabo-barbado', 'diabo-chifrudo', 'diabo-do-fosso-pit-fiend', 'diabrete-imp', 'hidra-5-cabecas', 'kyton', 'lemure', 'linnorm-do-gelo', 'linnorm-dos-lagos', 'linnorm-dos-penhascos', 'marilith', 'ogro-mago-oni', 'quasit', 'tarrasque', 'trol', 'vampiro'];
ok(J(usam.map((c) => c.id).sort()) === J(ESPERADAS), `as 16 fichas do lote trazem o campo (${usam.length})`);
ok(usam.every((c) => c.habilidadesEspeciais.filter((h) => h.fraqueza).every((h) => h.fraqueza.tipos.every((t) => LISTA.has(t)))), 'todos os tipos estão na lista fechada');
const tarr = usam.find((c) => c.id === 'tarrasque')?.habilidadesEspeciais.find((h) => h.fraqueza)?.fraqueza;
ok(J(tarr) === J({ forma: 'interrompe', tipos: ['fogo', 'ácido'], duracao: '6 Ticks' }), `o tarrasque: o atrasar é a primeira forma, com 6 Ticks (G5): ${J(tarr)}`);
ok(['fenix', 'planetar', 'solar'].every((id) => JSON.parse(fs.readFileSync(`src/data/bestiario/${id}.json`, 'utf8')).habilidadesEspeciais.every((h) => !h.fraqueza)), 'fênix, planetar e solar seguem como estavam (segurados)');

if (falhas.length) { console.error(`✘ test-fraqueza-regeneracao: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ test-fraqueza-regeneracao · o campo da fraqueza nas duas formas da R47, com a lista fechada e o aviso (G5, D-367)');
