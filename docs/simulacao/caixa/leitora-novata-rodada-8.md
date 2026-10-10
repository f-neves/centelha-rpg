# Leitora-novata · rodada 8 · relato de leitura

**Base lida:** `origin/main` em `5d2cfeea` (publicado). Li, nesta ordem: `combate.md` inteiro, `armas-e-armaduras.md` inteiro, `acoes-corpo-e-movimento.md` inteiro, `acoes-sentidos-e-engano.md` inteiro, `src/pages/artes/regras.astro` inteiro e, porque o texto do tempo da Arte mora lá, o bloco `arcano.tempoDaArte` e `arcano.esticar` de `src/data/regras.json`. Para os números do bestiário que o livro cita (Verme Púrpura, Tarrasque), abri os dois arquivos em `src/data/bestiario/`.

**Como li:** como quem abre o livro pela primeira vez. Não li `docs/simulacao/`, o registro de decisões, `Pendencias.md` nem `docs/pendencias/`. Pelo mesmo motivo não abri o `leitura-de-novato-2.md` que o brief cita como modelo: sigo as quatro perguntas do despacho (o que não entendi, contas, dois trechos, termo antes de explicado), mais uma seção de "não achei o que acontece quando". Não proponho regra nova. Os números de linha são os do arquivo publicado.

**Convenção do relato:** "cheira a erro" quer dizer que a minha leitura e a conta do texto discordam; não afirmo qual lado está certo.

---

## 0. Os cinco achados mais importantes

1. **A mão nua que bloqueia (`armas-e-armaduras.md:163` e o exemplo de `:165`).** O exemplo tem Bloqueio 16 contra acerto 15 e diz que o golpe "perde a Margem e rende só o dano da arma". Pela regra do ataque (`combate.md:16` e `:150`: "se o total superar a Defesa, você acerta; empate erra") 15 contra 16 é erro, sem dano nenhum. O texto precisa de um acerto que passe a Defesa para haver dano, e o exemplo não tem.
2. **O esticar da Arte, exemplo da Área 4 (`regras.json:2136`).** O exemplo dá "Velocidade 15" para Área 4, dois acima. Mas a Velocidade base sai do maior grau investido (`combate.md:101`, `regras.astro:59`), e um grau 4 é Velocidade 6, não 5. 6 × 3 = 18, e o exemplo diz 15.
3. **O texto não diz, em vários lugares, em que sistema de tempo vale.** O exemplo de "Golpes no mesmo instante" (`combate.md:497`) conta Defesa −4 para duas adagas que, no Normal (o padrão do capítulo), rolam na declaração (`:133`). E "Ação comum resolve no primeiro Tick" (`regras.json:1928`, `regras.astro:59`) contradiz o P/G/R, onde toda arma tem ao menos 1 Tick de Preparo (`combate.md:75`, `:139`).
4. **Agarrado: "escapa" ou "inverte"?** `combate.md:236` diz que, abaixo, "os papéis se invertem, e o agarrado passa a controlar"; `:240` e `acoes-corpo-e-movimento.md:294` dizem que o agarrado "só escapa/se solta quando quem o controla erra". Soltar e virar o controlador são resultados diferentes.
5. **A placa "à prova de espada" (`combate.md:282`) e os exemplos de Couraça (`:298`).** O parágrafo diz que Cortante não passa pelo gate e, na frase seguinte, que a placa completa é "à prova de qualquer arma de mão (espada, flecha, lança...)". E o Verme Púrpura "Absorção 13 contra lâminas" e o Tarrasque "Absorção 27" não fecham com a regra de Couraça somada à Centelha dos arquivos do bestiário (conta na seção 2.4).

---

## 1. O que não entendi na primeira leitura

**1.1 "num custo total de **2 × Velocidade + 2**, seja qual for a divisão entre Preparo e Recuperação"** (`combate.md:135`). Custo em quê? Depois de reler consegui reconstruir: Preparo (P ticks a −2) + Golpe (−4) + Recuperação (R ticks a −2) = 2P + 4 + 2R = 2(V−1) + 4 = 2V + 2, em "pontos de Defesa por Tick". O texto não diz a unidade, e a conta só aparece se eu a refizer.

**1.2 "a Recuperação cobra **−2 de Defesa por golpe ainda pendurado**"** (`combate.md:141`). "Pendurado" não é explicado. Entendi: golpe já desferido cuja Recuperação ainda não acabou. Mas na Rajada (`:193`) o −2 por golpe vale "até a sua próxima ação", e na Recuperação de 5 Ticks de uma Rajada de 3 não sei se o −6 vale desde o primeiro Tick de Recuperação ou desde o Tick do segundo golpe.

**1.3 "Igual: durante 6 Ticks ninguém controla e ninguém causa dano, e **quem desistir entrega o controle ao outro**"** (`combate.md:235`). Se ninguém controla, quem pode desistir? E durante esses 6 Ticks o alvo ainda é Agarrado, com a Esquiva −8 de `:240`? Não achei.

**1.4 "essa tentativa sofre **uma penalidade grande** para agir"** (`combate.md:246`, repetida em `acoes-corpo-e-movimento.md:293`). Quanto? Não há número em nenhum dos dois lugares.

**1.5 "Correndo: Defesa −4, enquanto corre e **até se recompor**"** (`combate.md:371`) e, logo depois, "correndo **não se apara nem se esquiva**" (`:373`). −4 é penalidade, não impedimento (a Esquiva do Kael continua rolando). E "se recompor" não tem número de Ticks.

**1.6 "A Corrida é uma ação de 3 Ticks, **interrompível a qualquer Tick**: você decide quando parar"** (`combate.md:376`). Se paro no Tick 2, volto a agir no Tick 2 ou só no 3? Não achei.

**1.7 Nota ao Mestre sobre porte (`combate.md:520`): "Criaturas maiores que Médio que lutam entre si **não ganham bônus de Defesa pelo tamanho**. Nesses casos o Mestre pode aumentar a Defesa delas."** A seção inteira (`:518`) já disse que o porte não mexe na Defesa de ninguém. Então quem "ganharia" um bônus de Defesa que a regra nunca deu? A frase parece se contradizer: "não ganham... o Mestre pode aumentar".

**1.8 "Mirar (gasta uma ação preparando o golpe) **−2**"** (`combate.md:455`, tabela "Defesa do alvo"). Nunca entendi de quem é o −2: a tabela é de Defesa **do alvo**, mas Mirar é algo que **eu** faço. Se eu miro, a Defesa do alvo cai 2? E o que custa "uma ação" em Ticks? `:191` diz que Mirar "compra Preparo", o que é outra coisa.

**1.9 "O **espelho** de quem pagou ação fora de hora **empurra os golpes restantes**, não os cancela"** (`combate.md:188`). "Espelho" só reaparece em `:411` ("O espelho da Investida") com outro sentido. Não consegui ligar a frase ao desvio de emergência de `:346`, que é o que imagino que ela queira dizer.

**1.10 "Se o Bloqueio supera o acerto, o ataque perde os dados de Margem, **mas você toma o dano da arma normalmente**"** (`armas-e-armaduras.md:163`). Ver o achado 1. Pela regra do ataque, se o Bloqueio supera o acerto o golpe erra. Não entendi em que caso a regra se aplica.

**1.11 Pavês: "bloqueia (+3)" e "+3 na Defesa contra projéteis"** (`armas-e-armaduras.md:214`). A coluna "Defesa" do pavês já é +3. O segundo +3 soma (+6 contra projétil) ou é a mesma coisa dita duas vezes?

**1.12 "Os níveis 5 e 6 ainda **cobram Vontade (+1 e +2)**"** (`combate.md:572`). Vontade é Atributo em outros lugares (`acoes-sentidos-e-engano.md:122`, "Vontade + Religião"). "Cobrar" o quê, de que reserva?

**1.13 Queda: "**300 m ou mais | 304, teto em 355**"** (`acoes-corpo-e-movimento.md:115`). A 300 m o dano é 304; e a 500 m? 355? A linha parece dar dois números para o mesmo intervalo.

**1.14 Arremesso: "A fórmula vale de 100 g para cima: abaixo disso a distância cai com o peso"** (`acoes-corpo-e-movimento.md:265`). Como cai? A Shuriken pesa 50 g (`armas-e-armaduras.md:94`) e fica abaixo do limite, mas não há conta para ela.

**1.15 Horda, exemplo (`combate.md:553`).** "o ataque deles é **1d6 + 4d6** no acerto": de onde vem o `1d6`, "o pool de um capanga" (`:544`)? Não está dito qual é. E "Ela ceifa ~4–5 a cada 6 Ticks": a Sora está de montante (Velocidade 7, `:79` de armas), e o primeiro golpe do mesmo exemplo derruba 3 baixas, não 4 a 5.

---

## 2. Contas que tentei fazer e não fecharam (ou fecharam)

### 2.1 Mão nua contra arma, exemplo do próprio livro (`armas-e-armaduras.md:165`)
Bloqueio 14 + 1 + 1 = 16. Esquiva 8. Acerto do atacante 15. Defesa usada: "a melhor das duas" (`combate.md:312`) = 16. 15 não supera 16. Pela regra do ataque, **erro**, sem dano. O exemplo diz "rende só o dano da arma". Contra a Esquiva (8), 15 supera por 7, uma Margem, e o exemplo acerta esta parte. A parte do Bloqueio é a que não fecha.

### 2.2 Esticar a Arte (`regras.json:2112` a `:2136`; `combate.md:60`, `:101`)
- Regra: "CADA nível acima soma outra vez a Velocidade da ação". Velocidade base pelo maior grau investido (`combate.md:101`; `regras.astro:59`): graus 0 a 3 = 5, grau 4 = 6, graus 5 e 6 = 7.
- Exemplo: Arte 2, Área 2 + Dano 2 + Duração 2, Velocidade 5. Área 3 (um acima): 3×2 + 2 + 2 = 10 pontos, Velocidade 10 (2 × 5). **Fecha.**
- Área 4 (dois acima): 4×3 + 2 + 2 = 16 pontos ✓. Velocidade: o maior grau investido agora é 4, Velocidade base 6; × 3 = **18**. O exemplo diz **15**. Se a regra for "a Velocidade base vem do nível da Arte" (2, logo 5), então a frase de `combate.md:101` ("vem do maior grau investido") está errada para o esticado. Não sei qual dos dois vale.
- Onde cai o Golpe: o texto dá "n × V − 1": V=5 → Ticks 4, 9, 14, 19 ✓. Com V=6 seria 5, 11, 17. Também fecha, dado V.
- Defesa no Tick de decidir: `regras.json:2113` diz que "o Tick em que se decide esticar **ainda é Preparo (−2)**" e `combate.md:101` chama o Tick 4 (V5) de "Tick do Golpe". Então o Tick 4 é Golpe (−4) ou Preparo (−2)? Só é Golpe depois de decidir não esticar.

### 2.3 Dois golpes no mesmo instante, no sistema Normal (`combate.md:493-497`)
Exemplo: duas adagas declaradas no Tick 3, Preparo 1, Golpe no Tick 4, "as duas estão em −4: cada uma ataca uma Defesa aberta".
- No Normal, "rola-se ao declarar" e "o acerto e o dano valem no Tick da declaração" (`:133`). As duas adagas rolam no **Tick 3**, e no Tick 3 a guarda de cada uma está em Preparo (−2), não em −4. O −4 só existe no Tick 4.
- No P/G/R (rola no Golpe, `:117`) a conta fecha com −4.
- Na espada longa declarada no Tick 2 (Preparo 2: Ticks 2 e 3, Golpe no 4), "no sistema Normal ela rolaria no 2": contra as adagas, que ainda nem foram declaradas no Tick 2 (declaram no 3), a Defesa delas é a normal, sem −2 nem −4. E a adaga que declara no 3 rola contra a espada em Preparo (−2).
O exemplo só fecha no P/G/R. Está num capítulo que se declara Normal.

### 2.4 Couraça de Porte, exemplos (`combate.md:298`)
- Regra: Couraça só em Corte e Perfuração, Impacto a ignora. Absorção natural: Impacto = Vigor + Centelha; Corte/Perfuração = só Centelha (`:272`).
- Verme Púrpura (Imenso): o arquivo `mon-verme-purpura.json` tem Vigor 11, Centelha 1. Impacto: 11 + 1 = **12** ✓ (o livro diz "Absorção 12"). Corte: 1 (Centelha) + 7 (Couraça Imenso) = **8**. O livro diz **13**. Faltam 5 pontos que não sei de onde vêm (talvez a "Carapaça anelada", habilidade que só diz "Absorção altíssima").
- Tarrasque (Colossal): `mon-tarrasque.json` tem Centelha 10, Vigor 14. Corte: 10 + 10 (Couraça Colossal) = **20**. O livro diz **27**. Faltam 7.
- Observo que Centelha 10 está fora da escala 0 a 6 que o resto do livro usa para personagens; não achei onde a criatura sai da régua.

### 2.5 Três vezes a Efetiva (`combate.md:113-124`)
n = ⌈(d − E) ÷ (E ÷ 2)⌉; com d = 3E: n = ⌈2E ÷ (E/2)⌉ = 4, penalidade **−12**, voo de **4 Ticks** depois do Golpe. Vale para qualquer E, e fecha com os três exemplos do livro (Adaga de Arremesso 25 m: n=3, −9 ✓; Arco Longo 150 m: n=4, −12 ✓; Arco Longo Máxima com Força 3, 250 m: n=8, −24 ✓).
Casos que a conta atropela: a **Besta Pequena** (Efetiva 40 m, Máxima 100 m, `armas-e-armaduras.md:127`) a 3 vezes a Efetiva seria 120 m, **além da Máxima**; o **Arco Curto** com Força 1 (Efetiva 30, Máxima 50) também não chega a 90 m. A regra de `acoes-corpo-e-movimento.md:276` ("passou dela, o objeto cai antes e não há jogada a fazer") está só na seção de Arremessar. Para arco e besta, a mesma frase não aparece.

### 2.6 Miúdo contra Colossal (`combate.md:503-518`)
- Categorias: Miúdo, Pequeno, Médio, Grande, Enorme, Imenso, Colossal: 6 degraus entre Miúdo e Colossal.
- Corpo a corpo, Miúdo ataca Colossal: +3 × 6 = **+18** ✓ (o livro diz +18). Colossal ataca Miúdo: 0.
- À distância, a 3 vezes a Efetiva: Miúdo atira no Colossal, +18 − 12 = **+6**. Colossal atira no Miúdo: −18 − 12 = **−30**.
- Bloqueio do Miúdo contra o Colossal (`:334`): "não bloqueia 2 ou mais categorias maior"; são 6, e cada ponto de Centelha sobe o teto em 1 (`:337`), que parte de 1. Precisa de Centelha 5; com o "escudo grande escora" (`:339`, +1), Centelha 4. Fecha.
- Agarrar entra "como em qualquer ataque de corpo a corpo" (`:228`): também +18. Fecha.

### 2.7 O Tick em que a Arte sai
- Velocidade 5: Preparo nos Ticks 1 a 3, Golpe no Tick **4**, Recuperação no 5 (`combate.md:101`, `regras.json:1928`) ✓. Velocidade 6: Golpe no 5. Velocidade 7: Golpe no 6 ✓. "Quem vê a Arte se juntar tem de 4 a 6 Ticks": Preparo + Golpe = 3+1 = 4 (V5) até 5+1 = 6 (V7) ✓.
- Esticada na V5: Golpe no 9, 14, 19 ✓, Recuperação só no último ciclo.
- **Numeração dos Ticks.** O exemplo do Bram (`combate.md:428`) declara "no Tick 0" e conta Preparo "dos Ticks 0 ao 8" (9 Ticks, `:92`), Golpe no 9, Recuperação 10 e 11 ✓ (12 no total). A Arte do `:101` e a iniciativa (`:29`) contam a partir do Tick **1**. Pelo exemplo das adagas (`:497`), o Tick da declaração já é o primeiro de Preparo. Em Ticks relativos fecha; em absoluto, o livro usa 0 e 1 como primeiro Tick conforme o trecho.

### 2.8 Penalidade de armadura (`armas-e-armaduras.md:196`)
"Penalidade −3 incide em Ataque, Esquiva, Bloqueio, **Deslocamento e Salto**". −3 de quê? Em dados do pool? Em pontos de Defesa? Em Deslocamento de Batalha (2 a 5 m por Tick), −3 m paralisa quase todo mundo. A Furtividade e a Natação convertem a Penalidade em "Circunstância" (+2, +4, +6), mas Deslocamento e Salto não.

### 2.9 Bumerangue de retorno (`armas-e-armaduras.md:99` e `:112`; `combate.md:120`)
Bumerangue de retorno, Efetiva 20 m, alvo a 50 m: n = ⌈30 ÷ 10⌉ = 3 Ticks de ida, 3 de volta = 6 Ticks depois do Golpe. A arma é Arremesso médio: Recuperação de 1 Tick (`combate.md:86`). O livro diz que ele "volta à mão **no fim da ação**". Com n ≥ 1 a volta passa do fim da ação. Só fecha até a Efetiva (0 + 0).

### 2.10 Contas que **fecharam** (para o Arquiteto não gastar tempo nelas)
- Iniciativa, tabela de contrapé e exemplo (13, 12, 10, 9, 5): fecha. Contrapé descendo 1d6 por Tick: fecha.
- Tabela P/G/R: Preparo = Velocidade − 1 − Recuperação em todas as 19 linhas: fecha. Rajada (5/7/9, 6/8/10, 6/8, 7/9, 7/9) e dupla (5 e 7): fecha.
- Deslocamento de Batalha, Arranque e Corrida do Kael (4, 5,5→6, 8,5→9); teto humano (5, 8, 11,5): fecha. Investida (4/7, 8/14, 12/21 m): fecha. Bram (Besta Média, 12 Ticks): fecha.
- Tabela de dano de queda x PV/Absorção: pessoa comum 15 e 23 m, robusto 19 e 28, herói 24 e 36, colosso 26 e 38: fecham por interpolação. Tabela do Amortecer inteira: fecha (com arredondamento para baixo).
- FAH (3 a 24) e a coluna "Arremessa até"; tabela de carga (93, 81, 46%): fecham. Tabela de Máxima do arremesso (FAA 4 e 24 a 0,5 e 5 kg), Funda (93, 176, 245, 325 m), pilum de 2 kg a FAA 2 (8,6 m): fecham.
- Placa completa contra cavaleiro (Corte 10, Impacto 9; 6, 5 e 0 de dano): fecha.
- Escalar muralha 10 m (Direta 16, Acumulada 17): fecha. Passivos e Dificuldades do Esgueirar (6, 10, 16, 20 e 70%): fecham. Horda (Magnitude 4, PV 100, 3 baixas): fecha.
- Tabela do desvio de emergência (10/20, 15/30, 20/40, 25/50): fecha.

---

## 3. Dois trechos que parecem dizer coisas diferentes

**3.1 Agarrado: escapa ou inverte.**
- `combate.md:236`: "**Abaixo:** os papéis se invertem, e o agarrado passa a controlar."
- `combate.md:240`: "O agarrado. Não age e não rola nada: **só escapa quando quem o controla erra**."
- `acoes-corpo-e-movimento.md:294`: "Quem está Agarrado não rola: **só se solta** quando quem o controla erra."
Erro do controlador = o agarrado fica livre, ou o agarrado vira o controlador? E o "Igual" de `:235`, que usa outra regra de empate (nem erra, nem acerta) que a de `:16` ("empate erra").

**3.2 A placa e a espada.**
- `combate.md:282`: "**Cortante e Impacto não passam pelo gate**: sempre subtraem a absorção direto. É por isso que a placa completa (Nível 3) é à prova de qualquer arma de mão (**espada**, flecha, lança, besta, picareta param em N0–N2)".
- `armas-e-armaduras.md:222`: "Placa completa × Corte = 8 de Absorção: uma espada de topo abre poucos pontos... um golpe forte ainda arranha." e `:228` (o montante, que é Corte, atravessa 5).
A espada é Cortante e não passa por gate nenhum; o montante do exemplo atravessa 5 pontos da placa. O trecho de `combate.md:282` só vale para perfurante.

**3.3 "Ação comum resolve no primeiro Tick".**
- `regras.json:1928` e `regras.astro:59`: "Ação comum resolve no primeiro Tick... A ARTE resolve no TICK DO GOLPE, o penúltimo".
- `combate.md:139`: "Todo gesto de ataque telegrafa (tem sempre ao menos 1 Tick de Preparo)", e `:75`: "Toda arma tem ao menos 1 Tick de Preparo".
No P/G/R nenhuma ação de ataque comum resolve no primeiro Tick; só no Normal ("rola-se ao declarar", `:133`). Os dois trechos de Artes não dizem que falam do Normal.

**3.4 "Contra área não existe Esquiva".**
- `combate.md:343` e `regras.json:1955` (a regra da área): "Contra área não existe Esquiva nem Bloqueio" e "não há número de Esquiva".
- `regras.json:1974`: a jogada para sair da área é "**Destreza + Esquiva**".
Provavelmente o que não existe é a Esquiva como Defesa passiva e a Habilidade Esquiva rola, mas o texto usa a mesma palavra nos dois sentidos na mesma página. E em `combate.md:343-348` a "mesma jogada" nunca é nomeada; só dá para saber lendo `regras.json`.

**3.5 Defesa da arma na mão inábil.**
- `combate.md:317`: "uma **arma na mão inábil (+1)** eleva o Bloqueio".
- `armas-e-armaduras.md:161`: "as armas e os escudos que estiver empunhando somam **a Defesa deles**, como a arma da mão inábil já soma", e a coluna Defesa varia de −2 (Montante, Martelo) a +2 (Lança): o Machado é 0.
O +1 é fixo ou é a Defesa de cada arma?

**3.6 "Bastão" e a velocidade.**
- `combate.md:56`: "Ataque leve (Velocidade 5): faca, adaga, espada curta, **bastão**...".
- `armas-e-armaduras.md:39`: Haste média (Velocidade 6): "Lança, **Bordão, Cajado**, Tridente, Arpão".
Bastão não está no catálogo. Se é o Bordão ou o Cajado, a Velocidade é 6, não 5. "Faca" (mesma linha) também não está no catálogo (só a Adaga).

**3.7 A Rede.**
- `combate.md:341`: "uma rede bem lançada **cobram outra saída**" (junto de avalanche e onda de fogo, e logo antes de "Contra área, a saída é sair").
- `armas-e-armaduras.md:105` e `:114`: a Rede é arma de Arremesso Pesada, Acerto +0, e "um acerto deixa o alvo Preso": é um ataque contra Defesa.
Então defendo a Rede por Esquiva ou por "sair do lugar"?

**3.8 A "faca de arremesso".**
- `combate.md:321`, `armas-e-armaduras.md:86` e `:202` citam "faca de arremesso" e a "faca de arremesso (Efetiva 10 m)".
- O catálogo tem Mini-faca (8 m), Kunai (8 m) e **Adaga de Arremesso** (10 m, `:97`). O exemplo de `combate.md:122` chama a mesma de Adaga de Arremesso.

**3.9 Escapismo com dois pais.**
- `acoes-corpo-e-movimento.md:294`: "**Força + Atletismo** (secundária **Escapismo**)" para rede e boleadeira.
- `:293`: "Destreza + Prestidigitação, secundária **Escapismo**" para amarras.
Uma mesma Habilidade secundária sob duas primárias diferentes.

**3.10 Imobilizado.**
- `combate.md:246`: "Nenhum movimento, **não age** (nem com Firula)".
- Na mesma frase: "pode tentar se soltar sozinho". E em `acoes-corpo-e-movimento.md:293`, "tenta se soltar sozinho".
Tentar se soltar é agir?

**3.11 Rajada: "mesma arma" e os Dois Punhos.**
- `combate.md:169-171`: Rajada é "vários golpes com a **mesma** arma".
- `:218`: "Dois Punhos contam como duas armas leves... fazem par para... a Rajada (teto de 3 golpes)".
Os dois Punhos são a mesma arma ou duas? E `:190` diz que a Rajada não acumula com a empunhadura dupla, enquanto o par de Punhos conta para as duas.

**3.12 "A menor das três".**
- `armas-e-armaduras.md:224`: "Placa × Impacto = 4 de Absorção, **a menor das três**".
- Tabela `:192`: Placa completa, Impacto 4, Corte 8, Perfuração 4. Empata com a Perfuração.

**3.13 Vida e PV.**
- `combate.md:19`: "Quem chega a 0 de **Vida**".
- `combate.md:547` (Horda), `acoes-corpo-e-movimento.md:124-131` (queda): "**PV**" e "Pontos de Vida". Sem aviso de que são o mesmo número.

---

## 4. Termos usados antes de explicados

1. **Investida e Recarga: o trecho que diz "já apareceu" aparece depois.** `combate.md:68-71`: "o capítulo já usa os três nomes antes de defini-los (a Investida, a Recarga, 'Golpes no mesmo instante')". E `:107-109`: "É a régua que já apareceu em *Correndo*..., na Investida e na Recarga". No texto, Correndo está em `:371`, Investida em `:387`, Recarga em `:409`, Golpes no mesmo instante em `:493`. Lendo de cima para baixo nenhum deles tinha aparecido. A frase aponta para a frente como se fosse para trás.
2. **P/G/R** é usado em `combate.md:113` ("No sistema P/G/R o projétil também leva tempo") e só é apresentado em `:138`. `:99` remete a "Dois sistemas de tempo", mas a sigla não é desdobrada antes. "Normal" também aparece em `:99` antes de ser definido em `:131`.
3. **Guarda sob pressão** aparece em `:133`, `:141`, `:193`, `:216`, `:228` e só é definida no quadro de `:526`.
4. **Mirar** (`:191` e `:455`): nunca definido neste capítulo. **Firula** (`:150`, `:240`, `:246`): idem. **Proeza** e **Técnica** (`:228` em diante): só no fim, e só a Técnica.
5. **Máxima** em `combate.md:122` (exemplo do arco) antes de ser definida em `armas-e-armaduras.md:86` e `acoes-corpo-e-movimento.md:265`. **FAA** aparece em `armas-e-armaduras.md:86` sem explicação; a conta mora em outro capítulo (`acoes-corpo-e-movimento.md:263`).
6. **"P" tem dois sentidos.** `combate.md:73` (P/G/R, P = Preparo) e `acoes-corpo-e-movimento.md:199-249` (P = peso máximo: "P/8, P/4, 3P/4"). Quem lê as duas páginas na mesma sessão tropeça.
7. **Vontade** com quatro sentidos: Atributo (`acoes-sentidos-e-engano.md:122`, "Vontade + Religião"), recurso que se recupera (`:126`, Meditar: "recuperar Vontade"), "Força de Vontade" (`regras.astro:46`, Mana "com o valor da Força de Vontade") e o que as Técnicas de nível 5 e 6 "cobram" (`combate.md:572`). Mais **Energia** (`:557`) e **Mana** (`regras.astro:46`) como duas reservas de poder diferentes.
8. **Piso de durabilidade de 25** (`combate.md:547`): "o capanga perde o piso de durabilidade de 25". Nunca visto.
9. **Virtude (Bravura ou Temperança)** em `regras.json:2030` (ficar parado na área). As Virtudes não foram apresentadas em nenhum dos cinco arquivos.
10. **Prono (o Bestiário o chama de Caído)** em `combate.md:250`, e em `:491` "Prono (Caído)". Dois nomes para o mesmo estado, os dois usados no capítulo.
11. **Percepção Passiva** e **Valor Passivo** (`acoes-sentidos-e-engano.md:16`, `:50`, `:85`): entendi que são o mesmo número, mas o texto alterna os dois nomes na mesma regra.
12. **Pesada** é classe de arma (`armas-e-armaduras.md:38`) e também Tag (`:57`: "Arremessável · Munição · Pesada: ... usar Força total"), e "pesada" minúsculo na Besta Grande (`:129`). Não sei se a tag é a mesma coisa que a classe.

---

## 5. "Não achei o que acontece quando..."

- ...o alvo está **além da Máxima de um arco ou de uma besta**. Achei a frase só para o Arremesso (`acoes-corpo-e-movimento.md:276`).
- ...o segundo golpe de uma Rajada cai: o −2 do primeiro já vale nesse Tick (`combate.md:193` e `:526`, "o golpe não desconta a si mesmo").
- ...alguém **investe com arco, funda ou arremesso**. `:397` diz "toda arma investe", mas a tabela de `:399-403` só tem corpo a corpo, e as bestas não se deslocam (`:414`).
- ...quem **arremessa parado**: a Máxima de `acoes-corpo-e-movimento.md:265` é "na melhor situação possível (correndo e girando)".
- ...a **Lança** ou a **Adaga** são **arremessadas** (ambas têm a tag "arremessável", `armas-e-armaduras.md:70` e `:77`): não há linha de Arremesso para elas.
- ...a **Boleadeira** e a **Rede** são projétil rápido ou lento (`combate.md:321-328`): nenhuma está na lista de nenhum dos dois grupos.
- ...a **Furtividade antes de um ataque** (`acoes-sentidos-e-engano.md:85`) é pedida em plena briga, quando os dois já se veem (`combate.md:466`: "quem se mexe e vê o ataque tem a Defesa normal"), e se as Circunstâncias do Esgueirar (escuridão, chuva, armadura) valem nesse teste.
- ...um ataque Normal é rolado na declaração e o alvo **sai da linha** entre a declaração e o Golpe (`combate.md:99`, `:135`): o Preparo "só marca a Defesa", mas não achei se o resultado se desfaz.
- ...um Agarrado também é Prono, ou um Preso é Agarrado: `combate.md:491` diz que "alguns estados se substituem, e o Mestre decide quais", mas o exemplo é só Prono e "sem equilíbrio".
- ...o **bumerangue de retorno acerta** (`armas-e-armaduras.md:99`: "volta à mão... se errar"): só descreve o erro.
- ...a **Velocidade do Agarrar, Derrubar e Empurrar** (ataques desarmados): o Manter diz 6 Ticks (5 + 1, `combate.md:232`), mas o acerto inicial não diz o ciclo.
- ...a **Dificuldade da identificação** de uma Arte cai quanto por Tick (`regras.json:1946`); a própria página reconhece em "a revisar" que está aberto.
