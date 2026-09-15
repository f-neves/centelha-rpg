# Decisões da mesa sobre os itens M do jogador novo

**O que este arquivo é:** as respostas do humano às perguntas `M-nn` de
`jogador-novo-consertos.md`, que são os lugares onde a regra não existia. Uma entrada por
decisão, com o que ela manda fazer. **O que ele NÃO é:** a lista das perguntas, que mora no
outro arquivo, na seção "PARA A MESA".

**Por que ele existe separado:** decisão que fica só no chat morre, e a forma catalogada em
12/09 diz que enquanto ela mora só no documento quem abre o dado lê o contrário. Este arquivo
é a ponte entre a conversa e o dado, e cada entrada só sai daqui quando o conserto dela estiver
no ar.

---

## M-10 · as Trilhas de Feitiçaria · DECIDIDO em 15/09/2026

**A pergunta era "como as Artes rolam de vez, e o que são as Trilhas".** Ela encolheu duas
vezes ao ser medida, e o que sobrou não era o que a pergunta supunha.

### O que a medição achou antes de a mesa decidir

1. **A rolagem já estava decidida e publicada.** `src/data/regras.json`,
   `arcano.resistencia.rolagem`: *"Percepção + Acerto Arcano, e só nos efeitos MIRADOS. Não há
   rolagem de conjuração para o resto: o que não é mirado se resolve pela Dificuldade fixa do
   Efeito, pela Defesa passiva do alvo ou por tabela."* O item da lista "Em revisão"
   (`src/pages/artes/regras.astro:529`) é **texto que sobreviveu à decisão que o fechou**.
   **O Arcano é jogável hoje**, e isto é conserto de publicação, não pergunta.
2. **As seis Tradições já estão escritas por extenso** em `src/pages/arcano.astro`, com método,
   preço narrativo e exemplo cada: Erudição, Sangue/Antecedente, Pacto, Iniciação, Marcial,
   Xamânica/Totêmica.

### A decisão, em duas partes

**PARTE 1 · A TRADIÇÃO É REQUISITO DE FICÇÃO, SEM CONSEQUÊNCIA MECÂNICA.**

- toda Arte que um personagem tem **veio por uma Tradição, e ele declara qual**, do jeito que
  declara um antecedente. Vale desde a criação;
- **aprender Arte nova exige achar um método**, não apenas gastar XP em silêncio;
- **nem toda Tradição é opção.** Sangue/Antecedente é hereditária: a criatura tem ou não tem. E
  coerência de personagem pode barrar Tradições opostas à dele;
- **não há diferença mecânica nenhuma.** Cura nível 3 por Erudição, Iniciação ou Pacto dá
  exatamente o mesmo resultado;
- **a Tradição decide COMO a Arte se manifesta.** Cura aprendida por Iniciação numa fé sai com a
  cara daquela fé; por Erudição, com a cara do estudo.

**O que isto CANCELA, e é a parte que mais economiza.** `arcano.astro:57` promete como passo
futuro *"a ligação de cada Arte com suas Trilhas, e os números de treino"*, e `:103` promete o
mapa das Escolas. **Pelo desenho acima, essa ligação não precisa existir:** sem diferença
mecânica não há números de treino, e não há mapa de qual Arte sai de qual Tradição, porque
qualquer Arte pode vir por qualquer Tradição que esteja aberta ao personagem. **Uma tabela a
construir virou uma frase a escrever.**

**PARTE 2 · A PALAVRA "TRILHA" NÃO É DO ARCANO, E O DEFEITO ERA ESSE.**

O vocabulário fica assim, e os dois sistemas param de disputar a palavra:

| palavra | de qual sistema | quantos | exemplo |
|---|---|---|---|
| **Tradição** | Artes | 6 | Erudição, Pacto, Iniciação |
| **Proeza** | Proezas | o guarda-chuva de tudo abaixo | |
| **Trilha** | Proezas | 3 · o campo `trilha` de `caminhos.json` | corpo, voz, mente |
| **Caminho** | Proezas | 50 · um Atributo cada | Sangue Fervente (Força) |
| **Técnica** | Proezas | 461 · dentro de um Caminho, com nível | Mil Cortes (Dança da Lâmina, nível 5) |

**O nível do meio continua se chamando CAMINHO**, que é como o dado já o chama, como a URL
`/caminhos` já o publica e como o campo `caminho` das 461 Técnicas já o referencia. O contra que
a mesa comprou, com ele à vista: o humano chamou os 50 de "Trilha" duas vezes ao explicar o
sistema, então a palavra publicada vai brigar com a intuição dele na mesa.

### O que isto manda fazer

1. **`src/pages/arcano.astro:56`** para de usar "Trilha". O que se declara é a **Tradição**, e a
   frase descreve o que a Tradição é sem prometer preço mecânico.
2. **`arcano.astro:57` e `:103`** perdem a promessa da ligação Arte-Trilha e dos números de
   treino, porque ela deixou de ser necessária. A frase que fica diz que a Tradição não muda
   número nenhum e decide como a Arte se manifesta.
3. **`src/pages/artes/regras.astro:529`** encolhe: a rolagem sai da lista "Em revisão", porque
   está decidida no `regras.json`. O que continua em revisão daquele item é a conjuração por
   Tradição.
4. **A ficha ganha, por Arte, a Tradição declarada.** Lista fechada de seis. É o único trabalho
   de dado desta decisão, e ele é pequeno.
5. **O capítulo das Proezas** confere se usa "Trilha" e "Caminho" nos sentidos da tabela acima.

**Aberto de propósito, e não bloqueia nada:** a conjuração por Tradição (se um efeito Moldado
rola por perícia própria) continua sendo pergunta, e é a metade do item 529 que fica.

---

## M-02 · o Bram tem sete Artes ou oito · DECIDIDO em 15/09/2026

**SÃO SETE, e o preço publicado é que está errado.** A palavra vence o número: a descrição do
personagem é a intenção de quem o escreveu, e o número é aritmética.

**A SÉTIMA É CONJURAÇÃO, no nível 3.** Ela foi escolhida por um fio de dentro do próprio
exemplo, e não por conceito: o Bram tem a Especialidade **"Ocultismo: invocação"** listada duas
linhas acima na mesma tabela, **sem nenhuma Arte por trás dela**. Nomear Conjuração fecha as
duas lacunas de uma vez. O contra comprado, com ele à vista: a Especialidade pode ter sido
escrita como sabor de erudito, sem intenção de apontar Arte nenhuma.

### O que isto manda fazer

Em `src/content/chapters/criacao-de-personagem.md`, na tabela do Bram:

- a linha **Artes** passa de `870` para **745**, e `"Fascinação e mais uma no 3"` passa a
  `"Fascinação e Conjuração no 3"`;
- o **Total** passa de `1993` para **1868**.

**O contra que a mesa comprou, escrito porque foi dito na hora de decidir:** o orçamento do Bram
é 2000 e ele fechava em 1993, encostado. Com 1868 sobram 132 XP, e um exemplo que sobra dinheiro
ensina pior do que um que aperta.

### O QUE ESTA DECISÃO NÃO RESOLVE, e é maior que ela

**A linha das Artes é uma de SEIS que não fecham no exemplo do Bram.** Medido rodando o
`scripts/cost-examples.mjs` depois do conserto da rodada 60, que chama as mesmas funções da
ficha:

| linha | a régua | o capítulo |
|---|---:|---:|
| Atributos | 415 | 496 |
| Habilidades | 222 | 220 |
| Secundárias | 56 | 66 |
| Especialidades | 72 | 48 |
| Virtudes | 74 | 63 |
| **Artes** | **745** | **870** |
| Técnicas | não conferível | 120 |

**E a linha de Técnicas não é conferível em NENHUM dos quatro exemplos** (Kael, Sora, Veil,
Bram): a lista de Técnicas deles não existe no dado. Então **o total de nenhum dos quatro pode
ser verificado hoje**, e este é o achado `A-03` da Executora, que não tem item na lista original
porque o levantamento não o alcançava sem rodar a conta.

Consertar só a linha das Artes deixa cinco divergências de pé. **Isso é escolha consciente e
fica registrada**, não descuido.

---

## M-11 · como se recupera a Força de Vontade · DECIDIDO em 15/09/2026

**São DOIS métodos normais, e os dois devolvem 1 de Força de Vontade.**

1. **Uma noite de sono.** O gatilho reusa o vocabulário que a regra da Mana já usa,
   `arcano.recuperacaoMana.descanso`: *"meditação, descanso completo ou sono profundo"*. Não se
   cria taxonomia de descanso curto e longo · o sistema não tem uma, e inventá-la obrigaria a
   reler as economias do Fôlego (por Tick) e da Mana (por hora) à luz dela.
2. **Uma Firula de nível 2 ou acima.** A escada já está publicada e numerada em
   `src/content/chapters/habilidades.md`, na seção "Firulas · recompensa à ousadia":
   nível 1 = +2 fixo, **nível 2 = +1d6**, **nível 3 = +2d6**, com o Mestre definindo o nível.

**O que isto fecha, e é maior que a pergunta.** A Força de Vontade era a única das quatro
reservas sem relógio: o Fôlego volta por Tick, a Mana por hora, a Energia por cena (declarado na
nota da Mana, que separa as economias com todas as letras), e a Vontade não tinha nada · apesar
de custar 90 XP para subir de 0 a 9, e de pagar ação turbinada, resistência extra e conjuração
(o `ritual.modoAcima` cobra 1 por grau de tempo esticado).

**E o segundo método dá à Firula um trabalho que ela não tinha.** Hoje ela é só bônus do lance;
passa a ser também a torneira da reserva psicológica, o que premia descrever bem duas vezes.

### O que isto manda fazer

Um bloco de recuperação da Vontade em `src/data/regras.json`, irmão do `recuperacaoMana`, com
os dois gatilhos e o valor. E a frase correspondente onde a Vontade é apresentada, mais uma
linha na seção das Firulas dizendo que a partir do nível 2 ela devolve Vontade.

### DOIS RESÍDUOS, achados ao gravar e NÃO decididos

**Nenhum dos dois bloqueia a implementação do que está acima**, e os dois aparecem na primeira
mesa que jogar.

1. **A Firula de nível 3 devolve mais que a de nível 2?** A decisão diz "nível 2 ou acima" e "1
   de Força de Vontade". Lido ao pé da letra, o nível 3 devolve o mesmo que o 2, e aí a escada
   premia só no bônus do lance. A outra leitura é 1 no nível 2 e 2 no nível 3, acompanhando a
   escada.
2. **Há teto por cena?** Sem teto, quem descreve bem toda rolagem recupera Vontade em toda
   rolagem, e a reserva deixa de ser escassa · que é o oposto do que os 90 XP do Bram compram.
   Com teto, falta o número. **Este é o que morde primeiro**, e é balanço, não redação.

---

## M-12 · a penalidade de ferimento sai de pontos ou de dados · DECIDIDO em 15/09/2026

**É PONTO NO TOTAL DA ROLAGEM**, e a decisão ratifica o que o motor já faz. O trabalho é de
publicação, não de desenho: a regra existia, decidida e escrita, num lugar que ninguém lê.

### O que a medição achou antes de a mesa decidir

1. **O motor responde a mesma coisa nos dois lugares que importam.** `rolarExpr`
   (`src/lib/rolagem.ts:71`) faz `total = soma dos dados + flat`: o número entra **depois** que a
   quantidade de dados já está fechada, e não a altera. O simulador separa os dois canais com
   todas as letras (`scripts/sim-defesas.mjs:159-164`): `dados = fl(soma / 2) + …` de um lado,
   `flat += f.penAcao` do outro. Na mesa, `ajAtq` devolve `{ flat, dados }` e o ferimento só
   entra no `flat` (`src/pages/mesa/grid.astro:10216-10222`).
2. **A declaração da moeda já existe por escrito**, no `nota` do topo de `src/data/condicoes.json`:
   *"`acao` é penalidade/bônus FLAT nas jogadas (mesma moeda dos Limiares de Ferimento), `dados`
   é em d6 (moeda do Desgaste, cap. Resistir)"*.
3. **E ela nunca é impressa.** `src/pages/mesa/referencia.astro:180` publica um parágrafo escrito
   à mão no lugar do `nota` do arquivo. **É a forma do M-10 outra vez:** decidido no dado,
   invisível para quem joga.
4. **As duas moedas já convivem sem se misturar no catálogo:** das 55 condições, 13 carregam
   `acao` (ponto) e 9 carregam `dados` (d6, família Desgaste).
5. **O peso, pela calibração do próprio projeto** (`regras.json → combateTatico.nota`: *"cada ±1
   ≈ ∓6% de chance perto do baseline (~42%)"*): o `−4` do Crítico vale uns **24 pontos
   percentuais** de chance de acertar. A dúvida 68 supôs que "−4 no total é pouco", e a suposição
   não se sustenta contra a régua de calibração que já está no arquivo.

**Detalhe que reforça a leitura:** a coluna da **Defesa** da mesma tabela não é ambígua, porque
Defesa é valor passivo e não pool. As duas colunas vivem na mesma célula do mesmo estado.

### O que isto manda fazer

1. **A tabela de `src/content/chapters/vida-ferimentos-cura.md:41-48` ganha a unidade.** "−1 em
   ações" passa a dizer que o número sai do **total da jogada**, e não do punhado de dados.
2. **Uma frase no capítulo separando as duas moedas**, porque é o capítulo que o jogador lê:
   ponto sai do total (ferimento e situação), dado sai do pool (Desgaste, capítulo Resistir).
   **Deixá-la só no JSON seria repetir exatamente o defeito que esta decisão conserta.**
3. **Nada de código muda.** Nenhum dos 4 pontos de `src/` nem dos 4 scripts de simulação é
   tocado, e nenhum número de balanço se move.

### O CONTRA que a mesa comprou, com ele à vista

Congela a mais leve das três leituras. No Crítico, com 1 a 10% da Vida, o personagem leva `−4` e
**continua rolando a mesma quantidade de dados de quando estava inteiro**. Um sistema em que
estar a 5% de vida quase não muda o punhado de dados pode soar sem peso na mesa.

### ANOTADO, NÃO ABERTO

**O teto de modificadores não olha o ferimento.** `regras.json → combateTatico.modificadorCap` é
`6` e a página o publica como *"teto de ±6 somando tudo"*, mas `defesaAtual`
(`src/pages/mesa/combate.astro:874`) computa `base + ferimento + cond + dv.total` **sem teto
nenhum**. Se a pena de ferimento conta ou não para aquele teto é pergunta real e ainda não
respondida. **Não entra nesta decisão**: é o conserto que revela o vizinho (`ARQUITETO.md §4.2`),
e abri-lo aqui pararia a fila.

---

## M-13 · quanto custa recarregar uma besta · DECIDIDO em 15/09/2026

**O custo mora na VELOCIDADE da própria besta, e são 9 · 12 · 15.**

| arma | `ticks` hoje | `ticks` decidido | comparação |
|---|---:|---:|---|
| Besta Pequena | 6 | **9** | 1,5 × o arco |
| Besta Média | 6 | **12** | 2 × o arco |
| Besta Grande | 7 | **15** | 2,5 × o arco |

**E uma desvantagem nova, que nenhuma outra arma tem: para recarregar é preciso estar PARADO.**

### Por que o custo cabe na Velocidade, e não num campo novo

O modelo de tempo de quem atira já diz que **o ciclo inteiro de uma arma de distância é o
carregamento**, e que o tiro sai no último Tick. Está em `regras.json → combate.pgr.preparo.distancia`:
`"daVelocidade": -1`, com a nota *"a flecha encaixada é preparo; a soltura é instantânea"*. Então
a manivela da arbalesta não precisa de conceito novo: ela é mais Ticks de Preparo, e o virote sai
no fim deles. Zero campo novo, zero estado novo, e o motor inteiro já respeita `ticks`
(iniciativa, fita P/G/R, Grid, bestiário).

**A consequência que o motor entrega de graça:** com Preparo igual à Velocidade menos 1, quem
declara o tiro de Besta Grande fica comprometido **catorze Ticks** girando a manivela, com a
escada de Defesa aberta em cima dele o tempo todo. É exatamente a vulnerabilidade que o pavês
existe para cobrir, e o livro já chama o pavês de *"a parede portátil do besteiro"*
(`armas-e-armaduras.md:129`).

### O que a medição achou antes de a mesa decidir

1. **São TRÊS bestas, não quatro** como o item `M-13` dizia.
2. **Hoje a recarga não custa nada.** `recarga` é tag no dado, vira filtro clicável em
   `/equipamentos` (a página monta os filtros a partir das tags, sem saber o que cada uma
   significa) e é prosa em três notas. **Nenhuma linha de código lê essa tag**: varrido
   `src/pages`, `src/lib` e `src/components`, zero ocorrências fora de `recarregar`, o botão de
   atualizar da mesa.
3. **O desequilíbrio que isso produzia era real.** Besta Média e Arco Longo tinham a MESMA
   Velocidade (6), e a besta fazia `1d6+4` fixo com `+1` de Acerto contra o `1d6 + Força` e `0`
   de Acerto do arco. Para qualquer personagem de Força 4 ou menos a besta ganhava em dano, em
   acerto e empatava em tempo. A Besta Grande fazia `1d6+8` com Perfuração N2 por **um único
   Tick a mais** que um arco.

### A DESVANTAGEM NOVA · recarregar exige estar parado

Nenhuma outra arma do catálogo tem isto. A forma da regra usa a máquina que já está publicada:
o sistema já sabe descrever o que se faz DURANTE o Preparo, e é assim que a **Investida** é
definida (*"gastar o Preparo CORRENDO em vez de andando"*, `combate.movimento.investida`). A
besta é o espelho disso: **o Preparo dela não admite deslocamento nenhum, nem o Tick grátis do
Deslocamento de Batalha** (`combate.movimento.batalha.primeiroTickGratis`).

**É aqui que a tag `recarga` deixa de ser decoração**: ela passa a ser a bandeira que o motor lê
para proibir o passo. É o único gancho de código desta decisão.

### O QUE A MESA JÁ DISSE QUE FICA ABERTO

1. **Proezas futuras vão poder encurtar a recarga**, e é assim que a besta volta a competir com
   as outras armas. Não existe nenhuma hoje, e esta decisão não cria nenhuma.
2. **Os números podem cair depois dos testes.** A mesa decidiu 9 · 12 · 15 **contando a
   desvantagem de ficar parado**, e disse com todas as letras que talvez o tempo precise
   diminuir um pouco por causa dela. **Os três são revisáveis por medição**, e não são régua
   fechada.

### E UM RESÍDUO QUE A DECISÃO NÃO RESOLVE

**O que acontece se o besteiro se mexer no meio da recarga?** A regra diz que ele precisa estar
parado, e o sistema já tem um caminho para quem se move no meio de um Preparo: o **desvio de
emergência**, a 1 Tick por metro, fora da vez (`combate.md:182`). Perde os Ticks já investidos,
ou a recarga só pausa? **Não foi perguntado e não se inventa por iniciativa.**

### O que isto manda fazer

1. `src/data/armas.json`: `ticks` das três bestas para 9, 12 e 15.
2. `src/content/chapters/armas-e-armaduras.md:87-89`: a coluna de Velocidade acompanha.
3. A tabela de Velocidade de `src/content/chapters/combate.md:52-59` vai de 3 a 7 e **precisa
   dizer que existe ação acima de 7**, senão a besta contradiz a régua na página ao lado.
4. A regra do "parado para recarregar" escrita onde o jogador a lê, e a tag `recarga` lida pelo
   motor para proibir o passo de graça.

### ACHADO GRANDE, encontrado ao tentar medir isto · os simuladores de balanço estão MORTOS

`scripts/sim-defesas.mjs`, `sim-caps.mjs` e `sim-grupo.mjs` quebram os três na mesma linha,
`ARM[b.armadura].esquiva`: pedem armaduras de id `'leve'`, `'media'` e `'pesada'`, e o
`armaduras.json` de hoje traz `nenhuma, gambeson, couro, malha, brigandina, lamelar,
placa-transicao, placa-municao, placa-completa`. O catálogo foi reescrito e os três simuladores
nunca foram atualizados. O `sim-defesas` ainda imprime `NaN` em todas as linhas de XP antes de
estourar, que é a mesma doença do `C-49`. **Nenhum dos três está no `validate`**, então nada
acusou.

**Isto tem consequência imediata nesta decisão:** a rota empírica para escolher os números (ler o
`ticksMedio` do duelo, que existe no `sim-defesas`) não estava disponível. Os 9 · 12 · 15 saíram
da escala publicada e da equivalência de um Tick por segundo, **e não de uma medição**. É por
isso que a mesa os deixou revisáveis.

**E corrige uma frase da `M-12`**: lá está escrito que "o simulador faz igual". O que é verdade é
que **o código-fonte dele faz igual**; ele não roda. A decisão da `M-12` não muda, porque quem
decide ali é `src/lib/rolagem.ts`, o motor vivo, e esse roda.

---

## M-11b · a Firula vira Stunt, e as três reservas ganham torneira · DECIDIDO em 15/09/2026

**A pergunta era o resíduo da `M-11`** (teto por cena, e se o nível 3 devolve mais que o 2). **A
mesa respondeu reescrevendo a Firula inteira**, no molde do Stunt de Exalted, e respondeu o teto
com todas as letras.

### A escada decidida

| nível | na jogada | e devolve |
|---|---|---|
| **1** | +2 fixo | **1 de Energia** |
| **2** | +1d6 | **2 de Energia** ou **1 de Mana** ou **1 de Força de Vontade** |
| **3** | +2d6 | **5 de Energia** ou **3 de Mana** ou **3 de Força de Vontade**, e **XP** |

**NÃO HÁ TETO POR CENA**, e vale para as três reservas. Dito assim pelo humano: *"não existe, no
momento, um limite para a quantidade de Força de Vontade (ou Energia ou Mana) que se pode
recuperar na cena"*.

**A escolha é do jogador**, uma por Firula: as reservas não somam, ele pega uma das três.

**E a Firula não é coisa de combate.** Dito na mesma resposta: *"serve para qualquer ação, desde
que ela seja relevante e seja um desafio para o jogador"*. Isso importa para o balanço mais do
que parece, porque multiplica as ocasiões: fora de combate quase toda rolagem é candidata.

**O nível 3 também dá XP, e QUANTO não foi dito.** Fica aberto, e é número, não redação.

### O que isto muda no que já está publicado

A `M-11` entrou no ar hoje (`5d9f164`) dizendo que a Firula de nível 2 ou acima devolve **1 de
Força de Vontade**. Continua verdade para o nível 2, e **deixa de ser verdade para o nível 3**,
que passa a devolver 3. Os dois textos da rodada 62 precisam acompanhar:
`src/content/chapters/habilidades.md:110` e `aparencia-virtudes-vontade.md:79`, mais o
`recuperacaoVontade` do `regras.json`, cujo `aRevisar` fica respondido nas duas metades.

### O TAMANHO REAL DOS NÚMEROS, medido antes de gravar

As reservas dos quatro exemplos publicados, de `scripts/cost-examples.mjs` (`derivadosPub`):

| exemplo | Energia | Mana | Vontade | Centelha |
|---|---:|---:|---:|---:|
| Kael | 14 | 13 | 7 | 3 |
| Sora | 15 | 14 | 8 | 3 |
| Veil | 17 | 16 | 8 | 4 |
| Bram | 10 | 11 | 9 | 1 |

O que a Firula de nível 3 vale, como fatia da reserva:

- **5 de Energia** é de 29% (Veil) a **50% (Bram)** do pool;
- **3 de Mana** é de 19% a 27%;
- **3 de Vontade** é de **33% a 43%**.

**E em relógio, que é a comparação que mais pesa:**

- a Energia volta **por cena**, então os 5 só valem DENTRO da cena. É a opção menos inflacionária
  das três, e provavelmente a mais saudável;
- a Mana volta **por Centelha, por hora**. Três de Mana são **três horas de descanso para o Bram**
  (Centelha 1) e **quarenta e cinco minutos para o Veil** (Centelha 4). A recompensa vale MAIS
  para o conjurador fraco, o que inverte a escada da Centelha. Pode ser bom de propósito;
- a Vontade volta **1 por noite de sono**. Três de Vontade são **três noites**, para qualquer um.
  **É o número mais forte da tabela, e de longe.**

**A comparação com o modelo que a mesa nomeou.** No Exalted 2e o stunt 3 dá 2 de Força de Vontade
sobre um pool típico de 7 a 10 (perto de 25%) e 5 motes sobre 30 a 60 (perto de 10%). Aqui, 3 de
Vontade sobre 7 a 9 são 33% a 43%, e 5 de Energia sobre 10 a 17 são 29% a 50%. **Os números desta
mesa são proporcionalmente mais generosos que os do sistema que serviu de molde**, porque as
reservas daqui são muito menores que as de lá. Isto não é objeção: é a medida que faltava para
saber o que se está testando.

**O XP do nível 3, para quando for escolhido:** `regras.json → progressaoPorSessao` é `[10, 20]`
por sessão. No Exalted o stunt 3 dá 1 XP contra 4 a 6 por sessão, perto de 20%. A proporção
equivalente aqui seria **2 a 4 XP por Firula de nível 3**. Acima disso, duas ou três Firulas boas
passam a valer mais que a sessão inteira.

### O QUE FICA ABERTO, e a mesa sabe

1. **Quanto XP dá o nível 3.**
2. **Os números são para testar, e não régua fechada.** Dito assim: *"vamos considerar assim para
   ver se fica equilibrado ou não"*.
3. **O que testaria isto não existe hoje.** Os três simuladores medem duelo de armas, e nenhum
   deles conta gasto de Energia, Mana ou Vontade por cena. Medir isto pede instrumento novo, e o
   primeiro passo é a rodada 63, que ressuscita os três.

### E UMA CONTRADIÇÃO DE TEXTO QUE NASCEU HOJE, e é conserto e não decisão

`habilidades.md:110` diz que a Firula é *"o segundo dos **dois** jeitos de repor a reserva"* e
`aparencia-virtudes-vontade.md:79` lista **três** (sono, Firula, e a régua moral do callout `:71`,
que já estava no ar antes de tudo isto e devolve 1 de Vontade a critério do Mestre). É o `A-12` da
Executora. **Com a decisão acima o número certo é três**, e as duas linhas se corrigem juntas.

**Some-se a isso um quarto texto, anterior a tudo**: `relacoes-sociais.md:145` promete que a
Vontade *"volta devagar (descanso/cena)"*. A parte "cena" não existia em regra nenhuma quando foi
escrita; **agora existe**, pela Firula, e a frase passou de falsa a verdadeira por acidente. Vale
reescrevê-la para dizer o que a regra de fato é.

---

## M-14 · com que Atributo se rolam as secundárias · DECIDIDO em 15/09/2026

**A pergunta era das 66 secundárias e a resposta vale para as 24 primárias também.** Ela não
acrescenta dado: ela corrige o sentido do dado que já existe.

### A decisão

**QUEM DETERMINA O PAR É A DESCRIÇÃO DA AÇÃO, e não a ficha.** O jogador diz como o personagem
agiu; o Mestre lê a descrição e nomeia o Atributo e a Habilidade daquela jogada. As listas
publicadas em cada perícia são **o usual, e não o possível**.

Os exemplos vieram da mesa, e é por eles que a regra se entende:

- soco no inimigo: **Força ou Destreza + Briga**, porque o jogador disse que era um soco;
- a mesma intenção com uma espada: **Força ou Destreza + Armas**;
- convencer o inimigo a se render: **Influência + Persuasão**; **ameaçar** para que ele se renda:
  **Força ou Influência + Intimidação**, e a mesma intenção mudou de perícia E de Atributo por
  causa de como foi descrita;
- identificar o estilo de luta de um oponente: **Inteligência + Briga**, ou **Inteligência +
  Armas** conforme ele lute com as mãos ou com arma.

**As perícias geralmente têm um TIPO associado (Físico, Social, Mental), e ele serve de exemplo,
não de limite.**

### Por que isto reformula também as primárias

O último exemplo é a prova. `habilidades.json` publica `Briga → ["forca","destreza"]`, e o
capítulo imprime isso em itálico como `*(Força · Destreza)*`. **Pela notação de hoje, "Inteligência
+ Briga" é ilegal**, e ela é o exemplo que a própria mesa deu. Então a notação não está errada no
conteúdo: está errada no **sentido**, porque se lê como lista fechada.

**E o que a lista publicada É, corrigido em 15/09/2026 pelo humano**, porque eu a havia entendido
maior do que ela é. Eu escrevi que "o par legítimo da Intimidação inclui Força". **Não é isso:**
aquilo foi um exemplo para mostrar que Atributo e Habilidade se combinam por contexto, e não a
declaração de um par canônico. As duas coisas convivem:

- **cada Habilidade tem uma INCLINAÇÃO para um grupo de Atributos**, e é ela que a lista em
  itálico já publica. Briga puxa os físicos, Burocracia puxa os mentais, Oratória puxa os sociais;
- **e a combinação concreta de uma jogada sai da descrição da ação**, que pode pedir um Atributo
  fora da inclinação quando a ficção justificar.

**A notação de hoje está boa e NÃO muda.** Palavras do humano: *"do jeito que está na página de
Habilidades está bom, no final de cada habilidade está o atributo (ou atributos) que mais se
relaciona com elas"*. O que falta não é um aviso na lista: é a regra do par, que nunca foi
escrita.

### O QUE JÁ ESTAVA CERTO, e não muda

**O motor nunca amarrou perícia a Atributo.** `pool(atributo, habilidade)` (`src/lib/calc.ts:17`)
recebe os dois números e não sabe de onde vieram, e `passivo(id, nome, atributo, habilidade)`
(`src/lib/mesa-ficha.ts:37`) também. **Nenhuma linha de código muda com esta decisão.** É a mesma
forma da `M-12`: o motor já estava certo e o texto é que dizia outra coisa.

**E os três tipos já existem no dado**: `src/data/atributos.json` traz `grupo` em cada um dos
nove, com `fisico` (Força, Destreza, Vigor), `social` (Influência, Perspicácia, Compostura) e
`mental` (Percepção, Inteligência, Raciocínio), três em cada.

### O que isto manda fazer

1. **Um parágrafo de regra onde o leitor monta o pool** (`coracao-do-sistema.md`), dizendo que a
   descrição da ação determina o par, e que a lista de cada perícia é a usual e não a única.
2. **A notação em itálico NÃO muda.** A lista de cada perícia é a inclinação dela, e publicá-la
   assim já está certo. **Corrigido depois de eu ter mandado o contrário**: o despacho da rodada
   64 pedia mexer no molde `linhaPrim` de `scripts/gen-cap-pericias.mjs:44`, e o pedido foi
   retirado no mesmo dia.
3. **As 66 secundárias podem ganhar o campo, agora como sugestão e não como regra.** Deixa de ser
   obrigatório: a ficha passa a ter um padrão para oferecer, sem que ele limite nada. É trabalho
   opcional, e a decisão não depende dele.
4. **A ficha tem de permitir qualquer Atributo com qualquer perícia.** O motor já permite;
   confira se alguma tela restringe antes de dizer que está feito.

### O QUE ESTA DECISÃO NÃO RESOLVE

**A regra do `habilidades-secundarias.md:16` continua de pé e continua precisando de contas:**
*"quando as duas cabem na mesma ação, a maior entra no pool e a menor entra como bônus fixo"*.
Decidido quem escolhe o Atributo, ainda falta dizer **quanto vale o bônus fixo da menor** · o
texto não dá número. Não foi perguntado nesta rodada.

**E não resolve o `M-19`**, que é o vizinho: como se rola Virtude + Atributo, Vontade + Habilidade
ou Virtude sozinha. Aquilo são traços que não são Atributo nem Habilidade entrando no par, e é
outra pergunta.

---

## Adendo à M-13 · a medição que faltava chegou, e ela ABSOLVE os números

A `M-13` foi decidida dizendo, com todas as letras, que os `9 · 12 · 15` saíram da escala
publicada e **não de uma medição**, porque os três simuladores estavam mortos. A rodada 63 os
ressuscitou (`0e780a6`) e o número existe.

**Uma luta típica dura 63 a 97 Ticks** (duelo espelhado, tier 1 a tier 3, regra viva). Posto
contra a decisão:

| arma | ciclo | tiros numa luta típica |
|---|---:|---|
| Besta Pequena | 9 | sete a dez |
| Besta Média | 12 | cinco a oito |
| Besta Grande | 15 | quatro a seis |

**O medo que a mesa declarou ao escolher era "uma bala por combate", e ele não se confirma.** A
luta é longa o bastante para a arbalesta disparar várias vezes. **O que a besta perde de verdade
não é o número de tiros, é o passo:** catorze Ticks plantada, num combate em que o espadachim ao
lado anda em todos eles.

**Isso muda o que a mesa disse sobre revisar para baixo.** O humano decidiu os números *contando*
a desvantagem de ficar parado, e disse que talvez precisassem diminuir por causa dela. **A medição
aponta para o lado contrário:** não há escassez de tiros a compensar, e se houver ajuste ele não é
para baixo por esse motivo.

**E uma segunda medição desfaz uma inferência minha.** Escrevi na `M-13` que o besteiro fica
"comprometido catorze Ticks com a escada de Defesa aberta em cima dele", e tratei isso como peso
crescente. Medido Tick a Tick por `defesaPerdida` num ciclo 15 de classe `distancia`: a penalidade
é **−2 constante** do Tick 0 ao 13 e **−4** no Tick do Golpe, **exatamente como num ciclo de 6**.
Ela **não acumula com o tamanho do Preparo**. Um Preparo de catorze Ticks não é catorze vezes pior
que um de cinco: é o mesmo −2 durando quase três vezes mais tempo. O achado é da Executora
(`A-22b`), e a inferência corrigida é minha.

---

## M-04 · quantos Ticks tem uma rodada, e um turno · DECIDIDO em 15/09/2026

**A pergunta encolheu ao ser medida: a conversão já existe, decidida e no dado.** O que faltava
era publicação, uma palavra, e um relógio.

### O que a medição achou antes de a mesa decidir

1. **`src/data/regras.json:1237`**, dentro do bloco `arcano`, campo `notaTurno`: *"**1 turno = 6
   ticks.** A régua breve inteira cabe dentro de uma briga: o nível 6 são 50 turnos, 300 ticks,
   cinco minutos."*
2. **O motor implementa o mesmo número**: `export const TICKS_POR_TURNO = 6`
   (`src/lib/artes-grid.ts:142`), e `rodadaDoTick = Math.floor(tick / 6) + 1` (`:1565`).
3. **`notaTurno` não é lida por ninguém.** Varridos `src/pages`, `src/lib` e `scripts`: zero
   consumidores. E nenhum capítulo diz "6 Ticks" em lugar nenhum.
4. **O relatório do jogador novo errou neste ponto**, e vale registrar para quem o reler: ele
   afirma que *"não existe conversão Tick ↔ rodada em fonte nenhuma"* (`C-29`). A linha 1237 está
   no `regras.json`, que ela declarou ter lido inteiro. **A ausência era de leitura, não de
   fonte** · que é a primeira forma da tabela do `CATALOGO.md`, e desta vez apareceu dentro do
   próprio instrumento que existia para achá-la.

### A decisão

**1 turno = 1 rodada = 6 Ticks**, o que ratifica o dado e o motor.

**E o Sangramento corre no RELÓGIO DE CADA UM, não no da mesa.** Cada ferido tem o próprio
contador de seis Ticks, e a palavra *"do personagem"* que já está no texto
(`vida-ferimentos-cura.md:58`) passa a significar o que diz.

**O contra que a mesa comprou, com ele à vista:** é estado novo por combatente, que a mesa não
guarda hoje, e um contador a mais para o mestre acompanhar em cada ferido. O resultado prático
fica quase igual ao do relógio global (todo mundo sangra a cada 6 Ticks, só que desalinhado),
então paga complexidade por uma diferença que aparece pouco.

**Por que a mesa não quis o relógio global, e isso é coerência e não capricho:** o capítulo abre
dizendo que *"o combate não corre em turnos rígidos"*. Um batimento global de seis em seis seria
um turno rígido reinstalado pela porta dos fundos, e o relógio próprio é o que mantém a linha do
tempo de Ticks sendo o que ela promete ser.

### O que isto manda fazer

1. **Publicar a conversão onde o leitor a procura.** Ela vale para o combate inteiro e mora dentro
   do bloco do Arcano, onde só quem conjura olha. A frase entra em `combate.md`, e o `notaTurno`
   deixa de ser a única fonte.
2. **Ligar "rodada" a "turno" no DADO.** Hoje quem faz essa ponte é um comentário de código.
3. **O Sangramento ganha o contador por combatente na mesa.** É o único trabalho de código desta
   decisão, e não é pequeno: o rastreador e o Grid precisam saber, por ferido, quando cai o
   próximo tique de sangue.

### DOIS RESÍDUOS, não decididos

1. **De quando se conta o primeiro tique?** "Seis Ticks contados dele" pode ser do instante em que
   ele entrou na luta ou do instante em que a ferida abriu. As duas são defensáveis e mudam quando
   o primeiro dano cai. **Não foi perguntado.**
2. **A palavra "rodada" continua em três lugares dos capítulos**, e só um deles carrega regra (o
   Sangramento). Os outros dois são prosa (a Horda e o raspão). Uniformizar o vocabulário é
   conserto, não decisão, e o `C-29` já existe para isso.

---

## Correção à M-04 · o trabalho de código é maior do que eu registrei

A seção da `M-04` diz que o Sangramento *"ganha o contador por combatente"*, como se fosse
acréscimo. **Não é: é substituição de uma implementação existente e contrária**, achada depois de
gravar.

`src/pages/mesa/combate.astro:1478-1484` já resolve o efeito contínuo, e o comentário declara a
leitura que a mesa acabou de descartar:

> *Efeitos por rodada disparam **quando o combatente age**: é assim que a regra de Sangramento
> define "início da rodada do personagem".*

**E não é só o Sangramento.** A chave `porRodada` existe em **cinco condições** (`sangrando` 1,
`envenenado` 1, `sufocando` 2, `em-chamas` 3, `morrendo` 1) e é lida por `src/lib/mesa-core.ts`
(`:169, :187, :194, :227`), `src/lib/mesa-condicoes.ts:120` e a aba Combate (`:1236, :1480`). A
decisão do relógio próprio muda as cinco de uma vez.

**E a mesa fecha o resíduo 1 da `M-04`:** o contador se conta **da ferida**, não da entrada na
luta. *"a cada 6 ticks desde o ferimento dele, vai sangrar"*. Quem levar dois Sangramentos em
momentos diferentes terá dois contadores desalinhados no mesmo corpo, e isso é consequência aceita.

---

## M-04b · o livro passa a contar SÓ em Ticks · DECIDIDO em 15/09/2026

**"Turno" e "rodada" saem do livro e do dado. Tudo vira Tick, a 6 Ticks por turno.**

### O que a medição achou antes de a mesa decidir

1. **O jogo tem TRÊS sistemas de tempo declarados, e os três são de Tick**
   (`regras.json → combate.sistemas`): Normal (`sistemaPadrao`), Três fases (P/G/R) e Simultâneo.
   **Não existe sistema por turnos no livro.**
2. **Turno e rodada são a mesma coisa**, e são o ciclo em que todos agem, como no D&D e no
   Pathfinder. Dito pela mesa: é uma maneira possível de jogar, **e não é a recomendada deste
   sistema**.
3. **Mesmo assim, 88 números estão escritos nessa unidade**, contra 17 em "rodada":

| onde | "turno" | "rodada" |
|---|---:|---:|
| `regras.json` (a escada de Duração 1·2·4·10·20·50) | 22 | 2 |
| `efeitos.json` (o campo `unidade: "turnos"` e as escadas) | 41 | 0 |
| `tecnicas.json` (usa as duas palavras misturadas) | 9 | 5 |
| `condicoes.json` (inclui a CHAVE `porRodada`) | 1 | 7 |
| `artes.json` | 3 | 0 |
| capítulos e páginas | 12 | 3 |

**O defeito, em uma frase:** o livro escreve as durações do modo recomendado na unidade de um modo
que ele nunca define, e essa unidade tem dois nomes.

### O que isto manda fazer

1. **A escada de Duração das Artes** (`regras.json`, o parâmetro): `1 · 2 · 4 · 10 · 20 · 50`
   turnos passa a **`6 · 12 · 24 · 60 · 120 · 300` Ticks**.
2. **`efeitos.json`**: o campo `"unidade": "turnos"` passa a Ticks e as `escala` acompanham. As
   escadas que hoje começam com `"1 tick"` e seguem em turnos ficam inteiras em Ticks.
   **CONFIRA ANTES SE ESSES CAMPOS SÃO GERADOS**: `gen-grid-artes.mjs` escreve o bloco `grid`, e
   conserto por cima de campo gerado morre no próximo `--check`.
3. **`tecnicas.json`**: as quatorze ocorrências, que hoje misturam as duas palavras.
4. **`condicoes.json` e o código**: a chave `porRodada` muda de nome nas cinco condições e nos
   três arquivos que a leem. **O nome NÃO pode ser `ciclo`**, que já significa outra coisa neste
   repositório (a Velocidade inteira de uma ação, `Anatomia.ciclo` em `combate-tempo.ts`).
   `porSeisTicks` serve; quem escreve o código escolhe, sabendo dessa colisão.
5. **Os capítulos e as páginas**: as 15 ocorrências de prosa.
6. **`notaTurno` (`regras.json:1237`) deixa de ser a única fonte da conversão** e vira o que
   sobra dela: a ponte para quem quiser jogar por turnos.

### ABERTO, editorial, e não bloqueia

**Se a duração longa ganha o tempo real entre parênteses.** Um Tick vale cerca de um segundo por
regra publicada (`combate.md:8`), então "300 Ticks" pode virar "300 Ticks (cinco minutos)" de
graça. A mesa padronizou em Ticks e não pediu o parênteses; ele continua disponível como escolha
de redação, e não como regra.

---

## M-03 + M-25 + M-37 · onde a Especialidade entra · DECIDIDO em 15/09/2026

**As três perguntas eram uma, e a resposta não cria regra nova: ela nomeia o PORTÃO que a regra
publicada já tinha.**

### A decisão

**O portão é a SITUAÇÃO, e ele vale em todo lugar.** A Especialidade entra na jogada ou no cálculo
**somente quando o escopo nomeado dela se aplica**, e por isso ela se chama assim. Palavras da
mesa: *"se o jogador tem uma especialidade em Armas (Machados) 2, apenas quando estiver usando
Machados a especialidade entra na conta"*.

**E o formato é o que já está publicado** (`habilidades.md:93`): numa rolagem, **+N dados
descartando os N menores**, onde N é o nível. *"Furtividade (Becos Escuros) 3, quando estiver se
escondendo em becos escuros, ganha +3 dados na jogada, retirando os 3 menores resultados."*

### O QUE ISTO RESOLVE, e é mais do que parece

**O `calc.ts` está CERTO, e pelo motivo errado.** `valorPassivo` não soma a Especialidade
(`src/lib/calc.ts:274`), e o comentário justifica dizendo que *"nem a criatura nem a ficha guardam
especialidade POR PERÍCIA hoje"*. **Essa justificativa é meia falsa:** a ficha guarda, nomeada e
com nível (`S.spec[habilidade] = [{s: nome, v: nível}]`, `ficha-engine.ts:235`); só o bestiário
não guarda, e nas 309 criaturas do `inimigos.json` não há uma sequer.

**Mas a conclusão dele sobrevive, por uma razão melhor:** um Valor Passivo é calculado **sem
saber quem ataca nem como**. Um bônus cujo portão é a situação **não pode** entrar num número
calculado antes de a situação existir. Então o número base sai sem Especialidade e ela é somada no
instante em que o escopo se revela · que é exatamente o que o capítulo já manda: *"a ficha não a
soma automaticamente no rolador"*.

**O `especialidade: true` das três Defesas em `derivados` passa a significar "pode somar quando o
escopo se aplicar", e não "soma sempre".** Precisa dessa palavra, senão continua se lendo como
parcela fixa.

### OS QUATRO DEFEITOS QUE ISTO CONSERTA

1. **O Valor Passivo tinha três fórmulas.** Glossário: *"(Atributo + Habilidade) × 2 +
   Especialidade + Centelha"*. `acoes-e-sistema.md:105`: *"2 × (Atributo + Habilidade)"*, sem os
   dois. `calc.ts:274`: com Centelha, sem Especialidade. **A terceira é a certa**, e as outras
   duas se corrigem: a do glossário ganha o portão, a do capítulo ganha a Centelha.
2. **A Defesa Mental discordava de si mesma:** `derivados.defesaMental` tem `especialidade: true`
   e o glossário não a menciona. Passa a mencionar, com o portão.
3. **O ataque social não nomeava a Especialidade e o físico nomeava**, sendo os dois a mesma
   coisa. O ataque social (`relacoes-sociais.md:125`) passa a nomeá-la, com o portão.
4. **E a fórmula do ataque físico escreve a regra ERRADA** (`combate.md:66`):
   `Ataque = (Atributo + Habilidade)/2 + Especialidade + Arma + Centelha`. Numa **rolagem** a
   Especialidade não é parcela somada: é **+N dados com descarte dos N menores**. As duas não são
   equivalentes, e a diferença é justamente o que a Especialidade significa · o dado extra com
   descarte sobe a **confiabilidade** sem mexer no teto. **Este achado é novo e não tinha item.**

### O CONTRA que fica registrado

**As 309 criaturas não têm Especialidade nenhuma.** Onde o portão abrir para um personagem, ele
nunca abre para uma criatura. Não é assimetria fatal, porque criatura e personagem são construídos
por orçamentos diferentes, mas quem comparar os dois números está comparando coisas diferentes, e
isso não está escrito em lugar nenhum.

### ABERTO, e é apresentação e não regra

**Como a ficha mostra uma Defesa cujo bônus é situacional.** Hoje ela imprime um número. Podia
imprimir "18, e +2 contra machados", e isso é decisão de tela.

---

## M-47 · a palavra "Perícia" sai do livro · DECIDIDO em 15/09/2026

**O termo correto é HABILIDADE, em todo lugar em que o leitor lê.** Pedido da mesa: *"veja onde
que está escrito 'Perícia', essa é uma palavra que não devemos usar, provavelmente o certo é
'Habilidade' em todos os lugares que está 'Perícia'"*.

### A medição, e ela tem uma surpresa

**Os capítulos têm ZERO ocorrências da palavra.** Ela chega à tela por outro caminho: os blocos
**gerados**. O que existe, separando texto de máquina:

| onde | ocorrências | o que é |
|---|---:|---|
| `monsters.json` | 118 | *"Perícias notáveis: Furtividade 2…"*, no `notas` de cada criatura |
| `inimigos.json` | 118 | as mesmas, **geradas** a partir do anterior |
| `habilidades.json` | 17 | prosa das descrições, publicada no capítulo II gerado |
| `habilidades-secundarias.json` | 11 | idem |
| `regras.json` | 5 | prosa |
| `antecedentes.json` | 2 | prosa |
| páginas e componentes | ~10 | rótulos de tela (o `BestiaEditor` diz "+ perícia") |
| **capítulos `.md`** | **0** | a palavra nunca foi escrita à mão |

### O que isto manda fazer, e o que NÃO manda

**MANDA:** trocar as ~280 ocorrências de **texto visível**. As 118 de `inimigos.json` são
geradas, então o conserto é na fonte (`monsters.json`) e não no derivado, **senão morre no
próximo regen**.

**NÃO MANDA, e esta parte é decisão minha, para a mesa derrubar se quiser:** as **chaves de dado**
(`"pericias"`, 928 ocorrências, e `"pericia"` singular em `armas.json`) e os **identificadores de
código** ficam como estão. Elas não são lidas por ninguém que jogue, renomeá-las é mexer no
bestiário, na mesa e no editor de criaturas de uma vez, e o ganho para o leitor é zero. **Se a
mesa quiser a troca completa, ela é uma frente própria e não um item.**

---

## M-06 + M-19 · Virtude e Vontade não se somam a nada · DECIDIDO em 15/09/2026

**A mesa não respondeu a pergunta: derrubou a premissa dela.** Eu perguntei COMO a Vontade entra
num pool, e a resposta é que nem ela nem as Virtudes entram em pool nenhum.

### O que ficou decidido

1. **A Virtude não se rola com mais nada**, nem com Atributo nem com Habilidade. **Se for rolada,
   é sozinha.**
2. **A Força de Vontade não é Atributo**, e também não se rola com Atributo nem com Habilidade.
   **Se for rolada, é por si só.** Sai da lista de Atributos da Integridade em
   `src/data/habilidades.json`.
3. **O Canalizar Virtude mantém a CONTA e perde o LIMITE.** A soma continua sendo
   `Atributo + Habilidade + Virtude`. O *"uma vez por cena, por Virtude"* está errado: pode ser
   usado mais vezes. **O que o limita é que canalizar CONSOME a Virtude, e a recuperação dela é
   muito lenta.**

### PROVISÓRIO, dito como provisório pela própria mesa

**O teste de Virtude será provavelmente `1d6 + nível da Virtude`, com Dificuldade básica 5 ou 6.**
Palavras dela: *"ainda não determinei 100% como são os testes de Virtude"*. **Não implementar como
regra fechada.**

### ABERTO, e adiado de propósito

**Como a Virtude se recupera depois de canalizada.** *"a recuperação da virtude é muito lenta,
podemos discutir como é isso depois"*. Sem isso, o Canalizar não é jogável, porque não há como
saber quando a Virtude volta.

**E isto transforma a Virtude num traço de dois papéis:** ela é nota de 1 a 6 (a régua moral, a
conduta esperada) **e** reserva que se gasta. As duas coisas na mesma linha da ficha, e a ficha
hoje não sabe disso.

### O QUE ISTO DERRUBA, varrido no disco

**Vinte e duas rolagens publicadas passam a ser ilegais.** Nenhuma delas é conserto de uma
palavra: cada uma precisa virar outra coisa.

| onde | quantas | o que diz hoje |
|---|---:|---|
| `aparencia-virtudes-vontade.md:65` | 1 | *"role a Virtude apropriada somada a um Atributo"* · **é a fonte do padrão** |
| `vida-ferimentos-cura.md:67` | 1 | Estabilizar sozinho: *"Vigor + Convicção vs Dif 10"* |
| `condicoes.json:136` | 1 | a mesma frase, escrita na rodada 65 |
| `regras.json` | 3 | *"Vigor + Convicção (em si mesmo)"*, *"(resistência de fortitude)"*, *"Vontade + Acerto Arcano para segurar"* |
| `efeitos.json` | 14 | 9 × `Vigor + Convicção`, 2 × `Vontade + Convicção`, 3 × `Vontade + Ocultismo` |
| `habilidades.json` | 1 | `vontade` na lista de Atributos da Integridade |
| `aparencia-virtudes-vontade.md:69` | 1 | o *"uma vez por cena"* do Canalizar |

**E o que NÃO cai, pela leitura que eu faço da decisão:** a Vontade e as Virtudes continuam em
**valores fixos**, que não são rolagens. A **Defesa Mental** (`Raciocínio + Integridade + Vontade
+ Centelha`) e a **Energia** (`(Vigor + Compostura + Raciocínio + Vontade) ÷ 2 + Centelha × 2`)
ficam como estão. **Esta leitura é minha e a mesa não a confirmou:** se a intenção era tirar a
Vontade também dos derivados, isso muda a ficha inteira e precisa ser dito.

### A CONSEQUÊNCIA QUE NINGUÉM PEDIU, e é a maior

**As 22 rolagens não mudam só de fórmula: mudam de ESCALA, e por isso mudam de Dificuldade.**

Um pool de `Vigor 4 + Convicção 3` soma 7, rola `3d6+2`, e tem média **12,5** contra a Dif 10 que
o texto publica. Um teste de Virtude `1d6 + 3` tem média **6,5**, e contra Dif 10 é
**impossível**. **Nenhuma das 22 Dificuldades publicadas sobrevive à troca de fórmula**, e é por
isso que a mesa já falou em Dificuldade básica 5 ou 6 para esse tipo de teste.

### A MEDIÇÃO QUE A PRÓXIMA DECISÃO VAI QUERER

As Virtudes vão de **1 a 6** (`virtudes.json`, seis degraus). Com sucesso sendo `total > Dif`:

| Virtude | Dif 5 | Dif 6 |
|---:|---:|---:|
| 1 | 33% | 17% |
| 2 | 50% | 33% |
| 3 | 67% | 50% |
| 4 | 83% | 67% |
| 5 | **100%** | 83% |
| 6 | 100% | **100%** |

**A Dificuldade 6 mapeia a escada inteira sem desperdício:** um sexto por nível, e só a Virtude 6
passa sempre. **A Dificuldade 5 satura no 5**, e aí os dois degraus mais caros da escada viram o
mesmo número na mesa.

---

## M-19b · o teste de Virtude · DECIDIDO em 15/09/2026 (a escada alta segue aberta)

### O que ficou decidido

**`1d6 + nível da Virtude + Firula`, e tem de SUPERAR a Dificuldade**, como todo o resto do jogo.
Nada de empate valendo: a regra do capítulo I continua valendo sem exceção.

**A Firula entra como número CRU, `+1`, `+2` ou `+3`, pelo nível dela.** Não entra como dado: num
teste de um dado só, dar dados quebraria a escala. É a segunda forma da Firula, ao lado da que
entra em pool (`+N` dados descartando os N menores, `M-11b`).

**A Dificuldade básica é 5.**

**O máximo humano é 15:** 6 no dado, 6 de Virtude, 3 de Firula. **Então a Dificuldade 15 é número
morto** · ninguém a supera nunca. A última Dificuldade viva é **14**, e ela exige o máximo
absoluto.

### A régua, medida

Sucesso é `1d6 + Virtude + Firula > Dif`, então cada ponto de Dificuldade vale exatamente **um
sexto**, e cada ponto de Virtude ou de Firula devolve exatamente um sexto. São todos a mesma moeda.

**Sem Firula:**

| Virtude | Dif 5 | Dif 6 | Dif 8 | Dif 10 | Dif 12 |
|---:|---:|---:|---:|---:|---:|
| 1 | 33% | 17% | 0 | 0 | 0 |
| 2 | 50% | 33% | 0 | 0 | 0 |
| 3 | 67% | 50% | 17% | 0 | 0 |
| 4 | 83% | 67% | 33% | 0 | 0 |
| 5 | 100% | 83% | 50% | 17% | 0 |
| 6 | 100% | 100% | 67% | 33% | 0 |

**Com Firula 3:**

| Virtude | Dif 8 | Dif 10 | Dif 12 | Dif 14 |
|---:|---:|---:|---:|---:|
| 1 | 33% | 0 | 0 | 0 |
| 3 | 67% | 33% | 0 | 0 |
| 6 | 100% | 83% | 50% | 17% |

**A propriedade que isto cria, e ela não foi pedida mas é boa:** quanto mais alta a Dificuldade,
mais a Firula deixa de ser bônus e vira **preço de entrada**. O teste heroico de alma só acontece
para quem narra o gesto.

> **CORRIGIDO no mesmo dia.** A primeira redação desta frase dizia *"acima da Dificuldade 9,
> nenhuma Virtude passa sem Firula"*, e **a tabela logo acima já a desmentia**: na Dif 10 a Virtude
> 6 passa 33% sozinha e na 11 ainda passa 17%. **O ponto em que ninguém passa sem Firula é a
> Dificuldade 12.** O erro é da prosa e não do número, e ficou registrado porque é a forma
> catalogada da asserção que contradiz a evidência impressa ao lado dela.

### ABERTO · a escada acima da básica

A mesa disse **5** para a básica e antes se inclinou por **6** média e **8** alta, sem confirmar
depois que a Firula entrou na conta. **A Firula muda o teto útil de 11 para 14**, então a metade
de cima da escada ganhou espaço que não tinha quando aqueles números foram pensados.

### E FICA UMA COLISÃO DE NÚMEROS, anotada e não resolvida

A tabela de Dificuldade do sistema é `5 · 10 · 15 · 20 · 25 · 30` (`regras.json → dificuldade`).
"Dificuldade 10" num teste de Habilidade é **Média**; num teste de Virtude é quase impossível sem
Firula. **O mesmo número com dois significados, e nada na página avisa qual é qual.**

---

## M-19c · a escada de Dificuldade do teste de Virtude · DECIDIDO em 15/09/2026

**A escada publicada vai de 5 a 12, e acima de 9 já é quase sobre-humano.**

Não são degraus nomeados: é uma faixa contínua com um marco no meio. A básica é 5, o teto
publicado é 12, e a partir do 10 a coisa muda de natureza.

### A régua inteira, medida

`1d6 + Virtude + Firula > Dif`. Cada ponto vale exatamente um sexto, em qualquer das três parcelas.

**Sem Firula:**

| Virtude | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 33% | 17% | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | 50% | 33% | 17% | 0 | 0 | 0 | 0 | 0 |
| 3 | 67% | 50% | 33% | 17% | 0 | 0 | 0 | 0 |
| 4 | 83% | 67% | 50% | 33% | 17% | 0 | 0 | 0 |
| 5 | 100% | 83% | 67% | 50% | 33% | 17% | 0 | 0 |
| 6 | 100% | 100% | 83% | 67% | 50% | 33% | 17% | **0** |

**Com Firula 3:**

| Virtude | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 83% | 67% | 50% | 33% | 17% | 0 | 0 | 0 |
| 3 | 100% | 100% | 83% | 67% | 50% | 33% | 17% | 0 |
| 6 | 100% | 100% | 100% | 100% | 100% | 83% | 67% | **50%** |

### O que a medição diz do marco em 9, e ele se sustenta

- **até a Dificuldade 9**, qualquer Virtude de 4 para cima ainda joga sozinha;
- **da 10 em diante**, só as duas Virtudes mais altas passam sem Firula (5 a 17%, 6 a 33%);
- **na 11**, só a Virtude 6, e a 17%;
- **na 12**, **ninguém passa sem Firula**. O teto publicado é exatamente o ponto em que descrever
  bem deixa de ser vantagem e passa a ser a única porta.

**Por isso "acima de 9 é quase sobre-humano" é uma descrição exata, e não uma figura de
linguagem.**

### O que fica de fora de propósito

**As Dificuldades 13 e 14 existem na matemática** (a Virtude 6 com Firula 3 passa 33% e 17%) **e
não entram na escada publicada.** O máximo humano é 15 e a 15 é número morto. Quem quiser uma cena
acima de 12 está fora da régua, e isso é escolha da mesa.

---

## Correção à M-47 · a minha medição estava errada, e o instrumento é que estava quebrado

Duas afirmações da seção `M-47` são falsas. As duas foram achadas pela Executora ao executar, e
as duas eu reconferi no disco antes de escrever isto.

### 1 · "Os capítulos têm ZERO ocorrências" · eram CINQUENTA

Medido em `c407b0e^`, o commit anterior ao conserto dela, contando com Python:
`habilidades.md` 25, `habilidades-secundarias.md` 12, `coracao-do-sistema.md` 3,
`qual-sistema.md` 3, `acoes-oficio-e-mundo.md` 2, `antecedentes.md` 2,
`criacao-de-personagem.md` 2, `acoes-resistir.md` 1. **Total 50.**

**E a frase mais bonita da seção morre com isso**: eu escrevi que *"a palavra nunca foi escrita à
mão, ela chega à tela pela geração"*. Parte vinha de bloco gerado, mas **nove eram prosa à mão**.
A conclusão elegante veio de um número errado, e não do material.

### 2 · A direção da geração estava INVERTIDA, e esta é a cara

Eu escrevi: *"as 118 de `inimigos.json` são geradas, então o conserto é na fonte
(`monsters.json`)"*. **É o contrário.** `scripts/gen-monsters.mjs`, segunda linha do arquivo:

> *Fonte: inimigos.json (stat block, **GERADO por gen-bestiario.mjs**) + os satélites…*

A cadeia é `gen-bestiario.mjs` → `inimigos.json` → `gen-monsters.mjs` → `monsters.json`. O
`monsters.json` é **duas vezes derivado**, e a fonte de verdade das 118 frases é **uma linha**:
`gen-bestiario.mjs:407`, que monta o texto "Perícias notáveis: …".

**A Executora provou por observação e não por leitura:** trocou as 118 do `monsters.json`, rodou o
gerador, e elas voltaram todas. É o mesmo gesto que salvou a rodada 61, e é o que separa medir de
supor.

### 3 · POR QUE EU ERREI · o instrumento filtrava a própria saída

Todas as minhas varreduras usaram a classe de caracteres `per[íi]cia`. **Ela não casa com a forma
acentuada** neste ambiente. Reproduzido no mesmo diretório, contra `src/lib`:

```
grep -rio 'per[íi]cia' src/lib   → 27
grep -rio 'perícia'    src/lib   → 24
grep -rio 'pericia'    src/lib   → 27
```

**A classe devolve exatamente o mesmo que a forma SEM acento**, e os 24 acentuados somem sem erro
nenhum. Como as chaves de dado são `pericias` sem acento e **todo texto visível usa a forma
acentuada**, o meu instrumento contou máquina e cegou para o texto · que era precisamente o que a
decisão queria medir. Os capítulos deram zero porque eles só têm a forma acentuada.

**É a forma do `CATALOGO.md` "o instrumento que filtra a própria saída"**, e o zero que ela
produziu foi um zero ambíguo que eu tratei como achado.

**A regra que fica:** contagem sobre texto com acento se faz com Python lendo o arquivo, nunca com
classe de caracteres pelo `grep` deste ambiente. Vale junto com a regra do `CLAUDE.md` sobre o
`git diff` encolhido: **as duas dizem que o número que vem do atalho não vale.**

### O estado de hoje, recontado com Python

Sobram **190** ocorrências, todas do lado da máquina: `scripts` 106, `src/lib` 53,
`src/components` 22, `src/pages` 9. São identificadores, ids de elemento e comentários. **Os
rótulos visíveis foram trocados** (o `BestiaEditor` agora diz "+ Habilidade" no botão e
"Habilidade" nos dois campos), e o escopo da decisão continua sendo "onde o leitor lê".

---

## M-30 (+ M-26, M-28, M-29 em parte) · os traços de raça viram dado com escopo · DECIDIDO em 15/09/2026

**Todo traço racial que carrega um número vira CAMPO, e o campo declara o ESCOPO em que vale.** A
ficha o **oferece** sem somá-lo automaticamente, exatamente como a Especialidade é oferecida.

É a mesma forma decidida hoje em `M-03/M-25/M-37`: bônus com portão situacional não cabe em número
calculado antes de a situação existir, mas cabe numa lista que a ficha mostra na hora certa.

### O que a medição achou

**São OITO raças** (não sete): Humano, Anão, Elfo, Gnomo, Halfling, Meio-Elfo, Orc, Meio-Orc.

**São 24 traços. Seis estão apoiados num campo do dado, e dezoito são prosa que nada lê.** Os seis
que funcionam provam que o caminho existe e já foi percorrido uma vez: `deslocamentoFrac` (os três
de baixa estatura), `aparenciaUniversal` (elfo e meio-elfo) e `aparenciaMod` (a "Aparência bruta"
do Orc).

**Os dez números que estão escritos e não acontecem:**

| raça | traço | número |
|---|---|---|
| Anão | resistência a venenos | +1d6 |
| Anão | mestre dos ofícios | +1d6 |
| Elfo | sentidos naturais aguçados | +1d6 |
| Elfo | resiliência mental | +4 de Dificuldade, ou +1d6 |
| Gnomo | feitiçaria ilusória | +2 |
| Gnomo | empatia com animais | +2 |
| Halfling | atletas | +1d6 |
| Meio-Elfo | resiliência mental menor | +2 |
| Orc | frenesi, ao intimidar | +2d6 |
| **Orc e Meio-Orc** | **Vitalidade** | **+Vigor de PV** |

**A Vitalidade é diferente das outras nove, e é um ERRO DE FICHA e não uma pendência.** Ela é
incondicional e mexe num número que a ficha **já imprime**. Varrido `calc.ts` e `ficha-engine.ts`:
não há termo racial de PV. **Todo Orc jogado até hoje tem PV menor do que a própria raça
promete.** O `+1` de Vigor do campo `atributos` dá +3 de PV pelo multiplicador, e o bônus do traço
não dá nada.

### O que isto manda fazer

1. **Uma forma de campo nova**, com o bônus e o escopo em que ele vale. O nome dos campos é de
   quem escrever o código; o que a decisão exige é que **escopo e bônus andem juntos**, senão o
   campo vira parcela fixa e a decisão se perde.
2. **Os dez traços da tabela viram esse campo.** A Vitalidade entra com escopo "sempre", e com ela
   o PV do Orc passa a sair certo.
3. **A ficha precisa saber MOSTRAR bônus condicional.** Isto estava anotado como
   *"aberto, e é apresentação e não regra"* na decisão da Especialidade, e **deixou de ser
   opcional**: as duas frentes agora dependem da mesma tela.
4. **`deslocamentoFrac` entra no esquema do `validate`** (`scripts/validate-data.mjs:49`), de onde
   falta hoje: ele existe em três raças, é lido pela ficha, e o portão não o conhece.

### O QUE FICA ABERTO, e é o irmão desta decisão

**O `porte` e o `folego` por raça continuam sem resposta**, e eles não são traços: são campos
ausentes. A pergunta respondida foi sobre os traços, e estes dois pedem uma decisão própria porque
mudam número, e muito:

- **nenhuma raça tem `porte`**, então `pv(vigor, 'medio')` dá `25 + Vigor×3` para todo mundo, e
  **um Halfling tem exatamente o PV de um Orc de mesmo Vigor**. Pôr o Halfling em `pequeno`
  (base 20, multiplicador 2) levaria um Halfling de Vigor 3 de **34 para 26 de PV**, uma queda de
  quase um quarto;
- **nenhuma raça tem `folego`**, e `derivados.folego` promete por escrito *"base por raça (humano
  = 10)"*, entregando um número só.
