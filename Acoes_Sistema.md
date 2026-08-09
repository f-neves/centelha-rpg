# Ações & Sistema

> Documento de frente aberto em **2026-08-09**. Ainda **não existe capítulo no site**: este
> arquivo é o rascunho dele. Pendência **G1** no `Pendencias.md`.
>
> Modelo: o capítulo **Drama and Systems** (cap. 4) do Exalted 2ª edição, que pega as ações que
> todo mundo tenta fora do combate (subir num muro, nadar contra a corrente, cair de uma torre,
> beber o que não devia, disfarçar-se, rezar) e dá número a cada uma, em vez de deixar tudo por
> conta do improviso da mesa.

---

## 1. Por que o capítulo existe

Centelha já tem número para tudo que acontece **dentro** da luta: iniciativa, acerto, dano,
Absorção, Fôlego, as três Defesas. Fora dela o sistema fica mudo. O mestre que precisa dizer até
onde um personagem escala, quanto tempo leva para forjar uma espada ou o que acontece com quem
bebe veneno de cobra tem de inventar na hora, e o que ele inventa não conversa com o resto da
régua: uma Dificuldade 15 improvisada não sabe que 15 é "perito" na tabela oficial.

Este capítulo é o inverso do capítulo de Combate. Ele pega o repertório de ações cotidianas e
heroicas, e para cada uma diz três coisas:

1. **Qual é a jogada** (Atributo + Perícia), ou se não há jogada nenhuma.
2. **Contra o quê** (Dificuldade fixa, tabela, ou teste resistido).
3. **Quanto tempo custa** e o que sai de um sucesso, de uma falha e de uma falha crítica.

Nada aqui inventa subsistema novo. O objetivo é o oposto: **reduzir** o número de regras
especiais, ancorando cada ação na régua de Dificuldade que já existe.

## 2. O que já é lei e não se reescreve aqui

Estas frentes já estão fechadas em outro lugar. O capítulo de Ações **aponta** para elas e não
repete a regra:

| Assunto | Onde mora |
|---|---|
| Escala de Dificuldade (Fácil ×4/3, Média ×5/3, Difícil ×2) | `/mestre` · `regras.json → dificuldade` |
| Combate, iniciativa, ataques múltiplos, Velocidade | capítulo **Combate** |
| As três Defesas (Física, Social, Mental) | capítulo **Defesas** · `Defesas_revisao.md` |
| Fôlego e esforço extenuante | capítulo **Fôlego** |
| Ferimentos, sangramento, cura | capítulo **Vida, Ferimentos & Cura** |
| Relações, Intimidades e a régua social | `Relacoes.md` · `Regua_Relacao.md` · `Combate_Social.md` |
| Ataques mentais e resistência à imposição | `Ataques_Mentais.md` |
| Levantar peso, faixas de carga, velocidade com carga | motor · `regras.json → forca` |
| Deslocamento, arranque, corrida e os três saltos | motor · `regras.json → derivados.deslocamento` |
| Alcance livre, alcance máximo e penalidade por distância | `Arremesso.md` |
| Conjuração, Efeitos e ritualismo | `Arcano_revisao.md` · `Trilhas_Feiticaria.md` |

## 3. A régua comum

> Toda esta seção é **proposta**, não decisão. Marcada **[DECIDIR]** no `Pendencias.md`.

### 3.1 Os quatro modos de ação

Exalted separa ação simples, estendida, dramática e reflexa, e essa separação é o que faz o resto
do capítulo caber em pouca regra. A proposta é adotar o mesmo corte com nomes de Centelha:

| Modo | O que é | Como se resolve |
|---|---|---|
| **Direta** | uma tentativa, resultado imediato | uma jogada contra a Dificuldade |
| **Acumulada** | esforço repetido até juntar o bastante | soma sucessos ao longo de N tentativas, cada uma custando um intervalo de tempo |
| **Longa** | trabalho de horas, dias ou meses | **uma** jogada que representa o todo, com o tempo fixado de antemão |
| **Reflexa** | não consome a ação do turno | jogada avulsa, sem custo de Velocidade |

A diferença entre **Acumulada** e **Longa** é a que mais importa na mesa: forjar uma espada é
Longa (uma jogada, uma semana de trabalho), escavar um túnel é Acumulada (o grupo soma sucessos
por hora até chegar do outro lado, e pode desistir no meio).

### 3.2 Quando não se rola

Herança direta do Exalted e vale a pena importar: **se a Dificuldade é menor ou igual à metade do
pool, não se rola**. Um ferreiro veterano não erra uma dobradiça, e pedir jogada para isso só
gera falha absurda. A jogada volta a existir quando há pressa, perigo, plateia ou sabotagem.

### 3.3 O que custa Fôlego

O capítulo de Fôlego já cobra por golpe no combate. Fora dele, a proposta é cobrar Fôlego só de
**ação Acumulada de esforço físico** (escalar uma parede longa, remar contra a corrente, marcha
forçada), na mesma moeda: um ponto por intervalo, recuperando no respiro.

## 4. O catálogo

**Estado de cada linha:**
**`MOTOR`** a conta já existe no código e na ficha, falta a prosa ·
**`DOC`** existe num documento de frente, falta virar capítulo ·
**`ABERTO`** nada escrito ainda.

A coluna **Jogada** é **sugestão de partida**, não decisão fechada.

### 4.1 Corpo e movimento

| Ação | Jogada | Estado |
|---|---|:--:|
| Correr, perseguir, fugir | distância direta pelo Deslocamento (Arranque nos 3 primeiros Ticks, Corrida depois) | `MOTOR` |
| Saltar (vertical, horizontal parado, com corrida) | distância direta, sem jogada | `MOTOR` |
| **Arremessar um objeto** | distância direta pelo FAA · acerto é jogada à parte | `MOTOR` · §5.1 |
| Levantar o peso máximo | sem jogada: o FAH dá o teto | `MOTOR` |
| Deslocar-se carregando peso | velocidade × faixa de carga (Mínima, Leve, Média, Máxima) | `MOTOR` |
| **Escalar** | Força + Atletismo (esp. Escalada), Acumulada por trecho | `ABERTO` |
| **Nadar** | Vigor + Atletismo (esp. Natação), Acumulada contra a corrente | `ABERTO` |
| **Cair** | sem jogada de evitar: dano por altura, com Atletismo reduzindo | `ABERTO` |
| **Feito de força** (arrombar porta, dobrar grade, erguer portão) | Força + Atletismo ou Halterofilismo contra Dificuldade fixa | `ABERTO` |
| Equilibrar-se, atravessar viga, corda bamba | Destreza + Atletismo (esp. Equilíbrio) | `ABERTO` |
| Prender a respiração, apneia | Vigor + Resistência, Acumulada | `ABERTO` |
| Cavalgar, conduzir carroça, montaria em pânico | Destreza + Cavalgar | `ABERTO` |
| Marcha forçada, dias sem parar | Vigor + Resistência, uma jogada por dia | `ABERTO` |
| Acrobacia, rolamento, amortecer queda | Destreza + Atletismo (esp. Ginástica) | `ABERTO` |

### 4.2 Resistir

| Ação | Jogada | Estado |
|---|---|:--:|
| **Resistir a veneno** | Vigor + Resistência contra a potência do veneno, por dose e por intervalo | `ABERTO` |
| Resistir a doença | Vigor + Resistência, Acumulada ao longo de dias | `ABERTO` |
| **Resistir ao ambiente** (frio, calor, sede, fome, altitude) | Vigor + Resistência, Sobrevivência dá bônus de preparo | `ABERTO` |
| Sufocamento, afogamento, fumaça | Vigor + Resistência, agrava a cada intervalo | `ABERTO` |
| Resistir a medo, dominação e imposição | Defesa Mental · Vontade + Integridade | `DOC` |
| Aguentar dor, tortura, mutilação | Vontade + Integridade | `ABERTO` |
| Ficar acordado, privação de sono | Vigor + Resistência | `ABERTO` |
| Embriaguez, drogas, entorpecentes | Vigor + Resistência | `ABERTO` |

### 4.3 Sentidos e mente

| Ação | Jogada | Estado |
|---|---|:--:|
| Notar algo sem estar procurando | Percepção + Prontidão, passiva, o mestre rola | `ABERTO` |
| Vasculhar um cômodo, revistar um corpo | Percepção + Investigação, Acumulada por quarto de hora | `ABERTO` |
| Ver ao longe, no escuro, na neblina | Percepção + Prontidão com penalidade por condição | `ABERTO` |
| Rastrear pegada, farejar trilha | Percepção + Sobrevivência | `ABERTO` |
| Saber alguma coisa (lembrar, reconhecer) | Inteligência + Conhecimentos Gerais ou a secundária do assunto | `ABERTO` |
| Pesquisar em biblioteca ou arquivo | Inteligência + Conhecimentos Gerais, Longa (horas a dias) | `ABERTO` |
| **Ler motivações**, farejar mentira | Percepção + Empatia contra a Defesa Social do alvo | `DOC` |
| **Avaliar um item** (valor, autenticidade, procedência) | Inteligência + Comércio, ou o Ofício da peça, ou Heráldica/História para relíquia | `ABERTO` |
| Diagnosticar ferimento ou doença | Inteligência + Cura | `ABERTO` |
| Primeiros socorros, estancar sangramento | Raciocínio + Cura | parcial |
| Orientar-se, ler mapa, achar o caminho | Percepção + Sobrevivência ou Geografia | `ABERTO` |
| Decifrar código, língua morta, criptografia | Inteligência + Conhecimentos ou Ocultismo | `ABERTO` |

### 4.4 Furtividade, roubo e engano

| Ação | Jogada | Estado |
|---|---|:--:|
| **Esgueirar-se**, mover-se em silêncio | Destreza + Furtividade contra Percepção + Prontidão | `ABERTO` |
| Esconder-se, sumir de vista | Destreza + Furtividade (esp. Ocultação) | `ABERTO` |
| **Roubar** (bater carteira, cortar bolsa) | Destreza + Prestidigitação contra Prontidão | `ABERTO` |
| Arrombar fechadura, forçar cofre | Destreza + Abrir Fechaduras, Acumulada | `ABERTO` |
| Desarmar armadilha | Destreza + Ladinagem | `ABERTO` |
| **Disfarçar-se**, passar por outra pessoa | Influência + Manha (esp. Disfarce) contra Percepção + Prontidão; a **Aparência penaliza** o disfarce | `ABERTO` |
| Falsificar documento, selo, assinatura | Inteligência + Falsificação | `ABERTO` |
| Esconder objeto no corpo, contrabandear | Destreza + Contrabando contra revista | `ABERTO` |
| Trapacear no jogo | Destreza + Prestidigitação contra Prontidão dos outros jogadores | `ABERTO` |

### 4.5 Social

Quase tudo aqui já está desenhado em `Combate_Social.md`, `Relacoes.md` e `Regua_Relacao.md`. O
capítulo de Ações só recolhe o que **não** é troca social prolongada:

| Ação | Jogada | Estado |
|---|---|:--:|
| Persuadir, intimidar, seduzir, enganar | ataque social contra Defesa Social | `DOC` |
| Discursar para uma multidão | Influência + Oratória, alvo coletivo | `DOC` |
| Barganhar preço, fechar negócio | Influência + Negociação ou Comércio | `ABERTO` |
| Etiqueta na corte, não dar vexame | Compostura + Etiqueta | `ABERTO` |
| Apostar, ler a mesa | Perspicácia + Apostar | `ABERTO` |
| Interrogar, arrancar informação | Influência + Interrogatório contra Integridade | `ABERTO` |
| Acalmar ou intimidar um animal | Influência + Adestramento ou Veterinário | `ABERTO` |
| Espalhar boato, plantar rumor | Influência + Manha, Longa (dias) | `ABERTO` |

### 4.6 Ofício e mundo

O maior buraco do sistema hoje: **não existe regra de construir coisa nenhuma**. Um jogador com
Ferraria 5 não tem como saber quanto tempo leva para fazer uma espada nem o que sai dela.

| Ação | Jogada | Estado |
|---|---|:--:|
| **Construir / forjar / fabricar** um objeto | Inteligência + o Ofício, **Longa**: tempo e material fixados pela peça, uma jogada só; margem de sucesso define a qualidade | `ABERTO` |
| Reparar peça danificada | mesma jogada, Dificuldade menor, tempo menor | `ABERTO` |
| Improvisar com o que tem à mão | Raciocínio + Ofício, Dificuldade maior | `ABERTO` |
| Cozinhar, conservar comida | Inteligência + Culinária | `ABERTO` |
| Preparar remédio, extrair veneno | Inteligência + Herbologia ou Alquimia, Longa | `ABERTO` |
| Caçar, forragear, montar abrigo | Percepção + Sobrevivência, uma jogada por dia | `ABERTO` |
| Navegar embarcação | Percepção + Navegação | `ABERTO` |
| Administrar terra, tropa ou negócio | Inteligência + Burocracia, Longa (estação) | `ABERTO` |
| Construir obra grande (muro, ponte, casa) | Inteligência + Arquitetura ou Alvenaria, Acumulada em semanas, com mão de obra somando | `ABERTO` |

### 4.7 Fé e o sobrenatural

| Ação | Jogada | Estado |
|---|---|:--:|
| **Rezar**, atrair a atenção de um deus | Vontade + Religião, **Longa**; o que se ganha é atenção, não milagre garantido | `ABERTO` |
| Meditar, recolher-se, recuperar Vontade | Compostura + Meditação | parcial |
| Exorcizar, benzer, afastar espírito | Vontade + Religião ou Ocultismo | `ABERTO` |
| Ritual menor (bênção, praga, adivinhação) | Inteligência + Ritualismo, Longa | `DOC` |
| Reconhecer manifestação sobrenatural | Inteligência + Ocultismo | `ABERTO` |
| Interpretar presságio ou sonho | Perspicácia + Interpretação de Sonhos | `ABERTO` |

---

## 5. Fichas de ação preenchidas

### 5.1 Arremessar um objeto

**Estado: preenchida.** A conta já roda no motor e aparece na ficha, no bloco Força & Arremesso.
Esta seção é o **porquê** dela, que saiu da ficha em 2026-08-09 (lá ficou só a fórmula do FAA,
porque o jogador quer o número e o gráfico ao lado já mostra a forma da curva).

Arremessar tem **duas perguntas separadas**, e confundi-las é o erro clássico:

- **Até onde chega?** É o que esta ficha responde. Não tem jogada: sai de tabela.
- **Acerta o que mirou?** É ataque, resolvido no capítulo de Combate, com a penalidade por
  distância de `Arremesso.md` (alcance livre sem penalidade, e o que sobra até o máximo cortado
  em quatro faixas de −3 cada).

#### A Força de Arremesso

<p class="formula">FAA = (Força × 2) + Atletismo + Arremesso, de 2 a 24.</p>

Halterofilismo **não** entra na conta, mas entra pela porta dos fundos: o peso máximo que o
personagem ergue (o FAH) é a parede do arremesso, e quem ergue mais empurra a parede para longe.

Do FAA sai **R0**, o alcance extrapolado para massa zero, em metros:

<p class="formula">R0 = 136 × (FAA ÷ 24)<sup>0,69</sup></p>

Os 136 m são o recorde mundial do dardo. O expoente 0,69 foi ajustado contra sete marcas reais:
recorde do dardo, arremesso de peso mundial e nacional, disco de elite, pedra e bola de 1 kg
lançadas por pessoa comum, e beisebol amador.

#### Um quilo é o ápice, e a curva cai dos dois lados

Este é o ponto que surpreende quem lê a tabela pela primeira vez: **arremessar mais leve não
significa arremessar mais longe**. O alcance sobe conforme o objeto emagrece, até **1 kg**, e
dali para baixo desaba.

**De 1 kg para cima** manda a física do braço. Ao arremessar, o braço acelera o objeto **e a si
mesmo**, o que dá v(m) = v<sub>máx</sub> · √(m₀ ÷ (m + m₀)) e portanto alcance proporcional a
m₀ ÷ (m + m₀). Calibrando com arremesso de peso e dardo, a massa efetiva do braço m₀ dá **1 kg**,
que é justamente onde a curva vira. Multiplicando por um segundo fator, a parede da força:

<p class="formula">Alcance = R0 × [ m₀ ÷ (peso + m₀) ] × (1 − peso ÷ peso máximo)²</p>

O termo do meio é **técnica** e manda nos objetos leves; o último é **força** e manda nos
pesados. É o que faz o comando trocar sozinho entre Arremesso e Halterofilismo conforme o objeto
pesa, sem precisar de regra separada dizendo quando um substitui o outro.

**Abaixo de 1 kg** manda o ar. Falta massa para carregar o impulso contra o vento, e a distância
não desaba devagar: desaba rápido.

<p class="formula">Alcance = (alcance de 1 kg) × (3p² − 2p³), com p o peso em quilos</p>

Meio quilo vai à metade, cem gramas a menos de 3%, e uma moeda praticamente não sai da mão.

#### Parado, girando e correndo

Correr antes de soltar acrescenta até **+1/3**. Girar no lugar, até **+1/6**, metade do ganho da
corrida. Nenhum dos dois é bônus fixo: os dois são multiplicados pela **velocidade que o
personagem alcança carregando aquele objeto**, então encolhem junto com o peso, e as três curvas
se fundem numa só no peso máximo, sem degrau nenhum no caminho.

<p class="formula">Girando = Parado × (1 + v ÷ 6) · Correndo = Parado × (1 + v ÷ 3), com v a fração da velocidade máxima na carga</p>

#### As quatro faixas de carga

Saem do peso máximo P e cada uma dobra a anterior. A velocidade é
(1 − (peso ÷ P)<sup>1,5</sup>)², forma ajustada contra medições de sprint com colete e de marcha
com mochila: o primeiro décimo do peso máximo quase não custa nada, e o estrago acelera depois.

| Faixa | Até | Velocidade | Na prática |
|---|:--:|:--:|---|
| Mínima | P ÷ 8 | ~91% | corre quase igual |
| Leve | P ÷ 4 | ~77% | corre sentindo o peso |
| Média | P ÷ 2 | ~42% | não corre mais, anda rápido |
| Máxima | P | 0% | ergue, mas não sai do lugar |

#### O que falta nesta ficha

- **Arremessar gente e criaturas.** A curva vale para objeto compacto. Um corpo de 70 kg tem
  outra aerodinâmica e outra pegada.
- **Objeto mal balanceado.** Uma cadeira e uma pedra de 5 kg não voam igual, e hoje voam.
- **Arremesso para cima e para baixo.** De um muro, ou contra um muro.
- **Arremessar dois de uma vez**, e como isso conversa com a regra de ataques múltiplos.

---

## 6. Pendências deste documento

1. **[DECIDIR]** Os quatro modos de ação (§3.1) e os nomes deles.
2. **[DECIDIR]** A regra de não rolar quando Dificuldade ≤ metade do pool (§3.2).
3. **[FAZER]** Preencher as fichas na ordem: **Escalada**, **Queda**, **Veneno**, **Ambiente**,
   **Esgueirar-se**, **Construir/forjar**. São as seis mais pedidas em mesa e as que hoje o
   mestre inventa do zero toda vez.
4. **[FAZER]** Decidir se isto vira **um** capítulo ou se cada família entra no capítulo que já
   existe (movimento em Combate, resistir em Vida & Ferimentos, social em Relações). A aposta
   atual é capítulo único, porque a régua comum da §3 precisa de um lugar só.
5. **[FAZER]** Quando fechar, virar `src/content/chapters/acoes-e-sistema.md` e provavelmente
   `regras.json → acoes` para as tabelas que o motor precisar ler.
