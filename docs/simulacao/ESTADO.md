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

## O QUE ESTA FRENTE MEDIU, E O QUE ELA NÃO MEDIU

**Ela mediu o mestre ARBITRANDO, e não o mestre JOGANDO.** É o achado que muda o
significado de todo o resto, e ele não é ressalva de rodapé.

Nas 21.600 batalhas os dois lados são robôs. Por isso **declarar custou zero
gesto**: ninguém escolhe ação, alvo, manobra nem modo de deslocamento, porque a
política decide sozinha dentro do avanço. Tudo o que sobrou na tela do mestre foi
transcrição, e é por isso que a linha entre custo e jogo encontrou **100% de custo**.

**Numa mesa de verdade o mestre joga os inimigos**, e as declarações de um lado
inteiro são dele:

| o mestre em cena | decisões dele por batalha | Ticks entre duas decisões |
|---|---:|---:|
| **só arbitra** (o que esta frente mediu) | **0,3** | **125,2** |
| **joga um lado** (a mesa normal) | **12,8 a 14,3** | **2,7 a 3,0** |

Uma batalha tem 39,1 Ticks. Três consequências, e as três são leitura e não medição:

- **o trabalho medido aqui é o de arbitrar.** O de jogar não foi medido, e não é o
  mesmo trabalho;
- **os sete degraus tiram transcrição e não tiram decisão nenhuma.** Nenhum deles
  toca `declarar`, `fugir` ou `redirecionar`, que são as três paradas de escolha;
- **a preocupação de que o mestre vire espectador estava errada pelo mesmo motivo
  que o resto desta frente esteve errado: o denominador não tinha o lado que ele
  joga.** Ele decide a cada 2,7 Ticks, catorze vezes por batalha.

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
mestre nesta configuração, porque não há jogo nenhum dentro dele. Os 61,8% nunca
foram um limite de princípio: eram o limite dos três degraus que estavam desenhados.
O que sobra depois deles, o ⏭ que para e o botão do veredito, é custo como o resto.

**Cem por cento é o limite de princípio; o limite dos consertos desenhados até hoje
é 99,7%**, e a seção 2 mostra a conta. O que separa os dois é o gesto nas paradas
que pedem uma escolha humana de verdade, que são 4% delas.

> **A ressalva, e ela é grande.** Isto vale para o mestre e para esta bateria, que
> não tem peça de jogador. Numa mesa com gente, parte do ⏭ passa a abrir declaração,
> que é decisão, e vira jogo. **Quanto, não está medido**, e não se mede com bateria:
> depende de quantas peças são de jogador.

### A escada dos três degraus desenhados, e os 61,8% que ela alcança

| | trabalho | do de hoje | o que sai |
|---|---:|---:|---|
| hoje, modo `mesa` | 1.171.957 | 100% | · |
| + a mesa deixa de digitar os totais | 773.481 | 66,0% | os dois números digitados por golpe (`R:184`) |
| + avanço unificado | 573.255 | 48,9% | o ⏭ do Tick morto, e um cartão por parada (`R:185`) |
| + a folha deixa de pedir transcrição | **448.224** | **38,2%** | o resto da aritmética (`R:186`) |

Os 61,8% estão em `R:188`.

> **Os 61,8% são o alcance DESTES TRÊS DEGRAUS, e não um limite de princípio.** A
> leitura anterior dizia que o resíduo "não tem conserto de software", e a linha
> desmente: o resíduo de 448.224 é 55% de ⏭ que param e 45% do botão do veredito
> (`R:187`), e **os dois são custo**. O ⏭ que para abre uma folha que é transcrição;
> o botão transcreve uma comparação que a tela já fez. O que os mantém de fora é
> nenhum dos três degraus tê-los atacado, e não a natureza deles.

**O que sobra cresce com o TAMANHO da cena, não com a complexidade da regra**, o que
quer dizer que nenhuma simplificação de regra o reduz. Isso continua valendo, e é
uma afirmação sobre a forma do resíduo, não sobre ele ser irredutível.

### O avanço automático, medido sozinho

Se o ⏭ pulasse os Ticks em que não há nada a fazer, ele tiraria de **10,8% a 17,9%**
do trabalho do mestre no modo `mesa` (`R:193`), e de **16,3% a 27,2%** no modo
`site` (`R:202`). O piso conta só os Ticks em que nada parou **e** nada andou; o
teto conta todo Tick sem parada, inclusive aqueles em que as peças andaram e o
mestre talvez quisesse ver.

Com jogador declarando à mão, a fração cai, mas **por crescimento do denominador e
não por o mestre trabalhar menos**: numa mesa em que os jogadores declaram um lado e
o robô declara o outro, fica entre 8,8% e 9,0% com dois gestos por declaração, e
entre 7,4% e 7,7% com quatro (`R:191` a `R:201`).

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

| dos 34,0% que o modo `site` valia | gestos | o que é | procedência |
|---|---:|---|---|
| rolar o dado | **0** | jogo, e nunca esteve na conta | `custo-tela.mjs`: dado na mão não é gesto de tela |
| digitar os dois totais | **398.476** | custo puro | **derivado**: 597.714 − 199.238 (`R:166`), com a repartição dos 3 gestos de `resolver` vinda de `custo-tela.mjs` |

**Os 34,0% eram transcrição, inteiros.** A decisão de manter o dado na mão do
jogador não custa um ponto sequer: o que tem de sair é a mesa ter de somar o que
rolou e digitar o total, com o dado continuando a ser rolado na mão.

### O botão do veredito é derivável sempre, e por isso sai inteiro

O botão que fecha a folha ("Acertou · aplicar", "Raspou · aplicar", "Errou") vale
199.238 gestos, **17,0%** do trabalho do mestre. Ele é custo, e a conferência é de
código e não de frequência:

- **a tela já calcula o veredito**, com `saidaDoAtaque(total, defesa, margem)`, uma
  **função pura de três números** que estão todos na folha (`src/lib/quase-acerto.ts`);
- **o Grid já guarda os dois separados**, a conta da régua e o botão do mestre, e o
  comentário do código diz por quê: "permite medir depois quantas vezes a mesa
  contrariou a régua";
- para o mestre, os três números estão sempre preenchidos. **Não há lance em que o
  veredito não seja derivável.**

**Mas "sai inteiro" não se sustenta, e a revisão da rodada 05 derrubou as duas
afirmações que o sustentavam.** As duas eram minhas e as duas estavam erradas:

| o que eu escrevi | o que o código diz |
|---|---|
| "o Grid já guarda os dois separados, a conta da régua e o botão do mestre" | guarda **só com a bancada ligada**: `registrarLance` começa com `if (!LANCES_LIGADO) return;`, e `LANCES_LIGADO` é o parâmetro `?lances=1`, desligado por padrão. O destino é `window.__LANCES`, memória da página, e o único consumidor é `coletar-lances.mjs`. Não há coluna nem migração no Supabase. **Numa mesa de verdade os dois campos não coexistem em lugar nenhum, e a página descarta tudo ao fechar** |
| "não há lance em que o veredito não seja derivável" | há **três caminhos que devolvem `null`**: `lance.ts:143` (`if (alvo.defesaBase == null) return null`), `grid.astro:8491` (o ternário exige `soma != null && def2 != null`) e `grid.astro:8393` (`defesaBase: r?.defesa ?? null`) |

**O item passa a valer entre 0% e 17,0%**, e a banda não é de imprecisão, é de
ignorância: o valor depende da taxa em que a mesa aperta um botão diferente do que a
régua calculou, e **esse número não existe em lugar nenhum**. Se a mesa contrariar a
régua com frequência, o botão é decisão e o item vale zero.

**A fração que sai da banda por outro motivo, e ela não é medível aqui.** Quando
`defesaBase` é nula, o botão automático **não tem o que confirmar**: `saidaDoAtaque`
não é chamada, o veredito sai `null`, e aqueles lances continuam pedindo o mestre.
Nesta bateria a fração é **zero**, porque toda peça vem de arquétipo resolvido pela
régua e o resumo sempre traz `defesa`. **Isso não mede a mesa**: lá a Defesa falta
quando a peça não tem ficha resolvida, e com que frequência isso acontece depende de
como as mesas montam encontro. Não é medível com bateria.

### As duas leituras do item 2, e a reconciliação

**Eu respondi à objeção por outro caminho, e o caminho é bom, mas responde outra
pergunta.** Ele está aqui inteiro, porque objeção respondida por outro caminho tem de
mostrar os dois:

- **o caminho dela:** os 17,0% valem se o botão for transcrição, e a única evidência
  que separa transcrição de julgamento é a taxa em que a mesa contraria a régua. Essa
  taxa não existe. Logo a conferência do item caiu;
- **o meu:** a tela não calcula o veredito a partir dos números da régua. Ela o
  calcula a partir do **campo de ajuste que o mestre digita** e da **Defesa que o
  mestre corrige** (`contaDoLance`). Então o veredito de hoje já sai dos números
  corrigidos à mão, e automatizar o botão não o torna mais errado do que é hoje;
- **a reconciliação, e ela é a favor dela:** o meu argumento cobre as **ENTRADAS** do
  botão, e não a **SAÍDA** dele. Ele mostra que a tela não vai confirmar uma conta
  pior do que a que o mestre confirmaria com os mesmos campos. **Não mostra que o
  mestre nunca aperta um botão contrário à conta**, e é exatamente isso que a taxa
  mediria. Um mestre que decide "errou" onde a aritmética diz "acerto" está julgando,
  e automatizar tira esse julgamento dele.

**Então a objeção dela fica de pé, e a banda de 0 a 17,0% é a leitura correta.** O
que o meu argumento derrubou foi só o bloqueio: as duas contas do item 4 não impedem
o item 2, porque a correção delas acontece acima do botão, em campos que ficam.

**O julgamento que resta mora acima do botão**, no campo de ajuste e nos quatro
campos da ficha do lance. Esses ficam, e é isso que a folha continua pedindo.

**A condição, e ela liga tudo:** o veredito só é confiável se os números de cima
estiverem certos, e hoje eles não estão sempre, porque o Grid calcula coisas que não
aplica. **Enquanto o conserto abaixo não for feito, o botão não pode virar
confirmação automática**, senão a tela passa a confirmar sozinha uma conta que ela
mesma sabe estar incompleta.

### O conserto conjunto: as contas não aplicadas e os quatro campos

**São o mesmo conserto, e é por isso que viram um item só.** Os quatro campos
custosos da folha (Defesa base do alvo e as três Absorções) não têm defeito próprio:
eles são o lugar onde o mestre digita, à mão, correções que o Grid já sabe fazer.
Aplicar as contas esvazia os campos.

**A ordem tem duas metades, e elas não valem a mesma coisa.**

**Primeira metade · as seis que o Grid já exibe.** Já estão calculadas na tela; falta
aplicá-las. Não precisam de regra nova:

| a conta | onde o mestre digita hoje |
|---|---|
| contrapé da iniciativa | o campo de ajuste |
| faixa de distância, no tiro e no arremesso | o campo de ajuste |
| gate de Perfuração | o campo de dano |
| a Defesa −4 da Corrida | **Defesa base do alvo**, ou uma condição na peça |
| penalidade de manobra (rajada, dupla) | o campo do total, e só quando a mesa rola |
| alcance no corpo a corpo | nada: é aviso, e não pede digitação |

**Segunda metade · as nove que o Grid nem exibe.** Exigem implementar a regra antes
de aplicá-la: margem de dano, Porte no acerto, Couraça de Porte, o teto ±6 dos
modificadores, Investida, Bloqueio e Defesa da arma e escudo, o modo secundário de
dano, sangramento por rodada e projétil rápido.

**E aqui há uma correção à premissa de que a primeira metade liberta os quatro
campos: ela liberta um só, e pela metade.** Das seis exibidas, **apenas a Corrida
−4 aterrissa num dos quatro campos**; as outras cinco caem nos campos em branco
(ajuste, dano, total). A Defesa base tem duas fontes, e a segunda (Bloqueio e Defesa
da arma) está na metade cara. As três Absorções são libertadas só pela Couraça de
Porte, que também está na metade cara.

| metade | o que ela custa | o que ela liberta |
|---|---|---|
| **as seis exibidas** | nada de regra: só ligar a aplicação | os três campos em branco, na maior parte dos casos, e metade da Defesa base |
| **as nove não exibidas** | implementar cada regra | **os quatro campos custosos**, e o resto dos campos em branco |

**Quanto vale, em gestos:** cada aplicação à mão custa ao menos dois gestos, e um
lance em que uma só correção se aplica custa **5 gestos em vez de 3**. Com que
frequência cada uma se aplica **não está medido, e não é bateria que mede**: o robô
da bateria nunca aplica correção situacional, então os 1.171.957 medidos assumem que
nada disso acontece. **O número publicado é piso, e esta lista é o tamanho do que
falta nele.**

### O piso do item 4, e por que a bateria não consegue medi-lo

**Das quinze contas não aplicadas, sete não são custo hoje, e o motivo estava
escrito no `regras.json` o tempo todo.** Elas são bandeiras de regra, e **as quinze
nascem desligadas**. A nota do próprio arquivo diz por quê: *"nenhuma está ligada no
motor (a margem não entra no dano, o gate não é chamado, o bloqueio não existe)"*.
Uma regra desligada não é uma conta que o mestre aplica à mão: é uma regra que a
mesa não joga. **O mestre não paga por ela, e ligá-la é decisão de regra, não
conserto de custo.**

São elas: margem de dano, gate de Perfuração, Porte no acerto, Bloqueio e Defesa da
arma e escudo, modo secundário de dano, teto ±6 dos modificadores, e sangramento por
rodada.

**E uma oitava sai por outro motivo: a Couraça de Porte já é aplicada**, em tempo de
geração do bestiário, e vem somada na Absorção de cada criatura. A linha da §C2 que
diz que ela não é aplicada está errada, e a nota do `regras.json` explica que uma
bandeira de tempo de execução a somaria duas vezes.

**Sobram sete, e é isso que o item 4 é:** contrapé da iniciativa, faixa de distância
no tiro e no arremesso, alcance no corpo a corpo, a Defesa −4 da Corrida, penalidade
de manobra, Investida e projétil rápido. Duas delas não pedem digitação nenhuma (o
alcance no corpo a corpo é aviso; o projétil rápido não tem onde ser escrito).

**Quantas vezes cada uma DEVERIA ter se aplicado, nas 9.600 batalhas da população
publicada:**

| a conta | ocasiões | por quê |
|---|---:|---|
| faixa de distância (tiro e arremesso) | **0** | o elenco tem duas armas de corpo a corpo, e nenhuma à distância (D25) |
| projétil rápido | **0** | mesmo motivo |
| penalidade de manobra | **0** | a política declara sempre `simples`, nas 247.065 declarações |
| Investida | **0** | mesmo motivo, e ela é escolha e não regra automática |
| alcance no corpo a corpo | **0 gestos** | é aviso na tela, e não pede digitação |
| **a Defesa −4 da Corrida** | **não derivável** | o log registra QUE a peça andou (`log.andou`), e não em que modo. Contar isto exige um campo novo no log, e portanto a bateria inteira de novo |
| **o contrapé da iniciativa** | **não derivável** | depende de um estado da fila que o log não guarda por Tick |

**O piso do item 4, medido nesta bateria, é ZERO, e isso não quer dizer que ele não
custe.** Quer dizer que **esta bateria não consegue medi-lo**, e o motivo é a
decisão D25 mais a política: dois arquétipos de corpo a corpo, manobra sempre
simples, nenhuma condição, nenhuma arma à distância. **Cinco das sete ocasiões são
estruturalmente zero aqui, e as outras duas não estão no log.**

**As duas metades, então, não são "seis baratas e nove caras". São:**

| | quantas | o que é |
|---|---:|---|
| regras desligadas | 7 | ligar cada uma é decisão de regra (o L25), e não conserto de custo |
| já aplicada em outro lugar | 1 | a Couraça de Porte, no bestiário |
| custo real, sem ocasião nesta bateria | 5 | precisam de elenco ou política que a bateria não tem |
| custo real, sem número no log | 2 | Corrida e contrapé, e os dois pedem campo novo |

**O item 4, então, é isto e nada mais: a Defesa −4 da Corrida e o contrapé da
iniciativa.** Duas contas que o Grid exibe, não aplica, e que nem estão
instrumentadas no log. Todo o resto do que estava debaixo daquele nome ou é o L25
disfarçado (sete bandeiras desligadas) ou já está aplicado noutro lugar (a Couraça
de Porte).

### E não, elas não bloqueiam o item 2

**O argumento do bloqueio caiu quando fui conferi-lo no código.** Ele dizia que
automatizar o botão do veredito faria a folha confirmar sozinha uma conta
incompleta. Isso supõe que a tela calcula o veredito a partir dos números da régua,
e não é o que ela faz: `contaDoLance` monta a soma com **`modManual`, que é o campo
de ajuste que o mestre digita**, e a Defesa com **`defesaBase` lida da ficha do
lance, que é o campo que o mestre corrige**.

**Ou seja: o veredito de hoje já sai dos números corrigidos à mão.** Automatizar o
botão não o torna mais errado, torna-o exatamente tão certo quanto é hoje, porque a
correção acontece **acima** dele, em campos que continuam existindo. O que o botão
faz é transcrever uma comparação, e a comparação usa o que estiver nos campos.

**O bloqueio só valeria se automatizar o botão tirasse do mestre a chance de
corrigir, e não tira.** Com duas contas em vez de quinze, e sendo as duas
corrigíveis em campo que fica, **o item 2 pode andar antes.**

**A ordem muda, e a diferença é grande:** começa-se por um conserto de 34% e outro
de 17%, e não por dois campos que nem estão instrumentados e cuja medição pede
campo novo no log e bateria inteira de novo.

### O que sobra depois de tudo, e o teto de verdade

O resíduo de hoje é o ⏭ que abre uma parada (164.709, 14,1%) e o cartão vencido
(199.238, 17,0%). **Nenhum dos dois é decisão.** E o avanço unificado já abre a folha
do golpe que o fez parar: **o cartão daquele golpe some junto com o clique.**

| | gestos | do de hoje | procedência |
|---|---:|---|---|
| ⏭, um por Tick com golpe | 74.207 | 6,3% | `R:144`, o nível SEM-GESTO |
| cartões que sobram, porque um Tick tem 2,68 golpes e a parada absorve um | 125.031 | 10,7% | `R:175` |
| **piso, com um cartão por golpe** | **199.238** | **17,0%** | `R:123` |
| **piso, se a parada abrir todos os golpes do Tick** | **74.207** | **6,3%** | `R:144` |

### E os 6,3% também não são limite: VER não é CLICAR

**A mesma armadilha dos 61,8%, e quase caí nela.** Escrever que tirar os 74.207 é
tirar o mestre do laço supõe que ele precisa CLICAR para saber o que aconteceu. Não
precisa: se o avanço corre e mostra o que passou no caminho, ele vê sem clicar. **O
clique só é necessário onde a mesa precisa que ele CONFIRME, não onde precisa que ele
SAIBA.**

Nas 9.600 batalhas, das paradas que exigem uma escolha humana existe **uma só**: o
redirecionamento do golpe cujo alvo já caiu, que numa mesa com peça de jogador abre
caixa de escolha (está na lista ⚑ do manifesto, como custo que esta bateria não
enxerga).

| | ocasiões | dos 74.207 | procedência |
|---|---:|---|---|
| paradas que pedem escolha humana (redirecionamento) | **2.995** | **4,0%** | `R:126` |
| paradas em que o mestre só precisa VER | **71.212** | **96,0%** | **derivado**: 74.207 (`R:144`) − 2.995 (`R:126`) |

**Então há um degrau 7, e ele é o maior de todos.** Se o avanço mostra o percurso em
vez de pedir confirmação a cada parada, o trabalho cai de 74.207 para a ordem de
**2.995 gestos, 0,3% do de hoje**, e o teto do projeto vai a **99,7%**.

**O que impede de escrever 99,7% como número final**, e é ressalva e não recuo: um
mestre que nunca clica não é necessariamente um mestre que está vendo, e **com que
frequência ele vai querer interromper de propósito não se mede com bateria** · é a
mesma pergunta do L26 e é de mesa. O que está medido é o piso **mecânico**: quatro
por cento das paradas exigem uma escolha, e noventa e seis por cento não exigem
nada além de olhar.

### A fila

> **Dos sete itens, UM está inteiramente medido** (o 1, 34,0%, `R:170`). O **2**
> depende de um número que hoje não é medível fora de mesa real; o **3** tem 7,7 dos
> seus 32,0 pontos apoiados numa definição que o agregado passou a medir só agora
> (`R:144`); o **4** declara-se não medido; o **7** sai de uma contagem de paradas e
> não de gestos. **Isto decide por onde começar, e não o tamanho dos itens.**

| # | o conserto | o que tira | procedência | está no Grid? |
|---|---|---:|---|---|
| 1 | **a folha aceita o dado em vez do total**: a mesa rola na mão e a tela deixa de pedir a soma digitada | **34,0%** · 398.476 | `R:170` para os 34,0%; o gesto é **derivado**: 597.714 − 199.238 (`R:166`), com a repartição dos 3 gestos de `resolver` em 1 de abrir e 2 de digitar vinda de `custo-tela.mjs` | **não** |
| 2 | **o botão do veredito vira confirmação** | **0 a 17,0%** · até 199.238 | `R:123` para os 199.238. A banda **não tem procedência**, e é esse o ponto: ela é ignorância, não imprecisão | **não** |
| 3 | **o avanço unificado**: o ⏭ corre até a parada que precisa do mestre e abre a folha do golpe que o fez parar | **32,0%** · 375.005 vira 74.207 | `R:129` para os 375.005 e **`R:144` para os 74.207**, que é o nível SEM-GESTO, medido no agregador desde esta rodada | **não** |
| 4 | **a Defesa −4 da Corrida e o contrapé da iniciativa** | sem número | **nenhuma**: sem ocasião nesta bateria e sem instrumento no log | **não** |
| 5 | **a parada abre todos os golpes do Tick**, e não só um | **10,7%** · 125.031 | `R:175` | **não** |
| 6 | **o L25**: as quinze bandeiras lidas pelo motor | **zero** para o mestre | · | **não** |
| 7 | **o avanço MOSTRA o percurso em vez de pedir confirmação**: ver não é clicar | **6,0%** · 71.212 dos 74.207 | `R:144` e `R:126`, e é **derivado**: 74.207 − 2.995 | **não** |

**A ordem não é a numeração, e o primeiro da fila não é o maior.**

| ordem | item | por quê aí |
|---|---|---|
| 1º | **4** · as duas contas exibidas e não aplicadas | é piso de tudo o que está publicado: enquanto elas existirem, o total de `R:169` assume zero correção à mão |
| 2º | **gravar o par (veredito da régua, botão do mestre)** em caminho de produção | a coisa mais barata da fila, e a única que transforma a banda de 0 a 17,0% num número. Uma coluna e uma escrita, fora do `?lances=1` |
| 3º | **1** (34,0%) e **3** (32,0%) | os dois maiores, os únicos com procedência de agregado, e independentes entre si |
| 4º | **5** (10,7%) | refinamento do 3 |
| 5º | **2** (0 a 17,0%) | só depois de o número existir. Antes disso, fazê-lo é apostar dezessete pontos numa premissa refutada |
| 6º | **6** · o L25 | zero para o mestre, e destrava a segunda bateria |
| · | **7** | é ESCALA: decidir se o mestre precisa confirmar cada Tick em que algo acontece é decisão de jogo |

**O item 4 não bloqueia o item 2**, e o argumento está na seção do botão: a correção
das duas contas acontece **acima** do botão, em campos que ficam. Ele vem primeiro
por ser piso do que já está publicado, e não por bloqueio.

Todas as linhas abaixo são **derivadas por subtração** do total de `R:169`, com o
tamanho de cada item vindo da tabela da fila:

| até onde se vai | trabalho do mestre | teto | a subtração |
|---|---:|---:|---|
| hoje | 1.171.957 | · | `R:169` |
| itens 1 e 3 | 398.476 | 66,0% | − 398.476 − 375.005 |
| + item 5 | 273.445 | 76,7% | − 125.031 |
| + item 2, se a banda fechar em 17,0% | 74.207 | 93,7% | − 199.238 |
| + item 7 | ~2.995 | **99,7%** | − 71.212 · o que sobra são os redirecionamentos, `R:126` |

**Os 93,7% e os 99,7% dependem do item 2 valer 17,0%, e ele vale entre 0 e 17,0%.**
Com o item 2 em zero, a escada para em **76,7%**. É a diferença entre um número e
uma banda, e ela é grande.

**O teto do projeto não é 61,8%.** Cada vez que alguém escreveu um teto nesta
frente, ele era o alcance dos consertos que estavam desenhados naquele dia, e a
frase que o acompanhava dizia "natureza". Três vezes. **Estes também são o alcance
dos consertos desenhados até hoje**, e a pergunta do que tiraria o resíduo está
respondida no item 7.

### O que sobra para o mestre FAZER, e não é conclusão, é material

**Isto não decide nada.** É o levantamento para a pergunta que só o humano responde:
depois dos sete degraus, o mestre ainda joga ou virou espectador de uma simulação?
Tudo abaixo sai do log que já existe, sem bateria nova.

**Os momentos de DECISÃO que o motor tem.** Das sete paradas que o Tick produz, três
são escolha e quatro não são:

| parada | classe | é decisão? |
|---|---|---|
| **declarar** | i | **sim**: a ação, o alvo, a manobra, o modo de deslocamento |
| **fugir** | ii | **sim**: a peça decide sair da cena |
| **redirecionar** | i | **sim**: para onde vai o golpe cujo alvo já caiu |
| agenda | iii | não: sai calculada da declaração |
| reprojetar | iii | não: o motor recalcula dentro do avanço |
| resolver | iii | não: é a folha, e a folha é transcrição |
| aplicar | ii | não: transcreve uma comparação que a tela já fez |

**Não há um quarto tipo de decisão no motor.** O que existe fora dessa lista é o
mestre querer interromper por vontade própria, para narrar ou arbitrar, e isso não é
parada nenhuma: não está instrumentado e não se mede assim.

**Quantas, nas 9.600 batalhas da população publicada:**

| | ocasiões | por batalha | procedência |
|---|---:|---:|---|
| declarar | 247.065 | 25,7 | `R:124` |
| fugir | 7.570 | 0,8 | `R:125` |
| redirecionar | 2.995 | 0,3 | `R:126` |

**E aqui está a virada, e ela desfaz o "espectador".** Todo o cálculo desta frente
foi feito com **dois robôs**, e por isso `declarar` custou zero gesto. Numa mesa de
verdade o mestre **joga os inimigos**: as declarações de um lado inteiro passam a ser
dele. A repartição está medida:

Todas as linhas são **derivadas**: a repartição das declarações por lado sai de
`R:191`, e a soma junta a metade das fugas (`R:125`) e os redirecionamentos (`R:126`).

| quem o mestre joga | decisões dele | por batalha | a soma |
|---|---:|---:|---|
| ninguém, só arbitra | 2.995 | 0,3 | só os redirecionamentos |
| o lado `a` (116.293 declarações) | 123.073 | 12,8 | **derivado**: 116.293 + 3.785 + 2.995 |
| **o lado `b` (130.772 declarações)** | **137.552** | **14,3** | **derivado**: 130.772 + 3.785 + 2.995 |

**A distância média entre duas decisões do mestre, depois dos sete degraus:**

| | Ticks entre decisões |
|---|---:|
| mestre sem peça em cena | **125,2** |
| mestre jogando um lado | **2,7 a 3,0** |

Uma batalha da população tem **39,1 Ticks** em média.

**A leitura, e ela é a resposta ao "vira espectador":** o mestre sem peça nenhuma em
cena decide **uma vez a cada três batalhas inteiras**, e isso é assistir. O mestre
que joga os inimigos, que é o caso normal, decide **a cada 2,7 Ticks**, catorze vezes
por batalha, e isso é jogar. **Os sete degraus não tiram nada do lado que decide:**
eles tiram a transcrição, e a transcrição estava misturada com a decisão na mesma
tela.

**O que este número NÃO diz**, e é a mesma ressalva de sempre: numa cena real o
número de peças de cada lado não é metade da cena, e a frequência com que um mestre
quer interromper de propósito não é parada nenhuma no motor. As duas puxam para
lados opostos e nenhuma está medida.

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
| o trabalho do mestre | 1.095.869 | 1.171.957 | antes: `09-bmtlxp622.txt`; depois: `R:169` |
| a economia do avanço, modo `mesa` | 11,4% a 20,0% | 10,8% a 17,9% |
| **o fim da escada** | **38,2%** | **38,2%** |
| **o teto dos três degraus então desenhados** | **61,8%** | **61,8%** |

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
