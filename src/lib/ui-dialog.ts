// Diálogos do site: substituem alert / confirm / prompt nativos do navegador.
// Cada chamada monta um <dialog> na hora e o remove ao fechar. O visual fica em
// styles/global.css (classe .ui-dlg), então segue tema, fontes e cores do site.
//
//   await uiAviso('Senha definida.')
//   if (!(await uiConfirmar('Excluir a nota?', { perigo: true }))) return;
//   const nome = await uiPerguntar('Nome da mesa', mesa.nome);
//   const v = await uiFormulario('Editar mesa', [{ nome: 'nome', rotulo: 'Nome' }, ...]);
//   const mesaId = await uiEscolher('Enviar para…', [{ valor: id, rotulo: 'Mesa X' }]);

export interface Campo {
  nome: string;
  rotulo: string;
  valor?: string | number | null;
  tipo?: 'texto' | 'longo' | 'numero';
  placeholder?: string;
  dica?: string;
  min?: number;
  max?: number;
  obrigatorio?: boolean;
}

export interface Opcao {
  valor: string;
  rotulo: string;
  nota?: string;
  /** Cabeçalho sob o qual a opção aparece. Opções sem grupo vêm antes de todos. */
  grupo?: string;
  /** Texto extra que a busca considera, além do rótulo e da nota. */
  busca?: string;
  /**
   * Conteúdo pronto da opção, no lugar de rótulo + nota. Vai para o DOM sem
   * escape: quem monta é responsável por escapar o que vem de fora. Serve para
   * a opção que precisa ser mais que uma linha de texto — o catálogo de
   * equipamento, por exemplo, mostra a arte e os números da peça.
   */
  html?: string;
}

interface Cfg {
  titulo: string;
  msg?: string;
  campos?: Campo[];
  opcoes?: Opcao[];
  ok?: string | null;       // null = sem botão de confirmar
  cancelar?: string | null; // null = sem botão de cancelar
  perigo?: boolean;
  /** Campo de filtro no topo da lista. O texto é o placeholder. */
  filtro?: string;
  /** Classe extra no <dialog>, para quem precisa de outra largura ou layout. */
  classe?: string;
}

interface Resultado {
  ok: boolean;
  valores: Record<string, string>;
  opcao?: string;
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

const linhas = (s: string) => esc(s).replace(/\n/g, '<br>');

function campoHTML(c: Campo, i: number): string {
  const id = `uidlg-c${i}`;
  const val = c.valor == null ? '' : String(c.valor);
  const campo = c.tipo === 'longo'
    ? `<textarea id="${id}" name="${esc(c.nome)}" rows="4" placeholder="${esc(c.placeholder || '')}">${esc(val)}</textarea>`
    : `<input id="${id}" name="${esc(c.nome)}" type="${c.tipo === 'numero' ? 'number' : 'text'}"
         value="${esc(val)}" placeholder="${esc(c.placeholder || '')}"
         ${c.min != null ? `min="${c.min}"` : ''} ${c.max != null ? `max="${c.max}"` : ''} />`;
  return `<label class="ui-dlg-campo" for="${id}">
    <span class="ui-dlg-rot">${esc(c.rotulo)}</span>
    ${campo}
    ${c.dica ? `<span class="ui-dlg-dica">${esc(c.dica)}</span>` : ''}
  </label>`;
}

/** Botões das opções, com um cabeçalho a cada troca de grupo. */
function opcoesHTML(opcoes: Opcao[]): string {
  let grupoAtual: string | undefined;
  const saida: string[] = [];
  for (const o of opcoes) {
    if (o.grupo !== grupoAtual) {
      grupoAtual = o.grupo;
      if (grupoAtual) saida.push(`<h3 class="ui-dlg-grupo">${esc(grupoAtual)}</h3>`);
    }
    const chave = `${o.rotulo} ${o.nota || ''} ${o.busca || ''} ${o.grupo || ''}`.toLowerCase();
    saida.push(`<button type="button" class="btn ui-dlg-op" data-v="${esc(o.valor)}"`
      + ` data-busca="${esc(chave)}">`
      + (o.html ?? `${esc(o.rotulo)}${o.nota ? ` <small>${esc(o.nota)}</small>` : ''}`)
      + '</button>');
  }
  return saida.join('');
}

function montar(cfg: Cfg): Promise<Resultado> {
  return new Promise((resolve) => {
    const campos = cfg.campos || [];
    const opcoes = cfg.opcoes || [];
    const dlg = document.createElement('dialog');
    dlg.className = 'ui-dlg' + (cfg.perigo ? ' perigo' : '') + (cfg.classe ? ' ' + cfg.classe : '');
    dlg.innerHTML = `
      <form method="dialog" class="ui-dlg-form">
        <div class="ui-dlg-head">
          <h2 class="ui-dlg-tit">${esc(cfg.titulo)}</h2>
          <button type="button" class="ui-dlg-x" aria-label="Fechar">✕</button>
        </div>
        <div class="ui-dlg-corpo">
          ${cfg.msg ? `<p class="ui-dlg-msg">${linhas(cfg.msg)}</p>` : ''}
          ${campos.map(campoHTML).join('')}
          ${opcoes.length && cfg.filtro ? `<input type="search" class="ui-dlg-filtro" placeholder="${esc(cfg.filtro)}" aria-label="${esc(cfg.filtro)}" />` : ''}
          ${opcoes.length ? `<div class="ui-dlg-ops">${opcoesHTML(opcoes)}</div>` : ''}
          ${opcoes.length && cfg.filtro ? '<p class="ui-dlg-nada" hidden>Nada com esse nome.</p>' : ''}
        </div>
        <div class="ui-dlg-pe">
          ${cfg.cancelar === null ? '' : `<button type="button" class="btn ui-dlg-cancelar">${esc(cfg.cancelar || 'Cancelar')}</button>`}
          ${cfg.ok === null ? '' : `<button type="submit" class="btn ${cfg.perigo ? 'perigo' : 'primary'} ui-dlg-ok">${esc(cfg.ok || 'OK')}</button>`}
        </div>
      </form>`;
    document.body.appendChild(dlg);

    const form = dlg.querySelector('form')!;
    let saida: Resultado | null = null;

    const ler = (): Record<string, string> | null => {
      const v: Record<string, string> = {};
      for (const c of campos) {
        const el = form.elements.namedItem(c.nome) as HTMLInputElement | HTMLTextAreaElement | null;
        let s = (el?.value ?? '').trim();
        if (c.tipo === 'numero') {
          const n = parseInt(s, 10);
          if (isNaN(n)) s = '';
          else s = String(Math.max(c.min ?? -Infinity, Math.min(c.max ?? Infinity, n)));
        }
        if (c.obrigatorio && !s) {
          el?.classList.add('invalido');
          el?.focus();
          return null;
        }
        el?.classList.remove('invalido');
        v[c.nome] = s;
      }
      return v;
    };

    const fechar = (r: Resultado | null) => { saida = r; if (dlg.open) dlg.close(); else dlg.remove(); };

    form.addEventListener('submit', (e) => {
      const v = ler();
      if (!v) { e.preventDefault(); return; }
      saida = { ok: true, valores: v }; // method="dialog" fecha sozinho
    });
    dlg.querySelector('.ui-dlg-x')!.addEventListener('click', () => fechar(null));
    dlg.querySelector('.ui-dlg-cancelar')?.addEventListener('click', () => fechar(null));
    dlg.querySelectorAll<HTMLElement>('.ui-dlg-op').forEach((b) =>
      b.addEventListener('click', () => fechar({ ok: true, valores: {}, opcao: b.dataset.v! })));

    // Filtro da lista: esconde o que não casa e, junto, o cabeçalho do grupo que
    // ficou sem nenhuma opção — senão sobra um título solto no vazio.
    const filtro = dlg.querySelector<HTMLInputElement>('.ui-dlg-filtro');
    if (filtro) {
      const nada = dlg.querySelector<HTMLElement>('.ui-dlg-nada');
      const itens = [...dlg.querySelectorAll<HTMLElement>('.ui-dlg-ops > *')];
      filtro.addEventListener('input', () => {
        const q = filtro.value.trim().toLowerCase();
        let visiveis = 0, grupo: HTMLElement | null = null, noGrupo = 0;
        const fechaGrupo = () => { if (grupo) grupo.hidden = noGrupo === 0; };
        for (const it of itens) {
          if (it.classList.contains('ui-dlg-grupo')) { fechaGrupo(); grupo = it; noGrupo = 0; continue; }
          const casa = !q || (it.dataset.busca || '').includes(q);
          it.hidden = !casa;
          if (casa) { visiveis++; noGrupo++; }
        }
        fechaGrupo();
        if (nada) nada.hidden = visiveis > 0;
      });
    }
    dlg.addEventListener('click', (e) => { if (e.target === dlg) fechar(null); });
    dlg.addEventListener('cancel', () => { saida = null; }); // Esc
    dlg.addEventListener('close', () => {
      dlg.remove();
      resolve(saida || { ok: false, valores: {} });
    });
    // Enter em campo de uma linha confirma; em textarea quebra linha (comportamento normal do form).
    dlg.showModal();
    const primeiro = dlg.querySelector<HTMLElement>('.ui-dlg-corpo input, .ui-dlg-corpo textarea, .ui-dlg-op');
    if (primeiro) {
      primeiro.focus();
      const inp = primeiro as HTMLInputElement;
      if (inp.select && inp.value) inp.select();
    } else {
      dlg.querySelector<HTMLElement>('.ui-dlg-ok, .ui-dlg-cancelar')?.focus();
    }
  });
}

/** Recado simples, um botão só. */
export async function uiAviso(msg: string, opts: { titulo?: string; ok?: string } = {}): Promise<void> {
  await montar({ titulo: opts.titulo || 'Aviso', msg, ok: opts.ok || 'Entendi', cancelar: null });
}

/** Erro: mesmo formato do aviso, em vermelho. */
export async function uiErro(msg: string, opts: { titulo?: string } = {}): Promise<void> {
  await montar({ titulo: opts.titulo || 'Erro', msg, ok: 'Fechar', cancelar: null, perigo: true });
}

/** Pergunta de sim/não. Retorna true só se o usuário confirmar. */
export async function uiConfirmar(
  msg: string,
  opts: { titulo?: string; ok?: string; cancelar?: string; perigo?: boolean } = {},
): Promise<boolean> {
  const r = await montar({
    titulo: opts.titulo || 'Confirmar',
    msg,
    ok: opts.ok || 'Confirmar',
    cancelar: opts.cancelar || 'Cancelar',
    perigo: opts.perigo,
  });
  return r.ok;
}

/** Um campo de texto. Retorna null se o usuário cancelar (igual ao prompt nativo). */
export async function uiPerguntar(
  rotulo: string,
  valor: string | number | null = '',
  opts: {
    titulo?: string; msg?: string; ok?: string; placeholder?: string; dica?: string;
    longo?: boolean; numero?: boolean; min?: number; max?: number; obrigatorio?: boolean;
  } = {},
): Promise<string | null> {
  const r = await montar({
    titulo: opts.titulo || rotulo,
    msg: opts.msg,
    ok: opts.ok || 'Salvar',
    campos: [{
      nome: 'v', rotulo, valor, placeholder: opts.placeholder, dica: opts.dica,
      tipo: opts.longo ? 'longo' : opts.numero ? 'numero' : 'texto',
      min: opts.min, max: opts.max, obrigatorio: opts.obrigatorio,
    }],
  });
  return r.ok ? r.valores.v : null;
}

/** Vários campos numa janela só. Retorna null se cancelar. */
export async function uiFormulario(
  titulo: string,
  campos: Campo[],
  opts: { msg?: string; ok?: string } = {},
): Promise<Record<string, string> | null> {
  const r = await montar({ titulo, msg: opts.msg, campos, ok: opts.ok || 'Salvar' });
  return r.ok ? r.valores : null;
}

/** Lista de opções em botões. Retorna o `valor` escolhido, ou null. */
export async function uiEscolher(
  titulo: string,
  opcoes: Opcao[],
  opts: { msg?: string; filtro?: string; classe?: string } = {},
): Promise<string | null> {
  const r = await montar({
    titulo, msg: opts.msg, opcoes, ok: null, filtro: opts.filtro, classe: opts.classe,
  });
  return r.opcao ?? null;
}
