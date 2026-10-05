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
  - A D-057 troca a linha Desarmado por Punhos e Chutes, e espera o relato da conferência.
  - A mesa e o Grid leem o Desarmado:
    - `src/lib/combate-resumo.ts:66` e `:72` (`ARMA['desarmado']`, usado por `mesa-ficha.ts` e
      `mesa-bestiario.ts`);
    - o `armaDoSlot` de `src/lib/equip.ts:129`, em `grid.astro:8782`, `:10140`, `combate.astro:1929` e
      `grid-golpe-fx.ts:663`;
    - `src/lib/combate-tempo.ts:218`.
  - Aplicada na rodada 13 (D-065): o id `desarmado` ficou, com o nome "Punhos" e os mesmos números, e
    entrou `chutes`. Nada nesses leitores quebra, e o que eles ainda não fazem está em N16 a N19.
- [ ] **N16 · [FAZER] Chutes na mesa e no Grid (D-057, D-065).**
  - O livro diz (Cap. XIII, Luta desarmada): os Chutes são arma média de Briga (Velocidade 6, Acerto +0,
    Defesa −1, 1d6 + Força).
  - A mesa e o Grid leem `armas.json` pelo `armaDoSlot` e passam a achar `a:chutes`. Mas com a mão vazia
    caem sempre em `ARMA['desarmado']`, os Punhos (`combate-resumo.ts:66`, `:72`), e nada no tabuleiro
    oferece os Chutes.
  - O `ficha-card.ts:74`, que a mesa usa, ainda tem "Desarmado" como reserva quando não acha nome.
- [ ] **N17 · [FAZER] Os dois punhos somam no Bloqueio (D-065).**
  - O livro diz: só os dois punhos somam entre si, +1 cada, +2 com as duas mãos livres. Arma ou escudo e
    corpo não somam, e a ficha mostra a melhor combinação.
  - A ficha faz isso desde o CORRIGE 140 (`calcConj` em `ficha-engine.ts`): Punhos ou Chutes, em qualquer das
    duas mãos, contam como mão livre. Na rodada 13 a mão inábil com Punhos ainda somava como arma, e o
    Punhos / Punhos contava um punho só.
  - A mesa calcula o Bloqueio sem a Defesa da arma nenhuma (`mesa-ficha.ts:97`) e usa a Esquiva como
    Defesa física do resumo (`combate-resumo.ts:157`).
- [ ] **N18 · [FAZER] Lâmina contra o corpo (D-057, D-065).**
  - O livro diz: quem Bloqueia sem arma um ataque cortante ou perfurante, com qualquer parte do corpo,
    recebe o dano normalmente, mesmo que o Bloqueio supere o ataque. A Esquiva não muda.
  - O Grid e a mesa não têm essa regra.
- [ ] **N19 · [FAZER] A escolha da melhor combinação de defesa (D-065).**
  - O livro diz: o personagem defende com o que tem nas mãos (somam, dois escudos contam), ou com o corpo
    quando nada nas mãos é usado, e o Mestre ajusta pela situação (Chutes, −1, quando as mãos não podem
    ser usadas).
  - O Grid e a mesa não deixam escolher.
- [ ] **N20 · [FAZER] A classe de ataque dos golems de Punhos (D-065, D-054).**
  - O `gen-monsters.mjs` dá a classe do ataque pelo nome da arma do catálogo. Com a arma Punhos (leve) no
    catálogo, o Golem de Ferro e o Golem de Pedra, que atacam com "Punhos" a Velocidade 6, passariam de
    "media" a "leve".
  - Para a mesa não mudar, os dois estão no `CLASSE_OVERRIDE` como "media" (rodada 13).
  - Na passada do Grid, decidir a classe deles (leve pelo nome, ou média pela Velocidade 6).
  - O Golem de Gelo ataca com "Punhos gelados" a Velocidade 5. O nome também começa com "Punhos", e ele
    também passaria a "leve" pelo nome, mas já era "leve" pela Velocidade 5, então nada mudou nele.
