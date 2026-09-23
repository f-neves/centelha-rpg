// Ferramenta de Estrada (etapa 9, 2026-09-23).
//
// O desenho é do Geoman free em modo Line, a mesma caneta do Rio. O que é NOSSO, no
// servidor (backend/estradas.py): a atração de 5 km, a lista `lugares` derivada dela,
// a validação por segmento contra a costa, a gravação, o desfazer e a trava.
//
// A linha desenhada é DESCARTADA quando o servidor responde, e a tela redesenha do
// que voltou: o traçado gravado é o ATRAÍDO, que pode ser diferente do desenhado.
//
// Como a tela mostra que a atração agiu:
//   1. Halo em volta de todo vértice que está exatamente sobre um lugar da lista
//      `lugares` da via. Mora numa pane ACIMA dos marcadores (z 610): o vértice
//      atraído fica bit a bit na coordenada do lugar, e embaixo do marcador (z 600)
//      qualquer indicação sumiria.
//   2. Logo depois de criar, uma linha tracejada de cada clique até o lugar em que
//      ele grudou, com a distância, e um aviso na barra de baixo. Some na próxima
//      seleção ou no próximo desenho (o relatório não é gravado; só vem na resposta).
//   3. A lista lateral de vias, cada uma com os lugares por onde passa, na ordem.
//
// Contrato com os outros arquivos (mesma convenção de funções globais):
//   iniciarFerramentaDeEstrada(mapa, estradasIniciais, travasIniciais, lugaresIniciais)
//     -> { alternarTravaDoSelecionado, temSelecao, recarregar }
//   window.aoMudarLugares(colecao)   chamado por lugares.js a cada redesenho
//   window.recarregarEstradas()      chamado pelo desfazer/refazer
//   window.limparSelecaoDeEstrada()  chamado por quem seleciona outra coisa

const COR_ESTRADA = "#d7a15a";
const COR_TRILHA = "#b89a74";
const COR_ESTRADA_SELECIONADA = "#ffb300";
const COR_ATRACAO = "#ff5fa2";

function iniciarFerramentaDeEstrada(mapa, estradasIniciais, travasIniciais, lugaresIniciais) {
  // Pane da via: acima do mar (450), pela mesma razão do Rio (uma via que encosta na
  // costa sumiria debaixo da água), e abaixo dos rios (460), que cruzam por cima.
  mapa.createPane("estradas");
  mapa.getPane("estradas").style.zIndex = 455;
  // Pane da indicação de atração: acima dos marcadores de lugar (600) e sem pegar
  // clique, senão o halo engoliria o clique no próprio lugar.
  mapa.createPane("estradas-atracao");
  mapa.getPane("estradas-atracao").style.zIndex = 610;
  mapa.getPane("estradas-atracao").style.pointerEvents = "none";

  const camadaDesenho = L.geoJSON(null, {
    pane: "estradas",
    style: estiloDaVia,
    onEachFeature: ligarFeature,
  }).addTo(mapa);
  const camadaHalos = L.layerGroup().addTo(mapa);
  const camadaUltimaAtracao = L.layerGroup().addTo(mapa);

  let featuresAtuais = [];
  let lugaresPorId = {};
  let idSelecionado = null;
  let camadaTravada = false;
  let desenhando = false;

  const botaoDesenhar = document.getElementById("estrada-desenhar");
  const botaoApagar = document.getElementById("estrada-apagar");
  const seletorTipo = document.getElementById("estrada-tipo");
  const botaoTravaCamada = document.getElementById("trava-camada-estradas");
  const leitura = document.getElementById("estrada-leitura");
  const lista = document.getElementById("lista-estradas");

  function estaTravado(feature) {
    return camadaTravada || Boolean(feature.properties.travado);
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
      // 409 é recusa por TRAVA (aviso discreto); 422 é dado inválido (faixa vermelha).
      if (resp.status === 409) { mostrarAviso(mensagem); return { erro: mensagem, travado: true }; }
      if (metodo !== "GET") mostrarErroDeGravacao(mensagem);
      return { erro: mensagem };
    }
    if (metodo !== "GET") mostrarSalvo();
    return { dados };
  }

  // --- Lugares (para o halo e para o "desalinhada") --------------------------
  function guardarLugares(colecao) {
    lugaresPorId = {};
    for (const f of (colecao && colecao.features) || []) {
      lugaresPorId[f.properties.id] = f;
    }
  }
  function mesmaCoordenada(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }
  // Um lugar da lista `lugares` que não está mais em NENHUM vértice da via: ele foi
  // movido (ou apagado) depois de a via ser desenhada. A via não se mexe sozinha
  // (ESPEC-dados.md, correção 3); aqui ela só aparece marcada. Recomendação do
  // Cartógrafo, a confirmar: o ESPEC deixa "desalinhada" em aberto.
  function lugaresDesalinhados(feature) {
    const coords = feature.geometry.coordinates;
    return (feature.properties.lugares || []).filter((id) => {
      const lugar = lugaresPorId[id];
      if (!lugar) return true;
      return !coords.some((c) => mesmaCoordenada(c, lugar.geometry.coordinates));
    });
  }
  function nomeDoLugar(id) {
    const lugar = lugaresPorId[id];
    return lugar ? (lugar.properties.nome || id) : `${id} (não existe mais)`;
  }

  // --- Desenho na tela ------------------------------------------------------
  function estiloDaVia(feature) {
    const selecionada = feature.properties.id === idSelecionado;
    const trilha = feature.properties.tipo === "trilha";
    let traco = trilha ? "2 5" : null;
    if (estaTravado(feature)) traco = trilha ? "1 6" : "7 4"; // travado: traço mais aberto
    return {
      color: selecionada ? COR_ESTRADA_SELECIONADA : (trilha ? COR_TRILHA : COR_ESTRADA),
      weight: selecionada ? 5 : (trilha ? 2 : 3),
      dashArray: traco,
      opacity: 0.95,
    };
  }

  function textoDaVia(feature) {
    const p = feature.properties;
    const passa = (p.lugares || []).map(nomeDoLugar).join(" → ") || "nenhum lugar";
    return `${p.nome || p.id} · ${p.tipo} · passa por: ${passa}` +
      `${estaTravado(feature) ? " · 🔒 travada" : ""}` +
      `${lugaresDesalinhados(feature).length ? " · ⚠ desalinhada" : ""}`;
  }

  function ligarFeature(feature, camada) {
    camada.on("click", (evento) => {
      L.DomEvent.stopPropagation(evento);
      selecionar(feature.properties.id);
    });
    camada.on("mouseover", () => travarSobCursor(textoDaVia(feature)));
    camada.on("mouseout", () => destravarSobCursor());
  }

  function redesenharHalos() {
    camadaHalos.clearLayers();
    for (const feature of featuresAtuais) {
      for (const id of feature.properties.lugares || []) {
        const lugar = lugaresPorId[id];
        if (!lugar) continue;
        const [lon, lat] = lugar.geometry.coordinates;
        if (!feature.geometry.coordinates.some((c) => mesmaCoordenada(c, [lon, lat]))) continue;
        // Halo maior que o símbolo do lugar, só contorno: o lugar continua visível
        // por dentro dele.
        L.circleMarker([lat, lon], {
          pane: "estradas-atracao",
          radius: 13,
          color: COR_ATRACAO,
          weight: 2,
          fill: false,
          interactive: false,
        }).addTo(camadaHalos);
      }
    }
  }

  function redesenharTudo(colecao) {
    featuresAtuais = colecao.features || [];
    camadaDesenho.clearLayers();
    if (featuresAtuais.length) camadaDesenho.addData(colecao);
    redesenharHalos();
    redesenharLista();
    atualizarLeitura();
  }

  function redesenharLista() {
    lista.innerHTML = "";
    if (featuresAtuais.length === 0) {
      const vazio = document.createElement("li");
      vazio.className = "nota";
      vazio.textContent = "nenhuma via ainda";
      lista.appendChild(vazio);
      return;
    }
    for (const feature of featuresAtuais) {
      const p = feature.properties;
      const item = document.createElement("li");
      item.className = "item-estrada" + (p.id === idSelecionado ? " selecionado" : "");
      const desalinhados = lugaresDesalinhados(feature);
      const cabeca = document.createElement("div");
      cabeca.className = "cabeca-estrada";
      cabeca.innerHTML = `<span class="nome-lista"></span><span class="tipo-lista"></span>` +
        (estaTravado(feature) ? `<span class="cadeado-lista" title="travada">🔒</span>` : "") +
        (desalinhados.length ? `<span class="aviso-desalinhada" title="um lugar desta via foi movido ou apagado depois do desenho">⚠</span>` : "");
      cabeca.querySelector(".nome-lista").textContent = p.nome || p.id;
      cabeca.querySelector(".tipo-lista").textContent = p.tipo;
      const passa = document.createElement("div");
      passa.className = "lugares-estrada";
      passa.textContent = (p.lugares || []).length
        ? "passa por: " + p.lugares.map(nomeDoLugar).join(" → ")
        : "passa por: nenhum lugar (nada grudou)";
      if (desalinhados.length) {
        passa.textContent += ` · desalinhada em: ${desalinhados.join(", ")}`;
      }
      item.appendChild(cabeca);
      item.appendChild(passa);
      item.addEventListener("click", () => {
        if (idSelecionado !== p.id) selecionar(p.id);
        const camada = camadaDesenho.getLayers().find((c) => c.feature.properties.id === p.id);
        if (camada) mapa.panTo(camada.getBounds().getCenter());
      });
      lista.appendChild(item);
    }
  }

  function selecionar(id) {
    idSelecionado = idSelecionado === id ? null : id;
    camadaUltimaAtracao.clearLayers();
    if (idSelecionado !== null) {
      // T age sobre UM objeto: selecionar uma via desmarca tudo o que não é via.
      if (typeof window.limparSelecaoDeArea === "function") window.limparSelecaoDeArea();
      if (typeof window.limparSelecaoDeLugar === "function") window.limparSelecaoDeLugar();
      if (typeof window.limparSelecaoDeRio === "function") window.limparSelecaoDeRio();
    }
    camadaDesenho.setStyle(estiloDaVia);
    redesenharLista();
    atualizarLeitura();
  }
  function limparSelecao() {
    if (idSelecionado === null) return;
    idSelecionado = null;
    camadaDesenho.setStyle(estiloDaVia);
    redesenharLista();
    atualizarLeitura();
  }
  window.limparSelecaoDeEstrada = limparSelecao;
  mapa.on("click", () => { if (!desenhando) limparSelecao(); });

  function atualizarLeitura() {
    const feature = featuresAtuais.find((f) => f.properties.id === idSelecionado);
    botaoApagar.disabled = !feature || estaTravado(feature);
    leitura.textContent = feature ? textoDaVia(feature) : `${featuresAtuais.length} via(s)`;
  }

  // --- Mostrar a atração que acabou de agir ---------------------------------
  function mostrarUltimaAtracao(relatorio) {
    camadaUltimaAtracao.clearLayers();
    if (!relatorio || relatorio.length === 0) {
      mostrarAviso("a atração não agiu: nenhum ponto a menos de 5 km de um lugar");
      return;
    }
    for (const r of relatorio) {
      const de = [r.de[1], r.de[0]];
      const para = [r.para[1], r.para[0]];
      L.polyline([de, para], {
        pane: "estradas-atracao", color: COR_ATRACAO, weight: 2, dashArray: "3 3", interactive: false,
      }).addTo(camadaUltimaAtracao);
      L.circleMarker(de, {
        pane: "estradas-atracao", radius: 3, color: COR_ATRACAO, weight: 1,
        fillColor: COR_ATRACAO, fillOpacity: 1, interactive: false,
      }).bindTooltip(`${r.km.toFixed(2).replace(".", ",")} km até ${nomeDoLugar(r.lugar)}` +
        `${r.fundido ? " (fundido com o anterior)" : ""}`, { permanent: true, direction: "right", className: "rotulo-atracao" })
        .addTo(camadaUltimaAtracao);
    }
    const grudaram = relatorio.filter((r) => !r.fundido).map((r) => nomeDoLugar(r.lugar));
    const fundidos = relatorio.filter((r) => r.fundido).length;
    mostrarAviso(`atração: ${relatorio.length} ponto(s) grudaram em ${grudaram.join(", ")}` +
      `${fundidos ? ` · ${fundidos} fundido(s)` : ""}`);
  }

  // --- Trava ----------------------------------------------------------------
  function aplicarTravas(docTravas) {
    for (const c of docTravas.camadas || []) {
      if (c.id === "estradas") camadaTravada = Boolean(c.travada);
    }
    botaoTravaCamada.textContent = camadaTravada ? "🔒 estradas travadas" : "🔓 estradas livres";
    botaoTravaCamada.classList.toggle("ativo", camadaTravada);
    camadaDesenho.setStyle(estiloDaVia);
    redesenharLista();
    atualizarLeitura();
  }
  botaoTravaCamada.addEventListener("click", async () => {
    const r = await chamar("POST", "/api/travas/estradas", { travada: !camadaTravada });
    if (r.erro) return;
    aplicarTravas(r.dados);
    atualizarBotoesPilhaSeExistir();
  });

  async function alternarTravaDoSelecionado() {
    const feature = featuresAtuais.find((f) => f.properties.id === idSelecionado);
    if (!feature) return false;
    const r = await chamar("POST", `/api/estradas/${encodeURIComponent(feature.properties.id)}/trava`, {
      travado: !feature.properties.travado,
    });
    if (r.erro) return true; // houve seleção: a tecla foi tratada aqui
    redesenharTudo(r.dados);
    mostrarAviso(feature.properties.travado ? "via destravada" : "via travada");
    atualizarBotoesPilhaSeExistir();
    return true;
  }

  // --- Desenhar (Geoman em modo Line) ---------------------------------------
  function idNovo(tipo) {
    let maior = 0;
    for (const f of featuresAtuais) {
      const m = /^(?:estrada|trilha)-(\d+)$/.exec(f.properties.id);
      if (m) maior = Math.max(maior, parseInt(m[1], 10));
    }
    return `${tipo}-${String(maior + 1).padStart(4, "0")}`;
  }

  function ativar() {
    if (camadaTravada) { mostrarAviso("a camada de estradas está travada"); return; }
    desenhando = true;
    camadaUltimaAtracao.clearLayers();
    botaoDesenhar.classList.add("ativo");
    // Com a caneta da estrada na mão, o marcador de lugar deixa de pegar clique
    // (estilo.css, .desenhando-estrada): a atração é de 5 km, que em 100% de zoom
    // são uns 4 pixels, então "clicar perto do lugar" é clicar EM CIMA do marcador.
    // Sem isto o marcador engoliria o clique e o Geoman nunca receberia o vértice.
    mapa.getContainer().classList.add("desenhando-estrada");
    mapa.pm.enableDraw("Line", { finishOn: "dblclick" });
  }
  function desativar() {
    desenhando = false;
    botaoDesenhar.classList.remove("ativo");
    mapa.getContainer().classList.remove("desenhando-estrada");
    mapa.pm.disableDraw();
  }
  botaoDesenhar.addEventListener("click", () => {
    if (desenhando) desativar();
    else { desativarTodasAsFerramentas(); ativar(); }
  });
  // "e" de estrada: livre (L lugar, A área, I rio, R régua, T trava, D tema, C costa).
  registrarFerramenta({ nome: "estrada", tecla: "e", ativar, desativar, estaAtiva: () => desenhando });

  mapa.on("pm:create", async (evento) => {
    // `pm:create` é do MAPA: o Rio também desenha Line. Quem decide de quem é a
    // linha é a ferramenta que está com a caneta, e não a forma (defeito 1 da
    // revisão da etapa 8, agora entre Rio e Estrada).
    if (evento.shape !== "Line" || !desenhando) return;
    const geojson = evento.layer.toGeoJSON();
    evento.layer.remove();
    desativar();
    const tipo = seletorTipo.value;
    const r = await chamar("POST", "/api/estradas", {
      id: idNovo(tipo),
      geometria: geojson.geometry,
      tipo,
    });
    if (r.erro) return; // a recusa já apareceu; o traçado some, porque não foi gravado
    redesenharTudo(r.dados.estradas);
    mostrarUltimaAtracao(r.dados.atracao);
    atualizarBotoesPilhaSeExistir();
  });

  botaoApagar.addEventListener("click", async () => {
    if (!idSelecionado) return;
    const r = await chamar("DELETE", `/api/estradas/${encodeURIComponent(idSelecionado)}`);
    if (r.erro) return;
    idSelecionado = null;
    redesenharTudo(r.dados);
    atualizarBotoesPilhaSeExistir();
  });

  function atualizarBotoesPilhaSeExistir() {
    if (typeof window.atualizarBotoesDaPilha === "function") window.atualizarBotoesDaPilha();
  }

  async function recarregar() {
    camadaUltimaAtracao.clearLayers();
    const t = await chamar("GET", "/api/travas");
    if (t.dados) aplicarTravas(t.dados);
    const l = await chamar("GET", "/api/lugares");
    if (l.dados) guardarLugares(l.dados);
    const r = await chamar("GET", "/api/estradas");
    if (r.dados) redesenharTudo(r.dados);
  }

  // lugares.js avisa a cada redesenho: um lugar criado, movido ou apagado muda os
  // halos e o "desalinhada" sem precisar de F5.
  window.aoMudarLugares = (colecao) => {
    guardarLugares(colecao);
    redesenharTudo({ features: featuresAtuais });
  };

  guardarLugares(lugaresIniciais);
  aplicarTravas(travasIniciais || { camadas: [] });
  redesenharTudo(estradasIniciais);
  window.recarregarEstradas = recarregar;

  return {
    alternarTravaDoSelecionado,
    temSelecao: () => idSelecionado !== null,
    recarregar,
  };
}
