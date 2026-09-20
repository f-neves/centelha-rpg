# Rodada 85 · veredito da Revisora

Reancorada em `03e5274` (o sha do aviso), conferido por `git rev-parse HEAD` e
`git rev-parse --show-toplevel` na worktree `centelha-techlead-revisora`, com `git status --short`
limpo. Base `18ee12e`, trabalho `057b339`, faixa de três commits (`d73a058`, `35e892a`, `057b339`)
e quatro arquivos, conferidos por `git log --oneline` e `git diff --stat`. O `regras.json` não foi
tocado, como o aviso disse, e a proposta do item 9 fica fora deste veredito.

Refiz as contas antes de abrir o `85-executora.md`, para não ancorar na lista dele. A reconstrução
da versão anterior do capítulo saiu de `git show 18ee12e:src/content/chapters/relacoes-sociais.md`,
para separar o que o lote escreveu do que ele herdou.

---

## 1 · As contas, refeitas pela fórmula publicada no capítulo

**Cinco dos seis lugares fecham inteiros. O sexto fecha em dezesseis das vinte células.**

### Fecha · a tabela de Defesa parada (`:192`)

A relação que o capítulo afirma (`:188`, "a soma entra sem o ×2") dá
`parada = Compostura + Sociabilidade + Centelha`, contra a `Defesa Social = (C+S)×2 + Centelha`
de `defesas.md:73`. As cinco linhas fecham, e as duas com personagem publicado fecham contra a
fonte e não contra si mesmas:

| alvo | premissa publicada | com dado | parada |
|---|---|---:|---:|
| Kael | Compostura 2, Sociabilidade 0, Centelha 3 (`defesas.md:83`) | (2+0)×2+3 = 7 ✓ | 2+0+3 = **5** ✓ |
| Sora | Compostura 3, Sociabilidade 3, Centelha 3 (`criacao-de-personagem.md:113`) | (3+3)×2+3 = 15 ✓ | 3+3+3 = **9** ✓ |
| Vesna | não publicada fora deste capítulo | 18 | 11, que exige C+S = 7 e Centelha 4 · internamente coerente |
| guarda | não publicado | 6 | 3, que exige C+S = 3 e Centelha 0 ✓ |
| vendedor | não publicado | 8 | 4, que exige C+S = 4 e Centelha 0 ✓ |

### Fecha · as jornadas do Nêmesis (`:264`, 27/45/63/81)

Seis passos, termo caindo de 6 a 1, defesa parada de 17 a 12. Somando os `máx(1, defesa − ataque)`:
cortesão (10) 7+6+5+4+3+2 = **27**; mediano (7) 10+9+8+7+6+5 = **45**; inepto (4)
13+12+11+10+9+8 = **63**; bruto (1) 16+15+14+13+12+11 = **81**. Os quatro batem.

E as duas conversões de calendário da mesma caixa batem com o ano de Uldun: bruto 81 × 8 = 648
dias, 1,69 ano, "quase dois anos" ✓; elfo 81 × 32 = 2.592 dias, 6,75 anos, "quase sete" ✓.

### Fecha · o trade de dinheiro (`:234`, 81 → 42 → 25)

Aplicando a regra do `:232` ("o maior número de gestos que ainda caiba no Tempo que eles mesmos
produzem") às mesmas seis bases do bruto (16, 15, 14, 13, 12, 11):

- **gestos de +1:** 8, 8, 7, 7, 6, 6 = **42** ✓
- **gestos de +4:** 4, 3, 6, 5, 4, 3 = **25** ✓

O 6 e o 5 no meio da segunda linha não são erro meu: são o dente que o `E8` nomeia, e ele é
carregador do total. Sem ele a soma não dá 25.

### Fecha · o exemplo do mediano contra a Vesna (`:236`, 4 e 2)

11 − 7 = **4** ✓. Com um gesto de +2, 11 − 7 − 2 = **2**, e dois gestos deixariam o passo em 1
intervalo, que não segura dois ✓.

### Fecha · o exemplo do passo de 15 (`:232`, três gestos de +4)

15 − 12 = 3, e três gestos cabem em três intervalos ✓. Um quarto daria `máx(1, −1)` = 1, e um
intervalo não segura quatro ✓.

### Fecha também · os 32 dias do `:213`

Não estava na lista do aviso e vale dito porque é a única célula que o capítulo publicou da linha
que o `E4` derrubou. Cortesão (10) contra parada 11: três passos no Neutro a 1 cada (termo zero),
mais o passo de +1 para +2 com termo −1, `máx(1, 10 − 10)` = 1. São **4 intervalos**, 32 dias ✓.
E o resto daquela linha, refeito por mim sem olhar o `E4`, dá mediano 15, inepto 27, bruto 39,
que é exatamente o que o `E4` registra como divergente da especificação. **A promessa das 10:12
se sustenta nesta metade:** a linha que não fecha ficou fora do capítulo.

### NÃO fecha · quatro das vinte células da tabela da Vontade (`:250`)

A fórmula fecha. A premissa não. A tabela lê `Sora (9, 7)`, e a **Vontade publicada da Sora é 8**
(`criacao-de-personagem.md:118`, "Força de Vontade | 0 → 8 | 72"; a progressão 2+4+6+8+10+12+14 = 56
é o 7 do Kael, e mais 16 é o 72 dela). Com Vontade 8 e custo 1 em todas as colunas, a linha inteira
passa de `7 | 7 | 7 | 7` para `8 | 8 | 8 | 8`.

O detalhe que fecha o caso: **é o mesmo parágrafo que dá as duas coisas.** O bloco da Sora em
`criacao-de-personagem.md` publica a Vontade 8 e, quatro linhas abaixo, a `Def. Social 15` de onde
sai a defesa parada 9 que a mesma célula usa. Metade da premissa foi lida dali e a outra metade não.

As outras dezesseis células fecham, e conferi uma a uma pelo
`1 + [máx(0, ataque + 4 − defesa) ÷ 6]`: guarda 1/1/3/3, vendedor 2/2/4/4, Kael 3/3/7/7 (Vontade 7
confere com `defesas.md:83`), Vesna 8/8/8/8 (Vontade não publicada fora daqui, livre).

**A frase do `:258` sobrevive ao conserto:** com 8, a linha da Sora continua empatada nas quatro
colunas, porque o excedente do cortesão contra ela é 5 e nunca chega a 6.

**A origem é anterior ao lote:** a especificação já trazia `Sora (9, 7)` em
`ritmo-da-regua.md:175`, e a Executora copiou fiel. Isso não muda o rótulo, pelo `§8` do contrato
e pela forma "a causa velha que não salva a promessa nova" do `CATALOGO`: a promessa das 10:12 é
que o capítulo publica só o que se reconstrói, e quatro células publicadas não se reconstroem
contra a ficha que o próprio livro traz.

---

## 2 · O outro número que não se reconstrói, e ele é novo do lote

`:215`, dentro do parágrafo que explica por que a escada de seis degraus saiu:

> cada degrau da escada multiplica **entre 8 e 24 vezes**

A escada está definida em `acoes-e-sistema.md:137-144` (Tick ~1 segundo, Minuto, Hora, Dia, Semana,
Estação) e em `regras.json → acoes.escalaIntervalo.degraus`. Os saltos dela:

| salto | fator | dentro de [8, 24]? |
|---|---:|---|
| tick → minuto | ~60, e a grandeza do minuto é "dezenas de segundos", então é ambíguo | não decide |
| minuto → hora | **60** | **não** |
| hora → dia | 24 | sim |
| dia → semana | 8 (a semana de Uldun) | sim |
| semana → estação | 12 | sim |

Basta o `minuto → hora` para derrubar a palavra "cada". **O argumento não cai com a frase**, e é
por isso que o conserto é de uma linha e não de um parágrafo: os quatro degraus que o ajuste racial
usaria com base "dia" são hora/dia/semana/estação, e os três saltos entre eles são 24, 8 e 12, todos
dentro da faixa. A conta do orc também fecha (base dia, um degrau mais rápido é hora, quatro passos
de estranho a Apreço, **quatro horas** ✓). O que está errado é o alcance da afirmação, não a
conclusão dela.

Isto é a forma do `CATALOGO` "o cabeçalho que generaliza o que o corpo restringe", aplicada dentro
de uma frase: a restrição verdadeira é "os degraus que interessam aqui", e o que foi publicado é
"cada degrau".

**A mesma frase está na proposta do item 9** (`85-executora.md:129`, a `nota` do
`longevidadeFirula`), que é do Arquiteto. Não estou julgando o item 9; estou dizendo que o conserto
tem dois lugares se ele executar a proposta como está.

---

## 3 · A quarta contradição de borda: é a palavra "lábia" (`:106`)

Varri as seções que o lote **não** tocou (conferidas byte a byte contra `18ee12e`: "Favor gasta
crédito", "Esfriar com o tempo", "os povos", "Iniciativa e ritmo", "O ataque social", a tabela de
"Pedir as coisas", o parágrafo da recuperação da Vontade) e não achei nelas nenhuma frase dizendo
que a cena com dado move a régua. **A quarta está numa linha que o lote reescreveu**, que é o que a
torna desta rodada, e ao procurá-la apareceram mais duas da mesma família.

### A quarta · "lábia" na lista do que acumula até o teto de vidro

> Tudo o que **acumula** (gesto, cortejo, **lábia**) para em **+2 (Apreço)**

Duas linhas acima, o mesmo parágrafo diz "Conversa nenhuma tira alguém do Neutro, por boa que seja,
porque em cena a régua não anda", e o fim dele diz "não na conversa". A palavra vem do texto antigo
(`18ee12e:99`, "lábia e presentes levam alguém só até +2"), onde ela era verdadeira porque conversa
movia a régua. A linha foi reescrita e a palavra ficou.

**Sou honesta sobre o que ela tem de defensável:** o cortejo é conversa sem dado, e alguém pode ler
"lábia" como a lábia do cortejo. Mas aí ela é redundante com "cortejo", que está na mesma lista de
três; e para o leitor que acabou de aprender, em três seções seguidas, que conversa não move nada,
uma lista que põe lábia ao lado de gesto e cortejo desfaz o que as três seções fizeram. A régua da
casa é o `E4` da própria Executora: o leitor que recalcula pelo texto publicado chega noutro lugar.

**E ela já saiu do capítulo:** a proposta do item 9 carrega a palavra para o dado, em
`social.regua.tetoDeVidroNota` (`85-executora.md:96`, "Vale para tudo o que ACUMULA (gesto, cortejo,
lábia)"). Se ela é para cair, cai nos dois.

### A quinta, menor · o verbo "furar", que já não tem mecanismo (`:262`)

> **Furar** não concede pedido: o que o cortejo faz é **andar a régua**

No modelo velho havia o que furar: rolava-se contra a Defesa Social até atravessá-la
(`18ee12e:190`, "Furar a Defesa concede o pedido"). No modelo novo não se rola nada no cortejo, não
há Defesa a atravessar, e "furar" não aparece em mais nenhum lugar da seção. A frase é uma correção
endereçada a quem leu o capítulo antigo, publicada para quem vai ler só o novo. É menos grave que a
quarta, porque não afirma nada falso, só aponta para o vazio.

### A sexta · a faixa dos atos na Folha (`:271`)

> **Move por:** atos (saltos fixos, **de ±2 a −5**)

A tabela de atos (`:67`) tem +2 e +3 de um lado, e −2, −3, −4, −5 do outro. A faixa publicada na
Folha omite o **+3**, que é justamente o número em que o capítulo mais se apoia: "salvar a vida"
(+3) rompe o Neutro de uma vez (`:104`), dois deles atravessam um Nêmesis (`:88`), e o teto de vidro
existe para dizer que só ato chega a +3 (`:106`). A Folha é o que se lê na mesa. Texto novo do
lote: o `18ee12e:196` dizia só "atos (saltos fixos)".

---

## 4 · O que o lote deixou contradizendo fora dele

**Primeiro, o conserto de um erro meu, porque ele muda a natureza deste item.** A primeira versão
deste veredito absolvia o resto do livro com a frase "nenhum outro capítulo cita a Régua de Relação,
o Combate Social ou a Influência Estendida", e a varredura que a sustentava era de **uma palavra**
("cortejo") em `src/content/chapters/`. Uma palavra não absolve três conceitos, e o buraco era
óbvio: eu já tinha achado o `acoes-e-sistema.md:152` justamente por uma referência que não escreve
"cortejo". Refeita pelo slug `relacoes-sociais` e por oito termos do modelo, em **`src/` inteiro**
(não só `chapters/`), a conta é outra. É o `§9` do contrato pegando a mim: a absolvição custa a
mesma conferência que a acusação, e eu tinha feito a barata.

**São sete lugares, em cinco arquivos, todos `INTOCADOS` pelo lote (conferido por
`git diff --quiet 18ee12e 057b339 -- <arquivo>`) e todos no ar desde 19/09 pela manhã.**

### Os dois que publicam a regra revogada palavra por palavra

| onde | o que diz hoje |
|---|---|
| `qual-sistema.md:73` | caixa do fluxograma: `RJ["Jogada única: Ataque Social vs Defesa Social **move a Régua (+1 passo a cada 6 de folga)**"]` |
| `qual-sistema.md:74` | caixa vizinha: `RC["Combate Social: ... se não segura, Cede e **a Régua anda os passos da Margem**"]` |

**As duas eram VERDADEIRAS em `18ee12e`** (conferido por `git show`) e o lote as tornou falsas.
Isto não é entulho de vocabulário: é a regra que a rodada revogou, publicada em diagrama, no
capítulo cujo próprio `resumo` se apresenta como "um mapa de bolso para escolher a regra certa". O
Mestre que rotear uma cena social pelo roteador aplica o modelo morto, e aplica com autoridade.

`qual-sistema.md:110` (a folha do mesmo capítulo) traz a versão curta: "dia a dia = Régua
(**jogada única**)", contra o `:10` do capítulo social, "a régua resolve o dia a dia **sem rolar
dado**".

### O que perdeu o chão, e não é redação · o bônus de Antecedente

`antecedentes.md:72-74`, num bloco de citação:

> Uma Reputação em contexto, um Contato bem posto, uma Posição que pesa naquela sala **só entram
> nas jogadas que movem a Régua de Relação**, isto é, nas que constroem ou deslocam um vínculo.
> Eles **não** turbinam um ataque no Combate Social nem uma Habilidade solta

Repetido em `:195` (Reputação: "bônus situacional às jogadas que movem a Régua de Relação... acelera
romper o Neutro") e em `:311` (a folha: "o situacional de Antecedente só move a Régua de Relação,
somando até +6").

**Depois deste lote, esse conjunto de jogadas é vazio.** A conversa com dado compra alcance e não
move a régua; o Combate Social é excluído pela própria frase; o cortejo, que é o único lugar onde a
conversa move a régua, **não tem jogada nenhuma** (a única rolagem dele é a leitura, que lê e não
move). Sobram os atos, que são de passo fixo e sem rolagem por definição.

Então um traço comprado com XP a ×3 por ponto, que soma até **+6**, ficou sem nenhum lance em que
entrar. Isto é alcançável por qualquer jogador com Reputação na ficha, e a pergunta que ele faz na
mesa ("onde entra o meu +3?") não tem resposta no livro de hoje. **O conserto não é de linha: é
regra de jogo**, e pela divisão da casa é do humano e não meu nem seu. O que eu entrego é o achado
e o alcance dele.

### Os três de referência pendurada

| onde | o que diz hoje | por que caiu |
|---|---|---|
| `src/pages/mestre.astro:207` | "roteie pela Régua de Relação / Combate Social: a Dif vira a Defesa Social do alvo e **o resultado move a régua**" | mesma regra revogada, e desta vez na página-ferramenta que o Mestre abre durante a sessão |
| `acoes-sentidos-e-engano.md:100` | "o que ele chama de **influência estendida é Acumulada**, e o **cortejo com calma é Longa**" | o lote fundiu os dois nomes num só (a seção hoje se chama "Cortejo com calma: a Influência Estendida") e tirou a Acumulada como caminho social (`85-executora.md`, 10:31). A frase mapeia uma coisa em duas, e uma das duas não existe mais |
| `acoes-e-sistema.md:144` | `\| **Estação** \| uma obra \| erguer o muro, administrar a terra, **o cortejo longo** \|` | o cortejo saiu da escada; o intervalo dele é 8 dias vezes a longevidade, e nunca "estação" |
| `acoes-e-sistema.md:152` | "Em [Relações Sociais](/regras/relacoes-sociais), **'período'** quer dizer o intervalo declarado." | o lote apagou a palavra "período" do capítulo social. Contei: **zero** ocorrências hoje. A frase manda o leitor procurar um termo que não existe mais no destino |

### O que você já sabia, e não é achado meu

`regras.json → acoes.longevidadeFirula`, e a `nota` do `acoes.escalaIntervalo` (`:2629`, que cita
"o intervalo-base do cortejo social (Firula, capítulo X)"). Os dois estão nomeados no item 9, o
segundo em `85-executora.md:140-143`.

### O que NÃO caiu, conferido e não suposto

- `glossario.json → firula` (`:211`): "Nas Relações Sociais é o gesto certeiro e soma +1/+2/+4; o
  gesto que desagrada é uma Firula Infeliz e subtrai igual." Continua verdadeiro, e não cita o teto
  por período que saiu.
- `glossario.json → defesa-social` (`:104`) e `regras.json → derivados.defesaSocial.reguaNota`
  (`:809`): trazem a fórmula com dado mais o termo da régua, que o lote não mexeu. Nada nelas
  contradiz a escala parada, que é grandeza nova e sem verbete.
- `racas.json`: as quatro faixas da tabela `:206` reconstroem **exatas** dos oito ids e do campo
  `longevidade` (curta = orc, meio-orc; padrao = humano, meio-elfo; longa = anão, gnomo, halfling;
  muito-longa = elfo). Nenhum nome de povo foi digitado a mais nem a menos.
- `habilidades.md`, seção das Firulas (`:99-124`): não cita a régua social nem o teto por período.
- `racas.md:115` (meio-orc recebido em −1 Antipatia): é **baseline de povo**, não ato, e o item 3
  do lote só tirou o ±1 da tabela de **atos**. Não colide.
- `antecedentes.md:99` (favor alugado), `:114` (aliado nasce em +3/+4), `:57`, `:80`, `:178`,
  `:255`, `:285`; `acoes-oficio-e-mundo.md:216`; `acoes-sentidos-e-engano.md:31` e `:91`;
  `defesas.md:127`; `qual-sistema.md:10`, `:40`, `:64`, `:66`: li as catorze e nenhuma afirma que a
  cena com dado move a régua.
- `src/lib/`: a única ocorrência é `site.ts:44`, a entrada de índice do capítulo. Nenhum código lê
  nada disto, que é coerente com a decisão da rodada 84.

---

## 5 · A sua tensão de redação · é do texto, e é anterior a este lote

As duas frases são `:140` ("a **Defesa Social** do alvo (o número passivo da ficha)") e `:145`
("Essa Defesa **já carrega** o peso da história entre vocês"). Conferi as duas contra `18ee12e`:
**estão idênticas, palavra por palavra, e o lote não encostou em nenhuma das duas.** A seção "O
ataque social" não foi reescrita.

**A tensão é real, e não é sua.** Pela decisão da rodada 84, o termo é por par de personagens, não
mora na ficha e não vira código: a ficha imprime `(Compostura + Sociabilidade) × 2 + Centelha + Esp`
e mais nada. Então o número passivo da ficha **não** carrega o peso da história; quem carrega é o
total daquele lance, depois de a mesa somar o termo. As duas frases só são compatíveis sob a leitura
"Defesa Social" = número da ficha **mais** o termo aplicado na hora, e o verbo "já carrega" diz o
contrário disso: ele diz que veio embutido.

A mesma redação está na Folha (`:274`, "contra a Defesa Social (que já carrega o termo da história,
acima)").

Conserto de uma linha, se você quiser: trocar "já carrega" por algo como "recebe o peso da história
entre vocês", que é o que o parágrafo do `:86` de fato manda fazer. Classifico como **ESCALA** e não
CORRIGE porque o lote não tocou nessas linhas e a rodada 85 não promete nada sobre onde o termo
mora, mas o conserto é pequeno o bastante para caber no seu próximo commit se você preferir.

---

## 6 · Travessão

Contei o caractere com Python, arquivo a arquivo, e não com `git diff`:

| arquivo | U+2014 (travessão) | U+2013 |
|---|---:|---:|
| `src/content/chapters/relacoes-sociais.md` | **0** | 3 |
| `docs/simulacao/caixa/85-executora.md` | **0** | 0 |
| `docs/pendencias/E-social-mental-antecedentes.md` | **0** | 0 |
| `docs/simulacao/caixa/ritmo-da-regua.md` | **0** | 0 |
| `Pendencias.md` | **0** | 0 |

Os três U+2013 do capítulo são os intervalos numéricos da tabela do Resistir (`:153-155`, "0–5",
"6–11", "12–17"), estão idênticos em `18ee12e` e não são travessão. Contei o meu próprio texto pelo
mesmo método: zero U+2014.

---

## 7 · Verificação e placar

`npm run validate` rodado nesta worktree: **verde**, código de saída 0. Os dezoito ⚑ de portão de
navegador que nunca rodaram nesta máquina são anteriores a esta rodada e não são dela.

O placar do `Pendencias.md` confere contra as caixas do arquivo E: são oito itens (E1 fechado, E2 a
E8 abertos), e a linha diz 8 / 7 / 1 ✓. O total 239 → 244 e 163 → 168 bate com os cinco novos ✓.

Uma observação sem peso: no `E-social-mental-antecedentes.md` o **E8 está escrito entre o E4 e o
E5**, fora de ordem. Não muda nada que o portão leia.

---

## CORRIGE

Nomeados, não contados.

**No capítulo:**

1. **`:250`, a linha da Sora.** `Sora (9, 7)` vira `Sora (9, 8)`, e as quatro células passam de 7
   para 8. A Vontade publicada dela é 8 (`criacao-de-personagem.md:118`). A frase do `:258`
   continua verdadeira depois do conserto.
2. **`:215`, "cada degrau da escada multiplica entre 8 e 24 vezes".** Falso no salto
   `minuto → hora`, que é 60. Restringir a afirmação aos degraus que o argumento usa, ou tirar a
   cláusula: a conclusão não depende dela.
3. **`:106`, a palavra "lábia"** na lista do que acumula até o teto de vidro. É a quarta
   contradição de borda. Sobrevivente do modelo em que conversa movia a régua, numa linha que o
   lote reescreveu, e duas linhas abaixo de "Conversa nenhuma tira alguém do Neutro".
4. **`:262`, o verbo "furar"**, que já não tem mecanismo no modelo novo.
5. **`:271`, "atos (saltos fixos, de ±2 a −5)"** na Folha de referência. A tabela de atos tem +3, e
   o +3 é o número de que o capítulo mais depende.

**Fora do capítulo, e estes são os que não podem esperar, porque publicam a regra revogada:**

6. **`qual-sistema.md:73` e `:74`**, as duas caixas do fluxograma do roteador social: "move a Régua
   (+1 passo a cada 6 de folga)" e "Cede e a Régua anda os passos da Margem". Eram verdadeiras em
   `18ee12e` e o lote as tornou falsas. Mais o `:110`, "dia a dia = Régua (jogada única)".
7. **`src/pages/mestre.astro:207`**, "o resultado move a régua", na página que o Mestre abre em
   sessão.
8. **`acoes-sentidos-e-engano.md:100`**, que mapeia "influência estendida" e "cortejo com calma"
   como dois modos diferentes depois de o lote tê-los fundido num só, e cita a Acumulada, que saiu.
9. **`acoes-e-sistema.md:144`** ("o cortejo longo" como exemplo do degrau Estação) e **`:152`** (a
   palavra "período", zero ocorrências no destino).

**E um que é regra de jogo e não conserto, e por isso vai com o alcance medido:**

10. **`antecedentes.md:72-74`, `:195` e `:311`.** O bônus situacional de Antecedente (até +6, XP a
    ×3 por ponto) só entra "nas jogadas que movem a Régua de Relação", e depois deste lote esse
    conjunto é vazio: a conversa com dado não move, o Combate Social é excluído pela própria frase,
    e o cortejo, que move, não tem jogada. É alcançável por qualquer ficha com Reputação, Contato
    ou Posição. Eu entrego o achado; onde o bônus passa a entrar é decisão do humano.

## ESCALA

**"o número passivo da ficha" (`:140`) contra "já carrega o peso da história" (`:145`, e `:274` na
Folha).** Texto idêntico em `18ee12e`, não tocado pelo lote, sem promessa da rodada 85 em cima
dele. É defeito de verbo e não de mecânica, e o conserto é de uma linha.

## VEREDITO

**PROCEDE COM CORREÇÕES, e duas delas não são de redação.**

**O que procede, e é o miolo:** o modelo está certo e fecha. "A cena com dados não move a régua" é
verdade em toda seção do capítulo, incluindo as que o lote não tocou; a decisão central colapsou de
fato os três lugares antigos num só; a fórmula do Tempo do passo, o intervalo com a longevidade e a
resistência com a Vontade presa reconstroem cada número publicado, com uma exceção de premissa e
nenhuma de aritmética. O `máx(1, …)` e a trava de um gesto por intervalo fazem o que a especificação
prometeu, e o dente que eles produzem foi achado e registrado pela própria Executora (`E8`) em vez
de maquiado. A promessa das 10:12 se sustenta: a única linha que não reconstrói ficou fora do
capítulo, com o `E4` no lugar dela.

**O que não está terminado, e não é o capítulo, é o livro.** O lote reescreveu o capítulo e deixou
sete lugares em cinco arquivos apontando para a regra que ele acabou de revogar, incluindo o
fluxograma do `qual-sistema.md`, que é o mapa que o Mestre consulta para escolher a regra, e a
página `/mestre`. Duas dessas frases eram verdadeiras em `18ee12e` e passaram a ser falsas por este
commit. E uma delas, o bônus de Antecedente, não é frase pendurada: é um traço de ficha comprado com
XP cujo único lugar de aplicação deixou de existir.

**Sobre a pressa:** o aviso está certo de que um BLOQUEIA aqui não seguraria nada, e por isso não
uso a palavra. Mas o custo do erro de sequência é maior do que "um dia no ar com quatro células
erradas": é um dia no ar com o roteador do livro ensinando a regra revogada. Isso não teria sido
evitado pela revisão chegar antes, porque a varredura de fora do capítulo não estava no escopo que
o lote recebeu · o que a revisão antes do push teria comprado é a lista chegar junto com o commit,
e não dois dias depois.
