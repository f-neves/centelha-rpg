# Rodada 31 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  f1f713ddfc3249f59560c1dcfb4b3a57064e82e6
SHA   5dfc56d85f99f087181bb129f5bf4cd382c15ad6
TOPO  5dfc56d85f99f087181bb129f5bf4cd382c15ad6
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
| `.gitignore` | Arquiteto: `*.7z` entra, para o `docs/simulacao.7z` do humano parar de travar `npm run rodada` |
| `Pendencias.md` | Arquiteto: reaponta as dez citações de código que minhas edições em `grid.astro` deslocaram (L62), fora desta rodada |
| `docs/MAPA.md` | Arquiteto, fora desta rodada |
| `docs/simulacao/ARQUITETO.md` | Arquiteto: §1, a regra de conferir estado antes de afirmar (§1.1-§1.5), fora desta rodada |
| `docs/simulacao/CATALOGO.md` | Arquiteto, fora desta rodada |
| `docs/simulacao/CONTEXTO.md` | Arquiteto: registra o item desta rodada e o achado do L64 (sentinela/magnitude sem citação) |
| `docs/simulacao/CONTRATO-REVISORA-ORIGINAL.md` | Arquiteto, fora desta rodada |
| `docs/simulacao/CONTRATO-REVISORA.md` | Arquiteto, fora desta rodada |
| `docs/simulacao/ESTADO.md` | Arquiteto: reaponta citações deslocadas, fora desta rodada |
| `docs/simulacao/PASSAGEM.md` | Arquiteto, fora desta rodada |
| `docs/simulacao/README.md` | Arquiteto, fora desta rodada |
| `docs/simulacao/VOZ.md` | Arquiteto: fecha o item 1 (barra de comando) na frente, fora desta rodada |
| `src/pages/mesa/grid.astro` | **o item desta rodada**: `executarComando` ganha três checagens antes de chamar `porNoMapa` — fora do tabuleiro, mesma casa, casa ocupada — cada uma recusando com `uiErro` e mensagem própria |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| "Herói 1 já está em B2" | mensagem de recusa do caso "mesma casa" | testado ao vivo nesta sessão, `docs/simulacao/caixa/progresso-barra-recusa-mover.md` 14:20/14:24 |
| ""Z99" está fora do tabuleiro (24×16)" | mensagem de recusa do caso "fora do tabuleiro" — CONFERIDO, não presumido: rodei o comando de verdade contra uma bancada 24×16 e li a mensagem que voltou | mesmo log, mesmo horário |
| "B2 já está ocupada" | mensagem de recusa do caso "ocupada por outra peça" (testado encerrando a vez de uma peça e mandando a próxima para a mesma casa) | mesmo log |
| exit 0 | os 9 casos do roteiro (os 3 pedidos + os 6 que já existiam da rodada 30) rodando juntos, sem regressão | mesmo log, 14:24 |
| exit 0 | `npm run validate`, depois das dez citações reapontadas | rodado nesta sessão |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D31a | `porNoMapa` continua INTOCADO de propósito. As três checagens ficam em `executarComando` (grid.astro), antes de chamar `porNoMapa` — não dentro dela. `porNoMapa` também é chamada pelo arrasto, onde o silêncio dos dois `return` mudos já tem sinal visual (a peça não solta da mão); mexer lá mudaria o comportamento de um caminho que ninguém pediu para tocar | custo: se um terceiro caminho futuro chamar `porNoMapa` direto (sem passar pela barra), ele herda o mesmo silêncio mudo de hoje — não corrigido, e não é desta rodada |
| D31b | o teto de repetição das checagens (fora do tabuleiro → mesma casa → ocupada) fica na ORDEM que escrevi, não alfabética nem por gravidade: fora do tabuleiro primeiro porque `ocupadoPor`/`TOKENS[cid]` não fazem sentido perguntar de uma casa que não existe | custo: nenhum medido; é só a ordem de leitura do código, não muda resultado nenhum caso o mestre digite um comando que dispare duas condições ao mesmo tempo (impossível hoje: as três são mutuamente exclusivas) |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- O outro achado do L62 (sem teste automatizado commitado da barra) continua fora de escopo,
  por decisão do humano registrada quando este item abriu — não abri essa frente.
- Nada precisa do humano nesta rodada.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `Pendencias.md` L62 · o achado original (recusa muda) e o contexto completo
- `src/pages/mesa/grid.astro` · `executarComando`, as três checagens novas, logo depois de `permissaoComando`
- `docs/simulacao/caixa/progresso-barra-recusa-mover.md` · o roteiro de teste passo a passo, com horários e as mensagens exatas
