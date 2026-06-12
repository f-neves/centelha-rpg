// Calculadoras dos traços derivados e de XP.
// TODOS os números vêm de src/data/regras.json — nada hardcoded aqui.
import regras from '../data/regras.json';

export { regras };

export interface Atributos {
  forca: number; destreza: number; vigor: number;
  carisma: number; manipulacao: number; aparencia: number;
  percepcao: number; inteligencia: number; raciocinio: number;
}
export interface Pericias { [id: string]: number }
export interface Virtudes { compaixao: number; conviccao: number; temperanca: number; valor: number }

const floor = Math.floor;

/** Pool de dados: ⌊(Atrib+Hab)/2⌋ dados, +2 se a soma for ímpar. */
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

/** Defesa (Esquiva): (Destreza + Habilidade) × 2 + Especialidade + Centelha. */
export function defesa(opts: { destreza: number; habilidade: number; especialidade?: number; centelha: number }) {
  const d = regras.derivados.defesa;
  return (opts.destreza + opts.habilidade) * d.mult + (opts.especialidade ?? 0) + opts.centelha;
}

/** Defesa Mental: Integridade×2 + Vontade + Centelha. Integridade é a perícia homônima. */
export function defesaMental(opts: { integridade: number; vontade: number; centelha: number }) {
  const d = regras.derivados.defesaMental;
  return opts.integridade * d.mult + (d.maisVontade ? opts.vontade : 0) + (d.maisCentelha ? opts.centelha : 0);
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

/** Iniciativa: 1d6 + Raciocínio + Prontidão. */
export function iniciativa(traits: Record<string, number>) {
  const d = regras.derivados.iniciativa;
  const bonus = d.soma.reduce((s, k) => s + (traits[k] ?? 0), 0);
  return { dado: d.dado, bonus, str: `1d6 + ${bonus}` };
}

/** Deslocamento: corrida (m/s) e normal (m fixo) de movimento, e pulo (cm). */
export function deslocamento(traits: { forca?: number; destreza?: number; corrida?: number; acrobacias?: number; centelha?: number }) {
  const d = regras.derivados.deslocamento as Record<string, Record<string, number>>;
  const calc = (c: Record<string, number>) =>
    Math.round(Object.entries(c).reduce((s, [k, v]) => s + ((traits as Record<string, number>)[k] ?? 0) * v, 0));
  return {
    corrida: calc(d.corrida), normal: calc(d.normal),
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
