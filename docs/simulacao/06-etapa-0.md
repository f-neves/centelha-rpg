# Etapa 0 · A instrumentação

Feita em 02/09, no commit `ce5486f`. **Nada da Etapa 1 entrou nesta passada**: nenhuma bandeira,
nenhuma regra do núcleo do Tick, nenhuma migração. A Etapa 0 não muda comportamento nenhum, e é isso
que ela tem de provar antes de qualquer outra coisa.

Documentos: **P** = `02-projeto-harness.md` (o canônico), **R3** = `03-respostas.md`,
**R4** = `04-prontidao.md`, **R5** = `05-fechamento.md`.

---

## 1 · Uma correção na ordem, achada ao implementar

A ordem da P §0.6.1 dizia que a **branch congelada** era o passo **0.1**, cortada "do commit corrente,
antes de tudo". **Está errado, e o erro é do tipo que esta frente vem caçando: a prova depende de um
instrumento que não existe naquele ponto.**

O espelho de inércia compara a mesa de hoje com a mesa da branch. Se a branch for cortada **antes** da
semente existir, o lado dela rola com `Math.random`, e a comparação volta a ser exatamente o problema
que a semente foi criada para resolver. **A branch tem de ser o último passo da Etapa 0**, não o
primeiro.

O argumento do prazo, que era o motivo de ela vir cedo, sobrevive inteiro: ela continua tendo de ser
cortada **antes da primeira bandeira**, porque depois disso o estado de referência não existe mais.
O que muda é só a posição dentro da Etapa 0.

**A ordem valendo:** semente → caminho do driver → despejo → **branch**.

---

## 2 · O que foi entregue

### 2.1 · A semente, num ponto de injeção só

**`src/lib/acaso.ts`**, arquivo novo e **puro** (não toca no DOM, não lê a URL, não sabe o que é uma
mesa, exatamente como o `rolagem.ts` que ele serve):

| O que | Para quê |
|---|---|
| `acaso()` | a fonte de acaso do combate. É `Math.random` até alguém trocar |
| `semear(f)` | troca a fonte. `semear(null)` devolve o padrão |
| `semeado()` | se a cena é repetível |
| `semeadoDe(n)` | um Mulberry32 a partir de uma semente inteira |

O gerador é o Mulberry32 por um motivo que vale escrever: o harness vai ter de reproduzir **a mesma
sequência em Node e no navegador**, e um gerador que cabe em cinco linhas auditáveis a olho é a única
garantia barata de que os dois lados fazem a mesma conta.

**Os pontos de acaso do combate passaram a usá-lo:**

| Onde | Era | Ficou |
|---|---|---|
| `rolagem.ts:11` · o `d6` | `Math.random()` | `acaso()` |
| `mesa-ficha.ts:133` · `rolarIniciativaPC` | um `d6` local, com `Math.random` embutido | o `d6` do `rolagem.ts`, e por tabela o mesmo `acaso` |
| `artes-grid.ts:1342` · `rolar`, o dano de Arte | `Math.random()` | `acaso()` |
| `mesa-bestiario.ts:55` · `iniDeMonstro`, a iniciativa de **criatura** | **já usava o `d6` do `rolagem.ts`** (L19 importa, L63 reexporta) | veio de graça |

**A linha da criatura merece destaque, porque o D10 acabou de pôr criatura num eixo inteiro.** Se ela
não passasse pelo mesmo `d6`, toda célula com bicho divergiria no primeiro Tick, e o eixo E11 nasceria
sem espelho. Conferido nas duas pontas: o arquivo importa o `d6` do `rolagem.ts` e o reexporta com o
comentário "o dado mora em `rolagem.ts` agora, com o resto do acaso do combate", e **a bancada com
`bench=12` é 4 PCs e 8 criaturas** (`mesa-mock.mjs:100`), então o `test-etapa0.mjs` já exercitava
esse caminho sem que o relatório dissesse.

**Depois da Etapa 0 existem exatamente DUAS fontes de acaso no combate**, e não quatro: o `d6` do
`rolagem.ts` (por onde saem `rolarExpr`, `iniDeMonstro` e `rolarIniciativaPC`) e o `rolar` do
`artes-grid.ts`. As duas passam pelo `acaso`. O resto de `Math.random` em `src/lib` gera id ou chave
de presença, e uma varredura no `test-acaso.mjs` falha se aparecer um terceiro.

**O quarto ponto da especificação não existe ainda.** A P §0.6.1 item 2 lista o **sorteio do último
critério de N4** como quarto lugar a semear. N4 não foi escrito (é Etapa 2), então não há sorteio a
semear: ele nasce já usando o `acaso`, e isso fica anotado como cuidado do item 2.

**O que continua com `Math.random`, de propósito:** `ficha-engine.ts:211` e `mesa-core.ts:28` geram
**id**, e `mesa-tempo-real.ts:209` gera chave de presença. Nenhum dos três é acaso de combate, e
semeá-los produziria ids repetidos entre duas execuções, que é o oposto do que se quer.

### 2.2 · O caminho do driver até a semente

Em `grid.astro`, logo no início do script da página, e **só ali**: a leitura da URL não podia entrar
no `acaso.ts` sem tornar impuro um arquivo que o harness vai empacotar para rodar em Node.

| Parâmetro | O que faz |
|---|---|
| `?semente=N` | chama `semear(semeadoDe(N))`. A cena passa a ser repetível, e liga o despejo junto |
| `?despejo=1` | liga só o despejo, sem semear |
| nenhum dos dois | **nada acontece**: `semear` nunca é chamado, o `acaso` é `Math.random`, e o array do despejo não é criado |

### 2.3 · O despejo por Tick

`window.__DESPEJO`, escrito no fim de `avancarTickSimultaneo`, depois de tudo, com **um registro por
Tick**. É leitura pura do estado que já está em memória (`COMBS`, `TOKENS`, a agenda), então **não
custa consulta nenhuma** e respeita o orçamento da P §0.8.

**Duas proteções, acrescentadas depois da revisão:**

- **`try/catch` em volta de tudo.** Isto é instrumento de bancada, e uma exceção aqui derrubaria o
  avanço do Tick, que é o motor da cena. Um despejo que falha vira um contador (`erros`); um avanço
  que falha vira uma mesa parada;
- **teto de 2.000 Ticks, com descarte do começo.** É o mesmo teto de segurança da bateria (§0.8.7), e
  existe porque uma batalha que não fecha (o eixo E4 inteiro) encheria isto para sempre. O campo
  `descartados` diz quantos Ticks saíram pela frente: **quem compara espelho a partir do Tick 1 tem
  de conferir esse campo antes**, senão compara duas caudas e acha que bateram.

```
semente      int | null   a semente usada, ou null
semeado      bool         se a fonte de acaso está trocada
arena        id | null
encontro     id | null
descartados  int          Ticks que saíram pela frente ao bater o teto
erros        int          Ticks em que o despejo falhou e o avanço seguiu
ticks[]      { t, fila[], pecas[] }
```

E por peça, em cada Tick:

```
id, nome
q, r, chegada          a posição, e o Tick em que o trajeto encerrou
chao                   se está no chão
pv                     Vida corrente
ini                    a iniciativa rolada
fase                   faseEm(acao, T)
defesaPerdida          defesaPerdida(acao, T).total
acao                   { tipo, desde, livre, golpes[], pressao, mov{destino,alvo} }
```

**O que ele ainda não traz, e por quê.** A tabela de campos da R3 §1.1.1 pede mais três grupos, e os
três dependem de coisa que não existe:

| Falta | Depende de |
|---|---|
| a **resolução** (`def` efetiva, `errouPor`, veredito, Absorção, dano líquido) e **o que a folha calculou** (o ferimento, a Pressão, a distância) | hoje só existem dentro do modal. É o buraco **I5** da R5 §1.2, e entra com o item 6 (N6), que é quem precisa lê-los de um retrato |
| a **ordem de declaração** e a de resolução | é N4, item 2 da Etapa 2 |
| o par (Tick antes, Tick depois) de cada **deslize** | sai do mesmo lugar da re-projeção, e entra junto |

Cada um entra com o item que o cria. O despejo foi desenhado como o gancho onde eles encaixam.

### 2.4 · A branch congelada

**`sim/base-congelada`**, cortada do commit `ce5486f`, que é o da Etapa 0, e empurrada para o
`origin`. É o lado de referência do espelho de inércia: ela tem a semente e o despejo, e **não tem
bandeira nenhuma**.

---

## 3 · A prova

**Duas provas, e a segunda entrou depois da revisão**, porque a primeira sozinha dizia menos do que
parecia.

#### 3.1 · `test-acaso.mjs`, em Node, dentro do `npm run validate`

**14 asserções, segundos, sem navegador.** Ele existe porque o teste do navegador exercita a semente
**só pelo caminho da iniciativa**: o `rolarExpr` (por onde sai todo dano e todo bolo de ataque) e o
`rolar` das Artes ficavam plugados por **leitura de código**, não por prova.

| O que prova | Como |
|---|---|
| os **quatro caminhos** repetem sob a mesma semente | uma passada por `d6`, `rolarExpr`, `rolar` das Artes e `iniDeMonstro`, duas vezes, idêntica |
| **cada um individualmente** passa pelo ponto de injeção | dez rolagens de cada, com duas sementes. Dez, e não uma: um dado tem seis faces, e comparar uma rolagem falharia por coincidência uma vez em seis |
| sem semente, tudo volta a ser aleatório | `semear(null)` e duas passadas diferentes |
| **nenhuma fonte nova entra em silêncio** | uma **varredura** de `src/lib`, `src/pages` e `src/components` (98 arquivos), com a lista explícita do que é permitido. Quem acrescentar um `Math.random` tem de vir dizer por que não é combate |

A varredura é a asserção que mais vale das quatro, e ela nasce de um erro real: **o `rolar` das Artes
era uma segunda fonte de acaso com `Math.random` próprio, e ficou ali sem ninguém notar.**

**Ela olhava só `src/lib` e passou a olhar `src/pages` e `src/components` também**, o que era a
correção certa pelo motivo certo: `src/lib` é a parte arrumada, e a resolução do combate mora em
`grid.astro`, que é `src/pages`. **Estendida, ela achou um terceiro rolador de dados**:
`src/components/RoladorDados.astro:46`, com `d6` próprio. Ele é rolador **de mão**, o que o jogador
aperta, e está em `/rolador`, na ficha e na página `/mesa`; o Grid **não o importa**, e o harness
nunca passa por ele. Entrou na lista de permitidos com essa justificativa escrita, que é o que faz
dele uma decisão e não um esquecimento: se um dia ele for ligado à resolução, aquela linha é o lugar
onde isso aparece. Um pacote
só para os quatro módulos, e isso não é detalhe: bundles separados levariam cada um a sua cópia do
estado do `acaso.ts`, e o teste passaria medindo módulos que não conversam.

#### 3.2 · `test-etapa0.mjs`, no navegador, por `npm run etapa0`

Dirige o Edge sobre a bancada (`astro.bancada.mjs`, com o mock de Supabase), rola a iniciativa e anda
seis Ticks. **17 asserções, todas passando**, duas delas sobre o `erros` e o `descartados`. É ele que prova o que o outro não alcança: que o
**caminho da URL** chega até o módulo, e que o **despejo** sai com a forma certa.

| O que ele prova | Como |
|---|---|
| o despejo existe e tem forma | um registro por Tick, 12 peças, e cada peça com id, fase, Defesa perdida e posição |
| **a mesma semente repete** | duas cargas da mesma cena com `?semente=1234`: a assinatura de acaso bate, e o despejo inteiro dos seis Ticks é **idêntico campo por campo** |
| **sementes diferentes divergem** | `?semente=99` dá outra sequência. Sem isto, o item acima estaria provando só que a página é determinística por não rolar nada |
| **a mesa de produção não muda** | sem `?semente=`, `semeado()` é `false` e duas cargas dão sequências **diferentes** |

**Uma armadilha que o próprio teste pegou, e vale registrar.** A primeira versão andava seis Ticks
sem rolar a iniciativa, e nessa cena **o motor não toca em dado nenhum**: o avanço de Tick é pura
aritmética de agenda. As duas execuções saíam idênticas com semente, sem semente e com sementes
diferentes, e o teste teria passado provando nada. Rolar a iniciativa antes de andar é o que faz a
cena tocar no acaso. É a mesma lição do **contador de ocasiões** da P §2.6, encontrada de outro lado:
um zero sem ocasião não é um zero.

**E as esperas fixas saíram do teste do navegador**, o que era o mesmo erro que a R3 §5.1 já tinha
diagnosticado na suíte antiga (`await espera(650)`, lido depois pela R1 §9.2 como se fosse o custo do
avanço). A primeira versão dormia 120 ms depois de cada clique: folga nesta máquina, e nenhuma numa
mais lenta ou numa cena maior. No dia em que um clique caísse antes de o avanço anterior terminar, o
teste falharia **parecendo não determinismo**, e alguém culparia a semente. Agora ele espera o
`#ini-tk` mudar de valor, com sondagem de 16 ms, que é o que a R3 §5.1 especificou.

**O que as duas provas juntas NÃO cobrem, e fica escrito:** nenhuma cena de teste **declara ataque,
resolve golpe ou conjura**. O `rolarExpr` e o `rolar` das Artes são exercitados em Node, isolados, e
não pelo caminho que a mesa percorre de verdade. Provar a semente **dentro de uma resolução** exige
comparar dano entre duas execuções, e isso exige o despejo da resolução, que é o buraco da §2.3.
As duas coisas se destravam juntas.

**O resto continua verde:** `npm run validate` inteiro (agora com o `test-acaso.mjs` dentro),
`npm run build`, e as **45 asserções** do `test-grid-simultaneo.mjs`, que é a suíte que dirige o Grid
no navegador.

---

## 3.3 · Duas coisas que a fonte global obriga

**Uma restrição de paralelismo, escrita na P §0.8.7.** O `acaso.ts` guarda a fonte num `let` de
módulo, que é o certo para a página e é uma armadilha para o harness: com `worker_threads` ou
`Promise.all` **no mesmo processo**, duas batalhas dividem a mesma fonte, consomem a sequência
intercalada e o determinismo por batalha morre **em silêncio**, sem erro e sem teste vermelho. A
decisão de paralelismo (um processo por faixa de índices) já estava certa; o que faltava era dizer
**por que a outra forma não é uma alternativa**. E o motor do harness recebe a própria fonte como
parâmetro, em vez de usar o global: o `semear()` do módulo é o caminho da **página**.

**E a proposta dos cinco fluxos por rótulo caiu** (P §2.4, decidido em 02/09). Ela existia para que
uma rolagem a mais não deslocasse todas as seguintes num A/B. O argumento é verdadeiro, e o efeito é
menor do que parecia: com um fluxo só, as duas execuções viram **amostras independentes** da mesma
distribuição, o que **custa precisão e não correção**. Fica um fluxo, e a limitação vai escrita junto
de cada comparação de bandeira: os deltas de E5 são **não pareados**.

---

## 3.4 · A ordem da Etapa 1, e o que o despejo da resolução obriga

**DECIDIDO em 02/09: o despejo da resolução é o item 1.1**, depois do carimbo do perfil (1.0) e antes
da primeira bandeira. O motivo não é conforto: ele já é pré-requisito de três coisas (o espelho de
motor, o item 6 do N6 e a prova da semente dentro de uma resolução), e **`margem` e `gate` são as
duas bandeiras que mais mexem em dano**, ou seja entrar com ressalva seria pagar o pior caso do F0
com as piores candidatas.

**A pergunta que sobrava: antecipá-lo obriga a antecipar parte do N6?** Olhando o código, a resposta
é **não obriga o comportamento, e obriga o levantamento**.

**O que ele NÃO obriga.** O retrato do N6 é uma decisão sobre **de onde** a fase 3 lê. O despejo é
sobre **o que ela leu**. Registrar o número que a folha usou não exige que ele venha de um retrato,
não exige as três fases (N5), e não exige N1 a N4. O despejo grava o que existe; o N6 muda o que
passa a existir.

**O que ele obriga, e é a metade útil.** Hoje os números da resolução nascem e morrem dentro de
`folhaDaAcao` (`grid.astro:7526`), espalhados por funções de pintura que escrevem `innerHTML` e não
guardam nada:

| Número | Onde nasce hoje |
|---|---|
| o ferimento do alvo (`fer`) | L7541, `tierDe(alvo.pv_atual, alvo.pv_max).penDefesa`, lido ao vivo quando a caixa abre |
| o ferimento do atacante | L7727, o mesmo, do outro lado |
| `errouPor` e o veredito | L7768-7769, dentro de `pintarConta`, que só pinta |
| Absorção e dano líquido | L7796-7798, dentro de `pintarDano`, que também só pinta |
| a Vida aplicada | `baixarVida` (L8151), que é o único ponto de estrangulamento de verdade |

Para o despejo existir é preciso **um objeto do lance**, montado dentro da folha, que essas funções
alimentem em vez de só pintar, e que seja descarregado quando o mestre aperta um dos três botões. E
montar esse objeto exige **enumerar toda leitura de estado ao vivo que a folha faz**, que é
exatamente o levantamento que o item 6 (N6) precisa fazer antes de trocar a fonte delas.

**Então a antecipação é de esforço, não de comportamento:** o 1.1 entrega ao item 6 a lista pronta
dos pontos de leitura (as três da especificação: ferimento, Pressão e posição, mais o ferimento do
atacante, que a especificação não listava e o código tem). O N6 continua inteiro na Etapa 2, e fica
mais barato.

**Um efeito colateral que vale registrar:** com o objeto do lance existindo, `baixarVida` deixa de
ser o único ponto onde a resolução é observável, e passa a haver um lugar único onde ela é
**descrita**. Isso é o que o `aid` do D2 vai precisar quando chegar, e é onde ele nasce.

---

## 4 · O que o espelho de inércia já consegue provar

O espelho de inércia (D4) compara a mesa de hoje com a da branch congelada, sob a mesma semente, e
falha se qualquer campo divergir em qualquer Tick. **Com a Etapa 0 pronta, ele já é executável**, e
consegue provar:

| Consegue provar hoje | Com que material |
|---|---|
| que uma mudança **não mexeu na agenda**: golpes, `livre`, `desde`, `tipo`, Pressão | os campos de `acao` no despejo |
| que **não mexeu no tempo**: a fase de cada peça em cada Tick, e a Defesa perdida | `fase` e `defesaPerdida` |
| que **não mexeu na geometria**: a posição de cada peça ao fim de cada Tick, e o Tick em que cada trajeto encerrou | `q`, `r`, `chegada` |
| que **não mexeu nas rolagens**: a iniciativa de todo mundo, que é o primeiro número rolado da cena | `ini`, sob semente fixa |
| que **não mexeu na fila** | `fila`, a ordem em que as peças saem de `naFila()` |

**O que ele ainda não consegue provar, e é o mesmo buraco da §2.3:** que uma mudança não mexeu no
**dano**. Veredito, Absorção e dano líquido não estão no despejo porque só existem dentro do modal da
folha. Enquanto isso não entrar, o espelho prova que a mesa **conta** igual e não prova que ela
**resolve** igual.

Isso tem uma consequência prática na Etapa 1 que vale dizer agora, porque muda a ordem de entrada das
bandeiras: **as bandeiras que só mexem em dano (`margem`, `gate`) não têm prova de inércia completa
até o despejo da resolução existir.** As que mexem em Defesa, agenda ou tempo (`bloqueio`, `teto6`,
`porte`) já têm. Ou o despejo da resolução sobe antes delas, ou elas entram com a ressalva escrita.
**É a única coisa que a Etapa 0 descobriu e que a Etapa 1 vai ter de resolver.**
