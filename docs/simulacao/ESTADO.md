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

### A linha entre o que sai e o que fica

**Custo é o tempo entre a DECISÃO ESTAR TOMADA e o EFEITO APARECER na tela.**
Decidir é jogo, e pode demorar o quanto o jogador quiser. Configurar não é.

| do lado do JOGO, e não sai | do lado do CUSTO, e é tudo o que se quer tirar |
|---|---|
| escolher a arma, o alvo, o alcance, a área da magia, a distância do projétil | somar o que foi rolado |
| escolher a manobra, o modo de deslocamento | digitar o total no campo |
| rolar o dado na mão | digitar o dano, e o segundo input do ataque |
| o veredito, quando ele é julgamento e não conta | aplicar à mão qualquer modificador que a tela calculou e exibiu |
| | abrir, procurar, corrigir e reabrir modal |
| | todo clique de relógio que não abre decisão nenhuma |

**O critério de conflito:** se o mestre está executando consequência de uma decisão
já tomada, é custo; se está tomando a decisão, é jogo. **Na dúvida, é jogo**, porque
tirar diversão por engano é o erro caro e deixar custo na mesa custa uma rodada.

Esta linha substitui a classe iii como definição de alvo. A classe iii dizia onde a
parada nascia; a linha diz o que dentro dela é trabalho de quem opera a tela.

### O trabalho do mestre não é uma coisa, são três

| | gestos | fatia | como se lia antes |
|---|---:|---:|---|
| **aritmética** | 597.714 | 51% | sai com automação de regra |
| **o ⏭**, cadência de relógio | 375.005 | 32% | ninguém tira: nenhuma regra o toca |
| **julgamento** | 199.238 | 17% | ninguém tira: é a mesa decidindo |
| **total** | **1.171.957** | **100%** | |

Procedência: `R:134` a `R:137`. **E a aritmética inteira sai de UMA parada, a folha
da resolução** (`R:128`): as outras cinco paradas do Tick somam 60% das ocasiões e
custam zero gesto.

### Os mesmos gestos, pela linha

O custo de tela de cada parada está escrito em `scripts/sim/custo-tela.mjs`, com a
derivação lida do Grid. Abrindo os três termos por gesto, em vez de por parada:

| o gesto | gestos | fatia | jogo ou custo |
|---|---:|---:|---|
| abrir o cartão vencido na faixa | 199.238 | 17,0% | **custo**: executa uma decisão já tomada na declaração |
| digitar o acerto e digitar o dano | 398.476 | 34,0% | **custo**, e está na lista com todas as letras |
| o botão do veredito (acertou · raspou · errou) | 199.238 | 17,0% | **custo**: a tela já fez a comparação e a exibe; o clique transcreve |
| ⏭ que não abre parada nenhuma | 210.296 | 17,9% | **custo**, e está na lista |
| ⏭ que abre uma parada | 164.709 | 14,1% | **custo neste elenco**: a parada que ele abre é a folha, que é transcrição |
| **total** | **1.171.957** | **100%** | |

**Pela linha, nada do que o mestre faz nesta bateria é jogo.** E o motivo não é que
o jogo tenha sumido: é que **o jogo mora na declaração, e a declaração é gesto do
JOGADOR**, não do mestre. Nesta bateria ela é do robô e custa zero. Escolher arma,
alvo, alcance, manobra e modo de deslocamento acontece tudo lá.

**Quanto do que a escada tirava era jogo: nada.** Os três degraus tiram digitação,
clique de relógio vazio e transcrição de veredito, e nenhum deles toca uma escolha.

**E o teto real, depois de tirar o jogo de dentro dele, é 100%** do trabalho do
mestre nesta configuração. Os 61,8% nunca foram um limite de princípio: eram o
limite dos três degraus que estavam desenhados. O que sobra depois deles, o ⏭ que
para e o botão do veredito, é custo como o resto, e a única razão de estar fora é
que ninguém desenhou como tirá-lo.

> **A ressalva, e ela é grande.** Isto vale para o mestre e para esta bateria, que
> não tem peça de jogador. Numa mesa com gente, parte do ⏭ passa a abrir declaração,
> que é decisão, e vira jogo. **Quanto, não está medido**, e não se mede com bateria:
> depende de quantas peças são de jogador.

### A escada dos três degraus desenhados, e os 61,8% que ela alcança

| | trabalho | do de hoje | o que sai |
|---|---:|---:|---|
| hoje, modo `mesa` | 1.171.957 | 100% | · |
| + a mesa deixa de digitar os totais | 773.481 | 66,0% | os dois números digitados por golpe (`R:181`) |
| + avanço unificado | 573.255 | 48,9% | o ⏭ do Tick morto, e um cartão por parada (`R:182`) |
| + a folha deixa de pedir transcrição | **448.224** | **38,2%** | o resto da aritmética (`R:183`) |

Os 61,8% estão em `R:185`.

> **Os 61,8% são o alcance DESTES TRÊS DEGRAUS, e não um limite de princípio.** A
> leitura anterior dizia que o resíduo "não tem conserto de software", e a linha
> desmente: o resíduo de 448.224 é 55% de ⏭ que param e 45% do botão do veredito
> (`R:184`), e **os dois são custo**. O ⏭ que para abre uma folha que é transcrição;
> o botão transcreve uma comparação que a tela já fez. O que os mantém de fora é
> nenhum dos três degraus tê-los atacado, e não a natureza deles.

**O que sobra cresce com o TAMANHO da cena, não com a complexidade da regra**, o que
quer dizer que nenhuma simplificação de regra o reduz. Isso continua valendo, e é
uma afirmação sobre a forma do resíduo, não sobre ele ser irredutível.

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

> **Nenhum conserto desta fila foi implementado por causa desta frente.** A frente
> mediu; ela ainda não mudou a mesa.

### O que a linha fez com a fila

**O item que era o maior morreu como estava escrito, e o número dele não morreu.**
"O site rola os dados" valia 34,0% do trabalho do mestre, e a leitura era que ele
trocava o prazer de rolar por menos trabalho. **A leitura estava errada, e o custo
de tela mostra por quê:** os três gestos da folha no modo `mesa` são abrir o cartão,
digitar o acerto e digitar o dano. **Rolar não é nenhum deles.** Um punhado de dados
na mesa não custa gesto de tela nenhum, e por isso não aparece nesta conta em modo
algum.

| dos 34,0% que o modo `site` valia | gestos | o que é |
|---|---:|---|
| rolar o dado | **0** | jogo, e nunca esteve na conta |
| digitar os dois totais | **398.476** | custo puro |

**Os 34,0% eram transcrição, inteiros.** A decisão de manter o dado na mão do
jogador não custa um ponto sequer: o que tem de sair é a mesa ter de somar o que
rolou e digitar o total, com o dado continuando a ser rolado na mão.

### A fila

| # | o conserto | o que tira | o que custa | está no Grid? |
|---|---|---|---|---|
| 1 | **a folha aceita o dado em vez do total**: a mesa rola na mão e a tela deixa de pedir a soma digitada | **34,0%** (398.476) | desenho de entrada. Não mexe em regra e não tira dado de ninguém | **não** |
| 2 | **o avanço unificado**: o ⏭ corre até a parada real **e abre a folha do golpe que o fez parar** | 25,9% no piso e 36,8% no teto, sobre o trabalho no modo `site` (`R:176` e `R:177`) | um desenho só, e não dois. Mais a regra de opacidade: toda conta que sair da mão do mestre precisa continuar visível | **não** |
| 3 | **a folha para de pedir transcrição e continua pedindo decisão** | **51,0%** (597.714): os dois totais mais o botão do veredito | a folha não some. Ela deixa de cobrar o que a tela já sabe, e continua abrindo quando há o que decidir | **não** |
| 4 | **as contas que o Grid calcula, exibe e não aplica** (a lista abaixo) | não medido, e não precisa de medição | implementar a aplicação de cada uma | **não** |
| 5 | **o L25**: as quinze bandeiras lidas pelo motor | **zero** para o mestre | é pré-requisito de qualquer bateria que compare regras, e nada mais | **não** |

**O item 3 mudou de forma, e o nome antigo atrapalhava.** Ele não era "a folha
resolvendo sozinha", como se a caixa desaparecesse: **é a folha parando de pedir
transcrição.** O que ela cobra hoje e não devia é o acerto digitado, o dano digitado
e o clique num dos três botões de veredito que a própria tela já calculou e exibe.
Isso é 597.714 gestos, **51,0% do trabalho do mestre**, e engloba o item 1: quem faz
o 3 inteiro não precisa do 1 em separado. O que a folha continua pedindo é decisão,
e decisão fica.

### O item 4 · as contas que o Grid calcula, exibe e não aplica

**São custo puro pela definição, e isto não depende de bateria nenhuma para ser
justificado.** O argumento inteiro é: a tela computou o número, mostrou o número na
frente do mestre, e pede que ele o digite noutro campo. O mestre não decide nada
ali, executa aritmética que a própria tela pediu. Nenhuma medição decide se isso é
custo; medição decidiria só **quanto** custa, que é outra pergunta. É o mesmo tipo
de argumento que fixou o custo da declaração à mão em dois gestos pelo arrasto e
quatro pelo menu: lido do Grid, não cronometrado.

**A lista, conferida contra a `01-diagnostico-carga.md` §C2**, e o número da
chamada não bate com o da tabela:

| | linhas |
|---|---:|
| itens na tabela | **18** |
| o Grid **aplica** (ferimento do atacante · ferimento do alvo · escada e Pressão) | 3 |
| o Grid **não aplica** | **15** |
| desses, o Grid **exibe** e não aplica | 6 |
| desses, o Grid **nem exibe** | 9 |

As dezesseis são outra coisa: são as dezesseis **bandeiras** de regra, que aparecem
na `04-prontidao.md`. A confusão vale a nota porque as duas listas falam de coisas
que o Grid tem e não usa.

**A divisão em seis e nove muda o conserto de cada metade.** As seis que ele exibe
já estão calculadas na tela e só precisam ser aplicadas: contrapé da iniciativa,
faixa de distância no tiro e no arremesso, alcance no corpo a corpo (que é só aviso
e não pede digitação), gate de Perfuração, a Defesa −4 da Corrida, e a penalidade de
manobra, que ele já aplica quando o site rola. As nove restantes ele **nem calcula**:
margem de dano, Porte no acerto, Couraça de Porte, o teto ±6 dos modificadores,
Investida, Bloqueio e Defesa da arma e escudo, o modo secundário de dano,
sangramento por rodada e projétil rápido. Essas exigem implementar a regra antes de
aplicá-la.

**O que a lista vale em gestos**, e é o que dá para afirmar sem medir frequência:

- **doze das quinze aterrissam num campo** da folha. Três não pedem digitação
  nenhuma: o alcance no corpo a corpo é aviso, o teto ±6 teria de ser conferido de
  cabeça, e o projétil rápido não tem onde ser escrito;
- cada aplicação à mão custa **ao menos dois gestos** (achar o campo e digitar), pelo
  mesmo critério que contou o arrasto e o menu. Duas delas pedem dois campos
  (Investida e o modo secundário) e uma pede uma ação à parte (sangramento);
- **um lance em que uma só dessas correções se aplica custa 5 gestos e não 3**, o que
  é dois terços a mais na parada mais cara da cena;
- **e a bateria não conta nenhum deles.** Os 1.171.957 gestos medidos assumem que
  nada disso acontece, porque o robô nunca aplica correção situacional. **O número
  publicado é piso**, e a lista da §C2 é o tamanho do que falta nele. Quantas vezes
  cada uma se aplica numa cena de verdade não está medido, e não é bateria que mede:
  é mesa.

### Os 21 campos da folha, pela linha

A folha tem 21 campos editáveis, todos nascendo **preenchidos** pelo cálculo da
régua, e a edição é **efêmera por padrão**: fixar o valor até o fim do combate é um
segundo gesto deliberado, uma caixinha. Editar um deles é o mestre dizendo "neste
lance este número é outro".

**Quatro são custo**, e são exatamente onde as correções da §C2 aterrissam:

| # | campo | o que se aplica à mão ali |
|---|---|---|
| 12 | Defesa (base) do alvo | a Defesa −4 da Corrida, e o Bloqueio ou Defesa da arma e escudo |
| 14 · 15 · 16 | Absorção · impacto, corte, perfuração | a Couraça de Porte |

**Os outros dezessete não são.** O campo 1 é escolher a arma, que está do lado do
jogo. Os campos 2 a 6 são o tempo da ação, que é a mesma família de escolher a
manobra. Os campos 7 e 8, o bolo de acerto e o dano, parecem candidatos e não são:
toda correção da §C2 que os afeta é digitada nos campos de ajuste e de dano, e não
neles. O campo 21, Pressão sofrida, o Grid calcula **e aplica**. Os seis campos de
passo, a Defesa Mental e a Resistência a perfuração não recebem correção nenhuma.
Mexer em qualquer um dos dezessete é o mestre julgando uma situação que a regra não
modela, e isso nenhuma automação tira, porque nenhuma automação adivinha um
julgamento.

**O alvo real da folha não é a folha inteira nem os 21**: são quatro deles, mais os
**quatro campos que abrem em branco** e não estão entre os 21, que são a digitação de
verdade.

## 3 · O QUE AS RODADAS 02, 03 E 04 ACRESCENTARAM A ESSA FILA

**Nada.**

A fila da seção 2 é hoje exatamente a que a `09` publicou antes das três rodadas.
Nenhum item entrou, nenhum saiu, nenhum mudou de tamanho.

> **A fila mudou depois, e não foi rodada que a mudou.** Foi a linha entre custo e
> jogo, escrita pelo humano e não medida por ninguém: ela renomeou o item 1,
> reescreveu o item 3, acrescentou o item 4 e derrubou a leitura de que os 61,8%
> eram um limite. **Uma frase de definição mexeu na fila mais que três rodadas de
> medição**, e isso não é acusação a elas: as rodadas mediram bem o que lhes foi
> pedido, e o que estava errado era a pergunta.

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

**E uma coisa mudou a fila depois, sem rodada nenhuma:** a linha entre custo e jogo.
Ela renomeou um item, reescreveu outro, acrescentou um terceiro e derrubou a leitura
de que 61,8% era teto. **Definir o que se está medindo mexeu mais na fila que medir**,
e a lição para a próxima frente é essa: a pergunta vem antes do instrumento.
