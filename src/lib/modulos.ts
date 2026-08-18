// Módulos opcionais do sistema: o que existe nas regras mas o site não mostra.
//
// Desligar um módulo NÃO apaga dado nenhum. Os JSONs continuam com os campos, as
// fórmulas de `calc.ts` continuam calculando e as fichas salvas continuam válidas:
// o que a bandeira controla é só o que aparece na tela (índice de capítulos, ficha,
// tabelas de equipamento, painéis da mesa). Ligar de volta é trocar `false` por `true`.
//
// `folego`: o capítulo XX é declaradamente um módulo avançado, e mostrar o número na
// ficha e a coluna nas tabelas de arma confunde quem joga sem ele. A página segue
// acessível pela URL (para os links dos outros capítulos não quebrarem), mas some
// da navegação e das ferramentas.
export const MODULOS = {
  folego: false,
} as const;
