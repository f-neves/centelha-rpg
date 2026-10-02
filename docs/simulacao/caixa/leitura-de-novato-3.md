# Leitura de novata 3 · as regras básicas

Lido em `2dcae19e`, por `git show 2dcae19e:src/content/chapters/<arquivo>`, na ordem do site pedida no despacho. Não li código, JSON, `Pendencias.md`, `docs/pendencias/` nem `docs/simulacao/`, com uma exceção: abri `docs/simulacao/caixa/leitura-de-novato-2.md` só para copiar o formato. Como vi o modelo, marco com **(persiste da leitura 2)** os achados que reconheci lá, para não parecer descoberta nova.

Caminhos relativos a `src/content/chapters/`. Tipos: **CLAREZA** (o texto não deixa a regra clara), **INCONGRUÊNCIA** (dois trechos não combinam, mas dá para conciliar), **CONTRADIÇÃO** (dois trechos dizem coisas que não podem valer juntas).

Fora da lista do despacho, abri três trechos curtos porque as situações do fim pediam: `habilidades-secundarias.md` (verbetes de Intimidação, Sedução, Cura e Ocultação, para saber se existiam), `relacoes-sociais.md:8-166` (convencer o guarda) e `acoes-corpo-e-movimento.md:12-39` (Escalar).

---

## Parte 1 · Achados, do mais usado na mesa ao menos usado

### Faixa A · toda jogada e toda Defesa

**A1. A Centelha nas jogadas e nas Defesas tem duas fórmulas no livro.** CONTRADIÇÃO.
- Fórmula nova, `2 × menor(Centelha, Habilidade)`: `coracao-do-sistema.md:89-91`, `acoes-e-sistema.md:65` e `:121`, `defesas.md:62`, `:68-81`, `:85`, `combate.md:124`, `:131`, `:135`, `centelha.md:44`.
- Fórmula antiga, Centelha somada uma vez e sem teto:
  - `criacao-de-personagem.md:73-75`: "Defesa = (Destreza + Habilidade) × 2 + Especialidade + Centelha"; Mental e Social idem.
  - `aparencia-virtudes-vontade.md:129`: "Defesa Mental = Integridade + Raciocínio + Força de Vontade + Centelha + Especialidade"; `:131` dá a Social com "+ Centelha".
  - `acoes-sentidos-e-engano.md:16`: "O número é (Percepção + Prontidão) × 2 + Centelha".
  - `relacoes-sociais.md:138`: "Ataque = [...] + Acerto da Abordagem + Centelha".
- Os exemplos seguem a antiga. Kael tem "Defesa 17 · Def. Mental 13 · Def. Social 7" em `criacao-de-personagem.md:106`. Em `defesas.md:85` ele tem Esquiva **20**, Social **4** e Mental **10**. E em `combate.md:21` Sora rola "5d6+6 (Destreza 6 + Armas 5, mais o acerto da espada e a Centelha)". Pela fórmula nova seria 5d6 + 2 (ímpar) + 1 (espada) + 6 (2 × menor(3, 5)) = **5d6+9**. O +6 só fecha com a Centelha somada uma vez.
- **Por que é problema:** é o número que mais se usa na mesa. Uma novata que monta a ficha pelo capítulo de criação chega a Defesas diferentes das que o capítulo de Defesas dá.
- **Correção sugerida:** trocar as fórmulas dos quatro arquivos da lista antiga e refazer os derivados de Kael, Sora, Veil e Bram e o exemplo de `combate.md:21`.

**A2. Rolar sem Habilidade: a Centelha some ou entra inteira?** CONTRADIÇÃO.
- `centelha.md:44`: "Numa jogada que rola **só Atributo, sem Habilidade que sustente um teto** (Vontade pura, Resistir sem perícia, alguns testes de Bravura), [...] a Centelha soma **inteira, sem teto**, igual ao dano".
- `habilidades.md:8`: "**0 não é impedimento** [...] você ainda rola o Atributo sozinho".
- `defesas.md:85`: na Defesa Social de Kael, com Sociabilidade 0, "a Centelha não passa do que a Sociabilidade sustenta, que aqui é zero".
- **Por que é problema:**
  - Toda jogada sem treino é "o Atributo sozinho". Lido assim, com Centelha 3, quem tem Habilidade 0 ganha a Centelha inteira, e quem tem Habilidade 1 ganha só 2. Treinar piora a jogada.
  - Na Defesa, Habilidade 0 dá zero.
  - "Vontade pura" e "testes de Bravura" não são Atributos, e o teste de Virtude (`aparencia-virtudes-vontade.md:73-84`) não fala em Centelha.
  - "Inteira, igual ao dano" tem duas leituras: (1) soma a Centelha uma vez, como no dano (`combate.md:179`); (2) soma 2 por ponto, só que sem teto.
- **Correção sugerida:** dizer se "só Atributo" inclui Atributo + Habilidade 0, se a exceção vale para Defesa, qual das duas leituras de "inteira" vale e quais testes de Bravura entram.

**A3. A Especialidade entra ou não no número impresso na ficha.** INCONGRUÊNCIA.
- `criacao-de-personagem.md:73-75` põe "+ Especialidade" nas fórmulas dos derivados.
- `acoes-e-sistema.md:123`: "A Especialidade não entra no número parado que a ficha imprime".
- **Correção sugerida:** tirar a Especialidade da tabela de derivados de criação, ou anotar "só na situação".

**A4. A data da reforma dentro do texto de regra.** CLAREZA.
- `defesas.md:62` e `:126`: "(Reforma da Centelha, 28/09/2026)".
- **Por que é problema:** a novata lê isso como aviso de que algum trecho do livro ainda está na regra velha, e não sabe qual. A1 confirma a suspeita.
- **Correção sugerida:** tirar a data do texto jogável.

### Faixa B · todo ataque

**B1. Quando o golpe sai no sistema padrão.** CONTRADIÇÃO (persiste da leitura 2).
- `combate.md:103-105`: no Normal, "a ação resolve inteira no Tick da declaração, com a Defesa em −2 durante o Preparo e −4 no Tick do golpe".
- Os outros trechos põem o golpe depois do Preparo:
  - `:86-87`: a Besta Grande "passa catorze Ticks armando antes do virote sair";
  - `:339`: Bram "fica dos Ticks 0 ao 10 em Preparo [...] o virote sai no Tick 11";
  - `:382`: a espada longa "declarada no Tick 3, o golpe dela também cairia no 4".
- **Duas leituras:**
  - (1) rola-se na declaração e as penalidades de Defesa correm nos Ticks seguintes;
  - (2) o golpe só resolve no fim do Preparo, e o Normal só difere do P/G/R na Recuperação.
- **Correção sugerida:** escrever em que Tick se rola, no Normal, para Leve, Média e Distância.

**B2. A Pressão: a ordem do −2 e o que ela soma.** CLAREZA.
- `combate.md:405`: "Cada ataque que você **faz ou recebe** reduz sua **Esquiva e Bloqueio em −2** [...] acumula até a sua próxima ação".
- O texto não diz:
  - se o primeiro golpe recebido já bate com −2. **Duas leituras:** (1) sim, o golpe conta antes de ser rolado; (2) não, o primeiro bate na Defesa cheia e o segundo já pega −2;
  - se o −2 de "fazer um ataque" soma com o −4 do Tick do Golpe (`:92`);
  - se cada golpe de uma Rajada (`:143`) conta como um ataque feito.
- **Correção sugerida:** um exemplo com três atacantes contra um, Tick a Tick.

**B3. A Penalidade da armadura: ponto ou dado, e onde entra.** CLAREZA (persiste em parte da leitura 2).
- `armas-e-armaduras.md:131`: "incide em qualquer ação física, incluindo **Ataque, Esquiva, Bloqueio, Deslocamento e Salto**; para **Furtividade e atividades delicadas, dobra**".
- As fórmulas de Esquiva e Bloqueio (`defesas.md:68-69`, `combate.md:131`) não trazem a Penalidade.
- E as fichas também põem a armadura como Circunstância: `acoes-sentidos-e-engano.md:81` "armadura pesada **+4**".
- **Duas leituras para a Furtividade:**
  - (1) a Penalidade dobrada sai do total **e** a Dificuldade sobe 4;
  - (2) a Circunstância já é a Penalidade escrita de outro jeito.
- **Correção sugerida:** pôr "− Penalidade da armadura" nas fórmulas de Defesa Física e dizer se a Penalidade é ponto (ela é −1 a −3, então parece ponto) e se soma com a Circunstância.

**B4. Iniciativa: o contrapé e o empate.** CLAREZA e INCONGRUÊNCIA.
- `combate.md:31`: "Cada degrau custa também **1d6 na ação**". Não diz se vale para a Defesa, para um movimento, para uma Reflexiva.
- No mesmo parágrafo, para o empate: "age primeiro quem tiver o maior Raciocínio".
- `:116`: "todos que agem no mesmo Tick rolam juntos; a ordem de resolução serve só para anotar". Se rolam juntos, "agir primeiro" não muda nada.
- **Correção sugerida:** dizer que o contrapé só tira dado de jogada ativa, e dizer o que o desempate decide.

**B5. Dois números que este capítulo cita antes de definir.** CLAREZA.
- `combate.md:67-70`: "o capítulo já usa os três nomes antes de defini-los (a Investida, a Recarga, 'Golpes no mesmo instante')". E `:94`: "É a régua que já apareceu em *Correndo* [...] na Investida e na Recarga".
- Na ordem atual, todos esses trechos vêm **depois** (`:288`, `:306`, `:322`, `:378`).
- **Correção sugerida:** trocar "já apareceu" por "vai aparecer", ou tirar a frase.

**B6. A Esquiva tem um bônus sem número.** CLAREZA.
- `combate.md:235`: "**Esquiva**: com a habilidade Esquiva, mais a mobilidade do terreno".
- Nenhum valor nem tabela.
- **Correção sugerida:** remeter à tabela de Vantagem tática (`:361-372`) ou tirar.

### Faixa C · todo movimento em combate

**C1. O passo grátis: um Tick, ou todo o Preparo?** CONTRADIÇÃO.
- `combate.md:277`: "**O primeiro Tick é de graça durante outra ação**".
- `:313`: "Preparo andando | Deslocamento de Batalha por Tick".
- `:316`: Sora, de Preparo 2, "cobre **8 metros**" andando, o que dá dois Ticks de passo.
- **Correção sugerida:** escolher uma das duas e alinhar o exemplo.

**C2. Arredondamento do Deslocamento.** INCONGRUÊNCIA.
- `combate.md:275`: Deslocamento = 2 + (Destreza + Atletismo) ÷ 4.
- Kael (Destreza 4, Atletismo 3): 3,75. `:280` diz "4 m": arredondou para cima.
- Sora (Destreza 6, Atletismo 3, Força 4): Deslocamento 4,25, que `:316` chama de "4"; Arranque 6,75, que o exemplo chama de "corre 6": arredondou para baixo.
- **Correção sugerida:** dizer se o número tem fração ou se arredonda, e para que lado.

**C3. A Corrida é uma ação de 3 Ticks ou um estado contínuo?** CLAREZA.
- `combate.md:54` e `:286`: Corrida, "Velocidade 3".
- `:297`: "Interrompível a **qualquer Tick** [...] os **3 primeiros Ticks** correm à Velocidade de Arranque; do **4º Tick em diante**, à Velocidade de Corrida".
- **Duas leituras:**
  - (1) a Corrida custa 3 Ticks e, para chegar ao 4º, declara-se outra, que recomeça no Arranque;
  - (2) a Corrida dura o quanto se quiser, e o "Velocidade 3" é só o mínimo.
- `:292`: "Defesa −4, enquanto corre e até se recompor". O texto não diz quanto dura "se recompor".
- `:295`: "O acerto não sofre, porque quem parou, parou", depois de `:280` dizer "correndo não se ataca". A frase fica sem sentido.

**C4. "Corrida vai 50 a 67% mais longe" e o exemplo da Investida.** CONTRADIÇÃO (persiste da leitura 2).
- `combate.md:290` continua igual.
- `:316` continua com "corre 6" e "cobre 12".

**C5. Sair da área: qual jogada?** CLAREZA.
- `combate.md:264-269`: "as duas pedem a mesma jogada", Dificuldade "5 + 5 × os metros".
- Não diz qual Atributo e Habilidade, e remete para fora (`/artes/regras#tempo`).
- **Correção sugerida:** escrever o par (Destreza + Atletismo? Esquiva?) aqui mesmo.

### Faixa D · toda ação fora do combate

**D1. Na Acumulada, a Margem soma em cima do progresso?** CONTRADIÇÃO (persiste da leitura 2).
- `acoes-e-sistema.md:75`: "Progresso da jogada = resultado − Dificuldade".
- `:77`: "Quem tira 17 sobe de primeira, porque 17 menos 7 são os dez metros inteiros".
- `acoes-corpo-e-movimento.md:33`: "Cada Margem sobe **mais 3 metros**".
- `acoes-sentidos-e-engano.md:75`: "**mais 4 metros**, ou **congelar um intervalo**".
- **Duas leituras:** (1) 17 contra 7 dá 10 de progresso e mais 1 Margem, 13 metros; (2) a Margem é a forma de ler o excedente, e não um extra.

**D2. A banda morta: perde quanto?** CLAREZA.
- `acoes-e-sistema.md:84`: "**6 ou mais** | **perde a diferença**".
- **Duas leituras:** (1) errou por 8, perde 8; (2) perde só o que passou da faixa de 6, ou seja 2.

**D3. Margem numa Longa, que não rola.** CONTRADIÇÃO (persiste da leitura 2).
- `acoes-e-sistema.md:53`: "Decifrar uma página antiga é Hora (Longa). Duas Margens de sobra".
- A Longa não tem jogada (`:92`), e o texto não diz como ela gera Margem.

**D4. Sem pressa, a Direta rola ou não?** CLAREZA.
- `acoes-e-sistema.md:160`: "**não se rola quando não há pressa**".
- Mas a Direta (`:69`: "saltar o vão, reconhecer o brasão") não tem Acúmulo para virar Longa.
- **Correção sugerida:** dizer se a regra de "não rolar sem pressa" vale só para Acumulada e Longa.

**D5. A Centelha entra na Acumulada e não na Longa: a pressa rende mais.** INCONGRUÊNCIA.
- `acoes-e-sistema.md:107`: "**A Centelha não entra na Longa**".
- A Acumulada é jogada, e "a Centelha soma 2 × o menor [...] em toda jogada" (`coracao-do-sistema.md:91`).
- **Por que é problema:** para quem tem Centelha, escolher a pressa (Acumulada) rende mais por intervalo do que a calma (Longa). Kael na muralha de Dificuldade 7: na Acumulada a média é 3d6 + 2 (Escalada) + 6 (Centelha), 18,5, ou seja 11,5 de progresso; na Longa é 10,5 (+2?) − 7, ou seja 3,5 a 5,5. O texto vende a Longa como o modo da competência, e ela sai pior.
- **Correção sugerida:** dizer se isso é de propósito.

**D6. A secundária na Longa e o teto da Centelha.** CLAREZA.
- `acoes-e-sistema.md:186`: "A maior das duas entra no pool · a menor vira bônus fixo ao total".
- O texto não diz:
  - se o bônus fixo da secundária entra na média da Longa (`:94` só fala em dados e no +2);
  - quando a secundária é a maior e entra no pool, se o teto da Centelha (`menor(Centelha, Habilidade)`) usa a secundária ou a primária.

**D7. Trabalho em Grupo e "jogada estendida".** CLAREZA.
- `acoes-e-sistema.md:168`: "os resultados somam além da Dificuldade". **Duas leituras:** (1) soma-se o excedente de cada um sobre a Dificuldade; (2) somam-se os totais e compara-se com a Dificuldade.
- `:172`: "Numa jogada estendida": o termo não é um dos cinco modos.
- `:178`: "um dançarino com −1 físico": a unidade (ponto ou dado) não é dita.

### Faixa E · Furtividade, Prontidão, Atletismo e Sociabilidade

**E1. Esgueirar na Acumulada: abaixo de qual número?** CLAREZA.
- `acoes-sentidos-e-engano.md:50`: "Acumulada: a Dificuldade é **70%**" do Valor Passivo.
- `:61-63`: "Ficar abaixo dele [o Valor Passivo] não significa [...]" e a tabela "Abaixo por menos de 6 / 6 ou mais".
- **Duas leituras:** na Acumulada, a tabela de suspeita se mede (1) contra os 70%; (2) contra o Valor Passivo inteiro, e aí quem passa dos 70% mas fica abaixo do Passivo avança e levanta suspeita ao mesmo tempo.

**E2. Ocultação é a secundária de esconder a si mesmo, mas descreve esconder objetos.** INCONGRUÊNCIA.
- `acoes-sentidos-e-engano.md:46` e `:85`: Esgueirar-se e Esconder-se usam a "secundária **Ocultação**".
- `habilidades-secundarias.md:108`: Ocultação é "compartimento falso, fundo duplo, tijolo solto [...] contrabando [...] falsificação".
- `habilidades.md:40`: "Esconder um objeto, e não a si mesmo, é Prestidigitação".
- **Por que é problema:** a novata fica com três lugares para "esconder", e o de esconder o corpo aponta para a secundária de objetos.

**E3. Esconder-se não tem ficha.** CLAREZA.
- `acoes-sentidos-e-engano.md:85`: "Sumir de vista e continuar sumido [...] Direta".
- **Por que é problema:** "continuar sumido" pede duração, e a Direta é uma jogada só. O texto não diz contra o quê se rola (Valor Passivo?), quando se rola de novo (a cada passagem da ronda?), nem se a tabela de estados do vigia (`:63`) vale.

**E4. Teste Coletivo empilha três penalidades.** CLAREZA.
- `acoes-sentidos-e-engano.md:79` e `acoes-e-sistema.md:178`: a Dificuldade sobe +2 por participante e "a penalidade de cada participante entra na jogada final".
- `:81` soma ainda "armadura pesada +4".
- Quatro pessoas contra um guarda comum (Valor Passivo 10) já dão 18, mais as penalidades.
- **Correção sugerida:** dizer se a Circunstância de armadura conta uma vez para o grupo ou uma vez por pessoa, e se a Penalidade da armadura soma com ela.

**E5. A Percepção Passiva com a Centelha.** CONTRADIÇÃO.
- É o caso A1 aplicado à Prontidão: `acoes-sentidos-e-engano.md:16` ("+ Centelha") contra `coracao-do-sistema.md:93` ("+ 2 × mín(Centelha, Prontidão)").

**E6. Intimidação e Sedução aparecem como Habilidade, e não estão entre as 24.** CLAREZA.
- `coracao-do-sistema.md:52`: "**Força** ou **Influência** + Intimidação".
- `relacoes-sociais.md:140`: "(Persuasão, Sedução, Intimidação, Manha…)".
- As duas só existem em `habilidades-secundarias.md:40` e `:44`.
- **Por que é problema:**
  - pela regra de `acoes-e-sistema.md:182-195`, a secundária anda junto de uma primária, e nenhum desses trechos diz qual (Persuasão? Manha?);
  - `habilidades.md:53` põe "seduzir" dentro de Persuasão.
- **Correção sugerida:** escrever o par primária + secundária nesses dois exemplos.

**E7. Sociabilidade "não pede nada", mas Barganhar é Sociabilidade.** INCONGRUÊNCIA.
- `habilidades.md:55`: "Ela não pede nada de ninguém [...] No instante em que vira pedido, passa a ser Persuasão".
- `acoes-sentidos-e-engano.md:104`: "**Barganhar.** Chegar num preço. Acumulada, Influência + Sociabilidade".
- **Correção sugerida:** Persuasão no Barganhar, ou explicar a exceção.

**E8. Quanto custa resistir com Vontade.** CLAREZA e INCONGRUÊNCIA.
- `aparencia-virtudes-vontade.md:115`: "+1d6 numa jogada ativa ou **+4** numa Defesa, no máximo **1 ponto por ação ou jogada**", e também "**resistir** a medo e manipulação, **ignorar penalidades**", sem número para esses dois.
- `defesas.md:104`: "você recusa friamente, mesmo que o teste tenha passado", sem custo.
- `relacoes-sociais.md:151-156`: segurar firme custa 1, 2, 3 ou mais pontos num lance só.
- **Duas leituras:**
  - (1) o "máximo 1 por jogada" vale só para turbinar, e resistir tem tabela própria;
  - (2) vale para tudo, e a tabela social contradiz.
- O texto também não diz se dá para pagar 1 por +4 na Defesa Social antes da jogada **e** depois pagar para segurar.
- **Correção sugerida:** uma linha em `aparencia-virtudes-vontade.md:115` remetendo à tabela social, e o custo de "ignorar penalidades".

### Faixa F · toda sessão (criação, cura, Vontade)

**F1. Com que Centelha se começa.** CONTRADIÇÃO.
- `criacao-de-personagem.md:23`: "A maioria começa em 1; quem quer um herói de saga começa em 3".
- `:33`: "Alcançar **Centelha 1** é o que torna alguém especial, e isso se conquista na história, não na planilha".
- `centelha.md:84`: "sobe **só com permissão do Mestre**, num marco de história".
- E o exemplo "Iniciante" (`criacao-de-personagem.md:88`) já nasce com Centelha 3.
- **Duas leituras:** (1) começa-se em 0 e a Centelha vem na campanha; (2) o Mestre concede 1 a 3 na criação, e o "na história" vale só para depois.

**F2. Mortal tem ou não tem Energia e Mana.** CONTRADIÇÃO.
- `centelha.md:19`: Tocado, "a Energia e a Mana que todo mortal já tem passam a servir".
- `:30`: "É aqui que se ganham as primeiras reservas de **Energia e Mana**".

**F3. Recuperação: falta a linha do Incapacitado, e o "acelera 10%" tem duas leituras.** CLAREZA.
- `vida-ferimentos-cura.md:83-88`: a tabela para em Crítico (1-10%). Quem está em Vida 0 ou abaixo, estabilizado, recupera como?
- `:90`: "**cada nível de Cura** de quem cuida a acelera em **10%**". **Duas leituras:** (1) o intervalo encurta 10% por nível; (2) o PV ganho sobe 10% por nível.
- O texto não diz se o cuidador rola, nem por quanto tempo precisa cuidar.
- `habilidades-secundarias.md:56` diz que "um ferimento mal tratado piora sozinho". O capítulo de Vida não tem regra de piora, além do Sangramento.

**F4. Estabilizar: qual Atributo?** CLAREZA.
- `vida-ferimentos-cura.md:75`: "teste de **Cura vs Dif 10**".
- `acoes-sentidos-e-engano.md:34`: "agir sobre ele é Raciocínio + Cura".
- **Correção sugerida:** escrever "Raciocínio + Cura" no callout.

**F5. A Vontade e "ignorar penalidades".** CLAREZA.
- `aparencia-virtudes-vontade.md:115`.
- O texto não diz quais penalidades (ferimento? Desgaste? contrapé?), por quanto tempo nem por quantos pontos.

**F6. Teste de Virtude e Centelha.** CLAREZA.
- A tabela `aparencia-virtudes-vontade.md:75-99` não tem Centelha.
- `centelha.md:44` diz que "alguns testes de Bravura" somam a Centelha inteira, sem dizer quais.

### Faixa G · de vez em quando

**G1. O exemplo do muro no capítulo I não segue a ficha de Escalar.** INCONGRUÊNCIA.
- `coracao-do-sistema.md:79`: "escalar um muro liso (Dificuldade 10) [...] rola 3d6. Saem 11 [...] ele sobe", como Direta, sem Acúmulo.
- `acoes-corpo-e-movimento.md:14-24`: Escalar é Acumulada ou Longa, e "pedra lisa e polida" é Dificuldade **12**.
- O exemplo também esquece:
  - a Centelha 3 de Kael (+6 pela fórmula nova);
  - a Escalada 2 dele (+2 pela regra da secundária).
- **Correção sugerida:** refazer o exemplo pela ficha de Escalar, ou trocar a ação por uma Direta.

**G2. Quase-Acerto: Sora com Centelha 2.** INCONGRUÊNCIA.
- `quase-acerto.md:28`: "Sora (Centelha 2)".
- `criacao-de-personagem.md:108`: Sora tem Centelha 3.

**G3. Quase-Acerto: o modificador situacional sem número.** CLAREZA.
- `quase-acerto.md:85`: "Use o bom senso na mesma escala".
- O texto não diz se a cobertura +2 na Defesa também tira 2 da Margem de QA.

**G4. Firula citada antes de explicada.** CLAREZA.
- `coracao-do-sistema.md:36` resolve a soma 1 com "a Firula de nível 2", e a Firula só é explicada em `habilidades.md:99-128`.
- O link existe, mas a solução do problema depende de um termo que a novata ainda não leu.
- **Correção sugerida:** uma frase dizendo o que é Firula.

**G5. Serviços: a semana tem 8 dias e a diária divide por 6.** CLAREZA.
- `custo-servicos.md:12`: "a **diária por contrato** é a renda semanal ÷ 6".
- `:86`: "A semana tem 8 dias". E `:270`: o soldo "é pago por dia corrido, inclusive os de descanso".
- **Correção sugerida:** dizer que são 6 jornadas de trabalho em 8 dias.

**G6. "Acima de Dificuldade 20 nenhum mortal passa".** INCONGRUÊNCIA.
- `custo-servicos.md:42`: "Acima de Dificuldade 20 nunca há: nenhum mortal passa esses testes".
- O teto mortal é soma 12 (`acoes-e-sistema.md:27`). 6d6 contra 21 passa perto de 44% das vezes, e contra 24 ainda passa às vezes.
- **Correção sugerida:** "nenhum mortal passa com confiança".

**G7. Códigos internos no texto do livro.** CLAREZA.
- `custo-servicos.md:65`: "provisória até a G73", "provisório até a B14", "não da bancada". E `:103`, `:113`: "bancada".
- **Por que é problema:** a novata não sabe o que são G73, B14 nem bancada.

**G8. Nomes de faixa diferentes em duas tabelas do mesmo capítulo.** CLAREZA.
- `custo-servicos.md:22-30` usa Braçal, Destreinado, Oficial, Profissional, Perito, Especialista, Mestre.
- `:131-139` usa Braçal, Destreinado, **Treinado**, Especialista, **Doutor**, **Abastado**, Rico, Aristocrata, Nobreza.
- O texto não diz como uma faixa corresponde à outra.

**G9. O arredondamento do "Livre × 1,8".** INCONGRUÊNCIA.
- `custo-servicos.md:67` e `:76`:
  - Dificuldade 5: 7 × 1,8 = 12,6, que vira **13**;
  - Dificuldade 10: 12 × 1,8 = 21,6, que vira **20**;
  - Dificuldade 20: 35 × 1,8 = 63, que vira **65**.
- 12,6 virou 13 (ao inteiro), e 21,6 virou 20 (a cinco). A regra de arredondamento não está escrita.

**G10. A coluna "Professor (soma)" nas Aulas.** CLAREZA.
- `custo-servicos.md:274`: "Um professor com pelo menos um ponto acima do aluno".
- A tabela `:280-290` dá o professor como **soma** (Atributo + Habilidade), inclusive para ensinar Atributo.
- **Por que é problema:** para ensinar Habilidade 2, o professor tem soma 6. A novata não acha onde está o "um ponto acima".

---

## Parte 2 · Trecho por trecho

### 1. `coracao-do-sistema.md`
- **Não entendi na primeira leitura:**
  - "+1d6 por nível, descartando o menor do pool" (`:91`). Lendo só isso, achei que se rola um dado a mais e se tira o menor dos dados **originais**. `habilidades.md:93-97` resolve com o exemplo.
  - O "Valor Passivo" aparece com a fórmula longa, e a tabela abaixo (`:97-107`) já não traz a Centelha.
- **Regra ainda não explicada:** Firula (G4).
- **Exemplo:** o do muro (G1). O do ladrão (`:93`) é bom.

### 2. `acoes-e-sistema.md`, os cinco modos
- **Não entendi:**
  - a Margem da Longa (D3);
  - o tamanho da perda na banda morta (D2);
  - por que o Passivo "quebra de propósito o escalonamento da média" (`:125`): a frase seguinte não explica a compensação.
- **Regra não explicada:** "jogada estendida" (D7).
- **Exemplo que faltou:** um Reflexivo com números. Os outros quatro modos têm exemplo ou tabela.

### 3. `criacao-de-personagem.md`
- **Não entendi:** com que Centelha começo (F1).
- **Regra não explicada:**
  - Técnicas e Proezas (passo 9), que só vêm depois;
  - "o Desperto, o degrau 2 da Centelha" (`:103`), que só se entende lendo `centelha.md`.
- **Exemplo que confundiu:** os derivados de Kael (A1). Conferi as contas de XP de Kael e todas fecham, menos a das Técnicas, que o próprio texto (`:170`) diz que não fecha.

### 4. `defesas.md`
- Capítulo claro. A frase "Social = você não quer ceder. Mental = tentam tirar de você a escolha de ceder" (`:20`) resolve quase tudo.
- **Não entendi:** quanto custa o "Sim" de queimar Vontade (`:104`; ver E8).
- **Faltou:** a Penalidade da armadura nas fórmulas (B3).

### 5. `combate.md`
- **Não entendi:**
  - em que Tick se rola (B1);
  - quanto vale o passo grátis (C1);
  - o que é a Corrida (C3).
- **Regra usada antes de explicada:** B5.
- **Exemplos:**
  - o de Sora (`:21`) usa a regra velha (A1);
  - os de Kael e Sora no movimento têm arredondamento contraditório (C2);
  - o da Pressão faltou (B2).

### 6. `quase-acerto.md`
- Claro e com conta certa.
- **Confundiu:** o exemplo do couro (`:28`) primeiro calcula "5 de raspão" e depois diz que não raspa. Lê-se duas vezes até entender que o 5 é hipotético.
- Ver também G2 e G3.

### 7. `centelha.md`
- **Não entendi:** a jogada só de Atributo (A2).
- **Contradição interna:** Energia e Mana do mortal (F2).

### 8. `aparencia-virtudes-vontade.md`, Força de Vontade
- **Não entendi:** o custo de resistir e de ignorar penalidades (E8, F5).
- A volta da Vontade (`:117`) é clara.
- **Fórmula velha:** `:129-131` (A1).

### 9. `vida-ferimentos-cura.md`, cura e descanso
- **Faltou:**
  - a recuperação abaixo de zero (F3);
  - o Atributo do Estabilizar (F4);
  - o que é "acelerar 10%" (F3).
- O exemplo de Bram (`:32`) confere: PV 34, dano 28, sobram 6, 18%, Grave.

### 10. As quatro Habilidades
- **Prontidão:** clara em `habilidades.md:43`. O Passivo dela tem duas fórmulas (E5).
- **Furtividade:** E1 a E4, e B3 na armadura.
- **Atletismo:** a ficha de Escalar é a mais completa que li. Os problemas são D1, D2, D5 e D6.
- **Sociabilidade:** E7. E a Defesa Social que ela sustenta tem duas fórmulas (A1).

### 11. `custo-servicos.md`
- **Não entendi na primeira leitura:** por que um trabalho perigoso paga 40 pc por **semana** a quem o aceita, e um perito de serviço comum custa 83 pc por **dia** (`:27`).
  - A resposta está em `:14` e `:40`: a bolsa é Livre (o líquido), e a diária é a renda (o bruto). Só entendi depois de reler as duas frases juntas.
  - **Sugestão:** um exemplo lado a lado.
- Ver G5 a G10.

---

## Parte 3 · As seis situações, só com o texto

### 1. Subir um muro
- **O que fiz:**
  1. Achei a ficha em `acoes-corpo-e-movimento.md:12`.
  2. Kael (Força 3, Atletismo 3, Escalada 2, Centelha 3) sobe uma muralha de pedra lavrada de 10 m, com a ronda chegando, ou seja Acumulada e intervalo Tick.
  3. Montei Força + Atletismo = 6, 3d6, +2 da Escalada, +6 da Centelha (2 × menor(3, 3)), contra Dificuldade 7. A média é 18,5, e o progresso esperado é 11,5 no primeiro Tick.
- **Onde travei:**
  - se a Margem (11,5 dá 1 Margem) soma mais 3 m (D1);
  - quanto perco se errar por 6 ou mais (D2);
  - se a Centelha se limita pela Escalada ou pelo Atletismo (D6);
  - e por que o exemplo do capítulo I faz a mesma coisa como Direta de Dificuldade 10 (G1).
- **Sem pressa (Longa):** travei em saber se o +2 da Escalada entra na média (D6). E notei que, com calma, Kael sobe mais devagar do que com pressa (D5).

### 2. Convencer um guarda
- **O que fiz:**
  1. Em `relacoes-sociais.md:42-55`, o guarda Neutro só dá "uma informação pública, uma troca justa". Deixar passar não está na tabela.
  2. Li como "te esconder da lei" (+3) ou "mentir à autoridade" (+4): seriam precisos 18 a 24 de folga (`:80`).
  3. Jogada: Influência + Persuasão (+ Aparência, `aparencia-virtudes-vontade.md:12`) contra a Defesa Social dele.
- **Onde travei:**
  - qual nível da tabela é "deixar passar";
  - se o Acerto da Abordagem (+0 a +3, `:140`) vale fora do Combate Social;
  - se o guarda de serviço "crava os pés" (`:126`) e vira Combate Social, com gasto de Vontade;
  - a Centelha no ataque social (`:138` contra A1);
  - e, se eu quisesse ameaçar, qual primária anda com a Intimidação (E6).
- **Faltou:** a Defesa Social de um guarda comum. O livro não dá esse número nos trechos que li. Os Valores Passivos de vigia (`acoes-sentidos-e-engano.md:20-23`) são só de Percepção.

### 3. Espada contra alguém de couro
- **Atacante:** Destreza 4, Força 3, Armas 3, Centelha 0, Espada Longa em uma mão.
  - Ataque: 7, ou 3d6 + 2, mais 1 da espada, 3d6+3, média 13,5 (`combate.md:124`, `armas-e-armaduras.md:65`).
- **Defensor:** Destreza 2, Esquiva 2, Centelha 0, Couro endurecido.
  - Esquiva = 8, menos 1 da Penalidade se ela entrar na Defesa (B3).
  - Contra Esquiva 7, a média acerta com 6 de folga: 1 Margem.
- **Dano** (`combate.md:177`): modo Cortante (o principal). 1d6 + 1d6 (Margem) + 3 (Força) + 0 (Centelha) − Absorção de Corte (2 do couro + 0 natural) dá média 8.
  - Contra PV 31, isso leva o defensor a 23, 74%: Saudável.
  - Para chegar a Grave (11-30%) por corte, o que abre Sangramento 1 (`vida-ferimentos-cura.md:70`), precisa de mais dois golpes desses.
- **Errando por 1 a 3:** raspão de 4 − 1 = **3** (`quase-acerto.md:22`, Margem 2 + 1).
- **Onde travei:**
  - em que Tick o golpe sai (B1);
  - se a Penalidade −1 do couro entra na Esquiva (B3);
  - se o segundo golpe da mesma rodada já pega −2 de Pressão (B2).
- O resto resolveu.

### 4. Esconder-se de uma patrulha
- **O que fiz:**
  1. "Esconder-se" está em `acoes-sentidos-e-engano.md:85`, sem ficha: Direta, Destreza + Furtividade, secundária Ocultação.
  2. Usei por analogia o Esgueirar: passar do Valor Passivo da patrulha.
  3. Patrulha de três guardas comuns: Valor Passivo 10, +1 por vigia a mais, ou seja **12** (`:59`). Escuridão, −4 (`:81`): **8**.
  4. Grupo de quatro: Teste Coletivo, +2 por pessoa, ou seja **16**, e rola o pior pool.
- **Onde travei:**
  - **a. O tempo.** "Continuar sumido" não tem intervalo nem regra de nova jogada quando a ronda volta (E3).
  - **b. A secundária.** Ocultação descreve objetos (E2).
  - **c. A armadura.** O guerreiro de cota de malha soma +4 na Dificuldade, ou a Penalidade dobrada, ou os dois (B3, E4).
  - **d. O estado do vigia.** Se a patrulha é "Normal" ou "Alerta" (`:63`) fica a juízo do Mestre. Isso tudo bem, mas não há exemplo.
  - **e. A fórmula do Passivo.** O Valor Passivo do guarda tem duas fórmulas, se ele tiver Centelha (E5).

### 5. Curar-se depois da luta
- **O que fiz:**
  1. Primeiro, estancar: Cura contra Dificuldade 10, ou Vigor + Resistência contra 10 sozinho (`vida-ferimentos-cura.md:75`).
  2. Depois, recuperar. Kael (PV 37, Vigor 4) com 12 PV (32%, Machucado) recupera 4 a cada 3 dias. Passa por 16 e 20 (ainda Machucado) e chega a 24 (65%, Saudável) em 9 dias; daí 4 por dia, cheio em mais 4 dias. São **13 dias**.
  3. Energia volta na cena, Mana por hora e Vontade 1 por noite (`aparencia-virtudes-vontade.md:117`).
- **Onde travei:**
  - o Atributo do Estabilizar (F4);
  - o efeito de um curandeiro de Cura 3, que custa "Tratamento diário, 10 pc" (`custo-servicos.md:228`). Os 30% encurtam os intervalos ou aumentam o PV? (F3);
  - e quem caiu abaixo de zero não tem linha na tabela (F3).
- Também não sei se o ferimento "mal tratado" piora (F3).

### 6. Pôr preço num trabalho de seguir alguém em segredo
- **O que fiz:**
  1. O livro tem o exemplo pronto: "Seguir em segredo quem não quer ser achado [...] Dificuldade 15, 1 semana, descobrir um fato ×1, 1 pessoa: **40 pc**" (`custo-servicos.md:107`).
  2. Para um caso meu (seguir um mercador por duas semanas numa cidade, trazer prova), fiz Valor × 2 semanas × 1,5 (prova) × 1 × 1.
- **Onde travei:**
  - **a. De onde sai a Dificuldade.** A bolsa usa "a Dificuldade dos testes decisivos" (`:67`), mas seguir alguém é Furtividade (`habilidades.md:40`), e no Esgueirar a Dificuldade "sai do observador" (`acoes-sentidos-e-engano.md:48-50`): Valor Passivo na Direta, 70% dele na Acumulada. Um mercador comum (Valor Passivo 10) dá Dificuldade 10 ou 7, e o valor da bolsa fica em 20 pc (Dificuldade 10) ou entre 13 e 20 (Dificuldade 7, que a calculadora interpola). **Duas leituras:** (1) usar o Valor Passivo do alvo; (2) usar uma Dificuldade da régua comum, como o exemplo do livro parece fazer com o 15 redondo.
  - **b. A Tarefa.** O rótulo é "Investigar", mas é seguir. Encaixei pela analogia com o exemplo.
  - **c. Bolsa ou serviço.** Se um rastreador faria isso "como serviço comum do ofício" (`:42`), o preço sairia da tabela de Serviços, e seguir alguém numa cidade pode ser serviço comum, ou não. O texto deixa ao Mestre, sem critério além de "sigilo, ilegal, perigoso".

---

## Nota de cobertura

- **Li inteiros:**
  - `coracao-do-sistema.md`
  - `acoes-e-sistema.md`
  - `criacao-de-personagem.md`
  - `defesas.md`
  - `quase-acerto.md`
  - `centelha.md`
  - `aparencia-virtudes-vontade.md`
  - `vida-ferimentos-cura.md`
  - `habilidades.md`
  - `custo-servicos.md`
  - `armas-e-armaduras.md`
  - `combate.md` (inteiro, embora o despacho pedisse só partes)
- **Li em parte:**
  - `acoes-corpo-e-movimento.md:1-80`
  - `acoes-sentidos-e-engano.md:10-109`
  - `relacoes-sociais.md:8-172`
  - quatro verbetes de `habilidades-secundarias.md`
- **Contas conferidas:**
  - XP de Kael linha a linha (fecha, menos as Técnicas);
  - a tabela de Aulas (as nove linhas fecham);
  - as chances de 56% e 55% de `acoes-e-sistema.md:27`;
  - o exemplo de Bram em Vida;
  - os dois exemplos de Quase-Acerto;
  - o exemplo do cavaleiro em `armas-e-armaduras.md:163`.
