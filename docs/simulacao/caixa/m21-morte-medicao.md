# `M-21` · o limite da morte abaixo de zero · MEDIÇÃO

Rodada 74, pela Executora. **Números, e não recomendação de regra.** A escolha entre metade e um
quarto volta para a mesa. Nenhum capítulo foi tocado nesta rodada.

Reproduzir: `node scripts/sim-morte.mjs`. O laço de combate é o do `sim-grupo.mjs`, IMPORTADO e
não recopiado.

## O cenário, e por que ele

Três combatentes de Centelha 2 contra um chefe de Centelha 3, maximizados, 6000 batalhas por
célula. **O grupo e não o duelo**, porque a pergunta é sobre alguém ser socorrido ou rematado, e
isso precisa de mais de dois no tabuleiro.

O combatente do grupo tem **PV 43**, então os dois limites são **PV ÷ 4 = 10** e **PV ÷ 2 = 21**.

**E o `combo` do chefe é o que decide se alguém cai.** No `combo+0` o grupo ganha 100% das vezes e
sai inteiro: medir só ali daria zero caídos e zero informação. Por isso a medição corre nos
quatro, e a coluna "caem por batalha" diz qual linha é uma briga de verdade.

O golpe do chefe, medido pelo mesmo caminho do combate:

| combo | acerta | o golpe que acerta tira (mediana / média) |
|---|---:|---|
| +0 | 56% | 2 / 2,1 |
| +2 | 94% | **7 / 6,9** |
| +3 | 98% | 13 / 12,2 |

> **A tua referência bate com a minha, e o `combo+2` é onde ela pousa.** Você calculou 7,5 por
> golpe mediano de arma de mão com Força 4; o chefe de `combo+2` tira 7. A diferença de escala
> está no PV: o teu exemplo era um personagem de Vigor 3 (PV 17) e o do simulador é uma build
> maximizada (PV 43). **A razão é o que importa, e ela é a mesma:** um quarto do PV é pouco mais
> de um golpe, metade são cerca de três.

## Tabela 1 · o chefe REMATA quem caiu

| limite | combo | caem/batalha | morrem | Ticks de margem (mediana / média) |
|---|---|---:|---:|---|
| 0 (hoje) | +1 | 0,09 | **100%** | 0 / 0 |
| 0 (hoje) | +2 | 1,37 | **100%** | 0 / 0 |
| 0 (hoje) | +3 | 2,87 | **100%** | 0 / 0 |
| PV ÷ 4 = 10 | +1 | 0,09 | 52% | 10 / 10,9 |
| PV ÷ 4 = 10 | +2 | 1,23 | 87% | **5** / 5,7 |
| PV ÷ 4 = 10 | +3 | 2,78 | 79% | **5** / 3,1 |
| PV ÷ 2 = 21 | +1 | 0,08 | 21% | 20 / 19,9 |
| PV ÷ 2 = 21 | +2 | 1,11 | 82% | **10** / 11,8 |
| PV ÷ 2 = 21 | +3 | 2,68 | 70% | **5** / 7,1 |

## Tabela 2 · o chefe IGNORA quem caiu

| limite | combo | caem/batalha | morrem | Ticks de margem |
|---|---|---:|---:|---|
| 0 (hoje) | +2 | 1,38 | **100%** | 0 |
| 0 (hoje) | +3 | 2,88 | **100%** | 0 |
| PV ÷ 4 = 10 | +2 | 1,38 | **14%** | 0 |
| PV ÷ 4 = 10 | +3 | 2,86 | **35%** | 0 |
| PV ÷ 2 = 21 | +2 | 1,40 | **0%** | 0 |
| PV ÷ 2 = 21 | +3 | 2,87 | **2%** | 0 |

**A margem de 0 Tick nesta tabela não é erro, e é o achado que eu não esperava:** quem morre com o
chefe ignorando os caídos morre **no mesmo golpe que o derrubou**, porque uma pancada grande
atravessa o zero e o limite de uma vez. Não é uma morte que alguém pudesse ter evitado correndo:
não houve intervalo nenhum.

## A resposta à pergunta do socorro

O custo de socorrer, pelas réguas publicadas. Deslocamento de Batalha do socorrista: **4 m por
Tick** (Destreza 7, Atletismo 0), e o primeiro Tick de movimento é de graça durante a ação.

| distância | Ticks de deslocamento | + ação de 3 / 4 / 5 Ticks |
|---|---:|---|
| até 4 m | 0 | **3 / 4 / 5** |
| 8 m | 1 | 4 / 5 / 6 |
| 12 m | 2 | 5 / 6 / 7 |

> A Velocidade de "estabilizar" é a **única suposição** desta seção: a tabela de Velocidade do
> capítulo dá **4 Ticks** à faixa utilitária, e por isso a coluna mostra 3 e 5 ao lado. Se a mesa
> decidir outra coisa, a conta anda junto.

**E a margem, contra esse custo:**

| limite | rematado | ignorado | morrem (rematado / ignorado) |
|---|---|---|---|
| 0 (hoje) | margem nenhuma: cair É morrer | idem | 100% / 100% |
| PV ÷ 4, combo +2 | **5 Ticks** | 0 | 87% / 13% |
| PV ÷ 4, combo +3 | **5 Ticks** | 0 | 79% / 34% |
| PV ÷ 2, combo +2 | **10 Ticks** | 0 | 82% / 0% |
| PV ÷ 2, combo +3 | **5 Ticks** | 0 | 70% / 2% |

**Lido contra o custo de 4 Ticks:**

- **com limite 0 a cena não existe**, e isso é o que o capítulo já promete e o jogo já não entrega;
- **com PV ÷ 4 a cena existe, e é apertada**: 5 Ticks de margem contra 4 de socorro dá **um Tick de
  folga**, e só se o socorrista já estiver a até 4 metros. A 8 metros o socorro custa 5 e empata
  com a margem; a 12, chega tarde. E se a ação de estabilizar custar 5 em vez de 4, ela empata já
  no corpo a corpo;
- **com PV ÷ 2 a cena existe com folga no `combo+2`** (10 contra 4), **e some no `combo+3`**, onde
  a margem cai para 5 pela mesma razão do parágrafo anterior: o golpe de 13 come o dobro da
  margem por vez.

## O que a medição NÃO diz

- **Ela não modela o socorrista de verdade.** O simulador não tem ação de estabilizar: o número
  de Ticks do socorro sai das réguas publicadas, não de uma batalha simulada. O que está medido é
  a MARGEM; o custo é aritmética.
- **Ela não modela o Sangramento.** Um caído que sangra perde mais 1 a cada 6 Ticks, e isso come
  a margem por fora. Com PV ÷ 4 e 5 Ticks de margem, um único tique de sangue a consome quase
  toda. **Isto puxa a conta para o lado do limite maior**, e não foi medido porque o
  `sim-grupo` não tem condição contínua.
- **Ela mede uma build maximizada.** Um personagem comum tem menos PV, e um quarto do PV dele é
  um número menor ainda.

## O que eu mudei nos simuladores, e a prova de que não mexi nos números

`scripts/sim-grupo.mjs`:

1. o `combate()` ganhou `limiteMorte` (padrão **0**), `chefeRemata` (padrão **true**) e `diario`
   (padrão **null**). Com o padrão, caído e morto são a mesma coisa e o laço se comporta como
   antes;
2. `maxDuelista`, `pvMax`, `combate` e `golpe` passaram a ser exportados;
3. o relatório de balanço passou a rodar só quando o arquivo É o programa, para o `sim-morte` poder
   importar o laço sem disparar quatro segundos de relatório.

**O CONTROLE NEGATIVO.** Escrevi um invólucro que semeia o `Math.random` **antes** de importar o
alvo e finge ser ele em `argv[1]`, sem tocar no arquivo. Rodei o `sim-grupo.mjs` com a mesma
semente **antes** de qualquer mudança e **depois de todas elas**, e a saída é idêntica **byte por
byte** (`diff` vazio). O relatório de balanço não mudou nem de forma nem de número.
