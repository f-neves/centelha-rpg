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
