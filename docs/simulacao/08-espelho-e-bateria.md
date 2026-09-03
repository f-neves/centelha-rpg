# 08 · O espelho de motor, e a bateria que passou a valer

**03/09/2026.** Este documento fecha o que a `07-caminho-curto.md` deixou aberto: o laço do
harness foi comparado com o laço da mesa, Tick a Tick, e a bateria foi refeita em cima do laço
corrigido. Enquanto o espelho não passava, nada da tabela da `07` §10.3 podia sair do documento.
**Agora pode**, e a primeira coisa que sai é que boa parte daquela tabela estava errada.

> **A ordem de leitura:** a §1 é o que o espelho achou, a §2 é a leitura corrigida (a partição, o
> custo de tela e a banda), a §3 é a bateria nova, a §4 são as decisões D16 a D28, a §5 é o que
> continua ⚑ e a §6 é o que ela continua **não** dizendo.

---

## 1 · O espelho de motor

`npm run espelho` (e dentro do `npm run smoke`). **Cinco cenas, duas sementes cada, dez execuções,
zero divergências**, repetíveis: a mesma cena com a mesma semente dá a mesma batalha nos dois lados.

### 1.1 Como ele funciona

A mesma célula dos dois lados, com a mesma semente:

- a **mesa** roda em `/mesa/grid` com o Supabase de mentira montando a cena da célula
  (`?cena=espelho&arqa=&arqb=&n=&dist=`), o dado semeado (`?semente=`), o retrato por Tick
  (`?despejo=1`), o registro de lances (`?lances=1`) e o gancho do driver (`?espelho=1`);
- o **harness** roda a mesma célula por `scripts/sim/espelho.mjs`;
- a comparação é a da `03-respostas.md` §1.1.1, sem tolerância: agenda, fase, Defesa perdida,
  posição, re-projeção, fila, e o lance inteiro (entradas, saídas e os dados que caíram).

**As peças saem da mesma linha de código dos dois lados** (`scripts/sim/elenco.mjs`, com a régua
entrando por parâmetro para o mesmo arquivo rodar no Node e no navegador). Comparar duas cenas
montadas de dois lugares não prova nada sobre o laço: prova que foram montadas duas cenas.

**O driver não decide nada.** Ele clica no botão que a régua já marcou como principal (a classe
`.primary`, posta por `pintarVeredito`) e avança o relógio. Se ele escolhesse o veredito, o teste
compararia o harness com o driver.

### 1.2 O que ele achou

Seis divergências, **todas dentro dos 6.000 combates da bateria anterior**, nenhuma capaz de
levantar suspeita por si (o laço não falha em vermelho: falha produzindo número plausível).

| # | O que estava errado no laço | Consequência na bateria anterior |
|---|---|---|
| E1 | **a ordem do Tick estava trocada.** A mesa anda primeiro e declara depois; o laço declarava antes de andar | quem declarava com trajeto andava no mesmo Tick, e não no seguinte |
| E2 | **a decisão vale um Tick depois** (`decideEmValeDepois`), e o laço não esperava | toda perseguição chegava um Tick cedo, em toda célula de distância |
| E3 | **o passo da declaração automática é o de batalha**, e não o de corrida | o harness corria para atacar: travessia mais rápida, menos re-projeção, menos Tick vazio |
| E4 | **a Defesa de quem ainda não declarou é PRESUMIDA** (`faseDeQuemVaiAgir`), e não "livre" | o laço dava guarda cheia a quem estava prestes a golpear: todo golpe contra alvo livre saía com Defesa alta demais |
| E5 | **o dado do dano sai mesmo quando o golpe erra**, porque a folha rola os dois na abertura | com fonte semeada, um erro bastava para as duas sequências de acaso se separarem |
| E6 | **o golpe que cai em quem já caiu SE RESOLVE**: abre folha, rola, cobra Pressão | o laço pulava esses golpes, e a bateria **não contava as paradas que eles custam**, que é o que ela mede |

E mais uma, que não é do laço e sim da fila: **o desempate da ordem é o carimbo do token**
(`movido_em`), que é reescrito toda vez que a peça anda. Numa perseguição a fila inteira se
reordena a cada avanço. O laço ordenava pela chegada original.

### 1.3 O achado de produção, e o conserto

**`folhaDaAcao` resolvia `null` quando o `close` de uma folha anterior chegava com a seguinte já
aberta.** `dlg.close()` não dispara o evento na hora: ele é enfileirado. Quando duas folhas se
sucedem dentro do mesmo ciclo, o `close` da primeira chega com a segunda já aberta e com o ouvinte
dela registrado, e a segunda se resolvia como `null` sem ninguém ter fechado nada. Quem chamou lia
isso como "o mestre desistiu": o golpe **ficava no ar** e o cartão vencido reabria no clique
seguinte, com dados novos.

Uma mão humana quase não produz essa sequência (entre fechar e abrir há um clique, e um clique é
outro ciclo). O espelho produz. Foi assim que apareceu: a mesma cena, com a mesma semente, resolvia
o mesmo golpe **até dez vezes numa volta e uma na seguinte**, e a divergência mudava de cena a cada
execução. O conserto é uma pergunta: num fechamento de verdade a caixa está fechada; num fechamento
alheio ela está aberta, porque é a minha. Aí o ouvinte se registra de novo e espera o dele.

**Custo de não ter consertado:** um golpe resolvido duas vezes tira Vida duas vezes e cobra Pressão
duas vezes. Numa mesa, isso é um golpe fantasma.

### 1.4 O que o espelho NÃO prova

- **o filtro de elegibilidade do robô.** A mesa só roda sozinha as criaturas; o espelho estende isso
  a qualquer peça em modo automático (`?espelho=1`), porque sem os dois lados declarando não há
  colisão de agenda para comparar. A decisão e a declaração continuam sendo as da mesa (D16);
- **o fim da cena.** O harness tem três motivos de fim (D4) e a mesa não tem nenhum: lá quem decide
  que acabou é o mestre. O espelho roda com o fim desligado dos dois lados;
- **a mão do mestre.** Modificador escrito, Defesa corrigida na ficha do lance, abortar o gesto,
  botão contrariando a régua: nada disso entra;
- **a Arte, o projétil e a criatura de bestiário.** O elenco é de dois arquétipos corpo a corpo.

---

## 2 · A leitura, corrigida

### 2.1 As duas colunas não eram uma partição

**Um Tick tem dois eixos independentes** (o mestre foi consultado? alguma coisa caiu?) e portanto
**quatro estados**, não dois:

| | nada caiu | caiu alguma coisa |
|---|---|---|
| **ninguém consultado** | `nada` | `só resolveu` |
| **alguém consultado** | `só parou` | `ambos` |

`ticksSemParada` é a **linha** de cima e `ticksSemResolucao` é a **coluna** da esquerda: elas se
cruzam em `nada` e **nenhuma das duas cobre `ambos`**. Somá-las conta o Tick vazio duas vezes e o
Tick cheio nenhuma. As quatro células são publicadas agora, e o invariante V6 cobra que elas somem
os Ticks da batalha.

**A célula `só resolveu` existe e não é desprezível**: 9% a 11% dos Ticks nas cenas de perseguição.
É o Tick em que alguém chegou ao alcance ou caiu no chão sem consultar ninguém.

### 2.2 "A automação compra mais no Tick sem resolução" era inferência. Agora é medição

O Tick cujas paradas são **todas de classe iii** deixa de consultar alguém quando o motor resolver a
classe iii. Somado aos Ticks que já não consultam ninguém, é o teto de cliques que a automação tira,
e sai do log, não da tabela.

O número está na §3.2. **Ele é quase zero em dez das doze células**, e 0,71 numa só. A frase que
estava no relatório anterior não sobrevive na forma geral em que foi escrita.

### 2.3 A banda, com a varredura completa

O critério é **"um humano pode responder diferente do motor?"**, e não "rola dado?" (que era o
critério antigo e estava errado, D12). Os três subtipos carimbados iii:

| subtipo | a mesa oferece escolha aqui? | carimbo |
|---|---|---|
| `resolver` | não. Dada a folha, o veredito sai de `saidaDoAtaque` e o dano da expressão. O mestre corrige os NÚMEROS na ficha do lance, mas corrigir é a outra parada (`aplicar`), e essa já é ii | **forçada** |
| `agenda` | **sim**: manobra, quantos golpes, modo de deslocamento, metros por Tick, e o P/G/R fixado à mão. O robô pega o padrão; um humano pega outro | **duvidosa** |
| `reprojetar` | **sim**: a R2 §B registra o mestre reordenando a fila à mão, e a mesa ainda oferece abortar o gesto | **duvidosa** |

O teto conta as três como iii; **o piso conta só `resolver`**. A banda anterior só duvidava da
re-projeção, e por isso saía estreita demais.

### 2.4 O custo de tela deixou de ser um gesto por parada

`scripts/sim/custo-tela.mjs`, com a derivação lida no código da mesa:

| parada | gestos (rolagem `mesa`, o padrão) | por quê |
|---|---:|---|
| `declarar`, `fugir`, `agenda` | **0** | no automático o robô decide dentro do avanço, sem tela |
| `reprojetar` | **0** | acontece dentro de `avancarTickSimultaneo`: não abre nada e não pergunta nada |
| `resolver` | **3** | 1 clique no cartão vencido da faixa + 2 números digitados (acerto e dano) |
| `aplicar` | **1** | um dos três botões da folha |
| **o ⏭** | **1 por Tick** | e ele não é parada nenhuma: é o gesto mais frequente da mesa e estava fora da conta |

O contador plano fazia o total parecer proporcional ao número de paradas. **O que o mestre sente é
proporcional ao número de caixas mais o número de Ticks**, e as duas coisas escalam de formas
diferentes.

---

## 3 · A bateria nova

`3.300 batalhas · 0 inválidas · 300 estouraram o teto (as uníssonas)` · 15,7 s · commit `8ba8e7f`.

Doze células (três eixos: 1/3/8 peças por lado, distância 1 ou 42 hexes, ciclo uníssono ou coprimo),
500 voltas por célula, **50 nas uníssonas** (D23).

### 3.1 A carga, por célula (as principais, por etapa)

| célula | par/Tick | p90 | pico | gestos/golpe | s/parada | s/resol | t. morto |
|---|---:|---:|---:|---:|---:|---:|---:|
| uníssono · encostado · 1v1 | 1,14 | 4 | 4 | 7,50 | 0,71 | 0,86 | 2,00 |
| uníssono · encostado · 3×3 | 3,43 | 12 | 12 | 5,17 | 0,71 | 0,86 | 2,00 |
| uníssono · encostado · 2×8 | 9,15 | 32 | 32 | 4,44 | 0,71 | 0,86 | 2,00 |
| uníssono · longa · 1v1 | 1,13 | 4 | 4 | 7,53 | 0,72 | 0,86 | 2,04 |
| uníssono · longa · 3×3 | 3,40 | 12 | 12 | 5,18 | 0,72 | 0,86 | 2,04 |
| uníssono · longa · 2×8 | **11,18** | 27 | 32 | 4,64 | **0,01** | 0,86 | 2,04 |
| coprimo · encostado · 1v1 | 1,17 | 2,22 | 4 | 7,60 | 0,49 | 0,71 | 2,50 |
| coprimo · encostado · 3×3 | 3,49 | 6 | 12 | 5,26 | 0,48 | 0,70 | 2,50 |
| coprimo · encostado · 2×8 | 9,22 | 16 | 32 | 4,48 | 0,48 | 0,70 | 2,50 |
| coprimo · longa · 1v1 | 0,72 | 2 | 4 | **10,01** | 0,68 | 0,80 | 5,35 |
| coprimo · longa · 3×3 | 1,89 | 6 | 12 | 6,52 | 0,70 | 0,72 | 7,52 |
| coprimo · longa · 2×8 | 6,21 | 16,66 | 32 | 5,06 | 0,42 | 0,57 | **6,66** |

### 3.2 O quadro dos quatro estados, e o que a automação esvazia

| célula | nada | só res. | só parou | ambos | s/parada hoje | +só iii | depois |
|---|---:|---:|---:|---:|---:|---:|---:|
| uníssono · encostado · 1v1 | 0,71 | 0,00 | 0,14 | 0,14 | 0,71 | 0,00 | 0,71 |
| uníssono · encostado · 2×8 | 0,71 | 0,00 | 0,14 | 0,14 | 0,71 | 0,00 | 0,71 |
| **uníssono · longa · 2×8** | **0,01** | 0,00 | **0,85** | 0,14 | **0,01** | **0,71** | **0,72** |
| coprimo · encostado · 1v1 | 0,49 | 0,00 | 0,22 | 0,29 | 0,49 | 0,00 | 0,49 |
| coprimo · encostado · 2×8 | 0,48 | 0,00 | 0,22 | 0,30 | 0,48 | 0,00 | 0,48 |
| coprimo · longa · 1v1 | 0,65 | 0,02 | 0,15 | 0,17 | 0,68 | 0,01 | 0,68 |
| coprimo · longa · 3×3 | 0,59 | **0,11** | 0,13 | 0,17 | 0,70 | 0,00 | 0,70 |
| coprimo · longa · 2×8 | 0,32 | 0,09 | 0,25 | 0,34 | 0,42 | **0,15** | 0,57 |

**A leitura, e ela é diferente da anterior.** A automação de classe iii esvazia o Tick em **uma
única célula** (a perseguição de dezesseis peças em uníssono, onde 71 pontos percentuais dos Ticks
têm só aritmética) e em parte numa segunda (a perseguição coprima de dezesseis, 15 pontos). **Nas
outras dez ela não esvazia Tick nenhum**, porque quase todo Tick que consulta alguém consulta
também por decisão ou por julgamento, e esses ficam.

Isso **não** quer dizer que a automação não compre nada: ela tira as paradas (a §3.3), e paradas
custam gestos. Quer dizer que **ela quase não tira CLIQUES DE ⏭**, e o clique do ⏭ é o gesto mais
frequente da mesa. São duas economias diferentes e a tabela anterior misturava as duas.

### 3.3 A composição, por classe

> **Batalhas que TERMINAM (3.000): 20% a 55% das paradas são de classe iii.**
> Batalhas que estouram (300): 21% a 58%. As duas fatias diferem em 3,8 pontos: o número é robusto.

Por célula, o teto (`%iii` com as três duvidosas contadas como aritmética):

| célula | i (decisão) | ii (julgamento) | iii (aritmética) | %iii |
|---|---:|---:|---:|---:|
| coprimo · encostado · 1v1 | 9,7 | 9,4 | 17,9 | 48,5% |
| coprimo · encostado · 3×3 | 25,8 | 24,3 | 44,9 | 47,2% |
| coprimo · encostado · 2×8 | 60,5 | 54,8 | 106,5 | 48,0% |
| coprimo · longa · 1v1 | 8,4 | 8,0 | 15,6 | 48,8% |
| coprimo · longa · 3×3 | 21,0 | 18,4 | 36,1 | 47,8% |
| **coprimo · longa · 2×8** | 58,0 | 51,3 | **200,2** | **64,7%** |
| uníssono (encostado, qualquer tamanho) | — | — | — | 50,0% |
| **uníssono · longa · 2×8** | — | — | — | **72,1%** |

**A fração sobe com a perseguição em cena grande, e só com ela.** Nas cenas encostadas ela é
teimosamente 48%, do 1v1 ao 2×8: um golpe custa uma parada de conta e uma de decisão, e o tamanho da
cena multiplica as duas juntas. A re-projeção é o que quebra a proporção, e ela só acontece com
distância e com perseguidor.

### 3.4 A conta da cadência, antes de suspeitar do laço

`cadência = 1 − golpes por Tick`, tirada do medido: é o teto de Ticks sem golpe se nunca caíssem
dois no mesmo Tick. A **sobra** é o que ela não explica.

| célula | s/golpe | cadência | sobra |
|---|---:|---:|---:|
| coprimo · encostado · 1v1 | 0,72 | 0,72 | **0,00** |
| coprimo · longa · 1v1 | 0,83 | 0,83 | **0,00** |
| coprimo · encostado · 3×3 | 0,74 | 0,21 | 0,53 |
| coprimo · encostado · 2×8 | 0,74 | 0,00 | 0,74 |
| uníssono · encostado · 2×8 | 0,86 | 0,00 | 0,86 |

**No 1v1 a cadência explica tudo, com sobra zero nas duas células.** Nas cenas grandes a sobra é
enorme: com dezesseis peças a cadência prevê zero Ticks sem golpe e três em cada quatro não têm
nenhum, o que só é possível se os golpes se **empilham**. É a previsão de colisão de agenda (E1 da
`02` §3) confirmada por um segundo instrumento, sem passar pelo pico.

E tem consequência de mesa: **a carga não chega distribuída, chega em rajadas de caixas**, com
trechos longos de clique vazio no meio.

> **Correção de método:** esta coluna comparava o **Tick sem resolução** com uma conta que é só sobre
> **golpes**, e chegar ao alcance e cair no chão também resolvem alguma coisa. Dava sobra negativa,
> que é impossível pelo raciocínio que justifica a conta. Agora ela compara com o Tick sem golpe.

### 3.5 O contexto, por batalha

| célula | Ticks | paradas | golpes | fim dominante |
|---|---:|---:|---:|---|
| uníssono (todas) | 2000 | 2.264 a 22.357 | 566 a 4.576 | **estourou (100%)** |
| coprimo · encostado · 1v1 | 31,7 | 37,0 | 8,8 | desistência-20 (63%) |
| coprimo · encostado · 3×3 | 27,3 | 95,0 | 21,7 | fuga consumada (90%) |
| coprimo · encostado · 2×8 | 24,1 | 221,8 | 50,4 | **fuga consumada (100%)** |
| coprimo · longa · 1v1 | 43,4 | 32,0 | 7,5 | desistência-20 (63%) |
| coprimo · longa · 3×3 | 39,3 | 75,5 | 16,8 | fuga consumada (73%) |
| coprimo · longa · 2×8 | 49,1 | 309,6 | 48,4 | fuga consumada (71%) |

Duas coisas para não passarem batidas:

**A célula uníssona não resolve, e continua sendo o achado e não o defeito.** Escudeiro contra
Escudeiro empata: o bolo de ataque contra a Defesa e o dano contra a Absorção de corte se anulam, e
as 300 batalhas estouram o teto de 2.000 Ticks, todas. É o Grid de hoje, com as quinze bandeiras
desligadas, e é exatamente o que a `margem` e o `bloqueio` existem para consertar.

**E de sete em cada dez batalhas para cima, a política automática do produto termina a cena com
todo mundo correndo do mapa.** `fuga-consumada` domina em cinco das seis células coprimas. Não é
defeito do harness: é o robô que a mesa executa hoje (`decisaoAutomatica`), e a bateria está medindo
a carga de um jogo em que o desfecho normal é a debandada. Isso vale como observação sobre o produto,
está no Pendencias, e **não vale como afirmação sobre o sistema de combate**: uma cena de verdade tem
gente decidindo, e a política é a maior invenção que sobrou na bateria (⚑).

---

## 4 · As decisões desta passada

Cada uma com o motivo e **o que ela custa**. Decisão sem custo escrito é decisão pela metade.

**D16 · O espelho roda a cena que a mesa consegue rodar, e a única extensão é a elegibilidade do
robô.** A mesa só declara sozinha por criaturas (`decidirAutomaticas`, filtro `tipo === 'criatura'`),
e sem os dois lados declarando não há colisão de agenda para comparar. Com `?espelho=1` a
elegibilidade passa a ser só `dados.auto`. A decisão e a declaração continuam saindo de
`decisaoAutomatica` e `declararAtaqueSimultaneo`.
**Custo:** o espelho não prova esse filtro, e uma cena real de PCs contra criaturas tem metade das
declarações vindo de gente. É elegibilidade, não mecânica, mas é uma diferença escrita.

**D17 · O harness copia o MOTOR, e não o projeto.** A ordem do Tick passou a ser passo → declaração
→ retrato → resolução, que é a de `avancarTickSimultaneo`. O projeto (N5, N6) manda declarar antes
de andar e marcar a fase no início do Tick.
**Custo:** a bateria mede um Grid que contraria duas das oito regras novas. Medir a regra nova exige
implementá-la na mesa primeiro, e é isso que L1 é.

**D18 · A fonte de dados do harness rola acerto E dano sempre, como a folha faz.** A mesa, com a
rolagem no site, chama `rolarAcerto(); rolarDano();` na abertura, antes de saber o veredito; o
`resolverGolpe` só rola o dano no acerto.
**Custo:** o harness consome mais acaso do que a régua exigiria. A conta continua sendo a do
`lance.ts`; o que muda é quantos dados saíram do saco. Sem isto, um erro separava as duas sequências
e todo o resto da batalha divergia.

**D19 · O golpe que cai em quem já caiu se resolve.** Na mesa, `resolverGolpeNoAr` acha o caído em
`COMBS` como qualquer outro: abre folha, rola, aplica e cobra Pressão de um corpo no chão.
**Custo:** mais paradas por batalha do que a bateria anterior contava, e elas são reais. Se isso é
regra desejável é outra pergunta, e ela está no Pendencias.

**D20 · O carimbo da fila é reescrito quando a peça anda, como na mesa.** `movido_em` é o terceiro
critério de `ordemDaFila`, e mover um token o reescreve.
**Custo:** o harness copia um defeito. O critério de ESTABILIDADE da fila deixa de ser estável numa
perseguição, e a ordem de declaração e de resolução muda a cada passo. Copiar é o certo (o harness
copia o motor), consertar é assunto de produção, e está no Pendencias.

**D21 · O espelho roda com `rolagem: 'site'`; a bateria assume `rolagem: 'mesa'`.** Sem dado na
página não há o que comparar; e o padrão do produto é a mesa rolando na mão.
**Custo:** os dois instrumentos rodam em modos diferentes. Isso não muda o laço (o modo só decide
quem digita o número), mas muda o custo de tela: 2 gestos por folha no `site` e 4 no `mesa`.

**D22 · O custo de tela sai do código, e o que sobra de ⚑ é só a declaração na mão.** A tabela está
em `custo-tela.mjs` com a derivação escrita.
**Custo:** o número é gesto, e não segundo. Dois cliques podem levar um segundo ou trinta, e medir
isso é o L7 (a medição de campo), que continua sendo a maior lacuna do conjunto.

**D23 · A célula uníssona roda 50 voltas, e não 500.** Ela estoura o teto em 100% das voltas, e
repetir a mesma não-resposta quinhentas vezes gasta a bateria inteira medindo o mesmo impasse. As
métricas por Tick, que são as principais (D8b), sobrevivem à batalha que não termina.
**Custo:** o intervalo de confiança das uníssonas é maior. Como a resposta delas é categórica (100%
estouram), o intervalo não muda leitura nenhuma.

**D24 · As cinco políticas da `02` §0.4 P4 NÃO entram nesta passada.** A bateria roda a
`decisaoAutomatica` do produto, que é invenção do produto e não minha (risco F1).
**Custo:** não há como dizer quanto da carga é da política e quanto é do sistema. Quatro robôs
inventados poriam número inventado no centro da medição, que é exatamente o que o D13 proíbe.

**D25 · O elenco continua com dois arquétipos.** Sete arquétipos exigem cinco fichas novas, e ficha
nova é traço inventado.
**Custo:** nem Arte, nem projétil, nem criatura de bestiário estão no caminho medido. Note que o
caminho da CRIATURA está parcialmente exercitado: no espelho, o lado `b` entra como `tipo:
'criatura'`, com os números por ajuste de instância.

**D26 · Os invariantes pararam em doze, e quatro deles são de INSTRUMENTO.** V6 a V9 conferem que o
quadro fecha, que as duas marginais são o que dizem ser, e que as três contagens de parada (por
classe, por Tick, por subtipo) contam a mesma coisa.
**Custo:** os de regra continuam faltando, e continuam sendo desnecessários enquanto a regra vier de
módulos com teste e com espelho. **O motivo de existirem:** a bateria anterior publicou uma tabela em
que três números não cabiam juntos, e ninguém percebeu até a aritmética não fechar numa revisão. V7
teria pegado na primeira batalha.

**D27 · A partição de quatro estados substitui as duas colunas.** Ver §2.1.
**Custo:** a tabela tem quatro colunas onde tinha duas, e a comparação com o relatório anterior
precisa da tradução (a linha e a coluna).

**D28 · A banda da fração passa a ter `agenda` como duvidosa, além da re-projeção.** Ver §2.3.
**Custo:** a banda ficou larga (20% a 55%), e larga é o que ela é. A anterior era estreita porque
duvidava de menos.

---

## 5 · A lista ⚑ completa

O que a bateria usa e não tem na régua. **Métrica que depende só de entrada inventada não é achado
sobre o sistema: é sensibilidade.**

1. **os traços dos dois arquétipos** (atributos e perícias), tirados da ficha de referência do
   contrato ficha↔mesa. Os números de COMBATE não são inventados: saem de `resumoCombatePC`;
2. **o mapa**: faixa de largura `dist + 8` e altura `n + 2`, escala 1 m por hexágono;
3. **a política**: é a `decisaoAutomatica` da mesa, e não uma das cinco da `02` §0.4 P4. É invenção
   do PRODUTO, e não minha, que é uma posição melhor mas ainda é uma invenção;
4. **o custo de tela da declaração NA MÃO**. A bateria roda a política automática, em que declarar
   não custa clique nenhum, e esse é o número certo do que ela mede; o caminho manual tem variantes
   demais para um número só;
5. **a manobra é sempre `simples`**: a política da mesa não escolhe manobra, então rajada e
   empunhadura dupla não aparecem em batalha nenhuma.

**A lista encolheu de cinco para cinco, e mudou de peso.** Saiu o "um gesto por parada", que era o
pior dos cinco porque contaminava a métrica principal; entrou uma versão muito menor dele (só a
declaração manual). Os dois que mais pesam hoje são o **3** (a política) e o **5** (a manobra), e os
dois são o mesmo assunto: o robô da mesa é simples demais para o que a bateria quer medir.

---

## 6 · O que a bateria continua NÃO dizendo

- **nada sobre segundos.** A conta é em gestos e em Ticks. O fator de conversão é o L7;
- **nada sobre o que as regras novas mudam.** As quinze bandeiras estão desligadas, todas;
- **nada sobre quanto a política pesa.** Roda uma só (D24);
- **nada sobre rajada, empunhadura dupla, Arte, projétil ou criatura de bestiário** (D25, ⚑5);
- **nada sobre a ordem N4** (declarar em ordem crescente de Raciocínio + Prontidão), que não existe
  no motor;
- **nada sobre a mesa com gente.** O espelho prova o laço, não a sessão: modificador escrito, Defesa
  corrigida, gesto abortado e botão contrariando a régua ficam todos de fora.

E uma que é de método: **o espelho prova que os dois laços concordam, não que o laço da mesa está
certo.** Se a mesa estiver errada, o harness agora está errado do mesmo jeito, e é assim que tem de
ser: o harness mede o Grid que existe. As três regras que o espelho mostrou serem discutíveis (o
carimbo da fila, o passo da fuga e o golpe no caído) estão no Pendencias como L13, L14 e L15, como
assunto de produção e não como conserto de harness.
