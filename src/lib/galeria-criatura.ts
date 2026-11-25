// O carrossel das imagens de uma criatura (prompt 056-imagens), no bestiário.
//
// A lista do bestiário continua mostrando só a imagem principal. Quando a criatura tem duas
// ou mais no índice, o card leva `data-galeria` (JSON compacto, ver BestaCard.astro) e o
// clique na arte ou na lupa abre esta caixa: o quadro 3:2 com setas, a fileira de
// miniaturas (ao lado no computador, embaixo e rolando para o lado no celular), a legenda e,
// se passar de MAX_CARROSSEL, o botão "Ver todas as N imagens", que troca o carrossel por
// uma grade. Clicar na imagem grande chama `telaCheia`, que é o #lightbox que já existia.
//
// Só a imagem grande atual e as miniaturas (até 8) são pedidas ao abrir; cada grande a
// mais só quando o leitor chega nela (src posto na hora, e a miniatura da grade é lazy).
//
// O que NÃO é daqui: o clique que decide abrir (delegado na lista, em bestiario.astro) e a
// tela cheia (o #lightbox). Esta caixa só desenha e navega.

export const MAX_NO_CARROSSEL = 8;

/** [arquivo, mini, legenda, sexo], como o card grava em `data-galeria`. */
type ItemCard = [string, string, string, string | null];
export interface DadosGaleria { base: string; total: number; itens: ItemCard[]; }

export interface DepsGaleria {
  /** Abre a imagem em tela cheia (o #lightbox da página). */
  telaCheia: (src: string, nome: string) => void;
  /** Diz se a tela cheia está aberta (então o teclado é dela, e não da galeria). */
  telaCheiaAberta: () => boolean;
}

const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

export function lerDadosGaleria(texto: string | undefined): DadosGaleria | null {
  try {
    const d = JSON.parse(texto || '');
    if (!d || typeof d.base !== 'string' || !Array.isArray(d.itens) || d.itens.length < 2) return null;
    return d as DadosGaleria;
  } catch { return null; }
}

export function criarGaleria(deps: DepsGaleria) {
  const caixa = el<HTMLElement>('galeria');
  if (!caixa) return { abrir() {}, aberta: () => false, fechar() {} };
  const nomeEl = el<HTMLElement>('gal-nome');
  const quadro = el<HTMLElement>('gal-quadro');
  const img = el<HTMLImageElement>('gal-img');
  const legenda = el<HTMLElement>('gal-leg');
  const contagem = el<HTMLElement>('gal-cont');
  const minis = el<HTMLElement>('gal-minis');
  const todasBtn = el<HTMLButtonElement>('gal-todas');
  const grade = el<HTMLElement>('gal-grade');
  const corpo = el<HTMLElement>('gal-corpo');
  const voltar = el<HTMLButtonElement>('gal-voltar');

  let dados: DadosGaleria | null = null;
  let nome = '';
  let idx = 0;
  let aberta = false;
  let modoGrade = false;
  let abridor: HTMLElement | null = null;

  const nVisiveis = () => Math.min(MAX_NO_CARROSSEL, dados ? dados.itens.length : 0);
  const src = (i: number) => dados!.base + dados!.itens[i][0];
  const srcMini = (i: number) => dados!.base + dados!.itens[i][1];
  const altDe = (i: number) => dados!.itens[i][2] || `${nome}, imagem ${i + 1} de ${dados!.total}`;

  function mostrar(i: number) {
    if (!dados) return;
    const n = nVisiveis();
    idx = ((i % n) + n) % n;
    img.src = src(idx);
    img.alt = altDe(idx);
    legenda.textContent = dados.itens[idx][2] || '';
    legenda.hidden = !dados.itens[idx][2];
    contagem.textContent = `${idx + 1} de ${n}`;
    minis.querySelectorAll<HTMLElement>('.gal-mini').forEach((b, k) => {
      const atual = k === idx;
      b.classList.toggle('atual', atual);
      b.setAttribute('aria-current', atual ? 'true' : 'false');
      if (atual) b.scrollIntoView({ block: 'nearest', inline: 'center' });
    });
  }

  function montarMinis() {
    minis.textContent = '';
    for (let k = 0; k < nVisiveis(); k++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gal-mini';
      b.setAttribute('aria-label', `Imagem ${k + 1} de ${nVisiveis()}`);
      const m = document.createElement('img');
      m.src = srcMini(k);
      m.alt = '';
      m.loading = 'lazy';
      m.decoding = 'async';
      b.appendChild(m);
      b.addEventListener('click', () => mostrar(k));
      minis.appendChild(b);
    }
  }

  function montarGrade() {
    grade.textContent = '';
    dados!.itens.forEach((it, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'gal-celula';
      b.setAttribute('aria-label', it[2] || `Ver a imagem ${k + 1} em tela cheia`);
      const m = document.createElement('img');
      m.src = srcMini(k);
      m.alt = '';
      m.loading = 'lazy';
      m.decoding = 'async';
      b.appendChild(m);
      b.addEventListener('click', () => deps.telaCheia(src(k), nome));
      grade.appendChild(b);
    });
  }

  function modo(grid: boolean) {
    modoGrade = grid;
    corpo.hidden = grid;
    grade.hidden = !grid;
    voltar.hidden = !grid;
    todasBtn.hidden = grid || !dados || dados.total <= MAX_NO_CARROSSEL;
    if (grid) montarGrade();
  }

  function abrir(texto: string | undefined, nomeCriatura: string, quem?: HTMLElement | null) {
    const d = lerDadosGaleria(texto);
    if (!d) return;
    dados = d;
    nome = nomeCriatura;
    abridor = quem || null;
    nomeEl.textContent = nomeCriatura;
    todasBtn.textContent = `Ver todas as ${d.total} imagens`;
    montarMinis();
    modo(false);
    mostrar(0);
    caixa.hidden = false;
    aberta = true;
    document.body.style.overflow = 'hidden';
    el<HTMLButtonElement>('gal-fechar').focus();
  }

  function fechar() {
    if (!aberta) return;
    caixa.hidden = true;
    aberta = false;
    img.removeAttribute('src');
    minis.textContent = '';
    grade.textContent = '';
    if (!deps.telaCheiaAberta()) document.body.style.overflow = '';
    abridor?.focus?.();
  }

  // Setas da tela e das miniaturas
  el<HTMLButtonElement>('gal-ant').addEventListener('click', () => mostrar(idx - 1));
  el<HTMLButtonElement>('gal-prox').addEventListener('click', () => mostrar(idx + 1));
  el<HTMLButtonElement>('gal-fechar').addEventListener('click', fechar);
  todasBtn.addEventListener('click', () => modo(true));
  voltar.addEventListener('click', () => modo(false));
  caixa.addEventListener('click', (e) => { if (e.target === caixa) fechar(); });

  // Teclado: esquerda e direita trocam; Esc fecha (a tela cheia, quando aberta, fica com o Esc dela).
  document.addEventListener('keydown', (e) => {
    if (!aberta || deps.telaCheiaAberta()) return;
    if (e.key === 'Escape') { fechar(); return; }
    if (modoGrade) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(idx - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(idx + 1); }
  });

  // Arrastar o dedo no quadro troca a imagem; um toque sem arrasto abre a tela cheia.
  // Alguns navegadores ainda disparam um clique logo depois do arrasto: ele não deve abrir a tela cheia.
  let x0 = 0, y0 = 0, arrastouEm = 0;
  quadro.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  quadro.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - x0, dy = t.clientY - y0;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { arrastouEm = Date.now(); mostrar(idx + (dx < 0 ? 1 : -1)); }
  }, { passive: true });

  // Clique na imagem grande: tela cheia.
  img.addEventListener('click', () => { if (Date.now() - arrastouEm < 400) return; if (dados) deps.telaCheia(src(idx), nome); });

  return { abrir, aberta: () => aberta, fechar };
}
