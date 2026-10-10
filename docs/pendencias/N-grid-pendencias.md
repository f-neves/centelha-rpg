# N. Grid e mesa · o que o livro diz e o tabuleiro ainda não faz

Lista única das divergências entre o livro e o Grid (ou a mesa), pela D-054 (04/10/2026): o Grid fica
congelado até fecharem as regras, as Proezas, as magias e as criaturas. O livro manda, e o Grid se ajusta
depois, numa passada só. Cada item diz o que o livro diz e o que o Grid ou a mesa fazem hoje.

Nada desta lista se conserta antes da passada do Grid. Quem achar uma divergência nova a acrescenta aqui.

- [ ] **N1 · [FAZER] Velocidade da conjuração pelo maior grau investido (ART-35).**
  - O livro diz (Regras das Artes, Os dois modos, Passar do seu limite, Conjuração composta): 5 Ticks
    quando o maior grau investido vai de 0 a 3, 6 quando é 4, 7 quando é 5 ou 6. O esticar multiplica a
    Velocidade do conjuro antes de esticar.
  - O Grid faz (`ticksDe`, `src/lib/artes-grid.ts:389`): o Efeito leva 4 + nível do Efeito + 1 por grau
    esticado, e o improviso, 5 + 1 por grau esticado, sem olhar o maior grau.
- [ ] **N2 · [FAZER] O primeiro alvo da Cura é grátis (ART-33).**
  - O livro diz (A economia da Cura): o nível 1 de Alvos é grátis, e do 2º em diante cada nível custa 2.
  - O Grid faz (`custoDe`, `src/lib/artes-grid.ts:350`): cobra 2 por nível só no parâmetro Cura, e o
    Alvos a 1 por nível, desde o primeiro.
- [ ] **N3 · [FAZER] A escada da Defesa no desvio fora da vez (ART-11).**
  - O livro diz (A área não se esquiva): fora da vez, a jogada de sair leva no total −2 no Preparo, −4 no
    Tick do Golpe e −2 por golpe pendurado na Recuperação.
  - O Grid faz (`src/lib/artes-grid-mesa.ts:1793`): só soma o +2 ou +4 de quem identificou o efeito.
- [ ] **N4 · [FAZER] Projétil e arma de Gelo, Água e Terra são matéria (ART-36).**
  - O livro diz (Conjurar e resistir, e os verbetes): o Projétil Conjurado e a Arma Elemental de Gelo,
    Água e Terra são matéria, e a armadura os absorve; os de Fogo, Raio, Luz e Sombra, só a Centelha e a
    resistência ao elemento.
  - O Grid faz: o bloco `grid` dos dois Efeitos em `efeitos.json` tem `materia: null` para todas as Artes,
    e o tabuleiro não separa a Arte.
- [ ] **N5 · [FAZER] Bloquear uma Arte pelo critério da matéria (ART-42).**
  - O livro diz (Conjurar e resistir): o que deixou matéria se bloqueia como a arma de arremesso do mesmo
    tamanho, e Fogo, Raio, Luz, Sombra e o gelo que evapora só se esquivam.
  - O Grid faz: os módulos `artes-grid*.ts` não têm regra de Bloqueio contra Arte, e o `materia: null` é o
    mesmo do N4. A Defesa que o tabuleiro usa contra o projétil não foi conferida.
- [ ] **N6 · [FAZER] Acelerar a Cura na escala dos dias (D-062, ART-47).**
  - O livro diz (verbete do Efeito): cada nível da Arte encurta em 10% o intervalo da tabela de
    Recuperação, até 50%. Abaixo de 0, soma +1 por nível ao Tratar (D-009).
  - O Grid faz: cura 1 PV por nível da Arte, pelo campo `porNivel: true` do parâmetro Cura
    (`src/lib/artes-grid.ts`, comentário do campo, L86b).
  - O diálogo de conjurar do Grid mostra o texto dos parâmetros fixos (`src/lib/artes-grid-ui.ts:807`),
    e por isso já exibe "Cura: encurta o intervalo em 10% por nível da Arte" enquanto cura 1 PV por nível.
- [ ] **N7 · [FAZER] Mãos sobre a Multidão pelo maior grau investido (D-060, ART-37).**
  - O livro diz (verbete): o nível é o maior grau investido por quem conjurou, 1 PV por grau.
  - O Grid faz: cura pelo nível da Arte de quem conjurou, pelo mesmo campo `porNivel: true`.
  - O diálogo de conjurar do Grid mostra o texto dos parâmetros fixos (`src/lib/artes-grid-ui.ts:807`):
    exibe "Cura: 1 PV por grau investido" e a Dificuldade "(maior grau investido) × 5" dos 28 Efeitos
    (D-060), enquanto cura pelo nível da Arte. O Grid não calcula Dificuldade de Efeito por fórmula
    nenhuma: a linha é só texto.
- [ ] **N8 · [FAZER] Chamar à Mão com Dificuldade (D-060, ART-23).**
  - O 1e pede: "é disputa: quem o segura rola Força + Atletismo contra a Dificuldade, e o objeto só fica
    se a superar", com a linha "Dificuldade: (maior grau investido) × 5".
  - Não entrou no livro: a linha nova de Dificuldade muda o bloco `grid` gerado do Efeito (o
    `gen-grid-artes.mjs` marca `teste: true` em todo Efeito com Jogada ou Dificuldade), e o gerador e o
    bloco são do Grid. O texto entra junto com a passada do Grid.
- [ ] **N9 · [FAZER] Imobilizado não age (D-064, D-043).**
  - O livro diz (Combate, Manobras; D-019, D-043): o Imobilizado não age, nem com Firula, e só tenta
    escapar.
  - A mesa faz (`src/data/condicoes.json:19-21`): Imobilizado tem Defesa −4 e ação −2, e age com
    penalidade.
- [ ] **N10 · [FAZER] O estado Preso não existe na mesa (D-064).**
  - O livro diz (D-019, decisão 25; Regras das Artes, Aprisionamento; a Rede): Preso não se desloca, mas
    age.
  - A mesa não tem condição Preso em `condicoes.json`.
- [ ] **N11 · [FAZER] Agarrado (D-064).**
  - O livro diz (D-019, decisão 23): o agarrado não age e não rola, e as penalidades são as do agarrão.
  - A mesa faz (`src/data/condicoes.json:25-27`): Agarrado tem Defesa −2, e "só ações de força, arma curta
    ou escapar".
- [ ] **N12 · [FAZER] Caído levanta com Velocidade 3 (D-064).**
  - O livro diz (Combate, Derrubar; D-019, decisão 27): levantar-se é uma ação de Velocidade 3.
  - A mesa faz (`src/data/condicoes.json:15`): "Levantar consome movimento". Também soma ação −2, que o
    livro não dá ao Prono.
- [ ] **N13 · [FAZER] A Prisão deixa Preso, e não Imobilizado (D-064).**
  - O livro diz (Regras das Artes, Aprisionamento e contato): o preso fica Preso e escapa com Força +
    Atletismo contra a Dificuldade do Efeito.
  - O Grid faz (`scripts/gen-grid-artes.mjs:248`): a Prisão (com Engolir, Paralisia e Círculo) dá a
    condição `imobilizado`.
- [ ] **N14 · [FAZER] A escala de 0 a 6 do Escapismo.**
  - O livro tem a secundária Escapismo (`habilidades-secundarias.json`, rodada 5), sem a escala de níveis
    que as outras secundárias têm (`niveis`).
  - A mesa e a ficha não têm nada a ler para ela.
- [ ] **N15 · [FAZER] O Desarmado novo (D-057), a preencher depois da aplicação.**
  - A D-057 trocava a linha Desarmado por Punhos e Chutes. A D-067 tirou os Chutes do equipamento: o chute
    virou só regra de texto, e nunca esteve na mesa nem no Grid (o antigo N16 saiu).
  - A mesa e o Grid leem o Desarmado:
    - `src/lib/combate-resumo.ts:66` e `:72` (`ARMA['desarmado']`, usado por `mesa-ficha.ts` e
      `mesa-bestiario.ts`);
    - o `armaDoSlot` de `src/lib/equip.ts:129`, em `grid.astro:8782`, `:10140`, `combate.astro:1929` e
      `grid-golpe-fx.ts:663`;
    - `src/lib/combate-tempo.ts:218`.
  - Aplicada na rodada 13 (D-065): o id `desarmado` ficou, com o nome "Punhos" e os mesmos números, e
    entrou `chutes`, que a D-067 tirou na rodada 14. Nada nesses leitores quebra, e o que eles ainda não
    fazem está em N17 a N19.
  - O `ficha-card.ts:74`, que a mesa usa, ainda tem "Desarmado" como reserva quando não acha nome.
- [ ] **N17 · [FAZER] Os dois punhos somam no Bloqueio (D-065).**
  - O livro diz: só os dois punhos somam entre si, +1 cada, +2 com as duas mãos livres. Arma ou escudo e
    corpo não somam, e a ficha mostra a melhor combinação.
  - A ficha faz isso desde o CORRIGE 140 (`calcConj` em `ficha-engine.ts`): os Punhos, em qualquer das duas
    mãos, contam como mão livre. Na rodada 13 a mão inábil com Punhos ainda somava como arma, e o
    Punhos / Punhos contava um punho só.
  - A mesa calcula o Bloqueio sem a Defesa da arma nenhuma (`mesa-ficha.ts:97`) e usa a Esquiva como
    Defesa física do resumo (`combate-resumo.ts:157`).
- [ ] **N18 · [FAZER] Lâmina contra o corpo (D-057, D-065).**
  - O livro diz: quem Bloqueia sem arma um ataque cortante ou perfurante, com qualquer parte do corpo,
    recebe o dano normalmente, mesmo que o Bloqueio supere o ataque. A Esquiva não muda.
  - O Grid e a mesa não têm essa regra.
- [ ] **N19 · [FAZER] A escolha da melhor combinação de defesa (D-065).**
  - O livro diz: o personagem defende com o que tem nas mãos (somam, dois escudos contam), ou com o corpo
    quando nada nas mãos é usado, e o Mestre ajusta pela situação (as pernas, −1, quando as mãos não
    podem ser usadas).
  - O Grid e a mesa não deixam escolher.
- [ ] **N20 · [FAZER] A classe de ataque dos golems de Punhos (D-065, D-054).**
  - O `gen-monsters.mjs` dá a classe do ataque pelo nome da arma do catálogo. Com a arma Punhos (leve) no
    catálogo, o Golem de Ferro e o Golem de Pedra, que atacam com "Punhos" a Velocidade 6, passariam de
    "media" a "leve".
  - Para a mesa não mudar, os dois estão no `CLASSE_OVERRIDE` como "media" (rodada 13).
  - Na passada do Grid, decidir a classe deles (leve pelo nome, ou média pela Velocidade 6).
  - O Golem de Gelo ataca com "Punhos gelados" a Velocidade 5. O nome também começa com "Punhos", e ele
    também passaria a "leve" pelo nome, mas já era "leve" pela Velocidade 5, então nada mudou nele.
- [ ] **N21 · [FAZER] Religar o `test-grid` no começo da passada única do Grid (D-071).**
  - O `test-grid` saiu da matriz do CI (`.github/workflows/validate.yml`, linha comentada) e do `smoke`
    do `package.json` na rodada 14, e está declarado no `TESTES_FORA` de `scripts/test-portoes.mjs`. O
    flake "[aquece]" travava as rodadas.
  - A passada única do Grid começa religando esse teste (descomentar a linha da matriz, devolver
    `node scripts/test-grid.mjs` ao `smoke`, tirar a entrada do `TESTES_FORA`).
  - Em seguida, conferir o que quebrou com as mudanças do livro nos dados compartilhados (`armas.json`,
    `condicoes.json`, `efeitos.json`, `regras.json` etc.).
  - Os outros testes de mesa da matriz (test-grid-simultaneo, test-golpe-caido, os `-mesa` e o
    test-espelho) continuam ligados.
- [ ] **N22 · [FAZER] O catálogo de Arremesso e tiro da rodada 1 (D-072 a D-076, D-082): o que o Grid herda e o que ele ainda não lê.**
  - Feito em `armas.json` na rodada 1 (10/10/2026): Velocidade, dano, Acerto, Peso e a nova `efetiva` (metros, par) em toda arma de tiro e de arremesso; Dardos saíram, entraram Plumbata, Shuriken, Mini-faca, Kunai, Boleadeira e os bumerangues (o id `bumerangue` ficou como o de retorno em Impacto, e entraram `bumerangue-de-caca`, `bumerangue-de-caca-cortante` e `bumerangue-de-retorno-cortante`); o atlatl mora em `src/data/armas-extras.json`, fora de `armas.json`, porque a ficha, a mesa e o bestiário leem `armas.json` inteiro como lista de armas.
  - **O Grid herda as Velocidades novas e o P/G/R velho.** Arco Longo e Composto passaram a V7, e azagaia, machado de arremesso, pilum, Funda (já V6), Rede e Boleadeira a V6; o Grid deriva Preparo e Recuperação de `classe` + `ticks` por `regras.json` `combate.pgr.preparo` (distância P = V − 1, arremesso P = V − 2), então a pesada de arremesso sai 4/1/1 e não 3/1/2, o Longo 6/1/0 e não 4/1/2, e as bestas seguem P = V − 1. A reforma da D-082 entra com o motor na rodada 4a.
  - **`distMax` do arremesso é legado sem fonte na regra** (D-074: a Máxima sai do FAA e do peso). Ficou nas 7 armas que já o tinham (adaga de arremesso, machado de arremesso, azagaia, Funda, bumerangue, Rede, Pilum) porque `alcance.ts` (`faixaDeDistancia` e o Interpor) e `test-folha-arremesso.mjs` o leem; as armas novas não o têm (`alcanceDaArma` devolve nulo, e o Interpor "avisa e não impede": para essas 8 ele deixa de exigir também a RETA, então um aliado a 300 m e fora da linha pode se interpor; medido pela Revisora no veredito 147). Remover o `distMax` do arremesso, junto de `alcance.ts` e do teste, é da passada do Grid. Nos arcos e bestas o `distMax` e o `alcanceLivreFrac` ficam, e o `distMax` bate com a Máxima nova na Força 3 (120, 250, 300) e com as bestas (100, 200, 300).
  - **A régua de faixas do Grid é a antiga** (`combate.alcance.faixas`: quatro partes do que sobra entre o livre e o máximo, −3 cada). A D-072 troca por Efetiva + incremento de meia Efetiva, sem teto, com +1 Tick de voo por incremento (D-073). `regras.json` `combate.distancia` já traz os números novos (Efetiva, Máxima dos arcos por Força, bestas, ×2 da Funda e do atlatl), mas nada os lê ainda.
  - **A Rede não causa dano e a mesa pode rolar 1d6.** O catálogo exige `dado` ≥ 1, então a Rede segue com `dado` 1 e `danoBonus` 0, e a descrição diz "sem dano". A Boleadeira tem 1d6−4 (exceção à classe pesada).
  - **O Preso pela Rede e pela Boleadeira** (Esquiva −2/−2 e −1 por grau de Margem, e −4 de Esquiva) não existe em `condicoes.json` nem no Grid (D-079).
  - **A exceção da Plumbata** (projétil rápido que também se defende com Bloqueio, D-076) está só na descrição e na tag `bloqueável`; nada no Grid nem na ficha a lê (a linha "Projétil rápido" da ficha, em `renderCombate`, diz que sem escudo hábil só a Esquiva defende).
  - **ARTE, não é defeito de dado:** as 8 armas novas (Plumbata, Shuriken, Mini-faca, Kunai, Boleadeira e os três bumerangues novos) não têm arte (`.arte-<id>` em `arte-equip.css`), e o quadro da imagem fica vazio na ficha e no diálogo de adicionar arma. A Plumbata herdou a célula do dardo (`.arte-plumbata`, o `.arte-dardos` de antes), e essa arte é **PROVISÓRIA** (a célula desenha um dardo, e a Plumbata é curta, com chumbo e sem pena); o mapa `D&D/armas&armaduras/folhas/haste/haste.json` da rpg-system já diz `plumbata` desde 10/10/2026; as outras sete esperam arte nova, que sai do plano `scripts/folhas-ia.json`, das folhas retificadas (`D&D/`, fora do git) e de `node scripts/gen-arte-equip.mjs`. Não se inventa arte à mão.
  - **A reforma de P/G/R do tiro (D-082, rodada 4a) está só no dado e no livro.** Mora em `regras.json` `combate.pgr.reforma.tiro` (Arremesso leve 2/1/1, médio 3/1/1, pesado 3/1/2; Funda e Curto 4/1/1; Longo e Composto 4/1/2; bestas 7/1/1, 9/1/2, 12/1/2; azagaia com atlatl 5/1/2), numa chave que nada lê. O motor do Grid (`combate-tempo.ts`) segue na fórmula de `combate.pgr.preparo` (distância P = V − 1, arremesso P = V − 2), então no Grid o Longo sai 6/1/0, a pesada de arremesso 4/1/1 e as bestas P = V − 1. O `test-combate-tempo` guarda a fórmula velha (ESPERADO "até a 4a"). Na passada do Grid o motor passa a ler `reforma`.
  - **A reforma de P/G/R do corpo a corpo (D-082, rodada 4b) também está só no dado e no livro.** `regras.json` `combate.pgr.reforma.corpoACorpo` traz Leve 1/1/3 V5, Média 2/1/3 V6, Haste média 2/1/3 V6, Haste de Guerra 3/1/3 V7, Pesada 3/1/3 V7 e Punhos 1/1/3 V5, e as chaves `investida`, `rajada` e `dupla` trazem a Investida de toda arma (Preparo × 4 m andando, × 7 m investindo), a Rajada (+1 Tick de Golpe e +1 de Recuperação por golpe extra, −1d6 acumulando, teto 3/3/2/2/2) e a dupla (par de leves ciclo 5, média ciclo 7). O motor (`combate-tempo.ts`) segue em `combate.pgr.preparo` (leve 0/1/4, média 1/1/4, haste 2/1/3, pesada 2/1/4; o `test-combate-tempo` guarda isso), então o Grid ainda tem Preparo 0 na leve, a Alabarda (V7) sai 2/1/4 e os Punhos 0/1/4, e a leve segue sem investir de graça; a Rajada e a dupla do Grid contam a Velocidade velha. A Investida do Grid só deixa a leve investir se o motor der Preparo a ela.
  - **O catálogo do corpo a corpo mudou nos números (D-082), e o Grid lê `armas.json`:** a Lança passou a 1d6 (era 1d6+2) e soma Força×2 em duas mãos (saiu o `forcaMult` 1); a Alabarda passou a Velocidade 7, Acerto +0, Defesa +0; a Lança Longa a Defesa +0. O `gen-monsters` e as criaturas do bestiário não foram recalculados (D-077). O Bastão do catálogo é leve (V5, uma mão), enquanto a D-082 o lista entre as hastes médias: ficou leve.
  - **O tempo de voo (D-073) não existe no Grid**: o projétil chega no Tick do Golpe, a penalidade de mira é a das quatro faixas e o ataque conta como recebido no Golpe.
  - **"Força acima de 8 conta 8" no dano dos arcos (adendo 3):** a ficha aplica por `forcaNoArco` (`calc.ts`, chamada em `ficha-engine.ts` nas duas mãos). O `combate-resumo.ts:107`, que a mesa usa, faz a própria conta (`capF`) e NÃO chama a função: para Força 9 ou mais a ficha e a mesa divergem. Só afeta quem tem Força 9+ com arco (criaturas e não mortais). A passada do Grid liga `forcaNoArco` ali, e o `test-forca-arco.mjs` muda de sentido nesse dia (ele hoje exige que a mesa NÃO a chame).
  - **O Arco Curto** passou a 1d6−2 e Acerto +2, a Força máxima 3 (`forcaCap`) já era dele. O atlatl não está ligado a nada: nem a ficha nem a mesa o leem.
  - **A ficha já mostra a régua nova do corpo a corpo; o Grid não.** O `linhaPGR` da ficha (`ficha-engine.ts`) lê `combate.pgr.reforma.corpoACorpo` para as armas de corpo a corpo (Leve e Punhos 1/1/3, Média 2/1/3, Pesada 3/1/3), enquanto o motor do Grid segue em `combate.pgr.preparo` (Punhos 0/1/4). (Distância e arremesso passaram à régua do livro na 4d: ver o item abaixo.) A penalidade da mão inábil da ficha (−1d6 hábil, −2d6 inábil) não mudou: espera a K18 (Ambidestria).
  - **O Grid não aplica a D-088 (Bloqueio desarmado contra arma: o dano da arma passa, a Margem não).** Nada o lê hoje: `lance.ts`, `mesa-*.ts`, `grid.astro` e `combate.astro` não resolvem cortante, perfurante nem "sem arma", e a ficha só calcula o valor do Bloqueio. O efeito é de texto e de mesa de papel. Se o Grid um dia resolver o Bloqueio, a regra entra na passada do Grid.
  - **A ficha mostra a régua do livro em TODAS as armas desde a rodada 4d (`src/lib/ficha-pgr.ts`, `anatomiaDaFicha`), e o Grid segue a velha.** Corpo a corpo vem de `combate.pgr.reforma.corpoACorpo` (4b), tiro e arremesso de `combate.pgr.reforma.tiro` (4a), pelo id da arma. As 13 armas de tiro em que o Grid diverge do livro, medidas em 10/10/2026 (Grid -> livro): Arco Curto 5/1/0 -> 4/1/1; Arco Longo e Composto 6/1/0 -> 4/1/2; Besta Pequena 8/1/0 -> 7/1/1; Besta Média 11/1/0 -> 9/1/2; Besta Grande 14/1/0 -> 12/1/2; Machado de Arremesso, Azagaia, Pilum, Rede, Boleadeira, Bumerangue de Caça e o Cortante dele 4/1/1 -> 3/1/2. As outras 8 de tiro coincidem por acaso. O `test-capitulo-armas.mjs` percorre as 40 armas e compara a ficha com a tabela do capítulo. Na passada do Grid o motor passa a ler `reforma` e a divergência some.
  - **O tempo da Arte (D-084, rodada 4c) muda no livro e não no Grid** (conta conferida pela Revisora, veredito 155). O livro passa a soltar a Arte no Tick do Golpe (V − 1; esticada, n × V − 1), com 1 Tick de Recuperação só no ciclo final. O Grid resolve a Arte no último Tick e sem Recuperação: `grid.astro` (`declararTempo`, perto da l.11500), `artes-grid-mesa.ts` (perto das l.887, 1390 e 1507) e `test-artes-grid.mjs` (perto das l.949 a 977, "sai no 8"). A 4c não toca nessas linhas.
  - **A Velocidade da Arte tem três escalas no repositório** (achado da Revisora, veredito 155; conflito livro contra motor congelado, sem pergunta ao autor pela D-087). (1) Livro e `feiticoTicks`: 5/6/7 por grau, esticar × V; é a da D-082. (2) `regras.json` `efeitos.ticks` (perto da l.2159) e `artes-grid.ts` (perto da l.395): "4 + nível do Efeito + 1 por grau", que passa do teto 7 nos Efeitos de nível 4 a 6 e estica 1 por grau; só o Grid a lê. (3) `combate.pgr.arte` e `reguaDaArte`: ciclo = nível + 3; `test-combate-tempo.mjs` (perto da l.358) fixa grau 6 = 9 Ticks, e só o teste a chama. Na passada do Grid fica uma só, a (1). A recalibração das Artes (A34) parte da (1).
  - **A Defesa do livro (D-078, D-079, rodada 5) e a do Grid divergem.** O livro passa a ter piso 0 na Defesa, Defesa zerada para o surpreso, o totalmente imobilizado, o dormindo e o desacordado, cego a Esquiva −4 e o Bloqueio −8, a tabela de restrição de corpo e de lugar, e nenhum teto nas penalidades (só +6 nos bônus). O Grid soma sem piso (`defesaEfetiva`, `lance.ts`: `defesaBase + ferimento + condicoesDefesa + defesaPerdida`), não zera Defesa por falta de aviso nem por imobilização, não tem a tabela de restrição e lê o −4 de surpreso, cego e imobilizado de `condicoes.json` (D-064). Nenhum código aplica um teto de ±6: a divergência é de piso, de zeragem e da tabela. Entra na passada do Grid.
  - **O porte do livro (D-077, rodada 6) e o do Grid divergem.** O livro soma +3 por categoria sem teto, só o menor ganha no corpo a corpo (o maior ataca o menor sem penalidade) e à distância é relativo nos dois sentidos. O Grid chama `modificadorPorte` (`calc.ts`, usado em `grid.astro` perto da l.10268), que lê `porteAcerto.ordem`, `porDiferenca` e `capCategorias`: teto de 4 categorias (+12 e −12) e simétrico também no corpo a corpo, com a penalidade do maior contra o menor. Esses três campos ficaram como estão (`porteAcerto.gridNota`), e a regra nova mora em `porteAcerto.reforma`. O `test-bandeiras.mjs` guarda a regra velha (médio contra colossal +12, colossal contra médio −12, teto em 4). Na passada do Grid `modificadorPorte` passa a ler `reforma` e esse teste muda de sentido. A Defesa baixa das criaturas grandes e os desafios ficam na B14 (D-077).
