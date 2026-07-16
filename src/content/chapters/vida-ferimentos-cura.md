---
ordem: 4
numeral: "IV"
titulo: "Vida, Ferimentos & Cura"
resumo: "Pontos de Vida, limiares de ferimento, nocaute, morte e recuperação."
---

Heróis aguentam o tranco. O combate não começa com a morte à espreita a cada golpe — a não ser que a diferença de poder seja gritante. Os **Pontos de Vida** medem o quanto você suporta antes de cair.

Quando você sofre dano (o que sobra do golpe depois da Absorção), você o **marca** na sua folha. Ele vem em duas trilhas, que se comportam de modo diferente:

- **Impacto** (contundente) — em regra só **nocauteia**: derruba, mas não mata.
- **Letal** (corte, projétil e perfuração) — **fere de verdade**: é o que tira vidas.

A **soma das duas** trilhas é o seu dano total, e é ela que define o seu estado. A morte, porém, só olha para o Letal — como você verá.

## Pontos de Vida

<p class="formula">PV = 25 + (Vigor × 3)</p>

Essa é a durabilidade de uma criatura de **porte Médio**, o padrão dos humanoides e dos personagens. Criaturas maiores aguentam mais e as menores bem menos, mesmo com o mesmo Vigor: a base e o multiplicador escalam com o tamanho. Um urso (Grande) de Vigor 5 tem 50 PV, enquanto um elfo (Médio) de mesmo Vigor tem 40.

| Porte | PV |
|---|---|
| Miúdo | 15 + (Vigor × 1) |
| Pequeno | 20 + (Vigor × 2) |
| Médio | 25 + (Vigor × 3) |
| Grande | 30 + (Vigor × 4) |
| Enorme | 35 + (Vigor × 5) |
| Imenso | 40 + (Vigor × 5) |
| Colossal | 45 + (Vigor × 5) |

A sua **Vida restante** é o PV máximo menos o dano total marcado; é a porcentagem dela que diz em que estado você está, na tabela abaixo.

<div class="callout exemplo"><span class="lbl">Exemplo</span>Bram tem <strong>PV 37</strong>. Numa briga feia, leva <strong>20 de Impacto + 8 de Letal = 28</strong> de dano: restam <strong>9 PV</strong> (24% → <strong>Grave</strong>). Está mal — mas longe de morrer: a morte exigiria <strong>37 de Letal</strong>, e ele só tem 8. Se cair a 0 com a maior parte sendo Impacto, ele <em>desmaia</em>, não morre.</div>

## Limiares de Ferimento

Conforme a Vida restante cai, a dor cobra seu preço — as penalidades incidem nas suas **jogadas** e na sua **Defesa**:

| Vida restante | Estado | Penalidade |
|---|---|---|
| 76–100% | Saudável | nenhuma |
| 51–75% | Machucado | −1 em ações |
| 26–50% | Ferido | −2 em ações, −1 Defesa |
| 11–25% | Grave | −3 em ações, −2 Defesa |
| 1–10% | Crítico | −4 em ações, −3 Defesa |
| ≤ 0 | Caído | incapacitado |

## Nocaute e Morte

Cair a 0 PV deixa você **incapacitado**; se o golpe que o derrubou foi sobretudo de Impacto, você apenas desmaia. A morte verdadeira só chega quando o **dano Letal acumulado iguala o seu PV máximo** — dá para nocautear alguém sem matá-lo, mas tirar uma vida exige sangue suficiente.

## Sangramento e Estabilização

Nem todo ferimento para de doer quando o golpe termina. O **Sangramento** representa feridas abertas que continuam drenando vida. No **início de cada rodada** do personagem, um Sangramento **N** causa **N de dano Letal** (já passa direto pelo Absorção). Ele é lento de propósito: há tempo de reagir antes que mate.

Há duas formas de começar a sangrar:

- **Ferimento muito grave** — cair ao estado **Grave** (ou pior) por dano **Letal** (corte/perfuração) abre um **Sangramento 1**.
- **Arma ou poder próprio para isso** — armas com a tag **Sangramento** (lâminas serrilhadas, garras) e certas Técnicas/Artes que rasgam carne abrem um **Sangramento igual à Margem do golpe** (máximo 3), em qualquer estado.

Sangramentos não se somam livremente: vale o **maior**, e cada fonte adicional acrescenta apenas +1 (teto **5**).

<div class="callout"><span class="lbl">Estabilizar</span>Uma ação dedicada e um teste de <strong>Medicina vs Dif 10</strong> (pano limpo, pressão, sutura) encerra um Sangramento. Sozinho, cerrando os dentes, role <strong>Vigor + Convicção vs Dif 10</strong>. Qualquer cura de PV — descanso, Medicina ou magia — também o estanca.</div>

<p class="muted">Um aliado <strong>Caído</strong> que ainda sangra continua acumulando dano Letal rumo à morte: alguém precisa chegar até ele. É a hora em que parar para estabilizar o companheiro pesa tanto quanto desferir mais um golpe.</p>

## Recuperação

Você recupera o equivalente ao seu Vigor em PV a cada intervalo — tão mais lento quanto pior o estado:

| Estado | Recupera o Vigor em PV… |
|---|---|
| Saudável (>75%) | por dia |
| Machucado / Ferido (50–75%) | a cada 3 dias |
| Grave (25–50%) | a cada 5 dias |
| Crítico (<25%) | por semana |

<p class="muted">Dano de Impacto sara muito mais rápido que o Letal; a Medicina e a magia aceleram a cura.</p>
