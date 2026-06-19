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
  { slug: 'regras/atributos-e-pericias', titulo: 'Atributos & Habilidades', numeral: 'II' },
  { slug: 'regras/centelha-virtudes-vontade', titulo: 'Centelha, Virtudes, Vontade & Fôlego', numeral: 'III' },
  { slug: 'regras/combate', titulo: 'Combate', numeral: 'IV' },
  { slug: 'regras/quase-acerto', titulo: 'Quase-Acerto', numeral: 'V' },
  { slug: 'regras/vida-ferimentos-cura', titulo: 'Vida, Ferimentos & Cura', numeral: 'VI' },
  { slug: 'caminhos', titulo: 'As Proezas', numeral: 'VII' },
  { slug: 'arcano', titulo: 'O Arcano', numeral: 'VIII' },
  { slug: 'regras/armas-e-armaduras', titulo: 'Armas & Armaduras', numeral: 'IX' },
  { slug: 'regras/criacao-de-personagem', titulo: 'Criação de Personagem', numeral: 'X' },
];

export const FERRAMENTAS = [
  { slug: 'ficha', titulo: 'Ficha de Personagem' },
  { slug: 'bestiario', titulo: 'Bestiário & NPCs' },
  { slug: 'equipamentos', titulo: 'Equipamentos' },
  { slug: 'rolador', titulo: 'Rolador de Dados' },
  { slug: 'tecnicas', titulo: 'Técnicas (filtros)' },
  { slug: 'artes', titulo: 'Artes do Arcano' },
  { slug: 'arvore', titulo: 'Árvores de Técnicas' },
  { slug: 'glossario', titulo: 'Glossário' },
  { slug: 'marcadores', titulo: 'Meus Marcadores' },
];
