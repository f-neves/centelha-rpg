# Especificação dos dados do mapa de Uldun

Proposta da IA, revisada em 2026-09-21 a partir das correções do usuário. Ainda não é
decisão fechada de formato (o formato pode mudar até a ferramenta ser construída), mas
os PRINCÍPIOS abaixo já foram aprovados: ver `CARTOGRAFO.md`, seção "Decisões tomadas".

## Princípios gerais

- Todo dado de posição é gravado em **latitude/longitude do mundo**, nunca em pixel de
  tela, para o mapa poder crescer além da tela de 10240px sem renumerar nada.
- Área pintada (relevo, cobertura, lago, região-sobre-água) é **vetor em GeoJSON**, não
  máscara raster. Rasteriza-se sob demanda, na resolução que a operação pedir.
- Todo objeto tem um **id curto e permanente**; nome é opcional e pode ser preenchido
  depois.
- Nenhum arquivo abaixo é gerado ainda, exceto `massas.geojson` (gerado nesta sessão
  como parte da verificação, ver abaixo) e `lugares.json` (de uma sessão anterior).

## `dados/massas.geojson` — identidade estável das massas de terra

Cada massa de terra relevante (ilha, arquipélago, continente) recebe um id e um ponto
de referência. A forma da ilha nunca é gravada aqui: ela é sempre consultada na máscara
oficial (`mascaras/costa_10240.png`) a partir do ponto de referência, em tempo de
execução. Isso evita depender de "número do componente conectado", que muda se o
algoritmo de detecção mudar.

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [-8.83, 25.1] },
      "properties": {
        "id": "calin-principal",
        "regiao": "calin",
        "status": "atribuida",
        "nota": ""
      }
    }
  ]
}
```

`coordinates` é `[longitude, latitude]` (ordem padrão do GeoJSON, invertida em relação
à convenção do resto do projeto — atenção ao converter). `status` é `"atribuida"`,
`"duvidosa"` ou `"sem_regiao"`.

Gerado nesta sessão com 17 massas: as ilhas principais e secundárias das 5 regiões
nomeadas, mais a ilha do arquipélago do Neck mais próxima de Calin (usada na distância
corrigida), mais as 9 ilhas marcadas como duvidosas (perto de mais de uma região ao
mesmo tempo). Não cobre as ~470 massas de terra sem nome e sem relevância de momento;
uma massa nova entra no arquivo quando passar a importar (ganhar nome, região ou
conteúdo).

## `dados/lugares.json` — pontos (já existe, sem mudança de formato)

```json
{ "id": "...", "nome": "...", "tipo": "...", "latitude": 0.0, "longitude": 0.0, "origem": "..." }
```

## `dados/rios.json` — cursos d'água

```json
{
  "id": "rio-0001",
  "nome": null,
  "pontos": [ {"lat": 10.2, "lon": -5.1}, {"lat": 9.8, "lon": -5.4}, "..." ],
  "afluente_de": null,
  "termina_em": { "tipo": "mar", "id": null }
}
```

- **Sem campo de nascente/foz**: são `pontos[0]` (nascente) e `pontos[-1]` (foz).
- **Sem largura gravada**: a largura visual é calculada a partir de quantos afluentes
  deságuam rio abaixo (mais afluentes acumulados = rio mais largo perto da foz), não é
  um número editado à mão.
- `termina_em.tipo` é `"mar"`, `"lago"` ou `"rio"` (rio principal, se for afluente);
  `termina_em.id` é o id do lago/rio, ou `null` se for o mar. **A ferramenta valida na
  hora de salvar**: todo rio tem que terminar num desses três destinos, um rio "solto"
  no meio da terra é rejeitado.
- `afluente_de`: id do rio principal, ou `null` se for o próprio rio principal.

## `dados/estradas.json` — vias

```json
{
  "id": "estrada-0001",
  "nome": null,
  "tipo": "estrada",
  "lugares": ["porto-de-calin", "vila-do-vau", "capital-de-calin"],
  "pontos": [ {"lat": 0, "lon": 0}, "..." ]
}
```

- `lugares` é a **lista completa** de lugares por onde a via passa, na ordem (não só
  origem e destino) — permite estradas com paradas no meio.
- `pontos` é o traçado geométrico completo (inclui curvas entre um lugar e outro), como
  nos rios.
- `tipo`: `"estrada"` ou `"trilha"`.

## `dados/regioes.json` — regiões nomeadas, sobre terra ou sobre água

```json
{
  "id": "waning",
  "nome": "Waning",
  "tipo": "arquipelago",
  "pai": null,
  "massas": ["mere-principal", "syl-principal", "calin-principal"],
  "poligono": null
}
```

- Uma região é representada de **uma das duas formas**, nunca as duas ao mesmo tempo:
  - `massas`: lista de ids de `massas.geojson` (uma região = uma ou mais ilhas
    inteiras). É a forma padrão quando a região cobre a ilha toda.
  - `poligono`: lista de pontos lat/lon (uma região = parte de uma ilha, por exemplo
    "metade norte de Mére"). Só é usado quando a região é menor que uma massa inteira.
- **Sem bioma nem clima próprios** — isso já está nas áreas pintadas (relevo/cobertura);
  guardar de novo aqui duplicaria e poderia divergir.
- `pai`: id de outra região, opcional. Ex.: `Calin`, `Syl` e `Mére` têm `pai: "waning"`.
- `tipo`: livre (`"arquipelago"`, `"ilha"`, `"reino"`, `"mar"`, `"golfo"`, `"baia"`,
  `"estreito"`, etc.) — inclui **regiões sobre água** (mares, golfos, baías, estreitos
  nomeados), que usam `poligono` (não têm massa de terra para referenciar).

## `dados/areas-pintadas.geojson` — relevo, cobertura e lagos

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[[lon, lat], "..."]] },
      "properties": {
        "id": "area-0042",
        "camada": "relevo",
        "valor": "colina",
        "semente_ruido": 8821
      }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Polygon", "coordinates": [[[lon, lat], "..."]] },
      "properties": { "id": "lago-0007", "camada": "lago", "valor": "lago" }
    }
  ]
}
```

- `camada`: `"relevo"`, `"cobertura"` ou `"lago"` (lago é tratado como camada própria,
  não como um valor de cobertura, porque é a única exceção que pode mexer na costa
  interna).
- `valor`: um dos vocabulários fechados definidos no CARTOGRAFO (relevo: planície,
  colina, montanha, alta montanha; cobertura: floresta temperada, floresta tropical,
  floresta boreal, selva, campo, deserto, pântano, tundra, geleira).
- `semente_ruido`: inteiro fixo por área, usado para gerar a borda irregular na hora de
  rasterizar; garante que a mesma área sempre rasteriza igual.
- Terra sem nenhuma feature de `camada: "cobertura"` sobrepondo recebe cobertura
  automática por latitude (regra do CARTOGRAFO) na hora de rasterizar; a ferramenta
  nunca grava essa automática como feature, só a calcula ao vivo — se gravasse, uma
  mudança futura na regra de latitude não alcançaria terra já "coberta" por engano.

## `dados/fronteiras.json` — reservado, vazio

```json
[]
```

Formato futuro (quando fronteiras de reino entrarem): `id`, `nome`, `poligono`,
`reino: null`. Fica como array vazio até ter uso.

## `dados/coordenadas.json` — já existe, sem mudança de formato

Sistema de coordenadas e fórmulas de conversão pixel↔lat/lon↔distância real. Ver
`CARTOGRAFO.md`, seção "Sistema de coordenadas".
