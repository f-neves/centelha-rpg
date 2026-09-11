# Progresso · rodada 43 (L77 + L76)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa PEQUENA (por função terminada,
não só por item), no instante em que ela fecha, hora lida da máquina (`date +%H:%M`).

- 13:09 (sha e071a1c, 0 à frente/atrás de `origin/main`): começando. Lendo Pendencias.md
  (L76, L77), as constantes reais de alcance corpo a corpo/haste, e onde `raioExtraHex`
  e `alcanceInterpor` moram, antes de escrever qualquer conserto.
- 13:10 · CONFERIDA A ÁLGEBRA DA ARMA ANTES DE ESCREVER (a exigência do Arquiteto). A
  parte do atacante que falta é `alcanceDoCentro(atacante) − 0,5 m` (o que passa do
  Médio já embutido nos `HEX_*`), e essa diferença, em metros, é `diâmetro − 1`: para
  porte ≥ Médio, `raio + braço − 0,5 = raio + (raio−0,5) − 0,5 = 2·raio − 1 = diâmetro −
  1`. Um Médio dá zero (fecha a invariante). Confirmado contra a tabela do humano nos
  dois sentidos: humano→Aboleth = `0,5 (atacante Médio, zero extra) + 2 (raio do
  Aboleth)` = 2,5 m; Aboleth→humano = `3,5 (2 + 1,5 de extra do atacante Enorme) + 0,5
  (raio do humano)` = 4 m. Os dois batem com o que ele escreveu. FECHOU, sem precisar
  parar e trazer.
- 13:13 · `src/lib/alcance.ts` CONSERTADO. `alcancaNoCorpoACorpo` ganha um 4º parâmetro
  `raioAtacanteHex` (default 0, mesma regra de nunca encurtar do 3º); `alcanceInterpor`
  ganha `raioInterpositorHex` e `raioAgressorHex` (os dois defaultando 0) e passa os
  dois para `alcancaNoCorpoACorpo` (resolve o L76 pela mesma fórmula). Assinatura
  compatível com toda chamada existente (novos parâmetros são opcionais).
- 13:15 · `src/pages/mesa/grid.astro` CONSERTADO nos seis lugares que a busca achou (a
  varredura foi por CONSTANTE crua `HEX_CORPO_A_CORPO`/`HEX_HASTE`, não por nome de
  função, para não repetir o oitavo/nono lugar da rodada 40): nova função
  `alcanceCentroExtraHex(c)` ao lado de `raioExtraHex` (mesma forma, `diâmetro − 1` em
  vez de `(diâmetro−1)/2`); `alcanceDaPeca` ganha o termo do próprio `c`;
  `declararGolpe` (o aviso "longe" e o `alcHex` da viagem simultânea); `folhaDaAcao` (o
  `avisoAlcance`, texto e régua); `valoresDoLance` (`alc`, a coluna "Alcance da arma");
  `candidatosParaInterpor` (L76, os dois lados). `destinoDoGolpe` (golpe caindo em corpo
  que caiu) e o passo automático de perseguição (`alvoC`) NÃO precisaram de edição: os
  dois já chamam `alcanceDaPeca(atacante, …)`, que ganhou o termo por dentro.
- 13:16 · SUÍTE EXISTENTE CONFERIDA ANTES DE ESCREVER TESTE NOVO: `test-combate-tempo.mjs`
  (a régua pura), `test-l67-corpoacorpo-mesa.mjs`, `test-interpor-mesa.mjs`,
  `test-grid-simultaneo.mjs`, `test-l68-foradavez-mesa.mjs` · todos verdes, sem tocar em
  asserção nenhuma. Nenhum cenário de mock hoje tem criatura Grande+ como ATACANTE em
  corpo a corpo (o Aboleth em `?cena=…` é sempre alvo/obstáculo, nunca ataca), então a
  invariante "Médio contra Médio não muda" já estava garantida por ausência de caso, o
  que o Arquiteto pediu para não aceitar como prova. Escrevendo teste novo que prova a
  invariante EXPLICITAMENTE (não por ausência) e os números do L77/L76 com porte real.
- 13:20 · TESTE PURO ESCRITO (`test-combate-tempo.mjs`). `alcancaNoCorpoACorpo`: a
  invariante Médio-contra-Médio explícita (4º parâmetro escrito por extenso, `0, 0`,
  não omitido) e o L77 com números reais (atacante Enorme, `raioAtacanteHex 3`, os
  4 m de Aboleth→humano; Enorme contra Enorme somando os dois lados, 7). `alcanceInterpor`
  (L76): a mesma invariante explícita, mais agressor Enorme e interpositor Enorme,
  cada um isolado do outro (para não confundir qual termo está sendo provado).
- 13:22 · CENA DE MESTRE ESTENDIDA (`mesa-mock.mjs`, `?cena=corpoacorpo`, a mesma do
  L67): `en` (Aboleth) ganha um golpe JÁ AGENDADO contra um novo `md` (Médio), a 5
  hexágonos, com `dados` escrito à mão (`classe: 'leve'`) para não depender do ataque
  natural real do bestiário. Novo `scripts/test-l77-alcancecentro-mesa.mjs`: abre a
  folha do golpe de `en` e lê os DOIS lugares que a rodada 40 achou incompletos
  (`valoresDoLance`/"Alcance da arma" e `avisoAlcance`), agora do lado do ATACANTE ·
  mostram "4 hex"/"alcança 4", não "1 hex"/"alcança 1", e continuam recusando a 5 m
  (o termo soma e tem teto, não vira alcance infinito). `test-l67-corpoacorpo-mesa.mjs`
  reconferido depois da cena crescer: continua verde (a rota de `at` mudou de hexágono
  por `md` virar obstáculo no caminho, mas a distância final, que é o que o teste
  verifica, não mudou).
- 13:25 · CONTROLE POSITIVO NOS DOIS NÍVEIS, quebrado e revertido de propósito. Puro:
  removi `+ Math.max(0, raioAtacanteHex)` de `alcancaNoCorpoACorpo`, rodei o teste ·
  as 3 asserções que dependem do termo (e só elas) ficaram vermelhas. Mesa: removi
  `alcanceCentroExtraHex(atacante)` do `alc` de `valoresDoLance`, rodei
  `test-l77-alcancecentro-mesa.mjs` · a asserção do "4 hex" (e só ela) ficou vermelha,
  voltando a mostrar "1 hex". Os dois revertidos, suítes verdes de novo.
- 13:28 · `npm run validate` INTEIRO: PAROU no `test-procedencia.mjs`, com 42 citações
  ENVELHECIDAS em `ESTADO.md`/`Pendencias.md`, nenhuma delas de código que esta rodada
  tocou. Causa: a nova `alcanceCentroExtraHex` (21 linhas líquidas, inserida logo depois
  de `raioExtraHex`, perto do TOPO do `grid.astro`) empurra tudo abaixo dela, e outras 4
  edições menores (nos 6 pontos do L77) empurram mais um pouco a partir de cada uma.
  Calculei a função de deslocamento exata pelos cabeçalhos `@@` do `git diff` (não por
  proximidade de texto, o defeito do `CATALOGO.md`) e confirmei contra `alcance.ts`
  (91→95, 94→98, 113→127, 126→144, as 4 sem ambiguidade). Em `grid.astro` a mesma conta
  dá candidatas para as outras, mas boa parte dos ALVOS originais é palavra genérica
  (`if`, `for`, `dist`, `vistos`, `SB.rpc`, `'forahora'`) ou nome de função que aparece
  na definição E em várias chamadas (`abortarGesto`, `candidatosParaInterpor`,
  `marcarInvestida`, `abrirCondicoes`, `LOG.splice`, `ocupadoPor`): a conta chega a uma
  FAIXA de linhas candidatas, não a uma linha só, e escolher sozinha dentro dela é
  exatamente a heurística de proximidade que já me confundiu duas vezes na rodada 41.
  NÃO tentei consertar `ESTADO.md`/`Pendencias.md` sozinha (fora do que esta rodada
  autoriza, e é o reaponte que a sequência do L65 reserva ao Arquiteto, ANTES do meu
  commit de código). Achado também: `scripts/mesa-mock.mjs` já tinha um hunk de OUTRA
  edição no meio da árvore (cena `BANDEIRAS`, linha 648, que eu não toquei) antes de eu
  escrever a minha própria (cena `corpoacorpo`, en/md), registrando, não é alarme, é só
  a razão de eu não ter calculado a função de deslocamento desse arquivo também: ela
  estaria misturando duas autorias. Escalando ao Arquiteto e PARANDO de trabalhar no
  código até a resposta: `npm run validate` continua vermelho por causa disto, então não
  há commit possível ainda (o gancho de `pre-commit` recusaria).
- 13:32 · REAPONTE DO ARQUITETO CHEGOU, E A CORREÇÃO SOBRE MIM: os três hunks de
  `mesa-mock.mjs` são meus, todos; o rótulo `if (BANDEIRAS) {` no cabeçalho `@@` do
  `git diff` é só a última linha que a heurística de contexto do git achou acima do
  hunk, não o lugar de onde ele saiu. Consertei os dez travessões que entraram nesta
  rodada (achados pelo Arquiteto no diff, mais três que ele não viu porque
  `test-l77-alcancecentro-mesa.mjs` é arquivo novo e `git diff` não varre não
  rastreado, o mesmo buraco da rodada 41): todos por troca de caractere na mesma
  linha, sem quebrar linha nenhuma, para não mexer no deslocamento que ele já
  reapontou. `npm run validate` inteiro: verde, 148 citações conferidas, 1 histórica.
- 13:35 · CÓDIGO COMMITADO (`51e5f10`), com pathspec, deixando `Pendencias.md`,
  `ESTADO.md` e `VOZ.md` de fora (são do Arquiteto, passo 3 do L65). Push limpo,
  `origin/main` confere em 0.
- 13:38 · UMA LINHA NOVA NO CATALOGO.md (autorizada pelo próprio Arquiteto, ao pedir
  "uma linha... quando você for escrever o fechamento"): nova linha na tabela "As
  formas", "o rótulo de escopo do `git diff`", registrando o achado do item 1 acima.
  Conferido antes de escrever: nada cita `CATALOGO.md` por número de linha em
  `Pendencias.md`/`ESTADO.md`/`VOZ.md`, e `test-procedencia.mjs` não varre
  `CATALOGO.md`, então a linha nova não quebra citação nenhuma.
- 13:39 · Rodando `npm run validate` mais uma vez pego um falso alarme (1 citação
  "envelhecida" em `Pendencias.md:3737`, sobre `cenaLembranca`); rodei
  `test-procedencia.mjs` sozinho de novo na hora seguinte e voltou verde. Não é meu:
  não toquei em `Pendencias.md` desde o commit, e o arquivo é compartilhado com o
  Arquiteto trabalhando nele agora. Leitura: peguei o arquivo no meio de uma escrita
  dele. Registrando para não alarmar por um sintoma que já sumiu. Rodada pronta:
  código dentro, empurrado, aviso a escrever.
- 13:54 · AVISO ENVIADO (sha `3920074`) COM O `TOPO` JÁ VELHO NO MOMENTO DO ENVIO,
  correção por fora porque o aviso enviado é congelado (a mesma regra da rodada 42).
  Escrevi `TOPO 5c99550` porque era o HEAD que eu tinha lido; entre eu escrever e
  rodar `--enviar`, o Arquiteto commitou `b8ab3ea` ("L80 conferido com o próprio
  portão... e a forma nova do `&&` depois do cano") direto na árvore compartilhada,
  46 segundos antes do meu `--enviar`. O `--enviar` releu o `HEAD` fresco (a correção
  da rodada 42) e o commit do aviso saiu com `b8ab3ea` como pai de verdade, então a
  ÁRVORE que a Revisora vai ler JÁ TEM esse commit dentro, só o campo `TOPO`
  ESCRITO no aviso ficou apontando para um HEAD anterior a ele, um passo atrás do
  que devia. `git diff --stat cb20d8e..b8ab3ea`: só `Pendencias.md` e
  `docs/simulacao/CATALOGO.md`, nenhuma linha de código. O número certo para o
  Arquiteto passar à Revisora quando chamar: `TOPO b8ab3ea00ddaf1247c327de079ecac3984eaccd5`,
  não `5c9955010f39060addf2e18128d4a5ee989fab71` (o que o aviso diz). Confirmado com
  `git fetch` que nada mais entrou depois disso: `origin/main` é `3920074`, igual ao
  meu `HEAD`, árvore limpa.
