// Régua de distância real (grande círculo, haversine) + grade de latitude/longitude
// ligável -- B3 (2026-09-22) reescrita em 2026-09-23 com: vários pontos na mesma
// régua (trecho a trecho + total), rótulo escrito sobre a linha (nunca de cabeça
// pra baixo), apagar uma medição clicando nela / botão "limpar todas" / Esc cancela
// a medição em andamento, tempo de viagem de referência junto do total, e um botão
// pra salvar a medição em dados/medicoes.json (com controle negativo no backend,
// ver tests/test_medicoes.py). Distância NUNCA usa a régua da tela (pixel): a
// projeção é equirretangular sem correção por cos(latitude), então pixel não vale
// distância real fora do equador -- só grande círculo sobre o raio do planeta de
// Uldun (dados/coordenadas.json, injetado como PARAMETROS_LEAFLET.raio_km) serve.
//
// A mesma fórmula está espelhada em ferramentas/tests/test_haversine.py (Python).

function haversineKm(lat1, lon1, lat2, lon2, raioKm) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * raioKm * Math.asin(Math.sqrt(a));
}

// Tempo de viagem de referência (dias), não regra do sistema -- Centelha ainda
// não tem regra própria de km/dia (CARTOGRAFO.md).
const VELOCIDADES_REFERENCIA = [
  { nome: "a pé", kmDia: 25 },
  { nome: "caravana", kmDia: 30 },
  { nome: "a cavalo", kmDia: 50 },
  { nome: "barco médio", kmDiaMin: 100, kmDiaMax: 130 },
];

function textoTemposDeViagem(distanciaKm) {
  return VELOCIDADES_REFERENCIA.map((v) => {
    if (v.kmDiaMax) {
      const min = (distanciaKm / v.kmDiaMax).toFixed(1);
      const max = (distanciaKm / v.kmDiaMin).toFixed(1);
      return `${v.nome} ${min}-${max}d`;
    }
    return `${v.nome} ${(distanciaKm / v.kmDia).toFixed(1)}d`;
  }).join(" · ");
}

function iniciarRegua(mapa, raioKm) {
  const botaoRegua = document.getElementById("regua-ativar");
  const botaoLimpar = document.getElementById("regua-limpar");
  const leituraRegua = document.getElementById("regua-leitura");
  let ativa = false;
  let medicaoAtual = null; // { pontos: [latlng], linha, marcadoresPonto: [], rotulosTrecho: [], marcadorResumo }
  const medicoes = []; // todas as medições finalizadas nesta sessão do navegador

  function porCentroDoSegmento(p1, p2) {
    return L.latLng((p1.lat + p2.lat) / 2, (p1.lng + p2.lng) / 2);
  }

  // Ângulo do segmento em espaço de TELA -- constante para pan/zoom nesta CRS
  // (escala uniforme + translação preservam direção), calculado uma vez na
  // criação do rótulo. Nunca de cabeça para baixo: se o ângulo cai fora de
  // [-90°, 90°], soma 180° pra virar o texto.
  function anguloLegivelGraus(p1, p2) {
    const t1 = mapa.latLngToContainerPoint(p1);
    const t2 = mapa.latLngToContainerPoint(p2);
    let angulo = Math.atan2(t2.y - t1.y, t2.x - t1.x) * (180 / Math.PI);
    if (angulo > 90 || angulo < -90) angulo += 180;
    return angulo;
  }

  function criarRotuloTrecho(p1, p2, distanciaKm) {
    const centro = porCentroDoSegmento(p1, p2);
    const angulo = anguloLegivelGraus(p1, p2);
    const icone = L.divIcon({
      className: "rotulo-regua-trecho",
      html: `<span style="transform: rotate(${angulo}deg)">${distanciaKm.toFixed(1)} km</span>`,
      iconSize: [80, 16],
      iconAnchor: [40, 8],
    });
    return L.marker(centro, { icon: icone, interactive: false }).addTo(mapa);
  }

  function distanciaTotal(pontos) {
    let total = 0;
    const trechos = [];
    for (let i = 1; i < pontos.length; i++) {
      const d = haversineKm(pontos[i - 1].lat, pontos[i - 1].lng, pontos[i].lat, pontos[i].lng, raioKm);
      trechos.push(d);
      total += d;
    }
    return { total, trechos };
  }

  function apagarMedicao(m) {
    mapa.removeLayer(m.linha);
    for (const marc of m.marcadoresPonto) mapa.removeLayer(marc);
    for (const rot of m.rotulosTrecho) mapa.removeLayer(rot);
    if (m.marcadorResumo) mapa.removeLayer(m.marcadorResumo);
    const i = medicoes.indexOf(m);
    if (i >= 0) medicoes.splice(i, 1);
  }

  function limparTudo() {
    if (medicaoAtual) {
      apagarMedicaoEmAndamento();
    }
    for (const m of [...medicoes]) apagarMedicao(m);
  }
  botaoLimpar.addEventListener("click", () => {
    if (medicoes.length === 0 && !medicaoAtual) return;
    if (confirm("Apagar TODAS as medições da régua?")) limparTudo();
  });

  function apagarMedicaoEmAndamento() {
    if (!medicaoAtual) return;
    if (medicaoAtual.linha) mapa.removeLayer(medicaoAtual.linha);
    for (const marc of medicaoAtual.marcadoresPonto) mapa.removeLayer(marc);
    for (const rot of medicaoAtual.rotulosTrecho) mapa.removeLayer(rot);
    medicaoAtual = null;
    leituraRegua.textContent = "";
  }

  // --- Modal de salvar medição (2026-09-23: substitui o prompt() nativo,
  // mesmo padrão do modal de Lugar -- Enter salva, Esc cancela, erro aparece
  // dentro do modal e nunca em alert) ---------------------------------------
  const modalMedicao = document.getElementById("modal-medicao");
  const formMedicao = document.getElementById("form-medicao");
  const campoNomeMedicao = document.getElementById("campo-medicao-nome");
  const resumoModalMedicao = document.getElementById("resumo-modal-medicao");
  const erroModalMedicao = document.getElementById("erro-modal-medicao");
  let medicaoNoModal = null;

  function fecharModalMedicao() {
    modalMedicao.style.display = "none";
    medicaoNoModal = null;
  }
  function abrirModalMedicao(m) {
    medicaoNoModal = m;
    const { total } = distanciaTotal(m.pontos);
    resumoModalMedicao.textContent =
      `${m.pontos.length} pontos, ${total.toFixed(1)} km — ${textoTemposDeViagem(total)}`;
    campoNomeMedicao.value = m.nome || "";
    erroModalMedicao.hidden = true;
    modalMedicao.style.display = "flex";
    campoNomeMedicao.focus();
    campoNomeMedicao.select();
  }
  document.getElementById("botao-medicao-cancelar").addEventListener("click", fecharModalMedicao);
  modalMedicao.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") { evento.stopPropagation(); fecharModalMedicao(); }
  });
  formMedicao.addEventListener("submit", async (evento) => {
    evento.preventDefault(); // Enter salva
    if (!medicaoNoModal) return;
    const erro = await gravarMedicao(medicaoNoModal, campoNomeMedicao.value.trim() || null);
    if (erro) {
      erroModalMedicao.textContent = erro;
      erroModalMedicao.hidden = false;
      return;
    }
    fecharModalMedicao();
  });

  // Devolve null quando deu certo, ou a mensagem de erro (que o modal mostra).
  async function gravarMedicao(m, nome) {
    const { total, trechos } = distanciaTotal(m.pontos);
    mostrarSalvando();
    let resp;
    try {
      resp = await fetch("/api/medicoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pontos: m.pontos.map((p) => ({ lat: p.lat, lon: p.lng })),
          trechos_km: trechos,
          distancia_total_km: total,
          nome,
        }),
      });
    } catch (e) {
      mostrarErroDeGravacao("o servidor não respondeu");
      return "o servidor não respondeu";
    }
    if (!resp.ok) {
      const erro = await resp.json().catch(() => ({}));
      const mensagem = erro.detail || `erro ${resp.status}`;
      mostrarErroDeGravacao(mensagem);
      return mensagem;
    }
    m.nome = nome;
    mostrarSalvo();
    return null;
  }

  function salvarMedicao(m) {
    abrirModalMedicao(m);
  }

  function finalizarMedicaoAtual() {
    if (!medicaoAtual || medicaoAtual.pontos.length < 2) {
      apagarMedicaoEmAndamento();
      return;
    }
    const m = medicaoAtual;
    medicaoAtual = null;

    // Clique na LINHA apaga a medição (pedido explícito); popup de confirmação
    // evita apagar sem querer com um clique acidental.
    m.linha.on("click", (evento) => {
      L.DomEvent.stopPropagation(evento);
      if (confirm(`Apagar esta medição (${m.pontos.length} pontos)?`)) apagarMedicao(m);
    });

    const { total, trechos } = distanciaTotal(m.pontos);
    const resumoHtml = `<b>${total.toFixed(1)} km</b><br><span style="font-size:10px">${textoTemposDeViagem(total)}</span>`;
    const marcadorResumo = L.marker(m.pontos[m.pontos.length - 1], {
      icon: L.divIcon({
        className: "resumo-regua",
        html: `<div>${resumoHtml}<br><button type="button" class="botao-salvar-medicao">salvar</button></div>`,
        iconSize: null,
        iconAnchor: [0, 0],
      }),
      interactive: true,
    }).addTo(mapa);
    marcadorResumo.on("add", () => {
      const botao = marcadorResumo.getElement().querySelector(".botao-salvar-medicao");
      if (botao) botao.addEventListener("click", (ev) => {
        ev.stopPropagation();
        salvarMedicao(m);
      });
    });
    m.marcadorResumo = marcadorResumo;
    medicoes.push(m);
    leituraRegua.textContent = "";
  }

  function comecarOuContinuarMedicao(latlng) {
    if (!medicaoAtual) {
      medicaoAtual = {
        pontos: [], linha: L.polyline([], { color: "#e53935", weight: 2, dashArray: "6,4" }).addTo(mapa),
        marcadoresPonto: [], rotulosTrecho: [],
      };
    }
    medicaoAtual.pontos.push(latlng);
    medicaoAtual.marcadoresPonto.push(
      L.circleMarker(latlng, { radius: 4, color: "#e53935" }).addTo(mapa),
    );
    medicaoAtual.linha.setLatLngs(medicaoAtual.pontos);

    if (medicaoAtual.pontos.length >= 2) {
      const p1 = medicaoAtual.pontos[medicaoAtual.pontos.length - 2];
      const p2 = medicaoAtual.pontos[medicaoAtual.pontos.length - 1];
      const d = haversineKm(p1.lat, p1.lng, p2.lat, p2.lng, raioKm);
      medicaoAtual.rotulosTrecho.push(criarRotuloTrecho(p1, p2, d));
      const { total } = distanciaTotal(medicaoAtual.pontos);
      leituraRegua.textContent = `${medicaoAtual.pontos.length} pontos, total ${total.toFixed(1)} km (duplo-clique pra terminar)`;
    } else {
      leituraRegua.textContent = "1º ponto marcado -- clique o próximo (Esc cancela)";
    }
  }

  function ativar() {
    ativa = true;
    botaoRegua.classList.add("ativo");
    mapa.getContainer().classList.add("cursor-cruz");
    // O duplo-clique TERMINA a medição enquanto a régua está ligada, então o
    // zoom por duplo-clique do Leaflet sai de cena nesse meio-tempo (senão
    // terminar a medição dava um zoom de brinde, que ninguém pediu).
    mapa.doubleClickZoom.disable();
  }
  function desativar() {
    ativa = false;
    botaoRegua.classList.remove("ativo");
    mapa.getContainer().classList.remove("cursor-cruz");
    mapa.doubleClickZoom.enable();
    finalizarMedicaoAtual();
  }
  botaoRegua.addEventListener("click", () => {
    if (ativa) desativar();
    else { desativarTodasAsFerramentas(); ativar(); }
  });
  registrarFerramenta({ nome: "regua", tecla: "r", ativar, desativar, estaAtiva: () => ativa });

  mapa.on("click", (evento) => {
    if (!ativa || arrastandoComEspaco()) return;
    comecarOuContinuarMedicao(evento.latlng);
  });

  mapa.on("dblclick", (evento) => {
    if (!ativa || !medicaoAtual) return;
    L.DomEvent.stopPropagation(evento);
    finalizarMedicaoAtual();
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && medicaoAtual) {
      apagarMedicaoEmAndamento();
    }
  });
}

function iniciarGradeLatLon(mapa, limites) {
  const chk = document.getElementById("grade-latlon-ativa");
  const grupo = L.layerGroup();
  const PASSO = 10; // grau -- fixo, sem UI de configurar (ESPEC não pede ajustável)

  function construirGrade() {
    grupo.clearLayers();
    const estilo = { color: "#555", weight: 0.6, opacity: 0.6, interactive: false };
    for (let lat = Math.ceil(limites.sul / PASSO) * PASSO; lat <= limites.norte; lat += PASSO) {
      L.polyline([[lat, limites.oeste], [lat, limites.leste]], estilo).addTo(grupo);
    }
    for (let lon = Math.ceil(limites.oeste / PASSO) * PASSO; lon <= limites.leste; lon += PASSO) {
      L.polyline([[limites.sul, lon], [limites.norte, lon]], estilo).addTo(grupo);
    }
  }

  chk.addEventListener("change", () => {
    if (chk.checked) {
      construirGrade();
      grupo.addTo(mapa);
    } else {
      mapa.removeLayer(grupo);
    }
  });
}
