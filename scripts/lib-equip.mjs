// O JSON guarda o item no envelope ANINHADO (`{ id, nome, tipo, preco, ..., arma: {...},
// armadura: null, escudo: null }`, decidido em leitura-de-novato-decisoes.md §5). Os
// scripts de simulação/geração sempre leram o formato PLANO (`w.dado`, `a.soak.impacto`,
// `s.bloqCaC`) direto de `armas.json`/`armaduras.json`/`escudos.json`: achatar aqui, uma vez
// só, evita repetir a migração em cada script — o mesmo motivo de `achata()` em
// `src/lib/equip.ts`, que é o par deste arquivo do lado do `src/`.
export function achataItem(item) {
  const bloco = item.arma ?? item.armadura ?? item.escudo ?? item.municao ?? {};
  const { arma, armadura, escudo, municao, ...raiz } = item;
  return { ...raiz, ...bloco, notas: raiz.descricao };
}

export function achataCatalogo(lista) {
  return lista.map(achataItem);
}
