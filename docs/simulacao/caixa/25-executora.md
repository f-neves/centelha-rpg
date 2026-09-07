# Rodada 25 · aviso à revisora (Fase 2.5, lote 2, item 1/2: o resíduo do relógio)

## COMMIT

```
BASE  cce6948b10abef2faebf078994328c761c605b3c  (L32: decisão do humano sobre o visual da lembrança)
SHA   cffcec9aad255183b40881b04c6c2ce6024ec621  (esta rodada)
TOPO  cffcec9aad255183b40881b04c6c2ce6024ec621  (nada entrou depois)
```

`cce6948` e `791017e` não são meus (mecânica do TechLead: a decisão do L32 e o
registro da coautoria indevida). Trabalho desta rodada: só `cffcec9`.

## O QUE MUDOU

| arquivo | o que mudou nele |
|---|---|
| `src/pages/mesa/combate.astro` | no Simultâneo, o relógio (`AGORA`/`enc-tick`/`enc-rodada`) passa a ler `ENC.tick_atual`, igual ao Grid; no normal e no P/G/R nada muda |
| `scripts/mesa-mock.mjs` | novo knob `?deslocafila=N`: anda o `tick`/`acao.golpes`/`acao.livre` de toda peça em N, separado de `?tick=` (que só anda a arena) |
| `scripts/test-grid.mjs` | duas provas novas: o par Simultâneo (mestre/jogador, `?tick=5&tempo=simultaneo`, `#enc-tick` bate com `tick_atual`) e o par P/G/R (mestre/jogador, `?deslocafila=10` e `17`, `#ini-tk` do jogador bate com o do mestre e muda com o deslocamento) |
| `Pendencias.md` | duas citações de linha reapontadas (`test-grid.mjs:2902→2969`, `test-grid.mjs:1433-1437→1436-1440` e `1438-1457→1441-1460`), puro efeito colateral de `test-grid.mjs` ter crescido; nenhuma mudança de conteúdo |

## O ACHADO, e a ordem de descoberta

O TechLead pediu duas coisas nesta ordem, ambas parte do "resíduo do relógio"
que o levantamento da rodada 24 (`docs/simulacao/caixa/24-executora.md`)
deixou em aberto:

**1. A pergunta do `combate.astro`.** Montei a cena real pedida (bancada,
`?tick=5&tempo=simultaneo`) e medi ANTES de mexer no código: a arena real
(`encontro_visao.tick_atual`) estava em 5, e `#enc-tick` mostrava **0**, para
mestre E jogador. Divergiu de verdade, não era só pergunta teórica. Causa:
`AGORA = atual?.tick ?? 0` (`atual = emCampo[0]`, o combatente na frente da
fila) lia o `tick` INDIVIDUAL da peça, e uma peça `livre` (sem golpe nem
movimento em curso) não tem esse campo atualizado por
`avancarTickSimultaneo()` (`grid.astro`, só toca `c.tick` de quem tem
movimento automático chegando ou reprojeta agenda): ela fica parada onde
nasceu enquanto `tick_atual` anda. Autorizado a corrigir direto pelo próprio
TechLead ("pode corrigir direto... contanto que escreva o achado e o custo no
aviso"): troquei a fonte para `ENC.tick_atual` quando `ehSimultaneo(TEMPO)`,
igual ao que `grid.astro` já faz em `relogio()`/`tickSim()`. Custo: nenhum
código de P/G/R ou normal tocado (o `if` só entra no ramo Simultâneo), e a
prova de regressão (abaixo) falha se alguém reverter a troca (conferido:
revertei a linha, rodei o teste, viu `(0)` em vez de `(5)` nas duas
asserções novas, depois restaurei).

**2. O teste que falta no P/G/R.** Diferente do achado 1, aqui não havia
divergência para medir: era ausência de instrumento. A bancada nasce com
`tickDaVez()` E `golpeMaisCedo()` os dois em Tick 0 (confirmado por conta:
`c000` é `livre` com `tick=0`, e `c008` tem `golpes=[0]`), e Tick 0 é o
mesmo número que uma máscara quebrada em `combate_visao` devolveria por
`?? 0`. Sem separar isso de zero, "o jogador calcula o mesmo relógio que o
mestre" nunca foi falsificável no P/G/R. Não havia knob para tirar a cena do
zero sem uma mudança na bancada (verificado: `?tick=` só grava
`encontros.tick_atual`, que o P/G/R nem lê), então criei `?deslocafila=N`,
deliberadamente separado de `?tick=` para não interferir na prova do
Simultâneo (a `?tick=5&tempo=simultaneo` do achado 1 dá exatamente esse
resultado justo porque a fila NÃO anda com `?tick=`).

## O QUE ESTE RELATÓRIO AFIRMA

| número/claim | de onde sai |
|---|---|
| A arena real estava em 5 e `#enc-tick` mostrava 0, para mestre e jogador, antes do conserto | sonda descartável rodada nesta máquina (`?tick=5&tempo=simultaneo`), reproduzida agora como asserção em `test-grid.mjs` (ver linha abaixo) |
| Depois do conserto, `#enc-tick` mostra 5 para os dois lados | `node scripts/test-grid.mjs`, asserções "e o mestre le o relogio da ARENA no Simultaneo, nao o da fila (5)" e "e o jogador tambem (5)" |
| Revertendo a troca de uma linha, as mesmas duas asserções falham mostrando `(0)` | conferido nesta rodada: `git stash` só do arquivo, rodei o teste, vi `✘ (0)` nas duas, `git stash pop` |
| No P/G/R padrão, `tickDaVez()` e `golpeMaisCedo()` são ambos 0 | cálculo à mão sobre a semente de `mesa-mock.mjs` (`c000` livre tick=0; `c008` golpes=[0]), conferido pela sonda antes do knob existir |
| Com `?deslocafila=10`, mestre e jogador leem 10; com `17`, os dois leem 17 | `node scripts/test-grid.mjs`, asserções "o mestre sai do Tick 0 com o deslocamento" / "e o jogador calcula o MESMO relógio que o mestre" / "e muda junto com um segundo deslocamento" |
| `combatentes` (mestre) e `combate_visao` (jogador) têm `tick`/`acao.golpes` idênticos linha a linha em `?deslocafila=10` | sonda descartável, não fica no repositório: lida diretamente de `window.__SB.tabelas` nas duas páginas, os dois vetores batem id a id |
| `npm run validate` e `npm run smoke`: exit 0 | rodados por completo nesta máquina, no commit avisado |

## O QUE EU DECIDI

| # | a decisão | o que ela custa |
|---|---|---|
| D25a | corrigi o `combate.astro` direto, sem escalar, pela autorização explícita do TechLead na própria atribuição desta rodada | nenhum: a autorização já previa o custo de eu decidir sozinha, contanto que o achado ficasse escrito (está, acima) |
| D25b | criei `?deslocafila=N` em vez de generalizar `?tick=` para também andar a fila | isso teria quebrado silenciosamente a prova do Simultâneo do achado 1, que depende de `?tick=` mover SÓ a arena. Separar os dois é mais parâmetro, mas nenhum dos dois mente sobre o que anda |
| D25c | não toquei o parágrafo de `Pendencias.md` L33 que descreve a lacuna do P/G/R como aberta ("ninguém montou uma cena... lacuna de PROVA"), mesmo ela estando desatualizada pelo que fiz aqui: só corrigi os NÚMEROS DE LINHA que test-procedencia.mjs cobra, não o conteúdo. Registrar que a lacuna fechou é decisão do TechLead, não minha | o parágrafo fica descrevendo um estado que este mesmo commit já resolve, até o TechLead atualizar |

## O QUE FICOU EM ABERTO

- Item 2 do lote 2 (a tela da lembrança, que destrava a migração 33) não foi
  tocado nesta rodada, por ser o próximo item da ordem, não este.
- `Pendencias.md` L33 (ver D25c).

## ONDE LER

- `src/pages/mesa/combate.astro:891-901` · o comentário e a troca de uma linha
- `scripts/mesa-mock.mjs:163-177` · o knob `?deslocafila=N` e o porquê de ser
  separado de `?tick=`
- `scripts/test-grid.mjs:1462-1489` · o par de asserção do P/G/R
- `scripts/test-grid.mjs:1555-1588` (final de `cenaRastreador`) · o par de
  asserção do Simultâneo em `combate.astro`
