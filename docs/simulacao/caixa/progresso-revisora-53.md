# Progresso · revisão da rodada 53

Sinal de vida, hora lida de `date +%H:%M`.

- 10:39: checkout em `62e09f4` (aviso), HEAD/toplevel conferidos. BASE
  `17facd9` é ancestral de SHA `e9fdcf6`; SHA é ancestral do commit do
  aviso; `git log e9fdcf6..origin/main` só mostra o próprio `62e09f4`,
  TOPO = SHA procede. Lido `53-executora.md` e `progresso-53-l93.md`
  inteiros. Ordem de ceticismo pedida pelo Arquiteto: (0, prioridade dele
  mesmo) o cenário consertado (bench=8) ainda testa o que existia para
  testar, ou virou caminho fácil; (1) o laço de nova tentativa termina de
  verdade, teto existe, não gira dentro de um Tick; (2) a prova do
  registro existe e falha contra o código de antes; (3) a medida
  "inimigo, não aliado" da fileira que fechava o vão.
- 10:41: `npm run validate` verde, "280 citação(ões)... 42 marcada(s)
  (citação histórica)". `test-l93-passocolossal-mesa.mjs`: 5 asserções
  verdes (bate). Falsifiquei por conta própria: troquei `grid.astro` pela
  versão de `17facd9` (BASE), mantendo o teste novo. Contra o código
  velho, exatamente as 2 asserções centrais caem (cache corrompido para
  `{q:7,r:9}` em vez de desfeito; linha "Peça md avança 1 m..." presente
  no registro mesmo com a gravação recusada); as outras 3 continuam
  passando. Prova do ponto 2: existe, e falha contra o código de antes.
  Restaurado, verde nos dois lados conferido de novo.
- 10:43: `test-grid-simultaneo.mjs` rodado por mim, 79/79. Capturei a
  saída da cena `cenaAlvoQueFoge` especificamente: "golpe agendado no
  Tick 2" e "o Tick do golpe só anda para a frente... (2 → 9)": um
  adiamento real de 7 Ticks, não um artefato de 0/1 Tick. Ponto 0: o
  cenário com `bench=8` continua exercitando reprojeção de verdade, não
  virou caminho trivial.
- 10:44: Ponto 1, lido o laço inteiro (`grid.astro:5943-5973`, o `for
  (;;)` dentro de `avancarTickSimultaneo`). Cada volta só continua se
  `casaExata` está setado E o erro é especificamente `.ocupada === true`;
  cada volta veta a casa recusada e pede uma nova candidata evitando
  TODAS as vetadas; para assim que a nova candidata repete a posição
  original ou uma já vetada. `passos` é fixo por Tick, o conjunto de
  casas alcançáveis é finito, `vetadas` só cresce: termina por geometria,
  nunca gira para sempre. Confirmei que este laço é INTEIRO interno a
  uma chamada de `avancarTickSimultaneo` (um Tick só). O teto de 50 é
  outra coisa: `avancarAteParar` (`:6118-6153`) chama
  `avancarTickSimultaneo()` uma vez por Tick, incrementa `avancos`, e
  `if (avancos >= TETO_AVANCO_SEM_PARADA) { ... return; }`
  (`:6144-6151`) é um `return` de verdade, com log de aviso.
  `TETO_AVANCO_SEM_PARADA` (`:6041-6044`) é 50 por padrão. Os dois laços
  são independentes: o de dentro nunca ultrapassa um Tick, o teto de 50
  é do laço de fora.
- 10:45: Ponto 3, conferido. `mesa-mock.mjs:349` (`grupo: ehPC ?
  'aliado' : 'inimigo'`) confirma que a fileira de índice 8-11 (fora do
  corte de 4 PCs) é mesmo 'inimigo'. MAS: lido `podeDividir`
  (`:7324-7325`) e `ocupadoPor` (`:7389-7401`), nenhum dos dois lê
  `grupo`/aliado em lugar nenhum; `casaExata` também não lê. A distinção
  aliado/inimigo hoje NÃO MUDA NADA no comportamento do código: a regra
  "aliado passa" do L94 é decisão do humano, não implementação ainda.
  Então a medida é factualmente correta, mas a cena precisaria do MESMO
  conserto (`bench=8`) mesmo se a fileira fosse aliada, porque nenhum
  caminho de código hoje distingue os dois. Nuance a registrar, não erro
  de medição.
- 10:46: varredura de travessão pelo diff inteiro da rodada (`17facd9..
  e9fdcf6`, via `rtk proxy git diff`, 1146 linhas batendo com o `--stat`
  de 500+95): TRÊS achados reais em linha adicionada: um em
  `progresso-53-l93.md`, dois em `test-grid-simultaneo.mjs` (o
  comentário novo sobre a agenda ao vivo). Meu próprio arquivo novo
  varrido: limpo. Escrevendo o veredito.
