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

## 9. O que precisa ser decidido

1. **A saída:** A, B ou C.
2. **A Firula:** na declaração, no Golpe, ou anunciada e confirmada.
3. **O alvo que cai antes do golpe:** o golpe se perde, ou redireciona?
4. **O alvo que sai do alcance durante o Preparo:** erra, se perde, ou o atacante escolhe outro?
5. **O dano simultâneo** de três ou mais golpes no mesmo Tick: soma tudo e confere depois (como o
   simulador), ou resolve um de cada vez?
6. **Se a resolução é automática ou pedida.** Automática corta o atrito; pedida deixa o mestre
   narrar o impacto.

---

## Fontes internas

- `Combate_Tempo.md` §4 (o que interromper compra), §8 (ler o sinal), §14.6 e §14.7 (o que cabe em
  cada fase, e o rastreio), §15.11 (golpes no mesmo instante).
- `scripts/lib-tempo.mjs`: o motor da calibragem, que resolve no Tick do Golpe e conta os perdidos.
- `Grid_Automacao.md`: a conta do atrito, que é o que a opção B contraria.
- `habilidades.md` §Firulas.
