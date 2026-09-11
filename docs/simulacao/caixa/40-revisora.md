# Rodada 40 · resposta da revisora (L68 · o diálogo de fora da vez; L67 nono/décimo lugar; a regressão do gatilho; o L65 corrigido)

Revisora: aviso em `7170926`. BASE `979ec38`, SHA/TOPO `107d1a3`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `7170926b001b2176776779a03e58b07ffe8ceb3d`. Batem. Nota do próprio aviso,
confirmada: `979ec38` (meu veredito da 39) não é ancestral de `107d1a3` porque o Arquiteto trouxe
para o `main` por cherry-pick (`fb489a6`); usei `git diff 979ec38 107d1a3` (diferença de árvore),
não `git log` (intervalo), para não me confundir com o aviso de "1 commit atrás" que o checkout
mostra.

## Item 1 (L68) — nenhuma frase escrita à mão, conferido no código

Fui direto na condição que o aviso pediu para verificar: `perguntarForaDaVez`
(`grid.astro:6147-6163`). O texto que VARIA por fase (`fdv-nota`) vem estritamente de
`fh.porque` (`nota.textContent = fh.pode ? '' : fh.porque`), e `fh` é o retorno de
`foraDeHora(acao, T, velDaPeca(c))`, a função do motor (`src/lib/combate-tempo.ts:898`). As
quatro frases (`'Está livre: age na hora...'`, `'Está no Golpe: não se aborta...'`, `'No
Preparo...abortar...'`, a da dívida) moram TODAS dentro dessa função única, escritas uma vez,
não copiadas para o diálogo. O botão `AGIR FORA DO TURNO` também decide por fase, não por texto:
`fase !== 'preparo' && fase !== 'golpe'`. As duas linhas fixas do modal (`fdv-titulo`,
`fdv-linha`) são chrome comum a todas as fases, não conteúdo por fase, e não é isso que a regra
de "nenhuma lista fixa escrita à mão" (VOZ.md, decisão 13) proíbe. Confere: verdade.

Rodei `test-l68-foradavez-mesa.mjs` eu mesma: `EXIT=0`. As cinco respostas provadas ao vivo,
todas as asserções lendo DOM real (`textContent` de `fdv-nota`, `hidden` do botão, a última linha
do registro, a posição crua por `__ESPELHO.posDe`), nenhuma recalculando por dentro.

## O gatilho novo (`chegouAVez`) — não é uma segunda régua de vez

Comparei `chegouAVez` (`grid.astro:4603-4608`) contra `grupoDaVez`/`tickDaVez`
(`grid.astro:4531-4581`) função por função, que era o ponto do ceticismo pedido ("era para ele
conviver com o `grupoDaVez`, não substituí-lo por dentro"). `chegouAVez` usa exatamente o mesmo
relógio (`tickDaVez()`) e o mesmo campo (`c.tick`) que `grupoDaVez` usa, com a mesma distinção
Simultâneo/turnos (`SIML()`). A diferença é que `grupoDaVez` também zera a lista quando um golpe
está caindo (`golpeMaisCedo() <= t`), uma condição sobre o RELÓGIO, não sobre a peça arrastada —
e é exatamente essa mistura que fazia `!grupoDaVez().some(...)` abrir o diálogo em qualquer
arrasto durante uma queda. `chegouAVez` não inventa um relógio novo, só faz uma pergunta mais
estreita com o mesmo relógio. O comentário no código (linhas 4586-4602) já argumenta isso, e
concordo com a leitura.

Não repeti a medição 12 de 12 / 7 de 12 por conta própria (exigiria reconstruir o bench e o golpe
no ar à mão); li a lógica que a explica e ela é consistente com os números publicados.

## D40b — falsifiquei uma das três, não aceitei de palavra

Forcei `reprojetarAgenda(...)` a `null` em `grid.astro:5782` e isolei `cenaAlvoQueFoge` em
`test-grid-simultaneo.mjs` (comentei as outras seis chamadas só para rodar mais rápido). Resultado:
`✗ o registro conta o adiamento, e diz de onde para onde`, sozinha vermelha entre as oito
asserções da cena. Revertido os dois arquivos imediatamente depois de observar a queda, antes de
qualquer outra coisa (`git status --short`/`git diff --stat` limpos, CONTRATO §2). A asserção
protegida é sensível ao mecanismo que ela diz vigiar, não é uma prova morta.

## O nono e o décimo lugar (L67)

`grid.astro:9737` (`avisoAlcance`, o texto da recusa) e `:10216` (`valoresDoLance`, "Alcance da
arma") somam `+ raioExtraHex(alvo)`, confirmado lendo o código. Rodei `test-l67-corpoacorpo-
mesa.mjs` eu mesma: `EXIT=0`, as duas asserções novas (linhas 83 e 86) leem `textContent` real do
DOM (a ficha do lance, o aviso de recusa), não recálculo.

## Achado próprio: a tabela "O QUE MUDOU" do aviso está errada sobre `Pendencias.md`

O aviso diz "L67 (nono/décimo) e L68 marcados resolvidos" em `Pendencias.md`. Não é o que o diff
mostra. `git diff 979ec38 107d1a3 -- Pendencias.md` tem só duas seções substantivas fora reaponte
de linha: o texto novo do `L65` (a sequência dos três passos) e os itens novos `L76`/`L77`. Não
existe "nono" nem "décimo" em `Pendencias.md` nenhuma (busquei no arquivo inteiro, zero
ocorrências), e a entrada do `L68` (linha 4437) é idêntica à descrição de ANTES da implementação:
"[LEVANTADO... PARADO esperando o humano]", "DECIDIDO em 10/09/2026: CONSTRÓI. Mas DEPOIS da voz,
e não agora... A ordem: entra depois da frente da voz. Registrado agora com a direção escrita, não
aberto." Nenhuma linha nova diz que foi construído. Comparando com o precedente do próprio `L71`
nesse mesmo arquivo, que ganhou uma correção inline quando ficou desatualizado ("A (a) JÁ FOI
CONSTRUÍDA, e este item passou um dia dizendo o contrário"), aqui não houve o equivalente. Quem
ler `Pendencias.md` sem ler o aviso desta rodada acha que o L68 continua parado esperando o humano.
CORRIGE, de documentação, não de código.

## A sequência nova do L65 (os três passos)

O Arquiteto pediu para eu dizer agora se a redação ainda está larga demais. Conferi: a sequência
(1. reaponta na árvore sem commitar, 2. Executora commita o código, 3. Arquiteto commita os
documentos) pressupõe que o CÓDIGO já esteja escrito em disco, só não commitado, antes do passo 1
— senão o reaponte não teria como calcular as posições novas. Isso é a ordem normal de trabalho
(quem escreve código escreve antes de alguém reapontar citações a ele) e não é uma generalização
além do que o achado sustenta. Também confirmei que "Executora é teammate dentro da sessão do
Arquiteto" (`PASSAGEM.md:23`), então os dois compartilham a mesma árvore de trabalho — a sequência
não depende de duas worktrees se falando, que era minha primeira suspeita antes de checar. Não
achei problema.

## Portões

`npm run validate`: `EXIT=0`. `test-l67-corpoacorpo-mesa.mjs` e `test-l68-foradavez-mesa.mjs`,
rodados por mim: `EXIT=0` nos dois. `node scripts/test-grid-simultaneo.mjs` (bateria inteira, sem
modificação): `EXIT=0`, 79 asserções passaram, batendo com o número da Executora.

## Travessão

Varredura própria sobre o diff de árvore inteiro da rodada (`979ec38 107d1a3`): zero linhas
adicionadas com `—`, em qualquer arquivo.

## BLOQUEIA

Nada bloqueia. Os dois itens do aviso (L68, L67 nono/décimo) estão provados como declarado, e a
regressão do gatilho foi falsificada por mim, não aceita de palavra.

## CORRIGE

1. `Pendencias.md`: a entrada do `L68` não reflete que o item foi construído nesta rodada — ainda
   diz "PARADO esperando o humano" e "DECIDIDO: CONSTRÓI... e não agora", sem nenhuma linha
   dizendo que já foi feito. E a entrada do `L67` não ganhou nenhuma menção ao nono/décimo lugar,
   apesar da tabela do aviso dizer que sim.

## VEREDITO

Os dois itens desta rodada (L68 e o nono/décimo lugar do L67) estão corretamente construídos e
provados ao vivo, com ceticismo aplicado nos dois pontos que o aviso pediu: nenhuma frase do
diálogo é escrita à mão (confirmado lendo o código, não só o comentário), e o gatilho novo
convive com `grupoDaVez` em vez de substituí-lo (confirmado comparando as duas funções linha a
linha). Falsifiquei eu mesma uma das três asserções protegidas do `test-grid-simultaneo.mjs`
(`reprojetarAgenda` forçado a `null`), e ela caiu sozinha, como deveria. A sequência nova do L65
não tem problema que eu tenha achado. Um achado próprio: a tabela do aviso afirma que
`Pendencias.md` marca o L67 (nono/décimo) e o L68 como resolvidos, e isso não é verdade — nenhuma
das duas entradas foi atualizada, e a do L68 ainda lê como item não construído. CORRIGE.
