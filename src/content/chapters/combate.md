---
ordem: 15
numeral: "IX"
titulo: "Combate Físico"
resumo: "Como uma luta funciona: a linha do tempo, o ataque, o dano, a defesa, o movimento, a vantagem tática e as Técnicas."
---

O combate não corre em turnos rígidos: corre numa **linha do tempo de Ticks** (cada um ≈ **1 segundo**). Cada ação custa um tempo (a sua **Velocidade**) e, depois de agir, você só volta a jogar quando esses Ticks passarem. Escolher *quando* agir vale tanto quanto *como*.

## Como uma luta acontece

Antes dos detalhes, o esqueleto de uma briga, do começo ao fim:

1. **Role a Iniciativa** (1d6 + Raciocínio + Prontidão): ela diz **em que Tick cada um entra** na linha de Ticks.
2. **Na sua vez, escolha uma ação.** Cada ação custa um tempo (a **Velocidade**); após agir, você só volta quando esses Ticks passarem.
3. **Para acertar, role seu pool de ataque** e compare com a **Defesa** do alvo: um número fixo. Se o total **superar** a Defesa, você acerta (empate erra).
4. **Quanto melhor o acerto, mais forte o golpe:** a cada **6 pontos acima da Defesa**, o dano ganha **+1d6**, isso se chama **Margem**.
5. **O dano, menos a Absorção** (a absorção do alvo), vira ferimento.
6. **Quem chega a 0 de Vida desmaia (fica Incapacitado).** Ferimentos, morte e sangramento são assunto do próximo capítulo, [Vida, Ferimentos & Cura](/regras/vida-ferimentos-cura).

<div class="callout exemplo"><span class="lbl">Exemplo</span>Sora ataca um bandido de <strong>Defesa 20</strong>. Seu pool de ataque dá <strong>5d6+9</strong> (Destreza 6 + Armas 5, mais o acerto da espada e a Centelha); ela rola 17 nos dados e soma <strong>26</strong>. 26 supera 20 → acerta, com diferença de 6, exatamente <strong>uma Margem</strong>, então o dano ganha <strong>+1d6</strong>. Ela rola o dano da espada (1d6) + a Margem (1d6) + a Força, desconta a Absorção do bandido, e o que sobra abre ferimento.</div>

No osso, é só isso. O resto do capítulo são as camadas que dão profundidade tática: **quando** agir, **como** se mover, **usar a posição** e **desencadear Técnicas**.

## A linha do tempo: Ticks, Velocidade e Iniciativa

No início, cada um rola a **Iniciativa = 1d6 + Raciocínio + Prontidão** (de 2 a 18 em quem tem ficha). A Iniciativa não leva Centelha, Especialidade nem penalidade ([Cap. V](/regras/centelha)). Ela é rolada **uma vez só** e serve para uma coisa: dizer **em que Tick cada um entra na luta**. Depois disso quem manda é o relógio de cada um.

<p class="formula">Quem tirar o maior entra sozinho no <strong>Tick 1</strong> · os demais entram <strong>um Tick depois por degrau de 6 pontos</strong> de atraso, arredondando para cima</p>

Cada degrau custa também **1d6 na ação**: é o **contrapé**, de quem chegou atrasado à briga e ainda está reencontrando o eixo. (Empate na maior iniciativa: entram juntos no Tick 1, e age primeiro quem tiver o maior Raciocínio; persistindo, decidam no 1d6.)

| Atrás da maior | Entra no | Contrapé |
|---|:---:|:---:|
| — (é a maior) | Tick 1 | — |
| 1 a 6 | Tick 2 | −1d6 |
| 7 a 12 | Tick 3 | −2d6 |
| 13 a 18 | Tick 4 | −3d6 |

<div class="callout exemplo"><span class="lbl">Exemplo</span>Cinco combatentes rolam <strong>13, 12, 10, 9 e 5</strong>. O 13 entra sozinho no <strong>Tick 1</strong>. O 12, o 10 e o 9 estão de 1 a 4 atrás, um degrau: entram no <strong>Tick 2</strong>, com <strong>−1d6</strong>. O 5 está 8 atrás, dois degraus: entra no <strong>Tick 3</strong>, com <strong>−2d6</strong>.</div>

### O contrapé desce sozinho

O contrapé **cai 1d6 a cada Tick que passa**, e não depende de você fazer nada: ele é do relógio, e não da sua ação. Quem entrou no Tick 3 com −2d6 escolhe entre **bater no Tick 3 por −2d6**, **no Tick 4 por −1d6** ou **no Tick 5 inteiro**.

Essa é a decisão que a iniciativa cria, e ela é real: num sistema em que a jogada é *total supera a Defesa*, **um dado a menos corta a chance de acertar quase pela metade**. Esperar custa tempo, e tempo, aqui, é a moeda de tudo. A vantagem de quem rolou bem não é "o outro erra": é **o outro chega depois**.

<p class="muted">E é por isso que o contrapé não se apaga fazendo qualquer coisa. Se bastasse gastar um Tick com uma bobagem para limpá-lo, a jogada certa seria sempre essa, e uma penalidade que vale metade da luta não pode custar um instante.</p>

Cada ação tem uma **Velocidade**, quantos Ticks ela custa antes de você poder agir de novo:

| Ticks | Tipo de ação | Exemplos |
|:---:|---|---|
| 3 | Muito rápida | correr, saltar, abrir porta, sacar arma, levantar-se |
| 4 | Utilitária | pegar item, interagir com o cenário (também é a Velocidade da Shuriken, da Mini-faca e da Kunai, armas de ataque) |
| 5 | Ataque leve | faca, adaga, espada curta, bastão, adaga de arremesso, plumbata |
| 6 | Ataque médio | espada longa, machado de uma mão, lança, arco curto, azagaia |
| 7 | Ataque pesado | martelo de guerra, montante, alabarda, arco longo e composto |
| 9 a 15 | Ação demorada | recarregar uma besta |
| 5 a 7 (esticada: 10 em diante) | Arte | conjurar uma Arte: 5 a 7 Ticks, pela escada de As Artes; esticar a conjuração a leva a 10, 15, 20 e adiante |

<p class="muted">Armas leves agem mais vezes e defendem melhor; as pesadas batem como um trovão, mas deixam você exposto entre os golpes. A arma define o seu estilo. A tabela é uma <strong>lista de exemplos</strong>, não um contrato: o "Tipo de ação" é só orientação de leitura, e a Velocidade real de cada arma está no catálogo de <a href="/centelha-rpg/regras/armas-e-armaduras">Armas &amp; Armaduras</a>.</p>

<p class="muted"><strong>A tabela não termina no 7.</strong> Ela desenha a faixa em que quase tudo cai, e não um teto: a Velocidade é só quantos Ticks a ação custa, e nada impede uma de custar mais. As <strong>bestas</strong> são o caso concreto (9, 12 e 15, pela recarga), e as Artes esticadas passam de 7 pela escada do capítulo das Artes. Acima de 7 a diferença não é de regra, é de exposição: quem se compromete por doze Ticks fica doze Ticks com a escada de Defesa aberta em cima.</p>

## Preparo, Golpe e Recuperação

Por baixo da Velocidade, toda ação de ataque se divide em fases, e o capítulo já usa os três
nomes antes de defini-los (a Investida, a Recarga, "Golpes no mesmo instante"): **Preparo** (o
tempo até o golpe estar pronto), **Golpe** (o instante em que ele sai, sempre **1 Tick**) e
**Recuperação** (o que sobra da Velocidade depois do golpe).

<p class="formula">Preparo + Golpe + Recuperação = Velocidade</p>

Toda arma tem **ao menos 1 Tick de Preparo**, e a conta é **Preparo = Velocidade − 1 − Recuperação**, com o Golpe sempre em 1 Tick. O Preparo e a Recuperação dependem da **classe da arma**:

| Classe | Velocidade | Preparo | Golpe | Recuperação |
|---|:---:|:---:|:---:|:---:|
| Leve | 5 | 1 | 1 | 3 |
| Média | 6 | 2 | 1 | 3 |
| Haste média | 6 | 2 | 1 | 3 |
| Haste de Guerra | 7 | 3 | 1 | 3 |
| Pesada | 7 | 3 | 1 | 3 |
| Punhos | 5 | 1 | 1 | 3 |
| Arremesso leve | 4 | 2 | 1 | 1 |
| Arremesso médio | 5 | 3 | 1 | 1 |
| Arremesso pesado | 6 | 3 | 1 | 2 |
| Funda | 6 | 4 | 1 | 1 |
| Arco Curto | 6 | 4 | 1 | 1 |
| Arco Longo e Composto | 7 | 4 | 1 | 2 |
| Besta Pequena | 9 | 7 | 1 | 1 |
| Besta Média | 12 | 9 | 1 | 2 |
| Besta Grande | 15 | 12 | 1 | 2 |
| Azagaia com atlatl | 8 | 5 | 1 | 2 |
| Arte (conjuração) | 5 a 7 | Velocidade − 1 | 1 | 0 |

A **Haste** se divide em duas: a **média** (Lança, Bordão, Cajado, Tridente, Arpão) e a **de Guerra** (Foice Grande, Lança Longa, Alabarda, Glaive, Guisarme, Poleaxe), maior e mais lenta. No corpo a corpo o Golpe cai no Tick logo depois do Preparo, e sobram três Ticks de Recuperação. Nas armas de **tiro** (os arcos, as bestas, a Funda e o Arremesso) o Golpe cai no Tick **imediatamente antes da Recuperação**, que **toda arma de tiro tem**: quase toda a Velocidade é Preparo, e é por isso que a Besta Grande (Velocidade 15) passa **doze Ticks** armando, com a guarda aberta, um Tick de Golpe e dois de Recuperação. No sistema Normal, o padrão deste capítulo, o tiro já foi rolado na declaração (ver *Dois sistemas de tempo*); esses Ticks marcam quanto tempo a guarda fica aberta. Até o Arremesso leve tem um Tick de Recuperação depois do Golpe, o de voltar à postura.

Cada fase custa Defesa, pela mesma moeda: estar comprometido com um gesto abre a guarda.

<p class="formula">Preparo: Defesa −2 · Golpe (o Tick em que ele sai): Defesa −4</p>

É a régua que já apareceu em *Correndo* (o mesmo −4 do Tick do Golpe), na Investida e na Recarga
(o −2 do Preparo) e em *Golpes no mesmo instante* (o −4 no Tick do golpe). Empunhar duas armas e
golpear só com uma alivia esse −4 para **−2** no Tick do Golpe: a outra mão continua guardando.

### Distância e tempo de voo

Cada arma de tiro tem uma **Efetiva** (a coluna Efetiva em [Armas & Armaduras](/regras/armas-e-armaduras)): a distância até a qual a distância não atrapalha a mira. **Além dela, cada meia Efetiva custa −3 no acerto, sem teto**: com a Efetiva E e o alvo a uma distância d, são n = ⌈(d − E) ÷ (E ÷ 2)⌉ passos, e a penalidade é −3 × n. Ela entra na jogada de acerto, e não na Defesa do alvo. No sistema P/G/R o projétil também leva tempo, e o tempo é o mesmo n:

- **Até a Efetiva**, o projétil chega no **mesmo Tick do Golpe**.
- **Cada incremento além dela soma 1 Tick** entre o Golpe e a chegada: −3 no acerto e +1 Tick de voo, por incremento.
- O ataque é **rolado no Golpe** e vale contra a **Defesa do alvo no Tick da chegada**: o alvo se defende no Tick em que o projétil chega.
- A **distância e o n ficam fixos no disparo.** Se o alvo sair da linha antes da chegada, o **Mestre decide** se escapou; o mesmo vale para um aliado, uma cobertura ou um terreno que entre na linha durante o voo.
- Na **Guarda sob pressão**, o ataque conta como **recebido** no Tick da chegada, e não no do Golpe.
- O **bumerangue de retorno** volta no mesmo número de Ticks que levou para ir. Até a Efetiva, a ida leva 0 Ticks e a volta também, porque a arma está na mão ao fim do Golpe.

<div class="callout exemplo"><span class="lbl">Exemplo</span>A <strong>Adaga de Arremesso</strong> (Efetiva 10 m) contra um alvo a <strong>25 m</strong>: n = 3, <strong>−9</strong> no acerto, e o projétil chega <strong>3 Ticks depois do Golpe</strong>. O <strong>Arco Longo</strong> (Efetiva 50 m) contra um alvo a <strong>150 m</strong>: n = 4, <strong>−12</strong>, chega 4 Ticks depois. Na Máxima do arco (Arco Longo com Força 3: 250 m): n = 8, <strong>−24</strong>, 8 Ticks de voo.</div>

**O sistema Normal não tem tempo de voo**: o tiro continua rolado na declaração, e o projétil chega no mesmo instante. Isso favorece um pouco quem atira de longe, e é aceito: o equilíbrio do jogo é medido no P/G/R.

## Dois sistemas de tempo, e qual é o padrão

Existe mais de um jeito de jogar esta mesma régua, e o que muda é o **quanto** se separam
Preparo, Golpe e Recuperação em Ticks distintos.

- **Normal** (**o padrão desta mesa**, e o sistema deste capítulo): a ação resolve inteira no
  Tick da declaração, com a Defesa em −2 durante o Preparo e −4 no Tick do golpe, exatamente
  como descrito acima, e **−2 até a próxima ação** pelo ataque que acabou de fazer (a Guarda sob pressão). **Rola-se ao declarar**, em todo golpe de arma: o acerto e o
  dano valem no Tick da declaração, e o Preparo e o Golpe que vêm depois só marcam a Defesa em −2 e
  em −4. A Velocidade é a soma do Preparo, do Golpe e da Recuperação, e a Defesa fica aberta em todos os Ticks da ação, num custo total de **2 × Velocidade + 2**, seja qual for a divisão entre Preparo e Recuperação. A **Arte** é a exceção: só o tamanho de cada parâmetro se declara no primeiro Tick, e a Arte rola e produz o efeito no último Tick da Velocidade (ver O tempo da Arte, em As Artes). Não há um Tick isolado de Recuperação: a Velocidade inteira empurra a
  próxima ação, e é por isso que este capítulo fala em "Velocidade" e raramente em
  "Recuperação" sozinha.
- **Três fases (P/G/R)**, usado na mesa tática (o Grid): a mesma Velocidade se abre em Ticks
  separados de verdade. Todo gesto de ataque **telegrafa** (tem sempre ao menos 1 Tick de Preparo: dá para ver e
  interromper, não só o de quem conjura), e a Recuperação cobra **−2
  de Defesa por golpe ainda pendurado**, a mesma Guarda sob pressão do Normal, além do Preparo e do Golpe. No Preparo ainda dá para
  desistir; na Recuperação já não dá, só dá para pagar. A variante **Simultâneo (Tick a Tick)**
  é a mesma física do P/G/R rodando um Tick por vez no tabuleiro digital, com o deslocamento
  acontecendo passo a passo.

<p class="muted">Na mesa presencial, todos que agem no mesmo Tick rolam juntos; a ordem de resolução serve só para anotar.</p>

## O ataque: acertar e a Margem

Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. Você acerta se o total **superar a Defesa** do alvo (empate erra).

<p class="muted"><strong>A Especialidade não é parcela somada numa rolagem.</strong> Se o escopo nomeado dela se aplica ao que você está fazendo (Armas <em>(machados)</em> com um machado na mão), ela rende <strong>+N dados, descartando os N menores</strong>, onde N é o nível. É por isso que ela sobe a confiança do golpe sem mexer no teto dele.</p>

<p class="formula">Ataque = [(Atributo + Habilidade) ÷ 2]d6 (+2 se a soma for ímpar) + Arma + 2 × menor(Centelha, Habilidade)</p>

<p class="muted">O <strong>Atributo</strong> usado em combate corpo a corpo (armas ou punhos) é <strong>Destreza ou Força</strong>, à escolha de quem ataca, normalmente o maior dos dois (Força 5 e Destreza 2? use a Força). Para <strong>arremessos</strong>, sempre Destreza; para <strong>atirar</strong> (arco ou besta), sempre Percepção.</p>

A Defesa é um valor **fixo** e **passivo**, o alvo não rola para se defender. A Habilidade que
entra é **Esquiva ou Bloqueio**, detalhado a seguir em *Esquivar ou Bloquear*:

<p class="formula">Defesa = (Destreza + Habilidade) × 2 + Especialidade + 2 × menor(Centelha, Habilidade)</p>

Acertar não é tudo ou nada: a cada **6 pontos acima da Defesa**, você ganha **1 Margem**, e cada Margem vira **+1d6 de dano**. Um acerto raspando arranha; um acerto folgado despedaça.

<p class="muted">A <strong>Centelha</strong> soma <strong>2 × o menor entre ela e a Habilidade da jogada</strong> (Habilidade 0 dá bônus 0), dos dois lados, ao ataque e a todas as defesas: quem tem a fagulha acesa e nenhuma prática ainda ganha só o que a prática sustenta, que com Habilidade 0 é nada. Entre Centelhas iguais (e Habilidade suficiente dos dois lados) ela se cancela, e o duelo joga igual do mortal ao semideus; contra quem tem menos Centelha, a diferença vira vantagem líquida no acerto e na guarda. No <strong>dano</strong> a conta é outra: a Centelha do atacante soma inteira, sem esse teto (veja abaixo).</p>

### Rajada: golpes extras com a mesma arma

Uma ação, um golpe: essa é a régua padrão. Duas coisas rendem mais: lutar com **duas armas** (a
seguir) ou puxar uma **Rajada**, vários golpes com a **mesma** arma, corpo a corpo, declarados de
uma vez, sem parar no meio.

**Nada dá ataque extra sem dizer que dá.** Ter várias armas, ou partes do corpo que servem de arma, é ter opções de ataque, e não ataques a mais: um gato pode atacar com qualquer das quatro patas ou com a mordida, e nem por isso ataca mais vezes. Os golpes a mais são os que uma regra dá pelo nome, como a Rajada e a empunhadura dupla, abaixo.

A Rajada tem a forma **P → G → G → … → R**: um Preparo, os golpes em Ticks seguidos e uma Recuperação, declarada de uma vez e sem parar no meio. Cada golpe **além do primeiro** custa duas coisas: **−1d6 no acerto, acumulando** (o **1º golpe** sai **sem penalidade**, o **2º** a **−1d6** e o **3º** a **−2d6**) e **+1 Tick de Recuperação**, além do Tick de Golpe que ele próprio ocupa. Cada golpe extra soma, portanto, **+2 de Velocidade** ao ciclo inteiro (no Normal também). Há um teto de golpes por Rajada, pela classe da arma, e o ciclo fica assim:

| Classe | Golpes no teto | Ciclo com 1, 2 e 3 golpes |
|---|:---:|:---:|
| Leve | 3 | 5, 7 e 9 |
| Média | 3 | 6, 8 e 10 |
| Haste média | 2 | 6 e 8 |
| Haste de Guerra | 2 | 7 e 9 |
| Pesada | 2 | 7 e 9 |

A Rajada é só **corpo a corpo** (arco, besta e Arremesso não fazem: recarregar é Preparo) e é de golpes de arma. Agarrar, derrubar e empurrar (Manobras) não entram nela: o acerto de uma Manobra agarra e não fere.

- **Alvos diferentes:** golpe a golpe, qualquer um ao alcance. É o que faz da Rajada a ferramenta contra a horda.
- **Interrupção:** só o Preparo é interrompível; os golpes seguidos não têm janela. O espelho de quem pagou ação fora de hora **empurra os golpes restantes**, não os cancela.
- **Sem alvo ao alcance:** os golpes restantes se perdem e a Recuperação começa, sem reembolso: declarou três, pagou três.
- **Uma só fonte de golpes múltiplos por ação:** a Rajada não acumula com a empunhadura dupla nem com Técnicas de ataque extra.
- A **Investida** e o **Mirar** valem só para o primeiro golpe: compram Preparo, e há um só.

Cada golpe da Rajada conta como um ataque feito pela Guarda sob pressão: uma Rajada de 3 golpes baixa a sua Esquiva e o Bloqueio em **−6** até a sua próxima ação, e a de 2 golpes (as duas Hastes e a Pesada), em **−4** (−2 por golpe, a mesma conta da empunhadura dupla).

### Empunhadura dupla: um ataque por mão

A outra forma de multiplicar ataques é lutar com **uma arma em cada mão**: aí você pode
desferir **um ataque por mão** na mesma ação (mesma Velocidade). Não é obrigatório abrir os
dois; se preferir, faça só o golpe da mão hábil, normal, sem penalidade.

Ao desferir os dois golpes:

- **as duas mãos atacam a −1d6** (coordenar dois gumes tira precisão, e tira igual das duas). A
  Técnica **Ambidestria** (Dança da Lâmina) apaga esse dado extra;
- cada golpe rola o próprio acerto e o próprio dano, com a arma daquela mão (a Força soma uma
  vez em cada);
- podem cair no **mesmo alvo** ou em **alvos diferentes**, um por mão.

No sistema P/G/R a dupla ganha **um Tick de Golpe para cada mão**, as duas a −1d6, e o ciclo muda pouco:

| Dupla | Preparo | Golpes | Recuperação | Ciclo |
|---|:---:|:---:|:---:|:---:|
| Par de armas leves | 1 | 2 | 2 | 5 |
| Arma média na mão hábil | 2 | 2 | 3 | 7 |

No par de leves o segundo Golpe **come um Tick da Recuperação**, e o ciclo não muda; com arma média na mão hábil o ciclo **cresce 1**. Segurando a segunda arma (ou o escudo) **sem golpear com ela**, o Tick de Golpe fica a **−2** em vez de −4: a outra mão continua guardando. Os dois golpes contam, os dois, como ataques feitos para a Guarda sob pressão. O tempo é a identidade da dupla, e os dados são o preço dela.

**Dois Punhos contam como duas armas leves**, cada um com as estatísticas dos Punhos (1/1/3). Fazem par para a empunhadura dupla (a linha do par de leves), para a Rajada (teto de 3 golpes, o da classe leve), para o Bloqueio (+1 cada) e contam como **2 ataques** para a Guarda sob pressão. **Só as mãos fazem par**: os dois punhos e qualquer mão que conta como arma (a Mão de Ferro, por exemplo). Chute, mordida, cauda e patas de animal seguem a regra de que nada dá ataque extra sem dizer que dá: são opções de ataque, não um par.

A dupla de armas de Velocidades diferentes fica a critério do Mestre: o ciclo é o da arma **mais lenta** das duas, em qualquer mão que ela esteja. Uma adaga na mão hábil e uma espada longa na inábil têm o ciclo da espada, 7 Ticks, como se ela estivesse na mão hábil.

O preço não está tanto nos dados (pela régua da Margem, um golpe que **encosta** já rende quase todo o dano), e sim na **exposição**: cada ataque que você faz baixa a Esquiva e o Bloqueio (ver *Guarda sob pressão*), então brigar com as duas mãos derruba a sua guarda o **dobro** de um golpe só, até a sua próxima ação. Em troca, a **Defesa das armas continua valendo** para aparar: empunhar duas lâminas ataca e defende ao mesmo tempo: o que custa é ficar aberto, não largar a guarda da arma.

Uma **arma de duas mãos** ocupa as duas e não permite o segundo ataque; um **escudo** na mão inábil troca o golpe extra por Bloqueio. É a terceira via da empunhadura, ao lado do dano concentrado das duas mãos e da muralha do escudo: **tempo e pressão**, dois golpes por vez ao custo da própria guarda.

## Manobras: agarrar, derrubar, empurrar

Controlar alguém em vez de feri-lo é uma **Manobra**: agarrar, derrubar ou empurrar. É um ataque desarmado, rola-se ao declarar, como em todo golpe, e conta como ataque feito para a Guarda sob pressão. O bônus e a penalidade de porte no acerto valem como em qualquer ataque físico. Uma Proeza pode transformar um soco que acerta em agarrão.

**Agarrar.** Jogada de ataque: Força ou Destreza (à escolha, normalmente a maior) + Briga, mais a Centelha como em qualquer ataque (2 × menor entre Centelha e Briga), contra a **Defesa de agarrão** do alvo. A Defesa de agarrão é passiva: (Força ou Destreza + Briga ou Atletismo) × 2 + 2 × menor(Centelha, Habilidade usada), sempre o maior de cada par. Total que supera: o alvo fica **Agarrado**, e quem agarrou **controla**. Errar a primeira tentativa é um erro comum de ataque. **Não existe Rajada de agarrão.** O acerto agarra e não fere, e a Margem dele não rende nada: o dano vem na manutenção.

**Manter.** A cada 6 Ticks, contados a partir de quem controla (5 de Preparo e 1 de Golpe), quem controla rola de novo, com a mesma jogada, contra a Defesa de agarrão do outro. Manter é a ação de quem controla, e a jogada e o dano caem no Tick do Golpe. Ele pode soltar em qualquer Tick antes do Golpe.

* **Superou:** mantém e causa o dano, ou escolhe soltar.
* **Igual:** durante 6 Ticks ninguém controla e ninguém causa dano, e quem desistir entrega o controle ao outro. Passados os 6 Ticks, quem controlava antes rola de novo.
* **Abaixo:** os papéis se invertem, e o agarrado passa a controlar.

**Dano do agarrão.** 2 × Força + Centelha, de Impacto, sem dado base, e +1d6 por Margem da manutenção. A Absorção do alvo conta (armadura inclusa), e por isso ferir agarrando quem veste armadura é mais difícil.

**O agarrado.** Não age e não rola nada: só escapa quando quem o controla erra. Pode gritar. A Firula dele é só descrição. Contra quem ataca de fora, a Defesa dele leva −2 mais as penalidades da situação (por exemplo, no chão), sem dobro. Entre os dois envolvidos não há penalidade de ataque nem de Defesa, só as de outra natureza (veneno, doença, ferimento). Quem controla sofre as penalidades da Preparação (Defesa −2, e −4 no Tick do Golpe) e da situação, mas não a do agarrado, porque pode largar o agarrão para se defender.

**Três estados**, do mais leve ao mais forte: Preso, Agarrado, Imobilizado.

* **Preso:** não se desloca, mas age. É o que a rede e a Arte de prender causam, e se escapa pela jogada de quem prendeu ([Corpo e Movimento](/regras/acoes-corpo-e-movimento), Cap. VIII).
* **Agarrado:** o agarrão acima; não age.
* **Imobilizado:** o que a Técnica Imobilizar e as parecidas causam, e o estado de quem está amarrado ou preso em gelo. Nenhum movimento, não age (nem com Firula) e, conforme o tipo de imobilização, nem grita. A Defesa dele cai −4 (Vantagem tática). Quem está imobilizado sem agarrão (amarrado, preso em gelo) pode tentar se soltar sozinho, e essa tentativa sofre uma penalidade grande para agir. O Imobilizar cobra a manutenção se o alvo estiver tentando se libertar.

**Deslocamento no agarrão.** Os dois podem se mover, e o Mestre julga. É só descrição, sem regra.

**Derrubar.** Ataque comum, Força ou Destreza (à escolha) + Briga, contra a Defesa do alvo (a melhor entre Esquiva e Bloqueio). O alvo fica **Prono** (o Bestiário o chama de Caído): −2 na Defesa contra corpo a corpo e +2 contra distância (Vantagem tática). Levantar-se é uma ação de Velocidade 3.

**Empurrar.** Ataque comum, contra a Defesa do alvo. O alvo recua 1 m mais 1 m por Margem, afastando-se de quem empurra. Se o recuo o leva a uma borda, valem [Cair](/regras/acoes-corpo-e-movimento) e Agarrar a borda, no Cap. VIII.

## Dano e Armadura

<p class="formula">Dano = (Dado da Arma + Margem) + Força + Centelha − Absorção</p>

O **Dado da Arma** vem da classe (leve 1d6−2, média 1d6, pesada 2d6, haste média 1d6, haste de Guerra 1d6+2, arremesso 1d6−4 a 1d6, distância 1d6−2 a 1d6+8). Armas de uma mão somam a **Força**; as de duas mãos, o **dobro da Força**, a Lança entre elas: **a exceção é a Lança Longa**, que fere por alcance e precisão, não por peso, e soma apenas a **Força simples**. Cada Margem (6 pontos acima da Defesa) acrescenta +1d6. A **Centelha do atacante** soma inteira, sem teto de Habilidade: é a mesma fagulha que abre Proeza que faz o golpe doer mais fundo, em toda arma, em toda Arte e a cada pulso de dano contínuo.

### Os três modos de dano

Todo golpe tem um **modo**, e a maioria das armas pode usar mais de um, você escolhe conforme o alvo:

- **Cortante**: gume deslizante (espada, machado).
- **Perfurante**, ponta ou projétil que fura: estocada, adaga de rondel, bico de picareta, flecha, virote, faca ou plumbata lançada. (Não há distinção entre projétil e estocada: ambos são Perfurante.)
- **Impacto**: maça, martelo, malho; também socos e quedas.

O modo escolhe a **Absorção**, e para ali: o dano que passa é um só, e qualquer um dos três mata (ver [Vida & Ferimentos](/regras/vida-ferimentos-cura)).

A **Absorção** total de um golpe é **Absorção natural + a absorção da armadura**. A armadura tem **três Absorções** (Impacto, Corte e Perfuração), e o **dano Perfurante usa a Absorção de Perfuração**:

- **Absorção natural:** **Vigor + Centelha** contra o **Impacto** (o corpo e a fagulha amortecem a pancada); **só a Centelha** contra o Cortante e o Perfurante: a carne nua não para o fio nem a ponta, apenas a dureza sobre-humana da **Centelha** o faz. Um mortal (Centelha 0) tem **0** de Absorção natural contra lâminas: depende inteiramente da armadura.
- **+ armadura:** a placa quase zera o Corte, mal segura o Impacto e tem Perfuração baixa. Empilhar peças vale a **maior Absorção de cada categoria**; ver [Armas & Armaduras](/regras/armas-e-armaduras).

### O gate de Perfuração

O modo **Perfurante** tem um **Nível de Perfuração** (0–3) e enfrenta o **Nível** (Resistência à Perfuração) da armadura:

- Se o Nível de Perfuração da arma for **menor** que o da armadura, o golpe **resvala, dano 0** (nem rola).
- Se for **igual ou maior**, o gate abre: rola o dano e subtrai a **Absorção de Perfuração** (baixa, ao furar, encontra pouca proteção).

**Cortante e Impacto não passam pelo gate**: sempre subtraem a absorção direto. É por isso que a placa completa (Nível 3) é à prova de qualquer arma de mão (espada, flecha, lança, besta, picareta param em N0–N2), cedendo só ao Impacto, à perfuração nível 3+ (cerco, magia), Proeza ou feitiçaria. O **Nível nunca soma** ao empilhar armaduras: vale sempre o maior.

### Couraça de Porte

Bichos muito maiores que um homem não são só sacos de vida maiores: a pura massa, a pele grossa, as escamas e o casco viram **armadura de carne**. Cada porte acima do Médio soma uma **Couraça** à Absorção, e os maiores ganham um **Nível de Perfuração natural** (o mesmo gate da placa: flecha e lança comuns resvalam).

A Couraça incide **só em Corte e Perfuração**: o **Impacto a ignora**. Cortar ou furar uma montanha de carne arranha a superfície; já uma pancada concentrada (maça, martelo, malho, um pedregulho) transfere a energia para dentro, do mesmo jeito que o Impacto vence a placa. Contra um titã, **esmague, não corte**, e contra os maiores, nem isso basta sem Centelha.

| Porte | Couraça (Corte/Perf.) | Perfuração natural |
|---|---|---|
| Médio e menores | — | — |
| Grande | +2 | — |
| Enorme | +4 | 1 |
| Imenso | +7 | 2 |
| Colossal | +10 | 3 |

<div class="callout exemplo"><span class="lbl">Exemplo</span>Um <strong>Verme Púrpura</strong> (Imenso) tem Absorção <strong>13</strong> contra lâminas. Um soldado com espada longa (1d6, média 3,5) não abre um arranhão; a flecha (Perf. 1) resvala na Perfuração natural 2. Um herói de montante (2d6, média 7) ainda não crava fundo, e uma Proeza que rasga ou um martelo no <strong>Impacto</strong> (que ignora a Couraça, Absorção 12) é o caminho para feri-lo de verdade. Já o <strong>Tarrasque</strong> (Colossal, Absorção 27 contra Corte, Perf. 3) zomba de qualquer aço mortal: só Centelha, Proeza ou feitiçaria o marcam.</div>

A Couraça **empilha** com armadura (soma na Absorção) e com a Absorção de Proeza; o Nível de Perfuração natural entra no gate como o de uma armadura (vale sempre o **maior**, nunca soma).

### Trocar de modo

Cada arma tem um **modo principal** (sem custo) e, às vezes, **secundários**: alternar para um secundário custa **−2 ao acerto e −1d6 no dano** (estocar com uma lâmina de corte é mais difícil e sai mais fraco). Algumas armas, como a **Alabarda**, têm vários modos *principais*: alternam sem penalidade.

## Quase-Acerto

Errar por pouco ainda raspa o alvo. Como o **Quase-Acerto** funciona em detalhe (a Margem do raspão, os valores por classe de arma e de armadura, e os modificadores que o afetam) é o assunto do próximo capítulo, [Quase-Acerto](/regras/quase-acerto).

## Esquivar ou Bloquear

Sua Defesa pode vir de duas fontes, e você usa **a melhor** delas contra cada golpe:

- **Esquiva**: com a habilidade Esquiva, mais a mobilidade do terreno. Some sai da frente.
- **Bloqueio**: com a Habilidade **Bloqueio** (a mesma para qualquer arma, escudo ou mão), mais a **Defesa da Arma** e o escudo. Apara o golpe. Sem nada nas mãos, o corpo defende pela regra da [luta desarmada](/regras/armas-e-armaduras#luta-desarmada) (Cap. XIII), que também diz o que acontece quando a mão nua bloqueia um ataque armado: o dano da arma passa, a Margem não.

A **Defesa da Arma** (coluna *Defesa* em [Armas & Armaduras](/regras/armas-e-armaduras)) entra no **Bloqueio**: uma espada acrescenta **+1**, uma haste média **+2** (o alcance afasta o golpe; a Haste de Guerra, grande demais para aparar, **0**), e as **armas pesadas de duas mãos −2** (o espadão e o martelo dão muito dano, mas comprometem a guarda e **expõem o lutador entre os golpes**). Quem usa **uma só mão** pode ocupar a outra: um **escudo** (+1 a +3) ou uma **arma na mão inábil** (+1) eleva o Bloqueio. E a arma da mão inábil não só defende: ela rende um **segundo ataque** na ação (ver *Empunhadura dupla*), e o Bloqueio dela continua valendo mesmo quando você golpeia com ela. É a troca central da empunhadura: **dano concentrado e alcance com as duas mãos, a muralha do escudo, ou dois golpes por vez com uma arma em cada mão.**

### Projéteis rápidos: só Esquiva ou escudo

Contra um **projétil rápido** (flecha, virote, bala de funda, faca de arremesso e as outras armas pequenas de arremesso, sopro de zarabatana), **ninguém apara com a arma ou com a mão**: vem depressa demais. As saídas são duas:

- **Esquivar**, sempre.
- **Bloquear**, só com um **escudo hábil** e se você estiver **apto** a manejá-lo.

Um escudo é **hábil** quando cobre pelo menos **30% do seu corpo** (um escudo médio para uma criatura Média): o broquel e o targe são pequenos demais e não valem; do escudo redondo para cima, sim. Estar **apto** exige estar consciente, não ser pego de surpresa, ter o braço do escudo livre e ter **espaço para manobrá-lo** (não vale encurralado ou no meio de galhos). Sem escudo hábil (ou sem estar apto), contra o projétil rápido resta só a Esquiva. **A Plumbata é a exceção**: é projétil rápido, mas é lançada à mão, e por isso se bloqueia também com a arma.

Já as armas de arremesso **lentas** (a lança ou o machado lançado, o pilum, o bumerangue de caça e o de retorno, uma pedra grande) são pesadas e visíveis: essas você **bloqueia normalmente**, com arma, escudo ou mão, como no corpo a corpo.

### Força e porte: quando a guarda não segura

Aparar exige **força e tamanho para bancar o impacto**. Num golpe **corpo a corpo**, se o atacante te atropela demais, a rota de **Bloqueio some** e resta só a Esquiva:

- **Porte:** você não bloqueia um atacante **2 ou mais categorias de porte maior** que você. Um Médio ainda segura um Grande (ogro) com esforço, mas não um Enorme+: um humano não apara a clava de um gigante.
- **Força:** mesmo do mesmo tamanho, você não bloqueia quem tem **Força pelo menos o dobro da sua e ao menos +4 acima** (o brutamontes que arranca a arma da sua mão no impacto).

A **Centelha rompe o limite mortal:** cada ponto de Centelha do defensor **sobe o teto de porte em uma categoria** (com Centelha 1 já se apara um Enorme; um semideus segura um titã). E se a **sua Centelha for igual ou maior que a do atacante**, a regra de Força é ignorada: poder equipara poder.

**Escudo grande escora:** plantar um escudo de tronco (heater, kite, scutum ou pavês) deixa você aguentar **uma categoria de porte acima** do seu limite, porque você escora a massa com o corpo todo em vez de aparar no braço.

Mas **nem tudo se bloqueia ou se esquiva**: uma avalanche, uma onda de fogo, uma rede bem lançada cobram outra saída.

**Contra área, a saída é sair.** Área não vem de uma direção, ela ocupa o espaço, então não há número de Esquiva nem de Bloqueio a opor. Sair tem duas versões e **nenhuma delas é de graça**: as duas gastam Tick e as duas pedem a mesma jogada, porque a área pegou os dois.

- **Livre**, com a vez ainda na mão: você sai pelas próprias pernas, um Tick de **Deslocamento de Batalha** (ou o Arranque da Corrida, que rende mais). O Tick é gasto, porque aqui sair *é* o movimento e não o passo de brinde que acompanha outra ação, mas ele cobre vários metros de uma vez, a rolagem sai limpa e depois você continua livre para agir.
- **Fora da vez**, no meio de um Preparo, de um Golpe ou de uma Recuperação: é o **desvio de emergência**, a **1 Tick por metro** que falte para o corpo sair, e esses Ticks empurram a próxima ação para frente. Você já agiu, então não tem Tick na mão: empresta do próprio futuro, e ainda rola com a escada aberta em cima dos dados.

A Dificuldade é a mesma nos dois casos, e sai da distância: **5 + 5 × os metros** que faltam para ficar fora, para sofrer metade; o **dobro** disso, para não sofrer nada. A regra inteira está em [O tempo da Arte](/artes/regras#tempo).

## Movimento: Deslocamento, Corrida e Salto

O jogo tem **um só número de andar em combate**, e ele serve para duas coisas: o passo que você dá de graça enquanto faz outra coisa, e o quanto você cobre por Tick quando decide que andar é a ação.

<p class="formula">Deslocamento de Batalha (m por Tick) = 2 + (Destreza + Atletismo) ÷ 4</p>

- **O primeiro Tick é de graça durante outra ação** (atacar, conjurar), em qualquer direção e sem gastar a vez. É o arqueiro que recua e dispara, o duelista que circula enquanto golpeia.
- **Para ir além, cada Tick a mais rende outro tanto.** Não há ação separada nem tabela: andar cobra Tick como qualquer outra coisa, e você para quando quiser.

<div class="callout exemplo"><span class="lbl">Exemplo</span>Kael anda <strong>4 m por Tick</strong>. O inimigo está a <strong>9 metros</strong>. Ele gasta <strong>2 Ticks</strong> fechando a distância (8 m) e ataca do terceiro, com o último metro saindo no passo grátis da própria investida. Se preferisse correr, cobriria os 9 m em menos de dois Ticks, mas correndo não se ataca, e a guarda vai junto.</div>

Ele é, na prática, **um Tick de movimento**: como um Tick é mais ou menos um segundo, o número em metros é também a sua velocidade em metros por segundo. A faixa é humana de propósito: **de 2 a 5 m/s**. Andar tranquilo são 1,4 m/s; fechar distância numa briga, sem perder a guarda nem o equilíbrio, fica entre 2 e 4; e o teto de 5 é o acrobata. O resto do tempo da ação você não está andando, está lutando.

<p class="muted">Quem tem <strong>perna curta</strong> (anão, gnomo, halfling) desliza <strong>dois terços</strong> disso, e a mesma fração vale para a Corrida e para os Saltos.</p>

Para ir além, gaste a vez numa **ação de movimento**: Corrida ou Salto, ambas **Velocidade 3**.

### Corrida (Velocidade 3)

Vai mais longe por Tick que o Deslocamento de Batalha: no Arranque, uns 40% a mais para a pessoa comum (3,5 m contra 2,5) e uns 60% para o teto humano (8 m contra 5); na Corrida, do 4º Tick em diante, mais que o dobro (5,5 m contra 2,5; 11,5 m contra 5). O preço é a guarda:

<p class="formula">Correndo: <strong>Defesa −4</strong>, enquanto corre e até se recompor</p>

É o mesmo −4 do Tick do Golpe e das condições surpreso, cego e imobilizado, e ele diz uma coisa
só: **correndo não se apara nem se esquiva**. O acerto não sofre, porque quem parou, parou.

A Corrida é uma **ação de 3 Ticks**, interrompível a **qualquer Tick**: você decide quando parar. A largada acelera: os **3 primeiros Ticks** correm à **Velocidade de Arranque** (a explosão do disparo). Para seguir correndo, declara-se outra Corrida sem parar: a declaração e o custo recomeçam, mas a velocidade não, e a Corrida seguinte já corre à **Velocidade de Corrida** (o ritmo sustentado), do **4º Tick em diante**. Kael (Força 3, Destreza 4, Atletismo 3) corre a **6 m por Tick** (5,5, arredondado) no Arranque e a **9 m por Tick** (8,5, arredondado) na Corrida. Cada valor é em metros por Tick.

| Fase | Quando | m por Tick |
|---|---|---|
| **Arranque** | Ticks 1–3 | 2 + Força ÷ 4 + Atletismo ÷ 4 + Destreza ÷ 2 |
| **Corrida** | Tick 4 em diante | 4 + Destreza × ¾ + Atletismo ÷ 2 |

Os valores em metros por Tick arredondam para o inteiro mais próximo, o meio para cima (3,75 vira 4; 5,5 vira 6; 8,5 vira 9).

<p class="muted">As duas têm um número fixo na frente porque <strong>qualquer corpo que corra já sai do zero</strong>: sem ele, quem não investiu em Destreza nem em Atletismo "corria" a 2,5 m/s, que é um trote, e quem investiu tudo passava de 15 m/s, que é mais rápido que o recorde mundial. Como referência: andar são 1,4 m/s, um adulto destreinado esprinta a 5 ou 6, um atleta amador a 7 ou 8, e um velocista de elite chega a 11.</p>

### Investida

Investir é **gastar o Preparo correndo** em vez de andando. Não é ação nova nem regra nova: é o
Preparo que a sua arma já tem, atravessado à velocidade de Corrida.

| | distância coberta | Defesa | dano |
|---|---|---|---|
| **Preparo andando** | Deslocamento de Batalha por Tick | o −2 do Preparo | — |
| **Preparo investindo** | velocidade atual da Corrida por Tick (Arranque nos 3 primeiros Ticks, Corrida depois, como no Salto correndo) | −2 **a mais** | **+1d6** |

Como toda arma tem ao menos 1 Tick de Preparo, **toda arma investe**, a leve também, com o +1d6. O que se cobre depende do Preparo, e a Sora (4 m por Tick andando, 7 m por Tick no Arranque) mostra a escala:

| Arma | Preparo | Andando | Investindo |
|---|:---:|:---:|:---:|
| Leve | 1 | 4 m | 7 m |
| Média e Haste média | 2 | 8 m | 14 m |
| Haste de Guerra e Pesada | 3 | 12 m | 21 m |

<div class="callout exemplo"><span class="lbl">Exemplo</span>Sora, de martelo (Preparo 3), anda 4 m por Tick e corre 7 no Arranque. Fechando a distância no Preparo ela cobre <strong>12 metros</strong> com a Defesa em −2. Investindo, cobre <strong>21</strong>, com a Defesa em −4, e o martelo cai com <strong>+1d6</strong>.</div>

Quanto maior o Preparo, mais longe e mais forte vai o golpe que investe, e a pesada, com Preparo 3, é a que investe melhor, que é exatamente a imagem de quem atravessa o salão com o martelo erguido.

### Recarga: o Preparo que não anda

O espelho da Investida. Se investir é gastar o Preparo **correndo**, recarregar uma besta é gastá-lo
**parado**, porque não há outro jeito de girar a manivela.

<p class="formula">Arma com <strong>recarga</strong> (as três bestas): durante o Preparo você <strong>não se desloca</strong>, e isso inclui o primeiro Tick de graça</p>

É a única arma do jogo que perde o passo grátis. O arqueiro recua e dispara; o besteiro planta os
pés e conta os Ticks. O tiro continua saindo no Tick do Golpe, como em toda arma de
tiro: o que a besta perde é o passo, não o disparo. No sistema Normal, o tiro já foi rolado na
declaração; o Preparo só marca a guarda aberta.

O preço é grande porque o ciclo é grande. A **Besta Grande** custa **15 Ticks**, e o Preparo dela é
de **doze Ticks**: são doze Ticks de manivela, imóvel, com a Defesa
em **−2** o tempo todo (o mesmo −2 de qualquer Preparo: ele não cresce, mas também não alivia), e
só então o virote sai (no sistema Normal ele já foi rolado na declaração, e esses Ticks só marcam a
guarda aberta). É exatamente a vulnerabilidade que o **pavês**
existe para cobrir, e é por isso que o livro chama o pavês de parede portátil do besteiro.

<div class="callout exemplo"><span class="lbl">Exemplo</span>Bram, de Besta Média (Velocidade 12), declara o tiro no Tick 0 e, no sistema Normal, rola ali mesmo. Ele fica dos Ticks 0 ao 8 em Preparo, sem sair do lugar, no Tick 9 em Golpe, com a guarda em −4, e os Ticks 10 e 11 são de Recuperação. Um espadachim de espada longa (Velocidade 6) atravessa esse mesmo intervalo golpeando duas vezes, e andando nos dois. Se Bram precisar sair do caminho de uma investida no Tick 7, a saída é a mesma de qualquer um pego no meio de um Preparo: o desvio de emergência, a 1 Tick por metro, fora da vez.</div>

<p class="muted">O que acontece com os Ticks já investidos quando o besteiro se mexe (perde tudo, ou a recarga apenas pausa) ainda não foi decidido, e o Grid não trava o passo sozinho: por enquanto é o Mestre que segura.</p>

### Salto (Velocidade 3)

Um impulso único que, **uma vez iniciado, não pode ser interrompido**. Três alcances, conforme a direção e o impulso:

| Salto | Alcance | Fórmula |
|---|---|---|
| **Vertical** | altura, em cm | (Força × 20) + (Atletismo × 10) + (Destreza × 4) + 50 por Centelha |
| **Horizontal (parado)** | distância, em m | (Força + Atletismo + Centelha) ÷ 2 |
| **Horizontal (correndo)** | distância, em m | Velocidade atual + (Atletismo ÷ 2) + Centelha |

<p class="muted">No salto correndo, <strong>Velocidade atual</strong> é a sua velocidade no instante do impulso: Arranque se você corre há ≤3 Ticks, Corrida depois (na ficha, supõe-se corrida plena). O <strong>Salto</strong> é a explosão de força do corpo: a Força lança, o Atletismo controla, a Destreza ajusta, e a Centelha rompe os limites mortais, do pulo humano ao salto lendário.</p>

## Vantagem tática: posição e número

Posição, cobertura e postura mudam o combate sem mudar suas fichas: todos eles ajustam o **valor passivo da Defesa do alvo**. Positivo torna o alvo mais difícil de acertar; negativo, mais fácil. Use o **grau menor (±2)** para vantagens comuns e o **maior (±4)** para situações marcantes.

| Situação | Defesa do alvo |
|---|:---:|
| Cobertura parcial (parapeito, aliado à frente) | **+2** |
| Cobertura pesada (só cabeça/braço expostos, seteira) | **+4** |
| Postura defensiva total (abre mão do ataque) | **+4** |
| Alvo errático (movimento imprevisível), à distância | **+2** |
| Atacante em terreno alto | **−2** |
| Mirar (gasta uma ação preparando o golpe) | **−2** |
| Alvo prono, atacado **corpo a corpo** | **−2** |
| Alvo prono, atacado **à distância** | **+2** |
| Alvo agarrado, atacado por quem não o agarra (ver Manobras) | **−2** |
| Flanco ou pelas costas | **−2** |
| Alvo surpreso, cego ou imobilizado (Imobilizado: ver Manobras) | **−4** |

<p class="muted">A <strong>postura agressiva</strong> é a exceção que mexe nos dois lados: você baixa <strong>−2</strong> a sua própria Defesa até a próxima ação em troca de <strong>+2</strong> no seu ataque. O empilhamento <strong>destes modificadores situacionais</strong> (cobertura, flanco, postura, prono e os outros desta tabela) numa mesma Defesa é limitado a <strong>±6</strong>: nenhuma soma de vantagens transforma o golpe em acerto (ou erro) automático. É um teto diferente do "sem teto" da Pressão (<em>Guarda sob pressão</em>, adiante) e do porte, que também fica fora dele.</p>

<p class="formula">Cobertura total (sem nenhuma linha de visão) não pode ser alvejada; primeiro é preciso flanquear ou destruir o anteparo.</p>

### Golpes no mesmo instante

Quando dois golpes caem no **mesmo Tick**, os dois atacantes estão abertos ao mesmo tempo: cada um ataca contra a guarda comprometida do outro. Não importa quem a mesa resolveu primeiro: a escada se lê pela **agenda**, e não pela ordem em que as jogadas foram narradas.

<div class="callout exemplo"><span class="lbl">Exemplo</span>Duas adagas (Preparo 1) declaradas no <strong>Tick 3</strong> golpeiam no <strong>Tick 4</strong>. As duas golpeiam nesse instante, então as duas estão em <strong>−4</strong>: cada uma ataca uma Defesa aberta. Se uma delas fosse uma espada longa (Preparo 2) declarada no <strong>Tick 2</strong>, no sistema Normal ela rolaria no 2, mas o Golpe dela também cairia no 4: no Tick 4 a guarda dela estaria em −4, a mesma das adagas.</div>

<p class="muted">Vale a pena dizer por que a regra é essa: se a guarda de quem ainda não narrou a jogada contasse como inteira, a jogada certa seria sempre <em>deixar o outro atacar primeiro</em>, e a vantagem de ter rolado bem na Iniciativa se voltaria contra quem a ganhou.</p>

### Porte: o grande é fácil de acertar, o pequeno é difícil

O tamanho conta na **jogada de acerto** dos **ataques físicos** (corpo a corpo e à distância): quanto **maior** o alvo em relação a quem o ataca, mais fácil cravar o golpe; quanto **menor**, mais difícil. Vale a diferença de **categorias de porte** (Miúdo · Pequeno · Médio · Grande · Enorme · Imenso · Colossal):

| Diferença de porte (alvo − atacante) | Ao acerto |
|---|:---:|
| Alvo **1** categoria maior | **+3** |
| Alvo **2** categorias maiores | **+6** |
| Alvo **3** categorias maiores | **+9** |
| Alvo **4** ou mais categorias maiores | **+12** (teto) |

**Simétrico:** atacar um alvo **menor** subtrai o mesmo valor. Um colosso tem **−12** para acertar um humano (Médio); o rato tem **+12** para acertar o colosso. A diferença conta **até 4 categorias**, então um Pequeno e um Médio acertam um Colossal com a mesma facilidade.

Isso é **só no acerto**: não muda a Defesa passiva do alvo, **não entra no teto de ±6** dos modificadores de posição acima, e não se aplica a ataques Sociais ou Mentais. E não deixa o gigante indefeso: a **Couraça de Porte** (ver *Dano e Armadura*) devora o dano de quem é menor, então acertá-lo é fácil, mas feri-lo de verdade não é.

### Pressão: muitos contra um

Cada inimigo extra desgasta a sua guarda, e cada golpe que **você** desfere também.

<div class="callout regra"><span class="lbl">Guarda sob pressão</span>Cada ataque que você <strong>faz ou recebe</strong> reduz sua <strong>Esquiva e Bloqueio em −2</strong> (cada golpe de uma Rajada e cada Manobra é um ataque), e o efeito <strong>acumula até a sua próxima ação</strong>: quando você age, a guarda se refaz e o acúmulo zera. <strong>O golpe não desconta a si mesmo:</strong> o primeiro ataque recebido bate na Defesa cheia, e o segundo já pega −2. <strong>Sem teto:</strong> ninguém desvia de uma dúzia de golpes. Atacar te expõe (e atacar com as <strong>duas mãos</strong>, o dobro); ser cercado te expõe muito mais. Um único oponente brilhante resiste a alguns fracos, mas a maré da multidão acaba furando qualquer guarda.</div>

No sistema P/G/R, o tiro com tempo de voo conta como **recebido** no Tick da **chegada** (ver *Distância e tempo de voo*), e não no do Golpe.

A posição fecha o cerco: quem ataca pelo **flanco ou pelas costas** ganha o **−2 na Defesa** do alvo, porque ele não pode voltar a melhor guarda contra todos ao mesmo tempo. Dois inimigos coordenados (um prendendo a frente, outro contornando) combinam a penalidade de pressão com a de flanco: é assim que o número vira vantagem tática, e não só mais dados.

### Regra de Horda

Quando muitos capangas iguais avançam juntos, não role um por um: trate o bando como **um só esquadrão**. O tamanho vira **Magnitude**, e cada degrau exige cerca do **dobro** de gente:

<div class="table-wrap">

| Membros | 2–3 | 4–7 | 8–15 | 16–31 | 32–63 | 64–127 |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Magnitude** | 1 | 2 | 3 | 4 | 5 | 6 |

</div>

- **Ataque**: o esquadrão faz **um ataque por inimigo engajado, até Magnitude + 1, a cada 6 Ticks** (o teto é a frente de combate: só cabe tanta gente em volta). Contra um alvo só, os golpes **concentram numa rolagem**; contra vários, **espalham-se** um por inimigo. Cada ataque rola o pool de um capanga **+ Magnitude d6 no acerto e + Magnitude d6 no dano** (o enxame que conecta cai todo em cima). O esquadrão **não** aplica a penalidade de guarda da Pressão; sua ameaça já é a chuva de dados.
- **Modos**: os ataques podem misturar **Impacto / Corte / Perfuração** e **corpo a corpo ou à distância**. Um esquadrão **híbrido** o bastante (armas variadas) ataca sempre pelo **modo de menor Absorção do alvo**, achando a brecha na guarda.
- **Defesa**, a de um capanga **−2**: multidão amontoada é alvo fácil.
- **Baixas**: o esquadrão tem **PV = nº de membros × o PV-de-horda do capanga** (Comum **5**, Treinado **10**, Elite **15**). Na horda o capanga perde o **piso de durabilidade de 25**, que protege só heróis e NPCs nomeados. O dano que você causa **acumula**; cada vez que o total passa o PV-de-horda de um capanga, **cai um membro**: um golpe pesado derruba vários de uma vez. Conforme caem, a **Magnitude desce em degraus**, até sobrar um (Magnitude 0), que volta a ser um NPC comum. Ataques em **área** batem direto no PV do esquadrão.

Na prática, um lutador resistente abre caminho por ~**20 Comuns**, ~**8 Treinados** ou ~**5 Elites** antes de correr risco real, mas uma maré de **30 ou 40** afoga até ele. É o pilar do sistema: um herói vence vários fracos e, ainda assim, **perde para a multidão**.

<p class="muted">Uma sugestão, não um gatilho automático: a partir de <strong>2 capangas por personagem do grupo</strong>, considere tratar o bando como Horda em vez de rolar um por um. É o Mestre quem decide, cena a cena, se aquele número de inimigos já pesa o bastante para valer a simplificação.</p>

<div class="callout exemplo"><span class="lbl">Exemplo</span>Sora encara <strong>20 recrutas</strong> (Comuns). Magnitude <strong>4</strong>: o PV do esquadrão é 20 × 5 = <strong>100</strong>, e o ataque deles é <strong>1d6 + 4d6</strong> no acerto e <strong>+4d6</strong> no dano. No 1º golpe Sora rola o montante e causa 19 de dano: 19 ÷ 5 = <strong>3 baixas</strong> (sobram 4 acumulados). Restam 17: ainda Magnitude 4. Ela ceifa ~4–5 a cada 6 Ticks; ao chegar a 15 membros a Magnitude cai para 3 e a horda morde menos.</div>

## Técnicas em combate: tempo e combos

As Técnicas das Proezas entram na luta por **dois medidores independentes**: a **Energia** é o combustível da *cena* (quanto você ainda tem no tanque); os **Ticks** são o custo do *momento* (quanto tempo o poder rouba da sua linha do tempo). Decidir entre os dois ("gasto tempo agora ou guardo o tanque?") é metade da tática.

| Tipo de Técnica | Ticks | Como entra |
|---|:---:|---|
| **Passiva** | 0 | Sempre ligada. Não custa nada, não ocupa a sua vez. |
| **Reflexiva** | 0 | Dispara *fora da sua vez*, em reação (aparar, esquivar, contra-atacar). Paga Energia; **só 1 por gatilho**. |
| **Ativa suplementar** | +0 | Turbina uma ação que você já vai fazer (*"seu golpe ganha +2d6"*). Dobra junto com o ataque; você só paga a Energia. |
| **Ativa independente** | própria | A Técnica **é** a ação (um deslocamento, um grito em área). Custa Velocidade pelo nível: **5** (níveis 1–3), **6** (nível 4), **7** (níveis 5–6). |

### Combos: concentrar num golpe só

Numa única ação você pode **empilhar várias Técnicas suplementares** sobre o mesmo golpe, mas cada acréscimo encarece. A **k-ésima** Técnica somada à ação cobra uma **sobretaxa de +(k−1) de Energia** (a 2ª custa +1, a 3ª +2, a 4ª +3…).

<p class="formula">Separado: golpe A com Téc. X (custo X) + golpe B com Téc. Y (custo Y) = X + Y, em duas ações.<br>Combo: um golpe com X e Y juntos = X + Y + 1, numa ação só.</p>

Combinar é **mais caro em Energia**, mas economiza **Ticks** e concentra os efeitos: mais Margem, um único impacto demolidor em vez de dois mornos. O teto é o seu bolso: a Energia ((Vigor + Compostura + Raciocínio + Vontade) ÷ 2 + Centelha × 2) é que diz até onde o combo vai, e é por isso que a Centelha mais alta comba mais fundo. Os níveis 5 e 6 ainda cobram Vontade (+1 e +2), o que torna combos de elite raros e climáticos.

### Posturas sustentadas

Algumas ativas são **guardas que você assume**: paga a Energia **uma vez** e a postura dura a **cena** inteira. Você mantém até **Centelha** posturas ao mesmo tempo; largá-las é de graça. É o lutador que "entra em sua forma" e luta a refrega inteira sob ela.

### Empilhar Proezas: o que não soma

Proezas dão bônus, e bônus que se somam sem limite quebram o combate. Quatro travas mantêm o número no lugar:

- **Absorção de Proeza** não soma entre passivas: vale a **maior** de cada tipo de dano (Impacto, Corte, Perfuração). Bônus reflexivos ou de cena (como Tensionar) entram por cima só naquele golpe. A Absorção de Proeza soma normalmente com a da **armadura** e com a **natural** (Vigor/Centelha).
- **Defesa reflexiva** de Proeza (Aparar, Reflexos de Vento, Voz Calma, +3) conta para o **teto de ±6** dos modificadores situacionais: não empilha além disso com cobertura, flanco e postura.
- **Ação extra** não acumula: no máximo **uma ação extra a cada 6 Ticks**, não importa de quantas fontes (Proeza ou Arte). Os vários "aja de novo" não se somam.
- **Ignorar a Absorção da armadura** (Punho que Parte Pedra, Esmagar) afeta só a parte da **armadura**; a Absorção **natural** do alvo continua valendo.
