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
  return {
    ...cb, defesa: v.defesa, absorcao: { ...v.absorcao }, resistenciaPerfuracao: v.nivel,
    ataques: (cb.ataques || []).map((a: any) => ({ ...a, pool: poolComPenalidade(a.pool, v.penalidade) })),
  };
}

/**
 * O ataque vestido: a Penalidade da armadura sai da jogada, como na ficha do personagem (D-206,
 * resposta do Arquiteto de 23/10/2026, caminho (a): "o ataque segue o estado"). O pool do
 * bestiário é "Nd6", "Nd6+2" (a soma ímpar) e o acerto: "3d6+2 +5" com Penalidade 1 dá
 * "3d6+2 +4"; "4d6 +1" com 2 dá "4d6 −1" (o menos tipográfico, que o `rolarExpr` lê).
 */
export function poolComPenalidade(pool: string, pen: number): string {
  if (!pen) return pool;
  const m = /^(\d+d6(?:\+2)?)(?:\s*([+−-])\s*(\d+))?$/.exec(String(pool || '').trim());
  if (!m) return pool;
  const a = (m[3] ? Number(m[3]) * (m[2] === '+' ? 1 : -1) : 0) - pen;
  return `${m[1]}${a > 0 ? ` +${a}` : a < 0 ? ` −${-a}` : ''}`;
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

/**
 * O SALVAR DO EDITAR (aba Combate) da criatura vestida: "Gravar menos", decisão do autor de
 * 23/10/2026. Nos quatro campos que a escolha mexe (ataque, Defesa, Absorção, nível de
 * Perfuração), o campo vazio OMITE a chave dos `dados`, em vez de gravar "" ou 0, e a peça
 * segue a escolha do Mestre na leitura. O que o Mestre digitar continua sendo gravado. `crus`
 * são os textos dos campos como estão no diálogo.
 */
export function dadosSemOsVaziosDaEscolha(dados: any, crus: { ataque: string; defesa: string; absI: string; absC: string; absP: string; rperf: string }): any {
  const o: any = { ...dados, soak: { ...(dados?.soak || {}) } };
  if (!crus.ataque.trim()) delete o.ataque;
  if (!crus.defesa.trim()) delete o.defesa;
  if (!crus.rperf.trim()) delete o.resistPerf;
  for (const [k, c] of [['impacto', 'absI'], ['corte', 'absC'], ['perfuracao', 'absP']] as const) if (!crus[c].trim()) delete o.soak[k];
  if (!Object.keys(o.soak).length) delete o.soak;
  return o;
}
