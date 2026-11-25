# Prova da trava (controle negativo)

Gerada por `node scripts/revisao/prova-trava.mjs` em 2026-11-15, base d760ef96, na árvore
`centelha-executora` (ramo revisao-textos, HEAD 385fd933). Cada caso muda UM arquivo, roda a trava só nele com um
contradicoes.md e um estado.md de teste e devolve o arquivo ao que era. Os avisos (linhas com · ou com "resolução:") não derrubam a trava.

**"Próximo", a definição testável dos pares termo e número:** cada número da seção se liga a um termo protegido, o mais perto
dele na mesma frase, medido em caracteres entre os dois (empate: o que vem antes). Se a frase não tem termo, ele se liga ao
último termo da frase anterior, na mesma seção (a frase que virou duas). O multiconjunto dos pares de cada seção tem de ser
igual antes e depois. Frase termina em . ! ? ; seguidos de espaço, em linha em branco e antes de linha de lista, tabela,
título ou tag; a quebra de linha simples do parágrafo não termina frase. Seção é o trecho entre dois títulos de qualquer
nível (no JSON, cada campo de prosa).

## A reescrita só de redação passa

### ✓ redação, sem número, dado, termo nem título (esperado: passa; exit 0)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: nenhuma

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ uma frase do JSON reescrita, só no campo de prosa (esperado: passa; exit 0)

Troca: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "RÁPIDA e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta."
Entrada: nenhuma

```
✓ src/data/armas.json
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ número mudado dentro de um bloco gerado (fica fora da comparação) (esperado: passa; exit 0)

Troca: "| Raça | Massa padrão | Força 0 | Força 1 | Força 2 | Força 3 | Força 4 | Força 5 | Força 6 |" → "| Raça | Massa padrão | Força 1 | Força 1 | Força 2 | Força 3 | Força 4 | Força 5 | Força 6 |"
Entrada: nenhuma

```
✓ src/content/chapters/acoes-corpo-e-movimento.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

## Sem entrada, falha

### ✓ número (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada, seção "O ataque: acertar e a Margem": saem 5 (−1); entram 6 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ dado (esperado: falha; exit 1)

Troca: "Ataque = [(Atributo + Habilidade) ÷ 2]d6" → "Ataque = [(Atributo + Habilidade) ÷ 2]d8"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada, seção "O ataque: acertar e a Margem": saem 6 (−1); entram 8 (+1)
    ✘ dado ou fórmula sem entrada, seção "O ataque: acertar e a Margem": saem d6 (−1); entram d8 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ termo protegido aparece novo (esperado: falha; exit 1)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ termo protegido aparece novo no arquivo: halterofilismo
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ termo protegido some do arquivo (as três Plumbata, sem diferenciar maiúsculas) (esperado: falha; exit 1)

Troca: "/plumbata/giu" → "pedra de mão"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ termo protegido some do arquivo: plumbata
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ título de seção (esperado: falha; exit 1)

Troca: "## O ataque: acertar e a Margem" → "## O ataque: como acertar e a Margem"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ títulos de seção mudaram (a partir do 7º): antes ["## O ataque: acertar e a Margem","### Rajada: golpes extras com a mesma arma","### Empunhadura dupla: um ataque por mão"], agora ["## O ataque: como acertar e a Margem","### Rajada: golpes extras com a mesma arma","### Empunhadura dupla: um ataque por mão"]
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ título de página .astro (<h2>) (esperado: falha; exit 1)

Troca: "<h2>Os Capítulos</h2>" → "<h2>Os Capítulos de novo</h2>"
Entrada: nenhuma

```
✘ src/pages/index.astro
    ✘ títulos de seção mudaram (a partir do 2º): antes ["h2: Os Capítulos","h2: Ferramentas"], agora ["h2: Os Capítulos de novo","h2: Ferramentas"]
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ número na prosa do JSON (esperado: falha; exit 1)

Troca: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "Rápida e precisa; perfura pele (N1), mas para em couro duro. Contra armadura, mira na fresta."
Entrada: nenhuma

```
✘ src/data/armas.json
    ✘ números sem entrada, seção "$[0].descricao": saem 0 (−1); entram 1 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ campo fora da prosa no JSON (esperado: falha; exit 1)

Troca: ""id": "" → ""id": "x-"
Entrada: nenhuma

```
✘ src/data/armas.json
    ✘ o JSON mudou fora dos campos de prosa (a lista CAMPOS_PROSA, no cabeçalho)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

## Com a entrada, passa

### ✓ número, com entrada (esperado: passa; exit 0)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ dado, com entrada (esperado: passa; exit 0)

Troca: "Ataque = [(Atributo + Habilidade) ÷ 2]d6" → "Ataque = [(Atributo + Habilidade) ÷ 2]d8"
Entrada: "Ataque = [(Atributo + Habilidade) ÷ 2]d6" → "Ataque = [(Atributo + Habilidade) ÷ 2]d8"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ termo novo, com entrada (esperado: passa; exit 0)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."
Entrada: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ título, com entrada (esperado: passa; exit 0)

Troca: "## O ataque: acertar e a Margem" → "## O ataque: como acertar e a Margem"
Entrada: "## O ataque: acertar e a Margem" → "## O ataque: como acertar e a Margem"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ número na prosa do JSON, com entrada (esperado: passa; exit 0)

Troca: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "Rápida e precisa; perfura pele (N1), mas para em couro duro. Contra armadura, mira na fresta."
Entrada: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "Rápida e precisa; perfura pele (N1), mas para em couro duro. Contra armadura, mira na fresta."

```
✓ src/data/armas.json
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

## Os termos comuns só avisam, e a linha de trava com vários trechos e (N×)

### ✓ termo comum aparece novo (milagre, da lista _comuns, ausente do arquivo na base): só aviso (esperado: passa; exit 0)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas e Técnicas, e role, sem esperar milagre."
Entrada: nenhuma

```
✓ src/content/chapters/combate.md
    - `src/content/chapters/combate.md` · "milagre" · 0 → 1 · termo comum aparece · resolução: 
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a linha de trava da RT-001, como está no contradicoes.md, com as duas trocas do combate.md feitas (esperado: passa; exit 0)

Troca: "Ticks de Preparação" → "Ticks de Preparo"; "penalidades da Preparação" → "penalidades do Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a linha de trava da RT-001 com o arquivo igual à base: passa, com aviso de entrada não aplicada (esperado: passa; exit 0)

Troca: 
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✓ src/content/chapters/combate.md
    · igual à base; entrada(s) ainda não aplicada(s): RT-900
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a linha de trava da RT-001 com o arquivo reescrito em outro ponto e sem a troca: falha (página reescrita, entrada não aplicada; regra de 15/11/2026) (esperado: falha; exit 1)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("Ticks de Preparação" segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("penalidades da Preparação" segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a linha de trava da RT-001 com só uma das duas trocas do combate.md: falha (a outra não aplicada, numa página reescrita) (esperado: falha; exit 1)

Troca: "Ticks de Preparação" → "Ticks de Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("penalidades da Preparação" segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ o "antes" da entrada saiu do arquivo sem o "depois" entrar ("Ticks de Preparação" vira "Ticks de Espera"): falha (esperado: falha; exit 1)

Troca: "Ticks de Preparação" → "Ticks de Espera"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "antes" saiu do arquivo (1 → 0 vez(es)), mas o "depois" da entrada não está nele: "Ticks de Preparo"
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("penalidades da Preparação" segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a entrada que apaga um trecho ("depois" vazio), com o trecho apagado: passa (esperado: passa; exit 0)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. " → ""
Entrada: - Trava: `src/content/chapters/combate.md`: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. " → ""

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a mesma entrada que apaga, ainda não aplicada, com outra mudança coberta no arquivo: falha (página reescrita) (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: - Trava: `src/content/chapters/combate.md`: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. " → ""; - Trava: `src/content/chapters/combate.md`: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. " segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a linha de trava da RT-001 no JSON das armas extras (esperado: passa; exit 0)

Troca: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✓ src/data/armas-extras.json
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

## O sinal do número, os ambíguos em minúscula, a posição por seção e os pares termo e número

### ✓ sinal trocado (Defesa −2 vira Defesa +2), sem entrada (esperado: falha; exit 1)

Troca: "penalidades da Preparação (Defesa −2" → "penalidades da Preparação (Defesa +2"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada, seção "Manobras: agarrar, derrubar, empurrar": saem -2 (−1); entram +2 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ sinal trocado, com entrada (esperado: passa; exit 0)

Troca: "penalidades da Preparação (Defesa −2" → "penalidades da Preparação (Defesa +2"
Entrada: "penalidades da Preparação (Defesa −2" → "penalidades da Preparação (Defesa +2"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ ambíguo em minúscula muda de contagem (o primeiro "tempo" fora de "linha do tempo" vira "momento"): só aviso (esperado: passa; exit 0)

Troca: "/(?<![\p{L}])(?<!do )tempo(?![\p{L}])/u" → "momento"
Entrada: nenhuma

```
✓ src/content/chapters/combate.md
    - `src/content/chapters/combate.md` · "tempo" · 31 → 30 · ambíguo em minúscula · resolução: 
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ trecho muda de seção sem linha no estado.md (o exemplo "Força 5 e Destreza 2" sai de "O ataque: acertar e a Margem" e vai para "Como uma luta acontece") (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(use a maior)"; "## Como uma luta acontece" → "## Como uma luta acontece

Exemplo: Força 5 e Destreza 2."
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada, seção "Como uma luta acontece": saem nenhum; entram 2 (+1), 5 (+1)
    ✘ números sem entrada, seção "O ataque: acertar e a Margem": saem 2 (−1), 5 (−1); entram nenhum
    - `src/content/chapters/combate.md` · "força" · 44 → 43 · termo, outra contagem · resolução: 
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ o mesmo trecho movido, com a linha em "Movimentos de seção" do estado.md (esperado: passa; exit 0)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(use a maior)"; "## Como uma luta acontece" → "## Como uma luta acontece

Exemplo: Força 5 e Destreza 2."
Entrada: nenhuma
Movimento no estado.md: - `src/content/chapters/combate.md`: "(Força 5 e Destreza 2? use a Força)" · de "O ataque: acertar e a Margem" → "Como uma luta acontece"

```
✓ src/content/chapters/combate.md
    - `src/content/chapters/combate.md` · "força" · 44 → 43 · termo, outra contagem · resolução: 
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a frase reordenada dentro dela mesma (no Cego, "Bloqueio −8 e Esquiva −4"): os pares ficam (esperado: passa; exit 0)

Troca: "(Esquiva −4 e Bloqueio −8 sabendo do ataque" → "(Bloqueio −8 e Esquiva −4 sabendo do ataque"
Entrada: nenhuma

```
✓ src/content/chapters/condicoes.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a frase que vira duas (Força 5. E Destreza 2): os pares ficam (esperado: passa; exit 0)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 5. E Destreza 2? use a Força)"
Entrada: nenhuma

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

## Os casos de burla: todos têm de falhar

### ✓ burla 1: número por extenso ("Força 5" vira "Força cinco") (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força cinco e Destreza 2? use a Força)"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada, seção "O ataque: acertar e a Margem": saem 5 (−1); entram cinco (5) (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ burla 2: "2 × menor(Centelha, Habilidade)" vira "menor(Centelha, Habilidade) × 2" (a primeira das duas) (esperado: falha; exit 1)

Troca: "/2 × menor\(Centelha, Habilidade\)/u" → "menor(Centelha, Habilidade) × 2"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ dado ou fórmula sem entrada, seção "O ataque: acertar e a Margem": saem 2×menor (−1); entram nenhum
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ burla 3: números trocados entre duas regras da mesma frase ("Defesa −2, e −4 no Tick do Golpe" vira "Defesa −4, e −2 no Tick do Golpe") (esperado: falha; exit 1)

Troca: "(Defesa −2, e −4 no Tick do Golpe)" → "(Defesa −4, e −2 no Tick do Golpe)"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ par termo e número desfeito, seção "Manobras: agarrar, derrubar, empurrar": saem defesa ↔ -2 (−1), tick do golpe ↔ -4 (−1); entram defesa ↔ -4 (+1), tick do golpe ↔ -2 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ burla 4: a troca do Cego na mesma frase ("Esquiva −4 e Bloqueio −8" vira "Esquiva −8 e Bloqueio −4") (esperado: falha; exit 1)

Troca: "(Esquiva −4 e Bloqueio −8 sabendo do ataque" → "(Esquiva −8 e Bloqueio −4 sabendo do ataque"
Entrada: nenhuma

```
✘ src/content/chapters/condicoes.md
    ✘ par termo e número desfeito, seção "Os sentidos": saem esquiva ↔ -4 (−1), bloqueio ↔ -8 (−1); entram esquiva ↔ -8 (+1), bloqueio ↔ -4 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ burla 4 no JSON: a mesma troca na nota do Cego em condicoes.json (esperado: falha; exit 1)

Troca: "Esquiva −4 e Bloqueio −8 sabendo" → "Esquiva −8 e Bloqueio −4 sabendo"
Entrada: nenhuma

```
✘ src/data/condicoes.json
    ✘ par termo e número desfeito, seção "$.lista[17].nota": saem esquiva ↔ -4 (−1), bloqueio ↔ -8 (−1); entram bloqueio ↔ -4 (+1), esquiva ↔ -8 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

## As linhas de tabela

### ✓ burla 5: duas colunas trocadas na mesma linha de tabela (Acerto e Defesa da Pesada, Cap. XIII) (esperado: falha; exit 1)

Troca: "| Pesada | 7 | 2d6 | +0 | −2 | 2 |" → "| Pesada | 7 | 2d6 | −2 | +0 | 2 |"
Entrada: nenhuma

```
✘ src/content/chapters/armas-e-armaduras.md
    ✘ linha de tabela mudou (colunas trocadas, número de célula ou cabeçalho), seção "Classes de Arma": saem linha: 7 | 2 6 2d6 | +0 | -2 | 2 (−1); entram linha: 7 | 2 6 2d6 | -2 | +0 | 2 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ as mesmas colunas trocadas, com entrada (esperado: passa; exit 0)

Troca: "| Pesada | 7 | 2d6 | +0 | −2 | 2 |" → "| Pesada | 7 | 2d6 | −2 | +0 | 2 |"
Entrada: "| Pesada | 7 | 2d6 | +0 | −2 | 2 |" → "| Pesada | 7 | 2d6 | −2 | +0 | 2 |"

```
✓ src/content/chapters/armas-e-armaduras.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a palavra de uma célula reescrita, sem número (a última célula da Pesada) (esperado: passa; exit 0)

Troca: "dano que vence armadura, mas lenta e te expõe, com guarda baixa" → "dano que vence armadura; lenta, te expõe e baixa a guarda"
Entrada: nenhuma

```
✓ src/content/chapters/armas-e-armaduras.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ o cabeçalho da tabela reescrito, sem entrada (esperado: falha; exit 1)

Troca: "| Classe | Velocidade | Dano | Acerto | Def. | Mãos | Estilo |" → "| Classe (classe) | Velocidade | Dano | Acerto | Def. | Mãos | Estilo |"
Entrada: nenhuma

```
✘ src/content/chapters/armas-e-armaduras.md
    ✘ linha de tabela mudou (colunas trocadas, número de célula ou cabeçalho), seção "Classes de Arma": saem cabeçalho: Classe | Velocidade | Dano | Acerto | Def. | Mãos | Estilo (−1); entram cabeçalho: Classe (classe) | Velocidade | Dano | Acerto | Def. | Mãos | Estilo (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ burla 5 no .astro: duas <td> com número trocadas numa <tr> de src/pages/configuracoes.astro (esperado: falha; exit 1)

Troca: "<tr><td>Espada longa</td><td>6</td><td>1d6</td><td>+1</td><td>+1</td><td>1</td></tr>" → "<tr><td>Espada longa</td><td>1d6</td><td>6</td><td>+1</td><td>+1</td><td>1</td></tr>"
Entrada: nenhuma

```
✘ src/pages/configuracoes.astro
    ✘ linha de tabela mudou (colunas trocadas, número de célula ou cabeçalho), seção "Largura máxima das tabelas": saem linha: 6 | 1 6 1d6 | +1 | +1 | 1 (−1); entram linha: 1 6 1d6 | 6 | +1 | +1 | 1 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

## A Trava JSON (campo fora da prosa)

### ✓ campo fora da prosa mudado (o peso da adaga, 0.3 → 0.4), sem entrada (esperado: falha; exit 1)

Troca: "/"peso": 0\.3,/u" → ""peso": 0.4,"
Entrada: nenhuma

```
✘ src/data/armas.json
    ✘ o JSON mudou fora dos campos de prosa (a lista CAMPOS_PROSA, no cabeçalho)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ o mesmo campo, com a linha Trava JSON @[0].peso: 0.3 → 0.4 (esperado: passa; exit 0)

Troca: "/"peso": 0\.3,/u" → ""peso": 0.4,"
Entrada: - Trava JSON: `src/data/armas.json` @[0].peso: 0.3 → 0.4

```
✓ src/data/armas.json
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a linha Trava JSON com o valor de antes errado (0.5) (esperado: falha; exit 1)

Troca: "/"peso": 0\.3,/u" → ""peso": 0.4,"
Entrada: - Trava JSON: `armas.json` @[0].peso: 0.5 → 0.4

```
✘ src/data/armas.json
    ✘ RT-900: Trava JSON @[0].peso: a base tem 0.3, agora há 0.4, e a linha diz 0.5 → 0.4
    ✘ o JSON mudou fora dos campos de prosa (a lista CAMPOS_PROSA, no cabeçalho)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a linha Trava JSON certa, e outro campo fora da prosa mudado junto (o id) (esperado: falha; exit 1)

Troca: "/"peso": 0\.3,/u" → ""peso": 0.4,"; ""id": "adaga"" → ""id": "adaga-x""
Entrada: - Trava JSON: `armas.json` @[0].peso: 0.3 → 0.4

```
✘ src/data/armas.json
    ✘ o JSON mudou fora dos campos de prosa (a lista CAMPOS_PROSA, no cabeçalho)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a linha Trava JSON com valor que não é JSON (esperado: falha; exit 1)

Troca: "/"peso": 0\.3,/u" → ""peso": 0.4,"
Entrada: - Trava JSON: `armas.json` @[0].peso: 0,3 → 0.4

```
    ✘ RT-900: a linha Trava JSON não tem valor JSON válido (Unexpected non-whitespace character after JSON at position 1 (line 1 column 2)): - Trava JSON: `armas.json` @[0].peso: 0,3 → 0.4
✘ src/data/armas.json
    ✘ o JSON mudou fora dos campos de prosa (a lista CAMPOS_PROSA, no cabeçalho)
✘ trava: 2 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a linha Trava JSON ainda não aplicada (o peso intacto), com o arquivo mudado só na prosa: passa, com aviso (esperado: passa; exit 0)

Troca: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "RÁPIDA e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta."
Entrada: - Trava JSON: `armas.json` @[0].peso: 0.3 → 0.4

```
✓ src/data/armas.json
    · RT-900: Trava JSON @[0].peso ainda não aplicada
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

## As entradas PENDENTE AUTOR são puladas

### ✓ entrada registrada cujo "antes" sai sem o "depois" entrar (controle: falha) (esperado: falha; exit 1)

Troca: "Ticks de Preparação" → "Ticks de Espera"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; - Status: registrada

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "antes" saiu do arquivo (1 → 0 vez(es)), mas o "depois" da entrada não está nele: "Ticks de Preparo"
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a mesma mudança, com a entrada em Status "PENDENTE AUTOR, D-053": pulada, nada é cobrado dela (esperado: passa; exit 0)

Troca: "Ticks de Preparação" → "Ticks de Espera"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; - Status: PENDENTE AUTOR, D-053

```
    · entrada(s) PENDENTE AUTOR (não se aplicam nesta revisão): RT-900; com linha Trava, puladas: RT-900
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a pendente pulada não cobre mudança: o número muda com a linha dela, e falha (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: - Trava: `src/content/chapters/combate.md`: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"; - Status: PENDENTE AUTOR (decisão contra decisão)

```
    · entrada(s) PENDENTE AUTOR (não se aplicam nesta revisão): RT-900; com linha Trava, puladas: RT-900
✘ src/content/chapters/combate.md
    ✘ números sem entrada, seção "O ataque: acertar e a Margem": saem 5 (−1); entram 6 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ Status "registrada (era PENDENTE AUTOR; resolvida pela T1)": a entrada NÃO é pulada, e o "antes" que sai sem o "depois" falha (esperado: falha; exit 1)

Troca: "Ticks de Preparação" → "Ticks de Espera"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; - Status: registrada (era PENDENTE AUTOR; resolvida pela T1, 15/11/2026), a aplicar na fase 2

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "antes" saiu do arquivo (1 → 0 vez(es)), mas o "depois" da entrada não está nele: "Ticks de Preparo"
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ o mesmo Status, com a troca feita: passa (esperado: passa; exit 0)

Troca: "Ticks de Preparação" → "Ticks de Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; - Status: registrada (era PENDENTE AUTOR; resolvida pela T1, 15/11/2026), a aplicar na fase 2

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ Status "**PENDENTE AUTOR**, D-053" (em negrito): pulada (esperado: passa; exit 0)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; - Status: **PENDENTE AUTOR**, D-053

```
    · entrada(s) PENDENTE AUTOR (não se aplicam nesta revisão): RT-900; com linha Trava, puladas: RT-900
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

## O pacote de 15/11/2026: página reescrita, trecho que encolhe, termos acrescentados, frase vazia, frontmatter, campos de prosa, quebra de linha no trecho e endereço de link

### ✓ (a) página reescrita em outro ponto, com a entrada da RT-035 ainda não aplicada: falha (esperado: falha; exit 1)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: - Trava: `src/content/chapters/combate.md`: "**Caído** (prono)" → "**Caído**"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("**Caído** (prono)" segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ (a) a mesma, com linha em "Entradas adiadas" do estado.md: passa, com aviso (esperado: passa; exit 0)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: - Trava: `src/content/chapters/combate.md`: "**Caído** (prono)" → "**Caído**"
No estado.md: - `src/content/chapters/combate.md` · RT-900 · caso de teste

```
    · entrada(s) adiada(s) no estado.md: RT-900 (`src/content/chapters/combate.md`: caso de teste)
✓ src/content/chapters/combate.md
    · RT-900: a entrada ainda não está aplicada neste arquivo ("**Caído** (prono)" segue 1 vez(es))
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (a) no src/data, a entrada não aplicada continua aviso (a prosa do JSON mudou em outro campo) (esperado: passa; exit 0)

Troca: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "RÁPIDA e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta."
Entrada: - Trava: `src/data/armas.json`: "couro duro" → "couro mole"

```
✓ src/data/armas.json
    · RT-900: a entrada ainda não está aplicada neste arquivo ("couro duro" segue 2 vez(es))
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (b) RT-035 aplicada ("**Caído** (prono)" vira "**Caído**"): passa (esperado: passa; exit 0)

Troca: "**Caído** (prono)" → "**Caído**"
Entrada: - Trava: `src/content/chapters/combate.md`: "**Caído** (prono)" → "**Caído**"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (b) RT-035 com o "(prono)" ainda no arquivo, e a página reescrita: falha (antes passava, porque o "depois" está dentro do "antes") (esperado: falha; exit 1)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: - Trava: `src/content/chapters/combate.md`: "**Caído** (prono)" → "**Caído**"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("**Caído** (prono)" segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ (c) termo protegido novo (Halterofilismo) com a linha em "Termos acrescentados": passa (esperado: passa; exit 0)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."
Entrada: nenhuma
No estado.md: - `src/content/chapters/combate.md` · "Halterofilismo" · original: "aplique Firulas e Técnicas, e role." · novo: "aplique Firulas, Técnicas e Halterofilismo, e role." · definido em: `src/content/chapters/habilidades-secundarias.md` (Corpo)

```
✓ src/content/chapters/combate.md
    · termo acrescentado (linha em "Termos acrescentados" do estado.md): halterofilismo
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (c) a linha com outro arquivo não vale: falha (esperado: falha; exit 1)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."
Entrada: nenhuma
No estado.md: - `src/content/chapters/atributos.md` · "Halterofilismo" · original: "x" · novo: "y" · definido em: `x`

```
✘ src/content/chapters/combate.md
    ✘ termo protegido aparece novo no arquivo: halterofilismo
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ (d) a frase partida em parágrafos ("O terceiro é ... : 1 ponto"), que antes desfazia o par: passa (esperado: passa; exit 0)

Troca: "entre as três reservas. O terceiro é" → "entre as três reservas.

O terceiro é"
Entrada: nenhuma

```
✓ src/content/chapters/aparencia-virtudes-vontade.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (d) e o par trocado continua falhando (burla 4, de novo, depois do conserto) (esperado: falha; exit 1)

Troca: "(Esquiva −4 e Bloqueio −8 sabendo do ataque" → "(Esquiva −8 e Bloqueio −4 sabendo do ataque"
Entrada: nenhuma

```
✘ src/content/chapters/condicoes.md
    ✘ par termo e número desfeito, seção "Os sentidos": saem esquiva ↔ -4 (−1), bloqueio ↔ -8 (−1); entram esquiva ↔ -8 (+1), bloqueio ↔ -4 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ (e) frontmatter mudado (o resumo), sem entrada: falha (esperado: falha; exit 1)

Troca: "resumo: "Como uma luta funciona:" → "resumo: "Como funciona uma luta:"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ o frontmatter mudou: antes "---\nordem: 15\nnumeral: \"IX\"\ntitulo: \"Combate Físico\"\nresumo: \"Como uma luta funciona: a linha do tempo, o ataque, o dano, a defesa, o movimento, a vantagem táti", agora "---\nordem: 15\nnumeral: \"IX\"\ntitulo: \"Combate Físico\"\nresumo: \"Como funciona uma luta: a linha do tempo, o ataque, o dano, a defesa, o movimento, a vantagem táti"
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ (e) o mesmo, com entrada: passa (esperado: passa; exit 0)

Troca: "resumo: "Como uma luta funciona:" → "resumo: "Como funciona uma luta:"
Entrada: "resumo: "Como uma luta funciona:" → "resumo: "Como funciona uma luta:"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (f) o campo amarra reescrito sem número nem termo novo: passa (antes era estrutural e falhava) (esperado: passa; exit 0)

Troca: "um **desconto nos passos que separam do " → "Um **desconto nos passos que separam do "
Entrada: nenhuma

```
✓ src/data/antecedentes.json
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (f) e um número mudado dentro dele continua falhando (esperado: falha; exit 1)

Troca: "/(Neutro\*\* na Régua de Relação, no contexto em que a fama pesa \(ver \\"Onde a régua já começa\\"\): a metade do nível do traço \(para baixo\))/u" → "$1 +1"
Entrada: nenhuma

```
✘ src/data/antecedentes.json
    ✘ números sem entrada, seção "$[6].amarra": saem nenhum; entram +1 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ (g) duas linhas de tabela com "\n" no trecho da entrada: passa (esperado: passa; exit 0)

Troca: "| 30 | Sobre-humano | 18 | Semideus |" → "| 30 | Sobre-humano | 18 | Semideus |
| 35 | Lendário | 21 | além do teto do jogador |"
Entrada: - Trava: `src/content/chapters/acoes-e-sistema.md`: "| 30 | Sobre-humano | 18 | Semideus |" → "| 30 | Sobre-humano | 18 | Semideus |\n| 35 | Lendário | 21 | além do teto do jogador |"

```
✓ src/content/chapters/acoes-e-sistema.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (g) as mesmas linhas sem entrada: falha (esperado: falha; exit 1)

Troca: "| 30 | Sobre-humano | 18 | Semideus |" → "| 30 | Sobre-humano | 18 | Semideus |
| 35 | Lendário | 21 | além do teto do jogador |"
Entrada: nenhuma

```
✘ src/content/chapters/acoes-e-sistema.md
    ✘ números sem entrada, seção "De onde sai a Dificuldade": saem nenhum; entram 35 (+1), 21 (+1)
    ✘ linha de tabela mudou (colunas trocadas, número de célula ou cabeçalho), seção "De onde sai a Dificuldade": saem nenhum; entram linha: 35 | 21 (+1)
    - `src/content/chapters/acoes-e-sistema.md` · "teto" · 2 → 3 · termo comum, outra contagem · resolução: 
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ (h) link novo para /regras/aparencia-virtudes-vontade (o "virtudes" do endereço não conta como termo): passa (esperado: passa; exit 0)

Troca: "Comece pela régua; as outras duas são escaladas dela." → "Comece pela régua; as outras duas são escaladas dela ([Cap. III](/regras/aparencia-virtudes-vontade))."
Entrada: nenhuma

```
✓ src/content/chapters/relacoes-sociais.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (h) e o mesmo termo no texto do link falha (esperado: falha; exit 1)

Troca: "Comece pela régua; as outras duas são escaladas dela." → "Comece pela régua; as outras duas são escaladas dela ([as Virtudes](/regras/x))."
Entrada: nenhuma

```
✘ src/content/chapters/relacoes-sociais.md
    ✘ termo protegido aparece novo no arquivo: virtudes
    ✘ par termo e número desfeito, seção "(antes do primeiro título)": saem (nenhum) ↔ duas (2) (−1); entram virtudes ↔ duas (2) (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

## O CORRIGE da Revisora no f003b69b: comando-barra, o trecho que cresce, as exceções, o par pela frase anterior e o número do endereço

### ✓ o "exemplo" do comando-barra.json mudado sem número ("tirar" vira "retirar"): falha (é sintaxe da barra do Grid, fora da prosa) (esperado: falha; exit 1)

Troca: ""exemplo": "tirar"" → ""exemplo": "retirar""
Entrada: nenhuma

```
✘ src/data/comando-barra.json
    ✘ o JSON mudou fora dos campos de prosa (a lista CAMPOS_PROSA, no cabeçalho)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ (b) RT-101 no condicoes.md, o trecho que cresce, aplicada: passa (esperado: passa; exit 0)

Troca: "O Frenesi do orc e do meio-orc segue a regra própria." → "O Frenesi do orc e do meio-orc e a Técnica Fúria do Caminho Sangue Fervente seguem a regra própria de cada um."
Entrada: - Trava: `src/content/chapters/condicoes.md`: "O Frenesi do orc e do meio-orc segue a regra própria." → "O Frenesi do orc e do meio-orc e a Técnica Fúria do Caminho Sangue Fervente seguem a regra própria de cada um."

```
✓ src/content/chapters/condicoes.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ (b) RT-101 não aplicada, com a página reescrita em outro ponto: falha (esperado: falha; exit 1)

Troca: "diz o que a faz entrar" → "diz o que a faz começar"
Entrada: - Trava: `src/content/chapters/condicoes.md`: "O Frenesi do orc e do meio-orc segue a regra própria." → "O Frenesi do orc e do meio-orc e a Técnica Fúria do Caminho Sangue Fervente seguem a regra própria de cada um."

```
✘ src/content/chapters/condicoes.md
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("O Frenesi do orc e do meio-orc segue a regra própria." segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ Entradas adiadas: a linha sem motivo não vale (a entrada segue não aplicada e a rodada cai) (esperado: falha; exit 1)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: - Trava: `src/content/chapters/combate.md`: "**Caído** (prono)" → "**Caído**"
No estado.md: - `src/content/chapters/combate.md` · RT-900

```
    ✘ estado.md, Entradas adiadas: a linha da RT-900 em `src/content/chapters/combate.md` não tem motivo; ela não vale
✘ src/content/chapters/combate.md
    ✘ RT-900: a entrada ainda não está aplicada neste arquivo ("**Caído** (prono)" segue 1 vez(es)) (página reescrita: toda entrada do arquivo entra no commit dela)
✘ trava: 2 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ Entradas adiadas: a adiada cuja entrada já está aplicada passa, com aviso para tirar a linha (esperado: passa; exit 0)

Troca: "**Caído** (prono)" → "**Caído**"
Entrada: - Trava: `src/content/chapters/combate.md`: "**Caído** (prono)" → "**Caído**"
No estado.md: - `src/content/chapters/combate.md` · RT-900 · caso de teste

```
    · entrada(s) adiada(s) no estado.md: RT-900 (`src/content/chapters/combate.md`: caso de teste)
✓ src/content/chapters/combate.md
    · RT-900: está em "Entradas adiadas" do estado.md, e a entrada já está aplicada neste arquivo (tire a linha)
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ Entradas adiadas: a adiada sem entrada no arquivo passa, com aviso (esperado: passa; exit 0)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: nenhuma
No estado.md: - `src/content/chapters/combate.md` · RT-901 · caso de teste

```
    · entrada(s) adiada(s) no estado.md: RT-901 (`src/content/chapters/combate.md`: caso de teste)
✓ src/content/chapters/combate.md
    · RT-901: está em "Entradas adiadas" do estado.md para este arquivo, mas não tem entrada nele
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ Termos acrescentados: a linha sem "definido em" não vale (falha) (esperado: falha; exit 1)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."
Entrada: nenhuma
No estado.md: - `src/content/chapters/combate.md` · "Halterofilismo" · original: "aplique Firulas e Técnicas, e role." · novo: "aplique Firulas, Técnicas e Halterofilismo, e role."

```
    ✘ estado.md, Termos acrescentados: a linha do termo "Halterofilismo" em `src/content/chapters/combate.md` não diz onde ele é definido ("definido em:"); ela não vale
✘ src/content/chapters/combate.md
    ✘ termo protegido aparece novo no arquivo: halterofilismo
✘ trava: 2 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ par que só troca "(nenhum)" pelo termo da frase anterior ("Ele é lento" vira "O Sangramento é lento", em parágrafo próprio): passa, com aviso (esperado: passa; exit 0)

Troca: "desalinhados. Ele é lento de propósito:" → "desalinhados.

O Sangramento é lento de propósito:"
Entrada: nenhuma

```
✓ src/content/chapters/vida-ferimentos-cura.md
    - `src/content/chapters/vida-ferimentos-cura.md` · "sangramento" · 9 → 10 · termo, outra contagem · resolução: 
    · par termo e número desfeito, seção "Sangramento e Estabilização": saem (nenhum) ↔ duas (2) (−1); entram sangramento ↔ duas (2) (+1) (só entre "(nenhum)" e o termo da frase anterior: a leitura da frase partida, e não par desfeito)
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ par achado pela frase anterior que passa do termo A ao termo B (o +1 do quadro sai do Humano e vai ao Elfo): falha (esperado: falha; exit 1)

Troca: "o **Humano** é a régua contra a qual todos os outros são descritos." → "o **Elfo** é a régua contra a qual todos os outros são descritos."
Entrada: nenhuma

```
✘ src/content/chapters/racas.md
    ✘ par termo e número desfeito, seção "(antes do primeiro título)": saem Humano ↔ +1 (−1), Humano ↔ duas (2) (−2); entram Elfo ↔ +1 (+1), Elfo ↔ duas (2) (+2)
    - `src/content/chapters/racas.md` · "Humano" · 10 → 9 · termo, outra contagem · resolução: 
    - `src/content/chapters/racas.md` · "Elfo" · 16 → 17 · termo, outra contagem · resolução: 
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ link novo com número no endereço (âncora "#parte-3"): passa (o endereço sai de toda contagem) (esperado: passa; exit 0)

Troca: "Comece pela régua; as outras duas são escaladas dela." → "Comece pela régua; as outras duas são escaladas dela ([Cap. III](/regras/aparencia-virtudes-vontade#parte-3))."
Entrada: nenhuma

```
✓ src/content/chapters/relacoes-sociais.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ e o mesmo número no texto do link falha (esperado: falha; exit 1)

Troca: "Comece pela régua; as outras duas são escaladas dela." → "Comece pela régua; as outras duas são escaladas dela ([parte 3](/regras/x))."
Entrada: nenhuma

```
✘ src/content/chapters/relacoes-sociais.md
    ✘ números sem entrada, seção "(antes do primeiro título)": saem nenhum; entram 3 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

## A entrada que não casa falha

### ✓ entrada que pede (3×) num trecho que está 2 vezes (esperado: falha; exit 1)

Troca: "/Preparação/gu" → "Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Preparação" → "Preparo" (3×)

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "antes" da entrada está 2 vez(es) no arquivo da base, e a entrada pede 3: "Preparação" (e o "depois" já está no arquivo)
    - `src/content/chapters/combate.md` · "preparo" · 50 → 52 · termo, outra contagem · resolução: 
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ entrada com "antes" que não está na base (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: "(Força 7 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "antes" da entrada está 0 vez(es) no arquivo da base, e a entrada pede 1: "(Força 7 e Destreza 2? use a Força)" (e o "depois" já está no arquivo)
    ✘ números sem entrada, seção "O ataque: acertar e a Margem": saem 5 (−1); entram 6 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ entrada certa, mas com outra mudança fora dela (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"; "Ataque = [(Atributo + Habilidade) ÷ 2]d6" → "Ataque = [(Atributo + Habilidade) ÷ 2]d8"
Entrada: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada, seção "O ataque: acertar e a Margem": saem 6 (−1); entram 8 (+1)
    ✘ dado ou fórmula sem entrada, seção "O ataque: acertar e a Margem": saem d6 (−1); entram d8 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

## Resultado

85 de 85 casos deram o esperado. Árvore depois da prova: limpa em src/ (git status --porcelain -- src vazio).

## Os campos de prosa (CAMPOS_PROSA)

descricao, texto, definicao, efeito, nota, tracos (os de antes) e, desde 15/11/2026, amarra, justificativa, limiteDeUso,
conduta, serve, exemplo, notas, _nota, porque, resumo, detalhe, excecao e centelhaNota (o "exemplo" do comando-barra.json fica fora: é a sintaxe da barra do Grid). Ficam fora: id, nome, os rótulos
curtos de nível, as chaves, todo campo de número ou enumeração, e o "valor" (misto). Nenhum dos campos novos guarda
número, objeto ou enumeração nos src/data/*.json de hoje (contagem por campo: textos e outros tipos):

```
amarra: 14 texto, 0 outro
justificativa: 527 texto, 0 outro
limiteDeUso: 947 texto, 0 outro
conduta: 24 texto, 0 outro
serve: 13 texto, 0 outro
exemplo: 25 texto, 0 outro
notas: 12 texto, 0 outro
_nota: 9 texto, 0 outro
porque: 12 texto, 0 outro
resumo: 12 texto, 0 outro
detalhe: 4 texto, 0 outro
excecao: 3 texto, 0 outro
centelhaNota: 4 texto, 0 outro
```

## Os 449 arquivos com texto

A trava rodada nos 449 arquivos com texto (`git ls-files src/content src/pages src/components 'src/data/*.json'`): 449 passam, 0 falham.

```
trava · base d760ef96 · 449 arquivo(s) · 82 entrada(s) de trava e 17 Trava JSON em ..\tmp\revisao-textos\contradicoes.md · 0 movimento(s) de seção em ..\tmp\revisao-textos\estado.md

✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

## Falso positivo numa reescrita neutra (`node scripts/revisao/prova-reflow.mjs`)

Os capítulos da BASE com as linhas de cada parágrafo juntadas numa só (o frontmatter não se junta), e a trava sobre eles com o contradicoes.md e o estado.md vazios:

```
capítulos com linhas juntadas: 5 de 28; trava exit 0
passam 28, falham 0, avisos 0
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
árvore depois: limpa
```
