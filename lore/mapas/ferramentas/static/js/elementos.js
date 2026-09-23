// Elementos de cartografia (B2 da empreitada, 2026-09-23 noite): rosa dos ventos,
// barra de escala, cartela de título e monstro marinho. Arraste o marcador para mover;
// tamanho, texto da cartela, latitude da escala e visibilidade para o jogador no
// painel. "criar os que faltam" põe os quatro nas posições padrão (backend/elementos.py).
//
// Contrato: iniciarElementos(mapa) -> { recarregar }; window.recarregarElementos().

const ROTULO_ELEMENTO = { rosa: "✥ rosa", escala: "▭ escala", cartela: "▭ cartela", monstro: "≈ monstro" };

function iniciarElementos(mapa) {
  mapa.createPane("elementos");
  mapa.getPane("elementos").style.zIndex = 596;
  const camada = L.layerGroup().addTo(mapa);
  const lista = document.getElementById("lista-elementos");
  const botaoPadrao = document.getElementById("elementos-padrao");

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
  async function mudar(id, campos) {
    const r = await chamar("PUT", `/api/elementos/${encodeURIComponent(id)}`, campos);
    if (r.dados) aplicar(r.dados); else recarregar();
    pilha();
  }

  function aplicar(dados) {
    camada.clearLayers();
    lista.innerHTML = "";
    for (const e of dados.elementos || []) {
      const [lon, lat] = e.posicao.coordinates;
      const m = L.marker([lat, lon], {
        pane: "elementos", draggable: !e.travado,
        icon: L.divIcon({ className: "marcador-elemento", html: `<span>${ROTULO_ELEMENTO[e.tipo] || e.tipo}</span>`, iconSize: null }),
        title: `${e.id} · arraste para mover`,
      });
      m.on("dragend", () => {
        const p = m.getLatLng();
        mudar(e.id, { posicao: { type: "Point", coordinates: [p.lng, p.lat] } });
      });
      camada.addLayer(m);

      const li = document.createElement("li");
      li.className = "item-elemento";
      const nome = document.createElement("span");
      nome.textContent = e.id;
      const tam = document.createElement("input");
      tam.type = "number"; tam.min = 40; tam.max = 5000; tam.step = 20; tam.value = e.tamanho;
      tam.title = "tamanho em px na resolução oficial";
      tam.addEventListener("change", () => mudar(e.id, { tamanho: Number(tam.value) }));
      li.append(nome, tam);
      if (e.tipo === "cartela") {
        const t = document.createElement("input");
        t.type = "text"; t.value = e.texto || ""; t.placeholder = "título";
        t.addEventListener("change", () => mudar(e.id, { texto: t.value }));
        li.appendChild(t);
      }
      if (e.tipo === "escala") {
        const la = document.createElement("input");
        la.type = "number"; la.step = 0.1; la.value = e.latitude_escala ?? "";
        la.title = "latitude em que a escala vale (graus)";
        la.addEventListener("change", () => mudar(e.id, { latitude_escala: Number(la.value) }));
        li.appendChild(la);
      }
      const jog = document.createElement("label");
      const cj = document.createElement("input");
      cj.type = "checkbox"; cj.checked = e.visivel_jogador !== false;
      cj.addEventListener("change", () => mudar(e.id, { visivel_jogador: cj.checked }));
      jog.append(cj, " jogador");
      const apagar = document.createElement("button");
      apagar.type = "button"; apagar.textContent = "apagar";
      apagar.addEventListener("click", async () => {
        const r = await chamar("DELETE", `/api/elementos/${encodeURIComponent(e.id)}`);
        if (r.dados) aplicar(r.dados);
        pilha();
      });
      li.append(jog, apagar);
      lista.appendChild(li);
    }
  }

  botaoPadrao.addEventListener("click", async () => {
    const r = await chamar("POST", "/api/elementos/padrao", {});
    if (r.dados) aplicar(r.dados);
    pilha();
  });

  async function recarregar() {
    const r = await chamar("GET", "/api/elementos");
    if (r.dados) aplicar(r.dados);
  }
  window.recarregarElementos = recarregar;
  recarregar();
  return { recarregar };
}
