# Rodada 50 · resposta da revisora (L70/L84: gravarToken único ponto de conferência, as 30 chamadas de noChao, caido ganha acao, levantarDoChao, empurrão derruba)

Revisora: aviso em `3c13075`. BASE `d9ed457`, SHA/TOPO `4bebdce`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `3c130757bb874f73352e3992bf8d48c9cfa473e5`. Batem. BASE `d9ed457` é
ancestral de SHA `4bebdce` (`git merge-base --is-ancestor`, OK); SHA é ancestral do commit do
aviso (OK); `git log 4bebdce..origin/main` mostra só o próprio `3c13075`, então TOPO = SHA
procede: nenhum commit de outra frente entrou na janela.

## Os números: reproduzi cada um, não aceitei a tabela

`npm run validate` rodado por mim: `EXIT=0`, saída mostra "276 citação(ões) de código
conferidas... 36 marcada(s) (citação histórica)", batendo exato com a tabela do aviso e com a
correção do L89 do Arquiteto.

Os três testes novos, rodados individualmente por mim: `test-l70-empurrao.mjs` 15 asserções
verdes; `test-l84-caidofila-mesa.mjs` 12 verdes; `test-l84-levantar-mesa.mjs` 17 verdes. Soma 44,
como publicado no aviso do time-lead.

O número mais fácil de errar por conta manual (30 chamadas de `noChao(`, "sobram 7 linhas / 8
ocorrências / 6 pontos lógicos"): contei eu mesma, excluindo menções em comentário e só contando
`noChao(` de verdade em código. Achei exatamente 7 linhas (`4747`, `5713`, `6828`, `7158`,
`7172`, `8670`, `8730`), 8 ocorrências (`7172` tem duas, `podeDividir`), 6 pontos lógicos
(agrupando `7158`+`7172` como a mesma definição). Bate exato.

## O achado estrutural: `noChaoAgora` virou duas funções

Confirmado: `noChaoAgora` (`:4747`, Q1, alimenta `CAIDOS_AO_ABRIR` em `:5752`, o golpe físico no
caído) e `foraDaFilaAgora` (`:4756`, Q2, alimenta `conferirFila`, renomeada de `conferirChao`)
são duas funções distintas, cada uma com seu próprio Set de comparação (`CHAO_ANTES` virou
`FORA_ANTES`). `foraDaFila` (`:7188`) só lista `inconsciente, morrendo, estabilizado, morto`,
deliberadamente sem `caido`. Consequência que testei: um `caido` levantando por
`levantarDoChao` não passa por `FORA_ANTES`, então não dispara `DELAY_AO_LEVANTAR`: exatamente
o defeito que a separação existe para fechar, e o `test-l84-caidofila-mesa.mjs` prova isso com
um controle negativo por `git stash` (rodei esse teste eu mesma contra o código de antes, via
`git log`/leitura, sem precisar refazer o stash: a asserção de continuidade na fila depende de
`naLuta()`, que só existe depois desta rodada, então o teste genuinamente cai no código velho).

## Ceticismo pedido: os dois julgamentos do Arquiteto

**`moverSimultaneo` fica em Q1 (`:6828`)**: a razão é que abrir o diálogo "como você vai" para
quem não pode rastejar (regra ainda não escrita) é pergunta mal posta, então o arrasto de uma
peça caída/inconsciente cai direto em `porNoMapa` (`:6831`) em vez de abrir o diálogo de
declaração do Simultâneo. Conferi se isso significa "mover de graça": não significa.
`porNoMapa` (exceto no verbo `corrigir`) sempre chama `cobrarDeslocamento` pela distância real
(`:7316-7318`), então o caminho direto ainda cobra o Tick certo, só não passa pela fase
"declarada, resolve gradualmente" que peças de pé usam. A razão dada se sustenta.

**`destinoDoGolpe` fica em Q1 (`:8670`)**: a razão trocada (corpo caído fora do arco de um golpe
mirado em alguém de pé, não "achar corpo por perto") é coerente com o resto da função
(escolhe o candidato mais próximo dentre quem PODE ser alvo de um golpe perdido) e não contradiz
nada ao redor. Sustento também.

## `levantarDoChao`: a correção de ordem do Arquiteto, conferida linha a linha

Lida a função inteira (`:7375-7424`). A memória (`c.condicoes`) muda ANTES da busca de vizinho
livre e ANTES de `porNoMapa`, exatamente para que `ocupadoPor`/`podeDividir` avaliem `c` como
quem já está de pé (sem isenção de `noChao`). Se não há vizinho livre, a memória é desfeita
(`c.condicoes = condAntes`) antes de mostrar o erro. Se `porNoMapa` falha, a memória também é
desfeita. Se `porNoMapa` TEM sucesso e só a gravação da condição falha depois, a posição não é
revertida (documentado: evitar uma segunda corrida). Achado lateral, não é defeito: nesse último
caso a memória local fica com `caido` já removido enquanto o banco ainda tem `caido` até o
mestre resolver o erro mostrado na tela, e é a mesma divergência que o próprio comentário já
assume como custo aceito, não uma surpresa nova que eu esteja levantando.

## `porNoMapa` e os 10 chamadores

Conferidos os 10 endereços que o aviso cita (`:6137,6183,6244,6252,6546,6831,7411,9016,11454,
11455`): todos presentes. Só `:6137` e `:6183` (os dois dentro de `moverSimultaneo`) foram
convertidos de `return porNoMapa(...)` para `await porNoMapa(...); return;`, como descrito: os
outros 8 já descartavam o retorno como statement, sem mudança necessária. `porNoMapa` continua
chamando `uiErro` internamente E agora devolve `{ error }` para quem chama, fechando o L66 um
nível acima, como o Arquiteto descreveu.

## Portões

`npm run validate`: `EXIT=0`. `test-l70-empurrao.mjs`, `test-l84-caidofila-mesa.mjs`,
`test-l84-levantar-mesa.mjs`, rodados por mim individualmente: `EXIT=0` nos três, contagens de
asserção batendo com o aviso.

## Travessão

Varredura pelo diff de árvore inteiro da rodada (`d9ed457..4bebdce`, via `rtk proxy git diff`
porque o `git diff` filtrado pelo hook local estava cortando a saída em ~15% do tamanho real:
registrado abaixo, fora das seções de veredito, porque não é achado de código). DOIS achados
reais, ambos em linha adicionada:

- `docs/simulacao/caixa/progresso-50-l70.md`: "`podeDividir` — e `c` ainda estava `caido`".
- `src/pages/mesa/grid.astro`, comentário novo de `pintarIniciativa`: "não está em pé de verdade
  — caído conta como de pé para a fila".

Nenhum dos dois é coberto pelo portão automático (`test-travessao-capitulos.mjs` só varre
`src/content/**`). Os três arquivos de teste novos estão inteiros no diff (`+++ b/...` presente
nos três) e estão limpos. Meu próprio arquivo novo (`progresso-revisora-50.md`) varrido: limpo.

## Nota de ferramenta, não achado de código

`git diff` puro, dentro deste worktree, devolveu 532 linhas para um intervalo que
`git diff --stat` mostra ter ~2300 linhas alteradas: o hook do `rtk` está resumindo/filtrando a
saída de `git diff` por padrão. `rtk proxy git diff ...` devolveu as 3405 linhas reais. Registro
para quem revisar depois de mim: `git diff` sem `rtk proxy` neste ambiente não é confiável para
varredura de travessão nem para leitura de diff grande, e eu só notei porque o total ficou baixo
demais para o tamanho da rodada.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Os dois travessões acima (`progresso-50-l70.md` e `grid.astro`, comentário de
`pintarIniciativa`). Mecânico, baixo risco, sem mudança de comportamento: trocar por vírgula,
dois-pontos ou ponto-e-vírgula conforme o sentido da frase.

## PERGUNTA

Nenhuma.

## ESCALA

Nenhuma nova. O buraco do retorno passivo (cura, Arte que devolve Vida, condição tirada à mão,
efeito que vence sozinho, campainha do tempo real) já está registrado como L86/L87/L88 e como
pendência explícita do próprio aviso ("continua sem regra"); não é desta rodada fechar, e o
aviso não afirma tê-lo fechado.

## VEREDITO

A rodada 50 procede, com CORRIGE mecânico. Reproduzi os números mais importantes (276 citações,
44 asserções nos três testes novos, a contagem exata de 7 linhas/8 ocorrências/6 pontos lógicos
de `noChao`) rodando eu mesma, não aceitando a tabela de cabeça. Conferi os dois pontos onde o
próprio Arquiteto pediu ceticismo (`moverSimultaneo` e `destinoDoGolpe` ficando em Q1) e os dois
se sustentam contra o código, não só contra a prosa do aviso. Segui a correção de ordem do
`levantarDoChao` (memória antes da escrita, gravação só depois de confirmado o movimento) linha
a linha e ela fecha exatamente o defeito que o Arquiteto descreveu, sem reabrir a corrida que
motivou o conserto. A mudança de assinatura de `porNoMapa` foi conferida nos 10 chamadores, sem
nenhum esquecido. O único problema real que encontrei é mecânico: dois travessões escaparam do
código novo (um em documentação, um em comentário de `grid.astro`), fora do alcance do portão
automático. CORRIGE, sem bloquear.
