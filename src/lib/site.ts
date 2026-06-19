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
  { slug: 'regras/virtudes-vontade-folego', titulo: 'Virtudes, Vontade & Fôlego', numeral: 'III' },
  { slug: 'regras/centelha', titulo: 'Centelha', numeral: 'IV' },
  { slug: 'regras/combate', titulo: 'Combate', numeral: 'V' },
  { slug: 'regras/quase-acerto', titulo: 'Quase-Acerto', numeral: 'VI' },
  { slug: 'regras/vida-ferimentos-cura', titulo: 'Vida, Ferimentos & Cura', numeral: 'VII' },
  { slug: 'caminhos', titulo: 'As Proezas', numeral: 'VIII' },
  { slug: 'arcano', titulo: 'O Arcano', numeral: 'IX' },
  { slug: 'regras/armas-e-armaduras', titulo: 'Armas & Armaduras', numeral: 'X' },
  { slug: 'regras/criacao-de-personagem', titulo: 'Criação de Personagem', numeral: 'XI' },
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
