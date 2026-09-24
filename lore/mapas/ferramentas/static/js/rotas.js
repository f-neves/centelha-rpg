// ROTAS DE COMÉRCIO (B4 da empreitada, 2026-09-23 noite). Tipo próprio, não é estrada.
//
// Desenhar: botão "+ rota" ou tecla O, clicar os pontos de CONTROLE, duplo clique
// termina. Cada trecho nasce do tipo escolhido (curvo ou reto) e depois se troca um a
// um nos botões do painel. O servidor interpola (Catmull-Rom no trecho curvo), gruda
// as pontas num lugar a menos de 5 km, valida (terrestre e fluvial não cruzam mar) e
// devolve o traçado e as MEDIDAS (distância no globo e dias por transporte), que não
// são gravadas. "vértices" edita os pontos de controle (Enter salva).
//
// Contrato: iniciarFerramentaDeRota(mapa) -> { temSelecao, alternarTravaDoSelecionado };
// window.recarregarRotas(); window.limparSelecaoDeRota().

const ESTILO_ROTA = {
  terrestre: { color: "#802a1e", dashArray: "2 7", weight: 3 },
  maritima: { color: "#802a1e", dashArray: "14 6 2 6", weight: 3 },
  fluvial: { color: "#28466e", dashArray: "2 7", weight: 3 },
};

function iniciarFerramentaDeRota(mapa) {
  mapa.createPane("rotas");
  mapa.getPane("rotas").style.zIndex = 457;
  const botao = document.getElementById("rota-desenhar");
  const seletorTipo = document.getElementById("rota-tipo");
  const seletorTrecho = document.getElementById("rota-trecho");
  const lista = document.getElementById("lista-rotas");
  const form = document.getElementById("form-rota");
  const leitura = document.getElementById("rota-leitura");
  const botoesTrecho = document.getElementById("rota-trechos");
  const camada = L.geoJSON(null, { pane: "rotas", style: estilo, onEachFeature: ligar }).addTo(mapa);
  const camadaControle = L.layerGroup().addTo(mapa);
  let rotas = [];
  let medidas = {};
  let idSelecionado = null;
  let desenhando = false;

  function estilo(f) {
    const e = { ...(ESTILO_ROTA[f.properties.tipo] || ESTILO_ROTA.terrestre) };
    if (f.properties.id === idSelecionado) { e.weight = 5; e.color = "#ffb300"; }
    if (f.properties.travado) e.opacity = 0.6;
    return e;
  }
  function ligar(f, l) {
    l.on("click", (ev) => { L.DomEvent.stopPropagation(ev); selecionar(f.properties.id); });
  }

  async function chamar(metodo, caminho, corpo) {
    if (metodo !== "GET") mostrarSalvando();
    let resp;
    try {
      resp = await fetch(caminho, { method: metodo, headers: corpo ? { "Content-Type": "application/json" } : undefined,
        body: corpo ? JSON.stringify(corpo) : undefined });
    } catch (e) {
      if (metodo !== "GET") mostrarErroDeGravacao("o servidor não respondeu");
      return { erro: "o servidor não respondeu" };
    }
    const dados = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      let m = dados.detail || `erro ${resp.status}`;
      if (Array.isArray(m)) m = m.map((d) => d.msg).join("; ");
      if (resp.status === 409) { mostrarAviso(m); return { erro: m }; }
      if (metodo !== "GET") mostrarErroDeGravacao(m);
      return { erro: m };
    }
    if (metodo !== "GET") mostrarSalvo();
    return { dados };
  }
  function pilha() {
    if (typeof window.atualizarBotoesDaPilha === "function") window.atualizarBotoesDaPilha();
  }

  function aplicar(dados) {
    rotas = dados.rotas.features || [];
    medidas = dados.medidas || {};
    if (idSelecionado && !rotas.some((f) => f.properties.id === idSelecionado)) idSelecionado = null;
    camada.clearLayers();
    if (rotas.length) camada.addData(dados.rotas);
    redesenharLista();
    preencherForm();
    if (typeof window.recarregarNomes === "function") window.recarregarNomes();
  }

  function textoMedidas(id) {
    const m = medidas[id];
    if (!m) return "";
    const dias = Object.entries(m.dias).map(([k, v]) => `${k} ${v.toLocaleString("pt-BR")} d`).join(" · ");
    return `${m.km.toLocaleString("pt-BR")} km · ${dias}`;
  }

  function redesenharLista() {
    lista.innerHTML = "";
    for (const f of rotas) {
      const p = f.properties;
      const li = document.createElement("li");
      li.className = "item-estrada" + (p.id === idSelecionado ? " selecionado" : "");
      li.textContent = `${p.nome || p.id} · ${p.tipo}${p.travado ? " 🔒" : ""} · ${textoMedidas(p.id)}`;
      li.addEventListener("click", () => selecionar(p.id));
      lista.appendChild(li);
    }
  }

  function selecionada() { return rotas.find((f) => f.properties.id === idSelecionado); }

  function selecionar(id) {
    idSelecionado = idSelecionado === id ? null : id;
    if (idSelecionado) {
      for (const nome of ["limparSelecaoDeArea", "limparSelecaoDeRio", "limparSelecaoDeEstrada", "limparSelecaoDeLugar"]) {
        if (typeof window[nome] === "function") window[nome]();
      }
    }
    camada.setStyle(estilo);
    redesenharLista();
    preencherForm();
  }
  window.limparSelecaoDeRota = () => { if (idSelecionado) { idSelecionado = null; camada.setStyle(estilo); preencherForm(); redesenharLista(); } };

  const selTipo = document.getElementById("rota-tipo-sel");
  for (const t of ["terrestre", "maritima", "fluvial"]) {
    const op = document.createElement("option");
    op.value = t; op.textContent = t;
    selTipo.appendChild(op);
  }
  const idDoCampo = (c) => (c === "tipo" ? "rota-tipo-sel" : `rota-${c}`);
  const campos = ["nome", "tipo", "mercadorias", "sentido", "risco", "sazonalidade", "controlada_por", "observacoes"];
  function preencherForm() {
    const f = selecionada();
    camadaControle.clearLayers();
    botoesTrecho.innerHTML = "";
    form.style.display = f ? "" : "none";
    if (!f) { leitura.textContent = `${rotas.length} rota(s)`; return; }
    const p = f.properties;
    for (const c of campos) {
      const el = document.getElementById(idDoCampo(c));
      el.value = c === "mercadorias" ? (p.mercadorias || []).join(", ") : (p[c] || "");
    }
    document.getElementById("rota-jogador").checked = p.visivel_jogador !== false;
    leitura.textContent = `${p.id} · ${textoMedidas(p.id)}` + (p.lugares && (p.lugares[0] || p.lugares[1])
      ? ` · pontas: ${p.lugares[0] || "—"} → ${p.lugares[1] || "—"}` : "");
    p.controle.pontos.forEach(([lon, lat]) => camadaControle.addLayer(
      L.circleMarker([lat, lon], { pane: "rotas", radius: 4, color: "#ffb300", weight: 2, fillOpacity: 1, interactive: false })));
    p.controle.trechos.forEach((t, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = `${i + 1}: ${t}`;
      b.title = "troca este trecho entre curvo e reto";
      b.addEventListener("click", async () => {
        const trechos = [...p.controle.trechos];
        trechos[i] = t === "curvo" ? "reto" : "curvo";
        const r = await chamar("PUT", `/api/rotas/${encodeURIComponent(p.id)}`, { controle: { pontos: p.controle.pontos, trechos } });
        if (r.dados) aplicar(r.dados);
        pilha();
      });
      botoesTrecho.appendChild(b);
    });
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const f = selecionada();
    if (!f) return;
    const props = {};
    for (const c of campos) {
      const v = document.getElementById(idDoCampo(c)).value.trim();
      props[c] = c === "mercadorias" ? v.split(",").map((m) => m.trim()).filter(Boolean) : (v || null);
    }
    props.visivel_jogador = document.getElementById("rota-jogador").checked;
    const r = await chamar("PUT", `/api/rotas/${encodeURIComponent(f.properties.id)}`, { propriedades: props });
    if (r.dados) aplicar(r.dados);
    pilha();
  });

  document.getElementById("rota-apagar").addEventListener("click", async () => {
    const f = selecionada();
    if (!f) return;
    const r = await chamar("DELETE", `/api/rotas/${encodeURIComponent(f.properties.id)}`);
    if (r.dados) { idSelecionado = null; aplicar(r.dados); }
    pilha();
  });

  document.getElementById("rota-vertices").addEventListener("click", () => {
    const f = selecionada();
    if (!f) return;
    if (f.properties.travado) { mostrarAviso("esta rota está travada"); return; }
    const controle = { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: f.properties.controle.pontos } };
    iniciarEdicaoDeVertices(mapa, controle, "#ffb300", async (geometria) => {
      const r = await chamar("PUT", `/api/rotas/${encodeURIComponent(f.properties.id)}`, { controle: { pontos: geometria.coordinates } });
      if (r.dados) aplicar(r.dados);
      pilha();
    });
  });

  async function alternarTravaDoSelecionado() {
    const f = selecionada();
    if (!f) return false;
    const r = await chamar("PUT", `/api/rotas/${encodeURIComponent(f.properties.id)}`, { propriedades: { travado: !f.properties.travado } });
    if (r.dados) { aplicar(r.dados); mostrarAviso(f.properties.travado ? "rota destravada" : "rota travada"); }
    pilha();
    return true;
  }

  function ativar() { desenhando = true; botao.classList.add("ativo"); mapa.pm.enableDraw("Line", { finishOn: "dblclick" }); }
  function desativar() { desenhando = false; botao.classList.remove("ativo"); mapa.pm.disableDraw(); }
  botao.addEventListener("click", () => { if (desenhando) desativar(); else { desativarTodasAsFerramentas(); ativar(); } });
  // "o" de rOta: livre (L A I E R T D C V P já são de outras).
  registrarFerramenta({ nome: "rota", tecla: "o", ativar, desativar, estaAtiva: () => desenhando });

  mapa.on("pm:create", async (ev) => {
    if (ev.shape !== "Line" || !desenhando) return;
    const pontos = ev.layer.toGeoJSON().geometry.coordinates;
    ev.layer.remove();
    desativar();
    const trechos = pontos.slice(1).map(() => seletorTrecho.value);
    const r = await chamar("POST", "/api/rotas", { propriedades: { tipo: seletorTipo.value }, controle: { pontos, trechos } });
    if (r.dados) aplicar(r.dados);
    pilha();
  });

  async function recarregar() {
    const r = await chamar("GET", "/api/rotas");
    if (r.dados) aplicar(r.dados);
  }
  window.recarregarRotas = recarregar;
  recarregar();
  return { temSelecao: () => idSelecionado !== null, alternarTravaDoSelecionado };
}
