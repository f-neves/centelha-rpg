---
ordem: 1
numeral: "I"
titulo: "O Coração do Sistema"
resumo: "Rolagens, dificuldade e margem: a soma simples que move tudo."
---

Neste jogo você interpreta um herói num mundo conduzido pelo **Mestre**. Na maior parte do tempo é só conversa: você diz o que seu personagem faz, o Mestre descreve o que acontece. Os dados só entram quando o resultado é **incerto e importa**: então o Mestre define o quão difícil é a tarefa (a **Dificuldade**), você junta os dados certos e rola. Este capítulo ensina exatamente isso: como uma rolagem funciona.

Toda ação significativa nasce de uma soma simples: um **Atributo** (capacidades inerentes do personagem) somado a uma **Habilidade** (conhecimentos adquiridos ao longo da vida). Esse total vira um punhado de dados de seis lados (o seu *pool*) que você rola para enfrentar o mundo.

## Montando o Pool

O *pool* básico é determinado pela soma de Atributo + Habilidade. A metade desse valor (arredondada para baixo) é a **quantidade de dados**. Se a soma for **ímpar**, some um **bônus fixo de +2** ao resultado.

<p class="formula">Dados = (Atributo + Habilidade) ÷ 2, arredondado para baixo<br>Se a soma for ÍMPAR: +2 somado ao RESULTADO da rolagem, não é um dado a mais</p>

| Soma (Atrib + Hab) | Você rola |
|:---:|:---:|
| 0 | nada: total fixo **0** |
| 1 | nenhum dado, total fixo **2** |
| 2 | 1d6 |
| 3 | 1d6 + 2 |
| 4 | 2d6 |
| 5 | 2d6 + 2 |
| 6 | 3d6 |
| 7 | 3d6 + 2 |
| 8 | 4d6 |
| 9 | 4d6 + 2 |
| 10 | 5d6 |
| 11 | 5d6 + 2 |
| 12 | 6d6 |

<p class="muted">A tabela para em 12 porque é onde o mortal comum termina, mas a régua não tem teto: soma 14 rola 7d6, soma 16 rola 8d6, e assim por diante, na mesma proporção (Centelha, Proezas e Artes é que levam gente até lá).</p>

<p class="muted">Soma **1** (Atributo 1 e Habilidade não treinada, o caso mais comum de personagem recém-criado) não rola dado nenhum: o total fixo de **2** nunca supera a Dificuldade **5**. É de propósito, não bug: quem não tem competência simplesmente não alcança as dificuldades altas, nem as fáceis. A saída não é mexer nesta fórmula (ela sustenta ataque, Defesa, perícia e o bestiário inteiro), é a **[Firula](/regras/habilidades#firulas--recompensa-à-ousadia) de nível 2** (+1d6), que devolve o dado e torna a Dificuldade 5 possível com 4 ou mais.</p>

### Quem escolhe o par

**A descrição da ação determina o Atributo e a Habilidade.** Você diz *como* o personagem está agindo; o Mestre lê a descrição e nomeia os dois. Duas coisas trabalham juntas aqui, e vale separá-las:

- **cada Habilidade tem uma inclinação**, um grupo de Atributos com que ela mais se relaciona, e é essa inclinação que o parêntese de cada Habilidade publica no [capítulo das Habilidades](/regras/habilidades). Briga puxa os físicos, Burocracia puxa os mentais, Oratória puxa os sociais;
- **e a combinação concreta de uma jogada sai da descrição**, que pode pedir um Atributo fora da inclinação quando a ficção o sustentar.

A mesma intenção muda de par quando muda o *como*:

| a intenção | o que o jogador descreveu | o par |
|---|---|---|
| ferir o inimigo | um soco | **Força** ou **Destreza** + Briga |
| ferir o inimigo | um golpe de espada | **Força** ou **Destreza** + Armas |
| fazer o inimigo se render | convencer | **Influência** + Persuasão |
| fazer o inimigo se render | ameaçar | **Força** ou **Influência** + Intimidação |
| ler o oponente | identificar o estilo de luta dele | **Inteligência** + Briga, ou + Armas |

Repare em dois. A **ameaça** troca de Habilidade *e* de Atributo em relação a convencer, e a intenção das duas era a mesma: quem separou foi a descrição. E **identificar o estilo de luta** rola *Inteligência + Briga*, embora a inclinação de Briga seja física, porque o que está sendo feito ali é ler e deduzir, não bater.

**Os Atributos também vêm em três grupos:** Força, Destreza e Vigor são físicos; Influência, Perspicácia e Compostura, sociais; Percepção, Inteligência e Raciocínio, mentais. Serve para saber por onde começar a pensar, e é a mesma natureza da inclinação das Habilidades.

<p class="muted">Quem julga a descrição é o Mestre, e um par que a ficção não sustenta ele recusa. O que a regra pede é o contrário: não recusar um par que a descrição sustenta só porque ele está fora da inclinação publicada.</p>

## Sucesso e Dificuldade

Você tem **sucesso** quando o total **supera** o alvo: a Defesa de um inimigo ou a **Dificuldade** de uma tarefa. A Dificuldade usa a mesma régua de Atributo + Habilidade: o número reflete o quão excepcional precisa ser quem a encara.

| Dificuldade | Desafio | Atrib + Hab à altura | Nível |
|:---:|---|---|---|
| 5 | Fácil | 3| Iniciante |
| 10 | Média | 6 | Competente |
| 15 | Difícil | 9 | Perito |
| 20 | Limite humano | 12 | Mestre |
| 25 | Excepcional | 15 |  Herói |
| 30+ | Sobre-humano | 18 | Semideus|

<p class="muted">No nível "à altura", tarefas fáceis e médias são um cara-ou-coroa; a maestria traz confiabilidade. Quem não tem competência simplesmente não alcança as dificuldades altas.</p>

<div class="callout exemplo"><span class="lbl">Exemplo</span>Para escalar um muro liso (Dificuldade 10), Kael soma <strong>Força 3 + Atletismo 3 = 6</strong> → rola <strong>3d6</strong>. Saem <strong>11</strong> nos dados: supera 10, ele sobe. Se tivesse chegado a 16 (6 acima do alvo), ganharia uma <strong>Margem</strong>: subiria mais rápido, ou alcançaria um peitoril mais alto.</div>

## Margem: graus de sucesso

Passar raspando é diferente de passar com sobra. A cada **6 pontos** que seu total supera o alvo, você ganha **uma Margem**. Em combate, cada Margem vira **+1d6 de dano**; em outras ações, o Mestre converte a Margem num efeito melhor: mais rápido, mais fino, mais duradouro.

## Rolagens Opostas e Valores Passivos

Quando alguém se opõe a você, em geral apenas o lado *ativo* rola, contra um **Valor Passivo** do outro.

<p class="formula">Valor Passivo = (Atributo + Habilidade) × 2 + Especialidade + Centelha (+ modificadores)</p>

<p class="muted">A <strong>Especialidade</strong> vale **+1 por nível** aqui, num valor fixo; numa jogada com dado, ela rende **+1d6 por nível, descartando o menor** do pool. Só entra quando o escopo nomeado dela se aplica. A <strong>[Centelha](/regras/centelha)</strong> soma **+1 por ponto** dos dois lados de qualquer disputa.</p>

<div class="callout exemplo"><span class="lbl">Exemplo</span>Um ladrão se esgueira (rola Destreza + Furtividade) contra a <strong>Percepção Passiva</strong> do guarda, igual a (Percepção + Prontidão) × 2 + Especialidade + Centelha: para um guarda comum, sem as duas últimas, isso é só (Percepção + Prontidão) × 2. O guarda não rola: sua vigilância é um muro a ser superado.</div>

Quando os dois agem de fato (uma queda de braço, uma corrida), ambos rolam e o maior total vence; empates favorecem quem defende ou mantém o *status quo*.

| Soma (Atrib + Hab) | Def Passiva (×2) |
|:---:|:---:|
| 2 | 4 |
| 3 | 6 |
| 4 | 8 |
| 5 | 10 |
| 6 | 12 |
| 7 | 14 |
| 8 | 16 |
| 9 | 18 |
| 10 | 20 |

## Ações Acumuladas e Longas

Tarefas longas (forjar uma lâmina, decifrar um tomo) são os modos **Acumulada** e **Longa** de [Ações & Sistema](/regras/acoes-e-sistema), e usam três valores: uma **Dificuldade**, um **Intervalo** de tempo e um **Acúmulo** a atingir. A cada intervalo você rola; o quanto o total *passar* da Dificuldade soma ao Acúmulo. Ao alcançá-lo, a obra está pronta.

<div class="callout exemplo"><span class="lbl">Exemplo</span>Forjar uma espada fina: Dificuldade 12, intervalo semanal, Acúmulo 30. A cada semana o ferreiro rola e soma o excedente sobre 12: chegando a 30, a lâmina nasce.</div>
