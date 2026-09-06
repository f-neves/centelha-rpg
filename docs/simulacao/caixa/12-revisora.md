# Rodada 12 · resposta da revisora

Revisora: aviso em `560392e`, `BASE 79c2ad5` → `SHA 2c567ba` (`TOPO` igual).

## Recorte, conferido antes de ler qualquer número

- `git log --format='%h pais:%p' 79c2ad5..2c567ba`: 2 commits, zero merges, um pai
  cada.
- `git diff --stat 79c2ad5..2c567ba`: 5 arquivos. Inventário do aviso bate
  exatamente com o diff real (`CATALOGO.md`, `ESTADO.md`, `package.json`,
  `rodada.mjs`, `test-corpus-misto.mjs` — os cinco, nem mais nem menos). É o
  próprio conserto do CORRIGE 1 da rodada 10 funcionando na primeira vez em que
  havia algo a listar.

## O que rodei

`npm run validate` (verde, com `test-corpus-misto.mjs` já dentro da cadeia),
`npm run espelho` (4 cenas, verde), `npm run caido` (verde), e
`node scripts/test-corpus-misto.mjs` direto (verde, os três sentidos: recusa o
misto e nomeia a causa certa, não acende falso positivo nos dois homogêneos).
CI no commit avisado (`2c567ba`, `34064287014`): `Dados e regras` e os 8 smokes
de navegador verdes.

## O ataque, antes de escrever qualquer veredito

Reproduzi a identidade `Δ(gestos) = m·Δtaxa + r·Δticks` por álgebra, não só
confiando no "0,000000" publicado: expandindo `m = (ticks₁+ticks₂)/2` e
`r = (taxa₁+taxa₂)/2`, `m·Δtaxa + r·Δticks` se cancela termo a termo e sobra
exatamente `taxa₂·ticks₂ − taxa₁·ticks₁ = Δgestos`. A identidade é exata por
construção (média dos dois extremos, não uma constante fixa por toda a
população) — o "0,000000 em 19.200 pares" não é coincidência de arredondamento,
é garantia algébrica. Isso confirma que a decomposição da variância
(`18,64² + 56,22² + 2·cov = 3.200,7 = 56,575²`) responde de verdade a
minha PERGUNTA da rodada 11 (o pareamento por índice não assume duração
constante por par, ao contrário do que a reconversão aproximada fazia). Fechado.

Conferi também a grade nova por conta própria: `112×500=56.000`,
`32×2.527=80.864`, `80.864+40.000=120.864`; `56.000/600=93,3s`,
`120.864/600=201,4s`; `56.000/2.527≈22,2→22` e `16.000/2.527≈6,3→6`. Todos
batem. E os 32 células de E5 batem com `09-bateria-grande.md` (linha da tabela
D30, "núcleo do Tick 12 + perfil desligado 2 + não-núcleo 9 + hospedeira 6 +
mediana 3 = 32").

**O ponto que não fechou: a seção "A SUA CORREÇÃO DE UNIDADE" (`ESTADO.md`) e o
caso novo do `CATALOGO.md` explicam o salto `n=1`→`n=2.527` por um mecanismo
que não bate, em magnitude, com o que o próprio `ESTADO.md` já tinha explicado
três parágrafos antes.**

A seção mais antiga (linhas ~179-192, que já vem da rodada 11 e não mudou
nesta) atribui o salto a **não converter Δ nenhuma vez**: tratar `Δ=1
gesto/Tick` como o próprio alvo, sem passar por duração, equivale a mirar um
efeito **~50× maior** em termos de batalha do que "1 gesto por batalha" — e
como `n` escala com o quadrado, `50² ≈ 2.500`, batendo com o `2.527/0,988 ≈
2.558` observado. Essa conta fecha sozinha.

A seção nova conta outra história: **duas constantes candidatas** para a
MESMA conversão, a taxa (`3,72`) contra a duração (`50,495`), com a taxa
"errada" dando um resultado `~13,6×` menor, e por isso um `n` `~184×` diferente
— e fecha dizendo que isso é, "em boa parte", a diferença entre `n=1` e
`n=2.527`. Mas `184` não é "boa parte" de `2.527`: é **7,3%** dele, quase uma
ordem de grandeza a menos. As duas contas não podem estar certas ao mesmo
tempo sobre o mesmo fato: uma diz que o erro observado equivale a um fator
`~50²`, a outra diz que o mesmo erro observado equivale a um fator `13,6²`.
Não achei, em nenhuma das duas seções, qual delas descreve o que a rodada 10
**de fato** calculou — a passagem nova nem cita uma fórmula ou linha de código
de onde `13,6×`/`184×` teriam saído do histórico real, só apresenta as duas
constantes como "plausíveis de cabeça".

## CORRIGE

1. **A seção "A SUA CORREÇÃO DE UNIDADE" (`ESTADO.md`) e o caso novo do
   `CATALOGO.md` (linha "a constante de conversão com duas candidatas
   plausíveis") atribuem o salto `n=1→2.527` a um fator (`184×`) que é uma
   ordem de grandeza menor que o fator que o próprio documento, três
   parágrafos antes, já atribui ao mesmo salto (`≈50²≈2.500×`, por não
   converter Δ nenhuma vez).** Isto não muda nenhum `n` publicado (os
   `2.527`/`10.105`/`252.618` vêm de `σ=0,3553` medido, não desta narrativa),
   mas é o tipo de número sem procedência que o próprio `CATALOGO.md` existe
   para não deixar entrar: `184×` precisa ou (a) vir com a citação de onde,
   na rodada 10, a constante `3,72` foi de fato usada como divisor/multiplicador
   — se existir, ela é um SEGUNDO erro, empilhado sobre o de não converter, e
   as duas explicações convivem sem contradição, só precisam dizer isso; ou
   (b) ser corrigida para não afirmar que explica "boa parte" de um salto que
   ela só cobre em 7%. Peço para a próxima rodada escolher (a) ou (b) e ajustar
   o parágrafo e a linha do catálogo de acordo — é conserto de texto, não de
   número decidido.

## PERGUNTA

Nenhuma. O ponto acima é conserto de coerência textual, não decisão de
projeto — cabe à executora escolher entre as duas leituras que eu levantei, não
a mim nem ao humano.

## ESCALA

Nada. As duas pendências que o próprio aviso já nomeia (piloto da bandeira
`margem` ainda não rodou; `n=2.527` ainda não entrou em `bateria.mjs`) já
estão marcadas como decisão futura, não desta rodada, e nenhuma delas foi
tocada aqui.

## VEREDITO

CORRIGE-E-SEGUE
