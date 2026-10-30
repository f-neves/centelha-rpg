import { fichaParaLeitura } from './ficha-formato';
// Catálogo de equipamento e o item que a ficha do personagem guarda.
//
// D-259 (A1, 29/10/2026): a ficha do personagem guarda o ITEM INTEIRO, com todos
// os números, editáveis; o site soma na conta; o item não muda quando o catálogo
// muda; o id do catálogo fica só como origem. Cada peça (do arsenal, do slot de mão,
// de armadura) leva em `item` uma cópia do envelope do catálogo (o mesmo formato
// aninhado de `armas.json`, `escudos.json` e `armaduras.json`), com `origem` no
// lugar do `id`. O `ref` ("a:<id>", "e:<id>", "c", "ce") e o `base` da armadura
// continuam dizendo o TIPO da peça e de onde ela veio; os números saem só do `item`.
//
// As fichas gravadas antes (o modelo "referência + ajuste": `ref` mais `mod`/`ajuste`
// com os campos trocados, e o `armMod` das armaduras antigas) são lidas pela mesma
// conta de sempre, catálogo de hoje mais o ajuste com os limites de `valorCampo`, e
// viram item inteiro na leitura (`congelarItens`), até a migração 42 gravar a cópia.
//
// O `a:desarmado` (os punhos) não é peça: é o corpo, e continua pelo catálogo.
import ARMA_D from '../data/armas.json';
import ARMADURA_D from '../data/armaduras.json';
import ESCUDO_D from '../data/escudos.json';

/**
 * O JSON guarda o item no envelope ANINHADO (`{ id, nome, tipo, preco, ..., arma: {...},
 * armadura: null, escudo: null }`, decidido em leitura-de-novato-decisoes.md §5). Todo
 * consumidor daqui pra baixo (ficha, mesa, editor de bestiário) continua lendo o formato
 * PLANO de sempre (`w.dado`, `a.soak.impacto`, `s.bloqCaC`): achatar aqui, uma vez só, é o
 * que evita repetir a migração em cada arquivo que importa este módulo.
 */
function achata(item: any): any {
  const bloco = item.arma ?? item.armadura ?? item.escudo ?? item.municao ?? {};
  const { arma, armadura, escudo, municao, ...raiz } = item;
  // `descricao` é o nome do envelope; `notas` é como todo consumidor de baixo já lê.
  // Alias, não substituição: mantém os dois para não caçar `.notas` em cada arquivo.
  return { ...raiz, ...bloco, notas: raiz.descricao };
}

export const ARMAS = (ARMA_D as any[]).map(achata);
export const ARMADURAS = (ARMADURA_D as any[]).map(achata);
export const ESCUDOS = (ESCUDO_D as any[]).map(achata);
export const ARMA: Record<string, any> = Object.fromEntries(ARMAS.map((w) => [w.id, w]));
export const ARMADURA: Record<string, any> = Object.fromEntries(ARMADURAS.map((a) => [a.id, a]));
export const ESCUDO: Record<string, any> = Object.fromEntries(ESCUDOS.map((s) => [s.id, s]));
const BRUTO: Record<TipoItem, Record<string, any>> = {
  arma: Object.fromEntries((ARMA_D as any[]).map((x) => [x.id, x])),
  escudo: Object.fromEntries((ESCUDO_D as any[]).map((x) => [x.id, x])),
  armadura: Object.fromEntries((ARMADURA_D as any[]).map((x) => [x.id, x])),
};

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
/** A arma e o escudo fora do catálogo, como nascem na ficha. */
export const REF_ARMA_LIVRE = 'c', REF_ESCUDO_LIVRE = 'ce';
export const ARMA_LIVRE = {
  nome: 'Arma personalizada', dado: 1, danoBonus: 0, acerto: -2, defesaArma: 0, maos: 1, ticks: 5, folego: 0,
  atrib: 'forca', pericia: 'briga', tags: [] as string[], tipoDano: 'impacto', forcaMult: 1,
};
export const ESCUDO_LIVRE = { nome: 'Escudo personalizado', bloqCaC: 0, penalidade: 0, vsProjetilRapido: { bloqueia: false, bonus: 0 } };

/** A base de uma peça de armadura: do catálogo, ou a peça livre. */
export function baseArmadura(id: string | undefined | null): any {
  if (id === ID_ARMADURA_LIVRE) return ARMADURA_LIVRE;
  return id ? ARMADURA[id] : undefined;
}

/**
 * Um campo editável de uma peça: onde mora, como se chama e o que aceita.
 * `numero` (o padrão) tem intervalo; `opcao` escolhe de uma lista; `lista` é texto
 * separado por vírgula (as tags). `opcional`: apagar o campo tira a chave do item.
 */
export interface CampoEquip {
  k: string; rot: string; min: number; max: number; sinal?: boolean;
  tipo?: 'numero' | 'opcao' | 'lista'; opcoes?: { v: string; rot: string }[]; opcional?: boolean; passo?: number;
}

/** Ordem dos campos = ordem em que a ficha mostra a arma: Velocidade / Acerto / Dano / Defesa. */
export const CAMPOS_ARMA: CampoEquip[] = [
  { k: 'ticks', rot: 'Velocidade', min: 1, max: 20 },
  { k: 'acerto', rot: 'Acerto', min: -10, max: 10, sinal: true },
  { k: 'dado', rot: 'Dado', min: 1, max: 6 },
  { k: 'danoBonus', rot: 'Dano ±', min: -10, max: 10, sinal: true },
  { k: 'defesaArma', rot: 'Defesa', min: -5, max: 10, sinal: true },
];
/**
 * Os campos que o catálogo tinha fixos e a D-259 abriu à edição: mãos, tipo de dano,
 * tags, Habilidade, alcance (a faixa e as duas distâncias) e o multiplicador de Força.
 */
export const CAMPOS_ARMA_MAIS: CampoEquip[] = [
  { k: 'maos', rot: 'Mãos', min: 1, max: 2 },
  { k: 'tipoDano', rot: 'Tipo de dano', min: 0, max: 0, tipo: 'opcao',
    opcoes: [{ v: 'impacto', rot: 'Impacto' }, { v: 'corte', rot: 'Corte' }, { v: 'perfurante', rot: 'Perfuração' }] },
  { k: 'pericia', rot: 'Habilidade', min: 0, max: 0, tipo: 'opcao',
    opcoes: [{ v: 'armas', rot: 'Armas' }, { v: 'briga', rot: 'Briga' }, { v: 'arremesso', rot: 'Arremesso' }, { v: 'atirador', rot: 'Atirador' }] },
  { k: 'forcaMult', rot: 'Força ×', min: 0, max: 3, opcional: true, passo: 0.5 },
  { k: 'alcance', rot: 'Alcance', min: 0, max: 0, tipo: 'opcao', opcional: true,
    opcoes: [{ v: 'curto', rot: 'curto' }, { v: 'medio', rot: 'médio' }, { v: 'longo', rot: 'longo' }] },
  { k: 'efetiva', rot: 'Efetiva (m)', min: 0, max: 1000, opcional: true },
  { k: 'distMax', rot: 'Distância (m)', min: 0, max: 2000, opcional: true },
  { k: 'tags', rot: 'Tags', min: 0, max: 0, tipo: 'lista' },
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
const ehSoak = (k: string) => k === 'impacto' || k === 'corte' || k === 'perfuracao';

/** Valor em uso de um campo no modelo antigo: o ajuste do jogador, ou o do catálogo. */
export function valorCampo(base: any, mod: any, c: CampoEquip): number {
  const v = num(mod?.[c.k]);
  return v == null ? Number(baseCampo(base, c) || 0) : lim(v, c);
}
/** Valor de um campo numa peça achatada (armadura guarda as três Absorções dentro de `soak`). */
export function baseCampo(base: any, c: CampoEquip): any {
  if (base?.soak && ehSoak(c.k)) return base.soak[c.k] ?? 0;
  if (c.tipo === 'opcao' || c.tipo === 'lista' || c.opcional) return base?.[c.k];
  return base?.[c.k] ?? 0;
}
/** Há algum campo trocado em relação ao catálogo? (modelo antigo, ref + ajuste) */
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

// ===== O item inteiro (D-259) =====
export type TipoItem = 'arma' | 'escudo' | 'armadura';
export interface TipoDaPeca { tipo: TipoItem; origem: string | null; livre: boolean }

/** O tipo e a origem de uma peça, pelo `ref` (arma e escudo) ou pelo `base` (armadura). */
export function tipoDaPeca(p: any): TipoDaPeca | null {
  if (!p || typeof p !== 'object') return null;
  const ref = typeof p.ref === 'string' ? p.ref : null;
  if (ref) {
    if (ref === REF_ARMA_LIVRE) return { tipo: 'arma', origem: null, livre: true };
    if (ref === REF_ESCUDO_LIVRE) return { tipo: 'escudo', origem: null, livre: true };
    if (ref.startsWith('a:')) return ref === 'a:desarmado' ? null : { tipo: 'arma', origem: ref.slice(2), livre: false };
    if (ref.startsWith('e:')) return { tipo: 'escudo', origem: ref.slice(2), livre: false };
    return null;
  }
  if (typeof p.base === 'string') {
    return p.base === ID_ARMADURA_LIVRE ? { tipo: 'armadura', origem: null, livre: true } : { tipo: 'armadura', origem: p.base, livre: false };
  }
  return null;
}

/** O envelope do catálogo, copiado: `origem` no lugar do `id`, sem os blocos vazios. */
export function copiaDoCatalogo(tipo: TipoItem, origem: string): any | null {
  const bruto = BRUTO[tipo][origem];
  if (!bruto) return null;
  const { id, ...resto } = structuredClone(bruto);
  for (const k of ['arma', 'escudo', 'armadura', 'municao']) if (resto[k] == null) delete resto[k];
  return { origem: id, ...resto };
}
/** O envelope da peça livre (sem origem), a partir dos números achatados dela. */
function envelopeLivre(tipo: TipoItem, plano: any): any {
  const { nome, tags, notas, id, ...bloco } = plano;
  return { origem: null, nome, tipo, ...(tags ? { tags: [...tags] } : {}), [tipo]: structuredClone(bloco) };
}
/** O bloco de números de um envelope (o `arma`, o `escudo` ou o `armadura`). */
const blocoDe = (item: any) => item?.[item?.tipo] ?? item?.arma ?? item?.escudo ?? item?.armadura ?? null;

/** O item achatado, no formato de sempre dos leitores. `id` repete a origem. */
export function itemAchatado(item: any): any {
  if (!item || typeof item !== 'object') return null;
  const bloco = blocoDe(item) || {};
  const { arma, escudo, armadura, municao, origem, ...raiz } = item;
  return { ...raiz, ...structuredClone(bloco), ...(origem ? { id: origem } : {}), origem: origem ?? null, notas: raiz.descricao };
}

/** Escreve um campo no envelope (a armadura guarda as Absorções em `soak`). `null` apaga. */
export function escreveCampo(item: any, c: CampoEquip, v: any) {
  if (c.k === 'tags') { item.tags = Array.isArray(v) ? v : []; return; }
  const bloco = blocoDe(item); if (!bloco) return;
  if (ehSoak(c.k) && item.tipo === 'armadura') { (bloco.soak ||= {})[c.k] = v ?? 0; return; }
  if (v == null) { delete bloco[c.k]; return; }
  bloco[c.k] = v;
  // O tipo de dano da conta é o do modo principal (`modos`), não o `tipoDano` solto:
  // trocar um sem o outro mostraria um tipo e calcularia outro.
  if (c.k === 'tipoDano' && Array.isArray(bloco.modos)) {
    const princ = bloco.modos.find((m: any) => m.principal) ?? bloco.modos[0];
    if (princ) {
      princ.tipo = v;
      bloco.modos = bloco.modos.filter((m: any) => m === princ || m.tipo !== v);
      if (v !== 'perfurante') delete princ.perf; else if (princ.perf == null) princ.perf = bloco.pen ?? 0;
    }
  }
}

/**
 * O item de uma peça gravada no modelo antigo: catálogo de hoje mais o ajuste, com
 * os mesmos limites de `valorCampo` (a conta que a ficha mostrava). A peça livre
 * parte do que ela própria guardava (arma: dado, bônus e acerto, com os limites antigos).
 */
export function materializa(p: any, chaveMod: 'mod' | 'ajuste' = 'mod', modExtra?: any): any | null {
  const t = tipoDaPeca(p); if (!t) return null;
  const mod = modExtra ?? p?.[chaveMod];
  const campos = t.tipo === 'arma' ? CAMPOS_ARMA : t.tipo === 'escudo' ? CAMPOS_ESCUDO : CAMPOS_ARMADURA;
  let item: any, base: any;
  if (t.livre) {
    if (t.tipo === 'arma') {
      const clamp = (v: any, lo: number, hi: number, d: number) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, Math.round(n))) : d; };
      base = { ...ARMA_LIVRE, dado: clamp(p.dado, 1, 2, ARMA_LIVRE.dado), danoBonus: clamp(p.danoBonus, -2, 2, ARMA_LIVRE.danoBonus), acerto: clamp(p.acerto, -6, 6, ARMA_LIVRE.acerto) };
    } else if (t.tipo === 'escudo') base = { ...ESCUDO_LIVRE };
    else base = { ...ARMADURA_LIVRE };
    item = envelopeLivre(t.tipo, base);
  } else {
    item = copiaDoCatalogo(t.tipo, t.origem!); if (!item) return null;
    base = itemAchatado(item);
  }
  if (mod && typeof mod === 'object') for (const c of campos) if (num(mod[c.k]) != null) escreveCampo(item, c, valorCampo(base, mod, c));
  return item;
}

/** O item em uso de uma peça: a cópia guardada; numa peça antiga, a conta de antes. Achatado. */
export function itemDaPeca(p: any): any | null {
  if (p?.item && typeof p.item === 'object') return itemAchatado(p.item);
  const item = materializa(p);
  return item ? itemAchatado(item) : null;
}
/** O item do catálogo de onde a peça veio, achatado (para mostrar o que difere do livro). */
export function origemDaPeca(p: any): any | null {
  const t = tipoDaPeca(p); if (!t) return null;
  if (t.livre) return itemAchatado(envelopeLivre(t.tipo, t.tipo === 'arma' ? ARMA_LIVRE : t.tipo === 'escudo' ? ESCUDO_LIVRE : ARMADURA_LIVRE));
  const c = copiaDoCatalogo(t.tipo, p?.item?.origem ?? t.origem!);
  return c ? itemAchatado(c) : null;
}
/** O item de volta ao do livro (o "restaurar"). A peça livre volta ao padrão dela. */
export function restaurarItem(p: any) {
  const t = tipoDaPeca(p); if (!t) return;
  const novo = t.livre ? envelopeLivre(t.tipo, t.tipo === 'arma' ? ARMA_LIVRE : t.tipo === 'escudo' ? ESCUDO_LIVRE : ARMADURA_LIVRE)
    : copiaDoCatalogo(t.tipo, p?.item?.origem ?? t.origem!);
  if (novo) p.item = novo;
}

/**
 * Dá item inteiro a toda peça que ainda não tem, na leitura. Aceita a ficha no
 * formato de LEITURA (arsenal, conjuntos[].habil/inabil, equip.armaduras com `mod`
 * e o `armMod` antigo) e, com `novo`, o formato gravado da 41 (equipamento.arsenal,
 * conjuntos[].maoHabil/maoInabil, armaduras com `ajuste`). Idempotente: peça que já
 * tem `item` não muda, e peça cuja origem não está no catálogo fica como está.
 */
export function congelarItens(S: any, novo = false): any {
  if (!S || typeof S !== 'object') return S;
  const chave = novo ? 'ajuste' : 'mod';
  const fix = (p: any, extra?: any) => {
    if (!p || typeof p !== 'object' || (p.item && typeof p.item === 'object')) return;
    const item = materializa(p, chave, extra); if (!item) return;
    p.item = item; delete p[chave];
    if (p.ref === REF_ARMA_LIVRE) { delete p.dado; delete p.danoBonus; delete p.acerto; }
  };
  const eq = novo ? S.equipamento : S.equip;
  const arsenal = novo ? eq?.arsenal : S.arsenal;
  const conjuntos = novo ? eq?.conjuntos : S.conjuntos;
  const maos = novo ? ['maoHabil', 'maoInabil'] : ['habil', 'inabil'];
  for (const p of Array.isArray(arsenal) ? arsenal : []) fix(p);
  for (const cj of Array.isArray(conjuntos) ? conjuntos : []) for (const m of maos) fix(cj?.[m]);
  if (eq && Array.isArray(eq.armaduras)) {
    const mods = (!novo && eq.armMod && typeof eq.armMod === 'object') ? eq.armMod : {};
    eq.armaduras = eq.armaduras.map((p: any) => {
      if (typeof p !== 'string') { fix(p); return p; }
      const o: any = { base: p, vestida: true };
      fix(o, mods[p]);
      return o.item ? o : p;
    });
    if (!novo && eq.armMod && !eq.armaduras.some((p: any) => typeof p === 'string')) delete eq.armMod;
  }
  return S;
}

/** Arma de um slot de mão (o item da peça), ou null se o slot não tem arma. */
export function armaDoSlot(slot: any) {
  const ref = String(slot?.ref || 'nada');
  if (!ref.startsWith('a:')) return null;
  if (ref === 'a:desarmado') return ARMA['desarmado'] ?? null;
  return itemDaPeca(slot);
}
/** Escudo de um slot de mão (o item da peça), ou null. */
export function escudoDoSlot(slot: any) {
  const ref = String(slot?.ref || 'nada');
  if (!ref.startsWith('e:')) return null;
  return itemDaPeca(slot);
}
/**
 * Peças de armadura VESTIDAS, cada uma pelo item dela.
 *
 * Aceita os formatos antigos, porque o rastreador de combate da mesa lê fichas gravadas
 * antes da mudança e elas continuam válidas:
 *   antigo: equip.armaduras = ['gambeson', 'cota-de-malha']  (ids do catálogo, todas vestidas)
 *   41:     equip.armaduras = [{ uid, base, nome?, mod?, img?, vestida }]
 *   D-259:  equip.armaduras = [{ uid, base, nome?, item, img?, vestida }]
 */
export function armadurasDe(S: any) {
  S = fichaParaLeitura(S);
  const lista = S?.equip?.armaduras || [];
  const mods = S?.equip?.armMod || {};
  return lista
    .map((p: any) => {
      if (typeof p === 'string') { const it = materializa({ base: p }, 'mod', mods[p]); return it ? itemAchatado(it) : null; }
      if (!p || p.vestida === false) return null;
      const a = itemDaPeca(p); if (!a) return null;
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
