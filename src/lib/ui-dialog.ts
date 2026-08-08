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

/**
 * Texto pronto para comparar na busca: sem maiúscula e sem acento.
 *
 * Sem tirar o acento, procurar "maca" não acha "Maça" e "lanca" não acha
 * "Lança" — e ninguém digita acento numa caixa de busca com pressa.
 */
const normaliza = (s: unknown) =>
  String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

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

/**
 * Botões das opções, com um cabeçalho a cada troca de grupo.
 *
 * As opções SEM grupo (as ações do tipo "criar o meu") saem juntas num bloco
 * próprio, antes do catálogo. É o bloco que dá a elas uma linha só para si, com
 * as ações dividindo a largura em partes iguais: na grade do catálogo cada uma
 * cairia numa célula estreita, do tamanho de um item qualquer.
 */
function opcoesHTML(opcoes: Opcao[]): string {
  let grupoAtual: string | undefined;
  const saida: string[] = [];
  const soltas = opcoes.filter((o) => !o.grupo);
  if (soltas.length > 1) saida.push('<div class="ui-dlg-soltas">');
  let fechou = soltas.length <= 1;
  for (const o of opcoes) {
    if (!fechou && o.grupo) { saida.push('</div>'); fechou = true; }
    if (o.grupo !== grupoAtual) {
      grupoAtual = o.grupo;
      if (grupoAtual) saida.push(`<h3 class="ui-dlg-grupo">${esc(grupoAtual)}</h3>`);
    }
    // dois campos de busca: o nome vale mais que o resto, e a busca usa isso
    const nome = normaliza(o.rotulo);
    const resto = normaliza(`${o.nota || ''} ${o.busca || ''} ${o.grupo || ''}`);
    // opção sem grupo é uma ação ("criar o meu"), não item de catálogo: o filtro
    // não a esconde, senão quem procurou e não achou fica sem saída
    saida.push(`<button type="button" class="btn ui-dlg-op${o.grupo ? '' : ' ui-dlg-op-solta'}" data-v="${esc(o.valor)}"`
      + ` data-nome="${esc(nome)}" data-busca="${esc(`${nome} ${resto}`)}">`
      + (o.html ?? `${esc(o.rotulo)}${o.nota ? ` <small>${esc(o.nota)}</small>` : ''}`)
      + '</button>');
  }
  if (!fechou) saida.push('</div>');
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
          ${opcoes.length && cfg.filtro ? `<input type="search" class="ui-dlg-filtro" placeholder="${esc(cfg.filtro)}" aria-label="${esc(cfg.filtro)}" />
          <p class="ui-dlg-aviso" hidden></p>` : ''}
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

    // Filtro da lista. Três regras que fazem a diferença numa lista de catálogo:
    //
    //   1. o NOME manda. Quem digita "malha" quer a Cota de malha, não as três
    //      peças cuja descrição menciona malha. Só quando nome nenhum casa é que
    //      a descrição entra, e aí a lista avisa que mudou de critério.
    //   2. cada palavra conta separada, então "longa espada" acha Espada Longa.
    //   3. o cabeçalho do grupo que ficou vazio some junto, senão sobra um
    //      título solto no nada.
    const filtro = dlg.querySelector<HTMLInputElement>('.ui-dlg-filtro');
    if (filtro) {
      const nada = dlg.querySelector<HTMLElement>('.ui-dlg-nada');
      // os itens da grade são os filhos diretos (é neles que o filtro mexe); as
      // opções soltas podem estar um nível abaixo, dentro do bloco delas
      const itens = [...dlg.querySelectorAll<HTMLElement>('.ui-dlg-ops > *')]
        .filter((i) => !i.classList.contains('ui-dlg-soltas'));
      const ops = [...dlg.querySelectorAll<HTMLElement>('.ui-dlg-op')];
      const soltas = ops.filter((o) => o.classList.contains('ui-dlg-op-solta'));
      const catalogo = ops.filter((o) => !o.classList.contains('ui-dlg-op-solta'));
      const casaTudo = (campo: string, termos: string[]) => termos.every((t) => campo.includes(t));

      const aplicar = () => {
        const termos = normaliza(filtro.value).split(/\s+/).filter(Boolean);
        const porNome = termos.length
          ? catalogo.filter((o) => casaTudo(o.dataset.nome || '', termos))
          : catalogo;
        // sem nada no nome, vale a descrição — melhor que devolver lista vazia
        const casaram = porNome.length || !termos.length
          ? porNome
          : catalogo.filter((o) => casaTudo(o.dataset.busca || '', termos));
        const achados = new Set([...soltas, ...casaram]);
        const soDescricao = termos.length > 0 && porNome.length === 0 && casaram.length > 0;

        let grupo: HTMLElement | null = null, noGrupo = 0;
        const fechaGrupo = () => { if (grupo) grupo.hidden = noGrupo === 0; };
        for (const it of itens) {
          if (it.classList.contains('ui-dlg-grupo')) { fechaGrupo(); grupo = it; noGrupo = 0; continue; }
          it.hidden = !achados.has(it);
          if (!it.hidden) noGrupo++;
        }
        fechaGrupo();
        // o "nada" olha só o catálogo: a ação de criar o seu item sempre fica
        if (nada) nada.hidden = casaram.length > 0 || !termos.length;
        const aviso = dlg.querySelector<HTMLElement>('.ui-dlg-aviso');
        if (aviso) {
          aviso.hidden = !soDescricao;
          aviso.textContent = soDescricao ? 'Nenhum nome com isso. Estes citam na descrição:' : '';
        }
      };

      filtro.addEventListener('input', aplicar);
      // Enter escolhia nada e ainda fechava o diálogo (o <form> é method="dialog"):
      // agora leva a primeira da lista, que é o que se espera de uma busca.
      filtro.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          // a primeira do CATÁLOGO, e só com busca escrita: senão o Enter cairia
          // sempre na ação de criar item, que é a primeira da lista
          if (filtro.value.trim()) catalogo.find((o) => !o.hidden)?.click();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          ops.find((o) => !o.hidden)?.focus();
        }
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
