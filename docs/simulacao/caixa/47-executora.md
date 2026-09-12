# Rodada 47 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  d6a6e1948ebbbe72e5f116130fa0b6e48d78aaca
SHA   b67e1a88a27f210a4edfa3f61bc341d053c5bb84
TOPO  b67e1a88a27f210a4edfa3f61bc341d053c5bb84
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
| `Pendencias.md` | não é meu: entra no intervalo pelo commit do Arquiteto (`c02dd9e`), achado da Revisora sobre citação abreviada invisível ao portão |
| `package.json` | acrescenta `test-travessao-capitulos.mjs` à cadeia do `validate`, entre `test-procedencia` e `test-rodada` |
| `scripts/test-travessao-capitulos.mjs` | novo: portão que varre `src/content/**` por diretório contra travessão fora de crase e fora do glifo de célula vazia em tabela |
| `src/content/chapters/aparencia-virtudes-vontade.md` | L79: 7 travessões de pontuação trocados por dois-pontos/vírgula/parênteses |
| `src/content/chapters/armas-e-armaduras.md` | L79: 27 trocados; 3 marcadores de célula vazia mantidos (linhas 40, 41, 111) |
| `src/content/chapters/combate.md` | L79: 71 trocados; 6 marcadores de célula vazia mantidos (linhas 35, 128, 129, 230) |
| `src/content/chapters/coracao-do-sistema.md` | L79: 12 trocados |
| `src/content/chapters/criacao-de-personagem.md` | L79: 9 trocados |
| `src/content/chapters/custo-de-servico-e-itens.md` | L79: 25 trocados |
| `src/content/chapters/defesas.md` | L79: 1 trocado (frontmatter `resumo`) |
| `src/content/chapters/folego.md` | L79: 12 trocados |
| `src/content/chapters/qual-sistema.md` | L79: 2 trocados, dentro de rótulo de nó do `mermaid` |
| `src/content/chapters/quase-acerto.md` | L79: 11 trocados |
| `src/content/chapters/racas.md` | L79: 49 trocados; 4 marcadores de célula vazia mantidos (linhas 32, 37) |
| `src/content/chapters/relacoes-sociais.md` | L79: 2 trocados |
| `src/content/chapters/vida-ferimentos-cura.md` | L79: 12 trocados |
| `src/data/diagramas.json` | regravado por `gen-mermaid.mjs`: o texto-fonte do diagrama em `qual-sistema.md` mudou |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `253` | travessões medidos em `src/content/chapters/` antes da varredura (13 arquivos) | `docs/simulacao/caixa/progresso-47-l79.md:12` |
| `13` | ocorrências do glifo de célula vazia em tabela, em 9 linhas, não tocadas pela varredura | `docs/simulacao/caixa/progresso-47-l79.md:36` |
| `240` | travessões de pontuação trocados um a um na varredura (253 − 13) | `docs/simulacao/caixa/progresso-47-l79.md:36` |
| `0` | travessão fora das duas isenções (crase, célula vazia) no commit avisado | `node scripts/test-travessao-capitulos.mjs` (roda no commit avisado, saída 0) |
| `203` | violações do portão contra o commit anterior à varredura (controle vermelho) | `docs/simulacao/caixa/progresso-47-l79.md:125` |
| `1` | violação no controle negativo (travessão inserido de propósito e revertido) | `docs/simulacao/caixa/progresso-47-l79.md:131` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | O glifo de célula vazia em tabela (`\|\s*—\s*(?:\([^\|]*\))?\s*(?=\|)`) virou uma SEGUNDA isenção do portão, além da crase, em vez de exigir que as 13 ocorrências virassem outra coisa. Verifiquei antes de aceitar: rodei uma cópia do portão sem essa isenção contra o estado atual e ela achou exatamente as 9 linhas já mapeadas na varredura, nada mais. | Um padrão a mais para manter. Se um capítulo futuro usar `—` sozinho numa célula por outro motivo (não "vazio"), o portão vai deixar passar sem avisar; o padrão exige que esteja colado nos dois `\|` da célula, o que reduz mas não zera esse risco. |
| D02 | O portão varre a linha inteira, inclusive dentro de bloco cercado (` ``` `), e não trata bloco cercado como se fosse crase. | Um capítulo com bloco de código real (hoje só `qual-sistema.md` tem, e é `mermaid`) que precisasse de um travessão por razão técnica dentro do bloco teria de citar entre crase inline mesmo lá dentro, ou reescrever a linha; não há atalho de "está num bloco, então vale". |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- Nada do L79 ficou aberto: a varredura (240 trocados) e o portão (com os quatro
  controles) estão fechados, testados e em `main`.
- Fora do L79, `c02dd9e` (do Arquiteto, não meu) mede 136 citações abreviadas
  invisíveis ao portão de procedência e deixa a decisão explicitamente aberta
  ("fica medido e aberto"). Não é matéria desta rodada nem desta frente; menciono
  só porque a tabela de "O QUE MUDOU" cita o arquivo por estar no intervalo.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-47-l79.md` · sinal de vida completo: a medida dos
  253, a correção da classificação de célula vazia, o arquivo-a-arquivo da
  varredura, o desenho do portão e os quatro controles.
- `scripts/test-travessao-capitulos.mjs` · o portão em si, com os comentários que
  explicam as duas isenções.
