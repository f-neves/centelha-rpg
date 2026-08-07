// Armas desenhadas por código, em SVG, no lugar de um recorte de imagem.
//
// A ideia é ter o visual da gravura sem depender do arquivo: cada arma é uma
// COMPOSIÇÃO de partes (pomo, cabo, guarda, lâmina, cabeça, haste), e cada parte
// é uma função que devolve um trecho de SVG a partir de números. Trocar a guarda
// de uma espada, alongar a lâmina ou azular o aço passa a ser mexer num campo,
// não redesenhar. E dá para inventar arma que não existe na folha.
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
  aco: '#e8ebee', acoLuz: '#ffffff', acoSombra: '#8f9aa3',
  cabo: '#8a4b41', caboEscuro: '#5e3129',
  ouro: '#d9b64a', ouroEscuro: '#9c7a1e',
  traco: '#2b2b2b',
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
  /**
   * Repete a peça inteira: 3 facas em leque, 2 machados cruzados. `pivo` é a
   * altura em que as cópias giram — sem ele, o giro acontece longe da peça e o
   * par de machados abre num "V" em vez de se cruzar.
   */
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

// ------------------------------------------------------------------ partes

/** Punho: cone leve com as voltas do couro (ou veio, se for madeira). */
function cabo(topo: number, comp: number, larg: number, madeira: boolean): string {
  const b = larg / 2, t = b * 0.86;   // afina para cima, como um punho de verdade
  const base = topo + comp;
  const corpo = `<path d="M${n(EIXO - t)} ${n(topo)} L${n(EIXO + t)} ${n(topo)} `
    + `L${n(EIXO + b)} ${n(base)} L${n(EIXO - b)} ${n(base)} Z" `
    + `fill="var(--cabo)" stroke="var(--traco)" stroke-width="1.1"/>`;
  const marcas: string[] = [];
  if (madeira) {
    // veio: riscos no sentido do cabo
    for (let i = -2; i <= 2; i++) {
      const x = EIXO + i * (larg / 6);
      marcas.push(`<path d="M${n(x)} ${n(topo + 2)} L${n(x + i * 0.6)} ${n(base - 2)}" `
        + `stroke="var(--cabo-escuro)" stroke-width="0.7" opacity=".55" fill="none"/>`);
    }
  } else {
    // couro enrolado: as voltas
    const passo = 4.2;
    for (let y = topo + 2.5; y < base - 1; y += passo) {
      const k = (y - topo) / comp;
      const w = t + (b - t) * k;
      marcas.push(`<path d="M${n(EIXO - w)} ${n(y)} Q${n(EIXO)} ${n(y + 1.8)} ${n(EIXO + w)} ${n(y - 0.6)}" `
        + `stroke="var(--cabo-escuro)" stroke-width="0.9" fill="none" opacity=".75"/>`);
    }
  }
  return corpo + marcas.join('');
}

/** Pomo: o contrapeso no alto do cabo. */
function pomo(tipo: TipoPomo, base: number, larg: number): string {
  if (tipo === 'nenhum') return '';
  const r = larg * 0.62;
  const cy = base - r * 0.72;
  const brilho = `<ellipse cx="${n(EIXO - r * 0.28)}" cy="${n(cy - r * 0.3)}" rx="${n(r * 0.3)}" ry="${n(r * 0.22)}" fill="var(--ouro-luz)" opacity=".65"/>`;
  if (tipo === 'roda') {
    const raios = Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return `<path d="M${n(EIXO)} ${n(cy)} L${n(EIXO + Math.cos(a) * r * 0.78)} ${n(cy + Math.sin(a) * r * 0.78)}" stroke="var(--ouro-escuro)" stroke-width="1.1"/>`;
    }).join('');
    return `<circle cx="${n(EIXO)}" cy="${n(cy)}" r="${n(r)}" fill="var(--ouro)" stroke="var(--traco)" stroke-width="1.1"/>`
      + raios + `<circle cx="${n(EIXO)}" cy="${n(cy)}" r="${n(r * 0.26)}" fill="var(--ouro-escuro)"/>` + brilho;
  }
  if (tipo === 'gota') {
    return `<path d="M${n(EIXO)} ${n(cy - r * 1.35)} C${n(EIXO + r)} ${n(cy - r * 0.2)} ${n(EIXO + r * 0.8)} ${n(cy + r * 0.7)} ${n(EIXO)} ${n(cy + r * 0.8)} `
      + `C${n(EIXO - r * 0.8)} ${n(cy + r * 0.7)} ${n(EIXO - r)} ${n(cy - r * 0.2)} ${n(EIXO)} ${n(cy - r * 1.35)} Z" `
      + `fill="var(--ouro)" stroke="var(--traco)" stroke-width="1.1"/>` + brilho;
  }
  return `<circle cx="${n(EIXO)}" cy="${n(cy)}" r="${n(r)}" fill="var(--ouro)" stroke="var(--traco)" stroke-width="1.1"/>` + brilho;
}

/** Guarda: o que separa a mão da lâmina. */
function guarda(tipo: TipoGuarda, y: number, larg: number): string {
  if (tipo === 'nenhuma') return '';
  if (tipo === 'disco') {
    return `<ellipse cx="${n(EIXO)}" cy="${n(y)}" rx="${n(larg / 2)}" ry="${n(larg * 0.16)}" `
      + `fill="var(--ouro)" stroke="var(--traco)" stroke-width="1.1"/>`
      + `<ellipse cx="${n(EIXO)}" cy="${n(y - larg * 0.05)}" rx="${n(larg * 0.34)}" ry="${n(larg * 0.07)}" fill="var(--ouro-luz)" opacity=".5"/>`;
  }
  const b = larg / 2, esp = 4.6, r = 3.2;
  const barra = `<path d="M${n(EIXO - b + r)} ${n(y - esp / 2)} L${n(EIXO + b - r)} ${n(y - esp / 2)} `
    + `L${n(EIXO + b - r)} ${n(y + esp / 2)} L${n(EIXO - b + r)} ${n(y + esp / 2)} Z" `
    + `fill="var(--ouro)" stroke="var(--traco)" stroke-width="1.1"/>`;
  const bolas = `<circle cx="${n(EIXO - b + r * 0.6)}" cy="${n(y)}" r="${n(r)}" fill="var(--ouro)" stroke="var(--traco)" stroke-width="1"/>`
    + `<circle cx="${n(EIXO + b - r * 0.6)}" cy="${n(y)}" r="${n(r)}" fill="var(--ouro)" stroke="var(--traco)" stroke-width="1"/>`;
  const centro = `<circle cx="${n(EIXO)}" cy="${n(y)}" r="2.1" fill="var(--ouro-escuro)"/>`;
  // anéis laterais do montante, que protegem os dedos no ricasso
  const aneis = tipo === 'aneis'
    ? `<path d="M${n(EIXO - b * 0.42)} ${n(y + 2)} q${n(-b * 0.3)} ${n(larg * 0.22)} ${n(b * 0.1)} ${n(larg * 0.3)}" fill="none" stroke="var(--ouro)" stroke-width="2.6" stroke-linecap="round"/>`
      + `<path d="M${n(EIXO + b * 0.42)} ${n(y + 2)} q${n(b * 0.3)} ${n(larg * 0.22)} ${n(-b * 0.1)} ${n(larg * 0.3)}" fill="none" stroke="var(--ouro)" stroke-width="2.6" stroke-linecap="round"/>`
    : '';
  return barra + aneis + bolas + centro;
}

/** Lâmina: o corpo que dá o caráter da arma. */
function lamina(tipo: TipoLamina, topo: number, comp: number, larg: number, fuller: boolean): string {
  const b = larg / 2;
  const ponta = topo + comp;
  const ombro = topo + comp * 0.04;
  let contorno: string;

  if (tipo === 'folha') {
    // barriga no meio e ponta longa: a faca de arremesso
    contorno = `M${n(EIXO)} ${n(topo)} C${n(EIXO + b * 1.15)} ${n(topo + comp * 0.18)} `
      + `${n(EIXO + b)} ${n(topo + comp * 0.55)} ${n(EIXO)} ${n(ponta)} `
      + `C${n(EIXO - b)} ${n(topo + comp * 0.55)} ${n(EIXO - b * 1.15)} ${n(topo + comp * 0.18)} ${n(EIXO)} ${n(topo)} Z`;
  } else if (tipo === 'afilada') {
    contorno = `M${n(EIXO - b)} ${n(topo)} L${n(EIXO + b)} ${n(topo)} L${n(EIXO)} ${n(ponta)} Z`;
  } else if (tipo === 'serrilhada') {
    // um fio liso, o outro com dentes de serra
    const dentes: string[] = [];
    const nD = 11, ini = topo + comp * 0.14, fim = ponta - comp * 0.16;
    for (let i = 0; i < nD; i++) {
      const y0 = ini + ((fim - ini) / nD) * i;
      const y1 = ini + ((fim - ini) / nD) * (i + 1);
      dentes.push(`L${n(EIXO + b * 1.02)} ${n(y0)} L${n(EIXO + b * 0.42)} ${n(y1)}`);
    }
    contorno = `M${n(EIXO - b)} ${n(topo)} L${n(EIXO + b * 0.42)} ${n(topo)} `
      + dentes.join(' ') + ` L${n(EIXO + b * 0.5)} ${n(ponta - comp * 0.02)} `
      + `L${n(EIXO - b * 0.35)} ${n(ponta)} L${n(EIXO - b)} ${n(ponta - comp * 0.06)} Z`;
  } else {
    // reta: lados quase paralelos e ponta nos últimos 18%
    const yT = topo + comp * 0.82;
    contorno = `M${n(EIXO - b)} ${n(ombro)} L${n(EIXO + b)} ${n(ombro)} `
      + `L${n(EIXO + b * 0.92)} ${n(yT)} L${n(EIXO)} ${n(ponta)} `
      + `L${n(EIXO - b * 0.92)} ${n(yT)} Z`;
  }

  const corpo = `<path d="${contorno}" fill="url(#aco-gradiente)" stroke="var(--traco)" stroke-width="1.1" stroke-linejoin="round"/>`;
  // o vinco central, que é o que faz a lâmina parecer forjada e não recortada
  const vinco = fuller
    ? `<path d="M${n(EIXO)} ${n(topo + comp * 0.06)} L${n(EIXO)} ${n(topo + comp * 0.78)}" `
      + `stroke="var(--aco-sombra)" stroke-width="${n(Math.max(1.2, larg * 0.16))}" opacity=".5" stroke-linecap="round"/>`
      + `<path d="M${n(EIXO - larg * 0.14)} ${n(topo + comp * 0.08)} L${n(EIXO - larg * 0.14)} ${n(topo + comp * 0.74)}" `
      + `stroke="var(--aco-luz)" stroke-width="0.9" opacity=".7"/>`
    : `<path d="M${n(EIXO - larg * 0.1)} ${n(topo + comp * 0.06)} L${n(EIXO - larg * 0.1)} ${n(topo + comp * 0.8)}" `
      + `stroke="var(--aco-luz)" stroke-width="0.9" opacity=".6"/>`;
  return corpo + vinco;
}

/** Haste de madeira do machado e da picareta, com virola e ponteira. */
function haste(topo: number, comp: number, larg: number, ponteira: boolean, anel: boolean): string {
  const b = larg / 2, base = topo + comp;
  const partes = [cabo(topo, comp, larg, true)];
  if (anel) {
    const y = base - comp * 0.18;
    partes.push(`<ellipse cx="${n(EIXO)}" cy="${n(y)}" rx="${n(b * 2.1)}" ry="${n(b * 0.6)}" `
      + `fill="var(--cabo)" stroke="var(--traco)" stroke-width="1.1"/>`);
  }
  if (ponteira) {
    partes.push(`<path d="M${n(EIXO - b)} ${n(base - 6)} L${n(EIXO + b)} ${n(base - 6)} `
      + `L${n(EIXO)} ${n(base + 10)} Z" fill="url(#aco-gradiente)" stroke="var(--traco)" stroke-width="1.1"/>`);
  }
  return partes.join('');
}

/** Cabeça de machado ou de picareta, presa na lateral da haste. */
function cabeca(tipo: TipoCabeca, y: number, escala: number): string {
  const e = escala;
  if (tipo === 'picareta') {
    const martelo = `<path d="M${n(EIXO - 22 * e)} ${n(y - 7 * e)} L${n(EIXO - 5 * e)} ${n(y - 8 * e)} `
      + `L${n(EIXO - 5 * e)} ${n(y + 6 * e)} L${n(EIXO - 22 * e)} ${n(y + 5 * e)} Z" `
      + `fill="url(#aco-gradiente)" stroke="var(--traco)" stroke-width="1.1"/>`;
    const bico = `<path d="M${n(EIXO + 5 * e)} ${n(y - 8 * e)} C${n(EIXO + 26 * e)} ${n(y - 9 * e)} `
      + `${n(EIXO + 38 * e)} ${n(y - 2 * e)} ${n(EIXO + 44 * e)} ${n(y + 9 * e)} `
      + `C${n(EIXO + 34 * e)} ${n(y + 1 * e)} ${n(EIXO + 20 * e)} ${n(y + 4 * e)} ${n(EIXO + 5 * e)} ${n(y + 6 * e)} Z" `
      + `fill="url(#aco-gradiente)" stroke="var(--traco)" stroke-width="1.1" stroke-linejoin="round"/>`;
    const colar = `<rect x="${n(EIXO - 6 * e)}" y="${n(y - 10 * e)}" width="${n(12 * e)}" height="${n(20 * e)}" rx="1.5" `
      + `fill="url(#aco-gradiente)" stroke="var(--traco)" stroke-width="1.1"/>`;
    return martelo + bico + colar;
  }
  // machado: lâmina em meia-lua com barba, presa por duas cintas
  const lam = `<path d="M${n(EIXO - 6 * e)} ${n(y - 20 * e)} C${n(EIXO - 34 * e)} ${n(y - 16 * e)} `
    + `${n(EIXO - 44 * e)} ${n(y + 4 * e)} ${n(EIXO - 30 * e)} ${n(y + 22 * e)} `
    + `C${n(EIXO - 20 * e)} ${n(y + 16 * e)} ${n(EIXO - 12 * e)} ${n(y + 16 * e)} ${n(EIXO - 6 * e)} ${n(y + 18 * e)} Z" `
    + `fill="url(#aco-gradiente)" stroke="var(--traco)" stroke-width="1.1" stroke-linejoin="round"/>`;
  const textura = Array.from({ length: 5 }, (_, i) =>
    `<path d="M${n(EIXO - 12 * e - i * 4 * e)} ${n(y - 10 * e + i * 2 * e)} q${n(-6 * e)} ${n(10 * e)} ${n(1 * e)} ${n(19 * e)}" `
    + `fill="none" stroke="var(--aco-sombra)" stroke-width="0.7" opacity=".45"/>`).join('');
  const cintas = `<rect x="${n(EIXO - 8 * e)}" y="${n(y - 22 * e)}" width="${n(16 * e)}" height="${n(9 * e)}" rx="1.5" fill="url(#aco-gradiente)" stroke="var(--traco)" stroke-width="1"/>`
    + `<rect x="${n(EIXO - 8 * e)}" y="${n(y + 12 * e)}" width="${n(16 * e)}" height="${n(9 * e)}" rx="1.5" fill="url(#aco-gradiente)" stroke="var(--traco)" stroke-width="1"/>`;
  return lam + textura + cintas;
}

// -------------------------------------------------------------- composição

/** Monta o corpo da arma (sem o <svg> em volta), já na ordem de empilhamento. */
function corpoArma(a: Arma): string {
  if (a.cabeca) {
    const h = a.haste || {};
    const comp = h.comprimento ?? 330, larg = h.largura ?? 11;
    const e = a.cabeca.escala ?? 1;
    const tipo = a.cabeca.tipo ?? 'machado';
    // a cabeça desce o bastante para caber inteira dentro do quadro: com escala
    // grande ela subia acima do topo do desenho e saía cortada
    const topo = Math.max(18, 26 * e);
    const yCabeca = topo + 22 * e;
    // e escorrega de lado o suficiente para o gume (ou o bico) caber na largura
    const dx = a.cabeca.desloc ?? (tipo === 'picareta' ? -16 : 18);
    return `<g transform="translate(${n(dx)} 0)">`
      + haste(topo, comp, larg, h.ponteira ?? true, h.anel ?? false)
      + cabeca(tipo, yCabeca, e) + '</g>';
  }
  const c = a.cabo || {}, g = a.guarda || {}, l = a.lamina || {};
  const caboComp = c.comprimento ?? 62, caboLarg = c.largura ?? 11;
  const guardaLarg = g.largura ?? 62;
  const lamComp = l.comprimento ?? 250, lamLarg = l.largura ?? 20;
  const topoCabo = 26;
  const yGuarda = topoCabo + caboComp;
  return pomo(a.pomo ?? 'esfera', topoCabo, caboLarg)
    + cabo(topoCabo, caboComp, caboLarg, !!c.madeira)
    + lamina(l.tipo ?? 'reta', yGuarda + 2, lamComp, lamLarg, l.fuller ?? true)
    + guarda(g.tipo ?? 'cruz', yGuarda, guardaLarg);
}

const varsPaleta = (p: Paleta = {}) => {
  const c = { ...PALETA_PADRAO, ...p };
  return `--aco:${c.aco};--aco-luz:${c.acoLuz};--aco-sombra:${c.acoSombra};`
    + `--cabo:${c.cabo};--cabo-escuro:${c.caboEscuro};`
    + `--ouro:${c.ouro};--ouro-escuro:${c.ouroEscuro};--ouro-luz:${c.acoLuz};--traco:${c.traco}`;
};

/** O SVG completo de uma arma, pronto para injetar na página. */
export function desenhaArma(a: Arma, opts: { classe?: string } = {}): string {
  let corpo = corpoArma(a);
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
    + `<defs><linearGradient id="aco-gradiente" x1="0" y1="0" x2="1" y2="0">`
    + `<stop offset="0%" stop-color="var(--aco-sombra)"/><stop offset="28%" stop-color="var(--aco-luz)"/>`
    + `<stop offset="62%" stop-color="var(--aco)"/><stop offset="100%" stop-color="var(--aco-sombra)"/>`
    + `</linearGradient></defs>${corpo}</svg>`;
}

// ------------------------------------------------------- as 9 da folha

export const ARMAS_SVG: Record<string, Arma> = {
  adaga: {
    nome: 'Adaga', pomo: 'esfera',
    cabo: { comprimento: 54, largura: 10 },
    guarda: { tipo: 'disco', largura: 52 },
    lamina: { tipo: 'afilada', comprimento: 190, largura: 30, fuller: false },
  },
  'adaga-de-arremesso': {
    nome: 'Adagas de arremesso', pomo: 'nenhum',
    cabo: { comprimento: 74, largura: 9 },
    guarda: { tipo: 'nenhuma' },
    lamina: { tipo: 'folha', comprimento: 215, largura: 34, fuller: false },
    repetir: { vezes: 3, giro: 7, passo: 20, separado: 6, pivo: 330 },
  },
  'espada-curta': {
    nome: 'Espada Curta', pomo: 'roda',
    cabo: { comprimento: 48, largura: 10 },
    guarda: { tipo: 'cruz', largura: 66 },
    lamina: { tipo: 'reta', comprimento: 205, largura: 24 },
  },
  'espada-longa': {
    nome: 'Espada Longa', pomo: 'gota',
    cabo: { comprimento: 60, largura: 10 },
    guarda: { tipo: 'cruz', largura: 74 },
    lamina: { tipo: 'reta', comprimento: 265, largura: 22 },
  },
  'espada-serrilhada': {
    nome: 'Espada Serrilhada', pomo: 'esfera',
    cabo: { comprimento: 54, largura: 10 },
    guarda: { tipo: 'cruz', largura: 62 },
    lamina: { tipo: 'serrilhada', comprimento: 250, largura: 26, fuller: false },
  },
  montante: {
    nome: 'Montante', pomo: 'esfera',
    cabo: { comprimento: 72, largura: 11 },
    guarda: { tipo: 'aneis', largura: 82 },
    lamina: { tipo: 'reta', comprimento: 262, largura: 27 },
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
