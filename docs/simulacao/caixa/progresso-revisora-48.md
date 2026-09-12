# Progresso · rodada 48 (a exceção de fala de personagem no portão de travessão, L79 fecha de vez)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 21:56 · reancorada em `7f1bc3bb460c122f83a007d2c579e40345624621` (passo 0 do §0 confirmado,
  tree limpa antes). Conferi o TOPO por conta própria mesmo com a promessa de que nada entrou
  depois do `--enviar`: `git log cc409b6..origin/main` só mostra o próprio commit do aviso.
  O ponto de ataque desta rodada: a exceção de fala de personagem não tem NENHUM caso real no
  repositório, então a prova inteira é o controle fabricado, e o controle fabricado da
  Executora foi apagado depois de rodar. Vou refabricar do zero, com o meu próprio capítulo,
  não aceitar o relato dela. Lendo o aviso agora.
- 21:58 · lido `48-executora.md`, `progresso-48-l79.md` e `test-travessao-capitulos.mjs`
  inteiro. Refabriquei o controle do zero, com um capítulo meu
  (`_teste-fala-revisora.md`), cobrindo os casos que quis testar: fala direta, fala
  indentada, fala citada, fala citada duas vezes (aninhada), fala com inciso do narrador
  (três travessões numa linha), item de lista comum (hífen, sem travessão), item de lista
  que começa com hífen mas carrega um travessão mais adiante (o ataque ao risco 1), e uma
  frase de narração comum com travessão no meio (não deveria ser eximida). Rodei o portão
  real com a isenção ligada: só as DUAS linhas que não são fala (o item de lista com
  travessão adiante e a frase de narração) acenderam; as cinco de fala, incluindo a
  aninhada e a com inciso, passaram limpo. Desliguei a isenção temporariamente (`if
  (false && FALA.test(...))`, comentário "reverter já") e rodei de novo: agora 7
  acenderam, as cinco de fala mais as duas de antes, nenhuma a mais nem a menos. Revertido
  o script imediatamente, apagado o arquivo fabricado, `git status`/`git diff --stat`
  limpos (CONTRATO §2, antes de qualquer outra coisa). `npm run validate` depois: verde.
- 21:59 · risco 1 (fronteira hífen contra travessão) respondido pela própria refabricação
  acima: o item de lista que começa com hífen NUNCA foi eximido pela FALA em nenhum dos
  dois estados (ligada/desligada), mesmo carregando um travessão real mais adiante na
  mesma linha. Não há confusão entre os dois caracteres.
- 21:59 · risco 2 (a isenção exime a linha inteira): concordo com o julgamento do
  Arquiteto, com raciocínio próprio. Uma vez que a linha abre com o travessão de fala, um
  segundo travessão na mesma linha é sintaticamente indistinguível entre "fecha o inciso
  do narrador" e "pontuação comum que por acaso caiu numa linha de diálogo": a convenção
  portuguesa de fala não marca essa fronteira de nenhuma outra forma, e contar paridade de
  travessões (par/ímpar) para adivinhar seria heurística especulativa do mesmo tipo que já
  causou problema neste projeto (proximidade em bytes, âncora por posição). Não vejo como
  apertar sem arriscar quebrar a fala com inciso de verdade.
- 21:59 · risco 3 (vazamento para fora de src/content/**): `FALA` e `CONTEUDO` são
  constantes locais deste único arquivo, nunca importadas em lugar nenhum; `mdSob(CONTEUDO)`
  fixa o escopo em `src/content`. O único outro uso da palavra "FALA" no repositório é
  `window.__RECEBER_FALA` em `test-grid.mjs`, o roteador de voz, sem relação nenhuma. Sem
  vazamento.
- 22:00 · `npm run validate`: `EXIT=0`. `48-revisora.md` escrito, travessão conferido nos
  dois arquivos novos antes de commitar: zero. Indo commitar.
