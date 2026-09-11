# Rodada 41 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  fe7e2207e2f7766243b1f0e11f6eb235353fba55
SHA   4d86d6c70d7e69874921f05d480e8461d1e8b6b9
TOPO  4d86d6c70d7e69874921f05d480e8461d1e8b6b9
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
| `Pendencias.md` | 22 citações de código reapontadas à mão dentro de itens fechados; uma ganhou a marca `(citação histórica)` |
| `docs/simulacao/CATALOGO.md` | entrada nova: a âncora "mais próxima" do portão de procedência é distância de bytes, e prefere o que vem antes da citação |
| `scripts/test-procedencia.mjs` | a conferência por âncora passa a valer para Pendencias.md inteiro (aberto e fechado); marca `(citação histórica)` nova, que pula só a citação em cujo território ela cai |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 77 | citações de código em itens FECHADOS do Pendencias.md, universo que o portão nunca conferia | `docs/simulacao/caixa/progresso-41-l72.md:14` |
| 23 | dessas 77 com problema (15 quebradas + 8 sem âncora), uns 30% | `docs/simulacao/caixa/progresso-41-l72.md:18-25` |
| 22 | consertadas à mão nesta rodada (21 por conta própria, 1 com o método do Arquiteto) | `docs/simulacao/caixa/progresso-41-l72.md:26` e `:51` |
| 1 | citação que ficou com a marca `(citação histórica)`, em vez de reapontada | `Pendencias.md:3737` |
| 148 | citações de código conferidas pela âncora, no estado final (ESTADO.md + Pendencias.md inteiro) | saída viva de `node scripts/test-procedencia.mjs` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D41a | Corrigir a PROSA de uma citação (`grid.astro:7335`, "dentro do `switch` do menu de contexto"), não só a linha: o código de hoje usa `if`/`else`, não `switch` nenhum | risco de eu estar reescrevendo história em vez de reapontando endereço; escolhi porque a palavra `switch` estava em crases (era âncora, não decoração), e uma âncora que descreve uma forma que o código nunca teve nem tem hoje induz quem ler a procurar a coisa errada |
| D41b | Nos 8 casos SEM ÂNCORA, todos ganharam âncora específica de código real (`.cond-x`, `chip.addEventListener`, `cond-fechar`, `rolarIniciativaPC`, `acaso()` etc.), nunca o nome genérico da função vizinha só para preencher a crase | nenhum real: o critério de perder a linha por falta de alvo firme (D41c) só valeu para UM dos 23, não para estes 8, e vale deixar escrito que a distinção foi caso a caso, não regra automática |
| D41c | O `test-grid.mjs:3541`/`null.getBoundingClientRect` perdeu o número de linha por inteiro, em vez de ganhar uma âncora nova: é sintoma de uma exceção observada numa rodada de teste específica, não afirmação sobre onde o código mora hoje (44 ocorrências de `getBoundingClientRect` no arquivo, nenhuma delas "a" chamada) | a entrada fica sem endereço nenhum a partir de agora; é o único jeito honesto, porque qualquer linha escolhida seria uma citação nova fingindo ser a antiga |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **Nada precisa do humano.** As duas linhas que precisavam de uma decisão que não era minha
  para tomar (`Pendencias.md:1714` e `:3737`) já vieram resolvidas pelo Arquiteto nesta própria
  rodada, e estão aplicadas.
- A marca `(citação histórica)` existe agora como mecanismo, mas só tem UM uso real no arquivo.
  Se aparecer um segundo caso (outro registro de "documento alheio disse X errado"), vale conferir
  se o padrão se sustenta ou se cada caso pede um desenho próprio.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-41-l72.md` · a rodada inteira, do número medido (07:38) ao
  fecho (08:00)
- `docs/simulacao/CATALOGO.md` · a entrada nova, "ÂNCORA MAIS PRÓXIMA É UMA REGRA SOBRE BYTES"
- `Pendencias.md:3736-3741` · o L61, item 1, com a marca histórica e a correção viva lado a lado
- `scripts/test-procedencia.mjs` · o bloco "A CITAÇÃO DE CÓDIGO QUE ENVELHECEU", com a marca nova
