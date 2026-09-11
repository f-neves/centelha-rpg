# Rodada 44 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  92066a05ef6b42cb77a6b571269678eca151b22e
SHA   243e69141a2d4aa83fc05ceee679c1f95d2150ff
TOPO  243e69141a2d4aa83fc05ceee679c1f95d2150ff
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
| `Pendencias.md` | Arquiteto varre o L79 (travessão → pontuação certa) e reaponta a citação que meu código deslocou |
| `docs/simulacao/ESTADO.md` | Arquiteto varre o L79 |
| `docs/simulacao/VOZ.md` | Arquiteto varre o L79 |
| `scripts/rodada.mjs` | novo portão na abertura: recusa `BASE` não ancestral do `main`, e nomeia o gêmeo de mesma mensagem quando existe (L81) |
| `scripts/test-rodada.mjs` | três cenários do L81 (ancestral, órfão sem gêmeo, órfão com gêmeo) e três controles positivos |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 146 | travessões trocados pela varredura do L79, zero restantes nos três documentos da frente (`Pendencias.md`/`ESTADO.md`/`VOZ.md`) | Arquiteto, `Pendencias.md` (o item L79) |
| 100/100, 37/37, 5/5 | linhas trocadas contra linhas do documento, um para um, em `Pendencias.md`/`ESTADO.md`/`VOZ.md`: contagem de linha INALTERADA, o que prova que a varredura foi substituição dentro da linha e não deslocou citação nenhuma | Arquiteto, `Pendencias.md` (o item L79); reproduzível com `git diff --stat` nos três arquivos entre `BASE` e `SHA` |
| 3 de 9 | avisos anteriores (rodadas 40, 42, 43) que nasceram com `BASE` órfão, calados, antes do L81 | `Pendencias.md` (o item L81) |
| 1 | citação reapontada pelo Arquiteto por causa do meu código deslocar linhas: `rodada.mjs:77` → `:102` (`function calcularTopo`), conferida por duas contas independentes (a minha e a dele) batendo no mesmo número | `Pendencias.md` (o item L81); `grep -n "^function calcularTopo" scripts/rodada.mjs` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D44a | O controle positivo do órfão FABRICA o próprio órfão dentro do teste (destaca o `HEAD`, commita, volta para a branch), em vez de usar o `b8b78ae2` que existe hoje no repositório real | teste mais longo (monta uma árvore de mentira própria por cenário) em troca de nunca depender de um objeto que `git gc` pode apagar a qualquer momento; um teste que passa hoje e desaparece sozinho é a forma "instrumento de bancada citado como prova" com uma volta a mais, e é exatamente esse risco que o Arquiteto pediu para evitar |
| D44b | `acharGemeo` procura por SUBJECT (`%s`, a primeira linha), não pelo corpo inteiro do commit | um gêmeo cujo corpo mudou mas manteve a mesma primeira linha ainda é achado (correto, é o caso do rebase real); um gêmeo com primeira linha reescrita mas corpo idêntico não seria achado (não vi esse caso na prática, e a rodada 43 comparou à mão pela subject também) |
| D44c | O portão SÓ recusa quando `BASE` existe e não é ancestral; não recusa nem avisa quando `BASE` está ausente (worktree da revisora não existe no clone) | mantém o comportamento de sempre para clone sem a frente de revisão (a linha em prosa, preenchida à mão); o portão do L81 é estritamente mais restritivo, nunca menos |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **O QUE O L81 NÃO COBRE:** o portão confere o `BASE`, não o `TOPO`. O `TOPO`
  envelhece DEPOIS de qualquer conferência feita no envio, a cada commit que
  chega antes de a Revisora dar checkout, e não há como um portão na abertura
  cobrir isso. Quem conserta é ela, recompondo com `git log SHA..origin/main`
  depois do `fetch` (achado e resolvido assim na própria rodada 43).
- **`L79` (Pendencias.md) · VARRIDO, MAS AINDA ABERTO, NÃO DESTA RODADA.** As
  146 ocorrências dos três documentos foram trocadas e zero restam, mas o item
  não fecha: falta o portão que trava a dívida nova, e falta a decisão de
  escopo dele (só `.md`, ou também comentário de código, que tem 139
  ocorrências próprias, 114 no `grid.astro`, deixadas de fora por decisão do
  humano). Decisão do humano, não desta rodada.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `Pendencias.md` · L81 (a régua e a escala do achado), L79 (a varredura,
  aberto por falta de portão)
- `docs/simulacao/caixa/progresso-44-l81.md` · o sinal de vida inteiro, com
  os três cenários, o achado ao escrevê-los (o órfão tem de existir no MESMO
  banco de objetos) e os três controles positivos
- `scripts/rodada.mjs:58-81` · `acharGemeo`; `scripts/rodada.mjs:244-276` · o
  portão em si, dentro de `abrir`
- `scripts/test-rodada.mjs` · a seção "L81", com os três cenários
