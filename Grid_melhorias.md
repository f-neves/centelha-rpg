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
- **Não guarda memória do que foi visto.** O revelado fica revelado até o mestre cobrir de novo; não
  existe "eu me lembro deste corredor, mas não sei o que tem nele agora".

---

## Na fila

Ordenado pelo que eu faria primeiro. **P** = uma tarde · **M** = médio · **G** = grande.

### O relógio de Ticks (é o que temos de mais nosso)

- [ ] **Linha do tempo de Ticks** · **M** · uma régua sob o tabuleiro com os próximos ~20 ticks e os
      retratos onde cada um vai agir, **inclusive os efeitos vencendo**. Nenhuma mesa virtual tem
      isso, porque quase nenhum sistema de mesa é por ticks. Grandia, Trails e FFT provam que
      funciona.
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
- [ ] **Toque e celular** · **M** · pinça para zoom, alvos maiores, coluna virando gaveta.

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
