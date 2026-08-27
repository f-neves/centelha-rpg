# Grid · caderno de melhorias

> Aberto em **2026-08-12**, a partir de uma pesquisa do que as mesas virtuais têm, do que os
> usuários reclamam que falta nelas, e do que os jogos de combate por turno resolveram há vinte
> anos. Este arquivo é a lista de ideias da frente do tabuleiro: o que está **em obra**, o que está
> **na fila** e o que **precisa da sua palavra** antes de virar código.
>
> O índice geral do que está aberto continua sendo o `Pendencias.md`; aqui é onde o detalhe mora.
> Quando um item sai daqui para o site, ele ganha a marca ✅ e a data.

## De onde saíram as ideias

**Mesas virtuais** · Roll20, Foundry VTT, Owlbear Rodeo, TaleSpire, Alchemy, Tabletop Simulator e
Tabletopia. O que os usuários mais pedem, em ordem de insistência:

- Anotar no mapa (o "Map Pins" foi o pedido mais votado da história do Roll20, e só saiu em 2025).
- Medir enquanto arrasta a peça, e ver quanto do deslocamento já foi gasto.
- Não travar. Roll20 engasga em cena grande com iluminação; Foundry é potente e vira administração
  de sistema. Ser leve é vantagem nossa, e é para defender.
- Não deixar o jogador virar plateia. É a queixa que mais aparece nos fóruns de mesa lenta, e o
  conselho unânime é o mesmo: dizer de quem é a vez **e quem é o próximo**, e dar o que fazer a
  quem espera.
- Acessibilidade: daltônico não distingue token por cor (o pedido concreto é mostrar o **nome** da
  cor), e leitor de tela não alcança o tabuleiro, só o texto.

As extensões que as mesas do Owlbear realmente instalam dizem o resto: iniciativa com retrato,
barra de status no token, **rastreador de movimento gasto**, rotulador de condições, formas de área,
cronômetro sincronizado, névoa por jogador e um botão de deitar a peça caída.

**Jogos de combate por turno** · o que cada um resolveu:

| Jogo | A lição |
| --- | --- |
| Fire Emblem | **Zona de perigo**: pintar tudo o que o inimigo alcança. Serve para posicionar e, principalmente, para iscar. |
| Into the Breach | **Informação perfeita**: o ataque inimigo é telegrafado antes. O objetivo declarado é "que toda morte pareça culpa sua". |
| Final Fantasy Tactics | **Previsão do golpe** antes de confirmar; **altura** mudando linha de visão e acerto; **face** habilitando o golpe pelas costas. |
| Grandia · Trails | **Barra de tempo**: os ícones andando até o ponto de ação, mostrando a ordem futura dos dois lados. É o nosso relógio de Ticks, desenhado. |
| Valkyria Chronicles | **Fogo de interceptação**: atravessar o campo de visão de quem está de guarda custa caro. |
| XCOM | A comunidade escreveu mods só para **ver a chance do inimigo contra você**. Informação escondida vira frustração. |
| Divinity 2 | **Superfícies**: o chão participa. Óleo pega fogo, água conduz raio, vapor cega. |
| Baldur's Gate 3 | Segurar uma tecla **realça tudo o que é interativo**; a reação **pergunta** antes de gastar. |

---

## Feito em 2026-08-27 · as cinco faixas, e quem come a altura

Uma bancada mediu as cinco faixas do Grid (barra da mesa, barra da arena, iniciativa, tabuleiro,
coluna lateral) e achou o gargalo: **num mapa quase quadrado, quem aperta é sempre a altura**. Em
1440×900 o tabuleiro era 1200×616, e **49% da largura dele era faixa preta** que o mapa não tinha
como usar. Daí as duas mudanças abaixo, que compram altura pagando com largura.

- ✅ **As duas barras de cima viraram uma.** No notebook a barra da arena **muda de casa** e entra
      na barra da mesa, ao lado das abas (`mudarDeCasa`, o mesmo mecanismo que o telefone já usava).
      Três fileiras antes do tabuleiro viram duas: o topo do palco sobe de **249px para 204** em
      1920 e de **276 para 204** em 1440, onde a barra da arena ainda quebrava em duas linhas.
      O mapa cresce **+5,5% em 1920, +11,5% em 1440 e +14,6% em 1366** · o ganho é maior justamente
      na tela mais apertada. No telefone ela **volta para a grade**: lá ela é folha de baixo e a
      barra da mesa é a folha vizinha, e fundidas uma gaveta abriria dentro da outra.
- ✅ **E a fileira perde palavras antes de perder botões.** Medido em 1920: as dez abas pedem
      **937px** com o nome e **467px** só com o ícone; os onze comandos da arena pedem **1399px** e
      **939px**. Tudo por extenso precisaria de uma janela de **2376px**, que não existe · então
      há sempre um degrau ligado. Cabe uma das duas por extenso até ~1900px, e nenhuma abaixo.
      Quem cede primeiro é a **aba**: ela já tinha modo só-ícone no telefone, a aba aberta continua
      escrita (nunca se perde o "onde estou"), e "❦" para Compêndio não se adivinha, enquanto o
      ícone da arena está a um palmo do que ele controla. Os rótulos saem da **vista** e não da
      árvore de acessibilidade, e todo botão da arena ganhou `title`.
- ✅ **Em tela cheia (⛶), a ordem de combate fica de pé.** Deitada no topo ela cobrava uma faixa da
      altura; de pé, à esquerda, cobra **7vw** de uma largura que já sobrava. O tabuleiro vai de
      1651×868 para **1803×1067**, e o mapa cresce **+22,9%**. `7vw` e não pixels de propósito: este
      é o modo de projetar, e 7% tem o mesmo tamanho aparente no notebook e na TV de 55" · pela
      mesma razão o corpo do texto e o retrato dentro da coluna seguem a largura da janela.
- ✅ **E a coluna lateral recolhe para a direita.** A **terceira** dobra do painel, e a única que
      mexe na largura: as duas de dentro ("Em campo" e "Registro") trocam altura entre si e a coluna
      continua do mesmo tamanho. Recolhida, ela vira um trilho de **28px** com o nome de pé, e o
      tabuleiro vai de **1176 para 1364px** em 1440. Recolher não é fechar: o trilho continua sendo
      alvo de arrasto (soltar uma peça nele tira do mapa) e continua dizendo o que guarda, e o botão
      de voltar é o único que não some junto · uma coluna que sumisse por inteiro não teria porta de
      volta. Fica guardado no aparelho, como as outras dobras.

Vinte e cinco asserções novas no `npm run smoke` (`cenaFusao`), com o A/B feito na própria página:
desfazer a fusão em tempo de execução devolve o layout antigo inteiro, e a diferença é o teste.

### Pontas soltas destas três

- [ ] **A fila continua deitada fora da tela cheia** · **G** · é o ganho grande que sobrou. A mesma
      bancada mediu: com a fila em pé no dia a dia, o mapa cresce **+35% em 1440** e **+45% em 1366**,
      contra os +11,5% e +14,6% da fusão sozinha. E o desperdício de largura cai de 49% para 18%.
- [ ] **Recolher a coluna dá largura, e largura ainda não vira mapa** · **P** · o trilho devolve
      188px ao tabuleiro, mas num mapa quadrado quem aperta é a altura, e o mapa não cresce um
      pixel com isso. Ele serve para ver mais mapa de lado (cena larga, perseguição) e para tirar
      a lista da frente. **Vira ganho de verdade no dia em que a fila ficar de pé**: aí a altura
      deixa de ser o gargalo e cada pixel de largura passa a contar.
- [ ] **A escada só existe na tela do Grid** · **P** · a barra da mesa é a mesma nas dez abas, mas
      só o Grid tem barra da arena para fundir. Se outra tela ganhar uma, a `.mb-baixo` já a recebe.

---

## Feito em 2026-08-26 · a moldura, e não o tabuleiro

Quatro consertos na **casca** do Grid: a tira, os alvos de tela cheia e as caixas de diálogo.
Nenhum deles muda uma regra; todos mudam quanto do tabuleiro sobra para a mesa olhar. Cada número
aqui foi medido na bancada, antes e depois.

- ✅ **A tira da iniciativa deitou de verdade.** Ela saía em **duas fileiras** no notebook, com o
      relógio em cima e a fila embaixo. A causa não era o `flex-wrap`, que existe de propósito para
      a faixa dos golpes no ar cair numa linha só dela: era a **base** da fila. Quem decide o que
      cabe na primeira linha é o `flex-basis` de cada item, ANTES de qualquer encolhimento, e com
      `auto` a base da fila era a soma dos cartões (doze de 11,5rem passam de 2000px). O navegador
      via que ela e o relógio não cabiam juntos e mandava a fila para baixo; o `min-width: 0` até
      encolhia depois, mas já na segunda fileira. Com `flex: 1 1 0` a base é zero e ela cabe em
      qualquer sobra. Grid a 1440px: **1176×204 → 1176×118**. No rastreador de Combate estava pior,
      porque quebrava em toda largura: **1400×157 → 1400×92**, e **368×164 → 368×97** no telefone.
      Mora no `MesaCab.astro`, então vale para as duas telas. `5c81368`.
- ✅ **Um terceiro alvo de tela cheia: só o mapa.** Os dois botões que já existiam fazem coisas
      diferentes, e vale escrever qual é qual: o **▭ (`gr-tv`)** é o modo TV, que não é tela cheia
      nenhuma · é uma classe no corpo que esconde a barra da mesa, a da arena e a coluna lateral
      (tabuleiro de 1176×616 para 1400×784). O **⛶ (`gr-cheia`)** é a tela cheia de verdade, a do
      YouTube: Fullscreen API na `.gr-grade`, que leva a ordem de combate junto, e liga o modo TV
      enquanto dura. O novo é o **▣ (`gr-cheia-mapa`)**, que projeta só o `#gr-palco`: o tabuleiro
      fica com a altura que a tira ocupava (**880 → 1000px**). Atalho **Shift+F**, e estando num
      deles o outro **troca de alvo** em vez de sair e entrar · o que importa porque em tela cheia a
      barra da arena está escondida e o botão não está lá para ser clicado. O ✕ do canto sai, nunca
      troca. Foi junto no `aa81585`, que era um commit da outra frente.
- ✅ **Toda caixa nasce no centro da janela.** Medidas as onze caixas do Grid em 1440×900: dez
      caíam com desvio `0,0` do centro e a de conjurar com `372,0`, encostada na direita. Aquilo era
      de propósito (ela desenha a prévia da Arte no mapa, e centrada tapava o que manda olhar), mas
      o preço era ela ser a única do sistema que não nascia onde o olho a procura. Agora são onze.
      Quem precisar ver o que está debaixo arrasta pela cabeça, que sempre foi alça. `c77127a`.
- ✅ **E a caixa se estica pelo canto, como uma janela.** O par da cabeça: uma diz ONDE ela fica, a
      outra diz DE QUE TAMANHO ela é. Alça de 18×18 no canto de baixo à direita. Abre em 672×644,
      vai a **1132×822** (o teto é a borda da janela, para a alça nunca sair da tela) e desce até
      **512×276**. Fechar devolve o tamanho de fábrica. `de1ed86`.

### Três decisões que o código carrega, no canto e no centro

- **O tamanho vai por `--dlg-w`/`--dlg-h`**, e não por `style.width`. O CSS só lê as duas acima do
  corte do telefone: lá a caixa é folha de baixo, do tamanho do aparelho, e uma largura em pixels
  escolhida num monitor venceria a folha.
- **A posição congela junto com o primeiro puxão.** Um `<dialog>` modal com margem automática é
  recentrado pelo navegador a cada mudança de tamanho: puxar para a direita empurraria a caixa para
  a esquerda na mesma medida, e a borda fugiria do dedo com o dobro da velocidade. É a mesma classe
  `arrastado` do arrasto pela cabeça, então as duas alças convivem.
- **O piso é do CSS, e não do arrasto.** `esticarPeloCanto` lê o `min-width`/`min-height` computado
  e cada caixa declara o seu. O da caixa de conjurar é medido, não escolhido: abaixo de 32rem de
  largura o pé quebra numa linha a mais e empurra o "Conjurar" 15px para fora da borda de baixo, e a
  caixa vira um formulário sem como enviar. Ler do CSS em vez de travar no JS é o que evita o
  arrasto emperrado: se o `min-height` segurasse a caixa enquanto o ponteiro continuasse descendo, o
  caminho de volta começaria com uma faixa morta do tamanho do exagero.

O esticar é **opção** (`redimensionavel`, em `ui-dialog.ts`), ligada por padrão em quem já é
arrastável · hoje só a de conjurar. Qualquer outro `uiPainel` ganha o mesmo com uma linha no
chamador. As caixas de confirmação ficaram de fora de propósito: esticar um "Excluir a arena?" de
480×199 não serve para nada.

Dezesseis asserções novas no `npm run smoke` cobrem os quatro, com arrasto de mouse e tela cheia
de verdade (o headless aceita a Fullscreen API quando o clique vem do Puppeteer).

### Pontas soltas destes quatro

- [ ] **Em tela cheia, só o teclado troca de alvo** · **P** · a troca ⛶ ↔ ▣ funciona, mas o botão
      do outro alvo está escondido junto com a barra da arena (o modo TV entra com a tela cheia).
      Quem não souber do F e do Shift+F precisa sair e entrar. Um par de botões flutuantes ao lado
      do ✕ resolveria, e é o mesmo canto onde a saída já mora.
- [ ] **O esticar só existe na caixa de conjurar** · **P** · é uma linha por chamador
      (`redimensionavel: true`). As que mais pedem são as que carregam lista longa: "Como o tempo
      passa", os Efeitos elementais e o + NPC. As de confirmação não entram.
- [ ] **O tamanho não sobrevive ao fechar** · **P** · reabrir devolve o de fábrica, que é o certo
      para a primeira vez e chato para quem sempre estica. Guardar no aparelho (como o modo TV já
      faz) é o mesmo gesto de sempre; falta decidir se é por caixa ou uma medida só.

---

## Feito em 2026-08-12

- ✅ **O jogador age sozinho.** Move a própria peça, mira o ataque, conjura e lança o dano. Proezas
      entram depois, pelo mesmo caminho (o menu da peça e as funções do banco já estão de pé).
      Migração 22, e o porquê de ser por função e não por RLS está no cabeçalho dela.
- ✅ **O mestre desfaz.** Toda ação entra no registro com o inverso, e o desfazer alcança as ações
      dos jogadores como já alcançava as dele. Dano e cura também passaram a ser desfeitos.
- ✅ **Névoa de guerra**, com interruptor, em três estados, com visão em volta das peças do grupo e
      luz de fogo abrindo o mapa. Migrações 23 e 25. O quadro completo está logo abaixo.
- ✅ **Número de dano subindo da peça.** Sai da diferença de Vida ou de Mana, então vale para todo
      caminho: golpe, Arte, queda, e o que chega de outra tela.
- ✅ **Trilha de fundo por arena.** Migração 24.

### A névoa, como ficou (migrações 23 e 25)

Três estados por casa, e dois deles o tabuleiro calcula sozinho:

| Estado | O que se vê | De onde vem |
| --- | --- | --- |
| **Claro** | o chão e quem está nele | alguém do grupo enxergando dali, fogo ou luz acesos, ou o pincel do mestre |
| **Névoa leve** | só o chão | já esteve claro alguma vez (`explorado`), e agora não há ninguém por perto |
| **Névoa pesada** | nada | nunca esteve claro |

- **Enxerga** quem é `pc` ou do grupo `aliado`, num raio em hexágonos que é da CENA (`nevoa.visao`,
  padrão 6): a cripta escura e o campo aberto ao meio-dia não têm o mesmo alcance.
- **Fogo e luz** de qualquer Arte clareiam as casas do efeito mais um halo (`nevoa.luz`, padrão 2).
- **A memória** (`nevoa.explorado`) é do grupo e só cresce; o botão "Esquecer" zera.

### O que a névoa ainda não faz

- **Não é por jogador.** É do grupo: o que um viu, todos sabem. Cabe na mesma coluna trocando os
  conjuntos por um objeto por pessoa, mas isso é decisão de mesa antes de ser código.
- **Não conhece parede.** O alcance é um círculo de hexágonos, e não linha de visão: a névoa não
  sabe que a esquina esconde o corredor. Linha de visão de verdade depende de existirem paredes no
  mapa, que hoje não existem.
- **Não distingue quem enxerga melhor.** O raio é um só para todo o grupo; o anão que enxerga no
  escuro e o mago cego usam o mesmo. Um campo por peça resolve, e cabe em `combatentes.dados`.
- **A luz de um efeito vencido continua acesa** até ele sair do tabuleiro: o banco não conhece o
  relógio de Ticks, e a conta da névoa mora nele.
- **Não esconde efeito de Arte nem marca de golpe.** `efeito_visao` ainda não filtra por casa
  coberta: uma aura de fogo acesa no escuro aparece para o jogador. As peças, essas, não chegam.
- **Não esconde o nome na lista.** "Em campo" continua listando todo mundo do encontro, coberto ou
  não. Quem está na névoa some do tabuleiro e da fila de iniciativa, mas o nome continua na coluna.

### Pontas soltas do que foi feito

Coisas que ficaram sabidamente pela metade em 2026-08-12, e que não estão em nenhum outro lugar.
Nenhuma delas impede jogar; todas são de uma tarde.

- [ ] **Proezas na mão do jogador** · **P** · o pedido original dizia "e futuramente proezas". O
      caminho já está aberto: é mais um item no menu da peça, e as funções `jogador_*` da migração
      22 já cobrem a escrita (Vida, Mana, condições). Falta a Proeza existir como ação de tabuleiro.
- [ ] **A invocação do jogador não sobrevive ao F5** · **P** · o banco sabe quem invocou
      (`combatentes.criado_por`), mas a tela do jogador não: ela guarda os ids da sessão. Depois de
      recarregar, ele deixa de conseguir arrastar a própria invocação (o mestre continua movendo). O
      conserto é devolver `criado_por` na `combate_visao`.
- [ ] **A Absorção não entra no dano do jogador** · **P** · ela sai do bloco do bestiário, que é
      informação do mestre, então o dano dele vai inteiro e a caixa avisa isso. O conserto honesto é
      o servidor descontar: uma função que leia a Absorção do alvo e aplique, sem devolver o número
      a quem bateu.
- [ ] **A caixa de acerto do jogador vem vazia** · **P** · ela compara as três Defesas, e o jogador
      não lê o `RESUMO` de ninguém. Ou some com a tabela do lado dele, ou mostra o que a mesa
      liberou (`revelar.statsInimigo` já existe).
- [ ] **Número de dano só aparece para quem enxerga o número** · **P** · o número sobe da diferença
      de Vida, e a Vida do inimigo chega nula ao jogador. Quando é ele que bate, o número aparece
      (ele digitou); quando outro bate, não. Dava para usar o `pv_pct`, que ele recebe.
- [ ] **O adaptador das Artes conhece cinco formas** · nota de manutenção · quando quem conjura é o
      jogador, a aba entrega ao módulo das Artes um Supabase de mentira que desvia as escritas para
      as funções do banco (`sbDoJogador`, em `grid.astro`). Ele cobre `select`, `insert`, `upsert`,
      `update .eq` e `delete .eq`, que é o que aquele módulo usa hoje. Uma forma nova falha alto, com
      função inexistente; não grava errado calado. Se `artes-grid-mesa.ts` ganhar outro tipo de
      escrita, é aqui que se acrescenta.

---

## Na fila

Ordenado pelo que eu faria primeiro. **P** = uma tarde · **M** = médio · **G** = grande.

> Esta lista é de **funcionalidades**. A lista de **atritos** (quantos toques uma ação custa e
> quantos deles são datilografia) está no `Grid_Automacao.md`, aberto em 21/08, e ela reordena
> vários itens daqui: a prévia do golpe, o alcance da arma equipada, o rolador no tabuleiro e os
> atalhos de teclado deixam de ser conforto e viram peças da mesma emenda.

### O relógio de Ticks (é o que temos de mais nosso)

- [x] **Linha do tempo de Ticks** · FEITA em 2026-08-21, e **desligada por padrão**. A régua está
      lá (Ticks em colunas, pessoas em linhas, a coluna do agora atravessando todas), liga no ▤ da
      barra e some inteira quando se desliga. O veredito da mesa foi que ela **não ajudava**: a tira
      da ordem, que subiu para cima do tabuleiro no mesmo dia, já responde o que se precisa saber, e
      a régua cobrava 224px de mapa para responder de novo. Fica para quem precisar comparar dois
      gestos no ar. Falta nela: **os efeitos vencendo**, que era metade da ideia original.
- [ ] **Prévia do custo** · **P** · mexer no campo "a ação custa" mostra na hora **onde a peça vai
      cair** na fila. Decidir entre um golpe de 3 e um de 7 vira leitura, e não conta de cabeça.
- [ ] **Aviso da vez para quem está longe da tela** · **P** · título da aba piscando, um bipe curto
      e, se autorizado, notificação do navegador.
- [ ] **Cronômetro de turno** · **P** · opcional, do mestre, sincronizado. Sem punição, só visível.

### Informação antes da ação

- [ ] **Zona de ameaça** · **M** · acender, em vermelho translúcido, tudo que os inimigos alcançam
      (deslocamento + alcance da arma). `pintarAlcance` já faz isso para uma peça; falta a união e o
      interruptor.
- [ ] **Prévia do golpe** · **P** · a caixa de acerto já compara as Defesas; falta a margem
      esperada, o dano médio depois da Absorção e o estado em que o alvo ficaria.
- [ ] **Alcance da arma equipada** · **P** · ao mirar, acender o alcance real da arma de quem
      ataca. `equip.ts` já sabe.
- [ ] **Régua de deslocamento por faixa** · **M** · colorir o caminho pelas bandas da ficha (Livre /
      Arranque / Corrida) e dizer quanto sobrou.
- [ ] **Linha de visão e cobertura** · **G** · depende de existirem paredes no mapa, que hoje não
      existem.

### O chão e as peças

- [ ] **Anotações fincadas no mapa** · **M** · alfinete numa casa com texto, secreto ou revelado.
      Armadilha, pista, "aqui tem cheiro de enxofre".
- [ ] **Desenho livre** · **M** · rabiscar sobre o mapa (seta, círculo, X) e limpar. Toda mesa
      virtual tem.
- [ ] **Peça caída deitada** · **P** · hoje o caído fica opaco e riscado na lista; deitar a peça no
      chão lê melhor de longe.
- [ ] **Terreno por hexágono** · **G** · [DECIDIR] difícil (custa dobro), água, fogo, escombro,
      precipício. Casa com as superfícies do Divinity e com as Artes que já marcam o chão: a poça de
      óleo pega fogo. Precisa de decisão de regra antes.
- [ ] **Altura** · **G** · [DECIDIR] número por hexágono, bônus de acerto e alcance de cima para
      baixo. A mudança mais cara e a que mais muda o jogo.
- [ ] **Face da peça** · **M** · [DECIDIR] uma seta na borda do token, bônus de flanco e de costas.

### O jogador

- [ ] **Reação com pergunta** · **M** · "Fulano vai passar do seu lado, quer usar guarda?", com
      botão. Casa com o fogo de interceptação do Valkyria e com a nossa regra de guarda.
- [ ] **Mão levantada** · **P** · um botão que acende o retrato do jogador na coluna do mestre, para
      pedir a vez sem falar por cima.

### Espetáculo

- [ ] **Câmera acompanhando a vez** · **P** · centralizar suavemente em quem age, com botão para
      desligar (enjoa).
- [ ] **Retrato grande na vez** · **P** · um cartão discreto de quem age, como o FFT faz.
- [ ] **Clima e hora na arena** · **M** · chuva, neve, névoa fina, tom de noite. Uma camada por
      cima, no mesmo motor dos efeitos elementais.

### Mestre

- [ ] **Salvar a arena montada** · **M** · guardar posições como "encontro pronto" e recarregar.
- [ ] **Selecionar vários e mover junto** · **M** · os doze goblins andam em bando.
- [ ] **Rolador no tabuleiro** · **P** · já existe rolador no site; falta no Grid, com o resultado
      indo para o registro.
- [ ] **Atalhos de teclado** · **P** · hoje só Espaço e Esc. Faltam setas, número para selecionar e
      uma tecla que realce tudo (o Alt do BG3).

### Acessibilidade

- [ ] **Grupo por forma, e não só por cor** · **P** · aliado, inimigo e neutro se distinguem por
      cor; um daltônico vê três cinzas. Borda sólida, tracejada e pontilhada resolvem.
- [ ] **Legenda das condições** · **P** · os ícones colados na peça não dizem o nome sem o mouse em
      cima, e no celular não há mouse.
- [x] **Toque e celular** · **FEITO em 2026-08-21** · pinça para zoom, alvos maiores, coluna
      virando gaveta: os três saíram na passada do telefone, e o registro dela (com as medidas e o
      que ficou de fora) está no `Grid_Mobile.md`.

---

## Fontes

Mesas virtuais: [Roll20 · Map Pins e novo motor](https://pages.roll20.net/redesign) ·
[Roll20 vs Foundry, queixas](https://myvtt.games/blog/foundry-vtt-vs-roll20-2025-which-vtt-is-better) ·
[Roll20 · medir arrastando](https://app.roll20.net/forum/post/3115066/token-movement-measuring) ·
[Roll20 · modo daltônico](https://app.roll20.net/forum/post/7472601/colorblind-mode) ·
[Roll20 · leitor de tela](https://app.roll20.net/forum/post/3870040/the-app-is-not-accessible-to-screen-reader-users) ·
[Owlbear Rodeo · extensões](https://extensions.owlbear.rodeo/) ·
[Foundry · módulos de combate](https://thedmlair.com/blogs/news/6-must-have-foundry-vtt-modules) ·
[TaleSpire e Alchemy · imersão](https://gmcrafttavern.com/beyond-roll20-talespire-alchemy-vtts/) ·
[Tabletopia vs TTS](https://www.meeplemountain.com/articles/versus-tabletop-simulator-vs-tabletopia/)

Jogos: [Fire Emblem · zona de perigo](https://www.supercheats.com/fire-emblem-three-houses/walkthrough/danger-radius) ·
[Fire Emblem Engage · dano previsto](https://www.escapistmagazine.com/how-to-display-enemys-incoming-damage-in-fire-emblem-engage/) ·
[FFT · altura e face](https://gamefaqs.gamespot.com/ps/197339-final-fantasy-tactics/faqs/3876) ·
[FFT remake · análise da interface](https://www.ramblingaboutgames.com/blog/fft-remake-ui) ·
[Into the Breach · informação perfeita](https://www.gamedeveloper.com/game-platforms/road-to-the-igf-subset-games-i-into-the-breach-i-) ·
[Grandia · barra IP](https://grandia.fandom.com/wiki/IP_bar) ·
[Trails · barra AT](https://www.nisamerica.com//tocs3/system/) ·
[Valkyria · interceptação](https://valkyria.fandom.com/wiki/Interception_fire) ·
[XCOM 2 · mods de chance de acerto](https://www.nexusmods.com/xcom2/mods/212) ·
[Divinity 2 · superfícies](https://www.techradar.com/gaming/pc-gaming/im-playing-divinity-original-sin-ii-at-last-i-cant-get-enough-of-its-terrain-based-tactical-battles) ·
[BG3 · realce e reações](https://eip.gg/bg3/guides/tips-tricks/) ·
[Combate lento · a vez e o próximo](https://www.roleplayingtips.com/rptn/top-10-reasons-why-your-combats-are-slow-part-2/)
