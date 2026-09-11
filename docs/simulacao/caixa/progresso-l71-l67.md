# Progresso · rodada 39 (L71 provado, depois L67)

Sinal de vida (ARQUITETO.md §1.2). Uma linha por etapa, no instante em que ela fecha, hora lida
da máquina (`date +%H:%M`).

- 04:00 (sha d691d97, pós `git pull --rebase` + `git fetch`, 0 à frente/atrás de `origin/main`):
  começando. Item 1 primeiro, inteiro, antes de tocar no item 2 (ordem explícita do Arquiteto).
  Plano do item 1: `page.setRequestInterception` no Puppeteer para servir um `model.tar.gz`
  PRESENTE (200 no HEAD, não 404) e CORROMPIDO (poucos KB de lixo) sem tocar no arquivo real
  versionado em disco; `prazoMs` pequeno para o teste custar segundos; observar a MENSAGEM na
  tela (não recalcular a condição internamente, é o achado do L74) e que o microfone volta a
  responder depois. Vou checar antes se `comando-voz.ts`/`caminhosPadrao` já aceitam um jeito de
  o teste configurar um `prazoMs` pequeno, ou se isso precisa de uma linha nova em grid.astro.
- 04:20 · ITEM 1 FEITO E PROVADO AO VIVO. `?vozprazo=<ms>` novo em `grid.astro` (query param,
  como `?bench=`/`?despejo=`, nunca usado em produção) para o teste encurtar os 20s padrão.
  `cenaVozPrazo` em `test-grid.mjs`: um `model.tar.gz` de mentira (magic bytes de gzip + lixo)
  via `page.setRequestInterception`, sem tocar no arquivo real de 31 MB. ACHADO rodando a
  bateria inteira (não isolado): o `vosk-browser` extrai o modelo para um sistema de arquivos
  que persiste em IndexedDB POR ORIGEM: outras cenas já carregam o modelo de verdade antes
  desta, e uma página nova comum acha o modelo já extraído e nunca torna a pedir o `.tar.gz`,
  fazendo o teste passar com o modelo BOM sem provar nada. `setCacheEnabled(false)` e
  `Network.clearBrowserCache` não resolvem (não é cache HTTP). Resolvido com
  `br.createBrowserContext()` (armazenamento isolado, sem herdar nada das cenas anteriores).
  Confirmado ao vivo: a mensagem de prazo vencido aparece na tela (não recalculada por dentro,
  o cuidado do L74), o prazo de 1,5s venceu em ~1,5s de verdade, e um segundo toque tenta
  carregar de novo em vez de ficar preso. `npm run validate`: só procedência vermelha (27
  citações, deslocamento de sempre), flagueando ao Arquiteto quando o item 2 também fechar.
  Começando o levantamento do L67 (Pendencias.md), sem tocar em código ainda.
- 05:05 · LEVANTAMENTO DO L67 FEITO. Sete lugares medem alcance do centro, sem contar o raio
  do alvo, batendo exatamente com o número do Arquiteto (nenhuma discrepância a reportar):
  `grid.astro:5642` (`noAlcance` em `avancarTickSimultaneo`), `:5692` e `:5706` (parada de
  movimento e reprojeção de agenda, mesma função), `:6149` (`faltamHex` em
  `declararAtaqueSimultaneo`), `:8115` (`declararGolpe`), `:9556` (`folhaDaAcao`), `:8261`
  (`destinoDoGolpe`, filtro de alvo de redirecionamento). Dois primitivos compartilhados,
  ambos hoje só olham o atacante: `alcanceDaPeca` (`:5307-5309`) e `alcancaNoCorpoACorpo`
  (`alcance.ts:82-84`). Não existe hoje um "raio em hexágonos" pronto; vai precisar de
  conversão nova a partir da tabela `PORTE_M` (metros de diâmetro, `:3316-3322`) já que o
  token ocupa sempre 1 hexágono hoje independente do porte (o raio maior é só para medir
  alcance, não para desenhar). A segunda passada de `caminharHex` que afrouxa o veto
  (`:5668-5672`, gatilho: `distAntes > paraEm && distanciaHex(novo, mira) >= distAntes`) é
  independente do tamanho do alvo perseguido; somar o raio do alvo num valor tipo `pararA`
  só faz esse gatilho dela disparar MENOS vezes no caso de perseguição (porque a perseguição
  para mais cedo), nunca elimina o caso do Enorme parado prendendo vizinhos, que não depende
  de quem está sendo perseguido. Não vou tocar nela. Começando a implementação.
- 05:22 · ITEM 2 (L67) FEITO E PROVADO AO VIVO, DOIS ACHADOS NO CAMINHO.
  `raioExtraHex` novo (`grid.astro`, perto de `diametroM`) e um terceiro
  parâmetro em `alcancaNoCorpoACorpo` (`alcance.ts`, com o `Math.max(0,…)` do
  clamp morando na própria função, não em cada chamador); os sete lugares do
  levantamento ganharam o raio do alvo, sem tocar na segunda passada de
  `caminharHex` (proibição intacta).
  ACHADO 1, rodando `test-grid-simultaneo.mjs` (não isolado): um OITAVO lugar
  que o levantamento estático não achou porque não chama `alcanceDaPeca`/
  `alcancaNoCorpoACorpo` por nome. `declararGolpe` reimplementava a mesma
  conta inline (`classe==='haste'?HEX_HASTE:HEX_CORPO_A_CORPO`) só para a
  PRÉVIA de quantos Ticks a peça leva até o alcance. Sem o raio ali, a prévia
  prometia um Tick e `declararAtaqueSimultaneo` (que já tinha o raio) gravava
  outro: a caixa mentia. Corrigido somando `raioExtraHex(alvo)` também nesta
  conta. Não é fuga do "sete": o levantamento contou certo os lugares que
  DECIDEM alcance por nome; este é a mesma régua copiada à mão, achada só
  testando de verdade, e por isso corrigida junto, não como item novo.
  ACHADO 2, mais fundo: `raioExtraHex` estava arredondando errado. Para um
  Enorme, a conta ingênua dá 1,5 hexágono extra, mas parar em `1+1=2` (o chão)
  ainda SOBREPÕE os círculos dos dois corpos (2 m de centro a centro contra
  2,5 m de raios somados), geometricamente ainda "dentro". Só em `1+2=3` os
  círculos deixam de se cruzar. Troquei para `Math.ceil`: com o chão a
  perseguição contra o Aboleth da cena de teste levava DOIS Ticks (a primeira
  caminhada parava em 3, sem progresso, e só a segunda passada fechava para
  2); com o teto ela chega em UM Tick, batendo com a previsão do próprio
  Arquiteto no L67 ("a primeira caminhada consegue chegar lá").
  As duas asserções pedidas, provadas ao vivo na mesma cena (`?cena=corpoacorpo`,
  `mesa-mock.mjs`, nova, com um Aboleth real de `mon-aboleth`):
  `test-l67-corpoacorpo-mesa.mjs` (novo arquivo, também em `npm run smoke` e
  `npm run corpoacorpo-mesa`) confirma que a perseguição para exatamente na
  distância 3 (borda, não corpo) e que uma peça nascida vizinha do Aboleth,
  em deslocamento puro (sem `mov.alvo`, `paraEm=0`, o L67 não entra aí), ainda
  chega ao destino em vez de ficar presa: a segunda passada continua viva.
  `window.__ESPELHO` ganhou `posDe`/`distHex` (leitura crua de posição e a
  `distanciaHex` de verdade, para o driver Node observar sem recalcular por
  dentro, o cuidado do L74). Testes puros novos em `test-combate-tempo.mjs`
  para o terceiro parâmetro de `alcancaNoCorpoACorpo` (com raio, sem raio, e
  o clamp do alvo pequeno). `npm run validate`: só procedência vermelha (29
  citações agora, cresceu de 27 com o deslocamento de linha dos meus próprios
  edits). `npm run smoke` inteiro, verde, sem exceção, inclusive as 20
  cenas do espelho de motor e as 4 cenas de voz da rodada 39 item 1.
  Rodada 39 (os dois itens) está pronta para o reaponte único e o fecho.