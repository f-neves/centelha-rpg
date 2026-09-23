// Painel de regiões (etapa 10 SEM o cache de identidade de ilha, 2026-09-23, noite).
//
// O que existe: a lista das regiões em árvore (pelo `pai`), criar, editar nome, tipo
// e pai, apagar (o servidor recusa com 409 se a região tem filhas ou massas), o
// rótulo de cada região no mapa, arrastável, e a lista das massas de terra com um
// seletor de região em cada uma (o pertencimento mora só em massas.geojson).
//
// O que NÃO existe, porque depende da geometria da ilha e o cache continua proibido:
// clicar numa ilha para saber qual é, e a regra dos 100 km. A massa se escolhe pela
// lista, pelo id; o botão "ver" leva o mapa ao ponto de referência dela.
//
// Tudo passa pelo servidor (backend/regioes.py) e pelo desfazer comum. A tela
// redesenha sempre do que o servidor devolveu.
//
// Contrato com os outros arquivos (funções globais):
//   iniciarPainelDeRegioes(mapa)       chamado por app.js; carrega sozinho por GET
//   window.recarregarRegioes()         chamado pelo desfazer/refazer (lugares.js)

const TIPOS_DE_REGIAO = ["arquipelago", "ilha", "provincia", "reino", "mar", "golfo", "baia", "estreito"];

function iniciarPainelDeRegioes(mapa) {
  // Rótulos acima das áreas e do mar, abaixo dos marcadores de lugar (600).
  mapa.createPane("regioes-rotulos");
  mapa.getPane("regioes-rotulos").style.zIndex = 590;

  const camadaRotulos = L.layerGroup().addTo(mapa);
  const lista = document.getElementById("lista-regioes");
  const listaMassas = document.getElementById("lista-massas");
  const caixaRotulos = document.getElementById("regioes-mostrar-rotulos");
  const form = document.getElementById("form-regiao");
  const campoId = document.getElementById("regiao-id");
  const campoNome = document.getElementById("regiao-nome");
  const campoTipo = document.getElementById("regiao-tipo");
  const campoPai = document.getElementById("regiao-pai");
  const botaoNova = document.getElementById("regiao-nova");
  const botaoApagar = document.getElementById("regiao-apagar");
  const botaoRotulo = document.getElementById("regiao-por-rotulo");
  const leitura = document.getElementById("regiao-leitura");

  let regioes = [];
  let massas = [];
  let idSelecionado = null;     // null = o formulário cria uma região nova
  let esperandoRotulo = false;

  for (const t of TIPOS_DE_REGIAO) {
    const op = document.createElement("option");
    op.value = t; op.textContent = t;
    campoTipo.appendChild(op);
  }

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
      // 409 aqui é "a região está em uso": aviso discreto, como a trava.
      if (resp.status === 409) { mostrarAviso(mensagem); return { erro: mensagem }; }
      if (metodo !== "GET") mostrarErroDeGravacao(mensagem);
      return { erro: mensagem };
    }
    if (metodo !== "GET") mostrarSalvo();
    return { dados };
  }

  function atualizarBotoesPilhaSeExistir() {
    if (typeof window.atualizarBotoesDaPilha === "function") window.atualizarBotoesDaPilha();
  }

  // --- desenho --------------------------------------------------------------
  function aplicar(dados) {
    regioes = dados.regioes.regioes;
    massas = dados.massas.features;
    if (idSelecionado && !regioes.some((r) => r.id === idSelecionado)) idSelecionado = null;
    redesenharRotulos();
    redesenharLista();
    redesenharMassas();
    preencherFormulario();
  }

  function redesenharRotulos() {
    camadaRotulos.clearLayers();
    if (!caixaRotulos.checked) return;
    for (const r of regioes) {
      if (!r.rotulo) continue;
      const [lon, lat] = r.rotulo.coordinates;
      const marcador = L.marker([lat, lon], {
        pane: "regioes-rotulos",
        draggable: true,
        icon: L.divIcon({
          className: "rotulo-regiao" + (r.id === idSelecionado ? " selecionado" : ""),
          html: `<span>${escaparHtml(r.nome)}</span>`,
          iconSize: null,
        }),
        title: `${r.nome} (${r.tipo}) · arraste para mover o rótulo`,
      });
      marcador.on("click", () => selecionar(r.id));
      marcador.on("dragend", async () => {
        const p = marcador.getLatLng();
        const resp = await chamar("PUT", `/api/regioes/${encodeURIComponent(r.id)}/rotulo`,
          { rotulo: { lon: p.lng, lat: p.lat } });
        if (resp.dados) aplicar(resp.dados); else recarregar();
        atualizarBotoesPilhaSeExistir();
      });
      camadaRotulos.addLayer(marcador);
    }
  }

  function escaparHtml(texto) {
    return String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function redesenharLista() {
    lista.innerHTML = "";
    const filhas = {};
    for (const r of regioes) (filhas[r.pai || ""] = filhas[r.pai || ""] || []).push(r);
    const contagem = {};
    for (const m of massas) {
      const id = m.properties.regiao;
      if (id) contagem[id] = (contagem[id] || 0) + 1;
    }
    const visto = new Set();
    function desenhar(pai, nivel) {
      for (const r of (filhas[pai] || []).sort((a, b) => a.nome.localeCompare(b.nome))) {
        if (visto.has(r.id)) continue;   // defesa contra ciclo em dado editado à mão
        visto.add(r.id);
        const li = document.createElement("li");
        li.className = "item-regiao" + (r.id === idSelecionado ? " selecionado" : "");
        li.style.paddingLeft = `${4 + nivel * 12}px`;
        const n = contagem[r.id] || 0;
        li.textContent = `${r.nome} · ${r.tipo}${n ? ` · ${n} massa(s)` : ""}${r.rotulo ? "" : " · sem rótulo"}`;
        li.title = r.id;
        li.addEventListener("click", () => selecionar(r.id));
        lista.appendChild(li);
        desenhar(r.id, nivel + 1);
      }
    }
    desenhar("", 0);
    // Região cujo pai sumiu (só por edição à mão) ainda aparece, no fim.
    for (const r of regioes) if (!visto.has(r.id)) { visto.add(r.id); desenhar(r.pai, 0); }
  }

  function redesenharMassas() {
    listaMassas.innerHTML = "";
    for (const m of massas) {
      const p = m.properties;
      const li = document.createElement("li");
      li.className = "item-massa";
      const rotulo = document.createElement("span");
      rotulo.textContent = p.id;
      rotulo.title = p.nota || "";
      const seletor = document.createElement("select");
      const vazio = document.createElement("option");
      vazio.value = ""; vazio.textContent = "(sem região)";
      seletor.appendChild(vazio);
      for (const r of regioes) {
        const op = document.createElement("option");
        op.value = r.id; op.textContent = r.nome;
        seletor.appendChild(op);
      }
      seletor.value = p.regiao || "";
      seletor.addEventListener("change", async () => {
        const resp = await chamar("PUT", `/api/massas/${encodeURIComponent(p.id)}/regiao`,
          { regiao: seletor.value || null });
        if (resp.dados) aplicar(resp.dados); else recarregar();
        atualizarBotoesPilhaSeExistir();
      });
      const ver = document.createElement("button");
      ver.type = "button"; ver.textContent = "ver";
      ver.title = "leva o mapa ao ponto de referência desta massa";
      ver.addEventListener("click", () => {
        const [lon, lat] = m.geometry.coordinates;
        mapa.setView([lat, lon], Math.max(mapa.getZoom(), 3));
      });
      li.append(rotulo, seletor, ver);
      listaMassas.appendChild(li);
    }
  }

  function preencherPais() {
    campoPai.innerHTML = "";
    const nenhum = document.createElement("option");
    nenhum.value = ""; nenhum.textContent = "(nenhum)";
    campoPai.appendChild(nenhum);
    for (const r of regioes) {
      if (r.id === idSelecionado) continue;
      const op = document.createElement("option");
      op.value = r.id; op.textContent = r.nome;
      campoPai.appendChild(op);
    }
  }

  function preencherFormulario() {
    preencherPais();
    const r = regioes.find((x) => x.id === idSelecionado);
    if (r) {
      campoId.value = r.id; campoId.disabled = true;
      campoNome.value = r.nome; campoTipo.value = r.tipo; campoPai.value = r.pai || "";
      botaoApagar.disabled = false; botaoRotulo.disabled = false;
      leitura.textContent = `editando ${r.id}`;
    } else {
      campoId.disabled = false;
      botaoApagar.disabled = true; botaoRotulo.disabled = true;
      leitura.textContent = "nova região (preencha e salve)";
    }
  }

  function selecionar(id) {
    idSelecionado = id;
    redesenharLista();
    redesenharRotulos();
    preencherFormulario();
  }

  // --- ações --------------------------------------------------------------------
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const corpo = { nome: campoNome.value, tipo: campoTipo.value, pai: campoPai.value || null };
    let resp;
    if (idSelecionado) {
      resp = await chamar("PUT", `/api/regioes/${encodeURIComponent(idSelecionado)}`, corpo);
    } else {
      // O rótulo nasce no centro da tela; arraste depois para o lugar.
      const c = mapa.getCenter();
      resp = await chamar("POST", "/api/regioes",
        { id: campoId.value.trim(), ...corpo, rotulo: { lon: c.lng, lat: c.lat } });
      if (resp.dados) idSelecionado = campoId.value.trim();
    }
    if (resp.dados) aplicar(resp.dados);
    atualizarBotoesPilhaSeExistir();
  });

  botaoNova.addEventListener("click", () => {
    idSelecionado = null;
    campoId.value = ""; campoNome.value = ""; campoTipo.value = "ilha"; campoPai.value = "";
    redesenharLista(); redesenharRotulos(); preencherFormulario();
    campoId.focus();
  });

  botaoApagar.addEventListener("click", async () => {
    if (!idSelecionado) return;
    const resp = await chamar("DELETE", `/api/regioes/${encodeURIComponent(idSelecionado)}`);
    if (resp.erro) return;
    idSelecionado = null;
    aplicar(resp.dados);
    atualizarBotoesPilhaSeExistir();
  });

  // "pôr rótulo aqui": o próximo clique no mapa vira a posição do rótulo. Serve para
  // região sem rótulo, e para trazer um rótulo que está fora da vista.
  botaoRotulo.addEventListener("click", () => {
    if (!idSelecionado) return;
    esperandoRotulo = true;
    leitura.textContent = "clique no mapa onde o nome vai ficar (Esc cancela)";
    mapa.getContainer().style.cursor = "crosshair";
  });
  mapa.on("click", async (evento) => {
    if (!esperandoRotulo) return;
    esperandoRotulo = false;
    mapa.getContainer().style.cursor = "";
    const resp = await chamar("PUT", `/api/regioes/${encodeURIComponent(idSelecionado)}/rotulo`,
      { rotulo: { lon: evento.latlng.lng, lat: evento.latlng.lat } });
    if (resp.dados) aplicar(resp.dados); else preencherFormulario();
    atualizarBotoesPilhaSeExistir();
  });
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && esperandoRotulo) {
      esperandoRotulo = false;
      mapa.getContainer().style.cursor = "";
      preencherFormulario();
    }
  });

  caixaRotulos.addEventListener("change", redesenharRotulos);

  async function recarregar() {
    const r = await chamar("GET", "/api/regioes");
    if (r.dados) aplicar(r.dados);
  }
  window.recarregarRegioes = recarregar;
  recarregar();
  return { recarregar };
}
