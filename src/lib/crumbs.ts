// Trilha de navegação dinâmica: as páginas da área de jogo (mesa, personagem)
// só sabem onde estão depois de carregar os dados do Supabase, então completam
// os crumbs por aqui. O nível "Início" entra sempre; passe só o resto.
//
//   definirCrumbs([{ label: 'Mesas / Fichas', href: u('mesas') }, { label: mesa.nome }]);
//
// A marcação é a mesma do layout (Base.astro), para o visual bater.
import { url } from './site';

export interface Crumb {
  label: string;
  href?: string;
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

/** Substitui a trilha da página. `itens` vem sem o "Início" (ele é sempre o primeiro). */
export function definirCrumbs(itens: Crumb[]): void {
  const main = document.querySelector('main.content');
  if (!main) return;
  let nav = main.querySelector<HTMLElement>('nav.crumbs');
  if (!nav) {
    nav = document.createElement('nav');
    nav.className = 'crumbs';
    nav.setAttribute('aria-label', 'Trilha de navegação');
    nav.setAttribute('data-pagefind-ignore', '');
    main.insertBefore(nav, main.firstChild);
  }
  const todos: Crumb[] = [{ label: 'Início', href: url('') }, ...itens.filter((c) => c && c.label)];
  nav.innerHTML = todos
    .map((c, i) => {
      const sep = i > 0 ? '<span class="crumb-sep">›</span>' : '';
      const ultimo = i === todos.length - 1;
      const corpo = c.href && !ultimo
        ? `<a href="${esc(c.href)}">${esc(c.label)}</a>`
        : `<span aria-current="page">${esc(c.label)}</span>`;
      return sep + corpo;
    })
    .join('');
}

/** Troca só o rótulo do último nível (ex.: o nome mudou sem sair da página). */
export function atualizarUltimoCrumb(label: string): void {
  const nav = document.querySelector('nav.crumbs');
  const ultimo = nav?.lastElementChild;
  if (ultimo && label) ultimo.textContent = label;
}
