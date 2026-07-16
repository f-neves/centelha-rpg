---
ordem: 7
numeral: "VII"
titulo: "Combate"
resumo: "Como uma luta funciona: a linha do tempo, o ataque, o dano, a defesa, o movimento, a vantagem tática e as Técnicas."
---

O combate não corre em turnos rígidos: corre numa **linha do tempo de Ticks** (cada um ≈ **1 segundo**). Cada ação custa um tempo — a sua **Speed** — e, depois de agir, você só volta a jogar quando esses Ticks passarem. Escolher *quando* agir vale tanto quanto *como*.

## Como uma luta acontece

Antes dos detalhes, o esqueleto de uma briga, do começo ao fim:

1. **Role a Iniciativa** (1d6 + Raciocínio + Prontidão) — ela diz quem age primeiro na linha de Ticks.
2. **Na sua vez, escolha uma ação.** Cada ação custa um tempo (a **Speed**); após agir, você só volta quando esses Ticks passarem.
3. **Para acertar, role seu pool de ataque** e compare com a **Defesa** do alvo — um número fixo. Se o total **superar** a Defesa, você acerta (empate erra).
4. **Quanto melhor o acerto, mais forte o golpe:** a cada **6 pontos acima da Defesa**, o dano ganha **+1d6** — isso se chama **Margem**.
5. **O dano, menos a Absorção** (a absorção do alvo), vira ferimento.
6. **Quem chega a 0 de Vida cai.** Ferimentos, morte e sangramento são assunto do próximo capítulo, [Vida, Ferimentos & Cura](/regras/vida-ferimentos-cura).

<div class="callout exemplo"><span class="lbl">Exemplo</span>Kael ataca um bandido de <strong>Defesa 10</strong>. Seu pool de ataque dá <strong>3d6+5</strong>; ele rola e soma <strong>16</strong>. 16 supera 10 → acerta, com diferença de 6 — exatamente <strong>uma Margem</strong>, então o dano ganha <strong>+1d6</strong>. Ele rola o dano da espada (2d6) + a Margem (1d6) + a Força, desconta a Absorção do bandido, e o que sobra abre ferimento.</div>

No osso, é só isso. O resto do capítulo são as camadas que dão profundidade tática: **quando** agir, **como** se mover, **usar a posição** e **desencadear Técnicas**.

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

## Dano e Armadura

<p class="formula">Dano = (Dado da Arma + Margem) + Força − Absorção</p>

O **Dado da Arma** é 1d6 (leve), 2d6 (média) ou 3d6 (pesada). Armas de uma mão somam a **Força**; as de duas mãos, o **dobro da Força** — **exceto as hastes de estocada** (Lança e afins), que ferem por alcance e precisão, não por peso, e somam apenas a **Força simples**. Cada Margem (6 pontos acima da Defesa) acrescenta +1d6.

### Os quatro modos de dano

Todo golpe tem um **modo**, e a maioria das armas pode usar mais de um — você escolhe conforme o alvo:

- **Corte** — gume deslizante (espada, machado). Letal.
- **Projétil** — flecha, virote, dardo lançado. Letal.
- **Perf. Concentrada** — ponta rígida com energia concentrada (estocada, adaga de rondel, bico de picareta). Letal.
- **Impacto** — maça, martelo, malho; também socos e quedas. Em regra **nocauteia** (ver [Vida & Ferimentos](/regras/vida-ferimentos-cura)).

A **Absorção** total de um golpe é **Absorção natural + a absorção da armadura**. A armadura tem **três Absorções** — Impacto, Corte e Perfuração —, e **Projétil e Perf. Concentrada usam a mesma Absorção de Perfuração**:

- **Absorção natural:** **Vigor + Centelha** contra o **Impacto** (o corpo e a fagulha amortecem a pancada); **só a Centelha** contra os letais (Corte, Projétil, Perf.) — a carne nua não para o fio nem a ponta, apenas a dureza sobre-humana da **Centelha** o faz. Um mortal (Centelha 0) tem **0** de Absorção natural contra lâminas: depende inteiramente da armadura.
- **+ armadura:** a placa quase zera o Corte, mal segura o Impacto e tem Perfuração baixa. Empilhar peças vale a **maior Absorção de cada categoria**; ver [Armas & Armaduras](/regras/armas-e-armaduras).

### O gate de Perfuração

Os modos **Projétil** e **Perf. Concentrada** têm um **Nível de Perfuração** (0–5) e enfrentam o **Nível** (Resistência à Perfuração) da armadura:

- Se o Nível de Perfuração da arma for **menor** que o da armadura, o golpe **resvala — dano 0** (nem rola).
- Se for **igual ou maior**, o gate abre: rola o dano e subtrai a **Absorção de Perfuração** (baixa — ao furar, encontra pouca proteção).

**Corte e Impacto não passam pelo gate** — sempre subtraem a absorção direto. É por isso que a placa completa (Nível 3) é à prova de qualquer arma de mão (espada, flecha, lança, besta, picareta param em N0–N2), cedendo só ao Impacto, à perfuração nível 3+ (cerco, magia), Proeza ou feitiçaria. O **Nível nunca soma** ao empilhar armaduras: vale sempre o maior.

### Couraça de Porte

Bichos muito maiores que um homem não são só sacos de vida maiores: a pura massa, a pele grossa, as escamas e o casco viram **armadura de carne**. Cada porte acima do Médio soma uma **Couraça** à Absorção, e os maiores ganham um **Nível de Perfuração natural** (o mesmo gate da placa: flecha e lança comuns resvalam).

A Couraça incide **só em Corte e Perfuração** — o **Impacto a ignora**. Cortar ou furar uma montanha de carne arranha a superfície; já uma pancada concentrada (maça, martelo, malho, um pedregulho) transfere a energia para dentro, do mesmo jeito que o Impacto vence a placa. Contra um titã, **esmague, não corte** — e contra os maiores, nem isso basta sem Centelha.

| Porte | Couraça (Corte/Perf.) | Perfuração natural |
|---|---|---|
| Médio e menores | — | — |
| Grande | +2 | — |
| Enorme | +4 | 1 |
| Imenso | +7 | 2 |
| Colossal | +10 | 3 |

<div class="callout exemplo"><span class="lbl">Exemplo</span>Um <strong>Verme Púrpura</strong> (Imenso) tem Absorção <strong>13</strong> contra lâminas. Um soldado com espada longa (2d6+3, média 10) não abre um arranhão; a flecha (Perf. 1) resvala na Perfuração natural 2. Um herói de montante ainda crava 7, e uma Proeza que rasga ou um martelo no <strong>Impacto</strong> (que ignora a Couraça) é o caminho para feri-lo de verdade. Já o <strong>Tarrasque</strong> (Colossal, Absorção 24, Perf. 3) zomba de qualquer aço mortal: só Centelha, Proeza ou feitiçaria o marcam.</div>

A Couraça **empilha** com armadura (soma na Absorção) e com a Absorção de Proeza; o Nível de Perfuração natural entra no gate como o de uma armadura (vale sempre o **maior**, nunca soma).

### Trocar de modo

Cada arma tem um **modo principal** (sem custo) e, às vezes, **secundários** — alternar para um secundário custa **−2 ao acerto e −2 ao dano** (estocar com uma lâmina de corte é mais difícil e sai mais fraco). Algumas armas, como a **Alabarda**, têm vários modos *principais*: alternam sem penalidade.

## Quase-Acerto

Errar por pouco ainda raspa o alvo. Como o **Quase-Acerto** funciona em detalhe — a Margem do raspão, os valores por classe de arma e de armadura, e os modificadores que o afetam — é o assunto do próximo capítulo, [Quase-Acerto](/regras/quase-acerto).

## Esquivar ou Bloquear

Sua Defesa pode vir de duas fontes, e você usa **a melhor** delas contra cada golpe:

- **Esquiva** — com a habilidade Esquiva, mais a mobilidade do terreno. Some sai da frente.
- **Bloqueio** — com a habilidade da própria arma ou Escudos, mais a **Defesa da Arma** e o escudo. Apara o golpe.

A **Defesa da Arma** (coluna *Defesa* em [Armas & Armaduras](/regras/armas-e-armaduras)) entra no **Bloqueio**: uma espada acrescenta **+1**, uma haste **+2** (o alcance afasta o golpe), e as **armas pesadas de duas mãos −2** — o espadão e o martelo dão muito dano, mas comprometem a guarda e **expõem o lutador entre os golpes**. Quem usa **uma só mão** pode ocupar a outra para defender: um **escudo** (+3 a +4) ou uma **arma de parada na mão inábil** (+1) eleva o Bloqueio. É a troca central da empunhadura — **mais dano e alcance com as duas mãos, ou mais guarda com uma mão livre.**

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

<div class="callout regra"><span class="lbl">Regra opcional</span>O <strong>Fôlego</strong> — o cansaço que limita as rajadas de golpes, o <strong>Esforço</strong> (forçar o golpe por mais dados) e a ação de <strong>Tomar Fôlego</strong> — é um <strong>módulo avançado</strong>, reunido no capítulo <a href="/regras/folego">Fôlego</a>. As mesas que jogam sem ele simplesmente ignoram custo e recuperação de Fôlego; nada mais no Combate depende disso.</div>

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

<div class="callout regra"><span class="lbl">Guarda sob pressão</span>Cada ataque que você <strong>faz ou recebe</strong> reduz sua <strong>Esquiva e Bloqueio em −2</strong>, e o efeito <strong>acumula até a sua próxima ação</strong> — quando você age, a guarda se refaz e o acúmulo zera. <strong>Sem teto:</strong> ninguém desvia de uma dúzia de golpes. Atacar te expõe; ser cercado te expõe muito mais. Um único oponente brilhante resiste a alguns fracos — mas a maré da multidão acaba furando qualquer guarda.</div>

A posição fecha o cerco: quem ataca pelo **flanco ou pelas costas** ganha o **−2 na Defesa** do alvo, porque ele não pode voltar a melhor guarda contra todos ao mesmo tempo. Dois inimigos coordenados — um prendendo a frente, outro contornando — combinam a penalidade de pressão com a de flanco: é assim que o número vira vantagem tática, e não só mais dados.

### Regra de Horda

Quando muitos capangas iguais avançam juntos, não role um por um — trate o bando como **um só esquadrão**. O tamanho vira **Magnitude**, e cada degrau exige cerca do **dobro** de gente:

<div class="table-wrap">

| Membros | 2–3 | 4–7 | 8–15 | 16–31 | 32–63 |
|---|:---:|:---:|:---:|:---:|:---:|
| **Magnitude** | 1 | 2 | 3 | 4 | 5 |

</div>

- **Ataque** — o esquadrão faz **um ataque por inimigo engajado, até Magnitude + 1** (o teto é a frente de combate: só cabe tanta gente em volta). Contra um alvo só, os golpes **concentram numa rolagem**; contra vários, **espalham-se** um por inimigo. Cada ataque rola o pool de um capanga **+ Magnitude d6 no acerto e + Magnitude d6 no dano** (o enxame que conecta cai todo em cima). O esquadrão **não** aplica a penalidade de guarda da Pressão; sua ameaça já é a chuva de dados.
- **Modos** — os ataques podem misturar **Impacto / Corte / Perfuração** e **corpo a corpo ou à distância**. Um esquadrão **híbrido** o bastante — armas variadas — ataca sempre pelo **modo de menor Absorção do alvo**, achando a brecha na guarda.
- **Defesa** — a de um capanga **−2**: multidão amontoada é alvo fácil.
- **Baixas** — o esquadrão tem **PV = nº de membros × o PV-de-horda do capanga** (Comum **5**, Treinado **10**, Elite **15**). Na horda o capanga perde o **piso de durabilidade de 25**, que protege só heróis e NPCs nomeados. O dano que você causa **acumula**; cada vez que o total passa o PV-de-horda de um capanga, **cai um membro** — um golpe pesado derruba vários de uma vez. Conforme caem, a **Magnitude desce em degraus**, até sobrar um (Magnitude 0), que volta a ser um NPC comum. Ataques em **área** batem direto no PV do esquadrão.

Na prática, um lutador resistente abre caminho por ~**20 Comuns**, ~**8 Treinados** ou ~**5 Elites** antes de correr risco real — mas uma maré de **30 ou 40** afoga até ele. É o pilar do sistema: um herói vence vários fracos e, ainda assim, **perde para a multidão**.

<div class="callout exemplo"><span class="lbl">Exemplo</span>Sora encara <strong>20 recrutas</strong> (Comuns). Magnitude <strong>4</strong>: o PV do esquadrão é 20 × 5 = <strong>100</strong>, e o ataque deles é <strong>1d6 + 4d6</strong> no acerto e <strong>+4d6</strong> no dano. No 1º golpe Sora rola o montante e causa 19 de dano: 19 ÷ 5 = <strong>3 baixas</strong> (sobram 4 acumulados). Restam 17 — ainda Magnitude 4. Ela ceifa ~4–5 por rodada; ao chegar a 15 membros a Magnitude cai para 3 e a horda morde menos.</div>

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

### Empilhar Proezas: o que não soma

Proezas dão bônus, e bônus que se somam sem limite quebram o combate. Quatro travas mantêm o número no lugar:

- **Absorção de Proeza** não soma entre passivas: vale a **maior** de cada tipo de dano (Impacto, Corte, Perfuração). Bônus reflexivos ou de cena (como Tensionar) entram por cima só naquele golpe. A Absorção de Proeza soma normalmente com a da **armadura** e com a **natural** (Vigor/Centelha).
- **Defesa reflexiva** de Proeza (Aparar, Reflexos de Vento, Voz Calma, +3) conta para o **teto de ±6** dos modificadores situacionais: não empilha além disso com cobertura, flanco e postura.
- **Ação extra** não acumula: no máximo **uma ação extra por turno**, não importa de quantas fontes (Proeza ou Arte). Os vários "aja de novo" não se somam.
- **Ignorar a Absorção da armadura** (Punho que Parte Pedra, Esmagar) afeta só a parte da **armadura**; a Absorção **natural** do alvo continua valendo.
