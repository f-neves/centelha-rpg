import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const custo = z.object({
  energia: z.number().int().nonnegative().optional(),
  mana: z.number().int().nonnegative().optional(),
  vontade: z.number().int().nonnegative().optional(),
});

// Um degrau de qualquer régua do jogo. `rotulo` é o nome do degrau, em campo próprio para o
// modal poder destacá-lo: sem ele, metade dos traços saía sem negrito e sem alinhamento.
const escala = z.array(z.object({
  nivel: z.number().int(),
  rotulo: z.string().optional(),
  texto: z.string(),
  conduta: z.string().optional(),
}));

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
    niveis: escala.optional(),
  }),
});

// As Secundárias são ilimitadas em número: este arquivo é o catálogo sugerido, o que
// a ficha desenha e o capítulo lista. Uma perícia criada na mesa não precisa estar aqui.
const habilidadesSecundarias = defineCollection({
  loader: file('src/data/habilidades-secundarias.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    grupo: z.enum(['corpo', 'sociais', 'conhecimento', 'oficio', 'expressao', 'subterfugio', 'interior']),
    descricao: z.string(),
    niveis: escala.optional(),
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
    modulo: z.enum(['folego']).optional(),
    caminho: reference('caminhos'),
    atributo: reference('atributos'),
    nivel: z.number().int().min(1).max(6),
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
          nivel: z.number().int().min(1).max(6),
          nome: z.string(),
          efeito: z.string(),
          custo: z.object({ mana: z.number().int().min(1).max(6) }).optional(),
          exemplos: z.array(z.string()).optional(),
        }),
      )
      .min(5).max(6),
    aliases: z.array(z.string()),
    pendente: z.boolean(),
  }),
});

const efeitos = defineCollection({
  loader: file('src/data/efeitos.json'),
  schema: z.object({
    id: z.string(),
    nome: z.string(),
    nivel: z.number().int().min(1).max(6),
    escalonavel: z.boolean(),
    artes: z.array(z.object({ id: reference('artes'), sabor: z.string() })).min(1),
    parametros: z.array(z.object({
      nome: z.string(),
      tipo: z.enum(['padrao', 'substitui', 'fixo']),
      regua: z.enum(['breve', 'longa']).optional(),
      substitui: z.string().optional(),
      unidade: z.string().optional(),
      escala: z.array(z.string()).optional(),
      valor: z.string().optional(),
      nota: z.string().optional(),
    })).min(1),
    efeito: z.string(),
    notas: z.string().optional(),
    // Não consome ação própria: sai junto com o gesto que a usa, como puxar a
    // arma da cintura ou a flecha da aljava. Ausente = a conjuração normal, que
    // custa Velocidade como qualquer outra.
    acaoLivre: z.boolean().optional(),
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

// O envelope comum a todo item do catálogo (armas.json, armaduras.json, escudos.json,
// municao.json): `tipo` no topo decide qual dos blocos abaixo vem preenchido, os outros
// ficam `null`. Decidido em leitura-de-novato-decisoes.md §5 (envelope aninhado, contra a
// recomendação técnica original, por decisão explícita do humano).
const preco = z.object({ pc: z.number().int().nonnegative() }).optional();

const soakModos = z.object({
  impacto: z.number().int(), corte: z.number().int(), perfuracao: z.number().int(),
});

const blocoArma = z.object({
  classe: z.enum(['leve', 'media', 'pesada', 'haste', 'distancia', 'arremesso']),
  atrib: reference('atributos'), pericia: reference('habilidades'),
  dado: z.number().int().min(1).max(3), danoBonus: z.number().int().optional(), acerto: z.number().int(),
  defesaArma: z.number().int(),
  maos: z.number().int().min(1).max(2), ticks: z.number().int(), folego: z.number().int().min(0),
  forcaMult: z.number().optional(),
  forcaCap: z.number().int().optional(), forcaMin: z.number().int().optional(),
  alcance: z.enum(['curto', 'medio', 'longo']).optional(),
  // distância máxima da arma, em metros. Só as de Distância e Arremesso têm.
  distMax: z.number().int().positive().optional(),
  tipoDano: z.enum(['corte', 'perfurante', 'impacto']), pen: z.number().int().min(0).max(5),
  modos: z.array(z.object({
    tipo: z.enum(['corte', 'perfurante', 'impacto']),
    perf: z.number().int().min(0).max(5).optional(),
    principal: z.boolean(),
  })),
  // Alabarda: os três modos são todos "principal" (ver notas do item); esta chave
  // escolhe qual deles a ficha desenha por padrão no card.
  fichaModo: z.enum(['corte', 'perfurante', 'impacto']).optional(),
  // Fração do alcance que não sofre penalidade de mira (arcos e bestas).
  alcanceLivreFrac: z.number().min(0).max(1).optional(),
}).nullable();

const blocoArmadura = z.object({
  classe: z.enum(['nenhuma', 'leve', 'media', 'pesada']),
  soak: soakModos, resistPerf: z.number().int().min(0),
  penalidade: z.number().int().min(0),
}).nullable();

const blocoEscudo = z.object({
  bloqCaC: z.number().int(), penalidade: z.number().int().min(0),
  // Substitui o booleano `habilProjetil`: a coluna real do capítulo tem três estados
  // (não bloqueia / bloqueia / bloqueia com bônus, caso do Pavês, +3).
  vsProjetilRapido: z.object({ bloqueia: z.boolean(), bonus: z.number().int().nonnegative() }),
}).nullable();

const blocoMunicao = z.object({
  // ids de `armas.json` que aceitam esta munição.
  aceita: z.array(z.string()),
}).nullable();

const envelopeItem = z.object({
  id: z.string(), nome: z.string(),
  tipo: z.enum(['arma', 'armadura', 'escudo', 'municao', 'geral', 'comida', 'roupa', 'montaria', 'veiculo', 'servo']),
  preco,
  peso: z.number().nonnegative(),
  acesso: z.number().int().optional(),
  descricao: z.string(),
  tags: z.array(z.string()),
  arma: blocoArma,
  armadura: blocoArmadura,
  escudo: blocoEscudo,
  municao: blocoMunicao,
});

const armas = defineCollection({
  loader: file('src/data/armas.json'),
  schema: envelopeItem,
});

const armaduras = defineCollection({
  loader: file('src/data/armaduras.json'),
  schema: envelopeItem,
});

const escudos = defineCollection({
  loader: file('src/data/escudos.json'),
  schema: envelopeItem,
});

const municao = defineCollection({
  loader: file('src/data/municao.json'),
  schema: envelopeItem,
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
    defesaSocial: z.union([z.number().int(), z.literal('-')]), // "-" = só Int 0 (sem mente); Int 1 usa Sobrevivência no lugar de Sociabilidade
    defesaMental: z.union([z.number().int(), z.literal('-')]), // "-" = sem mente (Int 0: constructos, limos, plantas, mortos-vivos sem mente)
    vontade: z.number().int(),
    soak: soakModos, resistPerf: z.number().int().min(0),
    iniciativa: z.string(),
    atributos: z.record(z.number().int()),
    ataques: z.array(z.object({ nome: z.string(), pool: z.string(), dano: z.string(), ticks: z.number().int(), notas: z.string().optional() })),
    tecnicas: z.array(reference('tecnicas')),
    artes: z.array(z.object({ id: reference('artes'), nivel: z.number().int().min(1).max(6) })),
    // Dois formatos convivem desde o B14 fase 2 (ver scripts/criatura-schema.mjs, poderSchema):
    // o natural novo (id/nome/base/resiste/area/usos/ataque) e o legado (efeito/tipo/alvo/arte/caminho).
    poderes: z.array(z.union([
      z.object({
        id: z.string(), nome: z.string(), tipo: z.literal('natural'),
        base: z.object({ arte: z.string(), nivel: z.number().int().min(1).max(6) }).optional(),
        resiste: z.enum(['esquiva', 'corpo', 'mente', 'nenhum']),
        area: z.string().optional(), efeito: z.string(), ataque: z.string().optional(),
        usos: z.object({
          quantidade: z.number().int().nonnegative().optional(),
          periodo: z.enum(['ticks', 'cena', 'hora', 'dia', 'avontade', 'passivo', 'golpe']),
          recarga: z.string().optional(),
        }),
      }),
      z.object({
        efeito: z.string(),
        tipo: z.enum(['proeza', 'feiticaria', 'natural']),
        alvo: z.string(),
        caminho: z.string().optional(),
        arte: z.string().optional(),
      }),
    ])).optional(),
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
  habilidadesSecundarias,
  virtudes,
  caminhos,
  tecnicas,
  artes,
  efeitos,
  glossario,
  inimigos,
  armas,
  armaduras,
  escudos,
  municao,
  chapters,
};
