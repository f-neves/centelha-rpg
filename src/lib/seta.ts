// A seta do tabuleiro: um rabo fino que engrossa até a ponta, curvando.
//
// POR QUE ISTO NÃO É UMA LINHA COM `marker-end`
// Era, e a linha tem dois limites que não se contornam com CSS. Ela é de
// espessura constante, então não existe "fina na base e grossa na ponta": o
// SVG não sabe variar a espessura de um traço ao longo dele. E o `marker-end`
// desenha a cabeça no ÂNGULO do último segmento, o que numa curva significa
// uma cabeça torta em relação ao corpo.
//
// A saída é desenhar a seta como uma FIGURA PREENCHIDA, e não como um traço:
// duas margens que se afastam à medida que avançam, fechadas numa cabeça
// triangular. Com isso, o tracejado também deixa de ser um `stroke-dasharray`
// e passa a ser uma sequência de figuras, uma por traço, cada uma com a
// espessura do ponto do caminho em que está. É por isso que a seta pontilhada
// daqui tem pontos que crescem, coisa que um dasharray não faz.
//
// O módulo é geometria pura: entra um par de pontos e um estilo, sai o `d` de
// um único <path>. Nada de DOM, nada de cor, e por isso dá para testar no nó.

export type TipoSeta = 'continua' | 'tracejada' | 'pontilhada' | 'segmentada';

export interface EstiloSeta {
  /** Grossura na origem, em px. Zero faz a seta nascer de um ponto. */
  base?: number;
  /** Grossura junto da cabeça, em px. É o número que dá o "peso" da seta. */
  ponta?: number;
  /** Curvatura, em graus. 0 é reta; o sinal escolhe para que lado ela arqueia. */
  arco?: number;
  tipo?: TipoSeta;
  /** Tamanho da cabeça, em múltiplos de `ponta`. */
  cabeca?: number;
}

export const SETA_PADRAO: Required<EstiloSeta> = {
  base: 1.5, ponta: 9, arco: 16, tipo: 'continua', cabeca: 1.9,
};

/**
 * Os padrões de traço, em px de comprimento: [aceso, apagado].
 *
 * Medidas em px do mundo, e não em múltiplos da espessura: o que a mesa
 * enxerga é o desenho no tabuleiro, e uma seta grossa com traços proporcionais
 * viraria outra coisa em vez da mesma seta mais gorda.
 */
const PADROES: Record<TipoSeta, number[]> = {
  continua: [],
  tracejada: [11, 6],
  pontilhada: [2, 5.5],
  segmentada: [20, 9],
};

export interface Ponto { x: number; y: number }

const arred = (n: number) => Math.round(n * 10) / 10;

/**
 * O caminho de uma seta de `a` até `b`.
 *
 * Devolve o `d` de um <path> com vários subcaminhos fechados (o corpo, ou os
 * pedaços dele, mais a cabeça). Um <path> só, e não um por traço: o navegador
 * pinta tudo de uma vez e a regra de preenchimento dá conta de figuras
 * separadas. Devolve string vazia quando os dois pontos são o mesmo, que é o
 * caso do clique parado.
 */
export function caminhoSeta(a: Ponto, b: Ponto, estilo: EstiloSeta = {}): string {
  const e = { ...SETA_PADRAO, ...estilo };
  const dx = b.x - a.x, dy = b.y - a.y;
  const reta = Math.hypot(dx, dy);
  if (!(reta > 0.5)) return '';

  // O ponto de controle sai do meio da corda, empurrado na perpendicular. Com
  // `arco` em graus, a altura é (corda ÷ 2) × tan(arco ÷ 2): assim o ângulo
  // pedido é o que a seta faz com a corda ao sair de `a`, que é o que o olho lê
  // como "quanto ela entorta".
  const g = Math.max(-80, Math.min(80, e.arco || 0));
  const alt = (reta / 2) * Math.tan((g * Math.PI) / 360);
  const nx = -dy / reta, ny = dx / reta;
  const c: Ponto = { x: (a.x + b.x) / 2 + nx * alt, y: (a.y + b.y) / 2 + ny * alt };

  // Amostragem da curva. 48 pedaços é fino o bastante para a maior seta que
  // cabe num tabuleiro e barato o bastante para redesenhar a cada movimento do
  // ponteiro, que é quando isto roda.
  const N = 48;
  const pts: Ponto[] = [];
  const acc: number[] = [0];
  for (let i = 0; i <= N; i++) {
    const t = i / N, u = 1 - t;
    pts.push({
      x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
      y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    });
    if (i) acc.push(acc[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = acc[N];
  if (!(total > 0.5)) return '';

  const cab = Math.min(Math.max(e.ponta, 1) * e.cabeca, total * 0.55);
  const corpo = Math.max(0, total - cab);

  /** Ponto, normal e espessura a uma distância `s` do começo. */
  const em = (s: number) => {
    const alvo = Math.max(0, Math.min(total, s));
    let i = 1;
    while (i < N && acc[i] < alvo) i++;
    const t = (alvo - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1]);
    const p = { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t };
    const tx = pts[i].x - pts[i - 1].x, ty = pts[i].y - pts[i - 1].y;
    const m = Math.hypot(tx, ty) || 1;
    const k = corpo > 0 ? Math.min(1, alvo / corpo) : 1;
    return { p, nx: -ty / m, ny: tx / m, w: (e.base + (e.ponta - e.base) * k) / 2 };
  };

  /** Um pedaço do corpo, de `s0` a `s1`, como polígono fechado. */
  const faixa = (s0: number, s1: number) => {
    if (s1 - s0 < 0.2) return '';
    const passos = Math.max(2, Math.ceil((s1 - s0) / 4));
    const esq: string[] = [], dir: string[] = [];
    for (let i = 0; i <= passos; i++) {
      const { p, nx: ux, ny: uy, w } = em(s0 + ((s1 - s0) * i) / passos);
      esq.push(`${arred(p.x + ux * w)},${arred(p.y + uy * w)}`);
      dir.unshift(`${arred(p.x - ux * w)},${arred(p.y - uy * w)}`);
    }
    return `M${esq.join('L')}L${dir.join('L')}Z`;
  };

  const partes: string[] = [];
  const padrao = PADROES[e.tipo] || [];
  if (!padrao.length || corpo <= 0) {
    partes.push(faixa(0, corpo));
  } else {
    // O tracejado começa NA BASE e é interrompido antes da cabeça: um traço
    // pela metade encostando na ponta lê como defeito de desenho.
    let s = 0, aceso = true;
    while (s < corpo) {
      const passo = padrao[aceso ? 0 : 1];
      if (aceso) partes.push(faixa(s, Math.min(corpo, s + passo)));
      s += passo;
      aceso = !aceso;
    }
  }

  // A cabeça: base no fim do corpo, vértice no ponto de chegada. Ela sai um
  // pouco mais larga que a ponta do corpo, senão vira só um traço mais gordo.
  const fim = em(corpo);
  const meia = Math.max(e.ponta, 1) * 0.62 + fim.w;
  partes.push(`M${arred(fim.p.x + fim.nx * meia)},${arred(fim.p.y + fim.ny * meia)}`
    + `L${arred(b.x)},${arred(b.y)}`
    + `L${arred(fim.p.x - fim.nx * meia)},${arred(fim.p.y - fim.ny * meia)}Z`);

  return partes.filter(Boolean).join(' ');
}
