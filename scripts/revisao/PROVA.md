# Prova da trava (controle negativo)

Gerada por `node scripts/revisao/prova-trava.mjs` em 2026-11-15, base d760ef96, na árvore
`centelha-executora` (ramo revisao-textos, HEAD 92b2b170). Cada caso muda UM arquivo, roda a trava só nele com um
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
    ✘ o JSON mudou fora dos campos de prosa (descricao, texto, definicao, efeito, nota, tracos, niveis[].texto)
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

### ✓ a linha de trava da RT-001 com o arquivo reescrito em outro ponto e sem a troca: passa, com aviso de entrada não aplicada (a página não fica barrada pela entrada que ainda não aplicou) (esperado: passa; exit 0)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role." → "Na hora de atacar, junte o pool de **Atributo + Habilidade**, acrescente o **Acerto da Arma**, aplique Firulas e Técnicas e role."
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✓ src/content/chapters/combate.md
    · RT-900: a entrada ainda não está aplicada neste arquivo ("Ticks de Preparação" segue 1 vez(es))
    · RT-900: a entrada ainda não está aplicada neste arquivo ("penalidades da Preparação" segue 1 vez(es))
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a linha de trava da RT-001 com só uma das duas trocas do combate.md: passa, com aviso da outra (esperado: passa; exit 0)

Troca: "Ticks de Preparação" → "Ticks de Preparo"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✓ src/content/chapters/combate.md
    · RT-900: a entrada ainda não está aplicada neste arquivo ("penalidades da Preparação" segue 1 vez(es))
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ o "antes" da entrada saiu do arquivo sem o "depois" entrar ("Ticks de Preparação" vira "Ticks de Espera"): falha (esperado: falha; exit 1)

Troca: "Ticks de Preparação" → "Ticks de Espera"
Entrada: - Trava: `src/content/chapters/combate.md`: "Ticks de Preparação" → "Ticks de Preparo"; `src/content/chapters/combate.md`: "penalidades da Preparação" → "penalidades do Preparo"; `src/data/armas-extras.json`: "aceito pelo +2 na Preparação" → "aceito pelo +2 no Preparo"

```
✘ src/content/chapters/combate.md
    ✘ RT-900: o "antes" saiu do arquivo (1 → 0 vez(es)), mas o "depois" da entrada não está nele: "Ticks de Preparo"
    · RT-900: a entrada ainda não está aplicada neste arquivo ("penalidades da Preparação" segue 1 vez(es))
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a entrada que apaga um trecho ("depois" vazio), com o trecho apagado: passa (esperado: passa; exit 0)

Troca: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. " → ""
Entrada: - Trava: `src/content/chapters/combate.md`: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. " → ""

```
✓ src/content/chapters/combate.md
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

### ✓ a mesma entrada que apaga, ainda não aplicada, com outra mudança coberta no arquivo: passa, com aviso (esperado: passa; exit 0)

Troca: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"
Entrada: - Trava: `src/content/chapters/combate.md`: "Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. " → ""; - Trava: `src/content/chapters/combate.md`: "(Força 5 e Destreza 2? use a Força)" → "(Força 6 e Destreza 2? use a Força)"

```
✓ src/content/chapters/combate.md
    · RT-900: a entrada ainda não está aplicada neste arquivo ("Para atacar, monte o pool de **Atributo + Habilidade**, some o **Acerto da Arma**, aplique Firulas e Técnicas, e role. " segue 1 vez(es))
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
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
    - `src/content/chapters/combate.md` · "tempo" · 32 → 31 · ambíguo em minúscula · resolução: 
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
    ✘ o JSON mudou fora dos campos de prosa (descricao, texto, definicao, efeito, nota, tracos, niveis[].texto)
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
    ✘ o JSON mudou fora dos campos de prosa (descricao, texto, definicao, efeito, nota, tracos, niveis[].texto)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a linha Trava JSON certa, e outro campo fora da prosa mudado junto (o id) (esperado: falha; exit 1)

Troca: "/"peso": 0\.3,/u" → ""peso": 0.4,"; ""id": "adaga"" → ""id": "adaga-x""
Entrada: - Trava JSON: `armas.json` @[0].peso: 0.3 → 0.4

```
✘ src/data/armas.json
    ✘ o JSON mudou fora dos campos de prosa (descricao, texto, definicao, efeito, nota, tracos, niveis[].texto)
✘ trava: 1 arquivo(s) com diferença de número, dado, par termo-número, termo ou título sem entrada
```

### ✓ a linha Trava JSON com valor que não é JSON (esperado: falha; exit 1)

Troca: "/"peso": 0\.3,/u" → ""peso": 0.4,"
Entrada: - Trava JSON: `armas.json` @[0].peso: 0,3 → 0.4

```
    ✘ RT-900: a linha Trava JSON não tem valor JSON válido (Unexpected non-whitespace character after JSON at position 1 (line 1 column 2)): - Trava JSON: `armas.json` @[0].peso: 0,3 → 0.4
✘ src/data/armas.json
    ✘ o JSON mudou fora dos campos de prosa (descricao, texto, definicao, efeito, nota, tracos, niveis[].texto)
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

57 de 57 casos deram o esperado. Árvore depois da prova: limpa em src/ (git status --porcelain -- src vazio).

## Os 449 arquivos de hoje

A trava rodada nos 449 arquivos com texto (`git ls-files src/content src/pages src/components 'src/data/*.json'`): 449 passam, 0 falham. Os arquivos iguais à base passam direto; os que o ramo já reescreveu passam pelas entradas do contradicoes.md e pelos movimentos do estado.md de hoje. Os avisos são de entradas do contradicoes.md ainda não aplicadas e dos termos das páginas já reescritas (resolvidos no estado.md):

```
trava · base d760ef96 · 449 arquivo(s) · 85 entrada(s) de trava e 5 Trava JSON em ..\tmp\revisao-textos\contradicoes.md · 0 movimento(s) de seção em ..\tmp\revisao-textos\estado.md
    · entrada(s) PENDENTE AUTOR (não se aplicam nesta revisão): RT-003, RT-004, RT-005, RT-061, RT-083, RT-090, RT-091; com linha Trava, puladas: RT-003, RT-004, RT-061
    · igual à base; entrada(s) ainda não aplicada(s): RT-058
    · igual à base; entrada(s) ainda não aplicada(s): RT-022, RT-034, RT-035
    · igual à base; entrada(s) ainda não aplicada(s): RT-027, RT-033
    · igual à base; entrada(s) ainda não aplicada(s): RT-021
    · igual à base; entrada(s) ainda não aplicada(s): RT-009, RT-088, RT-089
    - `src/content/chapters/aparencia-virtudes-vontade.md` · "piso" · 4 → 5 · termo comum, outra contagem · resolução: 
    · igual à base; entrada(s) ainda não aplicada(s): RT-017, RT-039, RT-040, RT-102
    · "um"/"uma" mudaram de contagem (artigo, só aviso): um (+1)
    - `src/content/chapters/atributos.md` · "centelha" · 5 → 6 · termo, outra contagem · resolução: 
    - `src/content/chapters/atributos.md` · "golpe" · 4 → 5 · termo comum, outra contagem · resolução: 
    - `src/content/chapters/atributos.md` · "humano" · 3 → 5 · ambíguo em minúscula · resolução: 
    - `src/content/chapters/atributos.md` · "bestiário" · 0 → 2 · ambíguo em minúscula · resolução: 
    - `src/content/chapters/atributos.md` · "natureza" · 0 → 1 · ambíguo em minúscula · resolução: 
    · igual à base; entrada(s) ainda não aplicada(s): RT-001, RT-017, RT-035, RT-046, RT-049, RT-060, RT-067
    · igual à base; entrada(s) ainda não aplicada(s): RT-098, RT-099, RT-101
    · "um"/"uma" mudaram de contagem (artigo, só aviso): um (+2), uma (+1)
    - `src/content/chapters/coracao-do-sistema.md` · "centelha" · 13 → 19 · termo, outra contagem · resolução: 
    - `src/content/chapters/coracao-do-sistema.md` · "dificuldade" · 13 → 15 · termo, outra contagem · resolução: 
    - `src/content/chapters/coracao-do-sistema.md` · "especialidade" · 4 → 5 · termo, outra contagem · resolução: 
    - `src/content/chapters/coracao-do-sistema.md` · "direta" · 1 → 3 · termo comum, outra contagem · resolução: 
    - `src/content/chapters/coracao-do-sistema.md` · "história" · 0 → 1 · ambíguo em minúscula · resolução: 
    · igual à base; entrada(s) ainda não aplicada(s): RT-011
    · igual à base; entrada(s) ainda não aplicada(s): RT-044, RT-046
    - `src/content/chapters/habilidades.md` · "centelha" · 1 → 4 · termo, outra contagem · resolução: 
    - `src/content/chapters/habilidades.md` · "inteira" · 3 → 4 · termo comum, outra contagem · resolução: 
    · igual à base; entrada(s) ainda não aplicada(s): RT-100
    · igual à base; entrada(s) ainda não aplicada(s): RT-019
    · igual à base; entrada(s) ainda não aplicada(s): RT-084, RT-092, RT-097
    · "um"/"uma" mudaram de contagem (artigo, só aviso): um (+2), uma (+1)
    - `src/content/chapters/vida-ferimentos-cura.md` · "cura" · 31 → 32 · termo, outra contagem · resolução: 
    - `src/content/chapters/vida-ferimentos-cura.md` · "sangramento" · 9 → 10 · termo, outra contagem · resolução: 
    · igual à base; entrada(s) ainda não aplicada(s): RT-085, RT-087
    · igual à base; entrada(s) ainda não aplicada(s): RT-001
    · igual à base; entrada(s) ainda não aplicada(s): RT-062, RT-068
    · igual à base; entrada(s) ainda não aplicada(s): RT-028, RT-029, RT-030, RT-065, RT-101
    · igual à base; entrada(s) ainda não aplicada(s): RT-064, RT-070, RT-071
    · igual à base; entrada(s) ainda não aplicada(s): RT-014
    - `src/data/habilidades-secundarias.json` · "noite" · 6 → 8 · ambíguo em minúscula · resolução: 
    - `src/data/habilidades-secundarias.json` · "meditação" · 0 → 1 · ambíguo em minúscula · resolução: 
    - `src/data/habilidades.json` · "tempo" · 6 → 7 · ambíguo em minúscula · resolução: 
    · igual à base; entrada(s) ainda não aplicada(s): RT-006, RT-010, RT-023, RT-055, RT-057, RT-063, RT-077, RT-080, RT-060
    · igual à base; entrada(s) ainda não aplicada(s): RT-020, RT-072, RT-073
    · igual à base; entrada(s) ainda não aplicada(s): RT-082
    · igual à base; entrada(s) ainda não aplicada(s): RT-079, RT-081
    · igual à base; entrada(s) ainda não aplicada(s): RT-036, RT-047
    · igual à base; entrada(s) ainda não aplicada(s): RT-075
    · igual à base; entrada(s) ainda não aplicada(s): RT-017
    · igual à base; entrada(s) ainda não aplicada(s): RT-074
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
```

## Falso positivo numa reescrita neutra (`node scripts/revisao/prova-reflow.mjs`)

Os 28 capítulos com as linhas de cada parágrafo juntadas numa só, o que muda toda seção que tem parágrafo quebrado em várias linhas e faz a trava comparar essas seções: números, dados, pares termo-número e linhas de tabela, além dos termos e títulos do arquivo. É um teste de leitura (a frase, a seção, o par, a linha), e não de reescrita de verdade: o ruído real só aparece na primeira página reescrita. Com o contradicoes.md e o estado.md vazios:

```
capítulos com linhas juntadas: 28 de 28; trava exit 0
passam 28, falham 0, avisos 0
✓ trava: toda diferença de número, dado, par termo-número, termo e título tem entrada
árvore depois: limpa
```
