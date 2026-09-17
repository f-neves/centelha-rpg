# I. Mesa virtual · tempo real

Frente aberta em **2026-08-11**, quando o Grid passou a atualizar sozinho. O desenho está escrito
em `src/lib/mesa-tempo-real.ts` e no topo de `supabase/migracao-20.sql`: quem escreve toca uma
**campainha** no canal `mesa:<id>` com uma palavra, e quem ouve relê aquele pedaço pela própria
view. Nada de estado viaja pelo canal, e é isso que mantém a máscara de coluna da migração 14 de pé.
Medido: 1,1 s do dedo sair do mouse até a peça aparecer na outra tela, uma consulta por evento.

- [ ] **I1 · [FAZER] Fechar o canal.** Hoje ele é público: quem soubesse o UUID da mesa poderia
  ouvir as campainhas dela (descobriria que *algo* mexeu, e leria o nome de quem apontou uma casa).
  As duas policies estão prontas e comentadas no fim de `migracao-20.sql`; falta ligar o
  `private: true` no cliente e **testar com dois navegadores antes de subir**. O motivo de não estar
  ligado é o preço de errar: com a policy torta, todo mundo é recusado e o tempo real some sem
  mensagem de erro na tela.
- [ ] **I2 · [FAZER] O registro da arena ainda é um `jsonb` reescrito inteiro.** A migração 20
  barateia a LEITURA (uma linha por entrada, as 60 últimas); a ESCRITA continua subindo o array
  todo, até uns 45 KB, a cada peça movida. O conserto é o mesmo da migração 19 com os efeitos:
  `arena_log` como tabela, uma linha por entrada, e o desfazer virando um `delete`.
- [ ] **I5 · [FAZER] Um editor de cenário no Grid.** Hoje o mestre só põe peças: o tabuleiro não
  tem parede, terreno difícil nem item no chão, e o único veto de passo é casa ocupada
  (`ocupadoPor`, `grid.astro:7433`). Decidido em 02/09/2026, ao desenhar o harness de simulação
  (`docs/simulacao/02-projeto-harness.md` §0.4 P2): a **parede entra como funcionalidade**, e o
  encaixe já existe, porque `caminharHex` recebe um veto arbitrário (`hex.ts:131`). O terreno
  difícil tem gancho pronto e não usado: a condição `terreno-dificil` existe em `condicoes.json`
  com campo de `velocidade`, e o Grid não a lê. Abre junto a pergunta da **linha de visão**, que
  não existe em lugar nenhum e que o Efeito `passo-relampago` exige pelo texto.

- [ ] **I3 · [FAZER] As outras abas ainda não ouvem.** Grid e Combate estão no canal; Grupo, Mapas,
  Compêndio, Diário e Arquivos não. A ficha aprovada, o mapa revelado e o handout liberado
  continuam pedindo F5 do outro lado. É barato: `abrirCanal` + um `carregar()` no aviso, como em
  `combate.astro`.
- [ ] **I4 · [FAZER] Nada garante entrega.** Sem número de sequência, uma mensagem perdida deixa a
  tela velha até o próximo aviso, até religar o canal ou até voltar para a aba. Um contador por
  mesa (um `int` que sobe a cada campainha) deixaria o ouvinte perceber o buraco e pedir tudo.
- [ ] **I5 · [FAZER] O anel de Vida remoto aparece em salto.** A peça que anda por ordem de outra
  tela desliza; a Vida que muda por ordem de outra tela pula direto para o valor final, porque o
  desenho troca o nó e transição de CSS não roda em elemento recém-nascido. O caminho é o mesmo do
  `deslizarTokens`: mexer no `stroke-dashoffset` do nó que já está lá.
- [ ] **I6 · [FAZER] A presença não distingue quem está olhando.** Ela conta abas abertas, e uma
  aba em segundo plano conta igual. O navegador estrangula os timers da aba escondida, então ela
  também **atrasa a própria campainha** quando é ela que escreve (não incomoda na prática: quem
  age está com a aba na frente).
- [x] **I7 · FEITO em 2026-08-12. Névoa de guerra.** Três estados (claro, névoa leve, névoa
  pesada), visão em volta das peças do grupo, fogo e luz abrindo o mapa, e memória do que já foi
  explorado. As perguntas de mesa foram respondidas assim: a névoa é **do grupo**, o explorado
  **fica** (vira névoa leve, que mostra o chão e esconde quem está nele), e o alcance é um **raio da
  cena**, igual para todos. Migrações 23 e 25; o corte é na view `token_visao`, e não na tela. O
  quadro completo e os seis limites que sobraram estão em `Grid_melhorias.md`.
- [ ] **I8 · [DECIDIR] Ponteiro ao vivo.** Hoje há o ping (dois cliques acendem uma casa para todo
  mundo, assinada). O passo seguinte é o cursor de cada um deslizando pelo mapa, que é o que as
  mesas virtuais grandes fazem. Custa uma mensagem a cada ~50 ms por pessoa que estiver mexendo o
  mouse, e é a única coisa desta lista que pesa de verdade: vale a pena?
- [ ] **I9 · [DECIDIR] O caderno de melhorias do tabuleiro.** `Grid_melhorias.md` guarda a lista
  inteira do que as mesas virtuais têm, do que os usuários reclamam que falta nelas e do que os
  jogos de combate por turno resolveram (Fire Emblem, FFT, Into the Breach, Grandia, Valkyria,
  XCOM, Divinity, BG3). São ~25 ideias com custo estimado; três delas precisam de decisão de regra
  antes do código (**terreno por hexágono**, **altura** e **face da peça**).
- [ ] **I10 · [FAZER] As pontas soltas do jogador no tabuleiro.** Em 2026-08-12 o jogador passou a
  mover a própria peça, mirar, conjurar e lançar dano (migração 22: funções `jogador_*`, e não
  policy, porque RLS filtra linha e o que precisa ser filtrado é coluna). Ficaram seis pendências
  pequenas, listadas em `Grid_melhorias.md` na seção "Pontas soltas": as **Proezas** ainda não são
  ação de tabuleiro, a **invocação do jogador não sobrevive ao F5**, a **Absorção não entra no dano
  dele**, a **caixa de acerto vem vazia** do lado dele, o **número de dano só aparece para quem
  enxerga o número**, e o adaptador `sbDoJogador` conhece cinco formas de escrita (nota de
  manutenção, para quando o módulo das Artes ganhar outra).
- [~] **I11 · A Arte sai no ÚLTIMO Tick, no tabuleiro. PARCIAL em 2026-08-21.** O que entrou
  (§15.6 do `Combate_Tempo.md`): conjurar declara a ação com a anatomia da Arte (Preparo = ciclo − 1,
  Golpe no último Tick), o relógio anda a Velocidade inteira, e o efeito **nasce no Tick do Golpe**
  em vez de na hora do clique; enquanto o relógio não o alcança ele não queima ninguém e não é
  obstáculo, e a mancha aparece tracejada só para o mestre. O estado de preparo coube em
  `arena_efeitos` porque a linha guarda o Tick de nascimento, e `montando()` responde o resto.
  **O que NÃO entrou, e é a parte que esta pendência dizia ser a difícil:** a §5.5 manda a mira e a
  forma travarem **no fim** do preparo, e hoje elas travam na declaração (o mestre escolhe onde a
  bola cai antes de montar). A diferença é de regra e não de tela: com a forma travada cedo, quem
  se move durante o preparo escapa; com ela travada tarde, não escapa. Junto continua faltando a
  janela de **identificar o feitiço** (Inteligência + Ocultismo, Dificuldade caindo a cada Tick),
  que hoje é o +2 ou +4 que o mestre marca à mão.
- [~] **I12 · O Grid como copiloto: menos toque, mais escolha. FEITO em 21/08, menos uma decisão de regra.** Medido
  antes: **um ataque custava seis toques e um número digitado, e só três dos sete eram escolha**; o
  resto era o mestre transcrevendo para o Grid um número que o Grid já tinha. O documento é o
  `Grid_Automacao.md`: a conta do atrito, o princípio (nunca perguntar o que dá para calcular · todo
  número calculado é campo editável · a mesa escolhe a intenção e o Grid faz a conta), oito emendas
  e o **contrato do improviso** em três degraus.

  **Entraram as oito:** a **folha da ação** (uma caixa só, do acerto ao dano, com a Defesa
  pela escada, o bolo de dados de quem ataca, o modo do dano lido da arma e a Absorção ao vivo, tudo
  editável); o **ajuste avulso com motivo**, que vai para o registro; os **três modos de rolagem**
  no painel ⏱ (`mesa` é o padrão: ninguém rola no site); o **arrasto que ataca**; os **atalhos**
  (A · O · T · 1-9 · Z); o **deslocamento pago** (K20); o **aviso de alcance**; a ação **"outra
  coisa"**; e o **modo TV**. A conta nova do ataque comum é **dois toques**.

  **As duas últimas entraram no mesmo dia.** A ação **"outra coisa"** (emenda F, item no menu e
  tecla `O`) cobra o tempo com a mesma régua do resto, rola o bolo que a mesa digitar, compara com a
  Dificuldade e escreve no registro a frase do mestre, que é obrigatória; custo zero é ação livre.
  No motor entrou `anatomiaLivre`: a ação sem classe resolve **agora** ou **no fim**, e no sistema
  normal as duas colapsam. O **modo TV** (emenda G) esconde a barra da mesa, a da arena, a coluna
  lateral e o campo do custo, deixando o tabuleiro e a ordem de combate; botão, tecla `T`, `Esc` e
  porta de saída flutuante, guardado no aparelho.

  **A distância virou número em 21/08, e a decisão foi MOSTRAR E NÃO APLICAR.** A convenção subiu
  para o `regras.json` (`combate.alcance`): um hexágono no corpo a corpo, dois na haste, e as
  **quatro faixas de −3** do `Arremesso.md`, que são quartos do que SOBRA entre o alcance livre e o
  máximo. As armas de distância ganharam `alcanceLivreFrac` no catálogo, que é o que a regra manda a
  arma dizer ("a arma diz a fração; você diz o resto"). A conta está em `src/lib/alcance.ts` e a
  folha escreve a faixa e o preço; **quem soma é o mestre**, conforme o que o jogador rolou na mesa.

  Ficou de fora, e é o mesmo buraco de sempre: **o arremesso**. O alcance máximo de uma adaga
  atirada sai da Força de Arremesso de QUEM joga, e não da arma, e esse número não chega ao Grid
  (o `RESUMO` não o carrega). Enquanto não chegar, a folha cala para o arremesso, que é melhor do
  que mostrar uma faixa inventada.
- [x] **I13 · O Grid no telefone. FEITO em 2026-08-21**, nas sete fases. O tabuleiro cresceu inteiro numa tela de notebook, e as
  oito emendas do I12 foram desenhadas com mouse na mão. Medido na bancada em 21/08, num viewport de
  390×844 com dedo: **456px de mobília antes do tabuleiro (54% da tela)**, a barra da arena quebrando
  em **6 fileiras**, a página com **1953px** (2,3 telas de rolagem), **44 controles abaixo do piso de
  toque de 44px**, e o tabuleiro abrindo a 100% de zoom numa arena de 24 colunas (mostra 6
  hexágonos). Três defeitos, e não desconfortos: na **folha da ação**, "Errou" e "Acertou · aplicar"
  nascem **fora da tela** (813px de conteúdo em 743 visíveis), o que desfaz a emenda dos dois toques;
  no **registro**, `.rg-acs` nasce com `opacity: 0` e só acende no `:hover`, então **os botões de
  arrumar o registro são invisíveis no dedo**; no **menu da peça**, 439px de altura não cabem em
  paisagem e o encaixe da borda devolve topo negativo. Não existe **pinça** em nenhum lugar do
  `src/`. O plano em sete fases está no `Grid_Mobile.md`, com o princípio (uma superfície de cada
  vez, o tabuleiro é o app), os precedentes que ele copia (a ficha em abas e a mira no dedo) e a
  bateria de bancada que cobra o resultado.

  **O resultado, medido no mesmo aparelho:** a mobília caiu de 456px para **104**, a página deixou
  de rolar (1953px → 844), os 44 controles abaixo do piso de toque viraram **zero**, a decisão da
  folha da ação está na tela sem rolar, e o tabuleiro abre a 55% em vez de 100%. A barra da arena,
  a coluna lateral e a barra da mesa viraram folhas que sobem do pé, e no lugar delas há uma barra
  de polegar montada pelo papel. Entraram a **pinça**, o empurrão de um dedo e o toque duplo, e o
  jogador ganhou a **faixa da vez** (com vibração e título de aba). Tudo cercado pela `cenaCelular`
  do `test-grid.mjs`, nas duas cadeiras e nas duas orientações, que já achou dois defeitos do
  próprio conserto (a altura estimada da barra e o primeiro dedo da pinça contando como toque).

  Duas das três decisões se resolveram na execução (o corte são os dois, largura para o layout e
  `hover: none` para o defeito; o tablet em paisagem fica como está). **Continua aberta uma:** quais
  são de fato os cinco gestos da barra de baixo do mestre, que só uma sessão com o telefone na mão
  responde. Ficaram de fora, listados na seção 5b do doc: a tela cheia e o modo TV no ⋯, as duas
  abas da folha de Em campo, e a mira no dedo estendida ao alvo do ataque.

---

