# Rodada 117 · Executora · o texto de "Caça e recompensas" corrigido, e o "Parte por caçador"

- **Despacho:** `docs/simulacao/caixa/117-despacho.md` (`db05cae`).
- **Árvore:** branch `executora`, posta em `db05cae` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-117.md`.
- **Publicado:** num commit só, com este relato.
- **Nenhuma fórmula nem valor mudou.** Os textos do autor foram colados só com formatação, por
  script (`../tmp/executora/r117.py`), e cada um foi conferido palavra por palavra no `dist/`.

## Os cinco textos

| # | onde (depois) | antes | depois |
|---|---|---|---|
| 1 | `custo-de-servico-e-itens.md:69-72` (Recursos durante a aventura) | três itens: "recebe Livre de uma fonte por semana, ou nenhuma"; "1 a 3 ... não paga, e entra o Livre do contrato"; "4 a 6 ... continua pagando" | os quatro itens do autor: nunca paga o custo e anota só o Livre; a bolsa é o Livre do trabalho inteiro; 1 a 3 não rende nas semanas do contrato; 4 a 6 rende sem o dono, **somado à bolsa** |
| 2 | `custo-servicos.md:103` (Despesas e partes, item 1) | "Comida e pouso ... já estão no custo de vida e não se cobram à parte" | o texto do autor: nunca são cobrados; em terra sem suprimento contam peso e dias de autonomia, não o preço. O item 2, da parte da criatura, ficou como estava |
| 3 | `custo-servicos.md:48` (item 1b, Quantidade) | "+1 cada vez que o número dobra ... Conte só as que têm desafio até 2 abaixo..." | "criaturas com desafio até 2 abaixo da mais forte contam inteiras; as mais fracas que isso contam metade. Some tudo e ganhe +1 cada vez que o total dobra" |
| 4 | `custo-servicos.md:66` (item 3, Semanas), no fim | (não havia) | "A viagem conta metade porque é tempo gasto, não perigo: paga o tempo, sem o prêmio de risco." |
| 5 | `custo-servicos.md:99`, logo depois dos três testes | (não havia) | o parágrafo do autor ("A bolsa por semana é alta de propósito ... principalmente a oferta.") |

No `dist/` as oito frases novas estão presentes, palavra por palavra. "continua pagando" e "já
estão no custo de vida e não se cobram" não existem mais.

**A calculadora e a "fraca" (item 3 do despacho).** Os rótulos dos dois campos passaram a dizer o
que conta (`CalculadoraRecompensa.astro:10-11`), para quem usa a página sem ler o capítulo:
- "Criaturas fortes (até 2 abaixo da mais forte)";
- "Criaturas fracas (mais de 2 abaixo; contam metade)".
Os dois têm um `title` com a mesma frase. A conta não mudou: continua `fortes + fracas × 0,5`, depois
`piso(log2)`.

## O item 6 · "Parte por caçador" e a nota sem "Livre"

1. **A nota do `recompensas.json`.** Em vez de "o Livre por caçador por semana", escolhi **"a tarifa
   de base por caçador, por semana"**: é o valor de partida da conta, antes de semanas e
   multiplicadores, e é "tarifa", como na tabela de perfis.
   **Onde a mudança mora:** a `_nota` que vai para o site é a do `scripts/copiar-economia.mjs:57`,
   que substitui a do `gerar.py` (lá ela é só "Recompensa de caça."). O `recompensas.json` foi
   regerado pelo fluxo, e **não tem mais nenhuma ocorrência de "Livre"**. O comentário de
   `lore/economia/v2/modelo.py:446` também foi trocado.
   O valor do degrau continua pelo `arred`, sem mudança.
2. **"Parte por caçador"** nos dois lugares da calculadora (`CalculadoraRecompensa.astro:64`, a
   linha do resultado, e `:73`, a última linha do recibo). O capítulo não rotula o resultado final
   em lugar nenhum. O "por caçador, por semana" do Valor do degrau (`custo-servicos.md:50` e o
   recibo em `:69`) descreve o valor do degrau, e não a parte, e ficou.
   **A fórmula é a de antes:** `recompensa.ts:57`, `Math.floor(bolsa / grupo + 0.5)`, inteiro meio
   para cima, sem `arred`.
3. **Nenhuma outra colisão:** procurei "Livre" junto de degrau, caçador, recompensa e bolsa em
   `src/`, `scripts/` e `lore/economia/v2/`. Sobraram só usos do Livre da Renda:
   - o texto do autor "O valor é o Livre" e "a bolsa é o Livre do trabalho inteiro";
   - o Livre/Ano da tabela de capacidade;
   - a página da calculadora, que diz que a bolsa é o Livre de quem caça.
   Nenhum desses chama o valor do degrau de Livre.

## Os 5 valores da calculadora não mudaram

Rodados **na própria página** (`../tmp/executora/t-calc115.mjs`, puppeteer) e pelo
`test-recompensa.mjs` do `validate`:

| # | bolsa | Parte por caçador |
|---|:---:|:---:|
| 1 | 1.500 pc | 500 pc |
| 2 | 2.300 pc | 767 pc |
| 3 | 630 pc | 210 pc |
| 4 | 680 pc | 227 pc |
| 5 | 75 pc | 25 pc |

Nenhum erro de página.

## Verificação

`npm run validate` e `npm run build` verdes. Travessão: zero nas linhas novas.

## PRECISA DE MIM

Nada. Depois deste relato, peço à Leitora-novata que releia só os trechos novos.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
