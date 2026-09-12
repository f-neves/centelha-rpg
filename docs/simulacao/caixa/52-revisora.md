# Rodada 52 · resposta da revisora (L88: o detector de ocupação)

Revisora: aviso em `5c5cf81`. BASE `71a0228`, SHA/TOPO `7b41008`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `5c5cf81867a06a81ed3b57a285ad5a3d6ee53172`. Batem. BASE ancestral de SHA,
SHA ancestral do commit do aviso. `git log 7b41008..origin/main` mostra o próprio `5c5cf81` e
mais um commit do Arquiteto (`4e296bf`, L93), chegado DEPOIS do aviso: não invalida o recorte,
só vai exigir rebase no push.

## Os números

`npm run validate`, rodado por mim: `EXIT=0`, "281 citação(ões)... 39 marcada(s) (citação
histórica)", exato com o aviso. `test-l88-ocupacao-detector-mesa.mjs`: 8 asserções verdes.

## Ponto 1: o detector não nasce verde sobre nada

Não aceitei o `git stash` da Executora de segunda mão. Troquei `src/pages/mesa/grid.astro` pela
versão de `71a0228` (a árvore de ANTES desta rodada), mantendo o teste novo por cima, e rodei
`test-l88-ocupacao-detector-mesa.mjs` contra essa mistura. Resultado: das 8 asserções,
exatamente as 3 do caso positivo (o grito depois de curar `pa`) falham; as outras 5, incluindo
o controle negativo do "caso que treme" (o instante otimista do L70 não deve gritar), continuam
passando. O teste discrimina de verdade entre o código de antes e o de agora, não é um "✓ sobre
0 documentos" disfarçado. Restaurei o arquivo imediatamente e confirmei verde nos dois lados de
novo.

## Ponto 2: `pintarIniciativa` × `pintarTokens`, e o que isso NÃO cobre

O argumento do D01 procede: `conferirOcupacao` mora em `pintarIniciativa` (`grid.astro:4956
-4960`), `curar` não chama `pintarTokens`, e o cenário do teste prova isso para o caminho da
cura. Fui além do caso testado, porque a mesma pergunta vale para OUTRO caminho passivo que a
rodada 51 já tinha exposto como incompleto: a condição tirada à mão pelo mestre. Escrevi um
teste ao vivo, ad hoc, nunca commitado (`_teste-live-l88-revisora.mjs`, apagado ao final, `git
status` limpo conferido): dei "Caído" a `pa` pela caixa de condições (mantendo-a no chão mesmo
depois de curada, para isolar a variável), curei a Vida dela (0 gritos, correto, ainda tem
Caído) e REMOVI "Caído" pela mesma caixa, o único motivo que restava para `pa` estar no chão.
Isso torna o par genuinamente ilegal. Resultado: **0 gritos imediatamente depois da remoção**;
só depois de uma repintura de iniciativa NÃO relacionada (curar outra peça em 1 PV) o detector
gritou, uma vez. `abrirCondicoes` (`:11188-11197`) passa `repintar: () => { pintarLista(); }`
para o diálogo, sem `pintarIniciativa`, exatamente o gap que a rodada 51 já tinha documentado
para outro motivo (o L87). O comentário de `conferirOcupacao` diz "Todos terminam em
`pintarIniciativa()`", e este é um caminho que não termina: fica invisível na tela de quem fez a
ação até QUALQUER outra coisa repintar a iniciativa depois. Em uma mesa de um jogador só, ou
numa sessão onde ninguém mais aciona nada por um tempo, a sobreposição fica sem alarme por
tempo indeterminado.

## Ponto 3: `POSICAO_PENDENTE` posta e retirada em todos os caminhos

Lida `porNoMapa` inteira (`:7384-7437`). Um único `.add(cid)` (`:7403`) e um único
`.delete(cid)` (`:7406`), com o `delete` rodando logo depois do `await gravarToken`, ANTES do
`if (error)`: cobre os dois ramos (recusa e sucesso) da mesma forma. O retorno antecipado de
"largou onde já estava" (`:7393`) acontece ANTES do `.add`, então não precisa de `.delete`.
Risco residual, não introduzido por esta rodada: se `gravarToken` REJEITASSE (lançasse) em vez
de resolver com `{ error }`, o `.delete` nunca rodaria e a marca ficaria presa para sempre. Essa
é a mesma suposição que todo outro `await SB...` do arquivo inteiro já faz (nenhum tem
`try/catch`); não é uma fragilidade nova desta escrita, é a fragilidade de sempre, agora com uma
consequência um pouco mais visível (silêncio permanente de uma peça, em vez de uma tela que só
não atualiza).

## Ponto 4: a leitura do Arquiteto sobre `avancarTickSimultaneo` (L93)

Lido o bloco inteiro (`:5897-5929`). As três alegações procedem, conferidas linha a linha:
`TOKENS[c.id] = { q: novo.q, r: novo.r, em }` grava otimista (`:5923`); `await
gravarToken(c.id, novo.q, novo.r, em);` (`:5924`) descarta o retorno por completo (sem `const {
error } =`); e a chamada a `logar` logo depois (`:5925-5928`) escreve "avança"/"atravessa"
incondicionalmente, sem checar se a gravação passou. Não marca `POSICAO_PENDENTE` (confirmado no
ponto 3: só `porNoMapa` toca aquele Set). A leitura do Arquiteto está certa nos três pontos, e
bate com o commit `4e296bf` (L93) que já está no TOPO. Concordo que é pré-existente e não
bloqueia esta rodada: o item pedia o detector, não a auditoria de todo escritor de posição, e o
próprio aviso já registra a porta aberta (embora sem nomear o terceiro efeito, o registro que
mente, que é o achado do Arquiteto por cima do dela).

## Portões

`npm run validate`: `EXIT=0`. `test-l88-ocupacao-detector-mesa.mjs`, rodado por mim: `EXIT=0`
antes e depois do teste de falsificação, 8 asserções batendo com o aviso.

## Travessão

Varredura pelo diff inteiro da rodada (`71a0228..7b41008`, via `rtk proxy git diff`, 1168
linhas, batendo com o `--stat` de 544+79): zero linhas adicionadas com o caractere de travessão.
Meu próprio arquivo novo (`progresso-revisora-52.md`) varrido: limpo.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada nesta rodada.

## PERGUNTA

Nenhuma.

## ESCALA

O achado do ponto 2 (a condição tirada à mão continua invisível ao detector na tela de quem fez
a ação, mesmo depois do L88) não é regressão desta rodada nem motivo para travar o detector: é
uma lacuna de COBERTURA que nasce da mesma causa que a rodada 51 já tinha registrado
(`abrirCondicoes` sem `pintarIniciativa`). Fica registrado para quem decidir se vale uma correção
pontual (`pintarIniciativa` no `repintar` de `abrirCondicoes`) ou se o L88 precisa de um segundo
lar além de `pintarIniciativa`, decisão do Arquiteto/humano, não da Revisora.

## VEREDITO

A rodada 52 procede sem bloqueio. Falsifiquei eu mesma o controle positivo do teste novo contra
o código de antes (3 de 8 asserções caem, as certas, o resto se mantém): o detector não é um
portão que nasce verde por acaso. Confirmei a escolha `pintarIniciativa` sobre `pintarTokens`
(D01) e, testando ao vivo um segundo caminho passivo (condição tirada à mão), achei que a mesma
lacuna de cobertura que o D01 evita para `curar` continua aberta para `abrirCondicoes`: registro
como ESCALA, não CORRIGE, porque é uma lacuna pré-existente (da rodada 51) e o item desta rodada
não prometia fechá-la. `POSICAO_PENDENTE` é posta e retirada simetricamente no único par de
chamadas que existe, cobrindo os dois ramos de saída de `porNoMapa`, com o mesmo risco residual
(exceção não tratada) que todo o resto do arquivo já carrega. A leitura do Arquiteto sobre
`avancarTickSimultaneo` (L93: sem marca, ignora o erro, registra o movimento como acontecido)
procede nos três pontos, conferida linha a linha contra o código, e é pré-existente, não
bloqueando esta rodada.
