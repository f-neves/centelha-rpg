# Especificação dos dados do mapa de Uldun

Revisão de 2026-09-21 (terceira rodada), incorporando a decisão 1 e as correções 2, 3,
4, 7, 8 e 9 pedidas pelo usuário sobre a segunda revisão. As correções 5, 6, 10 e 11
daquela rodada já estão fechadas em código de dados (ver arquivos correspondentes) ou
foram absorvidas nesta. Ainda é especificação para revisão, não construção — ver
`CARTOGRAFO.md`, seção "Estado atual".

## Princípios gerais

- **Todo dado de posição é GeoJSON, com coordenadas `[longitude, latitude]`** (ordem
  padrão do GeoJSON). Lugares são `Point`, rios e estradas são `LineString`, regiões são
  `Polygon`/`MultiPolygon` (ou nenhuma geometria, quando a região é definida por
  massas — ver `regioes.json` abaixo), áreas pintadas são `Polygon` **ou
  `MultiPolygon`** (correção 4, terceira rodada: uma área pode ter mais de um pedaço
  desconexo, por exemplo a mesma cobertura de "floresta boreal" espalhada em duas
  manchas que não se tocam — antes só `Polygon` cobria isso mal, forçando duas features
  com o mesmo `valor` só porque não são um polígono só).
- Todo objeto tem um **id curto e permanente**; nome é opcional e pode ser preenchido
  depois.
- **Todo arquivo de dados tem `versao_esquema`** (inteiro, começa em `1`).
- Área pintada é **vetor em GeoJSON**, não máscara raster. Rasteriza-se sob demanda.
- **Os polígonos são gravados exatamente como desenhados pelo usuário.** Recorte pela
  costa oficial só na hora de rasterizar.
- **Área nova recorta as áreas antigas da mesma camada ao salvar** (shapely
  `difference`), nunca entre camadas diferentes.
- **Terra sem relevo pintado é `planície`**; terra sem cobertura pintada usa a
  automática por latitude. As duas calculadas ao vivo, nunca gravadas como feature.

## Travamento · `travado` e o cadeado por camada (decidido em 2026-09-23)

Para não tirar nada do lugar sem querer. Vale para **todo objeto editável**, não só
para lugar: `lugares.geojson`, `rios.json`, `estradas.json` e
`areas-pintadas.geojson` · definido aqui de uma vez, em vez de por ferramenta, para
que a ferramenta de Área já nasça com isto em vez de receber um retrofit depois.

**1. `travado` no objeto.** Campo booleano nas `properties` de cada feature,
**padrão `false`** (um objeto sem o campo conta como livre; a ferramenta grava o
campo explícito ao criar, para o arquivo ser legível sem consultar o padrão):

```json
{ "properties": { "id": "porto-de-calin", "tipo": "porto", "travado": false } }
```

**2. Cadeado geral por camada** · `dados/camadas_travadas.json`, arquivo próprio:

```json
{
  "versao_esquema": 1,
  "camadas": [
    { "id": "lugares",  "travada": false },
    { "id": "rios",     "travada": false },
    { "id": "estradas", "travada": false },
    { "id": "relevo",   "travada": false },
    { "id": "cobertura","travada": false },
    { "id": "lago",     "travada": false }
  ]
}
```

Vocabulário fechado de `id`: uma camada por tipo de objeto, e **três** para
`areas-pintadas.geojson` (o campo `camada` da feature: relevo, cobertura, lago) ·
por isso o arquivo é separado, e o flag não mora no `properties` de cada coleção.

**3. A trava efetiva é a OU das duas**: `travado do objeto OU travada da camada`. Um
objeto com `travado: false` numa camada travada **está travado**. Isso é o que faz o
pedido "ao destravar a camada, cada objeto volta ao que era" ser verdade sem
restaurar nada: **travar a camada nunca escreve no objeto**, então não há o que
restaurar depois.

**4. O que a trava impede**: mover, apagar e editar o objeto. Travar/destravar o
objeto em si tem caminho próprio (senão nada travado poderia ser destravado), e ele
respeita a trava da camada. **Camada travada também não recebe objeto novo**
(decisão da IA, 2026-09-23: é o que um cadeado de camada significa em qualquer
editor; destravar remove a restrição sem deixar rastro no dado).

**5. Recusar por trava não é erro de dado.** São duas classes diferentes no backend
(`travas.Travado` x `ValueError`) e dois códigos HTTP diferentes (409 x 422), para a
interface poder dar um **aviso discreto** de "está travado" em vez da faixa de erro
de gravação, sem precisar interpretar a mensagem.

**6. Travar e destravar passam pelo desfazer**, as duas · a do objeto como qualquer
edição de feature, a da camada como uma operação sobre
`dados/camadas_travadas.json` (mesmo mecanismo de patch por id já usado pelas
camadas de referência).

## `dados/massas.geojson` — identidade estável das massas de terra

```json
{
  "type": "FeatureCollection",
  "properties": { "versao_esquema": 1 },
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [6.6643, 33.9608] },
      "properties": {
        "id": "calin-principal",
        "regiao": "calin",
        "status": "atribuida",
        "area_px_2048": 81477,
        "nota": ""
      }
    }
  ]
}
```

`status` é `"atribuida"` ou `"sem_regiao"`. `regiao` é o id de uma entrada de
`dados/regioes.json`, ou `null` quando `status` é `"sem_regiao"`.

### Validação dos pontos de referência (segunda rodada, 2026-09-21 — restaurada em
2026-09-23, ver nota de recuperação no fim deste documento)

Os 17 pontos foram conferidos: cada `[longitude, latitude]` convertido para pixel
pelas fórmulas de `coordenadas.json` e lido contra `mascaras/costa_10240.png`
(leitura de pixel único por ponto, não é a varredura pesada da regra do
CARTOGRAFO). **Os 17 caem em terra.** Também foram conferidos contra as faixas de
latitude por região em `coordenadas.json` (`faixas_de_latitude_das_regioes`):
todos os pontos atribuídos a uma região nomeada caem dentro da faixa de latitude
daquela região, com folga.

**O que essa validação NÃO cobre:** confirmar que cada ponto está no mesmo
componente conectado (a mesma ilha) que o restante da massa nomeada exige
preenchimento por inundação a partir do ponto — isso é o trabalho do cache de
identidade de ilha (etapa 10 da ferramenta, ainda não gerado), e cai na regra do
CARTOGRAFO sobre processamento pesado. A checagem de latitude/terra acima é um
indício forte, não uma prova de conectividade.

(O método de leitura do pixel foi corrigido depois desta validação original —
canal de cinza, não alfa sintético — sem mudar a conclusão; ver CARTOGRAFO.md,
"Achados técnicos registrados", para esse achado específico.)

### Correção 9 (terceira rodada) — renomeação `amb-*` → `ilha-*`, feita nesta sessão

Os 9 registros que tinham prefixo `amb-` (de "ambíguo", herdado do tempo em que o
`status` era `"duvidosa"`) agora usam prefixo `ilha-`, mesmo número:
`amb-046→ilha-046`, `amb-084→ilha-084`, `amb-099→ilha-099`, `amb-097→ilha-097`,
`amb-107→ilha-107`, `amb-187→ilha-187`, `amb-192→ilha-192`, `amb-204→ilha-204`,
`amb-218→ilha-218`. Nenhum outro campo mudou. Arquivo já reescrito.

**Padronização de id de região usada em todo o projeto a partir de agora**: slug curto,
minúsculo, com hífen, igual ao valor já usado no campo `regiao` desta massa —
`mere`, `syl`, `calin`, `the-neck`, `white-wall`, mais `waning` (a única região sem
massa própria, pai das três primeiras). É o mesmo formato usado nos ids de
`dados/regioes.json` (ver abaixo) — antes do `regioes.json` existir, o formato só
aparecia aqui; agora os dois arquivos usam o mesmo padrão.

### Correção 7 (terceira rodada) — pertencimento de ilha só aqui

O campo `regiao` desta massa é a **única** fonte de pertencimento de ilha a região.
`dados/regioes.json` não lista mais suas massas (campo `massas` removido de lá) — uma
região descobre suas ilhas filtrando este arquivo por `regiao == id da região`. Antes
(segunda rodada) a informação existia nos dois lugares (a lista `massas` de uma região
E o campo `regiao` de cada massa), podendo divergir se só um fosse editado; agora só
existe aqui.

## `dados/regioes.json` — regiões nomeadas (criado nesta sessão)

```json
{
  "versao_esquema": 1,
  "regioes": [
    {
      "id": "waning",
      "nome": "Waning",
      "tipo": "arquipelago",
      "pai": null,
      "geometria": null,
      "rotulo": { "type": "Point", "coordinates": [6.34, 25.74] }
    },
    {
      "id": "mere",
      "nome": "Mére",
      "tipo": "ilha",
      "pai": "waning",
      "geometria": null,
      "rotulo": { "type": "Point", "coordinates": [15.18, 19.60] }
    }
  ]
}
```

- `geometria`: `null` quando a região é uma ou mais massas inteiras de
  `massas.geojson` (o caso comum); `Polygon`/`MultiPolygon` só quando a região é menor
  que uma massa inteira (ex.: "metade norte de Mére") ou é uma área sobre água sem
  massa pra referenciar (mar, golfo, baía, estreito nomeado). **Sem campo `massas`**
  (correção 7, acima) — quem quiser a lista de ilhas de uma região consulta
  `massas.geojson`.
- `pai`: id de outra região, opcional. Ex.: `Calin`, `Syl`, `Mére` têm `pai: "waning"`.
- **`rotulo`** (decisão 1, terceira rodada, novo campo, opcional): `Point` com a
  posição do nome da região no mapa — o mesmo tipo de dado que já existia solto em
  `lugares.geojson` com `tipo: "regiao"`. Vale também para região sobre água (um "Mar
  de..." também tem um lugar no mapa onde o nome fica escrito).
- **Sem bioma nem clima próprios** — continua em relevo/cobertura das áreas pintadas.
- `tipo`: vocabulário fechado — `"arquipelago"`, `"ilha"`, `"provincia"`, `"reino"`,
  `"mar"`, `"golfo"`, `"baia"`, `"estreito"`. Fechado por ora; abrir é decisão do
  usuário, não da ferramenta.

**Conteúdo criado nesta sessão**: as 6 regiões já nomeadas — `waning` (pai, sem
massa própria), `mere`, `syl`, `calin` (`pai: "waning"`, tipo `"ilha"`, cada uma é a
massa inteira de mesmo nome), `the-neck` e `white-wall` (tipo `"arquipelago"`, cada
uma cobre várias massas de `massas.geojson` com o mesmo valor de `regiao`, sem listar
quais — correção 7). Os 6 `rotulo` vieram dos 6 registros que existiam em
`lugares.geojson` com `tipo: "regiao"` (mesmas coordenadas, convertidas).

## `dados/lugares.geojson` — pontos (esvaziado nesta sessão)

```json
{
  "type": "FeatureCollection",
  "properties": { "versao_esquema": 1 },
  "features": []
}
```

**Decisão 1 (terceira rodada), resolve a inconsistência da segunda rodada**: os 6
registros `tipo: "regiao"` saíram daqui e viraram `rotulo` de cada região em
`regioes.json` (acima). `lugares.geojson` fica vazio, dedicado só a assentamento de
verdade — o vocabulário fechado de `tipo` (`"cidade"`, `"vila"`, `"fortaleza"`,
`"porto"`, `"ruina"`, `"marco"`), `capital` e `importancia`, definidos na segunda
rodada, continuam válidos sem exceção agora que não há mais o caso "rótulo de região"
misturado aqui.

**Esquema de `capital` e `importancia` (decidido na segunda rodada, 2026-09-21;
recuperado em 2026-09-23)**:
- `capital`: booleano. Só pode ser `true` quando `tipo == "cidade"`.
- `travado`: booleano, padrão `false` — ver "Travamento", acima. Vale igual aqui,
  em rios, estradas e áreas pintadas.
- `importancia`: `"pequena"`, `"media"`, `"grande"`, ou `null`. `null` tem o mesmo
  tratamento VISUAL de `"pequena"` na ferramenta (tamanho do marcador) — mas o
  valor gravado no dado pode ficar `null` (lugar ainda não classificado) sem que
  isso force escrever `"pequena"` no arquivo.
- **Correção da história registrada em 2026-09-22, feita em 2026-09-23**: a
  rodada noturna de 2026-09-22 relatou (errado) que este esquema "nunca chegou a
  ser escrito em nenhum commit" — a varredura de `git log -p` só olhou o
  histórico do git, e a decisão de fato nunca entrou em nenhum commit, **mas
  existia sim**, em `lore/mapas/historico/ESPEC-dados-revisao2.md` (a segunda
  revisão completa do ESPEC-dados, guardada pelo usuário FORA do repositório,
  trazida para dentro dele em 2026-09-23). O esquema foi **apagado pela terceira
  reescrita, antes do commit `96e4188`** — uma perda de fato, não uma decisão
  nunca tomada. Corrigido aqui; a regra "reescrita de ESPEC nunca apaga decisão
  registrada sem o usuário decidir" (`CARTOGRAFO.md`, "Regras invioláveis")
  continua valendo, e agora tem o caso real que a motivou.

## `dados/rios.json` — cursos d'água

```json
{
  "type": "FeatureCollection",
  "properties": { "versao_esquema": 1 },
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "LineString", "coordinates": [[-5.1, 10.2], [-5.4, 9.8]] },
      "properties": {
        "id": "rio-0001",
        "nome": null,
        "termina_em": { "tipo": "mar", "id": null },
        "ramo_de": null
      }
    }
  ]
}
```

- `coordinates[0]` é a nascente, `coordinates[-1]` é a foz. Sem largura gravada
  (calculada por afluentes acumulados). `termina_em.tipo`: `"mar"`, `"lago"` ou
  `"rio"`. `ramo_de`: `null`, ou o id do rio-mãe quando esta feature é um braço de
  delta (segunda rodada, sem mudança).

### Correção 2 (terceira rodada) — validação por segmento, tolerância de foz

- **A validação de "fica em terra" passa a checar cada segmento do traçado (o trecho
  reto entre um vértice e o próximo), não só os vértices.** Um segmento que corta um
  pedaço de mar no meio do caminho é rejeitado mesmo que os dois vértices que o formam
  estejam em terra (o caso de um clique "pulando" um istmo estreito por cima da água,
  por exemplo). Tecnicamente: o segmento é amostrado a cada pixel (ou a cada poucos
  pixels, o suficiente pra não pular a espessura de um canal fino) contra
  `costa_10240.png`, não só nos dois extremos.
- **Exceção: o último segmento do rio (o que termina em `termina_em.tipo == "mar"`)
  pode atravessar água.** É o trecho até a foz de verdade — sem essa exceção nenhum rio
  conseguiria terminar no mar, porque o último segmento por definição vai de terra até
  água.
- **Tolerância da foz: o último ponto (`coordinates[-1]`) tem que estar OU dentro da
  água OU a até 2 km da costa mais próxima** (medido por `costa_10240.png`, mesma
  conversão de `coordenadas.json`). Isso dá folga para o usuário não precisar acertar o
  pixel exato da linha da costa — um ponto final um pouco "curto", ainda em terra mas a
  menos de 2 km do mar, é aceito; a rasterização estica visualmente até a costa. Um
  ponto final a mais de 2 km da costa, em terra, é rejeitado (rio "não chegou" ao mar).
- Rio (e delta) "solto" no meio da terra, sem cumprir nenhuma das duas condições acima,
  continua rejeitado ao salvar, como já estava definido.
- Regra de cruzamento entre rios (só na confluência) sem mudança da segunda rodada.

## `dados/estradas.json` — vias

```json
{
  "type": "FeatureCollection",
  "properties": { "versao_esquema": 1 },
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "LineString", "coordinates": [[0, 0], [0.1, 0.05]] },
      "properties": {
        "id": "estrada-0001",
        "nome": null,
        "tipo": "estrada",
        "lugares": ["porto-de-calin", "vila-do-vau", "capital-de-calin"]
      }
    }
  ]
}
```

`lugares`: lista completa de ids de `lugares.geojson` por onde a via passa, na ordem.
`tipo`: `"estrada"` ou `"trilha"`.

### Correção 3 (terceira rodada) — atração automática substitui a tolerância de 300m

A validação por tolerância pós-salvamento da segunda rodada (300m, rejeitar se
ultrapassar) foi **substituída por atração automática durante o desenho** — o problema
de alinhamento deixa de existir por construção, em vez de ser checado depois:

- **Ao desenhar uma estrada, um ponto do traçado a menos de 5 km de um lugar já
  marcado gruda na coordenada exata do lugar** (o clique do usuário é ajustado para a
  posição exata de `lugares.geojson`, não fica "perto"). Depois desse ajuste, a
  validação ao salvar é **exata**: o ponto do traçado onde o lugar está listado em
  `lugares` tem que ser bit a bit igual à coordenada do lugar, não "dentro de uma
  tolerância" — porque a atração já garantiu isso no momento do desenho.
- **O início de um braço de delta gruda no traçado do rio-mãe** pelo mesmo mecanismo:
  ao desenhar um novo rio com `ramo_de` apontando para outro, o primeiro ponto a menos
  de 5 km do traçado do rio-mãe gruda no ponto mais próximo desse traçado (não
  necessariamente um vértice existente — pode ser um ponto novo, interpolado, no meio
  de um segmento do rio-mãe). Depois disso, a validação de sobreposição
  nascente-do-delta/traçado-do-rio-mãe (`ESPEC-dados.md`, seção rios, herdada da
  segunda rodada) também passa a ser exata. **Suposição desta revisão, não confirmada
  pelo usuário**: os 5 km valem para os dois casos (lugar e delta) — o pedido original
  só deu a distância para o caso do lugar; usei o mesmo valor pro delta por
  consistência, mas é para o usuário confirmar ou corrigir quando a etapa 7 (rio) for
  construída.
- **Se um lugar listado for movido depois** (numa sessão futura, arrastando o ponto em
  `lugares.geojson`): a marcação de **"desalinhada"** proposta na segunda rodada
  continua valendo — a estrada não se move sozinha, mas aparece marcada até o usuário
  escolher "ajustar o traçado até o lugar" ou "ignorar por agora". Isto continua sendo
  recomendação da IA, a confirmar na etapa 8.

### Etapa 9 (2026-09-23): como o esquema das vias ficou no código

Implementado em `ferramentas/backend/estradas.py`. O esquema acima vale como está,
com `travado` (padrão `false`) como em todo objeto editável ("Travamento", acima).
Três pontos **decididos pelo Direcionamento em 2026-09-23**, a partir de
recomendações do Cartógrafo:

- **A atração é do servidor, ao salvar**, e não do navegador durante o desenho (a
  correção 3 diz "durante o desenho"; a decisão de ser nossa e em quilômetros, e não
  a do Geoman em pixels, está em `ESPEC-ferramenta.md`, oitava rodada). O efeito para
  o dado é o mesmo: o vértice gravado é bit a bit a coordenada do lugar. Quando mais
  de um lugar está no raio, vence o mais próximo; cliques seguidos que grudam no mesmo
  lugar viram um vértice só.
- **`lugares` é DERIVADO da atração**, nunca informado à mão: é a lista, na ordem do
  traçado, dos lugares em que algum vértice grudou. Uma via sem nenhum lugar no raio
  grava `lugares: []`.
- **A atração roda ANTES da checagem de terra.** Motivo do Direcionamento: um lugar
  na costa pode ter a coordenada sobre a borda da água por antialiasing da máscara, e
  a atração corrige o ponto antes de a checagem reprovar.

**Limitação conhecida, não decisão definitiva: via só em terra.** Todo trecho é
conferido contra a costa, pixel a pixel, como no rio e sem a exceção da foz. Hoje o
esquema não tem **ponte, vau nem balsa**, e eles vão fazer falta: travessia de rio e
rota marítima entre as ilhas de Waning. Entram numa etapa futura, com campo próprio
no esquema; até lá, uma via não atravessa água.

**"Desalinhada"** (a marcação da correção 3 para lugar movido depois): a tela da
etapa 9 já MOSTRA (um ⚠ na lista e no texto da via quando um lugar de `lugares` não
está mais em nenhum vértice), mas não oferece "ajustar o traçado" nem "ignorar", e
nada disso é gravado. Continua recomendação do Cartógrafo, a confirmar.

**Delta**: a atração do início de um braço de delta contra o rio-mãe (segundo item da
correção 3) **não** foi feita nesta etapa; `backend/rios.py` não atrai nada.

## `dados/areas-pintadas.geojson` — relevo, cobertura e lagos

```json
{
  "type": "FeatureCollection",
  "properties": { "versao_esquema": 1 },
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "MultiPolygon",
        "coordinates": [[[[0, 0], [0.1, 0], [0.1, 0.1], [0, 0]]], [[[2, 2], [2.1, 2], [2.1, 2.1], [2, 2]]]]
      },
      "properties": {
        "id": "area-0042",
        "camada": "cobertura",
        "valor": "floresta-boreal",
        "semente_ruido": 8821
      }
    }
  ]
}
```

- `camada`: `"relevo"`, `"cobertura"` ou `"lago"`. `valor`: vocabulário fechado —
  ver `CARTOGRAFO.md`, seção "Técnica", para a lista (relevo: planície, colina,
  montanha, alta montanha; cobertura: floresta temperada, floresta tropical,
  floresta boreal, selva, campo, deserto, pântano, tundra, geleira). Não repetido
  aqui de propósito, para não ter a mesma lista em dois lugares que podem
  divergir — restaurado em 2026-09-23 como ponteiro, não como cópia (a segunda
  revisão do ESPEC-dados tinha a lista escrita aqui também, e ela divergiu do
  CARTOGRAFO nessa rodada por causa disso).
- `semente_ruido`: inteiro fixo por área — o ruído que deixa a borda com aparência
  natural usa essa semente, guardada na própria feature, para a borda sair sempre
  idêntica em qualquer renderização (`CARTOGRAFO.md`, "Decisões tomadas > Técnica").

### Correção 4 (terceira rodada) — `Polygon` e `MultiPolygon`

`geometry.type` pode ser `"Polygon"` **ou `"MultiPolygon"`** — uma única feature (um
`id`, um `valor`, uma `semente_ruido`) pode cobrir vários pedaços de terra desconexos
da mesma camada e do mesmo valor, sem precisar virar duas features separadas. Faz
diferença pro recorte da correção anterior (shapely `difference`, "Princípios gerais"):
a operação de unir/subtrair/apagar trata as duas geometrias igual, shapely suporta as
duas nativamente. `camada`, `valor` e `semente_ruido` sem mudança de vocabulário desde
a segunda rodada.

## `dados/fronteiras.json` — reservado, vazio

```json
{ "type": "FeatureCollection", "properties": { "versao_esquema": 1 }, "features": [] }
```

## `dados/coordenadas.json` — reescrito nesta sessão (correção 8)

```json
{
  "versao_esquema": 1,
  "planeta": { "raio_km": 7963.75, "circunferencia_km": 50037.717, "distancia_polo_a_polo_km": 25018.858 },
  "projecao": { "km_por_px_latitude": 1.25, "km_por_grau": 138.993658, "px_por_grau": 111.194927 },
  "referencia": { "y_equador_px": 7650, "x_meridiano_zero_px": 5120 },
  "limites_da_tela": { "latitude_topo": 68.798, "latitude_base": -23.292, "longitude_esquerda": -46.045, "longitude_direita": 46.045 }
}
```

(Esquema simplificado acima só para leitura; o arquivo de verdade tem também
`formulas`, `_derivacao` e `faixas_de_latitude_das_regioes` — ver o arquivo em si.)

- **`px_por_grau` e `km_por_grau` gravados uma vez, com precisão total, e derivados**:
  `km_por_grau = circunferencia_km / 360` (mundo equirretangular sem correção por
  cos(latitude), grau vale o mesmo em qualquer lugar); `px_por_grau = km_por_grau /
  km_por_px_latitude`. `km_por_px_latitude` (1,25) é o único valor medido diretamente
  (a escala da tela de 10240px contra o mundo); todo o resto deriva dele. Antes
  (segunda rodada e anterior) `111.2`/`139.0` eram números arredondados repetidos em
  três lugares do arquivo (`projecao`, e implicitamente nas fórmulas); agora aparecem
  uma vez, com 6 casas decimais, e as fórmulas citam os campos pelo nome
  (`referencia.y_equador_px`, `projecao.px_por_grau`, etc.) em vez de repetir o número.
- **`limites_da_tela` agora é derivado das fórmulas**, não medido separadamente —
  antes tinha os mesmos 4 números arredondados de forma independente; a diferença de
  arredondamento é mínima (68,79 → 68,798) mas agora existe uma fonte só.
- **`faixas_de_latitude_das_regioes`**: o campo `massa_id`, que era um número interno
  de uma análise antiga (1, 2, 3, 5, 6, 11 — não existia em mais nenhum arquivo), virou
  o id estável de `dados/massas.geojson` (`mere-principal`, `syl-principal`, etc.).
- Arquivo já reescrito nesta sessão; ver `dados/coordenadas.json` para o conteúdo
  completo e comentado.

## Decisões em aberto

- Vocabulário fechado de `tipo` em `regioes.json` pode precisar crescer; hoje cobre só
  o que já existe no mapa.
- Distância de atração de 5km pro início de um braço de delta contra o traçado do
  rio-mãe (correção 3, acima): suposição desta revisão, a confirmar com o usuário.
- Se `Leaflet-Geoman` free cobre cortar/rotacionar/dividir/escalar/snap (não é
  usado pelo recorte de área, que é shapely no servidor, mas pode interessar por outro
  motivo) — ver `ESPEC-ferramenta.md`.

## Nota de recuperação (2026-09-23)

O usuário guardava `lore/mapas/historico/ESPEC-dados-revisao2.md` (a segunda
revisão completa deste documento) FORA do repositório, e trouxe para dentro dele
nesta data depois de perceber que a decisão de `importancia` (`"pequena"/"media"/
"grande"`) tinha sumido. Comparação item por item contra o ESPEC-dados.md atual
encontrou:

- **Perdas de fato, restauradas nesta rodada**: o esquema de `capital`/
  `importancia` (seção `lugares.geojson`, acima) e a validação dos 17 pontos de
  `massas.geojson` (seção `massas.geojson`, acima) — as duas tinham sido escritas
  na segunda revisão e não sobreviveram na reescrita que virou a terceira, antes
  do commit `96e4188`.
- **Mudanças intencionais da terceira revisão, NÃO restauradas** (o usuário deu o
  exemplo desta: atração de 5km substituindo a tolerância de 300m em estradas):
  a estrutura de `regioes.json` (de `FeatureCollection` com `properties.massas`
  para o formato atual sem esse campo, com `rotulo`), a remoção do campo `massas`
  de região (pertencimento de ilha só em `massas.geojson`), a troca de ids
  `amb-*` para `ilha-*`, a validação de rio por segmento (não só vértice), a
  tolerância de foz de 2km, o suporte a `MultiPolygon` em áreas pintadas, e a
  reescrita derivada de `dados/coordenadas.json`. Todas essas aparecem descritas
  como "correção N (terceira rodada)" no corpo deste documento, então já estão
  registradas como decisão posterior, não como perda.
- **Gaps de documentação (não decisão perdida, só prosa reduzida)**: a
  justificativa de por que relevo/cobertura automáticos nunca viram feature
  gravada, e o vocabulário fechado de `valor` em áreas pintadas — os dois existem
  em `CARTOGRAFO.md` mas não eram citados aqui; adicionado um ponteiro (não uma
  cópia, para não criar uma segunda fonte que possa divergir de novo).

## Parte B da empreitada (2026-09-23, noite) · campos e arquivos novos

Recomendação do Cartógrafo, registrada para o usuário revisar.

- **`visivel_jogador`** (booleano, ausente vale `true`) em `lugares.geojson`
  (properties), `regioes.json` (cada região), `rotas.json` (properties),
  `nomes.json` e `elementos.json`. `false` tira o objeto, e o nome dele, da versão do
  jogador de toda exportação. A versão do mestre mostra tudo.
- **`dados/nomes.json`** (B1): só AJUSTES de nomes que moram nos objetos (lugar,
  região, rio, rota: nível, ângulo, curva, "reto", posição do texto, exceto região,
  cuja posição continua no `rotulo`) e NOMES LIVRES (`alvo.tipo` `livre`, ou `area`
  para cordilheira, com `texto` próprio). Esquema completo no cabeçalho de
  `ferramentas/backend/nomes.py`. Um ajuste por alvo.
- **`dados/elementos.json`** (B2): rosa, escala, cartela e monstro, com posição
  (centro, lon/lat), tamanho em px na resolução oficial, texto (cartela), latitude
  em que a escala vale (escala) e `visivel_jogador`. Esquema no cabeçalho de
  `ferramentas/backend/elementos.py`.
- **`dados/exportacoes.jsonl`** (B3): uma linha por exportação, só acrescentada.
  Campos em `ferramentas/cartografia/exportar.py` (`registro`). Nasce na primeira
  exportação.
