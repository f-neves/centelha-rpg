# Combate Social do Centelha (sistema base)

Sistema completo de combate social, espelhado no **combate físico** do jogo para já
nascer balanceado (mesma matemática, mesmas escalas). Aqui estão ataque, defesa, dano,
PV social, recuperação, armas e armaduras, com números fechados e exemplos. Ainda **sem
Proezas**: é a fundação sobre a qual as Proezas sociais entrarão depois.

Todas as decisões já foram tomadas. Onde deixei uma alternativa possível, está no fim,
na seção "Decisões e ajustes".

---

## 1. Princípio e quando usar

Um combate social é uma disputa de vontade em que um lado tenta **mover** o outro
(convencer, seduzir, coagir, inspirar, arrancar algo) e o outro **resiste**. Resolve-se
em **embates** (o análogo social das trocas de golpe), medidos em Ticks, até que a
**Firmeza** de alguém chegue a zero, ponto em que essa pessoa **cede** o que estava em
jogo (concorda, obedece, entrega, revela, sente).

- É o lado da **Defesa Social** (resistir a influência e a leitura). **Não** cobre
  ataques mágicos à mente: controle, medo mágico e leitura de pensamento são
  **Defesa Mental**, sistema à parte.
- Use combate social quando **há aposta e resistência real** (uma negociação dura, um
  jogo de corte, uma sedução, um interrogatório, dobrar um aliado relutante). Papo
  trivial é uma rolagem só, não um combate.
- Cede **o ponto em disputa**, não a alma: vencer um combate social é ganhar aquela
  discussão/sedução/negociação, não escravizar (isso seria Mental). Depois da cena o
  perdedor pode se arrepender e tentar reverter numa cena futura.

Espelho do físico: **Firmeza = PV**, **Defesa Social = Esquiva**, **canais = modos de
dano**, **armaduras sociais = armaduras**, **abordagens = armas**, **abalo = ferimentos**.

---

## 2. As duas reservas

### Firmeza (o "PV social")

> **Firmeza = 25 + Compostura × 3**  (linha de base humana/porte Médio)

É a reserva de aprumo antes de ceder. Espelha o PV físico (`25 + Vigor×3`). Um herói de
Compostura 4 tem **Firmeza 37**, igual ao PV de um herói de Vigor 4. Some Especialidade
de defesa quando existir (fase de Proezas).

Quando a Firmeza chega a **0**, o personagem **cede o ponto em disputa**.

### Força de Vontade (a reserva de recusa)

Além da Firmeza passiva, você pode **gastar 1 Força de Vontade para RECUSAR um golpe
social**: aquele embate é tratado como um **erro** (dano 0), uma recusa fria e
consciente. É o botão do "eu simplesmente não vou". Limitado pela sua reserva de
Vontade, que você também usa em Proezas, Artes e outras resistências, então recusar
custa caro. Recupera-se pelas regras normais de Vontade (descanso/cena).

> Recusar com Vontade não vale contra **leitura social** (não dá para "se recusar" a ser
> lido; só o número da Defesa Social protege). Vale contra os movimentos que tentam te
> **mover**.

---

## 3. Iniciativa e Ticks sociais

Um **Tick** social é um lance de conversa (uma fala com peso, uma jogada de corte), não
um segundo. O motor de Ticks é o mesmo do físico.

> **Iniciativa social = 1d6 + Perspicácia + Sociabilidade**

Quem lê melhor a sala e tem mais desenvoltura toma a palavra primeiro (começa no Tick 0;
os demais no Tick 1, com a mesma regra de defasagem do físico).

**Speed das abordagens** (quantos Ticks até o próximo lance): leve **5**, média **6**,
pesada **7**. Uma alfinetada é rápida; montar um caso ou orquestrar um esquema é lento.

---

## 4. O ataque social

> **Ataque = [ (Influência + Perícia) ÷ 2 ] d6  ( +2 se a soma for ímpar )  + Peso do argumento  + Centelha × 2**

- **Perícia**: a da abordagem usada (Persuasão, Oratória, Sedução, Lábia, Manha,
  Negociação, Intimidação, Liderança, Etiqueta), como a arma física escolhe a perícia.
- **Peso do argumento**: o "acerto" da abordagem (campo na tabela de armas).
- **Centelha × 2**: o mesmo bônus de Centelha que o ataque físico ganha.

Compara-se com a **Defesa Social** do alvo (número passivo).

- **Acerta** se o Ataque **>** Defesa Social.
- **Margem = [ (Ataque − Defesa Social) ÷ 6 ]** → dados extras de dano (igual ao físico).

> Atacar um alvo que você não consegue nem ver a guarda (Defesa Social muito acima) é
> como bater numa muralha: quase nunca passa. Troque de **canal** (seção 6) ou de tática.

---

## 5. A defesa social

### Defesa Social (o número passivo, o "esquiva social")

> **Defesa Social = (Compostura + Sociabilidade + Centelha) × 2 + Especialidade situacional**

É o valor que o atacante precisa superar. Já existe na ficha e no bestiário. Herói
típico (Compostura 4, Sociabilidade 4, Centelha 2) = **Defesa Social 20**, na faixa da
Defesa física de um herói (~18). Em **feras** (Int 1) troca-se Sociabilidade por
Sobrevivência; **Int 0** é imune; no bestiário Social vale só para **Int 2+**.

### Recusar com Vontade (a defesa ativa)

Ver seção 2: gastar 1 Força de Vontade anula o dano de um golpe. É a "aparada" social,
mas com custo de recurso em vez de rolagem.

### Absorção social (o "soak", vem da armadura, seção 7)

Reduz o **dano** que passou pela Defesa. Não impede o acerto, amortece o baque.

---

## 6. O dano e os quatro canais

> **Dano bruto = Dado da abordagem + Margem + Influência**  (Influência só em abordagens **diretas**; indiretas somam 0)
>
> **Dano líquido = Dano bruto − Absorção social do canal**  (mínimo 0)  → subtrai da Firmeza

- **Direta** (você mesmo pressionando, cara a cara): soma **Influência** (o peso da sua
  presença), como o corpo a corpo soma Força.
- **Indireta** (um presente deixado, um boato espalhado, os amigos do alvo): soma **0**
  de Influência, como uma arma de arremesso/à distância. O golpe fala por si.

### Os quatro canais (o análogo dos modos de dano)

Todo golpe social entra por **um canal**. A armadura social defende **por canal**, então
escolher o canal certo é a tática central (como bater de Impacto numa placa).

| Canal | O que é | Absorção natural (Virtude) |
|---|---|---|
| **Razão** | lógica, provas, argumentos, coerência | **Convicção** |
| **Coração** | emoção: amor, pena, medo, culpa, raiva, desejo | **Temperança** |
| **Brio** | status, vergonha, autoridade, provocação, orgulho, honra | **Valor** |
| **Ganho** | interesse próprio, suborno, vantagem, promessa material | **Compaixão** |

**Absorção social de um canal = Virtude do canal + Centelha × 1 + armadura social no canal.**
(Espelha o físico: absorção natural + Centelha×1 + armadura.)

**Compaixão como brecha:** apelos de **pena** ("pense nos que vão sofrer") entram pelo
Coração tratando a **Compaixão** do alvo como **penetração** (furam a Absorção de
Temperança). Um coração generoso é armadura contra suborno (Ganho), mas porta aberta para
a pena (Coração). É a fraqueza que equilibra a virtude.

---

## 7. Armaduras sociais (modos de defesa)

Posturas, vínculos e preparos que **absorvem** dano em certos canais. Como a armadura
física, têm **penalidade** (fechar-se custa calor humano) e a maior de cada canal vale
(não empilham entre si; a natural das Virtudes soma normalmente por cima).

| Modo de defesa | Razão | Coração | Brio | Ganho | Penalidade | Nota |
|---|---:|---:|---:|---:|---|---|
| **Aberto** | 0 | 0 | 0 | 0 | 0 | Sem guarda; máxima conexão e carisma. |
| **Cortesia formal** | 0 | 3 | 3 | 0 | −1 aos seus próprios ataques de Coração | Etiqueta mantém tudo a distância de braço; parece frio. |
| **Ceticismo** | 6 | 2 | 0 | 4 | −2 para criar vínculo/confiança | Desconfia de tudo; difícil de comover ou comprar, difícil de fazer amigo. |
| **Coração comprometido** | 0 | 8 | 0 | 0 | cego nesse eixo (−2 a ler sedução alheia) | Já ama outra pessoa/causa, ou está de luto: sedução e alegria ricocheteiam. |
| **Orgulho de casta** | 2 | 0 | 8 | 3 | −2 vs Coração (arrogância isola) | Reputação e sangue blindam contra vergonha e pressão; abre o flanco emocional. |
| **Desapego / voto** | 0 | 2 | 3 | 10 | −1 em tudo que envolva bens | Não se compra o que não se deseja. |
| **Conselheiro ao lado** | +3 | +3 | +3 | +3 | depende do aliado presente e livre | Alguém de confiança contra-argumentando em pé de igualdade (o "escudo" social). |
| **Posição ensaiada** | +4 no **canal previsto** | | | | −0 (dura uma cena) | Você preparou a defesa para o assunto que sabia que viria. |

O **Conselheiro ao lado** é o escudo social: some no dado de todos os canais enquanto o
aliado estiver presente, livre e não neutralizado (afaste ou ocupe o conselheiro e o
escudo cai). A **Posição ensaiada** é a cobertura preparada: só vale no canal antecipado.

---

## 8. Armas sociais (abordagens)

Cada abordagem é uma "arma": tem classe (define o dado e o Quase-Acerto), canal, perícia,
**Dado**, **Peso** (o acerto), alcance (direta/indireta) e Speed. Perfumes e presentes
entram como **itens/temperos** (fim da tabela).

| Abordagem | Classe | Canal | Perícia | Dado | Peso | Alcance | Speed | Nota |
|---|---|---|---|---:|---:|---|---:|---|
| **Elogio / lisonja** | leve | Coração | Lábia | 1 | +3 | direta | 5 | Rápido, quase sempre pega, mal arranha. Abre conversa. |
| **Provocação / deboche** | leve | Brio | Manha | 1 | +2 | direta | 5 | Tag **Finta**: −3 na Defesa Social do alvo no seu próximo golpe. |
| **Argumento lógico** | média | Razão | Persuasão | 2 | +1 | direta | 6 | O cavalo de batalha do debate. |
| **Sedução** | média | Coração | Sedução | 2 | +2 | direta | 6 | Aceita **tempero** de perfume/adorno (soma Peso). |
| **Presente / suborno** | média | Ganho | Negociação | 2 | +2 | **indireta** | 6 | O objeto fala (soma 0 de Influência). |
| **Ameaça / chantagem** | média | Brio | Intimidação | 2 | +1 | direta | 6 | Tag **Ruptura**: ignora metade da armadura social (arredonda p/ baixo), mas **fere a relação** (gera ressentimento/inimigo). |
| **Apelo à pena** | média | Coração | Persuasão | 2 | +1 | direta | 6 | Usa a **Compaixão** do alvo como **Penetração** (fura a Absorção de Temperança). |
| **Discurso / oração** | pesada | Razão ou Brio | Oratória | 3 | 0 | direta | 7 | Tag **Área**: atinge uma plateia inteira no mesmo lance. |
| **Amigos do alvo** | pesada | Brio | Liderança | 3 | 0 | **indireta** | 7 | Arma de **cerco**: tag **Penetração total** (ignora a armadura social **pessoal** do alvo; vem de quem ele confia). Leva tempo mobilizar. |
| **Rumor / fofoca** | leve | Brio | Manha | 1 | +1 | **indireta** | 5 | Tag **À distância**: nem exige o alvo presente; corrói reputação/Firmeza ao longo de dias. |

**Itens / temperos** (não são golpes sozinhos; melhoram golpes):

- **Perfume / adorno / boa aparência**: enquanto usado, **+2 de Peso** aos golpes de
  **Coração** (e a curva de Aparência já modula a jogada social, à parte). É o "tempero"
  clássico da sedução.
- **Presente pequeno de cortesia** (não suborno): **+1 de Peso** ao próximo golpe de
  Coração ou Ganho; quebra o gelo.
- **Cenário a favor** (um banquete que você paga, o seu salão, seu terreno): funciona
  como **terreno alto** social (seção 10).

### Quase-Acerto social (semeia dúvida)

Errar por pouco ainda **planta uma semente** (dano que ignora a Absorção), igual ao QA
físico. Usa a mesma tabela por classe da abordagem:

| Classe | Margem de QA | Dano de QA |
|---|---:|---:|
| leve | +3 | 2 |
| média | +2 | 4 |
| pesada | +1 | 6 |

Se o Ataque erra a Defesa Social por até a **Margem de QA**, causa o **Dano de QA** na
Firmeza (ignora Absorção). É como uma tarde inteira de alfinetadas leves minando alguém
mesmo sem nenhum golpe "cheio".

---

## 9. Trilha de abalo (o "ferimento social") e o Cede

Conforme a Firmeza cai, a pessoa fica **abalada**: perde em ataque e defesa sociais
(gagueja, se irrita, perde a linha). Mesma tabela de faixas do físico, por % da Firmeza:

| % da Firmeza | Estado | Pen. ação social | Pen. Defesa Social |
|---|---|---:|---:|
| 76–100% | Firme | 0 | 0 |
| 51–75% | Incomodado | −1 | 0 |
| 26–50% | Abalado | −2 | −1 |
| 11–25% | Vacilando | −3 | −2 |
| 1–10% | Quebrando | −4 | −3 |
| 0% | **Cede** | concede o ponto | — |

**Cede** = o alvo concede **o ponto específico** em disputa: assina, entrega, obedece
àquela ordem, acredita naquela afirmação, admite o segredo, aceita o cortejo. É a
"derrota" da cena social, não posse permanente da mente.

---

## 10. Modificadores situacionais

Espelham os do combate físico (teto de ±6 acumulado), aplicados à Defesa Social do alvo
ou ao ataque:

- **Postura agressiva social** (apelo comprometido, você se expõe): −2 à sua própria
  Defesa Social e +2 ao seu ataque até seu próximo lance.
- **Plateia a seu favor** (a sala concorda com você): −2 na Defesa Social do alvo.
- **Plateia contra você / hostil**: +2 na Defesa Social do alvo.
- **Terreno social** (seu salão, você paga o banquete, seu protocolo): −2 na Defesa do
  alvo; terreno hostil (a corte do inimigo) inverte (+2).
- **Pego desprevenido / desarmado emocionalmente** (o alvo não esperava o assunto): −4
  na Defesa Social no primeiro lance (o "surpreso" social).
- **Sem privacidade / exposto** (o alvo não pode ceder sem perder a face em público): +2
  a +4 na Defesa dele naquilo que custaria vergonha.
- **Ombro a ombro** (aliados reforçando o mesmo pedido): cada aliado engajado no mesmo
  canal soma como um pequeno cerco (ver Amigos do alvo).

---

## 11. Recuperação social

A Firmeza volta rápido, porque abalo social não é ferida de corpo:

- **Recompor-se** (ação Speed 5, você **não ataca** nesse embate, só se defende e
  respira): recupera **+Compostura × 2** de Firmeza e pode trocar de armadura/postura.
  É o "Tomar Fôlego" social.
- **Só defendendo** (você passa o lance sem pressionar, apenas aparando): recupera
  **+Compostura** de Firmeza por Tick. Pressionar (atacar) **não** recupera.
- **Aliado que te reforça** ("um amigo te lembra quem você é"; a ação dele): devolve
  **+Compostura do aliado** de Firmeza a você, ou concede Absorção temporária num canal.
- **Fim da cena**: tirada a pressão e havendo um respiro, a Firmeza volta ao **cheio**.
  Uma derrota social marcante (você foi de fato quebrado) pode deixar uma **sequela
  narrativa** a critério do Mestre (uma dúvida que persiste), não um dano contábil.
- **Força de Vontade** (a reserva de recusa) recupera pelas regras normais de Vontade
  (descanso/cena), não instantaneamente.

---

## 12. Consequências (além de vencer o ponto)

- **Dano à relação**: abordagens de **Ruptura** (ameaça, chantagem) e o abuso de
  **Amigos do alvo** vencem o ponto, mas **feririam a relação**: o alvo cede com
  **ressentimento** e pode virar inimigo, espalhar a mágoa, ou reverter na primeira
  chance. Ganhar assim é acumular dívida.
- **Remorso**: quem cedeu pode, fora da cena, tentar **desfazer** (nova cena, com a
  Firmeza cheia). Ceder não é permanente; é o resultado daquele round social.
- **Público**: ceder em público custa **Brio** ao perdedor (perde reputação), o que o
  torna mais frágil no canal Brio nas próximas cenas até se recuperar.

---

## 13. Balanceamento (por que casa com o físico)

Tudo foi derivado das mesmas fórmulas do combate físico, então um **duelo social entre
dois heróis dura o mesmo tanto de embates que um duelo físico** (ordem de 6 a 10 trocas).
Herói padrão de referência: **Influência 4, Compostura 4, Sociabilidade 4, Centelha 2,
Virtudes ~3, Vontade 7**.

- **Firmeza** 37  =  PV 37 (Compostura×3 casa com Vigor×3).
- **Defesa Social** 20  ~  Defesa física 18.
- **Ataque social** típico: 4d6 (≈14) + Peso (0–3) + Centelha 4 ≈ **18–21** contra Defesa
  20: acerta em pouco mais da metade dos bons lances, como no físico.
- **Dano líquido** por golpe que passa: Dado (1–3d6) + Margem + Influência 4, menos
  Absorção do canal (Virtude 3–5 + Centelha 1 + armadura 0–10). Num canal **descoberto**,
  ~4 a 8 por golpe → ~6 a 9 embates para levar 37 a zero. Num canal **blindado**,
  quase nada: por isso trocar de canal (ou furar com Penetração/indireta) é a tática, do
  mesmo jeito que se troca Corte por Impacto contra placa.
- A **recusa com Vontade** é a válvula que impede o alvo de ser atropelado, ao custo do
  recurso que ele também gostaria de gastar em Proezas e Artes: uma escolha, não um
  escudo grátis.

Escalas de Centelha e as trilhas de modificador das Proezas (bônus ×3, etc.) já valem
igual aqui: uma Proeza social de nível 3 daria +9 a um ataque ou defesa social, exatamente
como no físico. Por isso o sistema base fica pronto para receber Proezas sem recalibrar.

---

## 14. Exemplos de combate

### Exemplo A — Sedução na corte (trocar de canal)

**Lírio** (cortesão) quer que a **Dama Vesna** aceite um encontro privado.
- Lírio: Influência 4, Sedução 4, Manha 3, Centelha 2. Usa **Perfume** (+2 Peso a Coração).
- Vesna: Compostura 4, Sociabilidade 4, Centelha 1 → **Defesa Social 18**, **Firmeza 37**.
  Virtudes: Temperança 3, Convicção 4, Valor 3, Compaixão 3. Vontade 7. Veste **Coração
  comprometido** (ama outro): Absorção de Coração +8.

**Lance 1 (Coração, Sedução + perfume):** pool (4+4)/2 = **4d6**, soma 8 par (sem +2).
Rola 14, + Peso (Sedução +2, perfume +2 = +4) + Centelha 4 = **22** vs 18 → acerta,
Margem [(22−18)/6] = 0. Dano bruto = 2d6 (≈7) + 0 + Influência 4 = **11**. Absorção de
Coração = Temperança 3 + Centelha 1 + armadura 8 = **12**. Líquido **0**. O coração
comprometido é uma muralha: a sedução ricocheteia.

**Lírio muda de canal para Brio (provocação ao orgulho dela):** perícia Manha 3. Pool
(4+3)/2 = 3d6 +2 (soma 7 ímpar). Rola 11 +2 + Peso 2 + Centelha 4 = **19** vs 18 → acerta,
Margem 0. Tag **Finta**: a Defesa dela cai −3 no próximo lance. Dano de **Brio** = 1d6
(≈4) + 0 + Influência 4 = 8, menos Absorção de Brio = Valor 3 + Centelha 1 + armadura 0 =
4 → **líquido 4**. Firmeza 37 → 33. O flanco descoberto era o orgulho, não o coração.

Lição: contra armadura pesada num canal, **troca-se de canal**. Vesna ainda pode
**recusar com Vontade** um lance perigoso, ou **Recompor-se** para respirar.

### Exemplo B — Pechincha dura (Ganho, indireta, recusa e recompor)

**Mercador Talo** quer que o **Capitão Bran** compre um lote acima do justo.
- Talo: Influência 4, Negociação 4, Centelha 1.
- Bran: Compostura 3, Sociabilidade 2, Centelha 1 → **Defesa Social 12**, **Firmeza 34**.
  Compaixão 2 (Absorção de Ganho baixa), Vontade 6. Sem armadura de Ganho.

**Talo (Presente/suborno, indireta):** pool (4+4)/2 = 4d6 (≈14) + Peso 2 + Centelha 2 =
**18** vs 12 → acerta, Margem [(18−12)/6] = 1. Dano de **Ganho** = 2d6 (≈7) + Margem 1 +
**0** (indireta) = 8, menos Absorção de Ganho = Compaixão 2 + Centelha 1 = 3 → **líquido
5**. Firmeza 34 → 29. O suborno morde: Bran não tem couraça contra o próprio interesse.

**Bran recusa o segundo lance com Vontade** (−1 Vontade → 5): aquele golpe vira erro, dano
0. Ele bate o pé por princípio, mas gastou recurso.

**Bran Recompor-se** (não ataca): +Compostura×2 = +6 de Firmeza (29 → 34, teto no máximo).
Ele se refez, mas deu um lance de graça ao mercador. A pechincha vira uma queda de braço
de recursos: quem tem mais Vontade e paciência ganha.

### Exemplo C — Cerco pelos amigos (indireta, penetração total)

**Conselheira Iselda** precisa que o teimoso **Barão Ruvic** apoie uma trégua. Ataque
direto falha: Ruvic tem **Orgulho de casta** (Brio +8) e **Ceticismo** (Razão +6). Nenhum
canal direto passa.

Iselda usa **Amigos do alvo** (arma de cerco, indireta, pesada): mobiliza a irmã e o
velho mestre-de-armas de Ruvic para pressioná-lo no mesmo canal Brio. Pool de Liderança,
**Penetração total**: ignora a armadura social **pessoal** de Ruvic (o orgulho não protege
contra quem ele respeita). Dano de Brio agora só enfrenta a Absorção natural (Valor +
Centelha), não os +8 de casta. Leva Ticks (Speed 7) para orquestrar, mas fura onde o
ataque frontal batia em muralha. É o "cerco" do combate social: lento, indireto, decisivo.

---

## 15. Folha de referência (resumo)

- **Firmeza (PV social)** = 25 + Compostura×3. Zerou → **cede o ponto**.
- **Defesa Social** = (Compostura + Sociabilidade + Centelha)×2 + esp.
- **Ataque** = [(Influência+Perícia)/2]d6 (+2 ímpar) + Peso + Centelha×2. Acerta se > Defesa. **Margem** = [(atk−def)/6].
- **Dano** = Dado + Margem + Influência (só direta) − Absorção do canal.
- **Absorção do canal** = Virtude (Razão·Convicção / Coração·Temperança / Brio·Valor / Ganho·Compaixão) + Centelha×1 + armadura social.
- **Recusar** = −1 Vontade anula um golpe. **Recompor-se** = +Compostura×2 de Firmeza.
- **Iniciativa** = 1d6 + Perspicácia + Sociabilidade. **Speed**: leve 5 / média 6 / pesada 7.
- **Abalo** por % de Firmeza (mesma tabela do físico). **QA** semeia dúvida.

---

## 16. Decisões que tomei e possíveis ajustes

- **Firmeza = Compostura×3 (sem somar Vontade)**: mantém o teto na régua do PV. Vontade
  ficou como reserva de **recusa**, não como parte do pool (evita Firmeza inflada). Se
  quisermos duelos sociais mais longos, dá para somar `+ Vontade` à Firmeza depois.
- **Absorção natural por Virtude, 1 por canal** (Convicção/Temperança/Valor/Compaixão),
  com **Compaixão** virando **brecha** vs pena. Alternativa: deixar o Mestre escolher a
  Virtude por ficção, sem tabela fixa.
- **Recusa com Vontade = anula um golpe** (limite = seu pool). Alternativa mais suave:
  a recusa dá +6 na Defesa naquele lance em vez de anular, para não travar embates contra
  alvos de Vontade altíssima.
- **Canais em 4** (Razão/Coração/Brio/Ganho), cada um com Absorção própria (mais limpo
  que a fusão de categorias do físico). Mantive **Penetração** e **Ruptura** como as
  táticas de furar armadura.
- **Ceder é o ponto, não a mente**; consequências (ressentimento, remorso, perda de Brio
  público) modelam o custo de vencer feio. Isso mantém o combate social separado do
  Mental (magia).
- **Perfumes/presentes** entraram como **temperos** (somam Peso), e **suborno/amigos do
  alvo** como **armas** próprias (indiretas), atendendo à sua lista.
- Ainda **sem Proezas**: as trilhas de bônus ×3 já encaixam por cima quando entrarmos
  nelas, sem recalibrar o base.
