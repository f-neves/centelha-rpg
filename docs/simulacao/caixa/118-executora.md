# Rodada 118 · Executora · "Centelha parecida" e a Parte por caçador para baixo, com a sobra

- **Despacho:** `docs/simulacao/caixa/118-despacho.md` (`9e573a7`).
- **Árvore:** branch `executora`, posta em `9e573a7` depois de o `merge-base --is-ancestor` dar
  verdadeiro.
- **Progresso:** em `progresso-118.md`.
- **Publicado:** num commit só, com este relato.
- **O que não mudou:** nenhuma bolsa e nenhum degrau. Mudou só a divisão da bolsa pelo grupo.

## 1 · O texto

`src/content/chapters/custo-servicos.md:99`:

- **antes:** "Compare com os pares do grupo, não com um trabalhador"
- **depois:** "Compare com personagens de Centelha parecida, não com um trabalhador"

O resto da frase ficou igual. No `dist/regras/custo-servicos/index.html` a frase nova está presente,
e "pares do grupo" não aparece mais em `dist/` nem em `src/`.

## 2 · A Parte por caçador

**A fórmula** (`src/lib/recompensa.ts:59-61`):

- `porCacador = Math.floor(bolsa / Math.max(1, e.grupo))`, para baixo, sem o `+ 0.5`;
- `sobra = bolsa - porCacador * Math.max(1, e.grupo)`, devolvida no objeto de retorno.

**A calculadora** (`src/components/CalculadoraRecompensa.astro:64-65` e `:74`) mostra a sobra só
quando ela é maior que zero:

- a linha do resultado: "Bolsa: 2.300 pc · Parte por caçador (grupo de 3): 766 pc (sobram 2 pc,
  divida como quiser)";
- a última linha do recibo: "Parte por caçador = 2.300 pc ÷ 3, para baixo = 766 pc (sobram 2 pc,
  divida como quiser)".

**Um desvio pequeno da redação sugerida:** o "(grupo de N)" saiu do fim da linha e foi para junto do
rótulo. Deixado no fim, a linha ficava com dois parênteses seguidos ("766 pc (sobram 2 pc, divida
como quiser) (grupo de 3)"). A frase da sobra é a do despacho.

**A linha 42** ("O grupo divide como quiser: se forem mais, cada um leva menos...") continua
consistente: a sobra é justamente o pedaço que o grupo divide como quiser. O capítulo não detalha a
fórmula da Parte por caçador em nenhum lugar, e não acrescentei prosa.

**A `_nota` do `recompensas.json`** ganhou uma frase curta, por `scripts/copiar-economia.mjs:57`, e
o arquivo foi regerado pelo fluxo: "A Parte por caçador é a bolsa ÷ o grupo, para baixo; a sobra o
grupo divide como quiser." Cabe na nota, e ela passa a descrever tudo o que a calculadora faz com o
arquivo.

## Os 3 testes e os 5 casos

Rodados pelo `test-recompensa.mjs` (17 asserções, no `validate`) e **na própria página**
(`../tmp/executora/t-calc118.mjs`, puppeteer sobre o `dist/`, lendo o texto que a página mostra):

| bolsa | grupo | Parte por caçador | sobra | a página mostra a sobra? |
|:---:|:---:|:---:|:---:|:---:|
| 2.300 | 3 | 766 | 2 | sim |
| 75 | 4 | 18 | 3 | sim |
| 1.500 | 3 | 500 | 0 | não |

| # | bolsa | grupo | antes (meio p/ cima) | depois (piso) | sobra |
|---|:---:|:---:|:---:|:---:|:---:|
| 1 | 1.500 | 3 | 500 | 500 | 0 |
| 2 | 2.300 | 3 | 767 | 766 | 2 |
| 3 | 630 | 3 | 210 | 210 | 0 |
| 4 | 680 | 3 | 227 | 226 | 2 |
| 5 | 75 | 3 | 25 | 25 | 0 |

Os casos 4 e 5 batem com o despacho: 680 = 226 × 3 + 2 e 75 = 25 × 3. Em toda linha, parte × grupo
+ sobra = bolsa, e o teste também confere isso. Nenhum erro de página.

## Verificação

`npm run validate` e `npm run build` verdes. Travessão: zero nas linhas acrescentadas.

## PRECISA DE MIM

Nada. A Leitora-novata não foi acionada, como pedido.

## QUEBROU

Nada.

## BLOQUEADO

Nada.
