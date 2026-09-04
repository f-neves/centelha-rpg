/**
 * O diálogo de condições, um só para as duas telas.
 *
 * ELE JÁ EXISTIA, e só na aba Combate. O catálogo (`condicoes.json`, 48
 * verbetes com número), a soma (`somarCondicoes`), a coluna (`migracao-11`), a
 * máscara do jogador (`migracao-27`) e o RPC que aceita a chave
 * (`jogador_muda_peca`, `migracao-22`) estavam todos de pé; o que faltava era
 * a tela no lugar onde a mesa está olhando, que é o tabuleiro.
 *
 * A consequência prática estava anotada no `00-diagnostico.md`: a condição
 * `correndo` (Defesa −4) tem de ser posta à mão, ninguém a aplica sozinho, e
 * quem corre no Grid não pagava o preço a menos que o mestre trocasse de aba.
 *
 * POR QUE UM MÓDULO EM VEZ DE UMA CÓPIA. Copiar as sessenta linhas para o
 * `grid.astro` seria o mesmo defeito que a política de pular navegador teve em
 * oito arquivos: duas cópias divergem no primeiro conserto que só uma recebe.
 * Aqui a diferença entre as duas telas é pequena e explícita, e cabe no `ctx`:
 * quem grava, quem registra e quem repinta. O resto é igual porque É igual.
 *
 * A MARCAÇÃO mora no `CondDlg.astro` e o estilo no `MesaCab.astro`, pelo mesmo
 * motivo: as duas páginas já os incluem.
 */
import {
  esc, norm, COND, COND_LISTA, COND_GRUPOS, condChipHTML, type Condicao,
} from './mesa-core';

export interface CtxCond {
  /** Grava a lista inteira na peça. Devolve `{ error }`, como o Supabase. */
  gravar: (cid: string, conds: any[]) => Promise<{ error: any }>;
  /**
   * A linha do registro, nas DUAS redações: a do mestre e a do jogador.
   *
   * `pub` nulo quer dizer "só o mestre lê". Quem decide é a tela que chamou,
   * porque a regra de quem vê condição de quem é dela (`REV.condInimigo`), e
   * não deste diálogo.
   */
  registrar: (txt: string, pub: string | null) => any;
  /** Repinta a tela de quem chamou, depois de cada gravação. */
  repintar: () => void;
  /** O erro na cara do usuário. Cada página tem o seu. */
  uiErro: (m: string) => any;
}

/** As condições de uma peça, já resolvidas contra o catálogo. */
export const condsDe = (c: any): Condicao[] =>
  (Array.isArray(c.condicoes) ? c.condicoes : []).map((k: any) => ({ ...(COND[k.id] || {}), ...k }));

const elo = (id: string) => document.getElementById(id) as HTMLElement;

/**
 * Abre o diálogo para uma peça. `c` é mutado no lugar, como as duas telas já
 * fazem: elas guardam o combatente em `COMBS` e repintam a partir de lá.
 */
export function abrirCondicoes(ctx: CtxCond, c: any, publicavel = true) {
  const dlg = elo('cond-dlg') as HTMLDialogElement;
  if (!dlg) return;
  elo('cond-titulo').textContent = `Condições de ${c.nome}`;
  const busca = elo('cond-busca') as HTMLInputElement;
  busca.value = '';

  const gravar = async () => {
    const { error } = await ctx.gravar(c.id, c.condicoes);
    if (error) {
      await ctx.uiErro(/condicoes/i.test(error.message || '')
        ? 'A coluna "condicoes" ainda não existe. Rode supabase/migracao-11.sql.'
        : 'Erro ao gravar a condição: ' + error.message);
    }
    desenhar();
    ctx.repintar();
  };

  /** A frase que o jogador lê, ou nada quando a mesa esconde as condições. */
  const pub = (txt: string) => (publicavel ? txt : null);

  const desenhar = () => {
    const ativas = condsDe(c);
    elo('cond-ativas').innerHTML = ativas.length
      ? ativas.map((x) => condChipHTML(x, true, c.id)).join('')
      : '<span class="muted" style="font-size:var(--fs-micro)">nenhuma condição</span>';
    elo('cond-ativas').querySelectorAll<HTMLElement>('.cond-x').forEach((b) => b.addEventListener('click', async () => {
      const saiu = COND[b.dataset.cond || ''] || { nome: b.dataset.cond };
      c.condicoes = (c.condicoes || []).filter((k: any) => k.id !== b.dataset.cond);
      await ctx.registrar(`${c.nome}: fim de ${saiu.nome}.`, pub(`${c.nome}: fim de ${saiu.nome}.`));
      await gravar();
    }));
    const q = norm(busca.value.trim());
    const temIds = new Set((c.condicoes || []).map((k: any) => k.id));
    elo('cond-catalogo').innerHTML = COND_GRUPOS.map((gp) => {
      const itens = COND_LISTA.filter((x) => x.grupo === gp.id
        && (!q || norm(x.nome + ' ' + (x.nota || '')).includes(q)) && !temIds.has(x.id));
      if (!itens.length) return '';
      return `<div class="cond-grupo"><div class="cond-grupo-t">${esc(gp.nome)}</div>
        <div class="conds">${itens.map((x) => condChipHTML(x)).join('')}</div></div>`;
    }).join('') || '<p class="vazio">nada encontrado</p>';
    // O chip é achado pelo NOME desenhado, e não por um `data-`, porque é assim
    // que a aba Combate já o achava. Trocar isso aqui seria mudar duas telas
    // por causa de uma.
    elo('cond-catalogo').querySelectorAll<HTMLElement>('.cond').forEach((chip) => {
      const nome = chip.querySelector('.cond-n')?.textContent || '';
      chip.addEventListener('click', async () => {
        const achou = COND_LISTA.find((x) => x.nome === nome);
        if (!achou) return;
        c.condicoes = [...(c.condicoes || []), { id: achou.id }];
        await ctx.registrar(`${c.nome}: ${achou.nome}.`, pub(`${c.nome}: ${achou.nome}.`));
        await gravar();
      });
    });
  };
  busca.oninput = desenhar;
  desenhar();

  const nInp = (id: string) => (elo(id) as HTMLInputElement);
  const num = (id: string) => parseInt(nInp(id).value, 10) || 0;
  (elo('cc-add') as HTMLButtonElement).onclick = async () => {
    const nome = nInp('cc-nome').value.trim();
    if (!nome) return;
    c.condicoes = [...(c.condicoes || []), {
      id: 'x-' + norm(nome).replace(/\W+/g, '-'), nome, cor: 'neutro', icone: '◆',
      acao: num('cc-acao'), dados: num('cc-dados'), defesa: num('cc-defesa'),
      porRodada: num('cc-rodada'), nota: nInp('cc-nota').value,
    }];
    nInp('cc-nome').value = '';
    await ctx.registrar(`${c.nome}: ${nome} (condição caseira).`, pub(`${c.nome}: ${nome}.`));
    await gravar();
  };
  (elo('cond-fechar') as HTMLButtonElement).onclick = () => dlg.close();
  dlg.showModal();
}
