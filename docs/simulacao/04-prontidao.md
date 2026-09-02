# Prontidão · o plano mede o que queremos?

Sobre o commit `84f9c9f`. Nada implementado nesta rodada. Verifica se cada métrica tem dado que a
sustente, se cada eixo é manipulável e separável, e o que ainda falta decidir.

Documentos citados: **R1** = `00-diagnostico.md`, **R2** = `01-diagnostico-carga.md`,
**P** = `02-projeto-harness.md`, **R3** = `03-respostas.md`.

---

## A · Cada métrica é mensurável?

Coluna **fonte**: `M` = medido pelo motor · `D` = **entrada declarada** (a tabela de custo de tela,
que é leitura de código e não medição) · `P` = parâmetro de leitura (não muda a batalha, muda a
atribuição). Coluna **campo**: ✔ existe no desenho da §2.5 · ✘ precisa ser criado.

### A.1 As doze métricas da §2.6

| Métrica | Dado bruto · campo | Campo | Fonte | Responde | **Não** responde |
|---|---|---|---|---|---|
| **Paradas por batalha**, total e por classe | eventos `parada`, agrupados por `b` e por `classe` | ✔ | M | quantas vezes o jogo para numa cena | quanto tempo cada parada custa |
| **Paradas do mestre por Tick** | `parada` com `quem = 'mestre'`, agrupado por `t` | ✔ | M + **P** (`quem` depende do perfil E8) | com que frequência o jogo para | se a frequência é sentida como atrito |
| **Pico de paradas num Tick** | máximo da anterior, por batalha | ✔ | M | se a fila empilha, e quanto | o pior caso teórico (o máximo de uma amostra cresce com n) |
| **Gestos do mestre por batalha e por golpe** | `Σ parada.gestos` | ✔ | **D** | quantos cliques custa um golpe, **na régua da tabela de tela** | quantos cliques custa de verdade, se a tabela estiver errada |
| **Fração dos gestos que é do mestre** | `Σ gestos` por `quem` | ✔ | **D** + P | se o mestre compõe o jogo dos outros | idem |
| **Tempo morto do jogador, em Ticks** | do `decl` de uma ação ao `dano` do primeiro golpe **dela** | **✘** | M | quanto o jogador espera | nada, hoje: **não há como ligar o `dano` ao `decl` que o originou** (§A.3) |
| **Ticks por batalha** | `cena.fim.t − cena.inicio.t` | ✔ | M | o multiplicador de toda a carga | |
| **Fração de Ticks vazios** | Ticks com evento `passo` e nenhum `golpe.resolve` | ✔ | M | se o mestre clica ⏭ para nada | se o Tick vazio incomoda ou é respiro |
| **Adiamentos por ação e maior deslize** | `reproj.acumulado`, `golpe_depois − golpe_antes` | ✔ | M | o que acontece com a perseguição que não fecha | |
| **Fração de batalhas que não terminam** | `cena.fim`, pelo motivo | **✘** | M | quantas perseguições nunca fecham | nada, hoje: **`cena.fim` não tem campo de motivo** (§A.3) |
| **Colisão de agenda, N(T)** | contagem de `golpe.vence` por `t` | ✔ | M | valida a forma fechada da R2 §H1 | |
| **Fração dos golpes em Tick múltiplo de 6** | `t % 6` sobre `golpe.vence` | ✔ | M | a sincronia das oito fontes da R2 §H3 | |

### A.2 As seis métricas que vivem fora da §2.6, e que ninguém somou

A §0.45 (a folga da perseguição) e a §0.7 (a reserva de Mana) criaram métricas que a §2.6 não lista.
Elas contam, e é aqui que a maior parte dos buracos está.

| Métrica | Onde foi criada | Dado bruto | Campo | Fonte |
|---|---|---|---|---|
| Fração dos golpes que caem **no Tick da chegada** | §0.45 | precisa saber que a peça chegou ao alcance naquele Tick | **✘** | M |
| Tempo morto separado entre **quem perseguiu e quem já estava no alcance** | §0.45 | o `decl` teria de dizer se houve viagem | **✘** | M |
| Taxa de acerto dos **dois grupos** | §0.45 | `golpe.resolve.veredito` cruzado com o marcador acima | **✘** | M |
| Tick em que o conjurador cruza **30% e zero de Mana** | §0.7 | não há evento de recurso nenhum | **✘** | M |
| Fração das batalhas em que o conjurador **termina esvaziado** | §0.7 | idem | **✘** | M |
| Quantas ações ele passa **como lutador de adaga** | §0.7 | o `decl` teria de dizer o tipo de ação | **✘** | M |

### A.3 As métricas que hoje não têm dado que as sustente

**Nove**, e a causa se concentra em três buracos, não em nove.

**Buraco 1 · o evento `decl` não tem campos próprios.** A §2.5 especifica os campos de
`golpe.resolve`, `passo`, `reproj` e `dano`, e **não especifica um único campo de `decl`**, que é o
evento de que cinco métricas dependem. Ele precisa, no mínimo, de: a manobra, o alvo, se houve
viagem e de quantos Ticks, o modo de deslocamento, o Tick do golpe agendado e o tipo de ação (atacar,
mover, conjurar, abortar, esperar, outra). Sem isso não existem as três métricas da folga nem a
contagem de ações do conjurador.

**Buraco 2 · não há identificador de ação.** `decl`, `golpe.vence`, `golpe.resolve`, `reproj` e
`dano` não carregam nada que ligue um ao outro. Ligar por `(cid, ordem de aparição)` funciona
enquanto uma peça tem uma ação por vez, e quebra em silêncio na rajada (três golpes da mesma ação) e
em qualquer cena com re-projeção. **O tempo morto do jogador, que é uma das métricas centrais, é
calculável errado sem alarme nenhum.** A correção é um `aid` (identificador de ação) nascido no
`decl` e repetido em todos os eventos que descendem dele.

**Buraco 3 · não há evento de recurso, nem motivo de fim.** `cena.fim` precisa do motivo (sem
ninguém de pé · fuga consumada · desistência a 20% · `estourou`), senão a "fração de batalhas que não
terminam" não distingue as quatro. E a Mana, a Energia e o Fôlego não têm evento: como o Fôlego ficou
de fora (§0.7) e a Energia não é gasta por nada (R1 §5), sobra a **Mana**, que é gasta de verdade
(`gastarMana`, `artes-grid-mesa.ts:741`) e que sustenta três métricas.

**Um quarto ponto, menor:** o `parada.classe` é declarado a partir da tabela da R2 §B, e não medido.
Não é problema (a classificação é estável), mas a etiqueta vale: quando o relatório disser "6 das 14
paradas são aritmética", isso é uma leitura de código de 02/09, não um resultado da bateria.

---

## B · Cada eixo é manipulável e separável?

### B.1 Eixo a eixo

| Eixo | Manipulável no gerador? | Confundido com | Gravidade |
|---|---|---|---|
| **E1 · ciclos** | sim, é escolher armas | **dano e Preparo**, ver §B.2 · e **alcance** no nível (d), já registrado | **alta** |
| **E2 · distância inicial** | sim, é posicionar | **modo de deslocamento e Defesa**, ver §B.2 | **alta** |
| **E3 · tamanho da cena** | sim | ocupação do tabuleiro: mais peças vetam mais casas, e o caminho fica mais longo (`ocupadoPor`) | média |
| **E4 · assimetria de passo** | sim, é escolher raça e armadura | **armadura e raça**, logo Absorção e penalidade física, ver §B.2 | **alta** |
| **E5 · perfil de regras (18)** | só depois de as bandeiras existirem | as bandeiras entre si (o deixe-uma-de-fora é cego a interação, já registrado) · e **`n1` desloca o próprio E1**, ver §B.2 | **alta** |
| **E6 · política (5)** | sim, é código | **o elenco**, se cada política rodar sobre uma ficha diferente. O Conjurador é a exceção que não tem como evitar | média |
| **E7 · obstáculo** | no harness sim; **na mesa não existe ainda** (a parede é L1 do `Pendencias.md`) | linha de visão, que não existe e fica declarada como limitação | baixa |
| **E9 · leitura** | sim, é uma bandeira da política | **E6**: só três das cinco políticas leem alguma coisa, e na âncora (Agressiva) o eixo é quase inerte | **alta** |
| **E10 · quem entra no meio** | sim, mas **exige que haja peça entrando**, e a âncora não tem nenhuma: o eixo é **inerte na âncora** | E9, de propósito (está nos cruzamentos) | **alta** |
| E8 e D1 (não custam célula) | pós-processamento do mesmo log | nada | nenhuma |

### B.2 Os confundimentos que ainda não estavam nomeados

**E1 está confundido com dano e com Preparo, e isso é do catálogo, não do desenho.** Os quatro
períodos não existem soltos: no `armas.json`, o ciclo 5 é a classe **leve** (1 dado de dano, Preparo
0), o 6 é a **média** e a **haste** (1 dado, Preparo 1 ou 2) e o 7 é a **pesada** (2 dados, Preparo
2). Então a diferença entre o nível uníssono (espada longa × espada longa) e o coprimo (espada longa
× montante) **não é só o m.m.c.**: é também o dobro de dano de um lado e um Preparo a mais. Um efeito
atribuído a "diversidade de ciclos" pode ser efeito de dano. **Não há como separar com o catálogo
real**; separar exigiria armas inventadas com ciclo variável e dano fixo, o que mediria um jogo que
não existe. Vai para o D.

**E2 está confundido com o modo de deslocamento, e portanto com a Defesa.** Distância longa faz a
política escolher Corrida, e a Corrida custa **−4 de Defesa** (`MODOS_MOV`, e a frase da caixa em
`grid.astro:5148`). Então "distância inicial maior" traz junto "guarda mais aberta na chegada", e o
efeito medido no eixo E2 é a soma dos dois. É o mesmo mecanismo que a §0.45 já usa para medir a folga
da perseguição, e ali é intencional; como eixo isolado, é confundimento.

**E4 está confundido com armadura e raça.** O passo sai de `deslocamento()`, que come a fração da
raça e metade da penalidade da armadura. Um lado 2× mais rápido é, na prática, um elfo de couro
contra um orc de placa: junto com o passo vêm **6 pontos de Absorção de diferença** e a penalidade
física no acerto e na Defesa. O eixo mede "rápido e frágil contra lento e duro", que é uma coisa real
do jogo, mas não é "assimetria de passo".

**`n1` desligada desloca o eixo E1 inteiro.** Com `decideEmValeDepois = 1`, o período entre golpes
volta a ser `ciclo + 1`, e os m.m.c. mudam todos: o par adaga × espada longa vai de 5 e 6 (m.m.c. 30)
para 6 e 7 (m.m.c. 42), e o par que colide mais deixa de ser o mesmo. **A célula "n1 desligada" do
deixe-uma-de-fora não é comparável à âncora no eixo E1**, porque os dois níveis de E1 significam
coisas diferentes nas duas. Isso é diferente das outras quinze bandeiras, que mudam número dentro de
uma estrutura fixa.

### B.3 A célula-âncora não serve como está

> **Superada em 02/09.** As âncoras são duas (D1), as duas carregam peça entrando no meio e as
> duas rodam política que lê. O que faltava e foi resolvido no `05-fechamento.md` §2.1 e §2.2: o
> **nível** de E10 em que a âncora se senta ("declara no Tick seguinte"), a regra de leitura do
> Agressivo, que estava decidida e não aplicada, e o E4 definido por raça e armadura em vez de por
> arquétipo. A âncora valendo é a da `02` §0.10.1.

A âncora é: 3×3, **E1 uníssono**, E2 média, campo aberto, política Agressiva, com leitura, quem entra
no meio declarando no Tick seguinte, perfil cheio. Três problemas, e o terceiro é o pior:

1. **E1 uníssono é o pior caso de colisão**, e não um caso mediano. Pela R2 §H1, peças de mesmo ciclo
   e mesma entrada colidem em **todos** os golpes. Uma âncora extrema satura: se o pico de paradas na
   âncora já é igual ao número de peças (o teto teórico da R2 §H4), mexer em E4, E7 ou E10 não move
   nada, e o efeito principal de cada um sai nulo **por efeito de teto, e não por não existir**.
2. **E9 é quase inerte na âncora**, porque a política Agressiva tem uma única regra de leitura (a
   troca de alvo quando outro aliado já vai bater no mesmo). Medir "quanto vale ver" a partir do
   perfil que menos usa o que vê é medir o piso.
3. **E10 é totalmente inerte na âncora**, porque a âncora não tem peça entrando no meio da cena. O
   eixo tem três níveis e os três produzem a mesma batalha. **Duas das 26 células de um fator de cada
   vez seriam idênticas à âncora.**

---

## C · Do log até "o Grid é fluido e o mestre trabalha X"

### C.1 O que você vai poder afirmar, e o que não

| Ao fim da bateria você poderá dizer | Não poderá dizer |
|---|---|
| quantas vezes o jogo para por batalha e por Tick, e o pico | quantos **segundos** qualquer coisa leva |
| quantos Ticks o jogador espera entre declarar e ver o efeito | se essa espera é sentida como longa |
| que fração das paradas é aritmética que o motor podia fazer | se automatizar essa fração deixaria a mesa mais leve **de fato** |
| quanto cada uma das 16 regras muda a duração da batalha e a carga | se alguma delas deixa o jogo mais divertido |
| se a fila empilha, com que frequência e até onde | se dez folhas seguidas cansam mais que dez espalhadas (é o que N5 não mede, §0.10.3) |
| se a perseguição fecha, e em que fração das batalhas não fecha | |
| quantos gestos, **na régua da tabela de custo de tela** | quantos gestos de verdade, se a tabela estiver errada |
| que a horda uníssona é ou não o pior caso previsto pela forma fechada | |

**Os dois fatores que faltam para converter em segundos** são o tempo humano por gesto e a latência
real do Supabase. O primeiro não tem instrumento de código nenhum; o segundo foi adiado por decisão
(§0.7 e §4 do P). Sem eles, a frase final da bateria é **"o mestre é consultado N vezes por batalha,
com pico de M num Tick"**, e não "a cena leva X minutos".

### C.2 O que cai se a tabela de custo de tela estiver errada

A tabela dá `campos`, `editaveis` e `gestos` por parada, lida de `CAMPOS_ATQ`/`CAMPOS_ALVO`
(`grid.astro:7718-7745`) e da contagem da R2 §C3.

| Conclusão | Cai? |
|---|---|
| "o mestre é consultado N vezes por batalha" | **não**: é contagem de eventos `parada`, independente da tabela |
| "o pico é M paradas num Tick" | **não** |
| "a regra X encurtou a batalha em Y%" | **não** |
| "custa 5 gestos do caminho curto e 19 do longo" | **sim, inteira** |
| "automatizar as 6 paradas de aritmética economiza Z% dos gestos" | **sim** |
| "a fração dos gestos que é do mestre é F" | **sim**, e é a métrica que mais depende dela |

**Metade das métricas sobrevive a uma tabela errada e metade não**, e a linha divisória é limpa:
tudo que **conta paradas** sobrevive, tudo que **pesa paradas** cai. Uma tabela errada por um fator
constante preserva as comparações relativas entre células e destrói os números absolutos.

### C.3 O que mede a política e não o sistema

| Conclusão | Depende da política |
|---|---|
| taxa de vitória de qualquer lado | **inteiramente** |
| "quanto vale ver as declarações" (E9) | **inteiramente**: mede a qualidade das minhas cinco regras de leitura, não o valor da informação (R3 §2.3) |
| tempo morto do jogador | **muito**: depende de quando a política declara e de quanto ela persegue |
| paradas por batalha | **muito**: a política decide quantas ações acontecem e de que tipo |
| duração da batalha | **muito** |
| pico de paradas num Tick | **pouco**: o pico vem da congruência dos ciclos (R2 §H1), que é estrutural |
| N(T) e a fração em Tick múltiplo de 6 | **quase nada**: é aritmética de agenda |
| adiamentos por ação | **médio**: quem persegue e quem não persegue é regra de política |

O grupo de baixo é o que sobrevive a trocar a política inteira, e é também o que a §5 do P já dizia
ser mensurável **sem dano nenhum**, com o simulador de fila. Isso não é coincidência: é a mesma
fronteira.

---

## D · O que ainda falta decidir

Ordenado por: bloqueia o começo primeiro, depois por quanto muda o resultado.

---

### D1 · A célula-âncora, que hoje é um caso extremo · **bloqueia o começo**

> **RESPONDIDO: duas âncoras**, uma mediana e uma extrema, com cada fator medido nas duas. É a
> opção que resolve o contra-argumento da recomendada, ao custo de dobrar o braço de um fator de cada
> vez. A grade recontada está na §0.10.1 do 02.
> **Consequência recontada em 02/09** (`05-fechamento.md` §2.4): a grade não ficou em 107 células.
> Sete das dezessete comparações de bandeira não podiam morder na âncora, e medi-las nas duas gastava
> catorze células para colher zero. Com cada bandeira medida na célula em que morde, com o eixo E11
> (elenco de criatura, D10) e com as duas âncoras diferindo em **exatamente** um fator, a grade
> oficial é de **109 células** e **54.500 batalhas** (`02` §0.10.1), depois da segunda leitura que o
> F5 pediu.


**A pergunta:** a âncora de onde pendem as 26 comparações de um fator de cada vez continua sendo
E1 uníssono, ou passa a ser um caso mediano?

| Resposta | Consequência |
|---|---|
| **Âncora mediana** ⭐ **RECOMENDADA** | E1 no nível (b), colisão curta (adaga × montante, m.m.c. 24), E3 em 3×3, E2 média, e a âncora ganha **uma peça que entra no meio** e uma política que lê. Os efeitos de E4, E7, E9 e E10 passam a ter espaço para aparecer |
| Âncora uníssona, como está | mede o efeito de cada fator no pior caso de colisão. Defensável se o interesse for o pior caso, e arriscado por saturação: efeito nulo indistinguível de efeito ausente |
| Duas âncoras | uma mediana e uma extrema, e cada fator medido nas duas. Custa **mais 26 células** (105 no total) e responde "o efeito de X depende de a cena ser extrema?" |

**Por que a recomendada:** o desenho de um fator de cada vez pressupõe que a âncora esteja no meio do
espaço, não na borda. Com a âncora uníssona, dois dos dez eixos (E9 e E10) são inertes nela **por
construção**, o que significa que duas das comparações não medem nada, e um terceiro (E4) provavelmente
satura. Não é ajuste fino: é um quarto do desenho não funcionando.

**O argumento mais forte contra:** o uníssono é o caso mais comum de mesa de verdade. Meia dúzia de
goblins iguais com o mesmo ataque é a cena que todo mestre roda, e o bestiário confirma (159 das 309
criaturas atacam com ataque leve; uma horda do mesmo bicho golpeia em uníssono para sempre, R2 §H3).
Uma âncora mediana mede um jogo mais bem-comportado do que o que se joga, e os efeitos que ela
mostrar podem sumir na cena real. A resposta honesta a isso é a terceira opção, e ela custa o dobro.

---

### D2 · Os três buracos do log · **bloqueia o começo**

> **RESPONDIDO: os quatro campos, mais um invariante.** O `decl` ganha campos próprios, entra o
> identificador de ação, o `cena.fim` ganha motivo e nasce o evento de recurso; e o identificador
> ganha asserção própria (**V15**: todo evento de dano tem um `decl` ancestral na mesma batalha), que
> é o que impede o modo de falha do contra-argumento.


**A pergunta:** o log ganha os campos que faltam (o `decl` especificado, o `aid` de ação, o motivo do
fim de batalha e o evento de recurso), ou nove métricas ficam de fora?

| Resposta | Consequência |
|---|---|
| **Ganha os quatro** ⭐ **RECOMENDADA** | as nove métricas da §A.3 passam a existir. Custa quatro acréscimos ao esquema da §2.5, e um deles (`aid`) atravessa cinco tipos de evento |
| Ganha só o `aid` e o motivo do fim | salva o tempo morto e a fração que não termina, que são as duas centrais. Perde as três da folga (que foi decidida como "medir", §0.45) e as três da Mana (que foi decidida como teste, §0.7) |
| Não ganha nada | as nove métricas saem do plano, e com elas duas decisões suas viram letra morta |

**Por que a recomendada:** o custo é de esquema, não de arquitetura, e a alternativa contradiz duas
decisões já tomadas. A folga da perseguição foi decidida como "não decido antes de ver número"; sem o
marcador de chegada **não haverá número**. A Mana virou um teste declarado; sem evento de recurso
**não haverá teste**.

**O argumento mais forte contra:** o `aid` é o único que não é acréscimo trivial. Ele obriga o motor
a carregar identidade de ação por cinco tipos de evento e a mantê-la através da re-projeção, que
reescreve a agenda. É exatamente o tipo de campo que se implementa errado em silêncio, e o erro
aparece como um tempo morto plausível e falso. Se ele entrar, precisa de um invariante próprio (todo
`dano` tem um `decl` ancestral no mesmo `b`), o que empurra o V14 a ganhar um irmão.

---

### D3 · O critério de aceitação da §0.6.1 · **bloqueia o começo**

> **RESPONDIDO: build verde, mais o teste-espelho, mais as provas item a item.** Fica registrado o
> que a escolha deixa de fora: **N7 e N8 não terão verificação nenhuma**, porque "o jogador vê a
> intenção do outro" não é uma asserção automatizável.
> **Corrigido em 02/09** (`05-fechamento.md` §1.3): "o teste-espelho" eram dois. O **espelho de
> inércia** (mesa contra a branch congelada) é portão de cada bandeira e está disponível desde a
> Etapa 0; o **espelho de motor** (mesa contra o harness) só existe depois do harness, e é portão da
> **bateria**, não desta fase. O critério pedia um artefato da fase seguinte.


**A pergunta:** o que precisa estar verde para a fase de implementação ser considerada pronta e a
bateria poder rodar?

| Resposta | Consequência |
|---|---|
| **`npm run build` verde, mais o teste-espelho, mais as provas item a item** ⭐ **RECOMENDADA** | cada um dos doze itens da §0.6.1 já tem a sua "prova" nomeada; a aceitação é o conjunto delas passando, mais o espelho não acusando divergência em nenhum campo, mais o `validate` (que inclui `test-kael`) |
| Só o `build` verde | barato e insuficiente: o `build` roda `validate`, que hoje **congela o estado errado** em dois pontos (`test-contrato.mjs:136` e L149, o Bloqueio inútil). Verde não prova nada sobre as bandeiras |
| Build, espelho, e mais uma cena de mesa jogada à mão | acrescenta o julgamento humano sobre o que o número não pega (o rastro é legível? a fila de declaração atrapalha?). É a única que cobre N7 e N8, que o harness não mede |

**Por que a recomendada:** ela é a única que usa o que já foi especificado. Cada item da §0.6.1 tem
uma linha "Prova" escrita, e nenhuma delas foi inventada agora; transformá-las em critério de
aceitação não acrescenta trabalho de desenho, só o torna explícito.

**O argumento mais forte contra:** ela deixa N7 e N8 sem nenhuma verificação, e os dois são metade do
que esta frente decidiu. A visibilidade e o rastro não têm asserção possível num teste automatizado:
"o jogador vê a intenção do outro" não é `ok(...)`. A terceira opção cobre isso e é a única que cobre,
ao custo de depender de uma sessão que ninguém agendou.

---

### D4 · Como se prova que as dezesseis bandeiras desligadas são inertes · **bloqueia o começo**

> **RESPONDIDO: uma branch congelada como referência**, caindo para o espelho do commit anterior se
> ela não for viável. Isso resolve o contra-argumento que eu tinha levantado: uma branch parada não
> anda com a história do git, então um conserto legítimo que entre junto com uma bandeira não faz a
> comparação falhar por motivo certo.
> **Um prazo que ninguém tinha escrito** (`05-fechamento.md` §1.2, I2): a branch é um recurso que
> **deixa de ser criável** no instante em que a primeira bandeira entra. Ela virou o passo 0.1 da
> ordem, antes de tudo.


**A pergunta:** que evidência garante que o perfil "tudo desligado" reproduz o jogo de antes, e não um
jogo novo com as regras mal apagadas?

| Resposta | Consequência |
|---|---|
| **Uma cena-espelho por bandeira, contra o commit anterior** ⭐ **RECOMENDADA** | para cada bandeira, a mesma cena com semente fixa roda no código novo com ela desligada e no commit anterior à sua entrada, e os logs têm de ser idênticos campo a campo. Dezesseis comparações, cada uma barata, e cada uma prova exatamente uma coisa |
| Uma cena-espelho só, com todas desligadas | uma comparação em vez de dezesseis, e a garantia é fraca: duas bandeiras podem se cancelar e o teste passa |
| Asserção de valor nas funções puras | `test-contrato.mjs` trava os números com as bandeiras desligadas. Barato e cego ao caminho: prova que a conta dá o mesmo, não que ela é chamada nos mesmos lugares |

**Por que a recomendada:** "desligada é inerte" é uma afirmação sobre **regressão**, e regressão se
prova contra a versão anterior, não contra uma expectativa escrita à mão. E o instrumento já vai
existir: o teste-espelho compara dois motores campo a campo; aqui ele compara dois **commits** do
mesmo motor.

**O argumento mais forte contra:** isso amarra o teste a uma história do git, e uma bandeira que entre
junto com um conserto legítimo de outra coisa faz a comparação falhar por motivo certo. Na prática,
alguém vai desativar a comparação numa terça-feira para destravar um commit, e ninguém religa. A
segunda opção é pior e não tem esse problema.

---

### D5 · A ordem de implementação da §0.6.1 · **bloqueia o começo**

> **RESPONDIDO: bandeiras primeiro**, que é a opção que eu tinha chamado de "começar pelo pior", e a
> razão dela é boa: os furos estão na mesa **hoje** (a Margem que não entra no dano, o escudo que só
> penaliza). Uma consequência forçada pela dependência: as seis bandeiras do núcleo (`n1` a `n6`) não
> podem vir antes das regras que elas ligam, então "bandeiras primeiro" são as **dez** que não
> dependem do núcleo (as nove de regra publicada mais o `porRodada`), e as seis do núcleo entram junto
> com N1 a N6.
> **Corrigido em 02/09** (`05-fechamento.md` §1): antes das bandeiras vem a **instrumentação**, que
> não muda comportamento nenhum e sem a qual nada é provável. A prova de inércia da D4 compara dano,
> e `rolagem.ts:11` é `Math.random`. São dez as dependências desse tipo na §0.6.1, e quatro delas
> mudam a ordem. E as bandeiras que vêm primeiro são **nove**, não dez: a `couraca` saiu da lista.


**A pergunta:** os doze itens entram em que ordem, dado que seis deles mexem no mesmo laço?

| Resposta | Consequência |
|---|---|
| **Núcleo do Tick primeiro, bandeiras por último** ⭐ **RECOMENDADA** | 1 a 6 (o núcleo, quatro funções), depois 7 (migração), 8 e 9 (tela), 10 e 12 (isolados), 11 (as bandeiras). É a ordem que a própria §0.6.1 sugere |
| Bandeiras primeiro | fecha os furos que estão na mesa hoje (a Margem que não entra no dano, o escudo que só penaliza) antes de mexer no relógio. Mas o item 11 é o que mais depende de `test-contrato.mjs` reescrito, e o mais arriscado |
| A semente (item 12) e o espelho primeiro | nenhuma regra entra antes de existir o instrumento que prova que ela não quebrou nada. Inverte a ordem inteira e atrasa tudo o que é visível |

**Por que a recomendada:** os itens 1 a 6 se sustentam sozinhos e cabem em quatro funções
(`agendaSimultanea`, `grupoDaVez`, `golpeMaisCedo`, e a leitura do retrato na folha); qualquer outra
ordem quebra o Tick em dois estados intermediários que não são nem o velho nem o novo.

**O argumento mais forte contra:** a terceira opção tem razão no princípio. Entrar com N1 a N6 antes
de existir o teste-espelho significa mudar o coração do combate sem o instrumento que compara antes e
depois, e o D4 acabou de dizer que "inerte" se prova contra o commit anterior. Se o espelho vier
depois, ele nasce comparando um motor já mudado contra si mesmo, o que é a comparação que não pega
nada. **Este contra-argumento é forte o bastante para eu não ter certeza da recomendação.**

---

### D6 · E1 confundido com dano e Preparo · **bloqueia só a leitura**

> **RESPONDIDO: um nível de controle.** Um par com o mesmo ciclo e danos diferentes, que isola o
> efeito do dano e permite subtraí-lo de toda leitura de E1. Custa uma célula e transforma a ressalva
> escrita num número.


**A pergunta:** o eixo dos ciclos, que no catálogo real vem grudado ao dano e ao Preparo, fica como
está, ou se paga alguma coisa para separá-lo?

| Resposta | Consequência |
|---|---|
| **Fica, e o confundimento é declarado** ⭐ **RECOMENDADA** | o relatório escreve, na leitura de E1, que a diferença entre os níveis inclui dano e Preparo, e que nenhum efeito atribuído a "ciclos" é atribuível só a ciclos |
| Armas inventadas com dano fixo | separa de verdade, e mede um jogo que não existe: o catálogo não tem arma de ciclo 7 com 1 dado |
| Um nível de controle | um par extra com o mesmo ciclo e danos diferentes, que isola o efeito do dano e permite subtraí-lo. Custa 1 célula e dá o tamanho do confundimento |

**Por que a recomendada:** o confundimento é do jogo, não do experimento. Ciclo longo **é** dano alto
em Centelha, e medir "ciclo com dano constante" responderia uma pergunta que a mesa nunca fará.

**O argumento mais forte contra:** a terceira opção custa uma célula em setenta e nove e transforma
uma ressalva escrita em um número. Sem ela, toda leitura de E1 fica com um asterisco que ninguém sabe
quantificar, e a previsão da §3 ("E1 domina o pico") pode estar certa pelo motivo errado.

---

### D7 · E4 confundido com armadura e raça · **bloqueia só a leitura**

> **RESPONDIDO: um nível de controle**, como na D6. Um par com passos diferentes e armadura igual,
> que dá o tamanho do confundimento. Cria um orc de couro correndo, que não descreve peça nenhuma do
> jogo, e é justamente por isso que ele é controle e não nível.


**A pergunta:** a assimetria de passo, que vem junto com 6 pontos de Absorção de diferença, fica
assim?

| Resposta | Consequência |
|---|---|
| **Fica, e o eixo é renomeado** ⭐ **RECOMENDADA** | passa a se chamar "rápido e frágil contra lento e duro", que é o que ele mede de fato, e a leitura para de prometer o que não entrega |
| Igualar a armadura dos dois lados | separa o passo, e cria um orc de couro correndo à mesma velocidade de um elfo, o que não descreve peça nenhuma do jogo |
| Sair da grade | E4 vira parte do eixo E2 (a distância), já que o que interessa dele é a perseguição que não fecha, e isso E2 já produz | 

**Por que a recomendada:** renomear é grátis e honesto, e o par que o eixo usa (orc de placa contra
elfo de couro) é uma cena real de mesa.

**O argumento mais forte contra:** renomear resolve o texto e não o experimento. O eixo continua
misturando duas causas, e se ele der efeito grande, ninguém vai saber se a perseguição que não fecha
veio do passo ou da Absorção que faz o perseguidor não morrer. A terceira opção é a única que
reconhece isso.

---

### D8 · O que fazer se o A/B de N1 mostrar algo ruim · **bloqueia só a leitura**

> **RESPONDIDO: antes disso, definir o que é "ruim"**, que era a pergunta escondida. O critério está
> na §D8b, abaixo, e ele reenquadra a leitura da bateria inteira.


**A pergunta:** N1 vai estar na mesa antes da bateria. Se a medição disser que ela piorou o jogo, o
que acontece?

| Resposta | Consequência |
|---|---|
| **A bandeira `n1` vira o botão de voltar** ⭐ **RECOMENDADA** | como ela já é um parâmetro (`decideEmValeDepois`, 0 ou 1), reverter é trocar um número no `regras.json`. Nenhum código a desfazer |
| Reverter o commit | desfaz N1 e leva junto N2 e N3, que só fazem sentido com ela (a dependência da R3 §2.1) |
| Aceitar e ajustar em volta | mantém N1 e compensa com outra regra (a folga da perseguição de volta, por exemplo). É o caminho que acumula régua |

**Por que a recomendada:** é a única que a arquitetura já entrega de graça, e é o motivo de a rota B
ter sido escolhida. Uma decisão de regra reversível por um número é o que a bandeira compra.

**Contra-argumento: não consigo formular um forte, e digo por quê.** As três respostas não estão no
mesmo plano: a primeira é um mecanismo, as outras duas são o que se faz **depois** de usar o
mecanismo. Reverter o commit é pior em tudo (leva N2 e N3 junto) e ajustar em volta é uma decisão de
desenho que só se toma com o número na mão. A escolha aqui é óbvia porque a rota B já a tomou.
**O que não é óbvio, e é a pergunta de verdade escondida nesta:** qual resultado conta como "ruim"?
Um combate 20% mais curto é bom ou é o sinal de que o Preparo 0 ficou forte demais? Isso não tem
resposta antes do número, e por isso não vira opção aqui.

---

### D8b · O que conta como "a regra piorou o jogo" · **respondida, e reenquadra a bateria**

**RESPONDIDO**, e a resposta é mais importante que a pergunta que a gerou. Os dois critérios
marcados:

- **a carga do mestre subiu** (paradas do mestre por batalha, ou o pico por Tick);
- **o jogador espera mais** (o tempo morto entre declarar e ver o efeito).

E a régua por trás deles, nas suas palavras: *"o que piora o jogo é ter que estender muito a
quantidade de ajustes, decisões, cliques, correções em cada etapa. Então toda vez que aumentar muito
a complexidade por causa desses fatores, é um ponto negativo."*

**O que isso descarta, e é o mais importante:** *"o combate ficar mais longo ou curto demais não é
automaticamente um problema que quero resolver no Grid; aí pode ser uma questão de adaptar regras. O
que estamos querendo ver aqui é como o Grid está reagindo às regras."*

Isso **reenquadra a leitura da bateria inteira**, e três consequências saem daí:

1. **A duração da batalha deixa de ser critério e vira multiplicador.** Ela continua sendo medida, e
   continua sendo o que multiplica toda a carga, mas um combate mais curto ou mais longo **não é, por
   si, um resultado ruim**. Uma regra que dobre a duração e mantenha a carga por Tick é neutra pelo
   critério; uma que encurte a batalha e dobre os cliques por etapa é ruim.
2. **A métrica certa é por etapa, e não por batalha.** "Paradas por batalha" mistura duração com
   carga; "paradas por Tick", "gestos por golpe aplicado" e "pico num Tick" isolam a carga da
   duração. As três já existem na §2.6, e passam a ser as principais, com as por-batalha viradas
   contexto.
3. **Taxa de vitória e dominância saem do critério de reprovação.** Elas continuam calculáveis e
   continuam interessantes, e param de decidir se uma regra fica ou sai: isso é balanço de regra, e
   se resolve fora do Grid.

**O limiar de cada critério só pode ser fixado depois do piloto**, que é quem dá a distribuição de
referência. O critério está fixo agora; o número, não.

---

### D9 · A folga da perseguição · **já decidida, e listada porque você pediu**

Foi respondida em 02/09: **não se decide antes de ver número**, a régua fica como está e a bateria
mede (§0.45). **Continua fechada.** O que ela abriu é o D2: as três métricas que a sustentam não têm
campo no log, e sem o D2 a decisão de "medir" não produz medida.

---

## E · O que eu decido sozinho, e já decidi

Engenharia. Nada aqui é regra de jogo; se algum destes virasse regra, estaria no D.

| O que | Decidido |
|---|---|
| Formato do log | JSON Lines, um arquivo por célula e por processo, concatenados no fim |
| Bufferização | array em memória durante a batalha, uma gravação por batalha (§0.8.7) |
| Gerador de acaso | xorshift, o mesmo de `lib-tempo.mjs:50-61`, com fluxos separados por finalidade |
| Função de hash da semente | qualquer hash de 64 bits estável entre execuções; a escolha não muda resultado, só reprodutibilidade |
| Ocupação do tabuleiro | um `Map` por Tick em vez do `COMBS.find` dentro do `some` de hoje, o que derruba o custo do passo de 8,6 µs para ~3,4 (R3 §4.2) |
| Posicionamento inicial | simétrico em relação ao centro do mapa, com a distância do nível de E2 medida em `distanciaHex` |
| Granularidade dos contadores agregados | por célula, com os percentis calculados em streaming para não guardar todas as batalhas em memória |
| Formato do relatório final | Markdown com tabelas, mais os agregados por célula em JSON ao lado, para comparação futura (Q14) |
| Onde os invariantes são conferidos | em memória, no fim de cada Tick, sem I/O (§0.8.7) |
| Nome e estrutura dos arquivos da bateria | livre |

---

## F · O que pode dar errado

Cinco, em ordem de gravidade.

### F1 · A bateria roda inteira e mede a minha política, não o sistema

**O risco:** a §C.3 mostra que seis das doze métricas dependem "muito" ou "inteiramente" da política.
Se o efeito de E6 for maior que o de E1, E2 e E3 juntos, a bateria terá medido as cinco listas de
regras que eu escrevi, e o relatório inteiro será sobre elas.

**O sinal que aparece primeiro:** no piloto, comparar a variância entre políticas com a variância
entre células do núcleo. Se a primeira dominar, é o sinal, e ele aparece **antes** da bateria.

**O que se perde se ele se realizar tarde:** as 54.500 batalhas, e pior, a confiança em conclusões
que pareciam sobre o jogo. É o risco de "roda inteira e não serve".

### F2 · O `aid` entra errado e o tempo morto vira ficção plausível

**O risco:** o D2 pede um identificador de ação atravessando cinco tipos de evento e sobrevivendo à
re-projeção, que reescreve a agenda. Um `aid` que se perca na re-projeção produz tempos mortos
**menores** e perfeitamente críveis.

**O sinal:** o tempo morto de quem perseguiu ser igual ao de quem não perseguiu. Se a viagem não
aparecer na conta, o `aid` está quebrando exatamente onde a re-projeção mexe.

**O que se perde:** uma das duas métricas centrais, e a que sustenta a decisão da folga da
perseguição. E se ninguém notar, um número errado vira decisão de regra.

### F3 · A tabela de custo de tela está errada e ninguém confere

**O risco:** ela é leitura de código de 02/09, e a tela vai mudar (os itens 8 e 9 da §0.6.1 são o
rastro e a fila de declaração, os dois na tela). Uma tabela de antes das mudanças descreve uma tela
que não existe mais.

**O sinal:** a contagem de gestos do caminho curto (5, pela R2 §C3) não bater com uma sessão real, ou
com um teste dirigido que conte os cliques.

**O que se perde:** metade das métricas (§C.2), e são justamente as que respondem "quanto o mestre
trabalha" em unidade que uma pessoa entende.

### F4 · A âncora satura e o um-fator-de-cada-vez sai todo nulo

**O risco:** é o D1. Com âncora uníssona, os efeitos de E4, E7, E9 e E10 podem sair indistinguíveis
de zero por efeito de teto.

**O sinal, na âncora extrema:** no piloto, o pico de paradas já ser igual ao número de peças, que é o
teto teórico da R2 §H4. Se o pico já está no teto, nada pode aumentá-lo.

**O sinal, na mediana, que é novo** (`05-fechamento.md` §2.5 C4). A mediana não é uníssona, e é ela
que separa saturação de efeito nulo de verdade:

| O que se vê | O que significa |
|---|---|
| os quatro eixos nulos **nas duas** âncoras, e o pico da mediana **longe** do teto | não é saturação: são os eixos que não fazem nada, e trocar de âncora não conserta |
| os quatro eixos nulos **só na extrema** | saturação confirmada, e as leituras que valem são as da mediana |
| nulos só na mediana | o efeito existe e depende de a cena ser extrema, que é a pergunta que a âncora dupla foi criada para responder |

Sem as duas âncoras essa distinção não existia, e era exatamente ela que o F4 não sabia fazer.

**O que se perde:** 22 células de OFAT, e a resposta de quatro eixos.

### F5 · As bandeiras não somam, e o deixe-uma-de-fora engana

**O risco:** o desenho mede efeito principal e é cego a interação (já registrado na R3 §2.2). Se a
Margem e o gate se cancelarem, ou se o Bloqueio só importar com outra ligada, a soma dos efeitos
individuais não vai bater com o efeito de tudo-desligado, e não haverá como saber qual par é o
culpado.

**O sinal:** a diferença entre "tudo desligado" e a soma dos deltas. É calculável no fim, de graça, e
vale a pena estar no relatório como conferência: se a soma bate, as bandeiras são aproximadamente
aditivas e a leitura é simples; se não bate, o relatório diz de quanto é a discrepância e que ela é
interação não medida.

**Duas coisas quase mataram esse sinal, e as duas foram resolvidas em 02/09**
(`05-fechamento.md` §2.5 C3):

1. **Ele já estava fraco.** Sete das dezessete comparações davam delta **zero na âncora**, e a soma
   "batia" trivialmente para essas sete. A conferência nunca foi sobre dezesseis bandeiras.
2. **Ele parou de ser calculável** quando cada bandeira passou a ser medida na célula em que morde:
   deltas contra referências diferentes não somam.

> **DECIDIDO: referência única, medindo duas vezes.** As seis bandeiras que não moram na âncora
> extrema (`gate`, `modo2`, `curaSemArea`, `curaDivide`, `porRodada`, `porte`) são medidas **também
> lá**, e a soma volta a fazer sentido. Custa **+6 células** e leva a grade a 109.

**O alcance real da conferência, escrito para não iludir:** as seis leituras extras são **zero por
construção**, então a aditividade é verificada de verdade sobre **nove** bandeiras (`margem`,
`bloqueio`, `teto6` e as seis do núcleo do Tick) e é trivial sobre as outras seis. Para essas seis, a
interação continua sem verificação, e o relatório tem de dizer isso na mesma página em que mostra a
soma.

**O que se perde se ele falhar:** não a bateria, mas a interpretação: cada bandeira teria um número,
e a soma deles não descreveria o conjunto.
