# Teste de Virtude e Frenesi · a régua

**O que este documento é:** a regra fechada do teste de Virtude e dos dois traços de fúria
(Frenesi e Frenesi Contido), escrita a partir de `virtude-jogada.md` e das decisões tomadas em
conversa. Substitui a seção 6 daquele documento no que diz respeito à régua de Dificuldade, e
fecha as seções 7 e 8, que estavam abertas.

**O que ele NÃO é:** não é implementação. O que continua em aberto está no §11, nomeado.

---

## 1 · O teste de Virtude

A Virtude sozinha alimenta a conversão soma para parada que o sistema já usa, **sem somar
Atributo nenhum**. O valor da Virtude é tratado como se já fosse a soma.

| Virtude | Parada |
|:--:|---|
| 1 | 2 (fixo, sem dado) |
| 2 | 1d6 |
| 3 | 1d6+2 |
| 4 | 2d6 |
| 5 | 2d6+2 |
| 6 | 3d6 |

Zero mecanismo novo: é a função que já existe no motor, alimentada com um número diferente.

---

## 2 · A régua de Dificuldade PRÓPRIA da Virtude

**A régua travada do resto do jogo (5/10/15/20/25) NÃO serve para teste de Virtude.** Ela foi
feita para paradas que crescem sem limite; a parada de Virtude tem teto de 3d6, máximo 18. Contra
a régua travada, a banda 20 e a 25 são inalcançáveis e a 15 só existe para Virtude 6, a 5%.

A régua da Virtude anda **de dois em dois**, e é esta (confirmada em 23/09/2026 contra a travada, que a §14 do registro propunha):

| Dificuldade | Rótulo | V1 | V2 | V3 | V4 | V5 | V6 |
|:--:|---|:--:|:--:|:--:|:--:|:--:|:--:|
| 3 | Branda | 0 | 50 | 83 | 92 | 100 | 100 |
| 5 | Tensa | 0 | 17 | 50 | 72 | 92 | 95 |
| 7 | Séria | 0 | 0 | 17 | 42 | 72 | 84 |
| 9 | Dura | 0 | 0 | 0 | 17 | 42 | 63 |
| 11 | Severa | 0 | 0 | 0 | 3 | 17 | 38 |
| 13 | Extrema | 0 | 0 | 0 | 0 | 3 | 16 |

Valores em porcentagem de **passar**. Sucesso continua sendo total MAIOR que a Dificuldade.

**Os rótulos são propositalmente diferentes dos da régua travada** (Fácil, Média, Difícil, Limite
humano, Excepcional), para que ninguém leia "Dura" e pense em 15.

**A escada não é lisa**, por causa do mais dois do ímpar: de 5 para 7 a Virtude 3 cai de 50 para
17, e de 7 para 9 a Virtude 4 cai de 42 para 17. Isso é consequência da conversão e não defeito.

### Como isso calibra a régua de personalidade

- **Virtude 2** só segura a Branda. Cede na maior parte do cotidiano, que é a descrição dela.
- **Virtude 5** segura quase tudo até a Séria e começa a ceder na Dura. É o "só cede se quiser"
  com uma margem de azar.
- **Virtude 6** é o único que existe na Extrema, e ainda assim a 16%.
- **Virtude 1 nunca passa em nada**, nem na Branda. É intencional: Virtude 1 é quase um defeito
  de caráter, e a única forma de ele passar é Firula (§3).

---

## 3 · A Firula no teste de Virtude

A Firula (equivalente ao stunt) vale aqui como em qualquer teste:

| Nível | Bônus |
|:--:|---|
| 1 | +2 no resultado |
| 2 | +1d6 na parada |
| 3 | +2d6 na parada |

**A Firula é o que torna as bandas altas alcançáveis.** Sem ela o teto é 3d6, e a Dura e a
Extrema são raras (Virtude 4 passa na Dura 17%; na Extrema, só a Virtude 5 e a 6 passam, a 3% e
16%). Com Firula 2, a Virtude 4 passa na Dura 63%; com Firula 3, passa na Extrema 56%.

**A Firula desloca a linha inteira duas casas.** Virtude 2 com Firula 2 rola igual a Virtude 4 sem
Firula. Isso é decisão de design: a descrição pesa mais que a ficha. É também o que tira a Virtude
1 do chão, e pouco mais: com Firula 2, ela passa metade das vezes na Tensa e 17% na Séria.

**Firula negativa existe.** Se a descrição do jogador for prejudicial à ação, ela tira dados ou
pontos em vez de somar. Quem julga é o mestre.

---

## 4 · Os dois traços

**Frenesi (Orc puro).** Em fúria, só realiza ações físicas (mais Intimidar, ver §5). Ignora TODAS
as penalidades de ferimento (Machucado, Grave, Crítico) até a Vida chegar em Incapacitado.

**Frenesi Contido (Meio-Orc).** Mesma restrição de ações. Ignora só Machucado e Grave. Ao entrar
em Crítico, **sai da fúria sozinho** e sente a penalidade cheia de novo. Regras próprias no §10.

---

## 5 · O que a fúria dá e o que ela tira

### Ganha

- **Ignora a penalidade de ferimento** (Machucado, Grave, Crítico), até Incapacitado.
- **+2 no resultado** de testes físicos: atacar, escalar, nadar, saltar quando for teste, levantar
  peso quando for teste.
- **+1 na soma** dos cálculos de ação física: distância de salto, deslocamento, capacidade de
  carga.
- **Intimidar vira ação reflexa com +2 dados.** É a exceção declarada à proibição de testes
  sociais do parágrafo seguinte.

**+2 no teste e +1 na soma não são a mesma vantagem**, e isso é sabido e aceito. Mais um na soma
vale cerca de 1,75 em média (às vezes vira +2 fixo, às vezes vira +1d6 −2); o +2 no teste vale
exatos 2, sem variação.

**Quais testes ganham o +2** (fechado em 23/09/2026): os de ação física, pela mesma definição do
capítulo de ferimentos (`vida-ferimentos-cura.md`, "as que rolam Vigor ou Destreza"), que é o
mesmo conjunto cujas penalidades a fúria ignora. Agarrar, arrombar, escalar, investir e
**arremessar** ganham. **O tiro (Atirador: arco, besta) NÃO ganha**: a pontaria paciente é o
oposto da fúria, e o machado arremessado é força bruta. Aparar não é teste, é a Defesa por
Bloqueio, que em fúria leva −2 (abaixo).

### Perde

- **−2 em Esquiva e em Bloqueio.** O estado é pouco defensivo, e é por aqui que se mata um orc em
  fúria.
- **Não faz testes sociais** (exceto Intimidar).
- **Não pode ser convencido a nada.** Pode ser acalmado por aliado, e só pela regra do §8.
- **Só realiza ações físicas.**

---

## 6 · Entrar em fúria

*Reescrita em 23/09/2026 com o humano. O registro das decisões está em
`docs/simulacao/caixa/leitura-de-novato-decisoes.md` §16.*

### O teste

É um teste de **Temperança** (parada do §1), e **entrar em fúria é FALHAR no teste**: tirar a
Dificuldade ou menos. O personagem está literalmente perdendo o autocontrole.

**O teste é um só**, seja forçado, seja por vontade própria. O que muda é o que o orc faz com a
própria parada, conforme queira resistir ou ceder:

- **a penalidade de ferimento é opcional.** Ela entra só se o personagem quiser ceder, na moeda
  de sempre (Machucado −2 pontos, Grave −1 dado, Crítico −2 dados). **Neste teste ela PODE zerar a
  parada**, e parada zerada entra em fúria automaticamente: o piso de 1d6 do combate
  (`vida-ferimentos-cura.md`, `src/lib/rolagem.ts`) não vale aqui. Quem quer resistir não é
  obrigado a usá-la: mesmo em Grave ou Crítico, rola a parada original de Temperança;
- **gastar 1 ponto de Força de Vontade soma OU tira 1d6 da parada**, conforme o personagem queira
  resistir ou ceder. **Um ponto por teste, no máximo.** Tirar também pode zerar a parada;
- **a Firula pode ser negativa** e ajudar a ceder, se a descrição for nesse sentido.

### Quando o teste é forçado

Fora destes dois casos, o orc só rola se quiser entrar. Provocação de cotidiano (insulto, um
golpe que raspou, cheiro de sangue) **não** força teste.

1. **Dano grande: um único golpe que tire 20% ou mais da Vida máxima**, arredondado para cima
   (orc de 40 PV: 8 de dano). Conta o dano líquido, depois da Absorção. **Dano acumulado não
   dispara**, de propósito: o Frenesi é pela pancada, não pelo desgaste. Se em mesa parecer
   pouco, o valor sobe para 25%.
2. **Provocação importante.** O que conta como importante é subjetivo e decide o mestre, pela
   história e pelas relações pessoais do personagem (não há campo na ficha). Quem provoca faz um
   teste social de **Influência** contra **Força de Vontade do orc × 2 + Centelha dele**. Se
   passar, o orc é obrigado a fazer o teste de Frenesi. Aqui a Força de Vontade protege o orc.
   **A Habilidade é livre, e o mestre escolhe pela forma da provocação**, como no acalmar do §8:
   Manha para zombaria e deboche, Intimidação para ameaça, Empatia para achar a ferida certa,
   Oratória para humilhar em público. O mestre exige uma descrição que combine com a Habilidade
   escolhida.

### A Dificuldade vem da situação

O mestre escolhe pela situação em que o orc está no momento do teste:

| Situação | Dificuldade |
|---|:--:|
| Calma, fora de batalha, ambiente tranquilo e sossegado | 4 |
| Em batalha, com vantagem, sem motivo de alarme e sem ferimento | 5 |
| Estresse: cercado de inimigos, em menor número, já sofreu algum dano | 6 a 7 |
| Muito desfavorecido: grande desvantagem, muito dano, sendo provocado | 8 a 10 |
| Situação muito crítica: tudo diz que ele deveria entrar em fúria, e manter-se são exige esforço monumental | acima de 10 |

### Chance de ENTRAR rolando a Temperança limpa

| Dificuldade | T1 | T2 | T3 | T4 | T5 | T6 |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 4 | 100 | 67 | 33 | 17 | 3 | 2 |
| 5 | 100 | 83 | 50 | 28 | 8 | 5 |
| 6 | 100 | 100 | 67 | 42 | 17 | 9 |
| 7 | 100 | 100 | 83 | 58 | 28 | 16 |
| 8 | 100 | 100 | 100 | 72 | 42 | 26 |
| 9 | 100 | 100 | 100 | 83 | 58 | 38 |
| 10 | 100 | 100 | 100 | 92 | 72 | 50 |
| 12 | 100 | 100 | 100 | 100 | 92 | 74 |

### Chance de ENTRAR gastando 1 ponto de Força de Vontade para CEDER (−1d6), sem ferimento

| Dificuldade | T1 | T2 | T3 | T4 | T5 | T6 |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 4 | 100 | 100 | 100 | 67 | 33 | 17 |
| 5 | 100 | 100 | 100 | 83 | 50 | 28 |
| 6 | 100 | 100 | 100 | 100 | 67 | 42 |
| 7 | 100 | 100 | 100 | 100 | 83 | 58 |
| 8 | 100 | 100 | 100 | 100 | 100 | 72 |

### Chance de ENTRAR gastando 1 ponto de Força de Vontade para RESISTIR (+1d6)

Vale em qualquer estado de ferimento, porque quem resiste não aplica a penalidade.

| Dificuldade | T1 | T2 | T3 | T4 | T5 | T6 |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 4 | 33 | 17 | 3 | 2 | 0 | 0 |
| 5 | 50 | 28 | 8 | 5 | 0 | 0 |
| 6 | 67 | 42 | 17 | 9 | 2 | 1 |
| 7 | 83 | 58 | 28 | 16 | 5 | 3 |
| 8 | 100 | 72 | 42 | 26 | 9 | 5 |
| 9 | 100 | 83 | 58 | 38 | 16 | 10 |
| 10 | 100 | 92 | 72 | 50 | 26 | 16 |
| 12 | 100 | 100 | 92 | 74 | 50 | 34 |

### Custo de entrar

Nenhum além do teste. É traço racial, não Técnica paga.

---

## 7 · Duração e manutenção

A fúria dura **pela cena**, enquanto for alimentada. Não há relógio fixo e não há teste periódico
enquanto o orc está fazendo o que veio fazer.

### Os gatilhos que disparam o teste de manutenção

A janela é de **(Força de Vontade) Ticks**, sempre pela **Força de Vontade MÁXIMA**, não pela
atual. Gastar pontos para entrar ou sair não encurta a fúria.

1. **passar (Força de Vontade) Ticks sem nenhuma ação física de combate.** Decidido em
   23/09/2026: Tick em que o orc está atacando, investindo, sofrendo dano ou em qualquer outra
   ação física de combate NÃO conta para a janela. Ela só corre nos Ticks em que ele não está
   lutando, e a contagem recomeça do zero a cada ação física de combate;
2. **o alvo da fúria cair ou fugir**, se for o único alvo disponível;
3. **ser obrigado a ficar parado, preso ou contido por (Força de Vontade) Ticks.**

Referência de escala: um Ataque médio (espada longa, machado de uma mão, lança) custa 6 Ticks;
Força de Vontade vai de 0 a 12, com 4 ou 5 típico de NPC e 6 ou 7 típico de jogador. Como os Ticks
do próprio ataque não contam, a janela nunca fecha no meio de uma sequência de golpes, qualquer que
seja a arma. (Na versão anterior, "sem iniciar ataque", uma janela de 4 ou 5 Ticks fechava entre
um ataque de 6 Ticks e o seguinte.)

*Nota de redação: "nenhum inimigo ao alcance" não é gatilho separado, porque sem alvo ele não
ataca e a janela do gatilho 1 corre sozinha. Vale como aviso ao mestre, não como regra.*

### O teste de manutenção

**Vigor + Resistência**, pela conversão normal do sistema (não é teste de Virtude). Representa o
desgaste físico de sustentar o estado.

**A Dificuldade sobe uma banda a cada renovação**, pela régua travada do jogo: 5, depois 10, 15,
20.

| soma Vigor+Resist. | parada | D5 | D10 | D15 | D20 | renovações esperadas |
|:--:|---|:--:|:--:|:--:|:--:|:--:|
| 5 | 2d6+2 | 92 | 28 | 0 | 0 | 1,2 |
| 6 | 3d6 | 95 | 50 | 5 | 0 | 1,5 |
| 7 | 3d6+2 | 100 | 74 | 16 | 0 | 1,9 |
| 8 | 4d6 | 100 | 84 | 34 | 3 | 2,1 |
| 9 | 4d6+2 | 100 | 95 | 56 | 10 | 2,5 |
| 10 | 5d6 | 100 | 97 | 69 | 22 | 2,8 |

A fúria tem fim garantido sem ninguém escrever limite, e o teto sobe com a ficha.

**Falhar no teste de manutenção encerra a fúria** (e dispara a ressaca do §9).

*Confirmado em 23/09/2026: fechar a janela NÃO encerra a fúria direto. Os três gatilhos acima
obrigam ao teste de manutenção, e só falhar nele encerra.*

---

## 8 · Sair da fúria

### Por vontade própria

*Reescrita em 23/09/2026: a saída espelha a entrada (§6).*

Custa **1 ponto de Força de Vontade**, que soma **+1d6** à parada, e exige **sucesso num teste de
Temperança**, com possibilidade de Firula. A Temperança é rolada limpa: o orc em fúria já ignora a
penalidade de ferimento (§4), e ela só entra no teste de quem quer ceder.

**A Dificuldade para sair é a MESMA da situação atual para entrar** (a escala do §6). Se a situação
do momento pede tirar mais de 8 para se segurar, sair também pede tirar mais de 8. E a situação
muda durante a luta: quem entrou contra Dificuldade 5 pode precisar de 10 para sair depois de
tomar dano e ser provocado.

**Consequência, e é desejada:** a fúria fica mais difícil de largar conforme a briga piora. O
personagem não escolhe sair num momento ruim.

**Crítico não bloqueia a saída.** O Orc puro em Crítico sai com a mesma chance que teria
saudável na mesma situação. (A versão anterior deste documento o prendia na fúria em Crítico; a
regra caiu junto com a penalidade obrigatória, por decisão de 23/09/2026.)

Chance de SAIR gastando o ponto de Força de Vontade:

| Dificuldade | T1 | T2 | T3 | T4 | T5 | T6 |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 4 | 67 | 83 | 97 | 98 | 100 | 100 |
| 5 | 50 | 72 | 92 | 95 | 100 | 100 |
| 6 | 33 | 58 | 83 | 91 | 98 | 99 |
| 7 | 17 | 42 | 72 | 84 | 95 | 97 |
| 8 | 0 | 28 | 58 | 74 | 91 | 95 |
| 9 | 0 | 17 | 42 | 63 | 84 | 90 |
| 10 | 0 | 8 | 28 | 50 | 74 | 84 |
| 12 | 0 | 0 | 8 | 26 | 50 | 66 |

*Isto exige que o mestre mantenha a Dificuldade corrente da situação viva durante a cena. É um
número que precisa estar visível na mesa, não guardado de memória.*

### Por um aliado

Um aliado pode tentar acalmar. Normalmente **Influência + Persuasão**, pela régua travada, mas a
jogada é determinada pelo mestre conforme o argumento.

- **Dificuldade igual ao DOBRO da Força de Vontade do orc** (máxima).
- **Pode tentar mais de uma vez.** Cada tentativa nova soma +2 à Dificuldade, e **não pode repetir
  o argumento anterior**. Quem julga se o argumento é novo o bastante é o mestre.
- Cada tentativa leva alguns segundos, e o personagem em fúria age nesse intervalo.

**Se o aliado passa, o orc é OBRIGADO a fazer o teste de Temperança**, queira ele ou não, e não
gasta Força de Vontade nesse teste (perdendo, portanto, o bônus dela).

Passando, sai da fúria. **Falhando, permanece**, coerente com a entrada, onde falhar é ficar em
fúria. O aliado não decide nada: ele força a rolagem.

Chance do aliado passar:

| soma do aliado | FdV 4 (D8) | FdV 5 (D10) | FdV 6 (D12) | FdV 7 (D14) |
|:--:|:--:|:--:|:--:|:--:|
| 6 (3d6) | 74 | 50 | 26 | 9 |
| 8 (4d6) | 95 | 84 | 66 | 44 |
| 10 (5d6) | 99 | 97 | 90 | 78 |

---

## 9 · Ressaca, fadiga e o teto por cena

### O teto

**Metade do Vigor, arredondado para baixo, é o número de fúrias por cena.** Vigor 4 dá duas,
Vigor 6 dá três, Vigor 3 dá uma.

**É possível forçar uma fúria além do teto**, e isso é deliberação do mestre, com preço que doe
fora da luta.

### A ressaca

Ao sair da fúria, por qualquer motivo, o personagem **conta como um estado de ferimento pior do
que está**, por **metade dos Ticks que passou em fúria**, somando-se a qualquer penalidade de
ferimento real que já tivesse.

**A ressaca ACUMULA e nunca zera.** Entrar em fúria de novo **suspende** o acúmulo, não o apaga: a
segunda fúria esconde a primeira e a conta chega inteira no fim. Segunda fúria na mesma cena, dois
estados piores.

*Sem essa regra existe um laço: sai, está com ressaca, entra de novo para cancelar, sai de novo.*

**A ressaca nunca leva a Incapacitado** (decidido em 23/09/2026). Cada estado de ressaca que
passaria de Crítico vira mais **−1d6 na ação física e −4 na Defesa Física**, o mesmo degrau que
separa Grave de Crítico. Crítico com um estado de ressaca fica em −3d6 e −12; com dois, −4d6 e −16.
Esse degrau abaixo de Crítico só existe para a ressaca, e precisa aparecer como exceção na tabela
de ferimento do capítulo. Por isso o Meio-Orc que sai sozinho ao entrar em Crítico (§10) continua
consciente.

**Estourar o teto do Vigor é o que produz a exaustão de dias**, o único ponto em que a penalidade
sai do combate e vai para o tempo de descanso.

---

## 10 · Frenesi Contido · regras próprias

- **Ignora só Machucado e Grave**, não Crítico.
- **−2 na Dificuldade, nos DOIS sentidos.** Entra menos (porque entrar é falhar contra esse
  número) e sai mais. É o que "Contido" significa: mais controle nas duas pontas.
- **Sai sozinho ao entrar em Crítico**, quase desmaiando de ferimento somado ao desgaste da fúria.
- **Depois de sair por Crítico, NÃO pode reentrar enquanto continuar em Crítico.**

*Essa última linha fecha um laço: sem ela o meio-orc piscaria entre fúria e lucidez a cada
gatilho enquanto apanha. O limite do meio-orc é o corpo dele. (A justificativa antiga dizia que em
Crítico a entrada era automática; desde 23/09/2026 não é mais, ver §6. A regra continua valendo
pelo laço.)*

- **Pode reentrar** em Frenesi Contido se a Vida voltar a Grave ou melhor.

---

## 11 · O que ainda não está fechado

1. ~~A lista de ações físicas~~ **Fechado em 23/09/2026:** a definição de ação física do
   capítulo de ferimentos, com Arremesso dentro e Atirador fora (§5).
2. ~~Os rótulos da régua de Virtude~~ **Fechado em 23/09/2026:** 3 Branda, 5 Tensa, 7 Séria,
   9 Dura, 11 Severa, 13 Extrema. "Trivial" colidia com `qual-sistema.md` ("Trivial, não" rola
   dado) e "Leve" com a classe de arma, armadura e carga.
3. ~~A lista completa de gatilhos de entrada~~ **Fechado em 23/09/2026:** dois gatilhos
   forçados (golpe de 20% da Vida; provocação importante, julgada pelo mestre e resolvida por
   Influência) e a escala de Dificuldade por situação, no §6.
4. ~~A Habilidade da provocação por Influência~~ **Fechado em 23/09/2026:** livre, o mestre
   escolhe pela forma da provocação (§6, gatilho 2).
5. ~~O piso de 1d6 quando o próprio orc tira dados para ceder~~ **Fechado em 23/09/2026:** no
   teste de Frenesi o piso não vale, e a parada pode zerar (§6).
6. ~~Se dá para gastar mais de 1 ponto de Força de Vontade~~ **Fechado em 23/09/2026:** um
   ponto por teste (§6).
7. ~~A saída em Crítico e a Força de Vontade na saída~~ **Fechado em 23/09/2026:** a saída
   espelha a entrada, +1d6 pelo ponto gasto, Crítico não bloqueia (§8).
8. ~~A ressaca em quem já está em Crítico~~ **Fechado em 23/09/2026:** vira −1d6/−4 por estado
   além de Crítico, nunca Incapacitado (§9).
9. ~~Vigor 1 dando zero fúrias por cena~~ **Mantido em 23/09/2026:** metade do Vigor,
   arredondado para baixo, sem piso. O orc médio começa com Vigor 2 (uma fúria), e o de Vigor 1
   não entra em fúria. Pode ser revisto depois.

---

## 12 · Anotado para depois · a fúria fora do combate mortal

Sair da fúria quando o orc **não** está em combate mortal pode gerar um estado de **êxtase e
gozo**, em vez de ressaca pura.

Isso dá motivo para os orcs ativarem a fúria fora de combate: lutas cotidianas, sexo, atividades
físicas do dia a dia. Uma sociedade orc fisicamente muito ativa, que usa o traço como parte da
vida e não só da guerra, e para quem "ir à fúria" é prazer e não só arma.

Nada disso está desenhado. Fica registrado porque é a única parte do traço que diz algo sobre a
cultura em vez de sobre o combate, e porque muda como o resto do mundo enxerga os orcs.
