// Helpers de URL para funcionar sob o `base` do GitHub Pages (/centelha-rpg/).
import { MODULOS } from './modulos';
const BASE = import.meta.env.BASE_URL; // ex.: "/centelha-rpg/"

/** Prefixa um caminho interno com o base do site (sem barras duplicadas). */
export function url(p = ''): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const path = p.startsWith('/') ? p : `/${p}`;
  return p === '' || p === '/' ? `${base}/` : `${base}${path}`;
}

export const NAV = [
  { slug: '', titulo: 'Início', numeral: '' },
  { slug: 'regras/coracao-do-sistema', titulo: 'O Coração do Sistema', numeral: 'I' },
  {
    // Como o capítulo XVI, o II são três páginas: o link do capítulo abre a primeira, e
    // as três só aparecem na barra lateral enquanto se está dentro dele.
    slug: 'regras/atributos', titulo: 'Atributos & Habilidades', numeral: 'II',
    sub: [
      { slug: 'regras/atributos', titulo: 'Atributos' },
      { slug: 'regras/habilidades', titulo: 'Habilidades' },
      { slug: 'regras/habilidades-secundarias', titulo: 'Secundárias' },
    ],
  },
  { slug: 'regras/aparencia-virtudes-vontade', titulo: 'Aparência, Virtudes & Vontade', numeral: 'III' },
  { slug: 'regras/vida-ferimentos-cura', titulo: 'Vida, Ferimentos & Cura', numeral: 'IV' },
  { slug: 'regras/centelha', titulo: 'Centelha', numeral: 'V' },
  { slug: 'regras/racas', titulo: 'Raças', numeral: 'VI' },
  { slug: 'regras/antecedentes', titulo: 'Antecedentes', numeral: 'VII' },
  {
    // Como os capítulos II e XVII, o VIII são cinco páginas: o link do capítulo abre a
    // primeira (a régua comum, que as outras quatro usam), e as cinco só aparecem na
    // barra lateral enquanto se está dentro dele.
    slug: 'regras/acoes-e-sistema', titulo: 'Ações & Sistema', numeral: 'VIII',
    sub: [
      { slug: 'regras/acoes-e-sistema', titulo: 'A Régua Comum' },
      { slug: 'regras/acoes-corpo-e-movimento', titulo: 'Corpo e Movimento' },
      { slug: 'regras/acoes-resistir', titulo: 'Resistir' },
      { slug: 'regras/acoes-sentidos-e-engano', titulo: 'Sentidos & Engano' },
      { slug: 'regras/acoes-oficio-e-mundo', titulo: 'Ofício e Mundo' },
    ],
  },
  { slug: 'regras/combate', titulo: 'Combate Físico', numeral: 'IX' },
  { slug: 'regras/relacoes-sociais', titulo: 'Relações Sociais', numeral: 'X' },
  { slug: 'regras/defesas', titulo: 'As Três Defesas', numeral: 'XI' },
  { slug: 'regras/quase-acerto', titulo: 'Quase-Acerto', numeral: 'XII' },
  { slug: 'regras/armas-e-armaduras', titulo: 'Armas & Armaduras', numeral: 'XIII' },
  {
    // O XIV são cinco páginas desde a rodada 114, no padrão do VIII: o link do capítulo abre a
    // primeira (moeda, renda e custo de vida, que as outras quatro usam).
    slug: 'regras/custo-de-servico-e-itens', titulo: 'Custo de Serviço & Itens', numeral: 'XIV',
    sub: [
      { slug: 'regras/custo-de-servico-e-itens', titulo: 'Moeda, Renda e Custo de Vida' },
      { slug: 'regras/custo-servicos', titulo: 'Serviços e Contratação' },
      { slug: 'regras/custo-mercadorias', titulo: 'Mercadorias' },
      { slug: 'regras/custo-qualidade-e-equipamento', titulo: 'Qualidade e Equipamento' },
      { slug: 'regras/custo-montarias-e-viagens', titulo: 'Montarias, Veículos e Viagens' },
    ],
  },
  { slug: 'caminhos', titulo: 'As Proezas', numeral: 'XV' },
  { slug: 'arcano', titulo: 'O Arcano', numeral: 'XVI' },
  {
    // O capítulo XVII são três páginas. O link do capítulo abre a primeira delas, e as
    // três só aparecem na barra lateral enquanto se está dentro do capítulo.
    slug: 'artes/regras', titulo: 'As Artes', numeral: 'XVII',
    sub: [
      { slug: 'artes/regras', titulo: 'Regras' },
      { slug: 'artes/efeitos', titulo: 'Efeitos Especiais' },
      { slug: 'artes/catalogo', titulo: 'As 24 Artes' },
    ],
  },
  { slug: 'regras/criacao-de-personagem', titulo: 'Criação de Personagem', numeral: 'XVIII' },
  { slug: 'regras/qual-sistema', titulo: 'Qual Sistema Eu Uso?', numeral: 'XIX' },
  // Fôlego (XX) é módulo opcional: a página existe, mas só entra aqui com MODULOS.folego.
  ...(MODULOS.folego ? [{ slug: 'regras/folego', titulo: 'Fôlego', numeral: 'XX' }] : []),
];

/**
 * O numeral do capítulo, lido do `NAV` pelo slug, para as páginas `.astro` que não
 * pegam o numeral do frontmatter de um capítulo em markdown (`caminhos`, `arcano`,
 * `artes/regras`, `artes/efeitos`, `artes/catalogo`). Digitar o número à mão nessas
 * cinco páginas foi o que fez cinco numerais divergirem do `NAV` (C-38).
 */
export function numeralDe(slug: string): string {
  for (const item of NAV) {
    if (item.slug === slug) return item.numeral;
    if ('sub' in item && item.sub?.some((s) => s.slug === slug)) return item.numeral;
  }
  return '';
}

export const FERRAMENTAS = [
  { slug: 'mestre', titulo: 'Área do Mestre' },
  { slug: 'ficha', titulo: 'Ficha de Personagem' },
  { slug: 'bestiario', titulo: 'Bestiário & NPCs' },
  { slug: 'equipamentos', titulo: 'Equipamentos' },
  { slug: 'rolador', titulo: 'Rolador de Dados' },
  { slug: 'tecnicas', titulo: 'Técnicas (filtros)' },
  { slug: 'arvore', titulo: 'Árvores de Técnicas' },
  { slug: 'glossario', titulo: 'Glossário' },
  { slug: 'marcadores', titulo: 'Meus Marcadores' },
];
