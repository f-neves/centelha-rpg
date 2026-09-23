# K. Combate · a linha do tempo

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
  leva a chance de acertar de 84% para 42%, e **−2d6 a leva a zero**, porque 1d6+5 não supera 12:
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
  tudo no Tick da declaração: rolagem, dano e morte. O Preparo cobra Defesa e não adia nada.

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
  (`ficha-engine.ts:1531`, `Bloqueio soma a Defesa das armas/escudos do conjunto EM USO`). Com
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
- [x] **K12 · [DECIDIR] Como se conta um teste de Virtude.** Teste de Virtude **não soma Atributo
  nem Habilidade**, só a Virtude, e por isso a régua de pool de hoje (`[(A+H)/2]d6`, com +2 se
  ímpar) não se aplica a ele. Duas formas na mesa: **pool** (a Virtude vira dados pela mesma
  escada, `1d6 · 1d6+2 · 2d6 ...`) ou **soma única**, mais perto da Iniciativa (`1d6 + Virtude`).
  A escolha muda a variância e o teto: o pool cresce em média e em dispersão, a soma única mantém
  a dispersão fixa e faz a Virtude pesar linearmente. Aberto em **19/08/2026**, e vira urgente
  porque o combate passou a pedir teste de Virtude (continuar o golpe ignorando um perigo visível
  é teste de **Bravura**, §K).
  **Fechado na revisão da rodada 94 (23/09/2026), com prova:** decidido na §14 de `leitura-de-novato-decisoes.md` (a Virtude sozinha pela conversão de sempre, a forma pool), com régua de Dificuldade própria pela §16, e no livro desde `c5dd390`.
- [x] **K13 · [CONSERTAR] A Guarda sob pressão está em dobro no motor.** `scripts/lib-tempo.mjs`
  faz `guard += R.pressao` (linha 225) e desconta `R.pressao * guard` (linha 153): com
  `pressao: 2`, cada ataque feito ou recebido tira **4** de Defesa, e não os **−2** que o capítulo
  IX (`combate.md:233`) e o comentário da própria linha 54 escrevem. O parâmetro entra ao
  quadrado. Consequência medida: a curva do **K4 inverte**. Com −4, o Preparo do arco custa win
  rate (a 45 m, P=0 dá 28,3% e P=2 dá 13,4%, que é a §7 publicada); com −2, o Preparo **paga** (a
  45 m, P=0 dá 11,7% e P=5 dá 54,0%). **O K4 não pode ser decidido antes disto.**
  **Fechado na revisão da rodada 94 (23/09/2026), com prova:** `b6af150` (19/08/2026). O `scripts/lib-tempo.mjs` diz no cabeçalho que o motor cobrava em dobro até essa data, e guarda o regime antigo em `pressaoDupla`.
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

  - **1 motor · 2 relatório · 3 bancada**: feitas. O motor tem os quatro presets e a bancada
    ganhou o seletor de sistema, cinco cartões e duas baterias.
  - **5 `regras.json`**: feita. O bloco `combate` tem os dois sistemas, os dois modos de
    marcação, a régua P/G/R por classe, a da Arte, a escada, a rajada com os tetos, a dupla e o
    deslocamento pago.
  - **6 ficha e mesa**: feita. `src/lib/combate-tempo.ts` (o motor da tela, travado por
    `scripts/test-combate-tempo.mjs`), a **migração 27** (`mesas.combate` e `combatentes.acao`,
    com a view escondendo arma e alvo do jogador), o painel **⏱** do mestre nas duas telas, o selo
    de fase e a fita no rastreador, a manobra no diálogo de ação, e o anel de Golpe mais a fita
    miúda no Grid. Na ficha, a linha "No tempo" mostra o P/G/R da arma.
  - **4 capítulo IX**: a única que falta, e espera **K12** (teste de Virtude) e **K17**
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

