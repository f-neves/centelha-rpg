# Rodada 39 · resposta da revisora (item 1: prazo do L71 exercitado por teste; item 2: L67 alcance corpo a corpo de borda a borda)

Revisora: aviso em `7ad7da7`, resincronizado para `e0326a9` (instrução do Arquiteto: "agora é
seguro, você não tem nada pendente"). BASE `93b6be7`.

## Recorte

`git rev-parse --show-toplevel` → `C:/Users/Neves/ClaudeCode/centelha-techlead-revisora`;
`git rev-parse HEAD` → `e0326a9537e34c516347437479e73aeda5dd88ce`. Batem. Quatro commits desde a
BASE: `0d1c300` (Arquiteto, reaponte + L75), `5b18466` (Executora, item 1 e item 2),
`7ad7da7` (Arquiteto, travessão), `e0326a9` (aviso).

## Item 1 (L71) · o prazo, observado na tela

Li `cenaVozPrazo` por completo (`test-grid.mjs:3032-3106`). Toda asserção lê DOM de verdade
(título/corpo do diálogo `.ui-dlg-tit`/`.ui-dlg-msg`, `title` do botão) · nenhuma recalcula por
dentro a condição. O ceticismo pedido ("chegou à tela se observa, nunca se recalcula") confere:
não é L74 de novo.

**Falsifiquei o achado do IndexedDB por origem eu mesma, não aceitei a palavra da Executora.**
Reverti `br.createBrowserContext()` para `br.newPage()` comum em `cenaVozPrazo` e rodei a bateria
inteira (não isolado). Resultado: `TimeoutError` esperando `dialog.ui-dlg.perigo[open]`
(`test-grid.mjs:3076`), exatamente depois das cenas de voz anteriores rodarem na mesma origem ·
o modelo real já estava em cache no IndexedDB, a interceptação do `.tar.gz` corrompido nunca foi
exercitada, o diálogo de prazo nunca apareceu. É a forma exata do falso-verde descrito no aviso.
Revertido o código de volta ao original imediatamente depois de observar a falha, antes de
qualquer outra coisa (CONTRATO §2); `git diff --stat` vazio, conferido. A causa é real e o
`br.createBrowserContext()` é o conserto certo, e reaproveitável para qualquer cena futura que
dependa de estado por origem, como o aviso propõe.

## Item 2 (L67) · a proibição, medida nas duas pontas

Rodei `scripts/test-l67-corpoacorpo-mesa.mjs` eu mesma: `EXIT=0`. As duas metades do critério de
aceitação estão provadas ao vivo, lendo `window.__ESPELHO.posDe`/`distHex` (posição crua do motor,
não recálculo): a perseguição para na borda do Aboleth (`dAt === 3`, não sobrepõe os círculos) e o
Enorme parado não prende quem só nasce vizinho dele (`posVz` chega a `q:9,r:4`, não fica em
`q:5,r:4` · a segunda passada de `caminharHex` segue viva).

Conferi a geometria do `Math.ceil` em `raioExtraHex` (`grid.astro:3344-3347`): `PORTE_M['Enorme']
= 4`, `(4-1)/2 = 1,5`, `Math.ceil(1,5) = 2`. Bate com a conta do comentário (2 m de centro a
centro ainda sobrepõe os círculos contra 2,5 m de raios somados). O clamp de alvo pequeno
(`Math.max(0, raioAlvoHex)`) mora dentro de `alcancaNoCorpoACorpo` (`src/lib/alcance.ts:94`), não
em cada chamador · como o comentário do próprio arquivo promete.

**Os dois achados da Executora testando ao vivo, conferidos e não aceitos de graça:**
- o oitavo lugar (`declararGolpe`, `grid.astro:8179`) está presente e soma `raioExtraHex(alvo)`.
- o arredondamento trocou de chão (implícito na comparação `<=`) para teto: confirmado acima pela
  conta, não pela troca em si.

**Achado próprio, um NONO lugar, não corrigido nesta rodada e não no levantamento estático
original** (o Arquiteto convidou a busca: "se existe um oitavo, pode existir um nono").
`grid.astro:10072`, dentro de `valoresDoLance()` (a terceira coluna da ficha do lance, linha
"Alcance da arma"): `const alc = classeAtq === 'haste' ? HEX_HASTE : HEX_CORPO_A_CORPO;`, sem somar
`raioExtraHex`. A função é comentada "só leitura de propósito" e o valor é só EXIBIÇÃO · não entra
em decisão de motor nenhuma, então não é o mesmo defeito do oitavo lugar (que mentia o Tick de
verdade). O risco é outro: essa linha fica ao lado de "Distância" na mesma tabela, e um mestre
comparando os dois números à mão pode concluir errado sobre alcance, divergindo do que o motor
decide de verdade nos outros lugares corrigidos. Classifico como CORRIGE, severidade baixa
(cosmético/confuso, não funcional).

**Um segundo ponto, mais fraco: `alcanceInterpor` (`src/lib/alcance.ts:126`)** chama
`alcancaNoCorpoACorpo(opts.hexagonosDoAgressor, !!opts.haste)` sem o terceiro parâmetro · usa o
`raioAlvoHex = 0` padrão da função. O Arquiteto confirmou: pela régua do L67 o raio do
interpositor deveria entrar ali, é omissão de verdade. Mas mudar isso muda o comportamento da
interposição, mecânica que o item L67 nunca analisou, e ele não quer conserto de passagem aqui
(é exatamente o cuidado que tirou o L70 de dentro do L67). ESCALA, item próprio a abrir, não
CORRIGE desta rodada.

## O 0d1c300 (Arquiteto, fora do commit avisado, dentro do intervalo pedido) · L75 e a reaponte

**L75: CONFIRMADO pela API real do GitHub, terceira conta e agora certa.** Não aceitei o número do
Arquiteto de novo (foi errado duas vezes seguidas no mesmo item, ele mesmo pediu para eu saber por
mim). Puxei os jobs `Smoke · test-grid` de 28 runs pela API (`gh api
repos/f-neves/centelha-rpg/actions/runs/<id>/jobs`), medi `completed_at - started_at` eu mesma,
sem usar o número que a ferramenta mostra primeiro. Descartando os 2 runs mais antigos do lado
"antes" e o run do próprio `0d1c300` (08:27, depois do corte de 07:10Z citado no fechamento) do
lado "depois", os quatro números batem exatamente com os publicados: mediana antes 684 s, média
661 s, mínimo 459 s, máximo 832 s (15 runs); mediana depois 781 s, média 732 s, mínimo 564 s,
máximo 845 s (10 runs). L75 fecha limpo.

**Achado próprio, não pedido no aviso, e é sobre o MESMO commit que fecha o L75.** O workflow run
do `0d1c300` (id `34579254256`) terminou com `conclusion: failure`. O job `Smoke · test-grid`
passou; quem quebrou foi `Dados e regras` (o portão rápido, `test-procedencia.mjs`), acusando
**28 citações de código ENVELHECIDAS** · não as "5... do L72, item fechado" que a mensagem do
próprio commit declara. Conferi duas a mão, na árvore do próprio `0d1c300` (que não toca
`grid.astro`, herda o mesmo conteúdo do pai `d691d97`):

- `ESTADO.md:418` aponta para `grid.astro:5856` (`avancarAteParar`); a função mora em `5819`
  nessa árvore · erro de 37 linhas.
- `Pendencias.md:2799` aponta para `grid.astro:10966`, e a âncora certa é a chamada inteira,
  `SB.rpc('jogador_registra', { p_arena: ARENA.id, p_linha: linha })` (não o prefixo `SB.rpc`,
  que casa com três chamadas diferentes, `jogador_muda_peca`/`jogador_mover`/`jogador_tira_do_mapa`,
  em 2630/2635/2639 · comparei contra o prefixo em vez da citação inteira, e o Arquiteto pegou
  o erro). A chamada certa mora em `10916` nessa árvore · erro de 50 linhas, não de mais de 8000.

**A causa não é cálculo errado, é ORDEM DE COMMIT, e o Arquiteto corrigiu o meu diagnóstico depois
de eu já ter escrito o rascunho.** O reaponte foi calculado contra a árvore de trabalho local, que
já tinha os edits (ainda não commitados) do L67/L71; o commit dos documentos (`0d1c300`) saiu ANTES
do commit do código que os torna verdadeiros (`5b18466`, 35 segundos depois). Confirmei eu mesma,
comparando com o HEAD desta rodada: em `e0326a9`, `jogador_registra` está EXATAMENTE em `10966`,
não perto por sorte · bate dígito a dígito com a citação. Não é coincidência dentro de uma
tolerância do checador, como eu tinha escrito antes de checar: **o CI de `e0326a9` está verde
porque a citação sempre esteve certa para o estado que ela descrevia, só que esse estado ainda não
tinha sido commitado quando `0d1c300` foi commitado.** É a segunda vez que essa ordem se inverte
(a primeira foi `cd31b74`/`f4df8f7` na rodada 38). O CORRIGE fica de pé, mas é outro: registrar
a sequência (código primeiro, reaponte e fechamento de documento depois) em vez de tratar como
defeito de cálculo do script. Não se conserta `0d1c300` rodando o reaponte de novo, porque isso
duplicaria o deslocamento contra o HEAD atual · o commit fica como está, e o que muda é a ordem
daqui para frente (o Arquiteto vai registrar em L65).

**O que continua de pé, e é mais forte do que eu tinha escrito:** o `pre-commit` lê a ÁRVORE DE
TRABALHO, não o commit. A árvore de trabalho já tinha o código certo quando o portão rodou, então
ele ficou verde sobre um pareamento que o COMMIT em si não continha. É exatamente o tipo de coisa
que essa trava deveria pegar e não pegou, porque ela audita o disco, não o histórico.

## Travessão

Não confiei na varredura do Arquiteto · ele avisou nesta própria rodada que já errou assim antes
("git diff não enxerga arquivo não rastreado"). Rodei a minha própria sobre o diff inteiro da
rodada (`93b6be7..e0326a9`, os quatro commits, todo arquivo): nenhuma linha adicionada carrega `·`.
Limpo, e conferido por mim.

## Portões

`npm run validate`: `EXIT=0`, limpo. `node scripts/test-grid.mjs` (bateria inteira, sem
modificação nenhuma, checkout limpo): `EXIT=0`, todas as cenas passam, incluindo as duas de voz
(`cenaVozPrazo` com `br.createBrowserContext()` de verdade) e a nova `?cena=corpoacorpo` do L67.

## BLOQUEIA

Nada bloqueia. Os dois itens do aviso (L71, L67) estão provados como declarado, e a proibição do
L67 está medida nas duas pontas.

## CORRIGE

1. `grid.astro:10072` (`valoresDoLance`, "Alcance da arma" na ficha do lance) não soma
   `raioExtraHex` · nono lugar, display-only, severidade baixa, mas divergente do que os outros
   lugares corrigidos decidem de verdade.
2. O reaponte + fechamento de documento de `0d1c300` foi commitado ANTES do commit de código que
   ele descreve (`5b18466`, 35s depois) · segunda vez que essa ordem se inverte (a primeira foi
   `cd31b74`/`f4df8f7`, rodada 38). Não é defeito de cálculo do script (as duas âncoras conferidas
   à mão, `avancarAteParar` e `jogador_registra`, batem exatamente com o HEAD atual, erro de 37 e
   50 linhas nessa árvore, e não com o disparate de "mais de 8000" que eu tinha escrito antes de
   comparar contra a citação inteira em vez de um prefixo). É ordem de commit, e o Arquiteto vai
   registrar a sequência certa (código primeiro, documento depois) no L65. Não se conserta
   `0d1c300` reapontando de novo, por já estar certo contra o HEAD de hoje.

## ESCALA

`alcanceInterpor` (`src/lib/alcance.ts:126`) não soma o raio do interpositor ao alcance do
agressor · omissão real pela régua do L67, confirmada pelo Arquiteto, mas fora do escopo desta
rodada de propósito (mudaria comportamento de uma mecânica, a interposição, que o L67 nunca
analisou · o mesmo cuidado que tirou o L70 de dentro do L67). Vira item próprio.

## VEREDITO

Os dois itens do aviso da rodada 39 (L71, L67) estão corretamente provados, com ceticismo aplicado
e falsificação própria em ambos, não aceitos de palavra. O L75 fecha limpo, confirmado pela API,
terceira conta e agora certa. `node scripts/test-grid.mjs` limpo, `EXIT=0`. Dois achados próprios
fora do pedido do aviso: um nono lugar de exibição sem `raioExtraHex` (baixo risco, CORRIGE) e uma
inversão de ordem entre o commit de documento e o commit de código que ele descreve em `0d1c300`
(segunda ocorrência do mesmo padrão, CORRIGE como sequência, não como cálculo). Nesta última, o
meu primeiro diagnóstico errou o mecanismo (cálculo em vez de ordem) e o número (mais de 8000
linhas em vez de 50, por comparar contra um prefixo em vez da citação inteira) · o Arquiteto
corrigiu os dois antes deste arquivo ser commitado, e eu conferi cada correção de novo contra a
árvore antes de aceitar. Travessão limpo, conferido de novo e não herdado da varredura alheia.
