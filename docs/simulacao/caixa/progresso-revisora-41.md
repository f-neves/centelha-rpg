# Progresso · rodada 41 (L72: as citações de código em itens fechados, fora do campo de visão do portão)

Arquivo de sinal de vida (CONTRATO-REVISORA §6). Uma linha por etapa fechada, no instante em que fecha, hora lida de `date +%H:%M`. A linha final entra no mesmo commit do veredito.

- 08:04 · reancorada. `git checkout origin/main` foi ATÉ `4c6047f`, adiante do aviso (o Arquiteto
  já tinha empurrado a entrada do CATALOGO depois de mandar a mensagem); corrigi para o commit
  exato do aviso, `76145c8` (passo 0 do §0: `git rev-parse --show-toplevel`/`HEAD` batem, tree
  limpa antes). Lendo o aviso agora. Ceticismo padrão desta rodada, herdado de ontem: não aceitar
  "portão verde" sem confirmar que ele pegaria o defeito de volta. Quatro pontos do Arquiteto, em
  ordem de risco: (1) amostrar o conserto das 15 quebradas por leitura, preferindo âncora comum;
  (2) medir se a dívida do L72 realmente subiu como ele afirmou (o L67/L68 fechando na 40 mandou
  citações para o limbo); (3) confirmar que `(citação histórica)` só cala a citação marcada, não
  a linha inteira; (4) repetir pelo menos um controle negativo (item aberto continua acusando).
- 08:09 · risco 3 (a marca): inseri uma segunda citação de propósito, quebrada, na MESMA linha
  do marcador histórico (`Pendencias.md:3737`), logo DEPOIS de `(citação histórica)`. Rodei
  `node scripts/test-procedencia.mjs`: acendeu só a minha citação nova (`grid.astro:9999  âncora
  \`cenaLembranca\` não está lá`), a original marcada continuou muda. Revertido imediatamente,
  `git status`/`git diff --stat` limpos.
- 08:09 · risco 2 (a dívida): não aceitei o número de cabeça. Escrevi um script próprio
  (`medir-l72.mjs`, no scratchpad, não entra no repo) espelhando a mesma lógica de âncora do
  `test-procedencia.mjs`, mas classificando por item aberto/fechado, e rodei contra o
  `Pendencias.md` de ANTES do reparo (`git show 6398e99:Pendencias.md`, o estado logo depois de
  o Arquiteto fechar L67/L68 e antes de qualquer conserto desta rodada). Resultado: 77 em
  fechado, 15 quebradas, 8 sem âncora, batendo NÚMERO A NÚMERO e LINHA A LINHA com o aviso.
  Conferi as duas citações que vieram do fechamento do L67/L68 (`:4043`→`grid.astro:3344`,
  real em `3364`, erro de 20; `:4485`, a âncora escolhida foi `!grupoDaVez`, que só existe hoje
  dentro de um COMENTÁRIO em `4591`, fora da janela do `grid.astro:4563` citado): confirmado, as
  duas apodreceram no fechamento, não antes.
- 08:10 · risco 4 (controle negativo): não repeti o mesmo caso da Executora, escolhi outro.
  Quebrei `Pendencias.md:4387` (`L77`, item ABERTO, `grid.astro:3364`→`9999`) e confirmei o
  portão acender; revertido, `git status`/`git diff --stat` limpos, verde de novo (148/1).
- 08:11 · risco 1 (amostra de conserto com âncora repetida): `const cd = somarCondicoes` existe
  duas vezes em `grid.astro` (9600 e 10733). O conserto em `Pendencias.md:1404` ("a leitura na
  folha do lance") aponta para `9600`; li o código ao redor (9590-9601, dentro da função que
  clona `RESUMO` para a folha) e bate com a descrição, não é a ocorrência do lado do mestre
  (10733). D41a (`switch`→`if`/`else`) também confirmado lendo `grid.astro:7415-7421`: é uma
  cadeia de `else if`, sem `switch` nenhum. D41c (a citação sem linha, `getBoundingClientRect`)
  confirmado: o texto lê coerente sem número, "sintoma... sem linha estável para citar". Entrada
  do CATALOGO lida e bate com a minha própria conta do risco 2. `npm run validate`: `EXIT=0`.
  Travessão: zero no diff de árvore inteiro da rodada (`fe7e220 4d86d6c`). Este round não toca
  `grid.astro`/UI (só `Pendencias.md`, `CATALOGO.md`, `test-procedencia.mjs`), então não rodei
  puppeteer de novo: o `validate` já exercita o script tocado.
- 08:13 · antes de commitar, conferi travessão nos MEUS DOIS ARQUIVOS NOVOS (a lição da rodada
  39, que ainda não tinha virado hábito de verdade): a busca pelo caractere achou 15 no total
  (10 no veredito, 5 aqui), todos no meu próprio jeito de abrir cada linha depois da hora.
  Corrigidos os dois arquivos (travessão trocado por dois-pontos ou ponto-médio), reconferido,
  zero nos dois. Achei antes de qualquer outra pessoa precisar apontar.
