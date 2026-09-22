// Interface geral da ferramenta (rodada de 2026-09-23, quinta): atalhos de
// teclado + tela de ajuda, barra inferior (coordenada, zoom, o que está sob o
// cursor, estado do salvamento), seções do painel esquerdo que abrem/fecham com
// o estado lembrado, indicador de "salvo"/erro, tecla pra ver só a costa e
// teclas de opacidade da camada de referência ativa.
//
// Sem framework e sem módulo ES: os arquivos desta ferramenta são <script src>
// simples (decisão da etapa 1, ver ESPEC-ferramenta.md), então o contrato entre
// eles é um punhado de funções globais nomeadas. As de cá:
//   - mostrarSalvo() / mostrarSalvando() / mostrarErroDeGravacao(msg)
//   - registrarFerramenta({nome, tecla, ativar, desativar, estaAtiva})
//   - ferramentaAtivaEhOutra(nome), arrastandoComEspaco()
//   - mostrarSobCursor(texto)

// --- Indicador de salvamento (item 3d) --------------------------------------
// Discreto quando dá certo (volta a "pronto" sozinho), e ALTO quando falha: um
// erro de gravação não pode sumir sozinho, porque é o caso em que o usuário
// precisa saber que o que ele fez não está no disco.
let _timerSalvo = null;
function _campoStatus() {
  return document.getElementById("status-salvamento");
}
function mostrarSalvando() {
  const el = _campoStatus();
  if (!el) return;
  clearTimeout(_timerSalvo);
  el.textContent = "salvando...";
  el.className = "status-salvando";
}
function mostrarSalvo() {
  const el = _campoStatus();
  if (!el) return;
  clearTimeout(_timerSalvo);
  el.textContent = "✓ salvo";
  el.className = "status-salvo";
  _timerSalvo = setTimeout(() => {
    if (el.className === "status-salvo") {
      el.textContent = "pronto";
      el.className = "";
    }
  }, 2500);
}
function mostrarErroDeGravacao(mensagem) {
  const el = _campoStatus();
  if (!el) return;
  clearTimeout(_timerSalvo);
  el.textContent = `✘ NÃO SALVOU: ${mensagem}`;
  el.className = "status-erro"; // não some sozinho, de propósito
}
// Aviso DISCRETO (item 1b de 2026-09-23): a tentativa de mexer num objeto travado
// não é erro de gravação -- nada deu errado, o objeto é que está protegido. Some
// sozinho, como o "✓ salvo", e nunca usa a faixa vermelha.
function mostrarAviso(mensagem) {
  const el = _campoStatus();
  if (!el) return;
  clearTimeout(_timerSalvo);
  el.textContent = `🔒 ${mensagem}`;
  el.className = "status-aviso";
  _timerSalvo = setTimeout(() => {
    if (el.className === "status-aviso") {
      el.textContent = "pronto";
      el.className = "";
    }
  }, 3500);
}
// "O que está sob o cursor" na barra inferior. Duas fontes disputam esse campo:
// o marcador sob o ponteiro (informação específica) e a leitura de terra/mar
// (o fundo). O marcador TRAVA o campo enquanto o ponteiro está em cima dele,
// pra leitura de fundo não sobrescrever a cada mousemove.
let _sobCursorTravado = false;
function mostrarSobCursor(texto) {
  const el = document.getElementById("leitura-sob-cursor");
  if (el) el.textContent = texto || "—";
}
function travarSobCursor(texto) {
  _sobCursorTravado = true;
  mostrarSobCursor(texto);
}
function destravarSobCursor() {
  _sobCursorTravado = false;
  mostrarSobCursor(null);
}
function sobCursorTravadoPorLugar() {
  return _sobCursorTravado;
}

// --- Ferramentas registradas (atalhos L / R / Esc) ---------------------------
const _ferramentas = [];
function registrarFerramenta(ferramenta) {
  _ferramentas.push(ferramenta);
}
function desativarTodasAsFerramentas() {
  for (const f of _ferramentas) {
    if (f.estaAtiva && f.estaAtiva()) f.desativar();
  }
}
function ferramentaAtivaEhOutra(nome) {
  return _ferramentas.some((f) => f.nome !== nome && f.estaAtiva && f.estaAtiva());
}

// --- Espaço segurado = arrastar o mapa sem sair da ferramenta (item 3a) ------
let _espacoSegurado = false;
function arrastandoComEspaco() {
  return _espacoSegurado;
}

function _digitandoEmCampo(evento) {
  const alvo = evento.target;
  if (!alvo) return false;
  const tag = (alvo.tagName || "").toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || alvo.isContentEditable;
}

// --- Tema claro/escuro (item 2 de 2026-09-23) --------------------------------
// O tema vive num atributo do <html> (data-tema) e a folha de estilo redefine os
// tokens de cor para "claro". NENHUM filtro/opacidade sobre #mapa em nenhum dos
// dois: as cores do mapa são as do gerador, e trocar o tema é da moldura.
// A leitura inicial acontece no <head> (script inline), pra página não nascer
// escura e piscar pro claro; aqui só ficam a troca e a gravação.
const CHAVE_TEMA = "uldun.tema";
function temaAtual() {
  return document.documentElement.dataset.tema === "claro" ? "claro" : "escuro";
}
function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  const botao = document.getElementById("botao-tema");
  if (botao) {
    botao.textContent = tema === "claro" ? "☀" : "☾";
    botao.title = `Tema ${tema} (D troca)`;
  }
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
  } catch (e) {
    /* sem armazenamento: troca vale só nesta sessão */
  }
}
function alternarTema() {
  aplicarTema(temaAtual() === "claro" ? "escuro" : "claro");
}

function iniciarInterface(mapa, opcoes) {
  // opcoes: { camadaCosta, camadasQueSomemNaTeclaCosta: () => [camadas],
  //           opacidadeCamadaAtiva: {subir, descer},
  //           alternarTravaDoSelecionado: () => void }

  // --- Seções que abrem/fecham, estado lembrado (item 3e) -------------------
  // localStorage é por navegador e some se o usuário limpar os dados do site --
  // é conveniência de interface, não dado do mapa, então pode viver aí (nada
  // do mundo de Uldun depende disso). Leitura protegida: em janela anônima ou
  // com armazenamento bloqueado, o acesso pode lançar.
  const CHAVE_SECOES = "uldun.secoes.fechadas";
  function lerSecoesFechadas() {
    try {
      return new Set(JSON.parse(localStorage.getItem(CHAVE_SECOES) || "[]"));
    } catch (e) {
      return new Set();
    }
  }
  function gravarSecoesFechadas(conjunto) {
    try {
      localStorage.setItem(CHAVE_SECOES, JSON.stringify([...conjunto]));
    } catch (e) {
      /* sem armazenamento: a interface continua funcionando, só não lembra */
    }
  }
  const fechadas = lerSecoesFechadas();
  for (const secao of document.querySelectorAll(".secao[data-secao]")) {
    const nome = secao.dataset.secao;
    if (fechadas.has(nome)) secao.classList.add("fechada");
    const cabecalho = secao.querySelector(".cabecalho-secao");
    if (!cabecalho) continue;
    cabecalho.addEventListener("click", () => {
      secao.classList.toggle("fechada");
      const agoraFechadas = lerSecoesFechadas();
      if (secao.classList.contains("fechada")) agoraFechadas.add(nome);
      else agoraFechadas.delete(nome);
      gravarSecoesFechadas(agoraFechadas);
    });
  }

  // --- Tela de ajuda (item 3a) ---------------------------------------------
  const modalAjuda = document.getElementById("modal-ajuda");
  function abrirAjuda() { modalAjuda.style.display = "flex"; }
  function fecharAjuda() { modalAjuda.style.display = "none"; }
  document.getElementById("botao-ajuda").addEventListener("click", abrirAjuda);
  document.getElementById("botao-ajuda-fechar").addEventListener("click", fecharAjuda);

  // --- Botão de tema (item 2) ----------------------------------------------
  aplicarTema(temaAtual()); // acerta o rótulo do botão com o que o <head> aplicou
  document.getElementById("botao-tema").addEventListener("click", alternarTema);

  // --- Leitura de zoom na barra inferior (item 3c) --------------------------
  function atualizarLeituraZoom() {
    const el = document.getElementById("leitura-zoom");
    if (!el) return;
    const pct = 100 * Math.pow(2, mapa.getZoom() - PARAMETROS_LEAFLET.max_zoom);
    el.textContent = `zoom ${pct >= 100 ? Math.round(pct) : Math.round(pct * 10) / 10}%`;
  }
  mapa.on("zoom zoomend", atualizarLeituraZoom);
  atualizarLeituraZoom();

  // --- Só a costa, enquanto a tecla C estiver segurada (item 3g) ------------
  let escondido = false;
  function esconderTudoMenosCosta() {
    if (escondido) return;
    escondido = true;
    document.getElementById("mapa").classList.add("so-costa");
  }
  function mostrarTudoDeNovo() {
    if (!escondido) return;
    escondido = false;
    document.getElementById("mapa").classList.remove("so-costa");
  }

  // --- Teclado --------------------------------------------------------------
  document.addEventListener("keydown", (evento) => {
    // Esc funciona até dentro de campo (fecha modal); o resto, não.
    if (evento.key === "Escape") {
      if (modalAjuda.style.display === "flex") { fecharAjuda(); return; }
      // Os modais tratam o próprio Esc (lugares.js, regua.js) e param a
      // propagação quando o foco está dentro deles. Esta checagem cobre o caso
      // em que o foco escapou (clique no fundo escurecido, por exemplo): com um
      // modal aberto, Esc nunca desliga a ferramenta por baixo dele.
      const algumModalAberto = ["modal-lugar", "modal-medicao"].some((id) => {
        const el = document.getElementById(id);
        return el && el.style.display === "flex";
      });
      if (algumModalAberto) return;
      desativarTodasAsFerramentas();
      return;
    }
    if (_digitandoEmCampo(evento)) return;

    if (evento.ctrlKey || evento.metaKey) {
      const tecla = evento.key.toLowerCase();
      if (tecla === "z") { evento.preventDefault(); document.getElementById("botao-desfazer").click(); }
      else if (tecla === "y") { evento.preventDefault(); document.getElementById("botao-refazer").click(); }
      return;
    }

    if (evento.key === "?" || (evento.key === "/" && evento.shiftKey)) {
      evento.preventDefault();
      abrirAjuda();
      return;
    }
    if (evento.code === "Space") {
      evento.preventDefault();
      _espacoSegurado = true;
      document.getElementById("mapa").classList.add("arrastando");
      return;
    }
    if (evento.key === "c" || evento.key === "C") {
      esconderTudoMenosCosta();
      return;
    }
    if (evento.key === "t" || evento.key === "T") {
      // Trava/destrava o objeto SELECIONADO (item 1c). Sem seleção, avisa em vez
      // de não fazer nada em silêncio.
      evento.preventDefault();
      if (opcoes && opcoes.alternarTravaDoSelecionado) opcoes.alternarTravaDoSelecionado();
      return;
    }
    if (evento.key === "d" || evento.key === "D") {
      evento.preventDefault();
      alternarTema();
      return;
    }
    if (evento.key === "[" || evento.key === "]") {
      if (!opcoes || !opcoes.opacidadeCamadaAtiva) return;
      evento.preventDefault();
      if (evento.key === "[") opcoes.opacidadeCamadaAtiva.descer();
      else opcoes.opacidadeCamadaAtiva.subir();
      return;
    }
    if (evento.key === "+" || evento.key === "=") {
      document.getElementById("zoom-mais").click();
      return;
    }
    if (evento.key === "-" || evento.key === "_") {
      document.getElementById("zoom-menos").click();
      return;
    }
    for (const f of _ferramentas) {
      if (f.tecla && evento.key.toLowerCase() === f.tecla) {
        evento.preventDefault();
        if (f.estaAtiva && f.estaAtiva()) f.desativar();
        else { desativarTodasAsFerramentas(); f.ativar(); }
        return;
      }
    }
  });

  document.addEventListener("keyup", (evento) => {
    if (evento.code === "Space") {
      _espacoSegurado = false;
      document.getElementById("mapa").classList.remove("arrastando");
    }
    if (evento.key === "c" || evento.key === "C") mostrarTudoDeNovo();
  });

  // Soltar as teclas seguradas se a janela perder o foco (senão a tecla fica
  // "presa" e o mapa some/arrasta pra sempre).
  window.addEventListener("blur", () => {
    _espacoSegurado = false;
    document.getElementById("mapa").classList.remove("arrastando");
    mostrarTudoDeNovo();
  });
}
