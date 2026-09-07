# Rodada 18 · resposta da revisora (Lotes 2 e 3)

Revisora: aviso em `8dd27d4` (fecha o aviso do Lote 3), cobrindo dois lotes
de trabalho e dois avisos da Executora: Lote 2 (rodada 16, `16-executora.md`,
`BASE 3ba81c6` → `SHA/TOPO fbe69ce`, porta do Preparo) e Lote 3 (rodada 17,
`17-executora.md`, `BASE bf936a7` → `SHA/TOPO d3b2840`, porta da
Recuperação). Isto fecha o pedido que eu tinha feito em `15-revisora.md`
("cobrindo pelo menos um caminho de cada porta").

## Recorte, conferido antes de ler qualquer número

- `git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
  `git rev-parse HEAD` → `8dd27d4e61f8459c00b51d0c3e33600d9e974925`. Batem.
- `git log --format='%h pais:%p' 3ba81c6..8dd27d4`: 5 commits, zero merges,
  um pai cada (`fbe69ce` → `a539aab` → `bf936a7` → `d3b2840` → `8dd27d4`),
  cadeia contínua sem outra frente entrando no meio.
- `git diff --stat 3ba81c6 fbe69ce` (Lote 2): 4 arquivos, 321 inserções, 3
  remoções. `git diff --stat bf936a7 d3b2840` (Lote 3): 2 arquivos, 243
  inserções, 121 remoções. Os dois inventários ("O QUE MUDOU") batem com os
  diffs reais, arquivo por arquivo.
- `git status`: limpo. O `15-revisora.md` untracked que tinha ficado no meu
  worktree sumiu com o reancoramento, sem conflito.

## O que rodei

`npm run validate`: exit 0, sem falha real (conferi cada ocorrência de
"falha"/"✗" na saída — todas dentro de descrição de teste que passa). O
portão "o smoke do package.json e a matriz do CI concordam" confirma os 10
portões dos dois lados (`test-interpor-mesa` entrou nos dois), como as duas
tabelas de "O QUE ESTE RELATÓRIO AFIRMA" citam.

`node scripts/test-interpor-mesa.mjs` isolado, ao vivo, pelo navegador
real: **rodei eu mesma, não só li o código.** As 34 asserções passam, nos
dois cenários. Log completo abaixo, resumido:

```
=== A porta do PREPARO ===
✓ ...interpoe = {"aid":"gtesteinterpor","golpe":3,"alvoOriginal":"alvo"}
✓ Absorção 9 (não 3) · ✓ alvo 999→999 · ✓ interp 999→974 (34−9=25, bate)
✓ cobertura consumida depois de cair

=== A porta da RECUPERAÇÃO ===
✓ interp já golpeou e está se recompondo (golpes: 2, livre: 8)
✓ ...interpoe = {"aid":"gtesteinterpor","golpe":3,"alvoOriginal":"alvo"}
✓ Absorção 9 (não 3) · ✓ alvo 999→999 · ✓ interp 999→975 (33−9=24, bate)
✓ cobertura consumida depois de cair

✓ Interpor na mesa OK
```

Não rodei o `npm run smoke` completo (os 10 portões em sequência): a
Executora já documentou e investigou a fundo a flakiness de encadear ~10
Puppeteer nesta máquina (crashes em arquivos não relacionados a esta
rodada, descartada como causa por ela via `git stash` + reprodução), e
repetir essa investigação não acrescentaria nada — o que importa para esta
revisão é o portão novo isolado, que rodei, e o resto da suíte via
`validate` + CI (a matriz do GitHub Actions roda os 10 a cada push,
independente da instabilidade local).

## Os três pontos pedidos

**1. A asserção em par está genuinamente nas duas portas, não só
reaproveitada de nome.** Conferido pela leitura do arquivo final: existe
UMA função só, `resolverEConferir(p, rotuloPorta)` (`test-interpor-mesa.mjs:155`),
chamada por `cenarioPreparo` (linha 254) e por `cenarioRecuperacao` (linha
287) depois de cada uma declarar a interposição pelo caminho próprio
(`declararViaAbortar` vs. `declararViaForaDeHora`). A partir do ponto em que
`interpoe` está gravado no estado, o resto do teste — ler a Vida antes,
resolver o golpe pelo `window.__ESPELHO.abrir`, rolar, conferir a Absorção
na prévia (9, não 3), confirmar, e ler a Vida depois nos DOIS lados (alvo
parado, interp descendo pelo líquido exato) — é o MESMO código, não duas
cópias. Isto é mais forte que "duas asserções parecidas": é a prova de que,
se a porta da Recuperação escrevesse `interpoe` errado ou incompleto, a
MESMA verificação que pegou isso na porta do Preparo pegaria aqui também.
Rodei o arquivo eu mesma (acima) e as duas seções do log mostram os mesmos
nove `✓` na mesma ordem, com os números certos para cada porta.

**2. A leitura do `relogio()` (D17b) está certa.** Fui ler `grid.astro`
diretamente: `relogio()` (linha 4498) só cai no `ENC?.tick_atual` no ÚLTIMO
`return`, dentro do `else` que só executa quando `naFila()` está vazia
(linha 4511-4512) — com peças na mesa, ele sempre deriva de `tickDaVez()`
(o menor tick de quem está de pé) e `golpeMaisCedo()` (o menor golpe
agendado em `aResolver` entre quem está de pé), nunca do campo do encontro.
Refiz a conta à mão para a cena nova: `atk` tem golpe agendado no Tick 3
(`aResolver: [3]`), então `golpeMaisCedo()` = 3 sempre que `atk` está de pé,
independente do `tick` literal dele. Com `alvo.tick = 5` (o menor tick
"parado" da fila), `tickDaVez()` = 5, e `relogio()` = `Math.min(5, 3)` = 3.
Testando `faseEm(interp.acao, 3)` para os dois casos: em Preparo
(`golpes:[20], livre:25`) dá `'preparo'` (3 < 25 e 3 < 20); em Recuperação
(`golpes:[2], livre:8`) dá `'recuperacao'` (3 ≥ 2, o golpe já venceu, e 3 <
8, ainda não livre) — exatamente as duas fases que cada cenário precisa
para abrir o item certo no menu. Isto bate com o comentário novo em
`mesa-mock.mjs` ("por isso `alvo.tick` precisa começar em pelo menos 2") e
com o resultado do teste ao vivo, que confirma a fase de `interp` antes de
declarar (`"interp já golpeou e está se recompondo (golpes: 2, livre: 8)"`,
que só passa se `relogio()` tiver caído na janela certa). Achado real, fix
certo, comentário fiel ao que o código faz.

**3. B12/`roladaManual`:** registrado, fora de escopo desta revisão, nada a
verificar além de confirmar que está mesmo em `Pendencias.md` (está, linha
326) e que o contorno no teste (ler o total pela descrição da rolagem,
`#al-dn-pool`, em vez do "passa" da prévia) não mascara a asserção que
importa aqui — os dois números batem exatos nos dois cenários (34−9=25,
33−9=24), então o contorno é só uma forma de leitura, não uma correção
disfarçada de resultado.

## CORRIGE

Nada. O CORRIGE que eu tinha aberto em `15-revisora.md` (falta de e2e
ponta-a-ponta nas duas portas) está fechado por este lote.

## PERGUNTA

Nenhuma.

## ESCALA

Nada novo. O bug de `roladaManual` (B12) já está registrado em
`Pendencias.md` como fora desta frente; não é decisão de regra, é
engenharia represada, e quem decide a prioridade não sou eu.

## VEREDITO

SEGUE
