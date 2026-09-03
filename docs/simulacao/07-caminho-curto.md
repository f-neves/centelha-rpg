# O caminho curto até milhares de batalhas completas

Sobre o commit `e2764a9`. **Nada foi implementado nesta rodada.**

O alvo mudou, e vale escrever qual é agora, porque ele muda o que importa: **rodar milhares de
batalhas completas para achar onde a automação do Grid trava.** Não é comparar regras, que era o que
a grade de 112 células existia para fazer. A grade continua existindo, para depois, e não se mistura
com esta.

Documentos: **P** = `02-projeto-harness.md`, **R2** = `01-diagnostico-carga.md`,
**R3** = `03-respostas.md`, **R4** = `04-prontidao.md`, **R5** = `05-fechamento.md`,
**R6** = `06-etapa-0.md`.

---

## 1 · O que falta, de verdade

Ordenado por **quanto cada um atrasa a primeira batalha**, e não por importância.

### 1.1 · O que já existe e roda hoje

Isto é mais do que eu esperava ao levantar, e muda a conta da §5.

| O que | Onde | Estado |
|---|---|---|
| **agenda, re-projeção, fases, escada de Defesa, fila** | `combate-tempo.ts` | **puro e já empacotado em Node** por `test-simultaneo.mjs` e `test-combate-tempo.mjs` |
| **geometria** (`distanciaHex`, `caminharHex`, `alemDe`) | `hex.ts` | puro e determinístico |
| **Quase-Acerto, Defesa, Absorção, passo, resumo de PC, catálogos, faixa de alcance** | `quase-acerto.ts`, `calc.ts`, `combate-resumo.ts`, `equip.ts`, `alcance.ts` | puros |
| **a semente** | `acaso.ts` + os quatro caminhos | **feito na Etapa 0**, com 14 asserções |
| **uma política pronta, pura e REAL** | `decisaoAutomatica` (`combate-tempo.ts:880-892`) | **existe**: ataca o mais próximo, foge abaixo de 25% de Vida. É a que a mesa roda de verdade no modo automático, e não uma invenção minha |
| **um laço de batalha completo, com semente e em lote** | `scripts/lib-tempo.mjs`: `cena()` (L382), `bateria()` (L512), `criarRng()` (L50) | **roda milhares de batalhas hoje**, com contadores de declaração, aborto, golpes perdidos e ações concluídas. Ver a ressalva abaixo |
| **o empacotamento headless** | o idioma do `esbuild` em `test-artes-grid.mjs` | resolvido, inclusive o `import.meta.env` |
| **o perfil de bandeiras** | `bandeiras.ts` + `regras.json` | feito no item 1.0, com 17 asserções |

**A ressalva do `lib-tempo.mjs`, que é grande:** ele roda o **P/G/R**, não o Simultâneo; **não tem
mapa** (só o `cenaDistancia`, que é uma reta); não tem as classes de parada; e diverge da mesa em
cinco pontos conhecidos (R3 §1.1). Ele não é o harness. O que ele é, e vale muito: a **prova de que a
forma do laço funciona** e um lugar de onde copiar essa forma.

### 1.2 · O que falta, na ordem em que atrasa

| # | O que | Estado | Quanto atrasa, e por quê |
|---:|---|---|---|
| **1** ✅ | **A resolução do golpe fora do modal** (`resolverGolpe`) | **FEITO em 02/09** (`src/lib/lance.ts`, 1051 lances de oráculo, zero divergências). Era: **especificado, falta código.** O contrato está na P §2.1: entra resumo do atacante e do alvo, ação, manobra, índice do golpe, distância, perfil e fonte de acaso; sai total, defesa, `errouPor`, veredito, dano bruto, tipo, Absorção, líquido, `rolls` | **o maior de todos, e é o único que não tem como ser cortado.** Sem ele não há batalha: o golpe não resolve, ninguém perde Vida e nada termina. Hoje o miolo mora dentro de `folhaDaAcao` (`grid.astro:7526-8100`), misturado com `innerHTML` e com `await SB` |
| **2** | **O laço do Tick headless** (`avancoDeTick` + `filaDaCena` + `declararAtaque`) | **especificado, falta código, e virou o maior** depois que o 1 saiu. Contrato na P §2.1; a forma existe pronta no `cena()` do `lib-tempo.mjs`, e as peças puras (agenda, fases, re-projeção) já existem em `combate-tempo.ts` | **o segundo maior.** É onde entra a geometria, que é o que o `lib-tempo.mjs` não tem e é justamente onde mora metade da carga do mestre (viagem, re-projeção, Tick vazio) |
| **3** | **O gerador de cena** (mapa, posições iniciais, quem entra no meio) | **especificado como decisão, não como formato.** A P §2.7 lista tamanho, forma e posições como **inventados**, e o eixo E2 já tem os quatro níveis em hexágonos (1 · 18 · 42 · 71) | **médio, e encurtável a quase nada:** para a bateria mínima da §4 são duas distâncias e um mapa fixo |
| **4** | **A condição de fim** (D4) | **decidida e especificada**: um lado sem ninguém de pé · a fuga que sai do tabuleiro · a desistência de um lado (todos abaixo de 20% de Vida). Falta código | **pequeno**, e é o que separa "batalha" de "laço infinito". Sem isso não há batalha COMPLETA, que é o pedido |
| **5** | **O log com classe de parada e motivo de fim** | **especificado**: o `cena.fim.motivo` com quatro valores e os campos do D2. Falta código, **e falta uma coisa nova**: a classificação de cada parada em **i/ii/iii**, que a R2 §B fez à mão para as 14 paradas e que o log precisa emitir sozinho | **médio, e é o item que a mudança de prioridade promoveu**: é ele que responde a pergunta nova. Não é mais acessório |
| **6** | **O elenco** | **especificado** na P §0.4 P5 (sete arquétipos) e P6. Falta código do gerador | **pequeno se cortado a dois arquétipos**, que é o que a §4 propõe. Os sete inteiros custam a Cura, as Artes e o bestiário junto |
| **7** | **As cinco políticas** | **especificadas** na P §0.4 P4, com as regras ⊙ e ⊕. Falta código | **zero, se a bateria mínima usar a política que já existe** (`decisaoAutomatica`). As cinco são para a grade de 112, não para a pergunta de agora |
| **8** | **O `aid`** (identificador de ação, do D2) | **especificado, e com o defeito achado**: ele existe no registro mas nasce na FOLHA, então dois golpes da mesma ação recebem `aid` diferentes (§8.2). Entra junto com o L11, numa cirurgia só | **pequeno em si**, mas ele é o que liga `decl` a `dano` e sem ele **não há tempo morto**, que é uma das duas métricas do critério |
| **9** | **Os invariantes** | **especificados**: quinze (V1 a V15, R3 §3.1). Falta código | **pequeno, e encurtável:** três bastam para a primeira bateria (conservação de Vida, agenda monotônica, todo `dano` com `decl` ancestral) |
| **10** | **A persistência em memória** (o objeto que substitui o Supabase) | **nem especificado em detalhe**, e é o mais fácil de todos: um objeto e três funções | **quase zero** |
| **11** | **O agregador** (dos `.jsonl` para as tabelas do relatório) | **nem especificado** | **quase zero para a bateria mínima**, porque são doze linhas e cinco métricas |
| **12** | **A tabela de custo de tela** (quantos gestos custa cada parada) | **parcial**: a R2 §C3 mediu o caminho curto em 5 gestos, e a P §4 registra que o resto é leitura de código de 02/09 | **não atrasa a batalha, atrasa a LEITURA.** Sem ela o resultado sai em "paradas" e não em "cliques", e é a conversão que torna o número legível para uma pessoa |

**O que a lista diz, em uma frase:** faltam **dois** itens grandes (a resolução e o laço), e todo o
resto ou é pequeno, ou já existe, ou pode ser cortado da primeira bateria sem prejuízo para a
pergunta.

---

## 2 · A ordem reaberta

A P §0.6 decidiu que N1 a N8 e as quinze bandeiras entram na mesa **antes** do harness, e a razão
escrita foi "para o harness medir o jogo de verdade desde a primeira batalha e nenhuma regra viver só
na cópia headless". Isso põe a bateria depois das Etapas 1 a 4.

### 2a · O que se perde medindo o Grid de hoje

O padrão que o item 1.0 carimbou tem as seis do núcleo **desligadas**, e é o estado real do motor.
Perde-se, e é concreto:

| Regra desligada | O que ela faria com a carga | A pergunta que fica sem resposta |
|---|---|---|
| **N2** | **é a que mais mexe no número que você quer.** Hoje `grupoDaVez` (`grid.astro:4160`) devolve lista vazia assim que existe um golpe devido no Tick: `if (g != null && g <= t) return []`. Ou seja, **um golpe declarado cala a declaração de todo mundo naquele Tick**. Com N2, só golpes declarados **antes** do Tick calam | "quantas peças o mestre tem de consultar num mesmo Tick?" A resposta de hoje é sistematicamente **menor** que a de depois |
| **N4** | acrescenta um passo de escrituração por Tick: **ordenar os livres por Raciocínio + Prontidão** e perguntar nessa ordem. A P §0.47 classifica isso como carga classe **iii** e diz que é "o caso mais claro de uma regra boa para o jogo que piora a mesa se a ferramenta não a absorver" | "quanto custa a ordem de declaração, e o Grid absorve isso?" Fica sem número, e era um dos motivos de a fila na tela existir |
| **N1** | encurta o período entre golpes de `ciclo + 1` para `ciclo`, o que **adensa** os eventos: mais golpes por Tick de cena | nada some, mas todo número por Tick sai **diluído** em relação ao jogo futuro |
| **N5** | agrupa a resolução no fim do Tick. Hoje o mestre declara e resolve intercalado, na ordem que quiser | "dez caixas seguidas cansam diferente de dez caixas espalhadas?" Isso a P §0.10.3 **já dizia que ficaria sem medida**, com ou sem esta inversão |
| **N6** | muda **números dentro** das caixas, não o número de caixas | nada, para esta pergunta |
| **N3** | muda quem golpeia depois de cair | nada, para esta pergunta |

**E a direção do erro é sempre a mesma, o que é a coisa mais útil desta seção: as três que importam
(N2, N4 e N1) empurram a carga para CIMA.** N2 faz mais gente declarar no mesmo Tick, N4 acrescenta
um passo, N1 adensa. **Então medir o Grid de hoje dá um PISO**, não um número solto: se a automação
já trava aqui, ela trava mais depois. Um piso responde a pergunta "onde trava" sem nenhuma ressalva
sobre a direção.

### 2b · O que não se perde

**Quase tudo o que a sua pergunta pede**, porque a carga tem duas origens e só uma delas é regra
nova.

| O que se mede hoje, inteiro | Por que é estrutural |
|---|---|
| **quantas paradas, de que classe** | as 14 paradas e a taxonomia i/ii/iii são da R2 §B, feitas sobre o Grid de hoje. **As 6 de classe iii, que são as automatizáveis, existem todas hoje** e são exatamente o alvo |
| **em que Tick, e com que pico** | o pico cresce com o número de peças, e o teto teórico (R2 §H4) é o número de peças. Isso é geometria e contagem, não regra nova |
| **a carga da viagem**: re-projeção, adiamento, Tick vazio, tempo morto | é o eixo E2, e ele **não depende de nenhuma das seis**. É o que o `lib-tempo.mjs` nunca pôde medir por não ter mapa, e é onde eu esperaria achar o gargalo |
| **quanto a automação compraria** | é o D1, resposta **1c**: a mesma batalha roda duas vezes com a mesma semente, uma com as 6 paradas de classe iii resolvidas pelo motor e outra não, e **a diferença é a medida**. Isso não depende de regra nenhuma |
| **o custo em segundos por Tick** | medido: 30 a 43 ms por avanço, 2 gravações num Tick vazio, mais ~2,3 por peça em trajeto (R3 §5.2) |
| **a carga por peça e por cena** | E3, estrutural |

**A divisão, em número redondo:** das doze métricas da P §2.6, **nenhuma deixa de ser calculável**.
O que muda é o **nível** de duas delas (paradas por Tick e pico), e muda para baixo, que é o lado
seguro.

### 2c · As duas frentes em paralelo

**Funciona, com uma regra dura, e três coisas quebram sem ela.**

O arranjo: a mesa segue a Etapa 1 (o carimbo, o despejo, as nove bandeiras) e o harness lê **o mesmo
objeto de perfil** (`bandeiras.ts`, que já é o ponto único). Cada regra que entra na mesa passa a
existir na bateria seguinte.

| O que quebra | Por quê | O conserto |
|---|---|---|
| **a comparação entre baterias** | uma bateria rodada antes de N2 e outra depois não são comparáveis célula a célula: qualquer diferença mistura a regra com tudo o mais que entrou no meio | **a regra dura: uma bateria é um instantâneo.** Ela carrega `commit` e `dados_hash` (P §2.4), e **comparação só vale dentro de uma bateria, nunca entre duas.** Tendência ao longo de baterias não é resultado, é ilusão |
| **o espelho de motor** | se a resolução da mesa mudar debaixo da cópia, o espelho quebra. Isso é **bom** (é o alarme funcionando), mas significa que o harness tem de ser atualizado no mesmo commit da regra | é custo por regra, e é o preço real do paralelismo. Vale escrever: **cada regra da Etapa 1 passa a ter dois lados para mexer** |
| **as seis bandeiras do núcleo** | não podem ser ligadas pelo perfil enquanto as regras não existirem no motor. Uma bandeira `true` sem regra escrita não faz nada | o E5 do núcleo simplesmente **não roda** nas primeiras baterias, e isso não atrapalha a pergunta de agora, que não é sobre E5 |

**O que NÃO quebra, e é o que torna o arranjo viável:** o perfil já é um ponto único desde o item
1.0, o carimbo já protege a mesa de mudar debaixo de uma cena aberta, e a bateria já registra com
que régua rodou. As três peças do paralelismo estão no lugar antes de ele começar.

---

## 3 · O item 1.1 é mesmo o gargalo compartilhado

**Confirmado, e por uma razão mais forte do que a que eu tinha dado.** Eu tinha escrito (R6 §3.4) que
o 1.1 "obriga o levantamento, e não o comportamento". Está certo e é pouco: o 1.1 não entrega só uma
lista de pontos de leitura, ele entrega um **oráculo**.

**O que ele é, concretamente:** para o despejo existir, os números da resolução precisam sair de
dentro das funções de pintura de `folhaDaAcao` e virar um **objeto do lance**, com entradas e saídas
nomeadas, montado num lugar só. Hoje eles nascem e morrem espalhados:

| Número | Onde nasce | O que faz com ele |
|---|---|---|
| ferimento do alvo | `grid.astro:7541` | vira parcela de `def` |
| ferimento do atacante | L7727 | vira parcela do bolo |
| `errouPor` e veredito | L7768-7769, dentro de `pintarConta` | vira `innerHTML` |
| Absorção e líquido | L7796-7798, dentro de `pintarDano` | vira `innerHTML` |
| a Vida aplicada | `baixarVida`, L8151 | vira `update` |

**As quatro frentes, e o que ele entrega em cada uma:**

| Frente | O que o 1.1 entrega |
|---|---|
| **o espelho de dano** | os campos que faltavam: `def` efetiva, `errouPor`, veredito, tipo, Absorção, líquido. Com eles o espelho de inércia passa a provar que uma bandeira desligada não mexeu no **dano**, e não só na agenda. É o que destrava `margem` e `gate` na Etapa 1 |
| **a prova da semente dentro da resolução** | a ressalva escrita na R6 §3 (nenhuma cena de teste resolve golpe) cai sozinha: com os `rolls` no despejo, duas execuções com a mesma semente comparam dado a dado dentro de uma resolução de verdade |
| **o `aid` do D2** | o objeto do lance **é** o lugar onde um identificador de ação nasce e sobrevive. Hoje não há esse lugar: `baixarVida` é o único ponto de estrangulamento e ele já não sabe de que declaração veio |
| **a cópia da resolução para o harness** | e aqui está o que eu tinha subestimado: o objeto do lance **é o contrato do `resolverGolpe`** da P §2.1, escrito em código em vez de em tabela. E o despejo de batalhas reais vira **fixture**: entradas e saídas verdadeiras, contra as quais a cópia é conferida antes de existir espelho nenhum |

**Por que "oráculo" e não "levantamento":** a P §2.1 dá o contrato do `resolverGolpe` em prosa. Prosa
não pega divergência, e a lição do `lib-tempo.mjs` é exatamente essa: cinco divergências, cada uma
passando nos próprios testes, nenhuma pega por teste, todas pegas por comparação. Com o despejo, a
primeira versão da cópia tem contra o que rodar **antes** de a mesa e o harness estarem os dois de pé.

**Conclusão: sim, o 1.1 é a primeira coisa a fazer**, e ele encabeça a sequência da §5. Ele deixou de
ser um item da Etapa 1 e virou a fundação das duas frentes.

**Uma ressalva honesta, para não vender demais.** O 1.1 entrega o contrato e o oráculo; ele **não**
entrega a cópia. Alguém ainda escreve o `resolverGolpe` do harness, e o trabalho dele é o item 1 da
lista da §1. O 1.1 encurta esse trabalho e não o substitui.

---

## 4 · A primeira bateria: doze células, e não 112

A grade de 112 existe para comparar regras, o que é a pergunta do D8b. **A sua pergunta agora é
outra**, e ela é mais simples de responder: onde a automação trava. Não precisa de fatorial sobre
regras, precisa de fatorial sobre **o que gera carga**.

### 4.1 · O desenho

**Três eixos, e só os três que a R2 previu que dominam a carga:**

| Eixo | Níveis | Por que ele está aqui |
|---|---:|---|
| **Peças em cena** | 3: **1v1 · 3×3 · 2×8** | domina o **total** de paradas, quase linearmente, e domina o **pico** junto com o ciclo. É o eixo da horda |
| **Distância inicial** | 2: **encostado (1 hex) · longa (42 hexes)** | é quem cria **viagem, re-projeção, Tick vazio e tempo morto**, que é a metade da carga que nenhuma bancada anterior pôde medir |
| **Diversidade de ciclo** | 2: **uníssono (espada longa dos dois lados) · coprimo (espada longa × montante)** | é quem decide se os golpes **colidem** no mesmo Tick. É o eixo do pico |

**`3 × 2 × 2 = 12 células.**

**E um quarto eixo que não custa célula, e é o coração da pergunta:** o **perfil de automação** (D1,
resposta **1c**). Cada batalha roda **duas vezes com a mesma semente**: uma com as seis paradas de
classe **iii** resolvidas pelo motor, outra com elas consultando. **A diferença entre as duas é a
medida do que a automação compraria**, e ela sai por classe de parada. Isso é um campo no registro, e
não uma multiplicação da grade.

| | |
|---|---|
| Células | **12** |
| Repetições | **500** por célula |
| Batalhas | **6.000**, e **12.000 execuções** contando os dois perfis |
| Sementes | 6.000, cada execução do par usando a mesma |
| Tempo de máquina | poucos minutos, pela ordem de grandeza da R3 §4.2 |
| Leitura | **12 linhas**, uma por célula, cada uma com o par de perfis lado a lado |

### 4.2 · O que fica de fora, de propósito

**Uma política só, e ela não é minha:** a `decisaoAutomatica` que a mesa já roda (ataca o mais
próximo, foge abaixo de 25%). As cinco da P §0.4 P4 ficam para a grade de 112. Ver na §6 o que isso
custa e por que é uma escolha e não um esquecimento.

**Dois arquétipos:** Escudeiro (espada longa, heater, malha) e Montanteiro (montante, placa completa).
Cobrem ciclo 6 e 7, escudo e armadura pesada, e passo diferente. **Sem Conjurador**, o que corta as
Artes, a Mana e a Cura do caminho crítico. **Sem criatura**, o que corta o bestiário.

**Sem parede, sem bandeira ligada, sem as cinco condições de dano por rodada.** Tudo isso muda
números dentro das caixas, e a pergunta é sobre o número de caixas.

### 4.3 · As métricas, e o que cada uma já responde

| Métrica | O que ela diz sobre o gargalo |
|---|---|
| **paradas por Tick, separadas em i / ii / iii** | **a resposta direta.** A fração de classe iii é o tamanho do que a automação pode tirar. Se ela for pequena, automatizar não resolve, e o gargalo é decisão de jogador ou julgamento de mestre |
| **a diferença entre os dois perfis, por classe** | **quanto a automação compraria**, em paradas e em gestos. É o número que decide onde investir |
| **pico de paradas num Tick** | onde a fila empilha, e se ela bate no teto teórico (o número de peças) |
| **gestos por golpe aplicado** | converte parada em clique, com a tabela de custo de tela. É a unidade que uma pessoa entende |
| **fração de Ticks vazios** | o ⏭ que não produz nada. Se for alta na distância longa, o gargalo é **viagem**, e o conserto não é automatizar caixa, é encurtar a travessia |
| **tempo morto do jogador, em Ticks** | a outra metade do critério do D8b. Depende do `aid` |
| **distribuição de `cena.fim.motivo`** | quantas batalhas fecham por morte, por desistência, por fuga, e quantas estouram |

**O que a bateria já consegue dizer, com essas doze células:**

1. **de que classe é a carga**, e portanto se automação é a resposta certa para o problema;
2. **quanto a automação compraria**, medido e não estimado, no mesmo par de batalhas;
3. **se o gargalo é a caixa ou a travessia**, comparando os dois níveis de distância;
4. **se ele é o total ou o pico**, comparando os três tamanhos de cena;
5. **se a colisão de agenda é o que faz o pico**, comparando uníssono e coprimo;
6. **em que Tick da batalha a carga se concentra**, que é a diferença entre "cansa" e "trava".

**O que ela NÃO consegue dizer, e tem de estar escrito no relatório dela:** quanto a política pesa
(uma só), o que as regras novas mudam (nenhuma ligada), e o que cada bandeira compra (nenhuma
ligada). Essas três são a grade de 112, e continuam sendo.

---

## 5 · A conta: do estado de hoje até a bateria rodando

*Atualizada em 02/09, com os passos 1 e 2 entregues e com o L11 e o L12 dentro da sequência.*

### 5.1 · A sequência

| # | Passo | O que entrega | Depende de |
|---:|---|---|---|
| **1** ✅ | **O objeto do lance e o despejo da resolução** (item 1.1) | **FEITO** (`27a674e`). O contrato do `resolverGolpe` escrito em código, o oráculo de entradas e saídas reais, e os campos que faltavam ao espelho | nada. Era a fundação |
| **2** ✅ | **A cópia da resolução** (`src/lib/lance.ts`) | **FEITO** (`a949d9a`, fechado em `d412c6f` e `44578d0`). 1051 lances, duas fontes, zero divergências | 1 |
| **3** | **O índice do golpe, o `aid` da ação e A RECOLETA** (L11 + L12), **uma cirurgia só, um commit só** | a rajada volta a pagar o que a régua cobra, o `aid` passa a ser da ação, `golpeDaAgenda` × `penDadosUsado` vira a prova do conserto, e a fixture volta a ser oráculo do jogo que a mesa joga | 2. **Bloqueia o espelho de motor**, que hoje já está condenado a divergir na primeira rajada |
| **4** | **O laço do Tick headless** (`filaDaCena` + `declararAtaque` + `avancoDeTick`) | a batalha andando, com mapa, agenda e re-projeção | 3, mais `combate-tempo.ts` e `hex.ts`, que já existem |
| **5** | **O fim de batalha** (D4) e o **teto de 2.000 Ticks** | a batalha **completa**, que é a palavra do pedido | 4 |
| **6** | **O log**, com classe de parada, `aid` e `cena.fim.motivo` | o dado bruto da pergunta | 4 e 5 |
| **7** | **O perfil de automação** (o D1 1c: a mesma semente, duas execuções) | a medida do que a automação compraria | 6 |
| **8** | **O gerador de cena e o elenco mínimo** (dois arquétipos, dois mapas, três tamanhos) | as doze células | 4 |
| **9** | **Quatro invariantes** e o **agregador** | a batalha que se sabe válida, e as doze linhas | 6 |
| **10** | **A bateria roda** | os números | tudo acima |

**Por que o L11 e o L12 são um passo só, e não dois.** Os dois mexem no mesmo caminho, de
`declararGolpe` até a folha: o conserto do índice precisa **passar o golpe até lá**, e o `aid`
precisa **nascer na declaração e viver em `acao`**, que é o mesmo trecho de código. Separá-los custa
uma terceira recoleta dos 1051 lances.

E há um motivo melhor que o custo: **os dois campos novos do L12 são o instrumento que PROVA o
conserto do L11.** Feito junto, a recoleta já sai com `golpeDaAgenda === penDadosUsado` em todo
lance, que é a asserção do conserto. Separado, o conserto acontece e não há como mostrá-lo.

**E os dois campos ficam depois do conserto**, mesmo passando a ser sempre iguais: a igualdade vira
**invariante do harness**, ao lado dos treze da R3 §3.1, e volta a falar se alguém reintroduzir a
divergência. Campo que não muda mais só é ruído quando ninguém o lê; com asserção em cima, ele é uma
trava. É o mesmo raciocínio da trava do `cobre`.

**A RECOLETA É PARTE DO PASSO 3, NO MESMO COMMIT.** Não é uma tarefa seguinte, e a razão é dura: o
conserto muda o resultado de **todo lance de rajada com índice maior que zero**, então a coleta atual
deixa de ser oráculo do depois e passa a ser **registro do antes**.

Entre o conserto e a recoleta o `npm run validate` fica **vermelho**, porque o `test-lance.mjs` roda
a cópia consertada contra uma fixture do jogo velho. **Isso é o comportamento certo**, e é o alarme
funcionando: uma divergência ali significa exatamente o que ela deve significar, que a resolução
mudou.

**O que não pode acontecer é essa janela atravessar commits.** Um repositório em que o `validate` já
está vermelho por um motivo conhecido é um repositório em que o próximo vermelho não é notícia. E há
um risco pior: quem for consertar depois vai encontrar uma fixture que descreve o bug, e **um oráculo
que mente na direção do bug é pior que nenhum oráculo**, porque ele autoriza o erro em vez de calar
sobre ele. Conserto e recoleta entram juntos, ou não entram.

### 5.2 · O mais longo, e por quê

**Era o passo 2 e agora é o 4**, porque os dois primeiros saíram.

O laço do Tick é grande, mas é **montagem**: a agenda, as fases, a re-projeção e a fila estão em
`combate-tempo.ts` e são puras; a geometria está em `hex.ts`; a resolução está em `lance.ts`, agora
conferida contra 1051 lances de verdade. **O risco dele é de ordem, não de conta**, e é uma diferença
grande em relação ao que o passo 2 era: lá, uma divergência silenciosa decidia dano, que decide
duração, que multiplica toda a carga.

O passo 3 (L11 + L12) é pequeno em linhas e **bloqueante em consequência**: enquanto ele não entrar,
o espelho de motor não pode ficar verde, porque a cópia aplica `penDados[golpeIndice]` e a mesa
aplica `penDados[0]`.

**E daí sai a linha mais importante desta seção: o passo 4 NÃO TEM COMO SE PROVAR até o 3 estar
feito.**

As peças do laço são puras e conferidas, uma a uma: a agenda, as fases, a re-projeção e a fila em
`combate-tempo.ts`; a geometria em `hex.ts`; a resolução em `lance.ts`, contra 1051 lances. **O que
nenhuma delas contém é a ORDEM das operações dentro do Tick**, e a ordem é o que o laço é. Ela existe
hoje num lugar só, dentro de `avancarTickSimultaneo` (`grid.astro`), misturada com repintura,
gravação no Supabase e DOM, e não há função pura nenhuma que a descreva.

**Quem prova a ordem é o espelho de motor**, comparando a mesa com a cópia Tick a Tick pelos campos
da R3 §1.1.1, e o espelho é o que o passo 3 destrava.

Sem esta linha escrita, o erro que vai acontecer é previsível: alguém monta o laço, roda os testes
das peças, vê tudo verde e conclui que está pronto. **As peças passarem não é o laço estar certo**, e
um laço com a ordem trocada produz batalhas plausíveis, com duração plausível e carga plausível, que
é a forma mais cara de erro que este projeto pode ter.

### 5.3 · Onde a sequência encurta

**Já encurtei o que dava, e está na §4.** O que sobrou, em ordem de quanto economiza:

| Corte | O que economiza | O que custa |
|---|---|---|
| **uma política, a que já existe** | as cinco políticas inteiras, mais os quatro números inventados (40%, 50%, 3 hexes, 2 deslizes), mais a marca ⚑ no relatório | a bateria não diz quanto a política pesa. **E não é só economia: é honestidade**, porque a política que roda passa a ser a do produto e não a minha |
| **dois arquétipos, sem Conjurador e sem criatura** | as Artes, a Mana, a Cura, o bestiário e o segundo caminho de código do `aid` | a bateria não cobre Arte nem porte |
| **quatro invariantes em vez de quinze** | onze | a batalha inválida passa despercebida em mais casos. Os quatro escolhidos (conservação de Vida, agenda monotônica, todo `dano` com `decl` ancestral, e `golpeDaAgenda === penDadosUsado`) são os que pegam erro de motor, e não erro de regra |
| **duas distâncias em vez de quatro** | metade das células | perde-se a forma da curva de viagem, e fica o extremo |
| **a persistência é um objeto** | a camada inteira | nenhum: era isso mesmo |

**E um corte que eu NÃO recomendo, e explico:** pular o passo 1 e escrever o `resolverGolpe` direto
da leitura do código. Ele economizaria um passo e reintroduziria exatamente o risco que criou as
cinco divergências do `lib-tempo.mjs`. **Agora há prova de que não valia:** o passo 1 achou três
defeitos de mesa que nenhum teste unitário pegava, e um deles (a rajada de graça) contamina a métrica
principal da bateria.

**O gargalo real da sequência não é técnico:** é que os passos 4 a 6 são **um bloco**, e não têm
entrega parcial útil. Antes do fim de batalha não existe batalha completa, e portanto não existe nada
para olhar. É a parte da estrada em que não há acostamento.

### 5.4 · Onde o oráculo entra no caminho crítico

**Ele é pré-requisito, mas não da batalha completa: é pré-requisito de CONFIAR na cópia da
resolução**, que é o preço da decisão do Q6.

Sem ele, o harness roda milhares de batalhas contra uma resolução que ninguém conferiu, e **todo
número da bateria fica pendurado nisso**: uma divergência de dano decide duração, que multiplica
toda a carga medida.

Então ele **não é uma etapa da sequência**, é uma **validação que roda uma vez por mudança na
resolução**, e é o que autoriza a bateria a valer alguma coisa. Concretamente: entra no `validate`
(já está), roda a cada `npm run validate`, e a recoleta é ato deliberado, avisado pelo carimbo, nunca
reação a teste vermelho.

---

## 6 · O que essa mudança contradiz, sem suavizar

**Quatro coisas. Duas você deveria reconsiderar explicitamente, uma é só o preço, e uma é um erro
meu, de ontem.**

### 6.1 · A §0.6 · "tudo entra na mesa antes do harness" · **você já está reconsiderando**

É a contradição direta, e o seu pedido a abre de propósito. O que vale dizer é **o motivo que a §0.6
deu**, para você reconsiderar com ele na mão: *"para que o harness meça o jogo de verdade desde a
primeira batalha e nenhuma regra viva só na cópia headless"*.

Invertendo, a primeira bateria mede um jogo que vai mudar. A §2a diz o tamanho disso: as três regras
que importam empurram a carga para cima, então o número é um **piso**. **Um piso responde a sua
pergunta.** A §0.6 continua certa para a pergunta dela, que era comparar regras; ela está errada para
a sua pergunta de agora, e isso é mudança de alvo, não erro de decisão.

### 6.2 · O F1, e a política única · **você deveria reconsiderar explicitamente**

**Isto é o mais importante desta seção.** Você decidiu, em 02/09, o que fazer **se** o sinal do F1
acender: uma política só, e a política vira grade própria. Era um remédio, condicionado ao sinal.

A bateria mínima da §4 **toma o remédio antes do sintoma**: ela roda com uma política e pronto. Não é
contradição, é antecipação, e ela tem uma consequência que o F1 previa e que agora vira certeza em
vez de risco: **a primeira bateria não consegue dizer nada sobre quanto a política pesa.** Se o
gargalo que ela encontrar for, na verdade, um artefato de "atacar sempre o mais próximo", nada no
resultado avisa.

**O que atenua, e é real:** a política que roda **não é minha**, é a `decisaoAutomatica` que a mesa
executa hoje no modo automático. Então o resultado descreve o robô que o produto tem, e não um robô
que eu inventei para a medição. Isso é uma posição bem melhor que a do F1 original.

**O que continua valendo o seu olhar:** o robô da mesa é deliberadamente burro (o comentário dele diz
"a heurística é a mínima de propósito: ela existe para a horda andar sem dez cliques por Tick, não
para jogar bem"). Uma carga medida sobre um robô burro pode ser **menor** que a de mesa real, porque
ninguém recua, ninguém aborta, ninguém espera. **Isso empurra na direção contrária ao piso da §2a**,
e é a única coisa neste documento que empurra para esse lado.

### 6.3 · O Q6 e o espelho · **é preço, e não contradição**

O Q6 decidiu a cópia com teste-espelho, e o espelho compara mesa contra harness. Rodando a bateria
antes de a Etapa 1 terminar, o espelho passa a ser conferido contra uma mesa que ainda muda. Não
quebra nada: quebra **em voz alta**, que é a função dele. O preço está escrito na §2c: cada regra da
Etapa 1 passa a ter dois lados para mexer.

### 6.4 · O perfil diz `true` para nove bandeiras que o motor não aplica · **erro meu, de ontem**

No item 1.0, ontem, o bloco `bandeiras` entrou com as nove de regra publicada em **`true`**, seguindo
a §0.6 ("o padrão em produção é ligadas"), e as seis do núcleo em `false` com a justificativa de que
"as regras que elas ligam ainda não existem no motor".

**A justificativa das seis vale igualzinho para as nove.** Nenhuma das nove está ligada no motor: a
`margem` não entra no dano, o `gate` não é chamado, o `bloqueio` não existe. **O perfil afirma um
jogo que a mesa não joga.** Enquanto ninguém lê o bloco, é inofensivo. A partir do momento em que o
harness ler o mesmo objeto, que é o arranjo da §2c, ele vai aplicar a Margem que a mesa não aplica, e
**a primeira divergência do espelho vai ser culpa do dado, não do código**.

Fica pior no seu novo alvo: a bateria mínima da §4 quer medir o **Grid de hoje**, e o perfil de hoje
diz que nove regras estão ligadas.

**O conserto é uma linha e ele é seu para decidir**, porque mexe numa decisão que você tomou:

- **as nove nascem `false`**, e cada uma vira `true` no commit que a liga no motor, exatamente como
  o `n1`. O padrão de produção "ligadas" da §0.6 continua sendo o destino, e passa a ser alcançado
  uma bandeira por vez em vez de por antecipação;
- ou **ficam `true`** e entra uma segunda lista, `implementadas`, e todo leitor tem de cruzar as duas.

Eu recomendo a primeira, e o argumento é o que eu mesmo escrevi no JSON há um dia: *"uma bandeira
ligada cuja regra não está escrita não faz nada, e uma desligada cuja regra existe é o estado de
hoje"*. A primeira metade dessa frase é a descrição de uma armadilha, e eu a escrevi como se fosse
uma justificativa.

---

## 7 · O plano de execução, completo

Como a simulação roda, de ponta a ponta. Escrito para ser atacado.

### 7.1 · As peças, e onde cada uma mora

```
src/lib/                      o que a mesa e o harness compartilham, tudo puro
  acaso.ts                    a fonte de acaso (feito)
  bandeiras.ts                o perfil de regras (feito)
  combate-tempo.ts            agenda, fases, re-projeção, fila, decisaoAutomatica (existe)
  hex.ts  calc.ts  quase-acerto.ts  combate-resumo.ts  equip.ts  alcance.ts   (existem)
  lance.ts                    NOVO · o objeto do lance e o resolverGolpe puro (passos 1 e 2)

scripts/sim/                  o harness, e só ele
  motor.mjs                   NOVO · o laço do Tick: fila, declaração, avanço, fim
  politica.mjs                NOVO · embrulha decisaoAutomatica e marca a classe de cada parada
  cena.mjs                    NOVO · gerador de cena e de elenco
  log.mjs                     NOVO · o buffer em memória e a gravação por batalha
  invariantes.mjs             NOVO · os três
  rodar.mjs                   NOVO · o processo de uma faixa de batalhas
  bateria.mjs                 NOVO · reparte as faixas em processos e concatena
  agregar.mjs                 NOVO · dos .jsonl para as doze linhas
```

**Por que `lance.ts` fica em `src/lib` e o resto em `scripts/sim`:** o `resolverGolpe` é o único que
os **dois lados** usam, e é onde a divergência custa caro. Pôr a resolução num módulo compartilhado
não desfaz a decisão do Q6 (cópia, não extração): o que se compartilha é a **conta**, e o que se
copia é o **laço**. A mesa continua com o modal dela, que passa a chamar a mesma função.

### 7.2 · Um processo, uma faixa

```
node scripts/sim/bateria.mjs --semente 20260902 --n 500 --saida .sim/2026-09-02/
```

O `bateria.mjs` monta a lista de execuções (12 células × 500 repetições × 2 perfis = 12.000), reparte
em faixas de índices e abre **um processo por faixa**, com `child_process.fork`.

**Processos, e nunca `worker_threads` nem `Promise.all`.** Está escrito na P §0.8.7 e é restrição, não
preferência: o `acaso.ts` guarda a fonte num `let` de módulo, e duas batalhas no mesmo processo
dividiriam a mesma sequência **em silêncio**, sem erro e sem teste vermelho.

Cada processo:

1. lê os JSONs de dados **uma vez** e monta o elenco;
2. para cada índice da faixa, calcula a própria semente e roda a batalha;
3. acumula os eventos **em memória** durante a batalha;
4. grava **uma vez por batalha**, anexando ao `.jsonl` da faixa;
5. nada compartilhado, nada de trava.

### 7.3 · A semente, e o par de perfis

```
semente(b) = hash32(semente_mestre, celula_id, repeticao)
```

**As duas execuções do par usam a MESMA semente**, e é isso que faz a diferença entre elas ser a
medida da automação e não ruído: mesmos dados, mesmas posições, mesmas decisões; a única diferença é
se as seis paradas de classe **iii** foram consultadas ou resolvidas pelo motor.

**E aqui há uma coisa a conferir na leitura, que eu não sei responder antes de rodar:** resolver uma
parada de classe iii pelo motor pode **consumir a sequência de acaso de forma diferente** de
consultá-la (se a consulta simulada rolar algo que o motor não rola, ou o contrário). Se isso
acontecer, as duas execuções divergem depois da primeira parada iii e o par deixa de ser um par.
**A regra: a classe iii é aritmética, e aritmética não rola dado.** Se alguma das seis rolar, ela não
é classe iii e a taxonomia da R2 §B está errada naquele ponto. **O invariante que pega isso:** as
duas execuções do par têm de consumir o **mesmo número de rolagens**. Vale como quarto invariante,
e ele nasce aqui.

### 7.4 · O laço de uma batalha

```
enquanto não terminou e T <= 2000:
  T += 1
  fase 0   quem tem golpe devido neste Tick fica marcado o Tick inteiro
  fase 1   declaração: todos os livres, na ordem da fila
             cada declaração é uma PARADA, classificada i / ii / iii
  fase 2   passos: cada peça em trajeto anda, e a agenda re-projeta se não alcançou
  fase 3   resolução: cada golpe devido resolve por resolverGolpe
             cada resolução é uma PARADA, classificada
  fase 4   fim? sem-ninguem-de-pe · fuga-consumada · desistencia-20 · estourou
  invariantes, em memória
```

**A classe de cada parada sai da tabela da R2 §B**, e é a peça nova do log: **i** decisão de jogador,
**ii** julgamento narrativo, **iii** aritmética de escrituração. O perfil automatizado resolve as
**iii** sem consultar; o perfil de hoje consulta as catorze.

### 7.5 · O que sai gravado

Dois arquivos por bateria, mais um `.jsonl` por faixa.

`bateria.json`, um por execução:

```
run_id  commit  iso  semente_mestre
perfil_bandeiras   o objeto de bandeiras.ts, como estava
dados_hash         hash de src/data e src/lib
celulas[]          { id, pecas, distancia, ciclos, n }
inventado[]        o que foi escolhido por mim, com o valor e a linha do documento
```

`batalhas.jsonl`, uma linha por execução de batalha:

```
b  celula  repeticao  perfil(hoje|auto)  semente
ticks  fim_motivo  vivos_a  vivos_b
paradas   { i, ii, iii }        totais
porTick[] { t, paradas, classe, pico }
gestos    { total, porGolpe }
vazios    fração de Ticks sem resolução
tempoMorto[]  por aid: do decl ao dano
rolagens  quantas vezes o acaso foi consumido
invariantes  [] ou a lista do que violou
```

**E o log completo de eventos só para uma amostra declarada** (uma célula, 50 batalhas), porque
12.000 batalhas com 100 a 150 eventos cada dão centenas de MB e ninguém lê.

### 7.6 · A leitura, em três tabelas

| Tabela | Linhas | O que ela responde |
|---|---|---|
| **A carga, por célula** | 12 | paradas por Tick (p50, p90, p99, máximo), pico, gestos por golpe, fração de Ticks vazios |
| **A composição, por célula** | 12 | a fração de cada classe i / ii / iii. **É a tabela que responde a pergunta** |
| **O que a automação compra** | 12 | a diferença entre os dois perfis, em paradas e em gestos, por classe |

Mais um histograma, e ele vale por uma tabela: **paradas por Tick ao longo da batalha**, para ver se
a carga é plana, cresce, ou se concentra num pedaço.

### 7.7 · Como se sabe que o resultado vale

| Confere | Como |
|---|---|
| a batalha é válida | os invariantes, por batalha. Batalha que viola vai para um balde próprio e **não entra em média nenhuma** |
| o par é um par | o invariante das rolagens da §7.3: as duas execuções consomem a mesma quantidade |
| a batalha termina | a distribuição de `fim_motivo`. Se `estourou` for grande, a leitura de tudo o que é por batalha está enviesada e o relatório diz isso na primeira linha |
| o motor concorda com a mesa | o **espelho de motor**: uma cena fixa, a mesma semente dos dois lados, comparando os campos da R3 §1.1.1. **É o portão da bateria**, e roda antes dela |
| o número de repetições basta | o piloto: 2.000 batalhas na célula 3×3 · longa · uníssono, medindo o CV de paradas por Tick, e a regra de decisão escrita antes de rodar |

### 7.8 · O que eu gostaria que fosse atacado neste plano

1. **A cópia da resolução virou compartilhamento** (`lance.ts` em `src/lib`, chamado pelos dois).
   Isso desfaz de fato a decisão do Q6, ou é o que ela sempre quis dizer?
2. **O par de perfis com a mesma semente** depende de a classe iii não rolar dado. Se rolar, o par
   quebra e eu proponho um invariante para pegar. É suficiente?
3. **Doze células e uma política** respondem "onde a automação trava", ou o resultado vai ser sobre o
   robô da mesa e não sobre o Grid?
4. **Medir o Grid de hoje é um piso** porque N2, N4 e N1 empurram a carga para cima. Mas a §6.2 diz
   que o robô burro empurra para baixo. **As duas forças estão no mesmo número.** Isso invalida o
   argumento do piso?
5. **A taxonomia i / ii / iii** foi feita à mão na R2 §B sobre as 14 paradas. O log precisa emitir a
   classe sozinho, e isso quer dizer carimbar cada ponto de parada no código. Alguém confere que o
   carimbo está no lugar certo, ou a classificação vira o que eu escrevi nela?

---

## 8 · Três coisas que a coleta de lances mexeu no caminho curto

Escrito em 02/09, depois dos passos 1 e 2 e do fechamento do oráculo.

### 8.1 · O defeito nº 3 é erro de resolução em produção, e ele mora na rajada

**Desde quando.** Nasceu em **23/08**, no commit `f8459e6` ("Golpe adiado: a primeira
fatia, atrás de uma chave que nasce desligada"). Antes dele, `folhaDaAcao` era aberta **uma vez por
ação**, e `rolarAcerto` usar `linhas[0]` era correto por construção: o comentário que está lá até
hoje ("o campo fica com o PRIMEIRO golpe, que é o que decide se o ataque pegou; os outros aparecem
escritos ao lado") descreve exatamente esse mundo. Quando `resolverGolpeNoAr` passou a abrir **uma
folha por golpe**, o comentário deixou de ser verdade e ninguém moveu o índice. Dezoito commits
passaram por `grid.astro` desde então.

**E ele está no único caminho que a bateria usa.** `adiaGolpe` (`combate-tempo.ts:82-85`) devolve
`true` sempre que o sistema é `simultaneo`: *"no simultâneo o golpe adiado não é opção, é o próprio
modo"*. Então no Simultâneo **todo ataque** passa por `declararGolpe` → `resolverGolpeNoAr`, uma
folha por golpe, cada uma usando `penDados[0]`.

**Quantas ações da bateria passam por ele.** A conta muda conforme a manobra, e a resposta não é a
que eu esperava ao achar o defeito na dupla:

| Manobra | Passa pelo defeito? | Por quê |
|---|---|---|
| **simples** | **não** | um golpe, um `penDados`, índice 0 é o certo |
| **dupla** | **não chega a acontecer** | nenhuma das cinco políticas da §0.4 P4 declara `dupla`, e nenhum arquétipo das âncoras pode: o Escudeiro tem escudo na mão inábil e o Montanteiro usa as duas mãos |
| **rajada** | **TODAS** | e é aqui que dói |

**A rajada é o caso real, e ele é pior que o da dupla.** `regras.json → combate.rajada` tem
`penDadosAcumula: true` e `penDadosPorGolpeExtra: −1`, com teto 3 para as classes leve e média e 2
para haste e pesada. Uma rajada de três com espada longa tem `penDados = [0, −1, −2]`. Com o defeito,
os golpes 2 e 3 saem com **0**: **três dados a mais ao longo da ação, que a régua cobrava e ninguém
cobrou.** A rajada, cujo preço inteiro é a penalidade acumulada de dados, está saindo **de graça**.

**E as duas políticas das âncoras declaram rajada:** o Agressivo ("manobra `rajada` se a Vida do alvo
é maior que a minha") e o Cauteloso ("se o inimigo mais próximo está em Recuperação declarada, atacar
`rajada`").

**A incidência é enviesada, e isso é o mais importante desta seção.** O gatilho do Agressivo é *"a
Vida do alvo é maior que a minha"*, ou seja a rajada é declarada **exatamente quando quem ataca está
perdendo**. O defeito não entra como ruído distribuído: entra concentrado no lado que está atrás, e
dá a ele um desconto que a régua não previu.

**O que muda na leitura, consertando antes ou depois.** A distinção importa por causa do D8b, e ela
não é a que se esperaria:

| | Consertado ANTES | Consertado DEPOIS |
|---|---|---|
| **paradas por Tick** | a régua | **SOBE, e sobe pelo bug.** Ver abaixo: esta linha estava errada na primeira versão |
| **gestos por golpe aplicado** | a régua | **sobe**: sem a penalidade há mais acerto, e acerto custa mais cliques que erro (rola dano, aplica, atualiza Vida) |
| **duração** | a régua | **mais curta**: mais acerto, mais dano, batalha mais rápida |
| **o que a bateria concluiria** | a rajada é uma escolha com preço | **a rajada é dominante**, e a política a escolheria mais, e o relatório atribuiria à regra um efeito que é de um bug |

**A primeira versão desta seção concluía que a métrica principal quase não se mexia, e estava
errada.** O argumento era: uma rajada de três são três golpes em três Ticks, três folhas, com ou sem
a penalidade, logo o número de caixas é o mesmo. **Ele está preso a uma batalha de composição fixa, e
a composição não é fixa.**

A composição de manobras é **saída da política**, que reage ao estado, que depende do dano, que
depende da penalidade que não está sendo cobrada. A minha própria frase da linha de baixo já
continha a refutação: *"a rajada é dominante, e a política a escolheria mais"*. Se ela escolhe mais,
a mistura de manobras muda, e é a mistura que gera as paradas.

**E o efeito tem direção, o que é pior que ter tamanho.** A rajada é a **única** manobra que produz
vários golpes por ação, portanto várias folhas. De graça, a política a escolhe mais; mais rajada é
mais folhas por ação; **a métrica que reprova SOBE**. Somado ao viés do gatilho (o Agressivo declara
rajada quando está perdendo), o efeito se concentra no lado que está atrás, que é o que mais luta e
mais gera parada.

**Conclusão corrigida: o defeito contamina a métrica PRINCIPAL, e não só a leitura de balanço.** Isso
reforça, e não enfraquece, a decisão de consertar antes da primeira bateria.

**Há um segundo argumento, e ele é decisivo: o espelho já está condenado a falhar.** O
`resolverGolpe` de `lance.ts` recebe `golpeIndice` e aplica `penDados[golpeIndice]`, que é a regra.
A mesa aplica `penDados[0]`. **A cópia já implementa o certo e a mesa o errado**, então o espelho de
motor vai divergir na primeira rajada que passar por ele. Ou a mesa é consertada, ou a cópia é
rebaixada para copiar o bug. Não há terceira saída, e rebaixar a cópia é escrever o defeito em dois
lugares.

**Conclusão: consertar antes**, e o conserto é passar o índice do golpe até a folha. Fica registrado
e não feito nesta rodada, pelo mesmo critério do `resumoDe`: o conserto muda resolução em produção e
merece a sua própria passada, com recoleta. Ele é o **passo 3** da sequência da §5.1, junto com o
`aid`, numa cirurgia só.

### 8.2 · O objeto do lance é por GOLPE, e o desenho estava meio errado

**Meio, e vale separar as duas metades.**

**O que estava certo:** o registro já é por golpe, porque cada folha é um golpe. A correção de
02/09 (um lance por folha, e não N lances por folha) alinhou o registro com o que a mesa faz.

**O que está errado, e são duas coisas:**

| O que | Como está | Como tem de ficar |
|---|---|---|
| **o `aid`** | nasce **na folha**, com o formato `l<atk>-<alvo>-t<tick>-<seq>`. Dois golpes da mesma ação recebem `aid` **diferentes** | o `aid` é da **AÇÃO** (é o que o D2 pede: um identificador atravessando cinco tipos de evento, sobrevivendo à re-projeção). Ele tem de nascer na **declaração** (`declararGolpe` / `declararNoTabuleiro`), viver em `acao`, e a folha tem de **ler** em vez de inventar |
| **o índice** | `golpeIndice` grava sempre 0, que é fiel ao que a mesa **aplica** e não diz **qual golpe** é | são **dois campos**, e confundi-los foi o erro: `golpeDaAgenda` (qual golpe da ação este é, de `an.offs` contra `tickDoGolpe`) e `penDadosUsado` (qual entrada de `penDados` a mesa de fato leu) |

**E a segunda mudança tem um efeito que vale por ela sozinha: com os dois campos separados, o defeito
8.1 vira MENSURÁVEL.** `golpeDaAgenda !== penDadosUsado` é a definição exata dele, contável por
lance, num despejo que já existe. Hoje ele é invisível no registro, porque o registro grava o número
que a mesa usou e não o que ela deveria ter usado.

**Falta também `tickDoGolpe` no registro**, que é de onde `golpeDaAgenda` se deriva e que o espelho
vai comparar de qualquer forma.

**O que isso não muda:** as entradas e saídas do contrato da P §2.1 continuam as mesmas, o
`resolverGolpe` continua com a assinatura que tem (ele já recebe `golpeIndice` e faz a coisa certa), e
os 1051 lances continuam válidos como oráculo de tudo o que eles cobrem. O que eles não cobrem é
justamente o que a mesa não faz.

**DECIDIDO em 02/09: o L11 e o L12 são uma cirurgia só**, e não dois itens. Os dois mexem no mesmo
caminho, de `declararGolpe` até a folha: o conserto do índice precisa passar o golpe até lá e o `aid`
precisa nascer na declaração, que é o mesmo trecho. Separá-los custa uma terceira recoleta dos 1051
lances. E o motivo melhor que o custo: **os dois campos novos são o instrumento que prova o conserto
do 8.1.** Feito junto, a recoleta já sai com `golpeDaAgenda === penDadosUsado` em todo lance, que é a
asserção do conserto; separado, conserta-se e não há como mostrar.

**E os dois campos ficam DEPOIS do conserto**, mesmo passando a ser sempre iguais. A igualdade vira
**invariante do harness**, ao lado dos treze da R3 §3.1, e volta a falar se alguém reintroduzir a
divergência. Campo que não muda mais só é ruído quando ninguém o lê; com asserção em cima, ele é uma
trava, pelo mesmo raciocínio da trava do `cobre`. **A asserção entra no mesmo commit do conserto**,
senão o campo nasce sem quem o leia, que é a condição de virar ruído.


### 8.3 · Por que os 1051 bateram, e o que a recoleta pós-conserto tem de forçar

A pergunta é justa e a resposta importa: a cópia aplica `penDados[golpeIndice]` e a mesa aplica
`penDados[0]`; se zero divergiram, ou a coleta não produziu o caso, ou produziu e a comparação não
olhou. **É a primeira, e por duas causas independentes. E há uma terceira que agrava as duas.**

**Causa 1: nenhuma folha foi aberta no Tick de um golpe que não fosse o primeiro.** O coletor abre a
folha adiada com `tickDoGolpe: (a.tick ?? 0) + an.preparo`, que é `offs[0]`. Os 44 lances da passada
"golpe adiado" são todos do **primeiro** golpe da agenda. O caminho da folha adiada foi coberto; o
caminho do golpe de índice maior que zero, não.

**Causa 2: o registro achata o índice.** `golpeIndice` grava sempre 0, porque é o que a mesa aplica.
Então a cópia é alimentada com 0 e devolve 0: **mesmo que a causa 1 fosse consertada sozinha, a
comparação continuaria batendo**, porque o registro não carrega a informação que exporia a
diferença. É exatamente por isso que os dois campos da §8.2 são o instrumento, e não um detalhe de
esquema.

**Causa 3, que agrava: a fixture não tem uma única rajada.** Medido nos 1051:

| | |
|---|---|
| manobras | `simples` 941 · `dupla` 110 · **`rajada` 0** |
| tamanhos de `penDados` | 1 (941) e 2 (110). **Nunca 3** |
| valores distintos de `penDados` | `(0)` e **`(−1, −1)`** |
| `golpeIndice` | 0 nos 1051 |

**E o `(−1, −1)` é o detalhe que fecha o argumento: a dupla não consegue expor o defeito nem em
princípio.** Os dois elementos dela são o mesmo número (`penDadosAmbasAsMaos` é verdadeiro), então
`penDados[0]` e `penDados[1]` dão o mesmo resultado e a divergência seria invisível mesmo com o
índice certo. **Só a rajada expõe**, porque a penalidade dela é acumulada: `[0, −1, −2]`, três
valores diferentes.

**Então a recoleta pós-conserto tem de FORÇAR rajada de três**, e com meta própria, senão o defeito
segue sem oráculo depois de consertado, que é a pior das situações: consertado e sem quem avise se
voltar.

**A lista completa das metas está na §9.5**, que acrescentou duas que faltavam aqui: a rajada com
arma de **teto 2** (haste ou pesada, onde `penDados` para de crescer) e o **`pvMax` com mais de um
valor**. E a asserção pelo **valor** contra a régua está na §9.6, porque a igualdade
`golpeDaAgenda === penDadosUsado` compara mesa com mesa e não pega a agenda errando o índice.

**O que a recoleta precisa fazer de diferente**, e são duas coisas, uma por causa:

1. **declarar rajada** (`manobra: 'rajada'`, `golpes: 3`, com arma de classe leve ou média, que são as
   de teto 3), em vez de `dupla`;
2. **abrir a folha em cada Tick da agenda**, e não só no primeiro: `tickDoGolpe` percorrendo
   `an.offs`, que é o que `resolverGolpeNoAr` faz quando o mestre clica no segundo cartão da faixa.

### 8.4 · Para que serve a coleta de 1051 lances

**Confirmado: ela é o oráculo da cópia da resolução, e nada além disso na conta principal.**

É a resposta ao preço do **Q6** (cópia, e não extração): a cópia precisa de um lugar contra o qual
rodar, e a lição do `lib-tempo.mjs` é que prosa não pega divergência. Os 1051 lances são o
comportamento real da mesa, com entradas, dados e saídas nomeadas.

**Ela NÃO é medição de gargalo, e é importante dizer por quê**, para ninguém a citar como se fosse:

- **não tem Tick.** Nenhuma linha sabe em que instante da batalha aconteceu;
- **não tem batalha.** As folhas foram abertas direto pelo coletor, uma por par, e **nada foi aplicado
  na cena**: ninguém perdeu Vida, ninguém caiu, nada terminou;
- **não tem parada, nem classe, nem gesto.** As três métricas do critério do D8b não têm de onde sair;
- **a ordem das folhas é do coletor**, e não da fila da cena.

**Duas outras coisas que ela É, e que são subproduto e não propósito:**

1. **um registro de regressão da resolução da mesa num commit.** Com o carimbo (§tarefa 6), ela é a
   única evidência do que a mesa calculava em `44578d0`. Se a mesa mudar, é contra ela que se compara
   para saber o que mudou;
2. **um instrumento de diagnóstico que já pagou.** Ela achou **três defeitos de mesa** que nenhum
   teste unitário pegava: o `resumoDe` descartando a armadura da ficha, o `rolarAcerto` usando
   `linhas[0]` em toda folha, e a própria confusão entre o que a tela mostra e o que a régua aplica
   no dano fora do acerto.

**E onde ela entra no caminho crítico** (decidido em 02/09, detalhado na §5.4): ela **não é
pré-requisito da batalha completa**, é pré-requisito de **confiar na cópia da resolução**, que é o
preço da decisão do Q6. Sem ela, o harness roda milhares de batalhas contra uma resolução que
ninguém conferiu, e todo número da bateria fica pendurado nisso. Não é etapa da sequência: é
validação que roda **uma vez por mudança na resolução**, e é o que autoriza a bateria a valer alguma
coisa.

---

## 9 · A disciplina de cobertura, e o critério de pronto de cada passo

Escrito em 02/09 para parar de descobrir buraco de cobertura um por vez. As três causas da §8.3, a
meta do teto da rajada e a asserção pelo valor são todas o mesmo erro repetido, e ele não é falta de
atenção: é **método**. Esta seção troca o método.

### 9.1 · O erro de método: as metas eram inventadas

Toda meta de cobertura que existe hoje nasceu de alguém olhar a fixture e reparar numa falta. Isso
tem duas consequências, e as duas já aconteceram:

- **acha o que se procura**, e as metas antigas mediam **armadura, condição e ferimento**, que são os
  três eixos do **dano e da Defesa**. Nenhuma media **manobra**, e nenhuma media coisa vinda da
  **agenda**. Os dois buracos conhecidos (a rajada que nunca apareceu e o índice do golpe achatado em
  zero) moram exatamente no eixo que ninguém estava medindo;
- **não escala.** Cada rodada acha mais um, e a rodada seguinte acha outro.

E a **causa 2** da §8.3 é de uma terceira espécie, que nenhuma meta de volume pega: ela é sobre o
**esquema** do registro, e não sobre o tamanho da fixture. **Um oráculo que não carrega o campo onde
o erro mora não melhora com mais lances.** Dez mil lances com `golpeIndice` achatado em zero provam
exatamente o mesmo que mil e cinquenta e um.

### 9.2 · A auditoria mecânica, e o que ela achou

Rodei o inventário de todo campo folha de `entrada`, com a contagem de valores distintos nos 1051.
É o mesmo tipo de varredura do `Math.random` do `test-acaso.mjs`, aplicado ao contrato em vez de ao
código.

**Campos com UM ÚNICO VALOR em 1051 lances:**

| Campo | Valor | Diagnóstico |
|---|---|---|
| `entrada.golpeIndice` | `0` | **conhecido**: é a causa 2 da §8.3, e o passo 3 o conserta |
| `entrada.alvo.pvMax` | `40` | **ACHADO NOVO, e é a mesma forma da causa 3** · ver abaixo |
| `entrada.perfil.*` (as 15) | `false` | **legítimo e declarado**: o motor não aplica bandeira nenhuma |
| `cobre` | `completo` | **legítimo e travado**: toda folha calcula acerto e dano, e a trava do teste cobra a declaração |

**O achado novo: `pvMax` é 40 nos 1051.** Ele importa porque o ferimento não sai da Vida, sai da
**fração**: `tierDe` calcula `pct = floor(cur / max × 100)` e procura a faixa. Com um denominador só,
as cinco faixas foram exercitadas todas no mesmo divisor, e **a divisão e o arredondamento nunca
foram exercitados**. Um alvo de `pvMax` 25 e outro de 80 põem a mesma Vida absoluta em faixas
diferentes, e a borda de cada faixa (76, 51, 26, 11, 1) cai em número quebrado. **Uma classe inteira
de caso sem um exemplar**, que é a definição da causa 3.

**E dois campos com dois valores só**, que valem nota e não meta: `condicoesDefesa` é `0` ou `−4`
(nunca positivo, e há condição que soma), e `manobra` é `simples` ou `dupla` (nunca `rajada`, que é
o que o passo 3 conserta).

### 9.3 · A regra que substitui as metas inventadas

**Toda entrada do contrato tem de ter pelo menos dois valores distintos na fixture, e toda entrada
com um valor só tem de estar numa lista de permitidos, com o motivo escrito.**

É a mesma forma que já funcionou duas vezes neste projeto: a varredura de `Math.random` em
`test-acaso.mjs` e a lista `LIGADAS_NO_MOTOR` em `test-bandeiras.mjs`. **A lista é a decisão, e a
varredura é o que torna o esquecimento impossível.** Quem acrescentar um campo ao contrato tem duas
saídas: dar dois valores a ele na coleta, ou vir à lista dizer por que ele é constante.

Concretamente, no `test-lance.mjs`:

```
UM_VALOR_SO = {
  'entrada.perfil.*'      · o motor não aplica bandeira nenhuma (test-bandeiras trava isso)
  'entrada.aid'           · é identificador, e variar é o normal dele
  'cobre'                 · toda folha calcula acerto e dano; a trava já cobra a declaração
}
```

E a varredura **falha** para qualquer outro campo folha que apareça com um valor só. Ela substitui
as metas por eixo: as metas continuam existindo para os casos em que **dois valores não bastam** (o
veredito precisa dos três, os eixos isolados precisam da combinação), mas o **piso** deixa de ser
inventado.

**O que isso teria pegado, se existisse antes:** `golpeIndice` (causa 2), `pvMax` (achado hoje), e
`manobra` teria passado com dois valores, o que mostra o limite honesto da regra: **ela pega campo
constante, e não pega valor que falta dentro de um campo que varia.** Para esse segundo tipo existe a
§9.4.

### 9.4 · A cobertura por RAMO, gerada da régua e não da imaginação

O que a varredura não pega é o ramo: `manobra` tem dois valores e mesmo assim falta a rajada; a
rajada tem teto por classe e mesmo assim falta o teto 2. **A lista de ramos não se inventa: ela se
lê do `regras.json`**, e é curta.

| Ramo | De onde sai | Estado |
|---|---|---|
| **manobra** · simples, dupla, rajada | `combate.rajada`, `combate.dupla` | **falta a rajada** |
| **teto da rajada por classe** · leve 3, média 3, haste 2, pesada 2 | `combate.rajada.teto` | **falta o teto 2**: só rajada de leve ou média nunca roda o corte do teto, que é onde `penDados` para de crescer |
| **`penDadosAcumula`** · verdadeiro hoje | `combate.rajada` | segue o valor da régua |
| **`penDadosAmbasAsMaos`** · verdadeiro hoje | `combate.dupla` | é o que faz `penDados` da dupla ser `(−1, −1)`, dois valores iguais, e por isso a dupla **não expõe** o defeito nem em princípio |
| **as seis faixas de ferimento** | `ferimentos` | cinco cobertas com um denominador só; ver `pvMax` na §9.2 |
| **as três saídas do Quase-Acerto** | `quaseAcerto` | cobertas, e por construção |
| **as quatro classes de arma** · leve, média, haste, pesada | `armas.json` | a bancada tem leve, média e pesada. **Falta haste**, e ela é alcançável pelo ajuste de instância (`dados.classe`) |

**A regra do ramo:** todo ramo que a régua escreve precisa de pelo menos um caso, e quando o ramo é
um **limite** (o teto), ele precisa de um caso **em cima e um abaixo dele**.

### 9.5 · As metas do passo 3, completas

Substituem a lista da §8.3, que estava incompleta em duas.

| Meta | Piso | Por que ela existe |
|---|---:|---|
| `manobra: 'rajada'` com `penDados` de tamanho **3** | 60 | é o único caso em que `penDados` tem valores **diferentes** entre si, e portanto o único que expõe o defeito |
| `manobra: 'rajada'` com arma de **haste ou pesada** (teto 2) | **30** | o teto é onde `penDados` **para de crescer**, e uma rajada pedida em 3 com arma pesada volta com 2 mais um aviso. Só rajada de leve ou média nunca roda esse corte. **A bancada já tem `pesada`** (`mon-aboleth`); `haste` sai do ajuste de instância |
| `golpeDaAgenda > 0` | 60 | o caminho que nunca rodou |
| `golpeDaAgenda === 2` (o terceiro golpe, penalidade −2) | 20 | o valor mais extremo da escada |
| `pvMax` com **pelo menos três valores** | 3 valores | o achado da §9.2: a faixa de ferimento é fração, e um denominador só nunca exercita a divisão |
| **invariante** `golpeDaAgenda === penDadosUsado` | 100% | a prova do conserto |
| **invariante pelo VALOR**, contra a régua | 100% | ver §9.6 |

**As duas mudanças que a recoleta exige**, uma por causa da §8.3:

1. **declarar rajada**, com `golpes: 3`, e em pelo menos uma passada com arma de teto 2, para o corte
   acontecer;
2. **abrir a folha em cada Tick da agenda**, percorrendo `an.offs`, e não só no primeiro, que é o que
   `resolverGolpeNoAr` faz quando o mestre clica no segundo cartão da faixa.

### 9.6 · A asserção pelo VALOR, que é diferente da asserção pela igualdade

`golpeDaAgenda === penDadosUsado` compara **mesa com mesa**: ela prova que a folha aplicou o índice
que a agenda mandou. **Ela não pega o caso em que a agenda calcula o índice errado e a folha o aplica
fielmente**, porque aí os dois campos concordam num número errado.

Então entra uma segunda, **contra a régua**, e ela é computada do `regras.json` e não do que a mesa
devolveu:

```
penDadosEsperado(classe, manobra, n):
  rajada · teto  = combate.rajada.teto[classe]
           k     = min(n, teto)
           pen   = combate.rajada.penDadosPorGolpeExtra        (−1 hoje)
           acum  = combate.rajada.penDadosAcumula              (verdadeiro hoje)
           → [i => acum ? pen * i : (i ? pen : 0)]              para i em 0..k−1
  dupla  · pen   = combate.dupla.penDados                      (−1 hoje)
           ambas = combate.dupla.penDadosAmbasAsMaos           (verdadeiro hoje)
           → [pen, ambas ? pen : 0]
  simples· → [0]

ASSERÇÃO: penDadosUsado === penDadosEsperado(...)[golpeDaAgenda]
```

**O caso que ela pega e a outra não:** numa rajada de três com espada longa, o `penDadosUsado` do
golpe de índice 2 tem de ser **−2**, lido da régua. Se a agenda passar a emitir `[0, −1, −1]` por um
erro em `anatomia`, a asserção da igualdade continua verde (a folha aplicou o índice 2, e a agenda
disse −1) e esta falha.

**E ela é a forma certa de escrever qualquer conferência de regra deste projeto**, que é a
generalização a guardar: *comparar a mesa com a mesa prova consistência; comparar a mesa com o
`regras.json` prova correção.* As duas juntas, sempre, porque cada uma pega o que a outra não pega.

### 9.7 · O critério de pronto de cada passo, escrito antes

Isto existe para os passos 4 a 10 não voltarem um por vez. Cada um tem a mesma forma que o passo 2
teve: **um oráculo, uma varredura e uma lista de permitidos.**

| Passo | O oráculo (contra o que se confere) | A varredura (o que não pode faltar) | Pronto quando |
|---|---|---|---|
| **3** · índice, `aid` e recoleta | a fixture nova, recolhida no mesmo commit | os campos folha com um valor só, mais os ramos da §9.4 | zero divergências, as sete metas da §9.5, e as duas asserções da §9.6 |
| **4** · o laço do Tick | **o espelho de motor**: a mesa dirigida no Edge contra a cópia, Tick a Tick, pelos campos da R3 §1.1.1 | toda **fase** do Tick (declaração, passo, resolução, fim) com pelo menos um Tick em que ela faz alguma coisa | zero divergências em N Ticks de uma cena fixa, **e não** os testes das peças passando (§5.2) |
| **5** · fim de batalha | os quatro motivos do `cena.fim.motivo` | os quatro motivos com pelo menos uma batalha cada, e a fração de `estourou` reportada | nenhuma batalha infinita, e o motivo dominante de cada célula escrito |
| **6** · o log | a taxonomia i/ii/iii da R2 §B, carimbada no código | as 14 paradas, cada uma com o carimbo no ponto certo, conferido à mão uma vez | toda parada emitida tem classe, e a soma das três dá o total |
| **7** · perfil de automação | a mesma semente nos dois perfis | **o invariante do consumo de acaso**: as duas execuções consomem a mesma quantidade de rolagens (P §7.3) | o par é um par, ou a classe iii rola dado e a taxonomia está errada ali |
| **8** · cena e elenco | os arquétipos passam por `resumoCombatePC` sem tratamento especial | cada arquétipo com o passo, o alcance e a classe conferidos contra o catálogo | os dois arquétipos e os três tamanhos montam sem número inventado além dos declarados |
| **9** · invariantes e agregador | os quatro invariantes, em memória | batalha que viola vai para balde próprio e **não entra em média nenhuma** | a fração de batalhas inválidas é reportada na primeira linha |
| **10** · a bateria | o piloto, com a regra de decisão escrita antes de rodar | as doze células, e o `n` que sai do piloto | os números saem com a etiqueta de procedência (`dado`, `derivado`, `inventado`) |

**A regra geral, que é o que sobra se tudo isto for esquecido:** *nenhum passo está pronto porque as
peças dele passam. Ele está pronto quando existe alguma coisa fora dele que discorda quando ele
erra.*

### 9.8 · O que continua sendo decisão sua, e não minha

Para ficar claro o que este planejamento **não** decidiu:

- **as cinco pendências de desenho da bateria** que o pedido do passo 1 listou e mandou não executar
  (o par de perfis redundante, o eixo de ciclo confundido com arma, o `fim_motivo` correlacionado com
  a distância, a fração de classe iii superestimada pela política, e as bandeiras ligadas). As cinco
  continuam abertas, e a quinta foi resolvida em 02/09 (todas nascem desligadas);
- **se o `haste` vale uma passada própria** ou se `pesada` basta para o teto 2. Eu diria que
  `pesada` basta e o `haste` é barato o suficiente para entrar junto, mas o piso de 30 é sobre o
  **teto**, e não sobre a classe;
- **quando o espelho de motor é escrito**, que é o que separa o passo 4 de ter critério de pronto ou
  não ter nenhum.

---

## 10 · O harness, feito, e a primeira bateria rodada

Feito em 02/09. Os passos 3 a 10 da sequência da §5.1 estão entregues, e a
bateria mínima rodou: **6.000 batalhas em 53 segundos**.

### 10.1 · O que existe agora

```
scripts/sim/
  lib-ponte.mjs     empacota src/lib UMA vez por processo, com esbuild
  cena.mjs          os dois arquétipos e as doze células
  motor.mjs         o laço do Tick: as cinco fases, e as paradas com classe
  log.mjs           o registro em memória, e o resumo de uma batalha
  invariantes.mjs   os quatro que pegam erro de motor
  rodar.mjs         um processo, uma faixa de batalhas
  bateria.mjs       reparte em processos (fork) e escreve o manifesto
  agregar.mjs       as três tabelas do relatório
```

`npm run bateria` roda, `npm run agregar` lê.

### 10.2 · As decisões desta passada

**D12 · O par de perfis do D1 é redundante, e sai.** A decisão 1c mandava rodar
cada batalha duas vezes com a mesma semente, uma com as paradas de classe iii
resolvidas pelo motor e outra consultando, e ler a diferença. **Se a classe iii é
aritmética e aritmética não rola dado, as duas execuções são idênticas**: o
motor resolve a mesma coisa, e a única diferença é se a parada é CONTADA. Então
a diferença já está no campo `paradas {i, ii, iii}` de uma execução só, e as
6.000 execuções extras não comprariam nada. **Fica uma execução, e a leitura do
D1 é a fração de iii.** O invariante do consumo de acaso (P §7.3) continua
valendo como conferência da premissa: se alguma parada de classe iii rolar dado,
ela não é classe iii e a taxonomia está errada ali.

**D13 · O elenco sai da régua, e não da minha cabeça.** A primeira versão do
`cena.mjs` inventava os números de combate, e o resultado apareceu na primeira
execução: uma batalha 1v1 levava 568 Ticks porque a Absorção inventada (7) era
maior que o dano médio inventado (6,5), e quase nenhum golpe passava. Os dois
arquétipos passaram a ser **fichas**, resolvidas por `resumoCombatePC` a partir
da ficha de referência do contrato ficha↔mesa, com o equipamento trocado. O que
resta ⚑ são os traços (atributos e perícias), porque um gerador de personagem
não existe. **Número inventado não é só uma etiqueta no relatório: ele produz um
jogo que não existe.**

**D14 · A célula uníssona não resolve, e isso é o achado, não o defeito.** Com
os números da régua, **Escudeiro contra Escudeiro empata**: bolo `3d6+2 +3` (~13)
contra Defesa 16, e dano `1d6 +3` (~6,5) contra Absorção de corte 7. As 3.000
batalhas uníssonas estouram o teto de 2.000 Ticks, todas. **Isso é o Grid de
hoje, com as quinze bandeiras desligadas**, e é exatamente o que a `margem` e o
`bloqueio` existem para consertar. Não se ajusta o elenco para a batalha
terminar: ajustar seria escolher o elenco que produz o número desejado.

E o D8b se prova aqui, de graça: **as métricas por Tick sobrevivem à batalha que
não termina** (dois mil Ticks de carga real), e só as por batalha ficam sem
sentido. A régua que diz "a duração é multiplicador e não critério" era a única
que deixava esta bateria valer alguma coisa.

**D15 · O tempo é derivado, e a batalha é um processo.** A semente de cada
batalha é `hash32(semente_mestre, celula, repeticao)`, então a batalha 743 é
reproduzível sem depender de nenhuma anterior. E a repartição é por **processo**
(`child_process.fork`), nunca por linha de execução: o `acaso.ts` guarda a fonte
num `let` de módulo, e duas batalhas no mesmo processo dividiriam a sequência em
silêncio.

### 10.3 · A primeira bateria, e o que ela diz

`6.000 batalhas · 0 inválidas · 3.000 estouraram o teto (as uníssonas)`

**A carga, por célula** (as principais, por etapa):

| célula | par/Tick | p90 | pico | gestos/golpe | s/parada | s/resolução | tempo morto |
|---|---:|---:|---:|---:|---:|---:|---:|
| uníssono · encostado · 1v1 | 1,14 | 4 | 4 | 4,00 | **0,71** | 0,86 | 2,00 |
| uníssono · encostado · 3×3 | 3,43 | 12 | 12 | 4,00 | **0,71** | 0,86 | 2,00 |
| uníssono · encostado · 2×8 | 9,15 | 32 | 32 | 4,00 | **0,71** | 0,86 | 2,00 |
| uníssono · longa · 2×8 | 11,68 | 24 | 32 | 8,19 | **0,00** | 0,71 | 2,01 |
| coprimo · encostado · 1v1 | 1,08 | 2 | 4 | 4,12 | **0,49** | 0,74 | 2,52 |
| coprimo · encostado · 3×3 | 3,05 | 6 | 12 | 4,29 | **0,46** | 0,73 | 2,55 |
| coprimo · encostado · 2×8 | 7,64 | 16 | 32 | 4,43 | **0,43** | 0,69 | 2,55 |
| coprimo · longa · 2×8 | 7,80 | 15 | 32 | 7,64 | **0,08** | 0,47 | 4,06 |

**A composição, que é a tabela que responde a pergunta:**

> **A fração de classe iii fica entre 39% e 57%**, contada só nas batalhas que
> **terminam**, e a banda é o piso e o teto da taxonomia: no piso a re-projeção
> conta como **ii** (a R2 §B registra que o mestre reordena a fila à mão ali, e
> reordenar não é aritmética); no teto ela conta como **iii**.

**Duas coisas que essa forma conserta, e a primeira era um erro de leitura sério.**

**O 59,9% da primeira versão estava computado sobre as 6.000 batalhas, metade das
quais nunca termina.** A composição de paradas de um impasse de 2.000 Ticks é
dominada pela fase de impasse, que não é jogo. Separadas, a fatia que termina dá
39% a 57% e a que estoura dá 40% a 60%: **as duas diferem em 2,8 pontos**, e essa
proximidade é robustez de graça, mas o número que se publica é o das que terminam.

**E o número saía com quatro casas sobre um carimbo que eu mesmo chamei de o
ponto mais frágil.** A banda é a forma honesta: se a conclusão sobrevive ao piso,
ela vale independentemente do carimbo, e sobrevive.

A fração **sobe com a distância**: nas células de 2×8 longa ela vai a 70% e 75%
no teto, porque a re-projeção acontece a cada Tick de viagem, para cada
perseguidor. **É justamente a parada duvidosa que sobe**, o que faz da banda o
único jeito honesto de ler essas duas células.

**Seis coisas que a bateria já respondeu:**

1. **de que classe é a carga**: seis em cada dez paradas são conta, e conta é
   automatizável. Automação é a resposta certa para o problema;
2. **quanto ela compraria**: as mesmas seis em cada dez, e mais nas cenas de
   perseguição;
3. **onde o gargalo está: nos DOIS, e a primeira versão desta linha estava
   errada.** Ela dizia "na travessia, e não na caixa", lendo os 0,47 a 0,86 como
   cliques que não produzem nada. **Eles produzem escrituração**, que é a classe
   que a automação tira: o `s/resolução` conta o Tick em que nada CAIU, e o Tick
   em que ninguém foi consultado é o `s/parada`, que é outro número. Os dois nem
   cabiam juntos, e foi assim que o erro apareceu: com 86% de Ticks sem parada e
   pico 4, a média não passaria de 0,56, e ela é 1,14.
   **A leitura corrigida:** entre 43% e 71% dos Ticks não consultam ninguém, e
   entre 47% e 86% não resolvem nada. A diferença entre as duas colunas **é** o
   Tick que só tem escrituração, e é ali que a automação compra mais;
4. **total ou pico**: o pico bate no **teto teórico** (o número de peças × 2) em
   toda célula de 2×8. A fila empilha, e empilha até o limite;
5. **a colisão de agenda faz o pico**: no uníssono o p90 **é** o pico (12 e 32);
   no coprimo o p90 fica na metade dele. É a previsão da §3, confirmada;
6. **a duração**: as células coprimas fecham em **41 a 74 Ticks**, dentro dos 37
   a 47 que a R2 §D1 mediu na bancada, em outro sistema e sem mapa. **A cópia
   produz batalhas do tamanho certo**, que é a primeira evidência independente de
   que o laço não está absurdo.

**E o que ela não diz**, escrito para ninguém citar de menos: nada sobre quanto a
política pesa (roda uma só), nada sobre o que as regras novas mudam (nenhuma
ligada), e nada sobre segundos, porque um gesto por parada é a etiqueta provisória
até a tabela de custo de tela existir.

### 10.4 · A conta do Tick sem resolução, antes de suspeitar do laço

A pergunta era se os 0,86 de Ticks sem resolução no uníssono encostado eram o
ciclo da arma ou defeito. **A conta decide, e ela decide diferente em cada
tamanho de cena.**

`cadência = 1 − golpes por Tick` é o teto de Ticks sem golpe se nunca caíssem
dois no mesmo Tick. A **sobra** é o que a cadência não explica.

| célula | s/resolução | cadência | sobra |
|---|---:|---:|---:|
| uníssono · encostado · 1v1 | 0,86 | 0,71 | **0,14** |
| uníssono · encostado · 3×3 | 0,86 | 0,14 | **0,72** |
| uníssono · encostado · 2×8 | 0,86 | 0,00 | **0,86** |
| coprimo · encostado · 1v1 | 0,74 | 0,74 | **0,00** |
| coprimo · longa · 1v1 | 0,74 | 0,76 | **−0,03** |
| coprimo · longa · 2×8 | 0,47 | 0,00 | **0,47** |

**No 1v1 a cadência explica tudo, e não sobra nada para investigar.** Duas peças
de ciclo 6 e 7 dão um golpe a cada três Ticks, e dois terços de Ticks sem golpe
saem daí sem defeito nenhum. A sobra é 0,00 e 0,14, que é ruído de arredondamento.

**Nas cenas grandes a sobra é enorme, e ela não é defeito: é a COLISÃO.** Com
seis ou dezesseis peças, `golpes/Tick` passa de 1 e a cadência prevê zero Ticks
sem golpe; e ainda assim 86% dos Ticks não resolvem nada. Isso só é possível se
os golpes se **empilham** nos mesmos Ticks, que é exatamente o que o pico bater
no teto teórico (32 = 16 peças × 2) já dizia. **É a previsão de E1 confirmada por
um segundo instrumento**, e por um caminho que não passa pelo pico.

E ela tem consequência de mesa, que é o que a bateria existe para achar: a carga
não chega distribuída, chega em **rajadas de caixas**, com longos trechos de
clique vazio no meio.

### 10.5 · O que continua faltando, e é honesto dizer

- **o espelho de motor, e ele passou a ser um bloqueio e não uma pendência.** O
  laço não foi comparado com a mesa Tick a Tick, e é ele quem prova a ORDEM das
  operações. As peças passam e isso não é o laço estar certo (§5.2).

  **DECIDIDO em 02/09: nada da tabela da §10.3 sai deste documento nem vira
  decisão sobre o Grid antes de o espelho rodar.** Os números têm exatamente a
  aparência de um laço plausível e errado, e esta rodada já mostrou duas vezes o
  quanto essa aparência é barata: o D13 (números inventados produzindo 568 Ticks)
  e o erro de leitura do Tick vazio, que inverteu uma conclusão inteira e passou
  por uma revisão sem ninguém notar até a aritmética não fechar.

  **O que o espelho precisa, e é o que falta construir:** a mesa tem de rodar a
  MESMA cena que o harness, e hoje ela roda a cena do `mesa-mock`, com doze peças
  em posições fixas. É preciso um caminho para o mock aceitar uma célula da
  bateria (as peças, o mapa, a distância inicial), e aí a comparação é a da
  R3 §1.1.1, Tick a Tick, com a mesma semente.
- **a tabela de custo de tela**, que converte parada em clique;
- **o `aid` no caminho das criaturas**, que o elenco de dois PCs não exercita;
- **as cinco políticas**, a grade de 112, o elenco de sete e as criaturas: tudo
  isso é a bateria seguinte, e a §4 já dizia que não entrava nesta.
