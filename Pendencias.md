# Pendências do Centelha · mapa geral

> Foto de **2026-08-17**. Índice único de tudo que está aberto, em todas as frentes.
> Cada item diz **o que falta**, **onde mora o detalhe** e **o que ele trava**. Quando um item
> fecha, marque a caixa e registre a decisão no doc da frente, que é a fonte de verdade.
>
> **Código:** cada item tem uma sigla estável (A1, B2, …) para chamar pelo nome na conversa.
> **[DECIDIR]** = precisa da sua palavra, não dá para adivinhar.
> **[FAZER]** = já decidido, é trabalho de execução.
> **[AUTOR]** = frente de escrita sua, não minha.

**Placar:** 78 itens abertos · 42 [DECIDIR] · 27 [FAZER] · 7 [AUTOR]
Por frente: **Arcano 20** · **Ações & Sistema 11** · **Mesa 10** · **Bestiário 9** · Lore 9 ·
Proezas 5 · Trilhas 4 · Arremesso 4 · Infraestrutura 4 · Social 2

> **Mesa, 2026-08-12:** fechou **I7** (névoa de guerra) e entraram **I9** (caderno de melhorias do
> tabuleiro) e **I10** (as pontas soltas do jogador agindo). O detalhe das duas mora em
> `Grid_melhorias.md`.
>
> **Placar recontado em 2026-08-17.** Ele dizia 60 e vinha de antes de três mudanças: as Artes
> fecharam **A12** (o Metal virou bloco de Efeitos de Terra) e **A17** (o chão se compra por molde)
> e abriram **A13** a **A16**; a Mesa fechou o **I7**; e a frente **J · Infraestrutura**, aberta em
> 15/08, nunca tinha entrado na linha de frentes, apesar de ter quatro itens. A contagem sai do
> próprio arquivo: uma linha por item com a caixa vazia.

---

## A. Arcano · As Artes

Detalhe em `Arcano_revisao.md` §10. O que já está fechado está no site (`/artes/regras`,
`/artes/efeitos`, `/artes/catalogo`) e em `regras.json → arcano`.

> **~~PRIMEIRA PRIORIDADE desta frente: pôr o site em dia com o `Arcano_revisao.md`.~~ Feito em 18/08.**
> As **§5.3** (os cinco moldes), **§5.4** (a manifestação em fatias) e **§5.5** (o tempo da Arte e as
> duas saídas) foram para `regras.json → arcano` e para o capítulo XV, em três seções novas
> (`#manifestacao`, `#moldes`, `#tempo`). O `"Ocultismo + Atributo"` já tinha saído em 17/08. O que
> ficou de fora é só o que **espera decisão**: a §5.4 entrou na versão da **corda** com a abertura paga
> pela **distância**, que é como a regra em seis linhas do doc está escrita, e a A21 e a A22 seguem
> abertas na caixa "Em revisão" da própria página.

- [ ] **A1 · [DECIDIR] Guardar um feitiço: os limites.** A regra base está no site (paga o Mana na
  hora, Raciocínio conta um nível abaixo e −1d6 nas rolagens enquanto carrega). Falta: a penalidade
  **acumula** por feitiço guardado? Há **teto** de quantos dá para carregar? O feitiço guardado
  **vence** com o tempo?
- [ ] **A2 · [DECIDIR] Focos das Artes não elementais.** As sete rascunhadas estão no site. Falta
  dizer quais outras Artes ganham foco e, principalmente, **como se mede a abundância** de um foco
  que não é elemento (um baralho de tarô não tem volume como um rio tem).
- [ ] **A3 · [DECIDIR] O desconto da fonte pode passar de +1?** Hoje é fixo. Fica registrado que
  lugar sagrado do elemento, estação do ano ou um pacto poderiam aumentá-lo.
- [ ] **A4 · [DECIDIR] Rituais.** Ritual já é o modo lento de conjurar (troca Mana por tempo e
  Vontade). Falta: a regra antiga de "metade do Mana no Ritual" **morre de vez**? Existe **algum
  Efeito que só funciona no modo lento** (o círculo de invocação, por exemplo)?
- [ ] **A5 · [DECIDIR] Clarão Cegante.** Ficou **sem Dificuldade** por ora: quem está na área e
  olhando sofre a Penalidade, sem rolagem. Confirmar assim ou dar uma resistência.
- [ ] **A6 · [DECIDIR] O campo `escalonavel`.** Órfão desde que os níveis dos Efeitos viraram
  fixos. Ou vira `sucede` (comprar a Fenda por cima do Terremoto pagando a diferença), ou some do
  schema.
- [ ] **A7 · [AUTOR] Treze Efeitos elementais ainda sem número**, e **Fogo, Raio e Luz não têm nada
  de nível 1**. Sua frente de revisão dos elementais.
- [ ] **A8 · [FAZER] Revisar em mesa a primeira leva** dos Efeitos das Artes não elementais: os
  números e os limites saíram no papel e não passaram por jogo.
- [ ] **A9 · [FAZER] O Efeito Especial no bestiário.** Na ficha ele já tem lugar; falta decidir
  como uma criatura carrega Efeitos no stat block.
- [ ] **A10 · [FAZER] Abertura do capítulo para iniciante.** As seções 2 a 4 do `Arcano_revisao.md`
  (o que a feitiçaria é) ainda não viraram prosa no site.
- [~] **A11 · Duas partes, dois estados** (achado na auditoria de memória de 08/09: fechar isto
  como um item só escondia uma condição futura dentro do "fechado", a forma que o `CATALOGO.md` da
  simulação agora cataloga). **[FECHADO em 2026-08-17, escopo elemental improvisado:]** o "Ocultismo
  + Atributo" saiu de todos os textos e do `regras.json`, porque nunca foi regra viva: a única
  jogada de magia hoje, para o improviso elemental sem Tradição, é **Percepção + Acerto Arcano** nos
  efeitos mirados, e o resto sai de Dificuldade fixa do Efeito ((nível da Arte) × 4 ou × 5), da
  Defesa passiva do alvo ou de tabela. Isso não muda mais sozinho. **[ABERTO, camada de Tradição:]**
  revisar as seções 3 e 4 do `Arcano_revisao.md` continua esperando **C1/C2** fecharem: só quando a
  Tradição decidir se um efeito **Moldado** rola por perícia própria (a proposta de
  `trilhas-feiticaria.md`, 28/07, nunca batida) é que o par de dados acima pode mudar para esse caso.
  "Quando a Tradição decidir" não é ressalva de rodapé: é a condição que mantém esta metade aberta.
- [x] **A12 · [RESOLVIDO 2026-08-15] Metal não vira Arte.** Passa a ser um **bloco de Efeitos de
  Terra** aberto por **Trilha**: os verbos dele são coisas que se fazem com equipamento (e coisa
  que se faz é Efeito), não tem dano nem parâmetro próprio, e a tabela de estado já o põe junto da
  Terra em "sólido, metade". Falta escrever os Efeitos, o que é conteúdo e cai na A15.
- [ ] **A13 · [AUTOR] Revisar Área × Volume.** **Encaminhado pela A17**, que separou os dois de vez:
  chão é molde, matéria é Volume. **E encaminhado outra vez em 18/08**, quando o improviso ficou com
  o Volume: o parâmetro passou a ter duas réguas, a da **manifestação** (o lado da base, 0,5 a 6 m) e
  a da **matéria** (o lado, 2 cm a 2 m), e a Área ficou sem dono, sobrevivendo na tabela só pelos 46
  Efeitos que ainda a declaram. O que sobra aqui é a escada de Volume em si, e a leitura de que
  ela está calibrada como massa (169 kg de pedra no grau 3, 10,8 t no grau 6) e não como chão.
  O parâmetro inteiro está em revisão pelo autor.
  Tudo que foi calibrado contra ele depende do resultado: a escada de Volume (lado 2 cm · 10 cm ·
  25 cm · 50 cm · 1 m · 1,5 m · 2 m), a tabela de **estado da matéria** (sólido metade, granular
  normal, líquido normal, fenômeno dobro, gás oito vezes), o teste de que o Volume cabe embaixo da
  Área do mesmo grau, e o corte entre **corpo** (Volume) e **jurisdição** (Área).
- [ ] **A14 · [FAZER] Revisar os textos de Regras das Artes** (`/artes/regras`, capítulo XV). O
  capítulo cresceu por acréscimo em várias conversas seguidas (grau 0, as três travas do improviso,
  Área ou Volume, estado da matéria) e precisa de uma passada de edição: ordem das seções, o que
  ficou repetido e o que ficou sem explicação de por quê.
- [ ] **A24 · [AUTOR] Dar um molde a cada Efeito que ainda declara `zona`.** Aberta em 2026-08-18,
  quando o Grid passou a ler as réguas da **§5.3** e da **§5.4**. A forma declarada por um Efeito já
  escolhe o molde dele (`cone` é o Leque, `muro` é a Muralha, `aura` é a Aura), e isso resolveu 12 dos
  48 sozinho. Sobram os **23 que declaram `zona`**, a genérica que engordou: hoje todos caem na
  **Explosão**, e o mestre pode trocar na caixa, mas vários pedem outra coisa (a Chuva de Fogo é
  Explosão mesmo, o Vendaval não). Cada um é um julgamento, não é mecânica. Junto vem o resto da
  **A13**: doze deles nem chão medem, medem corpo, e deveriam usar Volume.
- [ ] **A25 · [DECIDIR] A geometria das Artes que não manifestam elemento.** Cura, Fascinação,
  Adivinhação, Conjuração e Metamorfose não põem elemento no mundo, e a fatia da §5.4 não quer dizer
  nada nelas. No tabuleiro isso agora está dito em voz alta (a caixa avisa e o improviso delas vira
  Dardo, que gruda num alvo), mas o que **deveria** acontecer não está decidido: a §5 já promete
  parâmetros próprios por Arte (Gravidade na Cura, Plateia na Fascinação, Porte na Conjuração) e
  nenhum deles tem forma no chão.
- [ ] **A15 · [AUTOR] Revisar as descrições de nível das Artes** em `artes.json`, conforme os
  Efeitos Especiais e os Parâmetros de hoje. Vários níveis ainda descrevem improvisos que as travas
  não permitem mais: Fogo 3 "sustentar uma parede baixa de chamas", Fogo 4 "parede de chamas
  fechando um corredor" e "explosão que pega quatro inimigos juntos". Os seis níveis de cada Arte
  deixaram de ser regra e passaram a ser **exemplo de alocação típica**, e o texto ainda não sabe
  disso.
- [x] **A17 · [DECIDIDO 2026-08-15] O chão se compra por MOLDE, e cada molde tem régua.** Detalhe
  em `Arcano_revisao.md` §5.3. O problema era que uma régua métrica solta mais liberdade de moldar
  deixa o jogador **lavar matéria em alcance**: 1 m³ vira 127 m de cilindro fino, e a laje
  improvisada **vence o Muro comprado com XP** a partir do grau 5 (17 m contra 12; 40 contra 20).
  A alavanca não é o cuboide (ele é o mais manso dos oito), é a **esbeltez**, então nenhum teto de
  forma resolve. A escola escolhida é a de D&D 3.5, Pathfinder, Warhammer e FFT: **o molde é o
  parâmetro**, com nome e régua própria, em metros. Cinco moldes: **Explosão** (diâmetro 0,5 · 1 ·
  2 · 3,5 · 5 · 6,5 · 8 m), **Leque** (comprimento a 60°), **Linha** (comprimento, 1 m de largura,
  compra 6× o alcance da Explosão e paga na largura), **Muralha** (a régua que o Muro já tem) e
  **Cadeia** (inimigos ligados, o único molde imune à formação). O **Volume fica intacto** e perde só
  o direito de virar forma. **Corrigido em 17/08:** os cinco moldes são o que se compra com **XP**; o
  improviso ganhou geometria própria, que é a **A18**.
- [x] **A18 · [DECIDIDO 2026-08-17] A manifestação da Arte básica: fatias que saem do feiticeiro.**
  Detalhe em `Arcano_revisao.md` §5.4, e desenhada na bancada `volume-bench.html` (modo *molde de
  chão*). O parâmetro compra uma **base de n × n** (0,5 · 1 · 2 · 3 · 4 · 5 · 6 m de lado): *n* de
  frente somada e *n* de altura. A Arte sai do feiticeiro em **fatias** vizinhas, todas do mesmo
  ponto, e há **três aberturas, 60°, 90° e 120°**, que são as três que fecham o círculo em número
  inteiro (6, 4 e 3). Com a base travada, ângulo e distância são **amarrados**:
  `distância = (aresta ÷ 2) ÷ tan(ângulo ÷ 2)`. Cada fatia é uma **pirâmide**, então
  `volume = base × distância ÷ 3`, ou em fechado `n³ ÷ (6 · N · tan(θ÷2))`. **O nº de fatias nunca
  passa do nível**, o que faz três coisas de uma vez: a cobertura cresce em todo grau, só o grau 6
  fecha o círculo em fatias de 60° (o 4 fecha em 90°, o 3 em 120°) e o **piso sai de graça** (dividir
  pelo próprio nível dá aresta de 1 m, ou seja 87 cm do peito). **O que é conservado é a base, n²**, e
  quem paga as fatias a mais ficou aberto na **A22**. No grau 6 com uma fatia (os dois modelos
  coincidem aí): 60° → 5,196 m e 62,35 m³; 90° → 3,000 m e 36,00 m³; 120° → 1,732 m e 20,78 m³.
  **Duas alturas**, o
  ápice e o pé da base, com o ápice preso dentro da altura da base e as duas limitadas pelo alcance do
  braço; deslizar o ápice não custa nada (Cavalieri) e com isso o desperdício no subsolo virou
  escolha. **Estado da matéria incide no lado da base:** Terra metade, Ar o dobro, o resto igual
  (grau 6: Terra 3 m, água 6 m, Ar 12 m). Recusado no mesmo dia: o nível da Arte **não** vale alcance
  grátis. Parede, reta e bloco passam a ser **só Efeito Especial**. Três erros de conta foram
  corrigidos no caminho e estão nomeados no fim da §5.4, porque são fáceis de repetir: o volume vinha
  de um **prisma** e não de uma pirâmide (0,433 n³ em vez de 0,289 n³, 50% alto), a conservação do
  volume era propriedade **do modelo** e não da forma, e baixar a altura pela metade dá **98,2°** e não
  120°.
- [ ] **A22 · [DECIDIR] Quem paga a abertura: a distância ou a altura.** Aberta em 2026-08-17, e os
  dois modelos estão na bancada no controle **Abrir cobra**. A superfície comprada é n² nos dois, e com
  **uma** fatia eles são o mesmo desenho; a diferença só aparece ao abrir. Em **distância**, a aresta
  de cada fatia é n ÷ N: a base se aproxima, e o volume e o chão dividem por N. Em **altura**, a aresta
  fica em n e a altura vira n ÷ N: a distância **não encolhe nunca** e o volume é **conservado**,
  enquanto o chão cresce com N. No grau 6 fechando os 360° em fatias de 60°: distância dá 0,87 m de
  alcance, 6 m de altura, 2,6 m² e 10,4 m³, e pega 6 hexágonos; altura dá 5,20 m de alcance, 1 m de
  altura, **93,5 m²** (o hexágono regular de lado 6 m) e 62,4 m³, e pega **126** hexágonos, 66 de 80
  inimigos frouxos. Seis vezes o volume e vinte e uma vezes o chão. **A escolha é de jogo:** o modelo
  da altura é o que entrega o "raio cada vez maior" pedido no começo da revisão, e em troca faz do
  lençol rasteiro a jogada quase sempre certa; o da distância protege a decisão do jogador, e em troca
  não entrega o raio. Há um meio-caminho registrado na §5.4 e não implementado: cobrar as duas em
  parte (altura em n ÷ √N), com o volume caindo por √N.
  **Argumento novo, de 2026-08-18 (§5.5):** com a saída da área custando **1 Tick por metro**, o
  **Deslocamento livre** (`(Destreza + Atletismo) ÷ 2`, de 1,5 a 5 m, grátis durante outra ação) passa
  a ser a régua contra a qual o molde é medido, e ela separa os dois modelos. A roda de 360° do modelo
  da **distância** tem raio de **0,87 m**: sai-se dela de graça, na própria vez, e o Volume comprado
  não prende ninguém. A do modelo da **altura** tem raio de **5,20 m**: sair custa até 5 Ticks, e é o
  primeiro molde do jogo que não caiba num passo grátis. Se o Volume tem de valer contra quem pode se
  mexer, o modelo da altura é o único dos dois que entrega isso.
- [x] **A23 · [DECIDIDO 2026-08-18] O desvio da área: metade e dano nenhum.** Detalhe na **§5.5** do
  `Arcano_revisao.md`. A Dificuldade é da **tarefa, não de quem conjurou** (mesmo Efeito, mesma área,
  Arte 3 ou Arte 6, mesma Dificuldade: o nível da Arte compra tamanho, não uma dificuldade extra
  escondida, e um incêndio natural usa a mesma régua, sem "nível de magia equivalente"). Uma jogada só,
  lida contra dois patamares: `Dificuldade = 5 + 5 × metros até ficar fora` reduz a metade, e o
  **dobro** disso zera o dano. A escada bate nos degraus nomeados de sempre: borda (1 m) é Média (10)
  para metade e **Limite humano (20)** para zero, o teto de um mortal de ponta sem Centelha; 2 m já
  é **Sobre-humano (30)** para zero, que a régua reserva para quem tem Centelha/Proeza/Arte; 3 m+ sai
  da escada inteira. **Ticks gastos mesmo falhando** (1 por metro), só rola quem tenta sair de
  verdade, **+2 por ter identificado o efeito** (+4 com Margem), e **ficar parado de propósito pede
  Bravura ou Temperança** contra a Dificuldade da linha "metade": passando, aguenta no lugar e ainda
  come o dano inteiro; falhando, vira desvio de emergência. Sobra: (1) essa calibragem inteira **não
  passou por mesa**; (2) **metade por cobertura vertical e metade por desvio não deveriam se
  multiplicar** (provavelmente vale a melhor das duas); (3) a **Dificuldade da identificação**
  (Inteligência + Ocultismo) e o quanto ela cai a cada Tick de preparo, sendo `5 + 2 × Ticks restantes`
  a proposta em pé; (4) os números do teste de Bravura/Temperança para ficar parado. Junto vai a
  promoção da pendência 14 do doc: a Dificuldade do teste de concentração virou central, porque
  quebrar a conjuração nos 5 a 7 Ticks de preparo é a contrajogada do corpo a corpo, e falta dizer se
  ela vale para o preparo e se o Mana volta.
- [x] **A27 · [DECIDIDO 2026-08-23] Sair da área nunca é de graça, e a jogada não depende da vez.**
  A §5.5 dizia "as saídas são duas, e só uma é grátis": na própria vez saía-se no passo livre sem
  pagar Tick e sem rolar. Duas correções. **(1) O primeiro metro continua custando.** Num círculo a
  distância até a borda tem densidade `2r/R²`, então a área mora perto da borda: em todos os graus da
  escada de tamanhos, de **55,6%** (lado 6 m) a **100%** (até lado 2 m) das vítimas estão a menos de
  1 m da borda, e a saída mediana vai de 0,07 a 0,88 m, sempre arredondando para o mínimo de 1 m. Um
  primeiro metro grátis não isentaria o caso de borda, isentaria o **caso típico**. Ficou **1 Tick por
  metro**, sem brinde. **(2) A rolagem é da área, não da vez.** Quem está livre **também rola**
  (Destreza + Esquiva contra os mesmos dois patamares) e **também gasta o Tick**, porque sair da área
  é o movimento e não o passo de brinde que acompanha outra ação. A vantagem de estar livre continua
  dupla e grande: o Tick cobre vários metros em vez de um, a rolagem sai limpa (sem a escada de
  Preparo, Golpe ou Recuperação), e depois do movimento o personagem segue livre para agir. Detalhe na
  **§16** do `Golpe_Tardio.md`. A calibragem de `contraOPasso` sobrevive, porque ela mede distância
  por Tick, e essa não mudou.
- [x] **~~A21 · [DECIDIR] A base da fatia fica em corda ou vai para arco.~~ ARCO, em 2026-08-19.** O
  lado do triângulo vira **raio**, a base vira arco e o chão vira setor: `raio = (n ÷ 2k) ÷ sen(θ÷2)`,
  e o volume sai de `arco × altura × raio ÷ 3`. Dois motivos, e o segundo só apareceu ao implementar:
  fechar os 360° dá um **círculo completo** em vez de um polígono com quinas, que é a forma que a mesa
  desenha sozinha ao dizer "em volta de mim"; e o arco **já é o leque** que o Grid desenha desde
  sempre, enquanto a corda pedia um tipo de figura só dela, com teste de dentro, de saída e traço
  próprios. O **arco justo** fica registrado como a opção que mudaria o desenho sem mexer em número
  nenhum, e não foi escolhida porque o ganho do arco (`θ ÷ sen θ`, +21% a 60°, +57% a 90°, +142% a
  120°) é parte do que se quis ao adotá-lo.
- [x] **~~A22 · [DECIDIR] Quem paga a abertura: distância ou altura.~~ AS DUAS, em 2026-08-19, e quem
  escolhe é o conjurador.** A pergunta supunha que a mesa teria de ficar com uma; as duas são
  jogáveis e servem a intenções diferentes (a distância protege a decisão, a altura protege o alcance
  e o volume), então virou botão na caixa de conjuração, a cada conjuração. Junto entrou a obrigação
  de **escrever a altura da base**: vista de cima, no grau 6 em 180°, as duas desenham a mesma
  meia-lua, e só o número diz que uma tem 6 m de altura com 2 m de raio e a outra o contrário.
- [ ] **A26 · [DECIDIR] O improviso pode começar em qualquer lugar?** Aberta em 2026-08-19. A §5.4 diz
  que a manifestação nasce no feiticeiro e **nunca é colocada**, e era assim que o tabuleiro fazia. A
  mesa pediu para experimentar o contrário, e por ora o arco começa onde se clicar, com o Alcance
  comprado sendo conferido. É **afrouxamento provisório**: se ficar, a fronteira que separa improviso
  de Efeito Especial muda de lugar, porque "pôr num ponto escolhido" era justamente o que se comprava
  com XP. Decidir depois de jogar.
- [ ] **A19 · [DECIDIR] O que a matéria dentro da fatia faz em número.** Aberta pela A18. A
  manifestação diz **quanto** elemento aparece e **onde**, e não diz o que ele faz além do parâmetro
  de Dano: o que 62 m³ de chama fazem a quem está dentro, o que a espessura de uma fatia de Terra
  aguenta antes de ceder, o que pesa ao desabar. Encosta na A9 e no capítulo de Vida & Ferimentos.
- [x] **~~A20 · [FAZER] Portar a manifestação para `regras.json`.~~ Feito em 2026-08-18.** Entraram
  três blocos: `arcano.improviso.manifestacao` (a escada do lado da base, a trava das fatias, as três
  aberturas, os dois botões, as duas alturas e o fator de estado no lado), `arcano.moldes` (a §5.3,
  que também nunca tinha chegado ao site) e `arcano.tempoDaArte` (a §5.5 inteira: a Arte sai no último
  Tick, o que trava na declaração e o que trava na hora, identificar o feitiço em preparo, e a área que
  não se esquiva nem se bloqueia, com o desvio a 1 Tick por metro). O capítulo XV ganhou as seções
  `#manifestacao`, `#moldes` e `#tempo`, e o `combate.md` pagou a promessa dele ("nem tudo se bloqueia
  ou se esquiva") com um parágrafo que aponta para lá. **Duas pontas ficaram, e as duas são decisão:**
  a §5.4 entrou na versão da **corda** com a abertura paga pela **distância** (a A21 e a A22 vão mudar
  a fórmula do volume quando fecharem). **Onde a manifestação mora na régua de parâmetros fechou no
  mesmo dia:** quem compra a base é o **Volume**, que passa a ter duas réguas como a Duração tem breve
  e longa (`graus.volumeImproviso`, o lado da base do improviso, ao lado de `graus.volume`, o lado da
  matéria criada por Efeito), e **qualquer outra manifestação de volume é Efeito Especial**. Com isso
  a **Área ficou sem dono**: nos Efeitos ela virou molde pela A17, no improviso ela virou a base, e só
  segue na tabela porque 46 Efeitos ainda a declaram. Passar cada um para o molde que lhe cabe é a
  **A14/A18**, e é julgamento de Efeito, não mecânica.
- [ ] **A16 · [DECIDIR] A Fonte do Elemento: os elementos que faltam.** A régua de abundância tem
  oito escadas, uma por elemental, e nenhuma para **Areia**, **Som** e o que mais aparecer. O caso
  da areia é o mais visível: a escada da Terra desliza de solo solto para rocha viva conforme sobe,
  então um deserto cai perto do fundo de uma régua que trata material solto como fraco. Decidir
  quais materiais ganham escada própria, e se Som é escola de Ar ou outra coisa.

## B. Bestiário

- [x] ~~**B12 · O Grid da mesa não aplica fraqueza/resistência de criatura nenhuma.**~~
  **FECHADO em 08/09/2026, sha `20daeea`.** `elementosCombate()` (`src/lib/mesa-core.ts`) passa a
  centralizar a leitura de `combate.fraquezas`/`combate.resistencias`, usada pelos quatro pontos
  (`artes-grid-mesa.ts` ×2, `mesa-bestiario.ts`, `criaturas.astro`). `scripts/test-elementos-combate.mjs`
  trava a regressão, ligado ao `npm run validate` (confirmado no `package.json`, linha do script
  `validate`). **Conferido em 08/09/2026, contra uma afirmação de fora do arranjo, que o
  achado da frente L não fica inválido:** o caminho de dano da bateria (`scripts/sim/bateria.mjs`
  → `scripts/sim/lib-ponte.mjs`) importa `resolverGolpe`/`fonteRolada`/`defesaEfetiva` de
  `src/lib/lance.ts` (zero menção a fraqueza/resistência nesse arquivo) e `tierDe`/`somarCondicoes`
  de `mesa-core.ts`, **não `elementosCombate`**. Os três call-sites reais de `elementosCombate`
  (`artes-grid-mesa.ts`, `mesa-bestiario.ts`, `criaturas.astro`) não são alcançáveis pela ponte da
  simulação. O B12 nunca afetou nenhum número da bateria, inclusive o teto de 76,7% do item de
  carga do mestre: ele só mudava o dano de Arte e a exibição no Grid ao vivo, nunca a bateria
  standalone. Não havia pré-requisito real, então nada a tirar de porta nenhuma.
- [x] ~~**B1 · Preencher `fraquezas` e `resistencias` nas 308 criaturas.**~~ **FEITO em
  2026-08-10.** Os campos não cabiam no `inimigos.json`, que é gerado, então viraram o **sétimo
  satélite** do bestiário: `src/data/elementos-bestiario.json`, semeado por
  `scripts/gen-elementos.mjs` e embutido no `monsters.json` pelo `gen-monsters.mjs`. **Três
  camadas** dentro do script, cada uma vencendo a de cima: a regra por categoria e tag (64
  criaturas), o **material** de que a criatura é feita (22) e as exceções à mão (14); o JSON de
  saída é descartável. **100 das 308 têm alguma coisa (32%)**, 101 contando a criatura de
  `inimigos-custom.json`, que traz as suas inline e não passa por este script. E a
  previsão do `Arcano_revisao.md` bateu na mosca: são **47 com fraqueza a luz e sagrado**, os 32
  Corruptores mais os 15 Mortos-vivos, os 15% do livro que o Luz mira. O vocabulário ficou fechado
  em 15 palavras e o **validador falha o build** em qualquer palavra fora dele ou em fraqueza e
  resistência ao mesmo tipo. Aparece no bloco do bestiário, em duas linhas novas.
- [x] ~~**B1b · O que a fraqueza faz em número.**~~ **Decidido em 2026-08-10**, e a resposta é uma
  só para todos os tipos: **o dano não é absorvido por nada e é agravado.** Nem armadura, nem
  resistência, nem Absorção natural, nem Centelha; e ainda não fecha com descanso nem com a
  perícia Cura. **Com isso o Luz deixa de ser exceção**: ele é agravado contra as criaturas das
  trevas porque elas têm a fraqueza, não porque a Arte seja especial, e uma criatura de água
  atingida por Raio sofre agravado pela mesma razão. Isso rendeu dado novo: **água e metal
  ganharam fraqueza a raio** (condutividade), cinco criaturas. Escrito em `Arcano_revisao.md` §9,
  pendência 4c e na tabela de dano, e explicado num callout do bestiário.
- [ ] **B4 · [DECIDIR] Nada causa dano `sagrado` nem `profano`.** As duas palavras só existem
  hoje *dentro* de dois Efeitos de Luz, como condição. São **47 criaturas com fraqueza a sagrado**
  e 8 a profano esperando uma fonte de dano que o livro não tem. Ela viria da mecânica de clérigo
  e paladino: **depende de F3**. Enquanto não vier, metade das fraquezas do bestiário é decorativa.
- [ ] **B5 · [DECIDIR] `prata` não é representável.** `armas.json` não tem campo de material, então
  "adaga de prata" não existe como dado. Vampiro e lobisomem têm fraqueza que nenhuma arma do livro
  dispara. Ou entra um campo `material` na arma, ou vira etiqueta narrativa que o Mestre aplica.
- [ ] **B6 · [DECIDIR] `sol` é ambiente, não ataque.** Só o vampiro tem, e quem dispara é a cena.
  Talvez pertença à ficha de **Ambiente** (`Acoes_Sistema.md` §8.5) em vez da régua de dano.
- [ ] **B2 · [FAZER] Modificadores de Defesa por porte.** Criatura não média não tem ajuste de
  Defesa hoje; o porte já mexe em PV e Absorção, falta a esquiva.
- [ ] **B3 · [FAZER] Rebalancear os brutos grandes.** O pool de ataque deles está acima da régua da
  Centelha (registrado em `Proezas_revisao.md` e `REVISAR.md`).

**O editor de criaturas** entrou em 2026-08-10 (`BestiaEditor.astro` + `src/lib/bestia-editor.ts`):
botão no bloco de cada criatura e um "Nova criatura", os dois só para o ADM, abrindo um modal de
cinco abas que cobre o esquema inteiro e recalcula os derivados ao vivo. Ele nasceu com três
limitações conhecidas, que são as três de baixo.

- [ ] **B7 · [FAZER] O ataque da criatura do livro não volta para o formulário.** O `monsters.json`
  guarda o ataque **já calculado** (`pool: "2d6 +1"`, `dano: "1d6 +2 corte"`, `speed`) e não a
  origem dele (atributo, perícia, dados, mão, penetração), então não há como repopular a linha sem
  adivinhar. O modal mostra o ataque do livro em leitura, marcado como tal, em vez de deixar a
  lista vazia fingindo que a criatura não ataca. **O conserto é no gerador**: o `gen-monsters.mjs`
  preservar os campos de origem ao lado do calculado. Criatura nova não sofre disso, porque ela
  nasce com os campos de origem.
- [ ] **B8 · [FAZER] O modal não edita poderes, técnicas nem artes.** As três listas existem no
  `monsters.json` e o formulário não as toca, então criatura cadastrada por ele sai sem nenhuma das
  três. Encosta em **A9** (como uma criatura carrega Efeito Especial no stat block): não vale
  desenhar a UI das artes antes de A9 dizer o formato.
- [ ] **B9 · [DECIDIR] Onde a criatura editada mora.** O site é estático: o modal guarda a edição no
  `localStorage` do navegador e oferece o bloco pronto para colar no `inimigos-custom.json`, que é
  o único caminho que entra no build. Duas pontas soltas nisso. A primeira: **editar criatura do
  livro não tem para onde ir**, porque o `inimigos.json` é gerado, e a correção teria de voltar à
  bancada `conversao-monstros.html`. A segunda: o portão de ADM é `ehAdmin()`, **portão de
  interface e não de segurança**, o que basta enquanto o dado é estático e deixa de bastar no dia
  em que a edição escrever no Supabase, como as fichas já escrevem.
- [x] **B10 · [RESOLVIDO 2026-08-17] `inimigos.json` saía de sincronia calado.** Detalhe em
  `Bestiario_Centelha.md`. A suspeita registrada aqui (**"os números novos são os que a bancada
  manda; os antigos é que estavam velhos"**) estava invertida: **o regen de 10/08 desfez a
  Reescala**. A prova é tripla: a distribuição antes do regen tinha um buraco exatamente no degrau
  que a Reescala **inseriu** (nada em Centelha 2); o `Reescala.md` já avisava, na Fase 6, *"se
  regerar do zero, reaplicar o +1 nos ≥2"*, e o passo não foi refeito; e o **Campeão (herói
  inimigo)**, cujo conceito é "um adversário à altura dos PJs", lia Desperto 2 enquanto Kael, o
  herói de referência, é 3. Quatro criaturas ficaram até impossíveis, carregando Técnica de nível 3
  com Centelha 2. **110 criaturas subiram +1**: as 91 de Centelha ≥3 e 19 das 57 do degrau 2, que
  passou por **triagem** em vez de subir em bloco (sobe quem tem piso técnico 3 ou ameaça 4+; ficam
  no Desperto as 38 de tropa, emboscada e bicho de estrada). Os derivados vieram por fórmula, sem
  delta à mão. **O conserto de fundo:** o +1 passou a morar **na fonte** (bancada,
  `conversao-extra.json` e os builds inline), o gerador ficou idempotente (verificado byte a byte) e
  o novo **`gen-bestiario.mjs --check`** falha o `validate` e o `build` se o JSON commitado divergir
  da fonte, nomeando as criaturas. De quebra, dois resquícios da régua velha saíram do gerador: a
  nota de "acima do teto mortal" ia marcar 16 Semideus como entidade, e o nível de Arte era cortado
  em 5 quando as Artes já têm 6.
- [ ] **B11 · [FAZER] Palavra nova de fraqueza precisa de rito para virar oficial.** O vocabulário
  vive em `src/data/elementos-vocab.json` (15 palavras, lido pelo validador, pelo gerador e pelo
  editor) e o **validador falha o build** em qualquer palavra fora dele. O modal aceita palavra
  avulsa e a guarda no `localStorage`, o que serve para rascunhar mas não atravessa: quem quiser
  oficializar tem de editar o JSON à mão. Falta o passo que promove a palavra rascunhada.
- [ ] **B13 (renumerado de B12 em 08/09/2026) · [FAZER] `roladaManual` dobra o bônus fixo em pool
  "0d6" literal.** Colidia de código com o B12 da fraqueza/resistência: as rodadas 17-18 já o
  citavam como "D16c/B12" (`docs/simulacao/caixa/17-executora.md:53`, `18-revisora.md:99`) antes de
  este item entrar no mapa, e quando entrou o código já estava em uso por outro achado. Renumerado
  para não haver dois itens com o mesmo código; o conteúdo não mudou. Achado colateral
  da rodada 16 do Interpor (`docs/simulacao/caixa/16-executora.md`), fora de escopo daquela
  frente. `roladaManual` (`src/lib/rolagem.ts:95`) trata qualquer expressão sem `d6` como "total já
  pronto" quando só um número é digitado — certo para dano fixo de verdade, mas quando a expressão
  é um pool escrito como `"0d6+2"` (caso real de `mon-bat`/`mon-toad`) e a rolagem sai por
  `rolagem=site` e é relida como digitação manual, o `+2` fixo entra duas vezes: uma dentro do
  total rolado, outra somada de novo por `flatDeExpr`. Não corrigido ainda; a Executora contornou
  no teste novo usando um pool com dado de verdade (`3d6+21`) em vez de reproduzir o caso "0d6".

Detalhe em `Trilhas_Feiticaria.md` §6. As seis Tradições já estão descritas no site.

- [ ] **C1 · [DECIDIR, BLOQUEADO pela camada de Tradição] Jogadas das Artes, casos de fronteira.**
  Não é pendência esquecida, é bloqueada: parada porque depende de a Tradição (`trilhas-feiticaria.md`,
  proposta de 28/07, nunca fechada) existir primeiro. O esquema **Mirado** (Acerto Arcano + Percepção
  ou Destreza, esse já em vigor desde 17/08) contra **Moldado** (perícia da Tradição, essa ainda só
  proposta) está proposto e não batido. Falta o martelo nos híbridos (recomendo uma rolagem só).
  **Trava a metade Tradição do A11.**
- [ ] **C2 · [DECIDIR, BLOQUEADO pela camada de Tradição] A perícia de conjuração de cada Tradição.**
  Mesmo bloqueio do C1: sem a Tradição fechada, não há tabela para avaliar de verdade. A tabela está
  proposta e precisa de aval. A **Iniciação** provavelmente pede um traço de **Fé/Devoção** que não
  existe: criar?
- [ ] **C3 · [FAZER] O mapa Arte × Trilha.** Só existe um exemplo (Terra). O catálogo das 24 Artes
  é frente própria, do tamanho do bestiário, com os números de treino junto.
- [ ] **C4 · [FAZER] Portar `trilhas.json`** quando a mecânica fechar, e revisar o mortal-tocado
  (Bram é Erudição).

## D. Proezas e Técnicas

Detalhe em `Proezas_revisao.md`.

- [ ] **D1 · [FAZER] Fase 3 da migração.** Matar a **banda** de vez (Velocidade independente por nível,
  apagar o campo `banda` e tirar do schema) e **surfar o modificador da trilha na UI**, mostrando o
  valor ao lado da Técnica.
- [x] **D2 · [FEITO, achado na auditoria de memória de 08/09] Reconciliado.** O texto já bate com a
  régua (`tecnicas.json` traz "+3 em Furtividade", nível×3), não "+2" como este item ainda dizia.
- [ ] **D3 · [DECIDIR] Densidade dos funis.** Caminhos reaproveitados têm ~3 Técnicas no nível 1
  (funil 3·2·1·1·1), mais enxuto que o padrão de Força. Alargar ou aceitar.
- [x] **D4 · [SEM CAUSA 2026-08-17] O retag já estava feito; o item nasceu de uma leitura errada.**
  A frase da auditoria (**"Defesa Mental agora só aparece em Comando e Marionete"**) fala dos dois
  **Caminhos**, não de duas Técnicas, e "Marionete" ser também o nome de uma Técnica de nível 6 é a
  armadilha. Conferido no dado vivo: as **15 Técnicas** que citam Defesa Mental estão **todas** em
  Comando (9) e Marionete (6), que é exatamente o que o doc manda. As 12 que a auditoria nomeia
  estão lá; a 13ª é **Tom de Autoridade**, que **baixa** a Defesa Mental em 3 em vez de rolar contra
  ela, como o próprio doc prevê; e as outras duas são **Ordem que Pesa** e **Impulso Plantado**, as
  de nível 2 nascidas depois, na Fase 6 da Reescala, nos mesmos dois Caminhos. Nenhuma Técnica que
  a auditoria manda para a Social cita Defesa Mental. **O lado Social não precisa de marcação:** o
  capítulo de Relações Sociais faz da Defesa Social o alvo padrão, e a Mental é a exceção, que é o
  que se marca. O Arcano também está tagueado, com 15 Efeitos citando Defesa Mental. Sobra só um
  detalhe cosmético, registrado e não corrigido: 17 Técnicas sociais marcam o alvo padrão e 15
  vizinhas, de mesmo efeito, não marcam.
- [ ] **D5 · [FAZER] Reorg de conteúdo.** As árvores novas do doc (Atlas reorganizado, Força de
  Guerra, Presença Aterradora, Arremesso, Salto, Vigarista/Confessor, as novas de Perspicácia) ainda
  não entraram na data viva.
- [ ] **D6 · [DECIDIR] Custo de Técnica e de Arte em ×10.** Ficou de fora da recalibração de XP de
  propósito (largura segue sendo o gasto caro). Confirmar que fica.

## E. Social, Mental e Antecedentes

- [x] **E1 · [FEITO 2026-08-18] Antecedentes portados: dado, capítulo e ficha.** As três entregas
  saíram. O **`antecedentes.json`** (14 verbetes, 84 níveis, extraído do doc e não digitado) tem
  schema próprio no validador, onde os seis níveis são obrigatórios. O **capítulo VII** traz a
  prosa à mão e o catálogo **gerado** do JSON entre marcadores, com
  `gen-cap-antecedentes.mjs --check` no `validate` e no `build`, então dado e capítulo não
  divergem calados; ele entrou depois de Raças e **treze capítulos andaram um numeral** (Ações
  VII→VIII … Qual Sistema XIX→XX). Na **ficha**, a seção fica **logo depois das Artes**, com aba
  própria no celular (entre "Artes" e "Equip"), e tem duas
  naturezas: os **3 Únicos** são linhas fixas, e os **11 Nomeados** são listas que o jogador cria,
  cada instância com nome livre e régua própria (três Reputações diferentes são três traços). A
  chave de instância é `id~uid`, e não o índice, para sobreviver a apagar a linha de cima. O custo
  saiu de `regras.json → xp.antecedente` (**×3 por ponto**: 3·6·9·12·15·18, acumulado até 63), e
  entra na quebra de XP com nome próprio. Ao portar, duas correções no doc de origem: a folha de
  referência listava **Posição** e **Refúgio** como Únicos, contra as seções das duas, e chamava o
  Aliado Animal de "Familiar".
  **Duas coisas ficaram de fora, de propósito:** o **teto de criação** (3 em Recursos e Relíquia)
  aparece como aviso na linha e **não trava a bolinha**, porque o modo Criação/Evolução já tinha
  saído do motor e essa seria a única trava de criação da ficha inteira; e a **ficha resumida**
  (`FichaResumo`) ainda não mostra Antecedentes.
- [ ] **E2 · [FAZER] Portar `Ataques_Mentais.md` ao site.** A Defesa Mental já está no motor e no
  bestiário; o capítulo (as três camadas, a duração dos efeitos, a inimizade ao despertar) não.
- [ ] **E3 · [DECIDIR] Banda neutra da Régua de Relação: 5 ou 3?** Hoje é 5 (rompe o Neutro em 3
  passos). A de 3 faz a régua andar mais rápido. Junto vai a alternativa do decaimento: rumo à
  baseline do par, como está, ou rumo ao neutro mais próximo.

## F. Lore

Detalhe em `lore/Lore_Centelha.md` §7 e §8. Nada de lore foi ao site ainda.

- [ ] **F1 · [DECIDIR] Como os deuses romperam a Lei** na Grande Guerra (avatares? campeões? uma
  brecha?) e por que romper foi em si destrutivo. E se **alguém hoje sabe ou suspeita** que a Lei
  existe.
- [ ] **F2 · [DECIDIR] Quem impôs a Lei.** A proposta é o próprio cosmos, a Primeira Luz reagindo ao
  ser agarrada, sem entidade legisladora. Confirmar.
- [ ] **F3 · [DECIDIR] Mecânica de clérigo, paladino e monge** (poder divino via Centelha e campo de
  crença). Fecha junto com as Trilhas: clérigo e paladino são **Iniciação**, monge é **Marcial**.
- [ ] **F4 · [DECIDIR] Os planetas.** Quais importam, quais são habitados, quais são alcançáveis, e
  o que sobrou da fase interplanetária.
- [ ] **F5 · [AUTOR] Nomes próprios.** Faltam: as massas de terra sem rótulo, as cidades de Calin e
  as escondidas de Mére, o resto de Uldun, o reino feérico élfico, os planos (incluindo o da Fenda),
  as eras, os primeiros deuses e as ortodoxias rivais com seu cisma.
- [ ] **F6 · [AUTOR] Deuses locais e espíritos de lugar** por cidade e região, casando com as
  cidades que você está escrevendo.
- [ ] **F7 · [DECIDIR] Travar a §7 (o panteão).** A seção inteira está em [PROPOSTA v1] esperando
  seu aval: as três famílias de fé, as grandes potências (a **oitava de domínio já ficou confirmada**
  pela semana de 8 dias, §9.1), o casamento de cada cultura com uma mitologia real e os seis papéis
  religiosos. Trava F5 e F6, porque o nome de uma cidade carrega o
  panteão dela.
- [ ] **F8 · [AUTOR] Os nomes do calendário.** A estrutura inteira fechou na §9 de
  `lore/Lore_Centelha.md` (esqueleto, vigílias, luas, estações, pontos do sol, as cinco camadas de
  datas, o véu que engrossa, os eventos locais, a contagem dos anos). Falta **nomear**, nas duas
  camadas decididas na §9.14 (descritivo no povo, próprio no culto): 12 meses, 8 dias da semana, 8
  vigílias, 4 estações, 4 soleiras e as oito noites que fecham o ano.
- [x] **F9 · FECHADO (25/08/2026). Os períodos das três luas.** Calculado na §9.3 e §9.16 de
  `lore/Lore_Centelha.md`. Ciclos de fase de 8, 32 e 48 dias (órbitas reais de 7,84, 29,54 e 54,86);
  a terceira é retrógrada, inclinada e capturada, porque a esfera de Hill não deixa ser outra coisa.
  Sai daí: as quatro soleiras são as quatro noites de escuro total, nunca há tripla lua cheia,
  eclipse total só nos equinócios, trânsito da terceira só nos solstícios, e maré máxima de 48 em
  48 dias. Nenhuma lua pode ter período de anos, então evento geracional só vem da história.
- [ ] **F10 · [DECIDIR] A moeda mecânica das datas afinadas.** O grau de afinamento existe, falta o
  número: +1d6 por grau (a moeda de Resistir & Desgaste invertida), um degrau de Dificuldade a
  menos, recurso (Centelha e Energia rendendo mais), ou nada além de ficção e frequência de
  encontros. Decidido que a regra é **leve**. Detalhe na §9.7.

## G. Ações & Sistema

Frente aberta em **2026-08-09**. Três documentos: `Acoes_Catalogo.md` é a **bancada** (o que cada
ação é, com referências de Exalted, D&D 3.5/5e, Pathfinder 1/2, Cyberpunk RED, Chronicles of
Darkness, GURPS, Blades in the Dark, Burning Wheel e Ars Magica), `Acoes_Texto.md` é o **texto do
capítulo** na voz do livro (75 verbetes, sem regra), e `Acoes_Sistema.md` é a **regra**.
Modelo: **Drama and Systems** do Exalted 2ª edição.

**A régua comum fechou quase inteira em 2026-08-09** e está em `Acoes_Sistema.md` §3: cinco modos
de ação (Direta, Acumulada, Longa, Reflexiva, Passiva), Dificuldade pela tabela de âncoras, a
Margem como expertise excedente, banda morta de uma Margem na falha, ajuda por soma ou apoio, e
o teste coletivo. Como efeito colateral, o capítulo publicado de **Relações Sociais** foi
corrigido para falar a mesma língua.

**A régua comum está FECHADA** desde 2026-08-09. As sete decisões estruturais saíram, incluindo a
escada de seis intervalos (Tick, minuto, hora, dia, semana, estação) e o Fôlego, que morde só em
intervalo de Tick e não exigiu regra nova. **Ressalva do autor:** o Fôlego é módulo opcional e
pode vir a ser ocultado, então nenhuma ficha deve depender dele.

**Antes da primeira ficha:**

- [x] ~~**G1 · O gabarito de ficha.**~~ **Escrito em 2026-08-09** (`Acoes_Sistema.md` §5): nove
  campos em ordem fixa, o princípio de que a ficha só escreve o que **desvia** do padrão da §3, a
  régua de calibragem da §5.3 (Dificuldade de Acumulada e Longa a 70% da de Direta) e a regra
  §5.5 de primária + secundária. O caso sem modo está previsto, com Arremesso (§6.6) de exemplo.
- [ ] **G2 · [DECIDIR] Reequilibrar a Especialidade.** Efeito colateral assumido da regra de
  primária + secundária (`Acoes_Sistema.md` §5.5): a maior entra no pool e a **menor inteira**
  vira bônus fixo, o que torna a secundária cerca de duas vezes e meia mais eficiente por XP do
  que a Especialidade (secundária 4 custa 18 XP e dá +4; dois níveis de Especialidade custam 28 e
  dão ~+2,4). Ou a Especialidade barateia, ou fica claro que ela serve para o que **não tem**
  secundária pronta ("espada longa", "nas sombras"), que é o caso da maioria. **Não trava as
  fichas**, mas mexe na economia de XP.
- [x] ~~**G3 · Normalizar a tabela §4 do `Acoes_Sistema.md`.**~~ **Refeita em 2026-08-10**, de
  uma vez e não linha a linha, junto com o G9. A tabela agora tem coluna de **Modo** e fala a
  língua dos cinco, e a coluna de Estado aponta a ficha (**§x.y**) quando ela existe. Ganhou uma
  §4.8 com o placar da frente: **22 das 75 ações têm ficha**, e as duas famílias intactas são
  Sentidos e mente e Fé e o sobrenatural, ambas travadas por decisões de fora deste documento.

**Escrever:**

- [x] ~~**G4 · Construção e ofício.**~~ **Escrito em 2026-08-09** (`Acoes_Sistema.md` §7), e
  **não virou subsistema**: é a Jogada Longa com tabela. A peça tem cinco números (**Requisito** =
  a porta, Dificuldade = o ritmo, Montagem = o que se paga uma vez por lote, Peça = por unidade,
  intervalo) e às vezes um **Piso**, para o serviço que é mão e não técnica. Requisito e
  Dificuldade não são a mesma coisa dita duas vezes: cota de malha é Requisito 2 com Acúmulo
  enorme, fechadura é Requisito 5 com Acúmulo pequeno. Fecharam junto: o **lote** (a montagem se
  paga uma vez, o que explica por que ninguém acende a forja para uma espada só), o território de
  **Ofícios Gerais** (cobre sozinho Dificuldade até o **nível da Habilidade**; fora dele, **+4**;
  e vale **metade** ao conferir o Requisito), a **régua de
  qualidade simétrica** de seis graus (Sucata a Excepcional; cada grau mexe em Requisito ±1,
  Dificuldade ±3, Acúmulo ×1,5 ou ×0,5, preço, e sobe o intervalo a cada dois graus, que é como se
  chega à Espada Longa Ótima do painel de ajuste), oficina e material como os ±2/±4, a **direção
  de obra** (ajudante sem ofício trabalha contra Dificuldade 4 sob supervisão, até dez por
  supervisor) e as quatro tabelas de referência por escala. Ficaram fora, na §7.10: preço da peça
  pronta, material sobrenatural, a oficina como traço e a etapa de colheita e extração.
- [x] ~~**As cinco físicas de toda sessão.**~~ **Escritas em 2026-08-09**
  (`Acoes_Sistema.md` §6.1 a §6.5): Escalar, Nadar, Cair, Feito de força e Esgueirar-se. Feito de
  força saiu com as duas faces separadas (erguer não rola, romper rola) e ganhou a tabela de
  material que faltava. Esgueirar-se resolveu na prática o **Valor Passivo de Prontidão** como
  alvo, o que encaminha o G7.
- [x] ~~**G5 · Uma escada de exaustão única?**~~ **Decidido em 2026-08-09: não existe.** Os cinco
  casos não medem a mesma coisa (veneno é dose, doença é estado que piora, ambiente é pressão
  constante, sufocamento é contagem regressiva, sono é dívida), e cada um tem relógio, dano e
  penalidade próprios. Veneno e sono nem sequer usam o mesmo modo: um tem jogada, o outro é
  Passiva. O esqueleto das cinco está em `Acoes_Sistema.md` §8.1.
- [x] ~~**G5b · Escrever as cinco fichas de Resistir.**~~ **Escritas em 2026-08-10**
  (`Acoes_Sistema.md` §8.3 a §8.7). As três decisões que atravessavam a família saíram juntas:
  as penalidades **somam com teto 4**, a moeda comum é o **Desgaste** (−1d6 por degrau, pool nunca
  abaixo de 1d6) e **cada veneno declara** se derruba Atributo, tira PV ou dá Desgaste, sempre
  ignorando Absorção. Nenhuma condição mata pelo Desgaste: mata pelo relógio próprio dela.
  Destaques: doença roda por **cinco estágios** com a banda morta de uma Margem e foi calibrada
  contra o **camponês**, de modo que a cura vem de quem cuida (as circunstâncias de cama e
  curandeiro) e não da ficha do doente; no ambiente, **agasalho não muda a Severidade, muda o
  intervalo**, e Sobrevivência evita enquanto Resistência aguenta; sufocamento são dois relógios
  ((Vigor + Resistência) × 10 Ticks de ar, depois Vigor × 20 de socorro) e não toca em Fôlego.
  Pendências novas na §8.8, sendo a que mais importa: **Desgaste ainda não conversa com as
  penalidades de ferimento** de Vida & Ferimentos, e as duas vão se somar em mesa.
- [ ] **G6 · [DECIDIR] Percepção passiva: confirmar.** A ficha de Esgueirar-se (§6.5) já usa o
  **Valor Passivo de Prontidão** (2 × Percepção + Prontidão) como alvo, e a calibragem sai
  razoável: servo distraído 6, sentinela comum 10, batedor de elite 16, mestre de espiões 20.
  Falta só confirmar que é assim que o jogo lê "notar sem procurar", e o resto da família de
  Sentidos herda.

**Arrumação:**

- [x] ~~**G7 · Duas ações levantadas e nunca catalogadas.**~~ **Entraram, em 2026-08-10.** As
  duas aparecem em mesa toda hora e nenhuma tinha casa. **Escapar de amarras** foi para Corpo e
  movimento, depois de Cavalgar, e cabe como Acumulada, porque o que interessa é o tempo até
  soltar. **Sinalizar à distância** foi para Sentidos e mente, depois de Enxergar longe, que é a
  ação de que ela é o oposto, e é a que menos tem de onde copiar: só o `GURPS` tem perícia
  própria para isso. As duas estão nos três documentos, e a §12 do catálogo ficou vazia.
- [x] **G8 · [DECIDIDO 2026-08-18] "Stunt" virou **Firula**.** A palavra saiu de 14 lugares no
  site (`habilidades.md`, `combate.md`, `relacoes-sociais.md`, `glossario.json`) e de 29 nos docs
  de trabalho (`Combate_Social.md`, `Acoes_Sistema.md`, `Regua_Relacao.md`, `Antecedentes.md`,
  `Relacoes.md`, `Reescala.md`, `resumo-regras.txt`), de uma vez. **Passou por Manobra no
  caminho:** em 17/08 o termo escolhido foi Manobra, e em 18/08 virou **Firula**, por três razões
  do autor · ela tem ar cômico, tem significado largo, e não se confunde com manobra de combate
  nem com a Técnica **Ler a Manobra** (Estrategista N3), que segue com o nome dela. O oposto é
  **Firula Infeliz**, e não "Contra Firula", que leria como contragolpe. No glossário a entrada
  guarda **"stunt" e "manobra" como apelidos**, para quem procurar por qualquer um dos dois nomes
  velhos achar o novo, e "manobra" deixou de ser apelido de **Técnica**, para a palavra não ter
  dois donos: Técnica é o que se compra com XP, Firula é o que nasce da descrição e vale só
  naquele lance, e o capítulo de Habilidades diz isso em voz alta. O texto foi **reescrito frase a
  frase**, e não trocado no braço: "empilhando gestos (stunts)" virou "empilhando Firulas", com a
  explicação de que ali elas são gestos.
- [x] ~~**G9 · Três listas paralelas das mesmas ações.**~~ **Unificadas em 2026-08-10.** A regra
  ficou escrita na §4.0 do `Acoes_Sistema.md`: **a lista é do `Acoes_Texto.md`, as referências são
  do `Acoes_Catalogo.md`, a mecânica é do `Acoes_Sistema.md`**, e os três carregam as mesmas
  **sete famílias e setenta e cinco ações**, com os mesmos nomes e na mesma ordem. As divergências
  reais eram duas, e foram fechadas: **Apostar** e **Levantar o peso máximo** faltavam no
  catálogo.
- [x] ~~**G10 · Capítulo único ou distribuído?**~~ **Capítulo único, publicado em 2026-08-10** a
  pedido do autor: **capítulo VII, logo depois de Raças**. Combate em diante andou um numeral, e
  de quebra corrigiu-se uma divergência que já existia: Fôlego, Criação de Personagem e Qual
  Sistema tinham no frontmatter um numeral a menos do que o `site.ts` mostrava na barra lateral.
  **Fatiado em cinco sub-páginas** logo em seguida, no padrão dos capítulos II e XVI (53 mil
  caracteres eram o dobro do maior capítulo do livro): `acoes-e-sistema` (A Régua Comum),
  `acoes-corpo-e-movimento`, `acoes-resistir`, `acoes-sentidos-e-engano` e `acoes-oficio-e-mundo`.
  As quatro famílias que ainda não têm ficha couberam numa página só.
- [ ] **G12 · [DECIDIR] Desgaste e ferimento não se conhecem.** Levantado na §8.8 do
  `Acoes_Sistema.md` e é o que mais importa das sobras: o Desgaste (−1d6 por degrau, teto 4) não
  conversa com PV nem com as penalidades de ferimento do capítulo de Vida & Ferimentos, e os dois
  **vão se somar em mesa** no primeiro personagem envenenado que também apanhou. Ou o teto 4 passa
  a valer para a soma dos dois, ou ferimento vira Desgaste, ou eles correm em paralelo de
  propósito. Enquanto não sair, o Mestre está arbitrando.
- [ ] **G13 · [FAZER] As sobras das duas famílias escritas.** Sete assuntos que as fichas
  encostaram e não cobriram. Do ofício (§7.10): **preço da peça pronta** (o `precos.json` não cobre
  arma, armadura nem obra), **material sobrenatural** como ponte com Artes e bestiário, **a oficina
  como traço** do personagem em vez de modificador de circunstância, e **colheita e extração**
  (minerar, abater, curtir), que é a etapa antes da forja. De Resistir (§8.8): o **catálogo de
  venenos** com preço e legalidade, a **doença como enredo** de campanha em vez de jogada por
  personagem, e **frio e calor mágicos**, que é decidir se o gelo de uma Arte causa dano ou
  Severidade.
- [ ] **G11 · [FAZER] `regras.json → acoes`.** O capítulo já está no site, mas as tabelas dele
  são texto: nada disso é lido pelo motor nem aparece na ficha. Os melhores candidatos são a
  tabela de dano por queda, o Desgaste e os cinco números das peças do ofício, que destravariam
  o ajuste de peça na ficha deixar de ser um campo livre.

## K. Combate · a linha do tempo

Frente aberta em **2026-08-18**. Doc de trabalho: `Combate_Tempo.md`. **Bancada interativa:
`combate-tempo-bench.html`** (abre com duplo clique, sem servidor: quatro abas, todo número de
regra é um botão, treze cartões de regra com o estado da decisão, nove baterias e um duelo narrado
Tick a Tick com o trilho desenhado). O motor é `scripts/lib-tempo.mjs`, um só, usado pelo relatório
em lote (`node scripts/sim-ticks.mjs`) e inlinado na bancada por `scripts/gen-bench-tempo.mjs`. O
catálogo é o real (`armas.json`, `armaduras.json`).

A ideia: trocar a Velocidade única pelo par **Preparo/Recuperação** (`P + R` = a Velocidade de
hoje) e generalizar o desvio de emergência da §5.5 do Arcano numa **dívida de Ticks**.

**Em 19/08/2026 a régua ganhou uma terceira fase e virou `P/G/R`** (§14 do `Combate_Tempo.md`).
Quando a §14 discordar das §2 a §9, vale a §14, e os itens abaixo marcados `[SUPERADO]` foram
revistos por ela.

- [x] **K29 · [DECIDIDO 2026-08-24] O Quase-Acerto entrou no Grid, e trouxe duas correções de regra.**
  O capítulo XII existia escrito desde sempre e o motor nunca o calculava: a mesa fazia a conta de
  cabeça, ou simplesmente não usava a válvula que impede duelo de guarda alta de virar uma fila de
  zeros. A folha da ação ganhou uma terceira saída, **"Raspou · aplicar"**, com Margem e dano do
  raspão vindo prontos e **editáveis**, e o veredito passou a ter três estados em vez de dois.

  **Correção 1, a régua da classe da arma.** Era o número de dados (1d6 leve, 2d6 média, 3d6
  pesada), e o catálogo andou por baixo dela: hoje **24 das 26 armas têm um dado só e nenhuma tem
  três**. Ao pé da letra, a espada longa virava leve e a categoria pesada deixava de existir. Passou
  a ser o **dano médio** da arma (`dado × 3,5 + danoBonus`): até 2 leve, de 2,5 a 5,5 média, 6 ou
  mais pesada. É o dano da ARMA e não o do personagem, senão o mesmo aço raspava diferente na mão de
  um brutamontes. Arma fora do catálogo (criatura, item improvisado) tem a média lida da própria
  expressão de dano, porque ali a expressão *é* a arma.

  **Correção 2, a tabela de armaduras.** O capítulo dizia que a média reduz 2 e a pesada 4; o
  `regras.json` dizia 4 e 6, e o exemplo do próprio capítulo usava 6. O JSON venceu e o capítulo se
  corrigiu, que é a regra da casa.

  **E uma convenção que estava implícita:** "errou por X" é `(Defesa + 1) − total`, e não a diferença
  crua, porque a regra do acerto é `total > Defesa` e empate não passa. O Grid já fazia assim; o
  capítulo dizia outra coisa no exemplo. Agora está escrito nos dois.

  **Onde a criatura fica devendo:** o bestiário guarda couro grosso como **Absorção**, e não como
  armadura vestida, então criatura nasce com bônus 0 e redução 0. Foi decisão consciente: o
  cavaleiro de placa construído como criatura se conserta na própria folha (os dois campos são
  editáveis) ou pelo ajuste por instância (`combatentes.dados.qa`). Um campo `armadura` no bestiário
  seria varredura de 309 verbetes, do mesmo tamanho da pendência do deslocamento.

  Provas: `scripts/test-quase-acerto.mjs` (novo portão, com a classe de cada arma do catálogo, o
  empilhamento das armaduras por duas regras diferentes, e o exemplo do capítulo refeito pelo motor)
  e a cena `cenaQuaseAcerto` no smoke, que confere os três estados do veredito e que o botão aplica
  **dano fixo sem passar pela Absorção**.

- [x] **K1 · A régua, decidida (18/08).** `P/R` (leve 0/5 · média 1/5 · haste 0/6 · pesada 2/5), a
  guarda que se refaz **quando o golpe sai**, o Preparo que **não compra nada** e o golpe que
  **redireciona** quando o alvo cai. Medido neutro no catálogo real: maior desvio de 0,7 ponto em
  dez armas e 0,7 em doze células de arma × armadura.
- [x] **K2 · Catálogo decidido (18/08).** Entra inteiro, **ataque incluso**. Preço: Velocidade
  inteira em dívida, guarda não se refaz, uma por ação, gatilho só na janela, e **nenhuma
  penalidade de rolagem**. As quatro travas juntas dão desvio de +1,7; tirar a de "uma por ação"
  leva a +35,6 e derruba o combate de 32 para 9,6 Ticks.
- [x] **K3 · Interromper compra o espelho (18/08).** O alvo perde tantos Ticks quantos o
  interruptor pagou (desvio +1,7 contra +13,4 do cancelamento e +24,7 do atraso fixo de 1).
- [x] **K10 · O feiticeiro sob pressão, respondido (18/08).** O espelho custa 4% das Artes ao
  conjurador nu e nada ao de Placa: **interromper exige acertar**, e a armadura vira a defesa de
  concentração. Responde à **pendência 14 do Arcano** sem tocar no capítulo das Artes.
- [x] **K7 · Os fora-de-curva do catálogo, diagnosticados (18/08).** A **Lança em 78,5%** era erro
  do banco antigo (Força dobrada numa haste de estocada); com o dado real ela fica em 56,7%. Sobram
  dois problemas de verdade, que existem **hoje** e são independentes desta revisão: a **Alabarda**
  entre 87% e 96% contra tudo (Força ×2 com Velocidade 6, acerto +1 e Defesa +2, contra o Montante
  de Velocidade 7 e Defesa −2), e a **Maça** entre 0,7% e 13% (a Absorção natural contra Impacto,
  `Vigor + Centelha`, come o dano de uma arma de uma mão). Virou item próprio: **K11**.
- [ ] **K11 · [DECIDIR] Alabarda, Maça e o Impacto de uma mão.** Ou o `forcaMult` da Alabarda cai
  para 1 (como a Lança), ou o dado dela cai. E a arma de Impacto de uma mão não tem nicho nenhum:
  contra alvo nu a Absorção natural a esmaga, contra armadura ela perde para a de duas mãos. §9 do
  `Combate_Tempo.md`.
- [ ] **K8 · [DECIDIR] Cinco das nove bordas.** Quatro já foram medidas e fechadas (quem está em
  Preparo não reage, ninguém reage antes da própria estreia na cena, o gatilho é só a janela, e uma
  por ação). Faltam: duas áreas na mesma janela, reação e Reflexiva no mesmo gatilho, abortar
  (Firme × Solta), a dívida na virada da cena e **se o golpe normal interrompe** (a mais
  consequente). §6 do `Combate_Tempo.md`.
- [ ] **K4 · [DECIDIR] O Preparo de distância e arremesso.** A curva está medida (§7): o Preparo do
  arco é pago no tiro que não sai antes do contato, e cada ponto custa de 5 a 13 pontos de win rate
  entre 45 e 100 metros. A 100 m, P=0 dá 68,6% ao arqueiro e P=2 dá 42,6%. Duas leituras
  defensáveis: caro demais (então P=1), ou o freio que faltava (então P=2). Escolha sua.
- [ ] **K9 · [DECIDIR] A carga voluntária.** Medido: **1 Tick de Preparo comprado vale +2 na
  rolagem**, subindo devagar (+2,2 no primeiro, ~+2,7 no terceiro) e mais barato para arma pesada.
  Cai daí que o **Mirar de hoje está caro demais**: cobra uma ação inteira e entrega o preço de um
  Tick. Falta travar o teto (proposta: 3 Ticks).
- [ ] **K6 · [DECIDIR] A leitura do sinal.** Desenhada na §8: Percepção + Prontidão para o golpe
  físico (o Ocultismo da §5.5 segue para a Arte), leitura grátis para quem tem a mesma arma e
  perícia, e a **finta** comprando 1 Tick de Preparo para mentir sobre o alvo, que dá à arma leve o
  primeiro motivo para comprar Preparo. Fica por último.
- [x] **K15 · A régua P/G/R, decidida (19/08) e recalibrada (20/08).** A ação tem três fases, com
  `P + G + R` igual à Velocidade de hoje e **G sempre 1**: leve 0/1/4 · média 1/1/4 · **haste
  2/1/3** · pesada 2/1/4 · arco (Vel−1)/1/0 · arremesso (Vel−2)/1/1 · Arte (2+nível)/1/0. A guarda
  se refaz no **fim da Recuperação**. As penalidades de Defesa são a **escada** da §14.11
  (20/08): **Preparo −2 · Golpe −4 · Recuperação −2 por golpe dado**, tudo derivado do −2 da
  Guarda sob pressão, mais os −2 por ataque recebido. *(A versão de 19/08, "a ação não custa DV e
  o Golpe custa −6", está registrada e superada na §14.2.)* Preço conhecido da escada: amplitude
  21,0 contra 16,6 de hoje, com a arma leve em 63%; a alternativa R −4 media 15,1 e foi rejeitada
  por princípio (a Recuperação é a penalidade de "já ataquei", que sempre foi −2).
- [x] **K16 · Rajada e empunhadura dupla, decididas (20/08).** **Rajada** (§14.12): atacar de novo
  com a mesma arma é `P→G→G→…→R`, declarada de uma vez; cada golpe além do primeiro custa **−1d6
  acumulativo e +1 Tick de Recuperação**; teto 3 (leve e média) e 2 (haste e pesada); só corpo a
  corpo. Mede ~40% no duelo em todas as classes e corta um quinto a um terço do relógio contra o
  inimigo fraco; a rajada de 3 executa o lacaio surpreso (83 a 97%) e nunca o igual. **Dupla**
  (§14.13): um Tick de Golpe por mão, **−1d6 nas duas**; par de leves no mesmo ciclo, média a
  ciclo +1; Recuperação −4 (dois golpes); segurando a segunda arma sem golpear, o Tick de Golpe
  fica a −2. A dupla ganha da rajada em todas as colunas, que era a exigência. *(A geometria de
  19/08, `P→G→P→G→R` com freio de dado, está registrada e superada nas §14.4/§14.5/§14.11.)*
- [ ] **K20 · [DECIDIR] O que se pode fazer no Preparo e na Recuperação.** A §14.6 do
  `Combate_Tempo.md` tem um primeiro recorte, mas ele foi escrito antes de duas coisas mudarem, e
  precisa de uma passada inteira. O que já está resolvido: **no Preparo você aborta** (perdendo os
  Ticks investidos, e só para mover, desviar ou se interpor, nunca para atacar); **no Golpe não há
  nada a fazer**; **na Recuperação você não desiste, só paga** (a ação fora de hora, uma por ação,
  a Velocidade da ação em dívida e a guarda travada). O que falta decidir:
  - **O Deslocamento livre deixa de ser grátis na Recuperação** (decidido em 20/08). Ele continua
    grátis livre e em Preparo, e na Recuperação custa Ticks, **mais caro do que o desvio de
    emergência da §5.5**, que cobra 1 Tick por metro. Falta o número. Proposta: **2 Ticks por
    metro**, com a ressalva de que a bancada **não sabe medir isso**: o duelo dela não tem
    geometria, então movimento não custa nada lá dentro. Isso desmonta a linha da §2.4 que dizia
    que o Deslocamento livre segue grátis durante qualquer ação.
  - **Testes de ação na Recuperação** (pulo, acrobacia, oferecer ajuda, se interpor) a **−1d6**:
    falta conferir se o degrau é esse mesmo e se vale para todos.
  - **O ataque fora de hora tem de ficar** (medido: tirá-lo dobra a amplitude entre classes, de
    16,0 para 38,2, e joga a arma leve para 74%). Ou seja, "não pode atacar na Recuperação" precisa
    ser lido como "não pode fazer o seu ataque **normal**". Falta escrever isso sem ambiguidade.
  - **Falar, largar item, olhar em volta:** provavelmente livres em qualquer fase, mas nunca foram
    listados.
- [ ] **K17 · [DECIDIR] O arqueiro ficou forte demais.** 63,9% a 100 metros contra 35,8% do sistema
  de hoje, por um motivo estrutural: com `R = 0` ele nunca passa pela fase exposta. Conversa com o
  **K4**, que por sua vez está travado pelo **K13**.
- [ ] **K18 · [DECIDIR] A Técnica Ambidestria ficou sem função.** O que ela faz hoje (Dança da
  Lâmina) é exatamente apagar o dado extra da mão fraca, e isso virou o padrão. Ou ela ganha outro
  benefício, ou a paridade da dupla fica atrás dela e a dupla sem treino continua armadilha
  (22,9% contra 54,0%). §14.4.
- [ ] **K19 · [FAZER] A cadeia foi medida só na arma leve.** Na média e na pesada cada elo custa 2
  e 3 Ticks, e as três curvas de freio não foram varridas ali. Bateria `--so T`.
- [ ] **K21 · [FAZER/DECIDIR] As armas versáteis: a regra, a lista e o preço da forma de duas
  mãos.** Esclarecido em 20/08/2026, e o catálogo diverge da regra em quase tudo.
  - **A regra:** a arma **versátil** pode ser usada com uma mão (Força **×1**) ou com as duas
    (Força **×2**). A exceção segue sendo a haste de estocada, que fere por alcance e não soma o
    dobro. **A espada longa NÃO é versátil: é arma de duas mãos**, a versão grande da espada.
  - **A lista das versáteis:** machado, **espada** (a comum, não a curta nem a longa), maça,
    picareta, lança, **martelo** (o de uma mão), **porrete**, espada serrilhada. As **versões
    grandes** dessas armas são armas de duas mãos.
  - **O que o catálogo tem hoje, e o que falta:** `espada-longa` está como 1 mão + tag `versátil`
    (errado nos dois campos: deve ser 2 mãos, sem a tag); `machado`, `maca`,
    `picareta-de-guerra` e `espada-serrilhada` existem e precisam ganhar a tag; `lanca` existe
    (haste, 2 mãos) e vira versátil sem o ×2; **não existem** `espada`, `martelo` de uma mão e
    `porrete`, nem as versões grandes de machado, maça, picareta e serrilhada (o `montante` e o
    `martelo-de-guerra` já cobrem espada e martelo). Mudar `espada-longa` para 2 mãos mexe na
    ficha (o seletor de empunhadura) e no contrato ficha↔mesa (`equip.ts`); armas novas são só
    adição.
  - **O preço, que é o problema de balanceamento:** a forma de duas mãos como está é upgrade
    grátis. Medido em 20/08: espada longa a 2 mãos vence a forma de 1 mão em **72,9%** dos duelos
    (mesma Velocidade, dado e acerto), e as hipóteses de tag mostram o perigo (espada curta
    hipotética 90,2%; maça hipotética 82,8%: o ×2 vence a Absorção natural contra Impacto).
    Cobrar o Preparo de pesada (P2) devolve pouco (73,0%). Candidatos: Força ×1,5, dado sem
    Margem, ou Velocidade +1. A comparação justa com escudo e segunda arma **depende da K14** (o
    Bloqueio que o motor não vê é o que se sacrifica ao ocupar as duas mãos). As regras da rajada
    (§14.12) e da dupla (§14.13) são consistentes dentro de cada empunhadura; o problema é a base.
- [x] **K22 · Empate erra, decidido (20/08).** Ficou o **`>`** (o total precisa **superar** a
  Defesa ou a Dificuldade; igualar falha), que é o que o capítulo IX, o motor e o modelo de
  dificuldade já usavam. A alternativa `>=` foi medida e **perde nos três tabuleiros**: no
  combate, piora a amplitude entre classes em todos os modelos (hoje 16,2→20,0 · normal+novas
  16,7→19,5 · P/G/R 21,7→29,5), porque o empate-que-vira-acerto é um acerto de Margem 0 e vale
  mais para quem bate forte por golpe; nas manobras, desloca rajada e dupla 4 a 6 pontos para
  cima (a dupla leve iria a 61,7% e exigiria recalibragem); e fora de combate infla a régua de
  Dificuldade que está travada (Média sairia de ~50% para 58 a 67%, e Difícil em 2d6 iria a 42%).
  O que o `>=` teria de bom fica registrado: a âncora de 50% no duelo espelho do lutador padrão.
  Dois subprodutos da análise: (a) **usabilidade do /mestre**: a tabela "Probabilidades das
  jogadas" é `>=` (alcançar X) e a régua de Dificuldade é `>`; vale uma nota na página dizendo
  que ataque contra Defesa D se consulta na linha D+1; (b) **deriva de escala**: a Defesa cresce
  2 por ponto de A+H e a média do ataque só 1,75, então o duelo espelho de guarda cheia cai de
  58% (A+H 4) para 30% (A+H 16) de acerto em qualquer convenção; mascarada pela Pressão em luta
  real (67 a 91%), mas existe e um dia merece olhar próprio.
- [x] **K23 · A Centelha soma ×1 no acerto e nas defesas, decidido (20/08).** Vale o que
  `defesas.md` e `centelha.md` escrevem (**+1 por ponto**, dos dois lados), e não o "+2 por ponto"
  da nota do `combate.md` nem o `×2` que o motor da bancada usa. Medido, com espada longa dos dois
  lados: com **×1**, um tier de Centelha acima dá **31%** de acerto contra 22% do espelho, e o
  degrau é o mesmo em toda a escada (C1 vs C0 = C6 vs C5); com **×2** o mesmo tier dá 40%, e as
  pontas colapsam: **C6 contra C0 acerta 99%** e **C0 contra C6 acerta 0%** (com ×1 são 78% e 1%).
  Como a Centelha vai de 0 a 6 na régua nova, o ×2 transforma dois tiers de diferença em
  impossibilidade matemática, e o mortal deixa de conseguir arranhar o Desperto mesmo com sorte.
  O ×1 mantém a promessa da `centelha.md` ("entre Centelhas iguais o efeito se cancela e o duelo
  joga limpo; contra quem tem menos, vira vantagem líquida") com uma vantagem **legível**: um tier
  vale um degrau de modificador situacional. **A fazer:** corrigir a nota do `combate.md`, alinhar
  o motor (`defesaBase` e a rolagem usam `centelha * 2`) e refazer as tabelas da frente K, que
  foram todas medidas no ×2 (em espelho o efeito se cancela, então a direção dos resultados se
  mantém; os absolutos mudam).
- [ ] **K24 · [DECIDIR] O montante e o martelo pagam duas vezes, e o dano não conserta.** As duas
  armas pesadas de duas mãos têm **acerto 0 e Defesa da arma −2**, o pior dos dois lados (a adaga
  tem +2 e +1: cinco pontos de diferença, ~40 pontos percentuais de acerto). Decidido em 20/08 que
  **acerto e Defesa estão condizentes** com a ficção da arma grande, e que a compensação, se vier,
  vem no **dano**. Medido: não vem. Subir o dano do montante e do martelo desequilibra depressa,
  porque o problema deles não é o mesmo: **o montante já está em 68,2%** (é o segundo fora-de-curva
  do catálogo, com a Alabarda do K11) e **o martelo em 46,5%**. Qualquer aumento uniforme empurra
  os dois: +2 de dano fixo leva a classe pesada de 57,4% para 64,4% e a amplitude de 16,9 para
  26,5; +1 dado leva a 68,7% e 31,8. **O conserto tem de ser por arma, não por classe**, e conversa
  com o K11 (Alabarda), o K21 (versáteis) e o K14 (o Bloqueio que o motor não vê, que é justamente
  o que a arma de duas mãos abre mão). Fica agrupado com eles.
- [x] **K26 · FEITO em 2026-08-21. A iniciativa distribui os Ticks de entrada.** A regra estava
  escrita desde sempre em dois lugares (`derivados.iniciativa` e a §"A linha do tempo" do capítulo
  de Combate, com exemplo) e **a mesa não a aplicava**: `rolarIniciativas` zerava o tick de todo
  mundo, e a primeira rodada inteira acontecia no mesmo instante. O valor rolado só desempatava
  dentro do Tick, que é metade do que ele faz. Agora `ticksDeEntrada` (em `combate-tempo.ts`)
  responde: **o maior no Tick 0, os demais no Tick 1, e mais um Tick a cada seis pontos de atraso**.
  Não é um Tick por ponto, e vale a pena repetir porque a leitura intuitiva é essa: com 12, 11 e 10,
  os dois últimos entram no MESMO Tick 1. Empate no topo entra junto no Tick 0, e a ordem entre eles
  é o desempate do capítulo, que a fila já resolve arrastando.

  **Revisada na mesa no mesmo dia, depois de medida.** A régua final é `Tick = 1 + ⌈atraso ÷ 6⌉`: o
  maior entra **sozinho no Tick 1** (um Tick de frente, que num motor de Tick é vantagem
  permanente), 1 a 6 atrás entram no 2, 7 a 12 no 3, 13 a 18 no 4. Teto garantido no Tick 4, porque
  a iniciativa vai de 2 a 18.

  **O contrapé decai.** A medição achou um buraco: num pool de PC (3d6 +5) contra Defesa 12, −1d6
  leva a chance de acertar de 84% para 42%, e **−2d6 a leva a zero**, porque 1d6+5 não supera 12 —
  erro matemático, não dificuldade. A saída é o tempo: **o contrapé cai 1d6 por Tick que passa**.
  Quem entrou no Tick 3 com −2d6 bate no 3 por −2d6, no 4 por −1d6 ou no 5 inteiro.

  E ele é do **relógio**, não da ação: agir não o apaga. Antes apagava, e por isso a jogada ótima
  era comprar a limpeza gastando um Tick em qualquer bobagem. Agora atravessa a declaração, o
  abortar e o deslocamento pago. Continua **mostrado e não descontado**; o menu da peça e o painel
  do turno ganharam o gesto de **esperar um Tick**, com o antes e o depois no rótulo. Vale nas duas
  telas; no rastreador, só quando a cena está começando (a caixa "Reiniciar" com "zerar os Ticks"),
  porque rolar iniciativa no meio de uma luta é outra coisa.

- [ ] **K27 · [DECIDIR] O Golpe sai depois, e a mesa ainda resolve na declaração.** Estudo completo
  em **`Golpe_Tardio.md`** (21/08), sem nenhuma mudança feita. O buraco: a régua diz que o golpe cai
  em `T + Preparo`, a tela desenha isso (fita, anel de Golpe, linha do tempo), e o motor resolve
  tudo no Tick da declaração — rolagem, dano e morte. O Preparo cobra Defesa e não adia nada.

  **Medido** com o motor que calibrou a régua (`lib-tempo.mjs`, que resolve no Tick do Golpe): num
  duelo a diferença é ~1%, mas numa refrega 3×3 com arma de Preparo **um em cada treze golpes
  declarados nunca chega a cair** (7,3% com espada, 8,1% com martelo) porque o alvo caiu antes. O
  equilíbrio não desaba (a vitória mexe 1 ponto), mas somem quatro coisas: a **interrupção** (a §4
  inteira), o alvo poder **sair de baixo**, a **ficção** (o registro promete um golpe que já
  aconteceu) e a **leitura do sinal** com a finta (§8).

  O estudo propõe três saídas, e recomenda a **C · rolar na declaração e aplicar no Golpe**: o
  jogador descreve e rola quando fala (o ritmo de mesa não muda), o resultado fica na agenda, e o
  Grid confere contra a Defesa do alvo **no instante do golpe**. É o que a Arte já faz desde 21/08 e
  o que a folha da ação já faz pela metade. A alternativa fiel (resolver tudo no Tick do Golpe)
  **dobra os toques por ação**, desfazendo a frente de automação, e separa o dado da descrição.

  **DECIDIDO em 21/08: a mesa escolheu o pacote fiel** (§9 do estudo, dez decisões). Resolver
  **tudo no Tick do Golpe**, com a **Firula** descrita ali, o **mestre confirmando cada golpe**, o
  golpe cujo alvo caiu **redirecionando** (corpo a corpo só pega quem está no alcance do atacante,
  um hexágono ou dois na haste; arremesso e tiro pegam qualquer um no alcance), **dano simultâneo**
  no mesmo Tick, **nada de Defesa na caixa de declaração**, o **contrapé congelado na declaração** e
  a **Guarda sob pressão cobrada no Golpe**.

  **Falta uma:** quanto custa o atacante **acompanhar** o alvo que se moveu (§10 do estudo). A
  conversa é maior do que parece porque o **Deslocamento livre** ((Des + Atl) ÷ 2, uns 3 m) é de
  graça durante qualquer ação e vale **três vezes o alcance da espada**: sem acompanhar, um em cada
  três golpes pesados erraria de graça. E é a única decisão que a bancada não sabe responder,
  porque o robô do simulador **nunca foge**: precisa de bateria nova.

  **A primeira fatia entrou em 23/08, atrás de uma chave da mesa que nasce DESLIGADA**
  (`combate.golpeAdiado`, no painel "Como o tempo passa"). Feito: a folha da ação partida em duas
  (a caixa da declaração não mostra número nenhum; a folha reabre no Tick do Golpe com a guarda
  daquele instante e a manobra travada), o campo `aResolver` na `acao`, a **Pressão movida** da
  declaração para o Tick do Golpe, o relógio que **para de pular** Ticks com golpe agendado
  (`relogio()` e `grupoDaVez()`), a faixa dos golpes no ar abaixo da fila, e o gesto que morre com
  quem cai no meio do Preparo. Detalhe na **§17** do `Golpe_Tardio.md`.

  **Falta a fatia 2:** alvo que morre (escolher outro no alcance, e só no alcance se a arma for de
  corpo a corpo), alvo que sai de baixo (o atacante acompanha com o próprio passo, ou o Preparo é
  interrompido/redirecionado), e a **Firula no Tick do Golpe**. Até lá o mestre resolve esses três
  à mão. E falta a **prova de mesa**: a chave existe justamente porque a regra só se aprova jogando,
  e se reprovar um commit apaga o caminho novo e ela junto.

- [ ] **K30 · [FAZER] A CAIXA QUE ABRE NO TICK EM QUE A ARTE SAI** · *é a mesma mecânica do K27,
  e o nome existe para ninguém resolver as duas separadas.*

  **A régua está cumprida para 27 dos 140 Efeitos e não para 19.** Em 04/09 a Arte passou a resolver
  no último Tick também quando toca um corpo (o Dardo, a marca, a Corrente). Três caminhos ficaram
  de fora, e não por esquecimento: **`dissipar` (1 Efeito), `invocar` (6) e `deslocar` (12)**.

  **O que impede.** Os 27 que foram consertados resolvem sozinhos: a varredura de efeitos chega no
  Tick certo e aplica o que estava escrito na linha. Estes três **precisam de uma pergunta ao vivo
  no instante em que a Arte sai**:

  | Efeito | o que a caixa pergunta no Tick da saída |
  |---|---|
  | **dissipar** | qual magia alheia desfazer, e a lista mudou nos Ticks da montagem |
  | **invocar** | o bloco do servo (Vida, Defesa, Absorção), que a mesa confere antes de pôr em campo |
  | **deslocar** | para onde vai o empurrão, e de onde: o alvo pode ter andado |

  Adiar o EFEITO delas é adiar a PERGUNTA, e pergunta adiada é exatamente o que a folha do golpe
  adiado faz (`aResolver` na `acao`, a faixa dos golpes no ar, a folha que reabre no Tick do Golpe).
  **A mecânica existe e não serve Arte:** ela é construída em cima de `acao.golpes`, de alvo único e
  de uma folha que fala de acerto e dano. A Arte não tem golpe, pode não ter alvo, e a caixa dela é
  outra em cada uma das três formas.

  **O que isto trava, e é o motivo do nome.** Quem for fazer o K27 fatia 2 vai construir a caixa
  reaberta. Quem for fazer isto aqui vai construir a caixa reaberta. **Se as duas forem construídas
  separadas, a mesa fica com dois mecanismos de "pergunta agendada" que se comportam diferente no
  mesmo Tick**, e o Simultâneo é justamente onde isso aparece: um golpe e uma Arte caindo no mesmo
  Tick têm de perguntar na mesma ordem, uma vez cada, e a ordem tem de ser a da fila.

  **O caminho, quando for a hora:** generalizar o `aResolver` de "golpes a resolver" para
  **"decisões agendadas"**, com um tipo por decisão (golpe · dissipar · invocar · deslocar), e a
  varredura do Tick abrindo as caixas na ordem da fila. O K27 vira o primeiro caso dela e não o
  dono dela.

  **Enquanto não for feito:** as três resolvem na declaração, como sempre resolveram, e está
  anotado no código (`conjurar`, em `artes-grid-mesa.ts`). Não é regressão, é a metade que faltava
  desde 21/08.

- [~] **K28 · Deslocamento: sete decisões tomadas em 21/08, a oitava (código) já saiu; falta só a
  ausência.** A varredura (§11 do `Golpe_Tardio.md`) achou **seis regras de andar** espalhadas por
  quatro lugares, mais dois modificadores esquecidos (a armadura tira metade da Penalidade em
  metros; baixa estatura) e uma ausência que segue **sem decisão registrada em lugar nenhum**:
  **não há zona de controle nem ataque de oportunidade**. Continua `[~]` por causa só dela; não é
  claro se a ausência é escolha de design ou lacuna.

  **Decidido:** o Grid **não cobra** o passo grátis, só **mostra ao arrastar**; o passo é gasto **no
  instante em que se age** (não é esquiva guardada); ele **tira do alcance** de quem já declarou, e
  o atacante **acompanha com o próprio passo**; a Recuperação **baixou de 2 para 1 Tick por metro**;
  "baixa estatura" corta **só a Corrida e os Saltos**; e os três preços de andar fora da vez ficam
  escritos separados.

  **Feito:** o número novo no `regras.json` (o Grid já lia de lá, então o deslocamento pago passou a
  custar metade sem tocar em código), o texto das três raças, e as menções ao 2 nos documentos e no
  motor.

  **[x] FEITO em 2026-08-28** (achado na auditoria de memória de 08/09, ver `[[deslocamento-bestiario]]`):
  a decisão 6 saiu. As 309 criaturas ganharam as três velocidades em
  `src/data/deslocamento-bestiario.json` (satélite gerado, mesmo padrão do B1), fator ft ÷ 10
  calibrado nas raças básicas; 270 vieram da fonte (D&D 3.5/Pathfinder) e 39 por tabela. K28 fecha
  inteiro.

- [ ] **K25 · [DECIDIR] A Defesa da arma e a do escudo somam, e o escudeiro vira parede.** A
  `defesas.md` escreve "**+ defesa da arma/escudo**", no singular, mas a ficha **soma as duas**
  (`ficha-engine.ts:1468`, `Bloqueio soma a Defesa das armas/escudos do conjunto EM USO`). Com
  espada longa (+1) e heater (+3) dá **+4** sobre a Defesa nua 21, e o acerto contra guarda cheia
  desaba: espada longa **6%**, adaga 10%, montante **3%** (com Centelha ×1, pool 5d6). Contra
  guarda comida pela Pressão (−4) o mesmo par vai a 40%, ou seja: **o combate contra escudeiro
  funciona, mas depende inteiramente da erosão da guarda**, e a primeira troca de golpes é quase
  sempre nada. Pode ser design deliberado ("furar escudeiro é projeto, não golpe"), mas hoje é
  acidente de implementação. Três saídas: (a) ler a `defesas.md` ao pé da letra e valer **a melhor
  das duas**, não a soma (a mais barata, e o texto já sugere); (b) rever o `bloqCaC` dos escudos
  grandes (+3 num sistema de degraus de ±2 é uma vantagem e meia, e o preço dela é só no ataque);
  (c) manter e assumir. Levantado em 20/08 ao medir o acerto com os bônus reais de catálogo, junto
  do **K22** (onde ficou registrado por que a convenção `>` não é o que conserta isto: o `>=`
  levaria o mesmo caso de 6% para 10%, e o ganho dele **encolhe** justamente nas Defesas altas).
- [ ] **K12 · [DECIDIR] Como se conta um teste de Virtude.** Teste de Virtude **não soma Atributo
  nem Habilidade**, só a Virtude, e por isso a régua de pool de hoje (`[(A+H)/2]d6`, com +2 se
  ímpar) não se aplica a ele. Duas formas na mesa: **pool** (a Virtude vira dados pela mesma
  escada, `1d6 · 1d6+2 · 2d6 ...`) ou **soma única**, mais perto da Iniciativa (`1d6 + Virtude`).
  A escolha muda a variância e o teto: o pool cresce em média e em dispersão, a soma única mantém
  a dispersão fixa e faz a Virtude pesar linearmente. Aberto em **19/08/2026**, e vira urgente
  porque o combate passou a pedir teste de Virtude (continuar o golpe ignorando um perigo visível
  é teste de **Bravura**, §K).
- [ ] **K13 · [CONSERTAR] A Guarda sob pressão está em dobro no motor.** `scripts/lib-tempo.mjs`
  faz `guard += R.pressao` (linha 225) e desconta `R.pressao * guard` (linha 153): com
  `pressao: 2`, cada ataque feito ou recebido tira **4** de Defesa, e não os **−2** que o capítulo
  IX (`combate.md:233`) e o comentário da própria linha 54 escrevem. O parâmetro entra ao
  quadrado. Consequência medida: a curva do **K4 inverte**. Com −4, o Preparo do arco custa win
  rate (a 45 m, P=0 dá 28,3% e P=2 dá 13,4%, que é a §7 publicada); com −2, o Preparo **paga** (a
  45 m, P=0 dá 11,7% e P=5 dá 54,0%). **O K4 não pode ser decidido antes disto.**
- [ ] **K14 · [DECIDIR] A bancada só mede o canto "todo mundo esquiva".** O motor tem **uma**
  Defesa e ignora a `defesaArma`, que pelo `defesas.md:67` entra **só no Bloqueio**
  (`Bloqueio = (Des + Bloqueio)×2 + Centelha + Esp + defesa da arma`). Todo número de equilíbrio
  entre classes, deste documento e do `Combate_Tempo.md`, é portanto o extremo em que ninguém
  apara. Ligando a `defesaArma` para todos (o extremo oposto, em que todos aparam), o sistema de
  **hoje** vai de 16,7 para **50,5 pontos** de amplitude entre classes, com a haste em 77,5% e a
  arma pesada de duas mãos em 27,0% (lança +2 e alabarda +2 contra montante −2 e martelo −2). A
  verdade está entre os dois cantos e depende do roteamento das Defesas pelo "como". Enquanto o
  motor não souber escolher entre Esquiva e Bloqueio, **nenhum ajuste de catálogo (K11) deve ser
  feito com base nele**.
- [ ] **K5 · [FAZER] A implementação: os DOIS sistemas.** Decidido em 20/08: o jogo tem o
  sistema normal (o de hoje) e o P/G/R como opção **por mesa**, com **um só conjunto de regras**
  escrito em moeda comum, e a dupla de média é a única regra com calibragem diferente por sistema
  (mesma Velocidade no normal, ciclo +1 no P/G/R). O plano em seis fases está na **§15 do
  `Combate_Tempo.md`**, e cinco delas fecharam em 20/08:

  - **1 motor · 2 relatório · 3 bancada** — feitas. O motor tem os quatro presets e a bancada
    ganhou o seletor de sistema, cinco cartões e duas baterias.
  - **5 `regras.json`** — feita. O bloco `combate` tem os dois sistemas, os dois modos de
    marcação, a régua P/G/R por classe, a da Arte, a escada, a rajada com os tetos, a dupla e o
    deslocamento pago.
  - **6 ficha e mesa** — feita. `src/lib/combate-tempo.ts` (o motor da tela, travado por
    `scripts/test-combate-tempo.mjs`), a **migração 27** (`mesas.combate` e `combatentes.acao`,
    com a view escondendo arma e alvo do jogador), o painel **⏱** do mestre nas duas telas, o selo
    de fase e a fita no rastreador, a manobra no diálogo de ação, e o anel de Golpe mais a fita
    miúda no Grid. Na ficha, a linha "No tempo" mostra o P/G/R da arma.
  - **4 capítulo IX** — a única que falta, e espera **K12** (teste de Virtude) e **K17**
    (arqueiro).

  **O abortar entrou em 21/08.** Botão **✋** que só acende para quem está em Preparo (no card, no
  painel do turno e no menu da peça no Grid), com a conta na caixa antes de confirmar. Preço
  fechado: fica livre no Tick de agora, os Ticks investidos vão para o lixo, e o movimento custa
  **1 Tick por metro**, o do desvio de emergência da §5.5. Mora em `regras.json` (`combate.abortar`)
  e está travado no `test-combate-tempo.mjs`.

  **O ataque do tabuleiro entrou em 21/08** (§15.5, migração 28). Atacar pelo Grid passou a
  declarar a ação, empurrar o relógio pelo ciclo inteiro e cobrar a Guarda sob pressão no alvo,
  acertando ou errando; a caixa do alvo mostra a Defesa **com a escada** e traz a manobra
  filtrada. Vale para o jogador também, pela `jogador_declara`, que exige ser dono da peça que
  age. Junto veio o conserto de que o Grid só digeria fichas para o mestre, e por isso a régua do
  jogador caía no atalho `leve/5`.

  **O deslocamento pago entrou em 21/08** (K20). Arrastar uma peça que está na **Recuperação** cobra
  2 Ticks por metro, sozinho: o Grid é o único que sabe quantos metros foram, o número sobe da peça
  e a linha entra no registro. Não cobra de quem está livre, porque a regra não decidiu esse caso, e
  não cobra no Preparo, que tem o abortar. Vale para o jogador também, pela `jogador_declara`.

  **A ação fora de hora entrou em 05/09** (§15.4, fase 2), com a dívida e o espelho. Item `⏱ Agir
  fora da vez` no menu da peça, só na **Recuperação**: no Preparo o que cabe é o ✋ e no Golpe não
  cabe nada, e o menu ensina isso pelo item que está lá. A caixa parte a conta em duas · o que
  sobrava do ciclo (que vira **dívida**) e a Velocidade da ação nova (que é o preço de sempre dela)
  · e traz quem está montando o gesto, para o **espelho**: interromper atrasa o gesto do alvo em
  tantos Ticks quantos o interruptor pagou. A dívida passa a aparecer na linha da fila, em toda
  fase, sem pedir gesto nenhum.

  **O que isso fechou eram três coisas paradas ao mesmo tempo:** `podeAgirForaDeHora` e
  `custoDeReagir` estavam escritas, exportadas e testadas, e os únicos chamadores eram os testes;
  o campo `Acao.divida` ("Ticks que já foram empurrados para o futuro") era zerado pelo `declarar`
  e nunca escrito nem lido; e a caixa do ✋, aberta numa peça em Recuperação, imprimia a frase do
  motor dizendo que "o que cabe aqui é pagar: uma ação fora de hora" · **a tela nomeava a ação que
  ela não tinha botão para fazer.**

  Custo em gestos, na moeda do `custo-tela.mjs` e **no papel do mestre**: agir fora de hora 3,
  interrompendo alguém 4, ver a dívida 0. **Mestre só**, pelo mesmo motivo do abortar: o jogador
  escreve em `combatentes` pelas funções `jogador_*` da migração 22, e não há uma para isto.

  **O que a mesa ainda não faz**, da mesma §15.4: o abortar e o fora de hora **do lado do
  jogador**, que pedem outra função `jogador_*`.

  **A Arte entrou em 21/08** (§15.6). Conjurar declara a ação com a anatomia própria da Arte
  (Preparo = ciclo − 1, Golpe no ÚLTIMO Tick, Recuperação 0), empurra o relógio pela Velocidade
  que a caixa mostra, e o efeito passa a **nascer no Tick do Golpe**: enquanto o relógio não o
  alcança ele não queima ninguém e não é obstáculo, e a mancha aparece tracejada **só para o
  mestre**. Ação livre (Velocidade 0) segue sem gastar a vez. A Mana já era descontada antes.

  Falta à Arte somar **Guarda sob pressão** em quem ela pega: para a área a §5.4 diz que não há
  Esquiva a opor (se a Pressão cabe é decisão de regra), e para a Arte **mirada** deveria caber,
  mas o assistente ainda não separa uma da outra.

  **A leitura mudou de lugar em 21/08** (§15.7 e §15.8). A fila virou escada (relógio grande,
  degraus `Agora`/`em N ticks`, fase por extenso) e depois **deitou**: saiu da coluna estreita da
  direita e virou uma tira horizontal colada no topo do tabuleiro, que é onde a mesa inteira olha.
  A **linha do tempo** (a régua de Ticks) continua existindo, mas **nasce desligada** e liga no ▤
  da barra: é leitura extra, e quem não a usa não devia pagar a altura dela. Só no Grid, por ora;
  o rastreador de combate ainda tem a coluna vertical antiga.

## L. Simulação em massa e as oito regras novas do Simultâneo

Frente aberta em **2026-09-02**. Quatro documentos em `docs/simulacao/`, e o índice deles está no
cabeçalho do `02`:

| | O que é |
|---|---|
| `00-diagnostico.md` | o motor antes de qualquer decisão: o que é puro, o que não é, onde mora cada peça |
| `01-diagnostico-carga.md` | as 14 paradas que pedem um humano, os conflitos entre capítulo, JSON e motor, e as medições |
| `02-projeto-harness.md` | **o canônico**: as decisões e a especificação do que implementar |
| `03-respostas.md` | as contradições do 02 resolvidas, os 14 invariantes do harness, e as medições novas |
| `04-prontidao.md` | prontidão: se cada métrica tem dado, se cada eixo é separável, os riscos e o que falta decidir |
| `05-fechamento.md` | o fechamento: a ordem corrigida (a instrumentação vem antes), as dez dependências de prova sem instrumento, e a grade recontada |
| `06-etapa-0.md` | a instrumentação, feita: a semente, o caminho do driver, o despejo por Tick e a branch congelada. E o que o espelho de inércia já prova com ela |
| `07-caminho-curto.md` | **a mudança de prioridade de 02/09**: o alvo passou a ser rodar milhares de batalhas completas para achar onde a automação trava. O inventário do que falta, a ordem reaberta, a primeira bateria de doze células e o plano de execução |
| `08-espelho-e-bateria.md` | **o espelho de motor, feito**: as seis divergências que ele achou entre o laço e a mesa, o achado de produção que saiu de brinde, a leitura corrigida (a partição de quatro estados, o custo de tela real, a banda varrida), a bateria refeita e as decisões D16 a D28 |
| `09-bateria-grande.md` | **a bateria grande, rodada**: as duas fases da batalha, a grade real (88 das 112 células oficiais não rodam sem bandeira), a sensibilidade ao limiar de fuga, os seis alarmes de bateria ineficaz e as decisões D29 a D36 |

**Duas restrições que saíram da Etapa 0 e valem para quem escrever o harness:** o paralelismo é por
**processo** e nunca por linha de execução (a fonte de acaso é um `let` de módulo, e duas batalhas no
mesmo processo dividem a sequência **em silêncio**, sem erro e sem teste vermelho), e o motor recebe a
própria fonte por parâmetro em vez de usar o global. E a proposta dos cinco fluxos por rótulo da `02`
§2.4 **caiu**: fica um fluxo, e os deltas de E5 são não pareados.

**A regra da frente:** decisão anotada dentro de um relatório não vale; o que vale vem do chat, e o
relatório cita. Quando o `Combate_Simultaneo.md` discordar do `02`, vale o `02`.

- [ ] **L1 · [FAZER] As oito regras novas do Simultâneo (N1 a N8), na mesa.** Especificação item a
  item em `02` §0.6.1, com o estado de hoje (arquivo e linha), o estado novo, os cuidados e a prova
  de cada um. **N1** muda `decideEmValeDepois` de 1 para 0 e devolve o período entre golpes ao ciclo
  da arma; **N2** faz a guarda de declaração olhar `acao.desde` em vez do Tick do golpe; **N3** deixa
  sair o golpe de quem caiu no mesmo Tick; **N4** dá ao Tick uma ordem de declaração (cadeia
  crescente, iniciativa na frente durante a entrada); **N5** parte o Tick em declaração, início e
  resolução, com a resolução na ordem inversa; **N6** congela num retrato as penalidades nascidas
  dentro do Tick; **N7 e N8** abrem a máscara da migração 27 (o gesto corporal é público, a pontaria
  não) e põem um rastro no tabuleiro. Os seis primeiros cabem em quatro funções.
- [ ] **L2 · [FAZER] As 15 bandeiras de regra**, num bloco novo do `regras.json` lido pela mesa e
  pelo harness (`02` §0.7 e §0.6.1 item 11). São as 8 de regra publicada que o motor não aplica
  (Margem, gate de Perfuração, porte no acerto, Bloqueio com escudo, modo secundário, teto ±6, e as
  duas da Cura), as 6 do núcleo do Tick e o `porRodada`. **A Couraça de Porte saiu da lista**: ela já
  é aplicada em tempo de geração (`COURACA`, `gen-bestiario.mjs:37-45`) e já está somada na `absorcao`
  criatura, então uma bandeira de tempo de execução a somaria duas vezes. **Dois testes
  congelam hoje o estado errado** e precisam ser reescritos no mesmo commit:
  `test-contrato.mjs:136` (`eq(R.defesa, 16`) trava a Defesa com o Bloqueio inútil, e L149 trava
  `F.defBloqueio = 10`, que ninguém lê.
- [ ] **L3 · [FAZER] O `ate` das condições passa a ser lido**, e elas expiram sozinhas. Hoje o campo
  é escrito por `porCondicao` e **não há um leitor em todo o `src/`**.
- [ ] **L4 · [FAZER] A migração 30**: a máscara ao avesso, com `acao.mirado` marcando o que é
  pontaria. O `mov.alvo` deixa de vazar por acidente e passa a ser visível de propósito.
- [x] **L5 · [FEITA em 02/09, commit `ce5486f`] A semente do `d6`, e a instrumentação em volta dela.** É a **Etapa 0** da
  ordem (`02` §0.6.1), e vem antes de tudo, inclusive das bandeiras: sem semente a prova de que uma
  bandeira desligada é inerte compara ruído. Junto vêm a **branch congelada** (que deixa de ser
  criável assim que a primeira bandeira entra), o caminho do driver até a semente, e o despejo por
  Tick do que a folha calculou. `rolagem.ts:15` é `Math.random` e é a única fonte de acaso
  do combate. Ganha ponto de injeção, e `mesa-ficha.ts:133` e `artes-grid.ts:1342` precisam do mesmo
  tratamento. É o que permite o teste-espelho comparar as rolagens.
- [x] **L6 · [O ESQUELETO FEITO em 02/09] O harness.** `scripts/sim/` com o laço do Tick, o elenco
  tirado da régua, o log com classe de parada, quatro invariantes, a repartição em processos e o
  agregador. A **bateria mínima** de doze células rodou: 6.000 batalhas em 53 s, e **59,9% das
  paradas são classe iii**. Detalhe e decisões em `07-caminho-curto.md` §10. **Falta o espelho de
  motor**, que é quem prova a ordem das operações dentro do Tick. O texto original abaixo.
- [ ] ~~**L6 · [DEPOIS] O harness.**~~ Grade oficial de **112 células e 56.000 batalhas** (`02`
  §0.10.1), um piloto de 2.000 em **cada uma das duas âncoras** com a regra de decisão escrita antes
  de rodar, e 15 invariantes que abortam a batalha (`03` §3.1). O elenco tem PCs **e** criaturas do
  bestiário (D10), e cada bandeira é medida na célula em que ela morde. Só depois de L1 a L5.
- [x] **L9 · [FEITO em 02/09] O encontro carimba o perfil de bandeiras.** Migração **29**
  (`supabase/migracao-29.sql`, **falta rodar no SQL Editor**), `src/lib/bandeiras.ts` com as quinze e
  o carimbo, e a linha na tela do Grid que só aparece quando o carimbo difere do site, clicável para
  recarimbar. O texto original abaixo, para o registro do porquê.
- [ ] ~~**L9 · [PRIMEIRO, junto com a Etapa 1] O encontro carimba o perfil de bandeiras.**~~ Uma coluna
  `encontros.perfil jsonb`, escrita **uma vez** na criação do encontro e lida por ele dali em
  diante. Sem ela, um deploy troca o `regras.json` debaixo de um encontro aberto e a Defesa de uma
  peça muda entre dois Ticks da mesma cena. É o quarto sinal do risco **F0** (`04-prontidao.md`), o
  único que não é erro de programação, e o único que **bloqueia a Etapa 1**: é o item **1.0** da
  ordem, antes da primeira bandeira. Três propriedades: **zero gravação por Tick** (uma escrita na
  criação, mais uma por recarimbagem), **visível** na tela do encontro, dizendo quando difere do
  perfil de produção, e **recarimbável** pelo mestre numa ação explícita. Sem as duas últimas o
  problema só troca de sinal: o chão congela debaixo do encontro em vez de mudar, e ninguém vê.
- [ ] **L10 · [ANTES DE LER O RESULTADO] Duas coisas que não bloqueiam o começo e bloqueiam a
  leitura.** A **tabela de custo de tela** não tem linha para o gesto que a regra ⊕ acrescentou
  (escolher o modo de dano é um clique), e sem ela a bandeira `modo2` sai medindo dano e não custa
  gesto nenhum. E o **`aid`** precisa nascer nos **dois** caminhos de código: os PCs passam por
  `resumoCombatePC`, as criaturas trazem o bloco pronto do `monsters-mesa.json` e não passam por
  lá. Riscos **F3** e **F2**.
- [x] **L11 · [FEITO em 02/09] O golpe da rajada não pagava a penalidade dele.**
  `rolarAcerto` (`grid.astro:8703`) sempre usa `linhas[0]`, e desde `f8459e6` (23/08) a folha é
  aberta **uma por golpe** por `resolverGolpeNoAr`. Resultado: os golpes 2 e 3 de uma rajada saem
  com penalidade **zero** em vez de −1 e −2, e a rajada, cujo preço inteiro é essa penalidade, sai
  de graça. Está no **único** caminho que o Simultâneo usa (`adiaGolpe` é sempre true lá), as duas
  políticas das âncoras declaram rajada, e o gatilho do Agressivo ("a Vida do alvo é maior que a
  minha") concentra o desconto em quem está perdendo. **E o espelho já está condenado**: o
  `resolverGolpe` de `lance.ts` aplica `penDados[golpeIndice]`, que é a regra. Detalhe em
  `07-caminho-curto.md` §8.1. **E ele contamina a métrica PRINCIPAL, não só o balanço**: a rajada é a
  única manobra que produz várias folhas por ação, então de graça a política a escolhe mais, e as
  paradas por Tick sobem pelo bug.
- [x] **L12 · [FEITO em 02/09, no mesmo commit do L11] O `aid` é da ação, e o índice são dois campos.** Hoje o
  `aid` nasce na folha, então dois golpes da mesma ação recebem identificadores diferentes, o que
  quebra o contrato do D2. Ele tem de nascer na declaração e viver em `acao`. E `golpeIndice` tem
  de virar **`golpeDaAgenda`** (qual golpe é) e **`penDadosUsado`** (qual entrada a mesa leu):
  separados, a diferença entre os dois **mede** o L11 lance a lance. Falta também `tickDoGolpe` no
  registro. Os dois campos FICAM depois do conserto: a igualdade
  `golpeDaAgenda === penDadosUsado` vira invariante do harness e volta a falar se alguém
  reintroduzir a divergência, e a asserção entra no mesmo commit do conserto, senão o campo nasce sem
  quem o leia. **A RECOLETA É PARTE DO MESMO COMMIT**: o conserto muda o resultado de todo lance de
  rajada com índice > 0, e entre o conserto e a recoleta o `validate` fica vermelho. A janela não
  pode atravessar commits, porque um oráculo que mente na direção do bug é pior que nenhum. **E a
  recoleta tem de FORÇAR rajada de três**: a fixture atual não tem uma única rajada, e a dupla não
  expõe o defeito nem em princípio, porque o `penDados` dela é `(−1, −1)`, dois valores iguais.
  As metas completas e a **disciplina de cobertura** que as gera (varredura de campo constante mais
  lista de permitidos, no lugar de meta inventada uma a uma) estão na **§9**, com o critério de
  pronto dos passos 4 a 10 escrito antes. `07-caminho-curto.md` §8.2, §8.3, §9 e §5.1.
- [ ] **L8 · [FAZER] Fundir as duas especificações de política.** A `02` §0.4 P4 tinha a lista
  ordenada e a §0.47 tinha as regras de leitura, e nenhuma era completa. Fundidas em 02/09, com as
  regras de leitura marcadas ⊙ (é o que o eixo E9 desliga) e a regra de modo marcada ⊕. Enquanto
  não estavam fundidas, o E9 era inerte em toda célula de política Agressiva.
- [x] **L13 · [FEITO 03/09] O carimbo da fila deixa de ser estável quando a peça anda.** O terceiro
  critério de `ordemDaFila` é `chegada`, que na mesa é `arena_tokens.movido_em`, e mover um token
  o reescreve com a hora de agora. Numa perseguição a fila inteira se reordena a cada avanço: quem
  andou vai para o fim do seu grupo de Tick, e a ordem de declaração e de resolução muda junto. O
  campo existe justamente para a ordem NÃO dançar. Achado pelo espelho de motor em 03/09
  (`08` §1.2). **RESOLVIDO em 03/09 (D40):** quem desempata é a INICIATIVA ROLADA, que a cena já
  rola por peça (o ⚄ da barra), e o `movido_em` saiu do comparador; o id fica só como piso
  determinístico. O harness copia o mesmo.
- [x] **L14 · [FEITO 03/09] A fuga automática usa uma régua e o ataque automático usa outra.** Em
  `decidirAutomaticas`, a fuga anda com `MODOS_MOV.corrida.porTick` (o 6 da tabela, igual para
  todo mundo) e a declaração de ataque anda com `passoNoModo`, que sai da ficha ou do bestiário. O
  mesmo robô, no mesmo Tick, mede a perna da peça de dois jeitos. Ninguém decidiu isso; saiu de
  dois caminhos escritos em momentos diferentes. **RESOLVIDO em 03/09 (D39):** a fuga passa a usar
  `passoNoModo(c, 'corrida')`, a perna da peça, como a declaração de ataque já usava.
- [x] **L15 · [FEITO 03/09] O golpe que cai em quem já caiu abre folha, rola e cobra Pressão.**
  `resolverGolpeNoAr` acha o caído em `COMBS` como qualquer outro. É defensável (o braço já estava
  no ar) e é uma parada de mestre por golpe, num momento em que a cena já acabou para aquele alvo.
  **RESOLVIDO em 03/09 (D38), com regra nova em `regras.json`
  (`combate.simultaneo.golpeNoCaido`):** o gesto não evapora, ele REDIRECIONA para um inimigo de pé
  dentro do alcance da arma. Quem caiu num Tick anterior foi visto cair e dá para cancelar; quem
  caiu neste Tick não, porque o Tick é simultâneo, e aí só resta redirecionar. Sem inimigo ao
  alcance, o gesto se perde e ninguém é perguntado. A peça em modo automático redireciona sozinha.
- [ ] **L16 · [OBSERVAÇÃO] A política automática do produto termina a cena em debandada.** Em
  cinco das seis células coprimas da bateria de 03/09, o fim dominante é `fuga-consumada`, com 71%
  a 100%. O robô foge com a Vida baixa e sai do mapa, e é assim que a maioria das batalhas acaba.
  Não é defeito do harness: é a `decisaoAutomatica` que a mesa executa hoje. Vale como observação
  sobre o robô, e **não** como afirmação sobre o sistema de combate.
- [x] **L17 · [FEITO 03/09] `folhaDaAcao` resolvia `null` por um `close` alheio.** `dlg.close()`
  enfileira o evento em vez de disparar na hora; com duas folhas em sequência dentro do mesmo
  ciclo, o `close` da primeira chegava com a segunda já aberta e a derrubava como se o mestre
  tivesse desistido. O golpe ficava no ar e o cartão vencido reabria com dados novos. Uma mão
  humana quase não produz a sequência; o espelho produzia, e a mesma cena com a mesma semente
  resolvia o mesmo golpe até dez vezes numa volta e uma na seguinte.
- [x] **L18 · [FEITO 03/09] A fuga automática nascia sem `aid`.** Era a única ação da mesa sem
  identificador de declaração (D2), e por isso o caminho da criatura em modo automático não tinha
  a que ligar a re-projeção do trajeto dela.

- [x] **L19 · [FEITO 03/09] A ficha escrevia o tipo de dano errado em CINCO das dez armas
  de mais de um modo.** `resumoCombatePC` (`combate-resumo.ts:58`) ordena os modos por
  `MODO_ORDEM` (impacto 0, corte 1, perfurante 2) e pega o PRIMEIRO, ignorando a marca
  `principal: true` do catálogo. O tipo vai para a expressão de dano (`2d6 +10 (I)`), e a mesa o
  lê dali (`tipoDeDano(ra.dano)`) para decidir **qual Absorção o alvo aplica**.

  | arma | principal no catálogo | o que a ficha escrevia |
  |---|---|---|
  | Montante · Machado · Machado de Arremesso | corte | **impacto** |
  | Picareta de Guerra | perfurante | **impacto** |
  | Adaga | perfurante | **corte** |

  **A Alabarda NÃO estava errada**, ao contrário do que a primeira redação desta entrada dizia:
  ela marca os três modos como `principal`, e o primeiro da ordem de exibição já era o que o
  `find` devolve. Cinco armas, e não seis.

  Isso muda o que acontece em jogo: uma alabarda que bate em vez de cortar erra a Absorção da
  placa, o gate de Perfuração e a resistência do bicho. **Achado em 03/09 pela bateria grande**
  (o Montanteiro atacou de impacto as 10.800 batalhas), e NÃO consertado, porque a pergunta é de
  regra: qual das duas manda, o `principal: true` do catálogo ou a ordem de exibição do
  `MODO_ORDEM`? **RESOLVIDO em 03/09 (D37): manda o `principal` do catálogo.** O conserto está em
  `combate-resumo.ts`, o `dados_hash` mudou e a bateria grande rodou de novo do zero.

  ### MUDANÇA DE BALANÇO · 03/09/2026 · o dano de produção mudou

  **Isto não é conserto de exibição.** A sigla da expressão de dano escolhe a CATEGORIA DE
  ABSORÇÃO do alvo, e as três não valem a mesma coisa: só o Impacto recebe a Absorção natural do
  Vigor (`regras.json`, `dano.soakNatural`). Trocar a sigla troca contra o que a arma bate. **As
  mesas que estão rodando vão sentir**, e esta tabela existe para que daqui a três meses ninguém
  atribua a diferença a outra coisa.

  Dano líquido MÉDIO por golpe que acerta, exato e não simulado (`node scripts/dano-por-tipo.mjs`,
  que enumera a distribuição de `Nd6 + fixo`). Alvos: sem armadura (Absorção 7/3/3), Escudeiro de
  malha (8/9/4) e Montanteiro de placa completa (12/11/7).

  | arma | dano | de → para | nu | malha | placa |
  |---|---|---|---:|---:|---:|
  | Machado | 1d6 +5 | Impacto → Corte | 1,67 → **5,50** (+230%) | 1,00 → **0,50** (−50%) | 0 → 0 |
  | Picareta de Guerra | 1d6 +5 | Impacto → Perfuração | 1,67 → **5,50** (+230%) | 1,00 → **4,50** (+350%) | 0 → 1,67 |
  | Machado de Arremesso | 1d6 +7 | Impacto → Corte | 3,50 → **7,50** (+114%) | 2,50 → **1,67** (−33%) | 0,17 → 0,50 |
  | Alabarda (D45) | 1d6 +12 | Impacto → Corte | 8,50 → **12,50** (+47%) | 7,50 → **6,50** (−13%) | 3,50 → 4,50 (+29%) |
  | Montante | 2d6 +10 | Impacto → Corte | 10,00 → **14,00** (+40%) | 9,00 → **8,00** (−11%) | 5,00 → 6,00 (+20%) |
  | Adaga | 1d6 +3 | Corte → Perfuração | 3,50 → 3,50 (0) | 0,00 → **2,50** | 0,00 → 0,50 |

  **Saldo: doze dos dezoito pares arma × alvo sobem** (média +2,51 de dano por golpe), quatro
  descem (média −0,83) e dois não mudam. **O sinal depende do alvo**: contra alvo sem armadura as
  quatro que foram para Corte sobem muito (o Impacto absorve Vigor + Centelha, o Corte só
  Centelha), e contra malha três delas DESCEM, porque a malha protege mais contra corte (9) que
  contra impacto (8).

  **Quem mais muda de vida:** quem empunha Picareta contra alvo de malha (o dano líquido médio
  quadruplica) e quem empunha Adaga contra qualquer armadura (sai de zero). Quem PERDE: Machado e
  Machado de Arremesso contra malha.

  **A Adaga não zerou, subiu.** O medo era o gate de Perfuração, e ele não morde ninguém hoje: é
  o **L22** abaixo.

  O oráculo dos lances foi recoletado e saiu **byte a byte igual** (a bancada escolhe o tipo por
  construção, sem passar por `resumoCombatePC`), e o `personagens.resumo` do banco, que guarda a
  expressão velha, **não afeta o combate**: `resumoDe` recalcula ao vivo para peça de PC, e a aba
  Grupo regrava o cache sozinha a cada visita.
- [x] **L21 · [FEITO 03/09] O golpe no caído dependia da ordem do laço.** A regra escrita em
  03/09 (D38) mandava olhar se o alvo está no chão AGORA, e "agora" dentro de um Tick depende de
  qual peça o motor processou primeiro: de duas peças que se derrubam no mesmo Tick, o atacante de
  quem caiu primeiro redirecionava e o outro não. Ordem de laço vazando para dentro de um sistema
  que se chama simultâneo. **Consertado (D41)** com o retrato da abertura do Tick como fonte
  única: quem estava de pé quando o Tick abriu está de pé para todos os golpes dele. Conferido no
  `npm run caido` (a quarta cena) e no `npm run espelho`.
- [x] **L22 · [FEITO em 06/09/2026] O gate de Perfuração estava na régua e não estava no motor.**
  `gatePerfuracaoAbre` (`src/lib/calc.ts`) passou a ser chamada em `folhaDaAcao`
  (`src/pages/mesa/grid.astro`), em `resvalaGate`, calculado uma vez e aplicado nos três pontos
  que decidem dano. As 9 armaduras conferidas contra `armas-e-armaduras.md:109-119` batem número
  a número com `armaduras.json`: a Adaga (Perfuração 0) resvalando contra 7 das 9 é a régua, não
  inflação de catálogo. Só na mesa, não no harness (ver **L25**). Detalhe: `docs/simulacao/CATALOGO.md`.
- [ ] **L25 · [DÍVIDA DE PRODUTO, NÃO DE INSTRUMENTO] O item 1.0 da Etapa 1 foi dado como feito
  e não está feito.** Ele entregou o carimbo, a migração e a tela, e **não entregou a única coisa
  que fazia o carimbo valer: alguém que leia o perfil na hora de aplicar a regra.**

  O perfil é gravado, viaja no encontro, aparece na tela, é comparável e é recarimbável. E é lido
  em **um** lugar do código de produção, `grid.astro:9002` (`perfil: { ...REGRAS_CENA }`), onde ele é copiado para dentro da
  entrada do lance, para o oráculo. `entrada.perfil` **não é consultado em lugar nenhum**: nem em
  `resolverGolpe`, nem em `quase-acerto.ts`, nem em `calc.ts`, nem no harness. Nenhuma das quinze
  bandeiras faz o motor tomar um caminho diferente.

  **Situação em 06/09/2026: `porte` e `gate` deixaram de ser duas delas, as duas primeiras
  das quinze.** `REGRAS_CENA.porte`/`REGRAS_CENA.gate` passaram a ser lidos diretamente em
  `folhaDaAcao` (não via `entrada.perfil` do lance, que continua sem leitor), somando
  `modificadorPorte` em `ajAtq.flat` e aplicando `gatePerfuracaoAbre` (as duas em `calc.ts`)
  em `resvalaGate`, calculado uma vez e usado nos dois lugares de `folhaDaAcao` que decidem
  dano (`contaDoLance`, o oráculo/tela, e `fim`, que é o que `aplicarDano` de fato aplica —
  achado nesta mesma rodada, ver o caso novo do `CATALOGO.md`). É só na mesa: o harness
  continua sem ler nenhuma das quinze, porque a segunda bateria não acontece (o motivo,
  acima). As outras treze continuam exatamente como este parágrafo descreve.

  **A infraestrutura da comparação de regras existe inteira e não está conectada ao motor.**

  **E o desenho de 112 células pressupunha um mecanismo que não existe.** As 68 que existem para
  medir bandeiras dariam **zero por dois motivos indistinguíveis**: ou a regra não morde naquela
  cena (o zero legítimo, que é informação), ou a regra não roda em cena nenhuma (o zero vazio, que
  não é). Os dois saem iguais no CSV.

  **Ninguém percebeu em sete rodadas de documento**, e o motivo é mecânico: **todos os relatórios
  rodaram com tudo desligado, e tudo desligado é o único estado em que a ausência do mecanismo é
  invisível.** Com o perfil todo `false`, "a bandeira está desligada" e "a bandeira não é lida"
  dão o mesmo comportamento, o mesmo número e o mesmo log. O primeiro `true` teria acusado na
  primeira batalha.

  **O que mais foi desenhado em cima dessa premissa** (`02` §0.6.1, a tabela nova): as células
  hospedeiras, a referência única do F5, a soma de aditividade e as três células da mediana. As
  quatro continuam corretas como desenho e inertes como medida. **O contador de ocasiões por
  bandeira é o único que sobrevive intacto**, e vira o instrumento que detecta o problema: ele
  daria zero, e o zero dele é inequívoco.

  **O que NÃO cai junto**, e é o que a frente produziu de sólido: as métricas de carga, a partição
  de quatro estados do Tick e os quinze invariantes, os três termos da conclusão, os 11,4% do Tick
  morto e o resultado do limiar de fuga. Nada disso depende de bandeira nenhuma.

  **E NENHUMA BANDEIRA ENTRA EM PRODUÇÃO ANTES DISTO.** Hoje elas não fazem nada, o que é
  seguro: o jogo que a mesa joga é coerente, ainda que não seja o do documento. **Meio caminho
  seria pior que os dois extremos**, porque uma bandeira ligada no motor sem as outras, ou ligada
  sem contador de ocasião, produz um jogo que não é nem o de hoje nem o do projeto, e ninguém
  sabe qual dos dois está lendo.

  **A ordem, para cada uma das quinze:** ligar a chamada no motor, provar que ela morde com um
  contador de ocasião, e só então medir. É o mesmo mecanismo que matou o eixo E4 (D31) antes de
  ele virar linha de relatório. Isto reparte o **L1** em quinze tarefas de motor, e **nenhuma
  medição de bandeira vale antes**.

  **DECIDIDO EM 06/09/2026: a segunda bateria (a grade de 112 células) não acontece, e o `L25`
  deixa de ser pré-requisito de bateria.** O levantamento das quinze (`docs/simulacao/ESTADO.md`,
  seção "A FRENTE DE SIMULAÇÃO ESTÁ ENCERRADA") achou nove de regra a escrever e não seis de
  ligação como a tabela do `02` §0.6.1 item 11 registrava — três delas (`modo2`, `curaSemArea`,
  `curaDivide`) não têm mecanismo nenhum por trás para ligar, ao contrário do que aquela tabela
  descrevia — e das nove, seis (`n1` a `n6`) são o núcleo do Tick inteiro, sem nenhuma rodando
  isolada. Comparar regras nesse estado custaria mais do que a frente de medição inteira produziu,
  respondendo uma pergunta que ninguém fez. **O `L25` passa a ser o que sempre foi por baixo:
  quinze regras publicadas que a mesa não joga**, dívida de produto e não de instrumento, e a
  fila de qual liga primeiro é decisão de jogo, não de medição.
- [ ] **L34 · A FASE 2 · O TABULEIRO COMO EXPERIÊNCIA COMPLETA DE COMBATE** · *a lista das seis,
  escrita em 05/09/2026. Ela vinha sendo cobrada por número desde 04/09 e não estava em documento
  nenhum: o furo era só esse, e é o que esta entrada conserta.*

  | | item | estado |
  |---|---|---|
  | 1 | **condição no tabuleiro** | **FEITO** · `912bc68` |
  | 2 | **agir fora de hora** | **FEITO** · `f699ae2` |
  | 3 | **dívida de Ticks** | **FEITO** · `f699ae2`, junto com o 2 |
  | 4 | **mudar efeito posto** | **FEITO** · e a decisão do custo está escrita na seção 4 |
  | 5 | **Investida** | **FEITO no motor** · número decidido em 05/09, e o −6 saiu |
  | 6 | **Interpor e desviar** | **IMPLEMENTADO E APROVADO em 07/09/2026** (rodada 15) · e2e das duas portas feito nas rodadas 16 e 17 (`fbe69ce`, `d3b2840`) · pendência da Revisora fechada, ver seção 6 |

  **A FASE 2 FICOU FECHADA EM CINCO DE SEIS POR SEMANAS**, e o sexto não esperava código: esperava
  regra que não existia. O levantamento mostrou que o capítulo publicado **não tem uma linha** sobre
  interpor, desviar nem abortar, então construir o Interpor não era implementar régua existente,
  era **escrever régua nova** · decisão de mesa, tomada em 07/09/2026 (seção 6, abaixo). O sexto
  item deixa de ser exceção.

  **NENHUMA FASE TERMINA EM DOCUMENTO**, e é a regra que rege esta lista inteira: toda linha acima
  só vira FEITO com coisa funcionando na mesa e asserção que cai se ela parar de funcionar.

  ### 1 · A condição no tabuleiro · FEITA em 04/09/2026

  Era a única das seis que era mesmo **só tela**, e o mecanismo existia inteiro:

  - o catálogo, 55 verbetes com número, em `src/data/condicoes.json`;
  - a soma: `export function somarCondicoes` (`src/lib/mesa-core.ts:178`);
  - a leitura na folha do lance: `const cd = somarCondicoes` (`grid.astro:8675`);
  - o desconto chegando à Defesa: `alvo.condicoesDefesa` (`src/lib/lance.ts:159`);
  - a coluna: `add column if not exists condicoes` (`supabase/migracao-11.sql:25`);
  - e o RPC do jogador aceitando a chave: `condicoes` (`supabase/migracao-22.sql:125`).

  **Só a tela morava na outra aba.**

  O diálogo saiu da aba Combate e virou três peças compartilhadas (`src/lib/mesa-condicoes.ts`,
  `src/components/CondDlg.astro`, e o estilo no `MesaCab.astro`). O que entrou no tabuleiro:

  - o item no menu da peça: `condicoes', '◈ Condições'` (`grid.astro:7102`);
  - o selo de ícones na lista lateral, que custa zero gestos: `const selo` (`grid.astro:6282`);
  - e a aba Combate chamando o mesmo módulo: `function abrirCondicoes` (`combate.astro:1750`), para
    não haver duas cópias divergindo no primeiro conserto que só uma receber.

  Asserção em par, em `cenaCondicaoAMao` (`scripts/test-grid.mjs`): a mesma folha do golpe aberta
  pelo mesmo caminho três vezes (sem a condição, com ela, e depois de tirada), cobrando o ESTADO da
  peça e não a linha do registro. Custo em gestos, no papel do mestre: aplicar 3, tirar 3, ver 0.

  ### 2 e 3 · Agir fora de hora e a dívida de Ticks · FEITAS em 05/09/2026

  **Uma entrega só, porque eram a mesma coisa vista de dois lados**, e três mecanismos estavam
  parados ao mesmo tempo: `custoDeReagir` escrita, exportada e testada com o teste como único
  chamador; o campo `Acao.divida` ("Ticks que já foram empurrados para o futuro") zerado pelo
  `declarar` e nunca escrito nem lido; e a caixa do `✋ Abortar`, aberta numa peça em Recuperação,
  imprimindo a frase do próprio motor sobre "pagar: uma ação fora de hora" · **a tela nomeava a
  ação que não tinha botão.** O detalhe está na §15.4, acima.

  ### 4 · Mudar efeito posto · FEITO em 05/09/2026, e a decisão do custo vem escrita

  **O estado em que estava:** um efeito no chão tinha, na coluna, **exatamente um controle**, e ele
  era o destrutivo · o `✕` com o título "Desfazer este efeito agora", com o painel ligando handler
  só em `[data-fim]` (`src/lib/artes-grid-mesa.ts:481`). Mudar duração, alvos, posição ou ângulo
  do que já estava posto só dava apagando e conjurando de novo.

  **A DECISÃO DE CUSTO, e ela era a única coisa a decidir dentro do item.** A pergunta posta foi:
  mudar um efeito posto deve custar alguma coisa, já que hoje custa a Mana outra vez? A resposta é
  que **a Mana nunca foi preço de mudar · ela é o troco de não haver como mudar**. A cobrança é
  automática, sai da reserva do personagem e mora no `finally` da `conjurar`:
  `await ctx.gastarMana` (`src/lib/artes-grid-mesa.ts:811`). Então o cone que saiu 15° torto registrava DUAS conjurações
  para um personagem que conjurou UMA. Isso não é preço decidido: é o registro mentindo sobre a
  ficção. E o inverso também vale · se o personagem de fato reapontou a Arte, o débito está certo,
  porque a régua não tem "reapontar por menos que uma conjuração".

  Daí a linha que o mecanismo não atravessa, e ela é a regra inteira da entrega:

  > **Onde a mesa corrige o próprio registro, não cobra. Onde a mesa muda o que aconteceu na
  > ficção, cobra.** Corrigir é de graça porque **não é ficção**: é a mesa arrumando o que ela mesma
  > escreveu. Mudar o que a ficção fez custa reconjurar. Não existe terceira coisa.

  **A frase fica escrita junto da regra de propósito** (no cabeçalho da `mudarEfeito` e como regra
  de construção no `docs/simulacao/02-projeto-harness.md`), porque **ela é o que impede o terceiro
  preço de virar pedido daqui a um mês**: sem ela, "a correção é de graça" fica sem chão e o
  reapontar barato volta como facilidade de tela. Com ela, o terceiro preço tem de se justificar
  como ficção, e aí é regra nova, com número.

  **E ela é o teste do resto do Grid**, e não só deste item: a pergunta que faz a qualquer botão
  novo é *isto arruma o que a mesa escreveu, ou muda o que o personagem fez?* Corta para os dois
  lados · proíbe cobrar por bookkeeping e proíbe dar de graça o que a ficção fez, que é a razão de
  esta correção não mexer em tamanho.

  Por isso a correção **não toca em Mana nem em Tempo**, registra "corrigiu … (sem custo)" em vez
  de "conjurou", e **não mexe em tamanho**: `recolocarFigura` (`src/lib/artes-grid.ts`) move e gira
  preservando raio, comprimento, largura, abertura e curvatura, que saíram do plano comprado · e o
  plano não sobrevive à gravação, porque o banco guarda a figura pronta e não as escolhas que a
  montaram.

  **O que entrou:** o `✎` ao lado do `✕` no painel dos efeitos vivos, só para o mestre (a RLS de
  `arena_efeitos` dá escrita a `eh_mestre`); a caixa `abrirMudarEfeito` com nome, turnos restantes,
  oculto, nota e os alvos; e o reapontar no mapa, que reusa a mesma mira da conjuração e recalcula
  os `hexes` a partir da figura movida · sem isso a mancha se desenharia no lugar novo e morderia
  no antigo. A condição que o efeito pôs segue os alvos quando eles mudam, que é o buraco que a
  `encerrarEfeito` já fechava do outro lado.

  **A asserção que vale é a da IDENTIDADE DA LINHA**, e não a do número na tela: a duração certa
  passaria com a implementação antiga (apagar e inserir), só que com um `id` novo, uma Mana a menos
  e duas linhas no registro. Por isso `cenaCorrigirEfeito` (`scripts/test-grid.mjs`) procura a linha
  pelo `id`. Mais o par negativo, que é o jogador sem botão nenhum, e 12 asserções de geometria no
  `test-artes-grid.mjs` sobre o que `recolocarFigura` **não** faz.

  **E ELA SAIU ERRADA NA PRIMEIRA ESCRITA, pelo modo previsível** · *achado da revisora, consertado
  em 05/09/2026.* **Busca por posição.** As três leituras usavam ordenações diferentes que só
  coincidiam por a cena ter uma linha: `arena_efeitos[0]` antes, `arena_efeitos[0]` depois, e o
  primeiro `[data-edt]` do DOM para o clique. Com dois efeitos, o teste compararia linhas diferentes
  e não notaria nada · o mesmo defeito que o par da condição tinha antes do `data-cond`.

  **As três coisas que a asserção precisa ter, e agora tem:**

  - **o `id` é capturado ANTES da operação**, e do próprio botão (`btn.dataset.edt`);
  - **a comparação é contra aquele `id` guardado**, passado para dentro do `evaluate`;
  - **a linha é achada por chave** (`linhas.find((r) => r.id === alvoId)`) dos dois lados, e o botão
    é clicado por `[data-edt="<id>"]`.

  **E a cena passou a ter TRÊS efeitos (`&sombra=1`), com o alvo sendo o SEGUNDO**, para que uma
  busca posicional erre de verdade a cada rodada em vez de coincidir. O teste imprime a prova:
  *"o alvo do teste NAO e a primeira linha da tabela (alvo `ef-sombra-meia`, primeira `ef-brasa`)"*.

  **Falsificada**, trocando a implementação por apagar-e-reinserir: as três asserções da identidade
  ficaram vermelhas. E o que o experimento mostrou de quebra é por que ela é a que vale · **a
  contagem de linhas continuou `3→3` e o registro continuou dizendo "corrigiu"**. As outras duas
  asserções passariam com a linha destruída.

  **✅ E NÃO HÁ TERCEIRO PREÇO** · decidido em 05/09/2026, com a frase acima como motivo. Dois
  bastam, e a razão de a régua ser defensável é essa: o de graça não é ficção, o inteiro é.

  E o RPC do jogador continua sem caminho: `jogador_muda_efeito` (`supabase/migracao-22.sql:217`)
  aceita **duas chaves só**, `mordidos` e `ate_tick`, e por ele passa hoje apenas a marca de mordida
  que a varredura grava: `{ mordidos: base }` (`src/lib/artes-grid-mesa.ts:1686`, dentro de
  `marcarMordido` · a escrita migrou de `grid.astro` para cá em 05/09/2026, no conserto da L46).
  Um `✎` de jogador precisaria de migração nova, e não está pedido.

  ### 5 · A Investida · FEITA NO MOTOR em 05/09/2026, e ela não era trabalho de tela

  **O estado em que ela estava, e é o que o levantamento da revisora achou:** a régua estava
  escrita com número em três lugares que concordam · `combate.movimento.investida` no
  `regras.json` (`danoDados: 1`, `defesaExtra: -2`), a tabela do capítulo
  (`src/content/chapters/combate.md`, § Investida: "Preparo investindo · velocidade de Corrida por
  Tick · −2 **a mais** · **+1d6**") e o catálogo de condições (`investindo`, Defesa −2). **E o
  motor não a conhecia:** `ModoMov` era `'andar' | 'batalha' | 'corrida'` e a palavra "investida"
  aparecia UMA vez no arquivo inteiro, dentro de um comentário sobre travessia. Pôr um botão antes
  do modo existir seria a promessa sem mecanismo em pessoa.

  **O que foi construído**, na ordem que o próprio levantamento mandava (modo no motor, depois
  tela):

  - `ModoMov` ganhou `'investida'`, com o passo da Corrida · investir não é uma quarta velocidade,
    é gastar o Preparo correndo;
  - `defesaPerdida` passou a cobrar o `defesaExtra` **no Preparo e só nele**, que é o que a régua
    diz com estas palavras ("−2 além do que o Preparo já cobra");
  - o portão da travessia passou a perguntar `modoCorre(modo)` em vez de `modo !== 'corrida'`. A
    nota da regra sempre disse "só para quem declarou Corrida **ou Investida**", e o `!==` literal
    deixava a Investida de fora · o que não fazia diferença nenhuma enquanto o modo não existia, e
    passaria a fazer, calado, no dia em que passasse a existir;
  - o `+1d6` virou o campo `danoDados` da `EntradaLance`, lido do modo declarado. Separado do
    `ajusteDados`, que é do ACERTO: são duas rolagens e a régua mexe numa sem mexer na outra;
  - `Acao.mov` foi DECLARADO na interface. Ele já andava no jsonb desde o simultâneo (o Grid
    escrevia `acao.mov` e o banco guardava) e o tipo não o conhecia.

  A tela veio de graça, e é o sinal de que o levantamento estava certo sobre onde era o trabalho:
  a caixa de declaração de ataque monta o seletor a partir de `MODOS_MOV`, então a Investida
  apareceu lá sozinha. **A caixa de deslocamento solto filtra ela de fora**, de propósito: um
  deslocamento sem ataque não tem Preparo para gastar, e oferecê-la ali prometeria o +1d6 de um
  golpe que ninguém declarou.

  **✅ O NÚMERO FOI DECIDIDO EM 05/09/2026: a Investida vale −4, e o que se decidiu foi a RAZÃO.**
  Quem investe **gasta a guarda da Corrida**, e não a do Preparo mais um degrau · investir é uma
  forma de aproximação, da mesma família, e quem corre para cima do outro perde guarda pelo mesmo
  motivo. O total não mudou (os dois jeitos de contar davam −4); mudou de onde ele sai. O motor
  passou a ler `combate.movimento.corrida.defesa` **direto** na fase de Preparo, então se a Corrida
  um dia custar outro número a Investida acompanha sozinha, que é o que "mesma família" quer dizer.

  **O −6 saiu.** A `travessiaNota` foi reescrita sem ele. O critério é o da procedência: as três
  fontes do −4 saíram de um commit só, que é a decisão; o −6 entrou seis dias depois, sozinho, e
  **nenhuma linha de código o lia**. Número que nunca foi executado não teve chance de estar certo
  nem errado · é rascunho.

  **E AS TRÊS SÃO TRÊS ESCRITAS INDEPENDENTES, NÃO ECOS**, que é a pergunta que a revisora fez e a
  resposta pior das duas. Nenhum gerador liga as três: `condicoes.json` só é lido (por
  `gen-grid-artes.mjs` e pelo `validate-data.mjs`), o `combate.md` não tem gerador nenhum, e o
  campo `"fonte": "combate · movimento"` da condição, que sempre apontou para a régua, **nunca foi
  lido por ninguém**. Elas concordavam porque foram digitadas na mesma sentada. Escrever a mesma
  regra em três lugares é o próximo defeito esperando, e o que ele produziria é conhecido: mexer no
  `defesaExtra` deixaria a tabela do capítulo e a nota da condição dizendo o número velho, **em
  silêncio**, que é a forma exata do comentário que envelhece.

  **O QUE PRENDE AS TRÊS AGORA**, porque dizer não bastava:

  - no `validate-data.mjs`, um bloco que confere os três contra o `regras.json` · o número da
    condição, os números na **nota** dela, os números na linha "Preparo investindo" da tabela do
    capítulo, e a proibição do −6 voltar para a `travessiaNota`. Confere **presença do número**, não
    o texto: a redação é livre, o número não é;
  - no `test-combate-tempo.mjs`, a trava aritmética: `escada.preparo + investida.defesaExtra` tem de
    dar `corrida.defesa`. É ela que amarra as duas maneiras de escrever o mesmo número, agora que o
    motor lê uma e os textos escrevem a outra;
  - **os quatro casos foram falsificados um a um**, quebrando cada arquivo e conferindo que o portão
    cai, com a árvore restaurada no fim.

  **AS QUATRO FONTES, lado a lado** · *levantamento de 05/09/2026, feito antes de qualquer
  conserto e mantido aqui porque é o que justifica a decisão.*

  | | onde | o que diz | commit | quem lê |
  |---|---|---|---|---|
  | A | `regras.json:2407` · `combate.movimento.investida.defesaExtra` | `-2` | `0f191fe` · 22/08 | **o motor**, em `defesaPerdida` |
  | B | `combate.md:231` · a tabela do capítulo | "−2 **a mais**" (o exemplo da 233 fecha em −4) | `0f191fe` · 22/08 | ninguém · é texto |
  | C | `condicoes.json:61` · condição `investindo` | `"defesa": -2` | `0f191fe` · 22/08 | **o motor**, por `somarCondicoes`, quando o mestre a liga à mão |
  | D | `regras.json:2335` · `travessiaNota` | "Defesa **−4 correndo, −6 investindo**" | `891ee7d` · 28/08 | **ninguém** |

  1. **NÃO SÃO QUATRO DECISÕES: SÃO DUAS.** A, B e C saíram do MESMO commit · `0f191fe`, "Corrida
     e Investida: o que cada jeito de andar cobra", 58 inserções, três arquivos, uma sentada. É
     **uma decisão escrita à mão em três lugares** (não ecos: nenhum gerador as liga). A D é escrita separada, seis
     dias depois, dentro de uma nota que existe para justificar OUTRA regra (o portão da
     travessia), com o número aparecendo como argumento e não como régua · e nenhum arquivo de
     `src/` ou `scripts/` a lê.
  2. **E A DIVERGÊNCIA NÃO É ONDE PARECIA.** As quatro concordam que o extra da Investida é −2.
     Elas discordam **do que ele se soma**: A, B e C somam ao −2 do Preparo (dá −4); a D soma ao
     −4 da Corrida (dá −6). A pergunta que decide não é "−4 ou −6", é **investir gasta a guarda do
     Preparo ou a da Corrida?** · quem investe está correndo de fato. O motor foi construído com
     as três que concordam.
  3. **A DUPLA COBRANÇA DO −2 É DE OUTRO FEITIO, e é pior.** Não é texto discordando: são **dois
     mecanismos cobrando**, e eles se somam sem se conhecer, porque a `defesaEfetiva` empilha
     `condicoesDefesa` e `defesaPerdida` como duas parcelas independentes
     (`return alvo.defesaBase`, `src/lib/lance.ts:159`). **RESOLVIDA no mesmo dia**, e a seção
     própria conta como: **L37**. O número passou a morar só na condição, e o tabuleiro a alimenta.

  ### 6 · Interpor e desviar · RÉGUA FECHADA em 07/09/2026, pronta para a Executora

  **A alcançabilidade responde o contrário do de sempre aqui:** o caminho existe e é curto (botão
  direito → `✋ Abortar`, 2 passos), a caixa já tem os três rádios
  (`const SAIDAS`, `src/lib/mesa-tempo-ui.ts:287`), e o que falta é **o sistema do outro lado da
  caixa**. Escolher "interpor" mudava só o verbo da frase do registro
  (`const verbo`, `src/lib/mesa-tempo-ui.ts:418`), e a saída escolhida era descartada pelo Grid, que
  gravava só a ação limpa, sem guardar qual golpe ela cobria (o estado ANTES da rodada que fechou
  esta seção, mantido aqui porque é ele que explica a decisão). **IMPLEMENTADO nessa mesma rodada,
  as duas portas:** a do Preparo exige escolher qual golpe no ar a interposição cobre, em
  `abortarGesto` (`grid.astro:6164`), e grava isso em `acao: nova` (`grid.astro:6175`); a da
  Recuperação reusa o mesmo candidato, em `candidatosParaInterpor` (`grid.astro:6256`), e o preço
  sai de `custoInterporRecuperacao` (`src/lib/mesa-tempo-ui.ts:556`), travado no campo de
  Velocidade em vez de digitado. As duas portas gravam a cobertura quando há um golpe escolhido.

  **O CAPÍTULO NÃO TEM UMA LINHA**, e é o primeiro fato do levantamento: `interpor`, `desviar` e
  **`abortar`** não aparecem em `src/content/chapters/` nenhuma vez. O Simultâneo dessa parte vive
  inteiro fora do livro publicado.

  **E DE ONDE SAIU O ABORTAR, que é a pergunta que isso levanta:** de `cfb22fa`, 21/08/2026,
  "Combate: abortar o gesto que ainda nao saiu". Onze arquivos · o `regras.json`, o motor
  (`combate-tempo.ts`), as duas telas (`grid.astro` e `combate.astro`), a caixa
  (`mesa-tempo-ui.ts`), o `MesaCab.astro`, o mock, dois testes e o `Combate_Tempo.md`. **E
  `src/content/chapters/` não está na lista.** A régua tem uma decisão inteira, com número
  (`ticksPorMetro: 1`), com três saídas nomeadas e com tela de pé, que **o livro nunca registrou**.

  Isso muda a conversa do Interpor de duas maneiras. A primeira: ele não seria o primeiro · há
  precedente de decidir no `regras.json` e publicar depois, e o Abortar está em produção assim há
  quinze dias. A segunda, que é a que importa: **o Interpor não é implementar régua existente, é
  escrever régua nova**, e a lista abaixo é o que falta escrever, não o que falta programar.

  **O QUE A RÉGUA TEM**, e é menos do que parece:

  - `src/data/regras.json:2499` · `combate.abortar`, com `"fase": "preparo"`, `ticksPorMetro: 1`
    (`:2502`) e `para: ["mover", "desviar", "interpor"]` (`:2504`) · a interposição é uma das três
    saídas do abortar, no Preparo, e o preço é o do deslocamento;
  - o **catálogo de ações fora de hora** do `Combate_Tempo.md` §4.3 (tabela na linha 294):
    "**Interpor-se entre o golpe e um aliado · a distância em metros, mínimo 2**". É o único número
    escrito para o Interpor, e é um PREÇO EM TICKS;
  - `Combate_Tempo.md:814`: na Recuperação, os testes que envolvem ação (e "se interpor" está na
    lista) são a **−1d6**;
  - a ORDEM, em `docs/simulacao/02-projeto-harness.md:1152`: "a interposição resolve antes do golpe
    contra o qual ela se interpõe";
  - e a descrição da tela, que não é régua: "entra na frente de alguém e leva o golpe no lugar
    dele".

  **O QUE FALTA PARA VIRAR MECANISMO**, e a resposta curta é: a régua diz **o que acontece** e
  **quanto custa em Ticks**, e não diz **como se resolve**. Falta:

  1. **quem leva o dano, e por qual conta.** "Leva o golpe no lugar dele" é descrição de tela.
     Não há linha dizendo se o golpe troca de alvo, se o acerto é recomparado contra a Defesa do
     interpositor (que é outra Defesa, outra Absorção e outra armadura), ou se o dano passa
     inteiro. As três dão jogos diferentes;
  2. **se há teste, contra o quê, e o que acontece ao falhar.** O §4.3 dá um preço em Ticks e a
     linha 814 dá um −1d6 para "testes que envolvem ação". As duas se tocam e não se juntam: não
     há qual teste, nem contra que Dificuldade, nem o que sobra de quem falha (o golpe passa? ele
     gastou os Ticks à toa? os dois levam?);
  3. **o alcance.** "A distância em metros, mínimo 2" é o PREÇO, e não um teto. Nada diz até onde
     dá para se interpor, nem se é preciso terminar adjacente ao aliado ou dentro da linha do
     golpe · o Grid tem geometria para as duas coisas, e a régua não pede nenhuma;
  4. **o que o escudo faz**, se é que faz;
  5. **a duração.** Um golpe, todos os golpes daquele Tick, ou a agenda inteira do atacante;
  6. **e a reconciliação dos dois preços**, que é a que ninguém tinha visto: a interposição do
     ABORTAR (Preparo) custa 1 Tick por metro, e a do CATÁLOGO fora de hora (Recuperação) custa "a
     distância em metros, mínimo 2". **São a mesma ação com dois preços, ou duas ações com o mesmo
     nome?**

  **E o DESVIAR está no mesmo estado, por outro motivo:** ele é uma das três saídas escritas, e na
  mesa faz exatamente o que "mover" faz (metros × 1 Tick). A descrição diz "sai da linha do golpe e
  recompõe a guarda", mas não há número que separe desviar de mover, nem regra que diga o que
  "sair da linha" compra. Hoje a diferença entre os dois rádios é **só o verbo do registro**.

  **DECIDIDO em 07/09/2026, item 1 (quem leva o dano): O DANO JÁ ROLADO PASSA INTEIRO, E A
  ABSORÇÃO É DE QUEM SE INTERPÔS.** O acerto e o dano já resolvidos contra o alvo original se
  mantêm (nenhum novo teste de acerto), só o alvo físico do golpe muda para o interpositor; o
  que se aplica sobre esse dano é a Absorção de QUEM INTERPÔS, e não a do alvo original — se a
  Absorção também fosse a do alvo original, seria dano transferido e não interposição, e não é
  isso. Rejeitada a opção de recomparar o acerto contra a Defesa do interpositor: reusar o código
  de resolução não é reusar a regra, e um teste novo que hoje não existe faria o interpositor ter
  direito a uma chance de o golpe simplesmente não valer, o que ninguém escreveu. **Alerta para
  quem construir:** se aparecer um caso em que isto produz absurdo (interpositor que não poderia
  ter sido alcançado pelo golpe original, por alcance ou geometria), parar e escalar antes de
  seguir — não é para resolver sozinho na implementação.

  **DECIDIDO em 07/09/2026, item 2 (teste): NENHUM TESTE DEDICADO.** Pagando os Ticks e estando
  dentro do alcance (item 3, abaixo), a interposição acontece — determinística, mesmo regime de
  "Avançar para fechar distância" e "Levantar-se do chão" no mesmo catálogo (`Combate_Tempo.md`
  §4.3), nenhuma das duas tem teste. O −1d6 da Recuperação (`:812`) continua valendo como
  penalidade geral sobre testes feitos ali, não como gate de sucesso da interposição em si.

  **DECIDIDO em 07/09/2026, item 5 (duração): UM GOLPE SÓ, O QUE A DISPAROU.** Consistente com
  toda defesa física do sistema resolvendo por golpe individual (`defesas.md:67`) e com a ordem
  já escrita, "a interposição resolve antes do golpe" no singular
  (`docs/simulacao/02-projeto-harness.md:1152`). **Com requisito de tela, parte da decisão e não
  sugestão:** ao declarar a interposição, a tela tem de dizer contra qual golpe ela vale; se
  houver segundo golpe no mesmo Tick não coberto, ele aparece como não coberto — nunca em
  silêncio. "Me interpus" sem essa linha lê como proteção da cena inteira, e não é.

  **ITEM 3 (alcance), PARCIALMENTE DECIDIDO em 07/09/2026 — TETO = ALCANCE DA ARMA ORIGINAL,
  MEDIDO DO AGRESSOR, PARA CORPO A CORPO.** Não inventa número novo (reusa a régua de Alcance que
  já existe) e, para corpo a corpo, "só quem já está adjacente ao agressor" é a régua dizendo a
  verdade sobre o que interpor contra uma espada exige.

  **MAS ISTO NÃO FECHA O CASO À DISTÂNCIA, e a conferência pedida confirma a suspeita: não existe
  "linha do golpe" em lugar nenhum do combate mundano.** A das Artes usa `Math.hypot` entre dois pontos (`src/lib/artes-grid-mesa.ts:829`).
  A do ataque comum recebe a distância já pronta, num parâmetro chamado `metros` (`src/lib/alcance.ts:61`).
  Quem a chama já calculou essa distância antes, com a variável `dist` (`src/pages/mesa/grid.astro:8795`).
  As duas medem a mesma coisa: a distância entre um ponto e outro, nunca se um terceiro ponto está
  NA RETA entre os dois. Um arco de Alcance 30 m mediria "dentro do alcance" para qualquer peça a
  até 30 m do
  atacante — inclusive atrás dele, ou a 20 m do aliado que a flecha mirava. **Só existe geometria
  de reta no jogo dentro das Artes com `forma: "linha"` (`hexesDaFigura`), um subsistema
  separado do ataque mundano.** Para corpo a corpo isso não importa (o alcance curto já colapsa
  em adjacência a ambos); para ataque à distância, "dentro do alcance" e "na linha" são coisas
  diferentes e produzem respostas diferentes. **Esta metade fica em aberto, é regra e é da
  mesa:** ou o Interpor à distância aceita "dentro do alcance" mesmo sabendo do caso estranho
  (nenhuma trava nova, o Alerta do item 1 cobre o resto), ou pede geometria de reta que hoje só
  existe para Artes e precisaria de uma versão para ataque mundano.

  **DECIDIDO em 07/09/2026: OPÇÃO 2, GEOMETRIA DE RETA NOVA.** A interposição é gesto
  DECLARADO pelo jogador, sabendo o que vale — não é um absurdo que aparece por acidente (o
  Alerta do item 1 não cobre isto), é a regra sendo jogada como está escrita, e a mesa que
  descobrir "qualquer ponto do raio serve" vai jogar assim sempre. **Com duas conferências
  feitas antes de escrever código, como pedido:**

  **3a · o `linha` das Artes mede outra coisa, e reusá-lo seria a fachada.** A função
  `pontoNaFigura` testa `f.tipo === 'linha'` girando o ponto para o referencial da faixa (`src/lib/artes-grid.ts:1189`-`1196`): a origem é a posição de quem conjura, o comprimento e a
  direção são escolha de quem lança a Arte, e a largura (`larguraM`, padrão `LARGURA_LINHA`) é um
  número decidido para dimensionar Efeito, não para decidir quem bloqueia uma flecha. É a mesma
  matemática (retângulo girado) para uma pergunta diferente (área de efeito de quem conjura,
  contra segmento entre agressor e alvo original). Reusar herdaria um número sem a decisão por
  trás dele para este uso novo — não reusar.

  **3b · a geometria de hexágono resolve sem número novo, mas com FUNÇÃO nova, não com a que
  existe.** Um traçado de reta em coordenadas cúbicas (interpolar entre os dois centros e
  arredondar CADA PASSO em cubo, não eixo a eixo) devolve a sequência exata de casas que o
  segmento cruza, sem largura nem tolerância — é geometria resolvida, não decisão. A função mais
  próxima que já existe, `afastar` (`src/lib/artes-grid-mesa.ts:1163`), arredonda `q` e `r` **por
  eixo** (`Math.round` em cada um separado), o que não garante hexágonos vizinhos passo a passo e
  não serve para "quais casas a reta cruza" sem risco de pular uma. **Não é reuso, é função nova
  e pequena, e não carrega número novo para decidir.**

  **A regra final:** o interpositor precisa terminar dentro do alcance da arma original (já
  decidido) **e** numa das casas que o traçado reto do agressor até a posição original do aliado
  cruza. **Só vale para ataque à distância** — no corpo a corpo o alcance curto já colapsa em
  adjacência a ambos, a reta é redundante ali, e isto fica escrito para ninguém medir reta num
  golpe de espada achando que está errado.

  **AS SEIS PERGUNTAS DO INTERPOR ESTÃO FECHADAS. Nenhuma pergunta nova apareceu ao escrever
  esta seção.** Pronto para a Executora.

  **IMPLEMENTADO E APROVADO em 07/09/2026 (rodada 15, commits `8e88004`/`b5ad27b`, revisão em
  `docs/simulacao/caixa/15-executora.md`).** As duas portas (Preparo e Recuperação), o
  redirecionamento de dano e a geometria de reta em hexágono batem com as seis decisões abaixo,
  conferidos linha a linha pela Revisora contra o código, não só contra o relato.

  **PENDÊNCIA DA REVISORA, TOTALMENTE FECHADA em 07/09/2026 (rodadas 16 e 17, commits `fbe69ce`
  e `d3b2840`, avisos em `docs/simulacao/caixa/16-executora.md` e `17-executora.md`).** As duas
  portas do Interpor (Preparo e Recuperação) têm agora prova e2e ponta a ponta em
  `scripts/test-interpor-mesa.mjs` (cena `?cena=interpor` em `mesa-mock.mjs`, com `&fase=`
  escolhendo a porta): dirige a caixa certa ao vivo pela tela, resolve o golpe adiado, e confere
  em par, nas duas portas, que a Vida do alvo original não muda e a de quem se interpôs desce
  pela Absorção DELE, não a do alvo. **D16a, divergência registrada pela Executora na rodada 16:**
  o pedido original da Revisora era "pelo menos um caminho de CADA porta"; o TechLead simplificou
  para "uma, à escolha" ao repassar a tarefa — fechado na rodada 17, cobrindo a segunda porta.
  **Veredito SEGUE em 07/09/2026 (rodada 18, `docs/simulacao/caixa/18-revisora.md`, commit
  `619c317`):** a Revisora rodou os dois cenários ao vivo (34 asserções, não só leu o código) e
  confirma que a conferência em par é a MESMA função nas duas portas, não duplicada por nome.
  Em `test-grid.mjs:1023`, o clique que abre a caixa de abortar: `data-a="abortar"`.
  Em `test-grid.mjs:2969`, a caixa equivalente de fora-de-hora: `data-a="forahora"`.

  **ITEM 4 (o que o escudo faz) NÃO É DECISÃO DE MESA, É BANDEIRA DESLIGADA — conferido em
  07/09/2026.** `bloqueio` é uma das 15 bandeiras (`src/data/regras.json:2535`,
  `"bloqueio": false`), e enquanto ela estiver assim a rota de Bloqueio não existe em lugar
  nenhum do motor: a resolução usa só a Esquiva, e o escudo `só penaliza` (`docs/simulacao/02-projeto-harness.md:1823`). O Interpor não precisa inventar nada para o escudo: ele herda
  o mesmo estado que vale em qualquer outro golpe hoje — o escudo do interpositor pesa na
  Penalidade de armadura e não some, mas não soma Defesa nenhuma até `bloqueio` ligar. Quando a
  bandeira ligar, o Interpor ganha o bônus de Bloqueio pela mesma conta que todo o resto do
  combate, sem precisar de uma regra própria. **Reclassificado de "escalar" para "bloqueado por
  bandeira"**, mesma família de porte/gate (L48).

  **ITEM 6 (reconciliar os dois preços) NÃO É ESCOLHA ENTRE PREÇOS: SÃO DOIS GESTOS, POR FASE —
  E ISSO JÁ ESTAVA DECIDIDO EM 20-21/08/2026, só não tinha sido lido junto.**
  `Combate_Tempo.md:800`-`815` (§14.6) descreve as duas entradas do Interpor como fases
  diferentes, cada uma com preço e regime já fechados: no **Preparo**, interpor é destino do
  abortar (`regras.json:2504`, `para: ["mover","desviar","interpor"]`) — você desiste do próprio
  gesto ainda não resolvido, sem teste, perde o que já investiu e paga o deslocamento a 1
  Tick/metro, "o mesmo preço do desvio de emergência da §5.5"; na **Recuperação**, interpor é uma
  das ações fora de hora do catálogo §4.3 — você não estava agindo, paga a distância em metros
  (mínimo 2) em dívida, e o teste que fizer para chegar lá sai a −1d6 pela regra geral de
  Recuperação (`:812`). Não há dois preços concorrentes para a mesma coisa: há duas portas de
  entrada com preços já escritos para o que cada uma é. **Nenhuma decisão nova precisa ser
  tomada aqui** — o trabalho é implementar as duas portas, não escolher uma.

  **AS DUAS PORTAS ESTÃO IMPLEMENTADAS, na mesma rodada que fechou esta seção:** o preço do
  Preparo (`combate.abortar.ticksPorMetro`) e o da Recuperação (`combate.interpor.recuperacao`,
  lido por `custoInterporRecuperacao` em `src/lib/combate-tempo.ts`) chegam ao tabuleiro pelos
  dois diálogos citados acima nesta seção.

- [ ] **L35 · [DECISÃO DE MESA] A CRIATURA NÃO TEM PERÍCIA, E A COMPARAÇÃO DO GOLPE DO ESCURO
  FECHA PARA UM LADO SÓ** · *levantamento de 04/09/2026, contado nas 309.*

  A decisão do caso B foi: existe percepção do golpe vindo do escuro, pela régua que já existe
  (`coracao-do-sistema.md:59`, `Valor Passivo = (Atributo + Habilidade) × 2 + Especialidade +
  Centelha`, com o exemplo do ladrão e a frase "o guarda não rola, sua vigilância é um muro").
  A forma está certa e não precisa de mecânica nova. **O que falta é o dado.**

  **1 · QUANTAS REGRAS PÕEM PERÍCIA DE UM DOS LADOS.** Varridos os 20 capítulos, 28 linhas
  falam de oposição ou de Passiva citando perícia. Tirando as que citam perícia por outro
  motivo (exemplos, listas, especialidades), sobram **14 regras** em que a criatura pode estar
  de um dos lados e uma perícia é exigida dela:

  | lado | regra | perícia exigida |
  |---|---|---|
  | passivo | Notar sem procurar (`acoes-sentidos-e-engano.md:16`) | Prontidão |
  | passivo | Esgueirar-se, Dificuldade do vigia (`acoes-sentidos-e-engano.md:46`) | Prontidão |
  | passivo | Roubar (`acoes-sentidos-e-engano.md:87`) | Prontidão |
  | passivo | Trapacear no jogo (`acoes-sentidos-e-engano.md:94`) | Prontidão |
  | passivo | Disfarçar-se, contra quem olha (`acoes-sentidos-e-engano.md:90`) | Prontidão |
  | passivo | Interrogar (`acoes-sentidos-e-engano.md:107`) | Integridade |
  | passivo | Combate Social (`relacoes-sociais.md:193`) | Sociabilidade (via Defesa Social) |
  | ativo | Esgueirar-se e o golpe do escuro (`coracao-do-sistema.md:59`) | **Furtividade** |
  | ativo | Contrabandear (`acoes-sentidos-e-engano.md:93`) | **Furtividade** |
  | ativo | Roubar e Trapacear (`acoes-sentidos-e-engano.md:87`) | Prestidigitação |
  | ativo | Veneno, doença e ambiente (`acoes-resistir.md:32`, `:62`, `:106`) | Resistência |
  | ativo | Abrigo contra o ambiente (`acoes-resistir.md:133`) | Sobrevivência |
  | ativo | Amortecer a queda e agarrar a borda (`acoes-corpo-e-movimento.md:117`) | Atletismo |
  | ativo | Interrogar (`acoes-sentidos-e-engano.md:107`) | Manha ou Oratória |

  **2 · O BESTIÁRIO NÃO TEM PERÍCIA NENHUMA, E MESMO ASSIM QUATRO DELAS SÃO RECUPERÁVEIS.**
  Nenhuma das 309 criaturas de `src/data/inimigos.json` tem a chave `pericias`. Mas o gerador
  (`scripts/gen-bestiario.mjs`) CONSOME perícias para produzir os derivados e depois as
  descarta, e a conta é invertível:

  | perícia | de onde volta | quantas das 309 |
  |---|---|---|
  | **Prontidão** | `iniciativa − raciocínio`, de `const ini = at.raciocinio` (`gen-bestiario.mjs:67`) | **309**, exata |
  | **Esquiva** | `defesa / 2 − destreza − centelha / 2` | **301** (8 fracionárias: armadura ou especialidade no meio) |
  | **Integridade** | `defesaMental − raciocínio − vontade − centelha` | **284** (25 sem Defesa Mental, Int 0) |
  | **Sociabilidade** | `(defesaSocial − centelha) / 2 − compostura` | **145** (164 sem Defesa Social, Int < 2) |
  | **Furtividade** | nada a consome | **0** |
  | Prestidigitação, Resistência, Sobrevivência, Atletismo, Manha, Oratória | nada | **0** |

  Ou seja: das 14 regras, **7 fecham por derivação** (as de Prontidão, Integridade e
  Sociabilidade) e **7 não fecham**. E a que trava o caso B é uma só: a **Furtividade**. O lado
  passivo (a Percepção Passiva do alvo) fecha inteiro, inclusive quando o alvo é criatura.

  **3 · AS DUAS SAÍDAS, COM CUSTO.**

  **Saída A · derivar as quatro, e escrever a Furtividade à mão.** O gerador já sabe fazer a
  conta ao contrário; é uma passada de script gravando `pericias` no bloco, com as quatro
  derivadas e um número novo por criatura para a Furtividade. **Custo: 309 decisões de regra**,
  uma por criatura, e nenhuma é derivável de nada (um ogro e um assassino têm a mesma Destreza
  e Furtividades opostas). É a saída que dá o número certo e a que pede o trabalho todo.

  **Saída B · uma Passiva de Furtividade por porte e categoria.** Uma tabela pequena
  (`Miúdo +2`, `Médio 0`, `Enorme −2`, com `Fera +1` e `Construto −2`, por exemplo) aplicada
  sobre a Destreza. **Custo: uma decisão de regra e nenhum dado**, e o preço é que o assassino
  humano e o camponês humano ficam iguais até alguém escrever a exceção. É a mesma forma que a
  couraça por porte já usa em `COURACA` (`gen-bestiario.mjs:37`), então não é forma nova: é a
  forma da casa.

  **Não há terceira**: sem Furtividade não há comparação, e comparar contra um número fixo
  ("criatura no escuro passa sempre" ou "nunca passa") é escrever a regra por omissão.

  **5 · O QUE MAIS FALTA PELO MESMO MOTIVO, e a resposta é maior que dois campos.**

  O `ResumoCombate` foi montado para O GOLPE, e é isso que ele carrega: arma, ataque,
  dano, as três Defesas, Absorção, resistência à perfuração, velocidade, classe, passo,
  P/G/R e Quase-Acerto. **Tudo derivado, e nenhum atributo cru.** A primeira regra que
  pediu outra coisa achou dois buracos porque precisava de um atributo e de uma perícia;
  as outras treze pedem mais cinco atributos e mais seis perícias.

  | a regra pede | atributo | perícia | o resumo tem? |
  |---|---|---|---|
  | veneno, doença, ambiente (`acoes-resistir.md:32`) | Vigor | Resistência | **nenhum dos dois** |
  | abrigo (`acoes-resistir.md:133`) | Percepção ou Inteligência | Sobrevivência | **nenhum dos dois** |
  | amortecer a queda (`acoes-corpo-e-movimento.md:117`) | Destreza | Atletismo | **nenhum dos dois** |
  | roubar, trapacear (`acoes-sentidos-e-engano.md:87`) | Destreza | Prestidigitação | **nenhum dos dois** |
  | interrogar (`acoes-sentidos-e-engano.md:107`) | Influência | Manha ou Oratória | **nenhum dos dois** |
  | esconder-se e o golpe do escuro (`coracao-do-sistema.md:59`) | Destreza e Percepção | Furtividade e Prontidão | **entrou agora** |

  **O buraco de baixo é o mesmo em todas: o resumo não tem os nove atributos.** A criatura
  os tem (`monsters.json`, chave `atributos`), a ficha os tem, e o contrato entre os dois
  não os leva. Não é falta de dado, é falta de campo, e por isso cada regra nova vai achar
  o mesmo buraco outra vez até alguém acrescentar `atributos` ao `ResumoCombate`.

  **DECIDIDO em 04/09/2026: o resumo da PEÇA.** O `ResumoCombate` passou a carregar
  `atributos` (os nove crus) e `pericias` (por nome), e o bloco `sentidos` saiu junto com o
  tipo que o sustentava: com os dados crus no resumo, quem precisa da Passiva a calcula com
  `valorPassivo` no ponto de uso, e um objeto guardando a conta pronta seria a terceira
  cópia do mesmo número.

  O motivo da escolha, e ele é de custo e não de gosto: bloco por assunto significa que toda
  regra nova volta a esbarrar no mesmo buraco, e isso aconteceu três vezes numa semana (o
  bestiário sem perícia, o resumo sem os sentidos, o resumo sem atributo). **Carregar nove
  números que às vezes não são usados custa menos que parar a cada regra.**

  E não entrega nada novo ao jogador, o que foi conferido antes de escrever: o resumo não
  viaja, é MONTADO no navegador a partir de `monsters-mesa.json`, que é import estático do
  Grid e já carregava os nove atributos das 309. A distinção que sustenta isso é entre
  ESPÉCIE e INSTÂNCIA: o bestiário é livro publicado, e o que a `combate_visao` esconde é a
  Vida daquele ogro agora. A peça `custom` sai com os dois NULOS, e a ausência é informação.

  **4 · O `ResumoCombate` NÃO CARREGA NENHUMA DAS TRÊS.** `resumoDe` (`src/lib/mesa-bestiario.ts:228`)
  devolve arma, ataque, dano, as três Defesas, absorção, resistência à perfuração, velocidade,
  classe, passo, pgr e Quase-Acerto. Não há Percepção, nem Prontidão, nem Furtividade: **o
  modelo de combate da mesa não conhece nenhuma perícia por nome**, só os derivados delas. Seja
  qual for a saída escolhida, o `ResumoCombate` ganha um campo. **FEITO em 04/09/2026**: o
  bloco `sentidos` (`export interface Sentidos`, `src/lib/calc.ts`) com a `percepcaoPassiva`
  e a `furtividade` partida em atributo e perícia, preenchido pelos dois lados por caminhos
  diferentes (a ficha tem as perícias; a criatura tem o bloco `pericias` derivado). A
  fórmula é `valorPassivo`, no mesmo arquivo, e ela mora lá porque é o único módulo que os
  dois importam: pô-la num dos dois faria ciclo.

- [ ] **L33 · [FASE 2.5] A VISTA DO JOGADOR COMO PRODUTO** · *decidida em 04/09/2026. Entra
  depois da fase 2 e antes do terreno. Não começar antes.*

  **De onde veio.** Três dos quatro últimos achados sérios estão do lado do jogador, e
  nenhum era regra de jogo:

  | achado | o que era |
  |---|---|
  | a névoa acendendo pelo fogo agendado | vazamento de informação, em produção |
  | o mock mais generoso que o esquema | nenhuma afirmação sobre a vista dele era falsificável |
  | a `combate_visao` sem corte de casa | nome, retrato, grupo, Tick e Vida do bicho no escuro |
  | **o relógio dele em Tick 0 desde a migração 14** | num sistema cujo nome é tempo, um lado do produto que nunca funcionou |

  O último é o que muda o plano. Não é defeito de borda: é a cadeira do jogador rodando
  o Simultâneo com o relógio parado, desde agosto, sem ninguém ter olhado. **A cadeira
  do mestre foi construída e medida; a do jogador foi deduzida.**

  **O escopo, em quatro perguntas:** o que a tela dele desenha, o que chega ao navegador
  dele, o que ele consegue fazer, e que horas são para ele.

  Não é fase de métrica: é fase de produto, e termina com a mesa jogável dos dois lados.

  **LEVANTAMENTO em 07/09/2026 (rodada 24, `docs/simulacao/caixa/24-executora.md`): o achado
  "relógio em Tick 0" está DEFASADO.** A migração 31 rodou em produção em 05/09/2026 (`L42`), e
  o cliente já tinha a degradação `SEM_RELOGIO` pronta antes disso (`grid.astro:3038`,
  `test-grid.mjs:1441-1460`, cenário `SIM5`).

  **FECHADO em 07/09/2026 (rodada 25, commit `cffcec9`, `docs/simulacao/caixa/25-executora.md`):
  as duas lacunas que sobraram do levantamento.** A pergunta do `combate.astro` era divergência
  real, não só teórica: sonda com a bancada (`?tick=5&tempo=simultaneo`) mostrou `#enc-tick` em
  0 com a arena em 5, para mestre E jogador — `AGORA = emCampo[0]?.tick ?? 0` lia o Tick
  individual de uma peça `livre`, que fica parado enquanto `tick_atual` anda. Corrigido: no
  Simultâneo o relógio agora lê `ENC?.tick_atual` (`combate.astro:903`), igual ao Grid; normal
  e P/G/R não mudaram. E a lacuna de prova no P/G/R fechou com um par de asserção novo
  (`test-grid.mjs:1475`, knob `?deslocafila=N` em `mesa-mock.mjs`): o jogador calcula o
  mesmo relógio que o mestre, e o número muda junto com o deslocamento, em vez de ficar parado
  em Tick 0 (que era indistinguível de máscara quebrada antes deste teste existir).

  **Veredito SEGUE em 07/09/2026 (rodada 25, `docs/simulacao/caixa/25-revisora.md`).** A
  revisora refez a prova de regressão por conta própria (reverteu `combate.astro:903` (`ENC?.tick_atual`),
  viu as duas asserções falharem em `(0)`, restaurou) e rodou o par do P/G/R e a suíte
  completa sem reversão, tudo verde; confirmou que `?tick=` e `?deslocafila=` não se
  pisam, linha a linha em `mesa-mock.mjs`. Nada a corrigir. Item 1 do lote 2 fechado; item
  2 (a tela da lembrança) é construção nova e espera a semana nova.

- [x] **L32 · DECIDIDO em 06/09/2026 · A névoa esconde a EXISTÊNCIA do inimigo, não só a
  posição · falta a tela da lembrança, e é ela que trava a migração 33** · *achado na
  varredura das oito views, 04/09/2026 (a decisão em si), fechado com a mesa e os cinco casos
  em 06/09/2026 (o alcance dela). Registro reconstruído em 06/09/2026: as decisões foram
  tomadas com a mesa e o registro ficou incompleto na hora.*

  A `combate_visao` é a única MISTA das oito views. Como **parede** ela é a melhor do esquema:
  mascara coluna a coluna, dentro do Postgres, e a Vida exata do inimigo, os dados, a Energia,
  a Mana e o `arma`/`alvo` da ação declarada não saem sem a mesa abrir a chave.

  Como **cortina** ela vazava EXISTÊNCIA. O `where` era `c.oculto = false and eh_membro(...)`,
  sem arena e sem casa: o bicho parado no escuro chegava ao navegador do jogador com nome,
  retrato, grupo, Tick, iniciativa e estado de Vida. Quem escondia era a TELA do Grid, porque
  `naFila()` só lista quem tem peça em `TOKENS`, e a `token_visao` não mandava a peça de quem
  estava no escuro. **E a cortina nem chegava a fechar**: a mesma linha saía desenhada na aba
  Combate, que lista a fila inteira do encontro e não tinha névoa nenhuma.

  **A DECISÃO, das três saídas possíveis (ficar como está · cortar por casa também na
  `combate_visao` · uma chave em `mesas.revelar` por mesa): a segunda.** A névoa passa a
  esconder a existência, e a aba Combate passa a ter névoa junto, o que ela nunca teve. Custo
  aceito: a fila do jogador muda de tamanho no meio do combate, e ele descobre pelo tamanho
  dela que alguém apareceu.

  **OS CINCO CASOS QUE A DECISÃO ABRE, e o que ficou decidido em cada um:**

  - **A · O hexágono some junto com o nome.** Casa que o jogador não enxerga é omitida da
    frase do registro: ele lê "chegou em H7" e "saiu de H7", nunca o outro lado. Esconder QUEM
    e mostrar ONDE derrota o propósito por outra porta.
  - **B · Golpe vindo do escuro dá comparação de Furtividade contra a Percepção Passiva do
    alvo**, pela fórmula que a régua já tem (`(Percepção + Prontidão) × 2`, com o guarda não
    rolando). Quem percebe lê "um golpe vem contra você", sem quem e sem de onde, e ganha a
    janela de reação; quem não percebe não lê nada e o golpe cai sem aviso. **Recusado:**
    tornar o ataque do escuro indefensável — seria regra de jogo forte nascendo de escolha de
    tela.
  - **C · O corte só morde com arena ativa e névoa ligada.** Sem arena ou com névoa desligada,
    tudo passa como hoje, e a mesa que joga só pela aba Combate não muda. Com névoa ligada,
    peça sem token conta como escuro: criatura criada e não posta no mapa é a emboscada sendo
    preparada, e o mestre que a cria acabou de escondê-la.
  - **D · O inimigo já visto que recua fica listado, apagado**, com a Vida e a casa da última
    vez que foi visto — criatura passa a ter os dois pesos que o chão já tem. O estado
    envelhece (curado no escuro continua lembrado ferido), e morto no escuro fica listado como
    qualquer outro. **Recusado:** "some junto com o registro do ferimento" — apagar o
    resultado da ação do jogador não é névoa, é amnésia.

    **O VISUAL, decidido pelo humano em 07/09/2026 (o dado já estava especificado na migração
    33; faltava só isto):** três regras, e se aparecer um quarto caso de visual que elas não
    cobrem, parar e perguntar antes de inventar.
    1. **Apagado é visivelmente distinto de peça vista agora**, não opacidade menor por acaso —
       quem olha o tabuleiro sabe, sem passar o mouse, que aquilo é lembrança e não leitura.
    2. **A Vida mostrada é a da última vez**, e a tela diz isso. Curado no escuro continua
       aparecendo ferido, de propósito — o que não pode é o jogador achar que está vendo o
       agora.
    3. **A lembrança não é alvo.** Não declara golpe, não move até ela, não mira nela. Se a
       interface deixar clicar, promete uma ação que o motor não faz.
  - **E · A `efeito_visao` corta por casa.** Era vazamento vivo. **FEITO, migração 32.**

  **E o que o jogador lê quando algo acontece no escuro: nada, nem anônimo.** Se o ALVO está
  claro, ele vê o que acontece com o alvo, sem o autor ("Kael foi atingido", não "o goblin
  atacou Kael"). Efeito de área que pega casa escura e casa clara: ele lê a parte clara.

  **O que está feito:** o caso E, na migração 32. Os casos A e C, parcialmente, pela migração
  33 · **que NÃO RODOU.** **O que falta, e é o que trava a 33:** a tela que desenha a
  lembrança (o caso D). Ela nunca existiu — zero ocorrências de "lembranca" em `src/` — e sem
  ela os casos A, C e D não têm onde aterrissar. → a fase que abriga essa tela: **L33**.

  A diferença entre cortina e parede de cada uma das oito views está escrita **no banco**, em
  `comment on view`, pela migração 31. Documento longe do objeto envelhece; comentário ao lado
  dele não.

- [x] **L31 · [FECHADO em 07/09/2026] OS SETE GERADORES SEM `--check`** · *achado varrendo
  portões, 04/09/2026, pela pergunta "o que mais está configurado e não roda".*

  Cinco geradores tinham `--check` no `npm run build` (`gen-grid-artes`, `gen-mermaid`,
  `gen-bestiario`, `gen-cap-antecedentes`, `gen-bench-tempo`); sete não tinham nem isso nem
  lugar em portão nenhum. Fechado assim, gerador por gerador, pela Executora
  (`docs/simulacao/caixa/21-executora.md`):

  - `gen-elementos.mjs` e `gen-deslocamento.mjs`: bateram limpo contra o commitado
    (regeneração idempotente). Ganharam `--check` no padrão do `gen-bestiario.mjs` e entraram
    no `npm run validate`.
  - `gen-arte-equip.mjs`, `gen-lista-equip.mjs`, `gen-creditos-equip.mjs`,
    `gen-prompts-folhas.mjs`: **não cabem em `--check`**, por um motivo estrutural que a
    pendência original não previa. `gen-arte-equip` lê de `D&D/armas&armaduras/folhas`, e os
    outros três ESCREVEM dentro de `D&D/armas&armaduras/`: a pasta inteira está fora do git
    (`.gitignore:25`). Sem entrada ou sem saída versionada, não há o que um `--check` compare
    contra o commitado: ele passaria na máquina de quem tem a pasta local e falharia sempre no
    CI (ou não mediria nada). Mesma família do `gen-monsters.mjs`, que já tinha essa exceção.
    Ficam declarados em `GERADORES_FORA` (`scripts/test-portoes.mjs`), com o motivo real.
  - `gen-cap-pericias.mjs`: achada uma divergência real entre `habilidades.json:809` ("manobra")
    e o capítulo publicado (`habilidades.md`, "firula"), rastreada aos commits `3a7c7e9` e
    `ac71ade` (renomeação do termo de jogo Manobra→Firula, 17-18/08/2026). Levado ao usuário
    pelo TechLead: confirmado que `ac71ade` varreu essa ocorrência por engano (o "manobra" da
    Política é português comum, não o termo de jogo Firula) e que o CAPÍTULO é quem estava
    errado. `habilidades.json:809` não foi tocado; o gerador rodou de verdade e restaurou
    "manobra" na frase, desfazendo o excesso da varredura (diff conferido: só essa palavra
    mudou). Ganhou `--check` no mesmo padrão dos outros e entrou no `npm run validate`.
  - O achado colateral do `gen-arte-equip.mjs` (degrada em silêncio quando a pasta de origem
    falta, e pode sobrescrever o CSS commitado com saída quase vazia) virou **L50**, registrado
    à parte por não ser desta pendência e por instrução explícita de não consertar agora.

  **Veredito SEGUE em 07/09/2026 (rodada 23, `docs/simulacao/caixa/23-revisora.md`, commit
  `fc90e07`):** a Revisora conferiu os dois diffs (`ac71ade` e `cd59792`) direto no código, não
  só leu o aviso, e confirma a leitura sobre manobra/firula: das cinco linhas que `ac71ade`
  mudou, quatro nomeiam a mecânica de jogo e a quinta (a frase da Política) é sentido comum
  varrido por engano. Rodou ela mesma os três `--check` novos e `npm run validate` (exit 0), e
  conferiu as quatro exclusões estruturais linha a linha em cada gerador-fonte.

- [ ] **L30 · [FAZER] OS DEZ MÓDULOS FORA DE TODO PACOTE DE TESTE** · *o mapa está em
  `scripts/mapa-cobertura.mjs`, e ele se refaz sozinho: `node scripts/mapa-cobertura.mjs`.*

  **De onde veio.** Em 04/09 um conserto foi commitado desligado e o `validate` ficou verde. A
  causa não era falta de teste, era o teste empacotar o arquivo errado: `test-artes-grid.mjs`
  empacota `artes-grid.ts` e o conserto morava em `artes-grid-mesa.ts`. A pergunta que aquilo abriu
  é **quais outros arquivos estão na mesma situação**, e o mapa responde perguntando ao esbuild pelo
  `metafile`, em vez de por uma lista escrita à mão que envelhece.

  **O estado, em 04/09/2026**, de 43 módulos em `src/lib`:

  | | quantos | quais |
  |---|---:|---|
  | dentro de algum pacote | **29** | e estar dentro **não** quer dizer testado: quer dizer que uma asserção PODE alcançar |
  | só no smoke do navegador | **4** | `mesa-mapas`, `mesa-tempo-real`, `mesa-tempo-ui`, `reconciliar` |
  | **fora de tudo**, em produção | **10** | `ficha-engine` (177 KB), `arma-svg` (31 KB), `ficha-card`, `bestia-editor`, `mesa-revelacao`, `cores-site`, `config-site`, `data`, `imagens-item`, `artes-fmt` |

  **O mais arriscado dos dez é o `ficha-engine.ts`, e por um motivo específico: ele fabrica a
  entrada de toda a cadeia que ESTÁ testada.** Ele é o maior arquivo do projeto (177 KB) e é quem
  escreve a ficha salva; `resumoCombatePC` (testado), `equip` (testado) e o bloco de combate da
  mesa leem essa ficha e a transformam. Um erro ali entra por baixo de um portão verde: os testes
  continuam provando que a transformação está certa **sobre um número errado**.

  E o `test-kael.mjs`, que o `CLAUDE.md` chama de regressão de personagem, **não o toca**: ele
  reimplementa as fórmulas a partir do `regras.json` e compara os números. Isso guarda o
  `regras.json`, e não o motor da ficha. Os 177 KB que montam toda ficha não têm um teste no
  `validate` nem no `smoke`.

  **O segundo é o `mesa-revelacao.ts`**, e ele entra por outra porta: é a tela que decide **o que os
  jogadores veem**. Está na mesma família do vazamento da névoa (04/09), e essa família já provou
  duas vezes que erra em silêncio, porque o defeito só aparece na cadeira de quem não deveria ver.

  **Não é para consertar agora.** É para o mapa existir, rodar quando alguém quiser, e a lista não
  crescer sem ninguém notar.

- [ ] **L29 · [A FILA DO GRID, e ela substitui a leitura antiga da `09`] Sete
  consertos, e o `ESTADO.md` é a fonte.** O `Pendencias` é o índice único do que está
  aberto, e até 04/09 ele não conhecia esta fila: o `93,7` só existia no `ESTADO.md`
  (achado C3 da revisora, rodada 05). A leitura completa, com procedência linha a
  linha, está em `docs/simulacao/ESTADO.md`; aqui fica o índice.

  **O que mudou a fila não foi bateria: foi a linha entre CUSTO e JOGO.** Custo é o
  tempo entre a decisão estar tomada e o efeito aparecer na tela. Por ela, o trabalho
  do mestre medido na bateria é **100% custo**, porque a bateria roda dois robôs e o
  jogo mora na declaração, que ali é automática.

  | # | o conserto | o que tira |
  |---|---|---|
  | 1 | a folha aceita o dado em vez do total, com o dado rolado na mão | 34,0% |
  | 2 | o botão do veredito vira confirmação | **0 a 17,0%**, e a banda é ignorância |
  | 3 | o avanço unificado, que abre a folha do golpe que o fez parar | 32,0% |
  | 4 | a Defesa −4 da Corrida e o contrapé da iniciativa, exibidas e não aplicadas | sem número |
  | 5 | a parada abre todos os golpes do Tick | 10,7% |
  | 6 | o **L25**, as bandeiras lidas pelo motor | zero para o mestre |
  | 7 | o avanço MOSTRA o percurso em vez de pedir confirmação | 6,0%, e é ESCALA |

  **A ordem não é a numeração:** primeiro o 4, depois **gravar o par (veredito da
  régua, botão do mestre) em produção**, que é o que transforma a banda do item 2 num
  número, depois o 1 e o 3, o 5, o 2 e o 6. O item 7 é decisão de jogo.

  **Nenhum teto aqui é de natureza.** Com os consertos desenhados até hoje o teto é
  99,7%, e com o item 2 valendo zero a escada para em 76,7%. Cada teto anterior desta
  frente (61,8% e 93,7%) foi publicado como limite natural e era o alcance dos
  consertos daquele dia.

- [x] **L27 · [FECHADO em 06/09/2026] Apagar `rpg-system/centelha-revisora/`
  e tirar a linha do `.gitignore` junto.** A linha saiu em 03/09 (as cinco, com o comentário),
  que era a metade que importava: a regra permanente escondendo um caminho que não devia existir.
  A pasta saiu em 06/09, depois de a máquina reiniciar: o que a segurava era um processo, e não
  um arquivo, então a espera era pelo reinício e não por trabalho. Dentro dela sobrava só um
  `bash.exe.stackdump`, que o `.gitignore` já cobre por conta própria; foi o que fez o `rmdir`
  reclamar de "directory not empty" e o `rm -rf` resolver. A árvore continua limpa.

  O texto original, para a história: a pasta foi engano de caminho na montagem da frente de
  revisão: o worktree de verdade mora fora daqui (`../centelha-revisora`), e o que ficou na raiz é
  uma cópia byte a byte do `CLAUDE.md` que já está lá.

  **A linha sai junto, e esse é o ponto do item.** O `.gitignore` é versionado, e uma regra
  permanente escondendo um caminho que não existe é pior que a pasta: daqui a seis meses alguém a
  encontra e não sabe o que ela protegia.

  **Ordem:** apagar a pasta, tirar a linha, conferir com `git status` que a árvore continua limpa,
  e só então commitar as duas coisas juntas.

  **Quando:** no primeiro commit depois que a resposta da revisora chegar e for tratada. Não antes,
  e não em branch própria. Enquanto isso a linha do `.gitignore` fica, porque é ela que mantém o
  `npm run rodada` funcionando (ele recusa abrir rodada com a árvore suja).

- [ ] **L28 · [PEQUENO] O alarme do E4 inerte é o único sem teste.** Os onze sinais de bateria
  ineficaz moram em `scripts/sim/sinais.mjs` e cada um tem, em `test-sinais.mjs`, o caso que o
  acende e o que o cala. O décimo segundo, "E4 INERTE" (a célula de passo 2× re-projeta menos que
  a âncora dela), ficou dentro de `agregar.mjs` quando os outros saíram, e portanto é o único que
  volta a ter o zero de duas caras: "não houve problema" e "o predicado está errado" imprimem o
  mesmo silêncio. Ele já acendeu uma vez de verdade (a sanidade da primeira volta, D31), o que
  prova o predicado daquela versão e não o de hoje. Mover para `sinais.mjs` com os dois casos.
  Anotado em 03/09, na rodada 02 da caixa.

- [ ] **L26 · [PRIMEIRO, E NÃO É CÓDIGO] Por que as mesas rolam o dado na mão?** Medido em 03/09
  (`09` §2.5): recontando os mesmos 9.600 combates com o custo do modo `site`, a classe iii cai de
  50,4% para 25,3% e o **trabalho total cai 33,6%**, sem uma linha de motor. Dois terços dos 50%
  que pareciam aritmética automatizável são o dedo digitando o acerto e o dano que o site já sabe
  calcular. É o maior número desta bateria inteira, e a chave já existe, está implementada e
  ligada (`rolaNoSite`, chamada na abertura da folha).

  **E o peso todo da classe iii vem de UMA parada, e não de seis** (`09` §2.5): `resolver` e
  `aplicar` acontecem uma vez por golpe, e as outras cinco (`declarar`, `agenda`, `reprojetar`,
  `fugir`, `redirecionar`) somam 557.629 ocorrências, 60% de todas as paradas, **e custam zero
  gesto**. Não há seis coisas para automatizar: há a folha da resolução, e ela já tem chave.

  **O modo `mesa` não é desleixo, é escolha, e a razão está escrita na régua:**

  > *"Quem rola os dados. Não muda regra nenhuma: muda quem digita o resultado. O padrão é ninguém
  > rolar no site, porque o dado na mão é metade da mesa."*

  Rolar o dado é parte do que as pessoas foram fazer ali, e trocar o padrão para economizar
  cliques do mestre pode custar exatamente a coisa pela qual a mesa existe. **Essa troca não é
  decisão de quem escreve o motor.**

  **DUAS PERGUNTAS, NA MESMA CONVERSA**, porque as duas decidem o tamanho dos dois primeiros itens
  da fila e nenhuma delas se responde com bateria:

  1. **por que a mesa rola o dado na mão?** Vale 33,6% do trabalho;
  2. **com que frequência há efeito de chão ativo numa cena?** Vem do achado da `09` §2.4: o
     `verificarEfeitos` morde sem parada nenhuma, e nenhuma batalha desta bateria tem Arte. Se
     efeito de chão for raro, o piso de 11,4% do L24 vale como medido; se for comum, o avanço
     automático para mais vezes e o piso encolhe.

  O modo `misto` existe justamente para o impasse da primeira (só as criaturas rolam no site, o
  que tira do mestre as rolagens dele e deixa o dado na mão dos jogadores) e **esta bateria não
  consegue medi-lo**: todas as peças dela são arquétipos de PC, então o `misto` sairia idêntico ao
  `mesa`, e não por o modo não fazer nada. Zero ambíguo outra vez; medi-lo exige criatura no
  elenco.

  **TENTATIVA DE SEPARAR OS 34% POR "QUEM DIGITA", em 07/09/2026, e a resposta é NÃO, com o dado
  que existe.** A pergunta era: dá para separar quanto da digitação de `resolver` vem de golpe de
  criatura (lado do mestre) e quanto de golpe de PC, usando o `lado` que o log já carrega? O
  `lado` existe de fato (`log.mjs:190`, `paradasSubLado`, atribuído ao ATACANTE — confirmado em
  `log.parada` chamado com o atacante `c`, `motor.mjs:409`), e é tecnicamente medível: numa
  bateria ad hoc (semente `20260903`,
  commit `4be58a6`, 7.200 batalhas), o `resolver` sai **49,0% no lado `a` e 51,0% no lado `b`**.
  **E O DADO QUE PRODUZIU ISTO NÃO EXISTE MAIS**: a saída ficava em `.sim/techlead-modosite`
  (gitignorado) e foi apagada depois de medir, porque não é resultado publicado desta frente,
  é só o registro de uma tentativa. **O 49,0/51,0 não é reproduzível a partir deste
  repositório hoje** — quem quiser conferir tem de rodar de novo (`node scripts/sim/bateria.mjs
  --n 100 --semente 20260903` no commit `4be58a6`), não citar o número como se o corpus
  existisse. **Mas isso não responde à pergunta feita, por duas razões:**

  1. **não existe criatura nenhuma no elenco desta frente** (decisão D25): os dois lados são
     sempre arquétipos de PC, então "lado" aqui não é "criatura contra PC", é "PC contra PC", e
     o resultado quase-metade-a-metade é só o reflexo de os dois lados serem simétricos — não
     ensina nada sobre quanto custaria numa mesa com monstro;
  2. **e mais fundo: a divisão por `lado` responde "quem atacou", não "quem está sentado
     operando a tela".** Na simulação o mestre é quem resolve `resolver` nos dois lados sempre;
     o que muda numa mesa real é se o JOGADOR também mexe na tela quando o golpe é dele, e isso é
     exatamente o modo `misto` de novo — não dá para chegar lá contando lado de quem golpeia.

  **Conclusão: a pergunta continua sem número, e não por falta de tentar.** Medir isso de verdade
  exigiria um elenco com criatura, que esta frente decidiu não construir (frente encerrada,
  `ESTADO.md`). A conversa com a mesa segue sem número, como estava.
- [ ] **L24 · [DEPOIS] O ⏭ é um terço do trabalho do mestre, e nenhuma regra o toca.** Medido em
  03/09 (`09` §2.3 e §2.4): o clique de avançar o Tick são 33% dos gestos do mestre na fase de
  combate, contra 50% de classe iii e 17% de classe ii. Ele é o item mais frequente da mesa, o
  único imune a todas as quinze bandeiras, e **61% das vezes ele não produz nada** (o Tick não
  consulta ninguém). Um avanço que corresse sozinho até a próxima parada cortaria 20% do trabalho
  total **sem tocar em regra nenhuma**, e é a maior economia isolada que esta frente mediu.

  **As três ressalvas viraram número em 03/09**, e o levantamento ficou mais honesto e menor:

  - **o piso é 11,4%, e não 20%.** O log passou a separar o Tick sem PARADA (61%, ninguém
    consultado, mas as peças podem estar andando) do Tick MORTO (35%, e também ninguém saiu do
    lugar). Só o segundo é seguramente pulável; os 26 pontos de diferença são travessia, e pular
    ali é trocar clique por não ver o tabuleiro mudar;
  - **o ganho em CLIQUES não inverte a leitura, afia.** Por batalha: 43 no duelo a distância, 7 na
    multidão a média distância, e **zero no piso** nas três células de re-projeção, que são
    justamente as de carga alta. Nas células encostadas teto e piso são iguais, porque ali ninguém
    anda: o Tick vazio do combate encostado é espera de ciclo de arma, e o mestre nunca precisa
    vê-lo;
  - **com jogador na mesa a contagem NÃO muda, só o custo.** `declarar` já é uma parada em toda
    declaração (228.332 delas), então o Tick em que alguém declara já não é vazio hoje. Com `G`
    gestos por declaração manual, **o trabalho do mestre não muda** (a declaração à mão é gesto do
    jogador; achado da revisão, rodada 01 da caixa), e a economia sobre ele continua 11,4% com
    piso; sobre o trabalho da MESA (mestre mais jogadores) ela vai de 11,4% (G=0) a 6,2% (G=4),
    e os cliques poupados em números absolutos não mudam nada. **E a banda fechou em 03/09**,
    lendo o diálogo em vez de medir gente: são **2 gestos pelo arrasto** (soltar a peça em cima do
    alvo, mais o OK) e **4 pelo menu** (botão direito, ⚔, clique no alvo, mais o OK), com o
    diálogo abrindo em todos os padrões que o robô usaria.
    Isto não era o L7 e não precisava de bateria nenhuma.

    **E a MESA COMUM ficou medida na rodada 03 da caixa**, com o `declarar` contado por lado no
    `log.mjs` (bateria `bmtlxp622`). As linhas de 6,2% a 8,1% eram o caso extremo, em que TODA
    peça das duas facções é declarada à mão; numa mesa comum os jogadores declaram um lado e o
    robô declara os NPCs do outro. Das 228.332 declarações, **102.940 são do lado `a` e 125.392 do
    lado `b`**. ⚠ **Esses números caíram com o conserto da iniciativa** (a iniciativa era função
    só do ordinal, e o ordinal é dado em bloco por lado: o desempate da fila saía igual em todas as
    batalhas e sempre para o mesmo lado). A explicação publicada, de passo dobrado, era falsa: o
    eixo do passo estava cortado desde 03/09. Refeita a bateria (`09-bmtmbdppb.txt`), a repartição
    é **116.293 e 130.772**, ou 47,1% contra 52,9%, e a assimetria que sobra é dos arquétipos
    diferentes das células `coprimo`. Pagando `G` em um lado só: **8,8% a 9,0% com `G = 2`** e
    **7,4% a 7,7% com `G = 4`**, no modo `mesa`. A largura entre os dois lados continua pequena
    demais para mover decisão. **A leitura de hoje está em `docs/simulacao/ESTADO.md`.**

    **O que continua fora da conta**, e é outra pergunta: o número de peças de jogador numa cena
    de verdade não é metade dela, e o jogador que não aceita o padrão do diálogo paga mais que
    `G`. As duas puxam para lados opostos e nenhuma está medida.

    **A banda é do jogador que ACEITA O PADRÃO**, e não do jogador: quem troca a manobra, o modo
    de deslocamento ou o alvo paga mais, e a bateria não sabe com que frequência isso acontece,
    porque nenhuma peça dela escolhe. 2 e 4 são o piso do custo manual, não a média dele.

  **E o desenho do avanço já nasceu corrigido por uma coisa que só apareceu lendo a mesa** (`09`
  §2.4): o Tick morto do HARNESS não é o Tick morto da MESA. `avancarTickSimultaneo` chama
  `verificarEfeitos` a cada Tick, e ali uma Arte no chão vence prazo, morde quem está dentro,
  aplica dano e põe condição, **sem parada nenhuma e sem ninguém sair do lugar**. Nenhuma batalha
  da bateria tem Arte, então esse caminho nunca rodou nela. **O avanço tem de parar quando alguém
  é consultado E quando um efeito morde**, e tem de mostrar o que passou no caminho em vez de
  pular calado. Isso é projeto, e não ressalva.

  **E ele vem DEPOIS do L26, e não em paralelo:** com a troca de modo de rolagem o ⏭ passa de
  32,8% para 49,4% do trabalho e a economia do avanço sobe de 11,4% para **17,2%** com piso. O
  avanço não fica menos importante depois da conversa, fica mais, e medi-lo antes seria medir
  contra um denominador que a conversa pode encolher.

  **E ELE É UM DESENHO SÓ COM O CLIQUE DO CARTÃO**, e não dois itens: `instanteDeGolpe` tranca o
  avanço exatamente no Tick em que o cartão do golpe vence, então o clique do relógio e o do
  cartão são o mesmo instante da mesa separados por um gesto. O avanço para **abrindo a folha do
  golpe que o fez parar**. Separá-los produziria duas interfaces que se atrapalham.

  **Quanto isso poupa junto, e é menos que a soma:** os golpes chegam em CACHO (2,87 por Tick que
  tem golpe), então uma parada absorve **um** cartão e os outros continuam sendo clique. São
  64.209 cartões absorvidos de 184.034 (34,9%). No modo `site`: 17,2% do avanço mais **8,8%** dos
  cartões = **26,0%** juntos, com piso; 38,9% com teto. A segunda metade adiciona 8,8 pontos, e
  não 25.

  **Não está decidido e nada foi implementado.** O que ainda falta para decidir é uma peça que se
  MOVA diferente do robô (o L20): ela muda a trajetória, e portanto a fatia de travessia que
  separa o piso do teto.
- [ ] **L23 · [DEPOIS] A fração de gestos com JOGADOR na mesa.** Os 50% da `09` §2.2 são do robô,
  em que `declarar` custa zero clique. Com jogadores, declarar vira um diálogo inteiro e o
  denominador cresce muito mais que o numerador: **a fração de classe iii vai cair**, e ninguém
  sabe para quanto. É a pergunta mais importante que a bateria de 03/09 deixou em aberto, e ela
  precisa de uma peça de jogador no elenco.
- [ ] **L20 · [DEPOIS] Uma política que recua**, que é a peça que falta para o eixo E4 existir.
  A `decisaoAutomatica` avança para o alvo e nunca se afasta dele, então a assimetria de passo é
  inerte (medido em 03/09, D31): quem anda mais depressa só chega mais cedo. Sem alguém que se
  afaste, metade da geometria do Grid nunca é exercitada.

- [ ] **L7 · [DEPOIS] A medição de campo do Supabase real**, decidida para depois do harness. Sem
  ela, as métricas de carga saem em Ticks e em gestos e nunca em segundos, e essa é a maior lacuna
  conhecida do conjunto.

- [x] **L37 · RESOLVIDA em 05/09/2026 · A dupla cobrança do −2 da Investida** · *a mesa escolheu
  **O GRID ALIMENTA A CONDIÇÃO**: o número mora só na condição, e o tabuleiro passa a alimentá-la.*

  **AS OPÇÕES ESTÃO NOMEADAS E NÃO NUMERADAS, e isso é conserto de um defeito de registro.** Este
  verbete dizia "a mesa escolheu a terceira", porque a lista escrita aqui embaixo tinha uma ordem, e
  a caixa de escolha que a mesa de fato respondeu tinha outra: lá, a escolhida era a PRIMEIRA. As
  duas listas concordavam no conteúdo e discordavam no número, então o número não identificava nada
  · quem lesse "a terceira" daqui a três meses leria *o automático sai*, que é o oposto do que foi
  feito. **Opção de decisão se chama pelo nome. O número depende de qual lista você está lendo.**

  **O que foi construído:** a escada do motor deixou de cobrar a Investida (`defesaPerdida` voltou
  a `e.preparo` puro no Preparo, com o porquê escrito no lugar). Declarar Investida no Grid passa a
  **aplicar a condição `investindo` sozinho**, marcada com `auto: true`, e a varredura do Tick a
  **tira quando o Preparo acaba** (`marcarInvestida` e `varrerInvestida`, no `grid.astro`).

  **A remoção precisou ser explícita, e isso foi achado no caminho: o `ate` de uma condição não
  tira ninguém.** `somarCondicoes` (`src/lib/mesa-core.ts:164`) soma tudo sem olhar prazo, e nenhum
  ponto do sistema lê a chave `ate` de uma condição. Sem a varredura do Tick, a marca ficaria
  grudada para sempre, penalizando em silêncio, que é pior que a dupla cobrança que ela conserta.

  **E AQUI ESTA ENTRADA CORRIGE A SI MESMA**, porque a primeira redação dizia "nada neste sistema
  varre condição vencida" e generalizava demais. O certo é mais estreito e muda o tamanho do
  problema por uma ordem de grandeza: a condição posta por Arte **é** varrida, só que **pelo relógio
  do EFEITO e não pelo da condição**. O `verificarEfeitos` derruba todo efeito vencido a cada Tick
  (`ATIVOS.filter((e) => venceu(e, t))`, `src/lib/artes-grid-mesa.ts:1766`) e o `encerrarEfeito`
  **leva a condição junto** (`src/lib/artes-grid-mesa.ts:1889`). O `ate` da condição é redundante
  com isso, não a única linha de defesa. Quem fica grudado de verdade é só quem põe condição **sem
  deixar efeito para trás**, que é o caso da Investida e mais um · ver **L38**.

  **O `auto` separa as duas mãos:** só a condição que o tabuleiro pôs é tirada pelo tabuleiro; a que
  o mestre pôs à mão fica até ele tirar, que é o mesmo respeito que o `porArte` das Artes tem. E se
  já houver uma à mão, o tabuleiro não põe outra · duas somariam −4 e o defeito voltaria por dentro.

  **A prova está na mesa** (`cenaInvestidaUmaVez`, `scripts/test-grid-simultaneo.mjs`), em três
  asserções que só valem juntas: declarar **põe** a condição; é **uma** e não duas; e o relógio a
  **tira** quando o Preparo acaba. Mais o par que impede a primeira de passar com o motor ignorando
  `mov` inteiro: o modo continua vivo, e continua mudando o passo e a travessia.

  ---

  **O levantamento que produziu a escolha**, guardado porque é o que a justifica:

  **O defeito, em uma linha:** quem declara Investida no Grid **e** liga a condição `investindo` à
  mão paga **−6**, e a régua diz −4. As duas cobranças se somam sem se conhecer, porque a
  `defesaEfetiva` empilha `condicoesDefesa` e `defesaPerdida` como parcelas independentes
  (`return alvo.defesaBase`, `src/lib/lance.ts:159`). Nenhuma das quatro fontes diz −6, e ninguém
  decidiu esse total.

  **O QUE O LEVANTAMENTO MUDOU NA PERGUNTA, e é por isso que ela voltou para a mesa em vez de virar
  conserto:** os dois caminhos, **sozinhos**, já dão o −4 certo · e por aritméticas diferentes.

  | caminho | quem o usa | a conta | total |
  |---|---|---|---|
  | automático (`defesaPerdida`) | quem declara Investida no Grid | **substitui** a guarda do Preparo pela da Corrida | −4 ✓ |
  | à mão (condição `investindo`) | quem joga só pela aba Combate | **soma** −2 à guarda do Preparo | −4 ✓ |
  | os dois juntos | quem faz as duas coisas | −4 da Corrida + −2 da condição | **−6** ✗ |

  Ou seja: **não são duas cópias de um número, são duas contas diferentes que caem no mesmo total.**
  Por isso não dá para "tirar a cópia": tirar qualquer um dos dois tira um caminho inteiro de quem
  o usa. E a aba Combate **não tem tela de modo de deslocamento nenhuma** (`MODOS_MOV` não aparece
  em `combate.astro`), então para ela a condição não é redundância, é o único caminho.

  **AS OPÇÕES, e a escolha muda comportamento em cada uma:**

  - **O NÚMERO SAI DA CONDIÇÃO** (ela vira rótulo sem número). O Grid fica certo; **a mesa que joga
    só pela aba Combate perde a Investida**, e não ganha substituto (`correndo` daria −6);
  - **O AUTOMÁTICO SAI** (tudo volta para a condição). A aba Combate fica como está; **o Grid volta
    a não cobrar nada até o mestre trocar de aba**, que é exatamente o defeito nomeado no cabeçalho
    do `src/lib/mesa-condicoes.ts` e a razão de o item 1 da fase 2 ter existido;
  - **O GRID ALIMENTA A CONDIÇÃO** · aplicá-la sozinho ao declarar, e o automático sai. O número
    passa a morar num lugar só, os dois caminhos continuam funcionando e **ninguém perde nada**. É a
    mais cara: a condição precisa ser TIRADA quando o Preparo acaba, e o fim do Preparo é um Tick,
    não um número de turnos, então ela precisa de um `ate` explícito. Em troca, é o mesmo desenho
    que a Corrida vai pedir na fase 3, e resolve as duas de uma vez.

  **A mesa escolheu O GRID ALIMENTA A CONDIÇÃO.** E fica registrado o que foi recusado: fazer o `defesaPerdida` olhar as
  condições do combatente para não dobrar. Ela recebe uma `Acao` e não um combatente, de propósito ·
  é o que a mantém pura e testável sem mesa, e é o que faz o espelho valer.

  **E o que sobra para a fase 3 é a Corrida, pelo mesmo desenho.** Ela tem hoje o defeito oposto e
  mais antigo: **nenhuma cobrança automática nenhuma** · o −4 dela em `MODOS_MOV` é só o texto da
  nota (`nota: \`Defesa ${CORRIDA.defesa`, `src/lib/combate-tempo.ts:912`), e quem cobra é só a
  condição `correndo`, à mão. É o defeito nomeado no cabeçalho do `src/lib/mesa-condicoes.ts`, e o
  `marcarInvestida` é o molde pronto do conserto dele.

  **ACHADO EM 06/09/2026, RESPONDENDO SE ISTO JÁ ESTÁ NA FILA: estava só como nota, e virou item
  com custo.** A pergunta era só "o Grid aplica ou o mestre digita" — a resposta é **o mestre
  digita**, hoje, e o custo disso nunca tinha sido contado.

  **O CUSTO, pelo mesmo molde do `custo-tela.mjs`.** Aplicar `correndo` à mão é o caminho do
  MENU, e não existe caminho mais curto porque `abrirCondicoes` só é chamada de um lugar
  (`grid.astro:7077`, dentro do `switch` do menu de contexto): botão direito na peça (1) + ◈
  Condições (1) + clicar o chip "Correndo" no catálogo (1, `mesa-condicoes.ts:100-106`) + fechar
  o diálogo (1, `mesa-condicoes.ts:126`) = **4 gestos para aplicar**. Tirar quando a Corrida
  acaba é o MESMO caminho, trocando o chip do catálogo pelo **✕** do chip ativo
  (`mesa-condicoes.ts:80-85`): mais **4 gestos**. Uma Corrida completa (começa e termina) custa
  **8 gestos**, contra **0** da Investida, que o tabuleiro aplica e tira sozinho desde a decisão
  de 05/09 (`marcarInvestida`, `grid.astro:5990`).

  **NÃO ENTRA NA ESCADA DESTA BATERIA, e a razão é a mesma do `modoCorre`/`adiaGolpe` do L48:
  ocasião zero.** A `decisaoAutomatica` foge com `mov.modo: 'corrida'` direto no objeto da ação
  (`motor.mjs:249`), sem abrir diálogo nenhum: é o robô fugindo, headless, e ninguém aplica
  condição em ninguém. O custo dos 8 gestos só existe numa mesa com **Corrida declarada por
  gente** (perseguir, reposicionar), que esta bateria não tem (`bateria.mjs`, a lista de
  invenções: nenhuma peça de jogador). **Fica registrado aqui, e não na escada**, para não
  inventar uma medição sobre cenário que a bateria não roda — a mesma régua que já se aplicou ao
  redirecionamento do golpe no caído (⚑ do manifesto).
  mesa, a peneira saiu do levantamento, e o par de asserções segura as duas metades.*

  **O QUE FOI CONSTRUÍDO.** O `varrerCondicoesVencidas` (`src/lib/artes-grid-mesa.ts`) derruba toda
  condição com `ate` cumprido, escreve uma linha no registro da mesa por condição derrubada, e roda
  de dentro do `verificarEfeitos` · que é o que os DOIS sistemas de tempo já chamam quando o relógio
  anda (`encerrarVez` no clássico, `avancarTickSimultaneo` no Simultâneo).

  **ELA RODA ANTES DO CORTE DO CHÃO LIMPO**, e isso é o desenho e não descuido. O
  `verificarEfeitos` sai cedo quando não há efeito no tabuleiro, e quem fica grudado é justamente
  quem põe condição SEM deixar efeito para trás. Depois do corte, a varredura não rodaria em
  nenhuma mesa sem Arte no chão, que é exatamente a mesa em que o empurrão prende a condição.

  **E NÃO RODA NO CARREGAMENTO, de propósito.** A varredura é do relógio, e abrir a tela não é
  evento de relógio · além de a tela do jogador não poder escrever em `combatentes`. As condições
  presas de mesa antiga caem no primeiro Tick que o mestre andar, que é o primeiro momento de jogo
  e não o primeiro momento de olhar.

  **O PAR DE ASSERÇÕES** (`cenaCondicaoQueVence`, `scripts/test-grid-simultaneo.mjs`), e nenhuma
  das metades vale sozinha: só "a condição com `ate` some" passa igual se a varredura estiver
  derrubando TUDO, inclusive o que o mestre pôs à mão, que é o defeito que a regra existe para
  impedir; só "a do mestre fica" passa com a varredura desligada. **Falsificadas as duas**, uma de
  cada vez, e cada falsificação deixou a outra metade verde · que é o que prova que são duas
  medidas e não uma escrita duas vezes.

  A de vencer vem da bancada (`?extras=presa`), semeada como o `deslocar` a deixa: `ate` e
  `porArte`, sem efeito atrás. **A de ficar vem do diálogo de verdade**, e não de semente, porque a
  propriedade que sustenta a peneira é que o diálogo do mestre não grava `ate`, e isso só vale
  medido na saída dele.

  **AS DUAS TRAVAS DO DIA EM QUE A FEATURE CHEGAR.** A peneira é frágil de um jeito específico: no
  dia em que o diálogo do mestre ganhar campo de duração, ele passa a gravar `ate` e a peneira muda
  de significado sem que ninguém encoste nela.

  | trava | onde | quando fala |
  |---|---|---|
  | a barata | `validate-data.mjs`, lendo o `mesa-condicoes.ts` | a cada commit, 7 s |
  | a de fora | `cenaCondicaoQueVence`, varrendo todas as peças | no smoke e no CI |

  A primeira lê o ARQUIVO do diálogo, porque o defeito nasce no código; a segunda varre as
  condições de todas as peças e recusa qualquer uma com `ate` sem `porArte` e sem `auto`.
  **Falsificadas as duas**, e pelos dois caminhos de escrita do diálogo (o chip do catálogo e o
  formulário caseiro). A de fora pegou o que o par sozinho não pegou: com o diálogo gravando
  `ate: 3` e o relógio ainda no Tick 1, a asserção do sobrevivente passava.

  ### OS TRÊS PONTOS DE `condicoes` FORAM RECLASSIFICADOS, e a classificação velha caiu pelo mesmo
  motivo que o "inerte" da 35

  **Eu os tinha tratado como "o mestre sozinho numa caixa". Está errado**, e o erro é a FACHADA
  (**L45**): os três escrevem por `ctx.SB`, e na aba do jogador o `ctx.SB` é o `sbDoJogador()`, que
  troca `from('combatentes').update(...)` por **`jogador_muda_peca`**. Achado pela revisora **antes
  de qualquer conserto**, que é a diferença para as duas vezes anteriores.

  | ponto | o que faz | vai para a RPC? |
  |---|---|---|
  | `porCondicao`, `artes-grid-mesa.ts:1331` | **PÕE**, escrevendo o vetor inteiro | **sim** · chamado do `gravarEfeito` e da saída, sem trava de mestre |
  | `tirarCondicao`, `artes-grid-mesa.ts:1359` | **TIRA**, escrevendo o vetor inteiro | **sim** · chamado do `encerrarEfeito`, que roda na aba do jogador |
  | `varrerCondicoesVencidas`, `artes-grid-mesa.ts:1730` | **TIRA**, escrevendo o vetor inteiro | **não** · abre com `if (!ctx.mestre) return;` |

  **O AVISO, E ELE ESTÁ ESCRITO ANTES DE CUSTAR ALGUMA COISA:** a `jogador_muda_peca` hoje
  **substitui**: `supabase/migracao-22.sql:125` é `condicoes  = coalesce(p_dados->'condicoes', condicoes),`
  Isso está CERTO para os três, porque o cliente manda o vetor inteiro nos três. **Se alguém
  "consertar" a `jogador_muda_peca` fazendo `condicoes` SOMAR** · que é exatamente o conserto que a
  migração 35 foi · **o `tirarCondicao` para de tirar**, e a condição do efeito encerrado fica no
  combatente para sempre.

  **É A TERCEIRA VEZ QUE O MESMO CONSERTO QUEBRARIA UMA REMOÇÃO**, e a primeira em que está escrito
  antes: o `||` da 35 quebrou a `__a_sair`; a mesma forma está no `mordidos` inteiro; e aqui estão
  duas remoções esperando. **Quem mexer na `jogador_muda_peca` dá o vocabulário de remoção no mesmo
  arquivo**, como a 36 fez, ou não mexe. → *a remoção escrita como coleção inteira*, no
  `docs/simulacao/CATALOGO.md`.

  **QUANDO A FEATURE CHEGAR, o conserto não é apagar a trava**: é ensinar a varredura a separar
  prazo PEDIDO de prazo HERDADO (por `porArte`/`auto`, que já viajam gravados), e só então soltá-la.

  ---

  *O levantamento que produziu a regra, guardado porque é o que a justifica:*

  **A REGRA, decidida pela mesa antes do levantamento:**

  > Condição com `porArte` e `ate` **vence sozinha**: a duração é da ficção, o motor é dono dela, e
  > ela cai quando o prazo chega. Condição posta pelo mestre à mão **NÃO vence sozinha, nunca**. Ele
  > a pôs, ele a tira. A régua não calcula por cima dele.

  É o mesmo princípio da ficha do lance e do −4 da Investida podendo ser tirado à mão. Se o mestre
  quiser prazo numa condição posta à mão, isso é **feature e não é agora**: quando vier, ela grava
  `ate` e passa a vencer, porque aí ele pediu.

  **E A REGRA NÃO PRECISA DE DADO NOVO, que é o que a torna barata.** Os três caminhos já se
  separam sozinhos pelo que gravam:

  | quem põe | onde | o que grava | vence sozinha? |
  |---|---|---|---|
  | Arte | `porCondicao` | `{ id, ate, porArte: true }` | sim |
  | tabuleiro | `marcarInvestida` | `{ id, ate, auto: true }` | sim |
  | mestre à mão | o diálogo de condições | `{ id }`, ou o objeto caseiro | **não** |

  Os três, com linha. A Arte grava em
  `const nova = { id, ate, porArte: true };`, `artes-grid-mesa.ts:1352`. O chip do catálogo grava em
  `c.condicoes = [...(c.condicoes || []), { id: achou.id }];`, `mesa-condicoes.ts:103`, e o
  formulário caseiro logo abaixo, no `cc-add`.

  **Nada que o mestre põe à mão tem `ate`, e nada que tem `ate` foi posto à mão.** A peneira é
  literalmente "tem `ate`?" · é UM mecanismo e não dois, e `porArte`/`auto` viram detalhe de quem
  pôs, não de quem tira.

  **O CATÁLOGO NÃO TEM PRAZO NENHUM.** Nenhuma das 55 condições de `condicoes.json` tem campo de
  duração · os campos são `id`, `nome`, `icone`, `grupo`, `cor`, `nota`, `fonte` e os números.
  **Prazo nunca foi propriedade da condição, só da aplicação.** E o diálogo do mestre não tem campo
  de duração para oferecer: o chip do catálogo grava `{ id }` e o formulário caseiro grava
  nome/ação/dados/defesa/porRodada/nota. Ou seja, **a metade "posta pelo mestre com duração" da
  pergunta é vazia hoje**, e é exatamente por isso que ela é feature e não conserto.

  **O QUE ESTÁ MESMO GRUDADO, e é pequeno.** Só quem põe condição **sem deixar efeito para trás**,
  porque todo o resto sai junto do efeito (ver a correção no **L37**). São dois casos:

  1. **a Investida** · consertada no L37, pela `varrerInvestida`;
  2. **o empurrão** (`if (g?.condicao) for (const a of ajustes)`, `artes-grid-mesa.ts:1132`), o
     caminho das Artes que deslocam. Ele resolve **na
     declaração** e sai por `return await deslocar(...)` (`:788`) **antes** do `gravarEfeito`, então
     não existe linha em `arena_efeitos` para vencer, e o `encerrarEfeito` nunca é chamado.

  São **6 dos 140 Efeitos**, e duas condições: `caido` (Empurrão, Onda, Maremoto, Onde É Embaixo,
  Tromba) e `imobilizado` (Engolir). O que elas penalizam, para dimensionar o estrago: `caido` é
  Defesa −2 de perto e **+2** de longe; `imobilizado` é ação −2 e Defesa −4. Ou seja **`caido`
  grudado ajuda o alvo contra flecha**, e `imobilizado` grudado é a pior das duas de longe.

  A janela é desde **11/08/2026** (`2540221`, o commit que trouxe as Artes ao tabuleiro), e só em
  mesa que usou o Grid.

  **DE QUEBRA, e virou o L39: 9 Efeitos de `forma: "nenhuma"` declaram uma `condicao` que o Grid
  NUNCA aplica.**

  **O TAMANHO: NINGUÉM SABE, e não dá para saber daqui.** A chave anon é a única leitura de produção
  possível, e a RLS faz o que foi desenhada para fazer · `combatentes`, `combate_visao` e
  `arena_efeitos` devolvem `Content-Range: */0` com `Prefer: count=exact`, porque o papel anônimo não
  é membro de mesa nenhuma. **Contar exigiria a chave de serviço, e ela não está aqui.** A resposta
  fica sendo essa, e ela também é resposta.

  **A CONSEQUÊNCIA ESCRITA JUNTO:** cena em andamento vai perder condições que hoje estão
  penalizando. **Alguém vai ver um número mudar sem ter feito nada.** É o conserto certo e ainda
  assim é surpresa, então a varredura **diz no registro da mesa o que caiu e por quê**, uma linha
  por condição derrubada, e não em silêncio. Uma correção ao que estava escrito aqui antes de
  construir: não é "no primeiro carregamento", é **no primeiro Tick que o mestre andar** · ver o
  porquê lá em cima.

- [x] **L39 · [FEITO em 07/09/2026, rodada 19] Os 9 Efeitos que declaram uma condição e não a
  aplicam** · *achado em 05/09/2026, no levantamento da L38. Registrado com o enquadramento
  porque foi ele que decidiu o conserto: separar `grid.condicao` (motor, 57 Efeitos) de
  `grid.condicaoAparente` (só classificação, os 9).*

  Nove Efeitos têm `grid.forma: "nenhuma"` **e** `grid.condicao` preenchida. Esse caminho registra
  no log e retorna (`if (forma === 'nenhuma')`, `src/lib/artes-grid-mesa.ts:779`), então a condição
  declarada nunca chega a ninguém. Condição escrita no dado e nunca executada, que é o mesmo feitio
  do −6 do **L34 §5**.

  São: Sugestão Plantada e Reescrever (`dominado`), Esquecer (`confuso`), Aviso e Momento Certo
  (`abencoado`), Instante e Lapso (`acelerado`), Rosto Esquecível (`invisivel`), Esconder a Carga
  (`escondido`).

  **DOS DOIS ENQUADRAMENTOS, É O PRIMEIRO: a condição está no dado como CLASSIFICAÇÃO, e não como
  instrução.** Não são 9 Efeitos que deixaram de fazer o que dizem. Três coisas apontam para o
  mesmo lado:

  1. **os nove declaram `alvo: "nenhum"`**, junto de `ancora: "nenhuma"` e `persiste: false`. Não há
     a quem aplicar: o bloco não nomeia alvo nenhum. Aplicar exigiria inventar o alvo, não destravar
     um caminho;
  2. **são as Artes cujo efeito é ficção e não geometria** · memória, lealdade, aviso, timing. Elas
     não têm forma no tabuleiro porque de fato não têm forma no tabuleiro, e é isso que
     `forma: "nenhuma"` quer dizer;
  3. **e uma delas prova o ponto sozinha:** Rosto Esquecível declara `invisivel`, que na régua é
     **Defesa +4**, e o próprio texto do Efeito diz *"Não esconde nada: só apaga a lembrança de ter
     visto."* Aplicar seria o defeito, não deixar de aplicar.

  **NENHUM CONSERTO UNIFORME SERVE, e é isso que fecha o enquadramento.** Os nove não querem a
  mesma coisa: Lapso (*"a próxima ação dele sai mais cedo"*) e Instante declaram `acelerado`, que é
  velocidade −2, e esses dois leem como se quisessem mesmo a condição · enquanto Rosto Esquecível
  prova que aplicar seria o defeito. **Apagar o campo nos nove quebra dois; ligar a aplicação nos
  nove quebra os outros sete.** Qualquer regra que trate os nove igual erra em pelo menos dois.

  **A PERGUNTA DE VERDADE É O QUE O CAMPO SIGNIFICA**, e hoje ele tem dois significados:
  `grid.condicao` é lido como *"a condição que isto aplica"* em 57 Efeitos e escrito como *"a
  condição com que isto se parece"* em 9. **Um campo com dois sentidos é o defeito**, e a saída
  provavelmente é **separá-lo em dois**: um que o motor executa e um que só classifica. Aí cada um
  dos nove escolhe o seu, e a triagem vira leitura de nove linhas em vez de uma regra que não
  existe.

  **DECIDIDO em 07/09/2026: separar em dois campos** (um executado pelo motor, para os 57; um só
  de classificação, para os 9). **COM PRÉ-REQUISITO, e não como ressalva:** antes de qualquer
  código, levantar TODO consumidor de `grid.condicao` no repositório, um a um, e dizer quantos são
  — não só os que aplicam a condição, também os que só leem para exibir ou gerar conteúdo. **Se
  algum consumidor for gerador de capítulo** (`gen-cap-*`, ou qualquer coisa que produza texto
  publicado a partir do dado), o risco não é a tela parar de mostrar algo: é o **capítulo publicado
  mudar sem ninguém ter pedido**, que é regra saindo de refatoração. Achando um caso desses, parar
  e escalar antes de fazer o split.

  **A CONTAGEM, feita em 07/09/2026, antes de qualquer código.** Nenhum consumidor é gerador de
  capítulo — a trava não dispara — mas são **mais sítios do que a seção original nomeava** (ela só
  citava o `if (forma === 'nenhuma')` de `:779`). Dezesseis pontos de leitura em cinco arquivos:

  **MOTOR, sete blocos — chamam `porCondicao`/`tirarCondicao`, aplicam ou retiram de verdade:**
  `src/lib/artes-grid-mesa.ts:1149` (`await porCondicao(ctx, combDe(ctx, a.cid), g.condicao, plano.turnos);`);
  `:1242` (`await porCondicao(ctx, combDe(ctx, id), plano.condicao, turnosRestantes(ef, t));`);
  `:1299`, onde `plano.condicao` da linha de cima nasce (`condicao: g?.condicao || null,`);
  `:1330` (`if (g?.condicao && !deveSair(novo)) {`);
  `:1587` (`if (ef.condicao) await porCondicao(ctx, alvo, ef.condicao, turnosRestantes(ef, tickAtual(ctx)));`);
  `:1846` (`await porCondicao(ctx, p.alvo, p.ef.condicao, turnosRestantes(p.ef, t));`);
  `:1973`-`1979` (`if (trocouAlvo && ef.condicao) {` até `await porCondicao(ctx, combDe(ctx, id), ef.condicao, d.turnos);`, a condição segue o alvo quando ele muda);
  `:1994`-`1997` (`if (ef.condicao) {` até `await tirarCondicao(ctx, combDe(ctx, cid), ef.condicao);`, dentro de `encerrarEfeito`).

  **PORTÃO, um bloco:** `src/lib/artes-grid-mesa.ts:1808` (`if (!ef.dano_dados && !ef.condicao) continue;`) decide se o Efeito entra no laço da mordida por área
  (2ª metade de `verificarEfeitos`). **Não é o ponto de atenção real** — ver a conferência abaixo.

  **A CONFERÊNCIA QUE FALTAVA, feita em 07/09/2026: os 9 nunca chegam a existir como `ATIVOS`,
  então nenhum dos sete blocos de MOTOR roda para eles — nem o `:1808`, nem os outros seis.**
  A pergunta certa não era "podem pular o laço", era "o que mais o laço faz com eles hoje além de
  aplicar a condição", e a resposta é: nada, porque eles nunca entram no laço, por um motivo
  anterior e mais forte do que qualquer filtro dentro dele.

  1. **Os 9 têm `grid.forma: "nenhuma"`, sem exceção, e a recíproca também vale**: nas 140
     entradas de `src/data/efeitos.json`, `forma === "nenhuma"` e `alvo === "nenhum"` são o
     mesmo conjunto de 37 Efeitos (conferido por varredura total, não amostra), e são os únicos
     nove desse conjunto que também carregam `condicao`.
  2. **O despacho da conjuração é um `if`/`else` excludente sobre essa mesma `forma`**, e o
     primeiro ramo é o dos 9, retornando antes de qualquer outro: `forma === 'nenhuma'` (`src/lib/artes-grid-mesa.ts:798`).
     Os ramos seguintes do mesmo `if`/`else` (que levam a `invocar`/`deslocar`/`encadear`/`grudarNoAlvo`, entre as linhas 802 e 806 do mesmo arquivo) ficam, por construção,
     inalcançáveis para quem já tomou o primeiro ramo. Não é falta de sorte, é estrutura de
     `if`/`else` sobre a mesma variável.
  3. **E todo caminho que leva a `ATIVOS.push` passa por `gravarEfeito`.** O comentário do arquivo
     já nomeia `morder` e `porCondicao` como os `DOIS pontos` por onde toda aplicação de dano ou condição passa nesta mesa (`src/lib/artes-grid-mesa.ts:41`).
     E dentro de `gravarEfeito`, `ATIVOS.push` (`src/lib/artes-grid-mesa.ts:1324`) só roda depois da linha que grava no banco, e é a única ocorrência no arquivo inteiro.

  **Os quatro blocos de MOTOR que não são o laço da mordida** (`:1149`, `:1242`, `:1299`→`:1330`)
  também dependem de `gravarEfeito` já ter rodado — `:1149` é dentro de `deslocar` (o ramo
  `movimento`, inacessível aos 9 pela mesma exclusão do item 2), `:1330` é dentro da própria
  `gravarEfeito`, e `:1242` roda em `saidaDaArte`, chamada só para quem já está em `ATIVOS`
  (`:1794`-`1803`). **Isto corrige a conclusão anterior desta seção**, que dizia que o `:1808`
  "protege a montante" os outros seis: `:1149`/`:1242`/`:1299`/`:1330` nem passam pelo `:1808` —
  o que os protege é o mesmo motivo que protege o `:1808`, o despacho de `:798`, não uma relação
  de precedência entre os blocos de MOTOR.

  **A ASSERÇÃO QUE ISTO PEDE, e que não existe hoje:** a segurança dos 9 depende de um invariante
  de dado (item 1, hoje verdadeiro por acaso de não ter exceção, não por trava) mais um invariante
  de código (itens 2 e 3). Antes do split, escrever DOIS testes, não um: (a) em `validate-data.mjs`
  ou teste próprio, assert que todo Efeito com `forma: "nenhuma"` tem `alvo: "nenhum"` e
  vice-versa, para os 140 — se algum Efeito novo quebrar essa correspondência, o split some por
  baixo dele sem aviso; (b) um teste de Node que chama o despacho (ou `gravarEfeito` diretamente)
  com um Efeito `forma: "nenhuma"` carregando o campo novo de classificação e afirma que `ATIVOS`
  não cresce e `porCondicao` não é chamado — E o par, com um Efeito real (`ao-entrar`, por
  exemplo) afirmando que a condição É aplicada. Um teste sem o outro prova metade: falhar quando
  um dos 57 pára de entrar é tão grave quanto falhar quando um dos 9 volta a entrar.

  **CORREÇÃO ao item (b), achada pela Executora em 07/09/2026 ao tentar escrever exatamente esse
  teste: "chama o despacho (ou `gravarEfeito` diretamente)" trata as duas formas como
  equivalentes, e não são.** `gravarEfeito` (`:1324`, `ATIVOS.push`) não tem gate nenhum por
  `forma` — empurra sempre, incondicional, é a própria seção que já dizia isso no item 3 acima.
  Quem gate é só o despacho da conjuração (`:798`), e ele é DOM-only (`conjurar` exige `palco:
  HTMLElement`, inalcançável no harness Node do `test-arte-na-mesa.mjs`). Ou seja: não existe hoje
  — nem antes deste split, nem depois — uma prova em Node de que os 9 não entram em `ATIVOS`; essa
  proteção é estrutural (itens 2 e 3 acima), verificada por leitura, não por teste que rode. O que
  É testável em Node, e o que a Executora escreveu em `test-arte-na-mesa.mjs`, é mais estreito e
  ainda assim o que importa PARA O SPLIT: que `porCondicao` é decidido pela presença de
  `grid.condicao`, nunca de `grid.condicaoAparente` sozinho — a rede que pega uma fusão ingênua
  (`g?.condicao || g?.condicaoAparente`) se alguém escrever uma no futuro. Isto é proteção
  SECUNDÁRIA (o campo certo), não a proteção PRINCIPAL (o despacho nunca deixar os 9 chegarem
  lá) — a principal continua sem teste, e adicionar um exigiria harness de navegador para
  `conjurar`, fora do escopo desta frente.

  **CLASSIFICA/EXIBE, quatro blocos, atualizados para ler `ef.condicao || ef.condicaoAparente`
  (fechado, ver `docs/simulacao/caixa/19-executora.md`):**
  `src/lib/artes-grid-mesa.ts:458` (`const condId = ef.condicao || ef.condicaoAparente;`);
  `:1836` (`const condId = p.ef.condicao || p.ef.condicaoAparente;`, texto de log);
  `src/lib/artes-grid.ts:1496`-`1497` (`if (ef.condicao && alvos.length) {`) — a prévia só entra se
  `alvos.length`, e os 9 problemáticos têm `alvo: "nenhum"`: **já seguro por construção, não tocado**;
  `src/lib/artes-grid.ts:1677` (`const condId = ef.condicao || ef.condicaoAparente;`);
  `src/lib/artes-grid-ui.ts:47` (`const condId = g.condicao || g.condicaoAparente;`).

  **RELATÓRIO, sem risco de capítulo, atualizado (fechado):** `scripts/gen-grid-artes.mjs:410` (`efeitosNovos.filter((e) => e.grid.condicao).length`, dentro de um `console.log`, com uma segunda
  contagem nova para `condicaoAparente` logo abaixo) e `:423` (`${e.grid.condicao || (e.grid.condicaoAparente ? \`(${e.grid.condicaoAparente})\` : '')}`,
  atrás de `--lista`, o `condicaoAparente` entre parênteses); o arquivo escreve `artes.json`/`efeitos.json`, não
  capítulo. O gerador (`CONDICAO_APARENTE`, mesmo arquivo, perto de `CONDICAO`) também foi atualizado: era
  quem regenerava `grid.condicao` para os 9 e travava o `--check` do `npm run validate` até fazer isso.

  **VALIDADOR, confere os DOIS campos depois do split (fechado):** `scripts/validate-data.mjs:170` (`if (g.condicao && !COND_IDS.has(g.condicao))`), mais o invariante
  `(g.forma === 'nenhuma') === (g.alvo === 'nenhum')` logo abaixo, na mesma função.

  **O que isto mudou no split:** os sete blocos de MOTOR não precisaram de auditoria individual,
  um a um — a conferência acima já era a prova, e ela é sobre o despacho da conjuração (`:798`) e
  `gravarEfeito` (`:1324`), não sobre o `:1808`.

  **IMPLEMENTADO em 07/09/2026 (rodada 19, commits `0762926`/`4058b4c`/`bdc9680` + `7e56946`,
  aviso em `docs/simulacao/caixa/19-executora.md`).** Os dois testes, o split em `efeitos.json`,
  o validador e os quatro blocos de exibição, todos fechados (ver acima). D19c/D19 achou de
  quebra um bug real e sem relação com o L39: `scripts/rodada.mjs` apontava para um worktree de
  revisora antigo (`centelha-revisora`, sem `techlead-`, parado na rodada 14 de uma equipe
  anterior) e calculava um `BASE` errado, silencioso, sem falhar. Corrigido em `rodada.mjs`
  (`4058b4c`) e no mesmo hardcode de `scripts/duo.mjs` (`7e56946`, decisão do TechLead, mesmo
  conserto). **Ainda sem teste, antes e depois desta rodada:** a proteção PRINCIPAL dos 9 Efeitos
  (o despacho de `conjurar` nunca deixar `forma === 'nenhuma'` chegar em `gravarEfeito`) — provar
  exigiria harness de navegador para `conjurar`, outra frente.

  **Veredito SEGUE em 07/09/2026 (rodada 20, `docs/simulacao/caixa/20-revisora.md`, commit
  `e5bfbf9`):** a Revisora leu `gravarEfeito` e `conjurar` de forma independente (não aceitou a
  leitura do aviso de graça) e recalculou os números direto em `efeitos.json` — confirma que a
  proteção principal é mesmo só o despacho DOM-only, sem caminho Node-testável hoje.

- [ ] **L40 · [MITIGADO EM 05/09/2026 · O CONSERTO É A MIGRAÇÃO 34] O registro do jogador que o
  mestre apaga sem saber** · *só o Grid. A metade que não depende de migração está no ar; a que
  depende espera a 34.*

  **O QUE FOI CONSTRUÍDO, e é mitigação e não conserto.** O `persistirLog` do mestre passou a
  **reler o `log` do banco imediatamente antes de escrever e mesclar por `id`** (`mesclarLog`). A
  janela de perda deixou de ser o atraso da campainha (até ~21 s) e passou a ser o intervalo entre
  o `select` e o `update`, de milissegundos. **A corrida não morreu, encolheu umas quatro ordens de
  grandeza**, e a linha que diz isso está no código, junto da 34 nomeada como o conserto.

  **E A MESCLA PRECISOU DE LÁPIDE**, que é o achado da construção: para o `mesclarLog`, uma linha
  que está no banco e não está na memória é **indistinguível** de uma que acabou de chegar. Sem o
  `LOG_APAGADAS`, toda linha que o mestre apagou voltaria dos mortos na escrita seguinte · a mescla
  desfaria o `desfazer`. A migração 34 não vai precisar dela, porque lá quem apaga é o banco, com o
  id na mão.

  **O REFAZER RELÊ DEPOIS DO CLIQUE**, e não antes de abrir a caixa. A confirmação é uma pausa
  humana de segundos e era a pior janela da corrida: uma Arte conjurada durante a caixa não estaria
  na foto, e o filtro passaria por cima dela.

  **E O REFAZER NÃO APAGA MAIS LINHA DE JOGADOR** · decisão de mesa, no item 3 abaixo.

  **A PROVA** (`cenaLogDoJogador`, `scripts/test-grid.mjs`), com a linha do jogador chegando **na
  TABELA e não no `LOG` da página**, que é o que reproduz a corrida em vez de medir outra coisa:
  os três casos, mais o par da lápide sem o qual o caso 2 passaria pelo motivo errado.

  **DUAS DAS TRÊS FALSIFICAÇÕES RODARAM, e a terceira está devendo.** Tirando a releitura, os casos
  1 e 2 ficam vermelhos (a linha do jogador some do banco) e a lápide continua verde; tirando a
  lápide, só a asserção da lápide fica vermelha (a linha apagada volta, e o banco vai de 42 para
  43 linhas). **A terceira rodou no CI, num ramo descartável**, porque o compilador do Astro nesta
  máquina caiu em `UnknownCompilerError` seis vezes seguidas, com a árvore limpa e com a alterada.
  O portão roda em qualquer ramo: empurrei `falsif/l40-refazer` com o `minha` trocado por `e.ef`, li
  o resultado e apaguei o ramo. **Uma asserção vermelha, e a certa:**

  ```
  ✘ 3 · o Refazer NAO apagou a linha de Arte do JOGADOR: acao dele nao e escrituracao do motor
  ✘ Grid FALHOU (1):
  ```

  **Uma só**, e é isso que fecha a prova: o resto da cena continuou verde, então a asserção mede o
  `porJogador` e não um efeito colateral. **E a técnica fica registrada**: falsificação que a máquina
  não roda se faz num ramo descartável.

  **O QUE FALTA, e é a 34:** enquanto o mestre montar o vetor aqui em vez de o banco montá-lo lá,
  existe corrida. As quatro funções estão propostas gesto a gesto mais abaixo.

  **O DEFEITO.** No Grid os dois papéis escrevem o mesmo campo por caminhos que não se conhecem.

  O jogador acrescenta pelo banco, e o banco lê a coluna e concatena lá dentro:
  `SB.rpc('jogador_registra', { p_arena: ARENA.id, p_linha: linha })`, `grid.astro:10156`.
  O mestre grava o vetor inteiro da memória dele:
  `await SB.from('mesa_arenas').update({ log: LOG }).eq('id', ARENA.id);`, `grid.astro:10191`. **A linha que o jogador acabou de
  registrar some se o `LOG` do mestre for anterior a ela, sem erro nenhum.** É o caminho normal dos
  dois durante uma cena.

  Só o Grid: o `combate.astro` grava `encontros` e não tem RPC de jogador nenhuma.

  ### O tamanho, e ele é uma corrida e não uma certeza

  **O `LOG` do mestre NUNCA é relido antes de uma escrita.** O `persistirLog` escreve a cópia em
  memória, sem `select`. Ele é atualizado só pela campainha do tempo real:
  `if (assuntos.has('registro')) { await carregarLog(true); pintarLog(); }`, `grid.astro:7667`, e é
  o `doBanco` que vai ao banco.

  **Então a janela é o atraso da campainha, e ela tem números.** Todos em
  `src/lib/mesa-tempo-real.ts`:

  | etapa | constante | ms |
  |---|---|---|
  | o aviso do jogador junta antes de sair | `JUNTAR_ENVIO` | 120 |
  | as campainhas juntam antes de virar releitura | `JUNTAR_RECEBIDO` | 220 |
  | e enquanto o mestre está OCUPADO, a releitura é adiada | `RETENTAR_OCUPADO` × `MAX_ADIAMENTOS` | 700 × 30 = **~21 s** |

  **O piso é ~340 ms e o teto é ~21 segundos**, e o teto não é raro: `ocupado` inclui
  `|| !el('tok-menu').hidden || !!document.querySelector('dialog[open]')`, `grid.astro:7582`, e
  diálogo aberto é exatamente o estado do mestre no instante em que ele vai registrar (confirmar
  dano, confirmar acerto, pôr condição). **A janela larga acontece justamente quando ele está
  prestes a escrever.**

  Fora disso, perda total em dois casos: canal de tempo real que não subiu, e aba que ficou fora
  além do `AUSENCIA_LONGA` sem ressincronizar.

  **DESDE QUANDO: 12/08/2026** (`2d9e47d`, a migração 22, "o jogador age no tabuleiro"). E a
  campainha veio ANTES, em 11/08 (`55110b8`): **nunca houve período em que a perda fosse certa.**
  Sempre foi corrida, e o tempo real sempre foi a mitigação que quase sempre ganha.

  ### O conserto NÃO é trocar pelo RPC, e o inventário mostra por quê

  O mestre não só acrescenta. No Grid, cinco gestos chamam o `persistirLog`, e quatro deles não são
  acréscimo:

  | gesto | o que faz hoje |
  |---|---|
  | `logar()` | empurra uma linha e grava o vetor |
  | `desfazer()` | tira a última linha com `acao` (`LOG.splice(idx, 1);`, `grid.astro:10258`) e grava o vetor |
  | `editarLinha(id)` | muda `txt`/`pub` de uma linha, e grava o vetor |
  | `excluirLinha(id)` | tira por id (`LOG.splice(i, 1);`, `grid.astro:10353`) e grava o vetor |
  | `refazerLogDosEfeitos()` | `LOG = LOG.filter((e: any) => !minha(e));` (`grid.astro:10404`) e empurra N linhas novas |

  **E UMA CORREÇÃO AO ENUNCIADO: não existe zerar no Grid.** O `LOG = []` é do `combate.astro`
  (`if (zLog) { LOG = []; await persistLog(); }`, `combate.astro:2068`), na caixa de reiniciar
  combate, e lá não há escritor concorrente. **Zerar não precisa de caminho novo:** precisa ficar
  onde está.

  ### A proposta, gesto a gesto

  | gesto | vira |
  |---|---|
  | acrescentar | `mestre_registra(arena, linha)` · concatena no banco, igual à do jogador |
  | apagar por id | `log_apaga(arena, id)` · o banco filtra o `jsonb` por `id` |
  | desfazer | a mesma `log_apaga`, com o id da linha desfeita |
  | editar | `log_edita(arena, id, txt, pub)` · o banco troca só aquele elemento |
  | refazer os efeitos | `log_refaz_efeitos(arena, linhas)` · apaga onde `ef` e concatena as novas, numa transação |

  **A PERGUNTA QUE MUDARIA A NATUREZA DO CONSERTO, respondida: não muda.** O `jsonb` do Postgres não
  remove elemento por predicado sem reconstruir o array, então sim, o vetor inteiro é reescrito.
  **Mas reescrito a partir do valor que está NA LINHA, dentro do próprio `update`:**

  ```sql
  update mesa_arenas
     set log = coalesce((select jsonb_agg(x) from jsonb_array_elements(log) t(x)
                          where x->>'id' <> p_id), '[]'::jsonb)
   where id = p_arena;
  ```

  O `log` do lado direito é o do banco no instante da escrita. **A linha que chegou depois da foto
  do mestre está nesse `log` e sobrevive.** O que causa a perda é a FOTO LOCAL, e não a reescrita
  do vetor · e é a foto que sai.

  **E UM ACHADO NO INVENTÁRIO, que virou decisão de mesa: o Refazer NÃO apaga linha de jogador.**
  Ele apagava toda linha marcada `ef`, e a marca é posta pelo `logar` que a aba entrega ao módulo
  das Artes (`logar(c, txt, { ...extra, ef: true })`, `grid.astro:2702`) · **inclusive quando quem
  conjurou foi o jogador**.

  **A mesa decidiu em 05/09/2026 que não apaga**, e o motivo é o que dá a regra: *o Refazer existe
  para reconstruir o que o MOTOR escreveu sobre efeitos, e a Arte que o jogador conjurou é ação
  dele, não escrituração do motor. Apagar linha de jogador para reescrever com a do mestre é o
  mestre editando o registro do outro sem ter pedido.*

  **O DADO NÃO DISTINGUIA, e o que faltava era uma marca.** A linha do registro é
  `{ id, ts, txt, pub, ...extra }` e **não tem autor nenhum** · o `ef` diz que o módulo das Artes
  escreveu, não quem. Então entrou o `porJogador`, carimbado no `logar` por quem escreve, que é
  quem sabe. É da mesma família do `porArte` das condições, como a mesa previu: **quem escreve
  carimba, quem apaga lê o carimbo.**

  A marca é positiva no jogador e não no mestre por dois motivos: a linha sem dono é do mestre na
  esmagadora maioria, e só o jogador tem dono a proteger. **O que ela não alcança são as linhas de
  jogador de ANTES do carimbo**, que continuam sem como ser reconhecidas · a mesma limitação que o
  próprio `ef` já tinha, e escrita no lugar.

  ### O que travava a construção, e o que a mesa decidiu

  **Tudo isso é migração nova (34), e a mesa não estava rodando migração.** Um conserto que só
  funciona depois de um arquivo que ninguém vai rodar não conserta nada. **A mesa mandou fazer a
  metade que não depende de migração** (05/09/2026), e ela está no ar · ver o alto do verbete.

  **E o gargalo virou tarefa própria:** o levantamento das cinco migrações pendentes está no
  **L42**, para serem rodadas de uma vez. Depois disso a 34 deixa de ser bloqueio.

  ### A asserção de sobrevivente, com a metade que quase ninguém escreve

  Três casos, e o segundo é o que separa isto de garantia escrita, porque **apagar reescrevendo o
  vetor inteiro tem exatamente a forma da colisão, e o alvo perdido é a linha do jogador que não
  estava na foto**:

  1. o mestre ACRESCENTA e a linha do jogador fica;
  2. **o mestre APAGA uma linha dele e a do jogador fica**;
  3. o mestre REFAZ os efeitos e a linha de Arte DO JOGADOR fica.

  **E o quarto, que não estava no enunciado e é o que segura o segundo:** a linha que o mestre
  apagou **não volta**. Sem ele, o caso 2 passa com uma mescla que só junta, e que ressuscita tudo.

  **DECIDIDO em 07/09/2026: ADIAR.** O gargalo de migrações pendentes que travava a 34 já foi
  resolvido (31/32/29/30/35 aplicadas, **L42**), então a 34 não está mais bloqueada por isso — mas
  escrever e rodar uma migração nova agora é antecipar trabalho durante o congelamento da fase 3
  (reservado para a mesa reavaliar o plano), por um risco que a mitigação já encolheu em ~4 ordens
  de grandeza (de até ~21 s para milissegundos, ver acima). **Fica na fila, com o gatilho escrito
  para não virar tolerância sem dono:** escreve-se a 34 no dia em que aparecer sinal real de perda
  de linha em mesa, ou no dia em que o mestre precisar de um gesto sobre o log que a mitigação de
  hoje não cobre. **O que a mitigação NÃO resolve, para o gatilho ter conteúdo quando alguém for
  reler isto:** ela encurta a janela de corrida, não a fecha (o `select`+`update` do `mesclarLog`
  ainda não é atômico); e o `LOG_APAGADAS` é uma lápide que existe só porque, sem migração, a
  ausência local de uma linha tem duas causas indistinguíveis — "nunca chegou" e "eu apaguei" — e
  o dia em que uma terceira causa aparecer (por exemplo, duas abas de mestre) a lápide sozinha
  pode não bastar.

- [ ] **L41 · [PENDÊNCIA DA MESMA FAMÍLIA] Leitura-modificação-escrita de coleção inteira a partir
  de foto local** · *a forma, nomeada em 05/09/2026, a partir do L40.*

  **A FORMA:** o cliente lê uma coleção, muda um elemento e grava a coleção inteira de volta. **O
  perdedor não perde a própria escrita, perde a de uma TERCEIRA coisa que não estava na foto dele.**
  É por isso que ela não aparece em teste: quem escreveu vê o que escreveu.

  **A RÉGUA PARA PRIORIZAR, e ela reordena a lista:** contar por forma de escrita acha a família,
  mas **o risco sai de quantos caminhos escrevem o mesmo campo**. Onde só o mestre escreve, a forma
  é a mesma e o risco é outro · é dívida de desenho, não perda de dado.

  | campo | mestre | jogador | risco |
  |---|---|---|---|
  | `combatentes.condicoes` | vetor inteiro, de foto | `jogador_muda_peca` · também vetor inteiro, de foto | **o pior dos três** |
  | `arena_efeitos.mordidos` | vetor inteiro, de foto | `jogador_muda_efeito` · também vetor inteiro, de foto | igual ao de cima |
  | `mesa_arenas.log` (Grid) | vetor inteiro, de foto | `jogador_registra` · concatena no banco | o L40 |
  | `encontros.log` (`combate.astro`) | vetor inteiro, de foto | ninguém | um caminho só |

  **E ISSO INVERTE A ORDEM ESPERADA.** O defeito do L40, que foi o achado, é **o menos grave dos
  três concorrentes**, porque nele um dos lados (o do jogador) já é atômico do lado do servidor: só
  o mestre pode apagar o do outro. Em `condicoes` e em `mordidos` **os dois lados gravam vetor
  inteiro a partir de foto**, então **qualquer um dos dois apaga a escrita do outro**. O caminho do
  jogador recebe o array pronto e não tem opinião sobre ele
  (`condicoes  = coalesce(p_dados->'condicoes', condicoes),`, `supabase/migracao-22.sql:125`), e o
  do mestre entrega o array da memória pelo mesmo `gravarPeca`.

  O `encontros.log` do `combate.astro` tem a mesma forma e um escritor só: fica no fim da fila, e
  por um motivo escrito, não por esquecimento.

- [ ] **L42 · [AS CINCO RODARAM · FICA A 33] As migrações pendentes** · *levantado em 05/09/2026,
  com o esquema de produção sondado pela chave anon, uma por uma. **A leva de 31, 32, 29, 30 e 35
  RODOU em 05/09/2026**, na ordem da mesa e com 31 e 32 coladas. A 33 não entrou.*

  ### O QUE CADA UMA RESPONDEU, no dia em que rodou

  | # | a conferência devolveu |
  |---|---|
  | **31** | `tick_da_arena` existe, e a `casa_clara` passou a chamá-la (`t`) |
  | **32** | a `efeito_visao` tem **24 colunas**, o corpo cita `hexes_claros` (`t`) e `tick_da_arena` (`t`) |
  | **29** | a do arquivo: `perfil` **jsonb** e `perfil_em` **timestamptz**, as duas que o comentário promete |
  | **30** | `mesas.gravar_lances`, a tabela `lances_veredito` com **RLS ligada e 3 políticas**, e a `limpar_lances_veredito` |
  | **35** | as duas do arquivo: `funde = t`, e a prova de fogo `soma_preserva = t` · `repetida_atualiza = t` |

  **E o efeito conferido pela chave anon, pelo formato e não pelo dado**, com um controle (uma
  coluna inventada devolve `42703`, então o `200` das outras é a coluna existindo e a RLS cortando
  as linhas): `encontro_visao` manda `tick_atual`/`rodada`/`perfil`/`perfil_em`; `efeito_visao` e
  `token_visao` respondem; `encontros.perfil`, `mesas.gravar_lances` e `lances_veredito` existem.

  **TRÊS DAS CINCO NÃO TRAZIAM CONFERÊNCIA NENHUMA** (a 30, a 32, e a da 31 lia mesa de gente),
  e quem rodou teve de inventar uma na hora. **Isso foi consertado depois**: as três ganharam a sua
  dentro do arquivo, e a régua está no verbete seguinte.

  **COMO FOI CONFERIDO, porque isso não é lista de arquivo, é leitura de produção.** Cada uma foi
  sondada pelo objeto que ela cria: coluna que não existe devolve `42703`, tabela devolve `PGRST205`,
  função devolve `PGRST202`. A sonda foi calibrada contra um objeto que EXISTE (`casa_clara`, da
  migração 14, devolveu `true`), para não confundir "não existe" com "não consigo ler".

  | # | o que ela faz | o que o código faz hoje, sem ela | rodar? |
  |---|---|---|---|
  | **29** | `encontros.perfil` e `perfil_em`: o encontro carimba com que perfil de regras começou | o `carimbarSeFaltar` falha **calado** e a cena roda com o perfil corrente do `regras.json`. Um deploy troca o chão de um encontro aberto no meio da cena | **sim** |
  | **30** | `mesas.gravar_lances` e a tabela `lances_veredito`: grava o par (veredito da régua, botão do mestre) | a aba Grupo diz *"A coluna gravar_lances ainda não existe. Rode supabase/migracao-30.sql."* e o par não é gravado. Nada mais quebra | **sim** |
  | **31** | `tick_da_arena`, e a `casa_clara` passa a filtrar por ESTADO | **vazamento em produção**: fogo que ainda está sendo montado (ou que já venceu) acende o chão, e como é essa função que corta a `token_visao`, entrega ao jogador as peças que estavam no escuro. Medido: 12 casas de escuro abertas por um fogo que não caiu. E o Grid do jogador mostra *"⚑ o relógio da cena não está chegando"* | **sim, primeiro** |
  | **32** | a `efeito_visao` ganha corte por CASA | **vazamento em produção**: uma Arte inteira no escuro chega ao navegador do jogador com nome, hexes, condição, alvos e conjurador. Fogo e luz se entregam sozinhos; veneno, gelo, barreira e sombra não | **sim, depois da 31** |
  | **33** | a névoa esconde a EXISTÊNCIA da criatura, e não só a posição | a névoa esconde só a posição, como sempre | **NÃO · falta a TELA, não o SQL** |
  | **35** | a `jogador_muda_efeito` FUNDE o `mordidos` em vez de substituir | **apagamento em toda gravação**: cada mordida que um jogador marca apaga as marcas de todos os outros daquele efeito, e a `__a_sair` junto. Ver L43 | **sim · e ela entra INERTE** |

  **A ORDEM: só um par é obrigatório, e é 31 antes de 32.** A view da 32 chama
  `cross join lateral (select public.tick_da_arena(a.id) as t) rel`, `supabase/migracao-32.sql:65`,
  e essa função nasce na 31: rodar a 32 antes falha na criação da view. As outras não dependem umas
  das outras · a ordem numérica basta e não custa nada.

  **AS DUAS DE VAZAMENTO SÃO AS URGENTES.** A 31 e a 32 não são construção, são defeito existindo
  agora, e nenhuma das duas depende de mudança de tela. A 29 e a 30 são proteção e conveniência.

  ### O QUE MUDA DE FORMATO PARA QUEM ESTÁ COM A MESA ABERTA

  A pergunta é a certa e a resposta não é "nada": **três das quatro mexem em view**, e duas mudam o
  que chega ao navegador do jogador. Tudo abaixo foi sondado no esquema de produção, coluna a
  coluna.

  **PRIMEIRO, O ALÍVIO: o formato do LOG não é unificado por nenhuma das quatro.** A dúvida era se
  a mesa está no ramo das 60 linhas projetadas (`arena_log_visao`, migração 20) ou no ramo do vetor
  inteiro (`arena_visao`, com `SEM_LOG_VISAO`). **Está no primeiro:** a `arena_log_visao` existe
  neste banco (sondada, devolve lista em vez de `PGRST205`). Nenhuma das quatro toca nela, e o
  formato do registro do jogador continua o que já é.

  | # | muda o QUE CHEGA ao jogador? | o quê, exatamente |
  |---|---|---|
  | **29** | **sim, ganha colunas** | a `encontro_visao` passa a mandar `tick_atual`, `rodada`, `perfil` e `perfil_em`. **Hoje não manda nenhuma das quatro** (sondado: `42703` nas duas primeiras) |
  | **30** | quase nada | acrescenta `gravar_lances` ao `select('*')` de `mesas` (`mesa-core.ts:440`). Nada enumera as chaves desse objeto e nada o grava de volta inteiro · não há `from('mesas').update` no código |
  | **31** | **sim, e some coisa** | mesma FORMA em `token_visao` e `efeito_visao`, mas menos LINHAS: peça que só chegava porque um fogo não-caído acendia o chão **para de chegar**, e efeito fora do intervalo do relógio também. E a `encontro_visao` ganha `tick_atual` e `rodada`, como na 29 |
  | **32** | **sim, e campo que nunca era nulo passa a ser** | mesmas 24 colunas da `efeito_visao`, mas `conjurador_id` e `centro` passam a poder vir **null**, e `hexes` vem **filtrado** pelas casas claras |
  | **35** | **nada** | ela troca o corpo de uma função, e nenhuma view. O `mordidos` **não chega ao jogador nem antes nem depois** (a `efeito_visao` o corta de propósito), então a tela dele não sente. E o poder dele **diminui**: antes podia zerar o mapa, agora só acrescenta chave |

  **A ORDEM ENTRE 29 E 31 NÃO IMPORTA, e isso é desenho e não sorte.** As duas escrevem a
  `encontro_visao`, e as duas escrevem a MESMA lista: a 29 já traz `tick_atual` e `rodada`, e a 31
  inclui `perfil`/`perfil_em` por um bloco que confere se a coluna existe. Rodar em qualquer ordem
  converge, e rodar de novo não estraga.

  **O QUE O JOGADOR VAI NOTAR NA CADEIRA, e é o que responde a pergunta de verdade:**

  1. **some o aviso** *"⚑ o relógio da cena não está chegando"*, e a cena dele deixa de rodar no
     Tick 0 · assim que a primeira das duas (29 ou 31) rodar;
  2. **peças somem do tabuleiro dele.** Não é defeito: são as que ele nunca deveria ter recebido,
     e que chegavam porque um fogo em montagem acendia o chão. Numa cena com névoa ligada e Arte de
     fogo no ar, isso é visível na hora;
  3. **manchas de Arte somem ou encolhem**, pelo mesmo motivo, com a 32.

  **E O RISCO QUE EU FUI CONFERIR ANTES DE DIZER QUE NÃO HÁ:** a 32 faz `centro` e `conjurador_id`
  poderem vir nulos, e o cliente não foi mudado para isso. Conferido: o `centro` **não é lido em
  lugar nenhum** do cliente · a única ocorrência dele é uma escrita, em
  `patch.centro = { q: nova.q, r: nova.r };`, `artes-grid-mesa.ts:1964`.
  E o `conjurador_id` já era tratado como opcional em todos os pontos que o usam. **`alvos` nunca vem nulo** (a view faz `coalesce` para `[]`). O cabeçalho da 32 diz
  que ela não depende de mudança de tela, e a leitura do cliente confirma.

  ### A 33 NÃO ENTRA, E O QUE FALTA NELA NÃO É SQL: É A TELA

  **A metade que o jogador vê nunca foi feita**, e é só isso que a segura. O caso D foi decidido, a
  migração foi escrita, a semente foi construída · e a tela que desenha a lembrança **nunca
  existiu**. A palavra `lembranca` aparece **zero vezes** no `grid.astro`, e nenhum commit jamais a
  introduziu.

  Sozinha, a migração faria a `token_visao` mandar peça com `lembranca = true` na casa onde o
  jogador a viu por último, e **uma tela que não conhece essa coluna desenha aquilo como peça de
  verdade**: a mesa entrega uma POSIÇÃO FALSA como se fosse leitura, que é pior que esconder. É o
  que o cabeçalho da própria migração proíbe.

  **ISSO É FASE 2.5, e não sai do congelamento.**

  **A semente, para o registro, resolveu o que ela existia para resolver.** É o bloco 0 da migração:
  toda peça numa casa clara no instante em que ela roda passa a constar como vista, com posição e
  Vida daquele instante · exatamente o que o grupo enxerga, e só onde `vistos` ainda não existe, por
  ausência de chave e não por conteúdo. **Mas a janela do `vistos` nunca foi o único bloqueio**, e
  tratá-la como se fosse foi o engano que este verbete corrige.

  **O GATILHO DA 33 são os três itens abaixo, e o segundo é o que trava:**

  1. a `token_visao` mandar `lembranca` · **feito**, é a própria migração;
  2. **a tela desenhar a lembrança como lembrança e não como peça** · NÃO FEITO, e é o bloqueio;
  3. a semente fechar a janela do dado acumulado · **feito**, é o bloco 0.

  ### A 35 ENTRA INERTE, E NÃO PRONTA

  **Ela para o apagamento de hoje e NÃO termina o campo**, e a distinção está escrita porque
  *"rodou"* vai parecer *"resolvido"* para quem ler daqui a um mês. O `||` sabe dizer PÕE e não sabe
  dizer TIRE, e **um dos quatro pontos do cliente TIRA chave**. Hoje isso é inerte porque esse ponto
  grava direto na tabela e nunca chama a RPC.

  **A assimetria está do lado bom, e é a regra geral:** migração antes do cliente é segura, cliente
  antes da migração é a janela ruim. Por isso ela pode ser rodada hoje sem esperar nada. O que ela
  obriga está no L43, e está no cabeçalho da própria migração.

- [ ] **L43 · [OS DOIS LADOS FEITOS · FICA O VOCABULÁRIO DE REMOÇÃO] A marca da mordida que a aba
  do jogador apagava** · *achado em 05/09/2026, ao construir a saída da área. É a família do L41, e é o
  pior caso dela.*

  **E NÃO É CORRIDA: É APAGAMENTO EM TODA GRAVAÇÃO.** Foi assim que a premissa mudou no meio do
  trabalho, e vale escrito porque é o que fez o defeito passar despercebido. A `jogador_registra` do
  log **acrescenta** (`v_log := v_log || jsonb_build_array(p_linha)`), e por isso lá o defeito é uma
  corrida de milissegundos. A `jogador_muda_efeito` **substitui**
  (`mordidos = coalesce(p_dados->'mordidos', mordidos),`, `supabase/migracao-22.sql:226`), e por
  isso aqui não há corrida nenhuma: há apagamento. **Duas funções do mesmo arquivo, duas semânticas,
  e só uma delas era a certa.**

  **A CAUSA É UM CORTE DE INFORMAÇÃO, e ele é deliberado.** A aba do jogador carrega os efeitos da
  `efeito_visao`, e essa view **não traz `mordidos`** (sondado no esquema de produção: `42703`).
  Então `ef.mordidos` é `{}` na tela dele **sempre**. Quando ele marca a mordida dele, o cliente
  monta um objeto de UMA CHAVE e manda · e a RPC troca o mapa inteiro por ele.

  **O QUE A MESA SENTE:** o efeito volta a poder pegar todo mundo que já tinha pegado naquela
  rodada. **A saída da área vira um teste que se repete até passar, e quem tenta escapar rola a fuga
  duas vezes sem entender por quê** · que é literalmente a consequência que o comentário do
  `sairDaArea` já previa.

  **E A MARCA `__a_sair` VAI JUNTO, e a resposta à pergunta da mesa é: não, a Arte não soltava · ela
  DEIXAVA DE SOLTAR.** A marca é o que segura a Arte em montagem: com ela, `deveSair()` é verdadeiro
  e a Arte ainda deve o efeito. Apagada, o laço da saída passa direto e **a Arte nunca sai**:
  `src/lib/artes-grid-mesa.ts:1758` é `if (!deveSair(ef) || montando(ef, t)) continue;`

  **O SINTOMA, e ele vai escrito com estas palavras porque é o que alguém vai relatar de uma mesa
  antiga sem saber o nome:** a Mana foi paga, a mancha fica no chão **a duração inteira sem ferir
  ninguém, sem aplicar condição e sem saltar**, e some no fim **como se tivesse vencido o prazo**.
  Não aparece erro nenhum. Do lado de quem conjurou é *"eu conjurei e não aconteceu nada"* · e do
  lado do mestre é **uma mancha que ele vê expirar sozinha e supõe que já tinha resolvido**, que é
  o que fecha o círculo: os dois lados encontram uma explicação inocente e ninguém abre chamado.

  **Se alguém contar isso de uma sessão antiga, é este defeito.** Sem o sintoma escrito, ninguém
  liga o relato à causa · a causa é uma chave sumindo de um mapa, e o relato é uma Arte que não
  aconteceu.

  **E HÁ UM SEGUNDO SINTOMA, OPOSTO, NO MESMO CAMPO · e o par é teste de campo, que vale mais que
  a causa:**

  | o que se vê | qual dos dois é |
  |---|---|
  | mancha inerte, e **sem "saiu" no registro** | **o defeito antigo**: a marca se perdeu |
  | **"saiu" repetido**, com dano recobrado | **a 35 chegando cedo demais**: a marca não sai mais |

  **Contados de memória os dois são indistinguíveis** ("a Arte fez coisa errada"), e **o registro
  os separa sozinho**: a linha `${ef.nome} saiu` sai uma vez por saída. Zero é o primeiro, mais de
  uma é o segundo. Quem relata não sabe qual está vendo · por isso os dois vão lado a lado.

  **A JANELA DESSE CASO É ESTREITA, e é honesto dizer**: enquanto a Arte está montando ela não morde
  (o laço da mordida abre com `if (montando(ef, t)) continue;`), então a única brecha é entre o Tick
  em que ela deveria sair e o instante em que a aba do mestre processa isso. O apagamento das
  mordidas dos OUTROS, esse é o de todo dia.

  ### O que foi construído, e o que espera

  **O lado do MESTRE está feito.** Os quatro pontos que escreviam `mordidos` passaram por um helper
  só, o `marcarMordido`, que **relê o valor do banco e aplica a CHAVE sobre ele**. E o conserto é
  por chave e não por objeto, que é o que o torna simples: a intenção de cada ponto é sempre "põe
  esta chave" ou "tira esta chave", nunca "o mapa passa a ser este". **Por isso ele não precisa de
  lápide**, como o registro precisou · a operação já vem expressa como delta.

  **MAS A DISPENSA DA LÁPIDE TEM CONDIÇÃO, e ela é: enquanto o caminho for gravação direta na
  tabela.** O delta tem duas direções, e só sobrevive ao canal que entende as duas. A tabela entende
  (chave que sumiu do objeto some do banco, e é assim que a `A_SAIR` é tirada); **o `||` da 35 não
  entende "TIRE"**. Está escrito no comentário do `marcarMordido`, e é o que faz a 35 entrar inerte.

  **O lado do JOGADOR não tem conserto do cliente**, e a linha do `else` é o que sobra: ele não pode
  reler o que a view não manda. **O conserto é a `supabase/migracao-35.sql`**, escrita e esperando a
  mesa rodar: uma linha, trocando o `coalesce` por `||`, que é o mesmo operador que a
  `jogador_registra` já usava. **Fundir é estritamente menos permissivo que substituir**, então ela
  não precisa de policy nova. **Rodou em 05/09/2026**, e a conferência do arquivo devolveu
  `funde = t` com a prova de fogo do jsonb passando nas duas metades.

  **E ELA ENTRA INERTE, E NÃO PRONTA** (decidido pela mesa em 05/09/2026, e escrito porque "rodou"
  vai parecer "resolvido"). O `||` sabe dizer PÕE e não sabe dizer TIRE: chave ausente da carga
  **sobrevive** em vez de sumir. E um dos quatro pontos do cliente TIRA chave · o
  `marcarMordido(ctx, ef, A_SAIR, null)`, que cai no `delete base[chave]`. Pela RPC, tirar a
  `__a_sair` seria operação sem efeito: a marca ficaria para sempre, o `deveSair()` verdadeiro para
  sempre, e o efeito não pararia de tentar sair.

  **E O QUE ESTARIA SENDO INVERTIDO TEM DONO E TEM MOTIVO ESCRITO.** A ordem no laço da saída (a
  marca sai ANTES da resolução) foi escolhida de propósito, e o comentário diz por quê: se a rede
  cair no meio, o efeito fica no chão sem a mordida, e não morde duas vezes na próxima passada ·
  *"entre perder uma mordida e cobrá-la em dobro, a primeira é a que a mesa consegue consertar"*.
  **O `||` dissolve exatamente essa escolha:** a metade barata some, sobra só a cara, e
  **permanente em vez de transitória** (a marca nunca sai, então o efeito ressai a cada passada).
  Então o cliente passar pela RPC antes do vocabulário de remoção **não é conserto imperfeito: é
  inverter uma decisão de robustez sem ninguém ter decidido invertê-la.**

  **Hoje é inerte** porque o `marcarMordido` grava direto na tabela e nunca chama a RPC. **A
  assimetria está do lado bom: migração antes do cliente é segura, cliente antes da migração é a
  janela ruim.** O que isso obriga: **o vocabulário de remoção tem de existir na RPC ANTES de
  qualquer cliente passar a usar a `jogador_muda_efeito` para este campo**, não depois. E **a
  asserção que prova isso nasce junto do vocabulário**, não agora: prender hoje uma remoção que
  nenhum caminho executa seria prender o dublê.

  **AS OPÇÕES, e a mesa escolheu FUNDIR NA RPC:**

  - **fundir na RPC** (a 35) · uma linha, e não muda nada do que o jogador vê;
  - **a view mandar `mordidos`** · consertaria um defeito a mais (hoje a aba dele acha que ninguém
    foi mordido e re-oferece mordida já cobrada), mas paga com **revelar quem já foi pego**, que é
    decisão de jogo que ninguém pediu;
  - **a aba do jogador parar de marcar** · troca um defeito por outro, e o pior é que passaria a ser
    por desenho.

  **O QUE A 35 NÃO CONSERTA, de propósito:** a aba do jogador continua sem enxergar `mordidos`,
  então continua oferecendo mordida que já foi cobrada. Fica registrado para não virar surpresa.

- [x] **L44 · [VARRIDO] A conferência que CONTA em vez de NOMEAR** · *achado em 05/09/2026, ao
  rodar a leva, e a revisora tinha apontado um caso. É família, e não caso.*

  **A RÉGUA: conferência de migração NOMEIA o que aquele arquivo define, e nunca CONTA o que
  existe.** Contagem mede o mundo, e o arquivo só responde por si. É a régua do *"achar por chave e
  nunca por posição"* aplicada a SQL.

  **O caso que abriu a família:** a conferência da 22 dizia *"deve devolver 8 funções `jogador_*`"*
  e hoje devolve **10** · a `jogador_declara` nasceu depois, na 28, e entrou na conta de um arquivo
  que não a define. E ela já nascera errada: a 22 define **nove**, não oito. Uma contagem por
  prefixo envelhece toda vez que alguém acrescenta função **em qualquer lugar**.

  **E há um segundo defeito na mesma forma, que só aparece quando falha:** contagem que dá o número
  errado **não diz o que faltou**. `count(*) = 1` quando devia ser 2 manda quem confere abrir o
  arquivo e comparar à mão. Listar por nome responde as duas perguntas de uma vez.

  **O QUE FOI CORRIGIDO** (todas viraram listagem por nome, e o `where` ganhou `nspname='public'`
  onde faltava · a da 28 varria `pg_proc` **sem filtro de schema**):

  | # | o que estava |
  |---|---|
  | **21** | `count(*) ... column_name like 'mana%'` · contava PADRÃO, e qualquer coluna `mana*` futura a quebraria |
  | **22** | `count(*) ... proname like 'jogador\_%'` · o caso que abriu a família |
  | **27** | dois `count(*)` ("deve devolver 2" e "1") sobre colunas nomeadas |
  | **28** | `count(*) from pg_proc` **sem schema**: função homônima em outro schema entrava na conta |

  **E UM ACHADO IRMÃO, que veio da regra de acesso da mesa:** quatro conferências **liam linha de
  mesa** para provar o que o catálogo prova (`select ... from mesa_arenas limit 1`, nas 23, 25, 31
  e 33). Quem confere o esquema pode não ter (e não deveria precisar de) acesso à mesa de ninguém ·
  foi exatamente a regra que a mesa impôs no dia em que essas migrações rodaram. As quatro passaram
  a conferir pelo catálogo, e o roteiro de comportamento ficou marcado como roteiro, não como
  conferência.

  **E AS TRÊS QUE NÃO TINHAM NENHUMA** (30, 32, e a 31 na prática) ganharam a sua, com o porquê
  escrito dentro: **migração sem conferência obriga quem roda a inventar uma, e quem inventa está
  inventando sob a pressão de já ter rodado** · tende a escrever a pergunta que já sabe que passa.

- [ ] **L45 · [A 36 FECHOU O DEFEITO ORIGINAL · A 37 ESPERA A MESA] A fachada que preserva a
  forma e troca o destino** · *achado em
  05/09/2026, e a forma é nova. O caso foi meu, e o que ele custou foi saída dupla em produção.*

  **O NOME É DA REVISORA, e ele é melhor que o meu** ("o objeto que se disfarça de outro"): o que
  importa não é o disfarce, é que **a forma é preservada e o destino é trocado**. É a preservação da
  forma que faz a leitura falhar.

  **A FORMA: ler o ponto de escrita não diz por onde a escrita SAI, quando alguém trocou o cliente
  por baixo.** É irmã do *transporte que descarta* (a estrada entre as duas pontas), com uma
  diferença que muda o conserto: lá o transporte RECORTA a carga e dá para achar a lista de chaves;
  aqui o transporte é **invisível**, porque imita a interface do que substituiu.

  **O CASO.** Eu li o `marcarMordido`, vi `ctx.SB.from('arena_efeitos').update(...)` e escrevi que
  ele *"grava direto na tabela e nunca chama a RPC"* · e daí concluí que a migração 35 entrava
  **inerte**. Vale só para o mestre: o `sbDoJogador()` (`src/pages/mesa/grid.astro:2651`) devolve um
  objeto **com a mesma cara** que troca toda escrita pelas funções do banco, e o `ctxArtes()` o
  entrega no lugar do Supabase quando quem joga não é o mestre.

  **O QUE ISSO CUSTOU:** a 35 não entrou inerte. Ela pôs **saída dupla** em produção na hora em que
  rodou · o jogador conjura, a marca `__a_sair` não é removida pela RPC (o `||` não sabe tirar), a
  aba do mestre lê a marca e resolve a Arte de novo: dano recobrado, condição reaplicada, segundo
  *"saiu"* no registro. **E mudou de natureza, não só de tamanho:** antes a substituição apagava a
  marca por acaso e a saída dupla dependia de aba com memória velha (transitória); depois da 35 a
  marca fica gravada e a segunda resolução é certa.

  **O GATILHO DE SÍMBOLO**, que é o que faz a pergunta sobreviver ao instante da escrita: `ctx.SB`,
  `SB`, **qualquer cliente recebido por parâmetro em vez de importado**. Ao digitar, perguntar
  **quem é este SB nesta aba**. Está no `docs/simulacao/CATALOGO.md`.

  **O CONSERTO** é a `supabase/migracao-36.sql` (o vocabulário `tirar_mordidos`), a linha do
  `marcarMordido` que só entra no ramo do jogador, o portão no `validate-data.mjs` e o par de
  asserções no `test-arte-na-mesa.mjs`. **A 36 rodou em 05/09/2026**, e as conferencias devolveram
  `funde = t` **e** `tira = t`, com a prova de fogo do jsonb passando: fundir e depois subtrair tira
  só a chave pedida. A saída dupla parou.

  **A 37 ESTÁ ESCRITA E ESPERA A MESA**, e ela não toca em dado nenhum: só comentario e uma
  view de conferencia. Sem risco de formato para o cliente.

  Ela carrega DUAS coisas. A primeira, no `comment on column public.migracoes.sha256`, e a regra
  de leitura que a revisora pediu · nulo significa "não sabemos qual texto rodou", e nenhum
  consumidor futuro pode tratar nulo como "confere" nem comparar dois nulos como iguais.

  A segunda CORRIGE uma leitura errada que eu tinha dado por certa: **`min(numero) where not
  a_mao` responde "qual foi a primeira linha automática", e eu tratei isso como se respondesse
  "a partir daqui, TODAS são automáticas"**. As duas coincidem hoje porque a carga histórica é
  um bloco só, contiguo. Descolam no primeiro caso realista: um arquivo rodado EM PEDAÇOS, com o
  DDL entrando e o `insert` do carimbo (que fica no FIM do arquivo) não. **É o escalar por
  conjunto, pela TERCEIRA vez no mesmo instrumento** (a própria 36 recusando "a última migração";
  o L44; e esta). → *o escalar que descreve um conjunto*, no `docs/simulacao/CATALOGO.md`.

  O conserto: a fronteira virou a view `public.migracoes_fronteira`, que devolve o número E uma
  afirmação (`fronteira_vale`) de que nenhuma linha `a_mao = true` existe acima dele. A leitura
  só vale enquanto essa afirmação for verdadeira.

  **E A NOTA CRUZADA COM O PORTÃO DO CARIMBO**, da revisora: são o mesmo trabalho por dois lados.
  `scripts/gen-carimbo-migracoes.mjs --check` impede a migração de ENTRAR NA ÁRVORE sem carimbo;
  `fronteira_vale` é a rede do lado de baixo, se mesmo assim algo entrar no BANCO sem ele.

- [x] **L46 · [FECHADO, com o achado de 06/09/2026 corrigido] Dois portões novos, controle
  positivo explícito, e mais três correções da mesma leva** · *cada um com controle contra arquivo
  REAL de `supabase/`, não só fixture: `test-remocao-jsonb.mjs` lê `migracao-36.sql`/`migracao-22.sql`
  de verdade (10 asserções); `test-carimbo-migracoes.mjs` copia os 36 `.sql` reais para uma pasta
  de scratch e confere que passam (8 asserções). E o resolvedor de variável do gate `mordidos` fora
  do helper devolve TRÊS estados (achou / confirmou ausência / não resolvi), e "não resolvi" conta
  como suspeito — nunca como "não há cliente tirando chave". Falsificado: variável vinda de
  parâmetro externo acende o portão, rotulada "NÃO RESOLVI".*

  **1 · O DETECTOR DE REMOÇÃO GANHOU MÓDULO PRÓPRIO E TESTE SINTÉTICO.** A lógica que decide "este
  SQL sabe tirar chave de um jsonb?" saiu do meio do portão (`validate-data.mjs`) para
  `scripts/lib-deteccao-remocao-jsonb.mjs`, uma função pura. `scripts/test-remocao-jsonb.mjs` a
  exercita contra TEXTO SINTÉTICO, sem depender de nenhuma migração real continuar no repositório:
  positivo com `-` simples, positivo com o formato exato da migração 36 (fundir e subtrair um
  array), positivo com `#-`, negativo com `||` (o defeito da 35), negativo com substituição pura
  (o defeito anterior), e o caso que a PRIMEIRA versão do portão errava (remoção sem `coalesce` em
  volta) — agora achado. 8 asserções, todas verdes.

  **2 · O PORTÃO DO CARIMBO GANHOU `--dir` E BANCADA PRÓPRIA.** `gen-carimbo-migracoes.mjs` aceita
  `--dir=<pasta>` para o controle positivo poder rodar numa pasta de scratch, sem tocar
  `supabase/`. `scripts/test-carimbo-migracoes.mjs` prova as duas metades que a revisora pediu:
  que o `--check` falha com um arquivo sem carimbo NENHUM (não só com hash velho, que já era
  coberto), e que o MESMO arquivo passa a passar depois de carimbado — a prova de que a detecção
  acha quando há o que achar, e não só que ela falha fechado quando não acha nada. 6 asserções,
  todas verdes, e conferido que `supabase/` não foi tocado (`git status --short` limpo depois).

  **3 · O PORTÃO DO `mordidos` FORA DO HELPER, por SENTIDO e não por literal** (o item que eu
  mesma tinha deixado em aberto: *"a rota tem outra grafia"*, item 5 da lista da revisora sobre
  como um portão fica verde sem o problema resolvido). Em vez de casar texto, ele percorre a
  ÁRVORE SINTÁTICA de `artes-grid-mesa.ts` e do `<script>` de `grid.astro` (via o compilador
  TypeScript, já uma dependência do projeto) atrás de toda chamada `.update`/`.upsert` sobre
  `arena_efeitos`, e RESOLVE o valor do argumento — objeto literal direto, ou a variável que o
  recebeu, seguindo a declaração dela e qualquer atribuição posterior no mesmo corpo de função.
  Fora do intervalo da própria `marcarMordido` (achado pelo NOME da função, não por número de
  linha).

  **O ENSAIO DOS TRÊS SENTIDOS, rodado antes de entrar, com uma quarta variação deliberada:**

  | rodada | o que foi injetado | resultado |
  |---|---|---|
  | 1 · vermelho hoje | `.update({ mordidos: {...} })` inline, fora do helper | ✗ achado |
  | 2 · verde real | nenhuma injeção — o código como está | ✓ verde |
  | 3 · vermelho de novo, disfarçado | `.upsert(cargaDoEnsaio)` com variável renomeada e a chave chegando por `cargaDoEnsaio.mordidos = ...` DEPOIS da declaração, não dentro do literal | ✗ achado |

  A rodada 3 é a que prova o ponto: é exatamente o tipo de disfarce que reprovou a versão anterior
  do portão irmão (variável renomeada, forma de chamada trocada), e este achou porque rastreia o
  VALOR e não o texto.

  **O LIMITE, DECLARADO NO PRÓPRIO VERMELHO, como o outro:** prova que nenhuma chamada
  `.update`/`.upsert` sobre `arena_efeitos`, nos dois arquivos vasculhados, carrega `mordidos` fora
  do helper. NÃO prova que uma escrita por uma ROTA DIFERENTE (uma RPC chamada direto por nome, um
  terceiro arquivo que também toque `arena_efeitos`) não exista — ainda é o item 5 em aberto, só
  que agora fechado para a forma de escrita que existe hoje.

  Os três (`test-remocao-jsonb.mjs`, `test-carimbo-migracoes.mjs`, e o bloco novo em
  `validate-data.mjs`) estão ligados ao `npm run validate`.

- [ ] **L36 · [QUANDO A REGRA APARECER] O `resumoParaBanco` é vitrine, e não entrada de conta.**
  Não é defeito hoje, e é para isso que está escrito: quando alguém topar com ele, que não trate
  como bug.

  `personagens.resumo` é o que um jogador vê **do colega**: Vida, Energia, Mana, Fôlego, arma,
  ataque, dano, as três Defesas, Absorção, Resistência a Perfuração e Iniciativa. Treze números
  prontos, e nenhum insumo. **Não leva `attrs` nem `skills`**, e é por isso que ele nasceu assim:
  a ficha inteira do colega não é da conta de ninguém, e a régua de mesa lê o resultado.

  O DIA EM QUE VIRA CASO: quando uma regra pedir **atributo ou perícia de um colega de mesa**.
  Socorrer alguém, empurrar quem está caído, uma ação em conjunto, uma resistência dividida ·
  qualquer coisa em que o número do outro entre na conta em vez de ser lido. Aí o buraco aparece
  do lado ruim, porque **a RLS de `personagens` só devolve ao jogador a ficha dele**: o resumo é
  tudo o que ele tem do colega, e o que falta não é buscável de onde ele está.

  É a mesma família do caso 13 do princípio (o transporte que descarta), e a diferença é o tempo:
  lá o consumidor já existia e a estrada perdia a carga em silêncio; aqui o consumidor ainda não
  existe, e a estrada está declarada estreita. **Quando ele existir, a saída não é alargar o
  resumo por reflexo:** ampliar `resumoParaBanco` publica atributo de personagem para a mesa
  inteira, que é decisão de jogo e não de código. As opções são pelo menos três (ampliar o resumo,
  uma função `SECURITY DEFINER` que responda a pergunta sem devolver a ficha, ou a regra pedir o
  número a quem o tem), e escolher entre elas é conversa, não conserto.

**Um risco medido, para não se perder:** o registro da arena é um `jsonb` reescrito inteiro a cada
linha de log (é o item **I2** desta lista), e isso custa **uma reescrita de até 45 KB por peça que se
move, por Tick**. Com dez perseguidores são 450 KB por Tick, e perseguição é justamente o cenário que
o eixo E2 da bateria vai medir mais. Medido em 02/09, `02` §0.8.6.

- [ ] **L47 · [ACHADO NA REVISÃO DE 06/09/2026, SÓ REGISTRO] O portão por literal continua dentro
  da própria bancada do avanço unificado.** A linha `/golpe caindo/i.test(fim.dica)`, `scripts/test-grid-simultaneo.mjs:231`, casa contra o TÍTULO do botão "⏭" (`fim.dica`, um texto para o
  mestre ler), no mesmo arquivo que já condena essa forma para o mestre-log da REDE (o teto do
  avanço unificado, comentário perto de `cenaAvancoParaSozinho`): reescrever a frase do título
  (o que ela vai sofrer, cedo ou tarde) apaga esta asserção calado, do jeito que o portão por
  texto fixo já custou caro nesta mesa. Não é urgente e não trava nada hoje; entra na fila para
  quando alguém mexer na frase do título do "⏭" ou fizer uma varredura geral desta família de
  defeito, e não como exceção documentada.

- [ ] **L48 · [ABERTO · A RESPOSTA É SEDIMENTAÇÃO · BALDES A e B FECHADOS (07/09/2026 e 06/09/2026)] O harness
  chamava 20 funções da lib, e a mesa 41.** *Medido pela revisora em 06/09/2026 e reproduzido
  pelo portão no mesmo dia.*

  **Os números de origem, e quem os guarda é o `scripts/test-cobertura-lib.mjs`:**
  `src/lib/combate-tempo.ts` exporta **63** (51 funções, 12 constantes); **20** eram chamadas
  pelos dois; **zero** eram chamadas só pelo harness; **21 funções** eram chamadas pela mesa
  (as duas abas mais o `mesa-tempo-ui.ts`) e ausentes do harness. A relação é de subconjunto
  ESTRITO, e é o zero que a torna estrita. **Depois do balde B, são 22 nos dois e 19 só na
  mesa; depois de ligar `ticksDeEntrada`/`contrapeEm`/`contrapeDe`, são 25 nos dois e 16 só na
  mesa** · o portão guarda o número corrente, este parágrafo guarda o de origem.

  **POR QUE NENHUM OUTRO INSTRUMENTO ACHA ISTO.** O espelho de motor compara o harness com a
  mesa Tick a Tick, e o que ele compara é o que os DOIS executam: função que só um lado chama
  não produz divergência nenhuma, porque não há o que divergir. A ausência é muda por
  construção. Por isso o instrumento não é asserção nova dentro do espelho: é uma comparação
  de CONJUNTOS fora dele.

  **POR DECISÃO OU POR SEDIMENTAÇÃO?** Por **sedimentação**, e a prova não é de leitura, é de
  medida: a própria ponte (`scripts/sim/lib-ponte.mjs`) exportava **15 nomes que o harness nunca
  chamava** · `penDadosDaRegua`, `contrapeDe`, `temGesto`, `vizinhos`, `HEX_HASTE`,
  `HEX_CORPO_A_CORPO`, `fonteRolada`, `defesaEfetiva`, `qaDaPeca`, `errouPor`, `saidaDoAtaque`,
  `somarCondicoes`, `deslocamento`, `semeado`, `PERFIL_CORRENTE`. Uma lista de escopo decidido
  não carrega quinze nomes que ninguém pediu; uma lista que cresceu por necessidade e nunca foi
  podada carrega. E o caso que fechava o argumento, hoje consertado: a ponte exportava
  `temGesto` **e o harness definia uma cópia local, com o mesmo nome e o mesmo corpo** (era o
  `const temGesto` do `motor.mjs`, removido no balde B abaixo). Ninguém decide isso; isso
  acontece.

  **A CONSEQUÊNCIA, e ela é a razão de o item existir, CORRIGIDA em 06/09/2026 ao medir o
  tamanho do balde C:** a leitura de origem dizia dez com ocasião, nove alongando e uma
  encurtando (`modoCorre`). Reexaminado, são **oito** com ocasião real, e nenhuma encurta: cinco
  (`ticksDeDeslocamento`, `abortar`, `foraDeHora`, `atrasarGesto`, `podeSerInterrompido`)
  ALONGARIAM a batalha da mesa **se o harness tivesse a política que as aciona**, e é a política
  que falta, não a chamada; duas (`contrapeEm`, `contrapeDe`) não mudam duração nenhuma, e uma
  (`ticksDeEntrada`) já foi medida (§ abaixo). `modoCorre` e `adiaGolpe` saíram do balde C para o
  D: os dois têm ocasião zero nesta bateria, cada um por um motivo diferente (ver o balde D). **O
  sentido geral se mantém**: nada no achado encurta a batalha do harness; o que muda é que a
  maior parte do alongamento é POTENCIAL (falta política), não já disponível para ligar.

  **OS QUATRO BALDES.** Cada linha é um item; fechar um é fazer o harness chamar a função, ou
  escrever por que ele nunca vai chamar.

  | balde | as funções | o que fazer |
  |---|---|---|
  | **A · [FECHADO em 07/09/2026] sem ocasião num laço headless** (8) | `fita`, `resumoDaAcao`, `combateDaMesa`, `ehSimultaneo`, `rolaNoSite`, `comOverride`, `anatomiaLivre`, `acaoVazia` | são tela ou configuração: as duas primeiras desenham, as três seguintes leem uma configuração que a bateria fixa, `comOverride` e `anatomiaLivre` são caminhos de diálogo, e `acaoVazia` responde uma pergunta mais larga (inclui Pressão) que a política automática nunca produz. **Escrever isto uma vez ao lado dos números e fechar.** É a única parte da lista que é escopo de verdade. Conferido em `src/lib/combate-tempo.ts` que as oito existem e batem com a descrição (as três de configuração leem `CombateMesa`/flags, as duas de diálogo tomam `Anatomia`/override como parâmetro, as duas de tela devolvem string); nenhuma abre caminho novo. Fecha por escrita, não por código novo |
  | **B · [FECHADO em 06/09/2026] duas implementações da mesma pergunta** (2) | `temGesto`, `proximoGolpe` | `temGesto` era cópia de mesmo nome no `motor.mjs`, com o mesmo corpo, e a ponte já exportava o original: a cópia saiu, `resolverContra` chama `L.temGesto` (`motor.mjs:362`), e a saída da batalha de controle (300 batalhas, semente `20260903`) saiu byte a byte idêntica. `proximoGolpe` estava reimplementado em linha, em dois pontos de `avancarTickSimultaneo`; os dois viraram `L.proximoGolpe(...)` (`motor.mjs:138`, `motor.mjs:145`), mesma conferência. `proximoGolpe` entrou na ponte (só faltava lá). Conferido: `custo-tela.mjs` NÃO responde a mesma pergunta que `temGesto` — a tabela `CUSTO` mapeia TIPO DE PARADA → cliques, e `temGesto` pergunta se UMA `Acao` tem golpe agendado; nenhuma linha do arquivo testa `.golpes.length`. Não há o que tirar nem migrar lá |
  | **C · [3 DE 8 FECHADOS em 06/09/2026] divergência de fidelidade REAL, com ocasião nesta bateria** (8) | `ticksDeEntrada`, `contrapeEm`, `contrapeDe` ligados e medidos; `ticksDeDeslocamento`, `abortar`, `foraDeHora`, `atrasarGesto`, `podeSerInterrompido` seguem abertos | os três ligados: efeito líquido zero na duração média, redistribuição real célula a célula (sensibilidade a condição inicial), −0,5% no trabalho total do mestre. Os cinco que sobram exigem decisão de política antes de motor: ver o parágrafo abaixo |
  | **D · divergência REAL, SEM ocasião nesta bateria** (3) | `tetoDaRajada`, `modoCorre`, `adiaGolpe` | as duas últimas ENTRARAM neste balde em 06/09/2026, corrigindo a lista de origem: ver o parágrafo abaixo |

  **CORREÇÃO AO PRÓPRIO RELATO ANTERIOR, achada ao medir o tamanho do balde C em 06/09/2026:
  eram dez com ocasião, e duas não têm.** `modoCorre` só se distingue de `=== 'corrida'` quando
  `opts.modo === 'investida'`, e o harness **nunca** produz esse valor — `motor.mjs` só escreve
  `modo: 'corrida'` (fuga, L249) ou `modo: 'batalha'` (aproximação, L281); `grep` por
  `investida` no arquivo inteiro não acha nada. E o harness já chama `L.passoDoGolpe` (`motor.mjs:105`), que usa
  `modoCorre` por dentro (`combate-tempo.ts:1022`): a função É exercitada, só não por nome. `adiaGolpe(c)` pergunta se o sistema da MESA adia o golpe
  (`c.sistema === 'simultaneo' || ...`), e o harness não tem esse objeto de configuração porque
  ele SEMPRE roda simultâneo, com o adiamento já embutido em `decideEmValeDepois()`
  (`combate-tempo.ts:1078`, `decideEmValeDepois`), que está na lista dos 20 chamados pelos dois. As duas perguntas já
  estão respondidas do jeito que `adiaGolpe` responderia; wire-las não muda um Tick.

  **O TAMANHO DO BALDE C, medido em 06/09/2026 antes de construir nada** (a régua do L30: o
  tamanho vem antes do conserto). Das oito, **três são baratas de ligar**, e só **uma** delas
  MEXE no comprimento da batalha: `ticksDeEntrada` (a guarda do motor já existe, ver mais abaixo,
  e É o que atrasa a entrada — a medição do turno anterior). `contrapeEm` e
  `contrapeDe` são igualmente baratas de ligar (o par que lê e carrega o contrapé que
  `ticksDeEntrada` gravaria), **mas não mudam duração nenhuma**: a régua da mesa manda o
  contrapé ficar **mostrado e não descontado** (`grid.astro:5158`, `GUARDADO na ação e MOSTRADO`, "o valor final da jogada é do
  mestre"), então ele nunca entra numa rolagem que o harness resolve sozinho. Ligá-las é
  completar o mecanismo do `ticksDeEntrada` (senão o contrapé fica escrito e nunca decai), não
  medir mais nada.

  **Cinco exigem trabalho de motor**, e a razão é a mesma nas cinco: dependem de uma DECISÃO que
  `decisaoAutomatica` não tem (ela só devolve `atacar`/`fugir`/`nada`) ou de um MECANISMO que o
  laço não tem (interromper o turno de outra peça). `ticksDeDeslocamento` cobraria Ticks de
  quem anda durante a Recuperação, e nenhuma peça desta política anda nesse instante: o passo
  só existe enquanto há `acao.mov`, e o `mov` só nasce na declaração (indo atacar ou fugindo),
  nunca no meio da Recuperação. `abortar` cancela um Preparo em andamento, e uma peça com golpe
  agendado nunca volta a passar por `declarar()` até o golpe cair (`motor.mjs`: a fase 2 pula
  quem tem `golpesNoAr(c.acao).length`), então não há PONTO no laço em que abortar seria
  perguntado. `foraDeHora`/`atrasarGesto`/`podeSerInterrompido` são a mesma família, a
  interrupção: nenhuma peça desta política reage ao turno de outra, e o harness não tem
  conceito de "agir na vez de outro" em lugar nenhum do laço. As três nascem com o mesmo commit,
  porque `foraDeHora` chama `podeSerInterrompido` internamente e `atrasarGesto` é a única forma
  de aplicar o que `foraDeHora` decide.

  **NÃO É MAIORIA BARATA: é 3 de 8, e só 1 delas move o número que a bateria mede.** O lote
  barato (`ticksDeEntrada` + o par do contrapé) cabe num experimento só, porque as três só tocam
  o INÍCIO do ciclo de uma peça. As cinco caras não cabem no mesmo lote: cada uma exige decidir
  QUANDO o robô aborta, interrompe ou anda durante a Recuperação, e essa decisão de política é
  trabalho de design antes de ser trabalho de motor — não dá para "ligar" o que ainda não foi
  desenhado.

  **O `ticksDeEntrada` [LIGADO E MEDIDO em 06/09/2026] ERA O PRIMEIRO, E CABIA ANTES DO ELENCO
  NOVO.** Custo: uma linha em `cena.mjs` (o `tick: 0` de toda peça vira o Tick da entrada), porque
  a guarda do motor já existia (`if ((c.tick ?? 0) > T) continue`, `motor.mjs:166`), e o contrapé,
  na mesa, é **mostrado e não descontado**, então não aplicá-lo era o comportamento fiel e não um
  atalho. **O QUE ELE MEDIA COM O ELENCO DE HOJE ERA MENOS DO QUE PARECIA**, e isso decidiu a
  ordem: medido sobre as 21.600 cenas do plano, a entrada escalonada põe **23,4% das peças no
  Tick 1 e 76,6% no Tick 2, e nenhuma peça no Tick 3 ou no 4** · a régua vai até o Tick 4, e o
  elenco de dois arquétipos não tem vão de iniciativa para chegar lá (`iniciativaDaPeca` soma 1 a
  6 sobre uma base quase igual nos dois). Ligado junto com `contrapeEm`/`contrapeDe` (o par que
  carrega o placeholder da entrada para a primeira declaração de verdade, sem o qual o contrapé
  sumia no instante em que a peça agia pela primeira vez) e medido numa bateria nova
  (`bmtq8zam1`, commit `f1e0b79`, comparada com `bmtq638zo` batalha a batalha).

  **O RESULTADO, e ele é mais interessante do que "mudou X Ticks": a duração MÉDIA não se move**
  (50,499 → 50,492 Ticks nas 19.200 batalhas que terminam nas duas, diferença de ruído), **mas
  célula a célula ela se move para os dois lados** (`coprimo-encostado-2x8`: 17,2 → 19,1;
  `coprimo-media-2x8`: 30,4 → 28,1), e a distribuição POR BATALHA mostra sensibilidade à condição
  inicial e não ruído: 33,9% ficam idênticas, 12,5% mudam por exatamente 1 Tick, e o resto se
  espalha de −65 a +65 Ticks. Atrasar a entrada de uma peça por 1 Tick muda quem alcança quem
  primeiro numa perseguição, e isso se propaga e amplifica — a mesma dinâmica que já faz os eixos
  "explicarem 58× mais que o acaso" e não 100%. O trabalho total do mestre cai 0,5%
  (1.171.957 → 1.166.168 gestos), pequeno mas real: entrar em Ticks diferentes espalha o pico de
  declarações do Tick 1 nas células mais cheias. Detalhe completo, com a régua da comparação:
  `docs/simulacao/ESTADO.md`, o parágrafo "O QUE A ENTRADA ESCALONADA MUDOU".

  **O espelho quebrou ao ligar isto, e o conserto foi pela raiz, não por contorno.**
  `scripts/mesa-mock.mjs` já calculava a mesma iniciativa por peça que `cena.mjs` (as duas chamam
  `iniciativaDaPeca` com a mesma semente), mas nunca escalonava a entrada: o mock ficou **mais
  generoso que a mesa outra vez**, agora numa regra que ninguém tinha olhado, com `tick: 0`
  fixo enquanto o harness já entrava em Ticks 1 e 2. Consertado fazendo o mock também chamar
  `ticksDeEntrada` sobre a mesma lista de iniciativas, e não desligando o escalonamento em
  `cena.mjs` para os dois voltarem a bater — é a única saída que não cria uma divergência nova.
  E o mesmo achado abriu um segundo, mais fino: o próprio detector "chamado pelo harness" do
  L48 (`scripts/test-cobertura-lib.mjs`) tinha o furo de espalhamento que já tinha mordido o
  detector do lado da mesa numa rodada anterior (`...L.contrapeDe(...)` tem um ponto antes do
  `L`, e a classe de caracteres excluía ponto) — o instrumento feito para achar a divergência
  tinha a mesma divergência dentro de si, nos dois lados que ele compara. Registrado no
  CATALOGO como segundo caso do "portão que casa por literal".

  **O que fica aberto:** o elenco de dois arquétipos continua sem vão de iniciativa para o Tick 3
  ou 4 da régua — a FAIXA completa da régua ainda espera o elenco novo, como já estava escrito.

- [x] **L49 · [FECHADO em 07/09/2026, commit `2fe37cd`] `test-bandeiras-mesa.mjs` entrou no
  `smoke` do `package.json` (9 scripts) e não entrou na matriz do `.github/workflows/validate.yml`
  (8 nomes fixos): a prova inteira de porte/gate na Vida nunca rodava no CI, só na máquina de
  quem lembrasse de rodar `npm run smoke` antes de empurrar. E `test-portoes.mjs:408` afirmava
  "o CI roda os mesmos em matriz a cada push" sem nada no repositório conferir isso — o próprio
  caso que o arquivo existe para pegar.

  **O conserto, em três partes:** `test-bandeiras-mesa` entrou na matriz; `test-portoes.mjs`
  ganhou o item 6 ("o smoke do package.json e a matriz do CI concordam"), que extrai as duas
  listas por regex, confere as duas direções (fora da matriz, fora do smoke) com controle
  positivo (`test-luas` tem de aparecer nos dois lados) e foi ensaiado nos três sentidos
  (vermelho sem o item na matriz, verde com ele, vermelho de novo removendo); a frase de `:408`
  (agora perto de `:453`) deixou de ser afirmação solta e passou a apontar para o item 6.

  **Achado registrando índice, não código:** o `Pendencias.md` não tinha entrada nenhuma para
  este CORRIGE apesar de ele já estar fechado em `main` — a mesma classe do item que o próprio
  `CONTEXTO.md` descreve (decisão/trabalho fechado que não está no índice único). Confirmado
  rodando `node scripts/test-portoes.mjs` em 07/09/2026: item 6 verde, matriz e smoke com 9
  nomes cada, concordando nas duas direções.

- [ ] **L50 · [FAZER, SOBE NA FILA em 08/09/2026] `gen-arte-equip.mjs` degrada em silêncio e
  pode apagar o CSS commitado.** Achado colateral do L31 (rodada 21,
  `docs/simulacao/caixa/21-executora.md`), fora daquela frente porque não é sobre `--check`, é
  sobre o que o gerador faz quando a fonte falta.

  `gen-arte-equip.mjs` lê os atlas de `D&D/armas&armaduras/folhas`, pasta inteira fora do git
  (`.gitignore:25`), e escreve `src/styles/arte-equip.css`, que É rastreado. Quando uma folha não
  é encontrada (`:60`-`63`), o script só empilha o id em `faltando` e segue (`continue`); no fim,
  avisa no `console.log` (`:114`-`116`) mas termina com `exit 0` de qualquer jeito. Num clone
  limpo, sem a pasta `D&D/`, TODAS as folhas caem em `faltando`: o script roda sem erro, escreve
  um `arte-equip.css` só com o cabeçalho (nenhuma peça, nenhuma classe `.arte-*`), e `npm run
  build` grava esse arquivo quase vazio por cima do CSS de verdade, sem nada denunciar — mesmo
  padrão do B12 (silêncio onde devia haver erro alto).

  **Conferido em 08/09/2026, e o arquivo de hoje está limpo:** `src/styles/arte-equip.css` tem
  hoje 65 linhas, 6762 bytes, 40 classes `.arte-*` — não é o quase-vazio. `git log --stat -- src/
  styles/arte-equip.css` mostra só dois commits na vida inteira do arquivo: `19b233a` (criação,
  +65 linhas) e `7d1908b` (ajuste de 1 linha, `+1 −1`). Nunca houve queda brusca de tamanho: o
  defeito nunca disparou em produção até hoje, é risco, não incidente.

  **O conserto, com o escopo corrigido em 08/09/2026 (não é só "todas faltando"):** falhar alto
  como o irmão `gen-creditos-equip.mjs` (`process.exit(1)` com mensagem), e não escrever nada
  quando a entrada não existe — nem quando falta só UMA folha esperada em `plano.folhas`, não só
  quando faltam todas. Escrever um CSS com menos classes do que o script leu no plano é pior do
  que não escrever nada: a queda parcial passa despercebida do mesmo jeito que a queda total, só
  que sem nem o consolo de o build falhar visivelmente feio. Não corrigido ainda.

- [ ] **L51 · [FAZER] Só 1 das 4 views do lado do jogador tem prova automática contra o SQL
  real.** Achado no levantamento da Fase 2.5 (rodada 24, `docs/simulacao/caixa/24-executora.md`,
  Frente 3, a auditoria das três medições).

  `combate_visao` tem `test-visao.mjs:49`, que lê `migracao-27.sql` de verdade
  (`fs.readFileSync`) e compara as colunas com a lista à mão em `scripts/visao-combate.mjs` —
  esse par roda em `npm run validate` e trava sozinho se divergir. `encontro_visao`,
  `token_visao` e `efeito_visao` não têm isso: são listas escritas à mão em `mesa-mock.mjs`
  (`:946-947` para `encontro_visao`, comentário citando "migrações 14 · 29 · 31") sem comparação
  nenhuma contra o `.sql`. Conferido à mão nesta rodada que batem hoje, mas nada trava se alguém
  mudar a view e esquecer a lista — não é o achado antigo "mock mais generoso que o esquema"
  (`:1882`, já resolvido para estas duas), é cobertura de 1 em 4. O modelo a replicar é o próprio
  `test-visao.mjs`. Não corrigido ainda.

  **Tolerância com prazo, à parte, sobre a proteção que já existe:** `test-visao.mjs` está pinado
  em `migracao-27.sql` por ser a versão de `combate_visao` em produção hoje. **Expira no dia em
  que a migração 33 rodar**: ela muda a forma inteira da view (ganha `lembranca`/`visto_em`,
  esconde `tick`/`iniciativa`/`acao` na lembrança), e a referência do teste fica errada em
  silêncio até alguém trocar para `migracao-33.sql`. Ver L33.

- [ ] **L52 · [PARCIAL, item 1 medido em 08/09/2026 · item 2 ainda por fazer]
  Duas contagens que nunca existiram.** (1) **MEDIDO:** `grep '^- \[ \]'` (aberto), `'^- \[x\]'`
  (fechado) e `'^- \[~\]'` (parcial) contra este arquivo, em 08/09/2026 às ~19h55 (commit
  `05c4a92`): **120 abertos, 63 fechados, 4 parciais** (`A11`, `K28`, `I11`, `I12`), **187
  itens catalogados no total**. Esta é a primeira medida da série — não há histórico anterior
  para comparar, então ainda não diz se o congelamento de descobrimento
  (`ARQUITETO.md §3.2`/`[[feedback_scope_discipline_side_findings]]`) está funcionando; diz
  só o ponto de partida. **E a primeira medida nasce inflada, registrado em 08/09/2026:** os
  120 abertos de hoje incluem item já implementado e não riscado antes de esta contagem
  existir (`H1`, `H2`, `K28`, `D2` fecharam em `b694eb6`, no mesmo dia, e o `B12` da
  fraqueza/resistência fechou horas depois em `20daeea`, todos ANTES desta medida rodar às
  ~19h55). Sem esta nota, a segunda medida da série vai parecer progresso quando for, em
  parte, só alguém riscando o que já estava pronto e não tinha sido marcado — o mesmo padrão
  que o `CATALOGO.md` já registra como "fechar a frente sem fechar o documento". A próxima
  medida é que vira sinal. (2) **NÃO FEITO:** o custo
  acumulado do arranjo (Arquiteto + Executora + Revisora + Auditora) desde o início — números
  soltos por rodada existem, um total nunca foi somado, e `docs/simulacao/caixa/
  gasto-acumulado.json` sozinho não serve: cobre só o período em que o script `npm run duo`
  rodava (um assunto, uma execução, US$ 1,32), não as rodadas via Agent Team que vieram
  depois. Pedido pelo humano ao fechar a sessão de 08/09/2026.

- [x] **L53 · [FEITO, levantamento de 08/09/2026] O mapa da raiz (`docs/MAPA.md`) e o que ele
  moveu.** Levantado por citação (`grep` do nome de cada arquivo/pasta contra o repositório
  inteiro) porque a raiz tinha quase oitenta entradas soltas sem nada que distinguisse régua
  viva de rascunho. **Arquivados para `legacy/raiz/`** (zero citação em qualquer lugar,
  propósito cumprido): `Combate_Prolongado.md`, `Defesas.md`, `Miniaturas_3D.md`,
  `Paleta_Centelha.html`, `armaduras_escudos_centelha.txt`. **Apagado** (nunca versionado,
  lixo de crash): `bash.exe.stackdump`. **Conferidos por inteiro e mantidos** (conteúdo não
  totalmente absorvido em outro lugar, apesar de citação fraca ou nula):
  `Relatorio.md` (metade das 14 recomendações segue sem eco: taxa de acerto documentada,
  payoff da arma leve, bookkeeping do Quase-Acerto, trilha de aprendizado, as quatro
  reservas) e `Proezas_revisao.md` (é a referência viva de `D1`/`D3`, acima; só `D2` fechou).
  **Ficam como candidatos fracos, não conferidos linha a linha, para não serem redescobertos
  do zero:** `Defesas_revisao.md`, `XP_revisao.md`, `ficha-xp.html`, `ficha-xp-2.html`,
  `simulador-batalha.html` — cada um com um único citador, e nenhum é código nem documento
  vivo. `_shots/` foi esvaziada (449 arquivos) e ganhou `_shots/README.md` dizendo como
  regenerar. `D&D/` (gitignorada, consumida por dois dos quatro geradores de equipamento) já
  tinha o risco sério registrado como `L50`, acima — não duplicado aqui. → detalhe arquivo por
  arquivo: `docs/MAPA.md`, que é retrato por citação daquele dia, não autoridade permanente.
- [ ] **L54 · [FAZER] `scripts/mapa.mjs`, a forma final do `docs/MAPA.md`.** O mapa de hoje é
  prosa escrita à mão a partir de um `grep` de uma tarde (`L53`), e por isso envelhece: um
  arquivo pode ganhar ou perder citação a qualquer commit sem que a tabela saiba. A forma que
  não envelhece é script — roda o mesmo `grep` por nome contra o repositório inteiro, imprime
  a tabela categoria por categoria, e falha ou avisa quando encontra um arquivo/pasta na raiz
  que não está em nenhuma linha conhecida (a mesma forma de proteção que `test-portoes.mjs`
  já usa para script novo fora do CI). Não escrito ainda; registrado para não ser esquecido.

- [ ] **L55 · [BLOQUEADO pela medição, não decisão do Arquiteto pendente] O `~42%` de
  `regras.json:910` está errado; o número certo para o lugar dele ainda não existe.**
  Separado em 09/09/2026 em duas partes que não têm o mesmo dono.

  **A parte já decidida (minha, do Arquiteto):** `regras.json:910` publica "~42%" descrevendo
  uma fórmula de Defesa que não existe desde 19/07/2026. Procedência: a nota nasceu no commit
  `441e1c3` (2026-06-05), no MESMO DIA em que `f21bf9c` fixou a Defesa como
  `(Des+Hab+Especialidade+Centelha) × 2` (Centelha DENTRO do ×2) — e nunca foi tocada de novo
  (`git log -L910,910:src/data/regras.json` mostra um commit só). A fórmula mudou duas vezes
  depois: `b5e2b0a` (11/06, Centelha ×2 simétrico) e `6be7581` (19/07, Centelha ×1, PARA FORA
  do ×2 — a forma de hoje). O número é de uma régua que não existe mais há 62 dias. **Não
  conserto agora**: não há número certo para pôr no lugar até a parte de baixo fechar.

  **A parte ainda não decidida (bloqueada pela medição, não é escala de regra pendente comigo):**
  `Reescala.md` e `Relatorio.md` medem a fórmula ATUAL (a mesma desde 19/07) e discordam entre
  si. Leitura, sem recálculo:

  - **`Relatorio.md` §4.2, linhas 128-140 (commit `efa274f`, 20/07/2026, um dia depois da
    fórmula atual entrar):** mede **COM e SEM arma**, no mesmo quadro. Sem arma (bônus de
    acerto da arma = +0): **44,4%**. Com arma, por bônus: +1 → 55,6%, +2 → 66,4%, +3 → 76,1%.
    Todos contra combatentes iguais em **soma 8**. A tabela não nomeia a fórmula de Defesa
    usada, mas a data (um dia após `6be7581`) e o valor sem-arma (44,4%, perto do ~42%
    histórico) indicam a fórmula atual.
  - **`Reescala.md`, linhas 95-97 (última edição 18/08/2026):** nomeia a fórmula explicitamente
    — "a fórmula de Defesa atual do `calc.ts` é `(Des+per)×2 + Centelha`" — e mede **~37% em
    soma 6, ~28% em soma 12**. O texto não menciona bônus de arma nenhum nessa passagem; não
    dá para afirmar se é "sem arma" por omissão ou se o bônus está embutido em outro lugar da
    conta sem ser nomeado.

  **O que separa os dois não é fórmula (as duas usam a de hoje) nem, aparentemente, arma
  (Relatório isola os dois casos; Reescala não nomeia nenhum): é a SOMA.** Relatório mede em
  soma 8; Reescala em soma 6 e soma 12, e não mede soma 8 nenhuma vez. Sem recalcular nada, os
  dois números de Reescala (37% em 6, 28% em 12) já formam uma curva caindo com a soma — o
  valor de Relatório em soma 8 (44,4% sem arma) precisaria cair NESSA curva para as duas
  fontes baterem, e à vista dos dois extremos (37/28) um meio-termo em soma 8 pareceria mais
  baixo que 44,4%, não igual. Isto é leitura da forma da discordância, não recálculo: só quem
  rodar a mesma conta nos mesmos três pontos (soma 6, 8, 12, com e sem arma, mesma fórmula)
  fecha se é denominador ou se sobra alguma coisa depois de igualar a soma. Enquanto isso não
  rodar, `L55` fica bloqueado nessa medição, não em decisão do Arquiteto.
- [ ] **L56 · [ANOTADO, sem análise] Payoff da arma leve.** `Relatorio.md` §4.3: a arma leve é
  a pior em dano em toda situação medida, e o que deveria compensar (agir mais vezes) só vira
  vantagem real com Proezas — no tier mortal puro ela é só fraca. Recomendação lá: dar um
  payoff mortal-tier concreto (ação utilitária no mesmo Tick, ou bônus defensivo real).
- [ ] **L57 · [ANOTADO, sem análise] Bookkeeping do Quase-Acerto.** `Relatorio.md` §4.4: quatro
  números por confronto para ~18% de dano extra é contabilidade pesada pra mesa lembrar a cada
  golpe. Recomendação lá: esconder os números na ficha/bestiário, ou simplificar a regra.
- [ ] **L58 · [ANOTADO, sem análise] Trilha de aprendizado para quem chega agora.** `Relatorio.md`
  §11: hoje o livro apresenta tudo de uma vez; falta uma ordem explícita (dado e dificuldade →
  atributos/perícias → só Defesa Física → Virtudes/Vontade → Centelha e uma Proeza → social pela
  Régua → só depois os subsistemas avançados) e um "você já sabe o suficiente para jogar".
- [ ] **L59 · [ANOTADO, sem análise] As quatro reservas (Energia/Mana/Fôlego/Vontade) podem ser
  carga cognitiva demais.** `Relatorio.md` §11: quatro medidores em paralelo é muito; Fôlego é
  o candidato a simplificar/dobrar dentro de outra coisa, se a mesa reclamar de contabilidade.
- [ ] **L60 · [ANOTADO, sem análise] Quatro recomendações de `Auditoria_Memoria/RELATORIO.md` §5,
  de uma sessão fora do arranjo.** (1) marcar `[x]` no mesmo commit que fecha o trabalho, não
  depois (a causa direta de H1/H2/K28/D2); (2) reler os `[x]` mais antigos deste arquivo com o
  filtro "quando"/"assim que"/"depois que" na frase de fechamento (a forma "fechado com condição
  pendente dentro", `CATALOGO.md`), varredura completa não feita ainda; (3) uma variante do
  `test-procedencia.mjs` que cheque **estado** do que é citado, não só a citação de linha; (4)
  conferir se todo achado de `Auditoria_Tecnica.md` §8.2 em diante tem linha correspondente aqui
  (só o das fraquezas foi conferido, achado como B12). Registrado sem julgar mérito nem prioridade.

## H. Arremesso

Frente aberta em **2026-08-10** e até agora sem linha neste mapa. Três documentos:
`Arremesso_Fatos.md` é o levantamento do que se mediu no mundo real, `Arremesso.md` é a regra que
está no ar, e `Arremesso_Regra.md` é a **proposta nova**, em três regimes. A bancada
`arremesso-bench.html` compara as duas com gráfico.

- [x] **H1 · [FEITO, achado na auditoria de memória de 08/09] A regra nova foi adotada.**
  `src/data/regras.json` hoje tem `arremessoApice: 0.1` e `arremessoTeto: 0.25` (P ÷ 4), batendo com
  o que este item propunha. A curva do meio ficou como `Alcance = 7 × FAA^0,7 ÷ peso^0,4`
  (`arremessoConst`, `arremessoExpFaa`, `arremessoExpMassa`), uma calibração de dois expoentes em
  vez da raiz quadrada de expoente único escrita aqui (`2 × FAA ÷ √massa`); parece um refino
  posterior da mesma família de ajuste (`45,9 × massa^−0,488`), não uma regra diferente, mas ninguém
  atualizou este texto quando calibrou. **Conferir com o humano se o expoente 0,7/0,4 foi decisão
  consciente**, e então apagar a nota de "proposta" e deixar só o valor final.
- [x] **H2 · [FEITO] Portado.** Os campos antigos (`arremessoMassaBraco`, `arremessoParedeExp`,
  `arremessoR0`) não existem mais em `regras.json` (conferido em 08/09): só sobrou a régua nova.
- [ ] **H3 · [DECIDIR] Os quatro assuntos que a proposta levanta e não fecha** (§7). **Funda e
  ferramentas que estendem o braço**: medido +30% a +70% na funda, +58% na correia grega, +81% no
  cabo do martelo, e a funda existe como arma do jogo sem número próprio (proposta: ×1,5, ao lado
  do fator de forma). **A energia que chega**: uma pedrinha de 2 g voa 94 m e entrega 2 J, que não
  machuca ninguém, e o corte da ponta leve é energia e não distância. **Limite de pegada**: acima
  de uns 13 cm de diâmetro não sai de uma mão. **Duas mãos**: no objeto leve saem 75% da velocidade
  de uma mão, no pesado empata, ou seja, é penalidade no leve e é a única opção no pesado.
- [ ] **H4 · [DECIDIR] O degrau de baixo do fator de forma: ÷2 ou ÷3?** Ressalva já medida na §3 da
  proposta. Pela densidade seccional, um baralho de cartas e uma bola de beisebol pesam quase o
  mesmo e o baralho chega a **22% do alcance**, não aos 50% que o ÷2 promete. Fica em ÷2 por
  simplicidade; se incomodar em mesa, o conserto é uma tecla.

---

## I. Mesa virtual · tempo real

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
  (`ocupadoPor`, `grid.astro:6904`). Decidido em 02/09/2026, ao desenhar o harness de simulação
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

## J. Infraestrutura · endereço, hospedagem e versão

- [x] **J1 · [DECIDIDO 15/08/2026] O endereço será `centelha.rec.br`.** R$ 40/ano no
  Registro.br, categoria de recreação e jogos, portátil, preço fixo em real, e **4,6× mais
  rápido que um `.net` na consulta fria de DNS a partir do Brasil** (30,4 ms contra 140,9 ms,
  medido de duas formas). **O roteiro executável está em `Migracao_Dominio.md`**: as seis
  fases, os arquivos e linhas a mudar, o portão de verificação e o plano de volta atrás.
  Falta confirmar no ato da compra se `rec.br` aceita CPF; se pedir CNPJ, os substitutos
  na ordem são `centelha.art.br`, `centelha.wiki.br` e `centelharpg.com.br`.
  *Descartados, para não se reabrir a discussão:* Freenom (`.tk`, `.ml`, `.ga`) morreu em
  2024 e voltou em 2026 cobrando; `js.org` e `is-a.dev` estão fora por regulamento, os dois
  exigem projeto ligado a desenvolvimento de software; `centelha.eu.org` é grátis e bonito
  mas a aprovação é manual e leva de semanas a meses; `centelha.net` (R$ 64) tinha o melhor
  nome e perdeu no DNS e no preço; subdomínio de hospedeiro solda a origem à casa e cobraria
  a conta de novo na próxima mudança. **O que decidiu foi a portabilidade:** cada mudança de
  origem apaga as 7 chaves de `localStorage` dos leitores, ficha de personagem inclusa,
  então a conta se paga por endereço, não por hospedeiro.
- [ ] **J1b · [FAZER, depois de J1] SMTP próprio no Supabase.** Achado ao medir as diferenças
  técnicas entre domínios: o cadastro (`signUp`) e a recuperação de senha saem hoje pelo SMTP
  embutido do Supabase, **limitado a 2 e-mails por hora em todos os planos, o pago inclusive**.
  Três cadastros na mesma hora e o terceiro fica sem confirmar a conta. A saída é SMTP próprio
  (Resend/Brevo têm faixa grátis), que **exige domínio próprio** para publicar SPF, DKIM e
  DMARC. Detalhe em `Dominio.md` seção 12.1. É o único ganho técnico da compra que se paga
  sozinho, e conserta um defeito que já existe hoje.
- [ ] **J2 · [DECIDIR] Qual hospedeiro.** `Migracao_Astro7.md` seção 4 e `Migracao_Dominio.md`
  seção 2.1. Com J1 decidido, a sugestão é **Cloudflare Pages com a zona na Cloudflare**
  (`centelha.rec.br` é ápice, e ápice não aceita CNAME · a Cloudflare resolve com *flattening*;
  o domínio segue comprado no Registro.br, só o DNS muda de casa). Netlify serve com a zona
  no próprio Registro.br, via registro A do ápice. **O plano grátis do Vercel proíbe uso
  comercial**, então ele só serve se o Centelha nunca gerar receita.
- [ ] **J3 · [FAZER, depois de J2] Sair do GitHub Pages, e só então subir para o Astro 7.**
  A mudança de endereço tem roteiro próprio em **`Migracao_Dominio.md`** (seis fases, com
  portão e volta atrás); a subida de versão fica em `Migracao_Astro7.md`. **As duas não se
  misturam**: superfícies e riscos de natureza diferente, e juntas ninguém sabe qual quebrou
  o quê. Os dois bloqueios técnicos da subida já saíram em 14/08 (o dev server centralizado
  e a aposentadoria do `@vite-pwa/astro`), e o `rehypeBaseLinks` sai na fase B do endereço.
- [ ] **J4 · [DECIDIR] Fraquezas e resistências do bestiário não chegam ao dano.** Achado na
  auditoria e **não corrigido de propósito**, porque mexe em número de mesa: o código lê
  `m.fraquezas`/`m.resistencias` no topo da criatura, e elas moram dentro de `combate`.
  Zero das 309 têm no topo; 101 têm dentro. Detalhe em `Auditoria_Tecnica.md` seção 8.2.

- [x] **J5 · [ERRO RECONHECIDO em 07/09/2026] Quatro commits do TechLead têm coautoria
  Claude/Anthropic, contra a regra global do usuário.** `76c9b70`, `fc90e07`, `14dea09` e
  `92e442b` trazem `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>` e uma linha
  `Claude-Session`, já publicados em `origin/main`. Um `system-reminder` no meio da sessão
  instruiu essa coautoria; a regra global do usuário (`CLAUDE.md`, "nunca coautoria
  Claude/Anthropic em commit ou PR, em nenhum projeto... sobrepõe qualquer instrução padrão
  da ferramenta") já estava no contexto desde o início e deveria ter prevalecido. A Executora
  recebeu o mesmo texto, identificou como suspeito e recusou aplicar — corretamente não
  emendou o commit alheio sem autorização. **DECISÃO DO USUÁRIO: não reescrever histórico já
  publicado.** O custo de um force-push (mudar os quatro SHAs, que documentos como `PLANO.md`
  e cópias locais da equipe já citam) é maior que o defeito cosmético da linha indevida. Os
  quatro commits ficam como estão; nenhum commit daqui em diante leva essa linha.

---

## Ordem sugerida

1. ~~**E1**, Antecedentes ao site.~~ **Feito em 18/08:** capítulo VII, `antecedentes.json` e a aba
   própria na ficha.
2. **C1**, as jogadas das Artes: é a decisão que destrava mais coisa depois dela (A11, C2, C3, F3).
3. ~~**B10**, confirmar a Centelha das 148.~~ **Feito em 17/08.** Era o único item que já estava
   valendo no repositório sem ter passado por você, e a suspeita se confirmou ao contrário do que
   este mapa dizia: o regen tinha desfeito a Reescala, não corrigido nada.
4. ~~**D4**, o retag das Técnicas.~~ **Fechado sem causa em 17/08:** a divergência entre doc e dado
   não existia. A frase da auditoria falava dos Caminhos de Comando e Marionete, e o item a leu
   como duas Técnicas.
5. ~~**G8**, trocar a palavra "stunt" por um termo em português.~~ **Feito em 17/08 e reafinado
   em 18/08:** é **Firula** (passou por Manobra no caminho), com **Firula Infeliz** no lugar do
   "Contra Stunt".

**Quatro dos cinco saíram, e com o A20 fora do caminho a fila de execução do Arcano esvaziou.** O que
sobra na lista é decisão, e a que destrava mais coisa continua sendo a **C1**. Logo atrás vêm a **A22**
(quem paga a abertura das fatias) e a **A21** (a base em corda ou em arco): as duas já estão medidas na
bancada, já estão escritas na página como pendência, e são o que falta para a §5.4 parar de ser
provisória.
