# Rodada 46 · resposta da revisora (35 marcas históricas, 4 consertos de âncora, o portão ampliado para 12 documentos)

Revisora: aviso em `9c3c529`. BASE `2080bf9`, SHA/TOPO `8949d3f`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `9c3c5297100a484608286a23d8eaa6d4cc912e0f`. Batem. Conferi o TOPO por
conta própria: `git log 8949d3f..origin/main` só mostra o próprio commit do aviso.

## O ponto de ataque: a marca cala para sempre, então "provavelmente é histórico" não basta

Testei a linha de maior risco de território que encontrei (`REVISORA.md:290`, duas
citações aparentes na mesma linha, `:1336-1340` e `:1344-1348`). Descobri, lendo o regex do
portão, que `:1344-1348` sozinha (sem nome de arquivo antes) NÃO é reconhecida como citação
(`CITACAO` exige `arquivo.ext:` antes do número): não existe uma segunda citação viva sendo
silenciada ali, existe só uma, e ela está marcada corretamente. Achado de leitura, não pedido:
as referências `:NNNN` soltas usadas em toda a documentação como atalho de "mesma linha de
cima" nunca são conferidas por instrumento nenhum, sempre foram assim, não é defeito desta
rodada, é um limite pré-existente do próprio formato de citação.

Não achei nenhuma marca fora do território da citação a que pertence, nem linha com duas
citações reais recebendo uma marca só. As 35 do `REVISORA.md` correspondem à declaração do
próprio cabeçalho do arquivo ("registro histórico"), e a amostra que conferi bate.

## Os 4 consertos de âncora (terceira categoria: endereço certo, afirmação errada)

Verifiquei os quatro contra o código real, não só contra a janela: `null = improviso` bate
exatamente em `artes-grid-ui.ts:182`; `interface Efeito` bate na janela de `artes-grid.ts:23-33`
(o corpo da interface corresponde à descrição da tabela: catálogo, `nivel` fixo, `parametros`,
`grid`); `interface Parametro` bate na janela de `:35-45`; `auth.signUp` bate exatamente em
`auth.ts:54`, e a prosa ("confirmação de cadastro") corresponde ao código real (`.auth.signUp`
dentro de `cadastrar`, que só é chamada no fluxo de cadastro). Os quatro sustentam a afirmação
que os rodeia, não só aparecem dentro da janela.

## O controle vermelho-antes/verde-depois, reproduzido por mim

Não aceitei o `stash` da Executora como prova suficiente; reproduzi com um mecanismo diferente.
`git checkout <BASE> -- <os dez documentos>` (voltando ao estado de antes desta rodada), rodei
`node scripts/test-procedencia.mjs` sem pipe (para pegar o código de saída real): `EXIT=1`, a
lista de envelhecidas apareceu de verdade. `git checkout HEAD -- <os dez>` para restaurar, rodei
de novo: `EXIT=0`, 254 conferidas, 36 marcadas, batendo exato com o aviso. Árvore limpa depois
(só o meu progresso não rastreado). O portão não passou verde cedo demais.

## O `reapontar.mjs --check`: causa da forma exata, não da família inteira

O conserto lê o BLOCO INTEIRO da atribuição de `ALVOS` por regex (não mais só a primeira linha),
com controle negativo (tirar um documento do `DOCS` local e exigir vermelho, que passou). É
conserto de causa para a forma exata do defeito que apareceu (array multi-linha). Mas continua
sendo uma raspagem de TEXTO da fonte, não uma leitura do valor real de `ALVOS` em tempo de
execução: se um dia `ALVOS` passar a ser montado por `spread` de outra lista ou por importação
de outro módulo, o regex capturaria só os literais escritos ali dentro, diria "cobertura
completa" por engano, e o portão de verdade conferiria mais documentos do que este script sabe.
Não é o mesmo sintoma se repetindo, é a mesma família de risco por outro caminho. Registro como
sugestão de hardening, não CORRIGE: não aconteceu, e o conserto de verdade (importar o valor
real em vez de raspar texto) é mudança maior do que esta rodada pediu.

## Portões

`npm run validate`: `EXIT=0`. `node scripts/test-procedencia.mjs` direto: 254/36, batendo.

## Travessão

Zero linhas adicionadas com o caractere de travessão no diff de árvore da rodada (`2080bf9
9c3c529`), e zero nos meus dois arquivos novos, conferido antes de commitar.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada.

## ESCALA

O `reapontar.mjs --check` continua sendo uma raspagem de texto do `ALVOS`, não uma leitura do
valor real; funciona hoje, mas a mesma família de risco pode voltar se a forma da declaração
mudar de novo (spread, importação). Sugestão de hardening para quando alguém tiver tempo, não
decisão de regra nem correção urgente.

## VEREDITO

As 35 marcas históricas do `REVISORA.md` estão corretamente escopadas por território, sem
nenhuma citação viva silenciada por engano (verificado na linha de maior risco que encontrei,
e o achado ali foi sobre um limite pré-existente do formato de citação, não um erro desta
rodada). Os 4 consertos de âncora da terceira categoria sustentam de verdade a afirmação que
descrevem, não só aparecem na janela. O controle vermelho-antes/verde-depois foi reproduzido
por mim com um mecanismo próprio, e o portão realmente estava vermelho antes e verde depois,
sem atalho. O conserto do `reapontar.mjs --check` resolve a forma exata do defeito que apareceu,
com uma lacuna residual registrada como sugestão, não como falha. Nada bloqueia, nada corrige
no código.
