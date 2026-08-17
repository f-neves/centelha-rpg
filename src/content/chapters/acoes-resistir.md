---
ordem: 12
numeral: "VIII"
titulo: "Resistir"
resumo: "Veneno, doença, ambiente, sufocamento e sono. Cinco relógios diferentes, e uma moeda só para os cinco: o Desgaste."
---

<p class="muted">Parte do capítulo <strong>Ações & Sistema</strong>. Os cinco modos de ação, de onde sai a Dificuldade, o que a Margem mede e as regras de ajuda estão em <a href="/regras/acoes-e-sistema">A Régua Comum</a>, e valem para tudo o que vem aqui.</p>

Cinco coisas tentam derrubar um corpo ao longo do tempo: veneno, doença, ambiente, falta de ar e falta de sono. As cinco têm relógios próprios, e duas delas nem rolam dado. O que elas compartilham é a moeda.

## Desgaste, a moeda comum

<p class="formula"><b>Desgaste</b>: cada degrau é <b>−1d6</b> em todas as jogadas</p>

| Desgaste | 1 | 2 | 3 | 4 |
|---|:--:|:--:|:--:|:--:|
| **Penalidade** | −1d6 | −2d6 | −3d6 | −4d6, e é o teto |

O pool **nunca desce abaixo de 1d6**, e o +2 da soma ímpar continua valendo: mesmo arrasado, o personagem ainda joga alguma coisa.

**Os degraus de condições diferentes somam, e a soma para em 4.** O náufrago com frio, sede e sono não morre de aritmética. **O que mata é o relógio próprio de cada condição**, nunca o Desgaste: o sufocamento tem a asfixia, a doença tem o estágio Terminal, o veneno tem a dose letal. O Desgaste é o preço de estar aguentando, não a forma de morrer.

**Recuperação padrão:** um degrau por noite de sono com abrigo, comida e água.

A perícia das três que rolam é **Resistência**, e ela é de Vigor puro.

## Veneno

**Modo** · Direta, **uma jogada por dose**. Cada dose é um evento fechado.

**Jogada** · Vigor + Resistência contra a **Potência** do veneno. **Todo dano de veneno ignora a Absorção**, natural e de armadura: peçonha não se para com aço.

| Resultado | O que acontece |
|---|---|
| Passa por **uma Margem** ou mais | nada, o corpo dá conta |
| Passa | **metade** do efeito da dose, arredondando para cima |
| Falha | o efeito **inteiro** |
| Falha por **uma Margem** ou mais | o efeito inteiro **e uma dose a mais** do que o veneno previa |

**Cada veneno declara o que faz**, e é essa linha que dá sabor à família.

| Veneno | Potência | Início | Doses | Efeito por dose |
|---|:--:|---|---|---|
| Bebida forte do senhor local | 5 | 10 min | 1 por copo | Desgaste 1 |
| Cicuta | 10 | minuto | 3, uma por hora | −1 Vigor |
| Peçonha de víbora | 14 | minuto | 3, uma por hora | 8 PV |
| Curare | 14 | Tick | 1 | −3 Destreza por uma cena |
| Peçonha de aranha gigante | 18 | Tick | 2, uma por minuto | −2 Destreza e Desgaste 1 |
| Hálito de basilisco | 22 | minuto | 4, uma por minuto | 12 PV |

**Atributo derrubado volta a um ponto por dia de descanso.** Um Atributo em **zero** incapacita naquele eixo, e o que isso significa depende de qual é: Vigor 0 é o corpo desligando, Destreza 0 é paralisia, Inteligência 0 é delírio. É por aqui que o veneno mata, sem precisar de regra de morte própria.

**Tratar** é Inteligência + Cura contra a Potência, uma vez por dose pendente. Passando, cancela as doses que faltam; com uma Margem, cancela e devolve um ponto de Atributo.

**Circunstância** · sangrar a ferida no primeiro Tick **−2** · dose dobrada ou direto no sangue **+4** · antídoto específico em mãos dá **+4** à jogada de tratar.

## Doença

**Modo** · Direta repetida por intervalo. O que ela move não é Acúmulo, é **estágio**: uma doença não tem uma barra que enche, tem um estado em que o doente está hoje.

**Jogada** · Vigor + Resistência contra a **Virulência**, uma por intervalo.

| Estágio | Desgaste | Como está |
|---|:--:|---|
| **Incubação** | 0 | não parece nada ainda |
| **Instalada** | 1 | febre, tosse, fraqueza declarada |
| **Grave** | 2 | de cama, não viaja, não luta |
| **Terminal** | 3 | delírio e queda |
| **Morte** | | falhar por uma Margem estando em Terminal |

| Resultado da jogada | O doente |
|---|---|
| Passa | **desce** um estágio; em Incubação, cura |
| Falha por menos de 6 | **segura** onde está |
| Falha por 6 ou mais | **sobe** um estágio |

| Doença | Virulência | Intervalo |
|---|:--:|---|
| Resfriado forte, indisposição | 4 | dia |
| Disenteria de acampamento | 7 | dia |
| Definhamento, o mal que consome devagar | 8 | **semana** |
| Febre dos pântanos | 10 | dia |
| Peste | 14 | dia |
| Praga arcana | 18 | **hora** |

Estes números foram calibrados contra o **camponês** (Vigor 2, Resistência 1), e não contra o aventureiro, porque doença é o que acontece com todo mundo. O resultado sai onde deveria sair: o camponês nunca piora de uma disenteria e sara em cerca de seis dias; a febre dos pântanos ele **não vence sozinho**; a peste o mata em quatro dias.

**Circunstância**, e aqui ela é o coração da regra:

| | Virulência |
|---|:--:|
| De cama, aquecido, sem trabalhar | **−2** |
| Um curandeiro cuidando todo dia | **−2** |
| Casa de cura, ordem, hospital de guerra | **−4** no total |
| Viajando doente, passando fome, em campanha | **+2** |

<div class="callout regra"><span class="lbl">Regra</span>É isso que faz "põe ele na cama" ser um ato mecânico e não um floreio. A febre dos pântanos que o camponês não vence de jeito nenhum vira Virulência 6 com cama e cuidado, e ele desce um estágio a cada três dias. <b>Doença não é vencida pela ficha do doente, é vencida por quem cuida dele.</b></div>

**Ajuda** · o curandeiro que quiser mais do que a circunstância rola Inteligência + Cura contra a Virulência e apoia pela [tabela geral de apoio](/regras/acoes-e-sistema). O −2 vale para até três doentes, e some acima disso.

**Contágio** · quem convive com um doente Instalado ou pior rola uma vez por dia contra metade da Virulência.

## Ambiente

**Modo** · Direta repetida. **Jogada** · Vigor + Resistência contra a **Severidade**, uma por intervalo. Falhando, **+1 Desgaste**. Passando, nada. Passando por uma Margem, nada e **o intervalo seguinte não se rola**: o corpo achou o ritmo.

<p class="formula">Agasalho e abrigo não mudam a Severidade: sobem o <b>intervalo</b> um degrau</p>

É o efeito real de um casaco. Não é que você aguente melhor o frio, é que ele deixa de ser testado a toda hora.

| Ambiente | Intervalo | Severidade |
|---|---|:--:|
| Frio ou calor incômodo, chuva fria | **dia** | 5 |
| Frio cortante, calor de deserto, roupa encharcada | **hora** | 5 |
| Nevasca, sol do meio-dia sem sombra | **hora** | 10 |
| Frio de montanha alta, água gelada, casa em chamas | **minuto** | 10 |
| Lava por perto, ventania de inverno no pico | **minuto** | 15 |

Sede e fome rodam no mesmo motor, com a Severidade subindo sozinha:

| | Começa | Severidade |
|---|---|---|
| **Sede** | no 2º dia sem beber | 10, **+5 por dia** |
| **Fome** | no 4º dia sem comer | 5, **+1 por dia** |

A sede aperta rápido e a fome aperta devagar, que é como funciona. Beber ou comer para o relógio na hora; o Desgaste já ganho sai pela recuperação normal.

**Ajuda**, e é onde a família tem duas camadas:

<p class="formula"><b>Sobrevivência evita</b> · <b>Resistência aguenta</b></p>

Uma jogada de Percepção ou Inteligência + **Sobrevivência** contra a Severidade, uma por dia, resolve o abrigo, o fogo, a água e a leitura do tempo para o grupo inteiro. Passando, **todos** sobem um degrau de intervalo; com uma Margem, o dia não se rola. É a jogada que o batedor faz e que salva quem não tem Vigor.

## Sufocamento

**Modo** · nenhum. É um **relógio**, e não se rola: todo mundo apaga sem ar, a única pergunta é quando.

<p class="formula">Ticks de ar = (Vigor + Resistência) × 10</p>

Um Tick é cerca de um segundo, então a conta se lê direto: a pessoa comum segura trinta segundos, o aventureiro setenta, o mergulhador de pérolas dois minutos.

| Situação | Ticks |
|---|---|
| Encheu o peito antes | cheio |
| **Pego de surpresa**, sem tempo de respirar | **metade** |
| **Em esforço**: nadando, lutando, subindo | **metade** |
| As duas coisas | **um quarto** |

No **último quarto** dos Ticks, +1 Desgaste: o corpo começa a gritar por ar antes de desligar, e esse é o aviso.

Quando os Ticks acabam, **o personagem apaga na hora**. Não há queda gradual nem jogada de resistir: a hipóxia derruba. E aí começa o segundo relógio.

<p class="formula">Janela de socorro = <b>Vigor × 20</b> Ticks, e depois disso morre</p>

Vigor 3 dá um minuto para tirar da água, virar de lado e fazer voltar a respirar. Reanimar é Raciocínio + Cura contra Dificuldade 10, uma jogada por Tick, e cada jogada custa a ação de quem socorre. Quem volta acorda com **Desgaste 2**, que sai em dois dias e não em um: quase se afogar cobra.

Vale igual para afogamento, estrangulamento, soterramento, fumaça e vácuo. A fumaça acrescenta o dano dela por Tick; o soterramento acrescenta o peso, que é [Feito de força](/regras/acoes-corpo-e-movimento).

## Sono

**Modo** · Passiva. Não se rola nada: a dívida chega sozinha.

| Noites sem dormir | Desgaste |
|:--:|:--:|
| 1 | 0 |
| 2 | 1 |
| 3 | 2 |
| 4 | 3 |
| 5 ou mais | 4 |

**Vigor + Resistência 8 ou mais desloca a tabela uma linha**: quem é feito de couro ganha a segunda noite de graça.

Em **Desgaste 4 por sono**, o personagem **apaga sozinho** assim que a adrenalina baixa. Não é uma jogada, não é uma escolha: acabou a cena de perigo, ele dorme onde estiver.

**Recuperar** · uma noite completa tira **um** degrau, doze horas tiram **dois**. A dívida de cinco noites custa três noites para pagar, e é isso que faz uma vigília longa ter preço depois que a crise passa. Cochilo não conta, e turnos de vigia também não: quem passou três horas de guarda dormiu, quem passou a noite inteira não dormiu.

**Não existe Centelha que compre noites.** Quem atravessa semanas sem dormir faz isso por Proeza ou Arte.

## As que ainda não têm ficha

- **Dor e tortura.** Aguentar o que fazem com o corpo para arrancar alguma coisa de você. Direta, Vontade + Integridade.
- **Bebida e entorpecente.** Roda no motor de Veneno, com Potência baixa e efeito quase sempre em Desgaste.
- **Medo, dominação e imposição** são [Defesa Mental](/regras/defesas), não Resistência.

---
