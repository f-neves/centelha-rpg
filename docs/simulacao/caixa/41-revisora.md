# Rodada 41 · resposta da revisora (L72: as citações de código em item fechado)

Revisora: aviso em `76145c8`. BASE `fe7e220`, SHA/TOPO `4d86d6c`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `76145c80528480741298fc8ca70b603f8167acf7`. Batem. Nota: `git checkout
origin/main` sozinho teria me levado a `4c6047f`, um commit adiante do aviso (o Arquiteto já
tinha empurrado a entrada do CATALOGO na hora da mensagem): corrigi para o sha exato do aviso,
`76145c8`, por §0.

Dois commits desde a BASE: `6398e99` (Arquiteto, fecha L67/L68 no `Pendencias.md`) e `4d86d6c`
(Executora, o L72). `git diff fe7e220 4d86d6c` (BASE é ancestral de verdade desta vez, o aviso
confirma) cobre os dois.

## O ceticismo padrão de ontem, aplicado aos quatro riscos que o Arquiteto marcou

**Risco 2 (a dívida realmente subiu?): medido, não aceito de cabeça.** Escrevi um script próprio
espelhando a lógica de âncora do `test-procedencia.mjs`, classificando cada citação por item
aberto/fechado, e rodei contra `Pendencias.md` no estado exato de `6398e99` (logo depois do
fechamento do L67/L68, antes de qualquer reparo desta rodada). Resultado: **77 em itens fechados,
15 quebradas, 8 sem âncora**, batendo número a número e LINHA A LINHA com o que o aviso publica.
Confirmei as duas citações ligadas ao fechamento de ontem: `Pendencias.md:4043` citava
`grid.astro:3344` para `raioExtraHex`, que mora de verdade em `3364` (erro de 20 linhas, já
existia assim quando o item fechou); `Pendencias.md:4485` citava `grid.astro:4563` para
`function grupoDaVez`, mas a âncora que o script realmente escolhe é `!grupoDaVez` (o fragmento
ANTES da citação, mais próximo em caracteres), que hoje só existe dentro de um COMENTÁRIO em
`4591`, fora da janela de `4563`. As duas apodreceram no dia do fechamento, exatamente como o
Arquiteto afirmou.

**Risco 3 (a marca `(citação histórica)` cala só a citação, não a linha): falsificado ao vivo.**
Inseri uma segunda citação de propósito, quebrada, na mesma linha do marcador
(`Pendencias.md:3737`), logo DEPOIS do `(citação histórica)`. `node scripts/test-procedencia.mjs`
acendeu só a minha citação nova; a marcada original continuou muda. Revertido imediatamente,
`git status`/`git diff --stat` limpos antes de qualquer outra coisa (CONTRATO §2).

**Risco 4 (o controle negativo): repetido com um caso diferente do da Executora.** Quebrei
`Pendencias.md:4387` (item `L77`, aberto, `grid.astro:3364` → `9999`) e confirmei o portão
acender; revertido, verde de novo (148 conferidas, 1 histórica).

**Risco 1 (o conserto por busca de âncora comum): amostrado por leitura, não por confiança.**
`const cd = somarCondicoes` existe DUAS vezes em `grid.astro` (9600 e 10733). O conserto em
`Pendencias.md:1404` ("a leitura na folha do lance") aponta para `9600`; li o código ao redor
(9590-9601, dentro da função que clona `RESUMO` para a folha) e a descrição bate com essa
ocorrência, não com a do lado do mestre (10733): não foi picada pela proximidade, foi lida.

## As três decisões (D41a/b/c)

`D41a`: confirmado lendo `grid.astro:7415-7421`, é uma cadeia de `else if`, sem `switch`
nenhum; a prosa nova ("dentro do `if`/`else` do menu de contexto") está certa, e a antiga
("dentro do `switch`") estava mesmo desatualizada. `D41c`: a citação de `getBoundingClientRect`
saiu sem número de linha; o texto ao redor lê coerente sem ela ("sintoma observado numa rodada de
teste, sem linha estável para citar"). `D41b` não conferi caso a caso (são 8 âncoras novas em 8
achados sem âncora prévia, trabalho de leitura repetitivo sem risco estrutural diferente do
risco 1 já amostrado).

## A entrada do CATALOGO

Lida (`docs/simulacao/CATALOGO.md:565-584`) e bate exatamente com a minha própria reconstrução do
risco 2: a heurística de "âncora mais próxima" mede caracteres a partir do INÍCIO da citação, e
uma âncora ANTES não paga o desconto do tamanho da própria citação que uma âncora DEPOIS paga.
Por isso `!grupoDaVez` (antes) venceu `function grupoDaVez` (depois) por uma margem que não é
visível a olho.

## Portões

`npm run validate`: `EXIT=0`. Esta rodada não toca `grid.astro` nem nenhuma tela (só
`Pendencias.md`, `CATALOGO.md` e `test-procedencia.mjs`), então não rodei bateria de puppeteer:
o `validate` já exercita o script alterado, e não há UI para exercitar.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore inteiro da rodada
(`fe7e220 4d86d6c`), conferido no diff, não herdado.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada. Os quatro riscos que o Arquiteto marcou foram verificados por medição/falsificação própria,
não por leitura de relatório, e todos procedem como descrito.

## VEREDITO

O L72 está corrigido como o aviso descreve, e cada um dos quatro pontos de ceticismo pedidos foi
verificado por conta própria, não aceito de palavra: a dívida de 77/15/8 em itens fechados foi
remedida do zero com script próprio e bateu linha a linha; a marca `(citação histórica)` cala só
a citação que ela acompanha, confirmado forçando uma citação quebrada ao lado dela na mesma
linha; o controle negativo continua pegando citação podre em item aberto, repetido com um caso
diferente do da Executora; e uma amostra do conserto com âncora ambígua (`somarCondicoes`, duas
ocorrências) foi lida e está correta, não escolhida por proximidade. Nada bloqueia, nada corrige.
