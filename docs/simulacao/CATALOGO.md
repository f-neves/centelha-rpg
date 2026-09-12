# CATÁLOGO · as formas, e a pergunta que cada uma faz

**Este arquivo é a LISTA DE PERGUNTAS, e o dono dela.** Os casos continuam no princípio do
`02-projeto-harness.md`, que é onde cada forma foi achada e o que ela custou; aqui fica só o
que se pergunta ao escrever. Sem casos e sem história.

**A RÉGUA QUE ORGANIZA A LISTA: ancore a pergunta no SÍMBOLO, não no defeito.** Só sobrevive ao
instante da escrita a pergunta cujo gatilho é um símbolo que se está digitando, e não um conceito
de que seria preciso lembrar. Onde há símbolo, ele está na coluna do meio; onde não há, a coluna
diz **por gesto** e nomeia o momento, que é o mais fraco dos dois e vale saber qual é qual.

**E A LISTA NÃO É CONTADA.** Ela é lida. "Passe pelas doze formas" envelhece na forma nova
seguinte, e foi por isso que este arquivo precisou existir: a instrução citava um número, e o
catálogo não existia em lugar nenhum · morava como prosa dentro de um contrato que só uma das
partes lia.

**A REGRA DE USO:** instrumento novo passa por aqui **antes** de ser construído, e o desenho diz
quais formas se aplicam e o que fez com cada uma. Dizer "nenhuma se aplica" é resposta, desde que
seja escrita.

**E TODO GATILHO DE SÍMBOLO PRESSUPÕE QUE O OBJETO É O QUE O NOME DIZ.** Onde existe FACHADA (um
objeto que preserva a forma da chamada e troca o destino dela), ler o ponto da chamada não basta:
é preciso **resolver o que o receptor é ali**. `ctx.SB.from(...).update(...)` tem a mesma cara nas
duas abas e vai para lugares diferentes. A emenda vale para a tabela inteira, e não para uma linha
dela.

**E TODO PORTÃO NOVO PASSA PELO ENSAIO DOS TRÊS SENTIDOS**, antes de ser publicado: **vermelho
hoje**; **verde com o conserto, sem tocar no arquivo do portão**; **vermelho de novo com a
regressão**. Foi ele que reprovou duas versões do portão da migração 36 em vez de publicá-las, e a
segunda tinha ficado verde por cegueira.

---

## As formas

| a forma | o gatilho | a pergunta |
|---|---|---|
| **o zero ambíguo** | `count`, `length`, `sum`, `?? 0`, todo 0 publicado | este zero é RESULTADO ou é ausência de medida? |
| **a falha que devolve zero** | `catch`, `try`, valor de erro somado | isto é zero medido, ou é "não consegui ler"? |
| **a asserção sem ocasião** | `ok(`, `assert`, todo teste verde de primeira | a ocasião foi MONTADA, ou ela passa provando nada? |
| **a asserção negativa sozinha** | `!`, `não`, `nenhum`, `zero` numa asserção | e o PAR que mostra a coisa acontecendo? |
| **o mecanismo que nada executa** (L25) | constante exportada, bandeira, função nova | quem LÊ isto? |
| **o transporte que descarta** | `CAMPOS_*`, `pick`, `select('a,b')`, lista de chaves | a chave nova chega na OUTRA PONTA? |
| **a leitura-modificação-escrita de foto local** (L41) | `{...obj}`, `.filter`, `update({ campo: inteiro })` | quem MAIS escreve este campo? |
| **a fachada que preserva a forma e troca o destino** | `ctx.SB`, `SB`, cliente que chegou por parâmetro | quem é este SB NESTA aba, e o que a RPC faz com este campo? |
| **o portão que casa por texto fixo** | `.test(`, `includes(`, `like '`, todo portão novo | o que faz este portão ficar VERDE sem o problema ter sido resolvido? |
| **a garantia correta sobre o eixo errado** | "cobre", "uma forma nova falha alto", "isto é coberto" | verdadeira sobre QUAL dimensão, e ela é a que importa aqui? |
| **a remoção escrita como coleção inteira** | `.filter(` seguido de `update({ campo: ... })` | se este campo passar a SOMAR no servidor, esta remoção ainda remove? |
| **o escalar que descreve um conjunto** | `min(`, `max(`, `última`, "a partir de", "desde" | isto é o limite, ou é a prova de que o CONJUNTO inteiro acima dele cumpre a regra? |
| **o que não sabe dizer TIRE** | `\|\|`, `coalesce`, `filter`, `{...spread}` | isto sabe dizer TIRE, e não só PÕE? |
| **a conferência que CONTA em vez de NOMEAR** | `count(*)`, `like 'x%'`, `.length ===` | conta o mundo, ou nomeia o que este arquivo define? |
| **achar por POSIÇÃO** | `[0]`, `.at(-1)`, `limit 1`, `arquivo:123` | e se a ordem mudar? |
| **a referência por posição a lista que existe duas vezes** | "opção 1", "o segundo", numeração em prosa | esta lista existe em outro lugar, com outra ordem? |
| **a negação categórica** | "não é preciso", "não há como", "nunca" | e a OUTRA DIREÇÃO? |
| **a tolerância sem dono** | "por enquanto", "provisório", "até que" | quem decide que acabou, e o programa sabe responder? |
| **o comentário que afirma garantia** | "aparece na hora", "garante", "é impossível" | o que RODA isso? |
| **a medida batizada com o nome da causa** | nome de variável ou de coluna que afirma um porquê | o número mede o que o nome diz? |
| **o instrumento de bancada citado como prova** | `?lances=1`, mock, dublê, fixture | isto existe FORA da bancada? |
| **o dublê que não imita a forma da interface** | `async () =>` no lugar de um encadeável | o dublê tem as duas metades (aguardável E encadeável)? |
| **o `$` da regex em multilinha** | `$`, `^`, a flag `m` | o `$` casa no fim de QUAL linha? |
| **a semelhança por um elemento só** | `Set`, interseção, `1.00` | um único elemento em comum já é "o mesmo"? |
| **o texto a mais lido como sinal** | parser de seção, "a seção inteira é" | conteúdo depois da palavra muda o veredito? |
| **a janela entre a migração e o dado que ela lê** | migração que LÊ, semente, `where exists` | o dado que ela lê já EXISTE quando ela roda? |
| **o portão nunca visto vermelho** | portão novo, gate, `--check` | eu já VI este vermelho? |
| **a afirmação contra afirmação** | *por gesto:* decidir cortar alguma coisa | isto virou PROIBIÇÃO OBSERVÁVEL, ou só prosa? |
| **o fato que ninguém consegue perguntar daqui** | *por gesto:* sondar, inferir, "provavelmente rodou" | dá para trazer a resposta para DENTRO? |
| **a asserção esvaziada por mudança de contrato** | laço com teto cujo número de iterações muda | esta asserção ainda mede o que o rótulo diz, ou ficou verde por o laço nunca mais bater no caso raro? |
| **a asserção que imprime ORDINAL ou CONTAGEM cujo denominador é contrato** | ordinal de laço, `i + 1`, `.length` de um array que cresce com a implementação | se um clique passar a valer dez, este número ainda mede alguma coisa? |
| **a constante de conversão com duas candidatas plausíveis** | converter uma TAXA (por Tick, por segundo, por linha) numa unidade TOTAL, ou vice-versa | esta constante é a MÉDIA da grandeza que multiplica (duração, tamanho), ou é outra estatística da mesma tabela que também "parece" servir? |
| **a cópia segurada por um detector, e não por disciplina** | duas implementações da mesma conta (não o mesmo corpo — a mesma MATEMÁTICA, escrita duas vezes), com uma fixture de regressão no meio | o detector cobre TODOS os ramos que mudaram, ou só o estado em que a fixture foi gravada? |
| **a conferência que cobre só a parte viva do registro** (L72) | portão que filtra por estado ("os itens abertos", "só o que está ativo", `status = 'open'`) | o que saiu do escopo continua sendo conferido por alguém, ou "verde" quer dizer "verde no que eu olho"? |
| **a costura de teste que RECALCULA em vez de OBSERVAR** (L74) | `window.__ALGO = () => mesmaFuncao(...)`, seam exposta atrás de bandeira de teste, helper chamado dos dois lados | isto LÊ o que o código de produção escreveu, ou refaz a conta por fora? Reverta o defeito e rode: se ficar verde, não cobre |
| **o segundo ponto de decisão, dentro da MESMA função** | consertar uma conta e não perguntar onde MAIS ela se decide | o que a função que APLICA o efeito (`aplicarDano`, `baixarVida`, o `update` de verdade) lê — é o valor que acabei de consertar, ou outro calculado em paralelo? |
| **as duas metades de um par movendo-se juntas** | um teste com um caso "liga" e um caso "desliga" que passam OU falham juntos | os dois medem o mecanismo, ou os dois dependem do mesmo insumo, e um insumo quebrado move os dois na mesma direção? |
| **o teste novo que nasce já fora do portão** | um `.mjs` novo em `scripts/`, entrada nova em `scripts.smoke` | ele entrou em TODA lista que precisa dele, ou só na primeira em que alguém lembrou? |
| **o número que sobrevive ao dado que o produziu** | uma bateria/corpus ad hoc, apagado ou gitignorado, citado num documento depois de rodar | quem ler isto amanhã consegue reproduzir o dado, ou só herda o número? |
| **fechado com condição pendente dentro** (A11) | `[FEITO]`/`[DECIDIDO]`/`[FECHADO]` na mesma frase que "quando", "assim que" ou "depois que" nomeia um evento que ainda não aconteceu | o evento que o próprio texto nomeia já aconteceu, ou o item só parece fechado enquanto ele não vem? |
| **o acesso tolerante que nunca lança** (B12) | `campo \|\| []`, `campo?.x`, todo acesso que devolve valor válido em vez de lançar | isto é o caminho certo, ou é um caminho errado que nunca vai denunciar a si mesmo? |
| **fechar a frente sem fechar o documento** (H1/H2/K28/D2) | trabalho implementado e commitado, item do mapa ainda `[ ]` | o mapa sabe que isto já aconteceu, ou só o código sabe? |
| **o resultado que chegou e ninguém leu** | processo em background, arquivo de saída, exit code | isto terminou, e a saída já foi lida? |
| **o documento que se justifica por um fato falso sobre si** | cabeçalho novo que diz "não é o mesmo que", "é mais completo que", "é cópia parcial de" | o `diff` concorda com a frase que faz este arquivo existir? |
| **o caminho alternativo que trata a recusa certa como falha** (L67) | uma segunda passada, um `retry`, um "se não conseguiu, tente de novo com menos restrição" | não ter conseguido é o sintoma de um destino errado, ou é a regra funcionando? |
| **a regra publicada que nunca é chamada** | *por gesto:* escrever "já existe" sobre uma peça, citando dados ou capítulo | existe em CÓDIGO com chamador, ou é texto publicado que ninguém executa? |
| **o sinal de vida escrito no fim** | *por gesto:* escrever o arquivo de progresso, o log de etapas, o relatório com horários | esta linha está sendo escrita AGORA porque a etapa fechou agora, ou estou narrando de trás para a frente? |
| **o rótulo de escopo do `git diff`** | `@@ -A,B +C,D @@ <texto>` | este texto depois do `@@` diz ONDE a edição está, ou é só a linha que PARECE cabeçalho de função mais próxima acima do hunk? |
| **o `&&` depois do cano** | `comando \| tail -3 && próximo`, todo encadeamento em que a guarda vem depois de um cano | o `&&` está guardando o comando que eu escrevi, ou o código de saída do `tail`, que dá certo mesmo quando o da esquerda falhou? |
| **o intervalo medido da ponta errada** | *por gesto:* ler `idle`, um horário de notificação, um "parado desde", e concluir atraso de alguém | este intervalo começa quando o OUTRO recebeu a tarefa, ou quando EU olhei pela última vez? |
| **narrar o conserto na notação que o portão lê** | "era X e virou Y" sobre uma citação de código, com X escrito como `arquivo:NNN` entre crases | o portão vai ler X como afirmação de HOJE, ou eu escrevi o estado antigo na única forma que o instrumento entende como atual? |
| **o `git diff` que não vê o arquivo novo** *(irmã da de cima, achada pela Executora em 12/09)* | conferir a própria edição com `git diff` numa rodada que criou arquivo | o `git diff` está calado porque não há o que achar, ou porque o arquivo ainda não é rastreado e ele não vê o que o git não conhece? Em arquivo novo, `grep` direto no arquivo resolve numa linha. |
| **a contagem que vira condição de parada do outro** | dizer a alguém quantos itens conferir ("o comentário lista quatro caminhos") | este número é o que eu quero que ele MEÇA, ou vai virar o ponto em que ele PARA? Nomear os itens custa uma linha e não trunca varredura. |
| **a ferramenta relativa rodada duas vezes** | qualquer script cujo efeito é um DESLOCAMENTO (reapontar, renumerar, migrar): `reapontar.mjs` é o caso | ela calcula a partir de um ESTADO ANTERIOR que ainda não virou commit? Se sim, a segunda passada aplica o mesmo delta de novo, e o resultado parece trabalho feito. Rodar de novo tem de ser inócuo, ou tem de gritar. |
| **a base que não é o HEAD** | reconstruir citações, números ou referências "a partir do commitado" | o documento entrou verde NESTE commit, ou num anterior? Documento commitado antes do código que ele cita é correto para o código daquele dia, e usá-lo como base contra o HEAD desloca tudo pela diferença entre os dois. |
| **o proofread um passo tarde demais** | reler números no resumo (aviso, relatório, mensagem) e achar erros | estes números já estão em algum lugar IMUTÁVEL, escrito antes deste resumo? Mensagem de commit empurrada não se reescreve: a releitura pertence ao momento anterior ao commit que carrega o número, não ao documento que o resume. Não é falta de atenção, é o ponto da corrente onde a conferência foi posta. |
| **a frase certa no canal errado** | pedir que um achado apareça num documento, por ele ser importante | quem LÊ este documento é a audiência desta frase? Aviso é para quem revisa (mecanismo e números); "o que muda para quem abre a mesa amanhã" é para a mensagem de commit e para o humano. Conteúdo certo no canal errado se parece com esquecimento e não é. |

**DUAS NOVAS, DE 06/09/2026, ACHADAS NA REVISÃO DO AVANÇO UNIFICADO:** a primeira é o gatilho —
fica verde, o rótulo continua descrevendo o que deveria medir, e nada acusa a mudança por baixo. A
segunda é a régua para não recair nela: quando a contagem É a medição, afirme a contagem; quando
não é, o laço é espera, e espera não reporta ordinal como se fosse achado.

**E O RECORTE DE UMA VARREDURA PARA ESTA FAMÍLIA, porque é o que a torna repetível:** o raio do
avanço unificado não é o ARQUIVO nem a FORMA do código, é a QUERY da cena. Uma cena cujo `goto()`
não pede `tempo=simultaneo` cai no `else` de `SIML()` (o modo antigo) e não sentiu a mudança de
contrato nenhuma, mesmo tendo a MESMA forma de laço e o mesmo `dica`/`.title` que as cenas
afetadas. `test-grid.mjs:2480` (`dica: btn.title`) é a forma exata, e é falso positivo por isso: quem varrer de novo
por esta família olha o `goto` da cena antes do laço, não o laço sozinho.

**São 35**, e a contagem é do dia em que o arquivo nasceu (nasceu com 25, fechou o primeiro dia
com 29, ganhou mais uma no dia seguinte, mais uma em 08/09 e duas em 10/09) · ela não é para
ser citada em instrução nenhuma, pelo motivo escrito lá em cima.

**Duas se dobram conforme quem lê**, e vale dito porque explica a divergência entre contagens: a
*asserção sem ocasião* e a *asserção negativa sozinha* são a mesma cegueira em dois gestos (uma é
o cenário que não foi montado, a outra é a ausência da ausência); e o *zero ambíguo* e a *falha
que devolve zero* saem do mesmo valor por caminhos diferentes. Juntando os dois pares, 28.

**AS QUATRO NOVAS DE 05/09/2026 SAÍRAM DO MESMO DIA, e três delas de dentro do conserto das
outras**, que é o que as torna caras:

- **a fachada** custou saída dupla em produção (**L45**);
- **o portão que casa por texto fixo** é o zero ambíguo em forma de portão, e apareceu **dentro do
  instrumento feito para prevenir a família**: a segunda versão do portão da 36 procurava
  `.update({ mordidos` e ficou verde quando o próprio conserto trocou aquilo por `.update(patch)`.
  **Mudar o nome de uma coisa é o que um conserto faz o tempo todo**, e um portão que casa por
  literal fica verde exatamente quando o conserto acontece;
- **a garantia correta sobre o eixo errado** é a fachada falando de si mesma: ela promete que
  forma NOVA falha alto, e o que quebrou foi uma das cinco formas mudando de SIGNIFICADO no
  servidor. Não é meia verdade nem verdade expirada;
- **a remoção escrita como coleção inteira** é a que está escrita ANTES de custar alguma coisa, e
  é a terceira vez que o mesmo conserto quebraria uma remoção. Ver **L38**.

**E UMA QUINTA, DE UM DIA DEPOIS (06/09/2026), ACHADA NO PRÓPRIO INSTRUMENTO QUE RESOLVEU A QUARTA
CATEGORIA:** a leitura da tabela `migracoes` usava `min(numero) where not a_mao` como se essa conta
JÁ PROVASSE "tudo acima é automático", quando ela só prova "esta linha é automática". **É a
terceira vez que a mesma forma aparece no mesmo instrumento**: a 36 recusando publicar "a última
migração" (evitada por desenho), a conferencia por `count(*)` do L44 (corrigida depois de
envelhecer), e esta (corrigida antes de custar, pela revisora). O conserto: a fronteira virou uma
VIEW que afirma a ausência de exceção (`migracoes_fronteira`, migração 37), e não só um número.

**As duas últimas da tabela não têm gatilho de símbolo**, e são as mais fracas da lista justamente por
isso. A primeira já tem instrumento parcial (a lista de proibições observáveis); a segunda ganhou
o dela em 05/09/2026, com a tabela `migracoes` da migração 36.

**UM CASO QUE FOI CHAMADO DE DORMENTE E NÃO ERA, corrigido em 06/09/2026 (mesmo dia do achado
inicial):** a entrada anterior desta lista registrava `scripts/sim/agregar.mjs:481` (`x.fracaoSemGolpe || 0`) lendo
`x.fracaoSemGolpe || 0` como um risco "que não dispara hoje". Uma segunda conferência mediu o
corpus em disco (19 diretórios, 288.900 batalhas) em vez de confiar na leitura do código, e achou
que DISPARAVA, todo dia, em 57,1% das batalhas: a fase de fuga tem `ticks = 0` sempre que ninguém
foge, e `frac` (a origem, `log.mjs:291`) devolvia **zero**, não ausência, para "não há amostra" —
"0% dos Ticks ficaram sem golpe" quando não houve Tick nenhum. O efeito era mensurável: na bateria
publicada, a coluna "s/golpe" da fase de fuga saía a 0,18 na célula `coprimo-encostado-1v1`
contando o zero falso, e a 0,71 sem ele. **A lição, sobre a lição:** "não dispara hoje" era uma
leitura de código sem medir o corpus que o código lê, e por isso era exatamente o tipo de garantia
que esta mesma tabela desconfia (ver a seção acima). O conserto não foi nos leitores: foi na
origem (`frac` devolve `null` com `ticks` zerado) mais uma porta em `agregar.mjs` que valida a
forma de cada registro ao ler e recusa qualquer campo ausente que não seja o único legado
conhecido (`paradasSubLado`). Isso tira todo `x.campo || 0` de campo-que-pode-faltar do arquivo por
construção (são pelo menos dez, sobre cinco campos com leitura múltipla, num total de quarenta
`\|\| 0` no arquivo) sem precisar tocar em cada um.

**UM SEGUNDO CASO DO PORTÃO QUE CASA POR LITERAL, DE 06/09/2026, E É O MAIS FINO DA FAMÍLIA:**
o detector de "chamado pelo harness" (`scripts/test-cobertura-lib.mjs`, o próprio instrumento do
**L48**) usava uma classe de caracteres que excluía um ponto antes de `L`/`LIB`/`M`, e por isso não
via `...L.contrapeDe(c.acao)` como chamada: o ponto do espalhamento `...` fica exatamente onde a
classe recusava. **É o MESMO furo, letra por letra**, que já tinha mordido o detector do lado da
mesa (`usa()`, no mesmo arquivo) numa rodada anterior, e a correção de lá não foi copiada para cá.
**O que torna este caso diferente dos outros da lista:** nos outros, o portão nasceu depois do
defeito, para vigiá-lo, e o furo apareceu DENTRO do portão novo. Aqui o furo apareceu duas vezes
**dentro do MESMO instrumento**, uma vez em cada metade dele (a metade que lê a mesa, a metade que
lê o harness) — o portão feito para achar a divergência entre os dois lados tinha, ele mesmo, os
dois lados assimétricos na mesma classe de erro. Corrigido com a mesma alternativa (`\.\.\.`) nos
dois detectores, e com autoteste que planta um `...L.nome(...)` sintético para os dois lados não
regredirem em silêncio.

**UM CASO NOVO, DE 06/09/2026, ACHADO PEDINDO A CONVERSÃO INVERSA DE UM `n` DE
PODER ESTATÍSTICO:** duas constantes convertiam a mesma unidade (gesto por Tick →
gesto por batalha), e as duas pareciam plausíveis de cabeça: a TAXA média
(gestos/Tick, `3,72`) e a DURAÇÃO média (Ticks/batalha, `50,495`). Só a segunda
fecha dimensionalmente (`gesto/Tick × Tick/batalha = gesto/batalha`); a primeira
não fecha (`gesto/Tick × gesto/Tick` não é `gesto/batalha`), mas o número que ela
produz (`Δ_total/taxa`) tem a aparência certa — sai um número da ordem certa de
grandeza, só que errado. **O que torna este caso caro são DOIS números, e não um
só** (a revisora pegou os dois sendo tratados como o mesmo, CORRIGE 1 da rodada 13):

- **o erro de CONSTANTE, `184×`:** o `n` de um teste de poder escala com o
  QUADRADO da constante de conversão. Convertendo o mesmo Δ (1 gesto por
  batalha) com a constante certa (duração, `50,495`), `n≈2.527`; com a errada
  (taxa, `3,72`), `n≈14`. A razão das duas é `13,57²≈184×`. É uma comparação
  entre DUAS FORMAS de converter a mesma coisa; nenhum `n≈14` chegou a ser
  publicado nesta frente.
- **o efeito de NÃO CONVERTER, `≈2.550×`:** o número de fato publicado antes da
  correção não vinha de uma constante errada, vinha de tomar Δ = 1 gesto/Tick
  LITERALMENTE, como se essa unidade já fosse o alvo (`n≈1`), contra o mesmo
  `n≈2.527` da conversão certa. É esta razão, e não `184×`, que separa "a grade
  já basta" (`n=1`) de "a grade não basta" (`n=2.527`).

Os dois são reais e os dois valem o registro, mas medem coisas diferentes: um é
o custo de escolher a constante errada, o outro é o custo de não converter.
**A pergunta que teria pego isto ANTES de publicar:** a unidade fecha, membro a
membro, sem cancelar nada por acidente? `gesto/Tick` dividido por `gesto/Tick`
devolve um número puro, não um `Tick`; a conta só fazia sentido porque os dois
lados eram gestos, e o "gesto" cancelava escondendo que sobrava `1/Tick` em vez de
`Tick`.

**UM CASO NOVO, DE 06/09/2026, ACHADO LIGANDO A BANDEIRA `porte`:** `grid.astro`
não importa `src/lib/lance.ts`. A mesa tem uma cópia INLINE do mesmo algoritmo
(`contaDoLance`, dentro de `folhaDaAcao`) e a sincronia com o `resolverGolpe`
puro do harness existe só porque `scripts/test-lance.mjs` compara os dois contra
1.315 lances gravados (`scripts/fixtures/lances.jsonl`). **Não são o mesmo corpo
citado duas vezes** (a forma da linha da tabela, "o portão que casa por literal"):
são **duas implementações independentes da mesma conta**, e o que as segura não é
disciplina, é um detector. É a mesma classe de risco do `lib-tempo.mjs` (cinco
divergências, cada lado verde sozinho nos próprios testes) e é pior numa coisa: lá
a divergência aparecia em Tick e duração; aqui ela aparece no **dano aplicado**,
na mesa em que se joga.

**O tamanho, medido e não estimado:** dos 1.315 lances gravados, **1.315 têm
`entrada.perfil` gravado** (as quinze chaves, todas `false` — a fixture é de
antes de qualquer bandeira existir), e **zero têm alguma bandeira `true`**. O
detector cobre 100% do estado "todas desligadas" e 0% de qualquer outro. Pior:
**nenhum teste automatizado deste repositório, fixture ou navegador, cria um
combatente `tipo: 'criatura'`** (conferido: zero ocorrências de `monstro_id` em
`scripts/test-*.mjs`) — as cenas do `test-espelho` e do `test-grid` são só PC ×
PC, sempre porte Médio dos dois lados. Isso significa que a bandeira `porte`
inteira (a normalização do rótulo, o sinal, a busca em `MON[...]`) rodou **sem
nenhum teste automatizado a exercitar com um delta diferente de zero** — só a
função pura `modificadorPorte` foi conferida isolada (`test-bandeiras.mjs`), e o
`npm run smoke` ficou verde por não tocar no caminho que mudou. **Cada bandeira
nova que entrar do mesmo jeito (a próxima é `gate`) soma à mesma superfície
descoberta**, e ela não encolhe sozinha: só encolhe no dia em que alguém gravar
lances novos com bandeira ligada, ou escrever um teste com uma criatura de
porte diferente do Médio.

**A pergunta que teria pego isto antes de publicar:** o detector que prova que
as duas cópias concordam foi gravado DEPOIS ou ANTES da mudança que estou
prestes a fazer? Se foi antes, ele prova que elas concordavam num mundo que já
não existe, e não diz nada sobre o mundo novo.

**UM CASO NOVO, DE 06/09/2026, E É DIFERENTE DO DE CIMA: o gatilho não é
arquivo diferente, é FUNÇÃO IGUAL.** Ligar o gate exigia zerar o dano quando o
golpe resvala, e o conserto entrou em `contaDoLance` (a função de dentro de
`folhaDaAcao` que alimenta o oráculo e a tela) e parou aí. `contaDoLance` não é
o que desce a Vida: quem chama `aplicarDano` — a função que de fato subtrai da
Vida do alvo — é `fim()`, um closure DIFERENTE, na MESMA `folhaDaAcao`, que
recalcula o dano do zero a partir do campo digitado (`rdDanoFim`), sem passar
pela conta que acabara de ser consertada. Sem o segundo conserto, o gate teria
zerado o REGISTRO e deixado a Vida cair inteira — exatamente o inverso do que
"ligar o gate" deveria fazer, e do jeito mais perigoso de errar: o log diria
uma coisa, a mesa jogaria outra.

**A diferença para "a cópia segurada por um detector" (acima):** lá são dois
ARQUIVOS (a mesa e o harness), duas implementações completas, e o que os
prende é uma fixture externa. Aqui é uma função só, dois PONTOS internos que
decidem a mesma coisa por caminhos de código diferentes — não há duplicação de
arquivo para grep, e `contaDoLance` PARECE o lugar certo, porque é ele que a
tela e o oráculo leem. O gatilho que teria achado sozinho: depois de consertar
uma conta, perguntar "o que a função que APLICA o efeito de verdade
(`aplicarDano`, `baixarVida`, o `update` que grava no banco) lê?" — e não "onde
está a conta que acabei de mexer?". As duas perguntas têm respostas diferentes
sempre que a leitura e a aplicação vivem em lugares distintos do mesmo fluxo.

**Havia um TERCEIRO ponto, achado procurando os outros dois: `pintarDano`,**
a prévia que mostra ao mestre "se você aplicar isto, acontece aquilo" antes de
qualquer clique. Ela lê `contaDoLance()` para a Absorção, mas computava o
"passa N" sozinha a partir do campo digitado, sem checar o gate — com ele
ligado, a prévia diria "passa 5" e o resultado de verdade, depois do clique,
sairia zero. Não afeta a Vida (é só texto), mas é o mesmo defeito de espécie:
uma terceira leitura que não sabia da regra nova. Consertado junto.

**A busca não achou um quarto.** `soakDe(` (a função que resolve Absorção por
modo) tem exatamente dois chamadores em `grid.astro` — os dois já corrigidos —
e nenhum outro trecho recomputa `bruto`/`liquido`/veredito de golpe fora de
`folhaDaAcao`. Registrado aqui para o dia em que uma bandeira nova (`margem`,
`bloqueio`, `teto6`) entrar: os MESMOS três pontos (`contaDoLance`, `fim`,
`pintarDano`) são onde ela vai precisar aparecer, e não só um deles.

**E O CASO IRMÃO, achado respondendo por que a trava de duas listas
(`CAMPOS_MESA`/`FORA_DA_MESA`, `gen-monsters.mjs`) não pegou o mesmo
`perfArma` sumindo uma segunda vez:** a trava audita só as chaves de TOPO do
registro da criatura (`Object.keys(m)`), e `combate` é uma chave de topo só —
ela passa inteira, sem re-auditar o que tem dentro. O transporte que descartou
`perfArma` mora um nível mais fundo, num `.map()` manual que monta
`combate.ataques[]` linha a linha (a mesma forma da linha "o transporte que
descarta" desta tabela, `CAMPOS_*`/`pick`/`select`), e é um transporte
DIFERENTE, sem trava nenhuma sobre ele. A pergunta da linha da tabela ("a
chave nova chega na OUTRA PONTA?") continua certa; o que faltou foi perguntá-la
de novo em CADA `.map()` que reconstrói um objeto campo a campo, e não só na
fronteira de mais alto nível que tem um nome e uma trava.

**NÃO É UM SÓ, E ISSO MUDA A RESPOSTA (contado em 07/09/2026, dentro da
mesma função que construiu `ataques[]`):** `gen-monsters.mjs` tem **sete**
`.map()` de campo a campo na mesma peça de código, todos do mesmo risco —
`habilidades` e `lore` aparecem **duas vezes cada**, uma convertendo PARA o
satélite (`x.nome → n`) e outra convertendo DE VOLTA (`x.n → nome`), dois
saltos e dois jeitos de perder um campo — mais `poderes` e `artes`. Fora
desta função, `gen-bestiario.mjs` tem mais três, de risco menor (catálogos
de referência — `{id, nome}` — e não dado de combate por criatura).

**Com sete no mesmo lugar, a trava genérica vale mais que sete travas
escritas à mão.** `CAMPOS_MESA`/`FORA_DA_MESA` já resolveu isto uma vez para
as chaves de TOPO (`Object.keys(m)` contra as duas listas); a mesma forma —
um par de listas e uma asserção que soma as duas contra `Object.keys` do
que existe — serve para qualquer `.map()` de campo a campo, aplicada no
ponto onde ele roda, com a lista de campos que ELE conhece (não a de topo).
Não construído nesta rodada: é registro de tamanho, para quem decidir se
vale a pena escrever a versão genérica ou consertar os sete à mão.

**UM CASO NOVO, DE 07/09/2026, E É O MELHOR EXEMPLO QUE ESTA FRENTE JÁ
PRODUZIU DE "a asserção sem ocasião":** a primeira versão de
`test-bandeiras-mesa.mjs` usava `mon-aboleth` (Absorção de Perfuração 13)
para provar que o gate resvala. A Adaga (`1d6+1`) nunca fura 13 sozinha —
**com o gate LIGADO ou DESLIGADO, o resultado era o mesmo: a Vida não
descia.** A asserção "a Vida não desceu" ficava verde nos dois estados, e só
o ensaio dos três sentidos (rodar com a bandeira desligada e checar que o
teste vira vermelho) expôs que ela não tinha ocasião nenhuma: a cena nunca
dava ao gate a chance de fazer diferença, porque a Absorção sozinha já
zerava o dano antes de qualquer resvalar. Trocado por `guarda-da-cidade`
(Absorção de Perfuração 2), onde o gate LIGADO e DESLIGADO dão respostas
DIFERENTES — só aí a asserção mede o gate, e não a Absorção do alvo.

**E O SEGUNDO, QUE É FORMA NOVA E NÃO REPETIÇÃO DO PRIMEIRO:** a mesma cena,
já com o alvo certo, ainda passava com o gate quebrado, porque a ficha do
atacante (o `numeros` de `mesa-mock.mjs`) esquecia `perfArma`/`resistPerf`
no override — sem eles, `ra.perfArma` caía em `null` e o gate nunca
disparava, então o par "b0 abre" e "b2 resvala" **passavam ou falhavam
juntos**, sempre pelo mesmo motivo errado (o insumo comum quebrado), nunca
porque o mecanismo funcionasse. **O par existe para proteger contra as DUAS
METADES medirem a mesma coisa por acidente** (o controle negativo da
"asserção sem ocasião"); ele não protege contra as duas dependerem do MESMO
insumo quebrado, porque aí a correlação entre elas continua perfeita — só
que pela razão errada. **O gatilho:** quando as duas metades de um par se
movem JUNTAS (as duas passam, ou as duas falham, na mesma rodada em que algo
mudou), desconfie de insumo comum antes de comemorar a consistência — a
pergunta não é "elas concordam?", é "elas concordam **pelo mecanismo que eu
quero medir**, ou por um dado que as duas leem igual e que pode estar
errado?".

**A FORMA OPERACIONAL DA PERGUNTA, da revisora (07/09/2026), que é o que
torna o gatilho de cima uma coisa que se FAZ, e não só uma coisa que se
desconfia:** *se eu quebrar de propósito o dado que deveria separar os dois
casos, os dois ainda dão resultados diferentes, ou colapsam para o mesmo?*
No caso do gate: zerar `perfArma` do atacante à mão (o mesmo insumo que
faltou) e rodar o par de novo — se `b0` continuasse abrindo e `b2`
continuasse resvalando, o par seria robusto ao insumo comum; como os dois
colapsaram para "sempre abre", o par não estava vivo pelo mecanismo, estava
vivo pelo acidente de o insumo estar certo NAQUELE dia. **A distinção que
fecha:** um par bem desenhado prova que duas coisas diferentes CONTINUAM
diferentes; não prova, sozinho, que a diferença vem do canal certo — para
isso, o par precisa ser desafiado quebrando o insumo comum de propósito, e
não só lido depois de passar.

**UM TERCEIRO CASO, DE 07/09/2026, E É VARIANTE DO "TRANSPORTE QUE DESCARTA",
NÃO REPETIÇÃO DELE:** `test-bandeiras-mesa.mjs` nasceu, entrou em
`package.json` (`scripts.smoke`), e nunca entrou na matriz do CI
(`.github/workflows/validate.yml`, `strategy.matrix.teste`) porque a matriz é
uma lista escrita à mão, num arquivo diferente, e ninguém tem o hábito de
abrir os dois toda vez que um teste nasce. O teste rodava localmente,
`npm run smoke` passava, e o portão do CI nunca o viu: não é o portão inteiro
faltando (`test-portoes.mjs` já checava que todo teste está em ALGUM
portão), é um teste NOVO nascendo já fora de UM dos dois. **O gatilho é o
mesmo do "transporte que descarta": duas listas que precisam concordar
(`scripts.smoke` e a matriz do YAML), sustentadas só por disciplina.** A
régua que já existe para esse gatilho serve de novo aqui: fonte única (uma
lista gera a outra), ou cópia com detector (uma asserção que compara as duas
listas nas duas direções, com controle positivo para provar que a extração
achou algo de verdade). Escolhido o detector: `test-portoes.mjs` ganhou o
item 6, que faz exatamente essa comparação.

**UM QUARTO CASO, DE 07/09/2026, NOMEADO PELO HUMANO NA HORA (o nome é dele):
O NÚMERO QUE SOBREVIVE AO DADO QUE O PRODUZIU.** Tentando separar os 34,0%
do `L26` por lado do atacante, rodei uma bateria ad hoc (`.sim/
techlead-modosite`, gitignorada, 7.200 batalhas) e cheguei a 49,0%/51,0%. O
número respondia a outra pergunta e não a que fora feita (ver `Pendencias.md`
`L26`), então apaguei a pasta depois de ler o resultado, do jeito que a
convenção do `.sim/` já prevê ("cada uma tem o seu manifesto e é refeita").
**O que quase aconteceu: o número ficou na prosa, o dado que o produziu não.**
Sem a ressalva escrita, daqui a um mês alguém leria "49,0%/51,0%, medido" e
citaria como se o corpus existisse, quando na verdade só é reproduzível
rodando de novo (semente e commit anotados). **A diferença para o
"instrumento de bancada citado como prova" (tabela acima):** ali o defeito é
citar um ambiente de teste como se fosse produção; aqui o dado é real e a
medição é correta, só que **efêmera por escolha de quem mediu**, e a prosa
não herda essa marca de validade sozinha — precisa dizer, na mesma frase, que
o dado se foi. **O gatilho:** todo número medido numa bateria/corpus que não
é o publicado desta frente (não tem `--gravar`, não vira `docs/simulacao/
resultados/*.txt`) carrega a pergunta ANTES de ser escrito num documento:
quem ler isto depois de eu apagar a pasta consegue reproduzir, ou só herda o
número?

**UM CASO NOVO, DE 10/09/2026, VARIANTE DA "ESPERA SEM CHECAGEM" (`PASSAGEM.md §4`) QUE AQUELA
LISTA NÃO TINHA:** as quatro entradas de lá são sinal que NÃO VEIO (o `smoke` terminando sem
aviso, uma mensagem descartada como redundante, a Revisora parando no meio de uma falsificação,
a Executora em "running" indefinido). **Esta é sinal que VEIO, e ninguém leu.** Um teste de
bancada (a barra de comando, item 1 do `VOZ.md`) tinha terminado com `exit 1` antes de o
Arquiteto perguntar pelo estado da Executora, e ela relatou "testando ao vivo, aguardando o
resultado" — a frase continuou circulando 42 minutos depois de deixar de ser verdade. Quem
disparou o comando relatou o DISPARO, não o resultado, e a frase não foi atualizada quando o
resultado chegou. A mesma causa que `ARQUITETO.md §7` já cataloga ("descrever o pedido como se
fosse o resultado"), agora do lado de quem executa um comando, não só do lado de quem relata o
trabalho de outra instância.

**O conserto, que vale para toda instância do arranjo, incluindo o Arquiteto (`ARQUITETO.md
§1.4`):** quem dispara um comando lê o código de saída e a saída dele antes de dizer qualquer
coisa sobre o comando. "Rodando" só é frase válida com processo conferido; depois de disparar e
antes de conferir, a frase certa é "não sei ainda", nunca "rodando" por presunção.

**UM CASO NOVO, DE 10/09/2026, E ELE APAGOU 2.078 LINHAS:** `CONTRATO-REVISORA-ORIGINAL.md`
nasceu em 08/09/2026 com um cabeçalho afirmando que **não era o mesmo texto** de
`REVISORA.md`, "que já era uma cópia parcial". `diff` dos dois: o corpo é idêntico, e a única
diferença são as linhas de cabeçalho de cada um. **A frase falsa era a justificativa inteira
para o arquivo existir**, e ela se reproduziu: o `README.md` da pasta repetiu ("mais completa
que `REVISORA.md`, que já era cópia parcial") sem que ninguém rodasse o `diff`. Achado pelo
humano numa conferência da pasta, três dias depois; o arquivo foi apagado e as três citações
vivas (README, `PASSAGEM.md §9`, `MAPA.md`) reapontadas para `REVISORA.md`.

**O que torna esta forma diferente da "garantia correta sobre o eixo errado":** lá a
afirmação é sobre o comportamento do código e envelhece quando o código muda. Aqui a
afirmação é sobre **outro arquivo**, era falsa no instante em que foi escrita, e ninguém
reconfere afirmação sobre conteúdo alheio — ela só é verificável por um comando que ninguém
tem motivo para rodar (`diff`), porque o texto que a contém soa como procedência, e
procedência é justamente o que se lê para não precisar conferir. **A régua que sai disto
está no `ARQUITETO.md §5.5`:** documento aponta para outro (nome, caminho, para que serve),
não descreve o conteúdo dele.

**UMA FORMA NOVA, DE 10/09/2026, ACHADA NUMA BATALHA DE MESA (`Pendencias.md` L67):** a
perseguição no corpo a corpo mira um destino calculado do CENTRO do alvo, sem somar o raio dele.
Contra uma criatura que ocupa vários hexágonos, esse destino cai DENTRO do corpo dela. A primeira
caminhada veta as casas ocupadas e por isso **não consegue chegar lá** · que é a regra de ocupação
funcionando exatamente como deve. Só que "não aproximou" é o gatilho de uma segunda passada que
afrouxa o veto para a casa exata do outro token, e a peça entra no corpo do inimigo.

**O que torna esta forma sua:** a segunda passada não é um erro de lógica, é um conserto legítimo
de OUTRO caso · um Enorme parado ao lado veta os seis vizinhos de quem encosta nele e prendia quem
não devia estar preso, e o comentário no código explica isso com todas as letras. O defeito é que a
condição escolhida para disparar o afrouxamento ("não aproximou") **é ambígua entre duas causas
opostas**: o caminho está bloqueado por gente demais, ou o destino é impossível por construção. No
primeiro caso afrouxar é certo; no segundo, afrouxar é passar por cima da resposta correta.

**A pergunta que a acha:** quando este caminho alternativo dispara, a primeira tentativa falhou
porque o mundo estava apertado, ou porque **o que eu pedi não existe**? Se as duas causas entram
pela mesma porta, a segunda vai ser tratada como a primeira, e o resultado é um estado que a
própria regra do sistema declara impossível · aqui, uma peça parada numa casa que a função de
ocupação responde estar ocupada.

**Parente de duas formas que já estão nesta lista.** Do "acesso tolerante que nunca lança" (B12),
porque o afrouxamento é uma tolerância que não denuncia a si mesma; e da forma do `L66`, porque a
invariante mora nos CHAMADORES em vez de morar na escrita · aqui a gravação final não passa pela
checagem de ocupação, então nada entre a decisão errada e o banco tem chance de recusar.

**UMA FORMA NOVA, DE 10/09/2026, ACHADA NUM LEVANTAMENTO E NÃO NUMA REVISÃO** (a Revisora, ao
levantar o que existia antes de a régua da Conjuração ser escrita): **"já existe" tem dois sentidos
que ninguém separa ao dizer a frase.** Uma peça pode existir em código, com chamador, girando; ou
existir como regra publicada em `regras.json` e no capítulo, sem nada que a execute.

**Apareceu três vezes no mesmo levantamento**, em pontos independentes: `reguaDaArte` (a fórmula
`Preparo = 2 + nível` está em dados **e** em código, e `grep` não acha um único chamador fora da
própria definição); o teste de concentração ao sofrer dano (regra publicada, sem implementação); e
`arcano.composta` (texto publicado, e no código só um comentário que o cita). Três vezes não é
coincidência, é um padrão do repositório · a régua entra primeiro e a chamada às vezes não vem.

**O que a torna perigosa é o lugar onde ela é lida.** Ninguém a encontra escrevendo código: ela é
encontrada por quem está **planejando**, e o efeito é dimensionar errado. "A fórmula já existe,
é só usar" e "a fórmula está escrita e o motor nunca a executou" levam a estimativas diferentes, e
a segunda costuma esconder o fato de que ligar a peça exige abrir um estado que não há. Foi
exatamente esse o caso aqui: a Preparação de vários Ticks para Arte de jogador não existe, e a
fórmula do tempo dela estava pronta havia meses.

**Parente da "garantia correta sobre o eixo errado", e a diferença importa:** lá a afirmação é
verdadeira e mede a dimensão errada; aqui a afirmação é verdadeira sobre o texto e falsa sobre o
comportamento. O conserto é o mesmo gesto em ambos os casos, e é barato: ao escrever "já existe",
dizer **em que nível** · em dados, em código com chamador, ou só publicado.

**UMA FORMA NOVA, DE 10/09/2026, E ELA APARECEU DUAS VEZES NO MESMO DIA, EM DUAS INSTÂNCIAS
DIFERENTES, A SEGUNDA COM AVISO EXPLÍCITO NA MÃO.** O arquivo de progresso em disco
(`ARQUITETO.md §1.2`, `CONTRATO-REVISORA.md §6`) existe para uma coisa só: **ser incremental.** O
Arquiteto lê o `mtime` e sabe que a instância estava viva naquele instante. É o instrumento que a
regra do `§1` criou depois de ele ter afirmado que um teste estava rodando quando já tinha
terminado.

**As duas vezes, medidas:** a Revisora escreveu linhas de 16:45 e 17:20 num arquivo cujo `mtime`
era 16:18. A Executora, depois de eu avisar sobre esse caso e com a frase *"hora lida da máquina,
nunca estimada"* escrita por ela mesma no cabeçalho do próprio arquivo, escreveu quatro linhas num
`write` só às **18:54:42**, três delas datadas 18:58, 19:04 e 19:11 · até dezessete minutos no
futuro.

**O defeito não são os horários errados, e tratá-los como o defeito é errar o alvo.** O defeito é
que o arquivo deixou de ser sinal e virou **resumo**: escrito de uma vez no fim, ele conta a
história das etapas em vez de provar que elas aconteceram. E aí ele é **pior do que não existir**,
porque quem confere para de conferir · o `mtime` continua respondendo, mas responde sobre o
instante da narração, não sobre o instante do trabalho.

**Por que ela é difícil de ver de dentro:** escrever o arquivo no fim é o gesto natural de quem
está concentrado. Ninguém interrompe uma leitura de código para escrever uma linha de log; o
impulso é fazer o trabalho e depois documentá-lo, e documentar depois é uma virtude em quase todo
outro contexto. **É o único artefato do projeto em que o MOMENTO da escrita é o conteúdo**, e é por
isso que o hábito certo em todo o resto produz aqui exatamente o artefato errado.

**O conserto, e é um gesto e não uma regra nova:** um `write` por etapa, no instante em que ela
fecha, com a hora lida da máquina naquele momento. E a válvula que torna a regra cumprível:
**etapa sem hora é honesta; hora inventada não é.** Quem fechou três etapas e só então lembrou do
arquivo escreve as três sem hora, e não inventa três horas plausíveis.

**UMA FORMA NOVA, DE 11/09/2026: O COMMIT QUE PARECE PUBLICADO.** No fim da rodada 38, quatro
commits (um meu, tres dela) estavam so na maquina. `git log -1` mostrava o commit certo no topo,
`git status --short` vinha limpo, o `npm run validate` do `pre-commit` tinha passado, o aviso a
Revisora estava escrito com os tres shas corretos e a Executora se declarou ociosa esperando o
veredito. Nada disso e falso, e nada disso e publicacao.

**O defeito e de instrumento, nao de disciplina.** Os dois comandos que a equipe usa para provar
estado no disco (`ARQUITETO.md` §1) sao exatamente os dois que nao distinguem o caso: o commit
publicado e o commit que ficou na maquina tem o mesmo `git log -1` e o mesmo `git status`. Quem
confere ve verde e conclui verde. **O comando que separa os dois e
`git rev-list --count origin/main..HEAD`**, e ele custa nada.

**O que corria calado enquanto isso, e e por aqui que a forma morde:** o deploy e por push
(`CLAUDE.md`, Producao), entao o codigo da rodada existia so localmente e o site publicado seguia
sem ele; e o CI nao tinha execucao nova, enquanto eu contava execucoes do `Smoke · test-grid` para
responder ao humano sobre o L75. Eu estaria esperando um numero que nao ia chegar por decisao
nenhuma, so por falta de um push. **Toda espera desta semana teve a mesma anatomia:** um lado
achando que o outro ja tinha o que precisava, e a conferencia disponivel medindo a coisa vizinha.

**Parente da "garantia correta sobre o eixo errado", e aqui a parentela e literal:** a afirmacao
"commitado e limpo" e verdadeira, e a pergunta era outra. O conserto e um gesto no fecho de rodada,
depois do `--enviar`: contar o que falta subir, e subir.

**A MESMA FORMA, MEIA HORA DEPOIS, E DESTA VEZ QUASE CUSTOU O TRABALHO DE ALGUEM.** A Revisora
commitou a contraprova do D38c na worktree dela, avisou que o push nao era fast-forward e nao
empurrou, certo. Eu entao mandei a ela, como higiene para a rodada seguinte,
`git fetch && git checkout --detach origin/main`. O commit dela, que nao estava no `origin` nem em
lugar nenhum alem daquele `HEAD` destacado, **ficou sem referencia**: sobreviveu so no reflog, de
onde eu o resgatei por `cherry-pick`.

**A instrucao estava certa e incompleta, e incompleta aqui e o mesmo que errada.** Ressincronizar
worktree destacada e o gesto certo; faltou a ordem: **primeiro o commit chega ao `main`, depois a
worktree se move.** Um `HEAD` destacado nao tem ramo que segure o que ele criou, e trocar de
commit ali apaga a unica referencia que existia.

**E a raiz e a mesma da forma acima:** ninguem, nem ela nem eu, tinha um comando na rotina que
respondesse "o que eu fiz ja existe fora desta maquina?". Ela mediu o certo (o push recusado) e eu
respondi com um gesto que pressupunha o contrario. **A pergunta que faltava, de novo, e
`git rev-list --count origin/main..HEAD`**, e desta vez ela precisava ser feita por QUEM MANDA o
gesto, nao so por quem o executa.

**A FORMA DE 11/09/2026, E O QUE A TORNA DIGNA DE ENTRADA PROPRIA E A CONTAGEM: CINCO VEZES NUM
DIA, EM TRES PESSOAS DIFERENTES.** *A ferramenta responde com precisao sobre um recorte mais
estreito do que a pergunta, e a resposta e lida como se fosse sobre a pergunta.*

Todas as cinco, no mesmo dia, todas descobertas por outra pessoa e nao por quem as cometeu:

| o que foi perguntado | o que a ferramenta mediu | o erro que saiu |
|---|---|---|
| quanto demora o job `Smoke · test-grid` | a duracao dos jobs que CASAM com `test-grid` | um salto de CI que nunca existiu |
| qual era o pico do job antes do modelo | as cinco execucoes mais RECENTES antes do modelo | pico de 790 s, quando o real era 832 s |
| tem travessao no codigo novo da rodada | `git diff`, que nao enxerga arquivo NAO RASTREADO | "corrigi os dez, nao falta nada", faltavam nove |
| onde esta a chamada `SB.rpc(...)` citada | o prefixo `SB.rpc`, que aparece em sete lugares | erro relatado de 8000 linhas, o real era 50 |
| tem travessao no texto desta rodada | o diff do CODIGO da rodada, nao a prosa propria | um veredito com 37 travessoes dizendo que varreu |

**O que as cinco tem em comum, e nao e desatencao:** em todas, o comando estava certo e a saida era
verdadeira. O recorte foi escolhido por ser o que a ferramenta oferece de graca (o que casa por
substring, o mais recente, o rastreado, o prefixo, o diff) e nao por ser o que a pergunta pedia. **O
recorte respondeu no lugar de quem perguntou**, e como a resposta veio verdadeira, nada acendeu.

**Por que e dificil de ver de dentro:** uma saida FALSA e facil de pegar, porque bate de frente com
alguma outra coisa que se sabe. Uma saida verdadeira sobre o recorte errado nao bate com nada ·
ela e consistente consigo mesma, e so quem refizer a pergunta com outro recorte descobre. Por isso
as cinco foram achadas por OUTRA pessoa: nenhuma delas exigia mais cuidado, todas exigiam outro
ponto de vista.

**O gesto que as cinco teriam evitado, e ele e barato:** ao relatar, dizer o ESCOPO junto do
numero. Nao "rodei a varredura", e sim "rodei a varredura no diff do codigo". Nao "o pico era
790 s", e sim "o pico das cinco ultimas antes do modelo era 790 s". O escopo dito em voz alta e
onde o erro aparece, porque quem le percebe na hora que o escopo nao e a pergunta · e, com
frequencia, quem ESCREVE percebe antes de terminar a frase.

**"ÂNCORA MAIS PRÓXIMA" É UMA REGRA SOBRE BYTES, NÃO SOBRE O QUE O OLHO VÊ, E ELA PREFERE O
ANTES.** *Achado na rodada 41 (L72), reapontando à mão as citações de código que o portão de
procedência nunca tinha olhado dentro de item fechado.*

O script que confere `arquivo.ts:NNN` escolhe a âncora (o trecho entre crases que diz O QUE a
citação afirma) pela crase mais próxima do número citado. "Mais próxima" ali é distância de
CARACTERES a partir do INÍCIO da citação, contada nas duas direções. Isso parece simétrico e não
é: uma âncora que vem DEPOIS da citação só começa a contar depois do fim dela (o próprio texto da
citação, `src/pages/mesa/grid.astro:4611` · `function grupoDaVez`, tem trinta e tantos caracteres), enquanto uma âncora
ANTES conta a partir do início, sem esse desconto. A citação mais longa que a âncora empurra o
"depois" para mais longe do que o "antes" parece, de um jeito que ninguém vê olhando a linha
impressa: o olho lê `algo` (`arquivo:N`) `outra_coisa` como três pedaços igualmente próximos, e o
script lê dois deles a distâncias bem diferentes.

**Duas citações reais desta mesma rodada caíram nisso**, as duas escritas por quem está contando
este achado: `grupoDaVez` (`grid.astro:4611`) tinha a âncora certa (`function grupoDaVez`) escrita
DEPOIS da citação, e o script escolheu `!grupoDaVez` (um fragmento de código histórico, também em
crases, escrito ANTES) por ser mais "próximo" em bytes. O mesmo aconteceu com
`mesa-condicoes.ts:100-106` (`chip.addEventListener`), onde a âncora nova foi escrita numa linha seguinte por causa da
quebra do markdown, e a quebra de linha, sozinha, já bastava para separar âncora e citação em
"linhas" diferentes para o script, que só olha uma linha de texto por vez.

**Por que é difícil de ver de dentro:** o conserto parece pronto assim que a citação aponta para o
lugar certo e a âncora certa está escrita ao lado, em texto. Só rodando o verificador de novo
depois de cada lote é que os dois casos apareceram: a leitura visual da linha corrigida não
distinguia "a âncora que eu quis" da "âncora que o script vai escolher", porque as duas estavam ali,
em crases, a olho igualmente coladas na citação.

**O DESFECHO É O QUE FAZ ISTO SER GRAVE, e não o erro** (acrescentado pelo Arquiteto ao registro
dela): casar com a âncora errada **não deixa o portão vermelho.** Deixa ele VERDE sobre uma
citação que aponta para outro lugar. É o mesmo desfecho de "o portão que casa por texto fixo" e o
mesmo que o `L65` proíbe ao vetar reaponte por busca de âncora: a conferência passa a **confirmar
a coisa errada em vez de acusar**, e o vermelho, que é barato, nunca chega.

**E O ARQUITETO ERROU A PRESCRIÇÃO NA PRIMEIRA TENTATIVA, o que vale registrar porque é a quarta
vez no mesmo dia.** Ele escreveu, numa segunda entrada deste catálogo (removida e fundida nesta),
que a saída era pôr a âncora **depois** do número de linha. É o contrário do que está medido acima:
o script prefere a de ANTES. A regra certa é a que ela escreveu no fim deste verbete, e não uma
posição preferida · **uma âncora só, sem segundo trecho em crases na mesma linha.** O padrão do
erro é o do dia inteiro: uma regra deduzida de um achado verdadeiro, generalizada um passo além do
que o achado sustentava, e escrita por quem não tinha feito a medição.

**O gesto que evita isso, e ele é o mesmo dos outros da lista:** depois de reapontar uma âncora à
mão, rodar o verificador de novo antes de seguir para a próxima, em vez de confiar na leitura. E,
ao escrever a âncora, colocá-la na MESMA linha da citação e o mais perto possível dela, sem outro
trecho em crases entre as duas · não porque o script exija exatamente isso, mas porque é o único
jeito de a distância em bytes bater com a distância que o olho vê.

**O AMBIENTE HERDADO VENCE O CAMINHO EXPLICITO.** Achado pela Executora na rodada 42, em
11/09/2026, escrevendo o teste do `--enviar`.

O teste precisava rodar `git commit` de verdade, entao montou um repositorio de mentira e chamou
o `git` com o `cwd` apontado para la. **O commit foi parar no repositorio REAL.** A causa: o teste
roda de dentro do gancho de `pre-commit`, e um `git commit` em andamento exporta `GIT_DIR`,
`GIT_WORK_TREE` e `GIT_INDEX_FILE`. **Essas variaveis vencem o `cwd`**, entao o processo filho
obedece ao ambiente e ignora o diretorio em que foi posto.

**Por que o `cwd` parece suficiente e nao e:** trocar de diretorio e o gesto universal para dizer
"opere aqui", e funciona para quase toda ferramenta. Para as que leem o proprio ambiente (o `git`
e so a mais comum), o `cwd` e a fonte de MENOR precedencia, e nada no codigo do teste mostra isso ·
a variavel nao aparece em lugar nenhum do arquivo, porque quem a exportou foi o processo pai.

**O gesto que fica:** teste que invoca ferramenta sensivel a ambiente limpa o ambiente
explicitamente em TODA chamada, e nao so aponta o caminho. Vale para qualquer ferramenta com
configuracao por variavel, nao so para o `git`.

**E a segunda metade do caso vale sozinha:** ao relatar o estrago, o `git fsck` respondeu "31
objetos soltos", e o numero foi lido como "o que o meu teste deixou". Eram **um** do teste e trinta
de `stash` largado por varias sessoes desde 04/08. A ferramenta respondeu sobre o repositorio
inteiro; a pergunta era sobre um intervalo de dez minutos. **E a forma de 11/09 de novo**, e o
gesto que a evita e o mesmo: dizer o escopo junto do numero.

## O `&&` DEPOIS DO CANO · a guarda que guarda o `tail` (11/09/2026, Arquiteto)

**O gesto:** `git pull --rebase 2>&1 | tail -3 && git commit ...`, escrito duas vezes na
rodada 43, para não despejar quarenta linhas de saída de rebase no registro.

**O que acontece:** o código de saída de um cano é o do ÚLTIMO comando dele. O `pull` falhou
(`error: cannot pull with rebase: You have unstaged changes`), o `tail` imprimiu esse erro com
sucesso, e o `&&` leu o sucesso do `tail`. O commit rodou como se o rebase tivesse acontecido.

**Por que passou despercebido as duas vezes:** a mensagem de erro APARECE na saída, em letra
vermelha, na primeira linha. Ela foi lida como aviso, não como recusa, porque o comando seguinte
rodou · e um comando que roda depois de um erro é a evidência mais natural do mundo de que o erro
não era grave. A cadeia de raciocínio está certa e a premissa é falsa.

**O que salvou nas duas vezes foi sorte de intervalo:** ninguém tinha empurrado entre o último
`fetch` e o `push`. Com a Executora empurrando `41827b4` entre os dois commits do Arquiteto, uma
ordem um pouco diferente teria dado `push` recusado e rebase à mão de um commit de documento.

**O conserto é de ORDEM e não de bandeira:** `git commit` primeiro, `git pull --rebase` depois,
`git push` por último. Nessa ordem não há nada não commitado para o rebase reclamar, é o que os
dois commits acabaram fazendo por acidente, e é o que a regra de convívio do `CLAUDE.md` quer
dizer com "rebase antes de empurrar" num repositório com duas frentes.

**A forma geral, para além do `git`:** toda vez que uma guarda (`&&`, um `if`, um `assert`) vem
depois de um cano, ela está falando do fim do cano. Se o que interessa é o começo, o cano tem de
sair da frente da guarda.

## O INTERVALO MEDIDO DA PONTA ERRADA (11/09/2026, Arquiteto)

**O gesto:** ler a hora de uma notificação de `idle`, comparar com agora, e concluir que a outra
instância demorou a começar.

**O que aconteceu, duas vezes no mesmo dia.** Na rodada 45 eu registrei que "entre o despacho e o
início passou cerca de uma hora com ela marcada como disponível". Na 47, que tinham passado três
horas. Conferido depois no `git log`, que é onde a hora do despacho mora de verdade:

| rodada | commit do despacho | ela começou | intervalo real |
|---|---|---|---|
| 45 | `873c920`, 15:37 | 15:38 | **1 minuto** |
| 47 | `964f8f9`, 20:50 | 20:51 | **1 minuto** |

**As três horas eram minhas.** O veredito da rodada 46 entrou às 17:40 e eu só o absorvi e despachei
a 47 às 20:50. O relógio que eu estava lendo era o da minha própria demora.

**Por que engana:** a notificação de `idle` traz hora e a palavra "disponível", e as duas juntas
parecem dizer "esperando desde então". Elas dizem outra coisa: "estava sem tarefa às H". O começo
do intervalo que interessa é **quando o trabalho foi despachado**, e isso não está em notificação
nenhuma · está no commit, ou na hora da mensagem enviada.

**E o custo não é de contagem.** Uma observação com forma de acusação sobre um colega, publicada
para o humano, baseada num intervalo que eu não conferi. O trabalho dela estava certo nas duas
vezes, e o registro dizia o contrário. **Medir do lado errado é erro de número; medir do lado
errado sobre o trabalho de outra pessoa é outra coisa.**

**O gesto que fica:** antes de escrever que alguém demorou, achar o commit ou a mensagem que deu a
partida e medir dali. Se não der para achar o começo, a frase é "não sei quando ela recebeu", e
não um intervalo.

## A CONTAGEM QUE VIRA CONDIÇÃO DE PARADA DO OUTRO (12/09/2026, Arquiteto)

**O gesto:** passar um número de itens para quem vai conferi-los, sem que ele seja a conferência.

**O que aconteceu.** Eu mandei à Revisora que o comentário do `conferirChao` listava **quatro**
caminhos pelos quais alguém volta ao estado de pé. São **cinco**: a cura do menu, a Arte que devolve
Vida, a condição que o mestre tira à mão, o efeito que venceu sozinho, e a campainha do tempo real
trazendo pronto de fora. Ela respondeu falando dos "quatro", porque eu tinha escrito quatro.

**Por que isso é diferente de errar um número sozinho.** Ela ia conferir os caminhos **contra o
código**, que é o gesto certo. Mas um número dado de fora não entra na cabeça de quem confere como
dado a medir: entra como **quando parar**. Conferidos quatro, a tarefa parece cumprida. O quinto não
seria refutado nem confirmado, seria simplesmente não olhado · e no caso era o do tempo real, que é o
único em que o estado chega de fora já decidido, ou seja, o mais difícil dos cinco.

**A diferença que importa:** um número errado num registro é uma frase errada, e quem ler depois pode
conferir. Um número errado numa INSTRUÇÃO é uma varredura truncada, e o que falta nela não deixa
rastro nenhum. Ninguém escreve "não olhei o quinto", porque ninguém soube que havia um quinto.

**O gesto que fica:** ao mandar alguém conferir um conjunto, ou **nomear os itens** em vez de
contá-los, ou dizer que o número é do comentário e não da medição. E do lado de quem recebe: contar
de novo antes de usar a contagem alheia como fim de tarefa. É a mesma família do "diga o escopo ao
lado do número", agora na direção em que o número não descreve, **manda**.
