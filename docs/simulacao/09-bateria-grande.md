# 09 · A bateria grande

**03/09/2026.** 21.600 batalhas, 96 células, 30,5 s, zero inválidas. Commit `2df566f`,
semente mestre 20260903.

> **A régua mudou depois da terceira volta (a D45 pôs `fichaModo` no catálogo) e a bateria rodou
> INTEIRA de novo, como manda a D34.** Os números saíram idênticos, e isso é previsão confirmada e
> não coincidência: nenhum dos dois arquétipos do elenco empunha alabarda, que é a única arma que
> a D45 toca. O que mudou foi o carimbo, e é o carimbo que autoriza a leitura.

> **Esta é a TERCEIRA execução da grade.** A primeira (`3544505`) levantou quatro perguntas de
> regra presas no código; a segunda (`fdc9eab`) rodou com as respostas. Esta terceira roda com a
> revisão daquelas respostas: a regra do golpe no caído refeita sobre o retrato da abertura do
> Tick (D41), o tabuleiro promovido a eixo, e o instrumento consertado num ponto que muda o
> número publicado (D42, a §2.2). **Os números aqui são os da terceira**; onde alguma coisa se
> moveu, o movimento está escrito.

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

**A ideia não morre: 61% dos cliques no ⏭ não produzem nada.** Em números:

| | hoje | com avanço até a próxima parada |
|---|---:|---:|
| cliques no ⏭ | 359.733 | **141.054** |
| trabalho total | 1.095.869 | **877.190** |
| composição | iii 50% · ⏭ 33% · ii 17% | iii 63% · ⏭ 16% · ii 21% |

**Vinte por cento do trabalho do mestre, sem tocar em regra nenhuma.** É a maior economia isolada
que esta frente mediu, e a única que não depende de nenhuma das quinze bandeiras.

Três coisas que o número **não** diz, e que decidem se a ideia vale:

1. **Ele é o teto, não a expectativa.** Um Tick sem parada ainda pode ter coisa que o mestre quer
   VER (alguém chegou ao alcance, alguém caiu: é a coluna `só res.` do quadro). Correr por cima
   disso troca cliques por cegueira, e a bateria não mede cegueira;
2. **a variação por célula é enorme**, de 27% a 77%. Na cena em que a carga já é alta (multidão
   perto) o avanço poupa pouco; na cena em que ela é baixa (duelo a distância) poupa muito. **O
   ganho aparece justamente onde o problema é menor**;
3. **isso é com o robô.** Com jogadores declarando à mão, o Tick sem parada nenhuma fica raro, e a
   economia encolhe junto (é o **L23**).

> **O que fica registrado:** a pergunta tem tamanho (20% do trabalho), tem lugar (interface, e não
> regra) e tem contra-argumento medido (o que se perde de vista). Não tem decisão, e é o **L24**.

---

## 3 · A sensibilidade ao limiar de fuga

Não é política nova: é o `fugirAbaixoDePct` do `regras.json`, um valor que já existe, rodado em
dois níveis como eixo próprio. `decisaoAutomatica` ganhou um parâmetro opcional cujo padrão é o
da regra, e a mesa continua chamando com três argumentos.

| nível | batalhas | paradas iii (combate) | **gestos iii** | Tick da fuga | fuga-consumada |
|---|---:|---|---|---:|---:|
| **25%** (produção) | 9.600 | 20%–55% | **50%** | 32,2 | **44%** |
| **10%** | 9.600 | 20%–57% | **53%** | 35,1 | **16%** |

> **A leitura principal quase não muda com o limiar: três pontos percentuais na moeda que conta
> (gestos), dois na de paradas.** A conclusão é robusta a ele. Mas três pontos numa fração não é
> ruído, e a direção tem explicação mecânica.

**A direção: limiar mais BAIXO (foge mais tarde) SOBE a fração de gestos que é iii**, de 50% para
53%. E o mecanismo não é sobre fuga, é sobre **densidade**:

| | limiar 25% | limiar 10% |
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

**O que isso quer dizer para o desenho:** fugir cedo não deixa a mesa mais leve, deixa mais
**diluída**. Os cliques por batalha caem pouco e a proporção de clique-sem-nada sobe. É mais uma
razão para a §2.4 existir.

E ele muda **o desfecho**, e muito: com o limiar de produção, quase metade das cenas termina com
o perdedor saindo do mapa; com 10%, menos de uma em cinco. Ou seja: **o limiar decide como a cena
acaba e não decide quanto o mestre trabalha.** Para o desenho do Grid isso é boa notícia: mexer
nele é uma decisão de sabor, não de carga.

---

## 4 · O alarme aceso, e a explicação que ele exige

O agregador imprime seis sinais de bateria ineficaz. Cinco ficaram apagados. Um acendeu:

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

**E cada sinal agora imprime o veredito dele**, aceso ou apagado (D46). O placar da execução:

```
✓ ocasião · reprojetar             4.409.780 re-projeções nas células com distância
✓ ocasião · fugir                  declarações de fuga acima de zero
✓ ocasião · redirecionar           golpes redirecionados acima de zero
✓ ocasião · raspão                 raspões acima de zero
✓ ocasião · quarta célula do quadro Ticks em que algo caiu sem consultar ninguém
✓ invariantes                      nenhuma batalha violou um dos quinze
✓ variância                        os eixos explicam ~200× mais que o acaso
✓ teto                             48 de 96 células estouram sempre, e 48 terminam
✓ distribuição                     nenhuma célula com p10 = p90
✘ fuga-consumada                   2 células acima de 90%
```

Antes disto, "nenhum alarme" e "o alarme não roda" imprimiam exatamente a mesma coisa: nada.

**Os que não acenderam** também são informação: nenhum invariante violado em 21.600
batalhas (e são quinze agora: dois que fecham os gestos por classe e por subtipo, e um que recusa parada sem classe);
nenhum contador de ocasião em zero onde deveria morder (re-projeção, fuga, raspão, o
redirecionamento do golpe no caído e a quarta célula do quadro mordem todos); nenhuma métrica com
p10 igual a p90; e nem toda célula estoura o teto (metade estoura, e são as uníssonas, pelo
motivo de sempre).

**E o sexto acendeu na bateria de SANIDADE da primeira volta e foi consertado antes da grande**,
que é exatamente para isso que ela existe: o eixo E4 estava inerte (§5, D31).

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

### 5.5 D45 a D47 · a segunda revisão

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
5. **o custo de tela da declaração NA MÃO**. A bateria roda a política automática, em que declarar
   não custa clique nenhum, e esse é o número certo do que ela mede. É a linha mais cara da
   tabela da §2.2 numa mesa com jogadores, e vale zero aqui;
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
3. **as quinze bandeiras ligadas, uma a uma.** É a grade oficial inteira, e é o que 68 das 112
   células existem para medir. Depende do **L1**;
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
8. **a fração de gestos com jogador na mesa.** Os 50% da §2.2 são do robô. Com jogadores,
   `declarar` sai de zero gesto e entra com um diálogo inteiro, e o denominador cresce muito mais
   que o numerador: **a fração de iii vai CAIR**, e ninguém sabe para quanto. É a pergunta mais
   importante que esta bateria deixa em aberto.

E uma que não é de escopo e sim de método: **o elenco uníssono empata**. Metade das 96 células
estoura o teto de 2.000 Ticks porque o Escudeiro não fura a Absorção do Escudeiro. Isso continua
sendo o achado e não o defeito (é o que `margem` e `bloqueio` existem para consertar), mas
significa que **metade da grade mede um jogo que não anda**. Com as bandeiras ligadas, essa metade
volta a ser jogo, e aí ela precisa rodar com as 400 voltas e não com 50.

---

## 8 · Como reproduzir

```
node scripts/sim/bateria.mjs --sanidade          # a que existe para falhar
node scripts/sim/bateria.mjs --saida .sim/<data> # a grande, 96 células
node scripts/sim/agregar.mjs --saida .sim/<data>
```

E **uma batalha sozinha**, pelo índice, sem depender de nenhuma anterior (a semente é
`hash32(semente_mestre, célula, repetição)`, derivada e não sorteada):

```
node scripts/sim/rodar.mjs --de <idx> --ate <idx+1> --imprime \
  --n 400 --unissono 50 --semente 20260903 --saida .sim/avulsa
```

O comando sai impresso no próprio manifesto de cada bateria, com os parâmetros daquela execução.
