# Revisão da curva de XP · multiplicativa × afim

> Análise de 2026-08-03. Compara o modelo em vigor (`nível × custo`) com o modelo proposto
> (`base + nível × multiplicador`), medido contra a matemática real dos dados do Centelha.
> Laboratório interativo: `ficha-xp-2.html`.
>
> **Leia a seção 0 primeiro.** Ela decide o *método* sem depender de nenhum valor.
> As seções 1 a 7 comparam os valores concretos que estavam sobre a mesa.

---

## 0. Escolha do método, livre de escala

Multiplicar **todos** os custos do jogo por um fator λ não muda nada: é o mesmo jogo com o
orçamento renomeado. Logo, um modelo de custo só existe **a menos de escala**, e comparar
métodos exige olhar a *forma* da escada, não os números.

Normalizando pelo primeiro ponto comprado:

| Método | Preço do nível `v` | Forma normalizada | Parâmetros de forma |
|---|---|---|---|
| Multiplicativo | `K·v` | `v` | **zero** |
| Afim | `B + M·v` | `r + v`, com `r = B/M` | **um** (`r`) |

Consequências imediatas:

1. **`(4, 2)`, `(8, 4)` e `(2, 1)` são o mesmo jogo.** Só `r = B/M` importa para a forma; o
   valor absoluto é câmbio. Isso separa a decisão em duas, independentes:
   **(i) escolher `r`** (que ficha o sistema produz) e **(ii) escolher a escala**
   (quantos XP custa um dot, e portanto o tamanho dos orçamentos).
2. **O multiplicativo é o afim com `r = 0`.** Não são métodos rivais: é a mesma família, e o
   multiplicativo está na fronteira dela. Ótimos raramente ficam na fronteira.
3. `r → ∞` é o custo plano (todo dot pelo mesmo preço). A família cobre todo o espectro.

### As duas grandezas que definem a ficha

- **Ψ** = quantas perícias **novas no nível 1** custam o mesmo que **uma perícia levada ao 6**.
- **δ = Ψ / 6** = a **sobretaxa da profundidade**. `δ = 1,00` significa que um dot custa o
  mesmo em qualquer lugar da ficha; `δ = 3,50` significa que o dot do topo custa 3,5 dots da base.

| `r` | último ÷ primeiro | Ψ | **δ** | Ficha que sai |
|---|---|---|---|---|
| **0 (multiplicativo)** | 6,00× | 21,0 | **3,50** | pico trava em 5, cauda enorme de níveis 1 |
| 1 | 3,50× | 13,5 | 2,25 | pico 6 raro, corpo no 3-4 |
| **1,5** | 3,00× | 12,0 | **2,00** | 2-3 picos no 6, corpo no 4, cauda no 1-2 |
| **2** | 2,67× | 11,0 | **1,83** | 3 picos no 6, corpo no 4-5, cauda no 2 |
| **3** | 2,25× | 9,8 | **1,63** | 4 picos no 6, corpo no 5, cauda no 2 |
| 4 | 2,00× | 9,0 | 1,50 | 10 traços no 6, começa a achatar por cima |
| ∞ (plano) | 1,00× | 6,0 | 1,00 | 15+ traços no 6, sem economia |

### O achado que decide o método

Fórmulas fechadas, com piso `f` e teto `N`:

```
Multiplicativo:  δ = (N + f + 1) / (2(f + 1))          <- só a GEOMETRIA da régua
Afim:            δ = (r + (N + f + 1)/2) / (r + f + 1)  <- r é LIVRE

Para um δ alvo:  r = [ (N + f + 1)/2 − δ(f + 1) ] / (δ − 1)
```

No método multiplicativo, **δ não é escolhido: é herdado de onde o piso e o teto caíram**.
Hoje, no Centelha:

| Traço | piso | teto | δ imposto |
|---|---|---|---|
| Habilidade primária e secundária | 0 | 6 | **3,50** |
| Centelha, Arte | 0 | 6 | **3,50** |
| Vontade, Aparência | 1 | 12 | **3,50** |
| Atributo, Virtude | 1 | 6 | **2,00** |

O jogo roda hoje com **duas sobretaxas diferentes**, e qual traço recebe qual foi decidido
apenas por o piso ser 0 ou 1. Ninguém escolheu isso. Pior: fica **75% mais caro** se
especializar numa Habilidade do que num Atributo, quando o Atributo é o que serve várias
perícias de uma vez e deveria ser a compra mais contida das duas. E quando a régua mudou de
0-5 para 0-6 (Reescala), δ subiu de 3,00 para 3,50 sem que a decisão passasse por ninguém.

**É isto que decide o método.** Não é que o afim seja "mais barato" (isso é escala, e escala
é ajustável nos dois). É que o multiplicativo tem **zero graus de liberdade** sobre a única
propriedade que realmente molda a ficha, e o valor que ele força (3,50) está muito acima de
qualquer razão de valor mecânico defensável.

### O que cada `r` produz na ficha (simulação livre de escala)

24 domínios de importância decrescente, compra gulosa (melhor valor por XP), teto 6,
orçamento normalizado para que **o primeiro ponto custe igual em todos os métodos**:

| `r` | perfil (níveis, ordenado) | dots | domínios | pico |
|---|---|---|---|---|
| **0 (mult.)** | `5554333333111111` | 44 | 17 | **5** |
| 1 | `6666444433111111` | 53 | 17 | 6 |
| 1,5 | `6666444444222211` | 59 | 17 | 6 |
| 2 | `6666544444222222` | 63 | 17 | 6 |
| 3 | `6666555555222222` | 68 | 17 | 6 |
| 4 | `6666666666221111` | 69 | 17 | 6 |
| ∞ | `6666666666666664` | 100 | 17 | 6 |

Duas leituras, ambas importantes:

**(a) O método multiplicativo nunca produz um traço no máximo.** O pico trava em 5. O nível 6
existe na ficha e na tabela de Dificuldade, mas não existe na economia. Isso não é opinião:
é o que a compra ótima faz.

**(b) O número de domínios abertos é idêntico (17) em todos os `r`.** Este é o ponto
contraintuitivo: **`r` não troca largura por profundidade.** Mantendo o preço de entrada
fixo, `r` compra altura de graça. A troca só aparece quando você mexe *também* na escala:
pela normalização oposta (fixando o custo de levar um traço ao 6), a largura desaba de 17
domínios para 5 conforme `r` sobe.

Ou seja, o par de decisões é ortogonal de verdade:
**`r` decide o formato da ficha; a escala decide se esse formato é pago em largura ou em orçamento.**

### O caso do Atributo

Quantas Habilidades de nível 1 custa o enésimo ponto de Atributo (peso do Atributo = 2× o da
Habilidade, mesma forma `r` nos dois):

| ponto | `r=0` | `r=1,5` | `r=2` | `r=3` | plano |
|---|---|---|---|---|---|
| 2º | 4,0 | 2,8 | 2,7 | 2,5 | 2,0 |
| 4º | 8,0 | 4,4 | 4,0 | 3,5 | 2,0 |
| 5º | **10,0** | 5,2 | 4,7 | 4,0 | 2,0 |
| 6º | **12,0** | 6,0 | 5,3 | 4,5 | 2,0 |

### Que δ o Centelha deveria ter

`δ` deve ser **maior que 1**, porque um traço alto vale mais que a soma dos seus dots:

- só um pool alto **alcança** o topo da régua. Dois pools de 6 nunca tiram 21 em 3d6; um pool
  de 12 tira. Dificuldade 20+ é inacessível por largura, em qualquer quantidade;
- a **Margem** (cada 6 acima do alvo) compõe com concentração, não com espalhamento;
- vários portões abrem por **nível**, não por total de dots (Técnica nível N exige Centelha ≥ N;
  especialidades limitadas a `[nível ÷ 2]`);
- em rolagem oposta, só o melhor pool conta;
- com `δ = 1` o jogador informado sempre especializa, e domínio de sistema vira o diferencial.

E deve ser **bem menor que 3,5**, porque:

- 3,5 não é preço, é proibição: ninguém paga, então o topo da régua de Dificuldade
  (Mestre, Herói, Semideus) vira decoração;
- o teto 0-6, os tetos de criação (4/3, com um pico em 5/4) e os portões narrativos já
  limitam. A curva de custo é o **quarto** freio empilhado no mesmo eixo, e o único que
  também distorce o resto da economia;
- todo otimizador converge para a mesma ficha larga e rasa: a tabela de preços escreve o
  personagem no lugar do conceito.

**Recomendação de método: afim, com `δ` entre 1,75 e 2,00.**

Para traços de piso 0 e teto 6, isso é `r` entre **1,5 e 2,33**, ou seja, **base entre 1,5× e
2,3× o multiplicador**. A intuição do exemplo (base 4, multiplicador 2, ou seja `r = 2`,
`δ = 1,83`) cai exatamente no meio da faixa. Base 4 com multiplicador 1 (`r = 4`, `δ = 1,50`)
já é o lado achatado do aceitável, e a simulação mostra o começo do achatamento por cima
(10 traços no 6).

### Detalhe de execução: `r` não é um número só

Como `δ` depende do piso e do teto, impor uma sobretaxa **uniforme** exige `r` diferente por
família de traço:

| δ alvo | Habilidades, Centelha, Arte (piso 0, teto 6) | Atributos, Virtudes (piso 1, teto 6) | Vontade, Aparência (piso 1, teto 12) |
|---|---|---|---|
| 2,00 | r = 1,50 | r = 0 (já está em 2,00) | r = 3,00 |
| **1,75** | **r = 2,33** | **r = 0,67** | **r = 4,67** |
| 1,50 | r = 4,00 | r = 2,00 | r = 8,00 |

Fica em aberto uma decisão de design que hoje está sendo tomada por acidente: **o Atributo
deve ter sobretaxa maior ou menor que a Habilidade?** Como um ponto de Atributo serve várias
perícias, o argumento é que ele deveria ser a compra *mais* contida, ou seja `δ_atributo >
δ_habilidade`. O sistema atual faz o contrário (2,00 contra 3,50).

---

## 1. As duas fórmulas

Seja `f` o piso do traço (nível já pago na criação: 1 para Atributos e Virtudes, 0 para
Habilidades) e `S(x) = x(x+1)/2`.

| | Preço de UM nível `v` | Total até o nível `L` |
|---|---|---|
| **Antigo** (multiplicativo) | `K · v` | `K · [S(L) − S(f)]` |
| **Novo** (afim) | `B + M · v` | `B·(L − f) + M · [S(L) − S(f)]` |

O modelo novo **contém** o antigo: basta `B = 0` e `M = K`. E contém também o custo plano
(`M = 0`, todo dot pelo mesmo preço). Ou seja, não são dois modelos rivais: são dois pontos
de uma mesma família de um parâmetro a mais. O que muda é onde você põe o peso.

- **M** é a curvatura: a parte que faz o nível 6 doer.
- **B** é um pedágio fixo, cobrado a cada nível independentemente de qual seja.

### Nível de equilíbrio

Igualando os dois totais:

```
L* = 2B / (K − M) − f − 1
```

Abaixo de `L*` o modelo novo é **mais caro**; acima, mais barato. É o parâmetro de projeto
mais útil que existe aqui, porque `L*` é literalmente **onde você decide que "vale a pena
se especializar"**. Nos defaults propostos:

| Traço | K | B | M | L* |
|---|---|---|---|---|
| Atributo | 8 | 8 | 2 | 0,67 |
| Habilidade primária | 4 | 4 | 1 | **1,67** |
| Habilidade secundária | 2 | 2 | 1 | 3,00 |
| Centelha / Proeza / Arte | 10 | 10 | 3 | 1,86 |

`L* = 1,67` nas primárias quer dizer que só o **nível 1** ficou mais caro (5 em vez de 4).
Do nível 2 em diante tudo é desconto. Se a intenção era "cobrar pela largura e baratear a
profundidade", o pedágio ficou baixo demais para morder.

### Curvatura

Ajustando `T(L) ≈ c·L^α` no intervalo de jogo (1 a 6), habilidade primária:

| | T(1) | T(6) | α | parcela quadrática no teto |
|---|---|---|---|---|
| Antigo | 4 | 84 | **1,70** | 86% |
| Novo | 5 | 45 | **1,23** | 40% |

O modelo novo não elimina a escalada: ele a corta pela metade. O total continua quadrático
(`0,5·L² + 4,5·L`), só que agora o termo **linear domina** (27 dos 45 XP do teto). É por isso
que a escada 5·6·7·8·9·10 "parece" linear: ela é 60% linear.

---

## 2. O que os defaults propostos preservam (e o que quebram)

### Preservam: a taxa de câmbio Atributo ÷ Habilidade

Porque `(8, 2)` é exatamente o dobro termo a termo de `(4, 1)`:

```
(8 + 2v) / (4 + v) = 2  para todo v
```

Um ponto de Atributo custa **exatamente 2 habilidades** em todos os níveis, nos dois modelos.
Isso não é acidente feliz de arredondamento, é identidade algébrica. A escolha de defaults
está certa nesse ponto e não precisa ser mexida: **mantenha sempre `B_atrib = 2·B_hab` e
`M_atrib = 2·M_hab`.**

### Escadas lado a lado

| Traço | Antigo (marginal) | Novo (marginal) | Antigo (acum.) | Novo (acum.) | teto |
|---|---|---|---|---|---|
| Hab. primária | 4·8·12·16·20·24 | 5·6·7·8·9·10 | 4·12·24·40·60·84 | 5·11·18·26·35·45 | **54%** |
| Atributo (nv 2-6) | 16·24·32·40·48 | 12·14·16·18·20 | 16·40·72·112·160 | 12·26·42·60·80 | **50%** |
| Virtude | 6·9·12·15·18 | 5·6·7·8·9 | 6·15·27·42·60 | 5·11·18·26·35 | 58% |
| Vontade / Aparência | 4·6·8…24 | 4·5·6…14 | 4·10·18…154 | 4·9·15…99 | 64% |
| Proeza (plano) | 10·20·30·40·50·60 | 13·16·19·22·25·28 | idem | idem | **47%** |
| Arte / Centelha | 10·20·30·40·50·60 | 13·16·19·22·25·28 | 10·30·60·100·150·210 | 13·29·48·70·95·123 | 59% |

### Quebram: o teto da ficha

Somando todos os Atributos e todas as Habilidades primárias no 6:

| | Atributo 6 | Hab. 6 | **Ficha cheia (9 atr + 24 hab)** |
|---|---|---|---|
| Antigo | 160 | 84 | **3456 XP** |
| Novo proposto | 80 | 45 | **1800 XP** |

O orçamento de **herói é 2600 XP**. No modelo novo, 1800 XP compram *todos* os nove
Atributos em 6 e *todas* as 24 Habilidades primárias em 6, e ainda sobram 800. O orçamento
mais alto do jogo passa a ser maior que a ficha inteira. Isso não é um ajuste de calibragem,
é o colapso do espaço de escolha: acabou a economia.

Simulação de compra gulosa (mais valor por XP primeiro, Atributo valendo 2,5 habilidades):

| Orçamento | Antigo | Novo |
|---|---|---|
| 600 | A[444333222] H[3333222222111111] · 57 dots | A[666444111] H[6655222222] · 67 dots |
| 1000 | A[555443222] · 86 dots | A[666666333] · 108 dots |
| **1500** | A[666555333] · **104 dots** | A[666666666] + 16 habs no 6 · **161 dots** |
| 2000 | A[666666444] · 125 dots | **saturado em 1800** · 198 dots |
| 2600 | A[666666665] · 153 dots | **saturado em 1800** · 198 dots |

---

## 3. Quanto vale um ponto (a matemática dos dados)

O pool `N = Atributo + Habilidade` vira `⌊N/2⌋ d6`, com `+2` fixo se `N` for ímpar.

### O valor bruto é linear, e alterna

| Passo | ΔE(total) | ΔVariância |
|---|---|---|
| par → ímpar | **+2,00** | **0** |
| ímpar → par | +1,50 | +2,92 |

Média de +1,75 por ponto, ou seja `E ≈ 1,75·N`. Como a régua de Dificuldade também é linear
(5·10·15·20·25·30 contra pools 3·6·9·12·15·18), **3 pontos de pool = 1 tier de dificuldade**,
em qualquer ponto da escala. O valor bruto de um dot é constante.

Detalhe de projeto que vale registrar: o passo para **pool ímpar é estritamente melhor**,
ganha mais valor esperado (+2 contra +1,5) e não adiciona variância nenhuma. Com uma curva de
custo achatada, essa alternância fica proporcionalmente mais visível para o jogador: no modelo
novo, subir de pool 6 para 7 custa 10 XP e rende +2; de 7 para 8 custa 12 e rende +1,5. Vira
uma micro-otimização perceptível, coisa que a curva antiga escondia sob o ruído dos preços.

### O valor útil é sigmoide

Probabilidade de sucesso (total **supera** a Dificuldade):

| pool | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|
| **Dif 10** | 8,3% | 27,8 | 50,0 | 74,1 | 84,1 | 94,6 | 96,8 | 99,3 | 99,5 |
| **Dif 15** | 0 | 0 | 4,6 | 16,2 | 33,6 | 55,6 | 69,5 | 84,8 | 90,4 |
| **Dif 20** | 0 | 0 | 0 | 0 | 2,7 | 9,7 | 22,1 | 40,0 | 54,6 |

A régua está bem calibrada: "à altura" dá cara-ou-coroa (pool 6 contra Dif 10 = 50,0%
exato; pool 12 contra Dif 20 = 54,6%).

O que interessa para custo é a **derivada**, não o nível. Contra a Dif 20, os pontos de pool
7 a 12 rendem 2,7 · 7,0 · 12,4 · 17,8 · 14,7 pontos percentuais. O ganho **cresce** até o
limiar e só depois desaba. Existe um muro: abaixo do limiar os dots quase não compram nada, e
o valor se concentra exatamente na faixa que a curva antiga torna mais cara.

### Eficiência: pontos percentuais por XP

Custo do próximo ponto de pool, na divisão ótima entre Atributo e Habilidade:

| pool | ΔP (Dif 20) | XP antigo | XP novo | pp/XP antigo | pp/XP novo |
|---|---|---|---|---|---|
| 8→9 | 7,0 | 24 | 14 | 0,293 | 0,502 |
| 9→10 | 12,4 | 32 | 16 | 0,388 | 0,776 |
| 10→11 | 17,8 | 40 | 18 | 0,446 | 0,990 |
| 11→12 | 14,7 | 48 | 20 | 0,306 | 0,734 |

**Este é o argumento a favor da mudança.** No modelo antigo, o preço sobe (24 → 48) justamente
no trecho em que o jogador está atravessando o muro da Dif 20. O sistema cobra mais caro pelo
que o jogador mais precisa, e o resultado prático é que ninguém atravessa: o herói fica parado
no pool 9 e as dificuldades altas viram decoração. No modelo novo o preço sobe de 14 para 20 e
a travessia acontece.

---

## 4. Como a decisão redistribui o XP

### 4.1 Largura contra profundidade

XP por ponto comprado, habilidade primária:

| nível | 1 | 2 | 3 | 4 | 5 | 6 | razão topo/base |
|---|---|---|---|---|---|---|---|
| Antigo | 4,0 | 6,0 | 8,0 | 10,0 | 12,0 | 14,0 | **3,50×** |
| Novo | 5,0 | 5,5 | 6,0 | 6,5 | 7,0 | 7,5 | **1,50×** |

No modelo antigo, um dot de perícia no 6 custa 3,5 dots de perícia no 1. Um sistema assim
**paga para você se espalhar**, e é exatamente o que o capítulo de criação já observa
("boa parte do bolo se converte em largura"). O modelo novo corta esse prêmio de 3,5 para 1,5.

Consequência direta: em 400 XP de habilidades, o antigo compra 48 pontos espalhados no nível
3 ou 24 pontos no nível 6. O novo compra 66 no nível 3 ou 48 no nível 6. A largura continua
ganhando, mas por 1,4× em vez de 2,0×.

### 4.2 Quem ganha e quem perde na ficha

Reprecificando os três exemplos canônicos do capítulo de criação, compra a compra:

| Bloco | Kael 1500 | Sora 2000 | Veil 2600 |
|---|---|---|---|
| Atributos | 448 → 264 (59%) | 552 → 322 (58%) | 576 → 336 (58%) |
| Habilidades | 208 → 152 (73%) | 280 → 206 (74%) | 288 → 212 (74%) |
| Secundárias | 24 → 28 (**117%**) | 54 → 59 (109%) | 54 → 57 (106%) |
| Especialidades | 24 → 30 (**125%**) | 40 → 50 (125%) | 40 → 50 (125%) |
| Virtudes | 54 → 39 (72%) | 84 → 58 (69%) | 84 → 58 (69%) |
| Vontade | 54 → 39 (72%) | 70 → 49 (70%) | 70 → 49 (70%) |
| Centelha | 60 → 48 (80%) | 60 → 48 (80%) | 100 → 70 (70%) |
| Proezas | 610 → 473 (78%) | 830 → 599 (72%) | 890 → 607 (68%) |
| Artes | — | — | 440 → 332 (75%) |
| **TOTAL** | **1500 → 1088** | **1998 → 1413** | **2560 → 1786** |
| **Sobra** | **412 XP** | **585 XP** | **774 XP** |

Padrão claro: **quem tem piso 1 e escala longa (Atributos, Virtudes, Vontade) leva o maior
desconto**; quem é comprado em nível baixo e em quantidade (Secundárias, Especialidades)
fica **mais caro**. Isso porque o pedágio `B` incide por nível, então quem compra 5
especialidades no nível 1 paga 5 pedágios e nunca chega à parte descontada da curva.

Efeito líquido na fatia do orçamento: Atributos caem de 43% para 37% do bolo, e tudo que é
comprado "aos punhados" sobe. A ficha fica mais horizontal, não menos, o que é o oposto da
intenção declarada.

### 4.3 O problema específico das Proezas

Proeza usa o modo **plano** (paga o preço do nível, não acumula) e vale **35% a 42% do
orçamento** dos três exemplos. É o maior bloco de gasto do jogo, maior que Atributos.

| nível | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Antigo | 10 | 20 | 30 | 40 | 50 | 60 |
| Novo | 13 | 16 | 19 | 22 | 25 | 28 |
| Proeza ÷ Hab. de mesmo nível (novo) | 2,60 | 1,45 | 1,06 | 0,85 | 0,71 | **0,62** |

Uma Proeza de nível 6 passaria a custar **28 XP, menos que levar uma perícia de 0 a 6 (45)**.
A compra mais poderosa do jogo viraria a mais barata.

A causa é estrutural e vale isolar: **em traço acumulativo, `B` é cobrado uma vez por nível;
em traço plano, `B` é cobrado uma vez só.** São dois papéis diferentes para o mesmo parâmetro.
Usar `(10, 3)` nos dois é o que produz a distorção. Para um traço plano com teto preservado:

```
B + M·6 = 60   e   razão topo/base = (B + 6M)/(B + M)
```

- razão 2,0 → `B = 24, M = 6` → 30·36·42·48·54·60 (mata o toolbox de proezas baratas)
- razão 3,0 → `B = 12, M = 8` → 20·28·36·44·52·60
- razão 4,0 → `B = 6, M = 9` → 15·24·33·42·51·60 ← preserva a entrada barata

---

## 5. Como o Mestre distribui XP

### 5.1 O que muda no ritmo

Custo do próximo dot, por faixa:

| | 1→2 | 2→3 | 3→4 | 4→5 | 5→6 |
|---|---|---|---|---|---|
| Habilidade antigo / novo | 8 / 6 | 12 / 7 | 16 / 8 | 20 / 9 | 24 / 10 |
| Atributo antigo / novo | 16 / 12 | 24 / 14 | 32 / 16 | 40 / 18 | 48 / 20 |

E o custo de **subir um tier inteiro de dificuldade** (pool +3), na linha de assinatura:

| tier | antigo | novo |
|---|---|---|
| pool 3 → 6 (Fácil → Média) | 44 | 24 |
| pool 6 → 9 (Média → Difícil) | 68 | 36 |
| pool 9 → 12 (Difícil → Limite humano) | **120** | **54** |

A faixa humana inteira (pool 6 → 12) custa 188 XP de assinatura no antigo e 90 no novo.
Considerando a ficha inteira (a assinatura é ~60% do gasto), são **415 XP contra 213**.

**Consequência para a premiação: no modelo antigo o Mestre precisa inflacionar o prêmio ao
longo da campanha; no novo, não.** Para manter o ritmo de um tier a cada 10 sessões, só na
assinatura:

| tier | XP/sessão antigo | XP/sessão novo |
|---|---|---|
| 3 → 6 | 4,4 | 2,4 |
| 6 → 9 | 6,8 | 3,6 |
| 9 → 12 | **12,0** | 5,4 |

O antigo exige quase **triplicar** o prêmio entre o começo e o fim da campanha para que o
jogador continue sentindo progresso. O novo exige 2,25×. É uma melhora real, mas note: **o
novo modelo não torna a progressão constante**, porque o total continua quadrático. Quem
quiser progressão de ritmo constante precisa de `M = 0` (custo plano por nível).

### 5.2 Tabelas de premiação

**Se ficar no modelo antigo** (prêmio escalonado por tier da mesa):

| Faixa da mesa | pool típico | XP/sessão | Efeito |
|---|---|---|---|
| Iniciante | 3 a 6 | 6 a 8 | 1 dot de perícia a cada 1,5 sessão |
| Competente | 6 a 9 | 10 a 12 | 1 dot a cada 1,5 sessão, atributo a cada 3 |
| Perito | 9 a 12 | 16 a 20 | mantém o ritmo na faixa cara |

**Se adotar o modelo novo** (prêmio quase fixo funciona):

| Ritmo desejado | XP/sessão | Hab. 3→4 | Atrib. 3→4 | Tier 6→9 |
|---|---|---|---|---|
| Lento (crônica longa) | 3 | 2,7 sessões | 5,3 | 12 |
| **Padrão** | **5** | **1,6 sessões** | **3,2** | **7,2** |
| Rápido | 8 | 1,0 sessão | 2,0 | 4,5 |
| Heroico | 10 | 0,8 sessão | 1,6 | 3,6 |

Regra de bolso: **o prêmio por sessão no modelo novo deve ser ~55% do que era no antigo**
para o mesmo ritmo percebido.

### 5.3 Recomendações de método, independentes do modelo

1. **Prêmio fixo por sessão + bônus por marco.** Base de 3 a 5 XP por sessão comparecida,
   mais 10 a 20 XP no fecho de arco. O fixo garante que quem falta não fica para trás demais;
   o marco é onde o Mestre premia o que a mesa fez de fato.
2. **XP direcionado.** Boa parte da distorção largura-contra-profundidade some se parte do
   prêmio for carimbada: "5 XP livres + 3 XP que só podem ir para o que você usou em jogo".
   Isso simula treino e reduz a otimização de planilha, que é o que a curva de custo tenta
   (mal) controlar sozinha.
3. **O portão narrativo continua sendo o freio mais forte.** A regra da Centelha
   (`centelhaGate`) já reconhece isso. Com uma curva mais barata, vale estender o mesmo
   princípio: **Atributo 6 e Habilidade 6 exigem justificativa de ficção**, não só XP. Um
   freio narrativo é mais barato de manter que um freio econômico e não distorce o resto
   da economia.
4. **Não misture orçamento de criação com prêmio de campanha.** Se a curva mudar, o orçamento
   de criação (1500/2000/2600) e o bestiário precisam ser reconvertidos juntos, senão os
   monstros convertidos ficam subdimensionados de um dia para o outro.

---

## 6. Recomendação

A forma afim é **a escolha certa**. O diagnóstico que ela resolve é real e está medido na
seção 3: a curva antiga cobra mais caro exatamente no trecho em que o dot vale mais
(a travessia do muro da Dificuldade), e o resultado é uma mesa que nunca chega às
dificuldades altas que o próprio livro tabelou. Um jogo cujo tema é exceder o limite humano
não deveria tornar o limite humano economicamente inviável.

O problema não é a forma, são os **parâmetros**. `B = K` e `M = K/4` cortam o teto pela
metade e derrubam a economia inteira. Três calibragens possíveis:

| | Hab. primária | Atributo | Teto da ficha | vs antigo | razão topo/base | Orçamentos |
|---|---|---|---|---|---|---|
| **A. Proposto** | B4 M1 → 5·6·7·8·9·10 | B8 M2 | 1800 | 52% | 2,00 | 1500→870 · 2600→1508 |
| **B. Meio-termo** | B6 M1 → 7·8·9·10·11·12 | B12 M2 | 2268 | 66% | 1,71 | 1500→1080 · 2600→1872 |
| **C. Neutro** | B7 M2 → 9·11·13·15·17·19 | B14 M4 | 3366 | 97% | 2,11 | **inalterados** |

**Recomendo a C.** Ela entrega o objetivo declarado por inteiro (a razão entre o dot mais
caro e o mais barato cai de 6,00 para 2,11, que é *mais* achatado que a opção A em termos
relativos) sem tocar em nada mais do jogo:

```
Habilidade primária  B=7  M=2  →  marginal  9 · 11 · 13 · 15 · 17 · 19
                                 acumulado  9 · 20 · 33 · 48 · 65 · 84   (antigo: 4·12·24·40·60·84)

Atributo             B=14 M=4  →  marginal 22 · 26 · 30 · 34 · 38
                                 acumulado 22 · 48 · 78 · 112 · 150      (antigo: 16·40·72·112·160)
```

O acumulado bate no teto (84 e ~150 contra 160), o nível 5 é idêntico (112), e o custo de
subir um tier fica praticamente igual ao atual (pool 6→9 custa 67 contra 68). Ou seja:

- orçamentos 1500/2000/2600 continuam válidos;
- os três exemplos do capítulo continuam fechando;
- o bestiário convertido continua calibrado;
- e mesmo assim a perícia de nível 6 passa a custar 19 XP em vez de 24, enquanto a de nível 1
  passa a custar 9 em vez de 4.

O preço da opção C é que **dabbling fica caro** (`L* = 6`, o novo é mais caro que o antigo em
todos os níveis abaixo do teto). Isso é uma escolha de design, não um defeito: é a inversão
exata do prêmio à largura que o capítulo de criação já identificou como um problema. Se a
intenção for manter o "toolbox largo" como identidade do sistema, a opção **B** é o
compromisso, com corte de orçamento de ~28%.

Se a opção **A** for mantida como está, três consertos são obrigatórios:

1. **Orçamentos** para 1050 / 1400 / 1800 (fator ~0,70, medido nos três exemplos).
2. **Proezas** reparametrizadas à parte, `B = 6, M = 9` (15·24·33·42·51·60), porque em traço
   plano o `B` tem papel diferente e `(10, 3)` deixa a Proeza 6 mais barata que uma perícia.
3. **Teto de ficha**: com 1800 XP saturando Atributos e Habilidades, ou o teto sobe de 6, ou
   os níveis 5 e 6 passam a exigir portão narrativo como a Centelha.

---

## 7. Pendências que isto abre

- [ ] **[DECIDIR]** Qual calibragem: A (barata, reconverte tudo), B (meio-termo) ou C (neutra).
- [ ] **[DECIDIR]** Se a largura deve continuar sendo premiada ou taxada. É a pergunta de
      design por trás de `L*`, e responde as três opções de uma vez.
- [ ] **[FAZER]** Reparametrizar traços planos (Proeza) separadamente dos acumulativos.
- [ ] **[FAZER]** Se mudar: recustear `regras.json → xp`, os três exemplos de criação, as raças
      e o bestiário no mesmo commit.
- [ ] **[DECIDIR]** Portão narrativo para Atributo/Habilidade 6, no molde do `centelhaGate`.
