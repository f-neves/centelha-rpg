// O índice das imagens do bestiário (carrossel do card). A Curadora o gera como
// `bestiario-imagens.json`:
//
//   { "<id>": [ { "n": 1, "arquivo": "<id>_01.webp", "mini": "<id>_01_mini.webp",
//                 "sexo": "mulher" | "homem" | null, "legenda": "texto curto",
//                 "estilo": "padrao", "original": "nome do png de origem" }, ... ] }
//
// Esta lib é PURA (nada de DOM, nada de arquivo): recebe o JSON já lido e devolve a lista
// limpa. Quem lê o arquivo do disco é `bestiario-galeria.ts`. Assim o teste cobre a regra
// inteira sem subir a Astro.
//
// A regra de ouro é a de que nada quebra: índice ausente, malformado ou incompleto dá
// `{}` ou uma lista menor, e a criatura sem entrada válida segue com a imagem de sempre.

export interface ImagemGaleria {
  n: number;
  arquivo: string;
  mini: string;
  sexo: 'homem' | 'mulher' | null;
  legenda: string;
  estilo: string;
  original: string;
}
export type IndiceGaleria = Record<string, ImagemGaleria[]>;

/** Quantas imagens o carrossel mostra; o resto fica na galeria "Ver todas". */
export const MAX_CARROSSEL = 8;
/** O estilo que o carrossel mostra hoje; as versões por raça (élfico, anão...) virão depois. */
export const ESTILO_PADRAO = 'padrao';

// Só um nome de arquivo webp, sem pasta nem "..": o caminho é montado por quem usa.
const NOME_OK = /^[A-Za-z0-9][A-Za-z0-9._-]*\.webp$/;

function imagemValida(bruta: unknown, posicao: number): ImagemGaleria | null {
  if (!bruta || typeof bruta !== 'object') return null;
  const o = bruta as Record<string, unknown>;
  if (typeof o.arquivo !== 'string' || !NOME_OK.test(o.arquivo)) return null;
  if (typeof o.mini !== 'string' || !NOME_OK.test(o.mini)) return null;
  const n = typeof o.n === 'number' && Number.isFinite(o.n) ? o.n : posicao + 1;
  return {
    n,
    arquivo: o.arquivo,
    mini: o.mini,
    sexo: o.sexo === 'homem' || o.sexo === 'mulher' ? o.sexo : null,
    legenda: typeof o.legenda === 'string' ? o.legenda.trim() : '',
    estilo: typeof o.estilo === 'string' && o.estilo ? o.estilo : ESTILO_PADRAO,
    original: typeof o.original === 'string' ? o.original : '',
  };
}

/** O índice lido do JSON, tolerante: qualquer coisa que não seja o formato esperado vira `{}`. */
export function lerIndice(bruto: unknown): IndiceGaleria {
  if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) return {};
  const saida: IndiceGaleria = {};
  for (const [id, lista] of Object.entries(bruto as Record<string, unknown>)) {
    if (!Array.isArray(lista)) continue;
    const imagens = lista.map(imagemValida).filter((x): x is ImagemGaleria => x !== null);
    if (imagens.length) saida[id] = imagens;
  }
  return saida;
}

export interface OpcoesImagens {
  /** O estilo mostrado (hoje só "padrao"). */
  estilo?: string;
  /** Quantas imagens entram em `itens` (o carrossel). */
  max?: number;
  /** Diz se o arquivo existe no destino; a entrada cujo arquivo falta é descartada. */
  existe?: (arquivo: string) => boolean;
}
export interface ImagensDaCriatura {
  /** As que o carrossel mostra: as `max` primeiras, por `n`. */
  itens: ImagemGaleria[];
  /** Todas as do estilo, por `n` (a galeria "Ver todas"). */
  todas: ImagemGaleria[];
  /** Quantas há no total (`todas.length`). */
  total: number;
}

/** As imagens de uma criatura, ordenadas por `n`, do estilo pedido e só com arquivo presente. */
export function imagensDe(indice: IndiceGaleria, id: string, opcoes: OpcoesImagens = {}): ImagensDaCriatura {
  const { estilo = ESTILO_PADRAO, max = MAX_CARROSSEL, existe } = opcoes;
  const bruta = Object.prototype.hasOwnProperty.call(indice, id) ? indice[id] : [];
  const vistas = new Set<number>();
  const todas = bruta
    .filter((x) => x.estilo === estilo)
    .filter((x) => !existe || (existe(x.arquivo) && existe(x.mini)))
    .sort((a, b) => a.n - b.n)
    // dois com o mesmo `n` não valem duas posições: fica a primeira
    .filter((x) => (vistas.has(x.n) ? false : (vistas.add(x.n), true)));
  return { itens: todas.slice(0, Math.max(0, max)), todas, total: todas.length };
}
