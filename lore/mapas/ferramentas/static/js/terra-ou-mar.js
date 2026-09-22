// Terra ou mar sob um ponto, lido no NAVEGADOR a partir do bloco da costa que já
// está carregado (2026-09-23, sexta rodada -- corrige a ressalva errada da rodada
// anterior, que dizia que isso exigiria a máscara de 10240px).
//
// Como funciona, e por que é barato:
// - O tile `costa` já codifica a resposta: `scripts/gerar_tiles.py` pinta terra
//   com alfa 255 e mar com alfa 0. Então "é terra?" é "o alfa daquele pixel é
//   maior que zero?" -- nenhuma máscara grande, nenhuma chamada ao servidor por
//   movimento do mouse.
// - O bloco é desenhado UMA VEZ num canvas oculto e o `ImageData` fica guardado
//   por bloco; as leituras seguintes dentro do mesmo bloco são um índice num
//   array na memória.
// - Os tiles vêm da MESMA origem (o próprio servidor da ferramenta), então o
//   canvas não fica "tainted" e `getImageData` funciona. Se um dia os tiles
//   passarem a vir de outro domínio sem CORS, isto para de funcionar -- e é o
//   único impedimento real que existiria.
// - **404 é resposta, não erro**: `gerar_tiles.py` NÃO grava tile totalmente
//   transparente, e um tile de costa totalmente transparente é um pedaço de
//   mundo que é só mar. Então bloco ausente = mar, e fica guardado como tal
//   (sem repetir o pedido).
//
// A leitura é sempre no ZOOM NATIVO (MAX_ZOOM), não no zoom da tela: a resposta
// não muda com o zoom do usuário, e o cache não precisa ser refeito a cada
// aproximação.

function criarLeitorDeTerraOuMar(mapa, opcoes) {
  const { zoomNativo, tileSize, urlPadrao } = opcoes;
  const LIMITE_DE_BLOCOS = 60; // ~15 MB de ImageData (256x256x4 por bloco)

  const cache = new Map(); // "x/y" -> {tipo: "pixels", dados} | {tipo: "mar"} | {tipo: "carregando"}
  const aoCarregarOuvintes = [];

  function aoCarregar(callback) {
    aoCarregarOuvintes.push(callback);
  }

  function podar() {
    // Descarta o bloco mais antigo (Map preserva a ordem de inserção) quando
    // passa do limite -- evita o cache crescer sem fim numa sessão longa.
    while (cache.size > LIMITE_DE_BLOCOS) {
      const maisAntigo = cache.keys().next().value;
      cache.delete(maisAntigo);
    }
  }

  function carregarBloco(x, y) {
    const chave = `${x}/${y}`;
    cache.set(chave, { tipo: "carregando" });
    const url = urlPadrao
      .replace("{z}", zoomNativo)
      .replace("{x}", x)
      .replace("{y}", y);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = tileSize;
      canvas.height = tileSize;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      try {
        const dados = ctx.getImageData(0, 0, tileSize, tileSize).data;
        cache.set(chave, { tipo: "pixels", dados });
      } catch (e) {
        // Canvas "tainted" (tile de outra origem sem CORS): não dá pra ler.
        // Marca como desconhecido pra não tentar de novo em cada movimento.
        cache.set(chave, { tipo: "desconhecido" });
      }
      podar();
      for (const cb of aoCarregarOuvintes) cb();
    };
    img.onerror = () => {
      // Bloco que não existe = só mar (ver cabeçalho).
      cache.set(chave, { tipo: "mar" });
      podar();
      for (const cb of aoCarregarOuvintes) cb();
    };
    img.src = url;
  }

  // "terra" | "mar" | null (null = ainda carregando o bloco, ou não deu pra ler)
  function ler(latlng) {
    const ponto = mapa.project(latlng, zoomNativo);
    const x = Math.floor(ponto.x / tileSize);
    const y = Math.floor(ponto.y / tileSize);
    if (x < 0 || y < 0) return null;

    const chave = `${x}/${y}`;
    const entrada = cache.get(chave);
    if (!entrada) {
      carregarBloco(x, y);
      return null;
    }
    if (entrada.tipo === "mar") return "mar";
    if (entrada.tipo !== "pixels") return null; // carregando ou desconhecido

    const dentroX = Math.floor(ponto.x) - x * tileSize;
    const dentroY = Math.floor(ponto.y) - y * tileSize;
    const alfa = entrada.dados[(dentroY * tileSize + dentroX) * 4 + 3];
    return alfa > 0 ? "terra" : "mar";
  }

  return { ler, aoCarregar };
}
