// O FORMATO de uma ficha salva, escrito.
//
// Por que aqui e não em `src/lib/`: o zod é dependência de desenvolvimento, e um
// esquema morando em `src/` corre o risco de ser importado por uma página e
// despachar 60 KB de validador para o navegador de quem só queria ler as regras.
// Aqui ele fica ao lado de `validate-data.mjs`, que já valida os catálogos com o
// mesmo zod, e só o portão o carrega.
//
// O QUE ISTO GUARDA
// `src/lib/equip.ts` é o contrato silencioso entre a ficha e a mesa: a ficha
// escreve `conjuntos` e `equip.armaduras`, e o rastreador de combate lê os dois
// por `armaDoSlot`, `escudoDoSlot` e `armadurasDe`. Mudar a forma do objeto não
// gera conflito no git, não quebra nenhum tipo (o arquivo é `any` de ponta a
// ponta) e derruba o combate sem avisar. Este esquema é onde a forma passa a
// existir por escrito, e `test-contrato.mjs` é quem a cobra.
import { z } from 'zod';

/** Uma peça escolhida num slot de mão. `ref` é "a:<arma>", "e:<escudo>" ou "nada". */
export const slotSchema = z.object({
  ref: z.string().regex(/^(a:[a-z0-9-]+|e:[a-z0-9-]+|nada)$/,
    'ref precisa ser "a:<arma>", "e:<escudo>" ou "nada"'),
  // O ajuste de qualidade: os campos de CAMPOS_ARMA / CAMPOS_ESCUDO, todos opcionais.
  mod: z.record(z.string(), z.union([z.number(), z.string(), z.null()])).optional(),
  // Liga o slot à peça do arsenal, para a mesma espada em dois conjuntos mostrar a
  // mesma foto. A mesa não lê, mas a ficha depende.
  uid: z.string().optional(),
}).passthrough();

/** Um conjunto de mãos. Exatamente um deles é o `ativo`, e é o que a mesa usa. */
export const conjuntoSchema = z.object({
  ativo: z.boolean(),
  habil: slotSchema,
  inabil: slotSchema.nullable().optional(),
  uidH: z.string().optional(),
  uidI: z.string().optional(),
}).passthrough();

/** Uma peça de armadura no modelo novo (o antigo é uma string com o id do catálogo). */
export const pecaArmaduraSchema = z.union([
  z.string(),
  z.object({
    base: z.string(),
    uid: z.string().optional(),
    nome: z.string().optional(),
    vestida: z.boolean().optional(),
    mod: z.record(z.string(), z.union([z.number(), z.string(), z.null()])).optional(),
    img: z.string().optional(),
  }).passthrough(),
]);

export const equipSchema = z.object({
  armaduras: z.array(pecaArmaduraSchema).default([]),
  armMod: z.record(z.string(), z.any()).optional(),
  // O modelo ANTIGO, que continua válido em fichas gravadas antes dos conjuntos.
  arma: z.string().optional(),
  escudo: z.string().optional(),
}).passthrough();

/**
 * A ficha, do ponto de vista de quem a LÊ do outro lado (a mesa).
 *
 * Só os campos de que a mesa depende são exigidos. O resto da ficha é assunto da
 * ficha, e `passthrough` deixa passar sem reclamar: este esquema é um contrato de
 * leitura, não um molde do arquivo inteiro.
 */
export const fichaSchema = z.object({
  attrs: z.record(z.string(), z.number()),
  skills: z.record(z.string(), z.number()),
  skills2: z.record(z.string(), z.number()).optional(),
  virtues: z.record(z.string(), z.number()).optional(),
  willpower: z.number(),
  centelha: z.number(),
  aparencia: z.number().optional(),
  conjuntos: z.array(conjuntoSchema).min(1).optional(),
  equip: equipSchema.optional(),
  arte: z.record(z.string(), z.number()).optional(),
  tech: z.record(z.string(), z.boolean()).optional(),
}).passthrough();

/**
 * Confere que toda `ref` de um conjunto aponta para peça que existe no catálogo.
 *
 * É a metade que o esquema sozinho não pega: `a:espada-lomga` tem a forma certa e
 * vira `null` em silêncio no `armaDoSlot`. Recebe os catálogos de fora para não
 * duplicar aqui a leitura dos JSON.
 */
export function refsExistem(ficha, { armas, escudos, armaduras }) {
  const erros = [];
  const idsArma = new Set(armas.map((w) => w.id));
  const idsEscudo = new Set(escudos.map((s) => s.id));
  const idsArmadura = new Set(armaduras.map((a) => a.id));
  (ficha.conjuntos || []).forEach((cj, i) => {
    for (const mao of ['habil', 'inabil']) {
      const ref = cj[mao]?.ref;
      if (!ref || ref === 'nada') continue;
      const [tipo, id] = [ref.slice(0, 1), ref.slice(2)];
      if (tipo === 'a' && !idsArma.has(id)) erros.push(`conjunto ${i}, mão ${mao}: arma "${id}" não existe no catálogo`);
      if (tipo === 'e' && !idsEscudo.has(id)) erros.push(`conjunto ${i}, mão ${mao}: escudo "${id}" não existe no catálogo`);
    }
  });
  for (const p of ficha.equip?.armaduras || []) {
    const base = typeof p === 'string' ? p : p?.base;
    // 'c' é a peça livre (ID_ARMADURA_LIVRE), que de propósito não está no catálogo.
    if (base && base !== 'c' && !idsArmadura.has(base)) erros.push(`armadura "${base}" não existe no catálogo`);
  }
  return erros;
}
