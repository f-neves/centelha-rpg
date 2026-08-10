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

> **Mana total = base × (2^(n+1) − 1)** · **Velocidade total = base × (n + 1)**, com n = degraus acima.

| Degraus | Mana | Velocidade |
|---|---|---|
| 0 | ×1 | ×1 |
| 1 | ×3 | ×2 |
| 2 | ×7 | ×3 |
| 3 | ×15 | ×4 |

Exemplos. Um feiticeiro com Gelo 2 arremessa o dardo de 2d6 por 2 de Mana e 5 de Velocidade. Para
3d6 paga 6 de Mana e 10 de Velocidade; para 4d6, 14 de Mana e 15 de Velocidade. Um Muro de Gelo de nível
2 (base 2 de Mana, Velocidade 6) sobe uma categoria de tamanho por 6 de Mana e 12 de Velocidade, e duas
categorias por 14 de Mana e 18 de Velocidade.

**Com isso dá para conjurar acima do próprio nível de Arte.** A regra antiga, que travava o
nível efetivo no nível da Arte, morre (pendência de reescrita em `regras.json → arcano.improviso`
e no capítulo).

O freio é a exponencial contra o tamanho da reserva. Mana é Centelha × 2 mais Vontade, ou seja,
cerca de 13 num feiticeiro de Centelha 3 e cerca de 24 no topo absoluto. Efeito pequeno estica
longe, efeito grande quase não estica: um Efeito de base 4 já custa 12 de Mana para subir um
único degrau. E esticar nunca compensa contra quem tem a Arte no nível: sair de Fogo 1 para um
dardo de 4d6 custa 15 de Mana e 20 de Velocidade, contra 4 de Mana e 6 de Velocidade de quem tem Fogo 4.

---

## 6.6. Esticar o Efeito com tempo (modo lento)

A segunda via: em vez de pagar a exponencial de Mana, o feiticeiro paga **tempo e Vontade**.
É o modo do Ritual.

> Cada degrau acima do impresso custa **+1 vez o Mana base** (linear), **1 de Força de Vontade**,
> e sobe um passo na escada de tempo.

**Escada de tempo:** Velocidade base em Ticks · 6 minutos · 60 minutos · 6 horas · 24 horas · 2 dias.

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

**FEITO em 2026-08-10.** Os campos `fraquezas` e `resistencias` existem, como listas de
palavras-chave, e já aparecem no bloco do bestiário. Moram em **`src/data/elementos-bestiario.json`**,
o sétimo satélite (`inimigos.json` é gerado e não podia guardá-los), semeado por
`scripts/gen-elementos.mjs` e embutido no `monsters.json` pelo `gen-monsters.mjs`.

O vocabulário ficou **fechado em 15 palavras**, e o validador falha o build em qualquer palavra
fora dele: `fogo` `agua` `gelo` `raio` `vento` `terra` `luz` `sombra` (elementos) · `corte`
`perfuracao` `impacto` (dano físico) · `sagrado` `profano` `prata` `sol` (natureza e material).

**97 das 308 criaturas** têm alguma coisa, ou seja 31%, e as outras 69% não têm nenhuma, que é o
que esta seção previa. A previsão do alvo do Luz bateu na mosca: são **47 criaturas com fraqueza
a luz e sagrado**, os 32 Corruptores mais os 15 Mortos-vivos, exatamente os 15% do livro.

| Fraqueza | criaturas | | Resistência | criaturas |
|---|:--:|---|---|:--:|
| luz, sagrado | 47 | | perfuracao | 38 |
| fogo | 13 | | fogo | 21 |
| profano | 8 | | corte | 10 |
| agua | 7 | | gelo | 3 |
| prata | 2 | | impacto | 3 |
| sol | 1 | | raio | 1 |

O preenchimento tem duas camadas, as duas dentro do script: a **regra** por categoria e tag
(67 criaturas) e as **exceções à mão** (30), que vencem a regra. O JSON de saída é descartável.

**Ainda falta**, e é a única coisa que falta aqui: definir o que a **fraqueza** faz **em número**
para os outros elementos. O Luz já está definido (agravado, ignora resistência) e a resistência
também (metade, arredondando para cima, depois da armadura e antes da Absorção). A fraqueza dos
outros catorze, não. Ver Pendência 4c.

---

## 9.5. A fonte do elemento

**Decidido e no site** (`regras.json → arcano.fonteElemental`, capítulo XV, seção "A fonte do
elemento").

Conjurar a partir de uma fonte do elemento vale **+1 de desconto**, somado à Centelha. É desconto
fixo na regra básica; alguma condição especial pode aumentá-lo no futuro, mas não hoje.

- **Requisito.** A fonte precisa bancar o **maior parâmetro investido**, não o nível do Efeito.
  Muro com Comprimento 4 exige terra de abundância 4, mesmo com o resto no 1.
- **Consumo obrigatório, mas proporcional.** Efeito de nível 1 num barril leva só parte da água.
  É o que impede repetir o truque no mesmo lugar a noite inteira.
- **Permanência.** O feitiço deixa de ser conjuração e vira **manipulação**. Elemento com corpo
  (terra, água, gelo) fica no mundo e volta ao estado natural quando a magia acaba: a parede de
  água desaba e molha o chão, a de terra vira monte de terra. Se a água não escorreu, serve de
  fonte de novo. Elemento sem corpo (fogo, raio, luz, sombra) some no fim da duração.
- **Ritual.** O +1 entra **antes** da multiplicação, e em troca o consumo é muito maior que o
  normal, com efeitos colaterais indesejados como regra (o poço seca, o bosque murcha).
- **Pode zerar o custo.** O mesmo efeito que fica grátis com Centelha 3 mais fonte já ficaria
  grátis com Centelha 4 sem fonte nenhuma.
- **Sem penalidade pela falta.** Perder o desconto já é o preço; só um motivo específico da cena
  cobra mais.
- **Ar.** Abundante até o nível 3 em qualquer lugar; do 4 em diante exige vento de verdade. A
  vantagem geral do Vento é proposital, porque é o elemento menos letal.

A **régua de abundância** tem 6 degraus para cada um dos 8 elementais, com as âncoras baixas
definidas em conversa: fogo 1 é **tocha** (não vela), água 1 são **alguns litros**, terra 1 é
**um saco de terra**.

Para as Artes sem elemento no mundo, o equivalente é um **foco material**, com a mesma régua.
Rascunho registrado: Cura (ervas, kit, poções, leito de verdade), Ofuscação (sombra e penumbra,
multidão, disfarce), Adivinhação (tarô, runas, ossos, espelho), Fortuna (objetos de sorte,
amuleto, dados), Proteção (símbolos sagrados, círculos, sal), Natureza (folhas, ervas, sementes,
mato vivo), Metamorfose (ossos, pele, penas, garras). Ver Pendência 9.

---

## 10. Pendências

> **Para retomar:** esta seção é o ponto de partida de qualquer próxima conversa sobre o Arcano.
> Tudo o que está acima dela já foi decidido e já está no site e em `regras.json`. O que está
> aqui, não. A lista curta que aparece no fim do capítulo XV (`/artes/regras`, bloco "Em revisão")
> é um resumo desta seção, e o **`Pendencias.md`** na raiz junta estas pendências às das outras
> frentes (bestiário, Trilhas, Proezas, social, lore).

**1. Guardar um feitiço: o que falta.** A regra base **já está fechada e no site**: o Mana é pago
na hora, o feitiço fica comitado, e enquanto isso o Raciocínio conta um nível abaixo nos valores
calculados e dá −1d6 nas rolagens; soltar ou desfazer devolve na hora. Falta decidir: **a
penalidade acumula** por feitiço guardado (dois feitiços, Raciocínio dois níveis abaixo)? Há
**teto** de quantos dá para carregar? E o feitiço guardado **vence** com o tempo?

**2. Empurrão. RESOLVIDO.** Virou **Efeito Especial de nível 3** em Terra, Gelo, Água e Ar (e
em Forças, que já empurra por natureza). O que decide é o **peso do alvo**, lido nas tabelas de
Força que já existem: a Arte entra no lugar dos músculos com **FAH = (nível da Arte) × 5** no
levantamento (diz se o alvo sai do lugar) e **FAA = (nível da Arte + Acerto Arcano) × 2** no
arremesso (diz a que distância ele vai). Bater em obstáculo duro machuca como a queda equivalente.
A fórmula antiga da seção 6 morreu, e com ela a pendência do peso (era a 8).

**3. Rituais.** Encaminhado pela seção 6.6: **Ritual é o modo lento de conjurar**, que troca
Mana por tempo e Vontade. Efeito duradouro não é Ritual, é Efeito com duração alta, porque
duração é só um parâmetro. Falta decidir duas coisas: se a regra antiga de "metade do Mana no
Ritual" morre de vez (a proposta atual já é mais generosa que ela) e se algum Efeito só existe
no modo lento, como o círculo de invocação.

**3b. Duas escalas de parâmetros no sistema.** RESOLVIDO: as escalas das Proezas e as do Arcano
**são diferentes de propósito**. A Proeza é o corpo, o Arcano é o ambiente, e cada um tem o seu
alcance natural. Nada a unificar.

**4. Resistência: o número. RESOLVIDO.** O dano daquele tipo cai pela **metade, arredondando
para cima**, e nunca é agravado. **A ordem importa:** primeiro a **armadura** absorve, depois a
resistência corta pela metade o que sobrou, e só então entra a **Absorção natural** da criatura.
A flecha atravessa o couro do mesmo jeito em qualquer um; o que muda é o que o corpo do vampiro
faz com o que passou. Resistência e fraqueza se anulam quando a mesma criatura tem as duas.
Exemplos travados: objeto e estrutura, morto-vivo, esqueleto e planta resistem a **Perfuração**;
criatura de água ou de terra resiste a **fogo**; criatura de metal ou pedra também.

**4b. Preencher o bestiário. FEITO em 2026-08-10**, exatamente como estava previsto: regra por
categoria e tag para o grosso, exceções à mão por cima. 97 das 308 criaturas têm alguma coisa, e
as 47 com fraqueza a luz e sagrado são os 32 Corruptores mais os 15 Mortos-vivos. Detalhe na §9.

**4c. O que a fraqueza faz em número, fora do Luz. ABERTO.** É o que sobrou das duas pontas: a
resistência tem número (4) e o Luz tem o dele (agravado, ignora resistência), mas a fraqueza a
fogo, água, prata, sol, sagrado e profano ainda não tem. Os candidatos são **dobrar o dano**,
**virar agravado** como o Luz, ou **ignorar a Absorção natural**. Não trava o dado, que já está
preenchido: trava só a leitura na mesa.

**5. Rolagem das Artes.** *(o **Acerto Arcano** já existe e já está na ficha: **Habilidade
Secundária do grupo Conhecimento**, ao lado de Alquimia e Arquitetura, usada com Percepção ou
Destreza nos efeitos mirados.)* O resto está sendo desenhado na frente das Trilhas, não aqui, mas
afeta este documento: a conjuração deixa de ser Ocultismo para todos e passa a variar por
**Tradição**. Quando fechar, as seções 3 e 4 daqui precisam de revisão, porque hoje dizem
"Ocultismo + Atributo".

**6. Trilhas de ensino.** Serão **6 Tradições**, já escritas no capítulo XIV. O que falta é o mapa
**Arte × Trilha** e os números de treino. Frente própria, não se decide aqui.

**7. Metal.** Arte elemental desenhada e **engavetada** por ora: mexe no equipamento próprio e
alheio (afia, enferruja, aquece a armadura no corpo, arranca a arma da mão, reduz Absorção),
com gancho forte na "magia de ofício" dos anões. É só retomar o desenho quando quiser.

**8. Peso, para o empurrão. RESOLVIDO pela 2.** Não virou traço de ficha: o empurrão passou a
ler o peso pelas tabelas de Força que já existiam, e a Arte entra no lugar do músculo.

**9. Focos das Artes não elementais.** O rascunho da seção 9.5 já está no site, mas falta fechar:
quais Artes entram além das sete rascunhadas, e **como se mede a abundância de um foco** que não é
elemento (um baralho de tarô não tem "volume" como um rio tem).

**10. O desconto da fonte pode passar de +1?** Hoje é fixo. Fica registrado que alguma condição
especial (lugar sagrado do elemento, estação do ano, um pacto) poderia aumentá-lo.

**11. Clarão Cegante: sem Dificuldade, por ora.** Ficou sem rolagem: quem está na área e olhando
sofre a Penalidade. Se um dia precisar de resistência, o lugar é aqui.

**12. O campo `escalonavel`.** Órfão desde que os níveis dos Efeitos viraram fixos. Ou vira
`sucede` (comprar a Fenda por cima do Terremoto pagando a diferença), ou some do schema.

**13. Efeitos elementais sem número.** Treze ainda estão só com parâmetros padrão, e Fogo, Raio e
Luz não têm nada de nível 1. Frente de revisão do autor.

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
3. ~~Criar `src/data/efeitos.json`~~ **FEITO**: 139 Efeitos escritos, ligados na ficha e na
   página `/artes/efeitos`, com a economia própria da Cura (2 de Mana por nível) fechada.
4. Incluir em `regras.json` a regra de empurrão e a de dano agravado como bloco próprio, quando
   fecharem.
5. Preencher `fraquezas` e `resistencias` no bestiário. **Destravado** (a pendência 4 fechou):
   é o maior item pronto para executar hoje.
6. Revisar as seções 3 e 4 deste documento quando a rolagem por Tradição fechar.
7. Portar ao site o que já está escrito e parado em doc: **Antecedentes** (14, com XP ×3) e
   **Ataques Mentais** (o capítulo; a Defesa Mental já está no motor).
