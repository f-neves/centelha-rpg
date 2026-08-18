# A linha do tempo do combate (documento-base da revisão)

> **Estado.** Fase 1 (a régua) e fase 2 (agir fora da vez) **decididas e calibradas**. Fase 3
> (ler o sinal) desenhada. Nove bordas identificadas, quatro delas já medidas. **Nada foi
> implementado**: `armas.json`, o capítulo IX, a ficha e o rastreador da mesa continuam como
> estavam.
>
> **Onde mexer nos números:** abra **`combate-tempo-bench.html`** (duplo clique, sem servidor).
> Toda regra desta revisão é um botão do painel e toda afirmação deste documento é uma bateria
> que roda ali dentro, incluindo um duelo narrado Tick a Tick com o trilho desenhado.
>
> **O motor.** `scripts/lib-tempo.mjs`, um só, usado por dois lugares: o relatório em lote
> (`node scripts/sim-ticks.mjs`) e a bancada (que o inlina sem uma linha de diferença, via
> `scripts/gen-bench-tempo.mjs`). O catálogo é o de verdade: `src/data/armas.json` e
> `armaduras.json`, com os dados, o acerto, as mãos, o multiplicador de Força e o gate de
> Perfuração que estão no site. Gerador semeado; conferido em três sementes com desvio abaixo
> de 0,8 ponto percentual.
>
> **Como ler os números.** O robô é **ganancioso**: usa toda regra nova sempre que ela é legal,
> o que é mais agressivo do que qualquer mesa. Os desvios medidos são o **teto do abuso**, não
> a jogada esperada. Um resultado perto da referência quer dizer "nem usado ao máximo isso
> quebra", que é a garantia que interessa. Ele não prova que a regra é divertida.

---

## 1. O diagnóstico

O sistema já tem dois comportamentos que parecem opostos e são o mesmo número lido de lados
diferentes:

- **Ação comum:** resolve no primeiro Tick, e a Velocidade toda é recuperação. Você fica exposto
  **depois** de agir.
- **Arte:** resolve no último Tick (§5.5 do `Arcano_revisao.md`), e a Velocidade toda é preparo.
  Você fica exposto **antes** de agir.

Não são dois sistemas. É um eixo com um cursor, e o jogo só usava as duas pontas dele.

O que assumir o cursor compra, antes de qualquer número:

1. **A arma pesada deixa de ser "só lenta" e passa a ser anunciada.** Hoje o martelo é pior que a
   faca em cadência e melhor em dano, e acabou. Com Preparo, ele vira uma coisa que o inimigo
   **vê subindo**, e a faca ganha a função que hoje não tem: acertar dentro da janela.
2. **A Arte deixa de ser exceção.** O "sai no último Tick" para de ser nota de rodapé do Arcano e
   vira o extremo natural de uma régua que o combate inteiro usa.
3. **A "Guarda sob pressão" ganha um irmão simétrico.** Hoje você fica exposto depois de agir, e
   isso é *guarda baixa*. Com Preparo existe um segundo tipo de exposição: **compromisso
   assumido**. Compromisso é interrompível; guarda baixa não é.

---

## 2. A régua: Preparo e Recuperação

**Decidido em 18/08/2026.**

Toda ação tem dois números, `P/R`, com **P + R igual à Velocidade de hoje**. A cadência não muda;
muda **onde dentro da janela o golpe cai**.

| Classe | Velocidade hoje | Preparo | Recuperação | O que muda |
|---|:---:|:---:|:---:|---|
| Leve | 5 | **0** | 5 | resolve na hora, como hoje |
| Média | 6 | **1** | 5 | telegrafa 1 Tick |
| Haste | 6 | **0** | 6 | rápida em sair, lenta em voltar |
| Pesada | 7 | **2** | 5 | telegrafa 2 Ticks |
| Corrida, Salto | 3 | **0** | 3 | inalterados |
| Arte de grau 6 | 7 | **7** | 0 | é exatamente o que a §5.5 já escreveu |

### 2.1. As três regras que a sustentam

**Primeira: a guarda se refaz quando o golpe SAI, não quando você começa a montá-lo.** É o único
ponto sensível de todo o desenho:

| classe | guarda no golpe | guarda na declaração |
|---|:---:|:---:|
| leve | +0,1 | **−3,7** |
| média | −0,3 | +2,6 |
| haste | +0,4 | **−6,3** |
| pesada | −0,4 | **+4,2** |

**Segunda: o Preparo não compra nada.** A intuição diz que quem se compromete antes deveria bater
mais fundo. A intuição está errada, e o detalhe cruel é que a compensação **nem ajuda a arma
pesada**: quem mais ganha é a média, que tem P=1 e cadência boa.

**Terceira: se o seu alvo cai antes de o golpe sair, o golpe vai para outro inimigo ao alcance.**

### 2.2. As provas

**Neutralidade em 1v1.** Round-robin de 10 armas de corpo a corpo do catálogo real, cada uma
contra todas as outras:

| arma | classe | P | hoje | com P/R | Δ |
|---|---|:---:|:---:|:---:|:---:|
| Adaga, Espada Curta | leve | 0 | 53,8% | 53,9% | +0,1 |
| Espada Longa, Machado | média | 1 | 49,7% | 49,0% | −0,6 |
| Maça | média | 1 | 4,2% | 4,2% | +0,0 |
| Picareta de Guerra | média | 1 | 24,8% | 24,8% | +0,1 |
| Lança | haste | 0 | 56,7% | 56,9% | +0,2 |
| Alabarda | haste | 0 | 88,5% | 89,0% | +0,5 |
| Montante | pesada | 2 | 71,2% | 71,0% | −0,2 |
| Martelo de Guerra | pesada | 2 | 49,7% | 49,1% | −0,7 |

Maior desvio absoluto: **0,7 ponto**. (Os valores absurdos da Maça e da Alabarda são anteriores a
esta revisão e viram assunto na §9.)

**Neutralidade contra armadura.** 12 células de arma × armadura, maior desvio **+0,7**. A relação
arma-armadura, que é o coração do dano em Centelha, não sente nada.

**A refrega, que é onde morde.** 3v3 com foco de fogo (o time mira em quem tem menos Vida):

| refrega 3v3 | hoje | P/R sem redirecionar | P/R + redirecionar |
|---|:---:|:---:|:---:|
| 3 Martelos vs 3 Espadas Curtas | 29,4% | **20,0%** | 21,7% |
| 3 Montantes vs 3 Adagas | 66,8% | **55,1%** | 57,9% |
| 3 Espadas Longas (espelho) | 50,7% | 50,1% | 49,5% |
| golpes perdidos no ar | 3,1% | 6,6% a 7,0% | 4,7% a 4,8% |

Sem redirecionar, o Preparo é um imposto de 9 a 12 pontos sobre a arma pesada em combate de
grupo. Redirecionar devolve boa parte e corta o desperdício quase à linha de base.

**A tabela aguenta desaforo.** Martelo contra Espada Curta, variando o Preparo da pesada:

| P da pesada | 0 | 1 | 2 | 3 | 4 |
|---|:---:|:---:|:---:|:---:|:---:|
| win% do Martelo | 47,7% | 46,0% | **46,8%** | 43,7% | 42,6% |
| golpes perdidos (3v3, sem redirecionar) | 3,1% | 4,8% | 6,6% | 7,9% | 9,0% |

P=2 fica dentro do ruído. O que cresce de verdade com o Preparo é o desperdício em grupo, e é
para isso que existe a regra de redirecionar.

### 2.3. Quanto isso aparece na mesa

Uma **janela** é declarar uma ação contra um alvo que está em Preparo:

| matchup | janelas por duelo | % das declarações |
|---|:---:|:---:|
| Martelo vs Martelo | 2,02 | **21,2%** |
| Espada Longa vs Martelo | 1,63 | 15,7% |
| Espada Curta vs Martelo | 0,95 | 8,5% |
| Espada Longa vs Espada Longa | 0,94 | 8,1% |
| Lança vs Montante | 0,69 | 7,9% |
| Espada Curta vs Espada Curta | 0,00 | **0,0%** |

Corta dos dois lados. **Bom:** entre 79% e 100% dos turnos continuam sendo o turno de hoje, sem
decisão nova. **Ruim:** numa mesa só de armas leves e sem feiticeiro, o mecanismo **nunca
aparece**, e você pagou o preço de escrever a regra por nada.

### 2.4. O que a régua NÃO muda

- **A Iniciativa** continua como está. O atraso incide na **declaração**, não na resolução.
- **O Deslocamento livre** continua grátis durante qualquer ação, inclusive durante o Preparo.
- **A empunhadura dupla** rende dois golpes na mesma ação, que saem juntos no fim do Preparo.
- **Quase-Acerto, Absorção, gate de Perfuração e Couraça de Porte** não são tocados.
- **O Fôlego** está desligado do site desde 18/08 e não participa de nada disto.

---

## 3. A carga voluntária: comprar Preparo

O "Mirar" do capítulo IX (gasta uma ação preparando o golpe, e o alvo fica −2 na Defesa) é um caso
particular disto, e mal precificado. Generalizado:

> **Carregar.** Ao declarar, acrescente **N Ticks ao Preparo** da ação. O ciclo inteiro cresce N,
> o golpe sai N Ticks mais tarde e você fica exposto N Ticks a mais.

Duelo espelho, um lado carrega e o outro joga normal; **50% é a troca neutra**. As colunas são o
bônus **por Tick** comprado:

**Espada Curta (Velocidade 5, Preparo 0)**

| Ticks comprados | +2 | +4 | +6 | +8 |
|---|:---:|:---:|:---:|:---:|
| 1 | 46,5% | 66,3% | 82,2% | 90,8% |
| 2 | 41,0% | 75,1% | 91,4% | 97,4% |
| 3 | 37,8% | 75,8% | 94,0% | 98,1% |

**Espada Longa (Velocidade 6, Preparo 1)**

| Ticks comprados | +2 | +4 | +6 | +8 |
|---|:---:|:---:|:---:|:---:|
| 1 | 49,2% | 69,0% | 80,8% | 89,4% |
| 2 | 47,3% | 75,6% | 90,8% | 96,2% |
| 3 | 42,0% | 78,8% | 92,3% | 97,1% |

**Martelo de Guerra (Velocidade 7, Preparo 2)**

| Ticks comprados | +2 | +4 | +6 | +8 |
|---|:---:|:---:|:---:|:---:|
| 1 | 56,7% | 70,9% | 82,3% | 88,8% |
| 2 | 56,9% | 78,4% | 88,1% | 92,3% |
| 3 | 55,1% | 77,7% | 90,2% | 96,2% |

A travessia dos 50% fica em **+2,2 por Tick** na espada curta, **+2,1** na espada longa e **abaixo
de +2** no martelo, e sobe devagar conforme se compram mais Ticks (na curta, +2,2 no primeiro,
~+2,5 no segundo, ~+2,7 no terceiro). O número redondo:

<p><strong>1 Tick de Preparo comprado = +2 na rolagem. Teto de 3 Ticks (+6).</strong></p>

Três coisas caem desta linha:

1. **O "Mirar" de hoje está caro demais.** Ele cobra uma ação inteira (5 a 7 Ticks) e entrega +2,
   que é o preço de **um** Tick. Com a régua nova ele se corrige sozinho.
2. **A arma pesada compra mais barato**, porque um Tick é fatia menor do ciclo dela. É uma
   diferença real entre as classes que ninguém precisa escrever: ela cai da própria régua.
3. **O teto de 3 existe porque acima disso não foi testado**, e porque o simulador não modela a
   interrupção durante a carga. Com o catálogo do §4 ligado, carregar é mais arriscado do que
   estes números dizem, e o bônus justo provavelmente sobe.

---

## 4. Agir fora da vez: a dívida de Ticks

**Catálogo decidido em 18/08/2026, ataque incluso. Preço calibrado.**

O princípio já está escrito na §5.5 do Arcano, escondido como caso particular: o desvio de
emergência custa 1 Tick por metro e *esses Ticks empurram para frente a próxima ação do alvo*.
Isso não é regra de área. É uma **moeda de reação**.

> **A regra, em uma linha:** qualquer coisa que você faça fora da sua vez é paga com Ticks
> emprestados do seu próprio futuro.

Compare: D&D dá uma "reação por rodada", que é contabilidade binária sobre uma rodada que é
ficção. Aqui a moeda é **contínua, auto-limitante e sem estado extra**: ninguém precisa lembrar se
já reagiu, porque o custo é visível na barra e se cobra sozinho.

### 4.1. O preço

> Você age agora. Sua próxima ação anda **a Velocidade inteira da ação** para frente, somada ao
> que você já devia. Sua **guarda não se refaz**. E cabe **uma** por ação sua: não dá para
> encadear.

As quatro travas são todas portantes. Tirando uma de cada vez (interrupção espelho, sem
penalidade, robô ganancioso):

| variante | leve | média | haste | pesada | pior desvio | duração |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| referência, sem ação fora de hora | 53,9% | 31,8% | 73,0% | 60,0% | — | 31,8t |
| **preço cheio (as travas todas)** | 53,1% | 33,2% | 72,0% | 58,4% | **+1,7** | 28,2t |
| sem a trava da guarda | 69,7% | 25,4% | 80,0% | 50,0% | +15,8 | 30,1t |
| sem a trava de uma por ação | 78,5% | 30,9% | 85,9% | 24,4% | **+35,6** | **9,6t** |
| custo meia Velocidade | 73,1% | 28,6% | 82,6% | 37,2% | +22,8 | 23,9t |
| quem está em Preparo também reage | 53,5% | 35,0% | 69,9% | 49,4% | +10,6 | 26,5t |
| gatilho livre (reage sempre que pode) | 35,5% | 43,9% | 66,0% | 63,0% | +18,4 | 20,2t |
| sem trava nenhuma | 62,6% | 41,8% | 81,1% | 41,3% | +18,8 | **6,9t** |

Repare na coluna da duração: sem a trava de "uma por ação", o combate cai de 32 para **9,6
Ticks**; sem trava nenhuma, para **6,9**. Todo mundo gasta o futuro inteiro agora e a linha do
tempo colapsa numa corrida de tiro único. O botão mais perigoso é o custo pela metade, o que é
boa notícia: "custa a Velocidade da ação" é justamente a regra mais fácil de lembrar.

**Não é preciso teto de dívida.** A trava de "uma por ação sua" já limita a dívida a uma
Velocidade por ciclo, e ela zera quando a ação empurrada finalmente sai.

### 4.2. Penalidade de rolagem: NÃO

Contra a intuição, acrescentar penalidade ao que se rola fora de hora **piora** o equilíbrio:

| penalidade | leve | média | haste | pesada | pior desvio |
|---|:---:|:---:|:---:|:---:|:---:|
| **nenhuma** | 53,1% | 33,2% | 72,0% | 58,4% | **+1,7** |
| −2 | 43,5% | 39,5% | 63,5% | 63,5% | +10,4 |
| −4 | 33,8% | 47,0% | 53,2% | 69,1% | +20,1 |

O motivo é sutil: a penalidade transforma a reação num mau negócio, e o desequilíbrio cai sobre
**quem tem mais oportunidade de usá-la**, que é a arma leve. A −4, a arma leve cai de 53,9% para
33,8% **por usar a própria regra**.

E não é que a reação saia impune. As penalidades que a intuição pedia já estão lá, embutidas:

- **A penalidade de defesa** é a guarda que não se refaz: −2 por ataque feito ou recebido desde a
  sua última ação, **acumulando sem teto** pela regra de Pressão que já existe. Quem reage no meio
  de uma refrega chega à própria ação com a guarda em frangalhos. Tirar essa trava sozinha vale
  16 pontos de desequilíbrio.
- **A penalidade de dano** já vem junto, porque cada 6 pontos acima da Defesa é +1d6 pela Margem:
  qualquer penalidade de acerto é também penalidade de dano. Uma penalidade **só** de dano, sem
  tocar no acerto, não foi testada separadamente.

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

Sem comprar nada, interromper é péssimo negócio: o robô ganancioso derruba a arma leve de 53,9%
para 29,2% só por usar a regra. O que a interrupção entrega precisa ser proporcional ao preço:

| o que compra | leve | média | haste | pesada | pior desvio |
|---|:---:|:---:|:---:|:---:|:---:|
| atrasa 1 Tick | 29,2% | 47,9% | 56,1% | 69,4% | +24,7 |
| atrasa 3 Ticks | 37,9% | 41,7% | 61,7% | 67,9% | +16,0 |
| **atrasa o que eu paguei (espelho)** | 53,1% | 33,2% | 72,0% | 58,4% | **+1,7** |
| cancela a ação | 67,3% | 31,2% | 73,9% | 46,7% | +13,4 |

> **A regra:** o golpe que conecta em quem está montando uma ação **atrasa essa ação em tantos
> Ticks quantos o interruptor pagou**. Você gasta o seu tempo, ele perde o mesmo tempo.

Simétrica, memorável e auto-calibrante: uma arma pesada interrompe por 7, uma leve por 5, e
ninguém precisa de tabela nem de decorar um número. Cancelar de vez é forte demais, e cai
desproporcionalmente sobre a arma pesada, que é justamente quem tem janela.

Sai daí uma simetria que não foi desenhada e apareceu sozinha: **a arma pesada é a mais
interrompível e a melhor interruptora**. A leve interrompe muitas vezes e de leve; a pesada
interrompe raramente e fundo.

**Interromper é a ação fora de hora, e só ela.** Um golpe que cai na sua vez normal, mesmo
acertando alguém que está montando, não atrasa nada. É preciso **escolher** atrapalhar, e escolher
custa. (Se isso deve ser assim é a borda 9 da §6.)

### 4.5. O que a dívida NUNCA compra: Defesa

Testado o aparo desesperado, comprando +6 de Defesa contra um golpe:

| variante | duração | aparos/duelo | leve | pesada |
|---|:---:|:---:|:---:|:---:|
| sem aparo (referência) | 34,2t | — | 53,9% | 60,0% |
| +6 Def por 2 Ticks, à vontade | **58,2t** (+70%) | 8,48 | **+15,9** | **−17,3** |
| +6 Def por 3 Ticks, 1 por ação | 53,4t | 6,13 | +9,0 | −10,4 |
| +6 Def por 3 Ticks, só abaixo de 20% da Vida | 39,0t | 1,60 | +3,8 | −3,4 |
| +6 Def por 3 Ticks, uma por cena | 39,0t | 1,60 | +3,5 | −3,6 |

Quando reagir é sempre possível, todo mundo reage sempre, o combate cresce 70% e o equilíbrio
entre classes gira 33 pontos. **Nenhum teto conserta**: mesmo limitando a um por ação e
encarecendo para 3 Ticks, ainda são 19 pontos de giro.

O diagnóstico aponta a regra. O problema não é a dívida, é o que ela compra. **Comprar número de
Defesa vira um laço**, porque todo golpe é uma nova oportunidade de comprar. Comprar **posição ou
ação** não vira, porque não dá para sair duas vezes do mesmo lugar nem levantar duas vezes do
chão.

O aparo desesperado, se você quiser mesmo tê-lo, é candidato natural a **Técnica de Proeza**, que
já tem economia própria (Energia) e é limitada por quem pagou XP por ela.

---

## 5. O feiticeiro sob pressão

A regra do espelho foi calibrada em janelas de 1 a 2 Ticks. Contra os 7 de uma Arte, poderia virar
tranca. O teste desmente:

| regra da interrupção | Artes que saem (nu) | Artes que saem (de Placa Completa) |
|---|:---:|:---:|
| sem interrupção nenhuma | 100,0% | 100,0% |
| **espelho, sem teto** | **95,6%** | 100,0% |
| espelho, teto de uma Velocidade | 95,6% | 100,0% |
| atraso fixo de 2 Ticks | 100,0% | 100,0% |
| cancela a ação | **46,2%** | 43,3% |

Com um espadachim em cima, o espelho custa ao conjurador **4% das Artes**; de Placa Completa, nada.
Não é tranca. O que seria tranca é o **cancelamento**, que derruba mais da metade das conjurações,
e é mais uma razão para preferir o espelho.

E há a consequência de design que vale mais que o número: **interromper exige acertar**. A armadura
vira a defesa de concentração do conjurador, sem inventar teste de concentração, atributo de
concentração nem regra nova nenhuma. Isso responde à **pendência 14 do Arcano** sem acrescentar
uma linha ao capítulo das Artes.

**Ressalva:** a coluna de vitórias desta bateria não vale nada. O boneco de Arte tem a Vida e a
Defesa de um espadachim, sem aliados e sem alcance, e por isso morre quase sempre com ou sem a
regra. O que ela mede é a coluna das Artes que saem.

---

## 6. As nove bordas

Quatro já medidas, cinco ainda por decidir.

1. **Quem está em Preparo pode reagir? NÃO.** *Medido:* deixar reagir vale **+10,6** de desvio e
   corta a duração do combate de 32 para 26 Ticks. Você já está comprometido com uma ação, e essa
   é a razão pela qual a arma pesada é mais vulnerável do que os números de 1v1 sugerem.
2. **Dá para reagir antes da sua primeira ação da cena? NÃO.** *Encontrado no duelo narrado:* sem
   essa trava, quem perdeu a Iniciativa e começaria no Tick 7 reage no Tick 1 pagando 7, e a
   penalidade de Iniciativa some. A dívida não pode dissolver a regra que ela nem toca.
3. **Só o gatilho da janela, não "sempre que puder".** *Medido:* gatilho livre vale **+18,4** de
   desvio. Reagir é para interromper ou para finalizar, não para adiantar dano.
4. **Uma por ação sua.** *Medido:* sem essa trava, **+35,6** de desvio e o combate cai para 9,6
   Ticks. É a trava mais importante das quatro.
5. **Duas áreas na mesma janela.** Uma por ação significa sair de uma e comer a outra. É dramático
   e consistente, mas é duro. Vale abrir exceção para movimento? *Sem decisão.*
6. **Reação e Técnica Reflexiva juntas.** São moedas diferentes (Energia e Ticks). Proposta: cabem
   as duas no mesmo gatilho, uma de cada. *Sem decisão.*
7. **Abortar.** Duas categorias: **Firme** (uma vez declarada, sai: ataques, Artes, Salto) e
   **Solta** (abortável a qualquer Tick, perdendo o que foi gasto: Corrida, ações longas). O
   capítulo IX já diz isso da Corrida e do Salto sem generalizar. *Sem decisão.*
8. **A dívida na virada da cena.** Proposta: morre com a cena, como a guarda. *Sem decisão.*
9. **O golpe normal interrompe?** No motor, não: só a ação fora de hora atrasa. A alternativa é um
   empurrão passivo pequeno (1 Tick) em qualquer acerto, e o espelho só para quem pagou. *Sem
   decisão, e é a borda mais consequente das cinco.*

Duas menores, já com proposta e sem controvérsia: a **Horda** tem P=0 (a massa está sempre
girando, não há um gesto único a interromper), e o **atraso por interrupção não é modificador de
Defesa**, então não entra no teto de ±6.

---

## 7. Distância e arremesso

A pergunta de fundo era: o Preparo só custa se alguém puder te alcançar durante ele, e o arqueiro
está longe. **A resposta é que custa, e caro.** O guerreiro corre 7 metros por Tick, o arqueiro
atira parado, o contato é a 2 metros; a célula traz o win% do arqueiro e, entre parênteses, os
tiros que saem **antes** do contato:

| distância | P do arco = 0 | 1 | 2 | 3 |
|---|:---:|:---:|:---:|:---:|
| 30 m | 20,2% (0,6) | 12,8% (0,5) | 13,6% (0,3) | 27,8% (0,1) |
| 45 m | 28,4% (1,0) | 15,8% (0,8) | 13,7% (0,7) | 20,9% (0,5) |
| 60 m | 39,0% (1,4) | 23,5% (1,2) | 19,3% (1,0) | 23,1% (0,9) |
| 80 m | 52,7% (1,8) | 36,5% (1,7) | 27,8% (1,5) | 32,8% (1,3) |
| 100 m | **68,6%** (2,3) | 55,4% (2,1) | **42,6%** (2,0) | 40,3% (1,8) |
| 150 m | 94,3% (3,5) | 91,0% (3,3) | 82,1% (3,2) | 77,2% (3,0) |

O Preparo do arco é pago no **tiro que não sai antes de o inimigo chegar**, e cada ponto dele custa
entre 5 e 13 pontos de win rate na faixa de 45 a 100 metros. A 100 metros, ir de P=0 para P=2
derruba o arqueiro de 68,6% para 42,6%.

Isso pode ser lido de dois jeitos, e os dois são defensáveis:

- **Como custo alto demais:** o arco perde um terço do ciclo, e P=1 seria mais justo.
- **Como o preço que faltava:** com P=0 o arqueiro a 100 metros ganha 69% dos duelos, o que é
  dominante. Com P=2 ele fica em 43%, perto do par. **O Preparo do arco é o que impede que atirar
  de longe seja simplesmente melhor.**

A proposta, então, com a ressalva de que é escolha e não dedução:

| Arma | Velocidade | Preparo proposto | Por quê |
|---|:---:|:---:|---|
| Arco | 6 | **2** | encaixar a flecha e abrir o arco é preparo; a soltura é instantânea |
| Besta | 6 a 7 | **3** | a manivela é preparo puro, o gesto mais lento do catálogo |
| Funda | 6 | **2** | o giro antes do lançamento |
| Arremesso leve (adaga, dardo) | 4 a 5 | **0** | o gesto é curto e não se lê |
| Arremesso pesado (lança, machado) | 5 | **1** | o arco de braço é visível |

E há uma consequência bonita que o modelo entrega de graça: **você reage ao arqueiro, não à
flecha.** A flecha não tem janela; o arco tem. Quem fecha a distância a tempo interrompe o gesto,
e é por isso que a regra de projétil rápido (só Esquiva ou escudo hábil) continua intacta: ela
trata do projétil, e a interrupção trata do atirador.

**Ressalva do modelo:** a aproximação é grosseira. O guerreiro corre em linha reta a velocidade
constante, não há cobertura, terreno, nem recuo do arqueiro, e o duelo é 1v1. A leitura confiável é
a **direção e o tamanho** do efeito, não a terceira casa.

---

## 8. Ler o sinal (DESENHADO, não decidido)

A §5.5 já tem a leitura, para Artes: **Inteligência + Ocultismo** contra uma Dificuldade que cai a
cada Tick, um teste por efeito, o jogador escolhe **em que Tick testa** (cedo é difícil e rende
tempo, tarde é fácil e não rende nada), e passar dá +2 na fuga da área, ou +4 com Margem.

Com o Preparo, isso deixa de ser exclusividade do Arcano. Quem tem uma janela tem um sinal:

- **Contra uma Arte:** Inteligência + Ocultismo, como já está.
- **Contra um golpe físico:** **Percepção + Prontidão**, e o que se lê não é "o que ele vai fazer"
  e sim **onde**: qual alvo, qual lado, se é finta.
- **De graça, por conhecer o ofício:** quem tem a mesma arma e a mesma perícia do atacante
  reconhece o gesto sem teste, do mesmo jeito que a §5.5 dá a leitura grátis a quem tem a mesma
  Tradição.

E a leitura abre a **finta**, que hoje não existe como mecânica:

> **Fintar.** Ao declarar, compre **1 Tick de Preparo** e minta sobre o alvo ou o lado. Quem
> falhar na leitura age contra o que você mostrou.

O preço bate com a §3, e isso é uma checagem cruzada: 1 Tick de Preparo vale +2, e uma finta que
faz o inimigo se guardar do lado errado vale um degrau de modificador situacional, que é
exatamente ±2. A finta também dá à **arma leve** (P=0) o primeiro motivo para comprar Preparo, o
que fecha um buraco: hoje ela nunca tem janela e por isso nunca participa desta camada.

**Por que fica por último:** é a parte que mais consome tempo de mesa (um teste a mais por janela),
a que mais depende das outras estarem rodando, e a que mais precisa de tela, porque leitura é
informação assimétrica e a mesa de papel não tem como esconder do jogador o que o personagem não
sabe.

---

## 9. O que o banco expôs de passagem (não é desta revisão)

Passar o simulador a usar o catálogo real revelou três coisas que existem **hoje**, sem `P/R`
nenhum:

**A Lança em 78,5% era erro do banco.** O `sim-duelo.mjs` dava a ela o dobro da Força por ser de
duas mãos. O `armas.json` sempre esteve certo (`forcaMult: 1`), porque o capítulo diz que as hastes
de estocada ferem por alcance e não por peso. Com o dado certo, a Lança fica em **56,7%**. Não há
problema de jogo aqui: havia um problema de banco, e ele está corrigido.

**A Alabarda em 88,5% é real.** Ela tem `1d6+2` de dado, Força **×2**, acerto +1, Defesa +2 e
Velocidade 6. O Montante tem `2d6`, Força ×2, acerto 0, Defesa −2 e Velocidade 7. Em dano por Tick
elas empatam (2,25 contra 2,14), mas a Alabarda ganha em acerto, em guarda e em cadência, e ainda
tem P=0 por ser haste. Contra armadura ela fica entre **87% e 96%** em todas as faixas. Ou o
`forcaMult` dela deveria ser 1 (como a Lança), ou o dado deveria cair.

**A Maça em 4,2% também é real, e o motivo é bonito.** A Absorção natural contra Impacto é
`Vigor + Centelha`, que num lutador padrão dá 5. A Maça faz `1d6 + Força 4`, média 7,5, então
sobram 2,5 por golpe. O Martelo de Guerra, de duas mãos, faz `2d6 + Força×2` e sobra 10. Resultado:

| arma | alvo sem armadura | de couro | de malha | de lamelar | de placa |
|---|:---:|:---:|:---:|:---:|:---:|
| Maça | 3,1% | 1,3% | 13,4% | 0,7% | 0,8% |
| Martelo de Guerra | 49,4% | 63,4% | 88,1% | 74,2% | 82,0% |
| Espada Longa | 50,5% | 49,1% | 4,2% | 4,2% | 0,8% |

**A arma de Impacto de uma mão não tem nicho.** Contra alvo nu ela é esmagada pela Absorção
natural; contra armadura ela perde para a versão de duas mãos. O martelo de uma mão que abre a
armadura é uma imagem clássica que o sistema hoje não sustenta, e a causa é a Absorção natural
contra Impacto ser alta demais para o dano de uma mão.

Nenhuma das três é assunto desta revisão, mas as três contaminam qualquer teste futuro e precisam
de olhar próprio.

---

## 10. Como isso conversa com o resto do sistema

| Regra existente | O que acontece |
|---|---|
| **As Artes (§5.5 do Arcano)** | deixam de ser exceção e viram o extremo do eixo: `7/0`. O texto da §5.5 continua válido palavra por palavra |
| **Guarda sob pressão** | inalterada, e passa a ser o preço da ação fora de hora. É a peça que mais trabalha em todo o desenho |
| **Técnicas Reflexivas** | continuam a 0 Ticks, pagas em Energia. Moeda diferente, gatilho compartilhado (borda 6) |
| **Técnicas Ativas independentes** | ganham `P/R` pelo nível, como as armas: Velocidade 5, 6 e 7 viram 1/4, 1/5 e 2/5 |
| **Mirar (−2 na Defesa do alvo)** | vira caso particular da carga voluntária, e fica mais barato (§3) |
| **Postura defensiva e agressiva** | inalteradas: são modificadores de Defesa, não de tempo |
| **Projétil rápido** | inalterado, e ganha uma leitura nova: você reage ao arqueiro, não à flecha (§7) |
| **Corrida e Salto** | viram os dois exemplos das categorias Solta e Firme (borda 7) |
| **Regra de Horda** | esquadrão com P=0 |
| **Empunhadura dupla** | os dois golpes saem juntos, no fim do Preparo |
| **Fôlego** | desligado do site; não participa |

---

## 11. Um exemplo, Tick a Tick

Saído do duelo narrado da bancada, com Kael de espada longa (`1/5`, Velocidade 6) contra Brontes
de martelo (`2/5`, Velocidade 7):

```
                                    10        20        30        40
                               .    |    .    |    .    |    .    |
Kael · Espada Longa        ▓█░░░░▓█░░░░▓█░░░░···◆·········▓█░░░░····
Brontes · Martelo          ······▓▓█░░░◆·······▓▓█░░░░····◆·········

▓ Preparo   █ o golpe sai   ░ Recuperação   ◆ ação fora de hora   · livre
```

O momento que interessa é o Tick 13. Brontes está em recuperação e só voltaria a agir no Tick 14.
Kael acabou de declarar, e o golpe dele sai no Tick 14. Brontes paga: **ação fora de hora**, 7
Ticks (a Velocidade do martelo), e a próxima ação dele vai do Tick 14 para o Tick 21.

- Ele rola **normal**, sem penalidade nenhuma.
- A guarda dele **não se refaz**, e continua sem se refazer até a ação do Tick 21. (No log: *"[T29]
  Brontes agiu fora da hora: a guarda NÃO se refaz"*.)
- **Espelho:** o golpe de Kael atrasa **7 Ticks**, do Tick 14 para o 21.

A conta da troca: Brontes antecipou um golpe, tirou 7 Ticks de Kael, e pagou com **oito Ticks de
guarda degradada** e com a impossibilidade de reagir a qualquer outra coisa nesse intervalo. É por
isso que o desvio medido é +1,7 e não +25: o que parece um roubo na hora se cobra depois.

---

## 12. O que fica para a tela

O princípio: **o papel fica com a regra grossa, jogável de cabeça; a tela fica com a régua fina.**
As duas dão o mesmo resultado nos casos comuns.

- **A barra de dois tons** por combatente no trilho compartilhado, como o desenho da §11. O mestre
  **olha** e vê "o martelo cai no Tick 21, você joga no 19".
- **Destaque de quem está em janela agora**, e o botão de interromper que só acende quando cabe.
- **A conta do desvio de área** com rota pelo hexágono mais barato: o Grid já sabe onde todo mundo
  está, e a §5.5 já tem as duas Dificuldades.
- **A dívida somada sozinha** na linha do tempo, sem ninguém contar.
- **A carga voluntária** como um botão de "+1 Tick, +2" que mostra o novo instante de saída.
- **A assimetria de informação:** o jogador vê algo se juntando, o mestre vê o quê. A migração 14
  já tem o motor (views `SECURITY DEFINER`, `mesas.revelar`, log em duas redações).

Na mesa de papel, o mínimo jogável é: *leve sai na hora, média demora 1, pesada demora 2; agir
fora da vez custa a Velocidade da ação e a sua guarda não se refaz.* Duas frases.

---

## 13. O que continua aberto

1. **Cinco das nove bordas** (§6, itens 5 a 9). A mais consequente é a 9: se o golpe normal
   interrompe ou se interromper é privilégio de quem pagou.
2. **O Preparo de distância e arremesso** (§7): a curva está medida, a escolha entre "P=1 porque
   é caro" e "P=2 porque o arqueiro precisava de um freio" é sua.
3. **A leitura do sinal** (§8): desenhada, não decidida, e é a que mais muda o capítulo.
4. **O teto da carga voluntária.** Está em 3 Ticks porque acima disso não foi testado, e porque o
   simulador não modela interrupção durante a carga.
5. **Uma penalidade só de dano** para a ação fora de hora não foi testada separadamente.
6. **Os três fora-de-curva do catálogo** (§9): Alabarda alta demais, Maça baixa demais, e a
   arma de Impacto de uma mão sem nicho.
7. **A calibragem nunca passou por mesa.** Tudo aqui é simulação com robô ganancioso: bom para
   provar que não quebra, inútil para provar que é divertido.
8. **A implementação não começou:** `armas.json`, capítulo IX, ficha e rastreador da mesa
   continuam como estavam.

---

## Apêndice: como rodar

```
node scripts/sim-ticks.mjs               relatório completo no terminal
node scripts/sim-ticks.mjs --n 20000     mais tentativas por célula
node scripts/sim-ticks.mjs --seed 777    outra semente
node scripts/sim-ticks.mjs --so B,L      só as baterias B e L
node scripts/gen-bench-tempo.mjs         regera a bancada interativa
```

E **`combate-tempo-bench.html`** abre com duplo clique. Quatro abas: **As regras** (treze cartões,
cada um com o estado da decisão), **As provas** (o painel com todo número de regra e nove
baterias), **Duelo narrado** (o log Tick a Tick e o trilho desenhado) e **Catálogo** (as 26 armas
e 9 armaduras com o `P/R` que a régua atribui).

| Bateria | O que mede |
|---|---|
| A | Sanidade: espelho da mesma arma dos dois lados, tem de dar 50% |
| B | Round-robin de 10 armas, hoje contra P/R, nos dois momentos de guarda |
| C | Sensibilidade: quanto Preparo a arma pesada aguenta |
| D | Frequência da janela tática, por duelo e por declaração |
| E | O que interromper compra, por penalidade |
| F | A dívida comprando Defesa (a variante reprovada) |
| G | Refrega 3v3 com foco de fogo, com e sem redirecionar |
| H | Arma contra armadura, 12 células |
| L | As travas do preço, tiradas uma de cada vez |
| M | Carga voluntária: Ticks por bônus, em três armas |
| N | O feiticeiro sob pressão, nu e de Placa |
| O | O arqueiro e quem fecha a distância |
| P | O duelo narrado Tick a Tick |
