# 09 · A bateria grande

**03/09/2026.** 10.800 batalhas, 48 células, 23,9 s, zero inválidas. Commit `fdc9eab`,
semente mestre 20260903.

> **Esta é a SEGUNDA execução da grade.** A primeira rodou no commit `3544505` e serviu para
> levantar as quatro perguntas de regra que estavam presas no código sem ninguém ter decidido.
> As quatro foram respondidas e implementadas (a §5.1), e a bateria rodou de novo do zero, com a
> régua nova. **Os números aqui são os da segunda**; onde a resposta moveu alguma coisa, o
> movimento está escrito.

---

## 0 · O escopo, sem suavizar

**Duas invenções definem o alcance de tudo o que vem depois, e por isso estão aqui e não
no fim.**

**A política é a `decisaoAutomatica` do produto**, e ela faz duas coisas: ataca o inimigo de pé
mais próximo, e foge quando a Vida cai abaixo de um limiar. Não recua, não protege ninguém, não
escolhe alvo, não muda de ideia. Toda leitura desta bateria é sobre **esse robô**. Ela não é
minha invenção, é a do produto, o que é uma posição melhor mas não deixa de ser uma invenção.

**A manobra é sempre `simples`**, porque a política não escolhe manobra. Consequência dura:
**nenhuma das 10.800 batalhas exercita rajada ou empunhadura dupla**, e portanto o conserto do
L11 (a penalidade de dados por golpe, que era o defeito que abriu esta frente) **não é testado
por esta bateria**. Ele é testado pelo `test-lance.mjs` e pelo espelho de motor; aqui, não.

O que a bateria **mede**: a carga de mestre por Tick e por golpe, a composição dela em decisão,
julgamento e aritmética, e como as duas variam com o ciclo das armas, a distância inicial, o
tamanho da cena e o limiar de fuga. O que ela **não** mede está na §7.

> **A régua foi fixa.** O manifesto carimba commit, `dados_hash` e árvore limpa antes da primeira
> batalha. Uma bateria de sanidade rodou antes, com o propósito de falhar; ela falhou duas vezes
> (o eixo E4 inerte, na primeira volta), o conserto entrou, e a grande rodou **do zero** com o
> commit novo, as duas vezes.

---

## 1 · A fase, e por que ela existe

Na bateria de 02/09, cinco das seis células coprimas terminavam em `fuga-consumada` em 71% a
100% das voltas. Uma média que junta a perseguição com o combate é a média de dois jogos
diferentes: a mesma armadilha que fez os 59,9% da primeira bateria serem metade impasse.

Agora cada batalha se parte em duas: **antes da primeira declaração de fuga, e depois**. A troca
vale no Tick **seguinte** ao da declaração, para que todo Tick pertença inteiro a uma fase e os
dois `ticks` somem o total.

### 1.1 A fuga é curta, e não é onde a carga mora

| célula (limiar 25%) | Ticks de combate | Ticks de fuga | gestos no combate | gestos na fuga |
|---|---:|---:|---:|---:|
| coprimo · encostado · 2×8 | 16,3 | **1,0** | 155 | 1 |
| coprimo · encostado · 1v1 | 34,8 | **0,3** | 73 | 0 |
| coprimo · média · 2×8 | 27,2 | 18,4 | 152 | 111 |
| coprimo · extrema · 2×8 | 44,7 | 26,1 | 156 | 140 |

**A fase de fuga é de 0,3 a 26 Ticks contra 16 a 2.000 de combate**, e nas células encostadas ela
é literalmente um Tick. Ela não engole a carga. O que ela engole é o **desfecho**, e por isso a
linha "fim dominante" da tabela C precisa ser lida com cuidado (§4).

### 1.2 A composição DIFERE entre as fases, e o número do topo é o do combate

| célula (limiar 25%) | combate: piso–teto | fuga: piso–teto | Δ teto |
|---|---|---|---:|
| coprimo · encostado · 2×8 | 23%–49% | 1%–3% | **−46** |
| coprimo · encostado · 1v1 | 24%–49% | 8%–9% | **−41** |
| coprimo · média · 1v1 | 24%–49% | 4%–25% | −25 |
| coprimo · longa · 3×3 | 23%–49% | 8%–37% | −12 |
| coprimo · extrema · 3×3 | 22%–49% | 25%–47% | −1 |
| coprimo · longa · 2×8 | 17%–59% | 15%–63% | **+4** |

**Onde a fuga é curta ela é quase toda decisão e passo** (declarar a fuga, andar, e nada mais):
até 46 pontos menos aritmética que o combate. Onde ela é longa (as células de 2×8 a distância),
ela vira perseguição de verdade e a composição se aproxima da do combate, porque ali a
re-projeção volta a mandar.

> **O NÚMERO DO TOPO desta bateria, e ele é o da FASE DE COMBATE das 4.800 batalhas que terminam
> no limiar de produção: entre 20% e 55% das paradas são de classe iii**, ou seja aritmética de
> escrituração, que é o que a automação pode tirar.
>
> A fase de fuga das mesmas batalhas dá 16% a 59%, e **isso é agregação, não igualdade**: os
> Ticks de fuga se concentram nas três células grandes, que são as de aritmética alta nas duas
> fases. Célula a célula, a diferença é a da tabela acima. **A média agregada da fuga não deve
> ser citada; a coluna Δ deve.**

### 1.3 A subida a 59%–64% é do eixo, e não da fase

A leitura de 02/09 dizia que a fração de iii sobe "onde há perseguição", e ficou a dúvida de se
isso era efeito da fase de fuga. **Não é**, e a separação é direta: os números abaixo são todos da
**fase de combate**, antes de qualquer fuga.

| célula, fase de COMBATE | piso–teto |
|---|---|
| coprimo · encostado · 2×8 (multidão, sem distância) | 23%–49% |
| coprimo · extrema · 1v1 (distância, sem multidão) | 24%–49% |
| coprimo · média · 2×8 (multidão **e** distância) | **15%–62%** |
| uníssono · extrema · 2×8 (multidão **e** distância) | **18%–64%** |

**Nem a distância sozinha nem a multidão sozinha sobem a fração.** As duas juntas sobem. A §2 diz
por quê.

---

## 2 · De onde vêm as paradas

É a tabela que explica todas as outras. Fase de combate, média por batalha:

| célula (limiar 25%) | declarar | agenda | **reprojetar** | resolver | aplicar |
|---|---:|---:|---:|---:|---:|
| uníssono · encostado · 2×8 | 4.576 | 4.576 | **0** | 4.576 | 4.576 |
| uníssono · extrema · 2×8 | 3.656 | 3.656 | **5.895** | 3.653 | 3.653 |
| coprimo · encostado · 1v1 | 10,4 | 10,1 | **0** | 9,7 | 9,7 |
| coprimo · encostado · 2×8 | 42,3 | 40,6 | **0** | 34,8 | 34,8 |
| coprimo · extrema · 1v1 | 8,8 | 8,5 | **0** | 7,9 | 7,9 |
| coprimo · média · 2×8 | 47,0 | 45,8 | **53,7** | 31,2 | 31,2 |
| coprimo · extrema · 2×8 | 38,8 | 37,5 | **45,4** | 27,9 | 27,9 |

**A re-projeção é zero em dezoito das vinte e quatro células, e domina as outras seis.**

**O mecanismo**, e ele foi conferido no espelho: com oito peças por lado num mapa estreito, quem
persegue **esbarra na aglomeração**. Não fecha a distância, e a agenda desliza um Tick a cada
avanço. Nas células uníssonas, que nunca terminam, isso vira uma peça adiando o mesmo golpe por
milhares de Ticks.

Isso responde à §1.3: a fração de iii sobe onde há **multidão e distância ao mesmo tempo** porque
é só ali que a perseguição não termina. Com distância e sem multidão, o perseguidor chega. Com
multidão e sem distância, não há o que perseguir.

**E fora dessas seis células a carga tem uma forma teimosa:** `declarar ≈ agenda ≈ resolver ≈
aplicar`. Cada golpe custa uma parada de cada tipo, e por isso a fração fica em 49% de teto e
22%–24% de piso, do 1v1 encostado ao 2×8 extremo. **O tamanho da cena multiplica a carga sem
mudar a composição dela.**

### 2.1 O que a automação esvazia em CLIQUES

Um Tick cujas paradas são todas de classe iii deixa de consultar alguém quando o motor resolver a
classe iii. Fase de combate:

| célula (limiar 25%) | s/parada hoje | + só iii | = depois | (piso) |
|---|---:|---:|---:|---:|
| coprimo · encostado · 1v1 | 0,50 | 0,00 | 0,50 | 0,50 |
| coprimo · extrema · 3×3 | 0,77 | 0,00 | 0,77 | 0,77 |
| coprimo · média · 2×8 | 0,27 | **0,34** | 0,62 | 0,27 |
| coprimo · longa · 2×8 | 0,60 | 0,15 | 0,75 | 0,60 |
| uníssono · longa · 2×8 | 0,01 | **0,71** | 0,72 | 0,01 |
| uníssono · extrema · 2×8 | 0,02 | **0,70** | 0,72 | 0,02 |

**A automação tira PARADAS em toda célula, e tira CLIQUES em seis.** São duas economias
diferentes: nas dezoito células sem re-projeção, quase todo Tick que consulta alguém consulta
também por decisão ou por julgamento, e esses ficam. Nas seis com re-projeção, o Tick fica vazio
inteiro, e ali a automação tira de 15 a 71 pontos percentuais dos cliques no ⏭.

---

## 3 · A sensibilidade ao limiar de fuga

Não é política nova: é o `fugirAbaixoDePct` do `regras.json`, um valor que já existe, rodado em
dois níveis como eixo próprio. `decisaoAutomatica` ganhou um parâmetro opcional cujo padrão é o
da regra, e a mesa continua chamando com três argumentos.

| nível | batalhas | %iii combate | %iii fuga | Tick da fuga | fuga-consumada |
|---|---:|---|---|---:|---:|
| **25%** (produção) | 4.800 | 20%–55% | 16%–59% | 32,3 | **47%** |
| **10%** | 4.800 | 19%–56% | 17%–60% | 35,3 | **18%** |

> **A leitura principal NÃO muda com o limiar: dois pontos percentuais.** A conclusão da bateria é
> robusta a ele, e isso é o resultado que se queria.

E ele muda **o desfecho**, e muito: com o limiar de produção, quase metade das cenas termina com
o perdedor saindo do mapa; com 10%, menos de uma em cinco. Ou seja: **o limiar decide como a cena
acaba e não decide quanto o mestre trabalha.** Para o desenho do Grid isso é boa notícia: mexer
nele é uma decisão de sabor, não de carga.

---

## 4 · O alarme aceso, e a explicação que ele exige

O agregador imprime seis sinais de bateria ineficaz. Cinco ficaram apagados. Um acendeu:

> ✘ **fuga-consumada acima de 90% em 1 célula**: `coprimo-encostado-2×8` (100%).

**A explicação, e sem ela o número não sai.** Nessa célula as peças começam **encostadas**, então
todo mundo apanha desde o Tick 3; o limiar dispara para o lado perdedor inteiro quase ao mesmo
tempo; e o mapa tem `dist + 8 = 9` colunas de largura, então quem corre sai dele em **um Tick**. A
fase de fuga dessa célula dura **1,0 Tick**.

Duas consequências, e as duas vão escritas:

1. **A carga não foi contaminada.** Um Tick de 17 não move média nenhuma, e a leitura da fase de
   combate dessa célula vale integralmente;
2. **o desfecho é em parte artefato do mapa**, que é ⚑. Com um tabuleiro maior, essas cenas
   terminariam por desistência ou por morte em vez de por saída de mapa. **A coluna "fim
   dominante" da tabela C não deve ser lida como afirmação sobre o sistema de combate**, e sim
   como "a cena acabou porque o tabuleiro acabou".

**Os cinco que não acenderam** também são informação: nenhum invariante violado em 10.800
batalhas; nenhum contador de ocasião em zero onde deveria morder (re-projeção, fuga, raspão e a
quarta célula do quadro mordem todos); nenhuma métrica com p10 igual a p90; e nem toda célula
estoura o teto (metade estoura, e são as uníssonas, pelo motivo de sempre).

**E o sexto acendeu na bateria de SANIDADE da primeira volta e foi consertado antes da grande**,
que é exatamente para isso que ela existe: o eixo E4 estava inerte (§5, D31).

### 4.1 A variância diz que os eixos estão fazendo o trabalho

| variância entre repetições da mesma célula | variância entre células |
|---:|---:|
| 0,057 | **12,20** |

**Os eixos explicam 214 vezes mais que o acaso.** É o oposto do sinal de bateria ineficaz, e é
também a justificativa de as repetições poderem ser poucas (§5, D33).

---

## 5 · As decisões

### 5.1 D37 a D40 · as quatro que vieram do chat, e o que elas moveram

A primeira execução desta grade levantou quatro perguntas de regra que estavam presas no código
sem ninguém ter decidido. As quatro foram respondidas e implementadas, e a bateria rodou de novo.

**D37 · O tipo de dano da ficha segue o `principal: true` do catálogo.** `resumoCombatePC`
ordenava os modos por `MODO_ORDEM` (impacto, corte, perfurante) e pegava o primeiro, ignorando a
marca do catálogo. **Seis das dez armas de mais de um modo escreviam o tipo errado:** Montante,
Machado, Alabarda e Machado de Arremesso saíam como impacto tendo corte como principal; Adaga e
Picareta saíam trocadas também. A sigla vai para a expressão de dano, a mesa lê o tipo dela
(`tipoDeDano`), e é ele que escolhe **qual Absorção o alvo aplica**, além do gate de Perfuração e
da resistência do bicho.
**Custo:** o `dados_hash` mudou e a bateria inteira rodou de novo. Na mesa, uma alabarda que
cortava passa a valer contra a Absorção de corte, que é maior na maioria das armaduras.

**D38 · O golpe que cai num alvo já no chão REDIRECIONA.** Regra nova, escrita em
`regras.json` (`combate.simultaneo.golpeNoCaido`): o gesto já estava no ar, então não evapora,
procura outro corpo dentro do alcance da arma. Quem caiu num Tick **anterior** foi visto cair, e
dá para **cancelar ou redirecionar**; quem caiu **neste** Tick não foi, porque o Tick é
simultâneo, e aí **só resta redirecionar**. Sem inimigo de pé ao alcance, o gesto se perde e
ninguém é perguntado. A peça em modo automático redireciona sozinha para o mais próximo; a de
jogador abre a caixa de escolha.
**Custo:** uma decisão nova de classe i onde antes havia uma folha inteira de classe iii mais uma
de ii. E some a Pressão cobrada de um corpo caído, que era o que a mesa fazia até aqui.

**D39 · A fuga automática anda com a perna da peça.** O mesmo robô media a mesma perna de dois
jeitos: a declaração de ataque usava `passoNoModo` (a ficha ou o bestiário) e a fuga tinha ficado
com o 6 da tabela de modos.
**Custo:** as perseguições ficaram mais lentas, porque o arranque da maioria das peças é menor que
6, e isso encurtou algumas fugas e alongou outras. É o preço de o caramujo fugir de caramujo.

**D40 · O desempate da fila é a iniciativa rolada, e o `movido_em` sai do comparador.** O carimbo
do token é reescrito toda vez que a peça anda, e numa perseguição a fila inteira se reordenava a
cada avanço, num campo que existe justamente para a ordem **não** dançar. A iniciativa já é rolada
por peça em produção (o ⚄ da barra); o id fica só como piso determinístico.
**Custo:** cenas em que todo mundo tem a mesma iniciativa (a horda do mesmo bicho) passam a
depender do id, que é arbitrário. É melhor que depender de quem andou por último.

**O que as quatro moveram, junto:**

| | 1ª volta (`3544505`) | 2ª volta (`fdc9eab`) |
|---|---|---|
| o número do topo | 18%–59% | **20%–55%** |
| re-projeção em `uníssono · extrema · 2×8` | 11.791 | **5.895** |
| re-projeção em `coprimo · média · 2×8` | 130,7 | **53,7** |
| variância entre células | 13,91 | 12,20 |
| sensibilidade ao limiar | 1 ponto | 2 pontos |

**A banda estreitou e a re-projeção caiu quase pela metade.** As duas mudanças vêm do mesmo lugar:
com a fila deixando de se reordenar a cada passo e com a fuga andando na perna certa, o
perseguidor alcança mais vezes em vez de deslizar a agenda para sempre. **Nenhuma conclusão
mudou de sinal**, o que é o resultado que se quer de um conserto: ele move números e não vira a
leitura.

**E duas divergências de ordem que o espelho pegou no meio do caminho**, as duas de laço e não de
regra: a lista de quem está de pé é **congelada** no topo da declaração (a mesa calcula `emPe` uma
vez e filtra ela, e recalcular a fila a cada peça troca o alvo escolhido quando quatro inimigos
estão à mesma distância), e **quem cai dentro do Tick não solta mais o golpe dele**.

### 5.2 D29 a D36 · as da grade

**D29 · A batalha se parte em fase de combate e fase de fuga, e o número do topo é o do combate.**
A troca de fase vale no Tick seguinte à primeira declaração de fuga, e é da CENA e não da peça.
**Custo:** duas tabelas onde havia uma, e a fatia de fuga fica com amostra minúscula nas células
encostadas (1 Tick). A coluna Δ é o que se lê, não a média agregada.

**D30 · A grade real desta bateria é o núcleo cruzado, e mais nada.** Das 112 células oficiais da
`02` §0.10.1, **88 não rodam** com as quinze bandeiras desligadas e com este elenco:

| bloco oficial | células | por quê não roda |
|---|---:|---|
| E5 · núcleo do Tick (12), perfil desligado (2), as nove não-núcleo (9), as seis na hospedeira (6), as três na mediana (3) | **32** | E5 **é** o eixo das bandeiras. Com as quinze desligadas, toda célula de E5 é a própria âncora |
| as duas hospedeiras novas (`gate` e Conjurador) | **2** | existem só para hospedar bandeira |
| o OFAT inteiro em volta das duas âncoras: E4(2) + E6(8) + E7(2) + E9(2) + E10(4) + E11(4) | **22** | E4 medido inerte (D31); E6 tem uma política só, a do produto (D24); E7 não tem parede; E9 mede N7, que não está no motor; E10 não tem reforço entrando em cena; E11 não tem criatura de bestiário (D25) |
| do núcleo cruzado, os dois níveis de E1 que faltam (`5 e 6` e `4/5/6/7`), 2 × 4 × 3 | **24** | pedem arquétipos de ciclo 5 e de quatro ciclos diferentes (D25) |
| os dois níveis de controle (D6 e D7) | **2** | pedem pares extras que o elenco de dois não tem |
| os seis cruzamentos deliberados | **6** | cinco morrem com os fatores; o sexto (uníssono × horda) já está dentro do núcleo |
| **não rodam** | **88** | |
| **rodam** | **24** | o núcleo cruzado com os dois níveis de E1 que existem |

**O que sobra e roda:** `E1(2) × E2(4) × E3(3)` = 24, vezes o limiar de fuga (2) = **48 células**.
**Custo:** esta bateria não diz nada sobre bandeiras, políticas, obstáculo, leitura, reforço nem
criaturas. Ela é a medida do Grid de hoje, com o robô de hoje.

**D31 · E4 (assimetria de passo) foi cortado, e quem o cortou foi a bateria de sanidade.** Ele
entrou como OFAT com o lado `b` andando 2× pelo ajuste por instância do passo, e a sanidade acusou:
**zero re-projeções contra 0,3 da âncora**. O eixo é inerte, e o motivo é do robô: a
`decisaoAutomatica` **avança para o alvo e nunca se afasta dele**, então quem anda mais depressa só
chega mais cedo.
**Custo:** a assimetria de passo não é medida. Em compensação, o que ela ia medir **está medido por
outro caminho e é maior**: a re-projeção vem da multidão que se tranca (§2). O alarme que o cortou
fica no agregador e o caminho do `passoMult` fica no `montarCena`: o eixo volta com uma linha no
dia em que existir uma política que recua (é o L20).

**D32 · O limiar de fuga entra como eixo, por parâmetro opcional.** `decisaoAutomatica` recebe um
`opts.limiarFugaPct` cujo padrão é o do `regras.json`; a mesa nunca o passa.
**Custo:** um parâmetro novo numa função de produção. É o preço de medir sensibilidade sem
inventar política, e o padrão continua sendo a regra.

**D33 · n = 400, pelo piso do p95, e não 13, pelo CV medido.** O CV medido nas 3.300 batalhas de
02/09 é de **0,00 a 0,089**, e a regra do piloto daria n = 13.
**Custo:** trinta vezes mais batalhas do que a precisão da média exigiria. Vale porque as métricas
principais incluem **p90, p99 e pico**, e percentil precisa de amostra independentemente de quão
estável a média seja. As uníssonas ficam em 50 (D23), porque a resposta delas é categórica.

**D34 · A régua é fixa, e a sanidade roda antes.** Manifesto com commit, `dados_hash` e árvore suja
carimbados antes da primeira batalha; nada se corrige no meio.
**Custo:** um conserto obriga a bateria inteira a rodar de novo, e obrigou duas vezes (o corte de
E4 e as quatro decisões do chat). São 24 segundos, então o custo é baixo aqui e não seria numa
bateria de horas. O ganho é que nenhuma leitura mistura dois commits.

**D35 · Teto de tempo por PROCESSO, além do teto de Ticks.** O teto de 2.000 Ticks não pega
processo travado, porque ele vive dentro do laço que travou.
**Custo:** uma faixa morta vira leitura **incompleta com alarme**, em vez de uma bateria pendurada
para sempre.

**D36 · Os seis sinais de bateria ineficaz são conferidos e impressos alto, fora das tabelas.**
Invariante violado; contador de ocasião em zero onde deveria morder; variância dentro da célula ≥
entre células; toda célula estourando; p10 = p90; e `fuga-consumada` acima de 90%.
**Custo:** um sinal aceso exige explicação escrita antes de o número sair, e isso é trabalho. A
alternativa é ninguém olhar, que foi o que aconteceu nas duas rodadas anteriores.

---

## 6 · A lista ⚑

O que a bateria usa e não tem na régua:

1. **a política**, a `decisaoAutomatica` do produto. É a invenção que mais pesa;
2. **a manobra é sempre `simples`**, e por isso rajada e empunhadura dupla não aparecem;
3. **os traços dos dois arquétipos**, da ficha de referência do contrato. Os números de combate
   **não** são inventados: saem de `resumoCombatePC`;
4. **o mapa**: faixa de `dist + 8` por `n + 2`, escala 1 m por hexágono. É ele que faz
   `fuga-consumada` dominar nas células encostadas (§4);
5. **o custo de tela da declaração NA MÃO**. A bateria roda a política automática, em que declarar
   não custa clique nenhum, e esse é o número certo do que ela mede.

Saiu desta lista o multiplicador de passo do E4, junto com o eixo (D31).

---

## 7 · O que a próxima bateria precisa, e esta não teve

1. **Uma política que recua.** É a peça que falta para E4 existir, e é o que separa "o robô do
   produto" de "o jogo". Sem alguém que se afaste, metade da geometria do Grid nunca é exercitada.
   É o **L20**;
2. **manobra que não seja `simples`.** Rajada e empunhadura dupla mudam `penDados`, mudam a
   agenda, mudam o número de folhas por ação. É onde o conserto do L11 vive, e nenhuma batalha
   desta bateria passa por lá;
3. **as quinze bandeiras ligadas, uma a uma.** É a grade oficial inteira, e é o que 68 das 112
   células existem para medir. Depende do **L1**;
4. **um mapa que não seja uma faixa de nove colunas.** Enquanto o tabuleiro couber em um Tick de
   corrida, `fuga-consumada` vai dominar por construção (§4);
5. **uma criatura de bestiário no elenco**, para o eixo E11 e para o `porte` deixarem de ser zero
   por construção;
6. **o fator de conversão para segundos** (o **L7**). Toda a leitura sai em gestos e em Ticks, e um
   gesto pode levar um segundo ou trinta;
7. **o caminho HUMANO da regra do golpe no caído** (D38). A bateria roda o robô, que redireciona
   sozinho; a caixa de escolha do mestre existe no código e nenhuma batalha passou por ela.

E uma que não é de escopo e sim de método: **o elenco uníssono empata**. Metade das 48 células
estoura o teto de 2.000 Ticks porque o Escudeiro não fura a Absorção do Escudeiro. Isso continua
sendo o achado e não o defeito (é o que `margem` e `bloqueio` existem para consertar), mas
significa que **metade da grade mede um jogo que não anda**. Com as bandeiras ligadas, essa metade
volta a ser jogo, e aí ela precisa rodar com as 400 voltas e não com 50.

---

## 8 · Como reproduzir

```
node scripts/sim/bateria.mjs --sanidade          # a que existe para falhar
node scripts/sim/bateria.mjs --saida .sim/<data> # a grande, 48 células
node scripts/sim/agregar.mjs --saida .sim/<data>
```

E **uma batalha sozinha**, pelo índice, sem depender de nenhuma anterior (a semente é
`hash32(semente_mestre, célula, repetição)`, derivada e não sorteada):

```
node scripts/sim/rodar.mjs --de <idx> --ate <idx+1> --imprime \
  --n 400 --unissono 50 --semente 20260903 --saida .sim/avulsa
```

O comando sai impresso no próprio manifesto de cada bateria, com os parâmetros daquela execução.
