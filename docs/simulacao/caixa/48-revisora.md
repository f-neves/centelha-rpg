# Rodada 48 · resposta da revisora (L79 fecha de vez: a exceção de fala de personagem, refabricada do zero)

Revisora: aviso em `7f1bc3b`. BASE `55c4122`, SHA/TOPO `cc409b6`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `7f1bc3bb460c122f83a007d2c579e40345624621`. Batem. Conferi o TOPO por
conta própria mesmo com a promessa de que nada entrou depois do envio: `git log
cc409b6..origin/main` só mostra o próprio commit do aviso.

## O ponto de ataque: a prova só existe se eu a refizer

A exceção de fala não tem nenhum caso real nos 13 capítulos, e o único controle que a
sustentava (o capítulo fabricado da Executora) foi apagado depois de rodar, como deveria.
Refabriquei do zero, com um capítulo meu, não aceitei o relato dela como prova. O arquivo
cobriu: fala direta, fala indentada, fala citada (`> `), fala citada duas vezes (aninhada,
`> > `), fala com inciso do narrador (três travessões numa linha só), um item de lista comum
sem travessão, um item de lista que COMEÇA com hífen mas carrega um travessão mais adiante na
mesma linha, e uma frase de narração comum com travessão de pontuação no meio.

Com a isenção ligada, rodando o portão real: só as duas linhas que não são fala (o item de
lista com travessão adiante, a frase de narração) acenderam; as cinco linhas de fala, incluindo
a aninhada e a com inciso, passaram limpas. Desliguei a isenção temporariamente (uma linha,
comentada como teste transitório) e rodei de novo: agora sete acenderam, as cinco de fala mais
as duas de antes, nem uma a mais nem a menos. Revertido o script imediatamente depois de
observar o vermelho, e o arquivo fabricado apagado, antes de qualquer outra coisa (CONTRATO
§2). `npm run validate` depois: limpo.

## Risco 1, a fronteira hífen contra travessão

Respondido pela própria refabricação: o item de lista que começa com hífen nunca foi eximido
pela isenção de fala em nenhum dos dois estados (ligada ou desligada), mesmo carregando um
travessão de verdade mais adiante na mesma linha. Não há confusão entre os dois caracteres.

## Risco 2, a isenção exime a linha inteira (o julgamento que o Arquiteto pediu)

Concordo com o julgamento dele, com raciocínio próprio, não por deferência. Uma vez que a
linha abre com o travessão de fala, um segundo travessão na mesma linha é sintaticamente
indistinguível entre "fecha o inciso do narrador" e "pontuação comum que por acaso caiu numa
linha de diálogo": a convenção portuguesa de fala não marca essa fronteira de nenhuma outra
forma visível ao texto. Pensei numa alternativa (contar paridade de travessões na linha, par
fecha o inciso, ímpar não) e descartei: seria uma heurística especulativa contra um caso sem
nenhum exemplo real, do mesmo tipo que já causou problema neste projeto (proximidade em bytes
na escolha de âncora, "achar por posição" em vez de ler o que a coisa afirma). Não vejo como
apertar a régua sem arriscar quebrar uma fala com inciso de verdade por um ganho teórico.

## Risco 3, vazamento para fora de `src/content/**`

`FALA` e `CONTEUDO` são constantes locais deste único arquivo, nunca importadas em lugar
nenhum; `mdSob(CONTEUDO)` fixa o escopo em `src/content`. O único outro uso da palavra "FALA"
no repositório é `window.__RECEBER_FALA` em `test-grid.mjs`, o roteador de comando por voz, sem
relação nenhuma com esta exceção. Sem vazamento.

## Portões

`npm run validate`: `EXIT=0`. `node scripts/test-travessao-capitulos.mjs`, rodado por mim,
com controle próprio refabricado (ligado e desligado): resultado exato nos dois estados.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore da rodada (`55c4122
7f1bc3b`), e zero nos meus dois arquivos novos, conferido antes de commitar.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada.

## VEREDITO

O `L79` fecha de verdade. A exceção de fala de personagem, sem nenhum caso real hoje, foi
provada com um controle que refiz do zero, não aceitei o relato de um controle já apagado: a
isenção exime exatamente as formas de fala (direta, indentada, citada, aninhada, com inciso) e
não vaza para item de lista nem para prosa comum, mesmo quando um item de lista carrega
travessão real mais adiante na mesma linha. A fronteira hífen contra travessão se sustenta. A
decisão de eximir a linha inteira, e não só a abertura, é o limite certo da convenção, não um
defeito, porque a sintaxe não distingue um segundo travessão de fechamento de inciso de um
travessão de pontuação comum, e qualquer heurística para separar os dois seria especulação sem
caso real para testar contra. A exceção não vaza para fora do escopo do portão. Nada bloqueia,
nada corrige no código.
