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

Conforme a Vida restante cai, a dor cobra seu preço nas **ações físicas** (as que rolam Força, Destreza ou Vigor) e na **Defesa Física**. O **ataque à distância** também sofre, mesmo rolando Percepção: é a única rolagem de Percepção que a dor alcança, porque o arco e a besta pedem o corpo firme. Social e mental não sentem nenhum dos quatro graus abaixo: um personagem Crítico ainda pensa e convence direito, só não corre nem briga direito.

| Vida restante | Estado | Ações físicas | Defesa Física |
|---|---|---|---|
| 61–100% | Saudável | nenhuma | nenhuma |
| 31–60% | Machucado | −2 | −2 |
| 11–30% | Grave | −1d6 | −4 |
| 1–10% | Crítico | −2d6 | −8 |
| ≤ 0% | Incapacitado | incapacitado | — |

<p class="muted">A tabela para em Crítico, e só uma coisa passa dele sem cair em Incapacitado: a <strong>ressaca do Frenesi</strong> dos orcs e meio-orcs. Cada estado de ressaca além de Crítico soma mais −1d6 na ação física e −4 na Defesa Física, e nunca leva a Incapacitado. O degrau não existe fora dela (ver <a href="/centelha-rpg/regras/racas#frenesi">Frenesi</a>).</p>

**O pool nunca desce abaixo de 1d6**, mesma trava do Desgaste: Grave e Crítico tiram dado de verdade, mas nunca zeram a ação física por inteiro. A única exceção é o teste para entrar no [Frenesi](/regras/racas#frenesi): ali a penalidade de ferimento e o ponto de Força de Vontade que o próprio orc aplica para ceder podem zerar a parada.

<div class="callout regra"><span class="lbl">As duas moedas, lado a lado no mesmo degrau</span>O jogo penaliza de dois jeitos: o <strong>ponto</strong> sai do <strong>total</strong> depois que os dados pararam de rolar, o <strong>dado</strong> sai do <strong>pool</strong>, antes de rolar. Nenhuma categoria converte um no outro, mas o Ferimento agora atravessa os dois: <strong>Machucado é ponto</strong> (−2 no total, sem tirar dado da mão), <strong>Grave e Crítico são dado</strong> (−1d6 e −2d6 do pool), a mesma moeda que até aqui era exclusiva do <strong>Desgaste</strong> (fome, sede, sono, veneno, exaustão, no capítulo <a href="/centelha-rpg/regras/acoes-resistir">Resistir</a>). Um personagem Grave ou Crítico <strong>e</strong> com Desgaste ao mesmo tempo (ferido e envenenado, por exemplo) tem as duas fontes cortando do <strong>mesmo</strong> pool, somando direto, com o piso comum em 1d6.</div>

## Queda e Morte

Chegar a **0 PV ou menos** deixa você **Incapacitado**: fora da briga, e ainda vivo. A Vida não para no zero, ela continua descendo, e é abaixo do zero que mora a morte.

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

<p class="muted">Um aliado <strong>Incapacitado</strong> que ainda sangra continua perdendo Vida rumo ao limite: a margem de meio PV máximo encurta sozinha enquanto ninguém chega. É a hora em que parar para estabilizar o companheiro pesa tanto quanto desferir mais um golpe.</p>

## Recuperação

Você recupera o equivalente ao seu Vigor em PV a cada intervalo, tão mais lento quanto pior o estado:

| Estado | Recupera o Vigor em PV… |
|---|---|
| Saudável (61–100%) | por dia |
| Machucado (31–60%) | a cada 3 dias |
| Grave (11–30%) | a cada 5 dias |
| Crítico (1–10%) | por semana |

<p class="muted">Cura é cura: a tabela vale para qualquer dano, venha ele de malho, de lâmina ou de queda. A perícia Cura e a magia aceleram a recuperação.</p>
