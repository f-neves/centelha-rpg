# Cartógrafo · documento central do mapa de Uldun

Este é o documento que toda sessão futura sobre o mapa do mundo lê antes de começar, e
atualiza quando uma decisão nova for tomada. Registra só o que foi decidido ou
confirmado pelo usuário; o que é recomendação de IA fica marcado como tal.

## Estado atual

*(Atualizar esta seção antes de encerrar toda sessão de trabalho no mapa — é a
primeira coisa que `/cartografo` mostra.)*

- **Última atualização:** 2026-09-23 (sétima rodada do dia). **Travar objeto**,
  **tema claro/escuro** e **o acúmulo de três rodadas finalmente commitado**.
  - **Travar objeto (item 1)**: esquema definido em `ESPEC-dados.md`
    ("Travamento") **para todos os objetos editáveis de uma vez** · lugar, rio,
    estrada e área · não só para o que existe hoje. Duas travas independentes:
    `travado` no objeto (padrão `false`) e o **cadeado por camada**
    (`dados/camadas_travadas.json`, arquivo novo), sendo a trava efetiva a OU das
    duas. **O cadeado de camada nunca escreve no objeto** · é o que faz
    "destravar a camada devolve cada um ao que era" ser verdade sem restaurar
    nada. Recusa por trava é **409** e não 422, para a interface dar aviso
    discreto em vez da faixa vermelha de erro. Tecla `T`, cadeadinho no mapa e na
    lista, as duas travas passam pelo desfazer. 15 testes novos, 79 no total.
  - **Tema (item 2)**: botão `☾`/`☀` na barra de cima, tecla `D`, escolha
    lembrada em `localStorage`, lida num script inline no `<head>` para a página
    não piscar. Nenhum dos temas toca em `#mapa`.
- **Rodada anterior (sexta), para referência:** Três itens: regra
  nova contra inferir o que o usuário fez a partir de rastro de uso (e remoção
  da inferência que eu tinha escrito); **a ressalva de "terra ou mar sob o
  cursor" estava ERRADA e foi corrigida E implementada**; e a régua deixou de
  usar `prompt()` pro nome da medição. **Nada commitado** (pedido explícito).
  - **Terra/mar sob o cursor, implementado** (`static/js/terra-ou-mar.js`): o
    usuário apontou que não precisa da máscara de 10240px — o bloco da costa
    que o navegador já baixou JÁ é a resposta (terra tem alfa 255, mar tem 0).
    Canvas oculto, `ImageData` guardado por bloco (teto de 60, descarte do mais
    antigo), leitura no zoom nativo, nenhuma chamada ao servidor por movimento
    do mouse. Dois achados do caminho: **bloco ausente (404) = mar** (o gerador
    não grava tile totalmente transparente) e **o único impedimento real seria
    CORS** (tile de outra origem deixaria o canvas "tainted") — não é o caso
    aqui, mesma origem, mas o código trata. Conferido com controle negativo
    contra os mesmos arquivos de tile: terra conhecida → alfa 255; mar aberto →
    bloco ausente; e mar DENTRO de um bloco que existe → alfa 0 (o controle que
    prova que a regra não é "bloco existe = terra"). **O caminho do canvas no
    navegador em si só um teste no navegador exercita.**
  - **Régua: `prompt()` → `#modal-medicao`**, mesmo padrão do de Lugar (Enter
    salva, Esc cancela, foco no campo, resumo da medição no topo, erro dentro
    do modal). Não sobra nenhum `prompt()` na ferramenta. Guarda nova no
    servidor com controle negativo: nome só de espaço vira `null`
    (`test_medicoes.py`, 2 testes novos — 64 no total, todos verdes).
- **Rodada anterior (quinta):** Modal de Lugar no
  lugar dos `prompt()`/`confirm()`, e as 10 melhorias de interface pedidas
  (atalhos + ajuda, lista lateral, barra inferior, indicador de salvamento,
  seções que abrem/fecham, símbolo por tipo, tecla da costa, teclas de
  opacidade, confirmação só onde não há desfazer, tema escuro). **Nada
  commitado nesta rodada** (pedido explícito). **3 ressalvas registradas** em
  `ESPEC-ferramenta.md` ("Ressalvas registradas") em vez de forçar — item 4 do
  pedido. Dívida de processo dos commits da rodada anterior registrada em
  "Dívida técnica registrada", e a regra nova ("ordem dos commits segue a
  dependência; se a ordem pedida conflitar, avisar ANTES") em "Regras
  invioláveis".
- **O que o usuário testou e aprovou das rodadas anteriores: EM ABERTO.** Os
  relatos vieram em branco ("[escreva o que funcionou e o que não]") em três
  rodadas. **Nada foi aprovado explicitamente**, então nada das rodadas de
  interface (quarta, quinta e sexta) está commitado.
  - **Correção registrada em 2026-09-23 (sexta rodada)**: a versão anterior
    deste bloco concluía, a partir do `dados/.operacoes/log.jsonl`, que o
    usuário "tinha exercitado o reset e o ciclo editar/apagar". Isso era
    inferência sobre rastro de uso: o log mostra que as OPERAÇÕES aconteceram,
    não que ele as tenha feito, testado ou aprovado. A conclusão saiu daqui e
    virou regra em "Regras invioláveis".
  - O que continua sendo FATO sobre o estado dos arquivos (sem conclusão sobre
    quem fez nem sobre aprovação): `dados/lugares.geojson` está vazio;
    `chatgpt-2` está invisível e com os limites do mundo, e o
    `bounds_automatico` dela preserva os limites do alinhamento automático.
- **Rodada anterior (quarta), para referência:** **O portão de
  commit foi aprovado, corrigido e ATIVADO** (`scripts/hooks/pre-commit` já é
  a versão isolada do índice); **5 commits do mapa feitos** (etapa 2 com
  correções, B1, B2, B3, recuperação do ESPEC-dados — sem push); e os **4
  ajustes de UI pedidos foram feitos, mas NÃO commitados** (pedido explícito:
  servidor no ar pra você testar antes). Ver detalhe completo abaixo.
- **Hook de `pre-commit`: corrigido, testado com controle negativo de
  segurança, e ATIVO.** Achado ao testar a versão anterior: `rm -rf` na pasta
  de validação, que contém um JUNCTION pro `node_modules` real, arriscava
  descer no link e apagar o `node_modules` de verdade. Corrigido: a limpeza
  primeiro remove só o link (`[System.IO.Directory]::Delete(caminho, $false)`
  — `Remove-Item` do PowerShell lança exceção nesta máquina, achado testando),
  confere que sumiu, e só então apaga o resto; se a remoção do link falhar, a
  pasta fica intacta (nunca `rm -rf` às cegas). **Contagem de arquivos do
  `node_modules` real, idêntica nos três cenários testados**: validação que
  passa (23.278 antes/depois), que falha (23.278/23.278), e interrompida com
  `kill -9` no meio — o pior caso, trap nunca roda — (23.278/23.278, só uma
  pasta temporária órfã sobrou, sem nenhum dano, limpa à mão). Ativado
  (`scripts/hooks/pre-commit.proposto` → `pre-commit`) e commitado sozinho
  (`1925029`), com uma nota curta no `CLAUDE.md` da raiz explicando a mudança
  para as outras frentes (`76d6afc`) — autorizado pelo usuário mexer nesses
  dois arquivos fora do mapa, só para isto.
- **5 commits do mapa, sem push** (`git show --stat` de cada um mostrado ao
  usuário na resposta desta rodada):
  1. `281186e` — B1 (infraestrutura de gravação e desfazer/refazer).
  2. `57083af` — B2 (Ferramenta de Lugar, esquema de importância restaurado).
  3. `0716791` — B3 (régua e grade de lat/lon).
  4. `939f07d` — etapa 2 com correções (Ocean Deep, Rótulos, alinhamento
     automático, zoom fracionário, persistência de camadas) — **inclui
     `main.py`/`app.js`/`index.html`/`estilo.css` inteiros**, mesmo tendo
     endpoints/wiring de B1/B2/B3 também: são arquivos compartilhados, e
     `git commit -- pathspec` não separa por hunk sem tocar o índice
     compartilhado (regra do CLAUDE.md) — registrado na mensagem do commit.
  5. `30b0164` — recuperação de `ESPEC-dados.md` + `historico/ESPEC-dados-
     revisao2.md` + criação de `dados/medicoes.json`.
  - **Ordem escolhida por dependência, não a ordem literal do pedido** (que
    era etapa2→B1→B2→B3→recuperação): B1/B2/B3 vieram primeiro porque o
    commit 4 (`main.py` etc.) IMPORTA os módulos deles (`lugares.py`,
    `operacoes.py`) — na ordem pedida, o commit da etapa 2 teria uma árvore
    com import quebrado. Registrado aqui por transparência.
- **4 ajustes de UI (2026-09-23, quarta rodada) — feitos, NÃO commitados**:
  1. **Zoom por lista de níveis**: `NIVEIS_ZOOM_PCT` (5% a 800%, 33 degraus)
     substitui o passo fixo de ~25%; botões e roda do mouse vão pro nível mais
     próximo NA DIREÇÃO do clique/rolagem (`scrollWheelZoom` nativo desligado,
     tratado à mão com `setZoomAround` ancorado no cursor); campo de
     porcentagem continua aceitando qualquer valor digitado.
  2. **ChatGPT — alinhamento manual por 2 pontos REMOVIDO da UI**; troca por
     "reset" (encaixa nos limites do mundo) e "automático" (volta pra
     `bounds_automatico`, campo próprio que `scripts/alinhar_chatgpt_auto.py`
     grava e NUNCA sobrescreve num ajuste manual posterior — as 4 imagens já
     têm esse campo, retropreenchido a partir do `bounds` atual). Toda mudança
     de posição (numérica, reset, automático) agora passa pelo desfazer:
     `operacoes.py` foi generalizado (`chave_lista`, "features" ou "camadas")
     pra também gravar patches de `dados/camadas_referencia.json`, não só
     GeoJSON.
  3. **Régua reescrita**: vários pontos por medição (trecho a trecho + total);
     rótulo de distância escrito sobre a linha, ângulo calculado uma vez em
     espaço de tela (invariante a pan/zoom nesta CRS) e somado 180° se cairia
     de cabeça pra baixo; clique na linha apaga (com confirmação); botão
     "limpar" apaga todas; Esc cancela a medição em andamento; tempo de viagem
     de referência (a pé/caravana/cavalo/barco) junto do total; botão "salvar"
     grava em `dados/medicoes.json` via `POST /api/medicoes`
     (`backend/medicoes.py`, novo, `"reproduzivel": true`, todos os pontos).
  4. **Cursor em cruz** (`.cursor-cruz` no container do Leaflet) enquanto
     Lugar ou a régua esperam um clique de ponto.
  - **Testado**: 62 testes pytest (18 novos: `test_referencias.py` — 10,
    incluindo bounds_automatico nunca sobrescrito por ajuste manual, tile
    recusa mudar posição; `test_medicoes.py` — 8, incluindo menos de 2 pontos,
    ponto sem lat/lon, contagem de trechos errada, distância não positiva).
    Testado também por API real (`curl`): reset/automático/desfazer em
    `chatgpt-1`, medição inválida e válida — tudo revertido depois, sem sobra
    nos dados reais.
- **Interface, quinta rodada (2026-09-23) — feita, NÃO commitada**:
  - **Modal de Lugar** (`static/js/lugares.js` reescrito + `#modal-lugar` no
    HTML): nome, id, tipo, importância, capital, lat e lon, todos editáveis;
    `Enter` salva, `Esc` cancela, foco no nome ao abrir, "salvar e criar
    outro"; o mesmo modal edita, com "apagar" dentro. Validação sempre no
    modal, nunca `alert` — inclusive a que só o servidor sabe (id repetido,
    ponto no mar), que volta pela resposta e aparece no mesmo campo de erro.
  - **`static/js/interface.js` (novo)**: atalhos (`L`, `R`, `Esc`, `Ctrl+Z/Y`,
    espaço segurado pra arrastar, `C` segurado pra ver só a costa, `[`/`]`
    opacidade da camada ativa, `+`/`-` zoom, `?` ajuda) + tela de ajuda + barra
    inferior (coordenada, zoom, sob o cursor, salvamento) + seções do painel
    que abrem/fecham com o estado em `localStorage` + indicador de salvamento
    ("✓ salvo" some sozinho; "✘ NÃO SALVOU" fica).
  - **Lista lateral de lugares** com busca e destaque recíproco com o mapa;
    **símbolo por tipo** (◉ cidade, ● vila, ▲ fortaleza, ⚓ porto, ✖ ruína,
    ★ marco) e **tamanho por importância**; **tema escuro** sem tocar nas cores
    do mapa (nenhum filtro sobre `#mapa`); **apagar lugar não pergunta mais**
    (o desfazer cobre), confirmação ficou só em "limpar todas as medições".
  - **3 ressalvas registradas em vez de forçar** (item 4 do pedido), detalhe em
    `ESPEC-ferramenta.md`: (1) "sob o cursor" mostra o LUGAR, não terra/mar —
    terra/mar exigiria consultar a máscara de 10240px a cada `mousemove`; (2) a
    tecla `C` depende da ordem das camadas no DOM; (3) a régua ainda usa
    `prompt()` pro nome da medição (o pedido do modal era só da Lugar).
  - **Conferência**: 62 testes pytest verdes (nenhum caminho novo de gravação
    no backend nesta rodada — o modal usa os mesmos endpoints já cobertos com
    controle negativo em `test_lugares.py`); `node --check` em todos os JS; e
    uma checagem de que todo `getElementById` dos JS existe no HTML novo (o
    risco real de uma reestruturação de HTML desse tamanho).
- **Pendente:**
  - **Usuário testar no navegador** os ajustes da quarta rodada (zoom por
    nível, reset/automático, régua nova, cursor em cruz) E os desta quinta
    (modal, atalhos, lista, barra inferior, tema escuro) — nada disso foi
    aprovado ainda, e nada foi commitado.
  - **B4 (Área/Geoman)** — não iniciado (Leaflet-Geoman free ainda não
    baixado).
  - Confirmar a suposição de que a atração automática de 5km vale também pro
    início de um braço de delta contra o rio-mãe.
  - Gerar o cache de identidade de ilha: processamento pesado, ainda não
    rodado — é o que destrava reconstruir "The Neck ↔ Calin" em
    `dados/medicoes.json`.
  - Confirmar na prática, na etapa 5, se o Leaflet-Geoman free cobre
    cortar/rotacionar/dividir/escalar/snap (plugin nem foi instalado ainda).
  - Nomear as massas de terra sem nome; decidir pertencimento das 9 ilhas `ilha-*`.
- **Servidor: NO AR**, reiniciado nesta rodada (o HTML foi reestruturado e o
  `interface.js` é arquivo novo). `http://127.0.0.1:8420/`. Para subir de novo,
  se cair:
  ```
  cd lore/mapas/ferramentas
  .venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8420
  ```
- **64 testes pytest, todos verdes** (`cd ferramentas &&
  .venv/Scripts/python.exe -m pytest`).
- **Instalação e código da etapa 1** — sem mudança desde a última atualização
  (commitados): `.venv` próprio, Leaflet 1.9.4 baixado pronto (sem npm/CDN),
  Geoman e `leaflet-minimap` de fora, minimapa próprio, CRS verificada contra o
  código-fonte do Leaflet, 3.184 tiles de costa/mar gerados (10,4s, pico 298 MB).
  Detalhe completo em `ESPEC-ferramenta.md`.
- **Commit da etapa 1** (`96e41882`, sem push): `.gitignore` (mais a regra nova de
  `__pycache__/`), `CARTOGRAFO.md`, `ESPEC-dados.md`, `ESPEC-ferramenta.md`,
  `dados/regioes.json`, `dados/lugares.geojson` (criado) e `dados/lugares.json`
  (removido), `dados/massas.geojson`, `dados/coordenadas.json`, e todo
  `lore/mapas/ferramentas/` (sem `.venv/` nem `render/tiles/`, os dois fora do git).
- **Commit da etapa 2, primeira versão** (`f8565f8`, sem push): `CARTOGRAFO.md`,
  `ESPEC-ferramenta.md`, `dados/camadas_referencia.json` (criado),
  `ferramentas/backend/main.py`, `ferramentas/backend/referencias.py` (criado),
  `ferramentas/scripts/extrair_ocean_deep.py` (criado), `ferramentas/static/css/estilo.css`,
  `ferramentas/static/js/app.js`, `ferramentas/static/js/camadas-referencia.js`
  (criado), `ferramentas/templates/index.html`. Nada de `render/tiles/` nem
  `.venv/`.
- **Próximo passo:** o usuário abrir `http://127.0.0.1:8420/` e testar as TRÊS
  rodadas de interface sem aprovação (quarta: zoom por nível,
  reset/automático, régua com vários pontos, cursor em cruz; quinta: modal de
  Lugar, atalhos + `?`, lista lateral, barra inferior, tema escuro; sexta:
  terra/mar sob o cursor e o modal da medição) — só depois disso commitar, e
  aí em commits separados, um por rodada.

## Objetivo e estilo

Mapa de fantasia medieval clássico, estilo Faerûn (Forgotten Realms). Por enquanto só
geografia e cidades; fronteiras de reino podem vir no futuro, e o formato de dados
precisa aceitar isso sem refazer nada. Tudo que o usuário marcar recebe um
identificador; nome é opcional e entra depois.

## Regras invioláveis

- A costa de terra e mar é **definitiva**. Nenhuma etapa altera, cria ou apaga terra.
- Originais nunca são modificados ou sobrescritos. `fonte/Mapa.psd` só é aberto para
  leitura por automação COM e fechado sem salvar.
- Nada é instalado sem ok explícito do usuário (pacote Python, Node, etc.).
- Nenhum commit sem ok do usuário. Arte pesada nunca vai para o git.
- Antes de processamento pesado — o PSD inteiro, qualquer imagem de 10240px ou mais,
  ou varredura sobre a máscara inteira (preenchimento por inundação, contagem de
  componentes, etc.) — avisar para fechar navegadores e outras sessões do Claude
  (máquina com 16 GB de RAM) e esperar confirmação antes de rodar. O computador já
  travou uma vez por isso (rodada de 2026-09-21).
- Nada de inventar API: o que não estiver documentado ou testado, dizer isso
  explicitamente em vez de supor.
- **Toda validação precisa de um controle negativo**: um caso que OBRIGATORIAMENTE
  falha (por exemplo, um ponto conhecido no meio do mar, testado contra "cai em
  terra"). Validação que nunca reprova nada é considerada quebrada, não aprovada —
  mesmo que a conclusão pareça certa. Motivo: em 2026-09-21 a validação dos 17 pontos
  de `massas.geojson` lia um canal alfa sintético (criado por um `.convert("RGBA")`
  numa máscara que não tinha alfa de verdade, sempre 255) e aprovava **qualquer**
  ponto, terra ou mar — a conclusão até bateu por sorte, mas o teste não testava
  nada. Registrado por pedido explícito do usuário depois desse achado.
- **Reescrita de ESPEC nunca apaga decisão registrada sem o usuário ter decidido
  isso.** Motivo: em 2026-09-23 o usuário pediu para restaurar o esquema de
  `importancia` (`"pequena"/"media"/"grande"`) de `ESPEC-dados.md`, supondo que
  uma reescrita tinha apagado — a investigação (`git log -p` em todo o histórico
  do arquivo) mostrou que na verdade a decisão nunca chegou a ser escrita em
  nenhum commit (as duas revisões existentes são idênticas nessa seção), não que
  foi apagada. A regra fica de qualquer forma: se uma reescrita de ESPEC (não só
  a de dados) precisar remover ou substituir uma decisão já registrada, isso exige
  o usuário decidir explicitamente, não uma inferência da IA de que "a versão
  nova substitui a antiga".
- **Toda distância real registrada neste documento guarda os pontos de origem e
  destino (lat/lon) em `dados/medicoes.json`.** Regra criada em 2026-09-23 depois
  de descobrir que a medição "The Neck ↔ Calin" (e, na mesma investigação, as duas
  extensões de Waning) tinham o número final registrado mas os pontos usados para
  chegar nele, não — impossível de reproduzir ou conferir depois. Uma medição sem
  pontos guardados entra em `dados/medicoes.json` como `"reproduzivel": false`
  com o motivo, nunca fica só como número solto no CARTOGRAFO.
- **Nunca inferir o que o usuário fez, testou ou aprovou a partir de rastro de
  uso** — log de operações, arquivo de dados, histórico, horário de gravação,
  nada disso. Esses rastros dizem no máximo que uma AÇÃO ACONTECEU, nunca quem
  a fez, com que intenção, nem que o resultado foi aprovado. **Se o usuário não
  disse, fica em aberto** e é escrito como em aberto. Regra criada em
  2026-09-23 (sexta rodada) depois de eu concluir, a partir do
  `dados/.operacoes/log.jsonl`, que ele "tinha exercitado o reset e o ciclo
  editar/apagar" — o log mostrava as operações, e eu transformei isso em
  conclusão sobre o teste dele, que ele não tinha relatado.
- **A ordem dos commits segue a DEPENDÊNCIA: base primeiro, quem usa depois.**
  Regra criada em 2026-09-23 (quinta rodada) a partir de uma dívida real, ver
  "Dívida técnica registrada" abaixo. **Se a ordem que o usuário pedir conflitar
  com a dependência, avisar ANTES de commitar**, não resolver sozinho — foi
  exatamente o que faltou na rodada que criou a dívida (eu reordenei por conta
  própria e só avisei depois).

## Estrutura de pastas (`lore/mapas/`)

| Pasta | Conteúdo | No git? |
|---|---|---|
| `fonte/` | `Mapa.psd`, os dois SVGs de traçado da costa, `Mapa Teste.jpg` (sem rótulo, 10240px), `Mapa Teste1.jpg` (mesma imagem rotulada, 10240px) — todos intocáveis | não |
| `referencias/` | as 4 imagens do ChatGPT, `teste.png`, `teste1.png` | não |
| `historico/` | os dois `PROMPT-*.md` da abordagem anterior (IA pintando o mapa inteiro), mantidos como registro | sim |
| `mascaras/` | máscaras de controle, incluindo `costa_10240.png` (a costa oficial) | sim |
| `dados/` | JSON/GeoJSON de lugares, rios, estradas, regiões, massas de terra, coordenadas — esquema completo em `ESPEC-dados.md` | sim |
| `simbolos/` | biblioteca de símbolos gerada por IA | não |
| `render/` | saídas do gerador, incluindo `render/analise/` (prévias e conferências) | não |
| `photoshop/` | PSD de montagem final (não é o `Mapa.psd` original) | não |
| `ferramentas/` | código da ferramenta de pintura e do gerador (`backend/`, `static/`, `templates/`, `scripts/`, `requirements.txt`) | sim, exceto `.venv/` (ambiente Python local, no `.gitignore`) |
| raiz de `mapas/` | `Uldun_parte-jogavel.jpg` e `Uldun_parte-jogavel_rotulado.jpg` (cópias reduzidas, 2560px, já publicadas no site) | sim |

## Sistema de coordenadas

Definição completa, com fórmulas, em `dados/coordenadas.json`. Resumo:

- Planeta esférico, raio 1,25× a Terra (7.963,75 km). Circunferência 50.037,7 km.
  Distância polo a polo (meridiano) 25.018,9 km.
- Projeção equirretangular: 1 pixel vale os mesmos graus em qualquer latitude ou
  longitude (não corrigido por cos(latitude)).
- Resolução de referência: 10240px. 1,25 km/px ao longo dos meridianos. 111,2 px por
  grau, 139,0 km por grau.
- Equador fixado no pixel de terra mais ao sul de Mére: `y = 7650` (medido em
  `mascaras/costa_10240.png`, limite de 50% de alfa sobre a camada Land do PSD).
- Meridiano de referência (longitude 0°) no centro horizontal da tela: `x = 5120`.
- Limites da tela: latitude do topo ≈ 68,79°N, da base ≈ -23,29°S (23,29°S).
  Longitude da borda esquerda ≈ -46,04° (46,04°O), da direita ≈ +46,04° (46,04°L).
- **Coordenadas de tudo (cidades, rios, regiões) são gravadas em latitude/longitude,
  nunca em pixel da tela**, para o mapa poder crescer além da tela sem renumerar nada.
  Desde 2026-09-21 (decisão 1, ver "Decisões tomadas › Técnica"), o formato de
  gravação é GeoJSON, com a ordem `[longitude, latitude]` do padrão GeoJSON — invertida
  em relação à ordem em que este documento costuma escrever "latitude/longitude" em
  prosa; ao converter entre os dois, atenção à ordem.
- Faixas de latitude aproximadas das regiões nomeadas (por caixa delimitadora, não
  pelo contorno exato): Mére 0,1°N–41,1°N · Syl 1,4°N–25,4°N · Calin 26,2°N–43,7°N ·
  The Neck 49,2°N–55,3°N · The White Wall até 68,8°N no topo da tela (terra segue além
  da borda). **Atenção**: essas faixas vêm da caixa delimitadora da MASSA DE TERRA
  inteira; a posição de cada rótulo em `dados/lugares.geojson` é a posição do TEXTO do
  nome no mapa, não o centro nem os limites da região — as duas coisas medem coisas
  diferentes e não devem ser confundidas.
- Extensão de Waning (arquipélago Calin+Syl+Mére): **norte-sul** (sul de Mére até norte
  de Calin) **6.074,9 km**; **leste-oeste** (oeste de Syl até leste de Mére)
  **7.124,8 km** — a maior das duas. Tempos de referência (linha reta, não rota real):

  | Extensão | Distância | A pé (25 km/dia) | Caravana (30 km/dia) | A cavalo (50 km/dia) |
  |---|---|---|---|---|
  | Norte-sul (sul de Mére ↔ norte de Calin) | 6.074,9 km | 243,0 dias | 202,5 dias | 121,5 dias |
  | Leste-oeste (oeste de Syl ↔ leste de Mére) | 7.124,8 km | 285,0 dias | 237,5 dias | 142,5 dias |

  Ver `render/analise/rotas_distancias.png` (norte-sul) e
  `render/analise/waning_leste_oeste.png` (leste-oeste). **Marcada como NÃO
  REPRODUZÍVEL em `dados/medicoes.json` (achado de 2026-09-23)**: os pontos
  (lat/lon) usados nesta medição não sobreviveram em nenhum arquivo versionado —
  só as imagens acima, sem coordenada legível. Mesmo achado da medição "The Neck
  ↔ Calin" abaixo, encontrado ao investigar aquela.

## Decisões tomadas

### Mundo
- O mundo se chama **Uldun** (nome provisório). A tela de 10240px é a parte jogável de
  um mundo maior, como Faerûn dentro de Toril; terra cortada nas bordas continua além
  da tela.
- Nomes existentes: **The White Wall**, **The Neck**, **Waning** (arquipélago de três
  ilhas: **Calin**, **Syl**, **Mére**).
- **The Neck fica isolada de Waning por mar aberto, sem ilhas no caminho.** Intencional.
  Medido e corrigido: a primeira medição (3.177 km) usava só a ilha principal do Neck;
  refeita usando a ilha do arquipélago do Neck mais próxima de Calin, dá
  **2.217,9 km** em linha reta / **2.772,3 km** de rota real (+25%) — ver
  `render/analise/rota_neck_calin_corrigida.png`. **Marcada como NÃO
  REPRODUZÍVEL em `dados/medicoes.json` até o cache de identidade de ilha
  existir** (pedido do usuário, 2026-09-23) — os pontos de referência de cada
  ilha em `massas.geojson` são o centro de identificação, não o ponto de
  aproximação mais próxima entre as duas costas que esta medição usou.

### Clima e bioma
As descrições de clima e bioma por região em `historico/PROMPT-mapa-completo-svg.md` e
`historico/PROMPT-relevo-mapa.md` continuam valendo como guia (a abordagem desses
prompts, IA pintando o mapa inteiro, está superada — ver seção Técnica). Resumo:

- **The White Wall** (extremo norte): as montanhas mais altas do mundo, todas cobertas
  de gelo e neve. Terra gélida.
- **The Neck** (aglomerado de ilhas a noroeste): frio, porém habitável. Costas nevadas,
  tundra, coníferas esparsas. Menos gelo que o White Wall.
- **Calin** (lobo norte de Waning): temperado. Algumas montanhas, florestas e rios,
  porém menos que nas outras partes; mais ocupação (campos e estradas).
- **Syl** (braço oeste/sudoeste de Waning): clima mais quente e exuberante. Muitas
  florestas verdes densas, lagos e rios, planícies amplas. Poucas montanhas. A parte
  mais verdejante do mapa.
- **Mére** (leste/sudeste de Waning, a maior): dividida. Metade norte mais montanhosa,
  mais fria e menos habitada. Metade sul mais quente, com mais rios, vegetação densa e
  sinais de civilização.
- Demais massas sem nome: gradiente por latitude (mais frio e nevado ao norte, mais
  verde e temperado ao sul).
- **Clima adicional** (decidido nesta sessão): o extremo sul de Mére fica sobre o
  equador, com florestas equatoriais. O interior e o lado oeste do sul de Mére, entre
  15°N e 25°N, são a região de desertos e áreas áridas. Costas leste dos trópicos
  tendem a ser úmidas.
- Rios e lagos sempre em azul fino, contidos na terra, descendo das montanhas para o
  mar. Sombreamento de relevo com luz vindo do noroeste. Estilo pintado à mão, tipo
  atlas em pergaminho, nunca fotorrealista.

### Conteúdo e dados
- Rios e cidades são marcados pelo usuário. Geração automática (rios por acumulação de
  fluxo, cidades por pontuação) só entra como **sugestão opcional que o usuário aceita
  ou apaga**, nunca automática por padrão. Sem grade Voronoi (a fonte é máscara
  pintada, não uma malha gerada).
- Símbolos (montanhas, árvores, cidades etc.): biblioteca gerada por IA **em nuvem**,
  uma vez; o código espalha os símbolos nas regiões pintadas por Poisson-disc sampling.
  Nada de IA pintando o mapa inteiro. Geração local descartada (a GTX 1660 da máquina
  tem defeito conhecido de hardware em fp16 e só 6 GB de VRAM).
- Tempos de viagem são **referência**, não regra do sistema — o Centelha ainda não tem
  regra própria de km por dia.

### Técnica
- Resolução de trabalho 10240px; resolução final alvo **20480px** (0,625 km/px), em
  blocos se necessário.
- Ferramenta de pintura: servidor Python (FastAPI) + **Leaflet** no navegador
  (`L.CRS.Simple` com a transformação de `coordenadas.json`, não o CRS padrão baseado
  no raio da Terra real), com o plugin **Leaflet-Geoman free** (MIT) para
  desenhar/editar polígono. Decidido em 2026-09-21, substituindo a ideia anterior de
  canvas próprio ou Konva.js — nenhum impedimento concreto foi encontrado para usar
  Leaflet no lugar deles. Sem mesa digitalizadora — prioriza laço poligonal e
  preenchimento limitado pela costa. Especificação completa em `ESPEC-ferramenta.md`.
- Photoshop só para montagem final e retoques. O PSD de montagem é criado pelo próprio
  usuário, uma vez, com um passo a passo escrito pela IA, usando objetos inteligentes
  vinculados. **Nada de API não documentada** — a automação de smart object vinculado
  não tem API oficial da Adobe (achado da sessão anterior), então essa etapa é manual.
- **Todo dado de posição (não só área pintada) é GeoJSON, `[longitude, latitude]`**
  (decisão 1, 2026-09-21): lugares em `Point`, rios/estradas em `LineString`, regiões
  em `Polygon`/`MultiPolygon` (ou sem geometria própria, quando definida por massas),
  áreas pintadas em `Polygon` **ou `MultiPolygon`** (correção 4, 2026-09-21, terceira
  rodada — um valor pode cobrir pedaços de terra desconexos numa feature só). Esquema
  completo em `ESPEC-dados.md`.
- **`dados/regioes.json` criado** (decisão 1, 2026-09-21, terceira rodada): as 6
  regiões nomeadas, cada uma com `rotulo` (`Point`, posição do nome no mapa) — os 6
  registros `tipo: "regiao"` que existiam em `lugares.geojson` (herança da segunda
  rodada) foram movidos para lá. `lugares.geojson` fica vazio, dedicado só a
  assentamento de verdade (tipo fechado: cidade, vila, fortaleza, porto, ruína,
  marco).
- **Pertencimento de ilha a região mora só em `massas.geojson`** (campo `regiao` de
  cada massa; correção 7, 2026-09-21, terceira rodada) — `regioes.json` não lista mais
  suas massas, pra não ter a mesma informação em dois lugares que podem divergir. Os 9
  ids que eram `amb-*` (de "ambíguo", herdado do tempo do `status: "duvidosa"`) viraram
  `ilha-*`, mesmo número (correção 9). Formato de id de região padronizado: slug
  minúsculo com hífen (`mere`, `syl`, `calin`, `the-neck`, `white-wall`, `waning`),
  igual em `massas.geojson` e `regioes.json`.
- **Áreas pintadas (relevo, cobertura, lagos, regiões-sobre-água) são guardadas como
  vetor** — não como máscara raster de controle. **O polígono é gravado exatamente como
  desenhado** (decisão 5, 2026-09-21): o recorte pela costa oficial só acontece na hora
  de rasterizar (prévia ou final), nunca ao salvar — o dado pode ter um traço que
  avança sobre o mar, e isso é esperado, não é erro. **Área nova recorta a área antiga
  da MESMA camada ao salvar** (decisão 3, 2026-09-21; shapely `difference`) — relevo
  nunca corta cobertura, e vice-versa, porque são independentes. Operações de unir,
  subtrair e apagar área usam a biblioteca **shapely** (Python), instalada em
  2026-09-21 (versão 2.1.2, autorizado pelo usuário).
- Relevo e cobertura são **camadas separadas**. Relevo: planície, colina, montanha,
  alta montanha. Cobertura: floresta temperada, floresta tropical, floresta boreal,
  selva, campo, deserto, pântano, tundra, geleira. Todo pedaço de terra tem os dois ao
  mesmo tempo (um relevo e uma cobertura), nunca só um.
- Terra que o usuário não pintou recebe **cobertura automática por latitude**, seguindo
  o guia de clima da seção "Clima e bioma" acima; e **relevo automático `planície`**
  (decisão 4, 2026-09-21, novo — antes só cobertura tinha padrão). Qualquer pintura do
  usuário sobrescreve o valor automático naquele trecho, nas duas camadas.
- **Lagos internos** podem ser criados pelo usuário na ferramenta. É a única exceção à
  regra da costa: o contorno do lago pode ser editado livremente, a costa do mar
  continua intocável.
- O ruído que deixa a borda de uma área pintada com aparência natural (em vez de um
  polígono reto) usa **semente fixa por área** (guardada no dado da própria área), para
  a borda sair sempre idêntica em qualquer renderização, não mudar a cada rasterização.
- Identificador de ilha estável: massas de terra **não** são identificadas por número
  de componente conectado (esse número muda se o método de detecção mudar). Cada massa
  relevante recebe um **id curto permanente e um ponto de referência** (latitude e
  longitude); a ilha correspondente é achada consultando a máscara oficial nesse ponto
  em tempo de execução. Formato e dados em `dados/massas.geojson`. **Correção
  2026-09-21**: a consulta não roda mais por preenchimento por inundação a cada clique
  — um cache (mapa de rótulos de componente, ou contorno vetorial) é gerado **uma vez**
  a partir da máscara oficial inteira e fica salvo em `render/` (fora do git),
  regenerável a qualquer momento. Isso é processamento pesado (varre a máscara inteira)
  e cai na regra de aviso/confirmação da seção "Regras invioláveis"; ainda não foi
  gerado. Detalhe em `ESPEC-ferramenta.md`.
- Pertencimento de ilha a região é decidido pelo usuário na ferramenta.
  **Atribuição automática só quando a ilha estiver a menos de 100 km da ilha PRINCIPAL
  da região** (não da região inteira); todas as demais ficam `"sem_regiao"` até o
  usuário decidir (vocabulário de `status` fechado a `"atribuida"`/`"sem_regiao"` desde
  2026-09-21 — a palavra `"duvidosa"` foi removida por ser redundante com
  `"sem_regiao"`). Testado nesta sessão com a regra dos 100km sobre as 5 regiões
  nomeadas: **nenhuma massa de terra além das já nomeadas caiu dentro de 100km de uma
  ilha principal** — os arquipélagos são isolados por mar aberto na escala do mundo,
  então a atribuição automática praticamente não vai disparar sozinha; a maior parte da
  decisão de pertencimento vai ser manual mesmo.
- **Validação dos pontos de referência de `massas.geojson`** (2026-09-21): os 17 pontos
  caem em terra (leitura de pixel único contra `costa_10240.png`) e dentro da faixa de
  latitude da região nomeada que cada um declara. Não confirma conectividade de
  componente (depende do cache do item acima). Detalhe completo em `ESPEC-dados.md`.
- **`dados/coordenadas.json` reescrito em 2026-09-21 (terceira rodada)**: `px_por_grau`
  e `km_por_grau` passam a ser **derivados** de `raio_km` e `km_por_px_latitude`
  (único valor medido diretamente), gravados uma vez com precisão total em vez de
  repetidos arredondados em três lugares do arquivo; `limites_da_tela` também passa a
  ser derivado das mesmas fórmulas. As fórmulas citam os campos pelo nome
  (`referencia.y_equador_px`, `projecao.px_por_grau`) em vez de repetir o número.
- **Salvamento automático a cada operação concluída** (correção 5, 2026-09-21,
  terceira rodada): fechar um polígono, terminar um rio, criar um lugar, confirmar um
  apagamento — cada um já grava sozinho, sem botão "Salvar" manual. Desfazer/refazer
  **entre operações concluídas é código próprio** (registro de operações no servidor,
  `dados/.operacoes/`), não o plugin de desenho — **verificado nesta sessão**: o
  Leaflet-Geoman free só tem `removeLastVertex` (desfazer vértice dentro de uma forma
  ainda sendo desenhada), não desfazer entre formas já salvas. Gravação atômica
  (arquivo temporário + `os.replace`) e cópia das últimas 5 versões de cada arquivo em
  `dados/.historico/` continuam valendo, como decisão separada (rede contra "salvei
  errado por cima", não é o mesmo mecanismo do desfazer).
- **Ocean Deep também vira tiles** (correção 10, 2026-09-21, terceira rodada), extraída
  do `Mapa.psd` uma vez e convertida do mesmo jeito que a costa oficial — processamento
  pesado, mesmo aviso. As 4 imagens do ChatGPT continuam entrando inteiras (posição,
  escala e opacidade ajustáveis à mão), sem virar tile.
- **Camada do mar desenhada por cima da pintura na visualização ao vivo** (correção 11,
  2026-09-21, terceira rodada): um tile de água opaca (gerado junto com o tile da
  costa, mesma varredura) fica acima da camada vetorial de área pintada no navegador,
  cobrindo visualmente qualquer trecho de polígono que avance sobre o mar — dá a
  impressão de recorte pela costa sem rodar shapely a cada pan/zoom. O recorte de
  verdade continua só acontecendo na rasterização (decisão 5, mantida).
- **Instalação da etapa 1, decidida em 2026-09-21**: Python isolado num `.venv`
  próprio (não o Python global da máquina); Leaflet **baixado pronto, sem npm e sem
  CDN** (a ferramenta tem que funcionar offline); Leaflet-Geoman só entra na etapa 5;
  minimapa é **código próprio** (imagem fixa + retângulo clicável), não um plugin de
  terceiro.
- **Etapa 1 testada e aprovada pelo usuário em 2026-09-21.** Sem animação de
  zoom/pan (`zoomAnimation`/`fadeAnimation`/`markerZoomAnimation: false`) — sugestão
  da sessão, aprovada depois do teste: numa ferramenta de edição de precisão, zoom
  instantâneo é melhor que animado enquanto o usuário posiciona algo.

### Fases do projeto depois da ferramenta pronta

**Ferramenta pronta não é mapa pronto.** Depois das 12 etapas da ferramenta (ver
`ESPEC-ferramenta.md`), faltam três fases, sem especificação própria ainda:

1. **Biblioteca de símbolos**, gerada por IA em nuvem, uma vez.
2. **Renderizador no estilo Faerûn**: pega os dados vetoriais + a biblioteca de
   símbolos e pinta o mapa final (Poisson-disc sampling, sombreamento, rios finos).
3. **Montagem no Photoshop**, manual, passo a passo escrito pela IA (sem API
   automatizada de smart object vinculado — não existe API oficial documentada).

## Achados técnicos registrados (não são decisões, são fatos medidos)

- **`mascaras/costa_10240.png` é modo "L" (escala de cinza, 1 canal), não RGBA — não
  tem canal alfa de verdade.** Achado em 2026-09-21 (sessão de geração de tiles):
  255 = terra, 0 = mar, confirmado por amostragem (5000 pixels aleatórios, só esses
  dois valores) e por checagem pontual (pontos de terra conhecidos deram 255, dois
  pontos de oceano aberto deram 0). **Isto corrige uma leitura errada de sessão
  anterior**: a validação dos 17 pontos de `massas.geojson` (registrada como
  "correção 6" numa rodada passada do `ESPEC-dados.md`) tinha sido feita com
  `Image.open(...).convert("RGBA")`, e esse `.convert` cria um canal alfa **sintético,
  sempre 255**, em cima de uma imagem que não tinha alfa — a checagem "alfa ≥ 128 ⇒
  terra" dava sempre verdadeiro, para qualquer pixel, terra ou mar; não testava nada.
  **Refeita nesta sessão com o canal certo (valor de cinza, não alfa)**: a conclusão
  não mudou (os 17 pontos continuam todos em terra), mas o método da vez passada
  estava quebrado por sorte, não por acerto — registrado aqui porque é exatamente o
  tipo de "não investigado vira explicação errada" que este projeto tenta evitar.
  **Refeita de novo, com controle negativo** (pedido do usuário depois deste achado,
  ver a regra nova em "Regras invioláveis"): um ponto de oceano aberto conhecido
  (`px=(1000,5000)`, `lat=23.832`, `lon=-37.052`, longe de qualquer massa marcada)
  testado contra o mesmo código — devolveu `terra=False`, valor L = 0, como tem que
  devolver. Só depois desse controle passar é que os 17 pontos de `massas.geojson`
  foram checados de novo: os 17 continuam `terra=True`. Agora sim é uma validação de
  verdade, não uma que não reprova nada.
- A camada `Land` do `Mapa.psd` bate com o traçado vetorial da costa: 1,27% de
  divergência contra `fonte/Mapa Teste.jpg` limiarizado, concentrada numa faixa fina de
  antialiasing ao redor do contorno, não em manchas soltas em alto-mar (ver
  `render/analise/diff_costa_oficial_vs_jpg.png`).
- `Ocean Deep` é a camada de batimetria (escuro = fundo, claro = raso) — vai ser usada
  para o sombreamento do mar.
- `Paint Layer copy` e `Plano de Fundo`, dentro do `Mapa.psd`, são as camadas de
  geração da costa original (manchas pintadas sobre ruído e limiar) — ficam só como
  histórico, não entram no pipeline novo.
- `Mapa Teste1.jpg` não é uma variante do mapa: é `Mapa Teste.jpg` com os rótulos de
  nome desenhados por cima, mesma resolução (10240px).
- `Uldun_parte-jogavel.jpg`/`_rotulado.jpg` (2560px, na raiz de `mapas/`) são o mapa
  grande inteiro reduzido 4×, não um recorte de sub-região (99,52% de concordância
  pixel a pixel contra `Mapa Teste.jpg` reduzido, sem precisar deslocar).
- Os dois SVGs de traçado (`Mapa Teste.svg` e `Mapa-Teste.svg`) são o mesmo contorno
  (0,11% de diferença entre si); ambos vêm de `Mapa Teste.jpg`, não de `Mapa Teste1.jpg`.
- `fonte/Mapa Teste.jpg` **não é um raster simples em preto e branco**: ao recortar em
  resolução nativa (item 4 da verificação de 2026-09-21) apareceu como uma imagem já
  colorida (terra bege, mar azul-acinzentado com textura), no mesmo estilo dos
  `Uldun_parte-jogavel*.jpg`. A suposição anterior de que era um raster binário (base
  direta do traçado potrace) não tinha sido conferida visualmente — só numericamente
  (limiar de cinza), o que funcionou para medir a costa mas descrevia a imagem errado.
  Vale revisitar antes de usá-la como "máscara crua" em qualquer texto futuro.
- **Calin e Syl são massas de terra separadas, e Syl e Mére também.** Confirmado por
  varredura exaustiva (preenchimento por inundação de toda a máscara oficial de
  10240px, conectividade 4, a partir de um pixel de terra dentro de cada ilha): a
  região pintada a partir da semente de Calin nunca alcança a semente de Syl, nem a de
  Syl alcança a de Mére — são três componentes conectados distintos em toda a extensão
  do mapa, não só no ponto de maior aproximação medido antes. Isto substitui a suspeita
  de istmo registrada em rodadas anteriores (baseada numa análise em 2048px, já
  corrigida) e a verificação por amostragem da rodada passada (que só olhava o ponto
  mais próximo, não o contorno inteiro). Ver `render/analise/istmo_costa_oficial.png` e
  `istmo_mapa_teste_jpg.png` para o recorte nativo do ponto de maior aproximação entre
  Calin e Syl.

## Dívida técnica registrada

- **Os commits `281186e` (B1), `57083af` (B2) e `0716791` (B3) não compilam
  sozinhos** (2026-09-23, registrado a pedido do usuário; **não vai ser
  refeito**, o histórico fica como está). Cada um deles introduz módulos
  (`historico.py`/`operacoes.py`, `lugares.py`, `regua.js`) que só passam a ser
  IMPORTADOS/incluídos no commit seguinte (`939f07d`, a etapa 2, que carrega
  `main.py`, `app.js`, `index.html`, `estilo.css` inteiros) — então, olhando
  cada um isolado, `main.py` daquele ponto do histórico ainda não conhece os
  módulos novos, e os módulos novos ainda não são chamados por ninguém. Não
  quebra nada na prática (nenhum deles deixa um import pendurado; o que falta é
  a ligação, não a base), mas um `git checkout` num desses commits não dá uma
  ferramenta funcional com aquelas etapas ligadas.
  - **Por que passou pelo portão**: o `pre-commit` valida o ÍNDICE com HEAD por
    baixo (o estado do repositório DEPOIS daquele commit), e nesse estado nada
    está quebrado — o portão não tem como ver "este commit isolado não faz
    sentido sozinho", porque não é isso que ele mede.
  - **Causa**: eu reordenei os commits por dependência (B1→B2→B3→etapa 2) em vez
    da ordem que o usuário pediu (etapa 2→B1→B2→B3), e a reordenação resolveu
    METADE do problema (evitou import quebrado) sem resolver a outra metade
    (`main.py`/`app.js` continuam entrando todos de uma vez no fim, porque
    `git commit -- pathspec` é arquivo inteiro). A regra nova em "Regras
    invioláveis" (ordem por dependência, e avisar ANTES se a ordem pedida
    conflitar) vem daqui.

## Decisões em aberto

- Nome definitivo do mundo (hoje "Uldun" é provisório).
- Nomes das massas de terra sem rótulo (a maioria do mapa).
- Esquema completo de dados além de `lugares.geojson` (cidades, rios, estradas, marcos,
  fronteiras futuras) — **recomendação da IA pendente de aprovação**, não decidido
  ainda. Proposta revisada (terceira rodada) completa em `ESPEC-dados.md`.
- Resto do mapa sem nome (grande aglomerado a sudoeste, terras a leste, ilhas nas
  bordas) — nomear conforme a campanha pedir.
- Se `Leaflet-Geoman free` cobre cortar/rotacionar/dividir/escalar/snap, ou só a versão
  Pro (a documentação pública não deixou isso claro) — não bloqueia a decisão de usar
  o Geoman (a arquitetura já não depende desses botões), mas vale confirmar na prática
  na etapa 5 da ferramenta (renumerada na terceira rodada).
- **Suposição a confirmar (terceira rodada)**: a atração automática de 5km ao desenhar
  uma estrada perto de um lugar (correção 3 do `ESPEC-dados.md`) foi estendida para o
  início de um braço de delta contra o traçado do rio-mãe, pela mesma distância — o
  pedido original só deu o número para o caso do lugar. Confirmar ou corrigir quando a
  etapa 8 (rio) da ferramenta for construída.
- **Lista de instalação da etapa 1** (`ESPEC-ferramenta.md`, seção final): proposta,
  não aprovada ainda — é o bloqueio imediato para o código começar.
