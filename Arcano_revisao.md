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

### Uma segunda régua, informal e provisória

> **Isto não é regra.** É nota de trabalho, para não recomeçar do zero na próxima vez que aparecer
> um elemento candidato. Nada no sistema depende dela e ela cede em qualquer caso concreto.

A régua acima separa Arte de Efeito. Falta a que separa **Arte de subdivisão de outra Arte**, que
foi a pergunta que o Metal e o Raio levantaram em 2026-08-15. A intuição é que só vira Arte quem
responde sim às três:

1. **Verbos próprios.** Faz coisas que nenhum outro elemento faz.
2. **Física própria.** Dano, absorção ou parâmetro diferentes.
3. **Fonte própria.** Uma régua de abundância que não é a de ninguém.

Só verbos, é conjunto de Efeitos. Só raridade, é exigência de Trilha.

De onde ela saiu: o Avatar resolve a mesma questão com quatro elementos mais subdivisões travadas
por aptidão (metal, lava, sangue, combustão, voo), e nunca com uma trilha de compra separada. **O
Centelha tem três ferramentas onde o Avatar tem uma:** o Efeito Especial para a subdivisão, a
conjuração composta para a híbrida (lava é Terra mais Fogo, e a máquina já existe), e a fonte do
elemento para a condição rara (a lua cheia da dobra de sangue).

E vale registrar que **o Centelha já divergiu do Avatar de propósito**: Gelo é Arte separada de
Água, e lá gelo é só dobra de água. A régua daqui já é "verbos diferentes mais física diferente",
não "quatro elementos e o resto é técnica". Adotar a do Avatar hoje obrigaria a fundir Gelo em
Água também.

> **Correção do próprio argumento.** Ao discutir o Raio eu usei o Avatar, onde relâmpago é
> subdivisão do Fogo. Isso não vale aqui, e os dados já diziam: a régua de abundância do Raio, que
> está no site desde sempre, é inteira de tempo (*ar seco e carregado · trovoada ao longe ·
> tempestade sobre a cabeça · tempestade em mar aberto*), enquanto a do Fogo é inteira de
> incêndios. **No Centelha o Raio nasce do céu, não da chama**, e se um dia fosse subdivisão de
> alguém seria do Ar. Continua Arte própria de qualquer jeito, pelos motivos da pendência 19.

### Vizinhança entre Artes

Elementos vizinhos não precisam virar um só. Cinco relações, e nenhuma delas pede camada nova:

| A relação | Exemplo | A ferramenta |
|---|---|---|
| fazem algumas das mesmas coisas | Raio e Ar · Gelo e Água | **Efeito compartilhado** |
| combinam num terceiro | Lava = Fogo + Terra · Plantas = Água + Vida | **conjuração composta** |
| um vira o outro | Gelo e Água | **a fonte**: o gelo derrete, e a água que não escorreu serve de fonte de novo |
| um é caso particular do outro | Metal ⊂ Terra | **Efeitos + Trilha** (pendência 7) |
| formas diferentes do mesmo elemento | Terra, Areia e Pedra | **escola** (abaixo) |

Sobre Plantas, um detalhe que economiza trabalho: **Vida já tem quase tudo** (Sarçal, Coração
Verde, Semear o Ermo, Semente Adormecida). O que a Água acrescenta é justamente o que separa dobra
de jardinagem, e a composta entrega isso hoje sem escrever uma linha.

### Escola: onde se ensina, e o que o lugar decide

**Decidido em 2026-08-15, e no site** (capítulo XV, `/arcano#escolas`).

A **Tradição** diz *como* se ensina, e são seis. A **Escola** é a casa concreta onde se ensina: um
mosteiro, uma academia, um círculo de anciãos, a corte de um senhor. Ela nasce dentro de uma
Tradição e herda o método dela, mas **o repertório não sai do método, sai do que existe em volta**.
Onde o inverno é o ano inteiro ensina-se Gelo e quase ninguém aprende Água; no deserto ensina-se
Areia e rocha viva é lenda de viajante.

Isso não é gosto do mestre, é a régua da fonte funcionando: conjurar a partir do elemento abundante
vale desconto, e ninguém funda escola de pedra onde não há pedra.

**A consequência boa:** explica por que Artes quase iguais existem separadas. Gelo e Água fazem
coisas próximas e uma vira a outra, e são distintas porque foram **ensinadas distintas**, por gente
que morava em lugares distintos.

**A vantagem concreta é a fronteira.** Uma Escola costuma morar na divisa entre duas Artes, e é
isso que ela entrega. A escola da Areia é a de Terra que faz divisa com o **Ar**: areia voa, cega,
sobe em nuvem. Quem estudou nela alcança o que o talhador de rocha nunca alcançaria, e em troca não
ergue muralha. O mecanismo é o **Efeito de fronteira** (`regras.json → arcano.efeitos.fronteira`),
que é o velho "o Efeito que você já sabe e cabe em outra Arte sua não custa XP" visto pelo avesso.

E o tamanho vem junto, sem regra nova: areia é **granular** na tabela de estado, então cobre mais
chão que a rocha e não dobra o dado como a Terra dobra. **A escola da Areia troca dano por alcance,
e a da Pedra troca alcance por dano**, e isso sai da tabela sozinho.

Falta o mapa: quais Escolas existem, onde ficam e o que cada uma abre. É trabalho de lore, e ele
anda junto com a ligação de cada Arte com suas Trilhas.

> **O buraco que revelou tudo isso.** A régua de abundância da Terra hoje **desliza de solo solto
> para rocha viva conforme sobe** (*saco de terra · terra batida · campo aberto · encosta, pedreira
> · rocha viva · raiz da montanha*), e **areia não aparece em lugar nenhum**. O resultado é
> perverso: um deserto, que deveria ser o paraíso de quem trabalha areia, cai perto do fundo de uma
> escada que trata material solto como fraco. Não é lacuna de conteúdo: é o sinal de que "uma Terra
> só" é uma simplificação que a própria régua já estava forçando.

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

> **Atenção: as tabelas desta seção e a fórmula de pontos da 5.1 estão defasadas.** O que vale é
> `src/data/regras.json → arcano.improviso.graus`, renderizado no capítulo XV, e a economia é
> **investir quantos pontos quiser, 1 ponto por grau, e a Centelha desconta do total; o que sobra
> é o Mana**. Não existe a bolsa fixa de "Arte × 2 + Centelha" descrita na 5.1. Só a **5.2** fala
> a régua certa; o resto desta seção é registro histórico.
>
> **A régua do site, decidida em 2026-08-15 (graus 0 a 6, o grau 0 grátis):**
>
> | Parâmetro | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
> |---|---|---|---|---|---|---|---|
> | Alcance | toque | 1 m | 2 m | 4 m | 10 m | 20 m | 50 m |
> | Área (diâmetro) | 0,1 m | 1 m | 1,5 m | 2 m | 2,5 m | 3 m | 4 m |
> | Volume (lado) | 2 cm | 10 cm | 25 cm | 50 cm | 1 m | 1,5 m | 2 m |
> | Alvos | nenhum designado | 1 | 2 | 3 | 4 | 6 | 10 |
> | Dano | nenhum | 1d6 | 2d6 | 3d6 | 4d6 | 5d6 | 6d6 |
> | Duração breve | instantâneo (1 tick) | 1 turno | 2 | 4 | 10 | 20 | 50 turnos |
> | Duração longa | instantâneo (1 turno) | 10 min | 1 h | 6 h | 1 dia | 1 semana | 1 mês |
>
> **Área e Volume são duas réguas do mesmo parâmetro**, como Duração breve e longa: o efeito usa
> uma ou a outra, nunca as duas, e custam o mesmo. Quem decide é o que o efeito faz, não o jogador.
>
> A divisão saiu da leitura dos 46 Efeitos que usavam Área, e não é a que a gente supôs. Vinte e
> oito deles não são matéria nem cobertura: são **jurisdição**, uma região do mapa onde uma regra
> passa a valer (Noite, Santuário, Barreira, Círculo, Praga, Mordaça, Bolha Temporal). Então:
>
> - **Volume mede o corpo do elemento**, quanta matéria ou quanto fenômeno saiu.
> - **Área mede a jurisdição**, e ali não interessa quanto elemento existe, interessa quem está
>   dentro.
>
> Teste de mesa: **o efeito é matéria ou é regra?** E uma mesma Arte usa as duas conforme o efeito:
> o Clarão de Luz é corpo, a Noite de Sombra é jurisdição.
>
> **O tamanho do Volume varia por estado da matéria** (decidido em 2026-08-15, em
> `graus.volumePorEstado`), porque um metro cúbico de pedra, de água, de chama e de névoa são
> esforços muito diferentes. Sólido metade · líquido e gelo normal · fenômeno dobro · gás oito
> vezes · Raio troca Volume por Comprimento, porque descarga é trajeto e não corpo.
>
> Isso fecha uma simetria com a tabela de dano que apareceu sozinha: **a Terra dobra o dado e
> divide o volume; o Ar não tem dano e multiplica o volume por oito.** As duas exceções de uma
> tabela são as duas exceções da outra, em direções opostas.

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
| Fogo 1, Centelha 1 | 3 | 1 | 1d6 a 5 m (dardo); ou 1d6 num jorro de 1 m² sustentado por 1 turno |
| Fogo 3, Centelha 3 | 9 | 3 | 3d6 num jorro de 15 m²; ou 3d6 a 50 m sustentado por uma cena |
| Fogo 6, Centelha 3 | 15 | 6 | 6d6 a 500 m; ou 5d6 numa massa lançada de 50 m² a 150 m |
| Fogo 6, Centelha 6 | 18 | 6 | 6d6 a 1,5 km sustentado por 6 horas: os três parâmetros no teto |
| Fogo 1, Centelha 6 | 8 | 1 | nada além do grau 1: com três parâmetros no grau 1, gasta 3 dos 8 |

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

### 5.2. O que o improviso pode combinar

> **Decidido em 2026-08-14 e portado em 2026-08-15.** Está em `regras.json →
> arcano.improviso.combinacoes` e no capítulo XV, na seção "O que o improviso pode combinar".
> Esta seção é a única da 5 que fala a régua do site.

A Arte crua não desenha: ela **manifesta o elemento**. Fogo sai como labareda, Terra sai como
pedra, estalactite e estilhaço. Quem dá forma é o Efeito. O risco dos cinco parâmetros soltos é
o improviso desenhar sem querer: pagar Alcance e Área ao mesmo tempo é pedir uma bola de fogo, e
pagar Área com Duração é levantar um muro sem comprar o Muro.

A trava não é uma lista de formas proibidas. É que **os parâmetros não se combinam todos**, e a
forma sai de quais foram pagos. Antes de tudo, o que cada um mede, que o documento não dizia:

- **Alcance é onde o efeito começa.**
- **Área é o tamanho do que ele ocupa.**

Na labareda o efeito começa na mão (Alcance 1, toque) e ocupa um leque. No dardo ele começa longe
(alcance alto) e ocupa um alvo só. Pagar os dois é cobrar o mesmo espaço por dois caminhos.

> **1. Área nunca é colocada.** Ou ela nasce no corpo do conjurador, ou ela viaja em linha reta a
> partir dele. Escolher um ponto do mapa e pôr uma área lá é Efeito.

> **2. Improviso mantém, Efeito solta.** Duração improvisada se paga com concentração. Duração
> que fica de pé sozinha é Efeito.

> **3. Teto de três.** No máximo três parâmetros **acima do grau 0**. **Alvos nunca entra no
> improviso elemental:** escolher várias vítimas a dedo é precisão, e precisão se compra. O lugar
> natural de Alvos é nas Artes que agem sobre pessoas escolhidas (Cura, Fascinação, Conjuração).

O repertório inteiro que sobra:

| Improviso | Parâmetros | Como se manifesta | Quem é atingido |
|---|---|---|---|
| **Dardo** | Alcance + Dano | um pedaço do elemento sai da mão e vai até o alvo | um alvo, pela Defesa como qualquer projétil |
| **Jorro** | Área ou Volume + Dano | o elemento sai do corpo, em leque à frente ou irrompendo em volta, conforme o que ele faz por natureza | quem estiver dentro, aliado incluído |
| **Massa lançada** | Alcance + Área ou Volume + Dano | um bloco do elemento corre em linha reta a partir do conjurador | o primeiro que estiver na reta. Ela **não** para onde o jogador quiser |
| **Sustentado** | Dardo ou Jorro **+ Duração** | o conjurador se planta e mantém | reavaliado a cada turno |

O Dardo sustentado é jato contínuo, não tiro repetido: estilhaços saindo da palma por dois
turnos. O Jorro sustentado é a labareda que não apaga.

**A Massa lançada não se sustenta**, e não por proibição: ela viaja e acaba, e somar Duração a ela
seria o quarto parâmetro acima do grau 0.

**Com tudo no grau 0 o feitiço custa zero.** É o elemento apenas se manifestando: acender ou apagar
uma vela, gelar uma bebida, umedecer uma superfície, faíscas, iluminar como uma tocha, suprimir a
luz de uma tocha, assoprar folhas. Dura um tick. Quem tem Centelha 1 paga a Duração 1 com o
desconto e sustenta por um turno, e é **turno após turno** que a vela vira lareira e a bebida vira
gelo. O preço não é Mana, é a ação.

**Concentrar custa**, por turno sustentado:

- gasta a **ação** do turno;
- o conjurador **não sai do lugar**;
- **defender-se é permitido**, porque proibir defesa faria de sustentar um suicídio;
- **ao sofrer dano, um teste de Vontade + Acerto Arcano** para segurar. Falhando, o efeito cai.
  A dificuldade fica em aberto (pendência 14), e a perícia acompanha o que a conjuração por
  Tradição decidir (pendência 5).

Duas consequências que a mesa vai sentir, e as duas são escolhidas:

**O improviso perde a bola de fogo.** Pôr uma explosão *ali* sai do vocabulário até alguém comprar
o Efeito.

**Improvisar área é coisa de linha de frente.** Sem alcance, quem quer área precisa estar a
distância de toque; quem quer distância tem o dardo e a massa lançada. O feiticeiro que não
estudou luta perto ou luta um alvo por vez.

E fica barato de explicar por que a **Flecha de Fogo**, para atirar com arco, é Efeito de nível 1:
ela persiste sem concentração **e** é entregue a outra coisa. Duas violações, nenhuma regra nova.

> Escrito para as Artes elementais, onde "manifestação do elemento" quer dizer alguma coisa. Cura,
> Fascinação, Adivinhação, Conjuração e Metamorfose já trocam parâmetros nesta seção e precisam do
> equivalente delas, escrito na própria Arte (pendência 15).

---

## 5.3. Os moldes: o chão se compra por forma, e cada forma tem régua

**Decidido em 2026-08-15.** A escola está fechada; as réguas abaixo são a calibragem proposta e
esperam mesa. O que motivou: com uma régua métrica única de Área ou Volume, e liberdade de moldar,
o jogador **lava matéria em alcance**. Medido, com 1 m³ (grau 4) esticado até onde cada forma deixa:

| Molde | 1 m³ esticado | |
|---|---|---|
| Cilindro de raio 5 cm | **127 m** | |
| Cone de raio 10 cm | 95 m | |
| Torus de tubo 5 cm | anel de 41 m de vão | |
| Cuboide de 10 cm × 2 m | 5 m | o mais **manso** dos oito |
| Esfera | 1,24 m | a única presa, por ter **uma** medida |

Então a alavanca **não é o cuboide**: é a esbeltez, e qualquer molde com duas medidas livres a tem.
Proibir o cuboide e liberar o cilindro piora vinte e cinco vezes.

E o dano ao desenho é concreto, não estético: a laje improvisada **vence o Efeito comprado com XP**
a partir do grau 5 (17 m contra os 12 m do Muro; 40 m contra 20 m), e abaixo do grau 4 ela não
chega a um hexágono (0,63 m). Cúbico contra linear sempre se cruza.

### A escola: o molde é o parâmetro

Nenhum jogo que durou entrega volume moldável ao jogador. **D&D 3.5 e Pathfinder 1e** declaram o
tipo (*burst*, *cone*, *line*, *cylinder*) e fixam a dimensão por feitiço, com assimetria proposital
no mesmo nível: Fireball 6 m de raio contra Lightning Bolt 36 m de linha. Mudar a geometria custa
nível (*Widen Spell*, +3). **Pathfinder 2e** vai além e não deixa a área crescer, só o dano.
**Warhammer** faz do molde um objeto de acrílico. **Final Fantasy Tactics** e **Into the Breach**
usam padrão de casas. **Ars Magica**, o primo paramétrico, torna o alvo **categoria** e não medida
(*Individual · Group · Room · Structure · Boundary*), e põe a matéria num parâmetro separado.
**Mage the Awakening** resolve o desencontro entre alvos e área pondo os dois na mesma régua
(*Scale*). E o **Wall of Stone** do 5e mostra como permitir a troca sem abrir a rampa: painéis
indivisíveis, e a troca de espessura por área é fixa em 2×, nunca contínua.

Centelha já tem o vocabulário e não o usa como regra: o `grid.forma` dos 139 Efeitos declara
**alvo 43 · nenhuma 37 · zona 26 · movimento 12 · aura 10 · token 6 · muro 2 · cone 2 · cadeia 1 ·
linha 1**. A `zona` genérica engordou e as formas com personalidade ficaram com seis Efeitos
juntas. Quatro Efeitos já fazem o certo, com régua própria: Muro, Aura, Neblina e Terremoto.

**A regra nova, em uma frase:** o parâmetro de chão não é uma medida solta, é um **molde com nome**,
e cada molde tem a sua régua. O jogador escolhe a forma; a forma decide as dimensões.

### As cinco réguas

Os hexágonos são coluna de leitura, não unidade: a régua é em metros, e o molde ancora onde o
efeito nasce.

| Molde | Compra | g0 | g1 | g2 | g3 | g4 | g5 | g6 |
|---|---|---|---|---|---|---|---|---|
| **Explosão** | diâmetro | 0,5 m | 1 m | 2 m | 3,5 m | 5 m | 6,5 m | 8 m |
| | *hexágonos* | *1* | *1* | *7* | *13* | *19* | *37* | *61* |
| **Leque** | comprimento, 60° | 1 m | 2 m | 3 m | 4 m | 5 m | 6 m | 8 m |
| | *hexágonos* | *1* | *4* | *7* | *12* | *17* | *24* | *44* |
| **Linha** | comprimento, 1 m de largura | 2 m | 4 m | 6 m | 8 m | 12 m | 16 m | 24 m |
| | *hexágonos* | *3* | *5* | *7* | *9* | *13* | *17* | *25* |
| **Muralha** | metros de frente | 1 m | 2 m | 3 m | 5 m | 8 m | 12 m | 20 m |
| **Cadeia** | inimigos ligados, salto de 3 m | 2 | 3 | 4 | 5 | 6 | 8 | 10 |

A **Muralha** é a régua que o Muro já tem, sem mexer num número. A **Aura** (10 Efeitos) mantém a
dela, 0,25 a 3 m de raio, e ela é menor de propósito: acompanha o corpo. A **Cadeia** formaliza o
"saltar de alvo em alvo" que já é verbo exclusivo do Raio e já existe como Efeito (`corrente`).

### Por que cada molde tem serviço, e não é upgrade do outro

Inimigos pegos, em três formações:

| | g1 | g2 | g3 | g4 | g5 | g6 |
|---|---|---|---|---|---|---|
| **Apertada** (um por hexágono) | | | | | | |
| Explosão | 1 | 7 | 13 | 19 | 37 | **61** |
| Linha | 5 | 7 | 9 | 13 | 17 | 25 |
| Cadeia | 3 | 4 | 5 | 6 | 8 | 10 |
| **Espalhada** (um a cada 4 hexágonos) | | | | | | |
| Explosão | 1 | 2 | 3 | 5 | 9 | 15 |
| Linha | 1 | 2 | 2 | 3 | 4 | 6 |
| **Cadeia** | **3** | **4** | **5** | **6** | **8** | 10 |

**A Cadeia é o único molde que não muda de valor com a formação.** Todo o resto murcha quando os
inimigos se abrem; ela não. É a resposta para "acertar vários, mesmo não adjacentes", e ela ganha
da Explosão em campo aberto até o grau 5, perdendo só no 6, quando a geometria fica grande o
bastante para varrer.

Simulado no tabuleiro da bancada (`volume-bench.html`, modo **molde de chão**), no grau 5, contando
peça por peça em vez de por fórmula:

| Molde | Colados | Frouxos | Espalhados |
|---|---|---|---|
| Explosão | 37 | 20 | **10** |
| Leque | 24 | 13 | 7 |
| Linha | 16 | 8 | 8 |
| **Cadeia** | **8** | **8** | **8** |

**A ressalva que só apareceu ao simular:** a Cadeia é indiferente à formação, mas **não é
indiferente ao caminho**. Ela salta de um alvo ao mais próximo ainda não atingido, e onde o próximo
estiver além do salto a corrente **arrebenta ali**, perdendo os elos restantes. Então ela não é o
molde universal: é o molde de quem enfrenta muitos inimigos **em fila ou em cordão**, e é fraca
contra dois grupos separados por um vão. Isso precisa entrar na regra de salto (pendência 6 abaixo).

E o alcance que cada um compra a partir da âncora, que é a outra moeda:

| | g3 | g4 | g5 | g6 |
|---|---|---|---|---|
| Explosão (raio) | 1,75 m | 2,5 m | 3,25 m | 4 m |
| Leque | 4 m | 5 m | 6 m | 8 m |
| **Linha** | **8 m** | **12 m** | **16 m** | **24 m** |

A Linha compra seis vezes o alcance da Explosão e paga com a largura. É o Lightning Bolt contra o
Fireball, e é a saída positiva para quem quer chegar longe: existe forma para isso, e ela cobra em
outra moeda.

### Estes cinco moldes são dos EFEITOS, e o improviso tem geometria própria

**Corrigido em 2026-08-17.** Uma versão anterior desta seção dizia que a Área do improviso passava
a ser a régua da Explosão. Não é: o improviso ganhou geometria própria, que é a **§5.4**, e os cinco
moldes acima são o que se compra com **XP**. A divisão ficou assim, e ela é limpa:

| | Quem tem | O que é |
|---|---|---|
| **Improviso** | a Arte crua, sem XP | fatias de 60°, 90° ou 120° saindo do feiticeiro (§5.4) |
| **Efeito Especial** | comprado com XP | um molde com nome e régua própria (esta seção) |

O que o Efeito compra, então, não é "mais tamanho": é **uma forma que a manifestação não faz**.
Pôr uma bola num ponto escolhido, esticar uma reta de vinte metros, erguer uma parede plana,
saltar de alvo em alvo. A manifestação só sabe abrir leque em volta de quem conjura, e é essa a
fronteira.

O **Volume fica exatamente como está** (8 cm³ a 8 m³) para os Efeitos que criam matéria, e **perde
o direito de virar forma**. Lido como matéria ele está calibrado, e o que parecia pequeno era
pergunta de chão feita a uma régua de massa: o grau 3 são **169 kg de pedra**, o grau 4 são 1,4 t
e o grau 6 são 10,8 t. **Pedra não vira tapete, névoa vira**, e é isso que o fator de estado diz.

### O cuboide não é proibido: ele ganha nome

O cuboide comprido é a **Muralha**, e a Muralha tem régua calibrada para ser comprida. O cuboide
maciço é **matéria**, e matéria é Volume em m³. O abuso morre por construção e não por proibição:
não sobra medida livre para trocar, porque quem escolhe as dimensões é o molde.

---

## 5.4. A manifestação da Arte básica: fatias que saem do feiticeiro

**Decidido em 2026-08-17.** Esta é a geometria do **improviso**, o que a Arte crua faz sem nenhum
Efeito comprado. Os moldes da §5.3 continuam valendo, e são o que se compra com XP.

> **Este texto substitui a versão anterior desta seção, e ela estava errada em três pontos.**
> O que era "0,433 × n³, volume conservado em qualquer abertura" e "duas aberturas" saiu inteiro.
> Os três erros estão nomeados no fim da seção, em *O que a versão anterior errava*, porque cada um
> deles ainda é uma armadilha fácil de repetir.

### A regra, em seis linhas

1. O parâmetro compra uma **base de n × n**: *n* metros de frente somada e *n* metros de altura.
2. A manifestação sai do **feiticeiro**, em **fatias** que partem todas do mesmo ponto e são
   obrigatoriamente **vizinhas**: é o mesmo ataque se abrindo, e não vários ataques.
3. A abertura de cada fatia é **60°, 90° ou 120°**.
4. Com a base travada, o ângulo e a distância **não são independentes**:
   `distância = (aresta ÷ 2) ÷ tan(ângulo ÷ 2)`.
5. Cada fatia é uma **pirâmide**, ápice no feiticeiro e base de pé na ponta:
   `volume = base × distância ÷ 3`.
6. O número de fatias **nunca passa do nível**, nem do que fecha o círculo.

| Grau | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Lado da base | 0,5 m | 1 m | 2 m | 3 m | 4 m | 5 m | 6 m |

Chamando *N* o número de fatias e θ a abertura de cada uma, as três medidas saem de uma linha só:

<p class="formula">aresta = n ÷ N &middot; distância = (n ÷ 2N) ÷ tan(θ÷2) &middot; volume = n³ ÷ (6 · N · tan(θ÷2))</p>

O que se compra é a **superfície**, e ela não se mexe: a frente somada é sempre *n* e a altura é
sempre *n*, então a base é *n²* em qualquer abertura e em qualquer número de fatias. **Quem paga a
abertura é a distância**, e o volume vai atrás dela. Esse *quem paga* é a única coisa que separa este
modelo do outro que está na bancada, e a comparação dos dois tem seção própria mais abaixo.

### As três aberturas, e por que são exatamente essas

60°, 90° e 120° são **as três que fecham o círculo em número inteiro de fatias**: seis, quatro e três.
Qualquer outro ângulo deixa fenda ou sobrepõe, e um leque que não fecha obriga a inventar regra para o
resto. Não é gosto, é a lista completa dos divisores úteis de 360° nessa faixa.

No grau 6, com uma fatia (base de 6 × 6 m):

| Abertura | Distância | Lado do triângulo | Volume | Fração |
|---|---|---|---|---|
| **60°** | 5,196 m (3√3) | 6,000 m | **62,35 m³** | 1 |
| **90°** | 3,000 m (metade da base) | 4,243 m | 36,00 m³ | 1 ÷ √3 = 0,577 |
| **120°** | 1,732 m (um terço) | 3,464 m (2√3) | 20,78 m³ | 1 ÷ 3 |

Abrir é uma escolha caríssima e isso é de propósito: **o 120° custa dois terços do volume** e chega a
um terço da distância. Em troca, ele cobre três vezes mais ângulo por fatia, e é o que serve ao
feiticeiro de grau baixo, que não tem fatias sobrando para abrir de 60° em 60°.

### A trava das fatias, e o piso que ela dá de graça

**O número de fatias não passa do nível.** Grau 3 abre até três, grau 6 até seis. Daí saem três
coisas de uma vez:

1. A cobertura cresce em todo grau, e nenhum grau é pior que o anterior.
2. Em fatias de 60° só o **grau 6** fecha o círculo. Em 90°, o grau 4 já fecha; em 120°, o grau 3.
3. **O piso sai de graça**: dividir pelo próprio nível dá aresta de **1 m**, então o elemento nunca
   nasce a menos de 87 cm do peito, sem precisar de regra escrita.

Houve um piso de meio metro, com arredondamento, e ele **saiu**: arredondar deixava o grau 5 com
menos opções que o grau 3, porque 3 e 6 dividem bem e 4 e 5 não.

### O que sobe e o que desce quando se abre

Neste modelo, o da distância:

| Botão | O que sobe | O que desce |
|---|---|---|
| **Número de fatias** | o ângulo coberto (N × θ) | a distância, a aresta de cada fatia, o volume e o chão |
| **Abertura** | o ângulo de cada fatia | a distância, o volume e o chão |

E aqui está a consequência que **não** era esperada e que precisa ficar escrita: como a pegada no
chão é `N × aresta × distância ÷ 2`, e a distância cai com *N*, **o chão também divide por N**. Não é
que abrir troque altura por chão: abrir troca ângulo por *tudo o mais*. No grau 6 em fatias de 60°,
uma fatia cobre 15,6 m² de chão a 5,2 m de distância, e as seis fatias que fecham o círculo cobrem
2,6 m² a 87 cm. **Cercar-se é caríssimo, e é o preço de não ter flanco.**

### Quem paga a abertura: os dois modelos (em avaliação)

Há duas maneiras de cobrar as fatias a mais, e as duas estão na bancada desde 2026-08-17, no controle
**Abrir cobra**. A superfície comprada é *n²* nas duas, e o que muda é **em qual medida ela é cobrada**:

| | **distância** (modelo B) | **altura** (modelo A) |
|---|---|---|
| Aresta de cada fatia | n ÷ N | **n**, cheia |
| Altura de cada fatia | **n**, cheia | n ÷ N |
| Frente somada | n | N × n |
| Distância | (n ÷ 2N) ÷ tan(θ÷2) | (n ÷ 2) ÷ tan(θ÷2), **não encolhe** |
| Volume | n³ ÷ (6·N·tan(θ÷2)), **divide por N** | n³ ÷ (6·tan(θ÷2)), **conservado** |
| Chão | n² ÷ (4·N·tan(θ÷2)), divide por N | N · n² ÷ (4·tan(θ÷2)), **cresce com N** |

Com **uma** fatia os dois são o mesmo desenho, e a diferença só aparece ao abrir. No grau 6, fatias de
60°, medido na bancada:

| Fatias | Cobertura | distância: alcance · altura · chão · volume | altura: alcance · altura · chão · volume |
|---|---|---|---|
| 1 | 60° | 5,20 m · 6,00 m · 15,6 m² · 62,35 m³ | 5,20 m · 6,00 m · 15,6 m² · 62,35 m³ |
| 3 | 180° | 1,73 m · 6,00 m · 5,2 m² · 20,78 m³ | 5,20 m · 2,00 m · 46,8 m² · 62,35 m³ |
| 6 | 360° | 0,87 m · 6,00 m · 2,6 m² · 10,39 m³ | 5,20 m · 1,00 m · **93,5 m²** · 62,35 m³ |

Fechando o círculo, o modelo da altura entrega **seis vezes** o volume e **vinte e uma vezes** o
número de hexágonos do outro (126 contra 6, contados no tabuleiro), e cobra isso no teto, que desce
para 1 m. As seis fatias formam exatamente o **hexágono regular de lado 6 m**, 93,53 m² de chão, que é
o hexágono do Grid seis vezes maior: um lençol que pega quem estiver em pé até 5,2 m em qualquer
direção. Contra inimigos frouxos na bancada, 66 de 80.

A escolha é de jogo, e é bem definida:

- **O modelo da altura protege o alcance e o volume**, e é o que responde ao pedido de origem desta
  revisão: no grau 5 e 6 acertar vários inimigos mesmo sem estarem adjacentes, com um raio cada vez
  maior. Em troca, o improviso de grau alto vira um **lençol rasteiro** que quase sempre é a melhor
  jogada, e a decisão do jogador some: se abrir não custa volume nem alcance, abre-se sempre.
- **O modelo da distância protege a decisão**, porque cada fatia a mais cobra caro, e cercar-se é o
  gesto mais caro que existe. Em troca ele não entrega o raio pedido: no grau 6 girando 360°, o
  elemento fica a 87 cm do peito.

O meio-caminho que ainda não está na bancada é cobrar **as duas coisas em parte**, por exemplo a
altura em `n ÷ √N` e a distância no resto, que deixaria o volume caindo com `√N` em vez de `N`. Fica
registrado como opção; não implementei porque a régua vira irracional na mesa.

### A base pode ser reta ou em arco (em avaliação)

A base descrita acima é uma **corda**: uma reta a `distância` metros, e o chão é um triângulo. Há uma
segunda leitura da mesma fatia, na bancada desde 2026-08-17 e **ainda não decidida**: **o lado do
triângulo vira raio**, a base vira um arco e o chão vira um setor de círculo. No grau 6 a 60°, o lado
de 6 m vira **um setor de 60° com raio 6 m**.

O volume sai da mesma conta da pirâmide, e isso não é analogia: para um cone com ápice na origem,
`V = ⅓∫(r·n)dA`, e na parede cilíndrica a normal é radial, então `r·n` é o raio em todo ponto. Logo:

<p class="formula">Volume do setor = arco × altura × raio ÷ 3</p>

O arco ganha nas duas pontas que a corda cortava, e o preço aparece inteiro na tabela (grau 6, uma
fatia):

| Abertura | Corda | Arco (raio = lado) | Quanto o arco rende a mais |
|---|---|---|---|
| 60° | 62,35 m³ a 5,20 m | **75,40 m³ a 6,00 m** | +21% |
| 90° | 36,00 m³ a 3,00 m | **56,55 m³ a 4,24 m** | +57% |
| 120° | 20,78 m³ a 1,73 m | **50,27 m³ a 3,46 m** | +142% |

O fator é `θ ÷ sen θ`, e ele cresce com o ângulo. Isso tem uma consequência de equilíbrio que decide
a questão: **no arco, abrir fica barato.** Na corda, ir de 60° para 120° corta o volume a um terço;
no arco, corta só a dois terços. O arco é mais generoso justamente onde a corda cobrava mais caro,
que é a mão que a regra usa para segurar o leque largo.

Por isso a bancada tem **três** bases, e a terceira é a que separa desenho de equilíbrio:

| Base | Raio | Volume | Chão |
|---|---|---|---|
| **corda** | (base reta a `dist`) | referência | referência |
| **arco** | o próprio lado | +21% / +57% / +142% | +21% / +57% / +142% |
| **arco justo** | lado × √(sen θ ÷ θ) | **igual ao da corda** | **igual ao da corda** |

O arco justo encolhe o raio o suficiente para o volume e o chão baterem com os da corda em qualquer
abertura: é a forma redonda de graça, e o que muda de uma para a outra passa a ser só o desenho na
mesa. No grau 6 a 60° o raio vai de 6,00 m para 5,46 m, e a frente de 6,28 m de arco para 5,71 m.

Uma nota de desenho que rendeu: em **arco**, seis fatias de 60° não formam um hexágono em volta do
conjurador, formam um **cilindro**. A roda fechada deixa de ter quina.

### O que a versão anterior errava

1. **O volume estava 50% alto.** Ele vinha da área do triângulo visto de cima × a altura, que é a
   conta de um **prisma**. A fatia é uma **pirâmide**: `base × distância ÷ 3`. A constante do 60° é
   `√3 ÷ 6 = 0,289`, e não `√3 ÷ 4 = 0,433`. O grau 6 numa fatia de 60° dá **62,35 m³**, e não 93,5.
2. **A conservação do volume não era propriedade da geometria, era do modelo.** A versão anterior
   dizia "o volume não muda, qualquer que seja a combinação" como se fosse um fato da forma; ele só se
   conserva quando quem paga a abertura é a **altura**. No modelo em que paga a distância, o volume
   divide por *N*. Os dois estão na seção *Quem paga a abertura*, e nenhum dos dois é o erro: o erro
   era anunciar a conservação sem dizer de qual dos dois ela vinha.
3. **Baixar a altura pela metade não dá 120°, dá 98,2°.** Com a base fixa em 6 m e a altura caindo de
   5,196 m para 2,598 m, os dois lados iguais ficam em `A√7 ÷ 4 = 3,969 m` (essa parte estava exata) e
   o ângulo entre eles é 98,2°. Para o ângulo ser 120° a distância vai a **um terço**, não à metade.
   E 98,2° não fecha o círculo em número inteiro: três fatias dão 295° e quatro dão 393°.

### As duas alturas: o ápice e o pé da base

O feiticeiro escolhe **duas** alturas. A de onde a pirâmide **começa** (o ápice: no chão, na mão,
acima da cabeça) e a de onde ela **acaba** (o pé da base). A amarra é uma só:

<p class="formula">o ápice tem de estar dentro da altura da base</p>

Base de 5 m com o pé a 0,5 m ocupa de 0,5 a 5,5 m, então o ápice cabe em qualquer ponto desse
intervalo e em nenhum de fora. O **alcance do braço** (cerca de 2,2 m) limita as duas, e disso sai de
graça uma coisa que o `areaNuncaColocada` decreta: a base **não pode ser erguida longe do corpo**,
porque o ápice teria de acompanhá-la.

**Isso é liberdade que não custa nada**, e vale registrar por que: o volume de uma pirâmide sai da
área da base e da distância perpendicular até o ápice, e **não** de onde o ápice está sobre ela
(princípio de Cavalieri). Deslizar o ápice não cobra nem rende. Medido na bancada: os mesmos
62,35 m³ com o ápice a 0, a 0,7, a 1,5 e a 2,2 m.

Com isso o **desperdício no subsolo deixa de existir**. Enquanto a base era centrada no ápice, a
fatia de 6 m saindo de 1,5 m enterrava um quarto de si; agora basta pousar o pé da base no chão.

E o que a posição do ápice muda de verdade não é quem está em pé, é **quem está no chão**:

| Ápice | A face de baixo é | Toca o chão |
|---|---|---|
| 0 m, agachado com a mão no piso | horizontal | desde o pé do conjurador |
| 1,5 m, na mão | uma rampa descendo | só a **5,2 m** (grau 6) |

Saindo da mão com o pé da base no chão, a fatia é uma **rampa que passa por cima de quem está
deitado** até quase a ponta. Quem quiser varrer o chão desde o próprio pé precisa agachar e sair do
piso. Não é regra escrita, é consequência da forma, e é boa demais para ficar escondida.

### O estado da matéria incide no LADO DA BASE

<p class="formula">Terra e Metal: metade do lado · Ar e névoa: o dobro · o resto: igual</p>

No grau 6 isso dá **3 m** para a Terra, **6 m** para água, gelo, fogo, luz e sombra, e **12 m** para
o Ar. O Ar vira a Arte de domínio de espaço sem precisar de regra própria, o que casa com a decisão
já escrita de que ele foi calibrado de propósito **sem dano direto**: a Arte que não fere é a que
toma o campo.

### O que a manifestação NÃO faz

- **Não põe nada num ponto escolhido.** Ela nasce no feiticeiro, sempre. Pôr num ponto é Efeito.
- **Não faz parede plana nem reta**, e **não faz bloco que se carregue**. Muro, muralha e reta são
  Efeito Especial, e isso é escolha de escopo, não sobra.
- **Não ganha alcance com o nível da Arte.** Foi considerado (o nível da Arte valendo metros de
  alcance grátis) e **recusado em 2026-08-17**: o nível da Arte segue só como teto do grau do
  parâmetro, e o alcance continua sendo o que o `areaNuncaColocada` diz.

### O que ainda falta

1. **`regras.json → arcano.improviso.manifestacao`**: a escada do lado da base, a trava das fatias, as
   três aberturas e o fator de estado no lado. Hoje nada disso está no dado.
2. **Quem paga a abertura: distância ou altura.** As duas estão medidas na bancada e a escolha é de
   jogo, não de conta: uma protege a decisão do jogador, a outra protege o alcance e entrega o raio
   grande pedido no começo desta revisão. É a decisão mais pesada que sobrou aqui, porque o resto da
   seção não muda com ela.
3. **A base fica em corda ou vai para arco.** A conta das três está feita e medida na bancada; falta
   a decisão, e ela mexe no preço da abertura (na corda o 120° custa dois terços do volume, no arco
   custa um terço). O **arco justo** é a opção que muda o desenho sem mexer em número nenhum.
4. **O que a matéria dentro da fatia faz em número.** A regra diz quanto elemento aparece e onde; não
   diz o que 62 m³ de chama fazem além do parâmetro de Dano, nem o que a espessura de uma fatia de
   Terra aguenta. Encosta na A9 e no capítulo de Vida & Ferimentos.
5. **Crescer nas quatro direções foi escolhido**, e o preço está pago (a rampa, e o subsolo quando o
   pé da base não está no chão). A alternativa era crescer só para cima a partir do ápice, que nunca
   enterra nada e é mais simples. Fica registrada para não se reabrir por engano.
6. **As Artes não elementais** continuam sem geometria própria: Cura, Fascinação, Adivinhação,
   Conjuração e Metamorfose não manifestam elemento e a fatia não quer dizer nada nelas
   (pendência 15).
7. **Os textos de nível em `artes.json`** descrevem improvisos que esta geometria não permite mais
   (Fogo 3 "sustentar uma parede baixa de chamas", Fogo 4 "parede de chamas fechando um corredor").
   É a A15, e agora ela tem mais motivo.

A bancada `volume-bench.html`, no modo **molde de chão**, desenha tudo isto no hexágono de 1 m com o
conjurador no meio, e conta os inimigos pegos em três formações. Os controles da manifestação são
**abrir cobra** (distância ou altura), **abertura** (60/90/120), **base** (corda, arco, arco justo),
**fatias**, **sai de** (o ápice), **pé da base** e **elemento**.

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
| Luz | 1d6 por nível | só Centelha, **salvo** contra quem tem fraqueza ao sagrado | cegar e revelar |
| Sombra | **sem dano direto**; os Efeitos dela ferem (Impacto que **ignora armadura**) | ignora armadura | esconder, agarrar, sufocar, amedrontar |

A coluna Absorção vale para o alvo **comum**. Contra quem tem **fraqueza** àquele tipo, nada
absorve e o dano é agravado, seja ele Luz, Fogo, Raio ou uma adaga de prata (§9 e pendência 4c).
O Luz não é especial: ele só é a Arte cujo alvo natural são justamente as criaturas que carregam
a fraqueza, e por isso parece regra própria.

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

O preenchimento tem **três camadas**, da mais geral para a mais específica, cada uma vencendo a
anterior: **categoria** (64 criaturas) · **material** (22) · **exceção à mão** (14).

### O material

Saber de que a criatura é feita é mais específico do que saber a família dela, e por isso o
material manda. **Nem todo material tem fraqueza, e é esse o ponto:** se carne tivesse uma, todo
mundo teria e a regra deixaria de significar alguma coisa.

| Material | Fraqueza | Resistência | Por quê |
|---|---|---|---|
| **pedra** | nenhuma | fogo, corte, perfuração | não queima, a lâmina lasca e a ponta não entra. O que quebra pedra é a marreta, e por isso **Impacto fica de fora** |
| **metal** | **raio** | fogo, corte, perfuração | igual à pedra no físico, mas **conduz** |
| **madeira** | **fogo** | perfuração | queima; a ponta atravessa e não encontra nada vital |
| **planta** | **fogo** | perfuração | verde queima mais devagar que madeira seca, mas queima |
| **carne** | nenhuma | nenhuma | é a linha de base do sistema |
| **carne animada** | nenhuma | perfuração | sem órgão que importe: a ponta entra e não acha o que furar |
| **gosma** | nenhuma | corte, perfuração | nada para furar nem estrutura para cortar; o impacto espalha e ela se junta de novo |
| **gelo** | **fogo** | gelo, perfuração | derrete |
| **água** | **raio** | fogo | conduz, e apaga fogo |
| **fogo** | **água** | fogo | a água apaga |
| **terra** | **água** | fogo | a água leva |
| **ar** | nenhuma | corte, perfuração | não há o que queimar nem o que cortar |

**Metade dos materiais não tem fraqueza nenhuma**, e três deles (carne, pedra, gosma) são
justamente os mais comuns. É o que mantém a fraqueza como exceção e não como estatística.

A linha de **carne animada** rendeu uma unificação: a resistência a Perfuração do morto-vivo
deixa de ser regra própria dos mortos-vivos e passa a ser a mesma regra do golem de carne. Ossos
soltos continuam exceção à mão, porque ali o fio também passa entre as costelas.

A tabela mora em `scripts/lib-materiais.mjs`, e não dentro de um gerador, porque **dois** a usam:
o `gen-elementos.mjs`, que semeia as 308 do livro, e o `gen-monsters.mjs`, que resolve o campo
`material` de uma criatura escrita à mão em `inimigos-custom.json`.

### Três dúvidas que a auditoria levantou, e nenhuma é de classificação

São de **coisas que não existem do outro lado**:

1. **Nada no sistema causa dano `sagrado` ou `profano`.** As duas palavras só aparecem hoje
   *dentro* de dois Efeitos de Luz, como condição ("quem tem fraqueza a luz ou ao sagrado"). São
   **47 criaturas com fraqueza a sagrado e 8 a profano** esperando uma fonte de dano que o livro
   ainda não tem. Ela viria da mecânica de clérigo e paladino, que é a pendência **F3** do Lore.
2. **`prata` não é representável.** `armas.json` não tem campo de material, então "adaga de
   prata" não existe como dado. O vampiro e o lobisomem têm uma fraqueza que nenhuma arma do
   livro consegue disparar.
3. **`sol` não é um ataque, é um ambiente.** Só o vampiro tem, e quem a dispara é a cena, não uma
   jogada. Talvez pertença à ficha de **Ambiente** (Ações & Sistema §8.5) em vez de à régua de
   dano.

Nenhuma das três impede o dado de existir, e por isso ficaram registradas em vez de travarem o
preenchimento. As três viram itens no `Pendencias.md`.

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

> **Leia a §5.4 antes desta lista.** A geometria do improviso mudou em 2026-08-17: a manifestação
> passou a ser **fatias de 60°, 90° ou 120°** saindo do feiticeiro, com o número de fatias travado
> pelo nível, e os moldes da §5.3 viraram o que se compra com XP. Várias pendências abaixo foram
> escritas quando o improviso ainda moldava livremente, e onde as duas discordarem, **valem as §5.3
> e §5.4**. A §5.4 foi reescrita três vezes no mesmo dia, e a lista de erros no fim dela é parte da
> regra: o volume é de **pirâmide** e não de prisma, e o que se conserva ao abrir é a **base**.
>
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

**4c. O que a fraqueza faz em número. RESOLVIDO em 2026-08-10**, e a resposta é a mesma para
todos os tipos:

<p class="formula">Fraqueza: o dano <b>não é absorvido por nada</b> e é <b>agravado</b></p>

Nem armadura, nem resistência, nem Absorção natural, nem a Centelha. Passa inteiro, e ainda não
fecha com descanso nem com a perícia Cura: só com tempo longo ou com a Arte de Cura.

**Com isso o Luz deixa de ser exceção e vira o caso mais visível da regra.** A linha dele na
tabela de dano dizia "agravado, e só contra quem tem fraqueza", o que agora é simplesmente o que
acontece com qualquer elemento: o Luz é agravado contra as criaturas das trevas porque elas têm a
fraqueza, não porque o Luz seja especial. **Uma criatura de água atingida por Raio sofre dano
agravado exatamente pela mesma razão.**

A simetria com a resistência é imperfeita de propósito, e é o que dá peso à ferramenta certa:

| | Efeito |
|---|---|
| **Resistência** | metade, arredondando para cima, e nunca agravado. Entra **entre** a armadura e a Absorção |
| **Fraqueza** | inteiro, **sem absorção nenhuma**, e agravado |

O que isso faz na mesa, com criaturas reais do bestiário:

| Ataque | Hoje | Com a fraqueza |
|---|:--:|:--:|
| Fogo 3d6 no Treant (Centelha 3) | 7,5 · dez conjurações | **10,5 agravado** · sete |
| Adaga de prata no Lobisomem (Absorção 5) | 1,5 · vinte e cinco golpes | **6,5 agravado** · seis |
| Raio 2d6 no Elemental da Água | 6 | **7 agravado** |

**5. Rolagem das Artes.** *(o **Acerto Arcano** já existe e já está na ficha: **Habilidade
Secundária do grupo Conhecimento**, ao lado de Alquimia e Arquitetura, usada com Percepção ou
Destreza nos efeitos mirados.)* O resto está sendo desenhado na frente das Trilhas, não aqui, mas
afeta este documento: a conjuração deixa de ser Ocultismo para todos e passa a variar por
**Tradição**. Quando fechar, as seções 3 e 4 daqui precisam de revisão, porque hoje dizem
"Ocultismo + Atributo".

**6. Trilhas de ensino.** Serão **6 Tradições**, já escritas no capítulo XIV. O que falta é o mapa
**Arte × Trilha** e os números de treino. Frente própria, não se decide aqui.

**7. Metal. RESOLVIDO em 2026-08-15: não vira Arte.** Passa a ser um **bloco de Efeitos de Terra**,
aberto por **Trilha**. Ele falha nas três perguntas da régua informal da seção 3: os verbos dele
(afia, enferruja, aquece a armadura no corpo, arranca a arma da mão, reduz Absorção) são todos
coisas que se fazem com equipamento, e coisa que se faz é Efeito; não tem dano próprio nem
parâmetro próprio; e a tabela de estado da matéria já o põe junto da Terra, em "sólido, metade".
O gancho da "magia de ofício dos anões" é gancho de **Trilha**, não de Arte: é o metalbending da
Toph. Falta escrever os Efeitos e ligar a Trilha, o que é trabalho de conteúdo, não de desenho.

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

**21. Revisar Área × Volume.** *(A13 no `Pendencias.md`.)* O parâmetro inteiro está em revisão pelo
autor, e tudo que foi calibrado contra ele depende do resultado: a escada de Volume, a tabela de
estado da matéria, o teste de que o Volume cabe embaixo da Área do mesmo grau, e o próprio corte
entre corpo e jurisdição.

**22. Revisar os textos do capítulo XV.** *(A14.)* Ele cresceu por acréscimo em várias conversas
seguidas (grau 0, as três travas do improviso, Área ou Volume, estado da matéria) e precisa de uma
passada de edição: ordem das seções, o que ficou repetido, o que ficou sem o porquê.

**23. Revisar as descrições de nível das Artes.** *(A15, e engole o item 11 da seção 11.)* Os textos
de `artes.json` ainda descrevem improvisos que as travas não permitem, e ainda soam como regra
quando viraram exemplo de alocação típica.

**24. A Fonte do Elemento: os elementos que faltam.** *(A16.)* A régua de abundância tem oito
escadas, uma por elemental, e nenhuma para **Areia**, **Som** e o que mais vier. O caso da areia
está descrito na seção 3: a escada da Terra desliza de solo solto para rocha viva conforme sobe, e
por isso um deserto cai perto do fundo dela. Falta decidir quais materiais ganham escada própria, e
se Som é escola de Ar ou outra coisa.

**20. A vizinhança, implementada em 2026-08-15.** Feito:

- **A linha "granular"** entrou na tabela de estado, entre sólido e líquido: areia, cascalho, pó,
  neve solta, cinza. Volume normal (escorre, rende mais chão que rocha) e **dano normal**, sem o
  dobro da Terra, porque material solto não concentra o golpe.
- **Três Efeitos de fronteira entre Raio e Ar:** a **Tempestade** ganhou Vento (*a rajada desce em
  vez do raio*), o **Escudo de Vento** ganhou Raio (*uma coroa de faíscas que aterra o que vem
  voando*) e o **Salto do Vento** ganhou Raio (*o lance curto percorrido como fagulha, antes de
  virar o Passo do Relâmpago*). Quem sabe por uma Arte não paga XP de novo pela outra.
- **A Escola** ficou definida no capítulo XV (`/arcano#escolas`), com o conceito de Efeito de
  fronteira em `regras.json → arcano.efeitos.fronteira`.

**Fica em aberto o mapa das Escolas:** quais existem, onde ficam, e quais Efeitos cada uma abre. É
trabalho de lore, e anda junto com a ligação Arte × Trilha (pendência 6). O caso da Areia está
descrito e serve de molde, mas os Efeitos dela ainda não foram escritos.

**19. O Fogo está magro, e o Raio fica.** A pergunta era se o Raio devia virar subdivisão de Ar ou
de Fogo. A contagem de Efeitos **exclusivos** (fora os compartilhados, como Muro, Aura e Arma
Elemental) respondeu o contrário: **Raio 5, Vento 5, Fogo 3**. O Raio é a Arte com mais conteúdo
próprio das três, e passa nas três perguntas da régua informal: verbos que ninguém tem (saltar de
alvo em alvo, paralisar sem causar dano, virar o próprio raio), física própria (troca Volume por
Comprimento, porque descarga é trajeto) e fonte própria (Tempestade e Céu Aberto **precisam de
céu**). Fundi-lo no Ar era o pior dos dois caminhos: o Ar foi calibrado de propósito **sem dano
direto**, e receber o Céu Aberto o levaria de menos letal a mais letal de uma vez.

O que sobrou de verdade é a pendência inversa: **o Fogo precisa de Efeitos exclusivos.** Três, para
o elemento carro-chefe, é pouco, e dois deles (Brasa Retardada e Chuva de Fogo) são variações de
"fogo que fica". Falta ao Fogo o repertório de verbos que o Raio tem.

**17. A régua de luz, e o halo de Luz e Sombra.** Decidida a ordem: **a régua primeiro**. Hoje o
site inteiro tem duas linhas sobre luz, e são modificadores de furtividade no capítulo de Sentidos
(escuridão −4, campo aberto e iluminado +4). Falta uma escada curta (escuro · penumbra · tocha ·
dia) com o que cada degrau faz nas rolagens e o que cada raça enxerga em cada um. Só depois o halo
pluga nela: o Volume comprado é o **núcleo**, onde o efeito acontece (cega, revela, queima, ou
apaga tudo), e até **três vezes o raio do núcleo** existe o **halo**, que não causa o efeito e só
move a luz do lugar um degrau, para cima na Luz e para baixo na Sombra. O halo sai de graça, não
custa parâmetro, e é o que dá às duas Artes uma borda macia em vez de uma parede.

**18. Passar os Efeitos pela régua nova de Área e Volume.** Doze dos 46 que hoje usam Área medem
corpo e deveriam usar Volume: Lascas, Onda, Maremoto, Sopro do Norte, Tromba, Sarçal, Erguer a
Montanha, Clarão, Aurora, Escudo de Força. Além disso, dois achados da mesma leitura: a **Aura**
chama de `Volume` um parâmetro cuja unidade é "m de raio", e o nome agora colide com a régua
padrão; e a escala própria da **Neblina** chega a 125 m³ no grau 6, contra os 64 m³ que a regra do
gás entrega, um privilégio de quinze vezes sobre a régua base que nunca foi decidido, foi herdado.
Nenhuma dessas é mecânica: cada uma é um julgamento por Efeito.

**14. A dificuldade do teste de concentração.** A seção 5.2 fechou que sustentar um improviso pede
**Ocultismo + Vontade** ao sofrer dano, e deixou a dificuldade em **Média** provisoriamente. Falta
decidir se ela é fixa ou se sobe com o tamanho do golpe (por exemplo, Difícil quando o dano passa
da Absorção, ou um degrau a mais por ferimento já aberto).

**15. O improviso das Artes não elementais.** A regra da 5.2 nasceu das elementais, onde
"manifestação do elemento" quer dizer alguma coisa concreta. Cura, Fascinação, Adivinhação,
Conjuração e Metamorfose já trocam parâmetros na seção 5, e o improviso delas precisa da versão
própria: o que é "área nunca colocada" numa Arte cuja área virou **Plateia**, e o que é
concentração numa Arte cuja duração virou **Firmeza do vínculo**.

**16. A unidade da Área.** Discutido em 2026-08-13 e não fechado. Duas coisas na mesa: converter a
escala de m² para **raio** (0,5 · 1,25 · 2 · 4 · 7 · 12 m, que é a escada atual convertida, sem
rebalancear nada), e trocar Área por **Volume** nos elementos com corpo (água, gelo, terra), usando
a máquina de substituição por Arte que a seção 5 já tem. A 5.2 tirou a urgência disso, porque área
que nunca é colocada não gera as perguntas de ancoragem e de borda que motivaram a discussão, mas
a Água continua sem resposta para "quanta água é esta".

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
8. ~~Portar a **seção 5.2**~~ **FEITO em 2026-08-15**: `regras.json →
   arcano.improviso.combinacoes` e o capítulo XV ganharam as três travas, a tabela dos quatro
   improvisos e o custo da concentração. A `notaArea` deixou de dizer que o molde se escolhe.
9. **Alinhar a seção 5 deste documento à régua do site.** As tabelas de graus e a fórmula de pontos
   ("Arte × 2 + Centelha") descrevem um modelo que não está em lugar nenhum. A régua certa está no
   aviso no topo da seção 5; falta reescrever o corpo dela.
12. **Conferir o grau 0 das oito escadas próprias de Efeito.** Quando os parâmetros ganharam o grau
    0, as escalas dos Efeitos precisaram do degrau correspondente, e eu derivei os oito um passo
    abaixo do primeiro sem conversa: Neblina 0,5³, Muro 1 m, Aura 0,25 m de raio, Terremoto 0,5×0,5,
    Metal Incandescente 1 tick de duração, e traço (nada) em Arma Elemental, Metal Incandescente
    (dano) e Paralisia. Nenhum deles muda o que os graus 1 a 6 já valiam.
10. **Tirar o Ocultismo de `regras.json`.** Dois campos ainda dizem que a conjuração é
    "Ocultismo + Atributo" (`arcano.nota` e `arcano.resistencia.rolagem`), e nenhum deles aparece
    na página. A rolagem definitiva é a pendência 5 (Acerto Arcano e conjuração por Tradição).
11. **Revisar os textos de `artes.json`.** Vários níveis descrevem improvisos que as travas não
    permitem: Fogo 3 "sustentar uma parede baixa de chamas", Fogo 4 "parede de chamas fechando um
    corredor" e "explosão que pega quatro inimigos juntos".
