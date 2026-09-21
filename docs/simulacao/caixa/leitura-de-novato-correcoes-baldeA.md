# Balde A: correções mecânicas (alinhamento, sem decisão nova)

Numeração conforme `docs/simulacao/caixa/leitura-de-novato-capitulos.md`. Para cada item:
trecho original com arquivo:linha, o problema em uma frase, e o texto novo proposto.
Nenhum arquivo do repositório foi editado; isto é rascunho para colar depois.

---

### 1. Longevidade do Meio-Orc

**Original:**
- `src/content/chapters/racas.md:106` (prosa): "vida curta, pouco mais de **70 anos**"
- `src/content/chapters/racas.md:146` (tabela de Envelhecimento, linha Meio-Orc): Venerável **70**
- `src/data/racas.json` (verbete Meio-Orc, `descricao`): "Vida curta, cerca de **60 anos**"

**Problema:** o JSON repete o número do Orc puro (também 60) na descrição do Meio-Orc, enquanto
o próprio capítulo se autoconfirma duas vezes (prosa e tabela) em 70.

**Correção proposta** (em `src/data/racas.json`, verbete `meio-orc`, campo `descricao`):

> "Filhos de humano e orc: a força e o porte da herança orc temperados pelo sangue humano.
> Robustos e brutos, mas menos bestiais que um orc puro (que vive na lore como criatura, não
> como raça jogável). Vida curta, pouco mais de 70 anos."

(Só a cláusula final muda: "cerca de 60 anos" → "pouco mais de 70 anos", copiando a frase que
`racas.md:106` já usa, para bater com a tabela de Envelhecimento do mesmo arquivo.)

---

### 4. Antecedentes: regra geral do desconto de passos vs. verbete de Contatos

**Original:**
- `src/content/chapters/antecedentes.md:71-77` (regra geral): "...o nível do traço tira esse
  tanto dos três passos... com 3 ou mais a relação já começa em +1 (Simpatia)."
- `src/content/chapters/antecedentes.md:136` (verbete Contatos, "Amarra com"): "a Régua
  (contatos ficam em Simpatia, +1: ajudam barato, não se sacrificam)"

**Problema:** o verbete de Contatos afirma Simpatia +1 sem condicionar ao nível do traço,
contradizendo a regra geral (que só chega a +1 Simpatia com nível 3 ou mais) explicada duas
seções antes, no mesmo capítulo.

**Correção proposta** (`antecedentes.md:136`, linha "Amarra com" do verbete Contatos):

> "**Amarra com:** a Régua (o nível desconta passos do Neutro rumo à Simpatia, como em todo
> Antecedente-pessoa; com 3 ou mais, já começa em +1 Simpatia): ajuda barata, não se sacrifica;
> alimenta investigação, boatos e a arma social "Rumor/Fofoca"."

---

### 5. "Perícia Cura"

**Original:** `src/content/chapters/vida-ferimentos-cura.md:88`: "A **perícia Cura** e a magia
aceleram a recuperação."

**Problema:** único uso de "perícia" nos 23 capítulos; o termo do sistema, usado em todo o
resto do livro e em `regras.json`, é **Habilidade**.

**Correção proposta:**

> "A **Habilidade Cura** e a magia aceleram a recuperação."

---

### 6. Defesa Social de feras (Inteligência 1)

**Original:**
- `src/content/chapters/defesas.md:75`: "Em **feras** (bichos de instinto, Inteligência 1)
  troca-se **Sociabilidade por Sobrevivência**: um animal não tem trato social, mas sente o
  perigo."
- `src/content/chapters/defesas.md` (tabela "Quem tem cada muralha"), linha Inteligência 1:
  Social = "-" (imune)
- `src/data/regras.json` (nota interna): "Feras (Int 1) trocariam Sociabilidade por
  Sobrevivência, mas no bestiário Social vale só p/ Int 2+."

**Problema:** a prosa do próprio capítulo descreve uma regra (fera tem Defesa Social via
Sobrevivência) que a tabela do mesmo capítulo, e o dado, já revogaram: Inteligência 1 é imune
("-") a ataques Sociais.

**Correção proposta** (substituir o parágrafo de `defesas.md:75`):

> "Feras (bichos de instinto, Inteligência 1) **não têm Defesa Social**: um animal não lê
> intenção nem se deixa convencer no sentido social do termo, então o ataque simplesmente não
> funciona nele (ver "Quem tem cada muralha", abaixo). O que uma fera sente é perigo, e isso é
> **Sobrevivência**, coberto pela Régua Comum, não pela Defesa Social."

---

### 7. Bloqueio no fluxograma de `qual-sistema.md`

**Original:** `src/content/chapters/qual-sistema.md:87` (nó do fluxograma):
`DB["Bloqueio = (Destreza + Habilidade que você escolher) x2 + Centelha + Esp. + defesa da
arma/escudo"]`

**Problema:** `defesas.md:69` e `habilidades.json` (id único `bloqueio`) deixam claro que
Bloqueio é uma Habilidade única, não uma escolha livre. O mapa de bolso ensina uma regra
errada sobre o próprio sistema que resume.

**Correção proposta** (linha do fluxograma):

> `DB["Bloqueio = (Destreza + Bloqueio) x2 + Centelha + Esp. + defesa da arma/escudo"]`

---

### 9. Nota desatualizada em `regras.json` sobre a classe de Quase-Acerto

**Original:** `src/data/regras.json:1140` (nota do bloco de Quase-Acerto): "Valores FIXOS por
classe: a classe da arma sai do dado (1d6 leve, 2d6 média, 3d6 pesada)."

**Problema:** a mesma base de dados já documenta, em outra nota (`regras.json:1102`), que essa
regra foi **substituída em 24/08/2026** pela regra do dano médio, exatamente pelo motivo que
`quase-acerto.md:30,46` explica no capítulo. A nota da linha 1140 é sobra da regra antiga, não
atualizada quando a 1102 foi escrita.

**Correção proposta** (`regras.json:1140`, primeira frase da nota):

> "Errar por ≤ margem é um raspão (não passa pela Absorção normal). Valores FIXOS por classe: a
> classe da arma sai do **dano médio** (dado × 3,5 + danoBonus; ver nota do campo `classe` em
> Quase-Acerto). A armadura SOMA seu Bônus QA à margem..." (resto da nota inalterado)

---

### 14. Tabela de Amortecer não bate com a tabela de Dano de Queda

**Original:**
- `src/content/chapters/acoes-corpo-e-movimento.md` (tabela de Dano de Queda): 3 m → 7,
  5 m → 11, 10 m → 22, 20 m → 43, 40 m → 81
- `src/content/chapters/acoes-corpo-e-movimento.md:119-126` (tabela de Amortecer): nas mesmas
  alturas efetivas, os valores saem em 6, 10, 20, 40 e 75, respectivamente.

**Problema:** as duas tabelas do mesmo capítulo deveriam concordar exatamente nas alturas
efetivas que coincidem com uma linha da tabela-base, e divergem sistematicamente por um
pequeno desconto (a tabela de Amortecer usa a "regra de bolso" ×2,2, não os valores exatos da
tabela-base).

**Correção proposta:** recalcular a linha "Amortecer" a partir da tabela-base (fonte de
verdade), célula a célula:

| Altura | Sem jogada | Sucesso | Uma Margem | Duas Margens |
|:--:|:--:|:--:|:--:|:--:|
| 7 m | 16 | 7 | **0** | 0 |
| 10 m | 22 | 13 | 7 | **0** |
| 15 m | 33 | 24 | 17 | 11 |
| 20 m | 43 | 34 | 27 | 22 |
| 30 m | 63 | 54 | 47 | 43 |
| 50 m | 98 | 89 | 82 | 81 |

(Só as colunas "Uma Margem" e "Duas Margens" mudam nas linhas 10 m, 15 m, 20 m, 30 m e 50 m,
puxando os valores da tabela de Dano de Queda em vez da aproximação ×2,2. A linha 7 m já batia
e fica igual.)

---

### 16. Faixa de dano de distância/arremesso

**Original:** `src/content/chapters/combate.md:180`: "distância/arremesso 1d6 a 1d6+2"

**Problema:** o catálogo real (`src/data/armas.json`) tem `danoBonus` de −2 (adaga de
arremesso) a +8 (besta grande), bem fora da faixa citada.

**Correção proposta** (mesma frase, ajustando só o parêntese de distância/arremesso):

> "...distância/arremesso varia por arma (de 1d6−2 a 1d6+8, ver o catálogo de [Armas &
> Armaduras](/regras/armas-e-armaduras) para o bônus exato de cada uma))."

---

### 17. Alabarda na linha de Velocidade errada

**Original:** `src/content/chapters/combate.md` (tabela de Velocidade de Ataque), linha "7 |
Ataque pesado | martelo de guerra, montante, **alabarda**"

**Problema:** `src/data/armas.json` (`alabarda.ticks: 6`) coloca a Alabarda na Velocidade 6,
não 7.

**Correção proposta:**

> "| 6 | Ataque médio | espada longa, machado de uma mão, lança, **alabarda** |"
> "| 7 | Ataque pesado | martelo de guerra, montante |"

(Remove "alabarda" da linha de 7 Ticks e acrescenta à de 6 Ticks, junto da Lança, que é a outra
arma de classe Haste do catálogo.)

---

### 18. Descarte de dado da Especialidade: "o menor" vs "os N menores"

**Original:**
- `src/content/chapters/coracao-do-sistema.md:88`: "...ela rende **+1d6 por nível,
  descartando o menor** do pool."
- `src/content/chapters/habilidades.md:93`: "...para cada nível com aquele nome role **+1d6 e
  descarte o menor** dado do pool."
- `src/content/chapters/combate.md:123`: "...ela rende **+N dados, descartando os N
  menores**, onde N é o nível."

**Problema:** três capítulos descrevem a mesma mecânica com quantificador diferente
("o menor", singular, contra "os N menores", plural); o `glossario.json` já concilia lendo a
operação como repetida por nível, mas nenhum dos capítulos aponta essa reconciliação.

**Correção proposta** (alinhar as duas ocorrências em singular à forma mais precisa de
`combate.md`, que já nomeia N):

- `coracao-do-sistema.md:88`: "...ela rende **+1d6 por nível, descartando um dado do pool a
  cada nível (o total: +N dados, descartando os N menores)**."
- `habilidades.md:93`: "...para cada nível com aquele nome, some **+1d6 ao pool e descarte o
  dado mais baixo entre os que sobraram**: no total, +N dados descartando os N menores, onde N
  é o número de níveis daquele escopo."

---

### 23. Condições que penalizam a própria ação, ausentes da tabela de combate

**Original:**
- `src/content/chapters/combate.md` (tabela de Vantagem tática): "Alvo prono, atacado corpo a
  corpo | −2"; "Alvo surpreso, cego ou imobilizado | −4" (coluna "Defesa do alvo")
- `src/data/condicoes.json`: `caido.acao: -2` (nota: "Também −2 para agir"); `cego.acao: -3`;
  `imobilizado.acao: -2`

**Problema:** a tabela de combate só documenta o efeito dessas condições sobre a Defesa de
quem as tem, omitindo que elas também penalizam a ação de quem está caído, cego ou imobilizado
(valor que já existe no próprio `condicoes.json`).

**Correção proposta:** acrescentar, logo abaixo da tabela de Vantagem Tática em `combate.md`,
uma linha ou nota:

> "Essas mesmas condições também penalizam **quem as tem**, e não só quem ataca contra elas:
> Caído **−2** na própria ação, Cego **−3**, Imobilizado **−2** (ver [Condições]
> (/regras/combate#condicoes) ou a ficha)."

---

### 25. Criação de personagem não distingue Esquiva de Bloqueio

**Original:** `src/content/chapters/criacao-de-personagem.md:72`: "| Defesa | (Destreza +
Habilidade) × 2 + Especialidade + Centelha |"

**Problema:** `defesas.md:64-69` define duas Defesas Físicas (Esquiva e Bloqueio, com fórmulas
diferentes: Bloqueio soma a defesa da arma/escudo). A tabela de Traços Derivados nomeia só
"Defesa", no singular, sem indicar qual das duas (os exemplos do capítulo sempre calculam
Esquiva).

**Correção proposta** (linha da tabela):

> "| Defesa (Esquiva) | (Destreza + Esquiva) × 2 + Especialidade + Centelha |
> | Defesa (Bloqueio, se usar arma/escudo) | (Destreza + Bloqueio) × 2 + Especialidade +
> Centelha + defesa da arma/escudo |"

---

### 27. Bloqueio sem a restrição de porte, no capítulo de Defesas

**Original:** `src/data/glossario.json` (verbete "porte"): "...no corpo a corpo, também limita
o Bloqueio: não se apara atacante 2+ categorias maior (cada Centelha do defensor sobe o teto;
escudo grande plantado dá +1) nem quem tem Força ≥ 2× a sua e +4 acima; nesses casos resta a
Esquiva."

**Problema:** `defesas.md`, capítulo dedicado à Defesa Física, não menciona essa restrição em
nenhum momento; ela só existe no glossário.

**Correção proposta:** acrescentar, logo após a definição de Bloqueio em `defesas.md`
(depois de "A defesa que a arma ou o escudo concede entra por cima, em jogo."):

> "Bloqueio tem um teto de porte: não se apara um atacante **2 ou mais categorias de porte
> maior** (cada Centelha do defensor sobe esse teto; um escudo grande plantado dá +1), nem
> quem tem Força **2× a sua ou mais, e +4 acima**. Nesses casos só resta a Esquiva."

---

### 32. Tabela do Séquito com coluna fantasma

**Original:**
- `src/content/chapters/antecedentes.md` (tabela de níveis do Séquito): cabeçalho de duas
  colunas ("Nível | O que significa"), mas cada linha tem um terceiro campo colado
  ("...(2 a 3). | Magnitude 1").
- `src/data/antecedentes.json`: campo `texto` do nível 1 do Séquito é literalmente
  `"Uns poucos serviçais ou capangas (2 a 3). | Magnitude 1"`, com o `|` embutido no texto.

**Problema:** o `|` dentro do campo `texto` do JSON quebra o parsing da tabela Markdown gerada
a partir dele, criando uma coluna sem cabeçalho.

**Correção proposta:** como "Magnitude N" é sempre igual a "Nível N" (Magnitude 1↔Nível 1,
..., Magnitude 6↔Nível 6, conferido nas seis linhas), a informação é redundante e pode ser
removida sem perda:

- Em `src/data/antecedentes.json`, remover o sufixo `" | Magnitude N"` de todos os seis campos
  `texto` do Séquito, deixando só a descrição (ex.: `"Uns poucos serviçais ou capangas
  (2 a 3)."`).
- Em `antecedentes.md`, a tabela volta a ter duas colunas limpas, sem edição adicional
  necessária além da correção da fonte.

---

### 34. Meio-Elfo sem idade de maturidade no texto corrido

**Original:**
- `src/content/chapters/racas.md:96`: "...vivem mais que humanos: até **200 anos**." (sem
  idade de maturidade no parágrafo)
- `src/content/chapters/racas.md` (tabela de Envelhecimento, linha Meio-Elfo): Adulto **15**,
  Maturidade **55**

**Problema:** todas as outras seis raças declaram a idade de maturidade no parágrafo de
abertura (ex.: Anão, linha 72: "Maturidade aos 18 anos"); o Meio-Elfo é a única exceção, e o
leitor só acha o número numa tabela separada, mais adiante.

**Correção proposta** (inserir na frase de `racas.md:96`, no mesmo padrão das outras raças):

> "...Têm poucos pelos, como os elfos. **Maturidade por volta dos 55 anos** (adulto aos 15);
> vivem mais que humanos: até **200 anos**. Por serem híbridos, são **inférteis**."

---

### 36. "Ofício" usado antes de ser definido na ordem de leitura

**Original:** `src/content/chapters/acoes-sentidos-e-engano.md:32` ("Avaliar um item"):
"Direta, Inteligência + **o Ofício da peça**." (capítulo 13, lido antes de "Ofício e Mundo",
capítulo 14, onde "Ofício" é de fato definido)

**Problema:** o termo mecânico "Ofício" (Habilidade Secundária + a primária "Ofícios Gerais")
só ganha definição no capítulo seguinte; um leitor na ordem do livro chega nele sem contexto.

**Correção proposta** (acrescentar remissão, sem mudar a regra):

> "Direta, Inteligência + o Ofício da peça (a Habilidade de Ofício correspondente; ver
> [Ofício e Mundo](/regras/acoes-oficio-e-mundo))."

---

### 40. Colisão de nome: "Margem" e "Margem de Quase-Acerto"

**Original:** `src/content/chapters/quase-acerto.md:12-14`: "compare o quanto faltou com a
**Margem de Quase-Acerto**: Margem de QA = Bônus QA da arma + Bônus QA da armadura do alvo"
(sem nunca dizer que esse número não tem relação com a "Margem" de graus de sucesso definida
em `coracao-do-sistema.md:80`)

**Problema:** o livro usa "Margem" desde o capítulo 1 para "cada 6 pontos acima do alvo", e
`quase-acerto.md` reaproveita o mesmo nome para uma soma fixa de bônus, sem avisar
explicitamente que são coisas diferentes.

**Correção proposta** (acrescentar uma frase logo após a introdução do termo, antes da
fórmula):

> "Apesar do nome, a **Margem de Quase-Acerto** não é a Margem de graus de sucesso do
> [capítulo 1](/regras/coracao-do-sistema#margem-graus-de-sucesso) (aquela dos "6 pontos acima
> do alvo"): é um número fixo, que não nasce de rolagem nenhuma, somado só da arma e da
> armadura envolvidas."

---

### 41. Defesa Mental quebra o padrão do Valor Passivo do capítulo 1

**Original:**
- `src/content/chapters/coracao-do-sistema.md:86`: "Valor Passivo = (Atributo + Habilidade) ×
  2 + Especialidade + Centelha (+ modificadores)"
- `src/content/chapters/defesas.md:77`: "Defesa Mental = Raciocínio + Integridade + Força de
  Vontade + Centelha + Especialidade" (sem ×2, soma de três termos em vez de Atributo +
  Habilidade)

**Problema:** o capítulo 1 apresenta a fórmula de Valor Passivo como universal; a Defesa
Mental é uma exceção documentada só treze capítulos depois, sem aviso prévio.

**Correção proposta** (acrescentar uma nota em `coracao-do-sistema.md`, logo após a fórmula de
Valor Passivo):

> "<p class='muted'>Uma exceção a essa fórmula: a <strong>Defesa Mental</strong> não segue o
> padrão Atributo+Habilidade ×2 acima; ela soma três termos sem dobrar (ver
> [As Três Defesas](/regras/defesas)).</p>"

---

### 42. "Peso" reusado para dois conceitos diferentes em Combate Social

**Original:**
- `src/content/chapters/relacoes-sociais.md:134`: "As abordagens vêm em três **pesos**, e o
  peso dá a Velocidade: leve 5, média 6, pesada 7."
- `src/content/chapters/relacoes-sociais.md:140`: "O **Peso** é um bônus de +0 a +3 que o
  Mestre concede conforme a abordagem é certeira..."

**Problema:** o mesmo nome "Peso" cobre duas coisas diferentes a seis linhas de distância: a
classificação leve/média/pesada (que decide Velocidade) e um bônus discricionário de +0 a +3
somado ao Ataque.

**Correção proposta:** renomear o segundo conceito para não colidir com o primeiro (mudança só
de rótulo, a mecânica continua a mesma):

> "O **Acerto da Abordagem** (não confundir com o peso leve/média/pesada acima, que só decide
> a Velocidade) é um bônus de +0 a +3 que o Mestre concede conforme a abordagem é certeira..."

(E, na fórmula de Ataque, trocar "+ Peso do argumento" por "+ Acerto da Abordagem".)

---

### 43. Duas taxonomias "leve/média/pesada" sem aviso no capítulo onde a confusão começa

**Original:** `src/content/chapters/armas-e-armaduras.md` (tabela "Classes de Arma", lida
antes de qualquer outra tabela leve/média/pesada do livro); o aviso de que a classe de
Quase-Acerto é diferente só aparece em `quase-acerto.md:32`, capítulo posterior.

**Problema:** a confusão nasce em Armas & Armaduras (primeiro contato do leitor com
"leve/média/pesada"), mas o aviso que a resolveria só existe no capítulo seguinte.

**Correção proposta:** acrescentar, logo abaixo da tabela "Classes de Arma" em
`armas-e-armaduras.md`, a mesma nota que já existe em `quase-acerto.md:32`:

> "<p class='muted'>Esta classe (leve/média/haste/pesada/distância/arremesso) decide Preparo e
> Velocidade. O [Quase-Acerto](/regras/quase-acerto) usa uma classificação leve/média/pesada
> PRÓPRIA, calculada pelo dano médio da arma, que não é a mesma coisa.</p>"

---

### 44. Tabela de Velocidades mistura "tipo de ação" e "classe" sem indicar de cara

**Original:** `src/content/chapters/combate.md` (tabela de Velocidade de Ataque), coluna
"Tipo de ação"; a nota que esclarece que essa coluna não é a chave usada no resto do capítulo
vem só depois da tabela, em `<p class="muted">`.

**Problema:** um leitor tenta achar "haste" na tabela de Velocidade e não encontra (a classe
real só aparece na tabela de Preparo, mais adiante).

**Correção proposta:** mover a nota existente para **antes** da tabela, e destacá-la:

> "<p class='muted'><strong>Leia esta tabela por Ticks, não pelo rótulo.</strong> A coluna
> "Tipo de ação" é só orientação de leitura; a classificação real de cada arma
> (leve/média/haste/pesada/distância/arremesso), usada no resto do capítulo, está na tabela de
> Preparo, logo abaixo.</p>"

(A tabela e a nota final continuam existindo; isto só adianta o aviso.)

---

### 45. Investida/Recarga soam como ações de Velocidade própria

**Original:** `src/content/chapters/combate.md` (seção Investida): "Investir é **gastar o
Preparo correndo** em vez de andando. Não é ação nova nem regra nova: é o Preparo que a sua
arma já tem, atravessado à velocidade de Corrida."

**Problema:** a frase já diz "não é ação nova", mas isso fica só na abertura da seção; o resto
do texto (e a proximidade com Corrida e Salto, que TÊM Velocidade própria de 3) convida à
confusão.

**Correção proposta:** reforçar a frase de abertura, sem mudar a regra:

> "Investir é **gastar o Preparo correndo** em vez de andando: continua sendo a mesma ação de
> **atacar**, com a mesma Velocidade que a arma já tem. Não ganha Velocidade própria, ao
> contrário de Corrida e Salto (Velocidade 3, ação à parte)."

---

### 46. "Errou por" exige lembrar o "+1" do parágrafo anterior

**Original:** `src/content/chapters/quase-acerto.md:16-26`: fórmula "Errou por = (Defesa + 1)
− total" seguida do exemplo, que não repete o motivo do "+1" na hora de aplicar.

**Problema:** um leitor rápido tende a usar a diferença crua (Defesa − total) no exemplo,
porque o "+1" não é reforçado ali.

**Correção proposta:** acrescentar o motivo entre parênteses dentro do próprio exemplo
(`quase-acerto.md:26`, primeira frase):

> "Sora ataca um cavaleiro de placa com a espada longa (dano médio 3,5, arma média) e rola 13
> contra Defesa 16: precisava de 17 para não empatar, então errou por **4** (17 − 13)."

---

### 47. Exemplo do cavaleiro de placa omite a Força em dobro

**Original:** `src/content/chapters/armas-e-armaduras.md` (exemplo do cavaleiro de placa,
"atravessa 6 / atravessa 5 / atravessa zero"), sem repetir que a arma de duas mãos do exemplo
soma o dobro da Força.

**Problema:** o número "6" só fecha se o leitor lembrar, de um parágrafo anterior qualquer, da
regra de Força em dobro nas armas de duas mãos (`combate.md:180`); sem isso, o resultado
parece incorreto.

**Correção proposta:** acrescentar, entre parênteses, a conta completa na primeira aparição do
número no exemplo (ex.: "...dano X (dado da arma + **Força ×2**, arma de duas mãos) −
Absorção Y = 6...").

---

### 48. "Atributo máximo 5" seguido de exceção duas frases depois

**Original:** `src/content/chapters/criacao-de-personagem.md:63-65`: "Atributo máximo **5**;
Habilidade máxima **4**...", seguido logo depois por "Cada herói pode ter **um pico**: você
está autorizado a levar um único Atributo a 6..."

**Problema:** "máximo" soa como teto absoluto na primeira frase; só a segunda revela que é o
teto padrão, com uma exceção nomeada.

**Correção proposta:** unir as duas informações numa só frase, sem separar por parágrafo:

> "Atributo máximo **5** (exceto **um único** pico a **6**); Habilidade máxima **4** (exceto
> **uma única** Habilidade primária a **5**), o talento superlativo que define o herói.
> Centelha máxima **3** (a maioria dos heróis começa em 1)."

---

### 49. Repetição tripla da régua de Centelha sem indicar que é a mesma informação

**Original:** `src/content/chapters/centelha.md` repete a progressão de tiers (1-6) na tabela
de abertura, no texto de cada degrau, e num callout final.

**Problema:** redundante mas não incoerente; um leitor de primeira viagem pode achar que está
perdendo nuance nova a cada repetição.

**Correção proposta:** acrescentar uma frase de orientação logo após a tabela de tiers,
sinalizando a repetição como intencional:

> "<p class='muted'>Os parágrafos abaixo detalham cada degrau desta mesma tabela, um por um;
> o callout ao final resume tudo de novo em bloco, para quem quiser só a visão de conjunto.</p>"

---

### 50. Termo técnico "módulo" sem alternativa em linguagem comum

**Original:** `src/content/chapters/aparencia-virtudes-vontade.md:18`: "cada ponto de
Compostura mascara um ponto do **módulo** do modificador de Aparência... até o piso zero"

**Problema:** "módulo" (valor absoluto) é vocabulário matemático incomum num livro de mesa; a
frase precisa ser relida para não se interpretar como "pode inverter o sinal".

**Correção proposta:**

> "cada ponto de Compostura mascara um ponto do modificador de Aparência **rumo a zero**
> (não importa se ele é positivo ou negativo, a Compostura sempre puxa para o meio), até
> **zerar** e parar aí."

---

### 51. "Quem escolhe o par" remete sem resumir a nuance já dada

**Original:** `src/content/chapters/habilidades.md:20`: "Quem escolhe o par é o Mestre, pela
descrição da ação: você diz **como** está fazendo, e o **como** define o Atributo. A regra
inteira está em [Quem escolhe o par](/regras/coracao-do-sistema#quem-escolhe-o-par)."

**Problema:** a frase já cobre o essencial, mas o capítulo 1 acrescenta uma nuance importante
(o Mestre não deve recusar um par que a ficção sustenta só por estar fora da inclinação
publicada) que não é repetida nem resumida aqui.

**Correção proposta:** acrescentar uma cláusula final à mesma frase, sem duplicar o capítulo 1
inteiro:

> "...A regra inteira, inclusive a orientação de que o Mestre não deve recusar um par fora da
> inclinação padrão quando a ficção o sustenta, está em [Quem escolhe o par]
> (/regras/coracao-do-sistema#quem-escolhe-o-par)."

---

### 52. Fórmula com colchetes sem explicar a notação

**Original:** `src/content/chapters/habilidades.md:82`: "uma Habilidade de nível N tem até
**[N ÷ 2]** níveis de Especialidade no total"

**Problema:** os colchetes não são explicados como "arredondar para baixo" nesse ponto do
livro; só dá para inferir pelos exemplos logo abaixo.

**Correção proposta:**

> "uma Habilidade de nível N tem até **[N ÷ 2], arredondado para baixo,** níveis de
> Especialidade no total"

---

### 53. Célula "fora de cena" quebra o padrão sim/não da tabela de modos

**Original:** `src/content/chapters/acoes-e-sistema.md` (tabela dos cinco modos), coluna
"Custa a ação?", linha Longa: "**fora de cena**" (as outras quatro linhas respondem só "sim"
ou "não")

**Problema:** a célula foge do padrão binário da coluna, deixando ambíguo se "fora de cena"
equivale a sim ou a não.

**Correção proposta:**

> "| **Longa** | **não** | **não** (decorre fora de cena, entre sessões ou saltos de tempo) |
> a mesma dupla, mas usando a **média** do pool por intervalo |"

(Mantém o padrão sim/não na coluna e move a explicação "fora de cena" para dentro do
parêntese, sem mudar a regra.)

---

### 56. Mesma frase, escopos diferentes, sem destacar a diferença

**Original:**
- `src/content/chapters/acoes-resistir.md` (Ambiente, jogada de Resistência): "...passando,
  nada e **o intervalo seguinte não se rola**..."
- `src/content/chapters/acoes-resistir.md` (Ambiente, jogada de Sobrevivência do batedor):
  "...com uma Margem, **o dia não se rola**..."

**Problema:** as duas frases usam a mesma construção ("X não se rola") para efeitos de escala
bem diferente: uma pula só o próximo intervalo individual da vítima, a outra pula o dia inteiro
para o grupo todo.

**Correção proposta:** destacar a diferença de escopo em cada uma das duas frases, sem mudar
o efeito:

- (Resistência) "...passando, nada, e **você** dispensa a próxima rolagem de Resistência (só a
  sua, só o próximo intervalo)."
- (Sobrevivência do batedor) "...com uma Margem, **o grupo inteiro** dispensa a rolagem daquele
  dia (o batedor cobre todo mundo, não só ele)."

---

## Itens que, ao tentar redigir, exigiram decisão nova (rebaixados para o balde B)

Nenhum dos 32 itens listados no pedido precisou ser rebaixado: em todos, a correção só alinhou
o texto a uma fonte já existente (a outra metade do mesmo capítulo, o JSON, ou uma nota interna
do próprio dado). O item **37** (categorias "dano leve/pesado/peça arruinada" de itens, do
arquivo original) **não estava nesta lista de 32** enviada pelo Arquiteto, mas foi verificado
por engano durante a apuração do balde C: registrado à parte no arquivo de investigação, porque
não existe, em lugar nenhum do capítulo ou do JSON, um critério que defina esses três estados
de dano, o que tornaria qualquer "correção" uma invenção.
