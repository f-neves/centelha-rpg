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
 * `gen-bestiario.mjs`: minúsculas, sem acento, com "miudo" mapeado para
 * "minusculo" — reescrever esta conversão à mão em outro lugar já custou 24
 * criaturas sem Furtividade (`regras.json → furtividadeCriatura.porte.nota`),
 * porque "miudo" não batia com a chave certa. As duas conversões precisam
 * andar juntas: mudou uma, olhe a outra.
 */
const NORM_PORTE: Record<string, Porte> = {
  miudo: 'minusculo', minusculo: 'minusculo', pequeno: 'pequeno', medio: 'medio',
  grande: 'grande', enorme: 'enorme', imenso: 'imenso', colossal: 'colossal',
};
export function porteDeRotulo(rotulo: string | null | undefined): Porte {
  const k = String(rotulo || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return NORM_PORTE[k] || 'medio';
}

/**
 * O modificador de acerto por diferença de porte (`regras.json → porteAcerto`).
 *
 * Positivo quando o ALVO é MAIOR que o atacante (acertar alvo maior soma);
 * negativo quando o alvo é menor. Simétrico e com teto de `capCategorias`
 * categorias de diferença. Só a metade da compensação: a outra metade
 * (Couraça de Porte, que corta o dano de quem é menor) já está aplicada em
 * tempo de geração (`gen-bestiario.mjs`), somada na `absorcao` de cada
 * criatura — esta função completa o par, não inventa um novo.
 */
export function modificadorPorte(porteAtacante: Porte, porteAlvo: Porte): number {
  const t = regras.porteAcerto as { ordem: string[]; porDiferenca: number[]; capCategorias: number };
  const ia = t.ordem.indexOf(porteAtacante);
  const ib = t.ordem.indexOf(porteAlvo);
  if (ia < 0 || ib < 0) return 0;
  const diff = ib - ia; // positivo: o alvo está mais alto na ordem, é maior
  const cat = Math.min(Math.abs(diff), t.capCategorias);
  return Math.sign(diff) * (t.porDiferenca[cat] ?? 0);
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

/**
 * Modificador da Aparência (curva −4..+4) somado FLAT à jogada social alinhada.
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
) => (atributo == null || habilidade == null ? null : (atributo + habilidade) * 2 + centelha);
