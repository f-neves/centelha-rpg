// Helpers de URL para funcionar sob o `base` do GitHub Pages (/centelha-rpg/).
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
  {
    // Como os capítulos II e XVI, o VII são cinco páginas: o link do capítulo abre a
    // primeira (a régua comum, que as outras quatro usam), e as cinco só aparecem na
    // barra lateral enquanto se está dentro dele.
    slug: 'regras/acoes-e-sistema', titulo: 'Ações & Sistema', numeral: 'VII',
    sub: [
      { slug: 'regras/acoes-e-sistema', titulo: 'A Régua Comum' },
      { slug: 'regras/acoes-corpo-e-movimento', titulo: 'Corpo e Movimento' },
      { slug: 'regras/acoes-resistir', titulo: 'Resistir' },
      { slug: 'regras/acoes-sentidos-e-engano', titulo: 'Sentidos & Engano' },
      { slug: 'regras/acoes-oficio-e-mundo', titulo: 'Ofício e Mundo' },
    ],
  },
  { slug: 'regras/combate', titulo: 'Combate Físico', numeral: 'VIII' },
  { slug: 'regras/relacoes-sociais', titulo: 'Relações Sociais', numeral: 'IX' },
  { slug: 'regras/defesas', titulo: 'As Três Defesas', numeral: 'X' },
  { slug: 'regras/quase-acerto', titulo: 'Quase-Acerto', numeral: 'XI' },
  { slug: 'regras/armas-e-armaduras', titulo: 'Armas & Armaduras', numeral: 'XII' },
  { slug: 'regras/custo-de-servico-e-itens', titulo: 'Custo de Serviço & Itens', numeral: 'XIII' },
  { slug: 'caminhos', titulo: 'As Proezas', numeral: 'XIV' },
  { slug: 'arcano', titulo: 'O Arcano', numeral: 'XV' },
  {
    // O capítulo XVI são três páginas. O link do capítulo abre a primeira delas, e as
    // três só aparecem na barra lateral enquanto se está dentro do capítulo.
    slug: 'artes/regras', titulo: 'As Artes', numeral: 'XVI',
    sub: [
      { slug: 'artes/regras', titulo: 'Regras' },
      { slug: 'artes/efeitos', titulo: 'Efeitos Especiais' },
      { slug: 'artes/catalogo', titulo: 'As 24 Artes' },
    ],
  },
  { slug: 'regras/folego', titulo: 'Fôlego', numeral: 'XVII' },
  { slug: 'regras/criacao-de-personagem', titulo: 'Criação de Personagem', numeral: 'XVIII' },
  { slug: 'regras/qual-sistema', titulo: 'Qual Sistema Eu Uso?', numeral: 'XIX' },
];

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
