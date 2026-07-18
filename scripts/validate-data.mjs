// Portão de integridade dos dados — roda ANTES do astro build.
// Falha com mensagem clara em: id duplicado, referência órfã (prereq/caminho/atributo),
// campo obrigatório faltando ou tipo inválido. Sem isso, o site não builda.
import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'src', 'data');
const read = (f) => JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
const erros = [];
const fail = (msg) => erros.push(msg);

const custo = z.object({ energia: z.number().int().nonnegative().optional(), mana: z.number().int().nonnegative().optional(), vontade: z.number().int().nonnegative().optional() });
const soakModos = z.object({ impacto: z.number().int(), corte: z.number().int(), perfuracao: z.number().int() });
const S = {
  atributos: z.object({ id: z.string(), nome: z.string(), grupo: z.enum(['fisico', 'social', 'mental']), descricao: z.string(), niveis: z.array(z.object({ nivel: z.number().int(), texto: z.string() })).optional() }),
  habilidades: z.object({ id: z.string(), nome: z.string(), grupo: z.enum(['combate', 'fisica', 'social', 'saber', 'tecnica']), atributos: z.array(z.string()).optional(), secundaria: z.boolean().optional(), descricao: z.string() }),
  virtudes: z.object({ id: z.string(), nome: z.string(), resiste: z.string(), descricao: z.string(), niveis: z.array(z.object({ nivel: z.number().int(), texto: z.string() })).optional() }),
  caminhos: z.object({ id: z.string(), nome: z.string(), trilha: z.enum(['corpo', 'voz', 'mente']), atributo: z.string(), habilidade_ancora: z.string().optional(), descricao: z.string() }),
  tecnicas: z.object({ id: z.string(), nome: z.string(), caminho: z.string(), atributo: z.string(), nivel: z.number().int().min(1).max(5), efeito: z.enum(['bonus', 'soak', 'dano', 'penetracao', 'carga', 'salto', 'velocidade', 'tamanho', 'estado']), tipo: z.enum(['passiva', 'ativa', 'reflexiva']), custo, prereq: z.array(z.string()), aliases: z.array(z.string()), texto: z.string(), pendente: z.boolean() }),
  artes: z.object({ id: z.string(), nome: z.string(), categoria: z.enum(['elemental', 'universal']), atributo_conjuracao: z.string(), niveis: z.array(z.object({ nivel: z.number().int().min(1).max(5), nome: z.string(), efeito: z.string(), custo: z.object({ mana: z.number().int().min(1).max(5) }) })).length(5), aliases: z.array(z.string()), pendente: z.boolean() }),
  glossario: z.object({ id: z.string(), termo: z.string(), aliases: z.array(z.string()), definicao: z.string() }),
  inimigos: z.object({
    id: z.string(), nome: z.string(), tipo: z.enum(['capanga', 'soldado', 'elite', 'fera', 'chefe']),
    categoria: z.string().optional(),
    ameaca: z.number().int().min(1).max(6), centelha: z.number().int().min(0).max(10),
    conceito: z.string(), descricao: z.string(), tags: z.array(z.string()),
    pv: z.number().int(), defesa: z.number().int(), defesaSocial: z.union([z.number().int(), z.literal('-')]), defesaMental: z.union([z.number().int(), z.literal('-')]),
    vontade: z.number().int(),
    soak: soakModos, resistPerf: z.number().int().min(0),
    iniciativa: z.string(), atributos: z.record(z.number().int()),
    ataques: z.array(z.object({ nome: z.string(), pool: z.string(), dano: z.string(), ticks: z.number().int(), notas: z.string().optional() })),
    tecnicas: z.array(z.string()), artes: z.array(z.object({ id: z.string(), nivel: z.number().int() })),
    poderes: z.array(z.object({ efeito: z.string(), tipo: z.enum(['proeza', 'feiticaria', 'natural']), alvo: z.string(), caminho: z.string().optional(), arte: z.string().optional() })).optional(),
    notas: z.string(), pendente: z.boolean(),
  }),
  armas: z.object({
    id: z.string(), nome: z.string(), classe: z.enum(['leve', 'media', 'pesada', 'haste', 'distancia', 'arremesso']),
    atrib: z.string(), pericia: z.string(), dado: z.number().int().min(1).max(3), acerto: z.number().int(),
    defesaArma: z.number().int(), maos: z.number().int().min(1).max(2), ticks: z.number().int(), folego: z.number().int().min(0).optional(),
    tipoDano: z.enum(['corte', 'projetil', 'perfConc', 'impacto']), pen: z.number().int().min(0).max(5),
    modos: z.array(z.object({ tipo: z.enum(['corte', 'projetil', 'perfConc', 'impacto']), perf: z.number().int().min(0).max(5).optional(), principal: z.boolean() })),
    tags: z.array(z.string()), notas: z.string(),
  }),
  armaduras: z.object({ id: z.string(), nome: z.string(), classe: z.enum(['nenhuma', 'leve', 'media', 'pesada']), soak: soakModos, resistPerf: z.number().int().min(0), penalidade: z.number().int().min(0), acesso: z.number().int().optional(), notas: z.string() }),
  escudos: z.object({ id: z.string(), nome: z.string(), bloqCaC: z.number().int(), bloqProjetil: z.number().int(), penalidade: z.number().int(), acesso: z.number().int().optional(), notas: z.string() }),
};

const data = {};
for (const k of Object.keys(S)) {
  const arr = read(`${k}.json`);
  if (!Array.isArray(arr)) { fail(`${k}.json: deve ser um array`); continue; }
  const ids = new Set();
  arr.forEach((item, i) => {
    const r = S[k].safeParse(item);
    if (!r.success) fail(`${k}[${i}] (${item.id ?? '?'}): ${r.error.issues.map((e) => `${e.path.join('.')} ${e.message}`).join('; ')}`);
    if (item.id != null) { if (ids.has(item.id)) fail(`${k}: id duplicado "${item.id}"`); ids.add(item.id); }
  });
  data[k] = arr;
}

// integridade referencial
const setOf = (k) => new Set((data[k] || []).map((x) => x.id));
const A = setOf('atributos'), C = setOf('caminhos'), T = setOf('tecnicas');
for (const c of data.caminhos || []) if (!A.has(c.atributo)) fail(`caminho "${c.id}": atributo inexistente "${c.atributo}"`);
for (const t of data.tecnicas || []) {
  if (!C.has(t.caminho)) fail(`técnica "${t.id}": caminho inexistente "${t.caminho}"`);
  if (!A.has(t.atributo)) fail(`técnica "${t.id}": atributo inexistente "${t.atributo}"`);
  for (const p of t.prereq) if (!T.has(p)) fail(`técnica "${t.id}": prereq órfão "${p}"`);
}
for (const a of data.artes || []) if (!A.has(a.atributo_conjuracao)) fail(`arte "${a.id}": atributo_conjuracao inexistente "${a.atributo_conjuracao}"`);
const ART = setOf('artes'), H = setOf('habilidades');
for (const i of data.inimigos || []) {
  for (const t of i.tecnicas) if (!T.has(t)) fail(`inimigo "${i.id}": técnica inexistente "${t}"`);
  for (const a of i.artes) if (!ART.has(a.id)) fail(`inimigo "${i.id}": arte inexistente "${a.id}"`);
}
for (const w of data.armas || []) {
  if (!A.has(w.atrib)) fail(`arma "${w.id}": atributo inexistente "${w.atrib}"`);
  if (!H.has(w.pericia)) fail(`arma "${w.id}": perícia inexistente "${w.pericia}"`);
}

if (erros.length) {
  console.error(`\n✘ Validação de dados FALHOU (${erros.length} erro(s)):`);
  for (const e of erros) console.error('  • ' + e);
  console.error('');
  process.exit(1);
}
console.log(`✓ Dados válidos: ${data.tecnicas.length} técnicas, ${data.caminhos.length} caminhos, ${data.artes.length} artes — referências íntegras.`);
