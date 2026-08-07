// Paleta editável do site (/configuracoes → Cores).
//
// As cores do site são variáveis CSS definidas em global.css, um bloco por tema
// (`:root, [data-theme='classico']`, `[data-theme='escuro']`, `[data-theme='legivel']`).
// Aqui não há cópia desses valores: quem quiser saber o padrão de um tema lê do
// próprio CSS por um elemento-sonda (ver `coresPadrao`). Assim a página nunca
// mostra um "padrão" que já mudou no global.css.
//
// A sobreposição sai como uma folha de estilo injetada, com seletor
// `html[data-theme='<tema>']` (especificidade 0,1,1). O bloco original do
// global.css é `[data-theme='<tema>']` (0,1,0), então a sobreposição ganha
// independente da ordem, e o elemento-sonda (uma div, não o html) continua
// enxergando só o original.

export type Tema = 'classico' | 'escuro' | 'legivel';
export const TEMAS: Tema[] = ['classico', 'escuro', 'legivel'];
export const NOME_TEMA: Record<Tema, string> = { classico: 'Clássico', escuro: 'Escuro', legivel: 'Legível' };

export type Cor = {
  /** nome da variável CSS, sem os dois hífens */
  v: string;
  rot: string;
  /** onde essa cor aparece, em linguagem de quem lê o site */
  onde: string;
};

export type GrupoCor = { titulo: string; nota: string; cores: Cor[] };

/** Os tokens de cor, agrupados pelo papel que cumprem. */
export const GRUPOS: GrupoCor[] = [
  {
    titulo: 'Página e texto',
    nota: 'O fundo da página e a tinta do texto corrido. É o par que decide a leitura de tudo o mais.',
    cores: [
      { v: 'bg', rot: 'Fundo da página', onde: 'o papel: fundo de tudo' },
      { v: 'bg-soft', rot: 'Fundo rebaixado', onde: 'caixas encaixadas, campos, o quadro vazio de imagem' },
      { v: 'ink', rot: 'Texto', onde: 'o corpo do texto e os títulos' },
      { v: 'ink-soft', rot: 'Texto secundário', onde: 'legendas, notas, rótulos de campo' },
      { v: 'link', rot: 'Hiperlink', onde: 'links no meio do texto' },
    ],
  },
  {
    titulo: 'Painéis, modais e cards',
    nota: 'As superfícies que se apoiam sobre a página: painéis da ficha, cards do bestiário, caixas de diálogo, popovers.',
    cores: [
      { v: 'panel', rot: 'Fundo do painel', onde: 'painéis, cards, modais, popovers' },
      { v: 'panel-2', rot: 'Fundo alternado', onde: 'cabeçalho de painel, linha alternada de tabela' },
      { v: 'panel-border', rot: 'Borda do painel', onde: 'a moldura de painéis, cards e campos' },
      { v: 'rule', rot: 'Filete', onde: 'divisórias, linhas de tabela, o traço dos títulos' },
    ],
  },
  {
    titulo: 'Destaque',
    nota: 'A cor do site. Ela aparece preenchendo (barra de capítulo, botão aceso, item do menu) e como texto (link forte, rótulo). São papéis diferentes e por isso tokens diferentes: uma cor viva pode ser ótima como fundo e ilegível como texto.',
    cores: [
      { v: 'accent', rot: 'Preenchimento', onde: 'barra de capítulo, botão aceso, item ativo do menu' },
      { v: 'on-accent', rot: 'Texto sobre o preenchimento', onde: 'a palavra escrita em cima do Preenchimento' },
      { v: 'accent-strong', rot: 'Destaque forte', onde: 'fundo do cabeçalho de tabela, títulos de seção' },
      { v: 'on-accent-strong', rot: 'Texto sobre o forte', onde: 'a palavra escrita em cima do Destaque forte' },
      { v: 'accent-soft', rot: 'Destaque médio', onde: 'bordas e realces discretos' },
      { v: 'accent-texto', rot: 'Destaque como texto', onde: 'rótulos e números em destaque no corpo' },
    ],
  },
  {
    titulo: 'Sinais',
    nota: 'Cores que querem dizer alguma coisa: ouro para o valor do sistema, vermelho para o que apaga, verde para o que deu certo.',
    cores: [
      { v: 'gold', rot: 'Ouro', onde: 'etiquetas de arma, números do catálogo' },
      { v: 'perigo', rot: 'Perigo (texto)', onde: 'o "Excluir" dos cards, avisos destrutivos' },
      { v: 'perigo-bg', rot: 'Perigo (preenchido)', onde: 'botão de confirmar exclusão' },
      { v: 'on-perigo', rot: 'Texto sobre o perigo', onde: 'a palavra escrita em cima do Perigo preenchido' },
      { v: 'ok', rot: 'Confirmação', onde: 'XP dentro do orçamento, mensagem de sucesso' },
    ],
  },
];

export const TODAS_CORES: Cor[] = GRUPOS.flatMap((g) => g.cores);
const NOMES = new Set(TODAS_CORES.map((c) => c.v));

/** Pares em que uma cor é lida SOBRE a outra. É o que a página mede em contraste. */
export const PARES: Array<{ frente: string; fundo: string; rot: string; grande?: boolean }> = [
  { frente: 'ink', fundo: 'bg', rot: 'Texto sobre a página' },
  { frente: 'ink-soft', fundo: 'bg', rot: 'Texto secundário sobre a página' },
  { frente: 'ink', fundo: 'panel', rot: 'Texto sobre o painel' },
  { frente: 'ink-soft', fundo: 'panel', rot: 'Texto secundário sobre o painel' },
  { frente: 'link', fundo: 'bg', rot: 'Hiperlink sobre a página' },
  { frente: 'accent-texto', fundo: 'bg', rot: 'Destaque como texto sobre a página' },
  { frente: 'accent-texto', fundo: 'panel', rot: 'Destaque como texto sobre o painel' },
  { frente: 'on-accent', fundo: 'accent', rot: 'Texto sobre o Preenchimento' },
  { frente: 'on-accent-strong', fundo: 'accent-strong', rot: 'Texto sobre o Destaque forte' },
  { frente: 'on-perigo', fundo: 'perigo-bg', rot: 'Texto sobre o Perigo preenchido' },
  { frente: 'perigo', fundo: 'panel', rot: 'Perigo como texto sobre o painel' },
  { frente: 'gold', fundo: 'panel', rot: 'Ouro sobre o painel' },
  { frente: 'ok', fundo: 'panel', rot: 'Confirmação sobre o painel' },
];

/** Sobreposições por tema: { escuro: { ink: '#e9e5d7', … } }. Só o que saiu do padrão. */
export type CoresConfig = Partial<Record<Tema, Record<string, string>>>;

/* ---------- leitura e cálculo ---------- */

/** Normaliza para `#rrggbb` minúsculo; devolve '' se não for uma cor sólida legível. */
export function paraHex(valor: string): string {
  const v = (valor || '').trim();
  if (!v) return '';
  let m = /^#([0-9a-f]{3})$/i.exec(v);
  if (m) return ('#' + m[1].split('').map((c) => c + c).join('')).toLowerCase();
  m = /^#([0-9a-f]{6})$/i.exec(v);
  if (m) return v.toLowerCase();
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(v);
  if (m) return '#' + [1, 2, 3].map((i) => Math.round(Number(m![i])).toString(16).padStart(2, '0')).join('');
  return '';
}

export function rgbDe(hex: string): [number, number, number] {
  const h = paraHex(hex) || '#000000';
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

function luminancia([r, g, b]: [number, number, number]) {
  const s = [r, g, b].map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
}

/** Razão de contraste WCAG entre duas cores sólidas. */
export function contraste(a: string, b: string): number {
  const [x, y] = [luminancia(rgbDe(a)), luminancia(rgbDe(b))].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

/**
 * Os valores ORIGINAIS de um tema, lidos do global.css.
 *
 * O truque é a sonda: uma div com `data-theme` casa com o bloco do global.css
 * (`[data-theme='escuro']`) mas NÃO com a folha de sobreposição, que é
 * `html[data-theme='escuro']`. Então ela devolve sempre o padrão, mesmo com o
 * site inteiro repintado.
 */
export function coresPadrao(tema: Tema): Record<string, string> {
  const sonda = document.createElement('div');
  sonda.dataset.theme = tema;
  sonda.style.cssText = 'position:absolute;left:-9999px;width:0;height:0';
  document.body.appendChild(sonda);
  const cs = getComputedStyle(sonda);
  const fora: Record<string, string> = {};
  for (const c of TODAS_CORES) fora[c.v] = paraHex(cs.getPropertyValue('--' + c.v)) || '#000000';
  sonda.remove();
  return fora;
}

/** O `--select-arrow` é um SVG com a cor escrita dentro: repintado o tema, ele
 *  ficaria na cor antiga. Cada tema desenha a seta com um token diferente. */
const TOKEN_DA_SETA: Record<Tema, string> = { classico: 'accent-strong', escuro: 'accent', legivel: 'accent-strong' };

export function setaDoSelect(cor: string): string {
  const c = encodeURIComponent(paraHex(cor) || '#000000');
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='${c}' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;
}

export const ID_ESTILO_CORES = 'cfg-cores';

/** Monta o CSS da sobreposição. Devolve '' quando não há nada fora do padrão. */
export function cssDasCores(cores: CoresConfig | undefined): string {
  if (!cores) return '';
  const blocos: string[] = [];
  for (const tema of TEMAS) {
    const t = cores[tema];
    if (!t) continue;
    const linhas = Object.entries(t)
      .filter(([k, v]) => NOMES.has(k) && paraHex(v))
      .map(([k, v]) => `--${k}:${paraHex(v)}`);
    if (!linhas.length) continue;
    const seta = t[TOKEN_DA_SETA[tema]];
    if (seta && paraHex(seta)) linhas.push(`--select-arrow:${setaDoSelect(seta)}`);
    blocos.push(`html[data-theme='${tema}']{${linhas.join(';')}}`);
  }
  return blocos.join('\n');
}

/** Injeta (ou remove) a folha de sobreposição. Idempotente. */
export function aplicarCores(cores: CoresConfig | undefined) {
  const css = cssDasCores(cores);
  let tag = document.getElementById(ID_ESTILO_CORES) as HTMLStyleElement | null;
  if (!css) { tag?.remove(); return; }
  if (!tag) {
    tag = document.createElement('style');
    tag.id = ID_ESTILO_CORES;
    document.head.appendChild(tag);
  }
  tag.textContent = css;
}
