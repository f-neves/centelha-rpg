// O FORMATO da ficha de criatura (src/data/bestiario/<id>.json), escrito.
//
// No molde do ficha-schema.mjs, e aqui pelo mesmo motivo: o zod é dependência de
// desenvolvimento e só o portão (validate-data.mjs) o carrega. A diferença é o
// rigor. O esquema da ficha do jogador é um contrato de LEITURA (passthrough: só
// exige o que a mesa lê); este é o molde do arquivo INTEIRO, `.strict()` em todo
// objeto, porque a ficha de criatura é escrita à mão e o zod descarta chave
// desconhecida sem erro: `willpowr` passaria calado e a criatura cairia na Vontade
// padrão. Com `.strict()`, a digitação errada para o build.
//
// Os campos com o MESMO NOME da ficha do jogador (attrs, skills, skills2, spec,
// virtues, willpower, aparencia, centelha, arte, tech, conjuntos, equip) usam o
// mesmo formato dela; conjuntos e equip reusam os esquemas do ficha-schema.mjs.
// O que cada campo alimenta está em docs/bestiario/ficha-criatura.md.
import { z } from 'zod';
import { conjuntoSchema, equipSchema } from './ficha-schema.mjs';

const inteiro = z.number().int();
const naoNeg = inteiro.nonnegative();
const texto = z.string();

/** Um ataque natural (ou de arma, no NPC humano), no formato compacto que o
 *  gerador transforma em parada e dano. */
export const ataqueSchema = z.object({
  nome: texto,
  atrib: texto,
  pericia: texto,
  dado: naoNeg,
  mao: z.union([z.literal(1), z.literal(2)]).optional(),
  distancia: z.boolean().optional(),
  tipo: texto,
  acerto: inteiro.optional(),
  perf: naoNeg.optional(),
  ticks: z.number().int().min(1),
  notas: texto.optional(),
}).strict();

/** Poder: o efeito, de que tipo ele é (dom natural, Proeza de Caminho, Feitiçaria
 *  de Arte) e o alvo em prosa. `arte` e `caminho` apontam para o catálogo. */
export const poderSchema = z.object({
  efeito: texto,
  tipo: z.enum(['natural', 'proeza', 'feiticaria']),
  alvo: texto,
  arte: texto.optional(),
  caminho: texto.optional(),
}).strict();

const velocidade = z.number().int().min(1).max(20);
const valorOriginal = z.union([z.number(), z.literal('-'), z.null()]);

export const criaturaSchema = z.object({
  ordem: z.number().int().min(1).optional(),
  id: z.string().regex(/^[a-z0-9-]+$/, 'id em minúsculas, números e hífen'),
  nome: texto.min(1),
  nomeIngles: texto.nullable(),
  categoria: texto.min(1),
  categoriaLegada: texto.optional(),
  papel: z.enum(['capanga', 'soldado', 'elite', 'fera', 'chefe']),
  conceito: texto,
  descricao: texto,
  descricaoLegada: texto.optional(),
  tags: z.array(texto),
  imagem: texto.nullable(),
  porte: z.enum(['Miúdo', 'Pequeno', 'Médio', 'Grande', 'Enorme', 'Imenso', 'Colossal']),
  dimensoes: z.object({ medida: texto, peso: texto }).strict(),
  material: texto.optional(),
  locomocao: z.object({
    terra: velocidade.optional(), voo: velocidade.optional(), natacao: velocidade.optional(),
    escalada: velocidade.optional(), escavacao: velocidade.optional(),
  }).strict(),
  centelha: naoNeg,
  attrs: z.object({
    forca: naoNeg, destreza: naoNeg, vigor: naoNeg,
    influencia: naoNeg, perspicacia: naoNeg, compostura: naoNeg,
    percepcao: naoNeg, inteligencia: naoNeg, raciocinio: naoNeg,
  }).strict(),
  skills: z.record(z.string(), naoNeg),
  skills2: z.record(z.string(), naoNeg).optional(),
  spec: z.record(z.string(), inteiro).optional(),
  virtues: z.object({ compaixao: inteiro, conviccao: inteiro, temperanca: inteiro, valor: inteiro }).strict(),
  willpower: naoNeg,
  aparencia: inteiro,
  arte: z.record(z.string(), z.number().int().min(1).max(6)).optional(),
  tech: z.record(z.string(), z.boolean()).optional(),
  conjuntos: z.array(conjuntoSchema).optional(),
  equip: equipSchema.optional(),
  ataques: z.array(ataqueSchema),
  bonus: z.object({
    pv: inteiro.optional(), defesa: inteiro.optional(), defesaSocial: inteiro.optional(),
    defesaMental: inteiro.optional(), vontade: inteiro.optional(), resistPerf: inteiro.optional(),
    iniciativa: inteiro.optional(), absorcao: inteiro.optional(),
    absorcao_impacto: inteiro.optional(), absorcao_corte: inteiro.optional(), absorcao_perfuracao: inteiro.optional(),
  }).strict().optional(),
  couraca: z.object({ couraca: naoNeg, resistPerf: naoNeg }).strict().optional(),
  poderes: z.array(poderSchema).optional(),
  fraquezas: z.array(texto).optional(),
  resistencias: z.array(texto).optional(),
  habilidades: z.array(z.object({ nome: texto, descricao: texto }).strict()),
  lore: z.array(z.object({ titulo: texto, texto }).strict()),
  ecologia: z.object({ tipo: texto, terreno: z.array(texto), clima: z.array(texto) }).strict(),
  notas: texto,
  pendente: z.boolean(),
  fonte: z.object({
    livro: texto.optional(), nome: texto.optional(), cr: texto.optional(),
    tipo: texto.optional(), tamanho: texto.optional(),
    valores: z.object({ for: valorOriginal, des: valorOriginal, con: valorOriginal, int: valorOriginal, sab: valorOriginal, car: valorOriginal }).strict().optional(),
    pericias: z.array(texto).optional(),
    nota: texto.optional(),
    exemplo: z.boolean().optional(),
    deslocamento: z.object({ ft: z.number().nonnegative(), origem: z.enum(['fonte', 'tabela']), nota: texto.optional() }).strict().optional(),
  }).strict().optional(),
  variantes: z.array(z.object({ id: texto, nome: texto, delta: z.record(z.string(), z.any()) }).strict()),
  ameacaLegada: z.number().int().min(1),
}).strict();

/**
 * Chaves de perícia que a ficha de criatura ainda usa e o catálogo já não tem.
 * Vieram dos NPCs escritos antes da Reestrutura de Perícias (28 → 24) e ficaram
 * como estavam, porque renomear é decisão de conteúdo e a fase 1 do B14 não muda
 * valor nenhum. Cada uma aponta para onde provavelmente vai: é a lista para a
 * fase seguinte, e não um mapeamento aplicado.
 */
export const PERICIAS_LEGADAS = {
  'armas-uma-mao': 'armas',
  'armas-duas-maos': 'armas',
  escudos: 'bloqueio',
  tatica: 'estrategia (secundária)',
};
