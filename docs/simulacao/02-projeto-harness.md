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

**Sem teto de Ticks, o fim depende da fuga alcançar a borda**, e num mapa de 48×48 isso é longe de
propósito: é a cauda que você quer ver. Mas um laço sem saída trava o processo, então fica um **teto
de segurança de execução**, que não é regra de jogo: a batalha que passar de 2.000 Ticks é abortada e
marcada `estourou`, entra num balde próprio e não é contada em nenhuma média. É diferente da opção
4c que você recusou, porque 4c classificaria a batalha como "indecisa", que é um resultado de jogo;
`estourou` é o registro de que o harness desistiu.

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
| **P2** | Parede não existe no Grid | proposta na §0.4, e a decisão é sua |
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
- O resultado do eixo E7 é **um achado sobre a regra, não sobre o produto**: ele responde "quanto
  custaria um obstáculo", e só vira achado sobre o Grid se a parede for depois construída lá.

Se você preferir, a alternativa é tirar E7 e cair para 52 células. ⚑ Marcado como invenção do
harness enquanto o Grid não tiver parede.

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
obrigatoriamente carrega um arremessador, o que mistura o eixo de ciclo com o de alcance. As saídas
são aceitar isso e declarar, ou fazer o nível (d) com 5/6/7 só. Fica anotado como escolha sua.

**E4 · assimetria de passo.** O passo sai de `deslocamento()`, com a fração da raça e a meia
penalidade da armadura. O par é escolhido calculando `deslocamento()` para os candidatos e tomando o
primeiro com razão ≥ 2, e os candidatos naturais são o Montanteiro orc de placa completa (pen 3) de
um lado e o Duelista elfo de couro (pen 1) do outro. O nível "simétrico" usa dois Escudeiros.

### 0.5 A grade, refeita com as respostas

| Eixo | Níveis | Custa célula? |
|---|---|---|
| **E1 · diversidade de ciclos** | 4 (uníssono 6 · 5 e 6 · 6 e 7 · 4/5/6/7) | sim |
| **E2 · distância inicial** | 4 (encostado · ~3 Ticks · ~10 Ticks · muito longa) | sim |
| **E3 · tamanho da cena** | 3 (1v1 · 3×3 · 2×8) | sim |
| **E4 · assimetria de passo** | 2 | sim |
| **E5 · perfil de regras** | 2 (base · as 9 bandeiras ligadas: as 7 de D2 mais as 2 da Cura, §0.4 P1) | sim |
| **E6 · política** | 5 (agressivo · cauteloso · tocaiador · guarda-costas · conjurador), §0.4 P4 | sim |
| **E7 · obstáculo** | 2 (campo aberto · parede), §0.4 P2, e cai fora se P2 for recusada | sim |
| **E8 · atribuição de gesto** | 2 (mestre solo · um por PC) | **não**: é leitura do mesmo log |
| **D1 · perfil de automação** | 2 | **não**: é leitura do mesmo log |

Cruzar tudo dá **4×4×3×2×2×5×2 = 1.920 células**, e o problema não é tempo de máquina, é que
ninguém lê 1.920 tabelas. O orçamento que aperta continua sendo o mesmo da §3: o que se consegue
ler. Desenho proposto:

- **Núcleo cruzado: E1 × E2 × E3 = 48 células.** São os três que eu espero que interajam, e a
  previsão da §3 é sobre eles.
- **Um fator de cada vez em volta da célula-âncora**, para E4, E5, E6 e E7: `(2−1) + (2−1) + (5−1) +
  (2−1) = 7 células`. Mede o efeito principal de cada um sem cruzá-lo com o resto.
- **Cruzamentos deliberados**, porque OFAT é cego a interação e há quatro que eu espero de verdade:
  E1(uníssono) × E3(horda), E1(uníssono) × E4(assimétrico), E2(muito longa) × E4, E5 × E1(uníssono).
  **4 células.**
- Total: **59 células**. A 500 repetições, **29.500 batalhas**, mais o reforço de 2.000 nas células
  de cauda (as de E4 e a de uníssono com horda). Sem E7, se P2 for recusada, são **52 células**. A
  justificativa das 500 e das 2.000 é a da §3 e não muda.

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
| 4 | **Decisão de quem está livre**: as criaturas em automático por `decisaoAutomatica`, os PCs pela política de D3 | **diferente**. Hoje só as criaturas decidem dentro do avanço (`decidirAutomaticas`, L5017); os PCs decidem quando o humano clica, em qualquer momento. Como `agendaSimultanea` faz toda decisão valer a partir de `T+1` (`combate-tempo.ts:797`), decidir aqui é equivalente a um humano declarando durante o Tick T |
| 5 | **Vencimento e resolução dos golpes com Tick ≤ T**, em ordem de `filaDaCena` | **diferente na forma, igual na posição**. No Grid isto não é parte do avanço: é o cartão da faixa, clicado depois. Mas o ⏭ fica desligado enquanto houver golpe devido (L4324-4326), então a sequência real é: relógio anda, peças andam, criaturas decidem, e **só então** os golpes daquele Tick são resolvidos, antes do próximo ⏭. O harness resolve no mesmo ponto |
| 6 | **Efeitos de Arte** (mordidas, saídas, vencimentos), se Q10 disser que Artes entram | **igual à posição** (L5021), com a diferença de que a caixa de efeito e a de saída viram política |
| 7 | **Chão e mortes.** Vida a zero sai da fila; quem levantou paga os 5 Ticks de `DELAY_AO_LEVANTAR` | **diferente na hora**: hoje `conferirChao` roda a cada repintura (L4207), o que é "quando a tela desenhar". No harness roda uma vez por Tick, no fim |
| 8 | **Expiração de condições** (o `ate`), conforme Q7 | **diferente**: no Grid isto não acontece, o campo `ate` é escrito e nunca lido |
| 9 | **Fim de batalha** (D4) | **diferente**: no Grid não existe |

Três diferenças merecem ser ditas com a consequência, porque mudam número e não só ordem:

- **O passo 4 antes do passo 5 abaixa a Defesa de quem acabou de declarar.** Uma ação declarada no
  Tick T tem `inicio = T + 1` e todos os golpes em `T+1` ou depois; `faseEm(acao, T)` cai no ramo
  `tick < Math.max(...golpes)` e devolve **`preparo`** (`combate-tempo.ts:595-606`), que a escada
  cobra em −2 (`defesaPerdida`, L620). Ou seja: a criatura que decide no Tick T recebe o golpe que
  vence no mesmo Tick T já com a guarda baixa. Isso é o comportamento do Grid hoje, não uma invenção
  do harness, e é um dos lugares onde o harness vai medir uma consequência que a mesa nunca notou.
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
