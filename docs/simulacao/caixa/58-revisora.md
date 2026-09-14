# Rodada 58 · resposta da revisora (a família do gatilho `armadilha`, medida)

Revisora: aviso em `48b8bdf`. BASE `594f9ac`, SHA do trabalho `59d332f` (medição em `f9874cf`),
TOPO `48b8bdf`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `48b8bdffde039ccfa2aee650cf8680b2c103d5d7`. Batem. Árvore limpa antes e
depois da reancoragem.

`git diff --stat 594f9ac..59d332f`: dois arquivos, os dois novos, 377 inserções,
`--name-only -- src/` = **0**. A frase "nenhuma linha de `src/` mudou" procede.

**E a conferência que vem antes de qualquer citação valer.** O documento dela declara
`BASE = SHA = TOPO = f28387f`, e eu estou em `48b8bdf`, um commit adiante.
`git diff --name-only f28387f..48b8bdf -- src scripts supabase` = **0 arquivos**: a faixa
inteira entre a árvore que ela mediu e a que eu li são quatro documentos. Todo `arquivo:NNN`
dela é válido no meu pino, e este não é o caso da "base que não é o HEAD".

## O `main` andou embaixo da revisão, e o que eu fiz com isso

Terminada a revisão, antes de commitar, o `git fetch` mostrou `origin/main` em **`e1c84c5`**
("Rodada 58: tres consertos meus no relatorio, e um deles muda o preco"), um commit à frente do
meu pino, tocando os dois documentos da rodada e **zero** arquivos em `src`, `scripts` ou
`supabase`.

**Eu não reancorei** (§0, e a ordem do Arquiteto). O que fiz foi ler o `diff` daquele commit,
por um motivo só: publicar como aberto um item que já foi fechado é status velho, e status velho
num veredito é pior do que achado nenhum. **O escopo dessa leitura é o `diff` dos dois
documentos entre `48b8bdf` e `e1c84c5`, e não uma revisão nova de `e1c84c5`.** Tudo o mais neste
arquivo é sobre `48b8bdf`, que é o commit do aviso.

O que o `e1c84c5` muda para este veredito está dito em cada seção, no lugar dela. Em resumo: um
dos meus dois CORRIGE **já estava consertado quando cheguei**, achado por ela e por mim em
separado, e a pergunta que eu ia dizer que faltava **já existe lá como `P7b`**.

## Os números, refeitos por mim

Rodei o script de medição dela, sobre `src/data/efeitos.json`, e os seis números batem exato:
140 Efeitos, os 4 da família, 6 valores de gatilho, `27/4/13/83/4/9`, 23 de `forma: "alvo"` com
condição, `18/2/2/1` por gatilho dentro desses 23.

Conferi o que a soma pressupõe e o relatório não diz: `27+4+13+83+4+9 = 140` só fecha se **todos
os 140 tiverem bloco `grid`**. Têm. Zero sem `grid`, zero com `gatilho` nulo dentro dele.

As **13 citações de linha** do documento foram conferidas uma a uma, pelo número: batem todas.

## As quatro premissas

**A premissa 1 (são exatamente estes quatro) eu não conferi contando o campo, e o motivo é o
achado dela.** O bloco `grid` é gerado, e li `gatilhoDe` (`scripts/gen-grid-artes.mjs:297`): o
valor `armadilha` só sai da **lista à mão** de `gen-grid-artes.mjs:162`, não há segundo caminho
que o produza. Então contar `gatilho === 'armadilha'` no JSON mede a lista, não a família · é um
portão que casa por literal com a forma invertida.

A varredura que discrimina é a da **prosa**. Varri o texto dos 140 Efeitos por vinte padrões de
linguagem de armadilha (`dorme`, `adormec`, `pisar`, `até alguém`, `esperando`, `se gasta`,
`presa`, `guardad`, `hora combinada`, `tempo combinado`, `latente`, `aciona`, e outros). Cinco
candidatos fora dos quatro, lidos um a um:

| candidato | o que casou | por que não é |
|---|---|---|
| `projetil-conjurado` | "se gasta" | "se gasta no golpe": é arma consumida pelo ataque, `ao-tocar`, não dorme |
| `aviso` | "presa" | casou dentro de "surpresa"; e é `condicaoAparente`, sem forma |
| `servo-menor` | "tempo combinado" | é a duração do serviço do espírito, não uma hora de detonar |
| `campo-de-alivio` | "até alguém" | "até alguém tratar de verdade": é a ressalva da cura, não uma porta |
| `fogo-que-nao-apaga` | "quando alguém" | "quando alguém desfaz a magia": é o Dissipar, e ele é `por-turno` |

**Não há quinto.** Escopo: varredura do campo `efeito` e do `nome` dos 140 de
`src/data/efeitos.json`, mais a conferência de que só a lista à mão produz o valor. Uma quinta
armadilha que não esteja escrita como armadilha na prosa **nem** na lista não seria alcançada por
esta varredura, e não sei de mecanismo que a criaria.

**As premissas 2 e 3 de pé, conferidas por mim.** A 2 pelo retrato de dados (brasa e semente
`zona`/`ponto`, cura-guardada e salvaguarda `alvo`/`alvo`). A 3 por três lados que concordam: o
tipo `Gatilho` (`src/lib/artes-grid.ts:122`), o vocabulário fechado do `validate`
(`scripts/validate-data.mjs:155`) e os valores que de fato existem no dado.

**A premissa 4 caiu, e a queda está certa.** As sete ocorrências nomeadas existem, nos números de
linha dados. (Em `48b8bdf` a frase dizia "sete ocorrências fora de `src/data/`", o que não fecha:
a palavra aparece em `.md`, em cabeçalho de `.sql` e em dois comentários sem relação do
`grid.astro`. O `e1c84c5` já trocou para "sete ocorrências EM CÓDIGO", que é o recorte certo, e
foi conserto dela, não meu.)

## O achado da `salvaguarda`: OBSERVADO, não lido

É a afirmação da qual tudo depende, então não me contentei em reler as quatro linhas e concordar.
Escrevi uma sonda própria, **fora da árvore** (no scratchpad da sessão, nada commitado e nada
sujo na worktree), com a mesma casca de DOM e o mesmo banco de mentira de
`scripts/test-arte-na-mesa.mjs`, e dirigi o caminho real: `gravarEfeito` e `verificarEfeitos` de
`artes-grid-mesa.ts`, com o Efeito `salvaguarda` **lido do catálogo, sem nenhuma edição minha**.

Onze observações, todas batendo:

- a linha gravada nasce com `gatilho = armadilha` e `condicao = protegido`;
- **o alvo fica `protegido` imediatamente depois da conjuração**, e `somarCondicoes` sobre a
  condição devolve `soak = 3`;
- a marca dura até o `ate_tick` da Duração comprada e nem um Tick a menos (caiu no Tick 21, com
  `ate_tick = 21`), sem nada a consumir antes;
- **e a cena que mede a promessa**: com a Salvaguarda de pé no alvo, conjurei uma segunda Arte
  arcana nele. A Arte **fez efeito** (o alvo ficou `imobilizado`) e a Salvaguarda **continuou
  intacta**. As duas condições coexistem no alvo no fim. Ela não engoliu nada e não se gastou,
  que é exatamente o inverso do que o texto dela promete.

Dois controles, para o achado não depender de eu ter lido o caminho certo:

- **sem `condicao` no bloco** (mesmo Efeito, mesmo gatilho), nada cai no alvo: quem dispara o
  caminho é o campo `condicao`;
- **com o gatilho trocado para `passivo`** (mesmo Efeito, mesma condição), o resultado é
  **idêntico**: o caminho não olha o gatilho. É a afirmação dela, medida por diferença.

A alcançabilidade dela procede, e conferi o caminho por leitura, ponto a ponto: `conjurar` roteia
`forma === 'alvo'` para `grudarNoAlvo` sem nenhuma guarda de gatilho
(`src/lib/artes-grid-mesa.ts:838`), `grudarNoAlvo` grava com `alvos: [alvoId]`
(`src/lib/artes-grid-mesa.ts:1025`), e a condição entra no laço sobre `extra.alvos`
(`src/lib/artes-grid-mesa.ts:1622`). Refiz por conta própria a varredura das **sete** leituras de
`gatilho` em `src/`: são as linhas 893, 1031, 1544, 1557 e 2164 de `artes-grid-mesa.ts` e 1664 e
1679 de `artes-grid.ts`, e **nenhuma fica entre o menu e a gravação**. As duas primeiras (893,
1031) são de cura e de dano imediatos, e nenhuma recusa a conjuração.

**Uma corroboração que ela não usou, e que reforça o item.** O comentário logo acima da guarda
que aplica a condição diz, por escrito, que aquele ramo serve "18 dos 23 Efeitos de alvo com
condição, todos de gatilho `passivo`" (`src/lib/artes-grid.ts:1652-1654`). A guarda é
`if (ef.condicao && alvos.length)` (`src/lib/artes-grid.ts:1667`), sem teste de gatilho nenhum,
então ela admite estritamente mais do que os 18 que o comentário nomeia, e a `salvaguarda` é uma
das que entram · isso está observado na sonda, não deduzido. Não dou o número exato da população
porque ele depende de `dano_dados`, que é valor de tempo de execução e não de catálogo. É a forma
do comentário que afirma garantia: o próximo a ler confia nele em vez de conferir.

## O reúso do `dissipar` · medido por mim, e já consertado por ela em `e1c84c5`

**Esta ia ser a minha CORRIGE 1, e ela chegou primeiro.** Deixo a medição escrita porque duas
medições independentes que caem no mesmo lugar valem mais do que uma, e porque o aviso me mandou
julgar exatamente este ponto. O que segue eu apurei sem ter visto o `e1c84c5`.

O relatório, **na versão de `48b8bdf`**, afirma: *"A comparação de nível já está escrita e roda:
`dissipar` compara `(e.nivel || 1) <= meu` contra os pontos investidos, que é literalmente a
conta que a Salvaguarda pede. O gatilho seria reúso, não mecanismo novo."* A aritmética é a
mesma; **a pergunta não é**, e o que separa as duas é onde mora cada lado da comparação.

- No `dissipar`, `meu` é `plano.custo.total` (`src/lib/artes-grid-mesa.ts:1051`): os pontos que
  quem está conjurando **AGORA** investiu, lidos do plano vivo. O outro lado é o `nivel` de uma
  linha que já está no tabuleiro.
- Na `salvaguarda`, é o contrário, membro a membro: o lado vivo é o Efeito que **chega**, e o
  lado guardado é o investimento feito **antes**, na linha da própria Salvaguarda.

**E esse número não existe em lugar nenhum.** `plano.custo.total` aparece **uma vez só** em
`artes-grid-mesa.ts` e `artes-grid.ts` somados, e é a linha 1051, dentro do próprio `dissipar`:
ele nunca é gravado. A coluna `nivel` da linha não serve de substituta, e o cabeçalho da migração
19 diz por quê com todas as letras: ela é "o nível EFETIVO da conjuração: o do Efeito comprado, ou
o maior parâmetro investido no improviso", e "é por este numero que o Dissipar decide o que
consegue apagar" (`supabase/migracao-19.sql:34-37`). Para um Efeito de catálogo isso é
`plano.efeito.nivel`, que na Salvaguarda é **1, fixo**, dê-se quantos pontos se der. `nivel_arte`
é outro número (o nível da Arte de quem conjurou), não o investimento.

Então o item B não é "um lugar novo no caminho da conjuração" com a conta de graça: ele precisa de
um número que hoje não tem coluna, e coluna nova é migração, que é a classe de custo que esta
rodada foi medir. **O preço de B está subestimado pela metade que carrega.**

**E o `e1c84c5` chega exatamente aqui, por caminho próprio.** Ela reescreveu a linha do item B
para "**médio, e com migração**, não o 'reúso' que eu escrevi primeiro", com o mesmo argumento
(`custo.total` só existe durante a conjuração, `nivel` é o de catálogo e na Salvaguarda é sempre
1, e ela é `escalonavel: true`, então o investido é justamente o que varia). Conferi as quatro
citações novas dela pelo número de linha, em `e1c84c5`: `artes-grid-mesa.ts:912`, `:1000`,
`:1051`, `:1528` e `artes-grid.ts:377` batem todas. **O item está fechado, e não o reabro.**

Duas coisas minhas que o conserto dela não cobre, e as duas são pequenas:

- **`(e.nivel || 1)`.** Reusado como está, um Efeito que chegue com `nivel` nulo ou zero lê como
  1 e é **sempre** engolido. No `dissipar` o `|| 1` é uma tolerância barata, porque o pior caso é
  oferecer na lista uma linha estranha; na Salvaguarda ele decide o que a marca come sozinha, sem
  ninguém na frente. Vale a nota para quem escrever o B, não item próprio.
- **A fonte a mais que o texto dela não usa é o próprio esquema**, citado acima: o cabeçalho da
  migração 19 já dizia, desde que a tabela nasceu, que `nivel` é o número do Dissipar. O
  argumento não depende só de ler `gravarEfeito`; ele está escrito na definição da coluna.

## CORRIGE · a frase do `ao-tocar` contradiz o QUEBROU da mesma rodada

**Conferido que continua aberto em `e1c84c5`:** a frase está lá, na linha 332 daquela versão.

A última seção afirma: *"O `armadilha` é o único pulado na varredura sem que ninguém mais o
pegue."* A frase está num parágrafo que contrasta famílias, e o contraste que ela faz para o
`passivo` é justamente "são pulados porque o ramo de condição do `planoDaSaida` já os pega". Esse
mesmo ramo pega a `salvaguarda`, que é o achado central da própria rodada · e pega errado, que é
pior do que não pegar.

Lida ao pé da letra, a frase diz que nenhum dos quatro tem comportamento hoje, que é o inverso do
QUEBROU. Quem abrir este documento para fazer o item A ou o B vai ler as duas coisas. É uma
oração, e a precisão custa uma linha: o `armadilha` é o único pulado na varredura **sem que
ninguém resolva o gatilho dele**, e um dos quatro ainda assim é apanhado pelo caminho da condição,
que não é o gatilho.

## PERGUNTA · duas estão mal formadas (a décima já foi achada por ela)

Não respondo nenhuma e não digo qual leitura é melhor. Tudo abaixo é de forma.

**P1 esconde uma terceira leitura, e quem a nomeia é a P2.** A P1 oferece "(X) o tempo combinado
existe e é um parâmetro novo que a conjuração pergunta" ou "(Y) não existe, e a frase sai do
texto". A P2, uma pergunta depois, oferece em (Y) que a armadilha DETONE ao vencer, "o que resolve
o P1 de graça: a hora combinada vira a própria Duração comprada". Isso é uma terceira resposta
para a P1 (existe, e não é parâmetro novo) que a P1 não oferece. Do jeito que estão, responder a
P2 responde a P1 sem que quem responde saiba que respondeu · e responder a P1 primeiro descarta
uma opção da P2 sem vê-la. As duas são uma pergunta só, ou a P1 precisa da terceira porta escrita
nela.

**P6 mistura um fato medível com uma decisão de regra.** O enunciado pergunta se a classificação
foi "escolhida ou herdada", que é pergunta de histórico e tem resposta em `git`; as três opções
são todas de desenho (o que a regra deve passar a ser). O humano não tem como responder à primeira
metade, e a segunda não depende dela. **Medi a primeira metade:** `'salvaguarda'` entre aspas
simples entra no repositório inteiro num commit só, `2540221` ("Artes no tabuleiro"), e as duas
listas à mão nascem **nele, juntas** · a do `armadilha` (`gen-grid-artes.mjs:162`) e a do
`protegido` (`:247`). O Efeito já existia no dado desde `495f0b4`. Escopo: história do repositório
por essa string, não história da divergência. Nem escolhida depois nem herdada de antes: as duas
classificações foram escritas no mesmo ato, o que não é nenhuma das duas palavras do enunciado. A
decisão de regra continua inteira e é do humano; o fato sai da lista.

**A décima que faltava JÁ FOI ESCRITA, e não por mim.** Em `48b8bdf` nenhuma das nove perguntava
**contra o quê** a Salvaguarda compara, e eu ia levantar isso: "nível igual ou menor ao
investido" tem leituras que dão implementações de tamanhos diferentes. No `e1c84c5` isso é a
`P7b`, com três leituras nomeadas (`custo.total`, que pede coluna; `nivel_arte`, que já existe;
o nível do Efeito, que na Salvaguarda é 1 fixo). Ela chegou às mesmas três e uma delas eu não
tinha visto (o `nivel_arte` como candidato). **Está formada, e não tenho reparo.**

Só um cuidado de forma, de uma linha: a `P7b` diz que a resposta "decide se o item B leva
migração", e a tabela de preços logo acima dela, no mesmo documento, já afirma "médio, **e com
migração**". A tabela responde a pergunta antes de o humano chegar nela. Uma das duas cede: ou a
tabela diz "médio, e com migração se a P7b for (X)", ou a `P7b` deixa de dizer que o preço está
em aberto.

## O que eu NÃO conferi

- **Não dirigi o caminho do navegador.** A sonda entra em `gravarEfeito`, que é o mais alto que
  roda em Node, pelo mesmo motivo que o `test-arte-na-mesa.mjs` entra ali. O trecho acima dele
  (`conjurar` abrindo o assistente, o menu escolhendo o Efeito) eu conferi por **leitura**, e digo
  isso em vez de deixar implícito que observei.
- **Nenhum teste automatizado deste repositório toca a `salvaguarda`.** `grep` por ela em `src/`,
  `scripts/` e `supabase/` fora do JSON dá três ocorrências, e as três são as duas listas do
  gerador mais um comentário da migração 39. A cobertura dela hoje é zero, e a sonda que escrevi
  não fica: ela é de revisão, não de portão.
- **Não medi os outros sete Efeitos da lista do `protegido`** (a D03 dela). Conferi só o que a
  afirmação central precisa: dos oito, quatro são de `forma: "alvo"`, e desses quatro três são
  `passivo` e um é a `salvaguarda`. Isso sustenta o "um dos quatro vaza e três não"; se os outros
  sete divergem do próprio texto, continua sem ninguém olhando, como ela mesma registrou.
- **Não conferi a alcançabilidade em produção** (RLS, retorno do PostgREST). Não se lê do
  worktree, e o achado não depende disso.

## Portões

`npm run validate`: `EXIT=0`, portões OK. A sonda da `salvaguarda`: 11 observações, `EXIT=0`.

`node scripts/test-procedencia.mjs`: `EXIT=0`, 288 citações de código conferidas por âncora. **E
o escopo dele não é o que o verde parece dizer:** li a lista de arquivos do portão
(`scripts/test-procedencia.mjs:320-326`) e ela é FIXA, doze documentos nomeados à mão, e
`docs/simulacao/caixa/` não está entre eles. Então nem o documento dela nem este aqui passaram por
esse portão · o verde é sobre outros arquivos. Quem conferiu as citações destes dois fui eu, à
mão, uma por uma, imprimindo a linha citada: as 13 dela e as minhas.

## Travessão

Varridos os **arquivos**, não o diff (o `git` aqui passa por hook que encolhe a saída):
`58-executora.md`, `progresso-armadilha.md`, `58-aviso.md` e o meu `progresso-revisora-58.md`,
**zero** em cada um. Este arquivo, varrido antes do commit: zero.

## BLOQUEIA

Nada bloqueia.

## ESCALA

Nada novo que valha item próprio. O comentário de `artes-grid.ts:1652-1654` (a garantia dos "18, todos
`passivo`", numa guarda que não olha gatilho) é de código que a rodada não tocou e sobre o qual ela
não prometeu nada, mas ele mora dentro do item B e morre junto com ele: cabe consertar quando o B
for feito, não abrir linha agora.

## VEREDITO

**A rodada 58 PROCEDE. Sobra UM CORRIGE, de documento, pequeno, e ele é de uma oração.**

A medição é boa e é honesta: os seis números refazem exato, as treze citações batem no número de
linha, a premissa que caiu caiu pelo motivo certo, e o achado central **eu observei em vez de
reler** · a Salvaguarda de nível 1 põe `protegido` no alvo, vale `soak = 3` pela Duração inteira,
deixa passar a Arte que chega e não se gasta, e com o gatilho trocado para `passivo` o resultado é
idêntico, que é a prova por diferença de que o caminho não olha o gatilho. Não achei um quinto, e
digo o escopo da varredura que não o achou.

**O que sobra é a frase final sobre o `ao-tocar`**, que contradiz o QUEBROU da própria rodada para
quem a ler ao pé da letra, e continua lá em `e1c84c5`. Quem abrir este documento para fazer o item
A ou o B lê as duas coisas.

**O que eu ia trazer como achado principal chegou primeiro, por conta dela.** O `e1c84c5` corrige
o reúso do `dissipar` e cria a `P7b`, que são exatamente o meu CORRIGE 1 e a minha décima
pergunta, achados em separado e com o mesmo argumento. Deixei a minha medição escrita porque duas
medidas independentes no mesmo ponto valem mais que uma, e porque a conferência do item era o que
o aviso pediu · não como item aberto. Fica só a nota do `|| 1`, para quem escrever o B.

Das perguntas de regra, duas estão mal formadas por forma e não por conteúdo: a **P1** esconde uma
terceira leitura que a própria **P2** nomeia (responder uma responde a outra sem que quem responde
saiba), e a **P6** mistura um fato de histórico, que eu medi (as duas listas nascem juntas em
`2540221`), com uma decisão que é do humano. Mais o cuidado de uma linha entre a `P7b` e a tabela
de preços, que hoje já responde a `P7b` antes dela.

Nenhuma delas foi respondida por mim, e não digo qual leitura é melhor em nenhuma.
