// Núcleo do editor de criaturas do bestiário: vocabulário, derivados e persistência.
// Fica fora do .astro para poder ser importado tanto no servidor (montar o form)
// quanto no cliente (recalcular ao vivo), sem duplicar número nenhum.
import { pv, defesa, defesaMental, defesaSocial, regras } from './calc';
import type { Porte } from './calc';
import vocab from '../data/elementos-vocab.json';
import armaduras from '../data/armaduras.json';

/** Vocabulário de fraqueza e resistência, agrupado, vindo de `elementos-vocab.json`,
 *  que é a fonte única dele (o validador e o gen-elementos leem o mesmo arquivo).
 *  Palavra nova oficial entra LÁ; palavra avulsa pode entrar direto na criatura. */
export const GRUPOS_ELEM = vocab.grupos as { nome: string; palavras: string[] }[];
export const ROTULO_ELEM = vocab.rotulos as Record<string, string>;
export const VOCAB_ELEM = GRUPOS_ELEM.flatMap((g) => g.palavras);
export const rotuloElem = (k: string) => ROTULO_ELEM[k] ?? k;

/** O bestiário guarda o porte como RÓTULO ("Enorme", "Miúdo") e o `calc.ts` espera
 *  slug ("enorme", "minusculo"). Sem esta ponte o porte cai no padrão Médio em
 *  silêncio, e um Treant perde 26 PV sem ninguém perceber. */
export const PORTE_LBL: Record<string, string> = {
  minusculo: 'Miúdo', pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande',
  enorme: 'Enorme', imenso: 'Imenso', colossal: 'Colossal',
};
const PORTE_SLUG: Record<string, Porte> = Object.fromEntries(
  Object.entries(PORTE_LBL).map(([slug, lbl]) => [lbl.toLowerCase(), slug as Porte]),
) as Record<string, Porte>;

export function porteSlug(v: string | undefined): Porte {
  if (!v) return 'medio';
  const k = String(v).toLowerCase();
  if (k in PORTE_LBL) return k as Porte;      // já é slug
  return PORTE_SLUG[k] ?? 'medio';            // é rótulo
}

export const TIPOS_INIMIGO = ['capanga', 'soldado', 'elite', 'fera', 'chefe'];
export const ARMADURAS = (armaduras as { id: string; nome: string }[]).map((a) => ({ id: a.id, nome: a.nome }));
export const MATERIAIS = [
  'pedra', 'metal', 'madeira', 'planta', 'carne', 'carne animada',
  'gosma', 'gelo', 'agua', 'fogo', 'terra', 'ar',
];
export const TIPOS_DANO = ['corte', 'perfurante', 'impacto'];

export interface Ataque {
  nome: string;
  atrib: string;
  pericia: string;
  dado: number;
  mao: number;          // 1 ou 2; ignorado quando `distancia`
  distancia?: boolean;
  tipo: string;         // corte | perfurante | impacto
  acerto: number;
  perf: number;
  ticks: number;        // a Velocidade da arma
  distMax?: number;     // alcance máximo, em metros, nas de distância
  defesaArma?: number;
  notas?: string;
}

/** Bônus somados ao que a fórmula calculou. Nunca substituem: assim a criatura
 *  continua ancorada na régua e a diferença fica visível para quem reequilibrar. */
export interface Bonus {
  pv?: number; defesa?: number; defesaSocial?: number; defesaMental?: number;
  vontade?: number; absorcao?: number; resistPerf?: number; iniciativa?: number;
}

export interface CriaturaEdit {
  id: string;
  nome: string;
  nomeIngles?: string;
  conceito: string;
  descricao?: string;
  categoria?: string;
  tipo?: string;
  tags?: string[];
  ameaca: number;
  centelha: number;
  porte: string;
  atributos: Record<string, number>;
  pericias?: Record<string, number>;
  vontade: number;
  integridade: number;
  prontidao: number;
  armadura?: string;
  material?: string;
  fraquezas: string[];
  resistencias: string[];
  bonus?: Bonus;
  ataques?: Ataque[];
  habilidades?: { nome: string; descricao: string }[];
  lore?: { titulo: string; texto: string }[];
  dimensoes?: { medida?: string; peso?: string };
  ecologia?: { tipo?: string; terreno?: string[]; clima?: string[] };
  imagem?: string;
  notas: string;
}

const nz = (v: unknown) => Number(v ?? 0) || 0;

/** Os derivados, pelas mesmas fórmulas dos personagens, com os bônus por cima. */
export function derivados(c: CriaturaEdit) {
  const a = c.atributos || {}, pe = c.pericias || {};
  const n = (k: string) => nz(a[k]);
  const sk = (k: string) => nz(pe[k]);
  const cent = nz(c.centelha);
  const vig = n('vigor');
  const b = c.bonus || {};
  const soakCent = (regras as any).dano?.centelhaNoSoak ?? 1;
  const arm = (armaduras as any[]).find((x) => x.id === (c.armadura || 'nenhuma')) || { soak: {}, penalidade: 0, resistPerf: 0 };
  const soakDe = (m: string) => vig + cent * soakCent + nz(arm.soak?.[m]) + nz(b.absorcao);

  const int = n('inteligencia');
  const social = pe?.sociabilidade ?? Math.max(0, sk('oratoria'), sk('manha'), sk('persuasao'), sk('lideranca'), sk('politica'));

  return {
    pv: pv(vig, porteSlug(c.porte)) + nz(b.pv),
    defesa: defesa({ destreza: n('destreza'), habilidade: sk('esquiva'), centelha: cent }) - nz(arm.penalidade) + nz(b.defesa),
    // Int < 2 não tem trato social e Int 0 não tem mente: as duas viram "-", como no gerador.
    defesaSocial: int >= 2 ? defesaSocial({ compostura: n('compostura'), sociabilidade: nz(social), centelha: cent }) + nz(b.defesaSocial) : '-',
    defesaMental: int >= 1 ? defesaMental({ raciocinio: n('raciocinio'), integridade: nz(c.integridade), vontade: nz(c.vontade), centelha: cent }) + nz(b.defesaMental) : '-',
    absorcao: { impacto: soakDe('impacto'), corte: soakDe('corte'), perfuracao: soakDe('perfuracao') },
    resistPerf: nz(arm.resistPerf) + nz(b.resistPerf),
    vontade: nz(c.vontade) + nz(b.vontade),
    iniciativa: `1d6 + ${n('raciocinio') + nz(c.prontidao) + nz(b.iniciativa)}`,
  };
}

/** Pool e dano de um ataque, pelas mesmas contas do gerador. */
export function rolagemAtaque(c: CriaturaEdit, a: Ataque) {
  const at = c.atributos || {}, pe = c.pericias || {};
  const soma = nz(at[a.atrib]) + nz(pe[a.pericia]);
  const dados = Math.floor(soma / 2), mais = soma % 2 === 1 ? 2 : 0;
  const acerto = nz(a.acerto) + nz(c.centelha) * ((regras as any).derivados?.ataque?.centelhaMult ?? 0);
  const fm = (regras as any).derivados.danoForca;
  const forca = a.distancia ? 0 : nz(at.forca) * (Number(a.mao) === 2 ? fm.duasMaos : fm.umaMao);
  return {
    pool: `${dados}d6${mais ? '+2' : ''}${acerto ? ` +${acerto}` : ''}`,
    dano: `${nz(a.dado)}d6${forca ? ` +${forca}` : ''} ${a.tipo}${nz(a.perf) ? ` · perf. ${nz(a.perf)}` : ''}`,
  };
}

const CHAVE = 'centelha:bestiario:edicoes';

export function lerEdicoes(): Record<string, Partial<CriaturaEdit>> {
  try { return JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch { return {}; }
}
export function salvarEdicao(id: string, dados: Partial<CriaturaEdit>) {
  const todas = lerEdicoes();
  todas[id] = dados;
  localStorage.setItem(CHAVE, JSON.stringify(todas));
}
export function apagarEdicao(id: string) {
  const todas = lerEdicoes();
  delete todas[id];
  localStorage.setItem(CHAVE, JSON.stringify(todas));
}

const semVazio = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null && v !== 0 && v !== false && !(Array.isArray(v) && !v.length)));

/** O bloco no formato que o `inimigos-custom.json` espera, pronto para colar. */
export function paraJson(c: CriaturaEdit) {
  const out: Record<string, unknown> = {
    id: c.id,
    nome: c.nome,
    ...(c.nomeIngles ? { nomeIngles: c.nomeIngles } : {}),
    tipo: c.tipo || 'soldado',
    ...(c.categoria ? { categoria: c.categoria } : {}),
    ameaca: nz(c.ameaca) || 1,
    centelha: nz(c.centelha),
    porte: PORTE_LBL[porteSlug(c.porte)],
    conceito: c.conceito || '',
    ...(c.descricao ? { descricao: c.descricao } : {}),
    ...(c.tags?.length ? { tags: c.tags } : {}),
    attrs: Object.fromEntries(Object.entries(c.atributos || {}).filter(([, v]) => nz(v) > 0).map(([k, v]) => [k, nz(v)])),
    pericias: Object.fromEntries(Object.entries({ ...(c.pericias || {}), prontidao: nz(c.prontidao) }).filter(([, v]) => nz(v) > 0).map(([k, v]) => [k, nz(v)])),
    vontade: nz(c.vontade),
    integridade: nz(c.integridade),
  };
  if (c.armadura && c.armadura !== 'nenhuma') out.armadura = c.armadura;
  if (c.material) out.material = c.material;
  if (c.fraquezas?.length) out.fraquezas = [...c.fraquezas].sort();
  if (c.resistencias?.length) out.resistencias = [...c.resistencias].sort();
  // `Bonus` é uma interface de campos nomeados, e `semVazio` só quer um objeto
  // para varrer: o cast é a ponte entre as duas leituras do mesmo dado.
  const bn = semVazio((c.bonus || {}) as unknown as Record<string, unknown>);
  if (Object.keys(bn).length) out.bonus = bn;
  if (c.ataques?.length) out.ataques = c.ataques.filter((a) => a.nome).map((a) => semVazio(a as unknown as Record<string, unknown>));
  if (c.habilidades?.length) out.habilidades = c.habilidades.filter((h) => h.nome);
  if (c.dimensoes?.medida || c.dimensoes?.peso) out.dimensoes = semVazio(c.dimensoes as Record<string, unknown>);
  if (c.ecologia?.tipo || c.ecologia?.terreno?.length || c.ecologia?.clima?.length) out.ecologia = semVazio(c.ecologia as Record<string, unknown>);
  if (c.imagem) out.imagem = c.imagem;
  if (c.lore?.length) out.lore = c.lore.filter((s) => s.titulo || s.texto);
  if (c.notas) out.notas = c.notas;
  return JSON.stringify(out, null, 2);
}
