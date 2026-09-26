# Rodada 118 · despacho · dois ajustes pequenos vindos da releitura ("pares do grupo" e o arredondamento da Parte por caçador)

> ## ▶ ESTE DESPACHO ESTÁ ABERTO desde 26/09/2026

Liberado pelo humano em 26/09/2026, depois do veredito PROCEDE da 117 (`117-revisora.md`, commit
`ef79409`). Dois ajustes pequenos, vindos do "tropeço leve" que a releitura da Leitora-novata
apontou na 117. Pino: `ef79409`.

## 0 · Onde

Mesma árvore/branch. `git status --short` vazio, `git fetch origin`, `git merge-base
--is-ancestor executora origin/main`, `git switch -C executora origin/main`. Saída temporária em
`../tmp/executora/`.

## 1 · Texto: "pares do grupo" → "Centelha parecida"

**Onde:** `src/content/chapters/custo-servicos.md:99` (confira o número na sua árvore), a frase
que a rodada 117 acrescentou. Troque:

- de: "Compare com os pares do grupo, não com um trabalhador"
- para: **"Compare com personagens de Centelha parecida, não com um trabalhador"**

O resto da frase (o exemplo do degrau 6 e o Livre da Nobreza) fica igual.

## 2 · "Parte por caçador": arredondar para baixo, com a sobra explícita

**O problema que isto resolve:** hoje `porCacador = bolsa ÷ grupo, meio para cima`
(`src/lib/recompensa.ts:57`), o que pode fazer a soma das partes passar da bolsa (ex.: bolsa 2.300,
grupo 3, três partes de 767 somam 2.301). O autor decidiu: **arredondar para baixo sempre**, e
**mostrar a sobra** quando houver.

1. **Fórmula nova:**
   - `Parte por caçador = piso(bolsa / tamanho do grupo)`
   - `Sobra = bolsa − Parte por caçador × tamanho do grupo`
2. **Onde mexer:**
   - `src/lib/recompensa.ts:57`: troque `Math.floor(bolsa / Math.max(1, e.grupo) + 0.5)` (meio para
     cima) por `Math.floor(bolsa / Math.max(1, e.grupo))` (para baixo, sem o `+ 0.5`). Acrescente
     `sobra = bolsa - porCacador * Math.max(1, e.grupo)` ao objeto de retorno (linha 58).
   - `src/components/CalculadoraRecompensa.astro`: nos dois lugares que mostram "Parte por
     caçador" (hoje `:64` e `:73`, confira), **mostre a sobra quando ela for maior que zero** (o
     despacho da 115 já tem a frase "o grupo divide como quiser", em
     `custo-servicos.md:42`; use uma redação parecida, ex. "Parte por caçador: X pc (sobram Y pc,
     divida como quiser)", só quando `sobra > 0`; quando `sobra === 0`, não mencione sobra).
3. **Texto do livro:** confira se `custo-servicos.md` explica em algum lugar a fórmula da Parte por
   caçador (hoje ela só aparece na calculadora, o capítulo não a detalha, pelo que vi na 115/117).
   Se não explicar, não é preciso acrescentar prosa nova só para isto (não é pedido do despacho);
   só confirme que a linha 42 ("o grupo divide como quiser") continua consistente com a sobra
   existir.
4. **A `_nota` de `recompensas.json`** (via `copiar-economia.mjs`, não editada à mão): ela não
   descreve hoje a fórmula da Parte por caçador. Se fizer sentido acrescentar uma frase curta sobre
   o arredondamento para baixo e a sobra, acrescente; se achar que não cabe no espaço de uma nota,
   diga por que deixou de fora.

**Os 3 testes obrigatórios** (confira contra a fórmula, todos batem por conta própria):

| bolsa | grupo | Parte por caçador | sobra |
|:---:|:---:|:---:|:---:|
| 2.300 | 3 | 766 | 2 |
| 75 | 4 | 18 | 3 |
| 1.500 | 3 | 500 | 0 |

**Os 5 casos da 115/117 mudam de "Parte por caçador"** (a bolsa não muda, só a divisão):

| # | bolsa | grupo | Parte por caçador (antes, meio p/ cima) | Parte por caçador (depois, piso) | sobra |
|---|:---:|:---:|:---:|:---:|:---:|
| 1 | 1.500 | 3 | 500 | 500 | 0 |
| 2 | 2.300 | 3 | 767 | **766** | **2** |
| 3 | 630 | 3 | 210 | 210 | 0 |
| 4 | 680 | 3 | 227 | **226** | **2** |
| 5 | 75 | 3 | 25 | 25 | 0 |

(Confira os casos 4 e 5 na sua árvore; contei à mão e podem ter uma casa de diferença, não force
o número daqui se a conta divergir, mostre a conta.)

## Verificação

- `npm run validate` e `npm run build` verdes.
- `test-recompensa.mjs` atualizado com a fórmula nova (piso, não meio para cima) e a sobra.
- Prova no `dist/`: a frase nova ("Centelha parecida") no capítulo; a calculadora mostrando a
  sobra nos casos 1, 2 e 4 desta rodada (bolsa 2.300/grupo 3 e bolsa 75/grupo 4), e SEM sobra no
  caso de bolsa 1.500/grupo 3.
- Travessão: zero nas linhas novas.

## O relato

Sem necessidade de acionar a Leitora-novata nesta rodada (pedido do autor). Pode entrar como
continuação de `117-executora.md` (uma seção "Rodada 118") ou um `118-executora.md` próprio: a
troca do item 1 (arquivo:linha, antes/depois), a tabela dos 3 testes e dos 5 casos recalculados.
