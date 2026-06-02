# Caminhos — O Toolbox (v0.9 / proposta)

> Companion do documento principal (§12). Inspirações: **Disciplinas** (Vampiro), **Boons/Epic Attributes** (Scion), **Paths** (Sorcerer) e **Charms / árvores** (Exalted 2e). 🔧 = proposta ajustável.

---

## A. Estrutura

Cada um dos **9 atributos** ancora **vários subcaminhos** (≥5), e cada subcaminho é uma **árvore de Técnicas** (não uma linha reta), à la árvore de Charms / Disciplina.

- **Trilha → Atributo → Subcaminho → Técnicas.**
  Corpo (Força/Destreza/Vigor) · Voz (Carisma/Manipulação/Aparência) · Mente (Percepção/Inteligência/Raciocínio).
- Cada subcaminho tem **no mínimo 5 Técnicas** (ao menos **1 por banda de Centelha**), **sem teto** — pode ter muitas mais, ramificando livremente.
- Conectam-se por **pré-requisitos** que **ramificam e se cruzam**: uma Técnica pode exigir 1+ Técnicas anteriores de **qualquer** subcaminho, atributo ou trilha (**cruzamento livre** — exige mais, porém permite técnicas mais personalizadas e combos).

### A.1 Requisitos de uma Técnica
- **Banda de Centelha** (1–5): destrava o "andar" da árvore (nível L ⇒ Centelha ≥ ⌈L/3⌉).
- **Atributo/Perícia âncora** ≥ X (cresce com a profundidade).
- **Pré-requisito(s) de Técnica:** uma ou mais Técnicas anteriores (cruzamento livre entre atributos).

### A.2 Custo
- **Ativação = a Centelha exigida** (= banda) em **Energia**. Passivas = 0. Técnicas fortes podem somar **+1 Vontade**.
- **Energia = (Centelha × 3) + soma das 4 Virtudes + Força de Vontade** (~16 → ~45).

### A.3 Template
```
Nome  (banda Centelha N · âncora Perícia ≥ X · pré-req: <Técnicas>)
Tipo: Passiva | Ativa (C Energia[, +1 Vontade]) | Reflexiva
Efeito: ...
```

### A.4 Resolução
- **Corpo:** modifica suas ações/atributos, ou rola Atributo+Perícia vs Defesa/Dificuldade.
- **Voz/Mente ofensivas:** rolam Atributo+Perícia vs **Defesa Mental** do alvo (§5 do doc base); pedidos contra a natureza permitem gastar Vontade para resistir.
- **Arcano** 🚧 — trilha à parte (pré-req Ocultismo, gasta Mana, mais versátil). Doc próprio.

---

## B. Catálogo de Subcaminhos (≥5 por atributo)

> Conjunto inicial. Cada um é uma árvore temática a ser detalhada. ✦ = árvore-modelo desenhada na Seção C.

### CORPO

**FORÇA** — poder bruto *(eco: Potence / Epic Strength)*
| Subcaminho | Linha de ação |
|---|---|
| **Punho de Ferro** ✦ | golpes esmagadores, dano bruto, quebrar guarda |
| **Atlas** ✦ | erguer, arremessar e arrancar pesos descomunais |
| **Quebra-Muralhas** ✦ | destruir objetos e estruturas, demolir defesas |
| **Agarrão do Urso** ✦ | agarrar, imobilizar, esmagar, arremessar inimigos |
| **Sangue Fervente** ✦ | fúria: converter dor e ira em força |

**DESTREZA** — velocidade e precisão *(eco: Celerity / Epic Dexterity)*
| Subcaminho | Linha de ação |
|---|---|
| **Vento** ✦ | velocidade, dashes, saque rápido → voo |
| **Gato** ✦ | acrobacia, equilíbrio, quedas, escalada |
| **Mão Veloz** ✦ | prestidigitação, desarmar, fintar, controle fino |
| **Olho de Águia** ✦ | pontaria e disparos impossíveis |
| **Dança da Lâmina** ✦ | esgrima fluida, aparar, ripostes |
| **Sombra** ✦ | furtividade e infiltração |

**VIGOR** — resiliência *(eco: Fortitude / Epic Stamina)*
| Subcaminho | Linha de ação |
|---|---|
| **Pele de Pedra** ✦ | soak, dureza, reduzir dano |
| **Coração Incansável** ✦ | fôlego infinito, ignorar fadiga, marchar dias |
| **Sangue Imune** ✦ | resistir venenos, doenças, ambientes extremos |
| **Carne Teimosa** ✦ | ignorar penalidades de ferimento, recusar-se a cair |
| **Cerne Vital** ✦ | regeneração, fechar feridas (tiers altos) |

### VOZ

**CARISMA** — inspirar e cativar *(eco: Presence / Epic Charisma)*
| Subcaminho | Linha de ação |
|---|---|
| **Voz de Mel** ✦ | charme, persuasão, acalmar |
| **Lenda Viva** ✦ | temor reverente, presença heroica, mover massas |
| **Estandarte** ✦ | liderança, coordenar aliados, moral, rally |
| **Musa** ✦ | performance, encantar plateias, mover emoções |
| **Brasa** ✦ | inflamar paixões, incitar, discursos que movem |

**MANIPULAÇÃO** — torcer vontades *(eco: Dominate / Epic Manipulation)*
| Subcaminho | Linha de ação |
|---|---|
| **Comando** ✦ | ordens, dominação, coerção |
| **Teia** ✦ | intriga, plantar ideias, virar pessoas, chantagem |
| **Serpente das Palavras** ✦ | barganha, torcer sentidos, lábia ardilosa |
| **Sussurro** ✦ | semear medo, dúvida, paranoia |
| **Marionete** ✦ | sugestão profunda, reescrever desejos (tiers altos) |
| **Máscara** ✦ | disfarce comportamental, fingir emoções, mentir |

**APARÊNCIA** — presença e face *(eco: Presence/Awe / Epic Appearance)*
| Subcaminho | Linha de ação |
|---|---|
| **Beleza Cativante** ✦ | atrair, seduzir, desarmar pela presença |
| **Semblante** ✦ | impor respeito ou medo pela mera presença (awe) |
| **Camaleão** ✦ | alterar a própria aparência, disfarce físico |
| **Aura** ✦ | irradiar emoção à volta (terror, calma, êxtase) |
| **Máscara Impassível** ✦ | esconder emoções e intenções, blefe perfeito |

### MENTE

**PERCEPÇÃO** — o que você nota *(eco: Auspex / Epic Perception)*
| Subcaminho | Linha de ação |
|---|---|
| **Olho Aguçado** ✦ | sentidos, ver no escuro, raio-x |
| **Sentinela** ✦ | alerta, detectar perigo e emboscadas |
| **Caçador** ✦ | rastrear, farejar, seguir trilhas |
| **Olho da Verdade** ✦ | detectar mentiras, ilusões, disfarces |
| **Comunhão** ✦ | perceber o sobrenatural, auras, espíritos |

**INTELIGÊNCIA** — saber e criar *(eco: Lore/Craft / Epic Intelligence)*
| Subcaminho | Linha de ação |
|---|---|
| **Mente Afiada** ✦ | memória perfeita, cálculo, dedução |
| **Erudito** ✦ | saber enciclopédico, idiomas, fatos |
| **Artesão** ✦ | crafts sobre-humanos, obras-primas |
| **Estrategista** ✦ | tática, ler batalhas, prever, planos |
| **Investigador** ✦ | reconstituir cenas, conectar pistas |

**RACIOCÍNIO** — agilidade mental *(eco: Epic Wits / Awareness)*
| Subcaminho | Linha de ação |
|---|---|
| **Reflexo Mental** ✦ | iniciativa, reagir e pensar sob pressão |
| **Improviso** ✦ | soluções instantâneas, usar o ambiente |
| **Presságio** ✦ | intuição, senso de perigo, premonição |
| **Leitura Fria** ✦ | deduzir pessoas, prever ações, ler tells |
| **Mente Serena** ✦ | foco, transe, blindagem mental, resistir manipulação |

*(45 subcaminhos. Há espaço para mais em qualquer atributo.)*

---

## C. ✦ ÁRVORE COMPLETA: CAMINHO DO VENTO
*Atributo: Destreza · âncora: Atletismo (e Esquiva). A graça que vira velocidade que vira voo.*

```
BANDA 1 (Centelha 1 — Mortal+)
  [Passo Veloz] ─ raiz, passiva
       ├──→ [Salto do Grilo]          (ramo MOBILIDADE)
       └──→ [Reflexos de Vento]       (ramo EVASÃO)

BANDA 2 (Centelha 2 — Herói)
  [Salto do Grilo] ──→ [Corrida Vertical]
  [Salto do Grilo] ──→ [Passos sobre Folhas]
  [Reflexos de Vento] ──→ [Esquiva Impossível]
  [Salto do Grilo] + (Força)[Punho de Ferro: Golpe Pesado] ──→ [Encontrão Relâmpago]   ⟵ CRUZAMENTO

BANDA 3 (Centelha 3 — Semideus)
  [Corrida Vertical] ──→ [Mil Passos]
  [Corrida Vertical] + [Esquiva Impossível] ──→ [Borrão]                                ⟵ MÚLTIPLOS PRÉ-REQS

BANDA 4 (Centelha 4 — Semideus)
  [Borrão] ──→ [Ataque Relâmpago]
  [Mil Passos] ──→ [Passo do Trovão]

BANDA 5 (Centelha 5 — Quase-deus)
  [Borrão] + [Mil Passos] ──→ [Cavalgar o Vento]
  [Ataque Relâmpago] + [Cavalgar o Vento] ──→ [Velocidade Divina]
```

### Banda 1 — Mortal+
**Passo Veloz** (Cent 1 · Atletismo 1 · raiz) — *Passiva.*
O 1º deslocamento da cena, ou sacar/empunhar uma arma, custa **−2 Ticks** (mín. 1).

**Salto do Grilo** (Cent 1 · Atletismo 2 · pré: Passo Veloz) — *Ativa (1 En).*
Triplica distância/altura de um salto; ignora terreno difícil; aterrissa de pé.

**Reflexos de Vento** (Cent 1 · Destreza 2 · pré: Passo Veloz) — *Reflexiva (1 En).*
Após ver um ataque que te visa, **+3 na Defesa** contra ele.

### Banda 2 — Herói
**Corrida Vertical** (Cent 2 · Atletismo 3 · pré: Salto do Grilo) — *Ativa (2 En).*
Enquanto se mover, corre por paredes, tetos e sobre a água por um turno.

**Passos sobre Folhas** (Cent 2 · Atletismo 3 · pré: Salto do Grilo) — *Passiva.*
Move-se em silêncio e sem deixar rastro; superfícies frágeis (gelo fino, galhos) o suportam.

**Esquiva Impossível** (Cent 2 · Esquiva 3 · pré: Reflexos de Vento) — *Reflexiva (2 En).*
**Anula por completo** 1 ataque que você percebe (1×/rodada).

**Encontrão Relâmpago** (Cent 2 · Atletismo 3 · pré: Salto do Grilo **+** [Força] Punho de Ferro→Golpe Pesado) — *Ativa (2 En).* ⟵ *cruzamento de atributos*
Investida que cruza a distância e **derruba** o alvo (Força+Atletismo vs Defesa; recuo + prono).

### Banda 3 — Semideus
**Mil Passos** (Cent 3 · Atletismo 4 · pré: Corrida Vertical) — *Ativa (3 En).*
Numa ação, percorre distâncias enormes; supera cavalos a galope e flechas em velocidade de viagem.

**Borrão** (Cent 3 · Destreza 4 · pré: Corrida Vertical **+** Esquiva Impossível) — *Ativa, dura a cena (3 En).* ⟵ *múltiplos pré-reqs*
Vira um borrão: **−2d6** a disparos contra você; pode cruzar um campo de batalha num único Tick.

### Banda 4 — Semideus
**Ataque Relâmpago** (Cent 4 · Destreza 5 · pré: Borrão) — *Reflexiva (4 En).*
1×/turno, faça um **ataque extra** a custo de Ticks reduzido — golpe antes que percebam.

**Passo do Trovão** (Cent 4 · Atletismo 5 · pré: Mil Passos) — *Ativa (4 En).*
Move-se em linha reta como um piscar, **atravessando** obstáculos e oponentes no caminho.

### Banda 5 — Quase-deus
**Cavalgar o Vento** (Cent 5 · Atletismo 5 · pré: Borrão **+** Mil Passos) — *Ativa, cena (5 En).*
Você **voa**, ágil como uma andorinha.

**Velocidade Divina** (Cent 5 · Destreza 5 · pré: Ataque Relâmpago **+** Cavalgar o Vento) — *Ativa (5 En, +1 Vontade).*
O tempo parece congelar: **aja uma vez extra** na linha de Ticks neste intervalo.

> 13 Técnicas, 5 bandas, 2 ramos que se fundem, 1 cruzamento com Força. Os subcaminhos **Voz de Mel** e **Olho Aguçado** (esboçados na v0.1) estão detalhados abaixo neste formato.

---

## ✦ CAMINHO DO PUNHO DE FERRO
*Atributo: Força · âncora: Briga / Armas de Impacto. O poder que esmaga guardas, ossos e muralhas. (Resolução: dano/combate.)*

```
BANDA 1  Golpe Pesado ─┬─ Quebrar Guarda
                       └─ Mão de Ferro
BANDA 2  Soco Trovejante (←Golpe Pesado) · Esmagar (←Quebrar Guarda)
         Investida Devastadora (←Soco Trovejante + (Destreza)Vento:Salto do Grilo)   ⟵ CRUZAMENTO
BANDA 3  Golpe do Titã (←Soco Trovejante) · Punho que Parte Pedra (←Esmagar)
BANDA 4  Quebra-Montanhas (←Punho que Parte Pedra) · Onda de Choque (←Golpe do Titã + Punho que Parte Pedra)
BANDA 5  Punho do Cataclismo (←Onda de Choque + Quebra-Montanhas)
```

**Banda 1 — Mortal+**
- **Golpe Pesado** (Cent 1 · Briga/Impacto 1 · raiz) — *Passiva.* Seus ataques de Força em corpo-a-corpo somam **+2 ao dano**.
- **Quebrar Guarda** (Cent 1 · Impacto 2 · pré: Golpe Pesado) — *Ativa (1 En).* Se acertar, **−2 na Defesa** do alvo até a próxima ação dele.
- **Mão de Ferro** (Cent 1 · Briga 2 · pré: Golpe Pesado) — *Passiva.* Golpes desarmados contam como arma (sem penalidade vs armados) e podem causar dano **Letal** à vontade.

**Banda 2 — Herói**
- **Soco Trovejante** (Cent 2 · Impacto 3 · pré: Golpe Pesado) — *Ativa (2 En).* Arremessa o alvo (knockback) e o **atordoa** (perde Ticks) se ele falhar num teste de Vigor.
- **Esmagar** (Cent 2 · Força 3 · pré: Quebrar Guarda) — *Ativa (2 En).* O golpe ganha a tag **Crush** (ignora o Soak de impacto da armadura).
- **Investida Devastadora** (Cent 2 · Atletismo 3 · pré: Soco Trovejante **+** [Destreza] Vento→Salto do Grilo) — *Ativa (2 En).* ⟵ *cruzamento.* Avança e desfere um golpe que derruba e empurra; some a distância percorrida ao impacto.

**Banda 3 — Semideus**
- **Golpe do Titã** (Cent 3 · Força 4 · pré: Soco Trovejante) — *Ativa (3 En).* **+3d6** de dano num único golpe colossal.
- **Punho que Parte Pedra** (Cent 3 · Força 4 · pré: Esmagar) — *Passiva.* Suas mãos quebram pedra e metal; ataques ignoram armadura mundana.

**Banda 4 — Semideus**
- **Quebra-Montanhas** (Cent 4 · Força 5 · pré: Punho que Parte Pedra) — *Ativa (4 En).* Destrói estruturas, portões e muralhas com um golpe.
- **Onda de Choque** (Cent 4 · Força 5 · pré: Golpe do Titã **+** Punho que Parte Pedra) — *Ativa (4 En).* O soco projeta uma onda que atinge todos numa linha/área à frente.

**Banda 5 — Quase-deus**
- **Punho do Cataclismo** (Cent 5 · Força 5 · pré: Onda de Choque **+** Quebra-Montanhas) — *Ativa (5 En, +1 Vontade).* Racha o chão num raio enorme; devasta a área e remodela o terreno.

---

## ✦ CAMINHO DO COMANDO
*Atributo: Manipulação · âncora: Intimidação / Oratória. A palavra que dobra a vontade alheia. (Resolução: vs **Defesa Mental**; ordens contra a natureza do alvo permitem gastar Vontade para resistir.)*

```
BANDA 1  Tom de Autoridade ─┬─ Ordem Curta
                            └─ Encarar
BANDA 2  Voz de Comando (←Ordem Curta) · Submissão (←Encarar)
         Comando Inspirador (←Voz de Comando + (Carisma)Lenda Viva:raiz)   ⟵ CRUZAMENTO
BANDA 3  Comando Irresistível (←Voz de Comando) · Aterrorizar (←Submissão)
BANDA 4  Dominação (←Comando Irresistível) · Quebrar o Espírito (←Aterrorizar + Comando Irresistível)
BANDA 5  Palavra de Lei (←Dominação)
```

**Banda 1 — Mortal+**
- **Tom de Autoridade** (Cent 1 · Intimidação 1 · raiz) — *Passiva.* Ao dar ordens ou intimidar, a **Defesa Mental do alvo é −2**; as pessoas instintivamente o tratam como alguém a obedecer.
- **Ordem Curta** (Cent 1 · Intimidação 2 · pré: Tom de Autoridade) — *Ativa (1 En).* Manip+Intimidação vs Def. Mental: o alvo obedece uma ordem simples e não-autodestrutiva por uma ação ("pare", "largue", "ajoelhe").
- **Encarar** (Cent 1 · Intimidação 2 · pré: Tom de Autoridade) — *Ativa (1 En).* Um olhar que faz um alvo de vontade fraca hesitar, recuar ou congelar por um instante.

**Banda 2 — Herói**
- **Voz de Comando** (Cent 2 · Oratória 3 · pré: Ordem Curta) — *Ativa (2 En).* Comanda um pequeno grupo de uma vez; a ordem dura a cena se não contrariar a natureza dos alvos.
- **Submissão** (Cent 2 · Intimidação 3 · pré: Encarar) — *Ativa (2 En).* Num confronto, quebra a coragem do alvo: ele se encolhe, foge ou se rende (vontade forte gasta Vontade para resistir).
- **Comando Inspirador** (Cent 2 · Oratória 3 · pré: Voz de Comando **+** [Carisma] Lenda Viva→raiz) — *Ativa (2 En).* ⟵ *cruzamento.* Ordens que também encorajam: aliados obedecem de bom grado e ganham **+1d6** na ação ordenada.

**Banda 3 — Semideus**
- **Comando Irresistível** (Cent 3 · Intimidação 4 · pré: Voz de Comando) — *Ativa (3 En, +1 Vontade).* Uma ordem que o alvo deve gastar **Vontade a cada turno** para resistir; pode compelir atos perigosos (não diretamente suicidas).
- **Aterrorizar** (Cent 3 · Intimidação 4 · pré: Submissão) — *Ativa (3 En).* Instila terror sobrenatural; um grupo inteiro foge ou paralisa.

**Banda 4 — Semideus**
- **Dominação** (Cent 4 · Manipulação 5 · pré: Comando Irresistível) — *Ativa (4 En, +1 Vontade).* Implanta uma ordem permanente que dura um dia; o alvo racionaliza obedecer.
- **Quebrar o Espírito** (Cent 4 · Intimidação 5 · pré: Aterrorizar **+** Comando Irresistível) — *Ativa (4 En, +1 Vontade).* Estilhaça a vontade do alvo, deixando-o quebrado e dócil por um tempo.

**Banda 5 — Quase-deus**
- **Palavra de Lei** (Cent 5 · Manipulação 5 · pré: Dominação) — *Ativa (5 En, +2 Vontade).* Sua ordem falada torna-se quase absoluta; multidões e exércitos obedecem um decreto divino. Resistir custa vários pontos de Vontade.

---

## ✦ CAMINHO DO PRESSÁGIO
*Atributo: Raciocínio · âncora: Prontidão / Ocultismo. A intuição que sente o perigo e vislumbra o que vem. (Resolução: antecipação, defesa, informação.)*

```
BANDA 1  Pressentimento ─┬─ Instinto de Sobrevivência
                         └─ Faro para Mentiras
BANDA 2  Reflexos Premonitórios (←Instinto) · Pressentir o Golpe (←Instinto) · Ler o Momento (←Faro)
BANDA 3  Vislumbre (←Ler o Momento) · Esquiva Profética (←Pressentir o Golpe + (Destreza)Vento:Reflexos)   ⟵ CRUZAMENTO
BANDA 4  Caminho do Destino (←Vislumbre) · Ler o Fio (←Vislumbre)
BANDA 5  Olho do Oráculo (←Caminho do Destino + Ler o Fio)
```

**Banda 1 — Mortal+**
- **Pressentimento** (Cent 1 · Prontidão 1 · raiz) — *Passiva.* Você sente um arrepio de aviso antes de perigo iminente ou emboscada (o Mestre lhe dá um pressentimento vago).
- **Instinto de Sobrevivência** (Cent 1 · Prontidão 2 · pré: Pressentimento) — *Reflexiva (1 En).* Mesmo pego de surpresa, você age normalmente (anula a surpresa).
- **Faro para Mentiras** (Cent 1 · Raciocínio 2 · pré: Pressentimento) — *Ativa (1 En).* Sente quando algo está "errado" — uma mentira, uma armadilha, uma traição — mesmo sem prova.

**Banda 2 — Herói**
- **Reflexos Premonitórios** (Cent 2 · Prontidão 3 · pré: Instinto de Sobrevivência) — *Passiva.* **+2 na Iniciativa**; 1×/cena, refaça uma rolagem de Defesa.
- **Pressentir o Golpe** (Cent 2 · Prontidão 3 · pré: Instinto de Sobrevivência) — *Reflexiva (2 En).* Defende-se normalmente contra um ataque que não poderia ver (pelas costas, oculto).
- **Ler o Momento** (Cent 2 · Raciocínio 3 · pré: Faro para Mentiras) — *Ativa (2 En).* Antes de agir, vislumbra a consequência imediata provável ("se eu fizer X, o que acontece?").

**Banda 3 — Semideus**
- **Vislumbre** (Cent 3 · Ocultismo 4 · pré: Ler o Momento) — *Ativa (3 En).* Um lampejo de um futuro próximo possível (próximos minutos); o Mestre dá uma premonição útil.
- **Esquiva Profética** (Cent 3 · Esquiva 4 · pré: Pressentir o Golpe **+** [Destreza] Vento→Reflexos de Vento) — *Reflexiva (3 En).* ⟵ *cruzamento.* Você se esquiva como quem já sabia: **anula** um ataque, agindo pela previsão.

**Banda 4 — Semideus**
- **Caminho do Destino** (Cent 4 · Ocultismo 5 · pré: Vislumbre) — *Ativa (4 En, +1 Vontade).* 1×/cena, **refaça qualquer rolagem** (sua ou que o afete), declarando "eu previ isto".
- **Ler o Fio** (Cent 4 · Ocultismo 5 · pré: Vislumbre) — *Ativa (4 En).* Percebe os "fios" do destino: intenções e ações prováveis de uma pessoa, ou os eventos que se aproximam de um lugar.

**Banda 5 — Quase-deus**
- **Olho do Oráculo** (Cent 5 · Ocultismo 5 · pré: Caminho do Destino **+** Ler o Fio) — *Ativa (5 En, +2 Vontade).* Verdadeira precognição: faça ao Mestre uma pergunta significativa sobre o futuro e receba uma resposta enigmática, porém verdadeira — ou reescreva um resultado uma vez.

---

## ✦ CAMINHO DA PELE DE PEDRA
*Atributo: Vigor · âncora: Resistência — a carne que vira pedra que vira lenda. (Resolução: defesa/durabilidade.)*

```
BANDA 1  Pele Curtida ─┬─ Aguentar o Tranco
                       └─ Tensionar
BANDA 2  Pele de Pedra (←Pele Curtida) · Inquebrantável (←Aguentar o Tranco)
BANDA 3  Carne de Granito (←Pele de Pedra)
BANDA 4  Fortaleza Viva (←Carne de Granito)
BANDA 5  Pele Adamantina (←Fortaleza Viva)
```

**Banda 1 — Mortal+**
- **Pele Curtida** (Cent 1 · Resistência 1 · raiz) — *Passiva.* +1 de Soak contra Impacto.
- **Aguentar o Tranco** (Cent 1 · Resistência 2 · pré: Pele Curtida) — *Passiva.* Ignora a penalidade do estado Machucado (−1).
- **Tensionar** (Cent 1 · Vigor 2 · pré: Pele Curtida) — *Reflexiva (1 En).* Ao ser atingido, +2 de Soak contra aquele golpe.

**Banda 2 — Herói**
- **Pele de Pedra** (Cent 2 · Resistência 3 · pré: Pele Curtida) — *Ativa, dura a cena (2 En).* +2 de Soak (todos os tipos) e reduz as penalidades de ferimento em 1.
- **Inquebrantável** (Cent 2 · Vigor 3 · pré: Aguentar o Tranco) — *Passiva.* Dano de Impacto nunca te mata, só nocauteia; +1 ao limiar de morte.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Carne de Granito** (Cent 3 · Resistência 4 · pré: Pele de Pedra) — *Ativa (3 En).* A pele apara golpes mundanos que não a penetram; imune a cortes leves.
- **Fortaleza Viva** (Cent 4 · Resistência 5 · pré: Carne de Granito) — *Ativa (4 En, +1 Vontade).* Imune a dano não-mágico por um turno.
- **Pele Adamantina** (Cent 5 · Vigor 5 · pré: Fortaleza Viva) — *Ativa, cena (5 En, +2 Vontade).* Quase indestrutível: reduz drasticamente todo dano e ignora ambientes letais.

---

## ✦ CAMINHO DO OLHO DE ÁGUIA
*Atributo: Destreza · âncora: Armas à Distância — a flecha que nunca erra. (Resolução: ataque à distância.)*

```
BANDA 1  Mira Firme ─┬─ Tiro Rápido
                     └─ Olho de Alcance
BANDA 2  Tiro Perfurante (←Mira Firme) · Disparo Múltiplo (←Tiro Rápido)
BANDA 3  Tiro Impossível (←Olho de Alcance + Tiro Perfurante)
BANDA 4  Flecha que Persegue (←Tiro Impossível)
BANDA 5  Chuva de Mil Flechas (←Disparo Múltiplo + Tiro Impossível)
```

**Banda 1 — Mortal+**
- **Mira Firme** (Cent 1 · Armas à Distância 1 · raiz) — *Passiva.* Gastando uma ação para mirar, +2 ao ataque à distância.
- **Tiro Rápido** (Cent 1 · Armas à Distância 2 · pré: Mira Firme) — *Ativa (1 En).* Saca e dispara num só gesto (reduz os Ticks do disparo).
- **Olho de Alcance** (Cent 1 · Percepção 2 · pré: Mira Firme) — *Passiva.* Dobra o alcance efetivo sem penalidade.

**Banda 2 — Herói**
- **Tiro Perfurante** (Cent 2 · Armas à Distância 3 · pré: Mira Firme) — *Ativa (2 En).* +1 de Penetração e +1d6 de dano num disparo cuidadoso.
- **Disparo Múltiplo** (Cent 2 · Destreza 3 · pré: Tiro Rápido) — *Ativa (2 En).* Dispara em 2 alvos próximos com penalidade reduzida.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Tiro Impossível** (Cent 3 · Armas à Distância 4 · pré: Olho de Alcance **+** Tiro Perfurante) — *Ativa (3 En).* Acerta a distâncias extremas, contorna cobertura parcial e mira pontos vitais (ignora parte da Defesa).
- **Flecha que Persegue** (Cent 4 · Armas à Distância 5 · pré: Tiro Impossível) — *Ativa (4 En, +1 Vontade).* O disparo curva e persegue o alvo, ignorando cobertura.
- **Chuva de Mil Flechas** (Cent 5 · Destreza 5 · pré: Disparo Múltiplo **+** Tiro Impossível) — *Ativa (5 En, +2 Vontade).* Um disparo vira uma saraivada que cobre uma área inteira.

---

## ✦ CAMINHO DA VOZ DE MEL
*Atributo: Carisma · âncora: Lábia — palavras que abrem portas e corações. (Resolução: vs Defesa Mental; o charme não força atos contra a natureza sem gasto de Vontade do alvo.)*

```
BANDA 1  Primeira Impressão ─┬─ Palavra Calmante
                             └─ Charme
BANDA 2  Carisma Magnético (←Charme) · Desarmar (←Palavra Calmante)
BANDA 3  Encantamento (←Carisma Magnético)
BANDA 4  Coração nas Mãos (←Encantamento)
BANDA 5  Voz que Move Multidões (←Coração nas Mãos)
```

**Banda 1 — Mortal+**
- **Primeira Impressão** (Cent 1 · Lábia 1 · raiz) — *Passiva.* Em abordagens amistosas, a Defesa Mental do alvo é −2.
- **Palavra Calmante** (Cent 1 · Lábia 2 · pré: Primeira Impressão) — *Ativa (1 En).* Baixa um grau a hostilidade de alguém (ou grupo) ainda não violento.
- **Charme** (Cent 1 · Carisma 2 · pré: Primeira Impressão) — *Ativa (1 En).* Num pedido plausível, +1d6 e o alvo gasta Vontade só para ignorá-lo friamente.

**Banda 2 — Herói**
- **Carisma Magnético** (Cent 2 · Carisma 3 · pré: Charme) — *Ativa (2 En).* Prende a atenção de uma plateia; aliados inspirados ganham +1 nas ações por uma cena.
- **Desarmar** (Cent 2 · Lábia 3 · pré: Palavra Calmante) — *Ativa (2 En).* Convence alguém a baixar a guarda ou a arma; suspende a hostilidade do momento.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Encantamento** (Cent 3 · Carisma 4 · pré: Carisma Magnético) — *Ativa (3 En).* Por uma cena, o alvo o vê como um amigo querido (vs Defesa Mental; quebra se você o trair abertamente).
- **Coração nas Mãos** (Cent 4 · Carisma 5 · pré: Encantamento) — *Ativa (4 En, +1 Vontade).* Altera de forma duradoura a disposição e a lealdade de alguém.
- **Voz que Move Multidões** (Cent 5 · Carisma 5 · pré: Coração nas Mãos) — *Ativa (5 En, +2 Vontade).* Um discurso comove uma cidade inteira a seguir a sua causa.

---

## ✦ CAMINHO DO OLHO AGUÇADO
*Atributo: Percepção · âncora: Prontidão — o que você percebe, ninguém esconde. (Resolução: sentidos/informação.)*

```
BANDA 1  Sentidos Apurados ─┬─ Olhar do Caçador
                            └─ Visão na Penumbra
BANDA 2  Ler o Terreno (←Olhar do Caçador) · Ouvido Absoluto (←Sentidos Apurados)
BANDA 3  Visão Verdadeira (←Visão na Penumbra + Ler o Terreno)
BANDA 4  Clarividência (←Visão Verdadeira)
BANDA 5  Olho que Tudo Vê (←Clarividência)
```

**Banda 1 — Mortal+**
- **Sentidos Apurados** (Cent 1 · Prontidão 1 · raiz) — *Passiva.* +2 em testes de Percepção e na Percepção Passiva; nunca é pego totalmente de surpresa.
- **Olhar do Caçador** (Cent 1 · Percepção 2 · pré: Sentidos Apurados) — *Ativa (1 En).* Saiba uma informação concreta sobre um alvo (ferido? armado? mentindo agora?).
- **Visão na Penumbra** (Cent 1 · Percepção 2 · pré: Sentidos Apurados) — *Passiva.* Enxerga em luz fraca como de dia; na escuridão percebe formas, calor e movimento.

**Banda 2 — Herói**
- **Ler o Terreno** (Cent 2 · Percepção 3 · pré: Olhar do Caçador) — *Ativa (2 En).* Num relance, percebe rotas, armadilhas e fraquezas estruturais.
- **Ouvido Absoluto** (Cent 2 · Percepção 3 · pré: Sentidos Apurados) — *Passiva.* Ouve sussurros distantes, batimentos e sons através de paredes finas.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Visão Verdadeira** (Cent 3 · Percepção 4 · pré: Visão na Penumbra **+** Ler o Terreno) — *Ativa (3 En).* Vê o invisível, ilusões e disfarces; a escuridão perfeita não o cega.
- **Clarividência** (Cent 4 · Percepção 5 · pré: Visão Verdadeira) — *Ativa (4 En, +1 Vontade).* Percebe à distância um local que conhece.
- **Olho que Tudo Vê** (Cent 5 · Percepção 5 · pré: Clarividência) — *Ativa (5 En, +2 Vontade).* Visão de raio-x e percepção a quilômetros; nada se esconde de você.

---

## ✦ CAMINHO DO CERNE VITAL
*Atributo: Vigor · âncora: Resistência — a vida que se recusa a apagar. (Resolução: cura/regeneração.)*

```
BANDA 1  Recuperação Acelerada ─┬─ Ignorar a Dor
                                └─ Segundo Fôlego
BANDA 2  Fechar Feridas (←Segundo Fôlego) · Constituição Férrea (←Ignorar a Dor)
BANDA 3  Regeneração (←Fechar Feridas)
BANDA 4  Recompor-se (←Regeneração)
BANDA 5  Imortalidade Tênue (←Recompor-se)
```

**Banda 1 — Mortal+**
- **Recuperação Acelerada** (Cent 1 · Resistência 1 · raiz) — *Passiva.* Cura o dobro do normal e estabiliza sozinho ao cair.
- **Ignorar a Dor** (Cent 1 · Vigor 2 · pré: Recuperação Acelerada) — *Reflexiva (1 En).* Ignora a penalidade de um ferimento por um turno.
- **Segundo Fôlego** (Cent 1 · Resistência 2 · pré: Recuperação Acelerada) — *Ativa (1 En).* Recupera um punhado de PV de Impacto numa ação.

**Banda 2 — Herói**
- **Fechar Feridas** (Cent 2 · Resistência 3 · pré: Segundo Fôlego) — *Ativa (2 En).* Estanca sangramentos e cura dano Letal leve em minutos.
- **Constituição Férrea** (Cent 2 · Vigor 3 · pré: Ignorar a Dor) — *Passiva.* Grande bônus para resistir a venenos e doenças.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Regeneração** (Cent 3 · Resistência 4 · pré: Fechar Feridas) — *Ativa, dura a cena (3 En).* Recupera PV automaticamente a cada turno.
- **Recompor-se** (Cent 4 · Resistência 5 · pré: Regeneração) — *Ativa (4 En, +1 Vontade).* Fecha ferimentos graves, recoloca ossos e cicatriza cortes profundos em segundos.
- **Imortalidade Tênue** (Cent 5 · Vigor 5 · pré: Recompor-se) — *Ativa (5 En, +2 Vontade).* Volta de golpes que matariam e regenera membros; só a destruição total o mata.

---

## ✦ CAMINHO DA SOMBRA  *(novo subcaminho)*
*Atributo: Destreza · âncora: Furtividade — estar e não estar. (Resolução: furtividade/infiltração, vs Percepção Passiva.)*

```
BANDA 1  Pisar Leve ─┬─ Esgueirar
                     └─ Mãos Sutis
BANDA 2  Manto de Sombras (←Esgueirar) · Bote Silencioso (←Esgueirar)
BANDA 3  Andar entre Olhares (←Manto de Sombras)
BANDA 4  Unir-se à Sombra (←Andar entre Olhares)
BANDA 5  Inexistência (←Unir-se à Sombra)
```

**Banda 1 — Mortal+**
- **Pisar Leve** (Cent 1 · Furtividade 1 · raiz) — *Passiva.* +2 em Furtividade; move-se em silêncio mesmo em ritmo normal.
- **Esgueirar** (Cent 1 · Furtividade 2 · pré: Pisar Leve) — *Ativa (1 En).* Some de vista ao quebrar a linha de visão e reposiciona-se sem ser notado.
- **Mãos Sutis** (Cent 1 · Destreza 2 · pré: Pisar Leve) — *Ativa (1 En).* Furta ou planta objetos sem ser percebido (vs Percepção Passiva).

**Banda 2 — Herói**
- **Manto de Sombras** (Cent 2 · Furtividade 3 · pré: Esgueirar) — *Ativa (2 En).* Nas sombras, torna-se quase invisível enquanto se move devagar.
- **Bote Silencioso** (Cent 2 · Destreza 3 · pré: Esgueirar) — *Ativa (2 En).* Ataque furtivo contra alvo desavisado: +2d6 e ignora parte da Defesa.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Andar entre Olhares** (Cent 3 · Furtividade 4 · pré: Manto de Sombras) — *Ativa (3 En).* Move-se à vista sem ser notado, desde que ninguém o encare diretamente.
- **Unir-se à Sombra** (Cent 4 · Furtividade 5 · pré: Andar entre Olhares) — *Ativa (4 En, +1 Vontade).* Funde-se às sombras: invisível, e capaz de atravessá-las por curtas distâncias.
- **Inexistência** (Cent 5 · Furtividade 5 · pré: Unir-se à Sombra) — *Ativa (5 En, +2 Vontade).* Apaga sua presença: invisível, inaudível e indetectável por meios mundanos.

---

## Expansão do Catálogo — Novos Subcaminhos sugeridos

Temas adicionais para detalhar no futuro, preenchendo nichos que faltavam:

| Atributo | Novo subcaminho | Linha de ação |
|---|---|---|
| Força | **Carrasco** | golpes letais contra alvos feridos, indefesos ou de surpresa |
| Força | **Esteio** | tornar-se imóvel, segurar posição, não ser derrubado nem empurrado |
| Destreza | **Sombra** ✦ | furtividade e infiltração *(detalhado acima)* |
| Destreza | **Duelista** | combate 1-a-1 refinado: aparar, riposte, desarme, ler o oponente |
| Vigor | **Fôlego Inesgotável** | prender a respiração, mergulhos, ambientes sem ar, fadiga zero |
| Carisma | **Pastor** | proteger o ânimo dos aliados, dissipar medo, restaurar moral |
| Manipulação | **Mercador de Segredos** | interrogatório, extrair a verdade, ler e plantar segredos |
| Aparência | **Espelho** | ilusões visuais simples, imagens-isca, miragens |
| Percepção | **Vínculo Animal** ✦ | sentir, falar com e comandar bestas *(detalhado acima)* |
| Inteligência | **Curandeiro** | cura de terceiros via Medicina: tratar, operar, neutralizar venenos |
| Inteligência | **Engenhoqueiro** | construir dispositivos, armadilhas e engenhocas sob pressão |
| Raciocínio | **Andarilho dos Sonhos** | entrar, ler e moldar sonhos; descanso e premonição oníricos |

---

## ✦ CAMINHO DA DANÇA DA LÂMINA
*Atributo: Destreza · âncora: Armas de Corte — a esgrima que vira arte. (Resolução: defesa ativa/duelo.)*

```
BANDA 1  Postura Fluida ─┬─ Aparar
                         └─ Finta
BANDA 2  Riposte (←Aparar) · Desarme (←Finta)
BANDA 3  Dança entre Lâminas (←Riposte + Desarme)
BANDA 4  Mil Cortes (←Dança entre Lâminas)
BANDA 5  Lâmina Perfeita (←Mil Cortes)
```

**Banda 1 — Mortal+**
- **Postura Fluida** (Cent 1 · Armas de Corte 1 · raiz) — *Passiva.* +1 ao Bloqueio com armas de corte; apara sem penalidade.
- **Aparar** (Cent 1 · Armas de Corte 2 · pré: Postura Fluida) — *Reflexiva (1 En).* +3 na Defesa por Bloqueio contra um golpe.
- **Finta** (Cent 1 · Destreza 2 · pré: Postura Fluida) — *Ativa (1 En).* Engana a guarda: −2 na Defesa do alvo no seu próximo ataque.

**Banda 2 — Herói**
- **Riposte** (Cent 2 · Armas de Corte 3 · pré: Aparar) — *Reflexiva (2 En).* Ao aparar com sucesso, contra-ataca imediatamente.
- **Desarme** (Cent 2 · Armas de Corte 3 · pré: Finta) — *Ativa (2 En).* Tenta arrancar a arma do oponente (Destreza+Corte vs Defesa).

**Bandas 3–5 — Semideus ao Quase-deus**
- **Dança entre Lâminas** (Cent 3 · Armas de Corte 4 · pré: Riposte **+** Desarme) — *Ativa (3 En).* Não sofre desgaste de defesa contra vários atacantes por uma rodada.
- **Mil Cortes** (Cent 4 · Armas de Corte 5 · pré: Dança entre Lâminas) — *Ativa (4 En, +1 Vontade).* Vários ataques num só gesto, cada um a custo reduzido.
- **Lâmina Perfeita** (Cent 5 · Destreza 5 · pré: Mil Cortes) — *Ativa, cena (5 En, +2 Vontade).* Cada ataque acha um ponto vital e cada defesa é impecável.

---

## ✦ CAMINHO DO SANGUE FERVENTE
*Atributo: Força · âncora: Briga — a ira que vira poder. (Resolução: ofensiva/fúria.)*

```
BANDA 1  Fúria ─┬─ Ignorar Ferimentos
                └─ Brado de Guerra
BANDA 2  Sede de Sangue (←Fúria) · Investida Furiosa (←Brado de Guerra)
BANDA 3  Frenesi (←Sede de Sangue)
BANDA 4  Não Sentir Dor (←Frenesi)
BANDA 5  Avatar da Carnificina (←Não Sentir Dor)
```

**Banda 1 — Mortal+**
- **Fúria** (Cent 1 · Briga 1 · raiz) — *Ativa (1 En).* Entra em fúria: +1d6 de dano corpo-a-corpo, −1 na Defesa enquanto durar.
- **Ignorar Ferimentos** (Cent 1 · Vigor 2 · pré: Fúria) — *Passiva.* Em fúria, ignora um nível de penalidade de ferimento.
- **Brado de Guerra** (Cent 1 · Briga 2 · pré: Fúria) — *Ativa (1 En).* Rugido que abala inimigos próximos (vs Defesa Mental).

**Banda 2 — Herói**
- **Sede de Sangue** (Cent 2 · Briga 3 · pré: Fúria) — *Passiva.* Cada inimigo derrubado prolonga a fúria e devolve um pouco de Energia.
- **Investida Furiosa** (Cent 2 · Força 3 · pré: Brado de Guerra) — *Ativa (2 En).* Avança e ataca com +dano por knockback.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Frenesi** (Cent 3 · Briga 4 · pré: Sede de Sangue) — *Ativa (3 En).* Ataca repetidamente sem as penalidades de múltiplos ataques por uma rodada.
- **Não Sentir Dor** (Cent 4 · Vigor 5 · pré: Frenesi) — *Ativa (4 En, +1 Vontade).* Em fúria, continua lutando mesmo abaixo de 0 PV até o fim da cena.
- **Avatar da Carnificina** (Cent 5 · Força 5 · pré: Não Sentir Dor) — *Ativa, cena (5 En, +2 Vontade).* Uma tempestade de violência: dano massivo, imune a medo, quase imparável.

---

## ✦ CAMINHO DA LENDA VIVA
*Atributo: Carisma · âncora: Oratória — a presença que move multidões. (Resolução: inspiração/temor, área.)*

```
BANDA 1  Presença Imponente ─┬─ Inspirar
                             └─ Discurso
BANDA 2  Estandarte Vivo (←Inspirar) · Temor Reverente (←Discurso)
BANDA 3  Carisma Heroico (←Estandarte Vivo + Temor Reverente)
BANDA 4  Lenda em Vida (←Carisma Heroico)
BANDA 5  Ícone (←Lenda em Vida)
```

**Banda 1 — Mortal+**
- **Presença Imponente** (Cent 1 · Oratória 1 · raiz) — *Passiva.* +2 onde porte e reputação importam; entra num salão e as cabeças se viram.
- **Inspirar** (Cent 1 · Oratória 2 · pré: Presença Imponente) — *Ativa (1 En).* Aliados que o ouvem ganham +1 nas ações por um turno.
- **Discurso** (Cent 1 · Carisma 2 · pré: Presença Imponente) — *Ativa (1 En).* Move uma plateia a sentir o que você quer (esperança, raiva, calma).

**Banda 2 — Herói**
- **Estandarte Vivo** (Cent 2 · Oratória 3 · pré: Inspirar) — *Ativa (2 En).* Enquanto visível, aliados resistem melhor a medo e desânimo.
- **Temor Reverente** (Cent 2 · Carisma 3 · pré: Discurso) — *Ativa (2 En).* Sua presença faz inimigos comuns hesitarem em atacá-lo.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Carisma Heroico** (Cent 3 · Oratória 4 · pré: Estandarte Vivo **+** Temor Reverente) — *Ativa (3 En).* Inspira uma multidão ou exército a agir como um só.
- **Lenda em Vida** (Cent 4 · Carisma 5 · pré: Carisma Heroico) — *Ativa (4 En, +1 Vontade).* Histórias suas o precedem; estranhos já o admiram ou temem.
- **Ícone** (Cent 5 · Carisma 5 · pré: Lenda em Vida) — *Ativa (5 En, +2 Vontade).* Torna-se um símbolo: multidões o seguem, dispostas a tudo pela sua causa.

---

## ✦ CAMINHO DA MENTE AFIADA
*Atributo: Inteligência · âncora: Conhecimentos — o intelecto que tudo decifra. (Resolução: saber/dedução.)*

```
BANDA 1  Memória Eidética ─┬─ Cálculo Veloz
                           └─ Dedução
BANDA 2  Mente Enciclopédica (←Cálculo Veloz) · Ler a Situação (←Dedução)
BANDA 3  Pensamento Acelerado (←Mente Enciclopédica + Ler a Situação)
BANDA 4  Mente Palaciana (←Pensamento Acelerado)
BANDA 5  Onisciência Momentânea (←Mente Palaciana)
```

**Banda 1 — Mortal+**
- **Memória Eidética** (Cent 1 · Conhecimentos 1 · raiz) — *Passiva.* Lembra perfeitamente de tudo que viu ou ouviu.
- **Cálculo Veloz** (Cent 1 · Inteligência 2 · pré: Memória Eidética) — *Passiva.* Resolve cálculos, estimativas e lógica num instante.
- **Dedução** (Cent 1 · Conhecimentos 2 · pré: Memória Eidética) — *Ativa (1 En).* Junta as pistas disponíveis e o Mestre revela uma conclusão lógica.

**Banda 2 — Herói**
- **Mente Enciclopédica** (Cent 2 · Conhecimentos 3 · pré: Cálculo Veloz) — *Ativa (2 En).* Saiba um fato relevante sobre quase qualquer assunto.
- **Ler a Situação** (Cent 2 · Inteligência 3 · pré: Dedução) — *Ativa (2 En).* Analisa um ambiente ou grupo e identifica dinâmica, ameaças e oportunidades.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Pensamento Acelerado** (Cent 3 · Inteligência 4 · pré: Mente Enciclopédica **+** Ler a Situação) — *Ativa (3 En).* Pensa muitas vezes mais rápido; planeja em segundos, ganha ações mentais extras.
- **Mente Palaciana** (Cent 4 · Inteligência 5 · pré: Pensamento Acelerado) — *Ativa (4 En, +1 Vontade).* Resolve problemas imensos; prevê cadeias de eventos e enigmas "impossíveis".
- **Onisciência Momentânea** (Cent 5 · Inteligência 5 · pré: Mente Palaciana) — *Ativa (5 En, +2 Vontade).* Por um instante, compreende um sistema inteiro — uma cidade, uma conspiração, uma máquina — como se o estudasse por anos.

---

## ✦ CAMINHO DO VÍNCULO ANIMAL  *(novo subcaminho)*
*Atributo: Percepção · âncora: Sobrevivência — a voz que as feras entendem. (Resolução: bestas/companheiro.)*

```
BANDA 1  Empatia Selvagem ─┬─ Acalmar Fera
                           └─ Chamado
BANDA 2  Companheiro (←Acalmar Fera) · Falar com os Animais (←Chamado)
BANDA 3  Matilha (←Companheiro + Falar com os Animais)
BANDA 4  Forma Bestial (←Matilha)
BANDA 5  Senhor das Feras (←Forma Bestial)
```

**Banda 1 — Mortal+**
- **Empatia Selvagem** (Cent 1 · Sobrevivência 1 · raiz) — *Passiva.* Sente o humor e a intenção dos animais; eles raramente o atacam sem motivo.
- **Acalmar Fera** (Cent 1 · Sobrevivência 2 · pré: Empatia Selvagem) — *Ativa (1 En).* Tranquiliza um animal hostil ou assustado.
- **Chamado** (Cent 1 · Percepção 2 · pré: Empatia Selvagem) — *Ativa (1 En).* Atrai animais próximos do tipo apropriado.

**Banda 2 — Herói**
- **Companheiro** (Cent 2 · Sobrevivência 3 · pré: Acalmar Fera) — *Ativa (2 En).* Vincula-se a um animal que o acompanha e obedece comandos simples.
- **Falar com os Animais** (Cent 2 · Percepção 3 · pré: Chamado) — *Ativa (2 En).* Comunica-se com bestas em conceitos simples.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Matilha** (Cent 3 · Sobrevivência 4 · pré: Companheiro **+** Falar com os Animais) — *Ativa (3 En).* Comanda um grupo de animais como aliados coordenados.
- **Forma Bestial** (Cent 4 · Sobrevivência 5 · pré: Matilha) — *Ativa (4 En, +1 Vontade).* Assume traços de um animal — sentidos, garras, velocidade — ou parte de sua forma.
- **Senhor das Feras** (Cent 5 · Percepção 5 · pré: Forma Bestial) — *Ativa (5 En, +2 Vontade).* Convoca e comanda a vida selvagem de toda uma região; transforma-se plenamente em grandes bestas.

---

## ✦ CAMINHO DA MÁSCARA
*Atributo: Manipulação · âncora: Manha — o rosto que não se lê. (Resolução: disfarce/engano, vs Defesa Mental e Percepção.)*

```
BANDA 1  Rosto de Pôquer ─┬─ Fingir
                          └─ Disfarce Rápido
BANDA 2  Mentira Perfeita (←Fingir) · Identidade Falsa (←Disfarce Rápido)
BANDA 3  Camaleão Social (←Mentira Perfeita + Identidade Falsa)
BANDA 4  Roubar Rosto (←Camaleão Social)
BANDA 5  Mil Faces (←Roubar Rosto)
```

**Banda 1 — Mortal+**
- **Rosto de Pôquer** (Cent 1 · Manha 1 · raiz) — *Passiva.* Suas emoções e intenções não vazam; +2 para blefar e mentir.
- **Fingir** (Cent 1 · Manha 2 · pré: Rosto de Pôquer) — *Ativa (1 En).* Finge convincentemente uma emoção ou atitude (medo, amizade, ignorância).
- **Disfarce Rápido** (Cent 1 · Manipulação 2 · pré: Rosto de Pôquer) — *Ativa (1 En).* Muda postura, voz e maneirismos para parecer outro papel social.

**Banda 2 — Herói**
- **Mentira Perfeita** (Cent 2 · Manha 3 · pré: Fingir) — *Ativa (2 En).* Uma mentira que resiste a escrutínio (vs Defesa Mental / Olho da Verdade).
- **Identidade Falsa** (Cent 2 · Manipulação 3 · pré: Disfarce Rápido) — *Ativa (2 En).* Sustenta uma persona inteira de forma crível por uma cena.

**Bandas 3–5 — Semideus ao Quase-deus**
- **Camaleão Social** (Cent 3 · Manha 4 · pré: Mentira Perfeita **+** Identidade Falsa) — *Ativa (3 En).* Mistura-se a qualquer grupo como se pertencesse a ele.
- **Roubar Rosto** (Cent 4 · Manipulação 5 · pré: Camaleão Social) — *Ativa (4 En, +1 Vontade).* Imita uma pessoa específica de forma convincente (voz, trejeitos, detalhes).
- **Mil Faces** (Cent 5 · Manipulação 5 · pré: Roubar Rosto) — *Ativa (5 En, +2 Vontade).* Torna-se indistinguível de quem quiser; nem os íntimos percebem a troca.

---

## CORPO — subcaminhos restantes

### ✦ ATLAS  *(Força · âncora Atletismo — erguer, arremessar e arrancar pesos descomunais)*
**Banda 1** — **Força de Carga** (raiz, passiva): carrega/ergue o dobro do normal sem penalidade. · **Levantamento Poderoso** (pré: Força de Carga, 1 En): ergue por um instante algo muito além do humano (viga, portão, pedra). · **Arremesso** (pré: Força de Carga, 1 En): atira objetos pesados ou pessoas como arma.
**Banda 2** — **Carregar o Mundo** (pré: Força de Carga, passiva): sustenta pesos imensos por longos períodos. · **Esmagamento** (pré: Levantamento Poderoso, 2 En): agarra e esmaga um objeto ou membro.
**Banda 3** — **Arrancar** (pré: Levantamento Poderoso + Arremesso, 3 En): arranca árvores, postes e portões para usar como arma.
**Banda 4** — **Força Titânica** (pré: Arrancar, 4 En, +1 Vontade): ergue carroças, estátuas e pedras de tonelada.
**Banda 5** — **Atlas** (pré: Força Titânica, 5 En, +2 Vontade): sustenta ou arremessa coisas de escala absurda (uma muralha, um barco).

### ✦ QUEBRA-MURALHAS  *(Força · âncora Armas de Impacto — destruir estruturas e defesas)*
**Banda 1** — **Demolidor** (raiz, passiva): +1 dado de dano contra objetos/estruturas; ignora parte da dureza. · **Pancada Destrutiva** (pré: Demolidor, 1 En): um golpe quebra portas, fechaduras e correntes. · **Romper** (pré: Demolidor, 1 En): força passagem por barreiras frágeis sem perder o ritmo.
**Banda 2** — **Estilhaçar** (pré: Demolidor, 2 En): quebra escudos e armas inferiores ao bloquear. · **Abrir Brecha** (pré: Pancada Destrutiva, 2 En): derruba uma parede fraca num golpe.
**Banda 3** — **Esmaga-Pedra** (pré: Estilhaçar + Abrir Brecha, 3 En): rompe pedra e portões reforçados.
**Banda 4** — **Terremoto** (pré: Esmaga-Pedra, 4 En, +1 Vontade): bate o chão, abre fendas e derruba quem está perto.
**Banda 5** — **Quebra-Muralhas** (pré: Terremoto, 5 En, +2 Vontade): derruba muralhas e torres; abre caminho por qualquer fortificação.

### ✦ AGARRÃO DO URSO  *(Força · âncora Briga — agarrar, imobilizar, esmagar, arremessar)*
**Banda 1** — **Pegada de Ferro** (raiz, passiva): grande bônus para agarrar e manter agarrões. · **Imobilizar** (pré: Pegada de Ferro, 1 En): prende o agarrado (ele gasta ação para escapar). · **Projeção** (pré: Pegada de Ferro, 1 En): arremessa um inimigo agarrado (dano + afasta).
**Banda 2** — **Esmagar nos Braços** (pré: Pegada de Ferro, 2 En): dano contínuo a quem está agarrado. · **Escudo de Carne** (pré: Imobilizar, 2 En): usa o agarrado como escudo.
**Banda 3** — **Dominar** (pré: Esmagar nos Braços + Imobilizar, 3 En): controla o corpo do oponente (sufoca, quebra membros).
**Banda 4** — **Aperto Esmagador** (pré: Dominar, 4 En, +1 Vontade): esmaga ossos e armaduras no abraço; parte armas e escudos.
**Banda 5** — **Abraço do Titã** (pré: Aperto Esmagador, 5 En, +2 Vontade): agarra e esmaga criaturas enormes; nada escapa.

### ✦ GATO  *(Destreza · âncora Atletismo — acrobacia, equilíbrio, quedas, escalada)*
**Banda 1** — **Equilíbrio Felino** (raiz, passiva): nunca cai de superfícies estreitas; +acrobacia/escalada. · **Queda de Gato** (pré: Equilíbrio Felino, reflexiva 1 En): reduz muito o dano de quedas; cai de pé. · **Escalada Veloz** (pré: Equilíbrio Felino, 1 En): sobe superfícies difíceis em velocidade de corrida.
**Banda 2** — **Contorção** (pré: Equilíbrio Felino, 2 En): passa por aberturas mínimas, escapa de amarras e grades. · **Salto Acrobático** (pré: Queda de Gato, 2 En): piruetas que reposicionam e desviam.
**Banda 3** — **Andar de Aranha** (pré: Escalada Veloz + Contorção, 3 En): escala qualquer superfície, até de cabeça para baixo.
**Banda 4** — **Imponderável** (pré: Andar de Aranha, 4 En, +1 Vontade): equilibra-se sobre cordas, lâminas e fios; pousa sem peso.
**Banda 5** — **Graça Sobrenatural** (pré: Imponderável, 5 En, +2 Vontade): move-se por qualquer terreno como se a gravidade não o tocasse.

### ✦ MÃO VELOZ  *(Destreza · âncora Ladinagem — prestidigitação, desarmar, controle fino)*
**Banda 1** — **Dedos Ágeis** (raiz, passiva): grande bônus em prestidigitação, fechaduras e furto. · **Truque de Mão** (pré: Dedos Ágeis, 1 En): some/planta/rouba objetos pequenos sem ser visto. · **Desarme Rápido** (pré: Dedos Ágeis, 1 En): tira um objeto/arma da mão do alvo num gesto.
**Banda 2** — **Mãos Borradas** (pré: Dedos Ágeis, 2 En): manipula vários objetos rápido demais para acompanhar. · **Toque Preciso** (pré: Truque de Mão, 2 En): desarma armadilhas e abre qualquer fechadura mundana num instante.
**Banda 3** — **Mil Dedos** (pré: Mãos Borradas + Toque Preciso, 3 En): várias ações manuais finas numa única ação.
**Banda 4** — **Mãos Impossíveis** (pré: Mil Dedos, 4 En, +1 Vontade): proezas que desafiam a física (pegar flechas no ar, refazer um mecanismo num piscar).
**Banda 5** — **Mão do Prestidigitador Divino** (pré: Mãos Impossíveis, 5 En, +2 Vontade): manipula tudo ao alcance das mãos com velocidade sobre-humana absoluta.

### ✦ CORAÇÃO INCANSÁVEL  *(Vigor · âncora Resistência — fôlego, fadiga, marcha)*
**Banda 1** — **Fôlego Profundo** (raiz, passiva): dobra o tempo de esforço, corrida e prender a respiração. · **Segundo Vento** (pré: Fôlego Profundo, 1 En): remove a fadiga acumulada numa ação. · **Marcha Forçada** (pré: Fôlego Profundo, passiva): viaja muito mais sem exaustão.
**Banda 2** — **Incansável** (pré: Fôlego Profundo, passiva): quase não sente fadiga em esforços prolongados. · **Pulmões de Ferro** (pré: Segundo Vento, 2 En): prende a respiração por minutos; resiste a fumaça e gases.
**Banda 3** — **Sem Limites** (pré: Incansável + Pulmões de Ferro, 3 En): age no auge por horas; corre dias sem parar.
**Banda 4** — **Vigor Inesgotável** (pré: Sem Limites, passiva): nunca se cansa; dispensa sono e comida por longos períodos.
**Banda 5** — **Coração Eterno** (pré: Vigor Inesgotável, 5 En, +2 Vontade): fôlego infinito; resiste a qualquer ambiente, esforço ou privação.

### ✦ SANGUE IMUNE  *(Vigor · âncora Resistência — venenos, doenças, ambientes extremos)*
**Banda 1** — **Estômago de Ferro** (raiz, passiva): grande bônus contra venenos e comida estragada. · **Resistir Doença** (pré: Estômago de Ferro, passiva): raramente adoece. · **Aclimatação** (pré: Estômago de Ferro, 1 En): adapta-se rápido a calor, frio e altitude.
**Banda 2** — **Sangue Limpo** (pré: Estômago de Ferro, 2 En): neutraliza um veneno já no corpo; expele toxinas. · **Pele Resiliente** (pré: Aclimatação, passiva): suporta temperaturas e ambientes que matariam outros.
**Banda 3** — **Imunidade** (pré: Sangue Limpo + Resistir Doença, 3 En): imune a venenos e doenças mundanos.
**Banda 4** — **Corpo Inóspito** (pré: Imunidade, 4 En, +1 Vontade): sobrevive em ambientes letais (sem ar, submerso, veneno no ar) por um tempo.
**Banda 5** — **Sangue Divino** (pré: Corpo Inóspito, 5 En, +2 Vontade): imune a quase todo veneno, doença e ambiente; o corpo rejeita a corrupção.

### ✦ CARNE TEIMOSA  *(Vigor · âncora Resistência/Convicção — ignorar ferimentos, recusar-se a cair)*
**Banda 1** — **Aguentar Firme** (raiz, passiva): ignora a penalidade do estado Machucado. · **Cerrar os Dentes** (pré: Aguentar Firme, reflexiva 1 En): ignora a penalidade de ferimento por uma ação crucial. · **De Pé** (pré: Aguentar Firme, 1 En): levanta-se na hora ao ser derrubado, sem gastar a ação.
**Banda 2** — **Teimosia** (pré: Aguentar Firme, passiva): reduz todas as penalidades de ferimento em 1. · **Não Vou Cair** (pré: Cerrar os Dentes, reflexiva 2 En): ao chegar a 0 PV, fica de pé por mais um turno.
**Banda 3** — **Vontade de Viver** (pré: Teimosia + Não Vou Cair, 3 En): age normalmente mesmo gravemente ferido por uma cena.
**Banda 4** — **Último Suspiro** (pré: Vontade de Viver, 4 En, +1 Vontade): no limiar da morte, realiza uma última ação heroica plena.
**Banda 5** — **Recusa à Morte** (pré: Último Suspiro, 5 En, +2 Vontade): adia a própria morte por pura vontade até terminar o que precisa.

---

## VOZ — subcaminhos restantes

### ✦ ESTANDARTE  *(Carisma · âncora Oratória/Tática — liderança, coordenar, moral)*
**Banda 1** — **Voz de Líder** (raiz, passiva): aliados que o seguem ganham bônus de moral; ordens claras. · **Coordenar** (pré: Voz de Líder, 1 En): um aliado age no melhor momento (concede reação/reposiciona iniciativa). · **Reunir** (pré: Voz de Líder, 1 En): reagrupa aliados abalados, removendo medo leve.
**Banda 2** — **Formação** (pré: Voz de Líder, 2 En): aliados coordenados ganham bônus de defesa/ataque juntos. · **Grito de Guerra** (pré: Reunir, 2 En): inspira investida (+dano/movimento num avanço).
**Banda 3** — **Maestria de Campo** (pré: Formação + Coordenar, 3 En): comanda um grupo como uma unidade; concede ações coordenadas.
**Banda 4** — **General** (pré: Maestria de Campo, 4 En, +1 Vontade): dirige uma tropa com eficiência sobre-humana; reverte uma derrota iminente.
**Banda 5** — **Estandarte Eterno** (pré: General, 5 En, +2 Vontade): torna-se o símbolo da batalha; um exército luta como um só corpo enquanto você estiver de pé.

### ✦ MUSA  *(Carisma · âncora Performance — encantar plateias, mover emoções)*
**Banda 1** — **Presença Cênica** (raiz, passiva): grande bônus em performance; prende atenção. · **Tocar a Alma** (pré: Presença Cênica, 1 En): a plateia sente uma emoção escolhida. · **Distrair** (pré: Presença Cênica, 1 En): a apresentação desvia a atenção de todos por um momento.
**Banda 2** — **Inspiração Artística** (pré: Tocar a Alma, 2 En): dá aos ouvintes um bônus duradouro (coragem/foco) por uma cena. · **Encantar a Multidão** (pré: Distrair, 2 En): a plateia fica absorta enquanto você se apresenta.
**Banda 3** — **Obra-Prima** (pré: Inspiração Artística + Encantar a Multidão, 3 En): performance que comove e muda atitudes.
**Banda 4** — **Voz que Cura** (pré: Obra-Prima, 4 En, +1 Vontade): a arte restaura o espírito — remove trauma, medo, desespero.
**Banda 5** — **Canção Imortal** (pré: Voz que Cura, 5 En, +2 Vontade): move massas às lágrimas ou à fúria; ecoa e inspira por gerações.

### ✦ BRASA  *(Carisma · âncora Oratória — inflamar paixões, incitar)*
**Banda 1** — **Centelha** (raiz, passiva): bônus para incitar, provocar e inflamar. · **Incitar** (pré: Centelha, 1 En): provoca raiva/paixão, empurrando à ação. · **Inflamar** (pré: Centelha, 1 En): acende o ânimo de aliados (fervor temporário).
**Banda 2** — **Discurso Ardente** (pré: Centelha, 2 En): arrebata uma multidão para uma causa por uma cena. · **Provocação** (pré: Incitar, 2 En): força um inimigo a agir por impulso.
**Banda 3** — **Fogo nos Corações** (pré: Discurso Ardente + Provocação, 3 En): inflama uma multidão à revolta ou ao fervor.
**Banda 4** — **Pavio Curto** (pré: Fogo nos Corações, 4 En, +1 Vontade): incendeia paixões a ponto de mover cidades (motim, levante).
**Banda 5** — **Incêndio** (pré: Pavio Curto, 5 En, +2 Vontade): suas palavras espalham um fervor que consome reinos; uma fagulha vira revolução.

### ✦ TEIA  *(Manipulação · âncora Manha/Política — intriga, plantar ideias, chantagem)*
**Banda 1** — **Trama** (raiz, passiva): bônus em intrigas e em ler fraquezas sociais. · **Plantar Ideia** (pré: Trama, 1 En): insinua uma ideia que o alvo crê ser sua. · **Cunha** (pré: Trama, 1 En): semeia desconfiança entre dois aliados.
**Banda 2** — **Chantagem** (pré: Trama, 2 En): usa uma alavanca para dobrar a vontade de alguém. · **Rede de Favores** (pré: Plantar Ideia, 2 En): cultiva uma teia de contatos e dívidas.
**Banda 3** — **Virar o Jogo** (pré: Chantagem + Cunha, 3 En): vira facções e pessoas umas contra as outras numa cena.
**Banda 4** — **Mestre dos Cordéis** (pré: Virar o Jogo, 4 En, +1 Vontade): orquestra intrigas de longo alcance; manipula uma corte nos bastidores.
**Banda 5** — **Teia** (pré: Mestre dos Cordéis, 5 En, +2 Vontade): nada acontece numa região sem ser parte do seu plano; reis dançam sem saber.

### ✦ SERPENTE DAS PALAVRAS  *(Manipulação · âncora Lábia — barganha, torcer sentidos)*
**Banda 1** — **Língua de Prata** (raiz, passiva): grande bônus em barganha e meias-verdades. · **Torcer** (pré: Língua de Prata, 1 En): reinterpreta uma frase/acordo a seu favor. · **Pechinchar** (pré: Língua de Prata, 1 En): obtém condições muito melhores numa negociação.
**Banda 2** — **Contrato Capcioso** (pré: Língua de Prata, 2 En): fecha acordos com armadilhas que o alvo não percebe. · **Confundir** (pré: Torcer, 2 En): emaranha o alvo em lógica até ele concordar.
**Banda 3** — **Palavras de Veludo** (pré: Contrato Capcioso + Confundir, 3 En): convence alguém de quase qualquer coisa razoável (vs Defesa Mental).
**Banda 4** — **Pacto Inquebrável** (pré: Palavras de Veludo, 4 En, +1 Vontade): sela acordos que o alvo se sente compelido a cumprir.
**Banda 5** — **Voz da Serpente** (pré: Pacto Inquebrável, 5 En, +2 Vontade): dobra até os céticos; faz o mal parecer bem e a mentira, verdade.

### ✦ SUSSURRO  *(Manipulação · âncora Manha — semear medo, dúvida, paranoia)*
**Banda 1** — **Sussurro** (raiz, passiva): bônus para insinuar e plantar emoções negativas sutis. · **Semear Dúvida** (pré: Sussurro, 1 En): faz o alvo duvidar de quem confiava. · **Inquietar** (pré: Sussurro, 1 En): deixa o alvo nervoso, com a sensação de ser observado.
**Banda 2** — **Paranoia** (pré: Sussurro, 2 En): instala suspeita corrosiva (vs Defesa Mental). · **Boato** (pré: Semear Dúvida, 2 En): espalha um rumor que mina reputações.
**Banda 3** — **Veneno na Mente** (pré: Paranoia + Boato, 3 En): corrói a confiança e a sanidade de um alvo ao longo da cena.
**Banda 4** — **Pesadelo Acordado** (pré: Veneno na Mente, 4 En, +1 Vontade): assombra o alvo com medos e visões; quebra a compostura dele.
**Banda 5** — **Coro de Sussurros** (pré: Pesadelo Acordado, 5 En, +2 Vontade): semeia pânico e desconfiança numa multidão; vira aliados em inimigos.

### ✦ MARIONETE  *(Manipulação · âncora Manha — sugestão profunda, reescrever desejos)*
**Banda 1** — **Sugestão** (raiz, 1 En): planta um impulso simples que o alvo tende a seguir (vs Defesa Mental). · **Ler Desejos** (pré: Sugestão, passiva): percebe o que o alvo quer e teme. · **Empurrão Sutil** (pré: Sugestão, 1 En): inclina uma decisão indecisa na direção que você quer.
**Banda 2** — **Compulsão** (pré: Sugestão, 2 En): impõe um desejo passageiro que o alvo racionaliza como seu. · **Fios Invisíveis** (pré: Ler Desejos, 2 En): guia o comportamento do alvo sutilmente por uma cena.
**Banda 3** — **Titereiro** (pré: Compulsão + Fios Invisíveis, 3 En): controla as ações do alvo por um curto tempo (resistível com Vontade).
**Banda 4** — **Reescrever Desejos** (pré: Titereiro, 4 En, +1 Vontade): altera o que o alvo deseja de forma duradoura.
**Banda 5** — **Marionete** (pré: Reescrever Desejos, 5 En, +2 Vontade): domina um alvo por completo, corpo e vontade, como um fantoche.

### ✦ BELEZA CATIVANTE  *(Aparência · âncora Lábia — atrair, seduzir, desarmar)*
**Banda 1** — **Magnetismo** (raiz, passiva): bônus quando a aparência importa; olhares se voltam a você. · **Sedução** (pré: Magnetismo, 1 En): desperta atração num alvo receptivo (vs Defesa Mental). · **Desarmar com Charme** (pré: Magnetismo, 1 En): a beleza baixa a guarda do alvo.
**Banda 2** — **Encanto Irresistível** (pré: Magnetismo, 2 En): cativa uma sala inteira; todos querem sua atenção. · **Olhar Cativante** (pré: Sedução, 2 En): prende o alvo num momento de fascínio.
**Banda 3** — **Beleza Inebriante** (pré: Encanto Irresistível + Olhar Cativante, 3 En): o alvo, encantado, cede a pedidos razoáveis.
**Banda 4** — **Visão Divina** (pré: Beleza Inebriante, 4 En, +1 Vontade): inspira devoção quase religiosa; multidões se rendem ao seu charme.
**Banda 5** — **Beleza que Move o Mundo** (pré: Visão Divina, 5 En, +2 Vontade): incomparável; quem o vê faria qualquer coisa por um sorriso seu.

### ✦ SEMBLANTE  *(Aparência · âncora Intimidação — impor respeito ou medo pela presença)*
**Banda 1** — **Porte** (raiz, passiva): bônus para impor respeito; é levado a sério de imediato. · **Olhar Severo** (pré: Porte, 1 En): um olhar faz um alvo hesitar ou recuar. · **Imponência** (pré: Porte, 1 En): sua presença domina o ambiente; conversas silenciam quando você entra.
**Banda 2** — **Aura de Comando** (pré: Porte, 2 En): subordinados e fracos obedecem instintivamente sua presença. · **Encarar a Morte** (pré: Olhar Severo, 2 En): seu semblante inspira medo real (vs Defesa Mental).
**Banda 3** — **Presença Avassaladora** (pré: Aura de Comando + Encarar a Morte, 3 En): inimigos comuns congelam ou fogem diante de você.
**Banda 4** — **Majestade** (pré: Presença Avassaladora, 4 En, +1 Vontade): irradia autoridade divina; multidões se ajoelham ou tremem.
**Banda 5** — **Semblante de Deus** (pré: Majestade, 5 En, +2 Vontade): sua mera presença impõe reverência ou terror absolutos.

### ✦ CAMALEÃO  *(Aparência · âncora Ladinagem/Manha — alterar a própria aparência)*
**Banda 1** — **Disfarce** (raiz, passiva): grande bônus para se disfarçar com adereços. · **Mudar de Cara** (pré: Disfarce, 1 En): altera postura, expressão e voz para parecer outra pessoa. · **Misturar-se** (pré: Disfarce, 1 En): passa por "mais um da multidão".
**Banda 2** — **Segunda Pele** (pré: Disfarce, 2 En): muda a própria aparência física por uma cena, sem adereços. · **Rosto Comum** (pré: Misturar-se, 2 En): torna-se esquecível; testemunhas não conseguem descrevê-lo.
**Banda 3** — **Impostor** (pré: Segunda Pele + Rosto Comum, 3 En): imita a aparência de uma pessoa específica de forma convincente.
**Banda 4** — **Forma Fluida** (pré: Impostor, 4 En, +1 Vontade): altera o corpo livremente — altura, idade, feições — à vontade.
**Banda 5** — **Mil Rostos** (pré: Forma Fluida, 5 En, +2 Vontade): assume qualquer aparência humana perfeitamente; ninguém jamais o reconhece.

### ✦ AURA  *(Aparência · âncora Performance — irradiar emoção à volta)*
**Banda 1** — **Aura Sutil** (raiz, passiva): emana uma emoção tênue (conforto/desconforto) a quem está perto. · **Irradiar Calma** (pré: Aura Sutil, 1 En): acalma pessoas e animais ao redor. · **Irradiar Temor** (pré: Aura Sutil, 1 En): incute medo leve nos próximos.
**Banda 2** — **Campo Emocional** (pré: Aura Sutil, 2 En): impõe uma emoção a todos numa área por um tempo. · **Presença Tangível** (pré: Irradiar Calma, 2 En): a aura afeta até os resistentes.
**Banda 3** — **Maré Emocional** (pré: Campo Emocional + Presença Tangível, 3 En): domina o clima emocional de uma multidão.
**Banda 4** — **Aura Avassaladora** (pré: Maré Emocional, 4 En, +1 Vontade): a emoção irradiada torna-se quase irresistível numa grande área.
**Banda 5** — **Aura Divina** (pré: Aura Avassaladora, 5 En, +2 Vontade): sua presença banha uma região inteira na emoção que escolher.

### ✦ MÁSCARA IMPASSÍVEL  *(Aparência · âncora Manha — esconder emoções, blefe perfeito)*
**Banda 1** — **Face Neutra** (raiz, passiva): suas emoções nunca transparecem; grande bônus em blefe. · **Esconder Sentir** (pré: Face Neutra, 1 En): oculta uma emoção/reação no momento. · **Mentira de Olhos** (pré: Face Neutra, 1 En): mente sem nenhum sinal físico (vs Olho da Verdade).
**Banda 2** — **Inescrutável** (pré: Face Neutra, passiva): ninguém lê suas intenções; imune a leitura corporal mundana. · **Calma Absoluta** (pré: Esconder Sentir, 2 En): mantém compostura perfeita sob tortura, terror ou provocação.
**Banda 3** — **Véu da Mente** (pré: Inescrutável + Calma Absoluta, 3 En): esconde pensamentos e intenções até de poderes que leem a mente.
**Banda 4** — **Máscara Perfeita** (pré: Véu da Mente, 4 En, +1 Vontade): finge qualquer estado interior de forma indetectável, mesmo para semideuses.
**Banda 5** — **Vazio** (pré: Máscara Perfeita, 5 En, +2 Vontade): torna-se ilegível e impenetrável; nem a magia mais sutil decifra o que você sente ou trama.

---

## MENTE — subcaminhos restantes

### ✦ SENTINELA  *(Percepção · âncora Prontidão — alerta, detectar perigo e emboscadas)*
**Banda 1** — **Vigilância** (raiz, passiva): grande bônus em Prontidão; difícil de surpreender. · **Sentir Perigo** (pré: Vigilância, 1 En): pressente uma ameaça oculta nas redondezas. · **Olho Atento** (pré: Vigilância, 1 En): nota o que está fora do lugar (armadilhas, espreita).
**Banda 2** — **Nunca Desprevenido** (pré: Vigilância, passiva): age normalmente em emboscadas; não pode ser pego de surpresa. · **Varredura** (pré: Olho Atento, 2 En): num relance, mapeia ameaças, saídas e vantagens.
**Banda 3** — **Sexto Sentido** (pré: Nunca Desprevenido + Sentir Perigo, 3 En): sente intenções hostis antes que ocorram; reage a ataques invisíveis.
**Banda 4** — **Olhos por Toda Parte** (pré: Sexto Sentido, 4 En, +1 Vontade): percebe tudo numa grande área ao mesmo tempo.
**Banda 5** — **Guardião Incansável** (pré: Olhos por Toda Parte, 5 En, +2 Vontade): vigilância perfeita e constante; nada o pega desprevenido, nem o sobrenatural.

### ✦ CAÇADOR  *(Percepção · âncora Sobrevivência — rastrear, farejar, seguir trilhas)*
**Banda 1** — **Rastreador** (raiz, passiva): grande bônus para rastrear e ler sinais. · **Faro** (pré: Rastreador, 1 En): segue um cheiro ou trilha mesmo tênue. · **Ler o Rastro** (pré: Rastreador, 1 En): deduz o que houve por marcas (quantos, quando, para onde).
**Banda 2** — **Trilha Fria** (pré: Rastreador, 2 En): segue rastros antigos ou apagados. · **Predador** (pré: Faro, 2 En): aproxima-se da presa sem ser notado; conhece seus hábitos.
**Banda 3** — **Caça Implacável** (pré: Trilha Fria + Predador, 3 En): persegue um alvo por qualquer terreno, dias a fio.
**Banda 4** — **Sentidos de Caçada** (pré: Caça Implacável, 4 En, +1 Vontade): localiza uma presa específica à distância; sente sua presença.
**Banda 5** — **Olho do Caçador Divino** (pré: Sentidos de Caçada, 5 En, +2 Vontade): nada que você caça escapa, onde quer que se esconda.

### ✦ OLHO DA VERDADE  *(Percepção · âncora Empatia/Investigação — detectar mentiras, ilusões, disfarces)*
**Banda 1** — **Ler Pessoas** (raiz, passiva): grande bônus para perceber emoções e mentiras. · **Farejar Mentira** (pré: Ler Pessoas, 1 En): sente quando alguém mente. · **Ver Através** (pré: Ler Pessoas, 1 En): nota disfarces e fingimentos malfeitos.
**Banda 2** — **Olho Crítico** (pré: Ler Pessoas, 2 En): percebe falsificações e segundas intenções. · **Desmascarar** (pré: Ver Através, 2 En): revela um disfarce ou mentira mundana (vs Camaleão/Máscara).
**Banda 3** — **Verdade Nua** (pré: Olho Crítico + Desmascarar, 3 En): vê através de ilusões e enganos, inclusive alguns mágicos.
**Banda 4** — **Olho que Não Erra** (pré: Verdade Nua, 4 En, +1 Vontade): nenhuma mentira ou disfarce o engana.
**Banda 5** — **Visão da Verdade** (pré: Olho que Não Erra, 5 En, +2 Vontade): percebe a verdade absoluta de uma pessoa ou situação.

### ✦ COMUNHÃO  *(Percepção · âncora Ocultismo — perceber o sobrenatural, auras, espíritos)*
**Banda 1** — **Sensível** (raiz, passiva): pressente o sobrenatural próximo (magia, espíritos, lugares de poder). · **Ver Auras** (pré: Sensível, 1 En): percebe o estado/natureza de alguém como cores. · **Sentir o Véu** (pré: Sensível, 1 En): nota presenças invisíveis e ecos do passado num lugar.
**Banda 2** — **Olho Espiritual** (pré: Sensível, 2 En): vê espíritos, encantamentos ativos e marcas mágicas. · **Ler o Lugar** (pré: Sentir o Véu, 2 En): percebe o que aconteceu num local.
**Banda 3** — **Comunhão** (pré: Olho Espiritual + Ler o Lugar, 3 En): comunica-se com espíritos e percebe o mundo invisível.
**Banda 4** — **Olhar Além** (pré: Comunhão, 4 En, +1 Vontade): enxerga planos sobrepostos ao mundo; lê a teia de essência.
**Banda 5** — **Olho do Vidente** (pré: Olhar Além, 5 En, +2 Vontade): percebe a verdadeira natureza espiritual de tudo; nada do oculto lhe é velado.

### ✦ ERUDITO  *(Inteligência · âncora Conhecimentos — saber enciclopédico, idiomas)*
**Banda 1** — **Vasto Saber** (raiz, passiva): grande bônus em Conhecimentos; sabe um pouco de tudo. · **Lembrar** (pré: Vasto Saber, 1 En): recorda um fato relevante que estudou. · **Poliglota** (pré: Vasto Saber, passiva): compreende e aprende idiomas com facilidade espantosa.
**Banda 2** — **Biblioteca Viva** (pré: Vasto Saber, 2 En): conhecimento profundo em muitas áreas. · **Decifrar** (pré: Poliglota, 2 En): lê escritas antigas, cifras e línguas mortas.
**Banda 3** — **Sábio** (pré: Biblioteca Viva + Decifrar, 3 En): domina saberes raros; conecta conhecimentos distantes.
**Banda 4** — **Mente Universal** (pré: Sábio, 4 En, +1 Vontade): sabe quase tudo que a civilização registrou.
**Banda 5** — **Conhecimento Absoluto** (pré: Mente Universal, 5 En, +2 Vontade): qualquer saber humano está ao seu alcance; lê qualquer língua na hora.

### ✦ ARTESÃO  *(Inteligência · âncora Craft — crafts sobre-humanos, obras-primas)*
**Banda 1** — **Mãos Hábeis** (raiz, passiva): grande bônus em Craft; conserta e improvisa com facilidade. · **Improvisar** (pré: Mãos Hábeis, 1 En): constrói uma ferramenta/solução com o que tem. · **Olho de Artífice** (pré: Mãos Hábeis, 1 En): avalia qualidade, função e fraqueza de um objeto.
**Banda 2** — **Obra Fina** (pré: Mãos Hábeis, 2 En): cria itens de qualidade excepcional. · **Reparo Veloz** (pré: Improvisar, 2 En): conserta ou monta algo complexo numa fração do tempo.
**Banda 3** — **Mestre Artesão** (pré: Obra Fina + Reparo Veloz, 3 En): cria obras-primas que parecem impossíveis.
**Banda 4** — **Engenho Sobre-humano** (pré: Mestre Artesão, 4 En, +1 Vontade): constrói máquinas e autômatos além da técnica de sua era.
**Banda 5** — **Forja dos Deuses** (pré: Engenho Sobre-humano, 5 En, +2 Vontade): cria artefatos lendários e maravilhas que desafiam o possível.

### ✦ ESTRATEGISTA  *(Inteligência · âncora Tática — ler batalhas, prever, planos)*
**Banda 1** — **Mente Tática** (raiz, passiva): grande bônus em Tática; lê o campo num instante. · **Antecipar** (pré: Mente Tática, 1 En): prevê o próximo movimento de um oponente. · **Plano** (pré: Mente Tática, 1 En): traça um plano com etapas e contingências.
**Banda 2** — **Ler a Batalha** (pré: Mente Tática, 2 En): identifica o ponto fraco de uma força e o momento de agir. · **Emboscada** (pré: Plano, 2 En): prepara armadilhas e posições de grande vantagem inicial.
**Banda 3** — **Grande Estrategista** (pré: Ler a Batalha + Emboscada, 3 En): orquestra uma batalha para virar o jogo.
**Banda 4** — **Xeque-Mate** (pré: Grande Estrategista, 4 En, +1 Vontade): prevê e contrapõe os planos do inimigo passos à frente.
**Banda 5** — **Mente do General Divino** (pré: Xeque-Mate, 5 En, +2 Vontade): conduz guerras como um jogo já vencido.

### ✦ INVESTIGADOR  *(Inteligência · âncora Investigação — reconstituir cenas, conectar pistas)*
**Banda 1** — **Olhar Investigativo** (raiz, passiva): grande bônus em Investigação; nota o que outros não veem. · **Pista** (pré: Olhar Investigativo, 1 En): identifica um indício relevante. · **Conectar** (pré: Olhar Investigativo, 1 En): liga dois fatos numa dedução.
**Banda 2** — **Reconstituir** (pré: Olhar Investigativo, 2 En): reconstrói o que houve num local pelos vestígios. · **Interrogar** (pré: Conectar, 2 En): extrai a verdade lendo reações e inconsistências.
**Banda 3** — **Detetive** (pré: Reconstituir + Interrogar, 3 En): resolve um mistério complexo juntando as peças.
**Banda 4** — **Nada Escapa** (pré: Detetive, 4 En, +1 Vontade): percebe o detalhe crucial que ninguém viu; desvenda conspirações.
**Banda 5** — **A Verdade Revelada** (pré: Nada Escapa, 5 En, +2 Vontade): de pistas mínimas, reconstrói a verdade completa de qualquer evento.

### ✦ REFLEXO MENTAL  *(Raciocínio · âncora Prontidão — iniciativa, reagir e pensar sob pressão)*
**Banda 1** — **Mente Rápida** (raiz, passiva): grande bônus de Iniciativa; pensa veloz sob pressão. · **Reação** (pré: Mente Rápida, reflexiva 1 En): responde a um evento súbito sem ser pego de surpresa. · **Decisão Instantânea** (pré: Mente Rápida, 1 En): toma a melhor decisão num átimo.
**Banda 2** — **Reflexos de Raio** (pré: Mente Rápida, passiva): age sempre entre os primeiros. · **Pensar e Agir** (pré: Reação, 2 En): realiza uma ação mental e uma física quase simultâneas.
**Banda 3** — **Tempo de Sobra** (pré: Reflexos de Raio + Decisão Instantânea, 3 En): o caos parece em câmera lenta; planeja no meio da ação.
**Banda 4** — **Mente Acelerada** (pré: Tempo de Sobra, 4 En, +1 Vontade): reage tão rápido que age várias vezes enquanto outros pensam.
**Banda 5** — **Reflexo Divino** (pré: Mente Acelerada, 5 En, +2 Vontade): reage ao instantâneo; nada o pega despreparado.

### ✦ IMPROVISO  *(Raciocínio · âncora Manha/Craft — soluções instantâneas, usar o ambiente)*
**Banda 1** — **Jeitinho** (raiz, passiva): bônus para improvisar com o que há à mão. · **Usar o Cenário** (pré: Jeitinho, 1 En): transforma um elemento do ambiente em vantagem. · **Virar a Mesa** (pré: Jeitinho, 1 En): inverte uma situação ruim com uma ideia inesperada.
**Banda 2** — **Solução Genial** (pré: Jeitinho, 2 En): resolve um problema de um jeito que ninguém esperava. · **MacGyver** (pré: Usar o Cenário, 2 En): monta um dispositivo improvisado funcional na hora.
**Banda 3** — **Sempre uma Saída** (pré: Solução Genial + MacGyver, 3 En): encontra escapatória até nas situações mais fechadas.
**Banda 4** — **Improviso Magistral** (pré: Sempre uma Saída, 4 En, +1 Vontade): vira qualquer cenário a seu favor com engenhosidade quase mágica.
**Banda 5** — **Lei de Murphy Reversa** (pré: Improviso Magistral, 5 En, +2 Vontade): o improvável dá certo nas suas mãos; transforma o caos em plano.

### ✦ LEITURA FRIA  *(Raciocínio · âncora Empatia — deduzir pessoas, prever ações, ler tells)*
**Banda 1** — **Ler o Outro** (raiz, passiva): grande bônus para deduzir personalidade e intenção. · **Adivinhar** (pré: Ler o Outro, 1 En): infere um fato sobre o alvo só de observá-lo. · **Ler Tells** (pré: Ler o Outro, 1 En): percebe os sinais que denunciam o próximo ato do alvo.
**Banda 2** — **Perfil** (pré: Ler o Outro, 2 En): monta um perfil preciso após breve contato. · **Antecipar a Pessoa** (pré: Ler Tells, 2 En): prevê como o alvo reagirá a uma situação.
**Banda 3** — **Mente Aberta como Livro** (pré: Perfil + Antecipar a Pessoa, 3 En): lê alguém tão bem que prevê escolhas e descobre segredos.
**Banda 4** — **Conhecer de Relance** (pré: Mente Aberta como Livro, 4 En, +1 Vontade): num olhar, sabe quem é, o que quer e como agirá.
**Banda 5** — **Leitor de Almas** (pré: Conhecer de Relance, 5 En, +2 Vontade): compreende qualquer pessoa por completo num instante.

### ✦ MENTE SERENA  *(Raciocínio · âncora Ocultismo/Autocontrole — foco, transe, blindagem mental)*
**Banda 1** — **Calma** (raiz, passiva): grande bônus para manter o foco e resistir a distração e provocação. · **Foco** (pré: Calma, 1 En): concentra-se totalmente, ignorando ruído, dor e medo por uma ação. · **Centrar-se** (pré: Calma, 1 En): recupera a compostura após um susto.
**Banda 2** — **Mente Imperturbável** (pré: Calma, passiva): bônus para resistir a manipulação, medo e efeitos mentais. · **Transe** (pré: Centrar-se, 2 En): entra em meditação profunda (clareza, recuperação).
**Banda 3** — **Fortaleza Mental** (pré: Mente Imperturbável + Transe, 3 En): blindagem contra intrusões e domínios mentais (vs Fascinação/Marionete).
**Banda 4** — **Vazio Sereno** (pré: Fortaleza Mental, 4 En, +1 Vontade): mente intransponível; imune a quase toda influência mental e ilusão.
**Banda 5** — **Mente de Diamante** (pré: Vazio Sereno, 5 En, +2 Vontade): paz e clareza absolutas; nada perturba, engana ou domina a sua mente.

---

## D. Pendências
| # | Item | Status |
|---|---|---|
| 1 | ✅ Catálogo COMPLETO — 48 subcaminhos detalhados (Corpo, Voz, Mente) | ✔ |
| 2 | Sistema Arcano (feitiçaria) | 🚧 |
| 3 | Custos de XP por banda | 🔧 |
| 4 | Regras de combo/sinergia entre Técnicas ativas simultâneas | 🔧 |

---
*v0.9 — CATÁLOGO COMPLETO: 48 subcaminhos detalhados (Corpo, Voz, Mente). Convenções: ≥5 Técnicas (≥1/banda), sem teto; cruzamento livre entre atributos.*
