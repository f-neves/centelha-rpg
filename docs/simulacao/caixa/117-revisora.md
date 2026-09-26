# Rodada 117 · veredito

**Sem arquivo de aviso:** o aviso foi a mensagem do Arquiteto, que nomeia o despacho (`db05cae`) e o
trabalho com o relato (`f1fda85`). Pino: `f1fda85`. Passo 0 pelo §0.1 (`merge-base --is-ancestor
HEAD origin/main` passou), depois `switch -C revisora f1fda85`. Toplevel da Revisora, branch
`revisora`, árvore limpa.

**Veredito geral: PROCEDE.** Nenhum BLOQUEIA, nenhum CORRIGE. Uma ESCALA de CI que não é da rodada (§ CI).

## CI (§11)

Workflow `Validar dados e regras`, acompanhado até o fim:

| commit | run | resultado |
|---|---|---|
| `db05cae` | `36235867199` | `success` |
| `f1fda85` | `36236064822` | **`failure`, no job `Smoke · test-grid`**, uma asserção |

A asserção que caiu: "✘ [aquece] a peça pegável não está na vez, e arrastá-la abriria pergunta em vez
de mover (escolhida "Criatura 17"; 0 peça(s) na vez pegáveis ...)".

**ESCALA · o vermelho não é da rodada.** O `f1fda85` só mexe em:

- dois capítulos de custo;
- a `CalculadoraRecompensa.astro`;
- a `_nota` do `recompensas.json`;
- um comentário do `modelo.py`;
- o `copiar-economia.mjs`;
- os `.md` da caixa.

Nada do Grid nem da mesa. A asserção é de preparo da cena (qual peça o teste escolhe para arrastar), e
passou nos runs anteriores, inclusive no `db05cae`, que é do mesmo instante. É a mesma família do
vermelho da 112 (`112-revisora.md`, CI): um smoke do Grid que depende de estado da execução. Não
investiguei a causa. O dono é a frente do Grid.

## 1 · Nenhuma fórmula mudou

- **`src/lib/` não tem mudança** entre `09a1deb` e o pino.
- **No `recompensas.json`, mudou só a `_nota`**, pelo fluxo: `copiar-economia.mjs:57`, regerado. O
  `--check` está verde, com 11 arquivos.
- **Na calculadora mudaram só textos:** os dois rótulos de criatura e o "Parte por caçador" nos dois
  lugares (`:64` e `:73`).
- **Os 5 casos da 115, digitados por mim na própria página** (`dist/recompensa`, puppeteer, lendo o
  texto que a página mostra; o script é meu):

| # | bolsa | Parte por caçador |
|---|---|---|
| 1 | 1.500 pc | 500 pc |
| 2 | 2.300 pc | 767 pc |
| 3 | 630 pc | 210 pc |
| 4 | 680 pc | 227 pc |
| 5 | 75 pc | 25 pc |

  Nenhum erro de página. O `test-recompensa.mjs` também está verde (9 asserções).

## 2 · Os cinco textos do autor

Comparei **palavra por palavra** os cinco blocos `> ` do despacho contra os dois capítulos, sem a
marcação:

- "Recursos durante a aventura";
- a comida na estrada;
- a quantidade;
- a frase das semanas;
- o parágrafo depois dos três testes.

**Os cinco estão lá, inteiros e em ordem.** "continua pagando" e "já estão no custo de vida e não se
cobram" não existem mais.

**O parágrafo novo** cita "o degrau 6 paga 250 pc por semana, perto do Livre de uma Nobreza (200)".
Os dois números conferem: é o degrau 6 do `recompensas.json` e o Livre/Sem da Nobreza no
`renda.json`.

## 3 · O "fraca" na calculadora

Os rótulos, lidos na página:

- "Criaturas fortes (até 2 abaixo da mais forte)";
- "Criaturas fracas (mais de 2 abaixo; contam metade)".

Os dois têm um `title` com a regra. É a leitura do autor, e fecha a minha observação 2 da 115.

## 4 · A colisão com "Livre"

**A `_nota` agora diz "a tarifa de base por caçador, por semana".** O comentário do `modelo.py:446`
também foi trocado. Procurei "Livre" perto de degrau, caçador, recompensa e bolsa, e sobraram só usos
do Livre da Renda, que é o sentido certo:

| onde | o texto |
|---|---|
| `recompensa.astro` | "Livre/Ano da faixa" e "a bolsa é o Livre de quem caça" |
| `gen-cap-economia.mjs:157` | o Livre/Ano da capacidade |
| `copiar-economia.mjs:53` e `gerar.py:330` | "bolsa de 4 semanas de Livre", do pacote inicial |

A "bolsa" do pacote inicial é outra coisa (a bolsa de dinheiro na criação), mas ela é medida em Livre
de Renda, então não há colisão. **Nada chama o valor do degrau de Livre.**

## 5 · Travessão

Zero nas linhas acrescentadas do `f1fda85`.

## Limpeza

Só leitura, build e o teste da página. Em `../tmp/revisora/` ficam o `t-calc117.mjs` e o log de
build. Não mexi em arquivo versionado além dos meus dois da caixa.
