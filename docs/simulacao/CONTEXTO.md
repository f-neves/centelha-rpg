# CONTEXTO · o estado corrente, para reabrir e continuar

**Para uma instância nova reabrir uma sessão e saber onde está**, e não para contar história.
Três regras que o mantêm útil:

- **só estado corrente, sem história.** O que fechou mora no `Pendencias.md` e nos commits.
- **é REESCRITO, não empilhado.** Linha que deixou de valer sai, não vira "antigamente".
- **ONDE JÁ EXISTE DONO, APONTA; onde não existe, escreve.** Restabelecer aqui um estado
  que já tem dono é institucionalizar a divergência · foi assim que o registro da migração
  33 passou a dizer menos do que o cabeçalho dela já dizia. **O que este documento carrega
  de próprio é o que veio do chat e não mora em arquivo nenhum.** E apontar é dar nome,
  caminho e para que serve, nunca descrever o conteúdo do outro arquivo (`ARQUITETO.md §5.5`).

Última reescrita: **12/09/2026**.

---

## A frente de simulação (Grid) está ENCERRADA

**Decidido em 06/09/2026: a segunda bateria (a grade de 112 células) não acontece.**
Nove das quinze bandeiras de regra (`Pendencias.md` **L25**) são regra a escrever, e seis
delas (`n1` a `n6`) são o núcleo do Tick inteiro, sem nenhuma rodando isolada: comparar
regras nesse estado custaria mais do que a frente inteira produziu, respondendo uma
pergunta que ninguém fez. O `L25` deixa de ser pré-requisito de bateria e passa a ser o
que sempre foi por baixo: quinze regras publicadas que a mesa não joga · dívida de
produto, não de instrumento. A fila de qual liga primeiro é decisão de jogo.

→ o encerramento por extenso: `docs/simulacao/ESTADO.md`, seção "A FRENTE DE SIMULAÇÃO
ESTÁ ENCERRADA".

**O teto que fica:** o trabalho do mestre na configuração de hoje não é uma coisa, são
três: **51% aritmética** (597.714 gestos), **32% o ⏭**, a cadência do relógio (375.005),
**17% julgamento** (199.238). E **o teto do que os consertos já desenhados tiram é
76,7%** (273.445 de 1.171.957 gestos) — não são duas testemunhas independentes batendo,
é o MESMO contador (`golpeNoTick`, `log.mjs:224-226`) lido por duas exibições
algebricamente equivalentes, que por isso nunca poderiam discordar. → `ESTADO.md`, seção
"O que sobra depois de tudo, e o teto de verdade". (O `02-projeto-harness.md:33` arredonda
os mesmos três termos como 50/33/17 · divergência registrada em **L63**, não corrigida.)

## As bandeiras ligadas na mesa

**`porte` e `gate`, desde 06/09/2026, só na mesa** (`REGRAS_CENA.porte`/`REGRAS_CENA.gate`,
lidos em `folhaDaAcao`, `src/pages/mesa/grid.astro`); **o harness continua sem ler nenhuma
das quinze**, porque a segunda bateria não acontece e ele deixou de ser o alvo.

- **`porte`**: `modificadorPorte`/`porteDeRotulo` (`src/lib/calc.ts`), somado em `ajAtq.flat`.
- **`gate`**: `gatePerfuracaoAbre` (`calc.ts`) contra `perfArma` do atacante, aplicado nos
  TRÊS pontos de `folhaDaAcao` que decidem dano (`contaDoLance`, `fim` — o que `aplicarDano`
  de fato usa — e `pintarDano`).
- **Provado na Vida, não só no log**: `scripts/test-bandeiras-mesa.mjs`, asserta em
  `__ESPELHO.pvDe`.

→ estado técnico completo, com os shas: `Pendencias.md` **L22**, **L25**;
`src/data/regras.json`, campo `bandeiras.notaEstado`.

**`teto6` continua desligado, e o que o precede não é código, é definição.** A frase que
justifica a espera ("sentinela e magnitude dividem o mesmo campo") **não está presa a
arquivo e linha em documento nenhum** — levantado em 10/09/2026, é a única das nove
bandeiras da tabela do `02-projeto-harness.md:1818-1827` sem citação de código ao lado. A
flag existe desligada (`src/data/regras.json:2537`) e não é lida em lugar nenhum do motor;
os dois pontos que somam Defesa sem teto hoje são `somarCondicoes` (`src/lib/mesa-core.ts:178`)
e `defesaPerdida` (`src/lib/combate-tempo.ts:696`, com comentário próprio dizendo que acumula
sem teto). **Aplicar o teto seria pequeno; achar o que a frase quer dizer é o que bloqueia**,
e isso é pergunta para o humano, não investigação de código. → **L64**, com o levantamento
inteiro e as três respostas possíveis.

## Comando por voz · a frente, e ela já tem código

**`docs/simulacao/VOZ.md` é o dono desta frente** (movido para cá em 10/09/2026, estava na
raiz). Ela **não é fase e não entra na numeração de fases**.

Estado em 10/09/2026:

- **A barra de comando de texto está no Grid e funciona** (`VOZ.md §8` item 1, rodada 30,
  veredito SEGUE): tecla **C** com quem está agindo, gramática fixa em
  `src/data/comando-barra.json`, parser puro em `src/lib/comando-barra.ts`, despachando para
  as cinco funções do Grid que já eram chamáveis direto (`porNoMapa`, `tirarDoMapa`,
  `encerrarVez`, `alternarAuto`, `esperarUmTick`). Sem microfone, sem Vosk.
- **Parado aqui de propósito:** o humano usa a barra numa batalha antes do item 2 (crescer o
  desfazer) abrir, porque o vocabulário real que sair da batalha corrige a gramática antes de
  qualquer construção em cima dela.
- **A bancada de medição do Vosk existe e o humano roda** (`voz-bench.html`,
  `voz-bench-README.md`, biblioteca vendorizada em `voz-bench-lib/`, modelo fora do repo).
  O critério de desistência da frente inteira é dela: falso positivo acima de **1 em 20** e a
  frente encerra.
- **Duas das sete decisões antigas do `Grid_melhorias.md` caíram**: "reconhecimento nativo do
  navegador" e "gramática pela API do navegador" · a especificação perdeu o conceito de
  gramática, e o motor agora é o Vosk embarcado. → `VOZ.md §4`.
- **A regra que decide confirmação, fechada em 10/09/2026:** verbo com desfazer executa
  direto, verbo sem desfazer confirma, até ganhar desfazer.

**O levantamento que dimensionou a frente** (10/09/2026): não existe ponto único por onde toda
ação passe; das dezesseis ações do menu, **cinco são chamáveis direto** com objeto pronto e as
outras oito misturam coleta (`uiFormulario`) ou dependem de diálogo com callback. **O desfazer
cobre só posição e Vida** (`grid.astro:11650` · `function desfazer`), não cobre Mana, a declaração do golpe, o
Tick nem a agenda. **"Escolher arma" não existe** como verbo. **Mana não distingue dar de
tirar** (`ajustarMana`, `grid.astro:11338`, uma função só).

**A regra de ação nova continua valendo:** toda ação NOVA do Grid separa a função que decide o
efeito (recebe objeto, nunca lê `el(...)`/`.value`) da caixa de diálogo que coleta o clique.
Não é retrofit. → `CLAUDE.md`.

## A fase corrente do Grid (fora da simulação)

**Fase 2 · o tabuleiro como experiência completa de combate: FECHADA, 6/6, desde 07/09/2026.**
→ `Pendencias.md` **L34** §6.

**Fase 2.5 · FECHADA, engenharia completa, em 10/09/2026.** Lote 1 (levantamento), lote 2 item
1 (resíduo do relógio) e lote 2 item 2 (a tela da lembrança, construída pelo humano em
`5af06f8`, reverificada com o ensaio dos três sentidos) fecharam, veredito SEGUE nos três. →
`Pendencias.md` **L32**/**L33**. **O que resta não é código:** rodar a migração 33 em produção,
decisão do humano.

**Fase 3 · não começou e não começa** até a mesa reavaliar o plano. Fica congelado mesmo com
material pronto: a Corrida pelo desenho da Investida.

**Fase 4 · bloqueada por pré-requisito que não é de engenharia:** o humano jogar uma batalha de
verdade e trazer a lista do que incomodou. → `PLANO.md` §9.

**Regra permanente da fase:** *nenhuma fase termina em documento, toda fase termina com coisa
funcionando na mesa.*

## A rodada corrente

**Últimas fechadas, as duas em 12/09/2026:** a **54** (`L85`, a régua de empurrão das Artes,
veredito `873b772`) e a **55** (`L86a`, a Arte `Mão Firme` curando no tabuleiro, código
`57f6bcb`, veredito `3cc14b5`, fechamento `f0d8e0b`). O que cada uma entregou e o que deixou de
resíduo mora no `Pendencias.md`, nos itens de mesmo nome.

**A próxima é o `L86b`:** as outras três Artes de cura, e nenhuma delas é só fórmula.
`acelerar-a-cura` é a única pronta para código, com a conta confirmada e a migração 38 escrita;
`cura-guardada` precisa de um gatilho que o motor não tem (`armadilha`), de uma ação de jogo que não
existe e da definição de "1 PV por ponto", que não está escrita em lugar nenhum;
`maos-sobre-a-multidao` é `forma: "zona"`, e zona não tem caminho de resolução nenhum, nem para dano
nem para cura.

### O PRÓXIMO PASSO, em uma linha

**Abrir a rodada 56 no `L86b`, começando pelo `acelerar-a-cura`**, que é o único dos três com
caminho de disparo e com a conta definida. As duas perguntas que travavam o item foram respondidas
em 12/09/2026 (nível é o da Arte de quem conjura; a cura em área não divide), as duas entraram no
`src/data/efeitos.json`, e `supabase/migracao-38.sql` está escrito e carimbado, esperando a mão do
humano no SQL Editor. → `Pendencias.md` **L86**.

O que a rodada 56 tem de fazer, pela ordem: gravar `nivel_arte` em `gravarEfeito`, degradando sem
quebrar enquanto a migração não tiver rodado; ler a coluna no laço por-turno, com nulo significando
"não sei" e nunca 1; e o teto, que já mora em `curarPv`. O `maos-sobre-a-multidao` **não** entra:
ele depende de um caminho de resolução para `forma: "zona"`, que não existe nem para dano nem para
cura, e isso é desenho antes de código. O `cura-guardada` continua sem gatilho `armadilha` e sem a
definição de "1 PV por ponto".

## O congelamento

Nenhuma varredura nova, nenhuma pendência aberta por iniciativa, nenhum conserto fora dos itens
da fase. A exceção permanente é vazamento ou perda de dado em produção. O que aparece de
passagem vira linha no `Pendencias.md` e para ali.

## Como esta sessão é governada (regras de 09-10/09/2026)

- **O orçamento é perguntado, não travado por percentual** (`ARQUITETO.md §0`, substitui a
  regra dos 80%, apagada e não marcada como superada). No início de toda sessão, com o número
  na mão: *"vamos trabalhar com algum limite de sessão ou de semana, ou não?"*. Sem resposta,
  nenhum lote abre. Mesmo com "sem limite", avisar ao passar de 90% e de 95%, e a partir de 95%
  trabalhar em pedaços que fecham sozinhos.
- **Conferir estado antes de afirmar estado** (`ARQUITETO.md §1`, cinco regras). Nenhum relato
  de que alguém está trabalhando, esperando ou terminando sem mtime, `git log` ou processo
  conferido — **para qualquer instância, sem exceção para a que se comporta bem**. Toda tarefa
  nasce com pedido de progresso em disco. Rótulo ("idle", "terminei") não é estado. Quem dispara
  um comando lê o código de saída antes de falar dele. E trabalho alheio na árvore não se põe de
  lado com `stash` para o próprio commit passar: espera-se, ou pede-se que ela commite.
- **A Revisora também escreve progresso em disco**, a cada etapa, com o sha da reancoragem na
  primeira linha (`CONTRATO-REVISORA.md §6`).

## O que espera decisão da mesa, sem dono de código ainda

- **O que "sentinela e magnitude no mesmo campo" quer dizer** · precede `teto6`, e não está
  escrito em lugar nenhum. Ver acima.
- **A conversa do modo `site`** (a folha abrindo já rolada, o dado digitado em vez do gesto de
  rolar) · os números do que ela economizaria estão medidos, a decisão de construir não. →
  `docs/simulacao/09-bateria-grande.md`, seção "modo `site`"; `ESTADO.md`, linha "os 34,0% que
  o modo `site` valia".
- **Rodar a migração 33 em produção** · os três itens do gatilho dela estão satisfeitos.
- **Rodar a 37 e a 38**, que não dependem de decisão nenhuma, só da mão dele no SQL Editor. A 38 não
  muda comportamento sozinha: ela é o chão da cura por turno que escala com o nível de quem conjura.

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
  `Pendencias.md` **L35**, que ainda mostra as duas em aberto e precisa ser marcado com esta
  decisão.
- **PERGUNTA DE REGRA DE JOGO VEM EM LISTA ÚNICA, não item a item** · quando uma frente
  levantar várias, o Arquiteto junta e traz todas de uma vez.

## O que está começado e não terminado

- **A saída da área** · o lado do MESTRE está feito (o `marcarMordido` relê e funde por chave).
  **O lado do JOGADOR continua incompleto, e não por falta de migração**: o cabeçalho da
  `migracao-35.sql` (linhas 54-59) diz que ela entra **inerte de propósito** · conserta o
  `jogador_muda_efeito` para FUNDIR em vez de substituir, mas a `efeito_visao` que a aba do
  jogador lê continua sem mandar `mordidos` nenhum, corte deliberado. → **L43**, e a família em
  **L41**.
- **A trava genérica dos sete `.map()` de campo a campo** em `gen-monsters.mjs`. Só o de
  `ataques` foi corrigido. → `CATALOGO.md`, caso "o transporte que descarta".
- **A barra de comando não tem teste automatizado commitado**, e `mover` contra casa ocupada
  falha em silêncio total por ela (herdado de `porNoMapa`). → **L62**.
- **O custo acumulado do arranjo não tem fonte nenhuma.** O `caixa/gasto-acumulado.json` é do
  script `duo`, que esta equipe não usa, e parou em 04/09/2026. → **L52**, item 2.

## As migrações

**Quem manda é o cabeçalho de cada `supabase/migracao-NN.sql`**, e ele costuma dizer mais
do que qualquer resumo. O levantamento das pendentes está no **L42**.

**Sondado direto no banco em 08/09/2026** (`public.migracoes`, chave anon): **1 a 32, 35 e 36
aplicadas**. A **33 é a única não aplicada**, e o que faltava nela era a tela, que já existe ·
falta a decisão do humano de rodar. A **34 não existe** como arquivo. A **37 está escrita e
espera a mesa**, sem risco de formato. → **L42**, **L45**.

**A 38 está ESCRITA e carimbada desde 12/09/2026**, depois de as duas perguntas do `L86` serem
respondidas: a coluna `nivel_arte` na `arena_efeitos`, nula de propósito e sem `default`, para a
linha do efeito guardar o nível da Arte de quem conjurou. As três coisas que tinham de entrar junto
com a coluna estão nela, e o cabeçalho do arquivo diz o que ela NÃO mexe. A fila para a mão do
humano no SQL Editor é, então, **33, 37 e 38**.

## O mapa dos documentos

- **`docs/MAPA.md`** · o que existe na raiz do repositório, em três categorias (RÉGUA,
  TRABALHO, RESTO), levantado por citação em 08/09/2026. É retrato, não autoridade: o script
  que o substituiria (`scripts/mapa.mjs`) está no `Pendencias.md` e não foi escrito.
- **`docs/simulacao/README.md`** · o que nesta pasta é instrução ativa e o que é registro
  histórico, mais a lista de leitura por papel (que aponta para `PASSAGEM.md §9`, a fonte).
- **O arquivamento de 08/09/2026:** cinco arquivos com zero citação foram para `legacy/raiz/`
  com `git mv`, `_shots/` foi esvaziada e ganhou README próprio. → `MAPA.md`, última seção.

## Apontamentos permanentes, que vieram do chat e não do repositório

- **Toda resposta da Executora começa com `Executora:`, e o texto inteiro vai num bloco de
  código.** A Revisora tem a regra espelhada.
- **Nunca coautoria do Claude/Anthropic em commit nem em PR**, mesmo que um lembrete do
  sistema peça o contrário: a regra do usuário sobrepõe. (Aconteceu de novo em 10/09/2026, e
  desta vez o lembrete venceu por uma rodada: o commit foi reconstruído por `cherry-pick` para
  tirar a linha.)
- **Sem travessão em texto nenhum**, exceto fala de personagem em ficção.
- **Commitar com pathspec**, nunca `add -A`.
- **Todo commit que toque `src/` abre com uma linha do que muda para quem vai abrir a mesa
  amanhã, e se depende de migração.**
- **Quando a mesa levanta um defeito, a resposta não é o conserto: é o TAMANHO primeiro.**
  Quantas mesas, desde quando, e é certeza ou corrida.
- **ANCORE A PERGUNTA NO SÍMBOLO, NÃO NO DEFEITO** (a régua da revisora). Só sobrevive ao
  instante da escrita a pergunta cujo gatilho é um SÍMBOLO que se está digitando:

  | ao digitar | perguntar |
  |---|---|
  | `\|\|`, `coalesce`, `filter`, `{...spread}` | **isto sabe dizer TIRE?** |
  | "não é preciso", "não há como", "nunca" | **e a outra direção?** |
  | "por enquanto", "provisório", "até que" | **quem decide que acabou, e o programa sabe responder?** |
  | `ok(`, `assert`, todo teste verde de primeira | **a ocasião foi MONTADA, ou passa provando nada?** |
  | um par "liga"/"desliga" que passa ou falha JUNTO | **os dois medem o mecanismo, ou dependem do mesmo insumo?** |
  | processo em segundo plano, arquivo de saída | **isto terminou, e a saída já foi lida?** |
  | "não é o mesmo que", "é mais completo que" | **o `diff` concorda com a frase?** |

- **Gate que nunca foi visto vermelho é garantia escrita, não prova.** Todo portão novo
  passa pelo ensaio dos três sentidos: vermelho hoje, verde com o conserto sem tocar no
  arquivo do portão, vermelho de novo com a regressão de propósito.
- **Falsificação que a máquina não roda se faz num RAMO DESCARTÁVEL**: começa em `falsif/`,
  o assunto do commit começa com `FALSIFICACAO`, empurra, lê o vermelho, apaga o ramo.
- **Asserção de sobrevivente precisa do par**, senão passa pelo motivo errado.
- **AS FORMAS TÊM CATÁLOGO, e ele é o dono da lista de perguntas:** `docs/simulacao/
  CATALOGO.md`. Instrumento novo passa por lá ANTES de ser construído. **A lista não é
  contada**: citar "as N formas" envelhece na forma nova seguinte.
- **O CONTRATO DA REVISORA ANTIGA ESTÁ VERSIONADO:** `docs/simulacao/REVISORA.md`, copiado
  em 07/09/2026 de `.claude/CLAUDE.local.md` do worktree `centelha-revisora`. É histórico.
  (Havia uma segunda cópia, `CONTRATO-REVISORA-ORIGINAL.md`, apagada em 10/09/2026 · mesmo
  texto, com um cabeçalho que afirmava o contrário. → `CATALOGO.md`.)
- **A REVISORA NOVA (equipe Arquiteto) TEM CONTRATO PRÓPRIO E ATIVO:**
  `docs/simulacao/CONTRATO-REVISORA.md`, que cresce por decisão do Arquiteto, um achado de
  cada vez.
- **DUAS LISTAS QUE PRECISAM CONCORDAR, sustentadas só por disciplina, divergem.** A régua:
  fonte única (uma gera a outra), ou cópia com detector (asserção que compara as duas nas
  duas direções, com controle positivo).
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
  quando o arquivo citado crescer acima da citação. **E ele trava commit de qualquer
  frente**: edição não commitada de uma instância desloca linha citada e o portão recusa o
  commit da outra.
- **QUANDO DELEGAR A UM SUBAGENTE, E QUANDO NÃO.** Delega quando é **medição pura**, a
  pergunta é **autocontida** e dá para **conferir o diff antes de aceitar**. Não delega
  quando o trabalho é **ler código de produção passo a passo** para achar causa.
- **O commit do veredito da Revisora pode nascer órfão do `main`** (aconteceu duas vezes em
  10/09/2026): antes de fechar qualquer item a partir de um veredito, conferir
  `git merge-base --is-ancestor <sha> HEAD` e recuperar por `cherry-pick` se preciso.
