// As Artes dentro do tabuleiro: conjurar, desenhar, cobrar a mordida e expirar.
//
// Este arquivo é a cola entre o motor (`artes-grid.ts`, que só calcula), a tela
// (`artes-grid-ui.ts`, que só pergunta) e a aba Grid, que é dona do Supabase e
// dos hexágonos. A aba entrega um contexto e chama quatro funções; tudo o mais
// mora aqui, e é por isso que `grid.astro` quase não muda para ganhar isso.
import { esc, novoId, somarCondicoes, COND, tierDe } from './mesa-core';
import { MON } from './mesa-bestiario';
import { uiErro, uiConfirmar, uiEscolher, uiPainel } from './ui-dialog';
import {
  EFEITO, ARTE, CONDICAO, rotuloDaFigura, caminhoDaFigura,
  figuraDoEfeito, hexesDaFigura, pontoNaFigura, centroEmMetros, encaixeMaisProximo, encaixeNoCentro,
  raioEmMetros, danoNoAlvo, rolar,
  turnosRestantes, venceu, jaMordido, rodadaDoTick, dentroDoEfeito,
  metrosParaSair, metrosParaSairDosHexes, desvioDaArea, desEsqDaDefesa,
  rotuloDuracao, TICKS_POR_TURNO, LARGURA_LINHA,
  type EfeitoAtivo, type Forma, type Figura, type Encaixe, type Desvio,
} from './artes-grid';
import { pool } from './calc';
import {
  abrirConjuracao, abrirNPC, abrirEmpurroes, escolherItem, itensDoAlvo,
  npcVazio, type Plano, type Empurrado,
} from './artes-grid-ui';
import {
  centroHex, verticesHex, margemTabuleiro, medidaTabuleiro, larguraHex,
  distanciaHex, nomeHex, vizinhos, type Hex,
} from './hex';
import {
  defsHTML, fxHTML, ehElemental, AJUSTES_PADRAO, LIMITES, type Ajustes,
} from './artes-grid-fx';
import { camadaDeGolpes, baterNoAlvo } from './grid-golpe-fx';

/** O que a aba Grid empresta. Tudo o que este módulo não tem como saber sozinho. */
export interface CtxGrid {
  SB: any;
  arena: any;
  enc: any;
  combs: any[];
  tokens: Record<string, { q: number; r: number }>;
  resumo: Record<string, any>;
  fichas: Record<string, any>;
  raio: number;
  mestre: boolean;
  /** Converte um ponto da tela no hexágono debaixo dele. Mora na aba. */
  hexNaTela: (cx: number, cy: number) => Hex | null;
  /**
   * O relógio do tabuleiro, em Ticks.
   *
   * NÃO é `encontros.tick_atual`: essa coluna é avançada pela aba Combate, e a
   * aba Grid nunca a toca. O agora do tabuleiro é o tick de QUEM ESTÁ NA VEZ,
   * que é o mesmo número que a coluna de iniciativa mostra. Lendo a coluna
   * errada, nenhum efeito venceria enquanto a mesa jogasse só pelo Grid.
   */
  tickAgora?: () => number;
  /**
   * A margem e o quadro do tabuleiro, EMPRESTADOS pela aba.
   *
   * Recalcular aqui com `margemTabuleiro(RAIO)` parece inofensivo e não é: a aba
   * abre espaço na moldura para as letras e os números das casas, e some com ela
   * quando os rótulos estão desligados. Copiar a conta deixou as manchas 15 px
   * fora do lugar assim que a moldura entrou. Quem desenha a grade é quem sabe
   * onde ela começa.
   */
  margem?: () => { x: number; y: number };
  medida?: () => { largura: number; altura: number };
  logar: (c: any, txt: string, extra: Record<string, any>) => Promise<void>;
  recarregar: () => Promise<void>;
  repintar: () => void;
  /**
   * A repintura ESTREITA: só o que as Artes mexem (as manchas, a névoa que o
   * fogo abre e o painel lateral).
   *
   * Existe porque `verificarEfeitos` roda depois de toda peça movida e de toda
   * vez encerrada, e quem a chamou já pintou o que mexeu (a peça que andou, a
   * fila que virou). Terminar em `repintar()` cheio ali era a SEGUNDA repintura
   * completa da ação, e a mais cara: numa arena 40×30 com névoa, 444 KB de HTML
   * e 3.300 nós recriados idênticos aos que já estavam na página.
   *
   * Opcional de propósito: sem ela o módulo cai no `repintar()` de sempre, e
   * quem não a implementa continua funcionando.
   */
  repintarEfeitos?: () => void;
  /**
   * Quanto de Mana a conjuração custou. Aqui só se avisa o número: a reserva
   * mora na linha do combatente, e quem escreve nela é a aba.
   */
  gastarMana?: (cid: string, quanto: number) => Promise<void>;
}

let ATIVOS: EfeitoAtivo[] = [];
export const efeitosAtivos = () => ATIVOS;

/**
 * Os ajustes dos efeitos visuais, guardados NO APARELHO.
 *
 * No aparelho e não na arena: é preferência de quem está olhando, e o mestre no
 * notebook não tem por que impor a decisão ao jogador no celular, que pode ter
 * uma máquina fraca. Mesma escolha da lista recolhida da coluna lateral.
 */
const FX_KEY = 'centelha:grid:efeitos';
let FX: Ajustes = { ...AJUSTES_PADRAO };
try {
  const g = JSON.parse(localStorage.getItem(FX_KEY) || 'null');
  if (g && typeof g === 'object') FX = { ...AJUSTES_PADRAO, ...g };
} catch { /* aparelho sem localStorage: fica no padrão */ }

export const ajustesFx = (): Ajustes => ({ ...FX });
export function definirFx(novo: Partial<Ajustes>): Ajustes {
  FX = { ...FX, ...novo };
  const trava = (v: number, l: { min: number; max: number }) => Math.max(l.min, Math.min(l.max, v));
  FX.opacidade = trava(FX.opacidade, LIMITES.opacidade);
  FX.particulas = trava(FX.particulas, LIMITES.particulas);
  FX.velocidade = trava(FX.velocidade, LIMITES.velocidade);
  try { localStorage.setItem(FX_KEY, JSON.stringify(FX)); } catch { /* sem guardar */ }
  return { ...FX };
}

const tickAtual = (ctx: CtxGrid) => Number(ctx.tickAgora?.() ?? ctx.enc?.tick_atual ?? 0);
const escalaM = (ctx: CtxGrid) => Number(ctx.arena?.escala_m) || 1;
const combDe = (ctx: CtxGrid, id: string) => ctx.combs.find((c) => c.id === id);

// ==================================================================== carregar
export async function carregarEfeitos(ctx: CtxGrid): Promise<void> {
  ATIVOS = [];
  if (!ctx.arena) return;
  const { data, error } = await ctx.SB
    .from(ctx.mestre ? 'arena_efeitos' : 'efeito_visao')
    .select('*').eq('arena_id', ctx.arena.id);
  // Sem a migração 19 a aba inteira continua funcionando; só não há efeito para
  // desenhar. Avisar aqui atrapalharia quem nem usa Artes.
  if (error) return;
  ATIVOS = (data || []).map((e: any) => ({ ...e, mordidos: e.mordidos || {} }));
}

// ==================================================================== desenhar
const ELEM_COR: Record<string, string> = {
  fogo: '#d1542a', gelo: '#5aa9c9', raio: '#d8b13a', agua: '#3d7ea6',
  vento: '#9fb3a8', terra: '#8a6a43', luz: '#e0c86a', sombra: '#5b4a72',
};
const corDe = (ef: EfeitoAtivo) => ARTE[ef.arte_id]?.grid?.cor || ELEM_COR[ef.elemento || ''] || '#8a8a8a';

/**
 * As duas camadas novas herdam o quadro do tabuleiro.
 *
 * Fazer isso aqui, e não em `pintarTabuleiro`, mantém a aba Grid sem saber que
 * estas camadas existem: elas se ajustam sozinhas sempre que há o que desenhar.
 */
function ajustarQuadro(ctx: CtxGrid, svg: SVGElement | null): void {
  if (!svg) return;
  // COPIAR o quadro da camada dos hexágonos, e não recalculá-lo.
  //
  // Recalcular já saiu errado duas vezes, e a segunda foi sutil: a aba desenha
  // os hexágonos deslocados pela moldura dos rótulos mas mantém o `viewBox` no
  // tamanho sem moldura. Dois viewBox diferentes sobre a mesma caixa dão escalas
  // diferentes, e o desencontro CRESCE conforme se afasta do canto — que é
  // exatamente a cara de "está um pouco deslocado". Copiando, as camadas passam
  // a ser iguais por construção, qualquer que seja a conta lá.
  const hexes = document.getElementById('gr-hexes');
  const vb = hexes?.getAttribute('viewBox');
  if (vb) { svg.setAttribute('viewBox', vb); return; }
  const med = ctx.medida?.() ?? medidaTabuleiro(ctx.arena.cols, ctx.arena.rows, ctx.raio);
  svg.setAttribute('viewBox', `0 0 ${med.largura} ${med.altura}`);
}

/** Onde o hexágono (0,0) começa dentro do quadro. Vem da aba, ver `CtxGrid`. */
const margemDe = (ctx: CtxGrid) => ctx.margem?.() ?? margemTabuleiro(ctx.raio);

/**
 * Pinta as manchas dos efeitos na camada própria, embaixo dos tokens.
 *
 * Cada efeito vira UM polígono por hexágono, e não um contorno unificado: unir a
 * silhueta exigiria costurar arestas, e o ganho visual não paga o custo quando a
 * mancha já é translúcida. O que separa dois efeitos empilhados no mesmo chão é
 * a cor da Arte e a listra, não a borda.
 */
export function pintarEfeitos(ctx: CtxGrid, svg: SVGElement): void {
  if (!svg || !ctx.arena) return;
  ajustarQuadro(ctx, svg);
  ajustarQuadro(ctx, document.getElementById('gr-previa') as unknown as SVGElement | null);
  const t = tickAtual(ctx);
  const vivos = ATIVOS.filter((e) => !venceu(e, t));
  // Os <defs> saem UMA vez, e só dos elementos presentes: dez fogueiras dividem
  // o mesmo gradiente e o mesmo filtro.
  const defs = FX.ligado ? defsHTML(vivos.map((e) => e.elemento || '')) : '';
  svg.innerHTML = defs + vivos.map((ef) => {
    const restam = turnosRestantes(ef, t);
    const vel = Math.max(0.25, FX.velocidade / 100);
    return `<g class="gr-ef gr-ef-${esc(ef.forma)}${
      FX.ligado && ehElemental(ef.elemento) ? ' com-fx' : ''}" data-ef="${esc(ef.id)}"
      style="--ef-cor:${corDe(ef)};--fx-v:${vel}" opacity="${restam <= 1 ? 0.55 : 1}">
      <title>${esc(ef.nome)} · ${esc(rotuloDuracao(restam))}</title>${tracoDe(ctx, ef)}</g>`;
  }).join('');
}

/**
 * A figura VIGENTE de um efeito.
 *
 * A aura anda com quem a conjurou: ela é "centralizada no conjurador", e deixá-la
 * onde caiu transformaria um escudo de fogo numa poça de fogo. Por isso a âncora
 * dela é recalculada da posição ATUAL do token a cada desenho, em vez de sair da
 * linha gravada. O resto das figuras fica onde caiu, que é o que se espera de uma
 * muralha e de uma névoa.
 */
function figuraVigente(ctx: CtxGrid, ef: EfeitoAtivo): Figura | null {
  const f = ef.figura;
  if (!f || !f.tipo) return null;
  if (ef.forma !== 'aura' || !ef.conjurador_id) return f;
  const t = ctx.tokens[ef.conjurador_id];
  if (!t) return f;
  const c = centroEmMetros(t, escalaM(ctx));
  return { ...f, ax: c.x, ay: c.y, q: t.q, r: t.r };
}

/** O efeito com a figura de AGORA, que é o que a aura muda a cada passo. */
const vigente = (ctx: CtxGrid, ef: EfeitoAtivo): EfeitoAtivo =>
  (ef.forma === 'aura' ? { ...ef, figura: figuraVigente(ctx, ef) } : ef);

/**
 * O traço de um efeito: a FIGURA quando ela existe, as casas quando não.
 *
 * A lista de casas continua sendo lida porque os efeitos gravados antes de a
 * figura existir só têm ela. Efeito novo desenha um `<circle>`, um `<rect>` ou
 * um setor, e não uma colcha de hexágonos aproximando a forma.
 */
function tracoDe(ctx: CtxGrid, ef: EfeitoAtivo): string {
  const f = figuraVigente(ctx, ef);
  if (!f) return casasHTML(ctx, ef.hexes || []);
  if (f.tipo === 'arena') return casasHTML(ctx, hexesDaArenaDe(ctx));
  const q = quadro(ctx);
  const caminho = caminhoDaFigura(f, q);
  // O efeito visual entra POR DENTRO do recorte da própria forma: nada dele
  // vaza, e o desenho continua dizendo a verdade sobre onde a Arte pega.
  const fx = fxHTML({
    id: ef.id, elemento: ef.elemento || '', figura: f, forma: ef.forma,
    caminho, cx: f.ax * q.pxPorM + q.margem.x, cy: f.ay * q.pxPorM + q.margem.y,
    pxPorM: q.pxPorM, ajustes: FX,
  });
  return caminho + fx;
}

const hexesDaArenaDe = (ctx: CtxGrid): Hex[] => {
  const out: Hex[] = [];
  for (let row = 0; row < ctx.arena.rows; row++) {
    for (let col = 0; col < ctx.arena.cols; col++) out.push({ q: col - Math.floor(row / 2), r: row });
  }
  return out;
};

/** Um polígono por casa. Só para a arena inteira e para o que veio de antes. */
function casasHTML(ctx: CtxGrid, hexes: { q: number; r: number }[]): string {
  const mg = margemDe(ctx);
  return hexes.map((h) => {
    const c = centroHex(h.q, h.r, ctx.raio);
    return `<polygon points="${verticesHex(c.x + mg.x, c.y + mg.y, ctx.raio * 0.94)}" />`;
  }).join('');
}

/** O que `caminhoDaFigura` precisa para converter metro em pixel do mundo. */
const quadro = (ctx: CtxGrid) => ({
  raioHexPx: ctx.raio,
  pxPorM: larguraHex(ctx.raio) / (Number(ctx.arena?.escala_m) || 1),
  margem: margemDe(ctx),
});

/**
 * Onde o ponteiro está, EM METROS, no mesmo plano da figura.
 *
 * O caminho é: pixel da tela → pixel do mundo (descontando o zoom e a rolagem)
 * → metro. `hexNaTela` da aba só devolve a casa, e casa não basta desde que a
 * âncora pode cair num vértice.
 */
function ponteiroEmMetros(ctx: CtxGrid, ev: PointerEvent | null): { x: number; y: number } | null {
  const mundo = document.getElementById('gr-mundo');
  if (!ev || !mundo) return null;
  const cai = mundo.getBoundingClientRect();
  // O zoom é um `scale` no mundo, então a caixa medida já vem escalada: a razão
  // entre ela e a largura de layout devolve o fator sem consultar a aba.
  const zoom = (cai.width / (mundo.offsetWidth || cai.width)) || 1;
  const q = quadro(ctx);
  const mg = q.margem;
  return {
    x: ((ev.clientX - cai.left) / zoom - mg.x) / q.pxPorM,
    y: ((ev.clientY - cai.top) / zoom - mg.y) / q.pxPorM,
  };
}

/** O encaixe (centro ou vértice) mais perto do ponteiro. */
function encaixeDoPonteiro(ctx: CtxGrid, ev: PointerEvent | null, casa: Hex): Encaixe {
  const p = ponteiroEmMetros(ctx, ev);
  if (!p) return encaixeNoCentro(casa, escalaM(ctx));
  return encaixeMaisProximo(p, casa, escalaM(ctx));
}

/**
 * A régua do Alcance: do centro de quem conjura até o ponteiro.
 *
 * O Alcance é um número comprado ("4 m"), e até aqui ele só era conferido DEPOIS
 * do clique, num aviso. Isso é tarde: a pessoa escolhe o lugar, descobre que não
 * alcança, e refaz. A régua responde antes, enquanto o ponteiro anda.
 *
 * TRÊS DECISÕES QUE MUDAM O NÚMERO:
 *
 * A distância é do CENTRO do conjurador, e não da borda da peça nem do canto do
 * hexágono: é o ponto que o resto do motor já usa como posição dele, e medir de
 * outro lugar faria a régua discordar da conferência que vem depois do clique.
 *
 * É distância EM LINHA, com casas decimais, e não contagem de casas. Contar
 * casas devolve sempre inteiros e diz que a diagonal custa o mesmo que a reta;
 * quem está a 4,3 m precisa saber que está a 4,3, e não a "5 casas".
 *
 * E o anel do alcance é desenhado junto. Ele é a resposta que a pessoa quer de
 * verdade: não "que distância é essa?", mas "até onde eu chego?".
 */
function reguaDeAlcance(
  ctx: CtxGrid, de: Hex, plano: Plano, ev: PointerEvent | null,
): string {
  return reguaAtePonto(ctx, de, plano, ponteiroEmMetros(ctx, ev));
}

/**
 * A mesma régua, medida até um ponto qualquer, e não até o ponteiro.
 *
 * No dedo não há ponteiro parado sobre o mapa: a prévia se posiciona sozinha e
 * fica lá, e o que a régua tem de medir é a ÂNCORA dela. Separar em duas
 * funções mantém a régua idêntica nos dois caminhos, que é o que importa: se a
 * do toque medisse de outro jeito, ela discordaria da conferência de Alcance
 * que vem depois.
 */
function reguaAtePonto(
  ctx: CtxGrid, de: Hex, plano: Plano, p: { x: number; y: number } | null,
): string {
  // Sem parâmetro de Alcance não há o que medir: o efeito nasce onde nasce.
  if (plano.escolhas['Alcance'] === undefined) return '';
  if (!p) return '';
  const esc_ = escalaM(ctx);
  const o = encaixeNoCentro(de, esc_);
  const dist = Math.hypot(p.x - o.x, p.y - o.y);
  const q = quadro(ctx);
  const px = (m: { x: number; y: number }) =>
    ({ x: m.x * q.pxPorM + q.margem.x, y: m.y * q.pxPorM + q.margem.y });
  const A = px(o), B = px(p);
  const longe = plano.alcanceM > 0 && dist > plano.alcanceM + 1e-9;
  const num = (v: number) => v.toFixed(1).replace('.', ',');
  const anel = plano.alcanceM > 0
    ? `<circle class="pv-alcance" cx="${A.x.toFixed(1)}" cy="${A.y.toFixed(1)}"
        r="${(plano.alcanceM * q.pxPorM).toFixed(1)}" />`
    : '';
  return `<g class="pv-regua${longe ? ' longe' : ''}">
    ${anel}
    <line x1="${A.x.toFixed(1)}" y1="${A.y.toFixed(1)}"
      x2="${B.x.toFixed(1)}" y2="${B.y.toFixed(1)}" />
    <circle class="pv-regua-o" cx="${A.x.toFixed(1)}" cy="${A.y.toFixed(1)}" r="3" />
    <text x="${(B.x + 12).toFixed(1)}" y="${(B.y - 10).toFixed(1)}">${num(dist)} m${
      plano.alcanceM > 0 ? ` de ${num(plano.alcanceM)}` : ''}</text>
  </g>`;
}

/** A marca do encaixe, para a pessoa ver onde a figura vai grudar. */
function marcaEncaixe(ctx: CtxGrid, e: Encaixe): string {
  const q = quadro(ctx);
  const x = e.x * q.pxPorM + q.margem.x, y = e.y * q.pxPorM + q.margem.y;
  return `<circle class="pv-enc pv-${e.tipo}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4" />`;
}

/**
 * O painel lateral dos efeitos vivos: o que está no ar, o que faz e quanto falta.
 *
 * Sem esta lista o mestre teria de passar o ponteiro em cada mancha para lembrar
 * o que era. Os turnos restantes são o número que a mesa pergunta em voz alta, e
 * por isso são a única coisa em destaque.
 */
export function pintarPainelEfeitos(ctx: CtxGrid, box: HTMLElement): void {
  if (!box) return;
  const t = tickAtual(ctx);
  const vivos = ATIVOS.filter((e) => !venceu(e, t));
  if (!vivos.length) { box.innerHTML = ''; box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = vivos.map((ef) => {
    const restam = turnosRestantes(ef, t);
    const dentro = ef.forma === 'alvo' || ef.forma === 'token'
      ? (ef.alvos || []) : dentroDoEfeito(vigente(ctx, ef), ctx.tokens, escalaM(ctx));
    const quem = dentro.map((id) => combDe(ctx, id)?.nome).filter(Boolean);
    const cond = ef.condicao && CONDICAO[ef.condicao] ? CONDICAO[ef.condicao] : null;
    return `<div class="gr-efl" data-ef="${esc(ef.id)}" style="--ef-cor:${corDe(ef)}">
      <span class="gr-efl-b"></span>
      <span class="gr-efl-tx">
        <b>${esc(ef.nome)}</b>
        <small>${[
          ef.dano_dados ? `${ef.dano_dados}d6` : '',
          ef.dano_bonus ? `+${ef.dano_bonus}` : '',
          cond ? `${cond.icone} ${cond.nome}` : '',
          ef.item ? esc(ef.item) : '',
          quem.length ? `em ${quem.map(esc).join(', ')}` : '',
        ].filter(Boolean).join(' · ')}</small>
      </span>
      <span class="gr-efl-t" title="turnos restantes">${restam > 99 ? '∞' : restam}</span>
      ${ctx.mestre ? `<button class="btn-fant gr-efl-x" data-fim="${esc(ef.id)}"
        title="Desfazer este efeito agora">✕</button>` : ''}
    </div>`;
  }).join('');
  if (!ctx.mestre) return;
  box.querySelectorAll<HTMLElement>('[data-fim]').forEach((b) => b.onclick = async () => {
    const ef = ATIVOS.find((e) => e.id === b.dataset.fim);
    if (!ef) return;
    if (!await uiConfirmar(`Desfazer ${ef.nome} agora?`, { titulo: 'Desfazer efeito', ok: 'Desfazer' })) return;
    await encerrarEfeito(ctx, ef, 'desfeito pelo mestre');
  });
}

// ============================================================ escolher no mapa
/**
 * O aparelho responde a dedo, e não a ponteiro que paira?
 *
 * A pergunta é de CAPACIDADE, e não de largura de tela: o que quebra a mira de
 * sempre é a falta de hover, e um tablet de 900 px sofre dela igual a um
 * telefone de 360. `pointer: coarse` é exatamente essa pergunta, e um notebook
 * com tela sensível continua respondendo `fine` para o ponteiro principal, que
 * é o certo: lá o mouse existe e a mira de sempre funciona.
 */
const noDedo = () => {
  try { return matchMedia('(pointer: coarse)').matches; } catch { return false; }
};

/** Onde um ponto do plano (em metros) cai na TELA, em pixels. Inverso de `ponteiroEmMetros`. */
function pontoNaTela(ctx: CtxGrid, p: { x: number; y: number }): { x: number; y: number } | null {
  const mundo = document.getElementById('gr-mundo');
  if (!mundo) return null;
  const cai = mundo.getBoundingClientRect();
  const zoom = (cai.width / (mundo.offsetWidth || cai.width)) || 1;
  const q = quadro(ctx);
  return {
    x: cai.left + (p.x * q.pxPorM + q.margem.x) * zoom,
    y: cai.top + (p.y * q.pxPorM + q.margem.y) * zoom,
  };
}

/**
 * A MIRA NO DEDO: posicionar, girar e confirmar sem hover nenhum.
 *
 * POR QUE ELA EXISTE
 * `escolherNoMapa` desenha a prévia no `pointermove` e confirma no
 * `pointerdown`. Num mouse isso é a coisa certa: o ponteiro passeia, a figura
 * acompanha, e o clique fecha. Num dedo os dois eventos são o MESMO gesto: não
 * há `pointermove` antes de encostar, e o primeiro encostar já confirmava. O
 * resultado era escolher o lugar e o ângulo às cegas, em dois toques, sem ter
 * visto a figura uma única vez.
 *
 * O GESTO
 *   · a prévia já nasce desenhada, colada no conjurador, na casa ao lado;
 *   · um toque solto LONGE dela muda a figura de lugar;
 *   · arrastar gira (ou arrasta a figura junto, quando ela é um círculo e não
 *     tem para onde apontar), e o que estiver na tela ao soltar é o que fica;
 *   · um toque solto EM CIMA da marca confirma. É o "toque de novo no mesmo
 *     lugar": depois de pôr a figura, o dedo já está onde ela está.
 *
 * O toque seco e o arrasto se separam no `pointerup`, pela distância andada, e
 * não no `pointerdown`: no momento em que o dedo encosta ainda não dá para
 * saber qual dos dois é, e adivinhar erraria metade das vezes.
 */
function mirarNoDedo(
  ctx: CtxGrid, palco: HTMLElement, meu: Hex, plano: Plano,
  monta: (ancora: Encaixe, dir: number) => Figura, gira: boolean, nome: string,
): Promise<{ ancora: Encaixe; dir: number } | null> {
  return new Promise((resolve) => {
    const svg = document.getElementById('gr-previa') as unknown as SVGElement | null;
    const esc_ = escalaM(ctx);
    // Colada no conjurador: a casa vizinha do lado leste. Os tokens não guardam
    // para onde a pessoa olha, então qualquer "frente" seria inventada; nascer
    // encostado nunca chuta errado, e o primeiro toque já leva para o lugar.
    let ancora: Encaixe = encaixeNoCentro(vizinhos(meu)[0], esc_);
    let dir = 0;

    const dica = document.createElement('div');
    dica.className = 'mira-aviso mira-dedo';
    dica.innerHTML = `<span>${esc(nome)} · toque para pôr${
      gira ? ', arraste para girar' : ''}, toque na marca para conjurar</span>`
      + '<button type="button" class="mira-x" aria-label="Cancelar a conjuração">✕</button>';
    palco.appendChild(dica);
    palco.classList.add('mirando', 'mirando-dedo');

    const desenhar = () => {
      if (svg) {
        svg.innerHTML = reguaAtePonto(ctx, meu, plano, ancora)
          + caminhoDaFigura(monta(ancora, dir), quadro(ctx)) + marcaEncaixe(ctx, ancora);
      }
    };

    const limpar = () => {
      palco.classList.remove('mirando', 'mirando-dedo');
      dica.remove();
      if (svg) svg.innerHTML = '';
      palco.removeEventListener('pointerdown', desceu, true);
      document.removeEventListener('pointermove', andou, true);
      document.removeEventListener('pointerup', subiu, true);
      document.removeEventListener('pointercancel', subiu, true);
      document.removeEventListener('keydown', tecla);
    };
    const sair = (v: { ancora: Encaixe; dir: number } | null) => { limpar(); resolve(v); };

    /** O toque caiu em cima da marca da âncora? O alvo é do tamanho de um dedo. */
    const naMarca = (ev: PointerEvent) => {
      const a = pontoNaTela(ctx, ancora);
      if (!a) return false;
      return Math.hypot(ev.clientX - a.x, ev.clientY - a.y) <= 32;
    };
    const levarPara = (ev: PointerEvent) => {
      const h = ctx.hexNaTela(ev.clientX, ev.clientY);
      if (!h) return false;
      ancora = encaixeDoPonteiro(ctx, ev, h);
      return true;
    };

    let x0 = 0, y0 = 0, arrastando = false, ativo = false;
    const desceu = (ev: PointerEvent) => {
      // o ✕ do balão é dele, e não do tabuleiro
      if ((ev.target as HTMLElement).closest('.mira-aviso')) return;
      ev.preventDefault(); ev.stopPropagation();
      ativo = true; arrastando = false;
      x0 = ev.clientX; y0 = ev.clientY;
    };
    const andou = (ev: PointerEvent) => {
      if (!ativo) return;
      // 10 px de folga: sem ela todo toque vira arrasto, porque dedo treme
      if (!arrastando && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 10) return;
      ev.preventDefault(); ev.stopPropagation();
      arrastando = true;
      // O círculo é igual para todo lado: nele o arrasto arrasta a figura, que é
      // o único uso que sobra para o gesto.
      if (gira) dir = direcaoAoPonteiro(ctx, ancora, ev);
      else levarPara(ev);
      desenhar();
    };
    const subiu = (ev: PointerEvent) => {
      if (!ativo) return;
      ativo = false;
      if (arrastando) return;              // era arrasto: o que está na tela já ficou
      ev.preventDefault(); ev.stopPropagation();
      if (naMarca(ev)) return sair({ ancora, dir });
      // Fora do tabuleiro é desistir, como na mira de sempre.
      if (!levarPara(ev)) return sair(null);
      desenhar();
    };
    const tecla = (ev: KeyboardEvent) => { if (ev.key === 'Escape') sair(null); };

    palco.addEventListener('pointerdown', desceu, true);
    document.addEventListener('pointermove', andou, true);
    document.addEventListener('pointerup', subiu, true);
    document.addEventListener('pointercancel', subiu, true);
    document.addEventListener('keydown', tecla);
    dica.querySelector('.mira-x')!.addEventListener('click', () => sair(null));
    desenhar();
  });
}

/**
 * Espera um clique num hexágono, com a prévia da mancha seguindo o ponteiro.
 *
 * A fase de captura é a mesma escolha que a mira de ataque faz: sem ela o
 * ponteiro começaria a arrastar a peça que estivesse embaixo do alvo.
 */
function escolherNoMapa(
  ctx: CtxGrid, palco: HTMLElement, previa: (h: Hex, ev: PointerEvent) => string, aviso: string,
): Promise<{ hex: Hex; ev: PointerEvent | null } | null> {
  return new Promise((resolve) => {
    const svg = document.getElementById('gr-previa') as unknown as SVGElement | null;
    const mg = margemDe(ctx);
    const dica = document.createElement('div');
    dica.className = 'mira-aviso'; dica.textContent = aviso;
    palco.appendChild(dica);
    palco.classList.add('mirando');

    const limpar = () => {
      palco.classList.remove('mirando');
      dica.remove();
      if (svg) svg.innerHTML = '';
      palco.removeEventListener('pointerdown', clicou, true);
      document.removeEventListener('pointermove', moveu);
      document.removeEventListener('keydown', tecla);
    };
    const desenhar = (h: Hex, ev: PointerEvent) => {
      if (svg) svg.innerHTML = previa(h, ev);
    };
    const moveu = (ev: PointerEvent) => {
      const h = ctx.hexNaTela(ev.clientX, ev.clientY);
      if (h) desenhar(h, ev);
    };
    const clicou = (ev: PointerEvent) => {
      ev.preventDefault(); ev.stopPropagation();
      const h = ctx.hexNaTela(ev.clientX, ev.clientY);
      limpar();
      resolve(h ? { hex: h, ev } : null);
    };
    const tecla = (ev: KeyboardEvent) => { if (ev.key === 'Escape') { limpar(); resolve(null); } };
    palco.addEventListener('pointerdown', clicou, true);
    document.addEventListener('pointermove', moveu);
    document.addEventListener('keydown', tecla);
  });
}

/**
 * A direção, em radianos, da âncora até o ponto EXATO do ponteiro.
 *
 * Do ponteiro, e não do centro da casa debaixo dele: apontar por casa daria só
 * os seis ângulos do hexágono, e uma faixa nunca sairia a 20°.
 */
function direcaoAoPonteiro(ctx: CtxGrid, de: Encaixe, ev: PointerEvent | null): number {
  const p = ponteiroEmMetros(ctx, ev);
  if (!p) return 0;
  return Math.atan2(p.y - de.y, p.x - de.x);
}

/** Escolhe um combatente clicando no token dele. */
function escolherAlvoNoMapa(ctx: CtxGrid, palco: HTMLElement, excluir: string, aviso: string): Promise<string | null> {
  return new Promise((resolve) => {
    const dica = document.createElement('div');
    dica.className = 'mira-aviso'; dica.textContent = aviso;
    palco.appendChild(dica);
    palco.classList.add('mirando');
    const limpar = () => {
      palco.classList.remove('mirando'); dica.remove();
      palco.removeEventListener('pointerdown', clicou, true);
      document.removeEventListener('keydown', tecla);
    };
    const clicou = (ev: PointerEvent) => {
      ev.preventDefault(); ev.stopPropagation();
      const t = (ev.target as HTMLElement).closest<HTMLElement>('.gr-token');
      limpar();
      resolve(t && t.dataset.c !== excluir ? t.dataset.c! : null);
    };
    const tecla = (ev: KeyboardEvent) => { if (ev.key === 'Escape') { limpar(); resolve(null); } };
    palco.addEventListener('pointerdown', clicou, true);
    document.addEventListener('keydown', tecla);
  });
}

// ==================================================================== conjurar
/**
 * A prévia no tabuleiro ENQUANTO a caixa está aberta.
 *
 * Antes o jogador escolhia tudo no escuro e só via o tamanho depois de fechar a
 * caixa e apontar. Agora a mancha aparece atrás dela e muda a cada clique: subir
 * o Volume, abrir mais uma fatia, trocar quem paga o abrir. É a mesma camada da
 * mira (`#gr-previa`), e ela nasce presa ao conjurador, que é onde a Arte sairia
 * se a pessoa não escolhesse outro lugar depois.
 *
 * Plano nulo apaga: a caixa fechou, com conjuração ou sem.
 */
function previaNaCaixa(ctx: CtxGrid, c: any, plano: Plano | null): void {
  const svg = document.getElementById('gr-previa');
  if (!svg) return;
  const meu = ctx.tokens[c.id];
  if (!plano || !meu) { svg.innerHTML = ''; return; }
  const anc = encaixeNoCentro(meu, escalaM(ctx));
  const grau = plano.efeito
    ? (plano.escolhas['Comprimento'] ?? plano.escolhas['Área'] ?? plano.escolhas['Volume'] ?? 0)
    : 0;
  const fig = figuraDoEfeito({
    efeito: plano.efeito, grau, ancora: anc, dir: 0,
    molde: plano.molde, curvaturaGraus: plano.curvaturaGraus,
    ladoM: plano.ladoBaseM, fatias: plano.fatias,
    aberturaGraus: plano.angulo, abrirCobra: plano.abrirCobra,
  });
  svg.innerHTML = fig && fig.tipo !== 'ponto'
    ? caminhoDaFigura(fig, quadro(ctx)) + marcaEncaixe(ctx, anc) : '';
}

/** De onde saem as Artes e a Centelha de quem conjura. */
function fonteDe(ctx: CtxGrid, c: any): { fonte: any; centelha: number; comprados: Record<string, boolean> | null } {
  if (c.tipo === 'pc') {
    const f = ctx.fichas[c.personagem_id] || {};
    return { fonte: f, centelha: Number(f.centelha || 0), comprados: f.efeito || {} };
  }
  const m = MON[c.monstro_id] || {};
  return { fonte: m, centelha: Number(m.centelha || 0), comprados: null };
}

/** O caminho inteiro: escolher, posicionar, gravar e aplicar. */
export async function conjurar(ctx: CtxGrid, cid: string, palco: HTMLElement): Promise<void> {
  const c = combDe(ctx, cid);
  if (!c) return;
  const { fonte, centelha, comprados } = fonteDe(ctx, c);
  const plano = await abrirConjuracao({
    nome: c.nome, centelha, fonte, comprados,
    aoMudar: (p) => previaNaCaixa(ctx, c, p),
  });
  if (!plano) return;

  const g = plano.efeito?.grid;
  // No improviso quem decide a forma é o Volume: comprou lado da base, é a
  // manifestação em fatias, que ocupa chão; não comprou, é o Dardo, que voa e
  // acerta um alvo. As Artes que não manifestam elemento caem no Dardo também,
  // porque a fatia não quer dizer nada nelas e a geometria delas ainda não existe.
  const forma: Forma = g?.forma || (plano.ladoBaseM ? 'zona' : 'alvo');

  // A cobrança da Mana envolve todos os caminhos, e por isso está num `finally`:
  // cada forma sai por um `return` próprio, e repetir a linha em seis lugares
  // seria esquecê-la no sétimo. Quem recebe o aviso decide se cobra: desistir de
  // posicionar não gastou Mana nenhuma, e é a aba que sabe disso.
  try {
    // O Dissipar vem antes da saída de "sem representação": ele não tem chão nem
    // corpo para escolher, mas tem o que apagar, e isso é bem do tabuleiro.
    if (g?.dissipa) return await dissipar(ctx, c, plano);
    if (forma === 'nenhuma') {
      await ctx.logar(c, `${c.nome} conjurou ${plano.resumo}`, { acao: null });
      return;
    }
    if (forma === 'token') return await invocar(ctx, c, plano);
    if (forma === 'movimento') return await deslocar(ctx, c, plano, palco);
    if (forma === 'cadeia') return await encadear(ctx, c, plano, palco);
    if (forma === 'alvo') return await grudarNoAlvo(ctx, c, plano, palco);
    await marcarNoChao(ctx, c, plano, palco, forma);
  } finally {
    await ctx.gastarMana?.(c.id, plano.custo.mana);
  }
}

/**
 * O encaixe escolhido cabe no Alcance comprado? Se não, pergunta antes de seguir.
 *
 * O Alcance é do livro, e vale a pena cobrar: uma zona posta a 50 m com Alcance
 * 1 seria um efeito de graça.
 *
 * A conferência mede do CENTRO do conjurador até o encaixe escolhido, em linha,
 * que é a mesma medida que a régua mostrou na tela. Antes ela contava casas, e
 * casa é inteiro: um efeito de Alcance 4 aceitava um alvo a 4,9 m e recusava
 * outro a 4,1, dependendo de como a contagem caísse. Discordar da régua na tela
 * seria pior ainda, e é por isso que a conta mora aqui, num lugar só: a mira do
 * ponteiro e a do dedo chegam por caminhos diferentes e têm de cobrar igual.
 */
async function dentroDoAlcance(ctx: CtxGrid, meu: Hex, plano: Plano, onde: Encaixe): Promise<boolean> {
  const o = encaixeNoCentro(meu, escalaM(ctx));
  const dist = Math.hypot(onde.x - o.x, onde.y - o.y);
  if (!plano.alcanceM || dist <= plano.alcanceM + 1e-9) return true;
  return uiConfirmar(
    `${plano.nome} tem Alcance de ${plano.alcanceM} m e você apontou a ${dist.toFixed(1)} m. Conjurar assim mesmo?`,
    { titulo: 'Fora de alcance', ok: 'Conjurar' });
}

/** Aura, zona, muro, cone e linha: tudo o que ocupa chão. */
async function marcarNoChao(ctx: CtxGrid, c: any, plano: Plano, palco: HTMLElement, forma: Forma): Promise<void> {
  const meu = ctx.tokens[c.id];
  if (!meu) return uiErro('Ponha o conjurador no mapa antes: a Arte sai de onde ele está.');
  const esc_ = escalaM(ctx);
  const g = plano.efeito?.grid;

  // Escala de região cobre tudo: não há onde clicar, e perguntar seria teatro.
  if (g?.arenaInteira) {
    const e0 = encaixeNoCentro(meu, esc_);
    return await gravarEfeito(ctx, c, plano, {
      forma, figura: { tipo: 'arena', ax: e0.x, ay: e0.y, q: meu.q, r: meu.r }, alvos: [],
    });
  }

  // A figura sai do MOTOR, num lugar só: quem decide o molde é a forma que o
  // Efeito declara, e a régua é a do molde. A caixa só tem voz onde a forma
  // deixa escolher, que hoje é a `zona`. O improviso não tem molde nenhum: ele
  // tem a manifestação em fatias, e ela sempre nasce no conjurador.
  const grauTam = plano.efeito
    ? (plano.escolhas['Comprimento'] ?? plano.escolhas['Área'] ?? plano.escolhas['Volume'] ?? 0)
    : 0;
  const monta = (ancora: Encaixe, dir: number) => figuraDoEfeito({
    efeito: plano.efeito, grau: grauTam, ancora, dir,
    molde: plano.molde,
    // A barreira dobrada. Só a barreira: uma faixa de fogo curva seria uma
    // figura diferente da que foi comprada, e o livro só dá essa licença à
    // parede ("a curvatura máxima de qualquer barreira é um semicírculo").
    curvaturaGraus: forma === 'muro' ? plano.curvaturaGraus : 0,
    ladoM: plano.ladoBaseM, fatias: plano.fatias, aberturaGraus: plano.angulo,
    abrirCobra: plano.abrirCobra,
  }) || { tipo: 'ponto' as const, ax: ancora.x, ay: ancora.y, q: ancora.hex.q, r: ancora.hex.r };

  let ancora: Encaixe = encaixeNoCentro(meu, esc_);
  let dir = 0;

  // O IMPROVISO TAMBÉM ESCOLHE ONDE COMEÇA, por ora.
  //
  // A §5.4 diz que a manifestação nasce no feiticeiro e nunca é colocada, e o
  // tabuleiro obedecia isso à risca: só perguntava para onde. Em 2026-08-19 a
  // mesa pediu para experimentar o contrário, e o arco passou a poder começar em
  // qualquer lugar. É afrouxamento provisório, e o Alcance comprado continua
  // sendo conferido, então a trava não sumiu: ela virou preço.
  //
  // Por isso o improviso caiu no mesmo caminho de todo efeito de chão, logo
  // abaixo, em vez de ter um ramo só dele.

  // Girar só faz sentido em figura que tem frente. O círculo é igual para todo
  // lado, e pedir uma direção a ele seria um clique morto. Quem responde não é o
  // molde, é a FIGURA que ele montou: o Terremoto e a Explosão saem do mesmo
  // ramo do motor e só um dos dois tem para onde apontar.
  const temDirecao = monta(ancora, 0).tipo !== 'circulo';

  if (forma === 'aura') {
    // A aura nasce presa ao conjurador: não há onde clicar.
  } else if (noDedo()) {
    // No dedo os dois passos viram um só: a figura já está na tela desde o
    // primeiro instante, e posicionar e girar acontecem no mesmo gesto.
    const mirou = await mirarNoDedo(ctx, palco, meu, plano, monta, temDirecao, plano.nome);
    if (!mirou) return;
    if (!await dentroDoAlcance(ctx, meu, plano, mirou.ancora)) return;
    ancora = mirou.ancora;
    dir = mirou.dir;
  } else {
    // 1. ONDE COMEÇA. A âncora encaixa no centro da casa OU num vértice dela, o
    // que estiver mais perto do ponteiro. O vértice é o que permite pôr o
    // círculo exatamente entre quatro corpos, ou encostar a ponta da faixa na
    // quina da parede em vez de no meio do corredor.
    const escolha = await escolherNoMapa(ctx, palco, (h, ev) => {
      const e = encaixeDoPonteiro(ctx, ev, h);
      return reguaDeAlcance(ctx, meu, plano, ev)
        + caminhoDaFigura(monta(e, 0), quadro(ctx)) + marcaEncaixe(ctx, e);
    }, `Onde ${plano.nome} começa · centro ou vértice · Esc cancela`);
    if (!escolha) return;
    const alvoEnc = encaixeDoPonteiro(ctx, escolha.ev, escolha.hex);
    if (!await dentroDoAlcance(ctx, meu, plano, alvoEnc)) return;
    ancora = alvoEnc;

    // 2. PARA ONDE APONTA. O círculo não pergunta: ele é igual para todo lado, e
    // pedir uma direção a ele seria um clique morto.
    if (temDirecao) {
      const girou = await escolherNoMapa(ctx, palco, (h, ev) =>
        reguaDeAlcance(ctx, meu, plano, ev)
        + caminhoDaFigura(monta(ancora, direcaoAoPonteiro(ctx, ancora, ev)), quadro(ctx))
        + marcaEncaixe(ctx, ancora),
        `Gire ${plano.nome} e clique · Esc cancela`);
      if (!girou) return;
      dir = direcaoAoPonteiro(ctx, ancora, girou.ev);
    }
  }

  await gravarEfeito(ctx, c, plano, { forma, figura: monta(ancora, dir), alvos: [] });
}

/** Melhoria, marca e item: o efeito gruda numa peça e anda com ela. */
async function grudarNoAlvo(ctx: CtxGrid, c: any, plano: Plano, palco: HTMLElement): Promise<void> {
  const g = plano.efeito?.grid;
  const emSi = g?.alvo === 'si' || g?.ancora === 'conjurador';
  let alvoId = c.id;
  if (!emSi) {
    const escolhido = await escolherAlvoNoMapa(ctx, palco, '', `Em quem cai ${plano.nome} · Esc cancela`);
    if (!escolhido) return;
    alvoId = escolhido;
  }
  const alvo = combDe(ctx, alvoId);
  if (!alvo) return;

  // O item, quando o Efeito pega uma peça em vez do corpo.
  let item: string | null = null;
  if (g?.pegaItem) {
    const ficha = alvo.tipo === 'pc' ? ctx.fichas[alvo.personagem_id] : null;
    item = await escolherItem(alvo.nome, itensDoAlvo(ficha), `${plano.nome} · que peça?`);
    if (!item) return;
  }

  await gravarEfeito(ctx, c, plano, { forma: 'alvo', figura: null, alvos: [alvoId], item });

  // O dano imediato de quem fere na hora do golpe (Céu Aberto, Julgamento).
  if (plano.danoDados && g?.gatilho === 'imediato') await morder(ctx, ATIVOS[ATIVOS.length - 1], alvo, 'acertou');
}

/**
 * Dissipar: escolhe um efeito que já está no tabuleiro e o apaga.
 *
 * `arcano` manda comparar níveis: apaga de uma vez o que for de nível igual ou
 * menor ao investido. O que está acima aparece na lista mesmo assim, e desabilitado
 * com o motivo escrito, porque saber que não alcança é informação de jogo: o
 * feiticeiro sente o tamanho do que tem pela frente.
 */
async function dissipar(ctx: CtxGrid, c: any, plano: Plano): Promise<void> {
  const t = tickAtual(ctx);
  const vivos = ATIVOS.filter((e) => !venceu(e, t) && e.conjurador_id !== c.id);
  if (!vivos.length) {
    await ctx.logar(c, `${c.nome} conjurou ${plano.nome}, e não havia magia alheia no tabuleiro`, { acao: null });
    return;
  }
  const meu = plano.custo.total;
  const escolha = await uiEscolher(`${plano.nome} · o que desfazer`, vivos.map((e) => {
    const alcanca = (e.nivel || 1) <= meu;
    return {
      valor: alcanca ? e.id : `__alto:${e.id}`,
      rotulo: e.nome,
      nota: alcanca
        ? `nível ${e.nivel} · ${rotuloDuracao(turnosRestantes(e, t))} restantes`
        : `nível ${e.nivel} · acima dos ${meu} pontos investidos`,
      grupo: alcanca ? 'Ao seu alcance' : 'Forte demais',
    };
  }), { msg: `Você investiu ${meu} pontos: apaga o que for de nível ${meu} ou menor.` });
  if (!escolha) return;
  if (escolha.startsWith('__alto:')) {
    const alto = vivos.find((e) => e.id === escolha.slice(7));
    await ctx.logar(c, `${c.nome} tentou desfazer ${alto?.nome} e não alcançou:`
      + ` nível ${alto?.nivel} contra ${meu} pontos investidos`, { acao: null });
    return;
  }
  const alvo = vivos.find((e) => e.id === escolha);
  if (alvo) await encerrarEfeito(ctx, alvo, `desfeito por ${c.nome}`);
}

/**
 * Corrente: o raio salta de um alvo ao seguinte.
 *
 * O salto tem alcance próprio, curto ("desde que estejam a poucos passos um do
 * outro"), e por isso a cadeia é montada a partir do PRIMEIRO alvo, e não do
 * conjurador: cada elo mede do anterior. O número de elos é o parâmetro Alvos.
 * O dano cai um pouco a cada salto, que é a leitura do texto do Efeito.
 */
async function encadear(ctx: CtxGrid, c: any, plano: Plano, palco: HTMLElement): Promise<void> {
  const primeiro = await escolherAlvoNoMapa(ctx, palco, c.id, `Primeiro alvo de ${plano.nome} · Esc cancela`);
  if (!primeiro) return;
  const esc_ = escalaM(ctx);
  const SALTO_M = 3;   // "a poucos passos um do outro"
  const cadeia = [primeiro];
  let atual = ctx.tokens[primeiro];
  const max = Math.max(1, plano.alvos);
  while (cadeia.length < max && atual) {
    const proximo = Object.entries(ctx.tokens)
      .filter(([id]) => !cadeia.includes(id) && id !== c.id)
      .map(([id, t]) => ({ id, d: distanciaHex(atual!, t) * esc_ }))
      .filter((x) => x.d <= SALTO_M)
      .sort((a, b) => a.d - b.d)[0];
    if (!proximo) break;
    cadeia.push(proximo.id);
    atual = ctx.tokens[proximo.id];
  }

  await gravarEfeito(ctx, c, plano, { forma: 'cadeia', figura: null, alvos: cadeia });
  const ef = ATIVOS[ATIVOS.length - 1];
  for (let i = 0; i < cadeia.length; i++) {
    const alvo = combDe(ctx, cadeia[i]);
    if (!alvo) continue;
    // Cada salto chega mais fraco: o primeiro leva o dado cheio, e daí em diante
    // um dado a menos por elo, com o mínimo de um.
    const dados = Math.max(1, ef.dano_dados - i);
    await morder(ctx, { ...ef, dano_dados: dados, mordidos: {} }, alvo, i ? `saltou em` : 'acertou');
  }
  if (cadeia.length < max) {
    await ctx.logar(c, `${plano.nome} parou no ${cadeia.length}º alvo: não havia mais ninguém a ${SALTO_M} m`,
      { acao: null });
  }
}

/** Invocação: o Efeito vira uma peça de verdade, pelo formulário já preenchido. */
async function invocar(ctx: CtxGrid, c: any, plano: Plano): Promise<void> {
  if (!ctx.enc) return uiErro('Não há encontro ativo: a peça invocada precisa entrar na ordem de Ticks.');
  const nivel = Math.max(1, plano.efeito?.nivel || 1);
  // O bloco sugerido cresce com o nível do Efeito e com a Arte que o conjurou.
  // São palpites, e é por isso que o formulário abre aberto e editável: a mesa
  // corrige antes de confirmar, e não depois de o servo já estar lutando.
  const sugerido = {
    ...npcVazio(),
    nome: `${plano.efeito?.nome || plano.arte.nome} de ${plano.arte.nome}`,
    grupo: 'aliado' as const,
    pv: nivel * 6,
    tick: tickAtual(ctx),
    velocidade: 6,
    defesa: 4 + nivel * 2,
    defesaMental: 4 + nivel * 2,
    soak: { impacto: nivel, corte: nivel, perfuracao: nivel },
    arma: plano.arte.nome.toLowerCase(),
    dano: `${Math.max(1, nivel)}d6`,
    ataque: `${Math.max(1, nivel)}d6`,
    turnos: plano.turnos,
    notas: `Invocado por ${c.nome} · ${plano.resumo}`,
  };
  const d = await abrirNPC(`Invocar · ${plano.nome}`, sugerido, {
    avancado: true, ok: 'Invocar',
    msg: 'Os números vêm do nível do Efeito e são um palpite. Corrija o que a mesa combinou antes de confirmar.',
  });
  if (!d) return;

  const { data, error } = await ctx.SB.from('combatentes').insert({
    encontro_id: ctx.enc.id, tipo: 'custom', nome: d.nome,
    pv_max: d.pv, pv_atual: d.pv, tick: d.tick, iniciativa: 0,
    grupo: d.grupo, oculto: d.oculto, condicoes: [], notas: d.notas,
    monstro_id: d.monstro_id, energia_max: d.energia || null, energia_atual: d.energia || null,
    dados: {
      arma: d.arma, ataque: d.ataque, dano: d.dano,
      defesa: d.defesa, defesaSocial: d.defesaSocial, defesaMental: d.defesaMental,
      soak: d.soak, resistPerf: d.resistPerf, velocidade: d.velocidade,
    },
  }).select('id').limit(1);
  if (error) return uiErro('Não deu para invocar: ' + error.message);

  const novo = (data || [])[0];
  if (novo && d.turnos > 0) {
    await gravarEfeito(ctx, c, plano, {
      forma: 'token', figura: null, alvos: [novo.id], item: null, turnos: d.turnos,
    });
  }
  await ctx.logar(c, `${c.nome} invocou ${d.nome}${d.turnos ? ` por ${d.turnos} turnos` : ''} · ${plano.resumo}`,
    { acao: null });
  await ctx.recarregar();
}

/** Empurrar, arrastar, teleportar: calcula, deixa ajustar, e só então move. */
async function deslocar(ctx: CtxGrid, c: any, plano: Plano, palco: HTMLElement): Promise<void> {
  const meu = ctx.tokens[c.id];
  const esc_ = escalaM(ctx);
  const alvoId = await escolherAlvoNoMapa(ctx, palco, '', `Quem ${plano.nome} pega · Esc cancela`);
  if (!alvoId) return;
  const alvo = combDe(ctx, alvoId);
  const pos = ctx.tokens[alvoId];
  if (!alvo || !pos || !meu) return uiErro('As duas peças precisam estar no mapa.');

  // A distância sai do peso: `arcano` diz que a Arte entra no lugar dos músculos,
  // e a régua de Força já resolve quanto um corpo daquele peso voa. Sem peso
  // declarado o palpite é o de um adulto.
  const peso = Number(MON[alvo.monstro_id]?.dimensoes?.pesoKg) || pesoDoPorte(alvo) || 70;
  const nivel = Math.max(1, plano.escolhas['Força'] ?? plano.escolhas['Alcance'] ?? 1);
  const metros = Math.max(0, Math.round((nivel * 200) / Math.max(1, peso)));

  const ajustes = await abrirEmpurroes(`${plano.nome} · para onde vai`, [{
    cid: alvoId, nome: alvo.nome, peso, metros, ajustado: metros, dano: 0,
  }]);
  if (!ajustes) return;

  for (const a of ajustes) {
    const passos = Math.max(0, Math.round(a.ajustado / esc_));
    const destino = afastar(meu, pos, passos, ctx.arena.cols, ctx.arena.rows);
    if (passos > 0) {
      await ctx.SB.from('arena_tokens').upsert(
        { arena_id: ctx.arena.id, combatente_id: a.cid, q: destino.q, r: destino.r, movido_em: new Date().toISOString() },
        { onConflict: 'arena_id,combatente_id' },
      );
      ctx.tokens[a.cid] = { q: destino.q, r: destino.r };
    }
    await ctx.logar(alvo, `${c.nome} usou ${plano.nome}: ${a.nome} foi de ${nomeHex(pos.q, pos.r)} `
      + `para ${nomeHex(destino.q, destino.r)} · ${a.ajustado} m`, { acao: null });
    if (a.dano > 0) await aplicarDano(ctx, combDe(ctx, a.cid), a.dano, plano, 'colisão');
  }
  const g = plano.efeito?.grid;
  if (g?.condicao) for (const a of ajustes) await porCondicao(ctx, combDe(ctx, a.cid), g.condicao, plano.turnos);
  ctx.repintar();
}

/** Peso estimado pelo porte, quando o bloco não declara quilos. */
function pesoDoPorte(c: any): number {
  const P: Record<string, number> = {
    'Miúdo': 3, 'Pequeno': 20, 'Médio': 70, 'Grande': 250,
    'Enorme': 1200, 'Imenso': 8000, 'Colossal': 40000,
  };
  return P[MON[c.monstro_id]?.porte] || 0;
}

/** O hexágono a `passos` de distância, na reta que sai de `de` passando por `ate`. */
function afastar(de: Hex, ate: Hex, passos: number, cols: number, rows: number): Hex {
  if (passos <= 0) return ate;
  const d = distanciaHex(de, ate) || 1;
  const dq = (ate.q - de.q) / d, dr = (ate.r - de.r) / d;
  let melhor = ate;
  for (let i = 1; i <= passos; i++) {
    const h = { q: Math.round(ate.q + dq * i), r: Math.round(ate.r + dr * i) };
    const { col, row } = { col: h.q + Math.floor(h.r / 2), row: h.r };
    if (row < 0 || row >= rows || col < 0 || col >= cols) break;
    melhor = h;
  }
  return melhor;
}

// ==================================================================== gravar
async function gravarEfeito(ctx: CtxGrid, c: any, plano: Plano, extra: {
  forma: Forma; figura?: Figura | null; alvos: string[];
  item?: string | null; turnos?: number;
}): Promise<void> {
  const g = plano.efeito?.grid;
  const t = tickAtual(ctx);
  const turnos = extra.turnos ?? plano.turnos;
  const fig = extra.figura || null;
  // A lista de casas continua sendo gravada, mas como CONSEQUÊNCIA da figura, e
  // não como fonte: serve ao registro e a quem só sabe ler casas. Quem desenha e
  // quem decide o que está dentro leem a figura.
  const hexes = fig
    ? hexesDaFigura(fig, escalaM(ctx), ctx.arena.cols, ctx.arena.rows).map((h) => ({ q: h.q, r: h.r }))
    : [];
  const linha = {
    arena_id: ctx.arena.id,
    arte_id: plano.arte.id,
    efeito_id: plano.efeito?.id || null,
    conjurador_id: c.id,
    nome: plano.nome,
    // O nível efetivo: o do Efeito comprado, ou o maior parâmetro investido no
    // improviso, que é a mesma regra de gating de `arcano.composta`.
    nivel: plano.efeito?.nivel
      ?? Math.max(1, ...Object.values(plano.escolhas).map((n) => Number(n) || 0)),
    forma: extra.forma,
    molde: plano.molde,
    angulo: plano.angulo,
    figura: fig,
    hexes,
    centro: fig ? { q: fig.q, r: fig.r } : null,
    raio_m: fig?.raioM ?? null,
    dano_dados: plano.danoDados,
    dano_bonus: plano.danoBonus,
    condicao: g?.condicao || null,
    elemento: plano.arte.grid.elemento,
    materia: g?.materia || null,
    gatilho: g?.gatilho || 'imediato',
    alvos: extra.alvos,
    item: extra.item || null,
    desde_tick: t,
    // Sem Duração o efeito acontece e acaba: um turno é o mínimo para ele ser
    // visto no tabuleiro antes de sumir.
    ate_tick: t + Math.max(1, turnos) * TICKS_POR_TURNO,
    mordidos: {},
    oculto: !!c.oculto,
  };
  const { data, error } = await ctx.SB.from('arena_efeitos').insert(linha).select('*').limit(1);
  if (error) {
    return uiErro(/arena_efeitos|figura/i.test(error.message)
      ? 'A tabela das Artes está desatualizada. Rode supabase/migracao-19.sql no SQL Editor.'
      : 'Erro ao gravar o efeito: ' + error.message);
  }
  ATIVOS.push({ ...(data || [])[0], mordidos: {} } as EfeitoAtivo);

  // A condição entra já em quem foi marcado de saída (melhoria e marca).
  if (g?.condicao) for (const id of extra.alvos) await porCondicao(ctx, combDe(ctx, id), g.condicao, turnos);

  await ctx.logar(c, `${c.nome} conjurou ${plano.resumo}`
    + (fig && fig.tipo !== 'arena' ? ` a partir de ${nomeHex(fig.q, fig.r)}` : '')
    + (extra.item ? ` · ${extra.item}` : ''), { acao: null });
  ctx.repintar();
}

// =================================================================== condições
/**
 * Escreve a condição no combatente, com validade.
 *
 * O `ate` viaja junto da condição porque quem a tira é o relógio, e não quem a
 * pôs: o rastreador já soma condições sem saber de onde vieram, e assim a
 * penalidade do Sopro do Norte vale na aba Combate sem nenhuma linha nova lá.
 */
async function porCondicao(ctx: CtxGrid, c: any, id: string, turnos: number): Promise<void> {
  if (!c || !id) return;
  const ate = tickAtual(ctx) + Math.max(1, turnos) * TICKS_POR_TURNO;
  const atuais = (c.condicoes || []).filter((k: any) => k.id !== id);
  const nova = { id, ate, porArte: true };
  const { error } = await ctx.SB.from('combatentes').update({ condicoes: [...atuais, nova] }).eq('id', c.id);
  if (error) return;
  c.condicoes = [...atuais, nova];
}

async function tirarCondicao(ctx: CtxGrid, c: any, id: string): Promise<void> {
  if (!c || !id) return;
  const restam = (c.condicoes || []).filter((k: any) => k.id !== id);
  if (restam.length === (c.condicoes || []).length) return;
  await ctx.SB.from('combatentes').update({ condicoes: restam }).eq('id', c.id);
  c.condicoes = restam;
}

// ============================================================ sair da área
//
// A área não se esquiva nem se bloqueia: ela se abandona. Contra um efeito que
// ocupa chão não há número de Defesa a opor, e o tabuleiro já fazia essa parte
// sozinho (a mordida nunca rolou acerto). O que faltava era a saída, e ela é a
// única coisa do sistema que se faz FORA da própria vez: custa 1 Tick por metro
// que falte para o corpo ficar fora, e esses Ticks empurram para frente a
// próxima ação de quem se desvia.
//
// O tabuleiro é justamente onde essa regra deixa de ser conversa: os metros até
// a borda são MEDIDOS na figura, e não estimados de olho, e a Dificuldade sai
// deles. Quem está na borda paga 1 m; quem está no núcleo de uma Explosão de
// 8 m paga 4, e aí a própria tabela já diz que a jogada certa é ficar quieto.

/** As formas que ocupam chão: só delas se sai andando. */
const OCUPA_CHAO = new Set<Forma>(['zona', 'aura', 'muro', 'cone', 'linha']);

/** Quantos metros faltam para este alvo sair deste efeito. */
function metrosDeSaida(ctx: CtxGrid, ef: EfeitoAtivo, alvo: any): number {
  const t = ctx.tokens[alvo.id];
  if (!t) return Infinity;
  const esc = escalaM(ctx);
  const f = vigente(ctx, ef).figura;
  if (f && f.tipo) return metrosParaSair(f, centroEmMetros(t, esc));
  return metrosParaSairDosHexes(ef.hexes || [], t, esc);
}

/** Destreza + Esquiva de quem tenta sair: da ficha no PC, da Defesa na criatura. */
function desEsqDe(ctx: CtxGrid, alvo: any): { soma: number; nota: string } {
  if (alvo.tipo === 'pc') {
    const f = ctx.fichas[alvo.personagem_id] || {};
    const des = Number(f.attrs?.destreza || 0), esq = Number(f.skills?.esquiva || 0);
    return { soma: des + esq, nota: `Destreza ${des} + Esquiva ${esq}` };
  }
  const m = MON[alvo.monstro_id] || {};
  const soma = desEsqDaDefesa(Number(m.combate?.defesa || 0), Number(m.centelha || 0));
  return { soma, nota: `Destreza + Esquiva ${soma}, tirados da Defesa ${m.combate?.defesa ?? 0}` };
}

/** Virtude + Atributo de quem escolhe ficar parado, nos dois pares do capítulo III. */
function paresDeCoragem(ctx: CtxGrid, alvo: any): { chave: string; rotulo: string; soma: number }[] {
  const f = alvo.tipo === 'pc' ? (ctx.fichas[alvo.personagem_id] || {}) : null;
  const m = f ? null : (MON[alvo.monstro_id] || {});
  const v = (f?.virtues || m?.virtudes || {}) as Record<string, number>;
  const a = (f?.attrs || m?.atributos || {}) as Record<string, number>;
  return [
    { chave: 'valor', rotulo: 'Bravura + Vigor', soma: Number(v.valor || 0) + Number(a.vigor || 0) },
    { chave: 'temperanca', rotulo: 'Temperança + Raciocínio', soma: Number(v.temperanca || 0) + Number(a.raciocinio || 0) },
  ];
}

/**
 * Rola um pool do sistema e devolve o total já com o +2 do ímpar e o bônus.
 *
 * `pool` recebe Atributo e Habilidade separados; aqui a soma já chega pronta,
 * então o segundo vai zerado. É a mesma conta da ficha, e é de propósito: o
 * tabuleiro não tem régua própria de dados.
 */
function rolarPool(soma: number, bonus = 0): { total: number; nota: string } {
  const p = pool(soma, 0);
  const r = rolar(p.dados);
  const total = r.total + p.bonus + bonus;
  return {
    total,
    nota: `[${r.dados.join('+') || '0'}]${p.bonus ? ` +${p.bonus}` : ''}${bonus ? ` +${bonus}` : ''} = ${total}`,
  };
}

/** Os Ticks do desvio empurram para frente a próxima ação de quem se moveu. */
async function pagarTicks(ctx: CtxGrid, alvo: any, quantos: number): Promise<void> {
  if (!quantos) return;
  const antes = Number(alvo.tick ?? 0);
  const novo = antes + quantos;
  alvo.tick = novo;
  await ctx.SB.from('combatentes').update({ tick: novo }).eq('id', alvo.id);
}

/**
 * A caixa da saída, aberta antes de cada mordida de efeito que ocupa chão.
 *
 * Devolve o FATOR do dano: 1 inteiro, 0,5 metade, 0 nada. O mestre pode fechar a
 * caixa, e fechar é comer inteiro, que é o que acontece com quem não reage.
 */
async function oferecerSaida(ctx: CtxGrid, ef: EfeitoAtivo, alvo: any): Promise<number> {
  const crus = metrosDeSaida(ctx, ef, alvo);
  if (!isFinite(crus)) {
    await ctx.logar(alvo, `${alvo.nome} não tem para onde sair de ${ef.nome}: come inteiro`, { acao: null });
    return 1;
  }
  const d: Desvio = desvioDaArea(crus);
  const { soma, nota } = desEsqDe(ctx, alvo);
  const p = pool(soma, 0);
  const coragem = paresDeCoragem(ctx, alvo);
  const dado = (s: number, b = 0) => `${Math.floor(s / 2)}d6${s % 2 ? '+2' : ''}${b ? ` +${b}` : ''}`;

  const escolha = await uiEscolher(`Sair da área · ${alvo.nome}`, [
    { valor: 'sair', rotulo: `Tentar sair · ${dado(soma)}`, nota, grupo: 'Tentar sair' },
    { valor: 'sair2', rotulo: `Tentar sair, identificou o efeito · ${dado(soma, 2)}`, nota: '+2 por ter lido o sinal', grupo: 'Tentar sair' },
    { valor: 'sair4', rotulo: `Tentar sair, identificou com Margem · ${dado(soma, 4)}`, nota: '+4 por ter lido o sinal com folga', grupo: 'Tentar sair' },
    ...coragem.map((c) => ({
      valor: `parado:${c.chave}`,
      rotulo: `Ficar parado · ${c.rotulo} · ${dado(c.soma)}`,
      nota: `Dif ${d.difMetade}. Passando, aguenta no lugar e come inteiro sem gastar Tick; falhando, o corpo sai sozinho`,
      grupo: 'Ficar parado',
    })),
    { valor: 'inteiro', rotulo: 'Não reage: come o dano inteiro', grupo: 'Nem uma coisa nem outra' },
  ], {
    msg: `${ef.nome} pega ${alvo.nome}. A borda mais próxima está a ${crus.toFixed(1)} m, `
      + `então sair custa ${d.ticks} Tick${d.ticks > 1 ? 's' : ''}, que empurram a próxima ação dele.\n`
      + `Uma jogada só, lida contra os dois patamares: ${d.difMetade} para metade do dano, `
      + `${d.difNada} para dano nenhum. Os Ticks são gastos passando ou falhando.`,
  });

  if (!escolha || escolha === 'inteiro') return 1;

  // Ficar parado: coragem contra a mesma Dificuldade da linha "metade". Passando,
  // aguenta no lugar e ainda come inteiro, porque ficar parado nunca reduz o que
  // a área faz: só evita o risco e o custo de tentar sair.
  if (escolha.startsWith('parado:')) {
    const c = coragem.find((x) => x.chave === escolha.slice(7))!;
    const r = rolarPool(c.soma);
    if (r.total > d.difMetade) {
      await ctx.logar(alvo, `${alvo.nome} ficou parado em ${ef.nome} e aguentou · ${c.rotulo} ${r.nota} vs ${d.difMetade}`
        + ' · sofre o dano inteiro, sem gastar Tick', { acao: null });
      return 1;
    }
    await ctx.logar(alvo, `${alvo.nome} não aguentou ficar parado em ${ef.nome} · ${c.rotulo} ${r.nota} vs ${d.difMetade}`
      + ' · o corpo sai sozinho, e vira desvio', { acao: null });
  }

  const bonus = escolha === 'sair2' ? 2 : escolha === 'sair4' ? 4 : 0;
  const r = rolarPool(soma, bonus);
  await pagarTicks(ctx, alvo, d.ticks);
  const fator = r.total > d.difNada ? 0 : r.total > d.difMetade ? 0.5 : 1;
  const veredito = fator === 0 ? 'saiu inteiro, sem sofrer nada'
    : fator === 0.5 ? 'saiu pela metade, e sofre metade' : 'não conseguiu sair, e come inteiro';
  await ctx.logar(alvo, `${alvo.nome} tentou sair de ${ef.nome} (${d.metros} m, ${d.ticks} Ticks)`
    + ` · ${r.nota} vs ${d.difMetade}/${d.difNada} · ${veredito}`, { acao: null });
  if (fator === 0) {
    // Ninguém sofreu, mas a mordida ACONTECEU: sem a marca, o mesmo efeito
    // tentaria pegar o alvo de novo na mesma rodada, e a saída viraria um teste
    // que se repete até passar.
    const t = tickAtual(ctx);
    ef.mordidos = { ...(ef.mordidos || {}), [alvo.id]: rodadaDoTick(t) };
    await ctx.SB.from('arena_efeitos').update({ mordidos: ef.mordidos }).eq('id', ef.id);
  }
  return fator;
}

/** A mordida de um efeito de chão, com a saída oferecida antes. */
async function morderComSaida(ctx: CtxGrid, ef: EfeitoAtivo, alvo: any, verbo: string): Promise<void> {
  if (!OCUPA_CHAO.has(ef.forma as Forma)) return morder(ctx, ef, alvo, verbo);
  const fator = await oferecerSaida(ctx, ef, alvo);
  if (fator <= 0) return;
  await morder(ctx, ef, alvo, verbo, fator);
}

// ==================================================================== a mordida
/** A absorção do alvo, no tipo que o efeito usa. */
function soakDe(ctx: CtxGrid, c: any, materia: string | null) {
  const r = ctx.resumo[c.id];
  const cd = somarCondicoes((c.condicoes || []).map((k: any) => ({ ...((COND as any)[k.id] || {}), ...k })));
  const chave = materia === 'perfuracao' ? 'perfuracao' : materia === 'corte' ? 'corte' : 'impacto';
  const armadura = materia ? (r?.soak?.[chave] ?? 0) + (cd.soak || 0) : 0;
  return { armadura, natural: 0 };
}

/** Rola o dano do efeito num alvo, desconta o que tem de descontar e grava. */
/**
 * A marca elemental no alvo de um Efeito.
 *
 * A direção sai do CONJURADOR para o alvo quando os dois estão no mapa. Quando
 * não estão (efeito sem dono no tabuleiro, ou dano de zona em quem entrou
 * sozinho), fica em zero: o estouro elemental é radial e não depende de eixo, ao
 * contrário do corte e da lança, então zero não mente sobre nada.
 */
function marcarGolpeElemental(ctx: CtxGrid, ef: EfeitoAtivo, alvo: any): void {
  if (!ehElemental(ef.elemento)) return;
  const t = ctx.tokens[alvo?.id];
  if (!t) return;
  const mg = margemDe(ctx);
  const c = centroHex(t.q, t.r, ctx.raio);
  const p = { x: c.x + mg.x, y: c.y + mg.y };
  const dono = ctx.tokens[ef.conjurador_id || ''];
  let dir = 0;
  if (dono) {
    const d = centroHex(dono.q, dono.r, ctx.raio);
    dir = Math.atan2(p.y - (d.y + mg.y), p.x - (d.x + mg.x));
  }
  baterNoAlvo(camadaDeGolpes(), p, ef.elemento, dir, ctx.raio);
}

async function morder(ctx: CtxGrid, ef: EfeitoAtivo, alvo: any, verbo: string, fator = 1): Promise<void> {
  if (!ef || !alvo) return;
  const rolagem = rolar(ef.dano_dados);
  // A metade do desvio incide no BRUTO, antes da Absorção: quem se jogou para
  // fora pegou menos fogo, e a armadura continua fazendo o serviço dela sobre o
  // que chegou. Arredonda para cima, como o livro manda.
  const bruto = Math.ceil((rolagem.total + (ef.dano_bonus || 0)) * fator);
  const m = MON[alvo.monstro_id] || {};
  const s = soakDe(ctx, alvo, ef.materia);
  const golpe = danoNoAlvo({
    bruto, elemento: ef.elemento, materia: ef.materia,
    soakArmadura: s.armadura, soakNatural: s.natural,
    fraquezas: m.fraquezas || [], resistencias: m.resistencias || [],
  });
  const pv = Math.max(0, (alvo.pv_atual ?? 0) - golpe.liquido);
  const { error } = await ctx.SB.from('combatentes').update({ pv_atual: pv }).eq('id', alvo.id);
  if (error) return uiErro('Erro ao aplicar o dano: ' + error.message);
  alvo.pv_atual = pv;

  const marcaTurno = { ...(ef.mordidos || {}), [alvo.id]: rodadaDoTick(tickAtual(ctx)) };
  ef.mordidos = marcaTurno;
  await ctx.SB.from('arena_efeitos').update({ mordidos: marcaTurno }).eq('id', ef.id);

  // O estouro na cor do elemento, no corpo de quem levou.
  //
  // Ele sai do MESMO lugar de onde saiu a mordida, e não da conjuração: uma zona
  // de fogo que morde três pessoas em turnos diferentes tem de acender três
  // vezes, cada uma no seu instante. É o que separa "a poça existe" de "a poça
  // pegou você".
  marcarGolpeElemental(ctx, ef, alvo);

  if (ef.condicao) await porCondicao(ctx, alvo, ef.condicao, turnosRestantes(ef, tickAtual(ctx)));
  const est = alvo.pv_max ? ` · ${pv}/${alvo.pv_max} (${tierDe(pv, alvo.pv_max).estado})` : '';
  await ctx.logar(alvo, `${ef.nome} ${verbo} ${alvo.nome}: ${golpe.liquido} de dano`
    + ` [${rolagem.dados.join('+')}${ef.dano_bonus ? `+${ef.dano_bonus}` : ''} · ${golpe.nota}]`
    + (golpe.agravado ? ' · AGRAVADO' : '') + est, { acao: null });
}

/** Dano avulso (colisão do empurrão), pelas mesmas contas. */
async function aplicarDano(ctx: CtxGrid, alvo: any, bruto: number, plano: Plano, motivo: string): Promise<void> {
  if (!alvo) return;
  const g = plano.efeito?.grid;
  const m = MON[alvo.monstro_id] || {};
  const s = soakDe(ctx, alvo, g?.materia || 'impacto');
  const golpe = danoNoAlvo({
    bruto, elemento: plano.arte.grid.elemento, materia: g?.materia || 'impacto',
    soakArmadura: s.armadura, soakNatural: s.natural,
    fraquezas: m.fraquezas || [], resistencias: m.resistencias || [],
  });
  const pv = Math.max(0, (alvo.pv_atual ?? 0) - golpe.liquido);
  await ctx.SB.from('combatentes').update({ pv_atual: pv }).eq('id', alvo.id);
  alvo.pv_atual = pv;
  await ctx.logar(alvo, `${alvo.nome} sofreu ${golpe.liquido} de dano por ${motivo} [${golpe.nota}]`, { acao: null });
}

// ============================================================ o relógio anda
/**
 * Passou o tempo: cobra quem está dentro, e tira o que venceu.
 *
 * Chamada depois de qualquer coisa que mexa no relógio ou nas posições. A
 * mordida NÃO é automática: a caixa lista quem está pego e o mestre confirma,
 * que é o mesmo contrato do resto da aba (o acerto e o dano também passam por
 * ele). O que o tabuleiro faz sozinho é lembrar, contar e propor.
 */
export async function verificarEfeitos(ctx: CtxGrid, palco?: HTMLElement): Promise<void> {
  const t = tickAtual(ctx);

  // A repintura ESTREITA, com o `repintar()` cheio como rede: só as camadas que
  // as Artes mexem. Ver o comentário de `repintarEfeitos` em `CtxGrid`.
  const repintarSoEfeitos = () => (ctx.repintarEfeitos ? ctx.repintarEfeitos() : ctx.repintar());

  // 1. o que venceu sai de cena, e leva a condição junto
  for (const ef of ATIVOS.filter((e) => venceu(e, t))) await encerrarEfeito(ctx, ef, 'venceu o prazo');

  // Chão limpo: não há aura para reposicionar, prazo para contar nem mordida
  // para conferir, e quem chamou já pintou o que mexeu. (Se alguma coisa acabou
  // de vencer, `encerrarEfeito` já passou por `ctx.recarregar()`, que redesenha
  // a tela inteira.) Esta linha é a que corta pela metade o custo de mover uma
  // peça numa mesa sem Arte no chão, que é a mesa da maior parte do tempo.
  if (!ATIVOS.length) return;

  // 2. quem está pego e ainda não sofreu a mordida nesta rodada
  const pendentes: { ef: EfeitoAtivo; alvo: any }[] = [];
  for (const ef of ATIVOS) {
    if (!ef.dano_dados && !ef.condicao) continue;
    if (ef.gatilho === 'armadilha' || ef.gatilho === 'passivo' || ef.gatilho === 'ao-tocar') continue;
    const dentro = ef.forma === 'alvo' || ef.forma === 'token'
      ? (ef.alvos || []) : dentroDoEfeito(vigente(ctx, ef), ctx.tokens, escalaM(ctx));
    for (const cid of dentro) {
      if (cid === ef.conjurador_id && ef.forma === 'aura') continue;   // a própria aura não queima o dono
      if (jaMordido(ef, cid, t)) continue;
      const alvo = combDe(ctx, cid);
      if (alvo) pendentes.push({ ef, alvo });
    }
  }
  // Há efeito no chão, mas ninguém novo foi pego. Ainda assim é preciso
  // redesenhar: a aura anda com quem a conjurou, e o fogo e a luz abrem a névoa
  // por onde passam. O que NÃO é preciso é refazer as peças, a fila e o
  // registro, que ninguém tocou.
  if (!pendentes.length) { repintarSoEfeitos(); return; }

  const escolha = await uiEscolher('Efeitos pegando alguém', [
    ...pendentes.map((p, i) => ({
      valor: String(i),
      rotulo: `${p.alvo.nome} · ${p.ef.nome}`,
      nota: [p.ef.dano_dados ? `${p.ef.dano_dados}d6` : '',
        p.ef.condicao && CONDICAO[p.ef.condicao] ? CONDICAO[p.ef.condicao].nome : '',
        `${turnosRestantes(p.ef, t)} turnos`].filter(Boolean).join(' · '),
      grupo: 'Confirmar a mordida',
    })),
    { valor: '__todos', rotulo: 'Cobrar todos de uma vez', grupo: 'Confirmar a mordida' },
  ], { msg: 'Cada criatura sofre um mesmo efeito no máximo uma vez por turno.' });

  // Fechou a caixa sem cobrar nada: mesma história do caso acima.
  if (!escolha) { repintarSoEfeitos(); return; }
  const alvos = escolha === '__todos' ? pendentes : [pendentes[Number(escolha)]];
  for (const p of alvos) {
    if (p.ef.dano_dados) await morderComSaida(ctx, p.ef, p.alvo, 'pegou');
    else if (p.ef.condicao) {
      await porCondicao(ctx, p.alvo, p.ef.condicao, turnosRestantes(p.ef, t));
      p.ef.mordidos = { ...(p.ef.mordidos || {}), [p.alvo.id]: rodadaDoTick(t) };
      await ctx.SB.from('arena_efeitos').update({ mordidos: p.ef.mordidos }).eq('id', p.ef.id);
      await ctx.logar(p.alvo, `${p.ef.nome} pegou ${p.alvo.nome}: ${CONDICAO[p.ef.condicao]?.nome || p.ef.condicao}`,
        { acao: null });
    }
  }
  ctx.repintar();
}

/** Tira o efeito do tabuleiro: a linha, a condição que ele pôs e a peça invocada. */
export async function encerrarEfeito(ctx: CtxGrid, ef: EfeitoAtivo, motivo: string): Promise<void> {
  if (ef.condicao) {
    const quem = ef.forma === 'alvo' || ef.forma === 'token'
      ? (ef.alvos || []) : dentroDoEfeito(vigente(ctx, ef), ctx.tokens, escalaM(ctx));
    for (const cid of quem) await tirarCondicao(ctx, combDe(ctx, cid), ef.condicao);
  }
  // A peça invocada some com o efeito que a trouxe.
  if (ef.forma === 'token') {
    for (const cid of ef.alvos || []) {
      await ctx.SB.from('combatentes').update({ ativo: false }).eq('id', cid);
    }
  }
  await ctx.SB.from('arena_efeitos').delete().eq('id', ef.id);
  ATIVOS = ATIVOS.filter((e) => e.id !== ef.id);
  const c = ef.conjurador_id ? combDe(ctx, ef.conjurador_id) : null;
  await ctx.logar(c, `${ef.nome} acabou (${motivo})`, { acao: null });
  await ctx.recarregar();
}

// ============================================================ o botão e o dial
/**
 * Liga o botão dos efeitos e o painel de ajuste.
 *
 * O botão troca de ícone (✦ ligado, ✧ desligado) porque é o estado que a pessoa
 * procura de relance. O ⚙ abre um painel pequeno com o que dá para regular; cada
 * mexida repinta na hora, senão ajustar opacidade viraria adivinhação.
 */
export function ligarBotaoFx(ctx: () => CtxGrid, botao: HTMLElement, engrenagem: HTMLElement): void {
  const pinta = () => {
    botao.textContent = FX.ligado ? '✦ efeitos' : '✧ efeitos';
    botao.classList.toggle('desligado', !FX.ligado);
    botao.title = FX.ligado
      ? 'Efeitos elementais ligados · clique para desligar'
      : 'Efeitos elementais desligados · clique para ligar';
    engrenagem.hidden = !FX.ligado;
  };
  pinta();
  botao.onclick = () => { definirFx({ ligado: !FX.ligado }); pinta(); ctx().repintar(); };
  engrenagem.onclick = () => abrirAjustesFx(() => { pinta(); ctx().repintar(); });
}

function abrirAjustesFx(mudou: () => void): void {
  const { corpo, fechar } = uiPainel('Efeitos elementais', { classe: 'ui-dlg-arte' });
  const barra = (chave: keyof Ajustes, rotulo: string, nota: string, passo = 1) => {
    const l = (LIMITES as any)[chave];
    return `<label class="ag-f ag-f-full"><span>${rotulo} <b data-v="${chave}">${FX[chave]}</b>${
      chave === 'particulas' ? '' : chave === 'velocidade' ? '%' : '%'}</span>
      <input type="range" data-fx="${chave}" min="${l.min}" max="${l.max}" step="${passo}"
        value="${FX[chave]}" />
      <small class="ag-nota">${nota}</small></label>`;
  };
  corpo.innerHTML = `
    <p class="ag-nota">Só as oito Artes elementais têm efeito. As universais ficam com a figura
      lisa: não há um "como isso é" acordado para elas, e inventar seria pior do que não ter.</p>
    ${barra('opacidade', 'Opacidade do miolo', 'Quanto o elemento cobre o mapa por baixo dele.')}
    ${barra('particulas', 'Partículas', 'Brasas, faíscas, bolhas. Zero deixa só a textura e a borda.')}
    ${barra('velocidade', 'Ritmo', 'A velocidade do laço. 100% é o desenhado.', 5)}
    <div class="ag-acoes">
      <button type="button" class="btn" id="fx-padrao">Voltar ao padrão</button>
      <button type="button" class="btn primary" id="fx-ok">Pronto</button>
    </div>`;
  const sincroniza = () => {
    corpo.querySelectorAll<HTMLElement>('[data-v]').forEach((b) => {
      b.textContent = String(FX[b.dataset.v as keyof Ajustes]);
    });
    corpo.querySelectorAll<HTMLInputElement>('[data-fx]').forEach((i) => {
      i.value = String(FX[i.dataset.fx as keyof Ajustes]);
    });
  };
  corpo.querySelectorAll<HTMLInputElement>('[data-fx]').forEach((i) => {
    i.oninput = () => {
      definirFx({ [i.dataset.fx!]: Number(i.value) } as Partial<Ajustes>);
      sincroniza(); mudou();
    };
  });
  (corpo.querySelector('#fx-padrao') as HTMLElement).onclick = () => {
    definirFx({ ...AJUSTES_PADRAO, ligado: FX.ligado }); sincroniza(); mudou();
  };
  (corpo.querySelector('#fx-ok') as HTMLElement).onclick = fechar;
}

// ==================================================================== o + NPC
/** O botão + NPC, agora com ficha avançada. */
export async function novoNPC(ctx: CtxGrid): Promise<void> {
  if (!ctx.enc) return uiErro('Não há combate em andamento. O tabuleiro puxa quem está no encontro ativo.');
  const d = await abrirNPC('NPC da cena', {}, {
    msg: 'Vale só para este combate: não entra no compêndio nem no bestiário.',
  });
  if (!d) return;
  const { error } = await ctx.SB.from('combatentes').insert({
    encontro_id: ctx.enc.id, tipo: 'custom', nome: d.nome,
    pv_max: d.pv, pv_atual: d.pv, tick: d.tick, iniciativa: 0,
    grupo: d.grupo, oculto: d.oculto, condicoes: [], notas: d.notas,
    monstro_id: d.monstro_id, energia_max: d.energia || null, energia_atual: d.energia || null,
    dados: {
      arma: d.arma, ataque: d.ataque, dano: d.dano,
      defesa: d.defesa, defesaSocial: d.defesaSocial, defesaMental: d.defesaMental,
      soak: d.soak, resistPerf: d.resistPerf, velocidade: d.velocidade,
    },
  });
  if (error) return uiErro('Erro: ' + error.message);
  await ctx.recarregar();
}
