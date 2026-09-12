# Progresso · rodada 56 · L86b

Sinal de vida da Executora. Uma linha por etapa pequena, hora real (`date +%H:%M`).

- 16:49 · Rodada aberta. Tarefa: só `acelerar-a-cura` cura no tabuleiro, 1 PV
  por nível da Arte de quem conjura (`plano.nivelArte`), a cada turno. Chão
  que destrava: as duas perguntas do L86 respondidas pelo humano (nível é o
  da Arte, não do grau do parâmetro; a cura em área do `maos-sobre-a-multidao`
  não entra nesta rodada), `efeitos.json` já diz "1 PV por nível da Arte", e
  `supabase/migracao-38.sql` escrito e carimbado (`nivel_arte`, nula, sem
  default), mas NÃO rodado. Li o cabeçalho da migração: nulo é "não sei",
  nunca 1; gravação de efeito não pode falhar inteira por `nivel_arte`
  ausente (degradar como `carimbarSeFaltar`, migração 29).

  Implementado:
  - `src/lib/artes-grid.ts`: `Parametro.porNivel` (campo estruturado, gêmeo de
    `pontos`); `EfeitoAtivo.nivel_arte: number | null`; `curaDoEfeito` ganhou
    um segundo parâmetro `nivelArte` (lê `pontos` primeiro, senão `porNivel`
    com o nível dado); nova `curaPrecisaNivelArte(efeito)` para distinguir
    "não cura" de "cura e falta o dado"; nova constante `SEM_NIVEL_ARTE`
    (chave sintética no mesmo `mordidos`, ao lado de `A_SAIR`).
  - `src/data/efeitos.json`: `acelerar-a-cura` ganha `"porNivel": true` no
    parâmetro Cura.
  - `src/lib/artes-grid-mesa.ts`: `gravarEfeito` grava `nivel_arte:
    plano.nivelArte`; se o insert falhar por coluna ausente (`PGRST204` +
    menção a `nivel_arte`/"schema cache"/"does not exist"/"column"), regrava
    sem ela; qualquer outro erro continua caindo no `uiErro` de sempre. O
    objeto em memória (`ATIVOS.push`) sempre guarda o `nivel_arte` real do
    `plano`, mesmo quando a coluna não existe: o cliente sabe o número,
    mesmo quando a coluna não sabe guardá-lo. `verificarEfeitos`: a guarda
    agora passa `ef.nivel_arte` para `curaDoEfeito`; quando um Efeito PEDE
    `porNivel` e a linha não tem o dado, a cena avisa no log ("falta rodar
    supabase/migracao-38.sql"), no máximo uma vez por turno (reusa
    `jaMordido`/`marcarMordido` com a chave `SEM_NIVEL_ARTE`, não é mordida
    nenhuma, só o mesmo relógio), e continua sem curar.

  `npx tsc --noEmit` limpo. `node scripts/test-l86a-cura.mjs` continua 32/32
  (a mudança de assinatura de `curaDoEfeito` é compatível para trás).

  Próximo passo: escrever o teste novo (três sentidos: nivel_arte presente
  cura certo; nivel_arte nulo não cura e loga; controle negativo por
  `git stash`), depois `npm run validate` completo.

- 16:55 · Teste novo escrito (`scripts/test-l86b-acelerar-cura.mjs`, mesmo
  harness do L86a), e ele pegou um defeito meu antes de qualquer commit: eu
  tinha forçado `nivel_arte: plano.nivelArte` de volta no `ATIVOS.push`,
  mesmo quando a gravação degradava por coluna ausente. Isso faria a Arte
  curar durante a sessão corrente (o cliente "lembrava" o número que a coluna
  recusou) e parar de curar sozinha no primeiro F5, sem ninguém mudar nada:
  o mesmo formato de inconsistência que o `carimbarSeFaltar` (migração 29)
  evita ao não atualizar `ENC.perfil` quando o carimbo falha. Corrigido: a
  linha em memória reflete o que o banco de fato aceitou, nunca um valor que
  o cliente só computou antes da coluna recusar. 20/20 depois do conserto.

  ACHADO, NÃO AÇÃO: `supabase/migracao-38.sql` está modificado e NÃO
  commitado na árvore (não é meu, não toquei, nem com stash). A diferença
  acrescenta `jogador_conjura` recriada com `nivel_arte` na lista de colunas,
  pelo motivo certo: ela é o SEGUNDO escritor da linha (quando quem conjura é
  jogador, não mestre), e sem isso a Arte de um jogador nunca curaria e a
  degradação apontaria causa errada ("falta migração" para quem já rodou).
  Conferi que meu código client-side não precisa mudar por isso:
  `sbDoJogador()` (`grid.astro:2771`) manda a `linha` inteira como `p_dados`
  para a RPC, então se a versão da função não souber ler `nivel_arte` do
  JSON, o campo só fica ausente na linha devolvida, sem erro, e `daLinha`
  espalha o que veio: ausência já degrada como "não sei", sem precisar do
  meu ramo de `PGRST204` (esse cobre só o caminho do mestre, insert direto na
  tabela, onde coluna ausente de verdade dá erro). Avisei o Arquiteto, não
  bloqueei no meu escopo.

  `npx tsc --noEmit` limpo. `npm run validate` inteiro roda limpo fora da
  procedência esperada (27 âncoras deslocadas pelas linhas que mexi, nos
  documentos do Arquiteto). Controle negativo por `git stash push -- src/lib/
  artes-grid-mesa.ts` (só esse arquivo): a régua (Eixo 1, `artes-grid.ts`)
  ficou verde, 4 das 12 asserções de despacho ficaram vermelhas, restaurado
  com `git stash pop` depois de confirmar.

  Nada commitado ainda.

- 17:05 · Quatro correções do Arquiteto aplicadas: (1) `curaDoEfeito` não
  "ligava um fio existente", era ramo novo de verdade, confirmado; (2)
  `Parametro.porNivel` (booleano) trocado por `pontosPorNivel` (número), a
  régua passa a multiplicar `pontosPorNivel * nivelArte` em vez de repassar
  o nível sozinho (adicionei uma asserção nova com `pontosPorNivel: 2` só
  pra provar a multiplicação, não só a passagem do número, depois de ver que
  a minha primeira asserção passaria mesmo se a régua só repassasse);
  `efeitos.json` do `acelerar-a-cura` ganhou `"pontosPorNivel": 1`; (3) o
  log do nulo não nomeia mais a migração 38 ("falta rodar...") → agora diz
  "esta linha não guarda o nível da Arte" (nulo tem mais de uma causa, e
  nomear uma aponta a errada para quem já rodou); confirmado que o lado do
  jogador (`jogador_conjura`, segundo escritor da linha) não precisa de
  guarda nova no meu código, já degrada de graça por campo de `jsonb`
  ignorado; (4) corrigida a mensagem da asserção do `maos-sobre-a-multidao`
  em `test-l86a-cura.mjs` (o JSON não é mais `"padrao"`, é `"fixo"` com a
  decisão do humano escrita; continua null por faltar `pontosPorNivel`, DE
  PROPÓSITO, não escrevo esse campo lá). `npx tsc --noEmit` limpo,
  `test-l86a-cura.mjs` 32/32, `test-l86b-acelerar-cura.mjs` 21/21 (ganhou a
  asserção da multiplicação).

  TENTEI `node scripts/reapontar.mjs` para fechar o commit, como pedido, e
  ele quebrou 14 citações PRÉ-EXISTENTES (não minhas) em `Pendencias.md`/
  `CONJURACAO.md`, com um padrão de deslocamento ERRADO: conferi por leitura
  direta (não `git diff`) que `parametrosAjustaveis` está de verdade na
  linha 168 do `artes-grid.ts` de agora, e o reapontador escreveu 160; que
  `custoDe` está em 312, e ele escreveu 283; que a chamada real de `acaso()`
  está em 1435, e ele escreveu 1406. Os offsets (-8 e -29 duas vezes) não são
  constantes, o que aponta pra um hunk específico do meu diff (a reescrita
  de `curaDoEfeito`/`curaPrecisaNivelArte`, entre essas duas âncoras) cujo
  deslocamento o mapa do diff não somou certo. Revertido com `git checkout
  -- Pendencias.md docs/simulacao/CONJURACAO.md` antes de qualquer commit:
  não deixei a escrita errada do reapontador entrar na árvore. Avisei o
  Arquiteto com os três exemplos e esperando decisão: não é meu lugar
  debugar a ferramenta dele, e commitar documentação com citação nova e
  ERRADA seria pior que a citação velha que ela tentava consertar.

  Nada commitado ainda.

- 17:13 · Três correções do Arquiteto sobre o que mandei às 17:05, aplicadas.

  (1) A asserção de `test-l86b-acelerar-cura.mjs` estava atrás da própria
  mensagem (que já dizia o certo desde a correção 3, "esta linha não guarda
  o nível da Arte"): consertada, e junto o rótulo dela, que ainda descrevia
  "falta a migração" (a forma que o CATALOGO cataloga como passar pelo
  motivo errado). Arquiteto decidiu a redação final do próprio log,
  acrescentando a CONFERÊNCIA sem virar diagnóstico: agora diz "esta linha
  não guarda o nível da Arte (confira se a migração 38 rodou)". Fato mais
  conferência, nunca causa. Atualizei código, teste e o comentário de
  cabeçalho do arquivo.

  (2) DESFEITO: `Parametro.pontosPorNivel` (número, multiplicador) volta a
  ser `Parametro.porNivel` (booleano). Nenhuma Arte do catálogo cura K PV
  por nível com K≠1 hoje; `transferir-dor`/`refazer-o-corpo` escalam por
  nível mas não são soma simples de cura (dano e dado, não PV), então não
  cabem num multiplicador deste campo. Documentei no próprio campo: o teto
  (K≠1 futuro vira `pontos vezes porNivel`, só quando houver Arte real que
  peça) e o vizinho (`pontos` testado primeiro, vence em silêncio se os dois
  existirem). Adicionei uma asserção sintética provando esse silêncio
  (`pontos: 5, porNivel: true` com nivelArte 3 → devolve 5, não 3), em vez
  de só escrever no comentário e confiar. Removi a asserção de multiplicação
  (não existe mais o que multiplicar) e revertido `efeitos.json` do
  `acelerar-a-cura` para `"porNivel": true`.

  (3) `reapontar.mjs` tinha o defeito que EU relatei: o diff usado
  (`git diff -U0 -- <arq>`) é índice→árvore, não HEAD→árvore, e meus
  arquivos estavam `MM` (staged e editados depois), então a metade já
  staged nunca entrava na conta. Medido pelo Arquiteto: 31+/24− sem `HEAD`
  contra 51+/7− com, em `artes-grid.ts`. Corrigido para `git diff HEAD -U0`,
  com comentário explicando por quê (a medida acima, escrita ali como
  prova). Rodei UMA vez: de 14 citações quebradas foram para 1 (`Pendencias.
  md:2677`, `ATIVOS.push`), e essa eu confirmei por `Grep` (ocorrência única
  no arquivo, sem ambiguidade de âncora) que é deslocamento puro, não
  reescrita de conteúdo (a linha em si não mudou, só um comentário acima
  dela cresceu); corrigida à mão (1515 → 1524), não é o `L65` que a medida
  de 12/09 proíbe (não é busca de âncora ambígua, é conferência de uma
  ocorrência já encontrada e única). `npm run validate` fechou EXIT:0,
  290 citações conferidas, zero quebrada.

  O reaponte corrigido alcançou 5 documentos, não os 2 que o Arquiteto tinha
  estimado com a ferramenta ainda quebrada: `Pendencias.md` (34), `CONJURACAO.
  md` (11), `VOZ.md` (1), `Grid_Mobile.md` (1), `Auditoria_Tecnica.md` (1).
  Todos entram no meu commit, junto com `scripts/reapontar.mjs`.

  `npx tsc --noEmit` limpo. `test-l86a-cura.mjs` 32/32. `test-l86b-acelerar-
  cura.mjs` 22/22 (a asserção do silêncio substitui a da multiplicação).
  Zero travessão novo (conferido por `Grep`, nunca `git diff`).

  Comitando agora.
