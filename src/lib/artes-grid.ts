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
import { centroHex, distanciaHex, dentro, type Hex } from './hex';

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
  /** Cobre a arena inteira: escala de região, e não área medida. */
  arenaInteira: boolean;
  /** Escolhe um efeito já no tabuleiro, e não um chão nem um corpo. */
  dissipa: boolean;
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

/** A arena inteira, para o Efeito de escala de região. */
export function hexesDaArena(cols: number, rows: number): Hex[] {
  const out: Hex[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) out.push({ q: col - Math.floor(row / 2), r: row });
  }
  return out;
}

// ------------------------------------------------------- geometria de verdade
/**
 * Onde o centro de um hexágono cai, EM METROS, num plano comum.
 *
 * A conta de `distanciaHex` conta PASSOS, e passo não é figura: um "raio de 3"
 * contado em passos desenha um hexágono, não um círculo. Para a forma da área o
 * que vale é a posição real no chão, e é ela que sai daqui.
 *
 * `centroHex(q, r, 1)` devolve o centro com raio 1, e nessa escala dois vizinhos
 * de linha distam √3. Dividir por √3 converte para passos, e multiplicar pela
 * escala da arena converte para metros.
 */
const RAIZ3 = Math.sqrt(3);
export function centroEmMetros(h: Hex, escalaM: number): { x: number; y: number } {
  const c = centroHex(h.q, h.r, 1);
  return { x: (c.x / RAIZ3) * escalaM, y: (c.y / RAIZ3) * escalaM };
}

/** Distância em linha reta entre dois centros, em metros. */
export const distanciaEmMetros = (a: Hex, b: Hex, escalaM: number): number => {
  const p = centroEmMetros(a, escalaM), q = centroEmMetros(b, escalaM);
  return Math.hypot(p.x - q.x, p.y - q.y);
};

/**
 * As casas de uma janela quadrada em volta do centro, para varrer sem percorrer
 * a arena inteira. `alcanceM` é o raio da busca, com uma folga de uma casa.
 */
function candidatos(centro: Hex, alcanceM: number, escalaM: number, cols: number, rows: number): Hex[] {
  const passos = Math.ceil(alcanceM / Math.max(0.01, escalaM)) + 1;
  const out: Hex[] = [];
  for (let dq = -passos * 2; dq <= passos * 2; dq++) {
    for (let dr = -passos; dr <= passos; dr++) {
      const h = { q: centro.q + dq, r: centro.r + dr };
      if (dentro(h, cols, rows)) out.push(h);
    }
  }
  return out;
}

/**
 * Um CÍRCULO de verdade: toda casa cujo centro está a até `raioM` do centro.
 *
 * A borda fica serrilhada, e tem de ficar: o tabuleiro é feito de hexágonos, e
 * o que se pode prometer é que a casa entra quando o meio dela está dentro do
 * círculo. É a mesma régua que qualquer mesa usa com um barbante.
 */
export function hexesEmCirculo(
  centro: Hex, raioM: number, escalaM: number, cols: number, rows: number,
): Hex[] {
  const r = Math.max(0, raioM);
  return candidatos(centro, r, escalaM, cols, rows)
    .filter((h) => distanciaEmMetros(centro, h, escalaM) <= r + 1e-9);
}

/**
 * Uma LINHA de verdade: um retângulo de `larguraM` de largura e `comprimentoM`
 * de comprimento, saindo do centro escolhido na direção da mira.
 *
 * A conta é a distância de cada centro ao SEGMENTO, e não a uma sequência de
 * casas: assim a faixa sai reta em qualquer direção, inclusive nas diagonais em
 * que uma cadeia de vizinhos serpentearia.
 */
export function hexesEmLinha(
  centro: Hex, mira: Hex, comprimentoM: number, escalaM: number,
  cols: number, rows: number, larguraM = 1,
): Hex[] {
  const o = centroEmMetros(centro, escalaM);
  const m = centroEmMetros(mira, escalaM);
  const dx = m.x - o.x, dy = m.y - o.y;
  const norma = Math.hypot(dx, dy) || 1;
  const ux = dx / norma, uy = dy / norma;
  const meia = Math.max(larguraM, escalaM) / 2;
  return candidatos(centro, comprimentoM, escalaM, cols, rows).filter((h) => {
    const p = centroEmMetros(h, escalaM);
    // projeção sobre a direção (quanto andou) e afastamento perpendicular
    const ao = (p.x - o.x) * ux + (p.y - o.y) * uy;
    const lado = Math.abs((p.x - o.x) * -uy + (p.y - o.y) * ux);
    return ao >= -escalaM / 2 && ao <= comprimentoM + 1e-9 && lado <= meia + 1e-9;
  });
}

/**
 * Um LEQUE de verdade: setor de círculo com ângulo e raio.
 *
 * O ângulo é medido no plano em metros, e não em coordenada axial: em axial os
 * seis vizinhos não estão a 60° uns dos outros na tela, e um leque montado
 * assim sairia torto justamente na diagonal.
 */
export function hexesEmLeque(
  centro: Hex, mira: Hex, raioM: number, anguloGraus: number, escalaM: number,
  cols: number, rows: number,
): Hex[] {
  const o = centroEmMetros(centro, escalaM);
  const m = centroEmMetros(mira, escalaM);
  const dir = Math.atan2(m.y - o.y, m.x - o.x);
  const meia = (Math.max(1, Math.min(360, anguloGraus)) / 2) * (Math.PI / 180);
  return candidatos(centro, raioM, escalaM, cols, rows).filter((h) => {
    const p = centroEmMetros(h, escalaM);
    const d = Math.hypot(p.x - o.x, p.y - o.y);
    if (d > raioM + 1e-9) return false;
    // A casa de origem entra sempre: o leque sai de dentro dela.
    if (d < 1e-9) return true;
    let dif = Math.abs(Math.atan2(p.y - o.y, p.x - o.x) - dir);
    if (dif > Math.PI) dif = 2 * Math.PI - dif;
    return dif <= meia + 1e-9;
  });
}

// ------------------------------------------- da área comprada para a figura
/** O raio do círculo que tem esta área. */
export const raioDoCirculo = (areaM2: number) => Math.sqrt(Math.max(0, areaM2) / Math.PI);
/** O comprimento da faixa que tem esta área, na largura dada. */
export const comprimentoDaLinha = (areaM2: number, larguraM = 1) =>
  Math.max(0, areaM2) / Math.max(0.1, larguraM);
/** O raio do setor que tem esta área, na abertura dada. */
export const raioDoLeque = (areaM2: number, anguloGraus: number) => {
  const t = (Math.max(1, Math.min(360, anguloGraus)) * Math.PI) / 180;
  return Math.sqrt((2 * Math.max(0, areaM2)) / t);
};

/** A largura padrão da faixa: um metro, como a mesa decidiu. */
export const LARGURA_LINHA = 1;
/** As aberturas oferecidas ao leque. */
export const ANGULOS = [45, 60, 90, 120, 180];

/**
 * A figura que a área comprada vira, já em metros, para a tela poder dizê-la
 * antes de o efeito cair ("círculo de 2,3 m de raio", "linha de 16 m").
 */
export function figuraDaArea(molde: Molde, areaM2: number, anguloGraus = 90): {
  rotulo: string; raioM: number; comprimentoM: number;
} {
  const um = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));
  if (molde === 'linha') {
    const c = comprimentoDaLinha(areaM2, LARGURA_LINHA);
    return { rotulo: `linha de ${um(c)} m × ${LARGURA_LINHA} m`, raioM: 0, comprimentoM: c };
  }
  if (molde === 'leque') {
    const r = raioDoLeque(areaM2, anguloGraus);
    return { rotulo: `leque de ${anguloGraus}° com ${um(r)} m de raio`, raioM: r, comprimentoM: 0 };
  }
  const r = raioDoCirculo(areaM2);
  return { rotulo: `círculo de ${um(r)} m de raio`, raioM: r, comprimentoM: 0 };
}

/**
 * Onde o efeito cai.
 *
 * `centro` é onde a figura começa (o conjurador, ou o hexágono que a pessoa
 * escolheu) e `mira` é para onde ela aponta, que só importa em linha e leque.
 *
 * A ÁREA comprada é o orçamento, e o molde decide o desenho: a mesma área vira
 * um círculo largo, uma faixa comprida de um metro ou um leque de abertura
 * escolhida. Um molde não pode render mais chão que o outro, e é por isso que o
 * raio e o comprimento saem da área, e não de um número solto.
 */
export function hexesDoEfeito(opts: {
  forma: Forma; molde: Molde; centro: Hex; mira?: Hex | null;
  areaM2?: number; raioM?: number; comprimentoM?: number; anguloGraus?: number;
  arenaInteira?: boolean; escalaM: number; cols: number; rows: number;
}): Hex[] {
  const { forma, molde, centro, mira, escalaM, cols, rows } = opts;
  const ang = opts.anguloGraus ?? 90;
  const area = opts.areaM2 ?? escalaM * escalaM;
  // Escala de região: o Inverno cai sobre a região, e qualquer arena cabe nele.
  // Desenhar um quadrado medido no meio do mapa mentiria sobre o alcance.
  if (opts.arenaInteira) return hexesDaArena(cols, rows);
  // A aura já compra um RAIO, e não uma área: nada a converter.
  if (forma === 'aura') return hexesEmCirculo(centro, opts.raioM ?? 1, escalaM, cols, rows);
  // O muro compra um comprimento, e é uma faixa de um metro.
  if (forma === 'muro') {
    const c = opts.comprimentoM ?? escalaM;
    return mira ? hexesEmLinha(centro, mira, c, escalaM, cols, rows, LARGURA_LINHA) : [centro];
  }
  if (forma === 'linha') {
    return mira
      ? hexesEmLinha(centro, mira, comprimentoDaLinha(area, LARGURA_LINHA), escalaM, cols, rows, LARGURA_LINHA)
      : [centro];
  }
  if (forma === 'cone') {
    return mira ? hexesEmLeque(centro, mira, raioDoLeque(area, ang), ang, escalaM, cols, rows) : [centro];
  }
  if (forma === 'zona') {
    if (molde === 'linha' && mira) {
      return hexesEmLinha(centro, mira, comprimentoDaLinha(area, LARGURA_LINHA), escalaM, cols, rows, LARGURA_LINHA);
    }
    if (molde === 'leque' && mira) {
      return hexesEmLeque(centro, mira, raioDoLeque(area, ang), ang, escalaM, cols, rows);
    }
    return hexesEmCirculo(centro, raioDoCirculo(area), escalaM, cols, rows);
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
  /** O nível efetivo da conjuração. É por ele que o Dissipar decide o que apaga. */
  nivel: number;
  efeito_id: string | null;     // null = improviso, a Arte crua
  arte_id: string;
  conjurador_id: string | null;
  nome: string;
  forma: Forma;
  molde: Molde;
  hexes: { q: number; r: number }[];
  centro: { q: number; r: number } | null;
  raio_m: number | null;
  /** A abertura do leque, em graus. Só vale quando o molde é leque. */
  angulo: number;
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
