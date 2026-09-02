# Fechamento · sétima rodada sobre o `04-prontidao.md`

Sobre o commit `d19dfaa`. **Nada da §0.6.1 foi implementado**: nenhuma linha de motor, nenhuma
bandeira, nenhuma migração, nenhum arquivo de `src/`. O que esta rodada faz é fechar o que a
prontidão deixou aberto, propagar o que ela reenquadrou, e registrar duas decisões novas.

Documentos citados: **R1** = `00-diagnostico.md`, **R2** = `01-diagnostico-carga.md`,
**P** = `02-projeto-harness.md`, **R3** = `03-respostas.md`, **R4** = `04-prontidao.md`.

> **Histórico:** o pedido chegou cortado no bloco 3 e as seções 1 e 2 foram entregues sozinhas. Os
> blocos **3 a 6** chegaram depois, com quatro correções da revisão incorporadas (§2.5), e estão
> respondidos abaixo. As seções **A** e **B**, no fim, são acréscimos meus daquela primeira entrega.

---

## 1 · O D4 briga com o D5

### 1.1 A dependência que você apontou, confirmada

Está certa, e é pior do que "os dois textos não dizem": os dois textos **moram no mesmo parágrafo**
da P §0.6.1 e mesmo assim não se viram.

- **D5** (R4 §D5, aplicado na P §0.6.1): bandeiras primeiro, que são as dez que não dependem do
  núcleo.
- **D4** (R4 §D4, aplicado no mesmo bloco): "desligada é inerte" se prova contra uma **branch
  congelada** no estado anterior à entrada da bandeira.
- **A prova de D4 é uma cena-espelho**, e a cena-espelho compara **dano** (R3 §1.1.1, a linha
  "resolução" da tabela de campos: `def` efetiva, `errouPor`, veredito, Absorção, dano líquido).
- **`rolagem.ts:11` é `Math.random`.** Duas execuções da mesma cena não dão a mesma sequência de
  dados, então a comparação não distingue "a bandeira mexeu" de "o dado caiu diferente". Nas palavras
  da R3 §1.1.1: *"Um espelho que compare dano compararia ruído."*

Logo o **item 12** (a semente injetada) precede o **item 11** (as bandeiras), e como o item 11 é o
primeiro pela D5, o item 12 precede **a ordem inteira**.

### 1.2 As outras nove do mesmo tipo

Procurei, item a item da P §0.6.1, toda prova cujo instrumento não existe naquele ponto da ordem.
São **dez ao todo**, contando a sua.

| # | Item | A prova prometida | O instrumento que ela exige | Existe ali? |
|---|---|---|---|---|
| **I1** | 11 · bandeiras | a inércia da desligada (D4) | a semente injetada (item 12) | **não** · é a sua |
| **I2** | 11 · bandeiras | idem | **a branch congelada, cortada antes de a primeira bandeira entrar** | **não existe como passo.** Nenhum texto manda cortá-la, e depois da primeira bandeira ela não pode mais ser cortada: o estado de referência já não existe em lugar nenhum |
| **I3** | 11 · bandeiras | idem | **um caminho do driver até a semente**: o item 12 injeta a fonte de acaso no módulo, e nada liga o módulo ao `puppeteer` que dirige a página | **não** |
| **I4** | 4 · N3 | "morte mútua no mesmo Tick" | a semente: sem ela, a cena mata os dois por sorte, e o teste falha em algumas execuções | **não** |
| **I5** | 6 · N6 | "as duas adagas saem com −4 e nada mais" | **um despejo do que a folha calculou** (o `fer` de `grid.astro:7435`, a Pressão, a distância). Hoje esses números só existem dentro do modal e nada os expõe ao driver | **não existe em lugar nenhum**, e é o mesmo instrumento que o teste-espelho precisa |
| **I6** | 2 · N4 | a cadeia dos cinco critérios | o sorteio do último critério vindo do fluxo semeado (o próprio item 2 já registra isso no "cuidado") | **não** · é o item 12 outra vez |
| **I7** | **todos**, via o critério de aceitação da D3 | "o teste-espelho sem divergir em nenhum campo" | **o outro lado do espelho, que é o motor do harness** | **não**: a P §0.6 diz que tudo entra na mesa **antes** de o harness ser escrito. O critério de aceitação de uma fase depende de um artefato da fase seguinte |
| **I8** | 11 · bandeiras | `test-contrato` e `test-quase-acerto` reescritos | nada de novo: é ordem dentro do item, e já está escrita ("no mesmo commit") | sim |
| **I9** | 5 · N5 | ordem inversa contra ordem da faixa | **a cadeia de N4** (item 2): sem ela não há "inversa" de nada | **não, se o 5 vier antes do 2**, e a ordem antiga não fixava os dois |
| **I10** | 1 · N1 | o período volta a ser o ciclo | nenhum: `test-simultaneo.mjs` é função pura sobre `combate-tempo.ts` | sim |

**As duas mais graves não são a sua.** A I2 tem prazo: a branch de referência é um recurso que
**deixa de ser criável** no instante em que a primeira bandeira entra, e nenhum documento a
mencionava como passo. A I7 é circular: o critério que declara a fase pronta exige um instrumento
que só existe depois da fase.

### 1.3 Como a I7 se resolve: o espelho eram dois

O nome "teste-espelho" estava cobrindo duas comparações diferentes, com propósitos e datas
diferentes:

| | **Espelho de inércia** | **Espelho de motor** |
|---|---|---|
| Compara | a mesa de hoje contra a mesa da branch congelada | a mesa contra o motor do harness |
| Serve para | provar que a bandeira desligada não mexeu em nada (D4) | provar que a cópia da R3 §1.1.1 não divergiu do original (Q6) |
| Precisa de | a semente (item 12) e o despejo (I5) | os dois acima **mais o harness** |
| Disponível a partir de | a Etapa 0 | depois do motor do harness |
| Entra no critério de aceitação de | **cada bandeira, uma a uma** | **a bateria**, e não a §0.6.1 |

Os dois usam o mesmo instrumento (a cena fixa, a semente, o despejo por Tick) e o mesmo comparador
de campos da R3 §1.1.1. O que muda é quem está do outro lado.

**Consequência escrita na P §0.6.1:** o critério de aceitação da D3 passa a ser
`build verde + espelho de inércia em cada bandeira + as provas item a item`, e o espelho de motor sai
dele e vira o portão da bateria.

### 1.4 A ordem, reescrita

**Etapa 0 · Instrumentação.** Nada é provável antes dela, e ela não muda comportamento nenhum.

1. **A branch congelada** (`sim/base-congelada`), cortada do commit corrente **antes de tudo**. É o
   único passo com prazo: depois da primeira bandeira ele é impossível.
2. **Item 12 · a semente**, em `rolagem.ts:11`, `mesa-ficha.ts:133` (a iniciativa),
   `artes-grid.ts:1342` (o dano de Arte) e no sorteio do último critério de N4.
3. **O caminho do driver até a semente** (I3): a página aceita a semente por parâmetro, do mesmo
   jeito que já aceita `?tempo=simultaneo`.
4. **O despejo por Tick** (I5): os campos da R3 §1.1.1 mais o que a folha calculou, expostos ao
   driver. É o instrumento dos dois espelhos e da prova do item 6.

**Etapa 1 · As dez bandeiras que não dependem do núcleo** (D5), cada uma com o espelho de inércia
contra a branch da Etapa 0, e `test-contrato` / `test-quase-acerto` reescritos no mesmo commit.

**Etapa 2 · O núcleo do Tick**, nesta ordem, que é a das dependências e não a da numeração:
item 1 (N1) → item 3 (N2, que só é observável com N1 ligada) → item 4 (N3) → item 2 (N4) →
item 5 (N5, que precisa da cadeia do 2) → item 6 (N6). As seis bandeiras do núcleo entram junto.

**Etapa 3 · A migração 29** (item 7) e a tela (itens 8 e 9).

**Etapa 4 · O item 10** (Q7, as condições que expiram), que é isolado.

**O que caiu:** a frase "o **11** é o maior e o mais arriscado, e vale por último", que sobreviveu à
D5 dentro do mesmo parágrafo que dizia "bandeiras primeiro". As duas não podiam estar certas, e o
item 11 **é** as bandeiras.

**O que também caiu:** "o **6** depende dela [da migração] se o retrato for para o banco". O retrato
ficou em memória pela P §0.8.2, então o item 6 não depende do 7.

---

## 2 · A âncora dupla, recontada

### 2.1 (2b) O E10 já tinha sido consertado; o que faltava era o nível

A premissa do pedido vale para a **R4 §B.3**, que descreve o estado anterior. A P §0.10.1 foi
reescrita em 02/09 junto com a resposta da D1 e **as duas âncoras já carregam peça entrando no meio**
("com uma peça entrando no meio da cena" na mediana, "idem" na extrema).

O que continuava faltando é outra coisa, e ela deixava as duas comparações de E10 no ar: **o eixo tem
três níveis** (declara primeiro · declara no Tick seguinte · entra por último, P §0.46) e **nenhuma
âncora dizia em qual deles se senta**. Sem isso, "as 2 comparações de E10" não têm de onde partir.

**Resolvido, e escrito na P §0.10.1:** as duas âncoras sentam em **"declara no Tick seguinte"**, que
é a regra corrente da §0.46 para quem entra no meio. As duas comparações são "declara primeiro" e
"entra por último". **Nenhuma exceção a "cada fator medido nas duas" é necessária para o E10.**

### 2.2 (2c) A mesma inércia atinge outros cinco lugares, e um deles é pior que o E10

#### O E9 é inerte na âncora extrema, e por um motivo que já tinha sido decidido e nunca aplicado

A âncora extrema roda política **Agressiva**. A P §0.4 P4 define o Agressivo em três regras
ordenadas, e **nenhuma delas lê declaração de ninguém**: a 1 olha alcance e Vida, a 2 olha posição, a
3 é "nunca abortar". Ligar ou desligar o E9 sobre ele não muda uma única decisão. A diferença é
**zero por construção**, exatamente o defeito que a R3 §1.4 já tinha diagnosticado na política cega.

E a correção já estava escrita. A R3 §1.4 e a P §0.47 fecham as duas com a mesma frase: *"o Agressivo
ganha uma regra de leitura para o E9 fazer sentido nele também: se o inimigo mais próximo já tem
golpe declarado de outro aliado caindo neste Tick, escolhe o segundo mais próximo"*. **Ela nunca foi
aplicada na §0.4 P4**, que é a lista executável.

Olhando de perto, o buraco é maior que uma linha: **as políticas têm duas especificações que ninguém
juntou.**

| | P §0.4 P4 | P §0.47 |
|---|---|---|
| O que é | a lista **ordenada** de regras, que é o que o robô executa | uma linha por perfil sobre **o que cada um faz com o que vê** |
| Traz leitura? | nenhuma, nos cinco perfis | em todos os cinco |
| Traz ordem? | sim, e a ordem decide o comportamento | não, e a §0.47 diz que "a posição dela na ordem decide se ela tem o que ler" |

Duas listas, nenhuma completa, e a §0.47 dizendo que a posição importa sem dizer qual é.
**Resolvido: a §0.4 P4 foi reescrita como especificação única**, com as regras de leitura da §0.47
inseridas em posição declarada e **marcadas**, porque são exatamente as que o E9 desliga. E ficou
escrito o que cada perfil faz quando o E9 está desligado: **a regra marcada é pulada, e a avaliação
cai para a regra seguinte.** Sem isso, "cego" não é um estado definido.

Correção de rota minha, de passagem: a R3 §1.4 afirma que "o Cauteloso, o Tocaiador e o Guarda-costas
são os três cujas regras de fato leem alguma coisa". Contra a **§0.4 P4** isso é falso: só o Cauteloso
lê (a regra 2, "se o inimigo mais próximo está em fase de Golpe"). Contra a **§0.47** é verdadeiro,
porque lá os cinco leem. A frase estava certa sobre um documento e errada sobre o outro, e com a
fusão passa a ser verdadeira sobre os dois.

#### O E4 não é inerte, mas destrói a âncora em que for medido

O nível assimétrico de E4 está definido por **arquétipo**: "o Montanteiro orc de placa completa de um
lado e o Duelista elfo de couro do outro" (P §0.4 P6). Esses dois arquétipos carregam montante
(ciclo 7) e espada curta (ciclo 5). Aplicar E4 sobre a âncora extrema, que é **uníssono**, troca as
armas dos dois lados e **apaga o nível de E1 da âncora**: a comparação deixa de ser "o que a
assimetria de passo faz" e passa a ser "o que a assimetria de passo e a troca de ciclo fazem juntas".

**Resolvido:** o passo sai de `deslocamento()` (`calc.ts:145-151`), que recebe traços e a fração da
raça, e a **arma não entra na conta**. Então o nível assimétrico de E4 passa a ser definido por
**raça e armadura**, mantendo a arma da célula: orc de placa completa contra elfo de couro, os dois
com a arma da âncora. O par continua com razão de passo ≥ 2 e o E1 sobrevive.

#### Sete das dezessete comparações de E5 não podiam morder

Este é o achado grande da rodada, e ele não é sobre a âncora extrema: é sobre a bateria inteira.

| Bandeira | Morde na âncora? | Evidência |
|---|---|---|
| `margem` | **sim** | qualquer acerto acima da Defesa |
| `gate` | **não** | `gatePerfuracaoAbre` (`calc.ts:130-135`) só avalia o modo **perfurante**; corte e impacto passam sempre. As armas das duas âncoras atacam de **corte** no modo principal |
| `couraca` | **não, e não é bandeira** | ver abaixo |
| `porte` | **não** | `porteAcerto` é a **diferença** de porte entre atacante e alvo, e `racas.json` não tem porte em nenhuma das 8 raças: elenco de PC tem diferença 0 sempre |
| `bloqueio` | **sim** na extrema (o Escudeiro tem heater) | P §0.4 P5 |
| `modo2` | **não** | nenhuma das cinco políticas troca de modo de dano: elas escolhem manobra (`simples`, `rajada`, `segura`) |
| `teto6` | **não se sabe** | precisa que os modificadores situacionais somem mais de 6, e sem condições em cena isso é raro. Não é inércia estrutural, é falta de instrumento |
| `curaSemArea` · `curaDivide` | **não** | nenhuma âncora tem quem conjure |
| `porRodada` | **não** | as cinco condições de dano por rodada vêm de Arte no repertório escolhido, e não há conjurador nas âncoras |
| `n1` a `n6` | **sim** | são o núcleo do Tick, e valem em qualquer cena |

**Sete comparações mortas**, e como cada uma era medida nas duas âncoras, eram **catorze das 52
células de OFAT produzindo zero por construção**. Três delas (`couraca`, `porte`, `modo2`) eram
inertes em **todas** as 107 células, não só nas âncoras.

#### E a `couraca` não é uma bandeira de tempo de execução

A P §0.7 lista `couraca` como "não existe em lugar nenhum; `combate.md:120-136` tem a régua".
**Está errado.** Ela existe e é aplicada, só que em **tempo de geração**: `gen-bestiario.mjs:36-45`
lê `regras.dano.couracaPorte` e a linha 79-82 soma a couraça na Absorção de cada criatura, só nos
modos letais. O que está no `monsters-mesa.json` já vem com ela dentro.

Duas consequências:

1. **Ligar e desligar `couraca` não é ler um booleano**, é regerar o bestiário. Uma bandeira que a
   ligasse em tempo de execução somaria a couraça **de novo**, por cima da que já está assada no
   `absorcao`. É a mesma armadilha da `bestiario-centelha-b10`: correção por cima de arquivo gerado.
2. **Ela é regra de criatura**, e por isso valia zero num elenco de PC: `couracaPorte` dá 0 para
   `medio` e menores, e sobe só a partir de `grande` (2 · 4 · 7 · 10).

**Resolvido:** `couraca` **sai das dezesseis bandeiras** e passa a ser uma propriedade do elenco. O
que se compara não é ligada contra desligada, é **um par de células com criatura grande ou enorme
contra o mesmo par com criatura média**, e a diferença carrega junto a couraça e o porte, que é como
elas existem no jogo. As bandeiras passam a ser **quinze**, e E5 a **17 perfis**.

### 2.3 Duas decisões novas, e as respostas

#### D10 · O elenco é só de PC?

**A pergunta.** `couraca` e `porte` são regras de criatura, e o elenco dos sete arquétipos (P §0.4
P5) é 100% de PC, então as duas nunca mordem em célula nenhuma.

> **RESPONDIDO: PCs e criaturas do bestiário, os dois, fazem parte dos testes de combate.**

O que isso muda:

- **entra um eixo, E11 · natureza do elenco**, com três níveis: PC × PC · PC × criatura ·
  criatura × criatura. Em OFAT custa 2 comparações por âncora;
- **entram quatro arquétipos de criatura**, escolhidos pelo mesmo critério dos sete de PC (cada um
  exercita o que os outros não), na P §0.4 P5;
- **`porte` passa a morder de verdade**, e forte: `porteAcerto.porDiferenca` é `[0, 3, 6, 9, 12]`,
  então um Grande contra um Médio já são ±3 no acerto, e um Enorme, ±6;
- **`gate` ganha onde morder** sem depender de arma perfurante entre PCs: a resistência natural de
  Perfuração sobe com o porte (`enorme` 1, `imenso` 2, `colossal` 3) e fecha contra adaga (pen 0);
- **o cruzamento E11 × E3** (criatura na horda) vira a cena que a mesa de verdade joga: o mestre com
  bicho de um lado, os PCs do outro.

#### D11 · Ninguém troca de modo de dano

**A pergunta.** `modo2` é inerte na bateria inteira porque as políticas escolhem manobra e nunca
modo. E isso distorce o `gate`: a adaga tem Perfuração 0 no modo principal, então contra malha
(`resistPerf` 1) ela dá **dano 0 em todo golpe, para sempre**, e a bateria reportaria "o gate é
devastador" quando a resposta certa seria "o robô não troca para o corte".

> **RESPONDIDO: as políticas ganham regra de modo.**

A regra, marcada como invenção ⚑ e escrita na P §0.4 P4 para os cinco perfis:

> *Se o modo principal da minha arma é perfurante e a Perfuração dela está abaixo da resistência de
> Perfuração do alvo, e a arma tem modo secundário, ataco no modo secundário.*

É a escolha óbvia que qualquer jogador faria na mesa, custa `−2` de acerto e `−1d6` (que é
exatamente o que `modo2` liga), e tira do `gate` o artefato de medir a burrice do robô. Continua
sendo número inventado e vai no cabeçalho do relatório, na tabela do que foi inventado.

### 2.4 (2a) A grade recontada

| Bloco | Células | Como se lê |
|---|---:|---|
| Núcleo cruzado `E1 × E2 × E3` | **48** | três grades de 4×4, uma por nível de E3 |
| Um fator de cada vez, em volta de **cada** âncora: `E4 (1) + E6 (4) + E7 (1) + E9 (1) + E10 (2) + E11 (2) = 11` | **22** | **uma** tabela de 11 linhas e duas colunas |
| E5 · o núcleo do Tick (`n1` a `n6`), nas duas âncoras | **12** | 6 linhas, 2 colunas |
| E5 · o perfil todo desligado, nas duas âncoras | **2** | 1 linha, 2 colunas |
| E5 · as nove bandeiras não-núcleo, **na âncora extrema**, que é a referência única do F5 | **9** | 9 linhas |
| E5 · as **seis** que não moram na âncora, medidas **também na hospedeira**, onde elas mordem | **6** | 6 linhas |
| E5 · `margem`, `bloqueio` e `teto6` **também na mediana**, para a aditividade fechar nas duas âncoras | **3** | 3 linhas |
| Células hospedeiras novas: a do **Conjurador de adaga** e a do **Lanceiro de lança** | **2** | |
| Níveis de controle (D6 e D7) | **2** | 2 linhas |
| Cruzamentos deliberados | **6** | 6 linhas |
| **Total** | **112** | |

| | |
|---|---|
| Repetições | 500 por célula, e 2.000 nas de cauda |
| **Batalhas** | **56.000**, mais o reforço |
| Tempo de máquina | da ordem de 50 segundos, pela §4.2 da `03-respostas.md` |

**Onde cada bandeira mora**, porque medir uma bandeira numa célula onde ela não morde foi o defeito
que esta recontagem conserta:

| Bandeira | Célula em que morde | Também na âncora? |
|---|---|---|
| `margem` · `bloqueio` · `teto6` | a âncora extrema | é a mesma célula |
| `gate` | a do **Lanceiro de lança** (modo único, Perfuração 1) contra o **Montanteiro de placa completa** (`resistPerf` 3) | sim, e dá zero |
| `modo2` | a do **Conjurador de adaga** (Perfuração 0) contra a **malha** (`resistPerf` 1), que é onde a regra ⊕ dispara | sim, e dá zero |
| `curaSemArea` · `curaDivide` · `porRodada` | a do Conjurador, a única com quem conjure | sim, e dá zero |
| `porte` | a célula `E11 = PC × criatura` | sim, e dá zero |
| `couraca` | **saiu**: virou propriedade do elenco (§2.2) | |

**O critério do orçamento, respondido.** A P §3 nunca limitou a grade por máquina: *"o orçamento não
é a máquina, é o que se consegue ler: 144 células já são mais tabelas do que se lê numa sentada"*.
Aquele aviso contava **célula = linha**, porque a grade era fatorial. Aqui não é:

- as 48 do núcleo se leem como **três grades de 4×4**, e não como 48 linhas;
- as 22 do OFAT se leem como **uma tabela de 11 linhas com duas colunas**, uma por âncora. **A
  segunda âncora não custa uma linha nova: custa uma coluna**, e é essa a resposta à pergunta;
- o resto são 30 linhas em quatro tabelas curtas.

Total para o leitor: **3 grades de 4×4 e cerca de 50 linhas de comparação**, contra as 31 linhas da
versão de 79 células. **Passa.** E vale notar o que quase reprovou: não foi a segunda âncora, foi
medir as dezesseis bandeiras **duas vezes cada** (34 linhas), catorze delas em células onde a
bandeira não podia mexer em nada. Tirar isso pagou a segunda âncora, as criaturas, o eixo E11 e a
segunda leitura do F5, e a grade ficou 2 células acima da de 107.

---

## 2.5 · Quatro correções, depois da revisão

Nenhuma delas muda uma decisão. Três são erros meus e a quarta é uma consequência que eu não tinha
rastreado.

### C1 · A soma da grade estava errada: era 102, e eu escrevi 103

Os blocos da §2.4 somavam `48 + 22 + 12 + 2 + 9 + 1 + 2 + 6 = 102`, e o total dizia **103**. Erro de
aritmética, não de bloco: o número saiu errado da minha conta e foi propagado assim mesmo para a
`02` §0.5, §0.10.1 e §3 e para o **L6** do `Pendencias.md`.

O que salva o número **não** é o erro: é a C2. O conserto do `gate` acrescenta exatamente a célula
hospedeira que faltava, então uma grade com uma hospedeira só somaria 102 e a com duas soma 103. O
103 que circulou estava certo pelo motivo errado, e nenhum dos cinco lugares tinha como saber disso.

**Com a resposta do F5 (C3) e as três células da mediana (§6b) a grade fecha em 112**, e desde então
a soma é conferida bloco a bloco antes de circular.

### C2 · O D11 tinha matado a célula que hospeda o `gate`

A regra ⊕ manda trocar para o modo secundário quando a Perfuração da arma está abaixo da resistência
do alvo. A hospedeira escolhida para o `gate` era o **Conjurador de adaga contra malha**, que é
**exatamente a situação que a regra ⊕ manda evitar**: a adaga tem modo secundário, a política troca
para o corte, o perfurante nunca é usado e o `gate` mede zero. Trocava-se o artefato "o robô é burro
e o `gate` parece devastador" pelo artefato "o robô é esperto e o `gate` parece inútil".

**Resolvido:** o `gate` precisa de uma peça **sem modo secundário**, para a regra ⊕ não ter para onde
fugir. A lança tem **um modo só** (`armas.json`: `lanca`, um modo, perfurante, Perfuração 1), e a
placa completa tem `resistPerf` **3**. Então:

| | Hospedeira | Por quê |
|---|---|---|
| **`gate`** | **Lanceiro de lança × Montanteiro de placa completa** | `1 < 3` fecha o gate, e a regra ⊕ não dispara porque não há modo secundário. O dano é 0 e não há como evitá-lo |
| **`modo2`** | Conjurador de adaga × Escudeiro de malha | `0 < 1` faz a regra ⊕ **disparar**: troca para o corte e paga os −2 e −1d6 |

As duas usam arquétipos que já existem na §0.4 P5. E as duas juntas dizem uma coisa que nenhuma
dizia sozinha: **a mesma regra ⊕ que torna o `modo2` mensurável numa célula é o que mata o `gate` na
outra**, e por isso as duas bandeiras não podem morar juntas.

### C3 · A conferência de aditividade do F5 tinha morrido em silêncio

Ela dependia de os deltas saírem todos da mesma referência, para somarem e serem comparados com o
perfil todo-desligado. Com cada bandeira medida na célula em que morde, `margem` sai da âncora
extrema, `gate` da hospedeira do Lanceiro e `porte` da célula de criatura: **deltas medidos contra
referências diferentes não somam**, e a conferência morreu sem ninguém registrar.

Uma coisa a registrar junto, porque muda o tamanho da perda: **ela já estava fraca antes**, e pelo
mesmo motivo que esta rodada achou. Sete das dezessete comparações davam delta **zero na âncora**, e
a soma "batia" trivialmente para essas sete. O que se perdeu não era uma conferência sobre dezesseis
bandeiras: era uma sobre nove, com sete zeros embutidos.

> **DECIDIDO em 02/09: referência única, medindo duas vezes.** As seis bandeiras que não moram na
> âncora extrema (`gate`, `modo2`, `curaSemArea`, `curaDivide`, `porRodada`, `porte`) são medidas
> **também lá**, para todos os deltas saírem da mesma referência e a soma voltar a fazer sentido.

O que isso custa e o que entrega, escrito para quem for ler o relatório:

- **+6 células**, não +9: `margem`, `bloqueio` e `teto6` já moram na âncora extrema e não têm segunda
  leitura a fazer. A grade vai de 103 para **109**, e para **112** com as três da mediana (§6b);
- **as seis leituras extras são zero por construção**, e por isso a conferência de aditividade tem
  força sobre **nove** bandeiras (`margem`, `bloqueio`, `teto6` e as seis do núcleo do Tick) e é
  trivial sobre as outras seis;
- **a leitura que diz quanto cada bandeira vale continua sendo a da hospedeira.** A da âncora serve
  só à soma. As duas vão para o relatório com o rótulo de qual é qual, senão a linha do `gate` na
  âncora seria lida como "o gate não faz nada".

### C4 · Dois riscos da prontidão mudaram, e a §B dizia que nenhum tinha sido mexido

A afirmação de que os cinco riscos da `04-prontidao.md` §F não foram mexidos estava errada: dois
foram, e os dois pela mesma rodada.

| Risco | O que mudou |
|---|---|
| **F5** · as bandeiras não somam | é a C3 acima. O sinal dele (a diferença entre tudo-desligado e a soma dos deltas) tinha deixado de ser calculável, e voltou com a referência única, com o alcance real escrito |
| **F4** · a âncora satura e o OFAT sai nulo | mudou de forma com as duas âncoras. O sinal antigo (o pico de paradas já estar no teto) continua valendo **para a extrema**; a mediana não é uníssona e precisa do seu próprio, que é o que separa saturação de efeito nulo de verdade |

**O sinal novo da mediana**, escrito na `04-prontidao.md` §F4: se os quatro eixos (E4, E7, E9, E10)
saírem nulos **nas duas** âncoras e o pico da mediana estiver **longe** do teto, não é saturação, são
os eixos que não fazem nada, e o problema não é a âncora. Se saírem nulos **só na extrema**, a
saturação está confirmada e as leituras que valem são as da mediana. Sem as duas âncoras essa
distinção não existia, e era ela que o F4 não sabia fazer.

---

## 3 · O D8b, propagado

Ele estava registrado como decisão e não tinha chegado ao desenho. Chegou agora, e a §2.6 do `02`
foi reescrita inteira.

### 3a · A §2.6 reordenada

A régua subiu para o topo da seção, porque é ela que ordena o resto, e a tabela única virou **três
blocos**:

| Bloco | O que ele decide |
|---|---|
| **As principais · por etapa** | são as que **reprovam** uma regra, e cada uma vem etiquetada com qual dos dois critérios do D8b ela serve: **carga do mestre** ou **espera do jogador** |
| **O contexto · por batalha** | descrevem a cena e **não reprovam nada** |
| **O diagnóstico do motor** | conferem o modelo (a forma fechada da R2 §H1, a sincronia da §H3) e nunca foram carga nem espera |

**O que mudou de posição:**

- **subiram para principal:** tempo morto, adiamentos e maior deslize, e fração de Ticks vazios. As
  três descrevem **espera**, que é metade do critério, e estavam perdidas no meio da lista;
- **desceram para contexto:** **paradas por batalha** e **gestos por batalha**, que eram as duas
  primeiras da tabela antiga, mais Ticks por batalha e fração de batalhas que não terminam;
- **viraram bloco próprio:** N(T) e a fração de golpes em Tick múltiplo de 6.

**O que deixou de ser critério de reprovação:** a **duração da batalha**, em qualquer forma, e junto
com ela **taxa de vitória e dominância**. As três continuam calculadas e param de decidir se uma
regra fica. A gramática ficou escrita em uma frase na §2.6: *uma regra que dobre a duração e mantenha
a carga por Tick é neutra pelo critério; uma que encurte a batalha e dobre os cliques por etapa é
ruim.*

### 3b · A §3, varrida

A previsão de E5 era o caso mais claro, e não era o único. Três das cinco estavam na unidade
descartada:

| Previsão | Estava | Ficou |
|---|---|---|
| **E5** | "deve encurtar a batalha e por consequência **abaixar a carga total**" | as nove bandeiras não acrescentam caixa nenhuma: `margem` muda o número dentro da folha que já abriu, `bloqueio` muda a Defesa comparada, `gate` **tira** um gesto (dano zerado dispensa a escrita de `pv_atual`, §0.8.1) e `modo2` **acrescenta** um, que é a escolha do modo. Previsão falsificável: a carga por Tick com o perfil cheio fica a menos de um gesto da carga com tudo desligado, e a única que a move visivelmente é a `modo2`, para cima |
| **E1** | "o **total** de paradas por batalha deve mudar pouco" | a **média** de paradas por Tick muda pouco; o que E1 move é a **cauda**, e a previsão é sobre o p99 e o pico |
| **E3** | "domina o **total** de paradas" | domina a **carga por Tick**, quase linearmente no número de peças |
| **E4** | "ou a batalha fecha, ou não fecha nunca" | continua valendo, com a etiqueta de que isso é **contexto**: em unidade de critério o que E4 mostra é o **maior deslize** e os **adiamentos por ação** |
| **E2** | já estava certa | tempo morto e Tick vazio são as duas por etapa |

**E a varredura achou uma coisa fora da §3, que era o pior caso da unidade errada: a conta das 500
repetições.** Ela dizia *"a quantidade mais ruidosa é o número de paradas **por batalha**, que herda a
variância da duração"*, e é dela que sai o `n` de toda a grade. Com a métrica principal em paradas
por Tick, **o fator duração saiu do numerador e foi para o denominador**, então o CV deve ser
**menor**, e um CV menor pede um `n` menor. As 500 continuam valendo até o piloto falar, que já está
especificado para medir o CV da métrica nova; se ele vier em 0,3, o `n` da média cai para ~140 e
quem passa a mandar é o piso de 400 do p95. **O número que pode encolher é o da média, nunca o da
cauda**, e a conta da cauda não muda porque ela é sobre batalhas e não sobre a unidade da métrica.

Também ganharam nota duas passagens que afirmavam coisas que o D8b tornou falsas: a de que descartar
a batalha não terminada "enviesa para baixo tudo o que cresce com a duração, que é justamente a
carga" (a carga que reprova não cresce mais com a duração), e a da §4 que dizia que sem morte não há
nada (o que se perde ali é tudo métrica de contexto agora).

### 3c · As seis métricas da R4 §A.2 entraram

Elas nasceram na §0.45 e na §0.7 e viviam fora da lista. Depois do D2 têm campo, e agora têm lugar:

| Métrica | Bloco | Distribuição ou média, e por quê |
|---|---|---|
| Tempo morto de **quem perseguiu** contra quem já estava no alcance | **principal**, espera | duas distribuições lado a lado: é espera, e espera vai com a cauda. Vem do `decl.viagem`. É também o sinal do risco F2 |
| Taxa de acerto dos dois grupos | contexto | duas proporções, com intervalo binomial |
| Tick em que o conjurador cruza **30% e zero** de Mana | contexto | distribuição, mais a fração das batalhas em que o zero **não** aconteceu, senão a distribuição mente por censura |
| Fração das batalhas em que ele **termina esvaziado** | contexto | proporção, com intervalo binomial |
| Quantas ações ele passa **como lutador de adaga** | contexto | **média**, e ela cabe: é razão de dois contadores dentro da mesma batalha |
| Fração dos golpes que caem **no Tick da chegada** | diagnóstico | proporção, com intervalo binomial. Vem do `passo.chegou` |

### 3d · Como o relatório impede que um zero minta

Esta é a consequência direta de o E5 ter mudado de estrutura: a mesma bandeira aparece com **duas
leituras**, a da hospedeira (que diz quanto ela vale) e a da âncora extrema (que existe só para a
soma do F5 e é **zero por construção**). Sem instrumento, as duas se parecem.

**O instrumento é um contador de ocasiões, por bandeira e por célula: quantas vezes a pré-condição da
regra ocorreu.** Não é o delta, é a ocasião, e custa um inteiro no agregado.

| Ocasiões | Delta | O relatório imprime |
|---:|---|---|
| **0** | qualquer | **`não exercitada`**, nunca um número |
| **> 0** | ≈ 0 | **`0,0 em n ocasiões`**: a regra rodou e não mudou o resultado. Isto sim é achado |
| **> 0** | ≠ 0 | o número, com o intervalo |

**A unidade da comparação é a mesma das principais**: a leitura de uma bandeira é o delta de
**paradas por Tick**, **gestos por golpe aplicado** e **tempo morto**, medido entre o perfil cheio e
o cheio-menos-ela **na mesma célula**. Nunca em paradas por batalha, que foi o que o D8b descartou.

Três coisas caem de graça daí: o `teto6` sai de "não se sabe" (o contador diz quantas vezes os
modificadores passaram de 6); as seis leituras de âncora do F5 saem todas como `não exercitada`, que
é a leitura honesta delas; e o contador vira **a prova de que a hospedeira foi bem escolhida**, que é
exatamente o erro que a regra ⊕ quase produziu no `gate`.

---

## 4 · O risco que faltava

### 4a · F0 · A mesa quebra

Os cinco riscos da R4 §F são todos do mesmo tipo, "a bateria roda e não serve". Faltava o outro tipo,
e ele é o mais grave, porque não custa o experimento: custa o jogo. Entrou na R4 como **F0**, escrito
no formato dos outros, e os outros cinco **não foram renumerados**, porque os outros documentos já os
citam por número.

**O risco.** A Etapa 1 acontece na mesa em que se joga. Mexe em cinco arquivos de regra, obriga a
reescrever os dois testes que hoje congelam o estado errado, e o que ela liga não é decoração:
`bloqueio` muda a Defesa de quem tem escudo em uns 5 pontos, `margem` muda o dano de todo golpe acima
da Defesa em uns 47%, `gate` pode zerar dano que hoje sai.

**Os quatro sinais, em ordem de quando aparecem:** o espelho de inércia acusar diferença numa
bandeira **desligada** (o mais cedo, e o único que aparece antes de a mudança chegar à mesa);
`test-kael.mjs` mudar de número sem ninguém ter decidido; **o teste reescrito passar de primeira**
(reescrever o teste para o código em vez de para o contrato é como um número errado vira linha de
base); e, tarde demais, a Defesa de uma peça mudar entre dois Ticks de um encontro aberto.

**O que se perde se tarde:** não a bateria, a mesa. Um encontro com números que mudaram no meio, uma
ficha salva que passa a somar diferente, e a confiança de quem joga, que é o único recurso desta
lista que não volta com um `git revert`.

**Ordem de gravidade: primeiro.** É o único cujo pior caso acontece enquanto alguém está jogando.

**O buraco, e o que se decidiu sobre ele.** Três dos quatro sinais já têm quem os pegue. O quarto não
tinha nada, e não é erro de programação: o perfil vive no `regras.json`, um deploy troca o
`regras.json`, e um encontro aberto continua de onde parou com outro chão.

> **DECIDIDO em 02/09: o encontro carimba o perfil ao começar.** Uma coluna `encontros.perfil jsonb`,
> escrita **uma vez** na criação do encontro e lida por ele dali em diante. Zero gravação por Tick,
> então respeita o orçamento da §0.8, e é o mesmo princípio do `dados_hash` que a bateria já carimba
> no manifesto. **Isso passa a bloquear a Etapa 1**, e é a única coisa que bloqueia.

**O preço da primeira versão, pago no fechamento final.** Ela dizia: um encontro esquecido fica
rodando o perfil antigo para sempre, e a §0.6 tinha decidido que o padrão em produção é **ligadas**.
Isso é o mesmo problema com o sinal trocado, o chão **congela** em vez de mudar, e ninguém vê. Duas
propriedades a mais consertam:

- **visível:** o perfil carimbado aparece na tela do encontro, e diz quando **difere** do perfil de
  produção. É o que tira o congelamento da invisibilidade;
- **recarimbável:** o mestre recarimba de propósito, com o perfil corrente, numa ação explícita. É o
  que transforma o carimbo de armadilha em ferramenta: quem quiser as regras novas numa cena velha
  aperta o botão, e quem não quiser não é atropelado no meio de um Tick.

**Onde entra e o que custa:** é o item **1.0** da ordem (`02` §0.6.1), antes da primeira bandeira,
porque uma bandeira que suba antes dele sobe para uma mesa desprotegida. E continua custando **zero
gravação por Tick**: uma escrita na criação do encontro, mais uma por recarimbagem deliberada; a
leitura sai da linha do encontro, que já está carregada, e a comparação com o perfil de produção é
entre esse `jsonb` em memória e o `regras.json` que já vem no pacote. Nenhuma consulta nova, nem no
avanço do Tick nem fora dele.

### 4b · O F4 e o F5, atualizados

Feito na rodada anterior a esta e conferido aqui: o **F5** perdeu a conferência de aditividade como
ela existia (deltas contra referências diferentes não somam), ganhou a forma nova com **referência
única** e ganhou o registro de que **já estava fraca antes**, porque sete das dezessete davam delta
zero na âncora. O **F4** ganhou o **sinal da mediana**, que é o que separa saturação de efeito nulo de
verdade. E a §B deste documento, que afirmava que os cinco não tinham sido mexidos, foi corrigida.

### 4c · Os outros três, conferidos contra a grade nova

| | Mudou de premissa? |
|---|---|
| **F1** · a bateria mede a minha política | **sim, e para pior.** A fusão das duas especificações (§2.2) deixou as cinco listas **maiores**, com a regra ⊙ e a regra ⊕ em cada uma. Mais regra por política é mais variância entre políticas, então o F1 ficou **mais** provável. E o peso delas na grade subiu: E6 tem 4 comparações em volta de cada âncora, oito células |
| **F2** · o `aid` entra errado | **sim.** Com criaturas no elenco, o `aid` tem de nascer em **dois caminhos de código**: os PCs passam por `resumoCombatePC`, as criaturas trazem o bloco pronto do `monsters-mesa.json` e não passam por lá. Um `aid` emitido só no caminho de PC deixa metade das batalhas sem tempo morto, com o mesmo sintoma do risco original: um número menor e crível |
| **F3** · a tabela de custo de tela está errada | **sim, e é concreto.** A regra ⊕ do D11 **acrescentou um gesto de tela** que a tabela não tem linha para cobrar: escolher o modo de dano é um clique. A tabela foi lida do código de 02/09, quando ninguém trocava de modo. Sem a linha, o `modo2` sai medindo dano e não custa gesto nenhum, que é o oposto do que ele faz |

---

## 5 · A decisão do F1

O F1 identificava o sinal (no piloto, a variância entre políticas contra a variância entre células do
núcleo) e não dizia o que fazer se ele acendesse. As quatro respostas, a recomendada e o
contra-argumento estão escritos na **R4 §F1**. Em resumo:

> **RESPONDIDO: uma política só, e a política vira grade própria.** Toda a grade roda Agressiva, o E6
> sai do um-fator-de-cada-vez e vira uma bateria pequena separada, que responde "quanto a política
> pesa".

**De onde veio a resposta, conferido no fechamento final:** de sessão com você, em 02/09. Ela foi
perguntada no chat, com as quatro opções desta tabela, a recomendada marcada e o contra-argumento
escrito, logo depois de você mandar o bloco 5 pedindo exatamente isso ("Traga no formato do D... Não
escolha por mim"). A resposta escolhida foi a primeira. **Mantida.**

**O motivo:** separa as duas perguntas em vez de contaminar as duas, não inventa eixo nenhum e a
leitura do núcleo cruzado sobrevive inteira.

**O argumento contra, que continua de pé e vai para o relatório:** fixar uma política **é** uma
escolha inventada, só que escondida, e "o sistema sob a Agressiva" é afirmação mais estreita do que "o
sistema sob cinco políticas, reportado condicionalmente". Pior: o critério do D8b é carga do mestre, e
quanta carga existe depende de quantas decisões a política gera por Tick, então escolher a política é
escolher o nível da coisa que se está medindo. E se a interação for real, ou seja, se uma regra só
importar para quem joga cauteloso, fixar a política esconde exatamente o achado que a bateria existia
para encontrar.

**Isto só acende se o sinal acender.** Enquanto ele não acender, a grade continua com E6 no
um-fator-de-cada-vez, como está na §0.10.1.

---

## 6 · Conferência final

### 6a · A hospedeira do `gate` tem um lado que fere

**Conferido, e tem.** O par é **Lanceiro de lança × Montanteiro de placa completa**:

| Lado | Ataca com | O gate? | Fere? |
|---|---|---|---|
| **Lanceiro** | lança, modo **único**, perfurante, Perfuração **1** | `1 < 3` **fecha**, e a regra ⊕ não tem para onde fugir | **não**, nunca, enquanto `gate` estiver ligado |
| **Montanteiro** | montante, modo principal **corte** (`armas.json`: três modos, o principal é corte) | o gate **não se aplica**: `gatePerfuracaoAbre` só avalia o perfurante | **sim**, contra a brigandina do Lanceiro |

**A batalha termina**, então, e sempre do mesmo jeito com o `gate` ligado: os Montanteiros matam os
Lanceiros e não levam um arranhão. Três coisas a registrar sobre isso:

1. **A célula é deliberadamente assimétrica**, e é isso que faz dela uma boa hospedeira: o delta do
   `gate` ali é a diferença entre "um lado não pode ferir" e "os dois lutam". É o maior delta que a
   grade vai ver;
2. **A regra ⊕ nunca dispara nessa célula**, nos dois lados: a lança não tem modo secundário e o modo
   principal do montante não é perfurante. A célula mede `gate` sozinho, sem a ⊕ no meio;
3. **os dois braços da comparação têm durações muito diferentes**, e pelo D8b isso não é problema: a
   duração é multiplicador e não critério, e as métricas por Tick continuam comparáveis.

**As hospedeiras copiam a forma da âncora extrema** (3×3, 18 hexes, campo aberto, Agressiva, com
leitura, peça entrando no Tick seguinte) e trocam **só as peças**. Sem isso os números delas sairiam
em outra escala e não se leriam ao lado dos das âncoras.

**A etiqueta da célula, e ela é obrigatória** (ponto 4 do fechamento final). Esta é a única célula da
grade que **não termina por morte**: com o `gate` ligado o Lanceiro nunca fere, os Montanteiros ficam
com a Vida cheia, e o que fecha a batalha é a **desistência a 20%** do lado do Lanceiro (a regra do
D4, `02` §0.1). O delta dela é, por construção, **o máximo que a grade pode produzir**.

> **A etiqueta, impressa junto do número, com a mesma disciplina do `não exercitada`:**
> `hospedeira do gate · termina por desistência-20 · delta máximo por construção`.
>
> E a frase que ela obriga: esta célula responde **"o `gate` morde"**, e não **"quanto o `gate` custa
> numa cena normal"**. Sem a etiqueta, a linha vira "o gate é a bandeira mais cara do sistema", que é
> uma afirmação sobre a célula e não sobre o sistema.

**A regra é mecânica, e não uma previsão minha.** O campo `cena.fim.motivo` (do D2) tem os quatro
valores, e **toda célula reporta a distribuição dele**. Qualquer célula cujo motivo dominante seja
diferente do das âncoras recebe a etiqueta automaticamente, sem ninguém precisar prever qual será.
Eu sei desta por construção; das outras, o log é que diz.

**A varredura das outras hospedeiras achou um desvio, e não é de término:** a hospedeira do
Conjurador **não pode rodar a política Agressiva**, que é a das âncoras. Se rodasse, ninguém
conjuraria, e as três bandeiras que ela existe para hospedar (`curaSemArea`, `curaDivide`,
`porRodada`) voltariam a ser inertes, que é o erro que esta rodada inteira serviu para achar. Ela é a
única célula da grade com **política mista**: Conjurador de um lado, Agressiva do outro, e o lado
Agressivo é o que carrega a malha que faz o `gate` e a regra ⊕ acontecerem.

| Hospedeira | Desvia da âncora em | Etiqueta |
|---|---|---|
| **do `gate`** (Lanceiro × Montanteiro) | o **modo de término**: desistência-20, não morte | `delta máximo por construção` |
| **do Conjurador** (Conjurador × Escudeiro de malha) | a **política**: mista, e não Agressiva dos dois lados | `política mista · o E6 não é comparável a partir dela` |
| as demais | nada: copiam a forma da âncora extrema e trocam só as peças | |

O desvio da política tem uma consequência limitada e vale escrevê-la: uma hospedeira serve só para
**deltas dentro dela mesma** (o perfil cheio contra o cheio-menos-uma, na mesma célula), e nunca para
comparação entre células. Por isso a política mista não contamina nada: ela não entra em nenhuma
comparação cruzada.


### 6b · A conferência de aditividade, nas duas âncoras

**Decidido em 02/09: as três células entram, e a grade vai a 112.** O motivo é o prazo e não o custo:
a regra 5 abaixo diz que, se a discrepância da extrema for grande, o número único da mediana é a
única evidência sobre interação dependente de cena, e isso só se descobre **lendo o relatório**.
Nessa altura o commit já andou, e acrescentar as três depois é rodá-las contra outro chão. Três
células em 109 são menos de 3%.

O diagnóstico que gerou a decisão continua valendo e fica registrado, porque é ele que explica por
que as três eram necessárias:

| | Âncora extrema | Âncora mediana, **antes** | Âncora mediana, **agora** |
|---|---|---|---|
| Deltas individuais medidos lá | as 15 | **6**, só as do núcleo | **9**: as 6 do núcleo mais `margem`, `bloqueio` e `teto6` |
| Perfil tudo-desligado | sim | sim, e ele desligava **as 15** | sim |
| A soma fecha? | **sim** | **não**: faltavam três que mordem lá | **sim** |

**E o que licencia a soma nas duas é o contador de ocasiões da §3d.** Nenhuma das duas âncoras mede
individualmente as seis bandeiras que não mordem nela (`gate`, `modo2`, as duas da Cura, `porRodada`,
`porte`), e mesmo assim o perfil tudo-desligado as desliga. A soma só é legítima se a contribuição
delas for zero, e **isso deixa de ser suposição**: o contador roda na célula-base de cada âncora e
diz quantas vezes a pré-condição de cada bandeira ocorreu. Zero ocasiões, contribuição zero, e o
relatório declara isso em vez de assumir.

**A regra de leitura, para o relatório:**

1. a conferência aparece **duas vezes**, rotulada **"âncora extrema"** e **"âncora mediana"**, e
   nunca como número único da bateria;
2. cada uma lista os deltas que valem lá, com os não medidos entrando como **zero declarado pelo
   contador de ocasiões**, e não como zero medido. A discrepância vai em número absoluto **e** como
   fração do efeito de tudo-desligado;
3. o alcance real é dito na mesma página: na extrema a aditividade é verificada sobre **nove**
   bandeiras e é trivial sobre seis; na mediana, sobre **nove** e trivial sobre seis, e as nove não
   são as mesmas nas duas;
4. **a comparação entre as duas discrepâncias é a leitura que as três células compraram**: se a soma
   fecha na mediana e não fecha na extrema, a interação existe e **depende da cena ser extrema**, que
   é a pergunta da âncora dupla aplicada às bandeiras;
5. se as duas discrepâncias forem grandes e parecidas, a interação é do conjunto e não da cena, e o
   relatório diz de quanto é sem poder apontar o par culpado. Isso continua sendo limitação do
   deixe-uma-de-fora, e não se conserta com célula.

### 6c · O que bloqueia o quê

| | O quê |
|---|---|
| **Bloqueia o começo da implementação** | **nada.** A Etapa 0 está inteiramente especificada: a branch congelada, a semente nos quatro pontos, o caminho do driver até ela e o despejo por Tick. Não há decisão pendente entre aqui e a primeira linha dela |
| **Bloqueia a Etapa 1** (as nove bandeiras) | **uma coisa, e ela acabou de ser decidida:** o carimbo do perfil no encontro (§4a). Sem ele, a Etapa 1 sobe para uma mesa em que um encontro aberto pode mudar de regra no meio |
| **Bloqueia a leitura do resultado, e não o começo** | a **linha da regra ⊕ na tabela de custo de tela** (F3), sem a qual o `modo2` sai sem custo de gesto · o **`aid` no caminho das criaturas** (F2), sem o qual metade das batalhas fica sem tempo morto · o **`n` final**, que só sai do piloto e pode encolher se o CV da métrica nova for menor (§3b) |
| **Fechado** | os doze itens da §0.6.1 e a ordem entre eles · o critério de aceitação, com os dois espelhos separados · a grade, em 112 células conferidas bloco a bloco · as métricas, em três blocos com a régua do D8b no topo · as onze decisões D1 a D11 · os seis riscos F0 a F5, com sinal e perda escritos em cada um |

**A resposta honesta à pergunta como você a formulou:** nada bloqueia o começo, é implementar a
Etapa 0. E o que bloqueia a Etapa 1 é uma coluna que se escreve uma vez por encontro.

---

## A · O que mudou em cada arquivo

*Esta seção e a seguinte são acréscimos meus, da primeira entrega. Os blocos 3 a 6 do pedido estão
nas seções 3 a 6, acima.*

Cinco arquivos, um criado e quatro editados. Nenhum arquivo de `src/`, `scripts/` ou `supabase/` foi
tocado: esta rodada não implementa.

### `docs/simulacao/05-fechamento.md` · **criado**

Este. As dez dependências de prova sem instrumento, a ordem reescrita, a recontagem da grade, as
cinco inércias e as duas decisões novas (D10 e D11).

### `docs/simulacao/02-projeto-harness.md` · editado em doze lugares

| Onde | O que mudou |
|---|---|
| **§0.4 P1** | nota: a `couraca` saiu do perfil de bandeiras, e por quê |
| **§0.4 P4** | **reescrita como especificação única.** As regras de leitura da §0.47 entraram na lista ordenada, marcadas **⊙**, com a regra escrita de que o E9 desligado pula a ⊙ e cai para a seguinte. Entrou a regra de modo **⊕** (D11) nos cinco perfis. O Agressivo ganhou a regra ⊙ que estava decidida desde a `03` §1.4 e nunca aplicada |
| **§0.4 P5** | entraram os **quatro arquétipos de criatura** (D10): esqueleto humano, aurochs, bulette e águia gigante, com porte, ciclo de ataque, passo e o que cada um exercita |
| **§0.4 P6** | **E4 passa a ser definido por raça e armadura**, não por arquétipo, para não apagar o nível de E1 da célula. E ficou escrito quem preenche cada nível de E1, com o Duelista lutando só com a espada curta nas âncoras |
| **§0.5** | entrou a linha do eixo **E11 · natureza do elenco**; E5 saiu do OFAT das âncoras; o total foi de 79 para **112 células** e de 39.500 para **56.000 batalhas**; entrou o sexto cruzamento (E11 × E3) |
| **§0.6.1, a ordem** | **reescrita.** Entrou a **Etapa 0 · Instrumentação** (branch congelada, semente, caminho do driver, despejo por Tick), as quatro etapas seguintes com as dependências explícitas, e a separação do **espelho de inércia** e do **espelho de motor** no critério de aceitação. Caíram as duas frases que contradiziam a D5 e a §0.8.2 ("o 11 vale por último" e "o 6 depende da migração") |
| **§0.6.1 item 11 e §0.6** | 16 bandeiras viraram **15**; a linha da `couraca` saiu da tabela, com o motivo (`gen-bestiario.mjs:36-45`); o `n5` deixou de ser listado como pendente |
| **§0.7** | título e contagem: **quinze** bandeiras, **17** perfis de E5; entrou a linha do que saiu e por quê; entrou a regra de onde cada comparação roda |
| **§0.10.1 e §0.10.2** | **a grade oficial refeita**: 112 células, 56.000 batalhas, a tabela de como cada bloco se lê, as duas âncoras diferindo em **exatamente um** fator (as duas passam a rodar Agressiva), o nível de E10 em que elas se sentam, e a tabela de qual célula hospeda cada bandeira |
| **§3** | os totais riscados foram atualizados para 112 células e 56.000 batalhas; a estimativa de volume de log foi de 500 MB para 600 MB |
| **§2.6** | **reescrita inteira** (bloco 3): a régua do D8b subiu para o topo, a tabela única virou três blocos (principais por etapa · contexto por batalha · diagnóstico do motor), as seis métricas da R4 §A.2 entraram, e entrou o **contador de ocasiões**, que impede um zero de âncora de ser lido como "a bandeira não faz nada" |
| **§3, as previsões** | as cinco reescritas na unidade do D8b, com a versão anterior citada em cada uma. E a conta das 500 repetições, que era o pior caso da unidade errada: ela saía do CV de paradas **por batalha** e passou a sair do de paradas **por Tick**, com a consequência escrita de que o `n` da média pode encolher |
| **§0.4 D4 e §4** | duas passagens que o D8b tornou falsas ganharam nota: a de que descartar a batalha não terminada enviesa "justamente a carga", e a de que sem morte não há nada |

### `docs/simulacao/03-respostas.md` · editado em um lugar

**§1.4** ganhou o bloco "Aplicado em 02/09, e por muito tempo não estava": a regra de leitura do
Agressivo nunca tinha entrado na lista executável, e enquanto não estava lá o E9 era inerte em
qualquer célula de política Agressiva. Junto, a correção da frase "os três cujas regras de fato leem
alguma coisa", que era verdadeira sobre a §0.47 e falsa sobre a §0.4 P4.

### `docs/simulacao/04-prontidao.md` · editado em onze lugares

Blocos de consequência abaixo das respostas de **D1** (a grade não ficou em 107 células), **D3** (o
espelho eram dois), **D4** (a branch tem prazo) e **D5** (a instrumentação vem antes, e são nove
bandeiras e não dez), mais um aviso no topo da **§B.3** dizendo que a análise da âncora foi superada
e onde está a âncora valendo. Depois da revisão, o
**F4** e o **F5** foram reescritos (§2.5 C4 e C3), e o número da §F1 acompanhou a grade.

Com os blocos 3 a 6: entrou o **F0** no topo da §F, sem renumerar os outros; a **§F1** ganhou a
decisão do bloco 5, com as quatro respostas, a recomendada e o contra-argumento; e o **F2** e o
**F3** ganharam as premissas que a grade nova mudou (o `aid` em dois caminhos de código, e o gesto de
tela que a regra ⊕ acrescentou e a tabela de custo não cobra).

### `Pendencias.md` · editado em cinco lugares na seção L

O `05-fechamento.md` entrou na tabela de documentos; **L2** foi de 16 para 15 bandeiras com o motivo
da `couraca`; **L5** virou `[PRIMEIRO]` e passou a cobrir a instrumentação inteira, não só a semente;
**L6** foi para 112 células, 56.000 batalhas, piloto nas duas âncoras e elenco com criaturas; e
entrou o **L8**, a fusão das duas especificações de política.

---

### O fechamento final, em cima de tudo isso

| Onde | O que mudou |
|---|---|
| **§B deste documento** | reescrita: duas linhas descreviam o estado de antes de a rodada terminar (o "item 3 vazio", que virou as §§3 a 6 daqui, e o `teto6` "sem saber se morde", resolvido pelo contador da §3d) |
| **§6b, e a grade em quatro arquivos** | as três células da mediana entram por decisão sua, a grade vai a **112** e **56.000 batalhas**, e a conferência de aditividade passa a valer **nas duas âncoras**, licenciada pelo contador de ocasiões. O número foi conferido bloco a bloco e propagado para **21 lugares** em 5 arquivos |
| **§2.6 e §0.4 P4 do `02`** | o contador de ocasiões passa a cobrir também as **regras ⊙ e ⊕ das políticas**, com a mesma tabela de leitura |
| **§6a, e §0.10.1 do `02`** | a hospedeira do `gate` ganha etiqueta obrigatória (`termina por desistência-20 · delta máximo por construção`), a regra da etiqueta vira mecânica pelo `cena.fim.motivo`, e a varredura achou o segundo desvio: a hospedeira do Conjurador tem **política mista**, senão as três bandeiras que ela hospeda voltam a ser inertes |
| **F0, no `04` e na ordem do `02`** | o carimbo do perfil vira o item **1.0** da Etapa 1, e ganha as duas propriedades que faltavam: **visível** e **recarimbável**. Zero gravação por Tick, confirmado |
| **F1, no `04`** | conferida a procedência da resposta: veio de sessão, em 02/09, com as quatro opções e o contra-argumento. Mantida |
| **`Pendencias.md`** | L6 com a grade nova, L9 com as três propriedades do carimbo |

---

## B · O que continua aberto

*Reescrita no fechamento final: duas linhas descreviam o estado de antes de a rodada terminar.*

- **N7 e N8 sem verificação automatizável** (D3). Continua aberto, e só uma sessão de mesa fecha:
  "o jogador vê a intenção do outro" e "o rastro é legível" não são asserções;
- **o `n` final**, que só sai do piloto, e que pode encolher se o CV de paradas por Tick vier abaixo
  de 0,5 (§3b);
- **a linha da regra ⊕ na tabela de custo de tela** (F3) e **o `aid` no caminho das criaturas**
  (F2). As duas bloqueiam a leitura, não o começo.

**Duas linhas saíram, porque tinham deixado de ser verdade dentro deste mesmo documento:**

| Dizia | Por que saiu |
|---|---|
| "o item 3 do pedido, que chegou vazio" | os blocos 3 a 6 chegaram e são as §§3 a 6 **deste documento**. A linha descrevia o estado de três seções antes |
| "o `teto6` sem saber se morde" | resolvido pelo **contador de ocasiões** da §3d, escrito três seções antes: zero ocasiões imprime `não exercitada`, e o contador diz quantas vezes os modificadores passaram de 6 |

**E a varredura das outras linhas de status**, que era a segunda metade do pedido: a §6c foi conferida
e continua valendo palavra por palavra (nada bloqueia o começo; a Etapa 1 depende do carimbo; três
coisas bloqueiam a leitura). A linha "nada dos riscos" também continua valendo, agora com **seis**
riscos escritos. O cabeçalho do documento, que dizia que o pedido chegou cortado, já tinha sido
reescrito quando os blocos chegaram.

**O que não está aberto, dito de uma vez:** nada bloqueia o começo. A Etapa 0 está inteiramente
especificada, e é a próxima coisa a acontecer.
