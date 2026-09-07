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

**Nota da Executora, D15f e D15g: os dois itens que o TechLead pediu nesta
mesma rodada estão prontos.** Commit `b5ad27b34ea0036e6bba94febf7300583889b90a`,
base `9003783` (o topo que o TechLead deixou depois do rebase). Os campos de
cima (BASE/SHA/TOPO) valem para a PRIMEIRA metade do trabalho (porta do
Preparo); o commit acima é a segunda metade (porta da Recuperação + o
conserto do regex), e é ele que a Revisora deve checar de verdade, com este
arquivo por cima contando a história inteira. Detalhe de cada um em "O QUE
MUDOU" e "O QUE EU DECIDI", marcados D15f/D15g na tabela.

**Sobre o `npm run smoke`, e por que o TechLead o viu como "não rodando":**
ele rodou de verdade nesta máquina, só que com um atraso de vários minutos
entre o processo terminar (código de saída 0) e a saída aparecer no arquivo
de redirecionamento: bash redireciona para um arquivo, que passa por
`npm`, `node`, o servidor `astro dev` e a automação de navegador real
(Edge, para `test-espelho.mjs` e companhia), e nesta cadeia o buffer só
esvaziou no fim. A checagem de processos do TechLead deve ter caído numa
janela em que o processo já tinha saído (por isso nenhum `node`/`msedge`
vivo) mas o arquivo ainda não tinha sido escrito no disco. A saída bruta
final: 904 linhas, zero `✗`/`✘`, terminando em
`✓ espelho de motor: os dois laços concordam`, a mesma que fechou a
primeira metade da rodada. Não precisou do ramo descartável no CI.

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
| `docs/simulacao/ESTADO.md` | citações de linha reapontadas (`grid.astro`), duas vezes nesta rodada (porta do Preparo e depois porta da Recuperação) |
| `Pendencias.md` | citações de linha reapontadas na L34 §6 e alhures, nas duas metades da rodada; a L34 §6 ganhou notas de "implementado" nas duas portas |
| **D15f/D15g, segunda metade** | |
| `scripts/test-cobertura-lib.mjs` | `exportadasDe` conserta o classificador (procura `=>`/`function` até o próximo `export`, não só na mesma linha); `cobreGolpe` e `custoInterporRecuperacao` entraram em `SO_DA_MESA`; autoteste novo para o formato multi-linha |
| `src/lib/mesa-tempo-ui.ts` | `abrirForaDeHora` ganha o modo "Se interpor" (checkbox, campo de metros, o mesmo picker de golpe da porta do Preparo), com o preço saindo de `custoInterporRecuperacao` em vez de digitado; `aoConfirmar` ganha `interpoe` opcional |
| `src/pages/mesa/grid.astro` | `agirForaDeHora` passa `candidatosParaInterpor(c)` para `abrirForaDeHora` e grava `interpoe` na ação nova quando escolhido |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.

| número | o que é | de onde sai |
|---|---|---|
| piso de 2 Ticks, distância inteira acima disso | o preço da porta da Recuperação do Interpor | `src/data/regras.json` (`combate.interpor.recuperacao`), lido por `custoInterporRecuperacao` (`src/lib/combate-tempo.ts`) |
| 1 Tick por metro, sem piso | o preço da porta do Preparo (reuso do `combate.abortar.ticksPorMetro`, já existente) | `src/data/regras.json:2502` |
| 522 inserções, 53 remoções, 10 arquivos | o diff da 1ª metade (porta do Preparo) | `git diff --stat 98fa56a574d9201f89bd59555dfe7943055a2565 b81b27196c87bd5b3b2d24da0ad091df0ef752a4`, rodado no commit avisado |
| 148 inserções, 34 remoções, 5 arquivos | o diff da 2ª metade (D15f/D15g) | `git diff --stat 9003783 b5ad27b34ea0036e6bba94febf7300583889b90a`, rodado no commit avisado |
| 0 falhas em `npm run validate` (~30 scripts, incluindo `test-procedencia.mjs`, `test-portoes.mjs` e `test-cobertura-lib.mjs`) | a suíte inteira, depois das duas rodadas de reaponte de citações e do conserto do regex | rodado no commit avisado |
| 0 falhas em `npm run smoke` (9 portões de navegador, incluindo `test-espelho.mjs`) | os portões que abrem página de verdade, rodados depois da porta da Recuperação também | rodado no commit avisado |
| 80 citações de código conferidas pela âncora (77 antes da rodada, 78 depois da 1ª metade, 80 depois da 2ª) | `test-procedencia.mjs`, contando as duas rodadas de reaponte | rodado no commit avisado |

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, com o custo de cada uma.

| # | a decisão | o que ela custa |
|---|---|---|
| D15a | a geometria do Interpor à distância usa a posição ATUAL do interpositor no tabuleiro, não um destino futuro | o diálogo de abortar não move a peça (nunca moveu), então "onde ele termina" é onde ele já está; quem digitar metros > 0 continua pagando o preço certo em Ticks, mas o alcance é medido de onde a peça está agora, não de onde ela chegaria. Mover a peça ao abortar é mecanismo novo, fora das seis perguntas fechadas |
| D15b | a limpeza de `acao.interpoe` depois do golpe cair (`interposicaoConsumida`) só escreve quando quem resolve é o MESTRE | não há RPC de jogador para escrever numa peça terceira (nem quem ataca, nem quem apanha); um jogador resolvendo o próprio golpe adiado contra um interpositor deixa a flag presa até o mestre agir. Inofensivo: a chave é `aid`+Tick exatos, que não se repetem, então a flag presa nunca cobre um golpe futuro por engano |
| D15c | a porta da Recuperação (item 6) ficou só com o preço pronto (`custoInterporRecuperacao`, testado), sem gatilho na tela | CONCLUÍDO nesta mesma rodada, por decisão D15f do TechLead: ver a tabela abaixo e "O QUE MUDOU" |
| D15d | `acaoVazia` (`combate-tempo.ts`) passou a tratar `{interpoe: {...}}` como não-vazia | sem isso, `acaoNo` (a mesa) apagava a própria cobertura em todo lugar que lê por ele, achado só ao integrar, e não fazia parte do plano. Auditado contra os outros 20 chamadores de `acaoVazia`/`acaoNo` no `grid.astro`: nenhum dependia do valor antigo (a maioria já refaz a mesma pergunta por `temGesto`, que não mudou) |
| D15e (TechLead) | reconciliar `origin/main` com rebase (não merge) e empurrar, sem perguntar | `53c18c0` só adicionava `docs/simulacao/caixa/14-revisora.md`, zero sobreposição com os dez commits locais, conferido antes de agir; `npm run validate` rodado de novo pós-rebase, mesmo resultado. Mecânica de git sem conteúdo de regra, dentro do que o TechLead decide sozinho (`TECHLEAD.md` §1). Hashes desta rodada mudaram por causa do rebase; corrigidos no topo deste arquivo |
| D15f (TechLead, executado pela Executora) | porta da Recuperação (item 6, metade 2) termina AGORA, antes de mandar para a Revisora, em vez de virar rodada própria | `abrirForaDeHora` (`src/lib/mesa-tempo-ui.ts`) ganhou o modo "Se interpor": checkbox, campo de metros, o mesmo picker de golpe da porta do Preparo (`interporCandidatos`), preço travado em `custoInterporRecuperacao`. `agirForaDeHora` (`grid.astro`) passa `candidatosParaInterpor(c)` e grava `interpoe`. Reuso alto como estimado: a geometria, os candidatos e o redirect de dano já existiam |
| D15g (TechLead, executado pela Executora) | conserto do regex de `test-cobertura-lib.mjs` (que não classifica `export const f = (...) =>` com parênteses na linha seguinte como função) entra nesta mesma rodada | `exportadasDe` passou a procurar `=>`/`function` até o PRÓXIMO `export` de topo, não só na mesma linha do `export` atual. `cobreGolpe` (que motivou o achado) e `custoInterporRecuperacao` (que passou a ser chamada pela mesa nesta mesma rodada) entraram em `SO_DA_MESA`. Autoteste novo, ensaiado nos três sentidos (função antiga reintroduzida à parte, sem tocar no resto do arquivo: caiu; restaurada: voltou a passar) |

## O QUE FICOU EM ABERTO

- **A porta da Recuperação NÃO TEM TESTE AUTOMATIZADO PRÓPRIO.** O preço
  (`custoInterporRecuperacao`) está testado em `scripts/test-combate-tempo.mjs`
  §7, e a sintaxe do diálogo novo (`abrirForaDeHora` em `mesa-tempo-ui.ts`) foi
  conferida por `esbuild` (transpila sem erro) e pelo `npm run smoke` (a mesa
  abre e joga sem quebrar). Mas não existe um cenário de `test-grid.mjs` ou
  `test-espelho.mjs` que declare "Se interpor" pela porta da Recuperação de
  ponta a ponta (candidato → confirmação → golpe redirecionado): a porta do
  Preparo também não tem, pela mesma razão (é fluxo de diálogo, DOM). Registrado
  para a Revisora decidir se isso bloqueia, ou se o smoke (que já passa) e os
  testes puros bastam para esta rodada.
- **`test-cobertura-lib.mjs` não enxergava `cobreGolpe`: CONSERTADO nesta
  mesma rodada (D15g).** O regex de classificação (`exportadasDe`) só olhava a
  mesma linha do `export`; passou a olhar até o próximo `export` de topo.
  Autoteste novo provando o formato multi-linha, ensaiado nos três sentidos.
- **A divergência de `origin/main`, RESOLVIDA pelo TechLead antes deste
  aviso ir à Revisora.** `53c18c0` era só `docs/simulacao/caixa/14-revisora.md`
  (o humano fechando a rodada 14 direto no GitHub), sem tocar nenhum arquivo
  dos dez commits locais desta rodada, zero risco de conflito, confirmado
  antes de agir. Rebase local sobre `origin/main`, `npm run validate` rodado
  de novo (mesmo resultado), e o resultado empurrado. Os hashes citados em
  BASE/SHA/TOPO no topo deste arquivo já são os pós-rebase; ver a nota do
  TechLead ali e o item D15e na tabela "O QUE EU DECIDI" abaixo.
- **A régua "Desviar" não foi tocada.** A seção 6 do Pendencias.md fecha as
  seis perguntas do Interpor; sobre Desviar ela mesma diz que "não há número
  que separe desviar de mover, nem regra que diga o que 'sair da linha'
  compra": régua não escrita, e escrevê-la é escalada (regra de jogo), não
  engenharia. Não implementado, e não deveria ser nesta rodada.

## ONDE LER

- `Pendencias.md`, L34 §6 · a régua fechada e as notas de "implementado" nas duas portas
- `src/lib/combate-tempo.ts` · `Acao.interpoe`, `cobreGolpe`, `interposicaoConsumida`, `custoInterporRecuperacao`, e a correção em `acaoVazia`
- `src/lib/alcance.ts` · `alcanceInterpor`
- `src/lib/hex.ts` · `linhaHex`/`naLinhaHex`
- `src/pages/mesa/grid.astro` · `candidatosParaInterpor`, `abortarGesto`, `agirForaDeHora`, `interpositorDoGolpe`, `resolverGolpeNoAr`
- `src/lib/mesa-tempo-ui.ts` · `abrirAbortar` e `abrirForaDeHora`, os dois com o picker de golpe
- `scripts/test-combate-tempo.mjs` · seção 7, "o Interpor (L34 §6)"
- `scripts/test-cobertura-lib.mjs` · `exportadasDe` e o autoteste "D15g"
