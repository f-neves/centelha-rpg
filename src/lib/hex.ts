// Matemática do tabuleiro de hexágonos. Pura: nenhuma linha aqui toca no DOM
// nem no Supabase, e por isso dá para conferir a conta sem abrir o navegador.
//
// Convenção: hexágono de PONTA PARA CIMA (pointy-top) e coordenada AXIAL (q, r).
//
// Por que axial e não "coluna e linha": num tabuleiro hexagonal as linhas são
// desencontradas, e em coordenada de tela o vizinho de cima não é `row - 1`. Em
// axial os seis vizinhos são seis somas fixas, a distância é uma fórmula de uma
// linha, e nada disso precisa saber se a linha é par ou ímpar. O desencontro
// vira problema só na hora de DESENHAR o retângulo, e para isso existem as duas
// funções de offset aqui embaixo.
//
//        (q, r-1)  (q+1, r-1)
//   (q-1, r)   (q, r)   (q+1, r)
//        (q-1, r+1)  (q, r+1)

export interface Hex { q: number; r: number }
export interface Ponto { x: number; y: number }

const RAIZ3 = Math.sqrt(3);

/** Centro do hexágono (q, r) em pixels, dado o raio (centro até o vértice). */
export function centroHex(q: number, r: number, raio: number): Ponto {
  return { x: raio * RAIZ3 * (q + r / 2), y: raio * 1.5 * r };
}

/** Largura e altura de um hexágono de ponta para cima. */
export const larguraHex = (raio: number) => RAIZ3 * raio;
export const alturaHex = (raio: number) => 2 * raio;

/** Os seis vértices, para o atributo `points` de um <polygon>. */
export function verticesHex(cx: number, cy: number, raio: number): string {
  const p: string[] = [];
  for (let i = 0; i < 6; i++) {
    // −90° para a primeira ponta cair em cima; 60° de passo.
    const a = (Math.PI / 180) * (60 * i - 90);
    p.push(`${(cx + raio * Math.cos(a)).toFixed(2)},${(cy + raio * Math.sin(a)).toFixed(2)}`);
  }
  return p.join(' ');
}

// ------------------------------------------------- retângulo de hexágonos
// O tabuleiro é retangular aos olhos, mas em axial um retângulo não é um
// intervalo de q por um intervalo de r: cada linha que desce empurra o começo
// meio hexágono para a direita. `odd-r` desconta esse empurrão no q.

/** Coluna e linha da tela → axial. */
export const offsetParaAxial = (col: number, row: number): Hex =>
  ({ q: col - Math.floor(row / 2), r: row });

/** Axial → coluna e linha da tela (a volta de `offsetParaAxial`). */
export const axialParaOffset = (q: number, r: number) =>
  ({ col: q + Math.floor(r / 2), row: r });

/** Todos os hexágonos de um tabuleiro de `cols` × `rows`, em ordem de leitura. */
export function tabuleiro(cols: number, rows: number): Hex[] {
  const out: Hex[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) out.push(offsetParaAxial(col, row));
  }
  return out;
}

/** O quadro que embrulha um tabuleiro de `cols` × `rows`, com folga de meio hex. */
export function medidaTabuleiro(cols: number, rows: number, raio: number) {
  const l = larguraHex(raio);
  // A linha ímpar começa meio hexágono à direita, então a largura útil é a das
  // colunas mais essa meia sobra. A altura vai de 1,5 em 1,5 e o último hexágono
  // ainda estica meio raio para baixo.
  return {
    largura: l * cols + (rows > 1 ? l / 2 : 0) + l / 2,
    altura: raio * 1.5 * (rows - 1) + alturaHex(raio) + raio * 0.25,
  };
}

/** Deslocamento que traz o hexágono (0,0) para dentro do quadro. */
export const margemTabuleiro = (raio: number): Ponto => ({ x: larguraHex(raio) / 2, y: raio });

// ------------------------------------------------------------- pixel → hex
/**
 * Qual hexágono está debaixo deste ponto.
 *
 * A conta devolve q e r fracionários, e arredondar cada um por conta própria
 * erra perto das bordas (dois vizinhos reivindicam o mesmo ponto). Por isso a
 * volta pelo cubo: lá os três eixos somam zero, e é essa soma que desempata,
 * corrigindo o eixo que mais se afastou do inteiro.
 */
export function hexEmPonto(x: number, y: number, raio: number): Hex {
  const qf = ((RAIZ3 / 3) * x - (1 / 3) * y) / raio;
  const rf = ((2 / 3) * y) / raio;
  return arredondarHex(qf, rf);
}

export function arredondarHex(qf: number, rf: number): Hex {
  const sf = -qf - rf;
  let q = Math.round(qf), r = Math.round(rf), s = Math.round(sf);
  const dq = Math.abs(q - qf), dr = Math.abs(r - rf), ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) q = -r - s;
  else if (dr > ds) r = -q - s;
  return { q, r };
}

// ----------------------------------------------------------- vizinhança
const VIZINHOS: Hex[] = [
  { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
  { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 },
];
export const vizinhos = (h: Hex): Hex[] => VIZINHOS.map((v) => ({ q: h.q + v.q, r: h.r + v.r }));

/**
 * Distância em hexágonos. É o número de passos de um centro ao outro, que com a
 * escala de 1 metro por hexágono é a distância em metros da cena.
 */
export function distanciaHex(a: Hex, b: Hex): number {
  const dq = a.q - b.q, dr = a.r - b.r;
  return (Math.abs(dq) + Math.abs(dq + dr) + Math.abs(dr)) / 2;
}

/**
 * Anda até `passos` hexágonos de `de` em direção a `para`, parando quando a
 * distância chegar a `pararA` (o alcance de quem persegue: 1 para o braço, 2
 * para a haste, 0 para chegar em cima).
 *
 * Guloso, um vizinho por vez: a cada passo escolhe o vizinho que mais aproxima.
 * Num tabuleiro hexagonal sem obstáculo isso é o caminho mínimo, e é
 * determinístico (empate decidido pela ordem fixa de `VIZINHOS`), que é o que
 * um motor de combate precisa: a mesma cena avança sempre do mesmo jeito.
 * `evita` deixa o chamador vetar casas (ocupadas): o passo que caia numa casa
 * vetada tenta o segundo melhor vizinho, e para se todos pioram.
 */
export function caminharHex(
  de: Hex, para: Hex, passos: number, pararA = 0,
  evita?: (h: Hex) => boolean,
): Hex {
  let pos = { ...de };
  // As casas já pisadas: é o que permite o passo LATERAL (mesma distância)
  // para contornar uma peça no caminho sem entrar em vaivém. Sem ele, o único
  // vizinho que aproxima estar ocupado deixava a peça presa atrás de qualquer
  // aliado parado.
  const pisadas = new Set([chaveHex(pos.q, pos.r)]);
  for (let i = 0; i < passos; i++) {
    const d = distanciaHex(pos, para);
    if (d <= pararA) break;
    const ordem = vizinhos(pos)
      .map((v) => ({ v, d: distanciaHex(v, para) }))
      .sort((a, b) => a.d - b.d);
    const passo = ordem.find((o) => o.d < d && !(evita?.(o.v)))
      || ordem.find((o) => o.d === d && !(evita?.(o.v)) && !pisadas.has(chaveHex(o.v.q, o.v.r)));
    if (!passo) break;
    pos = passo.v;
    pisadas.add(chaveHex(pos.q, pos.r));
  }
  return pos;
}

/** Se o hexágono cabe num tabuleiro de `cols` × `rows`. */
export function dentro(h: Hex, cols: number, rows: number): boolean {
  const { col, row } = axialParaOffset(h.q, h.r);
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

export const chaveHex = (q: number, r: number) => `${q},${r}`;

// ------------------------------------------------------------ nome de casa
/**
 * O nome que se fala em voz alta: coluna em letra, linha em número. "D5".
 *
 * `q,r` é bom para a máquina e péssimo para a mesa: ninguém diz "o goblin foi
 * do menos-dois-três para o menos-um-quatro". A coluna vem do OFFSET, e não do
 * q, justamente por isso — em axial a coluna anda de lado conforme a linha, e o
 * nome tem de bater com o que o olho vê na tela.
 *
 * Passando de Z a contagem vira AA, AB, como planilha; um tabuleiro de 60
 * colunas cabe em duas letras.
 */
export function letraColuna(col: number): string {
  let n = col, s = '';
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return s;
}

export function nomeHex(q: number, r: number): string {
  const { col, row } = axialParaOffset(q, r);
  return `${letraColuna(col)}${row + 1}`;
}
