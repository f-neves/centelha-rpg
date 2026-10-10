// Migração de ids de ARMA numa ficha salva (sem DOM, para o `test-capitulo-armas.mjs` exercitar).
//
// O `RENOMES` do `ficha-engine.ts` cobre só as Habilidades secundárias (`S.skills2`), e o `RENOMES_ANTE`, os
// Antecedentes. Id de arma mora em outro lugar: o `ref` (`a:<id>`) dos slots de mão de cada conjunto, o `ref` das peças do
// arsenal e o legado `S.equip.arma`. Arma que sai do catálogo sem entrada aqui deixa de ser achada por `armaDoSlot`
// (equip.ts), e a mão aparece sem arma, calada.
//
// A Plumbata ocupa o lugar dos Dardos (D-076, D-085): o id `dardos` saiu do catálogo na rodada 1 sem alias. O `mod` do slot
// (dado, Acerto, dano ajustados pelo jogador) fica como está: é troca de id, não de números.
//
// LIMITE: isto roda quando a FICHA carrega. A mesa lê a ficha gravada direto do banco (`armaDoSlot`, congelado pela D-054),
// então uma ficha antiga com `a:dardos` só é consertada na mesa depois de alguém abri-la e salvá-la na ficha (N22).
export const RENOMES_ARMA: [string, string][] = [['dardos', 'plumbata']];

export function migrarRefsDeArma(S: any, tabela: [string, string][] = RENOMES_ARMA) {
  const mapa = new Map(tabela);
  const novo = (id: string) => mapa.get(id) ?? id;
  const ref = (r: any) => (typeof r === 'string' && r.startsWith('a:') ? 'a:' + novo(r.slice(2)) : r);
  if (S?.equip && typeof S.equip.arma === 'string') S.equip.arma = novo(S.equip.arma);
  for (const cj of Array.isArray(S?.conjuntos) ? S.conjuntos : []) {
    for (const mao of ['habil', 'inabil']) if (cj?.[mao]?.ref) cj[mao].ref = ref(cj[mao].ref);
  }
  for (const p of Array.isArray(S?.arsenal) ? S.arsenal : []) if (p?.ref) p.ref = ref(p.ref);
  return S;
}
