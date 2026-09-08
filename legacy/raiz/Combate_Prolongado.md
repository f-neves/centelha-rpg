# Combate prolongado (ideia alternativa, NÃO é regra)

> **Aviso, e ele vale para o documento inteiro.** Nada aqui está decidido, nada aqui
> vale em mesa e nada aqui foi implementado. Não há uma linha de `armas.json`, do
> capítulo IX, da ficha ou do rastreador da mesa que corresponda a isto. É o registro
> de uma conversa exploratória de **19/08/2026**, guardada porque as medições valem e
> porque a estrutura pode ser útil depois. **A regra viva do combate continua sendo o
> capítulo IX mais o `Combate_Tempo.md`.**
>
> A conversa foi interrompida por não convencer. O registro fica como está, inclusive
> as escolhas feitas no caminho, que são escolhas **de exploração**, não decisões.

---

## 1. O pedido

Na maior parte dos RPGs o combate dura poucos turnos, porque bastam alguns golpes para
alguém cair. A pergunta era como fazer as lutas durarem mais **sem apenas torná-las
lentas**, e a ideia inicial era ter dois tipos de ação:

- a troca comum do duelo de cinema, em que um ataca e o outro se defende, sem grande
  perigo, mas empurrando o outro pelo cenário;
- o ataque perigoso, com um poder, um golpe forte ou uma manobra elaborada, que é o
  que fere de verdade.

---

## 2. O que a bancada diz do combate de hoje

Números medidos, não estimados. Duelo espelho, lutador padrão (Atributo+Habilidade 10,
Centelha 1, Vigor 4, Força 4, PV 37, sem armadura), `node scripts/sim-ticks.mjs --so A`:

| arma | duração |
|---|---|
| Alabarda | 20,0t |
| Montante | 23,7t |
| Lança | 30,6t |
| Martelo de Guerra | 31,0t |
| Espada Longa | 33,1t |
| Picareta de Guerra | 42,5t |
| Maça | 59,0t |

Espada longa: 33 Ticks ÷ 6 de Velocidade = **5,5 ações por lado**.

**O diagnóstico não é o relógio, é a contagem de decisões.** Trinta e três segundos de
briga é uma duração razoável; o problema é que são cinco decisões por lado e quatro
delas são a mesma. Inflar PV acrescenta rolagens, não escolhas, e é por isso que
"mais lento" não responde ao pedido.

### 2.1. O sistema já separa o toque do ferimento

Distribuição de Margem do ataque padrão contra vários estados de guarda:

| Defesa efetiva | erra | Margem 0 | Margem 1 | Margem 0 sobre os acertos |
|---|---|---|---|---|
| 22 (guarda inteira) | 70% | 27% | 3% | **89%** |
| 20 | 50% | 40% | 10% | 80% |
| 18 | 31% | 47% | 22% | 68% |
| 16 (guarda arruinada) | 15% | 45% | 37% | **53%** |

Com a guarda inteira, **9 em cada 10 acertos são Margem 0**: o golpe que encosta e não
abre nada. A curva "esgrima no começo, sangue no fim" já está no motor. O que o sistema
não faz é pagar as duas coisas com moedas diferentes.

### 2.2. Erodir a Defesa compra pontaria, não devastação

Esta medição é a que decidiu o desenho. Para cada valor de Defesa, chance de acertar e
tamanho da ferida:

| DV | Espada Longa acerta | dano por acerto | Martelo acerta | dano por acerto |
|---|---|---|---|---|
| 22 | 31% | 6,9 | 22% | 14,2 |
| 20 | 50% | 7,2 | 40% | 14,5 |
| 18 | 69% | 7,7 | 60% | 14,9 |
| 16 | 85% | 8,3 | 78% | 15,4 |
| 14 | 94% | 9,1 | 90% | 16,2 |
| 12 | 98% | 10,1 | 97% | 17,1 |
| 10 | 100% | 11,2 | 99% | 18,1 |

Derrubar o DV de 22 para 10 multiplica por **3** a chance de acertar e por **apenas
1,6** o tamanho da ferida. Num sistema em que o golpe sério é a liquidação, isso não
basta: o golpe "decisivo" entregaria 11 pontos contra 37 de PV, exigindo quatro ciclos
inteiros de moagem (estimativa grosseira: cerca de 40 ações por lado, 240 Ticks, sete
vezes a duração de hoje, e quase tudo moagem sem decisão).

**Conclusão:** qualquer modelo em que a troca leve prepara o golpe pesado precisa que a
preparação vire **profundidade de ferida**, não só pontaria.

---

## 3. O que o sistema já tem, e que faria parte do trabalho

- **Guarda sob pressão:** −2 por ataque feito ou recebido, acumula sem teto, zera na sua
  ação. É a erosão de guarda, com memória curta demais.
- **Preparo/Recuperação** (`Combate_Tempo.md`, decidido em 18/08/2026): a arma pesada
  telegrafa, a leve sai na hora. O eixo "gesto anunciado × gesto solto" já existe.
- **Carga voluntária:** 1 Tick comprado = +2 na rolagem, teto +6. Comprar 3 Ticks é uma
  Margem garantida a mais. O "golpe perigoso" já tem preço calibrado.
- **Quase-Acerto:** a faixa logo abaixo do acerto já rende alguma coisa.
- **Margem:** a cada 6 acima da Defesa, +1d6 de dano.
- **Deslocamento livre:** movimento de graça durante qualquer ação.

---

## 4. A armadilha já medida (não repetir)

A §4.5 do `Combate_Tempo.md` testou o "gastar recurso para não ser ferido" (aparo
desesperado, +6 de Defesa pagos com dívida de Ticks):

| variante | duração | leve | pesada |
|---|---|---|---|
| sem aparo (referência) | 34,2t | 53,9% | 60,0% |
| +6 Def por 2 Ticks, à vontade | **58,2t** | **+15,9** | **−17,3** |
| +6 Def por 3 Ticks, 1 por ação | 53,4t | +9,0 | −10,4 |
| +6 Def por 3 Ticks, uma por cena | 39,0t | +3,5 | −3,6 |

A duração **subiu 70%**, que é exatamente o objetivo, mas o equilíbrio entre classes de
arma **girou 33 pontos**, e nenhum teto consertou. O motivo: quem paga por golpe
recebido paga muitas vezes contra arma leve e poucas contra pesada.

> **Regra geral que sai daí:** qualquer modelo em que o defensor gasta algo **a cada
> golpe recebido** nasce com esse defeito, porque a frequência de golpes varia com a
> classe de arma do atacante.

---

## 5. Os caminhos considerados

### 5.1. Primeira leva (reaproveitando o que existe)

- **A Margem separa sangue de pressão.** Acerto de Margem 0 não tira PV: abre uma
  Abertura permanente na Defesa. Margem 1+ fere. Zero contabilidade nova, e a rampa cai
  da tabela da §2.1. Descartada por reaproveitar demais o que já existe.
- **Duas declarações** (sondar e comprometer), que é o *withering/decisive* do Exalted 3e.
- **Guarda como trilha:** segunda barra passiva, parenta do módulo Fôlego.
- **Só recalibrar** PV, Absorção e o passo da Margem. O controle honesto, e o "mais
  lento" que o pedido recusava.

### 5.2. Segunda leva (arquiteturas novas)

O pedido era por algo que não existisse ainda, então a pergunta virou **sobre o que a
luta é disputada**, e não como o dano é calculado.

- **A luta é disputada por tempo.** Golpes roubam Ticks em vez de sangue; a Vantagem de
  Tempo é a distância entre os dois marcadores no trilho, que já está desenhada. Quando
  a vantagem alcança a Velocidade da sua arma, destrava um golpe de liquidação que **não
  rola acerto**, porque o inimigo literalmente não pode responder. A diferença central
  para o Exalted 3e: o golpe decisivo não é escolhido, é **conquistado**. Contabilidade
  nova: zero. Problemas: vantagem contra quem numa refrega, o arqueiro que nunca entra
  na dança, e a Horda (que já tem P=0 na revisão).
- **A troca é um leilão.** O defensor pode ceder, aparar ou **subir**; cada subida
  acrescenta um Tick de compromisso dos dois lados e dobra o que está em jogo. Três
  trocas podem ter doze decisões. Caro em tempo de mesa numa refrega, e depende de
  "ceder" não ser sempre a jogada certa.
- **O defensor escolhe a moeda.** O golpe conecta e quem apanha decide onde paga:
  sangue (PV), equilíbrio (Ticks), guarda (Defesa) ou terreno (posição). Dobra as
  decisões sem uma rolagem a mais, e é a única em que quem está apanhando tem o que
  fazer. Cai no defeito medido da §4 se não for desenhada com cuidado.

Vizinhos conhecidos, para registro: *withering/decisive* do Exalted 3e (perto da
primeira, mas com declaração em vez de conquista), *Duel of Wits* do Burning Wheel
(perto da segunda, mas com roteiro em vez de leilão), e as consequências do Fate e do
Blades (perto da terceira, mas sem alocação por golpe).

---

## 6. A ideia que foi desenvolvida

Formulação original, do dia 19/08:

> A passagem de tempo (ataques menores) vai diminuindo os DVs dos participantes, até
> alguém decidir atacar seriamente. Armas pesadas diminuem muito de uma vez, mas agem
> menos vezes. Armas leves diminuem pouco, mas mais vezes. O DV só é resetado depois de
> sofrer um ataque com intenção de ferir, e **o ataque não precisa acertar**.

### 6.1. O que essa regra constrói sem querer: a frase

Se a guarda só volta quando alguém tenta ferir, a luta se divide sozinha numa unidade
que não é o turno. Na esgrima isso se chama *frase de armas*: uma sequência contínua de
ações ligadas, que termina quando alguém se compromete de verdade.

> A luta é uma sequência de **frases**. Dentro de uma frase, os dois se pressionam e as
> guardas se abrem. A frase **termina quando alguém se compromete**, acerte ou erre.

Isso não é metáfora colocada por cima: é literalmente o que a regra do reset faz.

### 6.2. O número sobe, não desce

Como a exposição acumulada **não** mexe na Defesa (escolha da §6.4), ela não é uma
guarda gastando: é uma exposição acumulando, a partir de zero.

O motivo é concreto. Se fosse um valor pessoal descendo, a profundidade da ferida
dependeria de **quanta guarda a vítima tinha**, o que é ao contrário (um esgrimista
melhor entregaria feridas maiores ao ser aberto). Contando para cima a partir de zero, a
ferida mede **quanto trabalho foi feito para abri-la**. E quem defende bem já se protege
pela Defesa, que não cede nunca: as pressões contra ele simplesmente não conectam.

Nome de trabalho do número: **Abertura**.

### 6.3. O modelo, como ficou

> **Abertura.** Um número por combatente, começa em zero.
>
> **Pressionar.** Ataque normal contra a Defesa. Não fere. Conectou, soma Abertura ao
> alvo: pouco (arma leve), médio (média), muito (pesada).
>
> **Comprometer.** Ataque normal contra a mesma Defesa, anunciado (o Preparo que já
> existe). Conectou, fere, e a Abertura acumulada vira **profundidade**. Acertando ou
> errando, a Abertura do alvo zera.

Duas ações, a mesma rolagem, o mesmo alvo passivo. Nada do motor de hoje se mexe; o que
muda é o que a rolagem compra.

### 6.4. As escolhas feitas na conversa (exploratórias, não decididas)

| Pergunta | Escolha | O que ela produz |
|---|---|---|
| Quem reseta quando alguém se compromete? | **só o alvo** | comprometer-se é perigoso: você gasta a guarda dele e a sua continua aberta. A decisão vira duas variáveis, "ele está aberto **e** eu ainda não" |
| O que a Abertura faz? | **só aprofunda a ferida** | a Defesa nunca cede, a frase não acelera, e o golpe sério **nunca fica fácil**: sobe só a aposta |
| Pressionar rola dado? | **contra a Defesa, como hoje** | o motor atual fica intacto e a perícia de defesa trabalha, ao custo de muita rolagem que não fere ninguém |
| O que impede a frase eterna? | **a frase se quebra sozinha** | depois de N trocas sem compromisso, os dois se separam e tudo zera. Esperar demais perde o investimento de graça |
| O golpe sério erra, e daí? | **o Quase-Acerto salva parte** | três resultados em vez de dois: ferida cheia, raspão que converte parte, erro feio que perde tudo |

### 6.5. O que caiu sozinho da estrutura

Nada disto foi desenhado; são consequências das escolhas acima.

- **A decisão nunca é "ataco ou não", é "agora ou mais uma".** Os dois números sobem
  juntos, à vista dos dois jogadores.
- **O trilho vira a terceira variável.** Com o reset só do alvo, comprometer-se te deixa
  exposto e o inimigo revigorado, então a resposta natural dele é o contragolpe. O que
  quebra a simetria é o tempo: comprometa-se **na recuperação dele** e você ganha a sua
  próxima ação antes que ele responda. É o conceito de *tempo* da esgrima, e ele cai de
  graça porque o trilho de Ticks já está na tela.
- **Papéis por classe de arma, sem escrever nada.** A arma leve age duas vezes dentro de
  um ciclo pesado e consegue o combo *comprometer e recompor*: colhe pouco e colhe
  limpo. A pesada nunca consegue: colhe muito e paga a resposta, sempre.
- **Divisão de papéis no grupo que nenhum RPG tem.** As adagas abrem a guarda, o martelo
  liquida. Não é bônus de flanco, é o mesmo recurso construído por uns e gasto por
  outro. E dá o inverso de graça: numa horda, **o primeiro capanga que se compromete
  gasta o investimento de todos os outros** e devolve a guarda cheia ao herói.
- **O golpe desesperado vira jogada defensiva.** Como o reset não exige acerto, quem
  está aberto pode desferir um golpe torto só para encerrar a frase. Já vem pago: você
  anunciou, ele pode interromper, e você jogou fora o que tinha construído nele.
- **Ceder terreno cabe no Deslocamento livre.** Recuar durante a própria ação tira parte
  da própria Abertura. Não custa ação, custa **espaço**, e o espaço acaba: parede,
  parapeito, beira. A luta anda pela sala, e o mapa vira o relógio, sem tabela nova. O
  Grid da mesa já desenha o mapa.
- **As Artes encaixam sem uma linha nova.** A Arte já resolve no último Tick, toda ela
  Preparo: ela **já é** um golpe comprometido por natureza. E a flecha que vem da
  galeria encerra a frase de dois duelistas que nem viram o arqueiro.

---

## 7. O que ficou aberto

1. **Números, todos.** Quanto cada classe de arma soma de Abertura, quantos pontos valem
   +1d6, quantas trocas até a frase quebrar, quanto o terreno devolve. Nada disso foi
   calibrado: a conversa parou no modelo.
2. **A moagem em rolagens.** Com "pressionar rola contra a Defesa", a maior parte da luta
   vira rolagens que não ferem ninguém. Era o custo conhecido daquela escolha, e é o
   ponto mais provável de a mesa reclamar.
3. **A refrega.** Abertura é um número por pessoa, mas a frase é entre um par. O que
   acontece quando três pressionam um e um quarto se compromete não foi resolvido.
4. **Fusão com a Guarda sob pressão.** As duas regras fazem a mesma coisa em escalas de
   tempo diferentes. Teriam de virar uma, não conviver.
5. **O arqueiro.** Ele pressiona de longe sem nunca entrar na frase, e o custo de se
   comprometer (ficar exposto ao contragolpe) não o alcança.
6. **A duração de verdade.** A estimativa grosseira da §2.2 sugeria multiplicar por
   muito. O modelo da §6 corrige o problema da profundidade, mas **nada foi simulado**:
   a única bancada rodada foi a de diagnóstico.

---

## 8. Por que parou

O resultado não convenceu. O documento fica como registro das medições (§2 e §4, que
valem por si e são reutilizáveis) e da estrutura (§6, caso a ideia da frase volte a ser
útil em outro desenho).
