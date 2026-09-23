// Ferramenta de Lugar (ponto) -- B2 (2026-09-22), reescrita em 2026-09-23 com
// modal próprio no lugar dos prompt()/confirm() nativos, símbolo por tipo,
// tamanho por importância e lista lateral com busca.
//
// Regra de confirmação (item 3i do pedido): APAGAR UM LUGAR NÃO PERGUNTA, porque
// o desfazer cobre (é uma operação registrada em operacoes.py). Confirmação fica
// só pra ação destrutiva SEM desfazer -- hoje, só "limpar todas as medições" da
// régua, que é estado do navegador e não passa pelo log de operações.

const TIPOS_LUGAR = ["cidade", "vila", "fortaleza", "porto", "ruina", "marco"];
const IMPORTANCIAS_LUGAR = ["pequena", "media", "grande"]; // null = não classificado (mesmo tratamento visual de "pequena")

// Símbolo por tipo (item 3f). Glifos unicode em vez de imagem: a ferramenta não
// tem biblioteca de símbolos ainda (isso é fase posterior, depois das 12 etapas
// -- ver CARTOGRAFO.md), e um glifo já distingue os 6 tipos sem inventar arte
// que depois teria que ser jogada fora.
const SIMBOLO_POR_TIPO = {
  cidade: "◉",
  vila: "●",
  fortaleza: "▲",
  porto: "⚓",
  ruina: "✖",
  marco: "★",
};
// null tem o MESMO tratamento visual de "pequena" (decisão de 2026-09-23).
const TAMANHO_POR_IMPORTANCIA = { pequena: 14, media: 20, grande: 28 };

function iniciarFerramentaDeLugar(mapa, lugaresIniciais, travasIniciais) {
  const camadaLugares = L.layerGroup().addTo(mapa);
  const marcadoresPorId = {};
  let featuresAtuais = [];
  let idSelecionado = null;
  let modoAdicionar = false;
  // Cadeado geral da camada (item 1d). É um flag SEPARADO: travar a camada não
  // escreve nada em objeto nenhum, então destravar devolve cada um ao que era.
  let camadaTravada = false;

  const botaoAdicionar = document.getElementById("lugar-adicionar");
  const botaoTravaCamada = document.getElementById("trava-camada-lugares");
  const botaoDesfazer = document.getElementById("botao-desfazer");
  const botaoRefazer = document.getElementById("botao-refazer");
  const listaLateral = document.getElementById("lista-lugares");
  const campoBusca = document.getElementById("busca-lugares");

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
      // Servidor fora do ar / rede: erro de gravação tem que ficar VISÍVEL.
      if (metodo !== "GET") mostrarErroDeGravacao("o servidor não respondeu");
      return { erro: "o servidor não respondeu" };
    }
    const dados = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      const mensagem = dados.detail || `erro ${resp.status}`;
      // 409 = recusado por TRAVA (item 1b): aviso discreto, nunca a faixa de
      // "NÃO SALVOU" -- nada falhou, o objeto é que está protegido.
      if (resp.status === 409) {
        mostrarAviso(mensagem);
        return { erro: mensagem, travado: true };
      }
      if (metodo !== "GET") mostrarErroDeGravacao(mensagem);
      return { erro: mensagem };
    }
    if (metodo !== "GET") mostrarSalvo();
    return { dados };
  }

  // --- Trava (item 1) -------------------------------------------------------
  // A trava EFETIVA é a OU das duas: a do objeto e a da camada.
  function estaTravado(feature) {
    return camadaTravada || Boolean(feature.properties.travado);
  }
  function aplicarTravas(docTravas) {
    const camada = (docTravas.camadas || []).find((c) => c.id === "lugares");
    camadaTravada = Boolean(camada && camada.travada);
    if (botaoTravaCamada) {
      botaoTravaCamada.textContent = camadaTravada ? "🔒 camada travada" : "🔓 camada livre";
      botaoTravaCamada.classList.toggle("ativo", camadaTravada);
      botaoTravaCamada.title = camadaTravada
        ? "Destravar a camada de lugares (cada lugar volta ao estado individual dele)"
        : "Travar todos os lugares de uma vez, sem mexer no estado individual de cada um";
    }
  }
  async function recarregarTravas() {
    const r = await chamar("GET", "/api/travas");
    if (r.dados) aplicarTravas(r.dados);
  }
  if (botaoTravaCamada) {
    botaoTravaCamada.addEventListener("click", async () => {
      const r = await chamar("POST", "/api/travas/lugares", { travada: !camadaTravada });
      if (r.erro) return;
      aplicarTravas(r.dados);
      const atual = await chamar("GET", "/api/lugares");
      if (atual.dados) redesenharTudo(atual.dados);
      atualizarBotoesPilha();
    });
  }
  async function alternarTravaDe(id) {
    const feature = featuresAtuais.find((f) => f.properties.id === id);
    if (!feature) return;
    const r = await chamar("POST", `/api/lugares/${encodeURIComponent(id)}/trava`, {
      travado: !feature.properties.travado,
    });
    if (r.erro) return { erro: r.erro };
    redesenharTudo(r.dados);
    atualizarBotoesPilha();
    mostrarAviso(feature.properties.travado ? "lugar destravado" : "lugar travado");
    return {};
  }
  function alternarTravaDoSelecionado() {
    if (!idSelecionado) { mostrarAviso("nenhum lugar selecionado"); return; }
    alternarTravaDe(idSelecionado);
  }

  // --- Desenho --------------------------------------------------------------
  function iconeDoLugar(feature, selecionado) {
    const p = feature.properties;
    const tamanho = TAMANHO_POR_IMPORTANCIA[p.importancia] || TAMANHO_POR_IMPORTANCIA.pequena;
    const simbolo = SIMBOLO_POR_TIPO[p.tipo] || "●";
    const travado = estaTravado(feature);
    const classe = "icone-lugar" + (selecionado ? " selecionado" : "")
      + (p.capital ? " capital" : "") + (travado ? " travado" : "");
    // Indicação visual discreta do travado (item 1e): um cadeadinho ao lado do
    // símbolo, sem mudar o símbolo nem a cor do lugar.
    const cadeado = travado ? `<i class="cadeado-lugar">🔒</i>` : "";
    return L.divIcon({
      className: classe,
      html: `<span style="font-size:${tamanho}px;line-height:${tamanho}px">${simbolo}</span>${cadeado}`,
      iconSize: [tamanho, tamanho],
      iconAnchor: [tamanho / 2, tamanho / 2],
    });
  }

  function adicionarMarcador(feature) {
    const [lon, lat] = feature.geometry.coordinates;
    const id = feature.properties.id;
    const marcador = L.marker([lat, lon], {
      // Travado não arrasta: o jeito limpo é o marcador nem nascer arrastável
      // (item 1b), em vez de cancelar o arrasto no meio e brigar com o Leaflet.
      draggable: !estaTravado(feature),
      icon: iconeDoLugar(feature, id === idSelecionado),
      title: feature.properties.nome || id,
    });
    marcador.on("dragend", async () => {
      const p = marcador.getLatLng();
      const r = await chamar("PUT", `/api/lugares/${encodeURIComponent(id)}/posicao`, {
        lon: p.lng, lat: p.lat,
      });
      // Se o servidor recusou (ex.: caiu no mar), redesenha do estado REAL --
      // o marcador não pode ficar num lugar que o dado não tem.
      const atual = r.dados || (await chamar("GET", "/api/lugares")).dados;
      if (atual) redesenharTudo(atual);
      atualizarBotoesPilha();
    });
    marcador.on("click", (evento) => {
      L.DomEvent.stopPropagation(evento);
      selecionar(id);
      abrirModalEdicao(feature);
    });
    marcador.on("mouseover", () => travarSobCursor(
      `${feature.properties.nome || id} (${feature.properties.tipo})${estaTravado(feature) ? " 🔒 travado" : ""}`
    ));
    marcador.on("mouseout", () => destravarSobCursor());
    marcador.addTo(camadaLugares);
    marcadoresPorId[id] = marcador;
  }

  function redesenharTudo(featureCollection) {
    featuresAtuais = featureCollection.features || [];
    camadaLugares.clearLayers();
    for (const id in marcadoresPorId) delete marcadoresPorId[id];
    for (const feature of featuresAtuais) adicionarMarcador(feature);
    redesenharLista();
  }

  // --- Lista lateral com busca (item 3b) ------------------------------------
  function redesenharLista() {
    const filtro = (campoBusca.value || "").trim().toLowerCase();
    listaLateral.innerHTML = "";
    const visiveis = featuresAtuais.filter((f) => {
      if (!filtro) return true;
      const p = f.properties;
      return (p.nome || "").toLowerCase().includes(filtro) || p.id.toLowerCase().includes(filtro);
    });
    if (visiveis.length === 0) {
      const vazio = document.createElement("li");
      vazio.className = "nota";
      vazio.textContent = featuresAtuais.length === 0 ? "nenhum lugar ainda" : "nada com esse nome";
      listaLateral.appendChild(vazio);
      return;
    }
    for (const feature of visiveis) {
      const p = feature.properties;
      const item = document.createElement("li");
      item.className = "item-lugar" + (p.id === idSelecionado ? " selecionado" : "");
      item.innerHTML = `<span class="simbolo-lista">${SIMBOLO_POR_TIPO[p.tipo] || "●"}</span>`
        + `<span class="nome-lista">${p.nome || p.id}</span>`
        + `<span class="tipo-lista">${p.tipo}</span>`
        + (estaTravado(feature) ? `<span class="cadeado-lista" title="travado">🔒</span>` : "");
      item.addEventListener("click", () => {
        selecionar(p.id);
        const [lon, lat] = feature.geometry.coordinates;
        mapa.panTo([lat, lon]);
      });
      listaLateral.appendChild(item);
    }
  }
  campoBusca.addEventListener("input", redesenharLista);

  // Destaque recíproco: selecionar no mapa destaca na lista e vice-versa.
  // Só os DOIS marcadores que mudam de estado são redesenhados (o que perdeu e o
  // que ganhou o destaque), não a coleção inteira -- com muitos lugares, um
  // setIcon por marcador a cada clique seria trabalho à toa.
  function selecionar(id) {
    const anterior = idSelecionado;
    idSelecionado = id;
    // Selecionar um lugar desmarca a área selecionada, e vice-versa (areas.js):
    // a tecla T age sobre UM objeto, o último escolhido.
    if (id && typeof window.limparSelecaoDeArea === "function") window.limparSelecaoDeArea();
    for (const alvo of [anterior, id]) {
      if (!alvo) continue;
      const feature = featuresAtuais.find((f) => f.properties.id === alvo);
      const marcador = marcadoresPorId[alvo];
      if (feature && marcador) marcador.setIcon(iconeDoLugar(feature, alvo === id));
    }
    redesenharLista();
  }
  window.limparSelecaoDeLugar = () => { if (idSelecionado) selecionar(null); };

  // --- Modal (item 2) -------------------------------------------------------
  const modal = document.getElementById("modal-lugar");
  const form = document.getElementById("form-lugar");
  const tituloModal = document.getElementById("titulo-modal-lugar");
  const campoNome = document.getElementById("campo-lugar-nome");
  const campoId = document.getElementById("campo-lugar-id");
  const campoTipo = document.getElementById("campo-lugar-tipo");
  const campoImportancia = document.getElementById("campo-lugar-importancia");
  const campoCapital = document.getElementById("campo-lugar-capital");
  const campoLat = document.getElementById("campo-lugar-lat");
  const campoLon = document.getElementById("campo-lugar-lon");
  const erroModal = document.getElementById("erro-modal-lugar");
  const campoTravado = document.getElementById("campo-lugar-travado");
  const notaTravado = document.getElementById("nota-lugar-travado");
  const botaoApagar = document.getElementById("botao-lugar-apagar");
  const botaoSalvarOutro = document.getElementById("botao-lugar-salvar-outro");

  let edicaoDe = null; // id do lugar sendo editado, ou null quando é criação

  function mostrarErroNoModal(mensagem) {
    erroModal.textContent = mensagem;
    erroModal.hidden = false;
  }
  function limparErroDoModal() {
    erroModal.textContent = "";
    erroModal.hidden = true;
  }

  function sugerirId(nome) {
    return (nome || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "") // tira acento
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  campoNome.addEventListener("input", () => {
    // Só sugere enquanto está CRIANDO e o usuário não digitou um id próprio.
    if (edicaoDe !== null || campoId.dataset.editadoAMao === "sim") return;
    campoId.value = sugerirId(campoNome.value);
  });
  campoId.addEventListener("input", () => { campoId.dataset.editadoAMao = "sim"; });

  function atualizarNotaCapital() {
    const ehCidade = campoTipo.value === "cidade";
    campoCapital.disabled = !ehCidade;
    if (!ehCidade) campoCapital.checked = false;
    document.getElementById("nota-capital").textContent = ehCidade ? "" : "(só em cidade)";
  }
  campoTipo.addEventListener("change", atualizarNotaCapital);

  function abrirModal({ titulo, feature, lat, lon }) {
    limparErroDoModal();
    tituloModal.textContent = titulo;
    edicaoDe = feature ? feature.properties.id : null;
    const p = feature ? feature.properties : {};
    campoNome.value = p.nome || "";
    campoId.value = p.id || "";
    campoId.readOnly = Boolean(feature); // id é permanente: só editável na criação
    campoId.dataset.editadoAMao = feature ? "sim" : "";
    campoTipo.value = p.tipo || "vila";
    campoImportancia.value = p.importancia || "";
    campoCapital.checked = Boolean(p.capital);
    const coords = feature ? feature.geometry.coordinates : [lon, lat];
    campoLon.value = Number(coords[0]).toFixed(4);
    campoLat.value = Number(coords[1]).toFixed(4);
    atualizarNotaCapital();
    campoTravado.checked = Boolean(p.travado);
    atualizarEstadoTravadoNoModal(feature);
    botaoApagar.hidden = !feature;
    botaoSalvarOutro.hidden = Boolean(feature);
    modal.style.display = "flex";
    campoNome.focus();
    campoNome.select();
  }

  // Com o lugar travado, o modal vira só leitura, menos a própria trava: é o que
  // faz "destravar" ser o único caminho para editar de novo, e evita mandar pro
  // servidor uma edição que ele vai recusar. Com a CAMADA travada, nem a trava
  // individual muda (mudaria um estado sem efeito nenhum enquanto a camada
  // mandasse).
  function atualizarEstadoTravadoNoModal(feature) {
    const travadoAgora = feature ? estaTravado(feature) : camadaTravada;
    const campos = [campoNome, campoId, campoTipo, campoImportancia, campoCapital, campoLat, campoLon];
    for (const campo of campos) campo.disabled = travadoAgora;
    if (!travadoAgora) atualizarNotaCapital(); // devolve a regra "capital só em cidade"
    campoTravado.disabled = camadaTravada;
    notaTravado.textContent = camadaTravada
      ? "(a camada inteira está travada)"
      : (travadoAgora ? "(destrave para editar)" : "");
    document.getElementById("botao-lugar-salvar").disabled = travadoAgora;
    botaoApagar.disabled = travadoAgora;
    botaoSalvarOutro.disabled = travadoAgora;
  }

  campoTravado.addEventListener("change", async () => {
    if (edicaoDe === null) return; // na criação é só o valor inicial do campo
    const r = await alternarTravaDe(edicaoDe);
    const feature = featuresAtuais.find((f) => f.properties.id === edicaoDe);
    if (r && r.erro) { campoTravado.checked = !campoTravado.checked; return; }
    if (feature) atualizarEstadoTravadoNoModal(feature);
  });

  function fecharModal() {
    modal.style.display = "none";
    edicaoDe = null;
  }

  function abrirModalCriacao(latlng) {
    abrirModal({ titulo: "Novo lugar", feature: null, lat: latlng.lat, lon: latlng.lng });
  }
  function abrirModalEdicao(feature) {
    abrirModal({ titulo: `Editar "${feature.properties.nome || feature.properties.id}"`, feature });
  }

  function lerFormulario() {
    const nome = campoNome.value.trim() || null;
    const id = campoId.value.trim();
    const tipo = campoTipo.value;
    const importancia = campoImportancia.value || null;
    const capital = campoCapital.checked;
    const lat = parseFloat(campoLat.value);
    const lon = parseFloat(campoLon.value);
    return { nome, id, tipo, importancia, capital, lat, lon };
  }

  // Validação NO MODAL (nunca alert -- pedido explícito). A do servidor continua
  // valendo e é a que manda: esta aqui é só pra não fazer ida e volta por um
  // campo em branco. Erro que só o servidor sabe (id repetido, ponto no mar)
  // volta pela resposta e aparece no mesmo lugar.
  function validar(dados) {
    if (!dados.id) return "o id não pode ficar em branco";
    if (!/^[a-z0-9-]+$/.test(dados.id)) return "o id só aceita minúscula, número e hífen";
    if (!TIPOS_LUGAR.includes(dados.tipo)) return `tipo inválido: ${dados.tipo}`;
    if (dados.importancia !== null && !IMPORTANCIAS_LUGAR.includes(dados.importancia)) {
      return `importância inválida: ${dados.importancia}`;
    }
    if (dados.capital && dados.tipo !== "cidade") return "capital só vale em cidade";
    if (!Number.isFinite(dados.lat) || !Number.isFinite(dados.lon)) return "latitude/longitude precisam ser números";
    return null;
  }

  async function salvarDoModal({ criarOutro }) {
    const dados = lerFormulario();
    const erro = validar(dados);
    if (erro) { mostrarErroNoModal(erro); return; }
    limparErroDoModal();

    const propriedades = {
      tipo: dados.tipo, nome: dados.nome, capital: dados.capital, importancia: dados.importancia,
    };
    let resposta;
    if (edicaoDe === null) {
      resposta = await chamar("POST", "/api/lugares", {
        // Na criação o `travado` do formulário entra junto; depois disso ele só
        // muda pelo caminho próprio (/trava), que é o que passa pelo desfazer
        // com nome de operação legível.
        id: dados.id, lon: dados.lon, lat: dados.lat,
        propriedades: { ...propriedades, travado: campoTravado.checked },
      });
    } else {
      resposta = await chamar("PUT", `/api/lugares/${encodeURIComponent(edicaoDe)}`, { propriedades });
      if (!resposta.erro) {
        const antes = featuresAtuais.find((f) => f.properties.id === edicaoDe);
        const [lonAntes, latAntes] = antes ? antes.geometry.coordinates : [null, null];
        if (lonAntes !== dados.lon || latAntes !== dados.lat) {
          resposta = await chamar("PUT", `/api/lugares/${encodeURIComponent(edicaoDe)}/posicao`, {
            lon: dados.lon, lat: dados.lat,
          });
        }
      }
    }
    if (resposta.erro) { mostrarErroNoModal(resposta.erro); return; }

    redesenharTudo(resposta.dados);
    atualizarBotoesPilha();
    if (criarOutro) {
      // "salvar e criar outro": mantém o modal aberto, limpo, pronto pro
      // próximo -- pra marcar vários em sequência sem reabrir nada.
      const tipoAnterior = dados.tipo;
      abrirModal({ titulo: "Novo lugar", feature: null, lat: dados.lat, lon: dados.lon });
      campoTipo.value = tipoAnterior;
      atualizarNotaCapital();
      campoNome.value = "";
      campoId.value = "";
      campoId.dataset.editadoAMao = "";
      campoNome.focus();
    } else {
      fecharModal();
    }
  }

  form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // Enter salva
    salvarDoModal({ criarOutro: false });
  });
  botaoSalvarOutro.addEventListener("click", () => salvarDoModal({ criarOutro: true }));
  document.getElementById("botao-lugar-cancelar").addEventListener("click", fecharModal);
  botaoApagar.addEventListener("click", async () => {
    // Sem confirmação: o desfazer cobre (item 3i).
    const id = edicaoDe;
    if (!id) return;
    const r = await chamar("DELETE", `/api/lugares/${encodeURIComponent(id)}`);
    if (r.erro) { mostrarErroNoModal(r.erro); return; }
    if (idSelecionado === id) idSelecionado = null;
    redesenharTudo(r.dados);
    atualizarBotoesPilha();
    fecharModal();
  });
  modal.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") { evento.stopPropagation(); fecharModal(); }
  });

  // --- Modo de adicionar ----------------------------------------------------
  function ativar() {
    // Camada travada não recebe lugar novo: avisar aqui é melhor do que abrir o
    // modal com todos os campos mortos e deixar o servidor recusar no fim.
    if (camadaTravada) { mostrarAviso("a camada de lugares está travada"); return; }
    modoAdicionar = true;
    botaoAdicionar.classList.add("ativo");
    mapa.getContainer().classList.add("cursor-cruz");
  }
  function desativar() {
    modoAdicionar = false;
    botaoAdicionar.classList.remove("ativo");
    mapa.getContainer().classList.remove("cursor-cruz");
  }
  botaoAdicionar.addEventListener("click", () => {
    if (modoAdicionar) desativar();
    else { desativarTodasAsFerramentas(); ativar(); }
  });
  registrarFerramenta({
    nome: "lugar", tecla: "l", ativar, desativar, estaAtiva: () => modoAdicionar,
  });

  mapa.on("click", (evento) => {
    if (!modoAdicionar || arrastandoComEspaco()) {
      if (!modoAdicionar && idSelecionado) selecionar(null); // clique no fundo desmarca
      return;
    }
    desativar();
    abrirModalCriacao(evento.latlng);
  });

  // --- Desfazer/refazer -----------------------------------------------------
  async function atualizarBotoesPilha() {
    const r = await chamar("GET", "/api/pilha");
    if (r.erro) return;
    botaoDesfazer.disabled = !r.dados.pode_desfazer;
    botaoRefazer.disabled = !r.dados.pode_refazer;
  }

  async function desfazerOuRefazer(caminho) {
    const r = await chamar("POST", caminho, {});
    if (r.erro) return;
    // A operação desfeita pode ter sido uma trava de camada (item 1f) -- as
    // travas vêm antes de redesenhar, senão o mapa nasceria com o cadeado velho.
    await recarregarTravas();
    const atual = await chamar("GET", "/api/lugares");
    if (atual.dados) redesenharTudo(atual.dados);
    // Posição de camada de referência também pode ter sido desfeita -- recarrega
    // as camadas pra imagem voltar pro lugar certo sem F5.
    if (typeof recarregarCamadasReferencia === "function") recarregarCamadasReferencia();
    // Idem para as áreas (B4): a operação desfeita pode ter sido um recorte.
    if (typeof window.recarregarAreas === "function") window.recarregarAreas();
    if (typeof window.recarregarRios === "function") window.recarregarRios();
    atualizarBotoesPilha();
  }
  botaoDesfazer.addEventListener("click", () => desfazerOuRefazer("/api/desfazer"));
  botaoRefazer.addEventListener("click", () => desfazerOuRefazer("/api/refazer"));

  aplicarTravas(travasIniciais || { camadas: [] });
  redesenharTudo(lugaresIniciais);
  atualizarBotoesPilha();
  // Os botões de desfazer/refazer valem para o log inteiro, não só para lugares:
  // a ferramenta de Área chama isto depois de cada gravação dela.
  window.atualizarBotoesDaPilha = atualizarBotoesPilha;

  // O que a interface geral (interface.js) precisa chamar: a tecla T trava/destrava
  // o lugar selecionado.
  return { alternarTravaDoSelecionado };
}
