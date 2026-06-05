---
ordem: 4
numeral: "IV"
titulo: "Combate"
resumo: "Ticks, iniciativa, ataque, defesa, dano e pressão numérica."
---

O combate corre numa linha do tempo de **Ticks**, não em turnos rígidos. Cada ação custa um tempo — sua **Speed** — e, depois de agir, você só volta a jogar quando esses Ticks passarem. Escolher *quando* agir vale tanto quanto *como*.

## Iniciativa e a Escala de Speed

No início, role a **Iniciativa = 1d6 + Raciocínio + Prontidão**. Quem tira o maior valor age primeiro; a diferença para os demais vira a distância, em Ticks, até a vez de cada um.

| Ticks | Tipo de ação | Exemplos |
|:---:|---|---|
| 3 | Muito rápida | correr, abrir porta, sacar arma |
| 4 | Utilitária | pegar item, interagir com o cenário |
| 5 | Ataque leve | faca, adaga, espada curta, bastão |
| 6 | Ataque médio | espada longa, machado de uma mão, lança |
| 7 | Ataque pesado | martelo de guerra, montante, alabarda |

<p class="muted">Armas leves agem mais vezes e defendem melhor; as pesadas batem como um trovão, mas deixam você exposto entre os golpes. A arma define o seu estilo.</p>

## Ataque e Defesa

Para atacar: monte o pool de Atributo + Habilidade, some o **Acerto da Arma**, aplique Especialidade, Stunts e Técnicas, e role. Você acerta se o total **superar a Defesa** do alvo (empate erra). A Defesa é um valor **fixo e passivo** — o atacante é quem rola.

<p class="formula">Defesa = (Destreza + Habilidade) × 2 − ⌊soma ÷ 4⌋ + Especialidade + ⌈Centelha ÷ 2⌉ + mods</p>

Use **Esquiva** (com a habilidade Esquiva, mais a mobilidade do terreno) ou **Bloqueio** (com a perícia da própria arma ou Escudos, mais a Defesa da Arma e o escudo). Escolha a melhor — mas nem tudo se bloqueia.

<div class="callout"><span class="lbl">Quase Acerto</span>Errar por pouco — dentro de uma <strong>Faixa</strong> igual ao <strong>peso da arma + sua Centelha</strong> (peso: leve 1, média 2, pesada 3) — ainda raspa o alvo, causando dano fixo igual ao peso, sem redução por Soak (desde que a arma consiga furar a armadura). Um mortal raspa por 1–3; uma lâmina mítica quase nunca erra de fato — mas o raspão continua sendo só o peso, um corte que sangra mais do que mata.</div>

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

<p class="formula">Dano = (Dado da Arma + Força + Margem) − Soak</p>

O **Dado da Arma** é 1d6 (leve), 2d6 (média) ou 3d6 (pesada). Armas de uma mão somam metade da Força; as de duas mãos, a Força inteira. Cada Margem (6 pontos acima da Defesa) acrescenta +1d6.

O dano vem em três sabores: **Impacto** (contundente), **Corte** e **Perfuração** (ambos letais). O **Soak** absorve o golpe — naturalmente igual ao Vigor contra Impacto e à metade do Vigor contra dano letal; armaduras somam mais. Armas perfurantes têm **Penetração**: se ela não vencer a Proteção da armadura, o dano é anulado. Já as armas com a tag **Ruptura** ignoram o Soak de impacto da armadura, amassando-a.

## Pressão: muitos contra um

Você pode dividir sua ação em vários golpes, ao custo de precisão; e cada inimigo extra desgasta sua guarda.

| Nº de ataques | Penalidade |
|---|---|
| 2 ataques | 1º −1d6, 2º −2d6 |
| 3 ataques | 1º −2d6, 2º −3d6, 3º −4d6 |

Cada ataque extra também reduz sua Esquiva (−1) e seu Bloqueio (−2) até a próxima ação. Um único oponente brilhante resiste a muitos fracos — mas a maré da multidão acaba furando qualquer guarda.

A posição fecha o cerco: quem ataca pelo **flanco ou pelas costas** ganha o **−2 na Defesa** do alvo (ver *Modificadores situacionais*), porque ele não pode voltar a melhor guarda contra todos ao mesmo tempo. Dois inimigos coordenados — um prendendo a frente, outro contornando — combinam a penalidade de pressão com a de flanco: é assim que o número vira vantagem tática, e não só mais dados.
