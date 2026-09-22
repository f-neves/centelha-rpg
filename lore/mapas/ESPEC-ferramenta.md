# Especificação da ferramenta de pintura do mapa de Uldun

Revisão de 2026-09-21 (terceira rodada), incorporando as correções 3 (comportamento na
ferramenta), 5, 6, 10 e 11 pedidas pelo usuário sobre a segunda revisão, e a liberação
da etapa 1 (ver seção final). Continua sendo especificação para revisão até a etapa 1
ser explicitamente aprovada — a partir da etapa 1, sim, vira código.

## Arquitetura

- **Frontend: Leaflet**, com `L.CRS.Simple` e a transformação de `coordenadas.json`
  (sem mudança da segunda rodada).
- **Plugin de desenho/edição: Leaflet-Geoman free** (MIT). Ver avaliação abaixo,
  **atualizada nesta sessão** com a checagem específica de desfazer/refazer pedida na
  correção 5.
- **Backend: Python (FastAPI)**, servindo a página e uma API que recebe a geometria,
  valida, grava e devolve a prévia rasterizada.
- **Pirâmides de tiles, geradas uma vez cada, com aviso antes**:
  1. **Costa e mar** (`mascaras/costa_10240.png`, correção 11) — etapa 1, **gerada
     nesta sessão** (`scripts/gerar_tiles.py --confirmo`; ver seção final para os
     números). Uma leitura só da máscara gera as duas pirâmides (`costa`: terra
     opaca, mar transparente; `mar`: o inverso).
  2. **Ocean Deep** (correção 10, nova): a camada de batimetria do `Mapa.psd` é
     extraída **uma vez** e convertida em tiles do mesmo jeito que a costa. Isto é
     processamento pesado igual ao da costa (lê o PSD inteiro pra extrair a camada,
     depois varre a imagem inteira pra gerar os blocos) — **não entra na etapa 1**, é
     parte da etapa 2 (camadas de referência, ver "Divisão em etapas" abaixo), com o
     mesmo aviso de fechar navegadores/sessões antes de rodar.
  As 4 imagens do ChatGPT **não** viram tiles — são só 4 arquivos, entram inteiras como
  sobreposição (posição/escala/opacidade ajustáveis à mão), sem processamento pesado.
- **Vetor sempre no navegador, raster só sob pedido**: área pintada, rio, lugar e
  estrada são uma camada `L.geoJSON` desenhada pelo Leaflet a partir dos dados —
  colorida na hora, sem round-trip ao servidor a cada pan/zoom.
- **Camada do mar por cima da pintura, para simular recorte sem recortar** (correção
  11, nova — ver seção "Travamento da costa" abaixo para o detalhe completo).

## Avaliação do plugin de desenho

**Recomendação mantida: Leaflet-Geoman free (`@geoman-io/leaflet-geoman-free`, MIT).**

- Licença MIT confirmada, mantido ativamente (2.20.0, última publicação um mês antes
  desta sessão) — sem mudança da segunda rodada.
- **Correção 5, verificado nesta sessão**: o **free NÃO tem desfazer/refazer no
  sentido de "voltar uma operação já concluída"**. O que existe documentado no free é
  `removeLastVertex` — desfazer o último vértice **enquanto o polígono ainda está sendo
  desenhado**, antes de fechar a forma. Depois que uma forma é salva/fechada, um
  desfazer histórico completo (`pm:undoremove` e funcionalidade parecida) só aparece
  associado à documentação da versão Pro nas páginas consultadas. **Conclusão: desfazer
  entre operações concluídas é código nosso** (registro de operações no servidor — ver
  seção "Gravação e histórico de operações" abaixo), exatamente como o usuário
  antecipou. O `removeLastVertex` do free continua útil durante o desenho de uma forma
  só, e não é substituído por nada — os dois mecanismos convivem, um no navegador
  (dentro de uma forma sendo desenhada) e um no servidor (entre formas já salvas).
- Cortar/rotacionar/dividir/escalar/snap do plugin: sem confirmação de free-vs-Pro
  ainda (não bloqueia, ver segunda rodada) — a confirmar na prática na etapa 5 (ver
  renumeração abaixo).

## Vetor, não grade de controle

Sem mudança: área pintada é polígono (ou multipolígono, `ESPEC-dados.md` correção 4)
em lat/lon, guardado como veio da mão do usuário.

## Camadas de pintura

Sem mudança de vocabulário desde a segunda rodada (relevo/cobertura/lago, relevo padrão
planície, cobertura padrão por latitude, recorte de área nova contra área antiga da
mesma camada ao salvar). `Polygon`/`MultiPolygon` — ver `ESPEC-dados.md`.

## Ferramentas

- **Área**: Leaflet-Geoman, modo polígono; recorte pela costa só na hora de
  rasterizar; recorte contra área antiga da mesma camada via shapely, no servidor, ao
  salvar.
- **Linha**: rio (valida destino, delta, segmento-a-segmento e tolerância de foz de
  2km — `ESPEC-dados.md` correção 2) e estrada/trilha.
  - **Atração automática ao desenhar** (correção 3, nova): um ponto a menos de 5 km de
    um lugar já marcado gruda na coordenada exata dele (estrada); o início de um braço
    de delta a menos de 5 km do traçado do rio-mãe gruda no ponto mais próximo desse
    traçado (rio). Depois da atração, a validação ao salvar é exata, não por
    tolerância — ver `ESPEC-dados.md` correção 3 para o detalhe e a suposição em aberto
    sobre os 5 km valerem também pro delta.
  - **Se um lugar for movido depois**, a estrada correspondente aparece marcada como
    "desalinhada" (cor própria no painel), sem se mover sozinha.
- **Ponto**: lugar, com tipo fechado + capital + importância.
- **Desfazer/refazer**: dentro de uma forma sendo desenhada, o `removeLastVertex` do
  Geoman free (navegador). Entre operações já concluídas, o registro de operações do
  servidor (ver abaixo) — não é mais "histórico do Geoman" como a segunda rodada
  supôs; essa suposição não se confirmou (ver avaliação do plugin, acima).

## Travamento da costa, e a camada do mar por cima (correção 11)

- Toda **rasterização** (prévia ou final) continua consultando sempre
  `costa_10240.png` nativa, recortando o polígono pixel a pixel — sem mudança.
- **Novo nesta rodada**: a **visualização ao vivo no navegador** (antes de qualquer
  rasterização) passa a ter uma segunda camada de tiles, gerada junto com a da costa
  (mesma varredura da máscara, nenhum processamento pesado extra) — um "tile do mar",
  onde cada pixel de água é pintado sólido na cor do mar e cada pixel de terra é
  transparente. Essa camada fica **acima** da camada vetorial de área pintada (`L.
  geoJSON`) e **abaixo** dos rios/estradas/lugares. Um polígono de área que avança
  sobre o mar (permitido pela decisão 5 da segunda rodada — o dado é gravado cru)
  continua existindo no dado, mas visualmente a parte que cai sobre água fica coberta
  pelo tile do mar, dando a impressão de recorte pela costa **sem rodar shapely nem
  gerar geometria nova a cada pan/zoom**. O recorte de verdade (o que vai pro arquivo
  rasterizado final) continua só acontecendo quando o usuário pede uma rasterização —
  esta camada é puramente visual, cosmética, pro usuário não estranhar o próprio
  desenho "vazando" pro mar enquanto trabalha.
- Esta camada de tiles do mar é gerada **junto** com a pirâmide de tiles da costa (etapa
  1, mesma máscara, mesma varredura, sem aviso adicional de processamento pesado além
  do já previsto pra costa) — são dois produtos (imagens coloridas diferentes) da mesma
  leitura da máscara, não duas varreduras.

## Identificação de ilha e pertencimento a região

Sem mudança de conteúdo desde a segunda rodada — cache de identidade gerado uma vez
(processamento pesado, aviso antes, ainda não gerado), painel de regiões com id
estável. **Atualização de nomenclatura**: os ids agora são `ilha-*` (não mais
`amb-*` — ver `ESPEC-dados.md` correção 9); o esboço da tela (abaixo) já foi corrigido
para mostrar `ilha-046` etc.

## O que acontece se o usuário apagar uma área com rio ou cidade dentro

Sem mudança: rio e cidade sobrevivem, a ferramenta avisa antes de confirmar.

## Gravação e histórico de operações (correção 5, reescrita)

- **Salvamento automático a cada operação concluída**: fechar um polígono, terminar um
  rio (clique duplo ou botão "concluir"), criar um lugar, confirmar o apagamento de uma
  área — cada uma dessas ações já dispara a gravação no servidor sozinha, sem precisar
  de um botão "Salvar" à parte. O botão "Salvar" do esboço da segunda rodada deixa de
  existir como ação manual; o painel passa a mostrar só o estado ("salvo há poucos
  segundos") — fechar a aba no meio do desenho de UMA forma ainda perde só aquela forma
  incompleta (o Geoman só entrega a geometria pronta quando a forma fecha), mas nunca
  perde uma operação já concluída.
- **Registro de operações no servidor**: cada gravação automática vira uma entrada
  numa lista (arquivo `dados/.operacoes/<sessao>.jsonl`, uma linha JSON por operação:
  tipo, arquivo afetado, estado antes, estado depois, timestamp). É a base do
  desfazer/refazer entre operações concluídas (ver "Ferramentas", acima): desfazer
  reaplica o "estado antes" da última entrada e grava normalmente (nova operação
  atômica, não uma edição escondida); refazer reaplica o "estado depois" da próxima.
  **Sobrevive a fechar a aba**: o registro mora no servidor, então reabrir a ferramenta
  mantém a pilha de desfazer/refazer de onde parou (limite prático a definir na etapa 1
  — por exemplo, as últimas 50 operações; não decidido ainda, fica pra quando o código
  for escrito).
- **Gravação atômica dos arquivos de dados** (arquivo temporário + `os.replace`) e
  **cópia das últimas 5 versões** de cada arquivo em `dados/.historico/`, sem mudança
  da segunda rodada — o registro de operações acima é sobre desfazer/refazer dentro da
  sessão de trabalho; o histórico de arquivo é a rede contra "gravei tudo errado",
  coisas diferentes que convivem.

## Segurança

Sem mudança: `uvicorn` só em `127.0.0.1`.

## Esboço visual da tela

Ver `render/analise/esboco_ferramenta_v2.png` — sem mudança de layout nesta rodada
(a ordem de etapas mudou, mas a tela final já mostrava "CAMADAS DE REFERENCIA" logo
depois de "NAVEGACAO", que é exatamente a ordem que a correção 6 pede para a
construção também seguir). Painel de regiões passa a referenciar `ilha-*`, não mais
`amb-*` (nomenclatura, correção 9 do ESPEC-dados) — mesmo esboço, rótulo diferente.

## Régua, grade e prévia

Sem mudança: régua por haversine, grade de lat/lon ligável, prévia rápida em baixa
resolução, alta resolução só sob pedido explícito com aviso.

## Camadas de referência com transparência (correção 10)

- **Ocean Deep**: extraída do `Mapa.psd` **uma vez** e convertida em tiles, do mesmo
  jeito que a costa (ver "Arquitetura", acima). Processamento pesado, aviso antes de
  rodar — acontece na etapa 2 (ver renumeração abaixo), não na etapa 1.
- **As 4 imagens do ChatGPT**: entram **inteiras** (não viram tile — são poucas e leves
  o bastante pra carregar de uma vez), como sobreposição com posição, escala e
  opacidade ajustáveis à mão (não batem com a costa oficial, por isso o ajuste manual).
- **Rótulos de `Mapa Teste1.jpg`**: sem mudança.
- Todas ligáveis/desligáveis, nunca editáveis.

## Fases do projeto depois da ferramenta pronta

Sem mudança: biblioteca de símbolos → renderizador estilo Faerûn → montagem no
Photoshop, nenhuma com especificação própria ainda.

## Divisão da construção em etapas pequenas, cada uma testável

**Renumerada nesta rodada** (correção 6): "Camadas de referência" sai da posição 9 e
vira a **etapa 2**, logo depois da navegação — é o que o usuário normalmente vai querer
ligado antes de começar a desenhar qualquer coisa por cima. O resto desloca, mesmo
conteúdo de cada etapa, sem outra mudança de ordem:

1. **Servidor + Leaflet com a costa oficial em tiles** (+ tile do mar, correção 11).
   Ao fim: o usuário abre a página, vê o contorno de Uldun com zoom/pan fluido,
   minimapa, leitura de lat/lon sob o cursor, seletor de camada ativa visível — ainda
   sem ferramenta de desenho.
2. **Camadas de referência** (Ocean Deep em tiles — processamento pesado, aviso antes
   — mais as 4 imagens do ChatGPT e os rótulos, com opacidade/posição/escala
   ajustáveis). Ao fim: o usuário liga/desliga cada uma e ajusta os parâmetros.
3. **Ferramenta de Lugar (ponto).** Ao fim: cria um lugar com tipo/capital/importância,
   salvo (autosave, correção 5) em `lugares.geojson`.
4. **Régua e grade de lat/lon.**
5. **Ferramenta de Área (relevo), sem costa travada ainda** — momento de confirmar na
   prática o que o Leaflet-Geoman free cobre.
6. **Travamento da área pela costa oficial na rasterização** + camada do mar por cima
   na visualização ao vivo (correção 11).
7. **Camada de Cobertura + cobertura automática por latitude + relevo automático
   planície.**
8. **Ferramenta de Rio**, com validação por segmento, tolerância de foz e delta
   (`ESPEC-dados.md` correção 2).
9. **Ferramenta de Estrada**, com atração automática (`ESPEC-dados.md` correção 3).
10. **Cache de identidade de ilha** (processamento pesado, aviso antes) **e painel de
    regiões**, com atribuição manual e a regra dos 100km.
11. **Ruído de borda com semente fixa + rasterização em alta resolução.**
12. **Lago.**

Cada etapa continua interrompível e retomável sem perder as anteriores. Todo
salvamento é automático desde a etapa 3 em diante (correção 5).

## Etapa 1 — liberada e em andamento

O usuário autorizou o início da etapa 1, com ajustes sobre a lista de instalação
proposta (ver abaixo). **Primeira parada (instalação) resolvida nesta sessão**; a
etapa avançou até a segunda parada obrigatória, que segue pendente.

### Instalação — decisão final (substitui a proposta da rodada anterior)

- **Python**: ambiente virtual próprio em `lore/mapas/ferramentas/.venv` (fora do
  git), **não** o Python global da máquina. Dentro dele: `fastapi==0.141.1`,
  `uvicorn==0.53.0` **sem o extra `[standard]`** (o usuário cortou esse extra — sem
  `uvloop`/`httptools`/`watchfiles`; o servidor roda no loop de I/O puro do Python,
  suficiente para uma ferramenta local de uso único), `shapely`, `Pillow`, `numpy`.
  Versões exatas (incluindo dependências transitivas) gravadas em
  `ferramentas/requirements.txt`, gerado com `pip freeze` logo após a instalação — é
  a fonte de verdade para recriar o ambiente em outra máquina. **O shapely já
  instalado no Python global (2.1.2, sessão anterior) não foi tocado** — o do `.venv`
  é uma cópia isolada, própria da ferramenta.
- **Leaflet 1.9.4**: **sem npm, sem CDN** — baixados os arquivos prontos do release
  oficial (`leaflet.js`, `leaflet.css`, `images/`, `LICENSE`) para
  `ferramentas/static/vendor/leaflet-1.9.4/`. Licença conferida no arquivo baixado:
  BSD-2-Clause. Esses arquivos **vão para o git** (são leves, ~417 KB, e a ferramenta
  precisa funcionar offline). Os arquivos `leaflet-src*.js` (versão não-minificada,
  só útil para depurar o próprio Leaflet) foram descartados — ficou só o pronto pra
  uso.
- **Leaflet-Geoman**: **não instalado agora** — fica para a etapa 5 (ferramenta de
  Área), quando a avaliação free/Pro puder ser confirmada na prática (ver seção
  "Avaliação do plugin de desenho").
- **Minimapa: sem `leaflet-minimap`** — implementado como código próprio
  (`static/js/minimapa.js`): uma imagem fixa de 320px do mundo inteiro (gerada a
  partir de `Uldun_parte-jogavel.jpg`, que já existia reduzido — **não** foi
  necessário reprocessar a máscara nativa de 10240px pra isso, processamento leve)
  mais um retângulo (`div` posicionado por CSS, recalculado a cada `move`/`zoom` do
  Leaflet) mostrando a área visível, e clique na imagem chama `map.panTo(...)`.
- `.venv` acrescentado ao `.gitignore` da raiz do repositório.

### Trabalho de etapa 1 feito nesta sessão

Estrutura criada em `lore/mapas/ferramentas/`:

```
ferramentas/
  requirements.txt
  backend/
    main.py            # app FastAPI: serve /static, /tiles e "/"
    coordenadas.py      # lê dados/coordenadas.json, deriva os parâmetros da CRS.Simple
  templates/
    index.html          # página única, layout do esboço (barra topo/painel/mapa/rodapé)
  static/
    vendor/leaflet-1.9.4/  # Leaflet baixado, ver acima
    css/estilo.css
    js/app.js            # monta o mapa Leaflet com a CRS própria de Uldun
    js/minimapa.js        # minimapa próprio
    img/minimapa.jpg      # miniatura gerada de Uldun_parte-jogavel.jpg
  scripts/
    gerar_tiles.py       # gerou as pirâmides de tiles nesta sessão (ver resultado abaixo)
```

- **CRS própria de Uldun, verificada contra o código-fonte do Leaflet 1.9.4** (não só
  suposta): `L.CRS.Simple.scale(zoom) = 2**zoom` e
  `Transformation.transform = scale*(a*x+b, c*y+d)` — conferido em
  `src/geo/crs/CRS.Simple.js` e `src/geometry/Transformation.js` do próprio
  repositório, na tag `v1.9.4`. `backend/coordenadas.py` deriva `a, b, c, d` de
  `dados/coordenadas.json` de forma que, no zoom mais alto (`MAX_ZOOM = 6`), o
  resultado bate exatamente com o pixel nativo de 10240px — nenhum número de projeção
  é digitado à mão no JS, só o que o servidor calcula e injeta na página.
  `MAX_ZOOM = 6` porque `2**6 * 256 = 16384 ≥ 10240` (o esquema de tiles de 256px que
  cobre a tela inteira com a menor pirâmide).
- Servidor testado nesta sessão (subiu, respondeu `200` em `/`, no `leaflet.js` e no
  `minimapa.jpg`).

### Correções feitas no script antes de rodar (pedidas pelo usuário)

Todas verificadas em código, não só prometidas:

1. **Máscara carregada em modo "L"** (escala de cinza, 1 byte/pixel), não `RGBA`.
   **Achado nesta sessão, ao conferir isso**: `costa_10240.png` é nativamente modo
   `L` — não tem canal alfa de verdade. Um `.convert("RGBA")` de uma sessão anterior
   criava alfa sintético (sempre 255) em cima da imagem; a "validação em terra" dos
   17 pontos de `massas.geojson`, feita naquela sessão lendo esse alfa, sempre dava
   verdadeiro — não testava nada. Refeita nesta sessão com o canal certo (o valor de
   cinza: 255=terra, 0=mar, confirmado por amostragem): a conclusão não muda (os 17
   pontos continuam em terra), mas o método estava quebrado por sorte. Registrado em
   `CARTOGRAFO.md`, "Achados técnicos".
2. **Cada zoom reduz o zoom anterior** (metade da imagem em tons de cinza,
   `Image.resize`), nunca relê o arquivo. Nenhuma imagem colorida (RGBA) do mapa
   inteiro é criada em nenhum momento — a colorização (bege/azul, só uma prévia
   provisória) acontece só no recorte de 256x256 que está sendo salvo, tile a tile.
3. **`MAX_ZOOM=6` é a resolução nativa** (2⁶×256=16384≥10240); nenhum bloco além
   disso é gerado. Corrigido também no frontend: o mapa (`app.js`) agora tem
   `maxZoom` do **Leaflet** maior que o nativo (`MAX_ZOOM_MAPA = MAX_ZOOM + 3 = 9`,
   `backend/coordenadas.py`), com `maxNativeZoom: MAX_ZOOM` na camada de tiles — o
   usuário pode aproximar além do zoom 6 e o Leaflet estica o tile nativo sozinho no
   navegador, sem pedir (nem o script gerar) arquivo que não existe.
4. **Recusa se `render/tiles/` já existir e não estiver vazia** — sem sobrescrever.
   Decisão de design: em vez de um prompt interativo (`input()`), que travaria pra
   sempre se o script for chamado por um agente sem terminal de verdade, ele recusa e
   pede pra apagar a pasta à mão. É a mesma ideia de "perguntar" — parar e exigir
   confirmação explícita — só que sem depender de stdin.

### Segunda parada obrigatória — resolvida nesta sessão

`scripts/gerar_tiles.py --confirmo` rodou depois do usuário confirmar (navegadores e
outras sessões já fechados). Resultado:

| Métrica | Valor |
|---|---|
| Tempo total | 10,4 s |
| Pico de memória do processo | 298 MB |
| Tiles gravados | 3.184 (1.163 de costa + 2.021 de mar) |
| Tamanho de `render/tiles/` | 3,9 MB |

**Nota sobre a medição de memória**: a primeira tentativa de medir o pico via
`ctypes.windll.psapi.GetProcessMemoryInfo` devolvia sempre `-1` (falha silenciosa) —
achado nesta sessão: `ctypes.windll` usa `restype` padrão `c_int` para
`GetCurrentProcess`, que trunca o pseudo-handle em processo 64-bit. Corrigido
carregando `kernel32`/`psapi` à mão com `restype`/`argtypes` explícitos
(`ctypes.WinDLL(..., use_last_error=True)`), testado isoladamente antes de confiar no
número, e só então os tiles foram regerados (a primeira leva, com a medição quebrada,
foi apagada e refeita do zero — os números acima já são da leva boa). 298 MB confirma
que a mudança para modo "L" + colorização por tile (em vez de uma imagem RGBA do mapa
inteiro) funcionou: bem abaixo dos ~420 MB que uma leitura ingênua em RGBA usaria.

### Verificação visual (Leaflet, navegador de verdade)

Servidor **deixado no ar** para o usuário abrir:

**http://127.0.0.1:8420/**

Conferido com `claude-in-chrome` nesta sessão:
- **Costa aparece corretamente**, com o contorno de Uldun reconhecível (arquipélago
  de Waning visível no minimapa e no mapa principal), terra em bege/mar em
  azul-acinzentado (cores provisórias do script, não o renderizador final).
- **Zoom**: testado do zoom inicial até zoom 5 (tiles nativos mudando de
  `/tiles/costa/2/...` até `/tiles/costa/5/...` corretamente, coastline cada vez mais
  detalhada). **Achado nesta sessão**: os cliques automatizados do agente de
  navegador no botão "+"/"−" às vezes não registravam (ficava no mesmo zoom) —
  isolado com `mapa.setZoom()` direto (sempre funcionou) e com
  `dispatchEvent(new MouseEvent('click'))` no botão (também sempre funcionou,
  disparando `zoomstart`/`zoom`/`zoomend` normalmente). Ou seja, **o mecanismo de
  zoom do app está correto**; o que falhou foi especificamente a simulação de clique
  de mouse do `computer` tool desta sessão de automação (a mesma sessão também teve
  `Page.captureScreenshot` travando de forma intermitente) — não é algo que deva
  afetar um clique de mouse de verdade. Ainda assim, desativei a animação de zoom/pan
  (`zoomAnimation`/`fadeAnimation`/`markerZoomAnimation: false`) como recomendação
  própria, independente do achado (numa ferramenta de edição de precisão, zoom
  instantâneo é melhor que animado enquanto o usuário está posicionando algo) —
  **aprovada pelo usuário** depois de testar a etapa 1. Fica valendo daqui pra
  frente, não é mais só sugestão da IA.
- **Minimapa**: retângulo vermelho acompanha corretamente a área visível (cobre o
  minimapa inteiro em zoom baixo, encolhe e se reposiciona em zoom alto); clique no
  minimapa navega o mapa principal (testado duas vezes, centro do mapa mudou para o
  ponto clicado nas duas).
- **Latitude/longitude sob o cursor**: atualiza ao mover o mouse sobre o mapa
  (testado, valor plausível pra posição).
- **Seletor de camada ativa**: aparece na barra superior (`RELEVO`/`Planície`), como
  no esboço — ainda não conectado a nada (não tem o que selecionar até a etapa 5).
- Sem erro no console do navegador em nenhum dos testes.

## Etapa 2 — camadas de referência, preparada até a parada obrigatória

### Feito nesta sessão (sem processamento pesado)

- **`dados/camadas_referencia.json` criado**: 5 entradas (as 4 imagens do ChatGPT +
  `rotulos`), cada uma com `visivel`, `opacidade` e `bounds` (retângulo em lat/lon —
  posição e escala são a mesma coisa: esticar a imagem sobre esse retângulo). As 4
  do ChatGPT nascem com um retângulo-placeholder pequeno no centro do mundo
  (`sul/norte/oeste/leste = -10/10/-10/10`), porque não têm orientação nem escala
  conhecida — o usuário ajusta. `rotulos` (`fonte/Mapa Teste1.jpg`) já nasce com o
  retângulo do mundo inteiro, porque é derivado da mesma tela de 10240px da costa —
  **testado, alinha perfeitamente com o contorno** (ver abaixo).
- **`backend/referencias.py`**: lê/grava `camadas_referencia.json` com gravação
  atômica (arquivo temporário + `os.replace`) e validação (opacidade entre 0 e 1,
  `sul<norte`, `oeste<leste`) antes de gravar.
- **`backend/main.py` ganhou**: `GET /api/camadas-referencia` (devolve o documento
  com uma `url` calculada por camada); `POST /api/camadas-referencia/{id}` (aplica
  mudança parcial — `visivel`, `opacidade` ou `bounds` — e grava); montagem estática
  de `/referencias` e `/fonte` (servidos **crus**, sem nenhum processamento Python —
  o navegador decodifica como decodificaria qualquer `<img>`; isso não é o
  "processamento pesado" da regra do CARTOGRAFO, que é sobre o SERVIDOR decompor ou
  varrer a imagem, não sobre servir os bytes).
- **`static/js/camadas-referencia.js`**: cada camada vira um `L.imageOverlay`
  (bounds = retângulo, opacidade = slider); checkbox liga/desliga, slider de
  opacidade, botão "posição" abre 4 campos numéricos (sul/norte/oeste/leste) +
  "aplicar", que salva no servidor e redesenha o overlay. Sem arrasto de
  canto/redimensionar visualmente — números digitados, mais simples, e ainda é
  "ajustável à mão" como o ESPEC pede.
- **Testado num navegador de verdade**: a camada `rotulos` aparece por cima da costa
  com opacidade 0.7, os nomes (The White Wall, The Neck, Calin, Waning, Mére, Syl)
  caem exatamente em cima do contorno certo — confirma que os bounds do mundo
  inteiro (`dados/coordenadas.json`, `limites_da_tela`) estão certos também para
  essa finalidade. Testado ligar/desligar uma camada do ChatGPT (apareceu no
  retângulo-placeholder, como esperado) e a gravação da mudança em
  `camadas_referencia.json` (conferida no arquivo em disco). Sem erro no console.

### Ocean Deep — parada obrigatória, código escrito e NÃO executado

`scripts/extrair_ocean_deep.py` está escrito (abre `fonte/Mapa.psd` por automação
COM do Photoshop, isola a camada "Ocean Deep", exporta um PNG a partir de uma
**cópia** do documento — nunca do original — e gera uma pirâmide de tiles a partir
dele, do mesmo jeito que `gerar_tiles.py`). **Não foi rodado.**

- **Mais pesado que a costa**: abre um arquivo de 594 MB pelo Photoshop (aplicação
  inteira, não só decodificar um PNG) — cai na regra do CARTOGRAFO.md sobre
  processamento pesado, com um agravante a mais: precisa do Photoshop instalado e
  sem outro documento grande aberto.
- **Não testado, ao contrário de `gerar_tiles.py`**: usa a API de automação COM do
  Photoshop (`win32com`), que só se comprova rodando de verdade — e rodar de
  verdade é exatamente o processamento pesado que está sendo evitado até o usuário
  confirmar. Os pontos mais incertos (documentados como "VERIFICAR NA PRIMEIRA
  EXECUÇÃO" no código): se "Ocean Deep" está solta ou dentro de um grupo de
  camadas, e se `MergeVisibleLayers` preserva transparência do jeito esperado numa
  camada que não cobre a tela inteira.
- **Regra de ouro reforçada no código, não só na intenção**: o documento original
  (`Mapa.psd` aberto) nunca leva `.Save()`, só é lido e duplicado; todo o trabalho
  de isolar/exportar acontece na cópia. Antes de fechar o original, o script confere
  `doc_original.Saved` (o Photoshop diria `False` se achasse que algo mudou) e
  **recusa fechar sozinho** se isso disparar, em vez de arriscar a opção de
  salvamento errada — prefere parar e pedir pra um humano olhar.
- **Roda com o Python GLOBAL da máquina, não o `.venv` da ferramenta**: `win32com`
  já está instalado nele (sessão anterior de automação COM) e não foi instalado no
  `.venv` — instalar de novo só pra essa automação de uso único não faria sentido, e
  entraria na regra de "nada instalado sem ok".
- **Ao rodar com sucesso**, ainda falta plugar a pirâmide de tiles do Ocean Deep no
  `app.js`/`camadas-referencia.js` (hoje eles só sabem de imagem inteira + tiles
  costa/mar; Ocean Deep é tile, mas não é costa nem mar) — fica para depois da
  extração, não fazia sentido escrever esse fiozinho antes de saber que os tiles
  vão existir.
