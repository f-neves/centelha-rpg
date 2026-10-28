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
  classe: z.enum(['leve', 'media', 'haste', 'pesada', 'distancia', 'arremesso']).optional(), // as seis do armas.json
  /** O id da arma de tiro no armas.json (o arco, a besta): a Força no dano segue a regra dela (forcaMult, forcaCap, forcaMin), como na ficha do personagem. */
  arma: texto.optional(),
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
  /** A Mana da ficha (D-196), só em quem tem Artes. */
  mana: z.number().int().nonnegative().optional(),
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
    defesaMental: naoNeg.nullable(), // null: "imune" na ficha (Inteligência 0)
    defesaSocial: naoNeg.nullable(),
    /** Corte e Perfuração levam o valor do Impacto: a Couraça fica fora da Absorção
     *  até o autor decidir o valor dos níveis (manual, linha 102). */
    absorcao: z.object({ impacto: naoNeg, corte: naoNeg, perfuracao: naoNeg }).strict(),
    couracaNivel: naoNeg,
    pesoErguido: z.number().nonnegative().nullable(), // null: "não ergue" na ficha (o incorpóreo)
    carga: z.object({ leve: z.number(), media: z.number(), pesada: z.number(), maxima: z.number() }).strict().optional(),
    deslocamento: z.object({
      terra: z.object({ batalha: naoNeg, arranque: naoNeg, corrida: naoNeg }).strict().optional(),
      voo: z.object({ batalha: naoNeg, arranque: naoNeg.optional(), corrida: naoNeg.optional(), cruzeiro: naoNeg.optional(), mergulho: naoNeg.optional() }).strict().optional(),
      nado: naoNeg.or(z.object({ batalha: naoNeg, arranque: naoNeg, corrida: naoNeg }).strict()).optional(),
    }).strict(), /** D-206: a criatura vestida (o Equipamento da ficha pela conta do livro); só quem veste armadura ou escudo */ vestida: z.object({ esquiva: z.number().int(), bloqueio: z.number().int(), defesa: naoNeg, contraTiro: z.number().int(), absorcao: z.object({ impacto: naoNeg, corte: naoNeg, perfuracao: naoNeg }).strict(), nivel: naoNeg, penalidade: naoNeg }).strict().optional(),
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

// ===================================================================== a versão nova
// O FORMATO UNIFICADO (formato-criatura.md, tmp/arquiteto/bestiario/formato-json/; D-216 a D-239), que o conversor
// novo (scripts/conversor-criatura.mjs, plano-conversao.md A3) escreve. Toda chave `.strict()`, como o de cima: só
// entrada e escolha, sem número que o motor calcula. O de cima sai na troca (A5), junto com o conversor velho.
const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const numero = z.number();
const formasMarca = z.union([z.literal('todas'), z.array(id).min(1)]);
const corpoNovo = z.object({
  postura: texto, apoio: z.enum(['bipede', 'quadrupede', 'outro']),
  altura: numero, largura: numero, profundidade: numero.nullable(), comprimento: numero.nullable(),
  comprimentoSemCauda: numero.optional(), envergadura: numero.optional(), caudaGrossa: z.boolean().optional(),
  massa: numero.optional(), semMassa: z.literal(true).optional(), volume: numero.optional(),
  // P5, 26/10/2026: só em quem escreve "não ergue", independente de semMassa.
  naoErgue: z.literal(true).optional(),
  area: numero, posturaDoTamanho: texto.optional(),
  segundoTamanho: z.object({ area: numero, posturaDoTamanho: texto, tamanhoEscolhido: id.optional() }).strict().optional(),
  tamanhoEscolhido: id.optional(), linhaPV: z.enum(['acima', 'abaixo']).optional(), cargaMedida: numero.optional(),
}).strict();
const especialidadesNovo = z.record(id, z.array(z.object({ foco: texto, valor: naoNeg, origem: z.enum(['natural', 'livro']) }).strict()));
const numeroPasso = numero.finite().nonnegative();
const passo = z.object({ batalha: numeroPasso, arranque: numeroPasso.optional(), corrida: numeroPasso.optional() }).strict();
const deslocamentoNovo = z.object({ terra: passo.optional(), voo: passo.optional(), nado: passo.optional(), escavacao: passo.optional(), escalada: passo.optional() }).strict();
const equipamentoNovo = z.object({
  arsenal: z.array(z.object({ ref: z.string().regex(/^[ae]:[a-z0-9-]+$/) }).strict()),
  armaduras: z.array(z.object({ base: id, vestida: z.boolean() }).strict()),
}).strict();
const ataqueNatural = z.object({
  nome: texto, parte: id, habilidade: id, classe: id, pgr: z.tuple([naoNeg, z.literal(1), naoNeg]),
  dado: z.string().regex(/^\d+d6([+-]\d+)?$/).nullable(), multiplicadorForca: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  tipoDano: id, nivelPerfuracao: naoNeg.nullable(), acerto: inteiro, bloqueiaComoArma: inteiro.nullable(),
}).strict();
const ataqueComArma = z.object({ nome: texto, arma: id, habilidade: id }).strict();
const ataqueNovo = z.union([ataqueComArma, ataqueNatural]);
const oitoCampos = { ativacao: texto, duracao: texto, alcance: texto, area: texto, efeito: texto, dano: texto, resistencia: texto, limiteDeUso: texto };
const habilidadeEspecial = z.object({
  nome: texto, formas: formasMarca, classe: z.enum(['livro', 'regra da ficha', 'sem regra ainda']),
  ataque: texto.optional(), base: z.object({ arte: id, nivel: naoNeg }).strict().optional(), regra: id.optional(),
  // P7, 26/10/2026: referências ao livro; texto só acrescenta detalhe ou limite próprio da criatura.
  tecnica: z.object({ id, nivel: naoNeg }).strict().optional(), arte: z.object({ id, nivel: naoNeg }).strict().optional(), texto: texto.optional(),
  ...Object.fromEntries(Object.entries(oitoCampos).map(([k, v]) => [k, v.optional()])),
}).strict();
const elementoNovo = z.array(z.object({ tipo: id, formas: formasMarca }).strict());
const fisiologiaNovo = z.object({ respiracao: texto.optional(), prendeRespiracao: texto.optional(), camuflagem: texto.optional(), mente: texto.optional(), tracos: texto.optional() }).strict();
const aptidoesNovo = z.object({ montaria: z.boolean(), carga: z.boolean(), tracao: z.boolean() }).strict();
const numeros = z.record(id, inteiro);
const formaNova = z.object({
  id, nome: texto, corpo: corpoNovo.partial().optional(), couraca: naoNeg.optional(), atributos: numeros.optional(), aparencia: naoNeg.optional(),
  deslocamento: deslocamentoNovo.optional(), equipamento: equipamentoNovo.partial().optional(), artes: numeros.optional(),
  fisiologia: fisiologiaNovo.optional(), aptidoes: aptidoesNovo.optional(), ataques: z.array(ataqueNovo).optional(),
}).strict();
export const criaturaNovaSchema = z.object({
  id, idAntigo: texto.optional(), nome: texto, nomeIngles: texto.nullable(), categoria: id, papel: id,
  ameaca: z.number().int().min(1).max(6), centelha: z.number().int().min(0).max(12),
  formaPrincipal: z.object({ id, nome: texto }).strict().optional(),
  enxame: z.object({ individuosPorQuadrado: z.number().int().positive(), tamanhoEquivalente: z.enum(['minusculo','miudo','pequeno','medio','grande','enorme','imenso','colossal']) }).strict().optional(),
  corpo: corpoNovo, couraca: z.number().int().min(0).max(12), bonusPV: inteiro.optional(),
  atributos: z.object({ forca: naoNeg, destreza: naoNeg, vigor: naoNeg, percepcao: naoNeg, inteligencia: naoNeg, raciocinio: naoNeg, influencia: naoNeg, perspicacia: naoNeg, compostura: naoNeg }).strict(),
  habilidades: numeros, habilidadesSec: numeros, especialidades: especialidadesNovo, especialidadesSec: especialidadesNovo,
  virtudes: z.object({ bravura: naoNeg, compaixao: naoNeg, conviccao: naoNeg, temperanca: naoNeg }).strict(),
  vontade: naoNeg, aparencia: z.number().int().min(0).max(12),
  deslocamento: deslocamentoNovo, equipamento: equipamentoNovo, artes: numeros,
  bolsas: z.array(z.object({ nome: texto, itens: z.array(z.object({ item: texto, peso: numero, preco: numero }).strict()) }).strict()).optional(),
  ataques: z.array(ataqueNovo), formas: z.array(formaNova).optional(),
  habilidadesEspeciais: z.array(habilidadeEspecial),
  comoLuta: z.array(z.object({ nome: texto, formas: formasMarca, texto }).strict()),
  sentidos: z.array(z.object({ nome: texto, descricao: texto, formas: formasMarca, classe: z.literal('sem regra ainda').optional() }).strict()),
  elementos: z.object({ fraquezas: elementoNovo, resistencias: elementoNovo, imunidades: elementoNovo }).strict(),
  fisiologia: fisiologiaNovo, aptidoes: aptidoesNovo,
  comportamento: z.object({ social: texto, atividade: texto, dieta: texto, caca: texto, dianteDeGente: texto }).strict(),
  ecologia: z.object({ terreno: z.array(texto), clima: z.array(texto) }).strict(),
  descricao: texto, lore: z.array(z.object({ titulo: texto, texto }).strict()), imagens: z.array(texto),
  revisao: z.array(z.object({ campo: texto, motivo: texto }).strict()),
}).strict();
