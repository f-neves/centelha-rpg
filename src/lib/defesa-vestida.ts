// A Defesa com e sem o equipamento da criatura (D-206, 23/10/2026).
//
// O texto do autor: "mostra as duas, mas normalmente se escolhe a maior. Essa é uma escolha do
// mestre, não nossa. Mas as Defesas são influenciadas pelos equipamentos da criatura."
//
// A criatura que veste armadura ou escudo na ficha (hoje o campeão esquelético e o soldado
// veterano) traz `combate.vestida` ao lado dos números sem o equipamento. O card mostra os
// dois; a mesa usa UM, e quem escolhe é o Mestre. Sem escolha, vale o conjunto com a maior
// Defesa (empate: o vestido, que é como a ficha publica a criatura). O conjunto vai inteiro:
// Defesa, Absorção e nível de Perfuração juntos, porque não existe a Absorção da malha sem a
// Penalidade dela.
//
// A ESCOLHA FICA SÓ NESTE APARELHO, no `localStorage`, numa chave só:
// `centelha:mesa:vestida`, um objeto `{ <id da criatura>: 'com' | 'sem' }`. Nada disto vai ao
// banco, nem aos `dados` do combatente (que são gravados no Supabase): a ordem do autor é que
// a escolha do Mestre não vai ao banco. Sem armazenamento (aba anônima, cota cheia), a troca
// vale até recarregar e nada quebra: toda leitura e escrita está em try/catch. O ajuste por
// instância que o Mestre já digita na mesa (`dados.defesa`, `dados.soak`) continua vencendo
// por cima, como sempre.

export type Vestida = {
  esquiva: number; bloqueio: number; defesa: number; contraTiro: number;
  absorcao: { impacto: number; corte: number; perfuracao: number };
  nivel: number; penalidade: number;
};
export type Escolha = 'com' | 'sem';

const CHAVE = 'centelha:mesa:vestida';
const MEMORIA: Record<string, Escolha> = {};

function ler(): Record<string, Escolha> {
  try {
    const o = JSON.parse(localStorage.getItem(CHAVE) || '{}');
    return o && typeof o === 'object' ? o : {};
  } catch { return {}; }
}

/** O conjunto que vale sem escolha do Mestre: o da maior Defesa (empate: o vestido). */
export function escolhaPadrao(cb: { defesa?: number | null; vestida?: Vestida | null } | null | undefined): Escolha | null {
  if (!cb?.vestida) return null;
  return (cb.vestida.defesa ?? 0) >= (cb.defesa ?? 0) ? 'com' : 'sem';
}

/** A escolha deste aparelho para a criatura, ou a padrão. Null: a criatura não veste nada. */
export function escolhaDe(id: string, cb: { defesa?: number | null; vestida?: Vestida | null } | null | undefined): Escolha | null {
  if (!cb?.vestida) return null;
  const v = id in MEMORIA ? MEMORIA[id] : ler()[id];
  return v === 'com' || v === 'sem' ? v : escolhaPadrao(cb);
}

/**
 * Os números de combate que valem na escolha: Defesa, Absorção e nível de Perfuração. Função
 * pura (a escolha entra como argumento), para o teste e para quem decide o golpe.
 */
export function combateNaEscolha(cb: any, escolha: Escolha | null): any {
  if (!cb?.vestida || escolha !== 'com') return cb;
  const v: Vestida = cb.vestida;
  return { ...cb, defesa: v.defesa, absorcao: { ...v.absorcao }, resistenciaPerfuracao: v.nivel };
}

/** Troca a escolha da criatura e devolve a nova. Sem `vestida`, não faz nada. */
export function alternarVestida(id: string, cb: { defesa?: number | null; vestida?: Vestida | null } | null | undefined): Escolha | null {
  const atual = escolhaDe(id, cb);
  if (!atual) return null;
  const nova: Escolha = atual === 'com' ? 'sem' : 'com';
  MEMORIA[id] = nova;
  try {
    const o = ler();
    if (nova === escolhaPadrao(cb)) delete o[id]; else o[id] = nova;
    localStorage.setItem(CHAVE, JSON.stringify(o));
  } catch { /* sem armazenamento: a troca vale só até recarregar */ }
  return nova;
}
