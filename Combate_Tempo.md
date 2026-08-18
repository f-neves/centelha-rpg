# A linha do tempo do combate (documento-base da revisão)

> **Estado.** Fase 1 (a régua) **decidida** em 18/08/2026. Fase 2 (agir fora da vez) com o
> **catálogo decidido** e o **preço calibrado**, faltando as bordas. Fase 3 (ler o sinal) só
> desenhada. **Nada foi implementado**: `armas.json`, o capítulo IX, a ficha e o rastreador da
> mesa continuam como estavam.
>
> **Banco de provas:** `scripts/sim-ticks.mjs`. O motor de combate é herdado do `sim-duelo.mjs`
> já calibrado (mesmo acerto, Margem, Quase-Acerto, Absorção, gate de Perfuração e guarda sob
> pressão): só a linha do tempo muda, para que a comparação seja contra a base e não contra um
> modelo novo inteiro. Gerador semeado, catorze baterias (A a N). Rodar com
> `node scripts/sim-ticks.mjs`; conferido em três sementes, com desvio abaixo de 0,8 ponto
> percentual entre elas.
>
> **Como ler os números.** O robô do simulador é **ganancioso**: ele usa toda regra nova sempre
> que ela é legal, o que é mais agressivo do que qualquer mesa. Os desvios medidos são o **teto
> do abuso**, não a jogada esperada. Um resultado perto da referência quer dizer "nem usado ao
> máximo isso quebra", que é a garantia que interessa. Ele não prova que a regra é divertida, só
> que ela não desmonta.

---

## 1. O diagnóstico

O sistema já tem dois comportamentos que parecem opostos e são o mesmo número lido de lados
diferentes:

- **Ação comum:** resolve no primeiro Tick, e a Velocidade toda é recuperação. Você fica exposto
  **depois** de agir.
- **Arte:** resolve no último Tick (§5.5 do `Arcano_revisao.md`), e a Velocidade toda é preparo.
  Você fica exposto **antes** de agir.

Não são dois sistemas. É um eixo com um cursor, e o jogo só usava as duas pontas dele. A revisão
inteira sai de assumir o cursor.

O que isso compra, antes de qualquer número:

1. **A arma pesada deixa de ser "só lenta" e passa a ser anunciada.** Hoje o martelo é pior que a
   faca em cadência e melhor em dano, e acabou. Com Preparo, ele vira uma coisa que o inimigo
   **vê subindo**, e a faca ganha a função que hoje não tem: ela é a única que consegue acertar
   dentro da janela de quem está carregando.
2. **A Arte deixa de ser exceção.** O "sai no último Tick" para de ser nota de rodapé do Arcano e
   vira o extremo natural de uma régua que o combate inteiro usa. Um parágrafo só explica o
   feiticeiro e o brutamontes.
3. **A "Guarda sob pressão" ganha um irmão simétrico.** Hoje você fica exposto depois de agir, e
   isso é *guarda baixa*. Com Preparo existe um segundo tipo de exposição, de natureza diferente:
   **compromisso assumido**. Compromisso é interrompível; guarda baixa não é.

---

## 2. A régua: Preparo e Recuperação

**Decidido em 18/08/2026.**

Toda ação passa a ter dois números, `P/R`, com **P + R igual à Velocidade de hoje**. A cadência
não muda; muda **onde dentro da janela o golpe cai**.

| Classe | Velocidade hoje | Preparo | Recuperação | O que muda |
|---|:---:|:---:|:---:|---|
| Leve | 5 | **0** | 5 | resolve na hora, como hoje |
| Média | 6 | **1** | 5 | telegrafa 1 Tick |
| Haste | 6 | **0** | 6 | rápida em sair, lenta em voltar |
| Pesada | 7 | **2** | 5 | telegrafa 2 Ticks |
| Corrida, Salto | 3 | **0** | 3 | inalterados |
| Arte de grau 6 | 7 | **7** | 0 | é exatamente a regra que a §5.5 já escreveu |

### 2.1. As três regras que sustentam isso

**Primeira: a guarda se refaz quando o golpe SAI, não quando você começa a montá-lo.** É o único
ponto sensível de todo o desenho, e escrever errado custa caro:

| classe | guarda no golpe | guarda na declaração |
|---|:---:|:---:|
| leve | +0,2 | **−4,3** |
| média | −0,4 | +2,2 |
| haste | +0,6 | **−6,8** |
| pesada | −0,0 | +4,0 |

**Segunda: o Preparo não compra nada.** A intuição diz que quem se compromete antes deveria bater
mais fundo. A intuição está errada. Dar +1 Margem a quem tem Preparo destrói o equilíbrio, e o
detalhe cruel é que **nem ajuda a arma pesada**, porque quem mais ganha é a **média**, que tem
P=1 e cadência boa:

| classe | sem compensação | com +1 Margem por Preparo |
|---|:---:|:---:|
| leve | 37,3% | **21,8%** (−15,3) |
| média | 43,7% | 55,7% (+11,6) |
| haste | 79,0% | 62,7% (−15,7) |
| pesada | 61,4% | 61,3% (−0,1) |

**Terceira: se o seu alvo cai antes de o golpe sair, o golpe vai para outro inimigo ao alcance.**
Sem essa frase, o Preparo é um imposto de 13 pontos sobre a arma pesada em combate de grupo, e
uma frustração de mesa (perder o turno inteiro porque o aliado matou primeiro).

### 2.2. As provas

**Neutralidade em 1v1.** Round-robin de 9 armas, cada uma contra todas as outras, 15.000 duelos
por célula:

| arma | classe | P | hoje | com P/R | Δ |
|---|---|:---:|:---:|:---:|:---:|
| Adaga, Espada Curta | leve | 0 | 37,0% | 37,3% | +0,2 |
| Espada Longa, Machado, Picareta | média | 1 | 49,9% | 49,6% | −0,4 |
| Maça | média | 1 | 26,6% | 26,1% | −0,5 |
| Lança | haste | 0 | 78,5% | 79,0% | +0,6 |
| Montante | pesada | 2 | 66,2% | 66,0% | −0,3 |
| Martelo | pesada | 2 | 56,6% | 56,9% | +0,2 |

**Neutralidade contra armadura.** 12 células de arma × armadura (Nenhuma, Malha, Placa), maior
desvio **+1,1**. A relação arma-armadura, que é o coração do dano em Centelha, não sente nada.

**A refrega, que é onde morde.** 3v3 com foco de fogo (o time mira em quem tem menos Vida):

| refrega 3v3 | hoje | P/R | P/R + redirecionar |
|---|:---:|:---:|:---:|
| 3 Martelos vs 3 Espadas Curtas | 63,8% | **50,2%** | 53,7% |
| 3 Montantes vs 3 Adagas | 77,9% | **62,7%** | 66,0% |
| 3 Espadas Longas (espelho) | 49,2% | 49,7% | 49,8% |
| golpes perdidos no ar | 3,1% | 7,0% | 4,8% |

**A tabela aguenta desaforo.** Martelo contra Espada Curta, variando o Preparo da pesada:

| P da pesada | 0 | 1 | 2 | 3 | 4 |
|---|:---:|:---:|:---:|:---:|:---:|
| win% do Martelo | 67,9% | 67,8% | **67,3%** | 66,5% | 63,7% |
| golpes perdidos (3v3) | 3,1% | 5,2% | 7,0% | 8,4% | 9,7% |

P=2 tem folga dos dois lados. Só em P=4 desmorona. Dá para calibrar por sensação sem medo.

### 2.3. Quanto isso aparece na mesa

Uma **janela** é declarar uma ação contra um alvo que está em Preparo. É o instante em que a
interrupção e a leitura valem:

| matchup | janelas por duelo | % das declarações |
|---|:---:|:---:|
| Espada Curta vs Martelo | 1,09 | 11,1% |
| Espada Longa vs Martelo | 1,05 | 12,0% |
| Lança vs Montante | 0,34 | 4,9% |
| Espada Longa vs Espada Longa | 0,31 | 3,1% |
| Espada Curta vs Espada Curta | 0,00 | **0,0%** |

Corta dos dois lados. **Bom:** 89% dos turnos continuam sendo o turno de hoje, sem decisão nova,
então a carga de complexidade é baixa. **Ruim:** numa mesa só de armas leves e sem feiticeiro, o
mecanismo **nunca aparece**, e você pagou o preço de escrever a regra por nada. Ele se paga na
mesa que tem um conjurador (6 a 7 Ticks de janela, o tempo todo) ou um brutamontes, que é a
maioria das mesas, mas não é todas.

### 2.4. O que a régua NÃO muda

- **A Iniciativa** continua como está: `1d6 + Raciocínio + Prontidão`, e o atraso de 1 Tick e
  −1d6 a cada 6 pontos abaixo do maior. O atraso incide na **declaração**, não na resolução.
- **O Deslocamento livre** continua grátis durante qualquer ação, inclusive durante o Preparo.
  Quem está montando um golpe pode deslizar enquanto monta.
- **A empunhadura dupla** continua rendendo dois golpes na mesma ação: os dois saem juntos, no
  fim do Preparo.
- **O Quase-Acerto, a Absorção, o gate de Perfuração e a Couraça de Porte** não são tocados.
- **O Fôlego** está desligado do site desde 18/08 e não participa de nada disto.

### 2.5. Distância e arremesso (ABERTO, com proposta)

O banco de provas só cobre corpo a corpo, então **estes números não foram testados**. A proposta
sai da física do gesto:

| Arma | Velocidade | Preparo proposto | Por quê |
|---|:---:|:---:|---|
| Arco | 6 | **2** | encaixar a flecha e abrir o arco é preparo; a soltura é instantânea |
| Besta | 7 | **3** | a manivela é preparo puro, e é o gesto mais lento do catálogo |
| Funda | 6 | **2** | o giro antes do lançamento |
| Arremesso (adaga, dardo) | 4 a 5 | **0** | o gesto é curto e não se lê |
| Arremesso pesado (lança, machado) | 6 | **1** | o arco de braço é visível |

**O problema que isso levanta, e que precisa de resposta:** o Preparo só custa alguma coisa se
alguém puder alcançar você durante ele. O arqueiro normalmente está longe, então o Preparo dele é
**de graça**. Três saídas possíveis:

1. **Aceitar.** O arqueiro paga o Preparo só quando alguém fecha a distância, e é justo que a
   posição dele valha alguma coisa. É o que a ficção já diz.
2. **O Preparo do arqueiro vira alvo à distância.** Outro arqueiro pode interromper quem está
   abrindo o arco, e isso cria um duelo de arqueiros com timing, que hoje não existe.
3. **O arco não tem Preparo, e o gesto vira carga voluntária** (§3): o arqueiro compra Ticks de
   Preparo quando quer mirar, e não paga nada quando atira de supetão.

A saída 2 é a que mais paga em jogo e não custa regra nova nenhuma: ela cai fora do catálogo do
§4 sem exceção.

---

## 3. A carga voluntária: comprar Preparo

O "Mirar" que já existe no capítulo IX (gasta uma ação preparando o golpe, e o alvo fica −2 na
Defesa) é um caso particular disto, e mal precificado. Generalizado:

> **Carregar.** Ao declarar, você pode acrescentar **N Ticks ao Preparo** da ação. O ciclo
> inteiro cresce N, o golpe sai N Ticks mais tarde e você fica exposto N Ticks a mais.

Qual bônus paga isso? Duelo espelho, um lado carrega e o outro joga normal; 50% é a troca neutra:

**Espada Curta (Velocidade 5, Preparo 0)**

| N | +2 | +4 | +6 | +8 | +10 | +12 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 45,8% | 66,2% | 82,3% | 90,9% | 95,2% | 97,5% |
| 2 | 21,8% | 41,6% | 60,8% | 74,6% | 84,9% | 91,3% |
| 3 | 9,2% | 20,0% | 38,1% | 53,1% | 67,3% | 76,3% |

**Espada Longa (Velocidade 6, Preparo 1)**

| N | +2 | +4 | +6 | +8 | +10 | +12 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 49,1% | 67,6% | 77,3% | 86,2% | 90,8% | 93,6% |
| 2 | 30,0% | 47,0% | 61,2% | 71,7% | 79,2% | 86,2% |
| 3 | 17,4% | 30,6% | 42,8% | 54,9% | 66,5% | 72,3% |

**Martelo (Velocidade 7, Preparo 2)**

| N | +2 | +4 | +6 | +8 | +10 | +12 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | 56,5% | 70,7% | 79,1% | 84,0% | 87,5% | 90,8% |
| 2 | 41,6% | 55,5% | 66,5% | 73,1% | 78,9% | 83,4% |
| 3 | 31,5% | 43,9% | 54,2% | 62,4% | 69,5% | 74,9% |

A travessia dos 50% fica em **+2,4 por Tick** na espada curta, **+2,1** na espada longa e **entre
+1 e +2** no martelo, e a linearidade se mantém até N=3. O número redondo no meio da faixa:

<p><strong>1 Tick de Preparo comprado = +2 na rolagem. Teto de 3 Ticks (+6).</strong></p>

Três coisas caem desta linha:

1. **O "Mirar" de hoje está caro demais.** Ele cobra uma ação inteira (5 a 7 Ticks) e entrega +2,
   que é o preço de **um** Tick. Com a régua nova ele se corrige sozinho.
2. **A arma pesada compra mais barato** (+1 a +2 por Tick, contra +2,4 da leve), porque um Tick é
   fatia menor do ciclo dela. Isso é uma diferença real entre as classes que ninguém precisa
   escrever: ela cai da própria régua.
3. **O teto de 3 existe porque acima disso não foi testado**, e porque o simulador não modela a
   interrupção durante a carga. Com o catálogo do §4 ligado, carregar fica mais arriscado do que
   estes números dizem, e o bônus justo provavelmente sobe.

---

## 4. Agir fora da vez: a dívida de Ticks

**Catálogo decidido em 18/08/2026. Preço calibrado. Bordas em aberto.**

O princípio já está escrito na §5.5 do Arcano, escondido como caso particular: o desvio de
emergência custa 1 Tick por metro e *esses Ticks empurram para frente a próxima ação do alvo*.
Isso não é regra de área. É uma **moeda de reação** que nenhum outro sistema tem, porque nenhum
outro tem uma linha contínua de onde cobrar.

> **A regra, em uma linha:** qualquer coisa que você faça fora da sua vez é paga com Ticks
> emprestados do seu próprio futuro.

Compare: D&D dá uma "reação por rodada", que é contabilidade binária sobre uma rodada que é
ficção. Aqui a moeda é **contínua, auto-limitante e sem estado extra**: ninguém precisa lembrar
se já reagiu, porque o custo é visível na barra e se cobra sozinho. Reagiu demais? Você não age.
Não existe abuso possível e não existe casinha na ficha.

### 4.1. O preço

> Você age agora. Sua próxima ação anda **a Velocidade inteira da ação** para frente, somada ao
> que você já devia. Sua **guarda não se refaz**. E cabe **uma** por ação sua: não dá para
> encadear.

As três travas são todas portantes. Tirando uma de cada vez (interrupção espelho, sem penalidade
de rolagem, robô ganancioso):

| variante | leve | média | haste | pesada | pior desvio | duração |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| referência, sem ação fora de hora | 37,3% | 43,7% | 79,0% | 61,4% | — | 29,4t |
| **preço cheio (as três travas)** | 38,1% | 45,7% | 76,6% | 56,8% | **+4,7** | 25,6t |
| sem a trava da guarda | 59,6% | 36,6% | 85,3% | 49,2% | +22,3 | 28,7t |
| sem a trava de uma por ação | 62,8% | 39,3% | 84,1% | 42,1% | +25,5 | 25,0t |
| custo meia Velocidade | 68,7% | 35,1% | 88,7% | 40,9% | +31,5 | 22,8t |
| sem trava nenhuma | 82,8% | 32,8% | 93,9% | 29,9% | +45,5 | **14,2t** |

Sem trava nenhuma o combate perde **metade da duração**: todo mundo gasta o futuro inteiro agora
e a linha do tempo colapsa numa corrida de tiro único. O botão mais perigoso dos três é o custo
pela metade, o que é boa notícia: "custa a Velocidade da ação" é justamente a regra mais fácil de
lembrar.

**Não é preciso teto de dívida.** A trava de "uma por ação sua" já limita a dívida a uma
Velocidade por ciclo, e ela zera quando a ação empurrada finalmente sai. O teto de 12 Ticks que
eu tinha proposto antes nunca chega a morder.

### 4.2. Penalidade de rolagem: NÃO

Contra a intuição, acrescentar penalidade ao que se rola fora de hora **piora** o equilíbrio:

| penalidade | leve | média | haste | pesada | pior desvio |
|---|:---:|:---:|:---:|:---:|:---:|
| **nenhuma** | 38,1% | 45,7% | 76,6% | 56,8% | **+4,7** |
| −2 | 27,5% | 52,3% | 65,7% | 60,1% | +13,3 |
| −4 | 18,9% | 58,1% | 53,8% | 62,7% | +25,3 |

O motivo é sutil: a penalidade transforma a reação num mau negócio, e o desequilíbrio cai sobre
**quem tem mais oportunidade de usá-la**, que é a arma leve. A −4, a arma leve cai de 37,3% para
18,9% **por usar a própria regra**.

E não é que a reação saia impune. As penalidades que a intuição pedia já estão lá, embutidas:

- **A penalidade de defesa** é a guarda que não se refaz: −2 por ataque feito ou recebido desde a
  sua última ação, **acumulando sem teto** pela regra de Pressão que já existe. Quem reage no
  meio de uma refrega chega à própria ação com a guarda em frangalhos. Tirar essa trava sozinha
  vale 22 pontos de desequilíbrio: ela é a metade do preço.
- **A penalidade de dano** já vem junto, porque em Centelha cada 6 pontos acima da Defesa é +1d6
  pela Margem: qualquer penalidade de acerto é também penalidade de dano. Uma penalidade **só** de
  dano, sem tocar no acerto, não foi testada separadamente.

### 4.3. O catálogo

| Ação fora de hora | Custo em Ticks |
|---|---|
| Sair da área (já é regra, §5.5) | 1 por metro |
| Levantar-se do chão | 2 |
| Avançar para fechar distância | 1 por metro |
| Interpor-se entre o golpe e um aliado | a distância em metros, mínimo 2 |
| Agarrar o braço de quem conjura | a Velocidade da ação de agarrar |
| **Atacar** | a **Velocidade inteira** da arma |

Em todas: a guarda não se refaz, e cabe uma por ação sua. O catálogo inteiro cabe em uma frase de
regra mais uma lista, e o jogador **nunca calcula nada**: ele escolhe *se* paga, e a tela diz
*quanto*.

### 4.4. O que interromper compra

Sem comprar nada, interromper é péssimo negócio, e o robô ganancioso prova: a arma leve cai de
37,3% para 13,1% só por usar a regra, porque é ela quem mais interrompe e mais paga. O que a
interrupção entrega precisa ser proporcional ao preço:

| o que compra | leve | média | haste | pesada | pior desvio |
|---|:---:|:---:|:---:|:---:|:---:|
| atrasa 1 Tick | 15,8% | 57,7% | 56,6% | 66,0% | +22,5 |
| atrasa 3 Ticks | 21,1% | 52,9% | 64,9% | 65,2% | +16,1 |
| **atrasa o que eu paguei (espelho)** | 38,1% | 45,7% | 76,6% | 56,8% | **+4,7** |
| cancela a ação | 55,7% | 43,0% | 78,2% | 44,3% | +18,4 |

> **A regra:** o golpe que conecta em quem está montando uma ação **atrasa essa ação em tantos
> Ticks quantos o interruptor pagou**. Você gasta o seu tempo, ele perde o mesmo tempo.

Simétrica, memorável e auto-calibrante: uma arma pesada interrompe por 7, uma leve por 5, e
ninguém precisa de tabela nem de decorar um K. Cancelar de vez é forte demais, e cai
desproporcionalmente sobre a arma pesada, que é justamente quem tem janela.

Sai daí uma simetria bonita, que não foi desenhada e apareceu sozinha: **a arma pesada é a mais
interrompível e a melhor interruptora**. A leve interrompe muitas vezes e de leve; a pesada
interrompe raramente e fundo.

### 4.5. O que a dívida NUNCA compra: Defesa

Testado o aparo desesperado, comprando +6 de Defesa contra um golpe:

| variante | duração | aparos/duelo | leve | pesada |
|---|:---:|:---:|:---:|:---:|
| sem dívida | 29,4t | — | 37,3% | 61,4% |
| +6 Def por 2 Ticks, à vontade | **49,4t** (+68%) | 6,98 | **+17,8** | **−18,4** |
| +6 Def por 3 Ticks, 1 por ação | 44,9t | 4,90 | +11,3 | −11,6 |
| +4 Def por 2 Ticks, 1 por ação | 37,2t | 3,77 | | |
| +6 Def por 3 Ticks, só abaixo de 20% da Vida | 33,4t | 1,32 | +3,7 | −3,6 |

Quando reagir é sempre possível, todo mundo reage sempre, o combate dobra de tamanho e o
equilíbrio entre classes gira 36 pontos. **Nenhum teto conserta**: mesmo limitando a um por ação
e encarecendo para 3 Ticks, ainda são 23 pontos de giro.

O diagnóstico do porquê aponta a regra. O problema não é a dívida, é o que ela compra. **Comprar
número de Defesa vira um laço**, porque todo golpe é uma nova oportunidade de comprar. Comprar
**posição ou ação** não vira, porque não dá para sair duas vezes do mesmo lugar nem levantar duas
vezes do chão.

O aparo desesperado, se você quiser mesmo tê-lo, é candidato natural a **Técnica de Proeza**, que
já tem economia própria (Energia) e é limitada por quem pagou XP por ela.

### 4.6. As bordas (ABERTO)

Sete casos que a regra precisa responder e que ainda não têm resposta travada:

1. **Quem está em Preparo pode reagir?** Proposta: **não**. Você já está comprometido com uma
   ação. É o custo real do Preparo, e explica por que a arma pesada é mais vulnerável do que os
   números de 1v1 sugerem. (O simulador já roda assim.)
2. **Duas áreas na mesma janela.** Se a regra é uma ação fora de hora por ação sua, e duas Artes
   caem enquanto você está em recuperação, você sai de uma e come a outra. É dramático e
   consistente, mas é duro. Vale abrir exceção para movimento?
3. **Reação e Técnica Reflexiva juntas.** São duas moedas diferentes: a Reflexiva custa Energia e
   0 Ticks (e já é limitada a 1 por gatilho), a ação fora de hora custa Ticks. Proposta: cabem as
   duas no mesmo gatilho, uma de cada.
4. **Abortar.** Duas categorias: **Firme** (uma vez declarada, sai: ataques, Artes, Salto) e
   **Solta** (abortável a qualquer Tick, perdendo o que foi gasto: Corrida, ações longas). O
   capítulo IX já diz isso da Corrida e do Salto sem generalizar.
5. **A dívida na virada da cena.** Proposta: morre com a cena, como a guarda.
6. **A Horda.** Proposta: um esquadrão tem **P=0**. A massa está sempre girando, não há um gesto
   único a interromper, e isso evita contabilidade de Preparo por magnitude.
7. **O teto de ±6 dos modificadores.** O atraso por interrupção não é modificador de Defesa e não
   entra nesse teto. Precisa estar escrito, ou alguém vai somar.

---

## 5. O feiticeiro sob pressão

A regra do espelho foi calibrada em duelos com 1 a 2 Ticks de Preparo. Contra os 6 ou 7 de uma
Arte, ela poderia virar tranca: cada golpe que conecta adia a conjuração pela Velocidade inteira
de quem bateu. O medo era razoável e o teste desmente:

| regra da interrupção | Artes que saem (feiticeiro nu) | Artes que saem (feiticeiro de Placa) |
|---|:---:|:---:|
| sem interrupção nenhuma | 100,0% | 100,0% |
| só o empurrão passivo de 1 Tick | 99,9% | 100,0% |
| **espelho, sem teto** | **55,7%** | **99,0%** |
| espelho, teto = metade da Velocidade | 63,3% | 99,5% |
| espelho, teto = a Velocidade inteira | 52,3% | 98,7% |
| atraso fixo de 2 Ticks | 81,0% | 100,0% |

Com um espadachim em cima e sem armadura, o feiticeiro perde **44% das Artes**. De Placa, perde
**1%**. Não é tranca: é risco real, e o risco é governado por uma coisa que já está no sistema.
**Interromper exige acertar**, e acertar através de armadura é difícil.

Cai daí uma consequência de design que vale mais que o número: **a armadura vira a defesa de
concentração do conjurador**. Não é preciso inventar teste de concentração, nem atributo de
concentração, nem regra nova nenhuma. O feiticeiro que quer conjurar no meio da refrega veste
ferro ou fica atrás de alguém. E isso responde a **pendência 14 do Arcano** ("quebrar a
conjuração") sem acrescentar uma linha ao capítulo das Artes.

**Ressalva:** a coluna de win% desta bateria não vale nada. O boneco de Arte tem a mesma Vida e a
mesma Defesa de um espadachim, sem aliados e sem alcance, e por isso morre em quase 100% dos
duelos com ou sem a regra. O que esta bateria mede é a coluna das Artes que saem.

---

## 6. Ler o sinal (DESENHADO, não decidido)

A §5.5 já tem a leitura, para Artes: **Inteligência + Ocultismo** contra uma Dificuldade que cai
a cada Tick, um teste por efeito, o jogador escolhe **em que Tick testa** (cedo é difícil e rende
tempo, tarde é fácil e não rende nada), e passar dá +2 na fuga da área, ou +4 com Margem.

Com o Preparo, isso deixa de ser exclusividade do Arcano. Quem tem uma janela tem um sinal, e o
sinal se lê:

- **Contra uma Arte:** Inteligência + Ocultismo, como já está.
- **Contra um golpe físico:** **Percepção + Prontidão**, e o que se lê não é "o que ele vai
  fazer" e sim **onde**: qual alvo, qual lado, se é finta.
- **De graça, por conhecer o ofício:** quem tem a mesma arma e a mesma perícia do atacante
  reconhece o gesto sem teste, do mesmo jeito que a §5.5 dá a leitura grátis a quem tem a mesma
  Tradição.

E a leitura abre a **finta**, que hoje não existe como mecânica:

> **Fintar.** Ao declarar, compre **1 Tick de Preparo** e minta sobre o alvo ou o lado. Quem
> falhar na leitura age contra o que você mostrou.

O preço bate com o §3, e isso é uma boa checagem cruzada: 1 Tick de Preparo vale +2, e uma finta
que faz o inimigo se guardar do lado errado vale mais ou menos um degrau de modificador
situacional, que é exatamente ±2. A finta também dá à **arma leve** (P=0) o primeiro motivo para
comprar Preparo, o que fecha um buraco: hoje ela nunca tem janela e por isso nunca participa
desta camada.

**Por que isto fica por último:** é a parte que mais consome tempo de mesa (um teste a mais por
janela) e a que mais depende das outras estarem rodando. Também é a que mais precisa de tela: a
leitura é informação assimétrica, e a mesa de papel não tem como esconder do jogador o que o
personagem não sabe.

---

## 7. Como isso conversa com o resto do sistema

| Regra existente | O que acontece |
|---|---|
| **As Artes (§5.5 do Arcano)** | deixam de ser exceção e viram o extremo do eixo: `7/0`. O texto da §5.5 continua válido palavra por palavra |
| **Guarda sob pressão** | inalterada, e passa a ser o preço da ação fora de hora. É a peça que mais trabalha em todo o desenho |
| **Técnicas Reflexivas** | continuam a 0 Ticks, pagas em Energia. Moeda diferente, gatilho compartilhado (ver §4.6) |
| **Técnicas Ativas independentes** | ganham `P/R` pelo nível, como as armas: 5, 6 ou 7 de Velocidade viram 1/4, 1/5 e 2/5 |
| **Mirar (−2 na Defesa do alvo)** | vira caso particular da carga voluntária, e fica mais barato (§3) |
| **Postura defensiva e agressiva** | inalteradas: são modificadores de Defesa, não de tempo |
| **Projétil rápido (só Esquiva ou escudo hábil)** | inalterado, e ganha uma leitura nova: **você reage ao arqueiro, não à flecha**. A flecha não tem janela; o arco tem |
| **Corrida e Salto** | viram os dois exemplos da categoria Solta e Firme (§4.6, item 4) |
| **Regra de Horda** | esquadrão com `P=0` (§4.6, item 6) |
| **Empunhadura dupla** | os dois golpes saem juntos, no fim do Preparo |
| **Fôlego** | desligado do site; não participa |

---

## 8. Um exemplo, Tick a Tick

Kael (espada longa, `1/5`, Velocidade 6) contra Brontes (martelo, `2/5`, Velocidade 7).

| Tick | O que acontece |
|:---:|---|
| **1** | Kael ganhou a Iniciativa e declara um golpe. Preparo 1: o golpe sai no Tick 2, e ele volta a declarar no Tick 7 |
| **2** | O golpe de Kael sai e acerta. Brontes declara o martelo: Preparo 2, sai no Tick 4, e ele volta no Tick 9 |
| **3** | Brontes está **montando**. Kael está em recuperação e só voltaria no Tick 7. Ele vê o martelo subindo e decide pagar: **ação fora de hora**, um ataque, custo 6 (a Velocidade da espada). A próxima ação dele vai do Tick 7 para o Tick 13 |
| | Ele rola **normal**, sem penalidade, mas a guarda dele **não se refaz**: os −2 acumulados continuam valendo até o Tick 13. Acerta |
| | **Espelho:** o martelo de Brontes atrasa **6 Ticks**. Sai no Tick 10, e a próxima ação dele vai do Tick 9 para o Tick 15 |
| **4 a 9** | Brontes está preso montando um golpe que não sai. Kael está em dívida e não pode reagir de novo |
| **10** | O martelo enfim sai. Kael come inteiro, com a guarda que não se refez desde o Tick 2 |
| **13** | Kael volta a agir |

A conta da troca: Kael antecipou um golpe do Tick 7 para o 3, tirou 6 Ticks de Brontes, e pagou
com **oito Ticks de guarda degradada** e a impossibilidade de reagir a qualquer outra coisa nesse
intervalo. É por isso que o desvio medido é +4,7 e não +25: o que parece um roubo na hora se
cobra depois.

---

## 9. O que fica para a tela

O princípio: **o papel fica com a regra grossa, jogável de cabeça; a tela fica com a régua
fina.** As duas dão o mesmo resultado nos casos comuns, e só divergem na terceira casa.

- **A barra de dois tons** por combatente no trilho compartilhado: hachurado é Preparo (visível,
  interrompível), liso é Recuperação (exposto, não interrompível). O mestre **olha** e vê "o
  martelo cai no Tick 10, você joga no 7".
- **Destaque de quem está em janela agora**, e o botão de interromper que só acende quando cabe.
- **A conta do desvio de área** com rota pelo hexágono mais barato: o Grid já sabe onde todo
  mundo está, e a §5.5 já tem as duas Dificuldades.
- **A dívida somada sozinha** na linha do tempo, sem ninguém contar.
- **A carga voluntária** como um botão de "+1 Tick, +2" que mostra o novo instante de saída.
- **A assimetria de informação:** o jogador vê algo se juntando, o mestre vê o quê. A migração 14
  já tem o motor (views `SECURITY DEFINER`, `mesas.revelar`, log em duas redações).

Na mesa de papel, o mínimo jogável é: *leve sai na hora, média demora 1, pesada demora 2; agir
fora da vez custa a Velocidade da ação e a sua guarda não se refaz.* Duas frases.

---

## 10. O que continua aberto

1. **As sete bordas da §4.6.** É o que falta para a fase 2 estar fechada.
2. **O Preparo das armas de distância e de arremesso** (§2.5): proposta escrita, nenhum número
   testado, e a pergunta do arqueiro longe sem resposta.
3. **A leitura do sinal** (§6): desenhada, não decidida, e é a que mais muda o capítulo.
4. **O teto da carga voluntária.** Está em 3 Ticks porque acima disso não foi testado, e porque o
   simulador não modela interrupção durante a carga.
5. **Uma penalidade só de dano** para a ação fora de hora não foi testada separadamente da
   penalidade de acerto.
6. **A calibragem nunca passou por mesa.** Tudo aqui é simulação com robô ganancioso: bom para
   provar que não quebra, inútil para provar que é divertido.
7. **A Lança está em 78,5%** contra todo o resto no round-robin, e isso já é assim **hoje**, sem
   `P/R` nenhum. Não é desta revisão, mas o banco expôs e alguém precisa olhar (K7).
8. **A implementação não começou** (K5): `armas.json`, capítulo IX, ficha e rastreador da mesa
   continuam como estavam.

---

## Apêndice: as baterias do banco de provas

| Bateria | O que mede |
|---|---|
| **A** | Sanidade: espelho da mesma arma dos dois lados, tem de dar 50% |
| **B** | Round-robin de 9 armas, hoje contra P/R, nos três momentos de guarda e com compensação |
| **C** | Sensibilidade: quanto Preparo a arma pesada aguenta (P de 0 a 4) |
| **D** | Frequência da janela tática, por duelo e por declaração |
| **E** | Empurrão passivo, K de 0 a 2 |
| **F** | A dívida comprando Defesa: seis variantes de aparo desesperado |
| **G** | Refrega 3v3 com foco de fogo, com e sem redirecionar |
| **H** | Arma contra armadura, 12 células |
| **I** | O pacote inteiro contra hoje |
| **J** | Ação fora de hora: quatro gatilhos por quatro penalidades |
| **K** | O que interromper compra: seis variantes por três penalidades |
| **L** | As três travas do preço, tiradas uma de cada vez |
| **M** | Carga voluntária: N Ticks por bônus, em três armas |
| **N** | O feiticeiro sob pressão, nu e de Placa |
