# Estado da frente de simulação do Grid

**Escrito para quem não acompanhou nenhuma rodada.** Quatro seções e nada além
delas. Não é a história de como se chegou aqui: é onde estamos.

Todo número desta página sai de `docs/simulacao/resultados/09-bmtmbdppb.txt`, que é
a saída inteira do agregador sobre a bateria `bmtmbdppb` (21.600 batalhas, 96
células, zero inválidas, commit `b9fa8ac`, árvore limpa). `R:` é linha nele.

**Esta bateria é posterior ao conserto da iniciativa** (ver a seção 3). Os números
publicados antes dele, inclusive os da `09`, mudaram todos, e a `09` traz o aviso
disso na §2.4.

---

## 1 · O QUE FOI MEDIDO

A pergunta é uma só: **quanto do trabalho do mestre, numa batalha do Grid, a
automação pode tirar.** Trabalho aqui é gesto de tela: clique, arrasto, número
digitado.

### O trabalho do mestre não é uma coisa, são três

| | gestos | fatia | quem consegue tirar |
|---|---:|---:|---|
| **aritmética** | 597.714 | 51% | automação de regra |
| **o ⏭**, cadência de relógio | 375.005 | 32% | ninguém: nenhuma regra o toca |
| **julgamento** | 199.238 | 17% | ninguém: é a mesa decidindo |
| **total** | **1.171.957** | **100%** | |

Procedência: `R:134` a `R:137`.

**E a aritmética inteira sai de UMA parada, a folha da resolução** (`R:128`). As
outras cinco paradas do Tick somam 60% das ocasiões e custam zero gesto. Isso
importa porque decide onde vale mexer: não há seis lugares para atacar, há um.

### O teto do que este projeto pode tirar é 61,8%

| | trabalho | do de hoje | o que sai |
|---|---:|---:|---|
| hoje, modo `mesa` | 1.171.957 | 100% | · |
| + modo `site` | 773.481 | 66,0% | os dois números digitados por golpe (`R:181`) |
| + avanço unificado | 573.255 | 48,9% | o ⏭ do Tick morto, e um cartão por parada (`R:182`) |
| + a folha resolvendo sozinha | **448.224** | **38,2%** | o resto da aritmética (`R:183`) |

O teto está em `R:185`.

**O que sobra não tem conserto de software.** O resíduo de 448.224 é 55% de ⏭ que
param de verdade e 45% de aplicar o golpe (`R:184`): um clique por Tick que para e
um por golpe que cai. É a cadência da cena e a decisão da mesa. **E ele cresce com
o TAMANHO da cena, não com a complexidade da regra**, o que quer dizer que nenhuma
simplificação de regra o reduz.

### O avanço automático, medido sozinho

Se o ⏭ pulasse os Ticks em que não há nada a fazer, ele tiraria de **10,8% a 17,9%**
do trabalho do mestre no modo `mesa` (`R:190`), e de **16,3% a 27,2%** no modo
`site` (`R:199`). O piso conta só os Ticks em que nada parou **e** nada andou; o
teto conta todo Tick sem parada, inclusive aqueles em que as peças andaram e o
mestre talvez quisesse ver.

Com jogador declarando à mão, a fração cai, mas **por crescimento do denominador e
não por o mestre trabalhar menos**: numa mesa em que os jogadores declaram um lado e
o robô declara o outro, fica entre 8,8% e 9,0% com dois gestos por declaração, e
entre 7,4% e 7,7% com quatro (`R:188` a `R:198`).

### O que esta medição NÃO diz

Ela mede o robô do produto, com as quinze bandeiras desligadas, manobra sempre
simples, sem peça de jogador, sem criatura de bestiário e sem Arte. Das 112 células
oficiais do projeto, **88 não rodam** (decisão D30 da `09`). Nada aqui fala de
bandeiras, políticas, obstáculo, leitura, reforço nem criaturas.

---

## 2 · O QUE VAI MUDAR NO GRID

> **Nenhum conserto desta fila foi implementado por causa desta frente.** O item 1
> já existia no produto antes dela. Os itens 2, 3 e 4 não têm uma linha escrita. A
> frente mediu; ela ainda não mudou a mesa.

| # | o conserto | o que tira | o que custa | está no Grid? |
|---|---|---|---|---|
| 1 | **o modo `site`**: o site rola os dados em vez de a mesa rolar | **34,0%** do trabalho do mestre (`R:166`) | nada de código. O custo é de mesa: ela para de rolar dado na mão | **SIM, e já existia.** É a opção `combate.rolagem`. O que falta não é código |
| 2 | **o avanço unificado**: o ⏭ corre até a parada real **e abre a folha do golpe que o fez parar** | 25,9% no piso e 36,8% no teto, sobre o trabalho no modo `site` (`R:176` e `R:177`) | um desenho só, e não dois. Mais a regra de opacidade: toda conta que sair da mão do mestre precisa continuar visível | **não** |
| 3 | **a folha resolvendo sozinha** | leva o trabalho a 38,2% do de hoje (`R:183`) | a mesa deixa de ver a conta do golpe. É por isso que vem depois do 2 | **não** |
| 4 | **o L25**: as quinze bandeiras lidas pelo motor | **zero** para o mestre | é pré-requisito de qualquer bateria que compare regras, e nada mais | **não** |

**A ordem de execução não é a da tabela.** O item 1 está pronto e travado numa
pergunta que não é de código: *por que a mesa rola o dado na mão?* Enquanto ela não
for respondida, não se sabe se os 34,0% existem na prática. O item 2 vem depois
disso, porque a resposta muda o tamanho dele. O 3 vem depois do 2. O 4 não alivia o
mestre em nada.

---

## 3 · O QUE AS RODADAS 02, 03 E 04 ACRESCENTARAM A ESSA FILA

**Nada.**

A fila da seção 2 é hoje exatamente a que a `09` publicou antes das três rodadas.
Nenhum item entrou, nenhum saiu, nenhum mudou de tamanho.

O que as três rodadas produziram foi: um número novo (a repartição das declarações
por lado, na rodada 03), a refutação de uma explicação publicada, o diagnóstico da
causa dessa refutação, e conserto de instrumento. Nenhuma dessas coisas é um
conserto do Grid, e nenhuma mudou quanto os consertos da fila valem.

**O achado da rodada 04, a conferência que fiz dele, e o conserto.** A rodada 04
localizou a causa da assimetria entre os dois lados: a montagem da cena dá ordinais
0 a n−1 ao lado `a` e n a 2n−1 ao lado `b`, e a iniciativa de cada peça era derivada
do ordinal. Como o ordinal não muda de batalha para batalha, **a iniciativa era a
mesma nas 21.600**, e o desempate da fila saía decidido antes de a cena começar: nas
células de uma peça por lado, o lado `b` tirava 6 e o lado `a` tirava 0 em 100% das
batalhas. **É defeito de harness**, e não achado de jogo.

A mesma função tinha um segundo defeito, achado ao consertar: ela não devolvia um
d6. O deslocamento com sinal fazia o resto sair negativo, e o resultado ia de −4 a 6,
onze valores.

**Consertado:** a iniciativa passou a sair da semente da batalha, e não do ordinal. O
espelho continua concordando nas duas sementes de todas as cenas, porque ele já
mandava a semente ao mock pela URL. A distribuição agora é uniforme de 1 a 6, medida
em 20.000 sementes.

**O que o conserto mudou**, medido nas células `unissono`, em que os dois lados são o
mesmo arquétipo e por isso qualquer assimetria é defeito:

| | antes | depois |
|---|---:|---:|
| declarações do lado `b` por declaração do lado `a`, uníssono | 1,178 | **1,031** |
| a repartição publicada | 45,1% / 54,9% | **47,1% / 52,9%** |
| o trabalho do mestre | 1.095.869 | 1.171.957 |
| a economia do avanço, modo `mesa` | 11,4% a 20,0% | 10,8% a 17,9% |
| **o fim da escada** | **38,2%** | **38,2%** |
| **o teto do que o projeto tira** | **61,8%** | **61,8%** |

**As duas últimas linhas não se mexeram**, e é o resultado que mais importa: o
defeito inflava e desinflava os totais, e não mudava a proporção entre os três termos
nem o teto. Nenhuma conclusão da frente dependia dele.

**O que NÃO ficou explicado:** nas células `coprimo` a razão continua em 1,290, e ali
não é defeito, porque os dois lados têm arquétipos diferentes de propósito e ciclo
diferente declara em cadência diferente. Mas no uníssono sobram **1,031**, e esses 3%
não têm causa nomeada.

O aviso da rodada 04 afirma também que a assimetria existe na mesa, porque a mesa
compartilharia a montagem da cena, e a revisora deu isso por confirmado. **Conferi,
e é falso.** A montagem da cena e a derivação da iniciativa moram só em `scripts/`,
e nada em `src/` as importa. O que o espelho comparou foi o harness contra
`scripts/mesa-mock.mjs`, que é uma imitação da mesa e chama a mesma função do
harness: a assimetria aparecer nos dois lados dessa comparação é circular, e não
evidência sobre o Grid. No Grid de verdade a iniciativa é rolada pelo mestre num
botão e guardada no banco, e ordinal nenhum entra nela.

**Consequência:** o conserto é do harness, é local, e não tem acoplamento com a
mesa. A decisão que a rodada 04 escalou para o humano estava apoiada nesse
acoplamento, que não existe. O conserto não foi feito aqui porque esta passada é só
o documento.

---

## 4 · O QUE FOI FEITO NO INSTRUMENTO desde a `09`

- o `declarar` contado por lado no log, que é o que permitiu medir a mesa em que só
  um lado declara à mão;
- a tabela do `G` publica **dois denominadores**, o do mestre e o da mesa, porque
  gesto de jogador não entra na conta do mestre;
- o agregador ganhou `--gravar`: a saída inteira vai para um arquivo versionado, e é
  dele que os documentos citam linha;
- o agregador carimba **o próprio commit**, e não só o da bateria;
- uma trava que para o agregador se a repartição por lado não somar o total em
  algum tipo de parada;
- `test-procedencia.mjs`, no portão: a linha citada de um agregado tem de conter o
  número citado;
- o placar dos alarmes foi refeito a partir do agregado versionado, e o sinal
  `ocasião · passo`, que guarda o piso de 11,4%, entrou nele;
- a hipótese sobre a origem do número órfão 4.409.780 foi testada na árvore antiga e
  descartada;
- na caixa de revisão: o `nada` de uma seção passou a aceitar justificativa em prosa;
  a digital da repetição deixou de tratar um identificador igual como assunto igual;
  a chamada que morre passou a dizer por que, lendo o stdout; o custo de uma chamada
  morta deixou de valer zero; e o teto de custo passou a ser por assunto, com o
  acumulado persistido entre execuções;
- o princípio do zero ambíguo foi de três casos para oito, e ganhou a lista do que
  foi cortado, que é o instrumento do oitavo.

---

## A fila da seção 2 mudou por causa das rodadas 02, 03 e 04?

**Não mudou, e nem podia:** as três rodadas mediram o mesmo Grid com o mesmo robô, e
uma medição do que já existe não altera quanto vale mudar o que existe. Toda a
diferença que elas fizeram foi na confiança dos números e na qualidade do
instrumento, que é trabalho real e não é conserto de mesa.

**Para a fila mudar, uma rodada precisa medir uma coisa que não está na mesa hoje**,
e não medir de novo a que está: um Grid com o avanço unificado implementado, ou uma
mesa de verdade com jogadores declarando, ou as bandeiras ligadas. Enquanto a
bateria rodar contra o produto de hoje, ela pode melhorar a precisão dos quatro
números da fila, mas não pode acrescentar nem remover um item dela.
