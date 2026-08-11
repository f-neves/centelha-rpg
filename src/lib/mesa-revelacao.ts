// O painel de revelação: um lugar só para "o que os jogadores veem".
//
// Antes isto era um select solto na barra do combate, dois campos escondidos no
// fundo do diálogo de editar combatente e três botões 👁 espalhados por abas
// diferentes. Cada peça funcionava; juntas não formavam resposta para a única
// pergunta que o mestre faz de verdade: *o que eles estão vendo agora?*
//
// Aqui a pergunta tem uma tela. As escolhas vêm com amostra do resultado (a
// barra, a etiqueta, os números, do jeito que aparecem do outro lado) porque
// descrever em palavras o que é visual gasta mais parágrafo do que desenhar.
import {
  esc, u, hpBarHTML, estadoChipHTML, avatarHTML,
  revelarDaMesa, semMigracao14, type CtxMesa, type Revelar, type NivelVida,
} from './mesa-core';
import { uiErro } from './ui-dialog';

const el = (i: string) => document.getElementById(i)!;

/** Resumo de uma linha para botão e cabeçalho. */
export function resumoRevelacao(r: Revelar) {
  const v = r.vidaInimigo === 'numero' ? 'vida à vista' : r.vidaInimigo === 'estado' ? 'vida por estado' : 'vida oculta';
  return r.statsInimigo ? `${v} · números à vista` : v;
}

const VIDA_OPS: { v: NivelVida; t: string; d: string; amostra: string }[] = [
  {
    v: 'numero', t: 'Barra e número', d: 'O grupo acompanha a Vida como acompanha a própria.',
    amostra: hpBarHTML(17, 26, 'amostra-n', 'mini'),
  },
  {
    v: 'estado', t: 'Só a palavra', d: 'Eles sabem que está mal, não quanto falta. Sem barra: barra é régua.',
    amostra: estadoChipHTML(65),
  },
  {
    v: 'nada', t: 'Só a cor do retrato', d: 'Nada escrito. O rosto escurece de âmbar a vermelho abaixo da metade.',
    amostra: avatarHTML('Grald', null, 'av-p', 22),
  },
];

const FICHA_OPS: { v: string; t: string; d: string }[] = [
  { v: 'nada', t: 'Só quem é', d: 'Retrato, nome, conceito e o jogador por trás. Nenhum número.' },
  { v: 'fisico', t: 'Mais o que se vê na pessoa', d: 'Força, Destreza, Vigor, Aparência e raça: o que dois dias de estrada ensinam.' },
  { v: 'tudo', t: 'A ficha inteira', d: 'Perícias, Centelha, Virtudes, Artes, defesas. Mesa de peito aberto.' },
];

function opcoesHTML(nome: string, ops: { v: string; t: string; d: string; amostra?: string }[], atual: string) {
  return `<div class="rev-ops">${ops.map((o) => `<label class="rev-op" title="${esc(o.d)}">
    <input type="radio" name="${esc(nome)}" value="${esc(o.v)}"${o.v === atual ? ' checked' : ''} />
    <span class="rev-op-corpo">
      <span class="rev-op-t">${o.t}</span>
      <span class="rev-op-d">${esc(o.d)}</span>
    </span>
    ${o.amostra ? `<span class="rev-op-am" aria-hidden="true">${o.amostra}</span>` : ''}
  </label>`).join('')}</div>`;
}

/**
 * Conta o que está aberto em cada aba.
 *
 * É a metade da tela que ninguém pediu e todo mestre precisa: dá para regular a
 * Vida do goblin com precisão de cirurgião e esquecer que o mapa da cripta está
 * liberado desde a sessão passada. Seis consultas curtas, uma vez, ao abrir.
 */
async function contarLiberado(sb: any, id: string) {
  const conta = async (tabela: string, filtro?: (q: any) => any) => {
    let q = sb.from(tabela).select('visivel_jogadores', { count: 'exact' }).eq('mesa_id', id);
    if (filtro) q = filtro(q);
    const { data, error } = await q;
    if (error) return null;
    return { total: data.length, abertos: data.filter((x: any) => x.visivel_jogadores).length };
  };
  const [criaturas, mapas, arquivos, codex, notas, sessoes] = await Promise.all([
    conta('mesa_criaturas'),
    conta('arquivos', (q: any) => q.eq('categoria', 'mapa')),
    conta('arquivos', (q: any) => q.eq('bucket', 'mesa').neq('categoria', 'mapa')),
    conta('mesa_codex'),
    conta('mesa_notas'),
    conta('mesa_sessoes'),
  ]);
  return { criaturas, mapas, arquivos, codex, notas, sessoes };
}

function linhaConta(rot: string, dado: any, aba: string, id: string, dica: string) {
  if (!dado) return '';
  const { total, abertos } = dado;
  const cls = !total ? 'z' : abertos === total ? 'tudo' : abertos ? 'parte' : 'nada';
  return `<a class="rev-conta ${cls}" href="${u(aba)}?id=${id}" title="${esc(dica)}">
    <span class="rc-n">${abertos}<span class="rc-de">/${total}</span></span>
    <span class="rc-r">${esc(rot)}</span>
  </a>`;
}

/**
 * Abre o painel. `aoSalvar` recebe o novo quadro de chaves para a página se
 * redesenhar sem recarregar.
 */
export async function abrirRevelacao(ctx: CtxMesa, aoSalvar?: (r: Revelar) => void | Promise<void>) {
  const { sb, mesa, id } = ctx;
  const r = revelarDaMesa(mesa);
  const dlg = el('rev-dlg') as HTMLDialogElement;

  el('rev-inimigos').innerHTML = opcoesHTML('rv-vida-op', VIDA_OPS, r.vidaInimigo);
  el('rev-fichas').innerHTML = opcoesHTML('rv-ficha', FICHA_OPS, r.fichaColegas || 'fisico');
  (el('rv-stats') as HTMLInputElement).checked = r.statsInimigo;
  (el('rv-cond') as HTMLInputElement).checked = r.condInimigo;
  (el('rv-status') as HTMLInputElement).checked = !!r.statusColegas;
  (el('rv-vida') as HTMLInputElement).checked = r.vidaColegas !== false;
  (el('rv-energia') as HTMLInputElement).checked = !!r.energiaColegas;

  // "A ficha inteira" já contém as três: marcá-las de novo não muda nada, e
  // deixá-las clicáveis sugere que mudariam. Travam marcadas, com o aviso do
  // porquê, e voltam ao que a mesa tinha quando o nível desce.
  const guardado = { status: !!r.statusColegas, vida: r.vidaColegas !== false, energia: !!r.energiaColegas };
  const travar = () => {
    const tudo = (document.querySelector('input[name="rv-ficha"]:checked') as HTMLInputElement)?.value === 'tudo';
    for (const [id, k] of [['rv-status', 'status'], ['rv-vida', 'vida'], ['rv-energia', 'energia']] as const) {
      const cx = el(id) as HTMLInputElement;
      if (tudo) cx.checked = true;
      else cx.checked = (guardado as any)[k];
      cx.disabled = tudo;
      cx.closest('label')?.classList.toggle('travada', tudo);
    }
    (el('rv-aviso') as HTMLElement).hidden = !tudo;
  };
  el('rev-fichas').querySelectorAll('input').forEach((i) => i.addEventListener('change', travar));
  for (const [id, k] of [['rv-status', 'status'], ['rv-vida', 'vida'], ['rv-energia', 'energia']] as const) {
    el(id).addEventListener('change', (e) => { (guardado as any)[k] = (e.target as HTMLInputElement).checked; });
  }
  travar();

  el('rev-liberado').innerHTML = '<span class="muted">contando…</span>';
  contarLiberado(sb, id).then((c) => {
    el('rev-liberado').innerHTML = [
      linhaConta('criaturas', c.criaturas, 'mesa/criaturas', id, 'Criaturas liberadas para o grupo. As outras nem aparecem na aba deles.'),
      linhaConta('mapas', c.mapas, 'mesa/mapas', id, 'Mapas liberados. Os pinos têm liberação própria, dentro do mapa.'),
      linhaConta('handouts', c.arquivos, 'mesa/arquivos', id, 'Arquivos liberados para todos. Um handout também pode ir para um jogador só.'),
      linhaConta('compêndio', c.codex, 'mesa/compendio', id, 'Entradas do compêndio (NPCs, lugares, facções) visíveis para o grupo.'),
      linhaConta('notas', c.notas, 'mesa/diario', id, 'Notas do Diário compartilhadas.'),
      linhaConta('sessões', c.sessoes, 'mesa/diario', id, 'Resumos de sessão publicados.'),
    ].join('') || '<span class="muted">nada para contar ainda</span>';
  });

  const marcado = (n: string) =>
    (document.querySelector(`input[name="${n}"]:checked`) as HTMLInputElement)?.value;

  el('rv-cancelar').onclick = () => dlg.close();
  el('rv-salvar').onclick = async () => {
    const nivel = marcado('rv-ficha') || 'fisico';
    const novo: any = {
      vidaInimigo: marcado('rv-vida-op') || 'estado',
      statsInimigo: (el('rv-stats') as HTMLInputElement).checked,
      condInimigo: (el('rv-cond') as HTMLInputElement).checked,
      fichaColegas: nivel,
      // Com a ficha inteira as três estão travadas marcadas na tela; o que se
      // grava é a intenção guardada, para o mestre não perder a configuração
      // ao passear pelos níveis.
      statusColegas: nivel === 'tudo' ? guardado.status : (el('rv-status') as HTMLInputElement).checked,
      vidaColegas: nivel === 'tudo' ? guardado.vida : (el('rv-vida') as HTMLInputElement).checked,
      energiaColegas: nivel === 'tudo' ? guardado.energia : (el('rv-energia') as HTMLInputElement).checked,
    };
    dlg.close();
    const { error } = await sb.from('mesas').update({ revelar: novo }).eq('id', id);
    if (error) {
      return uiErro(semMigracao14(error)
        ? 'O painel de revelação chega com a migração 14. Rode supabase/migracao-14.sql no SQL Editor do Supabase.'
        : 'Erro: ' + error.message);
    }
    mesa.revelar = novo;
    await aoSalvar?.(revelarDaMesa(mesa));
  };
  dlg.showModal();
}
