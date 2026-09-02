# Projeto do harness · o desenho, as decisões e o que implementar

Escrito em 02/09/2026, sobre o commit `df03b44`, e revisto até `d141fa9`. Faz parte de uma série de
quatro, em `docs/simulacao/`:

| | O que é |
|---|---|
| `00-diagnostico.md` (**R1**) | o que existia antes de qualquer decisão: onde mora cada peça do motor, o que é puro, o que não é |
| `01-diagnostico-carga.md` (**R2**) | as 14 paradas que pedem um humano, os conflitos entre capítulo, JSON e motor, e as medições |
| **este** | as decisões tomadas e a especificação do que implementar |
| `03-respostas.md` | as contradições deste documento resolvidas, os invariantes do harness, e as medições novas |

**Nenhuma linha deste documento foi implementada.**

## Como ler isto

O objetivo declarado: simular batalhas do Grid para medir **carga de trabalho e interrupção, com foco
no mestre**, e não dano nem taxa de vitória. A meta é que o Grid pareça um videogame, com muitas
opções para o jogador e nenhuma conta para o mestre.

A ordem de leitura depende do que você veio fazer:

| Se você veio para | Leia |
|---|---|
| **implementar as mudanças de regra na mesa** | a **§0.6.1**, que é a especificação item a item. Passe pela §0.45 a §0.49 quando ela mandar, para o porquê de cada uma |
| entender o que foi decidido e por quê | a **§0** inteira, e a tabela logo abaixo desta seção, que é o índice das decisões |
| construir o harness, depois | as **§2 a §5**, e a `03-respostas.md`, que corrige quatro contradições delas e acrescenta os invariantes |
| saber o que foi perguntado e que alternativas existiam | a **§1**, que é histórico: todas foram respondidas |

**As oito regras novas (N1 a N8) não são propostas: são decisões tomadas.** Elas mudam o sistema
Simultâneo do combate, e entram no Grid **antes** de o harness ser escrito.

### O que ainda NÃO está decidido, e não deve ser implementado

**Nada bloqueia a implementação.** Sobraram três perguntas, e nenhuma delas trava código:

1. **O perseguidor chega e bate no mesmo Tick** (`03-respostas.md` §4.3d e §6.2). Com N1, o golpe cai
   em `T + max(Preparo, viagem)` e o primeiro passo só sai em `T+1`, então a peça chega durante o
   Tick em que o golpe vence. A régua antiga dava um Tick de folga entre chegar e bater. É de regra, e
   o que estiver implementado segue a régua nova até você dizer o contrário.
2. **A ordem de N4 quando alguém entra ou sai da cena no meio** (`03-respostas.md` §6.4): um reforço
   que chega, uma invocação. A chave é da ficha e se recalcula sozinha; o que não tem regra escrita é
   se quem entra no meio de um Tick cai antes ou depois de quem já declarou.
3. **A latência do Supabase de verdade** (`03-respostas.md` §6.5): as medições da §5.2 de lá usam o
   mock, que responde da memória. É medição de campo, não de suíte.

Convenções: **⚑** marca uma invenção do harness, ou seja, uma regra de jogo que a simulação está
criando e que precisa ser lida como escolha, não como achado. A convenção da §1 (**bloqueia o
começo** contra **só o resultado**) é histórica e vale só para aquela seção.

**Duas instâncias mexem neste repositório.** As mudanças da §0.6.1 caem em
`src/pages/mesa/grid.astro` (frente da mesa), em `src/lib/combate-tempo.ts` e `src/data/regras.json`
(compartilhados) e numa migração nova do Supabase. Vale a regra do `CLAUDE.md`: commitar com
pathspec, `git pull --rebase` antes, e preferir `Edit` a `Write`.

---

## 0. As decisões, respondidas em 02/09

As perguntas da §1 foram feitas e respondidas na mesma sessão. As respostas estão aqui; a §1 fica
como está, porque o que cada opção significava continua sendo a leitura das consequências.

| # | Pergunta | Resposta |
|---|---|---|
| **D1** | o Grid de hoje ou o automatizado | **os dois, mesma semente** |
| **D2** | motor como está ou as regras que faltam | **chaveável, com a tela lendo a mesma chave** |
| **D3** | quem decide pelos PCs | **políticas declaradas como dado** |
| **D4** | o que é fim de batalha | **um lado sem ninguém de pé · a fuga sai do tabuleiro · a desistência de um lado (todos abaixo de 20% de Vida)**. Recusados: teto de Ticks e teto de adiamento |
| **D5** | que cenas, e em que eixo variam | **grade fatorial sobre eixos** |
| **Q6** | a resolução vira módulo único ou cópia | **cópia, com teste-espelho** |
| **Q7** | as condições expiram | **expiram, e a mesa também passa a expirar** |
| **Q8** | quantos jogadores na mesa simulada | **vira eixo do experimento** |
| **Q9** | perfil de rolagem | **`site`: o site rola tudo** |
| **Q10** | as Artes entram | **só as elementais, com projétil e área/volume, mais a Cura** |
| **Q10b** | quais Efeitos | **um de cada forma do Grid** (8 formas) |
| **Q11** | o mapa tem obstáculo | **parede vira eixo do experimento** |
| **Q12** | mapa e distância inicial | **1 m por hex, mapa de 48×48, quatro distâncias** |
| **Q14** | relatório para ler ou portão | **artefato completo para ler e para embasar decisões futuras** |
| **Q15** | de onde saem os PCs | **arquétipos que eu escrevo, declarados como inventados** |
| **Q16** | as 7 regras que faltam entram no jogo | **entram, e a medição decide a ordem** |
| **N1** | quando a ação começa, e quando a guarda abre | **as duas no Tick T, o da declaração**; livre 1 Tick depois do fim da ação; o combate começa no Tick 1. Detalhe e consequências na §0.45 |
| **P2** | a parede | **entra, e vira funcionalidade do Grid** |
| **E1(d)** | o nível dos quatro períodos carrega arremessador | **sim, os quatro, e a mistura é declarada** |
| **D4b** | quando a fuga está consumada | **quando ninguém consegue aproximar**: 10 Ticks seguidos sem nenhum perseguidor diminuir a distância |
| **N2** | o golpe de Preparo 0 cala a cena no Tick em que é declarado | **a guarda de declaração passa a olhar `desde`**, e não o Tick do golpe: só cala quem foi declarado antes deste Tick (§0.45) |
| **N3** | o golpe de quem caiu no mesmo Tick ainda sai? | **sai, se já tinha vencido**; o agendado para o futuro morre com a peça (§0.45). Vira caso particular de N6 |
| **N4** | em que ordem se declara no Tick | **cadeia toda crescente** (declara primeiro quem tem menos). Na entrada: iniciativa · Rac+Prontidão · Raciocínio · Destreza. Depois: Rac+Prontidão · Raciocínio · Destreza · iniciativa (§0.46) |
| **N5** | as fases de um Tick | **declaração · início · resolução**, e a resolução na ordem inversa da declaração (§0.46) |
| **N6** | penalidade nascida no Tick T | **só vale em T+1**: a resolução lê o retrato de quando as declarações terminaram (§0.46) |
| **N7** | quem declara depois enxerga o que já foi declarado? | **enxerga, e é a vantagem de ter mais Raciocínio + Prontidão** (regra do Vampiro). O que ele vê já está definido na máscara da migração 27 (§0.47) |
| **N8** | o que exatamente é visível | **quem vai fazer o quê em cada Tick**, com rastro no tabuleiro (movimento, trajetória, alvos). Exceção: arremesso, tiro e Arte não revelam o alvo até executarem (§0.48) |
| **E2** | as quatro distâncias iniciais | **1 · 18 · 42 · 71 hexes** (encostado, ~3, ~7 e ~12 Ticks de corrida; 71 é a diagonal do mapa de 48×48) |
| **Fila** | a ordem de declaração na tela | **ordenada sozinha pela ficha, e o mestre pode mudar à mão** (§0.49) |
| **Ordem** | o que entra antes do harness | **tudo**: N1 a N8, o `ate` e as 16 bandeiras (§0.6 e §0.7) |
| **Rota** (P §2.4) | como preservar a linha de base | **bandeiras: uma bateria mede os dois lados.** N1 a N6 entram chaveadas, somando às de D2, e o desenho deixe-uma-de-fora mede cada regra isolada (§0.7) |
| **Fôlego** | a régua está escrita e o combate não a aplica | **fica fora, como está hoje** (`modulos.ts`, `folego: false`). A simulação mede o jogo que se joga (§0.7) |
| **Mana** | o que o Conjurador faz quando a reserva acaba | **raciona, alternando ataque comum e Arte**; e fica registrado um teste: a reserva é pequena demais para os combates? (§0.7) |
| **`porRodada`** | as 5 condições de dano por rodada que o Grid não cobra | **vira bandeira**: a bateria roda com e sem, para ver como se comportam (§0.7) |

Q13 (o repertório declarável) não foi perguntada porque D3 a responde: uma política declarada como
dado só pode declarar o que o Grid aceita, e o Grid aceita **6 coisas** (atacar em 4 manobras, mover
em 3 modos, conjurar, abortar, esperar 1 Tick, "outra coisa"). As 461 Técnicas ficam de fora por não
serem declaráveis. Consequência a registrar **antes** de medir, para não ser lida depois como
descoberta: o número de opções do jogador vai sair baixo por construção.

### 0.1 O que as respostas mudam no desenho

**D1 não custa uma segunda execução.** Se a política responde as paradas de classe **iii** com a
mesma aritmética que o motor faria, as duas versões da batalha são **idênticas byte a byte**: o que
muda é só quais eventos contam como consulta a um humano. Então não há A/B de execução, há uma
bandeira `automatizavel` por evento de parada e duas leituras do mesmo log. O mesmo vale para **Q8**:
mestre solo e um-jogador-por-PC não mudam nada na batalha, mudam a quem se atribui cada gesto, e
saem os dois do mesmo arquivo. Isso derruba dois eixos que pareciam multiplicar a grade e não
multiplicam nada.
A ressalva: isso deixa de valer se a política responder uma parada **iii** de um jeito que o motor
não faria (o mestre que arredonda a favor, o que fudge). Não modelamos isso, e a §4 já o coloca fora
de escopo.

**Q6 (cópia) contra D2 (a tela lendo a mesma chave): como as duas convivem.** As duas leem o **mesmo
objeto de perfil**, porque a §0.6 decidiu que as bandeiras entram na mesa e não só no harness. Isso
faz a convivência ser trivial e desfaz uma ressalva que este parágrafo carregava antes: eu tinha
escrito que o teste-espelho só valeria com todas as bandeiras desligadas, o que era verdade enquanto
elas iam viver só na cópia. **Com a mesa lendo o perfil, o espelho vale sob qualquer perfil, desde
que os dois lados leiam o mesmo**, e o `dados_hash` da bateria (§2.4) já registra qual era.
(A lista chegou a 16 na §0.7: as 7 de D2, as 2 da Cura, as 5 do núcleo do Tick, o `porRodada`, e a de
N5 cobrindo só a ordem inversa, §0.7.)

**D4 traz uma regra nova, e ela é a primeira invenção deliberada da simulação.** ⚑ A desistência
coletiva abaixo de 20% de Vida não existe no Grid nem nos capítulos. Ela conversa com o robô, que
foge individualmente abaixo de 25% (`regras.json:2268`): a peça foge primeiro, sozinha, e o lado
desiste depois, junto. A faixa entre 25% e 20% é a janela em que há fuga sem rendição, e é ela que
vai gerar a perseguição que interessa medir.

**A fuga se consuma quando ninguém consegue aproximar** (D4b): passados **10 Ticks seguidos** em que
nenhum perseguidor diminuiu a distância até o fugitivo, a fuga conta como consumada e a peça sai da
cena como baixa. O critério é bom porque não depende do tamanho do mapa: se dependesse da borda, o
resultado do eixo E2 ficaria confundido com a geometria da arena, já que uma distância inicial maior
também deixa a borda mais perto. E ele mede exatamente o caso que você quer ver, o alvo mais rápido
que nunca é alcançado, sem precisar de teto de adiamento (que você recusou) nem de teto de Ticks.

Mesmo assim, um laço sem saída trava o processo, então fica um **teto de segurança de execução**, que
não é regra de jogo: a batalha que passar de 2.000 Ticks é abortada e marcada `estourou`, entra num
balde próprio e não é contada em nenhuma média. É diferente da opção 4c que você recusou, porque 4c
classificaria a batalha como "indecisa", que é um resultado de jogo; `estourou` é o registro de que o
harness desistiu.

**Q7 e Q16 viram trabalho no Grid, não só no harness.** Ler o campo `ate` e ligar as 7 regras são
mudanças na mesa que está rodando. Elas não são pré-requisito para começar o harness, mas cada uma
que entrar muda o que o perfil base significa, então a bateria grava o commit e o `dados_hash` (§2.4)
para que uma medição de hoje continue comparável com uma de depois. Isso é o que a resposta de **Q14**
pede: o artefato tem de guardar os agregados por célula junto do relatório, e não só as tabelas
formatadas, senão a comparação futura não existe.

**Q10 e Q10b fecham um recorte que é quase todo regra fechada.** As oito formas do Grid, com um
Efeito âncora de cada, saindo dos 52 que aceitam alguma das 8 elementais ou a Cura:

| Forma | Efeito âncora | Nível | Fere? |
|---|---|---:|---|
| alvo | `projetil-conjurado` | 1 | sim |
| zona | `brasa-retardada` | 3 | sim |
| cone | `lascas` | 1 | sim |
| linha | `passo-relampago` | 4 | não |
| muro | `muro` | 3 | sim |
| aura | `campo-de-alivio` | 3 | cura |
| movimento | `empurrao-elemental` | 3 | não |
| cadeia | `corrente` | 3 | sim |

Área e volume estão em terreno firme: sair da área tem regra fechada, escada de metros, duas
Dificuldades e default declarado (R2 §E). O que o recorte não resolve está na §0.2.

**Q11 (parede) e Q12 (48×48, quatro distâncias)** mudam a grade: E2 passa a ter 4 níveis, e entra um
eixo de obstáculo. A §0.3 refaz a conta.

**Q15**: os arquétipos entram pelo cano normal, `resumoCombatePC`, sem tratamento especial, e cada
um é marcado `inventado` na procedência da §2.7.

### 0.2 O que as respostas abriram

| # | Pendência | Estado |
|---|---|---|
| **P1** | A Cura em área contra a regra publicada | **era engano meu.** Resolvida na §0.4 |
| **P2** | Parede não existe no Grid | **decidida**: entra, e vira funcionalidade do Grid (§0.4) |
| **P3** | O projétil mirado precisa de uma rolagem que não existe | **era engano meu**: a regra existe escrita. Resolvida na §0.4, com um resíduo pequeno |
| **P4** | Quais políticas, e a lista de regras de cada uma | proposta na §0.4 |
| **P5** | Quais arquétipos de PC, e quantos | proposta na §0.4 |
| **P6** | Os níveis de E1 e E4 em armas concretas | proposta na §0.4 |

### 0.3 Duas correções minhas

Fui verificar as seis antes de propor, e duas delas não existiam: eu tinha lido a R2 §E como "a regra
não está fechada", e o que ela diz é que **o motor não a aplica**. A régua está escrita no
`regras.json`, inteira, nos dois casos.

**P1 não era contradição, era leitura errada minha do Efeito.** `campo-de-alivio` **não cura**:
`grid.fere = false`, `grid.cura = false`, e o que ele faz é suspender o quadro (sangramento para,
veneno fica em suspenso, quem está caindo não morre), pondo a condição `protegido`. É uma aura
legítima e não é cura em área. A régua da Cura, por sua vez, está completa em
`regras.json → arcano.cura`: custo 2 por nível, `graus.alcance` (toque a 16 m), `graus.alvos` (1 a
6), `graus.cura` (2 · 1d6 · 1d6+2 · 2d6 · 2d6+2 · 3d6), o `semArea` ("a cura comum não tem Área;
curar em área existe, mas só por um Efeito Especial feito para isso") e o `divide` ("em mais de um
alvo, o valor curado é DIVIDIDO entre eles: 2d6 em três pessoas é a rolagem inteira repartida em
três"). Não falta regra: falta motor.

**P3 não era invenção obrigatória.** `regras.json → arcano.resistencia.rolagem` diz, com todas as
letras: "Percepção + Acerto Arcano, e só nos efeitos MIRADOS. Não há rolagem de conjuração para o
resto: o que não é mirado se resolve pela Dificuldade fixa do Efeito, pela Defesa passiva do alvo ou
por tabela." E `arcano.resistencia.tipos` é uma tabela de roteamento de cinco linhas, que cobre os
oito Efeitos âncora sem sobra. `Acerto Arcano` existe como perícia secundária (`acerto-arcano`, em
`habilidades-secundarias.json`) e Convicção existe como Virtude (`conviccao`, em `virtudes.json`). O
que a R2 §E registrou, e continua verdade, é que o capítulo lista o assunto em revisão e que o motor
não tem rolagem de Arte nenhuma. Isso é lacuna de implementação, não de regra.

### 0.4 As seis pendências, resolvidas

#### P1 · A Cura

Não há nada a inventar, e a âncora de aura fica onde está. O que muda é que a **Cura entra como um
nono item, que não é uma forma do tabuleiro**: ela é alvo escolhido, dentro do alcance, sem
resistência (`arcano.resistencia.tipos`, linha "Em aliados, objetos ou cenário: sem resistência"), e
com régua própria.

| O que | De onde sai | Estado no motor |
|---|---|---|
| custo 2 por nível de parâmetro | `arcano.cura.custoPorNivel` | **já aplicado** (`artes-grid.ts:257`) |
| quanto cura, por grau | `arcano.cura.graus.cura` | **não lido**: o valor sai de `dano_dados`, não da régua da Cura |
| alcance por grau | `arcano.cura.graus.alcance` | mede e pergunta, não impede (R2 §E) |
| **sem Área** | `arcano.cura.semArea` | **não aplicado**: nada impede comprar forma de área numa Arte de cura |
| **dividida entre os alvos** | `arcano.cura.divide` | **não aplicado**: nada divide o valor |

Proposta: as duas últimas viram bandeiras no **mesmo objeto de perfil das 7 regras de D2**, porque
são o mesmo tipo de coisa (regra escrita que o motor não aplica) e porque Q16 disse que a medição
decide a ordem de ligar. O perfil passa de 7 bandeiras para 9: `margem`, `gate`, `couraca`, `porte`,
`bloqueio`, `modo2`, `teto6`, `curaSemArea`, `curaDivide`. Sem `curaDivide`, curar seis aliados com
2d6 devolve 2d6 a cada um, e a Cura vira a jogada dominante da simulação inteira.

#### P2 · A parede

O Grid não tem parede e `hex.ts` já tem onde encaixá-la: `caminharHex(de, para, passos, pararA,
evita)` recebe um veto arbitrário, e hoje a mesa passa só `ocupadoPor`. O harness passa
`(h) => ocupado(h) || parede(h)`, lendo um `bloqueados: Hex[]` da cena. **Não é um segundo caminho de
código**: é o mesmo `caminharHex`, com um argumento a mais, e uma cena sem parede se comporta
exatamente como a mesa.

Duas coisas que precisam ficar declaradas:

- A parede **bloqueia passo e não bloqueia visão**. Linha de visão não existe no Grid, e `passo-relampago`
  a exige pelo texto ("precisa de linha de visão"). Inventar visão seria um sistema inteiro; a
  proposta é declarar a limitação e não medir nada que dependa dela.
**Decidido: a parede entra, e vira funcionalidade do Grid.** Com isso o resultado do eixo E7 é um
achado sobre o produto, e não só sobre a regra, e a marca ⚑ de invenção cai. A casa bloqueada passa a
existir na cena de verdade, e o `evita` de `caminharHex` a lê nos dois lugares: é o mesmo caminho de
código, com um argumento a mais.

E fica anotado como melhoria futura, fora do escopo do harness: **um editor de cenário no Grid**, em
que o mestre põe paredes, terreno difícil, itens e o que mais a cena precisar, em vez de só peças. O
terreno difícil tem gancho pronto e não usado: a condição `terreno-dificil` existe em
`condicoes.json` com campo de `velocidade`, e o Grid não a lê (R2 §C4).

#### P3 · O mirado, e o resíduo que sobra

Roteamento dos oito âncoras pela tabela de `arcano.resistencia.tipos`:

| Âncora | Linha da tabela | Como resolve | Inventa algo? |
|---|---|---|---|
| `projetil-conjurado` | Dano e projéteis | Percepção + Acerto Arcano contra a Defesa (Esquiva); depois a Absorção, e como `materia: null` só a Centelha absorve | não |
| `brasa-retardada`, `lascas`, `muro` | área | não se esquiva, se abandona: `desvioDaArea` e `oferecerSaida`, que já existem e já têm default | não |
| `empurrao-elemental` | por tabela | os parâmetros são FAH e FAA: entra na tabela de forças, que já é a régua do arremesso | não |
| `passo-relampago` | sem alvo | movimento do próprio conjurador | não |
| `campo-de-alivio` | em aliados | sem resistência | não |
| Cura por alvo | em aliados | sem resistência | não |
| `corrente` | Dano e projéteis, com salto | mirado no primeiro alvo; **os saltos não estão escritos** | **sim** ⚑ |

Sobram dois resíduos pequenos, e os dois são propostas, não fatos:

1. **Os saltos da cadeia.** Proposta: mirado no primeiro alvo, automático nos saltos seguintes, que é
   o que o texto do Efeito sugere ("o raio salta de um alvo ao seguinte, desde que estejam a poucos
   passos"). ⚑
2. **A composição do bolo do mirado.** A régua diz Percepção + Acerto Arcano e não diz o resto.
   Proposta: a mesma forma de `resumoCombatePC`, `floor((Percepção + acerto-arcano) / 2)d6` com +2 se
   ímpar, mais `ataqueCentelha(C)`, menos a penalidade da armadura. A parte discutível é a última:
   descontar armadura de um ataque de Arte é coerente com todo o resto do sistema e não está escrito
   em lugar nenhum. ⚑

Isso derruba P3 de "a única invenção mecânica obrigatória do recorte" para duas linhas.

#### P4 · As políticas

Cinco perfis, cada um uma lista **ordenada** de regras avaliadas de cima para baixo, e todas usando
só o que o Grid aceita declarar.

| Perfil | As regras, em ordem |
|---|---|
| **Agressivo** | 1. se há inimigo de pé no alcance e estou livre: atacar, manobra `rajada` se a Vida do alvo é maior que a minha, senão `simples`. 2. senão: mover em `corrida` até o inimigo de pé mais próximo. 3. nunca abortar |
| **Cauteloso** | 1. se estou abaixo de 40% de Vida e há inimigo no alcance: atacar com manobra `segura`. 2. se o inimigo mais próximo está em fase de Golpe: esperar 1 Tick (deixa o golpe cair e ataca a Recuperação dele). 3. se há inimigo no alcance: atacar `simples`. 4. senão: mover em `batalha`, não em corrida, que custa −4 de Defesa. 5. abortar quando a minha agenda já deslizou 2 vezes seguidas |
| **Tocaiador** | 1. se há inimigo a ≤ 3 hexes: mover em `corrida` para longe do mais próximo. 2. se há inimigo em alcance de tiro: atacar `simples`. 3. senão: manter posição (esperar 1 Tick) |
| **Guarda-costas** | 1. escolher como alvo o inimigo mais próximo do meu aliado com menos Vida. 2. se esse inimigo está no meu alcance: atacar `segura`. 3. senão: mover em `batalha` para a casa entre ele e o aliado. 4. nunca abortar |
| **Conjurador** | 1. se um aliado está abaixo de 50% de Vida e no alcance: Cura. 2. se há 2 ou mais inimigos a ≤ 2 hexes um do outro: `corrente` ou `brasa-retardada`. 3. se há 1 inimigo em alcance: `projetil-conjurado`. 4. se há inimigo a ≤ 2 hexes de mim: `empurrao-elemental`. 5. senão: mover em `batalha` para trás do aliado mais próximo |

Cada número desses (40%, 50%, 3 hexes, 2 deslizes) é **invenção do harness** ⚑ e vai no cabeçalho do
relatório, na tabela "o que foi inventado". E o Conjurador é o único que exercita as oito formas: sem
ele no elenco, o eixo das Artes não sai do papel.

Isso faz E6 ter **5 níveis**, e não 4: a conta da §0.5 usa 5.

#### P5 · Os arquétipos

Sete, montados só do catálogo real, cada um escolhido por exercitar uma coisa que os outros não
exercitam.

| Arquétipo | Raça | Arma (ciclo) | Escudo | Armadura | Por que ele existe |
|---|---|---|---|---|---|
| **Escudeiro** | humano | espada-longa (6) | heater (pen 2, `bloqCaC` 3) | malha (pen 2) | é a peça que a divergência #2 da R2 §F mais castiga: hoje ela está −4 de Defesa e não recebe nada em troca. Com a bandeira `bloqueio` ligada, ganha +3 |
| **Lanceiro** | humano | lança (haste, 6, 2 mãos) | nenhum | brigandina | única classe de tempo `haste`, e é ela que muda `alcanceDaPeca` de `HEX_CORPO_A_CORPO` para `HEX_HASTE`: perseguição fecha antes |
| **Duelista** | elfo | espada-curta (5) + adaga na mão inábil | nenhum | couro | ciclo 5, e a única peça que exercita a empunhadura dupla (divergência #3) |
| **Montanteiro** | orc | montante (pesada, 7, 2 mãos) | nenhum | placa completa | ciclo 7, passo baixo, e é metade do eixo E4. Também é o alvo natural do gate de Perfuração |
| **Arqueiro** | halfling | arco longo (6) | nenhum | couro | a única peça que não precisa fechar distância, e a única que usa a faixa de distância de `alcance.ts` |
| **Conjurador** | gnomo | adaga (5) | nenhum | nenhuma | as oito formas de P3, e o único que gasta Mana |
| **Curandeiro** | humano | maça (6) | broquel | gambeson | a Cura de P1, com o `divide` e o `semArea` no meio |

Todos passam por `resumoCombatePC` sem tratamento especial, que é o que garante que o PC gerado e o
PC de mesa somem os mesmos números. Todos entram no relatório marcados `inventado`.

#### P6 · Os níveis de E1 e E4 em armas do catálogo

O catálogo tem 26 armas em quatro ciclos: **4** (só `dardos`), **5** (adaga, espada curta, desarmado
e seis de arremesso), **6** (treze armas: espada longa, machado, maça, picareta, lança, alabarda,
arcos, bestas pequena e média, funda) e **7** (montante, martelo de guerra, besta grande).

| Nível de E1 | Armas | m.m.c. | O que se espera |
|---|---|---:|---|
| **a · uníssono** | espada longa dos dois lados | 6 | colisão em **todos** os golpes |
| **b · vizinhos** | adaga (5) × espada longa (6) | 30 | uma colisão numa batalha de 37 a 47 Ticks |
| **c · coprimos** | espada longa (6) × montante (7) | 42 | zero ou uma colisão |
| **d · os quatro** | dardos (4) · adaga (5) · espada longa (6) · montante (7) | 420 | colisões esparsas e sem padrão |

Uma ressalva que o catálogo impõe: **o ciclo 4 só existe em `dardos`, que é arremesso**. O nível (d)
obrigatoriamente carrega um arremessador, o que mistura o eixo de ciclo com o de alcance.
**Decidido: os quatro períodos entram, e a mistura é declarada** na leitura do resultado, ou seja,
qualquer efeito atribuído a (d) carrega junto a ressalva de que aquele nível é o único com alcance.

Esta tabela vale porque **N1 devolveu o período ao `ciclo`** (§0.45). Enquanto a régua era a de hoje,
os períodos eram `ciclo + 1` e nenhum destes m.m.c. estava certo.

**E4 · assimetria de passo.** O passo sai de `deslocamento()`, com a fração da raça e a meia
penalidade da armadura. O par é escolhido calculando `deslocamento()` para os candidatos e tomando o
primeiro com razão ≥ 2, e os candidatos naturais são o Montanteiro orc de placa completa (pen 3) de
um lado e o Duelista elfo de couro (pen 1) do outro. O nível "simétrico" usa dois Escudeiros.

### 0.45 Quando a ação começa · N1, decidida em 02/09

A pergunta era: escolhida uma ação no Tick T, ela começa em T ou em outro Tick?

**O que o motor faz hoje.** A ação começa em **T+1**, e é deliberado:
`regras.json → combate.simultaneo.decideEmValeDepois: 1`, com a nota "a ação declarada no Tick T
começa em T+1... decisão no Tick, efeito no avanço", e o `Combate_Simultaneo.md:124-127` repete.
`agendaSimultanea` faz `inicio = tickDecl + 1`.

Mas a **guarda** não segue a ação: `faseEm` não olha o campo `desde`, decide só pela agenda, e todo
Tick anterior ao primeiro golpe lê `preparo` (`combate-tempo.ts:595-606`). Uma espada longa declarada
no Tick 10 golpeia no 12 e fica livre no 17, e a escada cobra assim:

```
Tick    9    10    11    12     13    14    15    16    17
fase   prep  prep  prep  GOLPE  rec   rec   rec   rec  livre
Defesa  −2    −2    −2    −4    −2    −2    −2    −2     0
```

A ação vive 7 Ticks e a guarda fica aberta 8: quem declara paga −2 no Tick da declaração, antes de a
ação existir. E, como consequência, o **período real entre golpes é `ciclo + 1`**, porque quem
declara de novo no Tick em que fica livre paga o Tick de decisão outra vez. Medido encadeando cinco
declarações: leve 6, média 7, haste 7, distância 7, pesada 8, e não 5, 6 e 7.

**A decisão.** A ação e a guarda começam **no mesmo Tick T**, o da declaração. Para declarar de novo,
a peça precisa estar livre, e livre é **1 Tick depois do fim da ação anterior**. Interromper continua
possível pelas regras de interrupção, e quem interrompe só fica livre no Tick seguinte. O combate
começa no Tick 1.

O que isso muda, concretamente:

| | Hoje | Com N1 |
|---|---|---|
| `decideEmValeDepois` | 1 | **0** |
| `inicio` da agenda | `tickDecl + 1` | `tickDecl` |
| espada longa declarada no Tick 1 | golpe no 3, livre no 8 | **golpe no 2, livre no 7** |
| a ação ocupa | T+1 até T+ciclo | **T até T+ciclo−1** |
| guarda aberta | T até T+ciclo (um Tick a mais que a ação) | **exatamente os Ticks da ação** |
| período entre golpes | `ciclo + 1` | **`ciclo`**, que é o que a Velocidade da arma sempre quis dizer |
| `faseEm` | lê `preparo` um Tick antes da ação, e estava errado | passa a estar **certo**, sem mudar uma linha |

O exemplo publicado continua fechando pelo outro caminho: o arco de Preparo 5 declarando no Tick 1
solta a flecha no Tick 6, que é o número do `Combate_Simultaneo.md`. Antes ele fechava porque a
declaração era no Tick 0 e a ação começava no 1; agora fecha porque o combate começa no Tick 1 e a
ação começa junto. De quebra, isso deixa a frase "entra no Tick 0" da caixa de iniciativa
(`grid.astro:4751`) sem defesa nenhuma: ela já contradizia o `regras.json`
(`derivados.iniciativa.tickDoPrimeiro: 1`, R2 §F#13) e agora contradiz também a régua do simultâneo.

**E os períodos voltam a ser o `ciclo`.** O que eu tinha chamado de Correção 1 era verdade do código
como ele está, e N1 a remove: os níveis de E1 voltam para os períodos 4, 5, 6 e 7 do catálogo, com
m.m.c. 30 entre 5 e 6 e 42 entre 6 e 7 (§0.4 P6).

#### N2 e N3 · como o Preparo 0 se resolve (decididas em 02/09)

**Quem tem Preparo 0** é só a classe `leve` (adaga, espada curta, desarmado). Isso parece pouco e não
é: das 309 criaturas de `monsters-mesa.json`, **159 atacam com ataque de classe `leve`** (51%: 159
leve, 97 média, 48 pesada, 3 arte, 1 haste, 1 distância), e todo mundo que briga sem arma é leve. É
o caso mais comum da mesa.

**O que quebrava.** Dois duelistas de adaga livres no Tick 1: `grupoDaVez()` devolve os dois, A
declara com `golpes: [1]`, e na chamada seguinte `golpeMaisCedo()` = 1 com `tickDaVez()` = 1, então a
guarda `if (g <= t) return []` (`grid.astro:4119`) devolve lista vazia e **B não pode declarar**. O
mestre resolve o golpe de A primeiro, e B declara depois, sabendo se apanhou, quanto e se está de pé.
A janela de declaração cega, que é o ponto inteiro do Simultâneo, deixa de existir. E se o golpe de A
derruba B, B perde a ação inteira, porque `golpeMaisCedo` pula quem está no chão.

**O que não quebrava, e eu tinha exagerado:** a Defesa. `faseDeQuemVaiAgir` está ligado na folha
(`grid.astro:7449`, alimentando `dvDe()` em L7465): contra um alvo que ainda não declarou, a folha
presume a fase pela regra em vez de ler a agenda vazia. O problema dos 97% continua resolvido. O que
aquela função nunca cobriu, e diz no próprio comentário, é a **ordem de ação**.

**Por que apareceu agora.** Com `inicio = T+1`, o golpe mais cedo possível era T+1, então nenhum
golpe vencia dentro do Tick em que se declarava, e a guarda nunca disparava na janela de declaração.
N1 tirou um Tick de folga, e era essa folga que mantinha a janela limpa.

---

**N2 · A guarda de declaração passa a olhar `desde`, e não o Tick do golpe.**

A intenção da guarda está escrita no comentário dela (`grid.astro:4110-4118`): *"o braço que foi
declarado três Ticks atrás chega antes da próxima escolha de quem quer que seja"*. Golpe do passado
tem precedência sobre escolha nova. O `g <= t` expressava isso corretamente enquanto a régua
garantia que todo golpe devido em T fora declarado em T−1 ou antes; N1 quebrou a garantia, não a
intenção. A correção é dizer a intenção direto:

- **`grupoDaVez` bloqueia só por golpe de ação declarada antes deste Tick** (`acao.desde < t`). O
  campo `desde` já existe em `Acao` e já é lido no avanço (`grid.astro:4917`).
- **`instanteDeGolpe`, que desliga o ⏭, continua olhando todos os golpes devidos**, inclusive os
  declarados neste mesmo Tick. O relógio não anda enquanto houver golpe por resolver, que é o
  comportamento certo e não muda.

São duas perguntas diferentes que hoje usam a mesma função: "alguém ainda pode escolher?" e "o mundo
pode andar?". Elas passam a ter dois leitores.

O que isso produz no Tick T: **todos os livres declaram às cegas, e só então todos os golpes devidos
em T resolvem**. Não toca no catálogo, não toca na anatomia, não muda o período de arma nenhuma.

**N3 · O golpe que já venceu sai mesmo se quem o deu caiu.**

Se A e B se acertam no mesmo Tick e o golpe de A derruba B, o golpe de B **sai assim mesmo**: os dois
braços já estavam no ar, e a morte mútua é possível. Hoje não é o que acontece: `golpeMaisCedo` pula
quem está `noChao` (`grid.astro:4164`), com a razão escrita ao lado, "o gesto morre com quem o fazia,
e deixar a agenda dele travando a cena obrigaria a mesa a resolver um golpe que nunca vai sair".

Essa razão continua valendo, e a linha exata que ela desenha é:

| Situação | O golpe sai? |
|---|---|
| a peça cai e tinha golpe **devido neste Tick** (`g ≤ T`) | **sim**: o braço já estava no ar |
| a peça cai e tinha golpe **agendado para o futuro** (`g > T`) | **não**: morre com ela, como hoje |

Ou seja, `golpeMaisCedo` deixa de pular quem caiu **apenas** para os golpes já vencidos. Nenhum golpe
que nunca vai sair fica travando a cena, que era o medo do comentário original.

**A consequência que compra o desenho inteiro:** com N2 e N3 juntos, **a ordem em que o mestre
resolve os cartões deixa de mudar o resultado**. Ninguém declara sabendo do golpe do outro (N2) e
ninguém deixa de golpear porque o outro resolveu primeiro (N3). Isso é o que "simultâneo" promete, e
é também o que faz o harness ser determinístico de verdade: a §2.4 podia garantir ordem estável de
iteração, mas não podia garantir que a ordem não importasse. Agora pode.

**O que essas duas mudanças tocam**, para dimensionar: `grupoDaVez` e `golpeMaisCedo` em
`grid.astro` (as duas dentro de vinte linhas uma da outra), mais `agendaSimultanea` e
`decideEmValeDepois` por causa de N1. Nada em `hex.ts`, nada em `quase-acerto.ts`, nada no catálogo.
As três entram no mesmo balde do Q16: mudanças de regra que vão para a mesa, com a medição decidindo
a ordem.

### 0.46 A anatomia de um Tick · N4, N5 e N6 (decididas em 02/09)

As três fecham o desenho do Tick e substituem a parte do laço da §2.2 que ainda era "a ordem que o
Grid tem por acidente da interface".

#### N4 · A ordem de declaração

No Tick T, todo mundo que está livre declara. **Corrigido em 02/09**, com o exemplo do usuário: o
critério principal é a **iniciativa rolada**, e não a soma de atributos. A cadeia inteira é
"quem tem menos declara primeiro", em todos os níveis:

| # | Critério | Sentido |
|---|---|---|
| 1 | **a iniciativa rolada** | **crescente**: declara primeiro quem tirou menos |
| 2 | Raciocínio + Prontidão | crescente |
| 3 | Raciocínio | crescente |
| 4 | Destreza | crescente |
| 5 | sorteio | |

**A iniciativa só manda na entrada.** Passados os Ticks em que as peças entram pela escada da
iniciativa, o dado sai da frente e a chave passa a ser a estatística: **Raciocínio + Prontidão
crescente**, depois Raciocínio, depois Destreza, e a iniciativa rolada vira o último desempate antes
do sorteio. As duas cadeias são a mesma coisa com a iniciativa mudando de lugar:

| Fase | A cadeia de declaração, sempre crescente |
|---|---|
| **entrada** (os Ticks da escada de iniciativa) | iniciativa · Rac + Prontidão · Raciocínio · Destreza · sorteio |
| **depois** | Rac + Prontidão · Raciocínio · Destreza · iniciativa · sorteio |

O acaso decide quem chega primeiro na briga; a perícia decide quem lê a briga daí em diante.

**A fronteira é por peça** (decidido em 02/09): cada peça usa a cadeia de entrada na sua **primeira**
declaração e a cadeia de depois dali em diante. É o mais fiel à ideia de que o dado decide quem chega
primeiro na briga e a perícia decide quem a lê daí em diante.

**E isso abre o caso do Tick misto, que ainda não tem regra.** Num mesmo Tick pode haver peça na
primeira declaração e peça re-declarando, e as duas cadeias discordam sobre como ordená-las entre si.

Eu tinha estimado que isso seria raro, e **estava errado**: a entrada cabe sempre nos Ticks 1 a 4
(`ticksDeEntrada` faz `1 + ceil(atraso ÷ 6)`, e o atraso máximo possível é 16), e o ciclo mais curto
do catálogo é 5, então uma peça que ataca só volta a declarar no Tick 6, sem sobreposição. Mas
**esperar 1 Tick e abortar liberam a peça no Tick seguinte**, e aí ela re-declara no Tick 2, 3 ou 4,
em cima das entradas. Quem espera ou aborta cedo cai no caso misto sempre.

**Decidido em 02/09: quem ainda está entrando declara primeiro**, como bloco, antes de qualquer peça
que já esteja re-declarando, e cada grupo se ordena pela sua própria cadeia. A justificativa é a mesma
de N7: quem já está na briga lê quem está chegando, e não o contrário.

Em uma frase, para a implementação: **ordena-se por (é a primeira declaração desta peça? sim antes de
não), e dentro de cada grupo pela cadeia daquele grupo.**

**A resolução é o exato inverso da declaração**, com duas ressalvas que vêm das respostas de 02/09:

- **Empate resolve junto.** Duas peças com a mesma iniciativa (ou, depois da entrada, com a mesma
  chave) agem **no mesmo instante**: a ordem interna serve só para a declaração. Com o retrato de N6
  isso não gera ambiguidade nenhuma, porque a ordem entre elas não muda número.
- **A dependência entre ações vence a ordem.** Quando uma ação só faz sentido depois de outra
  (interpor-se antes de o golpe chegar, aparar, empurrar quem ia atacar), a ordem sai da dependência
  e não da iniciativa, e quem decide o encaixe é o mestre. No repertório declarável de hoje a única
  ação dependente é o abortar com "interpor" (`abrirAbortar`, `mesa-tempo-ui.ts:272-334`), e a regra
  operacional que sai daí é: **a interposição resolve antes do golpe contra o qual ela se interpõe**,
  qualquer que seja a iniciativa de quem se interpôs. Para o harness isso é uma exceção declarada na
  fase 3, e não uma parada de julgamento.

**O que isso corrige na versão anterior desta tabela.** Ela tinha a iniciativa como quarto critério e
em ordem decrescente, e os desempates de Raciocínio e Destreza também decrescentes. Estava errada nos
dois pontos: a iniciativa é o primeiro critério, e a cadeia inteira é crescente.

**Uma consequência elegante: a fila que já existe é a ordem de resolução.** `ordemDaFila`
(`combate-tempo.ts:399-404`) ordena por Tick, depois **iniciativa decrescente**, depois Raciocínio
decrescente. O critério principal já é o certo para a resolução; o que falta é acrescentar Prontidão
e Destreza aos desempates, e a ordem de declaração é essa mesma invertida dentro do Tick.

**Um exemplo, o do usuário, para a implementação conferir contra.** Iniciativas: P1 12, P2 11,
P3 9, P4 5, P5 3, P6 9.

| Tick | Quem age | Por quê | Declara nesta ordem | Resolve nesta ordem |
|---:|---|---|---|---|
| 1 | P1 | tirou a maior, entra sozinho (`tickDoPrimeiro: 1`) | P1 | P1 |
| 2 | P2, P3, P6 | atraso ≤ 6 em relação ao primeiro (`gapPorPenalidade: 6`) | **P3 e P6** (ini 9), desempatados entre si por Raciocínio + Prontidão crescente, e depois **P2** (ini 11) | P2, depois P3 e P6 |
| 3 | P4, P5 | atraso 7 e 9, um degrau a mais | **P5** (ini 3), depois **P4** (ini 5) | P4, depois P5 |

O Tick 3 é o exemplo que mostra para que a regra serve: P5 declara que vai atacar P1, e **P4, que
declara depois porque tirou mais iniciativa, escolhe sabendo disso** e vai proteger P1. É a vantagem
de N7 em ato.

**O número já existe nos dois lados do tabuleiro, e ninguém tinha reparado.** A iniciativa do sistema
é `1d6 + Raciocínio + Prontidão` (`regras.json → derivados.iniciativa.soma: ["raciocinio",
"prontidao"]`; `rolarIniciativaPC`, `mesa-ficha.ts:132-135`). Então:

- **PC:** `attrs.raciocinio + skills.prontidao`, direto da ficha.
- **Criatura:** as 309 do bestiário **não têm perícia nenhuma** (o bloco tem `atributos`, e
  `habilidades` é prosa). Mas todas têm a expressão de iniciativa, e o **fixo dela é exatamente
  `Raciocínio + Prontidão`**. Conferido nas 309: nenhuma dá Prontidão implícita negativa, a faixa é
  de 0 a 5, e a distribuição é 8 com 0, 183 com 1, 85 com 2, 24 com 3, 8 com 4 e 1 com 5.

Ou seja, a chave de declaração é **o fixo da iniciativa**, e ele está no dado para todo mundo. A
ordem inteira acaba sendo "a estatística de iniciativa, e depois o dado de iniciativa", o que é
coerente com o resto do sistema e não precisa de campo novo em lugar nenhum.

Duas coisas que isso obriga:

- **`ordemDaFila` ganha um irmão.** A fila de hoje ordena por Tick, iniciativa (desc), Raciocínio
  (desc), carimbo de chegada e nome (`combate-tempo.ts:399-404`). A ordem de declaração é outra
  coisa e vai numa função própria; a fila continua sendo a fila.
- **`regras.json → derivados.iniciativa.empateNoTopo` fica desatualizado.** Ele diz hoje: "Quem age
  primeiro dentro do instante é o desempate: maior Raciocínio, e persistindo o empate, o dado." A
  cadeia nova é mais longa e o supera.
- **O sorteio do quinto critério** é a única fonte de acaso fora dos dados no combate. No harness ele
  sai do fluxo semeado `ordem` (§2.4), senão a batalha 743 não replica.

#### N5 · As três fases de um Tick

O Tick deixa de ser "cada um na sua vez" e passa a ter fases explícitas:

| Fase | O que acontece |
|---|---|
| **1 · declaração** | todos os livres declaram, na ordem de N4. Nenhuma consequência acontece aqui |
| **2 · início** | as ações começam. Todas juntas, depois que a última declaração entrou (é o que N1 quis dizer com "a ação começa no Tick T") |
| **3 · resolução** | as consequências devidas neste Tick acontecem, **na ordem inversa da declaração**: resolve primeiro quem tirou **mais iniciativa** (N4, corrigido) |

Isso torna **N2 uma consequência, e não uma regra à parte**: se as declarações são uma fase inteira e
as consequências vêm depois dela, um golpe declarado no Tick T obviamente não pode calar a declaração
de ninguém no Tick T. A mudança em `grupoDaVez` (olhar `acao.desde` em vez do Tick do golpe) continua
sendo o que implementa isso.

#### N6 · O retrato: penalidade nascida no Tick T só vale em T+1

Toda a fase 3 lê o tabuleiro **como ele estava quando as declarações terminaram**. Dano, condição,
Pressão e queda que acontecem dentro do Tick T entram no estado, mas **não realimentam nenhuma
resolução do próprio Tick T**.

O exemplo que fecha a regra: dois personagens de adaga se atacam no mesmo Tick. O Golpe sai no mesmo
Tick para os dois, e **mesmo que o primeiro cause dano suficiente para gerar penalidade de
ferimento, essa penalidade só conta a partir do Tick seguinte**. Os dois ataques e as duas Defesas
saem com a penalidade normal de Golpe (−4) e nada mais.

A linha exata, porque ela não é "congelar tudo":

| Entra na conta da fase 3 | Não entra |
|---|---|
| a escada da **própria ação** (Preparo −2, Golpe −4, Recuperação −2 por golpe dado), que é o que a agenda deste Tick diz | o **ferimento** causado neste Tick |
| ferimento, condição e Pressão que já existiam **antes** do Tick T | a **condição** posta neste Tick |
| | a **Pressão** dos ataques declarados neste Tick |
| | a **queda** de quem foi derrubado neste Tick |

**N3 vira caso particular disto.** "O golpe de quem caiu ainda sai" não precisa mais ser uma regra
própria: quem caiu na fase 3 estava de pé no retrato, então o braço dele já estava no ar. O que a
implementação ainda precisa é o mesmo: `golpeMaisCedo` deixar de pular `noChao` para golpes já
vencidos.

**Onde o código de hoje contraria N6**, para dimensionar:

- **A Pressão é escrita na declaração, e não na resolução.** `gravarRelogio`
  (`grid.astro:7200-7205`) soma `pressao += golpes` na ação do alvo no instante em que o atacante
  declara. Com N4 e N5, isso acontece dentro da fase 1, e valeria já na fase 3 do mesmo Tick. Precisa
  entrar no retrato.
- **O ferimento é lido ao vivo.** `const fer = tierDe(alvo.pv_atual, alvo.pv_max).penDefesa`
  (`grid.astro:7435`), com o `pv_atual` do instante em que a folha abre. Precisa ler o retrato.
- **A escada não muda:** `defesaPerdida` lê a agenda, e a agenda deste Tick é exatamente o que deve
  contar. Nada a fazer ali.

**A extensão que eu proponho, e que não é palavra sua:** que o retrato cubra **todo** o estado lido
na fase 3, e não só as penalidades. Ou seja, também a posição. O motivo é o `empurrao-elemental`, que
move o alvo: se a posição mudasse no meio da fase 3, a distância que uma folha lê passaria a depender
de qual cartão o mestre abriu primeiro, e voltaríamos a ter ordem de resolução mudando número. Com o
retrato cobrindo a posição, **a ordem inversa de N5 é puramente narrativa: ela decide o que se conta
primeiro, e não muda nenhum resultado.** Isso é o que faz o simultâneo ser simultâneo de verdade, e
é também o que dá ao harness um determinismo que não depende de eu acertar a ordem de iteração.

### 0.47 N7 · Declarar por último é vantagem, e ela já tem régua

**Decidido:** a declaração é **visível**. Quem declara depois vê o que já foi declarado, e é por isso
que a ordem de N4 é crescente em Raciocínio + Prontidão: quem tem mais declara por último e escolhe
com mais informação. É a regra de declaração do **Vampiro: A Máscara** (declara-se na ordem inversa
da iniciativa e resolve-se na ordem dela), e ela cai bem aqui porque a chave da ordem **é** a
estatística de iniciativa (§0.46 N4).

#### O que o declarante tardio enxerga já está definido no banco

A migração 27 escreveu a assimetria, e com a mesma intenção, antes desta conversa existir
(`supabase/migracao-27.sql:76-88`):

> "O jogador vê QUE alguém está montando alguma coisa (a fita, os Ticks, a fase). O mestre vê O QUE:
> a arma e o alvo. Sem isso a fita entregaria de graça que o ogro está carregando o martelo contra o
> mago, que é justamente a informação que se compra prestando atenção na mesa."

A linha que faz isso, em `combate_visao` (L116-117):

```sql
case when m1.meu or v.stats then c.acao
     else c.acao - 'arma' - 'alvo' end as acao
```

Então o repertório de informação de quem declara por último é, exatamente:

| Vê | Não vê |
|---|---|
| que a peça declarou alguma coisa, e a fase dela em cada Tick (`golpes`, `livre`) | **contra quem** (`alvo`) |
| o **Tick em que o golpe cai** | **com o quê** (`arma`) |
| a **manobra** (`tipo`: simples, dupla, segura, rajada) | |
| a Pressão e a dívida acumuladas | |
| a Vida do inimigo só no grau que a mesa revelou (migração 14) | |

**N7 não precisava de sistema de visibilidade novo**, e a régua herdada era esta. **N8 (§0.48) a
substitui**: a decisão seguinte foi abrir o alvo e a arma do corpo a corpo e guardar só a pontaria. O
que segue nesta seção descreve a máscara de hoje, que é o ponto de partida da migração 29.

#### Um vazamento que o Simultâneo abriu na máscara

`c.acao - 'arma' - 'alvo'` remove as **chaves de topo**. O bloco `mov`, que o Simultâneo acrescentou
depois, tem um `alvo` dentro dele (`Mov`, `combate-tempo.ts:738`; lido em `grid.astro:4920` como
`mov.alvo ? TOKENS[mov.alvo] : mov.destino`), e esse `mov.alvo` **sobrevive à máscara**. O jogador
consegue ler contra quem uma peça está andando, que é precisamente a informação que a migração 27
foi escrita para esconder. O conserto é uma linha na view, e ele vira mais urgente com N7, porque
agora essa informação tem valor mecânico e não só narrativo.

#### O que N7 muda no resto do desenho

**Nas políticas (§0.4 P4).** Cada política passa a precisar de uma regra de leitura, e a posição dela
na ordem decide se ela tem o que ler. Proposta, uma linha por perfil:

| Perfil | O que faz com o que vê |
|---|---|
| **Agressivo** | ignora: ataca o mais próximo de qualquer jeito |
| **Cauteloso** | se alguém já declarou golpe para este Tick, prefere `segura`; se o inimigo mais próximo está em Recuperação declarada, ataca `rajada` |
| **Tocaiador** | se alguém declarou golpe com queda neste Tick ou no próximo, recua antes |
| **Guarda-costas** | se há golpe declarado caindo no Tick em que o aliado protegido está aberto, move para interpor em vez de atacar |
| **Conjurador** | conta quantos declararam golpe para o mesmo Tick e escolhe zona se forem 2 ou mais agrupados |

Com **N8** (§0.48) essas regras passam a poder usar também o **alvo do corpo a corpo** ("já tem
alguém indo nele, escolho outro"), e continuam sem poder usar o alvo de **tiro, arremesso e Arte**,
que fica escondido até resolver. Isso é bom para o desenho: as políticas ficam honestas por
construção, e a mesma política roda para o mestre e para o jogador sem precisar de duas versões.

**Na carga do mestre, que é a métrica.** A ordem de declaração vira uma regra que alguém tem de
cumprir. Hoje `grupoDaVez` devolve todos os livres e o mestre escolhe por quem começar; com N4 e N7
ele teria de **ordenar as peças livres por Raciocínio + Prontidão a cada Tick** e perguntar nessa
ordem. Isso é aritmética de escrituração, exatamente do tipo que a §2.3 classifica como **iii**, e
sem o Grid apresentando a fila de declaração pronta ela vira carga nova. É o caso mais claro até
agora de uma regra boa para o jogo que **piora** a mesa se a ferramenta não a absorver, e é
exatamente o que o harness foi desenhado para medir.

**Na balança do sistema, como hipótese a medir.** Raciocínio + Prontidão passa a comprar **três**
coisas com o mesmo par: entrada mais cedo na briga (`ticksDeEntrada`, pelo degrau de iniciativa),
declaração por último (N7) e resolução primeiro (N5). Não estou dizendo que é demais; estou dizendo
que é uma concentração que ninguém decidiu de uma vez, e que a simulação consegue pôr número nela.
Proposta, corrigida na `03-respostas.md` §1.4: **"cego" não é uma política, é um interruptor**
aplicável a qualquer uma delas, e vira o eixo **E9**. A versão anterior desta frase propunha uma
sexta política cega e a comparava com "a Agressiva com leitura", o que não funcionava: o Agressivo é
definido acima como quem ignora o que vê, então as duas seriam a mesma coisa. Como interruptor, a
comparação vale para o Cauteloso, o Tocaiador e o Guarda-costas, que são os três cujas regras de fato
leem alguma coisa, e mede o preço de um ponto de Raciocínio + Prontidão sem confundi-lo com o preço
de ser cauteloso. E o Agressivo ganha uma regra de leitura para o E9 fazer sentido nele também: *se o
inimigo mais próximo já tem golpe declarado de outro aliado caindo neste Tick, escolhe o segundo mais
próximo*.

### 0.48 N8 · O que é visível, e o rastro no tabuleiro

**Decidido, e inverte a máscara de hoje:** é visível **quem vai fazer o quê em cada Tick**. O
tabuleiro ganha um **rastro** do que foi declarado: o movimento, a trajetória, quem são os alvos. A
exceção é a pontaria: **arremesso, tiro e Arte não revelam o alvo até serem executados**. E fica como
melhoria futura um **teste para esconder as intenções**, que é o que devolve ao ogro a opção de
disfarçar para onde vai o martelo.

A régua é o corpo contra a mira: **o gesto corporal é público, a pontaria não é.** Erguer o martelo
na direção de alguém, correr para cima de alguém e atravessar a linha são coisas que a mesa inteira
vê. Para onde o arqueiro está olhando, não.

#### O que muda na migração 27

A máscara de hoje é `case when m1.meu or v.stats then c.acao else c.acao - 'arma' - 'alvo' end`
(`migracao-27.sql:116-117`), e o comentário dela dizia o contrário desta decisão: "sem isso a fita
entregaria de graça que o ogro está carregando o martelo contra o mago". N8 aceita que entregue, e
devolve o segredo por outro caminho (o teste, no futuro), que é mais barato de entender na mesa do
que uma coluna escondida.

| Chave | Hoje | Com N8 |
|---|---|---|
| `arma` | escondida de quem não vê stats | **visível sempre**: dá para ver o que a pessoa está empunhando |
| `alvo` (corpo a corpo) | escondida | **visível** |
| `alvo` (tiro, arremesso, Arte) | escondida | **continua escondida**, até o golpe resolver |
| `mov` e `mov.alvo` | visível por acidente (a máscara só limpa chaves de topo) | **visível de propósito**: perseguir é gesto público |

O vazamento do `mov.alvo` que eu tinha achado deixa de ser vazamento e passa a ser o comportamento
certo. O que a view precisa é do avesso: saber **quando** esconder. A view é SQL e não consulta
`armas.json`, então a declaração passa a carregar a marca: `acao.mirado: boolean`, escrita por
`declararGolpe` quando a perícia da arma é `atirador` ou `arremesso`, ou quando é conjuração. A
máscara vira `case when acao->>'mirado' = 'true' then acao - 'alvo' else acao end`, e vale para todo
mundo, inclusive para quem vê stats: a pontaria é segredo do jogo, não do papel.

#### O rastro, no tabuleiro

É funcionalidade nova do Grid, e é o que faz N7 valer alguma coisa na prática: sem ver, declarar por
último não compra nada. O mínimo:

- a **trajetória declarada** desenhada do token até o destino, e o destino marcado;
- uma **seta** do atacante ao alvo, quando há alvo visível;
- o **Tick em que o golpe cai** legível ao lado, que a fita já dá;
- nada disso para a ação `mirado`, que mostra só que a pessoa está montando alguma coisa.

Entra na mesma família do editor de cenário (`Pendencias.md` I5): o Grid deixando de ser um mapa de
peças e passando a mostrar intenção.

### 0.49 A fila de declaração na tela

**Decidido:** a tela ordena sozinha, pela ficha dos participantes (a chave de N4), **e o mestre pode
mudar a ordem à mão.** A coluna da vez mostra os livres já ordenados, com quem declara agora em
destaque, e o mestre arrasta se a mesa decidir outra coisa.

Vale registrar a consequência, porque ela é do tipo que morde depois: **mudar a ordem à mão move a
vantagem de informação de N7 de uma pessoa para outra.** Não é um ajuste cosmético como reordenar a
fila de iniciativa; é dar ou tirar de alguém o direito de escolher sabendo. A tela deveria dizer isso
em uma linha quando o mestre arrasta.

---

### 0.5 A grade, refeita com as respostas

| Eixo | Níveis | Custa célula? |
|---|---|---|
| **E1 · diversidade de ciclos** | 4 (uníssono 6 · 5 e 6 · 6 e 7 · 4/5/6/7) | sim |
| **E2 · distância inicial** | 4: **1 · 18 · 42 · 71 hexes** (encostado, ~3, ~7 e ~12 Ticks de corrida; 71 é a diagonal do mapa) | sim |
| **E3 · tamanho da cena** | 3 (1v1 · 3×3 · 2×8) | sim |
| **E4 · assimetria de passo** | 2 | sim |
| **E5 · perfil de regras** | **18** (cheio · uma de fora por bandeira, 16 · tudo desligado), §0.7 | sim |
| **E6 · política** | 5 (agressivo · cauteloso · tocaiador · guarda-costas · conjurador). A **cega** saiu daqui e virou o eixo E9 (`03-respostas.md` §1.4) | sim |
| **E7 · obstáculo** | 2 (campo aberto · parede), §0.4 P2, e cai fora se P2 for recusada | sim |
| **E9 · leitura** | 2 (lê as declarações do Tick, ou não). Aplica-se a qualquer política, e é o que mede N7 | sim |
| **E8 · atribuição de gesto** | 2 (mestre solo · um por PC) | **não**: é leitura do mesmo log |
| **D1 · perfil de automação** | 2 | **não**: é leitura do mesmo log |

Cruzar tudo é um enunciado, não uma grade: com E5 nos 18 perfis da §0.7 passa de cem mil
combinações. O orçamento que aperta continua sendo o mesmo da §3: o que se consegue ler. Desenho:

- **Núcleo cruzado: E1 × E2 × E3 = 48 células.** São os três que eu espero que interajam, e a
  previsão da §3 é sobre eles.
- **Um fator de cada vez em volta da célula-âncora**, somando `níveis − 1` de cada eixo restante:
  E4 (1) + E5 (17) + E6 (4) + E7 (1) + E9 (1) = **24 células**. Mede o efeito principal de cada um
  sem cruzá-lo com o resto, e é onde moram as 16 comparações de bandeira da §0.7.
- **Cruzamentos deliberados**, porque OFAT é cego a interação e há quatro que eu espero de verdade:
  E1(uníssono) × E3(horda), E1(uníssono) × E4(assimétrico), E2(muito longa) × E4, E5 × E1(uníssono).
  **4 células.**
- Total: **76 células**. A 500 repetições, **38.000 batalhas**, mais o reforço de 2.000 nas células
  de cauda (as de E4 e a de uníssono com horda). Pela medição da `03-respostas.md` §4.2, isso é da
  ordem de 30 segundos de máquina. A justificativa das 500 e das 2.000 é a da §3 e não muda.

---

## 0.6 O que entra na mesa antes do harness

**Decidido:** tudo. N1 a N8, o `ate` das condições (Q7) e as 16 bandeiras (§0.7) entram no Grid **antes**
de o harness ser escrito, para que ele meça o jogo de verdade desde a primeira batalha e nenhuma
regra viva só na cópia headless.

Uma consequência a registrar, porque afina o que Q16 tinha dito. Q16 respondeu "as 7 regras entram no
jogo, e a medição decide a ordem"; com tudo entrando antes, a medição não decide mais **a ordem de
ligar**, e passa a decidir outra coisa: **quais valeu a pena ligar**. As bandeiras continuam
existindo como bandeiras, com a mesa lendo o mesmo objeto de perfil, e o padrão em produção passa a
ser **ligadas**. O eixo E5 continua medindo base contra tudo-ligado, e o "base" deixa de ser o
presente e vira o passado: é a resposta à pergunta "o que essas nove regras compraram".

| # | O que | Onde | Prova |
|---|---|---|---|
| 1 | **N1** · `decideEmValeDepois` 1 → 0, `agendaSimultanea` com `inicio = tickDecl` | `regras.json`, `combate-tempo.ts:794-806` | `test-simultaneo.mjs`: a espada longa declarada no Tick 1 golpeia no 2 e fica livre no 7; o período entre golpes volta a ser o ciclo |
| 2 | **N4** · a chave e o comparador da ordem de declaração | `combate-tempo.ts` (função nova, irmã de `ordemDaFila`); a chave é `raciocinio + prontidao` na ficha e o fixo da iniciativa no bestiário | `test-simultaneo.mjs`: a cadeia dos cinco critérios, e a leitura do fixo nas 309 criaturas |
| 3 | **N2** · `grupoDaVez` bloqueia por `acao.desde < t`; `instanteDeGolpe` continua vendo todos | `grid.astro:4107-4126`, L4174 | `test-grid-simultaneo.mjs`: duas adagas declaram as duas no mesmo Tick |
| 4 | **N3** · `golpeMaisCedo` deixa de pular `noChao` para golpe já vencido | `grid.astro:4163-4170` | `test-grid-simultaneo.mjs`: morte mútua no mesmo Tick |
| 5 | **N5** · as três fases, e a resolução na ordem inversa | `grid.astro`, o avanço e a coluna da vez | `test-grid-simultaneo.mjs` |
| 6 | **N6** · o retrato, lido pela folha no lugar do estado ao vivo | `grid.astro:7435` (o ferimento) e L7200-7205 (a Pressão na declaração), mais a posição | `test-grid-simultaneo.mjs`: as duas adagas saem com −4 e nada mais |
| 7 | **N7 e N8** · a máscara ao avesso, com `acao.mirado` | migração 29, `declararGolpe` | consulta de conferência na própria migração, como as anteriores |
| 8 | **N8** · o rastro no tabuleiro | `grid.astro`, a pintura | `test-grid-simultaneo.mjs` |
| 9 | **N4 na tela** · a fila de declaração ordenada, com arrasto do mestre | `grid.astro`, a coluna da vez | `test-grid-simultaneo.mjs` |
| 10 | **Q7** · o `ate` das condições passa a ser lido e a expirar | `grid.astro` / `artes-grid-mesa.ts` | `test-artes-grid.mjs` |
| 11 | **As 16 bandeiras** · as 9 de regra publicada (Margem, gate, Couraça, porte, Bloqueio com escudo, modo secundário, teto ±6, `curaSemArea`, `curaDivide`), as 6 do núcleo do Tick e o `porRodada` | `regras.json` (o objeto de perfil), `quase-acerto.ts`, `calc.ts`, `combate-resumo.ts`, `grid.astro`, `artes-grid.ts` | `test-contrato.mjs` e `test-quase-acerto.mjs`, que hoje **congelam o estado errado** (R2 §A2: `R.defesa = 16` com o Bloqueio inútil) e precisam ser reescritos junto |

Os itens 1 a 6 são o núcleo do Tick e se sustentam sozinhos. O 11 é o maior de todos e é o único que
mexe em cinco arquivos de regra ao mesmo tempo.

### 0.6.1 A especificação, item a item

Cada item traz **hoje**, **passa a ser**, os **cuidados** que eu encontrei olhando o código, e a
**prova**. As linhas citadas são do commit `df03b44`.

---

#### 1 · N1 · A ação começa no Tick em que é declarada

**Hoje.** `src/data/regras.json → combate.simultaneo.decideEmValeDepois: 1`, com a nota "A ação
declarada no Tick T começa em T+1". `combate-tempo.ts:778`: `decideEmValeDepois()` devolve
`SIM?.decideEmValeDepois ?? 1`. `agendaSimultanea` (L794-806): `inicio = tickDecl + decideEmValeDepois()`.

**Passa a ser.** `decideEmValeDepois: 0` e `inicio = tickDecl`. A ação ocupa `T` até `T + ciclo − 1`
e a peça fica livre em `T + ciclo`. O período entre golpes volta a ser exatamente o `ciclo`.

**Cuidados.**
- A `decideNota` do `regras.json` e o `Combate_Simultaneo.md:124-127` afirmam o contrário e precisam
  ser reescritos. O exemplo do arco continua fechando: Preparo 5 declarando no Tick 1 solta a flecha
  no Tick 6, porque o combate começa no Tick 1 (`derivados.iniciativa.tickDoPrimeiro: 1`).
- **`grid.astro:4918`** filtra o passo do Tick com `((c.acao)?.desde ?? 0) + decideEmValeDepois() > T`.
  Com 0 a condição nunca é verdadeira e a guarda vira letra morta; o efeito prático não muda, porque
  o avanço do Tick T já rodou quando alguém declara em T. **Remova a guarda** em vez de deixá-la
  inerte, e escreva no comentário por que ela não é mais necessária.
- A caixa de iniciativa escreve "entra no Tick 0" (`grid.astro:4751`, no texto do `uiConfirmar`), o que já contradizia o
  `regras.json` (R2 §F#13) e agora contradiz também a régua do Simultâneo. Corrija a frase junto.

**Prova.** `scripts/test-simultaneo.mjs`: espada longa declarada no Tick 1 golpeia no 2 e fica livre
no 7; cinco declarações encadeadas dão período 5 para leve, 6 para média/haste/distância e 7 para
pesada. Detalhe e a tabela medida na **§0.45**.

---

#### 2 · N4 · A ordem de declaração

**Hoje.** Só existe `ordemDaFila` (`combate-tempo.ts:399-404`): Tick, iniciativa (desc), Raciocínio
(desc), carimbo de chegada, nome. Ela é a fila, e continua sendo.

**Passa a ser.** Uma função nova e irmã, `ordemDeDeclaracao(a, b, naEntrada)`, com a cadeia **toda
crescente** (declara primeiro quem tem menos) e a iniciativa mudando de lugar conforme a fase:

| Fase | A cadeia |
|---|---|
| **entrada** (os Ticks da escada de iniciativa) | iniciativa · Rac + Prontidão · Raciocínio · Destreza · sorteio |
| **depois da entrada** | Rac + Prontidão · Raciocínio · Destreza · iniciativa · sorteio |

**A ordem de resolução é essa invertida** (`ordemDaFila` já tem o critério principal certo para ela:
Tick, depois iniciativa decrescente), com duas exceções que a §0.46 detalha: **empate resolve junto,
no mesmo instante**, e **dependência entre ações vence a ordem** (a interposição resolve antes do
golpe contra o qual ela se põe).

**A chave de Rac + Prontidão já existe nos dois lados**, porque a iniciativa do sistema **é**
`1d6 + Raciocínio + Prontidão` (`regras.json → derivados.iniciativa.soma`):

- **PC:** `attrs.raciocinio + skills.prontidao`, direto da ficha (é o que `rolarIniciativaPC`,
  `mesa-ficha.ts:132-135`, já soma).
- **Criatura:** o **fixo da expressão de iniciativa** do bloco (`combate.iniciativa`, do tipo
  `"1d6 + 6"`). Conferido nas 309: nenhuma dá Prontidão implícita negativa, faixa 0 a 5, distribuição
  8 com 0 · 183 com 1 · 85 com 2 · 24 com 3 · 8 com 4 · 1 com 5. As 309 **não têm perícia nenhuma**
  no bloco da mesa, então este é o único caminho.

**Cuidados.**
- Para extrair o fixo sem rolar dado, `rolarExpr(expr).flat` (`rolagem.ts:34`) já devolve o número
  certo, mas rola os dados à toa. Uma função pura `fixoDe(expr)` é mais limpa e é uma linha.
- **O sorteio do último critério é a única fonte de acaso do combate fora dos dados.** Na mesa pode
  ser `Math.random`; no harness precisa vir do fluxo semeado, senão a batalha 743 não replica (§2.4).
- **A fronteira entre as duas cadeias é por peça** (§0.46): cada uma usa a cadeia de entrada na sua
  primeira declaração e a outra dali em diante. O **Tick misto** (peça entrando e peça re-declarando
  juntas) acontece sempre que alguém espera 1 Tick ou aborta nos Ticks 1 a 4, e a regra é: **quem
  está na primeira declaração vai antes**, como bloco, e cada grupo se ordena pela sua cadeia. Em
  código: ordena-se por "é a primeira declaração desta peça?" (sim antes de não) e depois pela cadeia
  do grupo.
- `regras.json → derivados.iniciativa.empateNoTopo` diz hoje "maior Raciocínio, e persistindo o
  empate, o dado". A direção está certa para a **resolução**; a cadeia nova é mais longa e o texto
  precisa dizer as duas fases.

**Prova.** `test-simultaneo.mjs` para as duas cadeias, uma asserção sobre as 309 criaturas para a
leitura do fixo, e **o exemplo de seis peças da §0.46 rodado inteiro**, Tick a Tick, que é o teste
que pega a maior parte dos erros de ordem. Detalhe na **§0.46**.

---

#### 3 · N2 · Golpe declarado no Tick T não cala a declaração de ninguém no Tick T

**Hoje.** `grupoDaVez` (`grid.astro:4107-4126`) faz `const g = golpeMaisCedo(); if (g != null && g <= t) return [];`.
Com N1, uma arma de Preparo 0 declarada no Tick T tem o golpe **em T**, e o primeiro que declarar
tira a vez de todos os outros. Só a classe `leve` tem Preparo 0, e **159 das 309 criaturas atacam com
ataque leve** (51%), mais todo mundo que briga sem arma.

**Passa a ser.** A guarda de **declaração** considera só golpes de ações declaradas **antes** deste
Tick: `acao.desde < t`. O campo `desde` já existe em `Acao` e já é lido no avanço.

**Cuidados.**
- **`instanteDeGolpe` (L4174), que desliga o ⏭, continua olhando todos os golpes devidos**, inclusive
  os declarados neste mesmo Tick. São duas perguntas diferentes que hoje usam a mesma função:
  "alguém ainda pode escolher?" e "o mundo pode andar?". Precisam de dois leitores.
- O comentário de L4110-4118 explica a intenção original ("o braço declarado três Ticks atrás chega
  antes da próxima escolha"). Ela continua valendo; o que muda é a forma de expressá-la. Reescreva o
  comentário, não o apague.

**Prova.** `scripts/test-grid-simultaneo.mjs`: dois duelistas de adaga, os dois declaram no mesmo
Tick. Detalhe na **§0.45**.

---

#### 4 · N3 · O golpe que já venceu sai mesmo se quem o deu caiu

**Hoje.** `golpeMaisCedo` (`grid.astro:4163-4170`) pula quem está `noChao`, com a razão escrita ao
lado: "o gesto morre com quem o fazia, e deixar a agenda dele travando a cena obrigaria a mesa a
resolver um golpe que nunca vai sair".

**Passa a ser.** Pula `noChao` **apenas para golpes ainda no futuro**. Golpe com `tick ≤ T` sai, mesmo
que quem o deu tenha caído neste Tick: os dois braços já estavam no ar, e a morte mútua é possível.

**Cuidados.** A função ganha o Tick corrente como parâmetro. Nenhum golpe que nunca vai sair fica
travando a cena, que era o medo do comentário original, e ele deve ser atualizado para dizer a linha
nova.

**Prova.** `test-grid-simultaneo.mjs`: morte mútua no mesmo Tick. Detalhe na **§0.45**.

---

#### 5 · N5 · As três fases de um Tick

**Hoje.** Não há fases. O avanço faz relógio, passos e `decidirAutomaticas`; as declarações humanas e
a resolução dos cartões acontecem entre avanços, em qualquer ordem que o mestre queira.

**Passa a ser.** Todo Tick tem três fases explícitas:

1. **Declaração.** Todos os livres declaram, na ordem de N4. Nenhuma consequência acontece aqui.
2. **Início.** As ações começam, todas juntas, quando a última declaração entrou.
3. **Resolução.** As consequências devidas neste Tick acontecem, **na ordem inversa da declaração**:
   resolve primeiro quem tirou mais iniciativa (na entrada) ou quem tem mais Raciocínio + Prontidão
   (depois dela).

**Cuidados.**
- N2 é o que implementa a fase 1 no motor; sem ele a fase não fecha.
- Com N6, a ordem dentro da fase 3 **não muda número nenhum**: ela decide só o que se conta primeiro.
- **Empate resolve junto**, no mesmo instante; a ordem interna entre empatados serve só para a
  declaração.
- **Dependência entre ações vence a ordem.** A interposição resolve antes do golpe contra o qual ela
  se põe, qualquer que seja a iniciativa de quem se interpôs. No repertório de hoje a única ação
  dependente é o abortar com "interpor" (`abrirAbortar`, `mesa-tempo-ui.ts:272-334`), então é uma
  exceção declarada na fase 3, e não uma parada de julgamento.
- **A bandeira de N5 cobre só a ordem inversa** (decidido em 02/09). As três fases ficam sempre
  ligadas, porque o estado desligado delas não é um comportamento, é a ausência de uma regra
  (`03-respostas.md` §2.1). O que a bandeira liga e desliga é se a resolução segue a ordem inversa da
  declaração ou a **ordem da faixa** (por Tick, `mesa-tempo-ui.ts:194`), que é a que o mestre segue
  hoje. Isso isola de verdade, como comparador, sem inventar nenhum passado.

**Prova.** `test-grid-simultaneo.mjs`. Detalhe na **§0.46**.

---

#### 6 · N6 · O retrato: penalidade nascida no Tick T só vale em T+1

**Hoje.** A folha lê o estado ao vivo:
- **ferimento:** `const fer = tierDe(alvo.pv_atual, alvo.pv_max).penDefesa ?? 0` (`grid.astro:7435`),
  com o `pv_atual` do instante em que a caixa abriu;
- **Pressão:** `gravarRelogio` (`grid.astro:7200-7205`) soma `pressao += golpes` na ação do alvo **no
  instante da declaração**, ou seja, dentro da fase 1, valendo já na fase 3 do mesmo Tick.

**Passa a ser.** A fase 3 inteira lê um **retrato** fechado ao fim da fase 1, por peça:

```
pv          int          para o tier de ferimento
condicoes   [{id,...}]   as que já existiam antes deste Tick
pressao     int          a acumulada antes deste Tick
pos         {q, r}       a posição, para distância e alcance
```

O que **entra** na conta da fase 3: a escada da **própria ação** (Preparo −2, Golpe −4, Recuperação
−2 por golpe dado), que sai da agenda deste Tick, mais tudo que já existia antes do Tick.
O que **não entra**: ferimento, condição, Pressão e queda **nascidos neste Tick**.

O exemplo que fecha a regra: dois duelistas de adaga se atacam no mesmo Tick, e os dois ataques e as
duas Defesas saem com a penalidade normal de Golpe (−4) e nada mais, mesmo que o primeiro cause dano
suficiente para gerar penalidade de ferimento.

**Cuidados.**
- **`defesaPerdida` não muda.** Ela lê a agenda, e a agenda deste Tick é exatamente o que deve contar.
- **A posição entra no retrato** (foi extensão minha, aceita): sem isso o `empurrao-elemental` faria
  a distância que uma folha lê depender de qual cartão o mestre abriu primeiro, e a ordem de
  resolução voltaria a mudar número.
- **O retrato precisa sobreviver a recarregar a página.** A R2 §B mostra que fechar a caixa no meio é
  o caso comum, e cinco paradas já deixam estado pela metade. Recomendo uma coluna
  `encontros.retrato jsonb`, na mesma migração da máscara (item 7), em vez de memória.
- **N3 vira caso particular disto:** quem caiu na fase 3 estava de pé no retrato.

**Prova.** `test-grid-simultaneo.mjs`: as duas adagas saem com −4 e nada mais. Detalhe na **§0.46**.

---

#### 7 · N7 e N8 · A máscara ao avesso (migração 29)

**Hoje.** `combate_visao` mascara a ação com
`case when m1.meu or v.stats then c.acao else c.acao - 'arma' - 'alvo' end`
(`supabase/migracao-27.sql:116-117`), escondendo arma e alvo de quem não vê stats. E o `mov`, que o
Simultâneo acrescentou depois, tem um `alvo` **dentro** dele que sobrevive à máscara, porque
`jsonb - texto` só remove chaves de topo.

**Passa a ser.** O gesto corporal é público, a pontaria não é.

| Chave | Hoje | Com N8 |
|---|---|---|
| `arma` | escondida | **visível sempre** |
| `alvo` do corpo a corpo | escondida | **visível** |
| `alvo` de tiro, arremesso e Arte | escondida | **continua escondida**, até o golpe resolver |
| `mov` e `mov.alvo` | visível por acidente | **visível de propósito**: perseguir é gesto público |

A view é SQL e não consulta `armas.json`, então a **declaração passa a carregar a marca**:
`acao.mirado: boolean`, escrita por `declararGolpe` (`grid.astro:6916`) quando a perícia da arma é
`atirador` ou `arremesso`, e pela conjuração. A máscara vira
`case when c.acao->>'mirado' = 'true' then c.acao - 'alvo' else c.acao end`, **para todo mundo,
inclusive para quem vê stats**: a pontaria é segredo do jogo, não do papel.

**Cuidados.**
- O comentário da migração 27 (L76-88) argumenta o contrário desta decisão e precisa ser substituído,
  não apagado: a migração 29 deve dizer o que mudou e por quê.
- Fica como **melhoria futura** um teste para esconder as intenções, que é o que devolve ao ogro a
  opção de disfarçar para onde vai o martelo. Anote-o junto do editor de cenário (`Pendencias.md` I5).
- A migração 29 leva junto a coluna `encontros.retrato` do item 6.

**Prova.** Consulta de conferência dentro da própria migração, como nas anteriores. Detalhe na
**§0.47** e na **§0.48**.

---

#### 8 · N8 na tela · O rastro no tabuleiro

**Hoje.** O Grid mostra peças e a fita de fase. Não mostra intenção.

**Passa a ser.** O mínimo que faz N7 valer alguma coisa, porque sem ver, declarar por último não
compra nada:

- a **trajetória declarada** desenhada do token até o destino, com o destino marcado;
- uma **seta** do atacante ao alvo, quando há alvo visível;
- o **Tick em que o golpe cai** legível ao lado (a fita já dá o número);
- **nada disso para a ação `mirado`**, que mostra só que a pessoa está montando alguma coisa.

**Prova.** `test-grid-simultaneo.mjs`. Detalhe na **§0.48**.

---

#### 9 · A fila de declaração na tela

**Hoje.** `grupoDaVez` devolve todos os livres e o mestre escolhe por quem começar, em qualquer ordem.

**Passa a ser.** A coluna da vez mostra os livres **já ordenados** pela chave de N4, com quem declara
agora em destaque, **e o mestre pode mudar a ordem à mão**.

**Cuidados.** Mudar a ordem à mão **move a vantagem de informação de N7 de uma pessoa para outra**.
Não é cosmético como reordenar a fila de iniciativa: é dar ou tirar de alguém o direito de escolher
sabendo. A tela deve dizer isso em uma linha quando o mestre arrastar.

**Prova.** `test-grid-simultaneo.mjs`. Detalhe na **§0.49**.

---

#### 10 · Q7 · As condições passam a expirar

**Hoje.** `porCondicao` (`artes-grid-mesa.ts:1167-1175`) carimba `ate = tick + turnos × 6`, e **não há
um leitor de `ate` em todo o `src/`** (R2 §C4). Nada expira sozinho: quem tira é só o fim do efeito
que pôs, e toda condição posta à mão depende de o mestre lembrar.

**Passa a ser.** No fim de cada Tick, as condições com `ate ≤ T` saem sozinhas, na mesa e no harness.

**Cuidados.** As 5 condições de dano por rodada (`sangrando`, `envenenado`, `sufocando`,
`em-chamas`, `morrendo`) têm `porRodada` e continuam **não sendo cobradas no Grid**: só
`combate.astro:1439` as lê. Isso é outra pendência e não faz parte deste item; não a resolva de
passagem, mas registre.

**Prova.** `scripts/test-artes-grid.mjs`.

---

#### 11 · As 16 bandeiras de regra

O maior dos onze, e o único que mexe em cinco arquivos de regra ao mesmo tempo. **Um bloco novo no
`regras.json`**, lido pela mesa e pelo harness, com o padrão em produção **ligado**. Ficou ali por
dois motivos (§0.7): `combate-tempo.ts` já importa `regras.json` e nada mais, então não entra
dependência nova e o empacotamento headless pega de graça; e o `dados_hash` do manifesto da bateria
(§2.4) já registra mudança em `src/data/*.json`, o que faz uma troca de bandeira ficar
automaticamente anotada na bateria que rodou com ela. **O manifesto passa a hashear também
`src/lib`**, para que mudança de código, e não só de régua, fique registrada do mesmo jeito. O
`src/lib/modulos.ts` continua sendo o que ele diz que é: só tela.

As nove de regra publicada estão na tabela abaixo; as outras sete são as do núcleo do Tick (`n1`,
que já é o parâmetro `decideEmValeDepois`, mais `n2`, `n3`, `n4`, `n6`, e `n5` com o tratamento em
aberto) e o `porRodada`, que liga as cinco condições de dano por rodada que o Grid não cobra.

| Bandeira | O que liga | Onde |
|---|---|---|
| `margem` | +1d6 de dano a cada 6 acima da Defesa | a resolução em `grid.astro` (hoje `rolarDano`, L7967, não recebe a diferença) e `danoNoAlvo` em `artes-grid.ts:1302` |
| `gate` | abaixo do Nível de Perfuração o golpe resvala, dano 0 | `calc.ts:131-135`, que **existe e não é chamada** |
| `couraca` | Couraça de Porte: +2 a +10 de Absorção contra corte e perfuração | não existe em lugar nenhum; `combate.md:120-136` tem a régua |
| `porte` | ±3 de acerto por categoria de porte, teto ±12 | `regras.json → porteAcerto`, hoje lido só por `mesa/referencia.astro:38` |
| `bloqueio` | a rota de Bloqueio, com a Defesa da arma e o `bloqCaC` do escudo | `combate-resumo.ts:53` e L86-87; hoje o escudo **só penaliza** |
| `modo2` | o modo secundário de dano custa −2 de acerto e −1d6 | `grid.astro:7613, 7618`; hoje a troca é de graça |
| `teto6` | teto de ±6 nos modificadores | `mesa-core.ts:164-181`, `somarCondicoes` soma sem teto |
| `curaSemArea` | a Cura comum não tem Área | `artes-grid.ts`, a compra de parâmetros |
| `curaDivide` | em mais de um alvo, o valor curado é dividido entre eles | idem; a régua está em `regras.json → arcano.cura.divide` |

**Cuidados.**
- **Dois testes congelam hoje o estado errado e precisam ser reescritos no mesmo commit.**
  `test-contrato.mjs:136` trava `R.defesa = 16` (a Esquiva do Kael com bróquel, com o Bloqueio
  inútil) e L149 trava `F.defBloqueio = 10`, que ninguém lê. Ligar `bloqueio` sem mexer neles deixa
  a suíte verde com o número errado.
- A régua de cada uma está na tabela de canonicidade da **R2 §F**, com o capítulo, o `regras.json` e
  o motor lado a lado, e com o efeito de cada uma no resultado de uma batalha.
- Estas nove não são todas do mesmo tamanho: `margem` e `bloqueio` são as duas maiores (a R2 §F#1 e
  §F#2 medem +47% de dano e ~5 pontos de Defesa), e `teto6` só muda casos extremos.

**Prova.** `test-contrato.mjs` e `test-quase-acerto.mjs`, reescritos, mais `test-kael.mjs`, que é a
regressão de personagem que o `npm run validate` já roda.

---

---

#### 12 · A semente do `d6` (para o teste-espelho)

**Hoje.** `rolagem.ts:11` é `export const d6 = () => 1 + Math.floor(Math.random() * 6)`. É a única
fonte de acaso do combate, e não tem como ser semeada.

**Passa a ser.** Um ponto de injeção: a fonte de acaso vira um parâmetro do módulo, com
`Math.random` como padrão, e quem quiser semear troca. Nada muda para a mesa em uso normal.

**Por que entra aqui e não no harness.** O teste-espelho (`03-respostas.md` §1.1.1) foi decidido em
02/09 para **comparar as rolagens também**, e não só os números determinísticos: a página roda com a
mesma semente do harness e o espelho confere dado a dado. Sem este ponto de injeção o espelho provaria
só que os dois lados **contam** igual, e não que **rolam** igual. O harness precisaria dele de
qualquer forma (§2.1).

**Cuidados.** `mesa-ficha.ts:133` (`rolarIniciativaPC`) e `artes-grid.ts:1342` têm o mesmo
`Math.random` embutido e precisam do mesmo tratamento, senão a iniciativa e o dano de Arte continuam
fora da semente. `mesa-core.ts:28` também tem, mas é geração de id e não entra na conta.

**Prova.** O próprio teste-espelho: com a mesma semente dos dois lados, as rolagens têm de bater.

---

**Ordem sugerida.** Os itens **1 a 6** são o núcleo do Tick, se sustentam sozinhos e cabem em quatro
funções (`agendaSimultanea`, `grupoDaVez`, `golpeMaisCedo`, e a leitura do retrato na folha). O **7**
é a migração, e o **6** depende dela se o retrato for para o banco. O **8** e o **9** são tela. O
**10** e o **12** são isolados. O **11** é o maior e o mais arriscado, e vale por último, quando o
resto estiver verde.


---

## 0.7 A linha de base, o Fôlego e as dezesseis bandeiras

Decidido em 02/09, depois do `03-respostas.md`.

### A rota: bandeiras, e uma bateria mede os dois lados

N1 a N6 entram na mesa **já chaveadas**, somando-se às de D2, e uma bateria só mede o perfil cheio e
cada regra isolada. O que a rota custa e o que perde está na `03-respostas.md` §2.4; o que ela ganha
é que as regras entram agora, os furos da R2 fecham antes da primeira medição, e cada regra recebe o
seu próprio número em vez de ser medida em bloco.

**N5 é a única das seis que não isola inteira, e a saída é medir só a metade que dá.** A
`03-respostas.md` §2.1 mostra por quê: hoje não existe laço a inverter, então "sem as três fases" não
é um comportamento, é a ausência de uma regra. **Decidido em 02/09: as três fases entram fixas, e a
bandeira `n5` cobre só a ordem inversa**, cujo desligado é real e observável (a ordem da faixa, por
Tick). Mede-se o que dá para medir e não se inventa passado.

### O Fôlego fica de fora

A régua está inteira em `regras.json → derivados.folego` (atacar e correr gastam, defender e parar
recuperam +Vigor por Tick, cada golpe custa o Fôlego cheio da arma, "Tomar Fôlego" é ação de
Velocidade 5, abaixo de 25% do pool são −1d6 e em 0 é exaustão), as 26 armas têm o campo (leve 15,
médio 24, pesado 38) e `calc.ts:85` calcula a reserva. **Nada no combate gasta um ponto**, e
`src/lib/modulos.ts` já diz `folego: false`, com a justificativa escrita de que é módulo avançado.

**Decidido: a simulação mede o jogo que se joga, e o Fôlego não entra.** Fica registrada a
consequência, que não é pequena: **o Fôlego é o único freio que o sistema tem numa perseguição e numa
sequência de golpes.** Sem ele, correr é grátis para sempre, e o eixo E4 (o alvo mais rápido que
nunca é alcançado) mede um estado permanente em vez de uma corrida que termina por exaustão. É por
isso que a regra dos 10 Ticks da §0.1 precisa existir: ela faz o papel que o Fôlego faria.

### A Mana do Conjurador, e um teste que sai daí

A reserva **não volta em cena**: `arcano.recuperacaoMana` é Centelha por hora, e o dobro em descanso.
O Conjurador tem orçamento finito por batalha.

**Decidido: ele raciona, alternando ataque comum e Arte.** A regra concreta, com os números marcados
como invenção ⚑, entra na política da §0.4 P4:

1. se um aliado está abaixo de 50% de Vida, no alcance, e há Mana: Cura;
2. se há Mana **acima de 30% da reserva**: a regra de escolha de Efeito da §0.4 P4 (zona para dois ou
   mais agrupados, projétil para um, empurrão para quem encostou);
3. se há Mana **abaixo de 30%**: alterna, conjurando só a cada segunda ação e atacando com a adaga
   nas outras;
4. sem Mana: ataca com a adaga pelas regras do Agressivo.

**E fica anotado como um teste da bateria, e não como um pressuposto: a reserva de Mana é pequena
demais para os combates?** As saídas do log que respondem são o Tick em que cada conjurador cruza os
30% e o zero, a fração das batalhas em que ele termina esvaziado, e quantas ações ele passa como
lutador de adaga. Se o conjurador estiver zerado na metade das batalhas antes do meio delas, a
resposta é sim, e é um achado sobre o sistema e não sobre o harness.

### As cinco condições de dano por rodada viram bandeira

`sangrando`, `envenenado`, `sufocando`, `em-chamas` e `morrendo` têm o campo `porRodada`, e no Grid
**ninguém o lê**: só `combate.astro:1439` (R2 §C4). **Decidido: vira bandeira, e a bateria roda com e
sem**, para ver como se comportam. Ela é relevante no recorte escolhido porque `brasa-retardada`, um
dos oito Efeitos âncora, põe `em-chamas`.

### As dezesseis bandeiras, e o desenho que as mede

| Grupo | Bandeiras |
|---|---|
| de D2 (§0.1) | `margem` · `gate` · `couraca` · `porte` · `bloqueio` · `modo2` · `teto6` |
| da Cura (§0.4 P1) | `curaSemArea` · `curaDivide` |
| do núcleo do Tick | `n1` (já é o parâmetro `decideEmValeDepois`) · `n2` · `n3` · `n4` · `n5` (só a ordem inversa) · `n6` |
| nova | `porRodada` |
| **fora** | o Fôlego, por decisão acima |

**Onde elas moram: num bloco novo do `regras.json`, e o manifesto da bateria passa a fazer hash de
`src/data` e de `src/lib`.** As razões, com o custo de cada alternativa, estão na conversa de 02/09 e
resumem-se a duas: `combate-tempo.ts` já importa `regras.json` e nada mais, então não entra
dependência nova e o empacotamento headless pega de graça; e o `dados_hash` do manifesto (§2.4) já
registra mudança em `src/data/*.json`, o que faz uma troca de bandeira ficar automaticamente anotada
na bateria que rodou com ela. O hash passa a cobrir `src/lib` também, para que mudança de código, e
não só de régua, fique registrada do mesmo jeito. O `src/lib/modulos.ts` continua sendo o que ele diz
que é: só tela.

São **16**, e o desenho é o **deixe-uma-de-fora** da `03-respostas.md` §2.2:

| Perfil | Quantos |
|---|---:|
| cheio | 1 |
| cheio menos uma, uma por bandeira | 16 |
| tudo desligado (a linha de base reconstruída) | 1 |
| **total, que é o número de níveis de E5** | **18** |

Duas coisas que esse desenho carrega e vale repetir: ele respeita sozinho a dependência entre `n1` e
`n2` (desligar `n2` a partir do cheio mantém `n1` ligada, que é a única configuração em que `n2` é
observável), e ele mede **efeito principal**, não interação: se a Margem e o gate se cancelarem, ou
se o Bloqueio só importar com a Couraça ligada, este desenho não vê.

## 1. O que eu preciso de você

*Todas respondidas em 02/09. As respostas estão na §0; o que segue é o que cada opção significava.*

### D1 · O harness mede o Grid de hoje ou o Grid automatizado?

| Opção | O que o harness reproduz | O que muda no desenho |
|---|---|---|
| **1a · o Grid de hoje** | as 14 paradas de R2 §B acontecem todas, inclusive as 6 que são aritmética (classe **iii**). Cada uma vira um evento de consulta, respondido por uma política | o log precisa modelar **a caixa**: quantos campos ela mostra, quantos abrem em branco, quem seria consultado. Isso exige a tabela de custo de tela da §2.5, que é dado de fora, não saída de simulação |
| **1b · o Grid automatizado** | as 6 paradas **iii** somem: o motor resolve e não consulta ninguém. Sobram as **i** (decisão de jogador) e as **ii** (julgamento narrativo) | o log só registra decisão. A tabela de custo de tela vira desnecessária para 6 linhas, e a métrica principal passa a ser "quantas escolhas o jogo exige", não "quantas caixas abrem" |
| **1c · os dois, mesma batalha** | cada batalha roda duas vezes com a mesma semente, uma em cada perfil, e a diferença entre as duas **é** a medida do que a automação compraria | o registro de execução ganha um campo `perfil`, e todo evento de parada ganha `automatizavel: bool`. Custa o dobro de tempo de máquina, que pela R2 §D1 é irrelevante, e obriga a política a ser a mesma nos dois perfis, senão a diferença mede duas coisas |

**Bloqueia o começo.** Define o esquema do log (§2.5) e o que a §2.3 chama de "resolvida por regra
automática". Fica em branco esperando: as colunas `campos` / `editaveis` / `gestos` do log, e as três
métricas de gesto da §2.6.

### D2 · A simulação obedece o motor como está, ou as regras que faltam?

As sete divergências que mudam número (R2 §F, itens 1, 2, 5, 6, 7, 8 e 10), com a direção que cada
uma empurra a **duração** do combate, que é o multiplicador de toda a carga:

| Regra ausente | Direção na duração | Quem sente |
|---|---|---|
| Margem de dano (+1d6 a cada 6 acima da Defesa) | **encurta**, e muito: +47% num acerto com folga de 6 a 11 (R2 §F#1) | todos, sempre |
| Gate de Perfuração (abaixo do Nível, dano 0) | **alonga** contra armadura pesada, sem teto quando a arma não vence o Nível | flecha, lança e besta contra placa |
| Couraça de Porte | **alonga** contra bicho grande: 4 a 10 pontos por golpe nas 46 criaturas Enorme ou acima | quem caça monstro |
| Porte no acerto (±3 por categoria, teto ±12) | **encurta** contra o grande, **alonga** contra o pequeno | idem, nos dois sentidos |
| Bloqueio com arma e escudo | **alonga**: hoje o escudo é −2 a −4 de Defesa e nada em troca | quem carrega escudo |
| Modo secundário (−2 acerto, −1d6) | **alonga** um pouco, e apaga a jogada dominante de atacar sempre pelo tipo menos absorvido | todos |
| Teto de ±6 nos modificadores | **alonga** os casos extremos (hoje −10 é alcançável) | cenas com muitas condições |

| Opção | O que muda no desenho |
|---|---|
| **2a · o motor como está** | o harness é espelho fiel da mesa e mede a carga que o jogador sente **hoje**. Nada de novo precisa ser escrito, e a §2.1 não ganha nenhum caminho de código que a tela não tenha |
| **2b · as regras que faltam, ligadas** | são 7 regras a implementar **no caminho headless**. Se a tela não as ganhar junto, isso cria por construção o segundo caminho de código que a §2.1 existe para evitar, e a próxima auditoria vai listar sete divergências novas em vez das cinco de hoje |
| **2c · chaveável, e a tela lendo a mesma chave** | cada regra vira uma bandeira num objeto de perfil, lida pelo módulo extraído. A mesa passa a ler o mesmo objeto, com todas desligadas, ficando idêntica a hoje. O harness roda A/B e **a diferença entre 2a e 2b vira medida**, não opinião. Custo: a extração da §2.1 tem de vir antes, e inteira |

**Bloqueia o começo** para 2b e 2c; para 2a não bloqueia nada. Fica em branco esperando: o eixo E5
da §3, que tem 1 ou 2 níveis conforme a resposta.

### D3 · Quem decide pelos PCs, e com que política?

Hoje o robô só existe para criatura, só no Simultâneo, e faz duas coisas: ataca o inimigo de pé mais
próximo, foge abaixo de 25% de Vida (`decisaoAutomatica`, `combate-tempo.ts:880-892`).

| Opção | O que muda |
|---|---|
| **3a · o mesmo robô dos dois lados** | zero código de decisão novo. Mede uma mesa em que ninguém joga bem, e **colapsa o eixo tático**: todo mundo persegue o mais próximo, então a perseguição, que é a fonte de re-projeção, vira função só da geometria inicial e não da escolha |
| **3b · políticas declaradas como dado** | alguns perfis (agressivo, cauteloso, tocaiador, guarda-costas), cada um uma lista ordenada de regras "se X então Y". Vira um eixo do experimento (E6, §3). O repertório de cada política tem de sair da lista real de declaráveis: atacar em 4 manobras, mover em 3 modos, conjurar, abortar, esperar 1 Tick, "outra coisa" |
| **3c · política de um passo à frente** | a cada decisão avalia as opções declaráveis e escolhe a de maior dano esperado por Tick, descontando a Defesa que a escada vai custar. Mede o **teto** do sistema, o que um jogador ótimo faria, e não a mesa. Precisa de uma função de avaliação, que é regra de jogo inventada por mim |
| **3d · o mestre joga os dois lados** | é o que a R2 §C3 já contou: 5 dos 5 gestos são dele. Mede a carga do pior caso administrativo, e não mede jogador nenhum |

**Bloqueia o começo.** A política é quem gera declaração, e sem ela o laço da §2.2 não tem passo 4.
Fica em branco esperando: a §2.3 inteira (o que é "resolvida por política"), o eixo E6, e a métrica
de tempo morto do jogador, que só existe se houver jogador.

### D4 · O que é fim de batalha, incluindo o alvo que nunca é alcançado?

Hoje **não existe fim de batalha** no Grid (R1 §8), e a bancada corta em 4000 Ticks
(`lib-tempo.mjs:382`). A perseguição não tem teto por decisão registrada em 02/09
(`combate-tempo.ts:826-828`: "quem desiste é a mesa, no abortar, e não o motor").

| Opção | O que muda |
|---|---|
| **4a · um lado sem ninguém de pé** | o mais simples. Uma fração das batalhas nunca termina, e essa fração vira dado, não erro |
| **4b · 4a, mais a fuga que sai do tabuleiro** | quem foge e chega à borda, ou passa de N hexágonos do inimigo mais próximo, é retirado e contado como baixa. Fecha a perseguição pelo mapa, e o **tamanho do mapa** passa a decidir a duração da batalha |
| **4c · 4a, mais teto de Ticks, marcada "indecisa"** | corta em N Ticks. Toda métrica com "por batalha" no denominador fica enviesada pelas indecisas: ou elas vão para um balde próprio, ou o número está errado |
| **4d · 4a, mais teto de adiamento** | depois de K re-projeções seguidas da mesma ação, o perseguidor desiste, que é o gesto que a mesa faria no abortar. **Isto é regra de jogo nova**, e mudaria o Grid, não só o harness |

E a pergunta colada nessa: **a batalha não terminada é descartada ou contada?** Descartar enviesa
para baixo tudo o que cresce com a duração, que é justamente a carga.

**Bloqueia o começo.** É a condição de saída do laço. Fica em branco esperando: a métrica "fração
que não termina" da §2.6, e a leitura inteira do eixo E4 da §3.

### D5 · Que cenas são o alvo, e em que eixo elas variam?

| Opção | O que muda |
|---|---|
| **5a · um punhado de cenas escolhidas à mão** | reproduz mesas reais e não generaliza: o resultado vale para aquelas cenas, e a §3 é substituída pela sua lista |
| **5b · grade fatorial sobre eixos** | é o que a §3 propõe. Generaliza e isola o efeito de cada eixo. Exige que os níveis de cada eixo sejam seus, senão a régua é minha |
| **5c · amostragem do bestiário real** | sorteia criaturas das 309 por faixa de perigo. Mede a distribuição que o jogo tem, e não isola nada: os eixos ficam confundidos entre si, porque bicho grande também é lento e também é duro |

**Bloqueia o começo** se for 5a. Nos outros dois, bloqueia só o resultado.

### As minhas

**Q6 · A resolução extraída passa a ser a única, ou o harness ganha uma cópia?**
A §2.1 propõe extrair o miolo de `folhaDaAcao` para um módulo puro e fazer `grid.astro` importar
dele. É refatoração no arquivo mais movimentado do repositório (9.266 linhas), com outra instância
mexendo na mesma árvore. A alternativa, uma cópia headless, já foi tentada: o resultado é
`lib-tempo.mjs`, que hoje discorda da mesa em cinco pontos (R2 §F#11, §F#12, §A1, e §D3, que é a
ausência de mapa). Opções: extrair de verdade · copiar e aceitar a divergência · copiar e escrever
um teste-espelho que compare as duas a cada build.
**Bloqueia o começo.**

**Q7 · As condições expiram no harness?**
O campo `ate` é escrito por `porCondicao` e nunca lido (R2 §C4). Numa batalha de 40 Ticks o efeito é
pequeno; numa de 300, que é o alvo que foge, toda condição posta por Arte fica para sempre. Opções:
o harness expira, e diverge da mesa medindo um jogo que não existe · não expira, e a estatística
longa acumula condição eterna · não usa Arte nenhuma, e a pergunta some.
**Só o resultado**, mas contamina qualquer cena com Arte.

**Q8 · O harness mede uma mesa com quantos jogadores?**
A separação "gesto do mestre" × "gesto do dono da peça" (R2 §C3) só existe se houver alguém do outro
lado. Com o mestre jogando tudo, os 19 gestos do caminho longo são 19 dele. Opções: 0 jogadores
(mestre solo) · 1 por PC · um número fixo por cena.
**Só o resultado**, e é ele que decide se a métrica principal é "gestos do mestre" ou "fração dos
gestos que é do mestre".

**Q9 · O perfil de rolagem é `site`, `misto` ou `mesa`?**
É a única chave que já hoje tira digitação do mestre, e muda a contagem de gestos da folha de 6 para
1 (R2 §C2 e §I.10). Se não for fixada, boa parte da variância da métrica principal é essa chave.
**Só o resultado.**

**Q10 · Artes entram no escopo?**
Se entrarem: a R2 §E mostra que **nenhuma das 24 Artes tem comportamento mecânico completo**, e que
a resistência (o teste que decide se a Arte pega) não existe nem como código nem como regra fechada,
já que o próprio capítulo a lista em revisão. O harness teria de inventá-la, e estaria medindo a
carga de uma regra que não existe. Se não entrarem: somem as paradas #7, #8 e #9, três das catorze,
e o pior caso da R2 §H4 (10 folhas + 8 caixas de efeito + 8 de saída) vira só 10 folhas.
**Bloqueia o começo** da §2.3.

**Q11 · O mapa tem obstáculo, ou só peças?**
O único veto de passo hoje é casa ocupada (`ocupadoPor`, `grid.astro:5880-5892`): não há parede, não
há cobertura, não há terreno. Perseguição em campo aberto é geometria trivial, porque `caminharHex`
é o caminho mínimo e a re-projeção converge. Com obstáculo, o passo pode não aproximar por vários
Ticks seguidos, e é aí que o vaivém consertado em 02/09 volta a ter de que se defender.
**Bloqueia o começo** do gerador de cena.

**Q12 · Tamanho do mapa, escala em metros, e posição inicial.**
A distância inicial é o parâmetro mais forte de tudo o que interessa: ela cria viagem, e viagem cria
re-projeção, Tick vazio e tempo morto. `arena.escala_m` é livre, e a bancada nunca respondeu isto
porque não tem mapa.
**Bloqueia o começo.**

**Q13 · O repertório declarável, e as 461 Técnicas.**
A R2 §I.7 já perguntou; repito com a consequência. Se a simulação mede o repertório que existe, o
"muitas opções para o jogador" que você quer avaliar tem **6 opções** (atacar em 4 manobras, mover em
3 modos, conjurar, abortar, esperar, outra coisa), e o resultado vai ser um número baixo por
construção, não por descoberta.
**Só o resultado**, e é o que decide se o relatório final responde à sua pergunta ou a outra.

**Q14 · O relatório final é para você ler, ou para virar portão de regressão?**
Se for leitura, a saída é um `.md` com tabelas. Se for portão, o harness precisa de números estáveis
entre execuções (semente fixa) e de um limiar por métrica, e a semente fixa mata a amostragem da §3.
**Só o resultado.**

---

## 2. Como o harness deve funcionar

### 2.1 De onde vem o motor

#### Reaproveitado como está

Empacotado com `esbuild` para `.mjs` e importado em Node, que é o que
`scripts/test-simultaneo.mjs:21-33` e `test-combate-tempo.mjs` já fazem hoje.

| Módulo | O que entrega | Ressalva |
|---|---|---|
| `src/lib/combate-tempo.ts` | anatomia, agenda, re-projeção, escada de Defesa, fases, fila (`ordemDaFila`), `decisaoAutomatica`, `passoDoGolpe` | nenhuma: R2 §A3 confirmou 2 imports e zero globais de navegador |
| `src/lib/hex.ts` | `distanciaHex`, `caminharHex`, `alemDe`, vizinhança | puro e determinístico por construção (`hex.ts:125-127`) |
| `src/lib/quase-acerto.ts` | `saidaDoAtaque`, `errouPor`, classes | puro |
| `src/lib/calc.ts` | `defesa`, `defesaMental`, `empilharArmaduras`, `soakNatural`, `deslocamento`, e a `gatePerfuracao` que ninguém chama | puro |
| `src/lib/combate-resumo.ts` | `resumoCombatePC`: ataque, dano, Defesa, Absorção, QA, passo | puro |
| `src/lib/equip.ts` | catálogo de armas, armaduras e escudos | puro |
| `src/lib/mesa-core.ts` | `somarCondicoes` | tem `Math.random` em `novoId` (L28), que o harness não precisa chamar |
| `src/lib/alcance.ts` | faixa de distância de tiro e arremesso | puro |
| `src/lib/mesa-bestiario.ts` | `resumoDe`, `baseResumo`, `iniDeMonstro` | `iniDeMonstro` rola dado |
| `src/lib/rolagem.ts` | `rolarExpr`, `descreverRolada` | **precisa de uma mudança de uma linha**: `d6` (L11) chama `Math.random` direto. Sem um ponto de injeção não há semente, e sem semente não há reexecução da batalha 743 |
| `src/lib/mesa-ficha.ts` | leitura da ficha de PC | `rolarIniciativaPC` (L133) tem o mesmo `Math.random` |

#### Reimplementado a partir de `grid.astro`, com este contrato

Com a cópia (Q6), estas peças não são extraídas: são reescritas no harness a partir do contrato da
tabela, e a cena espelho é o que impede as duas versões de andarem para lados diferentes.

Cada peça abaixo hoje mora dentro do componente, misturada com desenho e com gravação. O contrato
proposto é sempre o mesmo formato: entra estado e sai estado novo mais eventos, sem `await`, sem
`SB`, sem `document`.

| Peça | Onde está hoje | Entra | Sai |
|---|---|---|---|
| `defesaEfetiva` | L7465-7474 | resumo do alvo, condições, ação, Tick, pressão | `{ total, base, ferimento, condicoes, escada, pressao }` |
| `resolverGolpe` | miolo de `folhaDaAcao`, L7432-7997 | resumo do atacante e do alvo, ação, manobra, índice do golpe, distância em hexágonos, perfil de regras (D2), fonte de acaso | `{ total, defesa, errouPor, veredito, danoBruto, tipo, absorcao, danoLiquido, rolls }` |
| `aplicarDanoPuro` | L8072-8085 | alvo, bruto, tipo, condições | `{ liquido, pvAntes, pvDepois, caiu: bool }` |
| `soakDePuro` | L8028-8033 | resumo, condições, tipo | número |
| `passoDaPeca` / `passoNoModo` | L4866-4890 | resumo da peça, modo | metros por Tick |
| `alcanceDaPeca` | L4850-4852 | resumo da peça | hexágonos |
| `ocupacao` (`ocupadoPor`, `podeDividir`, `diametroM`) | L5834, L5880, L3011 | posições, portes, escala | `(q, r) => bool` |
| `filaDaCena` (`naFila`, `tickDaVez`, `grupoDaVez`, `instanteDeGolpe`, `golpeMaisCedo`) | L4059-4200 | peças, tokens, Tick | lista ordenada, Tick corrente, quem está livre |
| `avancoDeTick` | `avancarTickSimultaneo`, L4902-5016 | cena inteira | cena nova + lista de eventos |
| `declararAtaque` | parte não visual de `declararAtaqueSimultaneo`, L5185-5260 | atacante, alvo, manobra, modo de movimento, posições | `Acao` completa (agenda, `mov`, contrapé) |
| `chao` (`conferirChao`, `DELAY_AO_LEVANTAR`) | L4189-4216 | peças, Tick | quem levantou, com o atraso de 5 |
| `efeitosDoTick` | `verificarEfeitos`, `artes-grid-mesa.ts:1449-1512` | efeitos ativos, posições, Tick | mordidas, saídas oferecidas, efeitos vencidos |

#### Reimplementado do zero

Persistência (um objeto em memória no lugar do Supabase) · o humano (a função `consultar` da §2.5) ·
o gerador de cena e de elenco (§2.7) · a condição de fim (D4) · o log (§2.5) · o agregador.

#### Como as duas versões não divergem

**A decisão foi a cópia** (Q6), e esta seção existe para dizer o que ela custa. A extração fica
registrada como a alternativa recusada: um módulo puro único, importado por `grid.astro`, que ficaria
com três responsabilidades e nenhuma conta (perguntar ao humano, desenhar, gravar).

O motivo de a extração ter sido defendida, e de a cópia precisar de defesa própria, é a lição do que
já aconteceu. `lib-tempo.mjs` é a cópia headless que fizemos antes, e ela discorda da mesa em cinco
pontos hoje: aplica a Margem que a mesa não aplica (R2 §A1), classifica o Quase-Acerto pela classe de
tempo enquanto a mesa classifica pelo dano médio (§F#11), usa um limiar de raspão um ponto mais
generoso (§F#12), embaralha a ordem de ação com Fisher-Yates enquanto a mesa ordena por `ordemDaFila`,
e não tem mapa nenhum (§D3). Nenhuma dessas divergências apareceu como erro: **as duas passam nos seus
próprios testes.** Divergência entre dois caminhos não é pega por teste, é pega por comparação, e
ninguém estava comparando.

**Com a cópia, a comparação tem de ser construída de propósito, e o instrumento é a cena espelho.**
Ela está especificada na `03-respostas.md` §1.1.1: a cena fixa, os campos comparados por Tick e por
peça, o perfil de bandeiras sob o qual roda, onde roda e o que falha. Um ponto de lá vale repetir
aqui, porque corrige o que esta seção dizia antes: **o espelho vale sob qualquer perfil de bandeiras,
desde que os dois lados leiam o mesmo.** A ressalva de que ele só valeria com todas desligadas era
verdadeira quando as bandeiras iam viver só no harness, e deixou de ser quando a §0.6 decidiu que a
mesa lê o mesmo perfil.

### 2.2 O laço

Um Tick do harness, na ordem, com a diferença em relação a `avancarTickSimultaneo` (L4902-5016)
apontada em cada passo.

| # | Passo | Igual ao Grid? |
|---|---|---|
| 0 | **Guarda de golpe devido.** Se há golpe com Tick ≤ Tick corrente ainda não resolvido, o relógio não anda | **igual**: é o `if (instanteDeGolpe()) return` da L4903. No harness ela nunca dispara, porque o passo 5 sempre resolve; a guarda fica como asserção, e se disparar é defeito |
| 1 | **T ← T + 1** | igual (L4904-4906), sem a gravação de `tick_atual` |
| 2 | **Passo de todas as peças em trajeto**, na ordem de `filaDaCena`. Para cada uma: pula quem está no chão, pula quem não tem `mov.auto`, pula quem declarou neste mesmo Tick (`desde + 1 > T`), calcula `passos` pela escala, restringe o passo se está na fase de Golpe (`passoDoGolpe`), caminha com veto de ocupação, e repete com veto frouxo se não aproximou | **igual**, linha por linha (L4912-4966). É o passo que mais depende da extração fiel |
| 3 | **Encerrar trajeto ou re-projetar.** Quem chegou ao alcance, ou atravessou, perde o `mov`; quem não chegou passa por `reprojetarAgenda` com a viagem que sobrou medida no passo real | **igual** (L4984-5012) |
| 4 | **Fase 1, declaração**: todos os livres declaram, na ordem de **N4** (cadeia crescente; iniciativa na frente durante a entrada, Rac + Prontidão na frente depois). Criaturas pela `decisaoAutomatica`, PCs pela política de D3. Nenhuma consequência acontece aqui | **diferente**. Hoje só as criaturas decidem dentro do avanço (`decidirAutomaticas`, L5017) e os PCs decidem quando o humano clica, em qualquer momento e em qualquer ordem. Com N4 e N5 a ordem passa a ser regra |
| 4b | **Fase 2, o retrato**: fecha-se a leitura do estado (Vida, condições, Pressão, posição) que a fase 3 inteira vai usar | **novo**, e é **N6**. Não existe no Grid |
| 5 | **Fase 3, resolução**: os golpes com Tick ≤ T, **na ordem inversa da declaração** (N5), lendo o retrato (N6), incluindo os de quem caiu neste mesmo Tick (N3) | **diferente na forma, igual na posição**. No Grid isto não é parte do avanço: é o cartão da faixa, clicado depois, e o ⏭ fica desligado enquanto houver golpe devido (L4324-4326). Com **N2** essa ordem deixa de ser acidente da interface e vira regra, e com **N6** a ordem dentro da fase não muda número nenhum: ela decide só o que se conta primeiro |
| 6 | **Efeitos de Arte** (mordidas, saídas, vencimentos), se Q10 disser que Artes entram | **igual à posição** (L5021), com a diferença de que a caixa de efeito e a de saída viram política |
| 7 | **Chão, mortes e o fim do retrato.** Vida a zero sai da fila; quem levantou paga os 5 Ticks de `DELAY_AO_LEVANTAR`. Aqui as penalidades nascidas em T passam a valer, para T+1 em diante | **diferente na hora**: hoje `conferirChao` roda a cada repintura (L4207), o que é "quando a tela desenhar". No harness roda uma vez por Tick, no fim, e é isso que faz a morte mútua ser possível |
| 8 | **Expiração de condições** (o `ate`), conforme Q7 | **diferente**: no Grid isto não acontece, o campo `ate` é escrito e nunca lido |
| 9 | **Fim de batalha** (D4) | **diferente**: no Grid não existe |

Três diferenças merecem ser ditas com a consequência, porque mudam número e não só ordem:

- **O passo 4 antes do passo 5 abaixa a Defesa de quem acabou de declarar.** `faseEm(acao, T)` devolve
  **`preparo`** para uma ação declarada no Tick T (`combate-tempo.ts:595-606`), e a escada cobra −2
  (`defesaPerdida`, L620). Ou seja: quem decide no Tick T recebe o golpe que vence no mesmo Tick T já
  com a guarda baixa. **Com N1 isso passa a estar certo** (a ação começa em T, então a guarda abrir em
  T é o esperado); com a régua de hoje era um Tick de guarda aberta a mais do que a ação, que é o que
  a §0.45 descreve. Nos dois casos o número é o mesmo e o harness o mede igual.
- **O passo 2 antes do passo 5** significa que a peça dá o passo do Tick do Golpe **antes** de o
  golpe resolver, e a distância que a folha lê (L7478) é a de depois do passo. É por isso que
  `passoDoGolpe` existe. O harness mantém.
- **O passo 7 no fim do Tick**, e não a cada repintura, elimina uma indeterminação real do Grid: hoje
  o número de repinturas por Tick depende de eventos de interface, e quem morre pode sair da fila
  antes ou depois de outra peça agir, conforme a tela.

### 2.3 As catorze paradas viram o quê

**P** = resolvida por política, e nesse caso **a simulação está inventando uma regra de jogo**;
**A** = resolvida por regra automática, com a função pura que faz a conta; **F** = fora de escopo.

| # | Parada | Vira | Observação |
|---|---|---|---|
| 1 | Declarar ataque | **P** ⚑ | manobra (4 opções), modo de deslocamento (3), m/Tick e trajetória. É a decisão mais consequente do sistema e sai inteira de D3 |
| 2 | A folha da ação | **A** para o veredito e o dano (`saidaDoAtaque`, `rolarExpr`, `defesaPerdida`, `soakDe`); **F** para o ajuste avulso com motivo | é a parada que hoje trava a cena, e a que mais barato se automatiza |
| 3 | Escolher o alvo | **P** ⚑ | hoje o robô escolhe o mais próximo; qualquer outra regra é invenção |
| 4 | Soltar peça em casa vazia | **P** ⚑ | para onde mover quando não se está atacando. Sem D3 isto fica em branco |
| 5 | Abortar o gesto | **P** ⚑, pendente de P4 | com D3 respondida, cada política declara se aborta e quando. Se nenhuma abortar, a perseguição sem teto de adiamento (D4) só termina pela borda do mapa ou pela desistência a 20% |
| 6 | "Outra coisa" | **F** | é narração livre; não tem forma de dado |
| 7 | Efeito pegando alguém | **A** (`dentroDoEfeito`, `jaMordido`, `danoNoAlvo`) | entra: Q10 pôs zona, aura, muro e cone no escopo. A política é sempre "cobrar todos", que é o que o mestre faz quando não quer pensar |
| 8 | Sair da área | **P** ⚑ para a escolha (sair / ficar por coragem / comer inteiro), **A** para a conta (`desvioDaArea`, `rolarPool`) | é a única parada com default declarado hoje: comer inteiro (L1298) |
| 9 | Conjurar | **P** ⚑ | entra, no recorte da §0.1: qual Efeito, que nível, quais parâmetros e onde soltar. O mirado ainda precisa da rolagem de acerto que não existe (P3) |
| 10 | Rolar iniciativa | **A** (`rolarIniciativaPC`, `iniDeMonstro`, `ticksDeEntrada`) | com a fonte de acaso semeada |
| 11 | Avançar o Tick | **A** | é o laço |
| 12 | Cartão da faixa | **A** | a ordem é a da fila, que já é total |
| 13 | Curar / tirar Vida / Mana / ordem | **F** | correção do mestre; não existe sem mesa |
| 14 | Ação na aba Combate | **F** | é outro sistema de tempo |

Contagem, já com as respostas da §0: **6 políticas** (#1, #3, #4, #5, #8, #9), **5 regras
automáticas** (#2, #7, #10, #11, #12), **3 fora de escopo** (#6, #13, #14) e nenhuma em branco. A #2
e a #8 aparecem duas vezes porque se partem: a escolha é política, a conta é automática. Cada ⚑ é uma regra de jogo que o harness inventa, e toda métrica que dependa dela carrega
essa invenção junto.

### 2.4 Determinismo

**A ordem de resolução deixou de importar.** Com N2 e N3 (§0.45), ninguém declara sabendo do golpe do
outro e ninguém deixa de golpear porque o outro foi resolvido primeiro. Isso muda a natureza do que
esta seção precisa garantir: antes ela podia dar ordem de iteração estável, mas não podia dar que a
ordem fosse irrelevante. Agora ela é irrelevante dentro do Tick, e a estabilidade da fila serve só
para o log sair sempre no mesmo arranjo.

**A semente.** Uma por batalha, derivada e não sorteada:

```
semente(b) = hash64(semente_mestre, cenario_id, repeticao)
```

Assim a batalha 743 é reproduzível sem depender de nenhuma anterior, e acrescentar uma batalha no
fim não muda nenhuma das outras.

**Fluxos separados por finalidade.** Um único fluxo de acaso faz com que acrescentar uma rolagem
desloque todas as seguintes, e aí uma execução A/B de D2 mistura o efeito da regra com o efeito do
deslocamento. Proposta: fluxos independentes, cada um semeado por `hash64(semente(b), rotulo)`:
`acerto`, `dano`, `iniciativa`, `efeito`, `politica`. O gerador de números é o xorshift que a bancada
já usa (`lib-tempo.mjs:50-61`), que é o que faz `rolagem.ts` precisar do ponto de injeção da §2.1.

**Ordem de iteração.** Com N4 e N5 (§0.46), a ordem dentro do Tick deixou de ser detalhe de
implementação e virou regra: declara-se pela cadeia crescente e resolve-se pela inversa. O que esta
seção ainda precisa garantir é o **desempate final**, quando a cadeia inteira empata e a regra manda
sortear. `ordemDaFila` (`combate-tempo.ts:399-404`) desempata em cinco níveis: Tick,
iniciativa, Raciocínio, `chegada`, nome. Na mesa, `chegada` é `TOKENS[c.id]?.em` (`grid.astro:4064`),
que é um `new Date().toISOString()` do instante em que a peça foi posta no mapa: é relógio de parede,
e portanto não reproduzível. A correção não exige mexer no motor: o próprio comentário do campo diz
"um carimbo, um id, o que a tela tiver" (`combate-tempo.ts:395`). O harness alimenta `chegada` com um
**ordinal de entrada**, inteiro, atribuído pelo gerador de cena. A ordem passa a ser total e estável.

**E nada de embaralhar.** A bancada faz Fisher-Yates a cada Tick (`lib-tempo.mjs:458-460`); a mesa
não. O harness segue a mesa.

**O que grava para reexecutar a batalha 743.** Dois arquivos, e nada mais:

`bateria.json`, um por execução:

```
run_id            texto
commit            o sha do repositório
iso               data e hora
semente_mestre    inteiro de 64 bits
perfil            { d1, d2: {margem, gate, couraca, porte, bloqueio, modo2, teto6},
                    d3: politica, d4: {tipo, teto_ticks, teto_adiamento}, q7, q9, q10 }
grade             os eixos e os níveis (§3)
dados_hash        sha1 do conteúdo de src/data/*.json E de src/lib/*.ts, para saber se a
                  régua ou o motor mudaram (decidido em 02/09, §0.7: as bandeiras moram no
                  regras.json, e o hash cobre o código junto para nenhuma bateria rodar com
                  uma configuração que o registro não conhece)
```

`sementes.jsonl`, uma linha por batalha:

```
b            inteiro, o número da batalha
cenario      texto, a célula da grade
semente      inteiro
mapa         { cols, rows, escala_m }
elenco       [ { cid, lado, fonte: 'monstro'|'pc-gerado', ref, ordinal } ]
posicoes     [ { cid, q, r } ]
```

Tamanho: o registro de uma batalha de 6 peças fica na casa de **400 a 700 bytes** em JSON, e 1000
batalhas em **menos de 1 MB**. Com esses dois arquivos e o mesmo commit, a batalha 743 roda de novo
idêntica; o log de eventos (§2.5) não precisa ser guardado para isso, ele é saída, não entrada.

### 2.5 O log de eventos

É a peça central, porque a métrica é interrupção e não dano. Formato: **JSON Lines**, um registro por
evento, um arquivo por batalha ou um por bateria com o campo `b`.

**Campos comuns a todo evento:**

```
b        int     a batalha
t        int     o Tick da cena
seq      int     a ordem dentro do Tick (é o que permite contar o que se acumula num mesmo instante)
ev       texto   o tipo, do vocabulário fechado abaixo
cid      texto   a peça de quem o evento é
alvo     texto?  a peça do outro lado, quando há
```

**Vocabulário de `ev`:** `cena.inicio` · `cena.fim` · `tick` · `decl` · `passo` · `reproj` ·
`golpe.vence` · `golpe.resolve` · `dano` · `chao` · `morte` · `efeito.mordida` · `efeito.saida` ·
`cond.poe` · `cond.tira` · `parada`.

**Campos do evento `parada`**, que é o que a métrica principal lê:

```
parada      int      1..14, o número da tabela da R2 §B
classe      'i'|'ii'|'iii'
quem        'mestre'|'dono'|'ambos'    quem seria consultado
campos      int      quantos valores a tela mostraria
editaveis   int      quantos abririam em branco (a digitação real)
gestos      int      o mínimo de cliques ou arrastos para responder
auto        bool     se a política respondeu sozinha no perfil corrente (D1)
travaria    bool     se, no Grid real, não responder congelaria o relógio da cena
pendentes   int      golpes no ar naquele instante
abertas     int      quantas outras paradas já esperavam no mesmo Tick
```

**Campos por tipo:** `golpe.resolve` leva `total, defesa, errou_por, veredito, dano_bruto, absorcao,
dano_liquido, tipo, manobra, indice, fase_alvo, dist_hex`; `passo` leva `de_q, de_r, para_q, para_r,
modo, passos, atravessou`; `reproj` leva `golpe_antes, golpe_depois, atraso, falta_hex, acumulado`
(quantas vezes aquela mesma ação já deslizou); `dano` leva `pv_antes, pv_depois, caiu`.

#### Como se obtém o que a R2 §G2 disse não existir em lugar nenhum

Cinco dos seis itens **não existem porque ninguém conta**, e a extração da §2.1 os entrega de graça.
O sexto não é obtenível headless.

| O que falta (R2 §G2) | De onde vem no harness |
|---|---|
| que **tipo** de parada é esta | do ponto de chamada. Todo lugar que hoje chama `showModal` ou `uiEscolher` passa a chamar uma função única, `consultar(pedido)`, e o `pedido` carrega o número da parada. Isso **cria** o ponto único que a R2 §G3 disse não existir, e cria inclusive para as três paradas que não são caixa nenhuma (a mira, o ⏭ e o cartão da faixa), que é o buraco que um gancho no nível de `<dialog>` nunca cobriria |
| quantas vezes o mestre foi consultado | contador dentro de `consultar` |
| quem responderia | campo do `pedido` |
| quantas caixas ao mesmo tempo | `abertas`, derivado de `seq` dentro do mesmo `t` |
| a série de golpes por Tick | os eventos `golpe.vence`, que hoje não são registrados porque a faixa é recalculada a cada repintura e nada guarda a série |
| **quanto tempo a caixa ficou aberta** | **não é obtenível.** É tempo humano, e o harness não tem humano. Ver §4 |

#### A tabela de custo de tela, e por que ela é dado e não simulação

Os campos `campos`, `editaveis` e `gestos` **não são deriváveis pelo motor**: eles descrevem a tela,
e a tela não existe no harness. Eles entram como uma tabela constante, uma linha por parada, lida da
fonte: `CAMPOS_ATQ` e `CAMPOS_ALVO` (`grid.astro:7718-7745`) dão os 21 campos calculados, os 4 que
abrem vazios saem de L7614, e a contagem de gestos sai da R2 §C3. Essa tabela é **entrada declarada,
não resultado medido**, e toda métrica de gesto tem de ser lida com essa etiqueta: o harness conta
quantas vezes a caixa abriria, e multiplica por um número que veio de leitura de código.

#### Tamanho

Um duelo de 37 Ticks (R2 §D1) gera da ordem de 37 `tick`, 30 `passo`, 8 `decl`, 8 `golpe.vence`,
8 `golpe.resolve`, 8 `dano` e as paradas correspondentes: **algo entre 100 e 150 registros**, com
~120 bytes cada, dá **12 a 18 KB por duelo**, e 3 a 5 KB comprimido. Mil duelos são ~15 MB, mil
refregas 3×3 são ~40 MB. Isso é confortável em disco e desconfortável em memória, então a saída é em
dois níveis: **log completo** para uma amostra declarada (por exemplo, 20 batalhas por célula, as
mesmas todo dia por serem escolhidas pela semente), e **contadores agregados** para todas.

### 2.6 As métricas

| Métrica | A pergunta sua que ela responde | Distribuição ou média |
|---|---|---|
| **Paradas por batalha**, total e por classe i/ii/iii | "quanta carga o mestre leva numa cena" | **distribuição**. A média esconde exatamente o que você pediu, que é a cauda |
| **Paradas do mestre por Tick** | "com que frequência o jogo para" | **distribuição**, com p50, p90, p99 e o máximo visto |
| **Pico de paradas num Tick** | "a fila empilha?" (R2 §H4 diz que o teto teórico é o número de peças) | **histograma**. O máximo é reportado como "o pior visto em n", nunca como "o pior caso": o máximo de uma amostra cresce com n e não é estimativa de nada |
| **Gestos do mestre por batalha** e **por golpe aplicado** | "quantos cliques custa um golpe" | **distribuição**. Carrega a etiqueta da tabela de custo de tela |
| **Fração dos gestos que é do mestre** | "o mestre está compondo o jogo dos outros?" | média, e ela cabe: é razão de dois totais grandes dentro da batalha |
| **Tempo morto do jogador, em Ticks** | "quanto tempo passa entre eu declarar e ver o efeito" | **distribuição**. Medido do `decl` de uma peça ao `dano` do primeiro golpe daquela ação |
| **Ticks por batalha** | é o multiplicador de tudo, e o que muda com D2 | **distribuição** |
| **Fração de Ticks vazios** (só passo, nenhuma resolução) | "o mestre clica ⏭ para nada?" | **as duas**: média dentro da batalha (é razão sobre dezenas de Ticks) e distribuição entre batalhas |
| **Adiamentos por ação** e **maior deslize** | "o que acontece com a perseguição que não fecha" | **distribuição**, e é o caso em que só a cauda interessa |
| **Fração de batalhas que não terminam** | idem, e depende de D4 | proporção, com intervalo binomial |
| **Colisão de agenda: N(T)** | valida a forma fechada da R2 §H1 contra o que de fato acontece | **histograma**, comparado com o previsto |
| **Fração dos golpes que caem em Tick múltiplo de 6** | mede a sincronia das oito fontes da R2 §H3 | proporção |

Onde a média cabe, cabe por um motivo só: quando é razão de dois contadores grandes acumulados
**dentro** da mesma batalha (Ticks vazios sobre Ticks, gestos do mestre sobre gestos totais), a média
não é resumo de uma cauda, é a própria quantidade. Tudo o que descreve **uma espera** vai como
distribuição, porque a experiência de mesa é a espera pior, não a espera média: um Tick com 10 folhas
é lembrado, e nove Ticks com uma folha não são.

### 2.7 O elenco

| Peça | Fonte | O que é real | O que é inventado |
|---|---|---|---|
| **Criaturas** | `src/data/monsters-mesa.json`, 309 blocos | Defesa, Absorção, Vida, iniciativa, o ataque único, a classe de tempo, as três velocidades (R1: `deslocamento` foi preenchido em 28/08) | **alcance** (nenhuma criatura tem), **armadura** (nenhuma tem), **Couraça de Porte** (não existe no dado nem no motor), e a **segunda opção de ataque**: um bicho com um ataque só nunca escolhe nada |
| **PCs** | 1 ficha de teste (`test-kael`) | a matemática de `resumoCombatePC`, o catálogo de armas, armaduras e escudos, os caps das 7 raças, o passo por `deslocamento()` | **a ficha inteira**. Uma ficha não é elenco. É preciso um gerador de personagem |
| **Mapa** | nada | `arena.escala_m` e a geometria de `hex.ts` | tamanho, forma, posições iniciais, obstáculo (Q11, Q12) |

**O gerador de PC**, se D5 não disser outra coisa: um arquétipo é um registro declarado, e não uma
sorte:

```
id            'espadachim-pesado'
raca          id de racas.json
attrs         { forca, destreza, vigor, percepcao, raciocinio, ... }  respeitando o cap da raça
skills        { esquiva, armas, bloqueio, atletismo, ... }
centelha      int
conjuntos     [ { habil: <ref de armas.json>, inabil: <ref de escudos.json ou nada> } ]
armaduras     [ ids de armaduras.json ]
willpower     int
```

Cada arquétipo passa por `resumoCombatePC` sem nenhum tratamento especial, que é o que garante que o
PC gerado e o PC de mesa somem os mesmos números.

**Como isso é declarado no relatório final**, para os dois não se confundirem: todo número agregado
carrega uma etiqueta de procedência, com três valores: `dado` (saiu de `src/data`), `derivado` (saiu
de função pura sobre `dado`) e `inventado` (saiu de escolha minha ou sua, registrada no perfil da
bateria). O relatório abre com uma tabela **"o que foi inventado"**, listando cada invenção, o valor
usado e a linha do documento em que ela foi decidida. E a regra dura: **uma métrica cujo valor depende
só de entrada inventada não é reportada como achado sobre o sistema**, é reportada como sensibilidade
("com alcance de criatura em 1 hexágono o número é X, com 2 é Y").

---

## 3. Os eixos do experimento

*A grade abaixo é a proposta original. As respostas da §0 a revisam: E2 ganhou um quarto nível, entrou
um eixo de obstáculo, e dois dos eixos deixaram de custar célula. A grade valendo está na §0.3; o
raciocínio, a previsão e a justificativa do número de repetições continuam sendo estes.*

O eixo principal não é quantidade de peças, é **diversidade de ciclos**, e a razão está na forma
fechada da R2 §H1: o golpe de uma peça cai em `T_golpe + k · ciclo`, então duas peças de mesmo ciclo
e mesma entrada colidem **sempre**, e ciclos diferentes colidem no mínimo múltiplo comum. Com as
Velocidades do catálogo (4, 5, 6, 7), m.m.c.(5,6) = 30 e m.m.c.(6,7) = 42, ou seja: dentro de uma
batalha de 37 a 47 Ticks, ciclos diferentes colidem uma ou duas vezes, e ciclos iguais colidem em
todos os golpes.

| Eixo | Níveis | Por quê |
|---|---|---|
| **E1 · diversidade de ciclos** | 4: (a) uníssono, todo mundo `ticks: 6` · (b) dois ciclos vizinhos, 5 e 6 · (c) dois ciclos coprimos, 6 e 7 · (d) os quatro ciclos misturados, 4/5/6/7 | é a fonte de colisão, e portanto de pico de carga |
| **E2 · distância inicial** | 3: encostado (dentro do alcance) · média (a peça mais lenta leva ~3 Ticks) · longa (~10 Ticks para a mais lenta) | é quem cria viagem, re-projeção, Tick vazio e tempo morto. É o eixo que a bancada nunca pôde medir |
| **E3 · tamanho da cena** | 3: 1v1 · 3×3 · 2×8 (a horda) | o total de paradas cresce com ele, e o **pico** cresce mais rápido (R2 §H4) |
| **E4 · assimetria de passo** | 2: passos iguais · um lado 2× mais rápido | é o alvo que nunca é alcançado, e é o teste direto do que a re-projeção faz sem teto |
| **E5 · perfil de regras** | 1 ou 2, conforme D2 | a duração é o multiplicador de toda a carga |
| **E6 · política** | conforme D3 | sem ele, o eixo tático não existe |

~~Com E1×E2×E3×E4 são **72 células**; com E5 em dois níveis, 144.~~ **Superado:** a tabela de eixos
acima é a proposta original, e a §0.5 tem a valendo (E2 ganhou um quarto nível, entraram E7 e E9,
E5 foi a 18 perfis e E6 ficou em 5). A grade é de **76 células**. A justificativa das repetições,
logo abaixo, não depende do número de células e continua valendo inteira.

**Quantas repetições, e por quê.** O número não sai de "1000", sai de duas contas:

- **Para as médias e o p95.** A quantidade mais ruidosa é o número de paradas por batalha, que herda
  a variância da duração, e a duração de um combate por desgaste tem coeficiente de variação na casa
  de 0,4 a 0,6. Para o erro relativo da média ficar em ±5% com 95% de confiança,
  `n ≈ (1,96 · CV / 0,05)²`, que com CV 0,5 dá **~385 por célula**. Arredondando, **500**.
- **Para a cauda.** Um quantil só é estimável com observações além dele. A regra prática de ao menos
  20 observações acima do quantil dá **n ≥ 400 para o p95** e **n ≥ 2000 para o p99**. Então: 500 por
  célula em toda a grade, e **2000** só nas células em que a cauda **é** a pergunta, que são as de E4
  (o alvo mais rápido) e a de E1(a) com E3 na horda (o uníssono, que é onde o pico mora).
- **O que não precisa de muitas batalhas.** A distribuição de N(T), o pico por Tick e a fração de
  Ticks vazios têm **uma observação por Tick**, não por batalha: uma célula de 500 batalhas de 45
  Ticks dá 22.500 observações. Essas métricas já estão saturadas bem antes de 500.

~~Total da grade base: 72 × 500 = **36.000 batalhas**~~, e pela §0.5 são **76 × 500 = 38.000**, mais o
reforço da cauda. Pela R2 §D1 isso seriam
segundos de máquina na bancada; o harness com mapa será mais caro (a R2 §D3 registra o custo de
`caminharHex` como **NÃO MEDIDO**), e mesmo dez vezes mais caro continua sendo minutos. **O
orçamento não é a máquina, é o que se consegue ler**: 144 células já são mais tabelas do que se lê
numa sentada, e é por isso que os eixos precisam ser poucos e seus.

**Qual eixo eu espero que domine**, para você conferir depois:

1. **E1 domina o pico** e quase não move o total. Previsão falsificável: no nível uníssono, a fração
   de Ticks-com-golpe que têm **dois ou mais** golpes deve ficar perto de 100%; no nível coprimo,
   perto de zero (uma ou duas colisões na batalha inteira). O total de paradas por batalha deve
   mudar pouco entre os quatro níveis, porque o número de golpes é o mesmo, só a distribuição deles
   muda.
2. **E2 domina o tempo morto e o Tick vazio**, e é o eixo que mais muda a experiência do jogador,
   não a do mestre.
3. **E3 domina o total** de paradas, quase linearmente no número de peças, e domina o pico junto com
   E1: horda uníssona é o pior caso de tudo.
4. **E4 é binário no resultado**: ou a batalha fecha, ou ela não fecha nunca. Espero pouca coisa no
   meio, e espero que a fração que não fecha seja alta o bastante para forçar a decisão de D4.
5. **E5**, se ligado, deve encurtar a batalha (a Margem é a maior das sete) e, por consequência,
   **abaixar** a carga total sem mexer na carga por Tick. Se o resultado contrariar isso, o motivo
   provável é o Bloqueio com escudo puxando na direção contrária.

---

## 4. O que este harness não mede

Seção obrigatória, e é a que decide o quanto o resto vale.

| O que | Entra? | O instrumento que mediria | Mais barato que o harness? |
|---|---|---|---|
| **Custo de gravação por Tick no Grid real** (Supabase, rede, repintura) | **fora** | a suíte que já existe. `test-grid-simultaneo.mjs` já dirige o Edge com o mock de Supabase, e a R1 §9.2 já cronometrou 650 a 750 ms por clique no ⏭. Basta acrescentar um `performance.mark` em volta de `avancarTickSimultaneo` e contar as chamadas de `update` por Tick, que hoje são uma por peça que anda mais uma do relógio | **muito**. É uma adição a um teste que já roda, e entrega o fator que converte Tick em segundo |
| **Tempo humano por gesto** | **fora**, e nenhum código o produz | ou medição de mesa real com cronômetro, ou o mais barato: um carimbo no `showModal` e outro na resposta, gravados no `LOG`. Hoje isso não existe porque `logar` só é chamado **depois** da resposta (R2 §G1) | **muito mais barato**, e é o número que falta para tudo: sem ele, "12 gestos do mestre" não vira "a cena travou" |
| **Tempo morto do jogador** | **parcial** | em Ticks, o harness mede (§2.6). Em segundos, não: um Tick não tem duração até os dois itens acima serem medidos. A composição é `segundos = Ticks × custo do ⏭ + paradas no caminho × tempo humano por gesto`, e o harness entrega só o primeiro fator de cada produto | o que falta é justamente o que os dois instrumentos acima dariam |
| **Abandono de caixa e correção manual** | **fora** | só existe em mesa real, e hoje **não é registrável nem lá**: nada é gravado quando alguém fecha uma caixa sem responder. Exige um contador no `close` sem resposta, por parada | **muito mais barato**, e é uma linha por caixa |
| **Se as regras são divertidas** | fora | nenhum instrumento deste projeto | não se aplica |
| **Se o mestre teria decidido melhor** | fora | nenhum. Toda métrica é condicional à política de D3, e trocar a política troca o número | não se aplica |
| **A carga das Artes** | fora, salvo Q10 | e mesmo com Q10 = sim, a resistência não existe como regra fechada (R2 §E): o harness mediria a carga de uma regra inventada | não se aplica |
| **As 461 Técnicas** | fora | não são declaráveis no Grid (R2 §I.7). Medir o repertório do jogador sem elas mede o repertório que existe, que é o de 6 opções | não se aplica |
| **A atenção do mestre** | fora | ler o tabuleiro, lembrar de quem está com qual condição, decidir se vale interromper: nada disso é gesto, e a R2 §C4 mostra que 5 condições de dano por rodada dependem só de ele lembrar | exigiria observação de mesa |
| **A carga do sistema P/G/R e do normal** | fora por decisão sua | a bancada já mede o P/G/R sem mapa | já existe |
| **O valor da informação de N7 para uma pessoa** | fora | teste de mesa. O harness só consegue a diferença entre uma política que lê e a mesma cega (eixo E9), e esse número mede a qualidade das minhas cinco regras de leitura, não o valor da informação para quem joga. Um humano vê o que nenhuma regra minha codifica: que o inimigo está juntando gente num canto, que o companheiro vai morrer | muito mais barato: uma sessão observada, contando quantas vezes um declarante tardio muda de escolha depois de ver |
| **A legibilidade do rastro de N8** | fora | nenhum instrumento de código: é desenho de tela, e o harness não tem tela | idem, a mesma sessão |
| **O tempo que a fila de declaração de N4 custa ao mestre** | fora | cronometrar a fase de declaração com a fila ordenada na tela e sem ela, e contar quantas vezes o mestre reordena à mão (§0.49) | idem, a mesma sessão |

---

## 5. O menor experimento que já vale

A resposta tem duas metades, e a segunda é a desagradável.

**O que já vale, e não precisa da extração da resolução: um simulador de fila, sem dano.**

Ele usa só o que a R2 §A3 provou puro (`combate-tempo.ts`) mais `hex.ts`, e reimplementa apenas o
corpo do avanço (o passo 2 e o 3 da §2.2, que são 60 linhas de `avancarTickSimultaneo`). As peças
declaram, andam, perseguem, os golpes vencem e são **contados**, e ninguém morre: a cena roda um
número fixo de Ticks. Sem dano, ele não precisa de D2 (não há regra de dano faltando para escolher),
não precisa da tabela de custo de tela, e não precisa de `folhaDaAcao`.

O que ele responde, de verdade:

- **a distribuição de N(T)**, o número de golpes que vencem no mesmo Tick, contra a forma fechada da
  R2 §H1. É o teste da previsão E1 da §3;
- **o pico por Tick** e quantas vezes ele acontece, que é o pior caso da R2 §H4 medido em vez de
  deduzido;
- **quanto a re-projeção empilha** entre peças e quanto ela desliza dentro de uma (R2 §H2), com o
  perseguidor que nunca alcança, que é o eixo E4 inteiro;
- **a fração de Ticks vazios**, o clique de ⏭ que não produz nada;
- **se as oito fontes de sincronia da R2 §H3 se somam ou se cancelam** numa cena de verdade.

O que ele **não** responde: qualquer coisa com "por batalha" no denominador. Sem morte não há
duração, e sem duração não há "paradas por batalha", nem carga do mestre por cena, nem comparação
entre perfis de regra.

**E a metade desagradável: para a métrica que você quer, não há nada menor.**

A carga do mestre por batalha depende de quantos golpes a batalha tem, que depende de quanto ela
dura, que depende do dano, que mora em `folhaDaAcao` misturado com o modal e com o Supabase. Não
existe atalho que responda "quanto o mestre trabalha numa cena" sem antes tirar a resolução de dentro
da tela. Qualquer coisa que eu construísse por fora seria uma segunda `lib-tempo.mjs`, e a §2.1 já
mostrou onde isso termina.

Há, porém, uma coisa **ainda menor** que qualquer das duas e que responde a uma pergunta sua sozinha:
instrumentar a suíte que já roda no Edge para contar as gravações por Tick e cronometrar o ⏭ (§4,
primeira linha). Isso não é harness nenhum, é instrumentação de um teste que já existe, e entrega o
fator que converte todo Tick simulado em segundo de mesa.
