# PLANO · o projeto inteiro e a autoridade para conduzi-lo

Este documento existe para o Arquiteto não parar a cada passo. Ele contém as fases, o que
já foi feito, o que falta, quem decide o quê, e as decisões já tomadas que devem ser
aplicadas sem perguntar de novo.

O método (como decidir, como planejar, os erros catalogados, as perguntas que rendem) está
no `ARQUITETO.md`. O estado corrente está no `CONTEXTO.md`, os números no `ESTADO.md`, as
formas de defeito no `CATALOGO.md`, e os itens abertos no `Pendencias.md`. Este documento
aponta para eles e não os repete.

---

## 1 · O objetivo

Transformar o Grid numa experiência completa de batalha. Não é medir, é construir.

A frente de medição já encerrou e respondeu o que a abriu: metade do trabalho do mestre é
aritmética que sai com automação, um terço é o clique do relógio, um sexto é julgamento, e
o teto do que os consertos desenhados tiram é 76,7%. Nenhuma medição nova move a fila.

O progresso agora se mede em consertos na mesa, não em rodadas de análise.

**A série do `L52` (abertos/fechados/parciais do `Pendencias.md`) se remede no reset da semana
(quinta, 18h) e no fechamento de cada fase.** Primeira medida: 08/09/2026, 120 abertos · 63
fechados · 4 parciais · 187 no total (`Pendencias.md` `L52`). Série sem data marcada morre na
primeira medida, e é a única coisa que diz se o congelamento de descobrimento (`ARQUITETO.md`
§3.2) está funcionando ou se a fila só parou de ser contada.

---

## 2 · As fases

### FASE 0 · A base · FEITA · ~8%

Consertar o que impedia qualquer trabalho de ser confiável: portões configurados que nunca
rodavam, fim de linha quebrando o teste em máquina nova, e dois defeitos que já estavam na
mesa.

O que ela deixou como herança permanente: nenhum portão vale enquanto não se souber quando
ele passou pela última vez, e toda tolerância escrita ("por enquanto", "há erros antigos")
vem com a condição de expiração ao lado.

### FASE 1 · O inventário · FEITA · ~5%

Levantar, sem escrever código, o que o sistema permite e o que a tela deixa fazer. Duas
auditorias: cobertura (o que existe na régua e não na tela) e editabilidade (que número o
mestre consegue sobrepor).

O resultado que reformulou a queixa: o mestre já corrige número, a ficha do lance abre 21
campos dos dois lados. O que falta é agir fora da régua do ataque, e sair da tela para pôr
condição.

E a tripartição que ela produziu vale para qualquer levantamento futuro: uma coisa pode
faltar como mecanismo sem tela (o motor sabe, ninguém alcança), como meia tela (existe a
metade que não muda nada), ou como tela no lugar errado (existe, noutra aba, exigindo
troca de contexto no meio do Tick).

### FASE 2 · A liberdade · CINCO DE SEIS · ~20%

Dar ao mestre as ações que o sistema tem e a tela não oferecia.

1. condição no tabuleiro · FEITO
2. agir fora de hora · FEITO
3. dívida de Ticks · FEITO
4. mudar efeito posto · FEITO
5. Investida · FEITO (era motor ausente, não tela)
6. Interpor e desviar · EM CONSTRUÇÃO

O Interpor era o único que exigia regra nova, porque o capítulo publicado não tem uma linha
sobre interpor, desviar nem abortar. As seis respostas estão decididas e registradas no
`L34 §6`. Quando ele entrar, a fase 2 fecha.

### FASE 2.5 · A vista do jogador · NÃO COMEÇADA · ~15%

Tudo o que foi medido até aqui é sobre o mestre. Esta fase é sobre o jogador, e ela existe
porque três dos quatro achados sérios de uma semana estavam do lado dele:

- o relógio do jogador rodou parado no Tick 0 desde a migração 14, num sistema cujo nome é
  tempo real;
- a névoa entregava ao navegador dele coisa que a tela dele escondia, em quatro lugares;
- e a tela que desenha a lembrança do inimigo já visto nunca foi construída, o que é o que
  trava a migração 33.

O instrumento principal desta fase são três medições, e não duas: o que a tela desenha, o
que chega ao navegador, e o payload conferido contra o esquema real e não contra o mock. A
divergência entre bancada e produção sempre pendeu para o mesmo lado, o do jogador ganhando
o que o esquema não dá.

### FASE 3 · Tirar trabalho do mestre · QUASE INTEIRA · ~25%

A maior em valor medido. Entregou os dois maiores itens:

- **o avanço unificado**: o relógio corre até uma parada real em vez de um Tick por clique,
  e abre a folha do golpe que o fez parar. Quatro paradas (alguém consultado, golpe vencido,
  efeito que morde, cena assentada), com teto de segurança que avisa quando acende;
- **a folha aceitando as faces do dado** em vez do total somado, com o dano ganhando o
  mesmo registro auditável que o acerto já tinha.

O que sobra dela: o clique que abre o cartão do golpe, cuja medição mostrou que o avanço
unificado já o absorve; e o botão do veredito, cujo mecanismo existe desde agosto e cujo
item aberto é a MEDIÇÃO da taxa em que a mesa contraria a régua, não código.

### FASE 4 · O terreno · NÃO COMEÇADA · ~20%

Obstáculos, custo de travessia por tipo de chão, rota contornando parede, perseguição e
fuga com o mapa importando.

É a mais arriscada do plano por um motivo específico: o custo de travessia alimenta a
re-projeção da agenda, que é o coração do Simultâneo. Toda mudança aqui exige o espelho
rodando de novo, e o espelho tem um limite conhecido (ele compara o harness contra um mock
que chama as mesmas funções do harness, então ele mede assimetria e não fidelidade).

### FASE 5 · O jogo parecer jogo · NÃO COMEÇADA · ~7%

Medir e consertar a experiência do jogador: quantos Ticks ele passa sem nada a decidir,
quanto espera entre declarar e ver o efeito, quantas ações ele consegue enxergar em cada
instante.

Hoje o repertório declarável do jogador é onze opções, com as 461 Técnicas fora do Grid. A
frase "videogame com infinitas opções" é o objetivo declarado, e onze é o número de hoje.

---

## 3 · O que está fora das fases

Não conta como progresso e não entra em lote sem decisão do humano.

**A dívida de produto: as quinze bandeiras.** São regras publicadas que a mesa não joga.
Seis são ligação pura e nove são regra a escrever, das quais seis (`n1` a `n6`) são o núcleo
do Tick inteiro e nenhuma roda isolada. Três já foram avaliadas: `porte` e `gate` ligaram,
`teto6` não liga enquanto sentinela e magnitude dividirem o mesmo campo.

**A segunda bateria não acontece.** A grade de 112 células foi desenhada para comparar as
quinze regras, e as regras não existem no motor. Fica registrada como desenhada e não
executada, com o motivo escrito.

**Comandos por voz.** Registrada com sete decisões tomadas, sem uma linha construída. A
única parte ativa é a regra de que toda ação nova nasce recebendo um objeto com o que
precisa, em vez de sair de um clique lendo a tela.

---

## 4 · A autoridade

### 4.1 · O Arquiteto decide, sem perguntar

- sequência, prioridade, e o que espera;
- o que é conserto e o que é registro;
- para qual instância vai cada trabalho;
- a forma dos instrumentos: portões, asserções, esquema de log, o que se mede e como;
- ordem de execução dentro de um item já aprovado;
- e o que fazer com cada achado da revisora, inclusive recusar, desde que escreva o motivo.

### 4.2 · O Arquiteto para e escala

Quatro coisas, e só quatro:

**Regra de jogo.** O que a régua diz, o que uma manobra custa, como uma situação se resolve
na ficção, o que o jogador vê ou deixa de ver. Aplicar regra que já está escrita é
engenharia; escrever o que a regra diz, ou escolher entre duas leituras dela, é escalada.

**Dinheiro e token.** Teto de custo, quantas baterias, quanto vale continuar.

**O que vai para produção.** Migração rodada, deploy, e principalmente qualquer coisa que
grave dado de mesa de gente real.

**Se uma frente continua ou encerra.** Nenhuma instância dentro do laço é boa juíza disso,
porque todas têm interesse no laço continuar.

Na dúvida entre engenharia e regra, é regra. O custo é assimétrico: escalar demais custa
uma espera, escalar de menos custa o jogo virar consequência de um script.

### 4.3 · A exceção que sempre vale

Vazamento de informação ou perda de dado em produção sai de qualquer congelamento, de
qualquer fila, e de qualquer lote. Para tudo, conserta, e avisa. Isso já aconteceu cinco
vezes e nas cinco estava na mesa em que se joga.

---

## 5 · Decisões já tomadas, para aplicar sem perguntar de novo

Estas foram decididas pelo humano e não se reabrem. Se a executora ou a revisora
perguntarem, a resposta está aqui.

### 5.1 · Regras do combate

**Interpor** (`L34 §6`), as seis respostas:
1. o dano já rolado passa inteiro para o interpositor, com a Absorção DELE e não a do alvo
   original. Recomparar contra a Defesa do interpositor foi recusado: seria regra nova
   disfarçada de reúso, porque reusar código não é reusar regra;
2. nenhum teste dedicado. O precedente decide: Avançar e Levantar-se estão no mesmo
   catálogo e nenhuma tem teste. O preço já existe em Ticks e em levar o golpe;
3. alcance com geometria de reta para o ataque à distância. "Dentro do alcance" sozinho
   deixaria qualquer peça no raio do arqueiro interpor, inclusive atrás dele, e interposição
   é gesto declarado: a primeira mesa que descobrir joga assim para sempre. Corpo a corpo
   não muda, o alcance curto já colapsa em adjacência;
4. o escudo herda o estado do resto do combate (a bandeira `bloqueio` está desligada);
5. um golpe só, o que disparou. E a tela diz contra qual golpe vale, com o segundo golpe do
   mesmo Tick aparecendo como não coberto e não em silêncio;
6. os dois preços não eram escolha: Preparo e Recuperação são duas portas com preço próprio.

**Névoa** (`L32`), os cinco casos: a névoa esconde a EXISTÊNCIA da criatura, e a aba Combate
acompanha. A casa some junto com o nome. Golpe do escuro dá comparação de Furtividade contra
Percepção Passiva, pela fórmula já escrita, e quem percebe lê um aviso sem quem e sem de
onde. O corte só morde com arena ativa e névoa ligada, e peça sem token conta como escuro.
Inimigo já visto que recua fica listado, apagado, com a Vida e a casa da última vez, porque
apagar o registro do ferimento tira do jogador o resultado da própria ação, e isso não é
névoa, é amnésia.

**Bandeiras avaliadas:** `porte` liga (completa a compensação que a Couraça já fazia pela
metade). `gate` liga (a régua cita a adaga pelo nome). `teto6` não liga: dois valores já
furam ±6 sozinhos, e um deles é sentinela e não magnitude, então clamp ingênuo vira
regressão funcional. O conserto que precede o teto é separar sentinela de valor.

**Mexer em Arte posta:** dois preços e não três. Corrigir o registro é de graça porque não é
ficção, é a mesa arrumando o que ela mesma escreveu; mudar o que a ficção fez custa
reconjurar. Um terceiro preço no meio seria regra nova.

**Criaturas:** Furtividade por porte e categoria, na forma que a couraça já usa. Escrever 309
Furtividades à mão produziria números que parecem dado e não são.

**Refazer o log:** não apaga linha de Arte do jogador. Ação dele não é escrituração do motor.

### 5.2 · Regras de construção

**Toda ação nova nasce recebendo um objeto** com o que precisa, em vez de sair de um clique
lendo a tela. Bandeira que ESTENDE ação existente não é ação nova.

**Toda conta que sair da mão do mestre continua visível** depois do fato, e não só o
resultado. Três defeitos desta frente viveram anos porque a tela mostrava o resultado e não
a conta.

**O dado continua sendo rolado na mão.** Automatizar a rolagem é opção; o padrão é jogar os
dados. O que sai é somar e transcrever.

**Instrumento novo passa pelo `CATALOGO` antes de ser construído.** Duas vezes o instrumento
feito para prevenir uma família reproduziu a família.

### 5.3 · Método de medição

**Δ-alvo do E5:** um gesto por batalha, `n ≈ 2.527` por célula. O mestre sente batalha, não
Tick.

**Migração 34:** adiada, com gatilho escrito (sinal real de perda em mesa, ou gesto que a
mitigação não cobre).

**Modo site:** é conversa do humano com a mesa, sem número, e não bloqueia nada.

---

## 6 · Como responder quando perguntam

Estas são as perguntas que a executora e a revisora fazem, e a resposta que este projeto já
deu. Use-as como precedente antes de escalar.

**"Achei outra coisa no caminho, conserto?"**
Vazamento ou perda de dado em produção: sim, para tudo. Qualquer outra coisa: uma linha no
`Pendencias` e segue. Achado real não basta para virar trabalho, senão a fase nunca anda.

**"Isto é ligação ou é regra a escrever?"**
Montar o mecanismo é engenharia. Decidir o que fica ligado é escalada. Se a régua já tem
texto para o caso, aplicar é engenharia; se cabem duas leituras, é regra.

**"O teste passa, posso publicar?"**
Depende de o que ele prova. Asserção negativa sozinha passa quando o cenário não foi montado.
Toda "não acontece" vem com a gêmea "e acontece quando deveria". E o ensaio dos três sentidos
antes de qualquer portão contar como portão.

**"O portão está verde."**
Verde por não achar não é verde. Controle positivo prova que ele está olhando para o lugar
certo; o ensaio prova que ele sabe reprovar. São coisas diferentes.

**"O smoke não roda na minha máquina."**
Ramo descartável e o CI julga. Nunca commitar em `main` confiando em leitura manual.

**"Preciso de um número que não existe na régua."**
Marca `⚑` e diz. Número inventado produz um jogo que não existe, e já produziu um duelo de
568 Ticks.

**"Esta bandeira muda o dano em produção?"**
Mede antes: quanto, em que direção, e contra quais alvos. Se mudar balanço, é escalada. Se
não mudar, liga com o número escrito ao lado.

**"Encontrei duas fontes que discordam."**
A pergunta não é quantas dizem o quê, é quem copiou de quem, e quem CONSOME cada uma. Fonte
com ecos conserta-se na fonte; caminhos independentes que concordam não podem ser cortados
sem tirar quem os usa.

**"Posso reusar a função X que faz quase isso?"**
Reusar código não é reusar regra. Se a função responde uma pergunta parecida e não a mesma,
reusar é a fachada que preserva a forma e troca o destino.

**"Este teto é o limite do que dá para fazer?"**
Nenhum teto é natural. Ele é o alcance dos consertos desenhados até hoje, e essa frase vai
escrita ao lado dele.

---

## 7 · O ciclo autônomo

Quatro lotes, US$ 5, conferido por chamada e não por rodada.

Para em quatro condições: teto de lotes, teto de custo, escopo (três lotes seguidos sem
nenhum item de fase entrando na mesa), e desacordo (duas voltas sobre o mesmo ponto sem
convergir).

O resumo, que é a única coisa que o humano vai ler: motivo da parada, o que entrou na mesa
com uma linha por item, **o que a revisora achou e o que foi feito com cada achado**
(obrigatório, inclusive os recusados e por quê), o que precisa do humano com opções e custo,
o que ficou aberto, e o custo real.

As decisões tomadas dentro do ciclo vão para o `CONTEXTO` como `D`, com motivo e custo.

---

## 8 · A ordem da fila

1. **Interpor** · fechar a fase 2. Decidido, em construção.
2. **grid.condicao** · a conferência do `:1808` ANTES do split, porque com o split os 9
   Efeitos passam a cair no portão de entrada e pular o laço inteiro, e isso é mudança de
   comportamento escondida numa refatoração de campo.
3. **O que sobra da fase 3** · o botão do veredito, cujo item é medição e não código.
4. **Fase 2.5 ou fase 4** · decisão do humano, e ela não se toma sem os dois primeiros
   fechados.

Enquanto isso, e sem entrar em lote: a conversa do modo site é do humano, e a fase 2.5 e a 4
não começam sem ele dizer.

---

## 9 · A coisa que falta e não é código

Nada disso passou por uma mesa de verdade. Os defeitos que mais doeram (a névoa vazando
peças, o relógio do jogador parado, a Arte resolvendo no instante errado) teriam aparecido em
vinte minutos de jogo, e nenhum apareceu porque ninguém jogou.

Quando houver uma sessão real, a lista do que incomodou vale mais que a próxima rodada de
qualquer instância, e ela vira a fila seguinte.
