// EXPORTAÇÃO PARCIAL (B3 da empreitada, 2026-09-23 noite): o mapa de um recorte para
// dar aos jogadores. Recorte por região ou por retângulo desenhado no mapa, camadas,
// versão do mestre ou do jogador, PNG ou PDF (A4/A3), destinatário e, se quiser, um
// mapa distorcido de propósito (B5: nível e mercador). O servidor roda a exportação num
// processo separado e registra em dados/exportacoes.jsonl; a lista embaixo mostra as
// últimas, com o link do arquivo.
//
// Contrato: iniciarExportacao(mapa).

const CAMADAS_EXPORTACAO = ["relevo", "cobertura", "rios", "estradas", "rotas", "nomes", "cidades", "grade",
  "moldura", "elementos"];

function iniciarExportacao(mapa) {
  const seletorRegiao = document.getElementById("exp-regiao");
  const botaoRet = document.getElementById("exp-retangulo");
  const caixaCamadas = document.getElementById("exp-camadas");
  const seletorVersao = document.getElementById("exp-versao");
  const seletorFormato = document.getElementById("exp-formato");
  const campoLargura = document.getElementById("exp-largura");
  const seletorPapel = document.getElementById("exp-papel");
  const campoDest = document.getElementById("exp-destinatario");
  const seletorNivel = document.getElementById("exp-nivel");
  const campoMercador = document.getElementById("exp-mercador");
  const botao = document.getElementById("exp-exportar");
  const leitura = document.getElementById("exp-leitura");
  const lista = document.getElementById("exp-lista");
  let retangulo = null;
  let desenhando = false;
  let camadaRet = null;

  for (const c of CAMADAS_EXPORTACAO) {
    const l = document.createElement("label");
    const cx = document.createElement("input");
    cx.type = "checkbox"; cx.value = c; cx.checked = true;
    l.append(cx, ` ${c}`);
    caixaCamadas.appendChild(l);
  }

  async function carregarRegioes() {
    const r = await fetch("/api/regioes").then((x) => x.json()).catch(() => null);
    seletorRegiao.innerHTML = '<option value="">(retângulo desenhado)</option>';
    if (!r) return;
    for (const g of r.regioes.regioes) {
      const op = document.createElement("option");
      op.value = g.id; op.textContent = g.nome;
      seletorRegiao.appendChild(op);
    }
  }

  botaoRet.addEventListener("click", () => {
    desativarTodasAsFerramentas();
    desenhando = true;
    seletorRegiao.value = "";
    leitura.textContent = "arraste um retângulo no mapa";
    mapa.pm.enableDraw("Rectangle");
  });
  mapa.on("pm:create", (evento) => {
    if (evento.shape !== "Rectangle" || !desenhando) return;
    desenhando = false;
    mapa.pm.disableDraw();
    const b = evento.layer.getBounds();
    if (camadaRet) camadaRet.remove();
    camadaRet = evento.layer;
    camadaRet.setStyle({ color: "#ffb300", weight: 2, dashArray: "6 4", fillOpacity: 0.05 });
    retangulo = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
    leitura.textContent = `retângulo: ${retangulo.map((v) => v.toFixed(2)).join(", ")}`;
  });

  botao.addEventListener("click", async () => {
    const corpo = {
      camadas: [...caixaCamadas.querySelectorAll("input:checked")].map((c) => c.value),
      versao: seletorVersao.value,
      formato: seletorFormato.value,
      largura_px: Number(campoLargura.value),
      papel: seletorPapel.value,
      destinatario: campoDest.value.trim() || null,
    };
    if (seletorRegiao.value) corpo.regiao = seletorRegiao.value;
    else if (retangulo) corpo.retangulo = retangulo;
    else { leitura.textContent = "escolha uma região ou desenhe um retângulo"; return; }
    if (seletorNivel.value) corpo.distorcao = { nivel: Number(seletorNivel.value), mercador: campoMercador.value.trim() };
    botao.disabled = true;
    leitura.textContent = "exportando... (pode levar um minuto)";
    try {
      const resp = await fetch("/api/exportar", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo) });
      const dados = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const m = Array.isArray(dados.detail) ? dados.detail.map((d) => d.msg).join("; ") : (dados.detail || resp.status);
        leitura.textContent = `não exportou: ${m}`;
        mostrarErroDeGravacao(`exportação: ${m}`);
      } else {
        leitura.innerHTML = "";
        const a = document.createElement("a");
        a.href = `/api/exportacoes/arquivo?caminho=${encodeURIComponent(dados.arquivo)}`;
        a.target = "_blank"; a.textContent = dados.arquivo;
        leitura.append("pronto: ", a, ` (${dados.largura} x ${dados.altura} px, ${dados.segundos} s)`);
        carregarLista();
      }
    } finally {
      botao.disabled = false;
    }
  });

  async function carregarLista() {
    const r = await fetch("/api/exportacoes").then((x) => x.json()).catch(() => []);
    lista.innerHTML = "";
    for (const e of r.slice(-12).reverse()) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `/api/exportacoes/arquivo?caminho=${encodeURIComponent(e.arquivo)}`;
      a.target = "_blank";
      a.textContent = `${e.quando} · ${e.recorte.regiao || "retângulo"} · ${e.versao}` +
        (e.distorcao ? ` · nível ${e.distorcao.nivel}` : "") + (e.destinatario ? ` · para ${e.destinatario}` : "");
      li.appendChild(a);
      lista.appendChild(li);
    }
  }

  carregarRegioes();
  carregarLista();
}
