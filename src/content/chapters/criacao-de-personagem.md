---
ordem: 9
numeral: "IX"
titulo: "Criação de Personagem"
resumo: "Montar um herói gastando XP a partir de pisos — com a ficha auto-calculável."
---

Um personagem é construído gastando **Experiência** (XP) a partir de valores-piso. Não há pacotes por categoria: você recebe um bolo de XP e o investe onde a sua história pede.

<div class="callout regra"><span class="lbl">Atalho</span>A <a href="/ficha">Ficha de Personagem</a> faz toda esta conta ao vivo: gaste pontos e veja o XP e os derivados se atualizarem.</div>

## Pisos e princípios

Tudo começa no mínimo e é comprado dali: **Atributos 2** · **Habilidades 0** · **Virtudes 1** · **Força de Vontade 5** · **Centelha 0** · qualquer **Caminho 0**.

A **Centelha 0** é o mortal comum — cerca de 95% das pessoas, sem acesso a Técnicas ou Artes. Comprar **Centelha 1** é o que torna alguém especial. Orçamento inicial padrão: **1000 XP** (iniciante), **1400** (veterano) ou **1800** (herói). Com 1000 XP, um personagem já chega como Centelha 2, com vários atributos no teto de criação e um arsenal de Técnicas.

## Custos de XP

O custo é para subir ao próximo ponto, em função do *novo* valor.

| Traço | Custo do próximo ponto | Exemplos |
|---|---|---|
| Atributo | novo × 10 | 2→3 = 30 · 3→4 = 40 |
| Habilidade primária | novo × 5 | 0→1 = 5 · 2→3 = 15 |
| Habilidade secundária | novo × 2 | 0→1 = 2 · 2→3 = 6 |
| Especialidade (prim. / sec.) | 10 / 5 por ponto | limite = nível na Habilidade |
| Virtude | novo × 5 | 1→2 = 10 · 2→3 = 15 |
| Força de Vontade | novo × 2 | 5→6 = 12 |
| Centelha | novo × 15 | 0→1 = 15 · 2→3 = 45 |
| Técnica de Caminho | banda × 5 | banda 1 = 5 · banda 3 = 15 |
| Nível de Arte (Arcano) | nível × 10 | nível 1 = 10 · nível 3 = 30 |

<p class="muted">A Centelha cara reflete a raridade: alcançar Centelha 3 custa 90 XP acumulados; a Centelha 5, 225 — o trabalho de uma vida. Técnica de banda <em>N</em> exige Centelha ≥ ⌈N/3⌉; Arte de nível <em>N</em> exige Centelha ≥ N e Ocultismo ≥ N.</p>

<div class="callout"><span class="lbl">O portão da Centelha</span>A Centelha não se compra em massa: ela só sobe com <strong>permissão do Mestre</strong>, num marco de história ou feito maior. O XP paga o custo (× 15), mas o salto de tier — de herói a semideus — é uma conquista narrativa, não uma transação de balcão.</div>

## Limites na criação

Atributo máximo **4**; Habilidade máxima **3**; Centelha máxima **2** (a maioria dos heróis começa em 1). O 5º ponto e tiers maiores vêm com o jogo.

Cada herói pode ter **um pico**: você está autorizado a levar **um único Atributo a 5** e **uma única Perícia primária a 4** já na criação — o talento superlativo que o define. Os demais respeitam os tetos acima.

## Traços derivados

| Traço | Fórmula |
|---|---|
| Pontos de Vida | 25 + (Vigor × 3) |
| Defesa | (Destreza + Habilidade) × 2 − ⌊soma ÷ 4⌋ + Especialidade + ⌈Centelha ÷ 2⌉ |
| Defesa Mental | ⌊(Integridade + Vontade) ÷ 2⌋ + Centelha · (Integridade = Compaixão + Temperança) |
| Energia | (Centelha × 3) + soma das 4 Virtudes + Força de Vontade |
| Mana | (Centelha × 2) + Força de Vontade |
| Iniciativa | 1d6 + Raciocínio + Prontidão |

## Exemplo: Kael, o Batedor

Um herói **enxuto** de Centelha 1, montado com apenas **375 XP** — útil para enxergar como os custos se somam. No orçamento padrão de 1000, Kael sobraria fôlego para subir à Centelha 2, abrir um terceiro Caminho ou aprofundar os atributos; aqui ele fica deliberadamente magro para servir de gabarito de cálculo.

| Compra | Detalhe | XP |
|---|---|:---:|
| Atributos | Destreza 4 · Percepção, Vigor, Raciocínio 3 · demais 2 | 160 |
| Habilidades | Furtividade 3, Armas à Distância 3 · Prontidão, Atletismo, Sobrevivência 2 · Investigação, Briga, Esquiva 1 | 120 |
| Especialidades | Furtividade, Armas à Distância | 20 |
| Virtudes | Valor 3 · Temperança, Convicção 2 | 45 |
| Centelha | 0 → 1 | 15 |
| Técnicas | Sombra: Pisar Leve, Esgueirar · Olho de Águia: Mira Firme | 15 |
| **Total** | | **375** |

<p class="muted">Derivados: PV 34 · Defesa 10 · Energia 16 · Mana 7 · Iniciativa 1d6+5. Os 625 XP restantes do orçamento padrão dariam a Kael a Centelha 2, atributos mais altos e um punhado de novas Técnicas.</p>
