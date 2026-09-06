# Rodada 13 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  88c9ea536ddadba724e08267eb9478c16d5e387f
SHA   f490aadb4617ca3f9a9dd36525bc7893e6ea706f
TOPO  f490aadb4617ca3f9a9dd36525bc7893e6ea706f
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
| `docs/simulacao/02-projeto-harness.md` | `n = 2.527` aplicado às 32 células de E5 (§0.10.1), e §0.10.2 registra que o piloto da `margem` deixou de ser pré-requisito e virou confirmação |
| `docs/simulacao/CATALOGO.md` | CORRIGE 1 atendido: o caso "constante de conversão" separado em dois números distintos, `184×` e `≈2.550×` |
| `docs/simulacao/ESTADO.md` | mesmo CORRIGE 1, na seção "A SUA CORREÇÃO DE UNIDADE" |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `n ≈ 14` | `n` que sairia SE a conversão usasse a constante errada (taxa, `3,72`) em vez da certa (duração, `50,495`), para o mesmo Δ = 1 gesto/batalha | derivado: `n = 7,849·σ²/Δ²`, `σ = 0,3553`, `Δ = 1/3,72 ≈ 0,269` gesto/Tick. Nunca publicado como `n` real desta frente |
| `184×` | razão entre `n≈2.527` (constante certa) e `n≈14` (constante errada), mesma conversão | derivado: `2.527/13,71 ≈ 184,25`, ou `(50,495/3,72)² ≈ 184,2` |
| `≈2.550×` | razão entre `n≈2.527` (Δ convertido corretamente) e `n≈1` (Δ=1 gesto/Tick tomado literalmente, sem converter) — É esta a razão que de fato separa os dois `n` publicados nesta frente | derivado: `2.526,36/0,9908 ≈ 2.550` |
| `n = 2.527` | aplicado agora às 32 células de E5 | `02-projeto-harness.md`, tabela de §0.10.1 · já decidido na rodada 11/12 |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D56 | escolher a opção (b) do CORRIGE 1 (corrigir o texto), e não a (a) (achar um segundo erro empilhado): não existe, em lugar nenhum desta frente, um `n≈14` de fato calculado a partir da constante `3,72` — o `n=1` publicado vinha de não converter, não de converter errado | zero: a opção (a) exigiria citar uma linha de código ou cálculo que não existe; inventá-la para "fechar" o caso seria pior que admitir que `184×` era só uma comparação hipotética entre duas formas de converter |
| D57 | aplicar `n=2.527` a `02-projeto-harness.md` já, sem esperar o piloto da `margem`, seguindo a instrução explícita de gastar a bateria na grade e não no piloto | o `σ` usado é o de `ticksDeEntrada` (substituto), não o da `margem` real: se divergirem, o `n` se ajusta depois pela mesma regra de decisão que já estava escrita em §0.10.2 (1 a 4) |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **o piloto da bandeira `margem` continua sem rodar.** Agora é confirmação, e
  não pré-requisito: se o `σ` real vier muito diferente do de `ticksDeEntrada`,
  o `n=2.527` se ajusta pela regra de decisão de §0.10.2, já escrita antes
  desta rodada.
- **nada mais do CORRIGE 1 ficou pendente**: as duas leituras que a revisora
  levantou (opção a/b) foram resolvidas escolhendo a (b), com a justificativa
  na tabela de decisões acima.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/ESTADO.md` · "A SUA CORREÇÃO DE UNIDADE, e por que ela vale
  como caso, e por que são DOIS números"
- `docs/simulacao/CATALOGO.md` · o caso "constante de conversão", reescrito
- `docs/simulacao/02-projeto-harness.md` · §0.10.1 (tabela de repetições) e
  §0.10.2 (o piloto, rebaixado de pré-requisito a confirmação)
