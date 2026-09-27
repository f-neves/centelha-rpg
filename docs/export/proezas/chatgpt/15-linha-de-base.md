# 15 · Linha de base do combate no motor real

27/09/2026 · **MEDIÇÃO**, sem mudança de regra. 120 lutas por célula fiel, semente mestre 20260927. A camada rápida enumera exatamente as distribuições de d6; a fiel usa `motor.mjs`, `lance.ts` e as fórmulas de `calc.ts` trazidas por `lib-ponte.mjs`.

## 1. Método e limites

Fichas sem Proezas: soma 6/8/12 dividida igualmente entre Atributo e Habilidade; Vigor 3; mesma ficha em C0–C6. A espada longa ocupa uma mão, com adaga inativa na outra apenas para acionar a fórmula viva de uma mão; Montante usa duas. Armadura nenhuma/Gambeson/Malha. Todos começam adjacentes; a luta vai até um lado cair, sem fuga ou desistência automáticas. Empate de iniciativa varia pela semente.

Camada exata: Defesa cheia e golpes independentes, mas preserva pool, paridade, Acerto da arma, Margens, Quase-Acerto, dano e Absorção. Ela não modela P/G/R, Pressão, ferimentos, iniciativa ou simultaneidade. “Ações” nela são tentativas do atacante. Camada fiel: todas essas regras operam; “ações até cair” contam golpes do lado que derrubou o oponente.

Os documentos pedidos existem nesta árvore em `docs/export/proezas/chatgpt/09-inventario-calculos.md` e `14-levantamento-pesos.md`; os caminhos sem `chatgpt/` estavam ausentes durante a execução. O primeiro também aparecia removido por outra frente, e não foi restaurado.

## 2. A · Defesa perdida no golpe

Valores são módulos positivos da perda total P/G/R + Pressão observada na entrada real de `resolverGolpe`.

| formato | soma | C | média | p10/p50/p90 | golpes |
|---|---|---|---|---|---|
| duelo | 6 | 1 | 2,28 | 2/2/4 | 3555 |
| duelo | 6 | 3 | 2,33 | 2/2/4 | 5652 |
| duelo | 6 | 5 | 2,76 | 2/2/4 | 11259 |
| duelo | 8 | 1 | 2,24 | 2/2/4 | 2871 |
| duelo | 8 | 3 | 2,26 | 2/2/4 | 4610 |
| duelo | 8 | 5 | 2,32 | 2/2/4 | 6879 |
| duelo | 12 | 1 | 2,23 | 2/2/4 | 2151 |
| duelo | 12 | 3 | 2,25 | 2/2/4 | 3180 |
| duelo | 12 | 5 | 2,25 | 2/2/4 | 4786 |
| 1 contra 3 | 6 | 1 | 4,63 | 2/4/8 | 3044 |
| 1 contra 3 | 6 | 3 | 4,66 | 2/4/8 | 7435 |
| 1 contra 3 | 6 | 5 | 4,68 | 2/4/8 | 64326 |
| 1 contra 3 | 8 | 1 | 4,61 | 2/4/8 | 2216 |
| 1 contra 3 | 8 | 3 | 4,63 | 2/4/8 | 4519 |
| 1 contra 3 | 8 | 5 | 4,62 | 2/4/8 | 11886 |
| 1 contra 3 | 12 | 1 | 4,59 | 2/4/8 | 1448 |
| 1 contra 3 | 12 | 3 | 4,60 | 2/4/8 | 2259 |
| 1 contra 3 | 12 | 5 | 4,63 | 2/4/8 | 4280 |


## 3. B · Linha de base entre iguais

Colunas finais “ex.” são a camada rápida com Defesa cheia.

| soma | C | arma | armadura | acerto fiel | raspão fiel | dano/tent. | ações p10/p50/p90 | censura | dano ex. | ações ex. |
|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 0 | espada-longa | nenhuma | 60,6% | 19,7% | 4,79 | 5/6/7 | 0,0% | 3,44 | 7/10/14 |
| 6 | 0 | espada-longa | gambeson | 62,8% | 27,6% | 2,69 | 10/12/14 | 0,0% | 2,40 | 11/14/19 |
| 6 | 0 | espada-longa | malha | 63,3% | 30,0% | 0,63 | 31/41/55 | 0,0% | 0,38 | 66/91/122 |
| 6 | 0 | montante | nenhuma | 50,6% | 10,2% | 7,18 | 3/3/5 | 0,0% | 4,06 | 5/9/16 |
| 6 | 0 | montante | gambeson | 51,4% | 20,9% | 5,89 | 4/5/6 | 0,0% | 3,78 | 6/9/15 |
| 6 | 0 | montante | malha | 50,0% | 31,0% | 4,17 | 5/6/8 | 0,0% | 2,55 | 9/14/20 |
| 6 | 1 | espada-longa | nenhuma | 62,1% | 18,8% | 4,17 | 6/7/8 | 0,0% | 3,06 | 8/11/16 |
| 6 | 1 | espada-longa | gambeson | 63,8% | 25,6% | 2,10 | 12/15/18 | 0,0% | 2,09 | 13/17/22 |
| 6 | 1 | espada-longa | malha | 63,4% | 29,9% | 0,31 | 63/83/107 | 0,0% | 0,19 | 136/180/>200 |
| 6 | 1 | montante | nenhuma | 51,5% | 10,3% | 6,79 | 3/4/6 | 0,0% | 3,81 | 5/10/16 |
| 6 | 1 | montante | gambeson | 51,5% | 22,0% | 5,41 | 4/5/7 | 0,0% | 3,52 | 7/10/15 |
| 6 | 1 | montante | malha | 51,2% | 29,1% | 3,71 | 5/7/10 | 0,0% | 2,29 | 10/15/22 |
| 6 | 2 | espada-longa | nenhuma | 62,3% | 19,3% | 3,60 | 7/8/10 | 0,0% | 2,69 | 10/13/18 |
| 6 | 2 | espada-longa | gambeson | 64,8% | 26,2% | 1,71 | 15/18/23 | 0,0% | 1,84 | 14/19/25 |
| 6 | 2 | espada-longa | malha | 64,6% | 30,6% | 0,11 | 143/143/143 | 99,2% | 0,06 | >200/>200/>200 |
| 6 | 2 | montante | nenhuma | 51,0% | 9,9% | 6,22 | 3/4/6 | 0,0% | 3,55 | 6/10/17 |
| 6 | 2 | montante | gambeson | 50,3% | 23,2% | 4,96 | 5/6/7 | 0,0% | 3,26 | 7/11/16 |
| 6 | 2 | montante | malha | 51,9% | 28,5% | 3,17 | 7/9/11 | 0,0% | 2,03 | 12/17/24 |
| 6 | 3 | espada-longa | nenhuma | 62,1% | 20,6% | 3,02 | 8/10/12 | 0,0% | 2,31 | 11/15/20 |
| 6 | 3 | espada-longa | gambeson | 64,9% | 25,7% | 1,36 | 17/24/30 | 0,0% | 1,65 | 15/21/28 |
| 6 | 3 | espada-longa | malha | 65,1% | 30,7% | 0,00 | não concluiu | 100,0% | 0,00 | >200/>200/>200 |
| 6 | 3 | montante | nenhuma | 50,9% | 10,9% | 5,77 | 3/4/6 | 0,0% | 3,29 | 6/11/18 |
| 6 | 3 | montante | gambeson | 50,4% | 23,2% | 4,46 | 5/6/8 | 0,0% | 3,00 | 8/12/17 |
| 6 | 3 | montante | malha | 51,9% | 30,0% | 2,70 | 8/10/13 | 0,0% | 1,78 | 14/20/27 |
| 6 | 4 | espada-longa | nenhuma | 62,4% | 19,9% | 2,36 | 10/13/16 | 0,0% | 1,94 | 13/18/24 |
| 6 | 4 | espada-longa | gambeson | 66,6% | 24,9% | 1,10 | 22/27/43 | 0,0% | 1,53 | 16/23/31 |
| 6 | 4 | espada-longa | malha | 65,1% | 30,7% | 0,00 | não concluiu | 100,0% | 0,00 | >200/>200/>200 |
| 6 | 4 | montante | nenhuma | 50,4% | 11,4% | 5,27 | 4/5/7 | 0,0% | 3,03 | 7/12/19 |
| 6 | 4 | montante | gambeson | 50,8% | 22,2% | 3,92 | 6/7/9 | 0,0% | 2,74 | 9/13/19 |
| 6 | 4 | montante | malha | 51,7% | 29,4% | 2,23 | 9/13/16 | 0,0% | 1,54 | 16/23/30 |
| 6 | 5 | espada-longa | nenhuma | 63,9% | 18,2% | 1,82 | 13/17/20 | 0,0% | 1,63 | 16/21/29 |
| 6 | 5 | espada-longa | gambeson | 74,8% | 17,9% | 0,72 | 24/32/41 | 13,3% | 1,46 | 17/24/33 |
| 6 | 5 | espada-longa | malha | 65,1% | 30,7% | 0,00 | não concluiu | 100,0% | 0,00 | >200/>200/>200 |
| 6 | 5 | montante | nenhuma | 51,6% | 10,4% | 4,78 | 4/5/8 | 0,0% | 2,77 | 8/13/20 |
| 6 | 5 | montante | gambeson | 51,3% | 21,0% | 3,30 | 7/8/11 | 0,0% | 2,49 | 9/14/20 |
| 6 | 5 | montante | malha | 51,6% | 30,7% | 1,77 | 12/16/20 | 0,0% | 1,32 | 20/26/34 |
| 6 | 6 | espada-longa | nenhuma | 64,3% | 19,1% | 1,42 | 17/21/27 | 0,0% | 1,38 | 18/25/34 |
| 6 | 6 | espada-longa | gambeson | 74,8% | 17,9% | 0,72 | 24/32/41 | 13,3% | 1,46 | 17/24/33 |
| 6 | 6 | espada-longa | malha | 65,1% | 30,7% | 0,00 | não concluiu | 100,0% | 0,00 | >200/>200/>200 |
| 6 | 6 | montante | nenhuma | 51,2% | 11,3% | 4,30 | 5/6/8 | 0,0% | 2,51 | 9/14/22 |
| 6 | 6 | montante | gambeson | 51,3% | 21,0% | 2,89 | 8/10/12 | 0,0% | 2,25 | 10/15/23 |
| 6 | 6 | montante | malha | 52,4% | 31,1% | 1,45 | 15/20/26 | 0,0% | 1,13 | 23/30/39 |
| 8 | 0 | espada-longa | nenhuma | 56,7% | 16,1% | 4,92 | 5/6/7 | 0,0% | 3,40 | 7/10/15 |
| 8 | 0 | espada-longa | gambeson | 57,0% | 26,8% | 3,09 | 8/10/11 | 0,0% | 2,49 | 11/14/18 |
| 8 | 0 | espada-longa | malha | 57,2% | 30,5% | 0,94 | 19/26/36 | 0,0% | 0,56 | 43/61/84 |
| 8 | 0 | montante | nenhuma | 47,3% | 9,2% | 7,70 | 3/3/5 | 0,0% | 4,17 | 4/9/16 |
| 8 | 0 | montante | gambeson | 47,5% | 19,2% | 6,38 | 3/4/6 | 0,0% | 3,86 | 5/9/15 |
| 8 | 0 | montante | malha | 47,7% | 26,3% | 4,89 | 4/6/8 | 0,0% | 2,79 | 8/13/20 |
| 8 | 1 | espada-longa | nenhuma | 57,2% | 15,8% | 4,36 | 5/6/8 | 0,0% | 3,06 | 8/11/17 |
| 8 | 1 | espada-longa | gambeson | 57,5% | 25,7% | 2,49 | 10/12/14 | 0,0% | 2,15 | 12/16/21 |
| 8 | 1 | espada-longa | malha | 56,9% | 31,5% | 0,57 | 33/44/60 | 0,0% | 0,34 | 73/101/136 |
| 8 | 1 | montante | nenhuma | 47,3% | 8,9% | 7,20 | 3/4/5 | 0,0% | 3,93 | 5/9/17 |
| 8 | 1 | montante | gambeson | 46,7% | 20,7% | 5,94 | 4/5/6 | 0,0% | 3,62 | 6/10/16 |
| 8 | 1 | montante | malha | 47,2% | 27,0% | 4,36 | 4/6/9 | 0,0% | 2,55 | 9/14/21 |
| 8 | 2 | espada-longa | nenhuma | 56,8% | 16,2% | 3,79 | 6/7/9 | 0,0% | 2,73 | 9/13/18 |
| 8 | 2 | espada-longa | gambeson | 57,8% | 26,1% | 2,01 | 13/15/18 | 0,0% | 1,87 | 14/18/25 |
| 8 | 2 | espada-longa | malha | 57,6% | 31,2% | 0,29 | 70/93/116 | 0,0% | 0,17 | 152/>200/>200 |
| 8 | 2 | montante | nenhuma | 47,1% | 9,1% | 6,73 | 3/4/6 | 0,0% | 3,69 | 5/10/18 |
| 8 | 2 | montante | gambeson | 46,6% | 20,9% | 5,52 | 4/5/7 | 0,0% | 3,38 | 6/11/17 |
| 8 | 2 | montante | malha | 47,6% | 26,6% | 3,88 | 5/7/9 | 0,0% | 2,31 | 10/15/23 |
| 8 | 3 | espada-longa | nenhuma | 56,7% | 18,2% | 3,31 | 7/9/11 | 0,0% | 2,39 | 10/15/20 |
| 8 | 3 | espada-longa | gambeson | 57,9% | 26,0% | 1,61 | 15/19/24 | 0,0% | 1,65 | 15/21/28 |
| 8 | 3 | espada-longa | malha | 58,2% | 32,7% | 0,10 | não concluiu | 100,0% | 0,06 | >200/>200/>200 |
| 8 | 3 | montante | nenhuma | 47,0% | 9,6% | 6,28 | 3/4/6 | 0,0% | 3,45 | 6/10/18 |
| 8 | 3 | montante | gambeson | 47,1% | 19,8% | 5,02 | 4/6/7 | 0,0% | 3,14 | 7/11/17 |
| 8 | 3 | montante | malha | 47,3% | 27,6% | 3,40 | 5/8/11 | 0,0% | 2,07 | 11/17/25 |
| 8 | 4 | espada-longa | nenhuma | 57,4% | 17,6% | 2,73 | 9/11/13 | 0,0% | 2,06 | 12/17/23 |
| 8 | 4 | espada-longa | gambeson | 58,8% | 25,0% | 1,29 | 17/24/32 | 0,0% | 1,48 | 17/23/32 |
| 8 | 4 | espada-longa | malha | 58,5% | 32,9% | 0,00 | não concluiu | 100,0% | 0,00 | >200/>200/>200 |
| 8 | 4 | montante | nenhuma | 47,3% | 10,1% | 5,81 | 3/5/6 | 0,0% | 3,21 | 6/11/19 |
| 8 | 4 | montante | gambeson | 47,9% | 18,2% | 4,45 | 5/6/8 | 0,0% | 2,90 | 8/12/19 |
| 8 | 4 | montante | malha | 46,2% | 28,3% | 2,92 | 6/10/12 | 0,0% | 1,83 | 13/19/27 |
| 8 | 5 | espada-longa | nenhuma | 58,2% | 17,1% | 2,13 | 11/13/17 | 0,0% | 1,72 | 15/20/27 |
| 8 | 5 | espada-longa | gambeson | 58,7% | 25,4% | 1,11 | 20/27/39 | 0,0% | 1,37 | 18/25/35 |
| 8 | 5 | espada-longa | malha | 58,5% | 32,9% | 0,00 | não concluiu | 100,0% | 0,00 | >200/>200/>200 |
| 8 | 5 | montante | nenhuma | 47,2% | 9,8% | 5,33 | 4/5/7 | 0,0% | 2,97 | 7/12/20 |
| 8 | 5 | montante | gambeson | 48,0% | 18,4% | 4,03 | 5/7/9 | 0,0% | 2,66 | 9/13/20 |
| 8 | 5 | montante | malha | 46,6% | 28,4% | 2,47 | 8/11/15 | 0,0% | 1,60 | 15/22/30 |
| 8 | 6 | espada-longa | nenhuma | 58,1% | 17,8% | 1,67 | 13/17/22 | 0,0% | 1,44 | 17/24/33 |
| 8 | 6 | espada-longa | gambeson | 59,9% | 25,1% | 1,00 | 23/31/44 | 0,0% | 1,31 | 19/27/37 |
| 8 | 6 | espada-longa | malha | 58,5% | 32,9% | 0,00 | não concluiu | 100,0% | 0,00 | >200/>200/>200 |
| 8 | 6 | montante | nenhuma | 47,4% | 10,2% | 4,93 | 4/5/7 | 0,0% | 2,73 | 7/13/21 |
| 8 | 6 | montante | gambeson | 48,0% | 18,3% | 3,54 | 6/8/10 | 0,0% | 2,42 | 9/14/21 |
| 8 | 6 | montante | malha | 47,0% | 28,3% | 2,01 | 10/14/18 | 0,0% | 1,38 | 18/25/34 |
| 12 | 0 | espada-longa | nenhuma | 49,0% | 15,0% | 5,25 | 4/5/7 | 0,0% | 3,35 | 6/11/17 |
| 12 | 0 | espada-longa | gambeson | 46,9% | 23,9% | 3,57 | 6/8/9 | 0,0% | 2,60 | 9/13/19 |
| 12 | 0 | espada-longa | malha | 47,4% | 30,8% | 1,69 | 10/14/19 | 0,0% | 0,98 | 23/35/51 |
| 12 | 0 | montante | nenhuma | 38,1% | 7,8% | 7,70 | 2/3/5 | 0,0% | 4,35 | 3/8/17 |
| 12 | 0 | montante | gambeson | 40,7% | 14,6% | 6,92 | 3/4/6 | 0,0% | 4,03 | 5/9/16 |
| 12 | 0 | montante | malha | 38,3% | 25,0% | 5,45 | 3/4/7 | 0,0% | 3,17 | 6/12/20 |
| 12 | 1 | espada-longa | nenhuma | 47,9% | 15,8% | 4,73 | 4/6/8 | 0,0% | 3,07 | 7/12/18 |
| 12 | 1 | espada-longa | gambeson | 47,4% | 23,9% | 3,13 | 7/9/11 | 0,0% | 2,33 | 11/15/21 |
| 12 | 1 | espada-longa | malha | 47,9% | 30,7% | 1,20 | 14/20/29 | 0,0% | 0,70 | 33/49/70 |
| 12 | 1 | montante | nenhuma | 37,9% | 8,2% | 7,30 | 2/3/6 | 0,0% | 4,15 | 4/9/18 |
| 12 | 1 | montante | gambeson | 40,1% | 16,1% | 6,50 | 3/4/6 | 0,0% | 3,83 | 5/10/17 |
| 12 | 1 | montante | malha | 38,1% | 25,2% | 5,03 | 3/5/8 | 0,0% | 2,97 | 6/12/21 |
| 12 | 2 | espada-longa | nenhuma | 48,6% | 15,1% | 4,28 | 5/6/8 | 0,0% | 2,79 | 8/13/19 |
| 12 | 2 | espada-longa | gambeson | 47,8% | 23,4% | 2,64 | 9/11/13 | 0,0% | 2,05 | 12/17/23 |
| 12 | 2 | espada-longa | malha | 47,6% | 30,4% | 0,80 | 23/32/41 | 0,0% | 0,47 | 51/73/102 |
| 12 | 2 | montante | nenhuma | 38,1% | 7,9% | 6,94 | 2/3/6 | 0,0% | 3,94 | 4/9/18 |
| 12 | 2 | montante | gambeson | 38,9% | 17,4% | 6,08 | 3/4/6 | 0,0% | 3,62 | 5/10/17 |
| 12 | 2 | montante | malha | 38,8% | 25,4% | 4,74 | 3/5/8 | 0,0% | 2,76 | 7/13/22 |
| 12 | 3 | espada-longa | nenhuma | 47,8% | 15,7% | 3,75 | 6/7/9 | 0,0% | 2,51 | 9/14/21 |
| 12 | 3 | espada-longa | gambeson | 47,2% | 24,1% | 2,17 | 11/13/17 | 0,0% | 1,77 | 14/20/27 |
| 12 | 3 | espada-longa | malha | 47,2% | 31,7% | 0,47 | 39/55/70 | 0,0% | 0,28 | 87/122/164 |
| 12 | 3 | montante | nenhuma | 39,3% | 7,7% | 6,73 | 2/4/6 | 0,0% | 3,73 | 5/10/19 |
| 12 | 3 | montante | gambeson | 38,8% | 17,8% | 5,68 | 3/4/7 | 0,0% | 3,41 | 6/11/18 |
| 12 | 3 | montante | malha | 39,3% | 24,2% | 4,41 | 4/6/8 | 0,0% | 2,55 | 8/14/23 |
| 12 | 4 | espada-longa | nenhuma | 46,7% | 17,0% | 3,28 | 7/8/10 | 0,0% | 2,23 | 11/16/23 |
| 12 | 4 | espada-longa | gambeson | 46,7% | 25,7% | 1,83 | 13/16/21 | 0,0% | 1,53 | 16/22/31 |
| 12 | 4 | espada-longa | malha | 47,6% | 31,6% | 0,24 | 82/104/128 | 8,3% | 0,14 | 182/>200/>200 |
| 12 | 4 | montante | nenhuma | 39,9% | 7,4% | 6,37 | 3/4/6 | 0,0% | 3,53 | 5/10/20 |
| 12 | 4 | montante | gambeson | 38,4% | 17,3% | 5,21 | 3/5/7 | 0,0% | 3,21 | 6/11/19 |
| 12 | 4 | montante | malha | 38,7% | 24,5% | 4,00 | 4/6/9 | 0,0% | 2,35 | 9/15/24 |
| 12 | 5 | espada-longa | nenhuma | 47,0% | 15,9% | 2,76 | 7/10/12 | 0,0% | 1,95 | 12/18/25 |
| 12 | 5 | espada-longa | gambeson | 47,3% | 25,3% | 1,49 | 16/19/25 | 0,0% | 1,35 | 18/26/35 |
| 12 | 5 | espada-longa | malha | 47,9% | 33,0% | 0,08 | não concluiu | 100,0% | 0,05 | >200/>200/>200 |
| 12 | 5 | montante | nenhuma | 39,7% | 8,0% | 5,97 | 3/4/6 | 0,0% | 3,32 | 5/11/20 |
| 12 | 5 | montante | gambeson | 38,5% | 18,0% | 4,90 | 4/5/8 | 0,0% | 3,00 | 7/12/20 |
| 12 | 5 | montante | malha | 38,1% | 25,3% | 3,58 | 5/7/10 | 0,0% | 2,14 | 10/17/26 |
| 12 | 6 | espada-longa | nenhuma | 46,7% | 16,4% | 2,34 | 9/11/15 | 0,0% | 1,67 | 15/21/29 |
| 12 | 6 | espada-longa | gambeson | 47,7% | 24,7% | 1,24 | 19/24/31 | 0,0% | 1,21 | 20/28/40 |
| 12 | 6 | espada-longa | malha | 48,0% | 33,0% | 0,00 | não concluiu | 100,0% | 0,00 | >200/>200/>200 |
| 12 | 6 | montante | nenhuma | 39,2% | 8,2% | 5,56 | 3/4/7 | 0,0% | 3,12 | 6/12/21 |
| 12 | 6 | montante | gambeson | 39,5% | 16,6% | 4,53 | 4/6/8 | 0,0% | 2,80 | 7/13/20 |
| 12 | 6 | montante | malha | 38,8% | 24,9% | 3,21 | 6/8/11 | 0,0% | 1,94 | 11/18/28 |


## 4. C · Degrau automático de Centelha

Razão de ações = média para derrubar o igual C=X dividida pela média de X+1 para derrubar X. Acima de 1 favorece X+1.

| soma | confronto | arma | armadura | vitória X+1 | censura | razão ações |
|---|---|---|---|---|---|---|
| 6 | 1×0 | espada-longa | nenhuma | 87,5% | 0,0% | 0,99 |
| 6 | 1×0 | espada-longa | gambeson | 79,2% | 0,0% | 0,92 |
| 6 | 1×0 | espada-longa | malha | 98,3% | 0,0% | 1,04 |
| 6 | 1×0 | montante | nenhuma | 77,5% | 0,0% | 1,02 |
| 6 | 1×0 | montante | gambeson | 81,7% | 0,0% | 1,01 |
| 6 | 1×0 | montante | malha | 85,0% | 0,0% | 1,00 |
| 6 | 2×1 | espada-longa | nenhuma | 86,7% | 0,0% | 0,99 |
| 6 | 2×1 | espada-longa | gambeson | 66,7% | 0,0% | 0,91 |
| 6 | 2×1 | espada-longa | malha | 100,0% | 0,0% | 1,06 |
| 6 | 2×1 | montante | nenhuma | 78,3% | 0,0% | 1,00 |
| 6 | 2×1 | montante | gambeson | 81,7% | 0,0% | 0,99 |
| 6 | 2×1 | montante | malha | 85,0% | 0,0% | 0,99 |
| 6 | 3×2 | espada-longa | nenhuma | 92,5% | 0,0% | 0,97 |
| 6 | 3×2 | espada-longa | gambeson | 63,3% | 0,0% | 0,91 |
| 6 | 3×2 | espada-longa | malha | n/d | 100,0% | n/d |
| 6 | 3×2 | montante | nenhuma | 81,7% | 0,0% | 1,00 |
| 6 | 3×2 | montante | gambeson | 83,3% | 0,0% | 0,98 |
| 6 | 3×2 | montante | malha | 89,2% | 0,0% | 0,97 |
| 6 | 4×3 | espada-longa | nenhuma | 90,0% | 0,0% | 0,97 |
| 6 | 4×3 | espada-longa | gambeson | 45,8% | 0,0% | 0,90 |
| 6 | 4×3 | espada-longa | malha | n/d | 100,0% | n/d |
| 6 | 4×3 | montante | nenhuma | 81,7% | 0,0% | 0,98 |
| 6 | 4×3 | montante | gambeson | 81,7% | 0,0% | 0,96 |
| 6 | 4×3 | montante | malha | 92,5% | 0,0% | 0,98 |
| 6 | 5×4 | espada-longa | nenhuma | 85,0% | 0,0% | 0,94 |
| 6 | 5×4 | espada-longa | gambeson | 45,0% | 0,0% | 0,92 |
| 6 | 5×4 | espada-longa | malha | n/d | 100,0% | n/d |
| 6 | 5×4 | montante | nenhuma | 82,5% | 0,0% | 1,01 |
| 6 | 5×4 | montante | gambeson | 81,7% | 0,0% | 0,95 |
| 6 | 5×4 | montante | malha | 91,7% | 0,0% | 0,94 |
| 6 | 6×5 | espada-longa | nenhuma | 76,7% | 0,0% | 0,92 |
| 6 | 6×5 | espada-longa | gambeson | 0,0% | 12,5% | 1,04 |
| 6 | 6×5 | espada-longa | malha | n/d | 100,0% | n/d |
| 6 | 6×5 | montante | nenhuma | 85,8% | 0,0% | 1,00 |
| 6 | 6×5 | montante | gambeson | 80,8% | 0,0% | 0,94 |
| 6 | 6×5 | montante | malha | 88,3% | 0,0% | 0,99 |
| 8 | 1×0 | espada-longa | nenhuma | 85,0% | 0,0% | 0,99 |
| 8 | 1×0 | espada-longa | gambeson | 85,8% | 0,0% | 0,94 |
| 8 | 1×0 | espada-longa | malha | 99,2% | 0,0% | 1,01 |
| 8 | 1×0 | montante | nenhuma | 78,3% | 0,0% | 1,03 |
| 8 | 1×0 | montante | gambeson | 76,7% | 0,0% | 1,02 |
| 8 | 1×0 | montante | malha | 83,3% | 0,0% | 1,01 |
| 8 | 2×1 | espada-longa | nenhuma | 84,2% | 0,0% | 0,99 |
| 8 | 2×1 | espada-longa | gambeson | 85,0% | 0,0% | 0,92 |
| 8 | 2×1 | espada-longa | malha | 100,0% | 0,0% | 1,02 |
| 8 | 2×1 | montante | nenhuma | 80,8% | 0,0% | 1,03 |
| 8 | 2×1 | montante | gambeson | 80,0% | 0,0% | 1,01 |
| 8 | 2×1 | montante | malha | 82,5% | 0,0% | 1,03 |
| 8 | 3×2 | espada-longa | nenhuma | 92,5% | 0,0% | 0,99 |
| 8 | 3×2 | espada-longa | gambeson | 72,5% | 0,0% | 0,91 |
| 8 | 3×2 | espada-longa | malha | 100,0% | 0,0% | 1,06 |
| 8 | 3×2 | montante | nenhuma | 80,0% | 0,0% | 1,03 |
| 8 | 3×2 | montante | gambeson | 82,5% | 0,0% | 1,00 |
| 8 | 3×2 | montante | malha | 87,5% | 0,0% | 1,02 |
| 8 | 4×3 | espada-longa | nenhuma | 94,2% | 0,0% | 0,99 |
| 8 | 4×3 | espada-longa | gambeson | 62,5% | 0,0% | 0,92 |
| 8 | 4×3 | espada-longa | malha | n/d | 100,0% | n/d |
| 8 | 4×3 | montante | nenhuma | 80,0% | 0,0% | 1,06 |
| 8 | 4×3 | montante | gambeson | 85,8% | 0,0% | 1,02 |
| 8 | 4×3 | montante | malha | 83,3% | 0,0% | 1,01 |
| 8 | 5×4 | espada-longa | nenhuma | 92,5% | 0,0% | 0,99 |
| 8 | 5×4 | espada-longa | gambeson | 43,3% | 0,0% | 0,93 |
| 8 | 5×4 | espada-longa | malha | n/d | 100,0% | n/d |
| 8 | 5×4 | montante | nenhuma | 82,5% | 0,0% | 1,04 |
| 8 | 5×4 | montante | gambeson | 85,0% | 0,0% | 1,02 |
| 8 | 5×4 | montante | malha | 86,7% | 0,0% | 1,03 |
| 8 | 6×5 | espada-longa | nenhuma | 90,0% | 0,0% | 0,98 |
| 8 | 6×5 | espada-longa | gambeson | 53,3% | 0,0% | 0,90 |
| 8 | 6×5 | espada-longa | malha | n/d | 100,0% | n/d |
| 8 | 6×5 | montante | nenhuma | 80,8% | 0,0% | 1,02 |
| 8 | 6×5 | montante | gambeson | 83,3% | 0,0% | 0,98 |
| 8 | 6×5 | montante | malha | 86,7% | 0,0% | 1,01 |
| 12 | 1×0 | espada-longa | nenhuma | 80,0% | 0,0% | 0,97 |
| 12 | 1×0 | espada-longa | gambeson | 81,7% | 0,0% | 0,98 |
| 12 | 1×0 | espada-longa | malha | 95,0% | 0,0% | 0,99 |
| 12 | 1×0 | montante | nenhuma | 70,0% | 0,0% | 1,01 |
| 12 | 1×0 | montante | gambeson | 70,0% | 0,0% | 1,01 |
| 12 | 1×0 | montante | malha | 75,8% | 0,0% | 1,03 |
| 12 | 2×1 | espada-longa | nenhuma | 81,7% | 0,0% | 0,99 |
| 12 | 2×1 | espada-longa | gambeson | 82,5% | 0,0% | 0,99 |
| 12 | 2×1 | espada-longa | malha | 97,5% | 0,0% | 1,03 |
| 12 | 2×1 | montante | nenhuma | 72,5% | 0,0% | 1,01 |
| 12 | 2×1 | montante | gambeson | 69,2% | 0,0% | 1,01 |
| 12 | 2×1 | montante | malha | 75,8% | 0,0% | 1,07 |
| 12 | 3×2 | espada-longa | nenhuma | 80,0% | 0,0% | 0,98 |
| 12 | 3×2 | espada-longa | gambeson | 84,2% | 0,0% | 0,96 |
| 12 | 3×2 | espada-longa | malha | 100,0% | 0,0% | 1,05 |
| 12 | 3×2 | montante | nenhuma | 73,3% | 0,0% | 1,01 |
| 12 | 3×2 | montante | gambeson | 71,7% | 0,0% | 1,01 |
| 12 | 3×2 | montante | malha | 79,2% | 0,0% | 1,03 |
| 12 | 4×3 | espada-longa | nenhuma | 81,7% | 0,0% | 0,98 |
| 12 | 4×3 | espada-longa | gambeson | 83,3% | 0,0% | 0,97 |
| 12 | 4×3 | espada-longa | malha | 100,0% | 0,0% | 1,09 |
| 12 | 4×3 | montante | nenhuma | 73,3% | 0,0% | 1,00 |
| 12 | 4×3 | montante | gambeson | 72,5% | 0,0% | 1,02 |
| 12 | 4×3 | montante | malha | 76,7% | 0,0% | 1,02 |
| 12 | 5×4 | espada-longa | nenhuma | 83,3% | 0,0% | 0,99 |
| 12 | 5×4 | espada-longa | gambeson | 77,5% | 0,0% | 0,94 |
| 12 | 5×4 | espada-longa | malha | 100,0% | 2,5% | 1,06 |
| 12 | 5×4 | montante | nenhuma | 74,2% | 0,0% | 1,02 |
| 12 | 5×4 | montante | gambeson | 75,0% | 0,0% | 1,03 |
| 12 | 5×4 | montante | malha | 78,3% | 0,0% | 1,03 |
| 12 | 6×5 | espada-longa | nenhuma | 85,0% | 0,0% | 1,00 |
| 12 | 6×5 | espada-longa | gambeson | 70,0% | 0,0% | 0,91 |
| 12 | 6×5 | espada-longa | malha | n/d | 100,0% | n/d |
| 12 | 6×5 | montante | nenhuma | 75,8% | 0,0% | 1,02 |
| 12 | 6×5 | montante | gambeson | 75,8% | 0,0% | 1,02 |
| 12 | 6×5 | montante | malha | 81,7% | 0,0% | 1,01 |


## 5. D · Um contra três e Pressão

Equipamento de referência: espada longa e gambeson.

| soma | confronto | Pressão | vitória do único | censura |
|---|---|---|---|---|
| 6 | 1×3 de 0 | sem teto | 0,0% | 0,0% |
| 6 | 1×3 de 0 | −4 | 0,0% | 0,0% |
| 6 | 1×3 de 0 | −6 | 0,0% | 0,0% |
| 6 | 2×3 de 1 | sem teto | 0,0% | 0,0% |
| 6 | 2×3 de 1 | −4 | 0,0% | 0,0% |
| 6 | 2×3 de 1 | −6 | 0,0% | 0,0% |
| 6 | 3×3 de 2 | sem teto | 0,0% | 0,0% |
| 6 | 3×3 de 2 | −4 | 0,0% | 0,0% |
| 6 | 3×3 de 2 | −6 | 0,0% | 0,0% |
| 6 | 4×3 de 3 | sem teto | 0,0% | 0,0% |
| 6 | 4×3 de 3 | −4 | 0,0% | 0,0% |
| 6 | 4×3 de 3 | −6 | 0,0% | 0,0% |
| 6 | 5×3 de 4 | sem teto | 6,9% | 3,3% |
| 6 | 5×3 de 4 | −4 | 6,9% | 3,3% |
| 6 | 5×3 de 4 | −6 | 6,9% | 3,3% |
| 6 | 6×3 de 5 | sem teto | 0,0% | 85,8% |
| 6 | 6×3 de 5 | −4 | 0,0% | 85,8% |
| 6 | 6×3 de 5 | −6 | 0,0% | 85,8% |
| 8 | 1×3 de 0 | sem teto | 0,0% | 0,0% |
| 8 | 1×3 de 0 | −4 | 0,0% | 0,0% |
| 8 | 1×3 de 0 | −6 | 0,0% | 0,0% |
| 8 | 2×3 de 1 | sem teto | 0,0% | 0,0% |
| 8 | 2×3 de 1 | −4 | 0,0% | 0,0% |
| 8 | 2×3 de 1 | −6 | 0,0% | 0,0% |
| 8 | 3×3 de 2 | sem teto | 0,0% | 0,0% |
| 8 | 3×3 de 2 | −4 | 0,0% | 0,0% |
| 8 | 3×3 de 2 | −6 | 0,0% | 0,0% |
| 8 | 4×3 de 3 | sem teto | 0,0% | 0,0% |
| 8 | 4×3 de 3 | −4 | 0,0% | 0,0% |
| 8 | 4×3 de 3 | −6 | 0,0% | 0,0% |
| 8 | 5×3 de 4 | sem teto | 0,0% | 0,0% |
| 8 | 5×3 de 4 | −4 | 0,0% | 0,0% |
| 8 | 5×3 de 4 | −6 | 0,0% | 0,0% |
| 8 | 6×3 de 5 | sem teto | 5,8% | 0,0% |
| 8 | 6×3 de 5 | −4 | 5,8% | 0,0% |
| 8 | 6×3 de 5 | −6 | 5,8% | 0,0% |
| 12 | 1×3 de 0 | sem teto | 0,0% | 0,0% |
| 12 | 1×3 de 0 | −4 | 0,0% | 0,0% |
| 12 | 1×3 de 0 | −6 | 0,0% | 0,0% |
| 12 | 2×3 de 1 | sem teto | 0,0% | 0,0% |
| 12 | 2×3 de 1 | −4 | 0,0% | 0,0% |
| 12 | 2×3 de 1 | −6 | 0,0% | 0,0% |
| 12 | 3×3 de 2 | sem teto | 0,0% | 0,0% |
| 12 | 3×3 de 2 | −4 | 0,0% | 0,0% |
| 12 | 3×3 de 2 | −6 | 0,0% | 0,0% |
| 12 | 4×3 de 3 | sem teto | 0,0% | 0,0% |
| 12 | 4×3 de 3 | −4 | 0,0% | 0,0% |
| 12 | 4×3 de 3 | −6 | 0,0% | 0,0% |
| 12 | 5×3 de 4 | sem teto | 0,0% | 0,0% |
| 12 | 5×3 de 4 | −4 | 0,0% | 0,0% |
| 12 | 5×3 de 4 | −6 | 0,0% | 0,0% |
| 12 | 6×3 de 5 | sem teto | 0,0% | 0,0% |
| 12 | 6×3 de 5 | −4 | 0,0% | 0,0% |
| 12 | 6×3 de 5 | −6 | 0,0% | 0,0% |


## 6. E · Valor marginal das alavancas

Centelha 1/3/5; espada longa e gambeson. Razão de ações = igual sem modificação dividido pela peça modificada. O valor de +1 Atributo segue a arma: Destreza na espada, Força no Montante; nesta tabela usa Destreza. +1 Habilidade altera Armas. Ticks alteram somente a anatomia da peça modificada.

| soma | C | alavanca | razão ações | vitória modificada | censura |
|---|---|---|---|---|---|
| 6 | 1 | ataque+1 | 0,975 | 42,5% | 0,0% |
| 6 | 1 | defesa+1 | 1,007 | 46,7% | 0,0% |
| 6 | 1 | dano+1 | 1,160 | 76,7% | 0,0% |
| 6 | 1 | dano+1d6 | 1,880 | 99,2% | 0,0% |
| 6 | 1 | absorcao+1 | 0,915 | 84,2% | 0,0% |
| 6 | 1 | pv+1 | 0,996 | 60,8% | 0,0% |
| 6 | 1 | pv+5 | 0,934 | 76,7% | 0,0% |
| 6 | 1 | preparo-1 | 0,980 | 72,5% | 0,0% |
| 6 | 1 | recuperacao-1 | 0,995 | 68,3% | 0,0% |
| 6 | 1 | habilidade+1 | 0,959 | 35,0% | 0,0% |
| 6 | 1 | atributo+1 | 0,967 | 44,2% | 0,0% |
| 6 | 3 | ataque+1 | 0,937 | 36,7% | 0,0% |
| 6 | 3 | defesa+1 | 1,043 | 41,7% | 0,0% |
| 6 | 3 | dano+1 | 1,131 | 73,3% | 0,0% |
| 6 | 3 | dano+1d6 | 2,073 | 99,2% | 0,0% |
| 6 | 3 | absorcao+1 | 0,921 | 63,3% | 0,0% |
| 6 | 3 | pv+1 | 0,967 | 60,0% | 0,0% |
| 6 | 3 | pv+5 | 0,933 | 76,7% | 0,0% |
| 6 | 3 | preparo-1 | 0,950 | 68,3% | 0,0% |
| 6 | 3 | recuperacao-1 | 0,940 | 60,8% | 0,0% |
| 6 | 3 | habilidade+1 | 0,858 | 22,5% | 0,0% |
| 6 | 3 | atributo+1 | 1,007 | 12,5% | 0,0% |
| 6 | 5 | ataque+1 | 0,864 | 0,0% | 12,5% |
| 6 | 5 | defesa+1 | 1,136 | 25,0% | 13,3% |
| 6 | 5 | dano+1 | 1,009 | 78,3% | 0,0% |
| 6 | 5 | dano+1d6 | 1,762 | 97,5% | 0,0% |
| 6 | 5 | absorcao+1 | 1,000 | 58,7% | 13,3% |
| 6 | 5 | pv+1 | 1,005 | 41,3% | 13,3% |
| 6 | 5 | pv+5 | 0,957 | 44,2% | 13,3% |
| 6 | 5 | preparo-1 | 0,891 | 53,3% | 0,0% |
| 6 | 5 | recuperacao-1 | 0,884 | 52,5% | 0,0% |
| 6 | 5 | habilidade+1 | 0,750 | 0,0% | 12,5% |
| 6 | 5 | atributo+1 | 0,922 | 0,0% | 0,0% |
| 8 | 1 | ataque+1 | 0,986 | 58,3% | 0,0% |
| 8 | 1 | defesa+1 | 0,945 | 57,5% | 0,0% |
| 8 | 1 | dano+1 | 1,178 | 80,8% | 0,0% |
| 8 | 1 | dano+1d6 | 1,680 | 98,3% | 0,0% |
| 8 | 1 | absorcao+1 | 0,919 | 80,8% | 0,0% |
| 8 | 1 | pv+1 | 0,976 | 58,3% | 0,0% |
| 8 | 1 | pv+5 | 0,939 | 68,3% | 0,0% |
| 8 | 1 | preparo-1 | 0,970 | 68,3% | 0,0% |
| 8 | 1 | recuperacao-1 | 0,971 | 69,2% | 0,0% |
| 8 | 1 | habilidade+1 | 0,999 | 57,5% | 0,0% |
| 8 | 1 | atributo+1 | 0,956 | 74,2% | 0,0% |
| 8 | 3 | ataque+1 | 0,986 | 41,7% | 0,0% |
| 8 | 3 | defesa+1 | 1,002 | 40,0% | 0,0% |
| 8 | 3 | dano+1 | 1,159 | 77,5% | 0,0% |
| 8 | 3 | dano+1d6 | 2,028 | 99,2% | 0,0% |
| 8 | 3 | absorcao+1 | 0,921 | 68,3% | 0,0% |
| 8 | 3 | pv+1 | 0,989 | 49,2% | 0,0% |
| 8 | 3 | pv+5 | 0,952 | 69,2% | 0,0% |
| 8 | 3 | preparo-1 | 0,992 | 60,0% | 0,0% |
| 8 | 3 | recuperacao-1 | 0,979 | 62,5% | 0,0% |
| 8 | 3 | habilidade+1 | 0,950 | 38,3% | 0,0% |
| 8 | 3 | atributo+1 | 0,958 | 42,5% | 0,0% |
| 8 | 5 | ataque+1 | 0,910 | 43,3% | 0,0% |
| 8 | 5 | defesa+1 | 1,080 | 31,7% | 0,0% |
| 8 | 5 | dano+1 | 1,130 | 60,0% | 0,0% |
| 8 | 5 | dano+1d6 | 2,002 | 99,2% | 0,0% |
| 8 | 5 | absorcao+1 | 0,954 | 66,7% | 0,0% |
| 8 | 5 | pv+1 | 0,996 | 48,3% | 0,0% |
| 8 | 5 | pv+5 | 0,935 | 65,0% | 0,0% |
| 8 | 5 | preparo-1 | 0,968 | 60,8% | 0,0% |
| 8 | 5 | recuperacao-1 | 0,964 | 57,5% | 0,0% |
| 8 | 5 | habilidade+1 | 0,870 | 26,7% | 0,0% |
| 8 | 5 | atributo+1 | 1,021 | 15,0% | 0,0% |
| 12 | 1 | ataque+1 | 1,032 | 65,0% | 0,0% |
| 12 | 1 | defesa+1 | 0,969 | 59,2% | 0,0% |
| 12 | 1 | dano+1 | 1,098 | 63,3% | 0,0% |
| 12 | 1 | dano+1d6 | 1,333 | 84,2% | 0,0% |
| 12 | 1 | absorcao+1 | 0,947 | 70,0% | 0,0% |
| 12 | 1 | pv+1 | 0,985 | 53,3% | 0,0% |
| 12 | 1 | pv+5 | 0,947 | 65,8% | 0,0% |
| 12 | 1 | preparo-1 | 1,009 | 68,3% | 0,0% |
| 12 | 1 | recuperacao-1 | 1,016 | 70,8% | 0,0% |
| 12 | 1 | habilidade+1 | 1,066 | 71,7% | 0,0% |
| 12 | 1 | atributo+1 | 1,053 | 90,8% | 0,0% |
| 12 | 3 | ataque+1 | 1,025 | 58,3% | 0,0% |
| 12 | 3 | defesa+1 | 0,984 | 63,3% | 0,0% |
| 12 | 3 | dano+1 | 1,170 | 70,8% | 0,0% |
| 12 | 3 | dano+1d6 | 1,590 | 93,3% | 0,0% |
| 12 | 3 | absorcao+1 | 0,935 | 70,8% | 0,0% |
| 12 | 3 | pv+1 | 0,991 | 56,7% | 0,0% |
| 12 | 3 | pv+5 | 0,954 | 68,3% | 0,0% |
| 12 | 3 | preparo-1 | 1,001 | 66,7% | 0,0% |
| 12 | 3 | recuperacao-1 | 1,021 | 76,7% | 0,0% |
| 12 | 3 | habilidade+1 | 1,063 | 65,8% | 0,0% |
| 12 | 3 | atributo+1 | 1,016 | 80,0% | 0,0% |
| 12 | 5 | ataque+1 | 0,993 | 50,0% | 0,0% |
| 12 | 5 | defesa+1 | 0,966 | 51,7% | 0,0% |
| 12 | 5 | dano+1 | 1,137 | 72,5% | 0,0% |
| 12 | 5 | dano+1d6 | 1,799 | 97,5% | 0,0% |
| 12 | 5 | absorcao+1 | 0,935 | 68,3% | 0,0% |
| 12 | 5 | pv+1 | 0,978 | 48,3% | 0,0% |
| 12 | 5 | pv+5 | 0,935 | 65,0% | 0,0% |
| 12 | 5 | preparo-1 | 0,962 | 68,3% | 0,0% |
| 12 | 5 | recuperacao-1 | 0,991 | 73,3% | 0,0% |
| 12 | 5 | habilidade+1 | 0,982 | 48,3% | 0,0% |
| 12 | 5 | atributo+1 | 0,931 | 60,8% | 0,0% |


## 7. F · Variante D7, +2 por Centelha

Variante injetada como +C adicional em ataque e Defesa, além do +C vivo. Equipamento de referência: espada longa e gambeson.

| soma | confronto | vitória X+1 | censura | ações médias |
|---|---|---|---|---|
| 6 | 1×0 | 77,5% | 0,0% | 12,89 |
| 6 | 2×1 | 64,2% | 0,0% | 16,57 |
| 6 | 3×2 | 37,5% | 0,0% | 21,30 |
| 6 | 4×3 | 17,5% | 0,0% | 26,74 |
| 6 | 5×4 | 23,3% | 0,0% | 31,88 |
| 6 | 6×5 | 0,0% | 0,0% | 35,14 |
| 8 | 1×0 | 93,3% | 0,0% | 10,24 |
| 8 | 2×1 | 85,0% | 0,0% | 13,18 |
| 8 | 3×2 | 75,8% | 0,0% | 17,48 |
| 8 | 4×3 | 48,3% | 0,0% | 21,92 |
| 8 | 5×4 | 31,7% | 0,0% | 26,13 |
| 8 | 6×5 | 24,2% | 0,0% | 30,90 |
| 12 | 1×0 | 95,0% | 0,0% | 7,63 |
| 12 | 2×1 | 96,7% | 0,0% | 8,87 |
| 12 | 3×2 | 97,5% | 0,0% | 10,85 |
| 12 | 4×3 | 92,5% | 0,0% | 13,54 |
| 12 | 5×4 | 83,3% | 0,0% | 17,63 |
| 12 | 6×5 | 71,7% | 0,0% | 22,97 |


## 8. Onde as camadas divergem

| soma | C | dano ex. DV0 | dano ex. DV4 | dano fiel | ações p50 ex0/ex4/fiel | censura | perda fiel média |
|---|---|---|---|---|---|---|---|
| 6 | 1 | 2,09 | 1,97 | 2,10 | 17/18/15 | 0,0% | 2,28 |
| 6 | 3 | 1,65 | 0,99 | 1,36 | 21/35/24 | 0,0% | 2,33 |
| 6 | 5 | 1,46 | 0,57 | 0,72 | 24/61/32 | 13,3% | 2,76 |
| 8 | 1 | 2,15 | 2,64 | 2,49 | 16/13/12 | 0,0% | 2,24 |
| 8 | 3 | 1,65 | 1,50 | 1,61 | 21/23/19 | 0,0% | 2,26 |
| 8 | 5 | 1,37 | 0,87 | 1,11 | 25/40/27 | 0,0% | 2,32 |
| 12 | 1 | 2,33 | 3,74 | 3,13 | 15/9/9 | 0,0% | 2,23 |
| 12 | 3 | 1,77 | 2,47 | 2,17 | 20/14/13 | 0,0% | 2,25 |
| 12 | 5 | 1,35 | 1,51 | 1,49 | 26/23/19 | 0,0% | 2,25 |


A camada exata com Defesa cheia subestima acerto e dano sempre que a perda real é negativa. Usar perda fixa 4 aproxima alguns pontos, mas apaga a distribuição, a escalada de Pressão, o momento do ciclo e o ferimento. “Censura” é a fração que não chegou a uma queda em 1.000 Ticks; essas lutas não entram nos percentis nem são contadas como derrota. A camada rápida serve para varrer direção e ordenar alavancas; níveis finais precisam dos pontos fiéis.

### Leitura para a revisão do simulador

- A perda de Defesa não é uma constante 4: no duelo sua mediana foi 2; no 1 contra 3, 4, com p90 8. A aproximação fixa depende do formato do encontro.
- Há células em que a espada longa não atravessa a combinação de Absorção e Quase-Acerto o bastante para encerrar a luta. A censura é resultado, não zero nem derrota.
- Aumentar Ataque ou Habilidade pode reduzir a chance de vitória em certas células: um raspão causa dano fixo ignorando Absorção, enquanto um acerto fraco sofre Absorção e pode causar zero. O simulador preserva essa descontinuidade da regra viva; a Revisora deve confirmar que ela é intencional antes de usar a alavanca de ataque como moeda monotônica.
- +1d6 de dano foi muito mais forte que +1 fixo nas células de referência. A razão varia com Absorção, portanto não existe conversão universal entre dado e ponto.
- As razões de ações com censura ou baixa resolução não servem para precificar. Estão publicadas para localizar a falha da métrica, não para interpolar nível.

## 9. Procedência e conferência

- `node scripts/sim/calibrar.mjs --teste`: três golpes determinísticos conferidos contra `resolverGolpe` (erro, raspão, acerto com Margem) e dois pontos de distribuição em que a camada rápida e o resolvedor usado pela camada fiel concordam exatamente, por enumeração direta através de `lance.ts`.
- `node scripts/sim/calibrar.mjs --n 120`: comando desta medição.
- Pressão sem teto é a regra viva; −4 e −6 são somente variantes locais.
- Nenhum valor de Proeza foi aplicado e nenhum catálogo foi modificado.

**Parada:** esta é a linha de base para revisão do simulador. As taxas de câmbio não devem ser decididas antes da conferência da Revisora.
