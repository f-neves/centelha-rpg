// Régua de distância real (grande círculo, haversine) + grade de latitude/longitude
// ligável -- B3 da rodada noturna de 2026-09-22 (ESPEC-ferramenta.md, "Régua, grade
// e prévia"). Distância NUNCA usa a régua da tela (pixel): a projeção é
// equirretangular sem correção por cos(latitude), então pixel não vale distância
// real fora do equador -- só grande círculo sobre o raio do planeta de Uldun
// (dados/coordenadas.json, injetado como PARAMETROS_LEAFLET.raio_km) serve.
//
// A mesma fórmula está espelhada em ferramentas/tests/test_haversine.py (Python),
// conferida contra dois casos fechados: a distância antípoda bate EXATAMENTE com
// planeta.distancia_polo_a_polo_km (já gravado em dados/coordenadas.json, "distância
// já calculada e registrada" que o usuário pediu para testar) e o arco de meridiano
// entre 0° e 60° de latitude bate com raio_km * radianos(60), fórmula fechada
// independente do haversine. NÃO consegui reconstruir o ponto exato usado para medir
// "The Neck <-> Calin" (2.217,9 km, CARTOGRAFO.md) -- o ponto de referência de cada
// ilha em massas.geojson é o centro usado pra identificação por inundação, não o
// ponto de aproximação mais próxima entre as duas costas, e o script/pontos daquela
// medição não sobreviveram no repositório. Registrado em RELATORIO-NOITE.md como
// pendência, não inventado.

function haversineKm(lat1, lon1, lat2, lon2, raioKm) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * raioKm * Math.asin(Math.sqrt(a));
}

function iniciarRegua(mapa, raioKm) {
  const botaoRegua = document.getElementById("regua-ativar");
  const leituraRegua = document.getElementById("regua-leitura");
  let ativa = false;
  let pontos = [];
  let linha = null;
  let marcadores = [];

  function limpar() {
    pontos = [];
    if (linha) { mapa.removeLayer(linha); linha = null; }
    for (const m of marcadores) mapa.removeLayer(m);
    marcadores = [];
    leituraRegua.textContent = "";
  }

  botaoRegua.addEventListener("click", () => {
    ativa = !ativa;
    botaoRegua.textContent = ativa ? "régua (clique 2 pontos; cancelar)" : "régua";
    botaoRegua.classList.toggle("ativo", ativa);
    limpar();
  });

  mapa.on("click", (evento) => {
    if (!ativa) return;
    pontos.push(evento.latlng);
    marcadores.push(L.circleMarker(evento.latlng, { radius: 4, color: "#e53935" }).addTo(mapa));
    if (pontos.length === 2) {
      if (linha) mapa.removeLayer(linha);
      linha = L.polyline(pontos, { color: "#e53935", weight: 2, dashArray: "6,4" }).addTo(mapa);
      const km = haversineKm(pontos[0].lat, pontos[0].lng, pontos[1].lat, pontos[1].lng, raioKm);
      leituraRegua.textContent = `${km.toFixed(1)} km (linha reta, grande círculo)`;
      pontos = []; // próximo clique começa uma régua nova, mantém a última desenhada
      marcadores = [];
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
