# 15 · Linha de base do combate no motor real

27/09/2026 · **RASCUNHO DE MEDIÇÃO**, sem mudança de regra. Nada deste relatório vale para preço antes da conferência da Revisora. 1000 lutas em cada orientação de cada célula, semente mestre 20260927.

## Resumo para a Revisora

A regra atual acrescenta a Centelha à Absorção de todos os tipos. V1 mantém essa Absorção, mas impede que um acerto cause menos dano que o raspão do mesmo encontro. V2 mantém a Absorção inteira da Centelha apenas contra Impacto. V3 mantém os três tipos, mas acrescenta somente 1 ponto a cada 2 de Centelha. Como V2 e V3 dão destinos alternativos à mesma parcela, não existe cenário V2+V3; as combinações válidas são V1+V2 e V1+V3.

“Imunidade” nesta página significa uma luta que não terminou em 1.000 Ticks, não invulnerabilidade matemática. A última coluna mostra a maior censura observada com espada longa contra malha em qualquer soma e Centelha. A duração usa a ficha intermediária, soma 8 e gambeson; cada célula contém 2000 lutas, metade em cada orientação.

| cenário | mediana espada por C | mediana montante por C | pior espada×malha |
|---|---|---|---|
| regra atual | C0 10; C1 12; C2 15; C3 19; C4 24; C5 29; C6 33 | C0 4; C1 5; C2 5; C3 6; C4 6; C5 7; C6 8 | 100,0% |
| V1 | C0 8; C1 9; C2 9; C3 9; C4 9; C5 9; C6 9 | C0 4; C1 5; C2 5; C3 5; C4 6; C5 6; C6 7 | 100,0% |
| V2 | C0 10; C1 10; C2 10; C3 10; C4 10; C5 10; C6 10 | C0 4; C1 4; C2 4; C3 4; C4 4; C5 4; C6 4 | 0,0% |
| V3 | C0 10; C1 10; C2 12; C3 12; C4 15; C5 15; C6 19 | C0 4; C1 4; C2 5; C3 5; C4 5; C5 5; C6 6 | 100,0% |
| V1+V2 | C0 8; C1 8; C2 8; C3 8; C4 8; C5 8; C6 8 | C0 4; C1 4; C2 4; C3 4; C4 4; C5 4; C6 4 | 0,0% |
| V1+V3 | C0 8; C1 8; C2 9; C3 9; C4 9; C5 9; C6 9 | C0 4; C1 4; C2 5; C3 5; C4 5; C5 5; C6 5 | 100,0% |


O teste de monotonicidade abaixo usa a nova força direcional. “Sim” exige que +1 Ataque reduza os golpes necessários de A em todas as nove células de soma 6/8/12 e Centelha 1/3/5.

| cenário | +1 Ataque sempre positivo? | células positivas | falhas |
|---|---|---|---|
| regra atual | não | 4/9 | S6 C1, S6 C3, S6 C5, S8 C3, S8 C5 |
| V1 | sim | 9/9 | nenhuma |
| V2 | sim | 9/9 | nenhuma |
| V3 | não | 7/9 | S6 C3, S6 C5 |
| V1+V2 | sim | 9/9 | nenhuma |
| V1+V3 | sim | 9/9 | nenhuma |


## 1. Método e limites

Fichas sem Proezas: soma 6/8/12 dividida igualmente entre Atributo e Habilidade; Vigor 3; mesma ficha em C0–C6. A espada longa ocupa uma mão, com adaga inativa na outra apenas para acionar a fórmula viva de uma mão; Montante usa duas. Armadura nenhuma/Gambeson/Malha. Todos começam adjacentes; a luta vai até um lado cair, sem fuga ou desistência automáticas. Empate de iniciativa varia pela semente.

Camada exata: Defesa cheia e golpes independentes, mas preserva pool, paridade, Acerto da arma, Margens, Quase-Acerto, dano e Absorção. Ela não modela P/G/R, Pressão, ferimentos, iniciativa ou simultaneidade. Camada fiel: todas essas regras operam. “Ações até cair” mede duração e aparece apenas como duração, nunca como força.

Cada duelo roda duas bancadas: A no lado `a` e A no lado `b`. A chance publicada reúne as duas orientações e traz intervalo de confiança de Wilson de 95%. O viés é a chance de A vencer no lado `a` menos a chance de vencer no lado `b`. Lutas censuradas ficam fora da chance, mas sua fração é publicada.

A força direcional usa todos os golpes das mesmas lutas espelhadas. Para cada direção, dano médio é dano líquido total dividido pelas tentativas daquela direção; golpes necessários são PV iniciais do alvo divididos por esse dano médio. Força relativa = golpes que B precisa para derrubar A divididos pelos golpes que A precisa para derrubar B. Valor 1 é igualdade; acima de 1 favorece A.

Os documentos pedidos existem nesta árvore em `docs/export/proezas/chatgpt/09-inventario-calculos.md` e `14-levantamento-pesos.md`; os caminhos sem `chatgpt/` estavam ausentes durante a execução. O primeiro também aparecia removido por outra frente, e não foi restaurado.

## 2. A · Defesa perdida no golpe

Valores são módulos positivos da perda total P/G/R + Pressão observada na entrada real de `resolverGolpe`.

| formato | soma | C | média | p10/p50/p90 | golpes |
|---|---|---|---|---|---|
| duelo | 6 | 1 | 2,43 | 2/2/4 | 29767 |
| duelo | 6 | 3 | 2,53 | 2/2/4 | 49557 |
| duelo | 6 | 5 | 3,06 | 2/4/4 | 108385 |
| duelo | 8 | 1 | 2,39 | 2/2/4 | 24188 |
| duelo | 8 | 3 | 2,44 | 2/2/4 | 38568 |
| duelo | 8 | 5 | 2,53 | 2/2/4 | 59355 |
| duelo | 12 | 1 | 2,36 | 2/2/4 | 18047 |
| duelo | 12 | 3 | 2,38 | 2/2/4 | 26254 |
| duelo | 12 | 5 | 2,41 | 2/2/4 | 40487 |
| 1 contra 3 | 6 | 1 | 4,58 | 2/4/8 | 26110 |
| 1 contra 3 | 6 | 3 | 4,62 | 2/4/8 | 63969 |
| 1 contra 3 | 6 | 5 | 4,66 | 2/4/8 | 521087 |
| 1 contra 3 | 8 | 1 | 4,56 | 2/4/8 | 18759 |
| 1 contra 3 | 8 | 3 | 4,59 | 2/4/8 | 37640 |
| 1 contra 3 | 8 | 5 | 4,60 | 2/4/8 | 97531 |
| 1 contra 3 | 12 | 1 | 4,52 | 2/4/8 | 12375 |
| 1 contra 3 | 12 | 3 | 4,55 | 2/4/8 | 19330 |
| 1 contra 3 | 12 | 5 | 4,58 | 2/4/8 | 36155 |


## 3. B · Linha de base entre iguais e variantes

| cenário | soma | C | arma | armadura | acerto | raspão | ações p10/p50/p90 | censura | vitória A, IC95% | viés |
|---|---|---|---|---|---|---|---|---|---|---|
| regra atual | 6 | 0 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| regra atual | 6 | 0 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| regra atual | 6 | 0 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| regra atual | 6 | 0 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| regra atual | 6 | 0 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| regra atual | 6 | 0 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| regra atual | 6 | 1 | espada-longa | nenhuma | 63,1% | 18,5% | 6/7/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,0 pp |
| regra atual | 6 | 1 | espada-longa | gambeson | 65,0% | 25,3% | 12/15/18 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| regra atual | 6 | 1 | espada-longa | malha | 64,3% | 29,2% | 63/82/105 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,0 pp |
| regra atual | 6 | 1 | montante | nenhuma | 52,2% | 10,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 14,0 pp |
| regra atual | 6 | 1 | montante | gambeson | 52,0% | 20,9% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| regra atual | 6 | 1 | montante | malha | 52,5% | 28,7% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| regra atual | 6 | 2 | espada-longa | nenhuma | 63,1% | 18,9% | 7/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| regra atual | 6 | 2 | espada-longa | gambeson | 66,3% | 24,6% | 15/19/24 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| regra atual | 6 | 2 | espada-longa | malha | 66,1% | 29,4% | 128/141/143 | 99,7% | 50,0% [18,8%; 81,2%], n=6 | 33,3 pp |
| regra atual | 6 | 2 | montante | nenhuma | 52,1% | 10,7% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| regra atual | 6 | 2 | montante | gambeson | 52,0% | 21,0% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,0 pp |
| regra atual | 6 | 2 | montante | malha | 53,0% | 28,5% | 6/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,8 pp |
| regra atual | 6 | 3 | espada-longa | nenhuma | 63,5% | 19,0% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,0 pp |
| regra atual | 6 | 3 | espada-longa | gambeson | 67,2% | 24,1% | 18/24/33 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| regra atual | 6 | 3 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 6 | 3 | montante | nenhuma | 51,8% | 11,1% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,0 pp |
| regra atual | 6 | 3 | montante | gambeson | 52,0% | 21,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| regra atual | 6 | 3 | montante | malha | 52,7% | 29,2% | 8/10/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| regra atual | 6 | 4 | espada-longa | nenhuma | 64,0% | 18,6% | 10/13/16 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| regra atual | 6 | 4 | espada-longa | gambeson | 69,0% | 23,3% | 21/28/47 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,4 pp |
| regra atual | 6 | 4 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 6 | 4 | montante | nenhuma | 51,8% | 11,4% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,0 pp |
| regra atual | 6 | 4 | montante | gambeson | 52,6% | 20,7% | 6/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,2 pp |
| regra atual | 6 | 4 | montante | malha | 52,7% | 29,4% | 9/13/16 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,0 pp |
| regra atual | 6 | 5 | espada-longa | nenhuma | 64,5% | 18,5% | 13/16/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| regra atual | 6 | 5 | espada-longa | gambeson | 79,5% | 15,5% | 24/31/41 | 20,2% | 50,0% [47,5%; 52,5%], n=1596 | 0,8 pp |
| regra atual | 6 | 5 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 6 | 5 | montante | nenhuma | 52,2% | 11,1% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| regra atual | 6 | 5 | montante | gambeson | 52,7% | 20,4% | 7/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| regra atual | 6 | 5 | montante | malha | 53,2% | 29,3% | 12/16/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,4 pp |
| regra atual | 6 | 6 | espada-longa | nenhuma | 65,6% | 18,5% | 17/22/27 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| regra atual | 6 | 6 | espada-longa | gambeson | 79,5% | 15,5% | 24/31/41 | 20,2% | 50,0% [47,5%; 52,5%], n=1596 | 0,8 pp |
| regra atual | 6 | 6 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 6 | 6 | montante | nenhuma | 52,5% | 11,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| regra atual | 6 | 6 | montante | gambeson | 53,0% | 20,4% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| regra atual | 6 | 6 | montante | malha | 53,7% | 29,3% | 16/21/26 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,2 pp |
| regra atual | 8 | 0 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| regra atual | 8 | 0 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| regra atual | 8 | 0 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| regra atual | 8 | 0 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| regra atual | 8 | 0 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| regra atual | 8 | 0 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| regra atual | 8 | 1 | espada-longa | nenhuma | 57,2% | 17,7% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| regra atual | 8 | 1 | espada-longa | gambeson | 58,1% | 25,4% | 10/12/15 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,6 pp |
| regra atual | 8 | 1 | espada-longa | malha | 57,9% | 30,8% | 32/44/59 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| regra atual | 8 | 1 | montante | nenhuma | 47,4% | 9,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,0 pp |
| regra atual | 8 | 1 | montante | gambeson | 47,6% | 18,7% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,6 pp |
| regra atual | 8 | 1 | montante | malha | 47,4% | 27,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| regra atual | 8 | 2 | espada-longa | nenhuma | 57,3% | 18,1% | 6/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,8 pp |
| regra atual | 8 | 2 | espada-longa | gambeson | 58,4% | 25,6% | 12/15/19 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,2 pp |
| regra atual | 8 | 2 | espada-longa | malha | 58,2% | 30,7% | 67/89/116 | 0,6% | 50,0% [47,8%; 52,2%], n=1988 | 1,6 pp |
| regra atual | 8 | 2 | montante | nenhuma | 47,8% | 9,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| regra atual | 8 | 2 | montante | gambeson | 47,3% | 18,8% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,0 pp |
| regra atual | 8 | 2 | montante | malha | 47,4% | 27,4% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| regra atual | 8 | 3 | espada-longa | nenhuma | 57,7% | 18,2% | 7/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| regra atual | 8 | 3 | espada-longa | gambeson | 59,2% | 25,1% | 15/19/24 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| regra atual | 8 | 3 | espada-longa | malha | 59,2% | 31,9% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 8 | 3 | montante | nenhuma | 48,0% | 9,6% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| regra atual | 8 | 3 | montante | gambeson | 47,3% | 18,8% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,0 pp |
| regra atual | 8 | 3 | montante | malha | 47,3% | 27,5% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,4 pp |
| regra atual | 8 | 4 | espada-longa | nenhuma | 57,9% | 18,1% | 9/10/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,4 pp |
| regra atual | 8 | 4 | espada-longa | gambeson | 59,9% | 24,8% | 18/24/32 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| regra atual | 8 | 4 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 8 | 4 | montante | nenhuma | 47,9% | 9,6% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| regra atual | 8 | 4 | montante | gambeson | 47,4% | 18,7% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| regra atual | 8 | 4 | montante | malha | 47,5% | 27,7% | 7/9/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| regra atual | 8 | 5 | espada-longa | nenhuma | 58,2% | 17,7% | 11/13/17 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| regra atual | 8 | 5 | espada-longa | gambeson | 60,5% | 24,6% | 21/29/41 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| regra atual | 8 | 5 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 8 | 5 | montante | nenhuma | 47,7% | 9,7% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| regra atual | 8 | 5 | montante | gambeson | 47,5% | 18,8% | 5/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| regra atual | 8 | 5 | montante | malha | 47,5% | 27,8% | 8/11/15 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,6 pp |
| regra atual | 8 | 6 | espada-longa | nenhuma | 58,1% | 18,2% | 14/17/21 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| regra atual | 8 | 6 | espada-longa | gambeson | 62,2% | 24,0% | 24/33/51 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| regra atual | 8 | 6 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 8 | 6 | montante | nenhuma | 47,3% | 10,0% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| regra atual | 8 | 6 | montante | gambeson | 47,9% | 18,4% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,2 pp |
| regra atual | 8 | 6 | montante | malha | 47,8% | 27,7% | 10/13/18 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| regra atual | 12 | 0 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| regra atual | 12 | 0 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| regra atual | 12 | 0 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| regra atual | 12 | 0 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| regra atual | 12 | 0 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| regra atual | 12 | 0 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| regra atual | 12 | 1 | espada-longa | nenhuma | 48,1% | 16,0% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| regra atual | 12 | 1 | espada-longa | gambeson | 48,3% | 23,9% | 7/9/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| regra atual | 12 | 1 | espada-longa | malha | 48,3% | 30,4% | 15/21/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| regra atual | 12 | 1 | montante | nenhuma | 39,1% | 9,0% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| regra atual | 12 | 1 | montante | gambeson | 39,4% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| regra atual | 12 | 1 | montante | malha | 39,5% | 24,8% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| regra atual | 12 | 2 | espada-longa | nenhuma | 48,1% | 16,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| regra atual | 12 | 2 | espada-longa | gambeson | 48,3% | 24,0% | 9/11/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,8 pp |
| regra atual | 12 | 2 | espada-longa | malha | 48,3% | 30,5% | 23/31/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| regra atual | 12 | 2 | montante | nenhuma | 39,1% | 8,9% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| regra atual | 12 | 2 | montante | gambeson | 39,5% | 17,0% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,6 pp |
| regra atual | 12 | 2 | montante | malha | 39,5% | 24,6% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| regra atual | 12 | 3 | espada-longa | nenhuma | 47,7% | 16,5% | 6/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| regra atual | 12 | 3 | espada-longa | gambeson | 48,4% | 24,2% | 11/13/17 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,2 pp |
| regra atual | 12 | 3 | espada-longa | malha | 48,4% | 30,9% | 38/53/71 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| regra atual | 12 | 3 | montante | nenhuma | 39,7% | 8,6% | 2/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| regra atual | 12 | 3 | montante | gambeson | 39,4% | 17,2% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| regra atual | 12 | 3 | montante | malha | 39,5% | 24,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| regra atual | 12 | 4 | espada-longa | nenhuma | 47,8% | 16,7% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| regra atual | 12 | 4 | espada-longa | gambeson | 48,6% | 24,3% | 13/16/21 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| regra atual | 12 | 4 | espada-longa | malha | 48,5% | 31,0% | 78/105/130 | 9,2% | 50,0% [47,7%; 52,3%], n=1816 | -0,2 pp |
| regra atual | 12 | 4 | montante | nenhuma | 39,9% | 8,7% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| regra atual | 12 | 4 | montante | gambeson | 39,5% | 16,7% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| regra atual | 12 | 4 | montante | malha | 39,5% | 24,5% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| regra atual | 12 | 5 | espada-longa | nenhuma | 48,2% | 16,4% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| regra atual | 12 | 5 | espada-longa | gambeson | 48,9% | 24,2% | 16/20/26 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,4 pp |
| regra atual | 12 | 5 | espada-longa | malha | 48,8% | 32,6% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 12 | 5 | montante | nenhuma | 39,6% | 8,7% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| regra atual | 12 | 5 | montante | gambeson | 39,3% | 16,8% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| regra atual | 12 | 5 | montante | malha | 39,1% | 25,2% | 5/7/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,4 pp |
| regra atual | 12 | 6 | espada-longa | nenhuma | 48,3% | 16,5% | 9/12/15 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| regra atual | 12 | 6 | espada-longa | gambeson | 49,3% | 23,9% | 19/25/32 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| regra atual | 12 | 6 | espada-longa | malha | 48,8% | 32,7% | não concluiu | 100,0% | n/d | n/d |
| regra atual | 12 | 6 | montante | nenhuma | 39,6% | 8,8% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| regra atual | 12 | 6 | montante | gambeson | 39,5% | 16,8% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,0 pp |
| regra atual | 12 | 6 | montante | malha | 39,3% | 24,9% | 5/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,8 pp |
| V1 | 6 | 0 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1 | 6 | 0 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1 | 6 | 0 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1 | 6 | 0 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1 | 6 | 0 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1 | 6 | 0 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1 | 6 | 1 | espada-longa | nenhuma | 63,2% | 18,6% | 6/7/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V1 | 6 | 1 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1 | 6 | 1 | espada-longa | malha | 64,3% | 29,2% | 63/82/105 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,0 pp |
| V1 | 6 | 1 | montante | nenhuma | 52,2% | 10,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 14,0 pp |
| V1 | 6 | 1 | montante | gambeson | 52,0% | 20,8% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,0 pp |
| V1 | 6 | 1 | montante | malha | 52,4% | 28,8% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1 | 6 | 2 | espada-longa | nenhuma | 63,2% | 19,1% | 7/8/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1 | 6 | 2 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1 | 6 | 2 | espada-longa | malha | 66,1% | 29,4% | 128/141/143 | 99,7% | 50,0% [18,8%; 81,2%], n=6 | 33,3 pp |
| V1 | 6 | 2 | montante | nenhuma | 52,1% | 10,7% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1 | 6 | 2 | montante | gambeson | 52,1% | 20,7% | 5/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V1 | 6 | 2 | montante | malha | 52,9% | 28,6% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1 | 6 | 3 | espada-longa | nenhuma | 63,6% | 19,0% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1 | 6 | 3 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1 | 6 | 3 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| V1 | 6 | 3 | montante | nenhuma | 51,8% | 11,1% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,0 pp |
| V1 | 6 | 3 | montante | gambeson | 52,1% | 20,6% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| V1 | 6 | 3 | montante | malha | 52,7% | 29,4% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,8 pp |
| V1 | 6 | 4 | espada-longa | nenhuma | 64,1% | 18,9% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,0 pp |
| V1 | 6 | 4 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1 | 6 | 4 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| V1 | 6 | 4 | montante | nenhuma | 51,8% | 11,4% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,4 pp |
| V1 | 6 | 4 | montante | gambeson | 52,0% | 20,9% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V1 | 6 | 4 | montante | malha | 52,8% | 29,7% | 9/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| V1 | 6 | 5 | espada-longa | nenhuma | 64,1% | 18,8% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 13,2 pp |
| V1 | 6 | 5 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1 | 6 | 5 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| V1 | 6 | 5 | montante | nenhuma | 52,0% | 11,2% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,0 pp |
| V1 | 6 | 5 | montante | gambeson | 52,3% | 20,8% | 6/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| V1 | 6 | 5 | montante | malha | 52,9% | 30,1% | 11/13/16 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V1 | 6 | 6 | espada-longa | nenhuma | 64,1% | 18,8% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 13,2 pp |
| V1 | 6 | 6 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1 | 6 | 6 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| V1 | 6 | 6 | montante | nenhuma | 52,3% | 11,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,2 pp |
| V1 | 6 | 6 | montante | gambeson | 52,5% | 21,0% | 6/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,4 pp |
| V1 | 6 | 6 | montante | malha | 53,6% | 30,0% | 13/15/18 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,6 pp |
| V1 | 8 | 0 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1 | 8 | 0 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1 | 8 | 0 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1 | 8 | 0 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1 | 8 | 0 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1 | 8 | 0 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1 | 8 | 1 | espada-longa | nenhuma | 57,2% | 17,7% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| V1 | 8 | 1 | espada-longa | gambeson | 57,6% | 26,2% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,4 pp |
| V1 | 8 | 1 | espada-longa | malha | 57,9% | 30,8% | 32/44/59 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| V1 | 8 | 1 | montante | nenhuma | 47,4% | 9,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,0 pp |
| V1 | 8 | 1 | montante | gambeson | 47,6% | 18,8% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,8 pp |
| V1 | 8 | 1 | montante | malha | 47,4% | 27,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1 | 8 | 2 | espada-longa | nenhuma | 57,2% | 18,1% | 6/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1 | 8 | 2 | espada-longa | gambeson | 57,6% | 26,0% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1 | 8 | 2 | espada-longa | malha | 58,2% | 30,7% | 67/89/116 | 0,6% | 50,0% [47,8%; 52,2%], n=1988 | 1,6 pp |
| V1 | 8 | 2 | montante | nenhuma | 47,8% | 9,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| V1 | 8 | 2 | montante | gambeson | 47,4% | 18,6% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,0 pp |
| V1 | 8 | 2 | montante | malha | 47,4% | 27,4% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1 | 8 | 3 | espada-longa | nenhuma | 57,6% | 18,2% | 7/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,6 pp |
| V1 | 8 | 3 | espada-longa | gambeson | 57,6% | 26,0% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1 | 8 | 3 | espada-longa | malha | 59,2% | 31,9% | não concluiu | 100,0% | n/d | n/d |
| V1 | 8 | 3 | montante | nenhuma | 48,0% | 9,6% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| V1 | 8 | 3 | montante | gambeson | 47,3% | 18,8% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,6 pp |
| V1 | 8 | 3 | montante | malha | 47,3% | 27,4% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| V1 | 8 | 4 | espada-longa | nenhuma | 57,5% | 18,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V1 | 8 | 4 | espada-longa | gambeson | 57,6% | 26,0% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1 | 8 | 4 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| V1 | 8 | 4 | montante | nenhuma | 47,9% | 9,6% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1 | 8 | 4 | montante | gambeson | 47,2% | 18,8% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1 | 8 | 4 | montante | malha | 47,4% | 27,9% | 7/9/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,4 pp |
| V1 | 8 | 5 | espada-longa | nenhuma | 57,7% | 18,7% | 8/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,2 pp |
| V1 | 8 | 5 | espada-longa | gambeson | 57,6% | 26,0% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1 | 8 | 5 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| V1 | 8 | 5 | montante | nenhuma | 47,7% | 9,7% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| V1 | 8 | 5 | montante | gambeson | 47,5% | 18,7% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,2 pp |
| V1 | 8 | 5 | montante | malha | 47,4% | 27,9% | 8/11/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1 | 8 | 6 | espada-longa | nenhuma | 57,7% | 18,5% | 9/10/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,2 pp |
| V1 | 8 | 6 | espada-longa | gambeson | 57,6% | 26,0% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1 | 8 | 6 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| V1 | 8 | 6 | montante | nenhuma | 47,4% | 10,0% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1 | 8 | 6 | montante | gambeson | 47,7% | 18,5% | 5/7/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1 | 8 | 6 | montante | malha | 47,8% | 27,8% | 10/12/16 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,8 pp |
| V1 | 12 | 0 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1 | 12 | 0 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1 | 12 | 0 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1 | 12 | 0 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1 | 12 | 0 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1 | 12 | 0 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1 | 12 | 1 | espada-longa | nenhuma | 48,1% | 16,0% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1 | 12 | 1 | espada-longa | gambeson | 47,9% | 24,0% | 7/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1 | 12 | 1 | espada-longa | malha | 48,3% | 30,4% | 15/21/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V1 | 12 | 1 | montante | nenhuma | 39,1% | 9,0% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1 | 12 | 1 | montante | gambeson | 39,4% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1 | 12 | 1 | montante | malha | 39,5% | 24,8% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| V1 | 12 | 2 | espada-longa | nenhuma | 48,1% | 16,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| V1 | 12 | 2 | espada-longa | gambeson | 48,2% | 23,9% | 8/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,6 pp |
| V1 | 12 | 2 | espada-longa | malha | 48,3% | 30,5% | 23/31/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| V1 | 12 | 2 | montante | nenhuma | 39,1% | 8,9% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1 | 12 | 2 | montante | gambeson | 39,5% | 17,0% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,6 pp |
| V1 | 12 | 2 | montante | malha | 39,5% | 24,6% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| V1 | 12 | 3 | espada-longa | nenhuma | 47,7% | 16,5% | 6/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| V1 | 12 | 3 | espada-longa | gambeson | 48,1% | 24,2% | 9/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V1 | 12 | 3 | espada-longa | malha | 48,4% | 30,9% | 38/53/71 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1 | 12 | 3 | montante | nenhuma | 39,7% | 8,6% | 2/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1 | 12 | 3 | montante | gambeson | 39,4% | 17,2% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1 | 12 | 3 | montante | malha | 39,5% | 24,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1 | 12 | 4 | espada-longa | nenhuma | 47,8% | 16,6% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,6 pp |
| V1 | 12 | 4 | espada-longa | gambeson | 48,2% | 24,1% | 9/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| V1 | 12 | 4 | espada-longa | malha | 48,5% | 31,0% | 78/105/130 | 9,2% | 50,0% [47,7%; 52,3%], n=1816 | -0,2 pp |
| V1 | 12 | 4 | montante | nenhuma | 39,9% | 8,7% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1 | 12 | 4 | montante | gambeson | 39,5% | 16,7% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V1 | 12 | 4 | montante | malha | 39,5% | 24,5% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| V1 | 12 | 5 | espada-longa | nenhuma | 48,0% | 16,5% | 7/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1 | 12 | 5 | espada-longa | gambeson | 48,2% | 24,1% | 9/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| V1 | 12 | 5 | espada-longa | malha | 48,8% | 32,6% | não concluiu | 100,0% | n/d | n/d |
| V1 | 12 | 5 | montante | nenhuma | 39,6% | 8,7% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1 | 12 | 5 | montante | gambeson | 39,3% | 16,8% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| V1 | 12 | 5 | montante | malha | 39,1% | 25,2% | 5/7/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,4 pp |
| V1 | 12 | 6 | espada-longa | nenhuma | 48,1% | 16,6% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,8 pp |
| V1 | 12 | 6 | espada-longa | gambeson | 48,2% | 24,1% | 9/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| V1 | 12 | 6 | espada-longa | malha | 48,8% | 32,7% | não concluiu | 100,0% | n/d | n/d |
| V1 | 12 | 6 | montante | nenhuma | 39,6% | 8,8% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1 | 12 | 6 | montante | gambeson | 39,5% | 16,8% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,8 pp |
| V1 | 12 | 6 | montante | malha | 39,3% | 24,9% | 5/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,8 pp |
| V2 | 6 | 0 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V2 | 6 | 0 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V2 | 6 | 0 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V2 | 6 | 0 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V2 | 6 | 0 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V2 | 6 | 0 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V2 | 6 | 1 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V2 | 6 | 1 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V2 | 6 | 1 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V2 | 6 | 1 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V2 | 6 | 1 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V2 | 6 | 1 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V2 | 6 | 2 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V2 | 6 | 2 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V2 | 6 | 2 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V2 | 6 | 2 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V2 | 6 | 2 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V2 | 6 | 2 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V2 | 6 | 3 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V2 | 6 | 3 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V2 | 6 | 3 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V2 | 6 | 3 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V2 | 6 | 3 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V2 | 6 | 3 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V2 | 6 | 4 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V2 | 6 | 4 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V2 | 6 | 4 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V2 | 6 | 4 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V2 | 6 | 4 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V2 | 6 | 4 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V2 | 6 | 5 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V2 | 6 | 5 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V2 | 6 | 5 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V2 | 6 | 5 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V2 | 6 | 5 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V2 | 6 | 5 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V2 | 6 | 6 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V2 | 6 | 6 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V2 | 6 | 6 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V2 | 6 | 6 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V2 | 6 | 6 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V2 | 6 | 6 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V2 | 8 | 0 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V2 | 8 | 0 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V2 | 8 | 0 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V2 | 8 | 0 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V2 | 8 | 0 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V2 | 8 | 0 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V2 | 8 | 1 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V2 | 8 | 1 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V2 | 8 | 1 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V2 | 8 | 1 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V2 | 8 | 1 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V2 | 8 | 1 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V2 | 8 | 2 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V2 | 8 | 2 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V2 | 8 | 2 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V2 | 8 | 2 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V2 | 8 | 2 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V2 | 8 | 2 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V2 | 8 | 3 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V2 | 8 | 3 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V2 | 8 | 3 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V2 | 8 | 3 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V2 | 8 | 3 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V2 | 8 | 3 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V2 | 8 | 4 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V2 | 8 | 4 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V2 | 8 | 4 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V2 | 8 | 4 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V2 | 8 | 4 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V2 | 8 | 4 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V2 | 8 | 5 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V2 | 8 | 5 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V2 | 8 | 5 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V2 | 8 | 5 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V2 | 8 | 5 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V2 | 8 | 5 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V2 | 8 | 6 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V2 | 8 | 6 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V2 | 8 | 6 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V2 | 8 | 6 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V2 | 8 | 6 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V2 | 8 | 6 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V2 | 12 | 0 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V2 | 12 | 0 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V2 | 12 | 0 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V2 | 12 | 0 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V2 | 12 | 0 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V2 | 12 | 0 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V2 | 12 | 1 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V2 | 12 | 1 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V2 | 12 | 1 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V2 | 12 | 1 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V2 | 12 | 1 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V2 | 12 | 1 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V2 | 12 | 2 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V2 | 12 | 2 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V2 | 12 | 2 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V2 | 12 | 2 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V2 | 12 | 2 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V2 | 12 | 2 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V2 | 12 | 3 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V2 | 12 | 3 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V2 | 12 | 3 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V2 | 12 | 3 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V2 | 12 | 3 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V2 | 12 | 3 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V2 | 12 | 4 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V2 | 12 | 4 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V2 | 12 | 4 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V2 | 12 | 4 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V2 | 12 | 4 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V2 | 12 | 4 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V2 | 12 | 5 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V2 | 12 | 5 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V2 | 12 | 5 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V2 | 12 | 5 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V2 | 12 | 5 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V2 | 12 | 5 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V2 | 12 | 6 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V2 | 12 | 6 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V2 | 12 | 6 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V2 | 12 | 6 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V2 | 12 | 6 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V2 | 12 | 6 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V3 | 6 | 0 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V3 | 6 | 0 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V3 | 6 | 0 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V3 | 6 | 0 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V3 | 6 | 0 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V3 | 6 | 0 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V3 | 6 | 1 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V3 | 6 | 1 | espada-longa | gambeson | 64,2% | 25,8% | 10/12/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V3 | 6 | 1 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V3 | 6 | 1 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V3 | 6 | 1 | montante | gambeson | 51,8% | 20,9% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V3 | 6 | 1 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V3 | 6 | 2 | espada-longa | nenhuma | 63,1% | 18,5% | 6/7/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,0 pp |
| V3 | 6 | 2 | espada-longa | gambeson | 65,0% | 25,3% | 12/15/18 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| V3 | 6 | 2 | espada-longa | malha | 64,3% | 29,2% | 63/82/105 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,0 pp |
| V3 | 6 | 2 | montante | nenhuma | 52,2% | 10,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 14,0 pp |
| V3 | 6 | 2 | montante | gambeson | 52,0% | 20,9% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V3 | 6 | 2 | montante | malha | 52,5% | 28,7% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V3 | 6 | 3 | espada-longa | nenhuma | 63,1% | 18,5% | 6/7/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,0 pp |
| V3 | 6 | 3 | espada-longa | gambeson | 65,0% | 25,3% | 12/15/18 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| V3 | 6 | 3 | espada-longa | malha | 64,3% | 29,2% | 63/82/105 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,0 pp |
| V3 | 6 | 3 | montante | nenhuma | 52,2% | 10,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 14,0 pp |
| V3 | 6 | 3 | montante | gambeson | 52,0% | 20,9% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V3 | 6 | 3 | montante | malha | 52,5% | 28,7% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V3 | 6 | 4 | espada-longa | nenhuma | 63,1% | 18,9% | 7/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| V3 | 6 | 4 | espada-longa | gambeson | 66,3% | 24,6% | 15/19/24 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V3 | 6 | 4 | espada-longa | malha | 66,1% | 29,4% | 128/141/143 | 99,7% | 50,0% [18,8%; 81,2%], n=6 | 33,3 pp |
| V3 | 6 | 4 | montante | nenhuma | 52,1% | 10,7% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V3 | 6 | 4 | montante | gambeson | 52,0% | 21,0% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,0 pp |
| V3 | 6 | 4 | montante | malha | 53,0% | 28,5% | 6/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,8 pp |
| V3 | 6 | 5 | espada-longa | nenhuma | 63,1% | 18,9% | 7/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| V3 | 6 | 5 | espada-longa | gambeson | 66,3% | 24,6% | 15/19/24 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V3 | 6 | 5 | espada-longa | malha | 66,1% | 29,4% | 128/141/143 | 99,7% | 50,0% [18,8%; 81,2%], n=6 | 33,3 pp |
| V3 | 6 | 5 | montante | nenhuma | 52,1% | 10,7% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V3 | 6 | 5 | montante | gambeson | 52,0% | 21,0% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,0 pp |
| V3 | 6 | 5 | montante | malha | 53,0% | 28,5% | 6/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,8 pp |
| V3 | 6 | 6 | espada-longa | nenhuma | 63,5% | 19,0% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,0 pp |
| V3 | 6 | 6 | espada-longa | gambeson | 67,2% | 24,1% | 18/24/33 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| V3 | 6 | 6 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| V3 | 6 | 6 | montante | nenhuma | 51,8% | 11,1% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,0 pp |
| V3 | 6 | 6 | montante | gambeson | 52,0% | 21,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V3 | 6 | 6 | montante | malha | 52,7% | 29,2% | 8/10/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V3 | 8 | 0 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V3 | 8 | 0 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V3 | 8 | 0 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V3 | 8 | 0 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V3 | 8 | 0 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V3 | 8 | 0 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V3 | 8 | 1 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V3 | 8 | 1 | espada-longa | gambeson | 57,9% | 25,5% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| V3 | 8 | 1 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V3 | 8 | 1 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V3 | 8 | 1 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V3 | 8 | 1 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V3 | 8 | 2 | espada-longa | nenhuma | 57,2% | 17,7% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| V3 | 8 | 2 | espada-longa | gambeson | 58,1% | 25,4% | 10/12/15 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,6 pp |
| V3 | 8 | 2 | espada-longa | malha | 57,9% | 30,8% | 32/44/59 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| V3 | 8 | 2 | montante | nenhuma | 47,4% | 9,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,0 pp |
| V3 | 8 | 2 | montante | gambeson | 47,6% | 18,7% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,6 pp |
| V3 | 8 | 2 | montante | malha | 47,4% | 27,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V3 | 8 | 3 | espada-longa | nenhuma | 57,2% | 17,7% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| V3 | 8 | 3 | espada-longa | gambeson | 58,1% | 25,4% | 10/12/15 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,6 pp |
| V3 | 8 | 3 | espada-longa | malha | 57,9% | 30,8% | 32/44/59 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| V3 | 8 | 3 | montante | nenhuma | 47,4% | 9,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,0 pp |
| V3 | 8 | 3 | montante | gambeson | 47,6% | 18,7% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,6 pp |
| V3 | 8 | 3 | montante | malha | 47,4% | 27,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V3 | 8 | 4 | espada-longa | nenhuma | 57,3% | 18,1% | 6/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,8 pp |
| V3 | 8 | 4 | espada-longa | gambeson | 58,4% | 25,6% | 12/15/19 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,2 pp |
| V3 | 8 | 4 | espada-longa | malha | 58,2% | 30,7% | 67/89/116 | 0,6% | 50,0% [47,8%; 52,2%], n=1988 | 1,6 pp |
| V3 | 8 | 4 | montante | nenhuma | 47,8% | 9,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| V3 | 8 | 4 | montante | gambeson | 47,3% | 18,8% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,0 pp |
| V3 | 8 | 4 | montante | malha | 47,4% | 27,4% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V3 | 8 | 5 | espada-longa | nenhuma | 57,3% | 18,1% | 6/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,8 pp |
| V3 | 8 | 5 | espada-longa | gambeson | 58,4% | 25,6% | 12/15/19 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,2 pp |
| V3 | 8 | 5 | espada-longa | malha | 58,2% | 30,7% | 67/89/116 | 0,6% | 50,0% [47,8%; 52,2%], n=1988 | 1,6 pp |
| V3 | 8 | 5 | montante | nenhuma | 47,8% | 9,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| V3 | 8 | 5 | montante | gambeson | 47,3% | 18,8% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,0 pp |
| V3 | 8 | 5 | montante | malha | 47,4% | 27,4% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V3 | 8 | 6 | espada-longa | nenhuma | 57,7% | 18,2% | 7/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| V3 | 8 | 6 | espada-longa | gambeson | 59,2% | 25,1% | 15/19/24 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| V3 | 8 | 6 | espada-longa | malha | 59,2% | 31,9% | não concluiu | 100,0% | n/d | n/d |
| V3 | 8 | 6 | montante | nenhuma | 48,0% | 9,6% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| V3 | 8 | 6 | montante | gambeson | 47,3% | 18,8% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,0 pp |
| V3 | 8 | 6 | montante | malha | 47,3% | 27,5% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,4 pp |
| V3 | 12 | 0 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V3 | 12 | 0 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V3 | 12 | 0 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V3 | 12 | 0 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V3 | 12 | 0 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V3 | 12 | 0 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V3 | 12 | 1 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V3 | 12 | 1 | espada-longa | gambeson | 47,7% | 24,2% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V3 | 12 | 1 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V3 | 12 | 1 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V3 | 12 | 1 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V3 | 12 | 1 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V3 | 12 | 2 | espada-longa | nenhuma | 48,1% | 16,0% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V3 | 12 | 2 | espada-longa | gambeson | 48,3% | 23,9% | 7/9/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V3 | 12 | 2 | espada-longa | malha | 48,3% | 30,4% | 15/21/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V3 | 12 | 2 | montante | nenhuma | 39,1% | 9,0% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V3 | 12 | 2 | montante | gambeson | 39,4% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V3 | 12 | 2 | montante | malha | 39,5% | 24,8% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| V3 | 12 | 3 | espada-longa | nenhuma | 48,1% | 16,0% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V3 | 12 | 3 | espada-longa | gambeson | 48,3% | 23,9% | 7/9/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V3 | 12 | 3 | espada-longa | malha | 48,3% | 30,4% | 15/21/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V3 | 12 | 3 | montante | nenhuma | 39,1% | 9,0% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V3 | 12 | 3 | montante | gambeson | 39,4% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V3 | 12 | 3 | montante | malha | 39,5% | 24,8% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| V3 | 12 | 4 | espada-longa | nenhuma | 48,1% | 16,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| V3 | 12 | 4 | espada-longa | gambeson | 48,3% | 24,0% | 9/11/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,8 pp |
| V3 | 12 | 4 | espada-longa | malha | 48,3% | 30,5% | 23/31/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| V3 | 12 | 4 | montante | nenhuma | 39,1% | 8,9% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V3 | 12 | 4 | montante | gambeson | 39,5% | 17,0% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,6 pp |
| V3 | 12 | 4 | montante | malha | 39,5% | 24,6% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| V3 | 12 | 5 | espada-longa | nenhuma | 48,1% | 16,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| V3 | 12 | 5 | espada-longa | gambeson | 48,3% | 24,0% | 9/11/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,8 pp |
| V3 | 12 | 5 | espada-longa | malha | 48,3% | 30,5% | 23/31/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| V3 | 12 | 5 | montante | nenhuma | 39,1% | 8,9% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V3 | 12 | 5 | montante | gambeson | 39,5% | 17,0% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,6 pp |
| V3 | 12 | 5 | montante | malha | 39,5% | 24,6% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| V3 | 12 | 6 | espada-longa | nenhuma | 47,7% | 16,5% | 6/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| V3 | 12 | 6 | espada-longa | gambeson | 48,4% | 24,2% | 11/13/17 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,2 pp |
| V3 | 12 | 6 | espada-longa | malha | 48,4% | 30,9% | 38/53/71 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V3 | 12 | 6 | montante | nenhuma | 39,7% | 8,6% | 2/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V3 | 12 | 6 | montante | gambeson | 39,4% | 17,2% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V3 | 12 | 6 | montante | malha | 39,5% | 24,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V2 | 6 | 0 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V2 | 6 | 0 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V2 | 6 | 0 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V2 | 6 | 0 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V2 | 6 | 0 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V2 | 6 | 0 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V2 | 6 | 1 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V2 | 6 | 1 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V2 | 6 | 1 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V2 | 6 | 1 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V2 | 6 | 1 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V2 | 6 | 1 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V2 | 6 | 2 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V2 | 6 | 2 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V2 | 6 | 2 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V2 | 6 | 2 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V2 | 6 | 2 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V2 | 6 | 2 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V2 | 6 | 3 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V2 | 6 | 3 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V2 | 6 | 3 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V2 | 6 | 3 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V2 | 6 | 3 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V2 | 6 | 3 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V2 | 6 | 4 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V2 | 6 | 4 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V2 | 6 | 4 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V2 | 6 | 4 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V2 | 6 | 4 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V2 | 6 | 4 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V2 | 6 | 5 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V2 | 6 | 5 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V2 | 6 | 5 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V2 | 6 | 5 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V2 | 6 | 5 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V2 | 6 | 5 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V2 | 6 | 6 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V2 | 6 | 6 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V2 | 6 | 6 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V2 | 6 | 6 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V2 | 6 | 6 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V2 | 6 | 6 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V2 | 8 | 0 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V2 | 8 | 0 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V2 | 8 | 0 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V2 | 8 | 0 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V2 | 8 | 0 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V2 | 8 | 0 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V2 | 8 | 1 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V2 | 8 | 1 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V2 | 8 | 1 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V2 | 8 | 1 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V2 | 8 | 1 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V2 | 8 | 1 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V2 | 8 | 2 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V2 | 8 | 2 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V2 | 8 | 2 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V2 | 8 | 2 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V2 | 8 | 2 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V2 | 8 | 2 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V2 | 8 | 3 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V2 | 8 | 3 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V2 | 8 | 3 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V2 | 8 | 3 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V2 | 8 | 3 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V2 | 8 | 3 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V2 | 8 | 4 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V2 | 8 | 4 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V2 | 8 | 4 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V2 | 8 | 4 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V2 | 8 | 4 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V2 | 8 | 4 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V2 | 8 | 5 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V2 | 8 | 5 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V2 | 8 | 5 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V2 | 8 | 5 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V2 | 8 | 5 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V2 | 8 | 5 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V2 | 8 | 6 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V2 | 8 | 6 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V2 | 8 | 6 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V2 | 8 | 6 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V2 | 8 | 6 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V2 | 8 | 6 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V2 | 12 | 0 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V2 | 12 | 0 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V2 | 12 | 0 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V2 | 12 | 0 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V2 | 12 | 0 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V2 | 12 | 0 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V2 | 12 | 1 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V2 | 12 | 1 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V2 | 12 | 1 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V2 | 12 | 1 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V2 | 12 | 1 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V2 | 12 | 1 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V2 | 12 | 2 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V2 | 12 | 2 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V2 | 12 | 2 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V2 | 12 | 2 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V2 | 12 | 2 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V2 | 12 | 2 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V2 | 12 | 3 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V2 | 12 | 3 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V2 | 12 | 3 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V2 | 12 | 3 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V2 | 12 | 3 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V2 | 12 | 3 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V2 | 12 | 4 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V2 | 12 | 4 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V2 | 12 | 4 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V2 | 12 | 4 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V2 | 12 | 4 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V2 | 12 | 4 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V2 | 12 | 5 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V2 | 12 | 5 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V2 | 12 | 5 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V2 | 12 | 5 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V2 | 12 | 5 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V2 | 12 | 5 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V2 | 12 | 6 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V2 | 12 | 6 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V2 | 12 | 6 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V2 | 12 | 6 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V2 | 12 | 6 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V2 | 12 | 6 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V3 | 6 | 0 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V3 | 6 | 0 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V3 | 6 | 0 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V3 | 6 | 0 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V3 | 6 | 0 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V3 | 6 | 0 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V3 | 6 | 1 | espada-longa | nenhuma | 62,8% | 18,8% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,0 pp |
| V1+V3 | 6 | 1 | espada-longa | gambeson | 64,1% | 26,3% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,8 pp |
| V1+V3 | 6 | 1 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| V1+V3 | 6 | 1 | montante | nenhuma | 51,9% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 11,4 pp |
| V1+V3 | 6 | 1 | montante | gambeson | 51,8% | 21,0% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,2 pp |
| V1+V3 | 6 | 1 | montante | malha | 52,2% | 29,3% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,4 pp |
| V1+V3 | 6 | 2 | espada-longa | nenhuma | 63,2% | 18,6% | 6/7/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V1+V3 | 6 | 2 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1+V3 | 6 | 2 | espada-longa | malha | 64,3% | 29,2% | 63/82/105 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,0 pp |
| V1+V3 | 6 | 2 | montante | nenhuma | 52,2% | 10,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 14,0 pp |
| V1+V3 | 6 | 2 | montante | gambeson | 52,0% | 20,8% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,0 pp |
| V1+V3 | 6 | 2 | montante | malha | 52,4% | 28,8% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V3 | 6 | 3 | espada-longa | nenhuma | 63,2% | 18,6% | 6/7/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V1+V3 | 6 | 3 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1+V3 | 6 | 3 | espada-longa | malha | 64,3% | 29,2% | 63/82/105 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,0 pp |
| V1+V3 | 6 | 3 | montante | nenhuma | 52,2% | 10,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 14,0 pp |
| V1+V3 | 6 | 3 | montante | gambeson | 52,0% | 20,8% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,0 pp |
| V1+V3 | 6 | 3 | montante | malha | 52,4% | 28,8% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V3 | 6 | 4 | espada-longa | nenhuma | 63,2% | 19,1% | 7/8/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 6 | 4 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1+V3 | 6 | 4 | espada-longa | malha | 66,1% | 29,4% | 128/141/143 | 99,7% | 50,0% [18,8%; 81,2%], n=6 | 33,3 pp |
| V1+V3 | 6 | 4 | montante | nenhuma | 52,1% | 10,7% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V3 | 6 | 4 | montante | gambeson | 52,1% | 20,7% | 5/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V1+V3 | 6 | 4 | montante | malha | 52,9% | 28,6% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V3 | 6 | 5 | espada-longa | nenhuma | 63,2% | 19,1% | 7/8/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 6 | 5 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1+V3 | 6 | 5 | espada-longa | malha | 66,1% | 29,4% | 128/141/143 | 99,7% | 50,0% [18,8%; 81,2%], n=6 | 33,3 pp |
| V1+V3 | 6 | 5 | montante | nenhuma | 52,1% | 10,7% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V3 | 6 | 5 | montante | gambeson | 52,1% | 20,7% | 5/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,0 pp |
| V1+V3 | 6 | 5 | montante | malha | 52,9% | 28,6% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V3 | 6 | 6 | espada-longa | nenhuma | 63,6% | 19,0% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1+V3 | 6 | 6 | espada-longa | gambeson | 64,1% | 26,3% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp |
| V1+V3 | 6 | 6 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| V1+V3 | 6 | 6 | montante | nenhuma | 51,8% | 11,1% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,0 pp |
| V1+V3 | 6 | 6 | montante | gambeson | 52,1% | 20,6% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| V1+V3 | 6 | 6 | montante | malha | 52,7% | 29,4% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,8 pp |
| V1+V3 | 8 | 0 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V3 | 8 | 0 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V3 | 8 | 0 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V3 | 8 | 0 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V3 | 8 | 0 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V3 | 8 | 0 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V3 | 8 | 1 | espada-longa | nenhuma | 56,8% | 18,4% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 12,2 pp |
| V1+V3 | 8 | 1 | espada-longa | gambeson | 57,4% | 26,4% | 8/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| V1+V3 | 8 | 1 | espada-longa | malha | 57,8% | 30,4% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V3 | 8 | 1 | montante | nenhuma | 47,3% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,4 pp |
| V1+V3 | 8 | 1 | montante | gambeson | 47,7% | 18,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 8,8 pp |
| V1+V3 | 8 | 1 | montante | malha | 47,4% | 27,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,6 pp |
| V1+V3 | 8 | 2 | espada-longa | nenhuma | 57,2% | 17,7% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| V1+V3 | 8 | 2 | espada-longa | gambeson | 57,6% | 26,2% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,4 pp |
| V1+V3 | 8 | 2 | espada-longa | malha | 57,9% | 30,8% | 32/44/59 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| V1+V3 | 8 | 2 | montante | nenhuma | 47,4% | 9,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,0 pp |
| V1+V3 | 8 | 2 | montante | gambeson | 47,6% | 18,8% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,8 pp |
| V1+V3 | 8 | 2 | montante | malha | 47,4% | 27,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V3 | 8 | 3 | espada-longa | nenhuma | 57,2% | 17,7% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| V1+V3 | 8 | 3 | espada-longa | gambeson | 57,6% | 26,2% | 8/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,4 pp |
| V1+V3 | 8 | 3 | espada-longa | malha | 57,9% | 30,8% | 32/44/59 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| V1+V3 | 8 | 3 | montante | nenhuma | 47,4% | 9,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,0 pp |
| V1+V3 | 8 | 3 | montante | gambeson | 47,6% | 18,8% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,8 pp |
| V1+V3 | 8 | 3 | montante | malha | 47,4% | 27,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V3 | 8 | 4 | espada-longa | nenhuma | 57,2% | 18,1% | 6/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1+V3 | 8 | 4 | espada-longa | gambeson | 57,6% | 26,0% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1+V3 | 8 | 4 | espada-longa | malha | 58,2% | 30,7% | 67/89/116 | 0,6% | 50,0% [47,8%; 52,2%], n=1988 | 1,6 pp |
| V1+V3 | 8 | 4 | montante | nenhuma | 47,8% | 9,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| V1+V3 | 8 | 4 | montante | gambeson | 47,4% | 18,6% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,0 pp |
| V1+V3 | 8 | 4 | montante | malha | 47,4% | 27,4% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V3 | 8 | 5 | espada-longa | nenhuma | 57,2% | 18,1% | 6/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1+V3 | 8 | 5 | espada-longa | gambeson | 57,6% | 26,0% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1+V3 | 8 | 5 | espada-longa | malha | 58,2% | 30,7% | 67/89/116 | 0,6% | 50,0% [47,8%; 52,2%], n=1988 | 1,6 pp |
| V1+V3 | 8 | 5 | montante | nenhuma | 47,8% | 9,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| V1+V3 | 8 | 5 | montante | gambeson | 47,4% | 18,6% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,0 pp |
| V1+V3 | 8 | 5 | montante | malha | 47,4% | 27,4% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V3 | 8 | 6 | espada-longa | nenhuma | 57,6% | 18,2% | 7/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,6 pp |
| V1+V3 | 8 | 6 | espada-longa | gambeson | 57,6% | 26,0% | 9/9/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp |
| V1+V3 | 8 | 6 | espada-longa | malha | 59,2% | 31,9% | não concluiu | 100,0% | n/d | n/d |
| V1+V3 | 8 | 6 | montante | nenhuma | 48,0% | 9,6% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 10,6 pp |
| V1+V3 | 8 | 6 | montante | gambeson | 47,3% | 18,8% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 9,6 pp |
| V1+V3 | 8 | 6 | montante | malha | 47,3% | 27,4% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| V1+V3 | 12 | 0 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V3 | 12 | 0 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V3 | 12 | 0 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V3 | 12 | 0 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V3 | 12 | 0 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 12 | 0 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V3 | 12 | 1 | espada-longa | nenhuma | 48,1% | 16,0% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| V1+V3 | 12 | 1 | espada-longa | gambeson | 47,6% | 24,1% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V3 | 12 | 1 | espada-longa | malha | 48,3% | 30,4% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V3 | 12 | 1 | montante | nenhuma | 39,0% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| V1+V3 | 12 | 1 | montante | gambeson | 39,6% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 12 | 1 | montante | malha | 39,6% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| V1+V3 | 12 | 2 | espada-longa | nenhuma | 48,1% | 16,0% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V3 | 12 | 2 | espada-longa | gambeson | 47,9% | 24,0% | 7/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1+V3 | 12 | 2 | espada-longa | malha | 48,3% | 30,4% | 15/21/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V1+V3 | 12 | 2 | montante | nenhuma | 39,1% | 9,0% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 12 | 2 | montante | gambeson | 39,4% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 12 | 2 | montante | malha | 39,5% | 24,8% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| V1+V3 | 12 | 3 | espada-longa | nenhuma | 48,1% | 16,0% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| V1+V3 | 12 | 3 | espada-longa | gambeson | 47,9% | 24,0% | 7/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1+V3 | 12 | 3 | espada-longa | malha | 48,3% | 30,4% | 15/21/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| V1+V3 | 12 | 3 | montante | nenhuma | 39,1% | 9,0% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 12 | 3 | montante | gambeson | 39,4% | 16,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 12 | 3 | montante | malha | 39,5% | 24,8% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| V1+V3 | 12 | 4 | espada-longa | nenhuma | 48,1% | 16,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| V1+V3 | 12 | 4 | espada-longa | gambeson | 48,2% | 23,9% | 8/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,6 pp |
| V1+V3 | 12 | 4 | espada-longa | malha | 48,3% | 30,5% | 23/31/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| V1+V3 | 12 | 4 | montante | nenhuma | 39,1% | 8,9% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 12 | 4 | montante | gambeson | 39,5% | 17,0% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,6 pp |
| V1+V3 | 12 | 4 | montante | malha | 39,5% | 24,6% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| V1+V3 | 12 | 5 | espada-longa | nenhuma | 48,1% | 16,0% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,8 pp |
| V1+V3 | 12 | 5 | espada-longa | gambeson | 48,2% | 23,9% | 8/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,6 pp |
| V1+V3 | 12 | 5 | espada-longa | malha | 48,3% | 30,5% | 23/31/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,0 pp |
| V1+V3 | 12 | 5 | montante | nenhuma | 39,1% | 8,9% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| V1+V3 | 12 | 5 | montante | gambeson | 39,5% | 17,0% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,6 pp |
| V1+V3 | 12 | 5 | montante | malha | 39,5% | 24,6% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| V1+V3 | 12 | 6 | espada-longa | nenhuma | 47,7% | 16,5% | 6/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| V1+V3 | 12 | 6 | espada-longa | gambeson | 48,1% | 24,2% | 9/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| V1+V3 | 12 | 6 | espada-longa | malha | 48,4% | 30,9% | 38/53/71 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| V1+V3 | 12 | 6 | montante | nenhuma | 39,7% | 8,6% | 2/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,6 pp |
| V1+V3 | 12 | 6 | montante | gambeson | 39,4% | 17,2% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,8 pp |
| V1+V3 | 12 | 6 | montante | malha | 39,5% | 24,4% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |


## 4. C · Degrau automático de Centelha e variantes

A é X+1; B é X. Dano e golpes necessários são direcionais e vêm das mesmas lutas.

| cenário | soma | confronto | arma | armadura | dano A→B | dano B→A | golpes A→B | golpes B→A | força relativa | vitória A, IC95% | viés | censura |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| regra atual | 6 | 1×0 | espada-longa | nenhuma | 5,80 | 3,16 | 5,87 | 10,76 | 1,835 | 88,8% [87,3%; 90,1%], n=2000 | 2,2 pp | 0,0% |
| regra atual | 6 | 1×0 | espada-longa | gambeson | 2,64 | 2,06 | 12,88 | 16,51 | 1,281 | 77,5% [75,6%; 79,2%], n=2000 | -3,9 pp | 0,0% |
| regra atual | 6 | 1×0 | espada-longa | malha | 0,86 | 0,18 | 39,75 | 187,98 | 4,729 | 99,8% [99,5%; 99,9%], n=2000 | -0,2 pp | 0,0% |
| regra atual | 6 | 1×0 | montante | nenhuma | 9,61 | 4,85 | 3,54 | 7,01 | 1,983 | 77,5% [75,6%; 79,3%], n=2000 | 6,8 pp | 0,0% |
| regra atual | 6 | 1×0 | montante | gambeson | 7,37 | 3,98 | 4,61 | 8,55 | 1,853 | 81,1% [79,3%; 82,8%], n=2000 | 4,8 pp | 0,0% |
| regra atual | 6 | 1×0 | montante | malha | 5,50 | 2,59 | 6,18 | 13,15 | 2,128 | 86,2% [84,6%; 87,6%], n=2000 | 2,8 pp | 0,0% |
| regra atual | 6 | 2×1 | espada-longa | nenhuma | 4,99 | 2,75 | 6,81 | 12,38 | 1,817 | 89,8% [88,4%; 91,1%], n=2000 | -0,9 pp | 0,0% |
| regra atual | 6 | 2×1 | espada-longa | gambeson | 2,00 | 1,74 | 17,00 | 19,56 | 1,150 | 67,0% [64,9%; 69,0%], n=2000 | 1,5 pp | 0,0% |
| regra atual | 6 | 2×1 | espada-longa | malha | 0,43 | 0,06 | 79,07 | 577,76 | 7,307 | 100,0% [99,8%; 100,0%], n=1999 | 0,0 pp | 0,0% |
| regra atual | 6 | 2×1 | montante | nenhuma | 8,88 | 4,53 | 3,83 | 7,51 | 1,962 | 77,7% [75,8%; 79,5%], n=2000 | 7,0 pp | 0,0% |
| regra atual | 6 | 2×1 | montante | gambeson | 6,68 | 3,62 | 5,09 | 9,38 | 1,842 | 82,0% [80,3%; 83,6%], n=2000 | 4,2 pp | 0,0% |
| regra atual | 6 | 2×1 | montante | malha | 4,81 | 2,25 | 7,07 | 15,14 | 2,141 | 87,9% [86,5%; 89,3%], n=2000 | 0,1 pp | 0,0% |
| regra atual | 6 | 3×2 | espada-longa | nenhuma | 4,18 | 2,32 | 8,13 | 14,67 | 1,805 | 91,8% [90,5%; 92,9%], n=2000 | 0,6 pp | 0,0% |
| regra atual | 6 | 3×2 | espada-longa | gambeson | 1,51 | 1,47 | 22,58 | 23,07 | 1,022 | 51,7% [49,5%; 53,9%], n=2000 | 0,4 pp | 0,0% |
| regra atual | 6 | 3×2 | espada-longa | malha | 0,13 | 0,00 | 255,80 | ∞ | n/d | 100,0% [64,6%; 100,0%], n=7 | 0,0 pp | 99,7% |
| regra atual | 6 | 3×2 | montante | nenhuma | 8,26 | 4,08 | 4,11 | 8,33 | 2,024 | 80,0% [78,1%; 81,6%], n=2000 | 7,7 pp | 0,0% |
| regra atual | 6 | 3×2 | montante | gambeson | 5,99 | 3,25 | 5,67 | 10,45 | 1,842 | 83,9% [82,2%; 85,4%], n=2000 | 3,8 pp | 0,0% |
| regra atual | 6 | 3×2 | montante | malha | 4,08 | 1,92 | 8,34 | 17,75 | 2,129 | 89,3% [87,8%; 90,5%], n=2000 | 2,3 pp | 0,0% |
| regra atual | 6 | 4×3 | espada-longa | nenhuma | 3,35 | 1,92 | 10,14 | 17,75 | 1,750 | 90,6% [89,3%; 91,8%], n=2000 | 2,3 pp | 0,0% |
| regra atual | 6 | 4×3 | espada-longa | gambeson | 1,15 | 1,20 | 29,51 | 28,23 | 0,957 | 41,3% [39,2%; 43,5%], n=2000 | 0,1 pp | 0,0% |
| regra atual | 6 | 4×3 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| regra atual | 6 | 4×3 | montante | nenhuma | 7,62 | 3,71 | 4,46 | 9,17 | 2,056 | 80,8% [79,1%; 82,5%], n=2000 | 6,3 pp | 0,0% |
| regra atual | 6 | 4×3 | montante | gambeson | 5,26 | 2,94 | 6,46 | 11,57 | 1,790 | 83,0% [81,2%; 84,5%], n=2000 | 2,1 pp | 0,0% |
| regra atual | 6 | 4×3 | montante | malha | 3,38 | 1,61 | 10,05 | 21,12 | 2,101 | 91,0% [89,7%; 92,2%], n=2000 | 0,2 pp | 0,0% |
| regra atual | 6 | 5×4 | espada-longa | nenhuma | 2,50 | 1,59 | 13,60 | 21,37 | 1,571 | 85,3% [83,6%; 86,7%], n=2000 | 0,3 pp | 0,0% |
| regra atual | 6 | 5×4 | espada-longa | gambeson | 0,94 | 0,97 | 36,20 | 35,13 | 0,970 | 48,6% [46,5%; 50,8%], n=2000 | -1,3 pp | 0,0% |
| regra atual | 6 | 5×4 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| regra atual | 6 | 5×4 | montante | nenhuma | 6,95 | 3,31 | 4,89 | 10,26 | 2,098 | 81,8% [80,0%; 83,4%], n=2000 | 6,9 pp | 0,0% |
| regra atual | 6 | 5×4 | montante | gambeson | 4,55 | 2,63 | 7,46 | 12,91 | 1,729 | 82,8% [81,1%; 84,4%], n=2000 | 1,9 pp | 0,0% |
| regra atual | 6 | 5×4 | montante | malha | 2,70 | 1,36 | 12,59 | 25,05 | 1,990 | 91,0% [89,6%; 92,1%], n=2000 | 0,9 pp | 0,0% |
| regra atual | 6 | 6×5 | espada-longa | nenhuma | 1,85 | 1,32 | 18,43 | 25,84 | 1,402 | 80,0% [78,2%; 81,7%], n=2000 | 0,1 pp | 0,0% |
| regra atual | 6 | 6×5 | espada-longa | gambeson | 0,59 | 0,66 | 57,18 | 51,89 | 0,907 | 0,0% [0,0%; 0,2%], n=1598 | 0,0 pp | 20,1% |
| regra atual | 6 | 6×5 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| regra atual | 6 | 6×5 | montante | nenhuma | 6,31 | 2,94 | 5,39 | 11,58 | 2,150 | 84,5% [82,8%; 86,0%], n=2000 | 4,7 pp | 0,0% |
| regra atual | 6 | 6×5 | montante | gambeson | 3,83 | 2,32 | 8,89 | 14,67 | 1,651 | 81,3% [79,5%; 82,9%], n=2000 | -0,1 pp | 0,0% |
| regra atual | 6 | 6×5 | montante | malha | 2,08 | 1,14 | 16,33 | 29,80 | 1,825 | 90,3% [89,0%; 91,6%], n=2000 | -0,1 pp | 0,0% |
| regra atual | 8 | 1×0 | espada-longa | nenhuma | 6,11 | 3,33 | 5,56 | 10,22 | 1,837 | 84,8% [83,1%; 86,3%], n=2000 | 4,3 pp | 0,0% |
| regra atual | 8 | 1×0 | espada-longa | gambeson | 3,34 | 2,18 | 10,17 | 15,63 | 1,537 | 86,3% [84,7%; 87,7%], n=2000 | 1,5 pp | 0,0% |
| regra atual | 8 | 1×0 | espada-longa | malha | 1,32 | 0,35 | 25,80 | 98,02 | 3,800 | 98,7% [98,1%; 99,1%], n=2000 | 0,4 pp | 0,0% |
| regra atual | 8 | 1×0 | montante | nenhuma | 9,99 | 5,05 | 3,40 | 6,73 | 1,977 | 75,0% [73,1%; 76,8%], n=2000 | 8,4 pp | 0,0% |
| regra atual | 8 | 1×0 | montante | gambeson | 7,98 | 4,36 | 4,26 | 7,80 | 1,830 | 77,9% [76,0%; 79,7%], n=2000 | 7,4 pp | 0,0% |
| regra atual | 8 | 1×0 | montante | malha | 6,24 | 3,04 | 5,45 | 11,19 | 2,055 | 82,5% [80,8%; 84,1%], n=2000 | 4,4 pp | 0,0% |
| regra atual | 8 | 2×1 | espada-longa | nenhuma | 5,38 | 2,95 | 6,32 | 11,54 | 1,826 | 86,1% [84,5%; 87,5%], n=2000 | 3,5 pp | 0,0% |
| regra atual | 8 | 2×1 | espada-longa | gambeson | 2,58 | 1,87 | 13,18 | 18,16 | 1,378 | 80,3% [78,5%; 82,0%], n=2000 | -1,0 pp | 0,0% |
| regra atual | 8 | 2×1 | espada-longa | malha | 0,80 | 0,17 | 42,40 | 204,02 | 4,812 | 99,8% [99,4%; 99,9%], n=2000 | -0,1 pp | 0,0% |
| regra atual | 8 | 2×1 | montante | nenhuma | 9,43 | 4,76 | 3,61 | 7,14 | 1,981 | 75,5% [73,6%; 77,4%], n=2000 | 9,1 pp | 0,0% |
| regra atual | 8 | 2×1 | montante | gambeson | 7,41 | 3,94 | 4,59 | 8,62 | 1,880 | 79,8% [78,0%; 81,5%], n=2000 | 7,7 pp | 0,0% |
| regra atual | 8 | 2×1 | montante | malha | 5,64 | 2,68 | 6,02 | 12,70 | 2,109 | 84,4% [82,7%; 85,9%], n=2000 | 4,5 pp | 0,0% |
| regra atual | 8 | 3×2 | espada-longa | nenhuma | 4,66 | 2,53 | 7,29 | 13,43 | 1,842 | 87,9% [86,4%; 89,3%], n=2000 | 3,6 pp | 0,0% |
| regra atual | 8 | 3×2 | espada-longa | gambeson | 1,97 | 1,61 | 17,27 | 21,05 | 1,219 | 70,0% [68,0%; 72,0%], n=2000 | -0,6 pp | 0,0% |
| regra atual | 8 | 3×2 | espada-longa | malha | 0,40 | 0,05 | 84,90 | 618,97 | 7,291 | 100,0% [99,8%; 100,0%], n=1993 | 0,0 pp | 0,3% |
| regra atual | 8 | 3×2 | montante | nenhuma | 8,78 | 4,44 | 3,87 | 7,65 | 1,977 | 76,8% [74,9%; 78,6%], n=2000 | 8,4 pp | 0,0% |
| regra atual | 8 | 3×2 | montante | gambeson | 6,79 | 3,62 | 5,01 | 9,40 | 1,876 | 81,2% [79,4%; 82,9%], n=2000 | 7,4 pp | 0,0% |
| regra atual | 8 | 3×2 | montante | malha | 5,04 | 2,35 | 6,75 | 14,45 | 2,140 | 86,1% [84,5%; 87,5%], n=2000 | 4,2 pp | 0,0% |
| regra atual | 8 | 4×3 | espada-longa | nenhuma | 3,93 | 2,13 | 8,65 | 15,94 | 1,844 | 90,1% [88,7%; 91,3%], n=2000 | 1,6 pp | 0,0% |
| regra atual | 8 | 4×3 | espada-longa | gambeson | 1,51 | 1,39 | 22,45 | 24,42 | 1,088 | 59,1% [56,9%; 61,2%], n=2000 | 0,7 pp | 0,0% |
| regra atual | 8 | 4×3 | espada-longa | malha | 0,12 | 0,00 | 280,75 | ∞ | n/d | 100,0% [43,9%; 100,0%], n=3 | n/d | 99,9% |
| regra atual | 8 | 4×3 | montante | nenhuma | 8,20 | 4,12 | 4,14 | 8,26 | 1,993 | 78,0% [76,2%; 79,8%], n=2000 | 7,7 pp | 0,0% |
| regra atual | 8 | 4×3 | montante | gambeson | 6,15 | 3,29 | 5,53 | 10,32 | 1,867 | 81,8% [80,1%; 83,5%], n=2000 | 5,7 pp | 0,0% |
| regra atual | 8 | 4×3 | montante | malha | 4,40 | 2,04 | 7,73 | 16,65 | 2,153 | 87,1% [85,6%; 88,5%], n=2000 | 3,4 pp | 0,0% |
| regra atual | 8 | 5×4 | espada-longa | nenhuma | 3,17 | 1,74 | 10,72 | 19,57 | 1,825 | 89,6% [88,2%; 90,9%], n=2000 | 1,9 pp | 0,0% |
| regra atual | 8 | 5×4 | espada-longa | gambeson | 1,18 | 1,20 | 28,70 | 28,44 | 0,991 | 47,3% [45,1%; 49,5%], n=2000 | -2,6 pp | 0,0% |
| regra atual | 8 | 5×4 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| regra atual | 8 | 5×4 | montante | nenhuma | 7,53 | 3,79 | 4,51 | 8,97 | 1,986 | 78,4% [76,5%; 80,1%], n=2000 | 7,6 pp | 0,0% |
| regra atual | 8 | 5×4 | montante | gambeson | 5,53 | 2,94 | 6,15 | 11,57 | 1,882 | 83,2% [81,4%; 84,7%], n=2000 | 3,5 pp | 0,0% |
| regra atual | 8 | 5×4 | montante | malha | 3,79 | 1,72 | 8,98 | 19,77 | 2,202 | 89,5% [88,1%; 90,8%], n=2000 | 1,4 pp | 0,0% |
| regra atual | 8 | 6×5 | espada-longa | nenhuma | 2,41 | 1,46 | 14,13 | 23,33 | 1,651 | 86,6% [85,0%; 88,0%], n=2000 | -0,1 pp | 0,0% |
| regra atual | 8 | 6×5 | espada-longa | gambeson | 1,01 | 1,04 | 33,58 | 32,63 | 0,972 | 48,5% [46,3%; 50,7%], n=2000 | -1,0 pp | 0,0% |
| regra atual | 8 | 6×5 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| regra atual | 8 | 6×5 | montante | nenhuma | 6,92 | 3,40 | 4,91 | 9,99 | 2,033 | 79,7% [77,9%; 81,4%], n=2000 | 6,0 pp | 0,0% |
| regra atual | 8 | 6×5 | montante | gambeson | 4,89 | 2,62 | 6,95 | 12,97 | 1,865 | 84,0% [82,3%; 85,5%], n=2000 | 3,9 pp | 0,0% |
| regra atual | 8 | 6×5 | montante | malha | 3,13 | 1,46 | 10,85 | 23,37 | 2,153 | 90,8% [89,5%; 92,0%], n=2000 | 1,6 pp | 0,0% |
| regra atual | 12 | 1×0 | espada-longa | nenhuma | 6,37 | 3,66 | 5,34 | 9,29 | 1,740 | 77,1% [75,2%; 78,9%], n=2000 | 2,2 pp | 0,0% |
| regra atual | 12 | 1×0 | espada-longa | gambeson | 4,29 | 2,48 | 7,93 | 13,70 | 1,728 | 85,1% [83,5%; 86,6%], n=2000 | -0,2 pp | 0,0% |
| regra atual | 12 | 1×0 | espada-longa | malha | 2,29 | 0,79 | 14,83 | 43,11 | 2,907 | 93,8% [92,7%; 94,8%], n=2000 | 2,2 pp | 0,0% |
| regra atual | 12 | 1×0 | montante | nenhuma | 10,06 | 5,73 | 3,38 | 5,93 | 1,754 | 69,9% [67,9%; 71,9%], n=2000 | 3,6 pp | 0,0% |
| regra atual | 12 | 1×0 | montante | gambeson | 8,79 | 4,90 | 3,87 | 6,94 | 1,795 | 72,9% [70,9%; 74,8%], n=2000 | 2,4 pp | 0,0% |
| regra atual | 12 | 1×0 | montante | malha | 7,30 | 3,82 | 4,66 | 8,89 | 1,909 | 75,0% [73,1%; 76,8%], n=2000 | 2,2 pp | 0,0% |
| regra atual | 12 | 2×1 | espada-longa | nenhuma | 5,82 | 3,24 | 5,84 | 10,49 | 1,796 | 79,4% [77,6%; 81,1%], n=2000 | 2,0 pp | 0,0% |
| regra atual | 12 | 2×1 | espada-longa | gambeson | 3,68 | 2,15 | 9,24 | 15,83 | 1,714 | 86,4% [84,8%; 87,8%], n=2000 | 0,4 pp | 0,0% |
| regra atual | 12 | 2×1 | espada-longa | malha | 1,66 | 0,51 | 20,43 | 66,98 | 3,279 | 96,6% [95,7%; 97,3%], n=2000 | 1,0 pp | 0,0% |
| regra atual | 12 | 2×1 | montante | nenhuma | 9,59 | 5,44 | 3,55 | 6,25 | 1,763 | 70,6% [68,6%; 72,6%], n=2000 | 3,6 pp | 0,0% |
| regra atual | 12 | 2×1 | montante | gambeson | 8,28 | 4,57 | 4,11 | 7,44 | 1,812 | 73,7% [71,7%; 75,5%], n=2000 | 2,3 pp | 0,0% |
| regra atual | 12 | 2×1 | montante | malha | 6,78 | 3,53 | 5,01 | 9,64 | 1,923 | 76,3% [74,3%; 78,1%], n=2000 | 1,7 pp | 0,0% |
| regra atual | 12 | 3×2 | espada-longa | nenhuma | 5,24 | 2,85 | 6,49 | 11,94 | 1,841 | 82,1% [80,4%; 83,7%], n=2000 | 0,0 pp | 0,0% |
| regra atual | 12 | 3×2 | espada-longa | gambeson | 3,06 | 1,82 | 11,11 | 18,73 | 1,687 | 87,3% [85,7%; 88,6%], n=2000 | 0,5 pp | 0,0% |
| regra atual | 12 | 3×2 | espada-longa | malha | 1,13 | 0,29 | 30,21 | 115,43 | 3,822 | 98,6% [97,9%; 99,0%], n=2000 | 0,3 pp | 0,0% |
| regra atual | 12 | 3×2 | montante | nenhuma | 9,16 | 5,11 | 3,71 | 6,65 | 1,792 | 72,0% [69,9%; 73,9%], n=2000 | 2,5 pp | 0,0% |
| regra atual | 12 | 3×2 | montante | gambeson | 7,73 | 4,32 | 4,40 | 7,87 | 1,789 | 73,5% [71,5%; 75,3%], n=2000 | 3,1 pp | 0,0% |
| regra atual | 12 | 3×2 | montante | malha | 6,24 | 3,22 | 5,45 | 10,55 | 1,937 | 77,3% [75,4%; 79,0%], n=2000 | -0,1 pp | 0,0% |
| regra atual | 12 | 4×3 | espada-longa | nenhuma | 4,64 | 2,50 | 7,33 | 13,58 | 1,854 | 83,3% [81,6%; 84,8%], n=2000 | 0,7 pp | 0,0% |
| regra atual | 12 | 4×3 | espada-longa | gambeson | 2,41 | 1,57 | 14,13 | 21,71 | 1,536 | 83,2% [81,5%; 84,8%], n=2000 | 0,0 pp | 0,0% |
| regra atual | 12 | 4×3 | espada-longa | malha | 0,68 | 0,14 | 49,64 | 239,53 | 4,825 | 99,9% [99,6%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| regra atual | 12 | 4×3 | montante | nenhuma | 8,81 | 4,78 | 3,86 | 7,11 | 1,842 | 73,0% [71,1%; 74,9%], n=2000 | 2,3 pp | 0,0% |
| regra atual | 12 | 4×3 | montante | gambeson | 7,19 | 4,01 | 4,73 | 8,49 | 1,794 | 74,9% [72,9%; 76,7%], n=2000 | 2,3 pp | 0,0% |
| regra atual | 12 | 4×3 | montante | malha | 5,77 | 2,92 | 5,89 | 11,65 | 1,976 | 78,5% [76,7%; 80,3%], n=2000 | -0,9 pp | 0,0% |
| regra atual | 12 | 5×4 | espada-longa | nenhuma | 4,06 | 2,14 | 8,37 | 15,92 | 1,902 | 85,4% [83,7%; 86,8%], n=2000 | 0,9 pp | 0,0% |
| regra atual | 12 | 5×4 | espada-longa | gambeson | 1,86 | 1,35 | 18,25 | 25,20 | 1,381 | 78,1% [76,2%; 79,9%], n=2000 | -0,4 pp | 0,0% |
| regra atual | 12 | 5×4 | espada-longa | malha | 0,34 | 0,05 | 98,74 | 735,61 | 7,450 | 100,0% [99,8%; 100,0%], n=1949 | 0,0 pp | 2,5% |
| regra atual | 12 | 5×4 | montante | nenhuma | 8,39 | 4,37 | 4,05 | 7,77 | 1,917 | 74,2% [72,2%; 76,1%], n=2000 | 0,2 pp | 0,0% |
| regra atual | 12 | 5×4 | montante | gambeson | 6,69 | 3,67 | 5,08 | 9,28 | 1,826 | 76,4% [74,5%; 78,3%], n=2000 | 1,1 pp | 0,0% |
| regra atual | 12 | 5×4 | montante | malha | 5,31 | 2,62 | 6,41 | 12,98 | 2,026 | 80,5% [78,7%; 82,2%], n=2000 | -1,2 pp | 0,0% |
| regra atual | 12 | 6×5 | espada-longa | nenhuma | 3,46 | 1,81 | 9,83 | 18,82 | 1,915 | 86,9% [85,4%; 88,3%], n=2000 | -0,2 pp | 0,0% |
| regra atual | 12 | 6×5 | espada-longa | gambeson | 1,46 | 1,18 | 23,34 | 28,87 | 1,237 | 70,5% [68,5%; 72,5%], n=2000 | 1,2 pp | 0,0% |
| regra atual | 12 | 6×5 | espada-longa | malha | 0,10 | 0,00 | 346,36 | ∞ | n/d | 100,0% [20,7%; 100,0%], n=1 | n/d | 100,0% |
| regra atual | 12 | 6×5 | montante | nenhuma | 7,91 | 4,04 | 4,30 | 8,41 | 1,956 | 74,7% [72,7%; 76,6%], n=2000 | 1,2 pp | 0,0% |
| regra atual | 12 | 6×5 | montante | gambeson | 6,23 | 3,37 | 5,46 | 10,09 | 1,848 | 77,5% [75,6%; 79,3%], n=2000 | 1,2 pp | 0,0% |
| regra atual | 12 | 6×5 | montante | malha | 4,81 | 2,31 | 7,07 | 14,69 | 2,079 | 81,7% [79,9%; 83,3%], n=2000 | 0,0 pp | 0,0% |
| V1 | 6 | 1×0 | espada-longa | nenhuma | 5,79 | 3,25 | 5,87 | 10,45 | 1,779 | 87,4% [85,8%; 88,7%], n=2000 | 3,3 pp | 0,0% |
| V1 | 6 | 1×0 | espada-longa | gambeson | 3,99 | 3,17 | 8,53 | 10,74 | 1,259 | 78,5% [76,6%; 80,2%], n=2000 | 12,3 pp | 0,0% |
| V1 | 6 | 1×0 | espada-longa | malha | 0,86 | 0,18 | 39,75 | 187,98 | 4,729 | 99,8% [99,5%; 99,9%], n=2000 | -0,2 pp | 0,0% |
| V1 | 6 | 1×0 | montante | nenhuma | 9,61 | 4,85 | 3,54 | 7,01 | 1,983 | 77,5% [75,6%; 79,3%], n=2000 | 6,8 pp | 0,0% |
| V1 | 6 | 1×0 | montante | gambeson | 7,45 | 4,07 | 4,56 | 8,36 | 1,833 | 80,8% [79,0%; 82,4%], n=2000 | 4,7 pp | 0,0% |
| V1 | 6 | 1×0 | montante | malha | 5,50 | 2,60 | 6,18 | 13,08 | 2,116 | 86,1% [84,5%; 87,5%], n=2000 | 2,7 pp | 0,0% |
| V1 | 6 | 2×1 | espada-longa | nenhuma | 5,10 | 2,99 | 6,66 | 11,36 | 1,705 | 88,1% [86,6%; 89,4%], n=2000 | 1,6 pp | 0,0% |
| V1 | 6 | 2×1 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1 | 6 | 2×1 | espada-longa | malha | 0,43 | 0,06 | 79,07 | 577,76 | 7,307 | 100,0% [99,8%; 100,0%], n=1999 | 0,0 pp | 0,0% |
| V1 | 6 | 2×1 | montante | nenhuma | 8,88 | 4,53 | 3,83 | 7,51 | 1,962 | 77,7% [75,8%; 79,5%], n=2000 | 7,0 pp | 0,0% |
| V1 | 6 | 2×1 | montante | gambeson | 6,87 | 3,79 | 4,95 | 8,98 | 1,814 | 81,5% [79,8%; 83,2%], n=2000 | 5,3 pp | 0,0% |
| V1 | 6 | 2×1 | montante | malha | 4,83 | 2,28 | 7,04 | 14,92 | 2,119 | 87,8% [86,3%; 89,2%], n=2000 | 0,6 pp | 0,0% |
| V1 | 6 | 3×2 | espada-longa | nenhuma | 4,56 | 2,80 | 7,46 | 12,16 | 1,629 | 87,5% [86,0%; 88,9%], n=2000 | 2,8 pp | 0,0% |
| V1 | 6 | 3×2 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1 | 6 | 3×2 | espada-longa | malha | 0,13 | 0,00 | 255,80 | ∞ | n/d | 100,0% [64,6%; 100,0%], n=7 | 0,0 pp | 99,7% |
| V1 | 6 | 3×2 | montante | nenhuma | 8,27 | 4,09 | 4,11 | 8,30 | 2,019 | 79,8% [78,0%; 81,5%], n=2000 | 7,8 pp | 0,0% |
| V1 | 6 | 3×2 | montante | gambeson | 6,36 | 3,58 | 5,35 | 9,51 | 1,778 | 82,2% [80,4%; 83,8%], n=2000 | 4,3 pp | 0,0% |
| V1 | 6 | 3×2 | montante | malha | 4,16 | 2,00 | 8,16 | 16,99 | 2,082 | 89,0% [87,6%; 90,3%], n=2000 | 2,4 pp | 0,0% |
| V1 | 6 | 4×3 | espada-longa | nenhuma | 4,16 | 2,67 | 8,17 | 12,73 | 1,559 | 87,6% [86,1%; 89,0%], n=2000 | 4,7 pp | 0,0% |
| V1 | 6 | 4×3 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1 | 6 | 4×3 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| V1 | 6 | 4×3 | montante | nenhuma | 7,64 | 3,75 | 4,45 | 9,06 | 2,038 | 80,5% [78,7%; 82,2%], n=2000 | 6,2 pp | 0,0% |
| V1 | 6 | 4×3 | montante | gambeson | 5,95 | 3,45 | 5,71 | 9,84 | 1,724 | 82,5% [80,8%; 84,1%], n=2000 | 4,2 pp | 0,0% |
| V1 | 6 | 4×3 | montante | malha | 3,57 | 1,74 | 9,51 | 19,57 | 2,057 | 91,4% [90,1%; 92,6%], n=2000 | 2,0 pp | 0,0% |
| V1 | 6 | 5×4 | espada-longa | nenhuma | 3,86 | 2,68 | 8,80 | 12,70 | 1,443 | 82,3% [80,6%; 84,0%], n=2000 | 8,7 pp | 0,0% |
| V1 | 6 | 5×4 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1 | 6 | 5×4 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| V1 | 6 | 5×4 | montante | nenhuma | 7,02 | 3,41 | 4,84 | 9,97 | 2,057 | 81,4% [79,6%; 83,0%], n=2000 | 7,2 pp | 0,0% |
| V1 | 6 | 5×4 | montante | gambeson | 5,67 | 3,35 | 6,00 | 10,15 | 1,692 | 82,8% [81,0%; 84,3%], n=2000 | 4,7 pp | 0,0% |
| V1 | 6 | 5×4 | montante | malha | 3,04 | 1,56 | 11,19 | 21,85 | 1,953 | 92,3% [91,1%; 93,4%], n=2000 | 2,7 pp | 0,0% |
| V1 | 6 | 6×5 | espada-longa | nenhuma | 3,73 | 2,64 | 9,11 | 12,86 | 1,411 | 79,0% [77,1%; 80,7%], n=2000 | 10,9 pp | 0,0% |
| V1 | 6 | 6×5 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1 | 6 | 6×5 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| V1 | 6 | 6×5 | montante | nenhuma | 6,48 | 3,12 | 5,25 | 10,89 | 2,074 | 83,0% [81,2%; 84,5%], n=2000 | 6,5 pp | 0,0% |
| V1 | 6 | 6×5 | montante | gambeson | 5,49 | 3,31 | 6,19 | 10,27 | 1,660 | 82,2% [80,4%; 83,8%], n=2000 | 5,1 pp | 0,0% |
| V1 | 6 | 6×5 | montante | malha | 2,61 | 1,45 | 13,02 | 23,49 | 1,804 | 92,3% [91,0%; 93,3%], n=2000 | 2,3 pp | 0,0% |
| V1 | 8 | 1×0 | espada-longa | nenhuma | 6,11 | 3,33 | 5,56 | 10,22 | 1,837 | 84,8% [83,1%; 86,3%], n=2000 | 4,3 pp | 0,0% |
| V1 | 8 | 1×0 | espada-longa | gambeson | 4,07 | 2,85 | 8,35 | 11,92 | 1,428 | 85,7% [84,0%; 87,1%], n=2000 | 3,3 pp | 0,0% |
| V1 | 8 | 1×0 | espada-longa | malha | 1,32 | 0,35 | 25,80 | 98,02 | 3,800 | 98,7% [98,1%; 99,1%], n=2000 | 0,4 pp | 0,0% |
| V1 | 8 | 1×0 | montante | nenhuma | 9,99 | 5,05 | 3,40 | 6,73 | 1,977 | 75,0% [73,1%; 76,8%], n=2000 | 8,4 pp | 0,0% |
| V1 | 8 | 1×0 | montante | gambeson | 7,97 | 4,37 | 4,26 | 7,78 | 1,825 | 77,8% [75,9%; 79,6%], n=2000 | 7,4 pp | 0,0% |
| V1 | 8 | 1×0 | montante | malha | 6,24 | 3,04 | 5,45 | 11,19 | 2,055 | 82,5% [80,8%; 84,1%], n=2000 | 4,4 pp | 0,0% |
| V1 | 8 | 2×1 | espada-longa | nenhuma | 5,36 | 3,03 | 6,34 | 11,22 | 1,768 | 84,8% [83,2%; 86,3%], n=2000 | 3,2 pp | 0,0% |
| V1 | 8 | 2×1 | espada-longa | gambeson | 3,80 | 2,85 | 8,94 | 11,91 | 1,333 | 78,5% [76,6%; 80,2%], n=2000 | 6,1 pp | 0,0% |
| V1 | 8 | 2×1 | espada-longa | malha | 0,80 | 0,17 | 42,40 | 204,02 | 4,812 | 99,8% [99,4%; 99,9%], n=2000 | -0,1 pp | 0,0% |
| V1 | 8 | 2×1 | montante | nenhuma | 9,43 | 4,76 | 3,61 | 7,14 | 1,981 | 75,5% [73,6%; 77,4%], n=2000 | 9,1 pp | 0,0% |
| V1 | 8 | 2×1 | montante | gambeson | 7,43 | 3,99 | 4,58 | 8,53 | 1,864 | 79,7% [77,9%; 81,4%], n=2000 | 8,2 pp | 0,0% |
| V1 | 8 | 2×1 | montante | malha | 5,64 | 2,68 | 6,02 | 12,70 | 2,109 | 84,4% [82,7%; 85,9%], n=2000 | 4,5 pp | 0,0% |
| V1 | 8 | 3×2 | espada-longa | nenhuma | 4,77 | 2,77 | 7,13 | 12,29 | 1,724 | 85,6% [84,0%; 87,1%], n=2000 | 5,0 pp | 0,0% |
| V1 | 8 | 3×2 | espada-longa | gambeson | 3,69 | 2,84 | 9,22 | 11,97 | 1,298 | 75,1% [73,2%; 76,9%], n=2000 | 7,0 pp | 0,0% |
| V1 | 8 | 3×2 | espada-longa | malha | 0,40 | 0,05 | 84,90 | 618,97 | 7,291 | 100,0% [99,8%; 100,0%], n=1993 | 0,0 pp | 0,3% |
| V1 | 8 | 3×2 | montante | nenhuma | 8,78 | 4,44 | 3,87 | 7,65 | 1,977 | 76,8% [74,9%; 78,6%], n=2000 | 8,4 pp | 0,0% |
| V1 | 8 | 3×2 | montante | gambeson | 6,86 | 3,70 | 4,95 | 9,19 | 1,855 | 80,9% [79,1%; 82,6%], n=2000 | 7,0 pp | 0,0% |
| V1 | 8 | 3×2 | montante | malha | 5,03 | 2,36 | 6,75 | 14,39 | 2,130 | 86,0% [84,4%; 87,4%], n=2000 | 4,1 pp | 0,0% |
| V1 | 8 | 4×3 | espada-longa | nenhuma | 4,29 | 2,55 | 7,92 | 13,34 | 1,684 | 86,8% [85,2%; 88,2%], n=2000 | 4,2 pp | 0,0% |
| V1 | 8 | 4×3 | espada-longa | gambeson | 3,69 | 2,84 | 9,22 | 11,97 | 1,298 | 75,1% [73,2%; 76,9%], n=2000 | 7,0 pp | 0,0% |
| V1 | 8 | 4×3 | espada-longa | malha | 0,12 | 0,00 | 280,75 | ∞ | n/d | 100,0% [43,9%; 100,0%], n=3 | n/d | 99,9% |
| V1 | 8 | 4×3 | montante | nenhuma | 8,20 | 4,12 | 4,14 | 8,26 | 1,993 | 78,0% [76,2%; 79,8%], n=2000 | 7,7 pp | 0,0% |
| V1 | 8 | 4×3 | montante | gambeson | 6,32 | 3,49 | 5,38 | 9,74 | 1,811 | 80,5% [78,7%; 82,2%], n=2000 | 6,4 pp | 0,0% |
| V1 | 8 | 4×3 | montante | malha | 4,41 | 2,08 | 7,70 | 16,37 | 2,126 | 87,0% [85,4%; 88,4%], n=2000 | 3,7 pp | 0,0% |
| V1 | 8 | 5×4 | espada-longa | nenhuma | 3,93 | 2,40 | 8,66 | 14,17 | 1,636 | 87,9% [86,4%; 89,3%], n=2000 | 5,4 pp | 0,0% |
| V1 | 8 | 5×4 | espada-longa | gambeson | 3,69 | 2,84 | 9,22 | 11,97 | 1,298 | 75,1% [73,2%; 76,9%], n=2000 | 7,0 pp | 0,0% |
| V1 | 8 | 5×4 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| V1 | 8 | 5×4 | montante | nenhuma | 7,53 | 3,80 | 4,52 | 8,94 | 1,981 | 78,3% [76,4%; 80,1%], n=2000 | 7,6 pp | 0,0% |
| V1 | 8 | 5×4 | montante | gambeson | 5,88 | 3,27 | 5,79 | 10,38 | 1,795 | 81,3% [79,5%; 82,9%], n=2000 | 5,2 pp | 0,0% |
| V1 | 8 | 5×4 | montante | malha | 3,85 | 1,80 | 8,83 | 18,91 | 2,142 | 88,9% [87,4%; 90,2%], n=2000 | 2,0 pp | 0,0% |
| V1 | 8 | 6×5 | espada-longa | nenhuma | 3,64 | 2,40 | 9,35 | 14,16 | 1,514 | 82,5% [80,7%; 84,1%], n=2000 | 6,7 pp | 0,0% |
| V1 | 8 | 6×5 | espada-longa | gambeson | 3,69 | 2,84 | 9,22 | 11,97 | 1,298 | 75,1% [73,2%; 76,9%], n=2000 | 7,0 pp | 0,0% |
| V1 | 8 | 6×5 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d | n/d | 100,0% |
| V1 | 8 | 6×5 | montante | nenhuma | 6,92 | 3,45 | 4,91 | 9,85 | 2,004 | 79,3% [77,4%; 81,0%], n=2000 | 6,3 pp | 0,0% |
| V1 | 8 | 6×5 | montante | gambeson | 5,50 | 3,16 | 6,19 | 10,75 | 1,739 | 80,5% [78,7%; 82,2%], n=2000 | 4,6 pp | 0,0% |
| V1 | 8 | 6×5 | montante | malha | 3,30 | 1,58 | 10,29 | 21,54 | 2,092 | 90,2% [88,8%; 91,4%], n=2000 | 2,0 pp | 0,0% |
| V1 | 12 | 1×0 | espada-longa | nenhuma | 6,37 | 3,66 | 5,34 | 9,29 | 1,740 | 77,1% [75,2%; 78,9%], n=2000 | 2,2 pp | 0,0% |
| V1 | 12 | 1×0 | espada-longa | gambeson | 4,37 | 2,67 | 7,78 | 12,74 | 1,638 | 83,0% [81,3%; 84,6%], n=2000 | 0,9 pp | 0,0% |
| V1 | 12 | 1×0 | espada-longa | malha | 2,29 | 0,79 | 14,83 | 43,11 | 2,907 | 93,8% [92,7%; 94,8%], n=2000 | 2,2 pp | 0,0% |
| V1 | 12 | 1×0 | montante | nenhuma | 10,06 | 5,73 | 3,38 | 5,93 | 1,754 | 69,9% [67,9%; 71,9%], n=2000 | 3,6 pp | 0,0% |
| V1 | 12 | 1×0 | montante | gambeson | 8,79 | 4,90 | 3,87 | 6,94 | 1,795 | 72,9% [70,9%; 74,8%], n=2000 | 2,4 pp | 0,0% |
| V1 | 12 | 1×0 | montante | malha | 7,30 | 3,82 | 4,66 | 8,89 | 1,909 | 75,0% [73,1%; 76,8%], n=2000 | 2,2 pp | 0,0% |
| V1 | 12 | 2×1 | espada-longa | nenhuma | 5,82 | 3,24 | 5,84 | 10,49 | 1,796 | 79,4% [77,6%; 81,1%], n=2000 | 2,0 pp | 0,0% |
| V1 | 12 | 2×1 | espada-longa | gambeson | 3,96 | 2,50 | 8,58 | 13,60 | 1,585 | 82,8% [81,1%; 84,4%], n=2000 | 2,5 pp | 0,0% |
| V1 | 12 | 2×1 | espada-longa | malha | 1,66 | 0,51 | 20,43 | 66,98 | 3,279 | 96,6% [95,7%; 97,3%], n=2000 | 1,0 pp | 0,0% |
| V1 | 12 | 2×1 | montante | nenhuma | 9,59 | 5,44 | 3,55 | 6,25 | 1,763 | 70,6% [68,6%; 72,6%], n=2000 | 3,6 pp | 0,0% |
| V1 | 12 | 2×1 | montante | gambeson | 8,28 | 4,57 | 4,11 | 7,44 | 1,812 | 73,7% [71,7%; 75,5%], n=2000 | 2,3 pp | 0,0% |
| V1 | 12 | 2×1 | montante | malha | 6,78 | 3,53 | 5,01 | 9,64 | 1,923 | 76,3% [74,3%; 78,1%], n=2000 | 1,7 pp | 0,0% |
| V1 | 12 | 3×2 | espada-longa | nenhuma | 5,24 | 2,85 | 6,49 | 11,94 | 1,841 | 82,1% [80,4%; 83,7%], n=2000 | 0,0 pp | 0,0% |
| V1 | 12 | 3×2 | espada-longa | gambeson | 3,66 | 2,40 | 9,29 | 14,18 | 1,526 | 83,0% [81,3%; 84,6%], n=2000 | 2,4 pp | 0,0% |
| V1 | 12 | 3×2 | espada-longa | malha | 1,13 | 0,29 | 30,21 | 115,43 | 3,822 | 98,6% [97,9%; 99,0%], n=2000 | 0,3 pp | 0,0% |
| V1 | 12 | 3×2 | montante | nenhuma | 9,16 | 5,11 | 3,71 | 6,65 | 1,792 | 72,0% [69,9%; 73,9%], n=2000 | 2,5 pp | 0,0% |
| V1 | 12 | 3×2 | montante | gambeson | 7,73 | 4,32 | 4,40 | 7,87 | 1,789 | 73,5% [71,5%; 75,3%], n=2000 | 3,1 pp | 0,0% |
| V1 | 12 | 3×2 | montante | malha | 6,24 | 3,22 | 5,45 | 10,55 | 1,937 | 77,3% [75,4%; 79,0%], n=2000 | -0,1 pp | 0,0% |
| V1 | 12 | 4×3 | espada-longa | nenhuma | 4,64 | 2,56 | 7,34 | 13,28 | 1,810 | 82,5% [80,8%; 84,1%], n=2000 | 0,6 pp | 0,0% |
| V1 | 12 | 4×3 | espada-longa | gambeson | 3,42 | 2,38 | 9,94 | 14,26 | 1,435 | 78,5% [76,6%; 80,2%], n=2000 | 2,6 pp | 0,0% |
| V1 | 12 | 4×3 | espada-longa | malha | 0,68 | 0,14 | 49,64 | 239,53 | 4,825 | 99,9% [99,6%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| V1 | 12 | 4×3 | montante | nenhuma | 8,81 | 4,78 | 3,86 | 7,11 | 1,842 | 73,0% [71,1%; 74,9%], n=2000 | 2,3 pp | 0,0% |
| V1 | 12 | 4×3 | montante | gambeson | 7,19 | 4,01 | 4,73 | 8,49 | 1,794 | 74,9% [72,9%; 76,7%], n=2000 | 2,3 pp | 0,0% |
| V1 | 12 | 4×3 | montante | malha | 5,77 | 2,92 | 5,89 | 11,65 | 1,976 | 78,5% [76,7%; 80,3%], n=2000 | -0,9 pp | 0,0% |
| V1 | 12 | 5×4 | espada-longa | nenhuma | 4,13 | 2,33 | 8,23 | 14,58 | 1,772 | 82,4% [80,7%; 84,0%], n=2000 | 2,0 pp | 0,0% |
| V1 | 12 | 5×4 | espada-longa | gambeson | 3,32 | 2,36 | 10,23 | 14,38 | 1,405 | 76,5% [74,6%; 78,3%], n=2000 | 2,6 pp | 0,0% |
| V1 | 12 | 5×4 | espada-longa | malha | 0,34 | 0,05 | 98,74 | 735,61 | 7,450 | 100,0% [99,8%; 100,0%], n=1949 | 0,0 pp | 2,5% |
| V1 | 12 | 5×4 | montante | nenhuma | 8,39 | 4,37 | 4,05 | 7,77 | 1,917 | 74,2% [72,2%; 76,1%], n=2000 | 0,2 pp | 0,0% |
| V1 | 12 | 5×4 | montante | gambeson | 6,69 | 3,67 | 5,08 | 9,26 | 1,822 | 76,4% [74,5%; 78,2%], n=2000 | 1,2 pp | 0,0% |
| V1 | 12 | 5×4 | montante | malha | 5,31 | 2,62 | 6,41 | 12,98 | 2,026 | 80,5% [78,7%; 82,2%], n=2000 | -1,2 pp | 0,0% |
| V1 | 12 | 6×5 | espada-longa | nenhuma | 3,73 | 2,16 | 9,11 | 15,71 | 1,725 | 82,9% [81,2%; 84,5%], n=2000 | 1,2 pp | 0,0% |
| V1 | 12 | 6×5 | espada-longa | gambeson | 3,32 | 2,36 | 10,23 | 14,38 | 1,405 | 76,5% [74,6%; 78,3%], n=2000 | 2,6 pp | 0,0% |
| V1 | 12 | 6×5 | espada-longa | malha | 0,10 | 0,00 | 346,36 | ∞ | n/d | 100,0% [20,7%; 100,0%], n=1 | n/d | 100,0% |
| V1 | 12 | 6×5 | montante | nenhuma | 7,91 | 4,04 | 4,30 | 8,41 | 1,956 | 74,7% [72,7%; 76,6%], n=2000 | 1,2 pp | 0,0% |
| V1 | 12 | 6×5 | montante | gambeson | 6,24 | 3,40 | 5,45 | 9,99 | 1,834 | 77,3% [75,5%; 79,1%], n=2000 | 0,7 pp | 0,0% |
| V1 | 12 | 6×5 | montante | malha | 4,81 | 2,31 | 7,07 | 14,69 | 2,079 | 81,7% [79,9%; 83,3%], n=2000 | 0,0 pp | 0,0% |
| V2 | 6 | 1×0 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V2 | 6 | 1×0 | espada-longa | gambeson | 2,65 | 2,50 | 12,85 | 13,61 | 1,059 | 54,2% [52,0%; 56,4%], n=2000 | 0,4 pp | 0,0% |
| V2 | 6 | 1×0 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V2 | 6 | 1×0 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V2 | 6 | 1×0 | montante | gambeson | 7,30 | 4,44 | 4,66 | 7,66 | 1,643 | 75,6% [73,7%; 77,4%], n=2000 | 5,8 pp | 0,0% |
| V2 | 6 | 1×0 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V2 | 6 | 2×1 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V2 | 6 | 2×1 | espada-longa | gambeson | 2,65 | 2,50 | 12,85 | 13,61 | 1,059 | 54,2% [52,0%; 56,4%], n=2000 | 0,4 pp | 0,0% |
| V2 | 6 | 2×1 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V2 | 6 | 2×1 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V2 | 6 | 2×1 | montante | gambeson | 7,30 | 4,44 | 4,66 | 7,66 | 1,643 | 75,6% [73,7%; 77,4%], n=2000 | 5,8 pp | 0,0% |
| V2 | 6 | 2×1 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V2 | 6 | 3×2 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V2 | 6 | 3×2 | espada-longa | gambeson | 2,65 | 2,50 | 12,85 | 13,61 | 1,059 | 54,2% [52,0%; 56,4%], n=2000 | 0,4 pp | 0,0% |
| V2 | 6 | 3×2 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V2 | 6 | 3×2 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V2 | 6 | 3×2 | montante | gambeson | 7,30 | 4,44 | 4,66 | 7,66 | 1,643 | 75,6% [73,7%; 77,4%], n=2000 | 5,8 pp | 0,0% |
| V2 | 6 | 3×2 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V2 | 6 | 4×3 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V2 | 6 | 4×3 | espada-longa | gambeson | 2,65 | 2,50 | 12,85 | 13,61 | 1,059 | 54,2% [52,0%; 56,4%], n=2000 | 0,4 pp | 0,0% |
| V2 | 6 | 4×3 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V2 | 6 | 4×3 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V2 | 6 | 4×3 | montante | gambeson | 7,30 | 4,44 | 4,66 | 7,66 | 1,643 | 75,6% [73,7%; 77,4%], n=2000 | 5,8 pp | 0,0% |
| V2 | 6 | 4×3 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V2 | 6 | 5×4 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V2 | 6 | 5×4 | espada-longa | gambeson | 2,65 | 2,50 | 12,85 | 13,61 | 1,059 | 54,2% [52,0%; 56,4%], n=2000 | 0,4 pp | 0,0% |
| V2 | 6 | 5×4 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V2 | 6 | 5×4 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V2 | 6 | 5×4 | montante | gambeson | 7,30 | 4,44 | 4,66 | 7,66 | 1,643 | 75,6% [73,7%; 77,4%], n=2000 | 5,8 pp | 0,0% |
| V2 | 6 | 5×4 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V2 | 6 | 6×5 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V2 | 6 | 6×5 | espada-longa | gambeson | 2,65 | 2,50 | 12,85 | 13,61 | 1,059 | 54,2% [52,0%; 56,4%], n=2000 | 0,4 pp | 0,0% |
| V2 | 6 | 6×5 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V2 | 6 | 6×5 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V2 | 6 | 6×5 | montante | gambeson | 7,30 | 4,44 | 4,66 | 7,66 | 1,643 | 75,6% [73,7%; 77,4%], n=2000 | 5,8 pp | 0,0% |
| V2 | 6 | 6×5 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V2 | 8 | 1×0 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V2 | 8 | 1×0 | espada-longa | gambeson | 3,29 | 2,71 | 10,33 | 12,53 | 1,213 | 65,9% [63,8%; 67,9%], n=2000 | 2,2 pp | 0,0% |
| V2 | 8 | 1×0 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V2 | 8 | 1×0 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V2 | 8 | 1×0 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V2 | 8 | 1×0 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V2 | 8 | 2×1 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V2 | 8 | 2×1 | espada-longa | gambeson | 3,29 | 2,71 | 10,33 | 12,53 | 1,213 | 65,9% [63,8%; 67,9%], n=2000 | 2,2 pp | 0,0% |
| V2 | 8 | 2×1 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V2 | 8 | 2×1 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V2 | 8 | 2×1 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V2 | 8 | 2×1 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V2 | 8 | 3×2 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V2 | 8 | 3×2 | espada-longa | gambeson | 3,29 | 2,71 | 10,33 | 12,53 | 1,213 | 65,9% [63,8%; 67,9%], n=2000 | 2,2 pp | 0,0% |
| V2 | 8 | 3×2 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V2 | 8 | 3×2 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V2 | 8 | 3×2 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V2 | 8 | 3×2 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V2 | 8 | 4×3 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V2 | 8 | 4×3 | espada-longa | gambeson | 3,29 | 2,71 | 10,33 | 12,53 | 1,213 | 65,9% [63,8%; 67,9%], n=2000 | 2,2 pp | 0,0% |
| V2 | 8 | 4×3 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V2 | 8 | 4×3 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V2 | 8 | 4×3 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V2 | 8 | 4×3 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V2 | 8 | 5×4 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V2 | 8 | 5×4 | espada-longa | gambeson | 3,29 | 2,71 | 10,33 | 12,53 | 1,213 | 65,9% [63,8%; 67,9%], n=2000 | 2,2 pp | 0,0% |
| V2 | 8 | 5×4 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V2 | 8 | 5×4 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V2 | 8 | 5×4 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V2 | 8 | 5×4 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V2 | 8 | 6×5 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V2 | 8 | 6×5 | espada-longa | gambeson | 3,29 | 2,71 | 10,33 | 12,53 | 1,213 | 65,9% [63,8%; 67,9%], n=2000 | 2,2 pp | 0,0% |
| V2 | 8 | 6×5 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V2 | 8 | 6×5 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V2 | 8 | 6×5 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V2 | 8 | 6×5 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V2 | 12 | 1×0 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V2 | 12 | 1×0 | espada-longa | gambeson | 4,21 | 2,92 | 8,09 | 11,64 | 1,440 | 74,5% [72,5%; 76,3%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 1×0 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V2 | 12 | 1×0 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 1×0 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V2 | 12 | 1×0 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V2 | 12 | 2×1 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V2 | 12 | 2×1 | espada-longa | gambeson | 4,21 | 2,92 | 8,09 | 11,64 | 1,440 | 74,5% [72,5%; 76,3%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 2×1 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V2 | 12 | 2×1 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 2×1 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V2 | 12 | 2×1 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V2 | 12 | 3×2 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V2 | 12 | 3×2 | espada-longa | gambeson | 4,21 | 2,92 | 8,09 | 11,64 | 1,440 | 74,5% [72,5%; 76,3%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 3×2 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V2 | 12 | 3×2 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 3×2 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V2 | 12 | 3×2 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V2 | 12 | 4×3 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V2 | 12 | 4×3 | espada-longa | gambeson | 4,21 | 2,92 | 8,09 | 11,64 | 1,440 | 74,5% [72,5%; 76,3%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 4×3 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V2 | 12 | 4×3 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 4×3 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V2 | 12 | 4×3 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V2 | 12 | 5×4 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V2 | 12 | 5×4 | espada-longa | gambeson | 4,21 | 2,92 | 8,09 | 11,64 | 1,440 | 74,5% [72,5%; 76,3%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 5×4 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V2 | 12 | 5×4 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 5×4 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V2 | 12 | 5×4 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V2 | 12 | 6×5 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V2 | 12 | 6×5 | espada-longa | gambeson | 4,21 | 2,92 | 8,09 | 11,64 | 1,440 | 74,5% [72,5%; 76,3%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 6×5 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V2 | 12 | 6×5 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 6×5 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V2 | 12 | 6×5 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V3 | 6 | 1×0 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V3 | 6 | 1×0 | espada-longa | gambeson | 2,65 | 2,50 | 12,85 | 13,61 | 1,059 | 54,2% [52,0%; 56,4%], n=2000 | 0,4 pp | 0,0% |
| V3 | 6 | 1×0 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V3 | 6 | 1×0 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V3 | 6 | 1×0 | montante | gambeson | 7,30 | 4,44 | 4,66 | 7,66 | 1,643 | 75,6% [73,7%; 77,4%], n=2000 | 5,8 pp | 0,0% |
| V3 | 6 | 1×0 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V3 | 6 | 2×1 | espada-longa | nenhuma | 5,80 | 3,16 | 5,87 | 10,76 | 1,835 | 88,8% [87,3%; 90,1%], n=2000 | 2,2 pp | 0,0% |
| V3 | 6 | 2×1 | espada-longa | gambeson | 2,64 | 2,06 | 12,88 | 16,51 | 1,281 | 77,5% [75,6%; 79,2%], n=2000 | -3,9 pp | 0,0% |
| V3 | 6 | 2×1 | espada-longa | malha | 0,86 | 0,18 | 39,75 | 187,98 | 4,729 | 99,8% [99,5%; 99,9%], n=2000 | -0,2 pp | 0,0% |
| V3 | 6 | 2×1 | montante | nenhuma | 9,61 | 4,85 | 3,54 | 7,01 | 1,983 | 77,5% [75,6%; 79,3%], n=2000 | 6,8 pp | 0,0% |
| V3 | 6 | 2×1 | montante | gambeson | 7,37 | 3,98 | 4,61 | 8,55 | 1,853 | 81,1% [79,3%; 82,8%], n=2000 | 4,8 pp | 0,0% |
| V3 | 6 | 2×1 | montante | malha | 5,50 | 2,59 | 6,18 | 13,15 | 2,128 | 86,2% [84,6%; 87,6%], n=2000 | 2,8 pp | 0,0% |
| V3 | 6 | 3×2 | espada-longa | nenhuma | 4,90 | 3,33 | 6,95 | 10,22 | 1,471 | 77,1% [75,2%; 78,9%], n=2000 | 3,2 pp | 0,0% |
| V3 | 6 | 3×2 | espada-longa | gambeson | 2,04 | 2,10 | 16,69 | 16,19 | 0,970 | 41,0% [38,9%; 43,2%], n=2000 | 1,3 pp | 0,0% |
| V3 | 6 | 3×2 | espada-longa | malha | 0,41 | 0,21 | 83,40 | 159,82 | 1,916 | 85,7% [84,1%; 87,2%], n=1999 | 1,0 pp | 0,0% |
| V3 | 6 | 3×2 | montante | nenhuma | 8,76 | 4,99 | 3,88 | 6,82 | 1,756 | 73,9% [71,9%; 75,7%], n=2000 | 7,9 pp | 0,0% |
| V3 | 6 | 3×2 | montante | gambeson | 6,58 | 4,07 | 5,16 | 8,35 | 1,616 | 75,5% [73,6%; 77,4%], n=2000 | 5,7 pp | 0,0% |
| V3 | 6 | 3×2 | montante | malha | 4,71 | 2,67 | 7,22 | 12,71 | 1,761 | 79,7% [77,8%; 81,4%], n=2000 | 3,7 pp | 0,0% |
| V3 | 6 | 4×3 | espada-longa | nenhuma | 4,99 | 2,75 | 6,81 | 12,38 | 1,817 | 89,8% [88,4%; 91,1%], n=2000 | -0,9 pp | 0,0% |
| V3 | 6 | 4×3 | espada-longa | gambeson | 2,00 | 1,74 | 17,00 | 19,56 | 1,150 | 67,0% [64,9%; 69,0%], n=2000 | 1,5 pp | 0,0% |
| V3 | 6 | 4×3 | espada-longa | malha | 0,43 | 0,06 | 79,07 | 577,76 | 7,307 | 100,0% [99,8%; 100,0%], n=1999 | 0,0 pp | 0,0% |
| V3 | 6 | 4×3 | montante | nenhuma | 8,88 | 4,53 | 3,83 | 7,51 | 1,962 | 77,7% [75,8%; 79,5%], n=2000 | 7,0 pp | 0,0% |
| V3 | 6 | 4×3 | montante | gambeson | 6,68 | 3,62 | 5,09 | 9,38 | 1,842 | 82,0% [80,3%; 83,6%], n=2000 | 4,2 pp | 0,0% |
| V3 | 6 | 4×3 | montante | malha | 4,81 | 2,25 | 7,07 | 15,14 | 2,141 | 87,9% [86,5%; 89,3%], n=2000 | 0,1 pp | 0,0% |
| V3 | 6 | 5×4 | espada-longa | nenhuma | 4,10 | 2,91 | 8,29 | 11,68 | 1,409 | 75,9% [74,0%; 77,7%], n=2000 | 4,2 pp | 0,0% |
| V3 | 6 | 5×4 | espada-longa | gambeson | 1,57 | 1,72 | 21,68 | 19,80 | 0,913 | 30,3% [28,3%; 32,3%], n=2000 | -2,9 pp | 0,0% |
| V3 | 6 | 5×4 | espada-longa | malha | 0,13 | 0,08 | 258,56 | 413,68 | 1,600 | 100,0% [64,6%; 100,0%], n=7 | 0,0 pp | 99,7% |
| V3 | 6 | 5×4 | montante | nenhuma | 8,17 | 4,55 | 4,16 | 7,48 | 1,798 | 75,1% [73,2%; 77,0%], n=2000 | 7,9 pp | 0,0% |
| V3 | 6 | 5×4 | montante | gambeson | 5,90 | 3,71 | 5,77 | 9,17 | 1,590 | 76,1% [74,2%; 77,9%], n=2000 | 5,2 pp | 0,0% |
| V3 | 6 | 5×4 | montante | malha | 3,98 | 2,35 | 8,54 | 14,49 | 1,697 | 79,1% [77,3%; 80,8%], n=2000 | 3,8 pp | 0,0% |
| V3 | 6 | 6×5 | espada-longa | nenhuma | 4,18 | 2,32 | 8,13 | 14,67 | 1,805 | 91,8% [90,5%; 92,9%], n=2000 | 0,6 pp | 0,0% |
| V3 | 6 | 6×5 | espada-longa | gambeson | 1,51 | 1,47 | 22,58 | 23,07 | 1,022 | 51,7% [49,5%; 53,9%], n=2000 | 0,4 pp | 0,0% |
| V3 | 6 | 6×5 | espada-longa | malha | 0,13 | 0,00 | 255,80 | ∞ | n/d | 100,0% [64,6%; 100,0%], n=7 | 0,0 pp | 99,7% |
| V3 | 6 | 6×5 | montante | nenhuma | 8,26 | 4,08 | 4,11 | 8,33 | 2,024 | 80,0% [78,1%; 81,6%], n=2000 | 7,7 pp | 0,0% |
| V3 | 6 | 6×5 | montante | gambeson | 5,99 | 3,25 | 5,67 | 10,45 | 1,842 | 83,9% [82,2%; 85,4%], n=2000 | 3,8 pp | 0,0% |
| V3 | 6 | 6×5 | montante | malha | 4,08 | 1,92 | 8,34 | 17,75 | 2,129 | 89,3% [87,8%; 90,5%], n=2000 | 2,3 pp | 0,0% |
| V3 | 8 | 1×0 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V3 | 8 | 1×0 | espada-longa | gambeson | 3,29 | 2,71 | 10,33 | 12,53 | 1,213 | 65,9% [63,8%; 67,9%], n=2000 | 2,2 pp | 0,0% |
| V3 | 8 | 1×0 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V3 | 8 | 1×0 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V3 | 8 | 1×0 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V3 | 8 | 1×0 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V3 | 8 | 2×1 | espada-longa | nenhuma | 6,11 | 3,33 | 5,56 | 10,22 | 1,837 | 84,8% [83,1%; 86,3%], n=2000 | 4,3 pp | 0,0% |
| V3 | 8 | 2×1 | espada-longa | gambeson | 3,34 | 2,18 | 10,17 | 15,63 | 1,537 | 86,3% [84,7%; 87,7%], n=2000 | 1,5 pp | 0,0% |
| V3 | 8 | 2×1 | espada-longa | malha | 1,32 | 0,35 | 25,80 | 98,02 | 3,800 | 98,7% [98,1%; 99,1%], n=2000 | 0,4 pp | 0,0% |
| V3 | 8 | 2×1 | montante | nenhuma | 9,99 | 5,05 | 3,40 | 6,73 | 1,977 | 75,0% [73,1%; 76,8%], n=2000 | 8,4 pp | 0,0% |
| V3 | 8 | 2×1 | montante | gambeson | 7,98 | 4,36 | 4,26 | 7,80 | 1,830 | 77,9% [76,0%; 79,7%], n=2000 | 7,4 pp | 0,0% |
| V3 | 8 | 2×1 | montante | malha | 6,24 | 3,04 | 5,45 | 11,19 | 2,055 | 82,5% [80,8%; 84,1%], n=2000 | 4,4 pp | 0,0% |
| V3 | 8 | 3×2 | espada-longa | nenhuma | 5,27 | 3,46 | 6,45 | 9,84 | 1,525 | 76,4% [74,5%; 78,2%], n=2000 | 4,8 pp | 0,0% |
| V3 | 8 | 3×2 | espada-longa | gambeson | 2,58 | 2,28 | 13,17 | 14,91 | 1,132 | 60,2% [58,0%; 62,3%], n=2000 | 2,1 pp | 0,0% |
| V3 | 8 | 3×2 | espada-longa | malha | 0,75 | 0,40 | 45,08 | 85,82 | 1,904 | 83,7% [82,0%; 85,3%], n=2000 | 2,0 pp | 0,0% |
| V3 | 8 | 3×2 | montante | nenhuma | 9,26 | 5,20 | 3,67 | 6,54 | 1,781 | 72,3% [70,2%; 74,2%], n=2000 | 9,3 pp | 0,0% |
| V3 | 8 | 3×2 | montante | gambeson | 7,31 | 4,38 | 4,65 | 7,76 | 1,668 | 74,4% [72,4%; 76,3%], n=2000 | 9,0 pp | 0,0% |
| V3 | 8 | 3×2 | montante | malha | 5,56 | 3,08 | 6,12 | 11,05 | 1,807 | 78,0% [76,1%; 79,8%], n=2000 | 4,0 pp | 0,0% |
| V3 | 8 | 4×3 | espada-longa | nenhuma | 5,38 | 2,95 | 6,32 | 11,54 | 1,826 | 86,1% [84,5%; 87,5%], n=2000 | 3,5 pp | 0,0% |
| V3 | 8 | 4×3 | espada-longa | gambeson | 2,58 | 1,87 | 13,18 | 18,16 | 1,378 | 80,3% [78,5%; 82,0%], n=2000 | -1,0 pp | 0,0% |
| V3 | 8 | 4×3 | espada-longa | malha | 0,80 | 0,17 | 42,40 | 204,02 | 4,812 | 99,8% [99,4%; 99,9%], n=2000 | -0,1 pp | 0,0% |
| V3 | 8 | 4×3 | montante | nenhuma | 9,43 | 4,76 | 3,61 | 7,14 | 1,981 | 75,5% [73,6%; 77,4%], n=2000 | 9,1 pp | 0,0% |
| V3 | 8 | 4×3 | montante | gambeson | 7,41 | 3,94 | 4,59 | 8,62 | 1,880 | 79,8% [78,0%; 81,5%], n=2000 | 7,7 pp | 0,0% |
| V3 | 8 | 4×3 | montante | malha | 5,64 | 2,68 | 6,02 | 12,70 | 2,109 | 84,4% [82,7%; 85,9%], n=2000 | 4,5 pp | 0,0% |
| V3 | 8 | 5×4 | espada-longa | nenhuma | 4,55 | 3,06 | 7,47 | 11,10 | 1,486 | 75,8% [73,8%; 77,6%], n=2000 | 5,9 pp | 0,0% |
| V3 | 8 | 5×4 | espada-longa | gambeson | 1,99 | 1,94 | 17,09 | 17,49 | 1,024 | 50,1% [48,0%; 52,3%], n=2000 | -0,7 pp | 0,0% |
| V3 | 8 | 5×4 | espada-longa | malha | 0,38 | 0,20 | 90,07 | 173,45 | 1,926 | 85,8% [84,2%; 87,3%], n=1992 | 1,0 pp | 0,4% |
| V3 | 8 | 5×4 | montante | nenhuma | 8,64 | 4,91 | 3,93 | 6,93 | 1,762 | 72,7% [70,7%; 74,6%], n=2000 | 11,1 pp | 0,0% |
| V3 | 8 | 5×4 | montante | gambeson | 6,73 | 4,01 | 5,05 | 8,48 | 1,678 | 76,2% [74,3%; 78,0%], n=2000 | 9,0 pp | 0,0% |
| V3 | 8 | 5×4 | montante | malha | 4,93 | 2,75 | 6,89 | 12,35 | 1,792 | 79,4% [77,6%; 81,1%], n=2000 | 5,8 pp | 0,0% |
| V3 | 8 | 6×5 | espada-longa | nenhuma | 4,66 | 2,53 | 7,29 | 13,43 | 1,842 | 87,9% [86,4%; 89,3%], n=2000 | 3,6 pp | 0,0% |
| V3 | 8 | 6×5 | espada-longa | gambeson | 1,97 | 1,61 | 17,27 | 21,05 | 1,219 | 70,0% [68,0%; 72,0%], n=2000 | -0,6 pp | 0,0% |
| V3 | 8 | 6×5 | espada-longa | malha | 0,40 | 0,05 | 84,90 | 618,97 | 7,291 | 100,0% [99,8%; 100,0%], n=1993 | 0,0 pp | 0,3% |
| V3 | 8 | 6×5 | montante | nenhuma | 8,78 | 4,44 | 3,87 | 7,65 | 1,977 | 76,8% [74,9%; 78,6%], n=2000 | 8,4 pp | 0,0% |
| V3 | 8 | 6×5 | montante | gambeson | 6,79 | 3,62 | 5,01 | 9,40 | 1,876 | 81,2% [79,4%; 82,9%], n=2000 | 7,4 pp | 0,0% |
| V3 | 8 | 6×5 | montante | malha | 5,04 | 2,35 | 6,75 | 14,45 | 2,140 | 86,1% [84,5%; 87,5%], n=2000 | 4,2 pp | 0,0% |
| V3 | 12 | 1×0 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V3 | 12 | 1×0 | espada-longa | gambeson | 4,21 | 2,92 | 8,09 | 11,64 | 1,440 | 74,5% [72,5%; 76,3%], n=2000 | 3,3 pp | 0,0% |
| V3 | 12 | 1×0 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V3 | 12 | 1×0 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V3 | 12 | 1×0 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V3 | 12 | 1×0 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V3 | 12 | 2×1 | espada-longa | nenhuma | 6,37 | 3,66 | 5,34 | 9,29 | 1,740 | 77,1% [75,2%; 78,9%], n=2000 | 2,2 pp | 0,0% |
| V3 | 12 | 2×1 | espada-longa | gambeson | 4,29 | 2,48 | 7,93 | 13,70 | 1,728 | 85,1% [83,5%; 86,6%], n=2000 | -0,2 pp | 0,0% |
| V3 | 12 | 2×1 | espada-longa | malha | 2,29 | 0,79 | 14,83 | 43,11 | 2,907 | 93,8% [92,7%; 94,8%], n=2000 | 2,2 pp | 0,0% |
| V3 | 12 | 2×1 | montante | nenhuma | 10,06 | 5,73 | 3,38 | 5,93 | 1,754 | 69,9% [67,9%; 71,9%], n=2000 | 3,6 pp | 0,0% |
| V3 | 12 | 2×1 | montante | gambeson | 8,79 | 4,90 | 3,87 | 6,94 | 1,795 | 72,9% [70,9%; 74,8%], n=2000 | 2,4 pp | 0,0% |
| V3 | 12 | 2×1 | montante | malha | 7,30 | 3,82 | 4,66 | 8,89 | 1,909 | 75,0% [73,1%; 76,8%], n=2000 | 2,2 pp | 0,0% |
| V3 | 12 | 3×2 | espada-longa | nenhuma | 5,75 | 3,68 | 5,91 | 9,24 | 1,563 | 72,8% [70,8%; 74,7%], n=2000 | 2,7 pp | 0,0% |
| V3 | 12 | 3×2 | espada-longa | gambeson | 3,60 | 2,57 | 9,44 | 13,22 | 1,400 | 73,7% [71,7%; 75,6%], n=2000 | 4,4 pp | 0,0% |
| V3 | 12 | 3×2 | espada-longa | malha | 1,57 | 0,86 | 21,69 | 39,57 | 1,824 | 79,6% [77,8%; 81,3%], n=2000 | 1,4 pp | 0,0% |
| V3 | 12 | 3×2 | montante | nenhuma | 9,67 | 5,65 | 3,52 | 6,02 | 1,712 | 69,2% [67,1%; 71,2%], n=2000 | 3,6 pp | 0,0% |
| V3 | 12 | 3×2 | montante | gambeson | 8,16 | 4,98 | 4,17 | 6,83 | 1,639 | 70,2% [68,1%; 72,1%], n=2000 | 3,3 pp | 0,0% |
| V3 | 12 | 3×2 | montante | malha | 6,64 | 3,92 | 5,12 | 8,67 | 1,693 | 71,5% [69,5%; 73,4%], n=2000 | 1,4 pp | 0,0% |
| V3 | 12 | 4×3 | espada-longa | nenhuma | 5,82 | 3,24 | 5,84 | 10,49 | 1,796 | 79,4% [77,6%; 81,1%], n=2000 | 2,0 pp | 0,0% |
| V3 | 12 | 4×3 | espada-longa | gambeson | 3,68 | 2,15 | 9,24 | 15,83 | 1,714 | 86,4% [84,8%; 87,8%], n=2000 | 0,4 pp | 0,0% |
| V3 | 12 | 4×3 | espada-longa | malha | 1,66 | 0,51 | 20,43 | 66,98 | 3,279 | 96,6% [95,7%; 97,3%], n=2000 | 1,0 pp | 0,0% |
| V3 | 12 | 4×3 | montante | nenhuma | 9,59 | 5,44 | 3,55 | 6,25 | 1,763 | 70,6% [68,6%; 72,6%], n=2000 | 3,6 pp | 0,0% |
| V3 | 12 | 4×3 | montante | gambeson | 8,28 | 4,57 | 4,11 | 7,44 | 1,812 | 73,7% [71,7%; 75,5%], n=2000 | 2,3 pp | 0,0% |
| V3 | 12 | 4×3 | montante | malha | 6,78 | 3,53 | 5,01 | 9,64 | 1,923 | 76,3% [74,3%; 78,1%], n=2000 | 1,7 pp | 0,0% |
| V3 | 12 | 5×4 | espada-longa | nenhuma | 5,15 | 3,30 | 6,61 | 10,30 | 1,558 | 74,0% [72,0%; 75,9%], n=2000 | 1,2 pp | 0,0% |
| V3 | 12 | 5×4 | espada-longa | gambeson | 2,99 | 2,25 | 11,37 | 15,14 | 1,331 | 72,0% [70,0%; 74,0%], n=2000 | 0,7 pp | 0,0% |
| V3 | 12 | 5×4 | espada-longa | malha | 1,05 | 0,56 | 32,31 | 60,26 | 1,865 | 82,1% [80,4%; 83,7%], n=2000 | -1,2 pp | 0,0% |
| V3 | 12 | 5×4 | montante | nenhuma | 9,18 | 5,37 | 3,70 | 6,33 | 1,710 | 69,5% [67,5%; 71,5%], n=2000 | 3,7 pp | 0,0% |
| V3 | 12 | 5×4 | montante | gambeson | 7,67 | 4,68 | 4,43 | 7,26 | 1,637 | 70,2% [68,2%; 72,2%], n=2000 | 3,2 pp | 0,0% |
| V3 | 12 | 5×4 | montante | malha | 6,13 | 3,59 | 5,54 | 9,48 | 1,711 | 72,3% [70,3%; 74,2%], n=2000 | 1,4 pp | 0,0% |
| V3 | 12 | 6×5 | espada-longa | nenhuma | 5,24 | 2,85 | 6,49 | 11,94 | 1,841 | 82,1% [80,4%; 83,7%], n=2000 | 0,0 pp | 0,0% |
| V3 | 12 | 6×5 | espada-longa | gambeson | 3,06 | 1,82 | 11,11 | 18,73 | 1,687 | 87,3% [85,7%; 88,6%], n=2000 | 0,5 pp | 0,0% |
| V3 | 12 | 6×5 | espada-longa | malha | 1,13 | 0,29 | 30,21 | 115,43 | 3,822 | 98,6% [97,9%; 99,0%], n=2000 | 0,3 pp | 0,0% |
| V3 | 12 | 6×5 | montante | nenhuma | 9,16 | 5,11 | 3,71 | 6,65 | 1,792 | 72,0% [69,9%; 73,9%], n=2000 | 2,5 pp | 0,0% |
| V3 | 12 | 6×5 | montante | gambeson | 7,73 | 4,32 | 4,40 | 7,87 | 1,789 | 73,5% [71,5%; 75,3%], n=2000 | 3,1 pp | 0,0% |
| V3 | 12 | 6×5 | montante | malha | 6,24 | 3,22 | 5,45 | 10,55 | 1,937 | 77,3% [75,4%; 79,0%], n=2000 | -0,1 pp | 0,0% |
| V1+V2 | 6 | 1×0 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V1+V2 | 6 | 1×0 | espada-longa | gambeson | 3,99 | 3,24 | 8,53 | 10,48 | 1,229 | 75,3% [73,4%; 77,1%], n=2000 | 11,0 pp | 0,0% |
| V1+V2 | 6 | 1×0 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V1+V2 | 6 | 1×0 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V1+V2 | 6 | 1×0 | montante | gambeson | 7,38 | 4,47 | 4,61 | 7,61 | 1,653 | 75,9% [74,0%; 77,8%], n=2000 | 6,1 pp | 0,0% |
| V1+V2 | 6 | 1×0 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V1+V2 | 6 | 2×1 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V1+V2 | 6 | 2×1 | espada-longa | gambeson | 3,99 | 3,24 | 8,53 | 10,48 | 1,229 | 75,3% [73,4%; 77,1%], n=2000 | 11,0 pp | 0,0% |
| V1+V2 | 6 | 2×1 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V1+V2 | 6 | 2×1 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V1+V2 | 6 | 2×1 | montante | gambeson | 7,38 | 4,47 | 4,61 | 7,61 | 1,653 | 75,9% [74,0%; 77,8%], n=2000 | 6,1 pp | 0,0% |
| V1+V2 | 6 | 2×1 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V1+V2 | 6 | 3×2 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V1+V2 | 6 | 3×2 | espada-longa | gambeson | 3,99 | 3,24 | 8,53 | 10,48 | 1,229 | 75,3% [73,4%; 77,1%], n=2000 | 11,0 pp | 0,0% |
| V1+V2 | 6 | 3×2 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V1+V2 | 6 | 3×2 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V1+V2 | 6 | 3×2 | montante | gambeson | 7,38 | 4,47 | 4,61 | 7,61 | 1,653 | 75,9% [74,0%; 77,8%], n=2000 | 6,1 pp | 0,0% |
| V1+V2 | 6 | 3×2 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V1+V2 | 6 | 4×3 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V1+V2 | 6 | 4×3 | espada-longa | gambeson | 3,99 | 3,24 | 8,53 | 10,48 | 1,229 | 75,3% [73,4%; 77,1%], n=2000 | 11,0 pp | 0,0% |
| V1+V2 | 6 | 4×3 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V1+V2 | 6 | 4×3 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V1+V2 | 6 | 4×3 | montante | gambeson | 7,38 | 4,47 | 4,61 | 7,61 | 1,653 | 75,9% [74,0%; 77,8%], n=2000 | 6,1 pp | 0,0% |
| V1+V2 | 6 | 4×3 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V1+V2 | 6 | 5×4 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V1+V2 | 6 | 5×4 | espada-longa | gambeson | 3,99 | 3,24 | 8,53 | 10,48 | 1,229 | 75,3% [73,4%; 77,1%], n=2000 | 11,0 pp | 0,0% |
| V1+V2 | 6 | 5×4 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V1+V2 | 6 | 5×4 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V1+V2 | 6 | 5×4 | montante | gambeson | 7,38 | 4,47 | 4,61 | 7,61 | 1,653 | 75,9% [74,0%; 77,8%], n=2000 | 6,1 pp | 0,0% |
| V1+V2 | 6 | 5×4 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V1+V2 | 6 | 6×5 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V1+V2 | 6 | 6×5 | espada-longa | gambeson | 3,99 | 3,24 | 8,53 | 10,48 | 1,229 | 75,3% [73,4%; 77,1%], n=2000 | 11,0 pp | 0,0% |
| V1+V2 | 6 | 6×5 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V1+V2 | 6 | 6×5 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V1+V2 | 6 | 6×5 | montante | gambeson | 7,38 | 4,47 | 4,61 | 7,61 | 1,653 | 75,9% [74,0%; 77,8%], n=2000 | 6,1 pp | 0,0% |
| V1+V2 | 6 | 6×5 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V1+V2 | 8 | 1×0 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V1+V2 | 8 | 1×0 | espada-longa | gambeson | 4,04 | 3,06 | 8,42 | 11,10 | 1,319 | 76,1% [74,2%; 78,0%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 1×0 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 8 | 1×0 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V1+V2 | 8 | 1×0 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V1+V2 | 8 | 1×0 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 8 | 2×1 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V1+V2 | 8 | 2×1 | espada-longa | gambeson | 4,04 | 3,06 | 8,42 | 11,10 | 1,319 | 76,1% [74,2%; 78,0%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 2×1 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 8 | 2×1 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V1+V2 | 8 | 2×1 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V1+V2 | 8 | 2×1 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 8 | 3×2 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V1+V2 | 8 | 3×2 | espada-longa | gambeson | 4,04 | 3,06 | 8,42 | 11,10 | 1,319 | 76,1% [74,2%; 78,0%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 3×2 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 8 | 3×2 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V1+V2 | 8 | 3×2 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V1+V2 | 8 | 3×2 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 8 | 4×3 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V1+V2 | 8 | 4×3 | espada-longa | gambeson | 4,04 | 3,06 | 8,42 | 11,10 | 1,319 | 76,1% [74,2%; 78,0%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 4×3 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 8 | 4×3 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V1+V2 | 8 | 4×3 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V1+V2 | 8 | 4×3 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 8 | 5×4 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V1+V2 | 8 | 5×4 | espada-longa | gambeson | 4,04 | 3,06 | 8,42 | 11,10 | 1,319 | 76,1% [74,2%; 78,0%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 5×4 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 8 | 5×4 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V1+V2 | 8 | 5×4 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V1+V2 | 8 | 5×4 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 8 | 6×5 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V1+V2 | 8 | 6×5 | espada-longa | gambeson | 4,04 | 3,06 | 8,42 | 11,10 | 1,319 | 76,1% [74,2%; 78,0%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 6×5 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 8 | 6×5 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V1+V2 | 8 | 6×5 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V1+V2 | 8 | 6×5 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 12 | 1×0 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 12 | 1×0 | espada-longa | gambeson | 4,30 | 2,97 | 7,90 | 11,43 | 1,446 | 75,1% [73,2%; 76,9%], n=2000 | 3,2 pp | 0,0% |
| V1+V2 | 12 | 1×0 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V1+V2 | 12 | 1×0 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 12 | 1×0 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V1+V2 | 12 | 1×0 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V1+V2 | 12 | 2×1 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 12 | 2×1 | espada-longa | gambeson | 4,30 | 2,97 | 7,90 | 11,43 | 1,446 | 75,1% [73,2%; 76,9%], n=2000 | 3,2 pp | 0,0% |
| V1+V2 | 12 | 2×1 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V1+V2 | 12 | 2×1 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 12 | 2×1 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V1+V2 | 12 | 2×1 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V1+V2 | 12 | 3×2 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 12 | 3×2 | espada-longa | gambeson | 4,30 | 2,97 | 7,90 | 11,43 | 1,446 | 75,1% [73,2%; 76,9%], n=2000 | 3,2 pp | 0,0% |
| V1+V2 | 12 | 3×2 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V1+V2 | 12 | 3×2 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 12 | 3×2 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V1+V2 | 12 | 3×2 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V1+V2 | 12 | 4×3 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 12 | 4×3 | espada-longa | gambeson | 4,30 | 2,97 | 7,90 | 11,43 | 1,446 | 75,1% [73,2%; 76,9%], n=2000 | 3,2 pp | 0,0% |
| V1+V2 | 12 | 4×3 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V1+V2 | 12 | 4×3 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 12 | 4×3 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V1+V2 | 12 | 4×3 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V1+V2 | 12 | 5×4 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 12 | 5×4 | espada-longa | gambeson | 4,30 | 2,97 | 7,90 | 11,43 | 1,446 | 75,1% [73,2%; 76,9%], n=2000 | 3,2 pp | 0,0% |
| V1+V2 | 12 | 5×4 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V1+V2 | 12 | 5×4 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 12 | 5×4 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V1+V2 | 12 | 5×4 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V1+V2 | 12 | 6×5 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 12 | 6×5 | espada-longa | gambeson | 4,30 | 2,97 | 7,90 | 11,43 | 1,446 | 75,1% [73,2%; 76,9%], n=2000 | 3,2 pp | 0,0% |
| V1+V2 | 12 | 6×5 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V1+V2 | 12 | 6×5 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V1+V2 | 12 | 6×5 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V1+V2 | 12 | 6×5 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V1+V3 | 6 | 1×0 | espada-longa | nenhuma | 5,69 | 3,75 | 5,97 | 9,07 | 1,519 | 76,8% [74,8%; 78,5%], n=2000 | 8,3 pp | 0,0% |
| V1+V3 | 6 | 1×0 | espada-longa | gambeson | 3,99 | 3,24 | 8,53 | 10,48 | 1,229 | 75,3% [73,4%; 77,1%], n=2000 | 11,0 pp | 0,0% |
| V1+V3 | 6 | 1×0 | espada-longa | malha | 0,81 | 0,43 | 42,03 | 78,84 | 1,876 | 84,1% [82,4%; 85,6%], n=2000 | 1,4 pp | 0,0% |
| V1+V3 | 6 | 1×0 | montante | nenhuma | 9,43 | 5,35 | 3,61 | 6,35 | 1,761 | 72,9% [70,9%; 74,8%], n=2000 | 9,5 pp | 0,0% |
| V1+V3 | 6 | 1×0 | montante | gambeson | 7,38 | 4,47 | 4,61 | 7,61 | 1,653 | 75,9% [74,0%; 77,8%], n=2000 | 6,1 pp | 0,0% |
| V1+V3 | 6 | 1×0 | montante | malha | 5,42 | 3,01 | 6,27 | 11,29 | 1,800 | 79,9% [78,1%; 81,6%], n=2000 | 6,8 pp | 0,0% |
| V1+V3 | 6 | 2×1 | espada-longa | nenhuma | 5,79 | 3,25 | 5,87 | 10,45 | 1,779 | 87,4% [85,8%; 88,7%], n=2000 | 3,3 pp | 0,0% |
| V1+V3 | 6 | 2×1 | espada-longa | gambeson | 3,99 | 3,17 | 8,53 | 10,74 | 1,259 | 78,5% [76,6%; 80,2%], n=2000 | 12,3 pp | 0,0% |
| V1+V3 | 6 | 2×1 | espada-longa | malha | 0,86 | 0,18 | 39,75 | 187,98 | 4,729 | 99,8% [99,5%; 99,9%], n=2000 | -0,2 pp | 0,0% |
| V1+V3 | 6 | 2×1 | montante | nenhuma | 9,61 | 4,85 | 3,54 | 7,01 | 1,983 | 77,5% [75,6%; 79,3%], n=2000 | 6,8 pp | 0,0% |
| V1+V3 | 6 | 2×1 | montante | gambeson | 7,45 | 4,07 | 4,56 | 8,36 | 1,833 | 80,8% [79,0%; 82,4%], n=2000 | 4,7 pp | 0,0% |
| V1+V3 | 6 | 2×1 | montante | malha | 5,50 | 2,60 | 6,18 | 13,08 | 2,116 | 86,1% [84,5%; 87,5%], n=2000 | 2,7 pp | 0,0% |
| V1+V3 | 6 | 3×2 | espada-longa | nenhuma | 5,05 | 3,40 | 6,74 | 10,00 | 1,485 | 78,3% [76,5%; 80,1%], n=2000 | 5,3 pp | 0,0% |
| V1+V3 | 6 | 3×2 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1+V3 | 6 | 3×2 | espada-longa | malha | 0,41 | 0,21 | 83,40 | 159,82 | 1,916 | 85,7% [84,1%; 87,2%], n=1999 | 1,0 pp | 0,0% |
| V1+V3 | 6 | 3×2 | montante | nenhuma | 8,76 | 4,99 | 3,88 | 6,82 | 1,756 | 73,9% [71,9%; 75,7%], n=2000 | 7,9 pp | 0,0% |
| V1+V3 | 6 | 3×2 | montante | gambeson | 6,79 | 4,15 | 5,01 | 8,19 | 1,635 | 75,8% [73,9%; 77,7%], n=2000 | 5,9 pp | 0,0% |
| V1+V3 | 6 | 3×2 | montante | malha | 4,73 | 2,68 | 7,18 | 12,69 | 1,767 | 80,0% [78,1%; 81,6%], n=2000 | 2,9 pp | 0,0% |
| V1+V3 | 6 | 4×3 | espada-longa | nenhuma | 5,10 | 2,99 | 6,66 | 11,36 | 1,705 | 88,1% [86,6%; 89,4%], n=2000 | 1,6 pp | 0,0% |
| V1+V3 | 6 | 4×3 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1+V3 | 6 | 4×3 | espada-longa | malha | 0,43 | 0,06 | 79,07 | 577,76 | 7,307 | 100,0% [99,8%; 100,0%], n=1999 | 0,0 pp | 0,0% |
| V1+V3 | 6 | 4×3 | montante | nenhuma | 8,88 | 4,53 | 3,83 | 7,51 | 1,962 | 77,7% [75,8%; 79,5%], n=2000 | 7,0 pp | 0,0% |
| V1+V3 | 6 | 4×3 | montante | gambeson | 6,87 | 3,79 | 4,95 | 8,98 | 1,814 | 81,5% [79,8%; 83,2%], n=2000 | 5,3 pp | 0,0% |
| V1+V3 | 6 | 4×3 | montante | malha | 4,83 | 2,28 | 7,04 | 14,92 | 2,119 | 87,8% [86,3%; 89,2%], n=2000 | 0,6 pp | 0,0% |
| V1+V3 | 6 | 5×4 | espada-longa | nenhuma | 4,51 | 3,11 | 7,54 | 10,93 | 1,449 | 78,9% [77,1%; 80,6%], n=2000 | 4,4 pp | 0,0% |
| V1+V3 | 6 | 5×4 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1+V3 | 6 | 5×4 | espada-longa | malha | 0,13 | 0,08 | 258,56 | 413,68 | 1,600 | 100,0% [64,6%; 100,0%], n=7 | 0,0 pp | 99,7% |
| V1+V3 | 6 | 5×4 | montante | nenhuma | 8,17 | 4,55 | 4,16 | 7,48 | 1,798 | 75,1% [73,2%; 77,0%], n=2000 | 7,9 pp | 0,0% |
| V1+V3 | 6 | 5×4 | montante | gambeson | 6,28 | 3,87 | 5,41 | 8,79 | 1,625 | 77,1% [75,3%; 78,9%], n=2000 | 5,5 pp | 0,0% |
| V1+V3 | 6 | 5×4 | montante | malha | 4,07 | 2,37 | 8,36 | 14,32 | 1,713 | 80,0% [78,1%; 81,6%], n=2000 | 4,1 pp | 0,0% |
| V1+V3 | 6 | 6×5 | espada-longa | nenhuma | 4,56 | 2,80 | 7,46 | 12,16 | 1,629 | 87,5% [86,0%; 88,9%], n=2000 | 2,8 pp | 0,0% |
| V1+V3 | 6 | 6×5 | espada-longa | gambeson | 3,86 | 3,15 | 8,82 | 10,79 | 1,224 | 72,4% [70,4%; 74,3%], n=2000 | 16,6 pp | 0,0% |
| V1+V3 | 6 | 6×5 | espada-longa | malha | 0,13 | 0,00 | 255,80 | ∞ | n/d | 100,0% [64,6%; 100,0%], n=7 | 0,0 pp | 99,7% |
| V1+V3 | 6 | 6×5 | montante | nenhuma | 8,27 | 4,09 | 4,11 | 8,30 | 2,019 | 79,8% [78,0%; 81,5%], n=2000 | 7,8 pp | 0,0% |
| V1+V3 | 6 | 6×5 | montante | gambeson | 6,36 | 3,58 | 5,35 | 9,51 | 1,778 | 82,2% [80,4%; 83,8%], n=2000 | 4,3 pp | 0,0% |
| V1+V3 | 6 | 6×5 | montante | malha | 4,16 | 2,00 | 8,16 | 16,99 | 2,082 | 89,0% [87,6%; 90,3%], n=2000 | 2,4 pp | 0,0% |
| V1+V3 | 8 | 1×0 | espada-longa | nenhuma | 5,98 | 3,87 | 5,68 | 8,78 | 1,545 | 75,5% [73,6%; 77,3%], n=2000 | 8,6 pp | 0,0% |
| V1+V3 | 8 | 1×0 | espada-longa | gambeson | 4,04 | 3,06 | 8,42 | 11,10 | 1,319 | 76,1% [74,2%; 78,0%], n=2000 | 8,1 pp | 0,0% |
| V1+V3 | 8 | 1×0 | espada-longa | malha | 1,24 | 0,67 | 27,47 | 50,47 | 1,837 | 81,5% [79,8%; 83,2%], n=2000 | 3,3 pp | 0,0% |
| V1+V3 | 8 | 1×0 | montante | nenhuma | 9,85 | 5,52 | 3,45 | 6,16 | 1,783 | 71,5% [69,5%; 73,5%], n=2000 | 10,5 pp | 0,0% |
| V1+V3 | 8 | 1×0 | montante | gambeson | 7,92 | 4,74 | 4,29 | 7,17 | 1,669 | 73,9% [71,9%; 75,8%], n=2000 | 7,8 pp | 0,0% |
| V1+V3 | 8 | 1×0 | montante | malha | 6,19 | 3,43 | 5,49 | 9,91 | 1,805 | 77,1% [75,2%; 78,9%], n=2000 | 6,2 pp | 0,0% |
| V1+V3 | 8 | 2×1 | espada-longa | nenhuma | 6,11 | 3,33 | 5,56 | 10,22 | 1,837 | 84,8% [83,1%; 86,3%], n=2000 | 4,3 pp | 0,0% |
| V1+V3 | 8 | 2×1 | espada-longa | gambeson | 4,07 | 2,85 | 8,35 | 11,92 | 1,428 | 85,7% [84,0%; 87,1%], n=2000 | 3,3 pp | 0,0% |
| V1+V3 | 8 | 2×1 | espada-longa | malha | 1,32 | 0,35 | 25,80 | 98,02 | 3,800 | 98,7% [98,1%; 99,1%], n=2000 | 0,4 pp | 0,0% |
| V1+V3 | 8 | 2×1 | montante | nenhuma | 9,99 | 5,05 | 3,40 | 6,73 | 1,977 | 75,0% [73,1%; 76,8%], n=2000 | 8,4 pp | 0,0% |
| V1+V3 | 8 | 2×1 | montante | gambeson | 7,97 | 4,37 | 4,26 | 7,78 | 1,825 | 77,8% [75,9%; 79,6%], n=2000 | 7,4 pp | 0,0% |
| V1+V3 | 8 | 2×1 | montante | malha | 6,24 | 3,04 | 5,45 | 11,19 | 2,055 | 82,5% [80,8%; 84,1%], n=2000 | 4,4 pp | 0,0% |
| V1+V3 | 8 | 3×2 | espada-longa | nenhuma | 5,27 | 3,46 | 6,45 | 9,84 | 1,525 | 76,4% [74,5%; 78,2%], n=2000 | 4,8 pp | 0,0% |
| V1+V3 | 8 | 3×2 | espada-longa | gambeson | 3,80 | 2,93 | 8,94 | 11,61 | 1,299 | 75,6% [73,7%; 77,4%], n=2000 | 7,4 pp | 0,0% |
| V1+V3 | 8 | 3×2 | espada-longa | malha | 0,75 | 0,40 | 45,08 | 85,82 | 1,904 | 83,7% [82,0%; 85,3%], n=2000 | 2,0 pp | 0,0% |
| V1+V3 | 8 | 3×2 | montante | nenhuma | 9,26 | 5,20 | 3,67 | 6,54 | 1,781 | 72,3% [70,2%; 74,2%], n=2000 | 9,3 pp | 0,0% |
| V1+V3 | 8 | 3×2 | montante | gambeson | 7,32 | 4,39 | 4,64 | 7,75 | 1,670 | 74,5% [72,5%; 76,4%], n=2000 | 9,0 pp | 0,0% |
| V1+V3 | 8 | 3×2 | montante | malha | 5,56 | 3,08 | 6,12 | 11,05 | 1,807 | 78,0% [76,1%; 79,8%], n=2000 | 4,0 pp | 0,0% |
| V1+V3 | 8 | 4×3 | espada-longa | nenhuma | 5,36 | 3,03 | 6,34 | 11,22 | 1,768 | 84,8% [83,2%; 86,3%], n=2000 | 3,2 pp | 0,0% |
| V1+V3 | 8 | 4×3 | espada-longa | gambeson | 3,80 | 2,85 | 8,94 | 11,91 | 1,333 | 78,5% [76,6%; 80,2%], n=2000 | 6,1 pp | 0,0% |
| V1+V3 | 8 | 4×3 | espada-longa | malha | 0,80 | 0,17 | 42,40 | 204,02 | 4,812 | 99,8% [99,4%; 99,9%], n=2000 | -0,1 pp | 0,0% |
| V1+V3 | 8 | 4×3 | montante | nenhuma | 9,43 | 4,76 | 3,61 | 7,14 | 1,981 | 75,5% [73,6%; 77,4%], n=2000 | 9,1 pp | 0,0% |
| V1+V3 | 8 | 4×3 | montante | gambeson | 7,43 | 3,99 | 4,58 | 8,53 | 1,864 | 79,7% [77,9%; 81,4%], n=2000 | 8,2 pp | 0,0% |
| V1+V3 | 8 | 4×3 | montante | malha | 5,64 | 2,68 | 6,02 | 12,70 | 2,109 | 84,4% [82,7%; 85,9%], n=2000 | 4,5 pp | 0,0% |
| V1+V3 | 8 | 5×4 | espada-longa | nenhuma | 4,67 | 3,14 | 7,28 | 10,84 | 1,488 | 75,7% [73,8%; 77,5%], n=2000 | 6,6 pp | 0,0% |
| V1+V3 | 8 | 5×4 | espada-longa | gambeson | 3,69 | 2,84 | 9,22 | 11,97 | 1,298 | 75,1% [73,2%; 76,9%], n=2000 | 7,0 pp | 0,0% |
| V1+V3 | 8 | 5×4 | espada-longa | malha | 0,38 | 0,20 | 90,07 | 173,45 | 1,926 | 85,8% [84,2%; 87,3%], n=1992 | 1,0 pp | 0,4% |
| V1+V3 | 8 | 5×4 | montante | nenhuma | 8,64 | 4,91 | 3,93 | 6,93 | 1,762 | 72,7% [70,7%; 74,6%], n=2000 | 11,1 pp | 0,0% |
| V1+V3 | 8 | 5×4 | montante | gambeson | 6,81 | 4,03 | 4,99 | 8,43 | 1,689 | 76,4% [74,5%; 78,3%], n=2000 | 8,7 pp | 0,0% |
| V1+V3 | 8 | 5×4 | montante | malha | 4,93 | 2,75 | 6,89 | 12,35 | 1,792 | 79,4% [77,6%; 81,1%], n=2000 | 5,8 pp | 0,0% |
| V1+V3 | 8 | 6×5 | espada-longa | nenhuma | 4,77 | 2,77 | 7,13 | 12,29 | 1,724 | 85,6% [84,0%; 87,1%], n=2000 | 5,0 pp | 0,0% |
| V1+V3 | 8 | 6×5 | espada-longa | gambeson | 3,69 | 2,84 | 9,22 | 11,97 | 1,298 | 75,1% [73,2%; 76,9%], n=2000 | 7,0 pp | 0,0% |
| V1+V3 | 8 | 6×5 | espada-longa | malha | 0,40 | 0,05 | 84,90 | 618,97 | 7,291 | 100,0% [99,8%; 100,0%], n=1993 | 0,0 pp | 0,3% |
| V1+V3 | 8 | 6×5 | montante | nenhuma | 8,78 | 4,44 | 3,87 | 7,65 | 1,977 | 76,8% [74,9%; 78,6%], n=2000 | 8,4 pp | 0,0% |
| V1+V3 | 8 | 6×5 | montante | gambeson | 6,86 | 3,70 | 4,95 | 9,19 | 1,855 | 80,9% [79,1%; 82,6%], n=2000 | 7,0 pp | 0,0% |
| V1+V3 | 8 | 6×5 | montante | malha | 5,03 | 2,36 | 6,75 | 14,39 | 2,130 | 86,0% [84,4%; 87,4%], n=2000 | 4,1 pp | 0,0% |
| V1+V3 | 12 | 1×0 | espada-longa | nenhuma | 6,32 | 4,07 | 5,38 | 8,35 | 1,553 | 72,2% [70,2%; 74,1%], n=2000 | 4,0 pp | 0,0% |
| V1+V3 | 12 | 1×0 | espada-longa | gambeson | 4,30 | 2,97 | 7,90 | 11,43 | 1,446 | 75,1% [73,2%; 76,9%], n=2000 | 3,2 pp | 0,0% |
| V1+V3 | 12 | 1×0 | espada-longa | malha | 2,19 | 1,22 | 15,53 | 27,96 | 1,801 | 79,3% [77,5%; 81,0%], n=2000 | 0,6 pp | 0,0% |
| V1+V3 | 12 | 1×0 | montante | nenhuma | 10,03 | 5,98 | 3,39 | 5,68 | 1,677 | 68,5% [66,4%; 70,4%], n=2000 | 3,3 pp | 0,0% |
| V1+V3 | 12 | 1×0 | montante | gambeson | 8,74 | 5,27 | 3,89 | 6,45 | 1,658 | 70,1% [68,1%; 72,1%], n=2000 | 3,4 pp | 0,0% |
| V1+V3 | 12 | 1×0 | montante | malha | 7,19 | 4,23 | 4,73 | 8,04 | 1,700 | 70,9% [68,9%; 72,8%], n=2000 | 2,4 pp | 0,0% |
| V1+V3 | 12 | 2×1 | espada-longa | nenhuma | 6,37 | 3,66 | 5,34 | 9,29 | 1,740 | 77,1% [75,2%; 78,9%], n=2000 | 2,2 pp | 0,0% |
| V1+V3 | 12 | 2×1 | espada-longa | gambeson | 4,37 | 2,67 | 7,78 | 12,74 | 1,638 | 83,0% [81,3%; 84,6%], n=2000 | 0,9 pp | 0,0% |
| V1+V3 | 12 | 2×1 | espada-longa | malha | 2,29 | 0,79 | 14,83 | 43,11 | 2,907 | 93,8% [92,7%; 94,8%], n=2000 | 2,2 pp | 0,0% |
| V1+V3 | 12 | 2×1 | montante | nenhuma | 10,06 | 5,73 | 3,38 | 5,93 | 1,754 | 69,9% [67,9%; 71,9%], n=2000 | 3,6 pp | 0,0% |
| V1+V3 | 12 | 2×1 | montante | gambeson | 8,79 | 4,90 | 3,87 | 6,94 | 1,795 | 72,9% [70,9%; 74,8%], n=2000 | 2,4 pp | 0,0% |
| V1+V3 | 12 | 2×1 | montante | malha | 7,30 | 3,82 | 4,66 | 8,89 | 1,909 | 75,0% [73,1%; 76,8%], n=2000 | 2,2 pp | 0,0% |
| V1+V3 | 12 | 3×2 | espada-longa | nenhuma | 5,75 | 3,68 | 5,91 | 9,24 | 1,563 | 72,8% [70,8%; 74,7%], n=2000 | 2,7 pp | 0,0% |
| V1+V3 | 12 | 3×2 | espada-longa | gambeson | 3,92 | 2,73 | 8,68 | 12,48 | 1,438 | 76,3% [74,4%; 78,1%], n=2000 | 2,6 pp | 0,0% |
| V1+V3 | 12 | 3×2 | espada-longa | malha | 1,57 | 0,86 | 21,69 | 39,57 | 1,824 | 79,6% [77,8%; 81,3%], n=2000 | 1,4 pp | 0,0% |
| V1+V3 | 12 | 3×2 | montante | nenhuma | 9,67 | 5,65 | 3,52 | 6,02 | 1,712 | 69,2% [67,1%; 71,2%], n=2000 | 3,6 pp | 0,0% |
| V1+V3 | 12 | 3×2 | montante | gambeson | 8,16 | 4,98 | 4,17 | 6,83 | 1,639 | 70,2% [68,1%; 72,1%], n=2000 | 3,3 pp | 0,0% |
| V1+V3 | 12 | 3×2 | montante | malha | 6,64 | 3,92 | 5,12 | 8,67 | 1,693 | 71,5% [69,5%; 73,4%], n=2000 | 1,4 pp | 0,0% |
| V1+V3 | 12 | 4×3 | espada-longa | nenhuma | 5,82 | 3,24 | 5,84 | 10,49 | 1,796 | 79,4% [77,6%; 81,1%], n=2000 | 2,0 pp | 0,0% |
| V1+V3 | 12 | 4×3 | espada-longa | gambeson | 3,96 | 2,50 | 8,58 | 13,60 | 1,585 | 82,8% [81,1%; 84,4%], n=2000 | 2,5 pp | 0,0% |
| V1+V3 | 12 | 4×3 | espada-longa | malha | 1,66 | 0,51 | 20,43 | 66,98 | 3,279 | 96,6% [95,7%; 97,3%], n=2000 | 1,0 pp | 0,0% |
| V1+V3 | 12 | 4×3 | montante | nenhuma | 9,59 | 5,44 | 3,55 | 6,25 | 1,763 | 70,6% [68,6%; 72,6%], n=2000 | 3,6 pp | 0,0% |
| V1+V3 | 12 | 4×3 | montante | gambeson | 8,28 | 4,57 | 4,11 | 7,44 | 1,812 | 73,7% [71,7%; 75,5%], n=2000 | 2,3 pp | 0,0% |
| V1+V3 | 12 | 4×3 | montante | malha | 6,78 | 3,53 | 5,01 | 9,64 | 1,923 | 76,3% [74,3%; 78,1%], n=2000 | 1,7 pp | 0,0% |
| V1+V3 | 12 | 5×4 | espada-longa | nenhuma | 5,15 | 3,30 | 6,61 | 10,30 | 1,558 | 74,0% [72,0%; 75,9%], n=2000 | 1,2 pp | 0,0% |
| V1+V3 | 12 | 5×4 | espada-longa | gambeson | 3,62 | 2,56 | 9,40 | 13,28 | 1,413 | 76,9% [75,0%; 78,7%], n=2000 | 3,0 pp | 0,0% |
| V1+V3 | 12 | 5×4 | espada-longa | malha | 1,05 | 0,56 | 32,31 | 60,26 | 1,865 | 82,1% [80,4%; 83,7%], n=2000 | -1,2 pp | 0,0% |
| V1+V3 | 12 | 5×4 | montante | nenhuma | 9,18 | 5,37 | 3,70 | 6,33 | 1,710 | 69,5% [67,5%; 71,5%], n=2000 | 3,7 pp | 0,0% |
| V1+V3 | 12 | 5×4 | montante | gambeson | 7,67 | 4,68 | 4,43 | 7,26 | 1,637 | 70,2% [68,2%; 72,2%], n=2000 | 3,2 pp | 0,0% |
| V1+V3 | 12 | 5×4 | montante | malha | 6,13 | 3,59 | 5,54 | 9,48 | 1,711 | 72,3% [70,3%; 74,2%], n=2000 | 1,4 pp | 0,0% |
| V1+V3 | 12 | 6×5 | espada-longa | nenhuma | 5,24 | 2,85 | 6,49 | 11,94 | 1,841 | 82,1% [80,4%; 83,7%], n=2000 | 0,0 pp | 0,0% |
| V1+V3 | 12 | 6×5 | espada-longa | gambeson | 3,66 | 2,40 | 9,29 | 14,18 | 1,526 | 83,0% [81,3%; 84,6%], n=2000 | 2,4 pp | 0,0% |
| V1+V3 | 12 | 6×5 | espada-longa | malha | 1,13 | 0,29 | 30,21 | 115,43 | 3,822 | 98,6% [97,9%; 99,0%], n=2000 | 0,3 pp | 0,0% |
| V1+V3 | 12 | 6×5 | montante | nenhuma | 9,16 | 5,11 | 3,71 | 6,65 | 1,792 | 72,0% [69,9%; 73,9%], n=2000 | 2,5 pp | 0,0% |
| V1+V3 | 12 | 6×5 | montante | gambeson | 7,73 | 4,32 | 4,40 | 7,87 | 1,789 | 73,5% [71,5%; 75,3%], n=2000 | 3,1 pp | 0,0% |
| V1+V3 | 12 | 6×5 | montante | malha | 6,24 | 3,22 | 5,45 | 10,55 | 1,937 | 77,3% [75,4%; 79,0%], n=2000 | -0,1 pp | 0,0% |


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
| 6 | 5×3 de 4 | sem teto | 6,7% | 3,1% |
| 6 | 5×3 de 4 | −4 | 6,7% | 3,1% |
| 6 | 5×3 de 4 | −6 | 6,7% | 3,1% |
| 6 | 6×3 de 5 | sem teto | 0,0% | 82,4% |
| 6 | 6×3 de 5 | −4 | 0,0% | 82,4% |
| 6 | 6×3 de 5 | −6 | 0,0% | 82,4% |
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
| 8 | 6×3 de 5 | sem teto | 3,1% | 0,1% |
| 8 | 6×3 de 5 | −4 | 3,1% | 0,1% |
| 8 | 6×3 de 5 | −6 | 3,1% | 0,1% |
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


## 6. E · Valor marginal das alavancas e variantes

Centelha 1/3/5; espada longa e gambeson. A é a peça modificada; B é a ficha igual sem modificação. O valor de +1 Atributo usa Destreza. +1 Habilidade altera Armas. Ticks alteram somente a anatomia da peça modificada.

| cenário | soma | C | alavanca | dano A→B | dano B→A | golpes A→B | golpes B→A | força relativa | vitória A, IC95% | viés | censura |
|---|---|---|---|---|---|---|---|---|---|---|---|
| regra atual | 6 | 1 | ataque+1 | 2,04 | 2,09 | 16,68 | 16,25 | 0,974 | 43,3% [41,1%; 45,4%], n=2000 | 3,3 pp | 0,0% |
| regra atual | 6 | 1 | defesa+1 | 2,09 | 2,08 | 16,28 | 16,32 | 1,002 | 48,3% [46,1%; 50,5%], n=2000 | 0,0 pp | 0,0% |
| regra atual | 6 | 1 | dano+1 | 2,63 | 2,11 | 12,92 | 16,13 | 1,249 | 78,0% [76,1%; 79,7%], n=2000 | -3,7 pp | 0,0% |
| regra atual | 6 | 1 | dano+1d6 | 4,55 | 2,04 | 7,47 | 16,66 | 2,231 | 99,4% [99,0%; 99,7%], n=2000 | 0,4 pp | 0,0% |
| regra atual | 6 | 1 | absorcao+1 | 2,05 | 1,71 | 16,55 | 19,85 | 1,199 | 77,1% [75,2%; 78,9%], n=2000 | 2,8 pp | 0,0% |
| regra atual | 6 | 1 | pv+1 | 2,08 | 2,09 | 16,32 | 16,75 | 1,027 | 54,1% [51,9%; 56,3%], n=2000 | 1,2 pp | 0,0% |
| regra atual | 6 | 1 | pv+5 | 2,07 | 2,10 | 16,42 | 18,61 | 1,133 | 70,9% [68,9%; 72,8%], n=2000 | 3,8 pp | 0,0% |
| regra atual | 6 | 1 | preparo-1 | 2,06 | 2,10 | 16,49 | 16,16 | 0,980 | 69,7% [67,6%; 71,7%], n=2000 | 2,0 pp | 0,0% |
| regra atual | 6 | 1 | recuperacao-1 | 2,07 | 2,11 | 16,41 | 16,09 | 0,980 | 69,8% [67,7%; 71,7%], n=2000 | 1,5 pp | 0,0% |
| regra atual | 6 | 1 | habilidade+1 | 1,98 | 2,08 | 17,20 | 16,35 | 0,950 | 37,9% [35,7%; 40,0%], n=2000 | 0,3 pp | 0,0% |
| regra atual | 6 | 1 | atributo+1 | 1,96 | 1,97 | 17,32 | 17,29 | 0,998 | 42,0% [39,9%; 44,2%], n=2000 | 0,5 pp | 0,0% |
| regra atual | 6 | 3 | ataque+1 | 1,17 | 1,24 | 29,04 | 27,42 | 0,944 | 35,3% [33,2%; 37,4%], n=2000 | -2,1 pp | 0,0% |
| regra atual | 6 | 3 | defesa+1 | 1,34 | 1,41 | 25,35 | 24,09 | 0,950 | 38,6% [36,5%; 40,8%], n=2000 | -2,1 pp | 0,0% |
| regra atual | 6 | 3 | dano+1 | 1,59 | 1,40 | 21,40 | 24,29 | 1,135 | 72,7% [70,7%; 74,6%], n=2000 | 0,1 pp | 0,0% |
| regra atual | 6 | 3 | dano+1d6 | 3,11 | 1,46 | 10,94 | 23,24 | 2,124 | 99,0% [98,4%; 99,3%], n=2000 | 0,3 pp | 0,0% |
| regra atual | 6 | 3 | absorcao+1 | 1,22 | 1,15 | 27,93 | 29,57 | 1,059 | 64,8% [62,7%; 66,9%], n=2000 | 1,0 pp | 0,0% |
| regra atual | 6 | 3 | pv+1 | 1,29 | 1,31 | 26,42 | 26,75 | 1,012 | 53,5% [51,4%; 55,7%], n=2000 | 3,1 pp | 0,0% |
| regra atual | 6 | 3 | pv+5 | 1,25 | 1,34 | 27,23 | 29,02 | 1,066 | 67,4% [65,3%; 69,4%], n=2000 | -1,8 pp | 0,0% |
| regra atual | 6 | 3 | preparo-1 | 1,24 | 1,39 | 27,35 | 24,54 | 0,897 | 59,3% [57,1%; 61,4%], n=2000 | 0,7 pp | 0,0% |
| regra atual | 6 | 3 | recuperacao-1 | 1,25 | 1,39 | 27,21 | 24,51 | 0,901 | 59,6% [57,4%; 61,7%], n=2000 | 2,5 pp | 0,0% |
| regra atual | 6 | 3 | habilidade+1 | 1,05 | 1,17 | 32,33 | 29,17 | 0,902 | 28,4% [26,5%; 30,4%], n=2000 | -1,0 pp | 0,0% |
| regra atual | 6 | 3 | atributo+1 | 1,13 | 1,41 | 29,96 | 24,11 | 0,805 | 12,3% [10,9%; 13,8%], n=2000 | -2,0 pp | 0,0% |
| regra atual | 6 | 5 | ataque+1 | 0,55 | 0,60 | 62,13 | 56,84 | 0,915 | 0,0% [0,0%; 0,2%], n=1598 | 0,0 pp | 20,1% |
| regra atual | 6 | 5 | defesa+1 | 0,63 | 0,66 | 54,20 | 51,65 | 0,953 | 27,3% [25,2%; 29,6%], n=1587 | -1,9 pp | 20,7% |
| regra atual | 6 | 5 | dano+1 | 0,98 | 0,92 | 34,58 | 36,93 | 1,068 | 78,2% [76,4%; 80,0%], n=1999 | -4,9 pp | 0,0% |
| regra atual | 6 | 5 | dano+1d6 | 1,92 | 1,20 | 17,70 | 28,35 | 1,602 | 98,5% [97,9%; 98,9%], n=2000 | -1,6 pp | 0,0% |
| regra atual | 6 | 5 | absorcao+1 | 0,62 | 0,62 | 54,87 | 54,87 | 1,000 | 50,0% [47,5%; 52,5%], n=1596 | 0,8 pp | 20,2% |
| regra atual | 6 | 5 | pv+1 | 0,62 | 0,62 | 54,98 | 56,42 | 1,026 | 48,9% [46,5%; 51,4%], n=1593 | -1,6 pp | 20,4% |
| regra atual | 6 | 5 | pv+5 | 0,61 | 0,68 | 56,15 | 57,58 | 1,026 | 49,9% [47,5%; 52,4%], n=1596 | -0,6 pp | 20,2% |
| regra atual | 6 | 5 | preparo-1 | 0,88 | 1,02 | 38,58 | 33,23 | 0,861 | 53,0% [50,9%; 55,2%], n=2000 | 1,7 pp | 0,0% |
| regra atual | 6 | 5 | recuperacao-1 | 0,88 | 1,03 | 38,45 | 33,07 | 0,860 | 50,1% [48,0%; 52,3%], n=2000 | 2,7 pp | 0,0% |
| regra atual | 6 | 5 | habilidade+1 | 0,51 | 0,56 | 66,54 | 60,77 | 0,913 | 0,0% [0,0%; 0,2%], n=1598 | 0,0 pp | 20,1% |
| regra atual | 6 | 5 | atributo+1 | 0,84 | 0,98 | 40,62 | 34,76 | 0,856 | 0,0% [0,0%; 0,2%], n=2000 | 0,0 pp | 0,0% |
| regra atual | 8 | 1 | ataque+1 | 2,57 | 2,48 | 13,24 | 13,71 | 1,035 | 52,5% [50,3%; 54,7%], n=2000 | -0,8 pp | 0,0% |
| regra atual | 8 | 1 | defesa+1 | 2,49 | 2,30 | 13,66 | 14,77 | 1,082 | 54,8% [52,6%; 57,0%], n=2000 | 0,2 pp | 0,0% |
| regra atual | 8 | 1 | dano+1 | 3,15 | 2,41 | 10,80 | 14,08 | 1,304 | 78,1% [76,2%; 79,9%], n=2000 | 1,4 pp | 0,0% |
| regra atual | 8 | 1 | dano+1d6 | 4,95 | 2,29 | 6,87 | 14,85 | 2,161 | 96,2% [95,3%; 97,0%], n=2000 | 1,2 pp | 0,0% |
| regra atual | 8 | 1 | absorcao+1 | 2,52 | 1,97 | 13,47 | 17,26 | 1,281 | 77,8% [75,9%; 79,5%], n=2000 | -2,7 pp | 0,0% |
| regra atual | 8 | 1 | pv+1 | 2,49 | 2,46 | 13,65 | 14,22 | 1,042 | 54,5% [52,4%; 56,7%], n=2000 | -3,1 pp | 0,0% |
| regra atual | 8 | 1 | pv+5 | 2,52 | 2,43 | 13,49 | 16,05 | 1,190 | 70,8% [68,7%; 72,7%], n=2000 | -2,7 pp | 0,0% |
| regra atual | 8 | 1 | preparo-1 | 2,53 | 2,40 | 13,44 | 14,19 | 1,056 | 73,0% [71,0%; 74,9%], n=2000 | -1,1 pp | 0,0% |
| regra atual | 8 | 1 | recuperacao-1 | 2,52 | 2,44 | 13,47 | 13,92 | 1,033 | 71,3% [69,3%; 73,2%], n=2000 | -0,6 pp | 0,0% |
| regra atual | 8 | 1 | habilidade+1 | 2,61 | 2,48 | 13,03 | 13,73 | 1,054 | 54,4% [52,3%; 56,6%], n=2000 | 0,3 pp | 0,0% |
| regra atual | 8 | 1 | atributo+1 | 2,61 | 1,98 | 13,03 | 17,20 | 1,320 | 72,3% [70,2%; 74,2%], n=2000 | 1,9 pp | 0,0% |
| regra atual | 8 | 3 | ataque+1 | 1,56 | 1,60 | 21,86 | 21,20 | 0,970 | 44,5% [42,3%; 46,6%], n=2000 | 0,9 pp | 0,0% |
| regra atual | 8 | 3 | defesa+1 | 1,61 | 1,61 | 21,13 | 21,11 | 0,999 | 47,8% [45,6%; 49,9%], n=2000 | 0,3 pp | 0,0% |
| regra atual | 8 | 3 | dano+1 | 2,00 | 1,62 | 17,00 | 20,95 | 1,232 | 77,0% [75,1%; 78,8%], n=2000 | 3,0 pp | 0,0% |
| regra atual | 8 | 3 | dano+1d6 | 3,63 | 1,59 | 9,35 | 21,36 | 2,283 | 98,3% [97,6%; 98,7%], n=2000 | 0,3 pp | 0,0% |
| regra atual | 8 | 3 | absorcao+1 | 1,57 | 1,35 | 21,61 | 25,16 | 1,164 | 71,3% [69,2%; 73,2%], n=2000 | 0,7 pp | 0,0% |
| regra atual | 8 | 3 | pv+1 | 1,60 | 1,61 | 21,24 | 21,79 | 1,026 | 53,8% [51,6%; 56,0%], n=2000 | 1,8 pp | 0,0% |
| regra atual | 8 | 3 | pv+5 | 1,59 | 1,62 | 21,45 | 24,13 | 1,125 | 69,5% [67,4%; 71,5%], n=2000 | 0,0 pp | 0,0% |
| regra atual | 8 | 3 | preparo-1 | 1,58 | 1,64 | 21,55 | 20,78 | 0,964 | 67,8% [65,8%; 69,9%], n=2000 | 0,7 pp | 0,0% |
| regra atual | 8 | 3 | recuperacao-1 | 1,58 | 1,64 | 21,58 | 20,72 | 0,960 | 65,3% [63,2%; 67,4%], n=2000 | -0,1 pp | 0,0% |
| regra atual | 8 | 3 | habilidade+1 | 1,48 | 1,59 | 23,01 | 21,34 | 0,928 | 35,1% [33,0%; 37,2%], n=2000 | 2,4 pp | 0,0% |
| regra atual | 8 | 3 | atributo+1 | 1,47 | 1,57 | 23,13 | 21,63 | 0,935 | 35,8% [33,7%; 37,9%], n=2000 | 1,2 pp | 0,0% |
| regra atual | 8 | 5 | ataque+1 | 0,99 | 1,04 | 34,28 | 32,60 | 0,951 | 39,4% [37,2%; 41,5%], n=2000 | -3,3 pp | 0,0% |
| regra atual | 8 | 5 | defesa+1 | 1,13 | 1,18 | 30,22 | 28,77 | 0,952 | 41,9% [39,7%; 44,0%], n=2000 | -5,7 pp | 0,0% |
| regra atual | 8 | 5 | dano+1 | 1,25 | 1,14 | 27,10 | 29,71 | 1,096 | 65,8% [63,7%; 67,8%], n=2000 | -5,0 pp | 0,0% |
| regra atual | 8 | 5 | dano+1d6 | 2,42 | 1,23 | 14,05 | 27,70 | 1,972 | 97,6% [96,8%; 98,2%], n=2000 | 0,2 pp | 0,0% |
| regra atual | 8 | 5 | absorcao+1 | 1,07 | 0,99 | 31,74 | 34,19 | 1,077 | 70,7% [68,6%; 72,6%], n=2000 | 0,3 pp | 0,0% |
| regra atual | 8 | 5 | pv+1 | 1,08 | 1,10 | 31,39 | 31,87 | 1,015 | 53,5% [51,4%; 55,7%], n=2000 | -0,5 pp | 0,0% |
| regra atual | 8 | 5 | pv+5 | 1,06 | 1,12 | 32,15 | 34,88 | 1,085 | 67,5% [65,5%; 69,6%], n=2000 | -0,9 pp | 0,0% |
| regra atual | 8 | 5 | preparo-1 | 1,05 | 1,17 | 32,41 | 29,14 | 0,899 | 59,6% [57,4%; 61,7%], n=2000 | -3,3 pp | 0,0% |
| regra atual | 8 | 5 | recuperacao-1 | 1,06 | 1,18 | 32,15 | 28,86 | 0,898 | 58,0% [55,8%; 60,1%], n=2000 | -2,4 pp | 0,0% |
| regra atual | 8 | 5 | habilidade+1 | 0,88 | 0,99 | 38,54 | 34,37 | 0,892 | 26,6% [24,7%; 28,5%], n=2000 | 0,1 pp | 0,0% |
| regra atual | 8 | 5 | atributo+1 | 0,94 | 1,18 | 36,10 | 28,81 | 0,798 | 14,8% [13,3%; 16,4%], n=2000 | -3,3 pp | 0,0% |
| regra atual | 12 | 1 | ataque+1 | 3,53 | 3,04 | 9,64 | 11,17 | 1,158 | 62,0% [59,8%; 64,1%], n=2000 | 4,9 pp | 0,0% |
| regra atual | 12 | 1 | defesa+1 | 3,24 | 2,67 | 10,50 | 12,71 | 1,210 | 64,2% [62,1%; 66,3%], n=2000 | 3,0 pp | 0,0% |
| regra atual | 12 | 1 | dano+1 | 3,73 | 3,04 | 9,12 | 11,17 | 1,225 | 65,6% [63,5%; 67,7%], n=2000 | 4,2 pp | 0,0% |
| regra atual | 12 | 1 | dano+1d6 | 5,18 | 2,86 | 6,56 | 11,89 | 1,811 | 85,1% [83,5%; 86,6%], n=2000 | 1,4 pp | 0,0% |
| regra atual | 12 | 1 | absorcao+1 | 3,24 | 2,57 | 10,50 | 13,23 | 1,260 | 69,2% [67,1%; 71,1%], n=2000 | 0,5 pp | 0,0% |
| regra atual | 12 | 1 | pv+1 | 3,15 | 3,13 | 10,79 | 11,18 | 1,036 | 53,3% [51,2%; 55,5%], n=2000 | 3,7 pp | 0,0% |
| regra atual | 12 | 1 | pv+5 | 3,21 | 3,05 | 10,60 | 12,80 | 1,207 | 64,6% [62,5%; 66,7%], n=2000 | 1,3 pp | 0,0% |
| regra atual | 12 | 1 | preparo-1 | 3,37 | 2,95 | 10,10 | 11,54 | 1,142 | 73,0% [71,0%; 74,9%], n=2000 | 0,5 pp | 0,0% |
| regra atual | 12 | 1 | recuperacao-1 | 3,35 | 2,98 | 10,14 | 11,42 | 1,126 | 71,8% [69,7%; 73,7%], n=2000 | -1,3 pp | 0,0% |
| regra atual | 12 | 1 | habilidade+1 | 3,84 | 2,95 | 8,85 | 11,52 | 1,302 | 71,3% [69,2%; 73,2%], n=2000 | 5,3 pp | 0,0% |
| regra atual | 12 | 1 | atributo+1 | 3,95 | 2,03 | 8,62 | 16,76 | 1,945 | 89,8% [88,4%; 91,1%], n=2000 | 2,7 pp | 0,0% |
| regra atual | 12 | 3 | ataque+1 | 2,36 | 2,16 | 14,41 | 15,74 | 1,092 | 56,9% [54,7%; 59,0%], n=2000 | -0,9 pp | 0,0% |
| regra atual | 12 | 3 | defesa+1 | 2,22 | 1,96 | 15,31 | 17,38 | 1,135 | 60,0% [57,8%; 62,1%], n=2000 | -1,1 pp | 0,0% |
| regra atual | 12 | 3 | dano+1 | 2,77 | 2,11 | 12,28 | 16,11 | 1,312 | 73,2% [71,2%; 75,1%], n=2000 | -2,2 pp | 0,0% |
| regra atual | 12 | 3 | dano+1d6 | 4,26 | 1,98 | 7,97 | 17,18 | 2,155 | 92,8% [91,6%; 93,9%], n=2000 | 0,9 pp | 0,0% |
| regra atual | 12 | 3 | absorcao+1 | 2,24 | 1,74 | 15,16 | 19,55 | 1,289 | 72,6% [70,6%; 74,5%], n=2000 | -0,6 pp | 0,0% |
| regra atual | 12 | 3 | pv+1 | 2,19 | 2,18 | 15,50 | 16,05 | 1,035 | 52,9% [50,7%; 55,1%], n=2000 | 0,8 pp | 0,0% |
| regra atual | 12 | 3 | pv+5 | 2,22 | 2,14 | 15,31 | 18,19 | 1,188 | 65,3% [63,2%; 67,4%], n=2000 | -1,6 pp | 0,0% |
| regra atual | 12 | 3 | preparo-1 | 2,28 | 2,10 | 14,94 | 16,21 | 1,085 | 71,5% [69,5%; 73,4%], n=2000 | 5,0 pp | 0,0% |
| regra atual | 12 | 3 | recuperacao-1 | 2,27 | 2,11 | 14,99 | 16,10 | 1,074 | 70,2% [68,1%; 72,1%], n=2000 | -0,1 pp | 0,0% |
| regra atual | 12 | 3 | habilidade+1 | 2,46 | 2,14 | 13,80 | 15,91 | 1,153 | 61,7% [59,5%; 63,8%], n=2000 | 1,0 pp | 0,0% |
| regra atual | 12 | 3 | atributo+1 | 2,48 | 1,61 | 13,73 | 21,15 | 1,540 | 80,2% [78,3%; 81,8%], n=2000 | 1,7 pp | 0,0% |
| regra atual | 12 | 5 | ataque+1 | 1,47 | 1,45 | 23,13 | 23,51 | 1,017 | 50,0% [47,8%; 52,1%], n=2000 | 3,5 pp | 0,0% |
| regra atual | 12 | 5 | defesa+1 | 1,46 | 1,39 | 23,29 | 24,48 | 1,051 | 54,6% [52,5%; 56,8%], n=2000 | -3,3 pp | 0,0% |
| regra atual | 12 | 5 | dano+1 | 1,80 | 1,44 | 18,84 | 23,58 | 1,252 | 71,8% [69,8%; 73,7%], n=2000 | 0,0 pp | 0,0% |
| regra atual | 12 | 5 | dano+1d6 | 3,23 | 1,38 | 10,54 | 24,55 | 2,330 | 97,0% [96,1%; 97,6%], n=2000 | -0,1 pp | 0,0% |
| regra atual | 12 | 5 | absorcao+1 | 1,45 | 1,21 | 23,41 | 28,19 | 1,204 | 69,3% [67,2%; 71,3%], n=2000 | -0,2 pp | 0,0% |
| regra atual | 12 | 5 | pv+1 | 1,46 | 1,46 | 23,29 | 24,01 | 1,031 | 52,9% [50,8%; 55,1%], n=2000 | -0,7 pp | 0,0% |
| regra atual | 12 | 5 | pv+5 | 1,46 | 1,44 | 23,29 | 27,17 | 1,167 | 67,3% [65,3%; 69,4%], n=2000 | 0,9 pp | 0,0% |
| regra atual | 12 | 5 | preparo-1 | 1,46 | 1,45 | 23,31 | 23,51 | 1,008 | 68,2% [66,1%; 70,2%], n=2000 | 0,6 pp | 0,0% |
| regra atual | 12 | 5 | recuperacao-1 | 1,46 | 1,44 | 23,27 | 23,68 | 1,018 | 66,9% [64,8%; 68,9%], n=2000 | -1,8 pp | 0,0% |
| regra atual | 12 | 5 | habilidade+1 | 1,45 | 1,46 | 23,49 | 23,27 | 0,991 | 46,8% [44,6%; 49,0%], n=2000 | 2,0 pp | 0,0% |
| regra atual | 12 | 5 | atributo+1 | 1,42 | 1,27 | 23,90 | 26,85 | 1,124 | 57,4% [55,2%; 59,5%], n=2000 | 0,1 pp | 0,0% |
| V1 | 6 | 1 | ataque+1 | 3,83 | 3,58 | 8,89 | 9,50 | 1,069 | 59,3% [57,1%; 61,4%], n=2000 | 20,4 pp | 0,0% |
| V1 | 6 | 1 | defesa+1 | 3,67 | 3,21 | 9,27 | 10,59 | 1,142 | 64,1% [62,0%; 66,2%], n=2000 | 16,0 pp | 0,0% |
| V1 | 6 | 1 | dano+1 | 3,72 | 3,61 | 9,13 | 9,41 | 1,030 | 55,3% [53,1%; 57,4%], n=2000 | 15,1 pp | 0,0% |
| V1 | 6 | 1 | dano+1d6 | 4,77 | 3,40 | 7,13 | 10,00 | 1,402 | 86,2% [84,6%; 87,6%], n=2000 | 1,1 pp | 0,0% |
| V1 | 6 | 1 | absorcao+1 | 3,61 | 3,61 | 9,41 | 9,41 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp | 0,0% |
| V1 | 6 | 1 | pv+1 | 3,63 | 3,55 | 9,36 | 9,87 | 1,055 | 53,1% [50,9%; 55,3%], n=2000 | 17,2 pp | 0,0% |
| V1 | 6 | 1 | pv+5 | 3,68 | 3,53 | 9,25 | 11,05 | 1,195 | 79,5% [77,6%; 81,2%], n=2000 | 2,1 pp | 0,0% |
| V1 | 6 | 1 | preparo-1 | 3,78 | 3,41 | 9,01 | 9,97 | 1,107 | 92,6% [91,4%; 93,7%], n=2000 | 0,4 pp | 0,0% |
| V1 | 6 | 1 | recuperacao-1 | 3,77 | 3,46 | 9,02 | 9,82 | 1,089 | 92,0% [90,7%; 93,1%], n=2000 | 0,4 pp | 0,0% |
| V1 | 6 | 1 | habilidade+1 | 3,95 | 3,55 | 8,62 | 9,59 | 1,113 | 66,0% [63,9%; 68,1%], n=2000 | 19,9 pp | 0,0% |
| V1 | 6 | 1 | atributo+1 | 3,96 | 2,52 | 8,59 | 13,49 | 1,571 | 88,5% [87,1%; 89,9%], n=2000 | 13,7 pp | 0,0% |
| V1 | 6 | 3 | ataque+1 | 3,83 | 3,58 | 8,89 | 9,50 | 1,069 | 59,3% [57,1%; 61,4%], n=2000 | 20,4 pp | 0,0% |
| V1 | 6 | 3 | defesa+1 | 3,67 | 3,21 | 9,27 | 10,59 | 1,142 | 64,1% [62,0%; 66,2%], n=2000 | 16,0 pp | 0,0% |
| V1 | 6 | 3 | dano+1 | 3,61 | 3,61 | 9,41 | 9,41 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp | 0,0% |
| V1 | 6 | 3 | dano+1d6 | 3,98 | 3,54 | 8,54 | 9,61 | 1,125 | 69,0% [67,0%; 71,0%], n=2000 | 3,3 pp | 0,0% |
| V1 | 6 | 3 | absorcao+1 | 3,61 | 3,61 | 9,41 | 9,41 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp | 0,0% |
| V1 | 6 | 3 | pv+1 | 3,63 | 3,55 | 9,36 | 9,87 | 1,055 | 53,1% [50,9%; 55,3%], n=2000 | 17,2 pp | 0,0% |
| V1 | 6 | 3 | pv+5 | 3,68 | 3,53 | 9,25 | 11,05 | 1,195 | 79,5% [77,6%; 81,2%], n=2000 | 2,1 pp | 0,0% |
| V1 | 6 | 3 | preparo-1 | 3,78 | 3,41 | 9,01 | 9,97 | 1,107 | 92,6% [91,4%; 93,7%], n=2000 | 0,4 pp | 0,0% |
| V1 | 6 | 3 | recuperacao-1 | 3,77 | 3,46 | 9,02 | 9,82 | 1,089 | 92,0% [90,7%; 93,1%], n=2000 | 0,4 pp | 0,0% |
| V1 | 6 | 3 | habilidade+1 | 3,95 | 3,55 | 8,62 | 9,59 | 1,113 | 66,0% [63,9%; 68,1%], n=2000 | 19,9 pp | 0,0% |
| V1 | 6 | 3 | atributo+1 | 3,96 | 2,52 | 8,59 | 13,49 | 1,571 | 88,5% [87,1%; 89,9%], n=2000 | 13,7 pp | 0,0% |
| V1 | 6 | 5 | ataque+1 | 3,83 | 3,58 | 8,89 | 9,50 | 1,069 | 59,3% [57,1%; 61,4%], n=2000 | 20,4 pp | 0,0% |
| V1 | 6 | 5 | defesa+1 | 3,67 | 3,21 | 9,27 | 10,59 | 1,142 | 64,1% [62,0%; 66,2%], n=2000 | 16,0 pp | 0,0% |
| V1 | 6 | 5 | dano+1 | 3,61 | 3,61 | 9,41 | 9,41 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp | 0,0% |
| V1 | 6 | 5 | dano+1d6 | 3,66 | 3,60 | 9,30 | 9,44 | 1,015 | 53,6% [51,5%; 55,8%], n=2000 | 12,3 pp | 0,0% |
| V1 | 6 | 5 | absorcao+1 | 3,61 | 3,61 | 9,41 | 9,41 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp | 0,0% |
| V1 | 6 | 5 | pv+1 | 3,63 | 3,55 | 9,36 | 9,87 | 1,055 | 53,1% [50,9%; 55,3%], n=2000 | 17,2 pp | 0,0% |
| V1 | 6 | 5 | pv+5 | 3,68 | 3,53 | 9,25 | 11,05 | 1,195 | 79,5% [77,6%; 81,2%], n=2000 | 2,1 pp | 0,0% |
| V1 | 6 | 5 | preparo-1 | 3,78 | 3,41 | 9,01 | 9,97 | 1,107 | 92,6% [91,4%; 93,7%], n=2000 | 0,4 pp | 0,0% |
| V1 | 6 | 5 | recuperacao-1 | 3,77 | 3,46 | 9,02 | 9,82 | 1,089 | 92,0% [90,7%; 93,1%], n=2000 | 0,4 pp | 0,0% |
| V1 | 6 | 5 | habilidade+1 | 3,95 | 3,55 | 8,62 | 9,59 | 1,113 | 66,0% [63,9%; 68,1%], n=2000 | 19,9 pp | 0,0% |
| V1 | 6 | 5 | atributo+1 | 3,96 | 2,52 | 8,59 | 13,49 | 1,571 | 88,5% [87,1%; 89,9%], n=2000 | 13,7 pp | 0,0% |
| V1 | 8 | 1 | ataque+1 | 3,76 | 3,38 | 9,05 | 10,07 | 1,113 | 63,2% [61,1%; 65,3%], n=2000 | 10,1 pp | 0,0% |
| V1 | 8 | 1 | defesa+1 | 3,54 | 3,01 | 9,61 | 11,28 | 1,173 | 64,8% [62,7%; 66,9%], n=2000 | 6,3 pp | 0,0% |
| V1 | 8 | 1 | dano+1 | 3,69 | 3,41 | 9,22 | 9,98 | 1,082 | 61,9% [59,8%; 64,0%], n=2000 | 4,8 pp | 0,0% |
| V1 | 8 | 1 | dano+1d6 | 4,99 | 3,19 | 6,81 | 10,66 | 1,565 | 87,5% [85,9%; 88,8%], n=2000 | 2,1 pp | 0,0% |
| V1 | 8 | 1 | absorcao+1 | 3,44 | 3,35 | 9,87 | 10,15 | 1,028 | 53,7% [51,5%; 55,9%], n=2000 | 6,0 pp | 0,0% |
| V1 | 8 | 1 | pv+1 | 3,46 | 3,43 | 9,82 | 10,22 | 1,040 | 54,3% [52,1%; 56,5%], n=2000 | 4,2 pp | 0,0% |
| V1 | 8 | 1 | pv+5 | 3,53 | 3,37 | 9,64 | 11,56 | 1,199 | 73,9% [71,9%; 75,7%], n=2000 | 2,5 pp | 0,0% |
| V1 | 8 | 1 | preparo-1 | 3,66 | 3,27 | 9,29 | 10,40 | 1,119 | 85,0% [83,3%; 86,4%], n=2000 | 0,3 pp | 0,0% |
| V1 | 8 | 1 | recuperacao-1 | 3,64 | 3,30 | 9,34 | 10,30 | 1,103 | 82,8% [81,1%; 84,4%], n=2000 | 0,4 pp | 0,0% |
| V1 | 8 | 1 | habilidade+1 | 3,97 | 3,32 | 8,57 | 10,24 | 1,196 | 74,3% [72,3%; 76,1%], n=2000 | 9,9 pp | 0,0% |
| V1 | 8 | 1 | atributo+1 | 4,02 | 2,30 | 8,46 | 14,78 | 1,746 | 93,7% [92,5%; 94,6%], n=2000 | 3,5 pp | 0,0% |
| V1 | 8 | 3 | ataque+1 | 3,64 | 3,27 | 9,34 | 10,40 | 1,114 | 63,3% [61,2%; 65,4%], n=2000 | 9,7 pp | 0,0% |
| V1 | 8 | 3 | defesa+1 | 3,43 | 2,93 | 9,91 | 11,60 | 1,170 | 64,5% [62,3%; 66,5%], n=2000 | 5,7 pp | 0,0% |
| V1 | 8 | 3 | dano+1 | 3,34 | 3,34 | 10,17 | 10,17 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp | 0,0% |
| V1 | 8 | 3 | dano+1d6 | 4,01 | 3,24 | 8,48 | 10,48 | 1,236 | 72,4% [70,3%; 74,3%], n=2000 | 4,3 pp | 0,0% |
| V1 | 8 | 3 | absorcao+1 | 3,34 | 3,34 | 10,17 | 10,17 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp | 0,0% |
| V1 | 8 | 3 | pv+1 | 3,39 | 3,28 | 10,04 | 10,68 | 1,064 | 53,6% [51,4%; 55,8%], n=2000 | 6,4 pp | 0,0% |
| V1 | 8 | 3 | pv+5 | 3,43 | 3,26 | 9,93 | 11,95 | 1,204 | 73,0% [71,0%; 74,9%], n=2000 | 1,7 pp | 0,0% |
| V1 | 8 | 3 | preparo-1 | 3,55 | 3,16 | 9,57 | 10,77 | 1,126 | 84,7% [83,1%; 86,2%], n=2000 | 0,0 pp | 0,0% |
| V1 | 8 | 3 | recuperacao-1 | 3,54 | 3,19 | 9,60 | 10,65 | 1,109 | 83,7% [82,0%; 85,2%], n=2000 | 0,5 pp | 0,0% |
| V1 | 8 | 3 | habilidade+1 | 3,84 | 3,21 | 8,86 | 10,59 | 1,195 | 73,4% [71,4%; 75,3%], n=2000 | 11,2 pp | 0,0% |
| V1 | 8 | 3 | atributo+1 | 3,88 | 2,23 | 8,77 | 15,28 | 1,743 | 92,5% [91,3%; 93,6%], n=2000 | 4,1 pp | 0,0% |
| V1 | 8 | 5 | ataque+1 | 3,64 | 3,27 | 9,34 | 10,40 | 1,114 | 63,3% [61,2%; 65,4%], n=2000 | 9,7 pp | 0,0% |
| V1 | 8 | 5 | defesa+1 | 3,43 | 2,93 | 9,91 | 11,60 | 1,170 | 64,5% [62,3%; 66,5%], n=2000 | 5,7 pp | 0,0% |
| V1 | 8 | 5 | dano+1 | 3,34 | 3,34 | 10,17 | 10,17 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp | 0,0% |
| V1 | 8 | 5 | dano+1d6 | 3,53 | 3,32 | 9,62 | 10,23 | 1,064 | 59,4% [57,2%; 61,5%], n=2000 | 9,1 pp | 0,0% |
| V1 | 8 | 5 | absorcao+1 | 3,34 | 3,34 | 10,17 | 10,17 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp | 0,0% |
| V1 | 8 | 5 | pv+1 | 3,39 | 3,28 | 10,04 | 10,68 | 1,064 | 53,6% [51,4%; 55,8%], n=2000 | 6,4 pp | 0,0% |
| V1 | 8 | 5 | pv+5 | 3,43 | 3,26 | 9,93 | 11,95 | 1,204 | 73,0% [71,0%; 74,9%], n=2000 | 1,7 pp | 0,0% |
| V1 | 8 | 5 | preparo-1 | 3,55 | 3,16 | 9,57 | 10,77 | 1,126 | 84,7% [83,1%; 86,2%], n=2000 | 0,0 pp | 0,0% |
| V1 | 8 | 5 | recuperacao-1 | 3,54 | 3,19 | 9,60 | 10,65 | 1,109 | 83,7% [82,0%; 85,2%], n=2000 | 0,5 pp | 0,0% |
| V1 | 8 | 5 | habilidade+1 | 3,84 | 3,21 | 8,86 | 10,59 | 1,195 | 73,4% [71,4%; 75,3%], n=2000 | 11,2 pp | 0,0% |
| V1 | 8 | 5 | atributo+1 | 3,88 | 2,23 | 8,77 | 15,28 | 1,743 | 92,5% [91,3%; 93,6%], n=2000 | 4,1 pp | 0,0% |
| V1 | 12 | 1 | ataque+1 | 3,82 | 3,24 | 8,89 | 10,49 | 1,180 | 63,5% [61,4%; 65,6%], n=2000 | 6,6 pp | 0,0% |
| V1 | 12 | 1 | defesa+1 | 3,48 | 2,85 | 9,76 | 11,95 | 1,223 | 64,6% [62,5%; 66,7%], n=2000 | 3,7 pp | 0,0% |
| V1 | 12 | 1 | dano+1 | 3,76 | 3,28 | 9,05 | 10,38 | 1,146 | 60,7% [58,5%; 62,8%], n=2000 | 6,4 pp | 0,0% |
| V1 | 12 | 1 | dano+1d6 | 5,12 | 3,12 | 6,64 | 10,90 | 1,642 | 80,5% [78,7%; 82,1%], n=2000 | 2,1 pp | 0,0% |
| V1 | 12 | 1 | absorcao+1 | 3,41 | 3,07 | 9,97 | 11,07 | 1,110 | 58,6% [56,4%; 60,7%], n=2000 | 4,3 pp | 0,0% |
| V1 | 12 | 1 | pv+1 | 3,37 | 3,35 | 10,08 | 10,45 | 1,037 | 53,4% [51,2%; 55,6%], n=2000 | 5,8 pp | 0,0% |
| V1 | 12 | 1 | pv+5 | 3,45 | 3,27 | 9,86 | 11,92 | 1,209 | 66,0% [63,9%; 68,1%], n=2000 | 4,5 pp | 0,0% |
| V1 | 12 | 1 | preparo-1 | 3,62 | 3,14 | 9,39 | 10,81 | 1,152 | 74,6% [72,6%; 76,4%], n=2000 | 1,5 pp | 0,0% |
| V1 | 12 | 1 | recuperacao-1 | 3,60 | 3,19 | 9,43 | 10,67 | 1,131 | 73,1% [71,1%; 75,0%], n=2000 | 0,0 pp | 0,0% |
| V1 | 12 | 1 | habilidade+1 | 4,18 | 3,15 | 8,14 | 10,80 | 1,326 | 73,9% [71,9%; 75,7%], n=2000 | 6,5 pp | 0,0% |
| V1 | 12 | 1 | atributo+1 | 4,30 | 2,12 | 7,90 | 16,07 | 2,035 | 91,3% [90,0%; 92,5%], n=2000 | 2,1 pp | 0,0% |
| V1 | 12 | 3 | ataque+1 | 3,34 | 2,89 | 10,18 | 11,78 | 1,156 | 63,5% [61,4%; 65,6%], n=2000 | 4,0 pp | 0,0% |
| V1 | 12 | 3 | defesa+1 | 3,07 | 2,55 | 11,06 | 13,33 | 1,206 | 64,5% [62,3%; 66,5%], n=2000 | 2,9 pp | 0,0% |
| V1 | 12 | 3 | dano+1 | 3,18 | 2,92 | 10,70 | 11,64 | 1,089 | 59,1% [56,9%; 61,2%], n=2000 | 3,9 pp | 0,0% |
| V1 | 12 | 3 | dano+1d6 | 4,24 | 2,76 | 8,02 | 12,31 | 1,534 | 80,5% [78,7%; 82,2%], n=2000 | 2,6 pp | 0,0% |
| V1 | 12 | 3 | absorcao+1 | 2,96 | 2,90 | 11,48 | 11,72 | 1,021 | 51,7% [49,5%; 53,9%], n=2000 | 4,4 pp | 0,0% |
| V1 | 12 | 3 | pv+1 | 3,00 | 2,95 | 11,33 | 11,86 | 1,047 | 53,8% [51,6%; 56,0%], n=2000 | 5,2 pp | 0,0% |
| V1 | 12 | 3 | pv+5 | 3,05 | 2,92 | 11,14 | 13,34 | 1,197 | 67,0% [64,9%; 69,0%], n=2000 | 1,7 pp | 0,0% |
| V1 | 12 | 3 | preparo-1 | 3,22 | 2,79 | 10,56 | 12,20 | 1,155 | 77,5% [75,6%; 79,3%], n=2000 | 1,4 pp | 0,0% |
| V1 | 12 | 3 | recuperacao-1 | 3,17 | 2,83 | 10,72 | 12,01 | 1,120 | 74,0% [72,0%; 75,9%], n=2000 | 0,0 pp | 0,0% |
| V1 | 12 | 3 | habilidade+1 | 3,62 | 2,80 | 9,39 | 12,13 | 1,291 | 74,9% [72,9%; 76,7%], n=2000 | 4,9 pp | 0,0% |
| V1 | 12 | 3 | atributo+1 | 3,73 | 1,90 | 9,13 | 17,88 | 1,959 | 93,0% [91,9%; 94,1%], n=2000 | 1,1 pp | 0,0% |
| V1 | 12 | 5 | ataque+1 | 3,24 | 2,80 | 10,49 | 12,14 | 1,157 | 62,8% [60,7%; 64,9%], n=2000 | 4,6 pp | 0,0% |
| V1 | 12 | 5 | defesa+1 | 2,99 | 2,47 | 11,35 | 13,75 | 1,211 | 64,8% [62,7%; 66,9%], n=2000 | 1,8 pp | 0,0% |
| V1 | 12 | 5 | dano+1 | 2,89 | 2,89 | 11,76 | 11,76 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp | 0,0% |
| V1 | 12 | 5 | dano+1d6 | 3,44 | 2,80 | 9,88 | 12,14 | 1,229 | 67,1% [65,0%; 69,1%], n=2000 | 3,0 pp | 0,0% |
| V1 | 12 | 5 | absorcao+1 | 2,89 | 2,89 | 11,76 | 11,76 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp | 0,0% |
| V1 | 12 | 5 | pv+1 | 2,96 | 2,83 | 11,50 | 12,36 | 1,075 | 53,7% [51,5%; 55,9%], n=2000 | 4,6 pp | 0,0% |
| V1 | 12 | 5 | pv+5 | 2,98 | 2,83 | 11,42 | 13,79 | 1,207 | 66,0% [63,9%; 68,1%], n=2000 | 1,5 pp | 0,0% |
| V1 | 12 | 5 | preparo-1 | 3,13 | 2,71 | 10,85 | 12,57 | 1,158 | 77,3% [75,5%; 79,1%], n=2000 | 1,7 pp | 0,0% |
| V1 | 12 | 5 | recuperacao-1 | 3,09 | 2,74 | 11,02 | 12,40 | 1,125 | 74,4% [72,4%; 76,2%], n=2000 | 0,1 pp | 0,0% |
| V1 | 12 | 5 | habilidade+1 | 3,51 | 2,72 | 9,68 | 12,52 | 1,294 | 73,9% [71,9%; 75,8%], n=2000 | 4,8 pp | 0,0% |
| V1 | 12 | 5 | atributo+1 | 3,61 | 1,83 | 9,42 | 18,61 | 1,976 | 92,7% [91,4%; 93,7%], n=2000 | 1,5 pp | 0,0% |
| V2 | 6 | 1 | ataque+1 | 2,66 | 2,63 | 12,78 | 12,92 | 1,011 | 49,7% [47,5%; 51,9%], n=2000 | -1,6 pp | 0,0% |
| V2 | 6 | 1 | defesa+1 | 2,63 | 2,49 | 12,95 | 13,65 | 1,054 | 54,8% [52,6%; 57,0%], n=2000 | -0,8 pp | 0,0% |
| V2 | 6 | 1 | dano+1 | 3,36 | 2,58 | 10,13 | 13,16 | 1,299 | 80,1% [78,3%; 81,8%], n=2000 | -0,4 pp | 0,0% |
| V2 | 6 | 1 | dano+1d6 | 5,31 | 2,46 | 6,40 | 13,84 | 2,162 | 98,7% [98,1%; 99,1%], n=2000 | 0,0 pp | 0,0% |
| V2 | 6 | 1 | absorcao+1 | 2,63 | 2,11 | 12,92 | 16,13 | 1,249 | 78,0% [76,1%; 79,7%], n=2000 | -3,7 pp | 0,0% |
| V2 | 6 | 1 | pv+1 | 2,62 | 2,63 | 12,95 | 13,31 | 1,027 | 54,6% [52,5%; 56,8%], n=2000 | -0,1 pp | 0,0% |
| V2 | 6 | 1 | pv+5 | 2,62 | 2,61 | 12,97 | 14,96 | 1,153 | 71,2% [69,1%; 73,1%], n=2000 | -0,7 pp | 0,0% |
| V2 | 6 | 1 | preparo-1 | 2,65 | 2,61 | 12,85 | 13,05 | 1,016 | 71,3% [69,2%; 73,2%], n=2000 | 5,1 pp | 0,0% |
| V2 | 6 | 1 | recuperacao-1 | 2,65 | 2,61 | 12,83 | 13,04 | 1,016 | 70,6% [68,6%; 72,6%], n=2000 | 5,6 pp | 0,0% |
| V2 | 6 | 1 | habilidade+1 | 2,66 | 2,62 | 12,77 | 12,95 | 1,014 | 49,5% [47,3%; 51,6%], n=2000 | -0,3 pp | 0,0% |
| V2 | 6 | 1 | atributo+1 | 2,64 | 2,23 | 12,87 | 15,28 | 1,188 | 61,9% [59,8%; 64,0%], n=2000 | 5,8 pp | 0,0% |
| V2 | 6 | 3 | ataque+1 | 2,66 | 2,63 | 12,78 | 12,92 | 1,011 | 49,7% [47,5%; 51,9%], n=2000 | -1,6 pp | 0,0% |
| V2 | 6 | 3 | defesa+1 | 2,63 | 2,49 | 12,95 | 13,65 | 1,054 | 54,8% [52,6%; 57,0%], n=2000 | -0,8 pp | 0,0% |
| V2 | 6 | 3 | dano+1 | 3,36 | 2,58 | 10,13 | 13,16 | 1,299 | 80,1% [78,3%; 81,8%], n=2000 | -0,4 pp | 0,0% |
| V2 | 6 | 3 | dano+1d6 | 5,31 | 2,46 | 6,40 | 13,84 | 2,162 | 98,7% [98,1%; 99,1%], n=2000 | 0,0 pp | 0,0% |
| V2 | 6 | 3 | absorcao+1 | 2,63 | 2,11 | 12,92 | 16,13 | 1,249 | 78,0% [76,1%; 79,7%], n=2000 | -3,7 pp | 0,0% |
| V2 | 6 | 3 | pv+1 | 2,62 | 2,63 | 12,95 | 13,31 | 1,027 | 54,6% [52,5%; 56,8%], n=2000 | -0,1 pp | 0,0% |
| V2 | 6 | 3 | pv+5 | 2,62 | 2,61 | 12,97 | 14,96 | 1,153 | 71,2% [69,1%; 73,1%], n=2000 | -0,7 pp | 0,0% |
| V2 | 6 | 3 | preparo-1 | 2,65 | 2,61 | 12,85 | 13,05 | 1,016 | 71,3% [69,2%; 73,2%], n=2000 | 5,1 pp | 0,0% |
| V2 | 6 | 3 | recuperacao-1 | 2,65 | 2,61 | 12,83 | 13,04 | 1,016 | 70,6% [68,6%; 72,6%], n=2000 | 5,6 pp | 0,0% |
| V2 | 6 | 3 | habilidade+1 | 2,66 | 2,62 | 12,77 | 12,95 | 1,014 | 49,5% [47,3%; 51,6%], n=2000 | -0,3 pp | 0,0% |
| V2 | 6 | 3 | atributo+1 | 2,64 | 2,23 | 12,87 | 15,28 | 1,188 | 61,9% [59,8%; 64,0%], n=2000 | 5,8 pp | 0,0% |
| V2 | 6 | 5 | ataque+1 | 2,66 | 2,63 | 12,78 | 12,92 | 1,011 | 49,7% [47,5%; 51,9%], n=2000 | -1,6 pp | 0,0% |
| V2 | 6 | 5 | defesa+1 | 2,63 | 2,49 | 12,95 | 13,65 | 1,054 | 54,8% [52,6%; 57,0%], n=2000 | -0,8 pp | 0,0% |
| V2 | 6 | 5 | dano+1 | 3,36 | 2,58 | 10,13 | 13,16 | 1,299 | 80,1% [78,3%; 81,8%], n=2000 | -0,4 pp | 0,0% |
| V2 | 6 | 5 | dano+1d6 | 5,31 | 2,46 | 6,40 | 13,84 | 2,162 | 98,7% [98,1%; 99,1%], n=2000 | 0,0 pp | 0,0% |
| V2 | 6 | 5 | absorcao+1 | 2,63 | 2,11 | 12,92 | 16,13 | 1,249 | 78,0% [76,1%; 79,7%], n=2000 | -3,7 pp | 0,0% |
| V2 | 6 | 5 | pv+1 | 2,62 | 2,63 | 12,95 | 13,31 | 1,027 | 54,6% [52,5%; 56,8%], n=2000 | -0,1 pp | 0,0% |
| V2 | 6 | 5 | pv+5 | 2,62 | 2,61 | 12,97 | 14,96 | 1,153 | 71,2% [69,1%; 73,1%], n=2000 | -0,7 pp | 0,0% |
| V2 | 6 | 5 | preparo-1 | 2,65 | 2,61 | 12,85 | 13,05 | 1,016 | 71,3% [69,2%; 73,2%], n=2000 | 5,1 pp | 0,0% |
| V2 | 6 | 5 | recuperacao-1 | 2,65 | 2,61 | 12,83 | 13,04 | 1,016 | 70,6% [68,6%; 72,6%], n=2000 | 5,6 pp | 0,0% |
| V2 | 6 | 5 | habilidade+1 | 2,66 | 2,62 | 12,77 | 12,95 | 1,014 | 49,5% [47,3%; 51,6%], n=2000 | -0,3 pp | 0,0% |
| V2 | 6 | 5 | atributo+1 | 2,64 | 2,23 | 12,87 | 15,28 | 1,188 | 61,9% [59,8%; 64,0%], n=2000 | 5,8 pp | 0,0% |
| V2 | 8 | 1 | ataque+1 | 3,27 | 3,02 | 10,41 | 11,26 | 1,082 | 57,4% [55,2%; 59,5%], n=2000 | 1,9 pp | 0,0% |
| V2 | 8 | 1 | defesa+1 | 3,10 | 2,75 | 10,97 | 12,35 | 1,126 | 59,2% [57,0%; 61,3%], n=2000 | -0,3 pp | 0,0% |
| V2 | 8 | 1 | dano+1 | 3,75 | 2,96 | 9,06 | 11,49 | 1,268 | 74,4% [72,4%; 76,2%], n=2000 | -0,3 pp | 0,0% |
| V2 | 8 | 1 | dano+1d6 | 5,56 | 2,77 | 6,11 | 12,26 | 2,006 | 93,8% [92,7%; 94,8%], n=2000 | -0,1 pp | 0,0% |
| V2 | 8 | 1 | absorcao+1 | 3,15 | 2,41 | 10,80 | 14,08 | 1,304 | 78,1% [76,2%; 79,9%], n=2000 | 1,4 pp | 0,0% |
| V2 | 8 | 1 | pv+1 | 3,06 | 3,04 | 11,13 | 11,52 | 1,035 | 53,4% [51,2%; 55,6%], n=2000 | 0,2 pp | 0,0% |
| V2 | 8 | 1 | pv+5 | 3,13 | 2,98 | 10,88 | 13,10 | 1,204 | 70,8% [68,8%; 72,8%], n=2000 | 0,6 pp | 0,0% |
| V2 | 8 | 1 | preparo-1 | 3,18 | 2,94 | 10,68 | 11,58 | 1,084 | 75,3% [73,4%; 77,1%], n=2000 | 1,6 pp | 0,0% |
| V2 | 8 | 1 | recuperacao-1 | 3,17 | 2,97 | 10,71 | 11,45 | 1,069 | 74,3% [72,3%; 76,1%], n=2000 | 0,3 pp | 0,0% |
| V2 | 8 | 1 | habilidade+1 | 3,39 | 2,99 | 10,02 | 11,38 | 1,136 | 63,2% [61,1%; 65,3%], n=2000 | 1,9 pp | 0,0% |
| V2 | 8 | 1 | atributo+1 | 3,45 | 2,23 | 9,86 | 15,28 | 1,550 | 83,0% [81,2%; 84,5%], n=2000 | 3,3 pp | 0,0% |
| V2 | 8 | 3 | ataque+1 | 3,27 | 3,02 | 10,41 | 11,26 | 1,082 | 57,4% [55,2%; 59,5%], n=2000 | 1,9 pp | 0,0% |
| V2 | 8 | 3 | defesa+1 | 3,10 | 2,75 | 10,97 | 12,35 | 1,126 | 59,2% [57,0%; 61,3%], n=2000 | -0,3 pp | 0,0% |
| V2 | 8 | 3 | dano+1 | 3,75 | 2,96 | 9,06 | 11,49 | 1,268 | 74,4% [72,4%; 76,2%], n=2000 | -0,3 pp | 0,0% |
| V2 | 8 | 3 | dano+1d6 | 5,56 | 2,77 | 6,11 | 12,26 | 2,006 | 93,8% [92,7%; 94,8%], n=2000 | -0,1 pp | 0,0% |
| V2 | 8 | 3 | absorcao+1 | 3,15 | 2,41 | 10,80 | 14,08 | 1,304 | 78,1% [76,2%; 79,9%], n=2000 | 1,4 pp | 0,0% |
| V2 | 8 | 3 | pv+1 | 3,06 | 3,04 | 11,13 | 11,52 | 1,035 | 53,4% [51,2%; 55,6%], n=2000 | 0,2 pp | 0,0% |
| V2 | 8 | 3 | pv+5 | 3,13 | 2,98 | 10,88 | 13,10 | 1,204 | 70,8% [68,8%; 72,8%], n=2000 | 0,6 pp | 0,0% |
| V2 | 8 | 3 | preparo-1 | 3,18 | 2,94 | 10,68 | 11,58 | 1,084 | 75,3% [73,4%; 77,1%], n=2000 | 1,6 pp | 0,0% |
| V2 | 8 | 3 | recuperacao-1 | 3,17 | 2,97 | 10,71 | 11,45 | 1,069 | 74,3% [72,3%; 76,1%], n=2000 | 0,3 pp | 0,0% |
| V2 | 8 | 3 | habilidade+1 | 3,39 | 2,99 | 10,02 | 11,38 | 1,136 | 63,2% [61,1%; 65,3%], n=2000 | 1,9 pp | 0,0% |
| V2 | 8 | 3 | atributo+1 | 3,45 | 2,23 | 9,86 | 15,28 | 1,550 | 83,0% [81,2%; 84,5%], n=2000 | 3,3 pp | 0,0% |
| V2 | 8 | 5 | ataque+1 | 3,27 | 3,02 | 10,41 | 11,26 | 1,082 | 57,4% [55,2%; 59,5%], n=2000 | 1,9 pp | 0,0% |
| V2 | 8 | 5 | defesa+1 | 3,10 | 2,75 | 10,97 | 12,35 | 1,126 | 59,2% [57,0%; 61,3%], n=2000 | -0,3 pp | 0,0% |
| V2 | 8 | 5 | dano+1 | 3,75 | 2,96 | 9,06 | 11,49 | 1,268 | 74,4% [72,4%; 76,2%], n=2000 | -0,3 pp | 0,0% |
| V2 | 8 | 5 | dano+1d6 | 5,56 | 2,77 | 6,11 | 12,26 | 2,006 | 93,8% [92,7%; 94,8%], n=2000 | -0,1 pp | 0,0% |
| V2 | 8 | 5 | absorcao+1 | 3,15 | 2,41 | 10,80 | 14,08 | 1,304 | 78,1% [76,2%; 79,9%], n=2000 | 1,4 pp | 0,0% |
| V2 | 8 | 5 | pv+1 | 3,06 | 3,04 | 11,13 | 11,52 | 1,035 | 53,4% [51,2%; 55,6%], n=2000 | 0,2 pp | 0,0% |
| V2 | 8 | 5 | pv+5 | 3,13 | 2,98 | 10,88 | 13,10 | 1,204 | 70,8% [68,8%; 72,8%], n=2000 | 0,6 pp | 0,0% |
| V2 | 8 | 5 | preparo-1 | 3,18 | 2,94 | 10,68 | 11,58 | 1,084 | 75,3% [73,4%; 77,1%], n=2000 | 1,6 pp | 0,0% |
| V2 | 8 | 5 | recuperacao-1 | 3,17 | 2,97 | 10,71 | 11,45 | 1,069 | 74,3% [72,3%; 76,1%], n=2000 | 0,3 pp | 0,0% |
| V2 | 8 | 5 | habilidade+1 | 3,39 | 2,99 | 10,02 | 11,38 | 1,136 | 63,2% [61,1%; 65,3%], n=2000 | 1,9 pp | 0,0% |
| V2 | 8 | 5 | atributo+1 | 3,45 | 2,23 | 9,86 | 15,28 | 1,550 | 83,0% [81,2%; 84,5%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 1 | ataque+1 | 4,10 | 3,49 | 8,29 | 9,74 | 1,176 | 62,0% [59,9%; 64,1%], n=2000 | 5,6 pp | 0,0% |
| V2 | 12 | 1 | defesa+1 | 3,73 | 3,04 | 9,11 | 11,17 | 1,226 | 63,3% [61,2%; 65,4%], n=2000 | 4,9 pp | 0,0% |
| V2 | 12 | 1 | dano+1 | 4,17 | 3,50 | 8,16 | 9,70 | 1,189 | 62,4% [60,2%; 64,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 1 | dano+1d6 | 5,65 | 3,32 | 6,02 | 10,23 | 1,700 | 80,1% [78,3%; 81,8%], n=2000 | 2,8 pp | 0,0% |
| V2 | 12 | 1 | absorcao+1 | 3,73 | 3,04 | 9,12 | 11,17 | 1,225 | 65,6% [63,5%; 67,7%], n=2000 | 4,2 pp | 0,0% |
| V2 | 12 | 1 | pv+1 | 3,63 | 3,60 | 9,37 | 9,73 | 1,039 | 53,1% [51,0%; 55,3%], n=2000 | 6,1 pp | 0,0% |
| V2 | 12 | 1 | pv+5 | 3,71 | 3,50 | 9,17 | 11,13 | 1,213 | 64,5% [62,4%; 66,6%], n=2000 | 5,2 pp | 0,0% |
| V2 | 12 | 1 | preparo-1 | 3,88 | 3,37 | 8,76 | 10,08 | 1,151 | 72,5% [70,5%; 74,4%], n=2000 | 0,2 pp | 0,0% |
| V2 | 12 | 1 | recuperacao-1 | 3,84 | 3,42 | 8,85 | 9,93 | 1,123 | 70,7% [68,6%; 72,6%], n=2000 | 0,3 pp | 0,0% |
| V2 | 12 | 1 | habilidade+1 | 4,51 | 3,38 | 7,54 | 10,06 | 1,333 | 72,0% [70,0%; 73,9%], n=2000 | 4,4 pp | 0,0% |
| V2 | 12 | 1 | atributo+1 | 4,67 | 2,25 | 7,28 | 15,10 | 2,075 | 90,9% [89,6%; 92,1%], n=2000 | 1,4 pp | 0,0% |
| V2 | 12 | 3 | ataque+1 | 4,10 | 3,49 | 8,29 | 9,74 | 1,176 | 62,0% [59,9%; 64,1%], n=2000 | 5,6 pp | 0,0% |
| V2 | 12 | 3 | defesa+1 | 3,73 | 3,04 | 9,11 | 11,17 | 1,226 | 63,3% [61,2%; 65,4%], n=2000 | 4,9 pp | 0,0% |
| V2 | 12 | 3 | dano+1 | 4,17 | 3,50 | 8,16 | 9,70 | 1,189 | 62,4% [60,2%; 64,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 3 | dano+1d6 | 5,65 | 3,32 | 6,02 | 10,23 | 1,700 | 80,1% [78,3%; 81,8%], n=2000 | 2,8 pp | 0,0% |
| V2 | 12 | 3 | absorcao+1 | 3,73 | 3,04 | 9,12 | 11,17 | 1,225 | 65,6% [63,5%; 67,7%], n=2000 | 4,2 pp | 0,0% |
| V2 | 12 | 3 | pv+1 | 3,63 | 3,60 | 9,37 | 9,73 | 1,039 | 53,1% [51,0%; 55,3%], n=2000 | 6,1 pp | 0,0% |
| V2 | 12 | 3 | pv+5 | 3,71 | 3,50 | 9,17 | 11,13 | 1,213 | 64,5% [62,4%; 66,6%], n=2000 | 5,2 pp | 0,0% |
| V2 | 12 | 3 | preparo-1 | 3,88 | 3,37 | 8,76 | 10,08 | 1,151 | 72,5% [70,5%; 74,4%], n=2000 | 0,2 pp | 0,0% |
| V2 | 12 | 3 | recuperacao-1 | 3,84 | 3,42 | 8,85 | 9,93 | 1,123 | 70,7% [68,6%; 72,6%], n=2000 | 0,3 pp | 0,0% |
| V2 | 12 | 3 | habilidade+1 | 4,51 | 3,38 | 7,54 | 10,06 | 1,333 | 72,0% [70,0%; 73,9%], n=2000 | 4,4 pp | 0,0% |
| V2 | 12 | 3 | atributo+1 | 4,67 | 2,25 | 7,28 | 15,10 | 2,075 | 90,9% [89,6%; 92,1%], n=2000 | 1,4 pp | 0,0% |
| V2 | 12 | 5 | ataque+1 | 4,10 | 3,49 | 8,29 | 9,74 | 1,176 | 62,0% [59,9%; 64,1%], n=2000 | 5,6 pp | 0,0% |
| V2 | 12 | 5 | defesa+1 | 3,73 | 3,04 | 9,11 | 11,17 | 1,226 | 63,3% [61,2%; 65,4%], n=2000 | 4,9 pp | 0,0% |
| V2 | 12 | 5 | dano+1 | 4,17 | 3,50 | 8,16 | 9,70 | 1,189 | 62,4% [60,2%; 64,4%], n=2000 | 3,3 pp | 0,0% |
| V2 | 12 | 5 | dano+1d6 | 5,65 | 3,32 | 6,02 | 10,23 | 1,700 | 80,1% [78,3%; 81,8%], n=2000 | 2,8 pp | 0,0% |
| V2 | 12 | 5 | absorcao+1 | 3,73 | 3,04 | 9,12 | 11,17 | 1,225 | 65,6% [63,5%; 67,7%], n=2000 | 4,2 pp | 0,0% |
| V2 | 12 | 5 | pv+1 | 3,63 | 3,60 | 9,37 | 9,73 | 1,039 | 53,1% [51,0%; 55,3%], n=2000 | 6,1 pp | 0,0% |
| V2 | 12 | 5 | pv+5 | 3,71 | 3,50 | 9,17 | 11,13 | 1,213 | 64,5% [62,4%; 66,6%], n=2000 | 5,2 pp | 0,0% |
| V2 | 12 | 5 | preparo-1 | 3,88 | 3,37 | 8,76 | 10,08 | 1,151 | 72,5% [70,5%; 74,4%], n=2000 | 0,2 pp | 0,0% |
| V2 | 12 | 5 | recuperacao-1 | 3,84 | 3,42 | 8,85 | 9,93 | 1,123 | 70,7% [68,6%; 72,6%], n=2000 | 0,3 pp | 0,0% |
| V2 | 12 | 5 | habilidade+1 | 4,51 | 3,38 | 7,54 | 10,06 | 1,333 | 72,0% [70,0%; 73,9%], n=2000 | 4,4 pp | 0,0% |
| V2 | 12 | 5 | atributo+1 | 4,67 | 2,25 | 7,28 | 15,10 | 2,075 | 90,9% [89,6%; 92,1%], n=2000 | 1,4 pp | 0,0% |
| V3 | 6 | 1 | ataque+1 | 2,66 | 2,63 | 12,78 | 12,92 | 1,011 | 49,7% [47,5%; 51,9%], n=2000 | -1,6 pp | 0,0% |
| V3 | 6 | 1 | defesa+1 | 2,63 | 2,49 | 12,95 | 13,65 | 1,054 | 54,8% [52,6%; 57,0%], n=2000 | -0,8 pp | 0,0% |
| V3 | 6 | 1 | dano+1 | 3,36 | 2,58 | 10,13 | 13,16 | 1,299 | 80,1% [78,3%; 81,8%], n=2000 | -0,4 pp | 0,0% |
| V3 | 6 | 1 | dano+1d6 | 5,31 | 2,46 | 6,40 | 13,84 | 2,162 | 98,7% [98,1%; 99,1%], n=2000 | 0,0 pp | 0,0% |
| V3 | 6 | 1 | absorcao+1 | 2,63 | 2,11 | 12,92 | 16,13 | 1,249 | 78,0% [76,1%; 79,7%], n=2000 | -3,7 pp | 0,0% |
| V3 | 6 | 1 | pv+1 | 2,62 | 2,63 | 12,95 | 13,31 | 1,027 | 54,6% [52,5%; 56,8%], n=2000 | -0,1 pp | 0,0% |
| V3 | 6 | 1 | pv+5 | 2,62 | 2,61 | 12,97 | 14,96 | 1,153 | 71,2% [69,1%; 73,1%], n=2000 | -0,7 pp | 0,0% |
| V3 | 6 | 1 | preparo-1 | 2,65 | 2,61 | 12,85 | 13,05 | 1,016 | 71,3% [69,2%; 73,2%], n=2000 | 5,1 pp | 0,0% |
| V3 | 6 | 1 | recuperacao-1 | 2,65 | 2,61 | 12,83 | 13,04 | 1,016 | 70,6% [68,6%; 72,6%], n=2000 | 5,6 pp | 0,0% |
| V3 | 6 | 1 | habilidade+1 | 2,66 | 2,62 | 12,77 | 12,95 | 1,014 | 49,5% [47,3%; 51,6%], n=2000 | -0,3 pp | 0,0% |
| V3 | 6 | 1 | atributo+1 | 2,64 | 2,23 | 12,87 | 15,28 | 1,188 | 61,9% [59,8%; 64,0%], n=2000 | 5,8 pp | 0,0% |
| V3 | 6 | 3 | ataque+1 | 2,04 | 2,09 | 16,68 | 16,25 | 0,974 | 43,3% [41,1%; 45,4%], n=2000 | 3,3 pp | 0,0% |
| V3 | 6 | 3 | defesa+1 | 2,09 | 2,08 | 16,28 | 16,32 | 1,002 | 48,3% [46,1%; 50,5%], n=2000 | 0,0 pp | 0,0% |
| V3 | 6 | 3 | dano+1 | 2,63 | 2,11 | 12,92 | 16,13 | 1,249 | 78,0% [76,1%; 79,7%], n=2000 | -3,7 pp | 0,0% |
| V3 | 6 | 3 | dano+1d6 | 4,55 | 2,04 | 7,47 | 16,66 | 2,231 | 99,4% [99,0%; 99,7%], n=2000 | 0,4 pp | 0,0% |
| V3 | 6 | 3 | absorcao+1 | 2,05 | 1,71 | 16,55 | 19,85 | 1,199 | 77,1% [75,2%; 78,9%], n=2000 | 2,8 pp | 0,0% |
| V3 | 6 | 3 | pv+1 | 2,08 | 2,09 | 16,32 | 16,75 | 1,027 | 54,1% [51,9%; 56,3%], n=2000 | 1,2 pp | 0,0% |
| V3 | 6 | 3 | pv+5 | 2,07 | 2,10 | 16,42 | 18,61 | 1,133 | 70,9% [68,9%; 72,8%], n=2000 | 3,8 pp | 0,0% |
| V3 | 6 | 3 | preparo-1 | 2,06 | 2,10 | 16,49 | 16,16 | 0,980 | 69,7% [67,6%; 71,7%], n=2000 | 2,0 pp | 0,0% |
| V3 | 6 | 3 | recuperacao-1 | 2,07 | 2,11 | 16,41 | 16,09 | 0,980 | 69,8% [67,7%; 71,7%], n=2000 | 1,5 pp | 0,0% |
| V3 | 6 | 3 | habilidade+1 | 1,98 | 2,08 | 17,20 | 16,35 | 0,950 | 37,9% [35,7%; 40,0%], n=2000 | 0,3 pp | 0,0% |
| V3 | 6 | 3 | atributo+1 | 1,96 | 1,97 | 17,32 | 17,29 | 0,998 | 42,0% [39,9%; 44,2%], n=2000 | 0,5 pp | 0,0% |
| V3 | 6 | 5 | ataque+1 | 1,56 | 1,64 | 21,84 | 20,79 | 0,952 | 39,1% [37,0%; 41,3%], n=2000 | -1,4 pp | 0,0% |
| V3 | 6 | 5 | defesa+1 | 1,66 | 1,71 | 20,44 | 19,90 | 0,974 | 43,5% [41,3%; 45,7%], n=2000 | -3,4 pp | 0,0% |
| V3 | 6 | 5 | dano+1 | 2,05 | 1,71 | 16,55 | 19,85 | 1,199 | 77,1% [75,2%; 78,9%], n=2000 | 2,8 pp | 0,0% |
| V3 | 6 | 5 | dano+1d6 | 3,82 | 1,71 | 8,90 | 19,89 | 2,236 | 99,4% [99,0%; 99,7%], n=2000 | 0,4 pp | 0,0% |
| V3 | 6 | 5 | absorcao+1 | 1,59 | 1,40 | 21,40 | 24,29 | 1,135 | 72,7% [70,7%; 74,6%], n=2000 | 0,1 pp | 0,0% |
| V3 | 6 | 5 | pv+1 | 1,64 | 1,66 | 20,71 | 21,14 | 1,021 | 53,6% [51,4%; 55,8%], n=2000 | 0,6 pp | 0,0% |
| V3 | 6 | 5 | pv+5 | 1,61 | 1,68 | 21,08 | 23,23 | 1,102 | 71,2% [69,1%; 73,1%], n=2000 | -3,3 pp | 0,0% |
| V3 | 6 | 5 | preparo-1 | 1,60 | 1,71 | 21,29 | 19,93 | 0,937 | 65,6% [63,5%; 67,7%], n=2000 | 0,3 pp | 0,0% |
| V3 | 6 | 5 | recuperacao-1 | 1,59 | 1,69 | 21,35 | 20,10 | 0,941 | 65,9% [63,8%; 67,9%], n=2000 | 1,6 pp | 0,0% |
| V3 | 6 | 5 | habilidade+1 | 1,44 | 1,59 | 23,60 | 21,37 | 0,905 | 29,5% [27,5%; 31,5%], n=2000 | 2,0 pp | 0,0% |
| V3 | 6 | 5 | atributo+1 | 1,46 | 1,70 | 23,25 | 20,01 | 0,860 | 21,8% [20,0%; 23,7%], n=2000 | 2,2 pp | 0,0% |
| V3 | 8 | 1 | ataque+1 | 3,27 | 3,02 | 10,41 | 11,26 | 1,082 | 57,4% [55,2%; 59,5%], n=2000 | 1,9 pp | 0,0% |
| V3 | 8 | 1 | defesa+1 | 3,10 | 2,75 | 10,97 | 12,35 | 1,126 | 59,2% [57,0%; 61,3%], n=2000 | -0,3 pp | 0,0% |
| V3 | 8 | 1 | dano+1 | 3,75 | 2,96 | 9,06 | 11,49 | 1,268 | 74,4% [72,4%; 76,2%], n=2000 | -0,3 pp | 0,0% |
| V3 | 8 | 1 | dano+1d6 | 5,56 | 2,77 | 6,11 | 12,26 | 2,006 | 93,8% [92,7%; 94,8%], n=2000 | -0,1 pp | 0,0% |
| V3 | 8 | 1 | absorcao+1 | 3,15 | 2,41 | 10,80 | 14,08 | 1,304 | 78,1% [76,2%; 79,9%], n=2000 | 1,4 pp | 0,0% |
| V3 | 8 | 1 | pv+1 | 3,06 | 3,04 | 11,13 | 11,52 | 1,035 | 53,4% [51,2%; 55,6%], n=2000 | 0,2 pp | 0,0% |
| V3 | 8 | 1 | pv+5 | 3,13 | 2,98 | 10,88 | 13,10 | 1,204 | 70,8% [68,8%; 72,8%], n=2000 | 0,6 pp | 0,0% |
| V3 | 8 | 1 | preparo-1 | 3,18 | 2,94 | 10,68 | 11,58 | 1,084 | 75,3% [73,4%; 77,1%], n=2000 | 1,6 pp | 0,0% |
| V3 | 8 | 1 | recuperacao-1 | 3,17 | 2,97 | 10,71 | 11,45 | 1,069 | 74,3% [72,3%; 76,1%], n=2000 | 0,3 pp | 0,0% |
| V3 | 8 | 1 | habilidade+1 | 3,39 | 2,99 | 10,02 | 11,38 | 1,136 | 63,2% [61,1%; 65,3%], n=2000 | 1,9 pp | 0,0% |
| V3 | 8 | 1 | atributo+1 | 3,45 | 2,23 | 9,86 | 15,28 | 1,550 | 83,0% [81,2%; 84,5%], n=2000 | 3,3 pp | 0,0% |
| V3 | 8 | 3 | ataque+1 | 2,57 | 2,48 | 13,24 | 13,71 | 1,035 | 52,5% [50,3%; 54,7%], n=2000 | -0,8 pp | 0,0% |
| V3 | 8 | 3 | defesa+1 | 2,49 | 2,30 | 13,66 | 14,77 | 1,082 | 54,8% [52,6%; 57,0%], n=2000 | 0,2 pp | 0,0% |
| V3 | 8 | 3 | dano+1 | 3,15 | 2,41 | 10,80 | 14,08 | 1,304 | 78,1% [76,2%; 79,9%], n=2000 | 1,4 pp | 0,0% |
| V3 | 8 | 3 | dano+1d6 | 4,95 | 2,29 | 6,87 | 14,85 | 2,161 | 96,2% [95,3%; 97,0%], n=2000 | 1,2 pp | 0,0% |
| V3 | 8 | 3 | absorcao+1 | 2,52 | 1,97 | 13,47 | 17,26 | 1,281 | 77,8% [75,9%; 79,5%], n=2000 | -2,7 pp | 0,0% |
| V3 | 8 | 3 | pv+1 | 2,49 | 2,46 | 13,65 | 14,22 | 1,042 | 54,5% [52,4%; 56,7%], n=2000 | -3,1 pp | 0,0% |
| V3 | 8 | 3 | pv+5 | 2,52 | 2,43 | 13,49 | 16,05 | 1,190 | 70,8% [68,7%; 72,7%], n=2000 | -2,7 pp | 0,0% |
| V3 | 8 | 3 | preparo-1 | 2,53 | 2,40 | 13,44 | 14,19 | 1,056 | 73,0% [71,0%; 74,9%], n=2000 | -1,1 pp | 0,0% |
| V3 | 8 | 3 | recuperacao-1 | 2,52 | 2,44 | 13,47 | 13,92 | 1,033 | 71,3% [69,3%; 73,2%], n=2000 | -0,6 pp | 0,0% |
| V3 | 8 | 3 | habilidade+1 | 2,61 | 2,48 | 13,03 | 13,73 | 1,054 | 54,4% [52,3%; 56,6%], n=2000 | 0,3 pp | 0,0% |
| V3 | 8 | 3 | atributo+1 | 2,61 | 1,98 | 13,03 | 17,20 | 1,320 | 72,3% [70,2%; 74,2%], n=2000 | 1,9 pp | 0,0% |
| V3 | 8 | 5 | ataque+1 | 2,00 | 2,00 | 16,97 | 17,02 | 1,003 | 48,9% [46,7%; 51,1%], n=2000 | 0,8 pp | 0,0% |
| V3 | 8 | 5 | defesa+1 | 1,98 | 1,93 | 17,13 | 17,62 | 1,029 | 51,2% [49,0%; 53,4%], n=2000 | -3,0 pp | 0,0% |
| V3 | 8 | 5 | dano+1 | 2,52 | 1,97 | 13,47 | 17,26 | 1,281 | 77,8% [75,9%; 79,5%], n=2000 | -2,7 pp | 0,0% |
| V3 | 8 | 5 | dano+1d6 | 4,29 | 1,88 | 7,93 | 18,04 | 2,275 | 97,5% [96,7%; 98,1%], n=2000 | 0,2 pp | 0,0% |
| V3 | 8 | 5 | absorcao+1 | 2,00 | 1,62 | 17,00 | 20,95 | 1,232 | 77,0% [75,1%; 78,8%], n=2000 | 3,0 pp | 0,0% |
| V3 | 8 | 5 | pv+1 | 1,99 | 2,01 | 17,10 | 17,45 | 1,021 | 51,4% [49,3%; 53,6%], n=2000 | -1,9 pp | 0,0% |
| V3 | 8 | 5 | pv+5 | 2,00 | 1,99 | 17,01 | 19,56 | 1,150 | 69,8% [67,7%; 71,7%], n=2000 | 1,5 pp | 0,0% |
| V3 | 8 | 5 | preparo-1 | 1,99 | 1,99 | 17,06 | 17,08 | 1,001 | 69,8% [67,7%; 71,7%], n=2000 | 0,1 pp | 0,0% |
| V3 | 8 | 5 | recuperacao-1 | 2,00 | 2,01 | 16,99 | 16,91 | 0,995 | 68,6% [66,5%; 70,6%], n=2000 | 0,4 pp | 0,0% |
| V3 | 8 | 5 | habilidade+1 | 1,97 | 1,99 | 17,28 | 17,04 | 0,986 | 45,0% [42,8%; 47,1%], n=2000 | 0,7 pp | 0,0% |
| V3 | 8 | 5 | atributo+1 | 1,94 | 1,75 | 17,52 | 19,41 | 1,108 | 55,1% [52,9%; 57,3%], n=2000 | 2,2 pp | 0,0% |
| V3 | 12 | 1 | ataque+1 | 4,10 | 3,49 | 8,29 | 9,74 | 1,176 | 62,0% [59,9%; 64,1%], n=2000 | 5,6 pp | 0,0% |
| V3 | 12 | 1 | defesa+1 | 3,73 | 3,04 | 9,11 | 11,17 | 1,226 | 63,3% [61,2%; 65,4%], n=2000 | 4,9 pp | 0,0% |
| V3 | 12 | 1 | dano+1 | 4,17 | 3,50 | 8,16 | 9,70 | 1,189 | 62,4% [60,2%; 64,4%], n=2000 | 3,3 pp | 0,0% |
| V3 | 12 | 1 | dano+1d6 | 5,65 | 3,32 | 6,02 | 10,23 | 1,700 | 80,1% [78,3%; 81,8%], n=2000 | 2,8 pp | 0,0% |
| V3 | 12 | 1 | absorcao+1 | 3,73 | 3,04 | 9,12 | 11,17 | 1,225 | 65,6% [63,5%; 67,7%], n=2000 | 4,2 pp | 0,0% |
| V3 | 12 | 1 | pv+1 | 3,63 | 3,60 | 9,37 | 9,73 | 1,039 | 53,1% [51,0%; 55,3%], n=2000 | 6,1 pp | 0,0% |
| V3 | 12 | 1 | pv+5 | 3,71 | 3,50 | 9,17 | 11,13 | 1,213 | 64,5% [62,4%; 66,6%], n=2000 | 5,2 pp | 0,0% |
| V3 | 12 | 1 | preparo-1 | 3,88 | 3,37 | 8,76 | 10,08 | 1,151 | 72,5% [70,5%; 74,4%], n=2000 | 0,2 pp | 0,0% |
| V3 | 12 | 1 | recuperacao-1 | 3,84 | 3,42 | 8,85 | 9,93 | 1,123 | 70,7% [68,6%; 72,6%], n=2000 | 0,3 pp | 0,0% |
| V3 | 12 | 1 | habilidade+1 | 4,51 | 3,38 | 7,54 | 10,06 | 1,333 | 72,0% [70,0%; 73,9%], n=2000 | 4,4 pp | 0,0% |
| V3 | 12 | 1 | atributo+1 | 4,67 | 2,25 | 7,28 | 15,10 | 2,075 | 90,9% [89,6%; 92,1%], n=2000 | 1,4 pp | 0,0% |
| V3 | 12 | 3 | ataque+1 | 3,53 | 3,04 | 9,64 | 11,17 | 1,158 | 62,0% [59,8%; 64,1%], n=2000 | 4,9 pp | 0,0% |
| V3 | 12 | 3 | defesa+1 | 3,24 | 2,67 | 10,50 | 12,71 | 1,210 | 64,2% [62,1%; 66,3%], n=2000 | 3,0 pp | 0,0% |
| V3 | 12 | 3 | dano+1 | 3,73 | 3,04 | 9,12 | 11,17 | 1,225 | 65,6% [63,5%; 67,7%], n=2000 | 4,2 pp | 0,0% |
| V3 | 12 | 3 | dano+1d6 | 5,18 | 2,86 | 6,56 | 11,89 | 1,811 | 85,1% [83,5%; 86,6%], n=2000 | 1,4 pp | 0,0% |
| V3 | 12 | 3 | absorcao+1 | 3,24 | 2,57 | 10,50 | 13,23 | 1,260 | 69,2% [67,1%; 71,1%], n=2000 | 0,5 pp | 0,0% |
| V3 | 12 | 3 | pv+1 | 3,15 | 3,13 | 10,79 | 11,18 | 1,036 | 53,3% [51,2%; 55,5%], n=2000 | 3,7 pp | 0,0% |
| V3 | 12 | 3 | pv+5 | 3,21 | 3,05 | 10,60 | 12,80 | 1,207 | 64,6% [62,5%; 66,7%], n=2000 | 1,3 pp | 0,0% |
| V3 | 12 | 3 | preparo-1 | 3,37 | 2,95 | 10,10 | 11,54 | 1,142 | 73,0% [71,0%; 74,9%], n=2000 | 0,5 pp | 0,0% |
| V3 | 12 | 3 | recuperacao-1 | 3,35 | 2,98 | 10,14 | 11,42 | 1,126 | 71,8% [69,7%; 73,7%], n=2000 | -1,3 pp | 0,0% |
| V3 | 12 | 3 | habilidade+1 | 3,84 | 2,95 | 8,85 | 11,52 | 1,302 | 71,3% [69,2%; 73,2%], n=2000 | 5,3 pp | 0,0% |
| V3 | 12 | 3 | atributo+1 | 3,95 | 2,03 | 8,62 | 16,76 | 1,945 | 89,8% [88,4%; 91,1%], n=2000 | 2,7 pp | 0,0% |
| V3 | 12 | 5 | ataque+1 | 2,94 | 2,59 | 11,57 | 13,14 | 1,135 | 61,1% [58,9%; 63,2%], n=2000 | 1,0 pp | 0,0% |
| V3 | 12 | 5 | defesa+1 | 2,72 | 2,31 | 12,50 | 14,69 | 1,175 | 62,3% [60,1%; 64,3%], n=2000 | 1,9 pp | 0,0% |
| V3 | 12 | 5 | dano+1 | 3,24 | 2,57 | 10,50 | 13,23 | 1,260 | 69,2% [67,1%; 71,1%], n=2000 | 0,5 pp | 0,0% |
| V3 | 12 | 5 | dano+1d6 | 4,73 | 2,43 | 7,19 | 14,01 | 1,948 | 88,3% [86,8%; 89,6%], n=2000 | 2,2 pp | 0,0% |
| V3 | 12 | 5 | absorcao+1 | 2,77 | 2,11 | 12,28 | 16,11 | 1,312 | 73,2% [71,2%; 75,1%], n=2000 | -2,2 pp | 0,0% |
| V3 | 12 | 5 | pv+1 | 2,67 | 2,65 | 12,73 | 13,22 | 1,038 | 53,3% [51,1%; 55,5%], n=2000 | -0,6 pp | 0,0% |
| V3 | 12 | 5 | pv+5 | 2,74 | 2,57 | 12,41 | 15,16 | 1,222 | 68,2% [66,1%; 70,2%], n=2000 | 0,6 pp | 0,0% |
| V3 | 12 | 5 | preparo-1 | 2,83 | 2,52 | 12,00 | 13,51 | 1,125 | 73,3% [71,3%; 75,2%], n=2000 | 1,6 pp | 0,0% |
| V3 | 12 | 5 | recuperacao-1 | 2,81 | 2,55 | 12,11 | 13,33 | 1,101 | 70,9% [68,8%; 72,8%], n=2000 | 1,3 pp | 0,0% |
| V3 | 12 | 5 | habilidade+1 | 3,15 | 2,54 | 10,81 | 13,37 | 1,237 | 68,1% [66,0%; 70,1%], n=2000 | 3,2 pp | 0,0% |
| V3 | 12 | 5 | atributo+1 | 3,21 | 1,80 | 10,58 | 18,86 | 1,783 | 87,2% [85,6%; 88,5%], n=2000 | 2,9 pp | 0,0% |
| V1+V2 | 6 | 1 | ataque+1 | 3,96 | 3,69 | 8,60 | 9,21 | 1,071 | 61,5% [59,3%; 63,6%], n=2000 | 10,9 pp | 0,0% |
| V1+V2 | 6 | 1 | defesa+1 | 3,78 | 3,30 | 8,99 | 10,29 | 1,145 | 65,3% [63,2%; 67,4%], n=2000 | 11,1 pp | 0,0% |
| V1+V2 | 6 | 1 | dano+1 | 3,99 | 3,65 | 8,53 | 9,31 | 1,092 | 66,0% [63,9%; 68,1%], n=2000 | 6,5 pp | 0,0% |
| V1+V2 | 6 | 1 | dano+1d6 | 5,35 | 3,43 | 6,35 | 9,93 | 1,563 | 90,6% [89,2%; 91,8%], n=2000 | 1,0 pp | 0,0% |
| V1+V2 | 6 | 1 | absorcao+1 | 3,72 | 3,61 | 9,13 | 9,41 | 1,030 | 55,3% [53,1%; 57,4%], n=2000 | 15,1 pp | 0,0% |
| V1+V2 | 6 | 1 | pv+1 | 3,73 | 3,69 | 9,11 | 9,48 | 1,041 | 54,9% [52,8%; 57,1%], n=2000 | 13,5 pp | 0,0% |
| V1+V2 | 6 | 1 | pv+5 | 3,79 | 3,64 | 8,98 | 10,71 | 1,193 | 79,6% [77,8%; 81,3%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 6 | 1 | preparo-1 | 3,90 | 3,54 | 8,73 | 9,60 | 1,100 | 91,1% [89,8%; 92,3%], n=2000 | 1,6 pp | 0,0% |
| V1+V2 | 6 | 1 | recuperacao-1 | 3,88 | 3,57 | 8,76 | 9,52 | 1,087 | 90,7% [89,3%; 91,9%], n=2000 | 0,8 pp | 0,0% |
| V1+V2 | 6 | 1 | habilidade+1 | 4,09 | 3,65 | 8,31 | 9,31 | 1,120 | 69,7% [67,6%; 71,6%], n=2000 | 10,7 pp | 0,0% |
| V1+V2 | 6 | 1 | atributo+1 | 4,11 | 2,61 | 8,27 | 13,00 | 1,572 | 90,3% [88,9%; 91,5%], n=2000 | 9,9 pp | 0,0% |
| V1+V2 | 6 | 3 | ataque+1 | 3,96 | 3,69 | 8,60 | 9,21 | 1,071 | 61,5% [59,3%; 63,6%], n=2000 | 10,9 pp | 0,0% |
| V1+V2 | 6 | 3 | defesa+1 | 3,78 | 3,30 | 8,99 | 10,29 | 1,145 | 65,3% [63,2%; 67,4%], n=2000 | 11,1 pp | 0,0% |
| V1+V2 | 6 | 3 | dano+1 | 3,99 | 3,65 | 8,53 | 9,31 | 1,092 | 66,0% [63,9%; 68,1%], n=2000 | 6,5 pp | 0,0% |
| V1+V2 | 6 | 3 | dano+1d6 | 5,35 | 3,43 | 6,35 | 9,93 | 1,563 | 90,6% [89,2%; 91,8%], n=2000 | 1,0 pp | 0,0% |
| V1+V2 | 6 | 3 | absorcao+1 | 3,72 | 3,61 | 9,13 | 9,41 | 1,030 | 55,3% [53,1%; 57,4%], n=2000 | 15,1 pp | 0,0% |
| V1+V2 | 6 | 3 | pv+1 | 3,73 | 3,69 | 9,11 | 9,48 | 1,041 | 54,9% [52,8%; 57,1%], n=2000 | 13,5 pp | 0,0% |
| V1+V2 | 6 | 3 | pv+5 | 3,79 | 3,64 | 8,98 | 10,71 | 1,193 | 79,6% [77,8%; 81,3%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 6 | 3 | preparo-1 | 3,90 | 3,54 | 8,73 | 9,60 | 1,100 | 91,1% [89,8%; 92,3%], n=2000 | 1,6 pp | 0,0% |
| V1+V2 | 6 | 3 | recuperacao-1 | 3,88 | 3,57 | 8,76 | 9,52 | 1,087 | 90,7% [89,3%; 91,9%], n=2000 | 0,8 pp | 0,0% |
| V1+V2 | 6 | 3 | habilidade+1 | 4,09 | 3,65 | 8,31 | 9,31 | 1,120 | 69,7% [67,6%; 71,6%], n=2000 | 10,7 pp | 0,0% |
| V1+V2 | 6 | 3 | atributo+1 | 4,11 | 2,61 | 8,27 | 13,00 | 1,572 | 90,3% [88,9%; 91,5%], n=2000 | 9,9 pp | 0,0% |
| V1+V2 | 6 | 5 | ataque+1 | 3,96 | 3,69 | 8,60 | 9,21 | 1,071 | 61,5% [59,3%; 63,6%], n=2000 | 10,9 pp | 0,0% |
| V1+V2 | 6 | 5 | defesa+1 | 3,78 | 3,30 | 8,99 | 10,29 | 1,145 | 65,3% [63,2%; 67,4%], n=2000 | 11,1 pp | 0,0% |
| V1+V2 | 6 | 5 | dano+1 | 3,99 | 3,65 | 8,53 | 9,31 | 1,092 | 66,0% [63,9%; 68,1%], n=2000 | 6,5 pp | 0,0% |
| V1+V2 | 6 | 5 | dano+1d6 | 5,35 | 3,43 | 6,35 | 9,93 | 1,563 | 90,6% [89,2%; 91,8%], n=2000 | 1,0 pp | 0,0% |
| V1+V2 | 6 | 5 | absorcao+1 | 3,72 | 3,61 | 9,13 | 9,41 | 1,030 | 55,3% [53,1%; 57,4%], n=2000 | 15,1 pp | 0,0% |
| V1+V2 | 6 | 5 | pv+1 | 3,73 | 3,69 | 9,11 | 9,48 | 1,041 | 54,9% [52,8%; 57,1%], n=2000 | 13,5 pp | 0,0% |
| V1+V2 | 6 | 5 | pv+5 | 3,79 | 3,64 | 8,98 | 10,71 | 1,193 | 79,6% [77,8%; 81,3%], n=2000 | 4,0 pp | 0,0% |
| V1+V2 | 6 | 5 | preparo-1 | 3,90 | 3,54 | 8,73 | 9,60 | 1,100 | 91,1% [89,8%; 92,3%], n=2000 | 1,6 pp | 0,0% |
| V1+V2 | 6 | 5 | recuperacao-1 | 3,88 | 3,57 | 8,76 | 9,52 | 1,087 | 90,7% [89,3%; 91,9%], n=2000 | 0,8 pp | 0,0% |
| V1+V2 | 6 | 5 | habilidade+1 | 4,09 | 3,65 | 8,31 | 9,31 | 1,120 | 69,7% [67,6%; 71,6%], n=2000 | 10,7 pp | 0,0% |
| V1+V2 | 6 | 5 | atributo+1 | 4,11 | 2,61 | 8,27 | 13,00 | 1,572 | 90,3% [88,9%; 91,5%], n=2000 | 9,9 pp | 0,0% |
| V1+V2 | 8 | 1 | ataque+1 | 3,98 | 3,56 | 8,54 | 9,55 | 1,119 | 64,1% [62,0%; 66,2%], n=2000 | 7,5 pp | 0,0% |
| V1+V2 | 8 | 1 | defesa+1 | 3,74 | 3,17 | 9,10 | 10,74 | 1,180 | 64,5% [62,3%; 66,5%], n=2000 | 7,3 pp | 0,0% |
| V1+V2 | 8 | 1 | dano+1 | 4,00 | 3,56 | 8,51 | 9,54 | 1,122 | 63,0% [60,9%; 65,1%], n=2000 | 4,6 pp | 0,0% |
| V1+V2 | 8 | 1 | dano+1d6 | 5,53 | 3,34 | 6,15 | 10,19 | 1,658 | 87,7% [86,2%; 89,1%], n=2000 | 1,6 pp | 0,0% |
| V1+V2 | 8 | 1 | absorcao+1 | 3,69 | 3,41 | 9,22 | 9,98 | 1,082 | 61,9% [59,8%; 64,0%], n=2000 | 4,8 pp | 0,0% |
| V1+V2 | 8 | 1 | pv+1 | 3,65 | 3,63 | 9,31 | 9,65 | 1,037 | 55,8% [53,6%; 58,0%], n=2000 | 6,4 pp | 0,0% |
| V1+V2 | 8 | 1 | pv+5 | 3,73 | 3,54 | 9,12 | 11,01 | 1,207 | 73,3% [71,3%; 75,2%], n=2000 | 1,8 pp | 0,0% |
| V1+V2 | 8 | 1 | preparo-1 | 3,84 | 3,48 | 8,85 | 9,77 | 1,104 | 80,8% [79,1%; 82,5%], n=2000 | 1,7 pp | 0,0% |
| V1+V2 | 8 | 1 | recuperacao-1 | 3,83 | 3,48 | 8,88 | 9,76 | 1,099 | 79,8% [78,0%; 81,5%], n=2000 | 0,0 pp | 0,0% |
| V1+V2 | 8 | 1 | habilidade+1 | 4,22 | 3,49 | 8,05 | 9,74 | 1,210 | 74,1% [72,1%; 75,9%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 1 | atributo+1 | 4,30 | 2,41 | 7,92 | 14,11 | 1,783 | 92,8% [91,5%; 93,8%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 8 | 3 | ataque+1 | 3,98 | 3,56 | 8,54 | 9,55 | 1,119 | 64,1% [62,0%; 66,2%], n=2000 | 7,5 pp | 0,0% |
| V1+V2 | 8 | 3 | defesa+1 | 3,74 | 3,17 | 9,10 | 10,74 | 1,180 | 64,5% [62,3%; 66,5%], n=2000 | 7,3 pp | 0,0% |
| V1+V2 | 8 | 3 | dano+1 | 4,00 | 3,56 | 8,51 | 9,54 | 1,122 | 63,0% [60,9%; 65,1%], n=2000 | 4,6 pp | 0,0% |
| V1+V2 | 8 | 3 | dano+1d6 | 5,53 | 3,34 | 6,15 | 10,19 | 1,658 | 87,7% [86,2%; 89,1%], n=2000 | 1,6 pp | 0,0% |
| V1+V2 | 8 | 3 | absorcao+1 | 3,69 | 3,41 | 9,22 | 9,98 | 1,082 | 61,9% [59,8%; 64,0%], n=2000 | 4,8 pp | 0,0% |
| V1+V2 | 8 | 3 | pv+1 | 3,65 | 3,63 | 9,31 | 9,65 | 1,037 | 55,8% [53,6%; 58,0%], n=2000 | 6,4 pp | 0,0% |
| V1+V2 | 8 | 3 | pv+5 | 3,73 | 3,54 | 9,12 | 11,01 | 1,207 | 73,3% [71,3%; 75,2%], n=2000 | 1,8 pp | 0,0% |
| V1+V2 | 8 | 3 | preparo-1 | 3,84 | 3,48 | 8,85 | 9,77 | 1,104 | 80,8% [79,1%; 82,5%], n=2000 | 1,7 pp | 0,0% |
| V1+V2 | 8 | 3 | recuperacao-1 | 3,83 | 3,48 | 8,88 | 9,76 | 1,099 | 79,8% [78,0%; 81,5%], n=2000 | 0,0 pp | 0,0% |
| V1+V2 | 8 | 3 | habilidade+1 | 4,22 | 3,49 | 8,05 | 9,74 | 1,210 | 74,1% [72,1%; 75,9%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 3 | atributo+1 | 4,30 | 2,41 | 7,92 | 14,11 | 1,783 | 92,8% [91,5%; 93,8%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 8 | 5 | ataque+1 | 3,98 | 3,56 | 8,54 | 9,55 | 1,119 | 64,1% [62,0%; 66,2%], n=2000 | 7,5 pp | 0,0% |
| V1+V2 | 8 | 5 | defesa+1 | 3,74 | 3,17 | 9,10 | 10,74 | 1,180 | 64,5% [62,3%; 66,5%], n=2000 | 7,3 pp | 0,0% |
| V1+V2 | 8 | 5 | dano+1 | 4,00 | 3,56 | 8,51 | 9,54 | 1,122 | 63,0% [60,9%; 65,1%], n=2000 | 4,6 pp | 0,0% |
| V1+V2 | 8 | 5 | dano+1d6 | 5,53 | 3,34 | 6,15 | 10,19 | 1,658 | 87,7% [86,2%; 89,1%], n=2000 | 1,6 pp | 0,0% |
| V1+V2 | 8 | 5 | absorcao+1 | 3,69 | 3,41 | 9,22 | 9,98 | 1,082 | 61,9% [59,8%; 64,0%], n=2000 | 4,8 pp | 0,0% |
| V1+V2 | 8 | 5 | pv+1 | 3,65 | 3,63 | 9,31 | 9,65 | 1,037 | 55,8% [53,6%; 58,0%], n=2000 | 6,4 pp | 0,0% |
| V1+V2 | 8 | 5 | pv+5 | 3,73 | 3,54 | 9,12 | 11,01 | 1,207 | 73,3% [71,3%; 75,2%], n=2000 | 1,8 pp | 0,0% |
| V1+V2 | 8 | 5 | preparo-1 | 3,84 | 3,48 | 8,85 | 9,77 | 1,104 | 80,8% [79,1%; 82,5%], n=2000 | 1,7 pp | 0,0% |
| V1+V2 | 8 | 5 | recuperacao-1 | 3,83 | 3,48 | 8,88 | 9,76 | 1,099 | 79,8% [78,0%; 81,5%], n=2000 | 0,0 pp | 0,0% |
| V1+V2 | 8 | 5 | habilidade+1 | 4,22 | 3,49 | 8,05 | 9,74 | 1,210 | 74,1% [72,1%; 75,9%], n=2000 | 8,1 pp | 0,0% |
| V1+V2 | 8 | 5 | atributo+1 | 4,30 | 2,41 | 7,92 | 14,11 | 1,783 | 92,8% [91,5%; 93,8%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 12 | 1 | ataque+1 | 4,19 | 3,55 | 8,11 | 9,57 | 1,181 | 63,1% [61,0%; 65,2%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 12 | 1 | defesa+1 | 3,81 | 3,10 | 8,93 | 10,96 | 1,227 | 63,3% [61,2%; 65,4%], n=2000 | 4,5 pp | 0,0% |
| V1+V2 | 12 | 1 | dano+1 | 4,15 | 3,59 | 8,20 | 9,48 | 1,156 | 60,8% [58,6%; 62,9%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 12 | 1 | dano+1d6 | 5,63 | 3,41 | 6,04 | 9,98 | 1,652 | 78,6% [76,7%; 80,3%], n=2000 | 2,8 pp | 0,0% |
| V1+V2 | 12 | 1 | absorcao+1 | 3,76 | 3,28 | 9,05 | 10,38 | 1,146 | 60,7% [58,5%; 62,8%], n=2000 | 6,4 pp | 0,0% |
| V1+V2 | 12 | 1 | pv+1 | 3,70 | 3,65 | 9,20 | 9,58 | 1,042 | 53,3% [51,1%; 55,5%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 12 | 1 | pv+5 | 3,77 | 3,57 | 9,02 | 10,91 | 1,210 | 64,6% [62,5%; 66,7%], n=2000 | 5,8 pp | 0,0% |
| V1+V2 | 12 | 1 | preparo-1 | 3,96 | 3,44 | 8,59 | 9,89 | 1,151 | 72,5% [70,5%; 74,4%], n=2000 | 1,2 pp | 0,0% |
| V1+V2 | 12 | 1 | recuperacao-1 | 3,92 | 3,48 | 8,67 | 9,76 | 1,125 | 70,9% [68,8%; 72,8%], n=2000 | 1,1 pp | 0,0% |
| V1+V2 | 12 | 1 | habilidade+1 | 4,62 | 3,44 | 7,35 | 9,89 | 1,346 | 73,8% [71,8%; 75,7%], n=2000 | 4,2 pp | 0,0% |
| V1+V2 | 12 | 1 | atributo+1 | 4,78 | 2,30 | 7,11 | 14,81 | 2,083 | 90,7% [89,3%; 91,9%], n=2000 | 2,2 pp | 0,0% |
| V1+V2 | 12 | 3 | ataque+1 | 4,19 | 3,55 | 8,11 | 9,57 | 1,181 | 63,1% [61,0%; 65,2%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 12 | 3 | defesa+1 | 3,81 | 3,10 | 8,93 | 10,96 | 1,227 | 63,3% [61,2%; 65,4%], n=2000 | 4,5 pp | 0,0% |
| V1+V2 | 12 | 3 | dano+1 | 4,15 | 3,59 | 8,20 | 9,48 | 1,156 | 60,8% [58,6%; 62,9%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 12 | 3 | dano+1d6 | 5,63 | 3,41 | 6,04 | 9,98 | 1,652 | 78,6% [76,7%; 80,3%], n=2000 | 2,8 pp | 0,0% |
| V1+V2 | 12 | 3 | absorcao+1 | 3,76 | 3,28 | 9,05 | 10,38 | 1,146 | 60,7% [58,5%; 62,8%], n=2000 | 6,4 pp | 0,0% |
| V1+V2 | 12 | 3 | pv+1 | 3,70 | 3,65 | 9,20 | 9,58 | 1,042 | 53,3% [51,1%; 55,5%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 12 | 3 | pv+5 | 3,77 | 3,57 | 9,02 | 10,91 | 1,210 | 64,6% [62,5%; 66,7%], n=2000 | 5,8 pp | 0,0% |
| V1+V2 | 12 | 3 | preparo-1 | 3,96 | 3,44 | 8,59 | 9,89 | 1,151 | 72,5% [70,5%; 74,4%], n=2000 | 1,2 pp | 0,0% |
| V1+V2 | 12 | 3 | recuperacao-1 | 3,92 | 3,48 | 8,67 | 9,76 | 1,125 | 70,9% [68,8%; 72,8%], n=2000 | 1,1 pp | 0,0% |
| V1+V2 | 12 | 3 | habilidade+1 | 4,62 | 3,44 | 7,35 | 9,89 | 1,346 | 73,8% [71,8%; 75,7%], n=2000 | 4,2 pp | 0,0% |
| V1+V2 | 12 | 3 | atributo+1 | 4,78 | 2,30 | 7,11 | 14,81 | 2,083 | 90,7% [89,3%; 91,9%], n=2000 | 2,2 pp | 0,0% |
| V1+V2 | 12 | 5 | ataque+1 | 4,19 | 3,55 | 8,11 | 9,57 | 1,181 | 63,1% [61,0%; 65,2%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 12 | 5 | defesa+1 | 3,81 | 3,10 | 8,93 | 10,96 | 1,227 | 63,3% [61,2%; 65,4%], n=2000 | 4,5 pp | 0,0% |
| V1+V2 | 12 | 5 | dano+1 | 4,15 | 3,59 | 8,20 | 9,48 | 1,156 | 60,8% [58,6%; 62,9%], n=2000 | 4,1 pp | 0,0% |
| V1+V2 | 12 | 5 | dano+1d6 | 5,63 | 3,41 | 6,04 | 9,98 | 1,652 | 78,6% [76,7%; 80,3%], n=2000 | 2,8 pp | 0,0% |
| V1+V2 | 12 | 5 | absorcao+1 | 3,76 | 3,28 | 9,05 | 10,38 | 1,146 | 60,7% [58,5%; 62,8%], n=2000 | 6,4 pp | 0,0% |
| V1+V2 | 12 | 5 | pv+1 | 3,70 | 3,65 | 9,20 | 9,58 | 1,042 | 53,3% [51,1%; 55,5%], n=2000 | 6,2 pp | 0,0% |
| V1+V2 | 12 | 5 | pv+5 | 3,77 | 3,57 | 9,02 | 10,91 | 1,210 | 64,6% [62,5%; 66,7%], n=2000 | 5,8 pp | 0,0% |
| V1+V2 | 12 | 5 | preparo-1 | 3,96 | 3,44 | 8,59 | 9,89 | 1,151 | 72,5% [70,5%; 74,4%], n=2000 | 1,2 pp | 0,0% |
| V1+V2 | 12 | 5 | recuperacao-1 | 3,92 | 3,48 | 8,67 | 9,76 | 1,125 | 70,9% [68,8%; 72,8%], n=2000 | 1,1 pp | 0,0% |
| V1+V2 | 12 | 5 | habilidade+1 | 4,62 | 3,44 | 7,35 | 9,89 | 1,346 | 73,8% [71,8%; 75,7%], n=2000 | 4,2 pp | 0,0% |
| V1+V2 | 12 | 5 | atributo+1 | 4,78 | 2,30 | 7,11 | 14,81 | 2,083 | 90,7% [89,3%; 91,9%], n=2000 | 2,2 pp | 0,0% |
| V1+V3 | 6 | 1 | ataque+1 | 3,96 | 3,69 | 8,60 | 9,21 | 1,071 | 61,5% [59,3%; 63,6%], n=2000 | 10,9 pp | 0,0% |
| V1+V3 | 6 | 1 | defesa+1 | 3,78 | 3,30 | 8,99 | 10,29 | 1,145 | 65,3% [63,2%; 67,4%], n=2000 | 11,1 pp | 0,0% |
| V1+V3 | 6 | 1 | dano+1 | 3,99 | 3,65 | 8,53 | 9,31 | 1,092 | 66,0% [63,9%; 68,1%], n=2000 | 6,5 pp | 0,0% |
| V1+V3 | 6 | 1 | dano+1d6 | 5,35 | 3,43 | 6,35 | 9,93 | 1,563 | 90,6% [89,2%; 91,8%], n=2000 | 1,0 pp | 0,0% |
| V1+V3 | 6 | 1 | absorcao+1 | 3,72 | 3,61 | 9,13 | 9,41 | 1,030 | 55,3% [53,1%; 57,4%], n=2000 | 15,1 pp | 0,0% |
| V1+V3 | 6 | 1 | pv+1 | 3,73 | 3,69 | 9,11 | 9,48 | 1,041 | 54,9% [52,8%; 57,1%], n=2000 | 13,5 pp | 0,0% |
| V1+V3 | 6 | 1 | pv+5 | 3,79 | 3,64 | 8,98 | 10,71 | 1,193 | 79,6% [77,8%; 81,3%], n=2000 | 4,0 pp | 0,0% |
| V1+V3 | 6 | 1 | preparo-1 | 3,90 | 3,54 | 8,73 | 9,60 | 1,100 | 91,1% [89,8%; 92,3%], n=2000 | 1,6 pp | 0,0% |
| V1+V3 | 6 | 1 | recuperacao-1 | 3,88 | 3,57 | 8,76 | 9,52 | 1,087 | 90,7% [89,3%; 91,9%], n=2000 | 0,8 pp | 0,0% |
| V1+V3 | 6 | 1 | habilidade+1 | 4,09 | 3,65 | 8,31 | 9,31 | 1,120 | 69,7% [67,6%; 71,6%], n=2000 | 10,7 pp | 0,0% |
| V1+V3 | 6 | 1 | atributo+1 | 4,11 | 2,61 | 8,27 | 13,00 | 1,572 | 90,3% [88,9%; 91,5%], n=2000 | 9,9 pp | 0,0% |
| V1+V3 | 6 | 3 | ataque+1 | 3,83 | 3,58 | 8,89 | 9,50 | 1,069 | 59,3% [57,1%; 61,4%], n=2000 | 20,4 pp | 0,0% |
| V1+V3 | 6 | 3 | defesa+1 | 3,67 | 3,21 | 9,27 | 10,59 | 1,142 | 64,1% [62,0%; 66,2%], n=2000 | 16,0 pp | 0,0% |
| V1+V3 | 6 | 3 | dano+1 | 3,72 | 3,61 | 9,13 | 9,41 | 1,030 | 55,3% [53,1%; 57,4%], n=2000 | 15,1 pp | 0,0% |
| V1+V3 | 6 | 3 | dano+1d6 | 4,77 | 3,40 | 7,13 | 10,00 | 1,402 | 86,2% [84,6%; 87,6%], n=2000 | 1,1 pp | 0,0% |
| V1+V3 | 6 | 3 | absorcao+1 | 3,61 | 3,61 | 9,41 | 9,41 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp | 0,0% |
| V1+V3 | 6 | 3 | pv+1 | 3,63 | 3,55 | 9,36 | 9,87 | 1,055 | 53,1% [50,9%; 55,3%], n=2000 | 17,2 pp | 0,0% |
| V1+V3 | 6 | 3 | pv+5 | 3,68 | 3,53 | 9,25 | 11,05 | 1,195 | 79,5% [77,6%; 81,2%], n=2000 | 2,1 pp | 0,0% |
| V1+V3 | 6 | 3 | preparo-1 | 3,78 | 3,41 | 9,01 | 9,97 | 1,107 | 92,6% [91,4%; 93,7%], n=2000 | 0,4 pp | 0,0% |
| V1+V3 | 6 | 3 | recuperacao-1 | 3,77 | 3,46 | 9,02 | 9,82 | 1,089 | 92,0% [90,7%; 93,1%], n=2000 | 0,4 pp | 0,0% |
| V1+V3 | 6 | 3 | habilidade+1 | 3,95 | 3,55 | 8,62 | 9,59 | 1,113 | 66,0% [63,9%; 68,1%], n=2000 | 19,9 pp | 0,0% |
| V1+V3 | 6 | 3 | atributo+1 | 3,96 | 2,52 | 8,59 | 13,49 | 1,571 | 88,5% [87,1%; 89,9%], n=2000 | 13,7 pp | 0,0% |
| V1+V3 | 6 | 5 | ataque+1 | 3,83 | 3,58 | 8,89 | 9,50 | 1,069 | 59,3% [57,1%; 61,4%], n=2000 | 20,4 pp | 0,0% |
| V1+V3 | 6 | 5 | defesa+1 | 3,67 | 3,21 | 9,27 | 10,59 | 1,142 | 64,1% [62,0%; 66,2%], n=2000 | 16,0 pp | 0,0% |
| V1+V3 | 6 | 5 | dano+1 | 3,61 | 3,61 | 9,41 | 9,41 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp | 0,0% |
| V1+V3 | 6 | 5 | dano+1d6 | 4,30 | 3,49 | 7,91 | 9,75 | 1,233 | 77,2% [75,3%; 79,0%], n=2000 | 1,0 pp | 0,0% |
| V1+V3 | 6 | 5 | absorcao+1 | 3,61 | 3,61 | 9,41 | 9,41 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 18,6 pp | 0,0% |
| V1+V3 | 6 | 5 | pv+1 | 3,63 | 3,55 | 9,36 | 9,87 | 1,055 | 53,1% [50,9%; 55,3%], n=2000 | 17,2 pp | 0,0% |
| V1+V3 | 6 | 5 | pv+5 | 3,68 | 3,53 | 9,25 | 11,05 | 1,195 | 79,5% [77,6%; 81,2%], n=2000 | 2,1 pp | 0,0% |
| V1+V3 | 6 | 5 | preparo-1 | 3,78 | 3,41 | 9,01 | 9,97 | 1,107 | 92,6% [91,4%; 93,7%], n=2000 | 0,4 pp | 0,0% |
| V1+V3 | 6 | 5 | recuperacao-1 | 3,77 | 3,46 | 9,02 | 9,82 | 1,089 | 92,0% [90,7%; 93,1%], n=2000 | 0,4 pp | 0,0% |
| V1+V3 | 6 | 5 | habilidade+1 | 3,95 | 3,55 | 8,62 | 9,59 | 1,113 | 66,0% [63,9%; 68,1%], n=2000 | 19,9 pp | 0,0% |
| V1+V3 | 6 | 5 | atributo+1 | 3,96 | 2,52 | 8,59 | 13,49 | 1,571 | 88,5% [87,1%; 89,9%], n=2000 | 13,7 pp | 0,0% |
| V1+V3 | 8 | 1 | ataque+1 | 3,98 | 3,56 | 8,54 | 9,55 | 1,119 | 64,1% [62,0%; 66,2%], n=2000 | 7,5 pp | 0,0% |
| V1+V3 | 8 | 1 | defesa+1 | 3,74 | 3,17 | 9,10 | 10,74 | 1,180 | 64,5% [62,3%; 66,5%], n=2000 | 7,3 pp | 0,0% |
| V1+V3 | 8 | 1 | dano+1 | 4,00 | 3,56 | 8,51 | 9,54 | 1,122 | 63,0% [60,9%; 65,1%], n=2000 | 4,6 pp | 0,0% |
| V1+V3 | 8 | 1 | dano+1d6 | 5,53 | 3,34 | 6,15 | 10,19 | 1,658 | 87,7% [86,2%; 89,1%], n=2000 | 1,6 pp | 0,0% |
| V1+V3 | 8 | 1 | absorcao+1 | 3,69 | 3,41 | 9,22 | 9,98 | 1,082 | 61,9% [59,8%; 64,0%], n=2000 | 4,8 pp | 0,0% |
| V1+V3 | 8 | 1 | pv+1 | 3,65 | 3,63 | 9,31 | 9,65 | 1,037 | 55,8% [53,6%; 58,0%], n=2000 | 6,4 pp | 0,0% |
| V1+V3 | 8 | 1 | pv+5 | 3,73 | 3,54 | 9,12 | 11,01 | 1,207 | 73,3% [71,3%; 75,2%], n=2000 | 1,8 pp | 0,0% |
| V1+V3 | 8 | 1 | preparo-1 | 3,84 | 3,48 | 8,85 | 9,77 | 1,104 | 80,8% [79,1%; 82,5%], n=2000 | 1,7 pp | 0,0% |
| V1+V3 | 8 | 1 | recuperacao-1 | 3,83 | 3,48 | 8,88 | 9,76 | 1,099 | 79,8% [78,0%; 81,5%], n=2000 | 0,0 pp | 0,0% |
| V1+V3 | 8 | 1 | habilidade+1 | 4,22 | 3,49 | 8,05 | 9,74 | 1,210 | 74,1% [72,1%; 75,9%], n=2000 | 8,1 pp | 0,0% |
| V1+V3 | 8 | 1 | atributo+1 | 4,30 | 2,41 | 7,92 | 14,11 | 1,783 | 92,8% [91,5%; 93,8%], n=2000 | 4,1 pp | 0,0% |
| V1+V3 | 8 | 3 | ataque+1 | 3,76 | 3,38 | 9,05 | 10,07 | 1,113 | 63,2% [61,1%; 65,3%], n=2000 | 10,1 pp | 0,0% |
| V1+V3 | 8 | 3 | defesa+1 | 3,54 | 3,01 | 9,61 | 11,28 | 1,173 | 64,8% [62,7%; 66,9%], n=2000 | 6,3 pp | 0,0% |
| V1+V3 | 8 | 3 | dano+1 | 3,69 | 3,41 | 9,22 | 9,98 | 1,082 | 61,9% [59,8%; 64,0%], n=2000 | 4,8 pp | 0,0% |
| V1+V3 | 8 | 3 | dano+1d6 | 4,99 | 3,19 | 6,81 | 10,66 | 1,565 | 87,5% [85,9%; 88,8%], n=2000 | 2,1 pp | 0,0% |
| V1+V3 | 8 | 3 | absorcao+1 | 3,44 | 3,35 | 9,87 | 10,15 | 1,028 | 53,7% [51,5%; 55,9%], n=2000 | 6,0 pp | 0,0% |
| V1+V3 | 8 | 3 | pv+1 | 3,46 | 3,43 | 9,82 | 10,22 | 1,040 | 54,3% [52,1%; 56,5%], n=2000 | 4,2 pp | 0,0% |
| V1+V3 | 8 | 3 | pv+5 | 3,53 | 3,37 | 9,64 | 11,56 | 1,199 | 73,9% [71,9%; 75,7%], n=2000 | 2,5 pp | 0,0% |
| V1+V3 | 8 | 3 | preparo-1 | 3,66 | 3,27 | 9,29 | 10,40 | 1,119 | 85,0% [83,3%; 86,4%], n=2000 | 0,3 pp | 0,0% |
| V1+V3 | 8 | 3 | recuperacao-1 | 3,64 | 3,30 | 9,34 | 10,30 | 1,103 | 82,8% [81,1%; 84,4%], n=2000 | 0,4 pp | 0,0% |
| V1+V3 | 8 | 3 | habilidade+1 | 3,97 | 3,32 | 8,57 | 10,24 | 1,196 | 74,3% [72,3%; 76,1%], n=2000 | 9,9 pp | 0,0% |
| V1+V3 | 8 | 3 | atributo+1 | 4,02 | 2,30 | 8,46 | 14,78 | 1,746 | 93,7% [92,5%; 94,6%], n=2000 | 3,5 pp | 0,0% |
| V1+V3 | 8 | 5 | ataque+1 | 3,64 | 3,27 | 9,34 | 10,40 | 1,114 | 63,3% [61,2%; 65,4%], n=2000 | 9,7 pp | 0,0% |
| V1+V3 | 8 | 5 | defesa+1 | 3,43 | 2,93 | 9,91 | 11,60 | 1,170 | 64,5% [62,3%; 66,5%], n=2000 | 5,7 pp | 0,0% |
| V1+V3 | 8 | 5 | dano+1 | 3,44 | 3,35 | 9,87 | 10,15 | 1,028 | 53,7% [51,5%; 55,9%], n=2000 | 6,0 pp | 0,0% |
| V1+V3 | 8 | 5 | dano+1d6 | 4,44 | 3,17 | 7,65 | 10,72 | 1,402 | 81,3% [79,5%; 82,9%], n=2000 | 3,4 pp | 0,0% |
| V1+V3 | 8 | 5 | absorcao+1 | 3,34 | 3,34 | 10,17 | 10,17 | 1,000 | 50,0% [47,8%; 52,2%], n=2000 | 6,4 pp | 0,0% |
| V1+V3 | 8 | 5 | pv+1 | 3,39 | 3,28 | 10,04 | 10,68 | 1,064 | 53,6% [51,4%; 55,8%], n=2000 | 6,4 pp | 0,0% |
| V1+V3 | 8 | 5 | pv+5 | 3,43 | 3,26 | 9,93 | 11,95 | 1,204 | 73,0% [71,0%; 74,9%], n=2000 | 1,7 pp | 0,0% |
| V1+V3 | 8 | 5 | preparo-1 | 3,55 | 3,16 | 9,57 | 10,77 | 1,126 | 84,7% [83,1%; 86,2%], n=2000 | 0,0 pp | 0,0% |
| V1+V3 | 8 | 5 | recuperacao-1 | 3,54 | 3,19 | 9,60 | 10,65 | 1,109 | 83,7% [82,0%; 85,2%], n=2000 | 0,5 pp | 0,0% |
| V1+V3 | 8 | 5 | habilidade+1 | 3,84 | 3,21 | 8,86 | 10,59 | 1,195 | 73,4% [71,4%; 75,3%], n=2000 | 11,2 pp | 0,0% |
| V1+V3 | 8 | 5 | atributo+1 | 3,88 | 2,23 | 8,77 | 15,28 | 1,743 | 92,5% [91,3%; 93,6%], n=2000 | 4,1 pp | 0,0% |
| V1+V3 | 12 | 1 | ataque+1 | 4,19 | 3,55 | 8,11 | 9,57 | 1,181 | 63,1% [61,0%; 65,2%], n=2000 | 4,1 pp | 0,0% |
| V1+V3 | 12 | 1 | defesa+1 | 3,81 | 3,10 | 8,93 | 10,96 | 1,227 | 63,3% [61,2%; 65,4%], n=2000 | 4,5 pp | 0,0% |
| V1+V3 | 12 | 1 | dano+1 | 4,15 | 3,59 | 8,20 | 9,48 | 1,156 | 60,8% [58,6%; 62,9%], n=2000 | 4,1 pp | 0,0% |
| V1+V3 | 12 | 1 | dano+1d6 | 5,63 | 3,41 | 6,04 | 9,98 | 1,652 | 78,6% [76,7%; 80,3%], n=2000 | 2,8 pp | 0,0% |
| V1+V3 | 12 | 1 | absorcao+1 | 3,76 | 3,28 | 9,05 | 10,38 | 1,146 | 60,7% [58,5%; 62,8%], n=2000 | 6,4 pp | 0,0% |
| V1+V3 | 12 | 1 | pv+1 | 3,70 | 3,65 | 9,20 | 9,58 | 1,042 | 53,3% [51,1%; 55,5%], n=2000 | 6,2 pp | 0,0% |
| V1+V3 | 12 | 1 | pv+5 | 3,77 | 3,57 | 9,02 | 10,91 | 1,210 | 64,6% [62,5%; 66,7%], n=2000 | 5,8 pp | 0,0% |
| V1+V3 | 12 | 1 | preparo-1 | 3,96 | 3,44 | 8,59 | 9,89 | 1,151 | 72,5% [70,5%; 74,4%], n=2000 | 1,2 pp | 0,0% |
| V1+V3 | 12 | 1 | recuperacao-1 | 3,92 | 3,48 | 8,67 | 9,76 | 1,125 | 70,9% [68,8%; 72,8%], n=2000 | 1,1 pp | 0,0% |
| V1+V3 | 12 | 1 | habilidade+1 | 4,62 | 3,44 | 7,35 | 9,89 | 1,346 | 73,8% [71,8%; 75,7%], n=2000 | 4,2 pp | 0,0% |
| V1+V3 | 12 | 1 | atributo+1 | 4,78 | 2,30 | 7,11 | 14,81 | 2,083 | 90,7% [89,3%; 91,9%], n=2000 | 2,2 pp | 0,0% |
| V1+V3 | 12 | 3 | ataque+1 | 3,82 | 3,24 | 8,89 | 10,49 | 1,180 | 63,5% [61,4%; 65,6%], n=2000 | 6,6 pp | 0,0% |
| V1+V3 | 12 | 3 | defesa+1 | 3,48 | 2,85 | 9,76 | 11,95 | 1,223 | 64,6% [62,5%; 66,7%], n=2000 | 3,7 pp | 0,0% |
| V1+V3 | 12 | 3 | dano+1 | 3,76 | 3,28 | 9,05 | 10,38 | 1,146 | 60,7% [58,5%; 62,8%], n=2000 | 6,4 pp | 0,0% |
| V1+V3 | 12 | 3 | dano+1d6 | 5,12 | 3,12 | 6,64 | 10,90 | 1,642 | 80,5% [78,7%; 82,1%], n=2000 | 2,1 pp | 0,0% |
| V1+V3 | 12 | 3 | absorcao+1 | 3,41 | 3,07 | 9,97 | 11,07 | 1,110 | 58,6% [56,4%; 60,7%], n=2000 | 4,3 pp | 0,0% |
| V1+V3 | 12 | 3 | pv+1 | 3,37 | 3,35 | 10,08 | 10,45 | 1,037 | 53,4% [51,2%; 55,6%], n=2000 | 5,8 pp | 0,0% |
| V1+V3 | 12 | 3 | pv+5 | 3,45 | 3,27 | 9,86 | 11,92 | 1,209 | 66,0% [63,9%; 68,1%], n=2000 | 4,5 pp | 0,0% |
| V1+V3 | 12 | 3 | preparo-1 | 3,62 | 3,14 | 9,39 | 10,81 | 1,152 | 74,6% [72,6%; 76,4%], n=2000 | 1,5 pp | 0,0% |
| V1+V3 | 12 | 3 | recuperacao-1 | 3,60 | 3,19 | 9,43 | 10,67 | 1,131 | 73,1% [71,1%; 75,0%], n=2000 | 0,0 pp | 0,0% |
| V1+V3 | 12 | 3 | habilidade+1 | 4,18 | 3,15 | 8,14 | 10,80 | 1,326 | 73,9% [71,9%; 75,7%], n=2000 | 6,5 pp | 0,0% |
| V1+V3 | 12 | 3 | atributo+1 | 4,30 | 2,12 | 7,90 | 16,07 | 2,035 | 91,3% [90,0%; 92,5%], n=2000 | 2,1 pp | 0,0% |
| V1+V3 | 12 | 5 | ataque+1 | 3,52 | 3,03 | 9,67 | 11,21 | 1,159 | 62,7% [60,6%; 64,8%], n=2000 | 5,2 pp | 0,0% |
| V1+V3 | 12 | 5 | defesa+1 | 3,23 | 2,66 | 10,52 | 12,76 | 1,212 | 64,6% [62,5%; 66,7%], n=2000 | 4,5 pp | 0,0% |
| V1+V3 | 12 | 5 | dano+1 | 3,41 | 3,07 | 9,97 | 11,07 | 1,110 | 58,6% [56,4%; 60,7%], n=2000 | 4,3 pp | 0,0% |
| V1+V3 | 12 | 5 | dano+1d6 | 4,67 | 2,91 | 7,28 | 11,68 | 1,603 | 79,9% [78,1%; 81,6%], n=2000 | 3,6 pp | 0,0% |
| V1+V3 | 12 | 5 | absorcao+1 | 3,18 | 2,92 | 10,70 | 11,64 | 1,089 | 59,1% [56,9%; 61,2%], n=2000 | 3,9 pp | 0,0% |
| V1+V3 | 12 | 5 | pv+1 | 3,13 | 3,11 | 10,85 | 11,24 | 1,036 | 53,3% [51,1%; 55,5%], n=2000 | 5,6 pp | 0,0% |
| V1+V3 | 12 | 5 | pv+5 | 3,22 | 3,05 | 10,56 | 12,81 | 1,212 | 67,5% [65,4%; 69,5%], n=2000 | 3,4 pp | 0,0% |
| V1+V3 | 12 | 5 | preparo-1 | 3,37 | 2,93 | 10,08 | 11,59 | 1,150 | 75,9% [74,0%; 77,7%], n=2000 | 3,0 pp | 0,0% |
| V1+V3 | 12 | 5 | recuperacao-1 | 3,34 | 2,97 | 10,19 | 11,43 | 1,121 | 73,5% [71,5%; 75,3%], n=2000 | 0,1 pp | 0,0% |
| V1+V3 | 12 | 5 | habilidade+1 | 3,85 | 2,93 | 8,84 | 11,59 | 1,311 | 73,6% [71,6%; 75,4%], n=2000 | 6,9 pp | 0,0% |
| V1+V3 | 12 | 5 | atributo+1 | 3,96 | 1,99 | 8,58 | 17,05 | 1,987 | 92,3% [91,1%; 93,4%], n=2000 | 1,7 pp | 0,0% |


## 7. F · Variante D7, +2 por Centelha

Variante injetada como +C adicional em ataque e Defesa, além do +C vivo. Equipamento de referência: espada longa e gambeson.

| soma | confronto | força relativa | vitória X+1, IC95% | viés | censura |
|---|---|---|---|---|---|
| 6 | 1×0 | 1,402 | 79,3% [77,5%; 81,1%], n=2000 | 3,1 pp | 0,0% |
| 6 | 2×1 | 1,152 | 60,3% [58,1%; 62,4%], n=2000 | 0,2 pp | 0,0% |
| 6 | 3×2 | 0,955 | 36,4% [34,4%; 38,6%], n=2000 | -0,5 pp | 0,0% |
| 6 | 4×3 | 0,862 | 20,6% [18,9%; 22,4%], n=2000 | 0,0 pp | 0,0% |
| 6 | 5×4 | 0,899 | 24,4% [22,6%; 26,4%], n=2000 | -3,1 pp | 0,0% |
| 6 | 6×5 | 0,856 | 0,0% [0,0%; 0,2%], n=2000 | 0,0 pp | 0,0% |
| 8 | 1×0 | 1,886 | 94,0% [92,9%; 95,0%], n=2000 | 1,6 pp | 0,0% |
| 8 | 2×1 | 1,568 | 85,4% [83,7%; 86,8%], n=2000 | 0,1 pp | 0,0% |
| 8 | 3×2 | 1,293 | 72,3% [70,2%; 74,2%], n=2000 | -0,3 pp | 0,0% |
| 8 | 4×3 | 1,042 | 50,2% [48,0%; 52,4%], n=2000 | 1,8 pp | 0,0% |
| 8 | 5×4 | 0,896 | 30,0% [28,1%; 32,1%], n=2000 | -2,5 pp | 0,0% |
| 8 | 6×5 | 0,876 | 25,4% [23,6%; 27,4%], n=2000 | -5,7 pp | 0,0% |
| 12 | 1×0 | 2,422 | 95,3% [94,2%; 96,1%], n=2000 | 1,5 pp | 0,0% |
| 12 | 2×1 | 2,325 | 96,1% [95,2%; 96,9%], n=2000 | 1,0 pp | 0,0% |
| 12 | 3×2 | 2,163 | 95,0% [93,9%; 95,8%], n=2000 | 1,1 pp | 0,0% |
| 12 | 4×3 | 1,859 | 91,3% [89,9%; 92,4%], n=2000 | 2,7 pp | 0,0% |
| 12 | 5×4 | 1,557 | 83,4% [81,7%; 85,0%], n=2000 | -2,0 pp | 0,0% |
| 12 | 6×5 | 1,298 | 71,8% [69,7%; 73,7%], n=2000 | 0,9 pp | 0,0% |


## 8. Onde as camadas divergem

| soma | C | dano ex. DV0 | dano ex. DV4 | dano fiel | ações p50 ex0/ex4/fiel | censura |
|---|---|---|---|---|---|---|
| 6 | 1 | 2,09 | 1,97 | 2,09 | 17/18/15 | 0,0% |
| 6 | 3 | 1,65 | 0,99 | 1,30 | 21/35/24 | 0,0% |
| 6 | 5 | 1,46 | 0,57 | 0,62 | 24/61/31 | 20,2% |
| 8 | 1 | 2,15 | 2,64 | 2,47 | 16/13/12 | 0,0% |
| 8 | 3 | 1,65 | 1,50 | 1,60 | 21/23/19 | 0,0% |
| 8 | 5 | 1,37 | 0,87 | 1,08 | 25/40/29 | 0,0% |
| 12 | 1 | 2,33 | 3,74 | 3,14 | 15/9/9 | 0,0% |
| 12 | 3 | 1,77 | 2,47 | 2,18 | 20/14/13 | 0,0% |
| 12 | 5 | 1,35 | 1,51 | 1,46 | 26/23/20 | 0,0% |


A camada exata com Defesa cheia subestima acerto e dano sempre que a perda real é negativa. Usar perda fixa 4 aproxima alguns pontos, mas apaga a distribuição, a escalada de Pressão, o momento do ciclo e o ferimento. “Censura” é a fração que não chegou a uma queda em 1.000 Ticks; essas lutas não entram nos percentis nem são contadas como derrota. A camada rápida serve para varrer direção e ordenar alavancas; níveis finais precisam dos pontos fiéis.

### Leitura para a revisão do simulador

- A perda de Defesa não é uma constante 4: no duelo sua mediana foi 2; no 1 contra 3, 4, com p90 8. A aproximação fixa depende do formato do encontro.
- Há células em que a espada longa não atravessa a combinação de Absorção e Quase-Acerto o bastante para encerrar a luta. A censura é resultado, não zero nem derrota.
- Aumentar Ataque ou Habilidade pode reduzir a chance de vitória em certas células: um raspão causa dano fixo ignorando Absorção, enquanto um acerto fraco sofre Absorção e pode causar zero. O simulador preserva essa descontinuidade da regra viva; a Revisora deve confirmar que ela é intencional antes de usar a alavanca de ataque como moeda monotônica.
- +1d6 de dano foi muito mais forte que +1 fixo nas células de referência. A razão varia com Absorção, portanto não existe conversão universal entre dado e ponto.
- A antiga razão pela contagem de golpes do vencedor foi removida. Ela media duração da luta e podia dizer que +5 PV enfraquecia uma peça que vencia mais.

## 9. Procedência e conferência

- `node scripts/sim/calibrar.mjs --teste`: três golpes determinísticos conferidos contra `resolverGolpe` (erro, raspão, acerto com Margem) e dois pontos de distribuição em que a camada rápida e o resolvedor usado pela camada fiel concordam exatamente, por enumeração direta através de `lance.ts`.
- `node scripts/sim/calibrar.mjs --n 1000`: comando desta medição; cada célula de duelo executa 1000 lutas por orientação.
- Pressão sem teto é a regra viva; −4 e −6 são somente variantes locais.
- V1, V2 e V3 são cenários locais da bancada. Nenhum deles altera `calc.ts`, `lance.ts` ou os dados do jogo.
- Nenhum valor de Proeza foi aplicado e nenhum catálogo foi modificado.

**Parada:** esta é a linha de base para revisão do simulador. As taxas de câmbio não devem ser decididas antes da conferência da Revisora.
