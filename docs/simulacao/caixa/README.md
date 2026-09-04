# A caixa de correio

**Este é o ÚNICO canal entre a executora e a revisora.** Duas instâncias, dois
worktrees, nenhuma memória compartilhada: **o que não está escrito aqui não existe
para a outra.** Contexto de chat, raciocínio que ficou na cabeça, decisão tomada e
não anotada · nada disso atravessa. Se importa, está num arquivo desta pasta.

## Quem é quem

| | o que faz | o que escreve |
|---|---|---|
| **executora** | roda, mede, implementa, escreve os documentos | o repositório inteiro, e o `NN-executora.md` |
| **revisora** | lê o código e os documentos no commit avisado, e responde | **só** `NN-revisora.md`, e nada fora desta pasta |

**A revisora nunca escreve código.** Não corrige, não commita fora daqui, não roda
bateria. Ela lê um commit congelado e escreve um arquivo.

## Os arquivos

```
docs/simulacao/caixa/
  README.md              este arquivo
  MODELO-executora.md    o formato fixo do aviso
  01-executora.md        o aviso da rodada 1
  01-revisora.md         a resposta da rodada 1
  02-executora.md        ...
```

`NN` de **01** em diante, dois dígitos, sempre em par: um aviso, uma resposta.

## O fluxo de uma rodada

**Da executora, ao terminar:**

1. commitar tudo · código, testes, documentos, resultados de bateria;
2. `npm run rodada` · cria o `NN-executora.md` a partir do modelo, com o sha do
   HEAD já preenchido, e recusa rodar se a árvore estiver suja;
3. preencher as seis seções do arquivo;
4. `npm run rodada -- --enviar` · commita com `rodada NN · aviso à revisora`.

**Da revisora, ao ser chamada:**

```
git -C <worktree> fetch && git -C <worktree> checkout <sha>
```

O `<sha>` é o que o `--enviar` imprime, e ele é o **commit do aviso**, e não o da
seção COMMIT do arquivo. **São dois shas e isso é de propósito:** um commit não
pode conter o próprio sha, então o aviso escrito antes de ser commitado só sabe o
do código. Os dois têm a **mesma árvore de código** (o commit do aviso só
acrescenta um arquivo de texto), então mandar a revisora para o do aviso é o que
faz ela ver, com um checkout só, o código avisado **e** o aviso sobre ele.

O checkout congela a visão dela naquele commit, que é o certo: **ela revisa o que
foi avisado, e não um alvo em movimento.**

## O revezamento automático · `npm run duo`

O ciclo pode correr sem humano no meio: `scripts/duo.mjs` alterna chamadas
`claude -p` nas duas pastas, uma rodada de cada vez. **O canal continua sendo
esta pasta**: o script não passa contexto de uma para a outra, ele só chama na
ordem certa, move o commit e conta o dinheiro.

```
npm run duo                 · o ciclo com os padrões
npm run duo -- --rodadas 3  · teto de rodadas
npm run duo -- --custo 12   · teto de custo, em dólares
npm run duo -- --timeout 20 · teto por chamada, em minutos
npm run duo -- --seco       · imprime o que faria e não chama nada
npm run duo -- --fumaca     · UMA chamada real mínima em cada lado
npm run duo -- --alvo "..." · o alvo da execução, escrito pelo humano
```

### O seco e a fumaça, e nenhum substitui o outro

| | o que prova | o que NÃO vê | custa |
|---|---|---|---:|
| `--seco` | o caminho das **decisões**: cada trava conferida, o commit que seria avisado, onde o ciclo pararia | qualquer falha de **invocação**: ele não chama processo nenhum | zero |
| `--fumaca` | o caminho do **processo**: o `claude` é achado, o stdin chega, a saída é JSON, o custo é lido, nos dois worktrees | qualquer falha de **decisão**: o prompt é "responda ok" | centavos |

**A fumaça é o passo anterior a toda execução molhada.** A primeira molhada morreu
na primeira chamada com o prompt partido pelo shell, minutos depois de um seco
limpo: a classe inteira de falha de invocação era invisível para ele.

### Os limites, e por que estes

| | valor | por quê |
|---|---:|---|
| rodadas | **6** | o pedido. Ao bater, para e resume: nunca "só mais uma" |
| custo | **US$ 25** | medido, e não estimado: a rodada 02, que tratou dois BLOQUEIA, custou US$ 12,89 (executora 9,48 · revisora 3,41). Vinte e cinco compra duas dessas. **Errar para baixo é o lado certo**: parar cedo custa uma rodada e um `--custo` maior na próxima; parar tarde custa dinheiro que ninguém autorizou |
| por chamada | **30 min** | a executora roda bateria (30 s) e escreve documento. Falha de chamada **encerra**, e não tenta de novo |
| repetição | **0,6** de semelhança | heurística sobre os identificadores do item (crases, `§x.y`, `L25`) e, quando há um identificador só, também sobre as palavras. Erra para o lado de parar, que é o barato |

**O teto de custo é conferido DEPOIS DE CADA CHAMADA**, e o acumulado sai
impresso contra o teto toda vez. Era por rodada, contra a rodada anterior mais
cara, e a primeira rodada não tem anterior: a execução da rodada 02 foi aberta com
teto de US$ 8, custou US$ 12,89, e nada acendeu. Conferir na porta da rodada
seguinte é conferir depois de gastar.

### O teto é por ASSUNTO, e não por execução

O acumulado mora em `gasto-acumulado.json`, nesta pasta, versionado. O `duo` o lê
ao abrir e confere o teto contra **o que o assunto já gastou mais o que esta
execução gastar**. Sem isso o teto reinicia a cada `npm run duo`, e dez execuções
seguidas com teto de US$ 25 são US$ 250 sem nada acender: um teto que reinicia não
é teto, é um relatório por execução.

**O registro ausente NÃO vale zero.** Sem arquivo legível o `duo` se recusa a
abrir, e diz como inicializar. "Nunca gastei nada neste assunto" e "não achei o
registro do que gastei" sairiam com o mesmo número, e o segundo é o que acontece
quando alguém apaga o arquivo, troca de máquina ou erra o caminho.

**O gatilho de zerar é o humano, e só ele:**

```
npm run duo -- --alvo "<o assunto novo>" --zerar "<por que está zerando>"
```

Zerar **grava, commita e sai**: não roda ciclo nenhum. Ser um comando separado é de
propósito. Se zerar fosse efeito colateral de rodar (uma flag que reinicia quando o
nome do assunto muda, digamos), um erro de digitação zeraria o teto sem ninguém
notar, e o teto por assunto valeria tanto quanto o por execução que ele substituiu.
O motivo é obrigatório e fica na história do arquivo. **O script nunca zera
sozinho, em nenhuma circunstância.**

**O que a conferência por rodada protegia continua protegido:** um aviso
commitado SEMPRE tem revisão.

| onde o teto estoura | o que o script faz |
|---|---|
| antes de abrir uma rodada | encerra. É o caso limpo: nada foi gasto nesta rodada |
| entre a executora e a revisora | **paga a revisora daquela rodada**, fecha o ciclo e não abre a seguinte. Abandonar aqui deixaria na caixa um aviso que ninguém revisou, que é pior que os três dólares da revisora |
| depois da revisora | a rodada já fechou. A seguinte não abre |

### As sete paradas, e todas são de fechar

teto de rodadas · teto de custo · veredito **PARA** · **SEGUE** duas vezes
seguidas (revisão esgotada) · **ESCALA** não vazia (encerra na hora, mesmo com
rodadas sobrando) · assunto repetido em duas respostas seguidas · árvore suja em
qualquer ponto. Mais a chamada que falha ou estoura o tempo.

### O que é ESCALA, e por que o veredito não ganha uma quarta palavra

**ESCALA não é só regra de jogo: é qualquer coisa que só o humano decide, inclusive
continuar ou não.** Escalar encerra o ciclo na hora, mesmo com rodadas sobrando.

**O caso da rodada 04**, que é o motivo de isto estar escrito: a revisora terminou
uma revisão em que nada técnico bloqueava e a rodada seguinte dependia de uma
decisão do humano. Faltou-lhe palavra no veredito, e ela inventou uma
(). A trava de formato encerrou o ciclo, corretamente, mas o que
faltava não era vocabulário: era o entendimento de que aquilo **é** ESCALA. Na mesma
resposta ela escreveu "nada" na ESCALA enquanto o aviso marcava algo como
precisando do humano, que é a mesma tensão pelo outro lado.

Então:

- o veredito tem **três** palavras e não ganha uma quarta. **Quando faltar palavra,
  é sinal de ESCALA**;
- a seção ESCALA **nunca diz "nada"** quando o aviso marca alguma coisa como
  precisando do humano.

### Como escrever "nada" numa seção, e por que a forma importa

O contrato pede a palavra `nada` quando não há o que dizer, e **corpo em branco
não vale**: em branco não dá para separar "olhei e não há" de "a resposta saiu
truncada". A regra que o script lê:

> **a primeira linha com texto é `nada`, e não há item de lista depois dela.**

A justificativa em prosa embaixo do `nada` é bem-vinda, e continua sendo `nada`:

```
## ESCALA

nada.

O aviso marca duas coisas como "precisa do humano" e eu não escalo nenhuma.
A medição responde as duas, e escalar aqui gastaria a parada mais cara do
script numa pergunta que não é de regra de jogo.
```

Um marcador de lista embaixo do `nada` é contradição, e volta a contar como
conteúdo: seguir por cima de uma escalada é o lado caro. **Isto está escrito
porque a rodada 02 parou por isso**, anunciando "a revisora ESCALOU" contra um
texto que dizia, em letras, que não escalava.

### A árvore da revisora, e o que NÃO conta como suja

O ciclo encerra com árvore suja em qualquer ponto, com **uma exceção, e ela é o
caminho normal**: um arquivo **não rastreado** dentro de `docs/simulacao/caixa/`,
no worktree da revisora, é o **produto do ciclo** e não sujeira.

A revisora escreve a resposta; quem commita é o script, depois. Entre uma coisa e
outra a árvore dela tem exatamente uma linha, `?? docs/simulacao/caixa/NN-revisora.md`.
No caminho feliz o script copia e apaga o arquivo antes da rodada seguinte, e a
trava não via nada. **Mas quando a chamada dela falha DEPOIS de ela escrever** (limite
de conta, tempo estourado) o arquivo fica, e a execução seguinte encerraria na
primeira trava, acusando a revisora de ter feito o trabalho dela.

O que continua encerrando, e a lista é curta:

- qualquer coisa **fora** da caixa, rastreada ou não;
- um arquivo **rastreado e modificado** dentro da caixa, que é resposta já commitada
  sendo editada;
- e, no worktree da **executora**, também o arquivo solto na caixa: lá trabalho por
  commitar encerra, porque o aviso tem de descrever um commit.

**A tolerância é anunciada e não silenciosa:** o que passa sai impresso no diário. Uma
trava que ignora em silêncio é a mesma família do zero ambíguo. A regra vive em
`scripts/duo-arvore.mjs` e tem dez casos em `scripts/test-duo.mjs`.

### Uma pegadinha do `git check-ignore`, para não custar tempo duas vezes

`git check-ignore node_modules` responde **"não ignorado"** quando o diretório não
existe. Não é furo do `.gitignore`: o padrão é `node_modules/`, com barra, e um
padrão com barra só casa com **diretório**. Sem o diretório no disco não há
diretório para casar.

Conferido criando o diretório, testando (casa), e removendo. **A instalação de
dependências no worktree da revisora não suja a árvore**, e quem for conferir isto de
novo pode parar aqui.

### Quando a chamada morre no meio

Uma chamada pode morrer por **limite de uso da conta**, e foi o que encerrou a
rodada 03. Não é defeito do ciclo, e o script não tem como prever: o `claude -p`
sai com 1 e escreve a razão no **stdout**, junto da resposta, e não no stderr.

Duas coisas seguem disso, e as duas estão no código:

- **o motivo lê os dois canos.** A rodada 03 encerrou com "saiu com 1: " e nada
  depois dos dois-pontos, porque o motivo só citava o stderr, que estava vazio. A
  causa só apareceu abrindo o transcrito da sessão à mão;
- **o custo de uma chamada morta não é zero.** Ela gastou o que gastou e não disse
  quanto. O RESUMO daquela rodada publicou US$ 0,00 depois de duas baterias e um
  commit. Agora, havendo chamada sem leitura de custo, o total sai marcado como
  **piso**, com quantas chamadas ficaram de fora.

**E o trabalho feito NÃO se perde:** a executora commita antes de abrir o aviso,
então o que ela terminou está na história. O que falta, quando ela morre depois de
commitar, é o aviso: a rodada fica aberta, e fechá-la é decisão de quem lê o
RESUMO.

**E uma oitava parada, que é de formato:** resposta sem as cinco seções encerra o ciclo.
Sem isso o script falharia **aberto** justamente na trava que mais importa: uma
`ESCALA` que não dá para ler sai igual a uma `ESCALA` vazia, e o ciclo seguiria
por cima de uma decisão que era do humano.

### Duas coisas que o script protege, e o motivo de cada uma

- **antes de cada checkout ele confere que `centelha-revisora/.claude/CLAUDE.local.md`
  existe**, e aborta se não existir. O checkout sobrescreve caminho rastreado sem
  perguntar, e o papel da revisora já foi escrito uma vez por cima do `CLAUDE.md`
  da raiz, que é o do projeto. Sem o papel, a revisora abre a rodada sem
  contrato: sem as vigilâncias, sem o formato e sem a trava de regra de jogo,
  produzindo texto plausível e inútil;
- **ele avisa o commit que CONTÉM o aviso, e nunca o topo da branch.** O topo pode
  ter andado, e mandar a revisora para ele por conveniência quebraria a única
  coisa que o congelamento compra.

### O que ele roda com permissão total

`--permission-mode bypassPermissions`. **É a linha mais perigosa do arquivo**, e é
obrigatória num laço sem humano: sem ela a chamada trava no primeiro `git commit`
esperando um "sim" que ninguém vai dar, e o timeout a mata sem nada feito.

### O resumo

Saia como sair, sai `docs/simulacao/caixa/RESUMO-NN.md` com motivo da parada, o
que foi resolvido, o que ficou aberto, custo total e o que precisa do humano. **É
a única coisa que o humano precisa ler.**

## A regra do commit defasado

O congelamento tem um preço, e ele cai inteiro do lado da executora. Se ela
continuar commitando enquanto a revisora lê, a resposta chega sobre um commit que
já não é o topo, e o erro previsível é sempre o mesmo: **tratar a revisão como se
fosse sobre o estado atual, e descartar um item dizendo "isso já mudou".**

As cinco regras, e as cinco são obrigação da executora:

1. **toda resposta da revisora é sobre o commit avisado, e vale sobre ele.** Ela
   não errou por não ver o que veio depois: ela viu exatamente o que lhe foi
   mandado ver;
2. **ao ler a resposta, a primeira coisa é conferir se o HEAD ainda é o commit
   avisado.** Se não for, **listar o que mudou entre os dois ANTES de responder
   qualquer item**:
   ```
   git log --oneline <sha-avisado>..HEAD
   git diff --stat <sha-avisado>..HEAD
   ```
3. **item que deixou de valer porque o código mudou não é item respondido: é item
   RESPONDIDO NOUTRO COMMIT.** A resposta diz o sha em que ele deixou de valer,
   para ninguém achar depois que a revisora estava errada;
4. **"isso já mudou" nunca é resposta suficiente.** Ou o item continua valendo e é
   tratado, ou se mostra o commit e o diff que o resolveu;
5. **o padrão é NÃO commitar na branch entre o aviso e a resposta.** Se for
   preciso trabalhar, trabalha-se noutra branch e traz-se depois, para que o
   commit avisado continue sendo o topo quando a resposta chegar.

## O que o aviso tem de trazer

O formato está em `MODELO-executora.md` e é fixo. A seção que carrega o peso é
**O QUE ESTE RELATÓRIO AFIRMA**: cada número publicado na rodada, com o arquivo e
a linha de onde ele sai. **Número sem procedência não entra**, porque a revisora
não tem como conferir o que não sabe de onde veio, e um número sem origem é
exatamente o tipo de coisa que atravessa sete rodadas sem ninguém notar.
