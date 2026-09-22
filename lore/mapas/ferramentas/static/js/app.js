// Etapa 1: servidor + Leaflet com a costa oficial em tiles, minimapa, zoom, leitura
// de lat/lon sob o cursor, seletor de camada ativa. Sem ferramenta de desenho ainda.

(function () {
  const {
    tile_size: TILE_SIZE,
    max_zoom: MAX_ZOOM,
    max_zoom_mapa: MAX_ZOOM_MAPA,
    limites,
    transformacao,
  } = PARAMETROS_LEAFLET;

  // CRS própria de Uldun: não é a Terra real (raio 1,25x, sem correção por
  // cos(latitude)). A transformação vem pronta do servidor (backend/coordenadas.py),
  // derivada de dados/coordenadas.json — nenhum número de projeção é digitado aqui.
  // Ver ESPEC-ferramenta.md, "Arquitetura".
  const CRSUldun = L.extend({}, L.CRS.Simple, {
    transformation: new L.Transformation(
      transformacao.a, transformacao.b, transformacao.c, transformacao.d
    ),
  });

  const limitesMundo = L.latLngBounds(
    L.latLng(limites.sul, limites.oeste),
    L.latLng(limites.norte, limites.leste)
  );

  const mapa = L.map("mapa", {
    crs: CRSUldun,
    minZoom: 0,
    maxZoom: MAX_ZOOM_MAPA,
    zoomControl: true,
    attributionControl: false,
    // Sem animação de zoom/pan: é ferramenta de edição de precisão, não mapa
    // público — o usuário posicionando um ponto/polígono não quer transição
    // interpolada entre dois estados, quer o estado final na hora.
    zoomAnimation: false,
    fadeAnimation: false,
    markerZoomAnimation: false,
  });
  mapa.fitBounds(limitesMundo);
  mapa.setMaxBounds(limitesMundo.pad(0.15));

  // Costa oficial em tiles (gerados por scripts/gerar_tiles.py — pode ainda não
  // existir nesta sessão; tile faltando só aparece em branco, não quebra a página).
  // maxNativeZoom = resolução nativa de 10240px (nenhum tile existe além disso); o
  // Leaflet estica o tile de MAX_ZOOM sozinho até MAX_ZOOM_MAPA, sem pedir arquivo
  // que o script nunca gerou.
  L.tileLayer("/tiles/costa/{z}/{x}/{y}.png", {
    tileSize: TILE_SIZE,
    minZoom: 0,
    maxZoom: MAX_ZOOM_MAPA,
    maxNativeZoom: MAX_ZOOM,
    noWrap: true,
    bounds: limitesMundo,
  }).addTo(mapa);

  // Leitura de latitude/longitude sob o cursor.
  const leituraCursor = document.getElementById("leitura-cursor");
  function formatarCoordenada(lat, lon) {
    const ns = lat >= 0 ? "N" : "S";
    const lo = lon >= 0 ? "L" : "O";
    return `lat ${Math.abs(lat).toFixed(2)}${ns} lon ${Math.abs(lon).toFixed(2)}${lo}`;
  }
  mapa.on("mousemove", (evento) => {
    leituraCursor.textContent = formatarCoordenada(evento.latlng.lat, evento.latlng.lng);
  });
  mapa.on("mouseout", () => {
    leituraCursor.textContent = "lat -- lon --";
  });

  // Minimapa próprio (static/js/minimapa.js).
  iniciarMinimapa(mapa, limites);

  // Camadas de referência (etapa 2, static/js/camadas-referencia.js).
  iniciarCamadasReferencia(mapa, CAMADAS_REFERENCIA_INICIAL);
})();
