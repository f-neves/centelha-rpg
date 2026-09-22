// Minimapa próprio (decisão do usuário: não usar leaflet-minimap). Uma imagem fixa
// do mundo inteiro (static/img/minimapa.jpg, 320px, gerada a partir do
// Uldun_parte-jogavel.jpg já existente — não da máscara nativa de 10240px) mais um
// retângulo mostrando a área visível do mapa principal, e clique para navegar.

function iniciarMinimapa(map, limites) {
  const caixa = document.getElementById("minimapa-caixa");
  const img = document.getElementById("minimapa-img");
  const retangulo = document.getElementById("minimapa-retangulo");

  const { norte, sul, leste, oeste } = limites;

  function latParaFracaoY(lat) {
    return (norte - lat) / (norte - sul);
  }
  function lonParaFracaoX(lon) {
    return (lon - oeste) / (leste - oeste);
  }
  function fracaoYParaLat(fracY) {
    return norte - fracY * (norte - sul);
  }
  function fracaoXParaLon(fracX) {
    return oeste + fracX * (leste - oeste);
  }

  function atualizarRetangulo() {
    const w = caixa.clientWidth;
    const h = caixa.clientHeight;
    const bounds = map.getBounds();

    const xEsq = lonParaFracaoX(bounds.getWest()) * w;
    const xDir = lonParaFracaoX(bounds.getEast()) * w;
    const yTopo = latParaFracaoY(bounds.getNorth()) * h;
    const yBase = latParaFracaoY(bounds.getSouth()) * h;

    retangulo.style.left = `${Math.max(0, xEsq)}px`;
    retangulo.style.top = `${Math.max(0, yTopo)}px`;
    retangulo.style.width = `${Math.min(w, xDir) - Math.max(0, xEsq)}px`;
    retangulo.style.height = `${Math.min(h, yBase) - Math.max(0, yTopo)}px`;
  }

  caixa.addEventListener("click", (evento) => {
    // ignora clique no próprio retângulo, pra não "pular" a navegação
    const retanguloRect = retangulo.getBoundingClientRect();
    const dentroDoRetangulo =
      evento.clientX >= retanguloRect.left && evento.clientX <= retanguloRect.right &&
      evento.clientY >= retanguloRect.top && evento.clientY <= retanguloRect.bottom;
    if (dentroDoRetangulo) return;

    const rect = caixa.getBoundingClientRect();
    const fracX = (evento.clientX - rect.left) / rect.width;
    const fracY = (evento.clientY - rect.top) / rect.height;
    const lat = fracaoYParaLat(fracY);
    const lon = fracaoXParaLon(fracX);
    map.panTo([lat, lon]);
  });

  map.on("move zoom", atualizarRetangulo);
  img.addEventListener("load", atualizarRetangulo);
  if (img.complete) atualizarRetangulo();
}
