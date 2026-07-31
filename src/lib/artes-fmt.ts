// Formatação compartilhada dos Efeitos Especiais, usada pelo capítulo XV e pelas
// suas sub-páginas. A ficha tem a sua própria versão compacta em ficha-engine.ts.

/** Uma referência do content collection resolve para objeto; aqui só interessa o id. */
export const idDe = (x: any) => (typeof x === 'string' ? x : x?.id);

/** Rótulos que abrem o cartão de formas ao passar o mouse (ver FormasPop.astro). */
export const formaDe = (nome: string) => {
  const n = nome.toLowerCase();
  if (n.startsWith('volume')) return 'volume';
  if (n.startsWith('área') || n.startsWith('area')) return 'area';
  return undefined;
};

// Os parâmetros saem sempre na mesma ordem: Alcance, Alvos, Área (e as medidas que a
// acompanham ou substituem), Dano, Duração, a jogada (de quem ataca ou de quem sofre)
// e a Dificuldade dela.
const RANK: Record<string, number> = {
  alcance: 0, alvos: 1,
  área: 2, area: 2, volume: 2, comprimento: 2, altura: 2, raio: 2, profundidade: 2,
  dano: 3, cura: 3, duração: 4, duracao: 4, ataque: 5, jogada: 5, dificuldade: 6,
};
const rank = (p: any) => RANK[p.nome.toLowerCase().split(' ')[0]] ?? RANK[(p.substitui || '').toLowerCase()] ?? 9;
export const ordemPar = (ps: any[]) =>
  ps.map((p, i) => [p, i] as [any, number]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(([p]) => p);

/** O valor curto de cada parâmetro: o fixo, a régua da duração, a nota de quem substitui outro. */
export const valorPar = (p: any) => {
  if (p.tipo === 'fixo') return p.valor;
  if (p.tipo === 'substitui') return p.nota || `${p.escala.join(' · ')}${p.unidade ? ` (${p.unidade})` : ''}`;
  if (p.regua) return p.regua === 'longa' ? 'Longa' : 'Breve';
  if (/^(dano|cura)/.test(p.nome.toLowerCase())) return '1d6 por nível';
  return 'normal';
};
