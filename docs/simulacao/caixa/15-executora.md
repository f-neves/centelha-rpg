# Rodada 15 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  ee752d7 (era 98fa56a antes do rebase abaixo)
SHA   8e88004 (era b81b271 antes do rebase abaixo)
TOPO  8e88004 (era b81b271 antes do rebase abaixo)
```

**Nota do TechLead, depois do aviso da Executora, mesmo commit de trabalho:**
a divergência com `origin/main` que a Executora registrou em BLOQUEADO foi
reconciliada por mim antes de enviar isto à Revisora. `53c18c0` (o commit que
o GitHub tinha e o local não) só adiciona `docs/simulacao/caixa/14-revisora.md`
— zero sobreposição de arquivo com os dez commits desta rodada (conferido com
`git show --stat 53c18c0` e `git diff --stat 64cb62d <topo-antigo>`). Rebase
local sobre `origin/main`, sem conflito nenhum; os dez commits ganharam hash
novo, por isso os valores acima mudaram depois de escritos. `npm run validate`
rodado de novo depois do rebase: mesmo resultado (0 falhas). Empurrado para
`origin/main` em seguida. O texto original da Executora abaixo descreve o
trabalho corretamente; só os hashes citados aqui em cima foram corrigidos.

`TOPO` igual a `SHA`: nenhuma outra frente local empurrou commit nenhum entre a
`BASE` e este trabalho (o commit do GitHub reconciliado acima não toca nenhum
arquivo desta rodada). Os três campos acima foram conferidos à mão com
`git rev-parse` e `git diff --stat`.

O checkout é no commit **deste arquivo** (o commit que o adiciona), uma linha
acima do `SHA` na história, com a mesma árvore de código.

## O QUE MUDOU

Uma frase por arquivo tocado, sem justificativa (a justificativa mora na
mensagem de commit e na conversa da rodada).

| arquivo | o que mudou nele |
|---|---|
| `src/lib/hex.ts` | `linhaHex`/`naLinhaHex` novos: a reta entre dois hexágonos em coordenadas cúbicas, reusando `arredondarHex` que já existia (item 3b da L34 §6) |
| `src/lib/alcance.ts` | `alcanceInterpor` novo: o teto de alcance do Interpor, corpo a corpo (reach) e à distância (reach + linha) |
| `src/lib/combate-tempo.ts` | `Acao.interpoe` novo campo; `cobreGolpe`, `interposicaoConsumida`, `custoInterporRecuperacao` novos; `acaoVazia` corrigida para não apagar uma ação que só carrega `interpoe` |
| `src/data/regras.json` | bloco `combate.interpor` novo: as seis decisões documentadas como nota, e os dois números da porta da Recuperação (`ticksPorMetro`, `minimoTicks`) |
| `src/lib/mesa-tempo-ui.ts` | `abrirAbortar` passa a exigir escolher qual golpe no ar a interposição cobre (novo parâmetro `interporCandidatos`, tipo `CandidatoInterpor`); `GolpeNoAr.coberto` novo, computado em `golpesEmCena`, desenhado como selo 🛡 em `faixaDeGolpesHTML` |
| `src/pages/mesa/grid.astro` | `candidatosParaInterpor` novo (a régua de alcance aplicada ao tabuleiro); `abortarGesto` grava `acao.interpoe` em vez de descartar a escolha; `interpositorDoGolpe` novo; `resolverGolpeNoAr` redireciona o dano para o interpositor (Absorção e Vida dele, Defesa e veredito do alvo original) e consome a cobertura; `folhaDaAcao` ganha `opts.alvoDano` |
| `scripts/test-combate-tempo.mjs` | seção 7 nova: `cobreGolpe`, `interposicaoConsumida`, `custoInterporRecuperacao`, `alcanceInterpor`, `linhaHex`/`naLinhaHex`, e o par que prova o conserto de `acaoVazia` |
| `scripts/test-cobertura-lib.mjs` | `interposicaoConsumida` entrou em `SO_DA_MESA` (chamada pela mesa, não pelo harness) |
| `docs/simulacao/ESTADO.md` | quatro citações de linha reapontadas (`grid.astro`, ver "citações envelhecidas" abaixo) |
| `Pendencias.md` | dezessete citações de linha reapontadas na L34 §6 e alhures; a L34 §6 ganhou uma nota de "implementado nesta rodada" na porta do Preparo |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.

| número | o que é | de onde sai |
|---|---|---|
| piso de 2 Ticks, distância inteira acima disso | o preço da porta da Recuperação do Interpor | `src/data/regras.json` (`combate.interpor.recuperacao`), lido por `custoInterporRecuperacao` (`src/lib/combate-tempo.ts`) |
| 1 Tick por metro, sem piso | o preço da porta do Preparo (reuso do `combate.abortar.ticksPorMetro`, já existente) | `src/data/regras.json:2502` |
| 522 inserções, 53 remoções, 10 arquivos | o tamanho do diff desta rodada | `git diff --stat 98fa56a574d9201f89bd59555dfe7943055a2565 b81b27196c87bd5b3b2d24da0ad091df0ef752a4`, rodado no commit avisado |
| 0 falhas em `npm run validate` (~30 scripts, incluindo `test-procedencia.mjs` e `test-portoes.mjs`) | a suíte inteira, depois do reaponte de citações | rodado no commit avisado |
| 0 falhas em `npm run smoke` (9 portões de navegador, incluindo `test-espelho.mjs`) | os portões que abrem página de verdade | rodado no commit avisado |
| 78 citações de código conferidas pela âncora (era 77 antes desta rodada) | `test-procedencia.mjs`, depois de reapontar as 17 do Pendencias.md e as 4 do ESTADO.md | rodado no commit avisado |

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, com o custo de cada uma.

| # | a decisão | o que ela custa |
|---|---|---|
| D15a | a geometria do Interpor à distância usa a posição ATUAL do interpositor no tabuleiro, não um destino futuro | o diálogo de abortar não move a peça (nunca moveu), então "onde ele termina" é onde ele já está; quem digitar metros > 0 continua pagando o preço certo em Ticks, mas o alcance é medido de onde a peça está agora, não de onde ela chegaria. Mover a peça ao abortar é mecanismo novo, fora das seis perguntas fechadas |
| D15b | a limpeza de `acao.interpoe` depois do golpe cair (`interposicaoConsumida`) só escreve quando quem resolve é o MESTRE | não há RPC de jogador para escrever numa peça terceira (nem quem ataca, nem quem apanha); um jogador resolvendo o próprio golpe adiado contra um interpositor deixa a flag presa até o mestre agir. Inofensivo: a chave é `aid`+Tick exatos, que não se repetem, então a flag presa nunca cobre um golpe futuro por engano |
| D15c | a porta da Recuperação (item 6) ficou só com o preço pronto (`custoInterporRecuperacao`, testado), sem gatilho na tela | ver "O QUE FICOU EM ABERTO", com o custo estimado de terminar |
| D15d | `acaoVazia` (`combate-tempo.ts`) passou a tratar `{interpoe: {...}}` como não-vazia | sem isso, `acaoNo` (a mesa) apagava a própria cobertura em todo lugar que lê por ele, achado só ao integrar, e não fazia parte do plano. Auditado contra os outros 20 chamadores de `acaoVazia`/`acaoNo` no `grid.astro`: nenhum dependia do valor antigo (a maioria já refaz a mesma pergunta por `temGesto`, que não mudou) |

## O QUE FICOU EM ABERTO

- **A porta da Recuperação (item 6, metade 2 de 2) não tem gatilho na tela.**
  `custoInterporRecuperacao` existe e está testado; falta o diálogo (reusar
  `candidatosParaInterpor`, que já existe e é reutilizável, mais um campo de
  metros e a trava "um golpe só" que a porta do Preparo já tem). Estimativa:
  menor que esta rodada, porque a parte difícil (candidatos, geometria,
  cobertura, consumo, redirect de dano) já está pronta e teria só reuso. Isto
  precisa de uma decisão do humano: encerrar a régua com só uma porta
  funcionando por enquanto, ou abrir mais uma rodada para a segunda.
- **`test-cobertura-lib.mjs` não enxerga `cobreGolpe`.** Achado ao rodar o
  portão: a função é `export const cobreGolpe = (...) => ...` com os
  parênteses dos argumentos na PRÓXIMA linha, e o regex que classifica
  "função vs. constante" só olha a mesma linha do `export`. `cobreGolpe` conta
  como exportada mas não como função, então o portão não a coloca em
  `SO_DA_MESA` nem em `NOS_DOIS`: ela fica invisível para este instrumento
  específico, mesmo sendo chamada de verdade pela mesa (`grid.astro`,
  `mesa-tempo-ui.ts`). Não é regressão de nada existente (o portão passa), é
  um ponto cego do detector contra um estilo de exportação legítimo. Registrado
  aqui e não em `CATALOGO.md`, porque não decidi sozinha se vale a pena
  consertar o regex ou só reescrever a função numa linha: é do humano.
- **A divergência de `origin/main` — RESOLVIDA pelo TechLead antes deste
  aviso ir à Revisora.** `53c18c0` era só `docs/simulacao/caixa/14-revisora.md`
  (o humano fechando a rodada 14 direto no GitHub), sem tocar nenhum arquivo
  dos dez commits locais desta rodada — zero risco de conflito, confirmado
  antes de agir. Rebase local sobre `origin/main`, `npm run validate` rodado
  de novo (mesmo resultado), e o resultado empurrado. Os hashes citados em
  BASE/SHA/TOPO no topo deste arquivo já são os pós-rebase; ver a nota do
  TechLead ali. Registrado como D15e em `docs/simulacao/CONTEXTO.md`.
- **A régua "Desviar" não foi tocada.** A seção 6 do Pendencias.md fecha as
  seis perguntas do Interpor; sobre Desviar ela mesma diz que "não há número
  que separe desviar de mover, nem regra que diga o que 'sair da linha'
  compra": régua não escrita, e escrevê-la é escalada (regra de jogo), não
  engenharia. Não implementado, e não deveria ser nesta rodada.

## ONDE LER

- `Pendencias.md`, L34 §6 · a régua fechada e a nota de "implementado nesta rodada"
- `src/lib/combate-tempo.ts` · `Acao.interpoe`, `cobreGolpe`, `interposicaoConsumida`, `custoInterporRecuperacao`, e a correção em `acaoVazia`
- `src/lib/alcance.ts` · `alcanceInterpor`
- `src/lib/hex.ts` · `linhaHex`/`naLinhaHex`
- `src/pages/mesa/grid.astro` · `candidatosParaInterpor`, `abortarGesto`, `interpositorDoGolpe`, `resolverGolpeNoAr`
- `scripts/test-combate-tempo.mjs` · seção 7, "o Interpor (L34 §6)"
