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
  { slug: 'regras/aparencia-virtudes-vontade', titulo: 'Aparência, Virtudes & Vontade', numeral: 'III' },
  { slug: 'regras/vida-ferimentos-cura', titulo: 'Vida, Ferimentos & Cura', numeral: 'IV' },
  { slug: 'regras/centelha', titulo: 'Centelha', numeral: 'V' },
  { slug: 'regras/racas', titulo: 'Raças', numeral: 'VI' },
  { slug: 'regras/combate', titulo: 'Combate Físico', numeral: 'VII' },
  { slug: 'regras/relacoes-sociais', titulo: 'Combate e Relações Sociais', numeral: 'VIII' },
  { slug: 'regras/defesas', titulo: 'As Três Defesas', numeral: 'IX' },
  { slug: 'regras/quase-acerto', titulo: 'Quase-Acerto', numeral: 'X' },
  { slug: 'regras/armas-e-armaduras', titulo: 'Armas & Armaduras', numeral: 'XI' },
  { slug: 'regras/custo-de-servico-e-itens', titulo: 'Custo de Serviço & Itens', numeral: 'XII' },
  { slug: 'caminhos', titulo: 'As Proezas', numeral: 'XIII' },
  { slug: 'arcano', titulo: 'O Arcano', numeral: 'XIV' },
  { slug: 'regras/folego', titulo: 'Fôlego', numeral: 'XV' },
  { slug: 'regras/criacao-de-personagem', titulo: 'Criação de Personagem', numeral: 'XVI' },
  { slug: 'regras/qual-sistema', titulo: 'Qual Sistema Eu Uso?', numeral: 'XVII' },
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
