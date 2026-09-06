# Estado da frente de simulação do Grid

**Escrito para quem não acompanhou nenhuma rodada.** Quatro seções e nada além
delas. Não é a história de como se chegou aqui: é onde estamos.

Todo número desta página sai de `docs/simulacao/resultados/09-bmtq638zo.txt`, que é
a saída inteira do agregador sobre a bateria `bmtq638zo` (21.600 batalhas, 96
células, zero inválidas, commit `40ee8dd`, árvore limpa). `R:` é linha nele.

**Ela é a REGRAVAÇÃO da `bmtmbdppb`, feita em 06/09/2026 com o `frac` corrigido**, e
a única coisa que a troca mexe são **duas colunas da tabela da fase de FUGA**
(`s/parada` e `s/golpe`), que antes contavam um zero falso onde a fase não
aconteceu. Medido batalha a batalha: das 21.600, **9.830 saem idênticas byte a
byte** e as outras 11.770 diferem **só** nos quatro `fracao*` da fuga, que eram
`0` e viraram `null`. Nenhuma outra célula, contador ou tabela do agregado se
moveu. A `09-bmtmbdppb.txt` fica no disco como a leitura daquele dia.

**O 9.830 tem uma segunda fonte, achada pela revisora na rodada 09, e as duas não se conheciam
quando cada uma foi medida.** A comparação byte a byte (rodando o código de antes e o de depois
lado a lado) e a contagem de `fases.fuga.ticks === 0` na própria `bmtq638zo` (medida numa
passada anterior, para escrever o parágrafo do CONTEXTO, sem olhar a comparação) chegam ao MESMO
número por caminhos que não se citam. **Isto não é a `ticksComGolpe`/`comGolpe` de novo**: ali
era o mesmo contador lido por duas fórmulas algébricas do MESMO arquivo; aqui uma é um diff entre
DOIS COMMITS diferentes (que teria acusado qualquer corrupção em QUALQUER campo, não só nos
quatro da fuga) e a outra é uma contagem sobre um campo só, feita antes e sem saber da primeira.
Reproduz-se sem o código antigo: `fases.fuga.ticks === 0` conta **11.770** de 21.600 na
`bmtq638zo`, e `21.600 − 11.770 = 9.830` é o mesmo número.

**A `bmtq638zo` é POSTERIOR à REGRAVAÇÃO da fuga e ANTERIOR à ENTRADA ESCALONADA**,
ligada em 06/09/2026 (`ticksDeEntrada`, `Pendencias.md` L48): quem rodar o código de
hoje não reproduz mais este arquivo, reproduz o próximo (`bmtq8zam1`). A escada e o
custo de tela abaixo, que são o que este documento mede, continuam vindo daqui,
porque a entrada escalonada não muda nenhum deles de forma que valha regravar a
página inteira — ver o parágrafo a seguir com a medição própria, feita na bateria
nova, sobre o que ela de fato muda.

**O QUE A ENTRADA ESCALONADA MUDOU, medido comparando `bmtq638zo` (sem ela) com
`bmtq8zam1` (com ela), batalha a batalha na mesma semente.** A duração MÉDIA não
se move: 50,499 → 50,492 Ticks nas 19.200 batalhas que terminam nas duas (uma
diferença de −0,007, ruído). **Célula a célula ela se move, e para os dois
lados**: `coprimo-encostado-2x8` vai de 17,2 para 19,1 Ticks; `coprimo-media-2x8`
de 30,4 para 28,1; `coprimo-extrema-3x3` de 52,3 para 53,5. A distribuição das
diferenças POR BATALHA (não por célula) mostra a mesma coisa numa escala maior:
33,9% ficam idênticas, 12,5% mudam por exatamente 1 Tick, e o resto se espalha
de −65 a +65 Ticks, com nós em ±8 e ±16. **Não é ruído aleatório, é sensibilidade
a condição inicial**: atrasar a entrada de uma peça em 1 Tick muda QUEM alcança
QUEM primeiro numa perseguição, e essa mudança se propaga e amplifica pelo resto
da batalha — a mesma dinâmica caótica que já explica por que os eixos "explicam
58× mais que o acaso" e não 100%. O trabalho total do mestre (gestos, fase de
combate) cai de 1.171.957 para 1.166.168 (−0,5%), pequeno mas real, coerente com
a redistribução: entrar em Ticks diferentes espalha o pico de declarações do
Tick 1, e é isso que a coluna `pico` de paradas/Tick também mostra caindo nas
células mais cheias (2×8). O agregado inteiro está em
`docs/simulacao/resultados/09-bmtq8zam1.txt`.

**O resultado é um negativo bem medido, e vale registrar assim: ligar três das oito
divergências de fidelidade do L48 não moveu a duração média (50,499 → 50,492) nem o
trabalho do mestre além de 0,5%. A lista das 21 não estava escondendo distorção no
número que a fila usa.**

**O QUE A DISTRIBUIÇÃO DIZ, e é maior que a média.** 33,9% das batalhas ficam
idênticas, 12,5% mudam por exatamente 1 Tick, e o resto se espalha de −65 a +65
Ticks (desvio padrão do delta pareado, `bmtq638zo` contra `bmtq8zam1`, batalha a
batalha nas 19.200 que terminam nas duas: **11,35 Ticks**, sobre uma duração média
de ~50 Ticks). Isso não é ruído nem estabilidade: é **média estável sobre variância
grande**, com um Tick de entrada mudando quem alcança quem primeiro numa perseguição
e essa mudança amplificando pelo resto da batalha.

Duas consequências, e a segunda muda como se lê tudo o que veio antes:

1. **o número da fila é robusto à fidelidade, e a CÉLULA não é.** As duas células
   citadas acima se moveram para lados opostos (17,2→19,1 e 30,4→28,1), e qualquer
   leitura por célula herda essa sensibilidade;
2. **e isso vale para toda comparação A/B da grade já feita ou por fazer.** Se um
   Tick de condição inicial produz espalhamento de −65 a +65, o delta de uma
   bandeira medido numa célula pode ser menor que a sensibilidade da própria célula
   à condição inicial.

**O `n` QUE O E5 PRECISARIA, com o desvio que agora existe.** A pergunta invertida:
com este desvio, quantas repetições pareadas detectam um delta de um gesto, de meio
gesto, e de um décimo (95% de confiança, 80% de poder, `n = (1,96+0,84)² · σ² / Δ²`)?

O `11,35` acima é desvio de **duração** (Ticks), e o E5 mede **gesto**: os dois não
convertem um no outro por regra de três, e por isso o par `r08`/`r09` foi medido de
novo, desta vez sobre o campo `gestos` de cada batalha (o total por batalha, não a
taxa por Tick). O desvio real do delta pareado em gestos é **56,58** (média −2,1,
sobre uma média de ~183 gestos por batalha). É este o número que entra na conta:

| detectar um delta de | `n` de batalhas pareadas | procedência |
|---|---:|---|
| 1 gesto | **≈ 25.100** | derivado: fórmula acima com σ = 56,58 |
| 0,5 gesto | **≈ 100.500** | derivado: mesma fórmula, Δ = 0,5 |
| 0,1 gesto | **≈ 2.512.000** | derivado: mesma fórmula, Δ = 0,1 |

**Duas ressalvas, e as duas moram no próprio número:**

- **este `56,58` é gesto TOTAL por batalha, não gesto POR TICK.** A métrica principal
  da grade (§3 de `02-projeto-harness.md`) é por Tick justamente para tirar a
  variância da duração do denominador — "a quantidade deixou de herdar a variância
  da duração, porque a duração agora está no denominador". O `56,58` **não** tirou
  essa variância: ele mistura o efeito real de uma mudança de regra com o mesmo
  espalhamento caótico de duração medido acima. Se a métrica de E5 for mesmo a taxa
  por Tick, o desvio relevante é outro (provavelmente menor), e não foi medido;
- **o pareamento por semente já está contado, e ajuda muito.** A correlação entre o
  gesto de uma batalha antes e depois é **0,875**; a variância do delta pareado
  (3.201) é **12,6% da soma das duas variâncias independentes** (25.422). Pareando,
  o `n` cai para cerca de um oitavo do que precisaria sem parear (para delta de 1
  gesto, seria da ordem de 199.500 sem parear contra 25.100 pareado). **O fluxo
  único, que custava precisão e não correção, está sendo parcialmente ressarcido
  pelo próprio pareamento por semente que ele preserva.**

**A CIRCULARIDADE, TESTADA.** A revisora achou o problema antes de este parágrafo
existir: `r08` contra `r09` é o par "mesma semente, regra mudou no meio", então o
`56,58` não é ruído puro — é ruído mais o efeito da própria mudança misturados na
mesma diferença pareada. Usar isso como desvio de fundo para dimensionar a detecção
de um efeito do mesmo tipo é circular: o denominador da conta de poder conteria uma
amostra do numerador. **A objeção de unidade dela cai**, e fica registrado com as
palavras certas: o `56,58` foi medido direto do campo `gestos` de cada batalha em
`r08`/`r09`, e não convertido do `11,35` (Ticks) por regra de três.

O isolamento: uma bateria nova, **`bmtqb2vxm`** (mesma regra de hoje, `semente_mestre`
`20260906` em vez de `20260903`, commit `4b3b9e7`, o mesmo de `bmtq8zam1`), pareada
com `bmtq8zam1` **por `b`** (o índice global da batalha, e não por semente — a
semente de cada batalha é `hash32(semente_mestre, célula, repetição)`, `bateria.mjs`,
e por isso muda com o `semente_mestre` mesmo mantendo a mesma célula e a mesma
repetição; conferido que as 21.600 células batem par a par). **Pareamento por
ÍNDICE não é o mesmo objeto que pareamento por SEMENTE, e os dois números abaixo
não são comparáveis por acaso**: `r08`×`r09` compartilham a mesma semente (a mesma
sequência de rolagens até o instante em que a regra muda a trajetória), e por isso
herdam o início do caminho aleatório em comum; `bmtqb2vxm`×`bmtq8zam1` compartilham
só a célula e a repetição, com sequências de rolagem totalmente diferentes desde o
Tick 1. Postos lado a lado:

| par | o que muda entre os dois lados | desvio do delta de gestos |
|---|---|---:|
| `r08` × `r09` | a regra (`ticksDeEntrada`/`contrapé`), semente idêntica | **56,58** |
| `bmtqb2vxm` × `bmtq8zam1` | só a semente (`semente_mestre`), regra idêntica | **65,74** |

**65,74 é MAIOR que os 56,58, não menor.** O ruído domina, e a mudança de regra não
deixou marca detectável neste desenho: comparar duas sementes diferentes da mesma
regra já produz mais dispersão do que comparar a mesma semente com a regra mudando.
Se houvesse sinal contaminando o `56,58`, ele sairia maior que o puro ruído, e saiu
menor. **O `56,58` não estava inflado pelo próprio efeito que tentava medir** — ao
contrário, o pareamento por semente idêntica (que preserva o início da trajetória
até a primeira divergência) cancela mais ruído do que a ausência de mudança de
regra por si só. Isto é resultado, não detalhe de método: a comparação que a
revisora temia inflada é, das duas, a de MENOR desvio.

**O NÚMERO POR TICK, medido dos mesmos dados em disco, sem bateria nova.** A métrica
principal da grade é gestos **por Tick**, não gestos totais, e por isso o desvio
certo é outro: sobre os mesmos 19.200 pares de `r08`/`r09`, o delta de `gestos/ticks`
por batalha tem desvio **0,3553**, sobre uma taxa média de **3,72** gestos por Tick.
É uma fração pequena da taxa (9,5%), bem menor que os 31% que `56,58/183` dava para o
total. Com este desvio, tomando Δ diretamente na unidade da métrica (gesto por
Tick):

| detectar um delta de | `n` de batalhas pareadas | procedência |
|---|---:|---|
| 1 gesto/Tick | **≈ 1** | derivado: fórmula acima, σ = 0,3553, Δ = 1 |
| 0,5 gesto/Tick | **≈ 4** | derivado: mesma fórmula, Δ = 0,5 |
| 0,1 gesto/Tick | **≈ 100** | derivado: mesma fórmula, Δ = 0,1 |

**Uma conferência a mais, pedida antes de aceitar isto: Δ = 1 na métrica por Tick
não é Δ = 1 por batalha, e a tabela acima só é decisiva se comparar como igual o
que É igual.** A conversão certa usa a duração MÉDIA das batalhas, **50,495 Ticks**
(a mesma dos 19.200 pares, seção acima), e não a taxa: 1 gesto por batalha equivale
a `1/50,495 ≈ 0,0198` gesto por Tick, e 1 gesto por Tick equivale a `≈ 50,5` gestos
por batalha — não aos 3,72/0,27 de uma conversão pela taxa, que mistura duas
unidades diferentes (gesto/Tick dividido por gesto/Tick não devolve Tick). Refeita a
tabela com o Δ **equivalente a um efeito por batalha**, convertido para a métrica
por Tick:

| efeito do tamanho de | Δ em gesto/Tick | `n` de batalhas pareadas | procedência |
|---|---:|---:|---|
| 1 gesto/batalha | 0,0198 | **≈ 2.527** | derivado: Δ = 1/50,495, σ = 0,3553 |
| 0,5 gesto/batalha | 0,0099 | **≈ 10.105** | derivado: Δ = 0,5/50,495 |
| 0,1 gesto/batalha | 0,00198 | **≈ 252.618** | derivado: Δ = 0,1/50,495 |

**O `n` não fica na casa das dezenas: fica na casa dos milhares, e cresce para
centenas de milhares no décimo de gesto.** Pelo próprio critério proposto para esta
conferência, isso quer dizer que **parte do ganho de 25.100→1 era de unidade, e não
de desenho**: escolher Δ = 1 gesto/Tick sem convertê-lo é escolher um efeito **~50
vezes maior**, em termos de batalha, do que "1 gesto por batalha" — daí ser trivial
de detectar. Dito isso, **o ganho não é só de unidade**: `1/50,495 = 0,0198` gesto
por Tick não converte de volta para `56,58` gestos por batalha ao multiplicar pela
duração média; o desvio real por Tick, reconvertido (`0,3553 × 50,495 ≈ 17,94`), é
**um terço do `56,58` medido direto** — a métrica por Tick tira parte real da
variância de duração, só que menos do que a comparação ingênua (`1` contra
`25.100`) parecia mostrar. Os `n` corretos, para efeitos do tamanho de 1/0,5/0,1
gesto por batalha, medidos e convertidos coerentemente, são **≈2.527 / 10.105 /
252.618** — cerca de **dez vezes menores** que os da métrica total (25.100/100.500/
2.512.000), não vinte e cinco mil vezes.

**O QUE A PREVISÃO ESCRITA DO E5 REALMENTE DIZ, e em qual unidade.** A única
previsão está em `05-fechamento.md:429`: *"a carga por Tick com o perfil cheio fica
a menos de um gesto da carga com tudo desligado"* — **é por Tick**, escrito assim,
não por batalha. Isso alinha a unidade da tabela de cima (gesto/Tick) com a da
previsão, sem conversão nenhuma: testar Δ = 1 gesto/Tick é testar exatamente o
limite que a previsão nomeia. **Mas a previsão só fixa um TETO ("menos de um"), não
um valor** — não diz se o efeito verdadeiro é 0,9 ou 0,0001 gesto/Tick, e por isso
nenhuma das duas tabelas acima tem um Δ único e correto: ⚑ **o Δ que importa para o
E5 não está escrito em lugar nenhum**, e a conta de poder continua rodando sobre um
alvo que ninguém fixou. Ambas as leituras ficam registradas porque nenhuma decide
sozinha: **se o efeito relevante for próximo de "menos de um gesto/Tick" (a leitura
literal da previsão), `n` fica na casa das dezenas/centenas** (tabela de cima);
**se o efeito relevante for próximo de "um gesto por batalha" (a leitura que torna
o número comparável ao resto deste documento, que sempre falou em gestos por
batalha), `n` fica na casa dos milhares** (tabela de baixo).

**O que isto significa, sem decidir nada:** as duas medições de ruído (circularidade
e unidade) seguem de pé, e a mais importante não mudou — o `56,58`/`0,3553` não
estavam inflados pelo efeito que tentavam medir, o isolamento provou o contrário. O
que mudou é a conclusão sobre viabilidade: ela **não é mais "os `n` já bastam"**,
porque isso dependia de tomar Δ = 1 gesto/Tick como o efeito a caçar sem checar se
esse Δ correspondia a um efeito plausível em escala de batalha. Convertido
corretamente, o `n` para um efeito do tamanho de "um gesto por batalha" está na
casa dos milhares (2.527), não das dezenas — acima dos ~500 por célula que a grade
já planeja, ainda que bem abaixo dos 25.100 da métrica total. **O que fica sem
medir continua sendo a bandeira `margem` em si** (os números acima vêm de
`ticksDeEntrada`) **e agora também o próprio Δ-alvo do E5**, que nenhum documento
fixa. O piloto continua sendo quem decide o `n` de produção, e deixou de ser
confirmação de uma conta já boa: voltou a ser pré-requisito, porque o efeito que
ele mediria não está definido em tamanho nem em unidade.

**Esta bateria é posterior ao conserto da iniciativa** (ver a seção 3). Os números
publicados antes dele, inclusive os da `09`, mudaram todos, e a `09` traz o aviso
disso na §2.4.

---

## O QUE ESTA FRENTE MEDIU, E O QUE ELA NÃO MEDIU

**Ela mediu o mestre ARBITRANDO, e não o mestre JOGANDO.** É o achado que muda o
significado de todo o resto, e ele não é ressalva de rodapé.

Nas 21.600 batalhas os dois lados são robôs. Por isso **declarar custou zero
gesto**: ninguém escolhe ação, alvo, manobra nem modo de deslocamento, porque a
política decide sozinha dentro do avanço. Tudo o que sobrou na tela do mestre foi
transcrição, e é por isso que a linha entre custo e jogo encontrou **100% de custo**.

**Numa mesa de verdade o mestre joga os inimigos**, e as declarações de um lado
inteiro são dele:

| o mestre em cena | decisões dele por batalha | Ticks entre duas decisões |
|---|---:|---:|
| **só arbitra** (o que esta frente mediu) | **0,3** | **125,2** |
| **joga um lado** (a mesa normal) | **12,8 a 14,3** | **2,7 a 3,0** |

Uma batalha tem 39,1 Ticks. Três consequências, e as três são leitura e não medição:

- **o trabalho medido aqui é o de arbitrar.** O de jogar não foi medido, e não é o
  mesmo trabalho;
- **os sete degraus tiram transcrição e não tiram decisão nenhuma.** Nenhum deles
  toca `declarar`, `fugir` ou `redirecionar`, que são as três paradas de escolha;
- **a preocupação de que o mestre vire espectador estava errada pelo mesmo motivo
  que o resto desta frente esteve errado: o denominador não tinha o lado que ele
  joga.** Ele decide a cada 2,7 Ticks, catorze vezes por batalha.

---

## 1 · O QUE FOI MEDIDO

A pergunta é uma só: **quanto do trabalho do mestre, numa batalha do Grid, a
automação pode tirar.** Trabalho aqui é gesto de tela: clique, arrasto, número
digitado.

### A linha entre o que sai e o que fica

**Custo é o tempo entre a DECISÃO ESTAR TOMADA e o EFEITO APARECER na tela.**
Decidir é jogo, e pode demorar o quanto o jogador quiser. Configurar não é.

| do lado do JOGO, e não sai | do lado do CUSTO, e é tudo o que se quer tirar |
|---|---|
| escolher a arma, o alvo, o alcance, a área da magia, a distância do projétil | somar o que foi rolado |
| escolher a manobra, o modo de deslocamento | digitar o total no campo |
| rolar o dado na mão | digitar o dano, e o segundo input do ataque |
| o veredito, quando ele é julgamento e não conta | aplicar à mão qualquer modificador que a tela calculou e exibiu |
| | abrir, procurar, corrigir e reabrir modal |
| | todo clique de relógio que não abre decisão nenhuma |

**O critério de conflito:** se o mestre está executando consequência de uma decisão
já tomada, é custo; se está tomando a decisão, é jogo. **Na dúvida, é jogo**, porque
tirar diversão por engano é o erro caro e deixar custo na mesa custa uma rodada.

Esta linha substitui a classe iii como definição de alvo. A classe iii dizia onde a
parada nascia; a linha diz o que dentro dela é trabalho de quem opera a tela.

### O trabalho do mestre não é uma coisa, são três

| | gestos | fatia | como se lia antes |
|---|---:|---:|---|
| **aritmética** | 597.714 | 51% | sai com automação de regra |
| **o ⏭**, cadência de relógio | 375.005 | 32% | ninguém tira: nenhuma regra o toca |
| **julgamento** | 199.238 | 17% | ninguém tira: é a mesa decidindo |
| **total** | **1.171.957** | **100%** | |

Procedência: `R:134` a `R:137`. **E a aritmética inteira sai de UMA parada, a folha
da resolução** (`R:128`): as outras cinco paradas do Tick somam 60% das ocasiões e
custam zero gesto.

### Os mesmos gestos, pela linha

O custo de tela de cada parada está escrito em `scripts/sim/custo-tela.mjs`, com a
derivação lida do Grid. Abrindo os três termos por gesto, em vez de por parada:

| o gesto | gestos | fatia | jogo ou custo |
|---|---:|---:|---|
| abrir o cartão vencido na faixa | 199.238 | 17,0% | **custo**: executa uma decisão já tomada na declaração |
| digitar o acerto e digitar o dano | 398.476 | 34,0% | **custo**, e está na lista com todas as letras |
| o botão do veredito (acertou · raspou · errou) | 199.238 | 17,0% | **custo**: a tela já fez a comparação e a exibe; o clique transcreve |
| ⏭ que não abre parada nenhuma | 210.296 | 17,9% | **custo**, e está na lista |
| ⏭ que abre uma parada | 164.709 | 14,1% | **custo neste elenco**: a parada que ele abre é a folha, que é transcrição |
| **total** | **1.171.957** | **100%** | |

**Pela linha, nada do que o mestre faz nesta bateria é jogo.** E o motivo não é que
o jogo tenha sumido: é que **o jogo mora na declaração, e a declaração é gesto do
JOGADOR**, não do mestre. Nesta bateria ela é do robô e custa zero. Escolher arma,
alvo, alcance, manobra e modo de deslocamento acontece tudo lá.

**Quanto do que a escada tirava era jogo: nada.** Os três degraus tiram digitação,
clique de relógio vazio e transcrição de veredito, e nenhum deles toca uma escolha.

**E o teto real, depois de tirar o jogo de dentro dele, é 100%** do trabalho do
mestre nesta configuração, porque não há jogo nenhum dentro dele. Os 61,8% nunca
foram um limite de princípio: eram o limite dos três degraus que estavam desenhados.
O que sobra depois deles, o ⏭ que para e o botão do veredito, é custo como o resto.

**Cem por cento é o limite de princípio; o limite dos consertos desenhados até hoje
é 99,7%**, e a seção 2 mostra a conta. O que separa os dois é o gesto nas paradas
que pedem uma escolha humana de verdade, que são 4% delas.

> **A ressalva, e ela é grande.** Isto vale para o mestre e para esta bateria, que
> não tem peça de jogador. Numa mesa com gente, parte do ⏭ passa a abrir declaração,
> que é decisão, e vira jogo. **Quanto, não está medido**, e não se mede com bateria:
> depende de quantas peças são de jogador.

### A escada, com o que já está entregue

**Até 06/09/2026 esta seção mostrava uma escada de projeto**: números que o
próprio agregador calcula a partir do cenário PISO do avanço unificado (a versão
pessimista, um cartão absorvido por parada e o resto sobrando), de um dia em que
nenhum dos degraus existia em código. O código real que está no Grid hoje
(`avancarAteParar`, `grid.astro:5730-5744`) entrega mais do que o PISO assumia:
ele não absorve só o Tick morto, resolve TODO golpe vencido do Tick em que para
(a medição de 06/09/2026, acima). Isso bate com o cenário SEM-GESTO do mesmo
agregado, não o PISO, e é por isso que a tabela de PISO (que chegava a 573.255,
48,9%, e depois a 448.224, 38,2%) ficava aquém do que a mesa recebeu de verdade.
A tabela abaixo troca a estimativa de projeto pelo que está de fato entregue:

| | trabalho | do de hoje | o que sai | está no Grid? |
|---|---:|---:|---|---|
| hoje, modo `mesa` | 1.171.957 | 100% | · | · |
| + a folha aceita o dado em vez do total | 773.481 | 66,0% | os dois números digitados por golpe, derivado de 597.714 − 199.238 (`R:166`); `R:170` para os 34,0% | sim · `045f491`/`b9d0b01` |
| + o avanço unificado resolve todos os golpes do Tick em que para | **273.445** | **76,7%** | o ⏭ cai ao piso SEM-GESTO, 375.005 → 74.207 (`R:129` para os 375.005, `R:144` para os 74.207); e o cartão de cada golpe deixa de custar clique, os 125.031 que sobravam somem (`R:175`) | sim · `55674f1`/`5bd7e8c` |

**O teto, com os consertos desenhados até hoje: 76,7%.** É o número que está DE
FATO no Grid, e não uma projeção: são os itens 1, 3 e 5 da fila (seção 2, abaixo),
entregues nestes shas, e o total de 1.171.957 vem de `R:169`.

**Uma conferência de 06/09/2026 corrigiu a razão por trás deste número, e não o
número.** Uma leitura anterior chamava de "reconciliado" o fato de a subtração
ingênua da tabela e o cenário SEM-GESTO do agregador baterem exato — como se
fossem duas testemunhas independentes. **Não são: é o mesmo contador**
(`golpeNoTick`, `scripts/sim/log.mjs:224-226`) **lido por duas exibições
algebricamente equivalentes** (`ticksComGolpe`, `scripts/sim/agregar.mjs:648`, e
`comGolpe`, `agregar.mjs:481`, são `t − round(f·t)` e `round((1−f)·t)` sobre os
mesmos `x.ticks`/`x.fracaoSemGolpe`). Perturbado à mão um golpe numa bateria real
(1.920 batalhas), os dois se moveram pelo mesmo número, porque é o mesmo evento —
não é coincidência, é identidade. **A robustez de verdade vem de outro lugar**: o
degrau final não se mexeu nada com a perturbação, porque `ticksComGolpe + sobram
= golpes` é invariante a como os golpes se distribuem entre Ticks, e só depende
do TOTAL de golpes. **O número resiste; a justificativa anterior estava errada.**

**E o achado que a frase anterior chamava de "dormente" não era dormente nem
local.** Uma segunda conferência (06/09/2026) contou: doze dos vinte campos do
agregador têm mais de um leitor, e `x.campo || 0` aparece pelo menos QUARENTA
vezes no arquivo, sobre cinco campos com leitura múltipla — inclusive duplicado
sobre as duas exibições acima (`comGolpe` e `ticksComGolpe`), que por isso NUNCA
poderiam achar um campo sumido só de baterem entre si. Medido no corpus em disco
(19 diretórios, 288.900 batalhas): a fase de fuga tem `ticks = 0` em 57,1% das
batalhas (ela não aconteceu), e o `frac` de origem (`log.mjs:291`) devolvia ZERO
nesse caso, não ausência — "0% dos Ticks ficaram sem golpe" quando na verdade não
houve Tick nenhum. Isso puxava a coluna "s/golpe" da fase de fuga na tabela A na
direção de "sempre teve golpe": na bateria de então (`bmtmbdppb`), a célula
`coprimo-encostado-1v1` saía a 0,18 com o zero falso e a 0,71 sem ele, contando só
as batalhas que de fato fugiram. **O conserto foi na fonte, não em cada leitor**:
`frac` agora devolve `null` com `ticks` zerado (`log.mjs:291`), e uma porta em
`agregar.mjs` valida a forma de cada registro ao ler, recusando qualquer campo
ausente que não seja o único legado conhecido (`paradasSubLado`, de bateria
anterior ao campo). **O conserto é da FONTE e não é retroativo ao `.jsonl` já
gravado**, então a bateria foi REGRAVADA em 06/09/2026 (`bmtq638zo`), e é ela que
esta página publica. O degrau final não mudou, porque ele só soma a fase de
combate, que nunca tem zero Ticks. Na fuga a correção aparece, e em duas colunas:
`coprimo-encostado-1v1` vai de 0,18 a **0,71** em `s/golpe`, e `coprimo-media-1v1`
de 0,06 a **0,21** em `s/parada`. Nesta bateria a fase de fuga tem `ticks = 0` em
**54,5%** das batalhas (11.770 de 21.600); os 57,1% acima são do corpus inteiro
dos 19 diretórios, e não desta.

**O que falta para os 99,7% que a seção 2 projeta não é código faltando nestes
dois degraus: são o item 2 e o item 7, e nenhum dos dois tem número real ainda.**
O mecanismo do item 2 (o botão do veredito já calcula e destaca um dos três) é
anterior a esta frente inteira (`67fbb29`, 21/08/2026), mas ele não reduz um
número medido: a banda continua entre 0 e 17,0% (`R:123`), porque a taxa em que a
mesa discorda do destaque não é medível por bateria. O item 7 (o avanço MOSTRA o
percurso em vez de pedir confirmação) não foi construído. **Os 61,8% que esta
seção citava antes eram o teto de uma estimativa já superada**: o Grid de hoje
entrega mais do que aquela tabela previa, porque o código real bate no SEM-GESTO
e não no PISO.

**O que sobra cresce com o TAMANHO da cena, não com a complexidade da regra**, o que
quer dizer que nenhuma simplificação de regra o reduz. Isso continua valendo, e é
uma afirmação sobre a forma do resíduo, não sobre ele ser irredutível.

### O avanço automático, medido sozinho

Se o ⏭ pulasse os Ticks em que não há nada a fazer, ele tiraria de **10,8% a 17,9%**
do trabalho do mestre no modo `mesa` (`R:193`), e de **16,3% a 27,2%** no modo
`site` (`R:202`). O piso conta só os Ticks em que nada parou **e** nada andou; o
teto conta todo Tick sem parada, inclusive aqueles em que as peças andaram e o
mestre talvez quisesse ver.

Com jogador declarando à mão, a fração cai, mas **por crescimento do denominador e
não por o mestre trabalhar menos**: numa mesa em que os jogadores declaram um lado e
o robô declara o outro, fica entre 8,8% e 9,0% com dois gestos por declaração, e
entre 7,4% e 7,7% com quatro (`R:191` a `R:201`).

### O que esta medição NÃO diz

Ela mede o robô do produto, com as quinze bandeiras desligadas, manobra sempre
simples, sem peça de jogador, sem criatura de bestiário e sem Arte. Das 112 células
oficiais do projeto, **88 não rodam** (decisão D30 da `09`). Nada aqui fala de
bandeiras, políticas, obstáculo, leitura, reforço nem criaturas.

---

## 2 · O QUE VAI MUDAR NO GRID

> **Esta frente, a de medir, não implementou nada: seu papel é medir, e não
> mudou a mesa por si só.** Mas a mesa mudou, por lotes de construção separados, e
> hoje isso já não é ressalva de "nada mudou": os itens 1 e 3 (`045f491`/`b9d0b01`
> e `55674f1`/`5bd7e8c`, 06/09/2026) estão entregues, o item 5 saiu junto com o 3
> no mesmo código, e o mecanismo do item 2 é anterior a esta frente inteira
> (`67fbb29`, 21/08/2026). A escada, abaixo, mostra o que isso vale.

### O que a linha fez com a fila

**O item que era o maior morreu como estava escrito, e o número dele não morreu.**
"O site rola os dados" valia 34,0% do trabalho do mestre, e a leitura era que ele
trocava o prazer de rolar por menos trabalho. **A leitura estava errada, e o custo
de tela mostra por quê:** os três gestos da folha no modo `mesa` são abrir o cartão,
digitar o acerto e digitar o dano. **Rolar não é nenhum deles.** Um punhado de dados
na mesa não custa gesto de tela nenhum, e por isso não aparece nesta conta em modo
algum.

| dos 34,0% que o modo `site` valia | gestos | o que é | procedência |
|---|---:|---|---|
| rolar o dado | **0** | jogo, e nunca esteve na conta | `custo-tela.mjs`: dado na mão não é gesto de tela |
| digitar os dois totais | **398.476** | custo puro | **derivado**: 597.714 − 199.238 (`R:166`), com a repartição dos 3 gestos de `resolver` vinda de `custo-tela.mjs` |

**Os 34,0% eram transcrição, inteiros.** A decisão de manter o dado na mão do
jogador não custa um ponto sequer: o que tem de sair é a mesa ter de somar o que
rolou e digitar o total, com o dado continuando a ser rolado na mão.

### O botão do veredito é derivável sempre, e por isso sai inteiro

O botão que fecha a folha ("Acertou · aplicar", "Raspou · aplicar", "Errou") vale
199.238 gestos, **17,0%** do trabalho do mestre. Ele é custo, e a conferência é de
código e não de frequência:

- **a tela já calcula o veredito**, com `saidaDoAtaque(total, defesa, margem)`, uma
  **função pura de três números** que estão todos na folha (`src/lib/quase-acerto.ts`);
- **o Grid já guarda os dois separados**, a conta da régua e o botão do mestre, e o
  comentário do código diz por quê: "permite medir depois quantas vezes a mesa
  contrariou a régua";
- para o mestre, os três números estão sempre preenchidos. **Não há lance em que o
  veredito não seja derivável.**

**Mas "sai inteiro" não se sustenta, e a revisão da rodada 05 derrubou as duas
afirmações que o sustentavam.** As duas eram minhas e as duas estavam erradas:

| o que eu escrevi | o que o código diz |
|---|---|
| "o Grid já guarda os dois separados, a conta da régua e o botão do mestre" | guarda **só com a bancada ligada**: `registrarLance` começa com `if (!LANCES_LIGADO) return;`, e `LANCES_LIGADO` é o parâmetro `?lances=1`, desligado por padrão. O destino é `window.__LANCES`, memória da página, e o único consumidor é `coletar-lances.mjs`. Não há coluna nem migração no Supabase. **Numa mesa de verdade os dois campos não coexistem em lugar nenhum, e a página descarta tudo ao fechar** |
| "não há lance em que o veredito não seja derivável" | há **três caminhos que devolvem `null`**: `lance.ts:144` (`if (alvo.defesaBase == null) return null`), `grid.astro:8866` (o ternário exige `soma != null && def2 != null`) e `grid.astro:8777` (`defesaBase: r?.defesa ?? null`) |

**O item passa a valer entre 0% e 17,0%**, e a banda não é de imprecisão, é de
ignorância: o valor depende da taxa em que a mesa aperta um botão diferente do que a
régua calculou, e **esse número não existe em lugar nenhum**. Se a mesa contrariar a
régua com frequência, o botão é decisão e o item vale zero.

**A fração que sai da banda por outro motivo, e ela não é medível aqui.** Quando
`defesaBase` é nula, o botão automático **não tem o que confirmar**: `saidaDoAtaque`
não é chamada, o veredito sai `null`, e aqueles lances continuam pedindo o mestre.
Nesta bateria a fração é **zero**, porque toda peça vem de arquétipo resolvido pela
régua e o resumo sempre traz `defesa`. **Isso não mede a mesa**: lá a Defesa falta
quando a peça não tem ficha resolvida, e com que frequência isso acontece depende de
como as mesas montam encontro. Não é medível com bateria.

### As duas leituras do item 2, e a reconciliação

**Eu respondi à objeção por outro caminho, e o caminho é bom, mas responde outra
pergunta.** Ele está aqui inteiro, porque objeção respondida por outro caminho tem de
mostrar os dois:

- **o caminho dela:** os 17,0% valem se o botão for transcrição, e a única evidência
  que separa transcrição de julgamento é a taxa em que a mesa contraria a régua. Essa
  taxa não existe. Logo a conferência do item caiu;
- **o meu:** a tela não calcula o veredito a partir dos números da régua. Ela o
  calcula a partir do **campo de ajuste que o mestre digita** e da **Defesa que o
  mestre corrige** (`contaDoLance`). Então o veredito de hoje já sai dos números
  corrigidos à mão, e automatizar o botão não o torna mais errado do que é hoje;
- **a reconciliação, e ela é a favor dela:** o meu argumento cobre as **ENTRADAS** do
  botão, e não a **SAÍDA** dele. Ele mostra que a tela não vai confirmar uma conta
  pior do que a que o mestre confirmaria com os mesmos campos. **Não mostra que o
  mestre nunca aperta um botão contrário à conta**, e é exatamente isso que a taxa
  mediria. Um mestre que decide "errou" onde a aritmética diz "acerto" está julgando,
  e automatizar tira esse julgamento dele.

**Então a objeção dela fica de pé, e a banda de 0 a 17,0% é a leitura correta.** O
que o meu argumento derrubou foi só o bloqueio: as duas contas do item 4 não impedem
o item 2, porque a correção delas acontece acima do botão, em campos que ficam.

**O julgamento que resta mora acima do botão**, no campo de ajuste e nos quatro
campos da ficha do lance. Esses ficam, e é isso que a folha continua pedindo.

**A condição, e ela liga tudo:** o veredito só é confiável se os números de cima
estiverem certos, e hoje eles não estão sempre, porque o Grid calcula coisas que não
aplica. **Enquanto o conserto abaixo não for feito, o botão não pode virar
confirmação automática**, senão a tela passa a confirmar sozinha uma conta que ela
mesma sabe estar incompleta.

### O conserto conjunto: as contas não aplicadas e os quatro campos

**São o mesmo conserto, e é por isso que viram um item só.** Os quatro campos
custosos da folha (Defesa base do alvo e as três Absorções) não têm defeito próprio:
eles são o lugar onde o mestre digita, à mão, correções que o Grid já sabe fazer.
Aplicar as contas esvazia os campos.

**E HÁ UM CASO EM QUE ISSO NÃO É PENDÊNCIA, É LIMITE, e a diferença importa porque a
segunda não se conserta escrevendo mais código.** Numa peça `custom` (a peça digitada
na mesa, sem ficha nem entrada no bestiário), `RESUMO[alvo.id]` não existe: não há
`defesaBase` nem `soak` para nenhuma das seis contas de cima corrigir, porque não há
número base nenhum ali para corrigir. **Numa peça sem ficha completa, o número só
existe na cabeça do mestre** — ele inventou aquele monstro na hora, e o Grid nunca
soube o número dele. Aplicar as seis (ou as quinze) contas não esvazia estes quatro
campos nesse caso, porque não há o que a conta leia. **Isto fica registrado como
limite do sistema, não como item da fila**: nenhuma versão futura da folha faz esse
número aparecer sozinho, e não é por o conserto estar incompleto.

**A ordem tem duas metades, e elas não valem a mesma coisa.**

**Primeira metade · as seis que o Grid já exibe.** Já estão calculadas na tela; falta
aplicá-las. Não precisam de regra nova:

| a conta | onde o mestre digita hoje |
|---|---|
| contrapé da iniciativa | o campo de ajuste |
| faixa de distância, no tiro e no arremesso | o campo de ajuste |
| gate de Perfuração | o campo de dano |
| a Defesa −4 da Corrida | **Defesa base do alvo**, ou uma condição na peça |
| penalidade de manobra (rajada, dupla) | o campo do total, e só quando a mesa rola |
| alcance no corpo a corpo | nada: é aviso, e não pede digitação |

**Segunda metade · as nove que o Grid nem exibe.** Exigem implementar a regra antes
de aplicá-la: margem de dano, Porte no acerto, Couraça de Porte, o teto ±6 dos
modificadores, Investida, Bloqueio e Defesa da arma e escudo, o modo secundário de
dano, sangramento por rodada e projétil rápido.

**E aqui há uma correção à premissa de que a primeira metade liberta os quatro
campos: ela liberta um só, e pela metade.** Das seis exibidas, **apenas a Corrida
−4 aterrissa num dos quatro campos**; as outras cinco caem nos campos em branco
(ajuste, dano, total). A Defesa base tem duas fontes, e a segunda (Bloqueio e Defesa
da arma) está na metade cara. As três Absorções são libertadas só pela Couraça de
Porte, que também está na metade cara.

| metade | o que ela custa | o que ela liberta |
|---|---|---|
| **as seis exibidas** | nada de regra: só ligar a aplicação | os três campos em branco, na maior parte dos casos, e metade da Defesa base |
| **as nove não exibidas** | implementar cada regra | **os quatro campos custosos**, e o resto dos campos em branco |

**Quanto vale, em gestos:** cada aplicação à mão custa ao menos dois gestos, e um
lance em que uma só correção se aplica custa **5 gestos em vez de 3**. Com que
frequência cada uma se aplica **não está medido, e não é bateria que mede**: o robô
da bateria nunca aplica correção situacional, então os 1.171.957 medidos assumem que
nada disso acontece. **O número publicado é piso, e esta lista é o tamanho do que
falta nele.**

### O piso do item 4, e por que a bateria não consegue medi-lo

**Das quinze contas não aplicadas, sete não são custo hoje, e o motivo estava
escrito no `regras.json` o tempo todo.** Elas são bandeiras de regra, e **as quinze
nascem desligadas**. A nota do próprio arquivo diz por quê: *"nenhuma está ligada no
motor (a margem não entra no dano, o gate não é chamado, o bloqueio não existe)"*.
Uma regra desligada não é uma conta que o mestre aplica à mão: é uma regra que a
mesa não joga. **O mestre não paga por ela, e ligá-la é decisão de regra, não
conserto de custo.**

São elas: margem de dano, gate de Perfuração, Porte no acerto, Bloqueio e Defesa da
arma e escudo, modo secundário de dano, teto ±6 dos modificadores, e sangramento por
rodada.

**E uma oitava sai por outro motivo: a Couraça de Porte já é aplicada**, em tempo de
geração do bestiário, e vem somada na Absorção de cada criatura. A linha da §C2 que
diz que ela não é aplicada está errada, e a nota do `regras.json` explica que uma
bandeira de tempo de execução a somaria duas vezes.

**Sobram sete, e é isso que o item 4 é:** contrapé da iniciativa, faixa de distância
no tiro e no arremesso, alcance no corpo a corpo, a Defesa −4 da Corrida, penalidade
de manobra, Investida e projétil rápido. Duas delas não pedem digitação nenhuma (o
alcance no corpo a corpo é aviso; o projétil rápido não tem onde ser escrito).

**Quantas vezes cada uma DEVERIA ter se aplicado, nas 9.600 batalhas da população
publicada:**

| a conta | ocasiões | por quê |
|---|---:|---|
| faixa de distância (tiro e arremesso) | **0** | o elenco tem duas armas de corpo a corpo, e nenhuma à distância (D25) |
| projétil rápido | **0** | mesmo motivo |
| penalidade de manobra | **0** | a política declara sempre `simples`, nas 247.065 declarações |
| Investida | **0** | mesmo motivo, e ela é escolha e não regra automática |
| alcance no corpo a corpo | **0 gestos** | é aviso na tela, e não pede digitação |
| **a Defesa −4 da Corrida** | **não derivável** | o log registra QUE a peça andou (`log.andou`), e não em que modo. Contar isto exige um campo novo no log, e portanto a bateria inteira de novo |
| **o contrapé da iniciativa** | **não derivável** | depende de um estado da fila que o log não guarda por Tick |

**O piso do item 4, medido nesta bateria, é ZERO, e isso não quer dizer que ele não
custe.** Quer dizer que **esta bateria não consegue medi-lo**, e o motivo é a
decisão D25 mais a política: dois arquétipos de corpo a corpo, manobra sempre
simples, nenhuma condição, nenhuma arma à distância. **Cinco das sete ocasiões são
estruturalmente zero aqui, e as outras duas não estão no log.**

**As duas metades, então, não são "seis baratas e nove caras". São:**

| | quantas | o que é |
|---|---:|---|
| regras desligadas | 7 | ligar cada uma é decisão de regra (o L25), e não conserto de custo |
| já aplicada em outro lugar | 1 | a Couraça de Porte, no bestiário |
| custo real, sem ocasião nesta bateria | 5 | precisam de elenco ou política que a bateria não tem |
| custo real, sem número no log | 2 | Corrida e contrapé, e os dois pedem campo novo |

**O item 4, então, é isto e nada mais: a Defesa −4 da Corrida e o contrapé da
iniciativa.** Duas contas que o Grid exibe, não aplica, e que nem estão
instrumentadas no log. Todo o resto do que estava debaixo daquele nome ou é o L25
disfarçado (sete bandeiras desligadas) ou já está aplicado noutro lugar (a Couraça
de Porte).

### E não, elas não bloqueiam o item 2

**O argumento do bloqueio caiu quando fui conferi-lo no código.** Ele dizia que
automatizar o botão do veredito faria a folha confirmar sozinha uma conta
incompleta. Isso supõe que a tela calcula o veredito a partir dos números da régua,
e não é o que ela faz: `contaDoLance` monta a soma com **`modManual`, que é o campo
de ajuste que o mestre digita**, e a Defesa com **`defesaBase` lida da ficha do
lance, que é o campo que o mestre corrige**.

**Ou seja: o veredito de hoje já sai dos números corrigidos à mão.** Automatizar o
botão não o torna mais errado, torna-o exatamente tão certo quanto é hoje, porque a
correção acontece **acima** dele, em campos que continuam existindo. O que o botão
faz é transcrever uma comparação, e a comparação usa o que estiver nos campos.

**O bloqueio só valeria se automatizar o botão tirasse do mestre a chance de
corrigir, e não tira.** Com duas contas em vez de quinze, e sendo as duas
corrigíveis em campo que fica, **o item 2 pode andar antes.**

**A ordem muda, e a diferença é grande:** começa-se por um conserto de 34% e outro
de 17%, e não por dois campos que nem estão instrumentados e cuja medição pede
campo novo no log e bateria inteira de novo.

### O mecanismo do item 2 já existe em código, e isso não estava escrito aqui

**"O item 2 pode andar antes" não significava "falta escrever o item 2".** O
mecanismo — calcular e destacar, e não mostrar três botões iguais para o mestre
escolher do zero — já existe, e existia antes desta seção ser escrita.
`pintarVeredito` lê `contaDoLance()` e, com os três números presentes, escreve a
conta por extenso ("acerta (15 > 13)", "erra por 4: raspa (margem 2)") e destaca UM
dos três botões (`sim.classList.toggle('primary', ...)`, `grid.astro:8977-8979`).
Sem soma ou sem Defesa, nenhum é destacado e a caixa diz o que falta
(`if (L.soma == null || L.defesa == null)`, `grid.astro:8946`).

**Nasceu em `67fbb29`** (21/08/2026, "a folha da ação, e quem rola os dados vira
escolha da mesa"); **o guarda de nulo veio em `579581b`** (04/09/2026, "a tela
parou de recomendar 'Acertou' quando a régua não tem o que dizer").

**O QUE MUDA PARA O MESTRE:** antes do destaque, comparar os três números de
cabeça e achar o botão certo entre três iguais. Com o destaque, a conta já está
escrita ao lado dos botões e o botão certo já vem realçado — o clique dele é achar
o realce e confirmar, ou discordar e clicar outro.

**ISSO NÃO MUDA A BANDA DE 0 A 17,0%, algumas seções acima.** O mecanismo existir
não resolve a ignorância que sustenta a banda: ela depende da taxa em que a mesa
aperta um botão diferente do destacado, e essa taxa continua sem medição — nenhuma
bateria mede o mestre discordando da régua, porque as 21.600 batalhas não têm
mestre nenhum jogando. O que muda é que não falta código para o item 2 andar: falta
só medir essa taxa, numa mesa de verdade, e ninguém mediu ainda.

### O que sobra depois de tudo, e o teto de verdade

O resíduo de hoje é o ⏭ que abre uma parada (164.709, 14,1%) e o cartão vencido
(199.238, 17,0%). **Nenhum dos dois é decisão.** E o avanço unificado já abre a folha
do golpe que o fez parar: **o cartão daquele golpe some junto com o clique.**

| | gestos | do de hoje | procedência |
|---|---:|---|---|
| ⏭, um por Tick com golpe | 74.207 | 6,3% | `R:144`, o nível SEM-GESTO |
| cartões que sobram, porque um Tick tem 2,68 golpes e a parada absorve um | 125.031 | 10,7% | `R:175` |
| **piso, com um cartão por golpe** | **199.238** | **17,0%** | `R:123` |
| **piso, se a parada abrir todos os golpes do Tick** | **74.207** | **6,3%** | `R:144` |

### Medido em 06/09/2026: o item 3 já ENTREGA o item 5, no mesmo código

**A pergunta era "quanto do item 5 o item 3 já absorve", e a resposta é: os dois
já estão no mesmo commit, e não faltava construir nada entre eles.**
`avancarAteParar` (`grid.astro:5730`), ao achar `instanteDeGolpe()`, não abre só
a folha do golpe que fez o laço parar — ela itera **todas** as peças de pé e
resolve **todos** os golpes de cada uma com Tick já vencido, um após o outro,
antes de parar: `for (const c of emPe) {`, `grid.astro:5740`. O item 5 ("a
parada abre todos os golpes do Tick, e não só um") descrevia exatamente este
comportamento como refinamento SEPARADO do item 3; o código que foi escrito já
nasceu com os dois juntos.

**O que isso vale, na tabela de cima:** a linha "cartões que sobram" (125.031,
10,7%, `R:175`) deixa de ser resíduo. Ela era o preço de abrir só UM golpe por
parada; com todos abertos, ela some junto com os 74.207 da linha de baixo. **O
piso de hoje para a classe "aplicar" inteira é zero em produção**, não 74.207:
o que resta como gesto do mestre não é mais o cartão, é só o clique de ⏭ que
leva até o Tick (já contado à parte, na linha "o ⏭ que abre uma parada").

**Uma lacuna real, pequena e que se autocorrige:** se uma mordida sem diálogo ou
uma consulta acontecem no MESMO Tick em que um golpe também vence, o laço já
retornou por essa razão antes de o `for` de cima rodar de novo para aquele Tick:
`if (contadorDeMordidas() > mordidasAntes) return;`, `grid.astro:5752` — o cartão
fica vencido na tela por um instante, e não soma-se um clique extra: o próximo ⏭
(que o mestre já ia dar para continuar) o resolve na hora. Não é gesto a mais, é
ordem de exibição.

**"184.034" e "2,87" não são desta bateria.** Eles são de `docs/simulacao/
resultados/09-bmtlxp622.txt` e `09-bmtlw3e2r.txt` (a mesma leitura, duas cópias),
de ANTES do conserto da iniciativa que este documento avisa logo na abertura.
A bateria corrente (`bmtq638zo`) mede **199.238 golpes, 2,68 por Tick que tem
golpe** (`R:123`, "O CACHO" do agregado) — mais golpes e uma média um pouco
menor, o que é coerente com o conserto ter mudado quantos golpes caem no mesmo
Tick. A conclusão não muda com qual das duas se use: em ambas, a maioria dos
cartões não seria absorvida por uma parada que abre só um, e em ambas o código
que existe hoje já abre todos.

**Está no Grid: sim**, desde `55674f1`/`5bd7e8c` (06/09/2026). A linha "está no
Grid?" dos itens 3 e 5, na tabela da fila abaixo, está desatualizada por isso —
os dois entraram juntos, no mesmo lote, e não em dois passos como a fila
planejou.

### E os 6,3% também não são limite: VER não é CLICAR

**A mesma armadilha dos 61,8%, e quase caí nela.** Escrever que tirar os 74.207 é
tirar o mestre do laço supõe que ele precisa CLICAR para saber o que aconteceu. Não
precisa: se o avanço corre e mostra o que passou no caminho, ele vê sem clicar. **O
clique só é necessário onde a mesa precisa que ele CONFIRME, não onde precisa que ele
SAIBA.**

Nas 9.600 batalhas, das paradas que exigem uma escolha humana existe **uma só**: o
redirecionamento do golpe cujo alvo já caiu, que numa mesa com peça de jogador abre
caixa de escolha (está na lista ⚑ do manifesto, como custo que esta bateria não
enxerga).

| | ocasiões | dos 74.207 | procedência |
|---|---:|---|---|
| paradas que pedem escolha humana (redirecionamento) | **2.995** | **4,0%** | `R:126` |
| paradas em que o mestre só precisa VER | **71.212** | **96,0%** | **derivado**: 74.207 (`R:144`) − 2.995 (`R:126`) |

**Então há um degrau 7, e ele é o maior de todos.** Se o avanço mostra o percurso em
vez de pedir confirmação a cada parada, o trabalho cai de 74.207 para a ordem de
**2.995 gestos, 0,3% do de hoje**, e o teto do projeto vai a **99,7%**.

**O que impede de escrever 99,7% como número final**, e é ressalva e não recuo: um
mestre que nunca clica não é necessariamente um mestre que está vendo, e **com que
frequência ele vai querer interromper de propósito não se mede com bateria** · é a
mesma pergunta do L26 e é de mesa. O que está medido é o piso **mecânico**: quatro
por cento das paradas exigem uma escolha, e noventa e seis por cento não exigem
nada além de olhar.

### A fila

> **Dos sete itens, UM está inteiramente medido** (o 1, 34,0%, `R:170`). O **2**
> depende de um número que hoje não é medível fora de mesa real; o **3** tem 7,7 dos
> seus 32,0 pontos apoiados numa definição que o agregado passou a medir só agora
> (`R:144`); o **4** declara-se não medido; o **7** sai de uma contagem de paradas e
> não de gestos. **Isto decide por onde começar, e não o tamanho dos itens.**

| # | o conserto | o que tira | procedência | está no Grid? |
|---|---|---:|---|---|
| 1 | **a folha aceita o dado em vez do total**: a mesa rola na mão e a tela deixa de pedir a soma digitada | **34,0%** · 398.476 | `R:170` para os 34,0%; o gesto é **derivado**: 597.714 − 199.238 (`R:166`), com a repartição dos 3 gestos de `resolver` em 1 de abrir e 2 de digitar vinda de `custo-tela.mjs` | **sim** · `045f491`/`b9d0b01` |
| 2 | **o botão do veredito vira confirmação** | **0 a 17,0%** · até 199.238 | `R:123` para os 199.238. A banda **não tem procedência**, e é esse o ponto: ela é ignorância, não imprecisão | **o mecanismo sim** (`67fbb29`/`579581b`), **a banda segue sem medir** |
| 3 | **o avanço unificado**: o ⏭ corre até a parada que precisa do mestre e abre a folha do golpe que o fez parar | **32,0%** · 375.005 vira 74.207 | `R:129` para os 375.005 e **`R:144` para os 74.207**, que é o nível SEM-GESTO, medido no agregador desde esta rodada | **sim** · `55674f1`/`5bd7e8c` |
| 4 | **a Defesa −4 da Corrida e o contrapé da iniciativa** | sem número | **nenhuma**: sem ocasião nesta bateria e sem instrumento no log | **não** |
| 5 | **a parada abre todos os golpes do Tick**, e não só um | **10,7%** · 125.031 | `R:175` | **sim, no mesmo commit do item 3** (ver "o item 3 já ENTREGA o item 5", acima) |
| 6 | **o L25**: as quinze bandeiras lidas pelo motor | **zero** para o mestre | · | **não** |
| 7 | **o avanço MOSTRA o percurso em vez de pedir confirmação**: ver não é clicar | **6,0%** · 71.212 dos 74.207 | `R:144` e `R:126`, e é **derivado**: 74.207 − 2.995 | **não** |

**A ordem não é a numeração, e o primeiro da fila não é o maior.**

| ordem | item | por quê aí |
|---|---|---|
| 1º | **4** · as duas contas exibidas e não aplicadas | é piso de tudo o que está publicado: enquanto elas existirem, o total de `R:169` assume zero correção à mão |
| 2º | **gravar o par (veredito da régua, botão do mestre)** em caminho de produção | a coisa mais barata da fila, e a única que transforma a banda de 0 a 17,0% num número. Uma coluna e uma escrita, fora do `?lances=1` |
| 3º | **1** (34,0%) e **3** (32,0%) | os dois maiores, os únicos com procedência de agregado, e independentes entre si |
| 4º | **5** (10,7%) | refinamento do 3 |
| 5º | **2** (0 a 17,0%) | só depois de o número existir. Antes disso, fazê-lo é apostar dezessete pontos numa premissa refutada |
| 6º | **6** · o L25 | zero para o mestre, e destrava a segunda bateria |
| · | **7** | é ESCALA: decidir se o mestre precisa confirmar cada Tick em que algo acontece é decisão de jogo |

**O item 4 não bloqueia o item 2**, e o argumento está na seção do botão: a correção
das duas contas acontece **acima** do botão, em campos que ficam. Ele vem primeiro
por ser piso do que já está publicado, e não por bloqueio.

Todas as linhas abaixo são **derivadas por subtração** do total de `R:169`, com o
tamanho de cada item vindo da tabela da fila:

| até onde se vai | trabalho do mestre | teto | a subtração |
|---|---:|---:|---|
| hoje | 1.171.957 | · | `R:169` |
| itens 1 e 3 | 398.476 | 66,0% | − 398.476 − 375.005 |
| + item 5 | 273.445 | 76,7% | − 125.031 |
| + item 2, se a banda fechar em 17,0% | 74.207 | 93,7% | − 199.238 |
| + item 7 | ~2.995 | **99,7%** | − 71.212 · o que sobra são os redirecionamentos, `R:126` |

**Os 93,7% e os 99,7% dependem do item 2 valer 17,0%, e ele vale entre 0 e 17,0%.**
Com o item 2 em zero, a escada para em **76,7%**. É a diferença entre um número e
uma banda, e ela é grande.

**O teto do projeto não é 61,8%.** Cada vez que alguém escreveu um teto nesta
frente, ele era o alcance dos consertos que estavam desenhados naquele dia, e a
frase que o acompanhava dizia "natureza". Três vezes. **Estes também são o alcance
dos consertos desenhados até hoje**, e a pergunta do que tiraria o resíduo está
respondida no item 7.

### O que sobra para o mestre FAZER, e não é conclusão, é material

**Isto não decide nada.** É o levantamento para a pergunta que só o humano responde:
depois dos sete degraus, o mestre ainda joga ou virou espectador de uma simulação?
Tudo abaixo sai do log que já existe, sem bateria nova.

**Os momentos de DECISÃO que o motor tem.** Das sete paradas que o Tick produz, três
são escolha e quatro não são:

| parada | classe | é decisão? |
|---|---|---|
| **declarar** | i | **sim**: a ação, o alvo, a manobra, o modo de deslocamento |
| **fugir** | ii | **sim**: a peça decide sair da cena |
| **redirecionar** | i | **sim**: para onde vai o golpe cujo alvo já caiu |
| agenda | iii | não: sai calculada da declaração |
| reprojetar | iii | não: o motor recalcula dentro do avanço |
| resolver | iii | não: é a folha, e a folha é transcrição |
| aplicar | ii | não: transcreve uma comparação que a tela já fez |

**Não há um quarto tipo de decisão no motor.** O que existe fora dessa lista é o
mestre querer interromper por vontade própria, para narrar ou arbitrar, e isso não é
parada nenhuma: não está instrumentado e não se mede assim.

**Quantas, nas 9.600 batalhas da população publicada:**

| | ocasiões | por batalha | procedência |
|---|---:|---:|---|
| declarar | 247.065 | 25,7 | `R:124` |
| fugir | 7.570 | 0,8 | `R:125` |
| redirecionar | 2.995 | 0,3 | `R:126` |

**E aqui está a virada, e ela desfaz o "espectador".** Todo o cálculo desta frente
foi feito com **dois robôs**, e por isso `declarar` custou zero gesto. Numa mesa de
verdade o mestre **joga os inimigos**: as declarações de um lado inteiro passam a ser
dele. A repartição está medida:

Todas as linhas são **derivadas**: a repartição das declarações por lado sai de
`R:191`, e a soma junta a metade das fugas (`R:125`) e os redirecionamentos (`R:126`).

| quem o mestre joga | decisões dele | por batalha | a soma |
|---|---:|---:|---|
| ninguém, só arbitra | 2.995 | 0,3 | só os redirecionamentos |
| o lado `a` (116.293 declarações) | 123.073 | 12,8 | **derivado**: 116.293 + 3.785 + 2.995 |
| **o lado `b` (130.772 declarações)** | **137.552** | **14,3** | **derivado**: 130.772 + 3.785 + 2.995 |

**A distância média entre duas decisões do mestre, depois dos sete degraus:**

| | Ticks entre decisões |
|---|---:|
| mestre sem peça em cena | **125,2** |
| mestre jogando um lado | **2,7 a 3,0** |

Uma batalha da população tem **39,1 Ticks** em média.

**A leitura, e ela é a resposta ao "vira espectador":** o mestre sem peça nenhuma em
cena decide **uma vez a cada três batalhas inteiras**, e isso é assistir. O mestre
que joga os inimigos, que é o caso normal, decide **a cada 2,7 Ticks**, catorze vezes
por batalha, e isso é jogar. **Os sete degraus não tiram nada do lado que decide:**
eles tiram a transcrição, e a transcrição estava misturada com a decisão na mesma
tela.

**O que este número NÃO diz**, e é a mesma ressalva de sempre: numa cena real o
número de peças de cada lado não é metade da cena, e a frequência com que um mestre
quer interromper de propósito não é parada nenhuma no motor. As duas puxam para
lados opostos e nenhuma está medida.

### Os 21 campos da folha, pela linha

A folha tem 21 campos editáveis, todos nascendo **preenchidos** pelo cálculo da
régua, e a edição é **efêmera por padrão**: fixar o valor até o fim do combate é um
segundo gesto deliberado, uma caixinha. Editar um deles é o mestre dizendo "neste
lance este número é outro".

**Quatro são custo**, e são exatamente onde as correções da §C2 aterrissam:

| # | campo | o que se aplica à mão ali |
|---|---|---|
| 12 | Defesa (base) do alvo | a Defesa −4 da Corrida, e o Bloqueio ou Defesa da arma e escudo |
| 14 · 15 · 16 | Absorção · impacto, corte, perfuração | a Couraça de Porte |

**Os outros dezessete não são.** O campo 1 é escolher a arma, que está do lado do
jogo. Os campos 2 a 6 são o tempo da ação, que é a mesma família de escolher a
manobra. Os campos 7 e 8, o bolo de acerto e o dano, parecem candidatos e não são:
toda correção da §C2 que os afeta é digitada nos campos de ajuste e de dano, e não
neles. O campo 21, Pressão sofrida, o Grid calcula **e aplica**. Os seis campos de
passo, a Defesa Mental e a Resistência a perfuração não recebem correção nenhuma.
Mexer em qualquer um dos dezessete é o mestre julgando uma situação que a regra não
modela, e isso nenhuma automação tira, porque nenhuma automação adivinha um
julgamento.

**O alvo real da folha não é a folha inteira nem os 21**: são quatro deles, mais os
**quatro campos que abrem em branco** e não estão entre os 21, que são a digitação de
verdade.

## 3 · O QUE AS RODADAS 02, 03 E 04 ACRESCENTARAM A ESSA FILA

**Nada.**

A fila da seção 2 é hoje exatamente a que a `09` publicou antes das três rodadas.
Nenhum item entrou, nenhum saiu, nenhum mudou de tamanho.

> **A fila mudou depois, e não foi rodada que a mudou.** Foi a linha entre custo e
> jogo, escrita pelo humano e não medida por ninguém: ela renomeou o item 1,
> reescreveu o item 3, acrescentou o item 4 e derrubou a leitura de que os 61,8%
> eram um limite. **Uma frase de definição mexeu na fila mais que três rodadas de
> medição**, e isso não é acusação a elas: as rodadas mediram bem o que lhes foi
> pedido, e o que estava errado era a pergunta.

O que as três rodadas produziram foi: um número novo (a repartição das declarações
por lado, na rodada 03), a refutação de uma explicação publicada, o diagnóstico da
causa dessa refutação, e conserto de instrumento. Nenhuma dessas coisas é um
conserto do Grid, e nenhuma mudou quanto os consertos da fila valem.

**O achado da rodada 04, a conferência que fiz dele, e o conserto.** A rodada 04
localizou a causa da assimetria entre os dois lados: a montagem da cena dá ordinais
0 a n−1 ao lado `a` e n a 2n−1 ao lado `b`, e a iniciativa de cada peça era derivada
do ordinal. Como o ordinal não muda de batalha para batalha, **a iniciativa era a
mesma nas 21.600**, e o desempate da fila saía decidido antes de a cena começar: nas
células de uma peça por lado, o lado `b` tirava 6 e o lado `a` tirava 0 em 100% das
batalhas. **É defeito de harness**, e não achado de jogo.

A mesma função tinha um segundo defeito, achado ao consertar: ela não devolvia um
d6. O deslocamento com sinal fazia o resto sair negativo, e o resultado ia de −4 a 6,
onze valores.

**Consertado:** a iniciativa passou a sair da semente da batalha, e não do ordinal. O
espelho continua concordando nas duas sementes de todas as cenas, porque ele já
mandava a semente ao mock pela URL. A distribuição agora é uniforme de 1 a 6, medida
em 20.000 sementes.

**O que o conserto mudou**, medido nas células `unissono`, em que os dois lados são o
mesmo arquétipo e por isso qualquer assimetria é defeito:

| | antes | depois |
|---|---:|---:|
| declarações do lado `b` por declaração do lado `a`, uníssono | 1,178 | **1,031** |
| a repartição publicada | 45,1% / 54,9% | **47,1% / 52,9%** |
| o trabalho do mestre | 1.095.869 | 1.171.957 | antes: `09-bmtlxp622.txt`; depois: `R:169` |
| a economia do avanço, modo `mesa` | 11,4% a 20,0% | 10,8% a 17,9% |
| **o fim da escada** | **38,2%** | **38,2%** |
| **o teto dos três degraus então desenhados** | **61,8%** | **61,8%** |

**As duas últimas linhas não se mexeram**, e é o resultado que mais importa: o
defeito inflava e desinflava os totais, e não mudava a proporção entre os três termos
nem o teto. Nenhuma conclusão da frente dependia dele.

**O que NÃO ficou explicado:** nas células `coprimo` a razão continua em 1,290, e ali
não é defeito, porque os dois lados têm arquétipos diferentes de propósito e ciclo
diferente declara em cadência diferente. Mas no uníssono sobram **1,031**, e esses 3%
não têm causa nomeada.

O aviso da rodada 04 afirma também que a assimetria existe na mesa, porque a mesa
compartilharia a montagem da cena, e a revisora deu isso por confirmado. **Conferi,
e é falso.** A montagem da cena e a derivação da iniciativa moram só em `scripts/`,
e nada em `src/` as importa. O que o espelho comparou foi o harness contra
`scripts/mesa-mock.mjs`, que é uma imitação da mesa e chama a mesma função do
harness: a assimetria aparecer nos dois lados dessa comparação é circular, e não
evidência sobre o Grid. No Grid de verdade a iniciativa é rolada pelo mestre num
botão e guardada no banco, e ordinal nenhum entra nela.

**Consequência:** o conserto é do harness, é local, e não tem acoplamento com a
mesa. A decisão que a rodada 04 escalou para o humano estava apoiada nesse
acoplamento, que não existe. O conserto não foi feito aqui porque esta passada é só
o documento.

---

## 4 · O QUE FOI FEITO NO INSTRUMENTO desde a `09`

- o `declarar` contado por lado no log, que é o que permitiu medir a mesa em que só
  um lado declara à mão;
- a tabela do `G` publica **dois denominadores**, o do mestre e o da mesa, porque
  gesto de jogador não entra na conta do mestre;
- o agregador ganhou `--gravar`: a saída inteira vai para um arquivo versionado, e é
  dele que os documentos citam linha;
- o agregador carimba **o próprio commit**, e não só o da bateria;
- uma trava que para o agregador se a repartição por lado não somar o total em
  algum tipo de parada;
- `test-procedencia.mjs`, no portão: a linha citada de um agregado tem de conter o
  número citado;
- o placar dos alarmes foi refeito a partir do agregado versionado, e o sinal
  `ocasião · passo`, que guarda o piso de 11,4%, entrou nele;
- a hipótese sobre a origem do número órfão 4.409.780 foi testada na árvore antiga e
  descartada;
- na caixa de revisão: o `nada` de uma seção passou a aceitar justificativa em prosa;
  a digital da repetição deixou de tratar um identificador igual como assunto igual;
  a chamada que morre passou a dizer por que, lendo o stdout; o custo de uma chamada
  morta deixou de valer zero; e o teto de custo passou a ser por assunto, com o
  acumulado persistido entre execuções;
- o princípio do zero ambíguo foi de três casos para oito, e ganhou a lista do que
  foi cortado, que é o instrumento do oitavo.

---

## A fila da seção 2 mudou por causa das rodadas 02, 03 e 04?

**Não mudou, e nem podia:** as três rodadas mediram o mesmo Grid com o mesmo robô, e
uma medição do que já existe não altera quanto vale mudar o que existe. Toda a
diferença que elas fizeram foi na confiança dos números e na qualidade do
instrumento, que é trabalho real e não é conserto de mesa.

**Para a fila mudar, uma rodada precisa medir uma coisa que não está na mesa hoje**,
e não medir de novo a que está: um Grid com o avanço unificado implementado, ou uma
mesa de verdade com jogadores declarando, ou as bandeiras ligadas. Enquanto a
bateria rodar contra o produto de hoje, ela pode melhorar a precisão dos quatro
números da fila, mas não pode acrescentar nem remover um item dela.

**E uma coisa mudou a fila depois, sem rodada nenhuma:** a linha entre custo e jogo.
Ela renomeou um item, reescreveu outro, acrescentou um terceiro e derrubou a leitura
de que 61,8% era teto. **Definir o que se está medindo mexeu mais na fila que medir**,
e a lição para a próxima frente é essa: a pergunta vem antes do instrumento.
