# Prova da trava (controle negativo)

Gerada por `node scripts/revisao/prova-trava.mjs` em 2026-11-12, base d760ef96, na árvore
`centelha-executora` (ramo revisao-textos, HEAD 5c3dec25). Cada caso muda UM arquivo, roda a trava só nele com um
contradicoes.md de teste e devolve o arquivo ao que era. Os avisos (linhas com ·) não derrubam a trava.

## A reescrita só de redação passa

### ✓ redação, sem número, dado, termo nem título (esperado: passa; exit 0)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: nenhuma

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ uma frase do JSON reescrita, só no campo de prosa (esperado: passa; exit 0)

Troca: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "RÁPIDA e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta."
Entrada: nenhuma

```
✓ src/data/armas.json
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ número mudado dentro de um bloco gerado (fica fora da comparação) (esperado: passa; exit 0)

Troca: "| Raça | Massa padrão | Força 0 | Força 1 | Força 2 | Força 3 | Força 4 | Força 5 | Força 6 |" → "| Raça | Massa padrão | Força 1 | Força 1 | Força 2 | Força 3 | Força 4 | Força 5 | Força 6 |"
Entrada: nenhuma

```
✓ src/content/chapters/acoes-corpo-e-movimento.md
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

## Sem entrada, falha

### ✓ número (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada: saem 5 (−1); entram 6 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ dado (esperado: falha; exit 1)

Troca: "Ataque = [(Atributo + Habilidade) ÷ 2]d6" → "Ataque = [(Atributo + Habilidade) ÷ 2]d8"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada: saem 6 (−1); entram 8 (+1)
    ✘ dado ou fórmula sem entrada: saem d6 (−1); entram d8 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ termo protegido aparece novo (esperado: falha; exit 1)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ termo protegido aparece novo no arquivo: halterofilismo
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ termo protegido some do arquivo (as três Plumbata, sem diferenciar maiúsculas) (esperado: falha; exit 1)

Troca: "/plumbata/giu" → "pedra de mão"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ termo protegido some do arquivo: plumbata
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ título de seção (esperado: falha; exit 1)

Troca: "## O ataque: acertar e a Margem" → "## O ataque: como acertar e a Margem"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ títulos de seção mudaram (a partir do 7º): antes ["## O ataque: acertar e a Margem","### Rajada: golpes extras com a mesma arma","### Empunhadura dupla: um ataque por mão"], agora ["## O ataque: como acertar e a Margem","### Rajada: golpes extras com a mesma arma","### Empunhadura dupla: um ataque por mão"]
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ título de página .astro (<h2>) (esperado: falha; exit 1)

Troca: "<h2>Os Capítulos</h2>" → "<h2>Os Capítulos de novo</h2>"
Entrada: nenhuma

```
✘ src/pages/index.astro
    ✘ títulos de seção mudaram (a partir do 2º): antes ["h2: Os Capítulos","h2: Ferramentas"], agora ["h2: Os Capítulos de novo","h2: Ferramentas"]
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ número na prosa do JSON (esperado: falha; exit 1)

Troca: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "Rápida e precisa; perfura pele (N1), mas para em couro duro. Contra armadura, mira na fresta."
Entrada: nenhuma

```
✘ src/data/armas.json
    ✘ números sem entrada: saem 0 (−1); entram 1 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ campo fora da prosa no JSON (esperado: falha; exit 1)

Troca: ""id": "" → ""id": "x-"
Entrada: nenhuma

```
✘ src/data/armas.json
    ✘ o JSON mudou fora dos campos de prosa (descricao, texto, definicao, efeito, nota, tracos, niveis[].texto)
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

## Com a entrada, passa

### ✓ número, com entrada (esperado: passa; exit 0)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ dado, com entrada (esperado: passa; exit 0)

Troca: "Ataque = [(Atributo + Habilidade) ÷ 2]d6" → "Ataque = [(Atributo + Habilidade) ÷ 2]d8"
Entrada: "Ataque = [(Atributo + Habilidade) ÷ 2]d6" → "Ataque = [(Atributo + Habilidade) ÷ 2]d8"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ termo novo, com entrada (esperado: passa; exit 0)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."
Entrada: "aplique Firulas e Técnicas, e role." → "aplique Firulas, Técnicas e Halterofilismo, e role."

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ título, com entrada (esperado: passa; exit 0)

Troca: "## O ataque: acertar e a Margem" → "## O ataque: como acertar e a Margem"
Entrada: "## O ataque: acertar e a Margem" → "## O ataque: como acertar e a Margem"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ número na prosa do JSON, com entrada (esperado: passa; exit 0)

Troca: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "Rápida e precisa; perfura pele (N1), mas para em couro duro. Contra armadura, mira na fresta."
Entrada: "Rápida e precisa; perfura pele (N0), mas para em couro duro. Contra armadura, mira na fresta." → "Rápida e precisa; perfura pele (N1), mas para em couro duro. Contra armadura, mira na fresta."

```
✓ src/data/armas.json
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

## Os termos comuns só avisam, e a linha de trava com vários trechos e (N×)

### ✓ termo comum aparece novo (milagre, da lista _comuns, ausente do arquivo na base): só aviso (esperado: passa; exit 0)

Troca: "aplique Firulas e Técnicas, e role." → "aplique Firulas e Técnicas, e role, sem esperar milagre."
Entrada: nenhuma

```
✓ src/content/chapters/combate.md
    - `src/content/chapters/combate.md` · "milagre" · 0 → 1 · termo comum aparece · resolução: 
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ a linha de trava da RT-001, como está no contradicoes.md, com as duas trocas do combate.md feitas (esperado: passa; exit 0)

Troca: "Ticks de Preparação" → "Ticks de Preparo"; "penalidades da Preparação" → "penalidades do Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "+2 na Preparação" → "+2 no Preparo"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ a linha de trava da RT-001 com o arquivo igual à base: passa, com aviso de entrada não aplicada (esperado: passa; exit 0)

Troca: 
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "+2 na Preparação" → "+2 no Preparo"

```
✓ src/content/chapters/combate.md
    · igual à base; entrada(s) ainda não aplicada(s): RT-900
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ a linha de trava da RT-001 com o arquivo reescrito em outro ponto e sem a troca: falha (o "depois" não está) (esperado: falha; exit 1)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "+2 na Preparação" → "+2 no Preparo"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "depois" da entrada não está no arquivo de agora: "Ticks de Preparo"
    ✘ RT-900: o "depois" da entrada não está no arquivo de agora: "penalidades do Preparo"
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ a linha de trava da RT-001 com só uma das duas trocas do combate.md: falha (esperado: falha; exit 1)

Troca: "Ticks de Preparação" → "Ticks de Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "+2 na Preparação" → "+2 no Preparo"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "depois" da entrada não está no arquivo de agora: "penalidades do Preparo"
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ a linha de trava da RT-001 no JSON das armas extras (esperado: passa; exit 0)

Troca: "+2 na Preparação" → "+2 no Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "+2 na Preparação" → "+2 no Preparo"

```
✓ src/data/armas-extras.json
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

## O sinal do número, os ambíguos em minúscula e o número que muda de seção

### ✓ sinal trocado (Defesa −2 vira Defesa +2), sem entrada (esperado: falha; exit 1)

Troca: "penalidades da Preparação (Defesa −2" → "penalidades da Preparação (Defesa +2"
Entrada: nenhuma

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada: saem -2 (−1); entram +2 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ sinal trocado, com entrada (esperado: passa; exit 0)

Troca: "penalidades da Preparação (Defesa −2" → "penalidades da Preparação (Defesa +2"
Entrada: "penalidades da Preparação (Defesa −2" → "penalidades da Preparação (Defesa +2"

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ ambíguo em minúscula muda de contagem (o primeiro "tempo" fora de "linha do tempo" vira "momento"): só aviso (esperado: passa; exit 0)

Troca: "/(?<![\p{L}])(?<!do )tempo(?![\p{L}])/u" → "momento"
Entrada: nenhuma

```
✓ src/content/chapters/combate.md
    - `src/content/chapters/combate.md` · "tempo" · 32 → 31 · ambíguo em minúscula · resolução: 
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

### ✓ número muda de seção (o exemplo "Força 5 e Destreza 2" sai de "O ataque: acertar e a Margem" e vai para "Como uma luta acontece"): só aviso (esperado: passa; exit 0)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(use a maior)"; "## Como uma luta acontece" → "## Como uma luta acontece

Exemplo: Força 5 e Destreza 2."
Entrada: nenhuma

```
✓ src/content/chapters/combate.md
    - `src/content/chapters/combate.md` · "força" · 44 → 43 · termo, outra contagem · resolução: 
    - `src/content/chapters/combate.md` · número mudou de seção · ## Como uma luta acontece · saem nenhum; entram 2 (+1), 5 (+1) · resolução: 
    - `src/content/chapters/combate.md` · número mudou de seção · ## O ataque: acertar e a Margem · saem 2 (−1), 5 (−1); entram nenhum · resolução: 
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```

## A entrada que não casa falha

### ✓ entrada que pede (3×) num trecho que está 2 vezes (esperado: falha; exit 1)

Troca: "/Preparação/gu" → "Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Preparação" → "Preparo" (3×)

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "antes" da entrada está 2 vez(es) no arquivo da base, e a entrada pede 3: "Preparação"
    - `src/content/chapters/combate.md` · "preparo" · 50 → 52 · termo, outra contagem · resolução: 
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ entrada com "antes" que não está na base (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: "(Força 7 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "antes" da entrada está 0 vez(es) no arquivo da base, e a entrada pede 1: "(Força 7 e Destreza 2? use a Força)"
    ✘ números sem entrada: saem 5 (−1); entram 6 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

### ✓ entrada certa, mas com outra mudança fora dela (esperado: falha; exit 1)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"; "Ataque = [(Atributo + Habilidade) ÷ 2]d6" → "Ataque = [(Atributo + Habilidade) ÷ 2]d8"
Entrada: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"

```
✘ src/content/chapters/combate.md
    ✘ números sem entrada: saem 6 (−1); entram 8 (+1)
    ✘ dado ou fórmula sem entrada: saem d6 (−1); entram d8 (+1)
✘ trava: 1 arquivo(s) com diferença de número, dado, termo ou título sem entrada no contradicoes.md
```

## Resultado

29 de 29 casos deram o esperado. Árvore depois da prova: limpa em src/ (git status --porcelain -- src vazio).

## Sem falso positivo nos arquivos de hoje

A trava rodada nos 449 arquivos com texto (`git ls-files src/content src/pages src/components 'src/data/*.json'`), todos iguais à base: 449 passam, 0 falham, e nenhum aviso de sinal, de ambíguo em minúscula nem de número que muda de seção. Os únicos avisos são das entradas da RT-001, registrada e ainda não aplicada:

```
trava · base d760ef96 · 449 arquivo(s) · 3 entrada(s) de trava em ..\tmp\revisao-textos\contradicoes.md
    · igual à base; entrada(s) ainda não aplicada(s): RT-001
    · igual à base; entrada(s) ainda não aplicada(s): RT-001
✓ trava: toda diferença de número, dado, termo e título tem entrada no contradicoes.md
```
