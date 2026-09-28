# 15 · Linha de base do combate no motor real

27/09/2026 · **RASCUNHO DE MEDIÇÃO**, regenerado com a Regra do Quase-Acerto (item 2) e o
conserto do Simultâneo (item 3) já na regra viva. Nada deste relatório vale para preço antes da
conferência da Revisora. 1000 lutas em cada orientação de cada célula, semente mestre 20260927.

**28/09/2026 · três consertos na bancada**, achados pelo autor lendo esta página (despacho
`docs/simulacao/caixa/bancada-tres-consertos-despacho.md`): a força por Tick passou a usar o
ciclo da peça DEPOIS do ajuste de `preparo-1`/`recuperacao-1` (item 1); a alavanca
`atributo+1-destreza-espada` voltou à tabela E (item 2); o teto de Pressão da seção D foi
confirmado ligado ao motor, mas nunca chega perto de −4/−6 nesta cena (item 3, distribuição no
relato da Executora). Só as seções **E, 6a e D** foram recalculadas com a regra nova; **A, B, C
e 6b (Briga × Armas) são as MESMAS do commit anterior**, copiadas sem mudar valor.

## Resumo para a Revisora

Os cenários locais V1/V2/V3 da rodada anterior saíram: a regra viva agora é a que estava em V1
(o acerto nunca dói menos que o raspão do mesmo golpe), incondicional em `resolverGolpe`
(`src/lib/lance.ts`), e a Redução da armadura leve também desconta o raspão (a Centelha do
alvo entra na conta, item 2a). Não existe mais variante de Absorção por tipo de dano: a Centelha
soma na Absorção normal dos três tipos, como sempre fez.

“Imunidade” nesta página significa uma luta que não terminou em 1.000 Ticks, não invulnerabilidade
matemática. A duração usa a ficha intermediária, soma 8 e gambeson; cada célula contém 2000
lutas, metade em cada orientação.

| mediana espada por C | mediana montante por C | pior espada×malha |
|---|---|---|
| C0 10; C1 13; C2 20; C3 44; C4 89 (0,6% cens.); C5 n/c (100,0% cens.); C6 n/c (100,0% cens.) | C0 4; C1 5; C2 5; C3 6; C4 7; C5 8; C6 10 | 100,0% |


O teste de monotonicidade abaixo usa a força por Tick (item 6b). “Sim” exige que +1 Ataque reduza
os Ticks necessários de A em todas as nove células de soma 6/8/12 e Centelha 1/3/5.

| +1 Ataque sempre positivo? | células positivas | falhas |
|---|---|---|
| não | 8/9 | S6 C5 |


**Viés de lado (item 6d, depois do conserto do item 3):** a coluna "viés" de cada tabela abaixo é
a chance de A vencer no lado `a` menos a chance de vencer no lado `b`. O conserto do item 3
(quem estava de pé solta todos os golpes do Tick em que caiu) tira uma fonte de assimetria entre
as duas orientações do mesmo duelo espelhado; o esperado é que o viés observado agora seja menor
que numa medição equivalente antes do conserto. Este relatório não guarda a medição ANTES (a
rodada anterior media outra coisa, os cenários V1/V2/V3), então a comparação fica para quem tiver
os dois números lado a lado.

## 1. Método e limites

Fichas sem Proezas: soma 6/8/12 dividida igualmente entre Atributo e Habilidade; Vigor 3; mesma
ficha em C0–C6. A espada longa ocupa uma mão, com adaga inativa na outra apenas para acionar a
fórmula viva de uma mão; Montante usa duas. Armadura nenhuma/Gambeson/Malha. Todos começam
adjacentes; a luta vai até um lado cair, sem fuga ou desistência automáticas. Empate de iniciativa
varia pela semente.

Camada exata: Defesa cheia e golpes independentes, mas preserva pool, paridade, Acerto da arma,
Margens, Quase-Acerto, dano e Absorção. Ela não modela P/G/R, Pressão, ferimentos, iniciativa ou
simultaneidade, e roda com a Centelha do alvo zerada (não carrega um segundo lado na conta
manual). Camada fiel: todas essas regras operam, com a Centelha de verdade dos dois lados.
“Ações até cair” mede duração e aparece apenas como duração, nunca como força.

Cada duelo roda duas bancadas: A no lado `a` e A no lado `b`. A chance publicada reúne as duas
orientações e traz intervalo de confiança de Wilson de 95%. O viés é a chance de A vencer no lado
`a` menos a chance de vencer no lado `b`. Lutas censuradas ficam fora da chance, mas sua fração
é publicada.

**A força por Tick (item 6b, a métrica principal agora)** usa todos os golpes das mesmas lutas
espelhadas, do mesmo jeito que a força por tentativa (mantida ao lado, marcada com ⚑ quando as
duas discordam muito): para cada direção, dano médio por tentativa dividido pelas tentativas
daquela direção dá o dano médio; PV iniciais do alvo dividido por esse dano médio dá as
TENTATIVAS necessárias; essa contagem multiplicada pelo CICLO do atacante (Preparo + Golpe +
Recuperação de um ataque simples, em Ticks, por `combate-tempo.ts`'s `anatomia`) dá os TICKS
necessários. Força relativa por Tick = Ticks que B precisa para derrubar A dividido pelos Ticks
que A precisa para derrubar B. Valor 1 é igualdade; acima de 1 favorece A. A força por tentativa
(a métrica antiga) é a mesma conta sem o ciclo, e as duas discordam sobretudo quando as armas têm
ciclos diferentes (a pesada bate mais forte por golpe, mas gasta mais Ticks por golpe): a coluna
⚑ marca essa discordância.

Os documentos de referência usados estão em `docs/calibracao/09-inventario-calculos.md` e
`14-levantamento-pesos.md`.

## 2. A · Defesa perdida no golpe

Valores são módulos positivos da perda total P/G/R + Pressão observada na entrada real de
`resolverGolpe`.

| formato | soma | C | média | p10/p50/p90 | golpes |
|---|---|---|---|---|---|
| duelo | 6 | 1 | 2,38 | 2/2/4 | 28983 |
| duelo | 6 | 3 | 2,34 | 2/2/4 | 165543 |
| duelo | 6 | 5 | 2,40 | 2/2/4 | 286000 |
| duelo | 8 | 1 | 2,37 | 2/2/4 | 26108 |
| duelo | 8 | 3 | 2,34 | 2/2/4 | 89389 |
| duelo | 8 | 5 | 2,40 | 2/2/4 | 286000 |
| duelo | 12 | 1 | 2,36 | 2/2/4 | 20705 |
| duelo | 12 | 3 | 2,33 | 2/2/4 | 42248 |
| duelo | 12 | 5 | 2,33 | 2/2/4 | 107417 |
| 1 contra 3 | 6 | 1 | 4,55 | 2/4/8 | 19679 |
| 1 contra 3 | 6 | 3 | 4,59 | 2/4/8 | 101723 |
| 1 contra 3 | 6 | 5 | 4,60 | 2/4/8 | 572000 |
| 1 contra 3 | 8 | 1 | 4,54 | 2/4/8 | 17350 |
| 1 contra 3 | 8 | 3 | 4,57 | 2/4/8 | 54134 |
| 1 contra 3 | 8 | 5 | 4,59 | 2/4/8 | 313169 |
| 1 contra 3 | 12 | 1 | 4,51 | 2/4/8 | 13389 |
| 1 contra 3 | 12 | 3 | 4,55 | 2/4/8 | 24928 |
| 1 contra 3 | 12 | 5 | 4,57 | 2/4/8 | 59566 |

## 3. B · Linha de base entre iguais

| soma | C | arma | armadura | acerto | raspão | ações p10/p50/p90 | censura | vitória A, IC95% | viés |
|---|---|---|---|---|---|---|---|---|---|
| 6 | 0 | espada-longa | nenhuma | 63,2% | 18,6% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,6 pp |
| 6 | 0 | espada-longa | gambeson | 64,4% | 25,9% | 9/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -10,6 pp |
| 6 | 0 | espada-longa | malha | 64,0% | 29,3% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,8 pp |
| 6 | 0 | montante | nenhuma | 52,5% | 10,6% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| 6 | 0 | montante | gambeson | 52,2% | 20,7% | 4/5/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,8 pp |
| 6 | 0 | montante | malha | 52,5% | 29,1% | 5/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| 6 | 1 | espada-longa | nenhuma | 63,3% | 18,6% | 6/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| 6 | 1 | espada-longa | gambeson | 65,0% | 25,5% | 13/15/17 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -4,6 pp |
| 6 | 1 | espada-longa | malha | 64,3% | 29,2% | 63/82/105 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,2 pp |
| 6 | 1 | montante | nenhuma | 52,8% | 10,5% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,8 pp |
| 6 | 1 | montante | gambeson | 52,4% | 20,9% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,6 pp |
| 6 | 1 | montante | malha | 53,0% | 28,4% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,8 pp |
| 6 | 2 | espada-longa | nenhuma | 63,4% | 18,3% | 7/9/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -4,2 pp |
| 6 | 2 | espada-longa | gambeson | 65,3% | 25,5% | 21/25/28 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,0 pp |
| 6 | 2 | espada-longa | malha | 66,1% | 29,4% | 128/141/143 | 99,7% | 50,0% [18,8%; 81,2%], n=6 | 33,3 pp |
| 6 | 2 | montante | nenhuma | 52,4% | 10,9% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 7,2 pp |
| 6 | 2 | montante | gambeson | 52,4% | 20,6% | 5/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| 6 | 2 | montante | malha | 53,0% | 28,3% | 6/9/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| 6 | 3 | espada-longa | nenhuma | 63,5% | 18,4% | 9/11/14 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| 6 | 3 | espada-longa | gambeson | 64,3% | 24,5% | 63/82/105 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,2 pp |
| 6 | 3 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| 6 | 3 | montante | nenhuma | 52,2% | 11,3% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| 6 | 3 | montante | gambeson | 52,8% | 20,4% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| 6 | 3 | montante | malha | 53,0% | 28,3% | 8/11/16 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,6 pp |
| 6 | 4 | espada-longa | nenhuma | 63,8% | 18,1% | 12/16/22 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,6 pp |
| 6 | 4 | espada-longa | gambeson | 66,1% | 25,3% | 128/141/143 | 99,7% | 50,0% [18,8%; 81,2%], n=6 | 33,3 pp |
| 6 | 4 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| 6 | 4 | montante | nenhuma | 52,4% | 11,1% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| 6 | 4 | montante | gambeson | 53,0% | 20,1% | 6/9/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,8 pp |
| 6 | 4 | montante | malha | 52,8% | 28,7% | 10/15/21 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| 6 | 5 | espada-longa | nenhuma | 63,8% | 18,0% | 18/24/32 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,4 pp |
| 6 | 5 | espada-longa | gambeson | 66,7% | 25,5% | não concluiu | 100,0% | n/d | n/d |
| 6 | 5 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| 6 | 5 | montante | nenhuma | 52,3% | 11,0% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 6,2 pp |
| 6 | 5 | montante | gambeson | 53,0% | 20,1% | 8/11/16 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,6 pp |
| 6 | 5 | montante | malha | 53,0% | 28,6% | 14/20/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,0 pp |
| 6 | 6 | espada-longa | nenhuma | 64,0% | 18,2% | 30/41/53 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,8 pp |
| 6 | 6 | espada-longa | gambeson | 66,7% | 25,5% | não concluiu | 100,0% | n/d | n/d |
| 6 | 6 | espada-longa | malha | 66,7% | 29,4% | não concluiu | 100,0% | n/d | n/d |
| 6 | 6 | montante | nenhuma | 52,8% | 10,8% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| 6 | 6 | montante | gambeson | 52,8% | 20,3% | 10/15/21 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| 6 | 6 | montante | malha | 52,9% | 28,6% | 20/29/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,2 pp |
| 8 | 0 | espada-longa | nenhuma | 57,2% | 18,2% | 5/6/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,2 pp |
| 8 | 0 | espada-longa | gambeson | 57,7% | 25,9% | 8/10/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -5,8 pp |
| 8 | 0 | espada-longa | malha | 57,9% | 30,3% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| 8 | 0 | montante | nenhuma | 47,9% | 9,7% | 3/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,4 pp |
| 8 | 0 | montante | gambeson | 48,1% | 18,6% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,0 pp |
| 8 | 0 | montante | malha | 47,8% | 27,4% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,6 pp |
| 8 | 1 | espada-longa | nenhuma | 57,7% | 17,7% | 5/7/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,4 pp |
| 8 | 1 | espada-longa | gambeson | 57,9% | 25,7% | 11/13/16 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -7,0 pp |
| 8 | 1 | espada-longa | malha | 58,0% | 30,8% | 32/44/59 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| 8 | 1 | montante | nenhuma | 48,0% | 9,4% | 3/4/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 3,8 pp |
| 8 | 1 | montante | gambeson | 48,1% | 18,6% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,2 pp |
| 8 | 1 | montante | malha | 47,7% | 27,1% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,8 pp |
| 8 | 2 | espada-longa | nenhuma | 57,9% | 17,5% | 6/8/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,4 pp |
| 8 | 2 | espada-longa | gambeson | 58,5% | 25,3% | 16/20/25 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,4 pp |
| 8 | 2 | espada-longa | malha | 58,3% | 30,7% | 67/89/116 | 0,6% | 50,0% [47,8%; 52,2%], n=1988 | 1,2 pp |
| 8 | 2 | montante | nenhuma | 48,3% | 9,4% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,4 pp |
| 8 | 2 | montante | gambeson | 48,0% | 18,6% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 4,4 pp |
| 8 | 2 | montante | malha | 47,6% | 27,4% | 5/7/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,2 pp |
| 8 | 3 | espada-longa | nenhuma | 57,7% | 17,9% | 7/10/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,2 pp |
| 8 | 3 | espada-longa | gambeson | 58,0% | 25,1% | 32/44/59 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,4 pp |
| 8 | 3 | espada-longa | malha | 59,2% | 31,9% | não concluiu | 100,0% | n/d | n/d |
| 8 | 3 | montante | nenhuma | 48,1% | 9,8% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 5,2 pp |
| 8 | 3 | montante | gambeson | 47,7% | 18,7% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,6 pp |
| 8 | 3 | montante | malha | 47,7% | 27,4% | 6/8/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,8 pp |
| 8 | 4 | espada-longa | nenhuma | 57,6% | 17,8% | 9/13/17 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,0 pp |
| 8 | 4 | espada-longa | gambeson | 58,3% | 25,0% | 67/89/116 | 0,6% | 50,0% [47,8%; 52,2%], n=1988 | 1,2 pp |
| 8 | 4 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| 8 | 4 | montante | nenhuma | 48,1% | 10,2% | 3/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| 8 | 4 | montante | gambeson | 47,6% | 18,8% | 5/7/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| 8 | 4 | montante | malha | 47,6% | 27,5% | 7/10/15 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,0 pp |
| 8 | 5 | espada-longa | nenhuma | 57,6% | 17,8% | 13/18/24 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| 8 | 5 | espada-longa | gambeson | 59,2% | 26,4% | não concluiu | 100,0% | n/d | n/d |
| 8 | 5 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| 8 | 5 | montante | nenhuma | 48,0% | 9,9% | 4/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,2 pp |
| 8 | 5 | montante | gambeson | 47,7% | 18,8% | 6/8/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,8 pp |
| 8 | 5 | montante | malha | 47,5% | 27,7% | 9/13/18 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| 8 | 6 | espada-longa | nenhuma | 57,9% | 17,6% | 19/26/35 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,6 pp |
| 8 | 6 | espada-longa | gambeson | 59,5% | 26,6% | não concluiu | 100,0% | n/d | n/d |
| 8 | 6 | espada-longa | malha | 59,5% | 32,1% | não concluiu | 100,0% | n/d | n/d |
| 8 | 6 | montante | nenhuma | 47,8% | 10,0% | 4/6/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,8 pp |
| 8 | 6 | montante | gambeson | 47,6% | 19,1% | 7/10/15 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,0 pp |
| 8 | 6 | montante | malha | 47,8% | 27,7% | 11/16/23 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,8 pp |
| 12 | 0 | espada-longa | nenhuma | 48,5% | 15,9% | 4/5/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,2 pp |
| 12 | 0 | espada-longa | gambeson | 48,0% | 23,9% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,2 pp |
| 12 | 0 | espada-longa | malha | 48,4% | 30,3% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,6 pp |
| 12 | 0 | montante | nenhuma | 39,6% | 8,8% | 2/3/5 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,8 pp |
| 12 | 0 | montante | gambeson | 39,9% | 16,8% | 3/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,0 pp |
| 12 | 0 | montante | malha | 39,8% | 24,4% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,8 pp |
| 12 | 1 | espada-longa | nenhuma | 48,4% | 16,0% | 4/6/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| 12 | 1 | espada-longa | gambeson | 48,4% | 23,8% | 8/10/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| 12 | 1 | espada-longa | malha | 48,3% | 30,4% | 15/21/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,0 pp |
| 12 | 1 | montante | nenhuma | 39,5% | 9,0% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,4 pp |
| 12 | 1 | montante | gambeson | 39,9% | 16,8% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| 12 | 1 | montante | malha | 39,6% | 24,8% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,4 pp |
| 12 | 2 | espada-longa | nenhuma | 48,2% | 16,0% | 5/7/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,2 pp |
| 12 | 2 | espada-longa | gambeson | 48,5% | 23,8% | 10/14/18 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,8 pp |
| 12 | 2 | espada-longa | malha | 48,4% | 30,4% | 23/31/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| 12 | 2 | montante | nenhuma | 39,3% | 8,9% | 2/3/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,0 pp |
| 12 | 2 | montante | gambeson | 39,7% | 16,9% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 2,0 pp |
| 12 | 2 | montante | malha | 39,6% | 24,7% | 3/5/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,4 pp |
| 12 | 3 | espada-longa | nenhuma | 48,2% | 16,2% | 6/8/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,2 pp |
| 12 | 3 | espada-longa | gambeson | 48,3% | 23,8% | 15/21/29 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,0 pp |
| 12 | 3 | espada-longa | malha | 48,5% | 30,8% | 38/53/71 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,4 pp |
| 12 | 3 | montante | nenhuma | 39,9% | 8,5% | 2/4/6 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,4 pp |
| 12 | 3 | montante | gambeson | 39,6% | 16,8% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -4,8 pp |
| 12 | 3 | montante | malha | 39,4% | 25,0% | 4/6/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,4 pp |
| 12 | 4 | espada-longa | nenhuma | 48,4% | 16,3% | 7/9/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,6 pp |
| 12 | 4 | espada-longa | gambeson | 48,4% | 23,8% | 23/31/42 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -0,2 pp |
| 12 | 4 | espada-longa | malha | 48,5% | 31,0% | 78/105/130 | 9,2% | 50,0% [47,7%; 52,3%], n=1816 | -0,4 pp |
| 12 | 4 | montante | nenhuma | 40,2% | 8,3% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 1,4 pp |
| 12 | 4 | montante | gambeson | 39,7% | 16,7% | 3/5/9 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,4 pp |
| 12 | 4 | montante | malha | 39,5% | 24,9% | 4/7/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| 12 | 5 | espada-longa | nenhuma | 48,3% | 16,4% | 8/11/16 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,2 pp |
| 12 | 5 | espada-longa | gambeson | 48,5% | 24,1% | 38/53/71 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,4 pp |
| 12 | 5 | espada-longa | malha | 48,8% | 32,6% | não concluiu | 100,0% | n/d | n/d |
| 12 | 5 | montante | nenhuma | 39,9% | 8,5% | 3/4/7 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -2,0 pp |
| 12 | 5 | montante | gambeson | 39,4% | 16,9% | 4/6/10 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,4 pp |
| 12 | 5 | montante | malha | 39,5% | 24,6% | 5/8/12 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -4,4 pp |
| 12 | 6 | espada-longa | nenhuma | 48,4% | 16,3% | 11/15/20 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -3,6 pp |
| 12 | 6 | espada-longa | gambeson | 48,5% | 24,3% | 78/105/130 | 9,2% | 50,0% [47,7%; 52,3%], n=1816 | -0,4 pp |
| 12 | 6 | espada-longa | malha | 48,8% | 32,7% | não concluiu | 100,0% | n/d | n/d |
| 12 | 6 | montante | nenhuma | 39,8% | 8,4% | 3/5/8 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | 0,6 pp |
| 12 | 6 | montante | gambeson | 39,5% | 16,9% | 4/7/11 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -1,6 pp |
| 12 | 6 | montante | malha | 39,6% | 24,6% | 6/9/13 | 0,0% | 50,0% [47,8%; 52,2%], n=2000 | -4,6 pp |

## 4. C · Degrau automático de Centelha

A é X+1; B é X. Dano e Ticks necessários são direcionais e vêm das mesmas lutas.

| soma | confronto | arma | armadura | dano A→B | dano B→A | golpes A→B | golpes B→A | força/tentativa | ticks A→B | força/Tick | ⚑ | vitória A, IC95% | viés | censura |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 1×0 | espada-longa | nenhuma | 5,82 | 2,92 | 5,84 | 11,63 | 1,992 | 35,0 | 1,992 |  | 91,4% [90,1%; 92,6%], n=2000 | -2,0 pp | 0,0% |
| 6 | 1×0 | espada-longa | gambeson | 3,36 | 1,60 | 10,10 | 21,31 | 2,109 | 60,6 | 2,109 |  | 99,9% [99,6%; 99,9%], n=2000 | -0,1 pp | 0,0% |
| 6 | 1×0 | espada-longa | malha | 0,86 | 0,18 | 39,75 | 187,57 | 4,718 | 238,5 | 4,718 |  | 99,8% [99,5%; 99,9%], n=2000 | -0,2 pp | 0,0% |
| 6 | 1×0 | montante | nenhuma | 9,65 | 4,83 | 3,52 | 7,04 | 1,997 | 24,7 | 1,997 |  | 78,8% [77,0%; 80,6%], n=2000 | 1,5 pp | 0,0% |
| 6 | 1×0 | montante | gambeson | 7,33 | 3,51 | 4,64 | 9,68 | 2,088 | 32,5 | 2,088 |  | 85,9% [84,3%; 87,3%], n=2000 | 1,9 pp | 0,0% |
| 6 | 1×0 | montante | malha | 5,58 | 2,24 | 6,09 | 15,20 | 2,495 | 42,7 | 2,495 |  | 89,7% [88,3%; 91,0%], n=2000 | 2,6 pp | 0,0% |
| 6 | 2×1 | espada-longa | nenhuma | 4,92 | 2,26 | 6,90 | 15,08 | 2,184 | 41,4 | 2,184 |  | 93,8% [92,6%; 94,7%], n=2000 | -0,3 pp | 0,0% |
| 6 | 2×1 | espada-longa | gambeson | 2,39 | 0,85 | 14,20 | 40,04 | 2,819 | 85,2 | 2,819 |  | 100,0% [99,8%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 6 | 2×1 | espada-longa | malha | 0,43 | 0,06 | 79,07 | 576,89 | 7,296 | 474,4 | 7,296 |  | 100,0% [99,8%; 100,0%], n=1999 | 0,0 pp | 0,0% |
| 6 | 2×1 | montante | nenhuma | 8,86 | 4,39 | 3,84 | 7,75 | 2,021 | 26,9 | 2,021 |  | 79,5% [77,7%; 81,3%], n=2000 | 1,7 pp | 0,0% |
| 6 | 2×1 | montante | gambeson | 6,48 | 2,96 | 5,25 | 11,49 | 2,189 | 36,7 | 2,189 |  | 87,5% [86,0%; 88,9%], n=2000 | 2,2 pp | 0,0% |
| 6 | 2×1 | montante | malha | 4,67 | 1,56 | 7,28 | 21,74 | 2,986 | 51,0 | 2,986 |  | 91,9% [90,6%; 93,0%], n=2000 | 0,0 pp | 0,0% |
| 6 | 3×2 | espada-longa | nenhuma | 4,01 | 1,60 | 8,47 | 21,25 | 2,507 | 50,8 | 2,507 |  | 96,1% [95,2%; 96,9%], n=2000 | -0,2 pp | 0,0% |
| 6 | 3×2 | espada-longa | gambeson | 1,41 | 0,17 | 24,09 | 198,41 | 8,238 | 144,5 | 8,238 |  | 100,0% [99,8%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 6 | 3×2 | espada-longa | malha | 0,13 | 0,00 | 255,80 | ∞ | n/d | 1534,8 | n/d |  | 100,0% [64,6%; 100,0%], n=7 | 0,0 pp | 99,7% |
| 6 | 3×2 | montante | nenhuma | 8,18 | 3,80 | 4,15 | 8,96 | 2,156 | 29,1 | 2,156 |  | 82,2% [80,5%; 83,8%], n=2000 | 1,4 pp | 0,0% |
| 6 | 3×2 | montante | gambeson | 5,65 | 2,37 | 6,02 | 14,33 | 2,380 | 42,2 | 2,380 |  | 88,9% [87,5%; 90,3%], n=2000 | 2,3 pp | 0,0% |
| 6 | 3×2 | montante | malha | 3,68 | 1,29 | 9,23 | 26,34 | 2,854 | 64,6 | 2,854 |  | 90,3% [88,9%; 91,5%], n=2000 | 1,7 pp | 0,0% |
| 6 | 4×3 | espada-longa | nenhuma | 3,07 | 0,96 | 11,07 | 35,51 | 3,209 | 66,4 | 3,209 |  | 97,9% [97,1%; 98,4%], n=2000 | 0,5 pp | 0,0% |
| 6 | 4×3 | espada-longa | gambeson | 0,43 | 0,06 | 79,07 | 576,89 | 7,296 | 474,4 | 7,296 |  | 100,0% [99,8%; 100,0%], n=1999 | 0,0 pp | 0,0% |
| 6 | 4×3 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | ∞ | n/d |  | n/d | n/d | 100,0% |
| 6 | 4×3 | montante | nenhuma | 7,46 | 3,31 | 4,56 | 10,26 | 2,250 | 31,9 | 2,250 |  | 84,1% [82,4%; 85,6%], n=2000 | 3,0 pp | 0,0% |
| 6 | 4×3 | montante | gambeson | 4,80 | 1,79 | 7,09 | 18,99 | 2,679 | 49,6 | 2,679 |  | 91,5% [90,2%; 92,6%], n=2000 | -0,4 pp | 0,0% |
| 6 | 4×3 | montante | malha | 2,99 | 0,99 | 11,38 | 34,32 | 3,016 | 79,7 | 3,016 |  | 91,5% [90,2%; 92,6%], n=2000 | 1,4 pp | 0,0% |
| 6 | 5×4 | espada-longa | nenhuma | 2,10 | 0,65 | 16,22 | 52,63 | 3,245 | 97,3 | 3,245 |  | 97,1% [96,3%; 97,7%], n=2000 | -0,4 pp | 0,0% |
| 6 | 5×4 | espada-longa | gambeson | 0,13 | 0,00 | 255,80 | ∞ | n/d | 1534,8 | n/d |  | 100,0% [64,6%; 100,0%], n=7 | 0,0 pp | 99,7% |
| 6 | 5×4 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | ∞ | n/d |  | n/d | n/d | 100,0% |
| 6 | 5×4 | montante | nenhuma | 6,69 | 2,84 | 5,08 | 11,98 | 2,358 | 35,6 | 2,358 |  | 84,2% [82,5%; 85,7%], n=2000 | 5,3 pp | 0,0% |
| 6 | 5×4 | montante | gambeson | 3,92 | 1,24 | 8,67 | 27,38 | 3,160 | 60,7 | 3,160 |  | 93,2% [92,0%; 94,2%], n=2000 | 0,9 pp | 0,0% |
| 6 | 5×4 | montante | malha | 2,34 | 0,70 | 14,56 | 48,52 | 3,333 | 101,9 | 3,333 |  | 94,1% [93,0%; 95,1%], n=2000 | 0,8 pp | 0,0% |
| 6 | 6×5 | espada-longa | nenhuma | 1,41 | 0,37 | 24,19 | 91,03 | 3,763 | 145,1 | 3,763 |  | 98,6% [97,9%; 99,0%], n=2000 | 0,1 pp | 0,0% |
| 6 | 6×5 | espada-longa | gambeson | 0,00 | 0,00 | ∞ | ∞ | n/d | ∞ | n/d |  | n/d | n/d | 100,0% |
| 6 | 6×5 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | ∞ | n/d |  | n/d | n/d | 100,0% |
| 6 | 6×5 | montante | nenhuma | 5,91 | 2,36 | 5,75 | 14,42 | 2,506 | 40,3 | 2,506 |  | 85,7% [84,1%; 87,2%], n=2000 | 3,6 pp | 0,0% |
| 6 | 6×5 | montante | gambeson | 2,99 | 0,99 | 11,38 | 34,32 | 3,016 | 79,7 | 3,016 |  | 91,5% [90,2%; 92,6%], n=2000 | 1,4 pp | 0,0% |
| 6 | 6×5 | montante | malha | 1,71 | 0,47 | 19,85 | 72,27 | 3,640 | 139,0 | 3,640 |  | 95,7% [94,7%; 96,5%], n=2000 | 0,2 pp | 0,0% |
| 8 | 1×0 | espada-longa | nenhuma | 6,16 | 3,13 | 5,52 | 10,86 | 1,969 | 33,1 | 1,969 |  | 88,0% [86,6%; 89,4%], n=2000 | 2,7 pp | 0,0% |
| 8 | 1×0 | espada-longa | gambeson | 3,64 | 1,65 | 9,35 | 20,62 | 2,205 | 56,1 | 2,205 |  | 98,8% [98,2%; 99,2%], n=2000 | 0,6 pp | 0,0% |
| 8 | 1×0 | espada-longa | malha | 1,32 | 0,35 | 25,80 | 97,61 | 3,784 | 154,8 | 3,784 |  | 98,7% [98,1%; 99,1%], n=2000 | 0,4 pp | 0,0% |
| 8 | 1×0 | montante | nenhuma | 10,02 | 5,09 | 3,39 | 6,68 | 1,969 | 23,8 | 1,969 |  | 75,8% [73,8%; 77,6%], n=2000 | 4,7 pp | 0,0% |
| 8 | 1×0 | montante | gambeson | 7,93 | 3,94 | 4,29 | 8,63 | 2,014 | 30,0 | 2,014 |  | 82,0% [80,2%; 83,6%], n=2000 | 3,5 pp | 0,0% |
| 8 | 1×0 | montante | malha | 6,34 | 2,73 | 5,36 | 12,46 | 2,325 | 37,5 | 2,325 |  | 85,3% [83,6%; 86,7%], n=2000 | 1,1 pp | 0,0% |
| 8 | 2×1 | espada-longa | nenhuma | 5,32 | 2,53 | 6,39 | 13,46 | 2,105 | 38,4 | 2,105 |  | 89,4% [88,0%; 90,7%], n=2000 | 0,8 pp | 0,0% |
| 8 | 2×1 | espada-longa | gambeson | 2,71 | 0,97 | 12,56 | 35,15 | 2,798 | 75,4 | 2,798 |  | 99,9% [99,6%; 100,0%], n=2000 | 0,2 pp | 0,0% |
| 8 | 2×1 | espada-longa | malha | 0,80 | 0,17 | 42,40 | 203,46 | 4,799 | 254,4 | 4,799 |  | 99,8% [99,4%; 99,9%], n=2000 | -0,1 pp | 0,0% |
| 8 | 2×1 | montante | nenhuma | 9,39 | 4,65 | 3,62 | 7,31 | 2,019 | 25,3 | 2,019 |  | 77,3% [75,4%; 79,0%], n=2000 | 4,3 pp | 0,0% |
| 8 | 2×1 | montante | gambeson | 7,16 | 3,39 | 4,75 | 10,02 | 2,112 | 33,2 | 2,112 |  | 83,3% [81,6%; 84,9%], n=2000 | 1,8 pp | 0,0% |
| 8 | 2×1 | montante | malha | 5,49 | 2,11 | 6,20 | 16,08 | 2,596 | 43,4 | 2,596 |  | 86,7% [85,1%; 88,1%], n=2000 | 1,6 pp | 0,0% |
| 8 | 3×2 | espada-longa | nenhuma | 4,45 | 1,92 | 7,64 | 17,67 | 2,313 | 45,8 | 2,313 |  | 91,5% [90,1%; 92,6%], n=2000 | 1,1 pp | 0,0% |
| 8 | 3×2 | espada-longa | gambeson | 1,76 | 0,33 | 19,30 | 103,44 | 5,361 | 115,8 | 5,361 |  | 100,0% [99,8%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 8 | 3×2 | espada-longa | malha | 0,40 | 0,05 | 84,90 | 618,38 | 7,284 | 509,4 | 7,284 |  | 100,0% [99,8%; 100,0%], n=1993 | 0,0 pp | 0,3% |
| 8 | 3×2 | montante | nenhuma | 8,70 | 4,18 | 3,91 | 8,13 | 2,081 | 27,4 | 2,081 |  | 79,0% [77,2%; 80,7%], n=2000 | 5,0 pp | 0,0% |
| 8 | 3×2 | montante | gambeson | 6,37 | 2,83 | 5,34 | 12,01 | 2,251 | 37,4 | 2,251 |  | 84,8% [83,2%; 86,3%], n=2000 | 1,6 pp | 0,0% |
| 8 | 3×2 | montante | malha | 4,58 | 1,82 | 7,42 | 18,71 | 2,521 | 51,9 | 2,521 |  | 86,1% [84,5%; 87,5%], n=2000 | 1,9 pp | 0,0% |
| 8 | 4×3 | espada-longa | nenhuma | 3,63 | 1,28 | 9,37 | 26,57 | 2,834 | 56,2 | 2,834 |  | 95,2% [94,2%; 96,1%], n=2000 | 2,6 pp | 0,0% |
| 8 | 4×3 | espada-longa | gambeson | 0,80 | 0,17 | 42,40 | 203,46 | 4,799 | 254,4 | 4,799 |  | 99,8% [99,4%; 99,9%], n=2000 | -0,1 pp | 0,0% |
| 8 | 4×3 | espada-longa | malha | 0,12 | 0,00 | 280,75 | ∞ | n/d | 1684,5 | n/d |  | 100,0% [43,9%; 100,0%], n=3 | n/d | 99,9% |
| 8 | 4×3 | montante | nenhuma | 8,00 | 3,74 | 4,25 | 9,08 | 2,136 | 29,7 | 2,136 |  | 79,8% [78,0%; 81,5%], n=2000 | 3,2 pp | 0,0% |
| 8 | 4×3 | montante | gambeson | 5,60 | 2,29 | 6,08 | 14,83 | 2,441 | 42,5 | 2,441 |  | 87,1% [85,5%; 88,5%], n=2000 | 1,7 pp | 0,0% |
| 8 | 4×3 | montante | malha | 3,93 | 1,49 | 8,64 | 22,82 | 2,640 | 60,5 | 2,640 |  | 87,4% [85,8%; 88,7%], n=2000 | 0,3 pp | 0,0% |
| 8 | 5×4 | espada-longa | nenhuma | 2,71 | 0,92 | 12,53 | 36,98 | 2,950 | 75,2 | 2,950 |  | 95,0% [94,0%; 95,9%], n=2000 | 2,1 pp | 0,0% |
| 8 | 5×4 | espada-longa | gambeson | 0,40 | 0,05 | 84,90 | 618,38 | 7,284 | 509,4 | 7,284 |  | 100,0% [99,8%; 100,0%], n=1993 | 0,0 pp | 0,3% |
| 8 | 5×4 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | ∞ | n/d |  | n/d | n/d | 100,0% |
| 8 | 5×4 | montante | nenhuma | 7,24 | 3,33 | 4,70 | 10,20 | 2,172 | 32,9 | 2,172 |  | 80,5% [78,7%; 82,1%], n=2000 | 3,5 pp | 0,0% |
| 8 | 5×4 | montante | gambeson | 4,79 | 1,77 | 7,09 | 19,18 | 2,704 | 49,6 | 2,704 |  | 88,2% [86,7%; 89,5%], n=2000 | 1,2 pp | 0,0% |
| 8 | 5×4 | montante | malha | 3,33 | 1,18 | 10,22 | 28,87 | 2,824 | 71,6 | 2,824 |  | 90,0% [88,6%; 91,2%], n=2000 | 0,6 pp | 0,0% |
| 8 | 6×5 | espada-longa | nenhuma | 1,95 | 0,60 | 17,42 | 56,50 | 3,244 | 104,5 | 3,244 |  | 97,0% [96,2%; 97,7%], n=2000 | 1,1 pp | 0,0% |
| 8 | 6×5 | espada-longa | gambeson | 0,12 | 0,00 | 280,75 | ∞ | n/d | 1684,5 | n/d |  | 100,0% [43,9%; 100,0%], n=3 | n/d | 99,9% |
| 8 | 6×5 | espada-longa | malha | 0,00 | 0,00 | ∞ | ∞ | n/d | ∞ | n/d |  | n/d | n/d | 100,0% |
| 8 | 6×5 | montante | nenhuma | 6,53 | 2,84 | 5,21 | 11,95 | 2,297 | 36,4 | 2,297 |  | 82,2% [80,4%; 83,8%], n=2000 | 1,1 pp | 0,0% |
| 8 | 6×5 | montante | gambeson | 3,93 | 1,49 | 8,64 | 22,82 | 2,640 | 60,5 | 2,640 |  | 87,4% [85,8%; 88,7%], n=2000 | 0,3 pp | 0,0% |
| 8 | 6×5 | montante | malha | 2,69 | 0,90 | 12,64 | 37,79 | 2,990 | 88,5 | 2,990 |  | 91,8% [90,5%; 92,9%], n=2000 | 0,4 pp | 0,0% |
| 12 | 1×0 | espada-longa | nenhuma | 6,42 | 3,50 | 5,29 | 9,72 | 1,835 | 31,8 | 1,835 |  | 79,3% [77,5%; 81,0%], n=2000 | -0,4 pp | 0,0% |
| 12 | 1×0 | espada-longa | gambeson | 4,18 | 1,91 | 8,14 | 17,76 | 2,182 | 48,8 | 2,182 |  | 91,4% [90,1%; 92,6%], n=2000 | -0,4 pp | 0,0% |
| 12 | 1×0 | espada-longa | malha | 2,29 | 0,79 | 14,83 | 42,84 | 2,889 | 89,0 | 2,889 |  | 93,8% [92,7%; 94,8%], n=2000 | 2,2 pp | 0,0% |
| 12 | 1×0 | montante | nenhuma | 10,14 | 5,79 | 3,35 | 5,87 | 1,752 | 23,5 | 1,752 |  | 70,7% [68,6%; 72,6%], n=2000 | -3,3 pp | 0,0% |
| 12 | 1×0 | montante | gambeson | 8,67 | 4,66 | 3,92 | 7,30 | 1,861 | 27,5 | 1,861 |  | 74,7% [72,7%; 76,6%], n=2000 | -2,0 pp | 0,0% |
| 12 | 1×0 | montante | malha | 7,43 | 3,55 | 4,58 | 9,59 | 2,095 | 32,0 | 2,095 |  | 77,9% [76,0%; 79,7%], n=2000 | -1,4 pp | 0,0% |
| 12 | 2×1 | espada-longa | nenhuma | 5,70 | 2,93 | 5,96 | 11,59 | 1,944 | 35,8 | 1,944 |  | 81,6% [79,8%; 83,2%], n=2000 | -0,4 pp | 0,0% |
| 12 | 2×1 | espada-longa | gambeson | 3,36 | 1,34 | 10,11 | 25,31 | 2,503 | 60,7 | 2,503 |  | 93,7% [92,5%; 94,7%], n=2000 | 0,4 pp | 0,0% |
| 12 | 2×1 | espada-longa | malha | 1,66 | 0,51 | 20,43 | 66,71 | 3,266 | 122,6 | 3,266 |  | 96,7% [95,8%; 97,4%], n=2000 | 0,9 pp | 0,0% |
| 12 | 2×1 | montante | nenhuma | 9,53 | 5,43 | 3,57 | 6,27 | 1,757 | 25,0 | 1,757 |  | 71,5% [69,4%; 73,4%], n=2000 | -1,9 pp | 0,0% |
| 12 | 2×1 | montante | gambeson | 8,03 | 4,12 | 4,23 | 8,25 | 1,947 | 29,6 | 1,947 |  | 75,6% [73,7%; 77,5%], n=2000 | -1,7 pp | 0,0% |
| 12 | 2×1 | montante | malha | 6,66 | 3,02 | 5,10 | 11,25 | 2,205 | 35,7 | 2,205 |  | 79,3% [77,4%; 81,0%], n=2000 | -1,9 pp | 0,0% |
| 12 | 3×2 | espada-longa | nenhuma | 4,96 | 2,36 | 6,85 | 14,44 | 2,107 | 41,1 | 2,107 |  | 83,6% [81,9%; 85,2%], n=2000 | -1,4 pp | 0,0% |
| 12 | 3×2 | espada-longa | gambeson | 2,54 | 0,76 | 13,38 | 45,00 | 3,364 | 80,3 | 3,364 |  | 97,4% [96,6%; 98,0%], n=2000 | 0,2 pp | 0,0% |
| 12 | 3×2 | espada-longa | malha | 1,13 | 0,30 | 30,21 | 115,21 | 3,814 | 181,2 | 3,814 |  | 98,6% [97,9%; 99,0%], n=2000 | 0,3 pp | 0,0% |
| 12 | 3×2 | montante | nenhuma | 9,02 | 5,02 | 3,77 | 6,78 | 1,799 | 26,4 | 1,799 |  | 72,3% [70,3%; 74,2%], n=2000 | -1,6 pp | 0,0% |
| 12 | 3×2 | montante | gambeson | 7,38 | 3,66 | 4,61 | 9,29 | 2,017 | 32,3 | 2,017 |  | 77,0% [75,1%; 78,7%], n=2000 | -1,3 pp | 0,0% |
| 12 | 3×2 | montante | malha | 5,79 | 2,83 | 5,87 | 11,99 | 2,043 | 41,1 | 2,043 |  | 77,0% [75,1%; 78,7%], n=2000 | -2,7 pp | 0,0% |
| 12 | 4×3 | espada-longa | nenhuma | 4,27 | 1,82 | 7,97 | 18,66 | 2,342 | 47,8 | 2,342 |  | 86,6% [85,0%; 88,0%], n=2000 | -0,3 pp | 0,0% |
| 12 | 4×3 | espada-longa | gambeson | 1,66 | 0,51 | 20,43 | 66,71 | 3,266 | 122,6 | 3,266 |  | 96,7% [95,8%; 97,4%], n=2000 | 0,9 pp | 0,0% |
| 12 | 4×3 | espada-longa | malha | 0,68 | 0,14 | 49,64 | 239,22 | 4,819 | 297,9 | 4,819 |  | 99,9% [99,6%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 12 | 4×3 | montante | nenhuma | 8,60 | 4,56 | 3,95 | 7,46 | 1,886 | 27,7 | 1,886 |  | 74,0% [72,0%; 75,9%], n=2000 | -2,2 pp | 0,0% |
| 12 | 4×3 | montante | gambeson | 6,73 | 3,18 | 5,05 | 10,69 | 2,116 | 35,4 | 2,116 |  | 78,7% [76,9%; 80,4%], n=2000 | -1,2 pp | 0,0% |
| 12 | 4×3 | montante | malha | 5,30 | 2,51 | 6,42 | 13,57 | 2,114 | 44,9 | 2,114 |  | 78,4% [76,5%; 80,1%], n=2000 | -4,0 pp | 0,0% |
| 12 | 5×4 | espada-longa | nenhuma | 3,50 | 1,51 | 9,73 | 22,45 | 2,308 | 58,4 | 2,308 |  | 86,7% [85,1%; 88,1%], n=2000 | 0,3 pp | 0,0% |
| 12 | 5×4 | espada-longa | gambeson | 1,13 | 0,30 | 30,21 | 115,21 | 3,814 | 181,2 | 3,814 |  | 98,6% [97,9%; 99,0%], n=2000 | 0,3 pp | 0,0% |
| 12 | 5×4 | espada-longa | malha | 0,34 | 0,05 | 98,74 | 735,07 | 7,445 | 592,4 | 7,445 |  | 100,0% [99,8%; 100,0%], n=1949 | 0,0 pp | 2,5% |
| 12 | 5×4 | montante | nenhuma | 8,12 | 4,07 | 4,19 | 8,35 | 1,992 | 29,3 | 1,992 |  | 74,8% [72,8%; 76,6%], n=2000 | -2,1 pp | 0,0% |
| 12 | 5×4 | montante | gambeson | 6,03 | 2,76 | 5,64 | 12,31 | 2,183 | 39,5 | 2,183 |  | 79,3% [77,5%; 81,0%], n=2000 | -1,8 pp | 0,0% |
| 12 | 5×4 | montante | malha | 4,84 | 2,18 | 7,03 | 15,57 | 2,216 | 49,2 | 2,216 |  | 80,5% [78,7%; 82,1%], n=2000 | -3,1 pp | 0,0% |
| 12 | 6×5 | espada-longa | nenhuma | 2,90 | 1,16 | 11,74 | 29,41 | 2,505 | 70,4 | 2,505 |  | 89,7% [88,3%; 91,0%], n=2000 | 0,6 pp | 0,0% |
| 12 | 6×5 | espada-longa | gambeson | 0,68 | 0,14 | 49,64 | 239,22 | 4,819 | 297,9 | 4,819 |  | 99,9% [99,6%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 12 | 6×5 | espada-longa | malha | 0,10 | 0,00 | 346,36 | ∞ | n/d | 2078,2 | n/d |  | 100,0% [20,7%; 100,0%], n=1 | n/d | 100,0% |
| 12 | 6×5 | montante | nenhuma | 7,60 | 3,58 | 4,47 | 9,50 | 2,124 | 31,3 | 2,124 |  | 75,6% [73,7%; 77,4%], n=2000 | -1,8 pp | 0,0% |
| 12 | 6×5 | montante | gambeson | 5,30 | 2,51 | 6,42 | 13,57 | 2,114 | 44,9 | 2,114 |  | 78,4% [76,5%; 80,1%], n=2000 | -4,0 pp | 0,0% |
| 12 | 6×5 | montante | malha | 4,30 | 1,89 | 7,90 | 17,99 | 2,276 | 55,3 | 2,276 |  | 81,3% [79,6%; 83,0%], n=2000 | -2,1 pp | 0,0% |



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
| 6 | 3×3 de 2 | sem teto | 0,3% | 0,0% |
| 6 | 3×3 de 2 | −4 | 0,3% | 0,0% |
| 6 | 3×3 de 2 | −6 | 0,3% | 0,0% |
| 6 | 4×3 de 3 | sem teto | 0,0% | 1,9% |
| 6 | 4×3 de 3 | −4 | 0,0% | 1,9% |
| 6 | 4×3 de 3 | −6 | 0,0% | 1,9% |
| 6 | 5×3 de 4 | sem teto | n/d | 100,0% |
| 6 | 5×3 de 4 | −4 | n/d | 100,0% |
| 6 | 5×3 de 4 | −6 | n/d | 100,0% |
| 6 | 6×3 de 5 | sem teto | n/d | 100,0% |
| 6 | 6×3 de 5 | −4 | n/d | 100,0% |
| 6 | 6×3 de 5 | −6 | n/d | 100,0% |
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
| 8 | 5×3 de 4 | sem teto | 0,0% | 2,8% |
| 8 | 5×3 de 4 | −4 | 0,0% | 2,8% |
| 8 | 5×3 de 4 | −6 | 0,0% | 2,8% |
| 8 | 6×3 de 5 | sem teto | n/d | 100,0% |
| 8 | 6×3 de 5 | −4 | n/d | 100,0% |
| 8 | 6×3 de 5 | −6 | n/d | 100,0% |
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

Centelha 1/3/5; espada longa e gambeson. A é a peça modificada; B é a ficha igual sem
modificação. `habilidade+1` altera Armas. Ticks alteram somente a anatomia da peça modificada.

| soma | C | alavanca | dano A→B | dano B→A | golpes A→B | golpes B→A | força/tentativa | força/Tick | ⚑ | vitória A, IC95% | viés | censura |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 1 | ataque+1 | 2,30 | 2,09 | 14,76 | 16,28 | 1,103 | 1,103 |  | 65,5% [63,4%; 67,6%], n=2000 | -4,6 pp | 0,0% |
| 6 | 1 | defesa+1 | 2,19 | 1,86 | 15,56 | 18,29 | 1,176 | 1,176 |  | 70,5% [68,4%; 72,4%], n=2000 | -2,1 pp | 0,0% |
| 6 | 1 | dano+1 | 2,54 | 2,04 | 13,40 | 16,64 | 1,242 | 1,242 |  | 78,0% [76,1%; 79,8%], n=2000 | -3,4 pp | 0,0% |
| 6 | 1 | dano+1d6 | 4,24 | 1,86 | 8,01 | 18,26 | 2,279 | 2,279 |  | 98,3% [97,6%; 98,7%], n=2000 | -0,7 pp | 0,0% |
| 6 | 1 | absorcao+1 | 2,19 | 1,88 | 15,54 | 18,11 | 1,166 | 1,166 |  | 76,8% [74,8%; 78,5%], n=2000 | -1,9 pp | 0,0% |
| 6 | 1 | pv+1 | 2,14 | 2,12 | 15,87 | 16,52 | 1,041 | 1,041 |  | 57,0% [54,9%; 59,2%], n=2000 | -3,9 pp | 0,0% |
| 6 | 1 | pv+5 | 2,20 | 2,05 | 15,47 | 19,03 | 1,231 | 1,231 |  | 81,7% [79,9%; 83,3%], n=2000 | -2,7 pp | 0,0% |
| 6 | 1 | preparo-1 | 2,25 | 2,02 | 15,11 | 16,83 | 1,113 | 1,336 | ⚑ | 88,4% [86,9%; 89,7%], n=2000 | 1,8 pp | 0,0% |
| 6 | 1 | recuperacao-1 | 2,24 | 2,04 | 15,18 | 16,69 | 1,100 | 1,319 | ⚑ | 87,0% [85,4%; 88,4%], n=2000 | 0,1 pp | 0,0% |
| 6 | 1 | habilidade+1 | 2,41 | 2,06 | 14,13 | 16,50 | 1,168 | 1,168 |  | 74,1% [72,1%; 76,0%], n=2000 | -4,2 pp | 0,0% |
| 6 | 1 | atributo+1-destreza-espada | 2,43 | 1,41 | 13,98 | 24,06 | 1,721 | 1,721 |  | 95,1% [94,1%; 96,0%], n=2000 | -0,2 pp | 0,0% |
| 6 | 3 | ataque+1 | 0,39 | 0,30 | 87,44 | 115,00 | 1,315 | 1,315 |  | 68,8% [66,7%; 70,8%], n=2000 | -2,0 pp | 0,0% |
| 6 | 3 | defesa+1 | 0,35 | 0,23 | 97,83 | 145,66 | 1,489 | 1,489 |  | 73,4% [71,4%; 75,3%], n=1997 | -3,3 pp | 0,1% |
| 6 | 3 | dano+1 | 0,76 | 0,25 | 44,65 | 135,96 | 3,045 | 3,045 |  | 97,8% [97,1%; 98,4%], n=2000 | -0,2 pp | 0,0% |
| 6 | 3 | dano+1d6 | 2,42 | 0,24 | 14,03 | 142,07 | 10,128 | 10,128 |  | 100,0% [99,8%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 6 | 3 | absorcao+1 | 0,39 | 0,08 | 87,27 | 432,87 | 4,960 | 4,960 |  | 100,0% [99,8%; 100,0%], n=1990 | 0,0 pp | 0,5% |
| 6 | 3 | pv+1 | 0,32 | 0,32 | 105,76 | 110,10 | 1,041 | 1,041 |  | 53,3% [51,1%; 55,5%], n=2000 | -5,4 pp | 0,0% |
| 6 | 3 | pv+5 | 0,34 | 0,30 | 101,36 | 128,80 | 1,271 | 1,271 |  | 66,0% [63,9%; 68,0%], n=1998 | -3,1 pp | 0,1% |
| 6 | 3 | preparo-1 | 0,35 | 0,29 | 96,18 | 115,95 | 1,206 | 1,447 | ⚑ | 72,8% [70,8%; 74,7%], n=2000 | 1,5 pp | 0,0% |
| 6 | 3 | recuperacao-1 | 0,35 | 0,29 | 95,98 | 116,67 | 1,215 | 1,459 | ⚑ | 73,5% [71,5%; 75,3%], n=2000 | 1,3 pp | 0,0% |
| 6 | 3 | habilidade+1 | 0,44 | 0,28 | 77,24 | 122,63 | 1,588 | 1,588 |  | 81,2% [79,4%; 82,9%], n=2000 | -1,8 pp | 0,0% |
| 6 | 3 | atributo+1-destreza-espada | 0,46 | 0,14 | 74,31 | 248,63 | 3,346 | 3,346 |  | 98,2% [97,5%; 98,7%], n=2000 | 0,9 pp | 0,0% |
| 6 | 5 | ataque+1 | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 6 | 5 | defesa+1 | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 6 | 5 | dano+1 | 0,11 | 0,00 | 297,27 | ∞ | n/d | n/d |  | 100,0% [43,9%; 100,0%], n=3 | 0,0 pp | 99,9% |
| 6 | 5 | dano+1d6 | 1,22 | 0,00 | 27,86 | ∞ | n/d | n/d |  | 100,0% [99,8%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 6 | 5 | absorcao+1 | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 6 | 5 | pv+1 | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 6 | 5 | pv+5 | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 6 | 5 | preparo-1 | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 6 | 5 | recuperacao-1 | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 6 | 5 | habilidade+1 | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 6 | 5 | atributo+1-destreza-espada | 0,00 | 0,00 | ∞ | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 8 | 1 | ataque+1 | 2,53 | 2,19 | 13,41 | 15,51 | 1,156 | 1,156 |  | 65,5% [63,4%; 67,6%], n=2000 | -6,5 pp | 0,0% |
| 8 | 1 | defesa+1 | 2,35 | 1,91 | 14,49 | 17,78 | 1,227 | 1,227 |  | 68,2% [66,1%; 70,2%], n=2000 | -2,2 pp | 0,0% |
| 8 | 1 | dano+1 | 2,76 | 2,16 | 12,33 | 15,76 | 1,278 | 1,278 |  | 72,7% [70,7%; 74,6%], n=2000 | -2,8 pp | 0,0% |
| 8 | 1 | dano+1d6 | 4,51 | 1,97 | 7,55 | 17,22 | 2,282 | 2,282 |  | 94,5% [93,5%; 95,5%], n=2000 | 1,9 pp | 0,0% |
| 8 | 1 | absorcao+1 | 2,36 | 1,90 | 14,43 | 17,89 | 1,240 | 1,240 |  | 74,4% [72,4%; 76,3%], n=2000 | -6,0 pp | 0,0% |
| 8 | 1 | pv+1 | 2,27 | 2,25 | 14,99 | 15,54 | 1,037 | 1,037 |  | 53,8% [51,6%; 56,0%], n=2000 | -6,8 pp | 0,0% |
| 8 | 1 | pv+5 | 2,35 | 2,17 | 14,46 | 17,95 | 1,241 | 1,241 |  | 72,0% [70,0%; 74,0%], n=2000 | -2,7 pp | 0,0% |
| 8 | 1 | preparo-1 | 2,42 | 2,11 | 14,06 | 16,09 | 1,145 | 1,374 | ⚑ | 78,9% [77,1%; 80,6%], n=2000 | -1,4 pp | 0,0% |
| 8 | 1 | recuperacao-1 | 2,40 | 2,14 | 14,15 | 15,89 | 1,123 | 1,348 | ⚑ | 75,9% [74,0%; 77,7%], n=2000 | -1,0 pp | 0,0% |
| 8 | 1 | habilidade+1 | 2,72 | 2,13 | 12,48 | 15,97 | 1,280 | 1,280 |  | 76,7% [74,8%; 78,5%], n=2000 | -3,8 pp | 0,0% |
| 8 | 1 | atributo+1-destreza-espada | 2,79 | 1,39 | 12,17 | 24,38 | 2,003 | 2,003 |  | 95,6% [94,6%; 96,4%], n=2000 | 1,2 pp | 0,0% |
| 8 | 3 | ataque+1 | 0,71 | 0,54 | 47,56 | 62,85 | 1,322 | 1,322 |  | 67,6% [65,5%; 69,6%], n=2000 | 1,0 pp | 0,0% |
| 8 | 3 | defesa+1 | 0,63 | 0,44 | 54,18 | 78,00 | 1,440 | 1,440 |  | 70,0% [68,0%; 72,0%], n=2000 | 2,2 pp | 0,0% |
| 8 | 3 | dano+1 | 1,11 | 0,49 | 30,61 | 68,89 | 2,251 | 2,251 |  | 90,5% [89,1%; 91,7%], n=2000 | -0,4 pp | 0,0% |
| 8 | 3 | dano+1d6 | 2,85 | 0,44 | 11,95 | 76,68 | 6,419 | 6,419 |  | 100,0% [99,8%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 8 | 3 | absorcao+1 | 0,70 | 0,23 | 48,85 | 148,29 | 3,035 | 3,035 |  | 97,8% [97,0%; 98,3%], n=2000 | 0,5 pp | 0,0% |
| 8 | 3 | pv+1 | 0,59 | 0,58 | 58,09 | 60,31 | 1,038 | 1,038 |  | 52,6% [50,4%; 54,8%], n=2000 | 2,8 pp | 0,0% |
| 8 | 3 | pv+5 | 0,61 | 0,56 | 56,07 | 70,18 | 1,252 | 1,252 |  | 63,6% [61,5%; 65,7%], n=2000 | 3,5 pp | 0,0% |
| 8 | 3 | preparo-1 | 0,64 | 0,53 | 52,72 | 63,75 | 1,209 | 1,451 | ⚑ | 70,3% [68,3%; 72,3%], n=2000 | 0,8 pp | 0,0% |
| 8 | 3 | recuperacao-1 | 0,64 | 0,54 | 52,74 | 63,14 | 1,197 | 1,437 | ⚑ | 69,5% [67,4%; 71,4%], n=2000 | 1,3 pp | 0,0% |
| 8 | 3 | habilidade+1 | 0,82 | 0,51 | 41,62 | 66,30 | 1,593 | 1,593 |  | 78,5% [76,7%; 80,3%], n=2000 | 1,1 pp | 0,0% |
| 8 | 3 | atributo+1-destreza-espada | 0,86 | 0,26 | 39,45 | 130,27 | 3,302 | 3,302 |  | 97,0% [96,2%; 97,7%], n=2000 | 0,4 pp | 0,0% |
| 8 | 5 | ataque+1 | 0,12 | 0,10 | 288,31 | 354,81 | 1,231 | 1,231 |  | 100,0% [43,9%; 100,0%], n=3 | n/d | 99,9% |
| 8 | 5 | defesa+1 | 0,10 | 0,08 | 335,54 | 429,07 | 1,279 | 1,279 |  | n/d | n/d | 100,0% |
| 8 | 5 | dano+1 | 0,36 | 0,07 | 95,63 | 471,76 | 4,933 | 4,933 |  | 100,0% [99,8%; 100,0%], n=1953 | 0,0 pp | 2,3% |
| 8 | 5 | dano+1d6 | 1,62 | 0,07 | 21,01 | 472,00 | 22,466 | 22,466 |  | 100,0% [99,8%; 100,0%], n=2000 | 0,0 pp | 0,0% |
| 8 | 5 | absorcao+1 | 0,10 | 0,00 | 330,23 | ∞ | n/d | n/d |  | n/d | n/d | 100,0% |
| 8 | 5 | pv+1 | 0,10 | 0,10 | 343,07 | 353,17 | 1,029 | 1,029 |  | 0,0% [0,0%; 79,3%], n=1 | n/d | 100,0% |
| 8 | 5 | pv+5 | 0,10 | 0,10 | 336,70 | 401,21 | 1,192 | 1,192 |  | n/d | n/d | 100,0% |
| 8 | 5 | preparo-1 | 0,11 | 0,09 | 321,74 | 361,56 | 1,124 | 1,349 | ⚑ | 100,0% [56,6%; 100,0%], n=5 | 0,0 pp | 99,8% |
| 8 | 5 | recuperacao-1 | 0,11 | 0,09 | 319,73 | 362,53 | 1,134 | 1,361 | ⚑ | 100,0% [72,2%; 100,0%], n=10 | 0,0 pp | 99,5% |
| 8 | 5 | habilidade+1 | 0,13 | 0,09 | 252,54 | 368,72 | 1,460 | 1,460 |  | 100,0% [67,6%; 100,0%], n=8 | 0,0 pp | 99,6% |
| 8 | 5 | atributo+1-destreza-espada | 0,14 | 0,05 | 248,81 | 622,08 | 2,500 | 2,500 |  | 100,0% [74,1%; 100,0%], n=11 | 0,0 pp | 99,5% |
| 12 | 1 | ataque+1 | 3,12 | 2,53 | 10,90 | 13,45 | 1,234 | 1,234 |  | 65,7% [63,6%; 67,7%], n=2000 | -3,2 pp | 0,0% |
| 12 | 1 | defesa+1 | 2,76 | 2,19 | 12,33 | 15,53 | 1,260 | 1,260 |  | 64,6% [62,5%; 66,7%], n=2000 | -0,2 pp | 0,0% |
| 12 | 1 | dano+1 | 3,26 | 2,55 | 10,43 | 13,32 | 1,277 | 1,277 |  | 66,3% [64,2%; 68,4%], n=2000 | -0,5 pp | 0,0% |
| 12 | 1 | dano+1d6 | 4,74 | 2,40 | 7,17 | 14,16 | 1,974 | 1,974 |  | 85,2% [83,5%; 86,6%], n=2000 | 0,3 pp | 0,0% |
| 12 | 1 | absorcao+1 | 2,76 | 2,16 | 12,33 | 15,71 | 1,273 | 1,273 |  | 67,2% [65,1%; 69,2%], n=2000 | -1,7 pp | 0,0% |
| 12 | 1 | pv+1 | 2,67 | 2,65 | 12,75 | 13,20 | 1,035 | 1,035 |  | 52,5% [50,3%; 54,7%], n=2000 | 0,4 pp | 0,0% |
| 12 | 1 | pv+5 | 2,73 | 2,57 | 12,44 | 15,16 | 1,218 | 1,218 |  | 63,1% [61,0%; 65,2%], n=2000 | -2,2 pp | 0,0% |
| 12 | 1 | preparo-1 | 2,92 | 2,45 | 11,66 | 13,87 | 1,190 | 1,427 | ⚑ | 72,3% [70,2%; 74,2%], n=2000 | -0,5 pp | 0,0% |
| 12 | 1 | recuperacao-1 | 2,89 | 2,49 | 11,78 | 13,66 | 1,160 | 1,391 | ⚑ | 70,5% [68,5%; 72,5%], n=2000 | -0,4 pp | 0,0% |
| 12 | 1 | habilidade+1 | 3,49 | 2,43 | 9,74 | 14,00 | 1,437 | 1,437 |  | 75,6% [73,7%; 77,5%], n=2000 | -1,9 pp | 0,0% |
| 12 | 1 | atributo+1-destreza-espada | 3,64 | 1,54 | 9,34 | 22,01 | 2,358 | 2,358 |  | 92,7% [91,5%; 93,8%], n=2000 | -0,4 pp | 0,0% |
| 12 | 3 | ataque+1 | 1,50 | 1,13 | 22,73 | 30,13 | 1,326 | 1,326 |  | 65,3% [63,1%; 67,3%], n=2000 | -0,7 pp | 0,0% |
| 12 | 3 | defesa+1 | 1,29 | 0,92 | 26,37 | 36,77 | 1,394 | 1,394 |  | 67,5% [65,4%; 69,5%], n=2000 | -0,8 pp | 0,0% |
| 12 | 3 | dano+1 | 1,85 | 1,10 | 18,40 | 30,98 | 1,684 | 1,684 |  | 76,7% [74,8%; 78,5%], n=2000 | -0,4 pp | 0,0% |
| 12 | 3 | dano+1d6 | 3,39 | 0,99 | 10,04 | 34,21 | 3,409 | 3,409 |  | 95,6% [94,6%; 96,4%], n=2000 | -1,0 pp | 0,0% |
| 12 | 3 | absorcao+1 | 1,35 | 0,71 | 25,16 | 47,80 | 1,900 | 1,900 |  | 83,2% [81,4%; 84,7%], n=2000 | -0,1 pp | 0,0% |
| 12 | 3 | pv+1 | 1,21 | 1,21 | 28,09 | 28,96 | 1,031 | 1,031 |  | 51,4% [49,3%; 53,6%], n=2000 | -3,7 pp | 0,0% |
| 12 | 3 | pv+5 | 1,25 | 1,17 | 27,25 | 33,25 | 1,220 | 1,220 |  | 60,8% [58,6%; 62,9%], n=2000 | -2,5 pp | 0,0% |
| 12 | 3 | preparo-1 | 1,33 | 1,15 | 25,55 | 29,65 | 1,160 | 1,392 | ⚑ | 67,0% [64,9%; 69,0%], n=2000 | 4,4 pp | 0,0% |
| 12 | 3 | recuperacao-1 | 1,34 | 1,13 | 25,41 | 29,96 | 1,179 | 1,415 | ⚑ | 66,8% [64,7%; 68,8%], n=2000 | 1,3 pp | 0,0% |
| 12 | 3 | habilidade+1 | 1,76 | 1,06 | 19,30 | 32,13 | 1,665 | 1,665 |  | 78,1% [76,2%; 79,9%], n=2000 | -1,8 pp | 0,0% |
| 12 | 3 | atributo+1-destreza-espada | 1,85 | 0,59 | 18,38 | 57,54 | 3,131 | 3,131 |  | 94,8% [93,7%; 95,6%], n=2000 | 1,9 pp | 0,0% |
| 12 | 5 | ataque+1 | 0,60 | 0,45 | 56,40 | 75,23 | 1,334 | 1,334 |  | 67,3% [65,2%; 69,3%], n=2000 | 1,3 pp | 0,0% |
| 12 | 5 | defesa+1 | 0,52 | 0,36 | 64,77 | 93,61 | 1,445 | 1,445 |  | 70,7% [68,6%; 72,6%], n=2000 | 0,1 pp | 0,0% |
| 12 | 5 | dano+1 | 0,93 | 0,41 | 36,65 | 82,75 | 2,258 | 2,258 |  | 90,0% [88,6%; 91,2%], n=2000 | -1,7 pp | 0,0% |
| 12 | 5 | dano+1d6 | 2,41 | 0,37 | 14,12 | 91,97 | 6,512 | 6,512 |  | 99,9% [99,6%; 99,9%], n=2000 | -0,3 pp | 0,0% |
| 12 | 5 | absorcao+1 | 0,58 | 0,19 | 58,20 | 179,52 | 3,085 | 3,085 |  | 97,5% [96,8%; 98,1%], n=2000 | -0,9 pp | 0,0% |
| 12 | 5 | pv+1 | 0,49 | 0,48 | 70,03 | 72,62 | 1,037 | 1,037 |  | 52,3% [50,1%; 54,5%], n=2000 | -2,6 pp | 0,0% |
| 12 | 5 | pv+5 | 0,51 | 0,46 | 67,03 | 84,45 | 1,260 | 1,260 |  | 64,0% [61,9%; 66,1%], n=2000 | 0,1 pp | 0,0% |
| 12 | 5 | preparo-1 | 0,53 | 0,46 | 63,78 | 74,35 | 1,166 | 1,399 | ⚑ | 67,8% [65,7%; 69,8%], n=2000 | 1,7 pp | 0,0% |
| 12 | 5 | recuperacao-1 | 0,54 | 0,45 | 63,28 | 75,03 | 1,186 | 1,423 | ⚑ | 69,0% [67,0%; 71,0%], n=2000 | -0,5 pp | 0,0% |
| 12 | 5 | habilidade+1 | 0,71 | 0,42 | 47,83 | 80,71 | 1,688 | 1,688 |  | 81,3% [79,6%; 83,0%], n=2000 | -0,9 pp | 0,0% |
| 12 | 5 | atributo+1-destreza-espada | 0,75 | 0,23 | 45,28 | 148,81 | 3,287 | 3,287 |  | 96,9% [96,0%; 97,5%], n=2000 | -1,1 pp | 0,0% |


### 6a. Alavanca nova: +1 Força com Montante

Par do `atributo+1-destreza-espada` de cima (que já mede +1 Destreza com espada longa dentro da
tabela E), agora com Montante e +1 Força.

| soma | C | dano A→B | dano B→A | golpes A→B | golpes B→A | força/tentativa | força/Tick | ⚑ | vitória A, IC95% | viés | censura |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 1 | 8,56 | 4,35 | 3,97 | 7,82 | 1,969 | 1,969 |  | 86,7% [85,1%; 88,1%], n=2000 | 0,6 pp | 0,0% |
| 6 | 3 | 6,79 | 2,99 | 5,01 | 11,38 | 2,274 | 2,274 |  | 90,5% [89,2%; 91,8%], n=2000 | 0,1 pp | 0,0% |
| 6 | 5 | 5,01 | 1,65 | 6,79 | 20,59 | 3,031 | 3,031 |  | 94,6% [93,5%; 95,5%], n=2000 | 2,2 pp | 0,0% |
| 8 | 1 | 9,37 | 4,83 | 3,63 | 7,04 | 1,941 | 1,941 |  | 83,7% [82,0%; 85,3%], n=2000 | 2,6 pp | 0,0% |
| 8 | 3 | 7,65 | 3,59 | 4,45 | 9,47 | 2,130 | 2,130 |  | 86,0% [84,4%; 87,4%], n=2000 | 1,7 pp | 0,0% |
| 8 | 5 | 5,96 | 2,32 | 5,70 | 14,64 | 2,566 | 2,566 |  | 89,1% [87,7%; 90,4%], n=2000 | 2,2 pp | 0,0% |
| 12 | 1 | 10,27 | 5,66 | 3,31 | 6,00 | 1,813 | 1,813 |  | 75,6% [73,7%; 77,5%], n=2000 | -1,9 pp | 0,0% |
| 12 | 3 | 9,00 | 4,41 | 3,78 | 7,70 | 2,039 | 2,039 |  | 77,8% [75,9%; 79,5%], n=2000 | -2,1 pp | 0,0% |
| 12 | 5 | 7,37 | 3,50 | 4,61 | 9,72 | 2,106 | 2,106 |  | 80,0% [78,2%; 81,7%], n=2000 | -1,3 pp | 0,0% |


### 6b. Alavanca nova: Briga (desarmado) contra Armas

A é Briga (desarmado, `skills2.briga`); B é Armas (espada longa). Os dois sem armadura, mesma
soma e mesma Centelha.

| soma | C | dano A→B | dano B→A | golpes A→B | golpes B→A | força/tentativa | força/Tick | ⚑ | vitória A, IC95% | viés | censura |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 1 | 0,88 | 4,74 | 38,60 | 7,17 | 0,186 | 0,223 |  | 0,0% [0,0%; 0,2%], n=2000 | 0,0 pp | 0,0% |
| 6 | 3 | 0,06 | 2,88 | 533,15 | 11,81 | 0,022 | 0,027 |  | 0,0% [0,0%; 0,2%], n=2000 | 0,0 pp | 0,0% |
| 6 | 5 | 0,00 | 1,31 | ∞ | 26,05 | 0,000 | 0,000 |  | 0,0% [0,0%; 0,2%], n=2000 | 0,0 pp | 0,0% |
| 8 | 1 | 1,02 | 5,12 | 33,30 | 6,64 | 0,200 | 0,239 |  | 0,1% [0,0%; 0,4%], n=2000 | -0,2 pp | 0,0% |
| 8 | 3 | 0,18 | 3,38 | 186,28 | 10,07 | 0,054 | 0,065 |  | 0,0% [0,0%; 0,2%], n=2000 | 0,0 pp | 0,0% |
| 8 | 5 | 0,00 | 1,78 | ∞ | 19,11 | 0,000 | 0,000 |  | 0,0% [0,0%; 0,2%], n=2000 | 0,0 pp | 0,0% |
| 12 | 1 | 1,46 | 5,26 | 23,33 | 6,46 | 0,277 | 0,332 |  | 4,8% [3,9%; 5,8%], n=2000 | 0,4 pp | 0,0% |
| 12 | 3 | 0,53 | 4,03 | 63,79 | 8,44 | 0,132 | 0,159 |  | 0,2% [0,1%; 0,5%], n=2000 | -0,2 pp | 0,0% |
| 12 | 5 | 0,16 | 2,70 | 215,82 | 12,61 | 0,058 | 0,070 |  | 0,0% [0,0%; 0,2%], n=2000 | 0,0 pp | 0,0% |

### 6c. Arremesso contra Atirador: NÃO RODADO

O motor não modela alcance nem posição além da distância inicial fixa da bancada (peças sempre
nascem adjacentes); a penalidade por faixa de distância é só exibida na mesa, e o mestre soma à
mão. Rodar esta alavanca na cena adjacente de hoje mediria o mesmo duelo corpo a corpo com nomes
diferentes de arma. Parado aqui, como o despacho autorizou.

## 7. Onde as camadas divergem

| soma | C | dano ex. DV0 | dano ex. DV4 | dano fiel | ações p50 ex0/ex4/fiel | censura |
|---|---|---|---|---|---|---|
| 6 | 1 | 2,28 | 3,08 | 2,13 | 15/11/15 | 0,0% |
| 6 | 3 | 2,22 | 2,94 | 0,32 | 16/12/82 | 0,0% |
| 6 | 5 | 2,22 | 2,94 | 0,00 | 16/12/cens. | 100,0% |
| 8 | 1 | 2,16 | 3,22 | 2,26 | 16/11/13 | 0,0% |
| 8 | 3 | 1,99 | 2,84 | 0,58 | 18/12/44 | 0,0% |
| 8 | 5 | 1,99 | 2,84 | 0,10 | 18/12/cens. | 100,0% |
| 12 | 1 | 2,10 | 3,63 | 2,66 | 17/10/10 | 0,0% |
| 12 | 3 | 1,78 | 2,88 | 1,21 | 19/12/21 | 0,0% |
| 12 | 5 | 1,64 | 2,57 | 0,48 | 22/14/53 | 0,0% |


A camada exata com Defesa cheia subestima acerto e dano sempre que a perda real é negativa. Usar
perda fixa 4 aproxima alguns pontos, mas apaga a distribuição, a escalada de Pressão, o momento do
ciclo e o ferimento. “Censura” é a fração que não chegou a uma queda em 1.000 Ticks; essas lutas
não entram nos percentis nem são contadas como derrota. A camada rápida serve para varrer direção
e ordenar alavancas; níveis finais precisam dos pontos fiéis.

### Leitura para a revisão do simulador

- A perda de Defesa não é uma constante 4: no duelo sua mediana foi 2; no 1 contra 3, 4, com p90 8.
  A aproximação fixa depende do formato do encontro.
- Há células em que a espada longa não atravessa a combinação de Absorção e Quase-Acerto o
  bastante para encerrar a luta. A censura é resultado, não zero nem derrota.
- Aumentar Ataque ou Habilidade pode reduzir a chance de vitória em certas células: um raspão
  causa dano fixo ignorando Absorção, enquanto um acerto fraco sofre Absorção e pode causar zero
  (embora agora nunca menos que o próprio raspão, item 2c). O simulador preserva essa
  descontinuidade da regra viva; a Revisora deve confirmar que ela é intencional antes de usar a
  alavanca de ataque como moeda monotônica.
- +1d6 de dano foi muito mais forte que +1 fixo nas células de referência. A razão varia com
  Absorção, portanto não existe conversão universal entre dado e ponto.
- A força por Tick (item 6b) é a moeda nova: compare-a com a força por tentativa antes de decidir
  preço de Proeza que muda o CICLO da arma (Proezas de velocidade), porque só a força por
  tentativa fica cega para esse efeito.

## 8. Procedência e conferência

- `node scripts/sim/calibrar.mjs --teste`: três golpes determinísticos conferidos contra
  `resolverGolpe` (erro, raspão, acerto com Margem e o piso do item 2c) e dois pontos de
  distribuição em que a camada rápida e o resolvedor usado pela camada fiel concordam exatamente,
  por enumeração direta através de `lance.ts`.
- `node scripts/sim/calibrar.mjs --n 1000`: comando desta medição; cada célula de duelo executa
  1000 lutas por orientação.
- Pressão sem teto é a regra viva; −4 e −6 são somente variantes locais.
- Nenhum valor de Proeza foi aplicado e nenhum catálogo foi modificado.

**Parada:** esta é a linha de base para revisão do simulador. As taxas de câmbio não devem ser
decididas antes da conferência da Revisora.
