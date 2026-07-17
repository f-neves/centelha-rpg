import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const custo = z.object({
  energia: z.number().int().nonnegative().optional(),
  mana: z.number().int().nonnegative().optional(),
  vontade: z.number().int().nonnegative().optional(),
});

const escala = z.array(z.object({ nivel: z.number().int(), texto: z.string(), conduta: z.string().optional() }));

const atributos = defineCollection({
  loader: file('src/data/atributos.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    grupo: z.enum(['fisico', 'social', 'mental']),
    descricao: z.string(),
    niveis: escala.optional(),
  }),
});

const habilidades = defineCollection({
  loader: file('src/data/habilidades.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    grupo: z.enum(['combate', 'fisica', 'social', 'saber', 'tecnica']),
    atributos: z.array(z.string()).optional(),
    secundaria: z.boolean().optional(),
    descricao: z.string(),
  }),
});

const virtudes = defineCollection({
  loader: file('src/data/virtudes.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    resiste: z.string(),
    descricao: z.string(),
    niveis: escala.optional(),
  }),
});

const caminhos = defineCollection({
  loader: file('src/data/caminhos.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    trilha: z.enum(['corpo', 'voz', 'mente']),
    atributo: reference('atributos'),
    habilidade_ancora: z.string().optional(),
    descricao: z.string(),
  }),
});

const tecnicas = defineCollection({
  loader: file('src/data/tecnicas.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    caminho: reference('caminhos'),
    atributo: reference('atributos'),
    banda: z.number().int().min(1).max(15),
    nivel: z.number().int().min(1).max(5),
    efeito: z.enum(['bonus', 'soak', 'dano', 'penetracao', 'carga', 'salto', 'velocidade', 'tamanho', 'estado']),
    tipo: z.enum(['passiva', 'ativa', 'reflexiva']),
    custo,
    prereq: z.array(reference('tecnicas')),
    aliases: z.array(z.string()),
    texto: z.string(),
    pendente: z.boolean(),
  }),
});

const artes = defineCollection({
  loader: file('src/data/artes.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    categoria: z.enum(['elemental', 'universal']),
    atributo_conjuracao: reference('atributos'),
    niveis: z
      .array(
        z.object({
          nivel: z.number().int().min(1).max(5),
          nome: z.string(),
          efeito: z.string(),
          custo: z.object({ mana: z.number().int().min(1).max(5) }),
        }),
      )
      .length(5),
    aliases: z.array(z.string()),
    pendente: z.boolean(),
  }),
});

const glossario = defineCollection({
  loader: file('src/data/glossario.json'),
  schema: z.object({
    id: z.string(),
    termo: z.string(),
    aliases: z.array(z.string()),
    definicao: z.string(),
  }),
});

const armas = defineCollection({
  loader: file('src/data/armas.json'),
  schema: z.object({
    id: z.string(), nome: z.string(),
    classe: z.enum(['leve', 'media', 'pesada', 'haste', 'distancia', 'arremesso']),
    atrib: reference('atributos'), pericia: reference('habilidades'),
    dado: z.number().int().min(1).max(3), acerto: z.number().int(),
    defesaArma: z.number().int(),
    maos: z.number().int().min(1).max(2), ticks: z.number().int(), folego: z.number().int().min(0),
    forcaMult: z.number().optional(),
    tipoDano: z.enum(['corte', 'projetil', 'perfConc', 'impacto']), pen: z.number().int().min(0).max(5),
    modos: z.array(z.object({
      tipo: z.enum(['corte', 'projetil', 'perfConc', 'impacto']),
      perf: z.number().int().min(0).max(5).optional(),
      principal: z.boolean(),
    })),
    tags: z.array(z.string()), notas: z.string(),
  }),
});

const soakModos = z.object({
  impacto: z.number().int(), corte: z.number().int(), perfuracao: z.number().int(),
});

const armaduras = defineCollection({
  loader: file('src/data/armaduras.json'),
  schema: z.object({
    id: z.string(), nome: z.string(), classe: z.enum(['nenhuma', 'leve', 'media', 'pesada']),
    soak: soakModos, resistPerf: z.number().int().min(0),
    penalidade: z.number().int().min(0), acesso: z.number().int().optional(), notas: z.string(),
  }),
});

const escudos = defineCollection({
  loader: file('src/data/escudos.json'),
  schema: z.object({
    id: z.string(), nome: z.string(),
    bloqCaC: z.number().int(), bloqProjetil: z.number().int(), penalidade: z.number().int(),
    acesso: z.number().int().optional(), notas: z.string(),
  }),
});

const inimigos = defineCollection({
  loader: file('src/data/inimigos.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.enum(['capanga', 'soldado', 'elite', 'fera', 'chefe']),
    categoria: z.string().optional(),
    ameaca: z.number().int().min(1).max(6),
    centelha: z.number().int().min(0).max(10),
    conceito: z.string(),
    descricao: z.string(),
    tags: z.array(z.string()),
    pv: z.number().int(),
    defesa: z.number().int(),
    defesaMental: z.union([z.number().int(), z.literal('-')]), // "-" = sem mente (constructos)
    vontade: z.number().int(),
    soak: soakModos, resistPerf: z.number().int().min(0),
    iniciativa: z.string(),
    atributos: z.record(z.number().int()),
    ataques: z.array(z.object({ nome: z.string(), pool: z.string(), dano: z.string(), ticks: z.number().int(), notas: z.string().optional() })),
    tecnicas: z.array(reference('tecnicas')),
    artes: z.array(z.object({ id: reference('artes'), nivel: z.number().int().min(1).max(5) })),
    poderes: z.array(z.object({
      efeito: z.string(),
      tipo: z.enum(['proeza', 'feiticaria', 'natural']),
      alvo: z.string(),
      caminho: z.string().optional(),
      arte: z.string().optional(),
    })).optional(),
    notas: z.string(),
    pendente: z.boolean(),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/chapters' }),
  schema: z.object({
    ordem: z.number().int(),
    numeral: z.string(),
    titulo: z.string(),
    resumo: z.string(),
  }),
});

export const collections = {
  atributos,
  habilidades,
  virtudes,
  caminhos,
  tecnicas,
  artes,
  glossario,
  inimigos,
  armas,
  armaduras,
  escudos,
  chapters,
};
