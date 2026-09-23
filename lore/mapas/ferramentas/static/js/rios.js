// Ferramenta de Rio (etapa 8, 2026-09-22).
//
// O desenho da linha é do Geoman free (a mesma caneta da Área, agora em modo Line).
// O que é NOSSO: a validação por segmento contra a costa, a tolerância de foz, a
// gravação, o desfazer e a trava -- tudo no servidor (backend/rios.py).
//
// A linha desenhada é DESCARTADA quando o servidor responde: quem manda é o traçado
// que voltou. Hoje ele volta igual ao desenhado, mas a atração automática de 5 km (a
// decisão registrada, que é nossa e acontece ao salvar) vai mexer nos pontos quando
// as estradas chegarem, e a tela já está pronta para isso.
//
// Contrato com os outros arquivos (mesma convenção de funções globais):
//   iniciarFerramentaDeRio(mapa, riosIniciais, travasIniciais) ->
//     { alternarTravaDoSelecionado, temSelecao, recarregar }

const COR_RIO = "#4fc3f7";
const COR_RIO_SELECIONADO = "#ffb300";

function iniciarFerramentaDeRio(mapa, riosIniciais, travasIniciais) {
  // Pane acima da camada do mar (z 450): rio corre em terra, mas a foz encosta na
  // água, e coberto pelo mar ele sumiria justamente na parte que importa. É a ordem
  // que o ESPEC já previa ("abaixo dos rios/estradas/lugares").
  mapa.createPane("rios");
  mapa.getPane("rios").style.zIndex = 460;

  const camadaDesenho = L.geoJSON(null, {
    pane: "rios",
    style: estiloDoRio,
    onEachFeature: ligarFeature,
  }).addTo(mapa);

  let featuresAtuais = [];
  let idSelecionado = null;
  let camadaTravada = false;
  let desenhando = false;

  const seletorFim = document.getElementById("rio-termina-em");
  const campoDestino = document.getElementById("rio-destino");
  const botaoDesenhar = document.getElementById("rio-desenhar");
  const botaoApagar = document.getElementById("rio-apagar");
  const botaoEditar = document.getElementById("rio-editar");
  const botaoTravaCamada = document.getElementById("trava-camada-rios");
  const leitura = document.getElementById("rio-leitura");

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

  // --- Desenho na tela ------------------------------------------------------
  function estiloDoRio(feature) {
    const selecionado = feature.properties.id === idSelecionado;
    return {
      color: selecionado ? COR_RIO_SELECIONADO : COR_RIO,
      weight: selecionado ? 4 : 2,
      // Travado com traço interrompido, a mesma indicação discreta das áreas.
      dashArray: estaTravado(feature) ? "5 4" : null,
      opacity: 0.95,
    };
  }

  function ligarFeature(feature, camada) {
    camada.on("click", (evento) => {
      L.DomEvent.stopPropagation(evento);
      selecionar(feature.properties.id);
    });
    camada.on("mouseover", () => travarSobCursor(
      `${feature.properties.nome || feature.properties.id} · termina em ${feature.properties.termina_em.tipo}` +
      `${estaTravado(feature) ? " 🔒 travado" : ""}`
    ));
    camada.on("mouseout", () => destravarSobCursor());
  }

  function redesenharTudo(colecao) {
    featuresAtuais = colecao.features || [];
    camadaDesenho.clearLayers();
    if (featuresAtuais.length) camadaDesenho.addData(colecao);
    atualizarLeitura();
  }

  function selecionar(id) {
    idSelecionado = idSelecionado === id ? null : id;
    if (idSelecionado !== null) {
      if (typeof window.limparSelecaoDeArea === "function") window.limparSelecaoDeArea();
      if (typeof window.limparSelecaoDeLugar === "function") window.limparSelecaoDeLugar();
      if (typeof window.limparSelecaoDeEstrada === "function") window.limparSelecaoDeEstrada();
    }
    camadaDesenho.setStyle(estiloDoRio);
    atualizarLeitura();
  }
  function limparSelecao() {
    if (idSelecionado === null) return;
    idSelecionado = null;
    camadaDesenho.setStyle(estiloDoRio);
    atualizarLeitura();
  }
  window.limparSelecaoDeRio = limparSelecao;
  mapa.on("click", () => { if (!desenhando) limparSelecao(); });

  function atualizarLeitura() {
    const feature = featuresAtuais.find((f) => f.properties.id === idSelecionado);
    botaoApagar.disabled = !feature || estaTravado(feature);
    botaoEditar.disabled = !feature || estaTravado(feature);
    leitura.textContent = feature
      ? `${feature.properties.nome || feature.properties.id} · termina em ` +
        `${feature.properties.termina_em.tipo}${estaTravado(feature) ? " · travado" : ""}`
      : `${featuresAtuais.length} rio(s)`;
  }

  // --- Trava ----------------------------------------------------------------
  function aplicarTravas(docTravas) {
    for (const c of docTravas.camadas || []) {
      if (c.id === "rios") camadaTravada = Boolean(c.travada);
    }
    if (botaoTravaCamada) {
      botaoTravaCamada.textContent = camadaTravada ? "🔒 rios travados" : "🔓 rios livres";
      botaoTravaCamada.classList.toggle("ativo", camadaTravada);
    }
    camadaDesenho.setStyle(estiloDoRio);
    atualizarLeitura();
  }
  if (botaoTravaCamada) {
    botaoTravaCamada.addEventListener("click", async () => {
      const r = await chamar("POST", "/api/travas/rios", { travada: !camadaTravada });
      if (r.erro) return;
      aplicarTravas(r.dados);
      atualizarBotoesPilhaSeExistir();
    });
  }

  async function alternarTravaDoSelecionado() {
    const feature = featuresAtuais.find((f) => f.properties.id === idSelecionado);
    if (!feature) return false;
    const r = await chamar("POST", `/api/rios/${encodeURIComponent(feature.properties.id)}/trava`, {
      travado: !feature.properties.travado,
    });
    if (r.erro) return true; // houve seleção: a tecla foi tratada aqui
    redesenharTudo(r.dados);
    mostrarAviso(feature.properties.travado ? "rio destravado" : "rio travado");
    atualizarBotoesPilhaSeExistir();
    return true;
  }

  // --- Desenhar (Geoman em modo Line) ---------------------------------------
  function idNovo() {
    let maior = 0;
    for (const f of featuresAtuais) {
      const m = /^rio-(\d+)$/.exec(f.properties.id);
      if (m) maior = Math.max(maior, parseInt(m[1], 10));
    }
    return `rio-${String(maior + 1).padStart(4, "0")}`;
  }

  function ativar() {
    if (camadaTravada) { mostrarAviso("a camada de rios está travada"); return; }
    desenhando = true;
    botaoDesenhar.classList.add("ativo");
    mapa.pm.enableDraw("Line", { finishOn: "dblclick" });
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
  // A tecla é "i", e não "r": "r" já é a régua (static/js/regua.js), e duas
  // ferramentas na mesma tecla derrubariam uma delas em silêncio.
  registrarFerramenta({ nome: "rio", tecla: "i", ativar, desativar, estaAtiva: () => desenhando });

  function atualizarCampoDestino() {
    const precisa = seletorFim.value !== "mar";
    campoDestino.style.display = precisa ? "" : "none";
    campoDestino.required = precisa;
  }
  seletorFim.addEventListener("change", atualizarCampoDestino);

  mapa.on("pm:create", async (evento) => {
    // O polígono é da Área, e desde a etapa 9 a Estrada também desenha Line: sem a
    // checagem de `desenhando`, uma via desenhada iria parar em /api/rios também
    // (o mesmo defeito do pm:create da revisão da etapa 8, agora entre Rio e Estrada).
    if (evento.shape !== "Line" || !desenhando) return;
    const geojson = evento.layer.toGeoJSON();
    evento.layer.remove();
    desativar();
    const tipo = seletorFim.value;
    const r = await chamar("POST", "/api/rios", {
      id: idNovo(),
      geometria: geojson.geometry,
      termina_em: { tipo, id: tipo === "mar" ? null : (campoDestino.value.trim() || null) },
      // `ramo_de` fica SEMPRE null por aqui, de propósito. No esquema
      // (`ESPEC-dados.md`) ele é o rio-mãe de um BRAÇO DE DELTA, que normalmente
      // termina no mar; um afluente termina em rio e tem `ramo_de` null. Amarrar
      // os dois no mesmo campo da tela marcaria todo afluente como braço de delta
      // e tornaria o delta de verdade impossível de criar. Enquanto a tela não
      // tiver um campo próprio para isso, braço de delta se cria pela API.
      ramo_de: null,
    });
    if (r.erro) return; // a recusa já apareceu; o traçado some, porque não foi gravado
    redesenharTudo(r.dados);
    atualizarBotoesPilhaSeExistir();
  });

  botaoApagar.addEventListener("click", async () => {
    if (!idSelecionado) return;
    const r = await chamar("DELETE", `/api/rios/${encodeURIComponent(idSelecionado)}`);
    if (r.erro) return;
    idSelecionado = null;
    redesenharTudo(r.dados);
    atualizarBotoesPilhaSeExistir();
  });

  // --- Edição de vértice de rio já salvo (2026-09-23, noite) -------------------
  // O servidor valida o traçado novo inteiro, como na criação, e devolve os
  // afluentes e braços de delta que apontam para este rio: a foz deles pode ter
  // deixado de encostar no traçado, e a tela avisa.
  function editarSelecionado() {
    const feature = featuresAtuais.find((f) => f.properties.id === idSelecionado);
    if (!feature) return;
    if (estaTravado(feature)) { mostrarAviso("este rio está travado"); return; }
    desativarTodasAsFerramentas();
    const id = feature.properties.id;
    iniciarEdicaoDeVertices(mapa, feature, "#ffb300", async (geometria) => {
      const r = await chamar("PUT", `/api/rios/${encodeURIComponent(id)}/geometria`, { geometria });
      if (r.erro) return;
      redesenharTudo(r.dados.rios);
      if (r.dados.dependentes.length) {
        const lista = r.dados.dependentes.map((d) => `${d.id} (${d.ligacao})`).join(", ");
        leitura.textContent = `salvo · confira quem aponta para este rio: ${lista}`;
      }
      atualizarBotoesPilhaSeExistir();
    });
  }
  botaoEditar.addEventListener("click", editarSelecionado);

  // Tecla V (vértice): edita o objeto selecionado desta ferramenta. As seleções são
  // exclusivas entre as ferramentas, então só uma delas responde.
  document.addEventListener("keydown", (evento) => {
    if (evento.key !== "v" && evento.key !== "V") return;
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
    const alvo = evento.target;
    const tag = ((alvo && alvo.tagName) || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (idSelecionado === null || edicaoDeVerticesAtiva()) return;
    evento.preventDefault();
    editarSelecionado();
  });

  function atualizarBotoesPilhaSeExistir() {
    if (typeof window.atualizarBotoesDaPilha === "function") window.atualizarBotoesDaPilha();
  }

  async function recarregar() {
    const t = await chamar("GET", "/api/travas");
    if (t.dados) aplicarTravas(t.dados);
    const r = await chamar("GET", "/api/rios");
    if (r.dados) redesenharTudo(r.dados);
  }

  atualizarCampoDestino();
  aplicarTravas(travasIniciais || { camadas: [] });
  redesenharTudo(riosIniciais);
  window.recarregarRios = recarregar;

  return {
    alternarTravaDoSelecionado,
    temSelecao: () => idSelecionado !== null,
    recarregar,
  };
}
