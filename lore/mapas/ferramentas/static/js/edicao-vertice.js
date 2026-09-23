// Edição de vértice de objeto JÁ SALVO (2026-09-23, noite): área e rio.
//
// O Geoman entra só como a caneta, como na criação: uma CÓPIA do objeto é posta numa
// pane própria (z 620, acima de tudo) com o `pm.enable()` do plugin (arrastar vértice,
// clicar no meio de um lado para criar vértice, clique direito no vértice para
// apagar). Enter conclui e manda a geometria inteira ao servidor, que valida de novo
// (área: recorte das vizinhas; rio: segmento, nascente e foz) e responde com o dado
// gravado; a tela redesenha do que voltou. Esc descarta a cópia sem gravar nada.
//
// Contrato (função global):
//   iniciarEdicaoDeVertices(mapa, feature, cor, aoConcluir(geometria)) -> { concluir, cancelar }
//   edicaoDeVerticesAtiva() -> bool

let _edicaoAtiva = null;

function edicaoDeVerticesAtiva() {
  return _edicaoAtiva !== null;
}

function iniciarEdicaoDeVertices(mapa, feature, cor, aoConcluir) {
  if (_edicaoAtiva) _edicaoAtiva.cancelar();
  if (!mapa.getPane("edicao-vertice")) {
    mapa.createPane("edicao-vertice");
    mapa.getPane("edicao-vertice").style.zIndex = 620;
  }
  const grupo = L.geoJSON(feature, {
    pane: "edicao-vertice",
    style: { color: cor, weight: 3, dashArray: "6 4", fillOpacity: 0.12 },
  }).addTo(mapa);
  const camada = grupo.getLayers()[0];
  camada.pm.enable({ allowSelfIntersection: true, snappable: false });
  mapa.getContainer().classList.add("editando-vertices");

  function terminar(salvar) {
    if (_edicaoAtiva !== controle) return;
    _edicaoAtiva = null;
    document.removeEventListener("keydown", tecla, true);
    mapa.getContainer().classList.remove("editando-vertices");
    const geometria = camada.toGeoJSON().geometry;
    camada.pm.disable();
    grupo.remove();
    if (salvar) aoConcluir(geometria);
    else _avisarEdicao("edição de vértices descartada");
  }
  // Na fase de captura, para o Esc não chegar ao atalho geral (que desliga
  // ferramentas) e o Enter não chegar a um botão com foco.
  function tecla(evento) {
    if (evento.key === "Enter") { evento.preventDefault(); evento.stopImmediatePropagation(); terminar(true); }
    else if (evento.key === "Escape") { evento.preventDefault(); evento.stopImmediatePropagation(); terminar(false); }
  }
  document.addEventListener("keydown", tecla, true);
  const controle = { concluir: () => terminar(true), cancelar: () => terminar(false) };
  _edicaoAtiva = controle;
  _avisarEdicao("editando vértices · Enter salva, Esc descarta");
  return controle;
}

// Na barra de baixo, sem o cadeado do `mostrarAviso` (isto não é trava).
function _avisarEdicao(texto) {
  const el = document.getElementById("status-salvamento");
  if (!el) return;
  el.textContent = `✎ ${texto}`;
  el.className = "status-aviso";
}
