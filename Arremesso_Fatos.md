# Arremesso · levantamento de fatos reais

Documento de pesquisa, não de regras. Junta o que existe de medido sobre lançamento
humano, com fonte, para depois virar mecânica. Levantado em 10/08/2026.

Critério: para cada massa, o **melhor caso humano registrado**, seja ele parado,
correndo ou girando, com uma ou com duas mãos.

---

## 1. Os recordes, crus

### Objetos leves, lançados por cima com uma mão

| objeto | massa | marca | quem, quando | condição |
|---|---|---|---|---|
| bola de beisebol | 0,145 kg | **135,89 m** | Glen Gorbous, 1957 | 6 passos de corrida, vento a favor |
| bola de criquete | 0,155 kg | **128,60 m** | Robert Percival, 1882 | contestado; melhor moderno em torneio: 80,40 m |
| bola de futebol (arremesso lateral) | 0,43 kg | **51,33 m** | Thomas Grønnemark, 2010 | duas mãos, por cima da cabeça, com mortal |
| beisebol, adulto sem treino | 0,145 kg | 18 a 27 m | levantamentos de campo | referência do "homem comum" |

O recorde do beisebol é de 1957 e ninguém tentou formalmente desde então. O do
criquete é do século XIX e é tratado com ceticismo: um torneio em 2001 para tentar
batê-lo teve como vencedor 80,40 m, quase 50 metros abaixo.

### Objetos aerodinâmicos (categoria à parte, ver seção 5)

| objeto | massa | marca | quem |
|---|---|---|---|
| dardo, modelo antigo | 0,8 kg | **104,80 m** | Uwe Hohn, 1984 ("recorde eterno") |
| dardo, modelo atual | 0,8 kg | **98,48 m** | Jan Železný, 1996 |
| disco | 2,0 kg | **75,56 m** | Mykolas Alekna, 2025 |
| bumerangue | ~0,1 kg | **427,2 m** | David Schummy, 2005 |

O dardo foi redesenhado em 1986 (centro de gravidade 4 cm à frente) justamente
porque voava demais. Os 6 metros entre Hohn e Železný são mudança de implemento,
não de atleta.

### Empurrão de ombro, uma mão (peso e pedras)

| objeto | massa | marca | quem | condição |
|---|---|---|---|---|
| peso | 7,26 kg | **23,56 m** | Ryan Crouser, 2023 | giro |
| peso | 5 kg | **25,20 m** | Reese Hoffa, 2012 | giro |
| peso | 1 kg | **37 m** | Jacko Gill | relato de treino |
| pedra aberta (Highland) | 7,3 kg | **19,30 m** | Nick Kahanic, 2013 | com aproximação |
| pedra Braemar | 9,1 kg | **17,37 m** | Geoff Capes, 1981 | **parado**, sem aproximação |
| pedra Braemar | 10 kg | **15,45 m** | Burger Lambrechts Jr., 2025 | **parado** |
| pedra Braemar | 13,5 kg | **11,65 m** | Pétur Guðmundsson, 2000 | **parado** |

### Giro com braço estendido, uma mão

| objeto | massa | marca | quem | condição |
|---|---|---|---|---|
| martelo olímpico | 7,26 kg | **86,74 m** | Yuriy Sedykh, 1986 | 4 giros, cabo de 1,2 m |
| martelo escocês leve | 7,26 kg | **48,04 m** | Dan McKim, 2014 | pés fixos, cabo curto |
| martelo escocês pesado | 9,98 kg | **40,49 m** | Dan McKim, 2014 | pés fixos |
| peso para distância leve | 12,5 kg | **29,76 m** | Spencer Tyler, 2019 | uma mão, giro |
| peso para distância pesado | 25,5 kg | **15,62 m** | Spencer Tyler, 2019 | uma mão, giro |
| peso indoor | 15,88 kg | **25,86 m** | Lance Deal | duas mãos permitidas |

O mesmo 7,26 kg vai a 23,56 m no empurrão e a 86,74 m no martelo. **A técnica vale
3,7× mais que qualquer diferença de atleta.** O cabo de 1,2 m é uma alavanca que
multiplica a velocidade do ponto de soltura.

### Duas mãos, objetos pesados

| objeto | massa | marca | quem | condição |
|---|---|---|---|---|
| pedra suíça (Ohio/Toledo) | 61,25 kg | **4,66 m** | Kevin Marx, 2009 | duas mãos, corrida de 6 m |
| pedra de Unspunnen | 83,5 kg | **4,16 m** | Urs Hutmacher, 2025 | duas mãos |
| réplica do Arnold Classic | 84 kg | **3,47 m** | Mateusz Kieliszkowski, 2023 | duas mãos |

### Lançamentos para ALTURA (barril e afins)

| objeto | massa | altura | quem | mãos |
|---|---|---|---|---|
| barril de chope | 12,5 kg | **8,54 m** | Hafþór Björnsson, 2014 | duas |
| barril | 15 kg | **7,76 m** | 3 atletas, WSM 2024 | duas |
| barril | 25 kg | **6,00 m** | Hafþór Björnsson, 2012 | duas |
| peso escocês sobre a barra | 25,4 kg | **5,92 m** | Spencer Tyler, 2019 | **uma** |
| feixe de palha no forcado | 7,26 kg | **12,80 m** | Zach Riley, 2017 | forcado (ferramenta) |
| feixe de palha no forcado | 9,07 kg | **11,30 m** | Spencer Tyler, 2019 | forcado |

---

## 2. Convertendo tudo para velocidade de saída

Alcance e altura dependem da altura de soltura e do ângulo; velocidade de saída não.
Resolvendo `R = (v·cosθ/g)(v·senθ + √(v²sen²θ + 2gh))` no ângulo ótimo:

| lançamento | massa | marca | v de saída |
|---|---|---|---|
| beisebol (Gorbous) | 0,145 kg | 135,9 m | 36 m/s |
| martelo olímpico | 7,26 kg | 86,7 m | 29 m/s |
| martelo escocês | 7,26 kg | 48,0 m | 21 m/s |
| peso (Crouser) | 7,26 kg | 23,6 m | 14,5 m/s |
| pedra Braemar parado | 10 kg | 15,5 m | 11,6 m/s |
| peso para distância | 25,5 kg | 15,6 m | 12,0 m/s |
| barril 25 kg (altura) | 25 kg | 6,0 m | 10,3 m/s |
| pedra de Unspunnen | 83,5 kg | 4,2 m | 5,4 m/s |
| beisebol, sem treino | 0,145 kg | 25 m | 15 m/s |

Ressalva: para a bola de beisebol o arrasto é grande, então a velocidade real de
soltura é uns 20% maior que esses 36 m/s balísticos (medições de arremessadores de
elite dão 42 a 47 m/s). Para o peso e a pedra o arrasto é desprezível e o número
está certo.

---

## 3. O achado principal: a massa efetiva do corpo depende da técnica

Ajustando `v² = A/(m + k)` **dentro de séries homogêneas** (mesmo atleta, mesma
técnica, só a massa mudando). O `k` é a massa efetiva das partes do corpo que
aceleram junto com o objeto.

| série | faixa de massa | **k** | R² |
|---|---|---|---|
| lançamento por cima, uma mão (beisebol × dardo, por velocidade) | 0,145 a 0,8 kg | **≈ 0,4 kg** | 2 pontos |
| Jacko Gill, peso, empurrão de ombro | 1 a 8 kg | **5,2 kg** | 0,982 |
| elite do peso 2012, média de 6 atletas | 5 a 7,26 kg | 8,6 kg | 2 pontos |
| Dan McKim, martelo escocês | 7,26 a 10 kg | 6,8 kg | 2 pontos |
| Spencer Tyler, peso para distância | 12,5 a 25,5 kg | 1,0 kg | 2 pontos |
| Björnsson, barril, duas mãos, para altura | 12,5 a 25 kg | **14,5 kg** | 0,999 |
| Steinstossen, pedra suíça, duas mãos | 61 a 84 kg | **78 kg** | 2 pontos |

A série do Gill é a melhor evidência que existe: **5 massas, do 1 kg ao 8 kg, mesmo
atleta, R² = 0,982**, e o modelo reproduz o arremesso de 1 kg em 38 m contra os 37 m
relatados. A literatura da IAAF chegou ao mesmo lugar por outro caminho, ajustando
`L = l/(m + k)` com k = 6,5 kg para um homem de elite e k = 2 a 4 kg para uma mulher
de elite, e descrevendo o k, com essas palavras, como "a massa efetiva das partes do
corpo em movimento, essencialmente o braço".

**Leitura**: quanto mais corpo se move junto com o objeto, maior o k e mais chata é
a curva. O chicote do braço move mão e antebraço (0,4 kg). O empurrão de ombro move
braço, ombro e tronco (5 a 8 kg). O barril nas duas mãos move os dois braços e o
tronco (14 kg). A pedra suíça move o corpo inteiro (78 kg).

Cuidado com os ajustes de 2 pontos longe da faixa: o k = 1,0 do Tyler foi medido
entre 12,5 e 25,5 kg e não diz nada sobre 1 kg (extrapolar dele daria 197 m, o que é
absurdo). Só a série do Gill cobre uma faixa larga o bastante para extrapolar.

---

## 4. As comparações que o sistema pede

### Uma mão × duas mãos: o sinal se inverte com o peso

**Objeto pesado (~25 kg), lançado para altura**, comparação quase perfeita porque as
massas coincidem:

- peso escocês de 25,4 kg, **uma** mão, sobre a barra: 5,92 m
- barril de 25 kg, **duas** mãos: 6,00 m

Empate técnico. No peso alto, a segunda mão não acrescenta nada, e o que manda é a
extensão de quadril e pernas.

**Objeto leve:**

- beisebol de 0,145 kg, **uma** mão: 135,9 m (36 m/s)
- bola de futebol de 0,43 kg, **duas** mãos: 51,3 m (22 m/s)
- a mesma bola de futebol lançada com **uma** mão daria uns 29 m/s, ou ~89 m

Com duas mãos sai cerca de **75% da velocidade** de uma mão. A razão é que o
arremesso de duas mãos por cima da cabeça não permite o chicote: o cotovelo não
gira, o ombro não roda, e o objeto sai por extensão simétrica.

**Conclusão**: duas mãos é penalidade em objeto leve e é a **única opção** em objeto
pesado. O ponto de virada está onde o objeto deixa de caber numa mão, entre 15 e
25 kg pelo que se vê nas competições.

### Parado × correndo × girando

| técnica | ganho sobre o arremesso parado | fonte |
|---|---|---|
| peso, com deslize ou giro no círculo | **+10% a +20%** | manuais de treino; "115% do arremesso parado é considerado excelente" |
| dardo, com corrida completa | **+54%** (o parado vale ~65% da marca) | manuais de treino |
| martelo, 4 giros com cabo × pés fixos | **+81%** (48,0 → 86,7 m) | recordes |

O ganho da corrida é muito maior no dardo que no peso porque o objeto é leve: a
corrida acrescenta velocidade de corpo, e o corpo já vai a 6 a 8 m/s. Num objeto que
sai a 30 m/s isso é um acréscimo pequeno em proporção, mas o dardo se beneficia da
cadeia inteira com passo cruzado. Já no peso, o círculo tem 2,1 m e não dá para
ganhar velocidade de corpo relevante.

A comparação direta do parado no mesmo esporte existe nas pedras escocesas: a
Braemar é **obrigatoriamente parada** e a pedra aberta permite aproximação. Não são
a mesma massa (9,1 e 7,3 kg), então servem só de referência qualitativa.

---

## 5. O que não é massa: forma

O mesmo 0,8 kg vai a 98 m como dardo. O 1 kg vai a 37 m como bola de metal. O 2 kg
vai a 75,56 m como disco e iria a uns 30 m como pedra.

Dardo, disco e bumerangue **planam**: geram sustentação e ficam no ar muito além do
balístico. O bumerangue de 100 g chegando a 427 m mostra o extremo. Esses três não
podem entrar na mesma curva que peso, pedra e barril, e é por isso que a Guinness
tem uma categoria separada para "objeto sem cauda e sem recurso que ajude a
velocidade".

No outro extremo, objeto **leve demais** perde para o arrasto: a bola de beisebol de
145 g já sai 20% mais rápido do que o balístico sugere porque o ar come a diferença
durante o voo.

---

## 6. Comparação com o modelo que está no ar hoje

O sistema usa `alcance = R₀ · m₀/(m + m₀)` com `m₀ = 1 kg` e `R₀ = 136 m` no topo
humano. Traduzindo para a linguagem desta pesquisa: k = 1 kg, ou seja, uma técnica de
chicote de braço, e o ápice em 1 kg.

Confrontos:

| massa | o que o sistema dá no topo humano | melhor marca real | como |
|---|---|---|---|
| 0,145 kg | 119 m (sem o ramo do arrasto) | 135,9 m | beisebol, uma mão, corrida |
| 1 kg | **68 m** | **37 m** | peso, empurrão de ombro |
| 7,26 kg | 16,5 m | 86,7 m (martelo) / 23,6 m (peso) | |
| 25 kg | 5,2 m | 15,6 m | peso para distância, giro |
| 83,5 kg | 0,7 m | 4,2 m | pedra suíça, duas mãos |

Dois desencontros aparecem, e são de sinais opostos:

1. **No leve o sistema é generoso**: 68 m com 1 kg contra 37 m reais. Mas a marca
   real de 1 kg é um *empurrão de ombro*, e ninguém mediu um lançamento por cima com
   1 kg. Extrapolando o recorde do beisebol com k = 0,4, um objeto de 1 kg lançado
   por cima daria uns 50 a 55 m. Os 68 m continuam acima, mas dentro da mesma ordem.

2. **No pesado o sistema é severo demais**: com 25 kg ele dá 5 m, e a marca real é
   15,6 m; com 83,5 kg ele dá 70 cm, e a marca real é 4,16 m. A causa é justamente o
   k = 1 kg: com um k tão baixo a curva despenca, enquanto na vida real o corpo
   inteiro entra na conta e segura a queda.

O ponto de fundo: **um k só não descreve o lançamento humano**, porque o k é a
assinatura da técnica e não do objeto. Peso e pedra vivem em k ≈ 5 a 8, o barril
em k ≈ 14, a pedra levantada do chão em k ≈ 78, e só o chicote de braço vive em
k ≈ 0,4.

---

## 7. Números para pendurar as regras

Marcas do topo humano absoluto, por massa, na melhor técnica disponível para aquela
massa (excluídos os aerodinâmicos):

| massa | melhor marca | técnica | v de saída |
|---|---|---|---|
| 0,145 kg | 135,9 m | uma mão, por cima, com corrida | 36 m/s (real ~44) |
| 0,43 kg | ~89 m estimado | uma mão, por cima | ~29 m/s |
| 1 kg | 37 m medido (put); ~50 estimado por cima | ombro ou chicote | 18,5 m/s |
| 5 kg | 25,2 m | empurrão de ombro, giro | 15,1 m/s |
| 7,26 kg | 86,7 m com cabo; 23,6 m na mão | martelo / peso | 29 / 14,5 m/s |
| 10 kg | 40,5 m com cabo; 15,5 m parado | martelo / pedra Braemar | 19,5 / 11,6 m/s |
| 12,5 kg | 29,8 m | uma mão, giro | 16,8 m/s |
| 25,5 kg | 15,6 m | uma mão, giro | 12,0 m/s |
| 61 kg | 4,7 m | duas mãos, corrida | 5,8 m/s |
| 83,5 kg | 4,2 m | duas mãos | 5,4 m/s |

E as âncoras do outro extremo da escala, para calibrar gente comum:

- adulto sem treino, bola de beisebol: **18 a 27 m** (15 m/s)
- melhor amador moderno, bola de criquete, em torneio: **80,4 m** (28 m/s)
- peso máximo que um humano tira do chão: **~500 kg** (levantamento terra)
- pedra de Unspunnen: 83,5 kg é o limite prático do que se **arremessa** com o corpo

---

## Fontes

- [Guinness · Longest baseball throw](https://www.guinnessworldrecords.com/world-records/64701-longest-baseball-throw-male)
- [J.G. Preston · história do recorde de arremesso no beisebol](https://prestonjg.wordpress.com/2009/12/04/the-history-of-the-record-for-baseballs-longest-thrown-a-tale-that-involves-john-hatfield-honus-wagner-sheldon-lejeune-don-grate-rocky-colavito-and-glen-gorbous-among-others/)
- [Guinness · Longest throw of a cricket ball](https://www.guinnessworldrecords.com/world-records/64457-longest-throw-of-a-cricket-ball)
- [ESPNcricinfo · Percival's throw](https://www.espncricinfo.com/story/percival-s-throw-239424)
- [World Athletics · da evolução do dardo, de Held a Hohn](https://worldathletics.org/news/feature/history-javelin-implement-specifications)
- [World Athletics · Crouser 23,56 m](https://worldathletics.org/news/report/los-angeles-grand-prix-2023)
- [World Athletics · Alekna 74,35 m no disco](https://worldathletics.org/news/report/mykolas-alekna-discus-world-record-7435m-oklahoma)
- [Wikipedia · Hammer throw](https://en.wikipedia.org/wiki/Hammer_throw)
- [Wikipedia · Stone put](https://en.wikipedia.org/wiki/Stone_put)
- [Wikipedia · Weight throw](https://en.wikipedia.org/wiki/Weight_throw)
- [Wikipedia · Steinstossen](https://en.wikipedia.org/wiki/Steinstossen)
- [Wikipedia · Keg-tossing](https://en.wikipedia.org/wiki/Keg-tossing)
- [Guinness · Highest keg toss](https://www.guinnessworldrecords.com/world-records/highest-beer-keg-toss-(male))
- [IronMind · recordes de Dan McKim no martelo escocês](https://ironmind.com/news/Daniel-McKim-More-World-Records-in-the-Scottish-Hammers)
- [Wikipedia · Sheaf toss](https://en.wikipedia.org/wiki/Sheaf_toss)
- [Guinness · Longest throw of an object with no tail](https://www.guinnessworldrecords.com/world-records/longest-throw-no-tail)
- [Wikipedia · Thomas Grønnemark](https://en.wikipedia.org/wiki/Thomas_Gr%C3%B8nnemark)
- New Studies in Athletics 1.2014 · "Shot Put With Lighter Implements" ([PDF, World Athletics](https://worldathletics.org/download/downloadnsa?filename=ddf02314-d55b-48be-bde2-92751f855235.pdf&urlslug=shot-put-with-lighter-implements)) · fonte da série do Jacko Gill e do ajuste L = l/(m+k)
- Linthorne · "Throwing and jumping for maximum horizontal range" ([arXiv](https://arxiv.org/pdf/physics/0601148)) · v = √(2Fl/m), F₀ = 460 N e l = 1,65 m para um arremessador de peso de elite
- [Linthorne 2001 · Optimum release angle in the shot put](https://pubmed.ncbi.nlm.nih.gov/11266667/)
- [Australian Athletics · glide × rotational no peso](https://coachathletics.com.au/coaching-education/glide-vs-rotational-shot-put-which-technique-is-superior-a-very-deep-dive)
