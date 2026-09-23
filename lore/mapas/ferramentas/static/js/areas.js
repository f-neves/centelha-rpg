// Ferramenta de Área (etapa B4, 2026-09-23): relevo, cobertura e lago.
//
// O desenho do polígono é do Leaflet-Geoman free 2.20.0 (MIT, baixado pronto em
// static/vendor/, sem npm e sem CDN). O que é NOSSO e não do plugin: o recorte
// (shapely, no servidor), a gravação, o desfazer/refazer e a trava -- o Geoman
// entra só como a caneta.
//
// Contrato com os outros arquivos (mesma convenção de funções globais):
//   iniciarFerramentaDeArea(mapa, areasIniciais, travasIniciais) ->
//     { alternarTravaDoSelecionado, temSelecao, recarregar }

const VALORES_POR_CAMADA_AREA = {
  relevo: ["planicie", "colina", "montanha", "alta-montanha"],
  cobertura: [
    "floresta-temperada", "floresta-tropical", "floresta-boreal", "selva",
    "campo", "deserto", "pantano", "tundra", "geleira",
  ],
  lago: ["lago"],
};

// Cores só de EDIÇÃO (não são as cores do mapa final, que saem do gerador com
// ruído de borda): o que elas precisam é deixar as camadas distinguíveis
// enquanto se pinta.
const COR_POR_VALOR = {
  planicie: "#9ccc65", colina: "#c0a35e", montanha: "#8d6e63", "alta-montanha": "#cfd8dc",
  "floresta-temperada": "#2e7d32", "floresta-tropical": "#00695c", "floresta-boreal": "#1b5e20",
  selva: "#004d40", campo: "#c5e1a5", deserto: "#e6d18a", pantano: "#6d8f6d",
  tundra: "#b0bec5", geleira: "#e1f5fe", lago: "#4fc3f7",
};

function iniciarFerramentaDeArea(mapa, areasIniciais, travasIniciais, coberturaAutomaticaInicial) {
  // Cobertura automática por latitude: pane PRÓPRIA, abaixo das áreas pintadas
  // (overlayPane, z 400) e abaixo da camada do mar (z 450, que recorta pela costa).
  // `interactive: false` porque estas faixas cobrem o mundo inteiro: interativas,
  // elas engoliriam todo clique destinado ao que está embaixo ou ao mapa.
  mapa.createPane("cobertura-automatica");
  mapa.getPane("cobertura-automatica").style.zIndex = 390;
  const camadaAutomatica = L.geoJSON(null, {
    pane: "cobertura-automatica",
    interactive: false,
    style: (feature) => ({
      color: COR_POR_VALOR[feature.properties.valor] || "#888",
      weight: 0,
      fillColor: COR_POR_VALOR[feature.properties.valor] || "#888",
      fillOpacity: 0.35,
    }),
  }).addTo(mapa);

  // Relevo automático (planície): mesma máquina, pane logo abaixo da cobertura, e
  // DESLIGADO por padrão. Planície é um valor só sobre toda a terra sem pintura, então
  // ligado ele cobre as faixas de cobertura com uma cor chapada; como interruptor, ele
  // responde à pergunta útil, "onde ainda não pintei relevo".
  mapa.createPane("relevo-automatico");
  mapa.getPane("relevo-automatico").style.zIndex = 380;
  const camadaRelevoAutomatico = L.geoJSON(null, {
    pane: "relevo-automatico",
    interactive: false,
    style: (feature) => ({
      color: COR_POR_VALOR[feature.properties.valor] || "#888",
      weight: 0,
      fillColor: COR_POR_VALOR[feature.properties.valor] || "#888",
      fillOpacity: 0.35,
    }),
  });

  const camadaDesenho = L.geoJSON(null, { style: estiloDaArea, onEachFeature: ligarFeature }).addTo(mapa);
  let featuresAtuais = [];
  let idSelecionada = null;
  let travasPorCamada = {};
  let desenhando = false;

  const seletorCamada = document.getElementById("seletor-camada");
  const seletorValor = document.getElementById("seletor-valor");
  const botaoDesenhar = document.getElementById("area-desenhar");
  const botaoApagar = document.getElementById("area-apagar");
  const botaoTravaCamada = document.getElementById("trava-camada-areas");
  const leitura = document.getElementById("area-leitura");

  function camadaAtiva() { return seletorCamada.value; }
  function camadaAtivaTravada() { return Boolean(travasPorCamada[camadaAtiva()]); }
  function estaTravada(feature) {
    return Boolean(travasPorCamada[feature.properties.camada]) || Boolean(feature.properties.travado);
  }

  // --- API ------------------------------------------------------------------
  async function chamar(metodo, caminho, corpo) {
    if (metodo !== "GET") mostrarSalvando();
    let resp;
    try {
      resp = await fetch(caminho, {
        method: metodo,
        headers: corpo ? { "Content-Type": "application/json" } : undefined,
        body: corpo ? JSON.stringify(corpo) : undefined,
      });
    } catch (e) {
      if (metodo !== "GET") mostrarErroDeGravacao("o servidor não respondeu");
      return { erro: "o servidor não respondeu" };
    }
    const dados = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const mensagem = dados.detail || `erro ${resp.status}`;
      if (resp.status === 409) { mostrarAviso(mensagem); return { erro: mensagem, travado: true }; }
      if (metodo !== "GET") mostrarErroDeGravacao(mensagem);
      return { erro: mensagem };
    }
    if (metodo !== "GET") mostrarSalvo();
    return { dados };
  }

  // --- Desenho na tela ------------------------------------------------------
  function estiloDaArea(feature) {
    const p = feature.properties;
    const cor = COR_POR_VALOR[p.valor] || "#888";
    const selecionada = p.id === idSelecionada;
    return {
      color: selecionada ? "#ffb300" : cor,
      weight: selecionada ? 3 : 1,
      // Travada com traço interrompido: a indicação discreta do item 1e para
      // uma área (um cadeado no meio de um polígono não teria onde morar).
      dashArray: estaTravada(feature) ? "5 4" : null,
      fillColor: cor,
      fillOpacity: p.camada === "lago" ? 0.55 : 0.35,
    };
  }

  function ligarFeature(feature, camada) {
    camada.on("click", (evento) => {
      L.DomEvent.stopPropagation(evento);
      selecionar(feature.properties.id);
    });
    camada.on("mouseover", () => travarSobCursor(
      `${feature.properties.valor} (${feature.properties.camada})${estaTravada(feature) ? " 🔒 travada" : ""}`
    ));
    camada.on("mouseout", () => destravarSobCursor());
  }

  function redesenharTudo(colecao, opcoes) {
    featuresAtuais = colecao.features || [];
    camadaDesenho.clearLayers();
    if (featuresAtuais.length) camadaDesenho.addData(colecao);
    atualizarLeitura();
    // O automático vem do servidor JÁ DESCONTADO do que está pintado, então toda vez
    // que o pintado muda (criar, apagar, desfazer, refazer) ele precisa ser refeito.
    // Como todo caminho que muda área passa por aqui, basta este ponto.
    if (!opcoes || opcoes.refazerAutomatica !== false) recarregarAutomatica();
  }

  function desenharAutomatica(colecao) {
    camadaAutomatica.clearLayers();
    if (colecao && (colecao.features || []).length) camadaAutomatica.addData(colecao);
  }

  async function recarregarAutomatica() {
    const r = await chamar("GET", "/api/cobertura-automatica");
    if (r.dados) desenharAutomatica(r.dados);
    await recarregarRelevoAutomatico();
  }

  const caixaRelevoAutomatico = document.getElementById("mostrar-relevo-automatico");
  async function recarregarRelevoAutomatico() {
    if (!caixaRelevoAutomatico || !caixaRelevoAutomatico.checked) {
      camadaRelevoAutomatico.clearLayers();
      mapa.removeLayer(camadaRelevoAutomatico);
      return;
    }
    const r = await chamar("GET", "/api/relevo-automatico");
    if (!r.dados) return;
    camadaRelevoAutomatico.clearLayers();
    if ((r.dados.features || []).length) camadaRelevoAutomatico.addData(r.dados);
    camadaRelevoAutomatico.addTo(mapa);
  }
  if (caixaRelevoAutomatico) {
    caixaRelevoAutomatico.addEventListener("change", recarregarRelevoAutomatico);
  }

  // Seleção de área e seleção de lugar são MUTUAMENTE EXCLUSIVAS. Sem isso a
  // tecla T ficaria presa na última área clicada para sempre (a seleção de área
  // nunca se limparia sozinha), e nenhum lugar voltaria a travar pelo teclado.
  function selecionar(id) {
    idSelecionada = idSelecionada === id ? null : id;
    if (idSelecionada !== null && typeof window.limparSelecaoDeLugar === "function") {
      window.limparSelecaoDeLugar();
    }
    camadaDesenho.setStyle(estiloDaArea);
    atualizarLeitura();
  }
  function limparSelecao() {
    if (idSelecionada === null) return;
    idSelecionada = null;
    camadaDesenho.setStyle(estiloDaArea);
    atualizarLeitura();
  }
  window.limparSelecaoDeArea = limparSelecao;
  // Clique no fundo do mapa desmarca (o clique no polígono não chega aqui: o
  // handler da feature para a propagação).
  mapa.on("click", () => { if (!desenhando) limparSelecao(); });

  function atualizarLeitura() {
    const feature = featuresAtuais.find((f) => f.properties.id === idSelecionada);
    botaoApagar.disabled = !feature || estaTravada(feature);
    leitura.textContent = feature
      ? `${feature.properties.valor} · ${feature.properties.camada}${estaTravada(feature) ? " · travada" : ""}`
      : `${featuresAtuais.length} área(s)`;
  }

  // --- Seletor de valor por camada ------------------------------------------
  function preencherValores() {
    const valores = VALORES_POR_CAMADA_AREA[camadaAtiva()] || [];
    seletorValor.innerHTML = "";
    for (const v of valores) {
      const opcao = document.createElement("option");
      opcao.value = v;
      opcao.textContent = v.replace(/-/g, " ");
      seletorValor.appendChild(opcao);
    }
    atualizarBotaoTravaCamada();
  }
  seletorCamada.addEventListener("change", preencherValores);

  // --- Trava ----------------------------------------------------------------
  function aplicarTravas(docTravas) {
    travasPorCamada = {};
    for (const c of docTravas.camadas || []) travasPorCamada[c.id] = Boolean(c.travada);
    atualizarBotaoTravaCamada();
    camadaDesenho.setStyle(estiloDaArea);
    atualizarLeitura();
  }
  function atualizarBotaoTravaCamada() {
    if (!botaoTravaCamada) return;
    const travada = camadaAtivaTravada();
    botaoTravaCamada.textContent = travada ? `🔒 ${camadaAtiva()} travada` : `🔓 ${camadaAtiva()} livre`;
    botaoTravaCamada.classList.toggle("ativo", travada);
  }
  botaoTravaCamada.addEventListener("click", async () => {
    const r = await chamar("POST", `/api/travas/${camadaAtiva()}`, { travada: !camadaAtivaTravada() });
    if (r.erro) return;
    aplicarTravas(r.dados);
    atualizarBotoesPilhaSeExistir();
  });

  async function alternarTravaDoSelecionado() {
    const feature = featuresAtuais.find((f) => f.properties.id === idSelecionada);
    if (!feature) return false;
    const r = await chamar("POST", `/api/areas/${encodeURIComponent(feature.properties.id)}/trava`, {
      travado: !feature.properties.travado,
    });
    if (r.erro) return true; // houve seleção: a tecla foi tratada aqui
    redesenharTudo(r.dados);
    mostrarAviso(feature.properties.travado ? "área destravada" : "área travada");
    atualizarBotoesPilhaSeExistir();
    return true;
  }

  // --- Desenhar (Geoman) ----------------------------------------------------
  function idNovo() {
    // Sequencial a partir do que já existe, no formato do ESPEC (area-0042).
    let maior = 0;
    for (const f of featuresAtuais) {
      const m = /^area-(\d+)$/.exec(f.properties.id);
      if (m) maior = Math.max(maior, parseInt(m[1], 10));
    }
    return `area-${String(maior + 1).padStart(4, "0")}`;
  }

  function ativar() {
    if (camadaAtivaTravada()) { mostrarAviso(`a camada '${camadaAtiva()}' está travada`); return; }
    desenhando = true;
    botaoDesenhar.classList.add("ativo");
    mapa.pm.enableDraw("Polygon", { snappable: true, snapDistance: 20, finishOn: "dblclick" });
  }
  function desativar() {
    desenhando = false;
    botaoDesenhar.classList.remove("ativo");
    mapa.pm.disableDraw();
  }
  botaoDesenhar.addEventListener("click", () => {
    if (desenhando) desativar();
    else { desativarTodasAsFerramentas(); ativar(); }
  });
  registrarFerramenta({ nome: "area", tecla: "a", ativar, desativar, estaAtiva: () => desenhando });

  mapa.on("pm:create", async (evento) => {
    // O evento é do MAPA, então ele chega aqui para qualquer forma desenhada,
    // inclusive a linha da ferramenta de Rio. Sem este filtro, desenhar um rio
    // mandaria a LineString também para /api/areas, que a recusaria com 422 e
    // pintaria a faixa vermelha por cima do rio recém-salvo.
    if (evento.shape !== "Polygon") return;
    // O polígono que o Geoman acabou de criar é DESCARTADO: quem manda é o que
    // o servidor devolve depois do recorte (a forma gravada pode ser menor que a
    // desenhada, quando cede a uma área travada). Sem isso, a tela mostraria uma
    // forma que o dado não tem.
    const geojson = evento.layer.toGeoJSON();
    evento.layer.remove();
    desativar();
    const r = await chamar("POST", "/api/areas", {
      id: idNovo(), camada: camadaAtiva(), valor: seletorValor.value, geometria: geojson.geometry,
    });
    if (r.erro) return;
    redesenharTudo(r.dados);
    atualizarBotoesPilhaSeExistir();
  });

  botaoApagar.addEventListener("click", async () => {
    if (!idSelecionada) return;
    const r = await chamar("DELETE", `/api/areas/${encodeURIComponent(idSelecionada)}`);
    if (r.erro) return;
    idSelecionada = null;
    redesenharTudo(r.dados);
    atualizarBotoesPilhaSeExistir();
  });

  // Os botões de desfazer/refazer são da ferramenta de Lugar (foi onde nasceram,
  // em B1) e valem para o log inteiro. `window.` explícito de propósito: a ordem
  // de carga dos <script> não garante que o outro arquivo já rodou.
  function atualizarBotoesPilhaSeExistir() {
    if (typeof window.atualizarBotoesDaPilha === "function") window.atualizarBotoesDaPilha();
  }

  async function recarregar() {
    const t = await chamar("GET", "/api/travas");
    if (t.dados) aplicarTravas(t.dados);
    const r = await chamar("GET", "/api/areas");
    if (r.dados) redesenharTudo(r.dados);
  }

  preencherValores();
  aplicarTravas(travasIniciais || { camadas: [] });
  // O primeiro desenho do automático vem injetado na página, então ele aparece junto
  // com o resto em vez de piscar depois de uma ida ao servidor. `redesenharTudo`
  // abaixo não repete esse pedido (`refazerAutomatica: false`); daí em diante quem
  // manda é o `recarregarAutomatica` que ele dispara a cada mudança de área.
  desenharAutomatica(coberturaAutomaticaInicial);
  redesenharTudo(areasIniciais, { refazerAutomatica: false });
  // Desfazer/refazer é genérico (B1) e pode ter desfeito uma área ou uma trava:
  // lugares.js chama isto depois de cada desfazer/refazer.
  window.recarregarAreas = recarregar;

  return {
    alternarTravaDoSelecionado,
    temSelecao: () => idSelecionada !== null,
    recarregar,
  };
}
