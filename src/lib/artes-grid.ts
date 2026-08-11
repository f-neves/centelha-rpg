// Motor das Artes no tabuleiro de hexágonos.
//
// Puro: nenhuma linha aqui toca no DOM nem no Supabase. Quem conjura, desenha e
// grava é `artes-grid-ui.ts`; aqui só moram as contas, que é o que permite
// conferi-las sem abrir o navegador.
//
// As regras vêm de `regras.json → arcano` e do bloco `grid` que
// `scripts/gen-grid-artes.mjs` injeta em cada Arte e em cada Efeito. Nada é
// inventado neste arquivo: quando uma conta precisa de um número, ele sai de lá.
import ARTES_D from '../data/artes.json';
import EFEITOS_D from '../data/efeitos.json';
import COND_D from '../data/condicoes.json';
import { regras } from './calc';
import { centroHex, distanciaHex, dentro, vizinhos, arredondarHex, type Hex } from './hex';

// ============================================================ os dados crus
export interface Arte {
  id: string; nome: string; categoria: string; atributo_conjuracao: string;
  niveis: any[];
  grid: { elemento: string | null; cor: string; dadoPorNivel: number; danoBruto: boolean };
}
export interface Efeito {
  id: string; nome: string; nivel: number; efeito: string; notas?: string;
  artes: { id: string; sabor?: string }[];
  parametros: Parametro[];
  grid: GridEfeito;
}
export interface Parametro {
  nome: string; tipo: 'padrao' | 'substitui' | 'fixo';
  valor?: string; substitui?: string; unidade?: string; escala?: string[];
  nota?: string; regua?: 'breve' | 'longa';
}
export interface GridEfeito {
  forma: Forma; ancora: Ancora; gatilho: Gatilho; alvo: string;
  persiste: boolean; materia: string | null; condicao: string | null;
  /** Marca uma peça do equipamento do alvo, e não o corpo dele. */
  pegaItem: boolean;
  fere: boolean; cura: boolean; teste: boolean;
}
export type Forma = 'nenhuma' | 'alvo' | 'aura' | 'zona' | 'muro' | 'cone' | 'linha' | 'cadeia' | 'token' | 'movimento';
export type Ancora = 'nenhuma' | 'conjurador' | 'ponto' | 'alvo' | 'objeto';
export type Gatilho = 'passivo' | 'imediato' | 'ao-entrar' | 'por-turno' | 'ao-tocar' | 'armadilha';

export const ARTES = ARTES_D as unknown as Arte[];
export const EFEITOS = EFEITOS_D as unknown as Efeito[];
export const ARTE = Object.fromEntries(ARTES.map((a) => [a.id, a])) as Record<string, Arte>;
export const EFEITO = Object.fromEntries(EFEITOS.map((e) => [e.id, e])) as Record<string, Efeito>;
export const CONDICAO = Object.fromEntries(
  ((COND_D as any).lista as any[]).map((c) => [c.id, c]),
) as Record<string, any>;

const ARC = (regras as any).arcano;
const GRAUS = ARC.improviso.graus as Record<string, string[]>;

// ============================================================ o relógio
/**
 * Um turno são 6 Ticks, que é como a aba Combate já lê a rodada
 * (`Rodada ${Math.floor(tick / 6) + 1}`). Com isso, um Tick vale um segundo e a
 * régua de Duração do livro cai inteira em turnos sem nenhuma conversão nova:
 * um minuto são 60 Ticks, que são 10 turnos.
 */
export const TICKS_POR_TURNO = 6;

/**
 * A régua "breve" traduzida para turnos de combate.
 *
 * Do nível 5 em diante o efeito cobre qualquer briga que caiba numa cena, e o
 * número exato deixa de importar: o que a mesa precisa saber é "dura a cena
 * toda". Continua sendo um número para o relógio não ter caso especial.
 */
const TURNOS_BREVE = [1, 5, 10, 50, 300, 600];
/** A régua "longa" começa onde a briga já acabou. Dez minutos são 100 turnos. */
const TURNOS_LONGA = [100, 600, 3600, 14400, 100800, 432000];

/** Quantos turnos dura o parâmetro Duração no nível `n` (1 a 6). */
export function turnosDeDuracao(n: number, regua: 'breve' | 'longa' = 'breve'): number {
  const t = regua === 'longa' ? TURNOS_LONGA : TURNOS_BREVE;
  return t[Math.max(1, Math.min(6, n)) - 1];
}

/** "10 turnos", "a cena toda". O número cru não diz nada acima de 50. */
export function rotuloDuracao(turnos: number): string {
  if (turnos >= 300) return 'a cena toda';
  return `${turnos} turno${turnos > 1 ? 's' : ''}`;
}

// ====================================================== leitura de parâmetro
/** A escala de um parâmetro: a do próprio Efeito quando ele substitui, a do livro quando não. */
export function escalaDe(p: Parametro): string[] | null {
  if (p.tipo === 'fixo') return null;
  if (p.tipo === 'substitui' && p.escala) return p.escala;
  const mapa: Record<string, string> = {
    Alcance: 'alcance', Área: 'area', Alvos: 'alvos', Dano: 'dano',
    Duração: p.regua === 'longa' ? 'duracaoLonga' : 'duracaoBreve',
  };
  const k = mapa[p.nome];
  return k && GRAUS[k] ? GRAUS[k] : null;
}

/** O que o parâmetro vale no nível `n`. `null` quando ele é fixo. */
export function valorNoNivel(p: Parametro, n: number): string {
  if (p.tipo === 'fixo') return String(p.valor ?? '');
  const esc = escalaDe(p);
  if (!esc) return String(n);
  return esc[Math.max(1, Math.min(esc.length, n)) - 1];
}

/** Os parâmetros que o jogador escolhe (os fixos não entram na conta nem na tela). */
export const parametrosAjustaveis = (e: Efeito): Parametro[] =>
  (e.parametros || []).filter((p) => p.tipo !== 'fixo');

// ------------------------------------------------ os números por trás do rótulo
const soNumero = (s: string): number => {
  const m = String(s).replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : 0;
};

/** Alcance em metros. "toque" é zero, e não um metro: encostar não é distância. */
export const alcanceEmMetros = (p: Parametro, n: number): number => {
  const v = valorNoNivel(p, n);
  return /toque/i.test(v) ? 0 : soNumero(v);
};

/**
 * A área em metros quadrados.
 *
 * A régua do livro é um quadrado ("4 × 4"), e o Volume de alguns Efeitos é um
 * raio ("3 m") ou um cubo ("4x4x4"). Os três viram m² de chão, porque é isso que
 * o tabuleiro pinta: um cubo de lado L cobre L × L de piso, e um raio R cobre um
 * círculo de πR².
 */
export function areaEmM2(p: Parametro, n: number): number {
  const v = valorNoNivel(p, n);
  if (/de raio/i.test(p.unidade || '') || /^\s*\d+([.,]\d+)?\s*m\s*$/i.test(v)) {
    const r = soNumero(v);
    return Math.PI * r * r;
  }
  const partes = String(v).split(/[x×]/).map(soNumero).filter((x) => x > 0);
  if (partes.length >= 2) return partes[0] * partes[1];
  return soNumero(v) || 1;
}

/** Quantos d6 o parâmetro Dano vale, contando a Terra que dobra o dado. */
export function dadosDeDano(p: Parametro, n: number, arte: Arte): number {
  // O Efeito que traz escala PRÓPRIA já diz o dado ("1d6 a cada 2 pontos de
  // Mana", no Metal Incandescente). A Terra não dobra em cima disso: o Efeito
  // negociou o próprio número, e dobrá-lo seria contá-lo duas vezes.
  if (p.tipo === 'substitui') {
    const m = String(valorNoNivel(p, n)).match(/(\d+)\s*d6/i);
    return m ? parseInt(m[1], 10) : 0;
  }
  // Na régua do livro o nível É o número de dados, e aí sim a Terra dobra.
  return n * (arte.grid.dadoPorNivel || 1);
}

/** Bônus liso somado ao dano da arma (Arma Elemental: "+2" por nível). */
export function bonusPlano(p: Parametro, n: number): number {
  const v = valorNoNivel(p, n);
  return /^\s*[+−-]/.test(v) ? soNumero(v.replace('−', '-')) : 0;
}

// ================================================================== o custo
export interface Escolhas { [nomeDoParametro: string]: number }

export interface Custo {
  base: number;         // o nível do Efeito, ou 0 no improviso
  parametros: number;   // a soma dos níveis investidos, já com o esticar
  esticados: { nome: string; acima: number; custo: number }[];
  total: number;        // base + parâmetros
  centelha: number;
  mana: number;         // o que sobra depois da Centelha; 0 = grátis e ilimitado
  ticks: number;
}

/**
 * O custo de uma conjuração.
 *
 * `regras.json → arcano.efeitos.custo`: nível do Efeito mais a soma dos
 * parâmetros usados, e a Centelha desconta do total. Passar do nível da Arte num
 * parâmetro é "esticar", e aí ele custa (nível) × (níveis acima + 1).
 *
 * A Cura é o único parâmetro que custa 2 por nível (`improviso.custoPorNivel`).
 */
export function custoDe(
  efeito: Efeito | null, arte: Arte, nivelArte: number, escolhas: Escolhas, centelha: number,
): Custo {
  const base = efeito ? efeito.nivel : 0;
  const esticados: Custo['esticados'] = [];
  let parametros = 0;
  const pars = efeito ? parametrosAjustaveis(efeito) : parametrosDoImproviso();
  for (const p of pars) {
    const n = Math.max(0, escolhas[p.nome] ?? 0);
    if (!n) continue;
    const porNivel = p.nome === 'Cura' ? (ARC.improviso.custoPorNivel.cura ?? 2) : 1;
    const acima = Math.max(0, n - nivelArte);
    const custo = n * porNivel * (acima + 1);
    if (acima > 0) esticados.push({ nome: p.nome, acima, custo });
    parametros += custo;
  }
  const total = base + parametros;
  const mana = Math.max(0, total - centelha);
  return { base, parametros, esticados, total, centelha, mana, ticks: ticksDe(efeito, esticados) };
}

/**
 * A Velocidade da conjuração, em Ticks.
 *
 * `arcano.efeitos.ticks`: 4 + nível do Efeito + 1 por grau esticado. O improviso
 * usa a escada de `feiticoTicks`, que anda com o nível do feitiço.
 */
function ticksDe(efeito: Efeito | null, esticados: Custo['esticados']): number {
  const extra = esticados.reduce((s, e) => s + e.acima, 0);
  if (efeito) return 4 + efeito.nivel + extra;
  return 5 + extra;
}

/** Os parâmetros do improviso: a Arte crua, sem Efeito comprado. */
export function parametrosDoImproviso(): Parametro[] {
  return [
    { nome: 'Alcance', tipo: 'padrao' },
    { nome: 'Área', tipo: 'padrao' },
    { nome: 'Alvos', tipo: 'padrao' },
    { nome: 'Dano', tipo: 'padrao' },
    { nome: 'Duração', tipo: 'padrao', regua: 'breve' },
  ];
}

// =============================================== quem sabe o quê
/**
 * Os Efeitos que este conjurador pode usar com esta Arte.
 *
 * Personagem: só o que ele COMPROU (`S.efeito[id]`), e só até o nível que tem na
 * Arte, que é a regra de `arcano.efeitos.compra`.
 *
 * Criatura: o bestiário guarda as Artes dela (`artes: [{id, nivel}]`) e nunca
 * guardou Efeitos comprados. Exigir a compra deixaria toda criatura do jogo sem
 * Arte nenhuma no tabuleiro, então ela alcança o que a Arte dela comporta. Quem
 * decide se o dragão sabe fazer aquilo continua sendo o mestre.
 */
export function efeitosDisponiveis(
  arteId: string, nivelArte: number, comprados: Record<string, boolean> | null,
): Efeito[] {
  return EFEITOS
    .filter((e) => e.artes.some((a) => a.id === arteId))
    .filter((e) => e.nivel <= nivelArte)
    .filter((e) => !comprados || comprados[e.id])
    .sort((a, b) => a.nivel - b.nivel || a.nome.localeCompare(b.nome, 'pt'));
}

/** As Artes deste conjurador, com o nível de cada uma. */
export function artesDe(fonte: { arte?: Record<string, number>; artes?: { id: string; nivel: number }[] }) {
  const out: { arte: Arte; nivel: number }[] = [];
  if (Array.isArray(fonte?.artes)) {
    for (const a of fonte.artes) if (ARTE[a.id] && a.nivel > 0) out.push({ arte: ARTE[a.id], nivel: a.nivel });
  } else if (fonte?.arte) {
    for (const [id, n] of Object.entries(fonte.arte)) if (ARTE[id] && n > 0) out.push({ arte: ARTE[id], nivel: n });
  }
  return out.sort((a, b) => b.nivel - a.nivel || a.arte.nome.localeCompare(b.arte.nome, 'pt'));
}

// ==================================================== o desenho no tabuleiro
export type Molde = 'circulo' | 'linha' | 'leque';

/**
 * Quantos hexágonos cabem numa área.
 *
 * A conversão preserva a ÁREA, e não o desenho: `arcano.improviso.graus.notaArea`
 * deixa moldar a mesma área em linha, círculo ou leque, e o que não muda entre os
 * três é quanto chão o efeito cobre. Cada hexágono vale `escala²` metros
 * quadrados, então o número de casas é a área dividida por isso.
 */
export const hexesParaArea = (m2: number, escalaM: number): number =>
  Math.max(1, Math.round(m2 / Math.max(0.01, escalaM * escalaM)));

/** Anéis concêntricos a partir do centro, em ordem de distância. */
function porAnel(centro: Hex, quantos: number, cols: number, rows: number): Hex[] {
  const out: Hex[] = [];
  const visto = new Set<string>();
  let fronteira: Hex[] = [centro];
  visto.add(`${centro.q},${centro.r}`);
  while (out.length < quantos && fronteira.length) {
    for (const h of fronteira) {
      if (out.length >= quantos) break;
      if (dentro(h, cols, rows)) out.push(h);
    }
    const proxima: Hex[] = [];
    for (const h of fronteira) {
      for (const v of vizinhos(h)) {
        const k = `${v.q},${v.r}`;
        if (visto.has(k)) continue;
        visto.add(k);
        proxima.push(v);
      }
    }
    fronteira = proxima;
  }
  return out;
}

/** Todos os hexágonos até `raio` metros do centro (a aura, e o círculo cheio). */
export function hexesNoRaio(centro: Hex, raioM: number, escalaM: number, cols: number, rows: number): Hex[] {
  const passos = Math.max(0, Math.floor(raioM / Math.max(0.01, escalaM) + 1e-9));
  const out: Hex[] = [];
  for (let dq = -passos; dq <= passos; dq++) {
    for (let dr = -passos; dr <= passos; dr++) {
      const h = { q: centro.q + dq, r: centro.r + dr };
      if (distanciaHex(centro, h) <= passos && dentro(h, cols, rows)) out.push(h);
    }
  }
  return out;
}

/** Uma reta de `centro` na direção de `mira`, com `quantos` casas. */
export function hexesEmLinha(centro: Hex, mira: Hex, quantos: number, cols: number, rows: number): Hex[] {
  const d = distanciaHex(centro, mira) || 1;
  const out: Hex[] = [];
  for (let i = 1; i <= quantos; i++) {
    const t = i / d;
    const h = arredondarHex(
      centro.q + (mira.q - centro.q) * t,
      centro.r + (mira.r - centro.r) * t,
    );
    if (!dentro(h, cols, rows)) break;
    if (!out.some((o) => o.q === h.q && o.r === h.r)) out.push(h);
  }
  return out;
}

/**
 * Um leque de 120° saindo do conjurador na direção da mira.
 *
 * O ângulo é medido em pixels do centro de cada hexágono, e não em coordenada
 * axial: em axial os seis vizinhos não estão a 60° uns dos outros na tela, e um
 * cone montado assim sairia torto justamente na diagonal.
 */
export function hexesEmLeque(
  centro: Hex, mira: Hex, quantos: number, cols: number, rows: number, abertura = 120,
): Hex[] {
  const c = centroHex(centro.q, centro.r, 10);
  const m = centroHex(mira.q, mira.r, 10);
  const dir = Math.atan2(m.y - c.y, m.x - c.x);
  const meia = (abertura / 2) * (Math.PI / 180);
  const cand: { h: Hex; d: number }[] = [];
  const alcance = quantos + 2;
  for (let dq = -alcance; dq <= alcance; dq++) {
    for (let dr = -alcance; dr <= alcance; dr++) {
      const h = { q: centro.q + dq, r: centro.r + dr };
      const dist = distanciaHex(centro, h);
      if (!dist || dist > alcance || !dentro(h, cols, rows)) continue;
      const pt = centroHex(h.q, h.r, 10);
      const ang = Math.atan2(pt.y - c.y, pt.x - c.x);
      let dif = Math.abs(ang - dir);
      if (dif > Math.PI) dif = 2 * Math.PI - dif;
      if (dif <= meia) cand.push({ h, d: dist });
    }
  }
  return cand.sort((a, b) => a.d - b.d).slice(0, quantos).map((x) => x.h);
}

/**
 * Onde o efeito cai, dado o molde escolhido.
 *
 * `centro` é a âncora (o conjurador, ou o ponto clicado) e `mira` é para onde
 * ele aponta, que só importa em linha e leque.
 */
export function hexesDoEfeito(opts: {
  forma: Forma; molde: Molde; centro: Hex; mira?: Hex | null;
  areaM2?: number; raioM?: number; comprimentoM?: number;
  escalaM: number; cols: number; rows: number;
}): Hex[] {
  const { forma, molde, centro, mira, escalaM, cols, rows } = opts;
  if (forma === 'aura') return hexesNoRaio(centro, opts.raioM ?? 1, escalaM, cols, rows);
  if (forma === 'muro') {
    const n = Math.max(1, Math.round((opts.comprimentoM ?? escalaM) / escalaM));
    return mira ? hexesEmLinha(centro, mira, n, cols, rows) : porAnel(centro, n, cols, rows);
  }
  if (forma === 'linha') {
    const n = hexesParaArea(opts.areaM2 ?? escalaM * escalaM, escalaM);
    return mira ? hexesEmLinha(centro, mira, n, cols, rows) : porAnel(centro, n, cols, rows);
  }
  if (forma === 'cone') {
    const n = hexesParaArea(opts.areaM2 ?? escalaM * escalaM, escalaM);
    return mira ? hexesEmLeque(centro, mira, n, cols, rows) : porAnel(centro, n, cols, rows);
  }
  if (forma === 'zona') {
    const n = hexesParaArea(opts.areaM2 ?? escalaM * escalaM, escalaM);
    if (molde === 'linha' && mira) return hexesEmLinha(centro, mira, n, cols, rows);
    if (molde === 'leque' && mira) return hexesEmLeque(centro, mira, n, cols, rows);
    return porAnel(centro, n, cols, rows);
  }
  return [centro];
}

// ============================================================== o dano
export interface Golpe {
  bruto: number;
  absorcao: number;
  liquido: number;
  agravado: boolean;
  nota: string;
}

/**
 * O dano de um efeito num alvo, com a fraqueza e a resistência do bestiário.
 *
 * `arcano.fraquezas` manda a ordem, e ela não é a intuitiva: a ARMADURA absorve
 * primeiro, a resistência corta o que sobrou pela metade, e só então entra a
 * Absorção natural. A flecha atravessa o couro do mesmo jeito em qualquer um; o
 * que muda é o que o corpo do vampiro faz com o que passou.
 *
 * Fraqueza é o avesso: ignora TODA a absorção e o ferimento vira agravado. As
 * duas se anulam quando a mesma criatura tem as duas.
 */
export function danoNoAlvo(opts: {
  bruto: number;
  elemento: string | null;
  materia: string | null;      // null = fenômeno puro: só a Centelha apara
  soakArmadura: number;        // a absorção de armadura, por tipo físico
  soakNatural: number;         // o que o corpo absorve sozinho (Centelha inclusa)
  fraquezas?: string[];
  resistencias?: string[];
}): Golpe {
  const { bruto, elemento, materia } = opts;
  const fr = (opts.fraquezas || []).map((x) => x.toLowerCase());
  const re = (opts.resistencias || []).map((x) => x.toLowerCase());
  const chaves = [elemento, materia].filter(Boolean) as string[];
  let fraco = chaves.some((k) => fr.includes(k));
  let resiste = chaves.some((k) => re.includes(k));
  // As duas ao mesmo tempo se anulam, por escrito nas regras.
  if (fraco && resiste) { fraco = false; resiste = false; }

  if (fraco) {
    return {
      bruto, absorcao: 0, liquido: bruto, agravado: true,
      nota: `fraqueza a ${chaves.filter((k) => fr.includes(k)).join(' e ')}: passa inteiro e agrava`,
    };
  }
  // Só o que virou matéria no mundo encontra a armadura pela frente.
  const armadura = materia ? opts.soakArmadura : 0;
  let resto = Math.max(0, bruto - armadura);
  let nota = armadura ? `armadura ${armadura}` : 'fenômeno puro: a armadura não pega';
  if (resiste) {
    resto = Math.ceil(resto / 2);
    nota += ` · resistência corta pela metade`;
  }
  const liquido = Math.max(0, resto - opts.soakNatural);
  if (opts.soakNatural) nota += ` · absorção natural ${opts.soakNatural}`;
  return { bruto, absorcao: bruto - liquido, liquido, agravado: false, nota };
}

/** Rola NdD e devolve os dados, para o registro mostrar a mão. */
export function rolar(dados: number, faces = 6): { total: number; dados: number[] } {
  const out: number[] = [];
  for (let i = 0; i < Math.max(0, dados); i++) out.push(1 + Math.floor(Math.random() * faces));
  return { total: out.reduce((s, x) => s + x, 0), dados: out };
}

// ============================================================ o efeito vivo
/** O que fica gravado na arena enquanto o efeito dura. */
export interface EfeitoAtivo {
  id: string;
  arena_id: string;
  efeito_id: string | null;     // null = improviso, a Arte crua
  arte_id: string;
  conjurador_id: string | null;
  nome: string;
  forma: Forma;
  molde: Molde;
  hexes: { q: number; r: number }[];
  centro: { q: number; r: number } | null;
  raio_m: number | null;
  dano_dados: number;
  dano_bonus: number;
  condicao: string | null;
  /** O elemento da Arte que conjurou: é ele que casa com fraqueza e resistência. */
  elemento: string | null;
  /** Tipo físico quando o efeito deixou matéria no mundo; null = fenômeno puro. */
  materia: string | null;
  alvos: string[];              // combatentes marcados (melhoria, marca, item)
  item: string | null;          // a peça em brasa, enferrujada, escondida
  gatilho: Gatilho;
  desde_tick: number;
  ate_tick: number;
  // Quem já sofreu a mordida neste turno. A aura morde no máximo uma vez por
  // turno por criatura, então a chave é o combatente e o valor é a rodada.
  mordidos: Record<string, number>;
  nota: string | null;
}

export const rodadaDoTick = (tick: number) => Math.floor(tick / TICKS_POR_TURNO) + 1;

/** Quantos turnos ainda restam. Zero quer dizer que venceu. */
export const turnosRestantes = (ef: EfeitoAtivo, tickAtual: number): number =>
  Math.max(0, Math.ceil((ef.ate_tick - tickAtual) / TICKS_POR_TURNO));

export const venceu = (ef: EfeitoAtivo, tickAtual: number): boolean => tickAtual >= ef.ate_tick;

/** Se este combatente já levou a mordida deste efeito na rodada corrente. */
export const jaMordido = (ef: EfeitoAtivo, cid: string, tickAtual: number): boolean =>
  (ef.mordidos || {})[cid] === rodadaDoTick(tickAtual);

/** Quem está dentro do efeito, dada a posição de cada token. */
export function dentroDoEfeito(
  ef: EfeitoAtivo, tokens: Record<string, { q: number; r: number }>,
): string[] {
  const casas = new Set((ef.hexes || []).map((h) => `${h.q},${h.r}`));
  return Object.entries(tokens)
    .filter(([, t]) => casas.has(`${t.q},${t.r}`))
    .map(([cid]) => cid);
}

/**
 * O rótulo do efeito na tela: "Aura de Fogo · 2d6 · 3 m · 7 turnos".
 * É o que vai no cartão, no registro e no `title` da mancha no tabuleiro.
 */
export function rotuloDoEfeito(ef: EfeitoAtivo, tickAtual: number): string {
  const partes = [ef.nome];
  if (ef.dano_dados) partes.push(`${ef.dano_dados}d6`);
  else if (ef.dano_bonus) partes.push(`+${ef.dano_bonus}`);
  if (ef.raio_m) partes.push(`${ef.raio_m} m`);
  if (ef.condicao && CONDICAO[ef.condicao]) partes.push(CONDICAO[ef.condicao].nome);
  partes.push(rotuloDuracao(turnosRestantes(ef, tickAtual)));
  return partes.join(' · ');
}
