// Contrato unificado da fonte da criatura. Só entradas e escolhas, sem derivados.
import { z } from 'zod';
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
  area: numero, posturaDoTamanho: texto.optional(),
  segundoTamanho: z.object({ area: numero, posturaDoTamanho: texto, tamanhoEscolhido: tamanho.optional() }).strict().optional(),
  tamanhoEscolhido: tamanho.optional(), linhaPV: z.enum(['acima', 'abaixo']).optional(), cargaMedida: numero.optional(),
}).strict();
const especialidadesNovo = z.record(id, z.array(z.object({ foco: texto, valor: naoNeg, origem: z.enum(['natural', 'livro']) }).strict()));
const numeroPasso = numero.finite().nonnegative();
const passo = z.object({ batalha: numeroPasso, arranque: numeroPasso.optional(), corrida: numeroPasso.optional() }).strict();
const deslocamentoNovo = z.object({ terra: passo.optional(), voo: passo.optional(), nado: passo.optional(), escavacao: passo.optional(), escalada: passo.optional() }).strict().refine(d => Object.keys(d).length > 0, 'deslocamento precisa declarar ao menos um meio');
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
const bolsasNova = z.array(z.object({ nome: texto, itens: z.array(z.object({ item: texto, peso: numero, preco: numero }).strict()) }).strict());
const formaNova = z.object({
  id, nome: texto, bolsas: bolsasNova.optional(), corpo: corpoNovo.partial().optional(), couraca: naoNeg.optional(), atributos: numeros.optional(), aparencia: naoNeg.optional(),
  deslocamento: deslocamentoNovo.optional(), equipamento: equipamentoNovo.partial().optional(), artes: numeros.optional(),
  fisiologia: fisiologiaNovo.optional(), aptidoes: aptidoesNovo.optional(), ataques: z.array(ataqueNovo).optional(),
}).strict();
export const criaturaNovaSchema = z.object({
  id, idAntigo: texto.optional(), nome: texto, nomeIngles: texto.nullable(), categoria: id, papel: id,
  ameaca: z.number().int().min(1).max(6), centelha: z.number().int().min(0).max(12),
  formaPrincipal: z.object({ id, nome: texto }).strict().optional(),
  enxame: z.object({ individuosPorQuadrado: z.number().int().positive(), tamanhoEquivalente: z.enum(['minusculo','miudo','pequeno','medio','grande','enorme','imenso','colossal']) }).strict().optional(),
  corpo: corpoNovo.refine(c => c.massa !== undefined || c.semMassa === true, {message:'corpo exige massa ou semMassa',path:['massa']}), couraca: z.number().int().min(0).max(12), bonusPV: inteiro.optional(),
  atributos: z.object({ forca: naoNeg, destreza: naoNeg, vigor: naoNeg, percepcao: naoNeg, inteligencia: naoNeg, raciocinio: naoNeg, influencia: naoNeg, perspicacia: naoNeg, compostura: naoNeg }).strict(),
  habilidades: numeros, habilidadesSec: numeros, especialidades: especialidadesNovo, especialidadesSec: especialidadesNovo,
  virtudes: z.object({ bravura: naoNeg, compaixao: naoNeg, conviccao: naoNeg, temperanca: naoNeg }).strict(),
  vontade: naoNeg, aparencia: z.number().int().min(0).max(12),
  deslocamento: deslocamentoNovo, equipamento: equipamentoNovo, artes: numeros,
  bolsas: bolsasNova.optional(),
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
