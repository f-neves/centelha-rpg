// Armas desenhadas por código, em SVG, no lugar de um recorte de imagem.
//
// A ideia é ter o visual da gravura sem depender do arquivo: cada arma é uma
// COMPOSIÇÃO de partes (pomo, cabo, guarda, lâmina, cabeça, haste), e cada parte
// é uma função que devolve um trecho de SVG a partir de números. Trocar a guarda
// de uma espada, alongar a lâmina ou azular o aço passa a ser mexer num campo,
// não redesenhar. E dá para inventar arma que não existe na folha.
//
// O que faz parecer gravura, e não silhueta chapada:
//   · HACHURA. Linhas finas dentro da forma, mais juntas onde é sombra. É o
//     recurso do buril, e é o que mais muda o resultado.
//   · DOIS PLANOS na lâmina. Aço tem uma quina no meio: um lado pega luz, o
//     outro não. Uma cor só deixa a lâmina parecendo papel recortado.
//   · CONTORNO. Traço escuro por cima de tudo, mais grosso do lado da sombra.
//   · FIO. Um risco claro rente à borda, que é o brilho da aresta.
//
// Convenção do desenho: o eixo Y desce. A peça nasce no alto (pomo em y≈0) e
// termina na ponta, embaixo. Todas as partes desenham centradas em x = EIXO.
//
//   const svg = desenhaArma(ARMAS_SVG['espada-longa']);
//   const outra = desenhaArma({ ...ARMAS_SVG['espada-longa'], lamina: { tipo: 'serrilhada' } });

export const LARGURA = 120;
export const ALTURA = 460;
const EIXO = LARGURA / 2;

/** Paleta. Vira variável CSS, então dá para trocar por peça, por tema ou ao vivo. */
export interface Paleta {
  aco?: string;        // corpo do metal
  acoLuz?: string;     // brilho
  acoSombra?: string;  // sombra e fio
  cabo?: string;       // couro / madeira do punho
  caboEscuro?: string;
  ouro?: string;       // pomo, guarda e virolas
  ouroEscuro?: string;
  traco?: string;      // contorno, o "buril" da gravura
}

export const PALETA_PADRAO: Required<Paleta> = {
  aco: '#dde2e7', acoLuz: '#ffffff', acoSombra: '#39434d',
  cabo: '#8c4b3f', caboEscuro: '#4a2620',
  ouro: '#d9b64a', ouroEscuro: '#8a6a15',
  traco: '#1b1e21',
};

export type TipoPomo = 'esfera' | 'roda' | 'gota' | 'nenhum';
export type TipoGuarda = 'cruz' | 'disco' | 'aneis' | 'nenhuma';
export type TipoLamina = 'reta' | 'afilada' | 'serrilhada' | 'folha';
export type TipoCabeca = 'machado' | 'picareta';

export interface Arma {
  nome?: string;
  paleta?: Paleta;
  pomo?: TipoPomo;
  /** Punho: comprimento e largura em unidades do viewBox. */
  cabo?: { comprimento?: number; largura?: number; madeira?: boolean };
  guarda?: { tipo?: TipoGuarda; largura?: number };
  lamina?: { tipo?: TipoLamina; comprimento?: number; largura?: number; fuller?: boolean };
  /**
   * Machado e picareta: cabeça montada numa haste, sem guarda nem pomo.
   *
   * `desloc` empurra a arma inteira de lado. A cabeça cresce só para um lado (a
   * lâmina do machado para a esquerda, o bico da picareta para a direita), então
   * sem esse empurrão ela passa da borda do quadro e sai cortada.
   */
  cabeca?: { tipo?: TipoCabeca; escala?: number; desloc?: number };
  haste?: { comprimento?: number; largura?: number; ponteira?: boolean; anel?: boolean };
  /** Vira a peça de ponta-cabeça: as facas de arremesso se desenham com a lâmina para cima. */
  virar?: boolean;
  /** Repete a peça inteira: 3 facas em leque, 2 machados cruzados. */
  repetir?: {
    vezes: number; giro: number; passo: number; separado?: number; pivo?: number;
    /**
     * Espelha as cópias da direita. Sem isso, o par de machados fica com as duas
     * cabeças para o mesmo lado e uma delas sai do quadro ao girar; espelhando,
     * cada uma aponta para fora, que é como um par cruzado se desenha.
     */
    espelhar?: boolean;
  };
}

const n = (v: number) => Math.round(v * 100) / 100;

// Cada SVG precisa dos próprios ids de clip e gradiente: dois desenhos na mesma
// página com o mesmo id fazem o segundo herdar o recorte do primeiro.
let seq = 0;

/** Espessuras do traço, em uma escada só, para o desenho inteiro falar a mesma língua. */
const TRACO = {
  contorno: 1.5, interno: 0.9, fino: 0.5,
  // A hachura tem de sobreviver à redução. Com 0,5 de espessura e 2 de passo ela
  // dava linha e vão de menos de 2px na tela, e o olho fundia tudo num cinza:
  // parecia gradiente, não buril. O que faz ler como traço é o VÃO entre linhas.
  hachura: 0.8,
};

// ----------------------------------------------------------------- hachura

/**
 * Linhas finas dentro de uma forma, o recurso do buril.
 *
 * `densidade` recebe a posição de 0 (borda esquerda) a 1 (direita) e devolve o
 * quanto aquela faixa é escura. É o que faz a sombra: linha mais junta e mais
 * opaca de um lado, quase nada do outro.
 */
function hachura(
  clip: string, x0: number, x1: number, y0: number, y1: number,
  densidade: (t: number) => number, cor = 'var(--aco-sombra)', passo = 2.4,
): string {
  const linhas: string[] = [];
  let i = 0;
  for (let x = x0; x <= x1; x += passo) {
    const t = (x - x0) / Math.max(1e-6, x1 - x0);
    const op = densidade(t);
    if (op <= 0.02) continue;
    // Traço de buril não sai idêntico: a mão varia. Sem essa variação a hachura
    // vira trama de impressora. O ruído é calculado do índice, não sorteado,
    // para o desenho sair igual em toda renderização.
    const r = Math.sin(++i * 12.9898) * 43758.5453;
    const jitter = r - Math.floor(r);                    // 0..1, sempre o mesmo
    linhas.push(`<path d="M${n(x)} ${n(y0 + jitter * 3)} L${n(x)} ${n(y1 - jitter * 5)}" stroke="${cor}" `
      + `stroke-width="${n(TRACO.hachura * (0.75 + jitter * 0.7))}" opacity="${n(op * (0.75 + jitter * 0.5))}"/>`);
  }
  return `<g clip-path="url(#${clip})">${linhas.join('')}</g>`;
}

/** Hachura cruzada, em diagonal: usada onde a superfície é curva (gume do machado). */
function hachuraDiagonal(clip: string, x0: number, x1: number, y0: number, y1: number, op = 0.3): string {
  const linhas: string[] = [];
  const span = (x1 - x0) + (y1 - y0);
  for (let d = 0; d < span; d += 4.2) {
    linhas.push(`<path d="M${n(x0 + d)} ${n(y0)} L${n(x0 + d - (y1 - y0))} ${n(y1)}" `
      + `stroke="var(--aco-sombra)" stroke-width="${TRACO.hachura}" opacity="${op}"/>`);
  }
  return `<g clip-path="url(#${clip})">${linhas.join('')}</g>`;
}

// ------------------------------------------------------------------ partes

/** Punho de couro: cada volta é uma faixa com luz em cima e sombra embaixo. */
function cabo(topo: number, comp: number, larg: number, madeira: boolean, id: string): string {
  const b = larg / 2, t = b * 0.86;
  const base = topo + comp;
  const forma = `M${n(EIXO - t)} ${n(topo)} L${n(EIXO + t)} ${n(topo)} `
    + `L${n(EIXO + b)} ${n(base)} L${n(EIXO - b)} ${n(base)} Z`;
  const clip = `${id}-cabo`;
  const partes = [
    `<clipPath id="${clip}"><path d="${forma}"/></clipPath>`,
    `<path d="${forma}" fill="var(--cabo)"/>`,
    // volume: a lateral esquerda recolhe, a direita pega luz
    hachura(clip, EIXO - b, EIXO + b, topo - 1, base + 1,
      (x) => (x < 0.3 ? 0.5 - x : x > 0.78 ? 0.18 : 0.05), 'var(--cabo-escuro)', 2),
  ];
  if (madeira) {
    for (let i = -2; i <= 2; i++) {
      const x = EIXO + i * (larg / 5.5);
      partes.push(`<g clip-path="url(#${clip})"><path d="M${n(x)} ${n(topo)} `
        + `C${n(x + 1.2)} ${n(topo + comp * 0.35)} ${n(x - 1)} ${n(topo + comp * 0.7)} ${n(x + 0.4)} ${n(base)}" `
        + `stroke="var(--cabo-escuro)" stroke-width="${TRACO.fino}" fill="none" opacity=".55"/></g>`);
    }
  } else {
    // as voltas do couro: sombra na dobra e um fiapo de luz no alto de cada uma
    const passo = 4.6;
    for (let y = topo + 1; y < base - 1; y += passo) {
      const k = (y - topo) / comp, w = t + (b - t) * k;
      partes.push(`<g clip-path="url(#${clip})">`
        + `<path d="M${n(EIXO - w - 1)} ${n(y + passo * 0.62)} Q${n(EIXO)} ${n(y + passo * 0.95)} ${n(EIXO + w + 1)} ${n(y + passo * 0.4)}" `
        + `stroke="var(--cabo-escuro)" stroke-width="${TRACO.interno}" fill="none"/>`
        + `<path d="M${n(EIXO - w * 0.5)} ${n(y + passo * 0.2)} Q${n(EIXO - w * 0.05)} ${n(y + passo * 0.34)} ${n(EIXO + w * 0.35)} ${n(y + passo * 0.12)}" `
        + `stroke="var(--aco-luz)" stroke-width="${TRACO.fino}" fill="none" opacity=".28"/>`
        + `</g>`);
    }
  }
  partes.push(`<path d="${forma}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`);
  if (!madeira) {
    // As virolas: aros de metal que prendem o couro nas duas pontas. São pequenas,
    // mas é o que separa "cabo enrolado" de "pedaço de pau pintado" — o original
    // tem uma em cima, sob o pomo, e outra em baixo, contra a guarda.
    partes.push(virola(topo - 0.5, t * 2.35, larg * 0.28));
    partes.push(virola(base - larg * 0.3, b * 2.35, larg * 0.3));
  }
  return partes.join('');
}

/** Aro de metal que arremata o cabo. */
function virola(y: number, larguraTotal: number, alt: number): string {
  const b = larguraTotal / 2;
  const forma = `M${n(EIXO - b)} ${n(y)} L${n(EIXO + b)} ${n(y)} L${n(EIXO + b)} ${n(y + alt)} L${n(EIXO - b)} ${n(y + alt)} Z`;
  return `<path d="${forma}" fill="var(--ouro)"/>`
    + `<path d="M${n(EIXO - b)} ${n(y + alt * 0.68)} L${n(EIXO + b)} ${n(y + alt * 0.68)}" stroke="var(--ouro-escuro)" stroke-width="${TRACO.interno}"/>`
    + `<path d="M${n(EIXO - b)} ${n(y + alt * 0.26)} L${n(EIXO + b)} ${n(y + alt * 0.26)}" stroke="#fff" stroke-width="${TRACO.fino}" opacity=".5"/>`
    + `<path d="${forma}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`;
}

/** Peça de ouro: gradiente quente, vinco escuro e um ponto de luz. */
function ouroRedondo(cx: number, cy: number, r: number, id: string): string {
  return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#${id}-ouro)"/>`
    + `<path d="M${n(cx - r * 0.75)} ${n(cy + r * 0.45)} A${n(r)} ${n(r)} 0 0 0 ${n(cx + r * 0.62)} ${n(cy + r * 0.72)}" `
    + `fill="none" stroke="var(--ouro-escuro)" stroke-width="${TRACO.interno}" opacity=".8"/>`
    + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}"/>`
    + `<ellipse cx="${n(cx - r * 0.3)}" cy="${n(cy - r * 0.36)}" rx="${n(r * 0.26)}" ry="${n(r * 0.18)}" fill="#fff" opacity=".55"/>`;
}

/** Pomo: o contrapeso no alto do cabo. */
function pomo(tipo: TipoPomo, base: number, larg: number, id: string): string {
  if (tipo === 'nenhum') return '';
  const r = larg * 0.66;
  const cy = base - r * 0.7;
  if (tipo === 'roda') {
    const raios = Array.from({ length: 10 }, (_, i) => {
      const a = (i * Math.PI) / 5;
      return `<path d="M${n(EIXO + Math.cos(a) * r * 0.22)} ${n(cy + Math.sin(a) * r * 0.22)} `
        + `L${n(EIXO + Math.cos(a) * r * 0.82)} ${n(cy + Math.sin(a) * r * 0.82)}" `
        + `stroke="var(--ouro-escuro)" stroke-width="${TRACO.interno}"/>`;
    }).join('');
    return ouroRedondo(EIXO, cy, r, id) + raios
      + `<circle cx="${n(EIXO)}" cy="${n(cy)}" r="${n(r * 0.24)}" fill="var(--ouro-escuro)" stroke="var(--traco)" stroke-width="${TRACO.fino}"/>`;
  }
  if (tipo === 'gota') {
    const forma = `M${n(EIXO)} ${n(cy - r * 1.4)} C${n(EIXO + r * 1.05)} ${n(cy - r * 0.25)} `
      + `${n(EIXO + r * 0.85)} ${n(cy + r * 0.72)} ${n(EIXO)} ${n(cy + r * 0.85)} `
      + `C${n(EIXO - r * 0.85)} ${n(cy + r * 0.72)} ${n(EIXO - r * 1.05)} ${n(cy - r * 0.25)} ${n(EIXO)} ${n(cy - r * 1.4)} Z`;
    return `<path d="${forma}" fill="url(#${id}-ouro)"/>`
      + `<path d="M${n(EIXO - r * 0.55)} ${n(cy + r * 0.1)} q${n(r * 0.5)} ${n(r * 0.55)} ${n(r * 1.1)} ${n(-r * 0.05)}" `
      + `fill="none" stroke="var(--ouro-escuro)" stroke-width="${TRACO.interno}" opacity=".75"/>`
      + `<path d="${forma}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}"/>`
      + `<ellipse cx="${n(EIXO - r * 0.28)}" cy="${n(cy - r * 0.5)}" rx="${n(r * 0.2)}" ry="${n(r * 0.3)}" fill="#fff" opacity=".5"/>`;
  }
  return ouroRedondo(EIXO, cy, r, id);
}

/** Guarda: o que separa a mão da lâmina. */
function guarda(tipo: TipoGuarda, y: number, larg: number, id: string): string {
  if (tipo === 'nenhuma') return '';
  if (tipo === 'disco') {
    const rx = larg / 2, ry = larg * 0.24;
    return `<ellipse cx="${n(EIXO)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="url(#${id}-ouro)"/>`
      + `<ellipse cx="${n(EIXO)}" cy="${n(y)}" rx="${n(rx * 0.62)}" ry="${n(ry * 0.5)}" fill="none" stroke="var(--ouro-escuro)" stroke-width="${TRACO.interno}" opacity=".8"/>`
      + `<ellipse cx="${n(EIXO)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}"/>`
      + `<path d="M${n(EIXO - rx * 0.7)} ${n(y - ry * 0.45)} Q${n(EIXO)} ${n(y - ry * 0.9)} ${n(EIXO + rx * 0.4)} ${n(y - ry * 0.5)}" `
      + `fill="none" stroke="#fff" stroke-width="${TRACO.interno}" opacity=".45"/>`;
  }
  const b = larg / 2, esp = 5.4, r = 3.6;
  const barra = `M${n(EIXO - b + r)} ${n(y - esp / 2)} L${n(EIXO + b - r)} ${n(y - esp / 2)} `
    + `L${n(EIXO + b - r)} ${n(y + esp / 2)} L${n(EIXO - b + r)} ${n(y + esp / 2)} Z`;
  const aneis = tipo === 'aneis'
    ? `<path d="M${n(EIXO - b * 0.4)} ${n(y + 2)} q${n(-b * 0.34)} ${n(larg * 0.24)} ${n(b * 0.12)} ${n(larg * 0.32)}" fill="none" stroke="url(#${id}-ouro)" stroke-width="3.2" stroke-linecap="round"/>`
      + `<path d="M${n(EIXO - b * 0.4)} ${n(y + 2)} q${n(-b * 0.34)} ${n(larg * 0.24)} ${n(b * 0.12)} ${n(larg * 0.32)}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.fino}" opacity=".8"/>`
      + `<path d="M${n(EIXO + b * 0.4)} ${n(y + 2)} q${n(b * 0.34)} ${n(larg * 0.24)} ${n(-b * 0.12)} ${n(larg * 0.32)}" fill="none" stroke="url(#${id}-ouro)" stroke-width="3.2" stroke-linecap="round"/>`
      + `<path d="M${n(EIXO + b * 0.4)} ${n(y + 2)} q${n(b * 0.34)} ${n(larg * 0.24)} ${n(-b * 0.12)} ${n(larg * 0.32)}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.fino}" opacity=".8"/>`
    : '';
  return aneis
    + `<path d="${barra}" fill="url(#${id}-ouro)"/>`
    + `<path d="M${n(EIXO - b + r)} ${n(y + esp * 0.16)} L${n(EIXO + b - r)} ${n(y + esp * 0.16)}" stroke="var(--ouro-escuro)" stroke-width="${TRACO.interno}" opacity=".85"/>`
    + `<path d="M${n(EIXO - b + r)} ${n(y - esp * 0.28)} L${n(EIXO + b - r)} ${n(y - esp * 0.28)}" stroke="#fff" stroke-width="${TRACO.fino}" opacity=".4"/>`
    + `<path d="${barra}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`
    + ouroRedondo(EIXO - b + r * 0.6, y, r, id) + ouroRedondo(EIXO + b - r * 0.6, y, r, id)
    + `<circle cx="${n(EIXO)}" cy="${n(y)}" r="2.3" fill="var(--ouro-escuro)" stroke="var(--traco)" stroke-width="${TRACO.fino}"/>`;
}

/** Lâmina: dois planos, hachura nas bordas, fio brilhando e contorno por cima. */
function lamina(tipo: TipoLamina, topo: number, comp: number, larg: number, fuller: boolean, id: string): string {
  const b = larg / 2;
  const ponta = topo + comp;
  const ombro = topo + comp * 0.04;
  let contorno: string;

  if (tipo === 'folha') {
    // Ombro reto no encontro com o cabo. Nascendo num ponto, como antes, a lâmina
    // encostava no punho por um pixel só e o cabo parecia solto no ar.
    const om = b * 0.42;
    contorno = `M${n(EIXO - om)} ${n(topo)} L${n(EIXO + om)} ${n(topo)} `
      + `C${n(EIXO + b * 1.1)} ${n(topo + comp * 0.2)} `
      + `${n(EIXO + b * 0.95)} ${n(topo + comp * 0.58)} ${n(EIXO)} ${n(ponta)} `
      + `C${n(EIXO - b * 0.95)} ${n(topo + comp * 0.58)} ${n(EIXO - b * 1.1)} ${n(topo + comp * 0.2)} ${n(EIXO - om)} ${n(topo)} Z`;
  } else if (tipo === 'afilada') {
    contorno = `M${n(EIXO - b)} ${n(topo)} L${n(EIXO + b)} ${n(topo)} `
      + `L${n(EIXO + b * 0.18)} ${n(ponta - comp * 0.06)} L${n(EIXO)} ${n(ponta)} `
      + `L${n(EIXO - b * 0.18)} ${n(ponta - comp * 0.06)} Z`;
  } else if (tipo === 'serrilhada') {
    const dentes: string[] = [];
    const nD = 15, ini = topo + comp * 0.34, fim = ponta - comp * 0.14;
    for (let i = 0; i < nD; i++) {
      const y0 = ini + ((fim - ini) / nD) * i;
      const y1 = ini + ((fim - ini) / nD) * (i + 1);
      dentes.push(`L${n(EIXO + b * 1.02)} ${n(y0)} L${n(EIXO + b * 0.46)} ${n(y1)}`);
    }
    contorno = `M${n(EIXO - b)} ${n(topo)} L${n(EIXO + b)} ${n(topo)} L${n(EIXO + b)} ${n(ini)} `
      + dentes.join(' ') + ` L${n(EIXO + b * 0.72)} ${n(fim + comp * 0.04)} `
      + `L${n(EIXO)} ${n(ponta)} L${n(EIXO - b)} ${n(ponta - comp * 0.16)} Z`;
  } else {
    const yT = topo + comp * 0.82;
    contorno = `M${n(EIXO - b)} ${n(ombro)} L${n(EIXO + b)} ${n(ombro)} `
      + `L${n(EIXO + b * 0.92)} ${n(yT)} L${n(EIXO)} ${n(ponta)} `
      + `L${n(EIXO - b * 0.92)} ${n(yT)} Z`;
  }

  const clip = `${id}-lam`;
  const partes: string[] = [
    `<clipPath id="${clip}"><path d="${contorno}"/></clipPath>`,
    `<path d="${contorno}" fill="var(--aco)"/>`,
    // Os dois planos do aço: a quina no meio divide a face que pega luz da que
    // recolhe. É o que tira a cara de papel recortado.
    `<g clip-path="url(#${clip})">`
    + `<rect x="${n(EIXO - b - 2)}" y="${n(topo - 2)}" width="${n(b + 2)}" height="${n(comp + 4)}" fill="url(#${id}-face-esq)"/>`
    + `<rect x="${n(EIXO)}" y="${n(topo - 2)}" width="${n(b + 2)}" height="${n(comp + 4)}" fill="url(#${id}-face-dir)"/>`
    + `</g>`,
    // hachura: densa junto ao gume esquerdo, rala no meio, média à direita
    hachura(clip, EIXO - b, EIXO + b, topo - 2, ponta + 2,
            // O original tem três zonas bem separadas: hachura densa no terço da
      // sombra, MIOLO LIMPO e uma tira escura rente ao outro fio. Hachura fraca
      // espalhada por tudo, como estava, só suja a lâmina inteira.
      (t) => (t < 0.5 ? 0.9 - t * 1.3 : t > 0.88 ? 0.55 : 0.07), 'var(--aco-sombra)', 3),
  ];
  if (fuller) {
    // O vinco central. Escavado, ele nasce no ombro e MORRE antes da ponta, e as
    // duas coisas têm de aparecer: canal de borda dura e comprimento reto viram
    // um adesivo cinza colado na lâmina. Daí o afunilamento e o desvanecer.
    const w = larg * 0.15, yA = topo + comp * 0.04, yB = topo + comp * 0.72;
    const canal = `M${n(EIXO - w)} ${n(yA)} L${n(EIXO + w)} ${n(yA)} `
      + `L${n(EIXO + w * 0.35)} ${n(yB)} L${n(EIXO - w * 0.35)} ${n(yB)} Z`;
    partes.push(`<g clip-path="url(#${clip})">`
      + `<path d="${canal}" fill="url(#${id}-vinco)"/>`
      + `<path d="M${n(EIXO + w)} ${n(yA)} L${n(EIXO + w * 0.35)} ${n(yB)}" stroke="url(#${id}-luz-v)" stroke-width="${TRACO.interno}"/>`
      + `<path d="M${n(EIXO - w)} ${n(yA)} L${n(EIXO - w * 0.35)} ${n(yB)}" stroke="url(#${id}-sombra-v)" stroke-width="${TRACO.interno}"/>`
      + `</g>`);
  }
  // fio: o brilho rente à aresta, o detalhe que mais diz "isto é afiado"
  partes.push(`<g clip-path="url(#${clip})">`
    + `<path d="M${n(EIXO + b - 1.1)} ${n(topo + comp * 0.02)} L${n(EIXO + b * 0.9 - 1.1)} ${n(ponta - comp * 0.06)}" `
    + `stroke="#fff" stroke-width="1.3" opacity=".75"/>`
    + `<path d="M${n(EIXO - b + 1.1)} ${n(topo + comp * 0.02)} L${n(EIXO - b * 0.9 + 1.1)} ${n(ponta - comp * 0.06)}" `
    + `stroke="#fff" stroke-width="0.8" opacity=".3"/>`
    + `</g>`);
  partes.push(`<path d="${contorno}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`);
  return partes.join('');
}

/** Haste de madeira do machado e da picareta, com virola e ponteira. */
function haste(topo: number, comp: number, larg: number, ponteira: boolean, anel: boolean, id: string): string {
  const b = larg / 2, base = topo + comp;
  const partes = [cabo(topo, comp, larg, true, id)];
  if (anel) {
    const y = base - comp * 0.18;
    partes.push(`<ellipse cx="${n(EIXO)}" cy="${n(y)}" rx="${n(b * 2.2)}" ry="${n(b * 0.62)}" fill="var(--cabo)"/>`
      + `<path d="M${n(EIXO - b * 2.2)} ${n(y + 0.6)} A${n(b * 2.2)} ${n(b * 0.62)} 0 0 0 ${n(EIXO + b * 2.2)} ${n(y + 0.6)}" `
      + `fill="none" stroke="var(--cabo-escuro)" stroke-width="${TRACO.interno}"/>`
      + `<ellipse cx="${n(EIXO)}" cy="${n(y)}" rx="${n(b * 2.2)}" ry="${n(b * 0.62)}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}"/>`);
  }
  if (ponteira) {
    const forma = `M${n(EIXO - b)} ${n(base - 7)} L${n(EIXO + b)} ${n(base - 7)} L${n(EIXO)} ${n(base + 11)} Z`;
    const clip = `${id}-pont`;
    partes.push(`<clipPath id="${clip}"><path d="${forma}"/></clipPath>`
      + `<path d="${forma}" fill="var(--aco)"/>`
      + `<g clip-path="url(#${clip})"><rect x="${n(EIXO - b - 1)}" y="${n(base - 8)}" width="${n(b + 1)}" height="22" fill="url(#${id}-face-esq)"/></g>`
      + `<path d="${forma}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`);
  }
  return partes.join('');
}

/** Cabeça de machado ou de picareta, presa na lateral da haste. */
function cabeca(tipo: TipoCabeca, y: number, e: number, id: string): string {
  const cinta = (yy: number, h: number) => {
    const forma = `M${n(EIXO - 8 * e)} ${n(yy)} L${n(EIXO + 8 * e)} ${n(yy)} `
      + `L${n(EIXO + 8 * e)} ${n(yy + h)} L${n(EIXO - 8 * e)} ${n(yy + h)} Z`;
    return `<path d="${forma}" fill="var(--aco)"/>`
      + `<path d="M${n(EIXO - 8 * e)} ${n(yy + h * 0.62)} L${n(EIXO + 8 * e)} ${n(yy + h * 0.62)}" stroke="var(--aco-sombra)" stroke-width="${TRACO.interno}" opacity=".8"/>`
      + `<path d="M${n(EIXO - 8 * e)} ${n(yy + h * 0.26)} L${n(EIXO + 8 * e)} ${n(yy + h * 0.26)}" stroke="#fff" stroke-width="${TRACO.fino}" opacity=".55"/>`
      + `<path d="${forma}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`;
  };

  if (tipo === 'picareta') {
    const clipM = `${id}-mart`, clipB = `${id}-bico`;
    const martelo = `M${n(EIXO - 23 * e)} ${n(y - 7.5 * e)} L${n(EIXO - 5 * e)} ${n(y - 8.5 * e)} `
      + `L${n(EIXO - 5 * e)} ${n(y + 6.5 * e)} L${n(EIXO - 23 * e)} ${n(y + 5.5 * e)} Z`;
    const bico = `M${n(EIXO + 5 * e)} ${n(y - 8.5 * e)} C${n(EIXO + 26 * e)} ${n(y - 9.5 * e)} `
      + `${n(EIXO + 39 * e)} ${n(y - 2 * e)} ${n(EIXO + 45 * e)} ${n(y + 9 * e)} `
      + `C${n(EIXO + 34 * e)} ${n(y + 1 * e)} ${n(EIXO + 20 * e)} ${n(y + 4 * e)} ${n(EIXO + 5 * e)} ${n(y + 6 * e)} Z`;
    return `<clipPath id="${clipM}"><path d="${martelo}"/></clipPath>`
      + `<clipPath id="${clipB}"><path d="${bico}"/></clipPath>`
      + `<path d="${martelo}" fill="var(--aco)"/>`
      + hachura(clipM, EIXO - 23 * e, EIXO - 5 * e, y - 10 * e, y + 8 * e, (t) => (t < 0.3 ? 0.5 : t > 0.8 ? 0.35 : 0.08))
      + `<path d="M${n(EIXO - 21 * e)} ${n(y - 5 * e)} L${n(EIXO - 21 * e)} ${n(y + 3.6 * e)}" stroke="#fff" stroke-width="1.2" opacity=".6"/>`
      + `<path d="${martelo}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`
      + `<path d="${bico}" fill="var(--aco)"/>`
      + hachuraDiagonal(clipB, EIXO + 5 * e, EIXO + 45 * e, y - 10 * e, y + 10 * e, 0.32)
      + `<path d="M${n(EIXO + 8 * e)} ${n(y - 6.5 * e)} C${n(EIXO + 26 * e)} ${n(y - 7 * e)} ${n(EIXO + 36 * e)} ${n(y - 0.5 * e)} ${n(EIXO + 42 * e)} ${n(y + 7 * e)}" `
      + `fill="none" stroke="#fff" stroke-width="1.2" opacity=".65"/>`
      + `<path d="${bico}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`
      + cinta(y - 11 * e, 22 * e);
  }

  // Machado: meia-lua com chifre em cima e barba embaixo, presa por duas cintas.
  // A aresta de cima entra (côncava) e o gume sai (convexo) — é esse contraste
  // que faz ler machado; dois arcos para o mesmo lado davam uma foice.
  const gume = `M${n(EIXO - 6 * e)} ${n(y - 22 * e)} `
    + `C${n(EIXO - 20 * e)} ${n(y - 25 * e)} ${n(EIXO - 34 * e)} ${n(y - 20 * e)} ${n(EIXO - 41 * e)} ${n(y - 9 * e)} `
    + `C${n(EIXO - 47 * e)} ${n(y + 3 * e)} ${n(EIXO - 44 * e)} ${n(y + 16 * e)} ${n(EIXO - 33 * e)} ${n(y + 25 * e)} `
    + `C${n(EIXO - 24 * e)} ${n(y + 19 * e)} ${n(EIXO - 14 * e)} ${n(y + 16 * e)} ${n(EIXO - 6 * e)} ${n(y + 17 * e)} Z`;
  const clip = `${id}-gume`;
  return `<clipPath id="${clip}"><path d="${gume}"/></clipPath>`
    + `<path d="${gume}" fill="var(--aco)"/>`
    // sombra junto ao olho do machado, luz correndo para o fio
    + `<g clip-path="url(#${clip})"><rect x="${n(EIXO - 46 * e)}" y="${n(y - 24 * e)}" width="${n(42 * e)}" height="${n(50 * e)}" fill="url(#${id}-face-dir)"/></g>`
    + hachuraDiagonal(clip, EIXO - 46 * e, EIXO - 6 * e, y - 24 * e, y + 26 * e, 0.34)
    // o fio, acompanhando a curva
    + `<path d="M${n(EIXO - 38 * e)} ${n(y - 8 * e)} C${n(EIXO - 43.5 * e)} ${n(y + 3 * e)} ${n(EIXO - 41 * e)} ${n(y + 15 * e)} ${n(EIXO - 31 * e)} ${n(y + 23 * e)}" `
    + `fill="none" stroke="#fff" stroke-width="1.8" opacity=".75"/>`
    + `<path d="${gume}" fill="none" stroke="var(--traco)" stroke-width="${TRACO.contorno}" stroke-linejoin="round"/>`
    + cinta(y - 23 * e, 10 * e) + cinta(y + 12 * e, 10 * e);
}

// -------------------------------------------------------------- composição

function corpoArma(a: Arma, id: string): string {
  if (a.cabeca) {
    const h = a.haste || {};
    const comp = h.comprimento ?? 330, larg = h.largura ?? 11;
    const e = a.cabeca.escala ?? 1;
    const tipo = a.cabeca.tipo ?? 'machado';
    const topo = Math.max(18, 26 * e);
    const yCabeca = topo + 22 * e;
    const dx = a.cabeca.desloc ?? (tipo === 'picareta' ? -16 : 18);
    return `<g transform="translate(${n(dx)} 0)">`
      + haste(topo, comp, larg, h.ponteira ?? true, h.anel ?? false, id)
      + cabeca(tipo, yCabeca, e, id) + '</g>';
  }
  const c = a.cabo || {}, g = a.guarda || {}, l = a.lamina || {};
  const caboComp = c.comprimento ?? 62, caboLarg = c.largura ?? 11;
  const guardaLarg = g.largura ?? 62;
  const lamComp = l.comprimento ?? 250, lamLarg = l.largura ?? 20;
  // O cabo começa abaixo do pomo, que é desenhado para cima a partir dali. Com
  // pomo grande e topo fixo, ele saía pela borda de cima do quadro.
  const rPomo = (a.pomo ?? 'esfera') === 'nenhum' ? 0 : caboLarg * 0.66;
  const topoCabo = 10 + rPomo * (a.pomo === 'gota' ? 2.4 : 1.9);
  const yGuarda = topoCabo + caboComp;
  return pomo(a.pomo ?? 'esfera', topoCabo, caboLarg, id)
    + cabo(topoCabo, caboComp, caboLarg, !!c.madeira, id)
    + lamina(l.tipo ?? 'reta', yGuarda + 2, lamComp, lamLarg, l.fuller ?? true, id)
    + guarda(g.tipo ?? 'cruz', yGuarda, guardaLarg, id);
}

const varsPaleta = (p: Paleta = {}) => {
  const c = { ...PALETA_PADRAO, ...p };
  return `--aco:${c.aco};--aco-luz:${c.acoLuz};--aco-sombra:${c.acoSombra};`
    + `--cabo:${c.cabo};--cabo-escuro:${c.caboEscuro};`
    + `--ouro:${c.ouro};--ouro-escuro:${c.ouroEscuro};--traco:${c.traco}`;
};

/** Gradientes do desenho. Ficam dentro de cada SVG, com id próprio. */
const defs = (id: string) => `<defs>`
  + `<linearGradient id="${id}-face-esq" x1="0" y1="0" x2="1" y2="0">`
  + `<stop offset="0%" stop-color="var(--aco-sombra)" stop-opacity=".85"/>`
  + `<stop offset="70%" stop-color="var(--aco-sombra)" stop-opacity=".12"/>`
  + `<stop offset="100%" stop-color="var(--aco-luz)" stop-opacity=".25"/></linearGradient>`
  + `<linearGradient id="${id}-face-dir" x1="0" y1="0" x2="1" y2="0">`
  + `<stop offset="0%" stop-color="var(--aco-luz)" stop-opacity=".8"/>`
  + `<stop offset="45%" stop-color="var(--aco-luz)" stop-opacity=".15"/>`
  + `<stop offset="100%" stop-color="var(--aco-sombra)" stop-opacity=".6"/></linearGradient>`
  + `<radialGradient id="${id}-ouro" cx="35%" cy="30%" r="75%">`
  + `<stop offset="0%" stop-color="#f3e08a"/><stop offset="55%" stop-color="var(--ouro)"/>`
  + `<stop offset="100%" stop-color="var(--ouro-escuro)"/></radialGradient>`
  // o vinco e suas duas quinas desvanecem nas pontas: canal escavado não começa
  // nem termina numa linha reta
  + `<linearGradient id="${id}-vinco" x1="0" y1="0" x2="0" y2="1">`
  + `<stop offset="0%" stop-color="var(--aco-sombra)" stop-opacity="0"/>`
  + `<stop offset="10%" stop-color="var(--aco-sombra)" stop-opacity=".42"/>`
  + `<stop offset="72%" stop-color="var(--aco-sombra)" stop-opacity=".34"/>`
  + `<stop offset="100%" stop-color="var(--aco-sombra)" stop-opacity="0"/></linearGradient>`
  + `<linearGradient id="${id}-luz-v" x1="0" y1="0" x2="0" y2="1">`
  + `<stop offset="0%" stop-color="#fff" stop-opacity="0"/><stop offset="14%" stop-color="#fff" stop-opacity=".55"/>`
  + `<stop offset="76%" stop-color="#fff" stop-opacity=".35"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient>`
  + `<linearGradient id="${id}-sombra-v" x1="0" y1="0" x2="0" y2="1">`
  + `<stop offset="0%" stop-color="var(--traco)" stop-opacity="0"/><stop offset="14%" stop-color="var(--traco)" stop-opacity=".5"/>`
  + `<stop offset="76%" stop-color="var(--traco)" stop-opacity=".3"/><stop offset="100%" stop-color="var(--traco)" stop-opacity="0"/></linearGradient>`
  + `</defs>`;

/** O SVG completo de uma arma, pronto para injetar na página. */
export function desenhaArma(a: Arma, opts: { classe?: string } = {}): string {
  const id = `w${++seq}`;
  let corpo = corpoArma(a, id);
  if (a.virar) corpo = `<g transform="translate(0 ${ALTURA}) scale(1 -1)">${corpo}</g>`;
  if (a.repetir) {
    const { vezes, giro, passo, separado = 0, pivo = ALTURA * 0.45, espelhar } = a.repetir;
    const copias: string[] = [];
    for (let i = 0; i < vezes; i++) {
      const k = i - (vezes - 1) / 2;
      const espelho = espelhar && k > 0 ? ` translate(${LARGURA} 0) scale(-1 1)` : '';
      copias.push(`<g transform="translate(${n(k * passo)} ${n(Math.abs(k) * separado)}) `
        + `rotate(${n(k * giro)} ${EIXO} ${n(pivo)})${espelho}">${corpo}</g>`);
    }
    corpo = copias.join('');
  }
  return `<svg viewBox="0 0 ${LARGURA} ${ALTURA}" class="arma-svg${opts.classe ? ' ' + opts.classe : ''}"`
    + ` style="${varsPaleta(a.paleta)}" role="img"${a.nome ? ` aria-label="${a.nome}"` : ' aria-hidden="true"'}>`
    + defs(id) + corpo + `</svg>`;
}

// ------------------------------------------------------- as 9 da folha

export const ARMAS_SVG: Record<string, Arma> = {
  // As proporções vêm da medição das peças originais: guarda a 28–35% da altura,
  // lâmina ocupando 61–68%, base da lâmina entre 28% e 39% da largura da guarda.
  adaga: {
    nome: 'Adaga', pomo: 'esfera',
    cabo: { comprimento: 108, largura: 24 },
    guarda: { tipo: 'disco', largura: 78 },
    lamina: { tipo: 'afilada', comprimento: 272, largura: 42, fuller: false },
  },
  'adaga-de-arremesso': {
    nome: 'Adagas de arremesso', pomo: 'nenhum',
    cabo: { comprimento: 108, largura: 16 },
    guarda: { tipo: 'nenhuma' },
    lamina: { tipo: 'folha', comprimento: 300, largura: 40, fuller: false },
    virar: true,
    repetir: { vezes: 3, giro: 7, passo: 22, separado: 8, pivo: 60 },
  },
  'espada-curta': {
    nome: 'Espada Curta', pomo: 'roda',
    cabo: { comprimento: 92, largura: 20 },
    guarda: { tipo: 'cruz', largura: 96 },
    lamina: { tipo: 'reta', comprimento: 288, largura: 32 },
  },
  'espada-longa': {
    nome: 'Espada Longa', pomo: 'gota',
    cabo: { comprimento: 86, largura: 19 },
    guarda: { tipo: 'cruz', largura: 104 },
    lamina: { tipo: 'reta', comprimento: 300, largura: 30 },
  },
  'espada-serrilhada': {
    nome: 'Espada Serrilhada', pomo: 'esfera',
    cabo: { comprimento: 92, largura: 20 },
    guarda: { tipo: 'cruz', largura: 94 },
    lamina: { tipo: 'serrilhada', comprimento: 292, largura: 36, fuller: false },
  },
  montante: {
    nome: 'Montante', pomo: 'esfera',
    cabo: { comprimento: 104, largura: 21 },
    guarda: { tipo: 'aneis', largura: 106 },
    lamina: { tipo: 'reta', comprimento: 282, largura: 34 },
  },
  machado: {
    nome: 'Machado',
    cabeca: { tipo: 'machado', escala: 1.6 },
    haste: { comprimento: 320, largura: 13, ponteira: true },
  },
  'machado-de-arremesso': {
    nome: 'Machados de arremesso',
    cabeca: { tipo: 'machado', escala: 1.05, desloc: 14 },
    haste: { comprimento: 265, largura: 11, ponteira: false },
    repetir: { vezes: 2, giro: 30, passo: 0, pivo: 240, espelhar: true },
  },
  'picareta-de-guerra': {
    nome: 'Picareta de Guerra',
    cabeca: { tipo: 'picareta', escala: 1.45 },
    haste: { comprimento: 320, largura: 13, ponteira: true, anel: true },
  },
};
