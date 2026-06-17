---
ordem: 4
numeral: "IV"
titulo: "Combate"
resumo: "Como uma luta funciona: a linha do tempo, o ataque, o dano, a defesa, o movimento, o fôlego, a vantagem tática e as Técnicas."
---

O combate não corre em turnos rígidos: corre numa **linha do tempo de Ticks** (cada um ≈ **1 segundo**). Cada ação custa um tempo — a sua **Speed** — e, depois de agir, você só volta a jogar quando esses Ticks passarem. Escolher *quando* agir vale tanto quanto *como*.

## Como uma luta acontece

Antes dos detalhes, o esqueleto de uma briga, do começo ao fim:

1. **Role a Iniciativa** (1d6 + Raciocínio + Prontidão) — ela diz quem age primeiro na linha de Ticks.
2. **Na sua vez, escolha uma ação.** Cada ação custa um tempo (a **Speed**); após agir, você só volta quando esses Ticks passarem.
3. **Para acertar, role seu pool de ataque** e compare com a **Defesa** do alvo — um número fixo. Se o total **superar** a Defesa, você acerta (empate erra).
4. **Quanto melhor o acerto, mais forte o golpe:** a cada **6 pontos acima da Defesa**, o dano ganha **+1d6** — isso se chama **Margem**.
5. **O dano, menos o Soak** (a absorção do alvo), vira ferimento.
6. **Quem chega a 0 de Vida cai.** Ferimentos, morte e sangramento são assunto do próximo capítulo, [Vida, Ferimentos & Cura](/regras/vida-ferimentos-cura).

<div class="callout exemplo"><span class="lbl">Exemplo</span>Kael ataca um bandido de <strong>Defesa 10</strong>. Seu pool de ataque dá <strong>3d6+5</strong>; ele rola e soma <strong>16</strong>. 16 supera 10 → acerta, com diferença de 6 — exatamente <strong>uma Margem</strong>, então o dano ganha <strong>+1d6</strong>. Ele rola o dano da espada (2d6) + a Margem (1d6) + a Força, desconta o Soak do bandido, e o que sobra abre ferimento.</div>

No osso, é só isso. O resto do capítulo são as camadas que dão profundidade tática: **quando** agir, **como** se mover, **gerir o fôlego**, **usar a posição** e **desencadear Técnicas**.

## A linha do tempo: Ticks, Speed e Iniciativa

No início, cada um rola a **Iniciativa = 1d6 + Raciocínio + Prontidão**. Quem tirar o maior valor começa no **Tick 0**; todos os demais começam no **Tick 1**. A partir daí, a distância pesa: a cada **6 pontos** abaixo da maior iniciativa, o retardatário **começa 1 Tick mais tarde** e **perde 1d6 na primeira ação** (pego no contrapé). A penalidade é [(maior − sua) ÷ 6], em Ticks e em dados. (Empate na maior iniciativa: começa quem tiver o maior Raciocínio; persistindo, decidam no 1d6.)

<div class="callout exemplo"><span class="lbl">Exemplo</span>A maior iniciativa da cena foi <strong>14</strong>. Quem tirou de <strong>9 a 13</strong> (1–5 atrás) começa no Tick 1, sem perda. Quem tirou de <strong>3 a 8</strong> (6–11 atrás) começa no <strong>Tick 2</strong> e <strong>perde 1d6</strong> na primeira ação. Quem tirou <strong>1 ou 2</strong> (12–13 atrás) começa no <strong>Tick 3</strong> e <strong>perde 2d6</strong>. A perda vale só para a <em>primeira</em> ação — depois, todos jogam em pé de igualdade na linha de Ticks.</div>

Cada ação tem uma **Speed** — quantos Ticks ela custa antes de você poder agir de novo:

| Ticks | Tipo de ação | Exemplos |
|:---:|---|---|
| 3 | Muito rápida | correr, saltar, abrir porta, sacar arma |
| 4 | Utilitária | pegar item, interagir com o cenário |
| 5 | Ataque leve | faca, adaga, espada curta, bastão |
| 6 | Ataque médio | espada longa, machado de uma mão, lança |
| 7 | Ataque pesado | martelo de guerra, montante, alabarda |

<p class="muted">Armas leves agem mais vezes e defendem melhor; as pesadas batem como um trovão, mas deixam você exposto entre os golpes. A arma define o seu estilo.</p>

## O ataque: acertar e a Margem

Para atacar, monte o pool de **Atributo da arma + Habilidade**, some o **Acerto da Arma**, aplique Especialidade, Stunts e Técnicas, e role. Você acerta se o total **superar a Defesa** do alvo (empate erra).

<p class="formula">Ataque = (Atributo da arma + Habilidade + Especialidade) + Arma + Centelha×2</p>

<p class="muted">O <strong>Atributo da arma</strong> é a Destreza na maioria das armas, mas a Força nos golpes brutais (e a Percepção no tiro com arco) — cada arma diz qual usa.</p>

A Defesa é um valor **fixo** e **passivo** — o alvo não rola para se defender:

<p class="formula">Defesa = (Destreza + Habilidade) × 2 + Especialidade + Centelha×2</p>

Acertar não é tudo ou nada: a cada **6 pontos acima da Defesa**, você ganha **1 Margem**, e cada Margem vira **+1d6 de dano**. Um acerto raspando arranha; um acerto folgado despedaça.

<p class="muted">A <strong>Centelha</strong> soma <strong>+2 por ponto</strong> dos dois lados — ao ataque e a todas as defesas. Entre Centelhas iguais ela se cancela, e o duelo joga igual do mortal ao semideus; contra quem tem menos Centelha, a diferença vira vantagem líquida no acerto e na guarda.</p>

### Esforço: forçar o golpe

Qualquer ataque pode ser **forçado**: gaste Fôlego extra para somar dados ao ataque. Cada **+1d6 dobra o custo de Fôlego do golpe e soma +1 à Speed** (mais lento, mais exposto): +1d6 = ×2 e Speed +1; +2d6 = ×4 e Speed +2; e assim por diante. **Não há teto** — a própria duplicação é o limite: forçar muito esgota o Fôlego num átimo.

É a manobra para dois momentos: **furar uma defesa alta** (os dados extras ajudam a superá-la) ou **encerrar rápido** um inimigo frágil (mais Margem = mais dano). É a alavanca de "dar tudo" disponível a *qualquer um*, mesmo o mortal sem Centelha — mas o preço cresce rápido: forçar a arma **leve** é viável; forçar a **pesada**, quase proibitivo (um pesado +1d6 já custa 76 de Fôlego bruto — uma rajada inteira num só golpe, e você fica à beira da exaustão).

## Dano e Armadura

<p class="formula">Dano = (Dado da Arma + Margem) + Força − Soak</p>

O **Dado da Arma** é 1d6 (leve), 2d6 (média) ou 3d6 (pesada). Armas de uma mão somam a **Força**; as de duas mãos, o **dobro da Força**. Cada Margem (6 pontos acima da Defesa) acrescenta +1d6.

O dano vem em três sabores: **Impacto** (contundente), **Corte** e **Perfuração** (ambos letais). O **Soak** absorve o golpe — naturalmente igual ao Vigor contra Impacto e à metade do Vigor contra dano letal; armaduras somam mais. Armas perfurantes têm **Penetração**: se ela não vencer a Proteção da armadura, o dano é anulado. Já as armas com a tag **Ruptura** ignoram o Soak de impacto da armadura, amassando-a.

## Quase-Acerto

<div class="callout"><span class="lbl">Quase Acerto</span>Errar por pouco — dentro de uma <strong>Margem</strong> igual ao <strong>Bônus de Quase-Acerto da arma + sua Centelha</strong> — ainda raspa o alvo. Armas leves e rápidas têm Bônus QA alto (raspam muito, mas de leve); armas pesadas têm Bônus QA baixo (raspam raro, mas fundo). O raspão causa o <strong>Dano de Quase-Acerto da arma</strong> (leve 1 · média 2 · pesada 3), <strong>sem o Soak normal</strong>, mas reduzido pela <strong>Redução de Quase-Acerto da armadura</strong> (leve 1 · média 2 · pesada 3, mínimo 0). A armadura <em>não</em> estreita a Margem — você nica o alvo blindado igual, mas a placa absorve o arranhão. Quanto mais Centelha, mais largo o raspão.</div>

## Esquivar ou Bloquear

Sua Defesa pode vir de duas fontes, e você usa **a melhor** delas contra cada golpe:

- **Esquiva** — com a habilidade Esquiva, mais a mobilidade do terreno. Some sai da frente.
- **Bloqueio** — com a habilidade da própria arma ou Escudos, mais a Defesa da Arma e o escudo. Apara o golpe.

Mas **nem tudo se bloqueia ou se esquiva** — uma avalanche, uma onda de fogo, uma rede bem lançada cobram outra saída.

## Movimento: Deslocamento, Corrida e Salto

O **Deslocamento livre** é a distância que você desliza **de graça durante outra ação** (atacar, conjurar) — em qualquer direção, sem gastar a vez. É o arqueiro que recua e dispara, o duelista que circula enquanto golpeia:

<p class="formula">Deslocamento livre (m) = (Destreza + Atletismo) ÷ 2</p>

Para ir além, gaste a vez numa **ação de movimento** — Corrida ou Salto, ambas **Speed 3**.

### Corrida (Speed 3)

Interrompível a **qualquer Tick** — você decide quando parar. A largada acelera: os **3 primeiros Ticks** correm à **Velocidade de Arranque** (a explosão do disparo); do **4º Tick em diante**, à **Velocidade de Corrida** (o ritmo sustentado). Cada valor é em metros por Tick.

| Fase | Quando | m por Tick |
|---|---|---|
| **Arranque** | Ticks 1–3 | (Força + Atletismo) ÷ 2 + Destreza |
| **Corrida** | Tick 4 em diante | Destreza × 1,5 + Atletismo |

### Salto (Speed 3)

Um impulso único que, **uma vez iniciado, não pode ser interrompido**. Três alcances, conforme a direção e o impulso:

| Salto | Alcance | Fórmula |
|---|---|---|
| **Vertical** | altura, em cm | (Força × 20) + (Atletismo × 10) + (Destreza × 4) + 50 por Centelha |
| **Horizontal — parado** | distância, em m | (Força + Atletismo + Centelha) ÷ 2 |
| **Horizontal — correndo** | distância, em m | Velocidade atual + (Atletismo ÷ 2) + Centelha |

<p class="muted">No salto correndo, <strong>Velocidade atual</strong> é a sua velocidade no instante do impulso — Arranque se você corre há ≤3 Ticks, Corrida depois (na ficha, supõe-se corrida plena). O <strong>Salto</strong> é a explosão de força do corpo: a Força lança, o Atletismo controla, a Destreza ajusta — e a Centelha rompe os limites mortais, do pulo humano ao salto lendário.</p>

## Fôlego

Toda ação física — atacar, defender, correr, saltar, carregar peso — vem do **Fôlego**, a reserva do corpo. É grande e se renova sozinha, mas o esforço pesado a queima rápido: depois de uma rajada, você precisa de um respiro.

<p class="formula">Fôlego = 10 (base racial) + Vigor × 5 + Resistência × 4 + Força de Vontade × 2</p>

Você **recupera +Vigor de Fôlego por Tick o tempo todo** — inclusive lutando. E cada golpe **gasta o Fôlego (bruto) da arma** (no catálogo e na ficha): leve **15**, médio **24**, pesado **38**. Como você recupera durante os Ticks do golpe, o que pesa de fato é o **líquido** = bruto − (Vigor × Speed):

| Golpe | Vigor 3 | Vigor 4 | Vigor 5 |
|---|:---:|:---:|:---:|
| Leve (Speed 5) | 0 | **−5** *(regenera)* | −10 |
| Médio (Speed 6) | +6 | **0** *(sustenta)* | −6 |
| Pesado (Speed 7) | +17 | **+10** *(dreno)* | +3 *(devagar)* |

Golpes **leves se pagam** — e até devolvem Fôlego a quem tem Vigor alto; os **pesados drenam**. A tática nasce daí: **lute leve para acumular** Fôlego e **gaste-o** num golpe pesado, num Esforço ou numa ação extenuante (sprint, salto longo, carga pesada, que drenam como um golpe pesado). Um herói de Fôlego ~50 aguenta **~6 golpes pesados** seguidos antes de precisar mudar de marcha.

<div class="callout regra"><span class="lbl">Tomar Fôlego</span>Gaste uma ação completa (<strong>Speed 5</strong>) só defendendo e esquivando, sem se mover além do básico, e <strong>recupere metade do Fôlego máximo</strong> de uma vez — o "recuar e respirar". Essa ação <em>é</em> o descanso: vale a metade cheia, não o +Vigor por Tick por cima. Restaura cerca de uma rajada de golpes pesados.</div>

Quando o tanque aperta:

- **Defender** (Esquiva e Bloqueio passivos) **não custa** Fôlego — é o que permite recuperar lutando na defensiva.
- **Abaixo de 25%** do Fôlego: **−1d6** em toda ação física (o corpo começa a falhar).
- **Fôlego 0 — exausto:** você só pode **defender** ou **Tomar Fôlego**; não ataca nem força um golpe.

## Vantagem tática: posição e número

Posição, cobertura e postura mudam o combate sem mudar suas fichas: todos eles ajustam o **valor passivo da Defesa do alvo**. Positivo torna o alvo mais difícil de acertar; negativo, mais fácil. Use o **grau menor (±2)** para vantagens comuns e o **maior (±4)** para situações marcantes.

| Situação | Defesa do alvo |
|---|:---:|
| Cobertura parcial (parapeito, aliado à frente) | **+2** |
| Cobertura pesada (só cabeça/braço expostos, seteira) | **+4** |
| Postura defensiva total (abre mão do ataque) | **+4** |
| Alvo pequeno ou errático, à distância | **+2** |
| Atacante em terreno alto | **−2** |
| Mirar (gasta uma ação preparando o golpe) | **−2** |
| Alvo prono — atacado **corpo a corpo** | **−2** |
| Alvo prono — atacado **à distância** | **+2** |
| Flanco ou pelas costas | **−2** |
| Alvo surpreso, cego ou imobilizado | **−4** |

<p class="muted">A <strong>postura agressiva</strong> é a exceção que mexe nos dois lados: você baixa <strong>−2</strong> a sua própria Defesa até a próxima ação em troca de <strong>+2</strong> no seu ataque. O empilhamento de modificadores numa mesma Defesa é limitado a <strong>±6</strong> — nenhuma soma de vantagens transforma o golpe em acerto (ou erro) automático.</p>

<p class="formula">Cobertura total — sem nenhuma linha de visão — não pode ser alvejada; primeiro é preciso flanquear ou destruir o anteparo.</p>

### Pressão: muitos contra um

Você pode dividir sua ação em vários golpes, ao custo de precisão; e cada inimigo extra desgasta sua guarda.

| Nº de ataques | Penalidade |
|---|---|
| 2 ataques | 1º −1d6, 2º −2d6 |
| 3 ataques | 1º −2d6, 2º −3d6, 3º −4d6 |

Cada ataque extra também reduz sua Esquiva (−1) e seu Bloqueio (−2) até a próxima ação. Um único oponente brilhante resiste a muitos fracos — mas a maré da multidão acaba furando qualquer guarda.

A posição fecha o cerco: quem ataca pelo **flanco ou pelas costas** ganha o **−2 na Defesa** do alvo, porque ele não pode voltar a melhor guarda contra todos ao mesmo tempo. Dois inimigos coordenados — um prendendo a frente, outro contornando — combinam a penalidade de pressão com a de flanco: é assim que o número vira vantagem tática, e não só mais dados.

## Técnicas em combate: tempo e combos

As Técnicas das Proezas entram na luta por **dois mostradores independentes**: a **Energia** é o combustível da *cena* (quanto você ainda tem no tanque); os **Ticks** são o custo do *momento* (quanto tempo o poder rouba da sua linha do tempo). Decidir entre os dois — "gasto tempo agora ou guardo o tanque?" — é metade da tática.

| Tipo de Técnica | Ticks | Como entra |
|---|:---:|---|
| **Passiva** | 0 | Sempre ligada. Não custa nada, não ocupa a sua vez. |
| **Reflexiva** | 0 | Dispara *fora da sua vez*, em reação (aparar, esquivar, contra-atacar). Paga Energia; **só 1 por gatilho**. |
| **Ativa suplementar** | +0 | Turbina uma ação que você já vai fazer (*"seu golpe ganha +2d6"*). Dobra junto com o ataque; você só paga a Energia. |
| **Ativa independente** | própria | A Técnica **é** a ação (um deslocamento, um grito em área). Custa Speed pela banda: **5** (bandas 1–2), **6** (banda 3), **7** (bandas 4–5). |

### Combos: concentrar num golpe só

Numa única ação você pode **empilhar várias Técnicas suplementares** sobre o mesmo golpe — mas cada acréscimo encarece. A **k-ésima** Técnica somada à ação cobra uma **sobretaxa de +(k−1) de Energia** (a 2ª custa +1, a 3ª +2, a 4ª +3…).

<p class="formula">Separado: golpe A com Téc. X (custo X) + golpe B com Téc. Y (custo Y) = X + Y, em duas ações.<br>Combo: um golpe com X e Y juntos = X + Y + 1, numa ação só.</p>

Combinar é **mais caro em Energia**, mas economiza **Ticks** e concentra os efeitos — mais Margem, um único impacto demolidor em vez de dois mornos. O teto é o seu bolso: a Energia (Centelha × 3 + Virtudes + Vontade) é que diz até onde o combo vai, e é por isso que a Centelha mais alta comba mais fundo. Bandas 4–5 ainda cobram Vontade (+1 e +2), o que torna combos de elite raros e climáticos.

### Posturas sustentadas

Algumas ativas são **guardas que você assume**: paga a Energia **uma vez** e a postura dura a **cena** inteira. Você mantém até **Centelha** posturas ao mesmo tempo; largá-las é de graça. É o lutador que "entra em sua forma" e luta a refrega inteira sob ela.
