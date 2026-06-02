# Equipamentos — Armas & Armaduras (v0.1 / proposta)

> Companion do documento principal (Capítulo de Combate). Sistema de **Classes + Tags**: cada arma é uma classe-base recombinada com tags. Foco no pilar "a arma define o estilo, não a potência bruta". 🔧 = ajustável.

---

## A. Anatomia de uma arma

Toda arma tem:
- **Speed** (Ticks) — quanto tempo o ataque custa no relógio de combate.
- **Dano** (Dado da Arma) — 1d6 / 2d6 / 3d6.
- **Acerto da Arma** — bônus fixo somado à rolagem de ataque.
- **Defesa da Arma** — bônus (ou penalidade) ao **Bloqueio**.
- **Mãos** — 1 ou 2 (1 mão soma ½ Força ao dano; 2 mãos somam a Força inteira).
- **Faixa de Quase Acerto** — peso da arma (leve 1 / média 2 / pesada 3).
- **Tipo de dano** e **Tags** (ver abaixo).

---

## B. Classes de Arma

| Classe | Speed | Dano | Acerto | Def. Arma | Mãos | Faixa | Estilo |
|---|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **Leve** | 5 | 1d6 | +2 | +1 | 1 | 1 | tempo, precisão e defesa; age muitas vezes e habilita Técnicas ágeis |
| **Média** | 6 | 2d6 | +1 | +1 | 1* | 2 | equilíbrio sem fraquezas |
| **Pesada** | 7 | 3d6 | +0 | −1 | 2 | 3 | dano que vence armadura — mas lenta e te expõe |
| **Haste** | 6 | 2d6 | +1 | +2 | 2 | 2 | alcance: controla a distância e defende muito; sofre em combate colado |
| **Distância** | 6 | 1d6–3d6 | +1 | — | 2 | — | domina antes do contato; quase inútil colado, depende de munição |

\* Médias costumam ser *Versáteis* (1 ou 2 mãos).

> Repare no estilo embutido nos números: a **leve** age (Speed 5) e defende (+1) muito, mas bate fraco; a **pesada** bate triplo, mas é lenta (Speed 7), imprecisa (+0) e baixa a guarda (−1). A **haste** troca o corpo-a-corpo por alcance e defesa.

---

## C. Tags

- **Crush** — ignora **todo** o Soak de armadura (conta só o Soak natural). A resposta às placas.
- **Alcance** — ataca a uma casa de distância; bônus contra quem se aproxima e contra montaria; penalidade em combate colado.
- **Ágil** — pode usar **Destreza** no lugar de Força para o dano; +1 na Defesa da Arma.
- **Perfurante (Pen 1–3)** — Penetração contra a Proteção da armadura. Se **Pen ≤ Proteção**, o dano perfurante é **anulado**.
- **Versátil** — 1 ou 2 mãos (em 2 mãos: +1 dado de dano, −1 na Defesa da Arma).
- **Arremessável** — pode ser lançada (vira um ataque à distância curto).
- **Munição** — disparos gastam munição; recarregar pode custar Ticks (bestas).
- **Pesada** (tag) — usa Força total; −1 em ações ágeis e furtivas.

---

## D. Armas de Exemplo

| Arma | Construção | Dano | Destaque |
|---|---|:---:|---|
| Adaga | Leve · Ágil · Perfurante 2 · Arremessável | 1d6 | rápida, precisa, perfura leve |
| Espada Curta | Leve | 1d6 | veloz e defensiva |
| Espada Longa | Média · Versátil | 2d6 | a clássica adaptável |
| Machado | Média | 2d6 | corte pesado (Faixa alta) |
| Maça | Média · **Crush** | 2d6 | abre armaduras |
| Picareta de Guerra | Média · Perfurante 3 | 2d6 | fura malha e placa |
| Lança | Haste · Perfurante 2 | 2d6 | alcance + estocada |
| Alabarda | Haste · **Crush** · Pesada | 2d6 | alcance e impacto, lenta |
| Montante | Pesada | 3d6 | espadão de duas mãos |
| Martelo de Guerra | Pesada · **Crush** | 3d6 | esmaga placas |
| Arco | Distância 2d6 · Munição · Perfurante 2 | 2d6 | precisão à distância |
| Besta Pesada | Distância 3d6 · Munição · Perfurante 3 · recarga lenta | 3d6 | fura quase tudo |

---

## E. Armaduras

A armadura soma **Soak** (contra Impacto e Corte) e dá **Proteção** (o nível que a Penetração precisa vencer). Mas peso se paga:

| Armadura | Soak (Imp/Corte) | Proteção (Perf) | Esquiva | Lentidão | Furtiv. / Técnicas |
|---|:---:|:---:|:---:|---|---|
| **Nenhuma** | 0 | 0 | — | — | — |
| **Leve** (couro) | +2 | 1 | −0 | — | −0 |
| **Média** (malha) | +4 | 2 | −1 | −1 Iniciativa | −2 Furtividade |
| **Pesada** (placas) | +6 | 3 | −2 | +1 Tick nas ações · −3 Iniciativa | −4 Furtividade; **bloqueia Técnicas ágeis** (dashes, acrobacias) |

> A escolha que você queria: a **placa** te transforma num tanque, mas te deixa **mais fácil de acertar** (Esquiva −2), **mais lento** (age menos no relógio) e **barulhento/desajeitado** — e desliga os estilos ágeis e furtivos. A **leve** mal protege, mas mantém você veloz, evasivo e silencioso. Armadura não reduz o **Bloqueio**: o guerreiro blindado troca esquivar por aparar.

---

## F. Escudos *(ocupam uma mão)*

| Escudo | Def. da Arma (Bloqueio) | Notas |
|---|:---:|---|
| **Broquel** | +1 | leve; apara e bloqueia projéteis pequenos |
| **Escudo** | +2 | bloqueia projéteis; o padrão |
| **Pavês** | +3 | parede móvel; −1 em ataques, pesado |

---

## G. A Interação Arma × Armadura

Dano médio que conecta (atacante Força 3, defensor Vigor 3, margem 0):

| Arma ↓ \ Armadura → | Nenhuma | Leve | Média | Pesada |
|---|:---:|:---:|:---:|:---:|
| Espada média (corte) | 7 | 5 | 3 | **1** |
| Arma pesada (corte) | 12 | 10 | 8 | 6 |
| Lança (perfurante Pen 2) | 9 | 7 | **0** | **0** |
| Maça (Crush) | 5 | 5 | 5 | **5** |

**Como derrotar cada armadura:**
- **Sem armadura** → qualquer coisa a dilacera; perfurantes e cortes brilham.
- **Leve/Média** → perfurantes de Pen alta, dano pesado, ou Crush.
- **Pesada (placas)** → **Crush** (maças, martelos) que ignora a armadura, **dano pesado** que a sobrepuja, ou **explorar a lentidão**: ataque muitas vezes, use agilidade e cerque-o (a Esquiva baixa e a lentidão são a sua brecha). Lanças e flechas **ricocheteiam**.

> É isto que mata o "pegar a arma/armadura mais forte": cada combinação vence umas situações e perde outras. O cavaleiro de placas é quase intocável por estocadas, mas um camponês com um malho (Crush) ainda o amassa — e três deles o derrubam pela lentidão.

---

## H. Pendências
| # | Item | Status |
|---|---|---|
| 1 | Tabela de preços/disponibilidade (economia) | 🚧 |
| 2 | Armas exóticas e de pólvora/cenário específico | 🚧 |
| 3 | Qualidade da arma (comum/fina/obra-prima → +Acerto/Dano) | 🔧 |
| 4 | Munição detalhada e recarga em Ticks | 🔧 |

---
*v0.1 — Classes + Tags; armaduras com trade-off de Esquiva, lentidão e furtividade; interação arma×armadura validada por cálculo.*
