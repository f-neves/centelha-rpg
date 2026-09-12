# Rodada 52 · aviso à revisora

## COMMIT

O código a revisar, e os TRÊS campos são obrigatórios desde 04/09/2026:

```
BASE  71a0228c988f3fce7f197a4eae64b662ba1ed292
SHA   7b4100898ae122ffa071d46c223e6e4e07ed5a41
TOPO  7b4100898ae122ffa071d46c223e6e4e07ed5a41
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
documento da rodada (`docs/simulacao/caixa/progresso-52-l88.md`); aqui é só o
inventário. Um eixo só, um commit: `8d7b450`.

| arquivo | o que mudou nele |
|---|---|
| `src/pages/mesa/grid.astro` | `conferirOcupacao()` nova, irmã de `conferirFila()`, chamada de `pintarIniciativa()`; `paresIlegaisAgora()` nova, reusando `ocupadoPor`/`podeDividir`; `porNoMapa` marca/desmarca `POSICAO_PENDENTE` em volta do `await gravarToken`; três comentários da rodada 50 corrigidos de "L88" para "L66" |
| `scripts/mesa-mock.mjs` | cena nova `?cena=ocupacaodetector` |
| `scripts/test-l88-ocupacao-detector-mesa.mjs` | novo |
| `package.json` | o teste novo registrado em `smoke` |
| `.github/workflows/validate.yml` | matriz de CI com o mesmo teste |

## O QUE ESTE RELATÓRIO AFIRMA

Cada número publicado nesta rodada, com o arquivo e a linha de onde ele sai.
**Número sem procedência não entra.**

| número | o que é | de onde sai |
|---|---|---|
| 30 | chamadas de `pintarIniciativa()` em `grid.astro`, todas discretas (nenhuma dentro de `requestAnimationFrame`/`setInterval`) | medido lendo o arquivo antes de escrever qualquer código; a frequência do par a par não é por quadro |
| 8 | asserções em `test-l88-ocupacao-detector-mesa.mjs` | saída do próprio arquivo, `npm run smoke` |
| 0 | número mágico no desenho final (o `ATRASO_CONFERENCIA_OCUPACAO` de 600ms da primeira versão foi removido) | `grid.astro:7403,7406` (`POSICAO_PENDENTE.add`/`.delete` em `porNoMapa`, commit `8d7b450`) substitui o relógio por uma pergunta determinística |
| 281 | citações de código conferidas pela âncora, portão fechado no fim da rodada | saída de `node scripts/test-procedencia.mjs` (dentro de `npm run validate`), no commit `8d7b450` |

Se um número foi calculado e não está num arquivo, o comando que o produz entra na
coluna da procedência, e ele tem de rodar no commit avisado.

## O QUE EU DECIDI

Decisões de engenharia tomadas sem perguntar, **com o custo de cada uma**.
Decisão sem custo escrito é decisão pela metade.

| # | a decisão | o que ela custa |
|---|---|---|
| D01 | `conferirOcupacao()` mora em `pintarIniciativa()`, não em `pintarTokens()` | `curar` (a cena passiva do L84) não chama `pintarTokens()`, só `pintarIniciativa()`. Se o detector morasse em `pintarTokens`, o retorno passivo (curar alguém debaixo de uma peça de pé) nunca seria visto |
| D02 | Primeira versão usava um relógio (`ATRASO_CONFERENCIA_OCUPACAO`, 600ms) para separar violação real de instante otimista; substituída por marca determinística (`POSICAO_PENDENTE`) depois de o Arquiteto perguntar de onde vinha o número (de lugar nenhum, não estava medido) | o desenho final é mais simples E mais correto (sem constante, sem `Map` de timers, sem reconferir no disparo); o teste caiu de 900ms para 300ms de espera |
| D03 | Corrigi três comentários da rodada 50 que citavam "L88" quando o número certo é "L66" (conferido no `Pendencias.md`), sem tocar em documentos já fechados | `50-executora.md` (aviso enviado) e `progresso-50-l70.md` continuam com o número errado de propósito: documento congelado não se reescreve, a correção mora no progresso de quando foi achada |

## O QUE FICOU EM ABERTO

O que não foi resolvido, e por quê. Marcar explicitamente **o que precisa do
humano** e não da revisora.

- **`POSICAO_PENDENTE` só protege quem escreve por `porNoMapa`, e o passo
  automático do Tick não passa por ele.** `avancarTickSimultaneo`
  (`grid.astro`, o laço do movimento automático) grava `TOKENS[c.id]` e
  chama `gravarToken` direto, sem `porNoMapa` e sem checar o `error` que
  volta. Na prática o risco é pequeno (o caminho já evita hexágonos
  ocupados pela mesma `ocupadoPor` durante o traçado, `caminharHex`), mas
  se uma corrida entre clientes ainda assim recusar essa escrita
  específica, a posição local ficaria desincronizada da do banco SEM a
  marca de pendente, e o detector poderia relatar uma sobreposição sobre um
  estado que nem chegou a existir no servidor. Não é desta rodada consertar
  (o item pedia o detector, não auditar todo escritor de posição), mas acho
  que merece registro: o estrangulamento de posição do L70 tem uma segunda
  porta que este achado não fechou.

## ONDE LER

O documento principal desta rodada e as seções que importam, na ordem em que
fazem sentido.

- `docs/simulacao/caixa/progresso-52-l88.md` · sinal de vida completo: o
  levantamento das três perguntas (frequência, onde entra, o que escreve),
  o raciocínio inteiro sobre por que a forma da transição de `conferirFila`
  não resolve o caso que treme, a primeira versão com o relógio, a troca
  para `POSICAO_PENDENTE` depois da pergunta do Arquiteto, e o achado do
  "L88" que era "L66".
- `Pendencias.md` L88 · o item original, com a medição da Revisora, a
  conferência do Arquiteto e a decisão do humano.
