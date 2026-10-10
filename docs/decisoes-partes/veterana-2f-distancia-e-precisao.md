# Centelha RPG · Distância e precisão do tiro · Documento 2f (fecha as respostas do autor ao 2e)

> **Cabeçalho do Arquiteto (10/10/2026). Esta cópia não é exata e tem quatro correções do autor por cima do texto original, que segue abaixo sem alteração:**
>
> 1. **A cópia não é exata:** o endereço claude.ai do §13 foi removido de propósito (repositório público).
> 2. **§8.4 (Preso):** o agarrão **não gera Preso**; gera só **Agarrado** (D-081). O Preso vem da **boleadeira, da rede e de Arte de prender**. Onde o texto abaixo lista "agarrão" entre as origens do Preso (§8.4 e a tabela do §8.5), leia sem ele.
> 3. **§8.3 e adendo, item 8 (Agarrado e Imobilizado):** substituídos pela **D-081 corrigida** (`decisoes.md`). Vale o item 23 da D-019 com duas mudanças: Esquiva −8 e Bloqueio −4 do agarrado, só contra quem está de fora; Imobilizado com as Defesas zeradas (Esquiva e Bloqueio, não a Defesa de agarrão). O agarrado não age, não rola e só se solta quando quem controla erra; "não pode atacar quem está de fora" e "age só contra quem o agarra" **não valem**.
> 4. **Teto de Defesa (§8.1 e §8.2):** o teto de **+6 continua valendo para os BÔNUS** de Defesa; só as **penalidades** ficam sem teto (D-078).
>
> Decisões posteriores que mexem neste texto: D-083 (Rajada e dupla), D-084 (Arte no Tick do Golpe), D-085 (Plumbata 35 pc), D-086 ("Sem equilíbrio" × Caído fechado, a cargo do Mestre; §8.5 e §13, item 3), D-087 (Princípio do Mestre).

Escrito pela Veterana em 09/10/2026. **Substitui** `veterana-2e-distancia-e-precisao.md` (que fica como histórico, não se altera), junto com o 2d e o 2c. Este arquivo é completo e autônomo: o leitor (outro Claude, o Arquiteto) não precisa dos anteriores. Nada foi editado no site.

Base de leitura: site `https://f-neves.github.io/centelha-rpg`, cópia local `tmp/veterana/site-13/txt` (deploy 85f623b, lida em 06/10/2026). Documento irmão: `veterana-2b-reforma-pgr.md` (reforma de Preparo/Golpe/Recuperação, que define as classes de Arremesso e os arcos).

Etiquetas: **[autor]** decisão do autor; **[site]** o que o site diz hoje; **[Veterana]** proposta ou cálculo meu; **[dado]** dado real de fonte externa (qualidade na seção 16); **[inferência]** palpite meu sem dado direto. Referências como `combate l.NNN` são linhas dos arquivos de `site-13/txt`.

## 0. O que mudou em relação ao 2e

O autor respondeu tudo o que o 2e deixou em aberto (seções 10, 13 e 15). Todas as decisões abaixo são [autor].

**Conflitos da seção 15 do 2e**

| # | Resolução |
| --- | --- |
| C1 Imobilizado (site −4) | vale o autor: Defesas zeradas |
| C2 Agarrado (site −2) | vale o autor: Esquiva −8, Bloqueio −4, só contra quem está de fora (ver A3) |
| C3 Surpreso e cego (site −4) | vale o autor |
| C4 Porte simétrico no corpo a corpo | vale o autor: só o menor ganha |
| C5 Preso (estados do agarrão) | resolvido na A4 |
| C6 Esquiva 0 de criaturas grandes | vale o autor: defesas normais |
| C7 Normal × P/G/R | vale o que o autor já disse: o Normal soma a mesma pressão |

**Ambiguidades da seção 15 do 2e**

| # | Resolução |
| --- | --- |
| A1 | **Sem teto nenhum** nas penalidades de Defesa (o teto de ±6 do site deixa de existir); tudo se soma; a Defesa nunca fica abaixo de 0 (seção 8.1) |
| A2 | Pouco espaço: o escudo perde o bônus **e** o Bloqueio leva −4. «Sem equilíbrio × Caído» fica como pendência (seção 13) |
| A3 | Agarrado não ataca quem está de fora; Esquiva −8 e Bloqueio −4 só contra quem está de fora; entre os dois valem as regras do agarrão (seção 8.3) |
| A4 | Preso tem dois perfis, cada um na sua origem (tabela; Rede). Etiqueta «Prende» vira «deixa o alvo Preso» (seção 8.4) |
| A5 | «Sabe que vai ser atacado» = teste de Percepção + Prontidão (seção 8.2) |
| A6 | Porte sem teto em qualquer ataque; qualquer ataque à distância segue a regra do tiro; enxame usa o tamanho que apresenta nos dois papéis (seção 7) |
| A7 | Só o Curto tem Força máxima padrão (3); Força acima de 8 conta 8 na tabela; Máxima maior do Composto é intencional (seção 5.3) |
| A8 | Atlatl: 1 mão, +2 no Preparo da arma lançada, só com a azagaia (seção 5.2) |
| A9 | O ×2 da Funda e do atlatl multiplica a Máxima final (seção 5.2) |
| A10 | Boleadeira: 1d6−4 + Força, alvo Preso pela tabela (seção 10) |
| A11 | Bumerangue de retorno Cortante: pegar pede Destreza + Arremesso, Dificuldade Média (seção 9) |
| A12 | Mini-faca, kunai e shuriken ficam separadas (seção 10) |
| A13 | Defesa baixa de criaturas grandes: fica para quando as fichas forem refeitas (seção 7) |

**Regra nova: tempo de voo** (seção 3.1), que vale no P/G/R.

**Catálogo** (seção 10): a linha «Dardos» é **substituída pela Plumbata**; Bumerangues, Shuriken, Mini-faca, Kunai e Boleadeira com números novos; tabela final de Arremesso.

## 1. Resumo em doze linhas

1. **Distância Efetiva** (sem penalidade de acerto) é um número **por arma**, para alvo Médio, independente do personagem. [autor]
2. Além dela: **−3 por meia Efetiva**, incremental, **sem teto**, sem «zona de sorte». A Efetiva é sempre par. [autor]
3. **Tempo de voo:** cada incremento além da Efetiva soma **1 Tick** entre o Golpe e a chegada (o mesmo número de incrementos da penalidade). O alvo se defende no Tick da chegada. [autor]
4. **Máxima do arremesso:** a do site (FAA e peso). **Máxima dos arcos:** tabela por Força no arco. **Bestas:** tabeladas. [autor]
5. A Efetiva pode ser maior que a Máxima; o personagem joga sempre sem penalidade. [autor]
6. **Funda:** Máxima ×2. **Atlatl:** item extra, só com a azagaia, ×2 na Máxima, +1× Força no dano, +2 no Preparo. O propulsor não muda a Efetiva. [autor]
7. **Dois bumerangues:** de caça (pesado, 0,7 kg, 16 m, não volta) e de retorno (médio, 300 g, 20 m, volta). **A Plumbata substitui os Dardos.** [autor]
8. **Porte sem teto:** corpo a corpo, só o menor ganha (+3 por categoria) e o maior ataca sem penalidade; qualquer ataque à distância, relativo nos dois sentidos (±3). [autor]
9. **Defesa sem teto de penalidades**: tudo se soma, o piso é 0. Defesa 0 para surpreso, imobilizado total, dormindo e desacordado. [autor]
10. Tabela de restrição de corpo e de lugar para o Mestre; Preso (Esquiva −4), Rede (−2 nas duas, −1 por grau de Margem), Agarrado (−8/−4 só contra quem está de fora). [autor]
11. O preço dos arcos registra três botões (Efetiva, Máxima, Força máxima); os valores ficam para o modelo de economia. [autor]
12. Os textos do site são reescritos **depois** que a parte de armas de arremesso e distância estiver fechada. [autor]

## 2. O que o leitor precisa saber do sistema

- Jogada de ataque: pool de d6 = [(Atributo + Habilidade) ÷ 2] dados (+2 ao total se a soma for ímpar), mais o Acerto da arma, mais 2 × menor(Centelha, Habilidade). **Acerta se o total supera a Defesa; empate erra.** A Defesa (Esquiva e Bloqueio) é um valor fixo e passivo. Atributos mortais vão de 1 a 6, Habilidades de 0 a 6. [site]
- **Margem:** a cada 6 pontos acima da Defesa, o dano ganha +1d6 (`combate l.16`). [site]
- Dificuldades: 5 Fácil, 10 Média, 15 Difícil, 20 Limite humano, 25 Excepcional, 30 Sobre-humano (`acoes-e-sistema l.16-23`). [site]
- Atributo e Habilidade do tiro: o que a arma já rola (Arremesso: Destreza + Arremesso; arco e besta: Percepção + Atirador). [autor]
- Combate em Ticks: Preparo, Golpe (1 Tick) e Recuperação (P/G/R), cobrando −2, −4 e −2 de Defesa por ataque até a próxima ação (Guarda sob pressão, sem teto). Reforma em `veterana-2b-reforma-pgr.md`. Classes de Arremesso: leve 2/1/1 (Velocidade 4, 1d6−4), média 3/1/1 (5, 1d6−2), pesada 3/1/2 (6, 1d6), Funda 4/1/1 (6, 1d6); arcos 4/1/1 (Curto, Velocidade 6), 4/1/2 (Longo e Composto, 7); bestas P7/1/1, P9/1/2, P12/1/2 (Velocidades 9, 12 e 15). [autor]
- **Dano de arremesso:** o dado da arma mais a Força inteira (régua do dano, `armas l.16`; tag «Arremessável · Munição · Pesada: usar Força total», `armas l.46`). Arcos somam Força (Curto até +3, Longo inteira, Composto ×2 com Força 4 ou mais); bestas não usam Força. [site]
- **Distância Máxima de arremesso** [site]: FAA = Força × 2 + Atletismo + Arremesso (2 a 24); Máxima = 7 × FAA^0,7 ÷ peso^0,4 metros (peso em kg); só se arremessa o que cabe na coluna «Arremessa até» da tabela do FAH (de 8 kg no FAH 3 a 125 kg no FAH 24); a partir de 80% desse teto cai em linha reta até 0; a fórmula vale de 100 g para cima (abaixo disso é lacuna do site, irrelevante para o autor).
- **Defesas do site hoje, parte superada por este documento:** a tabela de situações dá −4 a «Alvo surpreso, cego ou imobilizado» (`combate l.408`); o agarrado leva −2 contra quem o ataca de fora (`combate l.194`, `l.406`); o Imobilizado tem Defesa −4 (`combate l.200`); os modificadores situacionais empilham até ±6 (`combate l.410`). Estados do agarrão: Preso (rede ou Arte; não se desloca, mas age), Agarrado (não age), Imobilizado (`combate l.196-200`).
- **Porte do site hoje, superado** (`combate l.422-435`): Miúdo, Pequeno, Médio, Grande, Enorme, Imenso, Colossal; +3 ao acerto por categoria de diferença (alvo − atacante), teto ±12, simétrico, só no acerto, fora do teto de ±6, não se aplica a ataques Sociais ou Mentais. A **Couraça de Porte** (+2 Grande, +4 Enorme, +7 Imenso, +10 Colossal em Corte e Perfuração) devora o dano de quem é menor.

## 3. O modelo de penalidade (decidido)

Seja E a Distância Efetiva da arma e d a distância ao alvo. [autor]

- Se d ≤ E: sem penalidade.
- Se d > E: n = ⌈(d − E) ÷ (E ÷ 2)⌉ incrementos; penalidade de **−3 × n** no acerto.
- Sem teto. Não existe «zona de sorte»: quando o total necessário fica fora do alcance do pool, o jogador sabe que só acerta por sorte.

Exemplo, faca (E = 10 m, incremento 5 m): até 10 m, 0; de 10 a 15 m, −3; de 15 a 20 m, −6; de 20 a 25 m, −9; de 25 a 30 m, −12.

Chance de acerto contra **Defesa 0** (alvo parado, Acerto +1), em múltiplos da Efetiva (x = d ÷ E) [cálculo exato da Veterana, dados d6]:

| x | 1,5 | 2 | 2,5 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Penalidade | −3 | −6 | −9 | −12 | −18 | −24 | −30 |
| 2d6 | 97% | 72% | 28% | 3% | 0% | 0% | 0% |
| 4d6 | 100% | 100% | 95% | 76% | 16% | 0% | 0% |
| 6d6 | 100% | 100% | 100% | 99% | 79% | 28% | 2% |
| Referência física (1/d²) | 42% | 24% | n/d | 11% | 6% | 4% | n/d |

Leitura: o −12 é «proibitivo» para o 2d6 (3% em 3 × E). Quem tem mais dados (especialidade, artefato, Proezas, Centelha) contorna a penalidade e some em 4 a 6 × E. Os recordes cabem: machado de 27,5 m com alvo de 1 m (Feret) fica em 2,3 × E (12 m) com −9, e um 6d6 acerta quase sempre; machado de 67 m fica em 5,6 × E (6d6 abaixo de 28%, sorte); faca de 42 m fica em 4,2 × E (−21, cerca de 55% para um 6d6). Com −4 por incremento esses recordes não fechariam. O jogo é mais generoso que a física contra Defesa 0; contra alvo que se mexe, a Defesa normal soma e a sorte chega bem antes. O autor confirmou que as tabelas contra Defesa 0 descrevem só alvo parado e que alvo em movimento a grande distância deve ser quase impossível de acertar sem magia ou Proeza. [autor]

Por que a metade: o formato «−4 a cada Efetiva inteira» (recomendação anterior da Veterana) dava só −4 em 2 × E e deixava o 4d6 em 100% a 2 × E. A escolha foi pela taxa (−6 por Efetiva) e pela suavidade dos degraus.

### 3.1 Tempo de voo (regra nova, vale no P/G/R) [autor]

- Até a Distância Efetiva, o projétil chega **no mesmo Tick do Golpe**.
- Cada incremento além da Efetiva soma **1 Tick** entre o Golpe e a chegada ao alvo. É o mesmo número n de incrementos que dá a penalidade: **−3 por incremento = +1 Tick por incremento**.
- O alvo se defende **no Tick em que o projétil chega**.
- O bumerangue de retorno volta no mesmo número de Ticks que levou para ir.
- No sistema **Normal**, o tiro continua rolado na declaração.

Exemplos [cálculo da Veterana]: faca a 25 m (E 10, incremento 5): n = 3, −9 e chega 3 Ticks depois do Golpe. Arco Longo a 150 m (E 50, incremento 25): n = 4, −12, +4 Ticks. Arco Longo na Máxima de 250 m: n = 8, −24, +8 Ticks. Besta Grande a 160 m (E 80, incremento 40): n = 2, −6, +2 Ticks. Funda a 52 m (E 26, incremento 13): n = 2, −6, +2 Ticks.

## 4. Distâncias Efetivas por arma (alvo Médio)

Critério [autor]: a distância em que o personagem, ao tentar acertar, **usa todas as suas capacidades sem a distância atrapalhar**. Método da Veterana para o arremesso: distância de competição em que um praticante treinado acerta um alvo de **50 cm** quase sempre, ×2 para alvo Médio (a chance cai com 1/d²; uma pessoa de 1,5 a 2 m de frente tem uns 0,5 a 0,7 m², equivalente a um círculo de 0,8 a 0,95 m, ou 1,6 a 1,9 vezes o de 50 cm; ×2 é arredondamento seguro, porque o erro vertical domina). Só dobram as armas cujo dado de partida era de alvo de 50 cm (faca, mini-faca, kunai, shuriken, machado).

### 4.1 Arremesso e Funda

| Arma | Efetiva (incremento) | Base | Qualidade |
| --- | --- | --- | --- |
| Adaga de Arremesso (faca) | **10 m** (5) | provas 3 a 7 m com alvo de 50 cm; padronizadas 3,7 e 5,5 m | alta |
| Mini-faca | **8 m** (4) | analogia com a faca, mais leve | baixa |
| Kunai | **8 m** (4) | analogia com a faca | baixa |
| Shuriken | **10 m** (5) | provas de 5 a 6 m | média |
| Machado de Arremesso | **12 m** (6) | provas 4 a 10 m; padronizadas 3,7 e 4,6 m | média-alta |
| Pilum | **12 m** (6) | 20 a 30 m citados; metade do catálogo antigo | média |
| Plumbata | **14 m** (7) | plumbata: extremo 30 a 40 m, metade 15 a 20 m; o autor fixou 14 | média |
| Azagaia | **16 m** (8) | caça com lança: 10 a 30 m, média 15 m (arredondada para par) | média |
| Boleadeira | **16 m** (8) | 15 m «particularmente útil», 35 m de alcance prático (fontes fracas) | baixa |
| Bumerangue de caça | **16 m** (8) | autor (troca alcance por dano) | baixa |
| Bumerangue de retorno | **20 m** (10) | autor (mais leve e mais preciso que o de caça); o esporte mede anéis de 2 a 10 m | baixa |
| Rede | **4 m** (2) | rede de uns 3 m de diâmetro; nenhum dado | baixa |
| Funda | **26 m** (13) | treino da funda balear: 30 e 45 passos (~19,5 e 29 m), arredondada para par | média-baixa |

Todos [autor] (aprovados na conversa). Observações:
- Armas que giram (faca, machado, shuriken) só são precisas em distâncias em que completam o giro (na franciscana, de memória: 1 volta a 4 ou 5 m, 2 a 8 ou 9 m, 3 a 12 ou 13 m); armas que voam retas (plumbata, pilum, azagaia, atlatl) não têm essa restrição. Corrigido o tamanho do alvo, os dois grupos ficam parecidos: atlatl 15 a 25 m com alvo de 120 cm equivale a 6 a 10 m com alvo de 50 cm, igual ao machado. Por isso **o propulsor não muda a Efetiva** [autor]: azagaia com atlatl usa a Efetiva da própria arma, e a Funda fica em 26 m.
- A Plumbata substitui os Dardos do site (Efetiva antiga 12 m, Distância 30 m). «Dardo olímpico não existe neste mundo.» [autor]
- Descartado: «Efetiva = Destreza + Arremesso» (função do personagem). O treino entra pelo pool.

### 4.2 Arcos e bestas

| Arma | Efetiva (incremento) | Base |
| --- | --- | --- |
| Arco Curto | **30 m** (15) | autor |
| Arco Longo | **50 m** (25) | autor |
| Arco Composto | **70 m** (35) | autor |
| Besta Pequena | **40 m** (20) | autor |
| Besta Média | **60 m** (30) | autor |
| Besta Grande | **80 m** (40) | autor |

- Os arcos partem de provas modernas normalizadas para alvo Médio (olímpico 70 m com alvo de 122 cm ≈ 57 m; kyudo 28 m com alvo de 36 cm ≈ 78 m; caça 20 a 30 jardas com zona vital de 23 cm ≈ 78 a 117 m), **reduzidas** pelo autor porque os arcos de hoje são melhores que os medievais. A Efetiva não depende da Força do arqueiro.
- A besta ganhou Efetiva maior que a do arco da mesma faixa: «pode ser mirada com mais facilidade, é um bom buff, porque elas já têm Velocidades muito altas comparadas com os arcos». O dado que segura o topo é «eficaz até uns 100 m» (fonte fraca).
- Sem dado direto: comparação de treino medieval entre arco curto e longo. As Efetivas do Curto e do Composto são extrapolações a partir do Longo.

## 5. Distância Máxima

### 5.1 Arremesso

Fórmula do site mantida (seção 2). O peso aproximado de cada arma consta numa **coluna «Peso»** da tabela de arremesso (seções 6 e 10). [autor] **A Efetiva pode ser maior que a Máxima**: o personagem joga sempre sem penalidade (exemplo: FAA 2 e pilum de 2 kg dão uns 8,6 m de Máxima contra 12 m de Efetiva). A regra do site «para mirar bem, conte com algo em torno de metade» do tiro extremo passa a valer só como teto; na prática a Efetiva é de 20 a 40% da Máxima nos arcos e bem menos no arremesso.

### 5.2 Funda e atlatl [autor]

- **Funda:** multiplica a **Máxima final** do arremesso por **×2** (calcula-se a Máxima normal pela fórmula e dobra-se). A pedra de 100 g vai a 93 / 176 / 245 / 325 m com FAA 4 / 10 / 16 / 24. Substitui os 200 m do site e os 100 m fixos da reforma P/G/R. Dado de referência: recorde de funda 477 m. Dano continua 1d6, Impacto, Força inteira.
- **Atlatl:** **item extra**, não arma. Funciona **só com a azagaia** (a plumbata se lança à mão e não usa atlatl). Efeitos na arma lançada: **×2 na Máxima final**, **+1× Força no dano** (a azagaia, que somava 1× Força, passa a somar 2× Força) e **+2 no Preparo**. Usa **1 mão**, a mesma que lança. Azagaia de 800 g com atlatl: 40 / 77 / 107 / 142 m (FAA 4 / 10 / 16 / 24). Dado: atlatl com alcance de 250 m ou mais.
- **O propulsor não muda a Efetiva** (seção 4.1).
- Observação [cálculo da Veterana]: o recorde de javelin (98 m, 800 g) passa da Máxima do FAA 24 sem atlatl (71 m), mas fica abaixo do FAA 24 com atlatl (142 m). A fórmula do site é mais conservadora que o recorde; não é erro, só vale saber.

### 5.3 Arcos: tabela de Força [autor]

**Força no arco = o menor valor entre a Força do personagem e a Força máxima do arco.** A besta não usa Força e tem Máxima tabelada: Pequena 100 m, Média 200 m, Grande 300 m.

| Força no arco | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Arco Curto | 50 m | 90 m | 120 m | 140 m | 155 m | 170 m | 180 m | 190 m |
| Arco Longo | 100 m | 180 m | 250 m | 295 m | 325 m | 350 m | 370 m | 390 m |
| Arco Composto | 120 m | 215 m | 300 m | 355 m | 390 m | 420 m | 445 m | 465 m |

Referências: Força 1 é criança ou pré-adolescente (arco juvenil de 15 a 25 lb); Força 2 é adulto comum (bate com as provas tradicionais de longa distância, cerca de 165 m com 45 lb); Força 3 é adulto forte (60 a 70 lb); Força 6 é o máximo humano (140 a 160 lb, o topo do Mary Rose). As Forças 7 e 8 dão margem para personagens e criaturas muito fortes, com ganho pequeno, porque acima do humano o limite é o arco e a flecha.

Regras de Força máxima do arco [autor]:
- **Só o Curto tem Força máxima padrão: 3.** Existem Curtos reforçados, com Força máxima maior, mais caros. **O Longo e o Composto não têm Força máxima por padrão**: neles, a Força no arco é a Força do personagem.
- **Força acima de 8 conta como 8 na tabela.**
- **Força mínima = Força máxima do arco − 3** vale **só nos arcos que têm Força máxima definida** (reforçados, de criatura); quem não tem não consegue armar.
- A mesma Força no arco continua limitando o bônus de Força no dano.
- A **Máxima maior do Composto em qualquer Força é intencional.**

Importância prática da Máxima: com Efetiva de 50 m e incremento de 25 m, o Longo dá a um 4d6 contra Defesa 0 76% a 150 m, 16% a 200 m e 0% a 250 m. Só um 6d6 alcança a Máxima, com 28%. Dados: arco longo inglês eficaz em combate 100 a 150 m, até 200 contra quem não usa armadura; maior tiro verificado em guerra uns 275 m; arco mongol uns 365 m; recorde moderno de voo 539 m (arco de voo, não de combate).

## 6. Pesos e Máximas de referência

Pesos sugeridos pela Veterana e **aceitos pelo autor**, com as exceções dos bumerangues e da Plumbata. Coluna «Peso» na tabela de Arremesso (seção 10); tabela de Atirador (arcos e bestas) separada. [autor] Máximas pela fórmula do site (sem o teto de carga) para FAA 4 (fraco), 10 (médio), 16 (forte), 24 (máximo). Abaixo de 100 g o cálculo usa 100 g.

| Arma | Peso | FAA 4 | FAA 10 | FAA 16 | FAA 24 | Base do peso |
| --- | --- | --- | --- | --- | --- | --- |
| Shuriken | 50 g | 46 m | 88 m | 122 m | 163 m | de memória (30 a 60 g) |
| Mini-faca | 100 g | 46 m | 88 m | 122 m | 163 m | inferência |
| Kunai | 150 g | 39 m | 75 m | 104 m | 138 m | inferência |
| Plumbata | 200 g | 35 m | 67 m | 93 m | 123 m | autor: reconstruções do grupo Comitatus, 60 a 120 g na versão curta e 170 a 200 g nas pesadas |
| Adaga de Arremesso | 250 g | 32 m | 61 m | 85 m | 113 m | de memória 200 a 300 g |
| Bumerangue de retorno | 300 g | 30 m | 57 m | 79 m | 105 m | autor |
| Bumerangue de caça | 700 g | 21 m | 40 m | 56 m | 75 m | autor (kylie, uns 0,7 kg) |
| Machado de Arremesso | 700 g | 21 m | 40 m | 56 m | 75 m | de memória 0,5 a 1 kg |
| Azagaia | 800 g | 20 m | 38 m | 53 m | 71 m | javelin olímpico masculino, 800 g (memória) |
| Boleadeira | 600 g | 23 m | 43 m | 60 m | 79 m | inferência |
| Pilum | 2 kg | 14 m | 27 m | 37 m | 49 m | de memória uns 2 kg |
| Rede | 3 kg | 12 m | 23 m | 31 m | 42 m | inferência |
| Funda (pedra) | 100 g | 93 m | 176 m | 245 m | 325 m | ×2 da Funda já aplicado; pedras de recorde 52 e 62 g |
| Azagaia com atlatl | 800 g | 40 m | 77 m | 107 m | 142 m | ×2 do atlatl já aplicado |

- O machado de 67 m do recorde de Guinness fica abaixo da Máxima do FAA 24 (75 m).
- Personagens de FAA 10 têm Máxima maior que a Efetiva de qualquer arma da lista; só FAA 2 a 4 com objeto de 2 kg ou mais ficam abaixo da Efetiva.

## 7. Porte [autor]

- **Sem teto em ataque nenhum**: **+3 por categoria de diferença, sem limite**, à distância e no corpo a corpo. (Substitui o teto ±12 do site.)
- **Corpo a corpo:** só o **menor ganha bônus** contra o maior. O maior ataca o menor **sem penalidade**. Motivo de jogo, não de física: as criaturas grandes devem ser temidas pelas menores (e já atacam com Força e pools de 7d6 ou mais).
- **Qualquer ataque à distância** (arremesso, projétil, arco, besta, ataque mágico, Artes físicas à distância) segue a regra do tiro: **relativa nos dois sentidos**. Alvo maior que quem ataca: **+3 por categoria**. Alvo menor: **−3 por categoria**. Quem é grande está acostumado a alvos do seu tamanho: uma criatura Grande acerta um coelho com mais dificuldade que uma Pequena.
- **O enxame usa o tamanho que apresenta nos dois papéis**, como alvo e como atacante: um enxame de ratos de 3 m é Médio também ao atacar.
- Atirar num Colossal muito longe continua difícil (**aceito**): o porte não escala a Efetiva, entra só como bônus fixo no acerto.
- Criaturas maiores que Médio lutando entre si: **sem bônus de Defesa**. Entra uma **nota para o Mestre** sugerindo aumentar a Defesa delas nesses casos.
- **Defesa baixa de criaturas grandes** (o Verme Púrpura Imenso do bestiário tem Defesa 4): fica para quando as fichas das criaturas forem refeitas. **Não se recalculam desafios agora.** Antes da fase de testes as fichas serão refeitas. [autor]
- Tiro: relativo nos dois sentidos coincide com o texto do site (que era simétrico). A mudança está no corpo a corpo (só o menor ganha) e na retirada do teto.

## 8. Defesa do alvo [autor]

### 8.1 Soma livre e piso 0

- **Penalidades de Defesa não têm teto nenhum.** O teto de ±6 do site (`combate l.410`) deixa de existir. **Tudo se soma:** condição, tabela de restrição, modificadores de situação (cobertura, flanco, prono, postura), Guarda sob pressão.
- A **Defesa nunca fica abaixo de 0.**
- **Defesa 0 nas duas defesas** (basta total 1 para acertar): surpreso (não sabe do ataque), totalmente imobilizado, dormindo, desacordado.
- Regra geral: sempre que o personagem **não souber do ataque** ou **não tiver como se defender**, a Defesa correspondente é zerada. **Ataque imbloqueável** zera só o Bloqueio; **inesquivável** zera só a Esquiva; os dois juntos zeram tudo.
- Alvo que se mexe e vê o ataque: Defesa normal. Alvo em movimento a grande distância deve ser quase impossível de acertar sem magia ou Proeza; as tabelas contra Defesa 0 descrevem só alvo parado.

### 8.2 Cego, vendado, escuro total

**Cego, vendado ou no escuro total, sabendo que vai ser atacado:** **Esquiva −4 e Bloqueio −8** (aparar às cegas é muito mais difícil que esquivar). Sem saber do ataque vale «surpreso» (Defesa 0).
- Se ele **sabe** que vai ser atacado é decidido por um **teste de Percepção + Prontidão**, descrito nas Ações, junto de se esconder. O **atacante invisível** usa o mesmo teste.
- A **penumbra** fica sem regra própria, a critério do Mestre.

### 8.3 Agarrado e Imobilizado

- **Agarrado:** não pode atacar quem está de fora do agarrão; tem **Esquiva −8 e Bloqueio −4**, que valem **só contra quem está de fora**. Entre os dois do agarrão valem as regras próprias do agarrão.
- **Imobilizado:** Defesas zeradas.

### 8.4 Preso

- **Preso pela tabela** (Parcial, pernas): **Esquiva −4**; não se desloca, mas age. Origens: agarrão, boleadeira e Arte.
- **Preso pela Rede:** **−2 na Esquiva e −2 no Bloqueio, mais −1 por grau de Margem do lançamento.**
- Os dois valem, cada um na sua origem. A etiqueta **«Prende» passa a dizer «deixa o alvo Preso»**.
- Para se soltar da boleadeira e da rede: **Força + Atletismo contra o total do lançamento**.

### 8.5 Tabela de restrição (para o Mestre consultar)

Restrição do **corpo** (só a parte presa conta):

| Nível | Exemplos | Esquiva | Bloqueio |
| --- | --- | --- | --- |
| Leve | pé enroscado, lama funda | −2 | 0 |
| Parcial (pernas) | uma perna presa, Preso (agarrão, boleadeira, Arte) | −4 | 0 |
| Parcial (braços) | um braço preso, arma travada | 0 | −4 |
| Grave | preso pela cintura, Agarrado (só contra quem está de fora) | −8 | −4 |
| Total | amarrado, soterrado, Imobilizado | Defesas zeradas | Defesas zeradas |

Preso pela Rede: −2 e −2, mais −1 e −1 por grau de Margem (regra própria, fora desta escala). Os exemplos «rede nas pernas» e «enrolado na rede» da tabela do 2e foram retirados por mim, porque a regra da Rede os substitui; confirmar (seção 15, item 6).

Restrição do **lugar**:

| Situação | Exemplos | Esquiva | Bloqueio |
| --- | --- | --- | --- |
| Pouco espaço | corredor estreito, entre galhos, túnel | −2 | −4, e o escudo perde o bônus (não está «apto») |
| Sem equilíbrio | corda bamba, telhado inclinado, convés no temporal | −4 | −2 |

Se «Sem equilíbrio» e Caído (o Prono do site) se somam **não foi decidido**: pendência (seção 13).

## 9. Bumerangues [autor]

| | De caça | De retorno |
| --- | --- | --- |
| Peso | cerca de 0,7 kg | cerca de 300 g |
| Voo | reto e baixo, longo | em curva |
| Volta? | não | volta à mão no fim da ação, se errar; **no mesmo número de Ticks que levou para ir** |
| Classe de arremesso | **pesada** (3/1/2, Velocidade 6) | **média** (3/1/1, Velocidade 5) |
| Acerto | +0 | +1 |
| Efetiva | 16 m (incremento 8) | 20 m (incremento 10) |
| Dano | 1d6 (+ Força) | 1d6−2 (+ Força) |
| Uso | combate e caça de animal grande; troca alcance por dano | caçar aves, espantar, distrair; mais leve e mais preciso que o de caça |

- Os dois existem com dano de **Impacto** (madeira, borda arredondada; a versão comum) ou **Cortante** (borda afiada ou metal; mais cara).
- Pegar o de retorno **Cortante** pede **Destreza + Arremesso, Dificuldade Média (10)**; se falhar, ele cai a 1 ou 2 m. O de retorno de Impacto volta à mão sem teste.
- Máximas de referência: seção 6.

## 10. Catálogo de Arremesso: tabela final [autor, salvo onde indicado]

**Velocidade, P/G/R e dano** seguem a classe da reforma (`veterana-2b-reforma-pgr.md`, seção 0). **Armas leves** (Shuriken, Mini-faca, Kunai): Acerto **+1** e dano 1d6−4 (+ Força). A linha **Dardos sai, a Plumbata entra** (Acerto +0, 1d6−2, Velocidade 5, Efetiva 14 m, 200 g, mantém a Perfuração dos Dardos: fura couro). Ela fica entre as leves e as médias: menor e mais fraca que a maioria das médias. As demais linhas da proposta do 2e ficam como estavam; as linhas que já existiam no site mantêm Acerto e Modos do site. Tabela de Atirador (arcos e bestas) é separada.

Tabela de **Arremesso**:

| Arma | Classe (P/G/R) | Modos | Vel | Dano (+ Força) | Acerto | Efetiva (inc.) | Peso | Mãos | Destaque |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shuriken | leve (2/1/1) | ★P(N0) | 4 | 1d6−4 | +1 | 10 m (5) | 50 g | 1 | Ágil, munição. Fina e rasa; só fura pele |
| Mini-faca | leve (2/1/1) | ★P(N0) | 4 | 1d6−4 | +1 | 8 m (4) | 100 g | 1 | Ágil, munição. Faca pequena, fácil de esconder; só fura pele |
| Kunai | leve (2/1/1) | ★P(N0) | 4 | 1d6−4 | +1 | 8 m (4) | 150 g | 1 | Ágil, munição. Mais pesada que a mini-faca, com argola; serve também de ferramenta (o Mestre julga) |
| Adaga de Arremesso | média (3/1/1) | ★P(N0) | 5 | 1d6−2 | +1 | 10 m (5) | 250 g | 1 | Ágil, munição. Facas às dezenas; só fura pele |
| Plumbata | média (3/1/1) | ★P(N1) | 5 | 1d6−2 | +0 | 14 m (7) | 200 g | 1 | Munição. Dardo de guerra romano, curto e pesado, com chumbo; fura couro |
| Bumerangue de retorno | média (3/1/1) | ★I ou ★C (mais cara) | 5 | 1d6−2 | +1 | 20 m (10) | 300 g | 1 | Em curva; volta à mão no fim da ação se errar. O Cortante pede Destreza + Arremesso, Dificuldade Média, para pegar |
| Bumerangue de caça | pesada (3/1/2) | ★I ou ★C (mais cara) | 6 | 1d6 | +0 | 16 m (8) | 700 g | 1 | Reto e baixo; não volta. Troca alcance por dano |
| Machado de Arremesso | pesada (3/1/2) | ★C · I | 6 | 1d6 | +1 | 12 m (6) | 700 g | 1 | Gira no ar; golpe forte e curto |
| Azagaia | pesada (3/1/2) | ★P(N1) | 6 | 1d6 | +1 | 16 m (8) | 800 g | 1 | Javelina: fura à distância ou na estocada em punho. Aceita atlatl |
| Pilum | pesada (3/1/2) | ★P(N2) | 6 | 1d6 | +1 | 12 m (6) | 2 kg | 1 | Anti-escudo: fura placa de N2 e entorta ao cravar |
| Boleadeira | pesada (3/1/2) | ★I | 6 | 1d6−4 (exceção à classe) | +0 | 16 m (8) | 600 g | 1 | Deixa o alvo Preso pelas pernas (tabela: Esquiva −4); escapa por Força + Atletismo contra o total do lançamento |
| Rede | pesada (3/1/2) | ★I | 6 | sem dano | +0 | 4 m (2) | 3 kg | 1 | Deixa o alvo Preso pela Rede (−2/−2, −1 por grau de Margem); escapa por Força + Atletismo contra o total |
| Funda | Funda (4/1/1) | ★I | 6 | 1d6 | +1 | 26 m (13) | pedra de 100 g | 1 | Munição. Máxima ×2 da fórmula; Força inteira no dano |

Linha de **item extra** (não é arma):

| Item | Efeito | Efetiva | Mãos |
| --- | --- | --- | --- |
| Atlatl | Só com a azagaia: **×2 na Máxima final**, **+1× Força no dano** (a azagaia passa a somar 2× Força), **+2 no Preparo** (azagaia com atlatl: P5/G1/R2, Velocidade 8) | a da arma lançada, sem mudança | 1 (a mesma que lança) |

Notas:
- Mini-faca, kunai e shuriken ficam como armas separadas, mesmo quase iguais: o jogador escolhe por estilo. Outras armas do jogo também terão números iguais ou parecidos. [autor]
- Bumerangues: o site tinha uma linha só («Atinge em curva e volta à mão se erra», 1d6, Acerto +1, 50 m, Velocidade 5). As duas linhas novas a substituem.
- Funda: Acerto +1 e ★I vêm do site; Velocidade 6 e 1d6 da reforma.
- Preços das armas novas e da Plumbata ficam com o modelo de economia (hoje «Dardos 5 pc», `custo-qualidade-e-equipamento l.95`).

## 11. Preço dos arcos [autor]

O preço do arco varia pelos botões que ele dá, para o jogador saber quanto custa um arco «personalizado»:
1. **Distância Efetiva** maior (por exemplo, um arco com Efetiva de 70 m em vez de 50 m).
2. **Distância Máxima** maior (por exemplo, um arco bizantino).
3. **Força máxima** do arco (por exemplo, um Arco Curto com Força máxima 6, no lugar da 3 padrão).

**Os valores ficam para o modelo de economia**, que vai precificar cada tipo de arco e as variações pela Força máxima. Sem tabela de preços aqui.

## 12. Decisões descartadas ao longo da conversa

- Distância Efetiva = Destreza + Arremesso (ou Percepção + Atirador), função do personagem: substituída pela Efetiva por arma.
- Distância fixa por arma na coluna «Distância» do catálogo (Bumerangue 50 m, Azagaia 40, Dardos 30, Pilum 25, Machado 12, Adaga 10, Rede 5, Funda 200): a coluna passa a ser a Efetiva; a Máxima do arremesso vem do FAA e do peso.
- Penalidade em bandas por dobra da distância (8, 16, 32, 64 m com −3 a −12): vira escada com patamares, o oposto de incremental.
- Penalidade com teto de −12 e **zona de sorte**: rejeitada pelo autor. «O que determina se é sorte é quando a jogada tem poucas chances de acertar. Uma pessoa com muitos dados, especialidade, artefato, Proezas e magias consegue contornar as penalidades. Vamos aumentar até ficar quase proibitivo.»
- Bônus de porte só do alvo no tiro (tamanho de quem ataca não entra): substituído por relativo nos dois sentidos.
- Teto de ±12 no porte e teto de ±6 nos modificadores de Defesa do site: retirados.
- Máxima dos arcos por fator multiplicativo e variante opcional ao Mestre: substituída pela tabela de Força.
- Máxima da Funda fixa em 100 m (reforma P/G/R): substituída por ×2 na fórmula.
- Escalar a Efetiva pelo porte do alvo (opção «a»): não adotada; vale o bônus fixo de ±3 por categoria.
- Dardos (linha do site): substituídos pela Plumbata. Atlatl com dardo: restrito à azagaia.
- Premissa do ângulo (o autor propôs incrementos maiores em metros conforme a distância): a física mostra o contrário no alcance (de 5° a 10°, sen 2θ varia 0,168; de 40° a 45°, 0,015); o erro que cresce com a distância é o de velocidade e o lateral, e a chance de acertar cai com 1/d². Bandas que alargam dão menos penalidade longe, o oposto de «proibitivo».

## 13. O que falta decidir

1. **Tabela de preços dos arcos** (e das armas novas): modelo de economia (seção 11).
2. **Reescrita dos textos do site** (seção 14), só ao fim e quando o autor mandar.
3. **«Sem equilíbrio» × Caído:** se as penalidades se somam (seção 8.5).

Adiados por decisão do autor, fora desta fase: fichas e Defesas das criaturas grandes, e o recálculo de desafios (seção 7). O artefato `artefatos/alcance-e-precisao.html` (endereço do artefato removido nesta cópia) segue desatualizado (D0 = Atributo + Habilidade, passo por dobra, teto 12, zona de sorte); atualizar **só se o autor pedir**.

Retirado da lista (fechado pelo autor na Missão 2, conteúdo fora deste documento): Rajada, arma em cada mão e ataques múltiplos.

## 14. Textos do site a reescrever quando a parte de armas de arremesso e distância estiver fechada

Todos [site]; nada foi editado. Arquivos de `site-13/txt`.

**Catálogo e armas**
1. **Catálogo, Armas à Distância** (`armas l.68-87`): separar em duas tabelas (**Arremesso**, com coluna «Peso», e **Atirador**, arcos e bestas); a coluna «Distância» vira **Efetiva**; nos arcos entra a **tabela de Força** (Máxima por Força no arco) e a Força máxima; a linha **Dardos sai, entra a Plumbata**; linhas novas (Shuriken, Kunai, Mini-faca, Boleadeira, os dois bumerangues, o atlatl como item extra); Funda deixa de ter 200 m.
2. **Parágrafo introdutório** «Os valores são o tiro extremo ... conte com algo em torno de metade» e «o número é um teto do objeto, não uma promessa» (`armas l.70`).
3. **Parágrafo FAA** (`acoes-corpo-e-movimento l.263`): «A coluna Distância das armas de Arremesso é o teto do objeto, e vale o menor dos dois». Passa a valer a Efetiva por arma, e a Máxima vem do FAA e do peso (Funda ×2, atlatl ×2).
4. **Célula «Arcos somam Força (curto até +3, longo inteira, composto ×2)»** (`armas l.16`): passa a depender de «Força no arco» e da Força máxima do arco.
5. **Tabela de Classes** (`armas l.40-41`): as células «alcance de 100 a 300 m» (Distância) e «alcance de 5 a 200 m» (Arremesso).
6. **Descrição de Funda, Bumerangue (dois), Boleadeira e atlatl**; descrição dos arcos com tabela de Força, Força mínima (Força máxima − 3, só nos reforçados) e nota de preço.
7. **Dardos em outros lugares:** `armas l.83` (linha), `equipamentos l.48` (tabela de equipamento), `custo-qualidade-e-equipamento l.95` (preço), `combate l.54` («também é a Velocidade dos Dardos»), `combate l.219` (exemplo de Perfurante), `combate l.275`, `armas l.132` e `equipamentos l.81` (projéteis rápidos: «flecha, virote, bala de funda, dardo»), `habilidades l.26` (Arremesso: «dardo»), e a lista de armas do índice do bestiário (`bestiario l.20800`: Dardos, Bumerangue). «Dardo flamejante» (Arte, `bestiario l.8495`) é outra coisa e não muda.

**Tempo de voo e Ticks**
8. **Nova regra de tempo de voo** (seção 3.1): texto no capítulo de Combate (P/G/R, perto de «Nas armas de Distância o Golpe cai no último Tick do ciclo», Recarga e exemplo do Bram) e menção no Normal («o tiro continua rolado na declaração»).

**Defesa**
9. **Fim do teto de ±6:** `combate l.410` («O empilhamento destes modificadores ... é limitado a ±6 ... nenhuma soma de vantagens transforma o golpe em acerto (ou erro) automático» e a comparação com o «sem teto» da Pressão e do porte); a tag **Alcance** em `armas` («não entra no teto de ±6»); `combate l.435` («não entra no teto de ±6»).
10. **Tabela de situações da Defesa** (`combate l.396-408`): a linha «Alvo surpreso, cego ou imobilizado: −4» é dividida (surpreso: Defesa 0; cego: Esquiva −4, Bloqueio −8; imobilizado: Defesa 0); a linha «Alvo agarrado ... −2» (`l.406`) cede à tabela de restrição; entra a **tabela de restrição** do corpo e do lugar e o piso de 0.
11. **Parágrafo «A Defesa é um valor fixo e passivo»**: prever o alvo sem Defesa.
12. **Parágrafo «O agarrado»** (`combate l.194`) e o item **Imobilizado** (`l.200`): hoje −2 e −4; passam a Esquiva −8/Bloqueio −4 (só contra quem está de fora) e Defesas zeradas. O agarrado **não ataca** quem está de fora.
13. **Linha do Correndo** (`combate l.327`): «É o mesmo −4 do Tick do Golpe e das condições surpreso, cego e imobilizado». Deixa de ser verdade.
14. **Texto do escudo «apto»** (`combate l.280`): soma-se ao «Pouco espaço» (o escudo perde o bônus e o Bloqueio leva −4).
15. **Preso e Rede:** tag **Prende** (`armas l.47`) vira «deixa o alvo Preso»; definição de **Preso** em Manobras (`combate l.198`) com os dois perfis (tabela e Rede); linha da Rede em `armas l.87` e `acoes-corpo-e-movimento l.290`; Boleadeira.
16. **Cego/invisível:** em Ações (Sentidos e Engano, junto de se esconder) entra o teste de Percepção + Prontidão que decide «sabe que vai ser atacado».

**Porte**
17. **Porte** (`combate l.422-435`): sem teto; corpo a corpo assimétrico (só o menor ganha); qualquer ataque à distância relativo nos dois sentidos; porte pelo tamanho que o alvo apresenta nos dois papéis; nota ao Mestre sobre criaturas maiores que Médio entre si. A frase de Manobras que remete ao porte (`combate l.182`) acompanha a mudança, e a exclusão de ataques Sociais e Mentais (`l.435`) precisa ser conferida com «ataque mágico» (seção 15, item 7).

**Reforma P/G/R**
18. **Textos da reforma P/G/R** já listados em `veterana-2b-reforma-pgr.md` (tabela de Preparo, parágrafo da Distância, tabela de Velocidades, Recarga e exemplo do Bram, Investida, Normal, Arte). Naquele arquivo, a linha «Funda ... 100 m», a classe do Bumerangue e os «Dardos» estão superados por este documento.

## 15. Conflitos e ambiguidades novos que estas respostas criam (listados, não resolvidos)

Só o que as respostas do autor criaram. Nada abaixo está resolvido.

1. **Acerto automático e Margem com Defesa 0.** Sem teto e com piso 0, a Defesa pode chegar a 0 por acúmulo (por exemplo Agarrado −8 mais Pressão), e acerto passa a ser automático (total ≥ 1). A Margem é «a cada 6 pontos acima da Defesa, +1d6»: contra Defesa 0, a Margem é o total inteiro ÷ 6 (um total de 28 dá +4d6). Dormindo, desacordado, surpreso ou imobilizado recebem muito mais dados que um alvo normal. Não achei teto de Margem para o dano de arma no site. É esse o efeito desejado?
2. **Tempo de voo.** (a) No P/G/R, o ataque é rolado no Golpe ou na chegada? (b) Alvo que se desloca durante o voo (até 4 m por Tick de Deslocamento): a distância e o incremento usam a do Golpe ou a da chegada? (c) O ataque «recebido» da Guarda sob pressão do alvo conta na chegada? (d) No Normal o tiro é rolado na declaração, então o tempo de voo não existe lá: o Normal favorece o arqueiro de longe? (e) A interação com Rajada e ataques múltiplos, fechados na Missão 2, não foi verificada (o conteúdo não está nos meus arquivos). (f) Aliado, cobertura ou terreno que entram na linha durante o voo.
3. **Bumerangue de retorno.** «Volta no mesmo número de Ticks que levou para ir»: até a Efetiva (20 m) a ida leva 0 Ticks, então a volta é imediata? A mão fica sem arma até a volta ou antes da Recuperação acabar? Além disso, a Efetiva de 20 m tem fonte fraca (o esporte mede 2 a 10 m) e a arma domina a Adaga de Arremesso (mesma classe, dano e Acerto, 20 m contra 10, volta à mão; só perde o Perfurante N0).
4. **Preso, dois perfis.** Preso pela tabela é Esquiva −4; Preso pela Rede é −2/−2 mais −1 por grau de Margem, **sem teto**: com Margem 4 a Rede vale −6/−6, pior que Grave (−8/−4) em Bloqueio, e um 6d6 de total alto prende mais que um agarrão. O que dá Preso «pelo agarrão»? O texto do site só tem Agarrar gerando Agarrado.
5. **Agarrado.** «Não pode atacar quem está de fora» é o mesmo que «não age» do site (`combate l.194`)? O Imobilizado (Defesas zeradas) vale também contra quem agarra? (O bestiário tem «Constrição ... fica Imobilizado», `bestiario l.12061`: entre os dois do agarrão.)
6. **Exemplos de rede na tabela de restrição.** Retirei «rede nas pernas» e «enrolado na rede» porque a regra da Rede os substitui. Confirmar.
7. **Porte e ataques mágicos.** O autor incluiu «ataque mágico» e «Artes físicas à distância» na regra do tiro. O site exclui ataques Sociais e Mentais do porte (`combate l.435`): a exclusão continua? Artes de área, que não rolam ataque, não têm porte: confirmar.
8. **Teste de «sabe que vai ser atacado».** Percepção + Prontidão: é a Passiva ((Percepção + Prontidão) × 2 + 2 × mín(Centelha, Prontidão), que o Mestre consulta, `sentidos-e-engano l.15`) ou uma jogada contra a Furtividade do atacante? Qual Dificuldade?
9. **Plumbata e projéteis rápidos.** O site lista o dardo entre os projéteis rápidos (`combate l.275`, ninguém apara com arma ou mão; só Esquiva ou escudo). A Plumbata é projétil rápido?
10. **Atlatl.** Azagaia com atlatl vira P5/G1/R2, Velocidade 8, a mais lenta do Arremesso; no Normal a exposição soma 2 × 8 + 2 = 18 de Defesa contra 14 da azagaia comum. Confirma que a contrapartida é essa?
11. **Arcos e Força.** O Longo e o Composto sem Força máxima aceitam Força do personagem sem limite no dano; «Força acima de 8 conta 8» vale só para a Máxima da tabela ou também para o dano (Força inteira do Longo, Força×2 do Composto)?
12. **Balanço do catálogo.** Com a Plumbata em Acerto +0 e 14 m, e as três leves em +1, a Plumbata fica abaixo do Dardo antigo em Acerto (+2) e tem dano maior (1d6−2 contra 1d6−4). Anotado só para o analista conferir; o autor aceitou diferenças entre armas parecidas.

## 16. Fontes dos dados reais

Qualidade: **A** fonte primária ou regulamento; **B** artigo ou site especializado; **C** fórum, blog ou divulgação, só como indício.

| Dado | Fonte | Qualidade |
| --- | --- | --- |
| Faca 3 a 7 m, alvo de 50 cm; distâncias padronizadas (AKTA 12 e 18 ft); machado 4 a 10 m (WATL 12 ft, Big Axe 15 ft); shuriken 6 m (homens) e 5 m (mulheres) | sites de competição (EuroThrowers, AKTA, WATL), busca de 07/10/2026 | B |
| Recordes: faca 42 m, machado 67 m (Guinness, 2025, condições não confirmadas); machado 27,53 m com alvo de 1 m (FSLCH, 2022); funda 477,10 m (Engvall, 1992) e 437,1 m (Larry Bray, 1982); javelin 98,48 m (Zelezny) e 72,28 m (Spotáková); atlatl 250 m ou mais | Guinness, federações e relatórios | B |
| Atlatl com precisão de 15 a 25 m (alvo de 120 cm), um ponto a 100 m (Grohsmeyer, 2017); caça com precisão de 10 a 30 m, média 15 m; pilum 20 a 30 m | estudos de caça e reconstrução | B/C |
| Plumbata: dificuldade de passar de 30 jardas à mão, 40 m (sub) e 30 m (por cima) como extremo (Vermaat); precisão após breve prática | [Plumbata (Wikipedia)](https://en.wikipedia.org/wiki/Plumbata), [comitatus.net](https://comitatus.net/romanplumbatae.html) | B/C |
| Peso da plumbata: reconstruções do grupo Comitatus, 60 a 120 g na versão curta e 170 a 200 g nas versões pesadas | informado pelo autor; fonte original não conferida por mim | C |
| Boleadeira: alcance de 35 a 37 m; 15 m «particularmente útil» | [bolas (knifethrowing.info)](https://www.thrower-archive.knifethrowing.info/bolas.html) e páginas de divulgação | C |
| Kylie de caça: precisão maior que a da lança, faixa de varredura de 1,2 m; bumerangue de esporte: anéis de 2 a 10 m | páginas de divulgação | C |
| Arco: clout 160 a 240 jardas (146 a 219 m), alvo de 18 pol; ato de 1542 (treino a 220 jardas ou mais) | [Archery butt](https://en.wikipedia.org/wiki/Archery_butt), [clout](https://www.longbow-archers.com/clout.html) | B/C |
| Mary Rose: arcos de 100 a 185 lbf, impacto de 100 a 120 J, ferimento a até 200 m | [Heavy longbows](https://longbow-archers.com/heavybows.html), testes de Cranfield | B |
| Olímpico: 70 m, alvo de 122 cm, anel 10 de 12,2 cm; tiro de campo: alvos de 20, 40, 60 e 80 cm, 5 a 60 m | [World Archery](https://worldarchery.org/news/102153/field-archery-101-discipline-explained) | A |
| Kyudo: kinteki 28 m com alvo de 36 cm; enteki 60 m com alvo de 158 cm (a Veterana lembrava 100 cm) | [Shihan Mato](https://en.wikipedia.org/wiki/Shihan_Mato) | B |
| Caça com arco: 20 a 30 jardas; zona vital de uns 23 cm (prato de papel) | artigos de caça (ethical bowhunting) | C |
| Recorde de voo de arco longo: 539,35 m (Kyle Martin, 2023) | [world flight records](https://usarchery.org/resource/world-flight-records) | B |
| Besta: máxima de 300 a 350 m, eficaz até uns 100 m; maior tiro de arco longo verificado uns 275 m | [bowvsmusket.com](https://bowvsmusket.com/2021/05/06/the-book-of-the-crossbow-by-ralph-payne-gallwey-crossbow-longbow-ranges-compared/) | C |
| Prova olímpica de 70 m e o peso do javelin (800 g) | de memória da Veterana | não conferido |
| Pesos de arremesso (seção 6), exceto bumerangues e plumbata | memória e inferência da Veterana, aceitos pelo autor | não conferido |

Física usada (cálculo da Veterana): alcance A = v² · sen(2θ) ÷ g; erro de alcance por 1° de ângulo (faca, Máxima 73 m): 2,53 m a 8 m (32% da distância), 2,22 m a 36 m (6%), 0,72 m a 70 m (1%); erros de velocidade e laterais crescem proporcionalmente à distância; a chance de acertar um alvo pequeno cai com 1/d² no campo distante; uma penalidade fixa sozinha é contornada por pool grande (por isso a penalidade incremental e sem teto).

## 17. Perguntas para o analista

1. A taxa de −6 por Efetiva (−3 por meia Efetiva), somada ao tempo de voo (+1 Tick por incremento), é coerente com as Defesas passivas e com a Guarda sob pressão? Os números da seção 3.1 (Longo na Máxima: +8 Ticks) são toleráveis em mesa?
2. A Efetiva de arco e besta (30 a 80 m) combina com as Velocidades da reforma de P/G/R (arcos 6 e 7; bestas 9, 12 e 15)?
3. Sem teto em penalidades de Defesa e em porte, e com piso 0 e Margem contada desde 0, há risco de acerto automático e de dano exagerado em alvos «indefesos» (seção 15, item 1)? Como isso conversa com a Couraça de Porte e com o bestiário (Imenso com Defesa 4)?
4. O Preso da Rede, sem teto de Margem, fica fora de escala diante da tabela de restrição?
5. O atlatl (+2 no Preparo, ×2 na Máxima, +1× Força) cria algum conflito com a classe de Arremesso da reforma?
6. A tabela de Força dos arcos (seção 5.3) combina com a ausência de Força máxima padrão no Longo e no Composto, e com a Força mínima só nos reforçados?
7. Há textos do site que contradizem o modelo da seção 3, o tempo de voo ou a tabela da seção 8 além dos listados na seção 14?
