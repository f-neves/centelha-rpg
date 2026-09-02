# Projeto do harness · o desenho, e o que falta decidir

Sobre o commit `df03b44`. Continua `00-diagnostico.md` e `01-diagnostico-carga.md`, citados aqui
como **R1** e **R2**. Nenhuma linha deste documento foi implementada.

Convenção da seção 1: **bloqueia o começo** = sem a resposta não dá para escrever a primeira linha
do harness. **Só o resultado** = dá para construir tudo e a resposta entra depois, como parâmetro
de execução.

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
| **N4** | em que ordem se declara no Tick | **Raciocínio + Prontidão crescente**, depois Raciocínio, Destreza, iniciativa rolada, sorteio (§0.46) |
| **N5** | as fases de um Tick | **declaração · início · resolução**, e a resolução na ordem inversa da declaração (§0.46) |
| **N6** | penalidade nascida no Tick T | **só vale em T+1**: a resolução lê o retrato de quando as declarações terminaram (§0.46) |
| **N7** | quem declara depois enxerga o que já foi declarado? | **enxerga, e é a vantagem de ter mais Raciocínio + Prontidão** (regra do Vampiro). O que ele vê já está definido na máscara da migração 27 (§0.47) |

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

**Q6 (cópia) contra D2 (a tela lendo a mesma chave): como as duas convivem.** Com cópia, as 7 regras
vivem no harness, e a tela só ganha cada uma quando ela for ligada em produção (Q16). Logo o
**teste-espelho só é válido com todas as bandeiras desligadas**, que é exatamente o perfil "motor
como está". A regra de convívio: o espelho roda sempre no perfil base; cada regra que a mesa ganhar
sai da lista de bandeiras e passa a ser comparada pelo espelho também. A janela de divergência entre
os dois motores é o conjunto de bandeiras ligadas no harness e ausentes na tela, e esse conjunto
**encolhe por desenho** à medida que Q16 avança, em vez de crescer como aconteceu com a
`lib-tempo.mjs`. (A lista de bandeiras cresceu de 7 para 9 na §0.4 P1, com `curaSemArea` e
`curaDivide`, que são o mesmo tipo de coisa: regra escrita que o motor não aplica.)

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

No Tick T, todo mundo que está livre declara. A ordem é:

| # | Critério | Sentido |
|---|---|---|
| 1 | **Raciocínio + Prontidão** | **crescente**: declara primeiro quem tem menos |
| 2 | Raciocínio | decrescente |
| 3 | Destreza | decrescente |
| 4 | a iniciativa rolada | decrescente |
| 5 | sorteio | |

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
| **3 · resolução** | as consequências devidas neste Tick acontecem, **na ordem inversa da declaração**: resolve primeiro quem tem mais Raciocínio + Prontidão |

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

**N7 não precisa de sistema de visibilidade novo.** Ele herda o que existe, e o que existe foi
desenhado para exatamente esta pergunta.

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

Note que **nenhuma dessas regras pode usar `alvo`**, porque a máscara o esconde. Elas usam só fase,
Tick do golpe e manobra, que é o que a régua entrega. Isso é bom para o desenho: as políticas ficam
honestas por construção, e a mesma política roda para o mestre e para o jogador sem precisar de duas
versões.

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
Proposta: o eixo E6 ganha um nível a mais, **"política cega"**, idêntica à Agressiva mas que não lê
declaração nenhuma, e a diferença entre ela e a Agressiva com leitura mede o preço de um ponto de
Raciocínio + Prontidão em vitórias e em Ticks.

### 0.5 A grade, refeita com as respostas

| Eixo | Níveis | Custa célula? |
|---|---|---|
| **E1 · diversidade de ciclos** | 4 (uníssono 6 · 5 e 6 · 6 e 7 · 4/5/6/7) | sim |
| **E2 · distância inicial** | 4 (encostado · ~3 Ticks · ~10 Ticks · muito longa) | sim |
| **E3 · tamanho da cena** | 3 (1v1 · 3×3 · 2×8) | sim |
| **E4 · assimetria de passo** | 2 | sim |
| **E5 · perfil de regras** | 2 (base · as 9 bandeiras ligadas: as 7 de D2 mais as 2 da Cura, §0.4 P1) | sim |
| **E6 · política** | 6 (agressivo · cauteloso · tocaiador · guarda-costas · conjurador · **cega**, §0.47) | sim |
| **E7 · obstáculo** | 2 (campo aberto · parede), §0.4 P2, e cai fora se P2 for recusada | sim |
| **E8 · atribuição de gesto** | 2 (mestre solo · um por PC) | **não**: é leitura do mesmo log |
| **D1 · perfil de automação** | 2 | **não**: é leitura do mesmo log |

Cruzar tudo dá **4×4×3×2×2×6×2 = 2.304 células**, e o problema não é tempo de máquina, é que
ninguém lê 1.920 tabelas. O orçamento que aperta continua sendo o mesmo da §3: o que se consegue
ler. Desenho proposto:

- **Núcleo cruzado: E1 × E2 × E3 = 48 células.** São os três que eu espero que interajam, e a
  previsão da §3 é sobre eles.
- **Um fator de cada vez em volta da célula-âncora**, para E4, E5, E6 e E7: `(2−1) + (2−1) + (6−1) +
  (2−1) = 8 células`. Mede o efeito principal de cada um sem cruzá-lo com o resto.
- **Cruzamentos deliberados**, porque OFAT é cego a interação e há quatro que eu espero de verdade:
  E1(uníssono) × E3(horda), E1(uníssono) × E4(assimétrico), E2(muito longa) × E4, E5 × E1(uníssono).
  **4 células.**
- Total: **60 células**. A 500 repetições, **30.000 batalhas**, mais o reforço de 2.000 nas células
  de cauda (as de E4 e a de uníssono com horda). A justificativa das 500 e das 2.000 é a da §3 e não
  muda.

---

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

#### Extraído de `grid.astro`

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

**Um caminho de código, não dois.** O módulo extraído é importado por `grid.astro`, que fica com
três responsabilidades e nenhuma conta: perguntar ao humano, desenhar, gravar. Toda a aritmética que
hoje mora entre as linhas 7432 e 7997 sai de lá.

Isso não é opinião de estilo, é a lição do que já aconteceu. `lib-tempo.mjs` é a cópia headless que
fizemos antes, e ela discorda da mesa em cinco pontos hoje: aplica a Margem que a mesa não aplica
(R2 §A1), classifica o Quase-Acerto pela classe de tempo enquanto a mesa classifica pelo dano médio
(§F#11), usa um limiar de raspão um ponto mais generoso (§F#12), embaralha a ordem de ação com
Fisher-Yates enquanto a mesa ordena por `ordemDaFila`, e não tem mapa nenhum (§D3). Nenhuma dessas
divergências apareceu como erro: as duas passam nos seus próprios testes. **Divergência entre dois
caminhos não é pega por teste, é pega por comparação**, e ninguém estava comparando.

Se a resposta a Q6 for "copiar", então a comparação tem de ser construída de propósito, e o
instrumento é a **cena espelho**: uma cena pequena e fixa roda nos dois lugares, headless e no Edge
dirigido (o `test-grid-simultaneo.mjs` já sabe dirigir a página e já dispõe do mock de Supabase), e
os dois logs são comparados campo a campo, evento a evento. Diferença em qualquer campo é falha de
build. Isso é caro de escrever e é o preço de ter dois caminhos; é exatamente o que não existe hoje
entre a bancada e a mesa.

### 2.2 O laço

Um Tick do harness, na ordem, com a diferença em relação a `avancarTickSimultaneo` (L4902-5016)
apontada em cada passo.

| # | Passo | Igual ao Grid? |
|---|---|---|
| 0 | **Guarda de golpe devido.** Se há golpe com Tick ≤ Tick corrente ainda não resolvido, o relógio não anda | **igual**: é o `if (instanteDeGolpe()) return` da L4903. No harness ela nunca dispara, porque o passo 5 sempre resolve; a guarda fica como asserção, e se disparar é defeito |
| 1 | **T ← T + 1** | igual (L4904-4906), sem a gravação de `tick_atual` |
| 2 | **Passo de todas as peças em trajeto**, na ordem de `filaDaCena`. Para cada uma: pula quem está no chão, pula quem não tem `mov.auto`, pula quem declarou neste mesmo Tick (`desde + 1 > T`), calcula `passos` pela escala, restringe o passo se está na fase de Golpe (`passoDoGolpe`), caminha com veto de ocupação, e repete com veto frouxo se não aproximou | **igual**, linha por linha (L4912-4966). É o passo que mais depende da extração fiel |
| 3 | **Encerrar trajeto ou re-projetar.** Quem chegou ao alcance, ou atravessou, perde o `mov`; quem não chegou passa por `reprojetarAgenda` com a viagem que sobrou medida no passo real | **igual** (L4984-5012) |
| 4 | **Fase 1, declaração**: todos os livres declaram, na ordem de **N4** (Raciocínio + Prontidão crescente). Criaturas pela `decisaoAutomatica`, PCs pela política de D3. Nenhuma consequência acontece aqui | **diferente**. Hoje só as criaturas decidem dentro do avanço (`decidirAutomaticas`, L5017) e os PCs decidem quando o humano clica, em qualquer momento e em qualquer ordem. Com N4 e N5 a ordem passa a ser regra |
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

**Ordem de iteração.** `ordemDaFila` (`combate-tempo.ts:399-404`) desempata em cinco níveis: Tick,
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
dados_hash        sha1 do conteúdo de src/data/*.json, para saber se a régua mudou
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

Com E1×E2×E3×E4 são **72 células**; com E5 em dois níveis, 144.

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

Total da grade base: 72 × 500 = **36.000 batalhas**, mais o reforço da cauda. Pela R2 §D1 isso seriam
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
