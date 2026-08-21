# A linha do tempo do combate (documento-base da revisão)

> **Estado.** Fase 1 (a régua) e fase 2 (agir fora da vez) **decididas e calibradas**. Fase 3
> (ler o sinal) desenhada. Nove bordas identificadas, quatro delas já medidas. **Nada foi
> implementado**: `armas.json`, o capítulo IX, a ficha e o rastreador da mesa continuam como
> estavam.
>
> **A §14 é a régua viva.** Em **19/08/2026** a régua ganhou uma terceira fase (`P/G/R`, com o
> **Golpe** de um Tick só) e, com ela, mudaram três decisões desta primeira metade: onde a guarda
> se refaz, o que estar comprometido custa e onde mora a exposição de quem ataca. **Quando a §14
> discordar das §2 a §9, vale a §14.**
>
> **AVISO SOBRE OS NÚMEROS DAS §2 A §9.** Eles foram medidos com a Guarda sob pressão cobrada em
> **dobro**, que era um bug do motor (K13, corrigido em 19/08: o capítulo IX escreve −2 por ataque
> e o motor descontava −4). A consequência não é cosmética: **a curva do Preparo do arco na §7
> inverte** quando o bug é corrigido. Para reconferir as tabelas antigas como elas foram
> publicadas, rode `node scripts/sim-ticks.mjs --legado`. Ver §14.8.
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
- **O Deslocamento livre** continua grátis durante qualquer ação, inclusive durante o Preparo. *(Superado na Recuperação: pela §14.6 ele passa a custar Ticks ali; K20.)*
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
   capítulo IX já diz isso da Corrida e do Salto sem generalizar. *Fechada pela §14.6: quem decide é a FASE, não o tipo da ação; as categorias somem.*
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
| **Empunhadura dupla** | *(superado pela §14.13)* um Tick de Golpe por mão; par de leves no mesmo ciclo, média a +1 |
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

- **A barra de dois tons** *(três, desde a §14: Preparo, Golpe, Recuperação)* por combatente no trilho compartilhado, como o desenho da §11. O mestre
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

## 14. A régua P/G/R (19/08/2026)

> **Estado.** Decidida e medida. A régua da §2 (`P/R`) ganhou uma terceira fase, e com ela
> mudaram três coisas que a §2 tinha fixado de outro jeito: **onde a guarda se refaz**, **o que
> estar comprometido custa** e **onde mora a exposição de quem ataca**. Nada foi implementado
> ainda: `armas.json`, o capítulo IX, a ficha e a mesa continuam como estavam.
>
> **Duas descobertas do motor entraram no caminho e mudam a leitura de tudo que veio antes:**
> a Guarda sob pressão estava cobrada em dobro (K13) e a Defesa da arma nunca foi modelada
> (K14). Os números desta seção estão no regime **corrigido**; os das seções 2 a 9, não.
> `node scripts/sim-ticks.mjs --legado` reproduz o regime antigo.
>
> **Dentro da própria §14 há duas camadas.** As §14.1 a §14.10 foram medidas com a régua de
> **19/08** (a ação sem custo de DV próprio, Golpe −6); as §14.11 a §14.13, decididas em
> **20/08**, trocaram isso pela **escada** (Preparo −2 · Golpe −4 · Recuperação −2 por golpe) e
> pela **rajada**. Onde discordarem, **valem as §14.11 a §14.13**. As superadas estão marcadas
> (§14.2, §14.4, §14.5). E o motor e a bancada **ainda implementam a régua de 19/08**: portar a
> escada, a rajada e a dupla nova é parte do K5.

### 14.1. As três fases

A ação passa a ter **três** números, e a soma continua sendo a Velocidade de hoje:

| fase | o que é | dá para interromper? | o que se pode fazer |
|---|---|:---:|---|
| **Preparo** | o gesto que sobe, visível | **sim**, até o Tick anterior ao Golpe | abortar, perdendo os Ticks investidos |
| **Golpe** | **um Tick**, quando o golpe sai | **não** | nada |
| **Recuperação** | o pós-golpe, sem refresh de guarda | não (não há o que atrasar) | a ação fora de hora, pagando a Velocidade |

<p class="formula"><b>P + G + R = a Velocidade de hoje</b>, e G é sempre 1</p>

| classe | P | G | R | ciclo |
|---|:---:|:---:|:---:|:---:|
| Leve | 0 | 1 | 4 | 5 |
| Média | 1 | 1 | 4 | 6 |
| **Haste** | **2** | 1 | **3** | 6 |
| Pesada | 2 | 1 | 4 | 7 |
| Arco, besta | Vel−1 | 1 | **0** | Vel |
| Arremesso | Vel−2 | 1 | 1 | Vel |
| Arte | 2 + nível | 1 | 0 | nível + 3 |

A **haste** mudou de lugar: era `0/6` na §2 e passa a `P2 · G1 · R3`. Ela tem o Preparo de uma
arma pesada e o ciclo de uma média, que é a leitura correta de uma arma que se arma de longe e
volta rápido. Medida, ela aperta as três classes sadias: leve 53,9% · haste 62,0% · pesada 46,0%.

O **arco tem R=0** porque soltar a corda de um arco já tensionado é instantâneo: assim que a
flecha sai, o arqueiro está livre. O **arremesso tem R=1**, o Tick de voltar à postura. E a
**Arte** deixa de ser exceção: `2 + nível` de Preparo é a §5.5 do Arcano escrita na régua geral.

### 14.2. O que a guarda custa, e onde

> **Superada pela §14.11 (20/08/2026).** Esta seção decidiu que a ação declarada não custaria
> Defesa por si e que só o Tick do Golpe custaria (−6). O princípio mudou: **toda ação física gera
> penalidade de Defesa**, e ela agora é uma escada que cresce a cada golpe. O achado desta seção
> continua valendo (penalizar o Preparo é imposto que a arma leve não paga) e é o que explica o
> preço da escada nova.

Esta é a decisão que mais custou a achar, e o resultado é contraintuitivo.

<p class="formula"><b>A ação declarada não custa Defesa por si. No Tick do Golpe, a Defesa cai 6.</b></p>

A intuição diz o contrário: quem está comprometido com uma ação deveria estar mais aberto
durante o Preparo e a Recuperação inteiros. Medindo, isso **piora tudo**, e o motivo é
estrutural:

> **Penalizar o Preparo é um imposto que a arma leve não paga, porque ela não tem Preparo.**

Abrindo P e R separadamente (8 armas limpas, 3 sementes; hoje o sistema mede **16,3** de
amplitude entre classes):

| P | R | Golpe | leve | média | haste | pesada | amplitude |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| −2 | 0 | −4 | **72,4%** | 41,0% | 47,2% | 42,3% | 31,4 |
| 0 | −2 | −4 | **43,1%** | 47,6% | 67,4% | 51,9% | 24,3 |
| −2 | −2 | −4 | 63,8% | 41,4% | 52,0% | 47,6% | 22,4 |
| −3 | −3 | −6 | 70,6% | 38,1% | 46,3% | 49,3% | 32,5 |
| −4 | −4 | −6 | 74,9% | 35,9% | 42,2% | 49,8% | 39,0 |
| 0 | 0 | −4 | 52,0% | 46,9% | 63,2% | 45,7% | 17,7 |
| **0** | **0** | **−6** | **53,9%** | **45,8%** | **62,0%** | **46,0%** | **16,1** |
| 0 | 0 | −8 | 57,0% | 45,3% | 60,5% | 45,1% | 15,4 |

E há uma segunda razão para o custo morar no Golpe: **é o único lugar uniforme**. Todo mundo tem
exatamente um Tick de Golpe por ação, seja de faca ou de martelo. Qualquer penalidade que dependa
do tamanho de P ou de R vira vantagem de classe disfarçada.

**Por que 6 e não 8**, que mede um pouco melhor: 6 é **um degrau de Margem**. Quem acerta no Tick
do Golpe alheio ganha exatamente **+1d6 de dano**. O número não é arbitrário, é a unidade que o
sistema já usa, e a mesa entende sem tabela.

A Guarda sob pressão do capítulo IX continua inteira para o que se **recebe**: −2 por ataque,
acumulando sem teto. O que muda é o ataque que você **faz**, que deixa de pesar o ciclo inteiro
e passa a pesar fundo num Tick só. No duelo medido, a Defesa média na hora de apanhar é **18,8**
(não 22, porque a guarda não se refaz até o ciclo fechar) e no Tick do Golpe é **16,0**.

**A guarda se refaz no fim da Recuperação**, e não no golpe como dizia a §2.1. É a mudança que
torna o Golpe um instante de verdade: se a guarda se refizesse ali, o Tick mais exposto seria o
mais protegido.

### 14.3. A régua contra o que existe

| modelo | leve | média | haste | pesada | amplitude | duelo espelho |
|---|:---:|:---:|:---:|:---:|:---:|---|
| hoje (capítulo IX) | 55,7% | 41,0% | 52,6% | 57,1% | 16,2 | 42,0t · 7,21 decisões/lado |
| K1 (a régua de 18/08) | 46,4% | 46,3% | 40,8% | 62,6% | 21,7 | 35,1t · 5,31 decisões/lado |
| **P/G/R (19/08)** | 53,9% | 45,8% | 62,0% | 46,0% | **16,1** | 38,2t · **5,98** decisões/lado |

A régua nova mede **como o sistema de hoje** no equilíbrio entre classes, e é a que menos estraga
a contagem de decisões: guarda 83% das decisões de hoje, contra 74% do K1. Acrescenta a linha do
tempo inteira, o Tick do Golpe e a leitura em três fases, e não cobra por isso.

### 14.4. Empunhadura dupla

> **Superada pela §14.13 (20/08/2026).** A restrição de classe caiu (a arma média pode golpear
> com as duas, pagando 1 Tick), os dados viraram −1d6/−1d6 e o alívio do Tick do Golpe entrou.
> Os números abaixo ficam como registro do caminho.

<p class="formula">Os golpes extras <b>saem da Recuperação</b>, e só estendem o ciclo se ela acabar</p>

Duas espadas curtas ficam **`P0 · G2 · R3 = 5`**: mão hábil no primeiro Tick de Golpe, inábil no
segundo, ambas a **−1d6**. Nesses dois Ticks vale a penalidade de P e R, e não a do Golpe, porque
**a outra lâmina ainda apara**.

Referência: espada curta sozinha contra as outras sete mede **54,0%**.

| dados perdidos | os dois no mesmo Tick | G de 2 Ticks |
|---|:---:|:---:|
| −1d6/−2d6 (o capítulo IX) | 22,9% (−31,1) | 26,0% (−27,9) |
| **−1d6/−1d6** | 46,6% (−7,4) | **51,3% (−2,7)** |
| 0/−1d6 | 70,5% (+16,6) | 75,2% (+21,3) |
| −2d6/−2d6 | 9,0% (−45,0) | 9,1% (−44,9) |

Três coisas caem desta tabela:

1. **Hoje a empunhadura dupla já é armadilha**, e não por causa desta revisão: 55,7% com uma mão
   contra 22,7% com duas, no motor rodando o capítulo IX.
2. **A penalidade de dado só é suportável quando as Defesas são baixas.** Com a Defesa média em
   19, tirar dois dados de um pool de cinco tira a mão inábil de qualquer chance de encostar.
   Por isso os −1d6/−2d6 do capítulo precisam virar **−1d6/−1d6**.
3. Consequência: a Técnica **Ambidestria** (Dança da Lâmina) fica sem função, porque o que ela faz
   hoje é exatamente apagar o dado extra da mão fraca. Precisa de outro benefício, ou a paridade
   fica atrás dela e a dupla sem treino continua armadilha.

A troca que a geometria conta é legível na mesa: **o dobro do tempo exposto, mas sem o buraco do
Golpe**, porque você nunca está com as duas armas comprometidas ao mesmo tempo.

### 14.5. A cadeia de ataques

> **Superada pela §14.12 (20/08/2026).** A geometria mudou de `P→G→P→G→R` (re-preparar a cada
> golpe) para a **rajada** `P→G→G→R` (uma preparação, golpes seguidos), e os freios mudaram com
> ela. O objetivo continua o desta seção; os números abaixo ficam como registro do caminho.

O objetivo é ter como enfrentar inimigos mais fracos sem gastar uma cena inteira, e **não** uma
manobra de duelo. A geometria:

<p class="formula"><b>N repetições de (Preparo + Golpe), e UMA Recuperação no fim</b></p>

Declarada de uma vez, sem parar no meio. Teto por classe: **4 na leve, 3 na média, 2 na pesada**.
Uma espada curta com N=3 fica `P0 · G1 · P0 · G1 · P0 · G1 · R4 = 7`.

Na forma pura ela faz o **contrário** do que se quer: ganha duelos e perde contra lacaios, porque
o preço em guarda é linear e o ganho em golpes não é. O freio que inverte isso é **perder um dado
a mais por golpe**, e ele funciona porque **distingue pelo alvo**, sem precisar de nenhuma regra
sobre quem se pode encadear: o lacaio tem Defesa baixa e apanha até do quarto golpe; o igual tem
Defesa alta e o terceiro já não encosta.

**Freio `0 · −1d6 · −2d6 · −3d6`, espada curta:**

| N | ciclo | duelo igual | contra 1 soldado | contra 2 lacaios |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 5 | 49,0% | 100% em **19,0t** | 100% em **22,1t** |
| 2 | 6 | **34,5%** | 100% em **13,0t** | 100% em **14,6t** |
| 3 | 7 | **15,9%** | 100% em 12,1t | 100% em 12,7t |
| 4 | 8 | **4,0%** | 100% em 12,5t | 100% em 13,3t |

Três leituras:

- **Contra quem está à altura, cada elo cobra caro.** Nunca é escolha leviana.
- **Contra os fracos, a cadeia compra relógio, não segurança.** A vitória é 100% dos dois lados; o
  que muda é quantos Ticks a briga rouba do resto da cena. É a atração certa.
- **A cadeia se limita sozinha.** N=4 já não melhora nada, porque o quarto golpe a −3d6 não
  encosta em ninguém. O teto de 4/3/2 vira teto de segurança, não a jogada ótima.

### 14.6. O que se pode fazer em cada fase

- **No Preparo:** abortar, perdendo os Ticks investidos, e **só para mover, desviar ou se
  interpor**, nunca para atacar. É o desvio de emergência da §5.5 do Arcano virado regra geral, e
  é o que dá saída ao arqueiro e ao feiticeiro, que têm `R=0`. Quem quiser ignorar o perigo e
  levar o golpe adiante pode, com um **teste de Virtude** (ver K12 no `Pendencias.md`: como se
  conta um teste de Virtude ainda não está decidido).
  **O preço, fechado em 21/08:** você fica livre **no Tick de agora**, e não no Tick em que
  declarou. Tudo o que gastou montando o gesto foi para o lixo, e é isso que impede abortar de ser
  de graça: a arma pesada, que tem o Preparo mais longo, é quem mais perde ao desistir. O
  movimento custa **1 Tick por metro**, o mesmo preço do desvio de emergência da §5.5 (e metade do
  que custa se deslocar na Recuperação, o que é a assimetria dita em números).
- **No Golpe:** nada. Não se aborta, não se reage, não se interrompe.
- **Na Recuperação:** uma **ação fora de hora** do catálogo da §4.3, pagando a Velocidade dela em
  dívida, uma por ação; uma **Técnica Reflexiva**, que custa 0 Ticks e se paga em Energia; e testes
  que envolvem ação (pulo, acrobacia, oferecer ajuda, se interpor), todos a **−1d6**. **O
  deslocamento aqui não é livre** (decidido em 20/08): custa Ticks, mais caro que o desvio de
  emergência da §5.5 (proposta: 2 Ticks por metro; K20). Não se declara ação nova, não se refaz a
  guarda, e não há o que abortar.

A assimetria é o coração da coisa, e vale escrever assim no capítulo: **no Preparo você ainda
pode desistir; na Recuperação você já não pode, só pode pagar.**

Isso **fecha a borda 7** da §6 sem precisar dela: as categorias Firme e Solta somem, porque quem
decide o que se pode fazer é a **fase**, não o tipo da ação.

**O ataque fora de hora precisa ficar.** Tirá-lo dobra a amplitude entre classes (16,0 para 38,2)
e joga a arma leve para 74%, e nenhuma regra de reposição conserta:

| regra | leve | média | haste | pesada | amplitude |
|---|:---:|:---:|:---:|:---:|:---:|
| **o ataque fora de hora fica (espelho)** | 53,8% | 45,9% | 61,6% | 45,7% | **16,0** |
| sai, e nada interrompe | 74,4% | 36,2% | 43,6% | 48,2% | 38,2 |
| sai; o golpe normal atrasa 1 Tick | 75,8% | 36,5% | 42,3% | 47,6% | 39,3 |
| sai; o golpe normal aplica o espelho | 82,0% | 37,4% | 38,7% | 42,0% | 44,6 |

O motivo é que a ação fora de hora tem um custo que não se percebe de imediato: quem reage paga a
Velocidade inteira e fica com a guarda travada, e a arma leve, que tem mais ocasiões de reagir, é
quem mais se machuca usando a própria regra. **Ela é freio da arma leve, não vantagem dela.**
*(Esta bateria rodou com a régua de 19/08 e com a Defesa da arma ligada, o canto oposto da K14:
leia a direção e o tamanho, não as casas decimais.)*

### 14.7. O rastreio

O estado de qualquer um, em qualquer Tick, é **um de cinco**, e a mesa não precisa carregar mais
do que **dois números por pessoa**: *sai no Tick X, livre no Tick Y*. Com rajada ou empunhadura
dupla, X vira uma lista curta.

| estado | | interrompível? | age fora da hora? | Defesa (a escada da §14.11) |
|---|:---:|:---:|:---:|:---:|
| livre | `·` | — | — | cheia |
| Preparo | `▓` | **sim** | abortando, e só para mover | **−2**, mais a Pressão recebida |
| Golpe | `█` | **não** | não | **−4**, mais a Pressão recebida |
| Recuperação | `░` | não | sim, pagando a Velocidade | **−2 por golpe dado**, mais a Pressão |
| devendo | `◆` | — | não (uma por ação) | idem, guarda travada |

```
                              agora
                                ↓
Kael  · duas espadas   ····▓██░░░···
Brontes · martelo      ·▓▓█░░░░····
Lacaio                 ░░···▓█░░░··
```

Três regras de tela fazem o resto, e as três cabem em CSS mais um contador:

1. **Só acende o que cabe.** O botão de interromper aparece apenas para quem está livre ou em
   Recuperação, e apenas quando existe alguém em `▓`. O jogador nunca pergunta "posso?".
2. **A coluna do agora é a que importa.** Quem estiver em `█` nela fica destacado: é o alvo do
   momento, e é o que torna a sincronização jogável sem ninguém contar Ticks.
3. **A dívida se soma sozinha.** O jogador escolhe *se* paga; a régua empurra o marcador dele e
   mostra o novo Y.

#### 14.7.1. Como isso entra no Grid

Um esboço de implementação, para ver o tamanho da coisa antes de decidir. **A `/mesa` é a outra
frente**, então isto é proposta, não plano: precisa de combinação antes de virar código.

**O que já existe e serve.** A tabela `combatentes` já tem `tick` e `iniciativa`; `mesa-core.ts` já
monta a fila; `mesa-tempo-real.ts` já tem a campainha por broadcast no canal `mesa:<id>`; e a
migração 14 já sabe esconder do jogador o que ele não deveria ver, por view `SECURITY DEFINER`
comandada por `mesas.revelar`.

**O que falta é uma coluna, não uma tabela.** A ação inteira cabe num `jsonb`:

```sql
alter table public.combatentes
  add column if not exists acao jsonb not null default '{}'::jsonb;
```

```json
{ "golpes": [7, 8], "livre": 12, "tipo": "dupla", "arma": "espada-curta", "alvo": "<uuid>", "divida": 0 }
```

`golpes` é a agenda: em que Ticks o golpe sai. Um número no caso comum, dois na empunhadura dupla,
N na rajada. `livre` é quando o ciclo fecha. É a mesma estrutura que o motor da bancada usa
(`offs`), o que evita duas verdades sobre a mesma coisa.

**Daí sai tudo, sem guardar mais nada.** Com o `tick` da mesa e esses dois campos:

| pergunta | conta |
|---|---|
| em que fase está? | `tick >= livre` → livre · `golpes.inclui(tick)` → **Golpe** · `tick < max(golpes)` → **Preparo** · senão **Recuperação** |
| quanto de Defesa ele perdeu? | livre 0 · Preparo **−2** · Golpe **−4** · Recuperação **−2 por golpe dado**, mais −2 por ataque recebido no ciclo |
| dá para interromper? | está em Preparo |
| pode agir fora da hora? | está em Recuperação, ou em Preparo abortando |
| quanto custa reagir? | `livre − tick` mais a Velocidade da ação |

<p class="nota">Os números da segunda linha são a escada da <b>§14.11</b>, decidida em 20/08/2026.
Na tela eles não entram como número: entram como <b>tom</b> da célula da fita, e o mestre lê a
Defesa efetiva no cartão do combatente, como já lê o resto.</p>

**Na tela, quatro peças.**

1. **A fita**, uma linha por combatente no painel de Combate, uma célula por Tick, três tons: `▓`
   Preparo (dourado fosco), `█` Golpe (dourado forte), `░` Recuperação (cinza). A coluna do Tick
   corrente é uma régua vertical por cima de todas as linhas. É o desenho que a bancada já tem na
   aba do duelo narrado, e o CSS de lá serve.
2. **O anel do Golpe.** Quem tem `golpes.inclui(tick)` ganha um anel no token do hexágono. É a peça
   que torna a sincronização jogável: o jogador **vê** que o martelo cai agora, e decide.
3. **O botão que só acende quando cabe.** No token de cada inimigo em Preparo, um "interromper" que
   aparece somente para quem está livre ou em Recuperação. Ao clicar, a mesa faz a conta e diz
   *"custa 6 Ticks; sua próxima ação vai do 14 para o 20"*. O jogador escolhe **se** paga; nunca
   calcula quanto.
4. **A assimetria.** O jogador vê que alguém está montando alguma coisa (a fita em `▓`); o mestre
   vê **o quê** (a arma e o alvo). É a mesma view da migração 14, devolvendo `acao` sem os campos
   `arma` e `alvo` quando a revelação está desligada.

**O que isso não mexe:** o motor das Artes, o tabuleiro de hexágonos e o `grid-golpe-fx`. A fita é
um componente ao lado da fila de iniciativa que já está lá.

**O mínimo, se for para fazer por partes:** a coluna `acao` mais a fita. O anel e o botão são
ganho de mesa, mas a fita sozinha já entrega o principal, que é *ver o tempo do outro*.

### 14.8. As duas descobertas do motor

**K13 · A Guarda sob pressão estava cobrada em dobro.** `lib-tempo.mjs` fazia `guard += pressao` e
descontava `pressao × guard`: **−4 por ataque**, quando o capítulo IX (`combate.md:233`) escreve
**−2**. O parâmetro entrava ao quadrado. Está corrigido, e `--legado` reproduz o regime antigo.

Não é detalhe. **A curva da §7 inverte.** Arco longo contra espada longa, a 45 metros:

| | P=0 | P=2 | P=5 |
|---|:---:|:---:|:---:|
| com a Pressão em dobro (as tabelas da §7) | 28,3% | 13,4% | 31,9% |
| com a Pressão correta | **11,7%** | **28,3%** | **54,0%** |

Com −4, o Preparo do arco custa win rate; com −2, ele **paga**. A conclusão publicada na §7 ("cada
ponto de Preparo custa de 5 a 13 pontos") é artefato do bug, e **o K4 não pode ser decidido antes
disso**.

**K14 · A bancada só mede o canto "todo mundo esquiva".** O motor tem **uma** Defesa e ignora a
`defesaArma`, que pelo `defesas.md:67` entra **só no Bloqueio**
(`Bloqueio = (Des + Bloqueio)×2 + Centelha + Esp + defesa da arma`). Ligando-a para todos, que é o
canto oposto, o sistema de **hoje** vai de 16,3 para **50,5 pontos** de amplitude, com a haste em
77,5% e a arma pesada de duas mãos em 27,0% (lança +2 e alabarda +2 contra montante −2 e martelo
−2). A verdade está entre os dois cantos e depende do roteamento das Defesas pelo "como".

Consequência prática: **nenhum ajuste de catálogo (o K11, Alabarda e Maça) deve sair deste motor**
enquanto ele não souber escolher entre Esquiva e Bloqueio.

### 14.9. O que a régua P/G/R deixa em aberto

1. **O arqueiro fica forte demais.** 63,9% a 100 metros contra 35,8% de hoje, e por um motivo
   estrutural: com `R=0` ele nunca passa pela fase exposta. Conversa com o K4, que está travado
   pelo K13.
2. **A Ambidestria** ficou sem função; os candidatos a função nova estão na §14.13 (K18).
3. **O teste de Virtude** entrou no combate sem régua própria (K12).
4. **A Arte sai em 86,3%** das conjurações, contra 88,2% do K1 e 99,6% de hoje (medido com a régua
   de 19/08; reconferir com a escada). Não é tranca, mas precisa ser conferida contra a §5 e a
   pendência 14 do Arcano.
5. ~~A cadeia foi medida só na arma leve.~~ **Resolvido pela §14.12:** a rajada foi medida nas
   quatro classes.
6. **Nada disso passou por mesa.** Continua valendo o aviso do topo: o robô prova que não quebra,
   não que é divertido.

### 14.10. Como rodar

```
node scripts/sim-ticks.mjs --so Q     a régua P/G/R contra hoje e contra o K1
node scripts/sim-ticks.mjs --so R     o par: DV no ciclo × DV no Tick do Golpe
node scripts/sim-ticks.mjs --so S     empunhadura dupla
node scripts/sim-ticks.mjs --so T     a cadeia de ataques (a geometria de 19/08)
node scripts/sim-ticks.mjs --so U     as regras de 20/08 nos DOIS sistemas
node scripts/sim-ticks.mjs --so V     a escada de penalidades, Tick a Tick
node scripts/sim-ticks.mjs --legado   Pressão em dobro e Centelha ×2: reproduz as §2 a §9
```

Na bancada, os quatro botões novos são **A régua P/G/R**, **O par: ciclo × Golpe**, **Empunhadura
dupla** e **A cadeia de ataques**, e o painel ganhou dois grupos: **O Tick do Golpe** (as três
penalidades de DV) e **Golpes múltiplos** (os dados da dupla e o freio da cadeia). Os botões
**P/G/R (19/08)** e **K1 (18/08)** no topo do painel trocam a régua inteira de uma vez.

> **O motor e a bancada estão em dia desde 20/08** (Fases 1 a 3 do plano da §15): a escada, a
> rajada, a dupla e a Centelha ×1 estão em `scripts/lib-tempo.mjs`, com os presets `REGRAS_HOJE`,
> `REGRAS_NORMAL`, `REGRAS_PGR` e `REGRAS_K1`. Baterias novas: `--so U` (as regras nos dois
> sistemas) e `--so V` (a escada Tick a Tick). Na bancada, o **seletor de sistema** no topo do
> painel troca entre os quatro presets, e as baterias **Os dois sistemas** e **A escada, Tick a
> Tick** medem o que as §14.11 a §14.13 decidiram. `--legado` volta ao regime antigo (Pressão em
> dobro e Centelha ×2) e reproduz as tabelas das §2 a §9.


---

### 14.11. A escada de penalidades (20/08/2026)

**O princípio.** Toda ação física gera penalidade de Defesa; ações defensivas, não. Atacar gera, e
receber ataque gera. A penalidade base é a mesma da Guarda sob pressão do capítulo IX, **−2**, e
tudo o mais é derivado dela.

#### A escada

<p class="formula"><b>Preparo −2 · Golpe −4 · Recuperação −2</b></p>

- **Preparo:** a penalidade normal de atacar. Se a penalidade de atacar mudar, este número muda com
  ela.
- **Golpe:** o dobro. (Está amarrado ao −2 por enquanto, mas pode ser desamarrado se decidirmos.)
- **Recuperação:** a penalidade normal de atacar, **multiplicada por quantos golpes foram dados**.

**Numa cadeia, a escada sobe a cada repetição.** Com três golpes:

| fase | P1 | G1 | P2 | G2 | P3 | G3 | R |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| penalidade | −2 | −4 | −4 | −8 | −6 | −12 | −6 |

A regra geral: **o k-ésimo Preparo custa −2k, o k-ésimo Golpe custa −4k, e a Recuperação custa −2
por golpe dado.** Conferido no motor, espada longa com cadeia de 3:
`P −2 · G −4 · P −4 · G −8 · P −6 · G −12 · R −6 · R −6 · R −6 · R −6`.
*(Com a rajada da §14.12 só existe **uma** preparação, então a escalada de P e G não chega a
acontecer: fica P −2, cada Golpe −4, e a Recuperação por golpe dado. O k-ésimo degrau só aparece
se alguma regra futura voltar a repetir Preparos numa ação.)*

#### As três empunhaduras

| o que faz | Preparo | Golpe | Recuperação | por quê |
|---|:---:|:---:|:---:|---|
| uma arma | −2 | −4 | −2 | a escada normal |
| **duas armas, golpeia com uma** | −2 | **−2** | −2 | a outra arma (ou o escudo) fica livre para o bloqueio naquele Tick |
| **duas armas, golpeia com as duas** | −2 | −4 e −4 | **−4** | o Golpe não dobra (há uma arma livre), a Recuperação conta dois golpes |

#### O que a bancada disse

Todos os números abaixo são contra o campo de oito armas limpas, no motor com a escada ligada.

**A escada base** dá amplitude entre classes de **21,0** contra 16,6 do sistema de hoje, com a arma
leve em **63,1%** e a pesada em 47,7%. O custo está na Recuperação em −2: com −4 a amplitude cai
para 15,1 e a leve para 56,1%. Fica registrado como o preço conhecido da escolha.

**A dupla depende inteiramente da geometria**, e a proposta de dar um Tick a mais de Golpe **e** um
de Recuperação a mata:

| geometria da dupla | leve | média |
|---|:---:|:---:|
| **o Golpe extra sai da Recuperação (ciclo igual)** | **+5** | +17 |
| Golpe +1 Tick (ciclo +1) | −23 | −6 |
| Golpe +1 e Recuperação +1 (ciclo +2) | **−38** | −21 |

Com o ciclo crescendo dois Ticks, a dupla perde 40% da cadência por um golpe a −1d6. Ninguém
escolheria. E a arma média no ciclo igual fica em +17. *(A resolução veio na §14.13, mais tarde no
mesmo dia: ciclo igual para o par de leves, ciclo +1 para a média, e a restrição de classe caiu.)*

**A cadeia, com a escada, dispensa qualquer freio de dado.** Ela sozinha faz o serviço:

| | N=1 | N=2 | N=3 |
|---|:---:|:---:|:---:|
| leve, contra o campo | 63,4% | **45,2%** | 27,6% |
| leve, contra 1 soldado | 100% em 16,5t | 100% em **11,3t** | 100% em 10,4t |
| média, contra o campo | 50,0% | **41,0%** | 31,9% |
| média, contra 1 soldado | 100% em 17,6t | 100% em **14,5t** | 100% em 14,1t |

É exatamente o desenho pedido: contra um igual encadear é mau negócio; contra um mais fraco compra
um terço do relógio por 2 pontos de Vida. *(Esta medição é da geometria `P→G→P→G→R`, que a §14.12
abandonou pela rajada; lá os freios são outros, o −1d6 acumulativo e o +1 de Recuperação por
golpe, e a conclusão sobre "1 Tick de R por golpe ser excesso" vale só para a geometria antiga.)*

#### O Preparo mínimo, medido

Subir o P de todas as armas em 1 e baixar a Recuperação em 1 (leve 1/1/3 · média 2/1/3 · haste
3/1/2 · pesada 3/1/3) **piora a amplitude de 21,0 para 24,8** e não conserta nada que estivesse
quebrado: a cadeia já é punitiva sem ele e a dupla continua dependendo da geometria. O que ele
compra é **de princípio**, e é real: com P ≥ 1 nenhuma ação resolve no Tick em que é declarada,
então **tudo passa a ser legível e interrompível**, e a cadeia da arma leve deixa de ser
`G→G→G→R`. É uma troca de 4 pontos de equilíbrio por consistência de leitura.

---

### 14.12. A rajada (20/08/2026)

**Decidida.** Atacar mais de uma vez com a mesma arma é a **rajada**: uma preparação e os golpes
em Ticks seguidos.

<p class="formula"><b>P → G → G → … → R</b>, declarada de uma vez, sem parar no meio</p>

O preço, por cada golpe além do primeiro:

- **−1d6 no ataque, acumulando** (o 2º golpe rola 1 dado a menos, o 3º rola 2);
- **+1 Tick de Recuperação**;
- e a escada de DV da §14.11 como sempre: Preparo −2, **cada** Tick de Golpe −4, Recuperação −2
  **por golpe dado** (três golpes = −6 até a guarda se refazer).

Teto: **3 golpes** com arma leve ou média, **2** com haste ou pesada. Corpo a corpo apenas: arco,
besta e arremesso não fazem rajada (recarregar é Preparo, e a Recuperação deles já é 0 ou 1, então
não há o que comprimir).

| classe | 1 golpe | rajada de 2 | rajada de 3 |
|---|:---:|:---:|:---:|
| leve | 5t | 7t | 9t |
| média | 6t | 8t | 10t |
| haste | 6t | 8t | (não pode) |
| pesada | 7t | 9t | (não pode) |

#### Por que esta geometria e não a outra

A alternativa era `P→G→P→G→R`, re-preparando a cada golpe. Ela falha por um defeito estrutural:
**o preço dela é o Preparo, e o Preparo é radicalmente desigual entre classes** (0 a 2). Medido:
com dados −1d6 a leve e a média encadeiam **sempre** (58,4% e 55,4% no duelo); subindo para −2d6 o
duelo fecha, mas a haste e a pesada ficam **mais lentas contra o inimigo fraco do que golpeando
uma vez** (18,5t contra 17,1t). Nenhuma escala serve às quatro classes.

A rajada com os dois freios (−1d6 acumulativo e +1 R por golpe) é a única célula do estudo em que
as quatro classes se comportam igual:

| dados 0/−1d6/−2d6 · R +1 por golpe | duelo N=2 | duelo N=3 | 1 soldado, N=2 | N=3 |
|---|:---:|:---:|:---:|:---:|
| leve | 40,3% | 18,9% | 13,1t | 13,2t |
| média | 40,6% | 41,8% | 14,2t | 13,1t |
| haste | 39,4% | 40,0% | 14,3t | 12,7t |
| pesada | 43,7% | 40,6% | 12,9t | 11,4t |

*(um golpe só leva 16,5 a 17,6t contra o soldado; o duelo é contra a mesma arma golpeando normal)*

Duelo em ~40% (punitivo, nunca é a jogada padrão) e um quinto a um terço do relógio economizado
contra o fraco. O freio de "+1 Tick de Recuperação por golpe", que a §14.5 tinha rejeitado, **é
necessário aqui**: na geometria antiga ele era contagem em triplo (o Preparo repetido já cobrava);
na rajada ele é o que substitui o Preparo repetido. Sem ele o duelo fica em 52 a 61% e a rajada
vira a jogada de sempre.

#### O assassino

Vítima surpresa (só a esquiva crua, sem agir; **apenas o primeiro golpe é surpresa**, do segundo em
diante ela esquiva normal). Chance de a ação inteira matar:

| vítima | arma | 1 golpe | rajada de 2 | rajada de 3 |
|---|---|:---:|:---:|:---:|
| lacaio (DV 10, PV 18) | espada curta | 2% | 48% | **83%** |
| | espada longa | 5% | 70% | **97%** |
| soldado (DV 12, PV 26) | espada longa | 0% | 5% | 33% |
| | martelo | 0% | 46% | **79%** |
| igual (DV 14, PV 37) | qualquer | 0% | ~0% | ~0 a 5% |

O teto certo por si: a rajada executa o lacaio quase sempre, o soldado só com arma pesada, e o
igual nunca. Matar um par de verdade continua exigindo a luta. (Com a escala −2d6 a rajada de 3
não mata mais que a de 2, e a fantasia do executor morre; mais um motivo para a escala suave.)

#### As bordas da rajada

1. **Alvos diferentes, golpe a golpe:** pode, qualquer um ao alcance. É o que faz dela a
   ferramenta contra a horda, e o redirecionamento da §2 já cobre o alvo que cai no meio.
2. **Interrupção:** só o Preparo é interrompível; os Golpes seguidos não têm janela. O espelho de
   quem pagou ação fora de hora **empurra os golpes restantes**, não os cancela.
3. **Sem alvo ao alcance:** os golpes restantes se perdem e a Recuperação começa. Sem reembolso:
   declarou três, pagou três.
4. **Não acumula** com a empunhadura dupla nem com Técnicas de ataques extras: uma fonte de golpes
   múltiplos por ação.
5. **Carga voluntária e Mirar** valem só para o primeiro golpe (compram Preparo, e há um só).

---

### 14.13. Uma arma em cada mão (20/08/2026)

**Decidida.**

<p class="formula"><b>Golpear com as duas armas: um Tick de Golpe para cada mão, ambas a −1d6.</b><br>
<b>Par de armas leves: o segundo Golpe come a Recuperação, o ciclo não muda.</b><br>
<b>Com arma média na mão hábil: o ciclo cresce 1.</b></p>

Escada de DV: Preparo −2 · **cada** Golpe −4 (não dobra: sempre há uma arma que ainda não bateu) ·
Recuperação −4 (dois golpes dados). E **segurando a segunda arma (ou o escudo) sem golpear com
ela**, o seu Tick de Golpe fica a **−2** em vez de −4: a outra mão continua guardando.

#### Contra a rajada

| modo | ciclo | duelo | 1 soldado | 2 lacaios |
|---|:---:|:---:|:---:|:---:|
| leve · um golpe | 5t | 50,9% | 16,5t | 20,0t |
| leve · rajada de 2 | 7t | 40,3% | 13,1t | 15,3t |
| **leve · dupla (ciclo igual)** | **5t** | **54,8%** | **11,0t** | **12,5t** |
| média · um golpe | 6t | 49,6% | 17,6t | 22,5t |
| média · rajada de 2 | 8t | 40,6% | 14,2t | 15,8t |
| **média · dupla (ciclo +1)** | **7t** | **42,2%** | **13,8t** | **15,4t** |

A dupla ganha da rajada em todas as colunas, nas duas classes, que era a exigência ("tem de ser
mais interessante usar duas armas do que atacar duas vezes com a mesma"). O par de leves fica
levemente melhor até em duelo (+4, a identidade do lutador de duas adagas, pequena o bastante para
não virar obrigação); a média em duelo é aposta ruim (−7) e contra os fracos é a ferramenta mais
rápida da classe.

#### Por que os dados não podem ser melhores que os da rajada

A intuição pede o contrário do decidido: quem investiu em duas armas deveria golpear com **menos**
penalidade do que quem repete a mesma arma. Medido, quebra em qualquer geometria:

| dupla com dados 0/−1d6 | leve | média |
|---|:---:|:---:|
| ciclo igual | 85,5% | 80,4% |
| ciclo +1 | 61,5% | 56,9% |
| ciclo +2 (o tempo da rajada) | 40,3% | 40,6% |

As duas primeiras linhas são o "compensa sempre". E a terceira é a prova de identidade: com os
dados da rajada **e** o tempo da rajada, a dupla dá exatamente os números da rajada (até a casa
decimal), ou seja, vira a mesma manobra com outro nome. Não há como ter as duas moedas:
**o tempo é a identidade da dupla, os dados são o custo dela.** A ficção fecha: na rajada o
primeiro golpe é mirado com tudo, mas o braço recolhe e bate de novo (−1d6 no segundo, +1 R); na
dupla as mãos batem quase juntas sem recolher nada, mas coordenar dois gumes tira precisão das
duas.

#### Rajada × dupla, o retrato

Acerto por golpe (pool 5d6+4): cheio 40/78/97% contra DV 22/18/14 · a −1d6 10/44/84% · a −2d6
0/9/50%. Por ação contra DV 18: um golpe 6,2 de dano · rajada de 2 **9,3** · dupla 6,1. A rajada é
a **ação** mais forte (o golpe cheio é o único que entra numa guarda alta); a dupla é o **ritmo**
mais forte (repete mais e se expõe menos, e por isso vence as simulações completas, onde a Defesa
real média é ~18). Para a mesa: **rajada contra o casco grosso, dupla contra a maré.**

#### Por que a média paga 1 Tick e a leve não

Tirando o Tick extra da média, a dupla dela vai a **67,7%** (contra 49,6% da base): vira
obrigatória, mata a rajada da classe e apaga a identidade do par de leves. O motivo estrutural é o
de sempre: o golpe da média entrega ~6,5 depois da Absorção contra ~4,5 da leve, então **golpe
extra grátis vale mais quanto maior a arma**. A leve aguenta o golpe extra de graça; a média não.
Na regra: **a rajada paga em Recuperação (o braço recolhe), a dupla de média paga em Golpe (a mão
fraca atrasa o tempo do par).**

#### O que fica aberto aqui

- **Ambidestria (K18):** os dados não podem melhorar (tabela acima), então os candidatos são o
  alívio defensivo mesmo golpeando com as duas (Golpes a −2 em vez de −4) ou tratar par com média
  como par leve (mediria 67,7%: descartado). Sem decisão.
- **O escudo** entra na mesma estrutura (segurar sem golpear = alívio, mais o Bloqueio dele), mas
  medir isso está travado pela **K14**.
- **A empunhadura de DUAS MÃOS** (Força ×2 na mesma arma) apareceu nesta discussão e é um problema
  **de hoje**, maior que esta seção: ver K21 no `Pendencias.md`.
---

## 15. Os dois sistemas, e o plano de implementação (20/08/2026)

**A decisão de arquitetura:** o jogo terá **dois sistemas de tempo**, à escolha do mestre por
mesa, e **um só conjunto de regras**:

- o **sistema normal**, o de hoje: a ação custa a Velocidade e resolve no primeiro Tick;
- o **sistema P/G/R**, o desta revisão: a mesma Velocidade partida em Preparo, Golpe e
  Recuperação.

Todas as decisões novas (a escada de penalidades, a rajada, a dupla, o deslocamento pago, a
dívida de Ticks) **valem nos dois**. Para isso elas são escritas em **moeda comum**: Ticks de
Velocidade, dados de rolagem e pontos de Defesa, nunca em termos que só existem num dos sistemas.

### 15.1. A tabela de tradução

| regra | no sistema normal | no sistema P/G/R |
|---|---|---|
| **a escada** | no Tick em que o seu golpe sai, Defesa **−4**; depois, **−2 por golpe dado** até a sua próxima ação | Preparo **−2** · Golpe **−4** · Recuperação **−2 por golpe dado** |
| **Pressão recebida** | −2 por ataque sofrido, acumulando até agir (como hoje) | idem, zera quando o ciclo fecha |
| **rajada** | ataque N vezes numa ação: **Velocidade +2 por golpe extra**, −1d6 acumulativo, teto 3/3/2/2 por classe | o mesmo +2, na anatomia: +1 Tick de Golpe e +1 de Recuperação por golpe extra |
| **dupla (dois golpes)** | **mesma Velocidade**, −1d6 nas duas mãos | par de leves: mesmo ciclo · com média: **ciclo +1** |
| **dupla (segura e golpeia com uma)** | no Tick do golpe, −2 em vez de −4 | idem (é a fase G) |
| **deslocar-se depois de atacar** | 2 Ticks por metro, pagos como dívida | idem (é a fase R) |
| **ação fora de hora, dívida, espelho** | igual | igual |
| **abortar o que ainda não saiu** | só as Artes (as únicas com montagem visível) | qualquer Preparo |
| **ler e interromper o gesto** | só as Artes telegrafam | tudo com P ≥ 1 telegrafa |

A última linha é o que o P/G/R **compra**: no sistema normal a camada de leitura e interrupção só
existe contra conjuradores; no P/G/R ela vale para o martelo também. O resto é idêntico.

### 15.2. A sanidade da tradução, medida

O motor roda o sistema normal com `usarPreparo: false` (todo P vira zero e o Golpe cai no Tick da
declaração), então as regras novas puderam ser medidas **nos dois lados** (8 armas limpas):

| sistema | leve | média | haste | pesada | amplitude |
|---|:---:|:---:|:---:|:---:|:---:|
| hoje, sem nada de novo | 55,7% | 41,0% | 52,6% | 57,1% | 16,2 |
| **normal + regras novas** | 55,0% | 40,5% | 53,6% | 57,2% | **16,7** |
| P/G/R + regras novas | 63,3% | 41,6% | 53,6% | 47,6% | 21,7 |

As regras novas são **quase neutras no sistema normal** (16,7 contra 16,2): a escada colapsa para
o que o capítulo IX já cobrava, mais o −4 no Tick do golpe. E as manobras medem bem nos dois:

| manobra, no sistema normal | ciclo | duelo | 1 soldado |
|---|:---:|:---:|:---:|
| leve · rajada de 2 | 7t | 40,3% | 13,1t |
| leve · dupla (mesma Vel) | 5t | 54,8% | 11,0t |
| média · rajada de 2 | 8t | 46,3% | 12,9t |
| média · dupla (mesma Vel) | 6t | **46,7%** | 12,9t |

**A única regra que se calibra diferente por sistema é a dupla de arma média:** no P/G/R ela
precisa do ciclo +1 (sem ele, 67,7%); no normal ela fecha na **mesma Velocidade** (46,7%; com +1
despenca para 25,3%). A tabela da §15.1 já registra os dois valores. Todo o resto traduz 1 para 1,
incluindo a leve, que dá os mesmos números nos dois sistemas (P = 0 os torna idênticos para ela).

### 15.3. O plano, em fases

As incongruências conhecidas hoje são três, e o plano existe para fechá-las: **o motor e a
bancada implementam a régua de 19/08** (não a escada nem a rajada); **o catálogo diverge da regra
das versáteis** (K21); e **o capítulo IX não tem nada disto**. Uma fase para cada, mais o chão.

**Fase 1 · O motor** (`scripts/lib-tempo.mjs`). Portar o que foi decidido em 20/08: a escada
(Preparo/Golpe/Recuperação por golpe dado), a rajada (`P→G→G→R` com +1 R por golpe extra e o
−1d6 acumulativo), a dupla (as duas geometrias e o alívio do Tick do Golpe), e os quatro presets:
**HOJE** (o normal puro), **NORMAL+NOVAS**, **P/G/R (20/08)** e os legados (19/08 e `--legado`
para as tabelas antigas). Critério de pronto: reproduzir as tabelas das §14.11 a §14.13 e da
§15.2.

**Fase 2 · O relatório em lote** (`sim-ticks.mjs`). Três baterias novas: a escada nos dois
sistemas, a rajada nos dois, a dupla nos dois. As baterias Q/R/S/T de 19/08 continuam existindo
como registro.

**Fase 3 · A bancada. FEITA em 20/08.** O painel ganhou o seletor de **sistema** com os quatro
presets, cinco cartões novos na aba de regras (os dois sistemas, a escada, a rajada, a dupla e a
Centelha ×1), e duas baterias: **Os dois sistemas** (o perfil dos três presets mais as manobras
lado a lado, com a coluna Δ verde quando a regra dá o mesmo número nos dois) e **A escada, Tick a
Tick** (a Defesa perdida em cada Tick, pintada por fase). O smoke cobre o seletor e as baterias.
A bancada voltou a ser a verdade única.

**Fase 4 · O capítulo IX** (quando as pendências de decisão fecharem). As regras em moeda comum
entram no capítulo **valendo já no sistema normal**: a escada, a rajada, a dupla nova (que
conserta a armadilha atual dos 22,7%), o deslocamento pós-ataque e o catálogo de ações fora de
hora. O P/G/R entra como capítulo opcional ("O combate em três fases"), com a régua por classe,
o abortar, a leitura e o rastreio. Junto: as notas de superação nas seções antigas deste
documento migram para o texto final e morrem aqui.

**Fase 5 · Os dados. FEITA em 20/08.** O bloco `combate` entrou em `regras.json`: os dois
sistemas com o texto de cada um, os dois modos de marcação, a régua P/G/R por classe (com as de
distância e arremesso derivando da Velocidade), a régua da Arte, a escada, a rajada com os tetos,
a dupla com o ciclo extra por sistema, o deslocamento pago e a dívida de Ticks. A régua não pediu
nada de `armas.json`: o Preparo deriva da classe, que já estava lá. **À parte e sem pressa:** o
acerto do catálogo das versáteis (K21), que tem decisões próprias de preço e não bloqueia nada.

**Fase 6 · Ficha e mesa. FEITA em 20/08.** Quatro peças:

- **`src/lib/combate-tempo.ts`**, o motor da tela: puro, sem DOM e sem banco, lendo tudo do bloco
  `combate`. Dá a anatomia da ação (`anatomia`), monta a agenda (`declarar`), lê a fase (`faseEm`),
  cobra a escada (`defesaPerdida`) e responde as três perguntas da mesa: dá para interromper, dá
  para agir fora da hora, quanto custa reagir. Usa a MESMA estrutura de agenda do motor da bancada
  (`offs` lá, `golpes` aqui), para não haver duas verdades sobre a mesma coisa. Travado por
  `scripts/test-combate-tempo.mjs`, que confere a régua arma a arma contra o catálogo, a escada
  contra a §14.11 e a degeneração do sistema normal.
- **A migração 27**: `mesas.combate` (o sistema e a marcação, como o `revelar` da 14) e
  `combatentes.acao` (a agenda, `livre`, o tipo, a arma, o alvo, a dívida e a Pressão). A view
  `combate_visao` devolve `acao` **sem `arma` e sem `alvo`** para quem não pode ver os números: o
  jogador vê QUE alguém está montando alguma coisa, o mestre vê O QUÊ.
- **O rastreador de combate** (`/mesa/combate`): o botão **⏱** abre o painel do mestre, com os dois
  sistemas, as duas marcações e uma amostra desenhada com a régua de verdade. O card ganhou o selo
  de fase e a fita; o painel do turno mostra as fitas de todo mundo alinhadas na coluna do agora,
  com a lista de quem está montando o gesto. A escada entrou em `defesaAtual`, então o número que
  o mestre lê já vem com o desconto da fase. O diálogo de ação ganhou a **manobra** (um golpe,
  dupla, segura-e-golpeia, rajada), que manda na Velocidade e rola **uma jogada por golpe**, cada
  uma com a penalidade dela.
- **O Grid**: o anel dourado no token de quem golpeia neste Tick, o contorno tracejado em quem
  está montando, a fita miúda na coluna de iniciativa e o mesmo painel **⏱** na barra.

A fita degenera com elegância no sistema normal, como prometido: o Golpe cai no Tick da declaração
e o resto do ciclo é Recuperação. O anel de Golpe fica ligado mesmo com a marcação em "só os
números", porque no P/G/R o Tick do golpe não é o Tick da pessoa e nenhum número da fila responde
"quem bate agora".

**O que NÃO bloqueia as fases 1 a 3:** K12 (teste de Virtude), K14 (escudo), K17/K4 (arqueiro),
K21 (versáteis) e K11 (Alabarda/Maça) são decisões de regra e catálogo; o motor e a bancada podem
ficar prontos antes delas. K12 e K17 bloqueiam partes do texto da Fase 4.

**Estado:** Fases 1, 2, 3, 5 e 6 **feitas** em 20/08. Só a **Fase 4** (o capítulo IX) continua
aberta, e espera K12 e K17.

### 15.4. O que a mesa ainda não faz

O que está no site é o **rastreio**, o **abortar** e, desde 21/08, o **ataque do tabuleiro ligado
à régua**: a mesa desenha o tempo, cobra a escada, conta os golpes, deixa desistir do gesto e
declara a ação por onde a luta for resolvida. O que ela ainda não faz são duas das ações da §14.6:

- **a ação fora de hora** com a dívida somada sozinha, e o **espelho** que atrasa quem foi
  interrompido em tantos Ticks quantos o interruptor pagou;
- **o deslocamento pago na Recuperação** (2 Ticks por metro, K20).

As duas são conta pronta em `combate-tempo.ts` (`podeAgirForaDeHora`, `custoDeReagir`,
`ticksDeDeslocamento`); falta o gesto na tela. O mestre resolve as duas na mão hoje, empurrando o
Tick, que é o que ele já fazia antes desta revisão.

**O abortar foi feito em 21/08.** `abortar()` no motor da tela, travado no
`test-combate-tempo.mjs` (só no Preparo, os Ticks investidos perdidos, 1 Tick por metro, e nada
no sistema normal, que não tem Preparo). Na mesa é um botão **✋** que **só acende quando cabe**:
ele aparece no card e no painel do turno de quem está em Preparo, e no menu da peça no tabuleiro.
No Golpe e na Recuperação ele simplesmente não está lá, e a regra se ensina pela ausência em vez
de por um aviso depois do clique. A caixa mostra a conta antes de confirmar (quantos Ticks se
perde, quantos do ciclo voltam, em que Tick se fica livre) e pergunta **para quê**: desviar, mover
ou se interpor. Atacar não está na lista, que é o ponto.

**No tabuleiro é do mestre**, como todo o resto que mexe no relógio: o jogador escreve em
`combatentes` pelas funções `jogador_*` da migração 22, e não há uma para isto. Dar o botão a ele
é uma `jogador_abortar` e uma decisão de segurança, e vai junto com a ação fora de hora, que tem
o mesmo problema. (O ataque já tem a dele: a `jogador_declara` da migração 28.)

### 15.5. O ataque do tabuleiro entra na linha do tempo (21/08/2026)

Até aqui o Grid **desenhava** o P/G/R e não **participava** dele. Atacar pelo tabuleiro aplicava o
dano e mais nada: não gastava o Tick, não criava a agenda de golpes (então a fita só enchia por
quem passasse pela aba Combate) e não somava a Guarda sob pressão no alvo. Quem declarava pelo
rastreador tinha tudo; quem jogava pelo tabuleiro, que é onde a luta acontece, não tinha nada.

**O que passou a acontecer**, no mesmo caminho que o rastreador já usava:

| ao atacar pelo Grid | antes | agora |
|---|:---:|:---:|
| o dano chega | sim | sim |
| a agenda de golpes nasce | **não** | **sim** |
| o relógio do atacante anda | **não** (o `⏭` à mão) | **sim**, o ciclo inteiro |
| o alvo leva Guarda sob pressão | **não** | **sim**, uma por golpe |
| a Defesa mostrada traz a escada | **não** | **sim** |

**Errar gasta o mesmo.** A declaração acontece entre os dois caminhos, e não dentro de um: a
Pressão conta o *ataque*, não o acerto, e o braço que passou perto gastou o mesmo tempo do braço
que pegou. Fechar a caixa no Escape, isso sim, não gasta nada: desistir não é errar.

**A manobra entrou na caixa do alvo**, filtrada como no rastreador (a rajada só para quem pode, a
dupla só para quem tem arma na mão inábil), com o P/G/R e a penalidade de dados por golpe à vista
antes de responder.

**E o jogador também**, o que pediu duas coisas. A primeira é a **migração 28**: a `jogador_muda_peca`
da migração 22 abre quatro colunas (`pv_atual`, `mana_atual`, `condicoes`, `ativo`) e ignora em
silêncio o que não reconhece, então sem uma função nova o ataque do jogador aplicaria o dano e o
relógio dele ficaria parado, que é pior do que o comportamento antigo. A `jogador_declara` é mais
estrita que a irmã de propósito: exige ser **dono** da peça que age, porque o relógio de alguém é a
coisa que mais decide a luta. Sobre o alvo a regra volta a ser a da mesa, e só a chave `pressao` é
tocada, por soma.

### 15.6. E a Arte também (21/08/2026)

Mesma emenda, do outro lado do tabuleiro. Conjurar gravava o efeito com
`desde_tick` = agora: a bola de fogo caía no instante do clique, o relógio da conjuradora não
andava, e a montagem que a §5.3 do Arcano descreve, e que é o exemplo mais antigo de gesto
telegrafado no sistema, não existia em lugar nenhum.

**A anatomia da Arte é própria, e já estava escrita:** ela resolve no **último** Tick da montagem,
e não no primeiro. Então o Preparo é o ciclo menos um, o Golpe é o último Tick e não há
Recuperação. É a mesma forma da arma de distância, e pelo mesmo motivo: o que custa é armar, não
recompor.

**A Velocidade vem da caixa**, não de uma régua nova. O assistente de conjuração já tinha o campo
editável (padrão 6, zero para o Efeito de ação livre), com o comentário de que `regras.json` tem
uma régua própria "que nem sempre é a que a mesa quer usar". Ligar a Arte à régua é usar esse
número, e não passar por cima dele. Zero continua sendo zero: **ação livre não gasta a vez e não
cria gesto para interromper**, que é o que ela é.

**O efeito nasce no Tick do Golpe.** Com Velocidade 6, quem conjura no Tick 3 vê a Aura nascer no
8, e a duração conta a partir dali. Enquanto o relógio não a alcança, `montando()` diz que ela
ainda está na mão de quem conjura: **não queima ninguém e não é obstáculo**. Cobrar a mordida antes
da hora daria de graça os Ticks que a regra existe para cobrar.

**E aqui a assimetria da §14.7.1 vale igual:** a mancha em montagem é desenhada **só para o
mestre**, apagada e tracejada. O grupo vê que a feiticeira está montando alguma coisa, porque a
fita dela diz isso; onde a coisa vai cair é informação que se compra prestando atenção na mesa. O
painel lateral troca o número da direita enquanto isso: em vez do que falta para acabar, o que
falta para **cair**.

*(A Mana já era descontada desde antes, no `finally` do `conjurar`. O que faltava era o tempo, e
ele passou a sair pelo mesmo lugar, pelo mesmo motivo: o módulo sabe quanto custou, a aba sabe
quem pode escrever.)*

**O que a Arte ainda não faz:** somar Guarda sob pressão em quem ela pega. Para a Arte de área a
§5.4 diz que não há Esquiva a opor, e se a Pressão cabe aí é decisão de regra, não de código; para
a Arte **mirada**, que rola Percepção + Acerto Arcano, ela deveria caber, e o assistente ainda não
separa uma da outra.

---

A segunda foi um achado: **o Grid só digeria fichas para o mestre.** O bloco inteiro de `RESUMO`,
`PERFIL` e `FICHAS` vivia dentro de um `if (MESTRE)`, e do lado do jogador nem a peça dele tinha
bloco de combate. Dava para viver com isso enquanto o tabuleiro só desenhava; com a régua saindo
da arma, deixou de dar: um jogador de martelo declarava 5 Ticks em vez de 7, porque sem ficha a
classe caía no atalho. Agora o jogador digere **a própria ficha, e só ela** — a RLS de
`personagens` já responde quais são as dele. O bloco de combate dos outros continua sem ser
montado do lado dele, que é o que impede a Absorção do ogro de viajar até o navegador do grupo.

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
