# Respostas · quarta rodada sobre o `02-projeto-harness.md`

Sobre o commit `3d2807f`. Nada foi implementado nesta tarefa: nenhuma linha de código, nenhum campo
de `regras.json`, nenhuma migração. As medições novas rodaram em arquivos descartáveis fora do
repositório, e os comandos estão citados onde os números aparecem.

Documentos citados: **R1** = `00-diagnostico.md`, **R2** = `01-diagnostico-carga.md`, **P** =
`02-projeto-harness.md`.

---

## Parte 1 · Contradições do próprio documento

### 1.1 Q6 · extração ou cópia

**As duas versões, e onde estão.** A tabela da §0 registra "cópia, com teste-espelho", que é a sua
resposta. A §2.1 abre com "**Um caminho de código, não dois**" e usa três parágrafos para defender a
extração, tratando a cópia como o caminho que já deu errado uma vez.

**Qual eu defendo: a extração.** O argumento da §2.1 não perdeu força por você ter escolhido a
cópia, e ele é este: `lib-tempo.mjs` é a cópia que já fizemos, e ela discorda da mesa em cinco
pontos hoje (R2 §F#11 a classe de QA, §F#12 o limiar do raspão, §A1 a Margem, o embaralhamento de
Fisher-Yates em `lib-tempo.mjs:458-460`, e a ausência de mapa em §D3), sem que nenhum teste tenha
acusado, porque **cada uma passa nos seus próprios testes**. Divergência entre dois caminhos não é
pega por teste, é pega por comparação, e comparação não estava sendo feita.

**Mas a decisão é sua e está tomada, e o documento tem de parar de discutir.** O que vale é a cópia
com teste-espelho. O que precisa ser reescrito:

| Onde | O que fazer |
|---|---|
| §2.1, o bloco "Como as duas versões não divergem" | trocar a defesa da extração por: "a decisão foi cópia (Q6); a extração fica registrada como a alternativa recusada, e o preço dela é o teste-espelho da §2.1.1" |
| §2.1, a tabela "Extraído de `grid.astro`" | o verbo está errado: as doze peças não são **extraídas**, são **reimplementadas** a partir daquele contrato. A tabela vale como especificação do contrato; o título mente |
| §0.1, o parágrafo "Q6 (cópia) contra D2" | a frase "o teste-espelho só é válido com todas as bandeiras desligadas" **está errada desde a §0.6** (ver abaixo) e precisa cair |

#### 1.1.1 O teste-espelho, especificado

**Sob qual perfil de bandeiras.** A §0.1 dizia "só vale com todas desligadas" porque, quando ela foi
escrita, as bandeiras iam viver só no harness. A §0.6 mudou isso: a mesa passa a ler o mesmo objeto
de perfil. **Com a mesa lendo o perfil, o espelho vale sob qualquer perfil, desde que os dois lados
leiam o mesmo**, e o perfil deixa de ser uma ressalva. Ele roda sob o perfil de produção, e o
`dados_hash` da §2.4 já registra qual era.

**Qual cena.** Uma só, fixa, descrita como dado e não como código: duas peças, ciclo diferente
(espada longa contra montante), distância inicial 18 hexes, campo aberto, mapa 24×16, `?tempo=simultaneo`,
sem Arte. Ela exercita agenda, viagem, re-projeção, passo do Golpe, escada e resolução. Cenas maiores
não acrescentam caminho de código; acrescentam tempo.

**O problema que ninguém tinha nomeado: a mesa não tem semente.** `rolagem.ts:11` é
`Math.floor(Math.random() * 6)`, e com `rolagem: 'site'` (Q9) é a página que rola. Um espelho que
compare dano compara ruído. Duas saídas, e é a **pergunta 3 da Parte 6**:

- comparar só o que é determinístico, e **injetar** o total do acerto pelo campo `al-total`, que a
  folha já aceita digitado; ou
- semear o `d6` da página, o que exige mexer em `rolagem.ts` (um ponto de injeção, que a §2.1 já
  listou como necessário para o harness de qualquer jeito).

**Quais campos são comparados**, por Tick e por peça, na cena fixa:

| Grupo | Campos |
|---|---|
| agenda | `acao.golpes[]`, `acao.livre`, `acao.desde`, `acao.tipo`, `acao.pressao` |
| tempo | a fase de cada peça em cada Tick (`faseEm`), e a Defesa perdida (`defesaPerdida().total`) |
| posição | `(q, r)` de cada peça ao fim de cada Tick, e o Tick em que cada trajeto encerrou |
| re-projeção | por peça: quantas vezes a agenda deslizou, e o par (Tick antes, Tick depois) de cada deslize |
| resolução | dado o mesmo total injetado: `def` efetiva, `errouPor`, veredito, tipo de dano, Absorção aplicada, dano líquido |
| fila | a ordem de declaração e a ordem de resolução do Tick |

**Onde roda.** Não em `npm run validate`, que é o portão rápido e roda em segundos: o espelho precisa
do Edge dirigido e do mock, então mora ao lado de `test-grid-simultaneo.mjs` (a suíte inteira leva
~40 s hoje). Chamado por `npm run smoke`, e não pelo `build`.

**O que falha.** Qualquer campo da tabela acima diferente entre os dois lados, em qualquer Tick, com
a mensagem dizendo o Tick, a peça, o campo, o valor de cada lado. Sem tolerância: todos os campos
comparados são inteiros ou listas de inteiros. **NÃO SEI** se o `build` deve quebrar por isso, porque
o espelho não roda no `build` hoje e mover a suíte do navegador para dentro dele é outra decisão.

### 1.2 A grade · 60 ou 72

**Vale a da §0.5: 60 células.** A §3 foi escrita antes das respostas e usa `E1(4) × E2(3) × E3(3) ×
E4(2) = 72`, com E2 em três níveis. As respostas mudaram duas coisas: E2 passou a quatro níveis
(§0.48, `1 · 18 · 42 · 71` hexes) e o desenho deixou de ser fatorial puro, virando núcleo cruzado
`E1 × E2 × E3` (48) mais um fator de cada vez (8) mais quatro cruzamentos deliberados (4).

**A justificativa estatística sobrevive inteira**, porque ela não depende do número de células: as
500 repetições saem de `n ≈ (1,96 · CV / 0,05)²` com CV assumido de 0,5, e as 2.000 da regra de ter
~20 observações acima do quantil. As duas valem por célula, qualquer que seja o número delas. (O CV
de 0,5 é assumido e não medido, e é o assunto da Parte 4.1.)

**As previsões também sobrevivem**, com uma ressalva que ninguém tinha visto e que está na Parte 4.3:
a previsão de E1 diz quantas colisões cabem "numa batalha de 37 a 47 Ticks", e esses 37 a 47 vieram
da R2 §D1, que mediu `lib-tempo.mjs` no preset `REGRAS_PGR`, **em outro sistema de tempo e sem mapa**.
A previsão qualitativa (uníssono colide sempre, coprimo quase nunca) não depende disso; a previsão
quantitativa depende, e não tem base medida.

**O que reescrever:** a §3 ganha, no alto, a nota de que a grade valendo é a da §0.5, e a linha "72
células / 36.000 batalhas" sai. O resto da §3 fica.

### 1.3 E6 · cinco ou seis políticas

**Seis**, e a §0.4 P4 é que está desatualizada. Ela lista cinco (Agressivo, Cauteloso, Tocaiador,
Guarda-costas, Conjurador) e fecha com "Isso faz E6 ter 5 níveis, e não 4"; depois a §0.47 acrescentou
a **cega** e a §0.5 já conta seis. A frase de P4 é anterior à §0.47 e tem de ser trocada por um
ponteiro para lá. (E a §1.4 abaixo pode mudar esse número de novo, para cinco, por outro motivo.)

### 1.4 A política cega é a mesma coisa que a Agressiva

**A contradição é real.** A §0.47 define o Agressivo como quem "ignora: ataca o mais próximo de
qualquer jeito", e três parágrafos depois propõe medir N7 "pela diferença entre ela e a Agressiva com
leitura". Se o Agressivo ignora, não existe "Agressiva com leitura", e a diferença é zero por
construção.

**Como fica, e é o que eu defendo: "cego" deixa de ser uma política e vira um interruptor aplicável
a qualquer uma delas.** Três razões:

1. Como sexta política, ela só mede o valor da informação **para o comportamento agressivo**, que é
   justamente o perfil que menos tem o que fazer com informação: quem ataca sempre o mais próximo
   não tem decisão a mudar.
2. Como interruptor, a mesma comparação vale para o Cauteloso, o Tocaiador e o Guarda-costas, que
   são os três cujas regras da §0.47 de fato leem alguma coisa. É onde o efeito, se existir, aparece.
3. Isolar informação de comportamento é o que permite dizer "quanto vale ver" em vez de "quanto vale
   ser cauteloso e ver ao mesmo tempo".

**O que muda:** E6 volta a **cinco** níveis, e entra um eixo binário novo, **E9 · leitura** (lê as
declarações do Tick, ou não). No desenho de um-fator-de-cada-vez ele custa **uma célula**, não uma
multiplicação. A §0.47 precisa perder a frase da política cega e a §0.5 precisa da linha do E9. E o
Agressivo, para o E9 fazer sentido nele também, ganha uma regra de leitura na §0.4 P4: *"se o inimigo
mais próximo já tem golpe declarado de outro aliado caindo neste Tick, escolhe o segundo mais
próximo"*.

---

## Parte 2 · O preço de preservar a linha de base

### 2.1 N1 a N6, uma a uma, atrás de bandeira

| Regra | O que a bandeira liga/desliga | Arquivos e linhas | Custo |
|---|---|---|---|
| **N1** | `inicio = tickDecl + k`, com `k` 0 ou 1 | `regras.json → combate.simultaneo.decideEmValeDepois`; `combate-tempo.ts:778` (`decideEmValeDepois()`); `agendaSimultanea` L794-806; `grid.astro:4918` (a guarda do passo) | **já é um parâmetro.** Não precisa de bandeira nova: o valor já vem do JSON e já é lido por uma função. Ligar e desligar é trocar 0 por 1. É o mais barato dos seis, por larga margem |
| **N2** | a guarda de declaração olha `acao.desde < t` ou `golpe <= t` | `grid.astro:4118-4119`, dentro de `grupoDaVez` | **predicado único** |
| **N3** | `golpeMaisCedo` pula quem está no chão sempre, ou só para golpe futuro | `grid.astro:4163-4170` | **predicado único** |
| **N4** | a fila de declaração usa `ordemDeDeclaracao` ou a ordem de hoje (`ordemDaFila`, ou a escolha livre do mestre) | `combate-tempo.ts:399-404` mais a função nova; `grid.astro`, a coluna da vez | **comparador** |
| **N5** | o laço faz "declara tudo, depois resolve tudo" ou intercala | `grid.astro`, o avanço e a resolução dos cartões | **mudança de ordem no laço**, e é a única que **não isola bem**. Ver abaixo |
| **N6** | as leituras de ferimento, Pressão e posição vêm do retrato ou do estado ao vivo | `grid.astro:7435` (o `fer`), L7465 (a Pressão via `acaoAlvo`), L7478-7479 (a distância); mais L7200-7205, onde a Pressão é escrita na declaração | **predicado único, em três pontos de leitura.** O retrato é construído sempre; só a leitura é chaveada |

**Por que N5 não isola.** Uma bandeira precisa de dois estados definidos, e o estado "desligado" de N5
**não é um comportamento, é a ausência de uma regra**. Hoje o mestre declara e resolve na ordem que
quiser, entre avanços; não há laço a inverter. Para medir "o que N5 comprou" seria preciso inventar
um substituto (por exemplo: resolve na ordem da fila, intercalando declaração e resolução), e aí o
número mede a distância até uma invenção minha, não até o Grid de hoje. As outras cinco não têm esse
problema: para cada uma, o estado desligado é literalmente o que o código faz hoje.

**Uma dependência entre bandeiras, que muda o desenho de 2.2.** Com **N1 desligada** (`inicio = T+1`),
nenhum golpe vence no Tick da declaração, e o predicado de **N2 nunca dispara**: a bandeira de N2 vira
inócua. N2 só é observável com N1 ligada. Nenhuma das outras tem dependência: N3, N4 e N6 valem nos
dois estados de N1.

### 2.2 O que isso faz com E5 e com a grade

**E5 não vira 2⁶ níveis.** Cruzar as seis com as nove de D2 dá 2¹⁵ = 32.768 perfis, o que não é uma
grade, é um enunciado. O desenho que responde "o que cada regra comprou" sem cruzar tudo com tudo é o
**deixe-uma-de-fora** (*leave-one-out*): parte-se do perfil cheio e desliga-se uma bandeira por vez.

| Perfil | Quantos | O que cada comparação responde |
|---|---:|---|
| cheio (as 15 ligadas) | 1 | a referência |
| cheio menos uma, uma por bandeira | 15 | "o que **esta** regra comprou", isolada |
| tudo desligado | 1 | "o que as quinze compraram juntas", que é a linha de base |
| **total** | **17** | |

Três coisas boas nesse desenho: ele custa **17 níveis num eixo só**, e no arranjo de
um-fator-de-cada-vez da §0.5 isso são **16 células a mais**, não uma multiplicação; ele respeita a
dependência de 2.1 sozinho, porque desligar N2 a partir do perfil cheio mantém N1 ligada, que é a
única configuração em que N2 é observável; e ele mede efeito principal, que é o que a pergunta "o que
cada regra comprou" quer, e não interação, que ele não vê.

**Tamanho da grade.** Hoje E5 contribui com 1 célula no arranjo de um fator de cada vez. Com 17
níveis contribui com 16. A grade de 60 células da §0.5 vai para **75**, e com o eixo E9 da §1.4 para
**76**. A 500 repetições, **38.000 batalhas**. Pela Parte 4.2, isso continua sendo minutos de máquina.

**O que o deixe-uma-de-fora não responde:** interação entre regras. Se a Margem e o gate se
cancelarem, ou se o Bloqueio só importar com a Couraça ligada, este desenho não vê. Ver interação
custa cruzar os pares, que são 105 para 15 bandeiras.

### 2.3 N7 e N8 · o que o harness mede deles

**Quase nada, e o pouco que mede é circular.**

O que ele consegue produzir é a diferença de resultado entre uma política que lê as declarações do
Tick e a mesma política cega (o eixo E9 da §1.4). Esse número existe e é calculável. O problema é o
que ele significa: **política é código, e ela lê o que eu deixei escrito nas regras dela.** Se eu
escrever uma regra de leitura boa, N7 parece valioso; se eu escrever uma ruim, parece inútil. O
número mede a qualidade das cinco regras de leitura da §0.47, não o valor da informação para uma
pessoa. Um jogador humano vê coisas que nenhuma dessas regras codifica: que o inimigo está juntando
gente num canto, que o companheiro vai morrer, que o padrão de dois Ticks atrás vai se repetir.

E de N8 especificamente (o rastro no tabuleiro) o harness mede **zero**: ele é desenho de tela, e o
harness não tem tela.

**Por que a §4 não os lista.** Porque a §4 foi escrita na terceira rodada, antes de N7 e N8 existirem:
elas foram decididas depois, nas §0.47 e §0.48. Não é omissão de julgamento, é ordem de escrita, e a
§4 precisa de duas linhas novas:

| O que | Entra? | O instrumento |
|---|---|---|
| **o valor da informação de N7 para uma pessoa** | fora | teste de mesa (abaixo). O harness dá só o valor dela para as minhas cinco regras de leitura |
| **a legibilidade do rastro de N8** | fora | teste de mesa; nenhum instrumento de código |

**O que mediria, concretamente.** Uma sessão de mesa com o Grid, combate com 4 a 6 peças, e três
contagens feitas por quem observa:

1. **quantas vezes um declarante tardio muda de escolha depois de ver** o que já foi declarado (a
   proporção de declarações "informadas"). É o número que diz se N7 tem efeito nenhum;
2. **quanto dura a fase de declaração**, com a fila ordenada na tela e sem ela. É o número que diz se
   N4 custou tempo ao mestre;
3. **quantas vezes o mestre reordena a fila à mão**, que é a válvula da §0.49 sendo usada.

**Quantas sessões: NÃO SEI, e digo por quê.** O tamanho da amostra sai do tamanho do efeito, e não há
medida nenhuma de quão frequente é uma declaração informada. Se for algo como uma em quatro, umas 60
declarações observadas dão um intervalo de confiança de ±11 pontos, e um combate de 5 peças por 8
Ticks já produz por volta de 40 declarações: uma ou duas sessões. Se o efeito for raro, uma em vinte,
o mesmo intervalo exige centenas. **A primeira sessão é o piloto que dimensiona as outras**, e é a
mesma lógica da célula piloto da Parte 4.1.

### 2.4 DECISÃO SUA · as duas rotas

Não escolho, e não indico preferência. As duas, com o que cada uma custa e o que perde.

#### Rota A · a bateria primeiro, N1 a N8 depois

**Como é.** O harness é escrito contra o Grid como ele está hoje, roda a primeira bateria completa, e
só então as oito regras entram na mesa. A segunda bateria, depois, mede o jogo novo.

| | |
|---|---|
| **Custa** | duas baterias em vez de uma, e duas escritas do harness: a resolução copiada tem de acompanhar a mesa nos dois estados, o que dobra a superfície do teste-espelho da §1.1.1 |
| **Custa** | o harness fica pronto contra um alvo que vai mudar em oito pontos, e seis deles (N1 a N6) mexem no laço, que é o coração dele. Não é ajuste de parâmetro: N5 muda a forma do Tick |
| **Perde** | tempo de calendário entre a primeira medição e as regras entrarem na mesa que está rodando, com o que a R2 chamou de furos abertos (a Margem que não entra no dano, o escudo que só penaliza) continuando abertos |
| **Perde** | nada da linha de base: ela é medida de verdade, no jogo que existe hoje, com os mesmos instrumentos da segunda |
| **Ganha** | a comparação mais limpa possível, porque os dois lados são medidos, e nenhum é reconstruído por bandeira |
| **Ressalva** | a linha de base assim medida inclui as paradas que travam a cena (R2 §B: as #2 e #12 congelam o relógio). Medir a carga do Grid de hoje **exige** que a política responda a essas paradas, e nesse ponto a linha de base já não é o Grid de hoje, é o Grid de hoje com um mestre que nunca desiste de uma caixa |

#### Rota B · as seis atrás de bandeira, uma bateria mede os dois lados

**Como é.** N1 a N6 entram na mesa já chaveadas, somando-se às nove de D2. Uma bateria só, com o
desenho deixe-uma-de-fora de 2.2, mede o perfil cheio e cada regra isolada, e o perfil "tudo
desligado" é a linha de base reconstruída.

| | |
|---|---|
| **Custa** | 15 bandeiras vivas no código de produção, cada uma um caminho que alguém pode ler errado, e todas com de ser removidas um dia. Cinco delas (N2, N3, N4, N6 e as de D2) são baratas; a de N5 não |
| **Custa** | 16 células a mais na grade (75 no total), o que pela Parte 4.2 é irrelevante em máquina e não é irrelevante em leitura |
| **Perde** | **N5 não tem estado desligado observável** (2.1). O "sem N5" da bateria seria uma invenção minha, e o número dela mediria a distância até essa invenção. Se você quiser a linha de base completa por bandeira, N5 fica de fora dela de qualquer jeito |
| **Perde** | a linha de base deixa de ser uma medição e passa a ser uma **reconstrução**: o perfil tudo-desligado roda no motor novo com as regras novas apagadas, e não no motor antigo. Isso é diferente, e a diferença é invisível se algum efeito colateral de N1 a N6 não estiver atrás da bandeira |
| **Ganha** | uma bateria só, e cada regra com o seu próprio número, isolado, em vez de um pacote de oito medido em bloco |
| **Ganha** | as regras entram na mesa agora, e os furos da R2 fecham antes da primeira medição |

---

## Parte 3 · O que valida o harness

### 3.1 Os invariantes

Cada um: o que afirma, onde no laço é conferido (pelos passos da §2.2 do P), e se o código de hoje
já poderia violá-lo. Violação **aborta a batalha** e a marca; não corrige, não continua.

| # | Invariante | Onde é conferido | O Grid de hoje viola? |
|---|---|---|---|
| **V1** | `0 ≤ pv ≤ pv_max` para toda peça com `pv_max`, em todo instante | fim de cada aplicação de dano e de cura (passos 5 e 7) | **não.** `baixarVida` corta em zero (`grid.astro:8050`, `Math.max(0, antes − quanto)`) e `curar` corta no teto (L8110, `Math.min(c.pv_max ?? …, antesPv + q)`). Quem não tem `pv_max` fica fora do invariante, e é o figurante de cena |
| **V2** | `0 ≤ dano líquido ≤ dano bruto`, e no raspão `líquido = danoQA` sem Absorção | dentro da resolução, antes de aplicar (passo 5) | **não.** `aplicarDano` faz `Math.max(0, bruto − s)` (L8084), e o raspão passa por `opts.raspao` que zera o `s` (L8082) |
| **V3** | peça no chão **não declara** | passo 4, ao montar a fila de declaração | **não**, e a redação importa: `grupoDaVez` filtra `!noChao` (L4123) e `decidirAutomaticas` usa `emPe` (L5019). Note que o invariante é "não declara", e **não** "não age": N3 permite de propósito que quem caiu resolva um golpe já vencido |
| **V4** | um golpe agendado resolve **no máximo uma vez**: o par (peça, Tick do golpe) sai de `aResolver` e não volta | passo 5, na entrada e na saída de cada resolução | **provavelmente não, e há um NÃO SEI.** `resolverGolpeNoAr` guarda com `if (!acao \|\| !golpesNoAr(acao).includes(tick)) return` (L7057-7058), e a folha é modal, o que fecha o caminho do clique duplo. **NÃO SEI** se a repintura vinda do tempo real (`mesa-tempo-real.ts`) pode reentrar enquanto o `await folhaDaAcao` está pendente; é o mesmo NÃO SEI que a R2 §B registrou no ponto 1 |
| **V5** | um golpe resolve com `distanciaHex(atacante, alvo) ≤ alcanceDaPeca(atacante)` | passo 5, antes de comparar total e Defesa | **VIOLA, de propósito.** A folha escreve o aviso de fora de alcance e **não impede** (`grid.astro:7565-7567`; R2 §C2, linha "Alcance no corpo a corpo: sim, como aviso, não impede"). É o único da lista que o Grid quebra por decisão de desenho, e é a **pergunta 4 da Parte 6** |
| **V6** | duas peças nunca ocupam o mesmo `(q, r)`, salvo `podeDividir` | fim do passo 2 (movimento) e de qualquer teleporte | **pode violar.** O passo respeita o veto, mas o "pôr direto" e o arrasto que teleporta escrevem posição sem consultar `ocupadoPor`. E o veto frouxo do conserto de 02/09 (`grid.astro:4959-4967`) veta **só a casa exata** nesse caminho, que é exatamente o que este invariante afirma, então o passo está coberto e a colocação à mão não está |
| **V7** | toda ação não vazia tem `livre > tick corrente` e `livre ≥ max(golpes)`; e nenhuma ação fica viva além do teto de segurança de 2.000 Ticks | fim de cada Tick (passo 7) | **não viola a forma**, mas **`livre` não tem teto**: `reprojetarAgenda` desliza a agenda indefinidamente enquanto a perseguição não fecha (`combate-tempo.ts:826-828`, sem teto por decisão). O invariante correto afirma a **forma**, e o deslize vira contador, não violação |
| **V8** | toda condição tem `id` existente em `condicoes.json`, e toda condição com `porArte` aponta para um efeito vivo | fim de cada Tick (passo 8) | **pode violar.** Quem tira condição posta por Arte é só `encerrarEfeito → tirarCondicao` (`artes-grid-mesa.ts:1512-1516`); se a linha do efeito sumir por outro caminho, a condição fica órfã. E o `ate` **nunca é lido** (R2 §C4), então nada varre |
| **V9** | o Tick não anda enquanto houver golpe devido | entrada do passo 1 | **não.** É o `if (instanteDeGolpe()) return` de `avancarTickSimultaneo` (L4903), e o botão já chega desligado (L4324-4326) |
| **V10** | a agenda re-projetada **só atrasa**: `golpe_depois ≥ golpe_antes` | passo 3, a cada re-projeção | **não.** `reprojetarAgenda` devolve `null` quando `atraso <= 0` (`combate-tempo.ts:843-844`), e é a decisão de 02/09 |
| **V11** | o relógio anda exatamente 1 por avanço | passo 1 | **não.** `const T = tickSim() + 1` (L4904). O teste dirigido já afirma isso (`test-grid-simultaneo.mjs`, "o relógio anda um Tick por clique, nunca pula") |
| **V12** | **(só com N6)** toda resolução de um mesmo Tick leu a mesma versão do retrato | passo 5, comparando o carimbo do retrato lido | não se aplica: o retrato não existe hoje |
| **V13** | nenhuma peça declara duas vezes no mesmo Tick | passo 4 | **não**, por construção: quem declara recebe `tick = livre` e sai de `grupoDaVez`, que filtra `(c.tick ?? 0) <= t` |

### 3.2 O que o Grid de hoje já violaria, e como eu sei

Três, e as três com evidência diferente:

- **V5, alcance.** Sei por leitura direta: `grid.astro:7565-7567` monta a frase de aviso, e não há
  `return` nem desabilitação do botão de veredito no caminho. A R2 §C2 já tinha registrado como
  "exibe, não impede".
- **V6, casa ocupada, no caminho da colocação à mão.** Sei por leitura: `ocupadoPor` é consultado
  dentro de `caminharHex` (o `evita` de L4956) e no arrasto, e `porNoMapa` (L5895 em diante) grava a
  posição. **NÃO SEI** se todo caminho de colocação passa por uma checagem; não segui os cinco
  chamadores.
- **V8, condição órfã.** Sei por varredura: a R2 §C4 registrou que **não há nenhum leitor de `ate` em
  todo o `src/`**, e o único removedor é o fim do efeito que pôs. Basta o efeito sair por outro
  caminho para a condição sobrar.

Os outros dez eu **não** vi violados, e a diferença entre "não vi violado" e "não viola" é o motivo de
eles existirem como asserção em vez de comentário.

### 3.3 Como um invariante violado aparece no relatório

Três regras, e a terceira é a que importa:

1. **Baldes separados.** A batalha que viola sai marcada `abortada`, com o invariante, o Tick, as
   peças envolvidas e a semente, e **não entra em média, distribuição, quantil ou proporção nenhuma**.
   É o mesmo tratamento do balde `estourou` da §0.1, e por isso os dois têm nomes diferentes:
   `estourou` é o harness desistindo do tempo, `abortada` é o harness se acusando.
2. **Um arquivo próprio.** `invariantes.jsonl`, uma linha por violação, com a semente que a reproduz.
   A §2.4 do P já garante que a semente sozinha refaz a batalha.
3. **No alto do relatório, e não em nota de rodapé.** O relatório abre com a contagem de abortadas por
   invariante, antes de qualquer tabela de jogo. E a regra dura: **se qualquer invariante disparou uma
   vez que seja, o relatório diz isso na primeira linha e trata todos os números como suspeitos**, em
   vez de descontar as abortadas e seguir. Uma violação não é uma batalha estranha, é a prova de que o
   motor pode estar errado nas outras 29.999, que não dispararam por sorte.

---

## Parte 4 · Os números assumidos

### 4.1 A célula piloto que mede o CV

**A configuração.** A **célula-âncora**, que é a mesma de que penduram todas as comparações de
um-fator-de-cada-vez: 3×3 peças, E1 uníssono, E2 na distância média (18 hexes), campo aberto, política
Agressiva, perfil de bandeiras cheio. Duas razões para ser ela e não outra: é a que mais aparece na
grade, e um CV medido nela vale para as 48 células do núcleo cruzado, que compartilham a mesma
estrutura.

**Quantas batalhas: 2.000.** O erro relativo da estimativa do próprio CV é da ordem de `1/√(2n)`, o
que dá ±1,6% com 2.000, e sobra amostra para uma primeira leitura do p95 (a regra dos 20 acima do
quantil pede 400).

**A quantidade cujo CV se mede** é a métrica principal, "paradas do mestre por batalha", e não a
duração. Elas são correlacionadas e não são a mesma coisa, e é a primeira que dimensiona o n.

**A regra de decisão**, escrita antes de rodar:

1. `n = teto( (1,96 × CV / 0,05)² )`, arredondado para a centena de cima.
2. Piso de 400, que é a regra do p95, mesmo que o CV medido dê menos.
3. Rodar o mesmo piloto, com 500 batalhas cada, em **duas células extremas**: uníssono com horda
   (E1a × E3 horda) e o alvo mais rápido (E4 assimétrico). Se o maior CV das três exceder o da
   âncora em mais de 0,15, **usa-se o maior para todas as células**, porque n desigual entre células
   desequilibra a comparação que é o objetivo da grade.
4. O piloto roda **depois** de N1 a N8 estarem no motor, quaisquer que sejam as rotas da 2.4: a
   duração muda com N1 e com as bandeiras, e um CV medido antes descreve outro jogo.

### 4.2 O custo de `caminharHex`, medido

Comando, na raiz, com `esbuild` empacotando `src/lib/hex.ts` para `.mjs` e cronometrando com
`process.hrtime.bigint()`, 100 a 200 mil repetições por linha, cenário de perseguição a 20 hexes com
passo de corrida (6 hexes por Tick):

| O que | µs por chamada |
|---|---:|
| `distanciaHex` | **0,007** |
| `alemDe` | 0,012 |
| `caminharHex`, 3 passos (deslocamento de batalha), veto por casa exata | 1,72 |
| `caminharHex`, 6 passos (corrida), sem veto | 3,16 |
| `caminharHex`, 6 passos, veto por casa exata | 3,05 |
| `caminharHex`, 6 passos, veto por círculo (2 peças de raio) | 3,66 |
| `caminharHex`, 6 passos, **veto no formato do `ocupadoPor` de hoje**, 6 peças | **8,56** |
| idem, 12 peças | **15,45** |
| idem, 24 peças | **52,38** |

**O que os três últimos mostram.** `ocupadoPor` (`grid.astro:5880-5892`) faz
`Object.entries(TOKENS).some(...)` com um `COMBS.find(...)` **dentro**, ou seja, é O(peças²) por
chamada; e `caminharHex` chama o veto até 6 vezes por passo, 6 passos, 36 vezes por caminhada. O
resultado é o crescimento superlinear da tabela: **de 6 para 24 peças o custo do mesmo passo sobe
6,1×**.

**Quanto muda a estimativa da grade.** A R2 §D1 mediu a bancada em 2,00 µs por Tick numa refrega 3×3
(0,334 µs por peça por Tick). Uma peça em perseguição custa 8,56 µs de caminhada com 6 peças em cena:
**o passo no hexágono sozinho é 4,3× o custo de tudo o que a bancada faz naquele Tick**. Supondo que
30% dos pares peça×Tick tenham caminhada (a refrega da R2 dura 46,7 Ticks e a viagem ocupa os
primeiros), uma refrega 3×3 passa de 93,5 µs para algo em torno de **820 µs**, ou **8,8× a bancada**.
Para a grade de 76 células a 500 repetições (38.000 batalhas), isso é da ordem de **30 segundos** num
processo. **A conclusão da R2 §D2 não muda: a máquina não é a restrição.**

**E um achado que cai de graça:** se a `ocupacao` reimplementada trocar o `COMBS.find` por um `Map`
montado uma vez por Tick, o custo volta para os 3,0 a 3,7 µs das linhas de cima, e o multiplicador cai
de 8,8× para cerca de 2,5×. É a diferença entre copiar o `ocupadoPor` como está e copiar o que ele
quer dizer.

### 4.3 O que herdou a régua antiga

Varri o P inteiro atrás de conta que dependa de `decideEmValeDepois = 1`. Quatro achados, e o segundo
é o que mais importa.

**(a) O que já está corrigido e está certo.** A §0.45 registra a "Correção 1" (período `ciclo + 1`) e
diz explicitamente que N1 a remove; a tabela de m.m.c. da §0.4 P6 usa os períodos 4, 5, 6 e 7, que são
os períodos **com N1**, e traz a nota de que vale porque N1 devolveu o período ao ciclo. Consistente.

**(b) As durações de 37 a 47 Ticks são de outro sistema, e o P as usa como se fossem do Simultâneo.**
A R2 §D1 mediu `lib-tempo.mjs` com o preset `REGRAS_PGR`: é o sistema **P/G/R**, não o Simultâneo, e a
bancada não tem mapa, então não tem viagem, nem re-projeção, nem Tick vazio. O P usa esses números em
dois lugares: a previsão de E1 na §3 ("dentro de um combate de 37 a 47 Ticks, pares de ciclos
diferentes colidem uma ou duas vezes") e a estimativa de tamanho do log na §2.5 ("um duelo de 37
Ticks gera 100 a 150 registros"). **Nenhum dos dois tem base medida no Simultâneo**, e N1 não os
corrige, porque o problema não é a régua, é o sistema. A previsão qualitativa de E1 sobrevive; a
quantitativa fica sem número até a célula piloto da 4.1 rodar.

**(c) As oito fontes de sincronia da R2 §H3, revistas uma a uma com N1:**

| Fonte | Sobrevive? |
|---|---|
| "decidir em T vale em T+1, para todos" | **muda de mecanismo e sobrevive de efeito**: com N1 decidir em T vale em T, e quem decide junto continua começando junto. A linha precisa ser reescrita, a conclusão não |
| `grupoDaVez` devolve todos os livres | sobrevive, e **N4 a reforça**: agora há uma ordem prescrita para declarar todo mundo do Tick |
| ciclos iguais por classe (13 das 26 armas com `ticks: 6`) | sobrevive, e fica **mais forte**: com o período de volta ao ciclo, duas armas de ciclo 6 têm período 6 e não 7 |
| o bestiário tem uma classe por criatura | sobrevive |
| entrada por iniciativa em degraus de 6 | sobrevive |
| a fuga do robô com `livre: T + 6` (`grid.astro:5049`) | sobrevive, **com uma ressalva nova**: o 6 ali é literal, e não `ciclo`. Com N1 a ação de fuga passa a ocupar T até T+5, o que continua dando período 6, mas o número está cravado no código e não segue régua nenhuma |
| `TICKS_POR_TURNO = 6` dos efeitos | sobrevive |
| a re-projeção convergindo perseguidores | sobrevive |

**(d) Uma consequência de N1 que ninguém nomeou, e que é de regra.** Com `inicio = T`, o golpe cai em
`T + max(Preparo, viagem)`. O primeiro passo da peça só pode sair no avanço seguinte à declaração, ou
seja em `T+1`, então depois de `V` passos ela chega **durante** o Tick `T+V`, que é exatamente o Tick
em que o golpe vence. **Quem persegue chega e bate no mesmo Tick.** Com a régua antiga o golpe caía em
`T+1+V`, um Tick depois da chegada. N1 apagou essa folga, e ela não foi discutida em lugar nenhum. É a
**pergunta 2 da Parte 6**.

---

## Parte 5 · O que já dá para rodar hoje

### 5.1 A instrumentação, especificada

**Descoberta que dispensa metade do trabalho: o contador já existe.** `scripts/mesa-mock.mjs:233-234`
mantém `const REG = { log: [] }` e `anotar(tipo, alvo)`, exposto na página como `window.__SB.log`
(L413), e `encadeavel` chama `anotar(verbo, tabela)` em toda consulta que assenta (L346). O cabeçalho
do próprio arquivo diz para que serve: "contar as idas ao banco por ação, que é como se enxerga um
N+1". Não é preciso pôr carimbo nenhum no `grid.astro`.

**Onde entram os carimbos.** Fora da página, no driver: `Date.now()` antes do clique em `#ini-prox` e
`page.waitForFunction` esperando `#ini-tk` mudar de valor, com sondagem de 16 ms. **Isto é o ponto da
especificação que mais muda o número**, e é o erro que a R1 cometeu: a suíte de hoje usa
`await espera(650)` (`test-grid-simultaneo.mjs:169`), que é uma **dormida fixa**, não uma medição, e a
R1 §9.2 leu esses 650 a 750 ms como se fossem o custo do avanço.

**O que se conta.** Por avanço: `window.__SB.log` esvaziado antes do clique e lido depois, separando
`select` (leitura) do resto (escrita), e agrupando por `tipo:tabela`.

**Quantas execuções.** 12 avanços por cena, mediana e p90; cinco tamanhos de cena (2, 6, 12, 24 e 40
peças), o que o mock já aceita por `?bench=N&cols=&rows=`.

**Que número sai no fim.** Dois: **milissegundos por avanço** e **idas ao banco por Tick**, cada um em
função do número de peças e do número de peças em trajeto declarado. É o fator que converte todo Tick
simulado em segundo de mesa (§4 do P, primeira linha).

### 5.2 Os números

Rodado nesta sessão, em dois arquivos descartáveis fora do repositório, com `astro.bancada.mjs`, o
mock, Edge sem cabeça e `?tempo=simultaneo`. Máquina: a mesma das medições da R2.

**Tick vazio** (ninguém declarou; as peças estão paradas):

| Cena | Avanços | ms/avanço (mediana) | ms (p90) | Idas ao banco por Tick | Quais |
|---|---:|---:|---:|---:|---|
| 2 peças | 12 | **33** | 35 | **2,0** | `update:encontros` 1,0 · `broadcast:canal` 1,0 |
| 6 peças | 12 | **30** | 30 | **2,0** | idem |
| 12 peças | 12 | **30** | 39 | **2,0** | idem |
| 24 peças (32×24) | 12 | **30** | 46 | **2,0** | idem |
| 40 peças (40×30) | 12 | **43** | 47 | **2,0** | idem |

**Tick carregado** (peças com ataque e trajeto declarados, cena de 12 peças em 24×16):

| Movedores | Avanços | ms/avanço | Idas/Tick | Quais |
|---:|---:|---:|---:|---|
| 0 | 10 | **30** | **2,0** | `update:encontros` 1,0 · `broadcast:canal` 1,0 |
| 2 | 3 | **46** | **6,7** | `update:mesa_arenas` 2,0 · `upsert:arena_tokens` 1,7 · `update:encontros` 1,0 · `update:combatentes` 1,0 · `broadcast:canal` 1,0 |

**O que os números dizem.**

1. **O avanço vazio custa 30 a 43 ms, e não 650 a 750.** A estimativa da R1 §9.2 ("uma batalha de 37
   Ticks custaria por baixo ~26 s só de avanços; mil delas seriam ~7 horas; a mesma batalha é cerca de
   330 mil vezes mais cara pelo Grid") foi construída sobre a dormida fixa da suíte. **O número certo
   é cerca de 20× menor**: 37 Ticks vazios custam ~1,2 s, não 26 s. A conclusão qualitativa da R1
   (o Grid é ordens de grandeza mais caro que a bancada) continua de pé; o fator não.
2. **O custo do Tick vazio não cresce com o número de peças**, de 2 a 40: são sempre **duas** idas ao
   banco, uma para o relógio (`encontros.tick_atual`) e uma campainha. É o laço `for (const c of naFila())`
   saindo por `if (!mov?.auto ...) continue` (`grid.astro:4915`) em todas as peças paradas.
3. **Cada peça em trajeto custa cerca de 2,3 idas ao banco por Tick**: a diferença entre 2,0 e 6,7
   com dois movedores. Composição: um `upsert` de posição, uma reescrita do registro da arena e, em
   parte dos Ticks, um `update:combatentes` da agenda re-projetada.
4. **A escrita mais cara é a do registro, e ela já é uma pendência conhecida.** `update:mesa_arenas`
   aparece **2,0 vezes por Tick** com dois movedores, uma por linha de log, e o `Pendencias.md` I2
   registra que "o registro da arena ainda é um `jsonb` reescrito inteiro... até uns 45 KB, a cada
   peça movida". Numa cena de 10 perseguidores isso é dez reescritas do array inteiro por Tick.
5. **A fórmula que sai daqui:** `idas por Tick ≈ 2 + 2,3 × (peças em trajeto)`, e
   `ms por avanço ≈ 30 + 8 × (peças em trajeto)`. Extrapolando para dez perseguidores: ~25 idas ao
   banco e ~110 ms por Tick, ou seja **~4 segundos de avanços numa batalha de 37 Ticks**, sem contar
   nenhuma caixa.

**Duas ressalvas que valem tanto quanto os números.** O mock responde da memória: não há rede, não há
Postgres, não há RLS, e o `broadcast` não sai da máquina. Estes números medem **o trabalho da página**,
não a latência do Supabase de verdade, e o segundo é o que o jogador sente. E o Tick carregado foi
medido com **dois** movedores, com três avanços antes de um golpe vencer e desligar o ⏭; a fórmula
acima extrapola linearmente a partir de dois pontos, o que é frágil na ponta de dez.

---

## Parte 6 · Perguntas

**1. O teste-espelho compara dado rolado, ou só o que é determinístico?** (§1.1.1) A mesa não tem
semente: `rolagem.ts:11` é `Math.random`, e com `rolagem: 'site'` é a página que rola. Ou o espelho
injeta o total pelo campo `al-total`, que a folha já aceita digitado, e compara veredito, Absorção e
dano líquido a partir dele; ou `rolagem.ts` ganha um ponto de injeção de semente, que o harness vai
precisar de qualquer forma. A primeira não prova que os dois lados rolam igual; a segunda mexe num
arquivo de produção só para o teste existir.

**2. Quem persegue chega e bate no mesmo Tick: é isso mesmo?** (§4.3d) Com N1, o golpe cai em
`T + max(Preparo, viagem)` e o primeiro passo só sai em `T+1`, então a peça chega durante o Tick em
que o golpe vence. Com a régua antiga havia um Tick de folga entre chegar e bater. Ninguém discutiu
isso, e é diferente de tudo o mais que N1 mudou, porque não é escrituração: é a corrida terminando
em golpe sem respiro.

**3. O invariante V5 vira regra, ou fica só como aviso?** (§3.1) Hoje a folha avisa que o alvo está
fora do alcance e deixa resolver assim mesmo. Numa mesa isso é bom (o mestre sabe de alguma coisa que
o tabuleiro não sabe); numa bateria automatizada é um golpe que acerta a dez metros e ninguém vê. As
saídas são bloquear no Grid, ou manter o aviso na mesa e abortar a batalha no harness, e aí o
harness e a mesa passam a discordar num ponto de regra.

**4. A ordem de declaração de N4 tem de sobreviver a alguém entrar ou sair da cena no meio?** Um
reforço que chega, uma peça que cai e levanta, uma invocação. A chave de N4 (`Raciocínio + Prontidão`)
é da ficha e não muda, então a ordem se recalcula sozinha, mas quem entra no meio de um Tick pode
cair antes ou depois de quem já declarou. Não achei regra escrita para isso em lugar nenhum.

**5. As duas contagens da §5.2 valem para o Supabase de verdade?** Elas medem o trabalho da página
com um banco de mentira na memória. A latência de rede é o que o jogador sente, e é a diferença entre
"110 ms por Tick" e alguma coisa que eu não sei estimar. Se você quiser esse número, ele precisa de
uma mesa real com uma cena de bancada, e é medição de campo, não de suíte.
