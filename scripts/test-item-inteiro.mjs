// D-259 (A1): a ficha do personagem guarda o item inteiro (arma, escudo, armadura), com
// todos os números editáveis; o site soma na conta; o item não muda quando o catálogo muda;
// o id do catálogo fica só como origem. A ficha gravada antes (ref + ajuste, a da 41) vira
// item na leitura, pela conta de antes.
//
// A prova central monta o motor duas vezes: com o catálogo de verdade e com um catálogo
// trocado por plugin do esbuild (o mesmo caminho do item 8 em test-motor.mjs). A ficha
// gravada com o catálogo de verdade tem de dar os mesmos números lida pelo catálogo trocado.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { fichaSchema, refsExistem } from './ficha-schema.mjs';
import { achataCatalogo } from './lib-equip.mjs';

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const falhas = [];
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✘ ') + m); if (!c) falhas.push(m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}${JSON.stringify(a) === JSON.stringify(b) ? '' : ` (deu ${JSON.stringify(a)}, esperado ${JSON.stringify(b)})`}`);

// O catálogo trocado: tudo o que a ficha usa muda de número.
const TROCAS = {
  'armas.json': (l) => { for (const a of l) if (a.id === 'espada-longa') Object.assign(a.arma, { acerto: 5, dado: 3, danoBonus: 4, ticks: 9, defesaArma: 4, maos: 2, pericia: 'briga' }); },
  'escudos.json': (l) => { for (const e of l) if (e.id === 'broquel') Object.assign(e.escudo, { bloqCaC: 6, penalidade: 4 }); },
  'armaduras.json': (l) => { for (const a of l) if (a.id === 'gambeson') { a.armadura.soak = { impacto: 9, corte: 9, perfuracao: 9 }; a.armadura.penalidade = 5; } },
};
async function monta(rel, trocado) {
  const plugin = { name: 'catalogo-trocado', setup(b) {
    b.onLoad({ filter: /[\\/](armas|escudos|armaduras)\.json$/ }, (args) => {
      const lista = JSON.parse(fs.readFileSync(args.path, 'utf8'));
      if (trocado) TROCAS[path.basename(args.path)](lista);
      return { contents: JSON.stringify(lista), loader: 'json' };
    });
  } };
  const saida = path.join(os.tmpdir(), `item-inteiro-${process.pid}-${trocado ? 't' : 'r'}-${path.basename(rel, '.ts')}.mjs`);
  await build({ entryPoints: [path.join(RAIZ, rel)], outfile: saida, bundle: true, format: 'esm', platform: 'node',
    loader: { '.json': 'json' }, logLevel: 'error', define: { 'import.meta.env': 'globalThis.__ENV__' }, plugins: [plugin] });
  globalThis.__ENV__ = globalThis.__ENV__ || { BASE_URL: '/', MODE: 'test' };
  try { return await import(pathToFileURL(saida).href); } finally { try { fs.unlinkSync(saida); } catch { /* o sistema limpa */ } }
}
const real = { M: await monta('src/lib/motor.ts', false), E: await monta('src/lib/equip.ts', false), F: await monta('src/lib/ficha-formato.ts', false), R: await monta('src/lib/mesa-ficha.ts', false) };
const trocado = { M: await monta('src/lib/motor.ts', true), E: await monta('src/lib/equip.ts', true), F: await monta('src/lib/ficha-formato.ts', true), R: await monta('src/lib/mesa-ficha.ts', true) };

const kael = JSON.parse(fs.readFileSync(path.join(RAIZ, 'scripts/fixtures/kael.json'), 'utf8'));
// Kael empunha espada longa e broquel e veste gambeson: as três peças que o catálogo trocado muda.
const numeros = (X, f) => {
  const L = X.F.fichaParaLeitura(f), cj = L.conjuntos.find((c) => c.ativo);
  const w = X.E.armaDoSlot(cj.habil), s = X.E.escudoDoSlot(cj.inabil), arm = X.E.armadurasDe(f);
  const c = X.M.combatePersonagem(L), n = X.M.numerosPersonagem(L), R = X.R.resumoFicha(f);
  return { arma: [w.ticks, w.acerto, w.dado, w.danoBonus, w.defesaArma, w.maos, w.pericia], escudo: [s.bloqCaC, s.penalidade],
    armadura: arm.map((a) => [a.soak, a.penalidade]), ataque: c.ataque, dano: c.dano, defesa: c.defesa, velocidade: c.velocidade,
    esquiva: n.esquiva, bloqueio: n.bloqueio, absorcao: n.absorcao, resumo: [R.ataque, R.dano, R.defEsquiva, R.defBloqueio] };
};

console.log('1. o item gravado não segue o catálogo');
const gravada = real.F.fichaParaGravar(kael);
const cj0 = gravada.equipamento.conjuntos[0];
ok(cj0.maoHabil.item?.origem === 'espada-longa' && cj0.maoHabil.item?.arma?.dado != null, 'a mão hábil grava a espada longa inteira, com a origem');
ok(cj0.maoInabil.item?.origem === 'broquel' && cj0.maoInabil.item?.escudo?.bloqCaC != null, 'a mão inábil grava o broquel inteiro');
ok(gravada.equipamento.armaduras.every((p) => p.item?.armadura?.soak), 'as duas armaduras gravam o item inteiro');
ok(!JSON.stringify(gravada.equipamento).includes('"ajuste"'), 'nada de ajuste na ficha gravada');
const antes = numeros(real, gravada);
const depois = numeros(trocado, gravada);
eq(depois, antes, 'catálogo trocado (espada, broquel, gambeson): a ficha gravada dá os mesmos números na ficha, no motor e no resumo da mesa');
// e o catálogo trocado de fato muda o que não está gravado: sem isto a prova acima não provaria nada
const crua = numeros(trocado, kael);
ok(JSON.stringify(crua.arma) !== JSON.stringify(antes.arma) && JSON.stringify(crua.escudo) !== JSON.stringify(antes.escudo),
  'controle: a ficha antiga (ref sem item) lida pelo catálogo trocado muda de número');

console.log('2. a ficha da 41 (ref + ajuste) vira item na leitura, pela conta de antes');
const f41 = real.F.fichaParaGravar(kael);
for (const cj of f41.equipamento.conjuntos) for (const m of ['maoHabil', 'maoInabil']) if (cj[m]) delete cj[m].item;
for (const p of f41.equipamento.armaduras) delete p.item;
f41.equipamento.conjuntos[0].maoHabil.ajuste = { acerto: 3, ticks: 99 };
const lida = real.F.fichaParaLeitura(f41);
const w41 = real.E.armaDoSlot(lida.conjuntos[0].habil);
eq([w41.acerto, w41.ticks, w41.dado], [3, 20, real.E.ARMA['espada-longa'].dado], 'ajuste aplicado com os limites de antes (Acerto 3; Velocidade 99 vira 20), o resto do catálogo');
ok(lida.conjuntos[0].habil.item && !lida.conjuntos[0].habil.mod, 'a peça lida carrega o item e perde o ajuste');
const g41 = real.F.fichaParaGravar(f41);
ok(g41.equipamento.conjuntos[0].maoHabil.item?.arma?.acerto === 3 && !('ajuste' in g41.equipamento.conjuntos[0].maoHabil), 'a gravação da ficha 41 já sai com o item inteiro');

console.log('3. o número do item soma na conta');
const editada = structuredClone(gravada);
const esp = editada.equipamento.conjuntos[0].maoHabil.item;
esp.arma.acerto += 1;
const base = real.M.combatePersonagem(real.F.fichaParaLeitura(gravada)), mais = real.M.combatePersonagem(real.F.fichaParaLeitura(editada));
const flat = (a) => Number((a.match(/ ([+−-]\d+)$/) || [, '0'])[1].replace('−', '-'));
eq(flat(mais.ataque) - flat(base.ataque), 1, 'Acerto +1 no item da espada: a jogada sobe 1');
const c = { k: 'tipoDano', rot: 'Tipo de dano', min: 0, max: 0, tipo: 'opcao' };
real.E.escreveCampo(esp, c, 'impacto');
eq(real.M.combatePersonagem(real.F.fichaParaLeitura(editada)).dano.slice(-3), '(I)', 'tipo de dano trocado no item: a conta usa o novo (modo principal)');
real.E.escreveCampo(esp, { k: 'maos', rot: 'Mãos', min: 1, max: 2 }, 2);
ok(real.M.itemDoJogador(real.F.fichaParaLeitura(editada).conjuntos[0].habil).w.maos === 2, 'Mãos editadas: a arma passa a ser de duas mãos');
real.E.escreveCampo(esp, { k: 'tags', rot: 'Tags', min: 0, max: 0, tipo: 'lista' }, ['versátil', 'nova']);
eq(real.E.armaDoSlot(real.F.fichaParaLeitura(editada).conjuntos[0].habil).tags, ['versátil', 'nova'], 'Tags editadas no item');
real.E.escreveCampo(esp, { k: 'pericia', rot: 'Habilidade', min: 0, max: 0, tipo: 'opcao' }, 'briga');
eq(real.E.armaDoSlot(real.F.fichaParaLeitura(editada).conjuntos[0].habil).pericia, 'briga', 'Habilidade editada no item');
const arm0 = editada.equipamento.armaduras[0].item;
real.E.escreveCampo(arm0, real.E.CAMPOS_ARMADURA[0], 7);
eq(real.E.armadurasDe(editada)[0].soak.impacto, 7, 'Absorção de Impacto editada na armadura');

console.log('4. a peça personalizada e a ficha antiga de verdade');
const livre = { ref: 'c', nome: 'Poste', dado: 1, acerto: -2, danoBonus: 0 };
const itLivre = real.M.itemDoJogador(real.F.fichaParaLeitura({ ...kael, arsenal: [livre], conjuntos: [{ ativo: true, habil: { ...livre }, inabil: { ref: 'nada' } }] }).conjuntos[0].habil);
eq([itLivre.kind, itLivre.nome, itLivre.w.dado, itLivre.w.acerto, itLivre.w.ticks], ['custom', 'Poste', 1, -2, 5], 'arma personalizada antiga vira item sem origem, com os números dela');
const escLivre = { ref: 'ce', nome: 'Escudo quebrado', mod: { bloqCaC: 1, penalidade: 1 } };
const itEsc = real.M.itemDoJogador(real.F.fichaParaLeitura({ ...kael, conjuntos: [{ ativo: true, habil: { ref: 'a:desarmado' }, inabil: { ...escLivre } }] }).conjuntos[0].inabil);
eq([itEsc.kind, itEsc.nome, itEsc.def, itEsc.pen], ['escudo', 'Escudo quebrado', 1, 1], 'escudo personalizado antigo com ajuste vira item com os números ajustados');
const punhos = real.F.fichaParaGravar({ ...kael, conjuntos: [{ ativo: true, habil: { ref: 'a:desarmado' }, inabil: { ref: 'nada' } }] });
ok(!punhos.equipamento.conjuntos[0].maoHabil.item, 'os punhos (a:desarmado) não viram item: são o corpo');

console.log('5. o esquema e as referências');
const armas = achataCatalogo(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/armas.json'), 'utf8')));
const escudos = achataCatalogo(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/escudos.json'), 'utf8')));
const armaduras = achataCatalogo(JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/armaduras.json'), 'utf8')));
ok(fichaSchema.safeParse(gravada).success, 'o esquema aceita a ficha com itens inteiros');
const semOrigem = structuredClone(gravada); semOrigem.equipamento.conjuntos[0].maoHabil.ref = 'a:espada-que-saiu-do-livro'; semOrigem.equipamento.conjuntos[0].maoHabil.item.origem = 'espada-que-saiu-do-livro';
eq(refsExistem(semOrigem, { armas, escudos, armaduras }), [], 'peça com item não depende do catálogo, mesmo com a origem fora dele');
const quebrado = structuredClone(gravada); delete quebrado.equipamento.conjuntos[0].maoHabil.item.arma;
ok(!fichaSchema.safeParse(quebrado).success, 'controle: item de arma sem o bloco arma é recusado');

if (falhas.length) { console.error(`✘ item inteiro: ${falhas.length} falha(s)`); process.exit(1); }
console.log('✓ item inteiro (D-259) · a ficha guarda arma, escudo e armadura inteiros; catálogo trocado não muda nada gravado; a 41 vira item na leitura');
