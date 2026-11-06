// A categoria dos poderes de criatura (DECISOES-AUTOR R1, R4 e P3; livro: poderes-das-criaturas.md).
// Cada regra tem um caso feito para passar e um feito para falhar com a mensagem dela.
//   node scripts/test-poderes-criatura.mjs
import fs from 'node:fs';
import { validarPoderes } from './regras-poder-criatura.mjs';
import { criaturaNovaSchema, criaturaAnteriorR03Schema, criaturaParaLeituraSchema } from './criatura-schema.mjs';

const falhas = [];
const ok = (c, m) => { if (!c) falhas.push(m); console.log((c ? '  ✓ ' : '  ✘ ') + m); };
const erros = (h, extra = {}) => {
  const lista = [];
  const poderes = Array.isArray(h) ? h : [h];
  validarPoderes({ id: 'teste', centelha: 1, artes: {}, ...extra, habilidadesEspeciais: poderes }, (path, msg) => lista.push(msg));
  return lista;
};
const poder = (categoria, limiteDeUso, outros = {}) => ({ nome: 'Poder', formas: 'todas', classe: 'regra da ficha', categoria, limiteDeUso, ...outros });
const passa = (h, m, extra) => { const e = erros(h, extra); ok(e.length === 0, m + (e.length ? ' (' + e.join(' | ') + ')' : '')); };
const falha = (h, trecho, m, extra) => { const e = erros(h, extra); ok(e.some((x) => x.includes(trecho)), m + ' → "' + trecho + '"' + (e.length ? '' : ' (nenhum erro)')); };

const SUBST = 'O corpo guarda 3 doses e produz 1 dose a cada 4 horas. Cada uso gasta 1 dose';
const GRATIS = 'Usos grátis: 2 por cena. Cada uso extra custa 1 de Energia';
const MILAGRE = { ativacao: 'quem pede tem de aceitar um pacto, e o preparo leva dez minutos', limiteDeUso: '1 vez por semana' };

console.log('categoria obrigatória');
falha({ nome: 'Sem nada', formas: 'todas', classe: 'regra da ficha', limiteDeUso: GRATIS }, 'poder exige categoria', 'poder sem categoria');
passa({ nome: 'agarrar', formas: 'todas', classe: 'livro' }, 'manobra do livro sem base fica de fora');
falha({ nome: 'Raio', formas: 'todas', classe: 'livro', base: { arte: 'fogo', nivel: 2 } }, 'poder exige categoria', 'poder do livro com base exige categoria');

console.log('substância produzida');
passa(poder('substancia', SUBST), 'estoque e produção escritos');
falha(poder('substancia', 'produz 1 dose a cada 4 horas'), 'falta o estoque de doses', 'sem estoque');
falha(poder('substancia', 'O corpo guarda 3 doses'), 'falta o tempo de produção', 'sem tempo de produção');
passa([poder('substancia', SUBST, { nome: 'Fumaça sufocante' }), poder('substancia', 'Parte da mesma dose de Fumaça sufocante', { nome: 'enjoo' })], 'efeito que gasta a dose de outra substância');
falha([poder('substancia', SUBST, { nome: 'Fumaça sufocante' }), poder('substancia', 'Parte da mesma dose de Névoa ácida', { nome: 'enjoo' })], 'falta o estoque de doses', 'dose de uma substância que a criatura não tem');
falha(poder('substancia', SUBST + '. Cada dose extra custa 1 de Energia'), 'não permite custo em Energia', 'substância paga em Energia');

console.log('ação sobrenatural e efeito similar à magia');
passa(poder('sobrenatural', GRATIS), 'sobrenatural com usos grátis e extra em Energia');
falha(poder('sobrenatural', 'Cada uso custa 1 de Energia'), 'falta o número de usos grátis', 'sobrenatural sem usos grátis');
falha(poder('magia', 'à vontade'), 'falta o número de usos grátis', 'magia sem usos grátis');
passa(poder('magia', GRATIS + '. Pode ampliar o efeito gastando 2 de Energia'), 'magia amplia');
falha(poder('sobrenatural', GRATIS + '. Pode ampliar o efeito gastando 2 de Energia'), 'somente magia admite ampliação', 'sobrenatural amplia');
falha(poder('magia', 'Usos grátis: 1 por cena. Os usos voltam a cada 2 horas'), 'nenhum uso volta por hora', 'uso que volta por hora fora da substância');
falha(poder('sobrenatural', 'Usos grátis: 1 por cena. Recupera 1 uso a cada 2 horas'), 'nenhum uso volta por hora', '"recupera 1 uso a cada 2 horas"');
falha(poder('magia', 'Usos grátis: 1 por cena. Recarrega em 1 hora'), 'nenhum uso volta por hora', '"recarrega em 1 hora"');
passa(poder('magia', 'Usos grátis: 1 por dia. A ativação se completa em 1 hora'), '"a ativação se completa em 1 hora" é tempo de ativação, não uso voltando');
falha(poder('magia', 'Usos grátis: 1 por dia. Recupera a ativação em 1 hora'), 'nenhum uso volta por hora', '"recupera a ativação em 1 hora"');
passa(poder('inato', 'contínuo', { classe: 'sem regra ainda', efeito: 'recupera 1 PV por hora' }), '"recupera 1 PV por hora" é regeneração, não uso voltando (sem regra ainda)');
passa(poder('inato', 'Recupera 1 PV por hora enquanto tiver alimento'), '"recupera 1 PV por hora" é regeneração, não uso voltando (regra da ficha)');
passa(poder('inato', 'toda a regeneração para por 1 hora. Depois, as feridas voltam a fechar', { classe: 'sem regra ainda', efeito: 'toda a regeneração para por 1 hora. Depois, as feridas voltam a fechar' }), '"regeneração para por 1 hora" não é uso voltando');
passa(poder('magia', 'Usos grátis: 1 por dia', { classe: 'livro', base: { arte: 'fogo', nivel: 2 } }), 'magia do livro não cobra os números da ficha');

console.log('poder inato');
passa(poder('inato', 'à vontade, sem Energia. O uso repetido causa esforço'), 'inato "sem Energia" não é custo');
falha(poder('inato', 'à vontade; cada uso custa 1 de Energia'), 'não permite custo em Energia', 'inato pago em Energia');
falha(poder('inato', 'à vontade, ampliado com 1 de Mana'), 'somente magia admite ampliação', 'inato ampliado');

console.log('milagre');
passa(poder('milagre', MILAGRE.limiteDeUso, { ativacao: MILAGRE.ativacao }), 'condições e limite fixo');
falha(poder('milagre', 'quando quiser', { ativacao: MILAGRE.ativacao }), 'falta limite fixo', 'milagre sem limite fixo');
falha(poder('milagre', MILAGRE.limiteDeUso, { ativacao: 'uma ação' }), 'faltam condições do milagre', 'milagre sem condições');
falha(poder('milagre', MILAGRE.limiteDeUso + '. Usos extras custam 3 de Energia', { ativacao: MILAGRE.ativacao }), 'milagre não permite uso extra', 'milagre com uso extra');
falha(poder('milagre', MILAGRE.limiteDeUso + '. Pode gastar 2 de Mana', { ativacao: MILAGRE.ativacao }), 'não permite custo em Mana', 'milagre pago em Mana');

console.log('quem paga com Energia e com Mana');
falha(poder('sobrenatural', GRATIS), 'Energia exige Centelha', 'Energia sem Centelha', { centelha: 0 });
falha(poder('magia', 'Usos grátis: 1 por cena. Cada uso extra custa 1 de Mana'), 'Mana exige Artes', 'Mana sem Artes');
passa(poder('magia', 'Usos grátis: 1 por cena. Cada uso extra custa 1 de Mana'), 'Mana com Artes', { artes: { fogo: 2 } });

console.log('R4: recarga em Ticks');
falha(poder('sobrenatural', 'Usos grátis: 1 por cena. Recarrega em 12 Ticks'), 'recarga em Ticks', 'recarga em Ticks');
falha(poder('substancia', 'pode usar a cada 24 Ticks'), 'recarga em Ticks', 'sopro a cada 24 Ticks');

console.log('P3: constructo não produz substância');
const golem = (categoria, lim) => erros(poder(categoria, lim, { nome: 'Sopro de gás venenoso' }), { id: 'golem-de-ferro' });
ok(golem('substancia', SUBST).some((x) => x.includes('P3 exige magia')), 'golem de ferro com o sopro como substância falha');
ok(golem('sobrenatural', GRATIS).some((x) => x.includes('P3 exige magia')), 'golem de ferro com o sopro como sobrenatural falha');
ok(golem('magia', GRATIS).length === 0, 'golem de ferro com o sopro como magia passa');
ok(erros(poder('substancia', SUBST, { nome: 'Ferrão sonífero' }), { id: 'homunculus' }).some((x) => x.includes('P3 exige magia')), 'homúnculo com o ferrão como substância falha');
const gelo = (categoria, lim) => erros(poder(categoria, lim, { nome: 'Sopro congelante' }), { id: 'golem-de-gelo', categoria: 'construto' });
ok(gelo('substancia', SUBST).some((x) => x.includes('P3 exige magia')), 'golem de gelo com o Sopro congelante como substância falha');
ok(gelo('magia', GRATIS).length === 0, 'golem de gelo com o Sopro congelante como magia passa');
ok(erros(poder('substancia', SUBST, { nome: 'Óleo corrosivo' }), { id: 'golem-de-pedra', categoria: 'construto' }).some((x) => x.includes('constructo não produz substância')), 'qualquer constructo com substância falha (C-002)');
ok(erros(poder('substancia', SUBST, { nome: 'Óleo corrosivo' }), { id: 'lesma', categoria: 'animal' }).length === 0, 'a mesma substância num animal passa');
ok(erros(poder('magia', GRATIS, { nome: 'Óleo corrosivo' }), { id: 'golem-de-pedra', categoria: 'construto' }).length === 0, 'constructo com o mesmo poder como magia passa');

console.log('ajustes do autor de 06/11/2026');
const VISAO = 'o babau enxerga através de ilusão, disfarce e invisibilidade o tempo todo, sem esforço; a Técnica do livro é ativa e custa Energia.';
passa(poder('inato', '', { classe: 'sem regra ainda', efeito: VISAO, nome: 'visão verdadeira sempre ativa' }), 'a menção à Técnica do livro não é custo do poder');
falha(poder('inato', '', { classe: 'sem regra ainda', efeito: 'enxerga o invisível; cada uso custa 1 de Energia', nome: 'visão verdadeira' }), 'não permite custo em Energia', 'inato que custa Energia sem citar a Técnica continua falhando');
falha(poder('inato', 'cada uso custa 1 de Energia, como a Técnica do livro', { nome: 'visão verdadeira' }), 'não permite custo em Energia', 'custo ANTES da menção à Técnica, na mesma oração, continua falhando');
falha(poder('sobrenatural', 'Usos grátis: 1 por cena. Pode ampliar gastando Mana, além da Técnica do livro', { nome: 'olhar' }), 'somente magia admite ampliação', 'ampliação ANTES da menção à Técnica, na mesma oração, continua falhando');
const PULSO = 'no máximo um pulso por alvo a cada 6 Ticks, sem custo';
const ENXAME = { enxame: { individuosPorQuadrado: 20, tamanhoEquivalente: 'pequeno' } };
passa(poder('inato', PULSO, { nome: 'Pulso do enxame' }), 'pulso do enxame a cada 6 Ticks segue a R33', ENXAME);
falha(poder('inato', PULSO, { nome: 'Pulso do enxame' }), 'recarga em Ticks', 'o mesmo texto fora de enxame é recarga');
falha(poder('inato', 'no máximo um pulso por alvo a cada 12 Ticks', { nome: 'Pulso do enxame' }), 'recarga em Ticks', 'pulso de enxame fora dos 6 Ticks da R33', ENXAME);
falha(poder('sobrenatural', 'Usos grátis: 1 por cena. Recarrega em 12 Ticks', { nome: 'Nuvem de ferrões' }), 'recarga em Ticks', 'outro poder do enxame com recarga em Ticks', ENXAME);
const comAviso = (h) => { const e = [], a = []; validarPoderes({ id: 'teste', centelha: 1, artes: {}, habilidadesEspeciais: [h] }, (p, m) => e.push(m), (p, m) => a.push(m)); return { e, a }; };
let r1 = comAviso(poder('sobrenatural', '', { classe: 'sem regra ainda', efeito: 'olhar que domina' }));
ok(r1.e.length === 0 && r1.a.some((x) => x.includes('falta o número de usos grátis')), '"sem regra ainda" sem usos grátis vira aviso, e não erro');
r1 = comAviso(poder('substancia', '', { classe: 'sem regra ainda', efeito: 'cospe ácido' }));
ok(r1.e.length === 0 && r1.a.length === 2, '"sem regra ainda" substância sem estoque e produção: dois avisos');
r1 = comAviso(poder('sobrenatural', 'à vontade'));
ok(r1.e.some((x) => x.includes('falta o número de usos grátis')) && r1.a.length === 0, '"regra da ficha" sem usos grátis continua erro');
r1 = comAviso(poder('magia', '', { classe: 'sem regra ainda', efeito: 'Usos grátis: 1 por cena' }));
ok(r1.e.length === 0 && r1.a.length === 0, '"sem regra ainda" com os números escritos: nem erro nem aviso');

console.log('o esquema e a leitura por ficha');
// A fonte de antes da categoria dos poderes (R1). Era o golem-de-ferro publicado; depois, a primeira fonte sem a
// categoria. Com o lote r-retidas-06-11 (06/11/2026) nenhuma fonte publicada com dois poderes ou mais ficou sem ela, e a
// fonte de antes passa a ser feita aqui: o golem-de-ferro publicado com a categoria tirada de todos os poderes.
const fonte = JSON.parse(fs.readFileSync('src/data/bestiario/golem-de-ferro.json', 'utf8'));
ok(fonte.habilidadesEspeciais.length >= 2 && fonte.habilidadesEspeciais.every((h) => h.categoria !== undefined), 'o golem-de-ferro publicado tem dois poderes ou mais, todos com a categoria');
for (const h of fonte.habilidadesEspeciais) delete h.categoria;
ok(criaturaAnteriorR03Schema.safeParse(fonte).success, 'fonte de hoje passa na releitura anterior à categoria');
ok(!criaturaNovaSchema.safeParse(fonte).success, 'fonte de hoje falha no contrato novo');
ok(criaturaParaLeituraSchema.safeParse(fonte).success, 'leitura do validate aceita a fonte sem nenhuma categoria');
const meia = structuredClone(fonte);
meia.habilidadesEspeciais[0].categoria = 'magia';
const r = criaturaParaLeituraSchema.safeParse(meia);
ok(!r.success && r.error.issues.some((i) => i.message.includes('poder exige categoria')), 'ficha com uma categoria passa a exigir todas');
const errada = structuredClone(fonte);
errada.habilidadesEspeciais[0].categoria = 'feitiço';
ok(!criaturaParaLeituraSchema.safeParse(errada).success, 'categoria fora das cinco é recusada');

if (falhas.length) { console.error('\n✘ poderes de criatura: ' + falhas.length + ' falha(s)'); process.exit(1); }
console.log('\n✓ poderes de criatura: as regras de R1, R4 e P3 passam e falham onde devem');
