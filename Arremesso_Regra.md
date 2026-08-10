# Arremesso · rascunho da regra nova

Proposta, não regra fechada. Os fatos que sustentam cada número estão em
[Arremesso_Fatos.md](Arremesso_Fatos.md). Escrito em 10/08/2026.

O que muda em relação ao que está no ar: o ápice sai de 1 kg, a parede sai de P e vai
para P/4, e a curva do meio vira uma raiz quadrada. O que **fica igual**: as duas
reservas (FAH e FAA), as quatro faixas de carga, os quatro fatores de forma, o alcance
livre como fração e as quatro bandas de −3.

---

## 1. As duas reservas, sem mudança

```
FAH = 3 × Força + Halterofilismo          →  peso máximo P, pela tabela de levantamento
FAA = 2 × Força + Atletismo + Arremesso   →  alcance
```

Humano médio: Força 2, Atletismo 1, Arremesso 0 → **FAA 5**, FAH 6, **P 76 kg**.
Topo humano: tudo em 6 → **FAA 24**, FAH 24, **P 500 kg**.

## 2. O alcance máximo, em três regimes

Todo arremesso é na melhor situação possível: correndo e/ou girando, o ganho já está
embutido na constante.

```
Ápice     = 0,1 kg                       (onde a curva vira)
Teto      = P ÷ 4                        (acima disso não se arremessa)
Queda     começa em 80% do Teto

massa < 0,1 kg      Alcance = (2 × FAA ÷ 0,316) × (massa ÷ 0,1)^0,15
0,1 kg a 0,8×Teto   Alcance = 2 × FAA ÷ √massa
0,8×Teto a Teto     Alcance = (2 × FAA ÷ √massa) × (Teto − massa) ÷ (0,2 × Teto)
acima do Teto       não arremessa

tudo × o fator de forma
```

Na mesa, em uma frase: **o alcance é o dobro da sua Força de Arremesso, dividido pela
raiz do peso**. Abaixo de 100 g ele para de crescer e cada vez que o peso cai pela
metade o alcance perde 10%. Perto do teto ele desaba.

### Por que a raiz quadrada

Medindo a massa efetiva do corpo (`k`) em quatro séries homogêneas que cobrem 500× em
massa, ela dá sempre **k ≈ 1,7 × a massa do objeto**: Bradstock 0,30 onde o modelo prevê
0,31, a pedra suíça 78 onde prevê 68. Se o `k` é proporcional à massa, a álgebra de
`v² = A/(m+k)` colapsa e a envoltória vira exatamente uma raiz. Ajustando os onze
melhores casos reais: `alcance = 45,9 × massa^−0,488`, R² = 0,971. O expoente é −0,5.

### Por que o ápice em 100 g

A velocidade de saída **satura**: um objeto de 2 g e um de 50 g saem à mesma velocidade,
porque a inércia do braço domina os dois. Abaixo do ápice não se ganha velocidade e só se
perde para o ar. O ápice medido por integração fica em 58 g para chumbo, 65 para ferro,
109 para pedra, 185 para madeira. **100 g é o meio dessa faixa**, e o fator de forma
cobre o resto.

Confirmação independente: os recordes de funda usam projéteis de **52 g e 62 g**. Quem
otimizou alcance a vida inteira convergiu para a mesma faixa.

### Por que o teto em P/4

O peso máximo não é um número só: cai conforme a altura que ele precisa percorrer.
Arremessar custa **0,16 × P** nos recordes (pedra de Unspunnen 83,5 kg contra
levantamento terra de 510 kg). P/4 dá folga sobre isso e põe o teto do topo humano em
125 kg, com a queda começando em 100 kg, que é o que se pediu.

## 3. O fator de forma, como já é

| Forma | Fator | Exemplos |
|---|:---:|---|
| Nada aerodinâmico | **÷ 2** | saco de grãos, mochila, um corpo, tora, banco |
| Pouco aerodinâmico | **× 1** | pedra, bola de ferro, jarro, barril, adaga comum |
| Aerodinâmico | **× 1,5** | armas de arremesso em geral, escudo, disco |
| Muito aerodinâmico | **× 2** | arma aerodinâmica Ótima com os dois pontos em Distância |

**Ressalva medida, para decidir depois**: a física da densidade seccional
`B = massa ÷ (Cd × área frontal)` diz que o degrau de baixo é mais duro que ÷2. Um
baralho de cartas (B = 16) e uma bola de beisebol (B = 99) pesam quase o mesmo e o
baralho chega a **22% do alcance** do beisebol, não a 50%. Se algum dia isso incomodar
na mesa, o conserto é o degrau de baixo virar ÷3.

## 4. A tabela das duas referências

| peso | humano médio (FAA 5, P 76) | topo humano (FAA 24, P 500) | objeto típico |
|---|---|---|---|
| 10 g | 22 m | 108 m | moeda, pedrinha |
| 50 g | 29 m | 137 m | bola de golfe |
| **100 g** | **32 m** | **152 m** | ovo, pedra pequena · o ápice |
| 200 g | 22 m | 107 m | adaga de arremesso |
| 500 g | 14 m | 68 m | machadinha |
| 1 kg | 10 m | 48 m | pedra, martelo |
| 2 kg | 7 m | 34 m | machado, tijolo |
| 5 kg | 4,5 m | 22 m | pedra grande |
| 10 kg | 3 m | 15 m | bigorna pequena |
| 25 kg | não ergue | 10 m | barril |
| 50 kg | — | 7 m | saco de grãos |
| 80 kg | — | 5 m | pedra de levantar |
| 100 kg | — | 5 m | começa a queda |
| 110 kg | — | 3 m | na queda |
| 120 kg | — | 1 m | quase zero |
| 125 kg | — | não arremessa | o teto |

## 5. A conferência contra a realidade

| marca real | massa | real | a regra | erro |
|---|---|---|---|---|
| Bola de golfe · Bradstock | 46 g | 155,4 m | 135,1 m | −13% |
| Beisebol · Gorbous | 145 g | 135,9 m | 126,1 m | −7% |
| Celular · Bradstock | 150 g | 120,7 m | 123,9 m | +3% |
| Bola de futebol, uma mão | 430 g | 89,0 m | 73,2 m | −18% |
| Peso 1 kg · Gill | 1 kg | 37,0 m | 40,0 m | +8% |
| Peso 5 kg · Hoffa | 5 kg | 25,2 m | 19,7 m | −22% |
| Peso 7,26 kg · Crouser | 7,26 kg | 23,6 m | 17,8 m | −24% |
| Pedra Braemar | 10 kg | 15,4 m | 12,6 m | −18% |
| Barril 25 kg | 25 kg | 12,1 m | 8,0 m | −34% |
| Pedra suíça | 61 kg | 4,7 m | 4,6 m | −1% |
| Unspunnen | 83,5 kg | 4,2 m | 3,3 m | −22% |
| Beisebol · destreinado | 145 g | 25,0 m | 26,3 m | +5% |

**Erro médio absoluto 15%, pior caso 34%**, com o FAA de cada atleta estimado por
julgamento. A tendência de ficar 20% abaixo entre 5 e 10 kg é o arremesso de peso, que
é a modalidade mais otimizada do atletismo. O jogo perder para o recorde mundial nesse
ponto não é defeito.

## 6. O alcance livre e as penalidades, como já é

Fica tudo: o alcance livre é uma fração do máximo, dada pela estabilidade de voo da
arma (3/4 para dardo empenado, 1/2 para objeto improvisado, 1/3 para machado que gira),
e o que sobra entre o livre e o máximo é cortado em quatro, a −3 por parte.

Isso bate com o medido: o arremesso preciso do campo externo no beisebol é 76 m contra
um máximo de 136 (**56%**), e no estudo com réplicas das lanças de Schöningen os atletas
acertavam até 20 m com máximo perto de 40 (**50%**). O padrão de 1/2 para objeto
improvisado está no lugar certo.

## 7. O que ainda não está na regra

**Ferramentas que estendem o braço.** Medido: funda **+30% a +70%** conforme a perícia
(recorde de 437 m com pedra de 52 g), correia grega no dardo **+58%**, propulsor
(recorde de 258 m), cabo do martelo **+81%**. O jogo tem funda como arma e hoje ela não
tem número próprio. Proposta: **×1,5 para funda**, como um fator ao lado do de forma.

**A energia que chega.** Uma pedrinha de 2 g voa 94 m e entrega 2 J, que não machuca
ninguém. Referências: picada 5 J, flecha de arco 60 J, soco forte 150 J. O corte da
ponta leve é energia, não distância, e hoje não existe regra para isso.

**Limite de pegada.** O peso olímpico tem 11 a 13 cm de diâmetro por regra, porque é o
que a mão segura. Objeto mais gordo que isso não sai de uma mão.

**Duas mãos.** Medido: no objeto leve sai **75% da velocidade** de uma mão (o arremesso
lateral do futebol contra o beisebol); no objeto pesado **empata** (peso escocês de
25,4 kg com uma mão a 5,92 m de altura contra barril de 25 kg com duas a 6,00 m). Ou
seja: duas mãos é penalidade no leve e é a única opção no pesado.

**O peso do arremessador: abstrair.** O recuo do corpo é 1% com 1 kg, 5% com 7 kg, 18%
com 25 kg e 60% com 84 kg. Até 5 kg não importa, e é isso que cobre tudo que se joga em
jogo. E em atletas de elite a marca correlaciona com **força** (r = 0,87 a 0,93) e com
comprimento de braço, mas **não** com peso corporal.
