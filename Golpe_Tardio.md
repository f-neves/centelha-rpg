# O golpe que sai depois

> Estudo aberto em **2026-08-21**, a pedido da mesa, e **nada foi mudado ainda**. A pergunta é:
> agora que o Golpe não cai no primeiro Tick da ação, o que muda para quem joga, e o que a tela
> precisa fazer para que a espera entre declarar e bater não vire trabalho de contabilidade.

---

## 1. O que a mesa faz hoje, e o que a régua diz

São duas coisas diferentes, e é aqui que o estudo começa.

**A régua diz** (`combate.pgr.preparo`, §14.1): você declara no Tick T, e o golpe cai em **T + Preparo**.

| Classe | Velocidade | Preparo | Declara no Tick 1 → golpe no |
|---|:---:|:---:|:---:|
| leve | 5 | 0 | **Tick 1** |
| média | 6 | 1 | **Tick 2** |
| haste / pesada | 7 | 2 | **Tick 3** |
| distância | 6 | Vel − 1 | Tick 6 |
| Arte | ciclo | ciclo − 1 | o último Tick da montagem |

**A mesa faz outra coisa:** ao declarar, a folha da ação rola o acerto, aplica o dano, mata quem
tiver de morrer, e **tudo isso no Tick da declaração**. O que acontece em `T + Preparo` é só
desenho: o anel de Golpe acende no token, a fita muda de tom, e nada mais.

Ou seja: **a régua está inteira nos dados e na tela, e vazia no motor.** O Preparo hoje cobra
Defesa (a escada) e mostra um gesto no ar, mas não adia coisa nenhuma.

Uma exceção que já faz o certo, e serve de precedente: **a Arte**. Desde 21/08 o efeito nasce no
Tick do Golpe (`desde_tick = agora + ciclo − 1`), não queima ninguém antes disso, e a mancha aparece
tracejada só para o mestre. A Arte já vive no futuro; a arma ainda não.

---

## 2. Quanto isso custa, medido

O simulador que calibrou a régua inteira (`scripts/lib-tempo.mjs`) resolve o golpe **no Tick do
Golpe**, e conta os que se perdem no caminho. Rodando a régua P/G/R com o catálogo real:

| Cena | Golpes que nunca caem | Redirecionados por cena |
|---|:---:|:---:|
| adaga × adaga (Preparo 0), duelo | 0,6% | 0,00 |
| adaga × adaga, refrega 3×3 | 1,0% | 0,29 |
| espada longa (Preparo 1), duelo | 1,0% | 0,00 |
| **espada longa, refrega 3×3** | **7,3%** | 0,88 |
| martelo (Preparo 2), duelo | 1,1% | 0,00 |
| **martelo, refrega 3×3** | **8,1%** | 1,00 |

E o mesmo par, com e sem a espera:

| Cena 3×3 | vitória | golpes perdidos |
|---|:---:|:---:|
| espada, **com** Preparo | 48,7% | 7,3% |
| espada, **sem** Preparo | 49,6% | 1,0% |
| martelo, **com** Preparo | 50,0% | 8,1% |
| martelo, **sem** Preparo | 50,9% | 1,1% |

**A leitura:** no duelo, resolver cedo ou tarde é quase a mesma coisa (~1% de diferença). Na
refrega, com arma de Preparo, **um em cada treze golpes declarados nunca chega a cair** porque o
alvo caiu antes. O equilíbrio não desaba (a vitória mexe 1 ponto), mas **8% dos golpes de uma cena
de seis pessoas são um fenômeno de jogo inteiro que hoje não existe**.

E há um número que não aparece na tabela porque é zero: **quantas interrupções acontecem**. Sem
espera entre declarar e bater, não há janela nenhuma para interromper.

---

## 3. As quatro coisas que somem ao resolver na declaração

**1. A interrupção não existe.** A §14.7 promete: *"o botão de interromper aparece apenas para quem
está livre ou em Recuperação, e apenas quando existe alguém em ▓"*. Mas se o dano já foi aplicado
no instante da declaração, não há o que interromper: quando o mestre fosse oferecer a janela, o
martelo já teria acertado. **A camada tática inteira da §4 depende de o golpe chegar depois.**

**2. O alvo não pode sair de baixo.** O Grid deixa arrastar peças o tempo todo. Alguém pode se
mover durante o Preparo de quem está mirando nele, e isso deveria mudar a conta (distância, alcance,
cobertura) ou anular o golpe. Hoje não muda nada, porque o golpe já aconteceu.

**3. A ficção mente.** O registro diz *"o martelo de Brann cai no Tick 9"* enquanto o goblin já
caiu no Tick 7. A fita, o anel de Golpe e a linha do tempo desenham um futuro que já foi decidido.

**4. A leitura do sinal (§8) fica sem chão.** *Percepção + Prontidão* para ler onde o golpe vai, a
finta que compra 1 Tick de Preparo para mentir sobre o alvo: as duas só existem se houver um
intervalo entre o gesto e o golpe em que alguém possa fazer alguma coisa.

---

## 4. A Firula: em que Tick?

A Firula (`habilidades.md`) é o bônus por descrever a ação com o cenário: **+2 · +1d6 · +2d6**,
nível dado pelo mestre, valendo naquele lance e só nele. A pergunta é onde ela entra.

**O argumento pelo Tick do Golpe.** A Firula cobra *"atenção ao que está em volta · o lampião
pendurado, a mesa entre vocês"*, e o que está em volta **muda durante o Preparo**. Se você
descreve o salto sobre a mesa no Tick 1 e a mesa vira lasca no Tick 2, a Firula descreve uma coisa
que não existe mais. No Tick do Golpe, a descrição casa com o mundo em que o golpe cai.

**O argumento pela declaração.** É quando o jogador fala, e é o instante natural da narração: você
diz o que vai fazer, o mestre dá o nível, e a mesa segue. Empurrar a descrição para dois Ticks
depois quebra o ritmo da fala.

**A saída que eu recomendaria, e que junta os dois:**

> **A Firula é anunciada no Preparo e confirmada no Golpe.**
> O jogador descreve ao declarar (é ali que ele fala), e o mestre dá o nível ali. Mas o bônus é
> aplicado quando o golpe cai, e **cai junto com a Firula** se o cenário que ela usava já não
> estiver lá: a mesa quebrou, o lampião apagou, o alvo saiu de cima do barril.

Isso tem três méritos. Casa com a **finta** da §8 (anunciar é justamente o que dá o que ler ao
inimigo). Dá um motivo mecânico para o inimigo **destruir o cenário** no meio do Preparo, que é
exatamente o tipo de jogada que a Firula existe para premiar. E não muda nada nos casos comuns, em
que o cenário fica onde está.

Com arma **leve** (Preparo 0), anúncio e confirmação são o mesmo instante, e nada disso aparece: a
adaga continua sendo a arma de quem não quer pensar no tempo.

---

## 5. O aviso: como a mesa lembra que o golpe vai sair

É o problema prático que a mesa levantou, e é o mais sério. Entre a declaração e o golpe, outras
pessoas agem. Quem lembra?

Hoje ninguém precisa lembrar, porque não há intervalo. Com resolução tardia, a tela precisa de
**quatro coisas**, em ordem de importância:

**1. O relógio não pula um Tick que tenha golpe agendado.** É o mecanismo, e sem ele nada mais
importa. O "⏭ próximo" avança o relógio da cena; ele passa a **parar no primeiro Tick que tiver
golpe marcado**, do mesmo jeito que para em quem tem a vez. Um golpe pendente é um compromisso da
cena, não do jogador.

**2. Uma faixa de pendências no topo da tira.** *"Neste Tick: o martelo de Brann cai em Vann"*, com
o botão de resolver ao lado. A tira da ordem já tem o lugar (o canto do relógio) e já sabe ler a
agenda; falta a linha.

**3. O aviso na peça.** O anel de Golpe já acende no token do atacante no Tick certo (existe desde
19/08). Falta o par: **acender o alvo também**, porque o que a mesa precisa ver não é "alguém está
batendo", é "alguém está batendo *nele*".

**4. Resolver sozinho, com escape.** Quando o relógio chega ao Tick do Golpe, o Grid pode aplicar o
que já foi decidido sem pedir nada, e escrever no registro. É o único jeito de a resolução tardia
não dobrar o número de toques (ver §7).

---

## 6. Vários ao mesmo tempo

Parte já está decidida, parte não.

**Decidido em 21/08 (§15.11):** golpes que caem no mesmo Tick deixam **os dois abertos** (−4 nos
dois). A escada se lê pela agenda, e não pela ordem em que o mestre digita.

**Não decidido, e a resolução tardia obriga a decidir:**

- **O alvo caiu antes do meu golpe.** O golpe se **perde**, ou **redireciona** para outro alvo ao
  alcance? O simulador tem as duas opções e roda com `redirecionar: true`; a mesa nunca escolheu.
  A tabela da §2 diz que isso acontece **1 vez por cena** numa refrega de martelos.
- **O alvo saiu do alcance durante o Preparo.** Erra? Perde-se? O atacante escolhe outro alvo?
- **A ordem entre golpes simultâneos**, quando três ou mais caem no mesmo Tick e o dano de um
  derruba o alvo de outro. Com "os dois abertos" já resolvido para a Defesa, falta o dano: ele é
  **simultâneo** (todos rolam contra o estado do começo do Tick e os danos se somam) ou
  **sequencial**? O simulador soma tudo e só depois confere quem caiu, o que é a leitura simultânea.

---

## 7. O que facilita e o que dificulta para quem joga

### Facilita

- **A decisão fica visível.** *"Meu martelo cai no 9, o dele no 8. Bato assim mesmo ou aborto?"* É
  a pergunta que o P/G/R existe para criar, e ela só existe se houver espera.
- **Interromper vira jogável.** Deixa de ser uma frase no documento e passa a ser um botão que
  acende.
- **A arma pesada ganha identidade.** Hoje ela é só "mais dano, mais Ticks". Com a espera, ela é
  *telegrafada*: forte e legível, que é a fantasia dela.
- **O cenário passa a valer.** Empurrar a mesa, apagar o lampião, puxar o alvo dali: tudo isso
  passa a ter janela para acontecer.
- **A tensão da espera.** Dois Ticks entre o gesto e o impacto é o que faz a mesa olhar para o
  tabuleiro em vez de para a ficha.

### Dificulta

- **Dobra o número de toques por ação.** É o custo mais concreto, e ele desfaz o que a frente de
  automação acabou de fazer. Hoje um ataque custa **dois toques** (arrastar até o alvo, confirmar).
  Com resolução tardia manual, custa quatro: declarar (2) e resolver quando o relógio chegar (2).
  *Só a resolução automática da §5.4 evita isso.*
- **O jogador precisa lembrar do que declarou.** Numa mesa presencial, entre declarar e bater
  passam três ou quatro falas de outras pessoas. Sem a tela avisando, vira *"espera, quem tinha um
  golpe no Tick 9?"*.
- **A rolagem sai da hora da fala.** Hoje o jogador descreve, rola e vê o resultado num fôlego só.
  Com resolução tardia pura, ele descreve, espera, e rola depois — e o dado perde a conexão com a
  descrição. **Este é o argumento mais forte contra a opção B da §8.**
- **Erro de mesa fica caro.** Esquecer um golpe pendente é perder uma ação inteira de alguém, e
  ninguém percebe até tarde.
- **Mais tempo de mesa por rodada.** Cada ação passa por dois instantes em vez de um.
- **O jogador de arma leve não sente nada disso**, e o de arma pesada sente tudo. A assimetria é
  intencional na regra, mas na experiência ela vira *"o cara do martelo demora mais para jogar"*.

---

## 8. As três saídas

### A · Ficar como está: resolve na declaração

A fita vira **previsão**, e é honesto chamá-la assim. Sem interrupção, sem leitura de sinal, sem
finta. O Preparo continua cobrando Defesa (a escada), que é metade do que ele faz.

**Custo:** zero. **Preço:** a §4 e a §8 do `Combate_Tempo.md` viram documentação de uma regra que a
mesa não joga, e o Preparo fica sendo só uma penalidade de Defesa com nome bonito.

### B · Resolver no Tick do Golpe

Fiel à régua, e é o que o simulador mede. Declara-se, espera-se, rola-se quando o golpe cai.

**Custo:** a máquina de pendências inteira (§5), mais quatro toques por ação, mais o dado separado
da descrição.

### C · Rolar na declaração, aplicar no Golpe (o híbrido)

O jogador **descreve e rola no instante em que fala** (o ritmo de mesa não muda), e o resultado
fica **guardado na agenda**. Quando o relógio chega ao Tick do Golpe, o Grid compara o total já
rolado com a **Defesa do alvo naquele instante** e aplica o que houver.

O que isso recupera:

- **a interrupção** existe (o golpe está no ar e pode ser cancelado);
- **o alvo pode sair** (a Defesa, a distância e o alcance são conferidos no Golpe);
- **o golpe pode se perder** se o alvo caiu antes, que é o fenômeno de 8% da §2;
- **a ficção deixa de mentir**, e o registro conta o que aconteceu quando aconteceu;
- **e a Firula do §4** cabe exatamente aqui: anunciada na fala, confirmada no impacto.

O que isso custa: **um toque a mais por ação** no pior caso (o mestre confirma a resolução), ou
**zero** se ela for automática. E uma decisão de regra: o dado é do atacante e a Defesa é do
instante do golpe, o que significa que **a mesma jogada pode acertar ou errar dependendo do que
acontecer no meio** — o que é, provavelmente, exatamente o que se quer.

Já há precedente no código: é o que a **Arte** faz desde 21/08, e é o que a folha da ação já faz
**pela metade**, porque desde hoje ela lê a Defesa do alvo no Tick do Golpe e não no da declaração.

---

## 9. O que a mesa decidiu (21/08/2026)

Dez decisões, tomadas com as tabelas acima na mão. **A mesa escolheu o pacote fiel**, e sabendo o
preço: mais toques por ação, em troca de a linha do tempo ser verdade.

| # | Decisão | Escolhido |
|---|---|---|
| 1 | Quando o golpe resolve | **B · tudo no Tick do Golpe.** Declara-se, espera-se, e rola-se quando o golpe cai |
| 2 | A Firula | **no Tick do Golpe.** Descreve-se quando o golpe cai, e a descrição sempre casa com o mundo |
| 3 | Quem resolve | **o mestre confirma cada golpe.** Nada acontece sozinho: a faixa de pendências acende e ele resolve um por um |
| 4 | O alvo caiu antes | **redireciona, e o alcance depende da arma**: corpo a corpo só pega quem está perto; arremesso e tiro pegam qualquer um no alcance |
| 5 | O perto do corpo a corpo | **quem está no alcance do atacante**: um hexágono, dois na haste. Ninguém ali, o golpe se perde |
| 6 | O alvo saiu do alcance | **o atacante acompanha se puder**; não podendo, o Preparo é interrompido ou redirecionado *(o preço de acompanhar está em conversa, §10)* |
| 7 | Três golpes no mesmo Tick | **tudo simultâneo**: todos rolam contra o estado do começo do Tick, os danos se somam, e só depois se vê quem caiu |
| 8 | O que se vê ao declarar | **nada**: alvo, manobra e tempo. Toda a conta aparece na hora de resolver |
| 9 | O contrapé | **medido na declaração.** O Preparo não serve para se recompor: quem declarou no Tick 2 com −1d6 paga −1d6, caia o golpe no 2 ou no 4 |
| 10 | A Guarda sob pressão | **no Tick do Golpe.** Você recebe o ataque quando o golpe chega, e não quando alguém aponta a arma |

### O que cada uma obriga

**A folha da ação se parte em duas.** A caixa de **declaração** passa a mostrar só alvo, manobra e
tempo (decisão 8). A caixa de **resolução**, que abre no Tick do Golpe, recebe tudo o que hoje está
junto: a Defesa com a escada, a distância e a faixa, a Firula, o acerto, o ajuste avulso, o dano e a
Absorção.

**A agenda passa a guardar a intenção, e não o resultado.** Hoje a coluna `acao` guarda a agenda de
Ticks; passa a guardar também o alvo, a manobra e o contrapé congelado na declaração (decisão 9).

**O relógio ganha um dono.** Com o mestre confirmando cada golpe (decisão 3), o próximo não pode
pular um Tick que tenha golpe agendado, e a tira precisa da faixa de pendências. Sem isso a mesa
perde golpes no meio da cena, que é o defeito mais caro da opção B.

**A Pressão muda de instante** (decisão 10), e com a resolução simultânea (decisão 7) ela não se
acumula dentro do mesmo Tick: três golpes que caem juntos rolam todos contra a guarda do começo do
Tick, e o menos seis aparece para quem atacar depois.

---

## 10. A conversa que ficou: quanto custa acompanhar

A decisão 6 diz que o atacante **acompanha o alvo que se moveu, se puder**. O preço ficou em
aberto, e a razão de ele ser difícil está numa regra que já existe e que muda a pergunta inteira.

<p class="formula">Deslocamento livre (m) = (Destreza + Atletismo) ÷ 2</p>

O capítulo de Combate chama isso de *a distância que você desliza de graça durante outra ação, sem
gastar a vez · é o arqueiro que recua e dispara, o duelista que circula enquanto golpeia*. Num
lutador comum (Destreza 3, Atletismo 3) são **3 metros de graça**, toda vez que ele age.

E o alcance do corpo a corpo é **1 metro** (dois na haste).

**Daí sai o problema:** o deslize grátis é três vezes maior que o alcance da espada. Se o alvo agir
durante o Preparo do martelo, ele desliza 3 m sem pagar nada e o martelo cai no vazio. A chance de
o turno do alvo cair dentro da janela de 2 Ticks do martelo é de mais ou menos **um terço**. Ou
seja: **sem acompanhar, um em cada três golpes pesados erra de graça.**

**E a saída elegante é a mesma regra, do outro lado:** quem ataca também tem Deslocamento livre, e
é exatamente para isso que ele existe (*o duelista que circula enquanto golpeia*). Acompanhar não
precisa de preço novo: **é o deslize grátis do atacante, que ele já tem.**

O que isso produz, entre iguais: o alvo desliza 3 m, o atacante acompanha 3 m, e o golpe cai. **O
deslize grátis não escapa de nada entre iguais** — para sair de baixo de verdade é preciso gastar
a vez numa **Corrida** (Velocidade 3, e 12 a 15 metros nos três primeiros Ticks). E quem tem mais
Destreza e Atletismo circula para fora do alcance de quem tem menos, que é uma vantagem que a ficha
já pagou.

As três saídas, e o que cada uma diz sobre o jogo:

| | O que custa acompanhar | O que isso faz com sair de baixo |
|---|---|---|
| **Deslocamento livre** | nada: é o que ele já tem | só escapa quem gastar uma ação de Corrida, ou quem for mais rápido de ficha |
| **1 Tick por metro** | o golpe atrasa o tanto que se andou | escapar compra tempo, e não a ação inteira |
| **não se acompanha** | — | o deslize grátis anula um em cada três golpes pesados |

**O que a bancada não sabe responder:** o robô do simulador é ganancioso e **nunca foge**. Nenhuma
das tabelas deste documento mede o que acontece quando o alvo usa o deslize para escapar, porque
esse comportamento não está modelado. É a única decisão desta lista que precisa de uma bateria nova
antes de fechar.

---

## 11. Todas as regras de deslocamento que existem

Varredura feita a pedido da mesa, antes de fechar a decisão 11. São **seis** regras, e três delas
mudam a conversa.

### As seis

| Regra | Onde | Quanto |
|---|---|---|
| **Deslocamento livre** | `derivados.deslocamento.normal`, capítulo de Combate | (Des + Atl) ÷ 2 metros, **de graça**, durante qualquer ação |
| **Corrida** | `derivados.deslocamento.arranque` e `.corrida` | Velocidade 3, interrompível a qualquer Tick. Arranque nos 3 primeiros Ticks: (For + Atl) ÷ 2 + Des metros **por Tick**; depois Des × 1,5 + Atl |
| **Salto** | `.saltoVertical`, `.saltoHorizontal*` | Velocidade 3, **não** interrompível |
| **Desvio de emergência** | §5.5 do Arcano, capítulo de Combate | **1 Tick por metro**, fora da própria vez, e os Ticks empurram a próxima ação |
| **Abortar o Preparo** | `combate.abortar.ticksPorMetro` | **1 Tick por metro** |
| **Deslocamento na Recuperação** | `combate.recuperacao.deslocamentoTicksPorMetro` | **2 Ticks por metro** |

Mais dois modificadores que ninguém tinha trazido para esta conversa:

- **A armadura tira metade da Penalidade em metros** (`dano.penalidade.movimento`): a pesada custa
  −1 m no Livre, no Arranque, na Corrida e no Salto Horizontal.
- **Anão, gnomo e halfling andam metade** (`racas.json`, "Baixa estatura").

E uma ausência que importa: **não existe zona de controle nem ataque de oportunidade.** Ninguém é
punido por sair de perto de ninguém. A única reação do sistema é a **ação fora de hora**, que é
paga e voluntária, e não um gatilho.

### Achado 1 · o passo é muito maior que o alcance

| Perfil | Deslocamento livre | Anão / gnomo | Arranque |
|---|:---:|:---:|:---:|
| camponês (Des 1, Atl 2) | 1,5 m | 0,75 m | 3,0 m/Tick |
| aventureiro (Des 3, Atl 4) | 3,5 m | 1,75 m | 6,5 m/Tick |
| guerreiro de placa (Des 2, Atl 3) | **1,5 m** | 0,75 m | 5,0 m/Tick |
| duelista leve (Des 5, Atl 4) | **4,5 m** | 2,25 m | 8,5 m/Tick |
| herói (Des 5, Atl 6) | 4,5 m | 2,25 m | 9,5 m/Tick |

O alcance do corpo a corpo é **1 metro** (dois na haste). Ou seja: **todo mundo desliza de graça
mais do que o braço alcança**, e o guerreiro de placa é justamente quem desliza menos.

Entre **iguais** (3,5 m de cada lado), o alvo desliza 3,5 e o atacante acompanha 3,5 mais 1 de
alcance: o golpe cai. Entre o **duelista e o guerreiro de placa**, o duelista desliza 4,5 e o
guerreiro só cobre 2,5: **o golpe erra, e erra sempre**, porque nada nisso é aleatório.

Isso é bonito como fantasia (o ágil não é alcançado pelo lento) e perigoso como regra: **é
determinístico, é de graça e não tem contrapartida.** O duelista entra, bate e sai, todo turno, e
o martelo nunca encosta.

### Achado 2 · o Arcano já decidiu isto, do outro lado

`arcano.tempoDaArte.area.deslocamentoLivre` diz, sobre escapar de uma área que está sendo montada:

> *"Quem leu o sinal com Ticks de sobra simplesmente não está mais lá, e **não paga nada por
> isso**."*

E `.contraOPasso` explica o princípio: *"Um molde só prende quem não sai dele de graça. O
Deslocamento livre humano vai de 1,5 a 5 m, e a escada do lado da base (0,5 · 1 · 2 · 3 · 4 · 5 ·
6 m) atravessa exatamente essa faixa."* Ou seja: **a Arte foi calibrada contra o passo**, de
propósito, e o grau baixo serve para pegar quem está preso.

O corpo a corpo não foi. O alcance de 1 m está abaixo do passo de **todo mundo**, inclusive o do
camponês. Pela mesma lógica que rege a Arte, **o golpe corpo a corpo nunca deveria alcançar quem
tem Ticks de sobra** — e é isso que a decisão 11 precisa aceitar ou recusar.

### Achado 3 · o preço de andar varia treze vezes

Postos no mesmo eixo, para um aventureiro:

| Como | Ticks por metro |
|---|:---:|
| Deslocamento livre, na própria ação | **0,00** |
| Corrida (Velocidade 3, 6,5 m por Tick) | **0,15** |
| Desvio de emergência, fora da vez | 1,00 |
| Abortar o Preparo | 1,00 |
| **Deslocamento na Recuperação (K20)** | **2,00** |

Andar na Recuperação custa **treze vezes** o preço de correr na própria vez. A diferença tem
justificativa (é movimento fora da vez, sem gastar ação), mas o número faz dela uma regra que
ninguém vai usar: 3 metros na Recuperação custam 6 Ticks, quase uma ação inteira, e a mesma
distância na própria vez sai por uma fração disso.

---

## 12. O que a mesa decidiu sobre deslocamento (21/08/2026)

Sete decisões, com a varredura da §11 na mão.

| # | Decisão | Escolhido |
|---|---|---|
| 1 | O Grid cobra o passo grátis? | **Não.** Mover quando livre segue de graça e ilimitado no tabuleiro; o orçamento do passo é da mesa |
| 2 | Quando o passo é gasto | **No instante em que você age.** Ele faz parte da declaração, e não é uma esquiva guardada para quando alguém declara contra você |
| 3 | O passo tira do alcance de quem declarou? | **Tira, e o atacante acompanha com o próprio passo.** Entre iguais o golpe cai; o ágil escapa do lento |
| 4 | O deslocamento na Recuperação | **1 Tick por metro** (era 2) |
| 5 | Baixa estatura | corta **só a Corrida e os Saltos**; o Deslocamento livre não muda |
| 6 | O Grid mostra o passo? | **Mostra ao arrastar, e não impede**: a seta escreve quanto do trecho é grátis |
| 7 | Unificar os três preços no livro | **Não.** Ficam escritos separados, para dar para calibrar um sem mexer nos outros |

### O que isso quer dizer junto

As decisões 1, 2 e 3 se combinam numa frase: **o Grid mede e mostra, e quem julga se o golpe
alcançou é o mestre.** Ele não guarda o orçamento do passo de ninguém, então também não tem como
decidir sozinho se o alvo escapou ou se o atacante acompanhou: o que ele faz é escrever a
distância e a faixa de alcance na folha, como já escreve. É a mesma linha da distância e do
contrapé, e ela já está construída.

A decisão 3 aceita, de olhos abertos, que **o duelista leve nunca seja alcançado pelo guerreiro de
placa** em campo aberto: 4,5 m de passo contra 1,5 m mais 1 m de alcance. Isso é determinístico e
não tem dado nenhum. A contrapartida existente é o **agarrão**, que é uma ação inteira, e o
terreno, que o Grid já desenha. Se a mesa achar pouco, o lugar de mexer é numa trava de
engajamento, e não no preço do passo.

A decisão 4 fecha a assimetria que a bancada mostrou: **1 Tick por metro para andar fora da sua
vez**, seja no desvio de emergência contra área, no abortar do Preparo ou na Recuperação. Os
três números continuam separados no `regras.json` (decisão 7), mas hoje valem o mesmo.

### O que falta construir

- **A decisão 6** é a única com código, e tem um problema aberto: o passo grátis sai de
  **Destreza + Atletismo**, e o bestiário guarda Atributos mas **não guarda perícias**. Para o PC
  o número está na ficha; para a criatura ele não existe. Ou o bloco do bestiário ganha um campo
  de deslocamento, ou a seta escreve o passo só para quem tem ficha.
- **A K20 muda de número** no `regras.json` (feito), e o Grid já lê de lá: o deslocamento pago
  passou a custar metade sem tocar em uma linha de código.

---

## 13. A régua do passo foi refeita (22/08/2026)

A §11 mediu o passo com a fórmula antiga e chamou o resultado de "mais lento que caminhar". **Essa
leitura estava errada**, e a mesa a corrigiu: dividir o passo pelo tempo da ação inteira dá um
CICLO DE TRABALHO, e não uma velocidade. Ninguém desliza durante os seis segundos: anda por um
instante e passa o resto golpeando.

A leitura certa é outra, e ela vem de graça do próprio sistema: como **Tick ≈ 1 segundo**, o passo
em metros é a velocidade em m/s **se o movimento durar um Tick**. Ou seja:

<p class="formula">O Deslocamento livre é um Tick de movimento</p>

Com isso dá para calibrar contra o mundo. Andar tranquilo são 1,4 m/s; fechar distância numa briga,
sem perder guarda nem equilíbrio, fica entre 2 e 4 m/s; correr de verdade passa de 6. A fórmula
antiga, `(Des + Atl) ÷ 2`, punha o personagem médio no lugar certo (3,5 m/s) e **estourava nas duas
pontas**: 1,0 m/s no camponês, que é mais lento que caminhar, e 6,0 m/s no acrobata, que já é
corrida.

**A régua nova, decidida em 22/08:**

<p class="formula">Deslocamento livre (m) = 2 + (Destreza + Atletismo) ÷ 4</p>

| Perfil | antes | agora |
|---|:---:|:---:|
| camponês (Des 1, Atl 1) | 1,0 m | **3 m** |
| soldado (Des 2, Atl 3) | 2,5 m | 3 m |
| aventureiro (Des 3, Atl 4) | 3,5 m | 4 m |
| Kael, do livro | 4,0 m | **4 m** (não mudou) |
| duelista (Des 5, Atl 4) | 4,5 m | 4 m |
| acrobata (Des 6, Atl 6) | 6,0 m | **5 m** |

E o efeito na decisão 3, que era o risco apontado na §12:

| | antes | agora |
|---|---|---|
| duelista foge do guerreiro de placa | escapa por 1 m | **é alcançado** |
| acrobata foge do camponês | escapa por 4 m | escapa por 0,7 m |

**A faixa estreita conserta a determinística.** Com o passo indo de 1 a 6 m, quem tinha Destreza
alta simplesmente não era alcançado, e não havia dado nenhum nisso. Com 2 a 5, quase todo mundo
alcança quase todo mundo, e **sair de baixo volta a exigir uma Corrida de verdade**.

**O que se perde:** Destreza e Atletismo valem menos no tabuleiro. Antes, ir de 2/2 para 6/6
triplicava o passo; agora sobe 48%. Foi escolha da mesa, e o argumento é que a variação de
velocidade entre humanos treinados **é mesmo pequena**: o passo deixou de ser uma estatística de
personagem e virou uma constante humana com pouca folga.

**Duas consequências que vieram junto, e valem estar escritas:**

- **A Centelha não entra.** O semideus circula como um soldado bem treinado; o sobre-humano dele
  aparece nos Saltos e na Corrida, que já têm Centelha, e não no jogo de pernas.
- **Os três primeiros graus de área das Artes ficaram menores que o passo de todo mundo.** Com piso
  de 2 m, um molde de 0,5, 1 ou 2 m não pega mais ninguém que tenha vez: só quem está preso,
  surpreso ou sem ação. O texto do `arcano.tempoDaArte.area.contraOPasso` foi reescrito com isso
  dito na cara, porque é uma perda de alcance real para a Arte pequena.

**E as raças de perna curta** passam a andar **dois terços** do passo humano (e metade na Corrida e
nos Saltos), o que substitui a decisão 5 da §12. Com a faixa nova isso dá 2 a 3,3 m: o anão
continua deslizando mais que o alcance da espada, então ainda escapa e ainda acompanha, só que por
pouco.

---

## Fontes internas

- `Combate_Tempo.md` §4 (o que interromper compra), §8 (ler o sinal), §14.6 e §14.7 (o que cabe em
  cada fase, e o rastreio), §15.11 (golpes no mesmo instante).
- `scripts/lib-tempo.mjs`: o motor da calibragem, que resolve no Tick do Golpe e conta os perdidos.
- `Grid_Automacao.md`: a conta do atrito, que é o que a opção B contraria.
- `habilidades.md` §Firulas.
