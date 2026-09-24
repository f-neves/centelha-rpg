# Rodada 105 · veredito

Pino: `f2feeac` (aviso), faixa `bbec609..3d696b6`, dois commits da rodada: `0a934cf` (o texto) e
`3d696b6` (fecha G19 e G20, relato e progresso). Passo 0 pelo §0.1: primeiro
`git merge-base --is-ancestor HEAD origin/main` (o veredito 104, `cde53c7`, estava no main), depois
`git switch -C revisora f2feeac`. Toplevel é a worktree da Revisora, HEAD `f2feeac4eae9`,
`git branch --show-current` dá `revisora`, e a worktree estava limpa antes. Nenhuma ordem do §0.2
nesta rodada; a D8 do `decisoes.md` foi lida e não toca esta revisão.

**Veredito geral: PROCEDE COM UM CORRIGE.** Nenhum BLOQUEIA.

- **CORRIGE:** uma citação da G23 que o reapontamento deixou para trás (§4).
- **Duas PERGUNTAS ao humano**, as duas sobre a letra da decisão, e nenhuma delas é defeito da
  Executora: o modificador de oficina na "Dificuldade da peça" do ajudante (§2) e a linha carroça
  e barco de pesca (§3).
- **Uma ESCALA ao Arquiteto:** as duas dúvidas acima vivem só na caixa, com a G20 já fechada (§6).

## CI (§11)

Workflow `Validar dados e regras`, lido às 20:32 UTC (`gh run view --json jobs`):

| commit | run | resultado |
|---|---|---|
| `0a934cf` (o texto) | `36053286926` | `completed / success`, os 19 jobs (Dados e regras e 18 Smoke) |
| `3d696b6` (o relato) | `36053506844` | `completed / success`, os 19 jobs |
| `f2feeac` (o aviso) | `36053651899` | `completed / success`, os 19 jobs |

Nenhum job vermelho, nem da faixa nem herdado.

**O que chegou depois do pino (§10, terceiro caso).** Entre a reancoragem e este veredito entrou
`64c1347` (G25 a G28, "só registro"), que toca `Pendencias.md` e `G-acoes-sistema.md`. Ele só
acrescenta itens depois da G24: não toca nenhuma linha que eu julguei, e a `:207` da G23 continua
com o `:152` errado no `origin/main`. **Nenhuma conclusão muda; as contagens da §7 abaixo (268
itens, 178 abertos) valem para `f2feeac`, e não para o topo.** O run de `64c1347` estava em
andamento às 20:32 e não é desta faixa.

## 1 · Os dois lados dizem a mesma regra?

Li frase a frase, nos arquivos e não no diff: capítulo `acoes-oficio-e-mundo.md:22`, `:33`,
`:115-125`, contra `Acoes_Sistema.md:1060`, `:1077-1082`, `:1189-1212`.

- **A linha Requisito da tabela** é igual nos dois, palavra por palavra, trocando só a remissão
  ("(§7.6)" no documento, "(ver Ajuda e Direção de obra)" no capítulo).
- **As duas exceções ao Requisito** (`:33` e `:1079-1082`) dizem a mesma coisa: na fabricação,
  condução de quem cumpre o Requisito da peça, contra a Dificuldade da peça; na obra, direção de
  quem tem o ofício, sem Requisito, contra a Dificuldade 4. Mesma frase de fecho ("quem sabe é quem
  conduz").
- **A correção que a Executora relata no §7.3 está no arquivo:** a obra continua "sob direção de
  quem tem o ofício" (`Acoes_Sistema.md:1081`), e não "de quem cumpre o Requisito". Ela bate com a
  fórmula da obra (`:1206`) e com o capítulo (`:123`).
- **As duas fórmulas** são idênticas nos dois lados, e a da fabricação é a frase do autor
  (`105-despacho.md` §1) sem uma palavra mudada.
- **Diferença única, e ela é certa:** o documento traz "Decidido pelo autor em 24/09/2026 (G19 e
  G20)" (`:1197`) e o capítulo não. Registro de decisão fica no documento de regra.

**A régua de "não passar" está certa pela letra:** `Acoes_Sistema.md:998-999` ("quem tem média
igual ou menor que a Dificuldade não termina nunca") e o capítulo `:14`, as mesmas palavras. Média 7
contra 7 não avança.

**O dado não fala do ajudante.** Grep de `ajudante|direção de obra|mestre de obras|aprendiz|sob
condução|sob direção` em `src/` fora de `content/`: só os dois rótulos de nível 1
(`habilidades-secundarias.json:1478`, `regras.json:11`), que dizem "aprendiz" e nada sobre ajuda.

## 2 · O aprendiz: as contas estão certas, e todas foram feitas contra 7 puro (PERGUNTA)

**A conta da Executora confere.** Aprendiz é Habilidade 1 (`habilidades-secundarias.json:1478`,
"Aprendiz: prego, gancho e conserto tosco", no nível 1 do Ferreiro). Pela régua da média da Longa
(3,5 por par de dados, mais 2 se a soma for ímpar): Destreza 2 dá soma 3 e média 5,5; Destreza 3
dá soma 4 e média 7; Destreza 4 dá soma 5 e média 9. O texto novo diz a regra ("cada um soma o que
a sua média passar da Dificuldade 7") sem afirmar que a média passa, e isso é o que o despacho
mandou. **Não promete nada que a letra não entrega**, desde que a Dificuldade seja 7.

**O que as contas não consideram, e o texto também não diz.** A §7.6 põe oficina e material como
modificadores **na Dificuldade** (`Acoes_Sistema.md:1169-1175`, a coluna diz "−4 na Dificuldade"),
e a §7.2 põe **+4** para quem trabalha sem o ofício (`:1023`). A regra nova diz "trabalha contra a
Dificuldade da peça" e não diz se essa Dificuldade leva esses modificadores. As contas mudam de
resultado conforme a leitura:

| leitura | Dif do ajudante na espada Comum | braçal (média 7) | aprendiz Destreza 2 (5,5) | aprendiz Destreza 3 (7) |
|---|:--:|:--:|:--:|:--:|
| 7 puro (a do texto e a do relato) | 7 | 0 | 0 | 0 |
| com a oficina, forja bem equipada | 5 | **2** | 0,5 | 2 |
| com a oficina, forja de mestre | 3 | **4** | 2,5 | 4 |
| o braçal com o +4 de sem ofício, forja de mestre | 7 | 0 | (não se aplica) | (não se aplica) |

A última linha vale só para o braçal: o aprendiz TEM o ofício (Ferreiro 1), e o +4 não o alcança. O
braçal não tem, e com o +4 ele não soma em oficina nenhuma. A pergunta é se o +4 vale para quem
está sob condução.

**Consequência:** "Um braçal, de média 7, não soma nada na espada" (`acoes-oficio-e-mundo.md:119`,
`Acoes_Sistema.md:1196-1197`) só vale sem desconto de oficina, ou com o +4 de sem ofício aplicado
ao braçal. Numa forja bem equipada, pela leitura que aplica a oficina a quem ajuda e não aplica o
+4, ele soma 2 por dia. E o PRECISA DE MIM 1 da Executora ("pela letra ele só vale para aprendizes
de Destreza 4") vale só na oficina comum: numa forja de mestre, aprendizes de Destreza 2 somam.

**Classificação: PERGUNTA ao humano, e não CORRIGE.** A frase do braçal é do autor, pedida por ele
de forma explícita (`105-despacho.md` §1), e a Executora não podia escolher a leitura. A pergunta:
**a Dificuldade da peça, para quem ajuda, leva os modificadores de oficina e material? E o +4 de
quem não tem o ofício vale para o ajudante sob condução?** Não testei nenhuma leitura contra
intenção do autor; a tabela acima é só a aritmética das três.

## 3 · A escala de semanas: o texto põe peça dentro da obra? (PERGUNTA)

A pergunta do aviso, respondida como foi feita. O texto novo diz "alvenaria, engenharia, construção
naval, carpintaria de construção, as obras das escalas de semanas e de estações, como a casa, o
moinho, a muralha e o navio" (`acoes-oficio-e-mundo.md:121`, `Acoes_Sistema.md:1199-1201`).

- **Nenhuma armadura cai em obra.** Cota de malha, brigandina, lamelar e as duas placas são Armaria,
  e o fecho "Na forja, na bancada e no tear, a Dificuldade 4 não vale" (`:125`, `:1211-1212`) as põe
  do lado da peça sem ambiguidade.
- **"As obras das escalas" restringe, e não inclui tudo:** a frase diz "as obras de", e os quatro
  exemplos são todos obra. Lida sozinha, ela não põe peça em obra.
- **A linha que o texto não decide é uma só:** "Carroça, barco de pesca | Carpintaria"
  (`acoes-oficio-e-mundo.md:169`, `Acoes_Sistema.md:1259`). Pela lista de ofícios do próprio autor,
  o barco de pesca pode ser "construção naval" (obra) e a carroça não é "carpintaria de construção"
  (peça). **Uma leitura parte a linha da tabela em duas regras.** A ambiguidade vem da frase do
  autor, e o texto novo não a piora nem a resolve. A Executora já a trouxe no PRECISA DE MIM 3.
- **Linhas de Dificuldade 4 não importam** (casa de madeira e celeiro, porta e cerca): as duas regras
  dão o mesmo número ali, e só o Requisito difere.

Um ruído menor, e não achado: "Na forja [...] a Dificuldade 4 não vale" usa forja como lugar, e a
tabela de semanas tem "Forja, moinho, oficina montada" como obra de Alvenaria. Levantar a forja é
obra; trabalhar nela é peça. Leitura de contexto resolve, e fica só anotado.

**Classificação: PERGUNTA ao humano:** carroça e barco de pesca são peça ou obra?

## 4 · As citações reapontadas, e o portão (CORRIGE)

Conferi todas as citações de linha do tema G para `Acoes_Sistema.md` e para o capítulo, lendo a
linha de destino no pino, e não só as duas por amostra que o aviso pediu:

| item | citação | aponta para | confere |
|---|---|---|:--:|
| G17 | `Acoes_Sistema.md:1043-1045` | os nomes dos ofícios | sim |
| G17 | `acoes-oficio-e-mundo.md:51` | a lista dos ofícios do capítulo | sim |
| G17 | `:172` (capítulo) | "Placa completa sob medida · Armaria" | sim |
| G18 | `Acoes_Sistema.md:256-282` | a §3.5 | sim |
| G21 | `Acoes_Sistema.md:1272-1276` | o parágrafo da muralha | sim |
| G21 | `acoes-oficio-e-mundo.md:182` | o exemplo da muralha | sim |
| G22 | `Acoes_Sistema.md:1307` | a fórmula do ganho | sim |
| G22 | `acoes-oficio-e-mundo.md:202` | a fórmula do ganho | sim |
| G23 | `Acoes_Sistema.md:160-163` | a espada da Longa, Acúmulo 10 | sim |
| G23 | `Acoes_Sistema.md:1141-1147` | a espada do §7.5 e a tabela | sim |
| G23 | `:1246` | "Espada, machado de guerra" na escala de dias | sim |
| G23 | `acoes-oficio-e-mundo.md:93` | a linha Comum da régua da espada | sim |
| **G23** | **`:152` (capítulo)** | **"Gambeson · Alfaiataria"** | **não** |
| G24 | `acoes-oficio-e-mundo.md:202-204` | a fórmula e o teto | sim |
| G24 | `Acoes_Sistema.md:1307-1311` | a fórmula e o teto | sim |

As citações de G19 e G20 ficam fora da tabela: as duas declaram no próprio item que são do texto de
antes da decisão (`bbec609`), e isso é certo.

**CORRIGE: G23, `docs/pendencias/G-acoes-sistema.md:207`, `:152` tem de ser `:156`.** A linha da
espada no capítulo é `:156` desde `0a934cf`, e a própria Executora o diz na conferência 1 do relato
("era `:152` antes do texto novo"). O relato afirma, na seção 3, que reapontou a G23 e cita só a
metade do documento de regra. **Por que é CORRIGE e não ESCALA (§8):** a rodada promete, por
escrito, ter reapontado as citações que o texto novo deslocou, e esta é uma delas; o conserto é
trocar um número.

**A afirmação sobre o portão é verdadeira, e a frase do despacho §3 era falsa.** O despacho dizia
"o portão de procedência lê" as citações da G24. Não lê, por construção: o bloco de citações de
código do `scripts/test-procedencia.mjs` (`:280-281`, a `CITACAO` e a `ehCitacao`) só aceita
`.ts|.astro|.mjs:N`, e a lista de documentos que ele varre (`:320-330`) não inclui o
`G-acoes-sistema.md`. **Controle negativo natural:** rodei `node scripts/test-procedencia.mjs` no
pino, com o `:152` errado presente, e ele deu verde ("Procedência OK · 4 citações de linha").

## 5 · Quem mais fala do ajudante na forja

Grep de `ajudante|aprendizes|braça(l|is)|sob dire|sob a condu|Dificuldade 4` no repositório, fora de
`docs/simulacao/`. Além do que a faixa tocou:

- **`acoes-e-sistema.md:172` e `:178`** (metade da Dificuldade, com forjar de exemplo): a G18, que a
  Executora apontou.
- **`acoes-oficio-e-mundo.md:8`, e este ninguém tinha apontado.** O parágrafo de abertura do
  capítulo diz que "as regras de ajuda estão em A Régua Comum, e valem para tudo o que vem aqui", com
  link para a página do `:172`. Então o capítulo publicado manda o leitor, na primeira linha, para a
  regra da metade, e na `:117` dá a regra da Dificuldade inteira. **ESCALA para a G18**, como segundo
  endereço dela; a faixa não tocou a `:8`.
- **`Acoes_Sistema.md:268` e `:281`** (§3.5 "Apoiar o principal", mesma Dificuldade, "Ajudar exige
  saber fazer") e **`Acoes_Catalogo.md:75`**: são o modo de tarefa que NÃO se divide. A regra nova é
  do modo que soma Acúmulo, e as duas não colidem. Ficam na G18 como estão.
- **`docs/pendencias/G-acoes-sistema.md:53`**: item fechado, que registra a direção de obra como
  fechada em agosto, sem o recorte de obra. É registro histórico de item `[x]`; não é regra viva.

**Não achei** nenhum outro lugar, no livro nem no dado, que dê Dificuldade 4 ou dispensa de Requisito
para peça.

## 6 · O que ficou só na caixa (ESCALA ao Arquiteto)

A G20 está `[x]`, e as duas dúvidas que ela deixou (a média do aprendiz, a §2 acima, e a linha
carroça e barco, a §3) existem só no `105-executora.md` e neste veredito. A G20 fechada diz "Fica em
aberto, no relato da rodada 105", que é um item aberto apontando para a caixa. **Não é defeito da
Executora:** o despacho §4 mandou fechar as duas. Mas item que vive em relato é item meio aberto em
lugar nenhum; sugiro um item G novo (ou dois), com a PERGUNTA da §2 deste veredito, que é mais larga
que a do aprendiz.

## 7 · O resto da prova

- **`Pendencias.md`:** rodei `node scripts/gen-pendencias.mjs` no pino e o arquivo não mudou (268
  itens, 178 abertos, 4 parciais, 86 fechados), então o commitado é o gerado.
- **G24:** o texto é o do despacho §3, com as linhas reapontadas para o texto novo e conferidas
  (tabela da §4).
- **Travessão:** conferido lendo os ARQUIVOS da faixa e este veredito (ver a linha de fecho).
