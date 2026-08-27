# O terceiro sistema: combate simultâneo, Tick a Tick

> **Estado.** Rascunho de estrutura, **nada decidido e nada implementado**. Aberto em
> 2026-08-27, a partir de uma conversa que descreveu o mecanismo por exemplo (cinco
> personagens e três orcs, três Ticks narrados) em vez de por regra. Este documento organiza
> esse exemplo em seções, separa o que já é decisão do que ainda é pergunta, e mede a distância
> entre o que isto pede e o que o motor de `Combate_Tempo.md` já entrega.
>
> **Branch:** `combate-simultaneo`.

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
