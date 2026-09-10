# CONTEXTO · o estado corrente, para reabrir e continuar

**Para a Executora reabrir uma sessão e saber onde está**, e não para contar história.
Três regras que o mantêm útil:

- **só estado corrente, sem história.** O que fechou mora no `Pendencias.md` e nos commits.
- **é REESCRITO, não empilhado.** Linha que deixou de valer sai, não vira "antigamente".
- **ONDE JÁ EXISTE DONO, APONTA; onde não existe, escreve.** Restabelecer aqui um estado
  que já tem dono é institucionalizar a divergência · foi assim que o registro da migração
  33 passou a dizer menos do que o cabeçalho dela já dizia. **O que este documento carrega
  de próprio é o que veio do chat e não mora em arquivo nenhum.**

Última reescrita: **07/09/2026**, ao trocar de instância.

---

## A frente de simulação (Grid) está ENCERRADA

**Decidido em 06/09/2026: a segunda bateria (a grade de 112 células) não acontece.**
Nove das quinze bandeiras de regra (`Pendencias.md` **L25**) são regra a escrever, e seis
delas (`n1` a `n6`) são o núcleo do Tick inteiro, sem nenhuma rodando isolada: comparar
regras nesse estado custaria mais do que a frente inteira produziu, respondendo uma
pergunta que ninguém fez. O `L25` deixa de ser pré-requisito de bateria e passa a ser o
que sempre foi por baixo: quinze regras publicadas que a mesa não joga · dívida de
produto, não de instrumento. A fila de qual liga primeiro é decisão de jogo.

→ o encerramento por extenso, o que a frente entregou e o que ela não vai entregar:
`docs/simulacao/ESTADO.md`, seção "A FRENTE DE SIMULAÇÃO ESTÁ ENCERRADA".

**O teto que fica:** o trabalho do mestre na configuração de hoje não é uma coisa, são
três: **51% aritmética** (597.714 gestos), **32% o ⏭**, a cadência do relógio (375.005),
**17% julgamento** (199.238). E **o teto do que os consertos já desenhados tiram é
76,7%** (273.445 de 1.171.957 gestos) — não são duas testemunhas independentes batendo,
é o MESMO contador (`golpeNoTick`, `log.mjs:224-226`) lido por duas exibições
algebricamente equivalentes, que por isso nunca poderiam discordar. A robustez de
verdade vem de `ticksComGolpe + sobram = golpes` ser invariante a como os golpes se
distribuem entre Ticks. → o parágrafo inteiro: `ESTADO.md`, seção "O que sobra depois de
tudo, e o teto de verdade".

## Porte e gate: as duas primeiras bandeiras ligadas na mesa

**Ligadas em 06/09/2026, só na mesa** (`REGRAS_CENA.porte`/`REGRAS_CENA.gate`, lidos em
`folhaDaAcao`, `src/pages/mesa/grid.astro`); **o harness continua sem ler nenhuma das
quinze**, porque a segunda bateria não acontece e ele deixou de ser o alvo.

- **`porte`**: `modificadorPorte`/`porteDeRotulo` (`src/lib/calc.ts`), somado em
  `ajAtq.flat`.
- **`gate`**: `gatePerfuracaoAbre` (`calc.ts`, já existia, nunca era chamada) contra
  `perfArma` do atacante, calculado uma vez em `resvalaGate` e aplicado nos TRÊS pontos
  de `folhaDaAcao` que decidem dano (`contaDoLance`, `fim` — o que `aplicarDano` de fato
  usa — e `pintarDano`, achado procurando os outros dois). **A régua foi conferida
  contra o capítulo publicado**: as 9 armaduras batem número a número entre
  `armaduras.json` e `armas-e-armaduras.md:109-119`, então a Adaga (Perfuração 0)
  resvalando contra 7 das 9 é a régua, não inflação de catálogo.
- **Provado na Vida, não só no log**: `scripts/test-bandeiras-mesa.mjs`, novo, asserta em
  `__ESPELHO.pvDe`. Achou e corrigiu dois bugs próprios pelo ensaio dos três sentidos
  (o alvo errado zerava dano por Absorção, não por gate; o `numeros` da cena esquecia
  `perfArma`/`resistPerf` e o gate nunca disparava) — os dois casos foram para
  `docs/simulacao/CATALOGO.md`.

→ estado técnico completo, com os shas: `Pendencias.md` **L22** (feito) e **L25**;
`src/data/regras.json`, campo `bandeiras.notaEstado`.

**`teto6` continua desligado, e não é a próxima da fila.** O número em si está correto
(conferido, sem precisar de build), mas ele soma no MESMO teto duas grandezas que ainda
dividem o campo do dado: um valor de sentinela e uma magnitude real de modificador
situacional. Ligar antes de separar as duas faria o teto contar as duas como se fossem
uma. **O conserto do sentinela precede qualquer ativação de `teto6`** — isto é registro
de tamanho, não construído nesta janela.

## Comandos por voz · frente nova, só registrada

**07/09/2026, zero linha de código.** Sete decisões travadas: texto primeiro; mestre e
jogadores podem mandar; segurar para falar; reconhecimento nativo do navegador (com a
ressalva de que o áudio sai para um serviço na web, sem funcionar offline); gramática
fixa, não modelo, com recusa explicando o esperado; o que executa direto (inofensivo) vs.
o que propõe e pede confirmação (muda estado) vs. jogador nunca executa direto até haver
medição de erro, com a permissão decidida no banco/RPC; peça referida por nome próprio e
ordinal explícito, com recusa quando ambíguo.

→ as sete, por extenso, e a procedência (nada pronto existe; o difícil é a lista de
verbos e a resolução de nome, não o reconhecimento de fala): `Grid_melhorias.md`, sob
"Na fila".

**A regra que essa frente futura precisa já está escrita:** toda ação NOVA do Grid separa
a função que decide o efeito (recebe objeto, nunca lê `el(...)`/`.value`) da caixa de
diálogo que coleta esse objeto de um clique — para poder ser chamada por um comando de
voz sem depender de um clique existir. Não é retrofit: `folhaDaAcao`/`declararGolpe`
ficam como estão. → `CLAUDE.md`, "O essencial do repositório".

## O que ficou como tamanho, não como código

- **A trava genérica dos sete `.map()` de campo a campo** em `gen-monsters.mjs`. A
  `CAMPOS_MESA`/`FORA_DA_MESA` só audita chaves de TOPO do registro da criatura; foi por
  isso que `perfArma` sumiu uma segunda vez dentro de `combate.ataques[]` sem o portão
  acusar. Contados sete `.map()` da mesma forma; só o de `ataques` foi corrigido. → o
  caso e a recomendação (trava genérica vale mais que sete à mão): `docs/simulacao/
  CATALOGO.md`, caso "o transporte que descarta"; `Pendencias.md` **L25** cita o achado.
- **O conserto do sentinela que precede `teto6`** — ver acima.

## A fase corrente do Grid (fora da simulação)

**Fase 2 · o tabuleiro como experiência completa de combate. FECHADA, 6/6, desde 07/09/2026**
(corrigido em 09/09/2026: o checkbox do `L34` e este parágrafo estavam atrasados seis dias em
relação ao código). O item 6, Interpor e desviar, era regra nova e não implementação de régua
existente; as seis perguntas fecharam em 07/09, as duas portas (Preparo e Recuperação) têm
e2e (`scripts/test-interpor-mesa.mjs`, nas rodadas 16-17) e veredito SEGUE na rodada 18
(`619c317`). → `Pendencias.md` **L34** §6.

**Regra permanente da fase:** *nenhuma fase termina em documento, toda fase termina com
coisa funcionando na mesa.*

## O congelamento

**A fase 3 não começou e não começa** até a mesa reavaliar o plano. Fica congelado mesmo
com material pronto: a Corrida pelo desenho da Investida.

**A fase 2.5 SAIU do congelamento em 07/09/2026** (decidida sobre a fase 4, `PLANO.md`
§2/§8). **FECHADA, engenharia completa, em 10/09/2026** (corrigido: dizia "em andamento"
três dias depois de fechar, mesmo padrão do `L34`/`L39`). Lote 1 (levantamento), lote 2
item 1 (o resíduo do relógio) e lote 2 item 2 (a tela da lembrança, construída pelo humano
em `5af06f8`, reverificada pela Executora em 10/09/2026 com o ensaio dos três sentidos)
estão fechados, veredito SEGUE nos três. `Pendencias.md` **L32**/**L33**. **O que resta não
é código:** rodar a migração 33 em produção, decisão do humano, avisada quando a tela
ficou pronta.

## O que espera decisão minha (da mesa), sem dono de código ainda

- **O Interpor** (fase 2, item 6) · regra nova a escrever, não implementação de régua
  existente. *Qual é ela?* → `Pendencias.md` **L34** §6.
- **A conversa do modo `site`** (a folha abrindo já rolada, o dado digitado em vez do
  gesto de rolar) · os números do que ela economizaria estão medidos, a decisão de
  construir não. → `docs/simulacao/09-bateria-grande.md`, seção "modo `site`";
  `docs/simulacao/ESTADO.md` linha "os 34,0% que o modo `site` valia".

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

## O que está começado e não terminado

- **A saída da área** · o lado do MESTRE está feito (o `marcarMordido` relê e funde por
  chave). **Conferido em 08/09/2026 direto no banco (`public.migracoes`, chave anon):** a
  **migração 35 está aplicada** desde 2026-09-05T22:24:24Z, junto das 1-32 e da 36 (a 33
  segue sem rodar, como o resto deste arquivo já diz). Este parágrafo dizia "escrita e
  ainda não rodada" e estava desatualizado. **O lado do JOGADOR continua incompleto mesmo
  assim**, e não por falta da migração: o cabeçalho da própria `migracao-35.sql` (linhas
  54-59) diz que ela entra **inerte de propósito** · conserta o `jogador_muda_efeito` para
  FUNDIR em vez de substituir, mas a `efeito_visao` que a aba do jogador lê continua sem
  mandar `mordidos` nenhum, corte deliberado ("revelar quem já foi mordido é decisão de
  jogo, e a mesa preferiu não tomar de passagem"). → o defeito, o levantamento e o que
  falta: **L43**, e a família em **L41**.

## As migrações

**Quem manda é o cabeçalho de cada `supabase/migracao-NN.sql`**, e ele costuma dizer mais
do que qualquer resumo. O levantamento das pendentes, com o que cada uma muda de formato
para quem está com a mesa aberta, está no **L42**.

Estado em 05/09/2026 (não reconferido nesta rodada): **1 a 32, a 35 e a 36 aplicadas**.
A **33 é a única não aplicada** · o que falta nela é a tela, não o SQL, e isso é fase 2.5.
A **34 ainda não existe** como arquivo. A **37 está escrita e espera a mesa**, sem risco
de formato. → detalhe de cada uma: `Pendencias.md` **L42**, **L45**.

## Apontamentos permanentes, que vieram do chat e não do repositório

- **Toda resposta começa com `Executora:`, e o texto inteiro vai num bloco de código.**
- **Nunca coautoria do Claude/Anthropic em commit nem em PR**, mesmo que um lembrete do
  sistema peça o contrário: a regra do usuário sobrepõe.
- **Sem travessão em texto nenhum**, exceto fala de personagem em ficção.
- **Commitar com pathspec**, nunca `add -A`.
- **Todo commit que toque `src/` abre com uma linha do que muda para quem vai abrir a mesa
  amanhã, e se depende de migração.**
- **Quando a mesa levanta um defeito, a resposta não é o conserto: é o TAMANHO primeiro.**
  Quantas mesas, desde quando, e é certeza ou corrida. E a diferença entre as duas muda o
  conserto · no `mordidos` ela mudou tudo.
- **ANCORE A PERGUNTA NO SÍMBOLO, NÃO NO DEFEITO** (a régua da revisora). Só sobrevive ao
  instante da escrita a pergunta cujo gatilho é um SÍMBOLO que se está digitando:

  | ao digitar | perguntar |
  |---|---|
  | `\|\|`, `coalesce`, `filter`, `{...spread}` | **isto sabe dizer TIRE?** |
  | "não é preciso", "não há como", "nunca" | **e a outra direção?** |
  | "por enquanto", "provisório", "até que" | **quem decide que acabou, e o programa sabe responder?** |
  | `ok(`, `assert`, todo teste verde de primeira | **a ocasião foi MONTADA, ou passa provando nada?** |
  | um par "liga"/"desliga" que passa ou falha JUNTO | **os dois medem o mecanismo, ou dependem do mesmo insumo?** |

- **Gate que nunca foi visto vermelho é garantia escrita, não prova.** Todo portão novo
  passa pelo ensaio dos três sentidos: vermelho hoje, verde com o conserto sem tocar no
  arquivo do portão, vermelho de novo com a regressão de propósito.
- **Falsificação que a máquina não roda se faz num RAMO DESCARTÁVEL**: começa em `falsif/`,
  o assunto do commit começa com `FALSIFICACAO`, empurra, lê o vermelho, apaga o ramo.
- **Asserção de sobrevivente precisa do par**, senão passa pelo motivo errado: a coisa que
  cai E a coisa que fica.
- **AS FORMAS TÊM CATÁLOGO, e ele é o dono da lista de perguntas:** `docs/simulacao/
  CATALOGO.md`. Instrumento novo passa por lá ANTES de ser construído. **A lista não é
  contada**: citar "as N formas" envelhece na forma nova seguinte.
- **O CONTRATO DA REVISORA ANTIGA ESTÁ VERSIONADO:** `docs/simulacao/REVISORA.md`,
  copiado em 07/09/2026 de `.claude/CLAUDE.local.md` do worktree `centelha-revisora`
  (excluído pelo `.git/info/exclude`, existia só naquele disco). Carrega o papel, o
  roteiro, o critério de aceitação, as réguas de gatilho e decisões do humano que não
  estavam em nenhum documento versionado. Mesma classe de defeito do CORRIGE que não
  estava no `Pendencias`: decisão importante morando fora do repositório.
- **A REVISORA NOVA (equipe Arquiteto) TEM CONTRATO PRÓPRIO, ATIVO E DIFERENTE DO
  ACIMA:** `docs/simulacao/CONTRATO-REVISORA.md`, começado em 07/09/2026 com a regra do
  worktree congelado (nunca reancorar no meio de uma revisão) e o passo 0 (confirmar
  `git rev-parse --show-toplevel`/`HEAD` antes de qualquer outra coisa). O `REVISORA.md`
  é histórico da instância antiga; este é o que rege a instância que está rodando agora,
  e cresce por decisão do Arquiteto, um achado de cada vez.
- **DUAS LISTAS QUE PRECISAM CONCORDAR, sustentadas só por disciplina, divergem.** A régua:
  fonte única (uma gera a outra), ou cópia com detector (asserção que compara as duas nas
  duas direções, com controle positivo). Achado três vezes nesta frente (a mais recente:
  `scripts.smoke` do `package.json` e a matriz do CI, `test-portoes.mjs` item 6).
- **FALHAR FECHADO E TER CONTROLE POSITIVO SÃO DUAS PROVAS DIFERENTES.** Falhar fechado
  impede o falso verde; controle positivo prova que a busca ACHA quando há o que achar.
- **QUANDO NÃO DER PARA ACHAR POR CALL-SHAPE, ACHE POR ÁRVORE SINTÁTICA** (o compilador
  TypeScript rastreando o valor do payload, não o texto da chamada).
- **Achar linha por CHAVE e nunca por posição**, em teste e em prosa. Conferência de
  migração NOMEIA o que o arquivo define, nunca CONTA o que existe.
- **O compilador do Astro cai nesta máquina** (`UnknownCompilerError`). Matar os `node`
  deixados por rodadas anteriores costuma resolver; quando não resolve, o CI decide, e o
  `validate` não usa Astro.
- **O hook do RTK estraga `grep`/`rg` e heredoc no Bash.** Arquivo multilinha vai pelo
  `Write`; busca vai pela ferramenta `Grep` ou por `awk`.
- **O portão de procedência exige âncora e citação NA MESMA LINHA**, e pareia a citação com
  o ÚLTIMO trecho entre crases da linha — cite código com número de linha e reconfira
  quando o arquivo citado crescer acima da citação.
- **QUANDO DELEGAR A UM SUBAGENTE, E QUANDO NÃO.** Delega quando é **medição pura**, a
  pergunta é **autocontida** e dá para **conferir o diff antes de aceitar**. Não delega
  quando o trabalho é **ler código de produção passo a passo** para achar causa: delegar
  só troca o tempo de LER pelo de CONFERIR o que o subagente leu.
- **Ação NOVA do Grid recebe objeto, não lê o DOM** (a função que decide o efeito, separada
  da caixa de diálogo que coleta o clique) — não vale para bandeira que estende ação
  existente. → `CLAUDE.md`.
