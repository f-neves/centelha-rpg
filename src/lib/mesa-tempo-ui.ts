// O tempo do combate, na tela da mesa.
//
// `combate-tempo.ts` diz o que a regra é; este arquivo desenha. São duas peças:
//
//   · a FITA, uma linha por combatente, uma célula por Tick, três tons. Ela vale
//     nos dois sistemas: no normal o Golpe cai no primeiro Tick e o resto do
//     ciclo é Recuperação, então a fita degenera com elegância em vez de sumir.
//   · o PAINEL DO MESTRE, onde a mesa escolhe o sistema (normal ou P/G/R) e a
//     marcação (fita ou só os números). Mesmo desenho do painel de revelação:
//     a escolha vem com amostra do resultado, porque descrever em palavras o
//     que é visual gasta mais parágrafo do que desenhar.
//
// Mora numa lib, e não na página, porque a fita aparece em dois lugares com
// tamanhos diferentes: o card do rastreador de combate e o token do Grid.
import { esc } from './mesa-core';
import type { CtxMesa } from './mesa-core';
import { uiPainel, uiErro } from './ui-dialog';
import {
  faseEm, fita, defesaPerdida, resumoDaAcao, acaoVazia, anatomia, declarar,
  combateDaMesa, COMBATE_PADRAO, SISTEMAS, MARCACOES, FASE_ROTULO,
  type Acao, type Fase, type CombateMesa, type Sistema, type Marcacao, type ClasseArma,
} from './combate-tempo';

const CLS: Record<Fase, string> = { livre: 'f-livre', preparo: 'f-prep', golpe: 'f-golpe', recuperacao: 'f-rec' };

/**
 * A fita de Ticks: o tempo de uma pessoa, do agora para a frente.
 *
 * A primeira célula é sempre o Tick corrente e leva a régua vertical, que é o
 * que deixa comparar duas linhas sem contar casas. Quem está livre ganha a fita
 * apagada em vez de nada: o buraco na tabela seria pior que a linha vazia,
 * porque o olho leria "sumiu" em vez de "está pronto".
 */
export function fitaHTML(
  acao: Acao | null | undefined,
  tickAgora: number,
  opts: { largura?: number; mini?: boolean; rotulo?: boolean } = {},
) {
  const largura = opts.largura ?? 12;
  const cels = fita(acao, tickAgora, largura);
  const dica = acaoVazia(acao) ? 'Livre: a guarda está inteira.' : resumoDaAcao(acao, tickAgora);
  const corpo = cels.map((c) => {
    const dv = defesaPerdida(acao, c.tick);
    const t = c.fase === 'livre' ? `Tick ${c.tick}: livre` : `Tick ${c.tick}: ${FASE_ROTULO[c.fase]}, Defesa ${dv.total}`;
    return `<i class="fita-c ${CLS[c.fase]}${c.agora ? ' agora' : ''}" title="${esc(t)}"></i>`;
  }).join('');
  const rot = opts.rotulo && !acaoVazia(acao)
    ? `<span class="fita-rot">${esc(resumoDaAcao(acao, tickAgora))}</span>` : '';
  return `<span class="fita${opts.mini ? ' fita-mini' : ''}" title="${esc(dica)}">${corpo}</span>${rot}`;
}

/** O selo de fase: a palavra e o tom, para o cabeçalho do card. */
export function seloFaseHTML(acao: Acao | null | undefined, tick: number) {
  const f = faseEm(acao, tick);
  if (f === 'livre') return '';
  const dv = defesaPerdida(acao, tick);
  const falta = Math.max(0, (acao as Acao).livre - tick);
  return `<span class="fase-selo ${CLS[f]}" title="${esc(`${FASE_ROTULO[f]} · Defesa ${dv.total} · livre em ${falta} Tick(s)`)}">
    ${FASE_ROTULO[f]}${dv.total ? ` <b>${dv.total}</b>` : ''}</span>`;
}

/** Uma linha para o botão da barra: o que esta mesa escolheu. */
export function resumoDoTempo(c: CombateMesa) {
  const s = SISTEMAS.find((x) => x.id === c.sistema)?.nome || c.sistema;
  return `${s} · ${c.marcacao === 'fita' ? 'fita' : 'números'}`;
}

// ------------------------------------------------------- a amostra do painel
/**
 * Uma fita de exemplo, desenhada com a régua de verdade.
 *
 * É a mesma `anatomia()` que a mesa usa, com uma espada longa (média, 6 Ticks),
 * então a amostra não pode mentir sobre o sistema: se a régua mudar, ela muda.
 */
function amostraHTML(sistema: Sistema) {
  const linha = (rot: string, classe: ClasseArma, vel: number, manobra?: any, golpes?: number) => {
    const a = declarar(0, anatomia({ classe, velocidade: vel, sistema, manobra, golpes }));
    return `<div class="tempo-am-l"><span class="tempo-am-r">${esc(rot)}</span>
      ${fitaHTML(a, 0, { largura: Math.max(8, a.livre + 1) })}
      <span class="tempo-am-n">${a.golpes.length > 1 ? `golpes nos Ticks ${a.golpes.join(' e ')}` : `golpe no Tick ${a.golpes[0]}`} · livre no ${a.livre}</span></div>`;
  };
  return `<div class="tempo-am">
    ${linha('adaga', 'leve', 5)}
    ${linha('espada longa', 'media', 6)}
    ${linha('martelo', 'pesada', 7)}
    ${linha('duas adagas', 'leve', 5, 'dupla')}
  </div>`;
}

function opsHTML(nome: string, ops: { id: string; nome: string; resumo: string; detalhe?: string }[], atual: string) {
  return `<div class="rev-ops">${ops.map((o) => `<label class="rev-op" title="${esc(o.detalhe || o.resumo)}">
    <input type="radio" name="${esc(nome)}" value="${esc(o.id)}"${o.id === atual ? ' checked' : ''} />
    <span class="rev-op-corpo">
      <span class="rev-op-t">${esc(o.nome)}</span>
      <span class="rev-op-d">${esc(o.resumo)}</span>
    </span>
  </label>`).join('')}</div>`;
}

/**
 * O painel do mestre: como o tempo passa nesta mesa.
 *
 * A escolha é por MESA e não por encontro de propósito: é uma regra de jogo, do
 * tamanho de "usamos flanqueamento". Trocar no meio da luta seria trocar o chão
 * embaixo de quem já declarou, e por isso o painel avisa quando há ação em
 * andamento em vez de deixar o mestre descobrir depois.
 */
export async function abrirEscolhaDoTempo(
  ctx: CtxMesa,
  opts: { emAndamento?: number } = {},
  aoSalvar?: (c: CombateMesa) => void | Promise<void>,
) {
  const { sb, mesa, id } = ctx;
  const atual = combateDaMesa(mesa);
  const { corpo, fechar } = uiPainel('Como o tempo passa nesta mesa', { classe: 'mesa-dlg tempo-dlg' });

  const pintar = (sis: Sistema) => {
    const s = SISTEMAS.find((x) => x.id === sis);
    (corpo.querySelector('.tempo-amostra') as HTMLElement).innerHTML =
      `<div class="rev-h rev-h2">O que isso desenha</div>
       <p class="tempo-nota">${esc(s?.detalhe || '')}</p>${amostraHTML(sis)}`;
  };

  corpo.innerHTML = `
    <p class="tempo-intro">Duas maneiras de contar Ticks, <b>um conjunto de regras</b>. Tudo o que
      vale numa vale na outra: a escada de penalidades, a rajada, a arma em cada mão, o
      deslocamento pago e a dívida de Ticks. O que muda é <b>quando o golpe sai</b>, e o que dá
      para fazer no meio do caminho.</p>
    ${opts.emAndamento ? `<p class="tempo-aviso">Há <b>${opts.emAndamento}</b> ação em andamento neste
      encontro. Trocar o sistema agora recalcula a fita de quem já declarou.</p>` : ''}
    <div class="rev-h">O sistema</div>
    ${opsHTML('tp-sis', SISTEMAS, atual.sistema)}
    <div class="tempo-amostra"></div>
    <div class="rev-h">A marcação</div>
    <p class="tempo-nota">Só como a mesa desenha. Não muda regra nenhuma.</p>
    ${opsHTML('tp-marc', MARCACOES, atual.marcacao)}
    <div class="ui-dlg-btns">
      <button type="button" class="btn" id="tp-cancelar">Cancelar</button>
      <button type="button" class="btn primary" id="tp-salvar">Salvar</button>
    </div>`;
  pintar(atual.sistema);
  corpo.querySelectorAll<HTMLInputElement>('input[name="tp-sis"]')
    .forEach((i) => i.addEventListener('change', () => pintar(i.value as Sistema)));

  const marcado = (n: string) => (corpo.querySelector(`input[name="${n}"]:checked`) as HTMLInputElement)?.value;
  (corpo.querySelector('#tp-cancelar') as HTMLElement).onclick = () => fechar();
  (corpo.querySelector('#tp-salvar') as HTMLElement).onclick = async () => {
    const novo: CombateMesa = {
      sistema: (marcado('tp-sis') as Sistema) || COMBATE_PADRAO.sistema,
      marcacao: (marcado('tp-marc') as Marcacao) || COMBATE_PADRAO.marcacao,
    };
    fechar();
    const { error } = await sb.from('mesas').update({ combate: novo }).eq('id', id);
    if (error) {
      return uiErro(/combate|column|schema cache/i.test(error.message || '')
        ? 'A escolha do sistema de tempo chega com a migração 27. Rode supabase/migracao-27.sql no SQL Editor do Supabase.'
        : 'Erro: ' + error.message);
    }
    mesa.combate = novo;
    await aoSalvar?.(novo);
  };
}
