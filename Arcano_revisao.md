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

## 5. Parâmetros

Cada Arte tem cinco parâmetros, mas **nem sempre os mesmos cinco**. Os que não fazem
sentido são substituídos, e a substituição é fixa e escrita na Arte.

**Todo parâmetro começa no grau 0, que é grátis**: alcance de toque, área de um alvo médio
(0,25 m²), um alvo, duração instantânea e dano nenhum. Comprar o grau 1 é que tira o efeito
do mínimo.

| Parâmetro | 0 (grátis) | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Alcance | toque | 5 m | 20 m | 50 m | 150 m | 500 m | 1,5 km |
| Área | um alvo · 0,25 m² | 1 m² | 5 m² | 15 m² | 50 m² | 150 m² | 500 m² |
| Alvos | 1 | 2 | 4 | 10 | 20 | 50 | 150 |
| Dano | nenhum | 1d6 | 2d6 | 3d6 | 4d6 | 5d6 | 6d6 |
| Duração aguda | instantâneo | 1 turno | 3 turnos | 1 cena | 10 min | 1 hora | 6 horas |
| Duração branda | instantâneo | 1 cena | 1 hora | 6 horas | 1 dia | 1 semana | 1 mês |

Passo médio: cerca de ×3 em alcance, ×3,5 em área, ×2,3 em alvos, e linear no dano. Terra dobra
o dado, então cada grau de dano dela vale 2d6.

**Duração corre em duas réguas.** A aguda vale para dano, força bruta e controle direto. A branda
vale para proteção, camuflagem, aquecer o corpo, sorte. Quanto mais extremo o efeito, menor a
escala de tempo.

> **Nota:** as Proezas têm parâmetros próprios em `regras.json` (alcance 3, 5, 8, 20, 50, 150 m;
> alvos 1, 2, 3, 10, 50, 300+; duração 1 ação, 1 turno, 1 cena, várias cenas, horas, 1 dia ou
> mais), com escalas diferentes destas **de propósito**: a Proeza é o corpo, o Arcano é o
> ambiente.

Substituições por Arte (aprovado):

- **Cura** perde Área e ganha **Gravidade** (arranhão, ferimento sério, membro inutilizado,
  morte recente).
- **Fascinação e Ofuscação** trocam Potência por **Profundidade** (impulso, convicção,
  lealdade, memória) e Área por **Plateia** (quantos olhos são enganados de uma vez).
- **Adivinhação e Fortuna** trocam Alcance por **Distância no tempo** e Potência por
  **Nitidez**.
- **Conjuração e Espírito** trocam Potência por **Porte do que se chama** e Duração por
  **Firmeza do vínculo**.
- **Metamorfose** troca Área por **Quanto do corpo** e mantém Duração como o parâmetro caro.
- **Natureza** mantém Área, que fica grande cedo (o efeito é sobre terreno), com Potência
  baixa em troca.

### Os parâmetros dentro de um Efeito

Cada Efeito **traz os próprios parâmetros escritos**, no espírito dos charms de Exalted, para
não sobrar dúvida na mesa. Nem todo Efeito usa os cinco: a Neblina, por exemplo, tem Alcance
(distância até onde ela nasce), Área e Duração, e não tem Dano nem Alvos.

Um Efeito **pode passar do gabarito do nível dele em um parâmetro** quando fizer sentido: a
Neblina é nível 1 e mesmo assim cobre área maior que a de um efeito comum de nível 1. É
justamente isso que a torna um Efeito e não improviso.

Parâmetros secundários também vêm escritos no Efeito quando existirem: volume no lugar de
área, comprimento no lugar de área, dano diferente do básico, veneno, dano incapacitante,
penalidades impostas, visibilidade, dificuldade de travessia, e o que mais o Efeito exigir.

### 5.1. Quantos degraus o feiticeiro distribui

Em *Sorcerer* isso sai de uma rolagem de sucessos. Aqui não: o valor é fixo e conhecido antes
de conjurar.

> **Pontos = (nível da Arte × 2) + Centelha.** Cada parâmetro começa no grau 0, que é grátis, e
> custa **1 ponto por grau**, linear. Nenhum parâmetro passa do **nível da Arte** (para isso
> existe o esticar, seções 6.5 e 6.6). O **Mana é o maior grau usado**.

Divisão de trabalho: **Ocultismo acerta, Arte e Centelha modelam.** A rolagem continua sendo
Ocultismo + Atributo contra a resistência; os pontos só dizem que forma o feitiço tem.

Vale para o **efeito genérico da Arte** (o improviso: o dardo, acender, aquecer, empurrar). O
**Efeito comprado já vem com os parâmetros impressos** e não se distribui nada nele.

| Feiticeiro | Pontos | Teto | Exemplos de alocação |
|---|---|---|---|
| Fogo 1, Centelha 1 | 3 | 1 | 1d6 a 5 m; ou 1d6 em dois alvos, por toque |
| Fogo 3, Centelha 3 | 9 | 3 | 3d6 a 50 m num alvo; ou 3d6 a 20 m em quatro alvos |
| Fogo 6, Centelha 3 | 15 | 6 | 6d6 a 500 m; ou 4d6 a 150 m por uma cena |
| Fogo 6, Centelha 6 | 18 | 6 | 6d6 a 500 m em quatro alvos |
| Fogo 1, Centelha 6 | 8 | 1 | nada além do grau 1: sobra ponto sem onde gastar |

Propriedades que sustentam a escolha da fórmula: o grau 0 é grátis, então magia pequena não pede
conta nenhuma na mesa; a proporção entre pontos e teto fica estável em toda a escala (dá para
levar ao máximo cerca de três dos cinco parâmetros, tanto no nível 1 quanto no 6), então
conjurar continua sendo escolha até o fim; e o peso duplo da Arte evita o caso em que Arte baixa
com Atributo alto rende mais que Arte alta com Atributo baixo.

Descartadas: **Arte + Atributo** (favorecia Arte baixa com Atributo alto) e **Arte + Ocultismo**
(concentraria tudo numa perícia só e apagaria a variedade de Atributos entre as Artes).

**Consequência editorial:** os seis níveis escritos de cada Arte em `artes.json` deixam de ser a
regra e passam a ser **exemplo de alocação típica** daquele patamar. Hoje aqueles textos sugerem
que o nível 3 entrega alcance, área e dano de nível 3 ao mesmo tempo, e com esta conta não
entrega.

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

> Ticks = 4 + nível do Efeito + 1 para cada degrau que qualquer parâmetro passa do nível dele.

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

> **Para retomar:** esta seção é o ponto de partida de qualquer próxima conversa sobre o Arcano.
> Tudo o que está acima dela já foi decidido e já está no site e em `regras.json`. O que está
> aqui, não. A lista curta que aparece no fim do capítulo XV (`/artes`, bloco "Em revisão") é um
> resumo desta seção.

**1. Guardar um feitiço: o que falta.** A regra base **já está fechada e no site**: o Mana é pago
na hora, o feitiço fica comitado, e enquanto isso o Raciocínio conta um nível abaixo nos valores
calculados e dá −1d6 nas rolagens; soltar ou desfazer devolve na hora. Falta decidir: **a
penalidade acumula** por feitiço guardado (dois feitiços, Raciocínio dois níveis abaixo)? Há
**teto** de quantos dá para carregar? E o feitiço guardado **vence** com o tempo?

**2. Empurrão.** A fórmula da seção 6 é proposta, não decisão. Discutir a divisão por 4, o
limiar de derrubada e o valor de empurrão do Ar. **Direção travada:** a resistência do alvo sai
da **Força** somada ao **maior entre Equilíbrio e Atletismo** (Equilíbrio é secundária, do grupo
Corpo). Falta o **peso**, que existe em toda criatura mas ainda não é um valor da ficha: decidir
se ele sai do porte, se vira traço próprio, ou se entra por outra via.

**3. Rituais.** Encaminhado pela seção 6.6: **Ritual é o modo lento de conjurar**, que troca
Mana por tempo e Vontade. Efeito duradouro não é Ritual, é Efeito com duração alta, porque
duração é só um parâmetro. Falta decidir duas coisas: se a regra antiga de "metade do Mana no
Ritual" morre de vez (a proposta atual já é mais generosa que ela) e se algum Efeito só existe
no modo lento, como o círculo de invocação.

**3b. Duas escalas de parâmetros no sistema.** RESOLVIDO: as escalas das Proezas e as do Arcano
**são diferentes de propósito**. A Proeza é o corpo, o Arcano é o ambiente, e cada um tem o seu
alcance natural. Nada a unificar.

**4. Resistência: o número.** A **fraqueza já está fechada e no site** (ignora toda a Absorção,
o dano é agravado, e aparar de mãos nuas fere quem apara). Falta o outro lado: **o que a
resistência faz**? Corta o dano pela metade, aplica Absorção onde não haveria, ou anula de vez? E
ela também protege do agravado? Proposta de partida: **metade do dano e nunca agravado**.
Enquanto isso não fechar, não dá para preencher o bestiário, porque o campo não teria significado.

**4b. Preencher o bestiário.** Depende da 4. Criar `fraquezas` e `resistencias` na criatura, como
listas de palavras-chave (`luz`, `sagrado`, `profano`, `fogo`, `agua`, `prata`, `sol`). O
preenchimento inicial sai por regra (Morto-vivo e Corruptor recebem `luz` e `sagrado`; Planta
recebe `fogo`; Elemental e Construto saem pelo material) e depois se curam as exceções à mão. Para
dimensionar: das 308 criaturas, 32 são Corruptor e 15 Morto-vivo, ou seja, o alvo natural do Luz é
cerca de 15% do bestiário.

**5. Rolagem das Artes.** Está sendo desenhado na frente das Trilhas, não aqui, mas afeta este
documento: a conjuração deixa de ser Ocultismo para todos e passa a variar por **Tradição**, e há
uma perícia nova, **Acerto Arcano**, para os efeitos mirados. Quando fechar, as seções 3 e 4 daqui
precisam de revisão, porque hoje dizem "Ocultismo + Atributo".

**6. Trilhas de ensino.** Serão **6 Tradições**, já escritas no capítulo XIV. O que falta é o mapa
**Arte × Trilha** e os números de treino. Frente própria, não se decide aqui.

**7. Metal.** Arte elemental desenhada e **engavetada** por ora: mexe no equipamento próprio e
alheio (afia, enferruja, aquece a armadura no corpo, arranca a arma da mão, reduz Absorção),
com gancho forte na "magia de ofício" dos anões. É só retomar o desenho quando quiser.

**8. Peso, para o empurrão.** Não existe como valor de ficha. Sugestão registrada: tirar do
**porte** (a tabela em `regras.json` já escala PV e multiplicador de Vigor de minúsculo a
colossal), e deixar ajuste manual para quem quiser destacar (o anão baixo e denso, o elfo leve).

---

## 11. Próximos passos

**Feito** (tudo já no site e commitado)

- `regras.json → arcano`: armadura só contra dano físico; graus 0 a 6 dos parâmetros; pontos de
  distribuição; esticar rápido e lento; bloco `efeitos` (XP, upgrade, Ticks); `guardar`;
  `fraquezas`; Ritual redefinido como o modo lento.
- Capítulo XV (`/artes`): tabelas de parâmetros, pontos, esticar rápido e lento, guardar feitiço e
  fraqueza, todas puxadas de `regras.json`, mais o bloco "Em revisão".
- `artes.json`: **Luz** e **Sombra** como elementais (23 Artes, 8 elementais) e **exemplos por
  nível** em todas elas (283 exemplos), num campo `exemplos` novo e opcional.
- "Mostradores" virou **Parâmetros** em todo o sistema, e as escalas de Proeza e Arcano ficam
  diferentes de propósito.

**A fazer**

1. Fechar as pendências da seção 10.
2. Reescrever a abertura do capítulo para jogador iniciante (seções 2 a 4 deste documento em
   prosa). O capítulo XIV já tem "Os muitos nomes" e as Trilhas; falta o "o que é a feitiçaria"
   escrito para quem nunca jogou.
3. Criar `src/data/efeitos.json` no formato das Artes, com os parâmetros escritos por Efeito, e
   ligar na ficha e na página das Artes. É o maior item que sobrou: hoje o Efeito existe como
   regra, mas não há nenhum Efeito escrito.
4. Incluir em `regras.json` a regra de empurrão e a de dano agravado como bloco próprio, quando
   fecharem.
5. Preencher `fraquezas` e `resistencias` no bestiário (depende da pendência 4).
6. Revisar as seções 3 e 4 deste documento quando a rolagem por Tradição fechar.
