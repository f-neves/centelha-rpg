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
  faseEm, fita, defesaPerdida, resumoDaAcao, acaoVazia, anatomia, declarar, abortar,
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

// ------------------------------------------------------- a tira da ordem
/**
 * Uma peça na fila, do jeito que a tira precisa dela.
 *
 * Cada tela guarda o combatente à sua maneira (o Grid tem token e grupo, o
 * rastreador tem card e condições), então o que atravessa é este molde reduzido:
 * o mínimo para responder QUANDO a pessoa age e EM QUE FASE ela está.
 */
export type PecaDaFila = {
  id: string;
  nome: string;
  tick: number;
  iniciativa?: number | null;
  grupo?: string | null;
  /** O retrato já montado: quem sabe achar a imagem é a página, não a tira. */
  avatar: string;
  /** Vida em porcentagem, ou null quando a mesa esconde o número. */
  pct?: number | null;
  acao?: Acao | null;
  /** Guarda segurada: a Defesa não cai como cairia num gesto solto. */
  segura?: boolean;
  /** Está no mesmo Tick de quem age. */
  vez?: boolean;
  /** É a primeira do Tick, a que o "próximo" vai encerrar. */
  age?: boolean;
  /** Uma linha extra no cartão, quando a tela tem algo a mais a dizer. */
  extra?: string;
};

/**
 * A FILA É UMA ESCADA, e não uma lista lisa.
 *
 * O que se lê primeiro é "quando", e não "quem": as peças entram debaixo de um
 * degrau ("Agora", "em 2 ticks") em vez de cada uma carregar um Tick absoluto
 * que o leitor teria de subtrair de cabeça. Numa cena de dez com oito no mesmo
 * Tick, a coluna antiga dizia "t 0" oito vezes.
 *
 * Devolve pares `{chave, html}` porque as duas telas desenham com `reconciliar`:
 * a fila repinta a cada movimento de peça, e refazer o DOM inteiro para mudar
 * um número apaga foco, rolagem e animação.
 */
export function itensDaFila(
  pecas: PecaDaFila[],
  tick: number,
  opts: { marcacao?: Marcacao } = {},
): { chave: string; html: string }[] {
  const itens: { chave: string; html: string }[] = [];
  let degrau: number | null = null;
  for (const c of pecas) {
    const falta = Math.max(0, (c.tick ?? 0) - tick);
    if (falta !== degrau) {
      degrau = falta;
      itens.push({ chave: '#g' + falta, html: `<div class="ini-grupo${falta === 0 ? ' agora' : ''}">${
        falta === 0 ? 'Agora' : `em ${falta} tick${falta > 1 ? 's' : ''}`}</div>` });
    }
    const a = c.acao && !acaoVazia(c.acao) && (c.acao as Acao).golpes?.length ? (c.acao as Acao) : null;
    const fase = faseEm(a, tick);
    const dv = defesaPerdida(c.acao ?? null, tick, { segura: !!c.segura });
    // A fase POR EXTENSO, e com o número que importa nela: no Preparo é quando
    // o golpe sai, no Golpe é qual dos golpes está saindo, na Recuperação é
    // quando a guarda volta. A cor diz depressa, a palavra diz sem dúvida, e
    // quem chega no meio da luta não decorou a legenda.
    const futuros = a ? a.golpes.filter((g) => g >= tick) : [];
    const prox = futuros.length ? Math.min(...futuros) : 0;
    const qual = a && a.golpes.length > 1 ? ` ${a.golpes.indexOf(tick) + 1}/${a.golpes.length}` : '';
    const fraseFase = !a ? '<b>livre</b>'
      : fase === 'preparo' ? `<b>Preparo</b> · golpe no ${prox}`
      : fase === 'golpe' ? `<b>Golpe${qual}</b> · Defesa ${dv.total}`
      : `<b>Recuperação</b> · livre no ${a.livre}`;
    // O selo escrito e a fita dizem a mesma coisa em línguas diferentes: quem
    // pediu números em vez de fita continua tendo a palavra.
    const f = a
      ? `<span class="ini-fita" title="${esc(resumoDaAcao(a, tick))}">${
        (opts.marcacao ?? 'fita') === 'fita' ? fitaHTML(a, tick, { largura: 9, mini: true }) : seloFaseHTML(a, tick)}</span>`
      : '';
    const dica = c.age ? ' · age agora' : c.vez ? ' · também neste tick' : '';
    const cls = fase === 'preparo' ? 'f-prep' : fase === 'golpe' ? 'f-golpe' : fase === 'recuperacao' ? 'f-rec' : '';
    itens.push({ chave: c.id, html: `<div class="ini-item g-${esc(c.grupo || 'inimigo')}${c.vez ? ' vez' : ''}${
      c.age ? ' age' : ''}" data-c="${c.id}" data-t="${c.tick ?? 0}"
      title="${esc(c.nome)}${dica}${a ? ' · ' + esc(resumoDaAcao(a, tick)) : ''}">
      <span class="ini-av">${c.avatar}</span>
      <span class="ini-nome">${esc(c.nome)}</span>
      <span class="ini-fase ${cls}">${fraseFase}</span>
      ${f}
      <span class="ini-num">ini <b>${c.iniciativa ?? 0}</b>${
        c.pct != null ? ` · ${Math.round(c.pct)}%` : ''}${c.extra ? ` · ${esc(c.extra)}` : ''}</span>
    </div>` });
  }
  return itens;
}

/** O relógio da cena: o Tick em corpo grande, com a rodada de acompanhante. */
export function relogioHTML(id = 'ini-tk', idRodada = 'ini-rd') {
  return `<div class="ini-relogio">
    <span class="ini-tk-n" id="${id}"></span>
    <span class="ini-tk-rot">Tick</span>
    <span class="ini-rd" id="${idRodada}"></span>
  </div>`;
}

// ------------------------------------------------------------- o abortar
/** Dá para mostrar o botão de abortar para esta pessoa agora? */
export const podeAbortar = (acao: Acao | null | undefined, tick: number) => abortar(acao, tick).pode;

/** O que se aborta PARA: narração, mas é ela que deixa a regra visível na tela. */
const SAIDAS: { v: string; t: string; d: string }[] = [
  { v: 'desviar', t: 'Desviar', d: 'Sai da linha do golpe e recompõe a guarda. É o desvio de emergência da §5.5, virado regra geral.' },
  { v: 'mover', t: 'Mover', d: 'Recua, avança, muda de posição. O que o gesto abortado vira é passo, não ataque.' },
  { v: 'interpor', t: 'Se interpor', d: 'Entra na frente de alguém e leva o golpe no lugar dele. O gesto morre para salvar o outro.' },
];

/**
 * O diálogo de abortar.
 *
 * Ele existe porque a conta é chata e a decisão é rápida: no meio da luta o
 * jogador precisa saber "quanto me custa desistir?" em um olhar, e não fazer a
 * subtração. A caixa responde com o número pronto e diz o que se perde.
 *
 * `aoConfirmar` recebe a conta já fechada. Quem persiste é a página: aqui não
 * há banco.
 */
export function abrirAbortar(
  quem: { nome: string; acao: Acao; tick: number },
  aoConfirmar: (r: { novoTick: number; perdidos: number; custo: number; metros: number; saida: string; frase: string }) => void | Promise<void>,
) {
  const { nome, acao, tick } = quem;
  const base = abortar(acao, tick, 0);
  const { corpo, fechar } = uiPainel(`Abortar o gesto de ${nome}`, { classe: 'mesa-dlg tempo-dlg' });

  if (!base.pode) {
    corpo.innerHTML = `<p class="tempo-intro">${esc(base.porque)}</p>
      <div class="ui-dlg-btns"><button type="button" class="btn" id="ab-fechar">Fechar</button></div>`;
    (corpo.querySelector('#ab-fechar') as HTMLElement).onclick = () => fechar();
    return;
  }

  corpo.innerHTML = `
    <p class="tempo-intro">${esc(nome)} está no <b>Preparo</b>, e o golpe ainda não saiu. Dá para
      desistir dele: <b>os Ticks já investidos não voltam</b>, e o que sobrava do ciclo volta.
      Só para <b>mover, desviar ou se interpor</b> — nunca para atacar.</p>
    <div class="ab-conta">
      <span><b>${base.perdidos}</b> Tick(s) investidos, perdidos</span>
      <span><b>${base.devolvidos}</b> Tick(s) do ciclo, devolvidos</span>
    </div>
    <div class="rev-h">Para quê</div>
    <div class="rev-ops">${SAIDAS.map((o, i) => `<label class="rev-op" title="${esc(o.d)}">
      <input type="radio" name="ab-saida" value="${o.v}"${i === 0 ? ' checked' : ''} />
      <span class="rev-op-corpo"><span class="rev-op-t">${o.t}</span><span class="rev-op-d">${esc(o.d)}</span></span>
    </label>`).join('')}</div>
    <label class="ab-m">Metros percorridos
      <input type="number" id="ab-metros" min="0" step="1" value="0" />
      <small>1 Tick por metro, o preço do desvio de emergência. Zero: fica onde está e recompõe a guarda.</small>
    </label>
    <div class="acao-conta" id="ab-res"></div>
    <div class="ui-dlg-btns">
      <button type="button" class="btn" id="ab-cancelar">Cancelar</button>
      <button type="button" class="btn primary" id="ab-ok">Abortar</button>
    </div>`;

  const inp = corpo.querySelector('#ab-metros') as HTMLInputElement;
  const metros = () => Math.max(0, parseInt(inp.value || '0', 10) || 0);
  const conta = () => abortar(acao, tick, metros());
  const pintar = () => {
    const r = conta();
    (corpo.querySelector('#ab-res') as HTMLElement).innerHTML =
      `<div>Fica livre no <b>Tick ${r.novoTick}</b>${r.custo ? ` <span class="muted">(${tick} + ${r.custo} do deslocamento)</span>` : ' <span class="muted">(agora mesmo)</span>'}</div>`
      + `<div class="muted">Sem abortar, a próxima ação dele sairia no Tick ${acao.livre}.</div>`;
  };
  inp.oninput = pintar; pintar();

  (corpo.querySelector('#ab-cancelar') as HTMLElement).onclick = () => fechar();
  (corpo.querySelector('#ab-ok') as HTMLElement).onclick = async () => {
    const r = conta();
    const saida = (corpo.querySelector('input[name="ab-saida"]:checked') as HTMLInputElement)?.value || 'desviar';
    const verbo = saida === 'mover' ? 'e se moveu' : saida === 'interpor' ? 'e se interpôs' : 'e desviou';
    const m = metros();
    fechar();
    await aoConfirmar({
      novoTick: r.novoTick, perdidos: r.perdidos, custo: r.custo, metros: m, saida,
      frase: `${nome} abortou o gesto ${verbo}${m ? ` ${m} m` : ' sem sair do lugar'}`
        + `${r.perdidos ? ` · perdeu ${r.perdidos} Tick(s) de Preparo` : ''}`,
    });
  };
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
