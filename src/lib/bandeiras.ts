// As bandeiras de regra, e o carimbo que impede o chão de mudar no meio da cena.
//
// O perfil vive em `regras.json → bandeiras` e viaja no pacote do site. Sem
// carimbo, um deploy troca o `regras.json` e um encontro aberto continua de onde
// parou com outro chão: a Defesa de uma peça muda entre dois Ticks da mesma
// cena, e nenhum teste pega, porque não é erro de programação.
//
// Este arquivo é PURO. Quem lê o banco é a página; aqui só se compara.
import regras from '../data/regras.json';

/** Os nomes, na ordem em que o relatório os lista. Fonte única. */
export const BANDEIRAS = [
  'margem', 'gate', 'porte', 'bloqueio', 'modo2', 'teto6',
  'curaSemArea', 'curaDivide', 'porRodada',
  'n1', 'n2', 'n3', 'n4', 'n5', 'n6',
] as const;

export type Bandeira = (typeof BANDEIRAS)[number];
export type Perfil = Record<Bandeira, boolean>;

const CRU = (regras as { bandeiras?: Record<string, unknown> }).bandeiras || {};

/** O perfil que o pacote traz. É o que vale para encontro sem carimbo. */
export const PERFIL_CORRENTE: Perfil = Object.fromEntries(
  BANDEIRAS.map((b) => [b, CRU[b] === true]),
) as Perfil;

/**
 * Normaliza um perfil vindo do banco.
 *
 * Bandeira que falta no carimbo vale **false**, e não o valor corrente: o
 * carimbo é a foto de um mundo em que ela não existia, e herdar o valor de hoje
 * seria justamente deixar o chão mudar, que é o que o carimbo evita.
 */
export function perfilDe(cru: unknown): Perfil {
  const o = (cru && typeof cru === 'object' ? cru : {}) as Record<string, unknown>;
  return Object.fromEntries(BANDEIRAS.map((b) => [b, o[b] === true])) as Perfil;
}

/**
 * O perfil que uma cena roda: o carimbo, se houver, senão o do pacote.
 *
 * Carimbo nulo é encontro anterior à migração 29, e é caso normal por muito
 * tempo. Ele não é erro e não bloqueia nada; só não protege.
 */
export function perfilDoEncontro(enc: { perfil?: unknown } | null | undefined): Perfil {
  return enc?.perfil ? perfilDe(enc.perfil) : { ...PERFIL_CORRENTE };
}

/** Quais bandeiras diferem entre dois perfis, na ordem de `BANDEIRAS`. */
export function diferencas(a: Perfil, b: Perfil): Bandeira[] {
  return BANDEIRAS.filter((k) => a[k] !== b[k]);
}

/**
 * A frase que a tela mostra sobre o chão desta cena.
 *
 * Dizer só "perfil carimbado" não serve: o que a pessoa precisa saber é se o
 * carimbo está DIFERENTE do que o site traz hoje, porque é aí que uma regra
 * parece quebrada sem estar.
 */
export function estadoDoCarimbo(enc: { perfil?: unknown; perfil_em?: string | null } | null | undefined): {
  temCarimbo: boolean; difere: Bandeira[]; desde: string | null; frase: string;
} {
  const temCarimbo = !!enc?.perfil;
  const difere = temCarimbo ? diferencas(perfilDe(enc!.perfil), PERFIL_CORRENTE) : [];
  const desde = (enc?.perfil_em as string) || null;
  const frase = !temCarimbo
    ? 'sem carimbo: esta cena roda as regras do site, e elas mudam se o site mudar'
    : difere.length === 0
      ? 'carimbado, e igual às regras do site'
      : `carimbado e DIFERENTE do site em ${difere.length}: ${difere.join(', ')}`;
  return { temCarimbo, difere, desde, frase };
}
