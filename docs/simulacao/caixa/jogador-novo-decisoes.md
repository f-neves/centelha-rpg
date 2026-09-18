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
rola por Habilidade própria) continua sendo pergunta, e é a metade do item 529 que fica.

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
publicadas em cada Habilidade são **o usual, e não o possível**.

Os exemplos vieram da mesa, e é por eles que a regra se entende:

- soco no inimigo: **Força ou Destreza + Briga**, porque o jogador disse que era um soco;
- a mesma intenção com uma espada: **Força ou Destreza + Armas**;
- convencer o inimigo a se render: **Influência + Persuasão**; **ameaçar** para que ele se renda:
  **Força ou Influência + Intimidação**, e a mesma intenção mudou de Habilidade E de Atributo por
  causa de como foi descrita;
- identificar o estilo de luta de um oponente: **Inteligência + Briga**, ou **Inteligência +
  Armas** conforme ele lute com as mãos ou com arma.

**As Habilidades geralmente têm um TIPO associado (Físico, Social, Mental), e ele serve de exemplo,
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

**O motor nunca amarrou Habilidade a Atributo.** `pool(atributo, habilidade)` (`src/lib/calc.ts:17`)
recebe os dois números e não sabe de onde vieram, e `passivo(id, nome, atributo, habilidade)`
(`src/lib/mesa-ficha.ts:37`) também. **Nenhuma linha de código muda com esta decisão.** É a mesma
forma da `M-12`: o motor já estava certo e o texto é que dizia outra coisa.

**E os três tipos já existem no dado**: `src/data/atributos.json` traz `grupo` em cada um dos
nove, com `fisico` (Força, Destreza, Vigor), `social` (Influência, Perspicácia, Compostura) e
`mental` (Percepção, Inteligência, Raciocínio), três em cada.

### O que isto manda fazer

1. **Um parágrafo de regra onde o leitor monta o pool** (`coracao-do-sistema.md`), dizendo que a
   descrição da ação determina o par, e que a lista de cada Habilidade é a usual e não a única.
2. **A notação em itálico NÃO muda.** A lista de cada Habilidade é a inclinação dela, e publicá-la
   assim já está certo. **Corrigido depois de eu ter mandado o contrário**: o despacho da rodada
   64 pedia mexer no molde `linhaPrim` de `scripts/gen-cap-pericias.mjs:44`, e o pedido foi
   retirado no mesmo dia.
3. **As 66 secundárias podem ganhar o campo, agora como sugestão e não como regra.** Deixa de ser
   obrigatório: a ficha passa a ter um padrão para oferecer, sem que ele limite nada. É trabalho
   opcional, e a decisão não depende dele.
4. **A ficha tem de permitir qualquer Atributo com qualquer Habilidade.** O motor já permite;
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
imprimir "18, e +2 contra machados", e isso é de## M-47 · a palavra "Perícia" sai do livro · DECIDIDO em 15/09/2026

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
 não um item.**

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

## M-30 (+ M-26, M-28, M-29 em parte) · os traços de raça viram dado com escopo · DECIDIDO em 15/09/2026 · FEITO em 18/09/2026 (`273f080`)

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

**FEITO.** `deslocamentoFrac` já estava no esquema (achado ao conferir, não é meu). Campo novo
`bonusCondicional` (array de `{bonus, escopo}`, mais `campo`/`nome` opcionais para a Vitalidade)
em `racas.json`, nas sete raças que têm algum: Anão, Elfo, Gnomo (2 cada), Halfling, Meio-Elfo,
Orc (1 Frenesi + Vitalidade), Meio-Orc (Vitalidade). Adicionado também ao esquema do `validate`,
junto com `longevidade` (M-09), que também não estava lá.

Vitalidade (escopo `"sempre"`, `campo: "pv"`) somada de verdade em `ficha-engine.ts`, no único
call site de `pv()` que tem acesso à raça (a própria ficha): `pvv = pv(vig, porteR) + (vitalidade
? vig : 0)`, com o tooltip do PV mostrando o termo extra. Testado no navegador
(`node .claude/skills/run-centelha-rpg/driver.mjs` não cobre isto; rodei um script à parte
selecionando raça no `#raca-sel` e lendo o DOM): Orc e Meio-Orc de Vigor 2 saem com PV 33
(25 + 2×3 + 2 de Vitalidade), contra 31 de Anão/Humano de mesmo Vigor sem o traço.

**Achado que não é meu para decidir:** há um SEGUNDO call site de `pv()` fora de
`ficha-engine.ts`, em `src/pages/mesa/combate.astro:1687` (`adicionarPCs`, ao trazer um PC para o
Grid), que não passa porte nem lê a raça de jeito nenhum, nem antes desta rodada, nem depois. Não
mexi: `combate.astro` é território da frente da mesa, e o pedido nomeava `ficha-engine.ts`/
`mesa-ficha.ts` (que não tem `pv()` nenhum). Fica registrado para quem cuida da mesa: um PC Orc
adicionado ao Grid hoje ainda entra com o PV sem Vitalidade e sem porte.

Os nove bônus situacionais (tudo menos a Vitalidade) aparecem na ficha num bloco novo
("Bônus condicionais", em `renderRaca()`/`FichaSkeleton.astro`), listados como bônus + escopo,
oferecidos e não somados, no mesmo espírito da Especialidade.

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

---

## M-29 e M-26 · o Halfling é Pequeno, e o Fôlego não tem base por raça

Decidido em 15/09/2026. **Duas decisões numa**, porque as duas eram a mesma ausência (campo que a
regra exige e `racas.json` não tem) e o humano respondeu as duas na mesma frase.

### O ORIGINAL, como está no disco

**O primeiro, `src/data/regras.json → derivados.pv` (a tabela que existe e ninguém alimenta):**

> *"PV base considera criatura de porte Médio (humanoide). base + Vigor×vigorMult. Criaturas de
> outros portes usam a tabela `porte` (base e multiplicador escalam com o tamanho): maiores
> aguentam mais mesmo com o mesmo Vigor. Médio = valores do topo (default para PCs)."*

```
"base": 25, "vigorMult": 3,
"porte": { "minusculo": {15, 1}, "pequeno": {20, 2}, "medio": {25, 3},
           "grande": {30, 4}, "enorme": {35, 5}, "imenso": {40, 5}, "colossal": {45, 5} }
```

**O segundo, `src/lib/calc.ts:29-34`:**

```ts
/** PV máximo. base + Vigor×mult, escalando com o porte (Médio = default, usado por PCs). */
export function pv(vigor: number, porte: Porte = 'medio') {
```

**Os dois únicos chamadores vivos**, `src/lib/ficha-engine.ts:1471` e `src/lib/mesa-ficha.ts:80`,
chamam `pv(vig)`, sem segundo argumento.

**O terceiro, `src/data/racas.json`**, nas oito raças: **não existe campo `porte`**. E o que as três
raças baixas dizem de si, em `descricao`:

| raça | a própria descrição | Vigor |
|---|---|---|
| Gnomo | *"**Pequenos** e resistentes, engenhosos e ilusionistas"* | +1 |
| Halfling | *"Pequenos e ágeis, atléticos apesar do **porte**"* | 0 |
| Anão | *"**Baixos e corpulentos**, de vida longa"* | +1 |

**O quarto, `src/data/regras.json → derivados.folego`**, a promessa do Fôlego:

> *"(...) `<25%` do pool = −1d6 em ações físicas; 0 = exausto (só defende ou Toma Fôlego).
> **Base por raça (humano = 10)**."*

```
"base": 10, "vigorMult": 5, "resistenciaMult": 4, "vontadeMult": 2
```

### A INCONSISTÊNCIA

**No porte:** a tabela `derivados.pv.porte` existe, tem sete linhas calibradas, e **nenhum
personagem jogável a alcança**, porque o argumento que a escolhe nunca é passado. O efeito
prático é que `pv(vigor)` devolve `25 + Vigor×3` para todo mundo e **um Halfling tem exatamente
o PV de um Orc de mesmo Vigor**. Não é uma regra tolerante: é uma regra que não roda.

É a mesma forma exata que o `deslocamentoFrac` teve, e o comentário que consertou aquela está em
`ficha-engine.ts:1492`, escrito pela própria casa:

> *"A BAIXA ESTATURA VIRA CONTA. O traço era prosa dentro de `tracos`, e nenhum código o lia: a
> ficha do anão mostrava os metros de um humano."*

A ficha do halfling mostra o PV de um humano, pelo mesmo motivo e no mesmo arquivo.

**No Fôlego:** a nota promete *"base por raça"* e o dado entrega **um número só**, 10, igual para
as oito. A promessa não tem onde pousar: `calc.ts:123` nem recebe a raça.

### A DECISÃO

**1. O Halfling é `pequeno`.** Passa a valer `20 + Vigor×2`. O que isso move, medido:

| Vigor | PV hoje (médio) | PV decidido (pequeno) | queda |
|---|---|---|---|
| 2 | 31 | 24 | −7 |
| 3 | 34 | 26 | −8 |
| 4 | 37 | 28 | −9 |
| 6 (teto) | 43 | 32 | −11 |

**2. O Fôlego NÃO ganha base por raça, e a regra fica em stand by.** Todas as raças básicas têm
a mesma base, 10. A parte de "stand by" **já é o estado do código**: `src/lib/modulos.ts:13` traz
`folego: false`, e o número não aparece na ficha nem a página entra no índice do site
(`site.ts:63`). O que a decisão manda fazer é **apagar a frase "Base por raça (humano = 10)"** da
nota, que é a única coisa no disco que ainda promete o contrário.

### O QUE ISTO MANDA FAZER, e o custo medido

1. **`src/data/racas.json` · `porte` explícito nas OITO**, e não só no Halfling. Ausente e
   decidido-Médio são indistinguíveis, e `d.porte?.[porte] ?? {base, vigorMult}` cai no valor de
   Médio para qualquer erro de digitação, calado. É o zero ambíguo do `CATALOGO`, na forma de
   campo faltando.
2. **`scripts/validate-data.mjs:49` · `porte: z.enum([...])`.** O zod **descarta chave
   desconhecida sem erro**, então sem a entrada no esquema um `"Pequeno"` com maiúscula joga como
   Médio e o portão fica verde. **Na mesma edição entra o `deslocamentoFrac`**, que a decisão
   M-30 já mandou e que falta pelo mesmo motivo.
3. **`src/lib/ficha-engine.ts:1471` e `src/lib/mesa-ficha.ts:80`** passam o porte da raça ao `pv()`.
4. **`src/lib/ficha-engine.ts:1481`, e este é o que morre calado:**

   ```ts
   r('Pontos de Vida', pvv, `25 + Vigor ${vig}×3 = ${pvv}`)
   ```

   Os dois números estão escritos à mão dentro da explicação. Sem mexer nele, a ficha do Halfling
   imprime **"25 + Vigor 3×3 = 26"**, uma conta que não fecha na própria linha. A explicação tem
   de sair da linha de `porte` em uso, não de outra cópia à mão.
5. **Linha de commit para quem abre a mesa amanhã:** `pv_max` é **coluna gravada** em
   `combatentes`. Halfling que já foi enviado para uma mesa continua com 34 até ser reenviado, e
   **não há migração que alcance isso**. O conserto é o reenvio pela ficha.

### O QUE FICA ABERTO, e não é para a Executora decidir

**O porte do PC não chega ao Grid.** `src/pages/mesa/grid.astro:10216` decide o porte assim:

```ts
const porteRotuloDe = (c: any) => (c?.tipo === 'criatura' ? MON[c.monstro_id]?.porte : null);
```

PC é sempre `null`, que normaliza para Médio, e o comentário logo acima diz que isso é de
propósito: *"PC sem `porte` (`null`) normaliza para `medio`, que é a metade implícita do par
atacante/alvo em toda mesa de PCs."*

Com `porteAcerto.porDiferenca[1] = 3`, ligar esse caminho daria ao Halfling **+3 para acertar
qualquer alvo Médio, e −3 para quem o ataca**, em toda jogada física, nos dois sentidos. Isso é
um ganho de combate que **ninguém pediu e ninguém precificou**: a pergunta que foi à mesa era de
PV. Então esta decisão implementa o PV e **deixa o Grid como está**, sabendo que por enquanto
`racas.json` diz `pequeno` e o Grid joga Médio para o mesmo personagem. As duas listas precisam
concordar, e concordam depois de uma decisão própria sobre o ±3.

**O Gnomo e o Anão continuam sem porte decidido**, e a pergunta vai à mesa em seguida.

### ADENDO · o porte do PC não chega ao Grid em TRÊS lugares, não em um

Escrito em 15/09/2026, depois da implementação (`b753e68`). Eu tinha nomeado **um** lugar, e a
Executora achou mais dois ao implementar. Os três leem a mesma coisa, `MON[c.monstro_id]?.porte`,
e os três dizem "no tabuleiro, só criatura tem porte". **As consequências são diferentes**, e por
isso valem citação separada:

1. **`src/pages/mesa/grid.astro:10211`** · o rótulo que vira o **±3 de acerto**. É o que a decisão
   já nomeou e mandou deixar como está.
2. **`src/pages/mesa/grid.astro:3412`** · `diametroM(c)`, que dá **1 metro a todo PC** e alimenta
   a medida de alcance **de borda a borda** decidida no L67. Um Halfling de meio metro mudaria
   geometria de alcance. **Não é o ±3: é outra conta, com outro efeito.**
3. **`src/lib/artes-grid-mesa.ts:1367`** · `pesoDoPorte(c)`, que devolve **0 para PC**, porque o
   bloco não declara quilos e o porte não chega. Onde esse peso entra numa conta, o PC entra como
   zero.

A divergência que esta decisão aceitou de propósito (`racas.json` diz `pequeno`, o Grid joga
Médio) tem portanto **três frentes**, e as três se fecham juntas quando a mesa decidir o ±3. É
uma decisão maior do que parecia quando eu a parquei, e a estimativa de uma linha estava errada
por dois terços.

**E a implementação achou um segundo lugar no Fôlego também:** além da nota do `regras.json`, o
capítulo repetia a promessa onde o jogador de fato lê, em `src/content/chapters/folego.md:12`
(a fórmula escrita como *"10 (base racial) + Vigor × 5…"*, e logo abaixo *"Um humano comum parte
de 10"*). Os dois saíram. Conserto de promessa em dado **sem varrer o capítulo** teria deixado a
metade visível de pé.

**Como o ponto 4 foi resolvido, e vale registrar:** a explicação da linha de PV na ficha não foi
corrigida à mão para `20 + ×2`. Ganhou uma função, `pvPorte(porte)` em `calc.ts`, que devolve a
**linha da tabela em uso**, e quem calcula e quem explica passaram a ler a mesma. Não sobrou
número escrito à mão dentro da frase, que era a forma de defeito que o ponto 4 apontava.

**Gnomo e Anão estão gravados como `medio`**, e isto é o comportamento de hoje tornado
explícito, **não uma decisão**. Se a mesa disser Pequeno, é trocar a palavra e o portão
acompanha sozinho.

---

## M-29b · o Gnomo também é Pequeno, o Anão não

Decidido em 15/09/2026, logo depois da M-29. **Fecha o porte das oito raças.**

### O ORIGINAL

O que as três raças de Baixa estatura dizem de si em `src/data/racas.json → descricao`:

| raça | a própria descrição | Vigor | custo |
|---|---|---|---|
| **Gnomo** | *"**Pequenos** e resistentes, engenhosos e ilusionistas, de vida longa (400+ anos)."* | +1 | 40 XP |
| **Halfling** | *"Pequenos e ágeis, atléticos apesar do **porte**, de vida longa (300+ anos)."* | 0 | 30 XP |
| **Anão** | *"**Baixos e corpulentos**, de vida longa (300+ anos)."* | +1 | 30 XP |

E o traço que as três carregam, palavra por palavra, idêntico:

> *"Baixa estatura: todo deslocamento vale DOIS TERÇOS do de um humano · o passo em combate, o
> Arranque, a Corrida e os Saltos."*

### A INCONSISTÊNCIA

**O traço compartilhado não decide o porte, e confundi-los seria o erro.** Ele mede **perna**, e
já foi aceito para as três desde que `deslocamentoFrac` virou conta. PV mede **massa**, e é outro
eixo. Uma raça pode ser baixa e densa.

O que decide, então, é a prosa, e a prosa **está desalinhada**: o Gnomo abre a própria descrição
com a palavra "Pequenos", enquanto o Anão diz "corpulentos", que é massa e não estatura.

### A DECISÃO

**O Gnomo é `pequeno`, junto com o Halfling. O Anão continua `medio`.**

A régua que isto estabelece, e que vale para raça nova: **baixo não é pequeno, largo compensa.**
O porte acompanha a MASSA, não a altura; a altura já tem o seu efeito próprio, que é o ⅔ de
deslocamento.

O que move, medido (Gnomo tem Vigor +1, então joga com Vigor base +1):

| Vigor jogado | PV como médio | PV como pequeno | queda |
|---|---|---|---|
| 3 | 34 | 26 | −8 |
| 4 (base 3 +1 racial) | 37 | 28 | −9 |
| 5 | 40 | 30 | −10 |
| 7 (teto 6 +1) | 46 | 34 | −12 |

O Gnomo custa **40 XP, contra 30 do Halfling e do Anão**, e é o que mais perde nesta decisão.
(Ao levar a escolha à mesa eu escrevi que ele era "a raça mais cara do jogo". **Não é:** o Elfo
custa 50, e o Gnomo empata em 40 com o Orc e o Meio-Orc. A comparação com os dois outros baixos,
que é a que pesava na escolha, estava certa.) A resposta do humano sobre o que fazer com o custo
está no item abaixo.

### O QUE ISTO MANDA FAZER

**Uma palavra em `src/data/racas.json`**: o `porte` do Gnomo, de `"medio"` para `"pequeno"`. O
portão acompanha sozinho, porque o `z.enum` dos sete portes entrou no `validate` em `b753e68`.

### O QUE FICA MARCADO PARA DEPOIS, por decisão do humano

**O custo em XP das raças será recalculado quando todas as inconsistências estiverem fechadas**,
e não agora. O motivo é que o custo é a soma de tudo que a raça dá e tira, e **a conta ainda está
se mexendo**: a M-30 (todo traço com número vira campo com escopo) ainda não foi implementada, a
Vitalidade do Orc ainda não é aplicada, e o porte acabou de mudar para duas das oito. Recalcular
agora seria calcular sobre um alvo em movimento, e daria um número que envelhece antes de ser
escrito.

**Os custos atuais das oito e o que já se sabe que vai pressionar cada um**, para quando a conta
for feita:

- **Gnomo, 40 XP** · o mais caro dos três baixos, e agora o que mais perdeu (PV de pequeno, sem o
  atletismo do Halfling para compensar). É o candidato mais forte a cair.
- **Halfling, 30 XP** · também perdeu PV, e o traço "Atletas" (+1d6) ainda vai ganhar forma de
  campo pela M-30.
- **Anão, 30 XP** · não perdeu nada aqui, e ganha dois +1d6 pela M-30.
- **Orc e Meio-Orc, 40 XP cada** · vão **ganhar** PV quando a Vitalidade passar a ser aplicada,
  porque hoje ela não é. O custo deles hoje está pago sobre um bônus que o jogador nunca recebeu.
- **Elfo, 50 XP** · o mais caro de todos, e o único que não é tocado por nada desta decisão. Serve
  de âncora quando a régua de custo for refeita.
- **Meio-Elfo, 20 XP, e Humano, 0** · o piso da escala, e também intocados aqui.

### ADENDO · o Gnomo cai para 30 XP por enquanto, e as idades entram na mesma conta

Decidido em 15/09/2026, minutos depois da M-29b, em resposta ao custo que a própria decisão
mediu.

**1. O custo do Gnomo desce de 40 para 30 XP, e o "por enquanto" é literal.** Ele passa a empatar
com o Halfling e o Anão. O motivo é o que a M-29b registrou: das oito, o Gnomo é o que mais
perdeu, e perdeu sem compensação (o Halfling ao menos tem "Atletas"). **O 30 de hoje é um número
provisório e entra na régua futura como qualquer outro**, não como piso fixado.

Dois lugares guardam esse número, e o segundo não acompanha sozinho:

- `src/data/racas.json` · o campo `custo`;
- `src/content/chapters/racas.md:69` · *"**Custo de XP:** 40"*, **escrito à mão**. Não há gerador
  para este capítulo (nenhum script de `scripts/` cita `racas.md`), então **cinco dos oito custos
  vivem em dois lugares sem nada que os prenda juntos**. O portão vale mais que a correção da
  linha.

**2. As idades entram na pendência, junto com o custo.** Além de recalcular o custo de XP de cada
raça, o humano acrescentou **recalcular as idades**. O que existe hoje:

- a `descricao` de cada raça em `racas.json` traz a longevidade em prosa (*"de vida longa (400+
  anos)"*);
- o capítulo repete e detalha (`racas.md:68`, *"Maturidade aos 20 anos; podem viver mais de 400
  anos"*; `:80`, *"maturidade por volta dos 18 anos… mais de 300 anos"*);
- e **a tabela de Envelhecimento existe só no capítulo**, `racas.md:123-142`, com quatro marcos
  por raça (Adulto, Maturidade, Velho, Venerável) e a penalidade cumulativa de −1 e −2 nos
  Atributos físicos. **Nenhum dado a guarda**, o que é a mesma forma do `deslocamentoFrac` antes
  da M-30: número em prosa que nada lê.

As duas contas (custo e idade) só acontecem **depois que todas as inconsistências fecharem**,
pelo mesmo motivo já registrado: a conta ainda se mexe.

**3. Um achado de vocabulário, que a implementação do porte tornou defeito.** O capítulo usa
**"miúdo"** em duas linhas de prosa, `racas.md:71` (Gnomo, *"num corpo miúdo"*) e `:84`
(Halfling, *"porte miúdo"*). **"Miúdo" é o RÓTULO de `minusculo`** no vocabulário do próprio jogo
(`grid.astro:3407` dá `'Miúdo': 0.25` contra `'Pequeno': 0.5`; `bestia-editor.ts:21` faz o mesmo
mapeamento), e as duas raças são `pequeno`. A segunda linha é a pior: ela cola a palavra `porte`,
que é termo mecânico, ao rótulo errado, com **fator 2** entre o que o capítulo diz e o que o dado
diz.

Varrido `src/` inteiro com Python (o `grep` não casa acento neste ambiente): **94 ocorrências, e
só estas duas são o defeito**. As outras 92 são o rótulo legítimo de `minusculo` no bestiário e
no código, a tabela de PV por porte em `vida-ferimentos-cura.md:25`, e prosa sem relação ("letra
miúda", "miudezas", "gente miúda"). **Nenhuma delas se toca.**

Não era defeito antes: virou um quando `porte` deixou de ser prosa e passou a ser campo.

---

## M-28 · a raça é um passo da criação, e vem antes dos Atributos

Decidido em 15/09/2026.

### O ORIGINAL, como está no disco

**`src/content/chapters/criacao-de-personagem.md:12-25`**, o passo a passo, com nove passos:

> **1.** Conceito · **2.** Orçamento · **3.** Atributos · **4.** Habilidades e Especialidades ·
> **5.** Virtudes · **6.** Força de Vontade e Aparência · **7.** Centelha · **8.** Proezas,
> Técnicas e Artes · **9.** Derivados

**A palavra "raça" não aparece uma vez na lista.**

**`src/lib/ficha-engine.ts:2041-2042`**, a ficha, que cobra:

```ts
const xr = RACA[S.raca]?.custo || 0;
const total = xa + xs + xsp + xv + xw + xap + xc + x2 + xt + xar + xef + xan + xr;
```

**`criacao-de-personagem.md:86-97`**, o exemplo do Kael, e os outros três (Sora, Veil, Bram) na
mesma forma: **nenhuma linha de raça, em nenhum dos quatro.**

### A INCONSISTÊNCIA

**A ficha cobra de 20 a 50 XP por uma escolha que o livro não manda fazer.** Quem segue os nove
passos monta o personagem inteiro sem nunca escolher raça. Abre a ficha, o seletor já está em
Humano, e se trocar para Gnomo o total sobe 30 sem que passo nenhum o tenha avisado.

**E os quatro exemplos são humanos sem dizer que são.** O PV do Kael é 37, que é `25 + Vigor 4×3`,
porte médio. Os quatro totais fecham porque Humano custa 0, ou seja, **está certo por acidente**:
nada no texto declara a escolha, e o leitor não tem como saber se o exemplo omitiu a raça ou se
ela custa zero mesmo.

**E há uma razão de ORDEM, não só de contabilidade:** a raça mexe nos **tetos de Atributo**
(`+1 teto de Vigor, até 7`), que são exatamente o assunto do passo 3. Escolher raça depois dos
Atributos é escolher depois que a régua já foi usada.

### A DECISÃO

**A raça vira o passo 3, entre Orçamento e Atributos, e os quatro exemplos ganham a linha
`Raça | Humano | 0`.**

O passo a passo passa a ter dez passos, e o motivo da posição está escrito na própria decisão: a
raça vem **antes** dos Atributos porque move os tetos que o passo seguinte usa.

**Nenhum total muda**, porque Humano custa 0. A linha não corrige número: **ela declara a
escolha**, que é a coisa que faltava.

### O QUE ISTO MANDA FAZER, e o custo medido

1. **O passo novo**, e a renumeração de 3 a 9 para 4 a 10. Varri `src/` com Python atrás de
   "passo N": a única ocorrência é `grid.astro:10833`, sobre outra coisa.

   **CORREÇÃO, escrita depois da implementação: eu disse "não há referência por número a passar
   vergonha", e a frase valia só para `src/`.** A varredura estava certa dentro do escopo dela e
   a conclusão saiu maior que o escopo, que é a forma de defeito do `CATALOGO` chamada "a
   conferência que cobre só a parte viva do registro". **Em `docs/` há SETE citações por número
   ao passo a passo deste capítulo, e todas envelheceram em um:** `jogador-novo-fase1.md` nas
   linhas 136, 138, 142, 145, 174 e 177 (achadas pela Executora), mais
   `jogador-novo-fase2.md:195` (que a varredura dela também não pegou, e que cita o passo 5 das
   Virtudes, hoje 6).

   **Elas NÃO se renumeram**, e o motivo é o mesmo do "(citação histórica)" do `reapontar.mjs`:
   aqueles documentos são o RELATO do que o jogador novo leu, e reescrever o número por dentro
   falsificaria o que ele viu. O conserto é uma nota de cabeçalho por documento dizendo que a
   numeração citada é a anterior a `b6a5293`.
2. **A linha `Raça | Humano | 0` nos quatro exemplos.**
3. **Um portão que soma a coluna de XP e compara com o Total declarado.** Medido antes de pedir:
   **os quatro fecham hoje**, exatos (Kael 1230, Sora 1643, Veil 2104, Bram 1868). Ou seja, o
   portão nasce verde e passa a guardar a linha nova. **Ele NÃO cobre o `A-03`**, que é outra
   coisa: lá o problema é a linha das Técnicas não ser derivável por dentro, e a soma da coluna
   não olha para dentro de linha nenhuma.

### O QUE FICA ABERTO, e esta decisão o deixa mais visível

**O teto de Atributo do capítulo colide com o teto racial.** `criacao-de-personagem.md:62` diz
*"Atributo máximo 5; … um único Atributo a 6"*, e a raça promete `+1 teto … até 7`; hoje o
`capFor` da ficha deixa chegar a 7. Pôr a raça antes dos Atributos põe as duas frases a um passo
uma da outra, onde antes havia seis passos entre elas. **É a `M-22`, e ela continua aberta depois
desta.** Isto foi dito à mesa junto com a escolha.

**E os Antecedentes têm a mesma forma do defeito que esta decisão conserta:** `ficha-engine.ts`
soma `xan` (antecedentes) no mesmo total, e **nenhum dos quatro exemplos tem linha de
Antecedentes** tampouco. Não entra nesta decisão porque não foi medido, mas é o mesmo molde e
merece medição própria.

---

## M-30b · o `+1` racial vira piso 2, e continua sendo teto 7

Decidido em 15/09/2026. **Não vem de inconsistência achada: é mudança de desenho pedida pelo
humano**, e é registrada no mesmo formato porque o que ela move é grande.

### O ORIGINAL, como está no disco

**`src/content/chapters/racas.md:30-31`**, o cabeçalho da tabela resumo:

> | Raça | Custo XP | **Teto +1 (até 7)** | **Teto −1 (máx 5)** | Porte |

**`racas.md:60-61`**, o Elfo, e as outras sete na mesma forma:

> - **+1 teto de Destreza** (até 7): graça sobre-humana.
> - **−1 teto de Vigor** (máx 5): corpo frágil.

**`src/lib/ficha-engine.ts:154-156`**, que é tudo o que a raça faz com Atributo hoje:

```ts
const rac = kind === 'attr' ? racialAttr(key) : 0;
const teto: Record<string, number> = { attr: 6, skill: 6, ... };
return (teto[kind] ?? 6) + rac;
```

**`ficha-engine.ts:2057-2059`**, o piso, que é **por trilha e não por atributo**:

```ts
const floorOf: Record<string, number> = {
  attr: pisoXp('atributo'), skill: pisoXp('habilidadePrimaria'), ...
```

### A MUDANÇA

**O `+1` racial deixa de ser só teto e passa a ser TAMBÉM piso.** O Elfo abre a ficha com
**Destreza 2**; o Orc e o Meio-Orc, com **Força 2 e Vigor 2**. O jogador não compra esse ponto.

**O `−1` racial não mexe no piso.** O mesmo Elfo abre com **Vigor 1**, como todo mundo, e perde só
o topo: **máximo 5 em vez de 6**.

**O `+1` continua levantando o teto até 7**, decidido explicitamente. As duas coisas andam juntas,
**por enquanto** (ver o que fica aberto).

### O QUE ISSO VALE, medido

O preço de um Atributo é `5 + 5×nível`, então **o nível 2 custa 15**, e começar no 2 vale **15 XP
por atributo bonificado**, para quem leve o atributo a 2 ou mais (que é todo mundo):

| raça | atributos com `+1` | XP que a raça passa a dar de graça | custo hoje |
|---|---|---|---|
| **Orc** | Força, Vigor | **30** | 40 |
| **Meio-Orc** | Força, Vigor | **30** | 40 |
| Elfo | Destreza | 15 | 50 |
| Anão | Vigor | 15 | 30 |
| Gnomo | Vigor | 15 | 30 (provisório) |
| Halfling | Destreza | 15 | 30 |
| Humano · Meio-Elfo | nenhum | 0 | 0 · 20 |

**Isto entra na conta da `M-46`**, e é a segunda coisa a mexer no custo das raças no mesmo dia: o
Orc e o Meio-Orc passam a receber 30 XP de graça mais dois tetos de 7, pelos mesmos 40 que o
Gnomo paga por um teto e 15 XP.

### O QUE ISTO MANDA FAZER, e o custo medido

**A boa notícia: a costura já existe, e o conserto é pequeno.**

1. **`ficha-engine.ts:2033`** · a soma do XP de Atributo é
   ```ts
   (ATTRS_D as any[]).forEach((a) => (xa += custoPontos('atributo', undefined, S.attrs[a.id] ?? 1)));
   ```
   e o `undefined` é justamente o parâmetro `de` de `custoPontos(chave, de = pisoXp(chave), ate)`
   (`calc.ts:242`). **Passar o piso racial ali já cobra certo, sem tocar em `calc.ts`.**
2. **`floorOf` passa a ser por ATRIBUTO, não por trilha.** É a única mudança de forma: hoje é um
   mapa `kind → número`, e o piso do `attr` passa a depender da chave. Três leitores
   (`:2065`, `:2085`, `:2101`).
3. **Trocar de raça tem de subir o que ficou abaixo do piso novo** (`ficha-engine.ts:2768`), e
   **carregar ficha salva também**. Uma ficha de Elfo salva com Destreza 1 existe hoje e é
   legítima; depois desta decisão ela está abaixo do piso. Isto é dado vivo, não hipótese.
4. **O capítulo muda em dois lugares**, como o custo do Gnomo mudou: a linha de cada raça e o
   cabeçalho da tabela resumo, que hoje diz **"Teto +1 (até 7)"** e passa a ter de dizer as duas
   coisas.

### O QUE FICA ABERTO, por pedido explícito do humano

**Os dois efeitos do `+1` podem vir a ser separados POR RAÇA.** A palavra do humano:

> *"podemos discutir se todas as raças aumentam o teto para os atributos ou se algumas ganham o
> segundo ponto mas não aumentam o máximo. Por exemplo: Orc ganha o segundo ponto em Força e
> Vigor e aumenta o limite desses atributos para 7. Gnomo ganha o segundo ponto de Vigor, mas
> mantém o máximo em 6."*

Hoje **todas as raças recebem os dois**, e o dado continua sendo o `atributos: { vigor: 1 }` que
já existe. **O que a implementação deve garantir é o SEAM, não o campo:** piso e teto passam a
ser lidos por dois caminhos separados, alimentados hoje pelo mesmo campo. Assim a separação
futura é trocar de onde um dos dois lê, e não uma migração.

**Não é para inventar o campo novo agora.** Campo sem consumidor foi exatamente o que o `porte`
foi até hoje de manhã, e a M-29 existe por causa disso.

---

## M-22 · ADIADA, mas com a medição feita

Levada à mesa em 15/09/2026 e **devolvida à pendência por decisão do humano**: *"ainda não temos
uma tabela de aumento de atributo por nível de Centelha. Não quero determinar isso agora."*

**Este registro existe para a medição não se perder**, porque ela foi feita e responde metade da
pergunta sozinha.

### O ORIGINAL

**`src/content/chapters/atributos.md:72-74`:**

> A faixa **1 a 6 é a régua mortal**, e o **6** é o ápice que um ser humano já alcançou. Valores
> de **7 a 12** são **sobre-humanos** … e **só se abrem pela Centelha** … *Como* a Centelha eleva
> esse teto é assunto do capítulo da Centelha.

**`src/content/chapters/centelha.md:44`, para onde ele aponta:**

> **Autoriza o sobre-humano.** … cada salto de tier abre teto além do humano, liberado pelo
> Mestre junto com o avanço. *(A tabela exata de quanto cada nível libera **ainda está em
> calibração**.)*

**`src/lib/ficha-engine.ts:155-156`:**

```ts
const teto: Record<string, number> = { attr: 6, skill: 6, ... };
return (teto[kind] ?? 6) + rac;
```

### O QUE FOI MEDIDO, e vale para quando a decisão vier

**Um capítulo manda para o outro, e o outro avisa que não está pronto.** A Centelha não entra no
`capFor`: o teto é 6 mais o racial, igual para Centelha 0 e para Centelha 6.

**E o bestiário já responde outra coisa.** As 309 criaturas, por porte:

| porte | n | maior Atributo (mediana / máx) | Força (mediana / máx) |
|---|---|---|---|
| Miúdo | 24 | 4 / 9 | 1 / 2 |
| Pequeno | 27 | 4 / 7 | 2 / 5 |
| Médio | 120 | 5 / 8 | 4 / 8 |
| Grande | 92 | 7 / 12 | 7 / 12 |
| Enorme | 31 | 10 / 13 | 10 / 13 |
| Imenso | 10 | 13 / 14 | 13 / 14 |
| Colossal | 5 | 16 / 16 | 16 / 16 |

**123 das 309 passam de 6**, e o teto delas segue o **porte**, não a Centelha: um **Braquiossauro
de Centelha 0 tem Força 14**, e a Tarrasque chega a **16**, acima do 12 que o capítulo dá como
topo.

**A régua mortal, do outro lado, se confirma:** entre os 120 Médios de Centelha 0 ou 1, o maior
Atributo é **5** em praticamente todos. As duas exceções são o Limo Cinzento (8) e o Basidirond
(6), que não são gente.

### O QUE ISTO JÁ DECIDE, mesmo sem a tabela

**São DUAS escadas, e só uma está escrita.** A frase *"7 a 12 … só se abrem pela Centelha"* está
certa sobre **pessoas** e falsa sobre **bichos**, e não diz de qual dos dois está falando. A
segunda cláusula (o teto de criatura vem do porte) é conserto de texto **independente da tabela**,
e pode entrar antes dela.

**As quatro formas que foram à mesa**, para não serem redescobertas: teto `6 + Centelha` (cai
exatamente no 12 quando a Centelha chega a 6); `6 + Centelha` só num Atributo de pico; meio ponto
por tier (`6 + ⌈Centelha÷2⌉`, que põe o topo de PC em 9 e tira o 12 do alcance); ou decidir que
**não há tabela** e o acima de 6 é permissão do Mestre, caso a caso.

---

## M-32 · sem a Força, o Arco Composto rende como um Arco Longo

Decidido em 15/09/2026.

### O ORIGINAL, como está no disco

**`src/content/chapters/armas-e-armaduras.md:86`**, a linha da arma:

> | Arco Composto | Distância | ★P(N1) | 6 | 1d6+2 | +0 | 300 m | 2 | Munição, **caro**.
> **Requer Força 4**, soma **Força×2**; resvala na placa |

**`src/data/armas.json:427`**, o único lugar do jogo onde este campo existe:

```json
"forcaMin": 4
```

**`src/lib/ficha-engine.ts:885` e `:1452`**, tudo o que o código faz com ele:

```ts
const reqForca = (atk.forcaMin && forca < atk.forcaMin) ? atk.forcaMin : 0;
...
`${c.reqForca ? ` · <span class="conj-req">requer Força ${c.reqForca}</span>` : ''}`
```

### A INCONSISTÊNCIA

**O requisito imprime um aviso e não faz mais nada.** O personagem de Força 1 equipa o Arco
Composto, lê "requer Força 4" na própria ficha, e atira com o `Força×2` inteiro. A ficha avisa e
concede na mesma linha. Não há, em capítulo nenhum nem em `regras.json`, uma frase que diga a
consequência de não ter a Força.

**E o aviso sem dentes premia quem o ignora**, porque a arma é boa demais sem ele:

| Força | Arco Curto | Arco Longo | **Arco Composto** |
|---|---|---|---|
| 1 | 1d6+0 | 1d6+1 | **1d6+4** |
| 2 | 1d6+1 | 1d6+2 | **1d6+6** |
| 3 | 1d6+2 | 1d6+3 | **1d6+8** |
| 4 | 1d6+2 | 1d6+4 | **1d6+10** |

**Na Força 1 o Composto bate 3 pontos mais forte que o Arco Longo**, que é a arma que ele deveria
não conseguir usar, e a vantagem CRESCE quanto mais fraco é o arqueiro em relação ao requisito
(na Força 3 são 5 pontos). Qualquer jogador que leia a tabela com atenção compra o Composto, seja
qual for a Força.

**O freio que sobraria também não existe:** a arma é marcada como "caro", e **nenhuma arma em
`armas.json` tem campo de preço**.

### A DECISÃO

**Abaixo de Força 4, o Arco Composto soma `Força×1` e parte de `+0`**, que são os números exatos
do **Arco Longo**, a arma da linha de cima da tabela.

A justificativa física é a mesma que dá ao Composto o `×2`: a curva dura é o que guarda mais
energia e o que exige braço. **Quem não arma o arco por inteiro não recebe o que a curva daria**,
e o que sobra é um arco comum caro. Na Força 1 sai `1d6+1` em vez de `1d6+4`, e o incentivo se
inverte sozinho.

**Nenhum vocabulário novo entra no sistema**: os dois números já existem, na arma ao lado.

**O que isto obriga no texto:** a palavra **"Requer"** da tabela passa a estar errada, porque a
arma não fica proibida, fica inútil. A linha tem de dizer o que de fato acontece.

### O QUE ISTO MANDA FAZER, e o custo medido

**São TRÊS leitores de dano por `forcaMult`, e dois deles têm de concordar ou a mesa diverge da
ficha:**

1. **`src/lib/ficha-engine.ts:879-885`** · onde o `mult` e o `db` são montados.
2. **`src/lib/combate-resumo.ts:101`** · o mesmo cálculo, e este é o que alimenta
   `mesa-ficha.ts` e `mesa-bestiario.ts`, ou seja, **é por ele que o número do PC chega à mesa**.
   Consertar só o primeiro faz a ficha dizer `1d6+1` e o Grid dizer `1d6+4` para o mesmo
   personagem. É exatamente o "contrato silencioso" que o `CLAUDE.md` nomeia sobre `equip.ts`:
   muda a forma, não dá conflito no git, e quebra o combate sem aviso.
3. **`scripts/lib-tempo.mjs:331`** · o motor da simulação (`A.forca * A.arma.forcaMult +
   A.arma.danoBonus`). Se ele não acompanhar, o espelho de motor passa a divergir, e a
   divergência será culpa do dado e não do código.

**Já existe portão cobrindo a junta:** `test-contrato.mjs` cobre `combate-resumo`, `equip` e
`mesa-ficha` (`scripts/mapa-cobertura.mjs:53`).

**O aviso da ficha (`:1452`) continua**, e passa a dizer a consequência em vez de só o requisito.

---

## M-31 · a lista "arma × armadura" passa a mostrar só a armadura

Decidido em 15/09/2026. **A pergunta original era de onde saíam dois pontos; a medição achou um
segundo erro, pior, na mesma lista.**

### O ORIGINAL

**`src/content/chapters/combate.md:113`**, a regra:

> **Absorção natural:** **Vigor + Centelha** contra o **Impacto** (o corpo e a fagulha amortecem
> a pancada); **só a Centelha** contra os letais (Cortante e Perfurante): a carne nua não para o
> fio nem a ponta, apenas a dureza sobre-humana da **Centelha** o faz.

**`src/content/chapters/armas-e-armaduras.md:151-153`**, três marcadores da MESMA lista:

> - **Placa completa × Corte** = 8 de Absorção (**10 no cavaleiro, com o corpo**) …
> - **Placa × Perfurante nível 0–2** … = **resvala**
> - **Placa × Impacto** (maça, martelo) = **só 4 de Absorção**: o malho **passa** …

**`src/lib/calc.ts:157-159`**, o código, que concorda com a regra e não com o exemplo:

```ts
export function soakNatural(vigor: number, cat: Modo | SoakCat) {
  return cat === 'impacto' ? vigor : 0;
}
```

### A INCONSISTÊNCIA

**1. Os "2 pontos do corpo" não vêm do corpo.** `armaduras.json` dá `corte: 8` à Placa completa e
`regras.dano.centelhaNoSoak` vale **1**, então os 10 são `8 + Centelha 2`. O exemplo supõe um
cavaleiro de **Centelha 2 sem dizer**, e chama isso de "o corpo", que é a única palavra que a
regra da linha 113 nega explicitamente: contra Corte o corpo dá **zero**.

**2. E o erro maior está dois marcadores abaixo.** O de Corte **soma** a absorção natural; o de
Impacto **não soma nada**. Mas Impacto é justamente o modo em que o corpo entra (`Vigor +
Centelha`): o mesmo cavaleiro, com Vigor 3, absorve **4 + 3 + 2 = 9** de Impacto, não 4.

**A lista adiciona o corpo na linha em que ele não existe e o esquece na linha em que ele é o
maior pedaço.** E isso sustenta uma conclusão: o marcador do Impacto existe para dizer *"o malho
**passa**, é a via contra placa"*, com um número que subestima a defesa em mais do dobro.

### A DECISÃO

**As cinco linhas passam a mostrar só a absorção da ARMADURA** (Corte 8, Impacto 4, Perfuração
4), e uma frase acima da lista lembra que a Absorção natural soma por cima, com a régua de qual
modo recebe o quê.

A lista é sobre arma contra **armadura**; o corpo é outra parcela, e misturar as duas numa linha
sim e noutra não foi o que produziu os dois defeitos. Os números passam a sair direto de
`armaduras.json`, onde **um portão pode prendê-los**, e o cavaleiro fantasma de Centelha 2 some.

**O que se perde, e foi dito à mesa:** era a única linha do livro que mostrava quanto um cavaleiro
de verdade aguenta. E a conclusão *"o malho passa"* fica apoiada só no 8 contra 4, sem o corpo,
que é justamente o que torna o malho **menos** decisivo do que a frase sugere. **Se a frase do
malho precisar de ajuste, ele é consequência desta decisão e não uma decisão nova.**

### O QUE ISTO MANDA FAZER

1. **As cinco linhas de `armas-e-armaduras.md:151-155`**, com os números da peça.
2. **A frase de cabeçalho da lista**, dizendo que a natural soma por cima.
3. **Um portão que prenda os números da lista a `armaduras.json`**, agora que eles são
   derriváveis. É o mesmo molde do portão que a rodada 69 fez para o custo de raça.

### ACHADO DE PASSAGEM, para consertar junto

**`src/data/regras.json → dano.nota` tem um travessão** (*"três Absorções: Impacto, Corte e
Perfuração — o Perfurante usa…"*). O portão automático só cobre `src/content/**` por decisão do
humano, então dado e comentário dependem da conferência à mão, e esta é uma.

---

## M-21 · dano é dano, cura é cura, e a morte muda de régua

Decidido em 15/09/2026. **A pergunta era quanto mais rápido o Impacto sara. A medição mostrou que
a pergunta era outra, e a resposta reescreveu a regra da morte.**

### O ORIGINAL

**`src/content/chapters/vida-ferimentos-cura.md:12-15`**, as duas trilhas:

> - **Impacto** (contundente), em regra só **nocauteia**: derruba, mas não mata.
> - **Letal** (cortante e perfurante), **fere de verdade**: é o que tira vidas.
>
> A **soma das duas** trilhas é o seu dano total … A morte, porém, só olha para o Letal.

**`vida-ferimentos-cura.md:54`**, onde a separação vira regra de vida ou morte:

> A morte verdadeira só chega quando o **dano Letal acumulado iguala o seu PV máximo**.

**`vida-ferimentos-cura.md:75-83`**, a tabela de Recuperação, com **uma coluna só**, e embaixo:

> *Dano de Impacto sara muito mais rápido que o Letal.*

### A INCONSISTÊNCIA

**A frase promete uma diferença e a tabela não tem onde guardá-la.** "Muito mais rápido" não é
número, e a tabela tem uma linha por estado, não duas.

**E o problema real é maior.** Varri todo o código de `src/` atrás de "Letal": **ela aparece uma
única vez, dentro de um texto de tela** (`referencia.astro:170`). Não existe acumulador, não
existe segunda trilha, não existe coluna. O Grid tem **um** `pv_atual`, e o tipo de dano serve só
para escolher a Absorção da armadura.

**A regra que decidia morrer ou desmaiar nunca foi implementada.**

### A DECISÃO

**1. Dano é dano, cura é cura.** Qualquer dano soma no mesmo número: corte, perfuração, impacto,
queimadura, queda, veneno. Qualquer cura cura, seja qual for o método.

**2. O personagem cai quando chega a PV zero ou menos**, independentemente de como.

**3. Morre ao perder vida ALÉM do zero, até um limite.** O limite é **metade ou um quarto do PV
máximo**, e **qual dos dois será determinado por TESTE**, não por escolha de mesa. Enquanto o
teste não sair, **o capítulo não publica a regra nova**: já há duas regras publicadas que se
declaram inacabadas (o orçamento de XP e o teto de Atributo por Centelha), e o relato do jogador
novo reclamou das duas. Não se acrescenta a terceira.

**4. O tipo de dano continua importando, no lugar onde já importa:** ele escolhe a Absorção da
armadura. A Placa completa absorve 8 de Corte e **4** de Impacto, então o malho contra placa
continua sendo a via que era. **O tipo pesa no golpe, não na cicatriz.**

### POR QUE UMA TRILHA, e não duas

**A regra nova entrega o que as duas trilhas existiam para entregar.** Desmaiar a 0 e morrer só
abaixo de 0 faz de "não matar" a decisão de **parar de bater**, que acontece na mesa, no momento,
em vez de numa segunda coluna.

**E seis armas trocam de modo entre golpes:**

| arma | modos |
|---|---|
| Alabarda · Montante | corte, perfurante, **impacto** |
| Martelo de Guerra | **impacto**, perfurante |
| Picareta de Guerra | perfurante, **impacto** |
| Machado · Machado de Arremesso | corte, **impacto** |

Com duas trilhas, cada golpe de uma mesma arma iria para um pool diferente, e o Mestre teria de
lembrar para onde foi cada um dos quatro a seis golpes de uma briga. **O sistema convida a
alternar (é isso que os modos são), e a contabilidade puniria quem usa a arma como ela foi
desenhada.**

**E o custo bateria onde é mais caro:** coluna nova em `combatentes`, migração de Supabase rodada
à mão, e dois números por combatente na tela do Grid.

**O que se perde:** a recuperação acontece fora da tela, em dias e semanas, então separar as
trilhas obrigaria o Mestre a carregar por semanas de tempo de jogo a memória de quanto do dano
foi hematoma. É pouco, e foi dito à mesa junto com a escolha.

### PONTO DE MELHORIA, registrado por pedido do humano

**Diferenciação de dano e de cura**, por tipo. Fica como extensão conhecida, com o custo já
medido nesta seção (coluna, migração, roteamento por modo, dois números na tela), para ser feita
se a mesa sentir falta. **O "por enquanto" é literal.**

### O QUE ISTO MANDA FAZER

**Primeiro o teste, depois o texto.** O capítulo só se reescreve uma vez, com o limite já
decidido.

O que o teste precisa responder: com o limite em **metade** e em **um quarto** do PV máximo,
quantas vezes um combatente que chega a 0 de fato **morre** antes de a briga acabar, e quanto
tempo (em Ticks) um caído tem antes de a margem se esgotar. O golpe mediano deste sistema tira
**7,5** antes da Absorção, então metade do PV de um Vigor 3 (17) são cerca de dois golpes e um
quarto (8) é cerca de um.

Depois do número, o capítulo perde: a separação das trilhas (`:12-15`), a regra antiga da morte
(`:54`), e a frase da recuperação (`:83`). E ganha as três regras novas.

### ACHADO DE PASSAGEM

**`src/pages/mesa/referencia.astro:170` ainda diz que o Sangramento causa Letal "no início da
rodada do personagem"**, que é exatamente a redação substituída pela decisão M-04 ("a cada 6
Ticks desde o ferimento"). Essa página escapou da varredura da rodada 66, e o conserto independe
desta decisão.

---

## M-08 · a Centelha vai a 12, e o jogador para em 6

Decidido em 15/09/2026.

### O ORIGINAL

**`src/data/regras.json → escalaCentelha`**, sete degraus, terminando em:

> | 6 | **Semideus** | *"Material de fábula, venerado como divindade. Proezas até o nível 6 (teto)."* |

**`src/lib/ficha-engine.ts:155`**, o teto do personagem:

```ts
const teto: Record<string, number> = { attr: 6, skill: 6, skill2: 6, virtue: 6, centelha: 6, willpower: 12, aparencia: 12, ... };
```

**`src/data/inimigos.json`**, as 309 criaturas:

```
Centelha: 0→106  1→55  2→38  3→19  4→41  5→24  6→16  7→5  9→4  10→1
```

**`scripts/validate-data.mjs:59`**, o portão:

```js
centelha: z.number().int().min(0).max(10),
```

### A INCONSISTÊNCIA

**Dez criaturas estão fora da régua**, e não por desatenção de conversão: **as dez são
`tipo: chefe` E `ameaça: 6`**, o topo das outras duas escalas ao mesmo tempo. Tarrasque em 10;
Balor, Diabo do Fosso, Solar e Grande Wyrm em 9; Marilith, Planetar, Kraken e dois dragões em 7.
São exatamente os seres que a fonte trata como deuses e príncipes demoníacos.

**E o número paga:** cada ponto de Centelha vale `+1` ao ataque, `+1` a cada uma das quatro
Defesas, e entra em Energia (`×2`) e Mana (`×2`).

**Por que ninguém viu: o portão foi escrito para o DADO e não para a REGRA.** O `validate` aceita
`max(10)` enquanto a `escalaCentelha` para em 6. As duas listas precisam concordar e nunca
concordaram; cada uma estava coerente consigo mesma, e o defeito morava no espaço entre elas.

### A DECISÃO

**A escala vai de 0 a 12, e 12 é o teto real.** A faixa acima do Semideus é de **deuses e
entidades cósmicas**.

**O teto do JOGADOR continua em 6**, e isso passa a ser dito, não presumido. A palavra do humano:

> *"A escala para os jogadores vai de Centelha 0 até 6, mas existem criaturas muito mais
> poderosas. … Centelha 12 é para seres como deuses, entidades cósmicas, etc. É o teto real, assim
> como em Exalted o máximo é Essência 10, e o recomendado para jogadores é chegar até Essência 5."*

**Correção de um número da conversa:** a maior Centelha do bestiário hoje é **10** (Tarrasque), e
não 9. Os 9 são quatro criaturas logo abaixo dela. A folga até o novo teto é de **dois** degraus,
não de três.

**O que a Centelha NÃO entrega acima de 6:** Proeza nova. O teto de Técnica é o nível 6 e "o nível
N exige Centelha ≥ N". Acima disso ela só engorda ataque, Defesas, Energia e Mana, o que é
apropriado para um deus e é a razão de o teto do jogador ficar onde está.

### O QUE ISTO MANDA FAZER

1. **FEITO** `ae515c0` · **`escalaCentelha` ganha os degraus 7 a 12.** O 12 é o teto real, de deus e entidade cósmica.
   **Nomear cada um dos seis degraus novos é worldbuilding e FICA ABERTO** (ver abaixo); o que
   esta decisão exige é que os números existam e que a faixa divina esteja descrita.
2. **FEITO** `ae515c0` · **`validate-data.mjs:59` passa de `max(10)` para o topo da escala**, e **de preferência lendo o
   tamanho de `escalaCentelha` em vez de repetir o número**. Foi a repetição que deixou as duas
   listas divergirem por dez criaturas sem que o portão piscasse.
3. **FEITO** `ae515c0` · **O teto do jogador (6) tem de estar ESCRITO**, no capítulo da Centelha. Um leitor que vê a
   régua até 12 e o próprio teto em 6 sem explicação lê aquilo como defeito.
4. **FEITO** `ae515c0` · **Três lugares renderizam a escala** e vão passar a mostrar treze degraus:
   `ficha-engine.ts:114` (o popup da ficha), `referencia.astro:54` e `ref-index.json.ts:14`.
   Nenhum número de criatura muda.

### O QUE FICA ABERTO

**O RÓTULO PROVISÓRIO QUE ENTROU, dito aqui porque a decisão pediu que eu dissesse qual foi:**
os seis degraus renderizam como **"Divino · a nomear"**, e cada um carrega `provisorio: true` no
dado (`ae515c0`). A escolha é de propósito feia de ler: quem abrir a ficha, a referência da mesa ou o
índice vê que aquilo é um lugar guardado e não um nome. Os TEXTOS dos seis degraus, esses, foram
escritos (anjo maior e senhor demoníaco no 7, o Balor e o Solar no 9, o Tarrasque no 10, divindade
plena no 12), então o que falta é só o nome do degrau.

**Os nomes dos degraus 7 a 12.** O 0 a 6 tem rótulo próprio (Mortal, Tocado, Desperto, Herói,
Campeão [renomeado de "Grande herói" em 17/09/2026], Lendário, Semideus), e a faixa nova precisa do mesmo tratamento ou de uma decisão
explícita de não ter. É decisão de lore, não de regra, e depende do que este mundo diz existir
acima de um semideus.

---

## M-21 · o limite da morte é METADE do PV máximo

Decidido em 15/09/2026, com a medição da rodada 74 na mão (`docs/simulacao/caixa/m21-morte-medicao.md`).

**A decisão de regra que faltava**, e ela completa a M-21 sem reabrir nada do que já estava
decidido ali (dano é dano, cura é cura, cai a PV 0 ou menos):

> **Morre-se ao perder vida além do zero, até METADE do PV máximo negativo.** Um personagem de
> PV 34 cai em 0 e morre em −17.

### POR QUE METADE, com os números que decidiram

Socorrer um caído custa **4 Ticks** (até 4 metros, com a ação utilitária de 4 Ticks). A margem
mediana que cada limite dá, contra esse custo:

| limite | margem no `combo+2` | margem no `combo+3` | morrem (chefe remata) |
|---|---:|---:|---:|
| 0, a regra de hoje | 0 Tick | 0 Tick | 100% |
| PV ÷ 4 | 5 Ticks | 5 Ticks | 87% · 79% |
| **PV ÷ 2** | **10 Ticks** | 5 Ticks | 82% · 70% |

Com limite 0 a cena do aliado caído **não existe**: cair é morrer, e é isso que o capítulo promete
e o jogo não entrega. Com PV ÷ 4 ela existe e empata com o próprio custo do socorro já a 8 metros.
Três coisas que a medição não cobre puxam todas para o mesmo lado, o do limite maior: o
**Sangramento** come a margem por fora (com PV ÷ 4, um único tique de sangue consome quase toda
ela), a medição roda uma build **maximizada** (um personagem comum tem PV menor, e um quarto dele
é menor ainda), e a Velocidade da ação de estabilizar é suposição, com 5 Ticks tão plausível
quanto 4.

**O CONTRA QUE A MESA COMPROU, escrito porque foi dito na hora de decidir:** com PV ÷ 2 e o chefe
ignorando os caídos, **0% morrem**. Morrer deixa de ser risco da briga e vira decisão de quem está
batendo, e um combate em que ninguém morre por acidente perde tensão. A leitura que sustenta a
escolha assim mesmo é a da decisão da M-21: fazer de "não matar" a decisão de **parar de bater**,
que acontece na mesa e no momento, foi exatamente o que substituiu as duas trilhas.

### O QUE ISTO MANDA FAZER

1. **O limite vira DADO**, em `src/data/regras.json`, e não só prosa de capítulo: é a régua que a
   mesa vai ler, e hoje não existe bloco de morte em lugar nenhum do JSON.
2. **O capítulo `src/content/chapters/vida-ferimentos-cura.md` se reescreve, agora de uma vez.**
   Saem: as duas trilhas da abertura, a regra velha da morte, a frase de que o Impacto sara mais
   rápido, e o exemplo do Bram que conta Letal separado. Entram: dano é dano, cai em 0, morre em
   −PV ÷ 2, e o tipo de dano pesando na Absorção e não na cicatriz.
3. **Um portão prende o texto ao dado**, para as duas listas não divergirem de novo: foi o espaço
   entre `escalaCentelha` e o `validate` que deixou dez criaturas fora da régua na M-08.
4. **O que a mesa (o Grid) faz com o limite é MEDIDO antes de construído.** Hoje ela não
   implementa morte nenhuma, e quanto custa ensiná-la é pergunta aberta, não trabalho aprovado.

### O QUE FICA ABERTO

**O Sangramento em quem já caiu.** Ele come a margem por fora e a medição não o modelou (o
`sim-grupo` não tem condição contínua). A regra publicada hoje diz que um caído que sangra
continua acumulando dano rumo à morte, e isso continua verdadeiro com o limite novo. Se a mesa
sentir que o sangue mata rápido demais quem está caído, o número a mexer é o intervalo de 6 Ticks
ou uma suspensão do Sangramento abaixo de zero, e é decisão de regra.

---

## M-24 · a Investida é uma Corrida que termina em ataque

Decidido em 15/09/2026, em quatro respostas da mesa. **A pergunta era "a Investida usa o Arranque
ou a Corrida", e a resposta trocou a natureza da ação em vez de escolher entre as duas
velocidades.**

### O ORIGINAL

**`src/content/chapters/combate.md:228-240`**, a seção Investida, como está publicada:

> Investir é **gastar o Preparo correndo** em vez de andando. Não é ação nova nem regra nova: é o
> Preparo que a sua arma já tem, atravessado à velocidade de Corrida.
>
> | **Preparo investindo** | velocidade de Corrida por Tick | −2 **a mais** | **+1d6** |
>
> *Kael, de martelo (Preparo 2), anda 4 m por Tick e corre 6. Fechando a distância no Preparo ele
> cobre 8 metros com a Defesa em −2. Investindo, cobre 12, com a Defesa em −4.*

**`combate.md:219-224`**, a Corrida, três seções acima, com duas velocidades:

> A largada acelera: os **3 primeiros Ticks** correm à Velocidade de **Arranque**; do **4º Tick em
> diante**, à Velocidade de **Corrida**.

**`src/data/regras.json`**, `combate.movimento.investida`: `danoDados: 1`, `defesaExtra: -2`, e o
mesmo texto do capítulo.

### A INCONSISTÊNCIA, e ela é tripla

Kael tem Força 3, Destreza 4, Atletismo 3, o que dá **Arranque 5,5** (mostra 6) e **Corrida 8,5**
(mostra 9).

1. **O exemplo não usa a velocidade que a regra manda.** Ele diz "corre 6", e 6 é o Arranque. Pela
   regra escrita, Kael cobriria 9 por Tick e 18 metros, não 12.
2. **A regra escrita é inalcançável pela régua do mesmo capítulo.** O Preparo máximo de arma corpo
   a corpo é 2 Ticks (`combate.pgr.preparo`: leve 0, média 1, haste e pesada 2), então nenhuma
   investida chegava ao Tick 4, e "velocidade de Corrida" nomeava uma faixa em que nenhum golpe
   pisava.
3. **A mesa já jogava o contrário do livro.** `src/pages/mesa/grid.astro:5614`, em `passoNoModo`, devolve
   `p.arranque` para Corrida e Investida, com o comentário logo acima afirmando que a Investida
   "cobre a distância da Corrida por Tick". O código fazia uma coisa e o comentário dizia outra, e
   nenhum teste discordava.

### A DECISÃO, em quatro partes

**1 · A INVESTIDA É UMA CORRIDA QUE TERMINA EM ATAQUE**, com a escada de velocidade inteira:
Arranque nos três primeiros Ticks, Corrida do quarto em diante. **Ela não é o Preparo atravessado
correndo**, que é coisa diferente e continua existindo: preparar um golpe e se deslocar durante a
preparação é o Deslocamento de Batalha, com a guarda de pé.

**2 · A CORRIDA CONTÉM O PREPARO.** Os Ticks correndo são o Preparo da arma, e **o Tick do golpe é
o encontro entre o atacante e o alvo**. O martelo (Preparo 2) corre pelo menos dois Ticks; a arma
média, um; a leve, nenhum, e por isso o mínimo em metros abaixo é o que a mantém honesta.

**3 · A DEFESA CONTINUA EM −4 enquanto atravessa**, e a decisão anterior da mesa fica de pé:
*investir é forma de aproximação, mesma família da Corrida, e gasta a guarda dela e nada mais*. Na
régua isso já nasce somado, `escada.preparo` (−2) mais `investida.defesaExtra` (−2), e dá
exatamente a `corrida.defesa` (−4). **O que foi recusado de novo, agora com o modelo novo à
vista, é o −6** (somar Corrida com Preparo como duas coisas). O contra comprado: a corrida agora
pode durar dez Ticks em vez de dois, e cobrar o mesmo por dez e por dois faz da investida longa a
melhor forma de chegar, quando ela deveria ser a mais arriscada.

**4 · O MÍNIMO SÃO 5 METROS**, e ele é em METROS e não em Ticks. Um mínimo em Ticks cobraria mais
metros justamente de quem corre melhor, que é o contrário do que a Investida deve premiar. Os 5
metros são o topo da faixa humana do Deslocamento de Batalha (2 a 5 m por Tick): investe-se de
onde um passo de combate não alcança em um Tick. Quem corre rápido cobre isso em um Tick e o lento
em dois, e é aí que o rápido é favorecido. O contra comprado: com hexágono de 1 metro, 5 metros é
perto, então quase toda briga vai permitir investir, e a Investida perde o ar de travessia.

O **+1d6** no golpe não foi tocado e continua como está.

### O QUE ISTO MANDA FAZER

1. **`regras.json`, `combate.movimento.investida`:** o texto deixa de dizer que é o Preparo
   atravessado correndo e passa a dizer o que a mesa decidiu, e o bloco ganha o mínimo de 5 metros
   como DADO. `danoDados` e `defesaExtra` não mudam.
2. **`combate.md`, a seção Investida:** reescrita pelas quatro partes acima, com o exemplo do Kael
   refeito (correndo dois Ticks ele cobre 12 metros em Arranque; correndo cinco, cobre 36, porque
   o quarto e o quinto já são Corrida).
3. **O Grid ganha a escada inteira.** Hoje `passoNoModo` devolve `p.arranque` para toda a corrida,
   e o comentário explica que "quase toda perseguição de combate cabe nos três primeiros Ticks".
   Com a corrida podendo ser longa, isso deixou de ser verdade: do quarto Tick em diante o passo é
   o de Corrida.
4. **O mínimo de 5 metros vira recusa na declaração**, e não conselho de texto.
5. **Um portão prende os três lugares** (o dado, o capítulo e o passo do Grid), que é o que faltava
   para as três vozes divergirem por meses sem ninguém piscar.

### O QUE FICA ABERTO

**O que acontece quando o alvo se move durante a corrida.** O Tick do golpe é o encontro, e o
encontro depende dos dois. Quem recua estica a corrida, e não está decidido se ela estica
indefinidamente, se o atacante pode desistir no meio (a Corrida é interrompível a qualquer Tick,
então provavelmente sim) e o que acontece com o +1d6 de quem para de correr antes de encontrar.

---

## M-21b · as quatro perguntas que a M-21 abriu, decididas

Decididas em 15/09/2026, a partir da medição do item 4 da rodada 75
(`docs/simulacao/caixa/progresso-75.md`). **A inconsistência é a mesma nas quatro:** a M-21 tirou
as duas trilhas de dano, e com elas o chão de regras publicadas que falavam de Impacto, de Letal e
de um "limiar de morte" que agora é derivado.

### 1 · QUEM MARCA A MORTE · o mestre, como hoje

**O original:** `src/data/condicoes.json` traz `{"id": "morto", "nome": "Morto", "icone": "☠",
"foraDeCombate": true, "nota": "Fim."}`, e quem a põe é o mestre, à mão. A mesa já marca sozinha ao
chegar a zero, e a condição que ela põe é `inconsciente` (`src/pages/mesa/combate.astro:1351`), então o molde
de marcar sozinha existe e é da própria casa.

**Correção de 15/09/2026, achada pela Revisora na rodada 75 (CORRIGE 5):** esta entrada dizia
`caido`, copiando o relatório da Executora, e as duas leram o COMENTÁRIO em vez da linha. O
comentário de `combate.astro:1346` diz "marca como caído" e o código põe `inconsciente` cinco
linhas abaixo. O argumento sobrevive inteiro, porque o que ele afirma é que existe gancho de
estado no zero, e existe; o nome estava errado nos dois documentos.

**A decisão: a mesa NÃO marca.** O limite aparece na tela como informação, e a condição `morto`
continua sendo gesto do mestre. **O contra comprado:** uma régua que só vale quando alguém lembra
é justamente do que o relato do jogador novo mais reclamou, e a morte pode passar despercebida no
meio da briga.

### 2 · INQUEBRANTÁVEL · o Impacto não atravessa o zero PARA QUEM TEM A TÉCNICA

**O original:** `src/data/tecnicas.json`, a Técnica `inquebrantavel` (Pele de Pedra, nível 4,
passiva): *"Dano de Impacto nunca te mata, só nocauteia; +1 ao limiar de morte."* As duas metades
perderam o chão: a primeira ERA a regra das duas trilhas, e a segunda mexe num limiar que virou
derivado e não tem campo.

**A decisão: golpe de Impacto derruba quem tem a Técnica, e para em 0.** Só outro tipo de dano a
leva abaixo do zero. O motor já sabe o tipo do golpe, porque é ele que escolhe a Absorção.

**O contra comprado:** isto ressuscita a contabilidade por tipo de dano exatamente onde a M-21 a
tirou. A diferença que a torna aceitável é o alcance: ali era o sistema inteiro somando duas
colunas o tempo todo, aqui é uma Técnica de nível 4 olhando o tipo do golpe que atravessaria o
zero, uma vez, no instante em que atravessaria.

**O CABEÇALHO DESTA SEÇÃO ESTAVA GENERALIZANDO O QUE O CORPO RESTRINGE, e isso propagou. Corrigido
em 15/09/2026, achado pela Revisora na rodada 77.** Ele dizia "o Impacto não atravessa o zero",
sem a restrição, e a M-21d citou a leitura do cabeçalho: a rodada 77 publicou em DOIS arquivos de
dado comprável (`tecnicas.json` e `armas.json`) que o **Impacto comum** para no zero. Isso
contradiz a M-21 inteira ("dano é dano"), contradiz `combate.md:111` ("qualquer um dos três mata")
e, pior, **faria o `inquebrantavel` de nível 4 comprar nada**, porque ele existiria para dar o que
todo mundo já tem.

**E a Revisora nomeou a consequência que ninguém teria visto:** o `CLAUDE.md` manda o JSON vencer e
o capítulo se corrigir. Aplicada a esta divergência, essa regra mandaria reescrever o
`combate.md:111` para dizer que o Impacto para no zero · **revogando a M-21 para um dos três modos
por um caminho que ninguém decidiu.** Uma regra de precedência boa, aplicada sobre um dado errado,
executa o erro com autoridade.

**A decisão não mudou:** vale o CORPO, que é o que a mesa escolheu (a opção dizia, com todas as
letras, "só outro tipo de dano leva **quem tem a Técnica** abaixo do zero"). O que estava errado
era o título, e os dois textos de dado se corrigem na rodada seguinte.

### 3 · A ARTE VIDA · a restrição cai

**O original:** `src/data/regras.json`, `arcano.cura.outrasArtes`: *"A Vida, por exemplo, não fecha
ferimento: apressa o corpo a fechá-lo sozinho, e só alcança dano Letal a partir do nível 3."*

**A decisão: a Vida cura abaixo de zero, em qualquer nível.** A frase perde a cláusula do Letal, e
o que continua valendo da regra é o que o mesmo parágrafo já diz: toda Arte que cura sem ser a
Cura cura MENOS pelo mesmo Mana.

**O contra comprado:** a Vida fica mais forte do que quem a comprou esperava, e a mesa não decidiu
subir o poder dela, só tirou o chão de uma frase.

**E FICA ANOTADO, por pedido do humano na hora de decidir:** como a **Cura** e a **Vida** se
comportam diante de **níveis diferentes de dano** é conversa própria, ainda não tida. Não bloqueia
nada e não tem dono de código; quando acontecer, é aqui que a cláusula que saiu pode voltar em
outra forma.

### 4 · CURAR QUEM PASSOU DO LIMITE · não alcança

**O original:** as quatro entradas de cura (`curarPv` em `src/pages/mesa/grid.astro:2682`, `curarAlvo` em
`src/lib/artes-grid-mesa.ts:1921`, `devolverVida` em `grid.astro:11626` e `jogador_muda_peca` em
`supabase/migracao-22.sql:123`) não têm noção nenhuma de morto: **curar um morto o traz de volta
em silêncio**, e isso acontece hoje, por acidente e não por desenho.

**A decisão: passou do limite, a cura não alcança.** O mestre que quiser desfazer tira a condição
à mão, e essa porta é deliberada. **O contra comprado:** fecha por código uma porta que uma Arte
de ressurreição futura vai querer, e obriga a pensar nela quando ela aparecer.

### A CONSEQUÊNCIA DE ENGENHARIA, decidida pelo Arquiteto e escrita aqui porque muda código

**A trava da cura vai pelo NÚMERO, e não pela condição `morto`.** Ela mora onde a Vida é escrita e
compara com o limite derivado de `pv_max`. Se dependesse da condição, e a decisão 1 põe a condição
na mão do mestre, a porta ficaria aberta em silêncio exatamente enquanto ele não tivesse clicado,
que é o defeito que a trava existe para fechar.

### O QUE ISTO MANDA FAZER

1. **`regras.json`**: a cláusula do Letal sai de `arcano.cura.outrasArtes`, **e sai também de
   `src/data/efeitos.json:6049`**, que publica a MESMA cláusula com outras palavras ("Curar dano
   Letal por esta via exige Vida 3"). O segundo lugar entrou em 15/09/2026, pelo ESCALA 2 da
   Revisora: o relatório citava os dois e esta lista herdou um.
2. **`tecnicas.json`**: o texto do `inquebrantavel` passa a dizer que o Impacto para no zero, e o
   "+1 ao limiar" sai.
3. **As quatro entradas de cura** ganham a trava pelo número, e o servidor também, porque uma
   delas é RPC.
4. **Nada marca a morte sozinho**, e o que a tela ganha é o limite visível.

---

## M-21c · o arredondamento do limite depende da Centelha

Decidido em 15/09/2026, depois de a rodada 75 publicar o limite com arredondamento para baixo.

**O ORIGINAL, e ele tem um dia de idade:** `src/data/regras.json`, bloco `morte`, com
`limiteDivisor: 2` e arredondamento para **baixo**, escolhido pela Executora pela convenção da
casa (a mesma de `dano.penalidade.movimento`) e relatado por ela como escolha que a mesa podia
querer trocar.

**A INCONSISTÊNCIA que ela mesma levantou:** para baixo é a direção MAIS mortal (PV 37 morre em
−18 e não em −19), e os três argumentos que escolheram metade em vez de um quarto empurram todos
para a margem maior: o Sangramento comendo a margem por fora, a medição ter rodado numa build
maximizada, e a ação de estabilizar podendo custar 5 Ticks em vez de 4. A mesma decisão comprava
margem no atacado e devolvia meio ponto dela no varejo.

**A DECISÃO: quem não tem Centelha arredonda para baixo, quem tem arredonda para cima.**

| Centelha | limite de um PV 37 | quem é |
|---|---|---|
| 0 | −18 | o mortal comum, e a maior parte do bestiário |
| 1 ou mais | −19 | o Tocado para cima, e todo personagem de jogador |

O meio ponto passa a ser o que a Centelha é: não vira número novo, vira a direção do
arredondamento de um número que já existia. Só muda alguma coisa em PV ímpar, e a diferença é de
um ponto.

**O contra comprado:** é uma exceção de arredondamento num sistema que arredonda para baixo em
todo lugar, e exceção que vale num cálculo só é a cláusula que envelhece calada, porque ninguém a
relê depois de decorar a convenção. O que a torna defensável é ela não ser arbitrária: ela diz uma
coisa sobre o mundo, e é a mesma coisa que a Centelha diz em toda parte.

### O QUE ISTO MANDA FAZER

1. **`regras.json`, bloco `morte`:** o arredondamento deixa de ser um valor e passa a ser a régua
   com as duas direções, escolhida pela Centelha de quem está caindo.
2. **O capítulo publica as duas linhas**, com o exemplo ímpar de cada lado, porque um exemplo par
   não distingue nada (é o controle de ocasião que o portão da rodada 75 já usa).
3. **O portão passa a exigir os dois casos.** Hoje ele refaz a conta com um arredondamento só, e
   ficaria verde com a régua nova pela metade.

### O QUE ISTO ENCOSTA, e não é desta rodada

**O servidor não conhece Centelha.** A tabela `combatentes` (`supabase/migracao-2.sql:128-142`)
tem `pv_max` e `pv_atual` e nenhuma coluna de Centelha; quem sabe a Centelha de uma peça é o
CLIENTE, pelo `RESUMO` (`src/lib/combate-resumo.ts:161`). Isso não atrapalha hoje, porque a morte
é marcada pela mão do mestre (M-21b, decisão 1) e nada no servidor precisa do limite. **Vai cobrar
resposta quando a trava da cura chegar ao RPC**, que é uma das quatro entradas e é a única que
mora no banco.

---

## M-33 · Imobilizado não é uma prisão, são quatro

Decidido em 15/09/2026. **A pergunta era "o que Imobiliza faz", e a resposta foi que a pergunta
estava mal posta:** o sistema tinha uma condição só para situações que se resolvem de maneiras
diferentes.

### O ORIGINAL, e são quatro vozes

**`src/content/chapters/armas-e-armaduras.md:52`**, o capítulo:

> **Imobiliza**, não causa dano: um acerto deixa o alvo **Imobilizado** até escapar (**Força ou
> Atletismo** vs o lançamento).

**`src/data/armas.json`**, a nota da Rede:

> Não fere: um acerto deixa o alvo Imobilizado (Defesa para prender; escapar com **Força ou
> Acrobacias** vs o lançamento).

**`src/data/tecnicas.json`**, a Técnica `imobilizar` (Agarrão do Urso, nível 1, 1 de Energia):

> prende o agarrado (**ele gasta ação para escapar**).

**`src/data/condicoes.json`**, a condição, que é quem o motor lê:

> `{"id": "imobilizado", "defesa": -4, "acao": -2, "nota": "Agarrado, preso ou amarrado.
> Praticamente sem esquiva ativa."}`

### A INCONSISTÊNCIA, e ela é quádrupla

1. **O capítulo e o dado discordam da Habilidade** para a MESMA rolagem: Atletismo contra Acrobacias.
2. **"Vs o lançamento" não nomeia número nenhum.** Não há alvo em `regras.json` nem em
   `condicoes.json`, e o total do arremesso é um número que aconteceu uma vez e ninguém guarda.
3. **A Técnica resolve a mesma situação SEM rolagem**, só gastando ação. É uma terceira regra para
   a mesma pergunta.
4. **E "Acrobacias" NÃO EXISTE.** Não está entre as 24 primárias, e a secundária que faz esse
   trabalho chama-se **Ginástica** (`src/data/habilidades-secundarias.json`, id `ginastica`), cuja descrição abre
   com *"Acrobacia: cambalhota, salto mortal, rolamento de queda, passar por um vão apertado"*. O
   dado cita uma Habilidade pelo nome errado, e ninguém percebeu porque o nome é plausível.

### A DECISÃO · quatro prisões, e cada uma sai do seu jeito

| prisão | como se sai | contra o quê |
|---|---|---|
| **Agarrado** por uma criatura | disputa, e escapar gasta a ação do preso | **Força ou Destreza + Briga** dos dois lados |
| **Amarrado** com corda | desfazer os nós, **ou cortar a corda** | **Prestidigitação** contra a **jogada de quem atou** |
| **Envolvido** por rede | sair leva tempo, e o teste é atalho | **4 Ticks** sem rolar nada, ou um teste contra **Dif 10** |
| **Preso sob peso** | tirar a coisa de cima | a **régua de carga** que o `regras.json` já publica |

**O par do agarrão segue a régua da M-14:** o Atributo é escolhido pela descrição da ação, então
quem rompe usa Força e quem escorrega usa Destreza, com a mesma Habilidade (Briga) nos dois casos.

**Duas coisas foram aplicadas como engenharia, e não decididas**, porque a régua já existe: os
**4 Ticks** da rede são a faixa utilitária da tabela de Velocidade do capítulo de Combate, e o
peso sai das cinco faixas de carga sobre o peso máximo, que o `regras.json` traz com a queda de
velocidade por `1 − (peso ÷ 3P/4)^1,5`.

**O contra comprado, dito na hora:** quatro saídas é mais regra do que uma, e a rede ganha duas
sozinha. O que torna isso defensável é que as quatro situações já existiam e eram resolvidas por
improviso na mesa; o que se ganha é que nenhuma delas prende um jogador a combate inteiro por azar
no dado, porque a de tempo fixo sempre existe.

### O QUE ISTO MANDA FAZER

1. **`condicoes.json`:** a condição `imobilizado` precisa dizer de que tipo ela é. A forma no dado
   é da Executora, com uma condição: o tipo tem de ser explícito, e não inferido do texto da nota.
2. **`regras.json`:** o bloco das quatro saídas, com as Habilidades, a Dif 10 da rede e os 4 Ticks.
3. **`armas-e-armaduras.md:52` e a nota da Rede** se reescrevem pelas quatro linhas da tabela, e
   a palavra Acrobacias sai dos dois.
4. **A Técnica `imobilizar`** passa a apontar para a regra do Agarrado em vez de publicar a
   terceira resolução.
5. **Um portão que exija que toda Habilidade citada em dado e em capítulo EXISTA na lista
   de Habilidades.** É ele que teria pego "Acrobacias" no dia em que foi escrita, e o defeito é da
   família que o `CATALOGO.md` chama de duas listas que precisam concordar.

### O QUE FICA ABERTO

**Cortar a corda** é a única saída sem número: não há regra de dano contra objeto neste sistema, e
inventar uma aqui seria escrever mecânica inteira de passagem. Fica como gesto de mesa (o mestre
diz quantos Ticks a lâmina leva) até alguém precisar de mais do que isso.

---

## M-21d · as outras duas regras órfãs, que a minha lista não tinha

Decididas em 15/09/2026. **Elas existem como entrada própria por causa de um defeito meu, e ele
está catalogado:** a M-21b decidiu sobre "as DUAS regras publicadas que a M-21 deixou sem chão",
que era o número que o relatório da Executora trazia, e o número não descreveu, **mandou**. Ele
virou a condição de parada de quem decidiu. A Revisora varreu e achou mais duas, do mesmo tipo
(regra que um jogador COMPRA, escrita em cima das duas trilhas), no `CORRIGE 2` da rodada 75.

### 1 · MÃO DE FERRO · o punho atravessa o zero

**O original:** `src/data/tecnicas.json:278`, `mao-de-ferro` (Punho de Ferro, nível 1, passiva):
*"Golpes desarmados contam como arma (sem penalidade vs armados) e podem causar dano **Letal** à
vontade."* O par mora no dado das armas, `src/data/armas.json:819`, na linha do Desarmado: *"dano
de Impacto (**Letal só com a Técnica Mão de Ferro**)"*.

**A inconsistência:** a segunda metade comprava o direito de matar com as mãos. Com "dano é
dano", o soco já mata como qualquer coisa, e metade de uma Técnica de nível 1 passou a comprar
nada.

**A decisão: os golpes desarmados de quem tem a Técnica NÃO param no zero como Impacto comum.**
Eles atravessam, como qualquer outro dano. A Técnica volta a comprar o que sempre comprou, matar
com as mãos, agora na régua nova, e passa a conversar com o `inquebrantavel` da M-21b, que diz que
o Impacto derruba e para em zero.

**O contra comprado:** uma Técnica de nível 1 vira a resposta direta a uma de nível 4, e isso é
muito poder por um nível. É também a primeira corrida de exceções deste sistema, uma comprando
contra a outra, e vale saber que ela começou aqui.

### 2 · FECHAR FERIDAS · só cai a palavra

**O original:** `src/data/tecnicas.json:1449`, `fechar-feridas` (Cerne Vital, nível 3, 3 de
Energia): *"Estanca sangramentos e cura **dano Letal leve** em minutos."* O irmão está em
`src/data/artes.json:778`, o nível 3 da Arte **CURA**, chamado "Fechar Feridas": *"**cura Letal
moderado**; suspende a dor"*.

**Correção de 15/09/2026, achada pela Executora na rodada 77 ao editar a linha:** esta entrada
dizia "a Arte **Vida** nível 3", e a linha 778 é da Arte **Cura**. O ALVO estava certo (a linha e
o texto), o NOME da Arte não · a Arte Vida nível 3 é "anima plantas para enredar" e não cura
nada. Ela editou a linha certa e não mexeu na decisão, que é o comportamento certo.

**A inconsistência:** com "cura é cura", restringir a cura a uma trilha que não existe é texto
morto dentro de um poder que custa 3 de Energia.

**A decisão: cai a palavra Letal, e o GRAU fica.** A Técnica passa a "estanca sangramentos e cura
dano leve em minutos"; o nível 3 da Arte Cura passa a "cura moderado; suspende a dor". O eixo troca
de TIPO para GRAU, que é o vocabulário que as duas já usavam ao lado (a Vida nível 2 cura "leve a
moderado").

**O contra comprado:** leve e moderado não têm número em lugar nenhum do sistema, então isto
troca uma cláusula morta por uma vaga, e a mesa segue decidindo no olho quanto cada uma cura.

### O QUE ISTO MANDA FAZER

1. `tecnicas.json`: os textos de `mao-de-ferro` e `fechar-feridas`.
2. `armas.json:819`: a linha do Desarmado perde o parêntese da trilha.
3. `artes.json:778`: o nível 3 da Arte Cura perde a palavra.
4. **E a varredura vai junto:** estas duas apareceram porque alguém varreu em vez de confiar na
   lista. Quem executar procura por conta própria antes de dar a lista por fechada.

   **A segunda metade deste item era FALSA e foi apagada em 15/09/2026, no mesmo dia em que foi
   escrita.** Ela dizia que o portão do `CORRIGE 1` da rodada 75 impediria uma quinta de aparecer
   depois. A Revisora mediu: plantou `dano Letal` numa Técnica e o portão ficou VERDE, porque ele
   vigia cinco lugares e **nenhum deles é arquivo de regra comprável** · o comentário de escopo do
   próprio portão já dizia isso, e eu afirmei o contrário sem conferir. É a forma que o
   `CATALOGO.md` chama de garantia correta sobre o eixo errado: ele protege de verdade, mas outra
   dimensão. **E a prova caiu pelos dois lados no mesmo dia:** existe uma quinta
   (`ultimo-suspiro`), e ela apareceu exatamente onde o portão não olha.

---

## A ORDEM DA FILA · básicas primeiro, Artes depois, Proezas por último

Decidido em 15/09/2026, no meio do M-40, e vale para todas as perguntas `M` que ainda não foram
à mesa.

**A razão, dita pelo humano ao ver o M-40:** as Proezas acumulam várias inconsistências com as
regras, e decidir uma a uma, intercaladas com o resto, faz a mesa julgar casos particulares antes
de a régua geral estar de pé. **Regra básica primeiro, e o caso particular depois dela.**

| ordem | bloco | o que é |
|---|---|---|
| 1 | **regras básicas** | criação, ficha, atributos, combate genérico, social, orçamento, editorial |
| 2 | **Artes** | o Arcano: conjuração, efeitos, escadas de Arte |
| 3 | **Proezas** | Caminhos, Técnicas, e tudo que um jogador compra em árvore |

**O que isso muda na prática:** o `M-39` (a `habilidade_ancora`), o `M-40` (o teto do Quebrar
Guarda), o `M-41` (as Técnicas sem número) e o `M-44` (Centelha 1 e Técnica 1) saem da fila de
agora e vão para o fim. O `M-15`, o `M-16`, o `M-34` e o `M-35` ficam no bloco das Artes, em
penúltimo. **O `M-15` está aí por decisão de classificação e não por evidência:** ele é uma
Habilidade secundária (Energia Espiritual), mas o que ele promete mexer é a reserva de Mana, então
ele é economia de magia e não de Habilidade. Se a mesa discordar, ele volta para as básicas.

### O que JÁ ficou decidido do M-40, e não espera o fim da fila

**A PRESSÃO CONTINUA SEM TETO.** `combate.escada` traz `pressaoPorAtaque: -2` e `pressaoTeto:
null`, e fica como está: ela não é modificador de situação, é a escada de estar comprometido, e
ser cercado deve doer sem limite.

**O contra comprado:** é o único número do combate que cresce indefinidamente, e transforma
quantidade na resposta para qualquer Defesa alta. Cinco capangas medianos derrubam a guarda de um
herói mais do que um chefe sozinho consegue.

**O que fica para o fim da fila, junto com as Proezas:** se o −3 do `quebrar-guarda`
(`src/data/tecnicas.json`, Punho de Ferro, nível 1) entra no teto de ±6 dos modificadores
situacionais. A inconsistência medida fica registrada aqui para não se perder: a regra do teto
(`regras.json` · `empilhamentoProezas.defesaReflexiva`) fala de **bônus** reflexivos, e só deles.
Ela nasceu para impedir que alguém empilhe defesas próprias, e não diz nada sobre **penalidade**
imposta pela Proeza de outro, que é o que o Quebrar Guarda é.

---

## M-01 · a ficha avisa os limites da criação, e não trava

Decidido em 15/09/2026. Primeiro item do bloco das **regras básicas**, pela ordem de fila
decidida hoje.

### O ORIGINAL, e os três lados dele

**`src/data/regras.json`** · `limitesCriacao`: `atributo: 5`, `habilidade: 4`, `centelha: 3`,
`picoAtributo: 6`, `picoHabilidade: 5`, `picoQuantidade: 1`.

**`src/content/chapters/criacao-de-personagem.md`**, a seção "Limites na criação":

> Atributo máximo **5**; Habilidade máxima **4**; Centelha máxima **3** (a maioria dos heróis
> começa em 1). … Cada herói pode ter **um pico**: você está autorizado a levar **um único
> Atributo a 6** e **uma única Habilidade primária a 5** já na criação: o talento superlativo que
> o define. Os demais respeitam os tetos acima.

**`src/lib/ficha-engine.ts:167`**, o comentário do `capFor`:

> Não há mais modo de Criação: o que segura a ficha é o ORÇAMENTO de XP, não uma trava por cima
> do que se pode marcar. Sobra só o teto da régua (0 a 6, ou 0 a 12 em Vontade e Aparência) e o da
> raça, que é traço da raça e não limite de criação.

### A INCONSISTÊNCIA

O dado guarda os limites, o capítulo os publica como regra, e a ficha **não os aplica**: `capFor`
devolve o teto da régua (6) e ignora o `limitesCriacao` inteiro. Um novato monta três Atributos em
6, a ficha aceita, e ele só descobre que era ilegal se outra pessoa ler a ficha.

**E o comentário registra que o modo de Criação foi REMOVIDO de propósito**, o que muda a natureza
da pergunta: travar de novo é desfazer uma decisão anterior, não consertar um esquecimento.

### A DECISÃO: a ficha AVISA e não trava

O que passa do limite de criação aparece marcado, com a regra ao lado, e continua podendo ser
marcado. A ficha não ganha modo de criação de volta.

**Por quê:** a mesma ficha serve para criar e para jogar, e o segundo uso é o mais longo dos dois.
Uma trava que não sabe quando a criação acabou atrapalha o personagem em jogo, e foi essa pergunta
(quem decide que a criação acabou) que matou o modo da primeira vez.

**O contra comprado:** aviso que não impede é aviso que se ignora, e o novato, que é exatamente
quem não sabe que aquilo importa, vai clicar por cima dele. Ficha fora da régua continua podendo
ser enviada para a mesa.

### O QUE ISTO MANDA FAZER

1. A ficha lê o `limitesCriacao` (que hoje nenhum caminho dela lê) e marca o que passa, **com a
   regra ao lado do aviso**, e não só um vermelho sem explicação.
2. O **pico** entra no aviso como o que é: UM Atributo em 6 e UMA Habilidade primária em 5. O
   segundo pico é que vira aviso, não o primeiro.
3. **O comentário do `capFor` deixa de dizer que a ficha não sabe dos limites**, porque ela passa
   a saber; o que continua verdadeiro é que ela não trava.

---

## M-21e · a quinta regra órfã: o Último Suspiro dispara na janela

Decidido em 15/09/2026. **Achada pela Revisora na rodada 76**, varrendo os doze JSONs de coisa
comprável em duas passadas, uma pelo vocabulário da trilha e outra pelo da morte. Ela é a quinta,
e apareceu exatamente onde o portão não olha, que é a outra metade do achado.

### O ORIGINAL

**`src/data/tecnicas.json`**, a Técnica `ultimo-suspiro` (Carne Teimosa, nível 5, ativa, 5 de
Energia e 1 de Vontade, exige `vontade-de-viver`):

> no **limiar da morte**, realiza uma última ação heroica plena.

### A INCONSISTÊNCIA

"O limiar da morte" era coisa definida na régua velha: o dano Letal acumulado alcançando o PV
máximo. Na régua nova existe um **limite**, mas o limiar como MOMENTO não existe mais, porque a
M-21 abriu uma **janela** entre chegar a zero e cruzar o limite. A Técnica não diz em que ponto
dela dispara, e a diferença é grande: a janela vai até metade do PV máximo.

**É literalmente a metade que a M-21b apagou do `inquebrantavel`** ("+1 ao limiar de morte"), com
uma diferença que a Revisora nomeou: lá o limiar era número a modificar, aqui é condição de
disparo.

### A DECISÃO: dispara na janela, abaixo de zero e acima do limite

A Técnica é **exceção ao estar incapacitado**: quem está na janela age uma vez, plenamente.

**O contra comprado:** a janela pode ir até metade do PV máximo, então o momento heroico acontece
com folga de sobra e longe do fio da morte, e o nome da Técnica passa a prometer mais aperto do
que a regra entrega.

**E uma exceção à ordem da fila, dita porque ela foi fixada hoje:** esta é Proeza, e Proezas vão
por último. Ela entrou agora por ser **rastro da M-21** e não inconsistência antiga de Proeza, e
o humano decidiu com a opção de guardá-la à vista.

### O QUE ISTO MANDA FAZER

1. `tecnicas.json`: o texto do `ultimo-suspiro` passa a nomear a janela em vez do limiar.
2. **Entra na mesma varredura das outras quatro**, e pelo mesmo motivo: a lista fechada por
   contagem é a que deixou a quinta de fora duas vezes.

---

## M-21f · o Sopro de Vida é a exceção nomeada da trava da cura

Decidido em 15/09/2026. **Esta entrada existe porque uma decisão minha foi tomada sobre um fato
falso, e quem achou foi a Executora na varredura da rodada 77.**

### A PREMISSA FALSA, e ela estava no contra que a mesa comprou

A **M-21b, decisão 4** fechou que passar do limite trava as quatro entradas de cura, e o contra
que eu escrevi ao lado dizia:

> fecha por código uma porta que uma Arte de ressurreição **futura** vai querer, e obriga a pensar
> nela quando ela aparecer.

**A porta não é futura.** `src/data/artes.json`, a Arte **Cura, nível 6**, chamada "Sopro de
Vida", custo 6 de Mana, publicada e comprável hoje:

> **traz o recém-morto**; expurga quase tudo

com os exemplos *"chamar de volta quem morreu há pouco"* e *"desfazer uma morte"*. A trava, como
foi decidida, **impediria a Cura 6 de fazer o que o livro diz que ela faz**, e quem comprou o
nível 6 comprou uma ressurreição.

### A DECISÃO: o Sopro de Vida é a exceção, e tem nome

A trava vale para toda cura, **menos a Arte Cura nível 6**. O livro continua verdadeiro, quem
pagou o nível 6 recebe o que comprou, e a exceção tem nome, preço alto e um dono só.

**O contra comprado:** a primeira exceção nomeada numa trava é a que ensina o sistema a ter
exceções. O motor deixa de perguntar "isto é cura?" e passa a perguntar "QUAL cura é esta?", e
essa pergunta é bem mais cara de responder em quatro entradas, uma das quais mora no servidor,
que hoje não sabe nem a Centelha da peça.

### O QUE ISTO MANDA FAZER

1. A trava da cura pelo número (rodada própria, ainda não aberta) nasce **já sabendo distinguir**
   a Arte Cura nível 6 do resto. Não é para construí-la sem a exceção e emendar depois: uma trava
   que nasce cega vai ao ar quebrando uma Arte publicada.
2. **A entrada da M-21b fica como está, com o contra errado visível, e esta entrada a corrige.**
   Reescrever o contra apagaria o registro de que a mesa decidiu com um fato errado na mão, e é
   justamente esse registro que vale.

### Nota do Arquiteto: a `imortalidade-tenue` NÃO entra agora, e a decisão é minha

A Executora chamou de sexta regra órfã a `tecnicas.json` · `imortalidade-tenue` (Cerne Vital,
nível 6): *"Volta de golpes que matariam e regenera membros; só a destruição total o mata."* **A
Revisora, na rodada 76, tinha varrido a mesma família e deliberadamente NÃO a chamou de órfã**,
junto com a `recusa-a-morte`, "para não inflar".

**As duas estão defendendo coisas diferentes e as duas têm razão numa metade.** A frase continua
lendo-se na régua nova (um golpe que mataria é o que levaria além do limite, e isso é definível),
o que dá razão à Revisora; e "só a destruição total o mata" nomeia exceção sem mecanismo, o que dá
razão à Executora. **A diferença para o `ultimo-suspiro` é que aquele perdeu o gatilho** (o limiar
deixou de existir como momento), e estas duas não perderam nada: ficaram vagas, e já eram.

Então elas seguem a régua da fila decidida hoje e vão **com as Proezas, no fim**. Fica escrito
aqui para não se perder, e para a próxima varredura não as achar como novidade.

---

## M-05 · soma 1 não passa em Fácil sozinha, e a saída é a Firula

Decidido em 15/09/2026. Bloco das **regras básicas**.

### O ORIGINAL

**`src/lib/calc.ts:18`**, o `pool`: `soma = atributo + habilidade`, `dados = floor(soma / 2)`, e
`bonus = 2` quando a soma é ímpar.

**`src/content/chapters/coracao-do-sistema.md:57`**: *"Você tem **sucesso** quando o total
**supera** o alvo."*

**`src/data/regras.json`** · `dificuldade`: `Dif 5` é **Fácil**, com altura de referência
`3 · Iniciante`.

**`src/data/glossario.json:211`**, a Firula: *"Bônus daquele lance, por descrever a ação com
criatividade e uso do cenário: **+2 fixo, +1d6 ou +2d6**. Não se compra nem se aprende."*

### A INCONSISTÊNCIA, e o defeito por baixo dela

Atributo 1 com Habilidade 0 dá soma 1, que rende **zero dados e +2 fixo**. Como o sucesso exige
SUPERAR, 2 contra Dif 5 é impossível, sempre.

**E o achado é maior que a pergunta: existe um pool que não rola dado nenhum.** Não é difícil, é
determinístico, e era a única coisa do sistema sem acaso.

### A DECISÃO: a fórmula não muda, e a Firula é a porta

**Soma 1 não passa em Fácil por conta própria, e isso fica escrito em vez de descoberto na mesa.**
O caminho de quem é muito incapaz é o mesmo que o sistema já dá a todo mundo: **descrever bem**.

Os números, conferidos contra o glossário e a escada de Dificuldade:

| o que se tem | o total | passa em Dif 5 (precisa de 6 ou mais) |
|---|---|---|
| soma 1, sem Firula | **2 fixo** | não, nunca |
| soma 1 + Firula 1 (+2 fixo) | **4 fixo** | não, nunca |
| soma 1 + Firula 2 (+1d6) | **2 + 1d6**, de 3 a 8 | **sim**, com 4 ou mais no dado |
| soma 1 + Firula 3 (+2d6) | **2 + 2d6**, de 4 a 14 | sim, com folga |

**A palavra do humano, que é a razão da escolha:** *"uma pessoa muito incapaz com uma ideia boa
ainda tem chance de passar em um teste fácil"*.

**E repare no que a Firula de nível 2 faz, porque é o que fecha o defeito de baixo:** ela devolve
o DADO a quem não tinha nenhum. O pool determinístico deixa de ser determinístico exatamente
quando a mesa premia a descrição, que é onde este sistema quer que a atenção esteja.

**O contra comprado:** um personagem continua sem poder TENTAR nada sozinho naquela faixa, e
depender da Firula é depender de o Mestre premiar. Quem tiver um Mestre avaro fica com um
personagem que não passa em tarefa fácil nenhuma, e a régua não tem outra saída para ele.

### O QUE ISTO MANDA FAZER

1. **O capítulo publica o fundo da escala**: soma 1 dá 2 fixo, não rola dado, e não supera Dif 5.
   Hoje isso se descobre jogando.
2. **E publica a saída junto**, na mesma frase, porque o número sozinho parece um beco: a Firula
   de nível 2 devolve o dado e torna o teste possível.
3. **A fórmula do `pool` não se toca.** Foi considerado um piso de um dado (`max(1, …)`) e
   recusado: ele mexeria na conta que alimenta ataque, Defesa, Habilidade e as 309 criaturas para
   resolver um caso que a Firula já resolve.

---

## M-07 · os três números que os verbetes prometiam e não tinham

Decididos em 16/09/2026. Bloco das **regras básicas**.

### 1 · A ARMADURA TIRA DADO DA FURTIVIDADE, e não ponto

**O original:** `src/data/habilidades.json`, o verbete da Furtividade: *"**Desanda com armadura
pesada**, luz na mão, companhia barulhenta e pressa."* E `src/data/armaduras.json` tem o campo
`penalidade`, graduado (leve 1, média 2, pesada 3).

**A inconsistência:** o campo existe e está ligado noutro lugar. Hoje ele alimenta o **movimento**
(`src/lib/combate-resumo.ts:180` · *"a armadura tira metade da penalidade em metros"*) e a conta do
conjunto na ficha, e **nenhum termo de Furtividade o lê**. O verbete promete um efeito que o motor
não tem.

**A decisão: a armadura tira DADO do pool de Furtividade**, e não ponto do total.

**O contra comprado, dito antes de escolher:** dado é a moeda do Desgaste (fome, sede, sono,
veneno, exaustão), e o capítulo faz questão de separar as duas moedas · *"ponto e dado nunca são a
mesma coisa nem se convertem um no outro"*. Usar dado aqui aproxima a armadura daquela família. O
que a escolha compra é o peso certo: com placa completa, furtividade deixa de ser uma chance remota
e passa a ser quase impossível, que é o que a ficção diz.

### 2 · A ESQUIVA ENCURRALADA PERDE DE −2 A −6, por escada de espaço

**O original:** o verbete da Esquiva: *"exige espaço e pés livres: **encurralado, em meio à
multidão ou preso à formação, ela vale pouco**."* Não há número em fonte nenhuma.

**A decisão: uma escada contínua por quanto espaço resta**, com as três situações do verbete como
**âncora e não como lista fechada**:

| quanto espaço resta | Defesa | as âncoras do verbete |
|---|---:|---|
| pouco | **−2** | em meio à multidão, corredor estreito |
| quase nenhum | **−4** | encurralado, parede nas costas |
| nenhum | **−6** | preso à formação, agarrado, sem pés livres |

**O contra comprado:** âncora aberta devolve ao Mestre parte da decisão que o número deveria tirar,
e duas mesas vão dar números diferentes para a mesma parede nas costas. **E há uma consequência
medida que vale escrever ao lado:** o teto dos modificadores situacionais é ±6, então um **−6
consome o teto inteiro** e nada mais pesa naquele lance · cobertura, flanco e postura deixam de
existir para quem está preso à formação.

### 3 · A SEGUNDA FIRULA DESCE UM NÍVEL

**O original:** `src/content/chapters/habilidades.md:126`: *"o preço de repeti-la é que **a segunda
vez impressiona menos que a primeira**."* A escada publicada é nível 1 = +2 fixo, nível 2 = +1d6,
nível 3 = +2d6, cada um com a reserva que devolve.

**A decisão: repetir a MESMA Firula na mesma cena vale um nível abaixo.** O 3 vira 2, o 2 vira 1, e
o 1 não vale mais nada. O desconto é do bônus e da reserva de uma vez, porque os dois moram no
mesmo degrau.

**O contra comprado:** exige lembrar qual Firula já foi usada e por quem, e "a mesma Firula" é
julgamento e não campo. É contabilidade nova no meio da cena, num sistema que passou meses tirando
contabilidade da mesa.

### O QUE ISTO MANDA FAZER

1. `armaduras.json` ganha a ligação com a Furtividade, e o verbete passa a dizer o número. **Não
   reusar o campo `penalidade` sem decidir:** ele já governa o movimento, e um campo que serve a
   duas coisas fica preso entre elas. Medir antes se a graduação é a mesma.
2. `regras.json` ganha a escada da Esquiva, com as três âncoras, e o verbete aponta para ela.
3. O capítulo publica a regra da Firula repetida junto da tabela de níveis, que é onde ela se lê.

---

## M-42 e M-43 · a palavra "Herói" fica com a Centelha, e os orçamentos esperam

Decididos em 16/09/2026. Bloco das **regras básicas**, e os dois são do mesmo assunto.

### O ORIGINAL

**`src/data/regras.json`**: `orcamentoPadrao: 1500`, `orcamentoVeterano: 2000`,
`orcamentoHeroico: 2600`. E `escalaCentelha[3]`: `{"rotulo": "Herói", "texto": "Façanhas
sobre-humanas que assombram mortais. Proezas até o nível 3."}`

**`src/content/chapters/criacao-de-personagem.md:37`**, a nota que a própria fonte escreveu:

> **Pendente.** Os orçamentos de 1500 / 2000 / 2600 foram calibrados na economia antiga, quando as
> Proezas comiam cerca de 40% do bolo. Com a curva nova elas se acumulam ao longo da campanha em
> vez de saírem da criação, e um personagem inicial típico fecha perto de **1050 XP**.

### M-42 · A INCONSISTÊNCIA E A DECISÃO · FEITO em 18/09/2026 (`2520b5d`)

A palavra "Herói" nomeia **duas coisas diferentes** e nada as desambigua: um orçamento de XP e o
degrau 3 da Centelha. Quem combina "um herói" com o Mestre não sabe qual dos dois está combinando.

**A decisão: o ORÇAMENTO troca de nome, e os três passam a ser `iniciante`, `veterano` e
`especialista`.** "Herói" fica só com a Centelha 3.

**Por quê:** "Herói" está preso numa sequência de sete degraus (Mortal, Tocado, Desperto, Herói,
Grande herói, Lendário, Semideus), e um "Grande herói" acima de um degrau que não se chamasse herói
ficaria sem sentido. Os nomes dos orçamentos são rótulos soltos e saem baratos.

**O contra comprado:** "herói" é a palavra que uma mesa usa naturalmente para dizer o tamanho do
personagem que vai criar, e tirá-la do orçamento obriga todo mundo a aprender vocabulário novo
para uma conversa que já funcionava. A mesa vai continuar dizendo "herói" de qualquer jeito.

**FEITO.** `regras.json`: as chaves de topo `orcamentoPadrao`, `orcamentoVeterano` e
`orcamentoHeroico` viraram `iniciante`, `veterano` e `especialista` (valores 1500/2000/2600
inalterados). `scripts/cost-examples.mjs`, único código que as lia, atualizado junto e conferido
rodando (`node scripts/cost-examples.mjs`, mesma saída de antes, só com o rótulo novo). O
capítulo XVIII (`criacao-de-personagem.md`) troca "herói" por "especialista" nos dois lugares que
citam os três orçamentos e no cabeçalho do exemplo do Veil ("· Herói" → "· Especialista"). O
glossário não tinha verbete nenhum para os orçamentos (conferido, não inventei um). A nota
"Pendente" de `criacao-de-personagem.md:37` (M-43) não foi tocada, como pedido: fala dos números,
não do nome.

### M-43 · A INCONSISTÊNCIA E A DECISÃO

Os três orçamentos estão declarados desatualizados **pela própria fonte**, com a medida ao lado:
2600 para um personagem que fecha perto de 1050.

**A decisão: recalibrar ESPERA**, e espera pelo mesmo motivo e no mesmo lote que o custo das raças
(`M-46`): a conta ainda se mexe. A `M-30` não foi implementada, a Vitalidade do Orc não é aplicada,
o porte mudou em duas das oito raças, e calibrar duas vezes custa o dobro e erra as duas.

**Atualização em 18/09/2026:** dois dos três motivos caíram. `M-30` foi implementada (o campo
`bonusCondicional` em `racas.json`, os dez traços migrados, a Vitalidade somando PV de verdade); o
porte já tinha mudado nas duas raças antes disso. **A espera em si não muda**: ainda falta
recalibrar os números, e isso continua sendo decisão de mesa, não consequência automática da
implementação. Só a razão de esperar ficou mais curta.

**O contra comprado:** enquanto espera, o livro publica três números que ele mesmo chama de
pendentes, na primeira página que o novato abre. É a terceira regra auto-declarada provisória, e o
relato do jogador novo reclamou exatamente disso.

**O gatilho, escrito para não depender de lembrança:** recalibrar quando a fila `M` fechar, junto
com o custo das raças e com as idades, que já esperam ali.

### O QUE ISTO MANDA FAZER

1. `regras.json`: a chave `orcamentoHeroico` passa a se chamar pelo nome novo, e as outras duas
   acompanham a nomenclatura. **Cuidado de quem executar:** chave de dado renomeada quebra quem a
   lê, e o `cost-examples.mjs` lê as três.
2. O capítulo XVIII e o glossário trocam a palavra nos três rótulos.
3. **A nota "Pendente" do `:37` FICA**, e ganha o gatilho escrito: ela sai quando a fila `M`
   fechar, e não antes.

---

## M-21g · o Reiniciar da cena é porta legítima, e a trava não o alcança

Decidido em 16/09/2026, **pelo Arquiteto e não pela mesa**, e escrito aqui para o humano derrubar
se discordar. **Achado pela Revisora na rodada 79**, respondendo à pergunta que o aviso fez
(existe uma quinta porta de cura?).

### O ORIGINAL

**`src/pages/mesa/combate.astro:2171`**, dentro do botão **Reiniciar**, com a caixa "zerar PV" marcada:

```
if (zPv && c.pv_max != null) { cols.pv_atual = c.pv_max; ... }
```

Ele escreve `pv_atual = pv_max` **direto**, sem passar por `mexerVida` nem por `curarPv`, para
**todas as peças da cena de uma vez**. Com a Vida em −20, a peça volta viva e cheia. É o único
caminho que ressuscita em lote.

### A DECISÃO: é legítimo, e pelo mesmo argumento que deixou o desfazer de fora

O Reiniciar **não cura: recomeça a cena.** Ele vem com as caixas de zerar Tick, zerar condições e
trazer de volta quem estava fora de combate (`cols.ativo = true`, na mesma passagem), e nenhuma
delas é gesto de jogo · são o gesto de montar a cena de novo. Travar ali tiraria do mestre a única
forma de reusar um encontro, e a peça morta ficaria morta num combate que não aconteceu mais.

**O que NÃO pode ficar, e é o achado:** ele não existir em texto nenhum, enquanto o texto ao lado
afirma que as portas de interface estão fechadas. O desfazer ganhou um parágrafo dizendo por que
fica fora; o Reiniciar não tem menção nenhuma. **Uma porta sem placa é uma porta esquecida**, e
quem ler a afirmação de que as portas estão fechadas vai acreditar nela.

**O contra comprado:** um mestre que clique em Reiniciar por engano, com "zerar PV" marcado,
desfaz uma morte sem ver aviso nenhum. O botão é destrutivo nos dois sentidos e sempre foi.

**E a sexta, que a Revisora registrou e que NÃO é achado:** o formulário de editar a peça está
aberto de propósito, e a própria mensagem de erro da trava o indica como saída. **Porta com placa
não é porta esquecida.**

### A PREMISSA DESTA DECISÃO CAIU NO DIA SEGUINTE, e a decisão volta para a mesa

**Achado pela Revisora na rodada 81, poucas horas depois.** O argumento acima diz que o Reiniciar
"vem com" zerar Tick, zerar condições e `ativo = true` **na mesma passagem**, e é disso que ele
tira a conclusão de que aquilo é recomeço de cena e não cura. **São seis caixas INDEPENDENTES**
(`src/pages/mesa/combate.astro:257-262`), **cinco marcadas por padrão** (a sexta, "apagar o
registro", nasce desmarcada), e lidas cada uma no seu próprio `if`.

**Desmarcando as outras cinco e deixando só "restaurar a Vida ao máximo", o clique devolve a Vida
cheia de todo mundo, mortos inclusive, e a ENERGIA junto** · que está escrita na mesma linha
(`combate.astro:2188`), sem caixa própria para desligar, e é o único vizinho obrigatório daquela
escrita. Fora isso, não zera relógio, não limpa condição e não devolve ninguém. Não há recomeço de
cena nenhum: é **cura em massa**, e o rótulo da caixa a chama assim.

**Esta correção é de 16/09/2026 e é a QUARTA tentativa da mesma frase.** A Revisora tinha absolvido
esta ocorrência na rodada 82 por ler a linha que o `grep` devolveu e não a frase que o documento
tem: o "marcadas por padrão" mora na linha SEGUINTE. Eu repeti a absolvição dela sem conferir, e
corrigi o dossiê publicado achando que era o mesmo texto. **O gesto que fecha isto é varrer a
FRASE no repositório inteiro depois de corrigir, e não a lista de lugares que alguém escreveu** ·
é a mesma diferença entre varrer pela escrita e varrer pelo nome.

**O que sobra de pé:** a decisão vale para o clique com o pacote inteiro, que é o padrão da tela. O
que ela não faz é distinguir os dois casos, e a placa escrita na rodada 81 descreve a decisão em
vez de descrever o que o clique é obrigado a fazer.

**E o erro foi das duas pontas, e ela disse isso primeiro:** na rodada 79 ela escreveu que ia
"medir o que viaja junto no mesmo update" e aceitou o pacote sem abrir o diálogo; eu decidi em cima
disso sem conferir o diálogo também. **A pergunta certa não é "o que mais viaja neste write", é "o
que mais viaja NECESSARIAMENTE nele": vizinho dentro de um `if` próprio é vizinho opcional.** A
forma nova do `CATALOGO.md` ganhou essa segunda linha.

**A pergunta que volta para a mesa**, e está no dossiê: um botão de mestre pode desfazer uma morte
quando é usado só para isso? As duas leituras honestas são "o Reiniciar é mobília da mesa e não
gesto de jogo, então vale inteiro" e "a caixa da Vida sozinha é cura e respeita o limite".

### O QUE ISTO MANDAVA FAZER, e o que sobrou

1. O Reiniciar ganha o parágrafo, do mesmo tamanho e no mesmo lugar que o do desfazer. **FEITO na
   rodada 81, e o texto dele precisa ser refeito pela decisão nova**, porque hoje ele afirma a
   premissa que caiu.
2. **O recorte da varredura muda, e essa é a lição maior que o item.** A Revisora varreu *todo
   ponto que ESCREVE `pv_atual`*, e não "as entradas de cura" · e é essa diferença que fez a
   quarta porta aparecer para a Executora, porque **ela não se chamava cura em lugar nenhum: era
   o "+" de uma barra**. Varredura de comportamento se faz pela ESCRITA, não pelo nome.

---

## As 19 do dossiê · sessão de conversa em 16/09/2026, execução adiada

**Nenhum destes itens foi implementado nesta sessão.** O humano pediu para discutir e registrar
as respostas, e disse explicitamente para só executar amanhã, depois do reset semanal (quinta
17/09, 18h) · a sessão estava em 93% de uso, com teto combinado em 95%. Cada entrada abaixo é a
resposta à pergunta com o mesmo código do dossiê (`https://claude.ai/artifact/2H8aDMgNmU7A6hP5wo26s4`),
na ordem em que a mesa já tinha fixado (básicas · Artes · Proezas).

### M-21h · o Reiniciar do mestre e a morte · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`2492336`)

A pergunta estava em aberto neste mesmo arquivo, acima (rodada 81, premissa caída na 83): um
clique de mestre pode desfazer morte? **Decisão: a caixa da Vida sozinha avisa, e o mestre
confirma.** Mesmo desenho do Sopro de Vida (M-21 antiga): a porta existe, é deliberada, ninguém a
atravessa sem ver. Descarta as outras duas leituras ("vale inteiro, é mobília" e "só a caixa da
Vida respeita o limite sem aviso").

**O que isto manda fazer:** em `src/pages/mesa/combate.astro`, a caixa "restaurar a Vida ao
máximo" (linhas 257-262 e a escrita em 2171/2188) ganha uma confirmação antes de aplicar quando
ela for a única marcada (ou quando o clique alcançar alguém abaixo do limite de morte) — mesmo
padrão de diálogo do Sopro de Vida. Reescrever o parágrafo da rodada 81 que descreve a premissa
caída.

### M-09 · tempo de um passo de Relação por povo · DECIDIDO em 17/09/2026 · FEITO em 17/09/2026 (`40c48c1`)

**O original:** `relacoes-sociais.md:185`, o intervalo-base de uma Firula de cortejo "escala com a
longevidade da raça (um elfo corteja em estações onde um humano leva semanas)", na escada de seis
degraus do capítulo de Ações (Tick · minuto · hora · dia · semana · estação). Não existe conversão
em fonte nenhuma.

**A decisão: tabela de quatro faixas, pelos números de vida que `racas.json` já descreve em
prosa.** Vida curta (orc, meio-orc · ~60 anos): um degrau mais rápido que o padrão. Padrão
(humano, meio-elfo): sem ajuste. Vida longa (anão, gnomo, halfling · 300-400 anos): um degrau mais
lento. Vida muito longa (elfo · 600+ anos): dois degraus mais lento — é a faixa que o próprio
exemplo do capítulo já usa ("estações" em vez de "semanas").

**O contra comprado:** quatro faixas por longevidade é mais regra nova do que a frase original
prometia (ela só dava um exemplo, o elfo); a alternativa de duas faixas era mais simples de
lembrar, mas perdia a distinção que o texto publicado já assume.

**O que isto manda fazer:** `racas.json` ganha um campo de faixa de longevidade por raça (ou o
Arquiteto decide reaproveitar o texto de `descricao` por parsing, o que for mais simples e não
duplicar a fonte); `regras.json`, bloco da escada de Ações/Firula, ganha o deslocamento de degrau
por faixa; `relacoes-sociais.md:185` aponta para a régua em vez de só dar um exemplo solto.

**FEITO.** Escolhido o campo explícito (não parsing de prosa, que seria frágil e ainda duplicaria
a lógica de bucket em código): `racas.json` ganha `longevidade` em cada raça (`curta` para orc e
meio-orc, `padrao` para humano e meio-elfo, `longa` para anão/gnomo/halfling, `muito-longa` para
elfo). `regras.json` ganha o bloco `acoes` novo (não existia nenhum bloco de escada de Ações
codificado antes): `acoes.escalaIntervalo` nomeia os seis degraus, e
`acoes.longevidadeFirula.porFaixa` dá o deslocamento de cada faixa (+1/0/−1/−2). O deslocamento é
relativo ao intervalo que a mesa já escolheu para a cena, não um degrau absoluto: a régua vale
para deslocar, não para fixar um degrau único por raça. `relacoes-sociais.md:185` nomeia as
quatro faixas em vez de só o exemplo do elfo.

### M-17 · teto de Habilidades secundárias compradas · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`e4fe156`)

**Sem teto de quantidade, e isso passa a estar escrito.** É o que o motor já faz hoje; o
orçamento de XP é a trava real (cada secundária é uma primária que não subiu). Não vira teto
ligado à primária-mãe, nem teto fixo na criação.

**O que isto manda fazer:** `src/content/chapters/` (o capítulo de Habilidades secundárias) ganha
a frase afirmando que não há teto de quantidade, só o orçamento de XP.

### M-18 · Canalizar Virtude: teto ou contrapartida · DECIDIDO em 16/09/2026

**Não fica sem custo, mas o custo não é Vontade nem esvazia a Virtude.** Desenho novo, inspirado
em Exalted 2e mas diferente dele: cada Virtude guarda **uma carga binária** de Canalizar
(carregada ou gasta), independente da Vontade. Gastar a carga soma o valor da Virtude à rolagem,
como o texto publicado já diz. **A Virtude em si nunca diminui** — só a carga fica marcada como
gasta. **Recarregar exige agir de acordo com aquela Virtude um número de vezes igual ao nível
dela** (Virtude 3 pede três ações coerentes com ela para recarregar); o que conta como ação
válida fica a critério do Mestre, caso a caso. Não é banal: com Virtude baixa a carga recarrega
rápido, com Virtude alta ela é mais rara de usar mas também mais rara de recarregar.

**O que isto manda fazer:** é regra nova de verdade, não conserto de texto. `regras.json` ganha
um bloco de Canalizar com o estado de carga por Virtude (provavelmente por personagem, não global);
a ficha precisa de um indicador visual de carregada/gasta por Virtude; `aparencia-virtudes-vontade.md:69`
perde o parêntese "sem risco nem contrapartida" e ganha a descrição do ciclo de carga/recarga.
Maior que os outros itens desta lista — vale abrir como item de fase própria, não como C/M pontual.

### M-20 · Compostura mascarando a Aparência · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`903c99d`)

**A Compostura mascara os dois lados do modificador de Aparência (bônus e penalidade), sob
controle ativo do jogador, quando ele quiser.** Não é passiva: um personagem muito belo ou muito
feio que queira passar despercebido numa multidão rola **Compostura + Furtividade** (isso é além
de disfarce, maquiagem ou máscara física, que continuam valendo à parte). **Cada ponto de
Compostura mascara um ponto do módulo do modificador de Aparência**, positivo ou negativo.

**O que isto manda fazer:** `aparenciaMod(nivel)` em `calc.ts` ganha um caminho onde, sob teste de
Compostura+Furtividade bem-sucedido, o módulo aplicado se reduz em até `Compostura` pontos (piso
zero). `aparencia-virtudes-vontade.md:16` ganha a frase com o par de rolagem e a regra do ponto a
ponto.

### M-23 · o que a Margem entrega fora do combate · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`83dcadd`)

**Tabela de conversão por eixo.** Cada Margem vale um degrau numa lista curta (tempo, qualidade,
duração), e o Mestre escolhe o eixo pela ação. Fica para a mesma rodada escrever a tabela — não
está redigida ainda, só a forma foi escolhida.

**O que isto manda fazer:** escrever a tabela (três eixos, degraus fixos por Margem) e conferir
contra a escada de tempo do capítulo de Ações, que já existe e não pode discordar.

### M-27 · Esforço do Fôlego vs. Rajada · SUSPENSO

**Não decidir nada sobre Fôlego agora.** É um módulo opcional (adendo) e continua fora de uso até
o humano decidir abri-lo. Diferente de "depois do reset": não tem previsão, não entra na fila.

### M-36 · quantos passos para sair do Neutro · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`976afa8`)

**A banda é 3, e o exemplo do Lírio se corrige** (ele soma 4 hoje). A regra escrita vence; o
exemplo tem erro de conta.

**O que isto manda fazer:** `relacoes-sociais.md:107`, o exemplo do Lírio, ajusta a soma dos atos
para fechar em 3 pontos até romper o Neutro (cortar um dos atos, ou reduzir o valor de um deles).

### M-38 · teste coletivo, "+2 por pessoa" conta quem rola? · DECIDIDO em 16/09/2026, com regra nova · FEITO em 17/09/2026 (`83dcadd`)

**A pergunta original ficou pequena diante da resposta: existem TRÊS tipos de teste com várias
pessoas, e o livro só nomeia um deles direito.** O humano escreveu a mecânica completa dos três,
e ela substitui o parágrafo de `acoes-e-sistema.md:158`:

1. **Trabalho em Grupo** · tarefas em que cada pessoa extra é trabalho extra completo (cavar um
   buraco, por exemplo). Cada um faz o próprio teste, e os resultados somam além da Dificuldade.
2. **Ajudante** · servir de auxiliar numa tarefa que outra pessoa realiza (ajudar uma cirurgia,
   forjar, dar aula). O ajudante rola contra **metade da Dificuldade** (arredondado para cima); a
   cada 6 pontos acima disso, concede **+1** à jogada de quem está realizando a tarefa. Em jogada
   estendida, pode-se usar a média das jogadas do ajudante. Há um limite de ajudantes por tarefa,
   a critério do Mestre.
3. **Teste Coletivo** · um grupo inteiro precisa passar numa tarefa que é responsabilidade de
   todos (caça em grupo, deslocamento furtivo coletivo, apresentação de dança). Quem rola é a
   pessoa com a **menor parada de dados** (empate: menor Habilidade; empate de novo: qualquer
   uma). **A Dificuldade sobe +2 por participante** (aqui a pergunta original se resolve: conta
   TODOS os participantes, inclusive quem rola). Um líder é eleito e faz uma jogada própria: a
   cada 6 pontos acima da Dificuldade, ele concede **+1d6** a quem tem a menor parada. **Penalidade
   de cada participante entra na jogada final**: −1 físico de um dançarino e −2 de armadura de dois
   furtivos somam −4 na jogada coletiva.

**O que isto manda fazer:** reescrever `acoes-e-sistema.md:158` como três subseções nomeadas em
vez de um parágrafo só, com as três réguas acima. É trabalho de capítulo, não de uma frase — entra
na mesma categoria dos itens "Preparo/Golpe/Recuperação" do prompt de entrega da Executora.

### M-45 · por onde o novato entra no livro · NÃO É INCONSISTÊNCIA, deixa como está

**Decisão: não mexer agora.** A capa já mostra "Começar a Ler" (primeiro capítulo) e "Criar
Personagem" (ficha) logo no topo — as duas coisas que um novato precisa ver, mesmo sem saber o que
é Centelha ainda. Não é ausência de caminho. Fica anotado como possível remodelação futura, fora
desta lista: repensar se "Explorar Proezas" precisa estar citado na capa, e o que fazer com "50
Proezas · 461 Técnicas · 24 Artes" logo abaixo — mas isso é preferência de capa, não conserto.

### M-46 · custo de raça e idades divergentes · PARCIALMENTE DECIDIDO em 17/09/2026 · a parte das idades FEITA em 17/09/2026 (`1a15cd0`)

**A recalibração do custo de raça continua esperando** a fila `M` fechar, junto do orçamento
(`M-43`) — isso não mudou.

**Atualização em 18/09/2026, mesma nota do M-43:** dois dos três motivos de espera caíram
(`M-30` implementada, o porte já tinha mudado antes). A espera do custo em si continua de pé,
por decisão de mesa, não porque falte mecânica agora.

**As idades, separadas do custo, DECIDIDO agora: corrigir as duas divergências conhecidas hoje,
sem esperar a recalibração inteira.** Gnomo: a prosa de abertura diz 20 anos de maturidade, a
tabela (`racas.md:129`, coluna Adulto) diz 18. Halfling: prosa 18, tabela 16. As outras quatro
raças já batem. **Por quê separar de M-43:** é correção de cópias que já discordam entre si (fato
sobre o texto), não recálculo de número que depende de mecânica ainda não implementada (fato sobre
o motor) — os dois preços são diferentes e não precisam esperar juntos.

**O que isto manda fazer:** decidir qual das duas cópias diverge do `racas.json` (a fonte real de
`descricao`) e ajustar a outra para bater — Gnomo e Halfling, nos três lugares que M-46 já mediu
(`racas.json`, a prosa de abertura da seção em `racas.md`, e a tabela resumo de `racas.md:129`/34).

**Reaberto em 18/09/2026, e é revisão de lore nova, não erro do conserto de 17/09.** O humano
revisou as idades de várias raças na mesma sessão em que pediu a Régua de Relação completa e
mudou de ideia sobre o Halfling: maturidade volta de 16 para **18**, e a vida máxima desce de
"mais de 300 anos" para "por volta de **200 anos**" (`racas.md` e `racas.json → descricao`, os
dois ajustados). O Gnomo também mudou de novo, mas só a vida máxima: de "mais de 400" para
"mais de **300 anos**" (a maturidade de 18 não mexeu). Nenhuma das duas mudanças toca
`longevidade` (M-09): as duas continuam `"longa"`, e o humano concordou que 200 anos do Halfling
ainda cabe nessa faixa, bem acima do padrão humano (~80).

**FEITO.** `racas.json` não tinha divergência nenhuma para resolver: o campo `descricao` só cita
o teto de vida (400+/300+ anos), que já batia dos dois lados. A divergência real era só entre a
prosa de abertura e a tabela "Envelhecimento" (`racas.md:129-134`). Escolhida a tabela como fonte
(é a estrutural, com as quatro colunas de marco por raça, comparável lado a lado com as outras
seis): a prosa do Gnomo passou de "20 anos" para **18**, a do Halfling de "18" para **16**,
batendo com a coluna Adulto da tabela nos dois casos.

### M-15 · o que a Habilidade Energia Espiritual faz · PENDÊNCIA, com direção provável

**Não fechado — vira pendência explícita**, mas com uma pista do humano: **provavelmente aumenta
a taxa de recuperação de Mana**, e há a possibilidade de o efeito passar a valer para recuperar
"Energia" em vez de Mana, caso esse recurso mude de nome/forma mais adiante. Não decidir a
fórmula agora; registrar a pista para quando a pergunta voltar à mesa.

### M-16 · Acerto Arcano é obrigatório para conjurar · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`e4fe156`)

**Não é obrigatória, e o verbete baixa o tom.** Nenhuma mecânica muda: `acerto-arcano` continua
uma secundária comum, sem marca. A frase do verbete passa a nomear que ela pesa só nos efeitos
MIRADOS (que já rolam Percepção + Acerto Arcano pela `M-10`), sem prometer que é obrigatória para
conjurar de modo geral.

**O que isto manda fazer:** `habilidades-secundarias.json · acerto-arcano` perde a frase "sem ela
o feitiço mais devastador do mundo passa a um palmo do inimigo" e ganha uma que nomeia os efeitos
mirados como o caso em que ela pesa.

### M-34 · escapar de efeito "vs o nível" · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`f76b00f`)

**O nível vira Dificuldade pela régua que já existe: nível × 5.** Arte nível 2 prende em Dif 10,
nível 6 em Dif 30 ("Sobre-humano" na tabela publicada) — decisão de poder assumida conscientemente,
não só conversão.

**O que isto manda fazer:** `regras.json · arcano`, tabela de resistências — "Força ou Atletismo
vs o nível efetivo do efeito" ganha a fórmula `nível × 5` como a Dificuldade a bater.

### M-35 · Metal Incandescente, escala e penalidade · DECIDIDO em 16/09/2026, redesenho completo · FEITO em 17/09/2026 (`743cdb1`)

**O Efeito é redesenhado, não só corrigido.** Novos números, substituindo a escala de sete casas
e a penalidade sem unidade:

- **Dano:** 1d6, fixo (não escala mais por Mana investida);
- **Duração:** 6 Ticks por ponto (de Mana investido, presumivelmente — confirmar com o humano se
  a unidade de investimento mudar antes de escrever);
- **Penalidade:** 1d6 para ações físicas enquanto o alvo estiver tocando o metal incandescente.

**O que isto manda fazer:** `efeitos.json · metal-incandescente` troca a escala `Dano` inteira
(`["—","—","1d6","1d6","2d6","2d6","3d6"]`) pelos três campos acima. Como muda a forma do Efeito
(de escala por nível para fixo + duração + penalidade separada), confirmar com o humano antes de
escrever se algum outro Efeito usa o mesmo molde e merece o mesmo tratamento, ou se este é
único.

### M-39 · a Habilidade âncora de um Caminho · DECIDIDO em 16/09/2026, não mexe

**É sabor, e já está certo como está.** O humano notou, ao reler o item: nem toda
`habilidade_ancora` é a única Habilidade com que a Proeza pode ser usada — algumas são, outras
não. Como o campo só é exibido na página do Caminho (não tem efeito mecânico e não promete ter),
não precisa de conserto de texto nem de mecânica nova.

### M-40 · o −3 de Quebrar Guarda e o teto de ±6 · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`f76b00f`)

**Fica fora do teto de ±6, como a Pressão.** Quem paga a Técnica sempre vê o efeito; casa com a
decisão já tomada para a Pressão em 15/09 (penalidade de Defesa sem teto).

**O que isto manda fazer:** `regras.json · empilhamentoProezas.defesaReflexiva` ganha a exceção
nomeada (Quebrar Guarda, e qualquer penalidade IMPOSTA por Proeza de outro, por analogia com a
Pressão) fora do cálculo do teto de ±6.

### M-41 · Técnicas com efeito sem número · ADIADO, com direção CONFIRMADA em 17/09/2026

**Não corrigir agora.** Vira item de revisão geral: revisar as Proezas para achar todas as
descrições vagas e padronizá-las como as Artes já estão hoje (com número em cada efeito). Não é
conserto pontual do Soco Trovejante e da Investida Devastadora — é levantamento novo, parecido em
escopo com a leitura que gerou esta lista inteira. **Confirmado em 17/09/2026: a revisão das
Proezas ainda vai acontecer, e quando acontecer inclui esta padronização** — não é decisão
esquecida, é decisão que espera o mesmo levantamento maior.

### M-44 · Centelha 1 tranca a Técnica no nível 1 · DECIDIDO em 16/09/2026 · FEITO em 17/09/2026 (`f76b00f`)

**É de propósito, e passa a estar escrito.** A Centelha é o eixo de história do sistema; amarrar
profundidade de Técnica a ela é o desenho pretendido, não acidente. Dizer isso em voz alta evita
a frustração de um jogador descobrir sozinho que o XP parou de comprar profundidade.

**O que isto manda fazer:** `regras.json · xp.tecnica` ganha a frase afirmando que o portão
`Centelha ≥ N` é intencional, e o motivo (a Centelha é concedida pelo Mestre em marco de história,
de propósito, e não se compra com XP).
