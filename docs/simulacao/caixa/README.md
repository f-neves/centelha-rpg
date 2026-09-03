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
| custo | **US$ 20** | duas chamadas por rodada, a da executora sendo a cara. Corta por volta da 4ª ou 5ª rodada num ritmo pesado e deixa as seis passarem num leve. **Errar para baixo é o lado certo**: parar cedo custa uma rodada e um `--custo` maior na próxima; parar tarde custa dinheiro que ninguém autorizou |
| por chamada | **30 min** | a executora roda bateria (30 s) e escreve documento. Falha de chamada **encerra**, e não tenta de novo |
| repetição | **0,6** de semelhança | heurística sobre os identificadores do item (crases, `§x.y`, `L25`). Erra para o lado de parar, que é o barato |

**A unidade atômica é a RODADA, e não a chamada.** O teto de custo é conferido
ANTES de abrir cada rodada, contra a rodada mais cara até então: parar no meio
deixaria um aviso commitado que ninguém vai revisar, o que é pior que parar antes.

### As sete paradas, e todas são de fechar

teto de rodadas · teto de custo · veredito **PARA** · **SEGUE** duas vezes
seguidas (revisão esgotada) · **ESCALA** não vazia (encerra na hora, mesmo com
rodadas sobrando) · assunto repetido em duas respostas seguidas · árvore suja em
qualquer ponto. Mais a chamada que falha ou estoura o tempo.

**E uma oitava, que é de formato:** resposta sem as cinco seções encerra o ciclo.
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
