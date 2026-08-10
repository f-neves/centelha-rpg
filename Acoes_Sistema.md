# Ações & Sistema

> Documento de frente aberto em **2026-08-09**. Ainda **não existe capítulo no site**: este
> arquivo é o rascunho dele. Pendência **G1** no `Pendencias.md`.
>
> Modelo: o capítulo **Drama and Systems** (cap. 4) do Exalted 2ª edição, que pega as ações que
> todo mundo tenta fora do combate (subir num muro, nadar contra a corrente, cair de uma torre,
> beber o que não devia, disfarçar-se, rezar) e dá número a cada uma, em vez de deixar tudo por
> conta do improviso da mesa.

---

## 1. Por que o capítulo existe

Centelha já tem número para tudo que acontece **dentro** da luta: iniciativa, acerto, dano,
Absorção, Fôlego, as três Defesas. Fora dela o sistema fica mudo. O mestre que precisa dizer até
onde um personagem escala, quanto tempo leva para forjar uma espada ou o que acontece com quem
bebe veneno de cobra tem de inventar na hora, e o que ele inventa não conversa com o resto da
régua: uma Dificuldade 15 improvisada não sabe que 15 é "perito" na tabela oficial.

Este capítulo é o inverso do capítulo de Combate. Ele pega o repertório de ações cotidianas e
heroicas, e para cada uma diz três coisas:

1. **Qual é a jogada** (Atributo + Perícia), ou se não há jogada nenhuma.
2. **Contra o quê** (Dificuldade fixa, tabela, ou teste resistido).
3. **Quanto tempo custa** e o que sai de um sucesso, de uma falha e de uma falha crítica.

Nada aqui inventa subsistema novo. O objetivo é o oposto: **reduzir** o número de regras
especiais, ancorando cada ação na régua de Dificuldade que já existe.

## 2. O que já é lei e não se reescreve aqui

Estas frentes já estão fechadas em outro lugar. O capítulo de Ações **aponta** para elas e não
repete a regra:

| Assunto | Onde mora |
|---|---|
| Escala de Dificuldade (Fácil ×4/3, Média ×5/3, Difícil ×2) | `/mestre` · `regras.json → dificuldade` |
| Combate, iniciativa, ataques múltiplos, Velocidade | capítulo **Combate** |
| As três Defesas (Física, Social, Mental) | capítulo **Defesas** · `Defesas_revisao.md` |
| Fôlego e esforço extenuante | capítulo **Fôlego** |
| Ferimentos, sangramento, cura | capítulo **Vida, Ferimentos & Cura** |
| Relações, Intimidades e a régua social | `Relacoes.md` · `Regua_Relacao.md` · `Combate_Social.md` |
| Ataques mentais e resistência à imposição | `Ataques_Mentais.md` |
| Levantar peso, faixas de carga, velocidade com carga | motor · `regras.json → forca` |
| Deslocamento, arranque, corrida e os três saltos | motor · `regras.json → derivados.deslocamento` |
| Alcance livre, alcance máximo e penalidade por distância | `Arremesso.md` |
| Conjuração, Efeitos e ritualismo | `Arcano_revisao.md` · `Trilhas_Feiticaria.md` |

## 3. A régua comum

> **A régua comum está FECHADA** (2026-08-09). As sete decisões estruturais foram tomadas e o
> capítulo publicado de Relações Sociais já foi acertado com elas. O que falta agora é o
> **gabarito de ficha** e as fichas em si.

### 3.1 De onde sai a Dificuldade

Da **tabela de âncoras** do Coração do Sistema, e não de uma fração do pool de quem tenta. Uma
muralha é tão difícil quanto ela é, independentemente de quem sobe: a Dificuldade descreve a
**tarefa**, nunca o personagem.

| Dif | Desafio | Atrib + Hab à altura | Nível |
|:--:|---|:--:|---|
| 5 | Fácil | 3 | Iniciante |
| 10 | Média | 6 | Competente |
| 15 | Difícil | 9 | Perito |
| 20 | Limite humano | 12 | Mestre |
| 25 | Excepcional | 15 | Herói |
| 30 | Sobre-humano | 18 | Semideus |

Os somas andam de três em três porque a régua é essa: **a Dificuldade à altura é a soma × 5/3**, e
a conta confere na probabilidade (soma 9 contra Dif 15 dá 56%; soma 12 contra Dif 20 dá 55%). Como
o teto mortal de Atributo + Habilidade é **12**, tudo de Dif 25 para cima já pede Centelha,
Proezas ou Artes, e é por isso que os degraus se chamam Herói e Semideus.

A régua de ×4/3, ×5/3 e ×2 da Área do Mestre continua valendo para o **Mestre improvisar** uma
Dificuldade na hora, a partir de quem está tentando. Ela não é o caminho deste capítulo: aqui
cada ficha **nomeia** a Dificuldade da tarefa, tirada da tabela acima.

Circunstância entra como **±2 ou ±4 na Dificuldade**, exatamente como a Área do Mestre já fixa.
Ferramenta certa, apoio, terreno e tempo abaixam; pressa, distração e condição ruim sobem. É por
aqui que oficina, corda, gazua e lanterna entram, sem mecânica nova.

### 3.2 A Margem mede expertise, não dificuldade

A cada **6 pontos acima do alvo**, uma Margem. Ela não serve para escolher a Dificuldade: ela
mede **quantos níveis de expertise sobraram** depois de a tarefa estar resolvida. Um total de 22
contra Dificuldade 10 são 12 acima, ou seja **duas Margens**: dois degraus de excedente.

Cada ficha declara **o que a Margem compra ali**. Em combate a conversão já é lei (+1d6 de dano);
fora dele o padrão é a ficha dizer: mais rápido, mais fino, mais duradouro, mais silencioso,
mais material aproveitado.

### 3.3 Os cinco modos de ação

Nem todo modo é jogado. Dois deles dispensam o dado.

| Modo | Rola? | Custa a ação? | Como se resolve |
|---|:--:|:--:|---|
| **Direta** | sim | sim | uma jogada, efeito imediato |
| **Acumulada** | sim | sim | Dificuldade **e** Acúmulo: cada jogada rende (resultado − Dificuldade), soma até fechar |
| **Longa** | **não** | fora de cena | mesma dupla, mas usando a **média** do pool por intervalo |
| **Reflexiva** | sim | **não** | uma jogada avulsa |
| **Passiva** | **não** | **não** | um valor parado: **2 × (Atributo + Habilidade)** |

#### Direta

Uma jogada contra a Dificuldade, resultado na hora. É o modo padrão e o único que a maior parte
das mesas usa hoje. Arrombar a porta, saltar o vão, mentir para o guarda.

#### Acumulada

A tarefa declara **dois** números: a **Dificuldade**, que é o quanto custa cada tentativa, e o
**Acúmulo**, que é o total de progresso necessário para terminar.

<p class="formula">Progresso da jogada = resultado − Dificuldade · A tarefa fecha quando o progresso somado alcança o Acúmulo</p>

Subir uma muralha: **Dificuldade 7, Acúmulo 10**. Quem tira 17 sobe de primeira, porque 17 − 7 são
os 10 pontos inteiros. Quem tira 12 sobe metade e continua no próximo intervalo.

Quando a jogada fica **abaixo da Dificuldade**, vale a **banda morta de uma Margem**, a mesma
regra que o capítulo de Relações Sociais já usa no cortejo:

| Ficou abaixo por | O que acontece |
|---|---|
| **menos de 6** | nada. Raspou: passou o tempo do intervalo e o progresso fica onde estava |
| **6 ou mais** | **perde a diferença**. Escorregou de verdade |

É a Margem valendo nos dois sentidos: para cima ela compra efeito melhor, para baixo ela cobra
terreno. Errar por pouco custa **tempo**; errar por muito custa **progresso**.

A ficha pode declarar outro comportamento quando este não fizer sentido:

- **nunca retrocede**, quando regredir é absurdo (o que já foi decifrado não se desdecifra);
- **falha completa e recomeço**, quando a tarefa é do tipo que desmorona inteira (a peça rachou
  no forno, o disfarce foi desmascarado).

O progresso nunca fica **abaixo de zero**. Quem não tem pool para a Dificuldade oscila em torno
do fundo e não avança, o que é a maneira certa de dizer "esta parede não é para você".

#### Longa

Mesma dupla Dificuldade e Acúmulo da Acumulada, e **nenhuma jogada**. Em vez de rolar, usa-se a
**média** do pool, somada uma vez por intervalo.

<p class="formula">Média = 3,5 × (número de dados) + 2 se a soma for ímpar<br />Progresso por intervalo = média − Dificuldade</p>

A média **não se arredonda**: o meio ponto é real, porque 3d6 tira 10,5 mesmo. Progresso
fracionário é normal, e o Acúmulo fecha quando o total o alcança.

| Soma | Pool | Média |
|:--:|:--:|:--:|
| 4 | 2d6 | 7 |
| 6 | 3d6 | 10,5 |
| 7 | 3d6+2 | 12,5 |
| 8 | 4d6 | 14 |
| 10 | 5d6 | 17,5 |
| 12 | 6d6 | 21 |

Forjar uma espada: **Dificuldade 7, Acúmulo 10**, intervalo de uma semana. O ferreiro tem Atributo
+ Habilidade 7, média 12,5, então rende **5,5 por semana**: na segunda semana chega a 11 e a peça
sai.

**A Centelha não entra na Longa.** Quem quebra a parede do trabalho longo são **Proezas e Artes**.

**Média igual ou menor que a Dificuldade não impede tentar.** O personagem simplesmente não
avança: cada intervalo passa e o Acúmulo não sobe. O caminho não é insistir, é **levantar a
média** ou **abaixar a Dificuldade**, e para isso vale tudo o que não é dado: stunt, ajuda,
ferramenta certa, oficina, material melhor, Proeza, Arte. O aprendiz que não consegue a peça
sozinho consegue com o mestre ao lado e a bigorna certa.

> A Longa é o modo em que **a competência substitui a sorte**. Não existe azar: existe capacidade
> suficiente, ou não existe.

#### Reflexiva

Uma jogada que não consome a ação do turno. Notar o vulto, reagir ao chão que cede, lembrar de
uma coisa no meio de outra.

#### Passiva

Sem jogada e sem dado: um **valor parado**.

<p class="formula">Valor Passivo = 2 × (Atributo + Habilidade)</p>

Ele funciona como uma **Defesa**: é o número que o mundo tem de superar para passar despercebido
por você, para enganá-lo, para escondê-lo de você. Por isso ele **quebra de propósito** o
escalonamento de ×1,75 da média (soma 12 dá média 21 e Valor Passivo 24), e a compensação vem do
outro lado, por Proezas e Artes de quem está tentando passar.

| Soma | Valor Passivo |
|:--:|:--:|
| 4 | 8 |
| 6 | 12 |
| 8 | 16 |
| 10 | 20 |
| 12 | 24 |

Casos específicos podem pedir outra conta, e a ficha diz quando.

#### O intervalo

Acumulada e Longa declaram um terceiro número, além de Dificuldade e Acúmulo: **em que ritmo o
progresso acontece**. A escada é **fechada**, em seis degraus, e a ficha escolhe um deles em vez
de inventar uma medida própria.

| Intervalo | Ordem de grandeza | O que cabe nele |
|---|---|---|
| **Tick** | ~1 segundo | a muralha com a ronda virando a esquina, o corredor sob fogo |
| **Minuto** | dezenas de segundos | arrombar a fechadura, estancar o sangramento |
| **Hora** | uma sentada | vasculhar a biblioteca, decifrar a página, costurar o ferimento |
| **Dia** | uma jornada | marcha forçada, caçar e forragear, rastrear a caravana |
| **Semana** | uma empreitada | forjar a espada, a viagem entre cidades, o treino |
| **Estação** | uma obra | erguer o muro, administrar a terra, o cortejo longo |

Os degraus estão longe uns dos outros de propósito (o salto vai de dez a sessenta vezes em tempo
real), e é isso que faz a escolha ser fácil: **nenhuma tarefa fica entre dois degraus**. O Mestre
narra quarenta minutos ou uma hora e meia à vontade; o que a ficha declara é o degrau.

O degrau também é o que revela o modo. Tick e minuto são território de **Acumulada**, porque ali
o dado tem função; semana e estação são território de **Longa**, porque ninguém rola trinta vezes
por uma espada. Hora e dia aceitam os dois, e é a pressão da cena que decide (§3.4). Não há
fronteira rígida: escalar sob vigia é Acumulada em Tick, escalar sozinho é Longa em hora, e é a
mesma parede.

Dois encaixes com o que já existe:

- **O Tick é o mesmo do Combate** (≈1 segundo), e é por isso que uma ação de Ações & Sistema pode
  acontecer no meio de uma luta sem tradução nenhuma.
- **"Período", em Relações Sociais, é o intervalo declarado.** O teto anti-abuso de stunts vale
  por intervalo, seja ele semana ou estação. Isso também casa com a regra de lá de que o
  intervalo-base **escala com a longevidade da raça**: o elfo corteja em estações onde o humano
  corteja em semanas, e o degrau muda sem que a regra mude.

### 3.4 Quem escolhe o modo é o jogador

Acumulada e Longa compartilham a mesma dupla de números. **O que escolhe entre elas é a pressão,
e quem decide é o jogador**, não uma tabela.

Quer subir o muro **agora**? Role. Mesmo com chance mínima de falhar, role: pressa é justamente o
que põe o dado na mesa. Quer subir o muro **sem pressa**, com calma e tempo? Tome a média e suba
em quantos intervalos forem precisos.

<p class="formula">Com pressa ou sob risco: Acumulada, com dado · Sem pressa: Longa, pela média</p>

E é por isso que **não existe piso numérico** neste capítulo. A pergunta "quando não se rola?" não
precisa de número: não se rola quando não há pressa, e essa é uma escolha declarada na mesa. O
princípio do Coração do Sistema ("os dados só entram quando o resultado é incerto e importa")
continua bastando, agora com um par de modos que o torna operacional em vez de conselho.

A escolha vale nos dois sentidos. Um personagem com média abaixo da Dificuldade **pode** escolher
a Longa: ele não vai avançar sozinho, mas pode passar a avançar assim que somar stunt, ajuda ou
ferramenta à média. E um personagem com média muito acima **pode** escolher rolar, se a cena tem
pressa, e aceitar o risco que o dado traz.

### 3.5 Ajuda e ação em grupo

Duas formas, e a ficha diz qual vale para aquela tarefa.

#### Somar Acúmulo

Em tarefa **simples e divisível**, os Acúmulos somam: dois cavando o mesmo túnel produzem o dobro
de progresso por intervalo. É o caso quando o trabalho pode ser fatiado sem perda.

#### Apoiar o principal

Quando o trabalho **não se divide** (uma fechadura, um paciente, uma peça no torno), um age e os
outros apoiam. O ajudante **rola contra a mesma Dificuldade**:

| O ajudante | Dá ao principal |
|---|---|
| falhou | nada |
| passou | **+2** |
| passou com Margem | **+2** e mais **+1d6 por Margem** |

É a mesma escala dos Stunts (+2 fixo, depois dados), e pela mesma razão: excedente de expertise
vira dado. Ajudar exige saber fazer, e quem não sabe não atrapalha nem ajuda.

#### Teste coletivo

Quando **o grupo inteiro** enfrenta a mesma coisa e o pior estraga para todos (o corredor
silencioso, a travessia da geleira), o normal continua sendo **cada um por si**. Quando a cena
pedir um resultado único:

1. A Dificuldade sobe **+2 por pessoa**.
2. Rola quem tem o **pior pool**, e o resultado é o do grupo.
3. Cada um dos outros pode rolar para ajudar, pela tabela de apoio acima.

Repare no que esses números fazem sozinhos: cada pessoa a mais sobe a Dificuldade em 2, e essa
mesma pessoa devolve +2 se passar. **O companheiro competente é neutro, o incompetente é peso, e
o perito melhora o grupo** (porque a Margem dele vira dado). O grupo grande não é punido por ser
grande, é punido por levar gente que não sabe o que está fazendo.

### 3.6 O que custa Fôlego

> **Resolvido em 2026-08-09, e de propósito sem escrever regra nenhuma.**
>
> Ressalva do autor: **o Fôlego é módulo opcional e pode vir a ser ocultado.** Nenhuma ficha deste
> capítulo deve depender dele. A decisão abaixo foi escolhida justamente por ser a única que
> sobrevive intacta se o módulo sair do livro.

O Fôlego **só morde em intervalo de Tick**, e isso já acontece sem nenhuma regra nova.

A razão é aritmética. O Fôlego repõe **+Vigor por Tick**, ou seja, por segundo. Um herói de Vigor
3 com Fôlego 43 sai do zero ao cheio em **quinze segundos**. Num intervalo de um minuto ou mais,
portanto, ele já encheu no caminho: cobrar um ponto por intervalo numa escalada de duas horas não
faria diferença nenhuma, e cobrar o bastante para fazer diferença exigiria uma segunda escala de
custo e uma segunda taxa de recuperação.

<p class="formula">Intervalo Tick: o Fôlego custa como no combate · Intervalo minuto ou maior: o Fôlego não é a moeda</p>

O que sobra é a leitura certa e ela é boa: **o Fôlego mede pressa, não esforço**. A subida
desesperada com a ronda chegando cobra fôlego porque acontece segundo a segundo; a mesma parede
subida com calma não cobra, e está certo assim. O desgaste de horas, dias e estações é assunto de
outra família, **Resistir**, e vai depender da escada de exaustão (item G7).

### 3.7 O acerto com Relações Sociais

> **Resolvido em 2026-08-09.** As quatro colisões estão fechadas e o capítulo publicado já foi
> corrigido.

O capítulo **Relações Sociais** tinha chegado a esta mesma máquina antes e por outro caminho, na
seção *Cortejo com calma: a Influência Estendida*. Os dois agora falam a mesma língua:

1. **Vocabulário.** Relações adotou os nomes daqui: o que era "Ativo" agora é **Acumulada**, e o
   que era "Passivo" agora é **Longa**. A palavra **Passiva** fica reservada, no livro inteiro,
   para o valor parado de 2 × (Atributo + Habilidade).
2. **A média não arredonda, em lugar nenhum.** A tabela publicada em Relações passou a mostrar as
   frações (3,5 · 7 · 10,5 · 14 · 17,5 · 21). O meio ponto quase não muda um confronto único
   contra a Defesa Social, mas na Longa ele se acumula e vira intervalos inteiros.
3. **As duas escalas de Stunt ficam.** A geral (+2 · +1d6 · +2d6) é de uma jogada só; a social
   (+1 · +2 · +4, teto de +7 por período, Contra Stunt subtraindo) empilha ao longo de
   intervalos e tem trava anti-abuso. A ponte que faltava: **em modo Longa, stunt em dado vale a
   média do dado** (nível 2 vale +3,5 e nível 3 vale +7).
4. **A falha rasa de Relações virou lei geral.** A banda morta de uma Margem, escrita acima na
   Acumulada, é a mesma regra que o cortejo já usava.

## 4. O catálogo

> **A descrição de cada ação e as referências de sistema (Exalted, D&D, Pathfinder, Cyberpunk e
> companhia) ficam em `Acoes_Catalogo.md`.** Lá cada verbete diz o que a ação é e quem já
> resolveu aquilo antes; aqui fica só a jogada sugerida e o estado. Ao acrescentar uma ação,
> acrescente nos dois.

**Estado de cada linha:**
**`MOTOR`** a conta já existe no código e na ficha, falta a prosa ·
**`DOC`** existe num documento de frente, falta virar capítulo ·
**`ABERTO`** nada escrito ainda.

A coluna **Jogada** é **sugestão de partida**, não decisão fechada.

> **Esta tabela é anterior aos cinco modos (§3.3) e ainda fala a língua antiga.** Onde ela diz
> "Longa: uma jogada só", está errada, porque a Longa não rola. Onde diz "uma jogada por dia",
> está querendo dizer Acumulada com intervalo diário. Nenhuma linha declara **Acúmulo** nem
> **intervalo**, que agora são obrigatórios. Cada linha será normalizada quando a ficha dela for
> escrita; até lá, leia a coluna como indicação de perícia, não de mecânica.

### 4.1 Corpo e movimento

| Ação | Jogada | Estado |
|---|---|:--:|
| Correr, perseguir, fugir | distância direta pelo Deslocamento (Arranque nos 3 primeiros Ticks, Corrida depois) | `MOTOR` |
| Saltar (vertical, horizontal parado, com corrida) | distância direta, sem jogada | `MOTOR` |
| **Arremessar um objeto** | distância direta pelo FAA · acerto é jogada à parte | `MOTOR` · §6.6 |
| Levantar o peso máximo | sem jogada: o FAH dá o teto | `MOTOR` |
| Deslocar-se carregando peso | velocidade × faixa de carga (Mínima, Leve, Média, Máxima) | `MOTOR` |
| **Escalar** | Força + Atletismo (esp. Escalada), Acumulada por trecho | `ABERTO` |
| **Nadar** | Vigor + Atletismo (esp. Natação), Acumulada contra a corrente | `ABERTO` |
| **Cair** | sem jogada de evitar: dano por altura, com Atletismo reduzindo | `ABERTO` |
| **Feito de força** (arrombar porta, dobrar grade, erguer portão) | Força + Atletismo ou Halterofilismo contra Dificuldade fixa | `ABERTO` |
| Equilibrar-se, atravessar viga, corda bamba | Destreza + Atletismo (esp. Equilíbrio) | `ABERTO` |
| Prender a respiração, apneia | Vigor + Resistência, Acumulada | `ABERTO` |
| Cavalgar, conduzir carroça, montaria em pânico | Destreza + Cavalgar | `ABERTO` |
| Marcha forçada, dias sem parar | Vigor + Resistência, uma jogada por dia | `ABERTO` |
| Acrobacia, rolamento, amortecer queda | Destreza + Atletismo (esp. Ginástica) | `ABERTO` |

### 4.2 Resistir

| Ação | Jogada | Estado |
|---|---|:--:|
| **Resistir a veneno** | Vigor + Resistência contra a potência do veneno, por dose e por intervalo | `ABERTO` |
| Resistir a doença | Vigor + Resistência, Acumulada ao longo de dias | `ABERTO` |
| **Resistir ao ambiente** (frio, calor, sede, fome, altitude) | Vigor + Resistência, Sobrevivência dá bônus de preparo | `ABERTO` |
| Sufocamento, afogamento, fumaça | Vigor + Resistência, agrava a cada intervalo | `ABERTO` |
| Resistir a medo, dominação e imposição | Defesa Mental · Vontade + Integridade | `DOC` |
| Aguentar dor, tortura, mutilação | Vontade + Integridade | `ABERTO` |
| Ficar acordado, privação de sono | Vigor + Resistência | `ABERTO` |
| Embriaguez, drogas, entorpecentes | Vigor + Resistência | `ABERTO` |

### 4.3 Sentidos e mente

| Ação | Jogada | Estado |
|---|---|:--:|
| Notar algo sem estar procurando | Percepção + Prontidão, passiva, o mestre rola | `ABERTO` |
| Vasculhar um cômodo, revistar um corpo | Percepção + Investigação, Acumulada por quarto de hora | `ABERTO` |
| Ver ao longe, no escuro, na neblina | Percepção + Prontidão com penalidade por condição | `ABERTO` |
| Rastrear pegada, farejar trilha | Percepção + Sobrevivência | `ABERTO` |
| Saber alguma coisa (lembrar, reconhecer) | Inteligência + Conhecimentos Gerais ou a secundária do assunto | `ABERTO` |
| Pesquisar em biblioteca ou arquivo | Inteligência + Conhecimentos Gerais, Longa (horas a dias) | `ABERTO` |
| **Ler motivações**, farejar mentira | Percepção + Empatia contra a Defesa Social do alvo | `DOC` |
| **Avaliar um item** (valor, autenticidade, procedência) | Inteligência + Comércio, ou o Ofício da peça, ou Heráldica/História para relíquia | `ABERTO` |
| Diagnosticar ferimento ou doença | Inteligência + Cura | `ABERTO` |
| Primeiros socorros, estancar sangramento | Raciocínio + Cura | parcial |
| Orientar-se, ler mapa, achar o caminho | Percepção + Sobrevivência ou Geografia | `ABERTO` |
| Decifrar código, língua morta, criptografia | Inteligência + Conhecimentos ou Ocultismo | `ABERTO` |

### 4.4 Furtividade, roubo e engano

| Ação | Jogada | Estado |
|---|---|:--:|
| **Esgueirar-se**, mover-se em silêncio | Destreza + Furtividade contra Percepção + Prontidão | `ABERTO` |
| Esconder-se, sumir de vista | Destreza + Furtividade (esp. Ocultação) | `ABERTO` |
| **Roubar** (bater carteira, cortar bolsa) | Destreza + Prestidigitação contra Prontidão | `ABERTO` |
| Arrombar fechadura, forçar cofre | Destreza + Abrir Fechaduras, Acumulada | `ABERTO` |
| Desarmar armadilha | Destreza + Ladinagem | `ABERTO` |
| **Disfarçar-se**, passar por outra pessoa | Influência + Manha (esp. Disfarce) contra Percepção + Prontidão; a **Aparência penaliza** o disfarce | `ABERTO` |
| Falsificar documento, selo, assinatura | Inteligência + Falsificação | `ABERTO` |
| Esconder objeto no corpo, contrabandear | Destreza + Contrabando contra revista | `ABERTO` |
| Trapacear no jogo | Destreza + Prestidigitação contra Prontidão dos outros jogadores | `ABERTO` |

### 4.5 Social

Quase tudo aqui já está desenhado em `Combate_Social.md`, `Relacoes.md` e `Regua_Relacao.md`. O
capítulo de Ações só recolhe o que **não** é troca social prolongada:

| Ação | Jogada | Estado |
|---|---|:--:|
| Persuadir, intimidar, seduzir, enganar | ataque social contra Defesa Social | `DOC` |
| Discursar para uma multidão | Influência + Oratória, alvo coletivo | `DOC` |
| Barganhar preço, fechar negócio | Influência + Negociação ou Comércio | `ABERTO` |
| Etiqueta na corte, não dar vexame | Compostura + Etiqueta | `ABERTO` |
| Apostar, ler a mesa | Perspicácia + Apostar | `ABERTO` |
| Interrogar, arrancar informação | Influência + Interrogatório contra Integridade | `ABERTO` |
| Acalmar ou intimidar um animal | Influência + Adestramento ou Veterinário | `ABERTO` |
| Espalhar boato, plantar rumor | Influência + Manha, Longa (dias) | `ABERTO` |

### 4.6 Ofício e mundo

O maior buraco do sistema hoje: **não existe regra de construir coisa nenhuma**. Um jogador com
Ferraria 5 não tem como saber quanto tempo leva para fazer uma espada nem o que sai dela.

| Ação | Jogada | Estado |
|---|---|:--:|
| **Construir / forjar / fabricar** um objeto | Inteligência + o Ofício, **Longa**: tempo e material fixados pela peça, uma jogada só; margem de sucesso define a qualidade | `ABERTO` |
| Reparar peça danificada | mesma jogada, Dificuldade menor, tempo menor | `ABERTO` |
| Improvisar com o que tem à mão | Raciocínio + Ofício, Dificuldade maior | `ABERTO` |
| Cozinhar, conservar comida | Inteligência + Culinária | `ABERTO` |
| Preparar remédio, extrair veneno | Inteligência + Herbologia ou Alquimia, Longa | `ABERTO` |
| Caçar, forragear, montar abrigo | Percepção + Sobrevivência, uma jogada por dia | `ABERTO` |
| Navegar embarcação | Percepção + Navegação | `ABERTO` |
| Administrar terra, tropa ou negócio | Inteligência + Burocracia, Longa (estação) | `ABERTO` |
| Construir obra grande (muro, ponte, casa) | Inteligência + Arquitetura ou Alvenaria, Acumulada em semanas, com mão de obra somando | `ABERTO` |

### 4.7 Fé e o sobrenatural

| Ação | Jogada | Estado |
|---|---|:--:|
| **Rezar**, atrair a atenção de um deus | Vontade + Religião, **Longa**; o que se ganha é atenção, não milagre garantido | `ABERTO` |
| Meditar, recolher-se, recuperar Vontade | Compostura + Meditação | parcial |
| Exorcizar, benzer, afastar espírito | Vontade + Religião ou Ocultismo | `ABERTO` |
| Ritual menor (bênção, praga, adivinhação) | Inteligência + Ritualismo, Longa | `DOC` |
| Reconhecer manifestação sobrenatural | Inteligência + Ocultismo | `ABERTO` |
| Interpretar presságio ou sonho | Perspicácia + Interpretação de Sonhos | `ABERTO` |

---

## 5. O gabarito de ficha

### 5.1 O princípio: a ficha só escreve o que desvia

Tudo o que a §3 decidiu já vale para todas as ações, sem repetição. Uma ficha que não fala de
falha usa a **banda morta de uma Margem**; uma que não fala de ajuda usa o **apoio**; uma que não
fala de Fôlego não cobra Fôlego. **A ficha só escreve o campo quando o campo diverge do padrão.**

É isso que permite setenta e três fichas caberem num capítulo em vez de num volume. A maioria vai
ter quatro linhas.

### 5.2 Os campos

| Campo | Quando escrever | O que diz |
|---|---|---|
| **Modo** | **sempre** | Direta, Acumulada, Longa, Reflexiva, Passiva, ou "sem modo" quando o número é derivado |
| **Jogada** | **sempre**, salvo Longa e Passiva | Atributo + Perícia, e a **secundária** que cobre a ação, se houver (§5.5) |
| **Dificuldade** | **sempre** | com dois a quatro exemplos concretos na régua |
| **Acúmulo e intervalo** | se Acumulada ou Longa | o Acúmulo e o degrau da escada de seis |
| **A Margem compra** | **sempre** | o que o excedente de expertise faz nesta ação |
| **Falha** | só se divergir | "nunca retrocede" ou "falha completa e recomeço" |
| **Ajuda** | só se divergir | "os Acúmulos somam", quando a tarefa se divide |
| **Circunstância** | se houver as típicas | os ±2/±4 recorrentes desta ação |
| **Onde mais mora** | se houver | remissão a outro capítulo |

**Ordem fixa**, sempre a mesma, para o leitor achar o campo sem ler a ficha inteira.

### 5.3 Calibrar Dificuldade e Acúmulo

Aqui está a armadilha, e ela é séria: **a tabela de âncoras da §3.1 foi calibrada para passa ou
não passa, e não serve como está para Acumulada e Longa.** Na Direta a Dificuldade é uma barra que
se transpõe uma vez; na Acumulada ela é **atrito cobrado a cada intervalo**. Usar a mesma âncora
produz isto:

| Desafio | Soma à altura | Dif da âncora | Progresso por intervalo |
|---|:--:|:--:|:--:|
| Fácil | 3 | 5 | 0,5 |
| Média | 6 | 10 | 0,5 |
| Difícil | 9 | 15 | 1,0 |
| Limite humano | 12 | 20 | 1,0 |
| Excepcional | 15 | 25 | 1,5 |

O personagem exatamente à altura de uma tarefa Média avançaria **meio ponto por intervalo**: vinte
e dois intervalos para um Acúmulo de 10. Está errado.

A calibragem certa sai de uma pergunta simples: **quantos intervalos o personagem à altura deve
levar?** A resposta boa é **cerca de três**. E a régua que sai dela é surpreendentemente limpa:

<p class="formula">Dificuldade de Acumulada e Longa = <b>70% da Dificuldade de Direta</b>, arredondando para cima</p>

| Desafio | Dif na Direta | **Dif na Acumulada** | Soma à altura | Média | Progresso | **Acúmulo** para ~3 intervalos |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Fácil | 5 | **4** | 3 | 5,5 | 1,5 | **5** |
| Média | 10 | **7** | 6 | 10,5 | 3,5 | **11** |
| Difícil | 15 | **11** | 9 | 16 | 5,0 | **15** |
| Limite humano | 20 | **14** | 12 | 21 | 7,0 | **21** |
| Excepcional | 25 | **18** | 15 | 26,5 | 8,5 | **26** |
| Sobre-humano | 30 | **21** | 18 | 31,5 | 10,5 | **32** |

Os 70% não são arbitrários: eles caem exatamente em **dois terços da média** de quem está à
altura, que é o que faz esse personagem terminar em três intervalos. E a régua **reproduz o par
que já tínhamos na mão** para uma muralha, Dificuldade 7 e Acúmulo 10 para soma 6.

E o par tem uma divisão de trabalho que vale decorar:

<p class="formula">A Dificuldade diz <b>quão duro</b> · o Acúmulo diz <b>quanto tem</b></p>

Numa parede, a Dificuldade é a superfície e o Acúmulo é a altura. Numa espada, a Dificuldade é a
qualidade pretendida e o Acúmulo é o tamanho da peça. Numa cifra, a Dificuldade é o quanto o
código é fechado e o Acúmulo é o quanto há de texto. Mudar a Dificuldade muda **quem consegue**;
mudar o Acúmulo muda **quanto demora**.

### 5.4 Duas coisas que toda ficha vai esbarrar

> **[DECIDIR]**, as duas.

1. ~~Perícia secundária ou Especialidade?~~ **Resolvido em 2026-08-09.** Ver §5.5 abaixo.
2. ~~A âncora "Difícil" tem dois valores no projeto.~~ **Resolvido em 2026-08-09, e era pior do
   que parecia:** o `regras.json` divergia do capítulo em **três** linhas (soma 8 contra 9, 10
   contra 12, 12 contra 15) e ainda trocava os nomes dos degraus. O capítulo estava certo, porque
   os somas dele seguem a régua ×5/3 e conferem na probabilidade. O `regras.json` foi corrigido.

### 5.5 Quando a primária e a secundária cobrem a mesma ação

Escalar é **Atletismo**, e existe a secundária **Escalada**. Nadar é Atletismo, e existe
**Natação**. Isso se repete em mais de uma dúzia de ações, e a regra é uma só:

<p class="formula">A <b>maior</b> das duas entra no pool · a <b>menor</b> vira <b>bônus fixo</b> ao total</p>

| O personagem tem | Rola | Soma |
|---|---|:--:|
| Atletismo 4, Escalada 2 | pool com Atletismo 4 | **+2** |
| Atletismo 4, Escalada 4 | pool com qualquer uma | **+4** |
| Atletismo 2, Escalada 6 | pool com Escalada 6 | **+2** |
| Atletismo 4, sem Escalada | pool com Atletismo 4 | +0 |
| Sem Atletismo, Escalada 4 | pool com Escalada 4 | +0 |

A regra é simétrica, então tanto faz qual das duas é a "principal": vale sempre a maior no pool e
a menor somando. Investir nas duas nunca é desperdício, e quem se especializou de verdade tem um
número visivelmente melhor do que quem só tem o tronco.

**Só vale para a secundária que a ficha nomear.** Cada ficha diz qual secundária cobre aquela
ação, e o Mestre não precisa julgar caso a caso. Onde a ficha não nomeia nenhuma, a primária
trabalha sozinha.

**Consequência assumida:** isto torna a secundária mais eficiente por XP do que a Especialidade
(uma secundária 4 custa 18 XP e dá +4; dois níveis de Especialidade custam 28 e dão cerca de
+2,4). A decisão foi tomada de olhos abertos, e o reequilíbrio da Especialidade fica como item
próprio, fora deste capítulo.

---

## 6. Fichas

### 6.1 Escalar

> **Números de partida, não fechados.** Esta é a primeira ficha escrita no gabarito e serve de
> modelo para as outras. A descrição da ação está em `Acoes_Texto.md`, família Corpo e movimento.

**Modo** · Acumulada com pressa, Longa com calma. O par de números é o mesmo nos dois.

**Jogada** · Força + Atletismo, com a secundária **Escalada** pela §5.5: a maior das duas entra no
pool e a menor vira bônus fixo.

**Dificuldade** · a superfície, e só ela:

| Dif | Superfície |
|:--:|---|
| **4** | corda com nós, escada de mão, árvore de galhos baixos, muro de pedra seca com juntas fundas |
| **7** | muralha de pedra lavrada com frestas, encosta íngreme de terra e raiz, casco de navio atracado |
| **11** | tijolo bem assentado, penhasco molhado, chaminé estreita pelo atrito das costas |
| **12** | pedra lisa e polida, madeira encerada, gelo com piqueta |
| **14** | trecho invertido curto, vidro, gelo sem equipamento |

**Acúmulo e intervalo** · o Acúmulo é a **altura em metros**. O intervalo é o botão de velocidade
da cena:

| Intervalo | Quando | O que parece |
|---|---|---|
| **Tick** | perseguição, a ronda dobrando a esquina | subida atlética e desesperada, metros por segundo |
| **Minuto** | infiltração, tem pressa mas não desespero | subida cuidadosa, alguns metros por minuto |
| **Hora** | a parede longa, com paradas e equipamento | escalada de verdade |

**A Margem compra** · altura. Cada Margem sobe **mais 3 metros** naquele intervalo, além do
progresso normal. Quem tem folga de sobra passa a mão numa saliência que o outro teria de
procurar.

**Falha** · o padrão. Raspar (menos de 6 abaixo) custa o intervalo e nada mais; errar por 6 ou
mais **perde a diferença em metros**, que é escorregar de verdade. Zerar o Acúmulo é voltar ao
chão, e **quem volta ao chão de uma altura considerável não volta inteiro**: a queda é a ficha de
Cair.

**Ajuda** · não soma, apoia. Um só sobe de cada vez. Quem já está em cima e larga uma corda dá o
apoio pela tabela da §3.5, e quem tem a corda amarrada normalmente também abaixa a Dificuldade.

**Circunstância** · corda e equipamento **−4**; superfície molhada ou com gelo **+2**; escuridão
**+2**; carga acima da faixa Leve **+2**; escalar com uma das mãos ocupada **+4**.

**Onde mais mora** · a queda é ficha própria; carga e faixas de peso estão em Força & Arremesso;
o custo em Fôlego só existe quando o intervalo é Tick (§3.6).

### 6.2 Nadar

**Modo** · Acumulada com correnteza ou pressa, Longa na travessia calma.

**Jogada** · Vigor + Atletismo, com a secundária **Natação** pela §5.5.

**Dificuldade** · a água:

| Dif | Água |
|:--:|---|
| **4** | piscina, lago parado, mar de bonança |
| **7** | rio de corrente mansa, mar com ondulação, água gelada |
| **11** | correnteza forte, mar agitado, água muito fria |
| **14** | corredeira, ressaca, arrebentação sobre pedra |
| **18** | cachoeira, remoinho, mar de tempestade |

**Acúmulo e intervalo** · o Acúmulo é a **distância em metros**. Intervalo **Tick** quando é fuga
ou naufrágio, **minuto** na travessia curta, **hora** na travessia longa.

**A Margem compra** · distância. Cada Margem avança **mais 5 metros** naquele intervalo. A água
devolve mais que a parede: quem nada bem desliza.

**Falha** · o padrão, com uma divergência que importa: **zerar o Acúmulo sobre água funda é
começar a afundar**, e daí em diante vale a ficha de Sufocar, não esta.

**Ajuda** · não soma, apoia. Corda amarrada à margem é apoio e circunstância ao mesmo tempo.

**Circunstância** · armadura pesada **+4**; carga acima da faixa Leve **+2**; roupa pesada **+2**;
nadar a favor da corrente **−4**; corda de segurança **−2**; boia, tábua ou odre inflado **−2**.

**Onde mais mora** · faixas de carga em Força & Arremesso; o ar que acaba é a ficha de Sufocar.

### 6.3 Cair

**Modo** · **sem modo para cair**, que é consequência e não tentativa. O que existe são duas
**Reflexivas**: agarrar a borda antes, e amortecer depois.

#### O que a física diz, e por que isso importa aqui

O que machuca não é a altura, é a **velocidade na hora do impacto**, e essa velocidade não cresce
para sempre: o ar segura. Um corpo humano em queda descontrolada satura perto de **55 m/s**, e a
partir daí mais altura quase não acrescenta nada.

| Altura | Velocidade ao chegar |
|:--:|:--:|
| 5 m | 10 m/s |
| 15 m | 17 m/s |
| 30 m | 23 m/s |
| 50 m | 29 m/s |
| 100 m | 38 m/s |
| 200 m | 47 m/s |
| 500 m ou mais | 54 a 55 m/s |

Disso sai o **teto**, e ele não é uma regra inventada: **cair de mil metros machuca praticamente o
mesmo que cair de duzentos**. Do alto de uma torre para o alto de uma montanha a diferença é
narrativa, não mecânica.

#### O dano

**Valor fixo, não jogada.** O dano vai de 5 a mais de 300, e rolar cem dados não é jogo. A
variação de "como você caiu" mora na Reflexiva de amortecer, que é onde ela é interessante.

<p class="formula">Dano de Impacto, e a Absorção natural de Impacto é o Vigor (+ Centelha), mais a armadura</p>

| Altura | Dano | Altura | Dano |
|:--:|:--:|:--:|:--:|
| 2 m | **5** | 30 m | **63** |
| 3 m | **7** | 40 m | **81** |
| 5 m | **11** | 50 m | **98** |
| 7 m | **16** | 75 m | **137** |
| 10 m | **22** | 100 m | **169** |
| 12 m | **27** | 150 m | **221** |
| 15 m | **33** | 200 m | **258** |
| 20 m | **43** | 300 m ou mais | **304**, teto em **355** |
| 25 m | **53** | | |

**Regra de bolso do Mestre:** até uns 30 metros, **dano ≈ altura × 2,2**. Acima disso, tabela.

#### A altura que mata um não mata outro

Esta é a propriedade que o desenho tinha de ter, e ela sai sozinha do Vigor, que entra **duas
vezes**: nos PV e na Absorção de Impacto.

| Quem cai | PV | Absorção | Morre a partir de |
|---|:--:|:--:|:--:|
| Pessoa comum · Vigor 2 | 31 | 2 | **15 m** |
| Robusto · Vigor 4 | 37 | 4 | **19 m** |
| Herói · Vigor 6, Centelha 2 | 43 | 8 | **24 m** |
| Colosso · Vigor 6, Centelha 6 | 43 | 12 | **26 m** |

E os 15 metros da pessoa comum não são chute: é a altura em que, na vida real, cerca de metade
dos adultos morre numa queda. Aos 25 metros morrem nove em cada dez, e a tabela concorda.

#### Amortecer · Reflexiva

Destreza + Atletismo, com a secundária **Ginástica** pela §5.5, contra **Dificuldade 10**.

O sucesso não tira dano bruto: **tira 4 metros da altura efetiva**, e **cada Margem tira mais 3**.
É o que um bom rolamento faz de verdade, alongar a parada em vez de anular a queda.

| Altura | Sem jogada | Sucesso | Uma Margem | Duas Margens |
|:--:|:--:|:--:|:--:|:--:|
| 7 m | 16 | 7 | **0** | 0 |
| 10 m | 22 | 13 | 6 | **0** |
| 15 m | 33 | 24 | 17 | 10 |
| 20 m | 43 | 34 | 27 | 20 |
| 30 m | 63 | 54 | 47 | 40 |
| 50 m | 98 | 89 | 82 | 75 |

Repare no que a tabela diz: a jogada **salva de verdade** entre 7 e 20 metros, que é exatamente a
faixa em que a queda decide se você vive. Acima de 30 metros ela vira consolo, e está certo: não
existe rolar no chão que resolva uma queda de prédio.

#### Agarrar a borda · Reflexiva

Quando há borda, telhado, galho ou corda ao alcance, existe uma **primeira** Reflexiva, antes da
de amortecer: Destreza + Atletismo contra **Dificuldade 15**. Passando, a queda não acontece e o
personagem fica pendurado. Cada Margem sobe um trecho, ou permite agarrar com uma das mãos
ocupada.

**Falha** · não há o que falhar na queda: ela já é a falha de outra coisa. Falhar nas Reflexivas é
simplesmente cair inteiro.

**Circunstância** (na Dificuldade das Reflexivas) · água funda **−4**, e a partir dali vale Nadar;
neve funda, feno, lama ou copa de árvore **−2**; pedra, escada, estacas ou entulho **+2**; cair de
costas, surpreendido ou desacordado **anula as duas Reflexivas**.

**Onde mais mora** · Absorção e estados de ferimento em Vida, Ferimentos & Cura; a queda costuma
ser consequência de Escalar ou de Equilibrar-se.

### 6.4 Feito de força

Esta ficha tem **duas faces**, e confundi-las é o erro comum.

#### Erguer, segurar, arrastar

**Modo** · **sem modo**: não se rola. O peso máximo do personagem (o **FAH**) já responde, e ele
está calculado na ficha de personagem, em Força & Arremesso.

Está dentro do FAH? Ergue. Passou? Não ergue, e nenhuma jogada muda isso. O que muda é ajuda,
alavanca, roldana e Proeza.

#### Romper

**Modo** · Direta. É o instante em que alguma coisa cede ou não cede.

**Jogada** · Força + Atletismo, com a secundária **Halterofilismo** pela §5.5.

**Dificuldade** · o material, e o que o segura:

| Dif | O que se rompe |
|:--:|---|
| **5** | tábua apodrecida, corda fina, gesso, porta já frouxa nas dobradiças |
| **10** | porta de madeira comum, cadeado barato, corrente leve, tranca de madeira |
| **15** | porta reforçada com ferragens, grade de ferro fina, corda grossa, cadeado bom |
| **20** | porta de carvalho com barra, grade grossa, algemas, tranca de ferro |
| **25** | portão gradeado, parede de tijolo, corrente de âncora |
| **30** | porta de metal, cantaria, grade de masmorra feita para segurar coisas piores |

O teto mortal de Atributo + Habilidade é 12, então **Dif 20 é o limite do que um homem
excepcional arromba** com meia chance. De 25 para cima é território de Proeza, Arte ou aríete.

**A Margem compra** · silêncio e inteireza. Sem Margem a coisa cede com estrondo e em pedaços;
**com uma Margem** ela cede limpa, e a porta ainda fecha depois; **com duas**, cede em silêncio.
Numa fuga, essa diferença é a fuga inteira.

**Falha** · nada cede, e **cada tentativa faz barulho**. Não há progresso a perder porque não há
progresso: ou cedeu, ou não.

**Ajuda** · apoia. Um segundo ombro na mesma porta é apoio pela §3.5; três pessoas não cabem no
mesmo batente.

**Circunstância** · alavanca, pé de cabra ou marreta **−4**; correr para tomar impulso **−2**;
espaço apertado, sem apoio para os pés **+2**; tentar sem fazer barulho **+4**.

**Onde mais mora** · o peso máximo e as faixas de carga estão em Força & Arremesso; arrombar
fechadura sem quebrar nada é outra ficha, na família de Furtividade.

### 6.5 Esgueirar-se

**Modo** · Acumulada para atravessar um trecho vigiado; Direta quando é um momento só (passar por
uma porta enquanto o guarda se vira).

**Jogada** · Destreza + Furtividade, com a secundária **Ocultação** pela §5.5.

**Dificuldade** · aqui ela **não sai de tabela: sai do observador**. Quem vigia tem um
**Valor Passivo de Prontidão** (§3.3), que é 2 × (Percepção + Prontidão).

<p class="formula">Direta: passe do <b>Valor Passivo</b> do vigia · Acumulada: a Dificuldade é <b>70% do Valor Passivo</b></p>

| Quem vigia | Perc + Pront | Valor Passivo | Dif na Acumulada |
|---|:--:|:--:|:--:|
| Servo distraído, bêbado, criança | 3 | 6 | **4** |
| Guarda de portão, sentinela comum | 5 | 10 | **7** |
| Batedor, caçador, guarda de elite | 8 | 16 | **11** |
| Mestre de espiões, besta de faro apurado | 10 | 20 | **14** |

Havendo mais de um vigia, vale **o maior Valor Passivo**, e cada vigia a mais soma **+1** por
estarem cobrindo ângulos diferentes.

**O Valor Passivo não é um alarme ligado o tempo todo.** Ficar abaixo dele não significa, por si
só, que o vigia notou alguma coisa: significa que você não passou limpo. O que acontece depois
depende de **em que estado ele está**, e são três:

| Estado do vigia | Ficou abaixo por menos de 6 | Ficou abaixo por 6 ou mais |
|---|---|---|
| **Desatento** · dorme, bebe, conversa, está absorto no trabalho | nada | **suspeita**: ergue a cabeça, escuta |
| **Normal** · rotina, ronda de sempre, não espera ninguém | **suspeita** | **notado** |
| **Alerta** · esperando alguém, alarme dado, sabe que há intrusos | **notado** | **notado** |

A leitura é simples: **o estado de alerta é o que apaga a banda morta**. Um guarda de casa que já
viu alguém pular o muro detecta automaticamente quem não superar o Valor Passivo dele, sem
tolerância nenhuma. O mesmo guarda numa noite comum, entediado, deixa passar o que raspou.

**Suspeita** não é ser visto. É o vigia parar, olhar na direção, esperar. Custa o intervalo, e o
próximo sai com Dificuldade **+2**. Duas suspeitas seguidas promovem o vigia de **Normal** para
**Alerta**, e aí a banda morta some.

**Acúmulo e intervalo** · o Acúmulo é o **comprimento do trecho exposto, em metros**. Intervalo
**Tick** no corredor com ronda passando, **minuto** no pátio, **hora** para atravessar um
acampamento adormecido.

**A Margem compra** · terreno e tempo. Cada Margem avança **mais 4 metros**, ou, se o jogador
preferir, **congela um intervalo**: o vigia olha para o outro lado e o relógio da cena não anda.

**Falha** · **diverge do padrão, e é a divergência mais importante deste capítulo.** A banda morta
existe, mas ela não devolve metros: devolve **suspeita ou detecção**, pela tabela dos três estados
acima. Em furtividade não se escorrega um pouco, e o progresso conquistado nunca é perdido. O que
se perde é o anonimato, e esse não volta.

**Ajuda** · **teste coletivo** (§3.5), e é o caso que aquela regra foi escrita para cobrir. A
Dificuldade sobe +2 por pessoa, rola quem tem o pior pool, e os outros apoiam. O sujeito de
armadura de placas é o problema do grupo, e a regra diz isso com número.

**Circunstância** · escuridão **−4**; chuva, vento ou barulho de fundo **−2**; distração criada
por outro personagem **−2**; armadura pesada **+4**; carga acima da faixa Leve **+2**; piso de
cascalho, folha seca ou tábua solta **+2**; atravessar campo aberto e iluminado **+4**.

**Onde mais mora** · esconder-se e criar distração são fichas próprias; Aparência alta atrapalha
quem quer não ser lembrado (`Antecedentes.md`).

### 6.6 Arremessar um objeto

> **Modo:** nenhum. O **alcance** é um número derivado, como os PV ou o Deslocamento: sai de
> tabela e não se rola. Quem rola é o **acerto**, que é **Direta** e vive no capítulo de Combate.
> Esta ficha é o caso-limite que o gabarito precisa prever: nem toda entrada do capítulo é uma
> ação com modo.

**Estado: preenchida.** A conta já roda no motor e aparece na ficha, no bloco Força & Arremesso.
Esta seção é o **porquê** dela, que saiu da ficha em 2026-08-09 (lá ficou só a fórmula do FAA,
porque o jogador quer o número e o gráfico ao lado já mostra a forma da curva).

Arremessar tem **duas perguntas separadas**, e confundi-las é o erro clássico:

- **Até onde chega?** É o que esta ficha responde. Não tem jogada: sai de tabela.
- **Acerta o que mirou?** É ataque, resolvido no capítulo de Combate, com a penalidade por
  distância de `Arremesso.md` (alcance livre sem penalidade, e o que sobra até o máximo cortado
  em quatro faixas de −3 cada).

#### A Força de Arremesso

<p class="formula">FAA = (Força × 2) + Atletismo + Arremesso, de 2 a 24.</p>

Halterofilismo **não** entra na conta, mas entra pela porta dos fundos: o peso máximo que o
personagem ergue (o FAH) é a parede do arremesso, e quem ergue mais empurra a parede para longe.

Do FAA sai **R0**, o alcance extrapolado para massa zero, em metros:

<p class="formula">R0 = 136 × (FAA ÷ 24)<sup>0,69</sup></p>

Os 136 m são o recorde mundial do dardo. O expoente 0,69 foi ajustado contra sete marcas reais:
recorde do dardo, arremesso de peso mundial e nacional, disco de elite, pedra e bola de 1 kg
lançadas por pessoa comum, e beisebol amador.

#### Um quilo é o ápice, e a curva cai dos dois lados

Este é o ponto que surpreende quem lê a tabela pela primeira vez: **arremessar mais leve não
significa arremessar mais longe**. O alcance sobe conforme o objeto emagrece, até **1 kg**, e
dali para baixo desaba.

**De 1 kg para cima** manda a física do braço. Ao arremessar, o braço acelera o objeto **e a si
mesmo**, o que dá v(m) = v<sub>máx</sub> · √(m₀ ÷ (m + m₀)) e portanto alcance proporcional a
m₀ ÷ (m + m₀). Calibrando com arremesso de peso e dardo, a massa efetiva do braço m₀ dá **1 kg**,
que é justamente onde a curva vira. Multiplicando por um segundo fator, a parede da força:

<p class="formula">Alcance = R0 × [ m₀ ÷ (peso + m₀) ] × (1 − peso ÷ peso máximo)²</p>

O termo do meio é **técnica** e manda nos objetos leves; o último é **força** e manda nos
pesados. É o que faz o comando trocar sozinho entre Arremesso e Halterofilismo conforme o objeto
pesa, sem precisar de regra separada dizendo quando um substitui o outro.

**Abaixo de 1 kg** manda o ar. Falta massa para carregar o impulso contra o vento, e a distância
não desaba devagar: desaba rápido.

<p class="formula">Alcance = (alcance de 1 kg) × (3p² − 2p³), com p o peso em quilos</p>

Meio quilo vai à metade, cem gramas a menos de 3%, e uma moeda praticamente não sai da mão.

#### Parado, girando e correndo

Correr antes de soltar acrescenta até **+1/3**. Girar no lugar, até **+1/6**, metade do ganho da
corrida. Nenhum dos dois é bônus fixo: os dois são multiplicados pela **velocidade que o
personagem alcança carregando aquele objeto**, então encolhem junto com o peso, e as três curvas
se fundem numa só no peso máximo, sem degrau nenhum no caminho.

<p class="formula">Girando = Parado × (1 + v ÷ 6) · Correndo = Parado × (1 + v ÷ 3), com v a fração da velocidade máxima na carga</p>

#### As quatro faixas de carga

Saem do peso máximo P e cada uma dobra a anterior. A velocidade é
(1 − (peso ÷ P)<sup>1,5</sup>)², forma ajustada contra medições de sprint com colete e de marcha
com mochila: o primeiro décimo do peso máximo quase não custa nada, e o estrago acelera depois.

| Faixa | Até | Velocidade | Na prática |
|---|:--:|:--:|---|
| Mínima | P ÷ 8 | ~91% | corre quase igual |
| Leve | P ÷ 4 | ~77% | corre sentindo o peso |
| Média | P ÷ 2 | ~42% | não corre mais, anda rápido |
| Máxima | P | 0% | ergue, mas não sai do lugar |

#### O que falta nesta ficha

- **Arremessar gente e criaturas.** A curva vale para objeto compacto. Um corpo de 70 kg tem
  outra aerodinâmica e outra pegada.
- **Objeto mal balanceado.** Uma cadeira e uma pedra de 5 kg não voam igual, e hoje voam.
- **Arremesso para cima e para baixo.** De um muro, ou contra um muro.
- **Arremessar dois de uma vez**, e como isso conversa com a regra de ataques múltiplos.

---

## 7. Construção e ofício

### 7.1 Não é um subsistema, é a Longa com tabela

O catálogo chamava esta família de "o maior vazio do sistema" e previa um subsistema pequeno.
Ele não é necessário. Fabricar alguma coisa é exatamente a estrutura que a §3.3 já fechou para a
**Jogada Longa**, e a divisão de trabalho da §5.3 cai em cima do ofício com uma precisão que
nenhum outro caso teve:

<p class="formula">A <b>Dificuldade</b> é a técnica da peça · o <b>Acúmulo</b> é o tamanho do serviço · o <b>intervalo</b> é o ritmo do ofício</p>

Uma espada e um punhal exigem a mesma técnica e serviços de tamanhos diferentes. Uma espada e uma
espada **boa** exigem técnicas diferentes, e a §7.5 acrescenta a essas três medidas uma quarta, o
**Requisito**, que é a porta. Isso resolve sozinho a pergunta que travava a família: **o que
separa o ferreiro competente do mestre não é velocidade, é o que ele consegue fazer.** A Longa é
uma parede, não uma ladeira: quem tem média igual ou menor que a
Dificuldade não termina nunca, por mais meses que passe na bigorna. É deliberado, e no ofício é
justamente o comportamento certo. Paciência não faz uma lâmina melhor.

Fabricar é **Longa** por padrão. Vira **Acumulada** só quando há pressa real com consequência
(consertar a ponte antes da cheia, forjar as pontas de lança antes do cerco fechar), e aí se rola
a cada intervalo em vez de tomar a média.

### 7.2 Ofícios Gerais e os ofícios

**Ofícios Gerais** é o faz-tudo: pregos e dobradiças, cabo de arma, flecha rústica, entalhe,
porta, cerca, polimento, remendo de armadura, engenhoca pequena. É uma primária, e é honesta
dentro do escopo dela.

**Ofícios Gerais cobre sozinho tudo o que for Dificuldade 4 ou menos.** Acima disso falta escola,
e a regra é uma só:

<p class="formula">Sem o ofício específico, a Dificuldade sobe <b>+4</b></p>

Não é uma parede, é um degrau. Um faz-tudo excepcional (Ofícios Gerais 6, Destreza 4, média 16)
consegue bater uma espada simples: Dificuldade 7 vira 11, e ele avança 5 por dia. O que ele não
consegue é uma espada **boa**, nem uma fechadura, nem uma placa. É o resultado que se quer: o
generalista chega ao funcional e para ali.

A parede, quando existe, é o **Requisito** (§7.3), e para ela vale a outra metade da regra:

<p class="formula">Ao conferir o Requisito de uma peça de ofício, <b>Ofícios Gerais vale metade</b>, arredondando para baixo</p>

Ofícios Gerais 6 satisfaz Requisito 3, e nada acima disso. É o que fecha a fechadura de segredo, a
placa completa sob medida, a peça de joalheria e o casco de navio ao faz-tudo, sem que o Mestre
precise arbitrar caso a caso. Não é penalidade, é conhecimento que não se improvisa.

Os ofícios são **Habilidades Secundárias**, ilimitadas e mais baratas (Ferraria, Armaria,
Carpintaria, Alvenaria, Curtume, Alfaiataria, Joalheria, Serralheria, Culinária, Herbalismo,
Iluminura, Olaria, Vidraria, Construção Naval, o que a história pedir). E aqui a **§5.5** vale
inteira, porque Ofícios Gerais e o ofício cobrem a mesma ação:

<p class="formula">A <b>maior</b> das duas entra no pool · a <b>menor</b> vira <b>bônus fixo</b></p>

O ferreiro com Ferraria 5 e Ofícios Gerais 3 rola com Ferraria e soma +3. O atributo é
**Destreza** para trabalho de mão e **Inteligência** para projeto, traçado e cálculo; quem
decide qual é a peça, não o jogador.

### 7.3 A peça em cinco números

Cada peça do catálogo carrega cinco números, e às vezes um sexto:

| Número | O que é |
|---|---|
| **Requisito** | o nível mínimo de Habilidade no ofício. Abaixo dele a peça não se tenta, e nenhum modificador abre a porta |
| **Dificuldade** | o atrito de cada intervalo: quem passa dela avança, e quanto mais passa, mais rápido |
| **Montagem** | o Acúmulo que se paga **uma vez por lote**: acender a forja, montar o tear, bater a argamassa, armar o cavalete |
| **Peça** | o Acúmulo de **cada unidade** |
| **Intervalo** | o degrau da escada de seis em que aquele ofício respira |
| **Piso** | quando há, o número mínimo de intervalos, por mais hábil que seja o artesão |

<p class="formula">O <b>Requisito</b> é a porta · a <b>Dificuldade</b> é o ritmo · o <b>Acúmulo</b> é o tamanho</p>
<p class="formula">Acúmulo total = Montagem + (Peça × unidades)</p>

Requisito e Dificuldade parecem a mesma coisa dita duas vezes, e não são. **O Requisito é
conhecimento e a Dificuldade é execução**, e as duas se separam de verdade nos dois extremos da
bancada. Uma **cota de malha** é Requisito 2 e Acúmulo enorme: qualquer armeiro sabe abrir, passar
e rebitar um anel, e são milhares deles. Uma **fechadura de segredo** é Requisito 5 e Acúmulo
pequeno: são poucos dias de trabalho que quase ninguém sabe fazer. Uma sem a outra não descreveria
nenhuma das duas.

Só a **Habilidade** conta para o Requisito, nunca a soma com o Atributo: destreza de mão não
substitui não saber. O Requisito confere contra a perícia que entra no pool pela §5.5, com Ofícios
Gerais valendo metade (§7.2). O ajudante sob direção (§7.6) não tem Requisito nenhum: quem sabe é
quem dirige.

O **Piso** existe por um motivo concreto: há serviço que não é técnica, é mão. Uma cota de malha
são milhares de anéis abertos, passados e rebitados um a um, e nenhuma perícia do mundo cria dedos
extras. O mestre armeiro faz uma cota **melhor** que o oficial, não uma cota em três dias. Poucas
peças precisam de Piso: as de trabalho repetitivo em massa e as obras.

### 7.4 A montagem se paga uma vez: o lote

É o ponto que mais muda a mesa, e sai direto da oficina real: **ninguém mantém uma forja acesa
para fazer uma espada só.** Aquecer, preparar o carvão, temperar a água, arrumar as bancadas:
isso custa o mesmo para uma peça ou para oito. Só o trabalho da peça se repete.

Por isso a Montagem entra uma vez por **lote**, e não por unidade. O efeito é grande:

| Espadas no mesmo lote | Acúmulo total | Dias para o oficial | Dias por espada |
|:--:|:--:|:--:|:--:|
| 1 | 22 | 6,3 | 6,3 |
| 3 | 42 | 12,0 | 4,0 |
| 5 | 62 | 17,7 | 3,5 |
| 8 | 92 | 26,3 | 3,3 |

O ganho é real e satura, que é como funciona de verdade. O **limite do lote** é físico, não
numérico: quantas peças cabem no fogo, na bancada, no tear. Na falta de um número melhor, **oito**
serve para peça de mão e **três** para peça grande.

O lote exige que as unidades sejam **iguais**. Cinco espadas do mesmo modelo são um lote; uma
espada, um elmo e uma panela são três montagens.

### 7.5 A qualidade move os cinco números de uma vez

A peça sai **Comum** por padrão, e é o que sai em quase todo lugar. A régua vai para os dois
lados, e cada grau mexe em tudo:

| Por grau **acima** de Comum | Por grau **abaixo** |
|---|---|
| Requisito **+1** | Requisito **−1**, nunca abaixo de **1** |
| Dificuldade **+3** | Dificuldade **−3**, nunca abaixo de **1** |
| Montagem e Peça **× 1,5** | Montagem e Peça **× 0,5** |
| Intervalo sobe um degrau **a cada dois graus** | o Mestre **pode** descer um degrau em −2 |
| Preço **dobra** | Preço **cai pela metade** |
| **+1** num número da peça | **−1** num número da peça |

Seis graus, e o eixo inteiro cabe numa linha:

| Grau | −2 | −1 | 0 | +1 | +2 | +3 |
|---|---|---|---|---|---|---|
| | **Sucata** | **Tosca** | **Comum** | **Boa** | **Ótima** | **Excepcional** |

O "número da peça" é o que aquela peça tem para dar: acerto, defesa da arma, dado de dano,
Absorção de uma categoria, penalidade reduzida em 1, um degrau a menos de peso. No máximo **+2 ou
−2 no mesmo número**, para que uma Excepcional espalhe o ganho em vez de empilhar. É exatamente o
painel de **ajuste** que a ficha já oferece hoje, e que até agora não tinha como ser conquistado:
uma Espada Longa Ótima deixa de ser um nome que o jogador escreve e passa a ser uma encomenda com
Requisito, preço e prazo.

**Os quatro custos juntos são o freio, não a Dificuldade sozinha.** Por isso o grau só soma +3, e
não a Margem inteira de 6 que a versão anterior desta seção usava: o Requisito já fecha a porta
para quem não tem escola, e o Acúmulo já cobra o tempo. A espada, que é Requisito 3, Dificuldade
7, Montagem 12, Peça 10 e intervalo de dia, fica assim:

| Grau | Req | Dif | Acúmulo | Intervalo | Quem faz, e em quanto tempo |
|---|:--:|:--:|:--:|---|---|
| Sucata | 1 | 1 | 6 | dia | Ferraria 1, meio dia |
| Tosca | 2 | 4 | 11 | dia | oficial, 1,7 dia |
| **Comum** | 3 | 7 | 22 | dia | oficial, 6,3 dias |
| Boa | 4 | 10 | 33 | dia | Ferraria 4 e soma 10, 4,4 dias |
| Ótima | 5 | 13 | 50 | **semana** | mestre (soma 12), 6,3 semanas |
| Excepcional | 6 | 16 | 74 | semana | mestre em oficina de mestre, 8 semanas |

A subida do intervalo em Ótima é o que impede a peça fina de sair no ritmo da peça de tropa. E a
última linha mostra o teto do sistema funcionando: a soma máxima de um humano é **12** (Habilidade
6 e Atributo 6), o que dá média 21 e cinco pontos por semana contra a Dificuldade 16. Quinze
semanas. Uma espada Excepcional **não sai numa forja de vila**: o que a torna viável é a oficina
de mestre, os quatro pontos de Dificuldade que ela derruba, o bônus fixo de Ofícios Gerais pela
§5.5 e a Especialidade. É o que se quer: aço bom e boas ferramentas são metade de uma boa lâmina.

Para baixo a régua serve à mesa tanto quanto para cima. É o que o bando forja no acampamento, o
que o exército distribui à tropa, e o que o mercador tenta empurrar como Comum.

**Especialidade na Longa.** A Especialidade dá +1d6 com descarte do menor, o que não é um número
fixo. Na média, cada nível vale **cerca de +2**. Um ferreiro com Especialidade "espada longa" nos
dois níveis soma cerca de +4 na média, e é frequentemente o que separa a Boa da Ótima. Vale para
qualquer Longa, não só para o ofício.

### 7.6 Oficina, material, ajuda

São os ±2 e ±4 de circunstância que já são lei (§2), e no ofício eles são o principal caminho
para a qualidade:

| | −4 na Dificuldade | −2 | +0 | +2 | +4 |
|---|---|---|---|---|---|
| **Oficina** | de mestre, completa | bem equipada | oficina comum | ferramenta de campo | improviso, sem bancada |
| **Material** | excepcional, raro | selecionado | corrente | de segunda, remendado | sucata |

O material precisa **alcançar o grau pretendido**: não sai peça Excepcional de aço corrente, por
melhor que seja o ferreiro. Regra de bolso para o Mestre: o material custa cerca de **um terço**
do preço da peça pronta, e **metade ou mais** em alvenaria e construção naval, onde a pedra e a
madeira é que pesam.

Para as armaduras existe um atalho, porque elas já carregam um campo de acesso:

<p class="formula">Dificuldade da armadura ≈ 12 − acesso, com piso 4</p>

O gambeson cai em 4, a cota de malha em 8, a brigandina em 6, a placa completa em 11. Bate com a
tabela abaixo, que foi escrita antes da fórmula.

**Ajuda** segue a §3.5. Ofício é quase sempre tarefa divisível, então os **Acúmulos somam**: cinco
carpinteiros levantam a casa em um quinto do tempo. Mas atenção ao que **não** se divide: a
qualidade é da mão que conduz. Dez aprendizes aceleram uma espada Comum e não fazem uma Ótima.

**Direção de obra.** Aqui aparece um problema que a §3.5 sozinha não resolve. O braçal tem soma 4
e média 7, então numa obra de Dificuldade 11 ele contribui com um número negativo: pela regra
crua, carregar pedra atrapalha. O que falta é a figura do mestre de obras.

<p class="formula">Sob direção de quem tem o ofício, o ajudante sem ofício trabalha contra <b>Dificuldade 4</b></p>

Quem pensa é o mestre; o ajudante executa serviço simples, e serviço simples é Dificuldade 4 em
qualquer obra. Cada supervisor dirige até **dez** ajudantes, e passar disso exige contramestres,
que é como as obras grandes de fato se organizavam. O ajudante nunca contribui para a
**qualidade**, só para o Acúmulo.

**Apressar.** Dobrar as horas rende **um intervalo extra** a cada dois, e custa **+2 na
Dificuldade** pelo cansaço e pela pressa. Vale a pena em peça fácil e é ruinoso em peça fina.

### 7.7 Tabela de referência

O oficial da tabela é o artesão comum de vila (soma 6, média 10,5). O perito é soma 9 (média 16)
e o mestre é soma 12 (média 21). Os tempos da última coluna são do **oficial**, uma unidade, sem
ajuda, em qualidade Comum.

#### Escala de horas

| Peça | Ofício | Req | Dif | Mont. | Peça | Oficial |
|---|---|:--:|:--:|:--:|:--:|:--:|
| Prego, gancho, dobradiça | Gerais | 1 | 4 | 2 | 1 | menos de 1 h |
| Ferradura, corrente, grampo | Ferraria, Gerais | 1 | 4 | 3 | 2 | menos de 1 h |
| Flecha rústica (dúzia) | Gerais | 1 | 4 | 2 | 5 | 1 h |
| Refeição farta para dez | Culinária, Gerais | 1 | 4 | 2 | 4 | 1 h |
| Flecha de guerra (dúzia) | Arcos | 2 | 7 | 2 | 6 | 2 h |
| Emplastro, tintura, tinta | Herbalismo | 2 | 7 | 2 | 5 | 2 h |
| Página iluminada, cópia fiel | Iluminura | 3 | 7 | 1 | 6 | 2 h |
| Chave copiada de molde | Serralheria | 4 | 11 | 2 | 3 | fechada ao oficial |

#### Escala de dias

| Peça | Ofício | Req | Dif | Mont. | Peça | Oficial |
|---|---|:--:|:--:|:--:|:--:|:--:|
| Porta, banco, mesa tosca, cerca de 20 m | Carpintaria, Gerais | 1 | 4 | 2 | 4 | 1 dia |
| Escudo | Carpintaria | 1 | 4 | 2 | 6 | 1 dia |
| Gambeson | Alfaiataria | 1 | 4 | 3 | 20 | 3,5 dias |
| Faca, machado, ponta de lança | Ferraria | 2 | 4 | 6 | 3 | 1,5 dia |
| Sela, arreio, bota, couro endurecido | Curtume | 2 | 7 | 3 | 9 | 3,5 dias |
| Móvel bem-acabado, arca | Carpintaria | 3 | 7 | 3 | 8 | 3 dias |
| **Espada, machado de guerra, arma marcial** | Ferraria | 3 | 7 | 12 | 10 | 6,3 dias |
| Arco longo, besta (madeira já curada) | Arcos, Carpintaria | 3 | 7 | 4 | 12 | 4,5 dias |
| Anel, broche, peça de joalheria | Joalheria | 4 | 11 | 3 | 6 | fechada ao oficial |
| Fechadura, engenho, autômato de corda | Serralheria | 5 | 11 | 4 | 10 | fechada ao oficial |

#### Escala de semanas

| Peça | Ofício | Req | Dif | Mont. | Peça | Piso | Oficial |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Casa de madeira, celeiro | Carpintaria | 2 | 4 | 4 | 40 | 2 | 7 semanas |
| Cota de malha | Armaria | 2 | 8 | 2 | 12 | 3 | 6 semanas |
| Brigandina | Armaria | 2 | 6 | 3 | 10 | 2 | 3 semanas |
| Lamelar | Armaria | 3 | 9 | 3 | 10 | 3 | 9 semanas |
| Carroça, barco de pesca | Carpintaria | 3 | 7 | 4 | 20 | 2 | 7 semanas |
| Forja, moinho, oficina montada | Alvenaria | 3 | 7 | 6 | 40 | 4 | 13 semanas |
| Placa de munição | Armaria | 4 | 8 | 4 | 14 | 3 | 7 semanas |
| Placa completa sob medida | Armaria | 5 | 11 | 6 | 24 | 6 | fechada ao oficial |

#### Escala de estações

| Obra | Ofício | Req | Dif | Mont. | Peça | Piso | Oficial |
|---|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Casa de pedra, torre pequena | Alvenaria | 3 | 7 | 2 | 8 | 1 | 3 estações |
| Muralha, ponte de pedra | Engenharia | 4 | 11 | 3 | 20 | 2 | fechada ao oficial |
| Navio de guerra, catedral | Naval, Alvenaria | 5 | 11 | 4 | 40 | 4 | fechada ao oficial |

As obras da última tabela **não são feitas sozinho**, e é por isso que aparecem fechadas: elas
existem para serem tocadas por equipe, com os Acúmulos somando e sob direção (§7.6). Uma muralha
tocada por um mestre de obras (média 16, contra a Dificuldade 11 da obra: 5 por estação) e dez
braçais (média 7, contra a Dificuldade 4 da direção: 3 cada) avança **35 por estação**. Um trecho
de Acúmulo 23 sai numa estação de trabalho e sai da obra na segunda, que é o piso.

### 7.8 Reparar, melhorar, improvisar, desmontar

**Reparar.** Mesma Dificuldade e mesmo intervalo da peça, com o Acúmulo cortado: **um quarto** do
Acúmulo da peça para dano leve, **metade** para dano pesado, **inteiro** para peça arruinada que
ainda tem material aproveitável. A Montagem se paga igual. E há uma distinção que vale a pena:

<p class="formula">Ofícios Gerais devolve a peça ao <b>uso</b> · só o ofício devolve a <b>qualidade</b></p>

Uma Espada Longa Ótima remendada no acampamento volta a cortar como uma espada Comum. Os graus
voltam quando um ferreiro de verdade puser a mão nela.

**Melhorar.** Subir **um grau de cada vez** numa peça pronta, com o **Requisito, a Dificuldade e o
intervalo do grau pretendido** e o Acúmulo de **metade** do que aquele grau custaria de novo. Uma
espada Comum vira Boa por 17 em vez de 33, com Ferraria 4 e Dificuldade 10. Material e oficina
precisam alcançar o grau novo. É por aqui que uma espada de saque vira a espada do personagem.

**Improvisar.** É **Direta** ou Acumulada em minutos, não Longa: uma tala, uma tocha, um arpéu com
o que está na mochila. Dificuldade da peça **+4**, sem material nem ferramenta certos, e o que sai
é frágil: serve para **um uso** ou até o fim da cena, o que vier primeiro. Não confundir com a
peça **Sucata** da §7.5, que é ruim mas é uma peça de verdade e dura.

**Desmontar.** Direta contra a Dificuldade da peça. Passando, recupera **metade** do material;
com uma Margem, recupera tudo o que era aproveitável. Falhando, recupera sucata.

### 7.9 Ganhar a vida com o ofício

No tempo morto entre aventuras, o artesão trabalha. Não se rola: é uma **Longa** de intervalo
**semana** contra a demanda do lugar, e o que ela produz é dinheiro em vez de peça.

<p class="formula">Ganho por semana = (média − 4) × 10 pc, limitado pela demanda do lugar</p>

O oficial (média 10,5) tira 65 pc por semana, o perito 120, o mestre 170. O teto é o mercado:
uma aldeia absorve talvez 50 pc por semana de qualquer ofício, uma vila 150, uma cidade 500, e uma
capital não tem teto prático. É o que faz o mestre armeiro se mudar para a cidade.

### 7.10 O que falta nesta família

- **Preço da peça pronta.** A tabela de `precos.json` cobre equipamento de aventura e não cobre
  armas, armaduras nem obra. Enquanto não cobrir, o material é o terço de um preço que o Mestre
  arbitra.
- **Peças mágicas e material sobrenatural**, que é a ponte com Artes e com o bestiário (couro,
  osso e escama de criatura como material de grau alto).
- **A oficina como traço do personagem**, com qualidade própria, no espírito do laboratório de
  `ArM`. Hoje ela é só um modificador de circunstância.
- **Colheita e extração**: minerar, abater madeira, curtir, curar madeira por um ano. São a etapa
  antes da forja e nenhuma está escrita.

---

## 8. Resistir

> **Estado: esqueleto.** As cinco fichas ainda não estão escritas; o que segue é a decisão de
> estrutura que elas vão seguir, e ela fecha a pendência G5.

### 8.1 Não existe uma escada única

A tentação era uma escada de exaustão só, servindo os cinco casos. Não serve, e o motivo é que
**os cinco não medem a mesma coisa**. Veneno é uma dose que age e passa. Doença é um estado que
dura e piora. Ambiente é uma pressão constante que o corpo aguenta até não aguentar. Sufocamento é
uma conta regressiva curta. Sono é uma dívida que se acumula por dias.

O que os cinco **compartilham** é a forma: um relógio próprio, um dano próprio e uma penalidade
própria. O que muda é tudo o mais, inclusive se há jogada.

| | Modo | Jogada | Intervalo | O que causa | Penalidade |
|---|---|---|---|---|---|
| **Veneno** | Direta por dose | Vigor + Resistência | do veneno (Tick a hora) | dano direto, ou Atributo derrubado | conforme o veneno |
| **Doença** | Acumulada às avessas | Vigor + Resistência | dia | estágios que avançam | acumula e não sai sozinha |
| **Ambiente** | Direta repetida | Vigor + Resistência | hora ou dia | dano que não se absorve | fadiga crescente |
| **Sufocamento** | **sem jogada**, relógio | nenhuma | Tick | contagem até a asfixia | nenhuma, e depois tudo |
| **Sono** | **Passiva** | nenhuma | dia | dívida acumulada | dados do pool, geral |

**Veneno tem jogada e sufocamento não** porque o corpo de fato reage ao veneno de formas
diferentes, e não reage à falta de ar: todo mundo desmaia, a diferença é quando. Sono é passivo
pelo mesmo motivo, mas com o relógio em dias em vez de segundos.

### 8.2 O que ainda falta decidir em cada uma

1. **Veneno.** Se o dano ignora Absorção (deveria), o que é uma "dose", e se um veneno derruba
   Atributo em vez de PV (é o que dá sabor: cicuta derruba Vigor, curare derruba Destreza).
2. **Doença.** Quantos estágios, e se a jogada diária empurra para cima e para baixo ou só segura
   onde está. É a única das cinco que precisa de estados nomeados.
3. **Ambiente.** Frio, calor, sede, fome e altitude no mesmo motor, com um relógio por tipo. É a
   que mais precisa de tabela e a que menos precisa de regra nova.
4. **Sufocamento.** Já é meia-devida por Nadar (§6.2) e por Cair; precisa da conta em Ticks e da
   relação com Fôlego, lembrando da ressalva da §3.6 (o módulo pode ser ocultado, então nada pode
   depender dele).
5. **Sono.** A dívida em dias, o que ela tira do pool, e se Centelha compra dias sem dormir.

E uma pergunta atravessa as cinco: **um personagem pode estar sob duas ao mesmo tempo**, e quase
sempre está (o náufrago tem frio, sede e sono). Ou as penalidades somam sem teto, ou vale a pior,
ou somam com teto. É a primeira coisa a decidir quando estas fichas forem escritas.

---

## 9. Pendências deste documento

1. ~~**[DECIDIR]** Os modos de ação.~~ **Fechado em 2026-08-09:** cinco modos (Direta, Acumulada,
   Longa, Reflexiva, Passiva), com Acumulada e Longa dividindo a dupla Dificuldade e Acúmulo, a
   Longa sem Centelha e sem arredondamento, e a Passiva valendo o dobro de Atributo + Habilidade.
   Junto fecharam a origem da Dificuldade (§3.1, tabela de âncoras) e o papel da Margem (§3.2,
   níveis de expertise excedente).
2. ~~**[DECIDIR]** O piso da jogada.~~ **Dissolvido em 2026-08-09:** não existe piso numérico.
   Quem escolhe entre rolar e tomar a média é o jogador, e o critério é a pressa (§3.4). Junto
   fecharam ajuda, apoio e teste coletivo (§3.5).
3. ~~**[DECIDIR]** Escalas de tempo e o custo em Fôlego.~~ **Fechados em 2026-08-09:** escada de
   seis intervalos (Tick, minuto, hora, dia, semana, estação), fechada, com "período" de Relações
   passando a significar o intervalo declarado (§3.3); e o Fôlego mordendo só em intervalo de
   Tick, sem regra nova (§3.6). **Com isso a régua comum está inteira.**
4. ~~**[DECIDIR]** As colisões com Relações Sociais.~~ **Fechadas em 2026-08-09** (§3.7), e o
   capítulo publicado já foi corrigido: vocabulário dos modos, média sem arredondar na tabela, e
   a banda morta de uma Margem promovida a regra geral.
5. ~~**[FAZER]** O gabarito de ficha.~~ **Escrito em 2026-08-09** (§5), com **Escalar** (§6.1)
   como ficha-modelo. Junto saiu a régua de calibragem da §5.3, que corrige um erro real: as
   âncoras de Dificuldade não servem para Acumulada e Longa sem serem rebaixadas a ~2/3 da média.
6. ~~**[DECIDIR]** As duas coisas da §5.4.~~ **Fechadas em 2026-08-09:** a secundária que cobre a
   mesma ação entra pela §5.5 (a maior no pool, a menor inteira de bônus), e a âncora "Difícil"
   estava errada no `regras.json`, em três linhas, já corrigida.
7. ~~**[FAZER]** As cinco fichas físicas.~~ **Escritas em 2026-08-09** (§6.1 a §6.5): Escalar,
   Nadar, Cair, Feito de força e Esgueirar-se, mais Arremessar (§6.6) como caso sem modo.
8. ~~**[FAZER]** Construção e ofício.~~ **Escrito em 2026-08-09** (§7). Não virou subsistema:
   é a Longa com tabela, e o que precisou de invenção foi o **lote**, o **Piso**, a **qualidade
   por Margem** e a **direção de obra**.
9. ~~**[DECIDIR]** Uma escada de exaustão única para Resistir.~~ **Decidido em 2026-08-09: não
   existe** (§8.1). Os cinco casos têm relógio, dano e penalidade próprios, e dois deles nem
   rolam.
10. **[FAZER]** As **cinco fichas de Resistir** (§8.2), decidindo antes como duas condições
    simultâneas se somam.
11. **[DECIDIR]** Trocar a palavra "stunt" em Relações Sociais por um termo em português.
12. **[DECIDIR]** Reequilibrar a **Especialidade**, efeito colateral assumido da §5.5. A §7.5
    acrescentou um dado novo à conta: na Longa, cada nível de Especialidade vale cerca de **+2**
    na média.
13. **[FAZER]** Normalizar a **tabela §4**, que é anterior aos modos e fala a língua antiga.
14. **[FAZER]** Decidir se isto vira **um** capítulo ou se cada família entra no capítulo que já
    existe (movimento em Combate, resistir em Vida & Ferimentos, social em Relações). A aposta
    atual é capítulo único, porque a régua comum da §3 precisa de um lugar só.
15. **[FAZER]** Quando fechar, virar `src/content/chapters/acoes-e-sistema.md` e provavelmente
    `regras.json → acoes` para as tabelas que o motor precisar ler.
