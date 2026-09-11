# Progresso · rodada 41 (L72)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA (por função terminada,
não só por item), no instante em que ela fecha, hora lida da máquina (`date +%H:%M`).

- 07:37 (sha 6398e99, 0 à frente/atrás de `origin/main`): começando. Medir antes de
  consertar, como pedido: quantas citações de código existem em itens FECHADOS do
  Pendencias.md hoje, e quantas estão quebradas. Vou ler `scripts/test-procedencia.mjs`
  primeiro para entender o filtro de "item aberto" que exclui isso hoje.
- 07:38 · MEDIDO. Espelhei a lógica de `test-procedencia.mjs` (mesma âncora, mesma
  janela de 3 linhas, mesma regex) num script à parte, invertendo só o filtro
  `vale(i)` (aberto → fechado), rodei contra o `Pendencias.md` de hoje e apaguei o
  script (era só medição, não fica no repositório). Números:
  - **77 citações de código em itens FECHADOS** (contra as que já contam hoje, só
    nos abertos);
  - **8 sem âncora nenhuma** (categoria que hoje já é falha dura para item aberto:
    `Pendencias.md:1137,1137,2429,2430,2432,2438,3780,4477`);
  - **15 quebradas** (a âncora não está na janela): `:1168,1403,1713,1776,2353,2362,
    2418,2428,2434,3526,3735,3739,3786,4043,4485`. Duas delas (`:4043`
    `raioExtraHex`, `:4485` `!grupoDaVez`) são da minha PRÓPRIA rodada 40, fechada
    ontem: apodreceram no mesmo dia em que o item fechou, exatamente o incentivo
    errado que o Arquiteto descreveu.
  - Total: 77 citações, 23 com problema (15 quebradas + 8 sem âncora) = ~30% do que
    hoje não é conferido. Passando o número ao Arquiteto antes de decidir entre
    ligar direto ou entrar com lista de exceções.
- 07:51 · 21 de 23 consertadas à mão, procurando a âncora uma por uma (nunca pela
  proximidade quando repetia). Duas ficam de verdade ambíguas e paro para trazer, como
  instruído: `Pendencias.md:1714` (grid.astro, a variável `dist`) tem DOIS candidatos
  idênticos (`declararGolpe` e `folhaDaAcao`, cada um com `const hexes = ...; const dist =
  ...` igual) e o parágrafo não diz qual chamador; `Pendencias.md:3737` (L61, revisão do
  aviso 27) cita `test-grid.mjs:533` DE PROPÓSITO, como registro histórico do que a aviso
  27 disse errado: corrigir o número apagaria o próprio achado que a entrada existe para
  guardar, mas a "correção" que o parágrafo escreve ao lado (`:3481-3545`) também já está
  velha hoje (a função real está em `:4048`). Achado no caminho: a proximidade que o
  script usa é por DISTÂNCIA DE CARACTERES a partir do INÍCIO da citação, e uma âncora
  ANTES da citação some no meio de menos texto do que uma DEPOIS dela, mesmo quando a
  segunda parece "mais próxima" para quem lê: dois dos meus próprios consertos
  (`grupoDaVez`, `mesa-condicoes.ts:100-106`) escolheram a âncora errada por isso, e só
  a segunda rodada do diagnóstico achou.
- 07:54 · PORTÃO LIGADO. `test-procedencia.mjs`: removido o filtro `valeAqui` que só contava
  item aberto do Pendencias.md; agora toda linha conta, os dois arquivos (ESTADO.md e
  Pendencias.md) por igual. `npm run validate` inteiro: só as duas linhas ambíguas em
  vermelho (esperado, esperando resposta). CONTROLE POSITIVO: quebrei de propósito uma
  citação de código dentro de um item FECHADO (`raioExtraHex`, L67, `grid.astro:3364` para
  `9999`) e confirmei o portão acender (3 vermelhas em vez de 2); revertido, voltou a 2.
  CONTROLE NEGATIVO: quebrei uma citação dentro de um item ABERTO (`alcanceInterpor`, L76,
  `alcance.ts:113` para `9999`) e confirmei que ainda acende (a conferência de item aberto
  não foi substituída, só ficou maior); revertido. `npm run validate` completo, fora as duas
  linhas ambíguas: verde. Falta a resposta do Arquiteto sobre as duas linhas para poder
  commitar (o portão de pre-commit não passa com elas vermelhas).
- 08:00 · AS DUAS RESPOSTAS DO ARQUITETO APLICADAS. `:1714` → `grid.astro:9645` (o método certo era
  a cadeia de chamada de `faixaDeDistancia`, não a proximidade). `:3737` ganhou a marca
  `(citação histórica)` (nova em `test-procedencia.mjs`, pula só a citação em cujo território
  ela cai, do fim da citação até a próxima ou o fim da linha, nunca a linha inteira), e a
  correção ao lado passou a citar `cenaLembranca` em `test-grid.mjs:4048` de verdade, checada
  como as outras. Dois controles da marca, os dois na MESMA linha (duas citações, uma marcada
  quebrada de propósito, outra viva): a marcada quebrada não acende; quebrando a viva ao lado,
  acende só ela. Os dois revertidos, voltou ao estado real (148 conferidas, 1 marcada).
  `npm run validate` inteiro: verde, exit 0. Entrada nova no `CATALOGO.md` sobre a proximidade
  por bytes preferir o "antes" (o achado mais reaproveitável da rodada, por pedido do
  Arquiteto). `scripts/_diag-l72.mjs` já não existia (a mensagem que dizia o contrário cruzou
  com a minha exclusão). Pronta para commitar.
