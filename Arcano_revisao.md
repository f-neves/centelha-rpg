# O Arcano (documento-base da revisão)

Este documento fecha o desenho da **feitiçaria** do Centelha: o que ela é no mundo,
como se organiza em Artes e Efeitos, e como cada peça funciona na mesa. Serve de base
para reescrever o capítulo XIV, criar o arquivo de dados dos Efeitos e ajustar
`regras.json` e o bestiário.

Referência de origem: os **Paths** do livro *Sorcerer* (magia linear, com efeitos
escritos por nível), adaptados à régua de 6 níveis do Centelha. O lore de apoio está
em `lore/Lore_Centelha.md`.

O que ainda depende de decisão está na seção **Pendências**, no fim, com a proposta
de partida de cada uma.

---

## 1. Vocabulário: uma palavra por conceito

| Palavra | O que é |
|---|---|
| **Arcano** | O campo e o capítulo. O fenômeno inteiro. |
| **Arte** | Cada linha comprável (Fogo, Cura, Sombra). É o Path do *Sorcerer*. |
| **Feitiçaria** | O ofício, a prática de quem estuda. É como o mundo fala. |
| **Feitiço** | Uma conjuração concreta, rápida. |
| **Efeito** | O resultado específico comprado dentro de uma Arte. |
| **Ritual** | O modo lento de conjurar (ver Pendência 3). |
| **Magia** | Palavra frouxa do povo: cobre item, criatura, milagre e feitiço. Não é termo técnico. |

---

## 2. O que a feitiçaria é

A **Proeza vem de dentro**: é o corpo, a voz e a mente do indivíduo levados além do que
a espécie alcança. O **Arcano vem de fora**: é o ambiente obedecendo a quem sabe pedir
na língua certa.

Todo ser vivo carrega um estilhaço da Primeira Luz. A Centelha é o que dá ao feiticeiro
autoridade sobre o ambiente, mas sozinha não faz nada: é ferramenta, não instrução. O que
transforma Centelha em fogo é o **conhecimento**, as técnicas e fórmulas que descrevem
como o mundo se dobra para produzir aquele efeito. O feiticeiro não impõe vontade ao
mundo; ele conhece o caminho pelo qual o mundo já pode ir, e o percorre.

Por isso a feitiçaria se aprende, se anota, se ensina e se rouba. E por isso ela pôde ser
**perdida**: quando o colapso queimou as bibliotecas e a supressão fez as sociedades
odiarem o estudo, o que se perdeu não foi a Centelha do mundo, foi a instrução. As Proezas
atravessaram o colapso porque moram no corpo de quem as tem. A magia quase morreu porque
morava em livros e em escolas.

Dois desdobramentos que valem para a mesa:

- **Grimório é tesouro.** Achar um livro da era perdida vale tanto quanto achar ouro,
  porque XP paga o treino, não o acesso.
- **A mesma coisa por caminhos diferentes.** O nevoeiro do colégio e o nevoeiro que a xamã
  aprendeu com a avó produzem a mesma neblina por fórmulas distintas, e nenhum dos dois
  está errado. É o payoff do "sem verdade única" do lore.

---

## 3. A estrutura: Arte, gabarito e Efeito

**A Arte dá o elemento em estado bruto**, no tamanho do nível. Fogo 1 acende e apaga uma
tocha, arremessa um dardo, põe fogo na arma por um instante, aquece o corpo no frio. Fogo 2
faz o mesmo em escala maior: fogueira pequena, dardo que queima por mais de um turno, fogo
na arma pela cena.

**O Efeito dá forma, nome e comportamento.** Muro, aura, neblina, arma conjurada, metal
incandescente, círculo de invocação.

> **Régua de corte:** se o efeito precisa de um substantivo próprio para ser descrito,
> é Efeito. "Fogo" é Arte. "Muro" é Efeito. Subir a Arte não substitui o Efeito, porque
> muro não é fogo maior: é fogo com forma.

Consequência desejada: **dois feiticeiros de Fogo 3 são personagens diferentes**, porque o
repertório de Efeitos de cada um conta onde ele estudou.

### O mesmo Efeito em Artes diferentes

O Efeito descreve **o resultado**; cada Arte que o comporta descreve **o sabor e o efeito
colateral**. Neblina por Água é nuvem densa que encharca e abafa som; por Gelo é nevoeiro
que morde de frio; por Terra é poeira que engasga.

Regras: se o feiticeiro já conhece o Efeito por uma Arte, **não paga XP de novo** para
usá-lo por outra, apenas treino. Mas precisa **ter cada Arte no nível do Efeito** para
usá-lo por ela.

---

## 4. Absorção: o que a armadura para

> **Teste de mesa:** se o golpe deixou matéria no mundo, a armadura conta. Se não sobra
> nada no chão, só a Centelha absorve.

Três casos:

1. **Fenômeno puro.** O elemento agindo como energia e se desfazendo no instante. Baforada
   de fogo, descarga de raio, o ataque de gelo com cara de lança que evapora ao acertar.
   Armadura não protege.
2. **Matéria conjurada.** A Arte fabricou um objeto real, que existe antes e depois do
   golpe e pode ser empunhado, largado ou entregue a outra pessoa. Trilhas normais, e o modo
   sai do formato: lança é Perfuração, marreta de pedra é Impacto.
3. **Matéria pré-existente.** A Arte moveu o que já estava lá: o cascalho do chão, a água do
   rio, a telha do teto. Trilhas normais.

**Conjurar matéria é uma escolha com dois lados.** Você fica absorvível e em troca ganha o
objeto de verdade: corta, esmaga ou perfura conforme a forma, pode ser passado a um aliado,
e abre efeitos secundários como sangramento.

Correção pendente no dado: `regras.json → arcano.resistencia.armadura` ainda diz que a
Absorção de armadura conta normalmente contra dano mágico. **Armaduras só protegem contra
dano físico.**

---

## 5. Mostradores

Cada Arte tem cinco mostradores, mas **nem sempre os mesmos cinco**. Os que não fazem
sentido são substituídos, e a substituição é fixa e escrita na Arte.

Base das Artes elementais, por nível 1 a 6:

| Mostrador | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Alcance | toque | 5 m | 20 m | 50 m | 150 m | 500 m |
| Área | 0,25 m² | 1 m² | 5 m² | 15 m² | 50 m² | 150 m² |
| Alvos | 1 | 2 | 4 | 10 | 20 | 50 |
| Dano | 1d6 por nível (ver seção 6) | | | | | |
| Duração | ver abaixo | | | | | |

**Duração corre em duas réguas.** Efeito agudo (dano, força bruta, controle direto) anda em
turnos e cenas. Efeito brando (aquecer o corpo, camuflagem, sorte, proteção) anda em minutos,
horas e dias. Quanto mais extremo o efeito, menor a escala de tempo.

Substituições por Arte (aprovado):

- **Cura** perde Área e ganha **Gravidade** (arranhão, ferimento sério, membro inutilizado,
  morte recente).
- **Fascinação e Ofuscação** trocam Potência por **Profundidade** (impulso, convicção,
  lealdade, memória) e Área por **Plateia** (quantos olhos são enganados de uma vez).
- **Adivinhação e Fortuna** trocam Alcance por **Distância no tempo** e Potência por
  **Nitidez**.
- **Conjuração e Espírito** trocam Potência por **Porte do que se chama** e Duração por
  **Firmeza do vínculo**.
- **Metamorfose** troca Área por **Quanto do corpo** e mantém Duração como o mostrador caro.
- **Natureza** mantém Área, que fica grande cedo (o efeito é sobre terreno), com Potência
  baixa em troca.

### Os mostradores dentro de um Efeito

Cada Efeito **traz os próprios mostradores escritos**, no espírito dos charms de Exalted, para
não sobrar dúvida na mesa. Nem todo Efeito usa os cinco: a Neblina, por exemplo, tem Alcance
(distância até onde ela nasce), Área e Duração, e não tem Dano nem Alvos.

Um Efeito **pode passar do gabarito do nível dele em um mostrador** quando fizer sentido: a
Neblina é nível 1 e mesmo assim cobre área maior que a de um efeito comum de nível 1. É
justamente isso que a torna um Efeito e não improviso.

Parâmetros secundários também vêm escritos no Efeito quando existirem: volume no lugar de
área, comprimento no lugar de área, dano diferente do básico, veneno, dano incapacitante,
penalidades impostas, visibilidade, dificuldade de travessia, e o que mais o Efeito exigir.

### 5.1. Quantos degraus o feiticeiro distribui (PROPOSTA, pendência 1)

Em *Sorcerer* isso sai de uma rolagem. Aqui não: o valor é fixo e conhecido antes de conjurar.

> **Pontos = nível da Arte + Atributo de conjuração.** Cada mostrador começa no degrau 1 e
> custa **1 ponto por degrau acima do primeiro**. Nenhum mostrador passa do **nível da Arte**
> (para isso existe o esticar, seções 6.5 e 6.6). O **Mana é o maior degrau usado**.

Divisão de trabalho: **Ocultismo acerta, Arte e Atributo modelam.** A rolagem continua sendo
Ocultismo + Atributo contra a resistência; os pontos só dizem que forma o feitiço tem.

Isso vale para o **efeito genérico da Arte** (o improviso: o dardo, acender, aquecer, empurrar).
O **Efeito comprado já vem com os mostradores impressos** e não se distribui nada nele.

Exemplos, com Fogo 3 e Inteligência 3 (6 pontos, teto 3 por mostrador):

- Dardo típico: alcance 3 (2 pontos, 20 m) e dano 3 (2 pontos, 3d6). Sobram 2 pontos para
  alvos 3 (quatro alvos) ou para duração.
- Fogueira que dura: área 3 (2), duração 3 (2), alcance 2 (1). Dano nenhum. Sobra 1.
- Tudo num alvo só: dano 3 (2) e o resto no chão, com alcance 1 (toque). Custa 3 de Mana pelo
  maior degrau usado.

Propriedades que caem bem: no nível 1 tudo custa zero, então magia pequena é trivial e não pede
conta; no topo, nem o mestre maximiza tudo (Arte 6 com Atributo 6 dá 12 pontos, e três
mostradores no 6 já custariam 15), então toda conjuração continua sendo uma escolha; e o
Atributo de cada Arte ganha um trabalho concreto, o que separa o feiticeiro de Inteligência do
de Influência ou de Vigor.

Alternativa considerada: trocar o Atributo por **Ocultismo** na conta dos pontos, o que combina
com a premissa de que feitiçaria é conhecimento. Descartada por ora porque concentraria tudo
numa perícia só e apagaria a variedade de Atributos entre as Artes.

---

## 6. Dano, empurrão e tempo

### Dano por Arte

| Arte | Dano | Absorção | Marca |
|---|---|---|---|
| Fogo | 1d6 por nível | só Centelha | queima continuada |
| Raio | 1d6 por nível | só Centelha | rápido e preciso |
| Terra | **2d6 por nível** | Impacto, normal | empurra; pedra grande dói mesmo |
| Água | 1d6 por nível, Impacto | Impacto, normal | empurra; a menos letal |
| Gelo | 1d6 por nível | depende: fenômeno não, matéria sim | prender e retardar |
| Ar | **sem dano direto** | n/a | empurrar, derrubar, desarmar, negar projéteis |
| Luz | 1d6 por nível, **agravado**, e **só** contra quem tem fraqueza | ignora resistência | cegar e revelar |
| Sombra | **sem dano direto**; os Efeitos dela ferem (Impacto que **ignora armadura**) | ignora armadura | esconder, agarrar, sufocar, amedrontar |

Referência para calibragem: as armas dão de 1 a 3 dados por peso mais o fixo da Força. Um
montante com Força 4 fica em 3d6+8. Um alvo de Vigor 4 e Centelha 3 absorve 7 de Impacto sem
armadura e 11 com placa completa, contra 3 de qualquer dano de energia.

### Empurrão

Terra, Água e Ar empurram. Proposta em discussão (ver Pendência 2):

> Metros = [valor de empurrão − (Força + Atletismo do alvo)] ÷ 4, mínimo zero. Empurrão de
> 3 metros ou mais também derruba. Havendo obstáculo duro no caminho, o alvo para nele e
> sofre 1d6 de Impacto a cada 3 metros que faltavam.

Valor de empurrão: **dano bruto** para Terra, **metade do dano bruto** para Água, **nível × 6**
para Ar, que não tem dano para usar de base.

### Tempo de conjuração

> Ticks = 4 + nível do Efeito + 1 para cada degrau que qualquer mostrador passa do nível dele.

A Neblina de nível 1 com área dois degraus acima gasta 4 + 1 + 2 = 7 Ticks. O mesmo número
que justifica o Efeito ser especial é o que ele paga em tempo. O feitiço genérico continua na
escada atual (5 Ticks nos níveis 1 a 3, 6 no 4, 7 nos 5 e 6): o genérico é o improviso
pequeno, o Efeito é a obra ensaiada.

**Isso é o desenho do Efeito**, o que vem impresso nele. Forçar além do impresso, na hora da
conjuração, é outra coisa: ver a seção seguinte.

---

## 6.5. Esticar o Efeito na hora (modo rápido)

Vale tanto para o efeito genérico da Arte quanto para um Efeito comprado. Cada degrau acima
do que você tem impresso **dobra o custo acumulado de Mana e soma outra vez o tempo base**.

> **Mana total = base × (2^(n+1) − 1)** · **Speed total = base × (n + 1)**, com n = degraus acima.

| Degraus | Mana | Speed |
|---|---|---|
| 0 | ×1 | ×1 |
| 1 | ×3 | ×2 |
| 2 | ×7 | ×3 |
| 3 | ×15 | ×4 |

Exemplos. Um feiticeiro com Gelo 2 arremessa o dardo de 2d6 por 2 de Mana e 5 de Speed. Para
3d6 paga 6 de Mana e 10 de Speed; para 4d6, 14 de Mana e 15 de Speed. Um Muro de Gelo de nível
2 (base 2 de Mana, Speed 6) sobe uma categoria de tamanho por 6 de Mana e 12 de Speed, e duas
categorias por 14 de Mana e 18 de Speed.

**Com isso dá para conjurar acima do próprio nível de Arte.** A regra antiga, que travava o
nível efetivo no nível da Arte, morre (pendência de reescrita em `regras.json → arcano.improviso`
e no capítulo).

O freio é a exponencial contra o tamanho da reserva. Mana é Centelha × 2 mais Vontade, ou seja,
cerca de 13 num feiticeiro de Centelha 3 e cerca de 24 no topo absoluto. Efeito pequeno estica
longe, efeito grande quase não estica: um Efeito de base 4 já custa 12 de Mana para subir um
único degrau. E esticar nunca compensa contra quem tem a Arte no nível: sair de Fogo 1 para um
dardo de 4d6 custa 15 de Mana e 20 de Speed, contra 4 de Mana e 6 de Speed de quem tem Fogo 4.

---

## 6.6. Esticar o Efeito com tempo (modo lento)

A segunda via: em vez de pagar a exponencial de Mana, o feiticeiro paga **tempo e Vontade**.
É o modo do Ritual.

> Cada degrau acima do impresso custa **+1 vez o Mana base** (linear), **1 de Força de Vontade**,
> e sobe um passo na escada de tempo.

**Escada de tempo:** Speed base em Ticks · 6 minutos · 60 minutos · 6 horas · 24 horas · 2 dias.

| Degraus | Mana | Vontade | Tempo (partindo de 6 Ticks) |
|---|---|---|---|
| 0 | ×1 | 0 | 6 Ticks |
| 1 | ×2 | 1 | 6 minutos |
| 2 | ×3 | 2 | 60 minutos |
| 3 | ×4 | 3 | 6 horas |
| 4 | ×5 | 4 | 24 horas |
| 5 | ×6 | 5 | 2 dias |

O tempo é o freio, e ele cresce muito mais rápido que o custo. Alguém com a Arte no nível 1
querendo o equivalente ao nível 5 fica **24 horas conjurando o mesmo efeito**, o que é
inviável na prática sem uma boa razão de história.

A escada acaba em 2 dias, então o **teto natural é +5 degraus**. O modo lento serve para o que
fica de pé (muro, neblina, arma encantada, círculo); ninguém prepara um dardo por dez minutos
para arremessar, então ele não invade o combate sozinho.

---

## 7. Custos

| Coisa | XP |
|---|---|
| Nível de Arte | 10 × nível (por degrau) |
| Efeito | 2 × nível |
| Subir um Efeito escalonável | a diferença: 2 × novo − 2 × antigo |
| Efeito já conhecido, usado por outra Arte sua | zero, só treino |

O nível do Efeito sai do **tamanho e da potência**: nuvem de poeira 1, tremor que derruba 2,
arma elemental que dura a cena 2, terremoto que abre a terra 4, onda que arrasta 4. Congelar
um volume de água pode ser qualquer nível, conforme o volume.

**Mana = nível do Efeito.** Só se compra Efeito até o nível que se tem na Arte. **Não há teto
de quantidade**: o limite é o XP que o jogador quer investir.

Efeito escalonável (vibração, tremor, terremoto; ou cura de corte pequeno, médio, grande,
amputação) não se compra duas vezes: ao alcançar o nível maior, paga só a diferença.

---

## 8. Dano agravado

Conceito novo, criado para o Luz e para o que vier depois.

> Dano agravado não é absorvido por nada, nem armadura nem Absorção natural, e não fecha com
> descanso nem com a perícia Cura. Só sara com tempo longo (semanas) ou com a Arte de Cura.
> Contra criaturas que ignoram ou reduzem dano comum, o agravado passa direto.

---

## 9. Fraquezas e resistências (bestiário)

Não é coisa comum: a maioria das criaturas não tem nenhuma. Mas o sobrenatural tem, e o
material de que a criatura é feita também manda.

- **Por natureza sobrenatural:** vampiro com sol, prata e fogo; lobisomem com prata; demônio
  com o sagrado; anjo com o profano.
- **Por material:** criatura de folha, madeira, palha ou gelo tem fraqueza a fogo; criatura de
  fogo ou de terra tem fraqueza a água; criatura de metal ou pedra tem resistência a fogo.

Campo novo no bestiário, a criar: `fraquezas` e `resistencias`, listas de palavras-chave
(`luz`, `sagrado`, `profano`, `fogo`, `agua`, `prata`, `sol`). O bestiário tem 308 criaturas,
das quais 32 são Corruptor e 15 Morto-vivo, ou seja, o alvo natural do Luz é cerca de 15% do
livro. Luz é Arte de especialista: contra o resto ela vale por cegar e revelar.

Falta definir o que fraqueza e resistência fazem **em número** para os outros elementos (o Luz
já está definido: agravado, ignora resistência). Ver Pendência 4.

---

## 10. Pendências

**1. Distribuição dos mostradores sem rolagem.** Em *Sorcerer* o feiticeiro paga 1 de Vontade,
rola, e distribui os sucessos entre dano, área, alcance e duração. Aqui não haverá rolagem para
isso: a quantidade de pontos a distribuir deve sair do **nível da Arte mais alguma coisa**,
provavelmente o **Atributo de conjuração**. Ver a proposta na seção 5.1.

**1b. Guardar um feitiço (parado).** Preparar um efeito e soltar depois é outra mecânica, a
desenhar noutro momento. Ideia levantada: "comitar" o feitiço impõe penalidade de 1d6 nos testes
de Raciocínio enquanto estiver guardado, e para efeitos passivos conta o Raciocínio como um nível
mais baixo.

**2. Empurrão.** A fórmula da seção 6 é proposta, não decisão. Discutir a divisão por 4, o
limiar de derrubada e o valor de empurrão do Ar.

**3. Rituais.** Hoje o capítulo define Ritual como o modo lento, fora de combate, com metade do
Mana e escala maior. Na conversa apareceu também o uso de "Ritual" para efeito duradouro ou
passivo (arma flamejante pela cena, vento que derruba flechas). São coisas diferentes e não
podem dividir o nome. Proposta de partida: **duração é só um mostrador**, então efeito
duradouro é Efeito com duração alta, e **Ritual volta a ser só o modo de conjurar** (lento,
fora de combate, metade do Mana, escala grande), com alguns Efeitos existindo apenas nesse
modo, como o círculo de invocação.

**4. Números de fraqueza e resistência.** Definir o efeito mecânico para os elementos que não
sejam Luz: fraqueza vira dano agravado, dano dobrado ou dado extra? Resistência reduz pela
metade, aplica Absorção onde não haveria, ou anula?

**5. Trilhas de ensino.** Serão **6 trilhas**, e o desenho está sendo feito pelo autor em outra
frente. Nada a decidir aqui; quando fechar, entra neste documento e no capítulo.

**6. Metal.** Arte elemental desenhada e **engavetada** por ora: mexe no equipamento próprio e
alheio (afia, enferruja, aquece a armadura no corpo, arranca a arma da mão, reduz Absorção),
com gancho forte na "magia de ofício" dos anões.

---

## 11. Próximos passos

1. Fechar as pendências 1 a 4.
2. Reescrever o capítulo XIV com a abertura para jogador iniciante (seções 2 a 4 deste
   documento em prosa).
3. Criar `src/data/efeitos.json` no mesmo formato das Artes, com os mostradores escritos por
   Efeito, e ligar na ficha e na página do Arcano.
4. Corrigir `regras.json`: armadura só protege contra dano físico; incluir dano agravado,
   empurrão e a fórmula de Ticks dos Efeitos.
5. Adicionar `fraquezas` e `resistencias` ao bestiário e preencher.
6. Escrever Luz e Sombra em `artes.json` (6 níveis cada, no formato atual).
