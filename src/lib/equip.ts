// Catálogo de equipamento + os ajustes que o jogador faz por cima dele.
//
// A ficha guarda a peça escolhida por id (arma "a:adaga", escudo "e:broquel",
// armadura pelo id) e, opcionalmente, um `mod` com os valores trocados — é assim
// que entra uma variação de qualidade (uma Espada Longa Ótima, um gambeson
// puído) sem inventar um item novo no catálogo. Quem lê a ficha (a própria
// ficha e o rastreador de combate da mesa) passa por aqui para receber a peça
// já ajustada, então o número na mesa é o mesmo número da ficha.
import ARMA_D from '../data/armas.json';
import ARMADURA_D from '../data/armaduras.json';
import ESCUDO_D from '../data/escudos.json';

export const ARMAS = ARMA_D as any[];
export const ARMADURAS = ARMADURA_D as any[];
export const ESCUDOS = ESCUDO_D as any[];
export const ARMA: Record<string, any> = Object.fromEntries(ARMAS.map((w) => [w.id, w]));
export const ARMADURA: Record<string, any> = Object.fromEntries(ARMADURAS.map((a) => [a.id, a]));
export const ESCUDO: Record<string, any> = Object.fromEntries(ESCUDOS.map((s) => [s.id, s]));

/**
 * Armadura fora do catálogo, para a peça que o jogador inventa (a couraça do
 * ferreiro da vila, o casaco reforçado do mestre). Nasce zerada: quem dá os
 * números é o "ajustar" do card, pelo mesmo caminho que ajusta qualquer outra.
 *
 * Vive aqui, e não na ficha, porque `armadurasDe` é lido também pelo rastreador
 * de combate da mesa: se a base só existisse na tela da ficha, a peça sumiria da
 * Absorção do outro lado.
 */
export const ID_ARMADURA_LIVRE = 'c';
export const ARMADURA_LIVRE = {
  id: ID_ARMADURA_LIVRE,
  nome: 'Armadura personalizada',
  classe: 'nenhuma',
  soak: { impacto: 0, corte: 0, perfuracao: 0 },
  resistPerf: 0,
  penalidade: 0,
  acesso: 10,
  notas: 'Peça fora do catálogo: vale o que estiver no ajuste.',
};

/** A base de uma peça de armadura: do catálogo, ou a peça livre. */
export function baseArmadura(id: string | undefined | null): any {
  if (id === ID_ARMADURA_LIVRE) return ARMADURA_LIVRE;
  return id ? ARMADURA[id] : undefined;
}

/** Um campo editável de uma peça: onde mora, como se chama e o intervalo aceito. */
export interface CampoEquip { k: string; rot: string; min: number; max: number; sinal?: boolean; }

/** Ordem dos campos = ordem em que a ficha mostra a arma: Velocidade / Acerto / Dano / Defesa. */
export const CAMPOS_ARMA: CampoEquip[] = [
  { k: 'ticks', rot: 'Velocidade', min: 1, max: 20 },
  { k: 'acerto', rot: 'Acerto', min: -10, max: 10, sinal: true },
  { k: 'dado', rot: 'Dado', min: 1, max: 6 },
  { k: 'danoBonus', rot: 'Dano ±', min: -10, max: 10, sinal: true },
  { k: 'defesaArma', rot: 'Defesa', min: -5, max: 10, sinal: true },
];
export const CAMPOS_ESCUDO: CampoEquip[] = [
  { k: 'bloqCaC', rot: 'Defesa', min: -5, max: 10, sinal: true },
  { k: 'penalidade', rot: 'Penalidade', min: 0, max: 10 },
];
/** Mesmas colunas da tabela de Armaduras em Equipamentos. `soak.*` vira campo raso aqui. */
export const CAMPOS_ARMADURA: CampoEquip[] = [
  { k: 'impacto', rot: 'Impacto', min: 0, max: 20 },
  { k: 'corte', rot: 'Corte', min: 0, max: 20 },
  { k: 'perfuracao', rot: 'Perfuração', min: 0, max: 20 },
  { k: 'resistPerf', rot: 'Nível', min: 0, max: 6 },
  { k: 'penalidade', rot: 'Penalidade', min: 0, max: 10 },
];

const num = (v: any): number | null => (v === '' || v == null || !Number.isFinite(Number(v)) ? null : Number(v));
const lim = (v: number, c: CampoEquip) => Math.max(c.min, Math.min(c.max, Math.round(v)));

/** Valor em uso de um campo: o ajuste do jogador, ou o do catálogo. */
export function valorCampo(base: any, mod: any, c: CampoEquip): number {
  const v = num(mod?.[c.k]);
  return v == null ? Number(baseCampo(base, c) || 0) : lim(v, c);
}
/** Valor de catálogo (armadura guarda as três Absorções dentro de `soak`). */
export function baseCampo(base: any, c: CampoEquip): number {
  if (base?.soak && (c.k === 'impacto' || c.k === 'corte' || c.k === 'perfuracao')) return base.soak[c.k] ?? 0;
  return base?.[c.k] ?? 0;
}
/** Há algum campo trocado em relação ao catálogo? */
export function temMod(base: any, mod: any, campos: CampoEquip[]): boolean {
  if (!mod) return false;
  return campos.some((c) => num(mod[c.k]) != null && valorCampo(base, mod, c) !== baseCampo(base, c));
}

export function armaComMod(base: any, mod: any) {
  if (!temMod(base, mod, CAMPOS_ARMA)) return base;
  const w = { ...base };
  for (const c of CAMPOS_ARMA) w[c.k] = valorCampo(base, mod, c);
  return w;
}
export function escudoComMod(base: any, mod: any) {
  if (!temMod(base, mod, CAMPOS_ESCUDO)) return base;
  const s = { ...base };
  for (const c of CAMPOS_ESCUDO) s[c.k] = valorCampo(base, mod, c);
  return s;
}
export function armaduraComMod(base: any, mod: any) {
  if (!temMod(base, mod, CAMPOS_ARMADURA)) return base;
  const a = { ...base, soak: { ...base.soak } };
  a.soak.impacto = valorCampo(base, mod, CAMPOS_ARMADURA[0]);
  a.soak.corte = valorCampo(base, mod, CAMPOS_ARMADURA[1]);
  a.soak.perfuracao = valorCampo(base, mod, CAMPOS_ARMADURA[2]);
  a.resistPerf = valorCampo(base, mod, CAMPOS_ARMADURA[3]);
  a.penalidade = valorCampo(base, mod, CAMPOS_ARMADURA[4]);
  return a;
}

/** Arma de um slot de mão (já ajustada), ou null se o slot não tem arma de catálogo. */
export function armaDoSlot(slot: any) {
  const ref = String(slot?.ref || 'nada');
  if (!ref.startsWith('a:')) return null;
  const b = ARMA[ref.slice(2)];
  return b ? armaComMod(b, slot?.mod) : null;
}
/** Escudo de um slot de mão (já ajustado), ou null. */
export function escudoDoSlot(slot: any) {
  const ref = String(slot?.ref || 'nada');
  if (!ref.startsWith('e:')) return null;
  const b = ESCUDO[ref.slice(2)];
  return b ? escudoComMod(b, slot?.mod) : null;
}
/**
 * Peças de armadura VESTIDAS, já ajustadas.
 *
 * Aceita os dois formatos, porque o rastreador de combate da mesa lê fichas gravadas
 * antes da mudança e elas continuam válidas:
 *   antigo: equip.armaduras = ['gambeson', 'cota-de-malha']  (ids do catálogo, todas vestidas)
 *   novo:   equip.armaduras = [{ uid, base, nome?, mod?, img?, vestida }]  (o que o personagem POSSUI)
 */
export function armadurasDe(S: any) {
  const lista = S?.equip?.armaduras || [];
  const mods = S?.equip?.armMod || {};
  return lista
    .map((p: any) => {
      if (typeof p === 'string') { const b = ARMADURA[p]; return b ? armaduraComMod(b, mods[p]) : null; }
      if (!p || p.vestida === false) return null;
      const b = baseArmadura(p.base); if (!b) return null;
      const a = armaduraComMod(b, p.mod);
      return p.nome ? { ...a, nome: p.nome } : a;
    })
    .filter(Boolean);
}

export const sinalNum = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n)}`;
/** "1d6−2" */
export const danoStr = (w: any) => `${w.dado}d6${w.danoBonus ? sinalNum(w.danoBonus) : ''}`;
/** "5/+2/1d6−2/+1" — Velocidade / Acerto / Dano / Defesa, a ordem da lista da ficha. */
export const statsArma = (w: any) =>
  `${w.ticks}/${sinalNum(w.acerto || 0)}/${danoStr(w)}/${sinalNum(w.defesaArma || 0)}`;
/** "+1 Def · −1 Pen" */
export const statsEscudo = (s: any) =>
  `${sinalNum(s.bloqCaC || 0)} Def · ${s.penalidade ? `−${s.penalidade}` : '0'} Pen`;
/** "Imp 3 · Cor 4 · Perf 1 (N0) · Pen −1" — as colunas da tabela de Armaduras. */
export const statsArmadura = (a: any) =>
  `Imp ${a.soak.impacto} · Cor ${a.soak.corte} · Perf ${a.soak.perfuracao} (N${a.resistPerf || 0}) · Pen ${a.penalidade ? `−${a.penalidade}` : '0'}`;
