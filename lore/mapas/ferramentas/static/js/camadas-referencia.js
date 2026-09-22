// Camadas de referência (etapa 2, ESPEC-ferramenta.md correção 10 + revisão
// 2026-09-23). Dois tipos:
// - 'imagem' (as 4 do ChatGPT): L.imageOverlay esticado sobre um retângulo em
//   lat/lon (bounds). Posição por 4 campos numéricos (ajuste fino) ou pelos
//   botões "reset" (limites do mundo) / "automático" (volta pro resultado do
//   alinhamento automático, scripts/alinhar_chatgpt_auto.py). O alinhamento
//   manual por 2 pontos SAIU da interface em 2026-09-23 (pedido do usuário,
//   substituído pelos dois botões) -- toda mudança de posição passa pelo
//   desfazer (backend/referencias.py -> operacoes.registrar_operacao).
// - 'tile' (Rótulos, Ocean Deep): pirâmide de tiles pré-gerada, já alinhada ao
//   mundo inteiro pela mesma CRS da costa — sem bounds, sem posição ajustável.

// Exposta globalmente (contrato entre os <script src> desta ferramenta, sem
// módulo ES): o desfazer/refazer de lugares.js chama isto quando a operação
// desfeita era uma mudança de POSIÇÃO de camada de referência, pra imagem
// voltar pro lugar certo sem recarregar a página.
let recarregarCamadasReferencia = () => {};

function iniciarCamadasReferencia(mapa, camadasIniciais, opcoesTile) {
  const lista = document.getElementById("lista-camadas-referencia");
  const overlaysPorId = {};
  const controlesOpacidadePorId = {};
  const linhasPorId = {};
  let idCamadaAtiva = null;

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
      return null;
    }
    if (!resp.ok) {
      const erro = await resp.json().catch(() => ({}));
      if (metodo !== "GET") mostrarErroDeGravacao(erro.detail || `erro ${resp.status}`);
      return null;
    }
    if (metodo !== "GET") mostrarSalvo();
    return resp.json();
  }

  async function salvar(id, mudanca) {
    return chamar("POST", `/api/camadas-referencia/${encodeURIComponent(id)}`, mudanca);
  }

  // --- Camada ATIVA (teclas [ e ] mudam a opacidade dela) --------------------
  function selecionarCamadaAtiva(id) {
    idCamadaAtiva = id;
    for (const [outroId, linha] of Object.entries(linhasPorId)) {
      linha.classList.toggle("camada-ativa", outroId === id);
    }
  }

  async function mudarOpacidadeDaAtiva(delta) {
    if (!idCamadaAtiva) return;
    const controle = controlesOpacidadePorId[idCamadaAtiva];
    if (!controle) return;
    const nova = Math.min(1, Math.max(0, Math.round((parseFloat(controle.value) + delta) * 100) / 100));
    controle.value = nova;
    const doc = await salvar(idCamadaAtiva, { opacidade: nova });
    if (doc) criarOuAtualizarOverlay(doc.camadas.find((c) => c.id === idCamadaAtiva));
  }

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
    linhasPorId[camada.id] = linha;

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
    // Clicar no NOME deixa a camada ATIVA: as teclas [ e ] mudam a opacidade
    // dela sem precisar mirar o slider (item 3h de 2026-09-23).
    nome.addEventListener("click", () => selecionarCamadaAtiva(camada.id));

    const op = document.createElement("input");
    op.type = "range";
    op.min = "0";
    op.max = "1";
    op.step = "0.05";
    op.value = camada.opacidade;
    controlesOpacidadePorId[camada.id] = op;
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

    async function atualizarAposMudancaDePosicao(doc) {
      if (!doc) return;
      const atualizada = doc.camadas.find((c) => c.id === camada.id);
      criarOuAtualizarOverlay(atualizada);
      atualizarCamposBounds(camada.id, atualizada.bounds);
    }

    const botaoAjustar = document.createElement("button");
    botaoAjustar.textContent = "posição";
    botaoAjustar.type = "button";

    const caixaAjuste = document.createElement("div");
    caixaAjuste.className = "caixa-ajuste-bounds";
    caixaAjuste.style.display = "none";

    const linhaBotoesPosicao = document.createElement("div");
    linhaBotoesPosicao.className = "linha-botoes-posicao";

    const botaoReset = document.createElement("button");
    botaoReset.type = "button";
    botaoReset.textContent = "reset";
    botaoReset.title = "Encaixa a imagem canto a canto nos limites do mundo";
    botaoReset.addEventListener("click", async () => {
      const doc = await chamar("POST", `/api/camadas-referencia/${encodeURIComponent(camada.id)}/resetar`);
      atualizarAposMudancaDePosicao(doc);
    });

    const botaoAutomatico = document.createElement("button");
    botaoAutomatico.type = "button";
    botaoAutomatico.textContent = "automático";
    botaoAutomatico.title = "Volta para os limites calculados pelo alinhamento automático";
    botaoAutomatico.addEventListener("click", async () => {
      const doc = await chamar("POST", `/api/camadas-referencia/${encodeURIComponent(camada.id)}/automatico`);
      atualizarAposMudancaDePosicao(doc);
    });

    linhaBotoesPosicao.appendChild(botaoReset);
    linhaBotoesPosicao.appendChild(botaoAutomatico);
    caixaAjuste.appendChild(linhaBotoesPosicao);

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
      atualizarAposMudancaDePosicao(doc);
    });
    caixaAjuste.appendChild(botaoSalvarBounds);

    botaoAjustar.addEventListener("click", () => {
      caixaAjuste.style.display = caixaAjuste.style.display === "none" ? "block" : "none";
    });

    linha.appendChild(botaoAjustar);
    linha.appendChild(caixaAjuste);
    return linha;
  }

  for (const camada of camadasIniciais.camadas) {
    lista.appendChild(linhaDaCamada(camada));
    criarOuAtualizarOverlay(camada);
  }

  // Primeira camada 'imagem' começa ativa, pra [ e ] já terem alvo sem clique.
  const primeiraImagem = camadasIniciais.camadas.find((c) => c.tipo === "imagem");
  if (primeiraImagem) selecionarCamadaAtiva(primeiraImagem.id);

  // Recarrega do servidor (usado depois de um desfazer/refazer que mexeu na
  // posição de uma camada): redesenha overlays e campos, sem recriar as linhas.
  recarregarCamadasReferencia = async () => {
    const doc = await chamar("GET", "/api/camadas-referencia");
    if (!doc) return;
    for (const camada of doc.camadas) {
      criarOuAtualizarOverlay(camada);
      if (camada.bounds) atualizarCamposBounds(camada.id, camada.bounds);
      const controle = controlesOpacidadePorId[camada.id];
      if (controle) controle.value = camada.opacidade;
    }
  };

  return { mudarOpacidadeDaAtiva };
}
