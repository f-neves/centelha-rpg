# Rodada 49 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  8ba3cbb23daae9e75e7dee5058a55f6a76520d32
SHA   329eedb9ce7e5d2210bcc69b794da2170e57c911
TOPO  329eedb9ce7e5d2210bcc69b794da2170e57c911
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
| `src/pages/mesa/grid.astro` | `gravarToken` confere `ocupadoPor` primeiro e devolve `error.message`; `porNoMapa` perdeu a própria checagem, o bloco de `error` que já existia passou a mostrar a recusa |
| `scripts/mesa-mock.mjs` | nova cena `?cena=ocupacao`: `bq` parada, `mv` só na lista (fora do mapa) |
| `scripts/test-l70-ocupacao-mesa.mjs` | novo: prova a recusa com mensagem e o controle positivo (casa vazia) |
| `package.json` | acrescenta `test-l70-ocupacao-mesa` ao `smoke` |
| `.github/workflows/validate.yml` | acrescenta `test-l70-ocupacao-mesa` à matriz do CI |
| `docs/simulacao/caixa/progresso-49-l70.md` | novo: sinal de vida da rodada (levantamento + conversão) |
| `Pendencias.md`, `ESTADO.md`, `CONJURACAO.md`, `Grid_Mobile.md`, `CATALOGO.md`, `VOZ.md`, `CONTEXTO.md`, `Auditoria_Tecnica.md` | não são meus: reaponte do Arquiteto (72 citações movidas, mais a taxa de âncora fraca medida e registrada no `L65`), causado pelo deslocamento de linhas do meu próprio `gravarToken` |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| `9` | chamadores de `porNoMapa`, nenhum tocado, todos exercitados | `docs/simulacao/caixa/progresso-49-l70.md:34` |
| `79` | asserções do `test-grid-simultaneo`, verdes, sem regressão | `docs/simulacao/caixa/progresso-49-l70.md:114` |
| `71` | citações que se moveram de lugar em `grid.astro`, por causa do deslocamento de linhas do meu `gravarToken` (número do Arquiteto, não meu) | `docs/simulacao/caixa/progresso-49-l70.md:151` |
| `65` | das 71, quantas o portão (`test-procedencia.mjs`) conseguiu acusar antes do reaponte | `docs/simulacao/caixa/progresso-49-l70.md:127`, confirmado em `docs/simulacao/caixa/progresso-49-l70.md:151` |
| `6` | das 71, quantas passaram VERDES apontando para a linha errada (71 − 65): a taxa de âncora fraca que o Arquiteto registrou no `L65` | `docs/simulacao/caixa/progresso-49-l70.md:152` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | O teste novo entra pela LISTA (`.gr-ficha`), não arrastando um token já no mapa. | Não descobri isso planejando: arrastei `mv` já posicionada para cima de `bq` e a mesa abriu a caixa de DECLARAR ATAQUE (`grid.astro:6761`), não a recusa. O teste não exercita o gesto mais comum de arrasto (peça já em jogo, solta em cima de outra), porque ESSE gesto nem chega em `gravarToken`. Se um dia esse atalho de ataque quebrar, meu teste não avisa. |
| D02 | Não toquei em `prosseguirComComando` (a checagem duplicada de ocupação, voz/texto), mesmo ela virando redundante com o `gravarToken` novo. | A duplicação (e a "verruga" que o próprio comentário do código nomeia) continua na árvore. Quem mexer ali sem saber do `gravarToken` novo pode não perceber que a checagem dele já é redundante. |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **ACHADO, não solução:** soltar um token que já está no mapa em cima de
  outro é interceptado como ATAQUE (`grid.astro:6761`, "soltar em cima de
  alguém é atacar"), ANTES de qualquer coisa chegar em `porNoMapa` ou
  `gravarToken`. Isso significa que a conferência de ocupação que esta rodada
  pôs em `gravarToken` NÃO É EXERCITADA por esse caminho: para duas peças já
  no mapa, o atalho de ataque decide primeiro, sempre. A conferência nova
  protege de verdade os outros gestos (peça entrando pela lista, voz/texto,
  desfazer, o movimento automático do Tick), mas "arrastar peça A para cima
  da peça B" nunca chega a testar ocupação nenhuma, porque vira "A ataca B"
  antes disso. Não decidi nada sobre isso: registro para quem for pensar se
  essa interceptação é a única forma legítima do gesto, ou se há um caso
  (reposicionar em cima de um aliado caído, por exemplo) em que o mestre
  queria mover e não atacar. Precisa de decisão do humano ou do Arquiteto, não
  da Revisora. Isso não invalida esta rodada: o estrangulamento certo
  (`gravarToken`) foi convertido e provado para todos os caminhos que
  realmente passam por ele (lista, voz/texto, desfazer, movimento automático);
  o achado só marca que "arrasto peça-em-cima-de-peça" é um caminho de
  interface que não passa por nenhum dos dois, hoje.
- A fachada de `SB` que a aba entrega ao módulo das Artes (`grid.astro:2721`)
  e o `deslocar()` das Artes (`src/lib/artes-grid-mesa.ts:1114`) ficam para a
  rodada 50, por decisão já tomada: converter os dois estrangulamentos na
  mesma rodada era o risco a evitar.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-49-l70.md` · sinal de vida completo: os seis
  caminhos levantados, a resposta do Arquiteto sobre os dois estrangulamentos
  e o `podeDividir`, a conversão do `gravarToken`, os quatro controles (com o
  negativo por `git stash`), e o bloqueio das 65/72 âncoras com a resolução.
- `L65` (do Arquiteto) · a taxa 6/71 de âncora fraca no reaponte, e por que a
  busca por âncora continua proibida no reapontador.
