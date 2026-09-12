# Rodada 48 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  55c4122a463d525171eee386ef5fceaee09b8750
SHA   cc409b6cfe8c1020af43bb80e810fe7a71d22cb3
TOPO  cc409b6cfe8c1020af43bb80e810fe7a71d22cb3
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
| `Pendencias.md` | não é meu: entra no intervalo pelo commit de absorção do Arquiteto (`2cac904`), fechamento da rodada 47 |
| `scripts/test-travessao-capitulos.mjs` | acrescenta a terceira isenção (fala de personagem: linha que começa com travessão, inclusive após `> ` e indentação), eximindo a linha inteira |
| `docs/simulacao/caixa/progresso-48-l79.md` | novo: sinal de vida da rodada, com os oito casos sintéticos do regex e o controle fabricado |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `8` | casos sintéticos do regex `FALA` testados em Node antes de rodar contra o repositório | `docs/simulacao/caixa/progresso-48-l79.md:15` |
| `0` | linhas dos 13 capítulos que hoje batem com a exceção de fala (nenhum caso real) | `docs/simulacao/caixa/progresso-48-l79.md:24` |
| `3` | violações no controle negativo (arquivo fabricado, exceção desligada), revertido e apagado | `docs/simulacao/caixa/progresso-48-l79.md:31` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | A isenção exime a LINHA INTEIRA a partir do travessão de abertura, não só o caractere que abre. | Uma fala com inciso de narrador no meio (`— Fala — disse ele — resto.`) fica coberta de propósito, mas qualquer outro travessão que caísse na mesma linha, por acidente de formatação, também passaria sem aviso. |
| D02 | O regex aceita indentação e `> ` de citação (repetido, para blockquote aninhado) antes do travessão de abertura. | Uma linha mal formatada que comece com espaço e travessão por engano (não diálogo de verdade) também seria eximida; não há como o portão distinguir "fala de personagem" de "travessão solto no início da linha" além da posição. |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- O L79 fecha com esta rodada: as três isenções do portão (crase, célula vazia,
  fala) estão escritas, testadas e com controle. Nada fica pendente do item.
- Nenhum commit meu depois deste aviso, cumprindo a lição da rodada 47
  (`121652d` tinha entrado depois do `67c4931`).

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-48-l79.md` · sinal de vida completo: o regex, os
  oito casos sintéticos, a conferência da fronteira nos 13 capítulos reais e o
  controle fabricado (verde ligado, vermelho desligado).
- `scripts/test-travessao-capitulos.mjs` · o portão, com o comentário que explica
  as três isenções e por que a de fala precisa de controle fabricado.
