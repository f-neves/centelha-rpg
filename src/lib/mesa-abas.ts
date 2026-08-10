// As abas da área da mesa. Módulo próprio (e sem dependências) porque quem
// desenha a barra é um componente Astro, que roda no build: se ele importasse
// `mesa-core`, arrastaria o cliente do Supabase para dentro da renderização.
export interface Aba { id: string; slug: string; nome: string; icone: string; dica: string }

export const ABAS: Aba[] = [
  { id: 'escudo', slug: 'mesa', nome: 'Escudo', icone: '◈', dica: 'Painel rápido da campanha' },
  { id: 'combate', slug: 'mesa/combate', nome: 'Combate', icone: '⚔', dica: 'Rastreador de Ticks, dano e condições' },
  { id: 'grupo', slug: 'mesa/grupo', nome: 'Grupo', icone: '☗', dica: 'Personagens, membros e aprovação de fichas' },
  { id: 'criaturas', slug: 'mesa/criaturas', nome: 'Criaturas', icone: '☠', dica: 'O bestiário desta campanha' },
  { id: 'compendio', slug: 'mesa/compendio', nome: 'Compêndio', icone: '❦', dica: 'NPCs, lugares, facções, itens e ganchos' },
  { id: 'mapas', slug: 'mesa/mapas', nome: 'Mapas', icone: '⛰', dica: 'Mapas e cenas, com pinos' },
  { id: 'diario', slug: 'mesa/diario', nome: 'Diário', icone: '✎', dica: 'Sessões e anotações' },
  { id: 'arquivos', slug: 'mesa/arquivos', nome: 'Arquivos', icone: '⛁', dica: 'Handouts e documentos' },
  { id: 'referencia', slug: 'mesa/referencia', nome: 'Referência', icone: '§', dica: 'As tabelas do escudo' },
];
