// migrar-bestiario.mjs · a migração do B14 (fase 1), rodada UMA VEZ em 26/09/2026.
//
// Escreve src/data/bestiario/<id>.json, uma ficha por criatura, a partir das
// fontes que existiam até o commit PIN abaixo: os 15 builds inline do
// gen-bestiario.mjs, conversao-monstros.html (DATA e PODERES), conversao-extra.json,
// inimigos-custom.json e os satélites, estes já juntados no monsters.json daquele
// commit (que é o que o site mostrava).
//
// TUDO É LIDO DO GIT, NO PIN, e não do disco: depois da migração os satélites e o
// conversao-extra.json foram apagados e o gen-bestiario.mjs foi reescrito, então
// ler do disco não teria mais o que ler. Lendo do commit, o script continua
// reproduzível: rodado de novo, escreve os mesmos 309 arquivos.
//
// O QUE ELE PROVA SOZINHO: para cada criatura, o stat block que sai da ficha nova
// (pela mesma conta do gen-bestiario.mjs, em lib-bestiario.mjs) é IGUAL ao objeto
// do inimigos.json do PIN, campo a campo. Divergência para o script sem escrever
// nada. A prova byte a byte dos três JSON gerados é o `cmp` depois de rodar os
// dois geradores (ver docs/simulacao/caixa/b14-executora.md).
//
// uso: node scripts/migrar-bestiario.mjs            (escreve a pasta)
//      node scripts/migrar-bestiario.mjs --check    (só confere, não escreve)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT, PASTA, ATRIBUTOS, stat, periciasDe, paraStat, porteSlug, tres } from './lib-bestiario.mjs';

const PIN = 'd884b4a';
const git = (rel) => execFileSync('git', ['-C', ROOT, 'show', `${PIN}:${rel}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const json = (rel) => JSON.parse(git(rel));

// ------------------------------------------------ o gerador antigo, do PIN
// O trecho do gen-bestiario.mjs antigo que MONTA as builds (NPCS, a conversão do
// DATA, os nomes em português e os ajustes à mão) roda aqui como estava, com duas
// trocas: o `fs` lê do git no PIN, e o `stat()` devolve a própria build em vez de
// calculá-la, para a migração guardar a ORIGEM e não o resultado.
const antigo = git('scripts/gen-bestiario.mjs');
const ini = antigo.indexOf('const regras = ');
const fim = antigo.indexOf('const inimigos = [');
if (ini < 0 || fim < 0) throw new Error('o gen-bestiario.mjs do PIN não tem os marcadores esperados');
const trecho = antigo.slice(ini, fim)
  .replace('function stat(b) {', 'function statAntigo(b) {')
  .replace('const ROOT = ', 'const ROOT_ANTIGO = ');
const SENT = '@PIN@';
globalThis.__fsPin = {
  readFileSync: (p) => git(String(p).replace(/\\/g, '/').replace(new RegExp(`^${SENT}/?`), '')),
  existsSync: () => true,
};
const lib = pathToFileURL(path.join(ROOT, 'scripts/lib-equip.mjs')).href;
const modulo = [
  `import { achataCatalogo } from '${lib}';`,
  `import path from 'node:path';`,
  `const fs = globalThis.__fsPin;`,
  `const ROOT = '${SENT}';`,
  `const stat = (b) => Object.assign(b, { atributos: b.attrs });`,
  trecho,
  'export { NPCS, CONV, CUSTOM, DIMPORTE, COURACA_OVERRIDE, DATA };',
].join('\n');
const tmp = path.join(os.tmpdir(), `migrar-bestiario-${process.pid}.mjs`);
fs.writeFileSync(tmp, modulo);
const OLD = await import(pathToFileURL(tmp).href);
fs.rmSync(tmp, { force: true });

// ------------------------------------------------------------ as saídas do PIN
const INIM = json('src/data/inimigos.json');
const MON = Object.fromEntries(json('src/data/monsters.json').map((m) => [m.id, m]));
const DESL = json('src/data/deslocamento-bestiario.json');
const PRIM = new Set(json('src/data/habilidades.json').map((h) => h.id));
const SEC = new Set(json('src/data/habilidades-secundarias.json').map((h) => h.id));
const CUSTOM_POR_ID = Object.fromEntries(OLD.CUSTOM.map((c) => [c.id, c]));
const CONV_POR_ID = Object.fromEntries(OLD.CONV.map((c, i) => [c.id, { b: c, m: OLD.DATA[i] }]));
const NPC_POR_ID = Object.fromEntries(OLD.NPCS.map((c) => [c.id, c]));

const semVazio = (o) => (o && Object.keys(o).length ? o : undefined);
/** O modo em que a peça anda, pela nota da semeadura: "voo 60 ..." → voo. */
const modoDe = (nota) => (/^voo\b/.test(nota || '') ? 'voo' : /^nado\b/.test(nota || '') ? 'natacao' : 'terra');

const fichas = [];
INIM.forEach((I, i) => {
  const m = MON[I.id];
  const conv = CONV_POR_ID[I.id];
  const cu = CUSTOM_POR_ID[I.id];
  const b = conv ? conv.b : (cu || NPC_POR_ID[I.id]);
  if (!m || !b) throw new Error(`${I.id}: sem build ou sem card no PIN`);

  // O porte da conta era o do satélite de dimensões, normalizado; a do card é o
  // rótulo. Tem de dar o mesmo slug, ou o PV mudaria.
  const slugAntigo = OLD.DIMPORTE[I.id] || 'medio';
  if (porteSlug(m.porte) !== slugAntigo) throw new Error(`${I.id}: porte "${m.porte}" dá ${porteSlug(m.porte)}, a conta usava ${slugAntigo}`);

  // As perícias da build, com a Integridade que morava fora delas nos NPCs.
  const pe = { ...(b.pericias || {}) };
  if (pe.integridade == null && b.integridade != null) pe.integridade = b.integridade;
  const skills = {}, skills2 = {};
  for (const [k, v] of Object.entries(pe)) (SEC.has(k) && !PRIM.has(k) ? skills2 : skills)[k] = v;
  if (b.especialidades) throw new Error(`${I.id}: tem especialidades, e o mapeamento para spec não foi escrito`);

  // O deslocamento: um passo, num modo. As três da mesa saem dele pela régua.
  const dm = m.combate.deslocamento, ds = DESL[I.id];
  const t = tres(dm.batalha);
  if (t.arranque !== dm.arranque || t.corrida !== dm.corrida) throw new Error(`${I.id}: as três velocidades não saem da régua (${JSON.stringify(dm)})`);
  if (cu?.deslocamento) throw new Error(`${I.id}: deslocamento declarado à mão, e o mapeamento não foi escrito`);

  const fonte = {};
  if (conv) {
    const d = conv.m;
    Object.assign(fonte, {
      livro: d.src, nome: d.name, cr: d.cr, tipo: d.type, tamanho: d.size,
      valores: { for: d.str, des: d.dex, con: d.con, int: d.int, sab: d.wis, car: d.cha },
      ...(d.sk?.length ? { pericias: d.sk } : {}),
      ...(d.note ? { nota: d.note } : {}),
      ...(d.worked ? { exemplo: true } : {}),
    });
  }
  if (ds) fonte.deslocamento = { ft: ds.ft, origem: ds.origem, ...(ds.nota ? { nota: ds.nota } : {}) };

  const arm = b.armadura && b.armadura !== 'nenhuma' ? b.armadura : null;
  const montar = (bonus) => ({
    ordem: i + 1,
    id: I.id,
    nome: I.nome,
    nomeIngles: m.nomeIngles,
    categoria: m.categoria,
    ...(I.categoria !== m.categoria ? { categoriaLegada: I.categoria } : {}),
    papel: I.tipo,
    conceito: I.conceito,
    descricao: m.descricao,
    ...(I.descricao !== m.descricao ? { descricaoLegada: I.descricao } : {}),
    tags: I.tags,
    imagem: m.imagem,
    porte: m.porte,
    dimensoes: m.dimensoes,
    ...(cu?.material ? { material: cu.material } : {}),
    locomocao: { [modoDe(ds?.nota)]: dm.batalha },
    centelha: I.centelha,
    attrs: Object.fromEntries(ATRIBUTOS.map((k) => [k, I.atributos[k]])),
    skills,
    ...(semVazio(skills2) ? { skills2 } : {}),
    virtues: m.virtudes,
    willpower: b.vontade ?? 5,
    aparencia: m.aparencia,
    ...(I.artes.length ? { arte: Object.fromEntries(I.artes.map((a) => [a.id, a.nivel])) } : {}),
    ...(I.tecnicas.length ? { tech: Object.fromEntries(I.tecnicas.map((x) => [x, true])) } : {}),
    ...(arm ? { equip: { armaduras: [arm] } } : {}),
    ataques: b.ataques || [],
    ...(bonus ? { bonus } : {}),
    ...(OLD.COURACA_OVERRIDE[I.id] ? { couraca: OLD.COURACA_OVERRIDE[I.id] } : {}),
    ...(I.poderes?.length ? { poderes: I.poderes } : {}),
    ...(m.combate.fraquezas ? { fraquezas: m.combate.fraquezas } : {}),
    ...(m.combate.resistencias ? { resistencias: m.combate.resistencias } : {}),
    habilidades: m.habilidades,
    lore: m.lore,
    ecologia: m.ecologia,
    notas: I.notas,
    pendente: I.pendente,
    ...(semVazio(fonte) ? { fonte } : {}),
    variantes: [],
    ameacaLegada: I.ameaca,
  });

  // O que a conta não alcança e estava escrito à mão por cima dela (o casco do
  // objeto animado) vira BÔNUS, que soma ao calculado e fica visível.
  const s = stat(paraStat(montar(b.bonus)));
  const bonus = { ...(b.bonus || {}) };
  for (const k of ['impacto', 'corte', 'perfuracao']) {
    const dif = I.soak[k] - s.soak[k];
    if (dif) bonus[`absorcao_${k}`] = dif;
  }
  const f = montar(Object.keys(bonus).length ? bonus : undefined);

  // A PROVA: o stat block da ficha nova é o do PIN, campo a campo.
  const x = stat(paraStat(f));
  const saida = { ...x, pericias: periciasDe(x, porteSlug(f.porte)) };
  if (JSON.stringify(saida) !== JSON.stringify(I)) {
    throw new Error(`${I.id}: o stat block da ficha nova diverge do PIN\n  novo: ${JSON.stringify(saida)}\n  PIN:  ${JSON.stringify(I)}`);
  }
  fichas.push(f);
});

const CHECK = process.argv.includes('--check');
if (CHECK) {
  // No --check, a pasta tem de ser a que a migração escreveria: diferença aqui é
  // ficha editada à mão depois da migração, o que é esperado com o tempo, e por
  // isso o --check não está no validate. Serve para provar a migração no dia dela.
  const dif = fichas.filter((f) => {
    const arq = path.join(PASTA, `${f.id}.json`);
    return !fs.existsSync(arq) || fs.readFileSync(arq, 'utf8') !== JSON.stringify(f, null, 2) + '\n';
  });
  console.log(dif.length ? `  ${dif.length} ficha(s) na pasta diferem do que a migração escreveria: ${dif.slice(0, 5).map((f) => f.id).join(', ')}` : '  a pasta é, byte a byte, a que a migração escreve');
} else {
  fs.mkdirSync(PASTA, { recursive: true });
  for (const f of fichas) fs.writeFileSync(path.join(PASTA, `${f.id}.json`), JSON.stringify(f, null, 2) + '\n');
}
const n = (p) => fichas.filter(p).length;
console.log(`${CHECK ? 'conferidas' : 'escritas'} ${fichas.length} fichas em src/data/bestiario/ · stat block igual ao do ${PIN} nas ${fichas.length}`);
console.log(`  ${n((f) => f.fonte?.livro)} convertidas · ${n((f) => f.material)} da caixa de entrada · ${n((f) => f.categoriaLegada)} com categoriaLegada · ${n((f) => f.descricaoLegada)} com descricaoLegada · ${n((f) => f.bonus)} com bônus · ${n((f) => f.couraca)} com couraça própria · ${n((f) => f.skills2)} com secundárias`);
