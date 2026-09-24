# Rodada 106 · veredito

Pino: `8a194e3` (aviso), faixa `5407b38..49f8616`, dois commits da rodada: `b396c83` (o texto) e
`49f8616` (fecha G18 e G29, relato e progresso). Passo 0 pelo §0.1: primeiro
`git merge-base --is-ancestor HEAD origin/main` (o veredito 105, `f8e3e1e`, estava no main), depois
`git switch -C revisora 8a194e3`. Toplevel é a worktree da Revisora, HEAD `8a194e323194`,
`git branch --show-current` dá `revisora`, e a worktree estava limpa antes. Nenhuma ordem do §0.2
nesta rodada.

**O CORRIGE da 105 entrou:** em `2e506a5` a G23 passou a citar `:156`, e nesta faixa foi reapontada
para `:160`, que é a linha da espada hoje (§4).

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA e nenhum CORRIGE.

- **Duas PERGUNTAS ao humano sobre texto que a rodada deixou falso ou contraditório.** Não as
  classifico como CORRIGE porque o conserto exige uma escolha de regra: o parágrafo do teste coletivo
  (`Acoes_Sistema.md:286-289`) e a frase da "jogada estendida" no Ajudante da Régua Comum (§2).
- **As PERGUNTAS da Executora procedem**, com as contas conferidas (§1): o material faz o braçal
  somar, e a cerca da escala de dias.
- **Duas ESCALAS ao Arquiteto.** A primeira: o `Acoes_Catalogo.md:75` ainda descreve o modo Apoiar
  com os números antigos, e o despacho deixou o arquivo fora da rodada (§2). A segunda: o resíduo da
  G18 e da G29 ficou só na caixa. É a segunda vez, depois da G20 na 105 (§6).

## CI (§11)

Workflow `Validar dados e regras`, lido às 21:17 UTC, depois de `gh run watch --exit-status`
(código 0) nos dois que ainda corriam:

| commit | run | resultado |
|---|---|---|
| `b396c83` (o texto) | `36058942048` | `completed / success`, os 19 jobs (Dados e regras e 18 Smoke) |
| `49f8616` (o relato) | `36059208393` | `completed / success`, os 19 jobs |
| `8a194e3` (o aviso) | `36059345070` | `completed / success`, os 19 jobs |

Nenhum job vermelho, nem da faixa nem herdado. Nada chegou ao `origin/main` depois do pino até a
leitura.

## 1 · As quatro contas, refeitas contra o livro

**1 · O sentido dos modificadores.** `Acoes_Sistema.md:1169` (cabeçalho "−4 na Dificuldade"): a
oficina de mestre e o material excepcional ABAIXAM a Dificuldade em 4, o improviso e a sucata a
SOBEM em 4, e os dois eixos se somam. O +4 de quem está sem o ofício é `Acoes_Sistema.md:1020`
("Sem o ofício específico, a Dificuldade sobe +4") e `acoes-oficio-e-mundo.md:47`. Confere com o
relato.

**2 · O braçal (média 7, sem o ofício, então +4 pessoal) contra a espada Comum (Dificuldade 7).**
Com material corrente: de mestre 7, bem equipada 9, comum 11, campo 13, improviso 15. Não soma em
nenhuma. Com material melhor: de mestre com excepcional dá 3 (soma 4); de mestre com selecionado, 5
(soma 2); bem equipada com excepcional, 5 (soma 2). **As cinco linhas da segunda tabela do relato
conferem.**

**O texto publicado promete "nunca"?** Não. As duas versões dizem "não soma na espada em nenhuma
oficina", com a conta da oficina de mestre ao lado (`acoes-oficio-e-mundo.md:123`,
`Acoes_Sistema.md:1203-1206`), e a mensagem do `b396c83` diz o mesmo. A frase é verdadeira pela
oficina e falsa pelo material: com material selecionado ou excepcional numa oficina boa, o braçal
soma. É a frase do autor, e a Executora a escreveu sem apertar nem afrouxar. **PERGUNTA ao humano,
a dela, que eu confirmo:** o texto diz "com material corrente"; o material não vale para quem não
tem o ofício; ou o material bom abre a espada ao braçal. A palavra "nunca" só aparece no fecho da
Direção, sobre a qualidade, e não tem nada a ver com isto.

**3 · O aprendiz, Habilidade 1 e 2, Destreza 2 (Comum).** Soma 3, média 5,5; soma 4, média 7 (a
régua da Longa: 3,5 por par, mais 2 se a soma for ímpar). Com material corrente: de mestre
(Dificuldade 3) soma 2,5 e 4; bem equipada (5) soma 0,5 e 2; comum (7) nada e nada. **Confere com o
relato e com a frase do autor.** Anoto, sem classificar: o livro chama Ferreiro 2 de "Competente ·
Ferreiro de vila" (`habilidades-secundarias.json:1482-1483`), e não de aprendiz; o autor disse
"Habilidade 1 ou 2" com todas as letras, e o texto segue o autor.

**4 · As onze linhas das escalas de semanas e de estações.** Conferi uma a uma contra o critério do
autor (construção fixa no lugar, ou escala de estações; o ofício da linha não decide): casa de
madeira e celeiro, e forja, moinho e oficina montada, são obra; cota de malha, brigandina, lamelar,
carroça e barco de pesca, placa de munição e placa completa são fabricação; as três de estações são
obra. **A tabela do relato confere, e nenhuma das onze fica em dúvida.** A cerca da escala de dias
(`acoes-oficio-e-mundo.md:154`, "Porta, banco, mesa tosca, cerca de 20 m") é o caso que ela achou
fora das onze, e procede como PERGUNTA: pelo critério, uma cerca é construção fixa no lugar. Na
prática a Dificuldade da linha é 4, então as duas regras dão o mesmo número e só o Requisito muda.

## 2 · A régua da metade mudou de alcance: quem citava o modo antigo

Grep de `§ ?3\.5|1d6 por Margem|apoio pela|dá \+2|devolve \+2|tabela de apoio|rola para ajudar` no
repositório inteiro fora de `docs/simulacao/`, e de `metade da Dificuldade|Ajudante|ajudar|apoio`
em `src/` fora dos dois capítulos de ações. O dado não tem regra de apoio (as ocorrências de "apoio"
e "ajudar" em `src/data` são prosa de criatura, de antecedente e de relação social).

**ESCALA · `Acoes_Catalogo.md:75`.** "**1.4 · Ajuda e ação em grupo.** **FECHADA:** em tarefa
divisível os Acúmulos somam; quando não se divide, o ajudante rola e dá +2 mais +1d6 por Margem.
Ver §3.5." A §3.5 agora diz o contrário, e a frase manda o leitor para ela. A Executora não o achou.
**Por que é ESCALA e não CORRIGE (§8):** a rodada não tocou o arquivo, e o despacho §2 o deixou
fora ("Fora: G21 a G28, e qualquer outro texto"). A decisão G18 manda alinhar "o modo 'Apoiar' do
`Acoes_Sistema.md`", e não o catálogo. O catálogo se descreve como "a bancada" (cabeçalho, `:3-4`),
e o verbete 1.4 é o registro de um fechamento de agosto, parente do item fechado da G que eu tratei
como registro histórico na 105. Por isso o conserto mais honesto é uma nota ao lado ("a §3.5 mudou
em 24/09/2026, G18") e não a troca dos números. Quem decide é o Arquiteto.

**PERGUNTA · o parágrafo do teste coletivo, `Acoes_Sistema.md:286-289`.** "Repare no que esses
números fazem sozinhos: cada pessoa a mais sobe a Dificuldade em 2, e essa mesma pessoa devolve +2
se passar. **O companheiro competente é neutro, o incompetente é peso, e o perito melhora o grupo**
(porque a Margem dele vira dado)." A rodada trocou o item 3 logo acima para "pela regra de apoio
acima", e o parágrafo seguinte ainda descreve a regra velha: não há mais +2 por passar nem Margem
que vira dado. Pela regra nova, um exemplo: Dificuldade 7, grupo de três, Dificuldade 13, metade 7;
um companheiro de média 10,5 passa por 3,5 e não chega aos 6 que dão +1. **Ele custa +2 e devolve
0: o competente virou peso, e o perito (média 16, +1) ainda custa 1 líquido.** A conclusão de desenho
do parágrafo se inverteu. A Executora trouxe o teste coletivo no PRECISA DE MIM 4, mas como
diferença entre documento e capítulo; **o que eu acrescento é que o documento ficou falso sobre si
mesmo**, na linha seguinte à que a rodada editou.

**A conta da classificação, escrita para a assimetria com o catálogo não parecer descuido.** Este
parágrafo tem mais direito a ser da rodada do que o catálogo: fica dentro do §3.5, que o despacho
mandou editar, logo abaixo do item que a Executora mudou. Pelo §8, seria CORRIGE se houvesse um
conserto honesto que não decidisse regra. Não há: ou o coletivo passa a punir o grupo competente (e
o parágrafo se reescreve com essa conclusão), ou o coletivo ganha regra própria de ajuda. Apagar o
parágrafo também decide, porque tira do livro a única explicação do coletivo. A escolha é do humano.

**PERGUNTA · a "jogada estendida" no Ajudante da Régua Comum, `acoes-e-sistema.md:172`.** A rodada
pôs no começo do parágrafo que a regra é "em **apoio numa jogada única**, numa ação que não se
divide", e deixou no meio do mesmo parágrafo a frase de antes: "Numa jogada estendida, pode-se usar
a média das jogadas do ajudante em vez de rolar a cada intervalo." Jogada estendida com intervalos
não é jogada única. **O parágrafo se contradiz, e a contradição nasceu nesta faixa.** Duas leituras
salvam o texto, e cada uma é uma regra diferente: "jogada única" quer dizer "ação que não se divide",
e o apoio vale também numa Acumulada indivisível (a cirurgia de horas), e então a frase fica e o
qualificador se reescreve; ou o apoio é só de uma jogada, e a frase sai. A frase do autor diz
"APOIO numa jogada única, ação indivisível", o que não decide entre as duas.

**O resto que a varredura achou, e por que não entra:**

- `Acoes_Sistema.md:1493`, o curandeiro ("apoia pela §3.5 (+2 passando, +1d6 por Margem)"): a
  Executora o trouxe (PRECISA DE MIM 3). Concordo que é escolha: a remissão e os números agora
  discordam, e qual dos dois cede é regra de doença.
- `Acoes_Sistema.md:642` (escalar, "pela regra da §3.5"), `:819` (arrombar, "apoio pela §3.5") e
  `:880` (furtividade, teste coletivo): remetem sem citar número, e passam a valer pela regra nova
  sem contradição escrita. Se o autor quiser que o segundo ombro na porta continue valendo +2, é
  decisão dele; o texto não afirma isso.
- `Acoes_Sistema.md:1639` (fecho de pendência antiga, "fecharam ajuda, apoio e teste coletivo") e
  `docs/pendencias/G-acoes-sistema.md:162-168` (o corpo da G18, fechada, marcado como texto de
  `5407b38`): registro histórico.

## 3 · O `:8` do capítulo de ofício: o link resolve

Rodei `npm run build` na minha worktree (código 0, `dist/` próprio) e li o HTML com Python:
`dist/regras/acoes-oficio-e-mundo/index.html` tem **um** `id="oficina-material-e-ajuda"` (o `h2`
"Oficina, material e ajuda") e **um** `href="#oficina-material-e-ajuda"`, o do topo. O slug confere
também pelo `github-slugger`. Os dois links de capítulo novos, o da `:117` para a Régua Comum e o da
`acoes-e-sistema.md:174` para Ofício e Mundo, saem com o prefixo (`/centelha-rpg/regras/...`), pelo
`rehypeBaseLinks` do `astro.config.mjs:69`.

Um zero ambíguo no caminho, que conto porque quase virou achado: o primeiro `grep -o` que rodei no
HTML devolveu 0 para o `id` e para o `href`. O `grep` deste ambiente passa pelo `rtk`, e a leitura
por Python achou os dois. O resultado que vale é o de Python.

## 4 · As 27 citações reapontadas

Conferi **as 27**, e não uma amostra, lendo a linha de destino no pino: G14 (`Acoes_Sistema.md:328-331`,
as escalas de Firula); G16 (`acoes-e-sistema.md:195`, "só vale para a secundária"; `Acoes_Sistema.md:590`,
a mesma frase); G17 (`:1040-1042`, a lista de ofícios; capítulo `:176`, a Placa completa); G21
(`:1283-1287`, a muralha; capítulo `:186`); G22 (`:1318` e capítulo `:206`, a fórmula do ganho); G23
(`:1138-1144`, a espada do §7.5 e a linha Comum; `:1257` e capítulo `:160`, a linha da espada); G24
(capítulo `:206-208` e `:1318-1322`); G25 (`:1258`, capítulo `:161`, arco e besta; `:1281`, capítulo
`:184`, navio e catedral); G26 (`:1257`, capítulo `:160`); G27 (`:1254`, capítulo `:157`, faca e
machado); G28 (`:1242` e capítulo `:145`, flecha de guerra; `:1258` e capítulo `:161`; `:1040-1042`).
**Todas certas.** As que ficaram de fora do reapontamento também conferem: a G14 cita
`acoes-e-sistema.md:109` e a G15 cita `:107-109`, as duas acima do trecho mudado; a G23 cita `acoes-e-sistema.md:143` e
`Acoes_Sistema.md:160-163`, acima também; G18, G19, G20 e G29, fechadas, declaram o sha do texto que
citam. Fora de `docs/simulacao/caixa/`, nenhum outro arquivo cita linha dos três documentos:
conferido com a ferramenta Grep (e não com o `grep` do Bash, pelo zero do §3), padrão
`(acoes-e-sistema|Acoes_Sistema|acoes-oficio-e-mundo)\.md:\d+` no repositório inteiro. Deu 23
arquivos: 22 na caixa (um deles o rascunho deste veredito) e o `G-acoes-sistema.md`, que é o controle positivo.

## 5 · Os dois lados dizem a mesma regra

Capítulo de ofício `:8`, `:115-129` contra `Acoes_Sistema.md:1186-1223`, frase a frase: a
separação entre apoio e trabalho divisível, a fórmula da condução, a herança, o +4 pessoal, a trava
de dez, o braçal, os aprendizes com o exemplo do autor, o critério de obra com a carroça, o barco e
o navio, e o fecho "Na fabricação, a Dificuldade 4 não vale". **Iguais**, com uma única diferença
deliberada: o documento registra as decisões (G18, G19, G20, G29) e o capítulo não. O §3.5 do
documento e o Ajudante da Régua Comum dizem a mesma regra da metade. O §7.3 (`:1076-1079`) não mudou
e continua certo com o texto novo, como o relato diz.

A troca do fecho da Direção ("Na forja, na bancada e no tear" para "Na fabricação") é boa: é
exatamente o ruído que eu tinha anotado na 105, e o critério novo o tornou necessário.

## 6 · O resíduo ficou na caixa de novo (ESCALA ao Arquiteto, segunda ocorrência)

A G18 e a G29 estão `[x]`. A G29 diz "Fica em aberto, no relato da rodada 106". O que ficou aberto
das duas existe só no `106-executora.md` e neste veredito:

- o material que faz o braçal somar (§1);
- a cerca da escala de dias (§1);
- o curandeiro, `Acoes_Sistema.md:1493` (§2);
- o teste coletivo, nas duas faces: a diferença entre documento e capítulo (a Executora) e o
  parágrafo `:286-289`, que ficou falso (§2);
- a "jogada estendida" do Ajudante (§2);
- o `Acoes_Catalogo.md:75` (§2).

**É a mesma forma da G20 na 105 (`105-revisora.md` §6)**, e aquela ESCALA virou a G29 em `2e506a5`.
Duas ocorrências seguidas já mostram a causa: o despacho manda fechar o item, e o resíduo da decisão
vai para o relato, que ninguém lê como lista de pendências. Sugiro ao Arquiteto duas coisas:

1. Itens G novos para o resíduo acima.
2. Uma linha no molde do despacho: quem fecha um item com resíduo abre o item novo no mesmo commit,
   e não no relato.

## 7 · O resto da prova

- **`Pendencias.md`:** rodei `node scripts/gen-pendencias.mjs` no pino e o arquivo não mudou (276
  itens, 184 abertos, 4 parciais, 88 fechados), então o commitado é o gerado. A contagem vale para
  `8a194e3`.
- **Travessão:** conferido lendo os ARQUIVOS (ver a linha de fecho).
