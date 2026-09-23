// Pincel de tamanho ajustável (2026-09-23, noite): pintar e apagar área à mão livre.
//
// Com o pincel na mão (tecla P), o mapa não arrasta com o botão esquerdo: apertar e
// arrastar pinta. Espaço segurado continua arrastando o mapa, como nas outras
// ferramentas. O círculo que segue o mouse tem o tamanho do pincel na escala do
// zoom atual. Ao soltar o botão, o traço (os pontos por onde o mouse passou) vai ao
// servidor com o raio em km (`POST /api/areas/pincel`), e é lá que ele vira polígono,
// funde com a área do mesmo valor que tocou, recorta as de outro valor e cede às
// travadas (backend/areas.py, "Pincel"). A tela redesenha do que voltou.
//
// Camada e valor são os da barra de cima (os mesmos da ferramenta de Área). No modo
// "apagar", o valor não importa: o traço sai de toda área livre da camada.
//
// Contrato: iniciarPincel(mapa, kmPorGrau) -> nada; depende de window.recarregarAreas.

function iniciarPincel(mapa, kmPorGrau) {
  mapa.createPane("pincel");
  mapa.getPane("pincel").style.zIndex = 615;
  mapa.getPane("pincel").style.pointerEvents = "none";

  const botao = document.getElementById("pincel-ativar");
  const campoRaio = document.getElementById("pincel-raio");
  const leituraRaio = document.getElementById("pincel-raio-leitura");
  const seletorModo = document.getElementById("pincel-modo");
  const seletorCamada = document.getElementById("seletor-camada");
  const seletorValor = document.getElementById("seletor-valor");

  let ativo = false;
  let pintando = false;
  let pontos = [];
  let cursor = null;
  let rastro = null;

  function raioKm() { return Number(campoRaio.value); }
  // Pixels por km no zoom atual, medidos na tela (a projeção é equirretangular sem
  // correção, então um grau vale o mesmo em qualquer lugar).
  function pxPorKm() {
    const c = mapa.getCenter();
    const a = mapa.latLngToContainerPoint(c);
    const b = mapa.latLngToContainerPoint(L.latLng(c.lat + 1, c.lng));
    return Math.abs(a.y - b.y) / kmPorGrau;
  }
  function corDoModo() { return seletorModo.value === "apagar" ? "#e53935" : "#ffb300"; }

  function atualizarLeituraRaio() { leituraRaio.textContent = `${raioKm()} km`; }
  campoRaio.addEventListener("input", () => {
    atualizarLeituraRaio();
    if (cursor) cursor.setRadius(raioKm() * pxPorKm());
  });

  function ativar() {
    ativo = true;
    botao.classList.add("ativo");
    mapa.dragging.disable();
    mapa.getContainer().classList.add("pincelando");
  }
  function desativar() {
    ativo = false;
    pintando = false;
    pontos = [];
    botao.classList.remove("ativo");
    mapa.dragging.enable();
    mapa.getContainer().classList.remove("pincelando");
    if (cursor) { cursor.remove(); cursor = null; }
    if (rastro) { rastro.remove(); rastro = null; }
  }
  botao.addEventListener("click", () => {
    if (ativo) desativar();
    else { desativarTodasAsFerramentas(); ativar(); }
  });
  // "p" de pincel: livre (L lugar, A área, I rio, E estrada, R régua, T trava,
  // D tema, C costa, V vértice).
  registrarFerramenta({ nome: "pincel", tecla: "p", ativar, desativar, estaAtiva: () => ativo });

  mapa.on("mousemove", (evento) => {
    if (!ativo) return;
    // Espaço segurado: o mapa volta a arrastar enquanto ele estiver apertado.
    if (arrastandoComEspaco()) { mapa.dragging.enable(); return; }
    mapa.dragging.disable();
    if (!cursor) {
      cursor = L.circleMarker(evento.latlng, {
        pane: "pincel", radius: raioKm() * pxPorKm(), color: corDoModo(), weight: 1, fillOpacity: 0.1,
        interactive: false,
      }).addTo(mapa);
    }
    cursor.setLatLng(evento.latlng);
    cursor.setRadius(raioKm() * pxPorKm());
    cursor.setStyle({ color: corDoModo() });
    if (!pintando) return;
    // Um ponto a cada ~1/4 do raio: mais que isso só engorda o pedido.
    const ultimo = pontos[pontos.length - 1];
    const px = mapa.latLngToContainerPoint(evento.latlng);
    const pxUltimo = mapa.latLngToContainerPoint(L.latLng(ultimo[1], ultimo[0]));
    if (px.distanceTo(pxUltimo) < Math.max(2, raioKm() * pxPorKm() / 4)) return;
    pontos.push([evento.latlng.lng, evento.latlng.lat]);
    rastro.addLatLng(evento.latlng);
  });

  mapa.on("mousedown", (evento) => {
    if (!ativo || arrastandoComEspaco() || evento.originalEvent.button !== 0) return;
    pintando = true;
    pontos = [[evento.latlng.lng, evento.latlng.lat]];
    rastro = L.polyline([evento.latlng], {
      pane: "pincel", color: corDoModo(), opacity: 0.35, lineCap: "round", lineJoin: "round",
      weight: 2 * raioKm() * pxPorKm(), interactive: false,
    }).addTo(mapa);
  });

  async function soltar() {
    if (!pintando) return;
    pintando = false;
    const traco = pontos;
    pontos = [];
    const modo = seletorModo.value;
    mostrarSalvando();
    let resp, dados;
    try {
      resp = await fetch("/api/areas/pincel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          camada: seletorCamada.value, valor: modo === "pintar" ? seletorValor.value : null,
          linha: traco, raio_km: raioKm(), modo,
        }),
      });
      dados = await resp.json().catch(() => ({}));
    } catch (e) {
      mostrarErroDeGravacao("o servidor não respondeu");
      if (rastro) { rastro.remove(); rastro = null; }
      return;
    }
    if (rastro) { rastro.remove(); rastro = null; }
    if (!resp.ok) {
      const mensagem = dados.detail || `erro ${resp.status}`;
      if (resp.status === 409) mostrarAviso(mensagem);
      else mostrarErroDeGravacao(Array.isArray(mensagem) ? mensagem.map((d) => d.msg).join("; ") : mensagem);
      return;
    }
    if (!dados.mudou) { mostrarAviso(modo === "apagar" ? "nada livre para apagar ali" : "o traço caiu todo em área travada"); return; }
    mostrarSalvo();
    if (typeof window.recarregarAreas === "function") window.recarregarAreas();
    if (typeof window.atualizarBotoesDaPilha === "function") window.atualizarBotoesDaPilha();
  }
  mapa.on("mouseup", soltar);
  // Soltar o botão fora do mapa também encerra o traço.
  document.addEventListener("mouseup", soltar);
  mapa.on("mouseout", () => { if (cursor) { cursor.remove(); cursor = null; } });
  mapa.on("zoomend", () => { if (cursor) cursor.setRadius(raioKm() * pxPorKm()); });

  atualizarLeituraRaio();
}
