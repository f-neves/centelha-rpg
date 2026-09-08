# Rodada 25 · resposta da revisora (Fase 2.5, lote 2, item 1/2: resíduo do relógio)

Revisora: aviso em `99123cd`, cobrindo `cce6948..cffcec9` (um commit de
trabalho, `cffcec9`). `cce6948` e `791017e` não são desta frente (mecânica
do TechLead, como o próprio aviso já registra).

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `99123cda3eea57e4c9f9205e270947c761f84d5f`. Batem.
- `git log --format='%h pais:%p %s' cce6948..cffcec9`: 1 commit, um pai.
- `git diff --stat cce6948 cffcec9`: 4 arquivos, 102 inserções, 10 remoções.
  Bate com o inventário do aviso, arquivo por arquivo.

## O ponto que pedia atenção: a sequência de medir antes de construir

Não aceitei a narrativa do aviso de graça — refiz a checagem central.

**A leitura do `combate.astro` antigo** (`atual?.tick ?? 0`, onde `atual =
emCampo[0]`): confirmei contra `grid.astro` que uma peça `livre` (sem golpe
nem movimento em curso) não tem `c.tick` regravado por
`avancarTickSimultaneo` — só quem tem golpe/movimento em andamento passa
por ali. Isso é exatamente o mecanismo que faz a fila ficar presa enquanto
`tick_atual` anda: a leitura do achado é estruturalmente sólida, não só
plausível.

**A prova de regressão, refeita por mim, não só lida:** reverti a linha do
conserto (`ehSimultaneo(TEMPO) ? (ENC?.tick_atual ?? 0) : (atual?.tick ?? 0)`
de volta para `atual?.tick ?? 0`), rodei `node scripts/test-grid.mjs`
completo e vi as duas asserções novas do Simultâneo falharem, palavra por
palavra como o aviso descreve:

```
✘ e o mestre le o relogio da ARENA no Simultaneo, nao o da fila (0)
✘ e o jogador tambem (0)
```

Restaurei a linha em seguida; `git status` confirma o worktree limpo de
novo. A sequência "medir com sonda real antes de mexer, corrigir, provar
que reverter quebra" está genuinamente documentada em código que roda, não
só narrada no aviso.

**Os dois knobs não se pisam**, conferido linha a linha em
`scripts/mesa-mock.mjs`: `TICK_CENA` (de `?tick=`) só entra em
`encontros[0].tick_atual` (`:852`); `DESLOCA_FILA` (de `?deslocafila=`) só
entra em `ACAO[i].golpes`/`.livre` (`:289`-`290`) e no `tick` de fallback de
`COMBS[i]` (`:316`, o ramo `i % 3 === 0`, que são as peças `livre` — a
propriedade documentada no comentário da própria bancada, `:277`-`284`, já
existia antes desta rodada). Nenhuma variável compartilhada entre os dois;
o `?tick=` continua medindo só a arena, como a prova do Simultâneo (achado
1) exige.

**A segunda prova (P/G/R) é mesmo ausência de instrumento, não
divergência**: confirmei que `relogio()`/`el('ini-tk')` em `grid.astro`
deriva de `tickDaVez()`/`golpeMaisCedo()` fora do Simultâneo (não de
`tick_atual`), e que a bancada padrão nasce com ambos em 0 — sem o knob
novo, não havia como distinguir "o jogador calculou certo" de "os dois
leem zero por acaso". Rodei o par eu mesma (sem reverter nada, no commit
avisado):

```
✓ o mestre sai do Tick 0 com o deslocamento, no P/G/R (10)
✓ e o jogador calcula o MESMO relógio que o mestre (10 -> 10)
✓ e muda junto com um segundo deslocamento, não é um número parado (10 -> 17)
```

## O resto, verificado

`npm run validate` completo: exit 0, rodado por mim. `node scripts/test-grid.mjs`
completo, sem reversão nenhuma: exit 0, todas as asserções novas passando
(citadas acima). `Pendencias.md`: as duas reaponte de linha conferidas
contra o arquivo atual (`test-grid.mjs:1436-1440` é mesmo o comentário que
cita `tickDaVez`; `:1441-1460` é mesmo o bloco `SIM5`) — puro efeito
colateral do arquivo ter crescido, nenhuma mudança de conteúdo, como o
aviso descreve (D25c).

`combate.astro`: `ehSimultaneo`/`TEMPO`/`ENC` já eram variáveis/import
existentes no arquivo antes desta rodada (`TEMPO`/`ENC` declarados como
estado da página, `:568`/`:577`); a importação nova de `ehSimultaneo` não
colide com nada, usada uma vez só.

## CORRIGE

Nada.

## PERGUNTA

Nenhuma.

## ESCALA

Nada novo. `Pendencias.md` L33 continua descrevendo a lacuna do P/G/R como
aberta mesmo esta rodada já a tendo fechado (D25c) — decisão correta da
Executora de não tocar conteúdo que não é dela para editar; fica para o
TechLead atualizar quando quiser, não é bloqueio.

## VEREDITO

SEGUE
