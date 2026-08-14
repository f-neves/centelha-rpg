// A conjuração na mesa: o assistente que transforma uma Arte num efeito no
// tabuleiro, e os diálogos que ele precisa pelo caminho.
//
// A divisão com `artes-grid.ts` é a de sempre: lá moram as contas, aqui mora a
// tela. Este arquivo não sabe gravar no Supabase nem desenhar hexágono; ele
// pergunta, devolve um PLANO, e quem chamou executa.
import { uiPainel, uiEscolher, uiFormulario } from './ui-dialog';
import {
  ARTE, EFEITO, CONDICAO, artesDe, efeitosDisponiveis, parametrosAjustaveis,
  parametrosDoImproviso, custoDe, valorNoNivel, medidaNoNivel, escalaDe, turnosDeDuracao,
  alcanceEmMetros, areaEmM2, dadosDeDano, bonusPlano, rotuloDuracao,
  figuraDaArea, rotuloDaFigura, ANGULOS, LADO_MINIMO, CURVATURAS, velocidadePadraoDe,
  type Arte, type Efeito, type Parametro, type Escolhas, type Molde, type Custo,
} from './artes-grid';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

// ==================================================================== o plano
/** O que o assistente devolve. Quem chamou é que põe isso no tabuleiro. */
export interface Plano {
  arte: Arte;
  nivelArte: number;
  efeito: Efeito | null;        // null = improviso, a Arte crua
  escolhas: Escolhas;
  molde: Molde;
  /** A abertura do leque, em graus. Só vale quando o molde é leque. */
  angulo: number;
  /** O lado escolhido do retângulo, em metros. O outro sai da divisão da área. */
  lado: number;
  /** Quanto a barreira dobra, em graus. Zero é a parede reta. */
  curvaturaGraus: number;
  /** O que a conjuração custa de Velocidade, em ticks. Editável na caixa. */
  velocidadeTicks: number;
  custo: Custo;
  // já resolvido, para quem executa não precisar reabrir as réguas
  alcanceM: number;
  areaM2: number;
  raioM: number;
  comprimentoM: number;
  danoDados: number;
  danoBonus: number;
  turnos: number;
  larguraM: number;
  /** A figura já resolvida em metros: "círculo de 2,3 m de raio". */
  figura: string;
  alvos: number;
  nome: string;                 // "Aura de Fogo"
  resumo: string;               // a linha que vai para o registro
}

// ================================================== o assistente de conjuração
export interface CtxConjurar {
  nome: string;
  centelha: number;
  /** Ficha do PC (`S`) ou bloco da criatura. É de lá que saem Artes e Efeitos. */
  fonte: any;
  /** Personagem: só o que comprou. Criatura: null, e alcança o que a Arte comporta. */
  comprados: Record<string, boolean> | null;
}

/**
 * Abre o assistente e devolve o plano, ou null se a pessoa desistir.
 *
 * O painel inteiro se redesenha a cada escolha porque o que vem depois depende do
 * que veio antes: trocar de Arte troca a lista de Efeitos, e trocar de Efeito
 * troca a lista de parâmetros. Redesenhar é mais barato de manter do que
 * sincronizar seis pedaços à mão, e a caixa é pequena o bastante para isso não
 * piscar.
 */
export function abrirConjuracao(ctx: CtxConjurar): Promise<Plano | null> {
  const disponiveis = artesDe(ctx.fonte);
  if (!disponiveis.length) {
    return uiEscolher(`${ctx.nome} não tem Artes`, [], {
      msg: 'Nenhuma Arte neste bloco. Um personagem ganha Artes na ficha; uma criatura, no bestiário.',
    }).then(() => null);
  }

  let arteSel = disponiveis[0].arte;
  let nivelArte = disponiveis[0].nivel;
  let efeitoSel: Efeito | null = null;
  let escolhas: Escolhas = {};
  let molde: Molde = 'circulo';
  let angulo = 90;
  let lado = LADO_MINIMO;
  let curvatura = 0;
  let velocidade = velocidadePadraoDe(null);

  const { corpo, fechar } = uiPainel(`Conjurar · ${ctx.nome}`, { classe: 'ui-dlg-arte' });

  return new Promise<Plano | null>((resolve) => {
    let resolvido = false;
    const sair = (v: Plano | null) => { if (resolvido) return; resolvido = true; fechar(); resolve(v); };
    corpo.closest('dialog')?.addEventListener('close', () => sair(null), { once: true });

    /**
     * TODO PARÂMETRO COMEÇA EM ZERO.
     *
     * A caixa não compra nada por conta própria. Antes ela semeava Alcance,
     * Dano, Duração, Alvos, Área e Cura em 1 para já nascer "útil", e isso
     * custava Mana que ninguém pediu: quem quisesse um efeito só de Duração
     * pagava o dado de Dano junto, sem reparar, porque o número já estava lá
     * quando a caixa abriu.
     *
     * Zerado, o total começa em zero e cada ponto que aparece na conta é um
     * ponto que a pessoa escolheu. O aviso de que o efeito comum precisa de
     * Alcance 1 (toque) continua sendo regra do livro; a diferença é que agora
     * ele é uma decisão, e não um padrão silencioso.
     */
    function semear() {
      escolhas = {};
      const pars = efeitoSel ? parametrosAjustaveis(efeitoSel) : parametrosDoImproviso();
      for (const p of pars) escolhas[p.nome] = 0;
      // A Velocidade acompanha o Efeito, e não a caixa: trocar para um Efeito de
      // ação livre tem de zerar o tempo, e sair dele tem de devolver o padrão.
      // Quem editou o número à mão perde a edição na troca, que é o certo: o
      // número era daquele Efeito.
      velocidade = velocidadePadraoDe(efeitoSel);
    }
    semear();

    function planoAtual(): Plano {
      const pars = efeitoSel ? parametrosAjustaveis(efeitoSel) : parametrosDoImproviso();
      const acha = (n: string) => pars.find((p) => p.nome === n);
      const custo = custoDe(efeitoSel, arteSel, nivelArte, escolhas, ctx.centelha);
      const pAlc = acha('Alcance'), pArea = acha('Área') || acha('Volume');
      const pDano = acha('Dano'), pDur = acha('Duração'), pComp = acha('Comprimento');
      const nA = escolhas['Alcance'] ?? 0;
      const nAr = escolhas[pArea?.nome || ''] ?? 0;
      const nD = escolhas['Dano'] ?? 0;
      const nDu = escolhas['Duração'] ?? 0;
      // O raio só existe quando a régua do Efeito é de raio (a Aura). Fora disso
      // a área é de chão, e o molde é que decide o formato.
      const ehRaio = !!pArea && /de raio/i.test(pArea.unidade || '');
      const nome = efeitoSel
        ? `${efeitoSel.nome} de ${arteSel.nome}`
        : `${arteSel.nome} ${nD ? `${dadosDeDano({ nome: 'Dano', tipo: 'padrao' }, nD, arteSel)}d6` : 'bruto'}`;
      const turnos = pDur && nDu ? turnosDeDuracao(nDu, pDur.regua || 'breve') : 0;
      const danoDados = pDano && nD ? dadosDeDano(pDano, nD, arteSel) : 0;
      const danoBonus = pDano && nD ? bonusPlano(pDano, nD) : 0;
      const partes: string[] = [];
      if (pAlc && nA) partes.push(`Alcance ${valorNoNivel(pAlc, nA)}`);
      if (pArea && nAr) partes.push(`${pArea.nome} ${valorNoNivel(pArea, nAr)}`);
      if (danoDados) partes.push(`${danoDados}d6`);
      else if (danoBonus) partes.push(`+${danoBonus} de dano`);
      if (turnos) partes.push(rotuloDuracao(turnos));
      const areaM2 = pArea && nAr && !ehRaio ? areaEmM2(pArea, nAr) : 0;
      const raioProprio = pArea && nAr && ehRaio ? medidaNoNivel(pArea, nAr) : 0;
      // O Muro não compra área nenhuma: compra metros de parede. Sem ler essa
      // régua aqui, a figura nasceria vazia e a parede de chamas sairia do
      // tabuleiro com comprimento zero, cobrando Mana e não desenhando nada.
      const compProprio = pComp && escolhas['Comprimento']
        ? medidaNoNivel(pComp, escolhas['Comprimento'])
        : 0;
      // A área comprada é o ORÇAMENTO; o molde decide a figura. O raio e o
      // comprimento saem dela, para nenhum molde render mais chão que o outro.
      // A âncora e a direção só se sabem no tabuleiro; aqui a figura serve para
      // dizer o TAMANHO antes de conjurar, e por isso nasce na origem.
      const fig = (areaM2 || raioProprio || compProprio)
        ? figuraDaArea({
            molde: compProprio ? 'linha' : molde,
            areaM2, ancora: { x: 0, y: 0, hex: { q: 0, r: 0 }, tipo: 'centro' },
            aberturaGraus: angulo, ladoM: lado, curvaturaGraus: curvatura,
            raioProprioM: raioProprio, comprimentoProprioM: compProprio,
          })
        : null;
      const figura = fig ? rotuloDaFigura(fig) : '';
      if (figura) partes.push(figura);
      return {
        arte: arteSel, nivelArte, efeito: efeitoSel, escolhas: { ...escolhas },
        molde, angulo, lado, curvaturaGraus: curvatura, velocidadeTicks: velocidade, custo,
        alcanceM: pAlc && nA ? alcanceEmMetros(pAlc, nA) : 0,
        areaM2,
        raioM: fig?.raioM || 0,
        comprimentoM: compProprio || fig?.comprimentoM || 0,
        larguraM: fig?.larguraM || 0,
        danoDados, danoBonus, turnos, figura,
        alvos: escolhas['Alvos'] ?? 1,
        nome,
        resumo: `${nome}${partes.length ? ` · ${partes.join(' · ')}` : ''} · ${custo.mana} de Mana`,
      };
    }

    function pintar() {
      const plano = planoAtual();
      const g = efeitoSel?.grid;
      const pars = efeitoSel ? parametrosAjustaveis(efeitoSel) : parametrosDoImproviso();
      const fixos = (efeitoSel?.parametros || []).filter((p) => p.tipo === 'fixo');
      const temArea = pars.some((p) => p.nome === 'Área' || p.nome === 'Volume');
      const podeModar = temArea && (g?.forma === 'zona' || !efeitoSel);
      // A barreira não escolhe molde (ela é sempre uma faixa), mas escolhe se
      // ergue essa faixa reta ou dobrada. Vale para QUALQUER barreira: o livro
      // diz "a curvatura máxima de qualquer barreira é um semicírculo", e não
      // "do Muro", então o Escudo de Força dobra também.
      const podeCurvar = g?.forma === 'muro';

      const chipArte = disponiveis.map(({ arte, nivel }) => `
        <button type="button" class="ag-chip${arte.id === arteSel.id ? ' on' : ''}"
          data-arte="${arte.id}" style="--ag-cor:${arte.grid.cor}">
          <span class="ag-chip-nm">${esc(arte.nome)}</span><span class="ag-chip-nv">${nivel}</span>
        </button>`).join('');

      const lista = efeitosDisponiveis(arteSel.id, nivelArte, ctx.comprados);
      const sabor = (e: Efeito) => e.artes.find((a) => a.id === arteSel.id)?.sabor || '';
      const opcao = (e: Efeito | null) => {
        const on = (efeitoSel?.id ?? null) === (e?.id ?? null);
        const gg = e?.grid;
        const marca = gg ? [
          gg.forma !== 'nenhuma' && gg.forma !== 'alvo' ? gg.forma : '',
          gg.persiste ? 'dura' : '',
          gg.fere ? 'fere' : '',
          // Vale a tarja porque muda o turno inteiro: este não gasta a vez.
          e?.acaoLivre ? 'ação livre' : '',
          gg.condicao && CONDICAO[gg.condicao] ? CONDICAO[gg.condicao].nome.toLowerCase() : '',
        ].filter(Boolean).join(' · ') : 'a Arte crua, sem Efeito comprado';
        const texto = e ? e.efeito : 'Dano e área montados só com os parâmetros do livro.';
        // O cartão corta a descrição em seis linhas para os vizinhos ficarem
        // comparáveis (ver `.ag-ef-tx` no global.css). O texto inteiro fica
        // aqui: apontar o mouse no cartão devolve o que o corte tirou.
        return `<button type="button" class="ag-ef${on ? ' on' : ''}" data-ef="${e ? e.id : ''}"
          title="${esc(texto)}">
          <span class="ag-ef-top"><b>${esc(e ? e.nome : 'Improviso')}</b>
            ${e ? `<span class="ag-ef-nv" title="exige a Arte no nível ${e.nivel}">${e.nivel}</span>` : ''}</span>
          <span class="ag-ef-tx">${esc(texto)}</span>
          ${e && sabor(e) ? `<span class="ag-ef-sab">${esc(arteSel.nome)}: ${esc(sabor(e))}</span>` : ''}
          <span class="ag-ef-mc">${esc(marca)}</span>
        </button>`;
      };

      const linhaPar = (p: Parametro) => {
        const n = escolhas[p.nome] ?? 0;
        const esc2 = escalaDe(p);
        const max = esc2 ? esc2.length : 6;
        const acima = Math.max(0, n - nivelArte);
        // A tradução em turnos só aparece quando ela ACRESCENTA: nos degraus em
        // que a régua já diz "5 turnos", repetir seria ruído.
        const emTurnos = p.nome === 'Duração' && n
          ? rotuloDuracao(turnosDeDuracao(n, p.regua || 'breve')) : '';
        const extra = emTurnos && emTurnos !== valorNoNivel(p, n)
          ? ` <span class="ag-p-eq">= ${emTurnos}</span>` : '';
        return `<div class="ag-p${acima ? ' esticado' : ''}">
          <span class="ag-p-nm">${esc(p.nome)}</span>
          <span class="ag-p-ctr">
            <button type="button" class="ag-p-b" data-par="${esc(p.nome)}" data-d="-1"
              ${n <= 0 ? 'disabled' : ''} aria-label="menos">−</button>
            <span class="ag-p-n">${n}</span>
            <button type="button" class="ag-p-b" data-par="${esc(p.nome)}" data-d="1"
              ${n >= max ? 'disabled' : ''} aria-label="mais">+</button>
          </span>
          <span class="ag-p-v">${n ? esc(valorNoNivel(p, n)) : '<i>não usa</i>'}${extra}</span>
          ${acima ? `<span class="ag-p-est" title="acima do nível da Arte: custa ${acima + 1}× por nível">
            ↑${acima}</span>` : ''}
        </div>`;
      };

      const c = plano.custo;
      // O QUE ESTAVA COM O FOCO, para devolvê-lo depois do repinte.
      //
      // `pintar()` refaz o corpo inteiro a cada clique, e o elemento clicado
      // morre no meio do próprio clique: o foco cai no <body>, o teclado para de
      // navegar e o navegador rola a página atrás dele. Guardar a identidade do
      // que estava focado (e não a referência, que não sobrevive) e reencontrar
      // o equivalente depois resolve, e custa duas linhas.
      const focado = (() => {
        const a = document.activeElement as HTMLElement | null;
        if (!a || !corpo.contains(a)) return '';
        for (const k of ['data-arte', 'data-ef', 'data-par', 'data-molde', 'data-ang', 'data-curva']) {
          if (a.hasAttribute(k)) {
            const d = a.getAttribute('data-d');
            return `[${k}="${CSS.escape(a.getAttribute(k) || '')}"]${d ? `[data-d="${d}"]` : ''}`;
          }
        }
        return a.id ? `#${a.id}` : '';
      })();

      corpo.innerHTML = `
        <div class="ag-grade">
          <div class="ag-col-ef">
            <h3 class="ag-h">Efeito</h3>
            <div class="ag-efs">${opcao(null)}${lista.map(opcao).join('')}</div>
            ${!lista.length ? `<p class="ag-vazio">Nenhum Efeito Especial de ${esc(arteSel.nome)} ao alcance.
              ${ctx.comprados ? 'Compre um na ficha, ou use o improviso.' : ''}</p>` : ''}
          </div>

          <div class="ag-col-dir">
            <div class="ag-rolagem">
              <div class="ag-sec"><h3 class="ag-h">Arte</h3><div class="ag-chips">${chipArte}</div></div>
              <div class="ag-sec"><h3 class="ag-h">Parâmetros</h3>
                <div class="ag-pars">${pars.map(linhaPar).join('')}</div>
                ${fixos.length ? `<div class="ag-fixos">${fixos.map((p) =>
                  `<span><b>${esc(p.nome)}:</b> ${esc(p.valor)}</span>`).join('')}</div>` : ''}
              </div>
              ${podeModar ? `<div class="ag-sec"><h3 class="ag-h">Molde</h3>
                <div class="ag-moldes">${(['circulo', 'linha', 'retangulo', 'leque'] as Molde[]).map((m) => `
                  <button type="button" class="ag-md${molde === m ? ' on' : ''}" data-molde="${m}">
                    <span class="ag-md-ic" aria-hidden="true">${
                      { circulo: '●', linha: '━', retangulo: '▬', leque: '◣' }[m]}</span>
                    ${{ circulo: 'Círculo', linha: 'Linha', retangulo: 'Retângulo', leque: 'Leque' }[m]}</button>`).join('')}</div>
                ${molde === 'leque' ? `<div class="ag-angs">
                  <span class="ag-ang-l">Abertura</span>
                  ${ANGULOS.map((a) => `<button type="button" class="ag-ang${angulo === a ? ' on' : ''}"
                    data-ang="${a}">${a}°</button>`).join('')}
                </div>` : ''}
                ${molde === 'retangulo' ? `<div class="ag-angs">
                  <span class="ag-ang-l">Um lado</span>
                  <input type="number" id="ag-lado" min="${LADO_MINIMO}" step="0.5" value="${lado}" /> m
                  <span class="ag-ang-n">o outro sai da área</span>
                </div>` : ''}
                <p class="ag-figura">${esc(plano.figura || 'sem área')}</p>
              </div>` : ''}
              ${podeCurvar ? `<div class="ag-sec"><h3 class="ag-h">Curvatura</h3>
                <div class="ag-angs">
                  ${CURVATURAS.map((a) => `<button type="button" class="ag-ang${curvatura === a ? ' on' : ''}"
                    data-curva="${a}">${a ? `${a}°` : 'Reta'}</button>`).join('')}
                </div>
                <p class="ag-figura">${esc(plano.figura || 'sem comprimento')}</p>
              </div>` : ''}
            </div>

            <div class="ag-pe">
              <div class="ag-custo">
                <div class="ag-cst-l">
                  <span>${efeitoSel ? `Efeito ${c.base}` : 'improviso'} + parâmetros ${c.parametros}
                    = <b>${c.total}</b> pontos</span>
                  <span>− Centelha ${c.centelha} = <b class="${c.mana ? '' : 'gratis'}">${c.mana}</b> de Mana</span>
                  <span class="ag-vel">Velocidade
                    <input type="number" id="ag-vel" min="0" max="60" step="1" value="${velocidade}" />
                    ${velocidade ? 'ticks' : '<b class="gratis">livre</b>'}</span>
                </div>
                ${c.esticados.length ? `<div class="ag-cst-est">esticado:
                  ${c.esticados.map((e) => `${esc(e.nome)} ${e.acima} acima (${e.custo})`).join(' · ')}</div>` : ''}
              </div>
              <div class="ag-acoes">
                <button type="button" class="btn" id="ag-cancelar">Cancelar</button>
                <button type="button" class="btn primary" id="ag-ok">Conjurar</button>
              </div>
            </div>
          </div>
        </div>`;

      if (focado) corpo.querySelector<HTMLElement>(focado)?.focus();

      corpo.querySelectorAll<HTMLElement>('[data-arte]').forEach((b) => b.onclick = () => {
        const d = disponiveis.find((x) => x.arte.id === b.dataset.arte)!;
        arteSel = d.arte; nivelArte = d.nivel;
        // O Efeito escolhido pode não caber na Arte nova: some em vez de mentir.
        if (efeitoSel && !efeitosDisponiveis(arteSel.id, nivelArte, ctx.comprados).some((e) => e.id === efeitoSel!.id)) {
          efeitoSel = null;
        }
        semear(); pintar();
      });
      corpo.querySelectorAll<HTMLElement>('[data-ef]').forEach((b) => b.onclick = () => {
        efeitoSel = b.dataset.ef ? EFEITO[b.dataset.ef] : null;
        semear(); pintar();
      });
      corpo.querySelectorAll<HTMLElement>('[data-par]').forEach((b) => b.onclick = () => {
        const nome = b.dataset.par!;
        const p = pars.find((x) => x.nome === nome)!;
        const e2 = escalaDe(p);
        const max = e2 ? e2.length : 6;
        escolhas[nome] = Math.max(0, Math.min(max, (escolhas[nome] ?? 0) + Number(b.dataset.d)));
        pintar();
      });
      corpo.querySelectorAll<HTMLElement>('[data-molde]').forEach((b) => b.onclick = () => {
        molde = b.dataset.molde as Molde; pintar();
      });
      corpo.querySelectorAll<HTMLElement>('[data-ang]').forEach((b) => b.onclick = () => {
        angulo = Number(b.dataset.ang); pintar();
      });
      corpo.querySelectorAll<HTMLElement>('[data-curva]').forEach((b) => b.onclick = () => {
        curvatura = Number(b.dataset.curva); pintar();
      });
      const inpVel = corpo.querySelector('#ag-vel') as HTMLInputElement | null;
      if (inpVel) {
        // Sem repintar: o número já está na tela, e refazer o corpo no meio da
        // digitação roubaria o cursor a cada tecla.
        inpVel.oninput = () => {
          const n = Math.round(Number(inpVel.value));
          velocidade = Number.isFinite(n) && inpVel.value.trim()
            ? Math.max(0, Math.min(60, n))
            : velocidadePadraoDe(efeitoSel);
        };
        inpVel.onblur = () => { inpVel.value = String(velocidade); };
      }
      const inpLado = corpo.querySelector('#ag-lado') as HTMLInputElement | null;
      if (inpLado) {
        inpLado.oninput = () => {
          lado = Math.max(LADO_MINIMO, parseFloat(inpLado.value) || LADO_MINIMO);
          // Redesenhar aqui roubaria o foco no meio da digitação: só o rótulo
          // da figura precisa acompanhar, e ele é uma linha.
          const alvo = corpo.querySelector('.ag-figura');
          if (alvo) alvo.textContent = planoAtual().figura;
        };
      }
      (corpo.querySelector('#ag-cancelar') as HTMLElement).onclick = () => sair(null);
      (corpo.querySelector('#ag-ok') as HTMLElement).onclick = () => sair(planoAtual());

      // A lista de Efeitos rola, e o painel se redesenha inteiro a cada escolha:
      // sem isto o cartão que a pessoa acabou de marcar reaparece fora da vista,
      // e a caixa parece ter esquecido o clique.
      corpo.querySelector('.ag-ef.on')?.scrollIntoView({ block: 'nearest' });
    }
    pintar();
  });
}

// ============================================================ o item do alvo
export interface ItemDoAlvo { id: string; nome: string; onde: string; metal: boolean }

/**
 * As peças que o alvo veste e empunha, para os Efeitos que pegam um objeto
 * (Metal Incandescente, Enferrujar, Podridão, Esconder a Carga, Arma Elemental).
 *
 * Sai da ficha quando o alvo é personagem. A criatura não tem lista de
 * equipamento no bestiário, e por isso a caixa sempre aceita nome digitado: é a
 * diferença entre não saber e impedir.
 */
export function itensDoAlvo(ficha: any): ItemDoAlvo[] {
  const out: ItemDoAlvo[] = [];
  const ehMetal = (nome: string) =>
    /malha|placa|escama|aço|aco|ferro|metal|lâmina|lamina|espada|machado|lança|lanca|maça|maca|elmo|broquel/i.test(nome);
  const push = (nome: string, onde: string) => {
    if (!nome) return;
    out.push({ id: `${onde}:${nome}`, nome, onde, metal: ehMetal(nome) });
  };
  try {
    const cj = Array.isArray(ficha?.conjuntos) && ficha.conjuntos.length
      ? (ficha.conjuntos.find((c: any) => c.ativo) || ficha.conjuntos[0]) : null;
    if (cj) {
      if (cj.habil?.nome || cj.habil?.ref) push(cj.habil.nome || cj.habil.ref, 'mão hábil');
      if (cj.inabil?.nome || cj.inabil?.ref) push(cj.inabil.nome || cj.inabil.ref, 'mão inábil');
    }
    for (const a of ficha?.armaduras || []) push(a?.nome || a?.ref, 'armadura');
    if (ficha?.equip?.arma) push(ficha.equip.arma, 'arma');
    if (ficha?.equip?.escudo && ficha.equip.escudo !== 'nenhum') push(ficha.equip.escudo, 'escudo');
  } catch { /* ficha em formato antigo: cai no campo livre */ }
  return out;
}

/** Pergunta qual peça o efeito pegou. Devolve o nome, ou null se desistir. */
export async function escolherItem(alvoNome: string, itens: ItemDoAlvo[], titulo: string): Promise<string | null> {
  if (!itens.length) {
    return uiFormulario(titulo, [{
      nome: 'item', rotulo: `Que peça de ${alvoNome}?`, obrigatorio: true,
      placeholder: 'cota de malha, espada longa, elmo…',
      dica: 'Este alvo não tem equipamento declarado, então a peça vem digitada.',
    }], { ok: 'Marcar' }).then((v) => (v ? v.item.trim() : null));
  }
  const escolha = await uiEscolher(titulo, [
    ...itens.map((i) => ({
      valor: i.nome, rotulo: i.nome,
      nota: i.onde + (i.metal ? ' · metal' : ''),
      grupo: 'O que ele carrega',
    })),
    { valor: '__outro', rotulo: 'Outra peça…', nota: 'digitar o nome', grupo: 'O que ele carrega' },
  ], { msg: `Em ${alvoNome}.` });
  if (!escolha) return null;
  if (escolha !== '__outro') return escolha;
  const v = await uiFormulario(titulo, [
    { nome: 'item', rotulo: 'Qual peça', obrigatorio: true, placeholder: 'cota de malha…' },
  ], { ok: 'Marcar' });
  return v ? v.item.trim() : null;
}

// ======================================================== empurrar e arrastar
export interface Empurrado {
  cid: string; nome: string; peso: number;
  metros: number;        // o que a regra calculou
  ajustado: number;      // o que o mestre deixou, depois de olhar o cenário
  dano: number;          // o dano de colisão, decidido no fim
}

/**
 * A caixa dos deslocamentos: mostra para onde cada um vai antes de mover nada.
 *
 * A ordem é a que a mesa pediu: primeiro o cálculo, depois o ajuste (porque o
 * tabuleiro não sabe onde estão as paredes da ficção), e só então o dano. Quem
 * bate na parede aos 2 m não devia sofrer o dano dos 6 m que a conta previa.
 */
export function abrirEmpurroes(titulo: string, lista: Empurrado[]): Promise<Empurrado[] | null> {
  const { corpo, fechar } = uiPainel(titulo, { classe: 'ui-dlg-arte' });
  return new Promise((resolve) => {
    let resolvido = false;
    const sair = (v: Empurrado[] | null) => { if (resolvido) return; resolvido = true; fechar(); resolve(v); };
    corpo.closest('dialog')?.addEventListener('close', () => sair(null), { once: true });
    const dados = lista.map((x) => ({ ...x }));

    corpo.innerHTML = `
      <p class="ag-nota">A distância sai do peso de cada um. Ajuste onde a parede, a mesa ou o
        desnível param o corpo antes; o dano de colisão vem depois, já pelo que sobrou.</p>
      <div class="ag-emp">${dados.map((d, i) => `
        <div class="ag-emp-l">
          <span class="ag-emp-nm">${esc(d.nome)}<small>${d.peso ? `${d.peso} kg` : 'peso não declarado'}</small></span>
          <span class="ag-emp-calc" title="o que a regra calculou">${d.metros} m</span>
          <span class="ag-emp-ctr"><label>anda
            <input type="number" min="0" step="1" value="${d.ajustado}" data-m="${i}" /> m</label></span>
          <span class="ag-emp-ctr"><label>dano
            <input type="number" min="0" step="1" value="${d.dano}" data-d="${i}" /></label></span>
        </div>`).join('')}</div>
      <div class="ag-acoes">
        <button type="button" class="btn" id="ag-emp-x">Cancelar</button>
        <button type="button" class="btn primary" id="ag-emp-ok">Mover</button>
      </div>`;

    corpo.querySelectorAll<HTMLInputElement>('[data-m]').forEach((i) => i.oninput = () => {
      dados[+i.dataset.m!].ajustado = Math.max(0, parseInt(i.value, 10) || 0);
    });
    corpo.querySelectorAll<HTMLInputElement>('[data-d]').forEach((i) => i.oninput = () => {
      dados[+i.dataset.d!].dano = Math.max(0, parseInt(i.value, 10) || 0);
    });
    (corpo.querySelector('#ag-emp-x') as HTMLElement).onclick = () => sair(null);
    (corpo.querySelector('#ag-emp-ok') as HTMLElement).onclick = () => sair(dados);
  });
}

// ============================================================= o NPC completo
/** Tudo o que um combatente avulso pode declarar. Espelha `combatentes` + `dados`. */
export interface DadosNPC {
  nome: string;
  grupo: 'aliado' | 'inimigo' | 'neutro';
  oculto: boolean;
  monstro_id: string | null;   // só pelo retrato: o bloco continua sendo este
  pv: number;
  energia: number;
  tick: number;
  velocidade: number | null;
  defesa: number | null;
  defesaSocial: number | null;
  defesaMental: number | null;
  soak: { impacto: number; corte: number; perfuracao: number };
  resistPerf: number;
  arma: string;
  ataque: string;
  dano: string;
  notas: string;
  /** Turnos até sumir sozinho. 0 = fica até alguém tirar. */
  turnos: number;
}

export const npcVazio = (): DadosNPC => ({
  nome: '', grupo: 'neutro', oculto: false, monstro_id: null,
  pv: 10, energia: 0, tick: 0, velocidade: null,
  defesa: null, defesaSocial: null, defesaMental: null,
  soak: { impacto: 0, corte: 0, perfuracao: 0 }, resistPerf: 0,
  arma: '', ataque: '', dano: '', notas: '', turnos: 0,
});

/**
 * O NPC de cena, em dois níveis.
 *
 * O básico é o que sempre foi: nome e Vida, porque o taberneiro que entrou na
 * briga não merece uma ficha. O avançado abre o resto, e existe por causa das
 * invocações: um Servo de Ossos precisa de Defesa e Absorção para o rastreador
 * ter o que somar, e digitar isso tudo à mão a cada conjuração seria pior do que
 * não invocar. Por isso o Efeito chega com o formulário JÁ PREENCHIDO, e o
 * mestre só confere.
 */
export function abrirNPC(
  titulo: string,
  inicial: Partial<DadosNPC> = {},
  opts: { avancado?: boolean; ok?: string; msg?: string } = {},
): Promise<DadosNPC | null> {
  const d: DadosNPC = {
    ...npcVazio(), ...inicial,
    soak: { ...npcVazio().soak, ...(inicial.soak || {}) },
  };
  let aberto = !!opts.avancado;
  const { corpo, fechar } = uiPainel(titulo, { classe: 'ui-dlg-arte ui-dlg-npc' });

  return new Promise((resolve) => {
    let resolvido = false;
    const sair = (v: DadosNPC | null) => { if (resolvido) return; resolvido = true; fechar(); resolve(v); };
    corpo.closest('dialog')?.addEventListener('close', () => sair(null), { once: true });

    const num = (k: string, rot: string, v: number | null, min = 0) =>
      `<label class="ag-f"><span>${rot}</span>
        <input type="number" data-k="${k}" value="${v ?? ''}" min="${min}" step="1" placeholder="—" /></label>`;
    const txt = (k: string, rot: string, v: string, ph = '') =>
      `<label class="ag-f"><span>${rot}</span>
        <input type="text" data-k="${k}" value="${esc(v)}" placeholder="${esc(ph)}" /></label>`;

    function pintar() {
      corpo.innerHTML = `
        ${opts.msg ? `<p class="ag-nota">${esc(opts.msg)}</p>` : ''}
        <div class="ag-npc-base">
          ${txt('nome', 'Nome', d.nome, 'Servo de Ossos, Taberneiro, Guarda 3…')}
          ${num('pv', 'Vida', d.pv, 1)}
          <label class="ag-f"><span>Lado</span>
            <select data-k="grupo">
              ${(['aliado', 'neutro', 'inimigo'] as const).map((g) =>
                `<option value="${g}"${d.grupo === g ? ' selected' : ''}>${
                  g === 'aliado' ? 'Aliado' : g === 'neutro' ? 'Neutro' : 'Inimigo'}</option>`).join('')}
            </select></label>
          <label class="ag-f ag-f-chk"><input type="checkbox" data-k="oculto"${d.oculto ? ' checked' : ''} />
            <span>Oculto dos jogadores</span></label>
        </div>
        <div class="ag-retrato">
          <span class="ag-ret-lbl">Retrato</span>
          <button type="button" class="btn mini" id="ag-ret">${d.monstro_id ? 'Trocar' : 'Escolher do bestiário'}</button>
          ${d.monstro_id ? `<span class="ag-ret-nm">${esc(d.monstro_id)}</span>
            <button type="button" class="btn-fant" id="ag-ret-x" title="Tirar o retrato">✕</button>` : ''}
        </div>
        <button type="button" class="ag-mais" id="ag-mais" aria-expanded="${aberto}">
          ${aberto ? '▾' : '▸'} Ficha avançada
          <small>defesas, absorção, ataque e iniciativa</small></button>
        <div class="ag-npc-av"${aberto ? '' : ' hidden'}>
          <h3 class="ag-h">Iniciativa</h3>
          <div class="ag-grid3">${num('tick', 'Tick inicial', d.tick)}${num('velocidade', 'Velocidade', d.velocidade)}${num('energia', 'Energia', d.energia)}</div>
          <h3 class="ag-h">Defesas</h3>
          <div class="ag-grid3">${num('defesa', 'Física', d.defesa)}${num('defesaSocial', 'Social', d.defesaSocial)}${num('defesaMental', 'Mental', d.defesaMental)}</div>
          <h3 class="ag-h">Absorção</h3>
          <div class="ag-grid4">${num('soak.impacto', 'Impacto', d.soak.impacto)}${num('soak.corte', 'Corte', d.soak.corte)}${num('soak.perfuracao', 'Perfuração', d.soak.perfuracao)}${num('resistPerf', 'Resist. Perf.', d.resistPerf)}</div>
          <h3 class="ag-h">Ataque</h3>
          <div class="ag-grid3">${txt('arma', 'Arma', d.arma, 'garras, espada curta…')}${txt('ataque', 'Jogada de acerto', d.ataque, '4d6+2')}${txt('dano', 'Dano', d.dano, '3d6 +2 (C)')}</div>
          <h3 class="ag-h">Fim</h3>
          <div class="ag-grid3">${num('turnos', 'Some em (turnos)', d.turnos)}</div>
          <label class="ag-f ag-f-full"><span>Notas</span>
            <textarea data-k="notas" rows="2" placeholder="o que ele faz, o que não faz">${esc(d.notas)}</textarea></label>
        </div>
        <div class="ag-acoes">
          <button type="button" class="btn" id="ag-npc-x">Cancelar</button>
          <button type="button" class="btn primary" id="ag-npc-ok">${esc(opts.ok || 'Pôr em campo')}</button>
        </div>`;

      corpo.querySelectorAll<HTMLElement>('[data-k]').forEach((i) => {
        const k = (i as HTMLInputElement).dataset.k!;
        const guarda = () => {
          const el = i as HTMLInputElement;
          const v: any = el.type === 'checkbox' ? el.checked
            : el.type === 'number' ? (el.value === '' ? null : parseInt(el.value, 10) || 0)
            : el.value;
          if (k.startsWith('soak.')) (d.soak as any)[k.slice(5)] = v ?? 0;
          else (d as any)[k] = v;
        };
        i.addEventListener('input', guarda);
        i.addEventListener('change', guarda);
      });
      (corpo.querySelector('#ag-mais') as HTMLElement).onclick = () => { aberto = !aberto; pintar(); };
      (corpo.querySelector('#ag-ret') as HTMLElement).onclick = async () => {
        const id = await escolherRetrato();
        if (id) { d.monstro_id = id; pintar(); }
      };
      const x = corpo.querySelector('#ag-ret-x') as HTMLElement | null;
      if (x) x.onclick = () => { d.monstro_id = null; pintar(); };
      (corpo.querySelector('#ag-npc-x') as HTMLElement).onclick = () => sair(null);
      (corpo.querySelector('#ag-npc-ok') as HTMLElement).onclick = () => {
        d.nome = (d.nome || '').trim() || 'NPC';
        sair(d);
      };
    }
    pintar();
  });
}

/** O catálogo de retratos: as criaturas do bestiário que têm arte. */
async function escolherRetrato(): Promise<string | null> {
  const { MON_LIST } = await import('./mesa-bestiario');
  const { u } = await import('./mesa-core');
  const com = (MON_LIST as any[]).filter((m) => m.imagem);
  return uiEscolher('Retrato do bestiário', com.map((m) => ({
    valor: m.id,
    rotulo: m.nome,
    busca: m.busca,
    grupo: m.categoria || 'Sem categoria',
    html: `<span class="ag-ret-op"><img src="${esc(u(m.imagem))}" alt="" loading="lazy" />
      <span><b>${esc(m.nome)}</b><small>${esc(m.categoria || '')}${m.porte ? ` · ${esc(m.porte)}` : ''}</small></span></span>`,
  })), {
    filtro: 'Procurar criatura…',
    msg: 'Só o retrato: o bloco de combate continua sendo o que você digitou.',
  });
}
