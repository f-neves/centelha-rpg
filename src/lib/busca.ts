// busca.ts · a regra de casamento da busca do site (Busca.astro), sem DOM nem pagefind.
//
// Tudo aqui é função pura de texto: o `Busca.astro` (navegador) e o `test-busca.mjs` (Node, no
// `validate`) importam o MESMO código. O que depende do índice do pagefind (a busca em si, o
// `result.data()`) fica no componente.

export type Modo = 'palavras' | 'frase';

const L = '[\\p{L}\\p{N}]';

export const semAcento = (s: string): string => s.normalize('NFD').replace(/\p{M}/gu, '');

export const escHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const escRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** As palavras do que foi digitado (letras e números). Aspas e pontuação soltas não contam. */
export function tokensDe(bruto: string): string[] {
  return bruto.match(/[\p{L}\p{N}]+/gu) || [];
}

/** O termo que vai ao pagefind. Frase: ele entende aspas; as digitadas à mão saem para não duplicar. */
export function termoPagefind(tokens: string[], modo: Modo): string {
  return modo === 'frase' ? '"' + tokens.join(' ') + '"' : tokens.join(' ');
}

/** Texto sem acento, guardando para cada caractere o índice no original (para marcar o texto de verdade). */
export function norm(txt: string): { s: string; mapa: number[] } {
  let s = '';
  const mapa: number[] = [];
  for (let i = 0; i < txt.length; i++) {
    const n = txt[i].normalize('NFD').replace(/\p{M}/gu, '');
    for (let k = 0; k < n.length; k++) { s += n[k]; mapa.push(i); }
  }
  return { s, mapa };
}

/**
 * Padrões do Aa. A palavra digitada começa no início de uma palavra do texto (ou na emenda de
 * camelCase, que o pagefind também separa) e pode continuar; o plural digitado acha o singular.
 * Só a caixa é exata, e o acento é ignorado. Frase: um padrão só, palavras em sequência.
 */
export function padroes(tokens: string[], modo: Modo): RegExp[] {
  const raizes = tokens.map((t) => {
    const n = semAcento(t);
    return escRe(n.length > 3 && n.endsWith('s') ? n.slice(0, -1) : n);
  });
  const ini = '(?:(?<![\\p{L}\\p{N}])|(?<=\\p{Ll})(?=\\p{Lu}))';
  if (modo === 'frase') return [new RegExp(ini + raizes.map((r) => r + L + '*').join('[^\\p{L}\\p{N}]+'), 'gu')];
  return raizes.map((r) => new RegExp(ini + r, 'gu'));
}

function achados(norma: { s: string; mapa: number[] }, re: RegExp): [number, number][] {
  const r: [number, number][] = [];
  re.lastIndex = 0;
  let x: RegExpExecArray | null;
  while ((x = re.exec(norma.s))) {
    if (!x[0]) { re.lastIndex++; continue; }
    r.push([norma.mapa[x.index], norma.mapa[x.index + x[0].length - 1] + 1]);
  }
  return r;
}

/** Palavras: todas têm de aparecer (`todas`). Texto curto (trecho): basta uma. Frase: o padrão único. */
export function contem(texto: string, pads: RegExp[], todas: boolean): boolean {
  const n = norm(texto);
  return pads[todas ? 'every' : 'some']((re) => achados(n, re).length > 0);
}

/** Texto puro para HTML com `<mark>` nos trechos de caixa exata; `janela` recorta ao redor do primeiro. */
export function realcar(texto: string, pads: RegExp[], janela: boolean): string {
  const n = norm(texto);
  let spans = pads.flatMap((re) => achados(n, re)).sort((a, b) => a[0] - b[0]);
  const fund: [number, number][] = [];
  for (const sp of spans) {
    const u = fund[fund.length - 1];
    if (u && sp[0] <= u[1]) u[1] = Math.max(u[1], sp[1]); else fund.push([sp[0], sp[1]]);
  }
  spans = fund;
  let a = 0;
  let b = texto.length;
  if (janela && spans.length) {
    a = Math.max(0, spans[0][0] - 70);
    b = Math.min(texto.length, spans[0][0] + 170);
    if (a > 0) { const q = texto.indexOf(' ', a); if (q >= 0 && q < spans[0][0]) a = q + 1; }
    if (b < texto.length) { const q = texto.lastIndexOf(' ', b); if (q > spans[0][1]) b = q; }
  }
  let out = a > 0 ? '… ' : '';
  let p = a;
  for (const [i, j] of spans) {
    if (j <= a || i >= b) continue;
    const ii = Math.max(i, a);
    const jj = Math.min(j, b);
    out += escHtml(texto.slice(p, ii)) + '<mark>' + escHtml(texto.slice(ii, jj)) + '</mark>';
    p = jj;
  }
  out += escHtml(texto.slice(p, b));
  return out + (b < texto.length ? ' …' : '');
}
