// Camadas de referência (etapa 2, ESPEC-ferramenta.md correção 10): as 4 imagens do
// ChatGPT e os rótulos, como L.imageOverlay esticado sobre um retângulo em lat/lon
// (bounds). Posição/escala = os 4 números do retângulo, editáveis à mão em campos
// numéricos (não arrasto de canto — mais simples, e ajustável do mesmo jeito).

function iniciarCamadasReferencia(mapa, camadasIniciais) {
  const lista = document.getElementById("lista-camadas-referencia");
  const overlaysPorId = {};

  function boundsLeaflet(b) {
    return L.latLngBounds([b.sul, b.oeste], [b.norte, b.leste]);
  }

  function criarOuAtualizarOverlay(camada) {
    let overlay = overlaysPorId[camada.id];
    if (!overlay) {
      overlay = L.imageOverlay(camada.url, boundsLeaflet(camada.bounds), {
        opacity: camada.opacidade,
        interactive: false,
      });
      overlaysPorId[camada.id] = overlay;
    } else {
      overlay.setBounds(boundsLeaflet(camada.bounds));
      overlay.setOpacity(camada.opacidade);
    }
    if (camada.visivel) {
      if (!mapa.hasLayer(overlay)) overlay.addTo(mapa);
    } else {
      if (mapa.hasLayer(overlay)) mapa.removeLayer(overlay);
    }
  }

  async function salvar(id, mudanca) {
    const resp = await fetch(`/api/camadas-referencia/${encodeURIComponent(id)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mudanca),
    });
    if (!resp.ok) {
      const erro = await resp.json().catch(() => ({}));
      alert(`Não salvou: ${erro.detail || resp.status}`);
      return null;
    }
    return resp.json();
  }

  function linhaDaCamada(camada) {
    const linha = document.createElement("div");
    linha.className = "linha-camada-referencia";

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = camada.visivel;
    chk.addEventListener("change", async () => {
      const doc = await salvar(camada.id, { visivel: chk.checked });
      if (doc) criarOuAtualizarOverlay(doc.camadas.find((c) => c.id === camada.id));
    });

    const nome = document.createElement("span");
    nome.textContent = camada.nome;
    nome.className = "nome-camada-referencia";

    const op = document.createElement("input");
    op.type = "range";
    op.min = "0";
    op.max = "1";
    op.step = "0.05";
    op.value = camada.opacidade;
    op.addEventListener("change", async () => {
      const doc = await salvar(camada.id, { opacidade: parseFloat(op.value) });
      if (doc) criarOuAtualizarOverlay(doc.camadas.find((c) => c.id === camada.id));
    });

    const botaoAjustar = document.createElement("button");
    botaoAjustar.textContent = "posição";
    botaoAjustar.type = "button";

    const caixaAjuste = document.createElement("div");
    caixaAjuste.className = "caixa-ajuste-bounds";
    caixaAjuste.style.display = "none";
    const campos = {};
    for (const rotulo of ["sul", "norte", "oeste", "leste"]) {
      const campo = document.createElement("label");
      campo.textContent = rotulo + " ";
      const entrada = document.createElement("input");
      entrada.type = "number";
      entrada.step = "0.01";
      entrada.value = camada.bounds[rotulo];
      campo.appendChild(entrada);
      campos[rotulo] = entrada;
      caixaAjuste.appendChild(campo);
    }
    const botaoSalvarBounds = document.createElement("button");
    botaoSalvarBounds.type = "button";
    botaoSalvarBounds.textContent = "aplicar";
    botaoSalvarBounds.addEventListener("click", async () => {
      const bounds = {
        sul: parseFloat(campos.sul.value),
        norte: parseFloat(campos.norte.value),
        oeste: parseFloat(campos.oeste.value),
        leste: parseFloat(campos.leste.value),
      };
      const doc = await salvar(camada.id, { bounds });
      if (doc) criarOuAtualizarOverlay(doc.camadas.find((c) => c.id === camada.id));
    });
    caixaAjuste.appendChild(botaoSalvarBounds);

    botaoAjustar.addEventListener("click", () => {
      caixaAjuste.style.display = caixaAjuste.style.display === "none" ? "block" : "none";
    });

    linha.appendChild(chk);
    linha.appendChild(nome);
    linha.appendChild(op);
    linha.appendChild(botaoAjustar);
    linha.appendChild(caixaAjuste);
    return linha;
  }

  for (const camada of camadasIniciais.camadas) {
    lista.appendChild(linhaDaCamada(camada));
    criarOuAtualizarOverlay(camada);
  }
}
