// O volume visto de fora: o sólido em três dimensões, do tamanho de um selo.
//
// A caixa de Conjurar mostra o chão em cima do favo, e para o chão isso basta.
// O VOLUME não: uma pegada redonda de 1,6 m pode ser uma coluna de 3,3 m ou uma
// panqueca, e é justamente a altura que o tabuleiro visto de cima engole. Este
// arquivo desenha o sólido em perspectiva isométrica, com um boneco de 1,80 m ao
// lado para dar a escala, que é o que a `volume-bench.html` faz na bancada.
//
// A técnica é a de lá, encolhida: malha de polígonos, ordenação por
// profundidade (o algoritmo do pintor) e sombreado por normal. A diferença é o
// meio, SVG em vez de canvas, porque a caixa se redesenha por string e um
// `<canvas>` precisaria de contexto vivo entre repintes.
//
// Projeção ORTOGONAL, e não em perspectiva: em selo de duzentos pixels a fuga
// só entorta a leitura, e "isométrica" é ortogonal por definição.
import { medidasDoSolido, type MedidasDoSolido } from './artes-grid';

/** Onde a câmera está, em volta do sólido. */
export interface Camera { giro: number; altura: number }
/** O ângulo de sempre: três quartos, de cima. É o que mostra as três faces. */
export const CAMERA_ISO: Camera = { giro: -0.72, altura: 0.42 };
/** O olho não passa por cima do zênite nem afunda embaixo do chão. */
export const ALTURA_MIN = 0.05, ALTURA_MAX = 1.45;

type V3 = [number, number, number];
interface Face { pts: V3[]; normal: V3; cor: 'solido' | 'corpo' }

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cruz = (a: V3, b: V3): V3 =>
  [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const ponto = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norma = (a: V3): V3 => {
  const n = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / n, a[1] / n, a[2] / n];
};
/** A normal de um polígono plano, pela primeira dobra que não for reta. */
const normalDe = (pts: V3[]): V3 => {
  for (let i = 2; i < pts.length; i++) {
    const n = cruz(sub(pts[1], pts[0]), sub(pts[i], pts[0]));
    if (Math.hypot(n[0], n[1], n[2]) > 1e-9) return norma(n);
  }
  return [0, 1, 0];
};
const centro = (pts: V3[]): V3 => [
  pts.reduce((a, p) => a + p[0], 0) / pts.length,
  pts.reduce((a, p) => a + p[1], 0) / pts.length,
  pts.reduce((a, p) => a + p[2], 0) / pts.length,
];
/**
 * As normais viradas para FORA, e não para onde a ordem dos pontos calhou.
 *
 * Escrever cada face na ordem certa à mão é o tipo de coisa que se erra em
 * silêncio: a face fica preta, ou some por trás do corte de face oculta, e
 * quem olha o desenho não tem como saber qual das seis está errada. Aqui a
 * regra é uma só e vale para todos os sólidos: a normal aponta para longe do
 * miolo. O anel é a exceção, porque tem miolo por dentro do tubo, e por isso
 * ele diz face a face de onde é o dentro dele.
 */
function orientar(fs: Face[], ref?: (f: Face) => V3): Face[] {
  const miolo = centro(fs.flatMap((f) => f.pts));
  for (const f of fs) {
    const de = ref ? ref(f) : miolo;
    if (ponto(f.normal, sub(centro(f.pts), de)) < 0) {
      f.normal = [-f.normal[0], -f.normal[1], -f.normal[2]];
    }
  }
  return fs;
}

// ------------------------------------------------------------- as malhas
//
// Todas nascem com a base no chão (y = 0) e o eixo em x = z = 0, que é como a
// matéria aparece: apoiada. A esfera é a única que toca em um ponto só, e por
// isso o centro dela fica a um raio de altura.
const cara = (pts: V3[], cor: Face['cor'] = 'solido'): Face =>
  ({ pts, normal: normalDe(pts), cor });

function caixa(larg: number, alt: number, prof: number, y0 = 0, cor: Face['cor'] = 'solido'): Face[] {
  const x = larg / 2, z = prof / 2, y1 = y0 + alt;
  const v = (a: number, b: number, c: number): V3 => [a, b, c];
  return orientar([
    cara([v(-x, y1, -z), v(x, y1, -z), v(x, y1, z), v(-x, y1, z)], cor),      // topo
    cara([v(-x, y0, z), v(x, y0, z), v(x, y0, -z), v(-x, y0, -z)], cor),      // base
    cara([v(-x, y0, z), v(-x, y1, z), v(x, y1, z), v(x, y0, z)], cor),        // frente
    cara([v(x, y0, -z), v(x, y1, -z), v(-x, y1, -z), v(-x, y0, -z)], cor),    // fundo
    cara([v(x, y0, z), v(x, y1, z), v(x, y1, -z), v(x, y0, -z)], cor),        // direita
    cara([v(-x, y0, -z), v(-x, y1, -z), v(-x, y1, z), v(-x, y0, z)], cor),    // esquerda
  ]);
}

function anelDePontos(r: number, y: number, n: number): V3[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.cos(a) * r, y, Math.sin(a) * r] as V3;
  });
}

function cilindro(r: number, alt: number, n = 24): Face[] {
  const base = anelDePontos(r, 0, n), topo = anelDePontos(r, alt, n);
  const fs: Face[] = [cara(topo), cara(base)];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    fs.push(cara([base[i], topo[i], topo[j], base[j]]));
  }
  return orientar(fs);
}

function cone(r: number, alt: number, n = 24): Face[] {
  const base = anelDePontos(r, 0, n), bico: V3 = [0, alt, 0];
  const fs: Face[] = [cara(base)];
  for (let i = 0; i < n; i++) fs.push(cara([base[i], bico, base[(i + 1) % n]]));
  return orientar(fs);
}

function piramide(lado: number, alt: number): Face[] {
  const x = lado / 2, bico: V3 = [0, alt, 0];
  const b: V3[] = [[-x, 0, -x], [x, 0, -x], [x, 0, x], [-x, 0, x]];
  return orientar([cara(b),
    ...b.map((p, i) => cara([p, bico, b[(i + 1) % 4]]))]);
}

/** Esfera ou cúpula, em faixas de latitude. `meia` corta no equador. */
function esfera(r: number, meia: boolean, nu = 20, nv = 10, centroY?: number): Face[] {
  const y0 = centroY ?? (meia ? 0 : r);          // a inteira apoia num ponto só
  const de = meia ? 0 : -Math.PI / 2, ate = Math.PI / 2;
  const fs: Face[] = [];
  const p = (u: number, v: number): V3 => {
    const lat = de + ((ate - de) * v) / nv, lon = (u / nu) * Math.PI * 2;
    return [Math.cos(lat) * Math.cos(lon) * r, y0 + Math.sin(lat) * r, Math.cos(lat) * Math.sin(lon) * r];
  };
  for (let v = 0; v < nv; v++) {
    for (let u = 0; u < nu; u++) {
      const q = [p(u, v), p(u, v + 1), p(u + 1, v + 1), p(u + 1, v)];
      // No topo a faixa degenera em triângulo: repetir o ponto faria uma normal nula.
      fs.push(cara(v === nv - 1 ? [q[0], q[1], q[3]] : q));
    }
  }
  if (meia) fs.push(cara(anelDePontos(r, 0, nu)));
  return orientar(fs);
}

/** O anel, deitado no chão: `R` é o raio do miolo e `t` o do tubo. */
function torus(R: number, t: number, nu = 24, nv = 10): Face[] {
  const p = (u: number, v: number): V3 => {
    const a = (u / nu) * Math.PI * 2, b = (v / nv) * Math.PI * 2;
    const raio = R + Math.cos(b) * t;
    return [Math.cos(a) * raio, t + Math.sin(b) * t, Math.sin(a) * raio];
  };
  const fs: Face[] = [];
  // O dentro do anel não é o miolo do desenho, é o miolo do TUBO: a face que
  // olha para o buraco tem de apontar para o buraco, e não para o centro.
  const eixo = new Map<Face, V3>();
  for (let u = 0; u < nu; u++) {
    const a = ((u + 0.5) / nu) * Math.PI * 2;
    const dentro: V3 = [Math.cos(a) * R, t, Math.sin(a) * R];
    for (let v = 0; v < nv; v++) {
      const f = cara([p(u, v), p(u, v + 1), p(u + 1, v + 1), p(u + 1, v)]);
      eixo.set(f, dentro);
      fs.push(f);
    }
  }
  return orientar(fs, (f) => eixo.get(f) || [0, t, 0]);
}

/** A malha do sólido, já nas medidas que o volume comprou. */
export function malhaDoSolido(id: string, m: MedidasDoSolido): Face[] {
  switch (id) {
    case 'cuboide': return caixa(m.comprimentoM || 0, m.alturaM, m.larguraM || 0);
    case 'esfera': return esfera(m.raioM || 0, false);
    case 'semiesfera': return esfera(m.raioM || 0, true);
    case 'cilindro': return cilindro(m.raioM || 0, m.alturaM);
    case 'cone': return cone(m.raioM || 0, m.alturaM);
    case 'piramide': return piramide(m.ladoM || 0, m.alturaM);
    case 'torus': {
      const R = (m.raioM || 0) * 0.75;
      return torus(R, R / 3);
    }
    default: return caixa(m.ladoM || 0, m.alturaM, m.ladoM || 0);
  }
}

/**
 * UMA FATIA DA MANIFESTAÇÃO: a pirâmide de base em arco da §5.4.
 *
 * O bico sai da mão do feiticeiro, a um metro e meio do chão, e a base é uma
 * casca curva plantada no chão a `raio` metros dele, com a altura que o Volume
 * comprou. É por isso que a fatia não é um triângulo: ela é uma cunha, e o que
 * o tabuleiro visto de cima mostra é só a sombra dela.
 */
function fatia(raio: number, alt: number, de: number, ate: number, n = 8): Face[] {
  const bico: V3 = [0, MAO, 0];
  const arco = (y: number): V3[] => Array.from({ length: n + 1 }, (_, i) => {
    const a = de + ((ate - de) * i) / n;
    return [Math.cos(a) * raio, y, Math.sin(a) * raio] as V3;
  });
  const pe = arco(0), topo = arco(alt);
  const fs: Face[] = [];
  for (let i = 0; i < n; i++) {
    fs.push(cara([pe[i], topo[i], topo[i + 1], pe[i + 1]]));      // a casca de fora
    fs.push(cara([bico, topo[i], topo[i + 1]]));                   // o teto
    fs.push(cara([bico, pe[i], pe[i + 1]]));                       // o chão da cunha
  }
  fs.push(cara([bico, pe[0], topo[0]]));                           // as duas quinas
  fs.push(cara([bico, pe[n], topo[n]]));
  return orientar(fs);
}
/** A altura da mão de quem conjura. É de lá que a manifestação sai. */
const MAO = 1.5;

/**
 * O BONECO, de 1,80 m, ao lado da peça.
 *
 * É a única coisa no desenho que não muda de tamanho, e por isso é ela que diz
 * o tamanho de todo o resto: uma esfera de 62 cm não parece nada até estar do
 * lado de alguém pela metade da canela.
 */
function boneco(x: number, z: number): Face[] {
  return [
    ...caixa(0.42, 1.32, 0.24, 0, 'corpo').map((f) => deslocar(f, x, z)),
    ...caixa(0.22, 0.26, 0.22, 1.46, 'corpo').map((f) => deslocar(f, x, z)),
  ];
}
const deslocar = (f: Face, dx: number, dz: number): Face =>
  ({ ...f, pts: f.pts.map((p) => [p[0] + dx, p[1], p[2] + dz] as V3) });

// ------------------------------------------------------------- o desenho
const n2 = (v: number) => v.toFixed(1);

/**
 * O sólido em SVG, visto da câmera dada.
 *
 * Ordenação pelo pintor: as faces saem da mais longe para a mais perto, e a
 * mais perto cobre. Chega para sólido convexo, e o anel, que não é, sai certo
 * porque cada quadradinho da malha é pequeno o bastante para a ordem por
 * profundidade do centro não errar de forma visível.
 */
export interface Cena {
  faces: Face[];
  /** O raio da peça no chão, em metros. Manda no favo e no lugar do boneco. */
  meia: number;
  cam: Camera;
  largura: number; altura: number;
  /**
   * Onde fica o boneco de escala: ao LADO da peça (a matéria, que aparece num
   * ponto qualquer) ou na ORIGEM (a manifestação e a Aura, que saem de quem
   * conjura). `nenhum` é para quando a peça já é do tamanho de gente.
   */
  boneco?: 'lado' | 'origem' | 'nenhum';
}

/** A matéria comprada, no molde escolhido. */
export function svgDoSolido(opts: {
  solido: string; volumeM3: number; cam: Camera;
  largura: number; altura: number; boneco?: boolean;
}): string {
  const m = medidasDoSolido(opts.solido, opts.volumeM3);
  return cena({
    faces: malhaDoSolido(opts.solido, m),
    meia: Math.max(
      (m.raioM || 0), (m.ladoM || 0) / 2, (m.comprimentoM || 0) / 2, (m.larguraM || 0) / 2,
    ),
    cam: opts.cam, largura: opts.largura, altura: opts.altura,
    boneco: opts.boneco === false ? 'nenhum' : 'lado',
  });
}

/**
 * A MANIFESTAÇÃO DO IMPROVISO: as fatias saindo do feiticeiro.
 *
 * As fatias vizinhas dividem o mesmo bico, e cada uma é uma malha própria: com
 * a matéria translúcida, as costuras entre elas aparecem, e é isso que se quer
 * ver. Abrir em três de 60° não é o mesmo que abrir uma de 180°, mesmo que a
 * sombra no chão seja a mesma.
 */
export function svgDaManifestacao(opts: {
  raioM: number; alturaM: number; fatias: number; fatiaGraus: number;
  cam: Camera; largura: number; altura: number;
}): string {
  const N = Math.max(1, opts.fatias);
  const th = (opts.fatiaGraus * Math.PI) / 180;
  const total = N * th;
  const faces: Face[] = [];
  for (let k = 0; k < N; k++) {
    const de = -total / 2 + k * th;
    faces.push(...fatia(opts.raioM, opts.alturaM, de, de + th));
  }
  return cena({
    faces, meia: opts.raioM, cam: opts.cam,
    largura: opts.largura, altura: opts.altura, boneco: 'origem',
  });
}

/**
 * A ESFERA DA AURA: o volume que nasce em volta de quem conjura.
 *
 * A régua dela compra raio, e não lado de cubo, então ela não escolhe molde: a
 * forma é uma só, e o que a mesa precisa ver é até onde ela passa do corpo.
 */
export function svgDaAura(opts: {
  raioM: number; cam: Camera; largura: number; altura: number;
}): string {
  return cena({
    faces: esfera(opts.raioM, false, 20, 10, Math.max(opts.raioM, 0.9)),
    meia: opts.raioM, cam: opts.cam,
    largura: opts.largura, altura: opts.altura, boneco: 'origem',
  });
}

function cena(opts: Cena): string {
  const W = opts.largura, H = opts.altura, pad = 4;
  const meia = opts.meia;
  const faces = opts.faces;

  // --------------------------------------------------------- a câmera
  const { giro, altura } = opts.cam;
  const topo = Math.max(...faces.flatMap((f) => f.pts.map((q) => q[1])));
  const alvo: V3 = [0, Math.min(topo, 2.4) / 2, 0];
  const olho: V3 = [
    alvo[0] + Math.cos(altura) * Math.sin(giro),
    alvo[1] + Math.sin(altura),
    alvo[2] + Math.cos(altura) * Math.cos(giro),
  ];
  const frente = norma(sub(alvo, olho));
  const dir = norma(cruz(frente, [0, 1, 0]));
  const cima = cruz(dir, frente);
  /** Do mundo para a tela, em metros ainda: [x, y para baixo, profundidade]. */
  const olhar = (p: V3): V3 => {
    const d = sub(p, alvo);
    return [ponto(d, dir), -ponto(d, cima), ponto(sub(p, olho), frente)];
  };

  // O BONECO ACOMPANHA A CÂMERA, sempre à direita de quem olha.
  //
  // Plantado num ponto fixo do chão, ele ficava atrás da peça em metade das
  // voltas, e como a matéria é translúcida o coitado aparecia DENTRO da coluna
  // de água. Pondo-o na direção da direita da câmera, ele fica sempre ao lado,
  // que é onde uma régua serve para alguma coisa.
  if (opts.boneco === 'lado') {
    const passo = meia + 0.75;
    faces.push(...boneco(dir[0] * passo, dir[2] * passo));
  } else if (opts.boneco === 'origem') {
    // Aqui ele não é régua encostada na peça: é o próprio conjurador, e a peça
    // sai dele. Fica na origem, e o desenho mostra de onde a Arte nasce.
    faces.push(...boneco(0, 0));
  }

  // ------------------------------------------------- o chão, em hexágonos
  // O mesmo favo do tabuleiro, um metro de centro a centro, para a peça ter
  // onde se apoiar e para a contagem de casas continuar valendo aqui.
  const alcance = Math.max(2, Math.ceil(meia + (opts.boneco === 'nenhum' ? 1 : 1.6)));
  const chao: V3[][] = [];
  const R = 1 / Math.sqrt(3);
  for (let cx = -alcance; cx <= alcance; cx++) {
    for (let cz = -alcance; cz <= alcance; cz++) {
      const px = cx + (cz % 2 ? 0.5 : 0), pz = cz * 1.5 * R;
      if (Math.hypot(px, pz) > alcance + 0.6) continue;
      chao.push(Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return olhar([px + Math.sin(a) * R, 0, pz - Math.cos(a) * R]);
      }));
    }
  }

  // ------------------------------------------------ a escala e o encaixe
  const projetadas = faces.map((f) => f.pts.map(olhar));
  // O ENQUADRAMENTO É PELA PEÇA, e não pelo chão. Com o favo entrando na conta,
  // uma manifestação de seis metros ficava do tamanho de uma unha no meio de um
  // terreiro vazio: o chão é fundo, e fundo pode sair pela borda.
  const todos = projetadas.flat();
  const xs = todos.map((p) => p[0]), ys = todos.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const px = Math.min((W - 2 * pad) / Math.max(0.5, x1 - x0), (H - 2 * pad) / Math.max(0.5, y1 - y0));
  const ox = pad + (W - 2 * pad - (x1 - x0) * px) / 2 - x0 * px;
  const oy = pad + (H - 2 * pad - (y1 - y0) * px) / 2 - y0 * px;
  const tela = (p: V3) => `${n2(ox + p[0] * px)},${n2(oy + p[1] * px)}`;

  // ------------------------------------------------------- o sombreado
  // Uma luz só, de cima e da esquerda de quem olha. A face que a recebe de
  // frente fica cheia; a que lhe dá as costas fica quase transparente. É o que
  // separa o topo do lado no mesmo tom de tinta.
  const luz = norma([-0.4, 1, 0.55]);
  const ordem = faces
    .map((f, i) => {
      const pts = projetadas[i];
      const z = pts.reduce((a, p) => a + p[2], 0) / pts.length;
      return { f, pts, z };
    })
    .sort((a, b) => b.z - a.z);

  const poligonos = ordem.map(({ f, pts }) => {
    // De costas para a câmera, a face fica escondida pelas outras: cortá-la
    // poupa metade do desenho e some com a costura que a ordem por centro deixa.
    const paraCamera = ponto(f.normal, frente) < 0;
    if (!paraCamera) return '';
    const brilho = Math.max(0, ponto(f.normal, luz));
    const op = (0.22 + 0.6 * brilho).toFixed(2);
    return `<polygon class="${f.cor === 'corpo' ? 'ag-3d-b' : 'ag-3d-s'}"`
      + ` fill-opacity="${op}" points="${pts.map(tela).join(' ')}" />`;
  }).join('');

  const chaoSvg = chao.length
    ? `<path class="ag-3d-ch" d="${chao.map(
      (c) => `M ${c.map(tela).join(' L ')} Z`).join(' ')}" />` : '';

  return `<svg class="ag-3d-svg" viewBox="0 0 ${W} ${H}" aria-hidden="true">
    ${chaoSvg}${poligonos}</svg>`;
}
