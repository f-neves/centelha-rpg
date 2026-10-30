/**
 * O desenho do card do bestiário que a forma principal e as outras formas dividem.
 *
 * Morava dentro de `BestaCard.astro`, e o `FormaCriatura.astro` (as formas 2 e 3) escrevia tudo em linha corrida,
 * com as chaves cruas: "Força: 5 · Destreza: 4", "resistencias: corte, perfuracao" sem acento, "natacao: 4 m/Tick"
 * (parecer da Veterana sobre o site da Fase 4, M9). Os rótulos e os formatos ficam aqui, num lugar só.
 */

/** Fraquezas e resistências: a palavra-chave crua vira rótulo de leitura (elemento das Artes, tipo de dano, natureza). */
export const ELEM: Record<string, string> = {
  fogo: 'Fogo', agua: 'Água', gelo: 'Gelo', raio: 'Raio', vento: 'Vento', terra: 'Terra',
  luz: 'Luz', sombra: 'Sombra', acido: 'Ácido', corte: 'Corte', perfuracao: 'Perfuração', impacto: 'Impacto',
  sagrado: 'Sagrado', profano: 'Profano', prata: 'Prata', sol: 'Sol',
};

/** Atributos (ordem canônica: físico · social · mental) com rótulo curto e nome cheio. */
export const ATR: [string, string, string][] = [
  ['forca', 'For', 'Força'], ['destreza', 'Des', 'Destreza'], ['vigor', 'Vig', 'Vigor'],
  ['influencia', 'Inf', 'Influência'], ['perspicacia', 'Psp', 'Perspicácia'], ['compostura', 'Cmp', 'Compostura'],
  ['percepcao', 'Per', 'Percepção'], ['inteligencia', 'Int', 'Inteligência'], ['raciocinio', 'Rac', 'Raciocínio'],
];

/** Locomoção (B14 fase 4, Adendo 3 item 5): só os modos que a criatura tem, em m/Tick; a terra sempre. */
export const LOCO: [string, string][] = [
  ['terra', 'Terra'], ['voo', 'Voo'], ['natacao', 'Natação'],
  ['escalada', 'Escalada'], ['escavacao', 'Escavação'], ['jato', 'Jato'],
];
export const SEM_LOCOMOCAO: Record<string, string> = {
  terra: 'não anda', voo: 'não voa', natacao: 'não nada', escalada: 'não escala', escavacao: 'não escava', jato: 'não usa jato',
};
export const locoDe = (x: any) => LOCO.filter(([k]) => k === 'terra' || Object.hasOwn(x.locomocao || {}, k))
  .map(([k, nome]) => ({ nome, k, v: x.locomocao?.[k] }));
export const locoTxt = (m: { nome: string; k: string; v: any }) => (m.v == null ? `${m.nome}: ${SEM_LOCOMOCAO[m.k]}` : `${m.nome} ${m.v} m/Tick`);

/** Ataque: "7d6+2 +8" → "7d6 +2 +8"; dano: o tipo por extenso → sigla (I)/(C)/(P), e o resto pelo rótulo. */
const DANO_AB: Record<string, string> = { impacto: '(I)', corte: '(C)', perfurante: '(P)' };
export const fmtPool = (s: string) => String(s || '').replace(/(\d+d6)\+/, '$1 +');
export const fmtDano = (s: string) => String(s || '').replace(/\b(impacto|corte|perfurante)\b/g, (m) => DANO_AB[m])
  .replace(/\b(fenomeno|[a-z]+)$/, (m) => (m === 'fenomeno' ? 'fenômeno' : ELEM[m] ?? m));
