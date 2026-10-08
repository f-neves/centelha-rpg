// busca.ts · a regra de casamento da busca do site (Busca.astro), sem DOM nem pagefind.
//
// Tudo aqui é função pura de texto: o `Busca.astro` (navegador) e o `test-busca.mjs` (Node, no
// `validate`) importam o MESMO código. O que depende do índice do pagefind (a busca em si, o
// `result.data()`) fica no componente.
//
// O AA, decisão do autor (CORRIGE 143, opção A): a busca com Aa devolve exatamente o que a busca
// sem Aa acha, MENOS os resultados cuja palavra casada tem outra caixa que a digitada. Quem acha
// a palavra é o pagefind (por radical: "lutando" acha "luta", "lutador"); este módulo só olha a
// CAIXA das palavras que ele casou. O pagefind diz quais são em `result.data().locations`, que
// são posições em `content.split(' ')`.

export type Modo = 'palavras' | 'frase';

export const semAcento = (s: string): string => s.normalize('NFD').replace(/\p{M}/gu, '');

export const escHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

/** As palavras do que foi digitado (letras e números). Aspas e pontuação soltas não contam. */
export function tokensDe(bruto: string): string[] {
  return bruto.match(/[\p{L}\p{N}]+/gu) || [];
}

/** O termo que vai ao pagefind. Frase: ele entende aspas; as digitadas à mão saem para não duplicar. */
export function termoPagefind(tokens: string[], modo: Modo): string {
  return modo === 'frase' ? '"' + tokens.join(' ') + '"' : tokens.join(' ');
}

/** As palavras do texto de uma página, na mesma contagem do pagefind (`locations` indexa isto). */
export const palavrasDe = (content: string): string[] => content.split(' ');

/** Pedaços de uma palavra do texto: separa pela pontuação e pela emenda de camelCase (exemploKael). */
export function segmentos(palavra: string): string[] {
  // sem lookbehind: num literal de regex ele é erro de sintaxe no Safari antes do 16.4, e o
  // módulo inteiro (a busca toda) deixaria de carregar. A emenda vira um espaço e se separa junto.
  return palavra.replace(/(\p{Ll})(?=\p{Lu})/gu, '$1 ').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

const maiuscula = (c: string): boolean => c !== c.toLowerCase();

/**
 * A palavra digitada e um pedaço da palavra casada são "a mesma"? Aqui só se compara o começo: o
 * pagefind já casou por radical, então o que sobra a conferir é se o pedaço é parente do digitado
 * (começa igual, ao menos 3 letras, ou todas se a palavra for mais curta). Acento é ignorado.
 */
function parente(digitada: string, pedaco: string): number {
  const t = semAcento(digitada).toLowerCase();
  const s = semAcento(pedaco).toLowerCase();
  let cp = 0;
  while (cp < t.length && cp < s.length && t[cp] === s[cp]) cp++;
  return cp >= Math.min(3, t.length, s.length) ? cp : 0;
}

/**
 * Para a palavra digitada `token` e a palavra casada `palavra`: 'parente-caixa-certa',
 * 'parente-caixa-errada' ou 'estranha'. A caixa se compara letra a letra no trecho em que as duas
 * começam iguais (o resto da palavra casada é a flexão que o radical do pagefind absorveu).
 */
export function caixa(token: string, palavra: string): 'certa' | 'errada' | 'estranha' {
  const t = semAcento(token);
  let achouParente = false;
  for (const seg of segmentos(palavra)) {
    const cp = parente(token, seg);
    if (!cp) continue;
    achouParente = true;
    const s = semAcento(seg);
    let bate = true;
    for (let i = 0; i < cp; i++) if (maiuscula(t[i]) !== maiuscula(s[i])) { bate = false; break; }
    if (bate) return 'certa';
  }
  return achouParente ? 'errada' : 'estranha';
}

export interface Veredito {
  /** o resultado fica (com Aa)? */
  ok: boolean;
  /** índices das palavras casadas cuja caixa bate: são as que se destacam */
  aceitos: number[];
  /** palavras digitadas para as quais nenhuma palavra casada era parente: não dá para conferir, então passam */
  neutros: number;
}

/**
 * O filtro do Aa para UM resultado do pagefind. `palavras` = palavrasDe(content), `locais` = o
 * `locations` dele (ou o de uma seção).
 *
 * Palavras: cada palavra digitada precisa de uma palavra casada com a caixa certa, a menos que
 * nenhuma palavra casada seja parente dela (aí não há o que conferir, e o resultado passa).
 * Frase: precisa de uma sequência de palavras consecutivas, uma por palavra digitada, cada uma
 * com a caixa certa; se o pagefind não deu nenhuma sequência completa, também não há o que
 * conferir e o resultado passa.
 *
 * A PREMISSA de que `locais` indexa `palavras` (o pagefind conta as posições em `content.split(' ')`)
 * é do pagefind, não nossa. Se ela quebrar (uma posição fora do texto, ou `contagem`, o
 * `word_count` dele, DIFERENTE do número de palavras, para mais ou para menos), o filtro erraria
 * calado; então o resultado inteiro é tratado como neutro: passa, sem destaque, e é contado em
 * `neutros`.
 */
export function filtrarCaixa(palavras: string[], locais: number[], tokens: string[], modo: Modo, contagem?: number): Veredito {
  if (!tokens.length) return { ok: true, aceitos: [], neutros: 0 };
  const lista = Array.isArray(locais) ? locais : [];
  const foraDoTexto = lista.some((i) => !Number.isInteger(i) || i < 0 || i >= palavras.length);
  if (foraDoTexto || (contagem !== undefined && contagem !== palavras.length)) {
    return { ok: true, aceitos: [], neutros: tokens.length };
  }
  const locs = [...new Set(lista)].sort((a, b) => a - b);
  if (modo === 'frase') {
    const n = tokens.length;
    const conjunto = new Set(locs);
    const aceitos = new Set<number>();
    let sequencias = 0;
    for (const i of locs) {
      let inteira = true;
      for (let j = 0; j < n; j++) if (!conjunto.has(i + j)) { inteira = false; break; }
      if (!inteira) continue;
      sequencias++;
      let certa = true;
      for (let j = 0; j < n; j++) if (caixa(tokens[j], palavras[i + j]) === 'errada') { certa = false; break; }
      if (certa) for (let j = 0; j < n; j++) aceitos.add(i + j);
    }
    if (!sequencias) return { ok: true, aceitos: [], neutros: n };
    return { ok: aceitos.size > 0, aceitos: [...aceitos].sort((a, b) => a - b), neutros: 0 };
  }
  const aceitos = new Set<number>();
  let ok = true;
  let neutros = 0;
  for (const tk of tokens) {
    let temParente = false;
    let certa = false;
    for (const i of locs) {
      const c = caixa(tk, palavras[i]);
      if (c === 'estranha') continue;
      temParente = true;
      if (c === 'certa') { certa = true; aceitos.add(i); }
    }
    if (!temParente) neutros++;
    else if (!certa) ok = false;
  }
  return { ok, aceitos: [...aceitos].sort((a, b) => a - b), neutros };
}

/**
 * Trecho em HTML ao redor de `centro` (índice de palavra), com `<mark>` nas palavras de `marcar`.
 * O texto vem escapado: só `<mark>` e as reticências saem como marcação.
 */
export function trechoDe(palavras: string[], marcar: number[], centro: number, antes: number, depois: number): string {
  const de = Math.max(0, centro - antes);
  const ate = Math.min(palavras.length, centro + depois);
  const m = new Set(marcar);
  const partes: string[] = [];
  for (let i = de; i < ate; i++) partes.push(m.has(i) ? '<mark>' + escHtml(palavras[i]) + '</mark>' : escHtml(palavras[i]));
  return (de > 0 ? '… ' : '') + partes.join(' ') + (ate < palavras.length ? ' …' : '');
}
