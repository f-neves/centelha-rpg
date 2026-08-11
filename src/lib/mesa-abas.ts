// As abas da área da mesa. Módulo próprio (e sem dependências) porque quem
// desenha a barra é um componente Astro, que roda no build: se ele importasse
// `mesa-core`, arrastaria o cliente do Supabase para dentro da renderização.
export interface Aba {
  id: string; slug: string; nome: string; icone: string; dica: string;
  /** Aba que só o mestre abre. O jogador não vê o botão e cai na aba inicial dele. */
  soMestre?: boolean;
}

// A ordem é a do uso: primeiro o painel do mestre, depois o grupo (que é o que
// se consulta o tempo todo), depois o combate. Grupo antes de Combate porque
// combate é a exceção da sessão e a ficha é a regra dela.
export const ABAS: Aba[] = [
  { id: 'escudo', slug: 'mesa', nome: 'Escudo', icone: '◈', dica: 'Painel rápido da campanha', soMestre: true },
  { id: 'grupo', slug: 'mesa/grupo', nome: 'Grupo', icone: '☗', dica: 'Personagens, membros e aprovação de fichas' },
  { id: 'combate', slug: 'mesa/combate', nome: 'Combate', icone: '⚔', dica: 'Rastreador de Ticks, dano e condições' },
  { id: 'criaturas', slug: 'mesa/criaturas', nome: 'Criaturas', icone: '☠', dica: 'O bestiário desta campanha' },
  { id: 'compendio', slug: 'mesa/compendio', nome: 'Compêndio', icone: '❦', dica: 'NPCs, lugares, facções, itens e ganchos' },
  { id: 'mapas', slug: 'mesa/mapas', nome: 'Mapas', icone: '⛰', dica: 'Mapas e cenas, com pinos' },
  { id: 'diario', slug: 'mesa/diario', nome: 'Diário', icone: '✎', dica: 'Sessões e anotações' },
  { id: 'arquivos', slug: 'mesa/arquivos', nome: 'Arquivos', icone: '⛁', dica: 'Handouts e documentos' },
  { id: 'referencia', slug: 'mesa/referencia', nome: 'Referência', icone: '§', dica: 'As tabelas do escudo' },
];

/** Onde o jogador entra, já que o Escudo é do mestre. */
export const ABA_JOGADOR = 'mesa/grupo';
