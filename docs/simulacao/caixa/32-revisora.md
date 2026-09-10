# Rodada 32 · resposta da revisora (VOZ.md §8 item 2: o desfazer cresce)

Revisora: aviso em `55e749c`. BASE `20f9664`, SHA `13b456b`, TOPO `13b456b`.

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `55e749c729eeca03653256bf0644a94402ddcbaa`. Batem.
- O item de código é `8f3ea63` (`comando-barra.json` + `grid.astro`, 66 inserções/6
  remoções); o resto do intervalo `BASE..SHA` é reapontamento de citação do Arquiteto,
  fora desta rodada, como o aviso já avisa.
- Sinal de vida em `docs/simulacao/caixa/progresso-revisora-32.md`, hora lida de `date
  +%H:%M` a cada etapa fechada, não estimada.

## Julgamento 1 · D32a (`encerrarVez` confirma para sempre)

**Concordo com o argumento, não só com o resultado — refiz a leitura por conta própria.**
`relogio()` (`grid.astro:4521-4536`) deriva de `tickDaVez()`, o menor tick entre quem está
na fila; mudar o tick da peça da vez pode mesmo mover esse mínimo. `verificarEfeitos`
(`src/lib/artes-grid-mesa.ts:1759-1804`) confirma o resto do argumento linha por linha: expira
condições (`varrerCondicoesVencidas`), encerra efeitos vencidos (`encerrarEfeito`) e aplica a
saída de Artes que terminaram de montar (linhas 1795-1804) — e cada um desses ramos chama
`ctx.logar(..., { acao: null })` por conta própria (confirmado na linha 1801-1802), sem
nenhum vínculo com o gesto que disparou a verificação. Reverter só o campo `tick` deixaria
exatamente o estado que a decisão descreve: uma peça marcada como não tendo agido, com dano
e expiração já aplicados por cima.

**Considerei uma saída que a análise não citou, e a rejeito pelo mesmo motivo que rejeitaria
uma exceção no VOZ.md §4**: dava para tornar `encerrarVez` condicionalmente reversível
(checar se `ATIVOS.length === 0` e se `relogio()` não muda antes de decidir se oferece
desfazer). Isso criaria uma reversibilidade que depende do estado da mesa no instante do
clique — o mesmo verbo às vezes confirmando sozinho, às vezes não — e contradiz o desenho
que o próprio VOZ.md §4 já fixa: desfazer é propriedade do VERBO, não da ocasião. Pior
regra, não melhor. **Não é `CORRIGE`.**

O comentário no código (`grid.astro`, no corpo de `encerrarVez`, antes de `await
verificarEfeitos`) cumpre o que foi pedido: diz o mecanismo que faltaria (entradas de grupo,
vinculadas, revertidas juntas em ordem) para mudar a resposta — não é só "não dá", é "não dá
porque falta X, e X não é uma extensão do padrão de hoje". Concordo que isso evita o
conserto de daqui a três meses que reabriria a mesma investigação.

## Julgamento 2 · D32b (prova de "auto" pelo menu, não pela barra)

**Tentei montar a cena e consegui — fecha a lacuna de vez, não é mais escolha entre duas
respostas defensáveis.** Sem tocar `#ini-prox` sozinho (que só avança o Tick, não faz a fila
andar sem alguém declarar — foi o que travou as seis tentativas da Executora): declarei
"esperar" pela BARRA para quem estava na vez (`c000`) e, na volta seguinte, `daVez()` caiu em
`c009` ("Criatura 10", classe `g-inimigo`). Com a criatura na vez, mandei "auto" pela barra
de verdade:

```
dialogo ainda aberto (deveria ser null, sem confirmar): null
linhas do registro: 42 -> 43
ultima linha: Criatura 10 entra em modo automático
depois do desfazer (Z): 43 -> 42
```

Sem confirmação, linha certa, e o desfazer tirou a linha (não somou outra) — os três pontos
que a rodada pedia, agora provados pelo caminho que o mestre realmente usa, não só pela
função isolada. Registro a receita para quem precisar repetir: o segredo não é o botão de
avançar, é ter alguém DECLARANDO uma ação antes de avançar — a fila só anda com gesto de
verdade, e é por isso que só avançar o relógio não bastava.

Já que a lacuna fechou, não sobra pergunta para eu responder "qual das duas respostas
defensáveis" — a prova ao vivo pela barra agora existe, e é melhor que qualquer um dos dois
argumentos hipotéticos.

## Julgamento 3 · a prova do desfazer é a linha SAINDO, não uma linha nova

**Confirmado, nos dois verbos, por leitura de código e ao vivo.** `desfazer()`
(`grid.astro`, a partir de `LOG_APAGADAS.add(e.id); LOG.splice(idx, 1); pintarLog();`) é
código único para todos os ramos — `LOG.splice` remove a entrada do array, nunca acrescenta
uma linha de "desfeito" por cima. Testei "auto" eu mesma (acima, 43→42) e o par de
`progresso-desfazer-verbos.md` (19:07) já mostra o mesmo para "esperar" (40→41→40). O
comentário do porquê (evitar a diferença de "linha nova = história dupla" contra "linha
sai = como se não tivesse acontecido") está coerente com o padrão `'vida'` que já existia
antes desta rodada.

## O resto, conferido

`comando-barra.json`: só os dois `"desfaz": false → true` de `auto`/`esperar`, `encerrar`
intocado — conferido no diff, bate com "o par negativo" que o aviso cita.
`alternarAuto`/`esperarUmTick`: os dois guardam `de`/`para` ANTES de escrever (cópia funda
para `esperar`, que muda dois campos — `tickAntes`/`acaoAntes` via
`JSON.parse(JSON.stringify(...))`, correto porque `c.acao` é sobrescrito pela mesma
referência que `gravarRelogio` grava). `npm run validate`: rodei eu mesma, exit 0.

## BLOQUEIA

Nada.

## CORRIGE

Nada.

## PERGUNTA

Nenhuma.

## ESCALA

Nada.

## VEREDITO

SEGUE
