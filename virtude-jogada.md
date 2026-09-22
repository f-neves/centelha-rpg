# Centelha: rolagem básica, Virtudes e o Frenesi em aberto

Este documento é um resumo autocontido, escrito pra quem nunca viu o sistema. O objetivo é
discutir e fechar duas coisas que ainda estão em desenho: o **teste de Virtude** (que acabou de
ser fechado, mas vale conferir) e o **Frenesi** (que ainda tem partes em aberto, e é o motivo
principal deste documento).

## 1 · O que é Centelha

Centelha é um sistema de RPG de mesa autoral, D6, ambientado num mundo de fantasia baixa (sem
magia onipresente; poucos personagens têm acesso a poder sobrenatural de verdade). O documento
não depende de conhecer o mundo, só a mecânica.

## 2 · A rolagem básica

Todo personagem tem **Atributos** (o que o corpo/mente consegue, tipo Força, Destreza, Vigor,
Raciocínio, Percepção, Compostura...) e **Habilidades** (o que ele aprendeu, tipo Armas,
Atletismo, Furtividade...). Os dois vão numa régua pequena, normalmente **0 a 6** pros Atributos
e **0 a 6** (às vezes até mais alto com Especialidade) pras Habilidades primárias.

Uma jogada ativa (atacar, escalar, convencer) soma Atributo + Habilidade relevantes, e essa soma
vira uma **parada de dados** por uma conversão fixa:

```
parada = ⌊soma ÷ 2⌋ d6, e se a soma for ÍMPAR, soma-se +2 fixo ao resultado da rolagem
```

Exemplos: soma 1 → 0d6+2 (um número fixo, sem dado nenhum). Soma 2 → 1d6. Soma 3 → 1d6+2.
Soma 4 → 2d6. Soma 5 → 2d6+2. Soma 6 → 3d6. E assim por diante, sempre crescendo.

O resultado da rolagem (soma dos dados + o fixo, se houver) é comparado contra uma
**Dificuldade**, numa régua travada e usada em toda ação do jogo:

| Dificuldade | Rótulo |
|:--:|---|
| 5 | Fácil |
| 10 | Média |
| 15 | Difícil |
| 20 | Limite humano |
| 25 | Excepcional |

**Sucesso = o total rolado é MAIOR que a Dificuldade** (não igual, maior). Não existe grau de
sucesso por margem pequena: existe, sim, uma **Margem** (o quanto passou da Dificuldade), que
algumas regras usam pra efeitos extras, mas o sucesso em si é binário.

Traços **passivos** (Defesa, principalmente) não rolam dado nunca: são um número estático,
`(Atributo+Habilidade)×2 + Centelha + Especialidade`, e o ataque do outro personagem precisa
passar desse número.

### As duas moedas de penalidade

Quando alguma coisa penaliza uma ação (ferimento, condição, cansaço), a penalidade vem em uma de
duas moedas, e elas NÃO são a mesma coisa:

- **Ponto**: um número fixo, subtraído do TOTAL depois de rolar (ex.: rolou 8, penalidade de
  ponto −2, resultado final 6).
- **Dado**: dados retirados da PARADA antes de rolar (ex.: parada seria 3d6, penalidade de 1
  dado, rola só 2d6).

As duas convivem na mesma tabela hoje (ver a seção de Ferimento abaixo), e a escolha de qual
moeda usar em cada caso é deliberada, não acidente de redação.

## 3 · Centelha (o traço, não o nome do jogo)

**Centelha** é um traço próprio (separado de Atributo/Habilidade) que mede poder pessoal
excepcional: vai de 0 (a maioria das pessoas) até um teto alto reservado a poucos personagens
(heróis, monstros grandes, seres com faísca sobrenatural de verdade). Ele soma direto em cima de
Ataque e Defesa (via a fórmula passiva acima) e é o que separa "gente boa numa luta" de "herói de
lenda". Não tem relação direta com Virtude: dá pra ter Centelha alta e Virtude baixa (um monstro
poderoso e moralmente quebrado), ou o contrário.

## 4 · Limiares de Ferimento (contexto necessário pro Frenesi)

Vida vai de 100% a 0% (ou menos, até a morte). Cinco estados, cada um com sua penalidade, na
moeda que faz sentido pra ele:

| Estado | % de Vida | Penalidade de ação | Penalidade de Defesa |
|---|:--:|:--:|:--:|
| Saudável | 61-100% | nenhuma | nenhuma |
| Machucado | 31-60% | **−2 pontos** | −2 |
| Grave | 11-30% | **−1 dado** | −4 |
| Crítico | 1-10% | **−2 dados** | −8 |
| Incapacitado | 0% ou menos | fora de combate | fora de combate |

Machucado usa a moeda de PONTO; Grave e Crítico usam a moeda de DADO. Isso é decisão recente e
deliberada, registrada no projeto.

## 5 · As quatro Virtudes

Virtude é uma régua de **personalidade e comportamento**, separada de Atributo e Habilidade. Vai
de **1 a 6** (nunca 0: todo mundo tem alguma versão de cada Virtude, mesmo que baixa). São
quatro:

| Virtude | Empurra você a… | Resiste a… |
|---|---|---|
| **Compaixão** | poupar, socorrer, cuidar | crueldade |
| **Convicção** | seguir apesar de tudo | dor, tortura, desânimo |
| **Temperança** | segurar o próprio impulso | tentação, provocação |
| **Bravura** | ficar e encarar | medo, intimidação |

**Não existe Virtude "ruim".** Uma Virtude baixa é tão válida quanto uma alta: Bravura 1
(abandona o posto e foge) e Bravura 5 (marcha sozinha contra o exército) são igualmente "fiéis a
si mesmas", e a régua tem uma escala de conduta esperada pra cada grau, dos dois lados.

A leitura de **intensidade de personalidade** por grau (usada pra calibrar os números abaixo):

- **1**: quebrado. A Virtude quase não segura nada.
- **2**: cede a impulsos regularmente.
- **3**: resiste à maior parte do cotidiano, mas tem vários "guilty pleasures" que o derrubam.
- **4**: raramente cede; só numa situação bem particular ou um azar de verdade.
- **5**: só cede se QUISER; costuma até impedir os outros de agir fora da própria Virtude.
- **6**: ápice. Praticamente inflexível, e isso tem consequência dramática (não foge de luta nem
  deixa os outros fugirem, não permite violência que julga desnecessária, não cede a vício nem
  deixa os outros cederem, não desiste de objetivo nem deixa os outros desistirem).

Virtude tem três usos mecânicos hoje:

1. **Canalizar** (já fechado, sem risco): uma vez por cena, por Virtude, numa ação coerente com
   ela, soma o valor cheio da Virtude na rolagem normal (`Atributo+Habilidade+Virtude`). É puro
   bônus, sem teste, sem custo.
2. **Conduta**: agir fiel à própria régua moral, num momento que custa caro, pode devolver Força
   de Vontade (a critério do Mestre).
3. **Resistir**, e é aqui que mora o problema que motivou este documento.

## 6 · O problema achado: não existia um teste de Virtude de verdade

O texto publicado do capítulo dizia: *"Resistir. Para aguentar uma pressão da alma, role a
Virtude apropriada **somada a um Atributo**: medo = Bravura + Vigor..."* Ou seja, descrevia um
teste igual a qualquer outro (Atributo+Virtude, pela mesma conversão soma→dado da seção 2).

**O problema**: com essa conversão, Virtude 1 e Virtude 6 variam de 2 até 3d6 (resultado de 2 a
18), uma régua larga demais pro que a Virtude precisa expressar. Ela precisa ser capaz de fazer
alguém de Virtude 2 ceder à MAIORIA dos impulsos comuns, e alguém de Virtude 5 quase NUNCA ceder,
usando a MESMA Dificuldade pros dois. Numa parada larga (Atributo+Virtude), esse contraste se
perde: todo mundo acaba passando ou falhando parecido, porque o Atributo (que não tem nada a ver
com força de vontade) dilui o efeito da Virtude.

### A solução fechada agora

**A Virtude sozinha alimenta a mesma conversão soma→dado da seção 2, sem somar Atributo nenhum.**
Ou seja, trata-se o valor da Virtude como se já fosse "a soma":

| Virtude | Parada de dados |
|:--:|---|
| 1 | 2 (fixo, sem dado) |
| 2 | 1d6 |
| 3 | 1d6+2 |
| 4 | 2d6 |
| 5 | 2d6+2 |
| 6 | 3d6 |

E compara contra a MESMA tabela de Dificuldade da seção 2 (5/10/15/20/25), sucesso = total maior
que a Dificuldade. **Zero mecanismo novo**: é literalmente a função que já existe no motor do
jogo (soma → pool), só alimentada com um número diferente.

Os números batem com a régua de intensidade pedida: contra Dificuldade 5 (Fácil), Virtude 2 passa
só ~17% das vezes sem ajuda extra (Firula/Especialidade); contra Dificuldade 15 (Difícil), Virtude
6 passa só ~5% das vezes. A régua fica bem mais dura (cada Virtude domina duas bandas inteiras de
Dificuldade) do que uma tentativa anterior com `2d6+Virtude`, que foi descartada por diluir demais
o peso da Virtude.

Esse teste serve pra:
- **Resistir**: medo, provocação, tortura, tentação. O texto do capítulo precisa trocar "Virtude
  + Atributo" por só "Virtude".
- **Ceder a um impulso**: o exemplo dado foi alguém que gosta de apostar passando na frente de uma
  casa de apostas. Sucesso no teste de Temperança = resiste; falha = cede. A Dificuldade sobe com
  a intensidade do impulso (uma mesa de bêbados jogando cartas é mais fácil de resistir que um
  cassino de luxo).
- **O gatilho do Frenesi** (seção 7).

## 7 · Frenesi e Frenesi Contido: o que é, o que já está fechado, o que falta

Dois traços raciais (Orc puro e Meio-Orc) deixam o personagem entrar num estado de fúria de
combate:

- **Frenesi (Orc puro)**: em fúria, só realiza ações físicas (mais Intimidar, que vira ação
  reflexa com +2 dados). **Ignora TODAS as penalidades de ferimento** (Machucado, Grave, Crítico)
  até a Vida chegar em Incapacitado.
- **Frenesi Contido (Meio-Orc)**: mesma restrição de ações. Ignora só Machucado e Grave. Ao
  entrar em Crítico, **sai da fúria sozinho** e passa a sentir a penalidade cheia de novo. Pode
  reentrar em Frenesi Contido depois, se a Vida voltar a Grave ou melhor.

Isso (o comportamento DENTRO da fúria, em relação ao ferimento) já está decidido, implementado e
revisado. **O que falta é tudo em volta**: como entra, quanto dura, e o que acontece depois.

### O que já foi decidido nesta conversa, pra entrada

- **Gatilho**: um teste de **Temperança** (a Virtude, pela mecânica da seção 6), contra a
  Dificuldade do que provocou a fúria (tomar dano grave, ver um aliado cair, ser humilhado em
  combate — a lista exata de gatilhos ainda não foi escrita).
- **A penalidade de ferimento vira BÔNUS só nesse teste específico**: em vez de atrapalhar, ela
  ajuda a entrar em fúria (Machucado dá +2 pontos no teste, Grave dá +1d6, Crítico dá +2d6, os
  MESMOS valores da tabela da seção 4, só com o sinal trocado pra este uso). A lógica: quanto mais
  ferido, mais fácil perder o controle e entrar em fúria.
- Também é possível **gastar 1 ponto de Força de Vontade pra somar +2 pontos** no teste (empurra
  a entrada em fúria de propósito).
- **Custo pra entrar**: nenhum além do teste em si (é traço racial, não Técnica paga).

### O que ainda está em aberto, e é o motivo deste documento

**1. Manutenção do Frenesi (like uma "âncora" que precisa ser puxada de novo com o tempo).** A
ideia do humano: quando o Frenesi "for acabar", o jogador pode rolar um teste pra mantê-lo por
mais um tempo, e **esse teste vai ficando cada vez mais difícil** a cada renovação (ou com o
tempo). As duas opções cogitadas pra parada de dados desse teste de manutenção:

- **Autocontrole** (Habilidade secundária que já existe no jogo, grupo "interior", descrição:
  "Segurar o que vem de dentro: raiva, pânico, vício, luxúria, luto, o impulso de responder à
  provocação. Integridade resiste ao que os outros fazem com você; Autocontrole resiste ao que
  você faz consigo mesmo"). Ainda não está definido com qual Atributo ela combina normalmente.
- **Vigor + Resistência** (Resistência é a Habilidade primária "aguentar": marcha, fome, dor,
  veneno, ligada ao Atributo Vigor).

Perguntas concretas a resolver: qual das duas (ou seria melhor usar Temperança de novo, já que é
ela que ativa?); o que define "quando o Frenesi vai acabar" (um relógio, tipo Ticks, que dispara
o teste de manutenção periodicamente?); como a dificuldade cresce a cada renovação (fixo +N? dobra?
acompanha quantas vezes já renovou?); o que acontece numa falha (sai do Frenesi imediatamente, ou
ainda tem um turno de graça?).

**2. Consequência ao sair do Frenesi.** Depois que o personagem sai (por vontade própria, por
falhar o teste de manutenção, ou por entrar em Crítico no caso do Frenesi Contido), ele fica com
**penalidades por um tempo**, além de qualquer penalidade de ferimento normal que já tivesse. O
humano quer que **tanto a duração quanto a intensidade dessas penalidades dependam de quanto
tempo o personagem ficou em fúria** (fúria mais longa = ressaca pior). Isso ainda não tem número
nenhum: nem a moeda da penalidade (ponto? dado? as duas?), nem a curva (linear com o tempo em
fúria? por degraus?), nem a duração da ressaca em si.

## 8 · O que essa conversa devia produzir

Uma proposta fechada (com números, não só conceito) para:

1. A parada de dados do teste de manutenção do Frenesi (Autocontrole? Vigor+Resistência?
   Temperança de novo? outra coisa?), o relógio que dispara esse teste, e como a Dificuldade cresce
   a cada renovação.
2. O que acontece quando falha esse teste (sai na hora? tem aviso?).
3. A penalidade de "ressaca" pós-Frenesi: moeda (ponto/dado/mista), tamanho, e como escala com o
   tempo total que o personagem ficou em fúria.

Tudo isso deve ser compatível com o que já está fechado nas seções 6 e 7 (o teste de entrada por
Temperança, a penalidade de ferimento virando bônus na entrada, os dois traços Frenesi/Frenesi
Contido e como cada um se comporta hoje).
