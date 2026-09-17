---
ordem: 6
numeral: "IV"
titulo: "Vida, Ferimentos & Cura"
resumo: "Pontos de Vida, limiares de ferimento, queda, morte e recuperação."
---

Heróis aguentam o tranco. O combate não começa com a morte à espreita a cada golpe, a não ser que a diferença de poder seja gritante. Os **Pontos de Vida** medem o quanto você suporta antes de cair.

Quando você sofre dano (o que sobra do golpe depois da **Absorção**, o número que reduz cada dano antes de virar ferimento: a soma da armadura com a natural do corpo, detalhada em [Dano e Armadura](/regras/combate#dano-e-armadura)), você o **marca** na sua folha, e há um número só: **dano é dano, cura é cura**. Corte, perfuração, impacto, queimadura, queda ou veneno somam todos no mesmo lugar, e qualquer cura cura, seja ela descanso, Cura ou magia.

O tipo do golpe importa, e importa **antes**: é ele que escolhe a Absorção com que a sua armadura resiste (a Placa Completa absorve 8 de Corte e 4 de Impacto, então o malho contra placa continua sendo a via que era). **O tipo pesa no golpe, não na cicatriz.**

## Pontos de Vida

<p class="formula">PV = 25 + (Vigor × 3)</p>

Essa é a durabilidade de uma criatura de **porte Médio**, o padrão dos humanoides e dos personagens. Criaturas maiores aguentam mais e as menores bem menos, mesmo com o mesmo Vigor: a base sobe com o tamanho o tempo todo, e o multiplicador de Vigor sobe até Enorme e para em 5 dali em diante (Imenso e Colossal só ganham base). Um urso (Grande) de Vigor 5 tem 50 PV, enquanto um elfo (Médio) de mesmo Vigor tem 40.

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

<div class="callout exemplo"><span class="lbl">Exemplo</span>Bram tem <strong>PV 34</strong>. Numa briga feia, leva <strong>28</strong> de dano somado (malho, lâmina e uma queda): restam <strong>6 PV</strong> (18% → <strong>Grave</strong>). Está mal, mas ainda de pé, e o chão dele é longe: cai em <strong>0</strong> e só morre em <strong>−17</strong>, que é metade do seu PV máximo abaixo do zero.</div>

## Limiares de Ferimento

Conforme a Vida restante cai, a dor cobra seu preço, as penalidades incidem nas suas **jogadas** e na sua **Defesa**:

| Vida restante | Estado | Penalidade |
|---|---|---|
| 76–100% | Saudável | nenhuma |
| 51–75% | Machucado | −1 no total das ações |
| 26–50% | Ferido | −2 no total das ações, −1 Defesa |
| 11–25% | Grave | −3 no total das ações, −2 Defesa |
| 1–10% | Crítico | −4 no total das ações, −3 Defesa |
| ≤ 0 | Caído | incapacitado |

<div class="callout regra"><span class="lbl">As duas moedas, e elas não se misturam</span>O jogo penaliza de dois jeitos, e a diferença muda a conta na mesa. O <strong>ponto</strong> sai do <strong>total</strong> depois que os dados pararam de rolar: é a moeda do ferimento acima e da maior parte dos modificadores de situação, e um ferido a 5% da Vida continua rolando o mesmo punhado de dados de quando estava inteiro, só somando menos no fim. O <strong>dado</strong> sai do <strong>pool</strong>, antes de rolar: é a moeda do <strong>Desgaste</strong> (fome, sede, sono, veneno, exaustão), no capítulo <a href="/centelha-rpg/regras/acoes-resistir">Resistir</a>, e ali some dado da mão. Ponto e dado nunca são a mesma coisa nem se convertem um no outro.</div>

## Queda e Morte

Chegar a **0 PV ou menos** deixa você **Caído**: incapacitado, fora da briga, e ainda vivo. A Vida não para no zero, ela continua descendo, e é abaixo do zero que mora a morte.

<p class="formula">Morre em Vida ≤ −(PV máximo ÷ 2)</p>

Metade do seu PV máximo, contada abaixo do zero, é a margem que você tem depois de cair. Bram, de **PV 34**, cai em **0** e morre em **−17**, e nesse caso a divisão é exata.

**Quando ela não é exata, a Centelha decide para que lado o meio ponto cai**: quem não tem Centelha arredonda para baixo, quem tem arredonda para cima. Um **PV 37** sem Centelha morre em **−18**; o mesmo **PV 37** de quem tem Centelha morre em **−19**. É um ponto de diferença, e ele fica com quem tem a fagulha.

Essa margem é a razão de a cena existir. Um aliado que caiu não está morto: alguém pode atravessar o campo, estancar o sangue e trazê-lo de volta, e quem está batendo escolhe se continua batendo nele. **Matar deixa de ser acidente de dado e vira decisão de quem tem a arma na mão**, tomada na mesa, no momento.

## Sangramento e Estabilização

Nem todo ferimento para de doer quando o golpe termina. O **Sangramento** representa feridas abertas que continuam drenando vida. A cada **6 Ticks desde o ferimento**, um Sangramento **N** causa **N de dano** (já passa direto pelo Absorção). O relógio é de cada um, e não da mesa: quem levou duas feridas em momentos diferentes sangra por dois contadores desalinhados. Ele é lento de propósito: há tempo de reagir antes que mate.

Há duas formas de começar a sangrar:

- **Ferimento muito grave**: cair ao estado **Grave** (ou pior) por dano de **corte ou perfuração** abre um **Sangramento 1**.
- **Arma ou poder próprio para isso**: armas com a tag **Sangramento** (lâminas serrilhadas, garras) e certas Técnicas/Artes que rasgam carne abrem um **Sangramento igual à Margem do golpe** (máximo 3), em qualquer estado.

Sangramentos não se somam livremente: vale o **maior**, e cada fonte adicional acrescenta apenas +1 (teto **5**).

<div class="callout"><span class="lbl">Estabilizar</span>Uma ação dedicada e um teste de <strong>Cura vs Dif 10</strong> (pano limpo, pressão, sutura) encerra um Sangramento. Sozinho, cerrando os dentes, role <strong>Vigor + Convicção vs Dif 10</strong>. Qualquer cura de PV (descanso, Cura ou magia) também o estanca.</div>

<p class="muted">Um aliado <strong>Caído</strong> que ainda sangra continua perdendo Vida rumo ao limite: a margem de meio PV máximo encurta sozinha enquanto ninguém chega. É a hora em que parar para estabilizar o companheiro pesa tanto quanto desferir mais um golpe.</p>

## Recuperação

Você recupera o equivalente ao seu Vigor em PV a cada intervalo, tão mais lento quanto pior o estado:

| Estado | Recupera o Vigor em PV… |
|---|---|
| Saudável (76–100%) | por dia |
| Machucado (51–75%) | a cada 3 dias |
| Ferido (26–50%) | a cada 3 dias |
| Grave (11–25%) | a cada 5 dias |
| Crítico (1–10%) | por semana |

<p class="muted">Cura é cura: a tabela vale para qualquer dano, venha ele de malho, de lâmina ou de queda. A perícia Cura e a magia aceleram a recuperação.</p>
