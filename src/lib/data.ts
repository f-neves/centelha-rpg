import { getCollection } from 'astro:content';

/** Nome do tier por banda (15 bandas, 3 por tier de Centelha: tier = ceil(banda/3)). */
export const TIER_NOME = ['Tocado', 'Herói', 'Grande herói', 'Lendário', 'Semideus'];
export const BANDA_LABEL: Record<number, string> = Object.fromEntries(
  Array.from({ length: 15 }, (_, i) => [i + 1, TIER_NOME[Math.ceil((i + 1) / 3) - 1]])
);

const FEM = new Set(['Pele de Pedra', 'Dança da Lâmina', 'Voz de Mel', 'Lenda Viva', 'Mente Afiada', 'Máscara', 'Sombra', 'Teia', 'Serpente das Palavras', 'Marionete', 'Beleza Cativante', 'Aura', 'Máscara Impassível', 'Comunhão', 'Leitura Fria', 'Mente Serena', 'Musa', 'Brasa', 'Mão Veloz', 'Carne Teimosa']);
/** "Proeza da/do X" conforme o gênero do nome. */
export const caminhoComArtigo = (nome: string) => `Proeza ${FEM.has(nome) ? 'da' : 'do'} ${nome}`;
export const TRILHA_LABEL: Record<string, string> = { corpo: 'Corpo', voz: 'Voz', mente: 'Mente' };
export const TRILHA_SUB: Record<string, string> = {
  corpo: 'força, agilidade e resiliência do corpo',
  voz: 'a alma social — inspirar, dobrar e encantar',
  mente: 'perceber, saber e reagir',
};

export async function loadData() {
  const [atributos, habilidades, virtudes, caminhos, tecnicas, artes, glossario] = await Promise.all([
    getCollection('atributos'), getCollection('habilidades'), getCollection('virtudes'),
    getCollection('caminhos'), getCollection('tecnicas'), getCollection('artes'), getCollection('glossario'),
  ]);

  const A = Object.fromEntries(atributos.map((a) => [a.id, a.data]));
  const C = Object.fromEntries(caminhos.map((c) => [c.id, c.data]));
  const T = Object.fromEntries(tecnicas.map((t) => [t.id, t.data]));

  // técnicas por caminho, ordenadas por banda
  const porCaminho: Record<string, any[]> = {};
  for (const t of tecnicas) (porCaminho[t.data.caminho.id] ??= []).push(t.data);
  for (const k in porCaminho) porCaminho[k].sort((a, b) => a.banda - b.banda);

  // prereq reverso: o que cada técnica destrava
  const destrava: Record<string, string[]> = {};
  for (const t of tecnicas) for (const p of t.data.prereq) (destrava[p.id] ??= []).push(t.data.id);

  // caminhos agrupados por trilha → atributo
  const arvoreCaminhos: Record<string, Record<string, any[]>> = {};
  for (const c of caminhos) {
    ((arvoreCaminhos[c.data.trilha] ??= {})[c.data.atributo.id] ??= []).push(c.data);
  }

  return {
    atributos: atributos.map((a) => a.data),
    habilidades: habilidades.map((h) => h.data),
    virtudes: virtudes.map((v) => v.data),
    caminhos: caminhos.map((c) => c.data),
    tecnicas: tecnicas.map((t) => t.data),
    artes: artes.map((a) => a.data),
    glossario: glossario.map((g) => g.data),
    A, C, T, porCaminho, destrava, arvoreCaminhos,
  };
}

export function custoTagTecnica(t: { tipo: string; custo: { energia?: number; vontade?: number } }) {
  if (t.tipo === 'passiva') return 'passiva';
  const parts: string[] = [];
  if (t.custo.energia != null) parts.push(`${t.custo.energia} Energia`);
  if (t.custo.vontade) parts.push(`+${t.custo.vontade} Vontade`);
  return parts.join(' · ') || t.tipo;
}
