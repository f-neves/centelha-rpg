# B14 Fase 5b (economia de ação na bancada de desafio) · relato

01/10/2026. Despacho: `docs/simulacao/caixa/b14-fase5b-economia-de-acao-despacho.md`,
com o Adendo do autor (mesmo arquivo, respondeu aos pontos 1, 2, 5 e 6 da conferência
prévia). Segue a Fase 5, fechada em `7993cffc`
(`docs/simulacao/caixa/b14-fase5-diagnostico.md`). Nenhuma ficha nem regra mudou nesta
rodada; tudo dentro de `scripts/sim/desafio-bancada.mjs`.

## 1 · Rajada e empunhadura dupla, implementadas pela régua escrita

Linhas de `src/content/chapters/combate.md` usadas: **Rajada**, `:137-155` (vários golpes
com a MESMA arma, corpo a corpo, −1d6 acumulativo por golpe extra, +2 de Velocidade por
golpe extra, teto por classe); **empunhadura dupla**, `:157-173` (um ataque por mão, as
duas a −1d6, mesma Velocidade); **Guarda sob pressão**, `:405` (preço da exposição, ver
item abaixo). Os números exatos (`−1d6`, `+2` por golpe, o teto por classe, o `−2` por
ataque) vêm de `regras.json → combate.rajada/dupla/escada`, não digitados à mão: usei as
funções que `src/lib/combate-tempo.ts` já expõe (`anatomia`, `tetoDaRajada`,
`cicloExtraDaDupla`), não reimplementei a conta.

**Escolha por dano esperado:** cada opção (golpe simples, Rajada de 2..teto golpes, dupla
quando disponível, poder, Arte) entra na mesma comparação de dano esperado da Fase 5
(convolução exata dos dados), agora somando o dano de TODOS os golpes da manobra. Conferi
o cálculo contra o `resolverGolpe` de verdade: Rajada de 3 golpes, Pers.1 Centelha 3 contra
o filhote, exato = 19,50 de dano esperado total; simulado (N=5.000 sequências de 3 golpes)
= 19,56. Bate dentro do ruído de amostra.

### Pers.2: um disparo por ação, sem Rajada nem dupla

**Adendo item 1**: o pedido original estava errado, não é divergência a registrar. A
implementação já saía assim sozinha, pela regra escrita: a Rajada é corpo a corpo (`:140`,
`regras.json → combate.rajada.corpoACorpo: true`), e `L0.anatomia` já força `golpes=1`
quando a classe é `distancia`. O arco ocupa as duas mãos, então também não tem dupla.
Nenhuma persona desta bancada tem dupla disponível, de resto: Pers.1 leva um broquel na
mão inábil (não uma segunda arma), Pers.4 vai com a mão inábil vazia. Só a Rajada entra
para Pers.1/Pers.4, quando a arma permitir (espada-longa e adaga, ambas corpo a corpo,
teto 3 golpes cada).

### Criatura com garras = duas armas naturais

A ficha do bestiário não separa mordida de garra (um só `ataques[0]`, "Garras e
mordida"), diferente do que o despacho supõe ("se a ficha tem mordida E duas garras").
**Interpretação, registrada aqui**: Rajada e dupla da criatura reusam o MESMO perfil de
`ataques[0]`, repetido (dois ou três golpes idênticos, cada um com seu próprio acerto e
dano), em vez de inventar um segundo perfil que a ficha não tem. É a leitura mais próxima
de "duas armas naturais, uma por pata" dado o dado disponível.

### Guarda sob pressão: implementada, na leitura "Defesa final"

**Conferido primeiro, como pedido**: `rolarContraDefesa` hardcodeava `defesaPerdida: 0`
sempre, em TODA rodada da Fase 5 inteira. Não existia Guarda sob pressão nenhuma até
agora. Implementada com as duas leituras atrás de **uma chave só** (`GUARDA_MODO`,
constante de módulo em `desafio-bancada.mjs`), como o Adendo pediu:

- **`'defesaFinal'` (padrão, confirmado pelo autor em 01/10)**: o −2 por ataque cai na
  Defesa já pronta, por fora da fórmula; NÃO reduz a Habilidade Esquiva nem o teto
  `2×mín(Centelha,Esquiva)`.
- `'habilidade'` (a leitura entre colchetes, não usada nos resultados oficiais): o −2 cai
  na própria Esquiva/Bloqueio antes da fórmula, reduzindo também o teto da Centelha.
  Implementada e disponível (recompõe a Defesa pelos componentes crus, `L0.defesa`), mas
  comentada na constante: trocar `GUARDA_MODO` é a única mudança para usá-la.

**Quem conta**: só o ataque RECEBIDO (acerto, raspão ou erro, sem distinção), seguindo o
que `src/lib/combate-tempo.ts`/`grid.astro` já fazem de verdade (`pressao:
(base.pressao||0)+1` em `resolverContra`/`tirarDaAgenda`), não o texto solto que também
fala em "faz". A pressão zera em quem AGE no momento em que age (mesmo gatilho de
`declarar()`, `pressao: 0`), sem teto, valendo para os dois lados.

**Isto mudou os resultados desta rodada inteira** (não é uma correção isolada: a matriz
toda rodou com ela ligada, porque ela não existia antes). Pesa mais em dois lugares: um
alvo que já levou vários golpes no mesmo turno (Rajada/dupla contra ele, ou vários membros
de um bando) fica mais fácil de acertar nos golpes seguintes DENTRO do mesmo ciclo, e
continua mais fácil até a própria próxima ação dele. É o preço que o texto da dupla cita
(`:171`) e que sem ele a Rajada/dupla sairia de graça. O item 5 abaixo isola o tamanho
real desse efeito nos dois casos pedidos.

### O +2 de Velocidade da Rajada, convertido em turnos

A bancada usa turno = 6 Ticks (mesma convenção das rodadas anteriores). `L0.anatomia`
devolve o ciclo em Ticks (ex.: espada-longa simples = 5 Ticks; Rajada de 3 golpes = 10
Ticks, uma diferença de +4 pelos dois golpes extras). Essa diferença vira `atrasoTicks`
em quem usou a Rajada; a cada turno, `atrasoTicks -= 6` (o relógio passa pra todo mundo);
enquanto `atrasoTicks > 0` no início do turno dessa peça, ela NÃO age (pula a vez), sem
zerar a própria pressão (que só zera "quando você age"). A dupla não soma atraso nenhum:
`cicloExtraDaDupla(classe,'normal') = 0` pra toda classe (`regras.json →
combate.dupla.cicloExtraNoNormal`), a régua confirma "mesma Velocidade" também no número,
não só na prosa.

**Não uso o alívio de −4 para −2** no Tick do Golpe (`combate.md:95-96`, empunhar duas
armas e golpear só com uma): é uma regra do sistema de Ticks (P/G/R), e esta bancada nunca
modelou Preparo/Golpe/Recuperação por fase (é turno simples desde a Fase 5). Registrado
como não usado, não como esquecido.

## 2 · Filhote, Jovem e Adulto: A1/A2 × base/B1

**Adendo item 4, base nova**: SEM Proezas de Defesa, **COM** Vontade na Defesa (o traço
Força de Vontade real, `willpower`, continua valendo: é a suposição provisória
Centelha+2, documentada desde a Fase 5). Não é a B2 antiga da Fase 5 (que tirava as
duas): essa fica só de referência histórica no código (`opts.semDefesaExtraPers1`), a
base nova usa `opts.semProezasPers1`, que tira só as Proezas. Pers.1 mantém as Proezas de
ATAQUE; Pers.2/Pers.4 mantêm as deles (ataque e defesa) intactas. B1 (com Proezas de
Defesa de volta) é a variante de sensibilidade.

N=200 batalhas/Centelha/célula. "Desafio" = menor Centelha do grupo com vitória ≥80%.

| criatura (Centelha) | faixa do autor | A1, base | A1, B1 | A2, base | A2, B1 |
|---|---|---|---|---|---|
| Filhote (4) | 3 ou 4 | 2 ✗ | 2 ✗ | 2 ✗ | 2 ✗ |
| Jovem (5) | 5 ou 6 | **5 ✓** | 4 ✗ | **5 ✓** | 4 ✗ |
| Adulto (6) | 6 a 8 | não alcançado ✗ | **6 ✓** | não alcançado ✗ | não alcançado ✗ |

A2 não muda nada no Filhote (Habilidade real dele, 5, já é ≥ Centelha, 4: o teto do
gerador antigo não estava mordendo nele, só nas âncoras de Centelha mais alta, como a
Fase 5 já tinha achado). No Jovem e no Adulto, A2 também não muda o desafio medido nesta
bateria (só muda a chance de acerto deles, como na Fase 5).

**Leitura**: com Rajada/dupla/Guarda sob pressão, **Jovem e Adulto já alcançam a própria
faixa em pelo menos uma célula** (Jovem em A1/base e A2/base; Adulto em A1/B1). **O
Filhote continua abaixo da faixa em TODAS as quatro células** (desafio 2, precisa de 3 ou
4): é o único dos três que não chega, e por isso é o único testado no item 3.

## 3 · "Ataque total" (Poder Especial de teste), só no Filhote

Variante condicional (despacho item 3): mordida e as duas garras na MESMA ação (3 golpes,
mesmo perfil repetido, sem a penalidade de −1d6 da Rajada), 1 uso a cada 3 turnos.
Implementada como opção extra na escolha por dano esperado, ligada só quando pedida
(`opts.ataqueTotal`), nunca parte da base.

| célula | desafio SEM Ataque total | desafio COM Ataque total |
|---|---|---|
| A1, base | 2 ✗ | **3 ✓** |
| A1, B1 | 2 ✗ | 2 ✗ |
| A2, base | 2 ✗ | **3 ✓** (A2 não muda nada no Filhote, ver item 2) |
| A2, B1 | 2 ✗ | 2 ✗ |

**Com "Ataque total", o Filhote entra na faixa (3 ou 4) nas duas células de base**,
continua abaixo nas duas de sensibilidade (B1, que já reduz o desafio de todo o resto por
dar mais Defesa ao Pers.1). É dado pro autor decidir se isto vira ficha (um poder natural
novo) ou fica só a confirmação de que o modelo de ação é a causa, não a criatura.

## 4 · Bando: 1 lobo, 4 lobos, 4 e 5 worgs

**Nova batalha** (`rodarBatalhaBando`, não é `rodarBatalha`): N criaturas INDIVIDUAIS (é a
definição de `maisUm`/"quantos iguais" da Fase 5, não a Regra de Horda). Política de
bancada, registrada por não estar no despacho: vitória do bando só quando as N criaturas
caem todas; toda criatura mira a persona engajada (nenhuma destas é voadora/à distância);
as personas sempre fazem foco de fogo na criatura viva mais ferida; a ordem dentro do
turno é a mesma do 1×1 (bando age, depois as personas), o que importa pra pilha de
pressão: N criaturas batendo na mesma persona empilham N pontos nela antes das personas
agirem de volta. Base nova, sem variante nenhuma, como pedido.

| grupo | desafio medido | âncora do autor | bate? |
|---|---|---|---|
| 1 lobo | 0 (100% já em C0) | "não é desafio nem pro grupo C0" | **sim** |
| 4 lobos | 0 (100% já em C0) | (sem âncora específica) | |
| 4 worgs | **2** | "4 a 5 worgs são desafio 2" | **sim** |
| 5 worgs | **2** | "4 a 5 worgs são desafio 2" | **sim** |

As três âncoras do despacho batem exatas. **Não apliquei a Regra de Horda**
(`combate.md:409`, o bando virar um esquadrão com Magnitude): confirmado pelo Adendo item
3, 4 e 5 lobos/worgs ficam abaixo da sugestão de Horda do próprio livro (2 por personagem,
8 no total), então nem chegaria a valer pra estes quatro grupos de qualquer jeito.

## 5 · Efeito isolado da Guarda sob pressão (Adendo, pedido extra)

Mesma bateria (N=200), com `opts.semGuardaPressao` desligando o termo inteiro, pra
comparar a curva inteira e o desafio medido, com e sem a regra.

**Filhote (A1, base):**

| | C0 | C1 | C2 | C3 | C4 | C5 | C6 | desafio |
|---|---|---|---|---|---|---|---|---|
| COM Guarda sob pressão | 0,0% | 0,0% | 95,5% | 100% | 100% | 100% | 100% | 2 |
| SEM Guarda sob pressão | 0,0% | 5,5% | 100% | 100% | 100% | 100% | 100% | 2 |

**4 lobos (bando, base):**

| | C0 | C1 | C2 | C3 | C4 | C5 | C6 | desafio |
|---|---|---|---|---|---|---|---|---|
| COM Guarda sob pressão | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 0 |
| SEM Guarda sob pressão | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 0 |

**Leitura**: nos dois casos, o **desafio medido não muda** com ou sem Guarda sob pressão.
A curva fina move um pouco no Filhote (C1: 0,0%→5,5% sem a regra; C2: 95,5%→100% sem a
regra: a Guarda deixa o grupo um pouco mais lento pra fechar a vitória), mas não o
suficiente pra cruzar o limiar de 80% em nenhuma Centelha a mais ou a menos. Nos 4 lobos
não move nada perceptível: o grupo já vence com folga total em toda Centelha, com ou sem
o −2 por ataque. A Guarda sob pressão pesa mais em combates equilibrados, não nestes dois
casos pedidos (um deles trivial pro grupo, o outro com desafio baixo mesmo).

## O que fica pendente desta rodada

- Se "Ataque total" vira ficha de verdade (poder natural) ou fica só o diagnóstico de que
  o Filhote precisa de economia de ação pra chegar na faixa: decisão do autor.
- Vontade do Pers.3/reserva de Vontade das personas: mesma suposição provisória de
  sempre (Centelha+2), sem número do autor ainda.
- Regra de Horda pro bando: registrada como não aplicada (e, pelo Adendo, não chegaria a
  valer pra nenhum dos quatro grupos testados mesmo que fosse aplicada).
- Desafio acima de Centelha 6 continua fora de escopo (nenhuma das âncoras desta rodada
  precisou disso).

## Verificação (até o Adendo 1)

`npm run validate`, `npx tsc --noEmit`, `npm run build`, `npm run espelho`: verdes.
Regressão conferida: 1 lobo contra o grupo Centelha 0 continua sem ser desafio (100% de
vitória do grupo), com a Guarda sob pressão e a Rajada ligadas.

## Adendo 2 (autor, 01/10, depois da entrega `2e14b3f2`): dois desvios, rodada refeita

### 1 · Base: já estava certa desde o commit anterior

A crítica do Adendo 2 (item 1) fala do commit `2e14b3f2`, de ANTES do commit `3c9f9d59`
(ainda deste dia), que já tinha trocado `semDefesaExtraPers1` (B2 antiga, tira Proezas E
Vontade) por `semProezasPers1` (só tira Proezas, mantém Vontade real) na base nova. As
mensagens se cruzaram: a correção já estava feita quando o Adendo 2 chegou. Não mudei nada
aqui de novo; os números desta seção já usam `semProezasPers1`, como antes.

### 2 · Guarda sob pressão PELO LIVRO: feito + recebido

**Isto sim era um desvio real.** A entrega anterior seguia o CÓDIGO da mesa
(`defesaPerdida`, `src/lib/combate-tempo.ts:696`, só soma pressão em quem RECEBE o golpe).
O autor confirmou, vendo a divergência com o Grid, que vale o TEXTO (`combate.md:405`):
"cada ataque que você FAZ OU RECEBE" reduz a Defesa em −2. Implementado: todo golpe
resolvido agora soma 1 em `pressaoRecebida` do alvo E 1 em `pressaoFeita` de quem bateu
(a dupla soma 2 sozinha, por fazer 2 golpes, sem caso especial). As duas contagens entram
juntas em `defesaComPressao()`, com o mesmo reset "zera quando você age" para as duas.

**Penalidades de fase (Preparo −2, Golpe −4), "à parte" da pressão**: modeladas como UM
estado só, −4, que liga quando o combatente AGE (qualquer ação, não só ataque: Proteção,
Cura-em-si, Cura do Pers.3 e Cobrir também contam) e desliga quando ele age de novo
("até a próxima ação", mesmo gatilho da pressão). **Não separei o −2 do Preparo do −4 do
Golpe**: o próprio texto do sistema Normal (`combate.md`, "Dois sistemas de tempo",
`:98-114`) diz que a ação "resolve inteira no Tick da declaração", ou seja, Preparo e
Golpe colapsam no mesmo instante nesta bancada por turnos, que não tem um Tick isolado de
Preparo pra distinguir os dois. Fiquei com o número mais forte (−4, o do Golpe, o
instante em que o gesto resolve de verdade) em vez de inventar uma régua de dois estados
que a bancada não tem como sustentar.

**Pendência de mesa registrada, não consertada** (`docs/pendencias/K-combate-linha-do-
tempo.md`, **K37**): `defesaPerdida`/`motor.mjs`/`grid.astro` só somam o ataque recebido;
o livro cobra também o feito. O Grid hoje cobra MENOS do que a regra escrita. Não mexi no
Grid nem no `motor.mjs` nesta rodada.

### Tabela refeita: Filhote, Jovem e Adulto, com a Guarda sob pressão correta

| criatura (Centelha) | faixa do autor | A1, base | A1, B1 | A2, base | A2, B1 |
|---|---|---|---|---|---|
| Filhote (4) | 3 ou 4 | **3 ✓** | **3 ✓** | **3 ✓** | **3 ✓** |
| Jovem (5) | 5 ou 6 | **6 ✓** | **5 ✓** | **6 ✓** | **5 ✓** |
| Adulto (6) | 6 a 8 | não alcançado ✗ | não alcançado ✗ | não alcançado ✗ | não alcançado ✗ |

**O Filhote agora alcança a faixa nas QUATRO células** (antes só com "Ataque total", e só
em duas): a pressão feita+recebida pesa mais contra o grupo do que a pressão só recebida
media antes. **O Adulto, que antes alcançava em A1/B1 (desafio 6), agora não alcança em
nenhuma célula** (A1/B1 cai pra 5,5% em C6, longe dos 99% de antes): com a pressão certa,
o Adulto demora mais a derrubar o grupo, e o grupo (que também ganha Defesa pela pressão
feita dele mesmo atacar menos) segura mais tempo.

Testei "Ataque total" no Adulto, já que agora ele não alcança a faixa (a mesma condição
"só se o item 2 não chegar" que valeu pro Filhote na rodada anterior): **piorou, não
ajudou**: A1/base e A1/B1 caem pra 0,0% em toda Centelha até C6. Fazendo 3 golpes na
mesma ação sem a penalidade da Rajada, o Adulto soma 3 de `pressaoFeita` de uma vez (em
vez de 1), ficando mais exposto ao contra-ataque do grupo logo depois. Não é uma vantagem
estrita mais: é dado novo, pro autor decidir se isto é esperado da regra ou sinal de
reconsiderar o "Ataque total" como variante.

### Bando refeito: as âncoras do despacho NÃO batem mais

| grupo | desafio ANTES (pressão só recebida) | desafio AGORA (feito+recebida) | âncora do autor |
|---|---|---|---|
| 1 lobo | 0 | **0** | "não é desafio nem pro grupo C0" ✓ ainda bate |
| 4 lobos | 0 | **2** | (sem âncora específica) |
| 4 worgs | 2 | **3** | "4 a 5 worgs são desafio 2" ✗ **não bate mais** |
| 5 worgs | 2 | **4** | "4 a 5 worgs são desafio 2" ✗ **não bate mais** |

**Não ajustei nada pra forçar o encaixe de novo**, como o despacho original pede. A
pressão feita+recebida pesa muito mais num bando do que num 1×1: cada criatura do bando
que ataca acumula a própria `pressaoFeita`, e isso facilita o contra-ataque do grupo
contra ELA especificamente depois; ao mesmo tempo, a persona engajada acumula
`pressaoRecebida` de TODAS as N criaturas que bateram nela no mesmo turno, facilitando o
acerto delas contra essa persona também. Os dois efeitos se somam rápido num bando de 4-5,
mais do que numa luta 1×1. O número que o autor deu (desafio 2 pra 4-5 worgs) é a
EXPECTATIVA dele sobre o resultado, não algo que ele mediu: pode ser que a expectativa
precise ser revista à luz da regra escrita, ou que a política de robô do bando (foco de
fogo, ordem de ação) precise de outro olhar. Devolvo a
pergunta, não decido sozinha.

### Item 5 completo: as duas parcelas isoladas (Adendo 1 + Adendo 2)

**Filhote (A1, base):**

| | C0 | C1 | C2 | C3+ | desafio |
|---|---|---|---|---|---|
| Pressão INTEIRA (feito+recebida) | 0,0% | 0,0% | 41,5% | 100% | **3** |
| SEM pressão nenhuma | 0,0% | 0,0% | 94,5% | 100% | **2** |
| Só "recebida" (sem a parcela "feito") | 0,0% | 0,0% | 67,5% | 100% | **3** |

**4 lobos (bando, base):**

| | C0 | C1 | C2+ | desafio |
|---|---|---|---|---|
| Pressão INTEIRA (feito+recebida) | 0,0% | 24,5% | 100% | **2** |
| SEM pressão nenhuma | 99,5% | 100% | 100% | **0** |
| Só "recebida" (sem a parcela "feito") | 42,0% | 100% | 100% | **1** |

**Leitura**: no Filhote, a parcela "feito" sozinha não muda o desafio medido (C2 vai de
67,5% pra 41,5% com ela, mas os dois ficam abaixo de 80%: quem decide o salto de 2 pra 3
é a parcela "recebida"). **Nos 4 lobos, a parcela "feito" sozinha MOVE o desafio** (de 1
pra 2): é ela que pesa mais no bando, confirmando a leitura do item anterior.

## Verificação (Adendo 2)

`npm run validate`, `npx tsc --noEmit`, `npm run build`, `npm run espelho`: verdes.
Regressão conferida: 1 lobo contra o grupo Centelha 0 continua sem ser desafio, com a
Guarda sob pressão (feito+recebida) e a Rajada ligadas. CI do GitHub: confirmo job a job
depois do commit.

## Adendo 3 (autor, 01/10, corrigindo `8c7f941f`): a fase não entra na bancada

**O erro apontado**: `8c7f941f` modelou a penalidade de fase (Preparo −2, Golpe −4) como
um estado PERSISTENTE (−4 fixo, ligando quando o combatente age e durando até a próxima
ação dele, igual à Guarda sob pressão), inclusive em ações sem ataque (Protecao,
Cura-em-si, Cura/Estabilizar/Cobrir do Pers.3). **Não era isso que o autor tinha dito**
("uma vale durante o gesto, a outra até a próxima ação") nem o que a regra escreve: o
texto (`combate.md` "Dois sistemas de tempo" e "Golpes no mesmo instante", `:98-114` e
`:378-382`) prende a fase ao INSTANTE do gesto, não a um intervalo que dura até a próxima
ação de quem a sofre.

**Decisão do autor, aplicada**: a fase só vale contra golpes que caem NO MESMO INSTANTE
do gesto de quem a sofre. Esta bancada por turnos não tem esse instante compartilhado: o
bando age primeiro, inteiro, depois as personas agem, inteiro; não existe um ponto em que
os dois lados estão "no meio do próprio gesto" ao mesmo tempo. Criar um recorte de
simultaneidade só pra caber a fase seria regra nova, então **a fase fica FORA da bancada**,
registrada como suposição (item 9 da lista no topo de `desafio-bancada.mjs`). Removida:
a constante `faseExposta` e o termo −4 em `defesaComPressao()`. Só a Guarda sob pressão
(desgaste contínuo, feito+recebido) continua entrando no cálculo. Cura/Estabilizar/Cobrir
confirmados sem contar como "ataque feito" (só `resolverGolpeFisico()` soma
`pressaoFeita`, e essas três ações nunca chamam essa função).

**A lição que levo**: devia ter perguntado antes de escolher como modelar a fase numa
bancada por turnos, em vez de decidir sozinha e só registrar a escolha depois. O despacho
pedia "diga como modelou", e eu li isso como licença pra decidir; não era. Uma modelagem
genuinamente em aberto (sem instante compartilhado nesta bancada) é exatamente o tipo de
situação pra parar e perguntar antes, não depois.

### Tabela lado a lado: fase permanente (`8c7f941f`, errada) × corrigida (sem fase)

**Filhote, Jovem, Adulto** (desafio medido; faixa do autor entre parênteses):

| criatura | célula | fase permanente (errada) | corrigido (sem fase) |
|---|---|---|---|
| Filhote (3 ou 4) | A1/A2, base | 3 ✓ | 2 ✗ |
| | A1/A2, B1 | 3 ✓ | 2 ✗ |
| Jovem (5 ou 6) | A1/A2, base | 6 ✓ | 5 ✓ |
| | A1/A2, B1 | 5 ✓ | 5 ✓ |
| Adulto (6 a 8) | A1/A2, base/B1 | não alcançado ✗ | não alcançado ✗ |

**Bando** (desafio medido; expectativa do autor entre parênteses):

| grupo | fase permanente (errada) | corrigido (sem fase) |
|---|---|---|
| 1 lobo (não é desafio) | 0 ✓ | 0 ✓ |
| 4 lobos (sem expectativa) | 2 | 1 |
| 4 worgs (expectativa 2) | 3 ✗ | 3 ✗ |
| 5 worgs (expectativa 2) | 4 ✗ | 3 ✗ |

**Leitura**: a fase permanente (o erro) empurrava TUDO pra cima (mais desafio): o
Filhote só alcançava a faixa com ela ligada; sem ela, volta a ficar abaixo (desafio 2,
precisa de 3-4), do mesmo jeito que na primeira rodada desta fase, antes de qualquer
correção de pressão. **Testei "Ataque total" no Filhote de novo** (a condição "só se o
item 2 não chegar" volta a valer pra ele): com `semProezasPers1`, desafio=3 ✓; com B1,
desafio=3 ✓ também agora (antes da fase era 2). O Jovem e o bando de worgs mudam pouco
entre as duas versões (a fase pesava menos neles do que no Filhote especificamente,
porque o Filhote é quem mais depende de poucos turnos decisivos pra resolver a luta).
**Nenhuma das duas versões faz o bando de worgs bater a expectativa do autor** (desafio 2):
tanto com a fase errada quanto sem ela, 4-5 worgs saem acima disso (3 e 3-4).

### Item 5, refeito com a fase removida

**Filhote (A1, base):**

| | C0 | C1 | C2 | desafio |
|---|---|---|---|---|
| Pressão INTEIRA (feito+recebida) | 0,0% | 0,0% | 80,5% | **2** |
| SEM pressão nenhuma | 0,0% | 5,5% | 100% | **2** |
| Só "recebida" (sem a parcela "feito") | 0,0% | 0,0% | 95,5% | **2** |

**4 lobos (bando, base):**

| | C0 | C1 | desafio |
|---|---|---|---|
| Pressão INTEIRA (feito+recebida) | 0,0% | 100% | **1** |
| SEM pressão nenhuma | 100% | 100% | **0** |
| Só "recebida" (sem a parcela "feito") | 100% | 100% | **0** |

**Leitura, sem a fase**: no Filhote, nenhuma das três versões muda o desafio (fica 2 nas
três): a Guarda sob pressão, sozinha, já não é o suficiente pra levar o Filhote à faixa.
**Nos 4 lobos, é de novo a parcela "feito" que decide**: sem ela (ou sem pressão nenhuma),
desafio 0; com ela, desafio 1. Confirma, com os números certos desta vez, que o bando é
onde a parcela "ataque feito" mais pesa.

## Verificação (Adendo 3)

`npm run validate`, `npx tsc --noEmit`, `npm run build`, `npm run espelho`: verdes.
Regressão conferida: 1 lobo contra o grupo Centelha 0 continua sem ser desafio (100% de
vitória, 100/100 resolvidas). CI do GitHub: confirmo job a job depois do commit.
