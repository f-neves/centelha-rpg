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

  // Zoom fracionário (correção A1, 2026-09-22, rodada noturna): zoomSnap=0 permite
  // qualquer zoom real (não só inteiros), zoomDelta é o passo dos botões próprios
  // (ver "controle-zoom" abaixo) e da roda do mouse, que fica mais suave por
  // consequência do mesmo zoomSnap. zoomControl:false porque o controle +/- nativo
  // do Leaflet (passo fixo de 1 zoom) é substituído pelo campo de porcentagem.
  const DELTA_ZOOM_25PC = Math.log2(1.25); // multiplicativo: cada clique muda ~25%
  const mapa = L.map("mapa", {
    crs: CRSUldun,
    minZoom: 0,
    maxZoom: MAX_ZOOM_MAPA,
    zoomControl: false,
    zoomSnap: 0,
    zoomDelta: DELTA_ZOOM_25PC,
    wheelPxPerZoomLevel: 120,
    attributionControl: false,
    // Sem animação de zoom/pan: é ferramenta de edição de precisão, não mapa
    // público — o usuário posicionando um ponto/polígono não quer transição
    // interpolada entre dois estados, quer o estado final na hora.
    zoomAnimation: false,
    fadeAnimation: false,
    markerZoomAnimation: false,
  });
  mapa.fitBounds(limitesMundo);
  // Piso do zoom = o zoom que mostra o mundo inteiro (correção A1: não é mais um
  // 0 fixo — map.getBoundsZoom devolve o valor certo para o tamanho real do
  // contêiner nesta tela). Teto continua MAX_ZOOM_MAPA = MAX_ZOOM + SOBRE_ZOOM = 9,
  // que já é exatamente 800% (2**(9-6) * 100%) sem precisar de número novo.
  const zoomMinimo = mapa.getBoundsZoom(limitesMundo, false);
  mapa.setMinZoom(zoomMinimo);
  mapa.setMaxBounds(limitesMundo.pad(0.15));

  // Campo de porcentagem (correção A1): 100% = resolução nativa da máscara de
  // 10240px (zoom == MAX_ZOOM). percentual = 100 * 2**(zoom - MAX_ZOOM).
  (function () {
    const campo = document.getElementById("campo-zoom-porcentagem");
    const botaoMais = document.getElementById("zoom-mais");
    const botaoMenos = document.getElementById("zoom-menos");

    function porcentagemDoZoom(zoom) {
      return 100 * Math.pow(2, zoom - MAX_ZOOM);
    }
    function zoomDaPorcentagem(pct) {
      return MAX_ZOOM + Math.log2(pct / 100);
    }
    function atualizarCampo() {
      const pct = porcentagemDoZoom(mapa.getZoom());
      campo.value = (pct >= 100 ? Math.round(pct) : Math.round(pct * 10) / 10) + "%";
    }
    function irParaPorcentagem(pct) {
      const pctMin = porcentagemDoZoom(zoomMinimo);
      const pctMax = porcentagemDoZoom(MAX_ZOOM_MAPA); // 800%
      const pctClampado = Math.min(pctMax, Math.max(pctMin, pct));
      mapa.setZoom(zoomDaPorcentagem(pctClampado));
    }

    mapa.on("zoom zoomend", atualizarCampo);
    atualizarCampo();

    campo.addEventListener("keydown", (evento) => {
      if (evento.key !== "Enter") return;
      const numero = parseFloat(campo.value.replace(",", ".").replace("%", ""));
      if (Number.isFinite(numero)) irParaPorcentagem(numero);
      else atualizarCampo();
      campo.blur();
    });
    campo.addEventListener("blur", atualizarCampo);

    botaoMais.addEventListener("click", () => mapa.zoomIn(DELTA_ZOOM_25PC));
    botaoMenos.addEventListener("click", () => mapa.zoomOut(DELTA_ZOOM_25PC));
  })();

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

  // Leitura de latitude/longitude sob o cursor. Formato pedido pelo usuário
  // (2026-09-22): grau, espaço, vírgula decimal ("36,42° N  72,67° O"); traços
  // quando o cursor sai dos limites REAIS do mundo (não do maxBounds com folga de
  // 15% usado só pra não travar o pan bruscamente na borda).
  const leituraCursor = document.getElementById("leitura-cursor");
  const LEITURA_VAZIA = "--,--°  -   --,--°  -";
  function formatarNumero(v) {
    return Math.abs(v).toFixed(2).replace(".", ",");
  }
  function formatarCoordenada(lat, lon) {
    const dentro = lat >= limites.sul && lat <= limites.norte
      && lon >= limites.oeste && lon <= limites.leste;
    if (!dentro) return LEITURA_VAZIA;
    const ns = lat >= 0 ? "N" : "S";
    const lo = lon >= 0 ? "L" : "O";
    return `${formatarNumero(lat)}° ${ns}  ${formatarNumero(lon)}° ${lo}`;
  }
  mapa.on("mousemove", (evento) => {
    leituraCursor.textContent = formatarCoordenada(evento.latlng.lat, evento.latlng.lng);
  });
  mapa.on("mouseout", () => {
    leituraCursor.textContent = LEITURA_VAZIA;
  });
  leituraCursor.textContent = LEITURA_VAZIA;

  // Minimapa próprio (static/js/minimapa.js).
  iniciarMinimapa(mapa, limites);

  // Camadas de referência (etapa 2, static/js/camadas-referencia.js) — inclui as
  // imagens do ChatGPT, Rótulos e Ocean Deep, as duas últimas como tiles (mesma
  // CRS/bounds da costa, sem alinhamento próprio). Opções de tile repassadas uma
  // vez aqui pra não duplicar TILE_SIZE/MAX_ZOOM/limitesMundo dentro do outro
  // arquivo.
  iniciarCamadasReferencia(mapa, CAMADAS_REFERENCIA_INICIAL, {
    tileSize: TILE_SIZE,
    maxZoomMapa: MAX_ZOOM_MAPA,
    maxNativeZoom: MAX_ZOOM,
    bounds: limitesMundo,
  });

  // Ferramenta de Lugar (etapa 3 / B2, static/js/lugares.js).
  iniciarFerramentaDeLugar(mapa, LUGARES_INICIAL);

  // Régua + grade de lat/lon (etapa 4 / B3, static/js/regua.js).
  iniciarRegua(mapa, PARAMETROS_LEAFLET.raio_km);
  iniciarGradeLatLon(mapa, limites);
})();
