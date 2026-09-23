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
  - **A atração é NOSSA, não do plugin** (decidido pelo usuário em 2026-09-23, oitava
    rodada, depois da conferência empírica do Geoman free). O `snappable` do Geoman
    gruda em camada registrada no `pm`, com distância medida **em pixels de tela**, e
    portanto muda de significado a cada zoom — não serve para uma regra escrita em
    quilômetros. A atração de 5 km acontece **no servidor, ao salvar**: antes de
    gravar, cada ponto do traçado é comparado com os lugares (e, no caso do delta, com
    o traçado do rio-mãe), e o que estiver a menos de 5 km assume a coordenada exata
    do alvo. Consequência que vale registrar: o que o usuário vê enquanto desenha é o
    traçado cru, e o ponto "pula" para o alvo quando a resposta do servidor volta — é
    o mesmo comportamento já usado pelo recorte de área (a tela sempre redesenha do
    que o servidor devolveu, nunca do que o navegador desenhou).
  - **Implementar quando as estradas chegarem** (etapa B5). Hoje não há nenhum traçado
    para atrair, e o código não existe.
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
- **Ordem de empilhamento, fixada na implementação (oitava rodada)**: o Leaflet põe
  tiles no `tilePane` (z 200) e vetores no `overlayPane` (z 400), então um
  `L.tileLayer` comum NUNCA ficaria por cima da área pintada. A camada do mar vive
  numa pane própria (`createPane("mar")`, z **450**): acima da área vetorial (400) e
  abaixo de sombras (500), marcadores (600) e dicas (650). A pane leva
  `pointerEvents: "none"`, senão ela intercepta todo clique destinado aos polígonos
  embaixo dela (seleção de área, arrasto de lugar, régua e o próprio desenho morreriam
  em silêncio).
  - **Consequência para rios e estradas**, que ainda não existem: eles nascerão
    vetores, e vetor nasce no `overlayPane` (400), que é ABAIXO de 450 · ou seja, o
    mar cobriria um rio que passasse perto da costa. Para valer a ordem escrita acima
    ("abaixo dos rios/estradas/lugares"), rio e estrada precisam de pane própria com
    z acima de 450 quando chegarem. Registrado aqui para a etapa B5 não descobrir
    isso na tela.
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
- **Exceção: `scripts/extrair_ocean_deep.py` roda no Python GLOBAL da máquina, não
  no `.venv`.** Motivo: precisa de `win32com` (pywin32) pra automação COM do
  Photoshop, e esse pacote já estava instalado no Python global (Python 3.14.5) de
  uma sessão anterior de automação COM — instalar de novo, isolado, só pra um
  script de uso único (a extração roda uma vez, não faz parte do ciclo normal da
  ferramenta) não se justificava. **`win32com` não entra em `requirements.txt`**:
  esse arquivo documenta o ambiente do `.venv` da ferramenta (FastAPI/servidor), e
  `win32com` não é dependência dele — é dependência de um script avulso que nunca
  roda dentro do `.venv`. Se um script de automação COM do Photoshop virar
  recorrente (não é o caso hoje: Ocean Deep foi extraída uma vez, o script não
  precisa rodar de novo), aí sim caberia perguntar ao usuário se instala
  `pywin32` num ambiente próprio documentado — decisão futura, não tomada agora.
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

### Ocean Deep — extraída, tiles gerados, ligada na ferramenta (2026-09-22)

`scripts/extrair_ocean_deep.py` rodou com sucesso em 2026-09-22, depois de três
falhas na mesma sessão que corrigiram o código (ver "Achados desta execução"
abaixo). Abre `fonte/Mapa.psd` por automação COM do Photoshop, isola a camada
"Ocean Deep", exporta um PNG a partir de uma **cópia** do documento (nunca do
original) e gera uma pirâmide de tiles em `render/tiles/ocean-deep/`, do mesmo
jeito que `gerar_tiles.py` faz para a costa/mar.

- **Resultado da extração**: PNG em `render/ocean_deep_exportado.png` (fora do
  git), 10240×10240px, modo RGBA. Tempo total (extração + tiles): 48,7s. Pico de
  memória do processo: 1.074 MB. Tiles gravados: 1.925 (zoom 6: 1410, zoom 5: 377,
  zoom 4: 99, zoom 3: 25, zoom 2: 9, zoom 1: 4, zoom 0: 1) — bem menos que
  costa+mar porque Ocean Deep só tem dado sobre o mar, terra sai transparente.
- **Alinhamento confirmado com controle negativo**: ponto de terra conhecido
  (Mére, x=6211,y=7650, o mesmo usado para fixar `y_equador_px`) deu pixel
  `(0,0,0,0)` — vazio, como tem que dar. Ponto de mar aberto conhecido (o mesmo
  controle negativo da validação de `massas.geojson`, x=1000,y=5000) deu
  `(1,1,1,128)` — valor presente. A camada bate com a mesma tela de 10240px da
  costa oficial, sem transformação própria.
- **Ligada na ferramenta**: `static/js/app.js` monta `/tiles/ocean-deep/{z}/{x}/{y}.png`
  como `L.tileLayer` (mesma CRS/bounds da costa, sem alinhamento próprio
  necessário). Checkbox + slider de opacidade em `templates/index.html`, seção
  "OCEAN DEEP" — liga/desliga só na sessão do navegador, sem gravação em disco
  (diferente das camadas de referência, que persistem em
  `dados/camadas_referencia.json`). `backend/main.py` não precisou de rota nova: o
  mount `/tiles` já serve qualquer pasta dentro de `render/tiles/`, incluindo
  `ocean-deep/`.

#### Achados desta execução (as 3 falhas corrigidas, registradas porque a próxima
sessão que mexer em automação COM do Photoshop vai tropeçar nas mesmas)

1. **`RPC_E_SERVERCALL_RETRYLATER` ("o filtro de mensagens indicou que o aplicativo
   está ocupado") logo após o `Open()`**: o Photoshop ainda processava o PSD de
   594 MB internamente quando a chamada seguinte (`Duplicate()`) chegou. Contenção
   COM transitória, não específica do Photoshop — resolvida com um retry (até 10
   tentativas, 3s de espera) ao redor de toda chamada COM arriscada
   (`Open`/`Duplicate`/`MergeVisibleLayers`/`SaveAs`/`Close`/checagem de `Saved`).
   Qualquer outro código de erro ainda sobe na hora, sem retry.
2. **"O usuário cancelou a operação"** ao chamar `MergeVisibleLayers`: é o erro
   padrão quando uma chamada scriptável dispararia uma caixa de diálogo (perfil
   ICC, camadas ocultas etc.) e não há usuário pra clicar nela. Resolvido com
   `app.DisplayDialogs = constants.psDisplayNoDialogs` logo após o `Dispatch`, API
   documentada da Adobe pra automação sem interação.
3. **"O comando 'Mesclar camadas visíveis' não está disponível no momento"**,
   mesmo com diálogos suprimidos e com `app.ActiveDocument` apontando pra cópia:
   "Ocean Deep" é uma camada solta de topo (sem grupo ancestral, resposta à dúvida
   "VERIFICAR NA PRIMEIRA EXECUÇÃO" que estava aberta), então isolar a visibilidade
   deixa **uma única camada visível** — e o Photoshop desabilita "mesclar
   visíveis" quando não há mais de uma camada pra combinar. **O merge era
   desnecessário**: `SaveAs` pra um formato sem camadas (PNG) sempre compõe o que
   está visível no momento do salvamento, documentado assim pela Adobe, sem
   precisar de um merge explícito antes. A chamada a `MergeVisibleLayers` foi
   removida do script.
4. **Alfa de verdade confirmado**: `MergeVisibleLayers` nunca chegou a rodar (item
   3), então a dúvida original ("VERIFICAR NA PRIMEIRA EXECUÇÃO" sobre transparência
   preservada) não se aplica mais — o alfa vem direto da camada isolada, e o
   controle negativo acima confirma que ele é real (terra vazia, mar com valor).
- **Roda com o Python GLOBAL da máquina, não o `.venv` da ferramenta** — motivo
  registrado na seção "Instalação", mais abaixo neste documento.

### Correções pedidas pelo usuário depois do primeiro teste da etapa 2 (2026-09-22)

O usuário testou a etapa 2 (Ocean Deep + camadas de referência) e pediu 5 ajustes
antes de aprovar o commit. Estado depois desta rodada:

1. **"Rótulos" não é mais a imagem inteira de `Mapa Teste1.jpg`** (cobria os tiles
   da costa com um JPG de 10240px por cima). Virou tipo `tile`, igual à Ocean Deep.
   **Executado com sucesso em 2026-09-23** (`scripts/gerar_rotulos.py --confirmo`,
   depois de um `--teste` medindo o pico de memória — ver "Rótulos: execução final",
   abaixo). Roda no `.venv` (só Pillow, nenhuma automação COM, diferente de
   `extrair_ocean_deep.py`).
2. **Alinhamento por 2 pontos** para as camadas `imagem` (as 4 do ChatGPT): botão
   "alinhar" em `static/js/camadas-referencia.js` abre um modal
   (`templates/index.html`, `#modal-alinhamento`) com a imagem crua; o usuário
   clica um ponto na imagem, depois o ponto correspondente no mapa (usa
   `mapa.on("click", ...)` com listener de uso único), repete pro segundo par, e o
   código calcula escala X/Y independentes (sem rotação:
   `escala = (destino2-destino1)/(origem2-origem1)`, por eixo) e os `bounds`
   resultantes, grava via o mesmo `POST /api/camadas-referencia/{id}` que os campos
   numéricos já usavam. Os campos numéricos continuam existindo pro ajuste fino,
   como pedido. Pontos quase colineares no mesmo eixo (diferença de pixel < 1) são
   recusados com aviso, pra não dividir por um número perto de zero. **Não testado
   num navegador de verdade ainda** (só sintaxe conferida com `node --check`) —
   pedir pro usuário testar o clique real antes de considerar fechado.
3. **Formato da leitura de cursor**: `"36,42° N  72,67° O"` (grau, espaço antes da
   letra, vírgula decimal, dois espaços entre lat e lon) — `formatarCoordenada` em
   `static/js/app.js`. Fora dos limites REAIS do mundo (`PARAMETROS_LEAFLET.limites`,
   não o `maxBounds` com folga de 15% usado só pra não travar o pan bruscamente na
   borda) mostra traços (`"--,--°  -   --,--°  -"`).
4. **Estado da Ocean Deep (visível, opacidade) agora persiste** em
   `dados/camadas_referencia.json`, junto com as outras camadas — antes vivia só
   em memória do navegador (checkbox solto em `index.html`, sem gravação). Passou a
   usar o mesmo mecanismo de tipo `tile` do item 1: `dados/camadas_referencia.json`
   ganhou um campo `"tipo"` (`"imagem"` ou `"tile"`), `backend/referencias.py`
   dispensa `bounds` pra `tipo: "tile"` (não existe posição ajustável — a pirâmide
   já cobre o mundo inteiro pela CRS), e `backend/main.py` calcula a `url` de tile
   como `/tiles/<id>/{z}/{x}/{y}.png` em vez de `/referencias/...`/`/fonte/...`.
   `versao_esquema` subiu de 1 pra 2 no JSON.
5. **Rodapé (`#status-salvamento`) atualizado** pra descrever a etapa 2 (antes
   dizia "etapa 1: sem dado editável ainda", desatualizado desde que a etapa 2
   começou).
- **Estado pra teste**: `rotulos.visivel = false`, `ocean-deep.visivel = true`,
  `ocean-deep.opacidade = 0.7` — pedido explícito do usuário pra essa rodada de
  teste. Servidor reiniciado (os dois processos uvicorn antigos, de sessões
  anteriores, foram encerrados antes de subir o novo, porque `main.py` mudou e o
  uvicorn não roda com `--reload`).

## Rodada noturna autônoma de 2026-09-22 — etapas 3 e 4, e correções da etapa 2

Detalhe completo (números, achados, roteiro de teste) em `RELATORIO-NOITE.md`.
Resumo do que muda nesta especificação:

- **A1 (zoom fracionário)**: `zoomSnap`/`zoomDelta` deixam de ser 1 inteiro;
  campo de porcentagem próprio na barra do topo substitui o controle de zoom
  nativo do Leaflet (`zoomControl: false`). 100% = `MAX_ZOOM` (resolução nativa de
  10240px), 800% = `MAX_ZOOM_MAPA` (`MAX_ZOOM + SOBRE_ZOOM`, já existia, não
  precisou de número novo). Piso do zoom calculado por `map.getBoundsZoom`, não
  mais fixo em 0.
- **A2 (alinhamento automático ChatGPT)**: `scripts/alinhar_chatgpt_auto.py`,
  roda no `.venv` (Pillow+numpy, sem instalação nova). Classifica terra/mar por
  cor, busca escala (X/Y independentes, sem rotação) e posição que maximizam IoU
  contra a costa oficial reduzida. Grava `bounds`, `bounds_anterior_a_20260922` e
  `alinhamento_automatico` (IoU, método, data) em `camadas_referencia.json`. Gera
  prévia em `render/analise/alinhamento_chatgpt-N.png`.
  **Aceito pelo usuário em 2026-09-23**: as 4 imagens convergirem pra bounds quase
  idênticos, cobrindo quase o mundo inteiro, não é resultado degenerado — as
  imagens do ChatGPT foram geradas a partir do MAPA INTEIRO (ver
  `historico/PROMPT-mapa-completo-svg.md`, que pede "um mapa de fantasia colorido
  e completo, água E terreno" a partir do SVG da tela inteira de 10240px), então
  cobrir o mundo todo é exatamente o esperado, não um sinal de otimizador preso
  num mínimo raso. Nota de sobreposição (IoU) de cada imagem, gravada em
  `dados/camadas_referencia.json` (`alinhamento_automatico.iou_terras`):

  | Camada | IoU |
  |---|---|
  | chatgpt-1 | 70,4% |
  | chatgpt-2 | 70,8% |
  | chatgpt-3 | 55,3% |
  | chatgpt-4 | 63,7% |
- **Etapa 3 — Ferramenta de Lugar**: implementada. `backend/lugares.py` (tipo
  fechado `cidade/vila/fortaleza/porto/ruina/marco`, `capital` só quando
  `tipo=="cidade"`, ponto tem que cair em terra por `mascaras/costa_10240.png`,
  cacheada em memória uma vez por processo). Todas as gravações passam pela
  infraestrutura de desfazer/refazer (abaixo). Endpoints REST em `backend/main.py`
  (`GET/POST /api/lugares`, `PUT .../posicao`, `PUT /api/lugares/{id}`,
  `DELETE /api/lugares/{id}`). UI mínima em `static/js/lugares.js` (marcador
  arrastável, criar por clique + `prompt()`, editar/apagar por `prompt()`/
  `confirm()` nativos — não é a UI final, é o suficiente pra exercitar o B1/B2
  de ponta a ponta).
- **Infraestrutura de gravação (a "Gravação e histórico de operações" acima,
  agora implementada)**: `backend/historico.py` (gravação atômica + últimas 5
  versões em `dados/.historico/<arquivo>/`) e `backend/operacoes.py` (log de
  operações em `dados/.operacoes/log.jsonl` + cursor em `cursor.json`, desfazer/
  refazer com descarte do rabo de refazer numa operação nova — decisão da IA, não
  estava no ESPEC). **Decidido nesta rodada**: sem limite de tamanho do log (o
  ESPEC cogitava "as últimas 50 operações", não decidido; escala de uso de uma
  ferramenta solo não justifica podar ainda). Endpoints genéricos `GET /api/pilha`,
  `POST /api/desfazer`, `POST /api/refazer` — servem qualquer ferramenta futura
  que grave por `operacoes.registrar_operacao`, não só Lugar.
- **Etapa 4 — Régua e grade de lat/lon**: implementada. `static/js/regua.js`,
  distância por grande círculo (haversine) sobre `PARAMETROS_LEAFLET.raio_km`
  (novo campo, `backend/coordenadas.py`), nunca a régua da tela. Grade de lat/lon
  a cada 10°, ligável por checkbox. Fórmula espelhada e testada em Python
  (`tests/test_haversine.py`) contra dois casos de fórmula fechada.
- **`pytest` instalado no `.venv`** (autorizado pelo usuário para a rodada
  noturna), `requirements.txt` atualizado. 34 testes em `ferramentas/tests/`,
  cobrindo `historico.py`, `operacoes.py`, `lugares.py` e a fórmula de
  `regua.js` (espelhada em Python).
- **Nada testado num navegador de verdade** nesta rodada (sem sessão de browser
  automation) — tudo verificado por `pytest`, `node --check` e chamadas de API
  reais via `curl` contra o servidor rodando. Ver `RELATORIO-NOITE.md` para o
  roteiro de teste manual.
- **Etapa 5 (Área/Geoman) não iniciada** — Leaflet-Geoman free 2.20.0 estava
  autorizado para instalação nesta noite, mas não foi baixado (faltou tempo no
  orçamento da rodada).

## Correções pedidas em 2026-09-23 (depois do teste do usuário)

- **`scripts/gerar_rotulos.py` reescrito** para comparar por faixa horizontal de
  256px (uma linha de tiles por vez), em vez de montar um PNG de 10240px
  intermediário — a versão anterior materializava ~8 cópias inteiras de 10240px
  além das duas imagens de origem (diff, 3 canais, diferença máxima, máscara,
  RGBA de saída). Zooms menores vêm de reduzir os TILES do zoom acima (canvas de
  até 512px, nunca uma imagem de 10240px). Modo `--teste`: abre as duas imagens
  de verdade e processa só 4 de 40 faixas, mede o pico e recomenda a memória
  livre necessária pra rodar tudo (pico não cresce com o número de faixas —
  domina o custo fixo de abrir as duas imagens).
- **Esquema de `capital`/`importancia` corrigido**: a rodada anterior tinha
  concluído (errado) que a decisão nunca fora escrita em documento nenhum — na
  verdade estava em `lore/mapas/historico/ESPEC-dados-revisao2.md`, guardado
  pelo usuário fora do repositório, e foi apagada pela reescrita que virou a
  terceira revisão, antes do commit `96e4188`. Restaurada em `ESPEC-dados.md`
  ("Nota de recuperação"); ver também a regra nova em `CARTOGRAFO.md`, "Regras
  invioláveis".
- **`backend/operacoes.py` reescrito**: cada operação grava só as FEATURES
  afetadas (por id), não o `FeatureCollection` inteiro antes/depois — ver
  docstring do módulo para o formato novo (`mudancas`).

### Rótulos: execução final (2026-09-23)

`scripts/gerar_rotulos.py --teste` rodou primeiro (autorizado só para medir):
abriu as duas imagens de verdade, processou 4 de 40 faixas, pico medido **1.619
MB**, recomendação **≥ 2.429 MB (~2,37 GB) de memória livre**.

Com a memória em 3,39 GB (acima da recomendação), `scripts/gerar_rotulos.py
--confirmo` rodou a versão completa:

| Métrica | Valor |
|---|---|
| Tempo total | 4,5 s |
| Pico de memória do processo | 1.624 MB (bate com a previsão do `--teste`, 1.619 MB) |
| Tiles gravados (zoom máximo) | 57 (poucos — texto é esparso, a maior parte da tela fica transparente) |
| Tiles totais (todos os zooms) | 101, 1,9 MB em disco |

**Validação com controle negativo** (regra do CARTOGRAFO.md): um pixel único no
centro do `rotulo` de "Mére" (`dados/regioes.json`) deu alfa=0 — **não é um
bug**: o ponto de rótulo marca a posição de referência do texto, não
necessariamente cai em cima de tinta (pode cair entre letras ou num espaço). Uma
amostragem numa janela de ~50×50px em volta do mesmo ponto achou 735 pixels com
alfa>0 (máximo 255) — controle positivo confirmado com janela, não com pixel
único, exatamente como recomendado numa revisão anterior. Controle negativo (mar
aberto longe de qualquer nome, x=1000,y=5000) deu 0 pixels com alfa>0 na mesma
janela — sem ruído de compressão JPEG passando pelo limiar de 30.
`rotulos.visivel` em `dados/camadas_referencia.json` continua `false` (estado
que já estava lá) — não mudei sozinho, é o usuário quem liga pela ferramenta.

## Interface: modal de Lugar e melhorias (2026-09-23, quinta rodada)

Substitui os `prompt()`/`confirm()` nativos da primeira versão da Ferramenta de
Lugar e acrescenta as melhorias de interface pedidas. Arquivo novo:
`static/js/interface.js` (atalhos, ajuda, barra inferior, seções que
abrem/fecham, indicador de salvamento) — o contrato entre os `<script src>`
desta ferramenta continua sendo um punhado de funções globais nomeadas, sem
módulo ES nem bundler (decisão da etapa 1, sem mudança).

- **Modal de Lugar**: nome, id, tipo, importância, capital, latitude e
  longitude, todos editáveis. `Enter` salva, `Esc` cancela, foco no nome ao
  abrir, "salvar e criar outro" mantém o modal aberto e limpo (o tipo é
  herdado do anterior, que é o caso comum de marcar vários em sequência). O
  MESMO modal edita um lugar existente, com "apagar" dentro dele. O `id` é
  sugerido a partir do nome (slug sem acento) enquanto o usuário não digita um
  próprio, e vira somente-leitura na edição (id é permanente, ver
  `ESPEC-dados.md`). **Validação aparece no próprio modal, nunca em `alert`** —
  tanto a do navegador (campo em branco, formato do id, capital fora de cidade)
  quanto a que só o servidor sabe (id repetido, ponto caindo no mar), que volta
  pela resposta e é mostrada no mesmo lugar.
- **Atalhos**: `L` lugar, `R` régua, `Esc` sai da ferramenta, `Ctrl+Z`/`Ctrl+Y`
  desfazer/refazer, `espaço` segurado arrasta sem sair da ferramenta, `C`
  segurado mostra só a costa, `[`/`]` opacidade da camada de referência ativa,
  `+`/`-` zoom, `?` abre a tela de ajuda com a lista toda. Dentro de um campo de
  texto nenhuma tecla de ferramenta dispara (só `Esc` e `Enter`).
- **Lista lateral de lugares** com busca por nome/id, clique centraliza e
  destaca, e o destaque é recíproco com o mapa.
- **Barra inferior**: coordenada do cursor (saiu do topo), zoom em
  porcentagem, o que está sob o cursor, e o estado do salvamento.
- **Indicador de salvamento**: "salvando..." → "✓ salvo" (some sozinho em 2,5s)
  e, quando falha, "✘ NÃO SALVOU: <motivo>" em vermelho que **não some
  sozinho** — inclusive quando o servidor não responde (erro de rede), que
  antes passava batido.
- **Confirmação só em ação destrutiva sem desfazer**: apagar um lugar deixou de
  perguntar (é operação registrada, o desfazer cobre); "limpar todas as
  medições" da régua continua perguntando, porque medição da régua é estado do
  navegador e não passa pelo log de operações.
- **Tema escuro por padrão**, com as cores do mapa preservadas: nenhum
  `filter`/`opacity` global sobre `#mapa` — o escuro é só da moldura (painéis,
  barras, modais), então tile de costa, Ocean Deep e Rótulos saem exatamente
  como o gerador os fez.

### Ressalvas registradas (item 4 do pedido: parar e avisar em vez de forçar)

1. ~~**"O que está sob o cursor" mostra o LUGAR sob o ponteiro, não terra/mar.**
   Saber se o pixel é terra ou mar exigiria consultar `costa_10240.png` a cada
   movimento do mouse (...)~~ — **RESSALVA ERRADA, corrigida em 2026-09-23
   (sexta rodada) e implementada**. O usuário apontou o furo: não é preciso a
   máscara de 10240px nenhuma. **O bloco da costa que o navegador já baixou JÁ
   É a resposta** — `scripts/gerar_tiles.py` pinta terra com alfa 255 e mar com
   alfa 0, então "é terra?" é ler o alfa daquele pixel. Implementado em
   `static/js/terra-ou-mar.js`: o bloco é desenhado uma vez num canvas oculto,
   o `ImageData` fica guardado por bloco (teto de 60 blocos, ~15 MB, com
   descarte do mais antigo), a leitura seguinte é um índice em array, e a
   leitura é sempre no zoom NATIVO, então o cache não é refeito a cada
   aproximação. Sem chamada ao servidor por movimento do mouse. Dois detalhes
   que só aparecem fazendo:
   - **404 é resposta, não erro**: `gerar_tiles.py` não grava tile totalmente
     transparente, e tile de costa totalmente transparente é um pedaço de
     mundo que é só mar — então bloco ausente = mar, guardado como tal.
   - **O único impedimento real seria CORS**: `getImageData` num canvas com
     imagem de outra origem sem CORS lança, e o canvas fica "tainted". Aqui os
     tiles vêm do próprio servidor da ferramenta (mesma origem), então não
     acontece; o código trata o caso mesmo assim (marca o bloco como
     desconhecido em vez de tentar de novo a cada movimento), porque é o que
     quebraria se um dia os tiles saíssem para outro domínio.
   - **Conferido com controle negativo**, lendo os mesmos arquivos de tile que
     o navegador lê, pela mesma regra: terra conhecida (Mére, px 6211,7650)
     deu `alfa=255 → terra`; mar aberto conhecido (px 1000,5000) caiu num
     bloco AUSENTE → mar; e — o controle que importa — um pixel de mar DENTRO
     de um bloco que existe (px 6211,7900) deu `alfa=0 → mar`, provando que a
     regra não é "o bloco existe, então é terra". O que essa conferência NÃO
     cobre: o caminho do canvas no navegador (`getImageData`), que só um teste
     no navegador de verdade exercita.
2. **A tecla `C` (só a costa) depende da ORDEM das camadas no DOM**: a regra
   CSS esconde todo `.leaflet-layer` do painel de tiles menos o primeiro, e o
   primeiro é a costa porque `app.js` a adiciona antes das outras. Funciona, mas
   é uma suposição de ordem, não uma ligação explícita com a camada. Se um dia
   alguma camada for adicionada antes da costa, a tecla esconde a coisa errada.
3. ~~**A régua ainda usa `prompt()` para o nome ao salvar uma medição.**~~ —
   **RESOLVIDO em 2026-09-23 (sexta rodada)**: virou `#modal-medicao`, no mesmo
   padrão do de Lugar (Enter salva, Esc cancela, foco no campo ao abrir, resumo
   da medição — pontos, km e tempos de viagem — no topo, e o erro aparece
   DENTRO do modal, nunca em `alert`; inclusive o erro que só o servidor sabe).
   Com isso não sobra nenhum `prompt()`/`confirm()` de navegador na ferramenta,
   exceto o `confirm()` de ação destrutiva sem desfazer (apagar uma medição,
   limpar todas), que é intencional.
   - **Guarda nova no servidor, com controle negativo**: nome só de espaço
     (`"   "`) vira `null` em vez de virar uma descrição que parece existir e
     não diz nada — a API é chamável direto, então a garantia mora no
     `backend/medicoes.py`, não só no modal (`tests/test_medicoes.py`:
     `test_nome_so_de_espaco_vira_nulo` e `test_nome_com_espaco_nas_pontas_e_aparado`).

## Travar objeto e tema claro/escuro (sétima rodada, 2026-09-23)

### Travar objeto (item 1)

Esquema completo em `ESPEC-dados.md`, seção "Travamento" · definido lá de uma vez
para **todos** os objetos editáveis (lugar, rio, estrada, área), não só para o que
existe hoje, para a ferramenta de Área já nascer com isto.

O que mora na ferramenta:

- `backend/travas.py` · o cadeado por camada (`dados/camadas_travadas.json`) e as
  duas guardas de entrada (`exigir_camada_livre`, `exigir_objeto_livre`). A classe
  `Travado` é **separada de `ValueError` de propósito**, e vira **HTTP 409**:
  o frontend precisa distinguir "está travado" (aviso discreto) de "dado inválido"
  (faixa vermelha de erro de gravação) sem interpretar a mensagem.
- `backend/lugares.py` · as guardas em mover/apagar/editar/criar e o caminho próprio
  `definir_trava`. A trava é checada **antes** da validação de terra: um lugar
  travado nem chega a ser avaliado, e o aviso diz "está travado", não "caiu no mar".
- `static/js/lugares.js` · marcador travado nasce com `draggable: false` (em vez de
  cancelar o arrasto no meio e brigar com o Leaflet), cadeadinho discreto no canto do
  símbolo e na lista lateral, o modal vira só-leitura menos a própria trava, e o
  cadeado da camada é um botão na seção LUGARES.
- `static/js/interface.js` · `mostrarAviso()` (mesma discrição do "✓ salvo", some
  sozinho, nunca a faixa vermelha) e a tecla `T` no objeto selecionado.

**Testes, com controle negativo** (`tests/test_travas.py`, 15 novos, 79 no total):
travado não move / não apaga / não edita, com o dado conferido intacto depois de
cada recusa; destravado volta a mover (controle positivo, senão um bug que recusasse
tudo passaria); `travado` não booleano é `ValueError` e não `Travado`; a camada
travada bloqueia objeto livre; **o teste que pega a implementação ingênua do item
1d**: trava a camada, compara `lugares.geojson` byte a byte antes/durante/depois e
exige que travar a camada não tenha escrito `travado` em ninguém; camada inventada
recusada; e desfazer/refazer das duas travas, inclusive a prova de que desfazer uma
trava de camada não some com as outras cinco camadas do arquivo. Conferido também
por HTTP de verdade: 409 na recusa por trava, 422 no ponto no mar, 404 na camada
inventada · e as operações de teste desfeitas depois, sem sobra no dado real.

### Tema claro/escuro (item 2)

Tokens de cor redefinidos em `:root[data-tema="claro"]`, botão `☾`/`☀` na barra de
cima, tecla `D`, escolha lembrada em `localStorage` (leitura em `try/catch`, como a
das seções). A leitura inicial é um script inline no `<head>`, e não no
`interface.js`: no `interface.js` a página nasceria escura e piscaria para o claro.
**Nenhum dos dois temas toca em `#mapa`** · nem `filter`, nem `opacity`, nem a cor
de fundo dele: o fundo de `#mapa` é o mar provisório, que é MAPA e não moldura.

## Etapa B4 · Ferramenta de Área (2026-09-23)

Desenhar polígono, salvar, recorte da mesma camada, MultiPolygon quando o corte
parte uma área em duas, apagar, travar, desfazer e refazer. **Sem recorte pela
costa**, que é a etapa seguinte, e sem edição de vértice de área já salva.

### Instalação do Geoman

Leaflet-Geoman **free 2.20.0**, MIT, baixado pronto para
`static/vendor/leaflet-geoman-free-2.20.0/` (tarball do registro npm, extraído à
mão: sem `npm install`, sem CDN). Do pacote ficaram só `dist/leaflet-geoman.css`,
`dist/leaflet-geoman.min.js`, `LICENSE`, `README.md` e `package.json`. A barra de
ferramentas própria do plugin fica escondida por CSS: quem liga o desenho são os
botões da ferramenta, e o Geoman entra **só como a caneta**. O recorte, a
gravação, o desfazer e a trava são código nosso.

### O que o Geoman free oferece · conferido no navegador, não de memória

Lido de um `L.map` de verdade na página da ferramenta (`L.PM.version` = 2.20.0),
listando `L.PM.Map.prototype`, `pm.Toolbar.buttons` e as opções padrão de
`pm.Draw.Polygon`:

| recurso | no free? | como foi conferido |
|---|---|---|
| desenhar Marker, Line, Polygon, Rectangle, Circle, CircleMarker, Text | **sim** | `L.PM.Draw` e os 7 botões `draw*` da toolbar |
| editar vértice (`editMode`) | **sim** | botão `editMode`, `enableGlobalEditMode` existe |
| arrastar forma (`dragMode`) | **sim** | botão `dragMode` |
| apagar (`removalMode`) | **sim** | botão `removalMode` |
| **cortar (`cutPolygon`)** | **sim** | botão `cutPolygon`, `enableGlobalCutMode` existe |
| **rotacionar (`rotateMode`)** | **sim** | botão `rotateMode`, `enableGlobalRotateMode` existe |
| **escalar** | **NÃO (pago)** | `enableGlobalScaleMode` é `undefined` e não há botão `scaleMode`; o pacote free traz só o RÓTULO `scaleButton` nas traduções, sem implementação |
| **dividir (split)** | **NÃO (inexistente no free)** | nenhum `splitMode`/`enableGlobalSplitMode`; a única ocorrência de "split" no bundle é código interno do rbush (índice espacial), nada a ver |
| **atração (snap)** | **sim, no plugin · ainda sem efeito aqui** | `pm.Draw.Polygon.options`: `snappable: true`, `snapDistance: 20`, `snapMiddle: false`. **Mas o Geoman só gruda em camada que ELE conhece**, e as áreas desta ferramenta são desenhadas num `L.geoJSON` comum, que nunca passa pelo `pm` · então hoje não há alvo para grudar. **E não é ela que vai atender a atração de 5 km**: o usuário decidiu na oitava rodada que essa atração é nossa, no servidor, ao salvar (a distância do Geoman é em pixels de tela, não em quilômetros) · ver "Ferramentas · Linha", acima. |
| medição durante o desenho | **não achado** | nenhuma opção de medida; `tooltips: true` é só a dica de "clique para continuar" |

**Ressalva honesta**: "existe na API" e "serve para o que a gente precisa" são
coisas diferentes. Cortar, rotacionar e a atração **não foram exercitados** pela
ferramenta ainda (esta etapa usa só `enableDraw("Polygon")`); o que está
conferido é que existem no free. O **cortar** do Geoman, pela documentação do
próprio plugin, tira o pedaço sobreposto de uma forma; ele **não** divide uma
área em duas features, então não substitui um "dividir".

**O que faríamos se precisarmos de escalar ou dividir** (registrado a pedido do
usuário, oitava rodada). Os dois faltantes são exatamente os dois que o shapely já
resolve do nosso lado, e o shapely já está instalado e pinado:

- **Escalar**: `shapely.affinity.scale(forma, xfact, yfact, origin)`. A interação
  (pegar a forma pelo canto e arrastar) seria nossa; a matemática é uma chamada. O
  cuidado é o mesmo do recorte: escalar em graus perto do polo distorce mais que no
  equador, então a origem e os fatores teriam que ser calculados em quilômetros pela
  fórmula de `coordenadas.json`, não em graus crus.
- **Dividir**: `shapely.ops.split(poligono, linha)` devolve as partes, e cada parte
  vira uma feature nova pela mesma infraestrutura de `criar_area` (uma operação só no
  log, como já acontece quando um recorte parte uma área em duas). A interação seria
  desenhar uma linha com o Geoman (`enableDraw("Line")`, que existe no free) e mandar
  a linha pro servidor: **o plugin desenha, o shapely divide**, que é a mesma divisão
  de trabalho desta etapa.

Ou seja, nenhum dos dois é motivo para pagar o Geoman Pro: o que o Pro venderia é a
interação, e a parte difícil (geometria correta, gravação atômica, desfazer) é nossa
de qualquer jeito.

### Decisões que o código precisou e o pedido não fixava

1. **Área travada não é recortada: quem cede é a área NOVA.** Recortar é escrever
   na área antiga, e "travado não muda" tem que valer contra qualquer escrita. Se
   o polígono novo ficar sem nada depois de ceder, a criação é recusada e nada é
   gravado.
2. **Um traço é UMA operação.** A área nova e todas as antigas afetadas entram nas
   mesmas `mudancas`; um desfazer devolve o estado inteiro de antes do traço.
3. O polígono devolvido pelo Geoman é **descartado** na tela: quem manda é o que o
   servidor devolve depois do recorte, senão a tela mostraria uma forma que o dado
   não tem.
4. `valor` de `lago` é um vocabulário de um item só (`"lago"`): o que distingue um
   lago de outro é a geometria.

### Tamanho do registro de operações com polígono grande (item 6 do pedido)

Medido, não estimado: um polígono de N vértices, uma operação de recorte que
atinge uma área existente, `dados/.historico/` incluído.

| vértices | arquivo de dados | log da 1ª operação | o recorte acrescenta | histórico |
|---|---|---|---|---|
| 100 | 20 KB | 3 KB | **9 KB** | 28 KB |
| 500 | 97 KB | 11 KB | **40 KB** | 135 KB |
| 2000 | 387 KB | 45 KB | **159 KB** | 537 KB |

A regra que sai daí: **uma operação custa cerca de duas vezes a geometria que ela
toca** (o formato guarda `antes` e `depois` de cada feature afetada), e o
histórico guarda cópias do arquivo inteiro.

**Não cresce demais no uso real**: polígono desenhado à mão com o Geoman tem
dezenas de vértices, não milhares, então uma operação custa alguns KB. Mil
operações numa sessão longa ficariam na casa de poucas dezenas de MB. Fica
registrado onde ficaria ruim: polígono de milhares de vértices (traçado
importado, não desenhado), aí cada recorte passa de 100 KB e o log vira o
problema que a correção de 2026-09-23 já tinha começado a atacar.

## Cobertura automática por latitude (2026-09-23, nona rodada)

Implementa a decisão antiga do `CARTOGRAFO.md` ("Técnica"): terra que o usuário não
pintou mostra cobertura automática por latitude, pintar por cima sobrescreve, apagar
devolve o automático, e **o automático nunca é gravado como feature**.

`backend/cobertura_automatica.py`, sete faixas, do norte para o sul. As bordas de cima
e de baixo saem de `dados/coordenadas.json` (`limites_da_tela`), nunca digitadas: se a
tela mudar, a tabela acompanha.

| faixa | de | até | de onde vem |
|---|---|---|---|
| `geleira` | 55°N | topo da tela | The White Wall, "terra gélida" |
| `tundra` | 45°N | 55°N | The Neck, "frio porém habitável, tundra, coníferas esparsas" |
| `floresta-boreal` | 35°N | 45°N | norte temperado frio (metade norte de Mére, "mais fria") |
| `floresta-temperada` | 25°N | 35°N | Calin, "temperado" |
| `campo` | 15°N | 25°N | faixa quente, aberta e sem afirmar aridez (ver a correção abaixo) |
| `floresta-tropical` | base da tela | 15°N | trópico e equador |

**Três decisões que o código precisou e o pedido não fixava:**

1. **As faixas saem do servidor já DESCONTADAS do que está pintado de cobertura**
   (shapely `difference`, a mesma chamada do recorte entre áreas). A alternativa seria
   empilhar o pintado por cima e confiar na ordem de desenho, e ela não funciona: área
   pintada é desenhada com `fillOpacity` 0,35, então a cor do automático continuaria
   aparecendo por baixo e "pintar sobrescreve" seria mentira na tela. Descontar faz o
   sobrescrever ser literal. Continua sem gravar nada: o desconto é calculado a cada
   pedido.
2. **Toda mudança em área refaz o automático.** Criar, apagar, desfazer e refazer
   passam por `redesenharTudo` em `areas.js`, e é lá que o `GET
   /api/cobertura-automatica` é refeito. Sem isso, desfazer devolveria a área mas não
   fecharia o buraco que ela abriu no automático.
3. **Pane própria em z 390**, abaixo da área pintada (`overlayPane`, 400) e da camada
   do mar (450), com `interactive: false`. As faixas cobrem o mundo inteiro: se
   fossem interativas, engoliriam todo clique destinado ao que está embaixo.

**Correção do usuário em 2026-09-23 (décima rodada), e o motivo é o que interessa**:
a primeira tabela punha `deserto` de 15°N a 25°N e `selva` do equador até 5°N,
copiando o guia de clima ao pé da letra. Mas **nessa mesma faixa de 15°N a 25°N está
Syl**, que o guia descreve como "a parte mais verdejante do mapa": o automático a
pintaria inteira de deserto. **Deserto e selva são exceções REGIONAIS, não regra de
latitude**, e passam a ser pintados à mão nos lugares que o guia indica. O padrão da
faixa quente virou `campo` e o da faixa equatorial virou `floresta-tropical` (que,
com isso, encostou na faixa de baixo, e as duas viraram uma só).

O critério que fica para qualquer faixa futura: **só entra no automático o valor que
vale para a latitude INTEIRA**. O que é verdade só em parte dela é pintura, não
padrão. Refinar por longitude, ou por região consultando `massas.geojson`, continua
sendo trabalho de uma etapa futura, não conserto desta.

**Fora desta etapa, de propósito**: o relevo automático `planicie` (a mesma decisão
prevê um padrão de relevo, e ele ainda não foi implementado) e o ruído de borda entre
faixas, que hoje saem retas.

### Custo do desconto, medido (décima rodada)

Pedido do usuário: medir o tempo por pedido de `/api/cobertura-automatica` com muita
área pintada, e avisar antes de seguir se passar de meio segundo. Medido com
polígonos espalhados pela tela, mediana de 5 pedidos, mesma máquina:

| áreas de cobertura pintadas | vértices cada | mediana por pedido | resposta |
|---|---|---|---|
| 0 | — | 1,2 ms | 1,5 KB |
| 50 | 12 | 12,3 ms | 28 KB |
| 200 | 12 | 44,3 ms | 85 KB |
| 500 | 12 | 98,6 ms | 149 KB |
| 1.000 | 12 | 169,8 ms | 158 KB |
| 500 | 100 | 237 ms | 968 KB |
| 500 | 400 | **658 ms** | 3,8 MB |

Os casos pedidos (50, 200 e 500 áreas de desenho à mão) ficam **abaixo de 100 ms**, e
o crescimento é linear no número de áreas. O meio segundo só é ultrapassado no último
caso, que é 200 mil vértices: **desenho à mão não chega lá** (o próprio ESPEC já
mediu que traço à mão tem dezenas de vértices), só um traçado importado chegaria, e
importar não existe na ferramenta. Se um dia chegar, os caminhos são, em ordem de
esforço: guardar a coleção em cache invalidado por gravação (o desconto só muda
quando uma área muda), simplificar as faixas com `simplify` antes de devolver, ou
passar o automático para tiles gerados uma vez, como a costa.

## Relevo automático planície (2026-09-23, décima rodada)

A outra metade da etapa 7 da lista de etapas: terra que o usuário não pintou tem
relevo `planicie`. Mesma máquina da cobertura automática, agora compartilhada em
`backend/automatico.py` (montar as faixas, subtrair o que está pintado NAQUELA camada,
marcar como automático, nunca gravar); `backend/relevo_automatico.py` é só a faixa
única, do topo à base da tela, e `GET /api/relevo-automatico` a serve.

**Decisão de IA, registrada para o usuário poder derrubar**: na tela, o relevo
automático entra num **interruptor desligado por padrão** ("relevo automático
(planície)", na seção de ferramentas), e não numa camada sempre visível como a da
cobertura. Motivo: `planicie` é um valor ÚNICO sobre toda a terra sem pintura, então
desenhá-lo sempre cobriria as faixas de cobertura com uma cor chapada sem dizer nada
que a ausência de pintura já não diga. Ligado, ele responde à pergunta que é útil:
"onde ainda não pintei relevo". Se o usuário preferir as duas camadas empilhadas, ou o
automático seguindo a camada ativa, é trocar o interruptor por essa regra.

Pane z 380, logo abaixo da cobertura automática (390), abaixo da área pintada (400) e
abaixo da camada do mar (450), com `interactive: false` pela mesma razão das outras
faixas. A tecla `C` ("só a costa") esconde as duas camadas automáticas.

**Com isto a etapa 7 da lista fecha**: camada de Cobertura, cobertura automática por
latitude e relevo automático planície. A etapa 8 é a **Ferramenta de Rio**.

## Ferramentas de bancada (décima primeira rodada)

Duas coisas que não são do mapa, e sim de como se trabalha nele. Ficam registradas
porque as duas nasceram de defeito repetido, não de gosto.

- **`scripts/conferir_git.py`**: confere `core.hooksPath` e **acrescenta uma linha em
  `lore/mapas/registro-git.jsonl`** a cada conferência (data e hora, valor
  encontrado, valor esperado, se estava certo, e o arquivo de configuração de onde o
  valor veio), inclusive quando está certo. **Nunca conserta nada**: sai com código 1
  se estiver errado, e quem decide é o usuário. Nasceu do `core.hooksPath` voltar
  sozinho para caminho absoluto duas vezes entre rodadas, sem ninguém saber quem
  reescreve: consertar calado apaga a evidência, e só avisar não descobre a causa.
  O passo 1 do `/cartografo` roda isto antes de qualquer trabalho.
- **`scripts/medir_automatico.py`**: bancada do custo da cobertura automática, que
  **acrescenta** cada medição em `dados/medicoes_desempenho.json` em vez de
  substituir. Serve para comparar com o custo real quando a pintura estiver avançada.
  Monta os cenários num arquivo temporário e prova, em teste, que não toca no
  `dados/areas-pintadas.geojson` de verdade.

### Alinhamento das imagens do ChatGPT: o que fica gravado

Regravado em 2026-09-22 com `scripts/alinhar_chatgpt_auto.py --gravar`. **Método**:
classificação de terra/mar por cor, busca de escala e posição **sem rotação**,
maximizando a interseção sobre união das áreas de terra contra `costa_10240.png`
reduzida a uma grade de 128×128. **Resultado**: `chatgpt-1` 70,4%, `chatgpt-2` 70,8%,
`chatgpt-3` 55,3%, `chatgpt-4` 63,7%, todas acima do piso (2× o IoU da costa contra
ela mesma girada 90°). As quatro ficam com `bounds == bounds_automatico`, e a data e
o método estão em `alinhamento_automatico` dentro de cada camada.

Dois defeitos do próprio script, achados ao rodá-lo pela **segunda** vez:

1. `bounds_anterior_a_20260922` era reescrito a cada gravação, e o nome da chave tem
   uma data dentro: na segunda gravação ela passava a guardar valor de outro dia. Essa
   chave agora é histórica e intocável, e o valor de antes da gravação vai para
   `bounds_antes_do_alinhamento`, com a data em que foi substituído.
2. A data do alinhamento era o literal `"2026-09-22"` no código, então toda gravação
   futura mentiria a data. Passa a ser a data em que o script roda.

## Etapa 8 · Ferramenta de Rio (2026-09-22)

Desenhar o traçado com o Geoman em modo `Line`, validar contra a costa **por
segmento**, gravar, apagar, travar, desfazer e refazer. `backend/rios.py`,
`dados/rios.json`, `static/js/rios.js`, e o esquema de `ESPEC-dados.md` sem mudança.

**O que a correção 2 do ESPEC-dados pedia, e como ficou:**

- **Validação por segmento, não por vértice**: o trecho reto entre dois vértices é
  amostrado de pixel em pixel contra `costa_10240.png`. Um clique que "pula" um braço
  de mar é recusado mesmo com os dois vértices em terra. Conferido na tela: um traçado
  de três cliques em terra firme foi recusado com "o trecho 2 passa por cima da água",
  que é exatamente o caso que a validação por vértice deixaria passar.
- **Exceção do último segmento** quando `termina_em.tipo == "mar"`: é o trecho que vai
  de terra até a água, e sem ele nenhum rio chegaria ao mar.
- **Tolerância de foz de 2 km**: o último ponto vale se estiver na água OU a até 2 km
  da costa. Na resolução oficial isso é 1,6 pixel (1,25 km por pixel), então a busca é
  um disco pequeno em volta do ponto; o número vem do ESPEC, não da implementação.
- **Nascente sempre em terra**, e destino conferido: `lago` exige uma área pintada da
  camada `lago` com aquele id, `rio` exige um rio existente, e `mar` não aceita id.

**Decisões que o código precisou e o pedido não fixava:**

1. **A tecla é `I`, não `R`**: `R` já é a régua, e duas ferramentas na mesma tecla
   derrubariam uma delas em silêncio.
2. **Pane própria em z 460**, acima da camada do mar (450). Rio corre em terra, mas a
   foz encosta na água: debaixo do mar ele sumiria justamente na parte que importa. É
   a ordem que o ESPEC já previa, e a nota registrada na nona rodada ("rio e estrada
   vão precisar de pane acima de 450 quando chegarem") fica cumprida.
3. **Validar antes de checar a trava**, como nas áreas: dado inválido é 422 e recusa
   por trava é 409, e os dois não podem se confundir.
4. O painel tem um seletor "termina em" com o campo de destino ao lado, que só aparece
   quando o fim não é o mar. É o mínimo para o vocabulário fechado do ESPEC caber na
   tela sem um modal novo.

**Fora desta etapa, de propósito**: a atração automática de 5 km (é da etapa das
estradas, e a decisão registrada diz que é nossa, no servidor, ao salvar), a largura
por afluentes acumulados (é da rasterização), a edição de vértice de rio já salvo e a
regra de cruzamento entre rios só na confluência.

15 testes novos (`tests/test_rios.py`), com controle negativo em tudo que grava: o
segmento que cruza água, a nascente na água, o rio solto no meio da terra, o tipo de
fim inventado, o lago inexistente, o delta sem rio-mãe, o id repetido, o rio travado
que não se apaga e o cadeado de camada que não escreve no objeto.

### Dois defeitos achados na revisão da etapa 8, antes de entregar

1. **`pm:create` é evento do MAPA, não da ferramenta.** O handler da Área não filtrava
   a forma, então desenhar um rio mandava a `LineString` também para `/api/areas`, que
   recusava com 422 e pintava a faixa vermelha por cima do rio recém-salvo. Os dois
   handlers agora filtram por `evento.shape` (`Polygon` e `Line`). Os dois testes que
   fiz no navegador não pegaram isso porque os dois eram recusas esperadas, e qualquer
   faixa vermelha parecia certa.
2. **`ramo_de` não é "termina em rio".** No esquema ele é o rio-mãe de um BRAÇO DE
   DELTA, que normalmente termina no mar; um afluente termina em rio e tem `ramo_de`
   null. A tela estava amarrando os dois no mesmo campo, o que marcaria todo afluente
   como braço de delta e tornaria o delta de verdade impossível de criar. A tela agora
   manda sempre `ramo_de: null`, e **braço de delta se cria pela API** enquanto não
   houver um campo próprio para ele.

## Etapa 9 · Ferramenta de Estrada (2026-09-22 e 2026-09-23)

Desenhar a via com o Geoman em modo `Line` (a mesma caneta do Rio), atrair ao salvar,
validar contra a costa por segmento, gravar, apagar, travar, desfazer e refazer.
`backend/estradas.py`, `backend/geo.py`, `dados/estradas.json`,
`static/js/estradas.js`, `static/js/geo.js`. O esquema está em `ESPEC-dados.md`
("Etapa 9: como o esquema das vias ficou no código"). O servidor foi escrito em
22/09, logo depois dos commits da etapa 8; a tela, em 23/09.

**Decididas pelo Direcionamento em 2026-09-23** (eram recomendações do Cartógrafo):

1. **Via só em terra, por enquanto.** Registrada como **limitação conhecida**, não
   como regra: ponte, vau e balsa entram numa etapa futura (travessia de rio e rota
   marítima entre as ilhas de Waning).
2. **`lugares` derivado da atração**, e não informado à mão.
3. **Atração antes da checagem de terra**, porque um lugar na costa pode cair sobre a
   borda da água por antialiasing, e a atração corrige antes de a checagem reprovar.

**Decisões de código, sem pedido que as fixasse (recomendações, para derrubar se for
o caso):**

- **Tecla `E`.** Livre: `L` lugar, `A` área, `I` rio, `R` régua, `T` trava, `D` tema,
  `C` costa.
- **Pane da via em z 455**, entre o mar (450) e os rios (460): acima do mar pelo mesmo
  motivo do rio, abaixo do rio porque o rio cruza por cima da via.
- **Tipo escolhido num seletor** (`estrada`/`trilha`) antes de desenhar; o id sai do
  tipo (`estrada-0001`, `trilha-0002`, numeração comum às duas).
- **Com a caneta da via na mão, o marcador de lugar não pega clique** (classe
  `desenhando-estrada` no mapa). Os 5 km da atração são uns 4 pixels em 100% de zoom,
  então o clique que deve grudar cai EM CIMA do marcador, e o marcador o engoliria
  antes do Geoman. Vale também para via e rio já desenhados, senão começar uma via
  numa encruzilhada selecionaria a via existente.
- **A resposta da criação muda de forma**: `POST /api/estradas` devolve
  `{"estradas": coleção, "atracao": relatório}`. GET, DELETE e trava continuam
  devolvendo a coleção pura, que é o que o recarregar do desfazer espera.

**Como a tela mostra que a atração agiu** (pedido do Direcionamento):

- **Relatório do servidor** (`atrair_detalhado`): uma entrada por ponto enviado que
  grudou, com o índice, onde o clique estava, a coordenada do lugar, o id, a distância
  em km e se foi fundido com o anterior. **Não é gravado**; só volta na resposta.
- **Logo depois de criar**: linha tracejada rosa de cada clique até o lugar, com a
  distância num rótulo, e um aviso na barra de baixo ("atração: 2 ponto(s) grudaram
  em..."). Quando nada grudou, o aviso diz isso. Some na próxima seleção ou desenho.
- **Permanente**: halo rosa em volta de todo vértice que está exatamente num lugar da
  lista, numa pane ACIMA dos marcadores (z 610, sem pegar clique). Embaixo do marcador
  (z 600) ele ficaria invisível, porque o vértice está bit a bit na coordenada do lugar.
- **Seção ESTRADAS no painel**: cada via com "passa por: a → b → c", na ordem, e ⚠
  quando está desalinhada (recomendação, ver `ESPEC-dados.md`).

**Haversine com fonte única de cada lado.** `backend/geo.py` no servidor e
`static/js/geo.js` no navegador (saiu de dentro de `regua.js`); a cópia que
`tests/test_haversine.py` mantinha foi apagada, e o teste importa `geo.py`. Como as
duas não podem ser uma só, o teste roda o `geo.js` DE VERDADE no node e compara com o
servidor em 8 pares de pontos (5 km, trecho curto, arco longo, latitude alta cruzando
180°, antípoda, quase antípoda, zero); o controle negativo troca um termo do `geo.js`
e exige divergência. O teste FALHA, e não pula, se o node faltar. As duas funções
ganharam o mesmo `min(1, ...)` antes do `asin` (perto do antípoda o JS dava `NaN`).

**Defeito evitado antes de existir**: com duas ferramentas desenhando `Line`, o
`pm:create` do Rio (que filtrava só pela forma) mandaria toda via também para
`/api/rios`. Os dois handlers agora exigem a PRÓPRIA caneta ativa (`desenhando`). E a
seleção passou a ser exclusiva entre as quatro ferramentas: antes, selecionar uma área
ou um lugar deixava um rio selecionado, e a tecla `T` (que dava prioridade ao rio)
travava o objeto errado.

**Testes**: 25 em `tests/test_estradas.py` (eram 16 no servidor de 22/09), mais 4 novos
em `tests/test_haversine.py`. Controle negativo no que grava: ponto fora do raio não
se move e não entra no relatório, trecho sobre a água, tipo inventado, via que some na
atração, id repetido, via travada, cadeado de camada, relatório que não pode ir para o
disco, rota que recusa com 422 sem gravar, e espaço reservado `/*__X__*/` órfão na
página (um só derruba o bloco de script inteiro).

## Pendências da ferramenta (lista viva)

Cada linha diz o que falta e **em que etapa faz sentido**, para não virar lista de
desejos sem dono. Decisão de quando fazer é do Direcionamento.

- **Ponte, vau e balsa** (limitação conhecida da etapa 9). **Etapa**: própria, futura,
  com campo novo no esquema das vias.
- **Via desalinhada**: hoje só aparece marcada; "ajustar o traçado até o lugar" e
  "ignorar por agora" não existem. **Etapa**: junto com a edição de vértice.
- **Nome da via pela tela** (hoje só pela API, como o delta do rio). **Etapa**: quando
  Rio e Estrada ganharem modal próprio.
- **Atração do braço de delta contra o rio-mãe** (correção 3, segundo item): não
  feita. **Etapa**: a revisão do Rio.
- **Braço de delta pela tela.** Hoje `ramo_de` só se preenche pela API: o painel do
  Rio não tem campo para "braço de delta de", e amarrá-lo ao seletor "termina em"
  marcaria todo afluente como braço de delta (ver "Dois defeitos achados na revisão
  da etapa 8"). **Etapa em que faz sentido**: quando o painel do Rio ganhar um modal
  próprio, como o de Lugar, em vez de controles soltos · o mesmo modal resolve nome,
  destino e `ramo_de` de uma vez. Enquanto isso, delta se cria pela API, e está
  escrito no painel.
- **Pincel de tamanho ajustável** para pintar e apagar área à mão livre (pedido do
  usuário na nona rodada). **Etapa**: depois da 9, junto com a revisão da ferramenta
  de Área, porque mexe no mesmo caminho de gravação.
- **Edição de vértice** de área e de rio já salvos (o `editMode` do Geoman existe e a
  ferramenta não usa). **Etapa**: mesma revisão da Área acima.
- **Cache de identidade de ilha** (processamento pesado, aviso antes). **Etapa**: 10,
  onde ele já está previsto.

## Etapa 10 sem o cache de identidade de ilha · painel de regiões (2026-09-23, noite)

Pedido do usuário: fazer a etapa 10 **sem** o cache de identidade de ilha, que continua
proibido. `backend/regioes.py`, `static/js/regioes.js`, seção REGIÕES do painel,
rótulos no mapa (pane `regioes-rotulos`, z 590, abaixo dos lugares). Esquema de
`ESPEC-dados.md` sem mudança.

**O que existe**: listar as regiões em árvore pelo `pai`; criar (id em slug, nome,
tipo fechado, pai); editar nome, tipo e pai; mover o rótulo arrastando o nome no mapa
ou com "pôr rótulo" + um clique; apagar; e, para cada uma das 17 massas de
`massas.geojson`, um seletor de região (ou "sem região") e um botão "ver" que leva o
mapa ao ponto de referência. Tudo passa por `operacoes.registrar_operacao`
(`chave_lista="regioes"` para `regioes.json`), então desfazer e refazer valem, e o
desfazer de `lugares.js` chama `window.recarregarRegioes`.

**O que ficou fora, porque depende da geometria da ilha**: clicar numa ilha para
saber qual é, a regra dos 100 km e criar massa nova. Quando o cache existir, eles
entram aqui sem mexer no que foi feito.

**Decisões de código, recomendação do Cartógrafo**: apagar região com filhas ou com
massas é recusado com 409 (sem cascata); `pai` que formaria ciclo é recusado; id não
muda depois de criado; **sem cadeado de camada para regiões** (acrescentar mexeria em
`camadas_travadas.json`); o rótulo de região nova nasce no centro da tela. Gravar
`regioes.json` ou `massas.geojson` pela ferramenta regrava o arquivo inteiro com a
indentação do `historico.py`: o primeiro uso muda a formatação do arquivo inteiro no
diff, sem mudar conteúdo.

**Conferido**: 19 testes (`tests/test_regioes.py`), com recusa e arquivo intacto byte
a byte em cada validação; por HTTP no servidor real, só leitura e recusas (409 ao
apagar `mere`, 422 no tipo inventado e na região inexistente, arquivos iguais antes e
depois); no navegador, **só leitura**: a página carrega sem erro no console, a lista
mostra as 6 regiões em árvore, as 17 massas com a região certa no seletor e os 6
rótulos no mapa. **Não conferido**: nenhum clique (criar, editar, arrastar rótulo,
trocar a região de uma massa, desfazer na tela).

## Edição de vértice de área e de rio já salvos (2026-09-23, noite)

Selecionar a área ou o rio, botão **vértices** ou tecla **`V`**: uma cópia do objeto
entra numa pane própria (z 620) com o `pm.enable()` do Geoman (arrastar vértice,
clicar no meio de um lado para criar, clique direito no vértice para apagar).
**Enter** manda a geometria inteira ao servidor; **Esc** descarta a cópia sem gravar.
A tela redesenha do que o servidor devolveu, como na criação.
`static/js/edicao-vertice.js` (comum às duas), `PUT /api/areas/{id}/geometria` e
`PUT /api/rios/{id}/geometria`.

- **Área**: a MESMA regra da criação, agora numa função só (`_recortar_vizinhas`):
  valida, recorta as vizinhas da mesma camada, cede às travadas, e tudo numa operação
  (um desfazer volta a área e as vizinhas juntas). Camada, valor, semente de ruído e
  marca de exemplo ficam.
- **Rio**: a validação INTEIRA da criação (segmento, nascente, foz, destino) com o
  `termina_em` e o `ramo_de` que ele já tem. A resposta traz os **dependentes**
  (afluentes que terminam nele e braços de delta que saem dele): a validação deles não
  olha a geometria do rio-mãe, então nada é recusado, mas a foz de um afluente pode
  ter deixado de encostar, e a tela lista quem conferir.
- Objeto travado, ou camada travada, não entra em edição (409 no servidor, aviso na
  tela, botão desligado).
- **Fora**: a "via desalinhada" (ajustar a via até o lugar), que a lista de pendências
  punha junto: o pedido desta rodada foi só área e rio. Vértice de via continua sem
  edição.

**Conferido**: 10 testes novos (6 de área, 4 de rio), com recusa e arquivo intacto
byte a byte. **Na tela, por eventos disparados de dentro da página** (não por clique
da automação, que não é confiável aqui): selecionar a área, `V` abre a edição (196
alças de vértice na alta montanha do White Wall), `Esc` descarta sem gravar (pilha
igual), e `V` + `Enter` grava (pilha de 36 para 37, a área com os mesmos 99 vértices,
semente e marca de exemplo), desfeito em seguida pelo botão desfazer. **Não
conferido**: arrastar, criar ou apagar um vértice de verdade (precisa de mão no
mouse) e a edição de rio na tela (não há rio salvo).

## Pincel de tamanho ajustável (2026-09-23, noite)

Botão **pincel** ou tecla **`P`**, seletor **pintar/apagar** e o **raio em km** (5 a
250 na tela; o servidor aceita de 2 a 400). Camada e valor são os da barra de cima.
Com o pincel na mão, apertar e arrastar pinta; espaço segurado arrasta o mapa; nada
no mapa pega clique (senão apertar sobre uma área a selecionaria). O círculo que segue
o mouse tem o raio na escala do zoom. Ao soltar, o traço vai para
`POST /api/areas/pincel` (`static/js/pincel.js`, `areas.pincelar`), e a tela
redesenha do que voltou.

**Decisões do Cartógrafo (recomendação, para derrubar se for o caso):**

1. **Pintar funde com a área do mesmo valor que o traço toca.** Sem isso, cada
   pincelada seria uma área, e uma floresta pintada em vinte traços viraria vinte
   áreas, vinte sementes de ruído e vinte bordas no meio da floresta. Sobrevive a de
   menor id entre as tocadas, **com a semente dela** (a borda não muda de identidade);
   as outras são absorvidas na mesma operação. Sem nenhuma tocada, nasce `area-NNNN`.
2. Área de outro valor da mesma camada é recortada, e a travada não se toca (o traço
   cede), como na criação. Traço inteiro sobre travada não grava nada.
3. **Apagar** tira o traço de toda área LIVRE da camada; travada fica.
4. O traço é simplificado a 15% do raio antes de tudo. Medido: 30 pinceladas
   sobrepostas numa área só dão 126 vértices no contorno, não milhares.
5. Uma pincelada é uma operação: um desfazer volta a pincelada inteira, inclusive as
   áreas absorvidas.

**Conferido**: 17 testes novos em `tests/test_areas.py`, com recusa e arquivo intacto
byte a byte em cada validação, e o controle negativo da fusão (valor diferente é
recortado, nunca absorvido). Por HTTP, raio fora da faixa dá 422 e o arquivo fica
igual. **Na tela, por eventos disparados de dentro da página**: `P` liga o pincel, um
traço de 10 movimentos em floresta temperada no norte de Syl **fundiu** com a
`exemplo-temperada-syl-norte` (pilha de 36 para 37, geometria maior), e o botão
desfazer voltou o arquivo de áreas **byte a byte** ao de antes. **Não conferido**: a
sensação de pintar com o mouse de verdade (o tamanho do círculo, a fluidez, o espaço
segurado no meio do traço) e o modo apagar na tela.
