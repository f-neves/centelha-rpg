# Rodada 51 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  529e21c9a8193cefac77dcb0b4b8dfb122171fde
SHA   c91c89c8c3a5c9d455caa3980afacb9120321383
TOPO  c91c89c8c3a5c9d455caa3980afacb9120321383
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada (`docs/simulacao/caixa/progresso-51-l87.md`); aqui é só o
inventário. Um eixo só, um commit: `454a1d8`.

| arquivo | o que mudou nele |
|---|---|
| `src/pages/mesa/grid.astro` | `gravarPeca` vira `async` de verdade e toca `avisarAgora('combatentes')` no sucesso; `gravarCondicao` nova em `ctxArtes()`; 7 chamadores perderam a chamada explícita que só existia por causa desta escrita, 2 ficaram (com o motivo escrito); `as any` removido de `abrirCondicoes` |
| `src/lib/artes-grid-mesa.ts` | `CtxGrid` ganha `gravarCondicao` (campo obrigatório); `porCondicao`/`tirarCondicao`/`varrerCondicoesVencidas` passam a chamar `ctx.gravarCondicao` em vez de `ctx.SB` direto |
| `scripts/test-arte-na-mesa.mjs` | o `ctx` de mentira ganha `gravarCondicao` (faltava, e quebrava em runtime) |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 9 | chamadores de `gravarPeca`, lidos um a um do começo ao fim de cada função (a leitura foi feita antes de qualquer código; os números aqui são do commit já feito) | `grid.astro:6335,7422,7442,11026,11107,11123,11202,11270,11474` (leitura completa em `progresso-51-l87.md`) |
| 2 | buracos reais achados na leitura (nenhum coincide com o que a Revisora tinha visto de fora, porque nenhum dos dois muda numa mudança de diff comum) | `marcarInvestida` via `declararAtaqueSimultaneo` (`grid.astro:6357`) e `varrerCondicoesVencidas` via `verificarEfeitos` com `ATIVOS.length === 0` (`artes-grid-mesa.ts:1852`) |
| 7 | chamadores que perderam a chamada explícita a `avisarAgora`, porque ela só existia por esta escrita | `levantarDoChao` (os dois), `curar`, `gastarMana`, `devolverVida`, `abrirCondicoes` |
| 2 | chamadores que FICARAM com a chamada explícita, cada um cobrindo um caminho que não passa por `gravarPeca` | `aplicarDano`/`tirarVida` (`grid.astro:11049,11146`, o lado jogador de `baixarVida` chama `jogador_dano` direto) e `ajustarMana` (`grid.astro:11180`, o ramo mestre escreve `mana_max`+`mana_atual` juntos direto em `SB`) |
| 33 | asserções em `test-arte-na-mesa.mjs`, verdes depois do conserto do `ctx` de mentira | saída do próprio arquivo, `npm run validate` |
| 15 | asserções em `test-l70-empurrao.mjs` | saída do próprio arquivo, `npm run validate` |
| 79 | asserções em `test-grid-simultaneo.mjs` | saída do próprio arquivo, `npm run smoke` |
| 119 | citações de código movidas por esta edição (`gravarPeca` perto do topo de `grid.astro` desloca tudo abaixo) | reponte do Arquiteto, portão fechado em 279 citações conferidas (39 históricas), commit `454a1d8` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | `aplicarDano`/`tirarVida`/`ajustarMana` FICARAM com `avisarAgora` explícito, em vez de eu tirar por padrão (a instrução era "na dúvida, deixe os dois e me diga qual") | não é dobra por precaução: são dois caminhos que escrevem em `combatentes` SEM passar por `gravarPeca` (`jogador_dano` direto no lado jogador de `baixarVida`; a escrita combinada `mana_max`+`mana_atual` do lado mestre de `ajustarMana`). O estrangulamento novo não é único enquanto esses dois existirem, e isso é achado desta rodada, não ressalva de rotina (ver O QUE FICOU EM ABERTO) |
| D02 | Tornei `gravarCondicao` campo OBRIGATÓRIO em `CtxGrid`, não opcional | um `ctx` de mentira desatualizado (`test-arte-na-mesa.mjs`) quebrou em RUNTIME, não em tempo de checagem: os testes que importam `artes-grid-mesa.ts` são bundlados por `esbuild` sem checagem de tipo, então a obrigatoriedade no `.ts` não protegeu o dublê JS. Precisei somar o campo ao mock à mão. Registro isto como achado sobre a bancada, não sobre este campo específico (ver O QUE FICOU EM ABERTO) |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **O estrangulamento de `gravarPeca` não é único de verdade.** Dois
  caminhos continuam escrevendo em `combatentes` sem passar por ele:
  `jogador_dano` (RPC chamada direto por `baixarVida` do lado jogador,
  `grid.astro`) e a escrita combinada `mana_max`+`mana_atual` do ramo mestre
  de `ajustarMana`. Hoje os dois avisam por conta própria (por isso não
  ficaram silenciosos), mas se algum dia esses dois campos precisarem de
  outra coisa além de "avisar" (uma validação, um log, uma segunda
  campainha), vai precisar acontecer em DOIS lugares, exatamente o defeito
  que esta rodada existe para tirar do resto do arquivo. Não é meu para
  decidir se vale fechar os dois também, ou se ficam como exceção
  registrada.
- **O tipo não protege os dublês da bancada.** `CtxGrid` é uma interface
  TypeScript, e `test-arte-na-mesa.mjs` (o único teste de Node que MONTA um
  `ctx` inteiro; `test-l70-empurrao.mjs` só importa funções puras e não
  precisa de um) é bundlado por `esbuild` sem checagem de tipo. Um campo
  novo OBRIGATÓRIO na interface não impede um `ctx` de mentira desatualizado
  de compilar; ele só quebra em runtime, no primeiro caminho de código que o
  usa (e só se aquele teste específico exercitar esse caminho). Isto não é
  falha desta rodada: é uma propriedade da bancada que ninguém tinha escrito
  antes de eu esbarrar nela. Fica para o Arquiteto decidir se isso merece
  uma forma no `CATALOGO` ou um portão próprio (algo como "todo campo novo
  em `CtxGrid` tem de aparecer em todo `ctx` de teste", conferido por
  script, não por revisão humana).

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-51-l87.md` · sinal de vida completo: o
  levantamento dos 9 chamadores lido função por função (com os dois buracos
  achados antes de qualquer código), a decisão do Arquiteto sobre as duas
  campainhas (`avisarAgora` × `avisarMudancas`, e por que não são
  alternativas), o eixo único escrito, e a bateria completa.
- `Pendencias.md` L87 · o item original, com a medição e a decisão do
  humano de virar rodada.
