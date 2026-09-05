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

export type Porte = 'minusculo' | 'pequeno' | 'medio' | 'grande' | 'enorme' | 'imenso' | 'colossal';

/** PV máximo. base + Vigor×mult, escalando com o porte (Médio = default, usado por PCs). */
export function pv(vigor: number, porte: Porte = 'medio') {
  const d = regras.derivados.pv as { base: number; vigorMult: number; porte?: Record<string, { base: number; vigorMult: number }> };
  const t = d.porte?.[porte] ?? { base: d.base, vigorMult: d.vigorMult };
  return t.base + vigor * t.vigorMult;
}

/** Defesa (Esquiva/Bloqueio): (Destreza + Habilidade) × 2 + Centelha + Especialidade. */
export function defesa(opts: { destreza: number; habilidade: number; especialidade?: number; centelha: number }) {
  const d = regras.derivados.defesa as { mult: number; centelhaMult?: number };
  return (opts.destreza + opts.habilidade) * d.mult + (opts.especialidade ?? 0) + opts.centelha * (d.centelhaMult ?? 1);
}

/** Defesa Mental: Raciocínio + Integridade + Vontade + Centelha + Especialidade (soma simples, sem ×2). */
export function defesaMental(opts: { raciocinio: number; integridade: number; vontade: number; centelha: number; especialidade?: number }) {
  const d = regras.derivados.defesaMental as { mult: number; maisRaciocinio?: boolean; maisVontade?: boolean; maisCentelha?: boolean; centelhaMult?: number };
  return opts.integridade * d.mult + (d.maisRaciocinio ? opts.raciocinio : 0) + (d.maisVontade ? opts.vontade : 0) + (d.maisCentelha ? opts.centelha * (d.centelhaMult ?? 1) : 0) + (opts.especialidade ?? 0);
}

/** Defesa Social (escudo social geral: resiste a influência E a leitura): (Compostura + Sociabilidade) × 2 + Centelha + Especialidade. */
export function defesaSocial(opts: { compostura: number; sociabilidade: number; centelha: number; especialidade?: number }) {
  const d = regras.derivados.defesaSocial as { mult: number; tracos: string[]; centelhaMult?: number };
  const v: Record<string, number> = { compostura: opts.compostura, sociabilidade: opts.sociabilidade };
  return d.tracos.reduce((s, k) => s + (v[k] ?? 0), 0) * d.mult + opts.centelha * (d.centelhaMult ?? 0) + (opts.especialidade ?? 0);
}

/** Bônus de Centelha somado à SOMA do ataque (simétrico às defesas: +1 por ponto). */
export function ataqueCentelha(centelha: number) {
  const d = regras.derivados.ataque as { centelhaMult?: number };
  return centelha * (d?.centelhaMult ?? 0);
}

/** Modificador da Aparência (curva −4..+4) somado FLAT à jogada social alinhada. */
export function aparenciaMod(nivel: number) {
  const a = regras.aparencia as { curva: Record<string, number> };
  return a.curva[String(nivel)] ?? 0;
}

/** Energia: (Vigor + Compostura + Raciocínio + Vontade) / 2 [floor] + Centelha×2. */
export function energia(opts: { vigor: number; compostura: number; raciocinio: number; vontade: number; centelha: number }) {
  const d = regras.derivados.energia as { divisor: number; centelhaMult: number; maisVontade?: boolean };
  const base = opts.vigor + opts.compostura + opts.raciocinio + (d.maisVontade ? opts.vontade : 0);
  return Math.floor(base / d.divisor) + opts.centelha * d.centelhaMult;
}

/** Mana: (Centelha×2) + Vontade. */
/** Bônus de reserva por nível da Arte Mana. */
export const MANA_ARTE_BONUS = [0, 1, 2, 3, 5, 8, 12];

export function mana(opts: { centelha: number; vontade: number; manipulacao?: number }) {
  const d = regras.derivados.mana;
  const arte = MANA_ARTE_BONUS[Math.max(0, Math.min(6, opts.manipulacao || 0))] || 0;
  return opts.centelha * d.centelhaMult + (d.maisVontade ? opts.vontade : 0) + arte;
}

/** Fôlego: reserva física p/ ações comuns. base + Vigor×5 + Resistência×4 + Vontade×2. */
export function folego(opts: { vigor: number; resistencia: number; vontade: number }) {
  const d = regras.derivados.folego as { base: number; vigorMult: number; resistenciaMult: number; vontadeMult: number };
  return d.base + opts.vigor * d.vigorMult + opts.resistencia * d.resistenciaMult + opts.vontade * d.vontadeMult;
}

// ----- Dano, Soak e armadura -----
// Três modos de ataque: Cortante, Perfurante (funde projétil e estocada) e Impacto.
export type Modo = 'corte' | 'perfurante' | 'impacto';
export type SoakCat = 'impacto' | 'corte' | 'perfuracao';
export const MODOS: Modo[] = ['corte', 'perfurante', 'impacto'];
export const MODO_NOME: Record<Modo, string> = { corte: 'Cortante', perfurante: 'Perfurante', impacto: 'Impacto' };
/** Sigla curta de cada modo, para blocos de combate e cards. */
export const MODO_SIGLA: Record<Modo, string> = { corte: '(C)', perfurante: '(P)', impacto: '(I)' };
/** Ordem de exibição dos modos da arma: Impacto · Cortante · Perfurante. */
export const MODO_ORDEM: Record<Modo, number> = { impacto: 0, corte: 1, perfurante: 2 };
/** Cada modo de ataque cai numa das 3 categorias de Soak da armadura (o Perfurante → Perfuração). */
export const MODO_SOAK: Record<Modo, SoakCat> = { corte: 'corte', perfurante: 'perfuracao', impacto: 'impacto' };
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

/** O gate de Perfuração abre? Só vale p/ o modo Perfurante; corte/impacto sempre passam. */
export function gatePerfuracaoAbre(modo: Modo, perfArma: number, resistPerf: number) {
  const modos = (regras.dano as { gatePerfuracao?: { modos: string[] } })?.gatePerfuracao?.modos ?? ['perfurante'];
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
export function deslocamento(
  traits: { forca?: number; destreza?: number; atletismo?: number; centelha?: number },
  // A fração da raça (baixa estatura: dois terços). Entra ANTES do
  // arredondamento, senão dois arredondamentos em sequência somam erro: 3,25
  // vira 3 e 3 × ⅔ vira 2, quando a conta certa é 3,25 × ⅔ = 2,17 → 2.
  frac = 1,
) {
  // O bloco tem uma `nota` de texto ao lado das escadas de números, e por isso
  // não é `Record<string, Record<string, number>>`: cada escada é lida à parte,
  // pelo nome, e a nota nunca passa por `calc`.
  const d = regras.derivados.deslocamento as unknown as Record<string, Record<string, number>>;
  // `base` é uma constante da fórmula, e não um traço: o passo livre virou
  // "2 metros mais um quarto de (Destreza + Atletismo)" em 22/08, para o
  // deslocamento em combate ficar na faixa humana de 2 a 5 m/s.
  const calc = (c: Record<string, number>) =>
    Math.round(Object.entries(c).reduce(
      (s, [k, v]) => s + (k === 'base' ? v : ((traits as Record<string, number>)[k] ?? 0) * v), 0) * frac);
  return {
    arranque: calc(d.arranque), corrida: calc(d.corrida), normal: calc(d.normal),
    saltoVertical: calc(d.saltoVertical),
    saltoHorizontalParado: calc(d.saltoHorizontalParado),
    saltoHorizontalCorrendo: calc(d.saltoHorizontalCorrendo),
  };
}

// ----- XP -----
// Modelo AFIM: o preço de UM nível é `base + mult × nível`. O `tipo` diz como somar:
//   'acum'   soma os preços do piso+1 até o nível  (Atributos, Habilidades, Virtudes, Artes…)
//   'flat'   cobra só o preço do nível pedido      (Proezas e Efeitos: comprar o N2 não exige o N1)
//   'gratis' não custa XP                          (Centelha: o tier vem do Mestre)
// Todos os números vivem em regras.json → xp. Nada de constante solta aqui.
export type XpChave = Exclude<keyof typeof regras.xp, 'modelo'>;
interface XpSpec { tipo: 'acum' | 'flat' | 'gratis'; base: number; mult: number; piso: number }
const xpSpec = (chave: XpChave) => (regras.xp as any)[chave] as XpSpec;

/** Nível que já vem pago (1 em Atributos e Virtudes, 0 no resto). */
export function pisoXp(chave: XpChave) { return xpSpec(chave).piso ?? 0; }

/** Preço de UM nível isolado, já respeitando o piso e o tipo 'gratis'. */
export function precoNivel(chave: XpChave, nivel: number) {
  const s = xpSpec(chave);
  if (s.tipo === 'gratis' || nivel <= (s.piso ?? 0)) return 0;
  return s.base + s.mult * nivel;
}

/** Custo total para levar um traço do piso até o valor. */
export function custoPontos(chave: XpChave, de = pisoXp(chave), ate = 0) {
  const s = xpSpec(chave);
  if (s.tipo === 'gratis') return 0;
  if (s.tipo === 'flat') return ate > de ? precoNivel(chave, ate) : 0;
  let c = 0;
  for (let v = de + 1; v <= ate; v++) c += precoNivel(chave, v);
  return c;
}

/** Proeza: preço do nível, sem acumular. Subir de nível paga só a diferença. */
export const custoTecnica = (nivel: number) => custoPontos('tecnica', undefined, nivel);
/** Arte: acumulativo, por Arte. */
export const custoArte = (nivel: number) => custoPontos('arte', undefined, nivel);
/** Efeito Especial de uma Arte: preço do nível, sem acumular. */
export const custoEfeito = (nivel: number) => custoPontos('efeito', undefined, nivel);
/** Especialidade nomeada: acumulativo, uma trilha por escopo. */
export const custoEspecialidade = (nivel: number, secundaria = false) =>
  custoPontos(secundaria ? 'especialidadeSecundaria' : 'especialidadePrimaria', undefined, nivel);

/**
 * O VALOR PASSIVO, pela fórmula do `coracao-do-sistema.md:59`:
 * `(Atributo + Habilidade) × 2 + Especialidade + Centelha`.
 *
 * Ele é a Dificuldade de quem se opõe sem rolar. O caso que o trouxe para cá é a
 * Percepção Passiva do alvo contra a Furtividade de quem ataca do escuro, mas a
 * fórmula é a geral, e por isso os parâmetros têm nome de papel e não de perícia.
 *
 * MORA NO `calc.ts` porque é o único módulo que os dois lados importam: a ficha
 * (`combate-resumo`) e o bestiário (`mesa-bestiario`). Pô-la num dos dois faria
 * o outro importar dele, e o bestiário já importa a ficha: seria ciclo.
 *
 * A ESPECIALIDADE NÃO ENTRA, e a ausência é declarada em vez de esquecida: nem a
 * criatura nem a ficha guardam especialidade POR PERÍCIA hoje. Quando guardarem,
 * ela soma aqui e em mais lugar nenhum.
 *
 * O TIPO `Sentidos` QUE MOROU AQUI FOI EMBORA em 04/09/2026, junto com o bloco
 * por assunto do `ResumoCombate`: com os nove atributos e as perícias crus no
 * resumo, quem precisa da Passiva a calcula com esta função no ponto de uso, e
 * um objeto guardando a conta pronta seria a terceira cópia do mesmo número.
 *
 * Nulo em qualquer metade devolve nulo, e não zero: "não dá para saber daqui" é
 * resposta diferente de "a Passiva é zero", e quem compara tem de poder separar
 * as duas.
 */
export const valorPassivo = (
  atributo?: number | null, habilidade?: number | null, centelha = 0,
) => (atributo == null || habilidade == null ? null : (atributo + habilidade) * 2 + centelha);
