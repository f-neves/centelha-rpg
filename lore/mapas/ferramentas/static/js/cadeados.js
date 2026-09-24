// Cadeado de camada dos painéis ROTAS, REGIÕES, NOMES e ELEMENTOS (rodada das
// pendências, 2026-09-23, item c). Um módulo só para os quatro, porque o botão é o
// mesmo: lê o estado de /api/travas e troca com POST /api/travas/<camada>. A recusa
// de gravar numa camada travada é do SERVIDOR (409, backend/travas.py); aqui só se
// mostra e se troca o cadeado. Os módulos de cada painel não mudaram: um gesto numa
// camada travada volta com o aviso de trava que cada um já mostra para objeto travado.
(function () {
  const ROTULO = { rotas: "rotas", regioes: "regiões", nomes: "nomes", elementos: "elementos" };
  const botoes = Array.from(document.querySelectorAll("[data-cadeado-camada]"));
  if (!botoes.length) return;

  function mostrar(docTravas) {
    const travadas = {};
    for (const c of docTravas.camadas || []) travadas[c.id] = Boolean(c.travada);
    for (const b of botoes) {
      const camada = b.dataset.cadeadoCamada;
      const t = Boolean(travadas[camada]);
      b.dataset.travada = t ? "1" : "0";
      b.textContent = t ? `🔒 ${ROTULO[camada]} travadas` : `🔓 ${ROTULO[camada]} livres`;
      b.classList.toggle("ativo", t);
      b.title = t
        ? `Destravar a camada de ${ROTULO[camada]} (cada objeto volta ao estado individual dele)`
        : `Travar todas as ${ROTULO[camada]} de uma vez, sem mexer no estado individual de cada uma`;
    }
  }

  async function ler() {
    const r = await fetch("/api/travas");
    if (r.ok) mostrar(await r.json());
  }

  for (const b of botoes) {
    b.addEventListener("click", async () => {
      // Lê de novo antes de trocar: um Ctrl+Z pode ter mudado o estado por baixo.
      const atual = await fetch("/api/travas");
      if (!atual.ok) return;
      const doc = await atual.json();
      const camada = b.dataset.cadeadoCamada;
      const c = (doc.camadas || []).find((x) => x.id === camada);
      const r = await fetch(`/api/travas/${camada}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ travada: !(c && c.travada) }),
      });
      if (r.ok) mostrar(await r.json());
    });
  }

  if (typeof TRAVAS_INICIAL !== "undefined") mostrar(TRAVAS_INICIAL);
  // O desfazer e o refazer podem trocar um cadeado: relê quando a janela volta ao foco
  // e a cada tecla Ctrl+Z / Ctrl+Y.
  window.addEventListener("focus", ler);
  document.addEventListener("keyup", (e) => {
    if ((e.ctrlKey || e.metaKey) && ["z", "y", "Z", "Y"].includes(e.key)) ler();
  });
})();
