# Progresso · rodada 50 (L70: o segundo estrangulamento, a fachada de SB das Artes e o `deslocar`)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA, no instante em
que ela fecha, hora lida da máquina (`date +%H:%M`).

- 23:22 (sha 231fd08, 0 à frente/atrás de `origin/main`): começando. Item 1,
  antes de qualquer código: confirmar ou derrubar a previsão do Arquiteto
  (`deslocar`, `artes-grid-mesa.ts:1139`, é o ÚNICO lugar que escreve posição
  fora do `gravarToken`), varrendo o GESTO (`arena_tokens`, `jogador_mover`,
  `.q =`/`.r =`, escrita em `ctx.tokens[...]`) e não o nome de função (lição
  da rodada 40). Se aparecer um segundo lugar, parar e trazer antes de
  continuar. Desenho já decidido pelo Arquiteto: `gravarToken` entra no
  `CtxGrid`, `deslocar` chama ele (não copia a conta). Defeito à parte a
  nomear: `ctx.tokens[a.cid] = {...}` grava ANTES de conferir se o upsert deu
  certo, vira corrupção de cache assim que a recusa existir. Medida à parte
  (não trabalho): tamanho de estreitar `SB: any` no `CtxGrid` (quantos usos de
  `ctx.SB`, quantas tabelas). Pergunta de regra do humano (não decido
  sozinha): empurrão em casa ocupada falha inteiro ou para na última casa
  livre? Escrever o comportamento de hoje EXPLÍCITO com o motivo, trocável
  numa linha. Fora de escopo: trava no banco, e a interceptação do arrasto
  como ataque (com a Revisora, não encostar).
- 23:23 · PREVISÃO CONFIRMADA. Varri o gesto, não o nome: `arena_tokens` só
  aparece em `grid.astro` (os lugares já conhecidos do `gravarToken` e da
  fachada) e em `artes-grid-mesa.ts:1139`, um só. `jogador_mover` não tem
  chamador novo. `ctx.tokens[...] =` só existe em `artes-grid-mesa.ts:1143`.
  `.q =`/`.r =` (atribuição direta, não objeto literal) não aparece em
  `src/lib/*.ts` nenhum. Conferido também `artes-grid.ts` e `artes-grid-ui.ts`
  (irmãos do mesmo módulo): nenhum dos dois toca posição. O `deslocar` é
  mesmo o único caminho fora do `gravarToken`. Indo ler `CtxGrid` e o
  `deslocar` inteiro antes de desenhar o conserto.
- 23:25 · MEDIDA DO ITEM 5 (a fachada, não é trabalho desta rodada): `ctx.SB.`
  aparece 15 vezes em `artes-grid-mesa.ts`, em 3 tabelas distintas
  (`combatentes` 9, `arena_efeitos` 5, `arena_tokens` 1). Levando ao Arquiteto
  como número, não decisão.

  LIDO `CtxGrid` (`artes-grid-mesa.ts:51-117`) e `ctxArtes()`
  (`grid.astro:2754`): já existe o idioma certo (`hexNaTela`, `margem`,
  `medida`, `gastarMana`, `declararTempo`, `logar`), com o comentário que o
  Arquiteto citou ("quem desenha a grade é quem sabe onde ela começa"). O
  plano: `gravarToken` entra em `CtxGrid`, `deslocar` chama ele por casa, do
  passo mais longe até o mais curto, parando na primeira que `gravarToken`
  aceitar (a mesma ideia do movimento automático do Tick). Só grava
  `ctx.tokens[a.cid]` quando a escrita realmente deu certo. Distingue
  "ocupada" (tenta a casa mais curta) de outro erro qualquer (rede, permissão:
  propaga na hora, não adianta encurtar). Resposta de hoje para a pergunta de
  regra do Arquiteto: PARA NA ÚLTIMA CASA LIVRE, não falha a Arte inteira,
  escrita como constante nomeada e comentada, trocável numa linha.
- 23:28 · CÓDIGO ESCRITO. `CtxGrid` ganhou `gravarToken` (documentado,
  `artes-grid-mesa.ts:81-89`); `ctxArtes()` (`grid.astro:2775-2780`) empresta
  a MESMA função que `porNoMapa` usa. `gravarToken` (`grid.astro`) ganhou
  `error.ocupada: true` na recusa por ocupação, para distinguir de qualquer
  outro erro. Nova função `empurrarAteLivre` (`artes-grid-mesa.ts`): tenta do
  passo mais longe até o mais curto via `ctx.gravarToken`, para na primeira
  casa aceita; erro sem `.ocupada` propaga na hora, sem encurtar. Constante
  `PARA_NA_ULTIMA_CASA_LIVRE = true` documentada como a resposta de HOJE,
  trocável numa linha (a pergunta de regra está com o Arquiteto, não decidi
  sozinha). `deslocar` reescrito para chamar `empurrarAteLivre` em vez do
  `ctx.SB.from('arena_tokens').upsert` direto, e só grava `ctx.tokens[a.cid]`
  DEPOIS de confirmar que não veio `error` (conserta o item 4: antes disso o
  cache era escrito antes de saber se a gravação deu certo).

- 23:30 · TESTE NOVO (Node puro, sem navegador): `scripts/test-l70-empurrao.mjs`,
  importando `empurrarAteLivre`/`PARA_NA_ULTIMA_CASA_LIVRE` via a mesma casca
  de `esbuild` + DOM de mentira que `test-arte-na-mesa.mjs` já usa. Três cenas
  com `ctx.gravarToken` falso: caminho livre (chega ao passo pedido, 1
  chamada); caminho parcialmente ocupado (para na última casa livre, 2
  chamadas); erro de verdade, sem `.ocupada` (propaga na hora, 1 chamada só,
  não tenta encurtar). Mais a conferência de que a constante hoje é `true`.
  10 asserções, todas verdes depois de um erro meu na primeira rodada (mock
  chamado com a forma errada, corrigido). Registrado em `validate`
  (`package.json`), ao lado de `test-arte-na-mesa`. Rodei também
  `test-arte-na-mesa.mjs` (33 asserções) e `test-artes-grid.mjs` (o motor
  puro) de novo: nenhuma regressão na maquinaria das Artes ao redor do
  `deslocar`.

- 23:32 · BLOQUEIO, DE NOVO. `npm run validate` vermelho: meus dois arquivos
  cresceram (grid.astro +10 linhas líquidas, `artes-grid-mesa.ts` +55ish) e
  deslocaram citações nos dois. `test-procedencia.mjs` achou 99 âncoras
  envelhecidas (72 para `grid.astro`, 27 para `artes-grid-mesa.ts`), em 8
  documentos: `ESTADO.md` 7, `Pendencias.md` 60, `CONJURACAO.md` 9,
  `Grid_Mobile.md` 5, `CATALOGO.md` 2, `VOZ.md` 12, `CONTEXTO.md` 2,
  `Auditoria_Tecnica.md` 2. Mesmo protocolo da rodada 49: não toquei em
  nenhum documento. Código completo, testado, no disco, sem commitar.
  Trazendo ao Arquiteto.
- 00:36 · ADENDO do Arquiteto: a resposta do humano chegou. (1) "Para na
  última casa livre" é EXATAMENTE o que `PARA_NA_ULTIMA_CASA_LIVRE = true` já
  fazia; nenhuma mudança de comportamento, só reescrevi o comentário para
  dizer que é decisão do humano (`Pendencias.md` L83), não mais "resposta
  provisória de hoje sem decisão". (2) "Quem apanha cai" fica de fora de
  propósito, adiada para a rodada 51 junto da separação `caido`/`inconsciente`
  na fila (`L84`, `NO_CHAO`, `grid.astro:7118`): documentei o motivo no
  comentário da constante, para ninguém achar que foi esquecimento. (3) e (4)
  não pedem ação minha (nota de `L84` para quando ela chegar; achado do FAA do
  `empurrao-elemental` registrado no `L83`, não é para eu mexer). Achei e
  corrigi DOIS travessões que tinham escapado do meu próprio código
  (`artes-grid-mesa.ts`, no comentário novo) e um no `test-l70-empurrao.mjs`:
  o `git diff` não pega arquivo novo/não rastreado, então a checagem de antes
  tinha passado por cima deles sem avisar. Lição: para arquivo novo, `grep`
  direto, não `git diff`. Nenhum código funcional mudou, só os comentários.
  Avisando o Arquiteto que o código parou de mexer.
- 00:38 · Arquiteto trouxe duas correções. (1) CONFERIDO: o teste NÃO afirma
  "recusa" para destino ocupado. A cena 2 (`test-l70-empurrao.mjs:89-99`) já
  testava exatamente "para uma casa antes" (`passosReais = 2`, um a menos que
  o pedido, `!r.error`), porque o teste foi escrito DEPOIS de
  `empurrarAteLivre` já existir com `PARA_NA_ULTIMA_CASA_LIVRE = true` (a
  mesma resposta que virou decisão do humano): o código não mudou entre
  escrever a função e escrever o teste, só o STATUS da decisão mudou (de "hoje,
  sem decisão" para "decisão do L83"). Nada a corrigir no teste. (2) ACHADO
  REAL, para não afirmar demais no fechamento: a conferência em `gravarToken`
  fecha o caminho da ESCRITA de posição, não a invariante de ocupação inteira.
  Levantar (`caido` → de pé, quando a separação de fila do L84 existir) muda
  uma condição e um tick, não grava coordenada nenhuma, então dois corpos
  podem ficar de pé no mesmo hexágono sem NENHUMA escrita passar pelo
  `gravarToken`. Registrando para não afirmar no aviso que "a conferência
  fecha a invariante de ocupação": ela fecha o caminho da posição, e é uma
  frase diferente. (3) `noChao` tem 30 chamadores, todos em `grid.astro`, e o
  Arquiteto levou o número ao humano. Sem novidade de escopo até agora:
  seguindo com a gravação e "para uma casa antes", sem a queda.
- 01:00 · A RODADA CRESCEU. Decisão do humano (contra a recomendação do
  Arquiteto de partir em duas): a separação Caído/Inconsciente entra JUNTO
  desta rodada, porque a queda não pode existir num estado em que derrubar
  tire do combate. Cinco eixos, um commit por eixo: (1) gravação das Artes
  (feito, segue igual); (2) separa `noChao` em dois predicados (`podeDividir`
  continua com os dois estados; um novo, só fila, decide quem sai da
  iniciativa), 30 chamadas, todas em `grid.astro`, CADA UMA lida antes de
  classificar, dois casos já avisados como não óbvios (arrasto que recusa
  peça no chão, bandeira `chao:` que sai para fora); (3) `caido` ganha
  `acao: -2` no catálogo de condições (campo já existe, usado por
  `imobilizado`); (4) levantar com alguém em cima é DESLOCAMENTO (Força ou
  Destreza + Briga, com o -2, mas a disputa em si não é desta rodada: sem
  hexágono livre adjacente, recusa com motivo e o mestre resolve à mão; o
  custo em Ticks é o `cobrarDeslocamento` de sempre, só na Recuperação;
  `DELAY_AO_LEVANTAR` (5 Ticks) passa a valer só para inconsciente, conferir
  que o gatilho usa o predicado novo e não o `noChao` velho); (5) o empurrão
  volta a aplicar a condição `caido` em quem esbarra (a peça que faltava do
  L83), e o teste precisa de ajuste para isso.

  ANTES DE ESCREVER O EIXO 2: trazer as 30 chamadas de `noChao` classificadas,
  como lista, com a pergunta de cada uma ("passa por cima?" ou "fora da
  fila?"). Se não couber numa rodada, dizer com o número, não decidir
  sozinha. Indo ler as 30, uma a uma.
- 01:05 · AS 30 LIDAS, cada uma no contexto, classificadas em três grupos.
  `podeDividir` (`:7141`, as duas chamadas `noChao(a)`/`noChao(b)`) é o ponto
  de ancoragem de Q1 e não migra: é ele que define "posso passar por cima".

  GRUPO Q1 · fica em `noChao`, sem mudar (5): `:7141` x2 (`podeDividir`);
  `:5692` (`despejarTickInterno`, campo `chao:` do despejo de diagnóstico:
  reporta estado físico, não fila); `:8556` (`resolverGolpeNoAr`, a regra do
  "golpe no caído": se o alvo já estava no chão ANTES deste Tick, redireciona,
  e isso é sobre o instante físico do golpe, não sobre quem age); `:4741`
  (definição de `noChaoAgora`, mas com ressalva, ver abaixo).

  GRUPO Q2 · migra para o predicado novo, "está fora de combate/da fila?"
  (21): `:4580` (`tickDaVez`, "quem está caído não segura o relógio", mas
  agora segura, porque age); `:4627`/`:4628` (`grupoDaVez`, quem pode agir
  agora); `:4694`/`:4722` (`golpeMaisCedo`/`golpeVencidoNaFaixa`, golpe
  agendado de quem está de pé, caído com golpe no ar deve contar);
  `:4776` (dentro de `levantar`, calcula em que Tick reinserir quem levantou:
  é pergunta de fila); `:4847`/`:4848` (`pintarIniciativa`, a divisão visual
  "de pé" × "No chão, fora da fila": o rótulo mesmo diz "fora da fila", que
  deixa de ser verdade para caído); `:5077`/`:5078` (`pintarOrdem`, mesmo
  rótulo "No chão, fora da fila"); `:5120` (`pintarLinhaDoTempo`, a fita só
  mostra quem pode agir); `:5297` (`rolarIniciativas`, o comentário já dá a
  razão certa: "um INCONSCIENTE que tirasse o maior valor", fala de quem não
  age, não de quem está caído); `:5744` (`avancarTickSimultaneo`, pula
  movimento automático de quem está fora); `:5901` (`cenaAssentada`, golpe
  agendado de quem pode agir); `:5956`/`:5974`/`:5978` (`avancarAteParar`,
  quem resolve golpe devido e quantos "de pé" para o log); `:5998`
  (`decidirAutomaticas`, quem o robô controla); `:6082` (`pintarRotas`, só
  desenha trajeto de quem pode agir); `:10737` (espelho de motor, `devido`,
  espelha `golpeMaisCedo`); `:11949` (atalho de teclado 1-9, seleciona pela
  posição na fila).

  ACHADO ESTRUTURAL, não é um dos 30 mas nasce de classificar o `:4741`:
  `noChaoAgora()` (a função, não a chamada) é consumida em DOIS lugares que
  querem coisas diferentes. `:5731` (`avancarTickSimultaneo`, `CAIDOS_AO_ABRIR
  = noChaoAgora()`) alimenta a regra do golpe no caído (`:8556`, Q1, físico).
  `:4756` (dentro de `conferirChao`) e `:4802` (depois de `levantar` resolver)
  usam o MESMO `noChaoAgora()` para detectar quem SAIU da fila e cobrar
  `DELAY_AO_LEVANTAR`: isso é Q2, e é EXATAMENTE o gatilho que o Arquiteto
  pediu para conferir ("se ficar no `noChao` antigo, todo prono que levantar
  vai levar 5 Ticks de graça"). `noChaoAgora()` tem de virar duas funções: a
  de hoje (Q1, para `:5731`) e uma irmã nova (Q2, para `:4756`/`:4802`), ou o
  gatilho do acordar dispara para caído levantando sozinho, que é exatamente o
  defeito que a separação existe para fechar.

  GRUPO PRECISA DE DECISÃO, não decidi sozinha (4): `:6794`/`:6800` (o
  arrasto que recusa peça no chão: "peça caída continua de fora" do gatilho
  de vez/diálogo, comentário do próprio código, porque hoje ela "não tem vez
  para medir"; agora TEM. Arrastar um caído fora da vez dele deveria abrir o
  mesmo diálogo "corrigir ou fora do turno" que qualquer peça de pé, ou
  continuar pousando direto porque é o mestre "arrumando a cena"? Minha
  inclinação é migrar para Q2, caído tem vez agora, mas é decisão de produto,
  não minha); `:8496` (`destinoDoGolpe`, candidatos a redirecionar um golpe
  perdido: um alvo caído-mas-consciente pode ser o NOVO alvo do golpe
  perdido, ou continua fora da lista de candidatos como hoje? Minha
  inclinação é Q1 (fica de fora), porque a regra é sobre achar um corpo por
  perto, não sobre quem pode agir, mas não tenho certeza); `:10782` (espelho
  de motor, `dePe()`, usado pelo driver para saber se a cena acabou: um lado
  todo caído-mas-consciente não foi derrotado, só derrubado, devo contar
  como "ainda em cena" (Q2) para o driver não achar batalha encerrada cedo
  demais? Minha inclinação é Q2, mas o nome do campo (`dePe`, literalmente
  "de pé") sugere Q1, e é meio caminho ele mesmo).

  RESUMO PARA O ARQUITETO: 30 chamadas diretas + a função `noChaoAgora()`
  precisando virar duas. 5 ficam, 21 migram, 4 pedem decisão, 1 função
  estrutural se parte em duas. Trazendo antes de escrever qualquer linha do
  eixo 2, como pedido.
- 01:11 · REAPONTAMENTO FEITO: 112 citações movidas em 12 documentos, 22
  puladas por `(citação histórica)`, portão fechado em 267 citações
  conferidas. Uma sobrou vermelha (a âncora do Arquiteto em
  `const destino = afastar`, que EU reescrevi em vez de só deslocar, movendo
  a citação para fora do hunk): ele trocou pela linha do orçamento
  (`(nivel * 200)`), a âncora certa desde o começo. Antes de commitar, corrigi
  o comentário que dizia "queda adiada para a rodada 51" (não está mais):
  reescrevi o mesmo parágrafo, mesma contagem de linhas (7 antes, 7 depois,
  conferido por leitura direta), então nada mais deslocou. COMMIT DO EIXO 1
  FEITO: `ca6d567`, pathspec em `grid.astro`, `artes-grid-mesa.ts`,
  `test-l70-empurrao.mjs`, `package.json` e este arquivo, nada dos 8
  documentos do Arquiteto. `npm run validate` verde antes de commitar. Push
  confirmado (`231fd08..ca6d567`), `git rev-list --count origin/main..HEAD` =
  0.

  CORREÇÃO IMPORTANTE PARA O AVISO: a regra do levantar fecha só o caminho
  DELIBERADO (o prono decide levantar com alguém em cima, isso é
  deslocamento, isso grava). NÃO fecha o caminho PASSIVO: curar, uma Arte que
  devolve Vida, o mestre tirando a condição à mão, um efeito que vence
  sozinho, ou a campainha do tempo real trazendo isso pronto de fora
  (`conferirChao`, o comentário dela mesma lista os cinco): nenhum desses é
  ação de quem está no chão, nenhum passa por deslocamento, nenhum grava
  coordenada. Curar um inconsciente debaixo de uma peça de pé pode pôr dois
  corpos de pé no mesmo hexágono sem NENHUMA escrita de posição. Frase certa
  para o aviso: "a conferência na gravação fecha o caminho da posição, e a
  regra do levantar traz o levantar DELIBERADO para dentro desse caminho; o
  retorno PASSIVO ao estado de pé continua fora, e continua sem regra."
  Registrando como pendência aberta, não minha para resolver: o Arquiteto
  leva ao humano junto com a disputa do `L83` (é regra, não código).

  CATALOGO: pedido para acrescentar o achado do travessão em arquivo novo
  como variante de "o rótulo de escopo do `git diff`", não como forma nova.
  `docs/simulacao/CATALOGO.md` está modificado na árvore pelo Arquiteto
  agora, não vou editá-lo por cima. Mandei o texto sugerido por mensagem
  para ele dobrar no próprio commit dele: "em arquivo novo/não rastreado,
  `grep` direto no arquivo resolve numa linha, porque `git diff` não vê o que
  o git ainda não conhece."

  Ainda esperando resposta do Arquiteto sobre a classificação das 30
  chamadas de `noChao` (as 4 que pedem decisão e o achado estrutural do
  `noChaoAgora()`) antes de escrever qualquer código do eixo 2.
- 01:14 · OS 4 JULGADOS PELO ARQUITETO: `:6794` migra para Q2 (a razão da
  exceção, "não tem vez para medir", deixou de valer); `:6800` fica em Q1,
  razão diferente da minha (não é "sem vez para medir", é "rastejar não está
  decidido", pergunta mal posta hoje, escrever isso no código);
  `:8496` fica em Q1, razão trocada pela física certa (corpo no chão fora do
  arco de um golpe mirado em quem está de pé, não "achar corpo por perto");
  `:10782` (`dePe` do espelho) muda de pergunta: ele mediu os consumidores e
  não achou nenhum (nem em `scripts/`, nem em `.claude/`), então não é
  "qual das duas perguntas", é "não responde a ninguém ainda": Q2 e
  RENOMEAR (o nome `dePe` é armadilha para o primeiro consumidor futuro),
  mantendo o campo.

  Minha aritmética: Q1 final = 6 (`:7141`x2, `:5692`, `:8556`, `:6800`,
  `:8496`); Q2 final = 22 (os 21 originais + `:6794`); `:10782` some das duas
  contagens porque migra semanticamente mas não tem consumidor para "migrar"
  de verdade, só renomear; `:4741`/`noChaoAgora()` fica de fora das duas
  contagens por ser o item ESTRUTURAL (vira duas funções). 6 + 22 + 1 + 1 =
  30. O placar dele soma diferente ("2 pedem regra que ainda não existe") e
  não bati com exatidão essa frase; como cada item individual está claro e
  sem ambiguidade, vou implementar pela decisão item a item e trago a
  diferença de contagem se ela importar depois de escrito.

  ESCREVENDO O EIXO 2 agora, autorizado. Confirmando de novo: eixo 1 já
  estava commitado e empurrado (`ca6d567`, `10fc4f1`) antes desta mensagem
  chegar.

- 01:29 · EIXO 2 ESCRITO, as 30 chamadas de `noChao(` resolvidas uma a uma.
  Migraram para `foraDaFila` (Q2, 24 pontos): `pintarLinhaDoTempo` (`emPe`),
  `rolarIniciativas` (com o comentário reescrito, porque o dele já dizia
  "inconsciente" e não "caído"), `avancarTickSimultaneo` (o passo automático),
  `pintarRotas`, o `devido` do espelho, `cenaAssentada`, as três de
  `avancarAteParar` (golpes devidos, "ninguém na fila" e a contagem só de
  log), `decidirAutomaticas`, o atalho de teclado 1-9, o `perguntarForaDaVez`
  do arrastar (comentário reescrito: a razão "não tem vez" caiu porque o
  caído agora TEM vez), e o `dePe` do espelho (RENOMEADO para `naLuta`,
  mantendo o campo mesmo sem consumidor hoje: medi de novo antes de renomear,
  `grep` em `scripts/` e `.claude/` por `.dePe(` e `__ESPELHO`, achei só um
  `dePe` homônimo e não relacionado dentro de `scripts/sim/motor.mjs`, local
  aquele arquivo e sem ligação com o campo do espelho da mesa).

  Ficaram em Q1 (`noChao`, 6 pontos) com comentário corrigido onde a razão
  do Arquiteto discordava da minha: o gate de `moverSimultaneo` no arrastar
  (razão certa: rastejar não está decidido, perguntar "como você vai" para
  quem não anda é pergunta mal posta hoje, não "sem vez para medir"), e o
  filtro de `destinoDoGolpe` (razão certa: um corpo no chão está fora do
  arco de um golpe mirado em quem estava de pé, não "achar corpo por
  perto"). Sem mudança: as duas definições (`noChao`/`podeDividir`), o
  campo `chao:` de diagnóstico, e o `CAIDOS_AO_ABRIR` do golpe-no-caído.

  Bateria completa rodada depois da escrita: `test-l67-corpoacorpo-mesa`,
  `test-l68-foradavez-mesa`, `test-l70-ocupacao-mesa`, `test-l70-empurrao`,
  `test-grid-simultaneo` (79 asserções) todos verdes, e `npm run validate`
  inteiro rodado: o único vermelho é o portão de procedência, esperado desta
  vez também (edição grande desloca linha). 67 citações envelheceram em 6
  documentos (`ESTADO.md`, `Pendencias.md`, `CONJURACAO.md`, `Grid_Mobile.md`,
  `VOZ.md`, `CONTEXTO.md`); não toquei nenhum dos seis, reporto a contagem ao
  Arquiteto e espero o reponte antes de subir.

- 01:31 · commit do eixo 2 BLOQUEADO pelo gancho de pre-commit (ele roda o
  `validate` inteiro, e o portão de procedência está vermelho pelas 67
  citações acima). Mensagem enviada ao Arquiteto com a contagem e os 6
  documentos. Parado aqui até o reponte, sem tocar nos documentos e sem
  `--no-verify`.

- 01:43 · DOIS ACHADOS DO ARQUITETO chegaram enquanto o eixo 2 esperava
  reponte: (1) cinco Artes de `grid.forma: movimento` (Empurrão, Onda,
  Maremoto, Onde é Embaixo, Tromba) aplicam `caido` ao alvo sem depender de
  colisão, e no código de ANTES desta rodada isso as tornava atordoamento de
  5 Ticks disfarçado, sem ninguém desenhar; a separação do L84 conserta as
  cinco de graça. (2) `Pendencias.md` L85 (novo, medido pelo Arquiteto): a
  distância do empurrão não segue a régua dos dados (FAH/FAA), e o `nivel`
  em `artes-grid-mesa.ts:1187` lê `escolhas['Alcance']` por falta de
  parâmetro "Força" nos efeitos, um terceiro defeito dentro do mesmo bloco.
  NÃO É MINHA RODADA: não toquei em `artes-grid-mesa.ts:1187` nem na régua de
  distância, exatamente como pedido.

  Construí o caso de teste do achado (1): `scripts/test-l84-caidofila-mesa.mjs`
  (novo, registrado em `smoke` e na matriz de CI), com uma cena nova
  `?cena=caidofila` em `mesa-mock.mjs` (duas peças de pé, sem token
  compartilhado). Aplica `Caído` pelo diálogo de condições de verdade (mesmo
  caminho que `test-grid-simultaneo.mjs` já usa) e confere: a peça continua
  em `window.__ESPELHO.naLuta()`, o `tick` dela não muda, e nenhuma linha
  "volta a agir" é escrita. Controle negativo NO MESMO arquivo: `Inconsciente`
  na outra peça AINDA tira da fila (a peneira discrimina, não parou de tirar
  qualquer um). Controle negativo por `git stash` só de `grid.astro` (meu
  próprio não commitado, não de outra instância): contra o código de antes
  do L84 a mesma asserção de "continua na luta" FALHA (`naLuta` nem existe
  lá, o teste cai no nome velho `dePe` de propósito, comentado no código).
  Restaurado com `stash pop`, conferido verde nos dois lados.

  Corrigi de passagem um comentário agora falso em `mesa-mock.mjs` (dizia que
  "caido tiraria a peça da fila", verdade antes do L84, falsa depois).

- 01:43 · EIXO 2 COMMITADO E EMPURRADO: `28d8944`, `origin/main..HEAD` = 0.
  Pathspec: `grid.astro`, `progresso-50-l70.md`, `mesa-mock.mjs`,
  `test-l84-caidofila-mesa.mjs`, `package.json`,
  `.github/workflows/validate.yml`. Não toquei nos 5 documentos que estavam
  em reponte no meio do caminho (`Grid_Mobile.md`, `CONJURACAO.md`,
  `CONTEXTO.md`, `ESTADO.md`, `VOZ.md`) nem em `Pendencias.md` (L85 do
  Arquiteto). Próximo: eixo 3 (`acao: -2` em `condicoes.json` para `caido`).

- 01:47 · EIXO 3 ESCRITO: `acao: -2` em `caido`, `src/data/condicoes.json`
  (mesmo campo que `imobilizado` já usa, somado por `somarCondicoes` em
  `mesa-core.ts:178`, então nenhuma mudança de código: o motor já lê `acao`
  de qualquer condição). Nota do verbete ganhou a frase "Também −2 para agir
  (mira e postura ruins do chão)", no mesmo padrão das outras condições com
  `acao`. Edição NEUTRA em contagem de linha (estendi as duas linhas que já
  existiam, não abri linha nova): `condicoes.json:61` (citado em
  `Pendencias.md` para `investindo`) continua na mesma linha, conferido por
  leitura direta. `validate-data.mjs` e `npm run validate` inteiro verdes
  (o reponte do eixo 2 já tinha chegado na árvore compartilhada quando rodei).

- 02:00 · EIXO 4 ESCRITO: `levantarDoChao(cid)`, nova, logo depois de
  `porNoMapa` em `grid.astro`. Sozinho no hexágono, tira `caido` sem custo.
  Dividindo com outra peça, procura um vizinho livre (`vizinhos()`,
  `src/lib/hex.ts`, agora importada em `grid.astro`) e vai por `porNoMapa`
  (mesma conferência de ocupação do L70, mesmo `cobrarDeslocamento`, nenhum
  número novo). Sem vizinho livre, recusa com o motivo, sem inventar rolagem
  (a disputa Força/Destreza + Briga é `Pendencias.md` L83, fora de escopo).
  Novo item de menu "⤒ Levantar", só em quem tem `caido`, para MESTRE ou dono
  da peça. Nome deliberadamente DIFERENTE do `levantar(gente)` já existente
  (o "acordar" de quem saiu da fila): comentário cruzado nos dois para não
  confundir.

  UM BUG DE VERDADE, achado pelo teste antes de qualquer commit: a primeira
  versão buscava o vizinho livre com `ocupadoPor`, que isenta quem
  `podeDividir`: `c` ainda estava `caido` (`noChao`) no instante da busca,
  então `podeDividir(c, outro)` valia sempre `true` e QUALQUER vizinho
  "parecia" livre, mesmo tomado. Pior: a condição `caido` era removida ANTES
  de confirmar o destino, então uma recusa deixava a peça de pé, sem
  `caido`, presa na mesma casa dividida. Corrigido: a busca do vizinho tira
  `caido` de `c.condicoes` SÓ NA MEMÓRIA antes de perguntar `ocupadoPor`
  (desfeito se não sobrar candidato), e a escrita de verdade
  (`gravarPeca`) só acontece depois de confirmado o destino (ou a ausência
  dele). Registro aqui porque é exatamente o tipo de achado que o CATALOGO
  pede: um controle que pegou o defeito antes de ele subir, não depois.

  Teste novo `scripts/test-l84-levantar-mesa.mjs` (registrado em `smoke` e
  na matriz de CI), com cena `?cena=levantar` em `mesa-mock.mjs` (três casos,
  cada vizinho gerado por `vizinhos()` de verdade, não escrito à mão): `pe`
  sozinho (levanta no lugar, sem custo), `pa`+`pb` dividindo com um vizinho
  livre (levanta indo para lá, por `porNoMapa`, mesma frase de log de sempre),
  `pc`+`pd` dividindo com os seis vizinhos tomados (recusa, com o motivo,
  `caido` intacto). 17 asserções, todas verdes; foi rodando este arquivo que
  o bug acima apareceu.

  Bateria completa verde (corpo a corpo, fora da vez, ocupação, empurrão,
  caído-na-fila, levantar, simultâneo). `npm run validate`: único vermelho é
  o portão de procedência, esperado (38 citações movidas por esta edição, em
  `ESTADO.md`, `Pendencias.md`, `CONJURACAO.md`, `Grid_Mobile.md`, `VOZ.md`,
  `CONTEXTO.md`; uma delas, `Pendencias.md:3783`, aponta para
  `mesa-mock.mjs:1118`, mas a CITAÇÃO mora em `Pendencias.md`, que não é meu
  para tocar, mesmo o alvo sendo meu arquivo). Não toquei em nenhum dos seis
  documentos do Arquiteto. Falta: eixo 5 (o empurrão aplicando `caido` a
  quem esbarra).

- 02:01 · commit do eixo 4 BLOQUEADO pelo gancho de pre-commit (mesmo motivo
  do eixo 2: o `validate` inteiro roda, e o portão de procedência está
  vermelho pelas 38 citações acima). Mensagem enviada ao Arquiteto com a
  contagem, os 6 documentos e a ressalva de `Pendencias.md:3783`. Indo
  escrever o eixo 5 por cima do código já pronto (só não commitado) enquanto
  espero o reponte, do mesmo jeito que fiz entre o eixo 2 e o eixo 3.

- 02:05 · EIXO 5 ESCRITO (o último): `condicoesDoEmpurrao(gCondicao, parouAntes)`,
  nova função pura e exportada em `artes-grid-mesa.ts`, logo antes de
  `deslocar`. Devolve a LISTA deduplicada de condições a aplicar: a que a
  própria Arte declara (`g.condicao`, o `caido` das cinco Artes que o
  Arquiteto mediu) e, agora, `caido` de novo se a peça esbarrou no caminho
  (`parouAntes`, o mesmo booleano que já existia para o log "parou antes do
  previsto"). Um `Set` por baixo evita chamar `porCondicao` duas vezes
  quando as duas coincidem (ela substitui, não soma, mas duplicar a chamada
  duplicaria `MORDIDAS`). `deslocar` ficou mais simples: o loop que aplicava
  `g.condicao` depois de mover todo mundo virou parte do MESMO loop que já
  movia e logava cada alvo.

  EXTRAÍDA EM FUNÇÃO PURA de propósito, e não deixada inline: `deslocar`
  pede `palco: HTMLElement` de verdade (`escolherAlvoNoMapa` espera um
  clique) e um diálogo (`abrirEmpurroes`), então testar a DECISÃO sem
  arrastar a caixa inteira era a diferença entre um teste de Node e um
  teste de navegador que eu não tinha orçamento para montar (casting de
  Arte pelo assistente, que o próprio arquivo já registra como "precisa de
  DOM"). Mesma lição do `empurrarAteLivre` desta rodada, aplicada de novo.

  5 asserções novas em `test-l70-empurrao.mjs` (Arte sem condição e sem
  esbarrar: nada; com condição própria e sem esbarrar: só a dela; sem
  condição própria e ESBARROU: `caido` sozinho; com OUTRA condição e
  ESBARROU: as duas; já é `caido` e ESBARROU: uma só, sem duplicar). 15
  asserções no arquivo, todas verdes. `test-artes-grid.mjs` e
  `test-arte-na-mesa.mjs` continuam verdes (o resto do módulo não mudou).

  Bateria completa verde (corpo a corpo, fora da vez, ocupação, empurrão,
  caído-na-fila, levantar, simultâneo, Artes). `npm run validate`: único
  vermelho é o portão de procedência, esperado (21 citações movidas, todas
  para `artes-grid-mesa.ts`, em `Pendencias.md`, `CONJURACAO.md` e
  `Auditoria_Tecnica.md`; não toquei nenhum). OS CINCO EIXOS da rodada 50
  estão escritos. Falta: reponte + commit dos eixos 4 e 5, e depois o
  aviso.

- 02:06 · confirmado: commit do eixo 4 continua BLOQUEADO (tentei de novo,
  isolado, para não empilhar em cima do eixo 5 sem necessidade) porque o
  `validate` do gancho olha a ÁRVORE inteira, e `artes-grid-mesa.ts` (ainda
  não commitado, do eixo 5) já está no meio dela com as 21 citações
  próprias. Mensagem enviada ao Arquiteto com a contagem do eixo 5. Os dois
  eixos vão como DOIS commits pathspec assim que o reponte chegar (eixo 4
  primeiro, depois eixo 5), na ordem em que foram escritos.

- 02:31 · O ARQUITETO ACHOU UM DEFEITO REAL no `levantarDoChao` antes do
  commit, e tinha razão: a escrita da condição (`gravarPeca`) rodava ANTES
  de `porNoMapa` mover. Uma recusa por ocupação (a corrida entre clientes
  que o `L70` mede, virou `L88`) deixava a peça de pé NO BANCO, sem `caido`,
  presa na mesma casa dividida: exatamente o estado que meu próprio
  comentário já prometia impedir, e a promessa não bastava sem a ORDEM
  certa. A inversão óbvia (mover primeiro, tirar depois) tem o MESMO defeito
  espelhado, porque `porNoMapa` gravaria com `c` ainda `caido` na memória e
  `ocupadoPor` perdoaria o destino de novo.

  Corrigido separando MEMÓRIA de PERSISTÊNCIA: `c.condicoes` muda na
  memória antes de mover (a mesma técnica que a busca do vizinho livre já
  usava), e só é GRAVADA depois que o movimento confirma que entrou. Isso
  exigiu que `porNoMapa` passasse a devolver `{ error }` (achado maior do
  Arquiteto: antes ele mostrava o erro ao USUÁRIO e voltava void, sem dizer
  nada a QUEM CHAMA, o `L66` um nível acima do `L70`). Conferi os 10
  chamadores de `porNoMapa` antes de mudar a assinatura, como pedido: 8 já
  ignoravam o retorno como statement (`await porNoMapa(...);`, sem usar o
  valor), e só 2 (os dois `return porNoMapa(...)` dentro de
  `moverSimultaneo`, que é `Promise<void>`) precisaram virar
  `await porNoMapa(...); return;`.

  Se a escrita da condição falhar DEPOIS do movimento já ter entrado, não
  desfaço a posição: desfazer abriria uma SEGUNDA corrida (voltar por cima
  de uma casa que outra peça já pode ter tomado no intervalo). Mostro o
  erro e a mesa fica com a posição certa e a condição pendente, visível.

  `test-l84-levantar-mesa.mjs` continua com as 17 asserções verdes depois do
  conserto (os três casos: sozinho, dividindo com vizinho livre, dividindo
  sem vizinho livre). NÃO CONSTRUÍ um teste da corrida entre clientes de
  verdade: neste mock, cada página tem seu `window.__SB` isolado, sem
  backend compartilhado entre abas, então a corrida (que só existe ENTRE
  clientes, nunca dentro de um só, porque não há `await` entre a busca e a
  escrita) não é reproduzível aqui sem uma infraestrutura de mock nova, que
  não é desta rodada. Registro isto para não superafirmar cobertura que não
  tenho: a correção é certa por inspeção e pela forma que o Arquiteto
  descreveu, e o teste que existe prova que os três casos funcionais
  continuam corretos depois da correção, não que a corrida foi reproduzida.

  Bateria completa rodada de novo depois do conserto: verde, incluindo
  `test-l67-corpoacorpo-mesa`, `test-l68-foradavez-mesa`,
  `test-l70-ocupacao-mesa`, `test-l84-caidofila-mesa`,
  `test-grid-simultaneo` (79 asserções) e `test-grid.mjs` (uma falha de
  flakiness pré-existente do arrasto por mouse simulado, confirmada IDÊNTICA
  no código de antes desta rodada via `git stash` do meu próprio
  `grid.astro` não commitado, e verde de novo na repetição seguinte: não é
  regressão minha).

- 02:31 · CONFIRMADO: `npm run validate` inteiro verde (276 citações
  conferidas), reponte do Arquiteto já chegou para os eixos 4 e 5. EIXO 4
  COMMITADO E EMPURRADO: `7030d1f`, `origin/main..HEAD` = 0. Commitando o
  eixo 5 agora, em separado.

- 02:42 · ADENDO PARA QUEM LÊ ESTA RODADA DE FORA, pedido explícito do
  Arquiteto depois do aviso já enviado (por isso vai aqui, e não editando
  `50-executora.md`, que é frozen desde `3c13075`): **a separação do L84
  conserta cinco Artes que hoje, no `main` de antes desta rodada, funcionam
  como atordoamento de 5 Ticks disfarçado de empurrão.** Empurrão, Onda,
  Maremoto, Onde é Embaixo e Tromba (`grid.forma: movimento` com
  `grid.condicao: "caido"`, medidas pelo Arquiteto em
  `src/data/efeitos.json`) tiravam o alvo da fila e cobravam
  `DELAY_AO_LEVANTAR` (5 Ticks) para ele voltar, porque `caido` estava no
  balde que a fila lia como "fora de combate". Ninguém desenhou isso: é a
  condição fazendo o que a ficha dela sempre disse (prono) e o Grid lendo
  como outra coisa (fora de combate). Depois desta rodada, as cinco voltam
  a ser empurrão de verdade: o alvo cai, mas continua na fila e não paga o
  atraso. Isto está provado por `test-l84-caidofila-mesa.mjs` (aplica
  `Caído` e confere `naLuta`/tick/log) e é mais concreto para quem abre a
  mesa amanhã do que qualquer descrição da refatoração em volta.

