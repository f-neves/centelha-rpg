// Camada de NOMES (B1 da empreitada, 2026-09-23 noite).
//
// Mostra no mapa todo nome que o mapa final desenha (menos os de região, que já têm o
// rótulo arrastável do painel REGIÕES), e deixa ajustar: arrastar o nome (a posição
// vai para dados/nomes.json), trocar o nível (tamanho), mandar sair reto, esconder do
// jogador, desenhar à mão a curva que ele acompanha, e criar nome livre (mar sem
// região, cordilheira: o nome livre pode apontar para uma área de relevo).
//
// O texto de lugar, rio, região e rota mora no próprio objeto; aqui só o ajuste. O
// servidor resolve tudo em `efetivos` (GET /api/nomes), e a tela redesenha dele.
//
// Contrato: iniciarCamadaDeNomes(mapa) -> { recarregar }; window.recarregarNomes().

function iniciarCamadaDeNomes(mapa) {
  mapa.createPane("nomes");
  mapa.getPane("nomes").style.zIndex = 595;
  const camada = L.layerGroup().addTo(mapa);
  const lista = document.getElementById("lista-nomes");
  const caixaMostrar = document.getElementById("nomes-mostrar");
  const campoTexto = document.getElementById("nome-livre-texto");
  const seletorArea = document.getElementById("nome-livre-area");
  const botaoNovo = document.getElementById("nome-livre-por");
  const leitura = document.getElementById("nome-leitura");
  let efetivos = [];
  let arquivo = [];
  let areasDeRelevo = [];
  let esperandoPosicao = false;
  let desenhandoCurvaDe = null;

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
      let mensagem = dados.detail || `erro ${resp.status}`;
      if (Array.isArray(mensagem)) mensagem = mensagem.map((d) => d.msg).join("; ");
      if (resp.status === 409) { mostrarAviso(mensagem); return { erro: mensagem }; }
      if (metodo !== "GET") mostrarErroDeGravacao(mensagem);
      return { erro: mensagem };
    }
    if (metodo !== "GET") mostrarSalvo();
    return { dados };
  }
  function pilha() {
    if (typeof window.atualizarBotoesDaPilha === "function") window.atualizarBotoesDaPilha();
  }

  // O ajuste de um alvo: existe no arquivo? Se não, é criado no primeiro gesto.
  function ajusteDe(n) {
    if (n.id) return arquivo.find((x) => x.id === n.id) || null;
    return arquivo.find((x) => x.alvo.tipo === n.alvo.tipo && x.alvo.id === n.alvo.id) || null;
  }
  async function mudar(n, campos) {
    const aj = ajusteDe(n);
    const r = aj
      ? await chamar("PUT", `/api/nomes/${encodeURIComponent(aj.id)}`, campos)
      : await chamar("POST", "/api/nomes", { alvo: n.alvo, ...campos });
    if (r.dados) aplicar(r.dados);
    pilha();
  }

  function aplicar(dados) {
    arquivo = dados.nomes.nomes || [];
    efetivos = dados.efetivos || [];
    redesenhar();
  }

  function posicaoNaTela(n) {
    if (n.posicao) return n.posicao.coordinates;
    if (n.ponto) return [n.ponto.coordinates[0] + 0.4, n.ponto.coordinates[1]];
    if (n.linha) {
      const c = n.linha.coordinates;
      return c[Math.floor(c.length / 2)];
    }
    if (n.curva) {
      const c = n.curva.coordinates;
      return c[Math.floor(c.length / 2)];
    }
    return null;
  }

  function redesenhar() {
    camada.clearLayers();
    lista.innerHTML = "";
    for (const n of efetivos) {
      if (n.alvo.tipo === "regiao") continue;   // o painel REGIÕES já mostra
      const pos = posicaoNaTela(n);
      if (caixaMostrar.checked && pos) {
        const m = L.marker([pos[1], pos[0]], {
          pane: "nomes", draggable: n.alvo.tipo === "lugar" || n.alvo.tipo === "livre" || n.alvo.tipo === "area",
          icon: L.divIcon({ className: `rotulo-nome nivel-${n.nivel}`, html: `<span>${escapar(n.texto)}</span>`, iconSize: null }),
          title: `${n.texto} · nível ${n.nivel}${n.visivel_jogador === false ? " · oculto do jogador" : ""}`,
        });
        m.on("dragend", () => {
          const p = m.getLatLng();
          mudar(n, { posicao: { type: "Point", coordinates: [p.lng, p.lat] } });
        });
        camada.addLayer(m);
      }
      lista.appendChild(itemDaLista(n));
    }
  }

  function escapar(t) {
    return String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function itemDaLista(n) {
    const li = document.createElement("li");
    li.className = "item-nome";
    const rotulo = document.createElement("span");
    rotulo.textContent = `${n.texto} (${n.alvo.tipo})`;
    const nivel = document.createElement("select");
    for (const v of [1, 2, 3, 4, 5]) {
      const op = document.createElement("option");
      op.value = v; op.textContent = `nível ${v}`;
      nivel.appendChild(op);
    }
    nivel.value = n.nivel;
    nivel.title = "tamanho do nome (1 menor, 5 maior)";
    nivel.addEventListener("change", () => mudar(n, { nivel: Number(nivel.value) }));
    const reto = document.createElement("label");
    const caixaReto = document.createElement("input");
    caixaReto.type = "checkbox"; caixaReto.checked = !!n.reto;
    caixaReto.addEventListener("change", () => mudar(n, { reto: caixaReto.checked }));
    reto.append(caixaReto, " reto");
    const jogador = document.createElement("label");
    const caixaJog = document.createElement("input");
    caixaJog.type = "checkbox"; caixaJog.checked = n.visivel_jogador !== false;
    caixaJog.title = "desmarcado: o nome não sai no mapa do jogador";
    caixaJog.addEventListener("change", () => mudar(n, { visivel_jogador: caixaJog.checked }));
    jogador.append(caixaJog, " jogador");
    const curva = document.createElement("button");
    curva.type = "button"; curva.textContent = "curva";
    curva.title = "desenhe a linha que o nome acompanha (duplo clique termina)";
    curva.addEventListener("click", () => {
      desativarTodasAsFerramentas();
      desenhandoCurvaDe = n;
      leitura.textContent = `desenhe a curva de "${n.texto}" (duplo clique termina)`;
      mapa.pm.enableDraw("Line", { finishOn: "dblclick" });
    });
    li.append(rotulo, nivel, reto, jogador, curva);
    const aj = ajusteDe(n);
    if (aj) {
      const apagar = document.createElement("button");
      apagar.type = "button";
      apagar.textContent = n.alvo.tipo === "livre" || n.alvo.tipo === "area" ? "apagar" : "padrão";
      apagar.title = "apaga o nome livre, ou tira o ajuste (volta ao que sai do objeto)";
      apagar.addEventListener("click", async () => {
        const r = await chamar("DELETE", `/api/nomes/${encodeURIComponent(aj.id)}`);
        if (r.dados) aplicar(r.dados);
        pilha();
      });
      li.appendChild(apagar);
    }
    return li;
  }

  mapa.on("pm:create", async (evento) => {
    if (evento.shape !== "Line" || !desenhandoCurvaDe) return;
    const n = desenhandoCurvaDe;
    desenhandoCurvaDe = null;
    const geo = evento.layer.toGeoJSON().geometry;
    evento.layer.remove();
    mapa.pm.disableDraw();
    leitura.textContent = "";
    await mudar(n, { curva: geo, reto: false });
  });

  // Nome livre: texto, e (opcional) a área de relevo que ele nomeia. O próximo clique
  // no mapa é a posição.
  botaoNovo.addEventListener("click", () => {
    if (!campoTexto.value.trim()) { leitura.textContent = "escreva o nome antes"; return; }
    esperandoPosicao = true;
    leitura.textContent = "clique no mapa onde o nome vai ficar (Esc cancela)";
    mapa.getContainer().style.cursor = "crosshair";
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && (esperandoPosicao || desenhandoCurvaDe)) {
      esperandoPosicao = false; desenhandoCurvaDe = null;
      mapa.getContainer().style.cursor = "";
      leitura.textContent = "";
    }
  });
  mapa.on("click", async (evento) => {
    if (!esperandoPosicao) return;
    esperandoPosicao = false;
    mapa.getContainer().style.cursor = "";
    const area = seletorArea.value;
    const r = await chamar("POST", "/api/nomes", {
      alvo: area ? { tipo: "area", id: area } : { tipo: "livre", id: null },
      texto: campoTexto.value.trim(),
      posicao: { type: "Point", coordinates: [evento.latlng.lng, evento.latlng.lat] },
    });
    if (r.dados) { aplicar(r.dados); campoTexto.value = ""; leitura.textContent = ""; }
    pilha();
  });

  async function carregarAreas() {
    const r = await chamar("GET", "/api/areas");
    if (!r.dados) return;
    areasDeRelevo = r.dados.features.filter((f) => f.properties.camada === "relevo");
    seletorArea.innerHTML = '<option value="">(nome livre)</option>';
    for (const f of areasDeRelevo) {
      const op = document.createElement("option");
      op.value = f.properties.id; op.textContent = `${f.properties.valor}: ${f.properties.id}`;
      seletorArea.appendChild(op);
    }
  }

  caixaMostrar.addEventListener("change", redesenhar);

  async function recarregar() {
    const r = await chamar("GET", "/api/nomes");
    if (r.dados) aplicar(r.dados);
    carregarAreas();
  }
  window.recarregarNomes = recarregar;
  recarregar();
  return { recarregar };
}
