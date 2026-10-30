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

/**
 * As Habilidades de treino da criatura (Armas, Esquiva, Furtividade...), com o nome do livro (D-270, L1): as chaves de
 * `habilidades` e `habilidadesSec`, com o valor que a ficha escreveu (zero também, que é dado). O nome sai do catálogo
 * (`habilidades.json` e `habilidades-secundarias.json`); as quatro que só a criatura tem não estão nele.
 */
export const HABILIDADES_SO_DE_CRIATURA: Record<string, string> = {
  musculatura: 'Musculatura', corrida: 'Corrida', voo: 'Voo', disparo: 'Disparo',
};
export type Treino = { primarias: { id: string; nome: string; valor: number }[]; secundarias: { id: string; nome: string; valor: number }[] };
export function habilidadesDeTreino(x: any, nomes: Record<string, string>): Treino {
  const lista = (o: Record<string, number> | undefined) => Object.entries(o || {})
    .map(([id, valor]) => ({ id, nome: nomes[id] ?? HABILIDADES_SO_DE_CRIATURA[id] ?? id, valor }))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt'));
  return { primarias: lista(x.habilidades), secundarias: lista(x.habilidadesSec) };
}
export const treinoTxt = (l: Treino['primarias']) => l.map((h) => `${h.nome} ${h.valor}`).join(' · ');

/**
 * O "base <Arte> <nível>" do poder natural, por extenso (parecer da Leitora-novata, achado 6). O poder inato com usos é
 * poder natural, "com base e nível mantidos como parâmetro", sem portão de Centelha e com os usos da fonte (C-037): a
 * Arte e o nível medem o efeito, e o poder não gasta Mana nem tem o portão de Centelha das Artes.
 */
export const BASE_NOTA = 'Base: a Arte e o nível que medem um poder natural. Ele não é Arte conjurada: não gasta Mana nem pede Centelha mínima, e os usos e a resistência são os escritos no poder.';
export const baseTxt = (b: { arte: string; nivel: number } | undefined, arteNome: Record<string, string>) => (b ? ` · base: ${arteNome[b.arte] ?? b.arte} ${b.nivel}` : '');

/** A massa por extenso, como a tabela do Cap. IV: g abaixo de 1 kg, t de 1.000 kg para cima, vírgula decimal. */
const massaTxt = (kg: number) => (kg < 1 ? `${Math.round(kg * 1000)} g` : kg >= 1000 ? `${String(+(kg / 1000).toFixed(2)).replace('.', ',')} t` : `${String(+kg.toFixed(2)).replace('.', ',')} kg`);
/** Por que a ficha escolheu a linha de PV na zona de transição (achado 9). `pv` é o do card, já com o `bonusPV`. */
export function linhaPVTxt(z: { zonaKg: [number, number]; linha: 'acima' | 'abaixo'; pvAcima: number; pvAbaixo: number } | null, pv: number, motivo?: string): string {
  if (!z) return '';
  const cima = z.linha === 'acima', outro = pv - (cima ? z.pvAcima : z.pvAbaixo) + (cima ? z.pvAbaixo : z.pvAcima);
  // com o porquê da ficha (`corpo.linhaPVMotivo`), as palavras dela; sem ele, o critério do livro
  const porque = motivo ? `${motivo} (${cima ? 'o robusto sobe' : 'o frágil desce'})` : cima ? 'robusto, que sobe' : 'frágil, que desce';
  return `PV pela linha de ${cima ? 'cima' : 'baixo'} da zona de transição (${massaTxt(z.zonaKg[0])} a ${massaTxt(z.zonaKg[1])}): a ficha escolheu pelo corpo, ${porque}; a linha de ${cima ? 'baixo' : 'cima'} daria ${outro}.`;
}
