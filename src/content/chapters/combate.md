---
ordem: 4
numeral: "IV"
titulo: "Combate"
resumo: "Ticks, iniciativa, ataque, defesa, dano, modificadores situacionais, Técnicas e combos, e pressão numérica."
---

O combate corre numa linha do tempo de **Ticks** (cada um ≈ **1 segundo**), não em turnos rígidos. Cada ação custa um tempo — sua **Speed** — e, depois de agir, você só volta a jogar quando esses Ticks passarem. Escolher *quando* agir vale tanto quanto *como*.

## Iniciativa e a Escala de Speed

No início, cada um rola a **Iniciativa = 1d6 + Raciocínio + Prontidão**. Quem tirar o maior valor começa no **Tick 0**; todos os demais começam no **Tick 1**. A partir daí, a distância pesa: a cada **6 pontos** abaixo da maior iniciativa, o retardatário **começa 1 Tick mais tarde** e **perde 1d6 na primeira ação** (pego no contrapé). A penalidade é ⌊(maior − sua) ÷ 6⌋, em Ticks e em dados. (Empate na maior iniciativa: começa quem tiver o maior Raciocínio; persistindo, decidam no 1d6.)

<div class="callout exemplo"><span class="lbl">Exemplo</span>A maior iniciativa da cena foi <strong>14</strong>. Quem tirou de <strong>9 a 13</strong> (1–5 atrás) começa no Tick 1, sem perda. Quem tirou de <strong>3 a 8</strong> (6–11 atrás) começa no <strong>Tick 2</strong> e <strong>perde 1d6</strong> na primeira ação. Quem tirou <strong>1 ou 2</strong> (12–13 atrás) começa no <strong>Tick 3</strong> e <strong>perde 2d6</strong>. A perda vale só para a <em>primeira</em> ação — depois, todos jogam em pé de igualdade na linha de Ticks.</div>

| Ticks | Tipo de ação | Exemplos |
|:---:|---|---|
| 3 | Muito rápida | correr, saltar, abrir porta, sacar arma |
| 4 | Utilitária | pegar item, interagir com o cenário |
| 5 | Ataque leve | faca, adaga, espada curta, bastão |
| 6 | Ataque médio | espada longa, machado de uma mão, lança |
| 7 | Ataque pesado | martelo de guerra, montante, alabarda |

<p class="muted">Armas leves agem mais vezes e defendem melhor; as pesadas batem como um trovão, mas deixam você exposto entre os golpes. A arma define o seu estilo.</p>

## Deslocamento

O **Deslocamento livre** é a distância que você desliza **de graça durante outra ação** (atacar, conjurar) — em qualquer direção, sem gastar a vez. É o arqueiro que recua e dispara, o duelista que circula enquanto golpeia:

<p class="formula">Deslocamento livre (m) = (Destreza + Corrida) ÷ 2</p>

Para ir além, gaste a vez numa **ação de movimento** — Corrida ou Salto, ambas **Speed 3**. Cada Tick vale ~1 segundo.

### Corrida (Speed 3)

Interrompível a **qualquer Tick** — você decide quando parar. A largada acelera: os **3 primeiros Ticks** correm à **Velocidade de Arranque** (a explosão do disparo); do **4º Tick em diante**, à **Velocidade de Corrida** (o ritmo sustentado). Cada valor é em metros por Tick.

| Fase | Quando | m por Tick |
|---|---|---|
| **Arranque** | Ticks 1–3 | (Força + Corrida) ÷ 2 + Destreza |
| **Corrida** | Tick 4 em diante | Destreza × 1,5 + Corrida |

### Salto (Speed 3)

Um impulso único que, **uma vez iniciado, não pode ser interrompido**. Três alcances, conforme a direção e o impulso:

| Salto | Alcance | Fórmula |
|---|---|---|
| **Vertical** | altura, em cm | (Força × 20) + (Acrobacias × 10) + (Destreza × 4) + 50 por Centelha |
| **Horizontal — parado** | distância, em m | (Força + Acrobacias + Centelha) ÷ 2 |
| **Horizontal — correndo** | distância, em m | Velocidade atual + (Acrobacias ÷ 2) + Centelha |

<p class="muted">No salto correndo, <strong>Velocidade atual</strong> é a sua velocidade no instante do impulso — Arranque se você corre há ≤3 Ticks, Corrida depois (na ficha, supõe-se corrida plena). O <strong>Salto</strong> é a explosão de força do corpo: a Força lança, a Acrobacia controla, a Destreza ajusta — e a Centelha rompe os limites mortais, do pulo humano ao salto lendário.</p>

## Ataque e Defesa

Para atacar: monte o pool de Atributo + Habilidade, some o **Acerto da Arma**, aplique Especialidade, Stunts e Técnicas, e role. Você acerta se o total **superar a Defesa** do alvo (empate erra).

<p class="formula"> Ataque = (Destreza + Habilidade + Especialidade) + Arma + Centelha×2</p>

A Defesa é um valor **fixo** e **passivo**.

<p class="formula">Defesa = (Destreza + Habilidade) × 2 + Especialidade + Centelha×2</p>

Use **Esquiva** (com a habilidade Esquiva, mais a mobilidade do terreno) ou **Bloqueio** (com a perícia da própria arma ou Escudos, mais a Defesa da Arma e o escudo). Escolha a melhor — mas nem tudo se bloqueia.

<p class="muted">A <strong>Centelha</strong> soma <strong>+2 por ponto</strong> dos dois lados — ao ataque e às três defesas (Esquiva, Bloqueio e Mental). Entre Centelhas iguais ela se cancela, e o duelo joga igual do mortal ao semideus; contra quem tem menos Centelha, a diferença vira vantagem líquida no acerto e na guarda.</p>

<div class="callout"><span class="lbl">Quase Acerto</span>Errar por pouco — dentro de uma <strong>Margem</strong> igual ao <strong>Bônus de Quase-Acerto da arma + sua Centelha</strong> — ainda raspa o alvo. Armas leves e rápidas têm Bônus QA alto (raspam muito, mas de leve); armas pesadas têm Bônus QA baixo (raspam raro, mas fundo). O raspão causa o <strong>Dano de Quase-Acerto da arma</strong> (leve 1 · média 2 · pesada 3), <strong>sem o Soak normal</strong>, mas reduzido pela <strong>Redução de Quase-Acerto da armadura</strong> (leve 1 · média 2 · pesada 3, mínimo 0). A armadura <em>não</em> estreita a Margem — você nica o alvo blindado igual, mas a placa absorve o arranhão. Quanto mais Centelha, mais largo o raspão.</div>

## Modificadores situacionais

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

## Dano e Armadura

<p class="formula">Dano = (Dado da Arma + Margem) + Força − Absorção</p>

O **Dado da Arma** é 1d6 (leve), 2d6 (média) ou 3d6 (pesada). Armas de uma mão somam a **Força**; as de duas mãos, o **dobro da Força**. Cada Margem (6 pontos acima da Defesa) acrescenta +1d6.

O dano vem em três sabores: **Impacto** (contundente), **Corte** e **Perfuração** (ambos letais). O **Soak** absorve o golpe — naturalmente igual ao Vigor contra Impacto e à metade do Vigor contra dano letal; armaduras somam mais. Armas perfurantes têm **Penetração**: se ela não vencer a Proteção da armadura, o dano é anulado. Já as armas com a tag **Ruptura** ignoram o Soak de impacto da armadura, amassando-a.

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

## Pressão: muitos contra um

Você pode dividir sua ação em vários golpes, ao custo de precisão; e cada inimigo extra desgasta sua guarda.

| Nº de ataques | Penalidade |
|---|---|
| 2 ataques | 1º −1d6, 2º −2d6 |
| 3 ataques | 1º −2d6, 2º −3d6, 3º −4d6 |

Cada ataque extra também reduz sua Esquiva (−1) e seu Bloqueio (−2) até a próxima ação. Um único oponente brilhante resiste a muitos fracos — mas a maré da multidão acaba furando qualquer guarda.

A posição fecha o cerco: quem ataca pelo **flanco ou pelas costas** ganha o **−2 na Defesa** do alvo (ver *Modificadores situacionais*), porque ele não pode voltar a melhor guarda contra todos ao mesmo tempo. Dois inimigos coordenados — um prendendo a frente, outro contornando — combinam a penalidade de pressão com a de flanco: é assim que o número vira vantagem tática, e não só mais dados.
