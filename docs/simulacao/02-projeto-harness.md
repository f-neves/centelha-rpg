# Projeto do harness · o desenho, as decisões e o que implementar

Escrito em 02/09/2026, sobre o commit `df03b44`, e revisto até `d141fa9`. Faz parte de uma série de
quatro, em `docs/simulacao/`:

| | O que é |
|---|---|
| `00-diagnostico.md` (**R1**) | o que existia antes de qualquer decisão: onde mora cada peça do motor, o que é puro, o que não é |
| `01-diagnostico-carga.md` (**R2**) | as 14 paradas que pedem um humano, os conflitos entre capítulo, JSON e motor, e as medições |
| **este** | as decisões tomadas e a especificação do que implementar |
| `03-respostas.md` | as contradições deste documento resolvidas, os 14 invariantes do harness, e as medições novas |
| `04-prontidao.md` | a verificação de prontidão: se cada métrica tem dado, se cada eixo é separável, e o que falta decidir |

**Nenhuma linha deste documento foi implementada.** (Escrito em 02/09, e superado: ver a seção
seguinte, que diz o que foi implementado e o que não foi.)

## As DUAS baterias, e só uma está viva (03/09)

Este documento foi escrito supondo **uma** bateria. São duas, elas medem coisas diferentes, e
misturá-las foi o que deixou passar sete rodadas o buraco da Etapa 1 (a caixa ⚠ da §0.6.1).

| | **A bateria de CARGA** | **A bateria de COMPARAÇÃO DE REGRAS** |
|---|---|---|
| a pergunta | quanto o mestre trabalha, e de que tipo é esse trabalho | quanto cada regra muda a carga |
| **o que ela RESPONDE** | **onde está o trabalho do mestre e quanto a automação compra**: em que Tick, em que gesto, de que classe, e o que sobra depois de automatizar | **quanto cada regra custa em carga**: o delta de uma bandeira ligada contra a mesma cena com ela desligada |
| usa bandeira? | **nenhuma** | as quinze, uma a uma |
| a grade | 96 células (`E1 × E2 × E3 × limiar × tabuleiro`) | as 112 oficiais |
| **estado** | **VIVA.** Rodou quatro vezes em 03/09, 21.600 batalhas por volta, e produziu a conclusão dos três termos | **NÃO EXISTE**, e não pode existir hoje: nenhuma bandeira é lida pelo motor |
| onde ler | `09-bateria-grande.md` | esta pasta, como projeto |

**A de carga não espera pela outra.** Ela é a que responde à pergunta original desta frente (a
carga do mestre no Grid), ela já rodou, e nada nela depende de bandeira: a conclusão dos três
termos (50% aritmética · 33% relógio · 17% julgamento), os 11,4% do Tick morto e o resultado do
limiar de fuga são todos dela.

**A de comparação de regras é a SEGUNDA bateria, e a primeira coisa dela não é rodar, é ligar o
motor.** O **L25** (as quinze bandeiras lidas por caminho de produção, cada uma com o contador de
ocasião que prova que ela morde) deixa de ser item de pendência e passa a ser **pré-requisito da
grade de 112**. Enquanto ele não existir, ligar uma bandeira e medir produz um zero que não se
distingue do zero legítimo.

## O PRINCÍPIO DO ZERO AMBÍGUO · regra de construção

**Um zero só é informação quando a ocasião de ele não ser zero foi contada.**

Sempre que uma medida pode dar zero, ela dá por dois motivos: **o mecanismo rodou e não produziu
nada** (o zero legítimo, que é resultado) ou **o mecanismo não rodou** (o zero vazio, que é
defeito). Os dois saem com o mesmo valor, no mesmo campo, no mesmo CSV, e nenhuma leitura os
separa depois. **O instrumento que os separa é sempre o mesmo: contar OCASIÕES, e não efeitos.**

Não é lição de relatório. É regra de construção, e ela existe porque **a mesma forma de erro já
apareceu dez vezes nesta frente**, em camadas diferentes. E a partir do quinto caso ela tem uma
segunda face: o zero ambíguo é a AUSÊNCIA de sinal lida como sinal, e o espelho dele é a
**PRESENÇA de texto lida como o sinal errado**. Os dois vêm de olhar à volta do sinal em vez de
olhar onde ele mora.

| # | onde | o zero legítimo | o zero vazio | como apareceu |
|---|---|---|---|---|
| **1** | os **seis Ticks sem rolar dado** | "estes Ticks não tiveram rolagem" | o teste passava provando nada, porque nada era rolado | achado por inspeção, depois de o teste estar verde |
| **2** | as **sete comparações do E5** | "o eixo não mudou o resultado" | as comparações não podiam morder | achado pela bateria de sanidade, que existe para falhar |
| **3** | as **quinze bandeiras** | "a bandeira está desligada" | nenhuma é lida pelo motor | achado em 03/09, **depois de sete rodadas de documento** |
| **4** | o **parser do supervisor** (`duo-leitura.mjs`) | "a revisora não escalou nada" | a seção ESCALA saía VAZIA para todo conteúdo, porque `$` em multilinha casa no fim de cada linha | achado pelo `test-duo.mjs` na primeira execução, **antes de o ciclo rodar uma vez** |
| **5** | o **"nada" da ESCALA** (o espelho) | "a revisora escalou uma decisão" | ela escreveu `nada.` e justificou embaixo, em prosa; a regra era "a seção inteira é a palavra nada", leu prosa, leu conteúdo, e conteúdo na ESCALA encerra o ciclo | acendeu na **rodada 02, com dinheiro gasto**: o script parou anunciando "a revisora ESCALOU" contra um texto que dizia o contrário |
| **6** | a **digital da repetição** (o espelho) | "as duas respostas tratam do mesmo assunto" | com UM identificador em cada item, o mesmo identificador dava semelhança 1,00; dois itens diferentes sobre o mesmo objeto (`ocasião · passo` fora do placar, e `ocasião · passo` guardando o piso só por cima) eram "o mesmo assunto" | achado na mesma rodada, conferindo à mão o que a trava seguinte diria se a da ESCALA não tivesse parado antes |
| **7** | o **contador de dinheiro** | "esta execução não gastou nada" | a chamada morreu por limite de conta depois de duas baterias, cinco arquivos e um commit; uma chamada que falha devolve custo 0, e 0 entra na soma como se fosse medido | o RESUMO da rodada 03 publicou **US$ 0,00** para a execução mais cara até então |
| **9** | o **instrumento de bancada citado como prova sobre o produto** | "o Grid guarda os dois vereditos" | ele guarda só com `?lances=1`, que é a bancada: em mesa de verdade os dois campos não coexistem em lugar nenhum e a página descarta tudo ao fechar | achado pela revisora na rodada 05, e é a **segunda vez**: na rodada 04 o espelho comparou o harness contra um mock que chama a função do harness |
| **8** | o **documento que se contradiz** | "os dois trechos podem estar certos" | a `09` D31 diz que o eixo E4 foi cortado por inerte, e a `09` §2.4 atribui um efeito ao passo dobrado desse mesmo eixo. **Nenhum instrumento compara afirmação com afirmação**, então "nada acusou contradição" saía igual a "não há contradição" | achado à mão, conferindo o aviso da rodada 03 |
| **10** | a **asserção negativa sozinha** | "a coisa que não podia acontecer não aconteceu" | o cenário não foi montado, e nada podia acontecer de todo jeito. O teste imprime ✓ pela ausência da ausência | achado em 04/09 pela GÊMEA, e não pelo teste: a brasa da bancada nascia FORA do tabuleiro, a metade "a Arte em montagem não abre o escuro" passava feliz, e só "e a mesma Arte, caída, abre (100 -> 100)" acusou |

**O quinto e o sexto casos custaram dinheiro, e é a diferença deles para os quatro primeiros.**
Os quatro foram achados por inspeção ou por teste, antes de qualquer gasto. Estes dois só
apareceram numa execução molhada, e o motivo é a mesma cegueira que o princípio descreve: os
casos de teste do `test-duo.mjs` foram escritos com a ideia de "vazio" que o autor tinha na
cabeça (`nada` sozinho na seção; identificadores como assunto), e nenhum deles é o que a revisora
de verdade escreveu. **Um teste só cobre a forma de sinal que quem o escreveu imaginou.** O
conserto dos dois entrou com os textos REAIS das rodadas 01 e 02 como caso de teste, e não com
variações inventadas dos antigos.

**O sétimo é o pior lugar em que esta família apareceu, e vale dizer por quê.** Os seis primeiros
estavam em instrumentos de medida e em travas de leitura: eles custaram TRABALHO, e o trabalho
perdido aparece, mais cedo ou mais tarde, porque alguém relê o número e ele não fecha. O sétimo
estava **dentro da trava que existe para proteger o orçamento**, e dinheiro gasto não deixa
rastro no repositório. Um relatório que diz "US$ 0,00" para uma execução cara não fecha com nada,
não contradiz nenhum outro número, e não tem quem o releia: ele é a única fonte sobre o assunto.
**Esta poderia ter custado dinheiro sem ninguém saber quanto, e é a primeira da lista que poderia
ter custado a mesma coisa muitas vezes seguidas.**

O conserto é o de sempre: a soma passou a distinguir "não gastou" de "não consegui ler quanto
gastou", e havendo chamada sem leitura o total sai marcado como **piso**, com quantas chamadas
ficaram de fora. **E o conserto não é completo**, o que também vai escrito: o teto continua sendo
conferido contra a soma do que deu para ler, porque é o único número que existe. Dentro de uma
execução isso não abre buraco, porque a primeira chamada morta encerra o ciclo e não há segunda.
**Entre execuções, abre:** o contador nasce em zero a cada `npm run duo`, e nada soma o que a
execução anterior gastou. Quem fecha esse buraco é o humano lendo o RESUMO, e é por isso que o
piso precisa estar marcado nele.

**O oitavo é o mais difícil de ver, e é o único em que o instrumento que falta não existe em
lugar nenhum da frente.** Os sete primeiros tinham um lugar óbvio para o conserto morar: um
contador de ocasião, um caso de teste, um campo a mais no registro. Este não tem. Vale a pena
dizer o que cada instrumento cobre, porque a lacuna aparece sozinha:

| instrumento | o que ele liga |
|---|---|
| o **espelho** | execução com execução (o laço contra a mesa) |
| os **invariantes** | estado com estado, dentro de uma batalha |
| os **sinais** | conclusão com a ocasião que a sustenta |
| a **procedência** (`test-procedencia.mjs`) | número publicado com a linha do agregado |
| **nada** | **afirmação com afirmação** |

E não adianta querer detector: uma varredura semântica que leia dois parágrafos e decida se eles
se contradizem é cara e provavelmente ruim, e uma que erre para o lado de acusar enche o portão de
falso positivo até ninguém mais ler. **O que dá para fazer barato é o inverso**, e é a seção
abaixo: toda decisão que CORTA alguma coisa fica numa lista só, escrita como PROIBIÇÃO
OBSERVÁVEL, e a conferência é ler a lista contra o documento. A lista não acha contradição em
geral; ela acha a contradição que importa, que é o texto afirmando aquilo que uma decisão tirou.

**O nono caso tem uma simetria que vale escrever: aconteceu duas vezes com os papéis
trocados.** Na rodada 04 a executora afirmou que a mesa compartilha a montagem da
cena, e **a revisora aceitou**; na passada do `ESTADO.md` a executora leu o
`?lances=1` como registro de mesa, e **a revisora pegou**. Nas duas o erro é o mesmo:
citar um instrumento sem conferir o que ele liga a quê e onde ele roda. **Bancada
prova coisa sobre a bancada.** A obrigação que sai daí: antes de citar um instrumento
como prova, diga em que ambiente ele roda e qual é o consumidor do que ele grava.

## O TETO É DO DESENHO, E NUNCA DA NATUREZA · regra de construção

**Nenhum teto se publica sem a frase "com os consertos desenhados até hoje".**

É irmã do princípio do zero ambíguo e vem do mesmo lugar: uma coisa que a medição
não sabe, escrita como se soubesse. O zero ambíguo confunde "não houve" com "não
mediu"; este confunde **"não desenhamos como tirar"** com **"não dá para tirar"**.

**Aconteceu TRÊS VEZES nesta frente, com o mesmo número.** Os 61,8% foram publicados
na `09` §8.2, na caixa da §2.5 e no resumo de uma página, sempre acompanhados de
alguma redação de *"o que sobra não tem conserto de software"*. Era falso nas três.
O resíduo era o ⏭ que abre parada e o botão do veredito, **os dois custo**, e o que
os mantinha de fora era nenhum dos três degraus desenhados tê-los atacado.

E não parou aí, que é o que torna a regra necessária em vez de recomendável:

| o teto publicado | a frase que o acompanhava | o que ele era |
|---|---|---|
| **61,8%** | "o que sobra não tem conserto de software" | o alcance dos três degraus daquele dia |
| **93,7%** | "tirar isso é tirar o mestre do laço" | o alcance dos cinco degraus do dia seguinte |
| **99,7%** | (nenhuma: a regra já valia) | o alcance dos sete de hoje |

**O 93,7% é o caso didático, porque quem o escreveu tinha acabado de desfazer o
61,8%.** A frase "tirar isso é tirar o mestre do laço" supunha que ele precisa
CLICAR para saber o que aconteceu, e ver não é clicar. Bastou perguntar quantas
paradas exigem escolha e quantas só exigem olhar: quatro por cento e noventa e seis
por cento. **A armadilha não é ignorância, é conforto: um teto fecha o assunto, e
fechar o assunto é agradável.**

**As duas obrigações, e as duas são de escrita:**

1. **todo teto vem com a frase**, e ela nomeia o conjunto: "com os consertos
   desenhados até hoje", com a lista deles ao lado. Um teto sem a lista é uma
   afirmação sobre o universo, e a medição não fala sobre o universo;
2. **todo resíduo vem com a pergunta "o que o tiraria?", respondida ou dita como não
   respondida.** Não respondê-la é permitido; deixá-la implícita não é, porque um
   resíduo sem a pergunta ao lado é lido como resíduo sem resposta possível.

E há um sinal barato de que a regra foi violada: **procure a palavra "natureza", e
os seus disfarces** · "não tem conserto", "é da cadência", "é a mesa decidindo", "não
dá para automatizar". Toda vez que uma delas aparece ao lado de um número, ou há uma
prova junto ou há um degrau que ninguém desenhou.

## O QUE FOI CORTADO · a lista que se lê contra o documento

**Esta lista é o instrumento do oitavo caso, e ela se usa lendo.** A terceira coluna é o que a
torna útil: não o histórico do corte, mas **o que não pode aparecer no texto por causa dele**. Um
corte escrito como histórico não pega nada; escrito como proibição, pega na primeira passada.

| decisão | o que ela cortou | o que NÃO pode aparecer no texto |
|---|---|---|
| **D12** | o par de perfis do D1, por redundância | conclusão que compare perfil de automação ligado com desligado |
| **D21** | a bateria assume `rolagem: 'mesa'` (o espelho é que roda em `'site'`) | número de bateria atribuído ao modo `site` que não seja recontagem do mesmo log |
| **D23** | a amostra da célula uníssona, de 500 para 50 voltas | percentil da uníssona lido com a precisão que as outras células têm |
| **D24** | as cinco políticas da §0.4 P4 | afirmação sobre política que recua, hesita ou escolhe alvo diferente |
| **D25** | cinco dos sete arquétipos | conclusão sobre variedade de elenco, alcance ou ciclo que o par de dois não tem |
| **D29** | a fase de fuga, que sai do número de manchete | número de manchete que inclua a fuga sem dizer que inclui |
| **D30** | 88 das 112 células oficiais | qualquer coisa sobre bandeira, política, obstáculo, leitura, reforço ou criatura |
| **D31** | o eixo E4 (assimetria de passo), medido inerte | **efeito atribuído a passo dobrado, a `passoMult` ou a um lado que anda mais depressa** |
| **L25** | nada foi cortado: as quinze bandeiras existem e nenhuma é lida pelo motor | leitura que dependa de bandeira ligada |

**A linha da D31 é a que a rodada 03 violou**, e em quatro lugares de uma vez. Lida contra a `09`,
ela pega a §2.4 antes de qualquer conferência de número, porque a frase proibida está escrita lá
com todas as letras.

E o sexto tem uma segunda lição, sobre consertar heurística: a primeira ideia foi mexer no limiar
(0,6), e o limiar não tinha nada com isso. Com um identificador só, dois assuntos diferentes davam
exatamente 1,00, e nenhum limiar abaixo de 1,00 separa isso. **O defeito estava na digital, e não
na régua.** Três candidatos foram MEDIDOS contra o par real da rodada 01×02 e contra os pares do
teste antes da escolha; dois deles matavam o falso positivo e criavam falso negativo nos pares que
têm de acender, que é o lado caro. A regra que ficou: **um identificador em comum é necessário e
não suficiente**; dois ou mais decidem sozinhos; com um só, as palavras têm de passar o mesmo
limiar.

**O quarto caso é o mais forte de todos, e por um motivo que os outros não têm: ele
estava dentro da TRAVA, e não dentro do medido.** Os três primeiros eram instrumentos medindo
errado; este era o supervisor que existe para pegar os outros três lendo "vazio" como "nada
escalado". Se tivesse passado, o ciclo automático teria seguido por cima de decisões de regra
de jogo, que são as únicas que ele existe para não tomar, e nada na saída acusaria: o veredito
sairia SEGUE, a ESCALA sairia limpa, e o resumo diria que estava tudo bem.

E ele veio em três camadas, que é a forma que o zero ambíguo assume quando ninguém o procura de
propósito: (a) `secao()` devolvia vazio para toda seção com conteúdo; (b) o fallback do veredito
caía para o texto inteiro quando a seção saía vazia, o que **escondia** o (a) pescando a palavra
SEGUE de qualquer frase; e (c) tirado o fallback, apareceu que o terminador de seção lia
`CORRIGE-E-SEGUE` como o cabeçalho CORRIGE. **Cada fail-open mascarava o seguinte.** Nenhum dos
três teria aparecido rodando o ciclo: os três apareceram acionando cada leitura de propósito, com
o mínimo que tem de acendê-la e o mínimo que não pode.

**No terceiro caso o disfarce foi perfeito**, e vale entender por quê: com o perfil todo `false`,
"a bandeira está desligada" e "a bandeira não é lida" produzem o **mesmo comportamento, o mesmo
número e o mesmo log**. Tudo desligado é o único estado em que a ausência do mecanismo é
invisível, e foi o estado em que todos os relatórios rodaram. O primeiro `true` teria acusado na
primeira batalha.

### O que a regra obriga

1. **Toda métrica que pode dar zero declara o contador de ocasião que a acompanha.** O contador
   conta o EVENTO, e não o efeito: quantas vezes a regra teve chance de morder, e não quanto ela
   mordeu. Um contador de ocasião em zero é sempre defeito, nunca resultado;
2. **nenhuma bandeira entra na grade antes de existir caminho de produção que a chame**, provado
   pelo contador de ocasião dela (é a §0.10.1, e o **L25**);
3. **todo alarme acende ao menos uma vez, de propósito, num teste.** Um alarme que nunca disparou
   é um alarme não testado, e ele imprime o mesmo ✓ para "não houve problema" e para "o predicado
   está errado". É `scripts/test-sinais.mjs`, onze predicados e vinte e dois casos, e ele já achou
   um furo na primeira execução: o sinal da re-projeção acendia numa grade sem nenhuma célula de
   distância, apontando para o eixo em vez de para a grade. **E vale igual para o supervisor**:
   `scripts/test-duo.mjs` achou três antes de o ciclo rodar uma vez (o caso 4 acima);
3b. **a ausência de sinal nunca é lida como sinal.** É a forma geral dos quatro casos, e ela dá
   uma regra de código: todo lugar em que um valor pode estar ausente distingue **ausente** de
   **presente e vazio** de **presente com conteúdo**, e só o terceiro é dado. O `duo-leitura.mjs`
   separa os três (`ausente` · `branca` · `nada` · `conteudo`), e "nada" só vale como vazio se a
   revisora escrever a palavra. Um custo de chamada que não veio não é custo zero: é chamada que
   não dá para contar, e encerra o ciclo;
4. **o contador de ocasião entra JUNTO com a métrica que ele guarda**, e não depois;
4b. **toda asserção de "não acontece" vem com a gêmea "e acontece quando deveria".** É o caso 10, e é
   a mesma cegueira em forma de teste: uma asserção negativa passa por dois motivos, porque o guarda
   segurou (o que se quer provar) ou porque **o cenário não foi montado** e não havia o que segurar.
   Os dois imprimem o mesmo ✓, e a diferença não aparece em leitura nenhuma depois. A gêmea é o
   contador de ocasião do teste: ela prova que a cena existe e que o mecanismo tem por onde morder,
   e sem ela a negativa não é evidência de nada.

   **Aconteceu com o conserto que este princípio deveria proteger.** A cena da névoa punha uma brasa
   num canto escuro e afirmava duas coisas: a Arte em montagem não abre o escuro, e a mesma Arte
   caída abre. A casa da brasa estava escrita em coordenada de tela onde o tabuleiro espera
   coordenada de eixo, então ela nascia **fora do tabuleiro** e não iluminava em estado nenhum. A
   primeira asserção passou; foi a segunda que saiu `100 -> 100` e derrubou tudo. Escrita sozinha, a
   primeira teria entrado no repositório como prova do conserto de um vazamento, medindo um efeito
   que não existia no mapa;
5. **todo número PUBLICADO tem um sinal que acende se a fonte dele se soltar.** Não é vigilância
   de instrumento, é vigilância de conclusão, e é a obrigação mais cara de esquecer: o piso de
   11,4% do avanço automático depende de uma única chamada (`log.andou`) e, se ela se soltar, o
   piso vira o teto e sai **20% redondo e plausível**, sem nada acusar. O sinal `ocasião · passo`
   existe por isso, e nasceu no mesmo dia que o número que ele guarda.

### O gêmeo do zero ambíguo: o aceso que aponta para o lugar errado

A mesma cegueira tem uma segunda cara, e ela custa a mesma coisa. **Um alarme pode acender por um
motivo que não é o dele**, e aí ele manda o leitor consertar o eixo quando o problema é da grade.

Aconteceu na primeira execução do `test-sinais.mjs`: o sinal da re-projeção acendia numa grade
**sem nenhuma célula de distância**, onde o zero é legítimo (não há travessia para re-projetar).
A frase que ele imprimia, "o eixo E2 não está mordendo", apontava para o eixo; o defeito, quando
existisse, seria da grade não ter a célula. **Um aceso que não significa nada gasta a confiança do
painel tão rápido quanto um apagado que esconde**, e nos dois casos o conserto é o mesmo: o
predicado confere primeiro se a OCASIÃO existe, e só então se ela produziu alguma coisa.

### Onde ela já está aplicada

- **os onze sinais** da bateria (`scripts/sim/sinais.mjs`), cada um com os dois casos no teste;
- **os quinze invariantes** (`scripts/sim/invariantes.mjs`), que são a mesma ideia por batalha: o
  V15 recusa parada sem classe em vez de carimbar `?`, porque carimbo por padrão foi o que
  produziu um mapa tipo→classe errado;
- **o espelho de motor**, que compara contagens antes de comparar campos: Ticks e lances diferentes
  eram divergência silenciosa enquanto só os pares eram comparados;
- **a lista ⚑ do manifesto**, que é o mesmo princípio para ENTRADA em vez de saída: um número
  inventado e um número medido não podem sair com a mesma cara.
- **a cena da névoa no `test-grid.mjs`**, que é o caso 10 aplicado a si mesmo: cada afirmação sobre o
  que o jogador vê tem a gêmea que a falsifica. A Arte em montagem não abre o escuro **e** a caída
  abre; a linha não chega ao navegador dele **e** a que caiu chega; o relógio chega **e**, com
  `?semrelogio=1`, não chega e a página avisa. Sem a segunda metade de cada par, um tabuleiro
  quebrado passaria as três;
- **a política de pular do `scripts/navegador.mjs`**, pelo mesmo motivo: ela decide se a falta de
  navegador é PULADO ou vermelho, e numa máquina que tem navegador ela nunca age. `SMOKE_SEM_NAVEGADOR=1`
  existe só para acendê-la de propósito, nos dois sentidos, que é a obrigação 3.

## Como ler isto

O objetivo declarado: simular batalhas do Grid para medir **carga de trabalho e interrupção, com foco
no mestre**, e não dano nem taxa de vitória. A meta é que o Grid pareça um videogame, com muitas
opções para o jogador e nenhuma conta para o mestre.

**E o que conta como resultado ruim, fixado em 02/09** (`04-prontidao.md` §D8b): *"o que piora o jogo
é ter que estender muito a quantidade de ajustes, decisões, cliques, correções em cada etapa"*. A
consequência que muda a leitura de tudo: **o combate ficar mais longo ou mais curto não é, por si, um
problema a resolver no Grid**: isso é balanço de regra e se adapta fora daqui. A duração é
multiplicador, não critério. **O que se está medindo é como o Grid reage às regras**, e por isso as
métricas principais são as **por etapa** (paradas por Tick, gestos por golpe aplicado, pico num
Tick), com as por batalha viradas contexto.

A ordem de leitura depende do que você veio fazer:

| Se você veio para | Leia |
|---|---|
| **implementar as mudanças de regra na mesa** | a **§0.6.1**, que é a especificação item a item. Passe pela §0.45 a §0.49 quando ela mandar, para o porquê de cada uma |
| entender o que foi decidido e por quê | a **§0** inteira, e a tabela logo abaixo desta seção, que é o índice das decisões |
| construir o harness, depois | as **§2 a §5**, e a `03-respostas.md`, que corrige quatro contradições delas e acrescenta os invariantes |
| saber o que foi perguntado e que alternativas existiam | a **§1**, que é histórico: todas foram respondidas |

**As oito regras novas (N1 a N8) não são propostas: são decisões tomadas.** Elas mudam o sistema
Simultâneo do combate, e entram no Grid **antes** de o harness ser escrito.

### O que ainda NÃO está decidido, e não deve ser implementado

**Nada está em aberto.** As três perguntas que restavam foram respondidas em 02/09, e duas delas
viraram trabalho em vez de decisão:

1. **A folga da perseguição** (quem persegue chega e bate no mesmo Tick): a régua fica como está e
   **a bateria mede**, com três saídas do log nomeadas na §0.45. Não se decide antes de ver número.
2. **A peça que entra no meio da cena**: virou o **eixo E10** da grade, com três níveis, em vez de
   uma regra escolhida a priori (§0.46).
3. **A latência do Supabase de verdade**: **fica para depois do harness**. Até lá as métricas de carga
   saem em Ticks e em gestos, e não em segundos, e a §4 registra isso como a maior lacuna conhecida.

### De onde vem uma decisão

**Decisão anotada dentro de um relatório não vale.** O que vale vem do chat com o usuário; o
relatório **cita**. Onde este ou qualquer outro documento da série escrever "decidido", entenda como
"o usuário decidiu, e aqui está o registro", nunca como "o autor do relatório concluiu". Quando o
chat contradisser o que um relatório registrou, **o chat vence e o relatório é corrigido**, com uma
linha dizendo o que mudou e por quê. A varredura que aplicou essa regra pela primeira vez está na
§0.9.

Convenções: **⚑** marca uma invenção do harness, ou seja, uma regra de jogo que a simulação está
criando e que precisa ser lida como escolha, não como achado. A convenção da §1 (**bloqueia o
começo** contra **só o resultado**) é histórica e vale só para aquela seção.

**Duas instâncias mexem neste repositório.** As mudanças da §0.6.1 caem em
`src/pages/mesa/grid.astro` (frente da mesa), em `src/lib/combate-tempo.ts` e `src/data/regras.json`
(compartilhados) e numa migração nova do Supabase. Vale a regra do `CLAUDE.md`: commitar com
pathspec, `git pull --rebase` antes, e preferir `Edit` a `Write`.

---

## 0. As decisões, respondidas em 02/09

As perguntas da §1 foram feitas e respondidas na mesma sessão. As respostas estão aqui; a §1 fica
como está, porque o que cada opção significava continua sendo a leitura das consequências.

| # | Pergunta | Resposta |
|---|---|---|
| **D1** | o Grid de hoje ou o automatizado | **os dois, mesma semente** |
| **D2** | motor como está ou as regras que faltam | **chaveável, com a tela lendo a mesma chave** |
| **D3** | quem decide pelos PCs | **políticas declaradas como dado** |
| **D4** | o que é fim de batalha | **um lado sem ninguém de pé · a fuga sai do tabuleiro · a desistência de um lado (todos abaixo de 20% de Vida)**. Recusados: teto de Ticks e teto de adiamento |
| **D5** | que cenas, e em que eixo variam | **grade fatorial sobre eixos** |
| **Q6** | a resolução vira módulo único ou cópia | **cópia, com teste-espelho** |
| **Q7** | as condições expiram | **expiram, e a mesa também passa a expirar** |
| **Q8** | quantos jogadores na mesa simulada | **vira eixo do experimento** |
| **Q9** | perfil de rolagem | **`site`: o site rola tudo** |
| **Q10** | as Artes entram | **só as elementais, com projétil e área/volume, mais a Cura** |
| **Q10b** | quais Efeitos | **um de cada forma do Grid** (8 formas) |
| **Q11** | o mapa tem obstáculo | **parede vira eixo do experimento** |
| **Q12** | mapa e distância inicial | **1 m por hex, mapa de 48×48, quatro distâncias** |
| **Q14** | relatório para ler ou portão | **artefato completo para ler e para embasar decisões futuras** |
| **Q15** | de onde saem os PCs | **arquétipos que eu escrevo, declarados como inventados** |
| **Q16** | as 7 regras que faltam entram no jogo | **entram, e a medição decide a ordem** |
| **N1** | quando a ação começa, e quando a guarda abre | **as duas no Tick T, o da declaração**; livre 1 Tick depois do fim da ação; o combate começa no Tick 1. Detalhe e consequências na §0.45 |
| **P2** | a parede | **entra, e vira funcionalidade do Grid** |
| **E1(d)** | o nível dos quatro períodos carrega arremessador | **sim, os quatro, e a mistura é declarada** |
| **D4b** | quando a fuga está consumada | **quando ninguém consegue aproximar**: 10 Ticks seguidos sem nenhum perseguidor diminuir a distância |
| **N2** | o golpe de Preparo 0 cala a cena no Tick em que é declarado | **a guarda de declaração passa a olhar `desde`**, e não o Tick do golpe: só cala quem foi declarado antes deste Tick (§0.45) |
| **N3** | o golpe de quem caiu no mesmo Tick ainda sai? | **sai, se já tinha vencido**; o agendado para o futuro morre com a peça (§0.45). Vira caso particular de N6 |
| **N4** | em que ordem se declara no Tick | **cadeia toda crescente** (declara primeiro quem tem menos). Na entrada: iniciativa · Rac+Prontidão · Raciocínio · Destreza. Depois: Rac+Prontidão · Raciocínio · Destreza · iniciativa (§0.46) |
| **N5** | as fases de um Tick | **declaração · início · resolução**, e a resolução na ordem inversa da declaração (§0.46) |
| **N6** | penalidade nascida no Tick T | **só vale em T+1**: a resolução lê o retrato de quando as declarações terminaram (§0.46) |
| **N7** | quem declara depois enxerga o que já foi declarado? | **enxerga, e é a vantagem de ter mais Raciocínio + Prontidão** (regra do Vampiro). O que ele vê já está definido na máscara da migração 27 (§0.47) |
| **N8** | o que exatamente é visível | **quem vai fazer o quê em cada Tick**, com rastro no tabuleiro (movimento, trajetória, alvos). Exceção: arremesso, tiro e Arte não revelam o alvo até executarem (§0.48) |
| **E2** | as quatro distâncias iniciais | **1 · 18 · 42 · 71 hexes** (encostado, ~3, ~7 e ~12 Ticks de corrida; 71 é a diagonal do mapa de 48×48) |
| **Fila** | a ordem de declaração na tela | **ordenada sozinha pela ficha, e o mestre pode mudar à mão** (§0.49) |
| **Ordem** | o que entra antes do harness | **tudo**: N1 a N8, o `ate` e as 15 bandeiras (§0.6 e §0.7) |
| **Folga da perseguição** | quem persegue chega e bate no mesmo Tick | **não se decide antes de ver número**: a régua fica como está e a bateria mede (§0.45) |
| **Peça que entra no meio** | quando ela declara pela primeira vez | **vira eixo do experimento**, com três níveis: declara primeiro no Tick · declara no Tick seguinte · entra por último (§0.46 e §0.5, eixo E10) |
| **Medição de campo** | a latência do Supabase de verdade | **depois do harness**: as métricas saem em Ticks e em gestos, não em segundos (§4) |
| **Retrato de N6** | memória ou coluna no banco | **memória, e a tela avisa na saída** durante a fase de resolução: zero gravação (§0.8.2) |
| **Rota** (P §2.4) | como preservar a linha de base | **bandeiras: uma bateria mede os dois lados.** N1 a N6 entram chaveadas, somando às de D2, e o desenho deixe-uma-de-fora mede cada regra isolada (§0.7) |
| **Fôlego** | a régua está escrita e o combate não a aplica | **fica fora, como está hoje** (`modulos.ts`, `folego: false`). A simulação mede o jogo que se joga (§0.7) |
| **Mana** | o que o Conjurador faz quando a reserva acaba | **raciona, alternando ataque comum e Arte**; e fica registrado um teste: a reserva é pequena demais para os combates? (§0.7) |
| **`porRodada`** | as 5 condições de dano por rodada que o Grid não cobra | **vira bandeira**: a bateria roda com e sem, para ver como se comportam (§0.7) |

Q13 (o repertório declarável) não foi perguntada porque D3 a responde: uma política declarada como
dado só pode declarar o que o Grid aceita, e o Grid aceita **6 coisas** (atacar em 4 manobras, mover
em 3 modos, conjurar, abortar, esperar 1 Tick, "outra coisa"). As 461 Técnicas ficam de fora por não
serem declaráveis. Consequência a registrar **antes** de medir, para não ser lida depois como
descoberta: o número de opções do jogador vai sair baixo por construção.

### 0.1 O que as respostas mudam no desenho

**D1 não custa uma segunda execução.** Se a política responde as paradas de classe **iii** com a
mesma aritmética que o motor faria, as duas versões da batalha são **idênticas byte a byte**: o que
muda é só quais eventos contam como consulta a um humano. Então não há A/B de execução, há uma
bandeira `automatizavel` por evento de parada e duas leituras do mesmo log. O mesmo vale para **Q8**:
mestre solo e um-jogador-por-PC não mudam nada na batalha, mudam a quem se atribui cada gesto, e
saem os dois do mesmo arquivo. Isso derruba dois eixos que pareciam multiplicar a grade e não
multiplicam nada.
A ressalva: isso deixa de valer se a política responder uma parada **iii** de um jeito que o motor
não faria (o mestre que arredonda a favor, o que fudge). Não modelamos isso, e a §4 já o coloca fora
de escopo.

**Q6 (cópia) contra D2 (a tela lendo a mesma chave): como as duas convivem.** As duas leem o **mesmo
objeto de perfil**, porque a §0.6 decidiu que as bandeiras entram na mesa e não só no harness. Isso
faz a convivência ser trivial e desfaz uma ressalva que este parágrafo carregava antes: eu tinha
escrito que o teste-espelho só valeria com todas as bandeiras desligadas, o que era verdade enquanto
elas iam viver só na cópia. **Com a mesa lendo o perfil, o espelho vale sob qualquer perfil, desde
que os dois lados leiam o mesmo**, e o `dados_hash` da bateria (§2.4) já registra qual era.
(A lista chegou a 16 na §0.7: as 7 de D2, as 2 da Cura, as 5 do núcleo do Tick, o `porRodada`, e a de
N5 cobrindo só a ordem inversa, §0.7.)

**D4 traz uma regra nova, e ela é a primeira invenção deliberada da simulação.** ⚑ A desistência
coletiva abaixo de 20% de Vida não existe no Grid nem nos capítulos. Ela conversa com o robô, que
foge individualmente abaixo de 25% (`regras.json:2268`): a peça foge primeiro, sozinha, e o lado
desiste depois, junto. A faixa entre 25% e 20% é a janela em que há fuga sem rendição, e é ela que
vai gerar a perseguição que interessa medir.

**A fuga se consuma quando ninguém consegue aproximar** (D4b): passados **10 Ticks seguidos** em que
nenhum perseguidor diminuiu a distância até o fugitivo, a fuga conta como consumada e a peça sai da
cena como baixa. O critério é bom porque não depende do tamanho do mapa: se dependesse da borda, o
resultado do eixo E2 ficaria confundido com a geometria da arena, já que uma distância inicial maior
também deixa a borda mais perto. E ele mede exatamente o caso que você quer ver, o alvo mais rápido
que nunca é alcançado, sem precisar de teto de adiamento (que você recusou) nem de teto de Ticks.

Mesmo assim, um laço sem saída trava o processo, então fica um **teto de segurança de execução**, que
não é regra de jogo: a batalha que passar de 2.000 Ticks é abortada e marcada `estourou`, entra num
balde próprio e não é contada em nenhuma média. É diferente da opção 4c que você recusou, porque 4c
classificaria a batalha como "indecisa", que é um resultado de jogo; `estourou` é o registro de que o
harness desistiu.

**Q7 e Q16 viram trabalho no Grid, não só no harness.** Ler o campo `ate` e ligar as 7 regras são
mudanças na mesa que está rodando. Elas não são pré-requisito para começar o harness, mas cada uma
que entrar muda o que o perfil base significa, então a bateria grava o commit e o `dados_hash` (§2.4)
para que uma medição de hoje continue comparável com uma de depois. Isso é o que a resposta de **Q14**
pede: o artefato tem de guardar os agregados por célula junto do relatório, e não só as tabelas
formatadas, senão a comparação futura não existe.

**Q10 e Q10b fecham um recorte que é quase todo regra fechada.** As oito formas do Grid, com um
Efeito âncora de cada, saindo dos 52 que aceitam alguma das 8 elementais ou a Cura:

| Forma | Efeito âncora | Nível | Fere? |
|---|---|---:|---|
| alvo | `projetil-conjurado` | 1 | sim |
| zona | `brasa-retardada` | 3 | sim |
| cone | `lascas` | 1 | sim |
| linha | `passo-relampago` | 4 | não |
| muro | `muro` | 3 | sim |
| aura | `campo-de-alivio` | 3 | cura |
| movimento | `empurrao-elemental` | 3 | não |
| cadeia | `corrente` | 3 | sim |

Área e volume estão em terreno firme: sair da área tem regra fechada, escada de metros, duas
Dificuldades e default declarado (R2 §E). O que o recorte não resolve está na §0.2.

**Q11 (parede) e Q12 (48×48, quatro distâncias)** mudam a grade: E2 passa a ter 4 níveis, e entra um
eixo de obstáculo. A §0.3 refaz a conta.

**Q15**: os arquétipos entram pelo cano normal, `resumoCombatePC`, sem tratamento especial, e cada
um é marcado `inventado` na procedência da §2.7.

### 0.2 O que as respostas abriram

| # | Pendência | Estado |
|---|---|---|
| **P1** | A Cura em área contra a regra publicada | **era engano meu.** Resolvida na §0.4 |
| **P2** | Parede não existe no Grid | **decidida**: entra, e vira funcionalidade do Grid (§0.4) |
| **P3** | O projétil mirado precisa de uma rolagem que não existe | **era engano meu**: a regra existe escrita. Resolvida na §0.4, com um resíduo pequeno |
| **P4** | Quais políticas, e a lista de regras de cada uma | proposta na §0.4 |
| **P5** | Quais arquétipos de PC, e quantos | proposta na §0.4 |
| **P6** | Os níveis de E1 e E4 em armas concretas | proposta na §0.4 |

### 0.3 Duas correções minhas

Fui verificar as seis antes de propor, e duas delas não existiam: eu tinha lido a R2 §E como "a regra
não está fechada", e o que ela diz é que **o motor não a aplica**. A régua está escrita no
`regras.json`, inteira, nos dois casos.

**P1 não era contradição, era leitura errada minha do Efeito.** `campo-de-alivio` **não cura**:
`grid.fere = false`, `grid.cura = false`, e o que ele faz é suspender o quadro (sangramento para,
veneno fica em suspenso, quem está caindo não morre), pondo a condição `protegido`. É uma aura
legítima e não é cura em área. A régua da Cura, por sua vez, está completa em
`regras.json → arcano.cura`: custo 2 por nível, `graus.alcance` (toque a 16 m), `graus.alvos` (1 a
6), `graus.cura` (2 · 1d6 · 1d6+2 · 2d6 · 2d6+2 · 3d6), o `semArea` ("a cura comum não tem Área;
curar em área existe, mas só por um Efeito Especial feito para isso") e o `divide` ("em mais de um
alvo, o valor curado é DIVIDIDO entre eles: 2d6 em três pessoas é a rolagem inteira repartida em
três"). Não falta regra: falta motor.

**P3 não era invenção obrigatória.** `regras.json → arcano.resistencia.rolagem` diz, com todas as
letras: "Percepção + Acerto Arcano, e só nos efeitos MIRADOS. Não há rolagem de conjuração para o
resto: o que não é mirado se resolve pela Dificuldade fixa do Efeito, pela Defesa passiva do alvo ou
por tabela." E `arcano.resistencia.tipos` é uma tabela de roteamento de cinco linhas, que cobre os
oito Efeitos âncora sem sobra. `Acerto Arcano` existe como perícia secundária (`acerto-arcano`, em
`habilidades-secundarias.json`) e Convicção existe como Virtude (`conviccao`, em `virtudes.json`). O
que a R2 §E registrou, e continua verdade, é que o capítulo lista o assunto em revisão e que o motor
não tem rolagem de Arte nenhuma. Isso é lacuna de implementação, não de regra.

### 0.4 As seis pendências, resolvidas

#### P1 · A Cura

Não há nada a inventar, e a âncora de aura fica onde está. O que muda é que a **Cura entra como um
nono item, que não é uma forma do tabuleiro**: ela é alvo escolhido, dentro do alcance, sem
resistência (`arcano.resistencia.tipos`, linha "Em aliados, objetos ou cenário: sem resistência"), e
com régua própria.

| O que | De onde sai | Estado no motor |
|---|---|---|
| custo 2 por nível de parâmetro | `arcano.cura.custoPorNivel` | **já aplicado** (`artes-grid.ts:257`) |
| quanto cura, por grau | `arcano.cura.graus.cura` | **não lido**: o valor sai de `dano_dados`, não da régua da Cura |
| alcance por grau | `arcano.cura.graus.alcance` | mede e pergunta, não impede (R2 §E) |
| **sem Área** | `arcano.cura.semArea` | **não aplicado**: nada impede comprar forma de área numa Arte de cura |
| **dividida entre os alvos** | `arcano.cura.divide` | **não aplicado**: nada divide o valor |

Proposta: as duas últimas viram bandeiras no **mesmo objeto de perfil das 7 regras de D2**, porque
são o mesmo tipo de coisa (regra escrita que o motor não aplica) e porque Q16 disse que a medição
decide a ordem de ligar. O perfil passa de 7 bandeiras para 9: `margem`, `gate`, `couraca`, `porte`,
`bloqueio`, `modo2`, `teto6`, `curaSemArea`, `curaDivide`. Sem `curaDivide`, curar seis aliados com
2d6 devolve 2d6 a cada um, e a Cura vira a jogada dominante da simulação inteira.

> **Corrigido em 02/09:** a `couraca` saiu dessa lista. Ela **já é aplicada**, em tempo de
> geração (`gen-bestiario.mjs:36-45`), e não pode ser bandeira de tempo de execução sem somar duas
> vezes. O perfil valendo é o da §0.7, com **quinze**.

#### P2 · A parede

O Grid não tem parede e `hex.ts` já tem onde encaixá-la: `caminharHex(de, para, passos, pararA,
evita)` recebe um veto arbitrário, e hoje a mesa passa só `ocupadoPor`. O harness passa
`(h) => ocupado(h) || parede(h)`, lendo um `bloqueados: Hex[]` da cena. **Não é um segundo caminho de
código**: é o mesmo `caminharHex`, com um argumento a mais, e uma cena sem parede se comporta
exatamente como a mesa.

Duas coisas que precisam ficar declaradas:

- A parede **bloqueia passo e não bloqueia visão**. Linha de visão não existe no Grid, e `passo-relampago`
  a exige pelo texto ("precisa de linha de visão"). Inventar visão seria um sistema inteiro; a
  proposta é declarar a limitação e não medir nada que dependa dela.
**Decidido: a parede entra, e vira funcionalidade do Grid.** Com isso o resultado do eixo E7 é um
achado sobre o produto, e não só sobre a regra, e a marca ⚑ de invenção cai. A casa bloqueada passa a
existir na cena de verdade, e o `evita` de `caminharHex` a lê nos dois lugares: é o mesmo caminho de
código, com um argumento a mais.

E fica anotado como melhoria futura, fora do escopo do harness: **um editor de cenário no Grid**, em
que o mestre põe paredes, terreno difícil, itens e o que mais a cena precisar, em vez de só peças. O
terreno difícil tem gancho pronto e não usado: a condição `terreno-dificil` existe em
`condicoes.json` com campo de `velocidade`, e o Grid não a lê (R2 §C4).

#### P3 · O mirado, e o resíduo que sobra

Roteamento dos oito âncoras pela tabela de `arcano.resistencia.tipos`:

| Âncora | Linha da tabela | Como resolve | Inventa algo? |
|---|---|---|---|
| `projetil-conjurado` | Dano e projéteis | Percepção + Acerto Arcano contra a Defesa (Esquiva); depois a Absorção, e como `materia: null` só a Centelha absorve | não |
| `brasa-retardada`, `lascas`, `muro` | área | não se esquiva, se abandona: `desvioDaArea` e `oferecerSaida`, que já existem e já têm default | não |
| `empurrao-elemental` | por tabela | os parâmetros são FAH e FAA: entra na tabela de forças, que já é a régua do arremesso | não |
| `passo-relampago` | sem alvo | movimento do próprio conjurador | não |
| `campo-de-alivio` | em aliados | sem resistência | não |
| Cura por alvo | em aliados | sem resistência | não |
| `corrente` | Dano e projéteis, com salto | mirado no primeiro alvo; **os saltos não estão escritos** | **sim** ⚑ |

Sobram dois resíduos pequenos, e os dois são propostas, não fatos:

1. **Os saltos da cadeia.** Proposta: mirado no primeiro alvo, automático nos saltos seguintes, que é
   o que o texto do Efeito sugere ("o raio salta de um alvo ao seguinte, desde que estejam a poucos
   passos"). ⚑
2. **A composição do bolo do mirado.** A régua diz Percepção + Acerto Arcano e não diz o resto.
   Proposta: a mesma forma de `resumoCombatePC`, `floor((Percepção + acerto-arcano) / 2)d6` com +2 se
   ímpar, mais `ataqueCentelha(C)`, menos a penalidade da armadura. A parte discutível é a última:
   descontar armadura de um ataque de Arte é coerente com todo o resto do sistema e não está escrito
   em lugar nenhum. ⚑

Isso derruba P3 de "a única invenção mecânica obrigatória do recorte" para duas linhas.

#### P4 · As políticas

Cinco perfis, cada um uma lista **ordenada** de regras avaliadas de cima para baixo, e todas usando
só o que o Grid aceita declarar.

**Esta é a especificação única**, e ela funde duas listas que viviam separadas: a de comportamento,
que estava aqui, e a de leitura, que estava na §0.47. Nenhuma das duas era completa, e a §0.47 dizia
que a posição da regra de leitura na ordem importa sem dizer qual era (fusão feita em 02/09,
`05-fechamento.md` §2.2).

- **A regra marcada ⊙ é regra de leitura**, e é exatamente o que o eixo **E9** liga e desliga.
  **Com E9 desligado a regra ⊙ é pulada e a avaliação cai para a seguinte.** Sem isso "cego" não é um
  estado definido, e sem a regra ⊙ no Agressivo o E9 é **inerte por construção** em toda célula que
  rode esse perfil.
- **A regra ⊕ é a regra de modo**, decidida em 02/09 (D11), igual nos cinco perfis e avaliada depois
  de a manobra estar escolhida: *se o modo principal da minha arma é perfurante e a Perfuração dela
  está abaixo da resistência de Perfuração do alvo, e a arma tem modo secundário, ataco no modo
  secundário.* Ela não escolhe alvo nem manobra: ajusta o ataque já decidido.

| Perfil | As regras, em ordem |
|---|---|
| **Agressivo** | 1 ⊙. se o inimigo mais próximo já tem golpe declarado de outro aliado caindo neste Tick, escolher o segundo mais próximo. 2. se há inimigo de pé no alcance e estou livre: atacar, manobra `rajada` se a Vida do alvo é maior que a minha, senão `simples`. 3. senão: mover em `corrida` até o inimigo de pé mais próximo. 4. nunca abortar. **⊕** |
| **Cauteloso** | 1. se estou abaixo de 40% de Vida e há inimigo no alcance: atacar com manobra `segura`. 2 ⊙. se o inimigo mais próximo está em fase de Golpe: esperar 1 Tick (deixa o golpe cair e ataca a Recuperação dele). 3 ⊙. se alguém já declarou golpe para este Tick: atacar `segura`; se o inimigo mais próximo está em Recuperação declarada: atacar `rajada`. 4. se há inimigo no alcance: atacar `simples`. 5. senão: mover em `batalha`, não em corrida, que custa −4 de Defesa. 6. abortar quando a minha agenda já deslizou 2 vezes seguidas. **⊕** |
| **Tocaiador** | 1 ⊙. se alguém declarou golpe com queda neste Tick ou no próximo: recuar antes. 2. se há inimigo a ≤ 3 hexes: mover em `corrida` para longe do mais próximo. 3. se há inimigo em alcance de tiro: atacar `simples`. 4. senão: manter posição (esperar 1 Tick). **⊕** |
| **Guarda-costas** | 1 ⊙. se há golpe declarado caindo no Tick em que o aliado protegido está aberto: mover para interpor, em vez de atacar. 2. escolher como alvo o inimigo mais próximo do meu aliado com menos Vida. 3. se esse inimigo está no meu alcance: atacar `segura`. 4. senão: mover em `batalha` para a casa entre ele e o aliado. 5. nunca abortar. **⊕** |
| **Conjurador** | 1. se um aliado está abaixo de 50% de Vida e no alcance: Cura. 2 ⊙. contar quantos declararam golpe para o mesmo Tick: se 2 ou mais e agrupados, zona (`corrente` ou `brasa-retardada`). 3. se há 2 ou mais inimigos a ≤ 2 hexes um do outro: `corrente` ou `brasa-retardada`. 4. se há 1 inimigo em alcance: `projetil-conjurado`. 5. se há inimigo a ≤ 2 hexes de mim: `empurrao-elemental`. 6. senão: mover em `batalha` para trás do aliado mais próximo. **⊕** |

**Cada regra ⊙ e a regra ⊕ carregam um contador de ocasiões**, por célula (§2.6): quantas vezes a
condição da regra ocorreu. Sem ele, uma política cuja regra de leitura nunca tem o que ler produz o
mesmo zero que uma política em que a leitura não adianta nada, e o E9 sai inerte sem avisar.

Com **N8** (§0.48) as regras ⊙ passam a poder usar também o **alvo do corpo a corpo** ("já tem
alguém indo nele, escolho outro"), e continuam sem poder usar o alvo de tiro, arremesso e Arte, que
fica escondido até resolver. As políticas ficam honestas por construção, e a mesma roda para o mestre
e para o jogador sem precisar de duas versões.

Cada número desses (40%, 50%, 3 hexes, 2 deslizes) é **invenção do harness** ⚑ e vai no cabeçalho do
relatório, na tabela "o que foi inventado". E o Conjurador é o único que exercita as oito formas: sem
ele no elenco, o eixo das Artes não sai do papel.

Isso faz E6 ter **5 níveis**, e não 4: a conta da §0.5 usa 5.

#### P5 · Os arquétipos

Sete, montados só do catálogo real, cada um escolhido por exercitar uma coisa que os outros não
exercitam.

| Arquétipo | Raça | Arma (ciclo) | Escudo | Armadura | Por que ele existe |
|---|---|---|---|---|---|
| **Escudeiro** | humano | espada-longa (6) | heater (pen 2, `bloqCaC` 3) | malha (pen 2) | é a peça que a divergência #2 da R2 §F mais castiga: hoje ela está −4 de Defesa e não recebe nada em troca. Com a bandeira `bloqueio` ligada, ganha +3 |
| **Lanceiro** | humano | lança (haste, 6, 2 mãos) | nenhum | brigandina | única classe de tempo `haste`, e é ela que muda `alcanceDaPeca` de `HEX_CORPO_A_CORPO` para `HEX_HASTE`: perseguição fecha antes |
| **Duelista** | elfo | espada-curta (5) + adaga na mão inábil | nenhum | couro | ciclo 5, e a única peça que exercita a empunhadura dupla (divergência #3) |
| **Montanteiro** | orc | montante (pesada, 7, 2 mãos) | nenhum | placa completa | ciclo 7, passo baixo, e é metade do eixo E4. Também é o alvo natural do gate de Perfuração |
| **Arqueiro** | halfling | arco longo (6) | nenhum | couro | a única peça que não precisa fechar distância, e a única que usa a faixa de distância de `alcance.ts` |
| **Conjurador** | gnomo | adaga (5) | nenhum | nenhuma | as oito formas de P3, e o único que gasta Mana |
| **Curandeiro** | humano | maça (6) | broquel | gambeson | a Cura de P1, com o `divide` e o `semArea` no meio |

Todos passam por `resumoCombatePC` sem tratamento especial, que é o que garante que o PC gerado e o
PC de mesa somem os mesmos números. Todos entram no relatório marcados `inventado`.

**E quatro de criatura**, decididos em 02/09 (D10, `05-fechamento.md` §2.3): PCs e criaturas do
bestiário entram os dois na bateria. Escolhidos do `monsters-mesa.json` pelo mesmo critério dos sete
acima, cada um exercitando o que os outros não exercitam:

| Arquétipo | Porte | Ataque | Passo (bat/arr/cor) | Por que ele existe |
|---|---|---|---|---|
| **`mon-esqueleto-humano`** | Médio | leve (ciclo 5), impacto | 3 / 5 / 7 | a horda de E3 como a mesa a joga: oito do mesmo bicho, golpe leve, uníssono para sempre. E o impacto é o modo que **não** recebe couraça de porte, o que dá o contrafactual dentro do próprio elenco |
| **`mon-aurochs`** | Grande | média (ciclo 6), perfurante | 4 / 6 / 9 | a primeira categoria de porte acima de Médio: **+3 / −3** no acerto (`porteAcerto`) e **+2** de couraça na Absorção contra corte e perfuração |
| **`mon-bulette`** | Enorme | pesada (ciclo 7), perfurante | 4 / 6 / 9 | duas categorias acima: **±6** no acerto, **+4** de couraça e `resistPerf 1`, que **fecha o gate** contra adaga (pen 0) e contra qualquer arma de Perfuração 0 |
| **`mon-aguia-gigante`** | Grande | média (ciclo 6), perfurante | **8 / 13 / 18** | o alvo que nunca é alcançado, sem depender de armadura pesada: a razão de passo contra um PC (3 / 5 / 7) passa de 2,5, e é o nível assimétrico de E4 no elenco de criatura |

Duas coisas que essas quatro trazem e nenhum PC traz: **porte diferente de Médio**, que é o que faz
`porteAcerto` e a couraça existirem, e um bloco de combate **pronto**, sem passar por
`resumoCombatePC`. O segundo é um caminho de código a mais no harness, e o teste-espelho tem de
cobrir os dois lados.

#### P6 · Os níveis de E1 e E4 em armas do catálogo

O catálogo tem 26 armas em quatro ciclos: **4** (só `dardos`), **5** (adaga, espada curta, desarmado
e seis de arremesso), **6** (treze armas: espada longa, machado, maça, picareta, lança, alabarda,
arcos, bestas pequena e média, funda) e **7** (montante, martelo de guerra, besta grande).

| Nível de E1 | Armas | m.m.c. | O que se espera |
|---|---|---:|---|
| **a · uníssono** | espada longa dos dois lados | 6 | colisão em **todos** os golpes |
| **b · vizinhos** | adaga (5) × espada longa (6) | 30 | uma colisão numa batalha de 37 a 47 Ticks |
| **c · coprimos** | espada longa (6) × montante (7) | 42 | zero ou uma colisão |
| **d · os quatro** | dardos (4) · adaga (5) · espada longa (6) · montante (7) | 420 | colisões esparsas e sem padrão |

**Quem preenche cada nível**, para o nível não ficar definido por arma sem dono: (a) Escudeiro contra Escudeiro; (b) Duelista **só com a espada curta** contra Escudeiro; (c) Escudeiro contra Montanteiro; (d) um de cada, com o arremessador dos dardos. A empunhadura dupla do Duelista fica de fora dos níveis de E1, porque um segundo fluxo de golpes apaga o ciclo que o eixo mede.

Uma ressalva que o catálogo impõe: **o ciclo 4 só existe em `dardos`, que é arremesso**. O nível (d)
obrigatoriamente carrega um arremessador, o que mistura o eixo de ciclo com o de alcance.
**Decidido: os quatro períodos entram, e a mistura é declarada** na leitura do resultado, ou seja,
qualquer efeito atribuído a (d) carrega junto a ressalva de que aquele nível é o único com alcance.

Esta tabela vale porque **N1 devolveu o período ao `ciclo`** (§0.45). Enquanto a régua era a de hoje,
os períodos eram `ciclo + 1` e nenhum destes m.m.c. estava certo.

**E4 · assimetria de passo**, corrigido em 02/09 (`05-fechamento.md` §2.2). O passo sai de
`deslocamento()` (`calc.ts:145-151`), que recebe traços e a fração da raça, mais a meia penalidade da
armadura. **A arma não entra nessa conta**, e é por isso que o nível assimétrico **não pode ser
definido por arquétipo**: dizer "Montanteiro orc contra Duelista elfo" troca junto as armas (ciclo 7
contra ciclo 5) e apaga o nível de E1 da célula, medindo passo e ciclo de uma vez só.

**O nível assimétrico é definido por raça e armadura, e mantém a arma da célula**: orc de placa
completa (pen 3) contra elfo de couro (pen 1), os dois empunhando a arma que aquela célula pede. A
razão de passo continua ≥ 2, e o E1 sobrevive. O nível "simétrico" usa duas peças de mesma raça e
mesma armadura. No elenco de criatura, o par assimétrico é a `mon-aguia-gigante` (8/13/18) contra
qualquer PC (3/5/7).

### 0.45 Quando a ação começa · N1, decidida em 02/09

A pergunta era: escolhida uma ação no Tick T, ela começa em T ou em outro Tick?

**O que o motor faz hoje.** A ação começa em **T+1**, e é deliberado:
`regras.json → combate.simultaneo.decideEmValeDepois: 1`, com a nota "a ação declarada no Tick T
começa em T+1... decisão no Tick, efeito no avanço", e o `Combate_Simultaneo.md:124-127` repete.
`agendaSimultanea` faz `inicio = tickDecl + 1`.

Mas a **guarda** não segue a ação: `faseEm` não olha o campo `desde`, decide só pela agenda, e todo
Tick anterior ao primeiro golpe lê `preparo` (`combate-tempo.ts:595-606`). Uma espada longa declarada
no Tick 10 golpeia no 12 e fica livre no 17, e a escada cobra assim:

```
Tick    9    10    11    12     13    14    15    16    17
fase   prep  prep  prep  GOLPE  rec   rec   rec   rec  livre
Defesa  −2    −2    −2    −4    −2    −2    −2    −2     0
```

A ação vive 7 Ticks e a guarda fica aberta 8: quem declara paga −2 no Tick da declaração, antes de a
ação existir. E, como consequência, o **período real entre golpes é `ciclo + 1`**, porque quem
declara de novo no Tick em que fica livre paga o Tick de decisão outra vez. Medido encadeando cinco
declarações: leve 6, média 7, haste 7, distância 7, pesada 8, e não 5, 6 e 7.

**A decisão.** A ação e a guarda começam **no mesmo Tick T**, o da declaração. Para declarar de novo,
a peça precisa estar livre, e livre é **1 Tick depois do fim da ação anterior**. Interromper continua
possível pelas regras de interrupção, e quem interrompe só fica livre no Tick seguinte. O combate
começa no Tick 1.

O que isso muda, concretamente:

| | Hoje | Com N1 |
|---|---|---|
| `decideEmValeDepois` | 1 | **0** |
| `inicio` da agenda | `tickDecl + 1` | `tickDecl` |
| espada longa declarada no Tick 1 | golpe no 3, livre no 8 | **golpe no 2, livre no 7** |
| a ação ocupa | T+1 até T+ciclo | **T até T+ciclo−1** |
| guarda aberta | T até T+ciclo (um Tick a mais que a ação) | **exatamente os Ticks da ação** |
| período entre golpes | `ciclo + 1` | **`ciclo`**, que é o que a Velocidade da arma sempre quis dizer |
| `faseEm` | lê `preparo` um Tick antes da ação, e estava errado | passa a estar **certo**, sem mudar uma linha |

O exemplo publicado continua fechando pelo outro caminho: o arco de Preparo 5 declarando no Tick 1
solta a flecha no Tick 6, que é o número do `Combate_Simultaneo.md`. Antes ele fechava porque a
declaração era no Tick 0 e a ação começava no 1; agora fecha porque o combate começa no Tick 1 e a
ação começa junto. De quebra, isso deixa a frase "entra no Tick 0" da caixa de iniciativa
(`grid.astro:4751`) sem defesa nenhuma: ela já contradizia o `regras.json`
(`derivados.iniciativa.tickDoPrimeiro: 1`, R2 §F#13) e agora contradiz também a régua do simultâneo.

**E os períodos voltam a ser o `ciclo`.** O que eu tinha chamado de Correção 1 era verdade do código
como ele está, e N1 a remove: os níveis de E1 voltam para os períodos 4, 5, 6 e 7 do catálogo, com
m.m.c. 30 entre 5 e 6 e 42 entre 6 e 7 (§0.4 P6).

#### A folga da perseguição: fica como está, e a bateria mede

Com `inicio = T`, o golpe cai em `T + max(Preparo, viagem)` e o primeiro passo da peça só sai no
avanço seguinte à declaração, em `T+1`. Depois de `V` passos ela chega **durante** o Tick `T+V`, que
é exatamente o Tick em que o golpe vence: **quem persegue chega e bate no mesmo Tick**. Com a régua
antiga (`inicio = T+1`) o golpe caía em `T+1+V`, um Tick depois da chegada.

**Decidido: não se decide antes de ver número.** A régua fica como está, e a bateria mede. As saídas
do log que respondem (§2.5 e §2.6):

- a **fração dos golpes que caem no mesmo Tick da chegada**, contra os que caem já dentro do alcance;
- o **tempo morto do jogador** (do `decl` ao `dano`) separado entre quem perseguiu e quem já estava
  no alcance, que é onde a folga apareceria como diferença;
- a **taxa de acerto** dos dois grupos, porque quem chega correndo chega em Corrida, e a Corrida custa
  −4 de Defesa: se o perseguidor bate e apanha no mesmo Tick, a folga era o que o protegia.

Se o número mostrar que perseguir virou dominante ou virou suicídio, a folga volta como uma exceção
em `agendaSimultanea`; até lá, não se mexe.

#### N2 e N3 · como o Preparo 0 se resolve (decididas em 02/09)

**Quem tem Preparo 0** é só a classe `leve` (adaga, espada curta, desarmado). Isso parece pouco e não
é: das 309 criaturas de `monsters-mesa.json`, **159 atacam com ataque de classe `leve`** (51%: 159
leve, 97 média, 48 pesada, 3 arte, 1 haste, 1 distância), e todo mundo que briga sem arma é leve. É
o caso mais comum da mesa.

**O que quebrava.** Dois duelistas de adaga livres no Tick 1: `grupoDaVez()` devolve os dois, A
declara com `golpes: [1]`, e na chamada seguinte `golpeMaisCedo()` = 1 com `tickDaVez()` = 1, então a
guarda `if (g <= t) return []` (`grid.astro:4119`) devolve lista vazia e **B não pode declarar**. O
mestre resolve o golpe de A primeiro, e B declara depois, sabendo se apanhou, quanto e se está de pé.
A janela de declaração cega, que é o ponto inteiro do Simultâneo, deixa de existir. E se o golpe de A
derruba B, B perde a ação inteira, porque `golpeMaisCedo` pula quem está no chão.

**O que não quebrava, e eu tinha exagerado:** a Defesa. `faseDeQuemVaiAgir` está ligado na folha
(`grid.astro:7449`, alimentando `dvDe()` em L7465): contra um alvo que ainda não declarou, a folha
presume a fase pela regra em vez de ler a agenda vazia. O problema dos 97% continua resolvido. O que
aquela função nunca cobriu, e diz no próprio comentário, é a **ordem de ação**.

**Por que apareceu agora.** Com `inicio = T+1`, o golpe mais cedo possível era T+1, então nenhum
golpe vencia dentro do Tick em que se declarava, e a guarda nunca disparava na janela de declaração.
N1 tirou um Tick de folga, e era essa folga que mantinha a janela limpa.

---

**N2 · A guarda de declaração passa a olhar `desde`, e não o Tick do golpe.**

A intenção da guarda está escrita no comentário dela (`grid.astro:4110-4118`): *"o braço que foi
declarado três Ticks atrás chega antes da próxima escolha de quem quer que seja"*. Golpe do passado
tem precedência sobre escolha nova. O `g <= t` expressava isso corretamente enquanto a régua
garantia que todo golpe devido em T fora declarado em T−1 ou antes; N1 quebrou a garantia, não a
intenção. A correção é dizer a intenção direto:

- **`grupoDaVez` bloqueia só por golpe de ação declarada antes deste Tick** (`acao.desde < t`). O
  campo `desde` já existe em `Acao` e já é lido no avanço (`grid.astro:4917`).
- **`instanteDeGolpe`, que desliga o ⏭, continua olhando todos os golpes devidos**, inclusive os
  declarados neste mesmo Tick. O relógio não anda enquanto houver golpe por resolver, que é o
  comportamento certo e não muda.

São duas perguntas diferentes que hoje usam a mesma função: "alguém ainda pode escolher?" e "o mundo
pode andar?". Elas passam a ter dois leitores.

O que isso produz no Tick T: **todos os livres declaram às cegas, e só então todos os golpes devidos
em T resolvem**. Não toca no catálogo, não toca na anatomia, não muda o período de arma nenhuma.

**N3 · O golpe que já venceu sai mesmo se quem o deu caiu.**

Se A e B se acertam no mesmo Tick e o golpe de A derruba B, o golpe de B **sai assim mesmo**: os dois
braços já estavam no ar, e a morte mútua é possível. Hoje não é o que acontece: `golpeMaisCedo` pula
quem está `noChao` (`grid.astro:4164`), com a razão escrita ao lado, "o gesto morre com quem o fazia,
e deixar a agenda dele travando a cena obrigaria a mesa a resolver um golpe que nunca vai sair".

Essa razão continua valendo, e a linha exata que ela desenha é:

| Situação | O golpe sai? |
|---|---|
| a peça cai e tinha golpe **devido neste Tick** (`g ≤ T`) | **sim**: o braço já estava no ar |
| a peça cai e tinha golpe **agendado para o futuro** (`g > T`) | **não**: morre com ela, como hoje |

Ou seja, `golpeMaisCedo` deixa de pular quem caiu **apenas** para os golpes já vencidos. Nenhum golpe
que nunca vai sair fica travando a cena, que era o medo do comentário original.

**A consequência que compra o desenho inteiro:** com N2 e N3 juntos, **a ordem em que o mestre
resolve os cartões deixa de mudar o resultado**. Ninguém declara sabendo do golpe do outro (N2) e
ninguém deixa de golpear porque o outro resolveu primeiro (N3). Isso é o que "simultâneo" promete, e
é também o que faz o harness ser determinístico de verdade: a §2.4 podia garantir ordem estável de
iteração, mas não podia garantir que a ordem não importasse. Agora pode.

**O que essas duas mudanças tocam**, para dimensionar: `grupoDaVez` e `golpeMaisCedo` em
`grid.astro` (as duas dentro de vinte linhas uma da outra), mais `agendaSimultanea` e
`decideEmValeDepois` por causa de N1. Nada em `hex.ts`, nada em `quase-acerto.ts`, nada no catálogo.
As três entram no mesmo balde do Q16: mudanças de regra que vão para a mesa, com a medição decidindo
a ordem.

### 0.46 A anatomia de um Tick · N4, N5 e N6 (decididas em 02/09)

As três fecham o desenho do Tick e substituem a parte do laço da §2.2 que ainda era "a ordem que o
Grid tem por acidente da interface".

#### N4 · A ordem de declaração

No Tick T, todo mundo que está livre declara. **Corrigido em 02/09**, com o exemplo do usuário: o
critério principal é a **iniciativa rolada**, e não a soma de atributos. A cadeia inteira é
"quem tem menos declara primeiro", em todos os níveis:

| # | Critério | Sentido |
|---|---|---|
| 1 | **a iniciativa rolada** | **crescente**: declara primeiro quem tirou menos |
| 2 | Raciocínio + Prontidão | crescente |
| 3 | Raciocínio | crescente |
| 4 | Destreza | crescente |
| 5 | sorteio | |

**A iniciativa só manda na entrada.** Passados os Ticks em que as peças entram pela escada da
iniciativa, o dado sai da frente e a chave passa a ser a estatística: **Raciocínio + Prontidão
crescente**, depois Raciocínio, depois Destreza, e a iniciativa rolada vira o último desempate antes
do sorteio. As duas cadeias são a mesma coisa com a iniciativa mudando de lugar:

| Fase | A cadeia de declaração, sempre crescente |
|---|---|
| **entrada** (os Ticks da escada de iniciativa) | iniciativa · Rac + Prontidão · Raciocínio · Destreza · sorteio |
| **depois** | Rac + Prontidão · Raciocínio · Destreza · iniciativa · sorteio |

O acaso decide quem chega primeiro na briga; a perícia decide quem lê a briga daí em diante.

**A fronteira é por peça** (decidido em 02/09): cada peça usa a cadeia de entrada na sua **primeira**
declaração e a cadeia de depois dali em diante. É o mais fiel à ideia de que o dado decide quem chega
primeiro na briga e a perícia decide quem a lê daí em diante.

**E isso abre o caso do Tick misto, que ainda não tem regra.** Num mesmo Tick pode haver peça na
primeira declaração e peça re-declarando, e as duas cadeias discordam sobre como ordená-las entre si.

Eu tinha estimado que isso seria raro, e **estava errado**: a entrada cabe sempre nos Ticks 1 a 4
(`ticksDeEntrada` faz `1 + ceil(atraso ÷ 6)`, e o atraso máximo possível é 16), e o ciclo mais curto
do catálogo é 5, então uma peça que ataca só volta a declarar no Tick 6, sem sobreposição. Mas
**esperar 1 Tick e abortar liberam a peça no Tick seguinte**, e aí ela re-declara no Tick 2, 3 ou 4,
em cima das entradas. Quem espera ou aborta cedo cai no caso misto sempre.

**Decidido em 02/09: quem ainda está entrando declara primeiro**, como bloco, antes de qualquer peça
que já esteja re-declarando, e cada grupo se ordena pela sua própria cadeia. A justificativa é a mesma
de N7: quem já está na briga lê quem está chegando, e não o contrário.

Em uma frase, para a implementação: **ordena-se por (é a primeira declaração desta peça? sim antes de
não), e dentro de cada grupo pela cadeia daquele grupo.**

#### A peça que entra no meio da cena vira eixo, e não regra

Um reforço que chega, uma invocação, alguém que levanta do chão: quando essa peça declara pela
primeira vez? **Decidido: não se escolhe uma das três, mede-se as três.** É o eixo **E10** da grade
(§0.5), com os níveis:

| Nível | O que faz |
|---|---|
| **a · declara primeiro no Tick** | quem chega entra na frente de todo mundo, e se compromete sem ver nada |
| **b · declara no Tick seguinte** | observa o Tick corrente e só age no próximo, como quem levanta do chão já faz (`DELAY_AO_LEVANTAR`) |
| **c · entra por último** | declara neste Tick, depois de todos, com a maior vantagem de informação da cena |

As três são defensáveis e puxam para lados opostos: (a) pune quem chega, (c) premia, e (b) é a única
que não mexe na ordem do Tick. Como o efeito é sobre a vantagem de informação de N7, que é justamente
o que o eixo E9 mede, os dois se cruzam bem e o cruzamento está entre os deliberados da §0.5.

**A resolução é o exato inverso da declaração**, com duas ressalvas que vêm das respostas de 02/09:

- **Empate resolve junto.** Duas peças com a mesma iniciativa (ou, depois da entrada, com a mesma
  chave) agem **no mesmo instante**: a ordem interna serve só para a declaração. Com o retrato de N6
  isso não gera ambiguidade nenhuma, porque a ordem entre elas não muda número.
- **A dependência entre ações vence a ordem.** Quando uma ação só faz sentido depois de outra
  (interpor-se antes de o golpe chegar, aparar, empurrar quem ia atacar), a ordem sai da dependência
  e não da iniciativa, e quem decide o encaixe é o mestre. No repertório declarável de hoje a única
  ação dependente é o abortar com "interpor" (`abrirAbortar`, `mesa-tempo-ui.ts:272-334`), e a regra
  operacional que sai daí é: **a interposição resolve antes do golpe contra o qual ela se interpõe**,
  qualquer que seja a iniciativa de quem se interpôs. Para o harness isso é uma exceção declarada na
  fase 3, e não uma parada de julgamento.

**O que isso corrige na versão anterior desta tabela.** Ela tinha a iniciativa como quarto critério e
em ordem decrescente, e os desempates de Raciocínio e Destreza também decrescentes. Estava errada nos
dois pontos: a iniciativa é o primeiro critério, e a cadeia inteira é crescente.

**Uma consequência elegante: a fila que já existe é a ordem de resolução.** `ordemDaFila`
(`combate-tempo.ts:399-404`) ordena por Tick, depois **iniciativa decrescente**, depois Raciocínio
decrescente. O critério principal já é o certo para a resolução; o que falta é acrescentar Prontidão
e Destreza aos desempates, e a ordem de declaração é essa mesma invertida dentro do Tick.

**Um exemplo, o do usuário, para a implementação conferir contra.** Iniciativas: P1 12, P2 11,
P3 9, P4 5, P5 3, P6 9.

| Tick | Quem age | Por quê | Declara nesta ordem | Resolve nesta ordem |
|---:|---|---|---|---|
| 1 | P1 | tirou a maior, entra sozinho (`tickDoPrimeiro: 1`) | P1 | P1 |
| 2 | P2, P3, P6 | atraso ≤ 6 em relação ao primeiro (`gapPorPenalidade: 6`) | **P3 e P6** (ini 9), desempatados entre si por Raciocínio + Prontidão crescente, e depois **P2** (ini 11) | P2, depois P3 e P6 |
| 3 | P4, P5 | atraso 7 e 9, um degrau a mais | **P5** (ini 3), depois **P4** (ini 5) | P4, depois P5 |

O Tick 3 é o exemplo que mostra para que a regra serve: P5 declara que vai atacar P1, e **P4, que
declara depois porque tirou mais iniciativa, escolhe sabendo disso** e vai proteger P1. É a vantagem
de N7 em ato.

**O número já existe nos dois lados do tabuleiro, e ninguém tinha reparado.** A iniciativa do sistema
é `1d6 + Raciocínio + Prontidão` (`regras.json → derivados.iniciativa.soma: ["raciocinio",
"prontidao"]`; `rolarIniciativaPC`, `mesa-ficha.ts:132-135`). Então:

- **PC:** `attrs.raciocinio + skills.prontidao`, direto da ficha.
- **Criatura:** as 309 do bestiário **não têm perícia nenhuma** (o bloco tem `atributos`, e
  `habilidades` é prosa). Mas todas têm a expressão de iniciativa, e o **fixo dela é exatamente
  `Raciocínio + Prontidão`**. Conferido nas 309: nenhuma dá Prontidão implícita negativa, a faixa é
  de 0 a 5, e a distribuição é 8 com 0, 183 com 1, 85 com 2, 24 com 3, 8 com 4 e 1 com 5.

Ou seja, a chave de declaração é **o fixo da iniciativa**, e ele está no dado para todo mundo. A
ordem inteira acaba sendo "a estatística de iniciativa, e depois o dado de iniciativa", o que é
coerente com o resto do sistema e não precisa de campo novo em lugar nenhum.

Duas coisas que isso obriga:

- **`ordemDaFila` ganha um irmão.** A fila de hoje ordena por Tick, iniciativa (desc), Raciocínio
  (desc), carimbo de chegada e nome (`combate-tempo.ts:399-404`). A ordem de declaração é outra
  coisa e vai numa função própria; a fila continua sendo a fila.
- **`regras.json → derivados.iniciativa.empateNoTopo` fica desatualizado.** Ele diz hoje: "Quem age
  primeiro dentro do instante é o desempate: maior Raciocínio, e persistindo o empate, o dado." A
  cadeia nova é mais longa e o supera.
- **O sorteio do quinto critério** é a única fonte de acaso fora dos dados no combate. No harness ele
  sai do fluxo semeado `ordem` (§2.4), senão a batalha 743 não replica.

#### N5 · As três fases de um Tick

O Tick deixa de ser "cada um na sua vez" e passa a ter fases explícitas:

| Fase | O que acontece |
|---|---|
| **1 · declaração** | todos os livres declaram, na ordem de N4. Nenhuma consequência acontece aqui |
| **2 · início** | as ações começam. Todas juntas, depois que a última declaração entrou (é o que N1 quis dizer com "a ação começa no Tick T") |
| **3 · resolução** | as consequências devidas neste Tick acontecem, **na ordem inversa da declaração**: resolve primeiro quem tirou **mais iniciativa** (N4, corrigido) |

Isso torna **N2 uma consequência, e não uma regra à parte**: se as declarações são uma fase inteira e
as consequências vêm depois dela, um golpe declarado no Tick T obviamente não pode calar a declaração
de ninguém no Tick T. A mudança em `grupoDaVez` (olhar `acao.desde` em vez do Tick do golpe) continua
sendo o que implementa isso.

#### N6 · O retrato: penalidade nascida no Tick T só vale em T+1

Toda a fase 3 lê o tabuleiro **como ele estava quando as declarações terminaram**. Dano, condição,
Pressão e queda que acontecem dentro do Tick T entram no estado, mas **não realimentam nenhuma
resolução do próprio Tick T**.

O exemplo que fecha a regra: dois personagens de adaga se atacam no mesmo Tick. O Golpe sai no mesmo
Tick para os dois, e **mesmo que o primeiro cause dano suficiente para gerar penalidade de
ferimento, essa penalidade só conta a partir do Tick seguinte**. Os dois ataques e as duas Defesas
saem com a penalidade normal de Golpe (−4) e nada mais.

A linha exata, porque ela não é "congelar tudo":

| Entra na conta da fase 3 | Não entra |
|---|---|
| a escada da **própria ação** (Preparo −2, Golpe −4, Recuperação −2 por golpe dado), que é o que a agenda deste Tick diz | o **ferimento** causado neste Tick |
| ferimento, condição e Pressão que já existiam **antes** do Tick T | a **condição** posta neste Tick |
| | a **Pressão** dos ataques declarados neste Tick |
| | a **queda** de quem foi derrubado neste Tick |

**N3 vira caso particular disto.** "O golpe de quem caiu ainda sai" não precisa mais ser uma regra
própria: quem caiu na fase 3 estava de pé no retrato, então o braço dele já estava no ar. O que a
implementação ainda precisa é o mesmo: `golpeMaisCedo` deixar de pular `noChao` para golpes já
vencidos.

**Onde o código de hoje contraria N6**, para dimensionar:

- **A Pressão é escrita na declaração, e não na resolução.** `gravarRelogio`
  (`grid.astro:7200-7205`) soma `pressao += golpes` na ação do alvo no instante em que o atacante
  declara. Com N4 e N5, isso acontece dentro da fase 1, e valeria já na fase 3 do mesmo Tick. Precisa
  entrar no retrato.
- **O ferimento é lido ao vivo.** `const fer = tierDe(alvo.pv_atual, alvo.pv_max).penDefesa`
  (`grid.astro:7435`), com o `pv_atual` do instante em que a folha abre. Precisa ler o retrato.
- **A escada não muda:** `defesaPerdida` lê a agenda, e a agenda deste Tick é exatamente o que deve
  contar. Nada a fazer ali.

**A extensão que eu proponho, e que não é palavra sua:** que o retrato cubra **todo** o estado lido
na fase 3, e não só as penalidades. Ou seja, também a posição. O motivo é o `empurrao-elemental`, que
move o alvo: se a posição mudasse no meio da fase 3, a distância que uma folha lê passaria a depender
de qual cartão o mestre abriu primeiro, e voltaríamos a ter ordem de resolução mudando número. Com o
retrato cobrindo a posição, **a ordem inversa de N5 é puramente narrativa: ela decide o que se conta
primeiro, e não muda nenhum resultado.** Isso é o que faz o simultâneo ser simultâneo de verdade, e
é também o que dá ao harness um determinismo que não depende de eu acertar a ordem de iteração.

### 0.47 N7 · Declarar por último é vantagem, e ela já tem régua

**Decidido:** a declaração é **visível**. Quem declara depois vê o que já foi declarado, e é por isso
que a ordem de N4 é crescente em Raciocínio + Prontidão: quem tem mais declara por último e escolhe
com mais informação. É a regra de declaração do **Vampiro: A Máscara** (declara-se na ordem inversa
da iniciativa e resolve-se na ordem dela), e ela cai bem aqui porque a chave da ordem **é** a
estatística de iniciativa (§0.46 N4).

#### O que o declarante tardio enxerga já está definido no banco

A migração 27 escreveu a assimetria, e com a mesma intenção, antes desta conversa existir
(`supabase/migracao-27.sql:76-88`):

> "O jogador vê QUE alguém está montando alguma coisa (a fita, os Ticks, a fase). O mestre vê O QUE:
> a arma e o alvo. Sem isso a fita entregaria de graça que o ogro está carregando o martelo contra o
> mago, que é justamente a informação que se compra prestando atenção na mesa."

A linha que faz isso, em `combate_visao` (L116-117):

```sql
case when m1.meu or v.stats then c.acao
     else c.acao - 'arma' - 'alvo' end as acao
```

Então o repertório de informação de quem declara por último é, exatamente:

| Vê | Não vê |
|---|---|
| que a peça declarou alguma coisa, e a fase dela em cada Tick (`golpes`, `livre`) | **contra quem** (`alvo`) |
| o **Tick em que o golpe cai** | **com o quê** (`arma`) |
| a **manobra** (`tipo`: simples, dupla, segura, rajada) | |
| a Pressão e a dívida acumuladas | |
| a Vida do inimigo só no grau que a mesa revelou (migração 14) | |

**N7 não precisava de sistema de visibilidade novo**, e a régua herdada era esta. **N8 (§0.48) a
substitui**: a decisão seguinte foi abrir o alvo e a arma do corpo a corpo e guardar só a pontaria. O
que segue nesta seção descreve a máscara de hoje, que é o ponto de partida da migração 30.

#### Um vazamento que o Simultâneo abriu na máscara

`c.acao - 'arma' - 'alvo'` remove as **chaves de topo**. O bloco `mov`, que o Simultâneo acrescentou
depois, tem um `alvo` dentro dele (`Mov`, `combate-tempo.ts:738`; lido em `grid.astro:4920` como
`mov.alvo ? TOKENS[mov.alvo] : mov.destino`), e esse `mov.alvo` **sobrevive à máscara**. O jogador
consegue ler contra quem uma peça está andando, que é precisamente a informação que a migração 27
foi escrita para esconder. O conserto é uma linha na view, e ele vira mais urgente com N7, porque
agora essa informação tem valor mecânico e não só narrativo.

#### O que N7 muda no resto do desenho

**Nas políticas (§0.4 P4).** Cada política passa a precisar de uma regra de leitura, e a posição dela
na ordem decide se ela tem o que ler. Proposta, uma linha por perfil:

| Perfil | O que faz com o que vê |
|---|---|
| **Agressivo** | ignora: ataca o mais próximo de qualquer jeito |
| **Cauteloso** | se alguém já declarou golpe para este Tick, prefere `segura`; se o inimigo mais próximo está em Recuperação declarada, ataca `rajada` |
| **Tocaiador** | se alguém declarou golpe com queda neste Tick ou no próximo, recua antes |
| **Guarda-costas** | se há golpe declarado caindo no Tick em que o aliado protegido está aberto, move para interpor em vez de atacar |
| **Conjurador** | conta quantos declararam golpe para o mesmo Tick e escolhe zona se forem 2 ou mais agrupados |

Com **N8** (§0.48) essas regras passam a poder usar também o **alvo do corpo a corpo** ("já tem
alguém indo nele, escolho outro"), e continuam sem poder usar o alvo de **tiro, arremesso e Arte**,
que fica escondido até resolver. Isso é bom para o desenho: as políticas ficam honestas por
construção, e a mesma política roda para o mestre e para o jogador sem precisar de duas versões.

**Na carga do mestre, que é a métrica.** A ordem de declaração vira uma regra que alguém tem de
cumprir. Hoje `grupoDaVez` devolve todos os livres e o mestre escolhe por quem começar; com N4 e N7
ele teria de **ordenar as peças livres por Raciocínio + Prontidão a cada Tick** e perguntar nessa
ordem. Isso é aritmética de escrituração, exatamente do tipo que a §2.3 classifica como **iii**, e
sem o Grid apresentando a fila de declaração pronta ela vira carga nova. É o caso mais claro até
agora de uma regra boa para o jogo que **piora** a mesa se a ferramenta não a absorver, e é
exatamente o que o harness foi desenhado para medir.

**Na balança do sistema, como hipótese a medir.** Raciocínio + Prontidão passa a comprar **três**
coisas com o mesmo par: entrada mais cedo na briga (`ticksDeEntrada`, pelo degrau de iniciativa),
declaração por último (N7) e resolução primeiro (N5). Não estou dizendo que é demais; estou dizendo
que é uma concentração que ninguém decidiu de uma vez, e que a simulação consegue pôr número nela.
Proposta, corrigida na `03-respostas.md` §1.4: **"cego" não é uma política, é um interruptor**
aplicável a qualquer uma delas, e vira o eixo **E9**. A versão anterior desta frase propunha uma
sexta política cega e a comparava com "a Agressiva com leitura", o que não funcionava: o Agressivo é
definido acima como quem ignora o que vê, então as duas seriam a mesma coisa. Como interruptor, a
comparação vale para o Cauteloso, o Tocaiador e o Guarda-costas, que são os três cujas regras de fato
leem alguma coisa, e mede o preço de um ponto de Raciocínio + Prontidão sem confundi-lo com o preço
de ser cauteloso. E o Agressivo ganha uma regra de leitura para o E9 fazer sentido nele também: *se o
inimigo mais próximo já tem golpe declarado de outro aliado caindo neste Tick, escolhe o segundo mais
próximo*.

### 0.48 N8 · O que é visível, e o rastro no tabuleiro

**Decidido, e inverte a máscara de hoje:** é visível **quem vai fazer o quê em cada Tick**. O
tabuleiro ganha um **rastro** do que foi declarado: o movimento, a trajetória, quem são os alvos. A
exceção é a pontaria: **arremesso, tiro e Arte não revelam o alvo até serem executados**. E fica como
melhoria futura um **teste para esconder as intenções**, que é o que devolve ao ogro a opção de
disfarçar para onde vai o martelo.

A régua é o corpo contra a mira: **o gesto corporal é público, a pontaria não é.** Erguer o martelo
na direção de alguém, correr para cima de alguém e atravessar a linha são coisas que a mesa inteira
vê. Para onde o arqueiro está olhando, não.

#### O que muda na migração 27

A máscara de hoje é `case when m1.meu or v.stats then c.acao else c.acao - 'arma' - 'alvo' end`
(`migracao-27.sql:116-117`), e o comentário dela dizia o contrário desta decisão: "sem isso a fita
entregaria de graça que o ogro está carregando o martelo contra o mago". N8 aceita que entregue, e
devolve o segredo por outro caminho (o teste, no futuro), que é mais barato de entender na mesa do
que uma coluna escondida.

| Chave | Hoje | Com N8 |
|---|---|---|
| `arma` | escondida de quem não vê stats | **visível sempre**: dá para ver o que a pessoa está empunhando |
| `alvo` (corpo a corpo) | escondida | **visível** |
| `alvo` (tiro, arremesso, Arte) | escondida | **continua escondida**, até o golpe resolver |
| `mov` e `mov.alvo` | visível por acidente (a máscara só limpa chaves de topo) | **visível de propósito**: perseguir é gesto público |

O vazamento do `mov.alvo` que eu tinha achado deixa de ser vazamento e passa a ser o comportamento
certo. O que a view precisa é do avesso: saber **quando** esconder. A view é SQL e não consulta
`armas.json`, então a declaração passa a carregar a marca: `acao.mirado: boolean`, escrita por
`declararGolpe` quando a perícia da arma é `atirador` ou `arremesso`, ou quando é conjuração. A
máscara vira `case when acao->>'mirado' = 'true' then acao - 'alvo' else acao end`, e vale para todo
mundo, inclusive para quem vê stats: a pontaria é segredo do jogo, não do papel.

#### O rastro, no tabuleiro

É funcionalidade nova do Grid, e é o que faz N7 valer alguma coisa na prática: sem ver, declarar por
último não compra nada. O mínimo:

- a **trajetória declarada** desenhada do token até o destino, e o destino marcado;
- uma **seta** do atacante ao alvo, quando há alvo visível;
- o **Tick em que o golpe cai** legível ao lado, que a fita já dá;
- nada disso para a ação `mirado`, que mostra só que a pessoa está montando alguma coisa.

Entra na mesma família do editor de cenário (`Pendencias.md` I5): o Grid deixando de ser um mapa de
peças e passando a mostrar intenção.

### 0.49 A fila de declaração na tela

**Decidido:** a tela ordena sozinha, pela ficha dos participantes (a chave de N4), **e o mestre pode
mudar a ordem à mão.** A coluna da vez mostra os livres já ordenados, com quem declara agora em
destaque, e o mestre arrasta se a mesa decidir outra coisa.

Vale registrar a consequência, porque ela é do tipo que morde depois: **mudar a ordem à mão move a
vantagem de informação de N7 de uma pessoa para outra.** Não é um ajuste cosmético como reordenar a
fila de iniciativa; é dar ou tirar de alguém o direito de escolher sabendo. A tela deveria dizer isso
em uma linha quando o mestre arrasta.

---

### 0.5 A grade, refeita com as respostas

| Eixo | Níveis | Custa célula? |
|---|---|---|
| **E1 · diversidade de ciclos** | 4 (uníssono 6 · 5 e 6 · 6 e 7 · 4/5/6/7) | sim |
| **E2 · distância inicial** | 4: **1 · 18 · 42 · 71 hexes** (encostado, ~3, ~7 e ~12 Ticks de corrida; 71 é a diagonal do mapa) | sim |
| **E3 · tamanho da cena** | 3 (1v1 · 3×3 · 2×8) | sim |
| **E4 · assimetria de passo** | 2 | sim |
| **E5 · perfil de regras** | **18** (cheio · uma de fora por bandeira, 16 · tudo desligado), §0.7 | sim |
| **E6 · política** | 5 (agressivo · cauteloso · tocaiador · guarda-costas · conjurador). A **cega** saiu daqui e virou o eixo E9 (`03-respostas.md` §1.4) | sim |
| **E7 · obstáculo** | 2 (campo aberto · parede), §0.4 P2, e cai fora se P2 for recusada | sim |
| **E9 · leitura** | 2 (lê as declarações do Tick, ou não). Aplica-se a qualquer política, e é o que mede N7 | sim |
| **E10 · quem entra no meio** | 3 (declara primeiro · declara no Tick seguinte · entra por último), §0.46 | sim |
| **E11 · natureza do elenco** | 3 (PC × PC · PC × criatura · criatura × criatura), decidido em 02/09 (D10). É o eixo que faz `porte` e a couraça de porte existirem: elas valem 0 para Médio e menores | sim |
| **E8 · atribuição de gesto** | 2 (mestre solo · um por PC) | **não**: é leitura do mesmo log |
| **D1 · perfil de automação** | 2 | **não**: é leitura do mesmo log |

Cruzar tudo é um enunciado, não uma grade: com E5 nos 17 perfis da §0.7 passa de cem mil
combinações. O orçamento que aperta continua sendo o mesmo da §3: o que se consegue ler. Desenho:

- **Núcleo cruzado: E1 × E2 × E3 = 48 células.** São os três que eu espero que interajam, e a
  previsão da §3 é sobre eles.
- **Um fator de cada vez em volta de cada âncora**, somando `níveis − 1` de cada eixo restante:
  E4 (1) + E6 (4) + E7 (1) + E9 (1) + E10 (2) + E11 (2) = **11 células por âncora**. Mede o efeito
  principal de cada um sem cruzá-lo com o resto.
- **E5 não entra nessa conta**, e é a correção de 02/09 (`05-fechamento.md` §2.4): sete das dezessete
  comparações de bandeira **não podiam morder na âncora**, e medi-las lá era gastar catorze células
  para colher zero. Cada bandeira passa a ser medida **na célula em que ela morde**, e só as seis do
  núcleo do Tick, que valem em qualquer cena, ficam nas duas âncoras.
- **Cruzamentos deliberados**, porque OFAT é cego a interação e há seis que eu espero de verdade:
  E1(uníssono) × E3(horda), E1(uníssono) × E4(assimétrico), E2(muito longa) × E4, E5 × E1(uníssono),
  **E9 × E10**, porque os dois mexem na mesma coisa (quem vê o quê antes de declarar), e
  **E11 × E3**, que é a cena que a mesa de verdade joga: uma horda de bicho contra os PCs.
  **6 células.**
- Total: **112 células**, discriminadas na **§0.10.1**, que é a grade oficial. A 500 repetições,
  **56.000 batalhas**, mais o reforço de 2.000 nas células de cauda (as de E4 e a de uníssono com
  horda). Pela medição da `03-respostas.md` §4.2, isso é da ordem de 50 segundos de máquina. A
  justificativa das 500 e das 2.000 é a da §3 e não muda.

**A previsão quantitativa de E1 continua sem base até o piloto rodar.** A §3 prevê quantas colisões
cabem "numa batalha de 37 a 47 Ticks", e esses 37 a 47 vieram da R2 §D1, que mediu a bancada no
preset `REGRAS_PGR`, **em outro sistema de tempo e sem mapa** (`03-respostas.md` §4.3b). A previsão
qualitativa (uníssono colide sempre, coprimo quase nunca) não depende disso; a quantitativa só terá
número depois da célula piloto da §0.10.

---

## 0.6 O que entra na mesa antes do harness

**Decidido:** tudo. N1 a N8, o `ate` das condições (Q7) e as 15 bandeiras (§0.7) entram no Grid **antes**
de o harness ser escrito, para que ele meça o jogo de verdade desde a primeira batalha e nenhuma
regra viva só na cópia headless.

Uma consequência a registrar, porque afina o que Q16 tinha dito. Q16 respondeu "as 7 regras entram no
jogo, e a medição decide a ordem"; com tudo entrando antes, a medição não decide mais **a ordem de
ligar**, e passa a decidir outra coisa: **quais valeu a pena ligar**. As bandeiras continuam
existindo como bandeiras, com a mesa lendo o mesmo objeto de perfil, e o padrão em produção passa a
ser **ligadas**. O eixo E5 continua medindo base contra tudo-ligado, e o "base" deixa de ser o
presente e vira o passado: é a resposta à pergunta "o que essas nove regras compraram".

| # | O que | Onde | Prova |
|---|---|---|---|
| 1 | **N1** · `decideEmValeDepois` 1 → 0, `agendaSimultanea` com `inicio = tickDecl` | `regras.json`, `combate-tempo.ts:794-806` | `test-simultaneo.mjs`: a espada longa declarada no Tick 1 golpeia no 2 e fica livre no 7; o período entre golpes volta a ser o ciclo |
| 2 | **N4** · a chave e o comparador da ordem de declaração | `combate-tempo.ts` (função nova, irmã de `ordemDaFila`); a chave é `raciocinio + prontidao` na ficha e o fixo da iniciativa no bestiário | `test-simultaneo.mjs`: a cadeia dos cinco critérios, e a leitura do fixo nas 309 criaturas |
| 3 | **N2** · `grupoDaVez` bloqueia por `acao.desde < t`; `instanteDeGolpe` continua vendo todos | `grid.astro:4107-4126`, L4174 | `test-grid-simultaneo.mjs`: duas adagas declaram as duas no mesmo Tick |
| 4 | **N3** · `golpeMaisCedo` deixa de pular `noChao` para golpe já vencido | `grid.astro:4163-4170` | `test-grid-simultaneo.mjs`: morte mútua no mesmo Tick |
| 5 | **N5** · as três fases, e a resolução na ordem inversa | `grid.astro`, o avanço e a coluna da vez | `test-grid-simultaneo.mjs` |
| 6 | **N6** · o retrato, lido pela folha no lugar do estado ao vivo | `grid.astro:7435` (o ferimento) e L7200-7205 (a Pressão na declaração), mais a posição | `test-grid-simultaneo.mjs`: as duas adagas saem com −4 e nada mais |
| 7 | **N7 e N8** · a máscara ao avesso, com `acao.mirado` | migração 30, `declararGolpe` | consulta de conferência na própria migração, como as anteriores |
| 8 | **N8** · o rastro no tabuleiro | `grid.astro`, a pintura | `test-grid-simultaneo.mjs` |
| 9 | **N4 na tela** · a fila de declaração ordenada, com arrasto do mestre | `grid.astro`, a coluna da vez | `test-grid-simultaneo.mjs` |
| 10 | **Q7** · o `ate` das condições passa a ser lido e a expirar | `grid.astro` / `artes-grid-mesa.ts` | `test-artes-grid.mjs` |
| 11 | **As 15 bandeiras** · as 8 de regra publicada (Margem, gate, porte, Bloqueio com escudo, modo secundário, teto ±6, `curaSemArea`, `curaDivide`), as 6 do núcleo do Tick e o `porRodada` | `regras.json` (o objeto de perfil), `quase-acerto.ts`, `calc.ts`, `combate-resumo.ts`, `grid.astro`, `artes-grid.ts` | `test-contrato.mjs` e `test-quase-acerto.mjs`, que hoje **congelam o estado errado** (R2 §A2: `R.defesa = 16` com o Bloqueio inútil) e precisam ser reescritos junto |

Os itens 1 a 6 são o núcleo do Tick e se sustentam sozinhos. O 11 é o maior de todos e é o único que
mexe em cinco arquivos de regra ao mesmo tempo.

### 0.6.1 A especificação, item a item

Cada item traz **hoje**, **passa a ser**, os **cuidados** que eu encontrei olhando o código, e a
**prova**. As linhas citadas são do commit `df03b44`.

---

#### 1 · N1 · A ação começa no Tick em que é declarada

**Hoje.** `src/data/regras.json → combate.simultaneo.decideEmValeDepois: 1`, com a nota "A ação
declarada no Tick T começa em T+1". `combate-tempo.ts:778`: `decideEmValeDepois()` devolve
`SIM?.decideEmValeDepois ?? 1`. `agendaSimultanea` (L794-806): `inicio = tickDecl + decideEmValeDepois()`.

**Passa a ser.** `decideEmValeDepois: 0` e `inicio = tickDecl`. A ação ocupa `T` até `T + ciclo − 1`
e a peça fica livre em `T + ciclo`. O período entre golpes volta a ser exatamente o `ciclo`.

**Cuidados.**
- A `decideNota` do `regras.json` e o `Combate_Simultaneo.md:124-127` afirmam o contrário e precisam
  ser reescritos. O exemplo do arco continua fechando: Preparo 5 declarando no Tick 1 solta a flecha
  no Tick 6, porque o combate começa no Tick 1 (`derivados.iniciativa.tickDoPrimeiro: 1`).
- **`grid.astro:4918`** filtra o passo do Tick com `((c.acao)?.desde ?? 0) + decideEmValeDepois() > T`.
  Com 0 a condição nunca é verdadeira e a guarda vira letra morta; o efeito prático não muda, porque
  o avanço do Tick T já rodou quando alguém declara em T. **Remova a guarda** em vez de deixá-la
  inerte, e escreva no comentário por que ela não é mais necessária.
- A caixa de iniciativa escreve "entra no Tick 0" (`grid.astro:4751`, no texto do `uiConfirmar`), o que já contradizia o
  `regras.json` (R2 §F#13) e agora contradiz também a régua do Simultâneo. Corrija a frase junto.

**Prova.** `scripts/test-simultaneo.mjs`: espada longa declarada no Tick 1 golpeia no 2 e fica livre
no 7; cinco declarações encadeadas dão período 5 para leve, 6 para média/haste/distância e 7 para
pesada. Detalhe e a tabela medida na **§0.45**.

---

#### 2 · N4 · A ordem de declaração

**Hoje.** Só existe `ordemDaFila` (`combate-tempo.ts:399-404`): Tick, iniciativa (desc), Raciocínio
(desc), carimbo de chegada, nome. Ela é a fila, e continua sendo.

**Passa a ser.** Uma função nova e irmã, `ordemDeDeclaracao(a, b, naEntrada)`, com a cadeia **toda
crescente** (declara primeiro quem tem menos) e a iniciativa mudando de lugar conforme a fase:

| Fase | A cadeia |
|---|---|
| **entrada** (os Ticks da escada de iniciativa) | iniciativa · Rac + Prontidão · Raciocínio · Destreza · sorteio |
| **depois da entrada** | Rac + Prontidão · Raciocínio · Destreza · iniciativa · sorteio |

**A ordem de resolução é essa invertida** (`ordemDaFila` já tem o critério principal certo para ela:
Tick, depois iniciativa decrescente), com duas exceções que a §0.46 detalha: **empate resolve junto,
no mesmo instante**, e **dependência entre ações vence a ordem** (a interposição resolve antes do
golpe contra o qual ela se põe).

**A chave de Rac + Prontidão já existe nos dois lados**, porque a iniciativa do sistema **é**
`1d6 + Raciocínio + Prontidão` (`regras.json → derivados.iniciativa.soma`):

- **PC:** `attrs.raciocinio + skills.prontidao`, direto da ficha (é o que `rolarIniciativaPC`,
  `mesa-ficha.ts:132-135`, já soma).
- **Criatura:** o **fixo da expressão de iniciativa** do bloco (`combate.iniciativa`, do tipo
  `"1d6 + 6"`). Conferido nas 309: nenhuma dá Prontidão implícita negativa, faixa 0 a 5, distribuição
  8 com 0 · 183 com 1 · 85 com 2 · 24 com 3 · 8 com 4 · 1 com 5. As 309 **não têm perícia nenhuma**
  no bloco da mesa, então este é o único caminho.

**Cuidados.**
- Para extrair o fixo sem rolar dado, `rolarExpr(expr).flat` (`rolagem.ts:34`) já devolve o número
  certo, mas rola os dados à toa. Uma função pura `fixoDe(expr)` é mais limpa e é uma linha.
- **O sorteio do último critério é a única fonte de acaso do combate fora dos dados.** Na mesa pode
  ser `Math.random`; no harness precisa vir do fluxo semeado, senão a batalha 743 não replica (§2.4).
- **A fronteira entre as duas cadeias é por peça** (§0.46): cada uma usa a cadeia de entrada na sua
  primeira declaração e a outra dali em diante. O **Tick misto** (peça entrando e peça re-declarando
  juntas) acontece sempre que alguém espera 1 Tick ou aborta nos Ticks 1 a 4, e a regra é: **quem
  está na primeira declaração vai antes**, como bloco, e cada grupo se ordena pela sua cadeia. Em
  código: ordena-se por "é a primeira declaração desta peça?" (sim antes de não) e depois pela cadeia
  do grupo.
- `regras.json → derivados.iniciativa.empateNoTopo` diz hoje "maior Raciocínio, e persistindo o
  empate, o dado". A direção está certa para a **resolução**; a cadeia nova é mais longa e o texto
  precisa dizer as duas fases.

**Prova.** `test-simultaneo.mjs` para as duas cadeias, uma asserção sobre as 309 criaturas para a
leitura do fixo, e **o exemplo de seis peças da §0.46 rodado inteiro**, Tick a Tick, que é o teste
que pega a maior parte dos erros de ordem. Detalhe na **§0.46**.

---

#### 3 · N2 · Golpe declarado no Tick T não cala a declaração de ninguém no Tick T

**Hoje.** `grupoDaVez` (`grid.astro:4107-4126`) faz `const g = golpeMaisCedo(); if (g != null && g <= t) return [];`.
Com N1, uma arma de Preparo 0 declarada no Tick T tem o golpe **em T**, e o primeiro que declarar
tira a vez de todos os outros. Só a classe `leve` tem Preparo 0, e **159 das 309 criaturas atacam com
ataque leve** (51%), mais todo mundo que briga sem arma.

**Passa a ser.** A guarda de **declaração** considera só golpes de ações declaradas **antes** deste
Tick: `acao.desde < t`. O campo `desde` já existe em `Acao` e já é lido no avanço.

**Cuidados.**
- **`instanteDeGolpe` (L4174), que desliga o ⏭, continua olhando todos os golpes devidos**, inclusive
  os declarados neste mesmo Tick. São duas perguntas diferentes que hoje usam a mesma função:
  "alguém ainda pode escolher?" e "o mundo pode andar?". Precisam de dois leitores.
- O comentário de L4110-4118 explica a intenção original ("o braço declarado três Ticks atrás chega
  antes da próxima escolha"). Ela continua valendo; o que muda é a forma de expressá-la. Reescreva o
  comentário, não o apague.

**Prova.** `scripts/test-grid-simultaneo.mjs`: dois duelistas de adaga, os dois declaram no mesmo
Tick. Detalhe na **§0.45**.

---

#### 4 · N3 · O golpe que já venceu sai mesmo se quem o deu caiu

**Hoje.** `golpeMaisCedo` (`grid.astro:4163-4170`) pula quem está `noChao`, com a razão escrita ao
lado: "o gesto morre com quem o fazia, e deixar a agenda dele travando a cena obrigaria a mesa a
resolver um golpe que nunca vai sair".

**Passa a ser.** Pula `noChao` **apenas para golpes ainda no futuro**. Golpe com `tick ≤ T` sai, mesmo
que quem o deu tenha caído neste Tick: os dois braços já estavam no ar, e a morte mútua é possível.

**Cuidados.** A função ganha o Tick corrente como parâmetro. Nenhum golpe que nunca vai sair fica
travando a cena, que era o medo do comentário original, e ele deve ser atualizado para dizer a linha
nova.

**Prova.** `test-grid-simultaneo.mjs`: morte mútua no mesmo Tick. Detalhe na **§0.45**.

---

#### 5 · N5 · As três fases de um Tick

**Hoje.** Não há fases. O avanço faz relógio, passos e `decidirAutomaticas`; as declarações humanas e
a resolução dos cartões acontecem entre avanços, em qualquer ordem que o mestre queira.

**Passa a ser.** Todo Tick tem três fases explícitas:

1. **Declaração.** Todos os livres declaram, na ordem de N4. Nenhuma consequência acontece aqui.
2. **Início.** As ações começam, todas juntas, quando a última declaração entrou.
3. **Resolução.** As consequências devidas neste Tick acontecem, **na ordem inversa da declaração**:
   resolve primeiro quem tirou mais iniciativa (na entrada) ou quem tem mais Raciocínio + Prontidão
   (depois dela).

**Cuidados.**
- N2 é o que implementa a fase 1 no motor; sem ele a fase não fecha.
- Com N6, a ordem dentro da fase 3 **não muda número nenhum**: ela decide só o que se conta primeiro.
- **Empate resolve junto**, no mesmo instante; a ordem interna entre empatados serve só para a
  declaração.
- **Dependência entre ações vence a ordem.** A interposição resolve antes do golpe contra o qual ela
  se põe, qualquer que seja a iniciativa de quem se interpôs. No repertório de hoje a única ação
  dependente é o abortar com "interpor" (`abrirAbortar`, `mesa-tempo-ui.ts:272-334`), então é uma
  exceção declarada na fase 3, e não uma parada de julgamento.
- **A bandeira de N5 cobre só a ordem inversa** (decidido em 02/09). As três fases ficam sempre
  ligadas, porque o estado desligado delas não é um comportamento, é a ausência de uma regra
  (`03-respostas.md` §2.1). O que a bandeira liga e desliga é se a resolução segue a ordem inversa da
  declaração ou a **ordem da faixa** (por Tick, `mesa-tempo-ui.ts:194`), que é a que o mestre segue
  hoje. Isso isola de verdade, como comparador, sem inventar nenhum passado.

**Prova.** `test-grid-simultaneo.mjs`. Detalhe na **§0.46**.

---

#### 6 · N6 · O retrato: penalidade nascida no Tick T só vale em T+1

**Hoje.** A folha lê o estado ao vivo:
- **ferimento:** `const fer = tierDe(alvo.pv_atual, alvo.pv_max).penDefesa ?? 0` (`grid.astro:7435`),
  com o `pv_atual` do instante em que a caixa abriu;
- **Pressão:** `gravarRelogio` (`grid.astro:7200-7205`) soma `pressao += golpes` na ação do alvo **no
  instante da declaração**, ou seja, dentro da fase 1, valendo já na fase 3 do mesmo Tick.

**Passa a ser.** A fase 3 inteira lê um **retrato** fechado ao fim da fase 1, por peça:

```
pv          int          para o tier de ferimento
condicoes   [{id,...}]   as que já existiam antes deste Tick
pressao     int          a acumulada antes deste Tick
pos         {q, r}       a posição, para distância e alcance
```

O que **entra** na conta da fase 3: a escada da **própria ação** (Preparo −2, Golpe −4, Recuperação
−2 por golpe dado), que sai da agenda deste Tick, mais tudo que já existia antes do Tick.
O que **não entra**: ferimento, condição, Pressão e queda **nascidos neste Tick**.

O exemplo que fecha a regra: dois duelistas de adaga se atacam no mesmo Tick, e os dois ataques e as
duas Defesas saem com a penalidade normal de Golpe (−4) e nada mais, mesmo que o primeiro cause dano
suficiente para gerar penalidade de ferimento.

**Cuidados.**
- **`defesaPerdida` não muda.** Ela lê a agenda, e a agenda deste Tick é exatamente o que deve contar.
- **A posição entra no retrato** (foi extensão minha, aceita): sem isso o `empurrao-elemental` faria
  a distância que uma folha lê depender de qual cartão o mestre abriu primeiro, e a ordem de
  resolução voltaria a mudar número.
- **O retrato é memória, e não coluna** (§0.8.2). A proposta anterior era uma coluna
  `encontros.retrato jsonb` para ele sobreviver a recarregar a página, e ela foi recusada pelo
  orçamento do item F: seria uma gravação por Tick. Em troca, **a tela avisa quem tentar recarregar
  ou sair no meio da fase de resolução**, o que estreita a janela sem custar nada. A migração 30
  perde essa coluna e fica só com a máscara.
- **N3 vira caso particular disto:** quem caiu na fase 3 estava de pé no retrato.

**Prova.** `test-grid-simultaneo.mjs`: as duas adagas saem com −4 e nada mais. Detalhe na **§0.46**.

---

#### 7 · N7 e N8 · A máscara ao avesso (migração 30)

**Hoje.** `combate_visao` mascara a ação com
`case when m1.meu or v.stats then c.acao else c.acao - 'arma' - 'alvo' end`
(`supabase/migracao-27.sql:116-117`), escondendo arma e alvo de quem não vê stats. E o `mov`, que o
Simultâneo acrescentou depois, tem um `alvo` **dentro** dele que sobrevive à máscara, porque
`jsonb - texto` só remove chaves de topo.

**Passa a ser.** O gesto corporal é público, a pontaria não é.

| Chave | Hoje | Com N8 |
|---|---|---|
| `arma` | escondida | **visível sempre** |
| `alvo` do corpo a corpo | escondida | **visível** |
| `alvo` de tiro, arremesso e Arte | escondida | **continua escondida**, até o golpe resolver |
| `mov` e `mov.alvo` | visível por acidente | **visível de propósito**: perseguir é gesto público |

A view é SQL e não consulta `armas.json`, então a **declaração passa a carregar a marca**:
`acao.mirado: boolean`, escrita por `declararGolpe` (`grid.astro:6916`) quando a perícia da arma é
`atirador` ou `arremesso`, e pela conjuração. A máscara vira
`case when c.acao->>'mirado' = 'true' then c.acao - 'alvo' else c.acao end`, **para todo mundo,
inclusive para quem vê stats**: a pontaria é segredo do jogo, não do papel.

**Cuidados.**
- O comentário da migração 27 (L76-88) argumenta o contrário desta decisão e precisa ser substituído,
  não apagado: a migração 30 deve dizer o que mudou e por quê.
- Fica como **melhoria futura** um teste para esconder as intenções, que é o que devolve ao ogro a
  opção de disfarçar para onde vai o martelo. Anote-o junto do editor de cenário (`Pendencias.md` I5).
- A migração 30 **não** leva mais a coluna `encontros.retrato`: o retrato ficou em memória (§0.8.2).

**Prova.** Consulta de conferência dentro da própria migração, como nas anteriores. Detalhe na
**§0.47** e na **§0.48**.

---

#### 8 · N8 na tela · O rastro no tabuleiro

**Hoje.** O Grid mostra peças e a fita de fase. Não mostra intenção.

**Passa a ser.** O mínimo que faz N7 valer alguma coisa, porque sem ver, declarar por último não
compra nada:

- a **trajetória declarada** desenhada do token até o destino, com o destino marcado;
- uma **seta** do atacante ao alvo, quando há alvo visível;
- o **Tick em que o golpe cai** legível ao lado (a fita já dá o número);
- **nada disso para a ação `mirado`**, que mostra só que a pessoa está montando alguma coisa.

**Prova.** `test-grid-simultaneo.mjs`. Detalhe na **§0.48**.

---

#### 9 · A fila de declaração na tela

**Hoje.** `grupoDaVez` devolve todos os livres e o mestre escolhe por quem começar, em qualquer ordem.

**Passa a ser.** A coluna da vez mostra os livres **já ordenados** pela chave de N4, com quem declara
agora em destaque, **e o mestre pode mudar a ordem à mão**.

**Cuidados.** Mudar a ordem à mão **move a vantagem de informação de N7 de uma pessoa para outra**.
Não é cosmético como reordenar a fila de iniciativa: é dar ou tirar de alguém o direito de escolher
sabendo. A tela deve dizer isso em uma linha quando o mestre arrastar.

**Prova.** `test-grid-simultaneo.mjs`. Detalhe na **§0.49**.

---

#### 10 · Q7 · As condições passam a expirar

**Hoje.** `porCondicao` (`artes-grid-mesa.ts:1167-1175`) carimba `ate = tick + turnos × 6`, e **não há
um leitor de `ate` em todo o `src/`** (R2 §C4). Nada expira sozinho: quem tira é só o fim do efeito
que pôs, e toda condição posta à mão depende de o mestre lembrar.

**Passa a ser.** No fim de cada Tick, as condições com `ate ≤ T` saem sozinhas, na mesa e no harness.

**Cuidados.** As 5 condições de dano por rodada (`sangrando`, `envenenado`, `sufocando`,
`em-chamas`, `morrendo`) têm `porRodada` e continuam **não sendo cobradas no Grid**: só
`combate.astro:1439` as lê. Isso é outra pendência e não faz parte deste item; não a resolva de
passagem, mas registre.

**Prova.** `scripts/test-artes-grid.mjs`.

---

#### 11 · As 15 bandeiras de regra

O maior dos onze, e o único que mexe em cinco arquivos de regra ao mesmo tempo. **Um bloco novo no
`regras.json`**, lido pela mesa e pelo harness, com o padrão em produção **ligado**. Ficou ali por
dois motivos (§0.7): `combate-tempo.ts` já importa `regras.json` e nada mais, então não entra
dependência nova e o empacotamento headless pega de graça; e o `dados_hash` do manifesto da bateria
(§2.4) já registra mudança em `src/data/*.json`, o que faz uma troca de bandeira ficar
automaticamente anotada na bateria que rodou com ela. **O manifesto passa a hashear também
`src/lib`**, para que mudança de código, e não só de régua, fique registrada do mesmo jeito. O
`src/lib/modulos.ts` continua sendo o que ele diz que é: só tela.

As oito de regra publicada estão na tabela abaixo; as outras sete são as do núcleo do Tick (`n1`,
que já é o parâmetro `decideEmValeDepois`, mais `n2`, `n3`, `n4`, `n5` e `n6`) e o `porRodada`, que
liga as cinco condições de dano por rodada que o Grid não cobra.

**A `couraca` saiu da lista em 02/09**, e não por decisão de desenho: ela **já é aplicada**, em tempo
de geração, no `gen-bestiario.mjs:36-45` e L79-82, e já está somada na `absorcao` de cada criatura do
`monsters-mesa.json`. Uma bandeira que a ligasse em tempo de execução somaria a couraça duas vezes.
A régua dela passa a ser exercitada pelo eixo E11 (`05-fechamento.md` §2.2).

| Bandeira | O que liga | Onde |
|---|---|---|
| `margem` | +1d6 de dano a cada 6 acima da Defesa | a resolução em `grid.astro` (hoje `rolarDano`, L7967, não recebe a diferença) e `danoNoAlvo` em `artes-grid.ts:1302` |
| `gate` | abaixo do Nível de Perfuração o golpe resvala, dano 0 | `calc.ts:131-135`, que **existe e não é chamada** |
| `porte` | ±3 de acerto por categoria de porte, teto ±12 | `regras.json → porteAcerto`, hoje lido só por `mesa/referencia.astro:38` |
| `bloqueio` | a rota de Bloqueio, com a Defesa da arma e o `bloqCaC` do escudo | `combate-resumo.ts:53` e L86-87; hoje o escudo **só penaliza** |
| `modo2` | o modo secundário de dano custa −2 de acerto e −1d6 | `grid.astro:7613, 7618`; hoje a troca é de graça |
| `teto6` | teto de ±6 nos modificadores | `mesa-core.ts:164-181`, `somarCondicoes` soma sem teto |
| `curaSemArea` | a Cura comum não tem Área | `artes-grid.ts`, a compra de parâmetros |
| `curaDivide` | em mais de um alvo, o valor curado é dividido entre eles | idem; a régua está em `regras.json → arcano.cura.divide` |

**Cuidados.**
- **Dois testes congelam hoje o estado errado e precisam ser reescritos no mesmo commit.**
  `test-contrato.mjs:136` trava `R.defesa = 16` (a Esquiva do Kael com bróquel, com o Bloqueio
  inútil) e L149 trava `F.defBloqueio = 10`, que ninguém lê. Ligar `bloqueio` sem mexer neles deixa
  a suíte verde com o número errado.
- A régua de cada uma está na tabela de canonicidade da **R2 §F**, com o capítulo, o `regras.json` e
  o motor lado a lado, e com o efeito de cada uma no resultado de uma batalha.
- Estas nove não são todas do mesmo tamanho: `margem` e `bloqueio` são as duas maiores (a R2 §F#1 e
  §F#2 medem +47% de dano e ~5 pontos de Defesa), e `teto6` só muda casos extremos.

**Prova.** `test-contrato.mjs` e `test-quase-acerto.mjs`, reescritos, mais `test-kael.mjs`, que é a
regressão de personagem que o `npm run validate` já roda.

---

---

#### 12 · A semente do `d6` (para o teste-espelho)

**Hoje.** `rolagem.ts:11` é `export const d6 = () => 1 + Math.floor(Math.random() * 6)`. É a única
fonte de acaso do combate, e não tem como ser semeada.

**Passa a ser.** Um ponto de injeção: a fonte de acaso vira um parâmetro do módulo, com
`Math.random` como padrão, e quem quiser semear troca. Nada muda para a mesa em uso normal.

**Por que entra aqui e não no harness.** O teste-espelho (`03-respostas.md` §1.1.1) foi decidido em
02/09 para **comparar as rolagens também**, e não só os números determinísticos: a página roda com a
mesma semente do harness e o espelho confere dado a dado. Sem este ponto de injeção o espelho provaria
só que os dois lados **contam** igual, e não que **rolam** igual. O harness precisaria dele de
qualquer forma (§2.1).

**Cuidados.** `mesa-ficha.ts:133` (`rolarIniciativaPC`) e `artes-grid.ts:1342` têm o mesmo
`Math.random` embutido e precisam do mesmo tratamento, senão a iniciativa e o dano de Arte continuam
fora da semente. `mesa-core.ts:28` também tem, mas é geração de id e não entra na conta.

**Prova.** O próprio teste-espelho: com a mesma semente dos dois lados, as rolagens têm de bater.

---

### A ordem, o critério de aceitação e a prova de inércia (decididos em 02/09, corrigidos em 02/09)

**A ordem é: bandeiras primeiro** (`04-prontidao.md` §D5). A razão é que os furos estão na mesa
**hoje**: a Margem que não entra no dano e o escudo que só penaliza são defeitos de um jogo que está
rodando. Uma consequência forçada pela dependência: **as seis bandeiras do núcleo (`n1` a `n6`) não
podem vir antes das regras que elas ligam**, então "bandeiras primeiro" são as **nove** que não
dependem do núcleo (as oito de regra publicada mais o `porRodada`), e as seis do núcleo entram junto
com N1 a N6, no item seguinte.

**Mas antes das bandeiras vem a instrumentação, e isso é a correção de 02/09** (`05-fechamento.md`
§1). A prova de inércia da D4 é uma cena-espelho, a cena-espelho compara dano, e `rolagem.ts:11` é
`Math.random`: sem semente, a comparação não distingue "a bandeira mexeu" de "o dado caiu diferente".
Então o **item 12 precede o item 11**, e como o 11 é o primeiro pela D5, o 12 precede a ordem
inteira. Procurando pelo mesmo padrão nos doze itens (prova cujo instrumento não existe naquele ponto
da ordem), saíram **dez dependências**, listadas no `05-fechamento.md` §1.2. As quatro que mudam a
ordem estão absorvidas abaixo.

#### Etapa 0 · Instrumentação

Nada é provável antes dela, e ela não muda comportamento nenhum.

**FEITA em 02/09**, no commit `ce5486f`. O relato está em `06-etapa-0.md`, e a ordem interna abaixo
saiu corrigida de lá.

| | O que | Por quê |
|---|---|---|
| **0.1** | **Item 12 · a semente**, num ponto de injeção só (`acaso.ts`, puro), usado por `rolagem.ts:11`, `mesa-ficha.ts:133` (a iniciativa) e `artes-grid.ts:1342` (o dano de Arte). O quarto ponto, o sorteio do último critério de N4, **nasce já usando o `acaso`**, porque N4 é da Etapa 2 | sem ela, os espelhos comparam ruído, e as provas dos itens 2, 4 e 6 dependem de sorte |
| **0.2** | **O caminho do driver até a semente**: a página aceita `?semente=N` e `?despejo=1`, como já aceita `?tempo=simultaneo` | o item 12 injeta no módulo, e nada ligava o módulo ao `puppeteer` que dirige a página. A leitura da URL fica na página, para o `acaso.ts` continuar puro e empacotável em Node |
| **0.3** | **O despejo por Tick** em `window.__DESPEJO`: agenda, fase, Defesa perdida, posição, iniciativa e fila. **Falta a resolução** e o que a folha calculou, que só existem dentro do modal e entram com o item 6 | é o instrumento dos dois espelhos **e** da prova do item 6 |
| **0.4** | **A branch congelada** (`sim/base-congelada`), cortada **por último**, do commit da Etapa 0 | ela continua com **prazo** (depois da primeira bandeira o estado de referência não existe mais), mas não pode ser a primeira: cortada antes da semente, o lado dela rolaria com `Math.random` e o espelho voltaria a comparar ruído. **Esta é a correção de 02/09** (`06-etapa-0.md` §1) |

#### Etapa 1 · O carimbo do perfil, e depois as nove bandeiras que não dependem do núcleo

> ## ⚠ O item 1.0 foi dado como FEITO e não está feito (03/09)
>
> **O 1.0 entregou o carimbo, a migração e a tela, e não entregou a única coisa que fazia o
> carimbo valer: alguém que leia o perfil na hora de aplicar a regra.**
>
> O perfil é gravado, viaja no encontro, aparece na tela, é comparável e é recarimbável. E é lido
> em **um** lugar do código de produção, `grid.astro:8139`, onde ele é copiado para dentro da
> entrada do lance (`perfil: { ...REGRAS_CENA }`), para o oráculo. O tipo existe em `lance.ts`
> (`perfil?: Record<string, boolean>`) e **`entrada.perfil` não é consultado em lugar nenhum**:
> nem em `resolverGolpe`, nem em `quase-acerto.ts`, nem em `calc.ts`, nem no harness. **Nenhuma
> das quinze bandeiras faz o motor tomar um caminho diferente.**
>
> **A infraestrutura da comparação de regras existe inteira e não está conectada ao motor.**
>
> **E o desenho de 112 células pressupunha um mecanismo que não existe.** Sessenta e oito delas
> existem para medir bandeiras, e hoje todas dariam **zero por dois motivos indistinguíveis**: ou
> a regra não morde naquela cena (o zero legítimo, que é informação), ou a regra não roda em cena
> nenhuma (o zero vazio, que não é). Os dois saem com o mesmo valor no CSV e nada na leitura os
> separa.
>
> **Ninguém percebeu em sete rodadas de documento**, e o motivo é mecânico e não de atenção:
> **todos os relatórios rodaram com tudo desligado, e tudo desligado é o único estado em que a
> ausência do mecanismo é invisível.** Com o perfil todo `false`, "a bandeira está desligada" e "a
> bandeira não é lida" produzem exatamente o mesmo comportamento, o mesmo número e o mesmo log. O
> primeiro `true` teria acusado na primeira batalha.
>
> A `notaEstado` do perfil em `regras.json` chegou perto disso e parou na metade: ela diz que
> nenhuma bandeira está ligada no motor, e trata isso como estado transitório de três delas. É o
> estado das quinze, e não é transitório, é um item de Etapa que ficou por fazer.

**1.0 · O carimbo, antes da primeira bandeira.** Uma coluna `encontros.perfil jsonb`, escrita **uma
vez** na criação do encontro e lida por ele dali em diante. Sem ela, um deploy troca o `regras.json`
debaixo de um encontro aberto e a Defesa de uma peça muda entre dois Ticks da mesma cena, que é o
quarto sinal do risco **F0** e o único que nenhum teste pega. Se a primeira bandeira subir antes do
carimbo, ela sobe para uma mesa desprotegida, e por isso este é o item 1.0 e não o 1.10. Três
propriedades, e a terceira foi acrescentada no fechamento final:

- **zero gravação por Tick.** Uma escrita na criação do encontro, mais uma por recarimbagem
  deliberada. A leitura sai da linha do encontro, que já está carregada, e a comparação com o perfil
  de produção é entre esse `jsonb` em memória e o `regras.json` que já vem no pacote. Nenhuma
  consulta nova, nem no avanço do Tick nem fora dele;
- **visível.** O perfil carimbado aparece na tela do encontro, e diz quando ele **difere** do perfil
  de produção. Sem isso o congelamento é invisível, e um encontro esquecido roda o perfil antigo para
  sempre sem ninguém entender por que o Bloqueio "quebrou";
- **recarimbável.** O mestre pode recarimbar de propósito, com o perfil corrente, numa ação
  explícita. É o que transforma o carimbo de armadilha em ferramenta: quem quiser as regras novas
  numa cena velha aperta o botão, e quem não quiser não é atropelado no meio de um Tick.

**1.1 · O despejo da resolução, antes da primeira bandeira** (decidido em 02/09). O despejo da Etapa
0 cobre agenda, tempo, geometria e rolagens, e **não cobre dano**: veredito, `errouPor`, Absorção e
líquido só existem dentro do modal da folha. Sem ele, `margem` e `gate`, que são as duas que mais
mexem em dano, entrariam **sem prova de inércia completa**, que é pagar o pior caso do F0 com as
piores candidatas. Ele não é trabalho extra: já é pré-requisito do espelho de motor, do item 6 e da
prova da semente dentro de uma resolução. O que ele antecipa do N6 é o **levantamento** dos pontos de
leitura ao vivo, e não o retrato (`06-etapa-0.md` §3.4).

**1.2 a 1.10 · As nove bandeiras**, cada uma com o espelho de inércia contra a branch da Etapa 0, e
`test-contrato.mjs` / `test-quase-acerto.mjs` reescritos **no mesmo commit** da bandeira que os
invalida.

##### O que mais foi desenhado em cima da premissa que não se sustenta

Não é só a grade. Cinco construções desta pasta foram desenhadas para medir algo que hoje não
roda, e todas continuam corretas **como desenho** e inertes **como medida**:

| construção | onde | o que ela pressupõe |
|---|---|---|
| **as células hospedeiras** | §0.10.1, a tabela "onde mora cada bandeira" | que ligar a bandeira muda o resultado NAQUELA cena. Hoje não muda em cena nenhuma |
| **a referência única do F5** | `04-prontidao.md`, e as seis medidas duas vezes | que o delta da hospedeira contra a âncora extrema mede a bandeira. Hoje os dois lados dão o mesmo número |
| **a soma de aditividade** | a comparação da soma dos deltas com o perfil todo-ligado | que existe um perfil todo-ligado diferente do todo-desligado. Hoje eles são o mesmo jogo |
| **o contador de ocasiões por bandeira** | a prova de que a bandeira mordeu | é o único que **sobrevive intacto**, e vira o instrumento que detecta o problema: ele daria zero, e o zero dele é inequívoco |
| **as três células da mediana** | a fatia de leitura do OFAT | que a mediana separa perfis. Hoje não há perfis a separar |

**O que NÃO cai junto**, e é o que a frente produziu de sólido, porque nada disto depende de
bandeira nenhuma:

- **as métricas de carga** por Tick, por golpe e por gesto, com a tabela de custo de tela;
- **a partição de quatro estados do Tick** (o quadro `nada` / `só resolveu` / `só parou` / `ambos`)
  e os quinze invariantes que a fecham;
- **os três termos da conclusão** (`09` §2.3): 50% classe iii, 33% o ⏭, 17% classe ii;
- **os 11,4% do Tick morto** e a banda do avanço automático (`09` §2.4);
- **o resultado do limiar de fuga** e a conclusão de desenho que saiu dele (`09` §3.1).

Isso não é consolo: é a linha que separa as duas frentes da seção seguinte.

#### Etapa 2 · O núcleo do Tick

Nesta ordem, que é a das dependências e não a da numeração: **item 1** (N1) → **item 3** (N2, que só
é observável com N1 ligada) → **item 4** (N3) → **item 2** (N4) → **item 5** (N5, que precisa da
cadeia do 2 para ter uma "ordem inversa") → **item 6** (N6). As seis bandeiras do núcleo entram
junto. Os quatro pontos de código são `agendaSimultanea`, `grupoDaVez`, `golpeMaisCedo` e a leitura
do retrato na folha.

#### Etapa 3 · A migração 30 (item 7) e a tela (itens 8 e 9)

O item 6 **não** depende da migração: o retrato ficou em memória (§0.8.2), e a frase antiga ("o 6
depende dela se o retrato for para o banco") caiu junto com a coluna.

#### Etapa 4 · O item 10 (Q7, as condições que expiram), que é isolado

**O critério de aceitação** para a fase estar pronta: **`npm run build` verde, mais o espelho de
inércia em cada bandeira, mais as provas item a item** que cada um dos doze já tem escritas. Fica
registrado o que isso deixa de fora: **N7 e N8 não terão verificação nenhuma**, porque "o jogador vê
a intenção do outro" e "o rastro é legível" não são asserções automatizáveis. Se elas forem
verificadas, será por uma sessão de mesa, que não faz parte deste critério.

**O espelho eram dois, e essa é a segunda correção de 02/09.** O critério anterior pedia "o
teste-espelho sem divergir em nenhum campo" para declarar a fase pronta, e o teste-espelho compara a
mesa com **o motor do harness**, que pela §0.6 só é escrito depois. O critério exigia um artefato da
fase seguinte. Separando:

| | **Espelho de inércia** | **Espelho de motor** |
|---|---|---|
| Compara | a mesa contra a mesa da branch congelada | a mesa contra o motor do harness |
| Prova | que a bandeira desligada não mexeu em nada (D4) | que a cópia não divergiu do original (Q6) |
| Precisa de | a Etapa 0 | a Etapa 0 **mais o harness** |
| É portão de | **cada bandeira, uma a uma** | **a bateria** |

Os dois usam a mesma cena fixa, a mesma semente e o mesmo comparador de campos da
`03-respostas.md` §1.1.1. O que muda é quem está do outro lado.

**A prova de que uma bandeira desligada é inerte** é o espelho de inércia contra a **branch
congelada**, caindo para o espelho do commit anterior se a branch não for viável. A branch é melhor
porque não anda com a história do git: um conserto legítimo que entre junto com uma bandeira não faz
a comparação falhar por motivo certo.


---

## 0.7 A linha de base, o Fôlego e as quinze bandeiras

Decidido em 02/09, depois do `03-respostas.md`.

### A rota: bandeiras, e uma bateria mede os dois lados

N1 a N6 entram na mesa **já chaveadas**, somando-se às de D2, e uma bateria só mede o perfil cheio e
cada regra isolada. O que a rota custa e o que perde está na `03-respostas.md` §2.4; o que ela ganha
é que as regras entram agora, os furos da R2 fecham antes da primeira medição, e cada regra recebe o
seu próprio número em vez de ser medida em bloco.

**N5 é a única das seis que não isola inteira, e a saída é medir só a metade que dá.** A
`03-respostas.md` §2.1 mostra por quê: hoje não existe laço a inverter, então "sem as três fases" não
é um comportamento, é a ausência de uma regra. **Decidido em 02/09: as três fases entram fixas, e a
bandeira `n5` cobre só a ordem inversa**, cujo desligado é real e observável (a ordem da faixa, por
Tick). Mede-se o que dá para medir e não se inventa passado.

### O Fôlego fica de fora

A régua está inteira em `regras.json → derivados.folego` (atacar e correr gastam, defender e parar
recuperam +Vigor por Tick, cada golpe custa o Fôlego cheio da arma, "Tomar Fôlego" é ação de
Velocidade 5, abaixo de 25% do pool são −1d6 e em 0 é exaustão), as 26 armas têm o campo (leve 15,
médio 24, pesado 38) e `calc.ts:85` calcula a reserva. **Nada no combate gasta um ponto**, e
`src/lib/modulos.ts` já diz `folego: false`, com a justificativa escrita de que é módulo avançado.

**Decidido: a simulação mede o jogo que se joga, e o Fôlego não entra.** Fica registrada a
consequência, que não é pequena: **o Fôlego é o único freio que o sistema tem numa perseguição e numa
sequência de golpes.** Sem ele, correr é grátis para sempre, e o eixo E4 (o alvo mais rápido que
nunca é alcançado) mede um estado permanente em vez de uma corrida que termina por exaustão. É por
isso que a regra dos 10 Ticks da §0.1 precisa existir: ela faz o papel que o Fôlego faria.

### A Mana do Conjurador, e um teste que sai daí

A reserva **não volta em cena**: `arcano.recuperacaoMana` é Centelha por hora, e o dobro em descanso.
O Conjurador tem orçamento finito por batalha.

**Decidido: ele raciona, alternando ataque comum e Arte.** A regra concreta, com os números marcados
como invenção ⚑, entra na política da §0.4 P4:

1. se um aliado está abaixo de 50% de Vida, no alcance, e há Mana: Cura;
2. se há Mana **acima de 30% da reserva**: a regra de escolha de Efeito da §0.4 P4 (zona para dois ou
   mais agrupados, projétil para um, empurrão para quem encostou);
3. se há Mana **abaixo de 30%**: alterna, conjurando só a cada segunda ação e atacando com a adaga
   nas outras;
4. sem Mana: ataca com a adaga pelas regras do Agressivo.

**E fica anotado como um teste da bateria, e não como um pressuposto: a reserva de Mana é pequena
demais para os combates?** As saídas do log que respondem são o Tick em que cada conjurador cruza os
30% e o zero, a fração das batalhas em que ele termina esvaziado, e quantas ações ele passa como
lutador de adaga. Se o conjurador estiver zerado na metade das batalhas antes do meio delas, a
resposta é sim, e é um achado sobre o sistema e não sobre o harness.

### As cinco condições de dano por rodada viram bandeira

`sangrando`, `envenenado`, `sufocando`, `em-chamas` e `morrendo` têm o campo `porRodada`, e no Grid
**ninguém o lê**: só `combate.astro:1439` (R2 §C4). **Decidido: vira bandeira, e a bateria roda com e
sem**, para ver como se comportam. Ela é relevante no recorte escolhido porque `brasa-retardada`, um
dos oito Efeitos âncora, põe `em-chamas`.

### As quinze bandeiras, e o desenho que as mede

| Grupo | Bandeiras |
|---|---|
| de D2 (§0.1) | `margem` · `gate` · `porte` · `bloqueio` · `modo2` · `teto6` |
| da Cura (§0.4 P1) | `curaSemArea` · `curaDivide` |
| do núcleo do Tick | `n1` (já é o parâmetro `decideEmValeDepois`) · `n2` · `n3` · `n4` · `n5` (só a ordem inversa) · `n6` |
| nova | `porRodada` |
| **fora** | o Fôlego, por decisão acima |
| **saiu em 02/09** | **`couraca`**, que não é bandeira de tempo de execução: ela é aplicada em **tempo de geração**, no `gen-bestiario.mjs:36-45` e L79-82, e já vem somada na `absorcao` de cada criatura do `monsters-mesa.json`. Ligá-la em tempo de execução somaria a couraça **duas vezes**, que é a armadilha de escrever por cima de arquivo gerado. Virou propriedade do elenco, medida pelo eixo E11 (`05-fechamento.md` §2.2) |

**Onde elas moram: num bloco novo do `regras.json`, e o manifesto da bateria passa a fazer hash de
`src/data` e de `src/lib`.** As razões, com o custo de cada alternativa, estão na conversa de 02/09 e
resumem-se a duas: `combate-tempo.ts` já importa `regras.json` e nada mais, então não entra
dependência nova e o empacotamento headless pega de graça; e o `dados_hash` do manifesto (§2.4) já
registra mudança em `src/data/*.json`, o que faz uma troca de bandeira ficar automaticamente anotada
na bateria que rodou com ela. O hash passa a cobrir `src/lib` também, para que mudança de código, e
não só de régua, fique registrada do mesmo jeito. O `src/lib/modulos.ts` continua sendo o que ele diz
que é: só tela.

São **15**, e o desenho é o **deixe-uma-de-fora** da `03-respostas.md` §2.2:

| Perfil | Quantos |
|---|---:|
| cheio | 1 |
| cheio menos uma, uma por bandeira | 15 |
| tudo desligado (a linha de base reconstruída) | 1 |
| **total, que é o número de níveis de E5** | **17** |

**Onde cada comparação roda**, corrigido em 02/09 (`05-fechamento.md` §2.4). As **seis do núcleo do
Tick** valem em qualquer cena e rodam **nas duas âncoras**; as outras **nove** rodam **cada uma na
célula em que ela morde**, pela tabela da §0.10.1. Medir `gate` numa cena de espadas de corte, ou
`curaDivide` numa cena sem conjurador, não produz linha de base: produz zero por construção, e gasta
célula. Era o caso de sete das dezessete comparações, em ambas as âncoras.

Duas coisas que esse desenho carrega e vale repetir: ele respeita sozinho a dependência entre `n1` e
`n2` (desligar `n2` a partir do cheio mantém `n1` ligada, que é a única configuração em que `n2` é
observável), e ele mede **efeito principal**, não interação: se a Margem e o gate se cancelarem, ou
se o Bloqueio só importar com a Couraça ligada, este desenho não vê.

---

## 0.8 Orçamento de tempo e não bloqueio

Requisito, não recomendação, e vale para tudo o que for escrito daqui em diante.

### 0.8.1 Na mesa: quantas gravações cada mudança acrescenta por Tick

A conta de referência está medida: hoje o avanço vazio custa **2 idas ao banco** (o relógio e a
campainha), de 2 a 40 peças, e cada peça em trajeto acrescenta **~2,3** (`03-respostas.md` §5.2).
O alvo é que nenhuma das mudanças mexa nesse número.

| Mudança | Gravações que acrescenta por Tick | Por quê |
|---|---:|---|
| **N1** · `inicio = tickDecl` | **0** | é o valor de um parâmetro dentro de `agendaSimultanea`, uma função pura |
| **N2** · a guarda olha `desde` | **0** | `grupoDaVez` lê estado que já está em memória (`COMBS`, `TOKENS`) |
| **N3** · o golpe de quem caiu | **0** | idem, `golpeMaisCedo` é leitura de memória |
| **N4** · a ordem de declaração | **0** | é um comparador sobre a lista que já está em memória |
| **N5** · fases e ordem inversa | **0** | reordena **quando** as coisas acontecem; não cria acontecimento novo |
| **N6** · o retrato | **0** | memória, por decisão (§0.8.2). O aviso de saída também é zero: é tela |
| **N7 e N8** · a máscara | **0** | é `case ... end` dentro da view; o custo é do Postgres na leitura que já acontece |
| **N8** · `acao.mirado` | **0** | é um campo a mais no `jsonb` da declaração, dentro de um `update` que já existe |
| **N8 na tela** · o rastro | **0** | pintura |
| **A fila de declaração na tela** | **0** | pintura, sobre a lista que já está em memória |
| **Q7** · expirar condições | **0 na maioria dos Ticks** | ver §0.8.3 |
| As 9 bandeiras de regra publicada | **0** | todas mudam aritmética **dentro** da resolução, que já grava. `margem` muda o número do dano; `gate` pode zerá-lo; `bloqueio` muda a Defesa comparada. Nenhuma acrescenta uma escrita, algumas **tiram** (o gate que zera o dano dispensa o `update` de `pv_atual`) |
| `porRodada` | **0 em 5 de cada 6 Ticks** | ver §0.8.4 |

**Todas as oito regras novas e treze das quinze bandeiras acrescentam zero.** As duas que não são
zero por construção (a expiração de condições e o `porRodada`) estão detalhadas abaixo, e nenhuma
delas fica no caminho do avanço comum.

### 0.8.2 O retrato de N6 é leitura em memória

**Confirmado na especificação** (§0.6.1 item 6): o retrato é um objeto montado no fim da fase de
declaração a partir do que **já está em `COMBS`, `TOKENS` e `RESUMO`**, e lido pela fase de resolução.
Nenhuma consulta, nenhuma gravação.

A especificação anterior propunha uma coluna `encontros.retrato jsonb` para o retrato sobreviver a
recarregar a página, e **isso violaria este orçamento**, porque seria uma gravação por Tick.
**Decidido: memória, e a tela avisa na saída.**

- O retrato vive na página. Recarregar no meio da fase de resolução o perde e o refaz a partir do
  estado corrente, o que significa que as resoluções já aplicadas naquele Tick entram na base das que
  faltam. É um erro limitado e da mesma família dos cinco que a R2 §B já registrou.
- Para estreitar a janela sem custar Tick, **a tela avisa quem tentar recarregar ou sair no meio da
  fase de resolução** que há golpes por resolver. É aviso de saída, e não gravação nem trava de
  banco: zero idas ao banco, zero espera, e o botão ⏭ já está desligado nesse instante de qualquer
  forma (`instanteDeGolpe`, `grid.astro:4174`), então o aviso e o botão contam a mesma coisa ao
  mestre por dois caminhos.

### 0.8.3 O custo da expiração de condições (Q7)

**A varredura por Tick é leitura em memória.** As condições vivem em `combatentes.condicoes`, um
`jsonb` que já está carregado em `COMBS`. Varrer é `peças × condições da peça`, com as 55 condições
do catálogo e uma peça carregando tipicamente 0 a 3: numa cena de 10 peças são algumas dezenas de
comparações de inteiro por Tick, que é ruído ao lado dos 30 ms medidos.

**Escrita só quando alguma condição de fato vence**, e nunca por peça sem mudança:

- o varredor monta a lista de peças cujo `condicoes` mudou;
- se a lista está vazia, **não há nenhuma ida ao banco**, que é o caso da esmagadora maioria dos
  Ticks (uma condição posta por Arte dura `turnos × 6` Ticks, então ela vence uma vez a cada seis no
  melhor caso);
- se não está, é **um `update` por peça que mudou**, com o `condicoes` inteiro, e não um por condição.

### 0.8.4 O custo de `porRodada`

Cobrar dano por rodada é, por definição, um evento de **turno**, e o turno tem 6 Ticks
(`TICKS_POR_TURNO = 6`, `artes-grid.ts:81`). Então: **zero gravação em 5 de cada 6 Ticks**, e no
sexto, um `update` de `pv_atual` por peça que tem alguma das cinco condições. Numa cena em que
ninguém está sangrando nem em chamas, é zero sempre. É exatamente a mesma escrita que o mestre faz
hoje à mão pelo "tirar Vida", com a diferença de que ele esquece e o motor não.

### 0.8.5 Nada de bloqueio no avanço

**Regra:** nenhuma das mudanças pode introduzir bloqueio otimista, `lock`, transação longa ou espera
síncrona no caminho do avanço do Tick. O relógio já é o gargalo único da cena (é o único motor do
Simultâneo, R2 §B#11), e qualquer espera nova ali para a mesa inteira, não só a peça envolvida.

Isso tem uma consequência concreta na especificação: **N6 não pode ser implementado com transação.**
A tentação seria envolver a fase 3 inteira numa transação para o retrato ser atômico; o preço seria
segurar a cena por todas as resoluções do Tick. O retrato em memória (§0.8.2) evita isso por
construção.

E vale registrar o que **já** existe de espera no caminho e não é mexido por nada disto: o
`await voarProjetil` da animação (`grid.astro:6861, 7088`) segura a resolução do golpe pelo tempo da
imagem. Não é bloqueio de banco, é bloqueio de tela, e é anterior a esta rodada.

### 0.8.6 O risco medido do `mesa_arenas` (Pendências I2)

**Não é para consertar agora, e fica registrado como risco com número.**

O registro da arena é um `jsonb` reescrito inteiro a cada linha de log (`Pendencias.md` I2: "a
ESCRITA continua subindo o array todo, até uns 45 KB, a cada peça movida"). Medido em 02/09
(`03-respostas.md` §5.2): com **2 peças em trajeto**, `update:mesa_arenas` aparece **2,0 vezes por
Tick**, ou seja **uma reescrita por peça que se move**.

| Perseguidores em trajeto | Reescritas do array por Tick | Volume por Tick, no teto de 45 KB |
|---:|---:|---:|
| 1 | 1 | 45 KB |
| 2 | 2 | 90 KB |
| 5 | 5 | 225 KB |
| 10 | 10 | **450 KB** |

**Por que isso importa para esta frente e não é só uma pendência antiga:** o cenário que a bateria vai
medir mais é justamente o de muitas peças em trajeto (o eixo E2, distância inicial, com quatro níveis
e o mais longo a 71 hexes), e é nele que o custo é pior. Se a bateria disser que perseguição é o caso
comum, esta linha vira a primeira coisa a consertar depois.

### 0.8.7 No harness

| Regra | Como |
|---|---|
| **Log fora do caminho quente** | os eventos da §2.5 vão para um array em memória durante a batalha. **Uma gravação por batalha**, no fim dela, anexando as linhas ao `.jsonl` da célula. Nunca por evento, nunca dentro do laço do Tick |
| **Invariantes fora do caminho quente** | conferidos em memória, sobre o estado que o laço já tem. A violação não grava nada na hora: marca a batalha e deixa o registro para a mesma gravação do fim |
| **Sem I/O no laço** | nenhuma leitura de arquivo, nenhuma rede, nenhum `console` por evento. Os JSONs de dados são lidos uma vez no início da bateria e ficam em memória |
| **Teto de segurança** | 2.000 Ticks, e a batalha que estoura sai marcada `estourou`, no balde próprio, sem travar a bateria e sem entrar em média nenhuma |
| **Paralelismo** | a semente já é `hash32(semente_mestre, cenario_id, repeticao)` (§2.4), ou seja **cada batalha é independente de todas as outras por construção**. Um processo recebe uma faixa de índices de batalha, calcula as próprias sementes e escreve o próprio arquivo `.jsonl`; nada é compartilhado e nada precisa de trava. Os arquivos são concatenados no fim, e a ordem entre eles não importa porque cada linha carrega o `b` da batalha |
| **Paralelismo: PROCESSOS, e nunca linhas de execução** | **é restrição, e não preferência.** O `acaso.ts` guarda a fonte num `let` de módulo, o que é o certo para a página (uma cena por aba) e é uma armadilha aqui: com `worker_threads` ou `Promise.all` **no mesmo processo**, duas batalhas dividem a mesma fonte, consomem a mesma sequência intercalada e o determinismo por batalha morre **em silêncio**, sem erro e sem teste vermelho. Um processo por faixa de índices, e pronto. **E o motor do harness não usa o global**: ele recebe a própria fonte como parâmetro, do mesmo jeito que recebe a semente, e o `semear()` do módulo fica sendo o que ele é hoje, o caminho da **página** |

**Um número para dimensionar:** a §2.5 estima 100 a 150 registros por duelo, ~120 bytes cada. Uma
batalha guarda algo entre 12 e 18 KB em memória antes de gravar, e a bateria inteira de 56.000
batalhas gera da ordem de 600 MB de log completo. Por isso a §2.5 já previa dois níveis de saída:
log completo para uma amostra declarada, contadores agregados para todas.

### 0.8.8 O teste-espelho, com o tempo medido

**Fica fora de `npm run validate` e fora do `build`**, porque precisa do Edge dirigido e do servidor
de desenvolvimento. Mora ao lado de `test-grid-simultaneo.mjs` e é chamado por `npm run smoke`.

**Medido em 02/09**, dirigindo a cena que o espelho usaria (2 peças, `?tempo=simultaneo`, declaração
de ataque com deslocamento, e o despejo por Tick dos campos que ele compara):

| Etapa | Tempo |
|---|---:|
| subir o dev server | 5,5 s |
| abrir o navegador | 0,6 s |
| carregar a cena | 3,0 s |
| declarar o ataque | 1,1 s |
| dirigir os avanços | 30 ms cada |
| **total, sozinho** | **10,7 s** |

**O custo é quase todo fixo**, e por isso o número que importa é o outro: se o espelho entrar na suíte
que já existe, que sobe **um** dev server para as três cenas dela, o custo marginal é
`carregar a cena + declarar + avanços`, ou seja **cerca de 4 a 5 segundos**. A suíte hoje leva 39,9 s
para 3 cenas; com o espelho passa a algo em torno de 45 s.

---

## 0.9 A varredura das contradições

A regra do cabeçalho ("decisão anotada dentro de um relatório não vale; o que vale vem do chat")
existe porque a série acumulou pontos em que um documento afirma **decidido** e outro lista o mesmo
assunto como pergunta em aberto. Varri os quatro atrás desse padrão. Foram **oito**, e a última
coluna diz o estado de cada uma.

| # | A contradição | Onde | Estado |
|---|---|---|---|
| 1 | O teste-espelho compara o dado rolado? A `03` §1.1.1 registra "Decidido em 02/09: semeia o `d6`", e a §6.1 do mesmo arquivo continua fazendo a pergunta | `03` §1.1.1 × §6.1 | **fechada:** a §6.1 passou a dizer RESPONDIDA e a apontar para a §1.1.1 e para o item 12 da §0.6.1 |
| 2 | O golpe fora de alcance (V5) vira regra? A `03` §3.1 registra a decisão na própria linha do invariante, e a §6.3 continua perguntando | `03` §3.1 × §6.3 | **fechada:** a §6.3 passou a dizer RESPONDIDA |
| 3 | Qual é a rota da linha de base? A `02` §0.7 registra "Decidido: bandeiras", e a `03` §2.4 apresenta as duas rotas como **DECISÃO SUA** e não escolhe | `02` §0.7 × `03` §2.4 | **fechada:** a rota é a **B**, confirmada no chat, e a grade oficial e o piloto único estão na §0.10. A `03` §2.4 ganhou a nota |
| 4 | E6 tem cinco ou seis políticas? A `03` §1.3 responde "seis" e a §1.4, três parágrafos abaixo, transforma a cega em interruptor e devolve o eixo a cinco | `03` §1.3 × §1.4 | **fechada:** são **cinco**, a §1.3 foi corrigida e o 02 §0.5 já estava certo |
| 5 | Quantas células tem a grade? A `03` §1.2 responde "60", e ela cresceu duas vezes depois disso | `03` §1.2 × `02` §0.10 | **fechada:** a grade oficial é a da **§0.10.1**, com **112 células** depois da recontagem de 02/09, e a `03` §1.2 ganhou a nota dizendo o que mudou |
| 6 | N5 fica de fora da linha de base? A `03` §2.4 diz que sim "de qualquer jeito", e o 02 §0.7 já resolve com a bandeira cobrindo só a ordem inversa | `03` §2.4 × `02` §0.7 | **fechada:** a linha da §2.4 foi corrigida |
| 7 | O retrato de N6 é gravado ou é memória? O item 6 da §0.6.1 propunha a coluna `encontros.retrato jsonb`, e a §0.8.1 proíbe gravação nova no avanço | `02` §0.6.1 item 6 × §0.8.1 | **fechada:** memória, e a tela avisa na saída (§0.8.2). A migração 30 perdeu a coluna |
| 8 | O cabeçalho lista como abertas as perguntas 2, 4 e 5 da `03`, mas as 1 e 3 estavam decididas no corpo da `03` e ainda abertas na §6 dela | `02` cabeçalho × `03` §6 | **fechada** pelas linhas 1 e 2 desta tabela |

**As oito estão fechadas.** As duas últimas dependiam de resposta do chat, e ela veio.

Duas observações que a varredura deixou, e que valem para as próximas rodadas:

- **O padrão é sempre o mesmo:** uma decisão é tomada e registrada no lugar onde o assunto foi
  discutido, e a lista de perguntas que originou o assunto não é atualizada. Sai barato se, ao
  registrar uma decisão, a própria pergunta que a originou for marcada na hora.
- **A `03` é um relatório de rodada, e não um documento vivo.** Ela responde perguntas de um instante,
  e envelhece por natureza. O canônico é este arquivo; a `03` é citada e não mandada. As notas
  acrescentadas nela dizem isso em cada ponto que envelheceu.

---

## 0.10 A grade oficial e a célula piloto, pela rota B

A rota escolhida é a **B**: N1 a N6 entram na mesa já chaveadas, somando-se às de D2, e **uma bateria
só** mede o perfil cheio e cada regra isolada. Isso torna a grade da §0.5 a grade oficial e o piloto
um só.

### 0.10.1 A grade oficial

Refeita em 02/09 com as respostas da `04-prontidao.md` (**duas âncoras**, D1, e **dois níveis de
controle**, D6 e D7) e recontada no mesmo dia com as do `05-fechamento.md` (**o elenco ganhou
criaturas**, D10, e **sete comparações de bandeira não podiam morder na âncora**, §2.2).

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

**Por que não estourou o orçamento de leitura.** A §3 nunca limitou a grade por máquina: *"o
orçamento não é a máquina, é o que se consegue ler"*, com o aviso de que 144 células já são mais
tabelas do que se lê numa sentada. Aquele aviso contava célula como linha, porque a grade era
fatorial. Aqui a segunda âncora **não custa uma linha nova, custa uma coluna**, e o núcleo cruzado se
lê como três grades e não como 48 linhas. O leitor enfrenta 3 grades de 4×4 e cerca de 50 linhas de
comparação. O que quase reprovou não foi a âncora dupla: foi medir as bandeiras duas vezes cada em
células onde catorze das comparações davam zero por construção.

**As duas âncoras.** Ambas 3×3, distância média (18 hexes), campo aberto, política **Agressiva**,
com leitura, elenco PC × PC, perfil de bandeiras cheio, e a peça que entra no meio da cena
**declarando no Tick seguinte** (o nível do meio de E10, que é a regra corrente da §0.46).

| | E1 | Arquétipos |
|---|---|---|
| **mediana** | nível (b), vizinhos: ciclo 5 contra ciclo 6, m.m.c. **30** | Duelista élfico de espada curta contra Escudeiro humano de espada longa |
| **extrema** | nível (a), uníssono: ciclo 6 dos dois lados, m.m.c. **6** | Escudeiro contra Escudeiro |

**As duas diferem em exatamente uma coisa, e isso é requisito, não estilo.** A pergunta que a âncora
dupla existe para responder é *"o efeito de cada fator depende de a cena ser extrema?"*, e ela só tem
resposta se a única diferença entre as duas for E1. A versão anterior desta tabela dava política
Cautelosa a uma e Agressiva à outra, o que misturava as duas causas em toda comparação. A Cautelosa
continua medida: é um dos quatro níveis de E6, em volta de cada âncora.

A mediana existe para os eixos terem espaço de se mexer; a extrema, porque o uníssono é o caso mais
comum de mesa de verdade (159 das 309 criaturas atacam com ataque leve, e uma horda do mesmo bicho
golpeia em uníssono para sempre).

**Duas ressalvas escritas.** No nível (b) o **Duelista luta só com a espada curta**: a empunhadura
dupla acrescentaria um segundo fluxo de golpes e apagaria o ciclo que E1 quer medir, então ela não é
exercitada nas âncoras. E a política Agressiva **nunca aborta**, então o caminho de abortar só é
exercitado pelo nível Cauteloso de E6.

**Onde mora cada bandeira**, porque medir uma bandeira numa célula em que ela não morde produz zero
por construção.

> **REGRA GERAL, E NÃO NOTA DE UMA CÉLULA: nenhuma bandeira entra na grade antes de existir
> caminho de produção que a chame.** Varrida em 03/09 (o **L25** do `Pendencias.md`), e o
> resultado é que **as quinze estão nessa situação**, e não só o `gate`. O perfil é lido em UM
> lugar do código (`grid.astro:8139`) e lá ele é **gravado dentro da entrada do lance**, para o
> oráculo; o tipo existe em `lance.ts` e **`entrada.perfil` não é consultado em lugar nenhum**,
> nem em `resolverGolpe`, nem em `quase-acerto.ts`, nem em `calc.ts`, nem no harness. A
> `notaEstado` do perfil em `regras.json` já dizia isso de três delas.
>
> **Ligar qualquer uma hoje mediria zero pelo motivo errado**: não porque a regra não vale naquela
> cena, mas porque ela não roda em cena nenhuma, e esse zero sai **idêntico** ao zero legítimo das
> leituras de referência. São 68 das 112 células medindo zero por dois motivos que a leitura não
> separa.
>
> **A ordem obrigatória, então, é: ligar a chamada no motor, provar que ela morde com um contador
> de ocasião, e só depois medir a bandeira.** O contador de ocasião é o mesmo mecanismo dos
> alarmes da bateria (§5): uma bandeira cuja ocasião nunca dispara é uma linha de relatório que
> não diz nada, e foi assim que o eixo E4 morreu (D31).

| Bandeira | Célula em que ela morde | Por que não pode ser só a âncora |
|---|---|---|
| `n1` a `n6` | **as duas âncoras** | são o núcleo do Tick, e valem em qualquer cena |
| `margem` · `bloqueio` · `teto6` | **a âncora extrema**, e só ela: é onde elas mordem **e** é a referência única | o Escudeiro tem heater dos dois lados, e a Margem morde em qualquer acerto acima da Defesa. O `teto6` vai com um contador de quantas vezes o teto de fato mordeu |
| `gate` ⚠ **a chamada não existe** (L22, e vale para as quinze: L25) | a hospedeira do **Lanceiro de lança** (Perfuração 1, **modo único**) contra o **Montanteiro de placa completa** (`resistPerf` 3) | `gatePerfuracaoAbre` (`calc.ts:130-135`) só avalia o perfurante, e as armas das âncoras atacam de corte. **E a hospedeira não pode ser a do Conjurador**: a regra ⊕ do D11 manda trocar de modo exatamente ali, e o gate mediria zero pelo motivo oposto. A lança não tem modo secundário, então a regra ⊕ não dispara e o gate não tem como ser evitado |
| `modo2` | a hospedeira do **Conjurador de adaga** (Perfuração 0) contra a **malha** (`resistPerf` 1) | é a cena em que a regra ⊕ **dispara**: a adaga tem modo secundário, troca para o corte e paga os −2 e −1d6. A mesma regra que mata o gate aqui é o que torna o `modo2` mensurável |
| `curaSemArea` · `curaDivide` · `porRodada` | a hospedeira do Conjurador | nenhuma âncora tem quem conjure, e as cinco condições de dano por rodada vêm de Arte no repertório escolhido |
| `porte` | a célula **`E11 = PC × criatura`**, que já existe no OFAT | `porteAcerto` é diferença de porte, e num elenco de PC ela é 0 sempre |

**As seis de baixo são medidas duas vezes**, na hospedeira e na âncora extrema (decidido em 02/09, F5
do `04-prontidao.md`). A leitura da hospedeira é a que diz quanto a bandeira vale; a da âncora existe
para que **todos os deltas saiam da mesma referência** e a soma deles possa ser comparada com o
perfil todo-desligado. As seis leituras extras são **zero por construção**, e é justamente por isso
que a conferência de aditividade só tem força sobre as nove que mordem lá: `margem`, `bloqueio`,
`teto6` e as seis do núcleo do Tick.

**As hospedeiras, e onde elas desviam da âncora.** Elas copiam a forma da âncora extrema (3×3, 18
hexes, campo aberto, com leitura, peça entrando no Tick seguinte) e trocam só as peças, para os
números saírem na mesma escala. Duas desviam, e o desvio é declarado:

| Hospedeira | Desvia em | Etiqueta obrigatória no relatório |
|---|---|---|
| **do `gate`** · Lanceiro de lança × Montanteiro de placa completa | o **modo de término**: com `gate` ligado o Lanceiro nunca fere, e a batalha fecha por **desistência a 20%**, não por morte | `termina por desistência-20 · delta máximo por construção`. A célula responde "o `gate` morde", não "quanto ele custa numa cena normal" |
| **do Conjurador** · Conjurador de adaga × Escudeiro de malha | a **política**: é mista (Conjurador de um lado, Agressiva do outro). Com Agressiva dos dois lados ninguém conjuraria e as três bandeiras que ela hospeda voltariam a ser inertes | `política mista · o E6 não é comparável a partir dela` |

Uma hospedeira serve só para **deltas dentro dela mesma** (o perfil cheio contra o cheio-menos-uma,
na mesma célula) e nunca para comparação entre células, e é por isso que os dois desvios não
contaminam nada. E a etiqueta é **mecânica**: toda célula reporta a distribuição de `cena.fim.motivo`
(D2), e qualquer uma cujo motivo dominante seja diferente do das âncoras recebe a etiqueta, sem
depender de alguém prever qual será.

**Os seis cruzamentos deliberados:** E1(uníssono) × E3(horda) · E1(uníssono) × E4(assimétrico) ·
E2(muito longa) × E4 · E5 × E1(uníssono) · E9 × E10 · e **E11 × E3**, a horda de bicho contra os
PCs, que é a cena que a mesa de verdade joga.

### 0.10.2 O piloto, um só

| | |
|---|---|
| Onde | **as duas âncoras** (D1), porque o CV pode não ser o mesmo na mediana e na extrema |
| Quantas batalhas | **2.000** (o erro da estimativa do próprio CV é da ordem de `1/√(2n)`, ou ±1,6%, e sobra amostra para uma primeira leitura do p95) |
| O que se mede | o CV de **paradas do mestre por Tick**, que virou a métrica principal com a régua da §D8b (a por batalha mistura carga com duração) |
| E mais | **a variância do delta da bandeira `margem`**, nas duas âncoras, que é o que fixa o `n` das células de E5, separado do resto da grade (§2.4). O CV da métrica não serve para isso: quem decide a precisão de uma comparação é a variância da **diferença**, e o fluxo único a deixou maior |
| Mais | as duas células de cauda (uníssono com horda, e o alvo mais rápido), 500 batalhas cada |
| Quando | **depois** de N1 a N8 e das bandeiras estarem no motor: a duração muda com N1, e um CV medido antes descreve outro jogo |

**A regra de decisão, escrita antes de rodar:**

1. `n = teto( (1,96 × CV / 0,05)² )`, arredondado para a centena de cima;
2. piso de 400, que é a regra do p95, mesmo que o CV medido dê menos;
3. se o maior CV das quatro células piloto exceder o menor em mais de 0,15, **usa-se o maior para
   todas**, porque n desigual entre células desequilibra a comparação que é o objetivo da grade;
4. o `n` resultante substitui as 500 em toda a grade, e as 2.000 das células de cauda são
   recalculadas pela mesma proporção.

**O piloto também é o que dá base à previsão quantitativa de E1.** Os "37 a 47 Ticks" que a §3 usa
vieram da bancada, em outro sistema de tempo e sem mapa; o piloto é a primeira medida de duração de
batalha **no Simultâneo com geometria**, e é dela que sai quantas colisões cabem numa batalha.

### 0.10.3 O que fica sem medida por causa de N5

A bandeira `n5` cobre **só a ordem inversa** da resolução, cujo desligado é real e observável (a ordem
da faixa, por Tick). **As três fases entram fixas**, porque o estado desligado delas não é um
comportamento, é a ausência de uma regra (`03-respostas.md` §2.1). Fica sem número, então:

| O que não é medido | Por quê importa |
|---|---|
| **O que a fase de declaração separada comprou** | não há contra-exemplo: hoje o mestre declara e resolve intercalado, na ordem que quiser, e "intercalado" não é uma regra, é a falta de uma. Qualquer versão desligada seria invenção minha, e o número mediria a distância até ela |
| **Quanto da carga do mestre vem de a resolução estar agrupada no fim do Tick** | é plausível que agrupar as resoluções mude a sensação de interrupção sem mudar a contagem de paradas (dez caixas seguidas contra dez caixas espalhadas). A bateria conta as paradas e o pico por Tick; o que ela **não** consegue é comparar com o espalhado |
| **O valor de N7 contra um mundo sem fases** | E9 mede ler contra não ler, e os dois lados têm fases. Se a vantagem de informação só existe porque a declaração é uma fase, o eixo E9 mede o tamanho da vantagem e não a existência dela |

**O que isso não impede:** o pico de paradas num Tick, a distribuição de N(T), a colisão de agenda e
todas as métricas da §2.6 continuam medidas normalmente, porque nenhuma delas precisa do
contrafactual. E as outras cinco regras do núcleo (N1, N2, N3, N4 e N6) têm cada uma o seu número
isolado pelo deixe-uma-de-fora.

## 1. O que eu preciso de você

*Todas respondidas em 02/09. As respostas estão na §0; o que segue é o que cada opção significava.*

### D1 · O harness mede o Grid de hoje ou o Grid automatizado?

| Opção | O que o harness reproduz | O que muda no desenho |
|---|---|---|
| **1a · o Grid de hoje** | as 14 paradas de R2 §B acontecem todas, inclusive as 6 que são aritmética (classe **iii**). Cada uma vira um evento de consulta, respondido por uma política | o log precisa modelar **a caixa**: quantos campos ela mostra, quantos abrem em branco, quem seria consultado. Isso exige a tabela de custo de tela da §2.5, que é dado de fora, não saída de simulação |
| **1b · o Grid automatizado** | as 6 paradas **iii** somem: o motor resolve e não consulta ninguém. Sobram as **i** (decisão de jogador) e as **ii** (julgamento narrativo) | o log só registra decisão. A tabela de custo de tela vira desnecessária para 6 linhas, e a métrica principal passa a ser "quantas escolhas o jogo exige", não "quantas caixas abrem" |
| **1c · os dois, mesma batalha** | cada batalha roda duas vezes com a mesma semente, uma em cada perfil, e a diferença entre as duas **é** a medida do que a automação compraria | o registro de execução ganha um campo `perfil`, e todo evento de parada ganha `automatizavel: bool`. Custa o dobro de tempo de máquina, que pela R2 §D1 é irrelevante, e obriga a política a ser a mesma nos dois perfis, senão a diferença mede duas coisas |

**Bloqueia o começo.** Define o esquema do log (§2.5) e o que a §2.3 chama de "resolvida por regra
automática". Fica em branco esperando: as colunas `campos` / `editaveis` / `gestos` do log, e as três
métricas de gesto da §2.6.

### D2 · A simulação obedece o motor como está, ou as regras que faltam?

As sete divergências que mudam número (R2 §F, itens 1, 2, 5, 6, 7, 8 e 10), com a direção que cada
uma empurra a **duração** do combate, que é o multiplicador de toda a carga:

| Regra ausente | Direção na duração | Quem sente |
|---|---|---|
| Margem de dano (+1d6 a cada 6 acima da Defesa) | **encurta**, e muito: +47% num acerto com folga de 6 a 11 (R2 §F#1) | todos, sempre |
| Gate de Perfuração (abaixo do Nível, dano 0) | **alonga** contra armadura pesada, sem teto quando a arma não vence o Nível | flecha, lança e besta contra placa |
| Couraça de Porte | **alonga** contra bicho grande: 4 a 10 pontos por golpe nas 46 criaturas Enorme ou acima | quem caça monstro |
| Porte no acerto (±3 por categoria, teto ±12) | **encurta** contra o grande, **alonga** contra o pequeno | idem, nos dois sentidos |
| Bloqueio com arma e escudo | **alonga**: hoje o escudo é −2 a −4 de Defesa e nada em troca | quem carrega escudo |
| Modo secundário (−2 acerto, −1d6) | **alonga** um pouco, e apaga a jogada dominante de atacar sempre pelo tipo menos absorvido | todos |
| Teto de ±6 nos modificadores | **alonga** os casos extremos (hoje −10 é alcançável) | cenas com muitas condições |

| Opção | O que muda no desenho |
|---|---|
| **2a · o motor como está** | o harness é espelho fiel da mesa e mede a carga que o jogador sente **hoje**. Nada de novo precisa ser escrito, e a §2.1 não ganha nenhum caminho de código que a tela não tenha |
| **2b · as regras que faltam, ligadas** | são 7 regras a implementar **no caminho headless**. Se a tela não as ganhar junto, isso cria por construção o segundo caminho de código que a §2.1 existe para evitar, e a próxima auditoria vai listar sete divergências novas em vez das cinco de hoje |
| **2c · chaveável, e a tela lendo a mesma chave** | cada regra vira uma bandeira num objeto de perfil, lida pelo módulo extraído. A mesa passa a ler o mesmo objeto, com todas desligadas, ficando idêntica a hoje. O harness roda A/B e **a diferença entre 2a e 2b vira medida**, não opinião. Custo: a extração da §2.1 tem de vir antes, e inteira |

**Bloqueia o começo** para 2b e 2c; para 2a não bloqueia nada. Fica em branco esperando: o eixo E5
da §3, que tem 1 ou 2 níveis conforme a resposta.

### D3 · Quem decide pelos PCs, e com que política?

Hoje o robô só existe para criatura, só no Simultâneo, e faz duas coisas: ataca o inimigo de pé mais
próximo, foge abaixo de 25% de Vida (`decisaoAutomatica`, `combate-tempo.ts:880-892`).

| Opção | O que muda |
|---|---|
| **3a · o mesmo robô dos dois lados** | zero código de decisão novo. Mede uma mesa em que ninguém joga bem, e **colapsa o eixo tático**: todo mundo persegue o mais próximo, então a perseguição, que é a fonte de re-projeção, vira função só da geometria inicial e não da escolha |
| **3b · políticas declaradas como dado** | alguns perfis (agressivo, cauteloso, tocaiador, guarda-costas), cada um uma lista ordenada de regras "se X então Y". Vira um eixo do experimento (E6, §3). O repertório de cada política tem de sair da lista real de declaráveis: atacar em 4 manobras, mover em 3 modos, conjurar, abortar, esperar 1 Tick, "outra coisa" |
| **3c · política de um passo à frente** | a cada decisão avalia as opções declaráveis e escolhe a de maior dano esperado por Tick, descontando a Defesa que a escada vai custar. Mede o **teto** do sistema, o que um jogador ótimo faria, e não a mesa. Precisa de uma função de avaliação, que é regra de jogo inventada por mim |
| **3d · o mestre joga os dois lados** | é o que a R2 §C3 já contou: 5 dos 5 gestos são dele. Mede a carga do pior caso administrativo, e não mede jogador nenhum |

**Bloqueia o começo.** A política é quem gera declaração, e sem ela o laço da §2.2 não tem passo 4.
Fica em branco esperando: a §2.3 inteira (o que é "resolvida por política"), o eixo E6, e a métrica
de tempo morto do jogador, que só existe se houver jogador.

### D4 · O que é fim de batalha, incluindo o alvo que nunca é alcançado?

Hoje **não existe fim de batalha** no Grid (R1 §8), e a bancada corta em 4000 Ticks
(`lib-tempo.mjs:382`). A perseguição não tem teto por decisão registrada em 02/09
(`combate-tempo.ts:826-828`: "quem desiste é a mesa, no abortar, e não o motor").

| Opção | O que muda |
|---|---|
| **4a · um lado sem ninguém de pé** | o mais simples. Uma fração das batalhas nunca termina, e essa fração vira dado, não erro |
| **4b · 4a, mais a fuga que sai do tabuleiro** | quem foge e chega à borda, ou passa de N hexágonos do inimigo mais próximo, é retirado e contado como baixa. Fecha a perseguição pelo mapa, e o **tamanho do mapa** passa a decidir a duração da batalha |
| **4c · 4a, mais teto de Ticks, marcada "indecisa"** | corta em N Ticks. Toda métrica com "por batalha" no denominador fica enviesada pelas indecisas: ou elas vão para um balde próprio, ou o número está errado |
| **4d · 4a, mais teto de adiamento** | depois de K re-projeções seguidas da mesma ação, o perseguidor desiste, que é o gesto que a mesa faria no abortar. **Isto é regra de jogo nova**, e mudaria o Grid, não só o harness |

E a pergunta colada nessa: **a batalha não terminada é descartada ou contada?** Descartar enviesa
para baixo tudo o que cresce com a duração, que é justamente a carga.

> **Corrigido pelo D8b em 02/09** (§2.6): a carga que reprova uma regra **não** cresce com a
> duração, porque a métrica passou a ser por Tick. Descartar a batalha não terminada enviesa as
> métricas de **contexto** e deixa as **principais** de pé, e o balde próprio das indecisas continua
> sendo a resposta certa por outro motivo: elas são a leitura inteira do eixo E4.

**Bloqueia o começo.** É a condição de saída do laço. Fica em branco esperando: a métrica "fração
que não termina" da §2.6, e a leitura inteira do eixo E4 da §3.

### D5 · Que cenas são o alvo, e em que eixo elas variam?

| Opção | O que muda |
|---|---|
| **5a · um punhado de cenas escolhidas à mão** | reproduz mesas reais e não generaliza: o resultado vale para aquelas cenas, e a §3 é substituída pela sua lista |
| **5b · grade fatorial sobre eixos** | é o que a §3 propõe. Generaliza e isola o efeito de cada eixo. Exige que os níveis de cada eixo sejam seus, senão a régua é minha |
| **5c · amostragem do bestiário real** | sorteia criaturas das 309 por faixa de perigo. Mede a distribuição que o jogo tem, e não isola nada: os eixos ficam confundidos entre si, porque bicho grande também é lento e também é duro |

**Bloqueia o começo** se for 5a. Nos outros dois, bloqueia só o resultado.

### As minhas

**Q6 · A resolução extraída passa a ser a única, ou o harness ganha uma cópia?**
A §2.1 propõe extrair o miolo de `folhaDaAcao` para um módulo puro e fazer `grid.astro` importar
dele. É refatoração no arquivo mais movimentado do repositório (9.266 linhas), com outra instância
mexendo na mesma árvore. A alternativa, uma cópia headless, já foi tentada: o resultado é
`lib-tempo.mjs`, que hoje discorda da mesa em cinco pontos (R2 §F#11, §F#12, §A1, e §D3, que é a
ausência de mapa). Opções: extrair de verdade · copiar e aceitar a divergência · copiar e escrever
um teste-espelho que compare as duas a cada build.
**Bloqueia o começo.**

**Q7 · As condições expiram no harness?**
O campo `ate` é escrito por `porCondicao` e nunca lido (R2 §C4). Numa batalha de 40 Ticks o efeito é
pequeno; numa de 300, que é o alvo que foge, toda condição posta por Arte fica para sempre. Opções:
o harness expira, e diverge da mesa medindo um jogo que não existe · não expira, e a estatística
longa acumula condição eterna · não usa Arte nenhuma, e a pergunta some.
**Só o resultado**, mas contamina qualquer cena com Arte.

**Q8 · O harness mede uma mesa com quantos jogadores?**
A separação "gesto do mestre" × "gesto do dono da peça" (R2 §C3) só existe se houver alguém do outro
lado. Com o mestre jogando tudo, os 19 gestos do caminho longo são 19 dele. Opções: 0 jogadores
(mestre solo) · 1 por PC · um número fixo por cena.
**Só o resultado**, e é ele que decide se a métrica principal é "gestos do mestre" ou "fração dos
gestos que é do mestre".

**Q9 · O perfil de rolagem é `site`, `misto` ou `mesa`?**
É a única chave que já hoje tira digitação do mestre, e muda a contagem de gestos da folha de 6 para
1 (R2 §C2 e §I.10). Se não for fixada, boa parte da variância da métrica principal é essa chave.
**Só o resultado.**

**Q10 · Artes entram no escopo?**
Se entrarem: a R2 §E mostra que **nenhuma das 24 Artes tem comportamento mecânico completo**, e que
a resistência (o teste que decide se a Arte pega) não existe nem como código nem como regra fechada,
já que o próprio capítulo a lista em revisão. O harness teria de inventá-la, e estaria medindo a
carga de uma regra que não existe. Se não entrarem: somem as paradas #7, #8 e #9, três das catorze,
e o pior caso da R2 §H4 (10 folhas + 8 caixas de efeito + 8 de saída) vira só 10 folhas.
**Bloqueia o começo** da §2.3.

**Q11 · O mapa tem obstáculo, ou só peças?**
O único veto de passo hoje é casa ocupada (`ocupadoPor`, `grid.astro:5880-5892`): não há parede, não
há cobertura, não há terreno. Perseguição em campo aberto é geometria trivial, porque `caminharHex`
é o caminho mínimo e a re-projeção converge. Com obstáculo, o passo pode não aproximar por vários
Ticks seguidos, e é aí que o vaivém consertado em 02/09 volta a ter de que se defender.
**Bloqueia o começo** do gerador de cena.

**Q12 · Tamanho do mapa, escala em metros, e posição inicial.**
A distância inicial é o parâmetro mais forte de tudo o que interessa: ela cria viagem, e viagem cria
re-projeção, Tick vazio e tempo morto. `arena.escala_m` é livre, e a bancada nunca respondeu isto
porque não tem mapa.
**Bloqueia o começo.**

**Q13 · O repertório declarável, e as 461 Técnicas.**
A R2 §I.7 já perguntou; repito com a consequência. Se a simulação mede o repertório que existe, o
"muitas opções para o jogador" que você quer avaliar tem **6 opções** (atacar em 4 manobras, mover em
3 modos, conjurar, abortar, esperar, outra coisa), e o resultado vai ser um número baixo por
construção, não por descoberta.
**Só o resultado**, e é o que decide se o relatório final responde à sua pergunta ou a outra.

**Q14 · O relatório final é para você ler, ou para virar portão de regressão?**
Se for leitura, a saída é um `.md` com tabelas. Se for portão, o harness precisa de números estáveis
entre execuções (semente fixa) e de um limiar por métrica, e a semente fixa mata a amostragem da §3.
**Só o resultado.**

---

## 2. Como o harness deve funcionar

### 2.1 De onde vem o motor

#### Reaproveitado como está

Empacotado com `esbuild` para `.mjs` e importado em Node, que é o que
`scripts/test-simultaneo.mjs:21-33` e `test-combate-tempo.mjs` já fazem hoje.

| Módulo | O que entrega | Ressalva |
|---|---|---|
| `src/lib/combate-tempo.ts` | anatomia, agenda, re-projeção, escada de Defesa, fases, fila (`ordemDaFila`), `decisaoAutomatica`, `passoDoGolpe` | nenhuma: R2 §A3 confirmou 2 imports e zero globais de navegador |
| `src/lib/hex.ts` | `distanciaHex`, `caminharHex`, `alemDe`, vizinhança | puro e determinístico por construção (`hex.ts:125-127`) |
| `src/lib/quase-acerto.ts` | `saidaDoAtaque`, `errouPor`, classes | puro |
| `src/lib/calc.ts` | `defesa`, `defesaMental`, `empilharArmaduras`, `soakNatural`, `deslocamento`, e a `gatePerfuracao` que ninguém chama | puro |
| `src/lib/combate-resumo.ts` | `resumoCombatePC`: ataque, dano, Defesa, Absorção, QA, passo | puro |
| `src/lib/equip.ts` | catálogo de armas, armaduras e escudos | puro |
| `src/lib/mesa-core.ts` | `somarCondicoes` | tem `Math.random` em `novoId` (L28), que o harness não precisa chamar |
| `src/lib/alcance.ts` | faixa de distância de tiro e arremesso | puro |
| `src/lib/mesa-bestiario.ts` | `resumoDe`, `baseResumo`, `iniDeMonstro` | `iniDeMonstro` rola dado |
| `src/lib/rolagem.ts` | `rolarExpr`, `descreverRolada` | **precisa de uma mudança de uma linha**: `d6` (L11) chama `Math.random` direto. Sem um ponto de injeção não há semente, e sem semente não há reexecução da batalha 743 |
| `src/lib/mesa-ficha.ts` | leitura da ficha de PC | `rolarIniciativaPC` (L133) tem o mesmo `Math.random` |

#### Reimplementado a partir de `grid.astro`, com este contrato

Com a cópia (Q6), estas peças não são extraídas: são reescritas no harness a partir do contrato da
tabela, e a cena espelho é o que impede as duas versões de andarem para lados diferentes.

Cada peça abaixo hoje mora dentro do componente, misturada com desenho e com gravação. O contrato
proposto é sempre o mesmo formato: entra estado e sai estado novo mais eventos, sem `await`, sem
`SB`, sem `document`.

| Peça | Onde está hoje | Entra | Sai |
|---|---|---|---|
| `defesaEfetiva` | L7465-7474 | resumo do alvo, condições, ação, Tick, pressão | `{ total, base, ferimento, condicoes, escada, pressao }` |
| `resolverGolpe` | miolo de `folhaDaAcao`, L7432-7997 | resumo do atacante e do alvo, ação, manobra, índice do golpe, distância em hexágonos, perfil de regras (D2), fonte de acaso | `{ total, defesa, errouPor, veredito, danoBruto, tipo, absorcao, danoLiquido, rolls }` |
| `aplicarDanoPuro` | L8072-8085 | alvo, bruto, tipo, condições | `{ liquido, pvAntes, pvDepois, caiu: bool }` |
| `soakDePuro` | L8028-8033 | resumo, condições, tipo | número |
| `passoDaPeca` / `passoNoModo` | L4866-4890 | resumo da peça, modo | metros por Tick |
| `alcanceDaPeca` | L4850-4852 | resumo da peça | hexágonos |
| `ocupacao` (`ocupadoPor`, `podeDividir`, `diametroM`) | L5834, L5880, L3011 | posições, portes, escala | `(q, r) => bool` |
| `filaDaCena` (`naFila`, `tickDaVez`, `grupoDaVez`, `instanteDeGolpe`, `golpeMaisCedo`) | L4059-4200 | peças, tokens, Tick | lista ordenada, Tick corrente, quem está livre |
| `avancoDeTick` | `avancarTickSimultaneo`, L4902-5016 | cena inteira | cena nova + lista de eventos |
| `declararAtaque` | parte não visual de `declararAtaqueSimultaneo`, L5185-5260 | atacante, alvo, manobra, modo de movimento, posições | `Acao` completa (agenda, `mov`, contrapé) |
| `chao` (`conferirChao`, `DELAY_AO_LEVANTAR`) | L4189-4216 | peças, Tick | quem levantou, com o atraso de 5 |
| `efeitosDoTick` | `verificarEfeitos`, `artes-grid-mesa.ts:1449-1512` | efeitos ativos, posições, Tick | mordidas, saídas oferecidas, efeitos vencidos |

#### Reimplementado do zero

Persistência (um objeto em memória no lugar do Supabase) · o humano (a função `consultar` da §2.5) ·
o gerador de cena e de elenco (§2.7) · a condição de fim (D4) · o log (§2.5) · o agregador.

#### Como as duas versões não divergem

**A decisão foi a cópia** (Q6), e esta seção existe para dizer o que ela custa. A extração fica
registrada como a alternativa recusada: um módulo puro único, importado por `grid.astro`, que ficaria
com três responsabilidades e nenhuma conta (perguntar ao humano, desenhar, gravar).

O motivo de a extração ter sido defendida, e de a cópia precisar de defesa própria, é a lição do que
já aconteceu. `lib-tempo.mjs` é a cópia headless que fizemos antes, e ela discorda da mesa em cinco
pontos hoje: aplica a Margem que a mesa não aplica (R2 §A1), classifica o Quase-Acerto pela classe de
tempo enquanto a mesa classifica pelo dano médio (§F#11), usa um limiar de raspão um ponto mais
generoso (§F#12), embaralha a ordem de ação com Fisher-Yates enquanto a mesa ordena por `ordemDaFila`,
e não tem mapa nenhum (§D3). Nenhuma dessas divergências apareceu como erro: **as duas passam nos seus
próprios testes.** Divergência entre dois caminhos não é pega por teste, é pega por comparação, e
ninguém estava comparando.

**Com a cópia, a comparação tem de ser construída de propósito, e o instrumento é a cena espelho.**
Ela está especificada na `03-respostas.md` §1.1.1: a cena fixa, os campos comparados por Tick e por
peça, o perfil de bandeiras sob o qual roda, onde roda e o que falha. Um ponto de lá vale repetir
aqui, porque corrige o que esta seção dizia antes: **o espelho vale sob qualquer perfil de bandeiras,
desde que os dois lados leiam o mesmo.** A ressalva de que ele só valeria com todas desligadas era
verdadeira quando as bandeiras iam viver só no harness, e deixou de ser quando a §0.6 decidiu que a
mesa lê o mesmo perfil.

### 2.2 O laço

Um Tick do harness, na ordem, com a diferença em relação a `avancarTickSimultaneo` (L4902-5016)
apontada em cada passo.

| # | Passo | Igual ao Grid? |
|---|---|---|
| 0 | **Guarda de golpe devido.** Se há golpe com Tick ≤ Tick corrente ainda não resolvido, o relógio não anda | **igual**: é o `if (instanteDeGolpe()) return` da L4903. No harness ela nunca dispara, porque o passo 5 sempre resolve; a guarda fica como asserção, e se disparar é defeito |
| 1 | **T ← T + 1** | igual (L4904-4906), sem a gravação de `tick_atual` |
| 2 | **Passo de todas as peças em trajeto**, na ordem de `filaDaCena`. Para cada uma: pula quem está no chão, pula quem não tem `mov.auto`, pula quem declarou neste mesmo Tick (`desde + 1 > T`), calcula `passos` pela escala, restringe o passo se está na fase de Golpe (`passoDoGolpe`), caminha com veto de ocupação, e repete com veto frouxo se não aproximou | **igual**, linha por linha (L4912-4966). É o passo que mais depende da extração fiel |
| 3 | **Encerrar trajeto ou re-projetar.** Quem chegou ao alcance, ou atravessou, perde o `mov`; quem não chegou passa por `reprojetarAgenda` com a viagem que sobrou medida no passo real | **igual** (L4984-5012) |
| 4 | **Fase 1, declaração**: todos os livres declaram, na ordem de **N4** (cadeia crescente; iniciativa na frente durante a entrada, Rac + Prontidão na frente depois). Criaturas pela `decisaoAutomatica`, PCs pela política de D3. Nenhuma consequência acontece aqui | **diferente**. Hoje só as criaturas decidem dentro do avanço (`decidirAutomaticas`, L5017) e os PCs decidem quando o humano clica, em qualquer momento e em qualquer ordem. Com N4 e N5 a ordem passa a ser regra |
| 4b | **Fase 2, o retrato**: fecha-se a leitura do estado (Vida, condições, Pressão, posição) que a fase 3 inteira vai usar | **novo**, e é **N6**. Não existe no Grid |
| 5 | **Fase 3, resolução**: os golpes com Tick ≤ T, **na ordem inversa da declaração** (N5), lendo o retrato (N6), incluindo os de quem caiu neste mesmo Tick (N3) | **diferente na forma, igual na posição**. No Grid isto não é parte do avanço: é o cartão da faixa, clicado depois, e o ⏭ fica desligado enquanto houver golpe devido (L4324-4326). Com **N2** essa ordem deixa de ser acidente da interface e vira regra, e com **N6** a ordem dentro da fase não muda número nenhum: ela decide só o que se conta primeiro |
| 6 | **Efeitos de Arte** (mordidas, saídas, vencimentos), se Q10 disser que Artes entram | **igual à posição** (L5021), com a diferença de que a caixa de efeito e a de saída viram política |
| 7 | **Chão, mortes e o fim do retrato.** Vida a zero sai da fila; quem levantou paga os 5 Ticks de `DELAY_AO_LEVANTAR`. Aqui as penalidades nascidas em T passam a valer, para T+1 em diante | **diferente na hora**: hoje `conferirChao` roda a cada repintura (L4207), o que é "quando a tela desenhar". No harness roda uma vez por Tick, no fim, e é isso que faz a morte mútua ser possível |
| 8 | **Expiração de condições** (o `ate`), conforme Q7 | **diferente**: no Grid isto não acontece, o campo `ate` é escrito e nunca lido |
| 9 | **Fim de batalha** (D4) | **diferente**: no Grid não existe |

Três diferenças merecem ser ditas com a consequência, porque mudam número e não só ordem:

- **O passo 4 antes do passo 5 abaixa a Defesa de quem acabou de declarar.** `faseEm(acao, T)` devolve
  **`preparo`** para uma ação declarada no Tick T (`combate-tempo.ts:595-606`), e a escada cobra −2
  (`defesaPerdida`, L620). Ou seja: quem decide no Tick T recebe o golpe que vence no mesmo Tick T já
  com a guarda baixa. **Com N1 isso passa a estar certo** (a ação começa em T, então a guarda abrir em
  T é o esperado); com a régua de hoje era um Tick de guarda aberta a mais do que a ação, que é o que
  a §0.45 descreve. Nos dois casos o número é o mesmo e o harness o mede igual.
- **O passo 2 antes do passo 5** significa que a peça dá o passo do Tick do Golpe **antes** de o
  golpe resolver, e a distância que a folha lê (L7478) é a de depois do passo. É por isso que
  `passoDoGolpe` existe. O harness mantém.
- **O passo 7 no fim do Tick**, e não a cada repintura, elimina uma indeterminação real do Grid: hoje
  o número de repinturas por Tick depende de eventos de interface, e quem morre pode sair da fila
  antes ou depois de outra peça agir, conforme a tela.

### 2.3 As catorze paradas viram o quê

**P** = resolvida por política, e nesse caso **a simulação está inventando uma regra de jogo**;
**A** = resolvida por regra automática, com a função pura que faz a conta; **F** = fora de escopo.

| # | Parada | Vira | Observação |
|---|---|---|---|
| 1 | Declarar ataque | **P** ⚑ | manobra (4 opções), modo de deslocamento (3), m/Tick e trajetória. É a decisão mais consequente do sistema e sai inteira de D3 |
| 2 | A folha da ação | **A** para o veredito e o dano (`saidaDoAtaque`, `rolarExpr`, `defesaPerdida`, `soakDe`); **F** para o ajuste avulso com motivo | é a parada que hoje trava a cena, e a que mais barato se automatiza |
| 3 | Escolher o alvo | **P** ⚑ | hoje o robô escolhe o mais próximo; qualquer outra regra é invenção |
| 4 | Soltar peça em casa vazia | **P** ⚑ | para onde mover quando não se está atacando. Sem D3 isto fica em branco |
| 5 | Abortar o gesto | **P** ⚑ | cada uma das cinco políticas da §0.4 P4 declara se aborta e quando (só o Cauteloso aborta, depois de dois deslizes seguidos da agenda). Como as outras quatro não abortam, a perseguição delas só termina pela regra dos 10 Ticks sem aproximar (D4b) ou pela desistência a 20% |
| 6 | "Outra coisa" | **F** | é narração livre; não tem forma de dado |
| 7 | Efeito pegando alguém | **A** (`dentroDoEfeito`, `jaMordido`, `danoNoAlvo`) | entra: Q10 pôs zona, aura, muro e cone no escopo. A política é sempre "cobrar todos", que é o que o mestre faz quando não quer pensar |
| 8 | Sair da área | **P** ⚑ para a escolha (sair / ficar por coragem / comer inteiro), **A** para a conta (`desvioDaArea`, `rolarPool`) | é a única parada com default declarado hoje: comer inteiro (L1298) |
| 9 | Conjurar | **P** ⚑ | entra, no recorte da §0.1: qual Efeito, que nível, quais parâmetros e onde soltar. O mirado ainda precisa da rolagem de acerto que não existe (P3) |
| 10 | Rolar iniciativa | **A** (`rolarIniciativaPC`, `iniDeMonstro`, `ticksDeEntrada`) | com a fonte de acaso semeada |
| 11 | Avançar o Tick | **A** | é o laço |
| 12 | Cartão da faixa | **A** | a ordem é a da fila, que já é total |
| 13 | Curar / tirar Vida / Mana / ordem | **F** | correção do mestre; não existe sem mesa |
| 14 | Ação na aba Combate | **F** | é outro sistema de tempo |

Contagem, já com as respostas da §0: **6 políticas** (#1, #3, #4, #5, #8, #9), **5 regras
automáticas** (#2, #7, #10, #11, #12), **3 fora de escopo** (#6, #13, #14) e nenhuma em branco. A #2
e a #8 aparecem duas vezes porque se partem: a escolha é política, a conta é automática. Cada ⚑ é uma regra de jogo que o harness inventa, e toda métrica que dependa dela carrega
essa invenção junto.

### 2.4 Determinismo

**A ordem de resolução deixou de importar.** Com N2 e N3 (§0.45), ninguém declara sabendo do golpe do
outro e ninguém deixa de golpear porque o outro foi resolvido primeiro. Isso muda a natureza do que
esta seção precisa garantir: antes ela podia dar ordem de iteração estável, mas não podia dar que a
ordem fosse irrelevante. Agora ela é irrelevante dentro do Tick, e a estabilidade da fila serve só
para o log sair sempre no mesmo arranjo.

**A semente.** Uma por batalha, derivada e não sorteada:

```
semente(b) = hash32(semente_mestre, cenario_id, repeticao)
```

Assim a batalha 743 é reproduzível sem depender de nenhuma anterior, e acrescentar uma batalha no
fim não muda nenhuma das outras.

**São 32 bits, e não 64.** O texto dizia `hash64` e o gerador que entrou na Etapa 0 (`acaso.ts`,
Mulberry32) trunca a semente com `>>> 0`. Dentro de uma célula de 500 a colisão é desprezível (pelo
aniversário, da ordem de 3 em 100.000), então não muda resultado nenhum; o que não podia ficar é os
dois textos dizendo coisas diferentes. **Vale 32.**

**Um fluxo só, e não cinco por finalidade** (decidido em 02/09, depois da Etapa 0). A proposta
anterior era `acerto`, `dano`, `iniciativa`, `efeito` e `politica`, cada um semeado por rótulo, com o
argumento de que um fluxo único faz uma rolagem a mais deslocar todas as seguintes. O argumento é
verdadeiro e o efeito dele é **menor do que parecia**, e é isso que decidiu:

- **o A/B continua sem viés.** Com um fluxo só, ligar uma bandeira que rola uma vez a mais faz as
  duas execuções divergirem dali em diante. Isso não desloca a média de lado nenhum: **custa
  precisão, não correção**;
- **e elas não são independentes, são positivamente correlacionadas**, porque compartilham o
  **prefixo** da sequência: tudo o que foi rolado antes da primeira divergência é idêntico nas duas.
  Tratar o par como independente na hora de calcular o intervalo é **conservador**, ou seja, o
  intervalo sai maior do que o verdadeiro e a conclusão é segura. É assim que o relatório vai
  calcular, e é assim que ele vai dizer que calculou;
- **o que se perde é o pareamento completo**, que é uma técnica de redução de variância. Sem ele, a
  mesma precisão pede mais batalhas. Quanto, só o piloto diz;
- **o espelho de inércia não precisa disso.** Ele roda com a bandeira **desligada dos dois lados**,
  então o número de rolagens é igual e os dois lados andam juntos de qualquer jeito.

**A limitação fica escrita no relatório**, junto de cada comparação de bandeira: os deltas de E5 são
**parcialmente pareados**, e o intervalo de cada um é calculado como se fossem duas amostras
independentes, que é a hipótese conservadora.

**E daí sai uma tarefa nova para o piloto, que é o risco de verdade desta decisão.** O `n` da grade
foi dimensionado pelo CV da **métrica** (§3), e o que decide a precisão de uma comparação de bandeira
é a variância do **delta**, que é outra coisa. Some-se a isso a previsão da §3 de que o efeito de E5
sobre a carga por Tick é **minúsculo**, e um delta pequeno com variância de duas amostras
independentes pode precisar de um `n` muito maior que o das outras células. Então:

> **O piloto passa a medir também a variância do delta de uma bandeira, nas duas âncoras**, e é dela
> que sai o `n` das células de E5, separado do `n` do resto da grade. A bandeira a usar é a `margem`,
> que é a maior das nove (R2 §F#1) e a que morde na âncora: se nem ela der delta destacável, nenhuma
> das outras dará.

**E se o `n` que sair dali for impraticável, a decisão do fluxo único volta ao chat.** Fica escrito
para não virar um número que alguém arredonda em silêncio: o preço do fluxo único é pago em batalhas
nas células de E5, e o piloto é quem diz quanto.

**Ordem de iteração.** Com N4 e N5 (§0.46), a ordem dentro do Tick deixou de ser detalhe de
implementação e virou regra: declara-se pela cadeia crescente e resolve-se pela inversa. O que esta
seção ainda precisa garantir é o **desempate final**, quando a cadeia inteira empata e a regra manda
sortear. `ordemDaFila` (`combate-tempo.ts:399-404`) desempata em cinco níveis: Tick,
iniciativa, Raciocínio, `chegada`, nome. Na mesa, `chegada` é `TOKENS[c.id]?.em` (`grid.astro:4064`),
que é um `new Date().toISOString()` do instante em que a peça foi posta no mapa: é relógio de parede,
e portanto não reproduzível. A correção não exige mexer no motor: o próprio comentário do campo diz
"um carimbo, um id, o que a tela tiver" (`combate-tempo.ts:395`). O harness alimenta `chegada` com um
**ordinal de entrada**, inteiro, atribuído pelo gerador de cena. A ordem passa a ser total e estável.

**E nada de embaralhar.** A bancada faz Fisher-Yates a cada Tick (`lib-tempo.mjs:458-460`); a mesa
não. O harness segue a mesa.

**O que grava para reexecutar a batalha 743.** Dois arquivos, e nada mais:

`bateria.json`, um por execução:

```
run_id            texto
commit            o sha do repositório
iso               data e hora
semente_mestre    inteiro de 64 bits
perfil            { d1, d2: {margem, gate, porte, bloqueio, modo2, teto6},
                    d3: politica, d4: {tipo, teto_ticks, teto_adiamento}, q7, q9, q10 }
grade             os eixos e os níveis (§3)
dados_hash        sha1 do conteúdo de src/data/*.json E de src/lib/*.ts, para saber se a
                  régua ou o motor mudaram (decidido em 02/09, §0.7: as bandeiras moram no
                  regras.json, e o hash cobre o código junto para nenhuma bateria rodar com
                  uma configuração que o registro não conhece)
```

`sementes.jsonl`, uma linha por batalha:

```
b            inteiro, o número da batalha
cenario      texto, a célula da grade
semente      inteiro
mapa         { cols, rows, escala_m }
elenco       [ { cid, lado, fonte: 'monstro'|'pc-gerado', ref, ordinal } ]
posicoes     [ { cid, q, r } ]
```

Tamanho: o registro de uma batalha de 6 peças fica na casa de **400 a 700 bytes** em JSON, e 1000
batalhas em **menos de 1 MB**. Com esses dois arquivos e o mesmo commit, a batalha 743 roda de novo
idêntica; o log de eventos (§2.5) não precisa ser guardado para isso, ele é saída, não entrada.

### 2.5 O log de eventos

É a peça central, porque a métrica é interrupção e não dano. Formato: **JSON Lines**, um registro por
evento, um arquivo por batalha ou um por bateria com o campo `b`.

**Campos comuns a todo evento:**

```
b        int     a batalha
t        int     o Tick da cena
seq      int     a ordem dentro do Tick (é o que permite contar o que se acumula num mesmo instante)
ev       texto   o tipo, do vocabulário fechado abaixo
cid      texto   a peça de quem o evento é
alvo     texto?  a peça do outro lado, quando há
```

**Vocabulário de `ev`:** `cena.inicio` · `cena.fim` · `tick` · `decl` · `passo` · `reproj` ·
`golpe.vence` · `golpe.resolve` · `dano` · `chao` · `morte` · `efeito.mordida` · `efeito.saida` ·
`cond.poe` · `cond.tira` · `parada`.

**Campos do evento `parada`**, que é o que a métrica principal lê:

```
parada      int      1..14, o número da tabela da R2 §B
classe      'i'|'ii'|'iii'
quem        'mestre'|'dono'|'ambos'    quem seria consultado
campos      int      quantos valores a tela mostraria
editaveis   int      quantos abririam em branco (a digitação real)
gestos      int      o mínimo de cliques ou arrastos para responder
auto        bool     se a política respondeu sozinha no perfil corrente (D1)
travaria    bool     se, no Grid real, não responder congelaria o relógio da cena
pendentes   int      golpes no ar naquele instante
abertas     int      quantas outras paradas já esperavam no mesmo Tick
```

**Campos por tipo:** `golpe.resolve` leva `total, defesa, errou_por, veredito, dano_bruto, absorcao,
dano_liquido, tipo, manobra, indice, fase_alvo, dist_hex`; `passo` leva `de_q, de_r, para_q, para_r,
modo, passos, atravessou, chegou`; `reproj` leva `golpe_antes, golpe_depois, atraso, falta_hex,
acumulado` (quantas vezes aquela mesma ação já deslizou); `dano` leva `pv_antes, pv_depois, caiu`.

**Os quatro acréscimos decididos em 02/09** (`04-prontidao.md` §A.3 e §D2), sem os quais nove
métricas não têm dado:

1. **`aid`, o identificador de ação**, nascido no `decl` e repetido em `golpe.vence`,
   `golpe.resolve`, `reproj` e `dano`. Ligar por `(cid, ordem)` funciona com uma ação por vez e
   **quebra em silêncio na rajada e na re-projeção**, produzindo um tempo morto menor e crível. Ele
   ganha invariante próprio, o **V15** (`03-respostas.md` §3.1): todo `dano` tem um `decl` ancestral
   na mesma batalha.
2. **O evento `decl` ganha campos próprios**, que a especificação não tinha:
   ```
   aid       texto    o identificador desta ação
   acao      'atacar'|'mover'|'conjurar'|'abortar'|'esperar'|'outra'
   manobra   'simples'|'dupla'|'segura'|'rajada'   quando é ataque
   alvo      texto?
   viagem    int      Ticks de viagem estimados na declaração; 0 = já estava no alcance
   modo      'andar'|'batalha'|'corrida'            quando há deslocamento
   golpe     int?     o Tick do primeiro golpe agendado
   primeira  bool     é a primeira declaração desta peça? (a cadeia de N4 depende disso)
   ```
3. **`cena.fim` ganha `motivo`**: `sem-ninguem-de-pe` · `fuga-consumada` · `desistencia-20` ·
   `estourou`. Sem ele a "fração de batalhas que não terminam" não distingue as quatro.
4. **Nasce o evento `recurso`**, com `{ tipo: 'mana', antes, depois, pct }`, emitido quando a Mana é
   gasta. É o que sustenta as três métricas da §0.7 (o Tick em que o conjurador cruza os 30% e o
   zero, e a fração das batalhas em que ele termina esvaziado). Energia e Fôlego não emitem: a
   primeira não é gasta por nada e o segundo ficou fora (§0.7).

E o `passo` ganha **`chegou`** (bool), que marca o Tick em que a peça entrou no alcance do alvo: é o
que a métrica da folga da perseguição (§0.45) precisa e não tinha.

#### Como se obtém o que a R2 §G2 disse não existir em lugar nenhum

Cinco dos seis itens **não existem porque ninguém conta**, e a extração da §2.1 os entrega de graça.
O sexto não é obtenível headless.

| O que falta (R2 §G2) | De onde vem no harness |
|---|---|
| que **tipo** de parada é esta | do ponto de chamada. Todo lugar que hoje chama `showModal` ou `uiEscolher` passa a chamar uma função única, `consultar(pedido)`, e o `pedido` carrega o número da parada. Isso **cria** o ponto único que a R2 §G3 disse não existir, e cria inclusive para as três paradas que não são caixa nenhuma (a mira, o ⏭ e o cartão da faixa), que é o buraco que um gancho no nível de `<dialog>` nunca cobriria |
| quantas vezes o mestre foi consultado | contador dentro de `consultar` |
| quem responderia | campo do `pedido` |
| quantas caixas ao mesmo tempo | `abertas`, derivado de `seq` dentro do mesmo `t` |
| a série de golpes por Tick | os eventos `golpe.vence`, que hoje não são registrados porque a faixa é recalculada a cada repintura e nada guarda a série |
| **quanto tempo a caixa ficou aberta** | **não é obtenível.** É tempo humano, e o harness não tem humano. Ver §4 |

#### A tabela de custo de tela, e por que ela é dado e não simulação

Os campos `campos`, `editaveis` e `gestos` **não são deriváveis pelo motor**: eles descrevem a tela,
e a tela não existe no harness. Eles entram como uma tabela constante, uma linha por parada, lida da
fonte: `CAMPOS_ATQ` e `CAMPOS_ALVO` (`grid.astro:7718-7745`) dão os 21 campos calculados, os 4 que
abrem vazios saem de L7614, e a contagem de gestos sai da R2 §C3. Essa tabela é **entrada declarada,
não resultado medido**, e toda métrica de gesto tem de ser lida com essa etiqueta: o harness conta
quantas vezes a caixa abriria, e multiplica por um número que veio de leitura de código.

#### Tamanho

Um duelo de 37 Ticks (R2 §D1) gera da ordem de 37 `tick`, 30 `passo`, 8 `decl`, 8 `golpe.vence`,
8 `golpe.resolve`, 8 `dano` e as paradas correspondentes: **algo entre 100 e 150 registros**, com
~120 bytes cada, dá **12 a 18 KB por duelo**, e 3 a 5 KB comprimido. Mil duelos são ~15 MB, mil
refregas 3×3 são ~40 MB. Isso é confortável em disco e desconfortável em memória, então a saída é em
dois níveis: **log completo** para uma amostra declarada (por exemplo, 20 batalhas por célula, as
mesmas todo dia por serem escolhidas pela semente), e **contadores agregados** para todas.

### 2.6 As métricas

**A régua de leitura vem primeiro, porque é ela que ordena o resto** (`04-prontidao.md` §D8b,
propagado em 02/09). Os dois critérios de "a regra piorou o jogo" são **a carga do mestre subiu** e
**o jogador espera mais**. A **duração não é critério, é multiplicador**: um combate mais longo ou
mais curto é balanço de regra e se resolve fora do Grid. Por isso as métricas **por etapa** são as
principais e as **por batalha** são contexto: paradas por batalha mistura carga com duração, paradas
por Tick não.

#### As principais · por etapa · são as que reprovam uma regra

| Métrica | Critério | A pergunta que ela responde | Distribuição ou média |
|---|---|---|---|
| **Paradas do mestre por Tick** | carga | "com que frequência o jogo para" | **distribuição**, com p50, p90, p99 e o máximo visto |
| **Pico de paradas num Tick** | carga | "a fila empilha?" (R2 §H4 diz que o teto teórico é o número de peças) | **histograma**. O máximo é reportado como "o pior visto em n", nunca como "o pior caso": o máximo de uma amostra cresce com n e não é estimativa de nada |
| **Gestos do mestre por golpe aplicado** | carga | "quantos cliques custa um golpe" | **distribuição**. Carrega a etiqueta da tabela de custo de tela |
| **Fração dos gestos que é do mestre** | carga | "o mestre está compondo o jogo dos outros?" | média, e ela cabe: é razão de dois totais grandes dentro da batalha |
| **Tempo morto do jogador, em Ticks** | espera | "quanto tempo passa entre eu declarar e ver o efeito" | **distribuição**. Medido do `decl` de uma peça ao `dano` do primeiro golpe daquela ação |
| **Tempo morto de quem perseguiu contra quem já estava no alcance** | espera | "a viagem é o que faz esperar?" É a métrica que sustenta a decisão da folga da perseguição (§0.45) **e** é o sinal do risco F2 | **duas distribuições lado a lado**. Vem do `decl.viagem`, do D2 |
| **Adiamentos por ação** e **maior deslize** | espera | "o que acontece com a perseguição que não fecha" | **distribuição**, e é o caso em que só a cauda interessa |
| **Fração de Ticks vazios** (só passo, nenhuma resolução) | espera | "o mestre clica ⏭ para nada?" | **as duas**: média dentro da batalha (é razão sobre dezenas de Ticks) e distribuição entre batalhas |

#### O contexto · por batalha · descrevem, e não reprovam

| Métrica | A pergunta que ela responde | Distribuição ou média |
|---|---|---|
| **Paradas por batalha**, total e por classe i/ii/iii | "quanta carga o mestre leva numa cena inteira" | **distribuição**. Continua indo com a cauda, e continua sem ser critério |
| **Gestos do mestre por batalha** | idem, em cliques | **distribuição** |
| **Ticks por batalha** | é o multiplicador de tudo | **distribuição** |
| **Fração de batalhas que não terminam** | a perseguição que não fecha, e depende da folga da §0.45 | proporção, com intervalo binomial |
| **Taxa de acerto de quem perseguiu contra quem esperou** | se chegar atrasado custa acerto | duas proporções, com intervalo binomial |
| **Tick em que o conjurador cruza 30% e zero de Mana** | "a reserva é pequena demais para os combates?" (§0.7) | **distribuição**, e o zero pode não acontecer: reportar também a fração das batalhas em que não aconteceu |
| **Fração das batalhas em que o conjurador termina esvaziado** | idem | proporção, com intervalo binomial |
| **Fração das ações dele que foram de adaga** | quanto tempo o conjurador passa sendo outra coisa | média, e ela cabe: é razão de dois contadores dentro da batalha |

#### O diagnóstico do motor · validam o modelo, nunca reprovam nada

| Métrica | O que ela confere | Distribuição ou média |
|---|---|---|
| **Colisão de agenda: N(T)** | a forma fechada da R2 §H1 contra o que de fato acontece | **histograma**, comparado com o previsto |
| **Fração dos golpes que caem em Tick múltiplo de 6** | a sincronia das oito fontes da R2 §H3 | proporção |
| **Fração dos golpes que caem no Tick da chegada** | se chegar e golpear no mesmo Tick é comum ou é curiosidade (§0.45). Vem do `passo.chegou`, do D2 | proporção, com intervalo binomial |

#### O que mudou de posição, e o que deixou de ser critério

| | |
|---|---|
| **Subiu para principal** | tempo morto, adiamentos e maior deslize, e fração de Ticks vazios: as três descrevem **espera**, que é metade do critério do D8b, e estavam misturadas no meio da lista |
| **Desceu para contexto** | **paradas por batalha** e **gestos por batalha**, que eram as duas primeiras da tabela antiga. Elas herdam a variância da duração, e a duração deixou de ser critério |
| **Desceu para contexto** | **Ticks por batalha** e **fração de batalhas que não terminam** |
| **Virou bloco próprio** | N(T) e a sincronia dos múltiplos de 6, que nunca foram carga nem espera: são conferência do modelo |
| **Entraram, e são as seis da `04-prontidao.md` §A.2** | uma subiu para principal (o tempo morto separado por viagem), quatro entraram no contexto (as três de Mana e a taxa de acerto dos dois grupos) e uma no diagnóstico (o golpe no Tick da chegada). As seis dependem dos campos do D2, e nenhuma tinha dado antes dele |
| **Deixou de ser critério de reprovação** | **a duração da batalha**, em qualquer forma, e junto com ela **taxa de vitória e dominância**, que continuam calculáveis e param de decidir se uma regra fica |

**A gramática de leitura, em uma frase:** uma regra que dobre a duração e mantenha a carga por Tick é
neutra pelo critério; uma que encurte a batalha e dobre os cliques por etapa é ruim.

**Onde a média cabe**, cabe por um motivo só: quando é razão de dois contadores grandes acumulados
**dentro** da mesma batalha (Ticks vazios sobre Ticks, gestos do mestre sobre gestos totais), a média
não é resumo de uma cauda, é a própria quantidade. Tudo o que descreve **uma espera** vai como
distribuição, porque a experiência de mesa é a espera pior, não a espera média: um Tick com 10 folhas
é lembrado, e nove Ticks com uma folha não são.

#### O contador de ocasiões, que impede o zero de mentir

Com cada bandeira lida na célula em que ela morde (§0.10.1), a mesma bandeira aparece no relatório
com **duas leituras**: a da hospedeira, que diz quanto ela vale, e a da âncora extrema, que existe só
para a soma do F5 e é **zero por construção**. Sem instrumento, as duas se parecem, e "0,0" na âncora
seria lido como "a bandeira não faz nada".

**O instrumento é um contador por bandeira e por célula: quantas vezes a pré-condição dela ocorreu.**
Não é o delta, é a ocasião. Sai do agregado da §2.5 e custa um inteiro por bandeira por célula.

| Ocasiões | Delta | Como o relatório imprime |
|---:|---|---|
| **0** | qualquer | **`não exercitada`**, e nunca um número. A célula não tinha como acionar a regra |
| **> 0** | ≈ 0 | **`0,0 em n ocasiões`**: a regra foi acionada e não mudou o resultado. Isto sim é um achado |
| **> 0** | ≠ 0 | o número, com o intervalo |

**O contador vale igual para as regras das políticas** (decidido no fechamento final). As regras ⊙
(leitura) e ⊕ (modo) da §0.4 P4 têm exatamente o mesmo problema das bandeiras: se a regra ⊙ do
Agressivo tiver **zero ocasiões** numa âncora, o eixo E9 volta a ser inerte ali e o delta não avisa,
porque um delta zero de um interruptor que nunca teve o que ligar é indistinguível de um interruptor
que não faz diferença. Então: **um contador por regra de política, por célula**, com a mesma tabela
de leitura acima. Zero ocasiões imprime `não exercitada`, e nunca um número.

Isso fecha um buraco que esta frente já pisou duas vezes: a regra ⊙ do Agressivo esteve decidida e
não aplicada por várias rodadas (`05-fechamento.md` §2.2), e ninguém teria percebido pelo resultado,
porque o resultado era zero dos dois lados. Com o contador, o mesmo erro sai do relatório como
`não exercitada` e aponta para a política, não para o eixo.

Três consequências que valem a pena estar escritas:

- **o `teto6` deixa de estar em "não se sabe"**: o contador diz quantas vezes os modificadores
  passaram de 6, e se o contador der zero a comparação sai `não exercitada` em vez de nula;
- **as seis leituras de âncora do F5 saem todas como `não exercitada`**, o que é a leitura honesta
  delas, e a soma do F5 as trata como zero explicitamente declarado;
- **o contador é a prova de que a hospedeira foi bem escolhida.** Se a hospedeira do `gate` der zero
  ocasiões, a célula está errada e não a bandeira, que foi exatamente o erro que a regra ⊕ do D11
  quase produziu (`05-fechamento.md` §2.5 C2).

### 2.7 O elenco

| Peça | Fonte | O que é real | O que é inventado |
|---|---|---|---|
| **Criaturas** | `src/data/monsters-mesa.json`, 309 blocos | Defesa, Absorção, Vida, iniciativa, o ataque único, a classe de tempo, as três velocidades (R1: `deslocamento` foi preenchido em 28/08) | **alcance** (nenhuma criatura tem), **armadura** (nenhuma tem), **Couraça de Porte** (não existe no dado nem no motor), e a **segunda opção de ataque**: um bicho com um ataque só nunca escolhe nada |
| **PCs** | 1 ficha de teste (`test-kael`) | a matemática de `resumoCombatePC`, o catálogo de armas, armaduras e escudos, os caps das 7 raças, o passo por `deslocamento()` | **a ficha inteira**. Uma ficha não é elenco. É preciso um gerador de personagem |
| **Mapa** | nada | `arena.escala_m` e a geometria de `hex.ts` | tamanho, forma, posições iniciais, obstáculo (Q11, Q12) |

**O gerador de PC**, se D5 não disser outra coisa: um arquétipo é um registro declarado, e não uma
sorte:

```
id            'espadachim-pesado'
raca          id de racas.json
attrs         { forca, destreza, vigor, percepcao, raciocinio, ... }  respeitando o cap da raça
skills        { esquiva, armas, bloqueio, atletismo, ... }
centelha      int
conjuntos     [ { habil: <ref de armas.json>, inabil: <ref de escudos.json ou nada> } ]
armaduras     [ ids de armaduras.json ]
willpower     int
```

Cada arquétipo passa por `resumoCombatePC` sem nenhum tratamento especial, que é o que garante que o
PC gerado e o PC de mesa somem os mesmos números.

**Como isso é declarado no relatório final**, para os dois não se confundirem: todo número agregado
carrega uma etiqueta de procedência, com três valores: `dado` (saiu de `src/data`), `derivado` (saiu
de função pura sobre `dado`) e `inventado` (saiu de escolha minha ou sua, registrada no perfil da
bateria). O relatório abre com uma tabela **"o que foi inventado"**, listando cada invenção, o valor
usado e a linha do documento em que ela foi decidida. E a regra dura: **uma métrica cujo valor depende
só de entrada inventada não é reportada como achado sobre o sistema**, é reportada como sensibilidade
("com alcance de criatura em 1 hexágono o número é X, com 2 é Y").

---

## 3. Os eixos do experimento

*A grade abaixo é a proposta original. As respostas da §0 a revisam: E2 ganhou um quarto nível, entrou
um eixo de obstáculo, e dois dos eixos deixaram de custar célula. A grade valendo está na §0.3; o
raciocínio, a previsão e a justificativa do número de repetições continuam sendo estes.*

O eixo principal não é quantidade de peças, é **diversidade de ciclos**, e a razão está na forma
fechada da R2 §H1: o golpe de uma peça cai em `T_golpe + k · ciclo`, então duas peças de mesmo ciclo
e mesma entrada colidem **sempre**, e ciclos diferentes colidem no mínimo múltiplo comum. Com as
Velocidades do catálogo (4, 5, 6, 7), m.m.c.(5,6) = 30 e m.m.c.(6,7) = 42, ou seja: dentro de uma
batalha de 37 a 47 Ticks, ciclos diferentes colidem uma ou duas vezes, e ciclos iguais colidem em
todos os golpes.

| Eixo | Níveis | Por quê |
|---|---|---|
| **E1 · diversidade de ciclos** | 4: (a) uníssono, todo mundo `ticks: 6` · (b) dois ciclos vizinhos, 5 e 6 · (c) dois ciclos coprimos, 6 e 7 · (d) os quatro ciclos misturados, 4/5/6/7 | é a fonte de colisão, e portanto de pico de carga |
| **E2 · distância inicial** | 3: encostado (dentro do alcance) · média (a peça mais lenta leva ~3 Ticks) · longa (~10 Ticks para a mais lenta) | é quem cria viagem, re-projeção, Tick vazio e tempo morto. É o eixo que a bancada nunca pôde medir |
| **E3 · tamanho da cena** | 3: 1v1 · 3×3 · 2×8 (a horda) | o total de paradas cresce com ele, e o **pico** cresce mais rápido (R2 §H4) |
| **E4 · assimetria de passo** | 2: passos iguais · um lado 2× mais rápido | é o alvo que nunca é alcançado, e é o teste direto do que a re-projeção faz sem teto |
| **E5 · perfil de regras** | 1 ou 2, conforme D2 | a duração é o multiplicador de toda a carga |
| **E6 · política** | conforme D3 | sem ele, o eixo tático não existe |

~~Com E1×E2×E3×E4 são **72 células**; com E5 em dois níveis, 144.~~ **Superado:** a tabela de eixos
acima é a proposta original, e a §0.5 tem a valendo (E2 ganhou um quarto nível, entraram E7 e E9,
E5 foi a 17 perfis, E6 ficou em 5 e entraram o E10 e o E11). A grade é de **112 células** (§0.10.1), depois de E5 sair do OFAT das âncoras e entrarem o E11 e as células hospedeiras. A justificativa das repetições,
logo abaixo, não depende do número de células e continua valendo inteira.

**Quantas repetições, e por quê.** O número não sai de "1000", sai de duas contas:

- **Para as médias e o p95.** A conta é sobre a **métrica principal**, e ela mudou com o D8b: era
  paradas **por batalha** e passou a ser paradas **por Tick** (§2.6). A unidade da amostra continua
  sendo a batalha (o que entra na conta é o resumo por batalha da métrica), mas a quantidade deixou
  de herdar a variância da duração, porque a duração agora está no denominador. Para o erro relativo
  da média ficar em ±5% com 95% de confiança, `n ≈ (1,96 · CV / 0,05)²`, que com CV 0,5 dá **~385 por
  célula**, arredondado para **500**.

  **E aqui vai uma consequência do D8b que ninguém tinha rastreado: o CV de paradas por Tick deve ser
  MENOR que o de paradas por batalha**, exatamente porque o fator duração saiu, e um CV menor pede um
  `n` menor. O 0,5 continua sendo assumido e não medido; **quem decide é o piloto**, que já está
  especificado para medir o CV da métrica nova (§0.10.2). Se ele vier em 0,3, o `n` cai para ~140 e o
  piso de 400 do p95 passa a ser o que manda. **As 500 continuam valendo até o piloto falar**, e o
  número que pode encolher é o da média, nunca o da cauda.
- **Para a cauda.** Um quantil só é estimável com observações além dele. A regra prática de ao menos
  20 observações acima do quantil dá **n ≥ 400 para o p95** e **n ≥ 2000 para o p99**. Esta conta
  **não** muda com o D8b: ela é sobre o número de batalhas, e não sobre a unidade da métrica. Então: 500 por
  célula em toda a grade, e **2000** só nas células em que a cauda **é** a pergunta, que são as de E4
  (o alvo mais rápido) e a de E1(a) com E3 na horda (o uníssono, que é onde o pico mora).
- **O que não precisa de muitas batalhas.** A distribuição de N(T), o pico por Tick e a fração de
  Ticks vazios têm **uma observação por Tick**, não por batalha: uma célula de 500 batalhas de 45
  Ticks dá 22.500 observações. Essas métricas já estão saturadas bem antes de 500.

~~Total da grade base: 72 × 500 = **36.000 batalhas**~~, e pela §0.10.1 são **56.000**, mais o
reforço da cauda. Pela R2 §D1 isso seriam
segundos de máquina na bancada; o harness com mapa será mais caro (a R2 §D3 registra o custo de
`caminharHex` como **NÃO MEDIDO**), e mesmo dez vezes mais caro continua sendo minutos. **O
orçamento não é a máquina, é o que se consegue ler**: 144 células já são mais tabelas do que se lê
numa sentada, e é por isso que os eixos precisam ser poucos e seus.

**Qual eixo eu espero que domine**, para você conferir depois. **Reescritas em 02/09 na unidade do
D8b**: toda previsão que estava em carga **total por batalha** virou carga **por Tick**, porque a
total mistura carga com duração e a duração deixou de ser critério (§2.6).

1. **E1 domina o pico e quase não move a carga por Tick.** Previsão falsificável: no nível uníssono,
   a fração de Ticks-com-golpe que têm **dois ou mais** golpes deve ficar perto de 100%; no nível
   coprimo, perto de zero (uma ou duas colisões na batalha inteira). A **média** de paradas por Tick
   deve mudar pouco entre os quatro níveis, porque o número de golpes por Tick é o mesmo em média; o
   que E1 muda é a **cauda**, e a previsão é sobre o p99 e o pico, não sobre a média.
   *(A versão anterior dizia "o total de paradas por batalha deve mudar pouco". Era a mesma
   previsão numa unidade que não distingue "poucas paradas" de "batalha curta".)*
2. **E2 domina o tempo morto e o Tick vazio**, e é o eixo que mais muda a experiência do jogador,
   não a do mestre. Já estava na unidade certa: as duas são por etapa.
3. **E3 domina a carga por Tick**, quase linearmente no número de peças, e domina o pico junto com
   E1: horda uníssona é o pior caso de tudo.
   *(Dizia "domina o total de paradas". O total cresce com as peças **e** com a duração; a previsão
   que interessa é que a carga de cada Tick cresce, que é o que o mestre sente.)*
4. **E4 é binário no resultado**: ou a batalha fecha, ou ela não fecha nunca. **Isso é contexto, não
   critério**: a fração que não fecha é métrica de contexto pelo D8b, e o que E4 tem de mostrar em
   unidade de critério é o **maior deslize** e os **adiamentos por ação**, que são espera do jogador.
   Espero pouca coisa no meio, e espero que a fração que não fecha seja alta o bastante para forçar
   a decisão da folga da perseguição (§0.45).
5. **E5 quase não muda a carga por Tick, e é isso que se está prevendo.** As nove bandeiras não
   acrescentam caixa nenhuma: `margem` muda o número dentro da folha que já abriu, `bloqueio` muda a
   Defesa comparada, `gate` pode **tirar** um gesto (o dano zerado dispensa a escrita de `pv_atual`,
   §0.8.1) e `modo2` **acrescenta um**, que é a escolha do modo. Previsão falsificável: a carga por
   Tick com o perfil cheio fica a menos de um gesto de distância da carga com tudo desligado, e a
   única bandeira que a move de forma visível é a `modo2`, para cima.
   *(A versão anterior dizia que E5 "deve encurtar a batalha e por consequência abaixar a carga
   total". Encurtar a batalha deixou de ser resultado bom ou ruim, e "abaixar a carga total" era a
   duração entrando pela porta dos fundos: uma regra que encurta a batalha abaixa qualquer total,
   sem ter tirado trabalho nenhum de Tick nenhum.)*

**Uma previsão que não existia e que a §2.6 nova pede:** o `gate` deve **abaixar** os gestos por golpe
aplicado na hospedeira dele, e é a única bandeira da qual se espera isso. Se ele subir, alguém está
abrindo uma folha para anunciar que o dano foi zero, e aí a regra é boa e a tela é o problema.

---

## 4. O que este harness não mede

Seção obrigatória, e é a que decide o quanto o resto vale.

| O que | Entra? | O instrumento que mediria | Mais barato que o harness? |
|---|---|---|---|
| **Custo de gravação por Tick no Grid real** (Supabase, rede, repintura) | **fora** | a suíte que já existe. `test-grid-simultaneo.mjs` já dirige o Edge com o mock de Supabase, e a R1 §9.2 já cronometrou 650 a 750 ms por clique no ⏭. Basta acrescentar um `performance.mark` em volta de `avancarTickSimultaneo` e contar as chamadas de `update` por Tick, que hoje são uma por peça que anda mais uma do relógio | **muito**. É uma adição a um teste que já roda, e entrega o fator que converte Tick em segundo |
| **Tempo humano por gesto** | **fora**, e nenhum código o produz | ou medição de mesa real com cronômetro, ou o mais barato: um carimbo no `showModal` e outro na resposta, gravados no `LOG`. Hoje isso não existe porque `logar` só é chamado **depois** da resposta (R2 §G1) | **muito mais barato**, e é o número que falta para tudo: sem ele, "12 gestos do mestre" não vira "a cena travou" |
| **Tempo morto do jogador** | **parcial** | em Ticks, o harness mede (§2.6). Em segundos, não: um Tick não tem duração até os dois itens acima serem medidos. A composição é `segundos = Ticks × custo do ⏭ + paradas no caminho × tempo humano por gesto`, e o harness entrega só o primeiro fator de cada produto | o que falta é justamente o que os dois instrumentos acima dariam |
| **Abandono de caixa e correção manual** | **fora** | só existe em mesa real, e hoje **não é registrável nem lá**: nada é gravado quando alguém fecha uma caixa sem responder. Exige um contador no `close` sem resposta, por parada | **muito mais barato**, e é uma linha por caixa |
| **Se as regras são divertidas** | fora | nenhum instrumento deste projeto | não se aplica |
| **Se o mestre teria decidido melhor** | fora | nenhum. Toda métrica é condicional à política de D3, e trocar a política troca o número | não se aplica |
| **A carga das Artes** | fora, salvo Q10 | e mesmo com Q10 = sim, a resistência não existe como regra fechada (R2 §E): o harness mediria a carga de uma regra inventada | não se aplica |
| **As 461 Técnicas** | fora | não são declaráveis no Grid (R2 §I.7). Medir o repertório do jogador sem elas mede o repertório que existe, que é o de 6 opções | não se aplica |
| **A atenção do mestre** | fora | ler o tabuleiro, lembrar de quem está com qual condição, decidir se vale interromper: nada disso é gesto, e a R2 §C4 mostra que 5 condições de dano por rodada dependem só de ele lembrar | exigiria observação de mesa |
| **A carga do sistema P/G/R e do normal** | fora por decisão sua | a bancada já mede o P/G/R sem mapa | já existe |
| **O valor da informação de N7 para uma pessoa** | fora | teste de mesa. O harness só consegue a diferença entre uma política que lê e a mesma cega (eixo E9), e esse número mede a qualidade das minhas cinco regras de leitura, não o valor da informação para quem joga. Um humano vê o que nenhuma regra minha codifica: que o inimigo está juntando gente num canto, que o companheiro vai morrer | muito mais barato: uma sessão observada, contando quantas vezes um declarante tardio muda de escolha depois de ver |
| **A legibilidade do rastro de N8** | fora | nenhum instrumento de código: é desenho de tela, e o harness não tem tela | idem, a mesma sessão |
| **A latência do Supabase de verdade** | **fora, e adiada por decisão** | uma mesa real com uma cena de bancada, cronometrando o avanço. **Decidido em 02/09: fica para depois do harness.** Até lá as métricas saem em Ticks e em gestos, e não em segundos, e esta é a maior lacuna conhecida do conjunto: sem ela, "110 ms por Tick" é o custo da página e não o que o jogador espera | mais barato que o harness, e independente dele |
| **O tempo que a fila de declaração de N4 custa ao mestre** | fora | cronometrar a fase de declaração com a fila ordenada na tela e sem ela, e contar quantas vezes o mestre reordena à mão (§0.49) | idem, a mesma sessão |

---

## 5. O menor experimento que já vale

A resposta tem duas metades, e a segunda é a desagradável.

**O que já vale, e não precisa da extração da resolução: um simulador de fila, sem dano.**

Ele usa só o que a R2 §A3 provou puro (`combate-tempo.ts`) mais `hex.ts`, e reimplementa apenas o
corpo do avanço (o passo 2 e o 3 da §2.2, que são 60 linhas de `avancarTickSimultaneo`). As peças
declaram, andam, perseguem, os golpes vencem e são **contados**, e ninguém morre: a cena roda um
número fixo de Ticks. Sem dano, ele não precisa de D2 (não há regra de dano faltando para escolher),
não precisa da tabela de custo de tela, e não precisa de `folhaDaAcao`.

O que ele responde, de verdade:

- **a distribuição de N(T)**, o número de golpes que vencem no mesmo Tick, contra a forma fechada da
  R2 §H1. É o teste da previsão E1 da §3;
- **o pico por Tick** e quantas vezes ele acontece, que é o pior caso da R2 §H4 medido em vez de
  deduzido;
- **quanto a re-projeção empilha** entre peças e quanto ela desliza dentro de uma (R2 §H2), com o
  perseguidor que nunca alcança, que é o eixo E4 inteiro;
- **a fração de Ticks vazios**, o clique de ⏭ que não produz nada;
- **se as oito fontes de sincronia da R2 §H3 se somam ou se cancelam** numa cena de verdade.

O que ele **não** responde: qualquer coisa com "por batalha" no denominador. Sem morte não há
duração, e sem duração não há "paradas por batalha", nem carga do mestre por cena, nem comparação
entre perfis de regra.

> **O D8b encolheu o tamanho dessa perda** (§2.6, propagado em 02/09). Tudo o que está nessa frase é
> métrica de **contexto** agora, e nenhuma delas reprova uma regra. O que reprova é por etapa, e o
> por etapa não precisa de morte: paradas por Tick, gestos por golpe, pico num Tick e tempo morto
> saem de uma batalha que não termina exatamente como saem de uma que termina. A frase continua
> verdadeira e passou a custar menos.

**E a metade desagradável: para a métrica que você quer, não há nada menor.**

A carga do mestre por batalha depende de quantos golpes a batalha tem, que depende de quanto ela
dura, que depende do dano, que mora em `folhaDaAcao` misturado com o modal e com o Supabase. Não
existe atalho que responda "quanto o mestre trabalha numa cena" sem antes tirar a resolução de dentro
da tela. Qualquer coisa que eu construísse por fora seria uma segunda `lib-tempo.mjs`, e a §2.1 já
mostrou onde isso termina.

Há, porém, uma coisa **ainda menor** que qualquer das duas e que responde a uma pergunta sua sozinha:
instrumentar a suíte que já roda no Edge para contar as gravações por Tick e cronometrar o ⏭ (§4,
primeira linha). Isso não é harness nenhum, é instrumentação de um teste que já existe, e entrega o
fator que converte todo Tick simulado em segundo de mesa.

---

## D16 a D28 · as decisões do espelho de motor (03/09)

Uma linha cada, com o custo. **O texto inteiro está na `08-espelho-e-bateria.md` §4**,
e é lá que cada uma é justificada; aqui ficam o enunciado e o preço, que é o que
precisa estar no canônico.

| # | A decisão | O que ela custa |
|---|---|---|
| **D16** | o espelho roda a cena que a MESA consegue rodar, e a única extensão é a elegibilidade do robô (`?espelho=1` estende de criatura para qualquer peça em `dados.auto`) | o filtro `tipo === 'criatura'` não é comparado, e numa cena real metade das declarações vem de gente |
| **D17** | o harness copia o MOTOR e não o projeto: a ordem do Tick é passo → declaração → retrato → resolução | a bateria mede um Grid que contraria N5 e N6. Medir a regra nova exige implementá-la na mesa antes (é o L1) |
| **D18** | a fonte de dados do harness rola acerto E dano sempre, como a folha | o harness consome mais acaso do que a régua exigiria. Sem isto, um erro separava as duas sequências semeadas |
| **D19** | o golpe que cai em quem já caiu se resolve, com folha, dado e Pressão | mais paradas por batalha do que a bateria anterior contava. Se isso é regra desejável é outra pergunta (L15 do Pendencias) |
| **D20** | o carimbo da fila é reescrito quando a peça anda, como na mesa | o harness copia um defeito: o critério de estabilidade da fila deixa de ser estável numa perseguição (L13) |
| **D21** | o espelho roda em `rolagem: 'site'`; a bateria assume `rolagem: 'mesa'` | os dois instrumentos rodam em modos diferentes. Não muda o laço, muda o custo de tela: 2 gestos por folha contra 4 |
| **D22** | o custo de tela sai do código (`scripts/sim/custo-tela.mjs`), e só a declaração na mão continua ⚑ | o número é gesto, e não segundo. O fator de conversão continua sendo o L7 |
| **D23** | a célula uníssona roda 50 voltas, e não 500 | intervalo maior nas uníssonas. Como a resposta delas é categórica (100% estouram), não muda leitura nenhuma |
| **D24** | as cinco políticas da §0.4 P4 NÃO entram nesta passada | não há como separar a carga da política da carga do sistema. A alternativa era pôr quatro robôs inventados no centro da medição |
| **D25** | o elenco continua com dois arquétipos | nem Arte, nem projétil, nem criatura de bestiário estão no caminho medido |
| **D26** | os invariantes pararam em doze, e quatro são de INSTRUMENTO (V6 a V9) | os de regra continuam faltando, e continuam desnecessários enquanto a regra vier de módulo com teste e com espelho |
| **D27** | a partição de quatro estados do Tick substitui as duas colunas | a tabela tem quatro colunas onde tinha duas, e comparar com o relatório anterior exige a tradução (a linha e a coluna) |
| **D28** | a banda da fração passa a ter `agenda` como duvidosa, além da re-projeção | a banda ficou larga (20% a 55%). A anterior era estreita porque duvidava de menos |

**E a regra que continua valendo acima de todas:** número inventado não é só uma
etiqueta no relatório, ele produz um jogo que não existe (D13). A lista ⚑ inteira
está na `08` §5, e os dois itens que mais pesam são o mesmo assunto: o robô da mesa
é simples demais para o que a bateria quer medir.

---

## D29 a D36 · as decisões da bateria grande (03/09)

O texto inteiro está na `09-bateria-grande.md` §5. Aqui o enunciado e o preço.

| # | A decisão | O que ela custa |
|---|---|---|
| **D29** | a batalha se parte em fase de COMBATE e fase de FUGA (a troca vale no Tick seguinte à primeira declaração de fuga), e o número do topo é o do combate | duas tabelas onde havia uma, e a fatia de fuga fica com amostra minúscula nas células encostadas (1 Tick). Lê-se a coluna Δ, não a média agregada da fuga |
| **D30** | a grade real é o núcleo cruzado `E1(2) × E2(4) × E3(3)` vezes o limiar (2) = 48 células: **88 das 112 oficiais não rodam** com as bandeiras desligadas | nada sobre bandeiras, políticas, obstáculo, leitura, reforço nem criaturas. É a medida do Grid de hoje com o robô de hoje |
| **D31** | E4 (assimetria de passo) foi CORTADO, e quem o cortou foi a bateria de sanidade: zero re-projeções contra 0,3 da âncora | a assimetria não é medida. O que ela ia medir está medido e é maior: a re-projeção vem da multidão que se tranca, e não do passo |
| **D32** | o limiar de fuga entra como eixo, por parâmetro opcional em `decisaoAutomatica` com o padrão da regra | um parâmetro novo numa função de produção. É o preço de medir sensibilidade sem inventar política |
| **D33** | n = 400 pelo piso do p95, e não 13 pelo CV medido (0,00 a 0,089) | trinta vezes mais batalhas do que a precisão da média exigiria. Vale porque as principais incluem p90, p99 e pico |
| **D34** | a régua é fixa e a sanidade roda antes; nada se corrige no meio | um conserto obriga a bateria inteira a rodar de novo, e obrigou (o corte de E4). São 37 segundos aqui e não seriam numa bateria de horas |
| **D35** | teto de tempo por PROCESSO, além do teto de Ticks | uma faixa morta vira leitura incompleta com alarme, em vez de bateria pendurada. O teto de Ticks vive dentro do laço que trava e não pega isso |
| **D36** | os seis sinais de bateria ineficaz são conferidos e impressos alto, fora das tabelas | um sinal aceso exige explicação escrita antes de o número sair. A alternativa é ninguém olhar, que foi o que aconteceu nas duas rodadas anteriores |

## D37 a D40 · as quatro decisões de regra do chat (03/09)

Levantadas pela primeira execução da grade e respondidas no chat. O texto está na
`09-bateria-grande.md` §5.1, com o que cada uma moveu nos números.

| # | A decisão | O que ela custa |
|---|---|---|
| **D37** | o tipo de dano da ficha segue o `principal: true` do catálogo, e não o primeiro por `MODO_ORDEM`. **Seis** das dez armas de mais de um modo mudaram de categoria de Absorção, medidas em `scripts/dano-por-tipo.mjs`; a sexta é a alabarda, e ela entra pela D45 e não por esta (com três principais, quem decidia era a ordem de exibição) | o `dados_hash` mudou e a bateria inteira rodou de novo. E é mudança de EQUILÍBRIO, não de vitrine: o Machado sobe 230% no dano líquido por golpe contra alvo sem armadura e desce 50% contra malha. O sinal depende do alvo |
| **D38** | o golpe que cai num alvo já no chão REDIRECIONA para um inimigo ao alcance. Caiu num Tick anterior, dá para cancelar; caiu neste Tick, só redirecionar. Regra nova em `regras.json` | uma decisão de classe i onde havia uma folha inteira de iii mais uma de ii. E some a Pressão cobrada de um corpo caído |
| **D39** | a fuga automática anda com a perna da peça (`passoNoModo`), e não com o 6 da tabela | as perseguições ficaram mais lentas, porque o arranque da maioria é menor que 6. É o preço de o caramujo fugir de caramujo |
| **D40** | o desempate da fila é a iniciativa rolada, e o `movido_em` sai do comparador | a horda do mesmo bicho, com iniciativas iguais, passa a depender do id, que é arbitrário. É melhor que depender de quem andou por último |

**O que as quatro moveram juntas:** o número do topo foi de 18%–59% para **20%–55%**, e a
re-projeção nas células grandes caiu quase pela metade (11.791 → 5.895 na uníssona extrema de
2×8). **Nenhuma conclusão mudou de sinal**, que é o resultado que se quer de um conserto: ele
move números e não vira a leitura.

## D41 a D44 · a revisão das quatro decisões (03/09)

Vieram da leitura crítica das D37 a D40. Três delas consertam o instrumento e uma
conserta a regra que a D38 tinha escrito pela metade.

| # | A decisão | O que ela custa |
|---|---|---|
| **D41** | o RETRATO DA ABERTURA do Tick é a única fonte de verdade do golpe no caído: quem estava de pé quando o Tick abriu está de pé para todos os golpes dele. Caiu num Tick anterior, cancela ou redireciona; caiu neste Tick, o golpe resolve como declarado | a D38 dependia de qual peça o laço processou primeiro, e isso é ordem de laço vazando para dentro de um sistema simultâneo. O preço é que um golpe pode cair num corpo que acabou de cair, e isso agora é a ficção do simultâneo e não um defeito |
| **D42** | a bateria publica DUAS frações, nunca uma: a das PARADAS que é iii e a dos GESTOS que é iii | a segunda é menor de contar e maior de explicar. Sem ela o leitor troca "quantas vezes fui consultado" por "quanto eu trabalhei", que é a pergunta original |
| **D43** | a classe de cada tipo de parada sai do log, escrita pelo motor, e não de um mapa no agregador | uma cópia a menos. O mapa a mão já dizia `fugir` classe i e `aplicar` classe iii, quando o motor registra ii nas duas |
| **D44** | o custo de tela do redirecionamento e o critério "o mais próximo" entram na lista ⚑ | dois furos declarados em vez de dois números invisíveis. A bateria roda só peça automática, e portanto NÃO ENXERGA a caixa que o jogador veria |

## D45 a D48 · a segunda revisão (03/09)

| # | A decisão | O que ela custa |
|---|---|---|
| **D45** | a arma de vários modos principais declara qual vai na ficha, no campo `fichaModo` do catálogo. Só a Alabarda tem, o dado dela está certo (ela alterna sem penalidade), e o que estava errado era a ordem de exibição decidir em silêncio: saía impacto, o pior ou empatado-pior contra os três alvos de referência | um campo novo e uma conferência a mais no `validate`. E a Alabarda passa a bater de corte, que é mudança de balanço (`09` §5.4) |
| **D46** | cada sinal de bateria ineficaz imprime o veredito dele, aceso ou apagado | dez linhas a mais na saída, sempre. É o preço de "nenhum alarme" significar alguma coisa, em vez de ser indistinguível de "o alarme não rodou" |
| **D47** | nenhuma parada pode ter classe ausente ou fora de `{i, ii, iii}` (V15), e o agregador FALHA num tipo que ele não conhece em vez de carimbar `?` | um tipo de parada novo passa a parar o agregador até alguém decidir a classe dele. Carimbo por padrão é como uma classe errada entra sem ninguém ver |

| **D48** | o Tick MORTO (ninguém consultado, nada caiu, ninguém saiu do lugar) entra como contador próprio, ao lado do Tick sem parada | um `if` por peça por Tick no laço mais quente do harness. Sem ele a economia do avanço automático saía com teto no lugar de piso, 20% em vez de 11,4%, e a diferença inteira é Tick de travessia |

**E a conclusão do relatório foi reescrita em TRÊS termos, e não num** (`09` §2.3): 50% dos gestos
do mestre são classe iii (automação de regra), **33% são o clique do ⏭** (cadência de relógio, que
nenhuma bandeira e nenhuma decisão de regra toca) e 17% são classe ii (julgamento). Metade do
trabalho está fora do alcance de tudo o que este projeto vinha propondo, e o maior item dessa
metade não é julgamento, é apertar avançar.

---

**O que a primeira execução da grade achou e o chat resolveu:** a ficha escrevia o tipo de
dano errado em cinco das dez armas de mais de um modo. É a D37 acima; o `L19` do
`Pendencias.md` está fechado.
