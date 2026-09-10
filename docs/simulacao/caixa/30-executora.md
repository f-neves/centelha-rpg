# Rodada 30 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  dd308a8d3ca95ff381847c0b23365fd06bbf3c5d
SHA   6368fee8fbec98c00940cd332d9d8ac970645075
TOPO  6368fee8fbec98c00940cd332d9d8ac970645075
```

**O TOPO existe porque este repositório tem mais de uma frente empurrando para o
`main`.** O `duo.mjs` já congela a revisão no commit deste aviso, então ela nunca
revisa o topo; o que ele não impede é um commit de OUTRA frente cair entre a `BASE`
e o `SHA`. Esse commit fica **na árvore que a revisora lê** e **fora do intervalo
que o aviso declarou**: é o recorte pelo avesso, e sem o campo ela não tem como
saber que ele existe.

Com `TOPO` diferente de `SHA`, a leitura é: *entrou coisa que não é minha, e
`git log SHA..TOPO` diz o quê e de quem.* Com `TOPO` igual a `SHA`, o trecho é o
main inteiro desde a `BASE`.

**Mas o checkout é no commit DESTE aviso**, que é uma linha acima na história e
tem a **mesma árvore de código**: ele só acrescenta este arquivo. `npm run rodada
-- --enviar` imprime o sha dele, e é o que vai no comando:

```
git -C <worktree> fetch && git -C <worktree> checkout <sha do commit do aviso>
```

Um commit não pode conter o próprio sha, e é por isso que são dois. Mandar a
revisora para o commit do aviso é o que faz ela ver, com um checkout só, o código
avisado **e** o aviso sobre ele.

## O QUE MUDOU

Uma frase por arquivo tocado, **sem justificativa**. A justificativa mora no
documento da rodada; aqui é só o inventário.

| arquivo | o que mudou nele |
|---|---|
| `Pendencias.md` | Arquiteto: citações de linha corrigidas (deslocadas pelas minhas edições em `grid.astro`) e outros registros |
| `VOZ.md` | Arquiteto: reescreve §7/§8 — autoriza este item |
| `docs/simulacao/ARQUITETO.md` | Arquiteto: §1.2/§1.3, a regra nova de sinal de vida em disco |
| `docs/simulacao/CATALOGO.md` | Arquiteto: registro, fora desta rodada |
| `docs/simulacao/CONTRATO-AUDITORA.md` | Arquiteto, fora desta rodada |
| `docs/simulacao/CONTRATO-REVISORA.md` | Arquiteto, fora desta rodada |
| `docs/simulacao/ESTADO.md` | Arquiteto: citações de linha corrigidas |
| `docs/simulacao/PASSAGEM.md` | Arquiteto, fora desta rodada |
| `src/data/comando-barra.json` | **novo, o item desta rodada**: a gramática fixa da barra de comando (5 verbos, sinônimos, o que cada um chama) |
| `src/lib/comando-barra.ts` | **novo**: `interpretarComando`, pura — sem DOM, recusa em vez de aproximar |
| `src/lib/hex.ts` | **novo**: `colunaDaLetra`/`hexDoNome`, o inverso de `letraColuna`/`nomeHex` que já existiam |
| `src/pages/mesa/grid.astro` | **o item desta rodada**: tecla C abre a barra (`abrirComando`), `executarComando`/`despacharComando`/`permissaoComando` despacham para as 5 funções já chamáveis direto |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 7 de 7 casos | o roteiro puppeteer contra a bancada, testado ao vivo, todos passando na rodada final | rodado nesta sessão, log em `docs/simulacao/caixa/progresso-barra-comando.md` 13:48 |
| "mover B2" moveu o token de verdade | posição do `.gr-token` mudou (`left:44.4px` → `left:132.8px`) | mesmo roteiro, caso 2 |
| "automatica" (fora da gramática, parecido com "automatico") recusa | não aproxima para "auto" — caso pedido explicitamente pelo humano via Arquiteto, adicionado depois do primeiro roteiro | mesmo roteiro, caso 3b |
| "tirar" removeu 1 token sem pedir confirmação | 6 → 5 tokens no tabuleiro | mesmo roteiro, caso 4 |
| `npm run validate` exit 0 | o portão rápido, rodado antes do commit | rodado nesta sessão |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D30a | "peça selecionada" = `daVez()`, não um clique-para-selecionar novo. O VOZ.md fala em "a peça selecionada no tabuleiro"; o Grid não tem hoje um estado de seleção separado do arrasto/menu, e criar um pediria mexer em `ligarArrasto` (fora do escopo: "não refatore nada além disso") | custo: a barra só comanda quem está na vez agora, não uma peça arbitrária escolhida por clique. Mesmo precedente das teclas A (atacar) e Espaço (encerrar), que já usam `daVez()` |
| D30b | gramática por PALAVRA (não frase), com sinônimos curtos por verbo (`mover/move/vai/anda`, etc.), em vez de reusar o vocabulário de 30 palavras do VOZ.md §2 (que é para o léxico da VOZ falada completa, não para os 5 verbos já executáveis) | custo: se o vocabulário real da mesa (depois da batalha de teste) usar palavras diferentes das que inventei, é só editar `comando-barra.json` — nenhum código muda |
| D30c | `mover` pede o nome da casa como parâmetro de texto (ex.: "mover H7"), usando o mesmo nome que já aparece no registro (`nomeHex`) — não inventei sintaxe nova. Escrevi o inverso (`hexDoNome`) porque não existia | custo: mestre precisa saber/ver o nome da casa antes de digitar; não há autocomplete nem clique-para-apontar nesta versão |
| D30d | as travas de permissão (`permissaoComando`) replicam à mão as mesmas condições que o menu já usa por verbo (`mandoNela` para mover/esperar; `MESTRE` + `!SIML()`/`tipo==='criatura'` para tirar/encerrar/auto), em vez de criar uma abstração nova | custo: se o menu mudar uma condição de permissão no futuro, `permissaoComando` pode ficar desatualizada — as duas cópias não se conferem sozinhas (mesma família de risco que o `CONTEXTO.md` já registra para "duas listas que precisam concordar") |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **A pergunta do humano sobre "recusa com sugestões" cobrir texto foneticamente parecido**:
  SIM, cobre — mas com uma ressalva importante. O parser faz casamento EXATO de palavra (depois
  de minúsculo + sem acento), não fuzzy/fonético nenhum: "automatica" não está na lista
  `["auto","automatico","robo"]`, então recusa pelo mesmo caminho que texto aleatório recusaria
  — não existe um caminho "quase casou" separado. Isso é bom para a regra "recusa em vez de
  aproximar" (não existe zona cinzenta para aproximar por engano), mas significa que ESTE
  parser de texto não é o teste da BANCADA DO VOSK (`voz-bench.html`): aquele mede se o
  RECONHECEDOR ACÚSTICO confunde "automatica" com "automatico" na fala (erro de fonética real,
  fora do controle deste parser); este mede só se o parser de TEXTO aproxima (não aproxima,
  nunca). São dois testes de coisas diferentes, e a barra de texto não substitui a bancada.
- **Item 2 (crescer o desfazer) e item 3 (captura de áudio) não abertos**, como combinado — o
  humano quer usar a barra numa batalha antes.
- Nenhuma das oito funções fora do escopo (`curar`, `tirarVida`, `ajustarMana`,
  `editarIniciativa`, `alternarAlcance`, `abrirCondicoes`, `abortarGesto`, `agirForaDeHora`) foi
  tocada nem refatorada.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `VOZ.md` §7/§8 · o que este item autoriza e o que continua proibido
- `src/lib/comando-barra.ts` · a função pura, `interpretarComando`
- `src/pages/mesa/grid.astro` · `abrirComando`/`executarComando`/`despacharComando`/`permissaoComando`, logo depois de `esperarUmTick`
- `docs/simulacao/caixa/progresso-barra-comando.md` · o roteiro de teste passo a passo, com horários
