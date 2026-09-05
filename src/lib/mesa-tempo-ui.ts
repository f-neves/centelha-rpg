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
  faseEm, fita, defesaPerdida, resumoDaAcao, acaoVazia, anatomia, declarar, abortar, foraDeHora,
  combateDaMesa, COMBATE_PADRAO, SISTEMAS, MARCACOES, ROLAGENS, FASE_ROTULO,
  GOLPE_ADIADO, agendar, golpesNoAr, proximoGolpe,
  type Acao, type Fase, type CombateMesa, type Sistema, type Marcacao, type Rolagem,
  type ClasseArma,
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
  const dv2 = (acao as Acao).divida || 0;
  return `<span class="fase-selo ${CLS[f]}" title="${esc(`${FASE_ROTULO[f]} · Defesa ${dv.total} · livre em ${falta} Tick(s)`
    + (dv2 ? ` · deve ${dv2} Tick(s) por ter agido fora da vez` : ''))}">
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
    const prox = futuros.length ? Math.min(...futuros) : (a ? a.livre : 0);
    const qual = a && a.golpes.length > 1 ? ` ${a.golpes.indexOf(tick) + 1}/${a.golpes.length}` : '';
    // A DÍVIDA ESCRITA, e ela custa zero gestos: são os Ticks que esta pessoa
    // empurrou para o próprio futuro ao agir fora da vez. O campo `divida`
    // existia desde o P/G/R (declarado, zerado pelo `declarar`, documentado na
    // migração 27) e não era escrito nem lido em lugar nenhum; sem esta linha,
    // pagar uma reação seria um número que some no banco e a mesa veria só um
    // ciclo estranhamente longo, sem saber por quê.
    const devendo = a && (a.divida || 0) > 0 ? ` · <span class="ini-divida">deve ${a.divida}</span>` : '';
    const fraseFase = (!a ? '<b>livre</b>'
      : fase === 'preparo' ? `<b>Preparo</b> · golpe no ${prox}`
      : fase === 'golpe' ? `<b>Golpe${qual}</b> · Defesa ${dv.total}`
      : `<b>Recuperação</b> · livre no ${a.livre}`)
      // EM TODA FASE, e não só na Recuperação: a ação que nasce de uma reação
      // resolve AGORA, então quem acabou de pagar está em Golpe no mesmo Tick, e
      // a dívida sumiria da tela no instante exato em que foi contraída.
      + devendo;
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
      ${/* O MESMO em número, para o cartão que não tem largura para a frase.
            Nasce escondido: no cartão inteiro a fase vem por extenso, e dizer a
            mesma coisa duas vezes na mesma caixa é ruído. Quem o acende é a
            tira estreita do telefone. Com gesto no ar, o número é o Tick em que
            o golpe sai; sem gesto, é o Tick em que a pessoa age. */ ''}
      <span class="ini-quando ${cls}"><small>${
        a ? (fase === 'recuperacao' ? 'livre' : 'golpe') : 'age'}</small><b>${
        a ? prox : (c.tick ?? 0)}</b></span>
      ${f}
      <span class="ini-num">ini <b>${c.iniciativa ?? 0}</b>${
        c.pct != null ? ` · ${Math.round(c.pct)}%` : ''}${c.extra ? ` · ${esc(c.extra)}` : ''}</span>
    </div>` });
  }
  return itens;
}

/** Um golpe agendado que ainda não caiu, do jeito que a faixa o desenha. */
export interface GolpeNoAr {
  /** O combatente que declarou. */
  id: string;
  nome: string;
  grupo?: string | null;
  avatar?: string;
  /** O Tick em que este golpe cai. */
  tick: number;
  /** Nome do alvo, ou nada quando a ação não mirou ninguém. */
  alvo?: string | null;
  arma?: string | null;
}

/**
 * A FAIXA DOS GOLPES NO AR.
 *
 * Com o golpe adiado ligado, a mesa passa a ter uma segunda lista para
 * carregar: a fila diz quem age, e esta diz o que já foi declarado e ainda não
 * caiu. Sem ela o gesto vira contabilidade de cabeça, que é exatamente o que o
 * estudo do golpe tardio disse que não podia acontecer.
 *
 * A ordem é por Tick, e não por quem declarou: o que a mesa pergunta olhando
 * para cá é "o que cai primeiro?". O que venceu e não foi resolvido sobe para o
 * começo e fica marcado, porque um golpe esquecido é pior que um golpe atrasado.
 *
 * Devolve string vazia quando não há nada no ar: a faixa some em vez de mostrar
 * um cabeçalho vazio, e a mesa com a chave desligada nunca a vê.
 */
export function faixaDeGolpesHTML(golpes: GolpeNoAr[], tick: number): string {
  if (!golpes.length) return '';
  const ordem = [...golpes].sort((a, b) => a.tick - b.tick || a.nome.localeCompare(b.nome));
  const cartao = (g: GolpeNoAr) => {
    const falta = g.tick - tick;
    const quando = falta <= 0 ? 'agora' : `em ${falta}`;
    const atrasado = falta < 0;
    return `<button type="button" class="ar-item g-${esc(g.grupo || 'inimigo')}${
      falta <= 0 ? ' vencido' : ''}${atrasado ? ' atrasado' : ''}"
      data-golpe="${esc(g.id)}" data-t="${g.tick}"
      title="${esc(g.nome)}${g.arma ? ` · ${esc(g.arma)}` : ''} → ${esc(g.alvo || 'sem alvo')} · Tick ${g.tick}${
        atrasado ? ' (atrasado)' : ''}">
      ${g.avatar || ''}
      <span class="ar-quem">${esc(g.nome)}</span>
      <span class="ar-seta">→</span>
      <span class="ar-alvo">${esc(g.alvo || '—')}</span>
      <span class="ar-t">${atrasado ? '⚠ ' : ''}${quando}</span>
    </button>`;
  };
  const vencidos = ordem.filter((g) => g.tick <= tick).length;
  return `<div class="fila-ar" id="gr-ar">
    <span class="ar-h">${vencidos ? `<b>${vencidos}</b> golpe${vencidos > 1 ? 's' : ''} para resolver`
      : 'Golpes no ar'}</span>
    <div class="ar-lista">${ordem.map(cartao).join('')}</div>
  </div>`;
}

/**
 * O que ainda está no ar em cena, lido das ações de todo mundo.
 *
 * Uma peça pode dever mais de um golpe (empunhadura dupla, rajada), e cada um
 * vira um cartão: são resoluções separadas, com alvos que podem ter mudado
 * entre um Tick e o outro.
 */
export function golpesEmCena(
  pecas: { id: string; nome: string; grupo?: string | null; avatar?: string; acao?: Acao | null }[],
  nomeDoAlvo: (id: string | null | undefined) => string | null,
): GolpeNoAr[] {
  const fora: GolpeNoAr[] = [];
  for (const c of pecas) {
    for (const t of golpesNoAr(c.acao)) {
      fora.push({
        id: c.id, nome: c.nome, grupo: c.grupo, avatar: c.avatar, tick: t,
        alvo: nomeDoAlvo(c.acao?.alvo), arma: c.acao?.arma || null,
      });
    }
  }
  return fora;
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

// -------------------------------------------------------- o fora de hora
/** Dá para mostrar o botão de agir fora de hora para esta pessoa agora? */
export const podeForaDeHora = (acao: Acao | null | undefined, tick: number, velocidade: number) =>
  foraDeHora(acao, tick, velocidade).pode;

/**
 * O diálogo de agir fora da sua vez.
 *
 * ELE EXISTE PORQUE A TELA JÁ DIZIA O NOME DELE SEM TER O BOTÃO: abrir o
 * `✋ Abortar` numa peça em Recuperação imprimia, palavra por palavra, "o que
 * cabe aqui é pagar: uma ação fora de hora, ou 1 Tick(s) por metro para se
 * deslocar", e nenhuma das duas saídas tinha caminho. A frase vinha do motor
 * (`combate-tempo.ts`), que sabia a conta e não tinha quem a chamasse.
 *
 * A CAIXA MOSTRA A DÍVIDA PARTIDA EM DUAS, e isso não é enfeite: o que sobrava
 * do ciclo é o que ele passa a DEVER, e a Velocidade da reação é o preço normal
 * da ação nova, que ele pagaria de todo jeito. Somar os dois num número só faria
 * a reação parecer o dobro do que custa, e é a diferença entre "vale a pena" e
 * "nunca vale".
 *
 * O ESPELHO ENTRA COMO ESCOLHA e não como automático: interromper alguém é uma
 * intenção, e o motor não tem como adivinhar contra quem o gesto vai. A lista
 * só traz quem está em Preparo, porque é a única fase interrompível, e a
 * ausência dela quando ninguém está montando é a regra se ensinando pela falta.
 */
export function abrirForaDeHora(
  quem: { nome: string; acao: Acao; tick: number; velocidade: number },
  interrompiveis: { id: string; nome: string; acao: Acao }[],
  aoConfirmar: (r: {
    novoTick: number; divida: number; resta: number; velocidade: number; total: number;
    alvo: string | null; atrasaOAlvo: number; frase: string;
  }) => void | Promise<void>,
) {
  const { nome, acao, tick } = quem;
  const base = foraDeHora(acao, tick, quem.velocidade);
  const { corpo, fechar } = uiPainel(`${nome} age fora da sua vez`, { classe: 'mesa-dlg tempo-dlg' });

  if (!base.pode) {
    corpo.innerHTML = `<p class="tempo-intro">${esc(base.porque)}</p>
      <div class="ui-dlg-btns"><button type="button" class="btn" id="fh-fechar">Fechar</button></div>`;
    (corpo.querySelector('#fh-fechar') as HTMLElement).onclick = () => fechar();
    return;
  }

  corpo.innerHTML = `
    <p class="tempo-intro">${esc(nome)} está na <b>Recuperação</b>: o golpe já saiu, e não há mais
      o que abortar. O que cabe aqui é <b>pagar</b> · a Velocidade da ação vai empurrada para o
      próprio futuro, <b>a guarda não se refaz</b>, e é <b>uma por ação</b>.</p>
    <label class="ab-m">Velocidade da reação
      <input type="number" id="fh-vel" min="0" step="1" value="${base.velocidade}" />
      <small>O que a ação nova custa. Vem da arma dele; mude se a reação for outra coisa.</small>
    </label>
    ${interrompiveis.length ? `<div class="rev-h">Interromper alguém?</div>
      <div class="rev-ops">
        <label class="rev-op"><input type="radio" name="fh-alvo" value="" checked />
          <span class="rev-op-corpo"><span class="rev-op-t">Ninguém</span>
          <span class="rev-op-d">Só age: paga a dívida e mais nada acontece do outro lado.</span></span></label>
        ${interrompiveis.map((o) => `<label class="rev-op">
          <input type="radio" name="fh-alvo" value="${esc(o.id)}" />
          <span class="rev-op-corpo"><span class="rev-op-t">${esc(o.nome)}</span>
          <span class="rev-op-d">Está montando o gesto. Interromper atrasa o gesto dele em tantos
            Ticks quantos ${esc(nome)} pagar.</span></span></label>`).join('')}
      </div>` : `<p class="muted">Ninguém está em Preparo agora, então não há quem interromper:
        só quem está montando o gesto pode ser interrompido.</p>`}
    <div class="acao-conta" id="fh-res"></div>
    <div class="ui-dlg-btns">
      <button type="button" class="btn" id="fh-cancelar">Cancelar</button>
      <button type="button" class="btn primary" id="fh-ok">Agir fora de hora</button>
    </div>`;

  const inp = corpo.querySelector('#fh-vel') as HTMLInputElement;
  const vel = () => Math.max(0, parseInt(inp.value || '0', 10) || 0);
  const alvoId = () => (corpo.querySelector('input[name="fh-alvo"]:checked') as HTMLInputElement)?.value || '';
  const alvoDe = (id: string) => interrompiveis.find((x) => x.id === id) || null;
  const conta = () => foraDeHora(acao, tick, vel(), { alvo: alvoDe(alvoId())?.acao ?? null });
  const pintar = () => {
    const r = conta();
    const alvo = alvoDe(alvoId());
    (corpo.querySelector('#fh-res') as HTMLElement).innerHTML =
      `<div><b>${r.resta}</b> Tick(s) do ciclo que ele deixa de cumprir · viram <b>dívida</b></div>`
      + `<div><b>${r.velocidade}</b> Tick(s) da ação nova · o preço de sempre dela</div>`
      + `<div>Fica livre no <b>Tick ${r.novoTick}</b> <span class="muted">(${tick} + ${r.total})</span>`
      + `, contra o Tick ${acao.livre} se esperasse.</div>`
      + (r.atrasaOAlvo && alvo
        ? `<div>E o gesto de <b>${esc(alvo.nome)}</b> anda <b>${r.atrasaOAlvo}</b> Tick(s) para a frente`
          + ` <span class="muted">(golpe no ${alvo.acao.golpes[0] ?? '—'} → ${
            alvo.acao.golpes.length ? alvo.acao.golpes[0] + r.atrasaOAlvo : '—'})</span>.</div>`
        : '');
  };
  inp.oninput = pintar;
  corpo.querySelectorAll('input[name="fh-alvo"]').forEach((r) => ((r as HTMLElement).onclick = pintar));
  pintar();

  (corpo.querySelector('#fh-cancelar') as HTMLElement).onclick = () => fechar();
  (corpo.querySelector('#fh-ok') as HTMLElement).onclick = async () => {
    const r = conta();
    const alvo = alvoDe(alvoId());
    fechar();
    await aoConfirmar({
      novoTick: r.novoTick, divida: r.divida, resta: r.resta, velocidade: r.velocidade,
      total: r.total, alvo: alvo?.id ?? null, atrasaOAlvo: r.atrasaOAlvo,
      frase: `${nome} agiu fora da vez${alvo && r.atrasaOAlvo ? `, interrompendo ${alvo.nome}` : ''}`
        + ` · pagou ${r.total} Tick(s)${r.divida ? ` (${r.divida} de dívida)` : ''}`
        + `${alvo && r.atrasaOAlvo ? ` · o gesto de ${alvo.nome} atrasou ${r.atrasaOAlvo} Tick(s)` : ''}`,
    });
  };
}

/** Uma linha para o botão da barra: o que esta mesa escolheu. */
export function resumoDoTempo(c: CombateMesa) {
  const s = SISTEMAS.find((x) => x.id === c.sistema)?.nome || c.sistema;
  // Os dados só entram no resumo quando NÃO são o padrão: a barra é estreita, e
  // "na mesa" é o que toda mesa faz até decidir o contrário.
  const dados = c.rolagem === 'site' ? ' · dados no site'
    : c.rolagem === 'misto' ? ' · criaturas rolam sozinhas' : '';
  // O golpe adiado entra no resumo SÓ quando está ligado, e pelo mesmo motivo
  // dos dados: a barra é estreita, e o desligado é o que toda mesa faz.
  const adiado = c.golpeAdiado && c.sistema === 'pgr' ? ' · golpe adiado' : '';
  return `${s} · ${c.marcacao === 'fita' ? 'fita' : 'números'}${dados}${adiado}`;
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
    <div class="rev-h">Os dados</div>
    <p class="tempo-nota">Quem rola. Também não muda regra nenhuma: muda quem digita o resultado.
      O que o site rolar continua num campo editável, e o mestre escreve por cima quando a mesa
      decidir outra coisa.</p>
    ${opsHTML('tp-rol', ROLAGENS, atual.rolagem)}
    <div class="rev-h">${esc(GOLPE_ADIADO.nome || 'Golpe adiado')} <span class="tempo-tag">em prova</span></div>
    <p class="tempo-nota">${esc(GOLPE_ADIADO.detalhe || '')}</p>
    <label class="rev-op tempo-chave" title="${esc(GOLPE_ADIADO.resumo || '')}">
      <input type="checkbox" id="tp-adiado"${atual.golpeAdiado ? ' checked' : ''} />
      <span class="rev-op-corpo">
        ${/* O TÍTULO É CURTO, e a frase vai na descrição. `.rev-op-t` é Cinzel em
             versalete, feito para duas ou três palavras: a frase inteira ali
             vira um bloco gritando, e foi o que aconteceu na primeira versão. */ ''}
        <span class="rev-op-t">Adiar o golpe</span>
        <span class="rev-op-d">${esc(GOLPE_ADIADO.resumo || '')}</span>
        <span class="rev-op-d tempo-chave-est" id="tp-adiado-d"></span>
      </span>
    </label>
    <div class="ui-dlg-btns">
      <button type="button" class="btn" id="tp-cancelar">Cancelar</button>
      <button type="button" class="btn primary" id="tp-salvar">Salvar</button>
    </div>`;
  pintar(atual.sistema);

  // A CHAVE SÓ TEM EFEITO NO P/G/R, e dizer isso depois de o mestre ligá-la e
  // não ver nada mudar seria tarde. A linha embaixo da chave muda com o rádio
  // do sistema, e é a única coisa deste painel que responde a duas escolhas.
  const chave = corpo.querySelector('#tp-adiado') as HTMLInputElement;
  const pintarChave = () => {
    const sis = (corpo.querySelector('input[name="tp-sis"]:checked') as HTMLInputElement)?.value;
    const d = corpo.querySelector('#tp-adiado-d') as HTMLElement;
    d.textContent = sis === 'pgr'
      ? (chave.checked
        ? 'Ligada: declarar agenda, e o golpe cai no Tick do Preparo.'
        : 'Desligada: declarar resolve na hora, como a mesa sempre fez.')
      : sis === 'simultaneo'
        ? 'No simultâneo a chave não se aplica: declarar SEMPRE agenda, porque decidir é no Tick de agora e valer é no seguinte.'
        : 'Sem efeito no sistema normal: lá o Preparo é zero e o golpe já cai na declaração.';
    d.classList.toggle('muted', sis !== 'pgr');
  };
  chave.addEventListener('change', pintarChave);
  pintarChave();

  corpo.querySelectorAll<HTMLInputElement>('input[name="tp-sis"]')
    .forEach((i) => i.addEventListener('change', () => { pintar(i.value as Sistema); pintarChave(); }));

  const marcado = (n: string) => (corpo.querySelector(`input[name="${n}"]:checked`) as HTMLInputElement)?.value;
  (corpo.querySelector('#tp-cancelar') as HTMLElement).onclick = () => fechar();
  (corpo.querySelector('#tp-salvar') as HTMLElement).onclick = async () => {
    const novo: CombateMesa = {
      sistema: (marcado('tp-sis') as Sistema) || COMBATE_PADRAO.sistema,
      marcacao: (marcado('tp-marc') as Marcacao) || COMBATE_PADRAO.marcacao,
      rolagem: (marcado('tp-rol') as Rolagem) || COMBATE_PADRAO.rolagem,
      golpeAdiado: chave.checked,
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
