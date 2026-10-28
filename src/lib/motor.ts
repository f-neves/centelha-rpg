// O motor único (D-228; plano-conversao.md, A2): as contas da criatura e do jogador, para o card, a mesa, o Grid, o
// editor e a ficha. A criatura guarda só entrada e escolha (D-216), e tudo o que se calcula sai daqui: o Tamanho pela
// área, a faixa e a Vida pela massa, o peso erguido pela R15, as Defesas, a Absorção, a Energia, a Mana, a Iniciativa
// e, por ataque, a Velocidade, a jogada e o dano médio (formato-criatura.md, seção 3).
//
// O nucleo do jogador e da criatura mora neste arquivo, com as regras de `regras.json`.
// Quem confere é o `scripts/test-motor.mjs`, contra os números das fichas (`scripts/fixtures/criaturas-esperado.json`).
import { pesoMaximoErguido } from './forca-empurrao';
import regras from '../data/regras.json';
import ARMADURAS from '../data/armaduras.json';
import ESCUDOS from '../data/escudos.json';
import ARMAS from '../data/armas.json';
import RACAS from '../data/racas.json';
// Nucleo de contas do jogador e da criatura, reunido neste motor.
const defMental=defesaMental, defSocial=defesaSocial, energiaDe=energia, manaDe=mana, iniciativaDe=iniciativa, pvDoTamanho=pv;
import { ARMA, ESCUDO as ESCUDO_EQUIP, armaDoSlot, escudoDoSlot, armadurasDe, armaComMod, escudoComMod } from './equip';
import { qaDaPeca, type QACombate } from './quase-acerto';
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

export type Porte = 'minusculo' | 'miudo' | 'pequeno' | 'medio' | 'grande' | 'enorme' | 'imenso' | 'colossal';

/**
 * A LINHA de `derivados.pv.porte` em uso, para quem precisa EXPLICAR a conta e
 * não só fazê-la.
 *
 * Ela existe porque a explicação da ficha trazia os dois números escritos à mão
 * (`25 + Vigor 3×3`), e com o Halfling virando `pequeno` (`M-29`) essa linha
 * passaria a imprimir "25 + Vigor 3×3 = 26", uma conta que não fecha dentro da
 * própria frase. Quem explica e quem calcula leem a MESMA linha daqui.
 */
export function pvPorte(porte: Porte = 'medio') {
  const d = regras.derivados.pv as { base: number; vigorMult: number; porte?: Record<string, { base: number; vigorMult: number }> };
  return d.porte?.[porte] ?? { base: d.base, vigorMult: d.vigorMult };
}

/** PV máximo. base + Vigor×mult, escalando com o porte (Médio = default, usado por PCs). */
export function pv(vigor: number, porte: Porte = 'medio') {
  const t = pvPorte(porte);
  return t.base + vigor * t.vigorMult;
}

/**
 * O LIMITE DA MORTE, abaixo do zero (`M-21`). Morre-se quando a Vida chega a
 * ESTE número ou menos.
 *
 * Ele não está escrito em lugar nenhum de propósito: sai do PV MÁXIMO de cada
 * um, porque PV máximo varia por Vigor e por porte. O arredondamento depende da
 * CENTELHA (`M-21c`): quem não a tem arredonda para baixo, quem a tem arredonda
 * para cima. Só muda em PV ímpar, e a diferença é de um ponto.
 *
 * **Devolve `null` quando não há PV máximo**, e isso não é o mesmo que zero: sem
 * PV máximo não existe limite, e inventar um aqui seria decidir por omissão. A
 * coluna `pv_max` de `combatentes` é anulável e nasce nula numa invocação sem o
 * campo, então este caso acontece de verdade. Quem chama trata o `null` como
 * "não sei", nunca como "morreu".
 *
 * **E a Centelha DESCONHECIDA erra para o lado de deixar vivo**, de propósito:
 * quem chama nem sempre tem a ficha do alvo na mão (o jogador não monta o perfil
 * das peças dos outros). Entre tratar como morto alguém que talvez esteja vivo e
 * o contrário, o segundo é recuperável na mesa e o primeiro não.
 */
export function limiteDaMorte(
  pvMax: number | null | undefined,
  centelha: number | null | undefined,
): number | null {
  if (pvMax == null || !(pvMax > 0)) return null;
  const m = (regras as any).morte || {};
  const divisor = m.limiteDivisor || 2;
  const arr = m.limiteArredonda || {};
  const lado = centelha == null || centelha > 0 ? 'comCentelha' : 'semCentelha';
  const arredonda = arr[lado] === 'alto' ? Math.ceil : Math.floor;
  return -arredonda(pvMax / divisor);
}

/** Passou do limite: a Vida chegou ao limite da morte ou abaixo dele. */
export function passouDoLimite(
  vida: number | null | undefined,
  pvMax: number | null | undefined,
  centelha: number | null | undefined,
): boolean {
  const limite = limiteDaMorte(pvMax, centelha);
  if (limite == null || vida == null) return false;
  return vida <= limite;
}

/**
 * O rótulo do porte, como o bestiário escreve ("Miúdo", "Médio"), normalizado
 * para a chave de `Porte`. MESMA FORMA e MESMO MOTIVO do `norm` de
 * `gen-bestiario.mjs`: minúsculas, sem acento; desde a D-179 "miudo" e
 * "minusculo" são dois portes (o Minúsculo é o oitavo). Reescrever esta
 * conversão à mão em outro lugar já custou 24 criaturas sem Furtividade (`regras.json → furtividadeCriatura.porte.nota`),
 * porque "miudo" não batia com a chave certa. As duas conversões precisam
 * andar juntas: mudou uma, olhe a outra.
 */
const NORM_PORTE: Record<string, Porte> = {
  miudo: 'miudo', minusculo: 'minusculo', pequeno: 'pequeno', medio: 'medio',
  grande: 'grande', enorme: 'enorme', imenso: 'imenso', colossal: 'colossal',
};
export function porteDeRotulo(rotulo: string | null | undefined): Porte {
  const k = String(rotulo || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return NORM_PORTE[k] || 'medio';
}

/**
 * O modificador de acerto por diferença de porte (`regras.json → porteAcerto`).
 *
 * A D-077, sem teto: +3 por categoria (`reforma.porCategoria`) pela `ordem`.
 * Corpo a corpo só o menor ganha; à distância é relativo nos dois sentidos
 * (alvo menor dá −3 por categoria). Só a metade da compensação: a outra metade
 * (Couraça de Porte, que corta o dano de quem é menor) já está aplicada em
 * tempo de geração (`gen-bestiario.mjs`), somada na `absorcao` de cada
 * criatura , esta função completa o par, não inventa um novo.
 */
export function modificadorPorte(porteAtacante: Porte, porteAlvo: Porte, aDistancia = false): number {
  const t = regras.porteAcerto as { ordem: string[]; reforma: { porCategoria: number } };
  const ia = t.ordem.indexOf(porteAtacante);
  const ib = t.ordem.indexOf(porteAlvo);
  if (ia < 0 || ib < 0) return 0;
  const diff = ib - ia; // positivo: o alvo está mais alto na ordem, é maior
  if (diff <= 0 && !aDistancia) return 0; // de perto, o maior ataca o menor sem penalidade
  return diff * t.reforma.porCategoria;
}

/**
 * O BÔNUS DE CENTELHA EM TODA JOGADA DE ATRIBUTO + HABILIDADE, NO VALOR
 * PASSIVO, NAS TRÊS DEFESAS E NA DEFESA PARADA (Reforma da Centelha,
 * 28/09/2026, confirmada pelo autor em 02/10/2026 no Adendo 1 da correção da
 * Reforma): 2 × o menor entre a Centelha e a Habilidade daquela jogada. Sempre
 * o menor: Habilidade 0 dá bônus 0, e "role Destreza + Atletismo" com
 * Atletismo 0 leva 0. A jogada de Atributo PURO é outra regra
 * (`centelhaSoAtributo`, abaixo).
 * Substitui o antigo "+1 por ponto" (`centelhaMult` em `regras.json`, que
 * ficou parado em 1 nos blocos de ataque/defesa/defesaMental/defesaSocial e
 * não é mais lido por eles).
 */
export function centelhaNaJogada(centelha: number, habilidade: number) {
  return 2 * Math.min(Math.max(0, centelha), Math.max(0, habilidade));
}

/**
 * Jogada de Atributo PURO, quando o Mestre pede só o Atributo (raro; "role
 * Destreza"): + a Centelha inteira, sem teto. É a D12 (decidida pelo autor em
 * 01/10/2026, `docs/pendencias/D-proezas-tecnicas.md`), mantida no Adendo 1 de
 * 02/10/2026. Conta o TIPO de jogada pedida, e não o personagem com Habilidade
 * 0: uma jogada de Atributo + Habilidade com Habilidade 0 usa
 * `centelhaNaJogada` e leva 0.
 */
export function centelhaSoAtributo(centelha: number) {
  return Math.max(0, centelha);
}

/** Defesa (Esquiva/Bloqueio): (Destreza + Habilidade) × 2 + 2×min(Centelha,Habilidade) + Especialidade. */
export function defesa(opts: { destreza: number; habilidade: number; especialidade?: number; centelha: number }) {
  const d = regras.derivados.defesa as { mult: number };
  return (opts.destreza + opts.habilidade) * d.mult + (opts.especialidade ?? 0)
    + centelhaNaJogada(opts.centelha, opts.habilidade);
}

/** Defesa Mental: Raciocínio + Integridade + Vontade + 2×min(Centelha,Integridade) + Especialidade. */
export function defesaMental(opts: { raciocinio: number; integridade: number; vontade: number; centelha: number; especialidade?: number }) {
  const d = regras.derivados.defesaMental as { mult: number; maisRaciocinio?: boolean; maisVontade?: boolean };
  return opts.integridade * d.mult + (d.maisRaciocinio ? opts.raciocinio : 0) + (d.maisVontade ? opts.vontade : 0)
    + centelhaNaJogada(opts.centelha, opts.integridade) + (opts.especialidade ?? 0);
}

/** Defesa Social (escudo social geral: resiste a influência E a leitura): (Compostura + Sociabilidade) × 2 + 2×min(Centelha,Sociabilidade) + Especialidade. */
export function defesaSocial(opts: { compostura: number; sociabilidade: number; centelha: number; especialidade?: number }) {
  const d = regras.derivados.defesaSocial as { mult: number; tracos: string[] };
  const v: Record<string, number> = { compostura: opts.compostura, sociabilidade: opts.sociabilidade };
  return d.tracos.reduce((s, k) => s + (v[k] ?? 0), 0) * d.mult
    + centelhaNaJogada(opts.centelha, opts.sociabilidade) + (opts.especialidade ?? 0);
}

/** Bônus de Centelha somado à SOMA do ataque: 2×min(Centelha,Habilidade da arma). */
export function ataqueCentelha(centelha: number, habilidade: number) {
  return centelhaNaJogada(centelha, habilidade);
}

/**
 * Modificador da Aparência (curva −6..+6, um ponto por nível, sem platô) somado FLAT à jogada social alinhada.
 *
 * `mascararCom`, quando passado, é a Compostura de quem está mascarando o
 * próprio módulo sob teste bem-sucedido de Compostura+Furtividade (M-20,
 * 16/09/2026): cada ponto reduz o módulo em direção a zero, sem passar dele.
 * Não rola dado nenhum aqui; quem chama já sabe que o teste passou.
 */
export function aparenciaMod(nivel: number, mascararCom?: number) {
  const a = regras.aparencia as { curva: Record<string, number> };
  const base = a.curva[String(nivel)] ?? 0;
  if (!mascararCom) return base;
  const reduzido = Math.max(0, Math.abs(base) - Math.max(0, mascararCom));
  return base < 0 ? -reduzido : reduzido;
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

/** Absorção natural do corpo: Impacto = Vigor cheio; Corte e Perfuração = 0 (a carne não para o fio/ponta , só a Centelha e a armadura). A Centelha é somada à parte (em `soak()`), então: I = Vigor + Centelha, C = Centelha, P = Centelha. */
export function soakNatural(vigor: number, cat: Modo | SoakCat) {
  return cat === 'impacto' ? vigor : 0;
}

/** Empilha peças de armadura: maior Soak de cada categoria; Resist.Perf (Nível) = MAIOR (nunca soma); Penalidade SOMA. */
/**
 * A arma como ela RENDE nas mãos deste braço, quando ela pede Força e o braço
 * não tem (`M-32`).
 *
 * O Arco Composto pede `forcaMin: 4` e é o único do jogo. Antes disto o
 * requisito imprimia um aviso e não fazia mais nada: o personagem de Força 1
 * equipava, lia "requer Força 4" na própria ficha, e atirava com o `Força×2`
 * inteiro. A ficha avisava e concedia na mesma linha, e o resultado PREMIAVA
 * quem ignorasse, porque na Força 1 o Composto batia `1d6+4` contra o `1d6+1`
 * do Arco Longo, que é a arma que ele deveria não conseguir usar.
 *
 * Agora ele não fica proibido: fica sendo um arco comum caro. Quem não arma o
 * arco por inteiro não recebe o que a curva daria, que é a mesma razão física
 * que dá o `×2` ao Composto (a curva dura guarda mais energia E exige braço).
 *
 * O que ela devolve é a arma com `forcaMult` e `danoBonus` REBAIXADOS ao
 * patamar comum (`×1` e `+0`), e não uma arma diferente: assim cada chamador
 * aplica isto UMA vez no topo e todo o resto da conta dele (o `capF`, o `mult`,
 * o `danoBonus`) já sai certo, sem espalhar um `if` por cada fórmula.
 *
 * Hoje só o Arco Composto tem `forcaMin`. Se um dia uma arma de CORPO A CORPO
 * ganhar o campo, a mesa precisa dizer se ela também cai em `+0`: perder o
 * `danoBonus` inteiro é natural num arco (ele vem da curva) e não é óbvio num
 * martelo.
 */
export function comRequisitoDeForca<T extends { forcaMin?: number; forcaMult?: number; danoBonus?: number }>(
  w: T, forca: number,
): T {
  if (!w || !w.forcaMin || forca >= w.forcaMin) return w;
  return { ...w, forcaMult: 1, danoBonus: 0 };
}

/**
 * A Força que o ARCO usa na conta do dano: acima de 8 conta como 8 (D-075, adendo 3 do 2f, 10/10/2026).
 * No alcance a mesma regra já está na tabela de Máxima dos arcos (`combate.distancia.maxima`). Vale só para
 * o arco (classe de distância que soma Força, `forcaMult` > 0): a besta não usa Força, e o arremesso e o corpo
 * a corpo não têm esse teto. Isto NÃO substitui o `forcaCap` (a Força máxima do Curto, 3): quem chama aplica
 * os dois, e o menor vale.
 */
export function forcaNoArco(w: { classe?: string; forcaMult?: number } | null | undefined, forca: number): number {
  const teto = Number((regras as any)?.combate?.distancia?.maxima?.forcaAcimaDeContaComo ?? 8);
  return w?.classe === 'distancia' && (w.forcaMult ?? 0) > 0 ? Math.min(forca, teto) : forca;
}

/** O requisito de Força que esta arma NÃO está cumprindo, ou 0. Para a tela dizer. */
export function forcaFaltando(w: { forcaMin?: number } | null | undefined, forca: number): number {
  return w?.forcaMin && forca < w.forcaMin ? w.forcaMin : 0;
}

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
  traits: { forca?: number; destreza?: number; atletismo?: number; centelha?: number; vigor?: number; natacao?: number },
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
    natacao: calc(d.natacao),
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
 * O VALOR PASSIVO, pela fórmula do `coracao-do-sistema.md:89` (Reforma da
 * Centelha, 28/09/2026): `(Atributo + Habilidade) × 2 + 2×mín(Centelha,
 * Habilidade) + Especialidade`.
 *
 * Ele é a Dificuldade de quem se opõe sem rolar. O caso que o trouxe para cá é a
 * Percepção Passiva do alvo contra a Furtividade de quem ataca do escuro, mas a
 * fórmula é a geral, e por isso os parâmetros têm nome de papel e não de perícia.
 *
 * MORA NO `calc.ts` porque é o único módulo que os dois lados importam: a ficha
 * (`combate-resumo`) e o bestiário (`mesa-bestiario`). Pô-la num dos dois faria
 * o outro importar dele, e o bestiário já importa a ficha: seria ciclo.
 *
 * A ESPECIALIDADE NÃO ENTRA, e o motivo NÃO é falta de dado. A ficha guarda,
 * nomeada e com nível (`S.spec[habilidade] = [{ s: nome, v: nível }]`,
 * `ficha-engine.ts:235`); quem não guarda é o bestiário, e nas 309 criaturas do
 * `inimigos.json` não há uma sequer. Este comentário dizia o contrário até a
 * `M-03`, e a conclusão dele sobrevivia por sorte.
 *
 * O motivo de verdade é melhor: o portão da Especialidade é a SITUAÇÃO, e um
 * Valor Passivo é calculado SEM SABER quem ataca nem como. Um bônus que só vale
 * quando o escopo nomeado se aplica não cabe num número calculado antes de a
 * situação existir. Então a base sai sem ela, e ela entra no instante em que o
 * escopo se revela, que é o que o capítulo já manda: a ficha não a soma
 * automaticamente no rolador.
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
) => (atributo == null || habilidade == null ? null : (atributo + habilidade) * 2 + centelhaNaJogada(centelha, habilidade));


export type Tamanho = Porte;
type Num = Record<string, number>;
/** O ataque natural guarda tudo o que não é conta; o com arma do livro, só `nome`, `arma` e `habilidade` (D-220). */
export interface AtaqueEntrada {
    nome: string;
    classe?: string;
    pgr?: [
        number,
        number,
        number
    ];
    dado?: string | null;
    multiplicadorForca?: number;
    habilidade?: string;
    acerto?: number;
    bloqueiaComoArma?: number | null;
    arma?: string;
}
export interface CorpoEntrada {
    massa?: number;
    semMassa?: boolean;
    volume?: number;
    area?: number;
    naoErgue?: boolean;
    tamanhoEscolhido?: Tamanho;
    linhaPV?: 'acima' | 'abaixo';
    segundoTamanho?: {
        area: number;
        tamanhoEscolhido?: Tamanho;
    };
}
export interface EntradaCriatura {
    categoria: string;
    centelha: number;
    atributos: Num;
    habilidades: Num;
    habilidadesSec: Num;
    vontade: number;
    corpo: CorpoEntrada;
    enxame?: { individuosPorQuadrado: number; tamanhoEquivalente: Tamanho };
    bonusPV?: number;
    couraca?: number;
    artes?: Num;
    // as peças da ficha do jogador (D-231, D-238): a arma `{ref: "a:<id>"}`, o escudo `{ref: "e:<id>"}`, a armadura `{base, vestida}`
    equipamento?: {
        arsenal: {
            ref: string;
        }[];
        armaduras: {
            base: string;
            vestida?: boolean;
        }[];
    };
    ataques: AtaqueEntrada[];
}
const C = (regras as any).criatura;
const ORDEM: Tamanho[] = (regras as any).porteAcerto.ordem;
const LINHAS_PV: {
    ateKg: number | null;
    base: number;
    vigorMult: number;
    vigorDivisor: number;
    zonaKg: [
        number,
        number
    ] | null;
}[] = (regras as any).derivados.pv.massa.conta;
const ARMADURA: Record<string, any> = Object.fromEntries((ARMADURAS as any[]).filter((a) => a.armadura).map((a) => [a.id, a.armadura]));
const ESCUDO: Record<string, any> = Object.fromEntries((ESCUDOS as any[]).filter((a) => a.escudo).map((a) => [a.id, a.escudo]));
const RACA: Record<string, any> = Object.fromEntries((RACAS as any[]).map((r) => [r.id, r]));
// ----- Tamanho, faixa e massa -----
/** O Tamanho pela área da silhueta, em m² (D-155, D-183). */
export function tamanhoDaArea(area: number): Tamanho {
    const i = (C.tamanho.cortesM2 as number[]).findIndex((c) => area <= c);
    return ORDEM[i < 0 ? ORDEM.length - 1 : i];
}
/** Os Tamanhos que a área aceita: o do corte primeiro e, a menos da folga (5%) de um corte, o vizinho (decisoes-autor §13). */
export function tamanhosDaArea(area: number): Tamanho[] {
    const out = [tamanhoDaArea(area)];
    (C.tamanho.cortesM2 as number[]).forEach((c, k) => {
        if (Math.abs(area - c) / c < C.tamanho.folga)
            for (const t of [ORDEM[k], ORDEM[k + 1]])
                if (!out.includes(t))
                    out.push(t);
    });
    return out;
}
/** A massa que entra nas contas: a do corpo, ou o volume do incorpóreo lido como carne e osso (D-190). */
export function massaDaConta(corpo: CorpoEntrada): number | undefined {
    if (corpo.semMassa)
        return corpo.volume === undefined ? undefined : corpo.volume * C.faixaMassa.densidadeIncorporeoKgM3;
    return corpo.massa;
}
/** A faixa de massa das manobras, de 1 a 7 (D-141; D-180, ponto 10). */
export function faixaDaMassa(kg: number): number {
    const i = (C.faixaMassa.cortesKg as number[]).findIndex((c) => kg <= c);
    return i < 0 ? C.faixaMassa.cortesKg.length + 1 : i + 1;
}
/**
 * A Vida pela massa (decisoes-autor §9; D-180, ponto 9). Na zona de transição do topo de uma linha, a escolha da ficha
 * (`acima`, o corpo robusto, ou `abaixo`, o frágil) decide a linha; fora da zona a escolha não vale (decisoes-autor §13).
 */
export function pvDaMassa(kg: number, vigor: number, linhaPV?: 'acima' | 'abaixo'): number {
    let i = LINHAS_PV.findIndex((l) => l.ateKg === null || kg <= l.ateKg);
    const z = LINHAS_PV.findIndex((l) => l.zonaKg && kg >= l.zonaKg[0] && kg <= l.zonaKg[1]);
    if (z >= 0 && linhaPV)
        i = linhaPV === 'acima' ? z + 1 : z;
    const l = LINHAS_PV[i];
    return l.base + Math.floor((vigor * l.vigorMult) / l.vigorDivisor);
}
/** O peso erguido pela R15 (D-184), em kg, com duas casas. */
export function pesoErguido(kg: number, forca: number, halterofilismo = 0, musculatura = 0): number {
    const P = C.pesoErguido, L = Math.log10(kg / P.curvaMassaKg);
    const curva = P.curvaA * 10 ** (P.curvaB * L - P.curvaC * L * L);
    const fRef = Math.max(0, kg < P.forcaRefAbaixoKg ? P.forcaRef + P.forcaRefInclinacao * Math.log10(kg / P.forcaRefAbaixoKg)
        : kg <= P.forcaRefAcimaKg ? P.forcaRef : P.forcaRef + P.forcaRefInclinacao * Math.log10(kg / P.forcaRefAcimaKg));
    const E = (P.eForca * forca + P.eHalterofilismo * halterofilismo + P.eMusculatura * musculatura) / P.eDivisor;
    const Eref = (P.eRefForca * fRef + P.eRefSoma) / P.eDivisor;
    return Math.round(Math.max(curva, P.piso * kg) * P.base ** (E - Eref) * 100) / 100;
}
// ----- Ataque -----
/** A média do dano: cada d6 vale `danoMedio.porDado`, mais o bônus do dado, a Força × multiplicador e a Centelha (D-209). */
export function danoMedio(dado: string | null, forca: number, multiplicadorForca: number, centelha: number): number | null {
    if (dado === null)
        return 0; // o golpe sem dano (agarra, enferruja, petrifica)
    const m = String(dado).match(/^(\d+)d6([+-]\d+)?$/);
    if (!m)
        return null;
    return Number(m[1]) * C.danoMedio.porDado + Number(m[2] || 0) + forca * multiplicadorForca + centelha;
}
/**
 * O ataque com a arma do livro (D-220): o dado, o bônus, o Acerto e a Velocidade vêm do catálogo, como na ficha do
 * jogador. A Força entra × 1 com uma mão, × 2 com duas (`derivados.danoForca`), a versátil × 2 só quando empunhada
 * com as duas (a criatura de hoje a usa com uma, como as fichas escrevem), e a de tiro pelo `forcaMult` dela, com o
 * teto da arma (`forcaCap`), o do arco (D-075) e o requisito (`M-32`).
 */
export function ataqueDaArma(id: string, forca: number, duasMaos = false) {
    const item = (ARMAS as any[]).find((a) => a.id === id);
    if (!item?.arma)
        return null;
    const w = comRequisitoDeForca(item.arma, forca);
    const fm = (regras as any).derivados.danoForca;
    const tags: string[] = item.tags || [];
    const mult = tags.includes('distância') ? (w.forcaMult ?? 1)
        : w.maos === 2 ? (w.forcaMult ?? fm.duasMaos)
            : tags.includes('versátil') && duasMaos ? fm.duasMaos : (w.forcaMult ?? fm.umaMao);
    const capF = forcaNoArco({ classe: w.classe, forcaMult: mult }, w.forcaCap != null ? Math.min(forca, w.forcaCap) : forca);
    const bonus = w.danoBonus || 0;
    return {
        dado: `${w.dado}d6${bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : ''}`, forca: capF, multiplicadorForca: mult,
        acerto: w.acerto ?? 0, velocidade: w.pgr ? w.pgr[0] + w.pgr[1] + w.pgr[2] : w.ticks,
    };
}
/** O Atributo da jogada pela Habilidade: Disparo, Vigor; Atirador, Percepção; Arremesso, Destreza; o corpo a corpo, o maior entre Força e Destreza (D-208). */
export function atributoDaJogada(habilidade: string, at: Num): number {
    if (habilidade === 'disparo')
        return at.vigor ?? 0;
    if (habilidade === 'atirador')
        return at.percepcao ?? 0;
    if (habilidade === 'arremesso')
        return at.destreza ?? 0;
    return Math.max(at.forca ?? 0, at.destreza ?? 0);
}
const habDe = (e: EntradaCriatura, id: string) => e.habilidades[id] ?? e.habilidadesSec[id] ?? 0;
// ----- A criatura -----
export function criatura(e: EntradaCriatura) {
    const at = e.atributos, ce = e.centelha ?? 0, ct = e.corpo;
    const kg = massaDaConta(ct);
    const semMente = (at.inteligencia ?? 0) === 0;
    const esquiva = defesa({ destreza: at.destreza ?? 0, habilidade: habDe(e, 'esquiva'), centelha: ce });
    const bloqueio = defesa({ destreza: at.destreza ?? 0, habilidade: habDe(e, 'bloqueio'), centelha: ce });
    // Inteligência 1 usa Sobrevivência em toda criatura (C-006; resposta P4 de 26/10/2026).
    const social = e.categoria === 'animal' || at.inteligencia === 1
        ? defSocial({ compostura: at.compostura ?? 0, sociabilidade: habDe(e, 'sobrevivencia'), centelha: ce })
        : defSocial({ compostura: at.compostura ?? 0, sociabilidade: habDe(e, 'sociabilidade'), centelha: ce });
    const absorcao = { impacto: (at.vigor ?? 0) + ce, corte: ce, perfuracao: ce };
    const comArtes = Object.values(e.artes || {}).some((n) => n > 0);
    const enxame = e.enxame ? enxamePorQuadrado(e) : null;
    const r: any = {
        ...(enxame ? {enxame} : {}),
        pv: enxame ? enxame.pvCheio : kg === undefined ? null : pvDaMassa(kg, at.vigor ?? 0, ct.linhaPV) + (e.bonusPV ?? 0),
        pesoErguido: ct.naoErgue || kg === undefined ? null
            : pesoErguido(kg, at.forca ?? 0, e.habilidadesSec.halterofilismo ?? 0, e.habilidadesSec.musculatura ?? 0),
        faixa: kg === undefined ? null : faixaDaMassa(kg),
        tamanho: ct.tamanhoEscolhido ?? (ct.area === undefined ? null : tamanhoDaArea(ct.area)),
        segundoTamanho: ct.segundoTamanho ? ct.segundoTamanho.tamanhoEscolhido ?? tamanhoDaArea(ct.segundoTamanho.area) : null,
        esquiva, bloqueio,
        defesaMental: semMente ? 'imune' : defMental({ raciocinio: at.raciocinio ?? 0, integridade: habDe(e, 'integridade'), vontade: e.vontade ?? 0, centelha: ce }),
        defesaSocial: semMente ? 'imune' : social,
        iniciativa: iniciativaDe({ ...at, ...e.habilidades, ...e.habilidadesSec }).bonus,
        energia: energiaDe({
            vigor: at.vigor ?? 0, compostura: at.compostura ?? 0, raciocinio: at.raciocinio ?? 0, vontade: e.vontade ?? 0, centelha: ce
        }),
        mana: comArtes ? manaDe({ centelha: ce, vontade: e.vontade ?? 0 }) : null,
        absorcao,
        ataques: e.ataques.map((a) => {
            const h = a.habilidade;
            const hv = h ? habDe(e, h) : 0;
            const w = a.arma ? ataqueDaArma(a.arma, at.forca ?? 0) : null;
            const acerto = w ? w.acerto : (a.acerto ?? 0);
            return {
                nome: a.nome, acerto,
                velocidade: w ? w.velocidade : a.pgr ? a.pgr[0] + a.pgr[1] + a.pgr[2] : null,
                danoMedio: w ? danoMedio(w.dado, w.forca, w.multiplicadorForca, ce) : danoMedio(a.dado ?? null, at.forca ?? 0, a.multiplicadorForca ?? 0, ce),
                jogada: h ? atributoDaJogada(h, at) + hv + centelhaNaJogada(ce, hv) + acerto : null,
            };
        }),
    };
    // o equipamento que a criatura sempre usa (D-188, D-206): a armadura soma a Absorção e tira a Penalidade da Esquiva e
    // do Bloqueio; o escudo soma a Defesa dele ao Bloqueio e tira a Penalidade dele só da Esquiva (armas-e-armaduras.md)
    const idArm = e.equipamento?.armaduras?.find((p) => p.vestida !== false)?.base;
    const idEsc = e.equipamento?.arsenal?.find((p) => p.ref.startsWith('e:'))?.ref.slice(2);
    if (idArm || idEsc) {
        const arm = idArm ? ARMADURA[idArm] : null, esc = idEsc ? ESCUDO[idEsc] : null;
        const pen = arm?.penalidade ?? 0, penE = esc?.penalidade ?? 0, bl = esc?.bloqCaC ?? 0;
        const ce2: any = {
            esquiva: esquiva - pen - penE, bloqueio: bloqueio - pen + bl,
            impacto: absorcao.impacto + (arm?.soak?.impacto ?? 0), corte: absorcao.corte + (arm?.soak?.corte ?? 0),
            perfuracao: absorcao.perfuracao + (arm?.soak?.perfuracao ?? 0), penalidade: pen,
        };
        if (arm?.resistPerf)
            ce2.nivelPerfuracao = arm.resistPerf;
        if (esc?.vsProjetilRapido?.bloqueia)
            ce2.contraTiro = Math.max(ce2.esquiva, ce2.bloqueio + (esc.vsProjetilRapido.bonus ?? 0));
        r.comEquipamento = ce2;
    }
    return r;
}
/**
 * A entrada de uma forma, montada por cima da principal (D-217, D-230): o objeto troca chave por chave (o que a forma
 * não diz vem da principal), a lista troca inteira e o valor troca.
 */
export function comForma(principal: EntradaCriatura, muda: Partial<EntradaCriatura>): EntradaCriatura {
    const out: any = structuredClone(principal);
    for (const [k, v] of Object.entries(muda || {})) {
        if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object' && !Array.isArray(out[k]))
            out[k] = { ...out[k], ...v };
        else
            out[k] = structuredClone(v);
    }
    // a área e a massa da forma valem por si: a escolha do Tamanho e da linha de PV era da principal
    if (muda?.corpo) {
        if ('area' in muda.corpo && !('tamanhoEscolhido' in muda.corpo))
            delete out.corpo.tamanhoEscolhido;
        if ('massa' in muda.corpo && !('linhaPV' in muda.corpo))
            delete out.corpo.linhaPV;
    }
    return out;
}
// ----- O jogador -----
/**
 * O PV e o peso erguido do personagem (D-229, D-234): o PV pelo Tamanho da raça, e não pela massa (a linha do Pequeno
 * para o gnomo e o halfling, a do Médio para as outras), com a Vitalidade por cima; o peso erguido pela R15, com a
 * `corpo.massa` escolhida pelo jogador.
 */
export function personagem(f: {
    raca: string;
    atributos: Num;
    habilidadesSec?: Num;
    corpo: {
        massa: number;
    };
}) {
    const raca = RACA[f.raca];
    const t = pvPorte((raca?.porte ?? 'medio') as Porte);
    const vigor = f.atributos.vigor ?? 0;
    const vitalidade = (raca?.bonusCondicional || []).some((b: any) => b.campo === 'pv' && b.bonus === 'vigor') ? vigor : 0;
    return {
        pv: t.base + vigor * t.vigorMult + vitalidade,
        pesoErguido: pesoErguido(f.corpo.massa, f.atributos.forca ?? 0, f.habilidadesSec?.halterofilismo ?? 0, 0),
    };
}
// A5: apresentação compatível dos derivados para os geradores atuais.
const rotulo = (s: string) => ({
    minusculo: 'Minúsculo', miudo: 'Miúdo', pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande', enorme: 'Enorme', imenso: 'Imenso', colossal: 'Colossal'
} as Record<string, string>)[s] ?? s;
export const unificada = (c: any) => !!c.corpo && !!c.atributos;
export function vistaPublicaCriatura(c: any, incluirFormas = true) {
    if (!unificada(c))
        return c;
    const original = c;
    const formaId = c.formaPrincipal?.id;
    const vale = (item: any) => item.formas === 'todas' || item.formas?.includes(formaId);
    c = { ...c, habilidadesEspeciais: c.habilidadesEspeciais.filter(vale) };
    const M = { criatura, ataqueDaArma, atributoDaJogada };
    const armas: any[] = ARMAS;
    const r = M.criatura(c);
    const armaDe = (a: any) => armas.find((w: any) => w.id === a.arma)?.arma;
    const bloqueioArma = Math.max(0, ...c.ataques.map((a: any) => a.arma ? armaDe(a)?.defesaArma ?? 0 : a.bloqueiaComoArma ?? 0));
    const defesa = Math.max(r.esquiva, r.bloqueio + bloqueioArma);
    const vest = r.comEquipamento;
    const vestida = vest ? {
        esquiva: vest.esquiva, bloqueio: vest.bloqueio, defesa: Math.max(vest.esquiva, vest.bloqueio + bloqueioArma), contraTiro: vest.contraTiro ?? vest.esquiva, absorcao: { impacto: vest.impacto, corte: vest.corte, perfuracao: vest.perfuracao }, nivel: vest.nivelPerfuracao ?? 0, penalidade: vest.penalidade
    } : undefined;
    const ataques = c.ataques.map((a: any, i: number) => {
        const w: any = armaDe(a), h = a.habilidade, hv = c.habilidades[h] ?? c.habilidadesSec[h] ?? 0;
        const atrib = h === 'disparo' ? 'vigor' : h === 'atirador' ? 'percepcao' : h === 'arremesso' ? 'destreza' : (c.atributos.forca >= c.atributos.destreza ? 'forca' : 'destreza');
        const soma = M.atributoDaJogada(h, c.atributos) + hv;
        const acerto = r.ataques[i].acerto + 2 * Math.min(c.centelha, hv);
        const wd = a.arma ? M.ataqueDaArma(a.arma, c.atributos.forca) : null;
        const dado = wd?.dado ?? a.dado;
        const extra = dado === null ? 0 : r.ataques[i].danoMedio - (danoMedio(dado.replace(/[+-]\d+$/, ''), 0, 0, 0) ?? 0);
        const modo = w?.modos?.find((m: any) => m.tipo === w.fichaModo) ?? w?.modos?.find((m: any) => m.principal);
        const tipo = modo?.tipo ?? w?.tipoDano ?? a.tipoDano;
        const tipoExpr = (MODO_SIGLA as any)[tipo === 'perfuracao' ? 'perfurante' : tipo] ?? '(' + tipo + ')';
        const perf = tipo === 'perfuracao' || tipo === 'perfurante' ? (modo?.perf ?? w?.pen ?? a.nivelPerfuracao ?? 0) : null;
        return {
            nome: a.nome, atrib, pericia: h, dado: Number(dado?.match(/^\d+/)?.[0] ?? 0), tipo, classe: w?.classe ?? a.classe, ticks: r.ataques[i].velocidade, acerto: r.ataques[i].acerto,
            pool: Math.floor(soma / 2) + 'd6' + (soma % 2 ? '+2' : '') + (acerto ? (acerto > 0 ? ' +' : ' −') + Math.abs(acerto) : ''),
            dano: dado === null ? 'nenhum' : dado.replace(/[+-]\d+$/, '') + (extra > 0 ? ' +' + extra : extra < 0 ? ' −' + (-extra) : '') + ' ' + tipoExpr + (perf !== null ? ' · perf. ' + perf : ''), perfArma: perf
        };
    });
    const d = c.deslocamento, principal = d.terra ?? (Object.values(d) as any[])[0];
    if (!principal)
        throw Error(c.id + ': não há deslocamento para o gerado');
    const v3 = {
        pv: r.pv, esquiva: r.esquiva, bloqueio: r.bloqueio, defesa, defesaMental: r.defesaMental === 'imune' ? null : r.defesaMental, defesaSocial: r.defesaSocial === 'imune' ? null : r.defesaSocial, absorcao: r.absorcao, couracaNivel: c.couraca, pesoErguido: r.pesoErguido, ...(bloqueioArma ? { bloqueioArma } : {}), ...(vestida ? { vestida } : {})
    };
    const habilidades = c.habilidadesEspeciais.map((h: any) => ({ nome: h.nome, classe: h.classe, ...(h.base ? {base:h.base} : {}), ...(h.regra ? {regra:h.regra} : {}), descricao: [h.regra === 'rajada' ? textoDaRajada() : null, h.texto, h.efeito, ...['ativacao', 'duracao', 'alcance', 'area', 'dano', 'resistencia', 'limiteDeUso'].filter(k => h[k]).map(k => k + ': ' + h[k])].filter(Boolean).join('. ') || h.regra || h.tecnica?.id || h.arte?.id || '' }));
    const f: any = {
        id: c.id, idAntigo: c.idAntigo, nome: c.nome, nomeIngles: c.nomeIngles, categoria: c.categoria, papel: c.papel, ameacaLegada: c.ameaca, centelha: c.centelha, conceito: '', descricao: c.descricao, tags: [c.categoria], imagem: c.imagens[0] ?? null, ...(c.imagens[1] ? { imagem2: c.imagens[1] } : {}), porte: rotulo(r.tamanho), dimensoes: { medida: [c.corpo.altura + ' m de altura', c.corpo.comprimento ? c.corpo.comprimento + ' m de comprimento' : null].filter(Boolean).join(', '), peso: c.corpo.semMassa ? 'sem massa' : c.corpo.massa + ' kg' }, attrs: c.atributos, skills: c.habilidades, skills2: c.habilidadesSec, virtues: { ...c.virtudes, valor: c.virtudes.bravura }, willpower: c.vontade, aparencia: c.aparencia, arte: c.artes, tech: Object.fromEntries(c.habilidadesEspeciais.filter((h: any) => h.tecnica).map((h: any) => [h.tecnica.id, true])), ataques, habilidades, lore: c.lore, ecologia: { tipo: c.categoria, terreno: c.ecologia.terreno, clima: c.ecologia.clima }, notas: '', pendente: false, variantes: [], v3, deslocamentoDeclarado: { batalha: principal.batalha, arranque: principal.arranque ?? principal.batalha, corrida: principal.corrida ?? principal.batalha }, locomocao: Object.fromEntries(Object.entries(d).map(([k, v]) => [k === 'nado' ? 'natacao' : k, (v as any).batalha])), ...Object.fromEntries(['fraquezas', 'resistencias', 'imunidades'].map(k => [k, c.elementos[k].filter((x: any) => x.formas === 'todas' || x.formas.includes(c.formaPrincipal?.id)).map((x: any) => x.tipo)]))
    };
    const stat = {
        id: c.id, nome: c.nome, tipo: c.papel, categoria: c.categoria, ameaca: c.ameaca, centelha: c.centelha, conceito: '', descricao: c.descricao, tags: f.tags, pv: r.pv, defesa, defesaMental: r.defesaMental === 'imune' ? '-' : r.defesaMental, defesaSocial: r.defesaSocial === 'imune' ? '-' : r.defesaSocial, vontade: c.vontade, soak: r.absorcao, resistPerf: 0, iniciativa: '1d6 + ' + r.iniciativa, atributos: c.atributos, ataques, tecnicas: Object.keys(f.tech), artes: Object.entries(c.artes).map(([id, nivel]) => ({ id, nivel })), notas: '', pendente: false, ...(vestida ? { vestida } : {})
    };
    const edicao = incluirFormas ? structuredClone(original) : undefined;
    if (edicao) delete edicao.revisao;
    Object.defineProperty(f, 'motor', { value: {
      edicao,
      energia: r.energia, stat, pericias: { prontidao: 0, furtividade: 0, ...c.habilidades, ...c.habilidadesSec }, mana: r.mana,
      enxame: c.enxame, corpo: c.corpo, formaPrincipal: c.formaPrincipal, segundoTamanho: r.segundoTamanho ? rotulo(r.segundoTamanho) : null,
      comoLuta: (c.comoLuta || []).filter(vale).map(({nome,texto}: any)=>({nome,texto})),
      sentidos: (c.sentidos || []).filter(vale).map(({nome,descricao,classe}: any)=>({nome,descricao,...(classe ? {classe} : {})})),
      formas: incluirFormas ? (original.formas || []).map((forma: any)=>({
        id:forma.id, nome:forma.nome,
        ficha:vistaPublicaCriatura({...comForma(original,forma), id:original.id, nome:original.nome, formaPrincipal:{id:forma.id,nome:forma.nome}},false),
      })) : [],
    } });
    return f;
}
// A5j: conjunto das mãos, comum à ficha e à mesa, sem DOM.
export function conjuntoPersonagem(S: any, cj: any, entrada?: any) {
    const atributos = entrada?.atributos ?? S.attrs ?? {};
    const A = (k: string) => atributos[k] || 0;
    const ataqueAtrib = (w: any) => atributoDaJogada(w.pericia, atributos);
    const it2H = (it: any) => (it.kind === 'arma' || it.kind === 'custom') && it.w.maos === 2;
    const itVers = (it: any) => (it.kind === 'arma' || it.kind === 'custom') && (it.w.tags || []).includes('versátil');
    const C = S.centelha || 0, forca = A('forca');
    const armorPen = entrada?.armorPen ?? empilharArmaduras(armadurasDe(S)).penalidade ?? 0;
    const habil = entrada?.habil ?? itemDoJogador(cj.habil);
    const inabil = it2H(habil) ? { kind: 'nada', nome: '·', def: 0, pen: 0 } : (entrada?.inabil ?? itemDoJogador(cj.inabil));
    // O requisito de Força REBAIXA a arma antes de qualquer conta (`M-32`): a
    // arma não fica proibida, fica rendendo o patamar comum. Aplicado aqui, no
    // topo, e não dentro de cada fórmula: assim o `db`, o `capF` e o `mult` que
    // vêm abaixo já saem certos, e as três versões de `ap` deste bloco também.
    const atkBruto = (habil.kind === 'arma' || habil.kind === 'custom') ? habil.w : ARMA['desarmado'];
    const atk = comRequisitoDeForca(atkBruto, forca);
    const habilAtk = S.skills[atk.pericia] || S.skills2[atk.pericia] || 0;
    const soma = ataqueAtrib(atk) + habilAtk;
    const dados = Math.floor(soma / 2), bonus = soma % 2 === 1 ? 2 : 0;
    const flat = (atk.acerto || 0) + ataqueCentelha(C, habilAtk) - armorPen;
    const dist = (atk.tags || []).includes('distância');
    const fm = regras.derivados.danoForca as any;
    const db = atk.danoBonus || 0;
    const capF = forcaNoArco(atk, atk.forcaCap != null ? Math.min(forca, atk.forcaCap) : forca);
    const inabilArmaOcupada = (inabil.kind === 'arma' || inabil.kind === 'custom');
    const versoes: {
        rot: string;
        ap: number;
    }[] = [];
    // +1 POR PONTO DE CENTELHA DO ATACANTE, SEM LIMITE, no dano (Reforma da
    // Centelha, 28/09/2026, item 3 da Fase 1): soma em toda versão do `ap`.
    if (!dist && itVers(habil)) {
        // Versátil: com a outra mão ocupada (arma OU escudo) vai a uma mão; com a outra mão
        // livre, é empunhada com as duas e a Força entra dobrada. Antes a ficha mostrava as
        // duas versões e deixava a escolha no ar; agora o marcador de uso já decidiu.
        const inabilOcupada = inabil.kind !== 'nada';
        versoes.push(inabilOcupada
            ? { rot: '', ap: db + forca * (atk.forcaMult ?? fm.umaMao) + C }
            : { rot: '2 mãos', ap: db + forca * fm.duasMaos + C });
    }
    else {
        const mult = dist ? (atk.forcaMult ?? 1) : (atk.maos === 2 ? (atk.forcaMult ?? fm.duasMaos) : (atk.forcaMult ?? fm.umaMao));
        versoes.push({ rot: '', ap: db + capF * mult + C });
    }
    // O aviso sai da arma BRUTA: a rebaixada já não tem requisito a cobrar.
    const reqForca = forcaFaltando(atkBruto, forca);
    // Empunhadura dupla: se a mão inábil também é arma, ela rende um 2º ataque, as duas mãos a −1d6 (D-091: sem penalidade extra na inábil).
    // A mão INÁBIL passa pelo mesmo freio: o Arco Composto cabe neste slot, e
    // sem isto ele sairia freado na mão hábil e inteiro na outra, que é meia
    // regra e pior do que nenhuma.
    const inabilArma = (inabil.kind === 'arma' || inabil.kind === 'custom') ? comRequisitoDeForca(inabil.w, forca) : null;
    let dupla: any = null;
    if (inabilArma) {
        const habilI = S.skills[inabilArma.pericia] || S.skills2[inabilArma.pericia] || 0;
        const somaI = ataqueAtrib(inabilArma) + habilI;
        const distI = (inabilArma.tags || []).includes('distância');
        const capFI = forcaNoArco(inabilArma, inabilArma.forcaCap != null ? Math.min(forca, inabilArma.forcaCap) : forca);
        const multI = distI ? (inabilArma.forcaMult ?? 1) : (inabilArma.forcaMult ?? fm.umaMao);
        dupla = {
            habilAp: versoes[0].ap,
            inabilDados: Math.floor(somaI / 2), inabilBonus: somaI % 2 === 1 ? 2 : 0,
            inabilFlat: (inabilArma.acerto || 0) + ataqueCentelha(C, habilI) - armorPen,
            inabilDado: inabilArma.dado, inabilAp: (inabilArma.danoBonus || 0) + capFI * multI + C,
            inabilPen: 1,
        };
    }
    // O BLOQUEIO PELA MELHOR COMBINAÇÃO (D-065): as armas e os escudos das mãos somam; o corpo só
    // defende quando nada nas mãos é usado, e não soma com eles; só os dois punhos somam entre si
    // (+1 cada). Os Punhos, na mão hábil ou na inábil, contam como mão livre (CORRIGE 140). As
    // pernas (−1) ficam para o Mestre, quando as mãos não podem ser usadas (D-067: o chute é regra
    // de texto, e não arma da ficha): a ficha mostra a melhor combinação disponível.
    const ehCorpo = (s: any) => s?.ref === 'a:desarmado';
    const inabilCorpo = !it2H(habil) && ehCorpo(cj.inabil);
    const maosLivres = (ehCorpo(cj.habil) ? 1 : 0) + ((inabil.kind === 'nada' || inabilCorpo) && !it2H(habil) ? 1 : 0);
    const nasMaos = [ehCorpo(cj.habil) ? null : habil, inabilCorpo ? null : inabil].filter((it: any) => it && it.kind !== 'nada');
    const defMaos = nasMaos.reduce((s: number, it: any) => s + (it.def || 0), 0);
    const defCorpo = maosLivres * (ARMA['desarmado']?.defesaArma ?? 1);
    const defSum = nasMaos.length ? Math.max(defMaos, defCorpo) : defCorpo;
    return {
        habil, inabil, atk, dados, bonus, flat, dist, versoes, reqForca, dupla, defSum, penSum: (habil.pen || 0) + (inabil.pen || 0), armorPen
    };
}
export function itemDoJogador(slot: any) {
    const ESCUDO = ESCUDO_EQUIP;
    const REF_ESCUDO_LIVRE = 'ce';
    const ESCUDO_LIVRE = { nome: 'Escudo personalizado', bloqCaC: 0, penalidade: 0, vsProjetilRapido: { bloqueia: false, bonus: 0 } };
    const IMPROV = {
        nome: 'Arma personalizada', dado: 1, danoBonus: 0, acerto: -2, defesaArma: 0, maos: 1, ticks: 5, folego: 0, atrib: 'forca', pericia: 'briga', tags: [] as string[], tipoDano: 'impacto', forcaMult: 1
    };
    const clampImprov = (v: any, lo: number, hi: number, dflt: number) => { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, Math.round(n))) : dflt; };
    const ref = (slot && slot.ref) || 'nada';
    if (ref === REF_ESCUDO_LIVRE) {
        const base = { ...ESCUDO_LIVRE, nome: (slot && slot.nome) || ESCUDO_LIVRE.nome };
        const s = escudoComMod(base, slot?.mod);
        return {
            kind: 'escudo', nome: s.nome, def: s.bloqCaC || 0, pen: s.penalidade || 0, vsProjetilRapido: s.vsProjetilRapido || { bloqueia: false, bonus: 0 }, base, s
        };
    }
    if (ref === 'c') {
        // O item personalizado passou a usar o mesmo "ajustar" das peças de catálogo,
        // em vez de três campos próprios. A base continua sendo o que a peça guardou
        // (fichas antigas não perdem nada); o `mod` entra por cima, como em qualquer
        // outra peça, e com ele vêm Velocidade e Defesa, que antes não dava para mexer.
        const base = {
            ...IMPROV, nome: (slot && slot.nome) || IMPROV.nome,
            dado: clampImprov(slot?.dado, 1, 2, IMPROV.dado),
            danoBonus: clampImprov(slot?.danoBonus, -2, 2, IMPROV.danoBonus),
            acerto: clampImprov(slot?.acerto, -6, 6, IMPROV.acerto)
        };
        const w = armaComMod(base, slot?.mod);
        return {
            kind: 'custom', nome: w.nome, def: w.defesaArma || 0, pen: 0, w, base
        };
    }
    if (ref.startsWith('e:')) {
        const base = ESCUDO[ref.slice(2)];
        if (base) {
            const s = escudoComMod(base, slot?.mod);
            return {
                kind: 'escudo', nome: base.nome, def: s.bloqCaC || 0, pen: s.penalidade || 0, vsProjetilRapido: s.vsProjetilRapido || { bloqueia: false, bonus: 0 }, base, s
            };
        }
    }
    if (ref.startsWith('a:')) {
        const base = ARMA[ref.slice(2)];
        if (base) {
            const w = armaComMod(base, slot?.mod);
            return {
                kind: 'arma', nome: base.nome, def: w.defesaArma || 0, pen: 0, w, base
            };
        }
    }
    return { kind: 'nada', nome: '', def: 0, pen: 0 };
}
export function conjuntoAtivoPersonagem(S: any) {
    return S.conjuntos?.find((c: any) => c.ativo) ?? S.conjuntos?.[0] ?? { habil: { ref: 'a:' + (S.equip?.arma ?? 'desarmado') }, inabil: { ref: S.equip?.escudo && S.equip.escudo !== 'nenhum' ? 'e:' + S.equip.escudo : 'nada' } };
}
export function massaDoJogador(S: any): number {
    if (typeof S.corpo?.massa === 'number' && Number.isFinite(S.corpo.massa) && S.corpo.massa > 0)
        return S.corpo.massa;
    const lida = Number(String(S.id?.peso ?? '').replace(',', '.').match(/\d+(?:\.\d+)?/)?.[0]);
    const faixa = RACA[S.raca]?.massaKg ?? [60, 80];
    return lida > 0 ? lida : (faixa[0] + faixa[1]) / 2;
}
export function numerosPersonagem(S: any, entrada?: any) {
    const at = entrada?.atributos ?? S.attrs ?? S.atributos ?? {};
    const hab = S.skills ?? S.habilidades ?? {}, sec = S.skills2 ?? S.habilidadesSec ?? {};
    const ce = S.centelha || 0, vontade = S.willpower ?? S.vontade ?? 0;
    const arm = entrada?.armSt ?? empilharArmaduras(armadurasDe(S));
    const act = entrada?.act ?? conjuntoPersonagem({ ...S, attrs: at, skills: hab, skills2: sec }, conjuntoAtivoPersonagem(S));
    const base = personagem({ raca: S.raca, atributos: at, habilidadesSec: sec, corpo: { massa: massaDoJogador(S) } });
    return {
        ...base,
        esquiva: defesa({ destreza: at.destreza || 0, habilidade: hab.esquiva || 0, centelha: ce }) - arm.penalidade - act.penSum,
        bloqueio: defesa({ destreza: at.destreza || 0, habilidade: hab.bloqueio || 0, centelha: ce }) - arm.penalidade + act.defSum,
        defesaSocial: defSocial({ compostura: at.compostura || 0, sociabilidade: hab.sociabilidade || 0, centelha: ce }),
        defesaMental: defMental({ raciocinio: at.raciocinio || 0, integridade: hab.integridade || 0, vontade, centelha: ce }),
        energia: energiaDe({
            vigor: at.vigor || 0, compostura: at.compostura || 0, raciocinio: at.raciocinio || 0, vontade, centelha: ce
        }),
        mana: manaDe({ centelha: ce, vontade, manipulacao: S.arte?.['manipulacao-mana'] || 0 }),
        iniciativa: iniciativaDe({ ...at, ...hab }),
        absorcao: { impacto: (at.vigor || 0) + ce + (arm.soak.impacto || 0), corte: ce + (arm.soak.corte || 0), perfuracao: ce + (arm.soak.perfuracao || 0) },
        act, arm,
    };
}
export interface Soak {
    impacto: number;
    corte: number;
    perfuracao: number;
}
/** As três velocidades de uma peça, em metros por Tick. */
export interface Passo {
    batalha: number;
    arranque: number;
    corrida: number;
}
export interface ResumoCombate {
    arma: string;
    ataque: string; // pool de acerto, ex.: "4d6+2 +1"
    dano: string; // dano base + sigla do modo principal, ex.: "3d6 +2 (C)"
    defesa: number; // Defesa física (Esquiva)
    defesaMental: number; // Defesa Mental (o bloco da criatura já trazia a dela)
    soak: Soak; // Absorção por tipo (abate o dano bruto sofrido)
    resistPerf: number; // Resistência a Perfuração (Nível) da armadura
    perfArma: number | null; // Nível de Perfuração do modo PRINCIPAL desta arma (null: modo não é Perfurante)
    qa: QACombate; // Quase-Acerto: o que a arma amplia e o que o couro abate
    /**
     * O PASSO REAL, que o tabuleiro precisa e não tinha.
     *
     * O Grid oferecia 3 m/Tick para todo mundo, porque o número morava só na
     * ficha e ninguém o trazia até aqui: Kael anda 4 e o anão 2, e os dois
     * recebiam 3. Sai da mesma `deslocamento()` que a ficha desenha, com a
     * fração da raça (baixa estatura) e a meia penalidade da armadura já
     * descontadas, para os dois lugares mostrarem o mesmo número.
     */
    passo: Passo;
    /**
     * OS NOVE ATRIBUTOS CRUS E AS PERÍCIAS, e esta é a passada do L35, decidida em
     * 04/09/2026: **o resumo da PEÇA, e não o resumo do golpe.**
     *
     * O modelo tinha sido montado para o golpe, então carregava só derivados de
     * combate. Em uma semana três regras diferentes esbarraram no mesmo buraco (o
     * bestiário sem perícia, o resumo sem os sentidos, o resumo sem atributo), e
     * cada vez alguém parava e escalava. Carregar nove números que às vezes não
     * são usados custa menos que parar a cada regra nova.
     *
     * A CONTA NÃO SE FAZ AQUI: isto é o que a peça tem, e a fórmula é do motor
     * (`valorPassivo`). Um resumo que já trouxesse a Passiva pronta voltaria a ser
     * um bloco por assunto, e foi disso que esta passada saiu.
     */
    atributos: Record<string, number>;
    pericias: Record<string, number>;
}
export function combatePersonagem(S: any): ResumoCombate {
    const n = numerosPersonagem(S), a = n.act, w = a.atk;
    const sig = (n: number) => (n >= 0 ? '+' : '−') + Math.abs(n);
    const ataque = a.dados + 'd6' + (a.bonus ? '+2' : '') + (a.flat ? ' ' + sig(a.flat) : '');
    const modos = (w.modos ?? [{ tipo: w.tipoDano, principal: true }]).slice().sort((a: any, b: any) => (MODO_ORDEM as any)[a.tipo] - (MODO_ORDEM as any)[b.tipo]);
    const principal = modos.find((m: any) => m.tipo === w.fichaModo) ?? modos.find((m: any) => m.principal) ?? modos[0];
    const tipo = (MODO_SIGLA as any)[principal?.tipo] || '';
    const ap = a.versoes[0].ap;
    const dano = w.dado + 'd6' + (ap ? ' ' + sig(ap) : '') + (tipo ? ' ' + tipo : '');
    const at = S.attrs || {}, hab = S.skills || {}, sec = S.skills2 || {};
    const dz = deslocamento({ forca: at.forca || 0, destreza: at.destreza || 0, atletismo: hab.atletismo || sec.atletismo || 0, centelha: S.centelha || 0 }, RACA[S.raca]?.deslocamentoFrac ?? 1);
    const pen = Math.floor((a.armorPen + a.penSum) / 2), passo = { batalha: Math.max(0, dz.normal - pen), arranque: Math.max(0, dz.arranque - pen), corrida: Math.max(0, dz.corrida - pen) };
    return {
        arma: w.nome, ataque, dano, defesa: n.esquiva, defesaMental: n.defesaMental, soak: n.absorcao, resistPerf: n.arm.resistPerf || 0, perfArma: principal?.tipo === 'perfurante' ? (principal.perf ?? 0) : null, qa: qaDaPeca(w.id || w.nome, dano, armadurasDe(S)), passo, atributos: at, pericias: { ...sec, ...hab }
    };
}

/** A Arte de força conserva a escala aprovada de FAH; o jogador usa R15 pela massa. */
export function levantamentoDaArte(nivel: number) {
    return pesoMaximoErguido(nivel * 7 - 2, (regras as any).forca);
}



/** Teto da Rajada pela classe do ataque, sem texto copiado no JSON-fonte. */
export function tetoDaRajadaDaCriatura(a: AtaqueEntrada) {
  const classe = a.arma ? (ARMAS as any[]).find(w=>w.id===a.arma)?.arma?.classe : a.classe;
  return (regras as any).combate.pgr.reforma.rajada.teto[classe] ?? null;
}

/** Texto de jogo da Rajada, pelos parâmetros da regra comum. */
export function textoDaRajada() {
  const r = (regras as any).combate.pgr.reforma.rajada;
  return 'Só corpo a corpo. Cada golpe além do primeiro soma ' + r.golpeExtraTicksDeGolpe + ' Tick de Golpe e ' + r.golpeExtraTicksDeRecuperacao + ' de Recuperação, com ' + r.penDadosPorGolpeExtra + 'd6 acumulativo no acerto. O limite depende da classe da arma.';
}

/** P10/P13, 28/10/2026: PV por Tamanho equivalente; a quantidade decide a proporção. */
export function enxamePorQuadrado(e: EntradaCriatura, individuos?: number) {
  if (!e.enxame) throw Error('entrada sem bloco enxame');
  const cheio = e.enxame.individuosPorQuadrado, tamanho = e.enxame.tamanhoEquivalente;
  if (!Number.isInteger(cheio) || cheio < 1 || !ORDEM.includes(tamanho)) throw Error('bloco enxame inválido');
  const presentes = individuos ?? cheio;
  if (!Number.isInteger(presentes) || presentes < 0 || presentes > cheio) throw Error('indivíduos fora do quadrado cheio');
  const pvCheio = pvDoTamanho(e.atributos.vigor ?? 0, tamanho) + (e.bonusPV ?? 0);
  return {pvCheio, pv:Math.floor(pvCheio * presentes / cheio), individuos:presentes, minimo:Math.ceil(cheio/4), aindaEnxame:presentes*4>=cheio};
}
