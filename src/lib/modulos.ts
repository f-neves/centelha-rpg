// O que existe nos dados mas o site não oferece.
//
// O módulo Fôlego saiu do sistema em 03/10/2026 (D-016): o capítulo, a reserva, o número na
// ficha e na mesa e a coluna das armas foram removidos. As nove Técnicas da Proeza Coração
// Incansável que só funcionavam com ele (marcadas `modulo: "folego"` no `tecnicas.json`) e o
// campo `folego` das armas FICAM nos dados, ocultos e inertes, até o autor decidir o destino
// deles (pendência registrada). É esta função que as mantém fora da ficha e das listas.

/** A marca no dado controla a exibição; nome e texto não decidem. */
export function tecnicaDisponivel(tecnica: { modulo?: string }): boolean {
  return tecnica.modulo !== 'folego';
}
