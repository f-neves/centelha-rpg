# Rodada 57 · resposta da revisora (L64: `velocidade` separa sentinela de grandeza)

Revisora: aviso em `5f30fea`. BASE `b82ae80`, SHA/TOPO `972d11b`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `5f30fea795862e40a4c4979661c4576c6bcb6457`. Batem. BASE ancestral de SHA,
`git log 972d11b..origin/main` só mostra o próprio `5f30fea`: TOPO = SHA procede.
`git log b82ae80..972d11b` tem cinco commits: `3eeb8fd` (CORRIGE da rodada 56, já avisado por
mensagem, agora formalmente dentro da janela, reconferido abaixo), `9e28abe`/`bfcc519`/`6d8935f`
(Arquiteto, só documento, §8 novo do contrato), `972d11b` (L64 desta rodada).

## Os números

`npm run validate`: `EXIT=0`, 287 citações, bate. `test-l64-velocidade.mjs`: contei manualmente
23 chamadas de `ok`/`eq` no código-fonte (incluindo o laço que roda ×3), bate exato com o aviso;
`EXIT=0`. `test-artes-grid.mjs`: verde. `test-l86b-acelerar-cura.mjs`: 27/27.

## Reconferência do CORRIGE 3eeb8fd (rodada 56)

Lido `gravarEfeito` (`artes-grid-mesa.ts:1494-1529`): a variável `enviada` começa em `linha`,
passa a `semNivelArte` no ponto em que o insert degrada, e o `ATIVOS.push` final usa
`(data || [])[0] || enviada`, não mais `|| linha`. Falsifiquei por conta própria: troquei
`enviada` por `linha` na linha do `push` e rodei `test-l86b-acelerar-cura.mjs` - quebrou com uma
exceção não tratada ("uiEscolher chamado sem resposta preparada"), a mesma forma que o progresso
da rodada 56b já descrevia (o `nivel_arte` ressuscitado abre uma caixa de cura que a cena não
preparou para abrir). Desfeito na hora, `git diff --stat` confirmado limpo, 27/27 de novo. O
CORRIGE está correto e a regressão continua pega pelo teste.

## Ponto 1: o campo removido e o risco de NaN silencioso

`Grep` por `.velocidade\b` em todo `src/`: a grande maioria das ocorrências é velocidade de ARMA
(`RESUMO[...]?.velocidade`, `ra?.velocidade`, `FX.velocidade`), um conceito diferente que usa o
mesmo nome de campo, confirmado pelo contexto de cada uma (combate-tempo.ts, mesa-tempo-ui.ts,
artes-grid-ui.ts, mesa-bestiario.ts, grid.astro). Os únicos leitores de `Condicao.velocidade` são
quatro: `somarCondicoes` (`mesa-core.ts:192`, `c.velocidade || 0`, guardado), `condChipHTML`
(`:225`, truthy-check, sem aritmética), `modEfeito` (`referencia.astro:75`, truthy-check) e
`avancarTick` (`combate.astro:1411`, `cd.velocidade || 0`, duplamente guardado pela marca
`naoAge` antes dele). `Grep` por "-99" em `src/`: zero ocorrências em código vivo, só em
comentários que explicam a história. Nenhum caminho faz aritmética sem guarda com o campo
removido; nenhum código ainda compara contra a sentinela antiga.

## Ponto 2: a varredura dos leitores de tela

Conferido `scripts/mesa-mock.mjs`: toda ocorrência de "velocidade" ali é velocidade de arma
(`classe: 'haste'/'leve'/'media'`), zero leitura de `naoAge` ou de condição. `ficha-engine.ts`:
zero ocorrência de `condChipHTML`, `modEfeito` ou `naoAge`. Achei, sim, mais chamadores de
`condChipHTML` do que os dois que o levantamento nomeou (`mesa.astro:360`, `combate.astro:1128`):
`mesa-condicoes.ts:78,93` também chama. Isso não é um terceiro leitor perdido pela varredura: é
o MESMO leitor (`condChipHTML`, já com prova real, não textual) com mais um ponto de chamada, e
como `mesa-condicoes.ts` é o diálogo de condições compartilhado que o próprio Grid importa, o
diálogo de condições do Grid já mostra "não age" corretamente hoje, sem precisar de nenhuma linha
nova, porque herda o conserto de graça pela mesma função testada. A varredura não parou cedo; o
levantamento só não citou TODOS os chamadores de uma função que já estava coberta.

## Ponto 3: as duas conferências fracas, lidas de verdade

`modEfeito` (`referencia.astro:62-80`), lido inteiro: `if (c.naoAge) p.push('não age'); else if
(c.velocidade) p.push(...)`, na ordem certa (a marca primeiro), batendo exatamente com o que o
regex do teste cobra. `avancarTick` (`combate.astro:1399-1419`), lido inteiro: `cd =
somarCondicoes(condsDe(c))` na linha 1403, e `const novo = cd.naoAge ? antes : Math.max(0, antes
+ Math.max(0, quanto + (cd.velocidade || 0)));` na 1411, idêntico ao texto que a asserção
procura. As duas telas fazem exatamente o que a conferência fraca afirma; não são comentários
sobrevivendo à remoção do código.

## Ponto 4: o teto6 à mão

Inseri `t.velocidade = Math.max(-6, Math.min(6, t.velocidade));` no fim do laço de
`somarCondicoes`, antes do `return`. Rodei `test-l64-velocidade.mjs`: 1 falha, exatamente a
asserção do teto6 (esperado 10, achou 6); as outras 22 (incluindo as de `naoAge`) continuaram
verdes, confirmando que o clamp ingênuo só corta grandeza, nunca a marca. Desfiz a régua na hora
(§2 do contrato), `git diff --stat` confirmado limpo, rodei de novo: 0 falhas.

## D03: as citações marcadas `(citação histórica)`

Lidas em `Pendencias.md` (as duas âncoras citadas duas vezes cada, próximo às linhas 3924 e
3951): o texto antigo que elas citam (`const novo = Math.max`, `foraDoTempo.velocidade <= -50`)
genuinamente não existe mais no código corrente, e a gramática ao redor foi ajustada para passado
("era", "afirmava"). A marca está correta aqui: ao contrário do meu próprio achado na rodada 56
(onde `(citação histórica)` teria sido a escolha errada, porque o fato citado continuava vivo),
aqui o fato descrito genuinamente é passado, não presente.

## Portões

`npm run validate`: `EXIT=0`. `test-l64-velocidade.mjs`, `test-artes-grid.mjs` e
`test-l86b-acelerar-cura.mjs`, rodados por mim: `EXIT=0` nos três. `npx tsc --noEmit`: limpo
(conferido antes de qualquer falsificação e depois de cada reversão).

## Travessão

Varredura pelo diff inteiro (`b82ae80..972d11b`, via `rtk proxy git diff`, 1164 linhas, batendo
com o `--stat` de 660+88): zero linhas adicionadas com o caractere de travessão. Meu próprio
arquivo novo (`progresso-revisora-57.md`) varrido: limpo.

## BLOQUEIA

Nada bloqueia.

## CORRIGE

Nada no código.

## PERGUNTA

Nenhuma.

## ESCALA

Nenhuma nova.

## VEREDITO

A rodada 57 procede sem ressalva, nada bloqueia. Reconferi o CORRIGE da rodada 56 (`3eeb8fd`)
por conta própria e ele está correto, com a regressão falsificada e confirmada pega pelo teste.
Nos quatro pontos pedidos: não há aritmética sem guarda com o campo `velocidade` removido em
lugar nenhum de `src/`; a varredura dos leitores de tela não ficou curta, e o chamador extra que
achei (`mesa-condicoes.ts`) já herda o conserto por usar a mesma função testada; as duas
conferências fracas descrevem código real, lido por mim linha a linha, não comentário morto; e o
teto6 ingênuo, posto à mão e desfeito na hora, fica vermelho exatamente como a rodada promete.
D03 (citação histórica) está bem aplicada, ao contrário do caso oposto que eu tinha achado na
rodada 56.
