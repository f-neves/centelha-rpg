// A conjuração na mesa: o assistente que transforma uma Arte num efeito no
// tabuleiro, e os diálogos que ele precisa pelo caminho.
//
// A divisão com `artes-grid.ts` é a de sempre: lá moram as contas, aqui mora a
// tela. Este arquivo não sabe gravar no Supabase nem desenhar hexágono; ele
// pergunta, devolve um PLANO, e quem chamou executa.
import { uiPainel, uiEscolher, uiFormulario } from './ui-dialog';
import {
  ARTE, EFEITO, CONDICAO, artesDe, efeitosDisponiveis, parametrosAjustaveis,
  parametrosDoImproviso, custoDe, valorNoNivel, medidaNoNivel, escalaDe, escalaVisivel, turnosDeDuracao,
  alcanceEmMetros, areaEmM2, dadosDeDano, bonusPlano, rotuloDuracao,
  figuraDoEfeito, rotuloDaFigura, CURVATURAS, velocidadePadraoDe,
  caminhoDaFigura, arcoDaParede, type Figura,
  MOLDE, MOLDES_DE_CHAO, moldeDaForma, formaEscolheMolde,
  ABERTURAS, ABERTURA_PADRAO, volumeDaManifestacao, ABRIR_COBRA, ABRIR_COBRA_PADRAO,
  fatiasMaximas, ALTURA_MINIMA_BASE,
  type Arte, type Efeito, type Parametro, type Escolhas, type Custo, type ModoAbrir,
} from './artes-grid';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
/** Número curto, com vírgula: "6" e não "6,0", "2,5" e não "2.5". */
const um = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));

/**
 * O que o Efeito faz no tabuleiro, em três ou quatro palavras.
 *
 * "zona · dura · terreno difícil". É a linha que se compara entre Efeitos, e a
 * única do cartão que continua valendo depois de escolher: por isso ela aparece
 * nos dois lugares, no balão de quem procura e na coluna de quem já escolheu.
 */
const marcasDe = (e: Efeito | null) => {
  const g = e?.grid;
  if (!g) return 'a Arte crua, sem Efeito comprado';
  return [
    g.forma !== 'nenhuma' && g.forma !== 'alvo' ? g.forma : '',
    g.persiste ? 'dura' : '',
    g.fere ? 'fere' : '',
    // Vale a tarja porque muda o turno inteiro: este não gasta a vez.
    e?.acaoLivre ? 'ação livre' : '',
    g.condicao && CONDICAO[g.condicao] ? CONDICAO[g.condicao].nome.toLowerCase() : '',
  ].filter(Boolean).join(' · ');
};

/** Sem acento e em minúscula, para o filtro casar "ilusao" com "Ilusão". */
const semAcento = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * O QUE O EFEITO FAZ NO CHÃO, EM UM GLIFO.
 *
 * Numa lista de catorze nomes, a forma é o que separa um do outro antes da
 * leitura: quem procura uma zona não quer ler catorze descrições para descobrir
 * quais delas pintam chão. O glifo cabe numa coluna de um caractere e diz isso
 * de relance, que é o que a lista devia fazer.
 */
const GLIFO: Record<string, [string, string]> = {
  zona: ['●', 'pinta uma zona no chão'],
  aura: ['◎', 'aura em volta de alguém'],
  cone: ['◣', 'leque a partir do conjurador'],
  linha: ['━', 'faixa reta'],
  muro: ['▬', 'barreira erguida'],
  alvo: ['✦', 'num alvo'],
  movimento: ['⇢', 'mexe com quem está no tabuleiro'],
  token: ['◈', 'põe uma peça em campo'],
  cadeia: ['⋯', 'salta de alvo em alvo'],
  nenhuma: ['·', 'não marca o tabuleiro'],
};

/**
 * A FIGURA DESENHADA, DO TAMANHO DE UM SELO.
 *
 * A caixa já pinta a prévia no tabuleiro, mas o tabuleiro pode estar tapado por
 * ela mesma, ou a peça longe da borda, ou a tela pequena. O selo responde "que
 * forma é essa" sem depender de nada, e responde com o MESMO traço do mapa
 * (`caminhoDaFigura`), só que na escala que couber no quadrado: o que se vê
 * aqui é o que vai sair lá.
 *
 * O fundo é uma grade de um metro. É ela que dá o tamanho sem escrever número
 * nenhum, e some quando o metro fica pequeno demais para ser lido.
 */
function miniatura(f: Figura | null): string {
  if (!f || f.tipo === 'ponto') return '';
  const W = 148, H = 74, pad = 6;
  const cerca = (dentro: string) =>
    `<svg class="ag-mini" viewBox="0 0 ${W} ${H}" aria-hidden="true">${dentro}</svg>`;
  if (f.tipo === 'arena') {
    return cerca(`<rect class="ag-mini-f" x="${pad}" y="${pad}"
      width="${W - 2 * pad}" height="${H - 2 * pad}" rx="4" />`);
  }
  // O contorno em pontos, para achar a caixa que a figura ocupa. Amostrar é mais
  // curto do que deduzir o retângulo de cada tipo, e não erra no leque de 300°.
  const pts: [number, number][] = [[0, 0]];
  if (f.tipo === 'circulo') {
    const r = f.raioM || 0; pts.push([-r, -r], [r, r]);
  } else if (f.tipo === 'leque') {
    const r = f.raioM || 0, meia = ((f.aberturaGraus || 90) / 2) * Math.PI / 180;
    for (let i = 0; i <= 32; i++) {
      const a = -meia + (2 * meia * i) / 32;
      pts.push([Math.cos(a) * r, Math.sin(a) * r]);
    }
  } else if (f.tipo === 'linha' || f.tipo === 'retangulo') {
    const c = f.comprimentoM || 0, l = (f.larguraM || 1) / 2;
    pts.push([0, -l], [0, l], [c, -l], [c, l]);
  } else if (f.tipo === 'arco') {
    const a = arcoDaParede(f), l = (f.larguraM || 1) / 2;
    for (let i = 0; i <= 32; i++) {
      const ang = a.de + ((a.ate - a.de) * i) / 32;
      for (const raio of [a.raio + l, Math.max(0, a.raio - l)]) {
        pts.push([a.cx + Math.cos(ang) * raio, a.cy + Math.sin(ang) * raio]);
      }
    }
  }
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const px = Math.min((W - 2 * pad) / Math.max(0.6, x1 - x0), (H - 2 * pad) / Math.max(0.6, y1 - y0));
  const m = {
    x: pad + (W - 2 * pad - (x1 - x0) * px) / 2 - x0 * px,
    y: pad + (H - 2 * pad - (y1 - y0) * px) / 2 - y0 * px,
  };
  const n = (v: number) => v.toFixed(1);
  // As divisas das fatias: o que separa uma manifestação de três de um leque só.
  const raios = (f.fatias || 0) > 1
    ? Array.from({ length: (f.fatias || 1) + 1 }, (_, i) => {
      const meia = ((f.aberturaGraus || 0) / 2) * Math.PI / 180;
      const a = -meia + i * (f.fatiaGraus || 0) * Math.PI / 180;
      return `<line x1="${n(m.x)}" y1="${n(m.y)}"
        x2="${n(m.x + Math.cos(a) * (f.raioM || 0) * px)}"
        y2="${n(m.y + Math.sin(a) * (f.raioM || 0) * px)}" />`;
    }).join('') : '';
  const grade = px >= 7 ? `<defs><pattern id="ag-mini-g" patternUnits="userSpaceOnUse"
      width="${n(px)}" height="${n(px)}" x="${n(m.x)}" y="${n(m.y)}">
      <path d="M ${n(px)} 0 L 0 0 0 ${n(px)}" /></pattern></defs>
    <rect class="ag-mini-gr" width="100%" height="100%" fill="url(#ag-mini-g)" />` : '';
  return cerca(`${grade}
    <g class="ag-mini-f">${caminhoDaFigura(f, { raioHexPx: 1, pxPorM: px, margem: m })}</g>
    <g class="ag-mini-r">${raios}</g>
    <circle class="ag-mini-o" cx="${n(m.x)}" cy="${n(m.y)}" r="2.4" />`);
}

// ==================================================================== o plano
/** O que o assistente devolve. Quem chamou é que põe isso no tabuleiro. */
export interface Plano {
  arte: Arte;
  nivelArte: number;
  efeito: Efeito | null;        // null = improviso, a Arte crua
  escolhas: Escolhas;
  /**
   * O molde NOMEADO da §5.3 (`explosao`, `leque`, `linha`, `muralha`, `aura`),
   * e não mais uma forma geométrica solta. A régua é dele: o jogador escolhe a
   * forma, a forma decide as dimensões.
   */
  molde: string;
  /** A abertura de cada fatia do improviso, em graus: 60, 90 ou 120. */
  angulo: number;
  /** Quantas fatias vizinhas o improviso abre. Nunca passa do nível da Arte. */
  fatias: number;
  /** Quem paga a abertura: a distância (o raio encolhe) ou a altura (a base baixa). */
  abrirCobra: ModoAbrir;
  /** A altura da base da pirâmide, em metros. O tabuleiro não a mostra sozinho. */
  alturaM: number;
  /** O lado da base comprado pelo Volume do improviso, em metros. */
  ladoBaseM: number;
  /** O volume que a manifestação entrega, em m³. Só o improviso. */
  volumeM3: number;
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
  /**
   * Chamada a cada mexida na caixa, com o plano de agora.
   *
   * É por ela que o tabuleiro desenha a PRÉVIA enquanto se escolhe: o jogador
   * sobe o Volume, abre mais uma fatia, troca quem paga o abrir, e vê a mancha
   * mudar atrás da caixa em vez de descobrir o tamanho depois de fechar. Quem a
   * implementa é a aba, porque só ela sabe onde o conjurador está no mapa.
   */
  aoMudar?: (plano: Plano | null) => void;
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
  let molde = 'explosao';
  let angulo = ABERTURA_PADRAO;
  let fatias = 1;
  let abrirCobra: ModoAbrir = ABRIR_COBRA_PADRAO;
  let curvatura = 0;
  let velocidade = velocidadePadraoDe(null);
  /** O que foi digitado no filtro da lista de Efeitos. Vazio = a lista inteira. */
  let filtro = '';
  /**
   * A última figura que `planoAtual()` resolveu, para o selo desenhar.
   *
   * O plano leva os NÚMEROS da figura (raio, comprimento, altura), que é o que
   * quem executa precisa; o desenho precisa da figura inteira, e refazê-la aqui
   * seria repetir a regra em dois lugares, que foi o que já deu errado antes.
   */
  let ultimaFigura: Figura | null = null;

  // Duas classes, e a segunda não é decoração. `ui-dlg-arte` é só a LARGURA que
  // os três painéis de Arte compartilham; `ui-dlg-conj` é o desenho de duas
  // colunas com altura travada, que é deste painel e de mais nenhum. Enquanto
  // as duas coisas moravam na mesma classe, o NPC e os empurrões herdavam um
  // `display: flex` de fileira e saíam com os blocos lado a lado, fora da tela.
  const { corpo, fechar } = uiPainel(`Conjurar · ${ctx.nome}`,
    { classe: 'ui-dlg-arte ui-dlg-conj', arrastavel: true });

  /**
   * O balão do Efeito, aberto ao apontar o cartão.
   *
   * Ele mora FORA do corpo, no `<body>`, e não dentro da caixa: o corpo é
   * reescrito inteiro a cada clique, e um balão lá dentro sumiria no meio do
   * gesto. Do lado de fora ele também não fica preso ao recorte da coluna, que
   * é o que o cortava pela metade quando o cartão era o último da lista.
   */
  const balao = document.createElement('div');
  balao.className = 'ag-pop';
  balao.hidden = true;
  document.body.appendChild(balao);
  const fecharBalao = () => { balao.hidden = true; };
  const abrirBalao = (alvo: HTMLElement) => {
    let d: any;
    try { d = JSON.parse(alvo.dataset.pop || 'null'); } catch { d = null; }
    if (!d) return;
    balao.innerHTML = `<b class="ag-pop-nm">${esc(d.nome)}</b>`
      + (d.nivel ? `<span class="ag-pop-nv">nível ${d.nivel}</span>` : '')
      + `<p class="ag-pop-tx">${esc(d.texto)}</p>`
      + (d.sabor ? `<p class="ag-pop-sab">${esc(d.sabor)}</p>` : '')
      + (d.marca ? `<p class="ag-pop-mc">${esc(d.marca)}</p>` : '');
    balao.hidden = false;
    // À ESQUERDA do cartão quando couber, à direita quando não: a caixa fica
    // encostada na direita da tela, então a sobra quase sempre é do outro lado.
    const r = alvo.getBoundingClientRect();
    const b = balao.getBoundingClientRect();
    const esquerda = r.left - b.width - 10;
    balao.style.left = `${Math.round(esquerda >= 8 ? esquerda : Math.min(r.right + 10, innerWidth - b.width - 8))}px`;
    balao.style.top = `${Math.round(Math.min(Math.max(8, r.top), Math.max(8, innerHeight - b.height - 8)))}px`;
  };

  return new Promise<Plano | null>((resolve) => {
    let resolvido = false;
    const sair = (v: Plano | null) => {
      if (resolvido) return;
      resolvido = true;
      ctx.aoMudar?.(null);   // apaga a prévia: a caixa fechou, com plano ou sem
      balao.remove();
      fechar(); resolve(v);
    };
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
      if (pArea && nAr) {
        const ev = escalaVisivel(pArea, efeitoSel, molde);
        partes.push(`${pArea.nome} ${ev ? ev[Math.min(ev.length - 1, nAr)] : valorNoNivel(pArea, nAr)}`);
      }
      if (danoDados) partes.push(`${danoDados}d6`);
      else if (danoBonus) partes.push(`+${danoBonus} de dano`);
      if (turnos) partes.push(rotuloDuracao(turnos));
      // O improviso não tem área nenhuma em m²: ele tem a manifestação, e o que
      // ele compra é o lado da base. Ler a régua dele como área daria um número
      // sem sentido (113 m² para "6 m"), e é ele que decidiria a forma lá na mesa.
      const areaM2 = efeitoSel && pArea && nAr && !ehRaio ? areaEmM2(pArea, nAr) : 0;
      // O improviso compra o LADO DA BASE, na régua da manifestação. O número
      // sai direto do parâmetro, e não de conversão nenhuma.
      const ladoBaseM = !efeitoSel && pArea && nAr && arteSel.grid.elemento
        ? medidaNoNivel(pArea, nAr) : 0;
      // O grau do parâmetro de tamanho é o que a régua do molde lê. Num Efeito
      // que compra metros de parede, quem manda é o Comprimento.
      const grauTam = pComp ? (escolhas['Comprimento'] ?? 0) : nAr;
      // A âncora e a direção só se sabem no tabuleiro; aqui a figura serve para
      // dizer o TAMANHO antes de conjurar, e por isso nasce na origem.
      const fig = figuraDoEfeito({
        efeito: efeitoSel, grau: grauTam,
        ancora: { x: 0, y: 0, hex: { q: 0, r: 0 }, tipo: 'centro' },
        molde, curvaturaGraus: curvatura,
        ladoM: ladoBaseM, fatias, aberturaGraus: angulo, abrirCobra,
      });
      ultimaFigura = fig;
      const figura = fig ? rotuloDaFigura(fig) : '';
      if (figura) partes.push(figura);
      // A manifestação é um setor como qualquer outro leque; o que a distingue é
      // ter fatias contadas, e é por isso que só ela rende volume em m³.
      const volumeM3 = fig?.fatias ? volumeDaManifestacao(fig) : 0;
      if (volumeM3) partes.push(`${volumeM3 < 10 ? volumeM3.toFixed(1) : Math.round(volumeM3)} m³`);
      return {
        arte: arteSel, nivelArte, efeito: efeitoSel, escolhas: { ...escolhas },
        molde, angulo, fatias, abrirCobra, ladoBaseM, volumeM3,
        alturaM: fig?.alturaM || 0,
        curvaturaGraus: curvatura, velocidadeTicks: velocidade, custo,
        alcanceM: pAlc && nA ? alcanceEmMetros(pAlc, nA) : 0,
        areaM2,
        raioM: fig?.raioM || 0,
        comprimentoM: fig?.comprimentoM || 0,
        larguraM: fig?.larguraM || 0,
        danoDados, danoBonus, turnos, figura,
        alvos: escolhas['Alvos'] ?? 1,
        nome,
        resumo: `${nome}${partes.length ? ` · ${partes.join(' · ')}` : ''} · ${custo.mana} de Mana`,
      };
    }

    function pintar() {
      const plano = planoAtual();
      ctx.aoMudar?.(plano);
      const g = efeitoSel?.grid;
      const pars = efeitoSel ? parametrosAjustaveis(efeitoSel) : parametrosDoImproviso();
      const fixos = (efeitoSel?.parametros || []).filter((p) => p.tipo === 'fixo');
      const temArea = pars.some((p) => p.nome === 'Área' || p.nome === 'Volume');
      // O improviso NÃO escolhe molde: ele tem uma geometria só, as fatias da
      // §5.4, e qualquer outra manifestação de volume é Efeito Especial. O que
      // ele escolhe é quantas fatias e com que abertura.
      const ehImproviso = !efeitoSel;
      // E a manifestação é das Artes ELEMENTAIS. Cura, Fascinação, Adivinhação,
      // Conjuração e Metamorfose não manifestam elemento nenhum, e uma fatia de
      // 60° não quer dizer nada nelas: a geometria própria delas ainda não
      // existe, e fingir que existe seria pior que dizer que falta.
      const podeFatiar = ehImproviso && temArea && !!arteSel.grid.elemento;
      const improvisoSemChao = ehImproviso && temArea && !arteSel.grid.elemento;
      // Nos Efeitos, a forma declarada já escolheu o molde. Só a `zona` pergunta,
      // porque é a genérica que engordou e ainda espera o julgamento um a um.
      const podeModar = temArea && !ehImproviso && formaEscolheMolde(g?.forma);
      const moldeAtual = MOLDE[molde] || moldeDaForma(g?.forma);
      // O que o Efeito faz no tabuleiro (zona · dura · fere · condição) só era
      // legível apontando o cartão. É curto, e é do assunto da coluna da forma:
      // vem escrito nela, para não ser preciso caçar o mouse para saber.
      const marcaSel = efeitoSel ? marcasDe(efeitoSel) : '';
      // O teto de fatias anda com o Volume: no modo da altura a base é n ÷ N, e
      // ela não desce de um metro. Trocar de modo ou baixar o Volume tem de
      // encolher a escolha junto, senão fica um botão aceso que a regra proíbe.
      const maxFatias = fatiasMaximas(plano.ladoBaseM, nivelArte, abrirCobra);
      if (fatias > maxFatias) { fatias = maxFatias; return pintar(); }
      // A barreira não escolhe molde (ela é sempre uma faixa), mas escolhe se
      // ergue essa faixa reta ou dobrada. Vale para QUALQUER barreira: o livro
      // diz "a curvatura máxima de qualquer barreira é um semicírculo", e não
      // "do Muro", então o Escudo de Força dobra também.
      const podeCurvar = g?.forma === 'muro';

      // A ARTE: PASTILHAS ATÉ CINCO, LISTA DAÍ EM DIANTE.
      //
      // A pastilha é a escolha de um clique, e é o certo enquanto todas cabem na
      // linha. Só que são 24 Artes no sistema, e um conjurador veterano com dez
      // delas transformava a faixa do topo em quatro fileiras de pastilha: o
      // controle que existe para ocupar UMA linha passava a comer um terço da
      // caixa. Do sexto em diante a mesma escolha vira uma lista fechada, que
      // não cresce, e o nível vem escrito nela.
      const muitasArtes = disponiveis.length > 5;
      const faixaArte = muitasArtes
        ? `<span class="ag-sel" style="--ag-cor:${arteSel.grid.cor}">
            <select id="ag-arte-sel" aria-label="Arte">${disponiveis.map(({ arte, nivel }) => `
              <option value="${arte.id}"${arte.id === arteSel.id ? ' selected' : ''}>${
                esc(arte.nome)} · nível ${nivel}</option>`).join('')}</select>
          </span>`
        : `<div class="ag-chips">${disponiveis.map(({ arte, nivel }) => `
            <button type="button" class="ag-chip${arte.id === arteSel.id ? ' on' : ''}"
              data-arte="${arte.id}" style="--ag-cor:${arte.grid.cor}">
              <span class="ag-chip-nm">${esc(arte.nome)}</span><span class="ag-chip-nv">${nivel}</span>
            </button>`).join('')}</div>`;

      const lista = efeitosDisponiveis(arteSel.id, nivelArte, ctx.comprados);
      const sabor = (e: Efeito) => e.artes.find((a) => a.id === arteSel.id)?.sabor || '';
      const opcao = (e: Efeito | null) => {
        const on = (efeitoSel?.id ?? null) === (e?.id ?? null);
        const marca = marcasDe(e);
        const texto = e ? e.efeito : 'Dano e área montados só com os parâmetros do livro.';
        const [gl, oQue] = GLIFO[e?.grid?.forma || 'nenhuma'] || GLIFO.nenhuma;
        // O CARTÃO: O GLIFO DA FORMA, O NOME E O NÍVEL.
        //
        // Ele já foi um resumo de seis linhas com descrição, sabor e marcas, e
        // isso fazia a lista ocupar a caixa inteira para dizer o que só importa
        // depois de escolher; depois virou nome e nível, e aí a lista deixou de
        // dizer qualquer coisa antes da leitura. O glifo é o meio-termo que cabe
        // numa coluna de um caractere: separa quem pinta chão de quem acerta um
        // alvo de relance. O resto continua no balão.
        return `<button type="button" class="ag-ef${on ? ' on' : ''}" data-ef="${e ? e.id : ''}"
          data-pop="${esc(JSON.stringify({
            nome: e ? e.nome : 'Improviso',
            nivel: e ? e.nivel : 0,
            texto,
            sabor: e && sabor(e) ? `${arteSel.nome}: ${sabor(e)}` : '',
            marca,
          }))}"
          data-busca="${esc(`${e ? e.nome : 'improviso'} ${texto} ${marca}`)}">
          <span class="ag-ef-ic" aria-hidden="true" title="${esc(e ? oQue : 'a Arte crua')}">${
            e ? gl : '✧'}</span>
          <b class="ag-ef-nm">${esc(e ? e.nome : 'Improviso')}</b>
          ${e ? `<span class="ag-ef-nv" title="exige a Arte no nível ${e.nivel}">${e.nivel}</span>` : ''}
        </button>`;
      };

      // OS EFEITOS EM GRUPOS DE NÍVEL, e um filtro quando a lista é longa.
      //
      // A lista já vem ordenada por nível; escrever onde cada degrau começa custa
      // uma linha de texto e poupa a contagem à mão de "até onde vai o que eu
      // alcanço". O filtro só aparece quando há mais de oito, que é quando
      // procurar pelo nome fica mais rápido do que correr o olho.
      let nivelAnterior = -1;
      const cartoes = lista.map((e) => {
        const cab = e.nivel !== nivelAnterior ? `<span class="ag-ef-gr">nível ${e.nivel}</span>` : '';
        nivelAnterior = e.nivel;
        return cab + opcao(e);
      }).join('');

      const linhaPar = (p: Parametro) => {
        const n = escolhas[p.nome] ?? 0;
        // A régua VISÍVEL é a do molde quando é ele que manda. Sem isto a caixa
        // mente: o parâmetro anunciava "2,5 m de diâmetro" pela régua velha de
        // Área enquanto a figura saía com 5 m, pela régua da Explosão.
        const esc2 = escalaVisivel(p, efeitoSel, molde);
        const max = esc2 ? esc2.length : 6;
        const valor = (k: number) =>
          (esc2 ? esc2[Math.max(0, Math.min(esc2.length - 1, k))] : valorNoNivel(p, k));
        const acima = Math.max(0, n - nivelArte);
        // A tradução em turnos só aparece quando ela ACRESCENTA: nos degraus em
        // que a régua já diz "5 turnos", repetir seria ruído.
        const emTurnos = p.nome === 'Duração' && n
          ? rotuloDuracao(turnosDeDuracao(n, p.regua || 'breve')) : '';
        const extra = emTurnos && emTurnos !== valor(n)
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
          <span class="ag-p-v">${n ? `${esc(valor(n))}${extra}` : ''}</span>
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
        for (const k of ['data-arte', 'data-ef', 'data-par', 'data-molde', 'data-ang', 'data-curva', 'data-fatias', 'data-abrir']) {
          if (a.hasAttribute(k)) {
            const d = a.getAttribute('data-d');
            return `[${k}="${CSS.escape(a.getAttribute(k) || '')}"]${d ? `[data-d="${d}"]` : ''}`;
          }
        }
        return a.id ? `#${a.id}` : '';
      })();

      // ONDE CADA CAIXA ESTAVA ROLADA, pelo mesmo motivo do foco acima.
      //
      // Devolver o foco NÃO devolve a rolagem: o navegador só traz o elemento
      // focado até a borda mais próxima, e quem estava ajustando a Duração no
      // pé do painel via a caixa saltar de volta para a lista de Efeitos a cada
      // clique. As três que rolam são a fileira inteira (no celular), o miolo
      // da direita (no desktop) e a lista de Efeitos, e as três nascem zeradas
      // quando o corpo é reescrito.
      const rolado = ['.ag-grade', '.ag-col-par', '.ag-efs']
        .map((s) => [s, corpo.querySelector(s)?.scrollTop || 0] as const);

      // ==================================================== o desenho da caixa
      //
      // TRÊS FAIXAS, E NÃO DUAS COLUNAS.
      //
      // A caixa era uma coluna de Efeitos ao lado de uma pilha vertical de
      // seções, e a pilha crescia sem parar porque cada assunto trazia o próprio
      // cabeçalho: Arte, Parâmetros, Manifestação, Molde, Curvatura. Só que as
      // três últimas NUNCA aparecem juntas (um improviso não tem molde, um muro
      // não tem fatias), então a caixa ficava alta para caber uma coisa de cada
      // vez enquanto sobrava largura em todas as linhas.
      //
      // Agora a Arte é uma faixa no topo, que é onde uma fileira de pastilhas
      // quer estar; o miolo são três colunas (o que se escolhe · quanto se
      // compra · que forma toma); e o pé é a conferência, em faixa cheia. O
      // assunto da forma ganhou coluna própria, e ela SOME quando não há forma
      // nenhuma a escolher, devolvendo a largura aos parâmetros.
      const semForma = !podeFatiar && !podeModar && !podeCurvar && !improvisoSemChao
        && !(moldeAtual && temArea);
      const icone = { explosao: '●', leque: '◣', linha: '━', muralha: '▬' };
      /** Uma fileira de botões da coluna da forma: rótulo à esquerda, botões à direita. */
      const fileira = (rot: string, dica: string, botoes: string, nota = '') => `
        <div class="ag-angs">
          <span class="ag-ang-l"${dica ? ` title="${esc(dica)}"` : ''}>${esc(rot)}</span>
          <span class="ag-ang-bs">${botoes}</span>
          ${nota ? `<p class="ag-ang-n">${nota}</p>` : ''}
        </div>`;
      corpo.innerHTML = `
        <div class="ag-grade${semForma ? ' sem-forma' : ''}">
          <div class="ag-fx-arte">
            <span class="ag-h">Arte</span>
            ${faixaArte}
          </div>

          <div class="ag-col-ef">
            <span class="ag-h">Efeito</span>
            ${lista.length > 8 ? `<input type="search" class="ag-busca" id="ag-busca"
              placeholder="filtrar…" value="${esc(filtro)}" aria-label="filtrar os Efeitos" />` : ''}
            <div class="ag-efs">${opcao(null)}${cartoes}</div>
            ${!lista.length ? `<p class="ag-vazio">Nenhum Efeito Especial de ${esc(arteSel.nome)} ao alcance.
              ${ctx.comprados ? 'Compre um na ficha, ou use o improviso.' : ''}</p>` : ''}
          </div>

          <div class="ag-col-par">
            <span class="ag-h">Parâmetros</span>
            ${marcaSel ? `<p class="ag-marcas">${esc(marcaSel)}</p>` : ''}
            <div class="ag-pars">${pars.map(linhaPar).join('')}</div>
            ${fixos.length ? `<div class="ag-fixos">${fixos.map((p) =>
              `<span><b>${esc(p.nome)}:</b> ${esc(p.valor)}</span>`).join('')}</div>` : ''}
          </div>

          ${semForma ? '' : `<div class="ag-col-forma">
            <span class="ag-h">${podeFatiar || improvisoSemChao ? 'Manifestação' : 'Molde'}</span>
            ${improvisoSemChao ? '' : miniatura(ultimaFigura)}
            ${podeFatiar ? `
              ${fileira('Abrir',
                'A base comprada é a mesma nos dois; o que muda é em qual medida ela é cobrada.',
                ABRIR_COBRA.map((o) => `<button type="button" class="ag-ang${abrirCobra === o.id ? ' on' : ''}"
                  data-abrir="${o.id}" title="${esc(o.efeito)}">${esc(o.nome)}</button>`).join(''))}
              <p class="ag-alt">base de <b>${esc(um(plano.alturaM))} m</b> de altura
                <i>${abrirCobra === 'altura'
                  ? `(${esc(um(plano.ladoBaseM))} m &divide; ${fatias} fatia${fatias > 1 ? 's' : ''})`
                  : '(cheia: quem paga o abrir &eacute; a dist&acirc;ncia)'}</i></p>
              ${fileira('Fatias', 'O elemento sai em fatias vizinhas do mesmo ápice.',
                Array.from({ length: maxFatias }, (_, i) => i + 1).map((k) => `
                  <button type="button" class="ag-ang${fatias === k ? ' on' : ''}" data-fatias="${k}">${k}</button>`).join(''),
                maxFatias < nivelArte
                  ? `a base não desce de ${ALTURA_MINIMA_BASE} m, então este Volume abre no máximo ${maxFatias}`
                  : '')}
              ${fileira('Abertura', 'As três que fecham o círculo em número inteiro de fatias: seis, quatro e três.',
                ABERTURAS.map((a) => `<button type="button" class="ag-ang${angulo === a ? ' on' : ''}"
                  data-ang="${a}">${a}&deg;</button>`).join(''))}` : ''}
            ${improvisoSemChao ? `<p class="ag-md-nota">${esc(arteSel.nome)} não manifesta elemento, e a
              fatia não quer dizer nada aqui. A geometria própria das Artes que não são elementais
              ainda não existe: descreva na mesa e marque o chão à mão.</p>` : ''}
            ${podeModar ? `<div class="ag-moldes">${MOLDES_DE_CHAO.map((m) => `
                <button type="button" class="ag-md${molde === m.id ? ' on' : ''}" data-molde="${m.id}"
                  title="${esc(`${m.serve || ''} · compra ${m.compra}`)}">
                  <span class="ag-md-ic" aria-hidden="true">${icone[m.id as keyof typeof icone] || '●'}</span>
                  <span class="ag-md-nm">${esc(m.nome)}</span>
                  ${/* A RÉGUA SÓ DO ESCOLHIDO. Ela é a linha que decide o que o
                       parâmetro compra, e por isso tem de estar escrita; nos
                       outros três ela é comparação, e comparação cabe no balão
                       do título. Escrita nos quatro, a lista passava do pé da
                       coluna e escondia a Muralha atrás de uma rolagem. */''}
                  ${molde === m.id ? `<small>${esc(m.compra)}</small>` : ''}</button>`).join('')}</div>` : ''}
            ${!podeModar && !podeFatiar && moldeAtual && temArea ? `
              <p class="ag-md-nota"><b>${esc(moldeAtual.nome)}</b>, o molde que a forma deste Efeito
                já escolheu. Compra ${esc(moldeAtual.compra)}.</p>` : ''}
            ${podeCurvar ? fileira('Curvatura', 'A barreira ergue-se reta ou dobrada.',
              CURVATURAS.map((a) => `<button type="button" class="ag-ang${curvatura === a ? ' on' : ''}"
                data-curva="${a}">${a ? `${a}&deg;` : 'Reta'}</button>`).join('')) : ''}
          </div>`}

          <div class="ag-pe">
            <div class="ag-cst-l">
              <span>${efeitoSel ? `Efeito ${c.base}` : 'improviso'} + parâmetros ${c.parametros}
                = <b>${c.total}</b> pontos</span>
              <span>&minus; Centelha ${c.centelha} = <b class="${c.mana ? '' : 'gratis'}">${c.mana}</b> de Mana</span>
              <span class="ag-vel">Velocidade
                <input type="number" id="ag-vel" min="0" max="60" step="1" value="${velocidade}" />
                ${velocidade ? 'ticks' : '<b class="gratis">livre</b>'}</span>
              ${c.esticados.length ? `<span class="ag-cst-est">esticado:
                ${c.esticados.map((e) => `${esc(e.nome)} ${e.acima} acima (${e.custo})`).join(' · ')}</span>` : ''}
            </div>
            <div class="ag-pe-fim">
              <span class="ag-cst-fig">${plano.figura ? esc(plano.figura) : ''}${
                plano.volumeM3 ? ` · ${plano.volumeM3 < 10 ? plano.volumeM3.toFixed(1) : Math.round(plano.volumeM3)} m³` : ''}</span>
              <span class="ag-acoes">
                <button type="button" class="btn" id="ag-cancelar">Cancelar</button>
                <button type="button" class="btn primary" id="ag-ok">Conjurar</button>
              </span>
            </div>
          </div>
        </div>`;

      // A rolagem volta antes do foco, e o foco volta sem rolar: na outra ordem
      // o `focus()` puxaria a caixa de novo, e o conserto brigaria consigo.
      for (const [s, t] of rolado) {
        const e = corpo.querySelector(s);
        if (e && t) e.scrollTop = t;   // o navegador apara sozinho se a lista encurtou
      }
      if (focado) corpo.querySelector<HTMLElement>(focado)?.focus({ preventScroll: true });

      const trocarArte = (id: string) => {
        const d = disponiveis.find((x) => x.arte.id === id);
        if (!d) return;
        arteSel = d.arte; nivelArte = d.nivel;
        // As fatias nunca passam do nível da Arte: descer de Arte tem de encolher
        // o leque junto, senão um improviso de grau 2 sairia aberto em seis.
        fatias = Math.max(1, Math.min(fatias, Math.max(1, nivelArte)));
        // O Efeito escolhido pode não caber na Arte nova: some em vez de mentir.
        if (efeitoSel && !efeitosDisponiveis(arteSel.id, nivelArte, ctx.comprados).some((e) => e.id === efeitoSel!.id)) {
          efeitoSel = null;
        }
        // Trocar de Arte troca a lista inteira: um filtro escrito para a lista
        // velha esconderia a nova sem dizer por quê.
        filtro = '';
        semear(); pintar();
      };
      corpo.querySelectorAll<HTMLElement>('[data-arte]').forEach(
        (b) => b.onclick = () => trocarArte(b.dataset.arte!));
      const selArte = corpo.querySelector('#ag-arte-sel') as HTMLSelectElement | null;
      if (selArte) selArte.onchange = () => trocarArte(selArte.value);

      // O FILTRO NÃO REPINTA A CAIXA: esconde os cartões que sobraram de fora.
      // Repintar a cada tecla roubaria o cursor do campo, e o corpo inteiro é
      // reescrito por qualquer clique; esconder é uma passada na lista.
      const aplicarFiltro = () => {
        const t = semAcento(filtro).trim();
        corpo.querySelectorAll<HTMLElement>('.ag-ef').forEach((b) => {
          b.hidden = !!t && !semAcento(b.dataset.busca || '').includes(t);
        });
        // Filtrando, os degraus de nível não descrevem mais o que sobrou na tela.
        corpo.querySelectorAll<HTMLElement>('.ag-ef-gr').forEach((h) => { h.hidden = !!t; });
      };
      const inpBusca = corpo.querySelector('#ag-busca') as HTMLInputElement | null;
      if (inpBusca) inpBusca.oninput = () => { filtro = inpBusca.value; aplicarFiltro(); };
      aplicarFiltro();

      corpo.querySelectorAll<HTMLElement>('[data-ef]').forEach((b) => {
        b.onclick = () => {
          efeitoSel = b.dataset.ef ? EFEITO[b.dataset.ef] : null;
          semear(); pintar();
        };
        // O balão abre no ponteiro e também no teclado: quem navega por Tab
        // precisa da mesma informação que quem passa o mouse.
        b.onpointerenter = () => abrirBalao(b);
        // No teclado sim, no clique não: clicar num cartão devolve o foco a ele
        // depois do repinte, e o balão reabria sozinho e ficava aberto por cima
        // do tabuleiro, tapando justamente a prévia que a caixa acabou de mexer.
        b.onfocus = () => { if (b.matches(':focus-visible')) abrirBalao(b); };
        b.onpointerleave = fecharBalao;
        b.onblur = fecharBalao;
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
        molde = b.dataset.molde!; pintar();
      });
      corpo.querySelectorAll<HTMLElement>('[data-fatias]').forEach((b) => b.onclick = () => {
        fatias = Number(b.dataset.fatias); pintar();
      });
      corpo.querySelectorAll<HTMLElement>('[data-abrir]').forEach((b) => b.onclick = () => {
        abrirCobra = b.dataset.abrir as ModoAbrir; pintar();
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
      (corpo.querySelector('#ag-cancelar') as HTMLElement).onclick = () => sair(null);
      (corpo.querySelector('#ag-ok') as HTMLElement).onclick = () => sair(planoAtual());

      // A lista de Efeitos rola, e o painel se redesenha inteiro a cada escolha:
      // sem isto o cartão que a pessoa acabou de marcar reaparece fora da vista,
      // e a caixa parece ter esquecido o clique.
      //
      // Mas o ajuste é feito À MÃO, na lista e em mais nada. `scrollIntoView`
      // rola TODA caixa que esteja no caminho, e no celular a lista mora dentro
      // de uma fileira que também rola: aproximar o cartão marcado arrastava o
      // painel inteiro de volta ao topo, que é justamente onde a lista está.
      // Quem clicava num Molde lá embaixo perdia o lugar por causa disto.
      const listaEf = corpo.querySelector('.ag-efs');
      const marcado = corpo.querySelector('.ag-ef.on');
      if (listaEf && marcado) {
        const cx = listaEf.getBoundingClientRect();
        const cd = marcado.getBoundingClientRect();
        if (cd.top < cx.top) listaEf.scrollTop -= cx.top - cd.top;
        else if (cd.bottom > cx.bottom) listaEf.scrollTop += cd.bottom - cx.bottom;
      }
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
  const { corpo, fechar } = uiPainel(titulo, { classe: 'ui-dlg-arte ui-dlg-emp' });
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
