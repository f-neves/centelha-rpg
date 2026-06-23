// Calculadoras dos traços derivados e de XP.
// TODOS os números vêm de src/data/regras.json — nada hardcoded aqui.
import regras from '../data/regras.json';

export { regras };

export interface Atributos {
  forca: number; destreza: number; vigor: number;
  influencia: number; perspicacia: number; compostura: number;
  percepcao: number; inteligencia: number; raciocinio: number;
}
export interface Pericias { [id: string]: number }
export interface Virtudes { compaixao: number; conviccao: number; temperanca: number; valor: number }

const floor = Math.floor;

/** Pool de dados: [(Atrib+Hab)/2] dados, +2 se a soma for ímpar. */
export function pool(atributo: number, habilidade: number) {
  const soma = atributo + habilidade;
  return { dados: floor(soma / 2), bonus: soma % 2 === 1 ? 2 : 0, soma };
}
export function poolStr(atributo: number, habilidade: number) {
  const { dados, bonus } = pool(atributo, habilidade);
  return `${dados}d6${bonus ? ` + ${bonus}` : ''}`;
}

export function pv(vigor: number) {
  const d = regras.derivados.pv;
  return d.base + vigor * d.vigorMult;
}

/** Defesa (Esquiva/Bloqueio): (Destreza + Habilidade) × 2 + Especialidade + Centelha×2. */
export function defesa(opts: { destreza: number; habilidade: number; especialidade?: number; centelha: number }) {
  const d = regras.derivados.defesa as { mult: number; centelhaMult?: number };
  return (opts.destreza + opts.habilidade) * d.mult + (opts.especialidade ?? 0) + opts.centelha * (d.centelhaMult ?? 1);
}

/** Defesa Mental: Integridade×2 + Vontade + Centelha×2. Integridade é a habilidade homônima. */
export function defesaMental(opts: { integridade: number; vontade: number; centelha: number }) {
  const d = regras.derivados.defesaMental as { mult: number; maisVontade?: boolean; maisCentelha?: boolean; centelhaMult?: number };
  return opts.integridade * d.mult + (d.maisVontade ? opts.vontade : 0) + (d.maisCentelha ? opts.centelha * (d.centelhaMult ?? 1) : 0);
}

/** Defesa Social (vs leitura/Perspicácia): (Compostura + Temperança + Centelha) × 2. */
export function defesaSocial(opts: { compostura: number; temperanca: number; centelha: number }) {
  const d = regras.derivados.defesaSocial as { mult: number; tracos: string[] };
  const v: Record<string, number> = { compostura: opts.compostura, temperanca: opts.temperanca, centelha: opts.centelha };
  return d.tracos.reduce((s, k) => s + (v[k] ?? 0), 0) * d.mult;
}

/** Bônus de Centelha somado à SOMA do ataque (simétrico às defesas). */
export function ataqueCentelha(centelha: number) {
  const d = regras.derivados.ataque as { centelhaMult?: number };
  return centelha * (d?.centelhaMult ?? 0);
}

/** Modificador da Aparência (curva −4..+4) somado FLAT à jogada social alinhada. */
export function aparenciaMod(nivel: number) {
  const a = regras.aparencia as { curva: Record<string, number> };
  return a.curva[String(nivel)] ?? 0;
}

/** Energia: (Centelha×3) + soma das Virtudes + Vontade. */
export function energia(opts: { centelha: number; virtudes: Virtudes; vontade: number }) {
  const d = regras.derivados.energia;
  const somaV = opts.virtudes.compaixao + opts.virtudes.conviccao + opts.virtudes.temperanca + opts.virtudes.valor;
  return opts.centelha * d.centelhaMult + (d.maisSomaVirtudes ? somaV : 0) + (d.maisVontade ? opts.vontade : 0);
}

/** Mana: (Centelha×2) + Vontade. */
export function mana(opts: { centelha: number; vontade: number }) {
  const d = regras.derivados.mana;
  return opts.centelha * d.centelhaMult + (d.maisVontade ? opts.vontade : 0);
}

/** Fôlego: reserva física p/ ações comuns. base + Vigor×5 + Resistência×4 + Vontade×2. */
export function folego(opts: { vigor: number; resistencia: number; vontade: number }) {
  const d = regras.derivados.folego as { base: number; vigorMult: number; resistenciaMult: number; vontadeMult: number };
  return d.base + opts.vigor * d.vigorMult + opts.resistencia * d.resistenciaMult + opts.vontade * d.vontadeMult;
}

// ----- Dano, Soak e armadura -----
export type Modo = 'corte' | 'projetil' | 'perfConc' | 'impacto';
export type SoakCat = 'impacto' | 'corte' | 'perfuracao';
export const MODOS: Modo[] = ['corte', 'projetil', 'perfConc', 'impacto'];
export const MODO_NOME: Record<Modo, string> = { corte: 'Corte', projetil: 'Projétil', perfConc: 'Perfurante', impacto: 'Impacto' };
/** Ordem de exibição dos modos da arma: Projétil mantém a frente; depois Impacto · Corte · Perfurante. */
export const MODO_ORDEM: Record<Modo, number> = { projetil: 0, impacto: 1, corte: 2, perfConc: 3 };
/** Cada modo de ataque cai numa das 3 categorias de Soak da armadura (Projétil e Perf.C → Perfuração). */
export const MODO_SOAK: Record<Modo, SoakCat> = { corte: 'corte', projetil: 'perfuracao', perfConc: 'perfuracao', impacto: 'impacto' };
export const SOAK_CATS: SoakCat[] = ['impacto', 'corte', 'perfuracao'];
export const SOAK_CAT_NOME: Record<SoakCat, string> = { impacto: 'Impacto', corte: 'Corte', perfuracao: 'Perfuração' };

/** Absorção natural do corpo: Impacto = Vigor cheio; Corte e Perfuração = 0 (a carne não para o fio/ponta — só a Centelha e a armadura). A Centelha é somada à parte (em `soak()`), então: I = Vigor + Centelha, C = Centelha, P = Centelha. */
export function soakNatural(vigor: number, cat: Modo | SoakCat) {
  return cat === 'impacto' ? vigor : 0;
}

/** Empilha peças de armadura: maior Soak de cada categoria; Resist.Perf (Nível) = MAIOR (nunca soma); Penalidade SOMA. */
export function empilharArmaduras(
  pecas: Array<{ soak?: Partial<Record<SoakCat, number>>; resistPerf?: number; penalidade?: number }>,
) {
  const soak: Record<SoakCat, number> = { impacto: 0, corte: 0, perfuracao: 0 };
  let resistPerf = 0, penalidade = 0;
  for (const p of pecas) {
    for (const c of SOAK_CATS) soak[c] = Math.max(soak[c], p.soak?.[c] ?? 0);
    resistPerf = Math.max(resistPerf, p.resistPerf ?? 0);
    penalidade += p.penalidade ?? 0;
  }
  return { soak, resistPerf, penalidade };
}

/** Soak total de um modo = Soak natural + Centelha + absorção da armadura na categoria do modo. */
export function soak(opts: { vigor: number; centelha: number; modo: Modo; armaduraSoak?: number }) {
  const c = (regras.dano as { centelhaNoSoak?: number })?.centelhaNoSoak ?? 0;
  return soakNatural(opts.vigor, opts.modo) + opts.centelha * c + (opts.armaduraSoak ?? 0);
}

/** O gate de Perfuração abre? Só vale p/ projétil e perf. concentrada; corte/impacto sempre passam. */
export function gatePerfuracaoAbre(modo: Modo, perfArma: number, resistPerf: number) {
  const modos = (regras.dano as { gatePerfuracao?: { modos: string[] } })?.gatePerfuracao?.modos ?? ['projetil', 'perfConc'];
  if (!modos.includes(modo)) return true;
  return perfArma >= resistPerf;
}

/** Iniciativa: 1d6 + Raciocínio + Prontidão. */
export function iniciativa(traits: Record<string, number>) {
  const d = regras.derivados.iniciativa;
  const bonus = d.soma.reduce((s, k) => s + (traits[k] ?? 0), 0);
  return { dado: d.dado, bonus, str: `1d6 + ${bonus}` };
}

/** Deslocamento: corrida (m/s) e normal (m fixo) de movimento, e pulo (cm). */
export function deslocamento(traits: { forca?: number; destreza?: number; atletismo?: number; centelha?: number }) {
  const d = regras.derivados.deslocamento as Record<string, Record<string, number>>;
  const calc = (c: Record<string, number>) =>
    Math.round(Object.entries(c).reduce((s, [k, v]) => s + ((traits as Record<string, number>)[k] ?? 0) * v, 0));
  return {
    arranque: calc(d.arranque), corrida: calc(d.corrida), normal: calc(d.normal),
    saltoVertical: calc(d.saltoVertical),
    saltoHorizontalParado: calc(d.saltoHorizontalParado),
    saltoHorizontalCorrendo: calc(d.saltoHorizontalCorrendo),
  };
}

// ----- XP -----
function step(spec: { tipo: string; valor: number }, novoValor: number, banda = 0) {
  if (spec.tipo === 'mult') return novoValor * spec.valor;
  if (spec.tipo === 'flat') return spec.valor;
  if (spec.tipo === 'porBanda') return banda * spec.valor;
  if (spec.tipo === 'porNivel') return novoValor * spec.valor;
  return 0;
}

/** Custo total para subir um traço-de-pontos do piso F até o valor V. */
export function custoPontos(chave: keyof typeof regras.xp, de: number, ate: number) {
  const spec = regras.xp[chave] as { tipo: string; valor: number };
  let c = 0;
  for (let v = de + 1; v <= ate; v++) c += step(spec, v);
  return c;
}
export function custoTecnica(banda: number) {
  return step(regras.xp.tecnica as any, 0, banda);
}
export function custoArte(nivel: number) {
  // arte = nível × valor; total p/ chegar ao nível N = soma 1..N
  let c = 0;
  for (let n = 1; n <= nivel; n++) c += step(regras.xp.arte as any, n);
  return c;
}
