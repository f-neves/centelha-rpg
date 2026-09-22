// Camadas de referência (etapa 2, ESPEC-ferramenta.md correção 10 + revisão
// 2026-09-22). Dois tipos:
// - 'imagem' (as 4 do ChatGPT): L.imageOverlay esticado sobre um retângulo em
//   lat/lon (bounds). Posição/escala ajustável por 4 campos numéricos (fino) ou
//   por "alinhar" (2 pontos: clique na imagem + clique no mapa, duas vezes, sem
//   rotação).
// - 'tile' (Rótulos, Ocean Deep): pirâmide de tiles pré-gerada, já alinhada ao
//   mundo inteiro pela mesma CRS da costa — sem bounds, sem posição ajustável.

function iniciarCamadasReferencia(mapa, camadasIniciais, opcoesTile) {
  const lista = document.getElementById("lista-camadas-referencia");
  const overlaysPorId = {};

  function boundsLeaflet(b) {
    return L.latLngBounds([b.sul, b.oeste], [b.norte, b.leste]);
  }

  function criarOuAtualizarOverlay(camada) {
    let overlay = overlaysPorId[camada.id];
    if (camada.tipo === "tile") {
      if (!overlay) {
        overlay = L.tileLayer(camada.url, {
          tileSize: opcoesTile.tileSize,
          minZoom: 0,
          maxZoom: opcoesTile.maxZoomMapa,
          maxNativeZoom: opcoesTile.maxNativeZoom,
          noWrap: true,
          bounds: opcoesTile.bounds,
          opacity: camada.opacidade,
        });
        overlaysPorId[camada.id] = overlay;
      } else {
        overlay.setOpacity(camada.opacidade);
      }
    } else {
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

  // --- Alinhamento por 2 pontos (só camada 'imagem') -----------------------
  // Fluxo: clique 1 na imagem (no modal) -> clique 1 no mapa -> clique 2 na
  // imagem -> clique 2 no mapa -> calcula escala/posição sem rotação e grava.
  const modal = document.getElementById("modal-alinhamento");
  const modalImg = document.getElementById("modal-alinhamento-img");
  const modalInstrucao = document.getElementById("modal-alinhamento-instrucao");
  const modalCancelar = document.getElementById("modal-alinhamento-cancelar");

  let alinhamentoAtivo = null; // { camada, pontosImagem: [], pontosMapa: [] }

  function encerrarAlinhamento() {
    if (alinhamentoAtivo && alinhamentoAtivo.ouvinteMapa) {
      mapa.off("click", alinhamentoAtivo.ouvinteMapa);
    }
    alinhamentoAtivo = null;
    modal.style.display = "none";
    modalImg.onclick = null;
  }

  function atualizarInstrucao() {
    const n = alinhamentoAtivo.pontosImagem.length;
    if (alinhamentoAtivo.pontosImagem.length === alinhamentoAtivo.pontosMapa.length) {
      const proximo = n + 1;
      modalInstrucao.textContent =
        `Ponto ${proximo} de 2: clique no local de referência NA IMAGEM abaixo.`;
    } else {
      modalInstrucao.textContent =
        `Ponto ${n} de 2: agora clique no local CORRESPONDENTE no mapa (atrás deste aviso — feche com "cancelar" se precisar navegar antes).`;
    }
  }

  function calcularEGravarBounds() {
    const [img1, img2] = alinhamentoAtivo.pontosImagem;
    const [map1, map2] = alinhamentoAtivo.pontosMapa;
    const dx = img2.x - img1.x;
    const dy = img2.y - img1.y;
    if (Math.abs(dx) < 1 || Math.abs(dy) < 1) {
      alert("Os dois pontos ficaram quase na mesma posição na imagem — escolha "
        + "pontos mais afastados (um em cada canto, por exemplo). Alinhamento cancelado.");
      encerrarAlinhamento();
      return;
    }
    const escalaX = (map2.lng - map1.lng) / dx;
    const escalaY = (map2.lat - map1.lat) / dy;

    const lonEm = (x) => map1.lng + escalaX * (x - img1.x);
    const latEm = (y) => map1.lat + escalaY * (y - img1.y);

    const lonEsquerda = lonEm(0);
    const lonDireita = lonEm(alinhamentoAtivo.naturalWidth);
    const latTopo = latEm(0);
    const latBase = latEm(alinhamentoAtivo.naturalHeight);

    const bounds = {
      oeste: Math.min(lonEsquerda, lonDireita),
      leste: Math.max(lonEsquerda, lonDireita),
      sul: Math.min(latTopo, latBase),
      norte: Math.max(latTopo, latBase),
    };

    const camada = alinhamentoAtivo.camada;
    encerrarAlinhamento();
    salvar(camada.id, { bounds }).then((doc) => {
      if (doc) {
        const atualizada = doc.camadas.find((c) => c.id === camada.id);
        criarOuAtualizarOverlay(atualizada);
        atualizarCamposBounds(camada.id, atualizada.bounds);
      }
    });
  }

  function cliqueNaImagem(evento) {
    const rect = modalImg.getBoundingClientRect();
    const fracaoX = (evento.clientX - rect.left) / rect.width;
    const fracaoY = (evento.clientY - rect.top) / rect.height;
    const x = fracaoX * alinhamentoAtivo.naturalWidth;
    const y = fracaoY * alinhamentoAtivo.naturalHeight;
    alinhamentoAtivo.pontosImagem.push({ x, y });
    atualizarInstrucao();

    if (alinhamentoAtivo.pontosImagem.length > alinhamentoAtivo.pontosMapa.length) {
      // Aguardando o clique correspondente no mapa: esconde o modal um instante
      // pra não cobrir o mapa (reaparece sozinho no próximo clique na imagem, ou
      // ao completar os 2 pares).
      modal.style.display = "none";
      const ouvinte = (eventoMapa) => {
        alinhamentoAtivo.pontosMapa.push(eventoMapa.latlng);
        mapa.off("click", ouvinte);
        if (alinhamentoAtivo.pontosImagem.length === 2 && alinhamentoAtivo.pontosMapa.length === 2) {
          calcularEGravarBounds();
        } else {
          modal.style.display = "flex";
          atualizarInstrucao();
        }
      };
      alinhamentoAtivo.ouvinteMapa = ouvinte;
      mapa.on("click", ouvinte);
    }
  }

  function iniciarAlinhamento(camada) {
    encerrarAlinhamento();
    const imgTeste = new Image();
    imgTeste.onload = () => {
      alinhamentoAtivo = {
        camada,
        pontosImagem: [],
        pontosMapa: [],
        naturalWidth: imgTeste.naturalWidth,
        naturalHeight: imgTeste.naturalHeight,
      };
      modalImg.src = camada.url;
      modalImg.onclick = cliqueNaImagem;
      modal.style.display = "flex";
      atualizarInstrucao();
    };
    imgTeste.onerror = () => alert("Não consegui carregar a imagem pra alinhar.");
    imgTeste.src = camada.url;
  }
  modalCancelar.addEventListener("click", encerrarAlinhamento);

  // --- Uma linha por camada --------------------------------------------------
  const camposBoundsPorId = {};
  function atualizarCamposBounds(id, bounds) {
    const campos = camposBoundsPorId[id];
    if (!campos) return;
    for (const rotulo of ["sul", "norte", "oeste", "leste"]) {
      campos[rotulo].value = bounds[rotulo];
    }
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

    linha.appendChild(chk);
    linha.appendChild(nome);
    linha.appendChild(op);

    if (camada.tipo === "tile") {
      // Sem posição ajustável: a pirâmide de tiles já cobre o mundo inteiro pela
      // mesma CRS da costa.
      return linha;
    }

    const botaoAlinhar = document.createElement("button");
    botaoAlinhar.type = "button";
    botaoAlinhar.textContent = "alinhar";
    botaoAlinhar.title = "Alinhar por 2 pontos (clique na imagem + clique no mapa, duas vezes)";
    botaoAlinhar.addEventListener("click", () => iniciarAlinhamento(camada));

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
    camposBoundsPorId[camada.id] = campos;
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

    linha.appendChild(botaoAlinhar);
    linha.appendChild(botaoAjustar);
    linha.appendChild(caixaAjuste);
    return linha;
  }

  for (const camada of camadasIniciais.camadas) {
    lista.appendChild(linhaDaCamada(camada));
    criarOuAtualizarOverlay(camada);
  }
}
