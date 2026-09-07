# Rodada 14 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  e21ef3d0da8c338cf2b41433c76f6296b8feb99c
SHA   ec71b4ab1f32ad808a86da4efd43b1c89389554e
TOPO  ec71b4ab1f32ad808a86da4efd43b1c89389554e
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
documento da rodada; aqui é só o inventário.

| arquivo | o que mudou nele |
|---|---|
| `.github/workflows/validate.yml` | `test-bandeiras-mesa` entrou na matriz do smoke (estava fora desde que nasceu) |
| `CLAUDE.md` | regra nova: ação NOVA do Grid recebe objeto, não lê o DOM, com o escopo (não vale para bandeira que estende ação existente) |
| `Grid_melhorias.md` | frente "Comandos por voz" registrada, só documentação, 7 decisões travadas |
| `Pendencias.md` | L25 retagueada de pré-requisito de bateria para dívida de produto; porte/gate documentados como as duas primeiras bandeiras ligadas |
| `docs/simulacao/02-projeto-harness.md` | nota de que a grade oficial (n=2.527) está desenhada e não rodada |
| `docs/simulacao/CATALOGO.md` | sete casos novos: cópia sustentada por detector (não disciplina), segundo ponto de decisão na mesma função, par com insumo comum, trava que audita o nível errado, o gatilho operacional do insumo comum, e o teste que nasce fora do CI |
| `docs/simulacao/ESTADO.md` | seção de encerramento da frente de simulação, com motivo e o que fica |
| `package.json` | `test-bandeiras-mesa` entrou no `smoke`; script de conveniência `bandeiras-mesa` |
| `scripts/gen-bestiario.mjs` | `perfArma` passou a sair no `ataques[]` de cada criatura |
| `scripts/gen-monsters.mjs` | o `.map()` de `combate.ataques[]` parou de descartar `perfArma` (era o ponto que a `CAMPOS_MESA` não alcançava) |
| `scripts/mesa-mock.mjs` | cena nova `?cena=bandeiras`: 3 PCs com Adaga contra 3 criaturas de porte/resistência diferentes |
| `scripts/test-bandeiras-mesa.mjs` | novo: prova porte e gate na Vida real (`pvDe`), não só no log |
| `scripts/test-bandeiras.mjs` | `porte` e `gate` entraram em `LIGADAS_NO_MOTOR`, com asserções de sinal/magnitude |
| `scripts/test-portoes.mjs` | item 6 novo: confere que o `smoke` do package.json e a matriz do CI concordam nas duas direções, com controle positivo |
| `src/data/inimigos.json` | regenerado (`perfArma` nos ataques) |
| `src/data/monsters-mesa.json` | regenerado (`perfArma` chegando ao transporte da mesa) |
| `src/data/monsters.json` | regenerado (mesmo motivo) |
| `src/data/regras.json` | `bandeiras.gate` e `bandeiras.porte` viraram `true`; `notaEstado` documenta onde cada uma foi ligada |
| `src/lib/calc.ts` | `porteDeRotulo`, `modificadorPorte` novos; `perfArma` entrou em `resumoCombatePC` |
| `src/lib/combate-resumo.ts` | `ResumoCombate.perfArma` novo |
| `src/lib/mesa-bestiario.ts` | `ResumoCombate.perfArma` novo, populado em `baseResumo` e `resumoDe` |
| `src/pages/mesa/grid.astro` | `resvalaGate` calculado uma vez em `folhaDaAcao` e aplicado nos três pontos que decidem dano (`contaDoLance`, `fim`, `pintarDano`); `ajAtq` ganhou o termo de porte; `__ESPELHO` ganhou `pvDe`/`resumoDe` |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `[0,3,6,9,12]`, teto 4 categorias | tabela de ajuste de acerto por diferença de porte | `src/data/regras.json:992-999` (`porteAcerto.porDiferenca`/`capCategorias`) |
| 7 de 9 armaduras (todas exceto Placa de munição e Placa completa) | resistPerf ≥ 1 > Perfuração 0 da Adaga: quantas resvalam com o gate ligado | `src/data/armaduras.json:2-10` (`resistPerf`) contra `armas.json` (Adaga, Perfuração 0) |
| resistPerf das 9 armaduras bate número a número com `armas-e-armaduras.md:109-119` | confirma que o catálogo não está inflado; a Adaga resvalar é a régua | `src/data/armaduras.json:2-10` vs `src/content/chapters/armas-e-armaduras.md:109-119` (conferido manualmente, sem script) |
| 1315/1315 | fração das lances do fixture de regressão que carregam `entrada.perfil` completo | `scripts/fixtures/lances.jsonl`, contado com `node -e` no commit avisado |
| 0/1315 | fração das mesmas 1315 lances com QUALQUER bandeira `true` no perfil | mesmo comando, mesmo arquivo |
| 3 pontos de decisão de dano em `folhaDaAcao` | `contaDoLance`, `fim`, `pintarDano`; busca confirma que não há um quarto (só dois `soakDe(` em todo o arquivo) | `src/pages/mesa/grid.astro:8898,9420,9013` |
| 7 `.map()` de reconstrução de campo por campo dentro do gerador que monta a criatura | contados à mão em `gen-monsters.mjs`; só o de `ataques` foi corrigido nesta rodada | `scripts/gen-monsters.mjs` (linhas ~165, ~167, ~224, ~225, ~227, ~229, e o de `ataques` já corrigido) |
| 9 entradas na matriz do CI, 9 no `smoke` do package.json | as duas listas concordam nas duas direções, com `test-luas` como controle positivo | `.github/workflows/validate.yml:93-102`, `package.json` (`scripts.smoke`), conferido por `scripts/test-portoes.mjs:125` (item 6) |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D14a | trocar o alvo do teste de gate de `mon-aboleth` para `guarda-da-cidade` | achado só pelo ensaio dos três sentidos (rodar com a bandeira desligada); sem esse passo o teste ficaria verde para sempre sem medir o gate |
| D14b | não construir a trava genérica dos sete `.map()` de campo a campo em `gen-monsters.mjs` agora, só registrar o tamanho | os outros seis campos além de `perfArma` continuam sem trava até alguém escrever a versão genérica, ou até o próximo campo novo estourar do mesmo jeito |
| D14c | registrar comandos por voz só como documentação em `Grid_melhorias.md`, sem começar a construir | nenhuma trava impede a decisão de envelhecer sem revisão; fica pendente de retomada explícita |
| D14d | escopo da regra "ação recebe objeto" (CLAUDE.md) exclui retrofit de `folhaDaAcao`/`declararGolpe` | os dois pontos de decisão que hoje leem o DOM continuam acoplados ao clique; a regra só protege o que nascer daqui pra frente |
| D14e | escolher o detector (asserção que compara as duas listas) em vez de fonte única para o par `scripts.smoke`/matriz do CI | as duas listas continuam podendo divergir por um commit; o item 6 do `test-portoes.mjs` é o que impede que a divergência fique muda, não que ela aconteça |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **A trava genérica dos sete `.map()`** (D14b) fica esperando decisão do humano: escrever a versão genérica agora, ou consertar caso a caso conforme cada campo estourar. Registrado como tamanho em `docs/simulacao/CATALOGO.md` (caso "o transporte que descarta") e em `Pendencias.md`.
- **teto6 continua desligado.** Confirmado nesta janela que o número em si está correto (não precisa de build), mas ele soma sentinela e magnitude no mesmo teto, e as duas coisas ainda dividem o campo do dado; ligar antes de separar os dois faria o teto contar duas grandezas como uma. Isto precisa do humano decidir a separação, não é conserto de código.
- **A frente de comandos por voz** está só registrada (Grid_melhorias.md, 7 decisões travadas), zero linha de código. Espera decisão explícita de começar.
- **grid.astro não importa `lance.ts`.** Duas implementações independentes da mesma conta, sincronizadas só pela fixture de 1315 lances (0% delas com bandeira ligada). Não é conserto desta rodada; é risco registrado em CATALOGO.md, esperando decisão de arquitetura do humano.
- A frente de simulação (bateria/harness) está encerrada; o que falta dela é produto, não instrumento (ver `docs/simulacao/ESTADO.md`).

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/CATALOGO.md` · os sete casos novos, no fim do arquivo, e a linha nova na tabela do topo
- `docs/simulacao/ESTADO.md` · a seção de encerramento da frente de simulação
- `Pendencias.md` · L25 retagueada, e o parágrafo de porte/gate como as duas primeiras bandeiras ligadas
- `CLAUDE.md` · a regra "ações recebem objeto", no bloco "O essencial do repositório"
- `Grid_melhorias.md` · "Comandos por voz", sob "Na fila"
