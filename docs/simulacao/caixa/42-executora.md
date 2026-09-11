# Rodada 42 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  a66a3e22077b1dc3924a17ad8696d3821ee29c8e
SHA   d6bd74ed73be47f5c414162aac2c7b6802839c39
TOPO  d6bd74ed73be47f5c414162aac2c7b6802839c39
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
| `Pendencias.md` | Arquiteto fecha o L72 (números finais, a convenção da marca histórica) |
| `docs/simulacao/CATALOGO.md` | Arquiteto funde a entrada dele com a minha sobre a âncora mais próxima em bytes |
| `package.json` | `test-rodada.mjs` entra na lista do `validate` |
| `scripts/rodada.mjs` | `--enviar` recusa quando `HEAD` já é o commit de um aviso, dizendo o sha certo (L73) |
| `scripts/test-rodada.mjs` | novo: prova as duas metades do L73 numa árvore de mentira isolada |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 12 | asserções do `test-rodada.mjs` novo, todas passando | saída viva de `node scripts/test-rodada.mjs` |
| 31 | objetos "dangling" (soltos, inalcançáveis por ref) no `.git` real HOJE, no repositório inteiro; NÃO são todos do meu teste. Dos 31: **1** (uma `tree`) é do vazamento do meu teste, do intervalo antes do conserto do ambiente; os outros **30** são anteriores e não têm relação com esta rodada (stashes largados por sessões ao longo de cinco semanas, o mais velho de 04/08/2026) | `git fsck --no-progress --dangling`, conferido pelo Arquiteto por data e assunto de cada objeto |
| 2 | commits no total da árvore de mentira depois das duas chamadas de `--enviar` (um de trabalho, um de aviso só) | `scripts/test-rodada.mjs:150` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D42a | Detectar "HEAD já é um aviso" pela MENSAGEM fixa do commit (`rodada \d+ · aviso à revisora`), não por outro sinal (comparar com o sha impresso na última chamada, por exemplo) | um commit de trabalho que por acidente tivesse essa mensagem exata seria recusado como se fosse um aviso; achei o risco baixo (a mensagem é escrita só por esta linha do próprio `rodada.mjs`, ninguém digita à mão) e o ganho grande (não precisa guardar estado entre chamadas em arquivo nenhum) |
| D42b | Não rodar `git gc` para apagar o objeto solto que o meu teste deixou (uma `tree`, do vazamento antes do conserto do ambiente) | fico sem o `.git` "limpo" nesta rodada; o custo de decidir errado (apagar objeto que não era meu para apagar, e que no repositório inteiro é maioria de stash de outras sessões, não lixo meu) é maior que o de deixar um objeto inerte por mais uma rodada. **Decisão confirmada pelo Arquiteto** (git gc não deve rodar: poda automática já cuida disso, o custo de manter é irrelevante, e objeto solto é a última rede de quem largou stash) |
| D42c | Testar o L73 numa árvore de mentira ISOLADA (com git e node de verdade) em vez de extrair a lógica do guarda para uma função pura e testar só ela | uma árvore de mentira custa mais (processo `git`/`node` de verdade, ache o achado do `GIT_DIR` que quase corrompeu o repositório real) do que uma função pura testada em memória; escolhi porque o defeito original só existe na INTERAÇÃO entre `--abrir`, o commit do aviso e o `HEAD` relido, e uma função pura testaria a regra sem provar que ela está ligada ao lugar certo |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- Nada em aberto para o L73. O objeto solto que sobrou do vazamento (D42b) já
  tem decisão do Arquiteto: não rodar `git gc`. Registro aqui só para a
  revisora não medir de novo esperando achar algo pendente: ela pode conferir
  com `git fsck --no-progress --dangling` e vai ver 1 `tree` do meu intervalo
  e 30 objetos anteriores, sem relação com esta rodada.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-42-l73.md` · a entrada de 08:25 tem o achado
  do vazamento de ambiente, a causa, o conserto e a prova por igual
- `scripts/rodada.mjs` · o guarda novo, primeira coisa dentro de `if (ENVIAR)`
- `scripts/test-rodada.mjs` · as duas metades da prova, com o comentário no
  topo do arquivo explicando por que a árvore de mentira precisa de `ENV_LIMPO`
