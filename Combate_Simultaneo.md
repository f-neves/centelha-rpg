# O terceiro sistema: combate simultâneo, Tick a Tick

> **Estado.** Primeira fatia **IMPLEMENTADA em 2026-08-27** (§3.1), no `main`: terceira opção
> no painel do tempo, relógio Tick a Tick, deslocamento gradual no mapa, robô das criaturas.
> Aberto no mesmo dia, a partir de uma conversa que descreveu o mecanismo por exemplo (cinco
> personagens e três orcs, três Ticks narrados) em vez de por regra. Este documento organiza
> esse exemplo em seções, separa o que já é decisão do que ainda é pergunta, e mede a distância
> entre o que isto pede e o que o motor de `Combate_Tempo.md` já entrega.
>
> **Branch:** o rascunho nasceu na `combate-simultaneo`; a implementação acabou no `main`
> porque a árvore é compartilhada com a outra instância e a branch virou armadilha (a lição da
> §17 do `Golpe_Tardio.md`, reconfirmada na prática). A branch fica como registro do rascunho.

---

## 1. O que já existe e este modo reaproveita inteiro

O sistema `P/G/R` (`Combate_Tempo.md` §14) já resolve praticamente toda a "física" do exemplo.
Nada disto é regra nova:

| Peça do exemplo | Onde já está decidido |
|---|---|
| Golpe pesado demora para sair, arma leve é quase instantânea | `P/G/R`, §14.1 (Preparo por classe de arma) |
| Deslocar antes de golpear, gastando Ticks nisso | Deslocamento de Batalha (grátis) e Corrida (paga Defesa), `Golpe_Tardio.md` §15 |
| Preparar o arco por vários Ticks antes de a flecha sair | Arco tem `R=0`, `P/G/R` §14.1; a flecha nasce no Tick do Golpe |
| Cancelar a ação no meio, pagando por isso | Abortar no Preparo, `Combate_Tempo.md` §14.6: perde os Ticks investidos, paga 1 Tick por metro pra sair andando |
| Golpe que sai no mesmo Tick de outro | "Os dois abertos", decisão 7 do `Golpe_Tardio.md` §9 (resolução simultânea) |
| Dois personagens que avançam um no outro se encontram antes do previsto | O "acompanhar" do `Golpe_Tardio.md` §10 a §13: quem se move também tem Deslocamento livre, e por isso o encontro acelera quando os dois andam |
| Golpe cuja preparação foi vista e pode ser interrompida | O botão de interromper, `Combate_Tempo.md` §14.7, e a dívida de Ticks (§4) que ele cobra de quem interrompe |
| Andar, Deslocamento de Combate ou Corrida, com penalidade automática | As quatro velocidades comparadas, `Golpe_Tardio.md` §14 e §15 |

O que falta, então, **não é uma quarta física de combate**. É um **motor de turnos diferente**
por cima da mesma física: hoje o relógio pula para o próximo evento e só quem está livre
declara; o modo novo pede um relógio que anda **um Tick por vez**, perguntando a
**todo mundo elegível a cada passo**, com posição sendo recalculada nesse mesmo ritmo.

---

## 2. O que a conversa já decidiu

Lido do exemplo (cinco jogadores, três orcs, três Ticks narrados) e organizado como regra:

1. **O Tick 0 é preparação da cena.** Ações de verdade começam a valer a partir do Tick 1;
   efeito de ação no Tick 0 fica para depois (não existe hoje, não é desta revisão).
2. **A cada Tick, todo combatente numa fase que já permite decidir, decide.** Isso é a régua
   que já existe (§14.6 do `Combate_Tempo.md`): quem está **livre** declara uma ação nova, quem
   está em **Preparo** pode abortar e trocar de plano (pagando o preço já escrito), quem está em
   **Golpe** não faz nada, quem está em **Recuperação** só paga por agir fora de hora. O que é
   novo é a **cadência da pergunta**: perguntar de novo a cada Tick, e não só quando o relógio
   pula até a vez de alguém.
3. **Avançar um Tick executa o que estava em curso.** Se era deslocamento em direção a um alvo,
   a posição anda; se o Golpe estava agendado para aquele Tick, ele sai.
4. **Dois personagens que avançam um no outro somam deslocamento.** Dois Ticks de aproximação
   viram um se os dois andarem ao encontro (o "acompanhar" do `Golpe_Tardio.md` §10, aplicado
   nos dois sentidos).
5. **Cancelar custa o que já está escrito.** Perder os Ticks investidos no Preparo, mais o preço
   por metro de quem se move fora da própria ação. Não é uma penalidade nova: é a régua do
   Preparo abortável aplicada tick a tick em vez de uma vez só.
6. **Todo deslocamento escolhe entre Andar, Deslocamento de Combate (batalha) ou Corrida**, com
   as penalidades de Defesa automáticas de cada um (0 · −4 · −4 com Investida, conforme
   `Golpe_Tardio.md` §15).

---

## 2.1. Quatro decisões novas (2026-08-27)

1. **Posição contínua, não dois pontos.** A distância vira trajetória simulada Tick a Tick: se
   os dois lados se aproximam, o encontro pode acontecer **antes** do Tick planejado. É o item
   mais caro do documento (§3, pergunta 1 original), e foi confirmado assim porque é exatamente o
   efeito que o exemplo original pedia. O Grid ainda não guarda trajetória em lugar nenhum hoje,
   só posição atual: isto é trabalho de motor novo, não ajuste.
2. **A pergunta é ativa a cada Tick**, para quem está livre ou em Preparo, e não um modelo de
   "persiste até algo mudar". Mais clique por cena que o `golpeAdiado` (que só acorda quando
   cabe), aceito conscientemente porque é o que dá a sensação de "todo mundo decidindo junto" que
   o exemplo descreve. Consequência direta: a UI precisa deixar essa pergunta **barata** de
   responder (um clique de "continuar" quando nada mudou), ou o custo de mesa vira proibitivo.
3. **A IA dos monstros tem os dois modos, e o mestre escolhe por monstro (ou por cena).** Um
   botão resolve manualmente ("eu decido"), outro liga um modo automático (heurística mínima:
   persegue o alvo mais perto/fraco, foge abaixo de X% de Vida) que o mestre pode desligar a
   qualquer momento para retomar o controle daquele monstro específico.
4. **Só digital, atrás de uma chave no `/mesa`.** Segue o precedente do `golpeAdiado`: nasce
   desligada, não tem versão de papel.

---

## 3. O que ainda não foi decidido

Cinco perguntas restantes, em ordem de quanto bloqueiam a implementação.

1. **["Ação fora de hora" ainda faz sentido aqui?]** A dívida de Ticks (`Combate_Tempo.md` §4)
   existe para cobrar quem age **fora da própria vez**. Neste modo não existe mais "vez": todo
   mundo é perguntado a cada Tick, dentro do que a fase permite. A régua de abortar no Preparo
   substitui parte disso, mas a ação fora de hora clássica (interromper, se interpor, levantar do
   chão) foi pensada para um mundo com vez e sem vez. Precisa decidir se ela sobrevive como está,
   se vira redundante, ou se muda de forma.
2. **Isto é um terceiro valor de `combate.sistemaPadrao`, ou um modo por cima do `pgr`?** Hoje
   `regras.json → combate.sistemaPadrao` tem dois valores, `normal` e `pgr` (`Combate_Tempo.md`
   §15). Este modo não faz sentido sobre o `normal` (que resolve tudo na declaração, sem fase
   para interromper); ele só existe **em cima** do `P/G/R`. Ou seja, talvez não seja um terceiro
   sistema de regras, e sim um terceiro **motor de relógio** (`normal`/`pgr` decidem a física;
   "por vez" / "Tick a Tick" decidem quem pergunta quando), ortogonal ao que já existe.
3. **O que a tela mostra automaticamente quando a resposta muda de "continuar" para "decidir".**
   A decisão 2 da §2.1 fecha o "quando pergunta" (sempre, a cada Tick); falta fechar **o que
   destaca** na pergunta, pra ela não virar decoração repetitiva: alvo saiu do alcance, alvo
   morreu (redirecionamento, já decidido no `Golpe_Tardio.md` §9), alguém entrou em Preparo perto
   de você. É a régua de "o que a tela grita" versus "o que fica mudo até alguém clicar".
4. **Como a tela mostra "todo mundo decidindo ao mesmo tempo".** A fila de iniciativa de hoje é
   uma lista ordenada (quem age agora). Este modo não tem uma pessoa "da vez": tem um Tick
   corrente e N decisões possíveis nele. É um desenho de tela diferente do que existe, não um
   ajuste da fila atual.
5. **[FAZER, depois de 1 a 4 fecharem] Medir com o simulador.** `scripts/lib-tempo.mjs` resolve
   pulando para o próximo evento; rodar Tick a Tick pede um laço novo no motor antes de qualquer
   número sair da bancada.

---

## 3.1. A primeira fatia, implementada (2026-08-27)

O terceiro sistema entrou no Grid como **terceira opção no painel "Como o tempo passa nesta
mesa"** (`combate.sistemas` no `regras.json`, id `simultaneo`). A física é a do P/G/R, sem uma
linha de régua nova (`fisicaDe` no `combate-tempo.ts`); o que mudou é o relógio e o
deslocamento.

**A régua que a implementação cravou** (saída do exemplo da §2, número a número): a ação
declarada no Tick T **começa em T+1**. É o que faz o arco de Preparo 5 soltar a flecha no Tick 6
e o Tick 0 ser só preparação. E o golpe cai em `(T+1) + max(Preparo, Ticks de viagem)`: o
deslocamento cabe DENTRO do Preparo, e só o excedente atrasa o golpe (`agendaSimultanea`).

O que entrou, peça a peça:

- **O relógio da cena** (`encontros.tick_atual`, o mesmo da aba Combate): o "⏭" vira "Tick +1",
  anda um Tick por clique e nunca pula; o campo de custo some (quem cobra o tempo é a régua da
  ação). Golpe devido desliga o botão até ser resolvido, como no golpe adiado.
- **Decidir é de todo mundo:** `grupoDaVez` devolve todos os livres com `tick <= T`, e a dica do
  botão conta quantos ainda podem decidir. O avanço NÃO trava esperando: quem sabe se a mesa
  terminou de falar é o mestre.
- **O golpe adiado é constitutivo** (`adiaGolpe` devolve `true` sempre): declarar agenda, a
  faixa dos golpes no ar resolve, e até a arma leve cai no Tick seguinte.
- **Atacar fora do alcance** abre a declaração com o deslocamento embutido: modo (Batalha ou
  Corrida), m/Tick editável (o bestiário não guarda passo, K28) e trajetória automática ou à
  mão. A ação guarda `mov` (`alvo` ou `destino`, modo, m/Tick, auto) dentro de
  `combatentes.acao`, sem coluna nova.
- **O movimento é gradual:** a cada avanço, quem tem trajeto automático anda `porTick` metros
  pelo caminho mínimo (`caminharHex`, novo no `hex.ts`: guloso com passo lateral para contornar
  bloqueio, e um fallback que veta só a casa exata quando o raio de porte de um Enorme
  encurralaria a peça). Perseguir mira a posição ATUAL do alvo a cada Tick, e é isso que faz
  dois que avançam um no outro se encontrarem antes (medido: a 6 hexágonos e 1 hex/Tick cada,
  contato no Tick 3 em vez do 5).
- **Soltar num hexágono vazio pergunta COMO** (caixa `mov-dlg`: modo, m/Tick, auto, projeção de
  chegada) em vez de teleportar; "pôr direto" continua como ferramenta de mestre. A rota
  declarada aparece tracejada no tabuleiro (camada `gr-rotas`).
- **O robô da criatura:** item "🤖 Modo automático" no menu da peça (por criatura, persistido em
  `combatentes.dados.auto`). Ligado, ela decide sozinha no avanço: ataca o inimigo de pé mais
  próximo, foge correndo abaixo de 25% de Vida (`decisaoAutomatica`, limiar no `regras.json`).

**Provas:** `scripts/test-simultaneo.mjs` (motor puro: física herdada do pgr, os quatro números
do exemplo, o encontro antecipado emergente, o contorno de bloqueio, o robô; entrou no
`npm run validate` e no build) e `scripts/test-grid-simultaneo.mjs` (navegador: 22 asserções,
da caixa de declaração ao robô, incluindo "o relógio nunca pula" e "a peça anda, não
teleporta"). Arquivo próprio porque o `test-grid.mjs` estava em obra na outra frente.

## 3.1.1. O bestiário ganhou classe de ataque (2026-08-27, mais tarde)

As 309 criaturas atacavam pelo atalho da Velocidade (5 leve · 6 média · 7+ pesada), que erra
justamente onde importa: o arco não é "média", é tiro. O `gen-monsters.mjs` passou a estimar e
carimbar `classe` em cada ataque, em três camadas (nome do catálogo → palavras que decidem
sozinhas → o atalho da Velocidade), com `CLASSE_OVERRIDE` por criatura para as exceções
futuras. Distribuição: **159 leve · 97 média · 48 pesada · 1 tiro (Arqueiro) · 1 haste
(Camponês Assustado, forcado) · 3 arte (Cultista Sombrio, Feiticeiro Menor, Mago de Batalha,
cujos ataques são conjuração e saem no último Tick)**. O fio: `resumoDe` carrega a classe,
`classeDeTempo` a respeita (catálogo > estimativa > velocidade) e a régua `pgr.preparo` ganhou
a linha `arte`. Limite conhecido: a estimativa só olha a LINHA DE ATAQUE; sopros, cuspes e
afins que moram em `poderes` não viram ataque de tabuleiro por ora.

E o relato de 27/08 ("os personagens não se movem para atacar fora do alcance") **não
reproduziu** depois dos dois consertos do passo (o lateral e o da peça encurralada): na
reprodução dedicada, dois PCs de punho e uma criatura de garras declararam a distância, andaram
a cada Tick e golpearam na agenda. Se voltar a acontecer, anotar peça, arma e distância.

## 3.1.2. O passo real e a ficha do lance (2026-08-28)

Três coisas que fechavam o buraco entre o que a régua sabe e o que a mesa via.

**O bestiário ganhou deslocamento** (fecha a K28). Satélite `deslocamento-bestiario.json`,
semeado por `gen-deslocamento.mjs` a partir da **velocidade original da criatura** no material
de origem, como o usuário tinha travado: 270 das 309 com número colhido de fonte (Archives of
Nethys, d20pfsrd) e 39 pela tabela por tipo e porte, com a procedência marcada verbete a
verbete. O fator caiu limpo das raças básicas: **m/Tick = ft ÷ 10**, porque humano 30 ft dá 3
(o passo do soldado) e baixa estatura 20 ft dá 2, que são exatamente os dois terços que
`racas.json` já cobrava. Lobo 5/8/12, ogro 4/6/9, elemental do ar 10/16/23, caramujo 1/2/2.
Onde o passo em terra é vestigial e o voo ou o nado é o modo real, o número da mesa é o do modo
dominante, com o porquê no satélite.

**O Grid lê o passo real.** Era 3 m/Tick para todo mundo, do caramujo ao guepardo. Agora
`resumoCombatePC` devolve as três velocidades da ficha (com a fração da raça e a meia
penalidade da armadura, a mesma régua que a ficha desenha) e `resumoDe` traz as da criatura;
`passoDaPeca` no Grid resolve as duas, e as caixas de deslocar e de declarar mostram o número
de quem está agindo. A Corrida usa o **Arranque** e não o topo, porque quase toda perseguição
de combate cabe nos três primeiros Ticks.

**A ficha do lance**, na folha da ação: três colunas, recolhida por padrão. *Atacante* traz
arma, classe de tempo, Velocidade, Preparo/Golpe/Recuperação, bolo de acerto, dano e as três
velocidades; *alvo* traz Defesa, Defesa Mental, as três Absorções, resistência a perfuração e o
passo dele; *o lance* traz distância, alcance, ciclo, Tick do golpe, fase e Pressão do alvo,
Defesa efetiva e quem alcança quem, em leitura (cada número dali é soma dos campos ao lado, e
dois lugares para corrigir a mesma coisa é como os dois divergem). **Tudo o que é editável tem
a caixinha "fixa"**: marcada, o número vai para `combatentes.dados` e vale até o fim do
combate; desmarcada, morre quando o modal fecha. É o ajuste por instância que já existia no
banco e que nenhuma tela escrevia. Corrigir repinta a folha na hora, e o P/G/R escrito à mão
refaz a agenda inteira (`comOverride`, em `combate-tempo.ts`).

**E o Tick do Golpe planta o pé** (decidido em 28/08, para rediscutir): no Golpe não se anda,
que é a §14.6 finalmente escrita no motor. Antes a peça deslizava no instante do impacto
sempre que o alvo tinha se movido durante o Preparo. Quem quer chegar batendo compra a
**Investida**, que paga guarda por isso. A discussão que ficou aberta: permitir o passo no
Golpe favoreceria a arma leve (1 Tick é 20% do ciclo dela contra 14% da pesada) e reabriria o
bate-e-corre, já que andar na Recuperação é caro; proibir favorece a pesada de leve. Sem
medição de bancada ainda.

## 3.1.3. A agenda re-projetada, e o vaivém que ela destapou (2026-09-02)

Fecha o item 1 da §3.2, que era o mais sério da lista.

**O que mudou.** A agenda deixou de ser um número escrito na declaração. A cada avanço, quem
ainda está a caminho tem o Tick do golpe recalculado pela distância que sobrou depois do passo
daquele Tick (`reprojetarAgenda`, em `combate-tempo.ts`). A conta é a mesma da declaração, um
Tick depois: faltando `v` Ticks de viagem, a peça chega no fim do Tick `T + v` e o golpe cai no
seguinte. Os golpes ainda no ar andam todos juntos (a rajada é uma corrente de Ticks seguidos, e
quebrá-la seria inventar uma pausa no meio dela) e o fim do ciclo anda com eles.

**Só atrasa.** O golpe vai para frente e nunca para trás: o Tick anunciado no registro é o mais
cedo que ele pode cair. Antecipar o golpe de quem chega adiantado (porque o alvo veio ao
encontro) era defensável, e foi recusado por mudar debaixo da mesa um número que ela já leu; o
Preparo é piso de qualquer jeito. Quem chega cedo espera, como sempre esperou.

**Sem teto.** Na perseguição que não fecha, o golpe desliza um Tick por avanço, indefinidamente,
e o registro conta cada adiamento ("ainda não alcança Fulano · golpe adiado do Tick 5 para o
6"). Quem desiste do gesto é a mesa, no abortar, e não o motor: um teto automático decidiria
pelo jogador na única hora em que ele ainda pode mudar de ideia. As duas escolhas estão escritas
em `regras.json → combate.simultaneo.reprojecao`.

**E o vaivém.** A re-projeção destapou um defeito antigo do passo, que só era invisível porque
o cartão vencia na hora marcada de qualquer jeito: com o vizinho que aproxima vetado (o
`ocupadoPor` mede círculos em metros, e uma criatura Enorme veta os seis vizinhos de quem
encosta nela), `caminharHex` dá o passo LATERAL para contornar. A lista de casas pisadas que
impede o vaivém vale dentro de um Tick e nasce vazia no Tick seguinte: a peça ia e voltava entre
as duas mesmas casas para sempre. Com a agenda congelada isso passava batido; com ela viva
virava perseguição eterna. O gatilho do passo largo (repetir vetando só a casa exata das outras
peças) passou a ser **não ter aproximado**, e não "não ter saído do lugar".

**Provas:** oito casos novos no `test-simultaneo.mjs` (o rumo em dia não escreve nada, o alvo que
foge adia agenda e ciclo, chegar adiantado não puxa o golpe para trás, o golpe vencido com o
alvo longe é remarcado, a rajada desliza inteira, e a perseguição que não fecha corre cinco
Ticks sem nunca vencer longe) e a cena `cenaAlvoQueFoge` no `test-grid-simultaneo.mjs`, que arma
o caso no tabuleiro: dois heróis em campo aberto, ataque declarado, alvo correndo a 12 m/Tick, e
o cartão indo do Tick 2 ao 10 em três avanços sem travar o relógio.

## 3.2. Onde o sistema ainda falha (varredura de cenários, 2026-08-27)

Pensado cenário a cenário antes de fechar a fatia; o que não tem conserto nesta fatia fica
registrado aqui, por ordem de dor.

1. ~~**O alvo que sai de baixo.**~~ **RESOLVIDO em 02/09**, na §3.1.3: a agenda é re-projetada a
   cada avanço enquanto houver `mov` pendente, só para frente, sem teto de adiamento. Junto foi
   o vaivém do passo, que a re-projeção destapou.
2. **A perseguição perdida.** Se o alvo é mais rápido, o trajeto nunca fecha. O motor já sabe
   avisar (`previsaoDeEncontro` devolve `null`), mas a caixa de declaração ainda não usa isso
   para dizer "com esses passos, você nunca alcança". Pendente de tela, não de motor.
3. **Corrida sem penalidade automática.** O modo `corrida` no deslocamento não aplica a condição
   `correndo` (Defesa −4) nem a Investida (+1d6 no golpe que chega correndo): o mestre aplica à
   mão na folha. As condições existem; falta o fio.
4. **Movimento "simultâneo" que é sequencial por dentro.** No avanço, as peças andam na ordem da
   fila, uma por vez: duas disputando a mesma casa não colidem (a segunda contorna), mas a
   primeira da fila leva vantagem determinística. Aceito nesta fatia; a alternativa (resolver
   posições em duas passadas) é cara e só aparece em cena apertada.
5. **A fuga do robô não conhece a borda do tabuleiro.** O destino extrapolado (4× o vetor que
   separa) pode cair fora do retângulo, e a peça anda até onde der. Cosmético, o mestre
   redireciona; `caminharHex` poderia receber `dentro()` como veto.
6. **Trajetória à mão é intenção sem motor.** Com `auto` desligado, a rota aparece pontilhada e
   quem anda a peça é a mesa, arrastando; nada cobra que o arrasto respeite o m/Tick declarado.
   É a escolha da §2.1, registrada como convenção de mesa.
7. **Dois relógios no mesmo número.** `encontros.tick_atual` é compartilhado com a aba Combate:
   usar as duas abas ao mesmo tempo com sistemas diferentes conflita. Mesma mesa, um sistema por
   vez: é a regra que já valia para o painel do tempo.
8. **Abortar no meio do trajeto funciona de carona:** `abortarGesto` grava a ação limpa e o
   `mov` morre junto. Correto, mas não testado no navegador; entra na próxima leva de cenas.
9. **O que o jogador vê.** A declaração do jogador passa pelo `jogador_declara` (migração 28) e
   funciona; o AVANÇO é só do mestre, e os passos das peças são escritos pelo cliente dele. A
   máscara da migração 27 esconde a intenção alheia, mas o `mov` dentro da `acao` entra nessa
   máscara sem ter sido revisado: conferir o que a view devolve antes de jogar com jogador de
   verdade.
10. **Iniciativa e o Tick 0.** Quem rola iniciativa entra nos Ticks 1 a 4; no simultâneo o
    relógio começa no 0 e ninguém decide até o avanço alcançar a entrada de cada um. Coerente
    com "o Tick 0 é preparação", mas ainda não passou por mesa.

## 4. Rascunho de estrutura, para quando as decisões acima fecharem

Só para dar forma ao que a implementação provavelmente vira, sem comprometer nada:

- **O laço principal.** Em vez de `relogio() = min(próxima vez, próximo golpe)`, um laço que
  soma 1 Tick, resolve o que vence naquele Tick (golpes agendados, chegadas de movimento), e só
  então reabre a pergunta para quem ficou livre ou está em Preparo.
- **Posição como trajetória, não como ponto.** Cada combatente em deslocamento carrega origem,
  destino e velocidade (a mesma régua de `Golpe_Tardio.md` §13/§14), e a cada Tick sua posição é
  recalculada. É o que sustenta a pergunta 1.
- **A régua de fases não muda.** `P/G/R`, a escada de Defesa, a rajada, a dupla, tudo migra sem
  reescrita, porque o motor novo só decide **quando perguntar**, não **o que a pergunta vale**.
- **Reaproveitar o precedente do `golpeAdiado`.** Chave que nasce desligada em
  `regras.json → combate`, campo próprio em `combatentes.acao` (ou um novo ao lado dele), e
  provas no `test-combate-tempo.mjs` antes de qualquer coisa ir para a `/mesa` de verdade.

---

## Fontes internas

- `Combate_Tempo.md` §14 (a régua `P/G/R`), §4 (ação fora de hora), §6 (as nove bordas).
- `Golpe_Tardio.md` §9 (o que a mesa decidiu sobre resolução tardia), §10 a §14 (deslocamento e
  as quatro velocidades), §17 (a fatia do `golpeAdiado`, como precedente de implementação atrás
  de chave).
- `Pendencias.md`, frente **K** (Combate · a linha do tempo) e **I9** (o caderno de melhorias do
  tabuleiro, que já cita BG3 e Divinity, mas por outras features).
