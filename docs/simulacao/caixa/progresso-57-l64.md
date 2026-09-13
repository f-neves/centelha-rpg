# Progresso · rodada 57 · L64

Sinal de vida da Executora. Uma linha por etapa pequena, hora real (`date +%H:%M`).

- 21:01 · Rodada aberta. Li o `L64` inteiro em `Pendencias.md` (não refiz o
  levantamento). Escopo: só separar sentinela e magnitude no campo
  `Condicao.velocidade`, sem ligar `teto6`, sem tocar o Grid.

  Antes de escrever código, tracei os dois pontos que o levantamento afirma
  serem únicos, para não confiar de olhos fechados numa afirmação de
  10/09/2026:

  - **O ponto de soma**: `somarCondicoes` (`src/lib/mesa-core.ts:178`). Único,
    confirmado (só há uma função com este nome).
  - **O consumidor do SOMADO `.velocidade`**: tracei as 10 chamadas de
    `somarCondicoes(` no repositório (`artes-grid-mesa.ts:1738`,
    `combate.astro:838,865,1171,1310,1403,1909`, `grid.astro:10016,10218,11160`)
    e li o que cada uma faz com o retorno. Nove leem `.soak`/`.defesaCaC`/
    `.defesaDist`/`.acao`/`.ataque`/`.dados`/`.porRodada`; só
    `combate.astro:1404` lê `.velocidade`. CONFIRMADO: o consumidor é mesmo um
    só.

  **ACHADO, NÃO AÇÃO: dois leitores do campo CRU da condição (não o somado)
  que o levantamento não nomeou.** Busquei todo `.velocidade` do repositório
  (não só pelo nome: separei leitura do relógio de ação de leitura de arma/
  animação, que usam o mesmo nome de campo em objetos diferentes) e achei:

  1. `condChipHTML` (`src/lib/mesa-core.ts:208`) · usado em `combate.astro:1128`
     e `mesa.astro:360`, o chip visível de condição.
  2. `modEfeito` (`src/pages/mesa/referencia.astro:71`) · a página de
     referência das regras.

  Hoje os dois mostram "vel −99"/"Velocidade −99" para Fora do tempo: é o
  MESMO defeito do item (sentinela lida como grandeza), na tela em vez da
  conta, e é visível na mesa. Tirar o `-99` do JSON sem tocar aqui faria o
  chip e a referência passarem a não mostrar nada para esta condição, o que
  muda o que a mesa vê, mesmo sem tocar no Tick.

  Parei e avisei o Arquiteto (por mensagem), sem decidir nem consertar, como
  pedido: "se achar um segundo consumidor, pare e me diga". Aguardando
  decisão sobre se as duas exibições entram no escopo desta rodada (o padrão
  gêmeo já existe: `foraDeCombate`, booleano, tratado separado do número, em
  `somarCondicoes:192` e `modEfeito:74`) ou ficam de fora como o Grid.

  Nada escrito em código ainda.

- 21:11 · Decisão do Arquiteto: os dois leitores de tela ENTRAM no escopo,
  "porque a mudança de dado atravessa aquele código", não por serem o mesmo
  defeito. Regra dada: onde hoje sai o número da sentinela, sai a marca
  ("não age"); a grandeza continua saindo como número quando é grandeza; nada
  de redesenho de chip, nada de ícone novo, nada de mexer no que as outras 54
  condições exibem.

  **Implementado, nos quatro pontos do `L64` mais os dois achados:**
  - `src/data/condicoes.json`: `fora-do-tempo` perde `"velocidade": -99`,
    ganha `"naoAge": true`. As outras três (`acelerado`, `retardado`,
    `terreno-dificil`) ficam exatamente como estavam.
  - `src/lib/mesa-core.ts`: `Condicao.naoAge?: boolean` (campo novo, doc
    comment no próprio tipo); `somarCondicoes` ganha `naoAge: false` no
    total e `if (c.naoAge) t.naoAge = true;` no laço (OU, nunca soma: a
    marca não é grandeza); `condChipHTML` troca `vel ±N` por `não age`
    quando `c.naoAge`, preservando o número para as outras três condições.
  - `src/pages/mesa/referencia.astro`, `modEfeito`: mesma troca (marca em
    vez de número), mesmo padrão gêmeo que já existia para `foraDeCombate`.
  - `src/pages/mesa/combate.astro`, `avancarTick`: `const novo = cd.naoAge ?
    antes : Math.max(0, antes + Math.max(0, quanto + (cd.velocidade ||
    0)));` · a marca lida ANTES da conta do Tick, em vez de depender da
    saturação aritmética do `-99`. Resultado para a mesa é idêntico (quem
    tinha Fora do tempo não avançava Tick nenhum antes, e continua não
    avançando), mas agora por leitura de marca, não por coincidência
    numérica.

  **O teste que o `L64` exigia reescrito**:
  `scripts/test-artes-grid.mjs:366` não afirma mais `foraDoTempo.velocidade
  <= -50` (a sentinela provada pela própria magnitude, a confusão do item
  escrita como asserção verde); afirma `foraDoTempo.naoAge === true` e
  `foraDoTempo.velocidade == null`.

  **Teste novo**, `scripts/test-l64-velocidade.mjs` (entrou em
  `package.json` → `validate`), em cinco seções: (1) o catálogo, a marca e
  a grandeza nunca no mesmo campo; (2) `somarCondicoes`, incluindo o caso
  misto (marca + grandeza de outra condição no mesmo lote, a marca não
  "rouba" o número); (3) `condChipHTML`, comportamento real (chamado de
  verdade, não texto): Fora do tempo mostra "não age" e não mostra nenhum
  número nem "vel ±N"; Acelerado continua mostrando "vel -2"; (4) A
  ASSERÇÃO QUE É O MOTIVO DA RODADA (detalhe abaixo); (5) `modEfeito`
  (`referencia.astro`) e `avancarTick` (`combate.astro`): CONFERÊNCIA FRACA,
  dita explicitamente nos comentários e aqui: as duas funções só existem
  dentro de `.astro`, o esbuild não as importa como módulo de Node, então a
  conferência é por TEXTO do arquivo (regex contra o trecho da função),
  não por chamada. Prova que o código está escrito do jeito certo, não que
  ele roda certo. Ajustei a janela de texto duas vezes (700→1100 chars no
  `modEfeito`, 600→1000 no `avancarTick`) depois de ver a primeira tentativa
  cortar a linha certa fora da janela; e troquei a busca de `avancarTick` de
  `/cd\.naoAge/` (que bateria até num COMENTÁRIO que citasse o nome do campo,
  sem nada de código atrás) para `/const novo = cd\.naoAge \? antes :/`,
  o texto do CÓDIGO, não de uma menção qualquer.

  **A ASSERÇÃO QUE É O MOTIVO DA RODADA, as três leituras pedidas:**
  1. **Vermelho hoje** (antes de qualquer conserto): rodei os dois testes
     contra o código de antes. `test-l64-velocidade.mjs` deu 12 falhas
     (marca ausente, `velocidade` ainda -99, chip ainda sem a palavra, as
     duas conferências fracas ainda sem o padrão novo); `test-artes-grid.mjs`
     deu 2 falhas nas asserções reescritas (`naoAge`/`velocidade == null`).
  2. **Verde com o conserto**: depois dos quatro pontos implementados, os
     dois testes voltaram a 0 falhas.
  3. **Vermelho de novo com a regressão de propósito**: inseri à mão, em
     `somarCondicoes`, depois do laço e antes do `return t;`:
     `t.velocidade = Math.max(-6, Math.min(6, t.velocidade));` (com
     comentário "REGRESSÃO DE PROPÓSITO, L64: desfazer antes de commitar").
     Rodei `test-l64-velocidade.mjs`: 1 falha, exatamente a asserção da
     seção 4 (`sem teto6, duas condições sintéticas de +5 somam 10, sem
     cortar em ±6`, esperado 10, achou 6). As asserções de `naoAge`/marca
     continuaram verdes (o clamp não toca a marca, só o número: a separação
     faz exatamente o que promete, o teto ingênuo já não pode mais
     confundir "não age" com "-6", só pode cortar grandeza de verdade, e é
     isso que a asserção pega). Desfiz o clamp à mão (`git diff` confirmado
     sem rastro dele no arquivo), rodei de novo: 0 falhas.

  `npx tsc --noEmit` limpo. `npm run validate` quebrou 11 citações (o campo
  novo e os comentários deslocaram `mesa-core.ts`/`combate.astro`; quatro
  delas citavam TEXTO que esta própria rodada reescreveu de propósito, não
  linha que só mudou de lugar). `node scripts/reapontar.mjs` (árvore sem
  `git add`) moveu 8 por mapa de diff e pulou 2 por `(citação histórica)`
  sozinho; as 4 restantes (`Pendencias.md:3924,3933,3951,3953`, citando
  `const novo = Math.max` e `foraDoTempo.velocidade <= -50`, os dois textos
  que este código não tem mais) marquei à mão como `(citação histórica)`,
  mesma convenção do `L95`: são descrição do estado de 10/09 e 12/09, não
  anchors que só se moveram. `npm run validate` EXIT:0, 287 citações, zero
  quebrada. Zero travessão no meu diff (conferido por `Grep` em cada
  arquivo tocado, nunca `git diff`): achei e corrigi um travessão meu em
  `test-l64-velocidade.mjs:21`, antes de rodar qualquer teste de novo.

  Fechando: commit com pathspec (`src/data/condicoes.json`,
  `src/lib/mesa-core.ts`, `src/pages/mesa/combate.astro`,
  `src/pages/mesa/referencia.astro`, `scripts/test-artes-grid.mjs`,
  `scripts/test-l64-velocidade.mjs`, `package.json`, `Pendencias.md`, este
  arquivo), depois `npm run rodada` com BASE `b82ae80`.
