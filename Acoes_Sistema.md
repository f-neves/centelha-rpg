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
| **Arremessar um objeto** | distância direta pelo FAA · acerto é jogada à parte | `MOTOR` · §6.2 |
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
| **Jogada** | **sempre**, salvo Longa e Passiva | Atributo + Perícia |
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

1. **Perícia secundária ou Especialidade?** Escalar é Atletismo, mas existe a secundária
   **Escalada**. Nadar é Atletismo, mas existe **Natação**. A ficha nomeia qual? O personagem usa
   a maior das duas? A secundária é uma Especialidade de Atletismo com outro nome? Isso se repete
   em Escalar, Nadar, Equilibrar-se, Acrobacia, Roubar, Arrombar, Disfarçar e mais uma dúzia.
2. ~~A âncora "Difícil" tem dois valores no projeto.~~ **Resolvido em 2026-08-09, e era pior do
   que parecia:** o `regras.json` divergia do capítulo em **três** linhas (soma 8 contra 9, 10
   contra 12, 12 contra 15) e ainda trocava os nomes dos degraus. O capítulo estava certo, porque
   os somas dele seguem a régua ×5/3 e conferem na probabilidade. O `regras.json` foi corrigido.

---

## 6. Fichas

### 6.1 Escalar

> **Números de partida, não fechados.** Esta é a primeira ficha escrita no gabarito e serve de
> modelo para as outras. A descrição da ação está em `Acoes_Texto.md`, família Corpo e movimento.

**Modo** · Acumulada com pressa, Longa com calma. O par de números é o mesmo nos dois.

**Jogada** · Força + Atletismo.

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

### 6.2 Arremessar um objeto

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

## 7. Pendências deste documento

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
5. **[DECIDIR]** Trocar a palavra "stunt" em Relações Sociais por um termo em português.
4. ~~**[FAZER]** O gabarito de ficha.~~ **Escrito em 2026-08-09** (§5), com **Escalar** (§6.1)
   como ficha-modelo. Junto saiu a régua de calibragem da §5.3, que corrige um erro real: as
   âncoras de Dificuldade não servem para Acumulada e Longa sem serem rebaixadas a ~2/3 da média.
5. **[DECIDIR]** As duas coisas da §5.4 que toda ficha vai esbarrar: **perícia secundária ou
   Especialidade** (Escalada contra Atletismo, Natação contra Atletismo, e mais uma dúzia), e a
   **âncora "Difícil" com dois valores** no projeto (8 em `regras.json`, 9 no capítulo e na Área
   do Mestre).
6. **[FAZER]** Preencher as fichas na ordem: **Queda**, **Veneno**, **Ambiente**,
   **Esgueirar-se**, **Construir/forjar**. São as mais pedidas em mesa e as que hoje o mestre
   inventa do zero toda vez. Escalar já saiu como modelo do gabarito.
4. **[FAZER]** Decidir se isto vira **um** capítulo ou se cada família entra no capítulo que já
   existe (movimento em Combate, resistir em Vida & Ferimentos, social em Relações). A aposta
   atual é capítulo único, porque a régua comum da §3 precisa de um lugar só.
5. **[FAZER]** Quando fechar, virar `src/content/chapters/acoes-e-sistema.md` e provavelmente
   `regras.json → acoes` para as tabelas que o motor precisar ler.
