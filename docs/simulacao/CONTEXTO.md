# CONTEXTO · o estado corrente, para reabrir e continuar

**Para a Executora reabrir uma sessão e saber onde está**, e não para contar história.
Três regras que o mantêm útil:

- **só estado corrente, sem história.** O que fechou mora no `Pendencias.md` e nos commits.
- **é REESCRITO, não empilhado.** Linha que deixou de valer sai, não vira "antigamente".
- **ONDE JÁ EXISTE DONO, APONTA; onde não existe, escreve.** Restabelecer aqui um estado
  que já tem dono é institucionalizar a divergência · foi assim que o registro da migração
  33 passou a dizer menos do que o cabeçalho dela já dizia. **O que este documento carrega
  de próprio é o que veio do chat e não mora em arquivo nenhum.**

Última reescrita: **06/09/2026**.

---

## A frente de simulação (Grid) · a escada do L29

**Chamada de "fase 3" na revisão de 06/09/2026, e não tem nada a ver com a Fase 2/3 da seção
abaixo (essa é de OUTRA frente, o tabuleiro como experiência de combate).** Dona dos números:
`docs/simulacao/ESTADO.md`. Dona do índice dos sete itens: `Pendencias.md` L29. Aqui só o que
mudou de estado e ainda não está espelhado nos dois.

**O que entrou, com sha:** item 1 (a folha aceita as faces do dado digitadas, em vez do total ·
`045f491`/`b9d0b01`, guarda contra ajuste de pool corrigida em `00f3966`) e item 3 (o avanço
unificado resolve todos os golpes do Tick em que para · `55674f1`/`5bd7e8c`). Os dois já estão
"sim" no Grid, não são mais projeto.

**O que se dissolveu na medição:** o item 5 ("a parada abre todos os golpes do Tick") não é
degrau separado do 3 — é o MESMO código, medido depois de entregue. A escada de sete itens do
L29 tem seis itens reais a partir de agora, não sete.

**O que sobra, e por que cada um:** item 2 (o botão do veredito vira confirmação automática ·
banda 0% a 17,0%, e a banda é ignorância, não imprecisão — só vira número com a mesa decidindo
a taxa em que discorda do destaque); item 4 (as 15 contas não aplicadas da folha, 7 delas
bandeiras de regra desligadas em `regras.json` · ligar é decisão de regra, não conserto de
custo); item 6 / **L25** (as bandeiras lidas pelo motor); item 7 (o avanço MOSTRA o percurso em
vez de pedir confirmação · decisão de jogo, não construído).

**O teto de hoje é 76,7%/273.445, com a frase corrigida em 06/09/2026**: não são duas
testemunhas independentes batendo (subtração da tabela × cenário SEM-GESTO do agregador) — é o
MESMO contador (`golpeNoTick`, `log.mjs:224-226`) lido por duas exibições algebricamente
equivalentes, que por isso nunca poderiam se discordar. A robustez de verdade vem de
`ticksComGolpe + sobram = golpes` ser invariante a como os golpes se distribuem entre Ticks.
Perturbado à mão numa bateria real, o número não se moveu por essa razão, não pela concordância
das duas leituras. → o parágrafo inteiro: `ESTADO.md`, seção "O teto, com os consertos...".

**A BATERIA PUBLICADA É A `bmtq638zo`**, gravada em 06/09/2026 no commit `40ee8dd`, e ela é a
regravação da `bmtmbdppb` com o `frac` corrigido (`log.mjs`, devolve `null` com Ticks zerados em
vez de 0). O agregado é `docs/simulacao/resultados/09-bmtq638zo.txt`. **O que a troca mexeu, e
foi medido batalha a batalha antes de a tabela ser lida:** das 21.600, **9.830 saem idênticas
byte a byte** e as outras 11.770 diferem só nos quatro `fracao*` da fase de fuga, que eram `0` e
viraram `null`. No agregado isso chega em **duas colunas da tabela da fuga** (`s/parada` e
`s/golpe`), e em mais nada · nenhuma outra célula, contador, tabela ou alarme se moveu, e os dois
carimbos do cabeçalho (bateria e agregador) são a única outra diferença no arquivo inteiro.

**As 21 funções que a mesa chama e o harness não exercita: RESPONDIDO em 06/09/2026, e agora
tem dono.** É **sedimentação**, não decisão, e a prova é de medida e não de leitura: a ponte do
harness exporta 15 nomes que ele nunca chama, e um deles (`temGesto`) está reimplementado em
cópia local no `motor.mjs`. Lista de escopo decidido não carrega quinze nomes que ninguém pediu.
→ o levantamento, os quatro baldes e o custo de cada um: `Pendencias.md` **L48**. Quem guarda o
número daqui em diante é o `scripts/test-cobertura-lib.mjs`, no `validate`.

## A fase corrente

**Fase 2 · o tabuleiro como experiência completa de combate.** Fechada em **cinco de
seis**. Falta o **item 6, Interpor e desviar**, e ele está **parado por decisão da mesa,
não por trabalho**.

→ o levantamento inteiro, com o que falta para virar mecanismo: **L34 §6 do
`Pendencias.md`**.

**Regra permanente da fase:** *nenhuma fase termina em documento, toda fase termina com
coisa funcionando na mesa.*

## O congelamento

**A fase 3 não começou e não começa** até a mesa reavaliar o plano.

**A regra do que sai:** dado se perdendo em produção sai; o resto espera. Saíram por ela o
**L40** (registro do jogador · mitigado) e o **L43** (a marca da mordida · migração 35
escrita).

**Fica congelado mesmo com material pronto:** a **Corrida** pelo desenho da Investida
(fase 3), mesmo com o `marcarInvestida` sendo o molde · molde pronto não é motivo para
antecipar. E a **fase 2.5**, que é a tela da lembrança da névoa.

## As decisões da mesa que não moram em arquivo nenhum

Pelo NOME, porque número de opção depende de qual lista se está lendo.

- **A INVESTIDA VALE −4**, e não −6: investir é forma de aproximação, mesma família da
  Corrida, e gasta a guarda dela e nada mais.
- **O GRID ALIMENTA A CONDIÇÃO**: o motor não cobra a Investida, o número mora só na
  condição, e o tabuleiro a põe e a tira.
- **NÃO HÁ TERCEIRO PREÇO** · *onde a mesa corrige o próprio registro, não cobra; onde a
  mesa muda o que aconteceu na ficção, cobra.* É o teste para o resto do Grid.
- **A CONDIÇÃO COM PRAZO VENCE SOZINHA, A POSTA À MÃO NÃO VENCE NUNCA.**
- **O REFAZER NÃO APAGA LINHA DE JOGADOR**: ele reconstrói o que o motor escreveu; a Arte
  que o jogador conjurou é ação dele.
- **REVELAR QUEM JÁ FOI MORDIDO É DECISÃO DE JOGO, e não se toma de passagem** · foi por
  isso que a migração 35 funde o `mordidos` em vez de a view passar a mandá-lo.
- **OPÇÃO DE DECISÃO SE CHAMA PELO NOME, nunca pelo número**, e a generalização: qualquer
  referência por posição a uma lista que existe em dois lugares vai divergir.
- **DECISÃO DA MESA VEM EM MÚLTIPLA ESCOLHA, três opções ou mais**, feita na hora em que a
  decisão aparece e sem pedir licença.
- **A FURTIVIDADE DAS CRIATURAS É POR PORTE E CATEGORIA (Saída B), não por criatura (Saída A).**
  Uma tabela pequena sobre a Destreza, forma da casa (é a mesma do `COURACA` por porte). O preço
  assumido: assassino e camponês da mesma espécie ficam iguais até virar exceção escrita. →
  o dilema inteiro, com a Saída A ao lado: `Pendencias.md` **L35**, que ainda mostra as duas em
  aberto e precisa ser marcado com esta decisão.

## O que espera resposta da mesa

**1 · Interpor e desviar** (fase 2, item 6). *O capítulo publicado não tem regra de
interpor, desviar nem abortar, e o Abortar que está na tela saiu do `regras.json` e do
motor sem nunca ter chegado ao livro. Escrever a regra é da mesa. Qual é ela?*

**2 · O `grid.condicao` com dois sentidos.* *Lido como "a condição que isto aplica" em 57
Efeitos, escrito como "a condição com que isto se parece" em 9. Separa em dois campos, um
que o motor executa e um que só classifica?* → o enquadramento inteiro: **L39**.

**3 · A migração 34** (as quatro funções do log). *Escrevo o arquivo?* → a proposta gesto a
gesto: **L40**.

**O L32 "cinco casos" que tinha sumido na compactação foi reconstruído com a mesa em
06/09/2026** e já está no `Pendencias.md` (a decisão e os cinco casos A a E, com o que está
feito, recusado e pendente). Nada mais a perguntar de volta aqui.

## O que está começado e não terminado

- **A saída da área** · o lado do MESTRE está feito (o `marcarMordido` relê e funde por
  chave); o lado do JOGADOR depende da **migração 35**, escrita e ainda não rodada. → o
  defeito, o levantamento e o que falta: **L43**, e a família em **L41**.

## As migrações

**Quem manda é o cabeçalho de cada `supabase/migracao-NN.sql`**, e ele costuma dizer mais
do que qualquer resumo. O levantamento das pendentes, com o que cada uma muda de formato
para quem está com a mesa aberta, está no **L42**.

**A 36 RODOU EM 05/09/2026**, e com ela a saída dupla parou. Ela trouxe duas coisas: o
vocabulário `tirar_mordidos` (**L43**, **L45**) e a tabela `migracoes`, que é o instrumento da
quarta categoria · o fato que ninguém consegue perguntar daqui. **A partir dela, "quais rodaram"
tem resposta no banco**, e a sondagem por formato deixa de ser o único caminho.

**A 37 ESTÁ ESCRITA E ESPERA A MESA** · sem risco de formato. Duas coisas: o `comment on column`
da regra de leitura do `sha256`, e a correção da fronteira (`min(numero) where not a_mao` provava
só "esta linha é automática", não "tudo acima é automático" · terceira vez que essa forma aparece
no instrumento, ver **L45**). Vira a view `public.migracoes_fronteira`, que devolve o número e a
afirmação `fronteira_vale`.

Estado em 05/09/2026: **1 a 32, a 35 e a 36 aplicadas** · a leva de 31, 32, 29, 30 e 35 rodou
naquele dia, na ordem da mesa, com 31 e 32 coladas, e as cinco conferências passaram (o que
cada uma devolveu está no **L42**). A **33 é a única não aplicada** · o que falta nela é a
tela, não o SQL, e isso é fase 2.5. A **34 ainda não existe** como arquivo.

**A 35 ENTRA INERTE, E NÃO PRONTA.** Ela para o apagamento de hoje e não termina o campo:
o `||` sabe dizer PÕE e não sabe dizer TIRE, e um dos quatro pontos do cliente TIRA chave
(`marcarMordido(..., null)`). Hoje é inerte porque esse ponto grava direto na tabela e
nunca chama a RPC. **O vocabulário de remoção tem de existir na RPC ANTES de qualquer
cliente passar a usar a `jogador_muda_efeito` para este campo**, e a asserção que prova
isso nasce junto do vocabulário, não antes. → o levantamento: **L42** e **L43**; a regra
geral que isso instancia: **migração antes do cliente é segura, cliente antes da migração
é a janela ruim**.

## Apontamentos permanentes, que vieram do chat e não do repositório

- **Toda resposta começa com `Executora:`.**
- **Nunca coautoria do Claude/Anthropic em commit nem em PR.**
- **Sem travessão em texto nenhum**, exceto fala de personagem em ficção.
- **Commitar com pathspec**, nunca `add -A`.
- **Todo commit que toque `src/` abre com uma linha do que muda para quem vai abrir a mesa
  amanhã, e se depende de migração.**
- **Quando a mesa levanta um defeito, a resposta não é o conserto: é o TAMANHO primeiro.**
  Quantas mesas, desde quando, e é certeza ou corrida. E a diferença entre as duas muda o
  conserto · no `mordidos` ela mudou tudo.
- **ANCORE A PERGUNTA NO SÍMBOLO, NÃO NO DEFEITO** (a régua da revisora, 05/09/2026, e a
  resposta para *por que catalogar uma forma não impede repeti-la*). Só sobrevive ao
  instante da escrita a pergunta cujo gatilho é um SÍMBOLO que se está digitando, e não
  um conceito de que seria preciso lembrar. As três:

  | ao digitar | perguntar |
  |---|---|
  | `\|\|`, `coalesce`, `filter`, `{...spread}` | **isto sabe dizer TIRE?** |
  | "não é preciso", "não há como", "nunca" | **e a outra direção?** |
  | "por enquanto", "provisório", "até que" | **quem decide que acabou, e o programa sabe responder?** |

  A primeira teria pego o `mordidos` na hora, e a segunda pegou o comentário que dizia
  *"não é preciso lápide"* meia hora depois de escrito, na mesma frente que já tinha
  catalogado a forma três vezes.
- **Gate que nunca foi visto vermelho é garantia escrita, não prova.** Falsificar uma de
  cada vez, restaurando a árvore, e dizer qual não deu para falsificar.
- **Falsificação que a máquina não roda se faz num RAMO DESCARTÁVEL**, porque o portão
  roda em qualquer ramo: empurra, lê o vermelho, apaga o ramo. **O ramo some e a execução
  vermelha fica no histórico para sempre**, então ela tem de se explicar sozinha, sem
  depender deste arquivo: **o ramo começa em `falsif/` e o assunto do commit começa com
  `FALSIFICACAO`**. A lista do CI mostra ramo e assunto em toda linha, então quem tropeça
  no vermelho lê o porquê ali mesmo. Conferido em 05/09/2026 no `f4ff1ec`.
- **Asserção de sobrevivente precisa do par**, senão passa pelo motivo errado: a coisa que
  cai E a coisa que fica.
- **AS FORMAS TÊM CATÁLOGO, e ele é o dono da lista de perguntas:** `docs/simulacao/CATALOGO.md`.
  Instrumento novo passa por lá ANTES de ser construído, e o desenho diz quais formas se aplicam e
  o que fez com cada uma. Os CASOS continuam no princípio do `02-projeto-harness.md`. **A lista
  não é contada**: citar "as doze formas" envelhece na forma nova seguinte.
- **A FACHADA QUE PRESERVA A FORMA E TROCA O DESTINO** (o nome é da revisora) · ler o ponto de
  escrita não diz por onde a escrita SAI. Gatilho: `ctx.SB`, `SB`, qualquer cliente recebido por
  parâmetro em vez de importado · **quem é este SB nesta aba?** → **L45**. E a emenda vale para
  TODOS os gatilhos de símbolo: eles pressupõem que o objeto é o que o nome diz.
- **TODO PORTÃO NOVO PASSA PELO ENSAIO DOS TRÊS SENTIDOS**: vermelho hoje, verde com o conserto
  **sem tocar no arquivo do portão**, vermelho de novo com a regressão. Portão que casa por texto
  fixo fica verde quando o conserto renomeia o literal · aconteceu duas vezes em 05/09/2026.
- **FALHAR FECHADO E TER CONTROLE POSITIVO SÃO DUAS PROVAS DIFERENTES.** Falhar fechado (nenhum
  sinal achado → assume o pior) impede o falso verde; controle positivo prova que a busca ACHA
  quando há o que achar. Os dois portões da leva de 05/09/2026 tinham só o primeiro, e o segundo
  dependia de um artefato real (a migração 36) continuar presente — funcionava, era implícito.
  Corrigido em 06/09/2026 com autotestes contra texto SINTÉTICO
  (`scripts/test-remocao-jsonb.mjs`, `scripts/test-carimbo-migracoes.mjs`), que não dependem de
  nada do repositório continuar do jeito que está hoje. → **L46**.
- **QUANDO NÃO DER PARA ACHAR POR CALL-SHAPE, ACHE POR ÁRVORE SINTÁTICA.** O portão do `mordidos`
  fora do helper (L46) resolve o item 5 da lista da revisora ("a rota tem outra grafia") usando o
  compilador TypeScript para RASTREAR O VALOR do payload (declaração + atribuições no mesmo corpo
  de função), não o texto da chamada. Renomear a variável do payload não escapa.
- **O ESCALAR QUE DESCREVE UM CONJUNTO** é forma própria no catálogo, e apareceu TRÊS vezes no
  mesmo instrumento (a tabela `migracoes`): a 36 recusando "a última migração"; o L44
  (`count(*)`); e a fronteira `min(numero) where not a_mao`, que só prova "esta linha é
  automática" e foi lida como "tudo acima é automático" (corrigido na 37, virou uma view que
  também afirma a ausência de exceção).
- **Achar linha por CHAVE e nunca por posição**, em teste e em prosa. **Em SQL isso é:
  conferência de migração NOMEIA o que aquele arquivo define, e nunca CONTA o que existe** ·
  contagem mede o mundo e envelhece quando outro arquivo mexe, e quando falha não diz o que
  faltou. E **conferência que precisa ler linha de mesa não é conferência**: quem confere o
  esquema pode não ter acesso à mesa de ninguém. → a varredura inteira: **L44**.
- **O compilador do Astro cai nesta máquina** (`UnknownCompilerError`,
  `WebAssembly.instantiate(): size ... > maximum function size`), e vem e vai com a memória
  livre. Matar os `node` deixados por rodadas anteriores costuma resolver; quando não
  resolve, **o CI decide**, e o `validate` não usa Astro.
- **O hook do RTK estraga `grep`/`rg` e heredoc no Bash.** Arquivo multilinha vai pelo
  `Write`; busca vai pela ferramenta `Grep` ou por `awk`.
- **O portão de procedência exige âncora e citação NA MESMA LINHA**, e pareia a citação com
  o ÚLTIMO trecho entre crases da linha.
- **QUANDO DELEGAR A UM SUBAGENTE, E QUANDO NÃO** (06/09/2026, confirmado pela revisora). Delega
  quando é **medição pura**, a pergunta é **autocontida** (cabe inteira num prompt, sem ir e
  voltar) e dá para **conferir o diff antes de aceitar** o resultado. Não delega quando o
  trabalho é **ler código de produção passo a passo** para achar a causa de algo: aí delegar só
  troca o tempo de LER pelo de CONFERIR o que o subagente leu, e não economiza nada.
