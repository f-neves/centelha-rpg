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
  /** Arma de arremesso (pedra, lança): à distância mas soma Força, ao contrário de
   *  um disparo comum (arco, sopro). B14 fase 3. */
  arremesso: z.boolean().optional(),
  tipo: texto,
  acerto: inteiro.optional(),
  perf: naoNeg.optional(),
  ticks: z.number().int().min(1),
  notas: texto.optional(),
  /** Ficha v3 (D-179, decisoes-etapa-6.md §4): o que soma ao dado, que pode ser
   *  negativo ("1d6 − 2"), e a classe pronta, que vale no lugar da deduzida. */
  danoBonus: inteiro.optional(),
  /** `false`: o golpe não soma a Força (o bico do falcão-peregrino). */
  forca: z.literal(false).optional(),
  classe: z.enum(['leve', 'media', 'pesada']).optional(),
}).strict();

/** Poder natural: o dom da própria criatura (B14 fase 2, item A.2). NÃO passa pelo
 *  portão de Centelha e NÃO usa Mana. `base` só referencia o Efeito Especial mais
 *  parecido, para copiar parâmetro (área, dano); não é uma conjuração de verdade.
 *  `resiste` é categoria, sem fórmula própria: a fórmula de "corpo" está em
 *  auditoria (docs/pendencias/M-virtude-somada.md) — não escrever "Vigor +
 *  Convicção" aqui enquanto ela não fechar. */
export const poderNaturalSchema = z.object({
  id: texto,
  nome: texto,
  tipo: z.literal('natural'),
  base: z.object({ arte: texto, nivel: z.number().int().min(1).max(6) }).strict().optional(),
  resiste: z.enum(['esquiva', 'corpo', 'mente', 'nenhum']),
  area: texto.optional(),
  efeito: texto,
  /** Texto em prosa, adaptado da fonte e escrito próprio (B14 fase 4, item 4): o que o
   *  poder faz na ficção e nos números dela, mesmo sem regra ainda no sistema para
   *  aquele efeito. O Mestre tem de conseguir usar o poder só com este texto. */
  descricao: texto.optional(),
  /** Só veneno e toque: o `nome` do ataque em `ataques` que carrega o poder, porque
   *  o efeito sai no golpe (resposta da fase 2, item 1). */
  ataque: texto.optional(),
  usos: z.object({
    quantidade: naoNeg.optional(),
    periodo: z.enum(['ticks', 'cena', 'hora', 'dia', 'avontade', 'passivo', 'golpe']),
    recarga: texto.optional(),
  }).strict(),
}).strict();

/** Poder no formato de antes do B14 fase 2: `efeito`/`tipo`/`alvo`, com `tipo`
 *  natural, proeza ou feiticaria. Continua valendo para os três tipos, inclusive
 *  `natural`, porque 16 fichas já têm poder `natural` nesse formato (classificação
 *  da tabela de poderes ainda não aplicada — ver docs/simulacao/caixa/
 *  b14-fase2-executora.md, "Onde parei") e o schema não pode quebrar dado já
 *  commitado. Quando a classificação fechar, a ideia é migrar essas 16 para
 *  `poderNaturalSchema` e apertar este tipo para só proeza/feiticaria. */
const poderLegadoSchema = z.object({
  efeito: texto,
  tipo: z.enum(['natural', 'proeza', 'feiticaria']),
  alvo: texto,
  arte: texto.optional(),
  caminho: texto.optional(),
}).strict();

export const poderSchema = z.union([poderNaturalSchema, poderLegadoSchema]);

// Teto subiu de 20 para 30 na B14 fase 3: dragões anciãos e o jato do Kraken passam de 20 m/Tick
// (250 ft e 280 ft na fonte, ÷10).
const velocidade = z.number().int().min(1).max(30);
const valorOriginal = z.union([z.number(), z.literal('-'), z.null()]);

/** Forma do corpo, para as três medidas (B14 fase 2, item A.1). A forma comum
 *  (humanoide) dá o padrão implícito do porte; só forma NÃO padrão exige
 *  comprimento, largura e altura escritos. */
const FORMA_PADRAO = 'humanoide';
export const dimensoesSchema = z.object({
  medida: texto,
  peso: texto,
  comprimento: z.number().positive().optional(),
  largura: z.number().positive().optional(),
  altura: z.number().positive().optional(),
  envergadura: z.number().positive().optional(),
  forma: z.enum(['humanoide', 'quadrupede', 'serpentiforme', 'alado', 'amorfo', 'radial']).optional(),
}).strict().refine(
  (d) => (d.forma ?? FORMA_PADRAO) === FORMA_PADRAO || (d.comprimento != null && d.largura != null && d.altura != null),
  { message: 'forma não padrão (fora de humanoide) exige comprimento, largura e altura' },
);

export const criaturaSchema = z.object({
  ordem: z.number().int().min(1).optional(),
  id: z.string().regex(/^[a-z0-9-]+$/, 'id em minúsculas, números e hífen'),
  /** O id de antes da troca da D-179 (`mon-lobo`, `camponis-assustado`). Tem de
   *  bater com o par do `ids-antigos.json` (o validate confere nos dois sentidos). */
  idAntigo: z.string().regex(/^[a-z0-9-]+$/).optional(),
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
  /** A segunda imagem (D-179, item 16): só onde há `imagem`; o clique no card troca. */
  imagem2: texto.optional(),
  porte: z.enum(['Minúsculo', 'Miúdo', 'Pequeno', 'Médio', 'Grande', 'Enorme', 'Imenso', 'Colossal']),
  dimensoes: dimensoesSchema,
  material: texto.optional(),
  constructo: z.object({ semVida: z.literal(true) }).strict().optional(),
  locomocao: z.object({
    terra: velocidade.optional(), voo: velocidade.optional(), natacao: velocidade.optional(),
    escalada: velocidade.optional(), escavacao: velocidade.optional(),
    /** Jato de propulsão (B14 fase 3): só para trás, em linha reta, consome a ação
     *  inteira. Uso restrito ao Kraken; não generalizar sem pedido novo. */
    jato: velocidade.optional(),
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
  /** Referência ao Caminho/Técnica de um poder que a classificação da tabela (B14
   *  fase 2) moveu para natural/ataques/habilidades, inerte até as Proezas fecharem
   *  (resposta do autor, item 2). Nenhum gerador lê ainda. */
  proezaFutura: z.array(z.object({ caminho: texto, tecnica: texto.optional() }).strict()).optional(),
  fraquezas: z.array(texto).optional(), // D-195: ids do elementos-vocab.json ("acido", "perfuracao"), na ordem dele; o validate-data cobra o vocabulário, a repetição e o choque entre as três
  resistencias: z.array(texto).optional(), // na ficha v3 as três vêm sempre, mesmo vazias, da linha Elementos; veneno, doença e magia ficam fora (D-190: "sem regra ainda:" nas Manobras)
  /** Imunidade a um tipo de dano (B14 fase 4, item 5): dano daquele tipo é zero. Se um
   *  efeito (não o dado da própria criatura) impuser fraqueza ao mesmo tipo por cima,
   *  o dano volta a ser normal (regras.json, ao lado de fraqueza/resistência). Mesmo
   *  vocabulário fechado de fraquezas/resistencias. */
  imunidades: z.array(texto).optional(),
  /** Quem muda de forma (D-201; manual §5.2, item 1): as formas, a da ficha primeiro, e o id
   *  dela em `principal`. Sem a linha Formas na ficha, o campo não existe. Lido por
   *  `formasDaFicha` (lib-ficha-v3.mjs); o site vai deixar alternar entre elas. */
  transforma: z.object({
    principal: z.string().min(1),
    formas: z.array(z.object({ id: z.string().min(1), nome: z.string().min(1) }).strict()).min(2),
  }).strict().refine((t) => t.formas[0].id === t.principal, { message: '`principal` tem de ser o id da primeira forma' }).optional(),
  habilidades: z.array(z.object({
    nome: texto, descricao: texto,
    /** Ficha v3: de onde vem a regra da manobra (manual §5.2, item 9). */
    classe: z.enum(['livro', 'regra da ficha', 'sem regra ainda', 'como luta']).optional(),
  }).strict()),
  lore: z.array(z.object({ titulo: texto, texto }).strict()),
  ecologia: z.object({ tipo: texto, terreno: z.array(texto), clima: z.array(texto) }).strict(),
  notas: texto,
  pendente: z.boolean(),
  fonte: z.object({
    livro: texto.optional(), nome: texto.optional(), cr: texto.optional(),
    /** Confiança do CR (B14 fase 4): "confirmado" (conferido na fonte, número exato),
     *  "conhecido" (a fonte é clara, mas a leitura teve alguma dúvida menor) ou
     *  "estimado" (sem fonte direta, por comparação com criatura parecida). */
    crConf: z.enum(['confirmado', 'conhecido', 'estimado']).optional(),
    tipo: texto.optional(), tamanho: texto.optional(),
    valores: z.object({ for: valorOriginal, des: valorOriginal, con: valorOriginal, int: valorOriginal, sab: valorOriginal, car: valorOriginal }).strict().optional(),
    pericias: z.array(texto).optional(),
    nota: texto.optional(),
    exemplo: z.boolean().optional(),
    deslocamento: z.object({ ft: z.number().nonnegative(), origem: z.enum(['fonte', 'tabela']), nota: texto.optional() }).strict().optional(),
  }).strict().optional(),
  variantes: z.array(z.object({ id: texto, nome: texto, delta: z.record(z.string(), z.any()) }).strict()),
  ameacaLegada: z.number().int().min(1),
  /** Saída da recalibração B14 (item A.3, mais o item 5 da resposta da fase 2):
   *  vazia até a bancada rodar. A recompensa de caça usa só `individual`; `bando`
   *  é referência de leitura, não soma na conta. Escala 0-12, onde 0 = feito para
   *  4 personagens de Centelha 0. `maisUm` é quantos indivíduos juntos sobem o
   *  desafio em 1 grau. */
  desafio: z.object({
    individual: z.number().int().min(0).max(12).optional(),
    maisUm: naoNeg.optional(),
    bando: z.object({ quantidade: naoNeg, desafio: z.number().int().min(0).max(12) }).strict().optional(),
  }).strict().optional(),

  // ---- a ficha v3 (D-179; formato em decisoes-etapa-6.md §3 e §4) ----
  /** Os números prontos da ficha. Quando existe, o `stat()` usa estes no lugar da
   *  conta pelo porte (lib-bestiario.mjs); as criaturas sem ficha nova seguem a conta. */
  v3: z.object({
    pv: naoNeg,
    esquiva: naoNeg,
    bloqueio: naoNeg,
    /** o bônus da arma que bloqueia (coluna "Bloqueia como arma" da ficha). O `bloqueio`
     *  acima vem sem ele desde a D-190, e a `defesa` já o soma. */
    bloqueioArma: naoNeg.optional(),
    /** o maior entre Esquiva e Bloqueio (com a arma), que é a Defesa do card (manual §5.2, item 7) */
    defesa: naoNeg,
    defesaMental: naoNeg,
    defesaSocial: naoNeg,
    /** Corte e Perfuração levam o valor do Impacto: a Couraça fica fora da Absorção
     *  até o autor decidir o valor dos níveis (manual, linha 102). */
    absorcao: z.object({ impacto: naoNeg, corte: naoNeg, perfuracao: naoNeg }).strict(),
    couracaNivel: naoNeg,
    pesoErguido: z.number().nonnegative(),
    carga: z.object({ leve: z.number(), media: z.number(), pesada: z.number(), maxima: z.number() }).strict().optional(),
    deslocamento: z.object({
      terra: z.object({ batalha: naoNeg, arranque: naoNeg, corrida: naoNeg }).strict().optional(),
      voo: z.object({ batalha: naoNeg, cruzeiro: naoNeg.optional(), mergulho: naoNeg.optional() }).strict().optional(),
      nado: naoNeg.optional(),
    }).strict(),
  }).strict().optional(),
  /** Batalha, Arranque e Corrida congelados na ficha (o gen-monsters.mjs já lê). */
  deslocamentoDeclarado: z.object({ batalha: velocidade, arranque: velocidade, corrida: z.number().int().min(1).max(40) }).strict().optional(),
  especialidades: z.array(z.object({
    habilidade: texto, foco: texto, valor: z.number().int().min(1),
    origem: z.enum(['natural', 'livro']),
  }).strict()).optional(),
  /** As linhas de jogo da ficha (manual §5.4), com o texto inteiro. */
  venenos: z.array(z.object({ nome: texto, texto }).strict()).optional(),
  doencas: z.array(z.object({ nome: texto, texto }).strict()).optional(),
  enxame: z.array(z.object({ nome: texto, texto }).strict()).optional(),
  /** Ficam na fonte e não vão ao monsters.json nem ao card (D-173, D-174). */
  notasObservacao: z.array(texto).optional(),
}).strict();

/** As Habilidades só de criatura (decisoes-etapa-6.md §8): o portão as aceita em
 *  `skills2` e como Habilidade de ataque, e nenhum JSON do livro as recebe. */
export const HABILIDADES_DE_CRIATURA = ['musculatura', 'corrida', 'voo', 'disparo'];

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
