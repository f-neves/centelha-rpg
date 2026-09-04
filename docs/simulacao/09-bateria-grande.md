# 09 · A bateria grande

**03/09/2026.** 21.600 batalhas, 96 células, zero inválidas. Semente mestre 20260903.
**O agregado inteiro está versionado** em `resultados/09-bmtlxp622.txt`: é a saída de
`agregar.mjs --gravar` sobre a bateria `bmtlxp622`, rodada no commit `640f628` com árvore
limpa e com o mesmo `dados_hash` (`36ff54d18bb95d9a`) das anteriores. Todo número deste
documento tem linha nele.

> **A grade rodou SEIS vezes, e os números aqui são os da sexta.** As quatro primeiras foram
> deste dia; a quinta (`bmtlw3e2r`, commit `80d5db7`) e a sexta (`bmtlxp622`, commit `640f628`)
> foram as das rodadas 02 e 03 da caixa de revisão, e cada uma reproduziu a anterior. **A sexta
> repete a quinta linha a linha, e as diferenças estão em três lugares só**: o carimbo da bateria,
> o carimbo novo do agregador, e a tabela do `G`, que ganhou a repartição por lado. Fora disso,
> as 417 linhas são as mesmas, e **nenhum número da quinta mudou**. O que a sexta compra é a linha
> "um lado à mão" da §2.4, que não existia porque o log não sabia de que lado vinha a declaração.
>
> **A grade rodou QUATRO vezes no dia 03/09, e a quarta (`0dc62a4`) é a que as duas seguintes
> reproduziram.** A primeira
> (`3544505`) levantou quatro perguntas de regra presas no código; a segunda (`fdc9eab`) rodou com
> as respostas; a terceira (`02f9a3a`) rodou com a revisão delas, que refez a regra do golpe no
> caído sobre o retrato da abertura do Tick (D41), promoveu o tabuleiro a eixo e consertou o
> instrumento num ponto que muda o número publicado (D42, a §2.2); e a quarta (`0dc62a4`) rodou
> por causa do Tick MORTO (D48), que é instrumento novo.
>
> **As três últimas daquele dia deram números idênticos**, e isso é previsão confirmada e não coincidência: a
> D45 mexeu no catálogo numa arma que ninguém do elenco empunha, e a D48 acrescentou um contador
> sem tocar no laço. A D34 manda rodar inteira quando a régua ou o instrumento mudam, e o que a
> volta compra é o carimbo.

---

# Em uma página

**O resto deste documento é a prova. Isto é a leitura.**

### O que se perguntou

Quanto do trabalho do mestre no Grid a automação pode tirar. Medido em **21.600 batalhas**, 96
células, com o robô do produto, todas as bandeiras desligadas, zero batalhas inválidas.

### A resposta, em três termos

O trabalho do mestre na fase de combate **não é uma coisa, são três**, e só a primeira sai com
automação de regra:

| | gestos | fatia | quem tira |
|---|---:|---:|---|
| **aritmética** (classe iii) | 552.102 | **50%** | automação de regra |
| **o ⏭**, cadência de relógio | 359.733 | **33%** | ninguém: nenhuma regra o toca |
| **julgamento** (classe ii) | 184.034 | **17%** | ninguém: é a mesa decidindo |

E a aritmética **não são seis paradas, é uma**: a folha da resolução. As outras cinco somam 60%
das paradas e custam **zero** gesto.

### A escada do que dá para tirar

| | trabalho | do de hoje | o que sai |
|---|---:|---:|---|
| hoje (modo `mesa`) | 1.095.869 | 100% | · |
| **+ modo `site`** | 727.801 | 66,4% | os dois números digitados por golpe |
| **+ avanço unificado** | 538.355 | 49,1% | o ⏭ do Tick morto, e um cartão por parada |
| **+ a folha resolvendo sozinha** | **418.530** | **38,2%** | o resto da aritmética |

> **O teto do que este projeto inteiro pode tirar do mestre é 62% do trabalho de hoje, e o que
> sobra não tem conserto de software.** Não é 38,2% de um número fixo: é **um clique por Tick que
> para e um por golpe que cai**, que são a cadência da cena e a decisão da mesa, e não conta. E
> ele escala com o **tamanho da cena**, não com a complexidade da regra.

### A fila, em três itens

1. **A conversa com quem joga** (o **L26**): *por que a mesa rola o dado na mão?* (vale 33,6% do
   trabalho) e *com que frequência há efeito de chão ativo numa cena?* (diz se o item 2 vale como
   medido). Nenhuma das duas se responde com código nem com bateria;
2. **o avanço unificado**: o ⏭ corre até a parada real **e abre a folha do golpe que o fez
   parar**. Um desenho só, 26,0% do trabalho no modo `site`, e vem **depois** do item 1;
3. **o L25**: as quinze bandeiras lidas pelo motor. Não alivia o mestre em nada e destrava a
   segunda bateria.

### O que esta bateria NÃO diz

Ela mede o robô do produto, com manobra sempre `simples`, sem peça de jogador, sem criatura, sem
Arte no chão e com as quinze bandeiras desligadas · **porque nenhuma delas é lida pelo motor**,
que foi o maior achado da frente e não estava previsto. A lista completa está na §6.

---

## 0 · O escopo, sem suavizar

**Duas invenções definem o alcance de tudo o que vem depois, e por isso estão aqui e não
no fim.**

**A política é a `decisaoAutomatica` do produto**, e ela faz duas coisas: ataca o inimigo de pé
mais próximo, e foge quando a Vida cai abaixo de um limiar. Não recua, não protege ninguém, não
escolhe alvo, não muda de ideia. Toda leitura desta bateria é sobre **esse robô**. Ela não é
minha invenção, é a do produto, o que é uma posição melhor mas não deixa de ser uma invenção.

**A manobra é sempre `simples`**, porque a política não escolhe manobra. Consequência dura:
**nenhuma das 21.600 batalhas exercita rajada ou empunhadura dupla**, e portanto o conserto do
L11 (a penalidade de dados por golpe, que era o defeito que abriu esta frente) **não é testado
por esta bateria**. Ele é testado pelo `test-lance.mjs` e pelo espelho de motor; aqui, não.

**E nenhuma peça é de jogador.** Toda peça desta bateria roda em modo automático, e há um lugar
em que isso não é só "a política é o robô": o golpe cujo alvo caiu. A peça automática redireciona
sozinha, sem caixa; a de jogador abre uma caixa de escolha, que é uma parada de classe i com
gesto. **A bateria não enxerga esse custo**, e o número publicado apaga uma interrupção que a
mesa de verdade tem. São 317 redirecionamentos nas 9.600 batalhas que terminam, então o buraco é
pequeno em tamanho; ele está aqui em cima porque é um buraco de NATUREZA, e não de tamanho.

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

| célula (limiar 25%, mapa apertado) | Ticks de combate | Ticks de fuga | gestos no combate | gestos na fuga |
|---|---:|---:|---:|---:|
| coprimo · encostado · 2×8 | 16,7 | **1,1** | 158 | 2 |
| coprimo · encostado · 1v1 | 35,6 | **0,3** | 75 | 1 |
| coprimo · média · 2×8 | 27,2 | 19,1 | 153 | 121 |
| coprimo · extrema · 2×8 | 44,7 | 27,1 | 158 | 150 |

**A fase de fuga é de 0,3 a 27 Ticks contra 17 a 2.000 de combate**, e nas células encostadas ela
é literalmente um Tick. Ela não engole a carga. O que ela engole é o **desfecho**, e por isso a
linha "fim dominante" da tabela C precisa ser lida com cuidado (§4).

### 1.2 A composição DIFERE entre as fases, e o número do topo é o do combate

| célula (limiar 25%, mapa apertado) | combate: piso–teto | fuga: piso–teto | Δ teto |
|---|---|---|---:|
| coprimo · encostado · 2×8 | 23%–49% | 4%–8% | **−41** |
| coprimo · encostado · 1v1 | 24%–49% | 12%–12% | **−38** |
| coprimo · encostado · 3×3 | 23%–49% | 12%–17% | **−32** |
| coprimo · média · 1v1 | 24%–49% | 7%–25% | −24 |
| coprimo · longa · 3×3 | 24%–49% | 9%–37% | −13 |
| coprimo · longa · 2×8 | 17%–59% | 15%–63% | **+5** |

**Onde a fuga é curta ela é quase toda decisão e passo** (declarar a fuga, andar, e nada mais):
até 46 pontos menos aritmética que o combate. Onde ela é longa (as células de 2×8 a distância),
ela vira perseguição de verdade e a composição se aproxima da do combate, porque ali a
re-projeção volta a mandar.

> **OS NÚMEROS DO TOPO desta bateria, e eles são os da FASE DE COMBATE das 9.600 batalhas que
> terminam no limiar de produção: 20% a 55% das PARADAS são de classe iii, e 50% dos GESTOS.**
> São duas moedas diferentes e as duas precisam sair juntas; a §2.2 explica por quê, e qual das
> duas responde a pergunta original.
>
> A fase de fuga das mesmas batalhas dá 18% a 59% em paradas, e **isso é agregação, não
> igualdade**: os
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

| célula (limiar 25%, mapa apertado) | declarar | agenda | **reprojetar** | resolver | aplicar |
|---|---:|---:|---:|---:|---:|
| uníssono · encostado · 2×8 | 4.576 | 4.576 | **0** | 4.576 | 4.576 |
| uníssono · média · 2×8 | 3.425 | 3.425 | **7.957** | 3.421 | 3.421 |
| uníssono · extrema · 2×8 | 3.656 | 3.656 | **5.895** | 3.653 | 3.653 |
| coprimo · encostado · 1v1 | 10,6 | 10,4 | **0** | 9,8 | 9,8 |
| coprimo · encostado · 2×8 | 42,9 | 41,4 | **0,1** | 35,4 | 35,4 |
| coprimo · extrema · 1v1 | 8,9 | 8,6 | **0** | 8,0 | 8,0 |
| coprimo · média · 2×8 | 47,1 | 45,8 | **53,9** | 31,5 | 31,5 |
| coprimo · extrema · 2×8 | 38,7 | 37,3 | **44,8** | 28,4 | 28,4 |

**A re-projeção é zero em dezoito das vinte e quatro células, e domina as outras seis** (as três
uníssonas de 2×8 com distância e as três coprimas correspondentes).

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

| célula (limiar 25%, mapa apertado) | s/parada hoje | + só iii | = depois | (piso) |
|---|---:|---:|---:|---:|
| coprimo · encostado · 1v1 | 0,50 | 0,00 | 0,50 | 0,50 |
| coprimo · extrema · 3×3 | 0,77 | 0,00 | 0,77 | 0,77 |
| coprimo · média · 2×8 | 0,27 | **0,35** | 0,62 | 0,27 |
| coprimo · extrema · 2×8 | 0,52 | **0,29** | 0,81 | 0,52 |
| uníssono · média · 2×8 | 0,00 | **0,71** | 0,71 | 0,00 |
| uníssono · extrema · 2×8 | 0,02 | **0,70** | 0,72 | 0,02 |

**A automação tira PARADAS em toda célula, e tira CLIQUES em seis.** São duas economias
diferentes: nas dezoito células sem re-projeção, quase todo Tick que consulta alguém consulta
também por decisão ou por julgamento, e esses ficam. Nas seis com re-projeção, o Tick fica vazio
inteiro, e ali a automação tira de 15 a 71 pontos percentuais dos cliques no ⏭.

### 2.2 As DUAS frações, e por que uma só estava errada

A composição por classe agregava demais. Ela junta, no mesmo balde `iii`, a re-projeção (que
**não abre caixa nenhuma**) e a folha do golpe (que custa quatro gestos). Quem lia "20% a 55% de
classe iii" entendia "um quinto a metade do trabalho do mestre", **e não era isso que estava
medido**.

A prova de que não era estava na própria bateria e passou despercebida: a re-projeção caiu quase
pela metade entre a primeira e a segunda volta, e o número do topo não se mexeu. Um valor que
cai pela metade e não move a conclusão ou não está no numerador, ou está num numerador que não
importa. Era o primeiro caso.

Agora saem **duas frações, e nunca uma só**. Fase de combate, 9.600 batalhas que terminam,
925.697 paradas e 1.095.869 gestos:

| tipo de parada | classe | gestos por unidade | paradas | % das paradas | gestos | **% dos gestos** |
|---|:--:|--:|--:|--:|--:|--:|
| `declarar` | i | 0 | 228.332 | 25% | 0 | 0% |
| `agenda` | iii | 0 | 220.971 | 24% | 0 | 0% |
| `reprojetar` | iii | 0 | 100.648 | 11% | 0 | 0% |
| `fugir` | ii | 0 | 7.361 | 1% | 0 | 0% |
| `redirecionar` | i | 0 ⚑ | 317 | 0% | 0 | 0% |
| `aplicar` | ii | 1 | 184.034 | 20% | 184.034 | 17% |
| **`resolver`** | **iii** | **3** | 184.034 | 20% | **552.102** | **50%** |
| o ⏭ do relógio | · | 1 | · | · | 359.733 | 33% |

**Os dois números do topo:**

| | banda | o que ele responde |
|---|---|---|
| fração das **PARADAS** que é iii | **20% a 55%** | quantas **interrupções** a automação apaga |
| fração dos **GESTOS** que é iii | **50%** | quanto **trabalho** ela apaga ← **é este** |

**O 20%–55% que esta frente vinha publicando é o de PARADAS.** O de gestos é 50%, e é ele que
responde a pergunta original da R2 §B. E ele não fecha a conta sozinho: a §2.3 mostra que os
outros 50% se partem em dois, e que o maior pedaço deles não é julgamento, é o relógio.

Três coisas que a tabela deixa ver e a fração agregada escondia:

1. **A banda de gestos não tem largura.** As duas duvidosas da taxonomia (`agenda` e
   `reprojetar`) custam **zero** gesto, então a dúvida sobre onde elas caem move a conta de
   paradas em 35 pontos e a de gestos em **nenhum**. A taxonomia estava sendo discutida na moeda
   em que ela não decide nada;
2. **um terço do trabalho do mestre é o clique do ⏭**, que não é parada de classe nenhuma e não
   sai com automação nenhuma. Ele fica no denominador de propósito: tirá-lo inflaria a fração;
3. **`declarar` é um quarto das paradas e zero dos gestos**, porque a bateria roda o robô. Numa
   mesa com jogadores essa linha é a mais cara da tabela, e a bateria não a mede (⚑ §6).

### 2.3 A conclusão em três termos, e o ⏭ é um deles

A pergunta original desta frente era "quanto da carga do mestre a automação de regra pode tirar".
A resposta não é um número, são **três**, e o segundo é o que ninguém tinha olhado:

| pedaço | gestos | fatia | quem tira |
|---|---:|---:|---|
| **classe iii · aritmética** | 552.102 | **50%** | automação de regra. É o que este projeto vinha propondo |
| **o ⏭ · cadência de relógio** | 359.733 | **33%** | **ninguém.** Nenhuma das seis paradas, nenhuma das quinze bandeiras, nenhuma decisão de regra o toca |
| **classe ii · julgamento** | 184.034 | **17%** | ninguém. É a mesa decidindo se o resultado vale |
| total | 1.095.869 | 100% | |

**Metade do trabalho do mestre está fora do alcance da automação de regras**, e o maior item
isolado dessa metade não é julgamento nem decisão: é **apertar avançar**. Ele é o mais frequente
da mesa (um por Tick, sempre), o mais barato individualmente (um clique) e o único **imune a tudo
o que este projeto propôs até aqui**. Nenhuma das quatro decisões desta semana, nenhuma das
quinze bandeiras e nenhum conserto de classe iii muda o número dele em um clique.

Isso reordena a leitura das outras seções. A §2.1 mede "o que a automação esvazia em cliques" e
mede certo, mas responde uma pergunta de **regra**; a linha do ⏭ diz que existe uma pergunta de
**interface** do mesmo tamanho, e essa nunca foi feita.

### 2.4 A pergunta que o ⏭ abre, com o número que a bateria já tem

**Levantamento, e não decisão: nada foi implementado e nada está proposto.** A pergunta é se o ⏭
precisa ser um clique por Tick. Se um avanço corresse sozinho até a próxima parada, o mestre
clicaria uma vez por Tick **que consulta alguém**, e o que isso pouparia já está no log.

**A fração de Ticks de combate que não consulta ninguém**, nas 9.600 batalhas que terminam:

| célula (limiar 25%, mapa apertado) | Ticks sem NENHUMA parada |
|---|---:|
| coprimo · extrema · 3×3 | **77%** |
| coprimo · extrema · 1v1 | 76% |
| coprimo · longa · 3×3 | 71% |
| coprimo · longa · 1v1 | 68% |
| coprimo · média · 3×3 | 62% |
| coprimo · média · 1v1 | 60% |
| coprimo · longa · 2×8 | 60% |
| coprimo · extrema · 2×8 | 52% |
| coprimo · encostado · 1v1 | 50% |
| coprimo · encostado · 3×3 | 48% |
| coprimo · encostado · 2×8 | 47% |
| coprimo · média · 2×8 | **27%** |
| **agregado** | **61%** |

**A ideia não morre: 61% dos cliques no ⏭ não produzem nada.** Mas "não produzir parada" e "não
acontecer nada" são coisas diferentes, e a diferença entre as duas é o que decide a ideia.

#### O teto e o piso, e o piso é o número honesto

Num Tick sem parada as peças **continuam andando**. Um avanço que passasse por cima dele não
custaria zero: custaria o mestre deixar de ver o tabuleiro mudar. Por isso o log agora separa dois
Ticks que estavam num só (D48):

| | o que é | Ticks de combate | do trabalho do mestre |
|---|---|---:|---:|
| **TETO** · Tick sem parada | ninguém foi consultado, **mas alguém pode ter andado** | 218.679 · **61%** | **20,0%** |
| **PISO** · Tick MORTO | ninguém consultado, nada caiu, **e ninguém saiu do lugar** | 125.237 · **35%** | **11,4%** |

**O Tick morto é seguramente pulável: o tabuleiro está idêntico no fim e no começo, e não há o que
ver.** Os 26 pontos de diferença entre teto e piso são Ticks de **travessia**, e ali pular é uma
troca (cliques por acompanhamento do movimento), não um ganho.

| | hoje | avanço no PISO | avanço no TETO |
|---|---:|---:|---:|
| cliques no ⏭ | 359.733 | **234.496** | 141.054 |
| trabalho do MESTRE | 1.095.869 | **970.632** | 877.190 |
| a menos | · | **11,4%** | 20,0% |
| composição | iii 50% · ⏭ 33% · ii 17% | iii 57% · ⏭ 24% · ii 19% | iii 63% · ⏭ 16% · ii 21% |

**Onze por cento do trabalho do mestre, sem tocar em regra nenhuma e sem esconder nada dele.** É
menos do que os 20% do parágrafo anterior e continua sendo maior que qualquer coisa que a
automação de uma bandeira isolada comprou.

##### E o Tick morto do HARNESS não é o Tick morto da MESA

O piso acima resolve a ressalva pela metade, e a metade que falta só aparece lendo o avanço da
mesa em vez do laço. No laço headless, um Tick sem parada e sem passo é vazio **por construção**:
não sobra nada que possa acontecer nele. Na mesa sobra, e está escrito no código:
`avancarTickSimultaneo` chama **`verificarEfeitos` a cada Tick**, e ali uma Arte no chão vence o
prazo, morde quem está dentro dela, aplica dano e põe condição, **sem parada nenhuma e sem
ninguém sair do lugar**.

**Nenhuma batalha desta bateria tem Arte.** Então esse caminho nunca roda aqui, e o Tick que o log
chama de morto pode, numa cena com aura de fogo, estar queimando alguém.

Isso não invalida os 11,4%: eles valem para a cena sem Arte, que é a cena que a bateria mediu.
**O que isso obriga é o desenho do avanço**, e é melhor saber agora que depois de escrevê-lo: o
avanço tem de parar também quando um efeito morde, e não só quando alguém é consultado. **É
projeto, e não ressalva.**

#### O ganho por célula, em cliques e não em fração

A fração engana aqui, e engana na direção que inverteria a conclusão: ela é **alta onde a carga é
baixa**. Quem decide quer os cliques poupados, que é o que o mestre sente. Média por batalha, fase
de combate, limiar de produção:

| célula (mapa apertado) | gestos hoje | **teto** | **piso** | teto% | piso% |
|---|---:|---:|---:|---:|---:|
| coprimo · extrema · 1v1 | 89 | **43** | **28** | 48% | 31% |
| coprimo · extrema · 3×3 | 127 | 41 | 22 | 33% | 17% |
| coprimo · longa · 1v1 | 78 | 31 | 22 | 39% | 28% |
| coprimo · longa · 3×3 | 114 | 29 | 15 | 25% | 14% |
| coprimo · média · 1v1 | 78 | 24 | 20 | 31% | 25% |
| coprimo · extrema · 2×8 | 158 | 23 | **0** | 15% | 0% |
| coprimo · média · 3×3 | 113 | 21 | 13 | 19% | 12% |
| coprimo · longa · 2×8 | 131 | 18 | **0** | 14% | 0% |
| coprimo · encostado · 1v1 | 75 | 18 | 18 | 24% | 24% |
| coprimo · encostado · 3×3 | 98 | 12 | 12 | 12% | 12% |
| coprimo · encostado · 2×8 | 158 | 8 | 8 | 5% | 5% |
| coprimo · média · 2×8 | 153 | 7 | **0** | 5% | 0% |

**A conclusão não inverte: ela afia.** O ganho absoluto anda junto com o percentual, e não contra
ele. O duelo a distância poupa 43 cliques por batalha e a multidão a média distância poupa 7, nas
duas moedas. **E no piso as três células de re-projeção poupam ZERO**, porque ali todo Tick vazio
é Tick de travessia: são exatamente as células de carga alta, e são as que o avanço não ajuda.

**O mecanismo é limpo**, e aparece nas linhas em que teto e piso são iguais: nas células
**encostadas** ninguém anda (18/18, 12/12, 8/8), e todo Tick vazio é Tick morto. A distância,
o Tick vazio é travessia. Ou seja: **o Tick vazio do combate encostado é espera de ciclo de arma,
e o mestre nunca precisa vê-lo; o Tick vazio a distância é alguém andando, e às vezes precisa.**

#### E com jogador na mesa?

A terceira ressalva dizia que o Tick vazio ficaria raro com jogadores declarando à mão. **Ela
estava errada no mecanismo**, e o número que a corrige já existia: `declarar` **já é uma parada**
em toda declaração, automática ou não (228.332 delas). O Tick em que alguém declara já é um Tick
não vazio hoje. **A contagem de Ticks vazios não muda com jogador; o que muda é o CUSTO de uma
parada que já está lá.**

**O `G` foi lido do diálogo, e a banda fechou entre 2 e 4.** Não precisava de bateria nova, só de
contar os cliques em `grid.astro`. O diálogo de declaração (`decl-dlg`) abre com **tudo no padrão
que o robô usaria**: manobra `simples`, modo de deslocamento `batalha`, velocidade preenchida por
`passoNoModo`, trajetória automática já marcada. Então o caminho mínimo é chegar até ele e
confirmar:

| caminho | gestos até o diálogo | + o OK | **G** |
|---|---:|---:|---:|
| **arrasto** · soltar a peça em cima do alvo | 1 | 1 | **2** |
| **menu** · botão direito, ⚔, clique no alvo | 3 | 1 | **4** |

O próprio código da mesa já trazia a conta, no comentário da solta do arrasto: *"três toques
(botão direito, ⚔, clique) viraram um arrasto"*.

**E a declaração à mão é gesto do JOGADOR, e não do mestre.** A primeira redação desta tabela
somava os `G` gestos ao trabalho e chamava a soma de trabalho do mestre, e a fração caía por um
motivo que não era o mestre trabalhar menos (achado da revisão, rodada 01). São dois trabalhos,
e saem os dois (`resultados/09-bmtlxp622.txt`, linhas 187 a 207):

- **o trabalho do MESTRE não muda com `G`**: o ⏭ e a folha continuam sendo dele, e os 228.332
  `declarar` passam a custar gesto de outra pessoa. A economia do avanço sobre o trabalho dele é
  **11,4% com piso e 20,0% com teto, com qualquer `G`**;
- **o trabalho da MESA** é o do mestre mais o dos jogadores, e é sobre ele que a fração cai.

**Mas QUANTAS das 228.332 declarações são à mão? Esta é a terceira premissa, e ela também estava
escondida.** A segunda redação somava as duas facções e publicava o resultado como "com jogadores
na mesa": era o caso extremo, em que toda peça das duas facções é de jogador (achado da revisão,
rodada 02). Numa mesa comum os jogadores declaram **um lado** e o robô declara os NPCs do outro,
e então só parte das declarações custa `G`. A bateria `bmtlxp622` mede a repartição
(`resultados/09-bmtlxp622.txt`, linha 188):

```
declarações 228.332 · lado a 102.940 (45,1%) · lado b 125.392 (54,9%)
```

> **⚠ ESTES NÚMEROS SÃO ANTERIORES AO CONSERTO DA INICIATIVA, e a explicação que estava aqui era
> falsa.** O texto dizia que o lado `b` andava com **passo dobrado**, e o eixo do passo estava
> cortado desde 03/09 (a própria D31, mais abaixo, diz isso): `passoMult` vale 1 em todas as 96
> células. A causa verdadeira era outra e era **defeito**: a iniciativa de cada peça era função só
> do ordinal, o ordinal é dado em bloco por lado, e por isso o desempate da fila saía igual em
> todas as 21.600 batalhas e sempre para o mesmo lado. Consertado; a repartição virou **47,1% e
> 52,9%** e todos os números desta seção mudaram. **A leitura de hoje está em
> `docs/simulacao/ESTADO.md`**, com o agregado `resultados/09-bmtmbdppb.txt`.

**E não é meio a meio, e a razão é do desenho da grade e não do jogo:** em metade das células (as
`coprimo`) os dois lados têm **arquétipos diferentes**, Escudeiro contra Montanteiro, com armas
diferentes e portanto ciclos de duração diferente, e ciclo mais curto declara mais vezes. Ali o
lado `b` declara 1,290 vez o que o lado `a` declara, e isso é o eixo fazendo o que foi posto para
fazer. **Nas células `unissono`, em que os dois lados são o mesmo arquétipo, a razão sobra em
1,031**, e esses 3% não estão explicados.

| G | quem declara à mão | trabalho da mesa | economia teto (mesa) | economia piso (mesa) |
|---:|---|---:|---:|---:|
| 0 · o robô, que é o que esta bateria mede | ninguém | 1.095.869 | 20,0% | **11,4%** |
| **2 · arrasto** | as duas facções | 1.552.533 | 14,1% | **8,1%** |
| **2 · arrasto** | **só o lado `a`** | 1.301.749 | 16,8% | **9,6%** |
| **2 · arrasto** | **só o lado `b`** | 1.346.653 | 16,2% | **9,3%** |
| **4 · menu** | as duas facções | 2.009.197 | 10,9% | **6,2%** |
| **4 · menu** | **só o lado `a`** | 1.507.629 | 14,5% | **8,3%** |
| **4 · menu** | **só o lado `b`** | 1.597.437 | 13,7% | **7,8%** |

**A linha da mesa comum é a do meio: 9,3% a 9,6% com `G = 2`, e 7,8% a 8,3% com `G = 4`**, contra
os 11,4% do mestre sozinho e os 6,2% a 8,1% do caso extremo. A largura de 0,3 ponto entre `a` e
`b` é a resposta a "qual das duas facções é a dos jogadores?", e ela é **pequena**: a pergunta
existe, tem tamanho medido, e o tamanho não muda decisão nenhuma.

O número absoluto de cliques poupados (218.679 no teto, 125.237 no piso) **não muda nada** com o
valor de `G` nem com quem declara: só o denominador da mesa cresce, e cresce com gesto que nunca
foi do mestre.

> **O que a linha "um lado à mão" NÃO é.** Nesta bateria os dois lados são o mesmo robô: `a` e
> `b` diferem em passo e em posição de partida, e em nada mais. A linha não mede uma mesa com
> gente; ela mede **quanto do denominador muda quando só metade das declarações é paga em
> cliques**. Uma mesa de verdade tem número de peças de jogador que não é metade da cena, e
> jogador que não aceita o padrão do diálogo (o quadro do `G` mínimo, abaixo). As duas coisas
> puxam para lados opostos, e nenhuma das duas está aqui.

> **A banda é do jogador que ACEITA O PADRÃO, e não do jogador.** O `G = 2` pressupõe que os
> padrões do diálogo servem, e eles servem porque são exatamente o que o robô escolheria: manobra
> `simples`, modo `batalha`, o alvo que o arrasto já apontou. **Um jogador que troca a manobra,
> muda o modo de deslocamento, ajusta a velocidade ou volta atrás no alvo paga mais**, e **esta
> bateria não sabe com que frequência isso acontece**: nenhuma peça dela escolhe. Medir essa
> frequência exige mesa com gente, e não bateria; até lá, 2 e 4 são o **piso** do custo manual, e
> não a média dele.

**E nada disto é o L7.** O L7 converte gesto em segundo, e é outra medição. O que ainda falta é
uma peça que **se mova diferente** de como o robô move (recua, reposiciona), porque essa muda a
trajetória e portanto a fatia de travessia que separa o piso do teto. É o **L20**, e é a única
coisa aqui que exige elenco novo.

#### O denominador importa, e a conversa do L26 pode mudá-lo

Os 11,4% e os 20,0% são sobre o trabalho do modo `mesa`. Se a mesa trocar para o modo `site`
(§2.5), o denominador encolhe de 1.095.869 para 727.801 e **os mesmos cliques poupados passam a
valer mais**, porque o que some é a digitação e não o relógio:

| | modo `mesa` | modo `site` |
|---|---:|---:|
| trabalho do mestre | 1.095.869 | 727.801 |
| cliques poupados (piso) | 125.237 | 125.237 |
| **economia com piso** | **11,4%** | **17,2%** |
| economia com teto | 20,0% | 30,0% |

E com jogador declarando à mão, no modo `site`, com a mesma separação de denominadores (o
trabalho do mestre fica em 727.801 e a economia dele em 17,2% e 30,0%, com qualquer `G`):

| G | quem declara à mão | trabalho da mesa | teto (mesa) | piso (mesa) |
|---:|---|---:|---:|---:|
| 0 · o robô | ninguém | 727.801 | 30,0% | **17,2%** |
| 2 · arrasto | as duas facções | 1.184.465 | 18,5% | **10,6%** |
| 2 · arrasto | **só o lado `a`** | 933.681 | 23,4% | **13,4%** |
| 2 · arrasto | **só o lado `b`** | 978.585 | 22,3% | **12,8%** |
| 4 · menu | as duas facções | 1.641.129 | 13,3% | **7,6%** |
| 4 · menu | **só o lado `a`** | 1.139.561 | 19,2% | **11,0%** |
| 4 · menu | **só o lado `b`** | 1.229.369 | 17,8% | **10,2%** |

**A conclusão que isso obriga: o L26 e o ⏭ não são dois itens paralelos, são uma sequência.** A
troca de modo tira 33,6% do trabalho **e aumenta a fatia do que sobra que o avanço automático
compra**, de 11,4% para 17,2%. Fazer o ⏭ primeiro seria medir o ganho dele contra um denominador
que a conversa pode encolher no dia seguinte.

> **O que fica registrado:** a pergunta tem tamanho (**11,4%** hoje, **17,2%** depois do L26, com
> piso), tem lugar (interface, e não regra), tem contra-argumento medido (26 pontos de travessia
> entre piso e teto, mais o achado da Arte acima) e tem o limite com jogador **medido**, e não
> mais suposto: **9,3% a 9,6%** na mesa comum do modo `mesa`, **12,8% a 13,4%** na do modo `site`,
> com `G = 2`. Não tem decisão, e é o **L24**.

---

### 2.5 A classe iii é UMA parada, e não seis

A tabela da §2.2 diz uma coisa que o texto dela não dizia, e é aritmética simples:

```
  golpes aplicados         184.034
  paradas `resolver`       184.034   ← uma por golpe, 3 gestos no modo mesa
  paradas `aplicar`        184.034   ← uma por golpe, 1 gesto
  classe iii, em gestos    552.102 = 3 × 184.034
  classe ii,  em gestos    184.034 = 1 × 184.034
```

**Os três números não são independentes: são a mesma contagem de golpes, multiplicada pelo custo
de tela de cada um.** São exatamente 4,00 gestos por golpe fora o relógio, que é o número que a
primeira bateria já tinha publicado sem saber de onde vinha.

A consequência muda o alvo do conserto. As outras cinco paradas (`declarar`, `agenda`,
`reprojetar`, `fugir`, `redirecionar`) somam **557.629 ocorrências, 60% de todas as paradas, e
custam ZERO gesto**: o motor as resolve dentro do avanço, sem abrir nada e sem perguntar nada.

> **Não há seis paradas de classe iii para automatizar. Há uma: a folha da resolução.** "Metade do
> trabalho é classe iii" e "metade do trabalho é digitar os dois números da folha" são a mesma
> frase, dita de dois jeitos.

E essa uma **já tem chave**. Digitar o acerto e o dano não é regra, é **quem rola o dado**, e isso
é uma opção do produto (`regras.json`, `combate.rolagem`), com três modos, **implementada e
ligada** (`rolaNoSite`, chamada na abertura da folha).

Recontando os mesmos 9.600 combates com o custo do modo `site`:

| | `mesa` (o padrão) | `site` |
|---|---:|---:|
| classe iii · aritmética | 552.102 · **50,4%** | 184.034 · **25,3%** |
| o ⏭ · cadência de relógio | 359.733 · 32,8% | 359.733 · **49,4%** |
| classe ii · julgamento | 184.034 · 16,8% | 184.034 · 25,3% |
| **trabalho do MESTRE** | **1.095.869** | **727.801** |

**Trocar o modo de rolagem tira 33,6% do trabalho do mestre sem uma linha de motor.** É mais que o
avanço automático (11,4% com piso) e mais que qualquer bandeira isolada poderia comprar. E dos 50%
de classe iii, **só um terço sobrevive**: os outros dois terços eram o dedo digitando o que o site
já sabe calcular.

#### O que sobra da classe iii depois da conversa, e qual gesto é

No modo `site` a folha abre já rolada, e `resolver` cai de 3 gestos para **1**. Esse 1 tem nome:
**o clique no cartão vencido da faixa dos golpes no ar**, que é o que abre a folha. São 184.034
cliques, um por golpe, e é **todo o resto da classe iii**.

E ele não é um item separado do ⏭: **`instanteDeGolpe` tranca o avanço exatamente no Tick em que
esse cartão vence.** O clique do relógio e o clique do cartão são o mesmo instante da mesa,
separados por um gesto. **São um desenho só**, e separá-los produziria duas interfaces que se
atrapalham: um avanço que para sem abrir nada, e um cartão que espera um clique que a parada já
tinha ganhado.

##### Quanto o desenho unificado poupa, e é menos do que a soma sugere

A tentação é somar: 125.237 cliques de ⏭ mais 184.034 de cartão. **A conta está errada**, e o
motivo é do sistema Simultâneo:

```
  Ticks de combate                          359.733
  Ticks com ao menos UM golpe vencido        64.209   ← 17,8%
  golpes (cartões)                          184.034
  golpes por Tick que TEM golpe                2,87
```

**Os golpes chegam em cacho.** Uma parada de avanço cobre em média **2,87 golpes**, e absorve
**um** clique de cartão: o da folha que ela abre. Os outros continuam sendo clique.

| | cartões | fatia |
|---|---:|---:|
| absorvidos pela parada do avanço (um por Tick que para) | **64.209** | 34,9% |
| que sobram (o 2º, o 3º… do mesmo Tick) | **119.825** | 65,1% |

**Economias, no modo `site` (total 727.801):**

| | só o avanço | só o cartão | **os dois juntos** |
|---|---:|---:|---:|
| com **piso** (só Tick morto) | 17,2% | 8,8% | **26,0%** |
| com **teto** (todo Tick sem parada) | 30,0% | 8,8% | **38,9%** |

**A segunda metade adiciona 8,8 pontos, e não 25.** Isso não desfaz o desenho unificado, que
continua sendo um só por construção: desfaz a expectativa de que ele resolva o problema do cartão.
Para os 65% que sobram, a pergunta é outra (a folha resolver sozinha), e ela cai na condição da
§2.5: **a conta que sai da mão do mestre tem de continuar visível.**

**Isso reordena a fila do conserto.** No modo `site` o maior item do trabalho passa a ser o ⏭
(49,4%), e o avanço automático passa a valer **17,2% com piso e 30,0% com teto** do total (menor)
que sobra. **O avanço não fica menos importante depois da troca de modo: fica mais.**

#### A pergunta que decide os dois primeiros itens da fila, e ela não é de código

A `nota` do próprio `regras.json` já explica por que o padrão é rolar na mão, e vale por extenso
porque é o argumento central e é a única parte dele que não é número:

> *"Quem rola os dados. Não muda regra nenhuma: muda quem digita o resultado. **O padrão é ninguém
> rolar no site, porque o dado na mão é metade da mesa.**"*

**O modo `mesa` não é desleixo, é escolha, e a razão dela é boa.** Rolar o dado é parte do que as
pessoas foram fazer ali. Trocar o padrão para economizar cliques do mestre pode custar exatamente
a coisa pela qual a mesa existe, e **essa troca não é minha para fazer**: é conversa com quem
joga, e é uma conversa curta.

**E há uma segunda pergunta do mesmo tipo, que se faz às mesmas pessoas na mesma conversa:** com
que frequência há **efeito de chão ativo** numa cena? Ela vem do achado da §2.4 (o
`verificarEfeitos` mordendo sem parada nenhuma): nenhuma batalha desta bateria tem Arte, então o
Tick morto medido é o da cena **sem** Arte, e ninguém sabe se essa é a cena típica. Se for rara, o
piso de 11,4% vale como está; se for comum, o avanço para mais vezes e o piso encolhe.

**As duas perguntas decidem o tamanho dos dois primeiros itens da fila**, e nenhuma das duas se
responde com bateria. É o **L26**.

**O `misto` é o modo que existe para esse impasse**, e esta bateria **não consegue medi-lo.** Nele
só as criaturas e os NPCs rolam no site (`rolaNoSite(rolagem, ehPersonagem)`), o que tira do
mestre exatamente as rolagens dele e deixa o dado na mão dos jogadores. Mas **todas as peças desta
bateria são arquétipos de PC**: `ehPersonagem` é verdadeiro dos dois lados, e o `misto` sairia com
o número do `mesa`, **idêntico, e não por o modo não fazer nada.** É o zero ambíguo outra vez, e
por isso a linha dele não está na tabela: medi-lo exige criatura no elenco (o mesmo elenco que o
E11 pede).

> **E uma condição para quando a automação vier:** cada conta que sair da mão do mestre **precisa
> continuar visível**. A régua que o Grid aplica sem mostrar é a régua que ninguém confere, e três
> dos defeitos desta frente viveram anos exatamente por isso: a rajada saindo de graça, o tipo de
> dano errado em seis armas e o golpe resolvido dez vezes numa volta. Nos três a tela mostrava o
> **resultado** e não a **conta**, e nos três quem achou foi um instrumento novo, e não um olho.

---

## 3 · A sensibilidade ao limiar de fuga

Não é política nova: é o `fugirAbaixoDePct` do `regras.json`, um valor que já existe, rodado em
dois níveis como eixo próprio. `decisaoAutomatica` ganhou um parâmetro opcional cujo padrão é o
da regra, e a mesa continua chamando com três argumentos.

**Qual é qual, porque a leitura inteira depende disso.** `fugirAbaixoDePct` é o piso de Vida em
que a peça larga a briga e corre: ela foge quando a Vida cai ABAIXO dele.

- **25% é o valor de PRODUÇÃO** (`regras.json`, `combate.simulacao.ia.fugirAbaixoDePct`). Limiar
  ALTO, e a peça foge **cedo**: basta perder três quartos da Vida;
- **10% é o EXPERIMENTAL**, e só existe nesta bateria. Limiar BAIXO, e a peça foge **tarde**:
  aguenta até quase morrer.

| nível | batalhas | paradas iii (combate) | **gestos iii** | Tick da fuga | fuga-consumada |
|---|---:|---|---|---:|---:|
| **25%** · produção · foge cedo | 9.600 | 20%–55% | **50%** | 32,2 | **44%** |
| **10%** · experimental · foge tarde | 9.600 | 20%–57% | **53%** | 35,1 | **16%** |

> **A leitura principal quase não muda com o limiar: três pontos percentuais na moeda que conta
> (gestos), dois na de paradas.** A conclusão é robusta a ele. Mas três pontos numa fração não é
> ruído, e a direção tem explicação mecânica.

**A direção: o limiar EXPERIMENTAL (10%, foge tarde) SOBE a fração de gestos que é iii**, de 50%
para 53%. Ou, dito do lado do produto: **fugir cedo, que é o que a mesa faz hoje, ABAIXA a fração
de aritmética.** E o mecanismo não é sobre fuga, é sobre **densidade**:

| | 25% · produção · foge cedo | 10% · experimental · foge tarde |
|---|---:|---:|
| batalhas em que alguém chegou a fugir | 64% | **32%** |
| Ticks de combate por batalha | 37,5 | 46,1 |
| golpes resolvidos por batalha | 19,2 | **28,4** |
| **golpes por Tick de combate** | 0,512 | **0,617** |
| Ticks sem parada nenhuma | 60,8% | **54,4%** |
| gestos: iii · ⏭ · ii | 50% · 33% · 17% | **53% · 29% · 18%** |

Com o limiar baixo a peça **fica na briga em vez de correr**. A fase de combate estica (37,5 →
46,1 Ticks), mas o número de golpes estica **mais que proporcionalmente** (19,2 → 28,4), porque os
Ticks que ela ganha são Ticks trocando golpes, e não Ticks atravessando o mapa atrás de alguém.

Daí a fração sobe, e a aritmética é direta: **cada golpe é 3 gestos de `resolver` (classe iii) e 1
de `aplicar`, enquanto cada Tick é 1 gesto de relógio.** Mais golpes por Tick = mais numerador por
unidade de denominador. A quarta linha da tabela é a causa e a sexta é o efeito; a quinta confirma
pelo outro lado, com o Tick vazio ficando mais raro.

**Isto não é uma observação sobre o instrumento, é uma conclusão sobre o DESENHO do jogo**, e é a
primeira desta frente. Ela tem seção própria: a §3.1.

### 3.1 Fugir cedo não deixa a mesa mais leve, deixa mais diluída

O modelo intuitivo era que uma cena que acaba antes custa menos ao mestre. **Custa quase o mesmo,
espalhado por mais Ticks de nada.**

Com o limiar de produção o perdedor larga a briga com um quarto da Vida e sai correndo, e o que
vem depois é travessia: Ticks em que ninguém golpeia, ninguém decide nada e o mestre clica no ⏭.
A batalha encolhe (37,5 contra 46,1 Ticks de combate) e os golpes encolhem mais que ela (19,2
contra 28,4), então a densidade cai: **0,512 golpe por Tick contra 0,617**. Pelo outro lado o
mesmo fato: **o Tick vazio sobe de 54,4% para 60,8%** quando se foge cedo.

**A consequência prática, e ela liga esta seção com a §2.4:** se fugir cedo enche a batalha de
Tick vazio, então o avanço automático **compra mais na configuração de produção do que na
experimental**. Nas duas moedas, e elas discordam, como discordaram na §2.2:

| | 25% · produção | 10% · experimental |
|---|---:|---:|
| Tick vazio (teto) | **60,8%** | 54,4% |
| Tick morto (piso) | **34,8%** | 32,9% |
| economia, teto · **em fração do trabalho** | **20,0%** | 15,7% |
| economia, piso · em fração do trabalho | **11,4%** | 9,5% |
| economia, teto · **em cliques por batalha** | 23 | **25** |
| economia, piso · em cliques por batalha | 13 | **15** |

**Em fração do trabalho, o avanço compra mais em produção; em cliques por batalha, compra menos.**
As duas leituras estão certas e respondem perguntas diferentes: a primeira diz que parcela do
esforço some, a segunda diz quantos cliques o dedo economiza numa cena. A batalha de limiar baixo
é mais longa, então tem mais cliques em números absolutos e menos desperdício em proporção.

**Para o desenho do Grid isso quer dizer duas coisas.** Mexer no limiar de fuga é decisão de
**sabor**, e não de carga (§3): ele decide como a cena termina, não quanto o mestre trabalha. E a
travessia, que é onde o limiar de produção joga a cena, é justamente o trecho em que o mestre
mais clica sem receber nada em troca. **O problema da fuga não é a fuga, é a caminhada depois
dela.**

E ele muda **o desfecho**, e muito: com o limiar de produção, quase metade das cenas termina com
o perdedor saindo do mapa; com 10%, menos de uma em cinco. Ou seja: **o limiar decide como a cena
acaba e não decide quanto o mestre trabalha.** Para o desenho do Grid isso é boa notícia: mexer
nele é uma decisão de sabor, não de carga.

---

## 4 · O alarme aceso, e a explicação que ele exige

O agregador confere onze sinais de bateria ineficaz (`sinais.mjs`, cada um com o teste que o
acende de propósito). Dez ficaram apagados. Um acendeu:

> ✘ **fuga-consumada acima de 90% em 2 células**: `coprimo-encostado-2×8` no mapa apertado
> (98%) e no aberto (99%).

**A explicação, e sem ela o número não sai.** Nessa célula as peças começam **encostadas**, então
todo mundo apanha desde o Tick 3; o limiar dispara para o lado perdedor inteiro quase ao mesmo
tempo; e o mapa tem `dist + 8 = 9` colunas de largura, então quem corre sai dele em **um Tick**. A
fase de fuga dessa célula dura cerca de **1 Tick**. E o mapa aberto **não** conserta: com
`dist + 40` colunas o desfecho é o mesmo 99%, porque o que decide não é o tamanho do tabuleiro e
sim o limiar disparando para o lado perdedor inteiro ao mesmo tempo. Essa é uma das coisas que o
eixo E12 comprou: a suspeita de artefato de mapa foi **testada** em vez de suposta.

Duas consequências, e as duas vão escritas:

1. **A carga não foi contaminada.** Um Tick de 17 não move média nenhuma, e a leitura da fase de
   combate dessa célula vale integralmente;
2. **o desfecho é em parte artefato do mapa**, que é ⚑. Com um tabuleiro maior, essas cenas
   terminariam por desistência ou por morte em vez de por saída de mapa. **A coluna "fim
   dominante" da tabela C não deve ser lida como afirmação sobre o sistema de combate**, e sim
   como "a cena acabou porque o tabuleiro acabou".

**E cada sinal imprime o veredito dele**, aceso ou apagado (D46). O placar, copiado de
`resultados/09-bmtlxp622.txt`, linhas 396 a 406 (e as onze linhas são iguais, caractere a
caractere, às da bateria anterior, `09-bmtlw3e2r.txt` linhas 386 a 396):

```
  ✓ invariantes                    nenhuma das 21600 batalhas violou um dos quinze invariantes
  ✓ ocasião · reprojetar           4825078 re-projeções nas células com distância
  ✓ ocasião · fugir                26889 declarações de fuga
  ✓ ocasião · redirecionar         15498 golpes redirecionados
  ✓ ocasião · raspão               202230 raspões
  ✓ ocasião · quarta célula do quadro 42278 Ticks em que algo caiu sem consultar ninguém
  ✓ ocasião · passo                16200 de 16200 batalhas com distância têm Tick morto < Tick sem parada
  ✓ variância                      os eixos explicam 204× mais que o acaso
  ✓ teto                           48 de 96 células estouram sempre, e 48 terminam
  ✓ distribuição                   nenhuma célula com p10 = p90 em paradas/Tick
  ✘ fuga-consumada                 fuga-consumada acima de 90% em 2 célula(s): a fase de fuga engoliu a batalha · coprimo-encostado-2x8-apertado 98%, coprimo-encostado-2x8-aberto 99%
```

Antes disto, "nenhum alarme" e "o alarme não roda" imprimiam exatamente a mesma coisa: nada.

> **O placar anterior estava errado, e de um jeito que importa.** A redação que este trecho
> substitui trazia dez linhas transcritas à mão de uma execução anterior ao commit carimbado
> (4.409.780 re-projeções, um número que nenhuma das seis baterias guardadas em `.sim/` produz), e
> faltava nela o `ocasião · passo`, que é o sinal que guarda o piso de 11,4% da §2.4: se
> `log.andou` se soltar, o Tick morto vira igual ao Tick sem parada, o piso vira o teto e nada
> acusa. Achado da revisão (rodada 01). O conserto não é a transcrição nova: é o `--gravar` do
> agregador, que versiona a saída inteira para que o placar publicado seja um trecho de arquivo
> com linha, e não memória de terminal.
>
> **E a hipótese óbvia para o 4.409.780 foi testada, e caiu.** Ele entrou neste documento no
> commit `2df566f`, e entre ele e a bateria publicada houve `9580661`, que mexeu em `motor.mjs` e
> em `log.mjs`: era plausível que o número fosse o daquele motor. Rodei a grade inteira **na
> árvore de `2df566f`** (`git worktree`, 21.600 batalhas, `dados_hash` `4dd4ab25129ddd83`, que é
> o daquele dia e não o de hoje) e o agregador daquele commit sobre ela. Deu **4.825.078**, o
> mesmo de hoje. O agregado está versionado em `resultados/09-2df566f-bmtlxrjpt.txt`, linha 327.
> **O 4.409.780 continua sem origem encontrada**, agora com a hipótese principal descartada em vez
> de por descartar. Achado da revisão (rodada 02).

**Os que não acenderam** também são informação: nenhum invariante violado em 21.600
batalhas (e são quinze agora: dois que fecham os gestos por classe e por subtipo, e um que recusa parada sem classe);
nenhum contador de ocasião em zero onde deveria morder (re-projeção, fuga, raspão, o
redirecionamento do golpe no caído, a quarta célula do quadro e o passo mordem todos: 16.200 de
16.200 batalhas com distância têm Tick morto menor que Tick sem parada); nenhuma métrica com
p10 igual a p90; e nem toda célula estoura o teto (metade estoura, e são as uníssonas, pelo
motivo de sempre).

**E um décimo segundo, que não está entre os onze, acendeu na bateria de SANIDADE da primeira
volta e foi consertado antes da grande**, que é exatamente para isso que ela existe: o eixo E4
estava inerte (§5, D31). Ele mora no agregador e não em `sinais.mjs`, e por isso é o único alarme
sem o teste que os onze têm; está anotado como pendência.

### 4.1 A variância diz que os eixos estão fazendo o trabalho

| variância entre repetições da mesma célula | variância entre células |
|---:|---:|
| 0,059 | **12,06** |

**Os eixos explicam 204 vezes mais que o acaso.** É o oposto do sinal de bateria ineficaz, e é
também a justificativa de as repetições poderem ser poucas (§5, D33).

---

## 5 · As decisões

### 5.1 D37 a D40 · as quatro que vieram do chat, e o que elas moveram

A primeira execução desta grade levantou quatro perguntas de regra que estavam presas no código
sem ninguém ter decidido. As quatro foram respondidas e implementadas, e a bateria rodou de novo.

**D37 · O tipo de dano da ficha segue o `principal: true` do catálogo.** `resumoCombatePC`
ordenava os modos por `MODO_ORDEM` (impacto, corte, perfurante) e pegava o primeiro, ignorando a
marca do catálogo. A sigla vai para a expressão de dano, a mesa lê o tipo dela (`tipoDeDano`), e é
ele que escolhe **qual Absorção o alvo aplica**. Ver a §5.4, onde o tamanho da mudança está
medido e não estimado.

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

**O que sobra e roda:** `E1(2) × E2(4) × E3(3)` = 24, vezes o limiar de fuga (2) e o tabuleiro
(2, o eixo E12) = **96 células**.
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
**(Registro histórico: eram seis aqui. Hoje são onze, todos em `sinais.mjs` com par de casos de
teste, e o placar da §4 é a lista de agora.)**
**Custo:** um sinal aceso exige explicação escrita antes de o número sair, e isso é trabalho. A
alternativa é ninguém olhar, que foi o que aconteceu nas duas rodadas anteriores.

### 5.3 D41 a D44 · a revisão das quatro, e a regra que não fechava

**D41 · O retrato da abertura do Tick é a única fonte de verdade do golpe no caído.** A D38, do
jeito que ficou escrita, **não fechava**: ela mandava olhar se o alvo está no chão AGORA, e "agora"
dentro de um Tick depende de qual peça o motor processou primeiro. De duas peças que se derrubam
no mesmo Tick, o atacante de quem caiu primeiro redirecionava e o outro não. **A diferença não
vinha de ficção nenhuma, vinha da ordem do laço**, num sistema que se chama simultâneo.

O conserto é o retrato que já existia (`CAIDOS_AO_ABRIR`), promovido a fonte única: **quem estava
de pé quando o Tick abriu está de pé para todos os golpes daquele Tick.** A regra fica em duas
linhas simétricas:

- caiu num Tick **anterior** · o atacante viu cair, e pode cancelar ou redirecionar;
- caiu **neste** Tick · ninguém sabia, e o golpe resolve **como foi declarado**, no corpo que
  estava de pé quando o gesto saiu.

Some a dependência de ordem. O caso que sobra, um golpe caindo num corpo que acabou de cair, é
exatamente a ficção do simultâneo, e não um defeito dela.
**Custo:** um golpe a mais desce em corpo caído por batalha, e a caixa de escolha do mestre passa
a abrir menos vezes. E o `cancelar` volta a ser incondicional, porque a caixa só abre no caso em
que deu para ver o corpo cair.
**Conferido:** `npm run caido` (22 asserções no caminho do mestre, com a quarta cena nova, a do
corpo que cai dentro do Tick) e `npm run espelho` (7 cenas × 2 sementes, sem divergência).

**D42 · A bateria publica DUAS frações, nunca uma.** É a §2.2 inteira.
**Custo:** um número a mais para explicar, e a admissão de que o número publicado até aqui
respondia outra pergunta. Em troca, a conclusão ficou **maior**: metade dos gestos, e não um
quinto.

**D43 · A classe de cada tipo de parada sai do log, escrita pelo motor.** A primeira versão da
tabela da §2.2 trazia um mapa tipo→classe escrito no agregador, e ele dizia `fugir` classe i e
`aplicar` classe iii quando o motor registra **ii nas duas**. Uma coluna publicada com classe
inventada é o caso exato que o D13 vigia.
**Custo:** um campo a mais em cada resumo de batalha. Barato, e a alternativa era manter duas
cópias da mesma verdade, que é como as duas leituras da Defesa se separaram sem ninguém ver.

**D44 · O custo do redirecionamento e o critério "o mais próximo" entram na lista ⚑.** O
redirecionar é uma parada de classe i que custa **um gesto numa peça de jogador e zero numa
automática**, e a bateria roda só automática. E "o inimigo de pé mais próximo" é política escrita
dentro do motor: `regras.json` diz que redireciona ao alcance da arma e não diz para qual.
**Custo:** dois furos declarados em vez de dois números invisíveis.

### 5.4 O tamanho da D37, medido

A troca do modo principal parecia conserto de vitrine e não é: a sigla escolhe a **categoria de
Absorção**, e as três não valem a mesma coisa (só o Impacto recebe o Vigor natural do alvo).
`scripts/dano-por-tipo.mjs` calcula o dano líquido médio por golpe que acerta, exato e não
simulado, enumerando a distribuição de `Nd6 + fixo`.

**Seis armas mudaram de lado**, e a sexta é a Alabarda, mas por outro motivo: ela marca os TRÊS
modos como principal, e nesse caso quem decidia era a ordem de exibição, dentro do `find`. Saía
**impacto**, que é o pior ou o empatado-pior contra os três alvos de referência: a arma que existe
para cobrir as três frentes estava saindo pela face mais fraca, e por acidente. Ver a D45.

| arma | dano | mudou | contra alvo NU | contra malha | contra placa |
|---|---|---|---:|---:|---:|
| Machado | 1d6 +5 | Impacto → Corte | **+230%** | **−50%** | 0 |
| Picareta de Guerra | 1d6 +5 | Impacto → Perfuração | **+230%** | **+350%** | +1,67 |
| Machado de Arremesso | 1d6 +7 | Impacto → Corte | **+114%** | **−33%** | +200% |
| Alabarda (D45) | 1d6 +12 | Impacto → Corte | +47% | −13% | +29% |
| Montante | 2d6 +10 | Impacto → Corte | +40% | −11% | +20% |
| Adaga | 1d6 +3 | Corte → Perfuração | 0 | +2,50 | +0,50 |

**O sinal depende do alvo, e as duas pontas são grandes.** Contra alvo sem armadura as que foram
para Corte sobem muito, porque o Impacto absorve Vigor + Centelha e o Corte só Centelha. **Contra
malha três delas descem**, porque a malha protege mais contra corte (9) que contra impacto (8).
Somando os dezoito pares arma × alvo: **doze sobem** (média +2,51 de dano por golpe), **quatro
descem** (média −0,83) e dois não mudam.

**E a Adaga não zerou, subiu.** O medo era o gate de Perfuração, e ele não morde ninguém hoje:
`gatePerfuracaoAbre` existe em `src/lib/calc.ts` e **nenhum caminho de produção a chama**, nem
`resolverGolpe`, nem a folha do Grid, nem o harness. O risco é real na régua e nulo no motor, e
vira real no dia em que alguém ligar o gate: aí a Adaga (Nível de Perfuração 0) passa a resvalar
em porte Enorme, Imenso e Colossal. **Enquanto isso, a troca a melhora contra armadura**, porque
a Absorção de Perfuração é a mais baixa das três (4 na malha contra 9 de corte).

**O oráculo dos lances foi recoletado, e saiu byte a byte igual.** A bancada do `?lances=1` monta
combatentes sintéticos e escolhe o `tipoDano` por construção, sem passar por `resumoCombatePC`:
os 1.315 lances **não** envelheceram com a D37, e só o carimbo do commit mudou. Anotado no
coletor para a pergunta não voltar.

**O `personagens.resumo` do banco.** Ele guarda a expressão de dano, e portanto guarda o tipo
velho até alguém regravar. Duas coisas: **o combate não lê dele.** `resumoDe` chama
`resumoCombatePC(ficha)` ao vivo para peça de PC, então o Grid já roda com a régua nova desde o
deploy. Quem lê o cache é a fatia "Status"/"Vida" que os companheiros veem. E **a regravação já é
automática**: a aba Grupo recalcula e grava o que diferir a cada visita do mestre ou do dono.
Não há migração a fazer.

### 5.5 A varredura das quinze bandeiras, e o achado da rodada

O `gate` estava numa situação específica: a regra escrita na régua, a função escrita em `calc.ts`,
e **nenhum caminho de produção chamando a função**. A revisão pediu que isso virasse regra geral
em vez de nota daquela célula, e que as outras catorze fossem varridas. Foram, e o resultado é
maior que o item que o pediu.

**Todas as quinze estão na mesma situação, e isso quer dizer uma coisa específica:**

> **O item 1.0 da Etapa 1, que foi dado como feito, entregou o carimbo, a migração e a tela, e não
> entregou a única coisa que fazia o carimbo valer: alguém que leia o perfil na hora de aplicar a
> regra. A infraestrutura da comparação de regras existe inteira e não está conectada ao motor.**

O perfil é gravado, viaja no encontro, aparece na tela, é comparável e é recarimbável. E é lido em
**um** lugar do código de produção, `grid.astro:8139`, onde ele é copiado para dentro da entrada do
lance, para o oráculo. `entrada.perfil` **não é consultado em lugar nenhum**: nem em
`resolverGolpe`, nem em `quase-acerto.ts`, nem em `calc.ts`, nem no harness.

**O desenho de 112 células pressupunha um mecanismo que não existe.** As 68 que existem para medir
bandeiras dariam **zero por dois motivos indistinguíveis**: ou a regra não morde naquela cena (o
zero legítimo, que é informação), ou a regra não roda em cena nenhuma (o zero vazio, que não é).
Os dois saem com o mesmo valor no CSV, e nada na leitura os separa.

**Ninguém percebeu em sete rodadas de documento**, e o motivo não é desatenção, é mecânico:
**todos os relatórios rodaram com tudo desligado, e tudo desligado é o único estado em que a
ausência do mecanismo é invisível.** Com o perfil todo `false`, "a bandeira está desligada" e "a
bandeira não é lida" produzem exatamente o mesmo comportamento, o mesmo número e o mesmo log. O
primeiro `true` teria acusado na primeira batalha. A `notaEstado` do perfil em `regras.json`
chegou perto e parou na metade: ela diz que nenhuma bandeira está ligada no motor, e trata isso
como estado transitório de três delas.

#### O que mais foi construído em cima dessa premissa

| construção | o que ela pressupõe | estado |
|---|---|---|
| **as células hospedeiras** (`02` §0.10.1) | que ligar a bandeira muda o resultado NAQUELA cena | inerte: hoje não muda em cena nenhuma |
| **a referência única do F5** | que o delta da hospedeira contra a âncora extrema mede a bandeira | inerte: os dois lados dão o mesmo número |
| **a soma de aditividade** | que existe um perfil todo-ligado diferente do todo-desligado | inerte: hoje são o mesmo jogo |
| **as três células da mediana** | que a mediana separa perfis | inerte: não há perfis a separar |
| **o contador de ocasiões por bandeira** | que a bandeira mordeu | **sobrevive intacto**, e vira o instrumento que detecta o problema: ele daria zero, e o zero dele é inequívoco |

#### O que NÃO cai junto

Nada do que segue depende de bandeira nenhuma, e é o que esta frente produziu de sólido:

- **as métricas de carga** por Tick, por golpe e por gesto, com a tabela de custo de tela;
- **a partição de quatro estados do Tick** e os quinze invariantes que a fecham;
- **os três termos da conclusão** (§2.3): 50% classe iii, 33% o ⏭, 17% classe ii;
- **os 11,4% do Tick morto** e a banda do avanço automático (§2.4);
- **o resultado do limiar de fuga** e a conclusão de desenho que saiu dele (§3.1).

**A consequência para a ordem** está escrita no `02`, no topo: são **duas** baterias, e não uma. A
de **carga** é esta, ela não usa bandeira nenhuma, já rodou e responde à pergunta original. A de
**comparação de regras** é a segunda, e a primeira coisa dela não é rodar, é ligar o motor: o
**L25**, que deixa de ser item de pendência e passa a ser pré-requisito da grade de 112.

### 5.6 D45 a D48 · a segunda revisão

**D45 · A arma de vários modos principais declara qual vai na ficha**, num campo novo do catálogo
(`fichaModo`). Só a Alabarda tem mais de um principal hoje, e o dado dela está **certo**: a nota
do catálogo e o `modoSecundario` do `regras.json` dizem que ela alterna sem penalidade, que é o
que a arma é. O problema era o outro lado: com três principais, quem escolhia o que ia na
expressão de dano era a ordem de exibição, dentro do `find`, **em silêncio**. O `validate` passa a
recusar arma com mais de um principal e sem `fichaModo`, e a recusar `fichaModo` que aponte para
um modo secundário.
**Custo:** um campo novo no catálogo e uma conferência a mais no portão. E a Alabarda passa a
bater de corte, o que é mudança de balanço (a §5.4).

**D46 · Cada sinal de bateria ineficaz imprime o veredito dele, aceso ou apagado.** A versão
anterior só imprimia os que acendiam, e um sinal que não aparece quando está tudo bem é um sinal
que ninguém sabe se rodou: **o silêncio ficava indistinguível da conferência que não aconteceu**,
que é o defeito exato que os alarmes existem para não ter.
**Custo:** dez linhas a mais na saída, toda vez. É o preço de o "nenhum alarme" significar
alguma coisa.

**D47 · Nenhuma parada pode ter classe ausente ou fora de `{i, ii, iii}`** (o invariante V15), e o
agregador **falha** ao encontrar um tipo que ele não conhece, em vez de carimbá-lo com `?`.
**Custo:** um tipo de parada novo no motor passa a parar o agregador até alguém decidir a classe
dele. É o que se quer: carimbo por padrão é como uma classe errada entra sem ninguém ver.

**D48 · O Tick MORTO entra como contador próprio, ao lado do Tick sem parada.** O motor sinaliza
o passo que de fato muda a casa da peça, e o log separa "ninguém foi consultado" de "nada
aconteceu". Sem essa separação, a economia do avanço automático saía com **teto no lugar de
piso**: 20% em vez de 11,4%, e a diferença inteira é Tick de travessia, em que pular é troca e
não ganho.
**Custo:** um evento a mais no laço mais quente do harness (um `if` por peça por Tick) e dois
campos a mais por batalha. A alternativa era publicar o número que a ressalva já dizia estar
errado.

> **Uma correção de premissa, e ela importa porque um número publicado estaria em jogo.** A
> revisão perguntou quais frações já publicadas nasceram do mapa tipo→classe errado. **Nenhuma.**
> O mapa a mão viveu só dentro da tabela nova da §2.2, no dia em que ela foi escrita, e foi
> corrigido antes de a tabela sair; `git log -S CLASSE_DO_TIPO` mostra um commit só, e nele o mapa
> já lê do log. As frações das três baterias sempre saíram de `est.paradas[classe]`, escrito pelo
> **motor** no ponto da chamada, e os dois pontos em questão (`log.parada('ii', 'aplicar', ...)` e
> `log.parada('ii', 'fugir', ...)`) não mudam desde o commit da primeira bateria (`d191c2c`). O
> `07` e o `08` não precisam de marca de superação por esta causa. O V15 entra assim mesmo: ele
> não conserta um número publicado, ele fecha a porta pela qual esse número poderia ter saído.

---

## 6 · A lista ⚑

O que a bateria usa e não tem na régua:

1. **a política**, a `decisaoAutomatica` do produto. É a invenção que mais pesa;
2. **a manobra é sempre `simples`**, e por isso rajada e empunhadura dupla não aparecem;
3. **os traços dos dois arquétipos**, da ficha de referência do contrato. Os números de combate
   **não** são inventados: saem de `resumoCombatePC`;
4. **o mapa**: faixa de `dist + 8` por `n + 2`, escala 1 m por hexágono. É ele que faz
   `fuga-consumada` dominar nas células encostadas (§4);
5. **a declaração é sempre automática**, e por isso vale zero gesto. **Isto deixou de ser número
   inventado em 03/09**: o caminho manual foi contado lendo o diálogo (2 gestos pelo arrasto, 4
   pelo menu, §2.4). Continua sendo um limite do que a bateria **mede**, porque nenhuma batalha
   dela tem jogador declarando, mas o efeito agora sai publicado como cenário em vez de escondido;
6. **o custo de tela do REDIRECIONAMENTO do golpe no caído** (D44). Mesma origem, consequência
   diferente: aqui não é uma linha que a bateria zera, é uma parada de **classe i** que ela apaga
   do numerador. Nenhuma peça desta bateria é de jogador, e é a de jogador que abre a caixa;
7. **o critério "o inimigo de pé MAIS PRÓXIMO"** para onde o golpe redirecionado desce (D44).
   `regras.json` diz que redireciona ao alcance da arma e não diz para qual. Número pequeno, mas
   escrito dentro do motor, que é o lugar exato que o D13 vigia.

Saiu desta lista o multiplicador de passo do E4, junto com o eixo (D31).

---

## 7 · O que a próxima bateria precisa, e esta não teve

1. **Uma política que recua.** É a peça que falta para E4 existir, e é o que separa "o robô do
   produto" de "o jogo". Sem alguém que se afaste, metade da geometria do Grid nunca é exercitada.
   É o **L20**;
2. **manobra que não seja `simples`.** Rajada e empunhadura dupla mudam `penDados`, mudam a
   agenda, mudam o número de folhas por ação. É onde o conserto do L11 vive, e nenhuma batalha
   desta bateria passa por lá;
3. **as quinze bandeiras LIGADAS NO MOTOR, uma a uma, antes de qualquer medição.** Isto não é item
   desta lista: é **pré-requisito da SEGUNDA bateria**, a de comparação de regras, que não existe
   e não pode existir hoje (§5.5). Nada nesta bateria de carga depende dele, e ele não atrasa
   nada do que está publicado aqui. É o **L25**;
4. **um mapa que não seja uma faixa de nove colunas.** Enquanto o tabuleiro couber em um Tick de
   corrida, `fuga-consumada` vai dominar por construção (§4);
5. **uma criatura de bestiário no elenco**, para o eixo E11 e para o `porte` deixarem de ser zero
   por construção;
6. **o fator de conversão para segundos** (o **L7**). Toda a leitura sai em gestos e em Ticks, e um
   gesto pode levar um segundo ou trinta;
7. **o caminho HUMANO da regra do golpe no caído** (D38, D41). A bateria roda o robô, que
   redireciona sozinho; a caixa de escolha do mestre existe no código, tem teste de clique
   (`npm run caido`) e **nenhuma batalha passou por ela**. É o ⚑ 6 da §6, e o único jeito de
   fechá-lo é uma peça de jogador no elenco;
8. **o custo de tela do caminho MANUAL de declaração.** Os 50% da §2.2 são do robô, em que
   declarar não custa clique. Isto **não precisa de bateria nova**: as declarações já estão
   contadas (228.332), e o que falta é preencher uma linha de `custo-tela.mjs` lendo o diálogo de
   ataque. A §2.4 já publica o intervalo para `G` de 0 a 4, e a conclusão do avanço automático
   sobrevive em todos eles;
9. **uma peça que se MOVA diferente do robô** (recua, reposiciona). Essa sim muda a trajetória, e
   portanto a contagem de Ticks de travessia, que é a diferença entre o teto e o piso da §2.4. É o
   **L20**, e é a única das duas que exige elenco novo.

E uma que não é de escopo e sim de método: **o elenco uníssono empata**. Metade das 96 células
estoura o teto de 2.000 Ticks porque o Escudeiro não fura a Absorção do Escudeiro. Isso continua
sendo o achado e não o defeito (é o que `margem` e `bloqueio` existem para consertar), mas
significa que **metade da grade mede um jogo que não anda**. Com as bandeiras ligadas, essa metade
volta a ser jogo, e aí ela precisa rodar com as 400 voltas e não com 50.

---

## 8 · O que fica, e o que vem

### 8.1 O que a frente entregou de duradouro, e não são os números

Os números respondem **uma** pergunta, e ela está respondida. Cinco coisas respondem as
**próximas**, e é por elas que esta frente vale mais do que a conclusão dela:

| | **o que ele GUARDA** | onde | o que quebra se apagar |
|---|---|---|---|
| **o espelho de motor** | **a ORDEM DAS OPERAÇÕES** dentro do Tick, que não existe como função pura em lugar nenhum e por isso não tem outro teste possível | `npm run espelho`, 7 cenas × 2 sementes | o harness volta a medir um jogo que a mesa não joga, e sem barulho. Ele já achou **seis** divergências de ordem que passaram por uma revisão inteira e por 6.000 batalhas |
| **os quinze invariantes** | **a COERÊNCIA DO ESTADO** de cada batalha: que os contadores fecham entre si e que nenhum número impossível vira média | em memória, em toda batalha; quem viola vai para um balde | um número impossível volta a sair plausível. O V6 e o V7 nasceram de uma tabela publicada em que `1,14 parada/Tick`, `86% de Ticks vazios` e `pico 4` não cabiam juntos |
| **os onze sinais, com teste** | **AS CONCLUSÕES PUBLICADAS**: cada número que saiu daqui tem um alarme que acende se a fonte dele se soltar | `sinais.mjs` + `test-sinais.mjs` | o piso de 11,4% vira 20% redondo e plausível no dia em que `log.andou` se soltar, e nada acusa. E os alarmes voltam a imprimir o mesmo ✓ para "não houve problema" e para "o predicado está errado" |
| **o oráculo de 1.315 lances** | **A RESOLUÇÃO**: o comportamento real de `resolverGolpe`, campo a campo, com cobertura por construção e não por acaso | `scripts/fixtures/lances.jsonl` | a régua do golpe muda de comportamento sem ninguém ver. É a lição do `lib-tempo`: cinco divergências passaram nos testes unitários **dos dois lados** e nenhuma foi pega por teste |
| **o princípio do zero ambíguo** | **CONTRA O ZERO DE DUAS CARAS**: que um mecanismo ausente volte a se disfarçar de resultado | a regra no `02`, com três casos e cinco obrigações | a mesma forma de erro aparece uma quarta vez. Ela apareceu três, e a terceira (as quinze bandeiras) sobreviveu a sete rodadas de documento |

### 8.2 A resposta final: o teto do que este projeto pode tirar do mestre

A pergunta que abriu a frente era quanto da carga do mestre a automação pode tirar. Empilhando os
consertos que esta bateria identificou, na ordem em que eles dependem uns dos outros:

| | trabalho | do de hoje | o que foi tirado |
|---|---:|---:|---|
| **hoje** (modo `mesa`) | 1.095.869 | 100% | · |
| **+ modo `site`** | 727.801 | 66,4% | os dois números digitados por golpe |
| **+ avanço unificado** (piso) | 538.355 | 49,1% | o ⏭ do Tick morto, e um cartão por parada |
| **+ a folha resolvendo sozinha** | **418.530** | **38,2%** | o resto da classe iii |

> **O teto do que este projeto inteiro pode tirar do mestre é 62% do trabalho de hoje. E o que
> sobra não tem conserto de software.**
>
> Os 38,2% que restam são **234.496 cliques de ⏭ que param por motivo real** e **184.034
> `aplicar`**, que é a mesa decidindo se o resultado vale. A composição final é **56% cadência de
> relógio e 44% julgamento, com ZERO de aritmética.**

Três leituras que essa linha obriga, e nenhuma delas é confortável:

1. **O último degrau é o mais caro e o menos seguro.** Ir de 49,1% para 38,2% exige a folha
   resolver sozinha, e é exatamente onde a condição da §2.5 morde: a régua que o Grid aplica sem
   mostrar é a régua que ninguém confere. Três defeitos desta frente viveram anos assim;
2. **o primeiro degrau é o mais barato e não é meu para dar.** Ir de 100% para 66,4% é uma
   conversa (o **L26**), não um commit;
3. **o piso de 38,2% é o do robô.** Com jogadores declarando à mão, `declarar` deixa de valer
   zero, mas o gesto é do jogador: o trabalho do mestre não muda e a fração dele também não
   (§2.4); o que cresce é o trabalho da mesa, e a fração sobre ele cai. **O que este
   projeto não consegue tirar não é 38,2% de um número fixo, é um clique por Tick que para e um
   por golpe que cai**, e esses dois não têm conserto de software porque não são conta: são a
   cadência da cena e a decisão da mesa.

#### E o resíduo escala com o TAMANHO DA CENA, não com a complexidade da regra

O resíduo por batalha, medido (mapa apertado, limiar de produção, só as que terminam):

| cena | peças | Ticks | ⏭ que param | `aplicar` | **resíduo** |
|---|---:|---:|---:|---:|---:|
| 1v1 | 2 | 44 | 23 | 9 | **32** |
| 3×3 | 6 | 39 | 23 | 19 | **42** |
| 2×8 | 16 | 30 | 28 | 30 | **58** |

**Oito vezes mais peças, 81% mais trabalho residual**, e o crescimento é **sublinear** porque a
cena grande acaba antes (44 → 30 Ticks). Mas o que interessa é **de onde** ele vem: o ⏭ que para
fica quase parado (23 → 28), e **todo o crescimento é `aplicar`** (9 → 30, mais de três vezes),
que é a metade do julgamento.

**Nenhuma regra aparece nessa tabela.** O eixo que move o resíduo é quantos corpos estão no mapa,
e a consequência prática é uma só: **uma mesa de dezesseis peças continua pesada depois dos três
consertos, e a única alavanca sobre ela é quantas peças entram em cena** · decisão de mestre, e
não de software.

### 8.3 A próxima medição

**A próxima medição que vale é a de uma mudança que já esteja na mesa.**

Não é falta de pergunta: há oito abertas no `Pendencias` (L20, L22, L23, L24, L25 e as três de
elenco). É que nenhuma delas se responde rodando de novo o que já rodou. A grade de 96 células
está medida, os eixos separam, os invariantes fecham e os alarmes acendem; o que falta agora é
**mudar alguma coisa no Grid e medir a diferença**, e não medir de novo o Grid de hoje.

**A fila do conserto, em três itens, e o segundo é UM desenho e não dois:**

1. **A conversa com quem joga** (§2.5, o **L26**), com duas perguntas: *por que a mesa rola o dado
   na mão* e *com que frequência há efeito de chão ativo numa cena*. A primeira vale 33,6% do
   trabalho sem uma linha de motor; a segunda diz se o piso do avanço (item 2) vale como medido.
   **Nenhuma das duas se responde com código nem com bateria**, e as duas decidem o tamanho do
   item seguinte;
2. **o avanço unificado** (§2.4 e §2.5): o ⏭ corre até a parada real **e abre a folha do golpe que
   o fez parar**. É um desenho só, porque `instanteDeGolpe` tranca o avanço exatamente no Tick em
   que o cartão vence, e separá-lo em dois produziria duas interfaces que se atrapalham. Ele para
   quando alguém é consultado **e** quando um efeito morde, e mostra o que passou no caminho em
   vez de pular calado. Vale **26,0%** do trabalho no modo `site` (17,2% do avanço mais 8,8% dos
   cartões absorvidos), e vem **depois** do item 1, porque a conversa muda o denominador contra o
   qual ele é medido;
3. **o L25**, que não alivia o mestre em nada e destrava a segunda bateria.

**O que ficou de fora da fila, de propósito:** os 65% dos cartões que o avanço não absorve (o 2º e
o 3º golpe do mesmo Tick, porque os golpes chegam em cacho de 2,87). Tirá-los exige a folha
resolver sozinha, e **é o único degrau desta fila que pode PIORAR o Grid**.

> **O critério, registrado agora que ninguém está com pressa de implementar:** se a folha resolver
> sozinha, **a conta tem de continuar legível depois do fato**, e não só o resultado. Quem abrir o
> registro daquele golpe amanhã precisa ver o bolo de dados, a Defesa comparada, a Absorção
> aplicada e o veredito, e não só "13 de dano".
>
> Não é preciosismo: **os três defeitos desta frente viveram anos exatamente por isso.** A rajada
> saindo de graça, o tipo de dano errado em seis armas e o golpe resolvido dez vezes numa volta
> passaram despercebidos porque a tela mostrava o **resultado** e não a **conta**, e nos três quem
> achou foi um instrumento novo, e não um olho. Automatizar a resolução sem deixar a conta legível
> é construir a quarta ocorrência.

---

## 9 · Como reproduzir

```
node scripts/sim/bateria.mjs --sanidade          # a que existe para falhar
node scripts/sim/bateria.mjs --saida .sim/<data> # a grande, 96 células
node scripts/sim/agregar.mjs --saida .sim/<data> --gravar docs/simulacao/resultados/09-<run_id>.txt
```

O `--gravar` guarda a saída inteira do agregador, e é ela que fica versionada:
`resultados/09-bmtlxp622.txt` é a da bateria deste documento. O `.sim/` não é versionado, então o
arquivo gravado é a única procedência que sobrevive a um `git clean`, e toda linha citada neste
documento aponta para ele.

**As duas primeiras linhas do arquivo são DOIS carimbos, e não um.** A primeira é o commit da
árvore que rodou as batalhas; a segunda é o da árvore que as leu, com o aviso de árvore suja se
for o caso. Elas são diferentes sempre que o agregador ganha tabela sobre dados já gravados, que é
o caso comum, e a rodada 02 publicou um arquivo cuja linha 2 dizia `80d5db7` enquanto o bloco que
o escreveu só existia depois desse commit. Quem escreve o arquivo se carimba.

Os outros agregados versionados nesta pasta não são a bateria deste documento, e servem a uma
afirmação só: `09-bmtlw3e2r.txt` é a bateria da rodada 02, guardada para que a reprodução linha a
linha da rodada 03 possa ser conferida; `09-2df566f-bmtlxrjpt.txt` é a grade rodada na árvore de
`2df566f`, e existe só para descartar a hipótese do 4.409.780 (§4).

E **uma batalha sozinha**, pelo índice, sem depender de nenhuma anterior (a semente é
`hash32(semente_mestre, célula, repetição)`, derivada e não sorteada):

```
node scripts/sim/rodar.mjs --de <idx> --ate <idx+1> --imprime \
  --n 400 --unissono 50 --semente 20260903 --saida .sim/avulsa
```

O comando sai impresso no próprio manifesto de cada bateria, com os parâmetros daquela execução.
