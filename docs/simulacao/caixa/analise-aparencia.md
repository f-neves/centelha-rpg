# Análise: recalibrar a régua de Aparência

Encomendada pelo team-lead em 18/09/2026. Só números, nenhuma decisão de design.
Não implementa nada em `src/`.

Fontes usadas:

- `src/data/regras.json:331-419` (`escalaAparencia`, bloco `aparencia`, `xp.aparencia`).
- `src/data/regras.json:551-614` (`xp.atributo`, `xp.habilidadePrimaria`,
  `xp.especialidadePrimaria`, `xp.especialidadeSecundaria`, `xp.vontade`, `xp.aparencia`).
- `scripts/cost-examples.mjs:70-123` (Kael, Sora, Veil: orçamento total e Aparência publicada).

## 0. A fórmula em uso

`xp.aparencia` e `xp.vontade` são `tipo: "acum"`, `base: 0`, `mult: 2`, `piso: 0`
(`regras.json:601-614`). Isso significa: o ponto de nível `n` custa `mult × n`, e o
custo para chegar do piso até o nível `L` é a soma de 1 até `L`:

```
custo(L) = mult × (1 + 2 + ... + L) = mult × L × (L+1) / 2
```

Para `mult = 2` isso simplifica para `custo(L) = L × (L+1)`, o que bate com os três
exemplos publicados: Kael compra Aparência nível 4 por 20 XP (`4×5=20`), Sora nível 5
por 30 XP (`5×6=30`), Veil nível 4 por 20 XP (`4×5=20`). A régua espelho, Vontade,
confere do mesmo jeito: Kael compra Vontade 7 por 56 XP (`7×8=56`).

A régua proposta (−6 a +6, 0 = Comum de graça) usa a mesma forma, mas contando os
passos `N` a partir do zero central, não do nível absoluto:

```
custo(N) = mult × N × (N+1) / 2
```

## 1. Comparação das duas réguas

### Sistema atual (0 a 12, `mult = 2`, piso no nível 0)

| Nível | Modificador | Custo acumulado |
|---|---|---|
| 0 | −5 (Monstruoso) | 0 (piso, grátis) |
| 1 | −4 (Deformado) | 2 |
| 2 | −3 (Repulsivo) | 6 |
| 3 | −2 (Muito feio) | 12 |
| 4 | −1 (Feio) | 20 |
| 5 | 0 (Comum) | 30 |
| 6 | 0 (Comum) | 42 |
| 7 | 0 (Comum, situacional) | 56 |
| 8 | +1 (Bonito) | 72 |
| 9 | +2 (Beleza) | 90 |
| 10 | +3 (Beleza universal) | 110 |
| 11 | +4 (Extraordinário) | 132 |
| 12 | +5 (Ápice) | 156 |

O extremo negativo (−5) custa 0 XP porque é o piso: ninguém escolhe chegar lá, todo
mundo COMEÇA lá se não gastar nada. O extremo positivo (+5) custa 156 XP.

### Sistema proposto (−6 a +6, piso no meio, `N` = passos a partir de 0)

| Passos (N) | Modificador | Custo `mult=2` | Custo `mult=6` | Custo `mult=8` |
|---|---|---|---|---|
| 0 | 0 (Comum) | 0 | 0 | 0 |
| 1 | ±1 | 2 | 6 | 8 |
| 2 | ±2 | 6 | 18 | 24 |
| 3 | ±3 | 12 | 36 | 48 |
| 4 | ±4 | 20 | 60 | 80 |
| 5 | ±5 | 30 | 90 | 120 |
| 6 | ±6 | 42 | 126 | 168 |

Aqui o cálculo assume que subir e descer do zero custam o mesmo XP (mesma fórmula
nos dois sentidos, por simetria). Se o desenho final tratar o lado negativo como algo
que não se compra (uma escolha narrativa sem custo, do jeito que o piso de hoje já é
grátis), o custo de chegar em −6 cai para 0 em qualquer `mult`. Isso não está decidido
aqui, é o ponto 4.

### Os extremos lado a lado

| | Sistema atual | Novo, mult 2 | Novo, mult 6 | Novo, mult 8 |
|---|---|---|---|---|
| Custo do extremo alto (+5 ou +6) | 156 | 42 | 126 | 168 |
| Custo do extremo baixo (−5 ou −6) | 0 (piso) | 0 ou 42* | 0 ou 126* | 0 ou 168* |

\* depende de o lado negativo custar XP (simétrico) ou ser de graça (piso), ver ponto 4.

## 2. Níveis "mortos" (modificador 0)

- **Hoje:** níveis 5, 6 e 7 dão modificador 0 (o 7 é 0 com bônus situacional a
  critério do Mestre, não um bônus incondicional). São **3 de 13 níveis**, 23,1%.
- **Proposto:** só o nível 0 dá modificador 0. É **1 de 13 níveis**, 7,7%.

Comparando com a granularidade de outras réguas do sistema:

- **Atributos** (`regras.json:551-556`): piso 1, e cada ponto entra direto na
  fórmula de dados. Não existe nível comprado sem efeito: **0% morto**.
- **Régua de Relação** (`relacoes-sociais.md`): o Neutro é largo, mas essa largura é
  sobre **ritmo** (quantos pontos de ato ou conversa movem 1 passo), não sobre
  níveis comprados com XP que ficam sem efeito. Não é a mesma grandeza: não há XP
  gasto para "ficar" ou "sair" do Neutro, então comparar diretamente com níveis
  mortos de um traço pago induziria a erro.

Conclusão numérica: ter vários níveis mortos em sequência (3 de 13) é uma exceção da
Aparência de hoje frente ao padrão do sistema (Atributos: zero); a régua proposta
reduz para 1 de 13, aproximando do padrão sem eliminar, porque o próprio piso, por
definição, é sempre o nível sem efeito comprado.

## 3. Onde a Aparência deveria custar

### Âncoras já calibradas

| Âncora | Custo | Fonte |
|---|---|---|
| Especialidade Secundária nível 3 | 24 XP | `regras.json:587-592` (6+8+10) |
| Custo de raça, piso | 20 XP | faixa citada no pedido (20 a 50) |
| Especialidade Primária nível 3 | 48 XP | `regras.json:579-585` (12+16+20), escopo NOMEADO estreito |
| Custo de raça, teto | 50 XP | faixa citada no pedido (20 a 50) |
| Força de Vontade, 0 a 7 | 56 XP | mesma trilha da Aparência, `custo(7) = 7×8` |
| Aparência, teto de hoje (nível 12) | 156 XP | tabela do ponto 1 |

### Fração do orçamento gasta em Aparência hoje, nos três exemplos publicados

| Personagem | Orçamento total | Aparência comprada | XP | Fração |
|---|---|---|---|---|
| Kael (iniciante) | 1230 | nível 4 (−1, Feio) | 20 | 1,63% |
| Sora (veterana) | 1643 | nível 5 (0, Comum) | 30 | 1,83% |
| Veil (especialista) | 2104 | nível 4 (−1, Feio) | 20 | 0,95% |
| **Média** | | | | **1,47%** |

### Projeção: fração do MESMO orçamento para chegar ao modificador máximo (+6) em cada multiplicador

| Multiplicador | Custo do +6 | Kael (1230) | Sora (1643) | Veil (2104) | Média |
|---|---|---|---|---|---|
| ×2 | 42 | 3,41% | 2,56% | 2,00% | 2,66% |
| ×6 | 126 | 10,24% | 7,67% | 5,99% | 7,97% |
| ×8 | 168 | 13,66% | 10,23% | 7,98% | 10,62% |
| (referência: teto de hoje) | 156 | 12,68% | 9,50% | 7,42% | 9,86% |

### Onde cada multiplicador cai frente às âncoras

Resolvendo `custo(6) = mult × 21` igual a cada âncora, o multiplicador de corte é:

| Âncora | XP da âncora | Multiplicador de corte (`âncora ÷ 21`) |
|---|---|---|
| Especialidade Secundária nível 3 | 24 | 1,14 |
| Custo de raça, piso | 20 | 0,95 |
| Especialidade Primária nível 3 | 48 | 2,29 |
| Custo de raça, teto | 50 | 2,38 |
| Força de Vontade máxima | 56 | 2,67 |
| 3% do orçamento da Sora (veterana) | 49,3 | 2,35 |
| 5% do orçamento da Sora (veterana) | 82,2 | 3,91 |
| Teto de hoje (mesmo peso que o sistema atual) | 156 | 7,43 |

Lendo a tabela: **`mult=2`** deixa o modificador máximo custando perto de uma
Especialidade Primária de nível 3 ou do teto de custo de raça (42 XP contra 48 e 50),
abaixo da banda de 3 a 5% do orçamento de um veterano citada no pedido. **`mult=6`**
custa 126 XP, entre 2,25× e 2,6× essas âncoras isoladas, e fica em 81% do peso que o
sistema atual dá ao próprio teto (156 XP). **`mult=8`** custa 168 XP, ultrapassando o
teto de hoje (156 XP): é o único dos três que deixa o modificador máximo MAIS caro do
que já é hoje, não mais barato.

## 4. Efeito colateral a registrar, sem resolver

Com piso 0 = Comum, a Aparência deixa de ter "piso = pior caso" como a Força de
Vontade tem hoje. Na Vontade, o piso (nível 0) é o pior estado funcional, e todo
investimento é para sair dele. Na Aparência proposta, o piso já É o estado neutro
"de graça", e qualquer investimento (para qualquer lado) parte de um ponto que já
não é um problema. Descer abaixo do piso (modificador negativo) deixa de ser "o que
o personagem ainda não comprou" e passa a ser uma escolha ativa de desvantagem, sem
que este documento defina se ela custa XP, devolve XP, ou é puramente narrativa. Essa
diferença estrutural fica registrada aqui, não decidida.
