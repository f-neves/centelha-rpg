# Balde C: investigação dos 5 itens indicados

Numeração conforme `docs/simulacao/caixa/leitura-de-novato-capitulos.md`.

---

## Item 2: Relação social do Meio-Orc

**Pergunta:** `racas.json` tem algum campo mecânico separado da `descricao` em prosa que fixe
o ponto de partida na Régua de Relação? Ou é só prosa dos dois lados?

**Investigado:** `src/data/racas.json`, verbete `meio-orc` (linhas 138-157). O objeto tem
campos mecânicos estruturados para vários traços (`atributos`, `bonusCondicional`,
`aparenciaMod`, `aparenciaUniversal`, `longevidade`), mas o ponto de partida na Régua de
Relação **não é um desses campos**: ele só existe dentro do array `tracos`, como texto livre
("Sangue partido: não carrega inimizades naturais e parte do Neutro com os outros; em troca,
os demais povos o recebem no Neutro baixo... a um passo da Antipatia"). Não existe, em nenhum
JSON de `src/data/`, uma tabela ou campo numérico de "régua de relação por raça" (procurei por
`relacoes`, `regua`, `antipatia`, `simpatia` em todos os `.json` de `src/data/`: zero
ocorrências estruturadas, fora de texto livre nos verbetes de raça).

**Conclusão: continua sendo prosa dos dois lados**, sem campo mecânico que resolva a
divergência entre `racas.md:115` ("−1 Antipatia") e `racas.json` ("Neutro baixo, a um passo da
Antipatia").

**Balde recomendado: B.** Não é um caso de "JSON vence porque é a fonte mecânica": nenhum dos
dois lados é mais autoritativo que o outro em estrutura de dado, e os dois descrevem pontos de
partida diferentes na régua (Antipatia já rompida vs. Neutro ainda não rompido). Escolher qual
prevalece é decisão de design social do sistema (mudaria, por exemplo, quantos passos um
jogador de Meio-Orc precisa percorrer para sair da hostilidade inicial com as outras raças),
não um alinhamento mecânico.

---

## Item 3: Frenesi contido do Meio-Orc

**Pergunta:** mesma pergunta do item 2, mecânico vs. prosa nos dois lados.

**Investigado:** mesmo verbete `meio-orc` em `racas.json`. O traço "Frenesi contido" também só
existe como texto livre no array `tracos`, sem campo mecânico próprio (não há, por exemplo, um
campo `frenesi: { ignoraPenalidadeFerimento: bool }` ou equivalente em nenhum JSON de combate
ou condições). Busquei `frenesi` em `regras.json` e `condicoes.json`: nenhuma ocorrência
estruturada; a palavra só aparece dentro de strings de descrição de raça.

`racas.md:112` diz "ignorando as penalidades de ferimento" (mesma frase do Orc puro, `racas.md:128`).
`racas.json` (verbete Meio-Orc) diz "sem penalidade de **dano**" (uma frase diferente).
O verbete do **Orc puro** em `racas.json` (linha 133) usa a frase igual à do capítulo:
"ignorando as penalidades de ferimento".

**Conclusão: também é prosa dos dois lados**, sem campo mecânico. Mas aqui há um dado a mais
que pesa para um lado: o Orc puro tem a MESMA frase nos dois lugares (capítulo e JSON:
"ignorando as penalidades de ferimento"), e só o Meio-Orc diverge, com uma frase que muda o
sentido ("sem penalidade de dano" é outra coisa, mecanicamente: não interage com a tabela de
Limiares de Ferimento, e sim com o dano que o próprio personagem causa). Isso sugere erro de
digitação/edição ao escrever o Meio-Orc a partir do Orc, e não uma escolha deliberada de dar
ao Meio-Orc um benefício diferente do Orc.

**Balde recomendado: A, com ressalva.** Dado que as outras três instâncias do mesmo traço
(capítulo do Orc, JSON do Orc, capítulo do Meio-Orc) concordam em "ignorando as penalidades de
ferimento", e só uma diverge (JSON do Meio-Orc), a leitura mais provável é erro de cópia, não
decisão nova. Proponho a correção como balde A: alinhar `racas.json` (verbete Meio-Orc, traço
"Frenesi contido") de "sem penalidade de dano" para "ignorando as penalidades de ferimento",
igual às outras três fontes. Mas como isso muda o efeito mecânico de uma raça publicada (mesmo
que para corrigir um provável erro), sinalizo a ressalva: se o Arquiteto souber que o
Meio-Orc foi *deliberadamente* enfraquecido nesse traço em relação ao Orc (e não é erro de
cópia), o item volta para B.

---

## Item 8: Fôlego da Alabarda

**Pergunta:** confira as outras armas de classe Haste em `armas.json` contra a tabela de
`folego.md`. Todas divergem do valor "fixado pela classe", ou só a Alabarda?

**Investigado:** `src/data/armas.json` tem exatamente **duas** armas de `classe: "haste"`:
Lança (`folego: 24`) e Alabarda (`folego: 32`). A tabela de `folego.md` fixa "Haste: 24" para
a classe inteira. A Lança bate exatamente com o valor da classe; **só a Alabarda diverge**, e
diverge para um número (32) que não corresponde a nenhuma das seis linhas da tabela de
`folego.md` (Leve 15, Média 24, Pesada 38, Haste 24, Distância 20, Arremesso 12–20): 32 é um
valor órfão, não a "pesada" (38) nem a "haste" (24) nem soma óbvia das duas.

**Conclusão:** não é um problema sistêmico da classe Haste (a Lança prova que a regra "fixado
pela classe" funciona normalmente); é um valor isolado, só na Alabarda, sem correspondência em
nenhuma linha da tabela que o capítulo declara ser exaustiva.

**Balde recomendado: continua C, tendendo a B.** Não consegui determinar, só com os dados
disponíveis, se 32 é um erro de digitação no JSON (deveria ser 24, igual à Lança) ou se a
Alabarda foi pensada como uma exceção deliberada dentro da classe Haste (ela é, afinal, mais
pesada fisicamente que a Lança, e algum motivo de balanceamento pode justificar o Fôlego mais
alto). Como o valor não bate com **nenhuma** regra documentada (nem "fixado pela classe", nem
uma progressão visível a partir de outro atributo da arma como peso ou dano), não dá para
"alinhar" sem inventar qual das duas leituras é a certa: se o Fôlego é mesmo fixo por classe,
a correção é ajustar `armas.json` para 24; se a Alabarda é exceção proposital, a correção é
declarar essa exceção em `folego.md`. As duas são mudanças válidas mas mutuamente exclusivas, e
só o Arquiteto sabe qual foi a intenção original ao dar à Alabarda um Fôlego diferente da
Lança.

---

## Item 15: Prazo de fabricação da espada Excepcional

**Pergunta:** existe em algum lugar do capítulo ou do JSON os valores dos bônus citados
("oficina de mestre, bônus do ofício geral, Especialidade") que fechariam a conta de 14,8 para
8 semanas? Ou eles não estão em lugar nenhum?

**Investigado:** `src/content/chapters/acoes-oficio-e-mundo.md` (seção da tabela da espada,
linhas 96-98) diz textualmente que a soma máxima de um humano (12) dá "média 21 e cinco pontos
por semana contra a Dificuldade 16, ou seja **quinze semanas**" como cálculo de base, e credita
a diferença até "8 semanas" (o valor que a própria tabela, na mesma linha, publica) a "oficina
de mestre, o bônus fixo do ofício geral e a Especialidade", **sem quantificar nenhum dos três**.

Busquei em `src/data/regras.json` por `oficina`, `ofício geral`, `oficioGeral`: **zero
ocorrências**. Busquei por qualquer estrutura de bônus de ferramentaria/oficina em
`src/data/*.json` inteiro: não existe. O capítulo de Habilidades Secundárias
(`habilidades-secundarias.json` / `habilidades-secundarias.md`) define Especialidade
genericamente (+1d6 por nível na jogada), mas não amarra um valor específico a "Especialidade
em ferraria" nesse exemplo, nem diz quantos níveis o ferreiro do exemplo teria.

**Conclusão: os valores não estão em lugar nenhum.** Não é uma divergência entre duas fontes
que se possa reconciliar (não há uma segunda fonte); é uma afirmação do capítulo ("8 semanas")
sem lastro numérico verificável em parte alguma do sistema, nem mesmo na prosa do próprio
capítulo (que só computa 15 semanas como base e para por aí).

**Balde recomendado: B.** Fechar essa conta exige que alguém decida quanto vale "oficina de
mestre" (um bônus fixo na Dificuldade? no Acúmulo por rolagem? um redutor direto de semanas?),
quanto vale "o bônus fixo do ofício geral" citado (não há um "bônus fixo" descrito em nenhum
outro lugar do capítulo de Ofícios) e que nível de Especialidade o ferreiro do exemplo tem.
Qualquer um desses três números, se eu escolhesse um valor que fechasse a conta em 8 semanas,
seria eu inventando a regra, não alinhando a uma já existente. Isso é decisão de balanceamento
do próprio Arquiteto.

---

## Item 54: Dificuldades de Escalar/Nadar fora da régua redonda

**Pergunta:** esses números batem com alguma fórmula (não uma tabela redonda, mas calculada)
documentada em outro lugar, ou parecem só escolha solta?

**Investigado:** `acoes-corpo-e-movimento.md` (Escalar): Dificuldades 4, 7, 11, 12, 14
(Nadar: 4, 7, 11, 14, 18). Busquei em `regras.json` e no restante dos capítulos de Ações por
qualquer fórmula que gere essa progressão a partir de outra variável (altura, correnteza,
metros por Tick etc.): não encontrei nenhuma. Também não é a régua redonda de
`acoes-e-sistema.md` (5/10/15/20/25/30): os números ficam sistematicamente um pouco abaixo dos
múltiplos de 5 mais próximos (4 fica perto de 5, 11 fica perto de 10 mas acima, 14 fica entre
10 e 15, 18 fica perto de 20 mas abaixo), sem um padrão aritmético óbvio (não é `múltiplo de 5
menos 1`, nem geométrico).

O padrão que **existe**, olhando as duas tabelas lado a lado, é de **granularidade**: Escalar e
Nadar têm cinco degraus de dificuldade cada (contra os seis da régua comum), cobrindo um
intervalo menor (de "Fácil-menos" a "Difícil-mais", ou seja, dentro da banda que vai de 5 a 20
na régua comum), como se fossem uma régua PRÓPRIA, mais fina, para essa família específica de
ação. Isso é consistente com o padrão já visto no Quase-Acerto (`quase-acerto.md:32`), que
também declara abertamente ter "uma régua PRÓPRIA" e não a régua comum.

**Conclusão:** os números não vêm de fórmula nenhuma, mas também não parecem soltos ao acaso:
formam uma progressão crescente coerente (cada linha da tabela é mais difícil que a anterior,
sempre), só que numa escala mais fina que a régua comum de seis degraus, sem nunca ser chamada
assim no texto.

**Balde recomendado: A (mas do tipo "nota de documentação", não "número errado").** Não há
nada para "consertar" numericamente (nenhuma contradição entre capítulo e dado, nenhuma conta
que não feche), então isto não vira uma correção de valor. A correção cabível é uma frase,
alinhando este capítulo ao padrão de aviso que `quase-acerto.md:32` já usa para o mesmo tipo de
situação (régua própria, mais fina, dentro da mesma família de conceito): acrescentar, nas
seções de Escalar e Nadar, algo como "esta tabela usa uma escala própria, mais fina que a régua
comum de seis degraus, mas segue a mesma lógica: quanto maior o número, mais difícil". Isso não
inventa mecânica nova, só nomeia um padrão que já existe e já tem precedente de redação em
outro capítulo do mesmo livro.
