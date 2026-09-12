# Progresso · rodada 52 · L88

Sinal de vida da Executora. Uma linha por etapa pequena, hora real (`date +%H:%M`).

- 03:54 · Rodada aberta (`npm run rodada`). Tarefa: o detector de ocupação
  (o mestre confere o RESULTADO a cada repintura, par a par, e avisa no
  registro quando dois corpos não cabem no mesmo hexágono). Decisão do
  humano, `L87` era o pré-requisito e está fechado. Levantamento antes do
  código, três perguntas de custo:
  1. com que frequência a repintura roda (medir, não estimar);
  2. onde o detector entra (encostar em `conferirFila`, ex-`conferirChao`,
     ou um irmão, com o argumento escrito);
  3. o que escreve e onde (decidido: registro, não faixa nova) e como evita
     uma linha por oscilação se o estado ilegal aparecer/sumir/voltar.
  Reusa `ocupadoPor`, sem regra nova. Controle negativo obrigatório:
  fabricar o estado ilegal de propósito (caído dividindo + curar) e exigir
  que o detector grite.

- 04:11 · LEVANTAMENTO E CÓDIGO, num eixo só (a rodada é pequena o
  suficiente para não valer separar). As três respostas:

  **1. Frequência da repintura:** medida, não estimada. `pintarIniciativa()`
  tem 30 chamadas em `grid.astro`, todas discretas (depois de uma escrita
  específica terminar), nenhuma dentro de `requestAnimationFrame` nem
  `setInterval` (os únicos `requestAnimationFrame` do arquivo são resize e
  reflow, e nenhum chama `pintarIniciativa`). "De graça", como o Arquiteto
  chutou: o par a par (`ocupadoPor` por peça, O(n²) só nele) roda no máximo
  uma vez por ação de mesa, não por quadro.

  **2. Onde entra, com o argumento:** `conferirOcupacao()` nova, irmã de
  `conferirFila()`, chamada de dentro de `pintarIniciativa()` (não de
  `pintarTokens()`). O argumento é o próprio cenário que o Arquiteto propôs
  para o controle positivo: `curar` NÃO chama `pintarTokens()` (não move
  token nenhum), só `pintarIniciativa()`. Se o detector morasse em
  `pintarTokens`, o retorno PASSIVO do L84 (curar alguém debaixo de uma peça
  de pé) nunca seria visto, porque a única coisa que muda é uma condição/PV,
  não uma posição. `pintarIniciativa()` é chamada tanto por quem move quanto
  por quem cura/dá Mana/aplica condição, e é por isso que ela já era o lar
  de `conferirFila`.

  **3. O que escreve, onde, e o caso que treme:** vai para o registro
  (`logar(null, ...)`, decidido), nomeando as duas peças e o hexágono. A
  forma da TRANSIÇÃO de `conferirFila` (Set antes/agora, avisa só quem
  entrou) NÃO resolve o caso que treme, e agora sei por quê, medindo:
  `porNoMapa` grava a posição OTIMISTA antes de perguntar ao banco
  (`gravarToken`), então uma casa recusada por ocupação passa por um
  instante em que `TOKENS` tem a posição ilegal e `pintarIniciativa()` já
  rodou em cima dela, antes do desfazer repintar de novo, limpo. "Viu em
  duas conferências seguidas" pareceria filtrar isso (a violação sumiria
  antes da segunda), MAS quebra o caso comum: um `curar` isolado chama
  `pintarIniciativa()` UMA VEZ só, e se nada mais repintar depois, uma
  violação de VERDADE nunca chegaria à segunda conferência para confirmar,
  ficando presa em "suspeita" para sempre, silenciosa (o oposto do que o
  L88 existe para consertar).

  A solução que escrevi troca "duas conferências" por RELÓGIO:
  `ATRASO_CONFERENCIA_OCUPACAO` (600 ms) agenda a confirmação por
  `setTimeout`, não pela sorte de outro repaint acontecer depois. O par
  otimista-e-desfeito do `porNoMapa` se resolve em milissegundos (a mesma
  rodada de rede), bem antes do relógio vencer, e nunca confirma. O `curar`
  isolado deixa a violação parada ali, e quando o relógio vence (sem
  depender de mais nada acontecer), o disparo CONFERE DE NOVO no próprio
  instante (o par pode ter se resolvido no meio do caminho por outra razão)
  e só então grava. `OCUPACAO_ANUNCIADA` impede relogar enquanto a mesma
  violação persistir; ela sai do conjunto quando o par se resolve, e volta
  a valer para um incidente genuinamente novo depois.

  **`paresIlegaisAgora()` reusa `ocupadoPor` de verdade** para a DECISÃO
  ("A está mal?" = `ocupadoPor(pos.q, pos.r, A.id)`, a mesma fonte que
  `gravarToken` já consulta): se a régua de colisão mudar, muda num lugar
  só. O laço que ACHA COM QUEM (para nomear os dois na linha) relê a mesma
  distância e o mesmo `podeDividir` que `ocupadoPor` já leu por dentro, e
  isso é atribuição, não decisão nova: registrado no comentário do código
  para não parecer regra duplicada a quem ler depois.

  TESTE NOVO `test-l88-ocupacao-detector-mesa.mjs` (smoke + matriz de CI),
  cena `?cena=ocupacaodetector`: `pa` (PV 0, sem condição) dividindo com
  `pb` (de pé), legal hoje por `podeDividir`; curar `pa` fecha a desculpa
  sem deslocar nada, e o detector tem de gritar UMA VEZ, nomeando os dois.
  Controle negativo no mesmo arquivo: `mv` arrastada para cima de `bq` é
  recusada pelo L70, e o instante otimista (confirmado existir, é a mesma
  causa medida acima) NÃO produz linha nenhuma. 8 asserções, todas verdes.

  CONTROLE NEGATIVO POR `git stash` (só do meu `grid.astro`, não commitado):
  contra o código de antes do L88, as três asserções do caso positivo falham
  de verdade (o detector não existe, ninguém grita), e a asserção do caso
  que treme continua passando (nada grita, mas por não existir detector
  nenhum, não porque o filtro funcione): confirma que o teste mede o que
  diz medir. Restaurado com `stash pop`, verde nos dois lados de novo.

  Bateria completa verde: `test-l67-corpoacorpo-mesa`, `test-l68-foradavez-mesa`,
  `test-l70-ocupacao-mesa`, `test-l70-empurrao` (15), `test-l84-caidofila-mesa`,
  `test-l84-levantar-mesa`, `test-grid-simultaneo` (79) e `test-grid.mjs`.
  `npm run validate`: único vermelho é o portão de procedência, esperado (73
  citações movidas, `conferirOcupacao` perto do topo de `grid.astro` desloca
  tudo abaixo). Em `ESTADO.md`, `Pendencias.md`, `CONJURACAO.md`,
  `Grid_Mobile.md`, `VOZ.md`, `CONTEXTO.md`. Uma delas, `Pendencias.md:3785`,
  aponta para `mesa-mock.mjs:1188`, mas a citação mora no documento do
  Arquiteto, não é minha para tocar (mesmo achado da rodada anterior). Não
  toquei nenhum dos seis documentos. Commit pronto, aguardando reponte.

- 04:13 · commit BLOQUEADO pelo gancho de pre-commit, como esperado.
  Mensagem enviada ao Arquiteto com a contagem e os documentos. Parado
  aqui, sem tocar nos documentos e sem `--no-verify`.

- 04:27 · O ARQUITETO PERGUNTOU DE ONDE VINHAM OS 600ms. Resposta honesta:
  de lugar nenhum, era margem escolhida sem medir ida e volta nenhuma, e
  ele identificou exatamente isso ("número na tela"). Ele propôs a
  alternativa certa, e ela é melhor de verdade, não só mais segura: em vez
  de um relógio perguntando "provavelmente já resolveu?", `porNoMapa` marca
  `POSICAO_PENDENTE.add(cid)` no instante em que grava a posição otimista
  (antes do `await gravarToken`) e tira a marca assim que o `await` resolve
  (sucesso ou erro). `paresIlegaisAgora()` pula quem está pendente, dos dois
  lados do par. Determinístico: pergunta "esta escrita já foi confirmada?",
  não "quanto tempo é seguro esperar?", e a resposta mora no mesmo
  estrangulamento que o L70 já decidiu ser o lugar certo, não num intervalo
  escolhido de fora.

  `ATRASO_CONFERENCIA_OCUPACAO`, o `Map` de timers e a re-conferência no
  disparo do `setTimeout` saíram inteiros. `conferirOcupacao()` ficou mais
  simples (sem agendar nada, só compara `agora` com `OCUPACAO_ANUNCIADA` e
  loga o que é novo). Reduzi as esperas do teste de 900ms para 300ms
  (não há mais relógio nenhum para esperar passar, só o `await` real de
  `gravarPeca`/`gravarToken` no mock, que é quase instantâneo). As 8
  asserções continuam verdes.

  ACHADO DE PASSAGEM, procurando "L88" no código para conferir os
  comentários: DOIS comentários meus da rodada 50 (`levantarDoChao`/
  `porNoMapa`, o achado do Arquiteto sobre a corrida entre clientes)
  citavam "L88" quando o número certo, conferido agora no `Pendencias.md`,
  é **L66** (o item antigo sobre função que recusa/escreve sem avisar quem
  chama). `L88` sempre foi o detector desta rodada; eu tinha escrito o
  número errado três vezes em `grid.astro` na rodada 50, sem perceber que
  colidia com um item que ainda nem existia. Corrigi as três no código
  (comentário, não citação de linha, sem reponte necessário). NÃO CORRIGI
  a mesma frase em dois lugares que são histórico fechado: `50-executora.md`
  (aviso enviado, frozen) e `progresso-50-l70.md:459` (rodada já fechada,
  registro cronológico): registrado aqui em vez de reescrever o passado.

- 04:28 · commit BLOQUEADO de novo pelo gancho de pre-commit (o código
  mudou desde o último reponte, e agora são 71 citações, não mais 74).
  Mensagem enviada ao Arquiteto. Parado aqui.

- (commitado como `8d7b450`, empurrado, aviso enviado como `5c5cf81`.)

- CORRIGE da Revisora, depois do veredito: `abrirCondicoes`'s `repintar`
  (`grid.astro`) só chamava `pintarLista()`, nunca `pintarIniciativa()`.
  `conferirOcupacao` só roda dentro de `pintarIniciativa`, então tirar uma
  condição à mão pela caixa (um dos CINCO caminhos passivos que o L88
  nomeia por escrito) nunca disparava o detector: 0 gritos, medido ao vivo
  pela Revisora. O Arquiteto reclassificou de ESCALA para CORRIGE contra o
  próprio veredito dela, com o motivo escrito: a causa é pré-existente
  (rodada 51), mas a CONSEQUÊNCIA é desta rodada, porque o L88 promete
  cobrir justamente esse caminho e não cobria.

  Conserto de uma linha: `repintar: () => { pintarLista(); pintarIniciativa(); }`.
  De brinde, fecha também uma assimetria que a Revisora achou na rodada 51
  (a tela de quem está na vez ficava desatualizada enquanto o resto da mesa
  já se corrigia pelo tempo real).

  UM ERRO MEU NO CAMINHO: ao reescrever o comentário acima da linha, apaguei
  por engano os campos `gravar`/`registrar` do mesmo objeto (o `old_string`/
  `new_string` do meu editor não os incluiu). O primeiro teste que exercitou
  o botão "✕" de tirar condição quebrou em runtime (`ctx.registrar is not a
  function`), pego na hora por rodar o teste antes de seguir. Corrigido
  devolvendo as duas linhas.

  Asserção nova em `test-l88-ocupacao-detector-mesa.mjs`, pelo caminho exato
  que a Revisora usou ao vivo: dar "Caído" em `pa` (fecha a sobreposição de
  novo, sem grito novo, correto) e depois TIRAR "Caído" pela caixa (reabre a
  sobreposição), exigindo o grito NA HORA (sem esperar uma repintura não
  relacionada passar depois). 7 asserções novas (helpers de abrir/aplicar/
  tirar condição pela caixa, mais as duas transições). 15 no arquivo,
  todas verdes.

  CONTROLE NEGATIVO por `git stash` do meu próprio `grid.astro` não
  commitado: contra o código de antes deste CORRIGE, a asserção nova (e só
  ela) falha, reproduzindo exatamente o "0 gritos" que a Revisora mediu.
  Restaurado, verde de novo.

  Bateria de regressão (L84 caído-na-fila, L70 ocupação, Grid simultâneo)
  verde. `npm run validate`: único vermelho é procedência, 12 citações
  movidas (edição pequena, perto do fim do arquivo). Commit pronto.

- 04:53 · commit BLOQUEADO pelo gancho de pre-commit, como esperado (12
  citações). Mensagem enviada ao Arquiteto. Parado aqui, sem tocar em
  `CATALOGO.md` (dele, mid-edit) nem em nenhum documento.

