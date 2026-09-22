// Ferramenta de Lugar (ponto) -- B2 da rodada noturna de 2026-09-22.
// UI deliberadamente simples (prompt()/confirm() nativos do navegador, não modal
// customizado como o de alinhamento): é a primeira ferramenta de desenho da
// ferramenta, o alvo era ter B1 (desfazer/refazer) funcionando de ponta a ponta,
// não uma UI bonita. NÃO TESTADO NUM NAVEGADOR DE VERDADE nesta rodada (só a API,
// por curl -- ver RELATORIO-NOITE.md): dialogs nativos (prompt/confirm) bloqueiam
// automação de navegador por instrução do ambiente desta sessão, então não dava
// para exercitar isto sozinho esta noite.

const TIPOS_LUGAR = ["cidade", "vila", "fortaleza", "porto", "ruina", "marco"];
const IMPORTANCIAS_LUGAR = ["pequena", "media", "grande"]; // null = não classificado (mesmo tratamento visual de "pequena")

function iniciarFerramentaDeLugar(mapa, lugaresIniciais) {
  const camadaLugares = L.layerGroup().addTo(mapa);
  const marcadoresPorId = {};
  let modoAdicionar = false;

  const botaoAdicionar = document.getElementById("lugar-adicionar");
  const botaoDesfazer = document.getElementById("botao-desfazer");
  const botaoRefazer = document.getElementById("botao-refazer");

  async function chamar(metodo, caminho, corpo) {
    const resp = await fetch(caminho, {
      method: metodo,
      headers: corpo ? { "Content-Type": "application/json" } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const dados = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      alert(`Não deu: ${dados.detail || resp.status}`);
      return null;
    }
    return dados;
  }

  function redesenharTudo(featureCollection) {
    camadaLugares.clearLayers();
    for (const id in marcadoresPorId) delete marcadoresPorId[id];
    for (const feature of featureCollection.features) {
      adicionarMarcador(feature);
    }
  }

  // tamanho do marcador por importância -- null tem o MESMO tratamento visual de
  // "pequena" (pedido explícito do usuário, 2026-09-23): não é um terceiro valor.
  const TAMANHO_POR_IMPORTANCIA = { pequena: 18, media: 26, grande: 36 };
  function iconePorImportancia(importancia) {
    const tamanho = TAMANHO_POR_IMPORTANCIA[importancia] || TAMANHO_POR_IMPORTANCIA.pequena;
    return L.divIcon({
      className: "icone-lugar",
      html: `<div style="width:${tamanho}px;height:${tamanho}px"></div>`,
      iconSize: [tamanho, tamanho],
      iconAnchor: [tamanho / 2, tamanho / 2],
    });
  }

  function adicionarMarcador(feature) {
    const [lon, lat] = feature.geometry.coordinates;
    const marcador = L.marker([lat, lon], {
      draggable: true,
      icon: iconePorImportancia(feature.properties.importancia),
    });
    marcador.bindPopup(textoPopup(feature));
    marcador.on("dragend", async () => {
      const p = marcador.getLatLng();
      const doc = await chamar("PUT", `/api/lugares/${encodeURIComponent(feature.properties.id)}/posicao`, {
        lon: p.lng, lat: p.lat,
      });
      if (doc) redesenharTudo(doc);
      else redesenharTudo(await chamar("GET", "/api/lugares"));
    });
    marcador.on("click", () => menuDoLugar(feature));
    marcador.addTo(camadaLugares);
    marcadoresPorId[feature.properties.id] = marcador;
  }

  function textoPopup(feature) {
    const p = feature.properties;
    return `<b>${p.nome || p.id}</b><br>${p.tipo}${p.capital ? " (capital)" : ""}`;
  }

  async function menuDoLugar(feature) {
    const acao = prompt(
      `Lugar "${feature.properties.id}" (${feature.properties.tipo}).\n` +
      `Digite: "editar", "apagar", ou cancele.`,
      "",
    );
    if (acao === "apagar") {
      if (!confirm(`Apagar "${feature.properties.id}"?`)) return;
      const doc = await chamar("DELETE", `/api/lugares/${encodeURIComponent(feature.properties.id)}`);
      if (doc) redesenharTudo(doc);
    } else if (acao === "editar") {
      const nome = prompt("Nome (em branco mantém o atual):", feature.properties.nome || "");
      if (nome === null) return;
      let importancia = prompt(
        `Importância (${IMPORTANCIAS_LUGAR.join("/")}, em branco = não classificado):`,
        feature.properties.importancia || "",
      );
      if (importancia === null) return;
      importancia = importancia || null;
      if (importancia !== null && !IMPORTANCIAS_LUGAR.includes(importancia)) {
        alert(`Importância inválida: "${importancia}".`);
        return;
      }
      const doc = await chamar("PUT", `/api/lugares/${encodeURIComponent(feature.properties.id)}`, {
        propriedades: { nome, importancia },
      });
      if (doc) redesenharTudo(doc);
    }
  }

  botaoAdicionar.addEventListener("click", () => {
    modoAdicionar = !modoAdicionar;
    botaoAdicionar.textContent = modoAdicionar ? "clique no mapa para criar (cancelar)" : "+ lugar";
    botaoAdicionar.classList.toggle("ativo", modoAdicionar);
  });

  mapa.on("click", async (evento) => {
    if (!modoAdicionar) return;
    modoAdicionar = false;
    botaoAdicionar.textContent = "+ lugar";
    botaoAdicionar.classList.remove("ativo");

    const id = prompt("Id do lugar (único, sem espaço, ex.: vila-do-vau):");
    if (!id) return;
    const tipo = prompt(`Tipo (${TIPOS_LUGAR.join("/")}):`, "vila");
    if (!TIPOS_LUGAR.includes(tipo)) {
      alert(`Tipo inválido: "${tipo}". Tem que ser um de: ${TIPOS_LUGAR.join(", ")}.`);
      return;
    }
    const nome = prompt("Nome (opcional):", "") || null;
    const capital = tipo === "cidade" && confirm("É a capital da região?");
    let importancia = prompt(`Importância (${IMPORTANCIAS_LUGAR.join("/")}, ou em branco = não classificado):`, "") || null;
    if (importancia !== null && !IMPORTANCIAS_LUGAR.includes(importancia)) {
      alert(`Importância inválida: "${importancia}". Tem que ser uma de: ${IMPORTANCIAS_LUGAR.join(", ")}, ou em branco.`);
      return;
    }

    const doc = await chamar("POST", "/api/lugares", {
      id, lon: evento.latlng.lng, lat: evento.latlng.lat,
      propriedades: { tipo, nome, capital, importancia },
    });
    if (doc) redesenharTudo(doc);
  });

  async function atualizarBotoesPilha() {
    const pilha = await chamar("GET", "/api/pilha");
    if (!pilha) return;
    botaoDesfazer.disabled = !pilha.pode_desfazer;
    botaoRefazer.disabled = !pilha.pode_refazer;
  }

  botaoDesfazer.addEventListener("click", async () => {
    const resp = await chamar("POST", "/api/desfazer", {});
    if (resp) {
      redesenharTudo(await chamar("GET", "/api/lugares"));
      atualizarBotoesPilha();
    }
  });
  botaoRefazer.addEventListener("click", async () => {
    const resp = await chamar("POST", "/api/refazer", {});
    if (resp) {
      redesenharTudo(await chamar("GET", "/api/lugares"));
      atualizarBotoesPilha();
    }
  });

  redesenharTudo(lugaresIniciais);
  atualizarBotoesPilha();
}
