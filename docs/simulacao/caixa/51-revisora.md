# Rodada 51 · resposta da revisora (L87: gravarPeca vira o ponto único que grava e avisa)

Revisora: aviso em `ee937b5`. BASE `529e21c`, SHA/TOPO `c91c89c`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `ee937b5271d038f38f4090af1f8576894a556816`. Batem. BASE ancestral de SHA,
SHA ancestral do commit do aviso, `git log c91c89c..origin/main` só mostra o próprio `ee937b5`:
TOPO = SHA procede, nada de outra frente entrou na janela.

## Os números

`npm run validate`, rodado por mim: `EXIT=0`, "279 citação(ões)... 39 marcada(s) (citação
histórica)", exato com a tabela do aviso. `test-arte-na-mesa.mjs`: 33 asserções verdes.
`test-l70-empurrao.mjs`: 15 verdes, sem regressão do L84 por esta mudança.

## O ceticismo pedido: os 7 chamadores que perderam `avisarAgora`

Lidos os sete contra o código de hoje, não contra a tabela do aviso: `levantarDoChao` (dois
pontos, `grid.astro:7422`/`7442`), `curar` (`:11123`), `gastarMana` (`:11270`), `devolverVida`
(`:11474`), e o `repintar` de `abrirCondicoes` (`:11107`). Em todos os sete, a única coisa que
saiu foi o `avisarAgora('combatentes')` que a escrita por `gravarPeca` tornou redundante; nenhum
tocava por um segundo motivo. Nenhum tinha um assunto diferente (`'tokens'`/`'efeitos'`) colado
na mesma chamada, nenhum tinha uma segunda escrita que dependesse daquele aviso específico, e
nenhum caminho de erro ficou mudo (os `if (error) return` de cada um continuam próprios e
intactos, sem relação com o aviso removido).

Os dois que ficaram (`aplicarDano`/`tirarVida`, `grid.astro:11073`/`11160`, e `ajustarMana`,
`:11206`) conferidos contra o comentário que cada um ganhou: a razão bate com o código.
`baixarVida` (`:11021-11041`) usa `gravarPeca` no ramo MESTRE e `SB.rpc('jogador_dano', ...)`
direto no ramo JOGADOR; o `avisarAgora` que ficou em `aplicarDano`/`tirarVida` é a ÚNICA
campainha do ramo jogador, e uma dobra silenciosa no ramo mestre, exatamente como o comentário
admite. `ajustarMana` (`:11190-11207`) escreve `mana_max`+`mana_atual` juntos direto em `SB` no
ramo mestre e por `gravarPeca` no ramo jogador; o `avisarAgora` que ficou é a única campainha do
ramo mestre e uma dobra no ramo jogador. As duas dobras são divulgadas no próprio código, não
escondidas, e são inofensivas (`avisarAgora` = `RT.avisar(...) + marcarEstado()`, chamar duas
vezes seguidas não distorce o que chega do outro lado).

## `gravarCondicao`: fecha os dois buracos que motivaram a rodada

Conferido nas duas pontas: `CtxGrid.gravarCondicao` (`artes-grid-mesa.ts:104`, campo obrigatório)
e `ctxArtes()` (`grid.astro:2807`, `(cid, condicoes) => gravarPeca(cid, { condicoes })`).
`porCondicao`, `tirarCondicao` e `varrerCondicoesVencidas` (`artes-grid-mesa.ts:1474/1484/1868`)
chamam `ctx.gravarCondicao` agora, não mais `ctx.SB` direto. Isso fecha de verdade o buraco do
`varrerCondicoesVencidas` que eu tinha achado numa investigação fora de rodada (o `if
(!ATIVOS.length) return` que fazia a condição vencida por prazo nunca avisar a mesa quando não
havia Arte ativa no tabuleiro): agora o aviso sai na escrita, sem depender de mais nada
acontecer depois. `marcarInvestida` (`:6335`) também chama `gravarPeca`, fechando o buraco do
`declararAtaqueSimultaneo` que a própria Executora achou lendo os 9 chamadores um a um.

## Achado incidental, fora do pedido e fora desta rodada

Lendo ao redor de `curar`/`devolverVida`, achei `alternarAuto` (`grid.astro:6098`) e
`devolverAuto` (`:11486`) escrevendo `combatentes.dados` direto por `SB.from(...).update(...)`,
sem chamar `avisarAgora` nunca, nem antes nem depois desta rodada. Os dois nunca passaram por
`gravarPeca`, então nunca estiveram no conjunto dos 9 chamadores auditados. É simétrico (o gesto
de ida e o desfazer compartilham o mesmo silêncio, não é um lado avisando e o outro não), então
não é regressão desta rodada nem um buraco novo: é um TERCEIRO exemplo de "o estrangulamento não
é único", ao lado dos dois que o aviso já divulga. Gravidade baixa (o campo `auto` é cosmético:
o pior efeito é um selo de "modo automático" desatualizado numa tela até a próxima repintura
completa, não ocupação nem Vida errada). Não levanto como CORRIGE porque está fora do escopo
declarado desta rodada e o próprio aviso já registra que o estrangulamento não é único; registro
para constar, e para quem decidir se os pontos remanescentes (agora três, não dois) valem uma
rodada própria.

## Portões

`npm run validate`: `EXIT=0`. `test-arte-na-mesa.mjs` e `test-l70-empurrao.mjs`, rodados por
mim: `EXIT=0` nos dois, contagens batendo com o aviso.

## Travessão

Varredura pelo diff inteiro da rodada (`529e21c..c91c89c`, via `rtk proxy git diff`, 1576
linhas, batendo com o `--stat` de 515+141): zero linhas adicionadas com o caractere de
travessão. Meu próprio arquivo novo (`progresso-revisora-51.md`) varrido: limpo.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada.

## PERGUNTA

Nenhuma.

## ESCALA

O achado incidental acima (`alternarAuto`/`devolverAuto`, terceiro caminho silencioso além dos
dois já divulgados) não muda o veredito desta rodada, mas é informação nova para a decisão já
registrada em aberto ("o estrangulamento não é único, decidir se vale fechar os dois também, ou
se ficam como exceção registrada"): agora são três, não dois, e os três têm o mesmo formato (um
campo que precisa de mais do que um `.update()` cru, ou que ninguém pensou em avisar). Decisão
do Arquiteto/humano, não da Revisora.

## VEREDITO

A rodada 51 procede sem ressalva no código revisado. Reproduzi os números que sustentam a
conclusão (279 citações, 33 e 15 asserções nos dois testes tocados) rodando eu mesma. Apliquei o
ceticismo pedido nos sete chamadores que perderam `avisarAgora`: nenhum tinha um segundo motivo
escondido atrás da chamada removida, e os dois que ficaram com aviso explícito têm a razão que o
comentário declara, incluindo a dobra harmless que os dois mesmos admitem. `gravarCondicao`
fecha, de verdade e não só na intenção, os dois buracos que motivaram a rodada
(`varrerCondicoesVencidas` e `declararAtaqueSimultaneo`), conferido nas duas pontas do contrato
(`CtxGrid` e `ctxArtes()`) e nos três chamadores do lado das Artes. O achado incidental
(`alternarAuto`/`devolverAuto`) é pré-existente, simétrico, de baixa gravidade e fora do escopo
declarado: registro como ESCALA para a decisão já em aberto, não como CORRIGE desta rodada. Nada
bloqueia.
