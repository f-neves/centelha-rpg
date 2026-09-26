# Rodada 118 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto, que nomeia o despacho (`9e573a7`) e o
trabalho com o relato (`9432f28`). Pino: `9432f28`. Passo 0 pelo §0.1 (`merge-base --is-ancestor
HEAD origin/main` passou), depois `switch -C revisora 9432f28`. Toplevel da Revisora, branch
`revisora`, árvore limpa.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA, nenhum CORRIGE.

## CI (§11)

Workflow `Validar dados e regras`, acompanhado até o fim, os dois `completed / success`:

| commit | run |
|---|---|
| `9e573a7` | `36236997747` |
| `9432f28` | `36237328411` |

## 1 · A Parte por caçador, para baixo, com a sobra

**O código** (`recompensa.ts:57-61`): `porCacador = Math.floor(bolsa / grupo)` e
`sobra = bolsa − porCacador × grupo`. Por construção, as partes mais a sobra fecham a bolsa, e a sobra
fica entre 0 e grupo − 1. **A bolsa não mudou** (a linha dela não foi tocada).

**Digitei os casos na própria página** (`dist/recompensa`, com o puppeteer e um script meu, lendo o
texto que a página mostra):

| bolsa | grupo | a página mostra |
|---|---|---|
| 1.500 | 3 | "Parte por caçador (grupo de 3): 500 pc", **sem sobra** |
| 2.300 | 3 | "766 pc (sobram 2 pc, divida como quiser)" |
| 630 | 3 | 210 pc, sem sobra |
| 680 | 3 | "226 pc (sobram 2 pc, divida como quiser)" |
| 75 | 3 | 25 pc, sem sobra |
| 75 | 4 | "18 pc (sobram 3 pc, divida como quiser)" |

**Os 3 testes obrigatórios e os 5 casos batem**, pela conta à mão e pela página. O caso 4 (680 ÷ 3 =
226,67) e o caso 5 (75 ÷ 3 = 25) conferem com a tabela do despacho. O `test-recompensa.mjs` está
verde, com 17 asserções.

**O teste pega o jeito antigo:** ele espera 766 no caso 2, e o "meio para cima" daria 767. Não rodei
esse controle negativo; é a conta.

**O desvio de redação** (o "(grupo de N)" junto do rótulo, e não no fim) é sensato: o texto fica
"Parte por caçador (grupo de 3): 766 pc (sobram 2 pc, divida como quiser)", sem dois parênteses
seguidos no fim. **Aceito.**

**A linha 42 do capítulo** ("o grupo divide como quiser") continua coerente com a sobra: é a mesma
ideia, dita na página.

**A `_nota`** ganhou a frase pelo fluxo (`copiar-economia.mjs:57`), e o `--check` está verde, com 11
arquivos.

## 2 · O texto

No `dist/regras/custo-servicos/index.html`: "Centelha parecida" aparece **1** vez, e "pares do grupo"
**0**. O resto da frase (o degrau 6 e o Livre da Nobreza) ficou como estava.

## 3 · Travessão

Zero nas linhas acrescentadas do `9e573a7` e do `9432f28`.

## Limpeza

Só leitura, build e o teste da página. Em `../tmp/revisora/` ficam o `t-calc118.mjs` e o log de
build. Não mexi em arquivo versionado além dos meus dois da caixa. **A Leitora-novata não foi
acionada**, a pedido do autor.
