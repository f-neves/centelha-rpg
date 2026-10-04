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
| ≤ 0% | Incapacitado | desmaiado, fora da briga | — |

<p class="muted">A tabela para em Crítico, e só uma coisa passa dele sem cair em Incapacitado: a <strong>ressaca do Frenesi</strong> dos orcs e meio-orcs. Cada estado de ressaca além de Crítico soma mais −1d6 na ação física e −4 na Defesa Física, e nunca leva a Incapacitado. O degrau não existe fora dela (ver <a href="/centelha-rpg/regras/racas#frenesi">Frenesi</a>).</p>

**O pool nunca desce abaixo de 1d6**, mesma trava do Desgaste: Grave e Crítico tiram dado de verdade, mas nunca zeram a ação física por inteiro. O piso vale para quem tinha dado: quem já rolava zero dados (soma 1, o 2 fixo) continua no 2 fixo, e a penalidade não inventa um dado que não existia. A única exceção é o teste para entrar no [Frenesi](/regras/racas#frenesi): ali a penalidade de ferimento e o ponto de Força de Vontade que o próprio orc aplica para ceder podem zerar a parada.

<div class="callout regra"><span class="lbl">As duas moedas, lado a lado no mesmo degrau</span>O jogo penaliza de dois jeitos: o <strong>ponto</strong> sai do <strong>total</strong> depois que os dados pararam de rolar, o <strong>dado</strong> sai do <strong>pool</strong>, antes de rolar. Nenhuma categoria converte um no outro, mas o Ferimento agora atravessa os dois: <strong>Machucado é ponto</strong> (−2 no total, sem tirar dado da mão), <strong>Grave e Crítico são dado</strong> (−1d6 e −2d6 do pool), a mesma moeda que até aqui era exclusiva do <strong>Desgaste</strong> (fome, sede, sono, veneno, exaustão, no capítulo <a href="/centelha-rpg/regras/acoes-resistir">Resistir</a>). Um personagem Grave ou Crítico <strong>e</strong> com Desgaste ao mesmo tempo (ferido e envenenado, por exemplo) tem as duas fontes cortando do <strong>mesmo</strong> pool, somando direto, com o piso comum em 1d6.</div>

## Queda e Morte

Chegar a **0 PV ou menos** deixa você **Incapacitado**: desmaiado, fora da briga, e ainda vivo. Esse desmaio não tem teste: nem a Resistência o evita. As Proezas que mantêm de pé em 0 PV ou menos (Não Vou Cair, Último Suspiro, Não Sentir Dor) são a exceção. A Vida não para no zero, ela continua descendo, e é abaixo do zero que mora a morte.

<p class="formula">Morre em Vida ≤ −(PV máximo ÷ 2)</p>

Metade do seu PV máximo, contada abaixo do zero, é a margem que você tem depois de cair. Bram, de **PV 34**, cai em **0** e morre em **−17**, e nesse caso a divisão é exata.

**Quando ela não é exata, a Centelha decide para que lado o meio ponto cai**: quem não tem Centelha arredonda para baixo, quem tem arredonda para cima. Um **PV 37** sem Centelha morre em **−18**; o mesmo **PV 37** de quem tem Centelha morre em **−19**. É um ponto de diferença, e ele fica com quem tem a fagulha.

Essa margem é a razão de a cena existir. Um aliado que caiu não está morto: alguém pode atravessar o campo, estancar o sangue e trazê-lo de volta, e quem está batendo escolhe se continua batendo nele. **Matar deixa de ser acidente de dado e vira decisão de quem tem a arma na mão**, tomada na mesa, no momento.

## Sangramento e Estabilização

Nem todo ferimento para de doer quando o golpe termina. O **Sangramento** representa feridas abertas que continuam drenando vida. A cada **6 [Ticks](/regras/combate#a-linha-do-tempo-ticks-velocidade-e-iniciativa) desde o ferimento**, um Sangramento **N** causa **N de dano** (já passa direto pelo Absorção). O relógio é de cada um, e não da mesa: quem levou duas feridas em momentos diferentes sangra por dois contadores desalinhados. Ele é lento de propósito: há tempo de reagir antes que mate.

Há duas formas de começar a sangrar:

- **Ferimento muito grave**: cair ao estado **Grave** (ou pior) por dano de **corte ou perfuração** abre um **Sangramento 1**.
- **Arma ou poder próprio para isso**: armas com a tag **Sangramento** (lâminas serrilhadas, garras) e certas Técnicas/Artes que rasgam carne abrem um **Sangramento igual à Margem do golpe** (máximo 3), em qualquer estado.

Sangramentos não se somam livremente: vale o **maior**, e cada fonte adicional acrescenta apenas +1 (teto **5**).

<div class="callout"><span class="lbl">Estabilizar</span>Uma ação dedicada e um teste de <strong>Raciocínio + Cura vs Dif 10</strong> (pano limpo, pressão, sutura) encerra um Sangramento. Sozinho, cerrando os dentes, role <strong>Vigor + Resistência vs Dif 10</strong>. Qualquer cura de PV (descanso, Cura ou magia) também o estanca.</div>

<p class="muted">Um aliado <strong>Incapacitado</strong> que ainda sangra continua perdendo Vida rumo ao limite: a margem de meio PV máximo encurta sozinha enquanto ninguém chega. É a hora em que parar para estabilizar o companheiro pesa tanto quanto desferir mais um golpe.</p>

## Tratar

Quem está em 0 PV ou menos não se recupera sozinho. Enquanto o PV não chegar a 1, cada dia pede um teste de **Tratar**, feito por quem cuida: **Raciocínio + Cura**. Chame de **X** o PV negativo atual (a −16, X é 16). Como em todo teste, o total precisa **superar** a Dificuldade, e há duas: **metade de X** e **um quarto de X**, as duas arredondadas para cima (a X = 16, Dificuldades 8 e 4; a X = 15, 8 e 4; a X = 17, 9 e 5).

| Total do teste de Tratar | Faixa | O paciente, naquele dia |
| --- | --- | --- |
| supera metade de X | **recupera** | recupera o seu Vigor em PV, até no máximo 1 PV |
| supera um quarto de X, mas não metade | **segura** | nada muda |
| igual ou abaixo de um quarto de X | **piora** | perde **1d6 PV** |

Em 0 PV exato (X = 0) qualquer resultado supera, e o paciente recupera. Com **1 PV** o paciente acorda, em Crítico, e dali em diante vale a tabela de Recuperação.

**Cura, a Habilidade.** Identificar o mal (a ferida, o veneno, a doença) é **Inteligência + Cura**, e o Mestre decide se é preciso rolar. O tratamento que exige mão (sutura, colocar osso, cirurgia, administração intravenosa) é **Raciocínio + Cura**: é o caso do Estabilizar, do Tratar e do tratamento de veneno e de doença no capítulo Resistir. Dar um remédio para beber não pede teste.

**A Arte no Tratar.** Quem cuida e conhece uma Arte de cura soma ao teste **+3 por nível da Arte de Cura**, ou **+1 por nível da Arte de Vida**. Os dois não se somam: vale o maior. Quem a usa escolhe o nível, até o que tem na Arte, e paga a **Mana desse nível**: 2 por nível, como toda cura, menos a Centelha (pode sair de graça). Um Efeito específico (Mão Firme, Campo de Alívio, Acelerar a Cura) vale o que o próprio Efeito disser.

**Tratar não é Estabilizar.** Estabilizar encerra um Sangramento, numa ação, contra Dificuldade 10. Tratar é o teste do dia, de quem está em 0 PV ou menos. Quem ainda sangra precisa primeiro ser estabilizado; enquanto sangra, continua perdendo Vida rumo ao limite.

**Cura de PV.** Toda cura de PV (a Arte de Cura, uma Técnica como o Estancar, a magia em geral) soma ao PV negativo, e, se levar o paciente a 1 PV ou mais, ele acorda na hora.

**Transporte.** O grupo só segue viagem com quem está em 0 PV ou menos se puder levá-lo sem piorar as feridas. Uma carroça serve.

**Sem tratamento.** Se ninguém trata, e o paciente não sangra nem sofre de nada que piore a situação, o PV fica parado onde está. Não há regra para a morte por abandono: o Mestre decide o que acontece, e quando.

Exemplo: Sora (PV 37, Vigor 4, Centelha 3) cai a −16; morre em −19. Kael cuida dela com Raciocínio 3 e Cura 1 (2d6, mais 2 de Centelha: 2d6+2). Dia 1: X é 16, Dificuldades 8 e 4; Kael tira 6, não supera 8 mas supera 4: **segura**, e nada muda. Dia 2: tira 10 e supera 8: **recupera**, e Sora sobe o Vigor, para −12. Dia 3: X é 12, Dificuldades 6 e 3, tira 9: −8. Dia 4: Dificuldades 4 e 2, tira 8: −4. Dia 5: Dificuldades 2 e 1, tira 7: 0. Dia 6: X é 0, e qualquer resultado supera: 1 PV, e Sora acorda em Crítico. Um companheiro sem a Habilidade Cura (Raciocínio 3: 1d6+2) nunca recuperaria Sora a −16 (o total máximo é 8, e a Dificuldade é 8), e cada dia com total 4 ou menos (rolar 1 ou 2) custaria a ela 1d6 PV. Se esse mesmo companheiro conhecer a Arte de Cura no nível 1 (+3, 2 de Mana, de graça para quem tem Centelha 2), ele rola 1d6+5 e recupera Sora na metade dos dias (total 9 ou mais), sem nunca piorá-la.

## Recuperação

Você recupera o equivalente ao seu Vigor em PV a cada intervalo, tão mais lento quanto pior o estado:

| Estado | Recupera o Vigor em PV… |
|---|---|
| Saudável (61–100%) | por dia |
| Machucado (31–60%) | a cada 3 dias |
| Grave (11–30%) | a cada 5 dias |
| Crítico (1–10%) | por semana |
| Incapacitado (0 PV ou menos) | por dia, pelo teste de Tratar, até 1 PV |

<p class="muted">Cura é cura: a tabela vale para qualquer dano, venha ele de malho, de lâmina ou de queda. Quem trata acelera a recuperação: <strong>cada nível de Cura</strong> de quem cuida <strong>encurta o intervalo</strong> da tabela em <strong>10%</strong> (com Cura 3, o "a cada 5 dias" vira 3,5 dias), e os 50% exigem Cura 5. O encurtamento não vale na linha "por dia" (o dia é o menor intervalo da tabela) nem para quem está em 0 PV ou menos, que sobe pelo teste de Tratar. A magia também acelera (Acelerar a Cura, na Arte de Vida).</p>
