# Progresso · revisão B14 fase 2

- Reancorada em `3d6c678` (branch `revisora`), 2026-09-26.
- Recebido texto verbatim dos dois despachos e do relato, lidos e conferidos item a item.
- Recontagem independente das 226/228 linhas da tabela de poderes por categoria "Vira": bate exatamente com a classificação do relato.
- proezaFutura: 45 entradas em 38 fichas, ordem de grandeza da estimativa do Arquiteto (~46).
- Negative control do z.union do poder natural (resiste ausente / resiste inválido): validate acusa nos dois sentidos.
- C.7 (Defesa Social Int 1): confirmado que é regra só de fera (defesas.md), ficha-engine.ts não precisa do desvio.
- C.9 (incorpóreos): texto correto nos 4, "arma comum ainda fere" presente.
- C.11: Vitalidade/atributos do Orc batem; Frenesi como texto (não poder natural) justificado pelo enum de periodo.
- Achado CORRIGE 1: recompensas.json._nota ainda "x3" com grupo:4 no pino (já corrigido depois, em 513f5a1, fora da faixa julgada).
- Achado CORRIGE 2: parágrafo da Horda (combate.md) com **markdown** dentro de HTML cru, aparece literal no dist.
- Nota 1: mon-roc (o exemplo do despacho) e mais 18 fichas no mesmo padrao ausentes de locomocao-fonte.md, não corrigidas (não é erro da Executora).
- Nota 2: herança de fraqueza por material (despacho item 4) não aplicada nos 9 construtos; valores já batem por coincidência com lib-materiais.mjs.
- Travessão zero nas linhas novas (Node sobre o diff completo). validate/build verdes. CI verde nos 4 commits da faixa (2c5530e, 2ac0d53, 3d6c678, 513f5a1).
- Veredito escrito: PROCEDE com 2 CORRIGE pequenos e 2 notas de acompanhamento.
