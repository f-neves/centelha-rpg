# Especificação dos dados do mapa de Uldun

Revisão de 2026-09-21 (segunda rodada), incorporando as decisões novas e correções
pedidas pelo usuário sobre a primeira revisão. Ainda é especificação para revisão, não
construção — ver `CARTOGRAFO.md`, seção "Estado atual".

## Princípios gerais

- **Todo dado de posição é GeoJSON, com coordenadas `[longitude, latitude]`** (ordem
  padrão do GeoJSON). Lugares são `Point`, rios e estradas são `LineString`, regiões são
  `Polygon` ou `MultiPolygon`, áreas pintadas são `Polygon`. Isto substitui o formato
  antigo de `lugares.json` (par `latitude`/`longitude` solto) e a mistura anterior de
  `pontos: [{lat, lon}]` em rios/estradas.
- Todo objeto tem um **id curto e permanente**; nome é opcional e pode ser preenchido
  depois.
- **Todo arquivo de dados tem `versao_esquema`** (inteiro, começa em `1`), no nível
  raiz do documento (dentro de `properties`, para os `FeatureCollection`). Serve para a
  ferramenta detectar migração necessária se o esquema mudar no futuro.
- Área pintada (relevo, cobertura, lago, região-sobre-água) é **vetor em GeoJSON**, não
  máscara raster. Rasteriza-se sob demanda, na resolução que a operação pedir.
- **Os polígonos são gravados exatamente como desenhados pelo usuário.** O recorte pela
  costa oficial acontece só na hora de rasterizar (prévia ou final) — o arquivo de dados
  pode ter um traço que avança um pouco sobre o mar, e isso é normal, não é erro.
- **Área nova recorta as áreas antigas da mesma camada ao salvar.** Se o usuário desenha
  uma área de `cobertura` por cima de uma área de `cobertura` já existente, a antiga é
  recortada (shapely `difference`) na hora de salvar, para nenhum ponto de terra acabar
  com duas features da mesma camada sobrepostas. Isso vale só **dentro da mesma
  camada**: uma área de `relevo` nunca corta uma área de `cobertura`, porque são
  independentes (todo pedaço de terra tem os dois ao mesmo tempo).
- **Terra sem relevo pintado é `planície`** (era só a cobertura que tinha automático por
  latitude; agora o relevo também tem um padrão, então todo ponto de terra sempre tem os
  dois definidos, pintados ou por padrão).

## `dados/massas.geojson` — identidade estável das massas de terra

Sem mudança de formato desde a primeira revisão, exceto o vocabulário de `status` (ver
correção 6 abaixo) e o `versao_esquema` novo.

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

`status` é `"atribuida"` ou `"sem_regiao"` — **`"duvidosa"` foi removida do
vocabulário** (correção 6: era a mesma coisa que `"sem_regiao"` com uma nota explicando
o motivo; duas palavras para o mesmo estado só criava caminho pra divergir).

### Correção 6 — validação dos pontos de referência (feita nesta sessão)

Os 17 pontos de `massas.geojson` foram conferidos: cada `[longitude, latitude]`
convertido para pixel pelas fórmulas de `coordenadas.json` e lido contra
`mascaras/costa_10240.png` (leitura de pixel único por ponto, não é a varredura pesada
da regra do CARTOGRAFO). **Os 17 caem em terra** (alfa 255 no pixel correspondente).
Também foram conferidos contra as faixas de latitude por região em `coordenadas.json`
(`faixas_de_latitude_das_regioes`): todos os pontos atribuídos a uma região nomeada
caem dentro da faixa de latitude daquela região, com folga.

**O que essa validação NÃO cobriu:** confirmar que cada ponto está no mesmo componente
conectado (a mesma ilha) que o restante da massa nomeada exige preenchimento por
inundação a partir do ponto — isso é o trabalho da correção 7 (o cache de identidade de
ilha), e cai na regra do CARTOGRAFO sobre processamento pesado (avisar antes de rodar
sobre a máscara inteira). A checagem de latitude/terra acima é um indício forte, não uma
prova de conectividade.

**Achado sobre o exemplo antigo:** a preocupação do usuário ("calin-principal em 25,1°,
abaixo do limite sul de Calin") era sobre o **exemplo ilustrativo** deste documento
(`[-8.83, 25.1]`, um valor inventado para mostrar o formato), não sobre o dado real —
o `calin-principal` de verdade está em `lat=33.96`, dentro da faixa de Calin
(26,17°–43,71°). O exemplo acima já foi trocado pelo dado real, para não repetir a
confusão.

**Ação tomada:** os 9 registros que tinham `status: "duvidosa"` (todos os `amb-*`) agora
têm `status: "sem_regiao"`; a nota explicativa (`"perto de mais de uma regiao nomeada,
decisao do usuario"`) foi mantida. Arquivo já reescrito, sem mudança de id nem de
`nota`.

## `dados/lugares.geojson` — pontos (convertido nesta sessão)

```json
{
  "type": "FeatureCollection",
  "properties": { "versao_esquema": 1 },
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [2.86, 31.50] },
      "properties": {
        "id": "regiao-calin",
        "nome": "Calin",
        "tipo": "regiao",
        "origem": "rótulo em fonte/Mapa Teste1.jpg",
        "capital": false,
        "importancia": null
      }
    }
  ]
}
```

**Conversão feita nesta sessão:** `dados/lugares.json` virou `dados/lugares.geojson`,
mesmos 6 ids, mesmos valores de `nome`/`tipo`/`origem`, coordenadas convertidas de
`{latitude, longitude}` para `[longitude, latitude]`. O `lugares.json` antigo foi
apagado (git mostra como remoção + arquivo novo, não como edição).

### Correção 10 — tipo fechado, capital, importância

- `tipo`: vocabulário fechado — `"cidade"`, `"vila"`, `"fortaleza"`, `"porto"`,
  `"ruina"`, `"marco"`.
- `capital`: booleano. `true` só faz sentido em `tipo: "cidade"`; a ferramenta valida
  isso na hora de salvar (não é erro gravar `false` em qualquer tipo, é erro gravar
  `true` fora de `"cidade"`).
- `importancia`: `"pequena"`, `"media"`, `"grande"` — define o tamanho do símbolo no
  render. Sem valor (`null`) enquanto o usuário não decidir; a ferramenta usa
  `"pequena"` como padrão visual até lá.

**Inconsistência encontrada, não resolvida sozinha:** os 6 registros que já existem em
`lugares.geojson` têm `tipo: "regiao"`, que **não está** no vocabulário fechado acima —
são rótulos de nome de região (Calin, Syl, Mére, Waning, The Neck, The White Wall), não
assentamentos. Isso não é um lugar no sentido do esquema novo. Três caminhos possíveis,
nenhum decidido aqui:
1. Mover os 6 para `regioes.json`, como ponto de rótulo de cada região (`regiao.rotulo`,
   campo novo).
2. Manter `"regiao"` como um sétimo valor do vocabulário fechado de `lugares.geojson`,
   aceitando que "lugar" cobra tanto assentamento quanto rótulo de região.
3. Criar um arquivo separado só para rótulos de texto do mapa (regiões, mares, o que for
   nomeado sem ser assentamento).
Fica como decisão em aberto (ver seção final); os 6 registros continuam com
`tipo: "regiao"` por enquanto, fora do vocabulário fechado, até o usuário escolher.

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
    },
    {
      "type": "Feature",
      "geometry": { "type": "LineString", "coordinates": [[-5.3, 9.85], [-5.35, 9.7]] },
      "properties": {
        "id": "rio-0001-delta-a",
        "nome": null,
        "termina_em": { "tipo": "mar", "id": null },
        "ramo_de": "rio-0001"
      }
    }
  ]
}
```

- **Sem campo de nascente/foz**: são `coordinates[0]` (nascente) e `coordinates[-1]`
  (foz), como antes.
- **Sem largura gravada**: calculada por afluentes acumulados rio abaixo, como antes.
- `termina_em.tipo`: `"mar"`, `"lago"` ou `"rio"` (é afluente de outro rio, e `id` diz
  qual); `termina_em.id` é `null` só quando `tipo` é `"mar"`. Rio "solto" no meio da
  terra é rejeitado ao salvar.

### Correção 8 — remoção de `afluente_de` e adição de delta

- **`afluente_de` foi removido.** Era redundante com `termina_em: {tipo: "rio", id}` —
  as duas informações diziam a mesma coisa (que este rio deságua em outro rio), com
  risco de divergir se só uma fosse atualizada.
- **`ramo_de` é novo**, e é o inverso conceitual: um **delta** é um braço que **sai** de
  um rio perto da foz e termina sozinho no mar (não é afluente, é distributário).
  `ramo_de` é `null` no rio normal, ou o `id` do rio-mãe quando esta feature é um braço
  de delta. O primeiro ponto (`coordinates[0]`) de um delta cai sobre o traçado do
  rio-mãe (não é uma nascente própria); a ferramenta valida essa sobreposição ao salvar,
  com a mesma tolerância da correção 9.
- **Validação de traçado**: todo ponto de `coordinates` de um rio (e de um delta) tem
  que cair em terra — mesma leitura de pixel único contra `costa_10240.png` usada na
  correção 6, feita ponto a ponto conforme o usuário desenha, não é varredura pesada.
  Um rio só pode cruzar outro rio exatamente na confluência (onde um dos dois termina);
  cruzamento no meio do traçado, sem um dos dois terminar ali, é rejeitado ao salvar.

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

- `lugares`: lista completa de ids de `lugares.geojson` por onde a via passa, na ordem
  (permite paradas no meio, não só origem/destino).
- `tipo`: `"estrada"` ou `"trilha"`.

### Correção 9 — validação de alinhamento com os lugares

- **Tolerância definida: 300 metros** (≈ 0,00216° no sistema de `coordenadas.json`,
  1,25 km/px × ~0,24px — arredondado para um valor redondo de fácil leitura, dá margem
  suficiente pro clique não ser pixel-perfeito sem deixar a estrada "flutuar" longe do
  lugar). Ao salvar, a ferramenta mede a distância (haversine) de cada `id` em
  `lugares` até o ponto mais próximo do traçado (`coordinates`); acima de 300m, rejeita
  o salvamento e aponta qual lugar está desalinhado.
- **Se um lugar listado for movido depois** (o usuário arrasta o ponto dele em
  `lugares.geojson` numa sessão futura): a estrada **não é atualizada automaticamente**
  — os dois arquivos são independentes, e mexer no traçado de uma estrada toda vez que
  um ponto se move seria um efeito colateral surpreendente. Em vez disso, ao abrir a
  ferramenta com uma estrada cujo lugar saiu da tolerância de 300m, ela aparece marcada
  como **desalinhada** (mesmo aviso visual das ilhas sem região, mas em cor própria);
  a ferramenta oferece dois botões: "ajustar o traçado até o lugar" (reposiciona só o
  ponto mais próximo do traçado até o novo lugar) ou "ignorar por agora". Isto é
  **recomendação da IA**, não decisão fechada — fica para o usuário confirmar quando a
  etapa 8 (ferramenta de Estrada) for construída.

## `dados/regioes.json` — regiões nomeadas, sobre terra ou sobre água

```json
{
  "type": "FeatureCollection",
  "properties": { "versao_esquema": 1 },
  "features": [
    {
      "type": "Feature",
      "geometry": null,
      "properties": {
        "id": "waning",
        "nome": "Waning",
        "tipo": "arquipelago",
        "pai": null,
        "massas": ["mere-principal", "syl-principal", "calin-principal"]
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[[0, 0], [0.1, 0], [0.1, 0.1], [0, 0]]] },
      "properties": {
        "id": "mere-norte",
        "nome": null,
        "tipo": "provincia",
        "pai": "mere-regiao",
        "massas": null
      }
    }
  ]
}
```

- Uma região é representada de **uma das duas formas**, nunca as duas: `properties.
  massas` (lista de ids de `massas.geojson`, `geometry: null`) quando a região é uma ou
  mais ilhas inteiras; ou `geometry` (`Polygon`/`MultiPolygon`, `properties.massas:
  null`) quando a região é uma parte de uma ilha ou uma área sobre água sem massa de
  terra pra referenciar.
- **Sem bioma nem clima próprios** — continua em relevo/cobertura das áreas pintadas.
- `pai`: id de outra região, opcional.

### Correção 11 — vocabulário fechado de `tipo`

`"arquipelago"`, `"ilha"`, `"provincia"`, `"reino"`, `"mar"`, `"golfo"`, `"baia"`,
`"estreito"`. Os quatro primeiros são regiões sobre terra (usam `massas` ou `geometry`
conforme o caso); os quatro últimos são sobre água (sempre usam `geometry`, nunca
`massas`, porque não têm massa de terra pra referenciar). Fechado por ora; se uma
campanha precisar de um tipo novo (ex.: um deserto nomeado que não é bem "província"),
é decisão do usuário abrir o vocabulário, não a ferramenta inventar sozinha.

## `dados/areas-pintadas.geojson` — relevo, cobertura e lagos

```json
{
  "type": "FeatureCollection",
  "properties": { "versao_esquema": 1 },
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[[0, 0], [0.1, 0], [0.1, 0.1], [0, 0]]] },
      "properties": {
        "id": "area-0042",
        "camada": "relevo",
        "valor": "colina",
        "semente_ruido": 8821
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[[0, 0], [0.02, 0], [0.02, 0.02], [0, 0]]] },
      "properties": { "id": "lago-0007", "camada": "lago", "valor": "lago", "semente_ruido": 1190 }
    }
  ]
}
```

- `camada`: `"relevo"`, `"cobertura"` ou `"lago"`.
- `valor`: vocabulário fechado (relevo: planície, colina, montanha, alta montanha;
  cobertura: floresta temperada, floresta tropical, floresta boreal, selva, campo,
  deserto, pântano, tundra, geleira).
- `semente_ruido`: inteiro fixo por área.
- **Terra sem `cobertura` pintada usa a automática por latitude** (regra do
  CARTOGRAFO), calculada ao vivo, nunca gravada como feature (decisão antiga, mantida).
- **Terra sem `relevo` pintado é `planície`** (decisão nova, item 4) — diferente da
  cobertura, este não depende de latitude, é um valor fixo único. Também calculado ao
  vivo, nunca gravado como feature, pelo mesmo motivo (uma regra futura de relevo
  padrão não alcançaria terra já "gravada" por engano).
- **Recorte contra área antiga da mesma camada acontece ao salvar** (princípios gerais,
  acima); **recorte contra a costa oficial só acontece ao rasterizar** (decisão 5) — o
  polígono gravado pode avançar sobre o mar, e isso é esperado.

## `dados/fronteiras.json` — reservado, vazio

```json
{ "type": "FeatureCollection", "properties": { "versao_esquema": 1 }, "features": [] }
```

Formato futuro (fronteiras de reino): `Polygon`/`MultiPolygon`, `properties.id`,
`properties.nome`, `properties.reino: null`. Fica como coleção vazia até ter uso.

## `dados/coordenadas.json` — já existe, sem mudança de formato

Sistema de coordenadas e fórmulas de conversão pixel↔lat/lon↔distância real. Ganha
`versao_esquema: 1` dentro do objeto raiz na próxima vez que for editado; não foi
reescrito nesta sessão porque nenhuma outra mudança nele foi pedida.

## Decisões em aberto (novas nesta revisão)

- O que fazer com os 6 registros `tipo: "regiao"` em `lugares.geojson` (ver correção
  10 acima) — mover para `regioes.json`, abrir o vocabulário fechado, ou criar arquivo
  de rótulos separado.
- Vocabulário fechado de `tipo` em `regioes.json` (correção 11) pode precisar crescer;
  hoje cobre só o que já existe no mapa.
