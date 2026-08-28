# Combate · o que os outros jogos resolveram

> Pesquisa aberta em **2026-08-28**, a pedido da mesa, com um objetivo escrito por quem pediu:
> *"melhorar o combate do Grid, deixando os jogadores tomarem decisões criativas e apenas
> fornecendo a base para serem visualmente executadas."*
>
> **Nada aqui é decisão.** É levantamento com preço estimado, para a mesa escolher. Nenhum arquivo
> do projeto foi tocado além deste.
>
> Companheiro de `Grid_melhorias.md` (a lista de funcionalidades) e de `Grid_Automacao.md` (a lista
> de atritos). Aquele caderno já cita Fire Emblem, FFT, Into the Breach, Grandia, Valkyria, XCOM,
> Divinity e BG3, mas **por outras features**: zona de perigo, informação perfeita, barra de tempo,
> fogo de interceptação, superfícies e o realce do Alt. Este documento não repete nenhuma delas ·
> ele olha para a **economia de ação** e para o **repertório de opções** que cada jogo dá a quem
> está jogando, que é outra pergunta.

---

## 1. O que procuramos, e por quê

A frase do autor tem duas metades, e a segunda é a que manda: o Grid deve **dar base** para a
criatividade e **executar visualmente** o que a mesa decidiu. Ele não deve decidir. Isso já é
doutrina da casa, escrita no `Grid_Automacao.md` §2 e §4, e a pesquisa inteira foi filtrada por ela:

> **Nunca perguntar o que dá para calcular · todo número calculado é um campo editável · a mesa
> escolhe a intenção e o Grid faz a conta · e nada acontece que o mestre não possa desfazer.**

Mais o teto de atrito, que é o número que reprova quase tudo: **um ataque comum custa hoje dois
toques**, e a mesa não aceita dobrar isso.

A pergunta de pesquisa, então, não é "que mecânica legal existe por aí". É esta:

> Que jogo já resolveu **dar mais opções sem cobrar mais toques**, e o que dessa solução sobrevive
> quando quem julga é um mestre humano em vez de um motor de regras rígidas?

E há um achado interno que reorganiza o documento inteiro, encontrado antes de qualquer pesquisa
externa. **O Centelha já tem a mecânica de recompensa à criatividade, e ela não existe no Grid.**

A **Firula** (`habilidades.md` §Firulas) é exatamente o pedido do autor virado regra: *"descrever
uma ação com criatividade e uso do cenário rende um bônus naquele lance"*, em três degraus dados
pelo mestre, **+2 · +1d6 · +2d6**, aberta a qualquer personagem, do camponês ao semideus, sem se
comprar e sem sair de catálogo nenhum. Ela é citada no capítulo de Combate, na fórmula de acerto.

E a palavra **"Firula" não aparece uma única vez** em nenhum arquivo `.ts` ou `.astro` do projeto.
O campo "Ajuste" da folha da ação, que é a válvula do improviso, aceita **só um número inteiro**:
ele consegue escrever +2 e **não consegue escrever +1d6**, que são dois dos três degraus da regra.
O motor por baixo já sabe fazer os dois (`rolarExpr(expr, extraDados, extraFlat)` e o objeto
`ajAtq = { flat, dados }` estão lá, prontos e usados por outras coisas).

Ou seja: a ferramenta que roda o combate não sabe expressar a única regra do sistema que existe
para premiar criatividade. Isso enquadra tudo o que vem abaixo, e é por isso que a proposta 1 da §4
é a mais barata do documento e a que mais serve ao pedido.

---

## 2. Divinity: Original Sin 2, destrinchado

Pedido nominalmente pelo autor. É o jogo mais próximo do que o Grid quer ser, e também o que mais
tem a ensinar **pelo erro**, porque a Larian documentou publicamente o que deu errado.

### 2.1. Os Pontos de Ação

| Item | Valor |
|---|:---:|
| AP no início do combate | **4** |
| AP recuperados por turno | **+4** |
| Teto de AP | **6** |
| Guardado de um turno para o outro | o que couber no teto, ou seja **no máximo 2** |
| Andar | ~**5 m por AP** |
| Ataque básico (arma ou arco) | **2 AP** |
| Habilidades | **1 a 3 AP**, mostrado como pontinhos verdes |

A peça de desenho mais fina não é o 4 nem o 6: é o **acúmulo com teto**. Você não guarda AP, você
apenas evita desperdiçá-lo. Terminar o turno com 1 AP começa o próximo com 5; terminar com 3 começa
com 6 e o excedente evapora. Isso cria uma decisão real de fim de turno (*"gasto o último ponto ou
levo?"*) sem criar acumulação estratégica de longo prazo, que é o que quebraria o ritmo.

E há dois botões que emprestam do futuro, que é o mecanismo mais interessante do jogo para nós:

- **Adrenaline** (1 AP): dá **+2 AP agora** e **−2 AP no turno seguinte**. Ganho líquido de +1 no
  turno, empréstimo de 2. É a **dívida de Ticks** do `Combate_Tempo.md` §4, com outro nome.
- **Executioner** (talento): **+2 AP depois de um golpe fatal**, uma vez por turno.
- **Glass Cannon**: começa todo turno com o teto (6), e em troca **as duas armaduras deixam de te
  proteger de estados**. Corrigindo uma suposição comum: ele não remove a armadura, remove a
  **função de porteira** dela. A armadura continua absorvendo dano.

### 2.2. A ordem de turno não é iniciativa

DOS2 **alterna obrigatoriamente entre os times**, ordenando por Iniciativa dentro de cada um. Com
50, 45 e 35 de um lado e 5, 3 e 1 do outro, a ordem é **50 · 5 · 45 · 3 · 35 · 1**: o inimigo de 5
age antes do seu personagem de 45. Nenhum time joga duas vezes seguidas.

A consequência de desenho é forte e vale anotar: **Iniciativa deixa de ser um recurso distribuído e
vira um limiar**. Basta *um* personagem rápido para o time inteiro tomar a primeira ação; investir
nos outros três só decide a ordem interna. Isso é o oposto exato da nossa régua (`Combate_Tempo.md`
§15.10), em que a iniciativa de cada um vale por si e distribui os Ticks de entrada.

### 2.3. As superfícies

É a parte mais bem resolvida do jogo, e a que o `Grid_melhorias.md` já anotou. O que a pesquisa
acrescenta é o **vocabulário fechado** e a regra de combinação:

- água + eletricidade = **água eletrificada** → Shocked · e Shocked sobre Shocked vira **Stunned**;
- sangue + eletricidade = o mesmo (sangue é água para efeito de regra);
- óleo + fogo = **explosão**, e o chão vira fogo · veneno + fogo, idem;
- fogo + água = **vapor**, e o chão seca · vapor + eletricidade = vapor eletrificado, que **anda**;
- gelo sobre água ou sangue = congela, com chance de derrubar · gelo + fogo = volta a ser água;
- **Necrofire**: queima e **não apaga** com água nem gelo.

E a camada que multiplica tudo: **cada superfície tem versão abençoada e amaldiçoada**. Água
abençoada cura, amaldiçoada aplica Decaying; óleo abençoado dá Fortified. Doze superfícies viram
trinta e seis estados com o mesmo botão.

Duas coisas importam para nós:

1. **Óleo aplica Slowed ignorando a armadura mágica**, e teia ignora as duas. Ou seja, mesmo o jogo
   que criou a porteira abriu exceções nela, o que é confissão de que a porteira era rígida demais.
2. A duração é curta e renovável: pisar aplica o estado por **1 turno** (3 para Chilled), renovando
   enquanto você ficar em cima. A superfície não é uma bomba, é um **chão que cobra pedágio**.

### 2.4. As duas armaduras, e por que a Larian desistiu delas

A regra: duas barras acima da Vida, uma física e uma mágica. **Enquanto a barra correspondente está
acima de zero, o estado de controle tem 0% de chance de aplicar; quando ela zera, 100%.** Não há
rolagem. Knockdown e sangramento entram pela física; congelar, queimar, encantar e aterrorizar pela
mágica. Petrificar, contra a intuição, é **física**, apesar de vir de magia.

A comunidade reclama disto há oito anos, e a objeção mais econômica que achei é esta:

> *"Crowd control effects are the kind of thing you do before damage, not after hitting them for a
> bit."*

**O sistema inverte a ordem natural do controle.** Em quase todo tático você controla para depois
bater; no DOS2 você bate para depois controlar, e quando o controle chega ele já não decide nada. A
segunda queixa mais citada é de composição: *"it's always easier to hammer through one of the
defenses than both"* · duas barras separadas **punem o grupo de dano misto** e premiam o grupo
monocromático, que é o contrário do que um sistema de elementos deveria querer.

E o achado mais valioso da pesquisa inteira: **a própria Larian diagnosticou que o defeito era de
dados, não de motor.** Nick Pechenin, designer de sistemas, em julho de 2018:

> *"Something that was in the design from the start, but that we've deviated from by the end of
> classic DOS2 was the idea that most characters should have disproportionately larger amount of
> one of the Armours. (…) giving many enemies even amounts of Armours led to bullet-spongy
> feeling."*

A intenção era que **cada criatura tivesse um flanco óbvio**. Quando o bestiário foi preenchido com
barras equilibradas, o jogador perdeu a decisão ("por onde eu entro?") e sobrou a moagem. É uma
lição que este projeto já conhece por outro caminho: a §B10 do bestiário aprendeu que *correção por
cima de arquivo gerado morre no regen*, e aqui a versão é **regra boa com bestiário mal preenchido
vira regra ruim**. Com 309 criaturas, é um risco nosso e não teórico.

Em janeiro de 2026, no AMA do Divinity novo, a Larian confirmou que **o sistema de duas armaduras
não volta**, mantendo o objetivo (não deixar controle de nível 1 trivializar chefes) e jogando fora
o mecanismo (amarrar controle a dano).

### 2.5. Altura e alcance

Direto do arquivo de dados do jogo:

| Constante | Valor |
|---|:---:|
| Diferença de altura para contar como terreno alto | **2,4 m** |
| Bônus de dano atacando de cima | **+20%** |
| Penalidade atacando de baixo | **−10%** |
| Multiplicador de alcance de cima | **2,5×** |

Detalhe que corrige uma suposição frequente: **DOS2 não tem rolagem de acerto**. Ataques normais
acertam sempre, salvo cegueira e afins. A altura mexe em **dano e alcance**, nunca em acerto. Nossa
tabela de `combateTatico` põe terreno alto em **−2 na Defesa do alvo**, ou seja, no acerto: são
eixos diferentes, e o nosso é o compatível com um jogo de dado.

### 2.6. O que sobra do DOS2 quando o mestre é humano

O melhor do DOS2 é o **chão que participa** e a **economia com empréstimo**. O pior é tudo o que
depende de o computador aplicar uma regra binária sem discussão: a porteira 0%/100% das armaduras
só é jogável porque ninguém precisa julgar nada. Numa mesa, uma regra que diz "enquanto essa barra
não zerar, nada acontece" transforma o mestre em contador de barras, e transforma o jogador em
alguém que pergunta *"já dá?"* toda rodada. Voltamos a isso na §5.

---

## 3. As economias de ação, comparadas

A coluna que importa é a última: **atrito de mesa** é o que reprova ideia boa.

| Jogo | Moeda de ação | O que ela compra | Atrito de mesa |
|---|---|---|---|
| **Centelha, hoje** | **Ticks** (P/G/R), a Velocidade da ação | tudo: golpe, passo, Arte, improviso. O ciclo é a moeda única | baixo, porque a régua deriva da arma e ninguém escolhe um número |
| **D&D 5e / BG3** | ação + ação bônus + movimento + reação | quatro **reservas tipadas que não se trocam** | médio: a pergunta "isso é ação ou bônus?" volta toda rodada, e a resposta está numa tabela |
| **Pathfinder 2e** | **3 ações** + 1 reação, fungíveis | qualquer coisa custa 1, 2 ou 3; repetir ataque custa **−5 e −10** (−4/−8 com arma ágil) | baixo e elegante, mas o turno fica longo: três decisões por pessoa por rodada |
| **XCOM 2** | 2 ações, e **atirar encerra o turno** | mover-mover, ou mover-atirar, ou atirar | baixíssimo, à custa de o repertório ser minúsculo |
| **FFT / Tactics Ogre** | **CT**, que sobe pela Velocidade e age em 100 | a ação e o tempo até a próxima: **−100 se moveu e agiu, −80 se fez só um, −60 se não fez nada** | médio: é contabilidade, e um computador a esconde |
| **Grandia** | barra **IP** com zona de comando e de ação | a ação, e a janela em que se pode ser cancelado | é a nossa régua, desenhada. O atrito mora todo na tela |
| **Valkyria Chronicles** | **CP** por turno + **AP contínuo** por metro andado | ativar uma unidade, e depois metros em tempo real | alto num jogo de mesa: AP contínuo é medir régua o tempo todo |
| **Into the Breach** | 1 ação por mecha, tabuleiro 8×8 | mover e usar uma arma | mínimo, porque o repertório é fixo e o mapa é minúsculo |
| **Fire Emblem** | mover + agir | a posição, e só | mínimo: o combate é **resolvido**, não jogado |
| **Frozen Synapse** | ordens escritas numa **janela de ~5 segundos** | trajeto, mira, postura e a ordem condicional | alto para papel, baixo para tela: é planejamento, não contabilidade |
| **Atlas Reactor** | 1 ação, **20 segundos** para decidir, resolução em 4 fases | a ação, dentro da fase dela | médio: exige que todos declarem antes de qualquer coisa acontecer |
| **Infinity** (mesa!) | **Ordens** do time, e o **ARO** do lado reativo | o ativo declara, o reativo responde, e os dois resolvem juntos | alto, mas é a prova de que resolução simultânea funciona **em papel** |
| **Gloomhaven** (mesa) | 2 cartas por rodada, escolhidas em segredo | a iniciativa (carta de cima) e duas metades de ação | baixo, e o segredo é regra: proibido dizer os números |
| **Blades in the Dark** | nenhuma: **posição e efeito** | o mestre classifica a intenção antes do dado | mínimo, e é o modelo mais próximo de "o mestre julga" |

Três leituras que caem desta tabela.

**A moeda única vence a moeda múltipla.** Pathfinder 2e é celebrado justamente por ter trocado as
quatro moedas do 5e por uma. Nós já temos moeda única (o Tick) e ela é ainda melhor, porque é
contínua em vez de granular: um golpe pode custar 5 ou 7, e não "uma ação".

**"Fazer menos" precisa ter preço, e três sistemas cobram por isso.** No FFT, mover e agir custa
**−100** de CT, fazer só uma das duas custa **−80** e ficar parado custa **−60**: parar é a jogada
mais barata e por isso é jogada de verdade. O Tactics Ogre faz o mesmo em porcentagem (**100% ·
75% · 50%** do Wait Time), e o guia resume assim: *"uma unidade que não faz nada consegue não fazer
nada duas vezes mais rápido do que outra fazendo alguma coisa."* Nós **não temos esse degrau**: no
P/G/R o ciclo é da ação, e não agir simplesmente não gasta Tick. Vale anotar como pergunta em
aberto, não como proposta · a nossa versão disso é o **⏳ Esperar 1 Tick**, que já existe mas só
serve para limpar contrapé.

**Quem tem o repertório menor tem o atrito menor, e isso não é elogio.** Fire Emblem e Into the
Breach são leves porque quase não há o que escolher. O pedido do autor é o inverso: mais opções.
Portanto o atrito **vai** subir em algum lugar, e a pergunta certa é *onde deixar subir*.

**E o único jogo da tabela que é de mesa e resolve simultâneo é o Infinity.** Ele consegue porque
tem uma **ordem de declaração rígida**: o ativo declara a primeira metade da ação, o reativo declara
todos os AROs, e só então os dados rolam num **Face to Face Roll**, em que o sucesso mais alto
cancela o mais baixo. A lição não é o Face to Face (que não cabe em nós, ver §5), é a **cerimônia
de declaração**: simultaneidade em papel exige uma ordem fixa de quem fala quando, senão vira
discussão.

---

## 4. O que aproveita para o Centelha

Ordenado por relação valor/custo. Cada item traz **(a)** a ideia, **(b)** por que cabe na régua de
Ticks que já temos, **(c)** o que exige de regra nova e de tela, e **(d)** o tamanho: **P** uma
tarde · **M** médio · **G** grande.

---

### 4.1 · A Firula vira botão

**(a) A ideia.** Três botões na folha da ação, `Firula 1 · 2 · 3`, que somam **+2 · +1d6 · +2d6** ao
bolo, com o campo de motivo que já existe passando a ser obrigatório quando um deles é usado. O
mestre clica o degrau, o jogador escreve a frase, e a linha vai para o registro com o porquê junto.

**(b) Por que cabe.** Não é regra nova: é `habilidades.md` §Firulas, escrita e publicada, aplicada
na fórmula de acerto do capítulo de Combate. O `Golpe_Tardio.md` §4 já discutiu **em que Tick** ela
entra, e a mesa já decidiu (decisão 2 da §9): **no Tick do Golpe**, porque ali a descrição casa com
o mundo em que o golpe cai. Está listada explicitamente como pendência da **fatia 2**.

**(c) O que exige.** De regra: nada. De tela: três botões e uma linha que empurre o degrau para
`ajAtq.flat` ou `ajAtq.dados` em vez de para o campo de veredito. O motor já aceita dados extras
(`rolarExpr(expr, extraDados, extraFlat)`), e o objeto `ajAtq = { flat, dados }` já existe e já
chega à rolagem. **Zero toque a mais** no caminho comum, porque quem não usa Firula não vê os
botões acesos de outro jeito que não o de hoje.

**(d) Tamanho: P.** É a menor coisa do documento e a que mais serve ao pedido do autor. Enquanto ela
não existir, a mesa que quiser premiar criatividade tem de traduzir "+1d6" para um número inteiro
na mão, e o registro guarda o número em vez da razão.

> **Por que ela é a primeira.** O pedido é "dar base para a criatividade". O sistema já tem a
> recompensa; o que falta é a ferramenta saber dizê-la. Toda proposta abaixo é mais cara que esta e
> nenhuma vale mais.

---

### 4.2 · Agarrar, derrubar, empurrar: a ação-base que nunca foi escrita

**(a) A ideia.** Escrever no capítulo de Combate a manobra de controle: uma ação com a régua P/G/R
normal, que em vez de dano entrega **uma condição** (`agarrado`, `caido`, `imobilizado`) ou
**metros de deslocamento forçado**.

**(b) Por que cabe.** Porque o buraco é grande e está tapado com fita adesiva em três lugares
diferentes:

- as **condições já existem** em `condicoes.json`, com número e tudo: `agarrado` (Defesa −2),
  `imobilizado` (Defesa −4, ação −2), `caido` (−2 de perto, +2 de longe);
- existe um **Caminho inteiro** de Proezas chamado **Agarrão do Urso**, com nove Técnicas, e a
  primeira delas, *Pegada de Ferro*, diz **"+3 para agarrar e manter agarrões"**. Ou seja, há
  Técnicas compradas com XP que modificam uma rolagem que **o capítulo nunca definiu**;
- o `Golpe_Tardio.md` §12 usa o agarrão como **contrapartida de balanceamento**, escrito assim:
  *"a contrapartida existente é o agarrão, que é uma ação inteira"* · o argumento que sustenta a
  decisão de deixar o duelista escapar do guerreiro de placa **apoia-se numa regra que não existe**;
- e o `Acoes_Catalogo.md` registra a lacuna de propósito: *"Agarrar, imobilizar, derrubar · fica no
  capítulo de Combate, não aqui. Anotado só para não ser esquecido."*

E o empurrão tem a física **pronta**. O efeito `empurrao-elemental` das Artes diz literalmente que a
Arte *"entra no lugar dos músculos nas tabelas de Força"*: usa a **FAH** para saber se o alvo sai do
lugar e a **FAA** para saber quanto ele voa. As duas tabelas estão calibradas, no `regras.json`, e
aplicadas no site desde agosto. **Um empurrão mundano é a mesma conta com a Força de verdade.**

**(c) O que exige.** De regra, a parte cara: contra o que se rola. O sistema tem Defesa passiva (o
alvo não rola), então o modelo natural é `Força + Atletismo` contra um valor passivo do alvo, com a
Margem comprando degrau (metros a mais, ou a diferença entre derrubar e agarrar). O que **não** pode
acontecer é virar subsistema com escada própria: a moeda tem de ser a que já existe, Ticks e Margem.
De tela: é a caixa "outra coisa" com o resultado tipado, ou um item a mais na manobra da folha.

**(d) Tamanho: M**, quase todo em decisão de regra e quase nada em código. O Grid já sabe aplicar
condição e já sabe mover peça.

> É a proposta de maior valor do documento depois da Firula, e por um motivo que não é de gosto: ela
> não acrescenta uma camada, ela **fecha um buraco que três documentos já estão contornando**.

> **O aviso, e ele é caro.** O Baldur's Gate 3 é o estudo de caso de como errar exatamente esta
> regra. Na mesa da 5e, empurrar **substitui um ataque** do Attack action, é **teste oposto**, e
> move **1,5 m**. O BG3 mudou as três coisas de uma vez: virou **ação bônus**, virou teste contra
> **CD estática**, e passou a mover **de 1 a 6 metros**. Somado à verticalidade dos mapas, o
> resultado é o que o fórum da própria Larian registra: empurrar *"becomes a 'Save or Die' spell.
> All you need is a nearby chasm"*, com o diagnóstico da comunidade sendo literalmente *"shoving
> distance is too large"* e *"shove is a bonus action, it should be part of the attack action"*.
>
> A lição é de método, não de número: **eles mudaram o preço e a topologia ao mesmo tempo**, e foi a
> interação, não cada mudança sozinha, que arrebentou os encontros. Nós vamos mexer na topologia na
> proposta 4.3 (o cenário no tabuleiro). Portanto, se as duas forem feitas, a manobra de controle
> tem de **custar uma ação inteira** (que é o que o `Golpe_Tardio.md` §12 já supõe ao chamar o
> agarrão de *"uma ação inteira"*) e a distância tem de sair da tabela de **FAH**, que é física
> medida, e não de um número escolhido na tela.

---

### 4.3 · O cenário existe no tabuleiro

**(a) A ideia.** Objetos no hexágono: a mesa, o barril, o lampião, a estante. Cada um com três
números e nada mais · **quantos hexágonos ocupa**, **quanta cobertura dá** (o ±2/±4 que a tabela de
`combateTatico` já tem) e **se pode ser destruído ou empurrado**.

**(b) Por que cabe.** Porque hoje o mapa é uma imagem de fundo e o motor não sabe que há um móvel
nela. E isso trava, sozinho, quatro coisas que os documentos já querem:

- **linha de visão e cobertura**, listadas em `Grid_melhorias.md` como bloqueadas por uma razão só:
  *"depende de existirem paredes no mapa, que hoje não existem"*;
- a **névoa que não conhece parede** (`Grid_melhorias.md`, o que a névoa ainda não faz);
- o **redirecionamento** e o **acompanhar** do golpe tardio, que precisam saber o que estorva;
- e a **Firula**, que o `Golpe_Tardio.md` §4 diz que *"cai junto"* se o cenário que ela usava não
  estiver mais lá · uma regra que só é jogável se o cenário for uma coisa que o motor conhece.

Vale citar o argumento de lá inteiro, porque ele é bonito e é nosso: pôr o cenário no tabuleiro
*"dá um motivo mecânico para o inimigo destruir o cenário no meio do Preparo, que é exatamente o
tipo de jogada que a Firula existe para premiar"*.

**(c) O que exige.** De regra: nada novo. Os modificadores de cobertura estão escritos e têm teto
(±6). De tela e banco: uma camada de objetos por arena, com desenho, e o cálculo de linha de visão.
É a peça mais cara do documento.

**(d) Tamanho: G.** Mas é a **fundação** de quatro itens que já estão nas listas, e por isso o custo
se divide por quatro. Se alguma coisa grande for feita, é esta.

---

### 4.4 · A intenção condicional, do Frozen Synapse

**(a) A ideia.** Ao declarar no simultâneo, poder pendurar **uma** condição na ação: *"avanço, e se
ele sair do alcance eu paro"*, *"preparo o golpe, e se alguém entrar no meu alcance eu bato nele"*.
Uma só, escolhida de uma lista curta, e o Grid **avisa** quando o gatilho acontece · não resolve.

**(b) Por que cabe.** O Frozen Synapse dá a cada soldado *"their default action upon seeing an enemy
force"*, e é isso que faz um plano cego sobreviver ao contato. O nosso problema é o mesmo, e está
escrito na §3.2 do `Combate_Simultaneo.md` como as duas primeiras dores:

> **1. O alvo que sai de baixo.** A agenda é projetada na declaração assumindo o alvo parado.
> **2. A perseguição perdida.** Se o alvo é mais rápido, o trajeto nunca fecha; o motor já sabe
> avisar (`previsaoDeEncontro` devolve `null`) e a caixa não usa isso.

E o encaixe é limpo: o campo `acao` no banco é um `jsonb` que **já carrega intenção** (`mov` com
destino, modo, m/Tick e trajetória automática, além de `golpes`, `livre` e `desde`). Uma chave
`gatilho` ao lado é uma chave, não uma tabela.

Há também a condição `preparado` (*"Ação preparada · declarou um gatilho e espera"*), que já está no
`condicoes.json` **sem nenhuma regra que a produza**, exatamente como as condições de agarrão.

**(c) O que exige.** De regra: a decisão sobre se um gatilho disparado é uma **ação fora de hora**
(e paga a Velocidade, com as quatro travas medidas da §4.1 do `Combate_Tempo.md`) ou algo mais
barato. A resposta segura é a primeira, porque a bancada já mediu o que acontece sem as travas: sem
a de "uma por ação", o combate cai de 32 para **9,6 Ticks**. De tela: um seletor na caixa de
declaração e um destaque quando o gatilho vence · o que responde, de quebra, a pergunta 3 em aberto
da §3 do `Combate_Simultaneo.md` ("o que a tela destaca quando a resposta muda de continuar para
decidir").

**(d) Tamanho: M.** E é a proposta que mais melhora o modo simultâneo especificamente.

> **O irmão barato desta ideia, e ele resolve um problema nomeado.** O FFT distingue, na hora de
> mirar, **mirar na unidade** de **mirar no chão**. Mirado na unidade, a área **acompanha o alvo**
> para onde ele for. Mirado num painel, ela fica **pregada no tile**, e quem sair antes da
> resolução escapa · se todos saírem, a ação falha no lançamento. O Aim do Arqueiro é só painel, e
> por isso é sempre esquivável andando.
>
> Isso é exatamente a dor 1 da §3.2 do `Combate_Simultaneo.md` (*"o alvo que sai de baixo"*) e a
> decisão 6 da §9 do `Golpe_Tardio.md` (*"o atacante acompanha se puder"*), com uma resposta que
> **o jogador escolhe na declaração em vez de o mestre arbitrar depois**: eu miro **nele** (e
> persigo, pagando o passo) ou miro **naquele hexágono** (e se ele saiu, azar o meu). Uma chave
> booleana na `mov`/`acao`, que já guarda `alvo` **ou** `destino`. **Tamanho: P**, e é a coisa mais
> barata do documento depois da Firula e da cerimônia.

---

### 4.5 · Projetar o plano antes de confirmar

**(a) A ideia.** Na caixa de declaração, uma linha de projeção: *"com esses passos, o encontro é no
Tick 7"* ou *"com esses passos, você nunca alcança"*. Uma frase, não uma simulação.

**(b) Por que cabe.** O Frozen Synapse deixa o jogador *"simulate the projected results of the
current turn, assuming that enemy forces maintain their current strategies"*, e essa cláusula final
é a chave: a projeção **supõe que ninguém mude de ideia**, e por isso pode estar errada, e por isso
não é decisão · é leitura. É exatamente o que o `Grid_Automacao.md` chama de *mostra e não aplica*,
que o projeto já faz com a distância, com o alcance e com o contrapé.

E o motor já responde. `previsaoDeEncontro` existe em `combate-tempo.ts` e devolve `null` quando o
alcance nunca fecha; a §3.2 do `Combate_Simultaneo.md` classifica a ausência como *"pendente de
tela, não de motor"*.

**(c) O que exige.** De regra: nada. De tela: uma linha na caixa que já existe. **Zero toque a mais.**

**(d) Tamanho: P.**

---

### 4.6 · O terreno como zona, reusando o motor das Artes

**(a) A ideia.** Poça de óleo, brasa, escombro, gelo, água: um pincel do mestre que marca hexágonos,
e um efeito ao entrar. Sem tabela de combinações elementais: **cinco ou seis chãos**, e o resto é
julgamento do mestre.

**(b) Por que cabe, e este é o argumento de custo mais forte do documento.** O motor de superfícies
**já está construído e rodando**, só que exclusivo da magia. O `efeitos.json` tem **26 efeitos de
forma `zona`**, com âncora em ponto, gatilho `ao-entrar` e persistência; e **66 efeitos aplicam
condição**, entre elas as três que interessam · `chao-traicoeiro → terreno-dificil`,
`empurrao-elemental → caido`, `prisao → imobilizado`. O tabuleiro desenha tudo isso hoje
(`OCUPA_CHAO` em `artes-grid-mesa.ts` inclui `zona`, `aura`, `muro`, `cone` e `linha`).

Falta só uma **fonte não mágica** para a mesma coisa. E a condição `terreno-dificil` já traz o
número escrito (*"movimento pela metade e ações custam 1 Tick a mais"*).

**(c) O que exige.** De regra: a decisão que o `Grid_melhorias.md` já marca como `[DECIDIR]`
("terreno por hexágono"). De tela: um pincel e uma paleta curta.

**(d) Tamanho: M**, e seria G se o motor não existisse. Ele existe.

> **Aviso, tirado da §2.4.** A tentação aqui é copiar a matriz de combinações do DOS2 (óleo+fogo,
> vapor+eletricidade, abençoado e amaldiçoado). Não copie. Numa mesa, uma matriz de combinações é
> uma tabela que o mestre consulta, e o Centelha já tem 24 Artes com 139 Efeitos. Cinco chãos e um
> mestre bastam.

---

### 4.7 · O acúmulo com teto, do DOS2, aplicado ao Preparo

**(a) A ideia.** Formalizar o teto da **carga voluntária** (comprar Preparo por bônus), que hoje
está em 3 Ticks *"porque acima disso não foi testado"*, com a lógica do acúmulo do DOS2: você não
guarda tempo, você só evita desperdiçá-lo.

**(b) Por que cabe.** A carga voluntária é o nosso "guardar AP", e está medida: **1 Tick de Preparo
comprado vale +2 na rolagem**, subindo devagar (+2,2 no primeiro, ~+2,7 no terceiro) e mais barato
para a arma pesada. É a **K9**, aberta. O DOS2 mostra que o teto é o que impede a acumulação de
virar estratégia, e que um teto **baixo** (2 de 6, um terço) basta para criar a decisão sem criar o
laço.

**(c) O que exige.** De regra: travar o teto (a proposta de 3 já está escrita) e conferir contra a
interrupção, que o simulador não modela durante a carga · limitação registrada na §13 do
`Combate_Tempo.md`. De tela: o botão *"+1 Tick, +2"* que a §12 já desenhou, mostrando o novo
instante de saída.

**(d) Tamanho: P de tela, M de decisão.** Fecha uma pendência antiga em vez de abrir uma nova.

---

### 4.8 · A cerimônia de declaração, do Infinity

**(a) A ideia.** Uma ordem fixa de quem fala quando, no modo simultâneo, escrita como regra de mesa
e desenhada na tela: **(1)** o mestre anuncia o Tick · **(2)** quem está livre declara, em qualquer
ordem, sem ver a declaração alheia · **(3)** o mestre avança · **(4)** o que vence naquele Tick
resolve.

**(b) Por que cabe.** O Infinity é o único jogo **de mesa** que resolve simultâneo de verdade, e o
que faz isso funcionar não é a mecânica de dado, é a cerimônia: o ativo declara, o reativo declara
os AROs, e só então rola. Sem uma ordem de fala, "todo mundo decide junto" vira "quem fala mais alto
decide depois de ouvir os outros".

E nós já temos o problema medido, do lado errado: a §15.11 do `Combate_Tempo.md` descobriu que a
escada era lida **pela ordem em que o mestre digitava**, e que com Preparo 0 *"quem é resolvido
primeiro vence 3,2% das vezes"* · a jogada ótima virava **nunca declarar primeiro**. Aquilo foi
consertado no motor (`faseDeQuemVaiAgir`, os dois abertos). A cerimônia é o mesmo conserto do lado
da mesa.

O Gloomhaven mostra a versão fraca e barata da mesma coisa, e é de tabuleiro: a seleção é simultânea
e **é proibido dizer os números** · pode-se combinar planos, não valores. É uma regra de etiqueta,
não de motor, e custa zero.

E vale saber que a ideia é velhíssima, porque isso tira dela o ar de novidade arriscada. As regras
de combate monástico da **Dragon Magazine nº 2, de 1976**, já mandavam os jogadores **escreverem
seis movimentos com antecedência**, com certos blocks anulando certos strikes · a matriz de ação
contra ação do *Fight!* do Burning Wheel quase trinta anos antes dele. Declarar às cegas e resolver
junto é uma das coisas mais antigas do hobby, e o que sempre a matou não foi a mecânica, foi a
contabilidade. **O Grid é exatamente o que remove a contabilidade.**

**(c) O que exige.** De regra: um parágrafo. De tela: nada obrigatório · o `grupoDaVez` já devolve
todos os livres e o botão já conta quantos faltam decidir.

**(d) Tamanho: P.** É o item mais barato depois da Firula, e o único que não é código.

---

### 4.9 · A ação preparada e a guarda, no lugar do ataque de oportunidade

**(a) A ideia.** Não criar zona de controle. Em vez disso, dar ao gatilho da 4.4 um caso nomeado:
**guardar um trecho** (*"se alguém passar aqui, eu bato"*), pago como ação fora de hora.

**(b) Por que cabe.** O `Golpe_Tardio.md` §11 registra a ausência com todas as letras: *"não existe
zona de controle nem ataque de oportunidade. Ninguém é punido por sair de perto de ninguém. A única
reação do sistema é a ação fora de hora, que é paga e voluntária, e não um gatilho."*

Isso é uma escolha, não um esquecimento, e o Overwatch do XCOM 2 e o fogo de interceptação do
Valkyria mostram o desenho alternativo: **gastar a ação para cobrir um espaço** em vez de ganhar de
graça um golpe por alguém ter andado. Essa versão respeita a nossa doutrina, porque continua sendo
**voluntária e paga**, que é a trava medida.

**(c) O que exige.** De regra: encaixar no catálogo da §4.3 do `Combate_Tempo.md`, que já tem seis
ações fora de hora com preço. De tela: é a mesma peça da 4.4.

**(d) Tamanho: P**, se a 4.4 for feita · **M** sozinha.

> **A armadilha, e o XCOM 2 a documentou inteira.** Lá o Overwatch custa 1 ação **e encerra o
> turno**, e o tiro sai com a chance de acerto multiplicada por **0,7** (0,6 contra quem corre) e
> **sem poder crititar**. Mesmo assim a jogada dominante virou o *overwatch crawl*: avançar um
> passo por turno com todo mundo de guarda. Jake Solomon explicou por que precisaram do cronômetro
> de missão:
>
> > *"if there is no pressure on the player to play suboptimally, to take risks, then the player can
> > play every mission almost exactly the same way. Just move super slowly, overwatch, be super
> > cautious."*
>
> E o cronômetro, o remédio, matou o Hunker Down, que era o outro verbo defensivo do jogo. Josh
> Bycer resume a cadeia: a regra base proíbe atirar e reposicionar, então metade das perks do jogo
> existe só para **recomprar pontualmente o que a regra base proibiu**.
>
> **Nós temos o freio de graça, e ele já está medido.** Guardar um trecho seria uma ação fora de
> hora, e a §4 do `Combate_Tempo.md` mostrou que quem reage *"paga a Velocidade inteira e fica com a
> guarda travada"*, e que a regra é **freio da arma leve, não vantagem dela**. Ou seja: no Centelha
> ficar de guarda já custa o futuro, e o crawl não compensa sozinho. O que **não** se pode fazer é
> baratear isso para "acender de graça", que é a versão que produziria o crawl.

---

### 4.10 · O robô da criatura mostra a intenção, não a esconde

**(a) A ideia.** O modo automático (`decisaoAutomatica`) já decide o que a criatura faz. Fazer com
que ele **escreva a intenção antes de executar**, para o mestre poder vetar: *"o lobo vai atacar
Kael"*, com um botão de trocar.

**(b) Por que cabe.** É o Into the Breach lido pelo lado certo. Justin Ma e Matthew Davis queriam
que *"cada morte parecesse sua culpa"*, e para isso telegrafaram tudo. Mas eles também dizem que com
tudo telegrafado *"o jogo se parece com um quebra-cabeça"* · e um RPG não quer virar quebra-cabeça.

A saída é telegrafar **para o mestre**, e não para a mesa. E a infraestrutura de assimetria já está
pronta: a migração 27 devolve `acao` **sem `arma` e sem `alvo`** para quem não pode ver, de modo que
*"o jogador vê QUE alguém está montando alguma coisa, o mestre vê O QUÊ"*.

Isso também conserta o item 5 da §3.2 (a fuga do robô que não conhece a borda do tabuleiro): com a
intenção à vista antes do passo, o mestre corrige antes em vez de desfazer depois.

**(c) De tela:** uma linha na faixa de pendências, que já existe.

**(d) Tamanho: P.**

---

### 4.11 · O botão que só acende quando cabe, aplicado ao repertório novo

**(a) A ideia.** Nenhuma das propostas acima ganha item fixo de menu. Todas entram pela regra que o
Grid já usa e que é a resposta ao "menu de trinta botões": **o item só existe quando é legal**.

**(b) Por que cabe.** Já é o desenho da casa, e está escrito na §14.7 do `Combate_Tempo.md`
(*"só acende o que cabe (…) o jogador nunca pergunta 'posso?'"*) e implementado: o **✋ Abortar** só
aparece em Preparo, o **⏳ Esperar 1 Tick** só aparece para quem tem contrapé (e o rótulo mostra o
antes e o depois), o **🤖 Modo automático** só aparece em criatura no simultâneo. A regra se ensina
**pela ausência do botão**, que é a única forma de crescer o repertório sem crescer o menu.

O contra-exemplo está dentro de casa: há **461 Técnicas** no `tecnicas.json`. Um menu que listasse
opções em vez de filtrá-las já teria morrido.

**(c) De regra:** nada. É uma restrição de projeto para as propostas 4.2, 4.4 e 4.9.

**(d) Tamanho: zero, e é a que impede as outras de ficarem caras.**

---

## 5. O que descartamos, e por quê

### 5.1 · As duas armaduras que porteiam o controle (DOS2)

**Não.** Três motivos, em ordem de força.

O primeiro é que **a Larian desistiu dela**, e não por gosto: o AMA de janeiro de 2026 confirma que
o sistema não volta. Copiar em 2026 um mecanismo que o autor original abandonou pede um argumento
que não temos.

O segundo é o que a comunidade formulou melhor: **ela inverte a ordem natural do controle**. Bater
para depois controlar é o oposto de agarrar alguém para segurá-lo.

O terceiro é que **nós já medimos o defeito irmão**. A §4.5 do `Combate_Tempo.md` testou o aparo
desesperado (comprar +6 de Defesa com dívida) e o veredito foi categórico: *"comprar número de
Defesa vira um laço, porque todo golpe é uma nova oportunidade de comprar"*, com o combate crescendo
**70%** e o equilíbrio entre classes girando 33 pontos. Uma barra que precisa ser esvaziada antes de
qualquer coisa acontecer é a mesma família de problema: uma condição numérica que se interpõe entre
a intenção e o efeito.

E o quarto, específico nosso: com **309 criaturas** no bestiário, herdaríamos exatamente a falha que
a Larian descreveu · a regra depende de cada criatura ter um flanco desproporcional, e um bestiário
preenchido por script produz barras equilibradas.

### 5.2 · O Face to Face Roll do Infinity, e qualquer defesa rolada

**Não**, e este é curto porque é constitucional. O capítulo de Combate diz, na cara: *"A Defesa é um
valor **fixo** e **passivo** · o alvo não rola para se defender."* Um sistema de rolagem oposta
dobra o número de dados por golpe e muda o chão de todas as tabelas de calibragem da frente K.

Fica **a cerimônia** do Infinity (proposta 4.8), que é a parte que não custa nada.

### 5.3 · Informação perfeita (Into the Breach) para os jogadores

**Não, e é decisão já tomada.** A decisão 8 da §9 do `Golpe_Tardio.md` fechou que ao declarar se vê
**nada**: alvo, manobra e tempo, e a conta toda só aparece na resolução. E a migração 27 esconde
arma e alvo do jogador de propósito.

O motivo é o que os próprios autores do Into the Breach dizem: com tudo telegrafado, *"o jogo se
parece com um quebra-cabeça"*. Quebra-cabeça é um gênero, e é um bom gênero, mas é o oposto de uma
mesa em que o mestre improvisa. Numa mesa, informação perfeita mata a descrição: ninguém narra o que
já está na tela.

O que fica é a versão assimétrica (proposta 4.10): **telegrafar para o mestre**.

### 5.4 · Os Pontos de Ação como moeda (DOS2, XCOM, Valkyria)

**Não, porque já temos moeda melhor.** O AP é uma granulação grosseira do tempo · 4 unidades por
turno, cada ação custando 1, 2 ou 3. Nossa moeda é o **Tick**, que é a mesma ideia com resolução
fina e com ancoragem física (Tick ≈ 1 segundo), e que já sustenta o P/G/R, a rajada, a dupla, o
deslocamento pago e a dívida.

Trocar Ticks por AP seria perder o Preparo, que é a coisa mais nossa que existe. E o que o AP tem de
bom (o empréstimo do Adrenaline, o acúmulo com teto) **já está traduzido**: a dívida de Ticks da §4
e a carga voluntária da K9.

### 5.5 · As três ações do Pathfinder 2e

**Não**, pelo mesmo motivo, e vale dizer com clareza porque é um sistema excelente. As três ações do
PF2e são a melhor solução conhecida para um jogo que **conta rodadas**. Nós não contamos rodadas,
contamos Ticks, e uma ação nossa já custa um número diferente de outra por natureza. Adotar as três
ações seria **arredondar** a nossa régua para pior.

O que se aproveita do PF2e é o **princípio**, não o mecanismo: custo crescente para repetição. E ele
já está em casa, medido e mais fino · a rajada cobra **−1d6 acumulativo e +1 Tick de Recuperação**
por golpe extra (§14.12), que é o MAP do PF2e escrito na nossa moeda.

E vale comparar os dois de perto, porque a comparação **valida a nossa calibragem**. O MAP é
**−5 no segundo ataque e −10 no terceiro** (−4 e −8 com arma ágil), aplicado a tudo que tenha o
traço de ataque · inclusive Shove, Trip e Grapple. Calculando o dano esperado de um marcial de
nível 5 (bônus +14, espada longa, contra CA 22), o terceiro Strike vale **cerca de um quarto** do
primeiro, e com arma ágil cerca de um terço. Daí a queixa que circula no EN World, na versão mais
seca: *"three or more attacks is noteworthy, except attacks at −10 aren't"*, com a conclusão de que
Rangers devem construir para **nunca chegar ao −10**.

A nossa rajada mede, no duelo, **40,3% na leve e 18,9% no terceiro golpe dela** · ou seja, chegamos
ao mesmo lugar (repetir contra um igual é mau negócio) por um caminho que **não tem degrau morto**,
porque o freio é dado e Tick em vez de um número fixo grande. E o `Combate_Tempo.md` §14.12 explica
por que a geometria alternativa foi recusada: o preço em Preparo *"é radicalmente desigual entre
classes (0 a 2)"*, e **nenhuma escala serve às quatro**. É a mesma armadilha do MAP, vista antes de
cair nela.

### 5.6 · AP contínuo por metro andado (Valkyria Chronicles)

**Não.** É lindo no vídeo e é uma régua na mesa. O nosso equivalente já foi discutido e resolvido
melhor: o passo é **grátis** durante a ação (o Deslocamento de Batalha), e só andar fora da vez
custa, a 1 Tick por metro. E a decisão 1 da §12 do `Golpe_Tardio.md` é explícita: *"o Grid **não
cobra** o passo; o orçamento do passo é da mesa"*.

O **fogo de interceptação**, que é a parte boa do Valkyria, sobrevive na proposta 4.9, como ação
paga e voluntária em vez de gatilho automático.

### 5.7 · A matriz de combinações elementais

**Não**, mesmo aceitando a proposta 4.6. Copiar óleo+fogo, vapor+eletricidade, abençoado e
amaldiçoado é importar uma tabela de consulta para uma mesa que já carrega 24 Artes, 139 Efeitos,
461 Técnicas e 55 condições. O DOS2 pode ter 36 estados de chão porque o computador os aplica; o
mestre humano não pode.

A regra da casa serve aqui inteira: **o Grid mostra o chão e o mestre julga o que ele faz.**

### 5.8 · Resolver as manobras sozinho

**Não**, e é o critério de descarte mais importante do documento porque ele reprova a versão
preguiçosa de quase todas as propostas da §4. O agarrão que aplica a condição sozinho, o empurrão
que move a peça sozinho, o gatilho que dispara sozinho: todos são tentadores e todos violam o limite
do `Grid_Automacao.md`.

> *"A automação existe para tirar a datilografia da frente, não para tirar a decisão da mão de quem
> está mestrando."*

O teste prático é o da §4 daquele documento: **o Grid avisa e deixa passar quando o mestre insiste.**
Uma manobra que o Grid recusa é uma manobra que a mesa vai resolver mentindo para a tela.

### 5.9 · A ordem de turno alternada entre times (DOS2)

**Não.** Ela transforma iniciativa em limiar de time, e nós acabamos de gastar uma revisão inteira
(§15.10 e §15.12 do `Combate_Tempo.md`) fazendo a iniciativa individual valer: os Ticks de entrada,
o desempate por Raciocínio, os caídos fora da conta, o contrapé que decai com o relógio. Alternar
por time jogaria tudo isso fora para resolver um problema que não temos.

### 5.10 · Turnos simultâneos com timer (Atlas Reactor)

**Não** o timer, **sim** a estrutura. Os 20 segundos de decisão do Atlas Reactor existem porque é um
jogo competitivo online; numa mesa, cronômetro de decisão é punição. O `Grid_melhorias.md` já tem
"cronômetro de turno" na fila com a ressalva certa: *"opcional, do mestre, sem punição, só visível"*.

O que vale é a resolução em **fases**, que resolve o "quem primeiro" sem discussão · e nós já temos
a nossa versão, melhor porque é física e não convenção: **a fase é P, G ou R**, e quem determina o
que acontece antes é a agenda, não a ordem em que alguém falou.

### 5.11 · Interromper que CANCELA a ação (Grandia)

**Não**, e este é o achado mais bonito da pesquisa, porque é uma decisão que a nossa bancada já
tomou **e o Grandia é a prova em escala real do que teria acontecido se ela fosse tomada ao
contrário**.

O Grandia é o parente mais próximo do P/G/R: a barra IP tem uma zona de comando (COM) e uma zona de
ação (ACT), e o intervalo entre as duas é o nosso Preparo com outro nome. Acertar alguém nesse
intervalo com um **Critical** cancela a ação e empurra o ícone de volta para **cerca de metade da
trilha**. O Grandia 2 levou a ideia ao limite lógico e **tirou todo o bônus de dano do Critical**,
deixando-o como ferramenta pura de tempo.

E o sistema desanda. A resenha do rpg-o-mania sobre o Grandia 2 diz direto: *"if you reached a
certain skill level, you can cancel all the enemies' actions if you act smart"*, listando a
dificuldade como *"a tad too easy"*. Há uma run documentada de Hard Mode **sem tomar um único
golpe**, construída só nisso. E a versão estrutural da crítica, da RPGFan sobre o Grandia III, é a
que interessa: o cancel-lock **não favorece o jogador nem o inimigo** · quem ganha a corrida de
velocidade tranca o outro fora do jogo, e nos encontros rápidos do segundo disco *"you'll sometimes
never have a chance to strike more than twice before you see that Game Over screen."*

Nós medimos isso, sem saber que estávamos medindo o Grandia. A §4.4 do `Combate_Tempo.md`:

| o que interromper compra | pior desvio |
|---|:---:|
| atrasa 1 Tick | +24,7 |
| atrasa 3 Ticks | +16,0 |
| **atrasa o que eu paguei (o espelho)** | **+1,7** |
| **cancela a ação** | **+13,4** |

E a leitura de lá é exatamente o diagnóstico da RPGFan: cancelar de vez *"é forte demais, e cai
desproporcionalmente sobre a arma pesada, que é justamente quem tem janela"*. **O espelho fica.**

Fica também um empréstimo pequeno e bom: o Grandia 2 tirar o dano do Critical mostra que **uma
manobra pode ser só tempo e ainda ser desejável**. É argumento a favor da nossa **finta** (§8 do
`Combate_Tempo.md`, K6), que compra 1 Tick de Preparo e não entrega dano nenhum.

### 5.12 · Pontuar a mesa pela rapidez (Valkyria Chronicles)

**Não.** O rank de missão do Valkyria é decidido **só pela contagem de turnos**, e o resultado é o
*Scout rush*: ignorar o mapa, empilhar Orders num Scout e correr até o acampamento inimigo. A
formulação da comunidade é a acusação inteira: *"if you actually played like the game is telling you
to play it, as in, be strategic and make use of your team to succeed, there is very little to no
chance you can get an A or S rank."*

Vale como aviso porque **nós temos um relógio**, e relógio pede placar. A tentação de pontuar a
mesa ("resolveu em 18 Ticks") existe e deve ser recusada: qualquer número que a mesa persiga vira o
objetivo real da cena. O `Grid_melhorias.md` já acertou o tom ao pôr o cronômetro na fila como
*"opcional, do mestre, sem punição, só visível"*.

### 5.13 · Bônus que nascem no tabuleiro (Tactics Ogre Reborn)

**Não**, e é a guarda da proposta 4.6. O Reborn espalha **Buff Cards** pelo mapa: elas nascem por
tempo, por obstáculo quebrado ou por grama queimada, empilham até 4, somam magnitude quando
repetidas, e quem pisar leva. Inimigos pegam também.

A reclamação foi tão consistente que existe mod para remover e threads pedindo um botão de desligar
que a Square Enix nunca entregou. E o motivo é diagnosticável: um chefe que passa por cima de
quatro cartas atropela uma posição que o jogador jogou certo; o objetivo do mapa vira a carta; e
como o balanceamento de nível alto foi feito contando com os stacks, **ignorar o sistema não é
opção**.

O erro de fundo não é "aleatoriedade", é de espécie: as cartas são uma **fonte de renda
descontrolada injetada numa economia fechada**. A nossa proposta 4.6 põe **chão que cobra pedágio**,
que é custo, e isso é o oposto. A linha que não se atravessa: o terreno pode **atrapalhar** e pode
**abrir oportunidade de Firula**, mas nada no tabuleiro deve **dar bônus por ser pisado**.

### 5.14 · Abandonar o relógio de Ticks (Exalted 3e)

**Não**, e esta merece a última palavra da seção porque é sobre **a nossa própria origem**.

O Centelha desce do Exalted 2ª edição, que é onde o relógio de Ticks nasceu: cada ação custa um
número de ticks e você age quando o relógio chega ao seu. É a estrutura que o `Combate_Tempo.md`
herdou e refinou até virar o P/G/R.

E o Exalted **abandonou esse relógio**. Na 3e, a linha de ticks foi trocada por **Iniciativa como
moeda**: um número que se ganha e se gasta, e em que até a defesa total tem preço. O preview oficial
da Onyx Path traz Charms que *"waive the Initiative cost of the full defense action"* e outros que
*"ignore one point of onslaught penalty"* · ou seja, o vocabulário sobreviveu (o onslaught é a nossa
Guarda sob pressão), mas **o relógio não**.

Antes disso, a errata da **2.5** (março de 2012) já era uma confissão do que não tinha funcionado na
edição que nos gerou: ela **removeu os Combos**, **encareceu as defesas perfeitas** e **derrubou o
dano mínimo** para 2/3/4. O diagnóstico mais claro está num comentário da própria página da Onyx
Path: mesmo depois da errata, *"instead of perfect-turtle, you have perfect-then-run-the-hell-away,
as other options are still not viable"*.

**Duas leituras, e as duas nos servem.**

A primeira é uma confirmação independente do achado mais forte da nossa bancada. A §4.5 do
`Combate_Tempo.md` mediu o aparo desesperado e concluiu que *"comprar número de Defesa vira um laço,
porque todo golpe é uma nova oportunidade de comprar"*, com o combate crescendo 70% e **nenhum teto
consertando**. As defesas perfeitas do Exalted 2e são exatamente essa regra levada ao extremo, e a
editora precisou de uma errata e depois de uma edição inteira para sair dela. **Chegamos à mesma
conclusão por simulação, antes de pagar o preço.** É o argumento mais forte que temos para nunca
deixar a dívida comprar Defesa.

A segunda é a que justifica o descarte. O Exalted trocou o relógio por uma moeda porque um relógio
de ticks é caro de operar **em papel**. Nós não estamos em papel: o Grid é o relógio, e ele conta
sozinho. A dificuldade que fez a nossa origem desistir é justamente a que a mesa digital resolve, e
por isso a decisão de arquitetura da §15 (*"o jogo terá dois sistemas de tempo, à escolha do
mestre"*) continua certa · o `normal` é a mesa que quer papel, o `pgr` e o `simultaneo` são a mesa
que tem tela.

---

## 6. Fontes

**Divinity: Original Sin 2**
- [Action Points · Fextralife](https://divinityoriginalsin2.wiki.fextralife.com/Action+Points) · o acúmulo de até 2 AP
- [Combat · Fextralife](https://divinityoriginalsin2.wiki.fextralife.com/Combat) · alternância de turnos entre times, as duas armaduras, terreno alto
- [Initiative · Fextralife](https://divinityoriginalsin2.wiki.fextralife.com/Initiative)
- [Armour](https://divinityoriginalsin2.wiki.fextralife.com/Armor) · [Magical Armour](https://divinityoriginalsin2.wiki.fextralife.com/Magical+Armour) · [Status Effects](https://divinityoriginalsin2.wiki.fextralife.com/Status+Effects) · [Environmental Effects](https://divinityoriginalsin2.wiki.fextralife.com/Environmental+Effects)
- [Talents](https://divinityoriginalsin2.wiki.fextralife.com/Talents) · [Glass Cannon](https://divinityoriginalsin2.wiki.fextralife.com/Glass+Cannon) · [Executioner](https://divinityoriginalsin2.wiki.fextralife.com/Executioner) · [Adrenaline](https://divinityoriginalsin2.wiki.fextralife.com/Adrenaline)
- [Data.txt do jogo, publicado por modder](https://gist.github.com/LaughingLeader/4bb72f2a44093cea0e3fee74b404fe2f) · as constantes de terreno alto (2,4 m · +20% · −10% · 2,5×) e as durações de contato
- [dos2.wiki · Action Points](https://dos2.wiki/wiki/Action_Points) · [gamepressure · combate](https://www.gamepressure.com/originalsinii/combat/z09214) · [gamepressure · superfícies](https://www.gamepressure.com/originalsinii/environmental-effects-and-combinations/zea274)
- [Nick Pechenin · Designing drama into the turn-based combat (Game Developer, fev/2018)](https://www.gamedeveloper.com/design/designing-drama-into-the-turn-based-combat-of-i-divinity-original-sin-2-i-)
- [Pechenin sobre as mudanças de armadura na Definitive Edition (Fextralife, jul/2018)](https://fextralife.com/divinity-original-sin-2-interview-armour-changes-mechanics-skills-types-and-more/) · a admissão de que o desenho previa flanco desproporcional
- [Larian confirma que o sistema de duas armaduras não volta (AMA, jan/2026)](https://gamerant.com/larian-studios-new-divinity-armor-system-magic-physical/)
- [Swen Vincke sobre o sistema ser "polarizing" (Destructoid, 2021)](https://www.destructoid.com/larian-founder-swen-vincke-on-dice-druids-and-baldurs-gate-3/)
- Crítica de comunidade: [Steam · "Armor system ruins the strategies"](https://steamcommunity.com/app/435150/discussions/0/3223871682615878067/) · [Steam · "Armor system is bad"](https://steamcommunity.com/app/435150/discussions/0/1495615865205585951/) · [Larian forums, 2016](https://forums.larian.com/ubbthreads.php?ubb=showflat&Number=595459)
- [Kotaku · os exploits que a Larian aceita](https://kotaku.com/divinity-original-sin-2-players-are-finding-all-kinds-1818978159)

**Turnos simultâneos**
- [Frozen Synapse](https://en.wikipedia.org/wiki/Frozen_Synapse) · ordens condicionais ("default action upon seeing an enemy force"), simulação de ~5 segundos, e a projeção que supõe o inimigo mantendo a estratégia atual
- [Atlas Reactor](https://en.wikipedia.org/wiki/Atlas_Reactor) · 20 segundos de decisão e as quatro fases (Prep · Dash · Blast · Move), com tudo calculado ao mesmo tempo e renderizado em sequência
- [Infinity · ARO](http://wiki.infinitythegame.com/en/ARO:_Automatic_Reaction_Order) · [Infinity (wargame)](https://en.wikipedia.org/wiki/Infinity_(wargame)) · [Face to Face Rolls](https://infinitythewiki.com/Face_to_Face_Rolls) · o único da lista que é de mesa
- [Gloomhaven · iniciativa por carta](https://gloomhaven.fandom.com/wiki/Initiative) · [as cartas de habilidade dos monstros](https://rules.dized.com/game/I7lEsCGOS2-zgol-ZRNf3g/d71zLmRcQ0a-hJqeP1U5Xg/monster-ability-cards) · a seleção simultânea e a proibição de dizer os números
- [AD&D 1e · a fase de declaração antes da iniciativa](https://www.enworld.org/threads/ad-d-osric-how-did-initiative-work.713644/) · o precedente de mesa mais antigo para declarar às cegas
- [canmom · a genealogia dos duelos em RPG](https://canmom.art/rpgs/rpg-duels-1) · as regras de combate monástico da Dragon nº 2 (1976), com seis movimentos escritos de antemão

**Exalted, de onde o Centelha vem**
- [A errata da 2.5 (Onyx Path, março de 2012)](https://theonyxpath.com/the-exalted-2-5-errata-is-here/) · Combos removidos, defesas perfeitas encarecidas, dano mínimo derrubado para 2/3/4, e o comentário do *"perfect-then-run-the-hell-away"*
- [Preview de Agents of Heaven (3e)](https://theonyxpath.com/agents-of-heaven-preview-2-the-flying-guillotine-and-cerulean-lute-of-harmony-style/) · o onslaught penalty sobrevivendo e a defesa total passando a custar Iniciativa, depois de o relógio de ticks ser abandonado

**Economias de ação**
- Pathfinder 2e · [Actions (Archives of Nethys)](https://2e.aonprd.com/Rules.aspx?ID=2268) · [Multiple Attack Penalty](https://2e.aonprd.com/Rules.aspx?ID=2289) · [Shields](https://2e.aonprd.com/Rules.aspx?ID=2180) · [Heal, a magia que escala com o número de ações](https://2e.aonprd.com/Spells.aspx?ID=1554) · [Pathfinder Roleplaying Game](https://en.wikipedia.org/wiki/Pathfinder_Roleplaying_Game)
- [EN World · "attacks at −10 aren't" (a crítica ao terceiro ataque)](https://www.enworld.org/threads/pf2-multiple-attacks-in-a-round-question.673699/) · [GamingTrend · resenha do Player Core](https://gamingtrend.com/reviews/pathfinder-2e-remaster-player-core-review-youve-got-three-actions-what-are-you-going-to-do/)
- D&D 5e · [Combat (SRD)](https://www.5esrd.com/gamemastering/combat/) · [Rules Glossary 2024](https://www.dndbeyond.com/sources/dnd/free-rules/rules-glossary) · [Weapon Mastery](https://www.dndbeyond.com/posts/1742-your-guide-to-weapon-mastery-in-the-2024-players)
- Baldur's Gate 3 · [Shove](https://bg3.wiki/wiki/Shove) · [High ground rules](https://bg3.wiki/wiki/High_ground_rules) · [Surfaces](https://bg3.wiki/wiki/Surfaces) · [Thief](https://bg3.wiki/wiki/Thief) · [Patch 5 · os nerfs do Honour Mode](https://bg3.wiki/wiki/Guide:Undocumented_Patch_5_updates) · [Baldur's Gate 3](https://en.wikipedia.org/wiki/Baldur%27s_Gate_3)
- [Fórum da Larian · "The issue with Shove"](https://forums.larian.com/ubbthreads.php?ubb=showflat&Number=890533) · [ScreenRant · o empurrão e a verticalidade](https://screenrant.com/baldurs-gate-3-combat-shove-action-overpowered/)
- XCOM 2 · [manual oficial (Feral)](https://www.feralinteractive.com/en/manuals/xcom2/latest/steam/) · [a matemática do Overwatch](https://steamcommunity.com/app/268500/discussions/0/2789369351344599650/) · [o scamper do pod](https://steamcommunity.com/app/268500/discussions/0/594008890765476855/) · [Ever Vigilant](https://xcom2.wiki.fextralife.com/Ever+Vigilant) · [XCOM 2](https://en.wikipedia.org/wiki/XCOM_2)
- [Josh Bycer · A Deep Dive Into XCOM and XCOM 2 (Game Developer)](https://www.gamedeveloper.com/design/a-deep-dive-into-xcom-and-xcom-2) · [Jake Solomon sobre os cronômetros e o overwatch crawl](https://www.player.one/whats-next-xcom-jake-solomon-talks-xcom-5-dlcs-and-mission-timers-589331)
- Final Fantasy Tactics · [as reduções de CT e o charge time](https://game8.co/games/Final-Fantasy-Tactics/archives/543470) · [mirar na unidade × mirar no painel](https://steamcommunity.com/app/1004640/discussions/0/624436409752775147/) · [Final Fantasy Tactics](https://en.wikipedia.org/wiki/Final_Fantasy_Tactics)
- Tactics Ogre · [Reborn · o Wait Time em 100/75/50](https://steamcommunity.com/sharedfiles/filedetails/?id=2889066522) · [a taxonomia oficial das cartas (Square Enix)](https://nintendoeverything.com/tactics-ogre-reborn-details-skills-battlefield-items-wheel-of-fortune-chariot-tarot-world-tarot-classes-characters/) · [a reclamação, e o botão que nunca veio](https://steamcommunity.com/app/1451090/discussions/0/6993586036989222222/)
- Grandia · [a barra IP, o COM e o ACT (LP Archive)](https://lparchive.org/Grandia/Update%2004/) · [Grandia II · o Critical que só custa tempo](https://lparchive.org/Grandia-II/Update%2002/) · [rpg-o-mania · "you can cancel all the enemies' actions"](https://www.rpg-o-mania.com/coverage_battlesystems_grandia.php) · [RPGFan · a corrida de velocidade nos dois sentidos](https://www.rpgfan.com/review/grandia-iii-2/) · [Grandia](https://en.wikipedia.org/wiki/Grandia_(video_game))
- Valkyria Chronicles · [os limiares de rank por número de turnos](https://steamcommunity.com/sharedfiles/filedetails/?id=362209223) · [o Scout rush](https://steamcommunity.com/app/294860/discussions/0/537405286654560495/) · [chcse · o rank que contraria o próprio jogo](https://chcse.blogspot.com/2018/07/valkyria-chronicles-ps3.html) · [Valkyria Chronicles](https://en.wikipedia.org/wiki/Valkyria_Chronicles_(video_game))
- Fire Emblem · [as fórmulas de acerto e o 2RN (Serenes Forest)](https://serenesforest.net/general/true-hit/) · [cálculos do Three Houses](https://www.fe3h.com/calculations) · [o Juggernaut Index](https://feuniverse.us/t/the-juggernaut-index-a-brand-new-astounding-metric/14402) · [Fire Emblem](https://en.wikipedia.org/wiki/Fire_Emblem)
- [Into the Breach · Road to the IGF (Game Developer)](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-) · "quando cada ataque é telegrafado, o jogo se parece com um quebra-cabeça" e "cada morte parecia sua culpa"
- [Blades in the Dark · Setting Position & Effect](https://bladesinthedark.com/setting-position-effect) · as três posições e os três efeitos, definidos pelo mestre a partir da intenção declarada

**Fontes internas** (onde a decisão já está tomada)
- `Combate_Simultaneo.md` §2.1, §3 e §3.2 · as decisões do simultâneo e os dez defeitos conhecidos
- `Combate_Tempo.md` §4 (a ação fora de hora e as quatro travas medidas), §4.5 (comprar Defesa vira laço), §8 (ler o sinal e a finta), §14 (a régua P/G/R), §15.10 a §15.12 (iniciativa e golpes no mesmo instante)
- `Golpe_Tardio.md` §4 (a Firula, em que Tick), §9 (as dez decisões), §11 e §12 (as seis regras de andar, e a ausência de zona de controle)
- `Grid_Automacao.md` §2 e §4 · o princípio e o contrato do improviso
- `Grid_melhorias.md` · a lista de funcionalidades, e as três que esperam decisão de regra
- `habilidades.md` §Firulas · a regra que este documento propõe pôr na tela
- `Acoes_Sistema.md` §3 · os cinco modos de ação e a tabela de âncoras
- `regras.json` · `combate`, `combateTatico`, `forca` (FAH e FAA) · `condicoes.json` · `efeitos.json` · `tecnicas.json`
