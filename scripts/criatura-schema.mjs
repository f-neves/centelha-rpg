// Contrato unificado da fonte da criatura. Só entradas e escolhas, sem derivados.
import { z } from 'zod';
import artesCatalogo from '../src/data/artes.json' with { type: 'json' };
import elementosVocab from '../src/data/elementos-vocab.json' with { type: 'json' };
const inteiro=z.number().int(),naoNeg=inteiro.nonnegative(),texto=z.string();
export const HABILIDADES_DE_CRIATURA=['musculatura','corrida','voo','disparo'];
const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const numero = z.number();
const tamanho = z.enum(['minusculo','miudo','pequeno','medio','grande','enorme','imenso','colossal']);
const formasMarca = z.union([z.literal('todas'), z.array(id).min(1)]);
const corpoNovo = z.object({
  postura: texto, apoio: z.enum(['bipede', 'quadrupede', 'outro']),
  altura: numero, largura: numero, profundidade: numero.nullable(), comprimento: numero.nullable(),
  comprimentoSemCauda: numero.optional(), envergadura: numero.optional(), caudaGrossa: z.boolean().optional(),
  massa: numero.optional(), semMassa: z.literal(true).optional(), volume: numero.optional(),
  // P5, 26/10/2026: só em quem escreve "não ergue", independente de semMassa.
  naoErgue: z.literal(true).optional(),
  area: numero, posturaDoTamanho: texto.trim().min(1),
  segundoTamanho: z.object({ area: numero, posturaDoTamanho: texto.trim().min(1), tamanhoEscolhido: tamanho.optional() }).strict().optional(),
  tamanhoEscolhido: tamanho.optional(), linhaPV: z.enum(['acima', 'abaixo']).optional(), cargaMedida: numero.optional(),
}).strict();
const especialidadesNovo = z.record(id, z.array(z.object({ foco: texto, valor: naoNeg, origem: z.enum(['natural', 'livro']) }).strict()));
const numeroPasso = numero.finite().nonnegative();
const passo = z.object({ batalha: numeroPasso, arranque: numeroPasso.optional(), corrida: numeroPasso.optional() }).strict();
const deslocamentoNovo = z.object({ terra: passo.required().optional(), voo: passo.optional(), nado: passo.optional(), escavacao: passo.optional(), escalada: passo.optional() }).strict().refine(d => Object.keys(d).length > 0, 'deslocamento precisa declarar ao menos um meio');
// Na forma, a omissão herda. `null` é a escolha explícita de não ter aquele meio (F5.1).
const deslocamentoForma = z.object({ terra: passo.nullable().optional(), voo: passo.nullable().optional(), nado: passo.nullable().optional(), escavacao: passo.nullable().optional(), escalada: passo.nullable().optional() }).strict().refine(d => Object.keys(d).length > 0, 'deslocamento da forma precisa declarar ao menos um meio');
const equipamentoNovo = z.object({
  arsenal: z.array(z.object({ ref: z.string().regex(/^[ae]:[a-z0-9-]+$/) }).strict()),
  armaduras: z.array(z.object({ base: id, vestida: z.boolean() }).strict()),
}).strict();
const ataqueNatural = z.object({
  // D-258: só a Habilidade de tiro e arremesso fica no JSON; a de corpo a corpo o motor calcula (a maior entre Briga e Armas)
  nome: texto, parte: id, habilidade: z.enum(['disparo', 'atirador', 'arremesso']).optional(), classe: z.enum(['leve','media','pesada','haste','haste-media','haste-guerra','distancia','arremesso']), pgr: z.tuple([naoNeg, z.literal(1), naoNeg]),
  dado: z.string().regex(/^\d+d6([+-]\d+)?$/).nullable(), multiplicadorForca: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  tipoDano: z.enum([...elementosVocab.grupos.flatMap(g=>g.palavras),'fenomeno','eletricidade','nao-se-aplica']), nivelPerfuracao: naoNeg.nullable(), acerto: inteiro, bloqueiaComoArma: inteiro.nullable(),
}).strict();
const ataqueComArma = z.object({ nome: texto, arma: id }).strict();
const ataqueNovo = z.union([ataqueComArma, ataqueNatural]);
const oitoCampos = { ativacao: texto, duracao: texto, alcance: texto, area: texto, efeito: texto, dano: texto, resistencia: texto, limiteDeUso: texto };
const habilidadeEspecial = z.object({
  nome: texto, formas: formasMarca, classe: z.enum(['livro', 'regra da ficha', 'sem regra ainda']),
  ataque: texto.optional(), base: z.object({ arte: id, nivel: naoNeg }).strict().optional(), regra: id.optional(),
  // P7, 26/10/2026: referências ao livro; texto só acrescenta detalhe ou limite próprio da criatura.
  tecnica: z.object({ id, nivel: naoNeg }).strict().optional(), arte: z.object({ id, nivel: naoNeg }).strict().optional(), texto: texto.optional(),
  ...Object.fromEntries(Object.entries(oitoCampos).map(([k, v]) => [k, v.optional()])),
}).strict().superRefine((h, ctx) => {
  const problema = (k, mensagem) => ctx.addIssue({code:'custom',path:[k],message:mensagem});
  const oito = Object.keys(oitoCampos);
  if (h.classe === 'regra da ficha') for (const k of oito) { if (!h[k]?.trim()) problema(k,'regra da ficha exige os oito campos preenchidos'); }
  if (h.classe === 'livro') for (const k of oito) { if (h[k] !== undefined) problema(k,'campo de efeito próprio não pertence à classe livro'); }
  if (h.classe !== 'livro') for (const k of ['regra','tecnica','arte','texto']) { if (h[k] !== undefined) problema(k,'referência ao livro exige classe livro'); }
  if (h.classe === 'sem regra ainda') {
    if (!h.efeito?.trim()) problema('efeito','sem regra ainda exige efeito');
    for (const k of oito.filter(k => k !== 'efeito')) if (h[k] !== undefined) problema(k,'sem regra ainda guarda somente efeito');
  }
});
const elementoNovo = z.array(z.object({ tipo: id, formas: formasMarca }).strict());
const fisiologiaNovo = z.object({ respiracao: texto.optional(), prendeRespiracao: texto.optional(), camuflagem: texto.optional(), mente: texto.optional(), tracos: texto.optional() }).strict();
const aptidoesNovo = z.object({ montaria: z.boolean(), carga: z.boolean(), tracao: z.boolean() }).strict();
const numeros = z.record(id, inteiro);
const artesNova = z.record(z.enum(artesCatalogo.map(a => a.id)), naoNeg);
const bolsasNova = z.array(z.object({ nome: texto, itens: z.array(z.object({ item: texto, peso: numero, preco: numero }).strict()) }).strict());
const formaNova = z.object({
  id, nome: texto, bolsas: bolsasNova.optional(), corpo: corpoNovo.partial().optional(), couraca: naoNeg.max(12).optional(), atributos: z.object({ forca: naoNeg, destreza: naoNeg, vigor: naoNeg, percepcao: naoNeg, inteligencia: naoNeg, raciocinio: naoNeg, influencia: naoNeg, perspicacia: naoNeg, compostura: naoNeg }).strict().partial().optional(), aparencia: naoNeg.max(12).optional(),
  deslocamento: deslocamentoForma.optional(), equipamento: equipamentoNovo.partial().optional(), artes: artesNova.optional(),
  fisiologia: fisiologiaNovo.optional(), aptidoes: aptidoesNovo.optional(), ataques: z.array(ataqueNovo).optional(),
}).strict();
export const criaturaNovaSchema = z.object({
  id, idAntigo: texto.optional(), nome: texto, nomeIngles: texto.nullable(), categoria: id, papel: id,
  ameaca: z.number().int().min(1).max(6), centelha: z.number().int().min(0).max(12),
  formaPrincipal: z.object({ id, nome: texto }).strict().optional(),
  enxame: z.object({ individuosPorQuadrado: z.number().int().positive(), tamanhoEquivalente: z.enum(['pequeno','medio']) }).strict().optional(),
  corpo: corpoNovo.refine(c => c.massa !== undefined || c.semMassa === true, {message:'corpo exige massa ou semMassa',path:['massa']}).refine(c => (c.semMassa === true) === (c.volume !== undefined), {message:'semMassa e volume devem ser declarados juntos',path:['volume']}), couraca: z.number().int().min(0).max(12), bonusPV: inteiro.optional(),
  atributos: z.object({ forca: naoNeg, destreza: naoNeg, vigor: naoNeg, percepcao: naoNeg, inteligencia: naoNeg, raciocinio: naoNeg, influencia: naoNeg, perspicacia: naoNeg, compostura: naoNeg }).strict(),
  habilidades: numeros, habilidadesSec: numeros, especialidades: especialidadesNovo, especialidadesSec: especialidadesNovo,
  virtudes: z.object({ bravura: naoNeg, compaixao: naoNeg, conviccao: naoNeg, temperanca: naoNeg }).strict(),
  vontade: naoNeg, aparencia: z.number().int().min(0).max(12),
  deslocamento: deslocamentoNovo, equipamento: equipamentoNovo, artes: artesNova,
  bolsas: bolsasNova.optional(),
  ataques: z.array(ataqueNovo), formas: z.array(formaNova).min(1).optional(),
  habilidadesEspeciais: z.array(habilidadeEspecial),
  comoLuta: z.array(z.object({ nome: texto, formas: formasMarca, texto }).strict()),
  sentidos: z.array(z.object({ nome: texto, descricao: texto, formas: formasMarca, classe: z.literal('sem regra ainda').optional() }).strict()),
  elementos: z.object({ fraquezas: elementoNovo, resistencias: elementoNovo, imunidades: elementoNovo }).strict(),
  fisiologia: fisiologiaNovo.extend({respiracao:texto.trim().min(1),mente:texto.trim().min(1),tracos:texto.trim().min(1)}), aptidoes: aptidoesNovo,
  comportamento: z.object({ social: texto.trim().min(1).optional(), atividade: texto.trim().min(1).optional(), dieta: texto.trim().min(1).optional(), caca: texto.trim().min(1).optional(), dianteDeGente: texto.trim().min(1).optional() }).strict(),
  ecologia: z.object({ terreno: z.array(texto), clima: z.array(texto) }).strict(),
  descricao: texto.trim().min(1), lore: z.array(z.object({ titulo: texto, texto }).strict()), imagens: z.array(texto),
  revisao: z.array(z.object({ campo: texto, motivo: texto }).strict()),
 }).strict().superRefine((c, ctx) => {
  const erro=(path,message)=>ctx.addIssue({code:'custom',path,message});
  if (Boolean(c.formaPrincipal) !== Boolean(c.formas)) erro(['formas'],'formaPrincipal e formas devem existir juntas');
  const ids=[...(c.formaPrincipal ? [c.formaPrincipal.id] : []),...(c.formas || []).map(f=>f.id)];
  if (new Set(ids).size !== ids.length) erro(['formas'],'ids de formas devem ser únicos');
  for (const [i, forma] of (c.formas || []).entries()) if (forma.corpo?.tamanhoEscolhido !== undefined && forma.corpo.area === undefined)
    erro(['formas',i,'corpo','tamanhoEscolhido'],'Tamanho próprio da forma exige área própria');
  // Um elemento não pode repetir nem se contradizer na mesma forma da fonte.
  for (const forma of (ids.length ? ids : ['principal'])) {
    const vistos = new Map();
    for (const [grupo,itens] of Object.entries(c.elementos)) for (const item of itens) if (item.formas === 'todas' || item.formas.includes(forma)) {
      if (vistos.has(item.tipo)) erro(['elementos',grupo], 'elemento repetido ou conflitante na forma '+forma+': '+item.tipo);
      vistos.set(item.tipo,grupo);
    }
  }
  const listas=[['habilidadesEspeciais',c.habilidadesEspeciais],['comoLuta',c.comoLuta],['sentidos',c.sentidos],...Object.entries(c.elementos).map(([k,v])=>['elementos.'+k,v])];
  for (const [lista,itens] of listas) for (const [i,item] of itens.entries()) if (item.formas !== 'todas') for (const id of item.formas) if (!ids.includes(id)) erro([lista,i,'formas'],'marca aponta para forma inexistente: '+id);
});

// As fontes publicadas antes da F5.2 ainda podem trazer a escolha de Tamanho da
// forma sem a área. O leitor as mantém até o lote da Bestiarista, mas o esquema
// de entrada, o conversor e o editor continuam recusando esse formato antigo.
export const criaturaParaLeituraSchema = {
  safeParse(c) {
    const estrito = criaturaNovaSchema.safeParse(c);
    if (estrito.success) return estrito;
    const legado = structuredClone(c);
    let mudou = false;
    for (const forma of legado.formas || []) if (forma.corpo?.tamanhoEscolhido !== undefined && forma.corpo.area === undefined) {
      delete forma.corpo.tamanhoEscolhido;
      mudou = true;
    }
    if (!mudou || !criaturaNovaSchema.safeParse(legado).success) return estrito;
    return { success: true, data: c };
  },
  parse(c) {
    const r = this.safeParse(c);
    if (r.success) return r.data;
    throw r.error;
  },
};
