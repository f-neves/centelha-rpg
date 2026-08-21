# O Grid como copiloto

Aberto em **2026-08-21**, a partir de uma pergunta da mesa: *como fazer o mestre interagir pouco
com o Grid e apenas escolher as ações?*

Este documento não é uma lista de coisas que faltam (essa é o `Grid_melhorias.md`). É um
**princípio de desenho** que reordena aquela lista, mais o que ele obriga a mudar. A diferença
importa: quase tudo aqui já está calculado em algum lugar do código, e o que falta não é conta, é
**quem toma a iniciativa**.

---

## 1. A conta de hoje

**Um ataque, do menu ao dano, custa seis toques e um número digitado:**

| # | O toque | O que o mestre decide ali |
|---|---|---|
| 1 | botão direito na peça | nada, é só abrir o menu |
| 2 | ⚔ Ataque | a intenção (**esta é a escolha**) |
| 3 | clique no alvo | o alvo (**esta é a escolha**) |
| 4 | manobra, quando não é um golpe só | a manobra (**escolha, e só às vezes**) |
| 5 | Acertou / Errou | nada: ele está **transcrevendo** o dado que rolou na mesa |
| 6 | digitar o dano rolado | nada: transcrevendo de novo |
| 7 | Aplicar o dano | nada, é confirmar |

Das sete, **três são escolhas** e quatro são datilografia. Numa refrega de oito peças e quatro
rodadas são ~32 ações declaradas: perto de **200 toques e 32 números digitados**, sem contar mover,
curar, pôr condição, adiantar o relógio e abrir card.

### O que o Grid já sabe e pergunta assim mesmo

| O que ele pergunta | Onde a resposta já está |
|---|---|
| o modo do dano (Impacto / Corte / Perfuração) | na string de dano do resumo: `1d6 +2 (C)` |
| quanto foi o dano | `RESUMO[id].dano` tem os dados, e `rolarExpr` já rola expressões assim |
| se acertou | `RESUMO[id].ataque` de um lado, `defesaAtual` com a escada do outro |
| quantos Ticks a ação custa | a régua P/G/R sabe pela classe da arma (`classeDeTempo`) |
| a Absorção | já é descontada na hora, e mostrada ao vivo na caixa de dano |

O `rolarExpr` do rastreador (`4d6 +2` → dados, fixo, total) **não existe no Grid**: é a mesma conta
escrita numa página só. Tirá-lo para uma lib é o pré-requisito barato de metade do que vem abaixo.

### E o que só o Grid sabe, e ele não usa

**A distância.** Ninguém mais na mesa sabe quantos metros separam duas peças, e nenhum modificador
do sistema usa esse número hoje. Alcance de arma, alcance de arremesso, "está longe demais para o
punhal", o passo que a Recuperação paga: tudo isso está a uma subtração de hexágonos, e é
perguntado ao mestre ou simplesmente esquecido.

---

## 2. O princípio, em três frases e um limite

1. **Nunca perguntar o que dá para calcular.**
2. **Todo número calculado é um campo editável, com a conta à vista.**
3. **A mesa escolhe a intenção; o Grid faz a conta.**

E o limite, que é o que impede isso de virar um jogo eletrônico:

> **Nada acontece sem deixar rastro no registro, e nada acontece que o mestre não possa desfazer
> nem sobrescrever.** A automação existe para tirar a datilografia da frente, não para tirar a
> decisão da mão de quem está mestrando.

---

## 3. As emendas, na ordem do proveito

> Escritas antes de qualquer código, no tempo verbal de quem ainda vai fazer. **Sete das oito
> entraram no mesmo dia**, e o que cada uma virou está na §7. O texto abaixo fica como estava
> porque é ele que guarda o PORQUÊ, e o porquê não muda quando a coisa fica pronta.

### A · O gesto único: arrastar do atacante ao alvo

Hoje atacar são três toques antes de qualquer decisão (menu, item, alvo). O tabuleiro já sabe
desenhar a seta de uma peça a outra (`caminhoSeta`, usada na mira), e arrastar já significa "mover".
**Arrastar de uma peça para cima de outra passa a significar "ataca essa"**, e o menu continua
existindo para o resto.

Custo: pequeno. Ganho: dois toques por ação, e o gesto passa a ser o mesmo que a mão já faz.

### B · A folha da ação: uma caixa só, do acerto ao dano

Hoje são duas caixas em sequência (alvo, depois dano) e a segunda não sabe nada da primeira: ela
abre com **zero** no campo e **Impacto** no modo, mesmo quando a arma de quem bateu é cortante.

Uma caixa só, que abre já sabendo arma, distância, alcance, Defesa com a escada e o custo em Ticks,
e que resolve tudo num confirmar. Cada número aparece **pré-preenchido e editável**, com a conta
escrita ao lado em uma linha (`Defesa 9 = 7 base −2 pressão`).

Custo: médio, e é a emenda central. As três primeiras coisas dela são de uma tarde:
o modo do dano vindo da arma, o dano rolado pré-preenchido, e o "Errou" fechando tudo sem abrir a
segunda caixa.

### C · Quem rola os dados: uma escolha da mesa, como o P/G/R

Três modos, no mesmo painel ⏱ que já escolhe o sistema de tempo:

- **na mesa** (hoje): o Grid mostra o bolo, a pessoa rola de verdade e transcreve;
- **no site**: o Grid rola e mostra os dados um a um;
- **misto**: os jogadores rolam os deles na mesa, as criaturas do mestre rolam sozinhas.

O misto é o que resolve o problema desta conversa sem tirar o dado da mão de ninguém: **metade das
transcrições da sessão é do mestre rolando pelos monstros dele**.

Custo: pequeno (o rolador existe), mais a decisão de mesa.

### D · O relógio anda sozinho

O ataque e a Arte já empurram o relógio pela régua. Falta o **deslocamento**, que é K20: 2 Ticks por
metro na Recuperação, 1 por metro no abortar. O Grid mede a distância do arrasto, então mover uma
peça já pode cobrar o próprio tempo, e o campo "a ação custa 5t" volta a ser o que ele deveria ser:
o caso estranho, e não o caminho comum.

Com isso, o botão **⏭ próximo** deixa de ser um clique por ação: **resolver a ação É o avanço**.

Custo: médio (pede uma função `jogador_*` nova, como o ataque pediu).

### E · A régua do tabuleiro entra na conta

Com a distância na mão, três coisas ficam automáticas e uma fica possível:

- **alcance da arma**: mirar acende o alcance real de quem ataca (`equip.ts` já sabe);
- **fora de alcance**: a caixa avisa antes, em vez de deixar o punhal acertar a dez metros;
- **arremesso**: as faixas de distância entram como modificador em vez de conta de cabeça;
- **cobertura e linha de visão**: possível, mas depende de existirem paredes no mapa, que não
  existem. Fica fora desta rodada.

### F · A saída de improviso, sempre a um toque

Este é o outro lado do pedido, e o mais importante deles: **o que o Grid não abarca não pode ficar
mais caro do que o que ele abarca.**

Uma entrada única, **"outra coisa"**, disponível o tempo todo (tecla e item de menu):

- escolhe quem;
- escreve o que é, em uma linha, na língua da mesa;
- o custo em Ticks vem pré-preenchido com a média e é editável;
- um campo de modificador solto (`+2`, `−1d6`) **com motivo obrigatório**;
- entra no registro com o motivo junto.

O motivo obrigatório não é burocracia: é o que faz o registro continuar contando a história certa
quando a mesa inventou uma regra no meio da luta.

### G · O modo TV

Se a segunda tela é a que os jogadores olham, ela não devia mostrar a mobília do mestre. Um modo que
deixa só o tabuleiro e a tira da ordem: sem barra de arena, sem "Em campo", sem registro, com os
números subindo das peças e o alvo do golpe acendendo.

A tela cheia (`⛶`) já é meio caminho. Falta ela ser um **modo**, e não um botão.

### H · Atalhos, para a mão não sair do lugar

Hoje há **Espaço** (encerra a vez), **F** (tela cheia) e **Esc**. Faltam: número seleciona a peça na
tira, `A` ataca, `M` move, `Z` desfaz. Custo pequeno, e é o que transforma a sequência
"escolher, resolver, próximo" em três teclas.

---

## 4. O contrato do improviso

A pergunta da mesa foi "e quando o jogador faz algo que o sistema não abarca?". A resposta tem de
ser de desenho, e não de boa vontade. **Três degraus, sempre disponíveis:**

1. **Digitar por cima.** Todo número calculado é um campo. O Grid propõe 9 de Defesa; o mestre
   escreve 7 e segue. O registro guarda o que foi usado, não o que foi proposto.
2. **O modificador avulso, com motivo.** Um `+2 · "atacando de cima do barril"` que entra na
   rolagem e no registro. Vale para acerto, dano, Defesa e Ticks.
3. **Resolver na mão.** A ação "outra coisa" da emenda F: nem acerto, nem dano, só um custo em Ticks
   e uma frase. É a válvula, e ela precisa ser tão rápida quanto um ataque comum, ou o mestre vai
   preferir mentir para o Grid a usá-la.

O que **não** pode acontecer: o Grid recusar. Ele avisa ("fora de alcance", "sem Mana"), e deixa
passar quando o mestre insiste.

---

## 5. O que fica manual de propósito

- **Narrar.** Óbvio, mas vale escrever: nenhuma automação deve produzir texto de cena.
- **Decidir se cabe.** A dificuldade de uma ação inventada é do mestre. O Grid oferece a âncora da
  tabela e cala.
- **A iniciativa inicial.** O ⚄ rola todas de uma vez, e isso basta.
- **O dano dos jogadores.** Mesmo no modo "no site", o golpe do jogador é dele. O misto da emenda C
  existe justamente para não tirar isso.

---

## 6. Ordem sugerida

| Ordem | O quê | Custo | Estado |
|---|---|---|---|
| 1 | `rolarExpr` numa lib, modo do dano vindo da arma, dano pré-rolado | P | **feito** em 21/08 |
| 2 | A folha da ação (caixa única) | M | **feito** em 21/08 |
| 3 | O arrasto que ataca | P | **feito** em 21/08 |
| 4 | Modo de rolagem por mesa (na mesa / no site / misto) | P | **feito** em 21/08, padrão `mesa` |
| 5 | Deslocamento pago em Ticks (K20) | M | **feito** em 21/08, só na Recuperação |
| 6 | Alcance e distância na conta | M | **feito** em 21/08: mostra a faixa e o preço, não aplica |
| 7 | Atalhos de teclado | P | **feito** em 21/08 (A · O · T · 1-9 · Z, com Espaço e F que já havia) |
| 8 | Modo TV | P | **feito** em 21/08 |
| 9 | A ação "outra coisa" (emenda F) | P | **feito** em 21/08 |

---

## 7. O que entrou em 21/08

**As oito emendas**, no mesmo dia da conversa que abriu este documento. Sobrou uma decisão de
regra (a distância virar modificador), e nenhuma tarefa.

**A folha da ação.** Uma caixa só, do acerto ao dano. Abre sabendo a Defesa com a escada, o bolo de
dados de quem ataca (já com o ferimento e as condições **dele**, mais a penalidade da manobra), o
modo do dano lido da arma, o custo em Ticks e a Absorção do alvo descontada ao vivo. O botão que a
conta indica vira o principal, então o caminho comum é **um clique**. Sumiu a segunda caixa.

**O ajuste avulso, com motivo.** Um campo de número e um de texto na própria folha. O número entra
no acerto; o motivo vai para o registro junto do resultado, e é o que faz a linha continuar
contando a história certa uma semana depois.

**Quem rola os dados.** Três modos no painel ⏱, ao lado do sistema de tempo: `mesa` (o padrão:
ninguém rola no site), `misto` (as criaturas e NPCs do mestre rolam sozinhas) e `site`. O modo
decide só **o que acontece sozinho**; o botão "rolar" continua na caixa para o caso avulso, mesmo
na mesa que rola tudo na mão.

**O arrasto que ataca.** Soltar uma peça em cima de outra abre a folha. O gesto não fazia nada
antes: a casa ocupada recusa o movimento, então o mestre arrastava, a peça voltava, e ele ia pelo
menu de qualquer jeito.

**Os atalhos.** `A` ataca com quem age, `1`–`9` abrem o menu da enésima peça da fila (no lugar
dela, e não no canto da tela), `Z` desfaz. Nenhum deles inventa ação: todos abrem a mesma caixa que
o mouse abriria, e por isso não há atalho para "acertou" nem para aplicar dano.

**O deslocamento pago.** Andar durante a Recuperação custa 2 Ticks por metro, e o Grid é o único
que sabe quantos metros foram: cobra sozinho, o número sobe da peça e a linha entra no registro.
Não cobra de quem está livre, porque **a regra não decidiu esse caso**, e inventar um preço aqui
seria escrever regra na tela. No Preparo o que existe é o abortar, que tem preço próprio.

**O alcance.** A folha diz em que faixa o alvo está e o que ela custa: as **quatro faixas de −3**
do `Arremesso.md`, que são quartos do que SOBRA entre o alcance livre e o máximo (por isso a mesma
regra serve ao dardo, de vão minúsculo, e ao machado, que chega muito além de onde ainda acerta).
No corpo a corpo, um hexágono, dois na haste. A convenção subiu para o `regras.json`
(`combate.alcance`) e a fração do alcance livre virou campo do catálogo, que é o que a regra manda
a arma dizer.

**Mostra e não aplica**, e essa é a decisão: o Grid sabe a distância e diz o que ela custa, mas
quem põe o número final do ataque é quem está mestrando, conforme o que o jogador rolou. Vale
também para o **contrapé** da iniciativa (o −1d6 na primeira ação de quem entrou atrasado), que
aparece escrito na fila e no bolo da folha sem ser descontado. É o mesmo princípio do documento,
lido ao pé da letra: *todo número calculado é um campo à vista*, e nenhum deles decide sozinho.

Fica de fora o **arremesso**: o alcance máximo de uma adaga atirada sai da Força de Arremesso de
quem joga, e não da arma, e esse número ainda não chega ao Grid. Enquanto não chegar, a folha cala,
que é melhor do que mostrar uma faixa inventada.

**A ação "outra coisa".** A emenda F, que é a que fecha o contrato. Item no menu da peça e tecla
`O`. Escolhe quem, escreve o que é, e a caixa cobra o tempo **com a mesma régua do resto** (a agenda
nasce, a fita desenha, a escada cobra a Defesa como cobraria de um ataque), rola o bolo que a mesa
digitar, compara com a Dificuldade se houver, e escreve no registro a frase que quem está mestrando
escolheu.

Três decisões dentro dela:

- **a frase é obrigatória.** Sem ela o registro guardaria "alguém gastou 5 Ticks", que uma semana
  depois não é história nenhuma. É o mesmo motivo do motivo obrigatório no ajuste avulso.
- **custo zero é ação livre**: não gasta a vez e não cria gesto para interromper. É a mesma regra da
  Arte de Velocidade 0, e dizê-la na caixa evita a pergunta "por que a fita não apareceu?".
- **resolve agora ou resolve no fim.** Duas formas, porque as ações de verdade têm as duas: beber a
  poção acontece e depois se paga; empurrar a estante telegrafa e dá para interromper. No motor é
  `anatomiaLivre`, e no sistema normal as duas colapsam numa só, como o resto.

**O modo TV.** A tela dos jogadores sem a mobília do mestre: somem a barra da mesa (nome e abas), a
barra da arena, a coluna lateral e o campo do custo; ficam **o tabuleiro e a ordem de combate**. Não
é tela cheia, e por isso é outro botão: tela cheia tira as bordas do navegador, o modo TV tira os
controles, e quem projeta quer os dois. Botão na barra, tecla `T`, `Esc`, e uma **porta de saída
flutuante**, porque um modo sem saída visível é uma armadilha. Fica no aparelho: quem tem a segunda
tela é uma pessoa, e a escolha dela não deve virar a tela de todo mundo.

**A conta nova do ataque comum:** arrastar até o alvo, conferir, um clique. **Dois toques e nenhum
número digitado** quando a mesa deixa o site rolar; dois toques e dois números quando ela rola na
mão, que era o pedido.

---

---

## Fontes internas

- `Grid_melhorias.md`: a lista de funcionalidades (esta aqui é a lista de **atritos**).
- `Combate_Tempo.md` §15: o que já entrou do relógio, e o que falta (§15.4).
- `Pendencias.md` seções I e K.
