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

  // Zoom por lista de NÍVEIS fixos (correção de 2026-09-23, substitui o passo
  // fixo de ~25% da correção A1 anterior): os botões +/- e a roda do mouse vão
  // pro nível mais próximo NA DIREÇÃO do clique/rolagem, não um multiplicador.
  // O campo de porcentagem continua aceitando qualquer valor digitado (não
  // precisa ser um nível da lista). Mínimo 5%, teto 800% (mesmo MAX_ZOOM_MAPA
  // de antes, 2**(9-6)*100%, sem número novo).
  const NIVEIS_ZOOM_PCT = [
    5, 6, 7, 8, 10, 12, 14, 16, 19, 22, 26, 30, 35, 40, 47, 55, 65, 75, 87, 100,
    120, 140, 160, 190, 220, 260, 300, 350, 400, 470, 550, 650, 800,
  ];
  function porcentagemDoZoom(zoom) {
    return 100 * Math.pow(2, zoom - MAX_ZOOM);
  }
  function zoomDaPorcentagem(pct) {
    return MAX_ZOOM + Math.log2(pct / 100);
  }
  const ZOOM_MINIMO = zoomDaPorcentagem(NIVEIS_ZOOM_PCT[0]); // 5%
  const ZOOM_MAXIMO = zoomDaPorcentagem(NIVEIS_ZOOM_PCT[NIVEIS_ZOOM_PCT.length - 1]); // 800%, == MAX_ZOOM_MAPA

  // zoomControl:false (o +/- nativo é substituído pelos botões do campo de
  // porcentagem); scrollWheelZoom:false (a rolagem é tratada à mão abaixo, pra
  // andar pelos NÍVEIS em vez do passo contínuo padrão do Leaflet).
  const mapa = L.map("mapa", {
    crs: CRSUldun,
    minZoom: ZOOM_MINIMO,
    maxZoom: ZOOM_MAXIMO,
    zoomControl: false,
    zoomSnap: 0,
    scrollWheelZoom: false,
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

  // Campo de porcentagem + navegação por nível: 100% = resolução nativa da
  // máscara de 10240px (zoom == MAX_ZOOM).
  (function () {
    const campo = document.getElementById("campo-zoom-porcentagem");
    const botaoMais = document.getElementById("zoom-mais");
    const botaoMenos = document.getElementById("zoom-menos");

    function atualizarCampo() {
      const pct = porcentagemDoZoom(mapa.getZoom());
      campo.value = (pct >= 100 ? Math.round(pct) : Math.round(pct * 10) / 10) + "%";
    }
    function irParaPorcentagem(pct) {
      const pctClampado = Math.min(NIVEIS_ZOOM_PCT[NIVEIS_ZOOM_PCT.length - 1], Math.max(NIVEIS_ZOOM_PCT[0], pct));
      mapa.setZoom(zoomDaPorcentagem(pctClampado));
    }
    // Próximo nível da lista na direção pedida (+1 sobe, -1 desce) a partir da
    // porcentagem ATUAL (não precisa ser ela mesma um nível -- entrar por
    // digitação livre e depois usar +/- vai pro nível mais próximo dali).
    function proximoNivel(pctAtual, direcao) {
      const EPSILON = 0.01;
      if (direcao > 0) {
        const acima = NIVEIS_ZOOM_PCT.find((n) => n > pctAtual + EPSILON);
        return acima !== undefined ? acima : NIVEIS_ZOOM_PCT[NIVEIS_ZOOM_PCT.length - 1];
      }
      for (let i = NIVEIS_ZOOM_PCT.length - 1; i >= 0; i--) {
        if (NIVEIS_ZOOM_PCT[i] < pctAtual - EPSILON) return NIVEIS_ZOOM_PCT[i];
      }
      return NIVEIS_ZOOM_PCT[0];
    }
    function irParaProximoNivel(direcao, pontoAncora) {
      const novoPct = proximoNivel(porcentagemDoZoom(mapa.getZoom()), direcao);
      const novoZoom = zoomDaPorcentagem(novoPct);
      if (pontoAncora) mapa.setZoomAround(pontoAncora, novoZoom);
      else mapa.setZoom(novoZoom);
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

    botaoMais.addEventListener("click", () => irParaProximoNivel(1));
    botaoMenos.addEventListener("click", () => irParaProximoNivel(-1));

    // Roda do mouse: mesmo salto por nível, ancorado no ponteiro (como o
    // scrollWheelZoom nativo do Leaflet fazia, só que por nível fixo em vez de
    // passo contínuo).
    mapa.getContainer().addEventListener(
      "wheel",
      (evento) => {
        evento.preventDefault();
        const direcao = evento.deltaY < 0 ? 1 : -1;
        const pontoMouse = mapa.mouseEventToLatLng(evento);
        irParaProximoNivel(direcao, pontoMouse);
      },
      { passive: false }
    );
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

  // Leitura de latitude/longitude sob o cursor -- desde 2026-09-23 na BARRA
  // INFERIOR, não mais no topo (item 3c). Formato pedido em 2026-09-22: grau,
  // espaço, vírgula decimal ("36,42° N  72,67° O"); traços quando o cursor sai
  // dos limites REAIS do mundo (não do maxBounds com folga de 15% usado só pra
  // não travar o pan bruscamente na borda).
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
  // Terra ou mar sob o cursor (static/js/terra-ou-mar.js): lê o alfa do bloco da
  // costa que o navegador já tem, num canvas oculto, com o resultado guardado
  // por bloco -- nada de máscara de 10240px nem chamada ao servidor por
  // movimento do mouse. Quando um lugar está sob o ponteiro, ele tem prioridade
  // na leitura (é a informação mais específica); fora isso, mostra terra/mar.
  const leitorTerraOuMar = criarLeitorDeTerraOuMar(mapa, {
    zoomNativo: MAX_ZOOM,
    tileSize: TILE_SIZE,
    urlPadrao: "/tiles/costa/{z}/{x}/{y}.png",
  });
  let ultimoLatLng = null;
  function atualizarSobCursor() {
    if (sobCursorTravadoPorLugar()) return; // marcador sob o ponteiro manda
    if (!ultimoLatLng) { mostrarSobCursor(null); return; }
    const resposta = leitorTerraOuMar.ler(ultimoLatLng);
    mostrarSobCursor(resposta === null ? "lendo a costa..." : resposta);
  }
  // Quando um bloco novo termina de carregar, a leitura pendente vira resposta.
  leitorTerraOuMar.aoCarregar(atualizarSobCursor);

  mapa.on("mousemove", (evento) => {
    ultimoLatLng = evento.latlng;
    leituraCursor.textContent = formatarCoordenada(evento.latlng.lat, evento.latlng.lng);
    atualizarSobCursor();
  });
  mapa.on("mouseout", () => {
    ultimoLatLng = null;
    leituraCursor.textContent = LEITURA_VAZIA;
    mostrarSobCursor(null);
  });
  leituraCursor.textContent = LEITURA_VAZIA;

  // Minimapa próprio (static/js/minimapa.js).
  iniciarMinimapa(mapa, limites);

  // Camadas de referência (etapa 2, static/js/camadas-referencia.js) — inclui as
  // imagens do ChatGPT, Rótulos e Ocean Deep, as duas últimas como tiles (mesma
  // CRS/bounds da costa, sem alinhamento próprio). Opções de tile repassadas uma
  // vez aqui pra não duplicar TILE_SIZE/MAX_ZOOM/limitesMundo dentro do outro
  // arquivo.
  const camadasReferencia = iniciarCamadasReferencia(mapa, CAMADAS_REFERENCIA_INICIAL, {
    tileSize: TILE_SIZE,
    maxZoomMapa: MAX_ZOOM_MAPA,
    maxNativeZoom: MAX_ZOOM,
    bounds: limitesMundo,
  });

  // Ferramenta de Lugar (etapa 3 / B2, static/js/lugares.js) -- com as travas
  // (2026-09-23, item 1): o estado do cadeado de camada vem injetado junto.
  const ferramentaDeLugar = iniciarFerramentaDeLugar(mapa, LUGARES_INICIAL, TRAVAS_INICIAL);

  // Régua + grade de lat/lon (etapa 4 / B3, static/js/regua.js).
  iniciarRegua(mapa, PARAMETROS_LEAFLET.raio_km);
  iniciarGradeLatLon(mapa, limites);

  // Interface geral: atalhos, ajuda, barra inferior, seções que abrem/fecham
  // (static/js/interface.js) -- por último, porque registra o que as
  // ferramentas acima expuseram.
  iniciarInterface(mapa, {
    opacidadeCamadaAtiva: {
      subir: () => camadasReferencia.mudarOpacidadeDaAtiva(0.1),
      descer: () => camadasReferencia.mudarOpacidadeDaAtiva(-0.1),
    },
    alternarTravaDoSelecionado: ferramentaDeLugar.alternarTravaDoSelecionado,
  });
})();
